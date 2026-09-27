#!/usr/bin/env python3
"""Ep1 full stick reel v2: transcript + dialogue measures, from the episode plan (episode.mjs writes <work>/plan.json).

  python3 transcript.py <plan.json> <out_dir>
  -> <out_dir>/transcript.txt   every voiced line at its episode start time (first audible word), labelled the way the
                                reel's dialogue strip labels it (a name only once the picture has named them, else the
                                cast's neutral role, else VOICE; Reel.tsx nameAt), plus every in-picture text of more
                                than 3 words at the time it appears (dialogue reels: beat timed[] items; caption beats:
                                onscreen[]; the intro: its text registry, show/intro/shot-table.md §3)
     <out_dir>/dialogue.json    per chapter: lines, words, median words per line, longest conversation (a run of lines
                                in one scene with no gap over 3.0 s from one line's last word to the next line's first,
                                the definition of audio/reel/ep01-act4-v5/report.py and ep01-act2-v2/report.py)
Reviewer scaffolding (the title slate, the notes margin, the captions, shot headers, the timeline bar) is not
in-picture text and is left out.
"""
import json, re, statistics as st, sys
from pathlib import Path

plan = json.load(open(sys.argv[1]))
OUT = Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
FPS = plan['fps']
TAG_SUFFIX = {'O.S.': ' (O.S.)', 'laptop': ' (laptop)', 'monitor': ' (monitor)', 'call': ' (call)', 'door': ' (O.S.)'}
NAMES = {'mas': 'MAS', 'gerg': 'GERG', 'alyi': 'ALYI', 'nole': 'NOLE', 'mario': 'MARIO', 'adelina': 'ADELINA', 'rumpt': 'RUMPT',
         'nedib': 'NEDIB', 'nesnej': 'NESNEJ', 'tasya': 'TASYA', 'kram': 'KRAM', 'radnus': 'RADNUS', 'simed': 'SIMED', 'rima': 'RIMA',
         'neleh': 'NELEH', 'mada': 'MADA', 'ttemme': 'TTEMME', 'terb': 'TERB', 'luap': 'LUAP', 'sama-nos': 'SAMA NOS', 'yrral': 'YRRAL',
         'whale': 'THE WHALE', 'orb': 'THE ORB', 'intern': 'THE INTERN', 'jerdna': 'JERDNA', 'ynoj': 'YNOJ', 'asil': 'ASIL',
         'retep': 'RETEP', 'oigneb': 'OIGNEB', 'melc': 'MELC', 'calendar': 'CALENDAR', 'podium': 'THE PODIUM', 'clod': 'CLOD',
         'chatgtp': 'CHATGTP', 'korg': 'KORG', 'generic': '?'}
DEV = re.compile(r'^\s*(RAIL|DATE RAIL|CHYRON|DATE CHYRON|TICKER|CRAWL|UI|BUTTON|SIGN|POST|TWEET|TITLE|TITLE CARD|CARD|SUPER|CAPTION|LOWER THIRD|ON ?SCREEN)\s*:\s*(.+)$', re.I)

def display(i): return NAMES.get(i, re.sub(r'[-_]+', ' ', i).upper())
def cast_name(ep, i): return ((ep.get('cast') or {}).get(i) or {}).get('name') or display(i)
def words(t): return [w for w in re.split(r'\s+', t.strip()) if re.search(r'[A-Za-z0-9]', w)]
def clock(s): return f"{int(s // 60):2d}:{s % 60:05.2f}"
def device(t):
    m = DEV.match(t)
    return (m.group(1).upper(), m.group(2).strip()) if m else ('', t)

def starts_of(ep):  # schema.ts timeEpisode(ep, 0): chapter-relative beat start frames
    out, acc, prev = [], 0.0, 0
    for b in ep['beats']:
        acc += b['reelDur']
        end = max(prev + 1, round(acc * FPS))
        out.append(prev); prev = end
    return out

# the intro's voiced line and its texts of more than 3 words (show/intro/spec.md §3.2, shot-table.md §3; the design
# frames the V1 master was built to; not read off the picture)
INTRO_VO = (24, 'near the singularity; unclear which side.')
INTRO_TEXT = [(30, 'typed post', 'near the singularity; unclear which side.'), (135, 'alert card', 'MAS MANALT / no equity.'),
              (135, 'tooltip', 'this action cannot be cancelled'), (180, 'screen', 'PLAY JUN 09 2008'),
              (195, 'patch', 'LUAP · CALLED IT. (IN AN ESSAY.)'), (240, 'card', 'GERG MOCKBRAN / ORG CHART: HIM.'),
              (240, 'badge', 'SLEEP: DEPRECATED · PTO: 404'), (300, 'card', 'ALYI / FEELS THE AGI.'),
              (300, 'badge', 'PRODUCTS: 0 · BUNKER: YES'), (345, 'whiteboard', 'BIG BLOB OF COMPUTE'),
              (360, 'card', 'MARIO / HAS CONCERNS. HAS GPUS.'), (360, 'meter', 'DOOM RISK · BUILDING IT ANYWAY'),
              (420, 'card + stamp', 'NOLE / NAMED IT. / SUED OVER IT.'), (420, 'check', '$1,000,000,000* *pledged · received: $133M'),
              (465, 'place card', 'MARIO (UDIAB) · JOINS 2016'), (480, 'sticker', 'HDR · RAY-TRACED* *not really'),
              (570, 'poster', 'KRAM vs NOLE · CAGE MATCH · CANCELED'), (640, 'subtitle', 'now in low-key research preview')]

rows, per = [], []
for ch in plan['chapters']:
    c0 = ch['from']
    if ch['kind'] == 'video':
        if ch['id'] == 'intro':
            f = c0 + INTRO_VO[0]
            rows.append((f / FPS, 'line', 'MAS (V.O., intro)', INTRO_VO[1], 'intro VO'))
            for fr, dev, t in INTRO_TEXT:
                rows.append(((c0 + fr) / FPS, 'text', f'[on screen · intro · {dev}]', t, ''))
        continue
    ep = ch.get('ep')
    if not ep:
        continue
    st0 = starts_of(ep)
    cast = ep.get('cast') or {}
    named = {i: -1e9 for i, cc in cast.items() if (cc or {}).get('known')}
    for i in ch.get('known') or []:
        named[i] = -1e9
    for bi, b in enumerate(ep['beats']):
        for n in ((b.get('dlg') or {}).get('names') or []):
            fr = c0 + st0[bi] + n['at'] * FPS
            if n['id'] not in named or named[n['id']] > fr:
                named[n['id']] = fr
    lines = []
    for bi, b in enumerate(ep['beats']):
        D = b.get('dlg')
        bf = c0 + st0[bi]
        scene = b['id'].split('.')[0]
        if D:
            for l in D['lines']:
                f = bf + l['t'] * FPS
                who = l['who']
                at = named.get(who)
                lab = cast_name(ep, who) if at is not None and at <= f + 0.5 else (cast.get(who) or {}).get('role') or 'VOICE'
                lab = f'{lab.lower()} (v.o.)' if l['tag'] == 'V.O.' else lab + TAG_SUFFIX.get(l['tag'], '')
                lines.append(dict(id=l['id'], who=who, label=lab, text=l['text'], on=f / FPS, end=(f + l['dur'] * FPS) / FPS,
                                  words=len(words(l['text'])), scene=scene, beat=b['id']))
            for x in D.get('timed') or []:
                dv, t = device(x['text'])
                if len(words(t)) > 3:
                    until = f" (to {clock((bf + x['until'] * FPS) / FPS).strip()})" if x.get('until') is not None else ''
                    rows.append(((bf + x['at'] * FPS) / FPS, 'text', f"[on screen{' · ' + dv.lower() if dv else ''}]", t + until, b['id']))
        else:
            for t0 in b.get('onscreen') or []:
                dv, t = device(t0)
                if len(words(t)) > 3:
                    rows.append((bf / FPS, 'text', f"[on screen{' · ' + dv.lower() if dv else ''}]", t, b['id']))
    for L in lines:
        rows.append((L['on'], 'line', L['label'], L['text'], L['id']))
    lines.sort(key=lambda L: L['on'])
    ex = []
    for L in lines:
        if ex and L['on'] - ex[-1][-1]['end'] <= 3.0 and L['scene'] == ex[-1][-1]['scene']:
            ex[-1].append(L)
        else:
            ex.append([L])
    best = max(ex, key=lambda e: e[-1]['end'] - e[0]['on']) if ex else []
    wc = [L['words'] for L in lines]
    per.append(dict(chapter=ch['id'], label=ch['label'], start_s=round(c0 / FPS, 3), dur_s=round(ch['dur'] / FPS, 3),
                    lines=len(lines), words=sum(wc), median_words_per_line=st.median(wc) if wc else 0,
                    lines_3_words_or_fewer=sum(1 for w in wc if w <= 3),
                    speakers=sorted({L['who'] for L in lines}),
                    longest_conversation=dict(seconds=round(best[-1]['end'] - best[0]['on'], 2), lines=len(best), first=best[0]['id'],
                                              last=best[-1]['id'], scene=best[0]['scene'], starts=clock(best[0]['on']).strip()) if best else None,
                    conversations_over_20s=sum(1 for e in ex if e[-1]['end'] - e[0]['on'] > 20),
                    unnamed_labels=sorted({L['label'] for L in lines if L['label'].split(' (')[0].upper() != cast_name(ep, L['who']).upper()})))

rows.sort(key=lambda r: (r[0], r[1] != 'line'))
# a text that carries across a cut (the same item on the next beat) is listed once: drop a repeat within 3.0 s
_last, _keep = {}, []
for r in rows:
    if r[1] == 'text':
        k = re.sub(r' \(to [^)]*\)$', '', r[3])
        if k in _last and r[0] - _last[k] <= 3.0:
            _last[k] = r[0]; continue
        _last[k] = r[0]
    _keep.append(r)
rows = _keep
chs = [(c['from'] / FPS, c) for c in plan['chapters']]
with open(OUT / 'transcript.txt', 'w') as fh:
    fh.write(f"# {plan['title']} · {plan['key']} · stick reel transcript (episode clock, first audible word)\n"
             "# A speaker is labelled by name only once the picture has named them (else the cast's neutral role), as the reel's\n"
             "# dialogue strip does. [on screen] = in-picture text of more than 3 words, at the time it appears. The intro's\n"
             "# texts come from its design table (show/intro/shot-table.md §3), not from the picture. Reviewer scaffolding\n"
             "# (title slate, notes margin, captions, shot headers, timeline bar) is left out.\n")
    k = 0
    for r in rows:
        while k < len(chs) and chs[k][0] <= r[0] + 1e-6:
            c = chs[k][1]
            fh.write(f"\n== {clock(chs[k][0]).strip()}  {c['label']}  ({c['id']} · {c.get('source', '')} · {c['dur'] / FPS:.1f} s)\n")
            k += 1
        fh.write(f"{clock(r[0])}  {r[2]}: {r[3]}\n" if r[1] == 'line' else f"{clock(r[0])}  {r[2]} {r[3]}\n")
    while k < len(chs):
        c = chs[k][1]
        fh.write(f"\n== {clock(chs[k][0]).strip()}  {c['label']}  ({c['id']} · {c.get('source', '')} · {c['dur'] / FPS:.1f} s)\n"); k += 1
    fh.write(f"\n== {clock(plan['total'] / FPS).strip()}  END\n")
allw = [w for p in per for w in [p['words']]]
json.dump(dict(plan=sys.argv[1], total_s=round(plan['total'] / FPS, 3), per_chapter=per,
               totals=dict(lines=sum(p['lines'] for p in per), words=sum(p['words'] for p in per))), open(OUT / 'dialogue.json', 'w'), indent=1)
for p in per:
    lc = p['longest_conversation']
    print(f"{p['chapter']:9s} {p['dur_s']:7.1f}s lines {p['lines']:3d} words {p['words']:4d} median {p['median_words_per_line']:>4} "
          f"longest {lc['seconds'] if lc else 0:5.1f}s/{lc['lines'] if lc else 0} ({lc['first'] if lc else ''}..{lc['last'] if lc else ''})  unnamed {p['unnamed_labels']}")
print('lines', sum(p['lines'] for p in per), 'words', sum(p['words'] for p in per))
