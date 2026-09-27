#!/usr/bin/env python3
"""Pacing measures for stick-reel timelines: how long we stay in each place, and how scenes are entered and left.

  python3 studio/src/reel/tools/pacing.py                      # Ep1: cold open, acts 1-3 (v2), Act Four (v5), tag
  python3 studio/src/reel/tools/pacing.py A=path.json B=path.json ...   # any timelines, labelled
  python3 studio/src/reel/tools/pacing.py --json out.json ...  # also write the per-place rows

Written for the 2026-09-27 pacing comparison (show/_sources/research/pacing-comparison.md). It reads the writers'
timeline JSON (show/reel/...), the same beats the stick reel renders, and reports:

  shots      count, average shot length (ASL) and median, per timeline
  places     a "stay" is a run of beats in one physical set. Screens and calls (`set` screen / call) count as part
             of the room they're watched from, because the viewer doesn't feel a POV insert as leaving the room;
             cards and black (`void`) are transitions, not places.
  entry air  cut-in to the first audible word, for talk stays of 8 s or more
  exit air   last audible word to the cut-out (the aftermath hold). Negative = the line runs over the cut (L-cut)
  pre-laps   lines that start before their own shot (t < 0, a J-cut) and lines that run past it (an L-cut)

It only reads; nothing is written unless --json is given.
"""
import json
import statistics as st
import sys

ROOT = __file__.rsplit('/studio/', 1)[0]
DEFAULT = [
    ('COLD', 'show/reel/ep01-full/ep01-coldopen-v2.json'),
    ('A1', 'show/reel/ep01-full/ep01-act1-v2.json'),
    ('A2', 'show/reel/ep01-full/ep01-act2-v2.json'),
    ('A3', 'show/reel/ep01-full/ep01-act3-v2.json'),
    ('A4', 'show/reel/ep01-act4-v5.json'),
    ('TAG', 'show/reel/ep01-full/ep01-tag-v2.json'),
]
INHERIT = {'screen', 'call'}  # watched from a room: part of that room
TALK_MIN = 8.0                # a talk stay this long or longer counts for entry / exit air


def load(files):
    stays, shots, lines_all, t = [], [], [], 0.0
    for tag, path in files:
        prev = None
        for b in json.load(open(path if path.startswith('/') else f'{ROOT}/{path}'))['beats']:
            dur = b.get('reelDur') or b.get('realDur') or 0
            loc = b.get('set') or '?'
            if loc in INHERIT and prev:
                loc = prev
            if b.get('kind') == 'card' or loc == 'void':
                loc = 'void'
            ls = [(t + l['t'], t + l['t'] + l['dur'], l.get('who', ''), l.get('text', '')) for l in b.get('lines', [])]
            for l in b.get('lines', []):
                lines_all.append((tag, l['t'] < 0, l['t'] + l['dur'] > dur + 0.01))
            shots.append((tag, dur))
            if stays and stays[-1]['loc'] == loc and stays[-1]['act'] == tag:
                s = stays[-1]
                s['e'] = t + dur
                s['ids'].append(b['id'])
                s['lines'] += ls
            else:
                stays.append(dict(act=tag, loc=loc, s=t, e=t + dur, ids=[b['id']], lines=ls, first=b.get('frame', '')))
            if loc != 'void':
                prev = loc
            t += dur
    return stays, shots, lines_all, t


def main(argv):
    out_json = None
    if '--json' in argv:
        i = argv.index('--json')
        out_json = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    files = [tuple(a.split('=', 1)) for a in argv] or DEFAULT
    stays, shots, lines_all, total = load(files)
    tags = [f[0] for f in files]

    print(f'{len(shots)} shots in {total / 60:.1f} min')
    print(f'{"":5} {"shots":>5} {"min":>6} {"ASL":>5} {"med":>5}  {"places":>6} {"med stay":>8} {"per min":>7}')
    for tg in tags:
        d = [x for a, x in shots if a == tg]
        p = [s['e'] - s['s'] for s in stays if s['act'] == tg and s['loc'] != 'void']
        if not d:
            continue
        print(f'{tg:5} {len(d):5} {sum(d) / 60:6.1f} {sum(d) / len(d):5.1f} {st.median(d):5.1f}  {len(p):6} '
              f'{st.median(p) if p else 0:8.1f} {len(p) / (sum(p) / 60) if p else 0:7.1f}')

    real = [s for s in stays if s['loc'] != 'void']
    d = [s['e'] - s['s'] for s in real]
    print(f'\nplaces: {len(real)} stays; median {st.median(d):.1f} s; under 10 s {sum(x < 10 for x in d)}, '
          f'10-30 s {sum(10 <= x < 30 for x in d)}, 30-60 s {sum(30 <= x < 60 for x in d)}, 60 s+ {sum(x >= 60 for x in d)}')
    ent, ext = [], []
    for s in real:
        if s['lines'] and s['e'] - s['s'] >= TALK_MIN:
            L = sorted(s['lines'])
            ent.append(L[0][0] - s['s'])
            ext.append(s['e'] - max(x[1] for x in L))
    if ent:
        print(f'talk stays >= {TALK_MIN:.0f} s: {len(ent)}; entry air median {st.median(ent):.1f} s (2 s or less: '
              f'{sum(e <= 2 for e in ent)}); exit air median {st.median(ext):.1f} s (1.5 s or less: {sum(e <= 1.5 for e in ext)})')
    pre = sum(1 for _, p, _ in lines_all if p)
    post = sum(1 for _, _, q in lines_all if q)
    print(f'lines: {len(lines_all)}; start before their shot (J-cut) {pre}; run past it (L-cut) {post}')
    if out_json:
        json.dump([dict(act=s['act'], loc=s['loc'], start=round(s['s'], 2), dur=round(s['e'] - s['s'], 2), beats=s['ids'],
                        lines=len(s['lines']), first=s['first']) for s in stays], open(out_json, 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1:])
