#!/usr/bin/env python3
"""Ep1 v3.3 takes (script draft 8.2, the polish round): what to read, what to cut and re-stage, and the lines files.

  python3 audio/ep01/v33/takes.py plan                                  -> audio/ep01/v33/<seg>/lines-in.json (fastrec input)
  bash    ops/heavy.sh bash audio/ep01/v33/record.sh act4               -> fastrec into audio/ep01/v33/act4/ (--workers 2)
  audio/.venv-casting/bin/python audio/ep01/v33/takes.py cut            -> the cut + re-staged take
  python3 audio/ep01/v33/takes.py assemble                              -> audio/ep01/v33/<seg>/lines-v33.json

What (the v3.3 plans' `take` fields; script-v33-notes §5):
  - READ (1): v33-a4-0001, the tiled employee (S4: "Everyone's packed…", moved from Tasya). Speaker, speed and device
    come from her own take a5-27-18 ("Is this a coup?"): the existing voice, never a clone of anyone.
  - CUT + TV (1): v33-a4-0002, Tasya's "We are below them, above them, around them." cut from v3-a4-0003 (words 10-17,
    at the sentence boundary, 12 ms fades, room-tone handles to 0.35 s), then fastrec's `tv` chain (the bullpen TV's
    small speaker), levelled to -16 LUFS like the v3.2 re-stages.
  - No V.O. takes: V1 and V2 restore the v3 takes v3-vo-09 and v3-vo-12 unchanged (the plans carry their paths).
"""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v33')
BP = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v33')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TAKE_FILES = ['audio/ep01/act4/dialogue/lines-v5.json'] + \
             [f'audio/ep01/v3/{s}/lines-v3.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')] + \
             [f'audio/ep01/v31/{s}/lines-v31.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')] + \
             [f'audio/ep01/v32/{s}/lines-v32.json' for s in ('act1', 'act2', 'act3', 'act4')]

M = '[Mas](/mˈɑs/)'
# id -> (reference take, spoken_as)
READ = {
    'v33-a4-0001': ('a5-27-18', f"Everyone's packed.{{0.3}} Whatever happens to this place, {M}, don't worry about us."),
}
# id -> (source take, first word index, last word index, device chain for the re-stage)
CUT_TV = {
    'v33-a4-0002': ('v3-a4-0003', 10, 17, 'tv'),
}
HANDLE, FADE = 0.35, 0.012


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def rows():
    out = {}
    for f in TAKE_FILES:
        if os.path.exists(os.path.join(ROOT, f)):
            for r in jl(f):
                out[r['id']] = r
    return out


def wanted():
    for seg in SEGS:
        p = os.path.join(BP, f'{seg}.json')
        if not os.path.exists(p):
            continue
        for b in jl(p)['beats']:
            for l in b.get('lines', []):
                if l.get('new'):
                    yield seg, b['id'], l


def plan():
    R = rows()
    per = {}
    for seg, bid, w in wanted():
        wid = w['id']
        if wid not in READ:
            continue
        ref_id, say = READ[wid]
        ref = R[ref_id]
        row = {'id': wid, 'scene': bid.split('.')[0].lstrip('S') or bid, 'speaker': ref['speaker'],
               'speaker_slug': ref.get('speaker_slug'), 'text': w['text'], 'spoken_as': say, 'delivery': w.get('delivery'),
               'tag': w.get('note') or '[INVENTED]', 'mode': 'on-mic', 'on_camera': 'on',  # in the room (S7.02), not on a screen
               'kind': 'dialogue', 'side': 'none', 'shot': bid, 'status': 'fast', 'speed': ref['pace']['speed'],
               'device': ref.get('device'), 'ref_take': ref_id}
        if not row['device']:
            row.pop('device')
        per.setdefault(seg, []).append(row)
    for seg, rs in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        json.dump(rs, open(os.path.join(HERE, seg, 'lines-in.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v33/{seg}/lines-in.json: {len(rs)} to read ({", ".join(r["id"] for r in rs)})')


def cut():
    import numpy as np
    import soundfile as sf
    sys.path.insert(0, os.path.join(ROOT, 'audio/ep01/act4/dialogue/tools/fastrec'))
    import house
    R = rows()
    seg_of = {w['id']: seg for seg, _, w in wanted()}
    for cid, (src, i0, i1, dev) in CUT_TV.items():
        r = R[src]
        x, sr = sf.read(os.path.join(ROOT, r['file']), always_2d=True, dtype='float64')
        W = r['words']
        prev_t1 = W[i0 - 1]['t1'] if i0 > 0 else None
        next_t0 = W[i1 + 1]['t0'] if i1 + 1 < len(W) else None
        a = W[i0]['t0'] - HANDLE if prev_t1 is None else max((prev_t1 + W[i0]['t0']) / 2, W[i0]['t0'] - HANDLE)
        e = r['pace']['audible_out_s'] + 0.1 if next_t0 is None else min((W[i1]['t1'] + next_t0) / 2, W[i1]['t1'] + HANDLE)
        a, e = max(0.0, a), min(len(x) / sr, e)
        seg = x[int(a * sr):int(e * sr)].copy()
        k = int(FADE * sr)
        seg[:k] *= np.linspace(0, 1, k)[:, None]
        seg[-k:] *= np.linspace(1, 0, k)[:, None]
        tone = x[:int(0.25 * sr)].copy()
        pre = max(0.0, HANDLE - (W[i0]['t0'] - a))
        post = max(0.0, HANDLE - (e - W[i1]['t1']))
        pad = lambda s: np.concatenate([tone] * (int(s * sr) // len(tone) + 1))[:int(s * sr)]
        y = np.concatenate([pad(pre), seg, pad(post)])
        mono = y.mean(axis=1).astype(np.float32)
        wet = house.L.V.apply_chain(mono, sr, house.DEVICES[dev]()).astype(np.float32)
        wet = house.L.V.normalise(wet, target=-16.0).astype(np.float32)
        seg_name = seg_of[cid]
        out = os.path.join(HERE, seg_name, 'wav', f'{cid}.wav')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sf.write(out, wet, sr, subtype='PCM_24')
        off = pre - a
        words = [dict(w, t0=round(w['t0'] + off, 3), t1=round(w['t1'] + off, 3)) for w in W[i0:i1 + 1]]
        new = {k2: v for k2, v in r.items() if k2 not in ('mouth', 'alt_takes', 'mp3', 'clean', 'complete')}
        new.update(id=cid, file=os.path.relpath(out, ROOT), duration_s=round(len(wet) / sr, 3), words=words,
                   text=' '.join(w['w'] for w in W[i0:i1 + 1]), device=dev,
                   cut_from=f'{src} words {i0}-{i1} ({r["file"]}, {a:.3f}-{e:.3f} s), 12 ms fades, room-tone handles to {HANDLE} s; '
                            f'then fastrec\'s {dev} chain, -16 LUFS')
        new['pace'] = dict(r['pace'], audible_in_s=round(words[0]['t0'] - 0.02, 3),
                           audible_out_s=round(min(len(wet) / sr, words[-1]['t1'] + 0.08), 3))
        json.dump(new, open(os.path.join(HERE, seg_name, 'wav', f'{cid}.cut.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'{new["file"]}: {new["text"]!r} ({len(wet) / sr:.2f} s) from {src}, {dev} chain')


def assemble():
    per = {}
    for seg, bid, w in wanted():
        per.setdefault(seg, []).append(w['id'])
    for seg, ids in per.items():
        d = os.path.join(HERE, seg)
        rec = {r['id']: r for r in jl(os.path.join(d, 'lines.json'))} if os.path.exists(os.path.join(d, 'lines.json')) else {}
        out = []
        for i in ids:
            if i in rec:
                out.append(rec[i])
            elif i in CUT_TV:
                out.append(jl(os.path.join(d, 'wav', f'{i}.cut.json')))
            else:
                print(f'  ! {seg}: {i} has no take')
        json.dump(out, open(os.path.join(d, 'lines-v33.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v33/{seg}/lines-v33.json: {len(out)} takes')


if __name__ == '__main__':
    {'plan': plan, 'cut': cut, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
