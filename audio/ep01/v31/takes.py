#!/usr/bin/env python3
"""Ep1 v3.1 takes (the v3.1 lock, pass v3-lock): what to record, what to cut from existing takes, and the lines files.

  python3 audio/ep01/v31/takes.py plan        -> audio/ep01/v31/<seg>/lines-in.json  (fastrec input) + cast-v31.json
  bash    audio/ep01/v31/record.sh            -> fastrec into audio/ep01/v31/<seg>/    (ops/heavy.sh, --workers 2)
  audio/.venv-casting/bin/python audio/ep01/v31/takes.py cut    -> audio/ep01/v31/<seg>/wav/<id>.wav for the cut lines
  python3 audio/ep01/v31/takes.py assemble    -> audio/ep01/v31/<seg>/lines-v31.json (every v3.1 take of the segment)

What (script-v31-notes §6, with the lock pass's calls; lock-v31.md §3):
  - READ: the 7 new V.O. lines (the V.O. preset, 0.85-0.88, sentence pauses) and every new spoken line marked "new",
    in the speaker's v2/v5 voice, speed and device (each from a reference take in the same scene, REF below);
    Radnus's v31-a1-0004 is READ, not cut: the cut would end on the take's comma ("a chat thing, people...").
  - CUT: the lines the plan marks "cut from" an existing take, at sentence boundaries (mid-pause, 12 ms fades,
    0.35 s room-tone handles). The same performance is the point for several: Alyi's sentence heard twice, once per
    side; Sydney's reset "Hi!"; the landlord's "Everyone is welcome." on the monitor; Nedib's two halves.
  - REUSE: v31-a4-0012 "and the rent?" is Act One's take, deliberately.
  - the restored v2 lines keep their v2 takes (the builder reads them from the v2 timelines); the restored Mas takes
    (e1-a1-10-01, 10-03, 11-05) are the same voice preset as the v3 Mas speech (a-michael-close, 0.86-0.92), so they stay.
  - ELGOOG'S DEMO ("What the quack!") gets a new stock voice, not a cast voice: bf_isabella (no cast member uses a
    b-voice), bright, dry, speed 1.0, in cast-v31.json (audio/voices/cast.json plus this one voice; fastrec --cast).
"""
import json
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v31')
BP = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v31')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TAKE_FILES = ['audio/ep01/coldopen/dialogue/lines-fast-v1.json', 'audio/ep01/act1/dialogue/lines-fast-v1.json',
              'audio/ep01/act2/dialogue/lines-fast-v2.json', 'audio/ep01/act3/dialogue/lines-fast-v2.json',
              'audio/ep01/act4/dialogue/lines-v5.json', 'audio/ep01/tag/dialogue/lines-fast-v1.json'] + \
             [f'audio/ep01/v3/{s}/lines-v3.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')]
CAST = os.path.join(ROOT, 'audio/voices/cast.json')
CAST_V31 = os.path.join(HERE, 'cast-v31.json')

M, G, A, N, T, Y = '[Mas](/mˈɑs/)', '[gerg](/ɡˈɜɹɡ/)', '[alyi](/ˈælji/)', '[Neleh](/nˈɛlɛ/)', '[Ttemme](/tˈɛmi/)', '[Yrral](/jˈɜɹəl/)'
# V.O.: (spoken_as, speed)
VO = {
    'v31-vo-01': ('four companies, one table.{0.45} radnus has been mouthing the same sentence since we sat down.', 0.87),
    'v31-vo-02': ("her mouth is a beat late.{0.45} the voice isn't hers.", 0.87),
    'v31-vo-03': ('thirteen.', 0.88),
    'v31-vo-04': ('my other company.{0.4} it tells people from machines.', 0.85),   # 0.85 after a first read at 4.35 syll/s
    'v31-vo-05': ("i've had mine up since may.", 0.87),
    'v31-vo-06': ("[neleh's](/nˈɛlɛz/) on our board.{0.45} she quoted us.", 0.85),   # 0.85 after 4.5 syll/s
    'v31-vo-07': ('those are stills.', 0.88),
}
# new spoken reads: id -> (reference take in the same scene, spoken_as[, speed]); speaker, speed and device come from the
# reference unless a speed is given (re-reads after the first read's QA flags: lock-v31.md §3)
READ = {
    'v31-a1-0001': ('e1-a1-5-02', 'Did anyone tell the rest of the board?', 0.86),   # 5.52 syll/s at 0.94
    'v31-a1-0002': ('e1-a1-5-03', "It's a research preview."),
    'v31-a1-0003': ('e1-a1-7-01', f'A million people, {M}.{{0.4}} Is that a tear?'),
    'v31-a1-0004': ('e1-a1-8-03', "Search is fine.{0.2} Totally fine.{0.3} It's just a chat thing."),
    'v31-a1-0005': ('e1-a1-9-06', "Oh, we don't think of it as rent.{s0.5} You'll build everything on our servers.{s0.4} We'll keep the lights on and the floors warm."),   # whole reads (5.09 syll/s as one)
    'v31-a1-0006': ('e1-a1-9-08', 'House rules, Sydney.{0.4} Five questions, then a fresh start.'),
    'v31-a2-0003': ('e1-a2-15-02', 'That voice was not mine.{0.45} The words were not mine.'),
    'v31-a4-0002': ('a5-27-22', 'Once more, before the others join.'),
    'v31-a4-0003': ('a5-27-17', "We'll say we will."),
    'v31-a4-0004': ('a5-27-35', 'The staff want him back.{0.4} The investors want him back.'),
    'v31-a4-0006': ('a5-27-46', 'Step four, Mada?'),
    'v31-a4-0008': ('a5-29-04', 'read me the letter.'),
    'v31-a4-0009': ('a5-29-05', 'Okay.{0.3} Pull it up.'),   # one read: the split read's "up" was heard as "out" (lock-v31.md §3)
    'v31-a4-0010': ('a5-29-15', "That's the share sale.{0.3} Everybody was about to get paid."),
    'v31-a4-0011': ('a5-29-19', 'keep building.'),
    'v31-a4-0013': ('a5-29-22', 'Due on the first.'),
    'v31-a4-0014': ('a5-30-07', 'Down here.'),
    'v31-a4-0015': ('a5-30-13', f'{G} comes back too.'),
    'v31-a4-0016': ('a5-30-12', f'{G.replace("gerg", "Gerg")} comes back too.', 1.06),   # 2.58 syll/s at 1.02
    'v31-a4-0017': ('a5-27-30', f"Mario, it's {N}, from the NopeAI board.{{0.4}} We'd like to offer you the job of CEO, and to discuss a merger."),
    'v31-tg-0002': ('e1-tg-32-01', 'that was close.'),
}
DEMO = {'v31-tg-0001': ("What the [quack](/kwˈæk/)!", 1.04)}   # the IPA after ASR heard "quackie" at 1.0
# cuts: id -> (source take, first word index, last word index) (words as the take's own word list)
CUT = {
    'v31-a1-0007': ('e1-a1-10-06', 0, 0),     # Hi!
    'v31-a2-0001': ('e1-a2-13-15', 0, 9),     # Whatever you promise in here today, put it in writing.
    'v31-a2-0002': ('e1-a2-13-15', 10, 10),   # Longer.
    'v31-a3-0001': ('e1-a1-9-08', 0, 2),      # Everyone is welcome.
    'v31-a3-0002': ('e1-a3-20-05', 0, 2),     # Okay. That's patched.
    'v31-a4-0001': ('a5-27-01', 0, 12),       # Mas. The board has decided that you will no longer lead the company.
    'v31-a4-0005': ('a5-27-35', 7, 18),       # We've talked all day about him coming back, and we're no closer.
    'v31-a4-0007': ('a5-29-05', 0, 8),        # Best time there is. Nobody else is pushing anything.
}
REUSE = {'v31-a4-0012': 'e1-a1-9-05'}
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
            if not row['device']:
                row.pop('device')
        per.setdefault(seg, []).append(row)
    for seg, rs in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        json.dump(rs, open(os.path.join(HERE, seg, 'lines-in.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v31/{seg}/lines-in.json: {len(rs)} to read ({", ".join(r["id"] for r in rs)})')
    # the demo's stock voice, as an overlay on the cast registry (the registry owner can fold it in)
    c = jl(CAST)
    c['labels']["ELGOOG'S DEMO"] = 'elgoog-demo'
    c['voices']['elgoog-demo'] = {
        'name': "ELGOOG'S DEMO", 'cand': 'a-isabella-product', 'blend': {'bf_isabella': 1.0}, 'speed': 1.0,
        'chain': [{'fx': 'hpf', 'hz': 100}, {'fx': 'pitch', 'st': 0.0}, {'fx': 'peak', 'hz': 3000, 'db': 1.5, 'q': 0.9},
                  {'fx': 'highshelf', 'hz': 8000, 'db': 1.0}, {'fx': 'comp', 'th': -22, 'ratio': 2.5, 'att': 5, 'rel': 90}],
        'female': True, 'product': True,
        'brief': {'function': "ELGOOG's product film's own voice (the Runway insert, the tag): bright, surprised, a stock "
                              'presenter; never a clone or a sound-alike of anyone', 'src': 'v3-lock, 2026-09-27'}}
    c['bands']['elgoog-demo'] = [[0.96, 1.06], [4.2, 5.2], [150, 175]]
    json.dump(c, open(CAST_V31, 'w'), indent=1, ensure_ascii=False)
    print(f'audio/ep01/v31/cast-v31.json: the cast registry + elgoog-demo (bf_isabella)')


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
        json.dump(out, open(os.path.join(d, 'lines-v31.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v31/{seg}/lines-v31.json: {len(out)} takes')


if __name__ == '__main__':
    {'plan': plan, 'cut': cut, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
