#!/usr/bin/env python3
"""Ep2 v1 BASE LOCK (Kokoro timing): the temp sound bed per segment, for the stick reel. A copy of Ep1's last bed
(audio/reel/ep01-v35/bed.py, locked) with every Ep1-specific layer removed: the cold open's v2 stem, Act Four's one
silence, the tag's vault L-cut, the per-beat J-cut tables and Ep1's mood table. What stays is the machinery:
  ROOMS   one bed per beat `room`, from rooms.py (the SFX board's beds, the first candidate on the board). A new room
          LEADS the cut (fades in over the last 0.6 s of the outgoing shot, or the beat plan's sound J-cut lead_s), the
          old one trails 0.4 s (or the plan's L-cut over_s); the next chapter's first room leads under this chapter's
          end. Un-ducked under speech so that, after the mixer's -10 dB, they dip about 2 dB.
  SFX     the beats' `sounds` (SFX-board files, or synth:<kind> from Ep1's v2 bed modules, imported read-only), at their
          peak level, un-ducked. A sound J-cut that names one of the beat's own sounds moves that sound lead_s earlier;
          one that names the next beat's sound (JCUT_NEXT, empty until Ep2 needs it) moves that one.
  MUSIC   a quiet temp pad per run of one cue (the beat's `music (v1): E02-NN ...`, keyed by its cue number: MOODS),
          about -31 LUFS un-ducked; none where the cue says no score (E02-04's studio). The real score is the score pass's.

  audio/.venv-casting/bin/python audio/reel/ep02-v1/bed.py [seg ...]     (default: card + the six segments)
      reads  show/reel/ep02-v1/ep02-v1-<seg>.json (build_timeline.py) and the beat plans' J-/L-cut sounds
      writes audio/reel/ep02-v1/<seg>-bed.wav (48 kHz / 16-bit stereo, git-ignored) + <seg>-bed-qa.json
This is TEMPORARY sound for judging timing and the voice. The episode mixer (studio/src/reel/tools/mixer.mjs) lays the
takes over these beds and ducks the beds -10 dB under speech (the manifest's mix). Nothing here was heard.
"""
import importlib.util
import json

import os
import re
import sys
import warnings

import numpy as np
import soundfile as sf

warnings.filterwarnings('ignore')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
SR, FPS = 48000, 24
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
BP_DIR = os.path.join(ROOT, 'show/episodes/ep02/production/v1/beat-plan')
TL = 'show/reel/ep02-v1/ep02-v1-{seg}.json'
CUE = 'music (v1): '
ORDER = ['coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag']   # the manifest's story chapters, in play order
AFTER_VIDEO = {'coldopen', 'card', 'act1'}  # the title / the intro come before; act1 follows the card (a bed of ours)
BEFORE_VIDEO = {'coldopen', 'tag'}          # the intro / the outro come after: a hard cut, no lead
LEAD, TRAIL = 0.6, 0.4
MIX_DUCK, DUCK_PRE, DUCK_HOLD = -10.0, 0.25, 2.5   # episode.ts defaults (the manifest keeps them)
ROOM_DIP = -2.0                                  # what the rooms should dip under speech, after the mixer's duck
CARD_S = 2.0
# the per-beat J-cut tables (Ep1 filled them with its beat ids; Ep2 starts empty and adds its own, with the reason)
NEXT_CHAPTER_JCUT = set()   # a chapter's last beat whose J-cut is the next chapter's first room
JCUT_NEXT = set()           # beats whose J-cut sound is the next beat's own sound (moved earlier)
JCUT_SOUND = {}             # beat -> the next beat's sound the J-cut's words don't name
ROOM_OVERRIDE = {}          # (seg, beat) -> room
sys.path.insert(0, HERE)
import rooms as RM          # noqa: E402  (the room recipes, shared with stems.py)


def mod(path, name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)   # helpers only: each module's main() runs under __main__
    return m


A1 = mod('audio/reel/ep01-act1-v2/act1_bed.py', 'act1_bed')
A2 = mod('audio/reel/ep01-act2-v2/act2_bed.py', 'act2_bed')
A3 = mod('audio/reel/ep01-act3-v2/act3_bed.py', 'act3_bed')
CO = mod('audio/reel/ep01-coldopen-v2/coldopen_bed.py', 'coldopen_bed')
TG = mod('audio/reel/ep01-tag-v2/tag_bed.py', 'tag_bed')
rng = np.random.default_rng(327)
db = A1.db


def load(name):
    return A1.load(os.path.join(SFXD, name + '.wav'))


def loop(name, n, target, filt=None):
    x = load(name)
    o = int(rng.integers(0, len(x)))
    x = np.concatenate([x] * (n // len(x) + 2))[o:o + n]
    if filt:
        x = filt(x)
    return A1.to_lufs(x, target)


def murmur_band(n, lo, hi, target):
    x = A1.bp(rng.standard_normal(n), lo, hi, 2)
    am = np.interp(np.arange(n), np.linspace(0, n, max(3, n // (SR // 4))), rng.uniform(0.2, 1.0, max(3, n // (SR // 4))))
    return A1.to_lufs(A1.st(x * am), target)


# ------------------------------------------------------------------ rooms: the lock's room -> rooms.py's recipe
NOTES = set()


def room(seg, kind, n):
    lay, note = RM.recipe(kind)
    NOTES.add(note)
    if lay is None:
        return None
    x = None
    for ly in lay:
        f = (lambda y, hz=ly['lp']: A1.lp(y, hz)) if ly.get('lp') else None
        y = loop(ly['bed'], n, ly['lufs'], f)
        if ly.get('pan'):
            y = y * np.array([ly['pan']])
        x = y if x is None else x + y
    return x


# ------------------------------------------------------------------ the sounds
NAMED = {'BUZZ': 'phone_buzz_desk', 'RING': 'call_ring', 'SLOT': 'slot_whir', 'JANGLE': 'key_ring_jangle_1',
         'DIALTONE': 'dial_tone_speaker'}
PREFER = {'coldopen': [CO, A1, A2, A3, TG], 'act1': [A1, A2, A3, CO, TG], 'act2': [A2, A1, A3, CO, TG],
          'act3': [A3, A1, A2, CO, TG], 'act4': [A3, A1, A2, CO, TG], 'tag': [TG, A3, A1, A2, CO]}


def dtmf(dur=0.9):
    """a few touch-tone digits through a phone's speaker"""
    rows, cols = [697, 770, 852, 941], [1209, 1336, 1477]
    out = np.zeros(int(dur * SR))
    t0 = 0.0
    while t0 + 0.12 < dur:
        n = int(0.09 * SR)
        tt = np.arange(n) / SR
        x = np.sin(2 * np.pi * rng.choice(rows) * tt) + np.sin(2 * np.pi * rng.choice(cols) * tt)
        i = int(t0 * SR)
        out[i:i + n] += x * np.minimum(1, tt / 0.004) * np.minimum(1, (0.09 - tt) / 0.004)
        t0 += rng.uniform(0.14, 0.22)
    return A1.st(A1.bp(out, 400, 3400, 2))


def make_sound(seg, name, dur, align=None):
    name = NAMED.get(name, name)
    if name == 'DTMF':
        return dtmf(dur or 0.9), 0.0
    if name.endswith('@1bit'):
        x = load(name[:-5])
        return CO.one_bit(x), 0.0
    if name.startswith('synth:'):
        kind = name[6:]
        for m in PREFER[seg]:
            try:
                if m in (CO, TG):
                    x = m.synth(kind)
                else:
                    x = m.synth(kind, dur)
                x = np.asarray(x, dtype='float64')
                return (x if x.ndim == 2 else A1.st(x)), 0.0
            except (KeyError, TypeError, ValueError):
                continue
        raise KeyError(name)
    x, off = A1.sound(name, dur, align)
    return x, off


# ------------------------------------------------------------------ the pad (a numpy port of mixer.mjs synthPad)
CHORDS = {
    'Fm9': ['F2', 'Ab3', 'C4', 'Eb4', 'G4'], 'Fm11': ['F2', 'Ab3', 'Bb3', 'Eb4', 'G4'], 'Dbmaj9#11': ['Db2', 'F3', 'G3', 'C4', 'Eb4'],
    'Bbm9': ['Bb1', 'Ab3', 'C4', 'Db4', 'F4'], 'C7#9b13': ['C2', 'E3', 'Bb3', 'Eb4', 'Ab4'], 'Abmaj9': ['Ab1', 'G3', 'Bb3', 'C4', 'Eb4'],
    'Eb9sus4': ['Eb2', 'Ab3', 'Bb3', 'Db4', 'F4'], 'Gm7b5': ['G1', 'F3', 'Bb3', 'C4', 'Db4'], 'Db69#11': ['Db2', 'F3', 'Bb3', 'Eb4', 'G4'],
    'F9sus4': ['F2', 'Bb3', 'Eb4', 'G4', 'C5'],
}


def pad(chords, bpm, bars, seconds):
    n = int(seconds * SR)
    out = np.zeros((n, 2), dtype='float32')
    ln = bars * 4 * 60 / bpm
    att, ovl = min(1.2, ln / 3), min(1.5, ln / 2)
    k = 0
    while k * ln < seconds:
        t0, t1 = k * ln, min(seconds, k * ln + ln + ovl)
        s0, s1 = int(t0 * SR), min(n, int(t1 * SR))
        t = np.arange(s1 - s0) / SR
        env = (np.minimum.reduce([np.ones_like(t), t / att, (t1 - t0 - t) / ovl]) *
               (0.9 + 0.1 * np.sin(2 * np.pi * 0.13 * (s0 / SR + t)))).astype('float32')
        for vi, nm in enumerate(CHORDS[chords[k % len(chords)]]):
            amp = (0.32 if vi == 0 else 0.16) * 0.5
            pan = 0.5 if vi == 0 else 0.2 + 0.6 * ((vi - 1) / 3)
            for d in (1.0017, 0.9983):
                w = 2 * np.pi * A1.hz(nm) * d * t + rng.uniform(0, 2 * np.pi)
                v = ((np.sin(w) + 0.22 * np.sin(2 * w) + 0.06 * np.sin(3 * w)) * env * amp).astype('float32')
                out[s0:s1, 0] += v * (1 - pan)
                out[s0:s1, 1] += v * pan
        k += 1
    return out


# mood runs (the beat plan's `music`, by its cue number E02-NN, manifest.md §6) -> the temp pad: chords, bpm, bars a
# chord, LUFS, the duck the mixer should give it (dB). None = no score. Temp only: the score pass writes the real cues.
MOODS = [
    ('E02-01', dict(chords=['Fm9', 'Eb9sus4'], bpm=96, bars=1, lufs=-31)),          # THE MAMMOTH: set-piece swing, low
    ('E02-02', dict(chords=['Fm11', 'Dbmaj9#11'], bpm=72, bars=2, lufs=-33)),       # THE SÉANCE: room colour, F minor
    ('E02-03', dict(chords=['Bbm9', 'Eb9sus4'], bpm=96, bars=2, lufs=-33)),         # PROCEDURE, MARCH
    ('E02-04', None),                                                              # LONG-FORM: the sting, then no score
    ('E02-05', dict(chords=['Eb9sus4', 'Abmaj9'], bpm=96, bars=1, lufs=-32)),       # A TENANT
    ('E02-06', dict(chords=['Fm9'], bpm=66, bars=4, lufs=-34)),                     # DARK ROOM, SPRING (the Water Line)
    ('E02-07', dict(chords=['Abmaj9', 'Db69#11'], bpm=96, bars=1, lufs=-31)),       # ONE WORD
    ('E02-08', dict(chords=['Fm9'], bpm=96, bars=4, lufs=-33)),                     # WHERE'S ALYI? (THE CLOCK)
    ('E02-09', dict(chords=['Dbmaj9#11', 'F9sus4'], bpm=60, bars=4, lufs=-35)),     # FEEL IT
    ('E02-10', dict(chords=['Abmaj9', 'Eb9sus4'], bpm=120, bars=1, lufs=-30)),      # THE BRIDGE
    ('E02-11', dict(chords=['Bbm9', 'Fm11'], bpm=96, bars=2, lufs=-33)),            # LEVERAGE, QUARTET
    ('E02-12', dict(chords=['F9sus4'], bpm=60, bars=4, lufs=-36)),                  # ONE DOOR
    ('E02-13', dict(chords=['Fm11', 'Dbmaj9#11'], bpm=120, bars=1, lufs=-31)),      # AUGUST (THE RUN)
    ('none', None),
]


def mood_of(text):
    if re.search(r'\bno score\b', text[:40], re.I) and not text.startswith('E02-04'):
        return 'no score', None
    for key, spec in MOODS:
        if text.startswith(key):
            if isinstance(spec, str):   # v3.2: a new beat's mood that continues a neighbour's pad
                return spec, dict(MOODS)[spec]
            return key, spec
    return None, 'unknown'


# ------------------------------------------------------------------ the mixer's duck, mirrored (episode.ts / mixer.mjs)
def duck_progress(speech, N):
    """u(t) in 0..1: how far into the mixer's duck each sample is (spans from 0.25 s before a line to 0.1 s after,
    joined across gaps under 2.5 s; 0.2 s attack before a span, 0.6 s release after), at 1 kHz, then per sample"""
    CR = 1000
    n = int(N / SR * CR) + 2
    spans = []
    for a, b in sorted(speech):
        s = [a - DUCK_PRE, b + 0.1]
        if spans and s[0] - spans[-1][1] < DUCK_HOLD:
            spans[-1][1] = max(spans[-1][1], s[1])
        else:
            spans.append(s)
    u = np.zeros(n)
    t = np.arange(n) / CR
    for a, b in spans:
        i0, i1 = max(0, int((a - 0.2) * CR)), min(n, int(np.ceil((b + 0.6) * CR)))
        tt = t[i0:i1]
        v = np.where(tt < a, (tt - (a - 0.2)) / 0.2, np.where(tt > b, 1 - (tt - b) / 0.6, 1.0))
        u[i0:i1] = np.maximum(u[i0:i1], np.clip(v, 0, 1))
    return np.interp(np.arange(N) / SR, t, u).astype('float32')


def unduck(u, dip_db):
    """the gain that turns the mixer's -10 dB duck into a dip of dip_db (both linear in amplitude along u)"""
    low = db(MIX_DUCK)
    d = 1 + (low - 1) * u
    tgt = 1 + (db(dip_db) - 1) * u
    return (tgt / d).astype('float32')


# ------------------------------------------------------------------ the chapter clock
def clock(beats):
    starts, acc, prev = [], 0.0, 0
    for b in beats:
        acc += b['reelDur']
        end = max(prev + 1, round(acc * FPS))
        starts.append((prev / FPS, end / FPS))
        prev = end
    return starts, prev / FPS


def fade(x, fin, fout):
    return A1.fade(x, fin, fout)


def add(bus, x, t):
    A1.add(bus, x.astype(bus.dtype, copy=False), t)


def seg_timeline(seg):
    return json.load(open(TL.format(seg=seg) if os.path.isabs(TL) else os.path.join(ROOT, TL.format(seg=seg))))


def plan_beats(seg):
    """the Ep2 plan's beats (their jcut / lcut), by id"""
    p = os.path.join(BP_DIR, f'{seg}.json')
    return {b['id']: b for b in json.load(open(p))['beats']} if os.path.exists(p) else {}


def first_room(seg):
    tl = seg_timeline(seg)
    b0 = next((b for b in tl['beats'] if RM.recipe(b.get('room'))[0] is not None), tl['beats'][0])
    pb = plan_beats(seg).get(tl['beats'][0]['id'], {})
    lead = next((j['lead_s'] for j in pb.get('jcut', []) if 'sound' in j), LEAD)
    return b0['room'], lead


def build(seg):
    qa = {'segment': seg, 'layers': [], 'sfx': [], 'sfx_missing': [], 'decisions': []}
    if seg == 'card':
        nxt_room, nxt_lead = first_room('act1')
        N = int((CARD_S + 0.1) * SR)
        bus = A1.to_lufs(np.concatenate([load('room_tone')] * 2)[:N], -38).astype('float32')   # the v2 card's stand-in level
        x = room('act1', nxt_room, int(nxt_lead * SR) + int(0.1 * SR))
        bus[int((CARD_S - nxt_lead) * SR):] = bus[int((CARD_S - nxt_lead) * SR):] * np.linspace(1, 0.3, N - int((CARD_S - nxt_lead) * SR))[:, None]
        add(bus, fade(x, nxt_lead, 0.0), CARD_S - nxt_lead)
        qa['layers'] += [{'room': 'room tone (the card)', 'lufs': -38}, {'lead': nxt_room, 'from': CARD_S - nxt_lead}]
        return bus, qa, CARD_S
    tl = seg_timeline(seg)
    PB = plan_beats(seg)
    beats = tl['beats']
    starts, total = clock(beats)
    BI = {b['id']: i for i, b in enumerate(beats)}
    s_of = lambda bid: starts[BI[bid]][0]
    e_of = lambda bid: starts[BI[bid]][1]
    N = int((total + 0.1) * SR)
    rooms = np.zeros((N, 2), 'float32')
    fx = np.zeros((N, 2), 'float32')
    mus = np.zeros((N, 2), 'float32')
    speech = [(starts[i][0] + l['t'], starts[i][0] + l['t'] + l['dur']) for i, b in enumerate(beats) for l in b['lines'] if l.get('audio')]
    u = duck_progress(speech, N)

    # J-/L-cut sounds from the plan: a boundary's lead / trail, or one of the beat's own sounds moved earlier
    lead_at, trail_at, sound_lead = {}, {}, {}
    for i, b in enumerate(beats):
        pb = PB.get(b['id'], {})
        for j in pb.get('jcut', []):
            if 'sound' not in j:
                continue
            words = set(re.findall(r'[a-z]+', j['sound'].lower()))
            own = next((sd for sd in b.get('sounds', []) if words & set(re.split(r'[_:\-@]', sd['name'].lower())) - {'synth', 'c', 'f', 'soft'}), None)
            if b['id'] in NEXT_CHAPTER_JCUT and i + 1 == len(beats):
                qa['decisions'].append(f'{b["id"]}: "{j["sound"]}" = the next chapter\'s first room, leading under this '
                                       f'chapter\'s end by {j["lead_s"]} s')
                continue
            if b['id'] in JCUT_NEXT and i + 1 < len(beats):
                nb_ = beats[i + 1]
                want = JCUT_SOUND.get(b['id'])
                nxt = next((sd for sd in nb_.get('sounds', []) if (sd['name'] == want if want else
                            words & set(re.split(r'[_:\-@]', sd['name'].lower())) - {'synth', 'c', 'f', 'soft'})), None)
                if nxt is not None and j['lead_s'] > 0:
                    k_ = (i + 1, nxt['name'], nxt['at'])
                    sound_lead[k_] = max(sound_lead.get(k_, 0.0), j['lead_s'])
                    qa['decisions'].append(f'{b["id"]}: "{j["sound"]}" = the next beat\'s ({nb_["id"]}) {nxt["name"]}, moved '
                                           f'{j["lead_s"]} s earlier, under this cut')
                else:
                    lead_at[i + 1] = j['lead_s']
                    qa['decisions'].append(f'{b["id"]}: "{j["sound"]}" leads the next cut ({nb_["id"]}) by {j["lead_s"]} s')
            elif own is not None:
                k_ = (i, own['name'], own['at'])
                sound_lead[k_] = max(sound_lead.get(k_, 0.0), j['lead_s'])
                qa['decisions'].append(f'{b["id"]}: "{j["sound"]}" = its own {own["name"]}, moved {j["lead_s"]} s earlier')
            else:
                lead_at[i] = j['lead_s']
                qa['decisions'].append(f'{b["id"]}: "{j["sound"]}" = its room, leading the cut by {j["lead_s"]} s')
        for lc in pb.get('lcut', []):
            trail_at[i] = lc.get('over_s', 1.0)

    # ---------------------------------------------------------------- rooms
    runs = []
    for i, b in enumerate(beats):
        k = ROOM_OVERRIDE.get((seg, b['id'])) or b.get('room') or ''
        if (seg, b['id']) in ROOM_OVERRIDE:
            qa['decisions'].append(f'{b["id"]}: room {b.get("room")} -> {k} (ROOM_OVERRIDE)')
        if b.get('kind') == 'card' and b.get('set') == 'void':
            k = k if seg == 'coldopen' else ''
        if runs and runs[-1][0] == k:
            runs[-1][2] = i
        else:
            runs.append([k, i, i])
    for j, (k, i0, i1) in enumerate(runs):
        a, e = starts[i0][0], starts[i1][1]
        lead = lead_at.get(i0, LEAD) if j > 0 else 0.0
        if j == 0 and seg not in AFTER_VIDEO:
            lead = 0.0
        trail = trail_at.get(i1, TRAIL) if j + 1 < len(runs) else 0.0
        if j + 1 < len(runs) and runs[j + 1][0] == '':
            trail = trail_at.get(i1, 0.05)   # into black: the room cuts with the picture (v2 act1's 12.07)
        if k == '':
            continue
        a0, e0 = max(0.0, a - lead), min(total, e + trail)
        x = room(seg, k, int((e0 - a0) * SR) + 1)
        if x is None:
            continue
        x = fade(x, max(lead, 0.02), max(trail, 0.02))   # a chapter's first room is already up (the last bed led it in)
        add(rooms, x, a0)
        qa['layers'].append({'room': k, 'from': round(a0, 2), 'to': round(e0, 2), 'lead': lead, 'trail': trail})
    # the next chapter's first room leads under this chapter's end
    i_next = ORDER.index(seg) + 1
    nxt_ok = i_next < len(ORDER) and os.path.exists(TL.format(seg=ORDER[i_next]) if os.path.isabs(TL) else os.path.join(ROOT, TL.format(seg=ORDER[i_next])))
    if seg not in BEFORE_VIDEO and i_next < len(ORDER) and not nxt_ok:
        qa['decisions'].append(f'no {ORDER[i_next]} timeline yet: its first room does not lead under this chapter\'s end')
    if seg not in BEFORE_VIDEO and nxt_ok:
        nr, nl = first_room(ORDER[i_next])
        nl = max([nl] + [j['lead_s'] for j in plan_beats(seg).get(beats[-1]['id'], {}).get('jcut', [])
                         if 'sound' in j and beats[-1]['id'] in NEXT_CHAPTER_JCUT])
        x = room(ORDER[i_next], nr, int((nl + 0.1) * SR))
        if x is not None:
            add(rooms, fade(x, nl, 0.0), total - nl)
            qa['layers'].append({'room (next chapter, leading)': nr, 'from': round(total - nl, 2), 'lead': nl})
    sil = None              # (Ep1's one silence and its vault L-cut were Ep1's; a designed Ep2 silence is the stems' and the score's)

    # ---------------------------------------------------------------- sfx
    for i, b in enumerate(beats):
        for sd in b.get('sounds', []):
            try:
                x, off = make_sound(seg, sd['name'], sd.get('dur'), sd.get('align'))
            except Exception as ex:
                qa['sfx_missing'].append(f'{b["id"]}:{sd["name"]} ({ex.__class__.__name__}: {ex})')
                continue
            x = A1.to_peak(np.asarray(x, dtype='float64'), sd['gain'])
            at = starts[i][0] + sd['at'] - off - sound_lead.get((i, sd['name'], sd['at']), 0.0)
            add(fx, x, at)
            qa['sfx'].append([b['id'], sd['name'], round(at, 3)])

    # ---------------------------------------------------------------- music
    duck_depth = np.full(N, 10.0, 'float32')
    if True:
        mruns = []
        for i, b in enumerate(beats):
            m = next((c[len(CUE):] for c in b.get('cues', []) if c.startswith(CUE)), '')
            if mruns and (mruns[-1][0] == m or (mood_of(m)[0] is not None and mood_of(mruns[-1][0])[0] == mood_of(m)[0])):
                mruns[-1][2] = i
            else:
                mruns.append([m, i, i])
        for m, i0, i1 in mruns:
            key, spec = mood_of(m)
            a, e = starts[i0][0], starts[i1][1]
            if spec == 'unknown':
                qa['decisions'].append(f'no pad recipe for mood "{m[:60]}" ({beats[i0]["id"]}): none')
                continue
            if spec is None:
                qa['layers'].append({'music': f'none ({key}: no score)', 'from': round(a, 2), 'to': round(e, 2)})
                continue
            if spec.get('start_sound'):
                hit = [starts[i][0] + sd['at'] for i in range(i0, i1 + 1) for sd in beats[i].get('sounds', []) if sd['name'] == spec['start_sound']]
                if not hit:
                    continue
                a = hit[0]
            resume = None
            if spec.get('stop_sound'):
                hit = [starts[i][0] + sd['at'] for i in range(i0, len(beats)) for sd in beats[i].get('sounds', []) if sd['name'] == spec['stop_sound']]
                if hit and hit[0] > a and hit[0] < e:
                    if spec.get('resume_sound'):
                        rh = [starts[i][0] + sd['at'] for i in range(i0, i1 + 1) for sd in beats[i].get('sounds', []) if sd['name'] == spec['resume_sound']
                              and (not spec.get('resume_beat') or beats[i]['id'] == spec['resume_beat'])]
                        rh = [x for x in rh if x > hit[0]]
                        if rh:
                            resume = (rh[0], e)
                    e = hit[0]
            if spec.get('stop_beat') and spec['stop_beat'] in BI:
                e = min(e, s_of(spec['stop_beat']))
            if spec.get('stop_silence') and sil:
                e = min(e, sil[0])
            n = int((e - a) * SR)
            if n <= SR // 2:
                continue
            if spec.get('hum'):
                x = loop(spec['hum'], n, spec['lufs'])
            else:
                x = A1.to_lufs(pad(spec['chords'], spec['bpm'], spec['bars'], n / SR).astype('float64'), spec['lufs'])
            hard = bool(spec.get('stop_sound') or spec.get('stop_beat') or spec.get('stop_silence'))
            x = fade(x, 1.2 if not spec.get('start_sound') else 0.3, 0.05 if hard else 1.5)
            if spec.get('gap_beat') and spec['gap_beat'] in BI and i0 <= BI[spec['gap_beat']] <= i1:   # one stop inside the run, then back
                g0, g1 = s_of(spec['gap_beat']) - a, e_of(spec['gap_beat']) - a
                gi0, gi1 = int(g0 * SR), int(g1 * SR)
                x[gi0:gi1] = 0
                r = min(len(x) - gi1, int(0.6 * SR))
                x[gi1:gi1 + r] *= np.linspace(0, 1, r)[:, None]
            add(mus, x, a)
            if resume and resume[1] - resume[0] > 1.0:
                n2 = int((resume[1] - resume[0]) * SR)
                x2 = A1.to_lufs(pad(spec['chords'], spec['bpm'], spec['bars'], n2 / SR).astype('float64'), spec['lufs'])
                add(mus, fade(x2, 0.3, 1.5), resume[0])
                qa['layers'].append({'pad': key + ' (resumed)', 'from': round(resume[0], 2), 'to': round(resume[1], 2)})
            if spec.get('duck'):
                duck_depth[int(a * SR):int(e * SR)] = spec['duck']
            qa['layers'].append({'pad': key, 'chords': spec.get('chords') or spec.get('hum'), 'lufs': spec['lufs'],
                                 'duck_db': spec.get('duck', 10), 'from': round(a, 2), 'to': round(e, 2)})

    # ---------------------------------------------------------------- the duck compensation, and the sum
    if True:
        rooms *= unduck(u, ROOM_DIP)[:, None]
        fx *= unduck(u, 0.0)[:, None]
        low = db(MIX_DUCK)
        dd = 1 + (low - 1) * u
        tgt = 1 + (db(-duck_depth) - 1) * u
        mus *= (tgt / dd)[:, None]
    bus = rooms + fx + mus
    return bus, qa, total


def main(argv):
    global TL, BP_DIR, OUTD
    import argparse
    ap = argparse.ArgumentParser(description='the Ep2 v1 temp beds')
    ap.add_argument('segs', nargs='*')
    ap.add_argument('--timelines', help='a folder of ep02-v1-<seg>.json (a test; default show/reel/ep02-v1/)')
    ap.add_argument('--plans', help='a folder of beat plans (a test)')
    ap.add_argument('--out', help='write the beds here (a test; default audio/reel/ep02-v1/)')
    a = ap.parse_args(argv)
    if a.timelines:
        TL = os.path.join(os.path.abspath(a.timelines), 'ep02-v1-{seg}.json')
    if a.plans:
        BP_DIR = os.path.abspath(a.plans)
    OUTD = os.path.abspath(a.out) if a.out else HERE
    segs = [x for x in a.segs if x in ORDER] or [x for x in ORDER if x == 'card' or os.path.exists(os.path.join(ROOT, TL.format(seg=x)))]
    for seg in segs:
        bus, qa, total = build(seg)
        pk = float(np.abs(bus).max())
        if pk > db(-1.0):
            bus *= db(-1.0) / pk
            qa['peak_trim_db'] = round(20 * np.log10(db(-1.0) / pk), 2)
        out = os.path.join(OUTD, f'{seg}-bed.wav')
        sf.write(out, bus, SR, subtype='PCM_16')
        qa['seconds'] = round(len(bus) / SR, 3)
        qa['chapter_seconds'] = round(total, 3)
        qa['lufs'] = round(A1.lufs(bus.astype('float64')), 2) if len(bus) > SR else None
        qa['peak_dbfs'] = round(20 * np.log10(float(np.abs(bus).max()) + 1e-12), 2)
        json.dump(qa, open(os.path.join(OUTD, f'{seg}-bed-qa.json'), 'w'), indent=1)
        print(f'{os.path.relpath(out, ROOT)}: {qa["seconds"]} s, {qa["lufs"]} LUFS, peak {qa["peak_dbfs"]} dBFS, '
              f'{len(qa["sfx"])} sfx, missing {qa["sfx_missing"]}')
        for d in qa['decisions']:
            print('   ', d)
    for n_ in sorted(NOTES):
        print('  room', n_)


if __name__ == '__main__':
    main(sys.argv[1:])
