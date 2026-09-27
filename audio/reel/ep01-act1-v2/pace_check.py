#!/usr/bin/env python
"""Act One takes against each character's pace guide (fastrec rows; run any time during or after a record run).

  python3 audio/reel/ep01-act1-v2/pace_check.py [rows dir]      (default audio/ep01/act1/dialogue/fast-v1/rows)

A line is FAR OFF when it has 6 or more words and its words-per-minute is more than 25 % over the top of its turn
guide (or 25 % under the bottom), or its articulation is more than 0.6 syllables a second outside its guide. Short
lines are listed but never flagged on wpm: a two-word line's wpm is set by the words, not the read (Act Four v5's
approved takes run 230-330 wpm on 2-4 word lines for the same voices). The 25 % margin is where Act Four v5's
approved long lines sat (Tasya's 46-word line was 37 % over; most were 0-21 %).
"""
import glob, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
d = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'audio/ep01/act1/dialogue/fast-v1/rows')
rows = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(d, '*.json'))) if not f.endswith('.error.json')]
rows.sort(key=lambda r: [int(x) if x.isdigit() else x for x in r['id'].split('-')])
far = []
print(f"{'id':12} {'speaker':14} {'wds':>3} {'spd':>5} {'span':>5} {'wpm':>5} {'guide':>9} {'sps':>5} {'guide':>9}  flag")
for r in rows:
    p = r['pace']; it = p.get('intended') or {}; m = p.get('measured') or {}
    g = it.get('turn_wpm_guide') or [0, 0]; a = it.get('articulation_guide_sps') or [0, 0]
    wpm, sps, n = p.get('wpm') or 0, m.get('articulation_sps') or 0, p.get('words') or 0
    flag = []
    if n >= 6 and g[1] and wpm > g[1] * 1.25: flag.append(f'wpm +{100 * (wpm / g[1] - 1):.0f}%')
    if n >= 6 and g[0] and wpm < g[0] * 0.75: flag.append(f'wpm -{100 * (1 - wpm / g[0]):.0f}%')
    if a[1] and sps > a[1] + 0.6: flag.append(f'sps +{sps - a[1]:.1f}')
    if a[0] and sps and sps < a[0] - 0.6 and n >= 4: flag.append(f'sps -{a[0] - sps:.1f}')
    if flag: far.append(r['id'])
    print(f"{r['id']:12} {r['speaker'][:14]:14} {n:3d} {p.get('speed', 0):5.2f} {m.get('span_s', 0):5.2f} {wpm:5.0f} {str(g):>9} {sps:5.2f} {str(a):>9}  {' '.join(flag)}")
print(f'\n{len(rows)} rows; far off: {len(far)}: {" ".join(far)}')
