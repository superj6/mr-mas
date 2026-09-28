#!/usr/bin/env python3
"""Ep1 v3.3 stick lock: measurements and the reel transcript (plain python3; reads only).

  python3 audio/reel/ep01-v33/measure.py
      reads  show/reel/ep01-v33/*.json, the render's plan (studio/out/reel-work/ep01-v33-stick/plan.json) and sidecars
             (out/ep01/reel/ep01-v33-stick-chapters.json, -measure.json, the mixer's mix-qa.json), the v3.2 timelines
      writes show/episodes/ep01/production/full-v3/lock-v33-transcript.txt   (episode clock, first audible word)
             audio/reel/ep01-v33/measure.json                              (runtimes, pacing v3.2/v3.3, words, V.O.)

The transcript follows show/episodes/ep01/production/stick/transcript-v2.txt: a speaker is labelled by name only once
the picture (or Mas's voice) has named them, as the reel's dialogue strip does; [on screen] = in-picture text of more
than 3 words (rails always), at the time it appears. The intro's texts are the v2 transcript's (the same file); the
outro's are its README's credit lines. Nothing here was watched or heard.
"""
import json
import os
import re
import statistics as st
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
sys.path.insert(0, os.path.join(ROOT, 'studio/src/reel/tools'))
import pacing  # noqa: E402

FPS = 24
WORK = os.path.join(ROOT, 'studio/out/reel-work/ep01-v33-stick')
OUT_TXT = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/lock-v33-transcript.txt')
OUT_JSON = os.path.join(ROOT, 'audio/reel/ep01-v33/measure.json')
V2_TXT = os.path.join(ROOT, 'show/episodes/ep01/production/stick/transcript-v2.txt')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TAGS = ['COLD', 'A1', 'A2', 'A3', 'A4', 'TAG']
V2 = {s: f'show/reel/ep01-v32/ep01-v32-{s}.json' for s in SEGS}        # (the comparison is v3.2 -> v3.3 here)
V3 = {s: f'show/reel/ep01-v33/ep01-v33-{s}.json' for s in SEGS}
EST = {'coldopen': 26.67, 'act1': 330.6, 'act2': 190.57, 'act3': 133.4, 'act4': 504.84, 'tag': 42.33}   # the v3.3 plans' story_s (script-v33-notes §1: 20:28.4)
OUTRO_TEXT = [(0.375, 'mr. mas · ep1.0_research_preview.md'), (2.5, 'art · script · music · voices · edit: opus 5.5'),
              (3.125, 'prompt: jgon'), (5.0, 'viewer: human ✓')]   # the outro README's table (o9, o60, o75, o120)


def jl(p):
    return json.load(open(os.path.join(ROOT, p)))


def fmt(t):
    return f'{int(t // 60)}:{t % 60:05.2f}'


def beat_starts(beats):
    out, acc, prev = [], 0.0, 0
    for b in beats:
        acc += b['reelDur']
        end = max(prev + 1, round(acc * FPS))
        out.append(prev / FPS)
        prev = end
    return out, prev / FPS


def device(t):
    m = re.match(r'^\s*(RAIL|TICKER|UI|POST|TITLE|CARD)\s*:\s*(.+)$', t)
    return (m.group(1).lower(), m.group(2)) if m else ('', t)


def words(text):
    return len(re.findall(r"[\w'’-]+", text))


def transcript(plan):
    ch = {c['id']: c for c in plan['chapters']}
    known = {}
    out = ['# ep1.0_research_preview.md · ep01-v33-stick · the v3.3 stick lock\'s transcript (episode clock, first audible word)',
           '# A speaker is labelled by name only once the picture (or Mas\'s voice) has named them, else the cast\'s neutral role, as',
           '# the reel\'s dialogue strip does. [on screen] = in-picture text of more than 3 words (rails always), at the time it',
           '# appears. The intro\'s texts are the v2 transcript\'s (the same file, re-timed); the outro\'s are its README\'s credits.',
           '# Reviewer scaffolding (title slate, notes margin, captions, shot headers, timeline bar) is left out.', '']
    v2 = open(V2_TXT).read().split('\n')
    i0 = next(i for i, l in enumerate(v2) if l.startswith('== ') and 'INTRO' in l)
    v2_intro_at = sum(float(x) * m for x, m in zip(re.match(r'== (\d+):([\d.]+)', v2[i0]).groups(), (60, 1)))
    intro_lines = []
    for l in v2[i0 + 1:]:
        if not l.strip():
            break
        m = re.match(r'\s*(\d+):([\d.]+)\s+(.*)$', l)
        intro_lines.append((int(m.group(1)) * 60 + float(m.group(2)) - v2_intro_at, m.group(3)))
    for c in plan['chapters']:
        t0 = c['from'] / FPS
        out.append(f'== {fmt(t0)}  {c["label"]}  ({c["id"]} · {c["source"]} · {c["dur"] / FPS:.1f} s)')
        if c['id'] == 'intro':
            out += [f' {fmt(t0 + dt)}  {txt}' for dt, txt in intro_lines]
        elif c['id'] == 'outro':
            out += [f' {fmt(t0 + dt)}  [on screen · outro · credits] {txt}' for dt, txt in OUTRO_TEXT]
        elif c['kind'] == 'reel':
            seg = next((s for s in SEGS if c['source'] == f'ep01-v33-{s}'), None)
            if seg is None:   # the card
                for b in c['ep']['beats']:
                    for o in b.get('onscreen', []):
                        out.append(f' {fmt(t0)}  [on screen] {o}')
            else:
                tl = jl(V3[seg])
                cast = tl.get('cast', {})
                starts, _ = beat_starts(tl['beats'])
                rows = []
                prev_texts = set()
                for b, s0 in zip(tl['beats'], starts):
                    cur_texts = {(o['text'] if isinstance(o, dict) else o) for o in b.get('onscreen', [])}
                    for n in b.get('names', []):
                        known.setdefault(n['id'], t0 + s0 + n['at'])
                    for o in b.get('onscreen', []):
                        txt, at = (o['text'], o.get('at') or 0.0) if isinstance(o, dict) else (o, 0.0)
                        if txt in prev_texts:
                            continue   # still on screen from the shot before
                        dev, body = device(txt)
                        if dev == 'rail':
                            rows.append((t0 + s0 + at, 1, f'[on screen · rail] {body}'))
                        elif dev != 'ui' and words(body) > 3:
                            rows.append((t0 + s0 + at, 1, f'[on screen] {body}'))
                    for l in b['lines']:
                        at = t0 + s0 + l['t']
                        if l.get('tag') == 'V.O.':
                            rows.append((at, 0, f'mas (v.o.): {l["text"]}'))
                            continue
                        who = l['who']
                        info = cast.get(who, {})
                        is_known = info.get('known') or (who in known and known[who] <= at + 1e-6)
                        name = info.get('name') or who.replace('-', ' ').upper()
                        label = name if is_known or not info.get('role') else info['role']
                        tag = l.get('tag') or ''
                        suf = f' ({tag})' if tag in ('O.S.',) else (f' ({tag})' if tag in ('call', 'monitor', 'laptop', 'tv') else '')
                        rows.append((at, 0, f'{label}{suf}: {l["text"]}'))
                    prev_texts = cur_texts
                for who, info in cast.items():
                    if info.get('known'):
                        known.setdefault(who, t0)
                out += [f' {fmt(t)}  {txt}' for t, _, txt in sorted(rows, key=lambda r: (r[0], r[1]))]
        out.append('')
    return '\n'.join(out) + '\n'


def talk(files):
    stays, shots, lines, total = pacing.load(files)
    rows = []
    for s in stays:
        if s['loc'] != 'void' and s['lines'] and s['e'] - s['s'] >= pacing.TALK_MIN:
            L = sorted(s['lines'])
            rows.append((L[0][0] - s['s'], s['e'] - max(x[1] for x in L)))
    real = [s for s in stays if s['loc'] != 'void']
    d = [s['e'] - s['s'] for s in real]
    ent, ext = [r[0] for r in rows], [r[1] for r in rows]
    return {'shots': len(shots), 'minutes': round(total / 60, 2), 'asl_s': round(total / len(shots), 2),
            'median_shot_s': round(st.median([x for _, x in shots]), 2), 'stays': len(real), 'median_stay_s': round(st.median(d), 1),
            'stays_under_10': sum(x < 10 for x in d), 'stays_10_30': sum(10 <= x < 30 for x in d), 'stays_30_60': sum(30 <= x < 60 for x in d),
            'stays_60_plus': sum(x >= 60 for x in d), 'talk_stays': len(rows), 'entry_air_median_s': round(st.median(ent), 1),
            'entry_air_2s_or_less': sum(e <= 2 for e in ent), 'exit_air_median_s': round(st.median(ext), 1),
            'exit_air_1p5s_or_less': sum(e <= 1.5 for e in ext), 'lines': len(lines), 'jcut_lines': sum(1 for _, p, _ in lines if p),
            'lcut_lines': sum(1 for _, _, q in lines if q)}


def no_vo(files):
    d = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'ep01-v33-novo')
    os.makedirs(d, exist_ok=True)
    out = []
    for t, f in files:
        j = jl(f)
        for b in j['beats']:
            b['lines'] = [l for l in b['lines'] if l.get('tag') != 'V.O.']
        p = os.path.join(d, os.path.basename(f))
        json.dump(j, open(p, 'w'))
        out.append((t, p))
    return out


def speech_stats(paths):
    all_w, mas_w, vo_w, vo_n = 0, 0, 0, 0
    for p in paths:
        for b in jl(p)['beats']:
            if b['id'] == 'OUT.01':
                continue
            for l in b['lines']:
                w = words(l['text'])
                all_w += w
                if l.get('who') == 'mas':
                    mas_w += w
                    if l.get('tag') == 'V.O.':
                        vo_w += w
                        vo_n += 1
    return {'words': all_w, 'mas_words': mas_w, 'mas_share': round(mas_w / all_w, 3), 'vo_lines': vo_n, 'vo_words': vo_w}


def main():
    plan = json.load(open(os.path.join(WORK, 'plan.json')))
    m = {'plan_total_s': round(plan['total'] / FPS, 3), 'chapters': []}
    for c in plan['chapters']:
        m['chapters'].append({'id': c['id'], 'from': fmt(c['from'] / FPS), 'seconds': round(c['dur'] / FPS, 3)})
    seg_s = {}
    for s in SEGS:
        _, tot = beat_starts(jl(V3[s])['beats'])
        v2b = [b for b in jl(V2[s])['beats'] if b['id'] != 'OUT.01']
        _, tot2 = beat_starts(v2b)
        seg_s[s] = {'v33_s': round(tot, 3), 'v32_s_src': round(tot2, 3), 'estimate_s': EST[s], 'vs_estimate_s': round(tot - EST[s], 2),
                    'vs_v32_s': round(tot - tot2, 2)}
    m['segments'] = seg_s
    m['story_v33_s'] = round(sum(v['v33_s'] for v in seg_s.values()), 3)
    m['story_v32_s'] = round(sum(v['v32_s_src'] for v in seg_s.values()), 3)
    v2f, v3f = list(zip(TAGS, [V2[s] for s in SEGS])), list(zip(TAGS, [V3[s] for s in SEGS]))
    m['pacing'] = {'v32': talk(v2f), 'v33': talk(v3f), 'v32_spoken_only': talk(no_vo(v2f)), 'v33_spoken_only': talk(no_vo(v3f))}
    m['speech'] = {'v32': speech_stats([V2[s] for s in SEGS]), 'v33': speech_stats([V3[s] for s in SEGS])}
    for k, f in (('render_chapters', 'out/ep01/reel/ep01-v33-stick-chapters.json'), ('render_measure', 'out/ep01/reel/ep01-v33-stick-measure.json'),
                 ('mix_qa', 'studio/out/reel-work/ep01-v33-stick/mix-qa.json')):
        p = os.path.join(ROOT, f)
        if os.path.exists(p):
            j = json.load(open(p))
            if k == 'mix_qa':
                j = {x: j.get(x) for x in ('seconds', 'master', 'dialogue', 'silences', 'missing', 'chapters')}
            m[k] = j
    json.dump(m, open(OUT_JSON, 'w'), indent=1, ensure_ascii=False)
    open(OUT_TXT, 'w').write(transcript(plan))
    print(json.dumps({k: m[k] for k in ('segments', 'story_v33_s', 'story_v32_s', 'speech')}, indent=1))
    for k, v in m['pacing'].items():
        print(k, v)
    print(f'wrote {os.path.relpath(OUT_TXT, ROOT)} and {os.path.relpath(OUT_JSON, ROOT)}')


if __name__ == '__main__':
    main()
