#!/usr/bin/env python3
"""Ep1 Act Four v5: plain SDH captions (SRT + WebVTT) and the audio-description track, built from the approved stick
timing. Standard library only; light (a second or two of CPU); no audio or video is read.

  python3 show/episodes/ep01/production/act4/captions/tools/build_access.py

Inputs (read-only):
  show/reel/ep01-act4-v5.json                         the approved stick timeline: beats, lines (t, dur, words), tags
  audio/ep01/act4/dialogue/lines-v5.json              the takes: speaker, mode, on_camera
  show/episodes/ep01/production/act4/shots-locked-v5.json   the pixel lock (frame cross-check only)
  captions/tools/access_v5_src.json                   the hand-written part: sentence case, fixes, labels, SFX, AD

Outputs (generated; never hand-edit), in captions/:
  ep01-act4-v5.en-sdh.act.srt / .vtt     act clock: 00:00:00.000 = the act's first frame (the pixel preview's clock)
  ep01-act4-v5.en-sdh.reel.srt / .vtt    +3.000 s: out/reel/ep01-act4-v5.mp4 and audio/reel/ep01-act4-v5/mix.wav
                                         (both open on a 72-frame title card)
  ep01-act4-v5.ad.act.vtt / .reel.vtt    the audio-description cues as a WebVTT "descriptions" track
  ep01-act4-v5.ad-script.md              the AD script a describer reads from (timed, with fit measurements)
  qa-v5.json                             the measurements the README quotes

Options: --episode also writes the two caption files and the AD track on the episode clock (+12:31.000).

Timing rules (the lock's own, so captions and picture agree to the frame):
  * a line's speech onset = beat realStart - 751 + t; its end = onset + dur (the take's audible span)
  * a cue starts on the frame its first sound falls in (floor) and its speech ends after the frame of its last sound
    (ceil); it then holds 12 frames (0.5 s), is at least 24 frames (1 s) long, and always ends 2 frames before the
    next cue starts
  * long turns split at sentence ends (then at clause breaks) from the takes' word times: at most 2 rows of 42
    characters and about 6.5 s of speech per cue
  * sound captions only fill free time; a sound caption that would get under 20 frames is dropped (and reported)
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.dirname(HERE)
ROOT = os.path.abspath(os.path.join(HERE, *['..'] * 7))
TIMELINE = os.path.join(ROOT, 'show/reel/ep01-act4-v5.json')
LINES = os.path.join(ROOT, 'audio/ep01/act4/dialogue/lines-v5.json')
LOCK = os.path.join(ROOT, 'show/episodes/ep01/production/act4/shots-locked-v5.json')
SRC = os.path.join(HERE, 'access_v5_src.json')

FPS = 24
HOLD_F = 12          # 0.5 s read hold after the last sound
MIN_F = 24           # 1.0 s minimum on screen
GAP_F = 2            # frames between consecutive cues
SFX_MIN_F = 20       # a sound caption shorter than this is dropped
ROW = 42             # characters per row
ROWS = 2
MAX_SPEECH_S = 6.5   # speech inside one cue, before a split is forced
CPS_FLAG = 20.0      # reading-speed flag (characters per second of display)
CPS_TARGET = 17.0    # a cue stays up at least len/17 s when the next cue leaves room
AD_SYL_PER_S = 4.0   # conservative describer pace for the fit estimate (~160 wpm)
AD_LEAD = 0.15       # seconds of air an AD cue keeps before the next speech
AD_TIGHT = 0.15      # an estimate this far over its gap is 'tight' (a describer's pace covers it), beyond is a flag
OFFSETS = {'act': 0.0, 'reel': 3.0, 'ep': 751.0}

NAMES = {'neleh': 'NELEH', 'mada': 'MADA', 'mas': 'MAS', 'alyi': 'ALYI', 'rima': 'RIMA', 'employee': 'EMPLOYEE',
         'gerg': 'GERG', 'mario': 'MARIO', 'adelina': 'ADELINA', 'ttemme': 'TTEMME', 'tasya': 'TASYA', 'terb': 'TERB'}
GENERIC = {'neleh': 'WOMAN', 'rima': 'WOMAN', 'adelina': 'WOMAN'}   # used only if a label is needed before the name
DESCRIPTIVE = {'employee'}   # IDs that are descriptions, not names, so never wait for a plate
OFFSCREEN_CAMERA = {'os', 'vo', 'speaker', 'reflection', 'monitor'}


def load():
    tl = json.load(open(TIMELINE))
    takes = {l['id']: l for l in json.load(open(LINES))}
    src = json.load(open(SRC))
    lock = json.load(open(LOCK)) if os.path.exists(LOCK) else None
    return tl, takes, src, lock


# ------------------------------------------------------------------ text helpers
def smart_quotes(s: str) -> str:
    """straight double quotes alternate open / close within a line"""
    out, opening = [], True
    for ch in s:
        if ch == '"':
            out.append('“' if opening else '”')
            opening = not opening
        else:
            out.append(ch)
    return ''.join(out)


def sentence_end(tok: str) -> bool:
    return bool(re.search(r'[.?!…—]["”’)]*$', tok))


def clause_break_after(tok: str) -> bool:
    return bool(re.search(r'[,;:]["”’)]*$', tok))


BREAK_BEFORE = {'with', 'and', 'but', 'to', 'for', 'that', 'as', 'who', 'which', 'will', 'while'}


def is_label_tok(tok: str) -> bool:
    return bool(re.match(r'^[A-Z]{2,}:$', tok)) or tok.endswith('):')


def best_split(toks: list[str], limit: int, bonus=(10, 6, 3)) -> int:
    """index i: split toks[:i] | toks[i:]. Balanced, with a bonus for a sentence end, a clause break or a following
    conjunction; never leaves a speaker label alone on its row; both sides must fit `limit` when they can"""
    n = len(toks)
    total = len(' '.join(toks))
    lab_end = 0                                # tokens of a leading "NAME:" / "NAME (manner):" label
    if toks and re.match(r'^[A-Z]{2,}', toks[0]):
        for k, t in enumerate(toks[:5]):
            if t.endswith(':'):
                lab_end = k + 1
                break
    best, best_score = None, None
    for i in range(1, n):
        left = len(' '.join(toks[:i]))
        right = total - left - 1
        score = max(left, right)
        prev = toks[i - 1]
        if i <= lab_end:
            score += 2000                      # label alone, or inside a "(manner)" label
        elif sentence_end(prev):
            score -= bonus[0]
        elif clause_break_after(prev):
            score -= bonus[1]
        elif toks[i].lower().strip('“"') in BREAK_BEFORE:
            score -= bonus[2]
        if left > limit or right > limit:
            score += 1000
        if best_score is None or score < best_score:
            best, best_score = i, score
    return best


def wrap(text: str) -> list[str]:
    rows = []
    for part in text.split('\n'):           # rows the packer set (whole sentences, or an attached sound caption)
        if len(part) <= ROW:
            rows.append(part)
            continue
        toks = part.split(' ')
        i = best_split(toks, ROW)
        rows += [' '.join(toks[:i]), ' '.join(toks[i:])]
    return rows


def fits(text: str) -> bool:
    rows = wrap(text)
    return len(rows) <= ROWS and max(len(r) for r in rows) <= ROW


def tc(t: float, sep: str) -> str:
    t = max(0.0, t)
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}'


# ------------------------------------------------------------------ syllables (AD fit estimate only)
ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
        'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']


def num_words(n: int) -> str:
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ('' if n % 10 == 0 else ' ' + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' ' + num_words(n % 100))
    if 2000 <= n < 2100:
        return 'twenty ' + (num_words(n - 2000) if n > 2009 else 'oh ' + ONES[n - 2000])
    return num_words(n // 1000) + ' thousand' + ('' if n % 1000 == 0 else ' ' + num_words(n % 1000))


def spoken(text: str) -> str:
    def time(m):
        h, mm = int(m.group(1)), int(m.group(2))
        return num_words(h) + ' ' + ('oh ' + ONES[mm] if mm < 10 else num_words(mm))
    s = re.sub(r'\b(\d{1,2}):(\d{2})\b', time, text)
    s = re.sub(r'\b(\d+)\b', lambda m: num_words(int(m.group(1))), s)
    s = re.sub(r'\b(AM|PM|CEO|OK|AI)\b', lambda m: ' '.join(m.group(1)), s)
    s = s.replace('NopeAI', 'nope A I').replace('Q-star', 'Q star')
    return s


def syl_word(w: str) -> int:
    w = w.lower()
    if len(w) == 1:
        return 2 if w == 'w' else 1
    w = re.sub(r'[^a-z]', '', w)
    if not w:
        return 0
    if len(w) <= 3:
        return 1
    w = re.sub(r'(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$', '', w)
    w = re.sub(r'^y', '', w)
    return max(1, len(re.findall(r'[aeiouy]{1,2}', w)))


def syllables(text: str) -> int:
    return sum(syl_word(w) for w in re.findall(r"[A-Za-z']+", spoken(text)))


# ------------------------------------------------------------------ build
def build(tl, takes, src, lock):
    beats = tl['beats']
    act0 = beats[0]['realStart']
    warn: list[str] = []

    # names known on screen by act time (the stick's own `names`), plus the cast's `known` flags
    first_named = {}
    for b in beats:
        s0 = b['realStart'] - act0
        for nm in b.get('names', []):
            first_named.setdefault(nm['id'], s0 + nm['at'])
    for cid, c in tl['cast'].items():
        if c.get('known'):
            first_named[cid] = 0.0

    beat_frame = {b['id']: b.get('frame', '') for b in beats}
    # every line on the act clock
    lines = []
    for b in beats:
        s0 = b['realStart'] - act0
        for l in b['lines']:
            on = s0 + l['t']
            lines.append(dict(id=l['id'], who=l['who'], tag=l.get('tag', ''), beat=b['id'], on=on, off=on + l['dur'],
                              words=[(w[0], on + w[1], on + w[2]) for w in l['words']], text=l['text']))
    lines.sort(key=lambda x: x['on'])

    # lock cross-check (frames)
    lock_diff = []
    if lock:
        lk = {x['id']: x for x in lock['lines']}
        for ln in lines:
            x = lk.get(ln['id'])
            if not x:
                warn.append(f"{ln['id']}: not in the lock")
                continue
            fi, fo = math.floor(ln['on'] * FPS + 1e-6), math.ceil(ln['off'] * FPS - 1e-6)
            if abs(fi - x['abs_in']) > 1 or abs(fo - x['abs_out']) > 1:
                lock_diff.append((ln['id'], fi, x['abs_in'], fo, x['abs_out']))

    # ---- dialogue cues
    cues = []
    prev_who, prev_end, prev_labeled = None, -99.0, False
    for ln in lines:
        take = takes[ln['id']]
        text = src['sentence_case'].get(ln['id'], ln['text'])
        for old, new, _why in src['text_fixes'].get(ln['id'], []):
            if old not in text:
                warn.append(f"{ln['id']}: text fix '{old}' not found")
            text = text.replace(old, new)
        text = smart_quotes(text)
        toks = text.split()
        # map display tokens to word times (tokens without letters ride on their neighbour)
        wi = 0
        tt = []
        for tok in toks:
            if re.search(r'[A-Za-z0-9]', tok) and wi < len(ln['words']):
                w = ln['words'][wi]
                tt.append([tok, w[1], w[2]])
                wi += 1
            else:
                tt.append([tok, None, None])
        for k, x in enumerate(tt):          # fill punctuation-only tokens
            if x[1] is None:
                nb = tt[k - 1] if k else tt[k + 1]
                x[1], x[2] = nb[1], nb[2]
        for x in tt:                         # clamp to the placed line (Mario's take runs past the cut-off)
            x[1] = min(max(x[1], ln['on']), ln['off'])
            x[2] = min(max(x[2], ln['on']), ln['off'])
        tt[-1][2] = ln['off']

        m = re.match(r'OTS\S* · (?:back )?over (\w+)', beat_frame[ln['beat']])
        ots_back = bool(m) and m.group(1).lower() == ln['who']      # the speaker is the shoulder we look over
        offscreen = bool(ln['tag']) or take['on_camera'] in OFFSCREEN_CAMERA or ots_back
        changed = ln['who'] != prev_who
        gap = ln['on'] - prev_end
        in_exchange = prev_labeled and gap < 4.0
        need = (ln['id'] in src['label_always']) or (ln['id'] in src['manner']) or (
            (offscreen or in_exchange) and (changed or gap > 4.0))
        label = ''
        if need:
            nm = NAMES[ln['who']]
            if ln['who'] not in DESCRIPTIVE and first_named.get(ln['who'], 1e9) > ln['on'] + 0.05:
                nm = GENERIC.get(ln['who'], 'MAN')
                warn.append(f"{ln['id']}: label before the name is on screen; used {nm}")
            man = src['manner'].get(ln['id'])
            label = f'{nm} ({man}): ' if man else f'{nm}: '

        # sentences -> pieces (a sentence too long for one cue splits at its best clause break) -> rows -> cues.
        # A row holds whole pieces only, so a row break always falls on a sentence or clause end; a piece longer
        # than one row takes a cue of its own and wraps.
        sents, cur = [], []
        for x in tt:
            cur.append(x)
            if sentence_end(x[0]):
                sents.append(cur)
                cur = []
        if cur:
            sents.append(cur)
        pieces = []
        for k, sn in enumerate(sents):
            stack = [sn]
            while stack:
                p = stack.pop(0)
                lab = label if (k == 0 and not pieces and p is sn) else ''
                txt = lab + ' '.join(x[0] for x in p)
                if fits(txt) and (p[-1][2] - p[0][1]) <= MAX_SPEECH_S:
                    pieces.append(p)
                else:
                    i = best_split([x[0] for x in p], ROW * ROWS - len(lab), bonus=(40, 25, 12))
                    stack[0:0] = [p[:i], p[i:]]
        packed = []                            # each: [rows(list of lists of tokens)]
        rows: list = []
        for p in pieces:
            first = not packed and not rows
            ptxt = (label if first else '') + ' '.join(x[0] for x in p)
            cue_start = rows[0][0][1] if rows else p[0][1]
            time_ok = p[-1][2] - cue_start <= MAX_SPEECH_S
            if len(ptxt) > ROW:                # needs two rows: a cue of its own
                if rows:
                    packed.append(rows)
                packed.append([p])
                rows = []
                continue
            if rows and time_ok and len(rows) >= 1:
                last_txt = (label if (not packed and len(rows) == 1) else '') + ' '.join(x[0] for x in rows[-1])
                if len(last_txt) + 1 + len(ptxt) <= ROW:
                    rows[-1] = rows[-1] + p
                    continue
                if len(rows) < ROWS:
                    rows.append(p)
                    continue
            if rows:
                packed.append(rows)
            rows = [p]
        if rows:
            packed.append(rows)
        merged = []                             # a piece under ~1 s of speech joins its neighbour if they wrap
        for rws in packed:
            if merged:
                prev = merged[-1]
                ptoks = [x for r in prev for x in r]
                ctoks = [x for r in rws for x in r]
                shortest = min(ptoks[-1][2] - ptoks[0][1], ctoks[-1][2] - ctoks[0][1])
                lab = label if len(merged) == 1 else ''
                both = lab + ' '.join(x[0] for x in ptoks + ctoks)
                rows2 = wrap(both)
                clean = len(rows2) == 1 or bool(re.search(r'[.?!\u2026,;:]["\u201d]?$', rows2[0]))
                # under 0.6 s of speech always joins (else it flashes); under 1 s joins only on a clean row break
                if (shortest < 0.6 or (shortest < 1.0 and clean)) and fits(both) \
                        and ctoks[-1][2] - ptoks[0][1] <= MAX_SPEECH_S:
                    merged[-1] = [ptoks + ctoks]
                    continue
            merged.append(rws)
        packed = merged
        for j, rws in enumerate(packed):
            lab = label if j == 0 else ''
            if len(rws) == 1:
                full = lab + ' '.join(x[0] for x in rws[0])
            else:
                full = lab + '\n'.join(' '.join(x[0] for x in r) for r in rws)
            toks = [x for r in rws for x in r]
            cues.append(dict(id=ln['id'] + (f'.{j + 1}' if len(packed) > 1 else ''), line=ln['id'], kind='speech',
                             who=ln['who'], s=math.floor(toks[0][1] * FPS + 1e-6) / FPS,
                             speech_end=math.ceil(toks[-1][2] * FPS - 1e-6) / FPS, text=full))
        prev_who, prev_end, prev_labeled = ln['who'], ln['off'], bool(label) or (in_exchange and not changed)

    cues.sort(key=lambda c: c['s'])
    for i, c in enumerate(cues):              # holds, minimums, gaps
        nxt = cues[i + 1]['s'] if i + 1 < len(cues) else 1e9
        e = max(c['speech_end'] + HOLD_F / FPS, c['s'] + max(MIN_F / FPS, len(c['text']) / CPS_TARGET))
        e = min(e, nxt - GAP_F / FPS)
        if e < c['speech_end'] - 0.15:
            warn.append(f"{c['id']}: ends {c['speech_end'] - e:.2f} s before its speech does (the next cue overlaps it)")
        c['e'] = e

    # ---- sound captions into free time
    dropped = []
    speech = sorted(cues, key=lambda c: c['s'])
    sfx_cues = []
    attached = []
    for n, row in enumerate(src['sfx']):
        a, z, text, why = row[:4]
        if len(row) > 4:                      # attach as a row on top of that line's first cue
            tgt = next((c for c in cues if c['line'] == row[4]), None)
            if tgt and len(wrap(tgt['text'])) == 1 and len(text) <= ROW:
                tgt['text'] = text + '\n' + tgt['text']
                attached.append((text, row[4]))
                continue
            warn.append(f'{text}: could not attach to {row[4]}')
        s, e = math.floor(a * FPS) / FPS, math.ceil(z * FPS) / FPS
        for c in speech:
            if c['e'] + GAP_F / FPS > s and c['s'] < e:          # collides
                if c['s'] <= s:
                    s = c['e'] + GAP_F / FPS
                else:
                    e = min(e, c['s'] - GAP_F / FPS)
        if e - s < SFX_MIN_F / FPS:
            dropped.append((text, a, z, round(e - s, 3)))
            continue
        sfx_cues.append(dict(id=f'sfx-{n + 1:02d}', kind='sound', s=s, e=e, speech_end=e, text=text, why=why))
    allc = sorted(cues + sfx_cues, key=lambda c: c['s'])

    # ---- QA
    qa = dict(speech_cues=len(cues), sound_cues=len(sfx_cues), attached_sound=attached, dropped_sound=dropped, lines=len(lines),
              labels=sum(1 for c in cues if re.match(r'^[A-Z][A-Z ]+(\([^)]*\))?: ', c['text'])))
    cps = []
    for c in allc:
        d = c['e'] - c['s']
        rows = wrap(c['text'])
        c['rows'] = rows
        if len(rows) > ROWS or max(len(r) for r in rows) > ROW:
            warn.append(f"{c['id']}: rows {rows}")
        cps.append((len(c['text'].replace('\n', ' ')) / d if d > 0 else 99, c['id'], round(d, 2)))
    overl = [(a['id'], b['id']) for a, b in zip(allc, allc[1:]) if a['e'] > b['s'] + 1e-6]
    qa.update(max_cps=round(max(cps)[0], 1), over_cps=[(x[1], round(x[0], 1), x[2]) for x in sorted(cps, reverse=True) if x[0] > CPS_FLAG],
              min_dur=round(min(c['e'] - c['s'] for c in allc), 3), overlaps=overl,
              lock_frame_diffs=lock_diff, act_seconds=tl['_source']['act_seconds'])
    return allc, qa, warn, lines


def build_ad(src, lines, act_len):
    speech = [(ln['on'], ln['off'], ln['id']) for ln in lines]
    out, flags = [], []
    ad = src['ad']
    for i, (aid, shot, start, text) in enumerate(ad):
        nxt_speech = min([on for on, off, _ in speech if on > start + 1e-6] + [act_len])
        nxt_ad = ad[i + 1][2] if i + 1 < len(ad) else act_len
        prev_off = max([off for on, off, _ in speech if on <= start] + [0.0])
        window_end = min(nxt_speech - AD_LEAD, nxt_ad - 0.1, act_len)
        syl = syllables(text)
        est = syl / AD_SYL_PER_S
        fit = window_end - start
        f = []
        if start < prev_off + 0.1:
            f.append(f'starts {prev_off + 0.1 - start:.2f} s inside speech')
        tight = fit + 1e-6 < est <= fit + AD_TIGHT
        if est > fit + AD_TIGHT:
            f.append(f'needs {est:.2f} s, has {fit:.2f} s')
        if f:
            flags.append((aid, '; '.join(f)))
        out.append(dict(id=aid, shot=shot, s=start, e=min(start + est + 0.2, window_end), window=round(fit, 2),
                        syl=syl, est=round(est, 2), rate=round(syl / fit, 2) if fit > 0 else 99, text=text,
                        flag='; '.join(f), tight=tight))
    return out, flags


# ------------------------------------------------------------------ writers
def write_captions(cues, clock, off):
    base = os.path.join(OUTDIR, f'ep01-act4-v5.en-sdh.{clock}')
    with open(base + '.srt', 'w', encoding='utf-8') as fh:
        for n, c in enumerate(cues, 1):
            fh.write(f"{n}\n{tc(c['s'] + off, ',')} --> {tc(c['e'] + off, ',')}\n" + '\n'.join(c['rows']) + '\n\n')
    with open(base + '.vtt', 'w', encoding='utf-8') as fh:
        fh.write('WEBVTT - MR. MAS Ep1 Act Four v5, plain SDH captions (English)\n\n')
        fh.write(f'NOTE clock: {clock} (offset +{off:.3f} s from the act clock). Generated by '
                 'captions/tools/build_access.py from show/reel/ep01-act4-v5.json; do not hand-edit.\n\n')
        for c in cues:
            fh.write(f"{c['id']}\n{tc(c['s'] + off, '.')} --> {tc(c['e'] + off, '.')}\n" + '\n'.join(c['rows']) + '\n\n')
    return base


def write_ad_vtt(ad, clock, off):
    path = os.path.join(OUTDIR, f'ep01-act4-v5.ad.{clock}.vtt')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('WEBVTT - MR. MAS Ep1 Act Four v5, audio description (kind: descriptions)\n\n')
        fh.write(f'NOTE clock: {clock} (offset +{off:.3f} s from the act clock). Source: '
                 'captions/tools/access_v5_src.json; script: ep01-act4-v5.ad-script.md.\n\n')
        for a in ad:
            fh.write(f"{a['id']}\n{tc(a['s'] + off, '.')} --> {tc(a['e'] + off, '.')}\n{a['text']}\n\n")
    return path


def fmt(t):
    return f'{int(t // 60)}:{t % 60:05.2f}'


def write_ad_md(ad, flags, src, shot_start):
    path = os.path.join(OUTDIR, 'ep01-act4-v5.ad-script.md')
    total_words = sum(len(a['text'].split()) for a in ad)
    L = []
    L.append('# Ep1 · Act Four v5 · Audio description script (draft for review)\n')
    L.append('Generated by `captions/tools/build_access.py` from `captions/tools/access_v5_src.json`. **Edit the source JSON, '
             'then re-run; never edit this file by hand.** The same cues ship as WebVTT description tracks '
             '(`ep01-act4-v5.ad.act.vtt`, `.reel.vtt`).\n')
    L.append('| | |\n|---|---|')
    L.append('| **What** | A standard (not extended) description track: each cue fits in a gap in the dialogue on the approved stick timing. |')
    L.append('| **Clock** | Act clock (0:00 = the act\'s first frame = episode 12:31). Add 3.000 s for the stick reel and its mix. |')
    L.append('| **Style** | DET-19: plain and present tense, only what\'s on screen, never a motive. It reads the silent story text '
             '(posts, rails, plates) because a blind viewer gets it nowhere else, and it reads a `(REPORTED)` label wherever the picture shows one. '
             'Mas is "Mas"; everyone is named once the picture has named them. |')
    L.append('| **Voice** | A human describer, or a voice designed from text (never a clone). Calm, level, a little under the dialogue. |')
    L.append(f'| **Size** | {len(ad)} cues, {total_words} words. |')
    L.append(f'| **Fit** | Measured on paper: syllables at {AD_SYL_PER_S:.1f} a second (about 160 words a minute) against the gap to the '
             f'next spoken word less {AD_LEAD:.2f} s. {"Every cue fits." if not flags else str(len(flags)) + " cue(s) flagged below."} '
             'Nobody has heard these read against the mix. |')
    L.append('')
    L.append('## The script\n')
    L.append('| # | In | Shot | Gap to next word (s) | Est. read (s) | Description |')
    L.append('|---|---|---|---|---|---|')
    for a in ad:
        warn = f" **⚑ {a['flag']}**" if a['flag'] else (' *(tight)*' if a['tight'] else '')
        L.append(f"| {a['id']} | {fmt(a['s'])} | {a['shot']} | {a['window']:.2f} | {a['est']:.2f} | {a['text']}{warn} |")
    L.append('')
    L.append('## Choices a reviewer should know about\n')
    L.append('- **AD07 speaks inside D6,** the act\'s one designed digital silence (the Cancel click to the phone\'s buzz). '
             'For a sighted viewer the silence is the beat; for a blind viewer silence alone doesn\'t say the tile fell. The line is short '
             'and flat so the silence still reads. The alternative is to hold it until after the buzz and lose "super." context.')
    L.append('- **AD43 speaks over dead stop 2** (MADA\'s label) for the same reason. **Dead stop 3** ("of what?" to Mada\'s "Good question.") '
             'is left clear: the pause is audible and the next line carries it.')
    L.append('- **Posts are read in their own words** (AD19, AD20, AD33, AD44, AD50, AD51). Gerg\'s quit post is lowercase on screen '
             '(the record\'s casing); a voice can\'t show that, so AD19 just reads it. AD51 reads only the first sentence of Ttemme\'s post; '
             'the rest doesn\'t fit.')
    L.append('- **Numbers and dates** are read as the rails print them ("November 17, noon, Las Vegas"; "745 of 770").')
    early = []
    for a in ad:
        s0 = shot_start.get(a['shot'].split('-')[0])
        if s0 is not None and a['s'] < s0 - 0.05:
            early.append(f"{a['id']} ({s0 - a['s']:.2f} s before {a['shot'].split('-')[0]} cuts in)")
    L.append('- **Early starts (measured):** ' + ('; '.join(early) if early else 'none') + '. AD02 also runs about 1.6 s ahead of '
             'the `HOW TO FIRE A CEO` stamp, over the glow turning to blueprint. Each is under about a second and a half and '
             'describes only what the next frame shows (no story information arrives early; DET-19 rule 13).')
    L.append('')
    L.append('## Not fitted (for an extended-AD version, or for a human to rule on)\n')
    for shot, what in src['ad_not_fitted']:
        L.append(f'- **{shot}:** {what}')
    L.append('')
    L.append('## What a human must still do\n')
    L.append('1. Read it aloud against the mix (`audio/reel/ep01-act4-v5/mix.wav`, starting 3.000 s in) and time it by ear. '
             'The fit numbers are a syllable estimate, not a measurement of speech.')
    L.append('2. A blind or low-vision reviewer (elevation-ideas DET-19 names one) for whether the story holds without picture.')
    L.append('3. Re-check every cue against the **pixel** preview once it renders: the text here follows the stick captions and the '
             'shot plan, and the pixel layouts may stage a beat differently.')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(L) + '\n')
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--episode', action='store_true', help='also write the episode-clock (+12:31) files')
    args = ap.parse_args()
    tl, takes, src, lock = load()
    cues, qa, warn, lines = build(tl, takes, src, lock)
    act_len = tl['_source']['act_seconds']
    ad, flags = build_ad(src, lines, act_len)
    clocks = ['act', 'reel'] + (['ep'] if args.episode else [])
    for ck in clocks:
        write_captions(cues, ck, OFFSETS[ck])
        write_ad_vtt(ad, ck, OFFSETS[ck])
    shot_start = {b['id']: b['realStart'] - tl['beats'][0]['realStart'] for b in tl['beats']}
    write_ad_md(ad, flags, src, shot_start)
    qa['ad_cues'] = len(ad)
    qa['ad_words'] = sum(len(a['text'].split()) for a in ad)
    qa['ad_flags'] = flags
    qa['ad_tight'] = [a['id'] for a in ad if a['tight']]
    qa['ad_max_rate_syl_per_s'] = max(a['rate'] for a in ad)
    qa['warnings'] = warn
    with open(os.path.join(OUTDIR, 'qa-v5.json'), 'w') as fh:
        json.dump(qa, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f"captions: {qa['speech_cues']} speech + {qa['sound_cues']} sound cues from {qa['lines']} lines; "
          f"{qa['labels']} speaker labels; max {qa['max_cps']} cps; shortest {qa['min_dur']} s; overlaps {len(qa['overlaps'])}; "
          f"lock frame diffs {len(qa['lock_frame_diffs'])}")
    if qa['over_cps']:
        print('  over', CPS_FLAG, 'cps:', qa['over_cps'])
    if qa['dropped_sound']:
        print('  dropped sound captions:', qa['dropped_sound'])
    print(f"AD: {len(ad)} cues, {qa['ad_words']} words, flags {len(flags)}")
    for f in flags:
        print('  AD', f)
    for w in warn:
        print('  WARN', w)


if __name__ == '__main__':
    sys.exit(main())
