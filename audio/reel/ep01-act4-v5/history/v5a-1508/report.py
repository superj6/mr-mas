#!/usr/bin/env python
"""Ep1 Act Four v5 STICK-FIGURE DIALOGUE REEL: the transcript and the dialogue measurements.

  python3 audio/reel/ep01-act4-v5/report.py [--transcript PATH]      -> the transcript + measure.json

The transcript lists every line at its start time with the speaker labelled the way the reel labels them: by name
only once the picture has named them (the beats' names[] and the cast's `known`), before that by the neutral role;
and every in-world text of more than three words. Times are given on the reel clock (it includes the 3 s title
card), the act clock and the episode timecode (act + 12:31).

Measures (definitions are in measure.json): runtime, words, lines, median words a line, lines of three words or
fewer, cut-off lines, exchanges (a run of lines with no gap over 3.0 s between one line's last word and the next
line's first; 5.0 s shown as a check) and their lengths, the longest conversation, and the dialogue share of the
runtime (the union of the audible speech spans).
"""
from __future__ import annotations

import json
import os
import re
import statistics as st
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
REEL = os.path.join(ROOT, 'show/reel/ep01-act4-v5.json')
FPS, TITLE_FRAMES, ACT0 = 24, 72, 12 * 60 + 31
TRANSCRIPT = sys.argv[sys.argv.index('--transcript') + 1] if '--transcript' in sys.argv else os.path.join(HERE, 'transcript-v5.txt')

R = json.load(open(REEL))
cast = R.get('cast', {})
NAMES = {'mas': 'MAS', 'gerg': 'GERG', 'alyi': 'ALYI', 'mario': 'MARIO', 'adelina': 'ADELINA', 'tasya': 'TASYA',
         'rima': 'RIMA', 'neleh': 'NELEH', 'mada': 'MADA', 'ttemme': 'TTEMME', 'terb': 'TERB', 'orb': 'THE ORB'}
SUFFIX = {'O.S.': ' (O.S.)', 'laptop': ' (laptop)', 'monitor': ' (monitor)', 'call': ' (call)'}

starts, acc, prev = [], 0.0, TITLE_FRAMES
for b in R['beats']:
    acc += b['reelDur']
    end = max(prev + 1, TITLE_FRAMES + round(acc * FPS))
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
        t = s0 + n['at']
        named[n['id']] = min(named.get(n['id'], 1e9), t)
    for l in b.get('lines', []):
        lines.append(dict(l, on=s0 + l['t'], end=s0 + l['t'] + l['dur'], beat=b['id'], seg=seg))
    for o in b.get('onscreen', []):
        m = re.match(r'^\s*(RAIL|POST|UI)\s*:\s*(.+)$', o['text'])
        kind, text = (m.group(1).lower(), m.group(2)) if m else ('card', o['text'])
        texts.append(dict(t=s0 + o['at'], kind=kind, text=text, beat=b['id']))
    if b.get('seq'):
        q = b['seq']
        seqs.append(dict(t=s0, label=(q.get('id') or '') + (' · ' + q['side'] if q.get('side') else ''),
                         place=q.get('place', ''), time=q.get('time', ''), sub=q.get('sub', '')))
lines.sort(key=lambda l: l['on'])


def label(l):
    who = l['who']
    nm = cast.get(who, {}).get('name') or NAMES.get(who, who.upper())
    base = nm if named.get(who, 1e9) <= l['on'] + 0.5 / FPS else (cast.get(who, {}).get('role') or 'VOICE')
    if l.get('tag') == 'V.O.':
        return base.lower() + ' (v.o.)'
    return base + SUFFIX.get(l.get('tag', ''), '')


def clock(t):
    t = max(0.0, t)
    return f'{int(t // 60)}:{t % 60:04.1f}'


def tc(t):
    s = ACT0 + t
    return f'{int(s // 60)}:{int(s % 60):02d}'


def nwords(text):
    return len([w for w in text.split() if re.search(r'[A-Za-z0-9]', w)])


# ------------------------------------------------------------------ transcript
rows = [(l['on'], 0, l) for l in lines] + [(x['t'], 1, x) for x in texts if nwords(x['text']) > 3] + [(q['t'], -1, q) for q in seqs]
rows.sort(key=lambda r: (r[0], r[1]))
out = ['MR. MAS · Ep1 · ACT FOUR, THE BLIP, TOLD TWICE · stick-figure dialogue reel v5 (draft 5.1) · transcript',
       f'reel {clock(TOTAL)} (3 s title card + act {clock(TOTAL - 3)}) · {len(lines)} lines · times: reel clock | act clock | episode',
       'Speaker labels follow the reel: a name only once the picture has named the character (a plate, card, tile or',
       'nameplate); before that, a neutral role. In-world texts of more than three words are listed as ON SCREEN.',
       '']
for t, kind, x in rows:
    stamp = f'[{clock(t):>6} | act {clock(t - 3):>6} | ep {tc(t - 3)}]'
    if kind == -1:
        out.append('')
        head = f"{x['label']}" if not x['sub'] else f"  ({x['sub']})"
        out.append(f"{stamp}  == {head.strip()} · {x['place']}{' · ' + x['time'] if x['time'] else ''}")
    elif kind == 0:
        out.append(f"{stamp}  {label(x)}: {x['text']}")
    else:
        out.append(f"{stamp}      ON SCREEN ({x['kind']}): {x['text']}")
os.makedirs(os.path.dirname(TRANSCRIPT), exist_ok=True)
open(TRANSCRIPT, 'w').write('\n'.join(out) + '\n')

# ------------------------------------------------------------------ measurements
wc = [nwords(l['text']) for l in lines]
act = TOTAL - 3.0


def exchanges(maxgap):
    ex = []
    for l in lines:
        if ex and l['on'] - ex[-1]['end'] <= maxgap and l['seg'] == ex[-1]['lines'][-1]['seg']:
            ex[-1]['lines'].append(l)
            ex[-1]['end'] = max(ex[-1]['end'], l['end'])
        else:
            ex.append(dict(on=l['on'], end=l['end'], lines=[l]))
    res = []
    for e in ex:
        sp = sorted({x['who'] for x in e['lines']})
        res.append(dict(start_reel=round(e['on'], 2), start_act=clock(e['on'] - 3), seconds=round(e['end'] - e['on'], 1),
                        lines=len(e['lines']), speakers=sp, words=sum(nwords(x['text']) for x in e['lines']),
                        first=e['lines'][0]['id'], last=e['lines'][-1]['id']))
    return res


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
gaps = [b['on'] - a['end'] for a, b in zip(lines, lines[1:])]
ex3, ex5 = exchanges(3.0), exchanges(5.0)
multi3 = [e for e in ex3 if len(e['speakers']) >= 2]
shots = [b for b in R['beats'] if not b.get('cont')]
shot_len = {}
for (s0, e0), b in zip(starts, R['beats']):
    k = b.get('shotId') if b.get('cont') else b['id']
    shot_len[k] = shot_len.get(k, 0) + (e0 - s0)
render = {}
rl = os.path.join(os.path.dirname(TRANSCRIPT), 'render.log')
if os.path.exists(rl):
    m = re.search(r'wall=([\d.]+)', open(rl).read())
    if m:
        render['picture_render_wall_s'] = round(float(m.group(1)), 1)
M = dict(
    reel_seconds=round(TOTAL, 3), act_seconds=round(act, 3), act_clock=clock(act),
    lines=len(lines), words=sum(wc), median_words_per_line=st.median(wc), mean_words_per_line=round(st.mean(wc), 2),
    lines_3_words_or_fewer=sum(1 for w in wc if w <= 3), cut_off_lines=[l['id'] for l in lines if l.get('cut')],
    overlaps=[(a['id'], b['id'], round(a['end'] - b['on'], 2)) for a, b in zip(lines, lines[1:]) if b['on'] < a['end']],
    gap_between_lines_s=dict(median=round(st.median(gaps), 2), within_0p2_0p6=sum(1 for g in gaps if 0.2 <= g <= 0.6),
                             within_0p6_1p6=sum(1 for g in gaps if 0.6 < g <= 1.6), over_1p6=sum(1 for g in gaps if g > 1.6),
                             under_0p2=sum(1 for g in gaps if g < 0.2)),
    exchanges_3s=dict(definition='consecutive lines with no gap over 3.0 s (last word to next first word), '
                                 'split where a new place or time starts (a beat with seq)',
                      count=len(ex3), mean_lines=round(st.mean(e['lines'] for e in ex3), 2),
                      median_seconds=round(st.median(e['seconds'] for e in ex3), 1),
                      with_two_or_more_speakers=len(multi3),
                      longest=max(ex3, key=lambda e: e['seconds']), list=ex3),
    exchanges_5s=dict(count=len(ex5), mean_lines=round(st.mean(e['lines'] for e in ex5), 2),
                      longest=max(ex5, key=lambda e: e['seconds'])),
    dialogue_seconds=round(union, 1), dialogue_share_of_act=round(union / act, 3), dialogue_share_of_reel=round(union / TOTAL, 3),
    beats=len(R['beats']), shots=len(shots), median_shot_s=round(st.median(shot_len.values()), 2),
    mean_shot_s=round(st.mean(shot_len.values()), 2), shots_under_1p5s=sum(1 for v in shot_len.values() if v < 1.5),
    named_at_reel_s={k: round(v, 2) for k, v in sorted(named.items(), key=lambda kv: kv[1])},
    lines_before_naming=[(l['id'], label(l)) for l in lines if named.get(l['who'], 1e9) > l['on'] + 0.5 / FPS],
    **render,
)
json.dump(M, open(os.path.join(HERE, 'measure.json'), 'w'), indent=1)
top = sorted(ex3, key=lambda e: -e['seconds'])[:6]
print(f"transcript: {TRANSCRIPT}")
print(f"act {M['act_clock']} (reel {clock(TOTAL)}), {M['lines']} lines, {M['words']} words, median {M['median_words_per_line']} "
      f"words/line, {M['lines_3_words_or_fewer']} lines <=3 words, cut-offs {M['cut_off_lines']}, overlaps {M['overlaps']}")
print(f"exchanges (3 s): {len(ex3)}, mean {M['exchanges_3s']['mean_lines']} lines, median {M['exchanges_3s']['median_seconds']} s,"
      f" {len(multi3)} with 2+ speakers; longest: {[(e['start_act'], e['seconds'], e['lines']) for e in top]}")
print(f"exchanges (5 s): {len(ex5)}, longest {M['exchanges_5s']['longest']['seconds']} s")
print(f"dialogue {M['dialogue_seconds']} s = {M['dialogue_share_of_act'] * 100:.1f}% of the act; gaps {M['gap_between_lines_s']}")
print(f"shots {M['shots']} (beats {M['beats']}), median {M['median_shot_s']} s, mean {M['mean_shot_s']} s, <1.5 s: {M['shots_under_1p5s']}")
print('before naming:', M['lines_before_naming'])
