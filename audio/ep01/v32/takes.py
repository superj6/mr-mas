#!/usr/bin/env python3
"""Ep1 v3.2 takes (the v3.2 lock, pass v3-lock): what to read, what to cut, what to re-stage, and the lines files.

  python3 audio/ep01/v32/takes.py plan        -> audio/ep01/v32/<seg>/lines-in.json  (fastrec input)
  bash    audio/ep01/v32/record.sh            -> fastrec into audio/ep01/v32/<seg>/    (ops/heavy.sh, --workers 2)
  audio/.venv-casting/bin/python audio/ep01/v32/takes.py cut       -> the cut takes
  audio/.venv-casting/bin/python audio/ep01/v32/takes.py restage   -> DevDay's two kept takes through the stage chain
  python3 audio/ep01/v32/takes.py assemble    -> audio/ep01/v32/<seg>/lines-v32.json

What (script-v32-notes §10.6, as the six v3.2 plans' `take` fields say):
  - READ (8): v32-a1-0002 / 0004 (Tasya on the phone, the call chain), v32-a1-0003 (Mas), v32-a1-0005 (Gerg),
    v32-a1-0007 (Oigneb), v32-a2-0001 (Mas at the Senate), v32-a3-0001 (Mas on the DevDay stage: fastrec's `pa`
    chain, a hall PA; the hall's reverb is the mix's), v32-a4-0001 (Neleh on the call). Speaker, speed and device
    come from a reference take of the same voice in a nearby scene (READ below).
  - CUT (3): v32-a1-0001 (e1-a1-5-01's first sentence), v32-a1-0006 (v31-a1-0006's first sentence),
    v32-a2-0002 (e1-a2-15-10's last sentence); at sentence boundaries, 12 ms fades, 0.35 s room-tone handles.
    (The notes' totals say 7 reads and 4 cuts; the plans' own `take` fields say 8 and 3, which is what this does.)
  - RESTAGE (2): e1-a3-22-01, e1-a3-22-02 keep their reads; their dry takes go through the stage (`pa`) chain instead
    of the monitor's, levelled to -16 LUFS (the plans' `device`: monitor -> stage).
  - No V.O. takes: the v3.2 plans only drop V.O.; the kept ones have their takes.
"""
import json
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v32')
BP = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v32')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TAKE_FILES = ['audio/ep01/coldopen/dialogue/lines-fast-v1.json', 'audio/ep01/act1/dialogue/lines-fast-v1.json',
              'audio/ep01/act2/dialogue/lines-fast-v2.json', 'audio/ep01/act3/dialogue/lines-fast-v2.json',
              'audio/ep01/act4/dialogue/lines-v5.json', 'audio/ep01/tag/dialogue/lines-fast-v1.json'] + \
             [f'audio/ep01/v3/{s}/lines-v3.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')] + \
             [f'audio/ep01/v31/{s}/lines-v31.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')]
CAST = os.path.join(ROOT, 'audio/voices/cast.json')


M, G, A, N, T, Y = '[Mas](/mˈɑs/)', '[gerg](/ɡˈɜɹɡ/)', '[alyi](/ˈælji/)', '[Neleh](/nˈɛlɛ/)', '[Ttemme](/tˈɛmi/)', '[Yrral](/jˈɜɹəl/)'
VO = {}
M, G = '[Mas](/mˈɑs/)', '[gerg](/ɡˈɜɹɡ/)'
# id -> (reference take, spoken_as[, speed]); the reference's speaker, speed and device, unless READ_DEVICE overrides
READ = {
    'v32-a1-0002': ('e1-a1-9-08', f'{M}.'),
    'v32-a1-0003': ('e1-a1-7-02', "it's the bill.{0.35} we're going to need more servers."),
    'v32-a1-0004': ('e1-a1-9-08', "I'll bring a pen."),
    'v32-a1-0005': ('e1-a1-9-09', "Elgoog's going to hear about this from a search box."),
    'v32-a1-0007': ('e1-a1-12-02', 'You signed it.{0.3} Now put the iron down.'),
    'v32-a2-0001': ('v3-a2-0001', 'i would form a new agency that licenses any effort above a certain scale of capabilities.'),
    'v32-a3-0001': ('e1-a3-22-01', 'and today, you can build your own [chatgtp](/ʧˌætʤˌitˌipˈi/).'),
    'v32-a4-0001': ('a5-27-09', 'Step three.{0.3} Rima, the staff will come to you now.'),
}
READ_DEVICE = {'v32-a1-0002': 'call', 'v32-a1-0004': 'call', 'v32-a3-0001': 'pa', 'v32-a4-0001': 'call'}
DEMO = {}
CUT = {
    'v32-a1-0001': ('e1-a1-5-01', 0, 3),      # Okay, the build's green.
    'v32-a1-0006': ('v31-a1-0006', 0, 2),     # House rules, Sydney.
    'v32-a2-0002': ('e1-a2-15-10', 12, 17),   # Would you come and run it?
}
REUSE = {}
RESTAGE = {'e1-a3-22-01': 'act3', 'e1-a3-22-02': 'act3'}
HANDLE, FADE = 0.35, 0.012


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def rows():
    out = {}
    for f in TAKE_FILES:
        for r in jl(f):
            out[r['id']] = r
    return out


def wanted():
    """(seg, beat, plan entry, kind) for every new line and new V.O. of the v3.1 plans"""
    for seg in SEGS:
        for b in jl(os.path.join(BP, f'{seg}.json'))['beats']:
            for v in b.get('vo', []):
                yield seg, b['id'], v, 'vo'
            for l in b.get('lines', []):
                if l.get('new'):
                    yield seg, b['id'], l, 'dialogue'


def plan():
    R = rows()
    per = {}
    for seg, bid, w, kind in wanted():
        wid = w['id']
        if wid in CUT or wid in REUSE:
            continue
        text = w['text'].replace('"', '').replace('“', '').replace('”', '').strip()
        if kind == 'vo':
            say, speed = VO[wid]
            row = {'id': wid, 'scene': bid.split('.')[0].replace('v31-', ''), 'speaker': 'MAS MANALT', 'speaker_slug': 'mas-manalt',
                   'text': w['text'], 'spoken_as': say, 'delivery': w.get('delivery'), 'tag': '[INVENTED · VO · v3.1 inner voice]',
                   'mode': 'on-mic', 'on_camera': 'vo', 'kind': 'vo', 'side': 'none', 'shot': bid, 'status': 'fast', 'speed': speed}
        elif wid in DEMO:
            row = {'id': wid, 'scene': '32', 'speaker': "ELGOOG'S DEMO", 'speaker_slug': 'elgoog-demo', 'voice_slug': 'elgoog-demo',
                   'text': text, 'spoken_as': DEMO[wid][0], 'delivery': w.get('delivery'), 'tag': w.get('note') or '[V]', 'mode': 'on-mic',
                   'on_camera': 'monitor', 'kind': 'dialogue', 'side': 'none', 'shot': bid, 'status': 'fast', 'speed': DEMO[wid][1]}
        else:
            ref_id, say = READ[wid][:2]
            ref = R[ref_id]
            row = {'id': wid, 'scene': bid.split('.')[0].replace('v31-', '').lstrip('S') or bid, 'speaker': ref['speaker'],
                   'speaker_slug': ref.get('speaker_slug'), 'text': text, 'spoken_as': say, 'delivery': w.get('delivery'),
                   'tag': w.get('note') or '[INVENTED]', 'mode': 'on-mic', 'on_camera': ref.get('on_camera') or 'on',
                   'kind': 'dialogue', 'side': 'none', 'shot': bid, 'status': 'fast',
                   'speed': READ[wid][2] if len(READ[wid]) > 2 else ref['pace']['speed'],
                   'device': ref.get('device'), 'ref_take': ref_id}
            if wid in READ_DEVICE:
                row['device'] = READ_DEVICE[wid]
            if not row['device']:
                row.pop('device')
        per.setdefault(seg, []).append(row)
    for seg, rs in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        json.dump(rs, open(os.path.join(HERE, seg, 'lines-in.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v32/{seg}/lines-in.json: {len(rs)} to read ({", ".join(r["id"] for r in rs)})')


def cut():
    import numpy as np
    import soundfile as sf
    R = rows()
    seg_of = {w['id']: seg for seg, _, w, _ in wanted()}
    for cid, (src, i0, i1) in CUT.items():
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
        # room-tone handles to the house's 0.35 s, from the take's own quiet head
        tone = x[:int(0.25 * sr)].copy()
        pre = max(0.0, HANDLE - (W[i0]['t0'] - a))
        post = max(0.0, HANDLE - (e - W[i1]['t1']))
        pad = lambda s: np.concatenate([tone] * (int(s * sr) // len(tone) + 1))[:int(s * sr)]
        y = np.concatenate([pad(pre), seg, pad(post)])
        seg_name = seg_of[cid]
        out = os.path.join(HERE, seg_name, 'wav', f'{cid}.wav')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sf.write(out, y, sr, subtype='PCM_24')
        off = pre - a
        words = [dict(w, t0=round(w['t0'] + off, 3), t1=round(w['t1'] + off, 3)) for w in W[i0:i1 + 1]]
        new = {k2: v for k2, v in r.items() if k2 not in ('mouth', 'alt_takes', 'mp3', 'clean', 'complete')}
        new.update(id=cid, file=os.path.relpath(out, ROOT), duration_s=round(len(y) / sr, 3), words=words,
                   text=' '.join(w['w'] for w in W[i0:i1 + 1]),
                   cut_from=f'{src} words {i0}-{i1} ({r["file"]}, {a:.3f}-{e:.3f} s), 12 ms fades, room-tone handles to {HANDLE} s')
        new['pace'] = dict(r['pace'], audible_in_s=round(words[0]['t0'] - 0.02, 3), audible_out_s=round(min(len(y) / sr, words[-1]['t1'] + 0.08), 3))
        json.dump(new, open(os.path.join(HERE, seg_name, 'wav', f'{cid}.cut.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'{new["file"]}: {new["text"]!r} ({len(y) / sr:.2f} s) from {src}')


def assemble():
    R = rows()
    per = {}
    for seg, bid, w, kind in wanted():
        per.setdefault(seg, []).append(w['id'])
    for seg, ids in per.items():
        d = os.path.join(HERE, seg)
        rec = {r['id']: r for r in jl(os.path.join(d, 'lines.json'))} if os.path.exists(os.path.join(d, 'lines.json')) else {}
        out = []
        for i in ids:
            if i in rec:
                out.append(rec[i])
            elif i in CUT:
                out.append(jl(os.path.join(d, 'wav', f'{i}.cut.json')))
            elif i in REUSE:
                r = json.loads(json.dumps(R[REUSE[i]]))
                os.makedirs(os.path.join(d, 'wav'), exist_ok=True)
                dst = os.path.join(d, 'wav', f'{i}.wav')
                shutil.copyfile(os.path.join(ROOT, r['file']), dst)
                r.update(id=i, file=os.path.relpath(dst, ROOT), reused_from=f'{REUSE[i]} ({R[REUSE[i]]["file"]}), deliberately the same take')
                out.append(r)
            else:
                print(f'  ! {seg}: {i} has no take')
        for rid, rseg in RESTAGE.items():
            f = os.path.join(d, 'wav', f'{rid}.restage.json')
            if rseg == seg and os.path.exists(f):
                out.append(jl(f))
        json.dump(out, open(os.path.join(d, 'lines-v32.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v32/{seg}/lines-v32.json: {len(out)} takes')


def restage():
    """a kept take moved to another device chain: its dry read through the new chain, levelled to -16 LUFS"""
    import numpy as np
    import soundfile as sf
    sys.path.insert(0, os.path.join(ROOT, 'audio/ep01/act4/dialogue/tools/fastrec'))
    import house
    R = rows()
    for rid, seg in RESTAGE.items():
        r = R[rid]
        dry, sr = sf.read(os.path.join(ROOT, r['clean']['file']), dtype='float32')
        wet = house.L.V.apply_chain(dry, sr, house.DEVICES['pa']()).astype(np.float32)
        wet = house.L.V.normalise(wet, target=-16.0).astype(np.float32)
        out = os.path.join(HERE, seg, 'wav', f'{rid}.stage.wav')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sf.write(out, wet, sr, subtype='PCM_24')
        new = dict(r, file=os.path.relpath(out, ROOT), device='pa',
                   restaged=f'{r["file"]} (monitor chain) -> the dry read {r["clean"]["file"]} through fastrec\'s pa chain, -16 LUFS')
        json.dump(new, open(os.path.join(HERE, seg, 'wav', f'{rid}.restage.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'{new["file"]}: {rid} re-staged (pa chain)')


if __name__ == '__main__':
    {'plan': plan, 'cut': cut, 'restage': restage, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
