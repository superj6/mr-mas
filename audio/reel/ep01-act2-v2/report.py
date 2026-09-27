#!/usr/bin/env python
"""Ep1 Act Two stick reel v2: the transcript and the dialogue measurements.

  python3 audio/reel/ep01-act2-v2/report.py      -> audio/reel/ep01-act2-v2/{transcript-v2.txt, measure.json}

Same definitions as Act Four's report (audio/reel/ep01-act4-v5/report.py), so the numbers compare:
  * words: whitespace tokens with a letter or digit; lines of three words or fewer;
  * exchanges: a run of lines with no gap over 3.0 s between one line's last word and the next line's first,
    split where a new place or time starts (a beat with seq); 5.0 s shown as a check;
  * the longest conversation = the longest 3.0 s exchange;
  * the dialogue share = the union of the audible speech spans over the act's runtime.
Times are on the chapter clock (the act starts at 0; as an episode chapter it has no title card of its own).
Speaker labels follow the reel: a name once the picture names the character, before that the neutral role.
"""
from __future__ import annotations

import json
import os
import re
import statistics as st

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
REEL = os.path.join(ROOT, 'show/reel/ep01-full/ep01-act2-v2.json')
FPS, ACT0 = 24, 5 * 60 + 54
TRANSCRIPT = os.path.join(HERE, 'transcript-v2.txt')

R = json.load(open(REEL))
cast = R.get('cast', {})
NAMES = {'mas': 'MAS', 'mario': 'MARIO', 'tasya': 'TASYA', 'radnus': 'RADNUS', 'nedib': 'NEDIB', 'sirrah': 'SIRRAH',
         'sucram': 'SUCRAM', 'nesnej': 'NESNEJ'}

starts, acc, prev = [], 0.0, 0
for b in R['beats']:
    acc += b['reelDur']
    end = max(prev + 1, round(acc * FPS))
    starts.append((prev / FPS, end / FPS))
    prev = end
TOTAL = prev / FPS

named = {k: -1.0 for k, c in cast.items() if c.get('known')}
lines, texts, seqs = [], [], []
seg = -1
for (s0, e0), b in zip(starts, R['beats']):
    if b.get('seq'):
        seg += 1
    for n in b.get('names', []):
        named[n['id']] = min(named.get(n['id'], 1e9), s0 + n['at'])
    for l in b.get('lines', []):
        lines.append(dict(l, on=s0 + l['t'], end=s0 + l['t'] + l['dur'], beat=b['id'], seg=seg))
    for o in b.get('onscreen', []):
        m = re.match(r'^\s*(RAIL|POST|UI)\s*:\s*(.+)$', o['text'])
        kind, text = (m.group(1).lower(), m.group(2)) if m else ('card', o['text'])
        texts.append(dict(t=s0 + o['at'], kind=kind, text=text, beat=b['id']))
    if b.get('seq'):
        q = b['seq']
        seqs.append(dict(t=s0, label='sc ' + (q.get('id') or ''), place=q.get('place', ''), time=q.get('time', '')))
lines.sort(key=lambda l: l['on'])


def label(l):
    who = l['who']
    nm = cast.get(who, {}).get('name') or NAMES.get(who, who.upper())
    base = nm if named.get(who, 1e9) <= l['on'] + 0.5 / FPS else (cast.get(who, {}).get('role') or 'VOICE')
    return base + (' (O.S.)' if l.get('tag') == 'O.S.' else '')


def clock(t):
    t = max(0.0, t)
    return f'{int(t // 60)}:{t % 60:04.1f}'


def nwords(text):
    return len([w for w in text.split() if re.search(r'[A-Za-z0-9]', w)])


# ------------------------------------------------------------------ transcript
seen_text = set()
rows = [(l['on'], 0, l) for l in lines] + [(q['t'], -1, q) for q in seqs]
for x in texts:
    if nwords(x['text']) >= 2 and x['text'] not in seen_text:
        seen_text.add(x['text'])
        rows.append((x['t'], 1, x))
rows.sort(key=lambda r: (r[0], r[1]))
out = ['MR. MAS · Ep1 · ACT TWO, "the regulate-me tour" (sc 13-17) · stick-figure dialogue reel v2 · transcript',
       f'act {clock(TOTAL)} · {len(lines)} lines · times: act clock | printed episode clock (act starts 5:54 printed)',
       'Speaker labels follow the reel: a name once the picture has named the character, before that a neutral role.',
       'In-world texts of two words or more are listed as ON SCREEN (first appearance only).', '']
for t, kind, x in rows:
    stamp = f'[act {clock(t):>6} | ep {clock(ACT0 + t):>6}]'
    if kind == -1:
        out.append('')
        out.append(f"{stamp}  == {x['label']} · {x['place']} · {x['time']}")
    elif kind == 0:
        out.append(f"{stamp}  {label(x)}: {x['text']}")
    else:
        out.append(f"{stamp}      ON SCREEN ({x['kind']}): {x['text']}")
open(TRANSCRIPT, 'w').write('\n'.join(out) + '\n')

# ------------------------------------------------------------------ measurements
wc = [nwords(l['text']) for l in lines]


def exchanges(maxgap):
    ex = []
    for l in lines:
        if ex and l['on'] - ex[-1]['end'] <= maxgap and l['seg'] == ex[-1]['lines'][-1]['seg']:
            ex[-1]['lines'].append(l)
            ex[-1]['end'] = max(ex[-1]['end'], l['end'])
        else:
            ex.append(dict(on=l['on'], end=l['end'], lines=[l]))
    return [dict(start_act=clock(e['on']), seconds=round(e['end'] - e['on'], 1), lines=len(e['lines']),
                 speakers=sorted({x['who'] for x in e['lines']}), words=sum(nwords(x['text']) for x in e['lines']),
                 first=e['lines'][0]['id'], last=e['lines'][-1]['id']) for e in ex]


spans = sorted((l['on'], l['end']) for l in lines)
union, cur = 0.0, None
for a, b in spans:
    if cur and a <= cur[1]:
        cur[1] = max(cur[1], b)
    else:
        if cur:
            union += cur[1] - cur[0]
        cur = [a, b]
union += cur[1] - cur[0]
gaps = [b['on'] - a['end'] for a, b in zip(lines, lines[1:]) if a['seg'] == b['seg']]
ex3, ex5 = exchanges(3.0), exchanges(5.0)
shot_len = {}
for (s0, e0), b in zip(starts, R['beats']):
    k = b.get('shotId') if b.get('cont') else b['id']
    shot_len[k] = shot_len.get(k, 0) + (e0 - s0)
scenes = {}
for (s0, e0), b in zip(starts, R['beats']):
    sc = b['id'].split('.')[0]
    scenes.setdefault(sc, [s0, e0])[1] = e0
silent = []   # stretches of 4 s or more with no speech (picture beats: cards, set pieces, the bridge)
edges = [0.0] + [x for l in lines for x in (l['on'], l['end'])] + [TOTAL]
pairs = [(0.0, lines[0]['on'])] + [(a['end'], b['on']) for a, b in zip(lines, lines[1:])] + [(lines[-1]['end'], TOTAL)]
for a, b in pairs:
    if b - a >= 4.0:
        silent.append((clock(a), round(b - a, 1)))
M = dict(
    act_seconds=round(TOTAL, 3), act_clock=clock(TOTAL),
    scenes={k: dict(start=clock(v[0]), seconds=round(v[1] - v[0], 1)) for k, v in scenes.items()},
    lines=len(lines), words=sum(wc), median_words_per_line=st.median(wc), mean_words_per_line=round(st.mean(wc), 2),
    lines_3_words_or_fewer=sum(1 for w in wc if w <= 3), cut_off_lines=[l['id'] for l in lines if l.get('cut')],
    overlaps=[(a['id'], b['id'], round(a['end'] - b['on'], 2)) for a, b in zip(lines, lines[1:]) if b['on'] < a['end']],
    gap_between_lines_s=dict(definition='last word to next first word, inside one scene',
                             median=round(st.median(gaps), 2), within_0p2_0p6=sum(1 for g in gaps if 0.2 <= g <= 0.6),
                             within_0p6_1p6=sum(1 for g in gaps if 0.6 < g <= 1.6), over_1p6=sum(1 for g in gaps if g > 1.6),
                             under_0p2=sum(1 for g in gaps if g < 0.2)),
    exchanges_3s=dict(definition='consecutive lines with no gap over 3.0 s (last word to next first word), '
                                 'split where a new place or time starts (a beat with seq)',
                      count=len(ex3), mean_lines=round(st.mean(e['lines'] for e in ex3), 2),
                      median_seconds=round(st.median(e['seconds'] for e in ex3), 1),
                      with_two_or_more_speakers=sum(1 for e in ex3 if len(e['speakers']) >= 2),
                      longest=max(ex3, key=lambda e: e['seconds']), list=ex3),
    exchanges_5s=dict(count=len(ex5), longest=max(ex5, key=lambda e: e['seconds'])),
    dialogue_seconds=round(union, 1), dialogue_share_of_act=round(union / TOTAL, 3),
    stretches_4s_or_more_without_speech=silent,
    beats=len(R['beats']), shots=len(shot_len), median_shot_s=round(st.median(shot_len.values()), 2),
    mean_shot_s=round(st.mean(shot_len.values()), 2), shots_under_1p5s=sum(1 for v in shot_len.values() if v < 1.5),
    named_at_act_s={k: round(v, 2) for k, v in sorted(named.items(), key=lambda kv: kv[1])},
    lines_before_naming=[(l['id'], label(l)) for l in lines if named.get(l['who'], 1e9) > l['on'] + 0.5 / FPS],
)
json.dump(M, open(os.path.join(HERE, 'measure.json'), 'w'), indent=1)
top = sorted(ex3, key=lambda e: -e['seconds'])[:5]
print(f"act {M['act_clock']}, {M['lines']} lines, {M['words']} words, median {M['median_words_per_line']} words a line, "
      f"{M['lines_3_words_or_fewer']} lines of <= 3 words")
print(f"scenes: {M['scenes']}")
print(f"gaps: {M['gap_between_lines_s']}")
print(f"exchanges (3 s): {len(ex3)}, median {M['exchanges_3s']['median_seconds']} s; longest: "
      f"{[(e['start_act'], e['seconds'], e['lines'], e['speakers']) for e in top]}")
print(f"dialogue {M['dialogue_seconds']} s = {M['dialogue_share_of_act']:.0%} of the act; no-speech stretches >= 4 s: {silent}")
print(f"shots {M['shots']} (beats {M['beats']}), median {M['median_shot_s']} s, <1.5 s: {M['shots_under_1p5s']}")
print(f"lines before naming: {M['lines_before_naming']}")
print(f'wrote {os.path.relpath(TRANSCRIPT, ROOT)} and measure.json')
