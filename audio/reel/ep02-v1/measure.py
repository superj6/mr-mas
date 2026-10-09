#!/usr/bin/env python3
"""Ep2 v1 base lock (or its EL-timed master): measurements and the reel transcript (plain python3; reads only). A copy of
Ep1's (audio/reel/ep01-v35/measure.py, locked) with the v3.4 comparison taken out.

  python3 audio/reel/ep02-v1/measure.py [--el]
      reads  show/reel/ep02-v1/*.json (--el: show/reel/ep02-v1-el/), the stick reel's plan
             (studio/out/reel-work/<key>/plan.json, from studio/src/reel/tools/episode.mjs --plan; no reel is rendered)
      writes show/episodes/ep02/production/v1/lock-v1[-el]-transcript.txt   (episode clock, first audible word)
             audio/reel/ep02-v1/measure[-el].json                          (runtimes and frames, the gaps between lines per
                                                                           act, pacing, words, the V.O.)
The transcript labels a speaker by name only once the picture (or Mas's voice) has named them, as the reel's dialogue
strip does; [on screen] = in-picture text of more than 3 words (rails always). The intro's line is Ep2's ("her", then the
typing indicator); the outro's are its credits. Nothing here was watched or heard.
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
EL = '--el' in sys.argv
KEY = 'ep02-v1-el' if EL else 'ep02-v1'
WORK = os.path.join(ROOT, f'studio/out/reel-work/{KEY}-stick')
OUT_TXT = os.path.join(ROOT, f'show/episodes/ep02/production/v1/lock-v1{"-el" if EL else ""}-transcript.txt')
OUT_JSON = os.path.join(ROOT, f'audio/reel/ep02-v1/measure{"-el" if EL else ""}.json')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TAGS = ['COLD', 'A1', 'A2', 'A3', 'A4', 'TAG']
V3 = {s: f'show/reel/{KEY}/{KEY}-{s}.json' for s in SEGS}
BP = 'show/episodes/ep02/production/v1/beat-plan/{}.json'
EST = {s: (json.load(open(os.path.join(ROOT, BP.format(s)))).get('story_s') or {}).get('estimate') for s in SEGS
       if os.path.exists(os.path.join(ROOT, BP.format(s)))}
INTRO_TEXT = [(1.0, 'mas (v.o.): her'), (1.5, '[on screen · intro] a typing indicator pulses (three dots, nothing sent)')]
OUTRO_TEXT = [(0.375, 'mr. mas · ep1.1_her.wav'), (2.5, 'art · script · music · voices · edit: opus 5.5'),
              (3.125, 'prompt: jgon'), (5.0, 'viewer: verified: human')]   # outro B's timings (o9, o60, o75, o120)


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
    out = [f'# ep1.1_her.wav · {KEY}-stick · the Ep2 v1 lock\'s transcript (episode clock, first audible word)',
           '# A speaker is labelled by name only once the picture (or Mas\'s voice) has named them, else the cast\'s neutral role, as',
           '# the reel\'s dialogue strip does. [on screen] = in-picture text of more than 3 words (rails always), at the time it',
           '# appears. The intro\'s line is Ep2\'s; the outro\'s are its credits.',
           '# Reviewer scaffolding (title slate, notes margin, captions, shot headers, timeline bar) is left out.', '']
    intro_lines = INTRO_TEXT
    for c in plan['chapters']:
        t0 = c['from'] / FPS
        out.append(f'== {fmt(t0)}  {c["label"]}  ({c["id"]} · {c["source"]} · {c["dur"] / FPS:.1f} s)')
        if c['id'] == 'intro':
            out += [f' {fmt(t0 + dt)}  {txt}' for dt, txt in intro_lines]
        elif c['id'] == 'outro':
            out += [f' {fmt(t0 + dt)}  [on screen · outro · credits] {txt}' for dt, txt in OUTRO_TEXT]
        elif c['kind'] == 'reel':
            seg = next((s for s in SEGS if c['source'] == f'{KEY}-{s}'), None)
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
    d = os.path.join(os.environ.get('TMPDIR', '/tmp'), f'{KEY}-novo')
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


def gaps(path):
    """the gaps between lines: inside each beat, and on the segment clock (all lines / spoken only); an overlap < 0"""
    beats = jl(path)['beats']
    inner, spans, t0 = [], [], 0.0
    for b in beats:
        run = None
        for l in sorted(b['lines'], key=lambda x: x['t']):
            if run is not None:
                inner.append(l['t'] - run)
            run = l['t'] + l['dur'] if run is None else max(run, l['t'] + l['dur'])
            spans.append((t0 + l['t'], t0 + l['t'] + l['dur'], l.get('tag') == 'V.O.'))
        t0 += b['reelDur']

    def seq_gaps(xs):
        out, run = [], None
        for s_, e_ in sorted(xs):
            if run is not None:
                out.append(s_ - run)
            run = e_ if run is None else max(run, e_)
        return out
    allg = seq_gaps([(a, b) for a, b, _ in spans])
    sp = seq_gaps([(a, b) for a, b, vo in spans if not vo])
    med = lambda xs: round(st.median(xs), 3) if xs else None
    return {'inside_beats_median_s': med(inner), 'inside_beats_n': len(inner),
            'inside_beats_quick_share': round(sum(1 for g in inner if g <= 0.35) / len(inner), 2) if inner else None,
            'act_clock_median_s': med(allg), 'act_clock_n': len(allg), 'spoken_only_act_clock_median_s': med(sp),
            'overlaps': sum(1 for g in inner if g < 0)}


def frames(beats):
    return beat_starts(beats)[1] * FPS


def main():
    pp = os.path.join(WORK, 'plan.json')
    if not os.path.exists(pp):
        raise SystemExit(f'no {os.path.relpath(pp, ROOT)}: run the stick reel\'s plan first (studio/src/reel/tools/episode.mjs --plan)')
    plan = json.load(open(pp))
    m = {'plan_total_s': round(plan['total'] / FPS, 3), 'chapters': []}
    for c in plan['chapters']:
        m['chapters'].append({'id': c['id'], 'from': fmt(c['from'] / FPS), 'seconds': round(c['dur'] / FPS, 3)})
    seg_s = {}
    for s in SEGS:
        _, tot = beat_starts(jl(V3[s])['beats'])
        est = EST.get(s)
        seg_s[s] = {'seconds': round(tot, 3), 'frames': round(tot * FPS), 'estimate_s': est,
                    'vs_estimate_s': round(tot - est, 2) if est is not None else None}
    m['segments'] = seg_s
    m['story_s'] = round(sum(v['seconds'] for v in seg_s.values()), 3)
    m['story_frames'] = sum(v['frames'] for v in seg_s.values())
    m['gaps'] = {s: gaps(V3[s]) for s in SEGS}
    vo = [(s, b['id'], l['id'], l['text']) for s in SEGS for b in jl(V3[s])['beats'] for l in b['lines'] if l.get('tag') == 'V.O.']
    m['inner_voice'] = {'lines': len(vo), 'rows': [f'{s} {bid} {lid}: {t}' for s, bid, lid, t in vo]}
    v3f = list(zip(TAGS, [V3[s] for s in SEGS]))
    m['pacing'] = {'lock': talk(v3f), 'lock_spoken_only': talk(no_vo(v3f))}
    m['speech'] = speech_stats([V3[s] for s in SEGS])
    json.dump(m, open(OUT_JSON, 'w'), indent=1, ensure_ascii=False)
    open(OUT_TXT, 'w').write(transcript(plan))
    print(json.dumps({k: m[k] for k in ('segments', 'story_s', 'story_frames', 'speech')}, indent=1))
    print(f"inner voice {m['inner_voice']['lines']} lines; gaps between lines (median s, inside beats · act clock · spoken only):")
    for s in SEGS:
        g = m['gaps'][s]
        print(f"  {s:<9} {g['inside_beats_median_s']} (n {g['inside_beats_n']}) · {g['act_clock_median_s']} · {g['spoken_only_act_clock_median_s']}")
    print(f'wrote {os.path.relpath(OUT_TXT, ROOT)} and {os.path.relpath(OUT_JSON, ROOT)}')


if __name__ == '__main__':
    main()
