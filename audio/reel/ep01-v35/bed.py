#!/usr/bin/env python3
"""Ep1 v3.5 BASE LOCK (Kokoro timing): the temp sound bed per segment (the v3.4 lock's bed.py, on the v3.5 timelines).
  v3.5b (SN 00000A step 2): two new rooms, 'racks' (Act Two's cold aisle: the fans) and 'party' (Act Three's launch
  party: the staff's walla); the toast's J-cut moves to the usage flash (v35-22.02).
  v3.5: the J-/L-cuts are the v3.5 plans' (the v3 plan's where a v3.5 beat names none). A J-cut whose sound is the next
  scene's (JCUT_NEXT, the seams of script-v35-notes §5) moves that scene's matching sound earlier by lead_s (the gavel,
  the stamp, the marker, the toast; JCUT_SOUND names the ones the words don't), or, if it has none, leads with its
  room; two J-cuts on the same sound take the larger lead, not the sum. The mood table adds the new cues (the first
  weeks, 2018, the window, the vision post, 2019, the war room, TPOOL; 3 AM, the lamp, the flight and Alyi's night are
  the room only). TPOOL's two shots play the TPOOL room (ROOM_OVERRIDE), not the plan's office.
  v3.4: the duck is cut, so the tag's pad no longer drops out for the demo (its gap beat, v31-32.01d, is gone) and
  plays through to the thud.
  v3.3: THE ROOFTOP's pad stops where Act Two's black starts (17.13; the glass, 17.12, is cut); a J-cut on a
  chapter's last beat that names the next chapter's arrival (17.13: "the rack's fans and LED ticks under the black")
  is the next chapter's room leading under it (NEXT_CHAPTER_JCUT), not the beat's own room.
  v3.2: the mood table adds the new beats' strings (THE HEAT and LOBBY continue their neighbours' pads; "none" is the
  room only); a pad run is a run of one mood (not of one string); the caper comes back on v32-9.10k's jangle; an L-cut
  with no over_s trails 1 s.

  audio/.venv-casting/bin/python audio/reel/ep01-v35/bed.py [seg ...]     (default: card + the six segments)
      reads  show/reel/ep01-v35/ep01-v35-<seg>.json (build_timeline.py) and the beat plans' J-/L-cut sounds (the v3.5
             plan's where it has the key, else the v3 plan's)
      writes audio/reel/ep01-v35/<seg>-bed.wav (48 kHz / 16-bit stereo, git-ignored) + <seg>-bed-qa.json
  v3.1 changes: the mood table follows the v3.1 plans' music strings; the one silence starts on the Remove dialog's
  click (v31-S1.08d); the tag's pad drops out for the Elgoog demo (it plays its own sound); the cold open (now 640
  frames, the rewind running on into the intro) keeps its v2 stem through the rewind and runs the rewind on at double
  speed for the new 1.5 s.

This is TEMPORARY sound for judging timing and the voice: the real score (A1) and rooms and SFX (A2) come from their
own passes. The episode mixer (studio/src/reel/tools/mixer.mjs) lays the takes over these beds and ducks the beds
-10 dB under speech (the v2 manifest's mix). Each bed covers exactly its chapter, anchored at the chapter's first beat.

Layers (the lead's sample mix, audio/reel/ep01-v3-sample/mix.py, is the pattern):
  ROOMS   one bed per beat `room`. A new room LEADS the cut (fades in over the last 0.6 s of the outgoing shot, or the
          beat plan's sound J-cut lead_s), the old one trails 0.4 s (or the plan's L-cut over_s). The next chapter's
          first room leads under this chapter's end (its J-cut lead, default 0.6 s); a chapter that follows a video
          or the title starts on its own room. The rooms are un-ducked under speech so that, after the mixer's
          -10 dB, they dip about 2 dB (the sample's room duck).
  SFX     the beats' `sounds`, made by the v2 bed modules (act1_bed, act2_bed, act3_bed, coldopen_bed, tag_bed:
          files from audio/sfx/wav or their synth:<kind>), laid at their peak level, un-ducked (the sample left SFX
          out of the duck). A sound J-cut that names one of the beat's own sounds moves that sound lead_s earlier.
  MUSIC   COLD OPEN: the v2 stem (audio/reel/ep01-coldopen-v2/coldopen-bed.wav), unchanged, 0.5 s later: the only
          segment whose timing still lines up with its v2 stem (only the 0.5 s black was added in front). Elsewhere
          a quiet temp pad (reelbed.py's / mixer.mjs's chord table and envelope) per mood run of the beat plan's
          `music`, at about -31 LUFS un-ducked; none where the mood says no score; it stops where the mood says it
          stops. Ducked the mixer's 10 dB, except launch night (6 dB) and 2 AM (8 dB), as the sample did.
  SILENCE Act Four's Cancel click to the phone's buzz: rooms and pad out, room tone only (-50 LUFS), as the sample.
Nothing here was heard. <seg>-bed-qa.json lists what was measured.
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
CO_STEM = os.path.join(ROOT, 'audio/reel/ep01-coldopen-v2/coldopen-bed.wav')
BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v35')
V3_BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan')
ORDER = ['coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag']   # the manifest's story chapters, in play order
AFTER_VIDEO = {'coldopen', 'card', 'act1'}  # the title / the intro come before; act1 follows the card (a bed of ours)
BEFORE_VIDEO = {'coldopen', 'tag'}          # the intro / the outro come after: a hard cut, no lead
LEAD, TRAIL = 0.6, 0.4
MIX_DUCK, DUCK_PRE, DUCK_HOLD = -10.0, 0.25, 2.5   # episode.ts defaults (the manifest keeps them)
ROOM_DIP = -2.0                                  # what the rooms should dip under speech, after the mixer's duck
CARD_S = 2.0
NEXT_CHAPTER_JCUT = {'17.13'}   # v3.3 P8: Act Three's room leads 0.6 s under Act Two's black
JCUT_NEXT = {'9.13', 'v31-10.04', '11.04', 'S2.05', 'v31-S7.03b',    # the sound named is the next scene's
             # v3.5 (script-v35-notes §5): the first weeks' pulse, the siren (already 0.3 s before 10.08's end), 2018's fans,
             # the toast, the gavel, 2019's fan, the gavel-to-stamp, the war room's pulse, the all-hands' hush
             'v32-7.03', 'v35-10.08', 'v35-12.03', 'v35-22.02', '14.01', '15.14', 'v35-28.05', 'v32-S1.13', 'S3.04b'}
# (v3.5b, SN 00000A: the toast's J-cut moves from the waitlist, v35-22.01, to the usage flash, v35-22.02, now the beat
#  before the letter)
JCUT_SOUND = {'14.01': 'landing_thunk', 'v35-28.05': 'rubber_stamp_C'}   # the next scene's sound the words don't name
ROOM_OVERRIDE = {('act4', 'v35-43.01'): 'tpool', ('act4', 'v35-43.02'): 'tpool'}   # TPOOL (the plan says office)


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


# ------------------------------------------------------------------ rooms: (segment, room) -> a stereo loop at a level
def room(seg, kind, n):
    k = (seg, kind)
    if kind in ('', 'none', 'black', 'void', 'f1.1', 'apec-stage'):
        return None
    if kind in ('bullpen',) and seg == 'act1' or kind == 'split' and seg == 'act1':
        x = loop('server_hum', n, -37) + loop('neon_buzz', n, -49)
        if kind == 'split':   # the bullpen | the lighthouse: the lighthouse's wind in the right pane
            x = x + A1.to_lufs(loop('bed_lighthouse', n, -44) * np.array([[0.3, 1.0]]), -45)
        return x
    if kind == 'phone':       # the bullpen, and Elgoog's lobby through his phone's small speaker
        return loop('server_hum', n, -38) + loop('neon_buzz', n, -50) + murmur_band(n, 500, 3400, -47)
    if kind == 'basement':
        return loop('server_hum', n, -35, lambda x: A1.lp(x, 900))
    if kind == 'kitchen':
        return loop('server_hum', n, -40)
    if kind == 'lobby' and seg == 'act1':
        return loop('room_tone', n, -37)
    if kind == 'dark-desk':
        return loop('room_tone', n, -41, lambda x: A1.lp(x, 1500))
    if kind in ('whitehouse', 'bullpen-night', 'bay', 'senate', 'rooftop'):
        return A2.room_kind(kind, n / SR)[:n]
    if kind in ('dark', 'darkroom'):
        return loop('server_hum', n, -42, lambda x: A1.lp(x, 1400)) + loop('room_tone', n, -46) + loop('room_drone', n, -50)
    beds = {'suite': ('bed_suite', -38), 'tpool': ('bed_tpool', -40), 'office': ('bed_office_day', -39),
            'office_night': ('bed_office_evening', -40), 'allhands': ('bed_allhands', -36),
            'boardroom': ('bed_boardroom_night', -39), 'cctv': ('bed_cctv', -40), 'fires': ('bed_fires', -37),
            'lobby': ('bed_lobby_night', -38), 'bullpen': ('bed_bullpen_packing', -38), 'coda': ('bed_bullpen_unpack', -40)}
    if kind == 'split':       # Act Four: the boardroom | the lighthouse
        return loop('bed_boardroom_night', n, -41) * np.array([[1.0, 0.35]]) + loop('bed_lighthouse', n, -43) * np.array([[0.35, 1.0]])
    if kind in beds:
        return loop(beds[kind][0], n, beds[kind][1])
    if kind == 'racks':       # v3.5b (SN 00000A): the data hall's cold aisle, Act Two's racks: the fans up close, air
        return loop('server_hum', n, -34) + loop('room_tone', n, -46)
    if kind == 'party':       # v3.5b (SN 00000A): the bullpen's launch party, Sep 25, 2023: the staff's walla, a room of cups
        return loop('bed_allhands', n, -35) + murmur_band(n, 300, 2400, -41)
    print(f'  ! no room recipe for {k}: room tone')
    return loop('room_tone', n, -44)


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


# mood runs (the beat plan's `music`, by its first words) -> the temp pad: chords, bpm, bars a chord, LUFS, the duck the
# mixer should give it (dB), where it stops / starts inside the run. None = no score.
MOODS = [
    ('LAUNCH NIGHT', dict(chords=['Abmaj9', 'Db69#11'], bpm=84, bars=2, lufs=-31, duck=6)),
    ('the Build thins', dict(chords=['Abmaj9', 'Db69#11'], bpm=84, bars=2, lufs=-34, duck=6)),
    ('THE ODOMETER', dict(chords=['Abmaj9', 'Eb9sus4'], bpm=112, bars=1, lufs=-30)),
    ('the swing turns on the tile', dict(chords=['Fm9'], bpm=96, bars=4, lufs=-31)),
    ('THE BILL', dict(chords=['Fm9', 'Bbm9'], bpm=72, bars=2, lufs=-32)),
    ('THE HEAT', 'THE BILL'),            # v32-7.03: "the swing's bass pedal and the shimmer hold under the call"
    ("ELGOOG'S CODE RED", dict(chords=['Eb9sus4', 'Bbm9'], bpm=104, bars=1, lufs=-32)),
    ("THE LANDLORD'S DEAL", dict(chords=['Eb9sus4', 'Abmaj9'], bpm=96, bars=1, lufs=-31, stop_sound='collar_pop_F5',
                                 resume_sound='key_ring_jangle_2', resume_beat='v32-9.10k')),
    ('LOBBY', "THE LANDLORD'S DEAL"),   # v32-9.10k: "the caper's new phrase comes in on the jangle" (the resume above)
    ('SYDNEY', dict(chords=['Eb9sus4', 'Abmaj9'], bpm=96, bars=1, lufs=-33)),
    ('THE DUEL', dict(chords=['Fm11', 'Eb9sus4'], bpm=88, bars=2, lufs=-31)),
    ('THE PAUSE LETTER', dict(chords=['Bbm9', 'C7#9b13'], bpm=72, bars=2, lufs=-33, stop_beat='v31-12.03')),
    ('THE WHITE HOUSE', dict(chords=['Abmaj9', 'Eb9sus4'], bpm=88, bars=2, lufs=-32)),
    ('THE BRIDGE', None),
    ('THE SENATE', dict(chords=['Bbm9', 'Eb9sus4'], bpm=96, bars=2, lufs=-32, gap_beat='15.12')),
    ('THE TOUR', dict(chords=['Fm11', 'Dbmaj9#11'], bpm=120, bars=1, lufs=-30)),
    ('THE ROOFTOP', dict(chords=['Dbmaj9#11', 'Gm7b5'], bpm=72, bars=2, lufs=-32, stop_beat='17.13')),   # v3.3: the glass (17.12) is cut; the pad stops at the black
    ('ACT THREE', dict(chords=['Fm9', 'Dbmaj9#11'], bpm=66, bars=4, lufs=-34)),
    ('THE CLOCK', dict(chords=['Fm9'], bpm=96, bars=4, lufs=-32, stop_beat='23.04')),
    ('NOON, LAS VEGAS', dict(chords=['Fm9', 'C7#9b13'], bpm=72, bars=2, lufs=-32, stop_silence=True)),
    ('THAT NIGHT', dict(chords=['Fm9'], bpm=60, bars=4, lufs=-35)),
    ("THE BOARD'S SIDE, 11:52", dict(chords=['Fm9', 'C7#9b13'], bpm=72, bars=2, lufs=-33)),
    ("THE BOARD'S SIDE", dict(chords=['Bbm9', 'Eb9sus4'], bpm=96, bars=2, lufs=-33)),
    ('2 AM', dict(chords=['Abmaj9', 'Db69#11'], bpm=72, bars=2, lufs=-32, duck=8)),
    ('THE AVALANCHE', dict(chords=['Abmaj9', 'Eb9sus4'], bpm=120, bars=1, lufs=-29, stop_beat='S6.06')),
    ('THE RETURN', dict(chords=['Abmaj9', 'Db69#11', 'Eb9sus4'], bpm=96, bars=2, lufs=-31)),
    ('CODA', dict(hum='vault_hum_F', lufs=-36)),
    ('none', None),                      # v32-S1.13, v32-S5.00: the room only (the felt note is the score pass's)
    # v3.5's new cues (temp pads in their colour; the score pass writes the real ones)
    ('THE FIRST WEEKS', dict(chords=['Abmaj9', 'Eb9sus4'], bpm=120, bars=1, lufs=-30)),
    ('3 AM', None),                                  # no score: the fans; one felt note (the score pass's)
    ('the JUN 2018 cue', 'JUN 2018'),
    ('JUN 2018', dict(chords=['Dbmaj9#11', 'Abmaj9'], bpm=66, bars=2, lufs=-33)),
    ('THE WINDOW', dict(chords=['Abmaj9', 'Db69#11'], bpm=84, bars=2, lufs=-32)),
    ('one felt note under the lamp', None),
    ('the vision post', dict(chords=['Fm9', 'Dbmaj9#11'], bpm=66, bars=4, lufs=-34)),
    ('a smug little sting', None),
    ('procedural comedy, MM-20', 'THE SENATE'),
    ('MAR 2019', dict(chords=['Bbm9', 'Abmaj9'], bpm=88, bars=2, lufs=-32)),
    ("MM-20's last phrase", 'THE SENATE'),
    ('THE RUN (MM-03)', 'THE TOUR'),
    ('THE WAR ROOM', dict(chords=['Fm9', 'C7#9b13'], bpm=120, bars=1, lufs=-31)),
    ('the pulse drops out', None),                   # the flight: the plane's hum, one felt note
    ('TPOOL', dict(chords=['Fm9'], bpm=60, bars=4, lufs=-36)),
    ("the procedure's pedal only", "THE BOARD'S SIDE"),
    ('no score; the bullpen', None),                 # Alyi alone
    ('TAG', dict(chords=['F9sus4', 'Dbmaj9#11'], bpm=66, bars=4, lufs=-34, stop_sound='synth:thud', gap_beat='v31-32.01d')),
]


def mood_of(text):
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
    return json.load(open(os.path.join(ROOT, f'show/reel/ep01-v35/ep01-v35-{seg}.json')))


def plan_beats(seg):
    """the v3.1 plan's beats, with the v3 plan's jcut / lcut where the v3.1 plan doesn't set its own"""
    v31 = {b['id']: b for b in json.load(open(os.path.join(BP_DIR, f'{seg}.json')))['beats']}
    v3 = {b['id']: b for b in json.load(open(os.path.join(V3_BP_DIR, f'{seg}.json')))['beats']}
    out = {}
    for bid, b in v31.items():
        b = dict(b)
        for k in ('jcut', 'lcut'):
            if k not in b and k in v3.get(bid, {}):
                b[k] = v3[bid][k]
        out[bid] = b
    return out


def first_room(seg):
    tl = seg_timeline(seg)
    b0 = next(b for b in tl['beats'] if b.get('room') not in ('', 'black', 'void', None))
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
        qa['layers'] += [{'room': 'room tone (the v2 card stand-in)', 'lufs': -38}, {'lead': nxt_room, 'from': CARD_S - nxt_lead}]
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
    if seg not in BEFORE_VIDEO and i_next < len(ORDER):
        nr, nl = first_room(ORDER[i_next])
        nl = max([nl] + [j['lead_s'] for j in plan_beats(seg).get(beats[-1]['id'], {}).get('jcut', [])
                         if 'sound' in j and beats[-1]['id'] in NEXT_CHAPTER_JCUT])
        x = room(ORDER[i_next], nr, int((nl + 0.1) * SR))
        if x is not None:
            add(rooms, fade(x, nl, 0.0), total - nl)
            qa['layers'].append({'room (next chapter, leading)': nr, 'from': round(total - nl, 2), 'lead': nl})
    # the previous chapter's L-cut (Act Four's vault pedal into the tag)
    if seg == 'tag':
        pb = plan_beats('act4').get('S8.10', {})
        for lc in pb.get('lcut', []):
            x = loop('vault_hum_F', int(lc.get('over_s', 1.0) * SR), -36)
            add(mus, fade(x, 0.0, lc.get('over_s', 1.0)), 0.0)
            qa['layers'].append({'L-cut from Act Four': lc['sound'], 'over_s': lc.get('over_s', 1.0)})

    # ---------------------------------------------------------------- the one silence (Act Four)
    sil = None
    if seg == 'act4' and 'v31-S1.08d' in BI and 'S1.11' in BI:
        c = [sd['at'] for sd in beats[BI['v31-S1.08d']].get('sounds', []) if 'click' in sd['name']]
        z = [sd['at'] for sd in beats[BI['S1.11']].get('sounds', []) if sd['name'] in ('BUZZ', 'phone_buzz_desk')]
        sil = (s_of('v31-S1.08d') + (c[-1] if c else 1.9), s_of('S1.11') + (z[0] if z else 0.3))
        ia, ib = int(sil[0] * SR), int(sil[1] * SR)
        rooms[ia:ib] = 0.0
        tone = loop('room_tone', ib - ia, -50)
        add(rooms, tone, sil[0])
        qa['layers'].append({'silence': [round(sil[0], 2), round(sil[1], 2)], 'what': 'rooms out, room tone -50 LUFS (the Remove click to the buzz)'})

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
    if seg == 'coldopen':
        stem, sr = sf.read(CO_STEM, always_2d=True, dtype='float32')
        off = s_of('1.01')
        v2 = json.load(open(os.path.join(ROOT, 'show/reel/ep01-full/ep01-coldopen-v2.json')))['beats']
        v2s, _ = clock(v2)
        r0, r1 = v2s[[b['id'] for b in v2].index('3.02')]            # the v2 rewind, on the stem's clock
        new_end = total - off                                        # where this cold open ends, on the stem's clock
        keep = stem[:int(r1 * SR)].copy()
        extra = new_end - r1
        if extra > 0.05:   # the new rewind runs on 'too far': the v2 rewind again, twice as fast, into the intro's cut
            rw = stem[int(r0 * SR):int(r1 * SR)]
            idx = np.arange(0, len(rw), 2)[:int(extra * SR)]
            tail = fade(rw[idx].astype('float64'), 0.02, 0.03).astype('float32')
            keep = np.concatenate([keep, tail])
            qa['decisions'].append(f'cold open: the v2 stem to the end of its rewind ({r1:.2f} s), then the rewind again at 2x for {extra:.2f} s')
        stem = keep
        add(mus, stem, off)
        head = fade(stem[:int(off * SR)].copy(), off * 0.9, 0.0)   # the hall under the black: the stem's own first half second
        add(mus, head, 0.0)
        qa['layers'].append({'music+rooms+sfx': os.path.relpath(CO_STEM, ROOT), 'offset_s': off,
                             'why': 'the cold open is v2 timing after the 0.5 s black, so its v2 stem lines up; the black gets the stem\'s first 0.5 s'})
        fx[:] = 0.0          # (the stem has the cold open's SFX and hall; the per-beat pass above would double them)
        rooms[:] = 0.0
        qa['sfx'] = [['(in the v2 stem)']]
    else:
        mruns = []
        for i, b in enumerate(beats):
            m = next((c[len('music (v3.5): '):] for c in b.get('cues', []) if c.startswith('music (v3.5)')), '')
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
    if seg != 'coldopen':
        rooms *= unduck(u, ROOM_DIP)[:, None]
        fx *= unduck(u, 0.0)[:, None]
        low = db(MIX_DUCK)
        dd = 1 + (low - 1) * u
        tgt = 1 + (db(-duck_depth) - 1) * u
        mus *= (tgt / dd)[:, None]
    bus = rooms + fx + mus
    return bus, qa, total


def main(argv):
    segs = [a for a in argv if a in ORDER] or ORDER
    for seg in segs:
        bus, qa, total = build(seg)
        pk = float(np.abs(bus).max())
        if pk > db(-1.0):
            bus *= db(-1.0) / pk
            qa['peak_trim_db'] = round(20 * np.log10(db(-1.0) / pk), 2)
        out = os.path.join(HERE, f'{seg}-bed.wav')
        sf.write(out, bus, SR, subtype='PCM_16')
        qa['seconds'] = round(len(bus) / SR, 3)
        qa['chapter_seconds'] = round(total, 3)
        qa['lufs'] = round(A1.lufs(bus.astype('float64')), 2) if len(bus) > SR else None
        qa['peak_dbfs'] = round(20 * np.log10(float(np.abs(bus).max()) + 1e-12), 2)
        json.dump(qa, open(os.path.join(HERE, f'{seg}-bed-qa.json'), 'w'), indent=1)
        print(f'{os.path.relpath(out, ROOT)}: {qa["seconds"]} s, {qa["lufs"]} LUFS, peak {qa["peak_dbfs"]} dBFS, '
              f'{len(qa["sfx"])} sfx, missing {qa["sfx_missing"]}')
        for d in qa['decisions']:
            print('   ', d)


if __name__ == '__main__':
    main(sys.argv[1:])
