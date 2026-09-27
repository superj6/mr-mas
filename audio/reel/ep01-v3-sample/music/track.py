#!/usr/bin/env python3
"""Ep1 stick v3 SAMPLE · the temp music stem · one 332.88 s, 48 kHz stereo WAV on the sample's clock (0 = its first frame)

Brief: the lead, 2026-09-27, on the showrunner's note "let's also make sure the soundtrack and general feeling has some
variety, not everything needs to sound super suspenseful or else the suspense parts lose their pull".  Three moods in
one stem: A warm and giddy, B suspense (Act Four v5's own material, re-fitted), C warm and loyal.  Warm colours are
authorised for this sample (major / lydian away from F: A-flat major, D-flat lydian, with brushes, Rhodes, felt, chip).

THE CLOCK.  Every sync point is read from the sample timeline show/reel/trials/ep01-v3-sample.json with the same
frame-rounded beat starts as the lead's mixer (audio/reel/ep01-v3-sample/mix.py): a line's first sound = its beat's
start + t, a sound = its beat's start + at.  The section edges are the brief's.  Rendered by the OST engine
(audio/ost/engine, imported read-only) as four cues, then laid on the clock here.

  s        cue       what plays                                                               (the brief's map)
  0-2.5    -         silence (reviewer slate)
  A  LAUNCH NIGHT (a_launch, A-flat major, swung 96; P01 colours + P11 SET-PIECE SWING in major)
  2.52     A1        the late-night trio: Rhodes, felt, brushes, upright; GERG'S BUILD in A-flat major (chip 16ths,
                     straight, in compile passes placed in the gaps and under Gerg); the felt doubles each pass's
                     first note (Mas is with him).  Under every V.O. the Rhodes gives way to the felt, the brushes
                     only sweep, the bass holds its root.  No chord or pass starts inside one of Mas's room lines.
                     The harmony never lands on A-flat after Alyi's question: Db-minor(add9) shades "what if it wakes
                     up?", then E-flat13sus hangs from "Your button." through the click.
  72.0     click     the Build's 16-note pass ends on the bar; E-flat13sus held (Rhodes + felt), nothing moves
  74.5     A2        felt only: D-flat maj9(#11) (the deceptive IV); ALYI'S DOOR head on the felt in the gaps
                     (Ab4 Db5 | C5 G4, ending on the #4: it never cadences); Bbm9; Eb13sus pickup
  89.5     A3        the chatbot: the trio back, the Build lighter, doubled by violin pizz; no motion on punchlines
  111.98   A4 lift   the counter: ride in, walking bass, the Build compiles 4 + 8 into the downbeat
  114.48   A4 swing  SET-PIECE SWING in A-flat major, 4-bar phrases on the cut frames: Ab6/9 -> Dbmaj9(#11) | the
                     CLUNK (119.48) drops it a major third to E6/9 -> B13sus | the post (124.48): C6/9, one brass hit,
                     thinned | the push into the MILLION on the swung and-of-4 (129.27), the Build's tag "shipped"
                     (Eb5 -> Ab5) so the odometer's ratchet owns the downbeat | Gerg posts it | one band hit on the
                     cut to Rima (134.9), then a held Abmaj9 under "Low-key." / "Very low. Basement."
                     (The descent A-flat -> E -> C -> A-flat is the landlord's cycle of major thirds, run backwards:
                     the building he falls through is hers.)
  138.60   A5 heat   THE TURN: the held Abmaj9 voice-leads into THE ACHE (vc Ab2 -> F2, vla C3 holds, vln G4 holds,
                     vln Eb5 -> Db5; glass G4 + Db5): the first dark bar of the sample, under the red tile and the
                     palette steps (F, Ab, C: the SFX spell F minor).  From Rima's line: the F2/C3 pedal only.
  156.31   tear      the pedal lets go; the Ache rings once more, ppp, on the tear; out by 160.33
  160.33   -         silence (slate)
  B  NOON, LAS VEGAS (b1_noon + b2_night: Act Four v5's S1 and S2, re-fitted; F minor / F dorian / the F pedal)
  162.83   B1        the suite: an F3/C4 sul-tasto pedal bows in (sparse air); v5's felt Water Line bar, its nudge
                     on his glass nudge (168.74); THE PLAN from the blueprint (170.82) on v5's own frames + 164.82 s:
                     the stamp, the waltz's walk-offs, one Blueprint note per label, the held chord, the path
  194.45     "       BREAK: the stuck G-Ab loop runs on (thinned under "alyi set it up. probably just the budget.");
                     the TAPE-STOP starts after his last word and reaches zero ON the JOIN click (199.83)
  199.83     "       LEVERAGE (low), v5's take on S1.07-S1.09's frames + 167.43 s; the Cancel click (208.98): D6,
                     digital zero.  No score to 218.91 (the room, the buzz, "super.")
  218.91   B2        v5's S2 (MM-08 26A): the felt's open fifth on the carve, the nudge G4 before "i don't keep
                     score.", the F3/C4 pedal, mark 3, the settle, the Rewind; a fast ring-out into the slate
  232.83   -         silence (slate)
  C  2 AM (c_two_am, D-flat lydian / A-flat major, swung 96 on the hearts' beat)
  235.40   C         the felt alone: a Db lydian chord, then THE WATER LINE warm (F F F G F | C F over Dbmaj9(#11)
                     and Bbm9; the chip square on the nudge only)
  240.40     "       the count: the felt's left hand ticks quarters on the hearts' tempo (varied pitches, it starts
                     before the first heart and ends after the last), Eb13sus -> back to Db as he miscounts
  245.72     "       the Orb's look: one held chord (Ab(add9)/C), the Water Line's C4 before "mostly."
  251.02     "       Gerg's call: Abmaj9 on the ring; THE BUILD enters warm (chip + felt) after the V.O., in compile
                     passes under Gerg, resting under Mas's line
  266.4      "       the letter: a Db3/Ab3 sul-tasto pedal only (the record plays dry); out on "Alyi signed it."
  290.3-296.25       silence (no score: "alyi voted." / "He did both.")
  296.55     "       the check: the felt returns softly (Ab(add9), then Eb13sus after the stamp)
  302.12     "       the Build returns warm; rests under "what are you building?"; 8 under "The company. Again."
  306.0      "       the V.O.: felt + a soft viola/cello pad (Ab3/Eb4), THE HELD NOTE
  308.84     "       a 12-note pass cut DEAD on his look up (309.41); the pad holds under "pack?" / "compiles."
  316.02     "       the door: TASYA'S FLOOR takes the held chord (the pad's Ab3/Eb4 are already hers), the Rhodes
                     on the beats; the floor moves under her: Cmaj9 (the viola's Eb nudged to E), Emaj9, home to
                     Abmaj9 on "desk" (325.48)
  329.20     "       after "leave it open.": the felt takes the landlord's chord back WITHOUT ITS THIRD (Eb3 Ab3 Bb3)
                     and the Water Line settles C4 -> F4 over it: A-flat 6/9, no third; rings out to 332.88

Levels: rendered at underscore level (each cue's own master normalised by the engine: A, B1, C -20 LUFS-I; B2 -22 as
v5), dry of dialogue; the lead's mixer ducks it.  Nothing here has been listened to.

Run (from the repo root; a heavy job, so through ops/heavy.sh, two workers):
    OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --render
    audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --dry          # scores + note QA, no audio
    audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --assemble     # re-lay the renders, measure
    ... --render a c    renders only those cues (a b1 b2 c), then assembles
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import math
import os
import sys
import time
from dataclasses import replace

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
OST = os.path.join(REPO, 'audio', 'ost')
V5 = os.path.join(OST, 'tracks', 'e01-act4-v5')
WORK = os.path.join(HERE, '_work')                      # the four cue renders (git-ignored: audio/**/_work/)
OUT_WAV = os.path.join(HERE, 'music.wav')
CUES_JSON = os.path.join(HERE, 'cues.json')
TIMELINE = os.path.join(REPO, 'show', 'reel', 'trials', 'ep01-v3-sample.json')
if OST not in sys.path:
    sys.path.insert(0, OST)
from engine import *   # noqa: E402,F401,F403
from engine.core import SR, nm   # noqa: E402

LENGTH = 332.88                       # the stem's exact length (the brief)
FPS = 24
Q = 0.625                             # a beat at 96 BPM
S16 = Q / 4                           # a sixteenth

# ================================================================== the sample's clock (as the mixer lays it)
TL = json.load(open(TIMELINE))
BEAT, LINES, SOUNDS = {}, [], []
_acc, _prev = 0.0, 0
for _b in TL['beats']:
    _acc += _b['reelDur']
    _end = max(_prev + 1, round(_acc * FPS))
    t0 = _prev / FPS
    BEAT[_b['id']] = (t0, _end / FPS)
    for _l in _b.get('lines', []):
        on = t0 + _l['t']
        LINES.append(dict(id=_l['id'], who=_l['who'], tag=_l.get('tag') or '', on=on, end=on + _l['dur'],
                          text=_l['text'], beat=_b['id'],
                          words=[(w[0], on + w[1], on + w[2]) for w in _l.get('words', [])]))
    for _s in _b.get('sounds', []) or []:
        SOUNDS.append(dict(beat=_b['id'], name=_s['name'], t=t0 + _s['at']))
    _prev = _end
TL_LEN = _prev / FPS
LN = {l['id']: l for l in LINES}


def B(bid):
    return BEAT[bid][0]


def Lon(lid):
    return LN[lid]['on']


def Lend(lid):
    return LN[lid]['end']


def W(lid, word):
    for w, a, _ in LN[lid]['words']:
        if w.lower().strip('.,?!"\'…').startswith(word.lower()):
            return a
    raise KeyError((lid, word))


def snd(bid, name, k=1):
    hits = [s['t'] for s in SOUNDS if s['beat'] == bid and s['name'] == name]
    return hits[k - 1]


def is_vo(l):
    return l['tag'] == 'V.O.'


def overlaps(t0, t1, pred=lambda l: True, pad=0.0):
    return [l for l in LINES if pred(l) and l['on'] - pad < t1 and l['end'] + pad > t0]


def in_vo(t0, t1=None, pad=0.05):
    return bool(overlaps(t0, t1 if t1 is not None else t0 + 1e-3, is_vo, pad))


def mas_room(t0, t1=None, pad=0.08):
    """one of Mas's room lines (spoken aloud, not V.O.) is sounding: the score holds, nothing starts"""
    return overlaps(t0, t1 if t1 is not None else t0 + 1e-3, lambda l: l['who'] == 'mas' and not is_vo(l), pad)


def clear_of_mas(t, latest, vo=True):
    """a chord / note wanted at t: if one of Mas's room lines (or a V.O.) is sounding, move it to just after the line
    (if that is still before `latest`), else None (drop it)"""
    hit = mas_room(t) + (overlaps(t, t + 1e-3, is_vo, 0.05) if vo else [])
    if not hit:
        return t
    t2 = max(l['end'] for l in hit) + 0.06
    return t2 if t2 < latest else None


# ------------------------------------------------------------------ the brief's section edges (sample seconds)
A_IN, A_OUT = 2.50, 160.33
B1_IN = 162.83
JOIN = B('S1.07') - 0.02                              # 199.83: he clicks JOIN (the brief); LEVERAGE's first eighth
CANCEL = B('S1.09') + 2.4                             # the Cancel click (the timeline's sound): D6
B2_IN, B2_OUT = B('S2.01'), 232.83
C_IN, C_OUT = 235.33, LENGTH
C_REST = (290.30, 296.25)                             # "alyi voted." / "He did both.": no score
SILENT = [(0.0, A_IN, 'reviewer slate'), (A_OUT, B1_IN, 'reviewer slate'),
          (CANCEL, B2_IN, 'D6: the Cancel click -> the carve (room, the buzz, "super.")'),
          (B2_OUT, C_IN, 'reviewer slate'), (C_REST[0], C_REST[1], '"alyi voted." / "He did both." (room only)')]


def check_clock():
    """the brief's numbers against the timeline (warn, don't stop: the brief wins where they disagree)"""
    notes = []
    for label, got, want, tol in [('the click (5.08)', B('5.08'), 72.00, 0.05),
                                  ('the two-hander (5.09)', B('5.09'), 74.29, 0.05),
                                  ('the chatbot (5.10)', B('5.10'), 89.50, 0.05),
                                  ('the counter (5.12)', B('5.12'), 111.88, 0.05),
                                  ('the odometer grows (6.01)', B('6.01'), 114.46, 0.05),
                                  ('the clunk (6.02)', snd('6.02', 'letter_clunk'), 119.46, 0.05),
                                  ('the heat (6.09)', B('6.09'), 138.58, 0.05),
                                  ('the tear (7.02)', B('7.02'), 156.33, 0.05),
                                  ('the suite (S1.01)', B('S1.01'), 162.83, 0.05),
                                  ('the blueprint (S1.03)', B('S1.03'), 170.83, 0.05),
                                  ('the Cancel click', CANCEL, 209.4, 0.05),
                                  ('the JOIN click sound (S1.06)', snd('S1.06', 'dialog_ok_click'), JOIN, 0.05),
                                  ('the dark room (S2.01)', B('S2.01'), 218.92, 0.05),
                                  ('2 AM (S5.02)', B('S5.02'), 235.33, 0.05),
                                  ('Gerg rings (S5.09)', B('S5.09'), 250.92, 0.05),
                                  ('the letter (S5.06)', B('S5.06'), 267.46, 0.05),
                                  ('the look (S5.09b)', B('S5.09b'), 309.42, 0.05),
                                  ('the door (S5.11)', B('S5.11'), 316.00, 0.05)]:
        if abs(got - want) > tol:
            notes.append(f'{label}: timeline {got:.3f} s, brief {want:.2f} s')
    return notes


# ================================================================== shared helpers
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
ACC4 = (1.0, 0.72, 0.84, 0.72)


def cell(shift=0):
    """GERG'S BUILD (OST-BIBLE s2.6) moved into A-flat major: the same contour, degrees 1 1 2 3 5 3 2 1 | 1 1 2 3 5 7 5 3"""
    return [nm(p) + shift for p in BUILD_AB]


def pedal_track(spans):
    """sustain pedal from [(down, up)] spans (file s): down with each chord, up at its end, re-caught where the next
    chord comes first; notes outside every span play dry"""
    spans = sorted(spans)
    out = [(-1.0, False)]
    for i, (t0, t1) in enumerate(spans):
        if i + 1 < len(spans):
            t1 = min(t1, spans[i + 1][0] - 0.03)
        out += [(t0 - 0.03, False), (t0 - 0.005, True), (max(t0 + 0.01, t1), False)]
    return out


def load_v5(name):
    """import one of Act Four v5's score files read-only (hyphenated names)"""
    key = name.replace('-', '_')
    if key in sys.modules:
        return sys.modules[key]
    spec = importlib.util.spec_from_file_location(key, os.path.join(V5, name + '.py'))
    m = importlib.util.module_from_spec(spec)
    sys.modules[key] = m
    spec.loader.exec_module(m)
    return m


def rebow(a, inst, pitches, t0, t1, vel, **x):
    return load_v5('s1-s4_common').rebow(a, inst, pitches, t0, t1, vel, **x)


class Clock:
    """a cue's file clock: file t = 0 at sample time T0"""

    def __init__(self, T0):
        self.T0 = T0

    def __call__(self, t):              # sample -> file
        return t - self.T0

    def x(self, tf):                    # file -> sample
        return tf + self.T0


# ================================================================== A · LAUNCH NIGHT
GROWS = B('6.01')                                     # 114.48: the odometer grows (phrase 1's downbeat)
T0A = GROWS - 2.5 * 45                                # 1.98: grid bar b starts at T0A + 2.5 (b - 1)
CH = {  # chord -> (Rhodes, felt, bass root, bass fifth).  No F-bass ever carries an A natural (rule 12).
    'Abmaj9':    (['C4', 'Eb4', 'G4', 'Bb4'], ['Eb3', 'G3', 'C4'], 'Ab2', 'Eb2'),
    'Abmaj9/C':  (['Eb4', 'G4', 'Bb4', 'C5'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Dbmaj9#11': (['F3', 'Ab3', 'C4', 'Eb4'], ['Db3', 'Ab3', 'C4', 'F4'], 'Db3', 'Ab2'),
    'Dbm(add9)': (['E3', 'Ab3', 'Db4', 'Eb4'], ['Db3', 'Ab3', 'E4'], 'Db3', 'Ab2'),
    'Bbm9':      (['Ab3', 'C4', 'Db4', 'F4'], ['Db3', 'Ab3', 'C4'], 'Bb2', 'F2'),
    'Cm7':       (['Bb3', 'Eb4', 'G4'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Eb13sus4':  (['Db4', 'F4', 'Ab4', 'C5'], ['Eb3', 'Ab3', 'Db4', 'F4'], 'Eb2', 'Bb2'),
    'Ab69':      (['C4', 'Eb4', 'F4', 'Bb4'], ['Ab3', 'Eb4', 'F4'], 'Ab2', 'Eb3'),
    'E69':       (['Ab3', 'Db4', 'Gb4', 'B4'], ['E3', 'B3', 'Gb4'], 'E2', 'B2'),
    'B13sus4':   (['A3', 'Db4', 'E4', 'Ab4'], ['B2', 'A3', 'E4'], 'B2', 'Gb2'),
    'C69':       (['E3', 'A3', 'D4', 'G4'], ['C3', 'G3', 'D4'], 'C3', 'G2'),
}
HARM_A = {2: 'Abmaj9', 3: 'Dbmaj9#11', 4: 'Bbm9', 5: 'Eb13sus4', 6: 'Abmaj9', 7: 'Dbmaj9#11', 8: 'Cm7', 9: 'Eb13sus4',
          10: 'Abmaj9', 11: 'Dbmaj9#11', 12: 'Bbm9', 13: 'Eb13sus4', 14: 'Abmaj9/C', 15: 'Dbmaj9#11', 16: 'Bbm9',
          17: 'Eb13sus4', 18: 'Abmaj9', 19: 'Dbmaj9#11', 20: 'Cm7', 21: 'Bbm9', 22: 'Eb13sus4', 23: 'Dbm(add9)',
          24: 'Abmaj9/C', 25: 'Dbmaj9#11', 26: 'Bbm9', 27: 'Eb13sus4', 28: 'Eb13sus4',
          36: 'Dbmaj9#11', 37: 'Cm7', 38: 'Bbm9', 39: 'Eb13sus4', 40: 'Dbmaj9#11', 41: 'Cm7', 42: 'Bbm9',
          43: 'Eb13sus4', 44: 'Eb13sus4'}
# the Build's compile passes under the talk (sample s, notes, vel): in the gaps, and under Gerg's own lines;
# never inside a V.O., one of Mas's lines or right after a punchline
PASSES_A1 = [(3.23, 4, 0.30), (4.48, 8, 0.32), (15.105, 8, 0.30), (21.98, 8, 0.26), (26.355, 4, 0.28),
             (32.92, 4, 0.28), (35.574, 4, 0.28), (45.63, 4, 0.26), (49.98, 4, 0.25), (66.98, 8, 0.30),
             (69.48, 16, 0.30)]
PASSES_A3 = [(89.48, 8, 0.30), (93.23, 4, 0.28), (99.48, 8, 0.30), (106.98, 8, 0.27)]


def tracks_a():
    T = palette()
    T['felt'].gain_db = -2.0
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -14.0
    T['rhodes'].gain_db = -7.0
    T['rhodes'].sends = {'room': -12, 'plate': -14}
    T['lead'].gain_db = -6.0                          # the Build sits low: a keyboard in the next room
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    for k in ('ubass', 'cb_pizz'):                    # the pizz body resonance near 111 Hz (v5 S5 / MM-08)
        T[k].eq = list(T[k].eq) + [('peq', 111.3, -10.0, 8.0)]
    T['ubass'].gain_db = -1.0
    T['cb_pizz'].gain_db = -7.0
    T['swish'].gain_db = 2.0
    T['swish'].eq = [('lp', 6500)]
    T['brush'].gain_db = 8.0
    T['jazz'].gain_db = 3.0
    for k in ('vln1', 'vln2'):
        T[k].gain_db = -4.0
        T[k].sends = {'hall': -10, 'room': -16}
    for k in ('vla', 'vc'):
        T[k].gain_db = -2.0
        T[k].sends = {'hall': -10, 'room': -16}
    for k in ('tpt', 'tbn'):
        T[k].gain_db = -9.0
    T['glasspad'].gain_db = -12.0
    T['xylo'].gain_db = -14.0
    return T


def cue_a():
    s = Clock(T0A)
    g = Grid(bpm=96, meter='4/4', bars=66, swing=1.0)
    a = Arr(g)
    T = tracks_a()
    bar = lambda b: T0A + 2.5 * (b - 1)                               # noqa: E731  (sample s)
    bt = lambda b, beat=1.0: bar(b) + (beat - 1.0) * Q                 # noqa: E731  (straight, sample s)
    sw = lambda b, beat: s.x(g.s(b, beat))                            # noqa: E731  (swung, sample s)
    assert abs(bar(29) - B('5.08')) < 0.06 and abs(bar(36) - B('5.10')) < 0.06
    assert abs(bar(48) - snd('6.02', 'letter_clunk')) < 0.03 and abs(bar(52) - B('6.06')) < 0.03
    marks, sections, felt_ped = [], [], []

    def n(inst, p, t, d, v, lock=False, **x):
        return a.n(inst, p, s(t), d, v, lock, **x)

    def ch(inst, ps, t, d, v, roll=0.01, **x):
        return a.ch(inst, ps, s(t), d, v, roll=roll, **x)

    def fch(ps, t, d, v, roll=0.014, span_end=None):
        """a felt chord, pedal down for its length (or to span_end)"""
        felt_ped.append((s(t), s(span_end if span_end is not None else t + d)))
        return ch('felt', ps, t, d, v, roll=roll)

    def mark(t, label, hit=True):
        marks.append((t, label, hit))

    def build16(t0, count, vel, shift=0, idx0=0, stop_at=None, felt_double=True, pizz=False, duty=0.5):
        ps = cell(shift)
        out = []
        if duty == 0.25:                                              # the swing's chip is its lead (P11)
            vel *= 1.2
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.01:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.005)
            j = (idx0 + i) % 16
            out.append(n('lead', ps[j], t, d, vel * ACC4[i % 4], True, duty=duty, att=0.002, dec=0.09, sus=0.45,
                         rel=0.035))
            if felt_double and i == 0:
                n('felt', ps[j] - 12, t, 0.5, 0.2)
            if pizz and i % 4 == 0:
                n('vln1', ps[j], t, 0.2, 0.3, art='pizz')
        return out

    # ---------------------------------------------------------------- A1 / A3: the trio under the talk
    def vo_bar(b):
        t0, t1 = bar(b), bar(b) + 2.5
        return sum(max(0.0, min(t1, l['end']) - max(t0, l['on'])) for l in overlaps(t0, t1, is_vo)) > 0.8

    def trio(b0, b1):
        for b in range(b0, b1):
            name = HARM_A[b]
            rh, fe, root, fifth = CH[name]
            t = bar(b)
            vo = vo_bar(b)
            if vo:                                                    # the felt carries the V.O. (P01), softly
                fch(fe, t, 2.4, 0.16)
            else:
                tt = clear_of_mas(t, t + Q * 2)
                if tt is not None:
                    ch('rhodes', rh, tt, 2.25 - (tt - t), 0.27 if overlaps(tt, tt + 1.0) else 0.31, roll=0.008)
            # the bass: a two-feel (root, fifth); the root alone under a V.O.; nothing new inside Mas's lines
            tb = clear_of_mas(t, t + Q, vo=False)
            if tb is not None:
                n('ubass', root, tb, (Q * 3.8 if vo else Q * 1.85) - (tb - t), 0.44)
            if not vo:
                t3 = bt(b, 3)
                if not mas_room(t3):
                    n('ubass', fifth, t3, Q * 1.85, 0.38)
            # brushes: the sweep every bar; taps on 2 and 4 only away from the V.O. and Mas's lines
            taps = ''.join('o' if (k in (2, 6) and not vo and not mas_room(bt(b, 1 + k / 2)) and not in_vo(bt(b, 1 + k / 2)))
                           else '.' for k in range(8))
            Drums(a, 'brushes').play(f'sweep: ~~~~~~~~\ntap: {taps}', bars=(b, b + 1), vel=0.5)

    # b1: the first sound after the slate: a Rhodes bloom, then the Build's first pass (the button's program)
    ch('rhodes', CH['Abmaj9'][0], 2.52, 1.9, 0.22, roll=0.03)
    mark(2.52, 'A1: the Rhodes blooms (A-flat maj9) on the button', hit=False)
    trio(2, 29)
    for t0, cnt, v in PASSES_A1:
        assert not in_vo(t0, t0 + cnt * S16) and not mas_room(t0, t0 + cnt * S16), (t0, cnt)
        build16(t0, cnt, v)
        mark(t0, f"the Build: compile pass ({cnt})")
    sections.append(('A1 launch night: the trio + the Build in A-flat major', A_IN, bar(29)))

    # b29: the click. The 16-note pass ends on the bar; Eb13sus held, nothing moves (72.0 -> 74.3)
    ch('rhodes', CH['Eb13sus4'][0], bar(29), 2.45, 0.21, roll=0.006)
    fch(CH['Eb13sus4'][1], bar(29), 2.45, 0.14, roll=0.01)
    n('ubass', 'Eb2', bar(29), 2.2, 0.28)
    mark(bar(29), 'the click: Eb13sus held (the dominant hangs; nothing happens)')
    sections.append(('the click: one held chord', bar(29), bar(30)))

    # A2: felt only. Alyi and Mas. The Door's head in the gaps (A-flat -> D-flat | C -> G: it ends on the #4)
    t = bar(30)
    l_alyi1 = [l for l in LINES if l['who'] == 'alyi' and 74.3 < l['on'] < 76.0][0]
    l_mas1 = [l for l in LINES if l['who'] == 'mas' and not is_vo(l) and 80.8 < l['on'] < 82.0][0]
    l_alyi2 = [l for l in LINES if l['who'] == 'alyi' and 82.4 < l['on'] < 84.0][0]
    l_mas2 = [l for l in LINES if l['who'] == 'mas' and not is_vo(l) and 84.5 < l['on'] < 86.5][0]
    t5 = l_alyi2['end'] + 0.12
    fch(['Db3', 'Ab3', 'C4', 'Eb4'], t, 6.0, 0.17, roll=0.018, span_end=t5)  # the pedal holds under the Door
    ch('felt', ['Db3', 'Ab3'], bar(31) + Q * 2, 3.0, 0.12, roll=0.02)          # a soft re-strike inside her line
    d1 = l_alyi1['end'] + 0.03                                              # after "...to that click."
    d2 = min(l_mas1['on'] - 0.3, d1 + 0.42)
    n('felt', 'Ab4', d1, 0.5, 0.22)
    n('felt', 'Db5', d2, 1.4, 0.21)                                          # held under "you counted."
    d3 = l_mas1['end'] + 0.06
    d4 = min(l_alyi2['on'] - 0.25, d3 + 0.34)
    n('felt', 'C5', d3, 0.4, 0.19)
    n('felt', 'G4', d4, 1.6, 0.19)                                           # the #4, held under "Someone should."
    for tt, lab in [(d1, 'the Door: Ab4 (after "...to that click.")'), (d2, 'the Door: Db5'),
                    (d3, 'the Door: C5 (after "you counted.")'), (d4, 'the Door: G4, the #4 held (it never cadences)')]:
        mark(tt, lab)
    fch(['Db3', 'Ab3', 'C4', 'F4'], t5, 3.2, 0.15, roll=0.016, span_end=l_mas2['end'] + 0.1)   # Bbm9
    t6 = l_mas2['end'] + 0.1
    fch(CH['Eb13sus4'][1], t6, 1.9, 0.16, roll=0.014)                        # the pickup into the chatbot
    mark(bar(30), 'A2: felt only, Dbmaj9(#11) (the deceptive IV after the click)')
    sections.append(('A2 the two-hander: felt only (the Door in the gaps)', bar(30), bar(36)))

    # A3: the chatbot. The trio back; the Build lighter, doubled by violin pizz
    trio(36, 45)
    for t0, cnt, v in PASSES_A3:
        assert not in_vo(t0, t0 + cnt * S16) and not mas_room(t0, t0 + cnt * S16), (t0, cnt)
        build16(t0, cnt, v, pizz=True)
        mark(t0, f"the Build (+ pizz): compile pass ({cnt})")
    sections.append(('A3 the chatbot flatters: the trio + the Build with pizz', bar(36), bar(45)))

    # ---------------------------------------------------------------- A4: SET-PIECE SWING in A-flat major
    def walk(b, ps, vel=0.62, beats=(1, 2, 3, 4)):
        for k, p in zip(beats, ps):
            if p is None:
                continue
            t = bt(b, k)
            n('ubass', p, t, Q * 0.92, vel * (1.0 if k in (1, 3) else 0.93))
            n('cb_pizz', p, t, Q * 0.92, vel * 0.7)

    def comp_ch(name, t, d, v):
        ch('rhodes', CH[name][0], t, d, v, roll=0.006)

    def charleston(b, name, v=0.38, second=None):
        comp_ch(name, bt(b, 1), Q * 1.3, v)
        comp_ch(second or name, sw(b, 2.5), Q * 0.45, v * 0.86)

    # the lift (b45): ride in, a walk up, the Build compiles 4 then 8 into the downbeat
    swing_ride(a, (45, 54), vel=0.34, hat=True, feathered_kick=0.16)
    walk(45, ['Eb2', 'F2', 'G2', 'A2'], 0.55)
    charleston(45, 'Eb13sus4', 0.3)
    build16(bar(45), 4, 0.36, felt_double=False, duty=0.25)
    build16(bt(45, 3), 8, 0.4, idx0=4, felt_double=False, duty=0.25)
    for bb in (4.0, 4.5):
        n('jazz', 38, sw(45, bb), 0.12, 0.28 if bb == 4.0 else 0.36)              # a two-note snare pickup
    mark(bar(45), 'A4 THE LIFT: the counter ticks (ride, walk, the Build 4 + 8)')

    # phrase 1: the odometer grows (b46), Dbmaj9 (b47), the CLUNK drops it a major third (b48), B13sus (b49)
    n('jazz', 36, bar(46), 0.2, 0.42)
    walk(46, ['Ab2', 'C3', 'Eb3', 'D3'])
    charleston(46, 'Ab69', 0.34)
    build16(bar(46), 4, 0.42, felt_double=False, duty=0.25)
    vo = [l for l in LINES if is_vo(l) and bar(46) < l['on'] < bar(47)][0]      # "someone noticed."
    fch(['Eb3', 'Ab3', 'C4', 'F4'], vo['on'] - 0.3, 1.9, 0.16, roll=0.012)
    mark(bar(46), 'phrase 1: the odometer grows (Ab6/9)')
    walk(47, ['Db3', 'C3', 'Ab2', 'F2'])
    charleston(47, 'Dbmaj9#11', 0.34)
    build16(bar(47), 12, 0.44, felt_double=False, duty=0.25)
    VL = []                                                                      # the violins' line (octaves)
    VL += [('Ab4', bt(47, 1), Q), ('Bb4', bt(47, 2), Q), ('C5', bt(47, 3), Q), ('Eb5', bt(47, 4), Q)]
    clunk = snd('6.02', 'letter_clunk')
    n('jazz', 36, clunk, 0.2, 0.55)
    walk(48, ['E2', 'Gb2', 'Ab2', 'A2'], 0.66)
    charleston(48, 'E69', 0.34)
    build16(bar(48), 16, 0.44, shift=-4, felt_double=False, duty=0.25)
    VL += [('B4', bt(48, 1), 2 * Q), ('Ab4', bt(48, 3), 2 * Q)]
    mark(clunk, 'THE CLUNK: through the desk, the harmony drops a major third (E6/9)')
    walk(49, ['B2', 'Ab2', 'B2', 'Db3'])
    charleston(49, 'E69', 0.33, second='E69')
    comp_ch('B13sus4', bt(49, 3), Q * 1.6, 0.3)
    build16(bar(49), 12, 0.42, shift=-4, felt_double=False, duty=0.25)
    VL += [('Gb4', bt(49, 1), 2 * Q), ('Db5', bt(49, 3), Q), ('B4', bt(49, 4), Q)]

    # phrase 2: the post (b50: C6/9, one brass hit, thin), the build to the million (b51), the MILLION (b52)
    post = bar(50)
    art.stab(a, 'tpt', ['E5', 'A4'], s(post), vel=0.62, length=0.2, spread_ms=2.0, offset=0.006)
    art.stab(a, 'tbn', ['D4', 'G3'], s(post), vel=0.6, length=0.22, spread_ms=2.0, offset=0.006)
    n('jazz', 36, post, 0.2, 0.45)
    walk(50, ['C3', 'G2'], 0.5, beats=(1, 3))
    comp_ch('C69', post, Q * 3.6, 0.27)
    VL += [('C5', bt(50, 1), 4 * Q)]
    mark(post, 'the post: C6/9, one brass hit, then thin (bass, ride, one chord)')
    walk(51, ['C3', 'D3', 'Eb3', 'G2'])
    charleston(51, 'C69', 0.33)
    comp_ch('Eb13sus4', bt(51, 3), Q * 0.9, 0.3)
    build16(bar(51), 12, 0.46, shift=-8, felt_double=False, duty=0.25)
    VL += [('D5', bt(51, 1), 2 * Q), ('Eb5', bt(51, 3), 1.6 * Q)]
    push = sw(51, 4.5)                                                           # the swung and-of-4 before 129.48
    n('lead', 'Eb5', bt(51, 4), S16 * 1.6, 0.44, True, duty=0.25, att=0.002, dec=0.12, sus=0.3, rel=0.05)
    n('lead', 'Ab5', push, 0.55, 0.46, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
    art.stab(a, 'tpt', ['F5', 'C5'], s(push), vel=0.66, length=0.24, spread_ms=2.0, offset=0.006)
    art.stab(a, 'tbn', ['Eb4', 'Bb3'], s(push), vel=0.62, length=0.26, spread_ms=2.0, offset=0.006)
    n('jazz', 38, push, 0.12, 0.4)
    n('jazz', 36, push, 0.2, 0.42)
    n('ubass', 'Ab2', push, (bt(52, 2) - push) * 0.95, 0.66)
    n('cb_pizz', 'Ab2', push, 0.5, 0.46)
    comp_ch('Ab69', push, Q * 1.4, 0.34)
    VL += [('Ab5', push, bt(52, 3) - push)]
    million = B('6.06')
    mark(push, 'the push into the MILLION (swung and-of-4): brass + the tag "shipped" (Eb5 -> Ab5)')
    mark(million, 'THE MILLION: no attack on the downbeat (the odometer ratchet owns it)', hit=False)
    walk(52, [None, 'C3', 'Eb3', 'D3'])
    comp_ch('Ab69', sw(52, 2.5), Q * 0.5, 0.3)
    VL += [('G5', bt(52, 3), Q), ('Eb5', bt(52, 4), Q)]
    # b53: Gerg posts it; the last compile of the run
    walk(53, ['Db3', 'C3', 'Eb3', 'Bb2'])
    charleston(53, 'Dbmaj9#11', 0.34)
    comp_ch('Eb13sus4', bt(53, 3), Q * 1.5, 0.3)
    build16(bar(53), 16, 0.44, felt_double=False, duty=0.25)
    VL += [('F5', bt(53, 1), 2 * Q), ('Eb5', bt(53, 3), Q), ('C5', bt(53, 4), Q)]
    n('jazz', 38, sw(53, 4.0), 0.12, 0.3)
    n('jazz', 38, sw(53, 4.5), 0.12, 0.36)
    # b54: one band hit on the cut to Rima (the swung and-of-1), then a held Abmaj9 under the two short lines
    hit = sw(54, 1.5)
    art.stab(a, 'tpt', ['F5', 'Bb4'], s(hit), vel=0.66, length=0.3, spread_ms=2.0, offset=0.006)
    art.stab(a, 'tbn', ['Eb4', 'C4', 'Ab3'], s(hit), vel=0.62, length=0.32, spread_ms=2.0, offset=0.006)
    n('jazz', 36, hit, 0.2, 0.5)
    n('jazz', 49, hit, 2.5, 0.26)                                                 # one soft crash, let ring
    n('ubass', 'Ab2', hit, 2.4, 0.6)
    n('cb_pizz', 'Ab2', hit, 1.0, 0.45)
    comp_ch('Ab69', hit, 3.2, 0.3)
    n('lead', 'Ab5', hit, 0.3, 0.36, True, duty=0.25, att=0.002, dec=0.15, sus=0.2, rel=0.08)
    mark(hit, 'the band hit on the cut to Rima; then the held chord (thin under "Low-key." / "Basement.")')
    for p, t0, d in VL:                                                            # the violins, in octaves
        n('vln1', p, t0, d * 0.98, 0.4, art='sus', att=0.06, rel=0.25)
        n('vln2', nm(p) - 12, t0, d * 0.98, 0.36, art='sus', att=0.06, rel=0.25)
    for nt in a.notes:                                                            # thin under "someone noticed."
        tt = s.x(nt.start)
        if vo['on'] - 0.25 <= tt < vo['end'] and nt.inst in ('jazz', 'rhodes', 'ubass', 'cb_pizz'):
            nt.vel *= 0.7
    sections.append(('A4 the counter: SET-PIECE SWING in A-flat major (lift, phrase 1, phrase 2)', bar(45), hit))

    # ---------------------------------------------------------------- A5: the held chord, THE TURN, the heat
    heat = B('6.09')
    tear = B('7.02')
    rebow(a, 'vc', 'Ab2', s(hit + 0.05), s(heat + 0.25), 0.2, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.7,
          art='sus', lp=1300)
    rebow(a, 'vla', 'C3', s(hit + 0.05), s(tear + 0.6), 0.17, seg=5.0, xf=1.0, first_att=0.5, last_rel=1.6,
          art='sus', lp=1500)                                                    # C: the common tone into the heat
    rebow(a, 'vln2', 'G4', s(hit + 0.05), s(145.3), 0.16, seg=5.0, xf=1.0, first_att=0.5, last_rel=1.2,
          art='sus', lp=3000)                                                    # G: the other common tone
    n('vln1', 'Eb5', hit + 0.05, heat - hit + 0.1, 0.16, art='sus', att=0.5, rel=0.4, lp=3200)
    n('vln1', 'Db5', heat, 145.3 - heat, 0.17, art='sus', att=0.55, rel=1.2, lp=3200)   # Eb -> Db: the darkening
    rebow(a, 'vc', 'F2', s(heat), s(tear + 0.6), 0.22, seg=5.0, xf=1.0, first_att=0.9, last_rel=1.6,
          art='sus', lp=1100)                                                    # Ab -> F: the bass turns
    ch('glasspad', ['G4', 'Db5'], heat + 0.4, 145.0 - heat - 0.4, 0.2, roll=0.0, rel=1.0)   # THE ACHE (ppp)
    ch('glasspad', ['G4', 'Db5'], tear + 0.05, 3.0, 0.14, roll=0.0, rel=0.9)         # once more on the tear
    mark(heat, 'THE TURN: Abmaj9 -> the Ache over F (vc Ab2 -> F2, vln Eb5 -> Db5; C and G held)')
    mark(tear, 'the tear: the pedal lets go, the Ache rings once more; out by 160.33', hit=False)
    sections.append(('A5 the held chord, then THE TURN: the Ache, the F pedal (the heat)', hit, A_OUT))

    T['felt'].pedal = pedal_track(felt_ped)
    T['rhodes'].pedal = [(-1.0, False)]
    meta = dict(
        id='a_launch', title='Launch Night (Ep1 v3 sample, A, temp)', mm='(temp)', usage='BI',
        family='P01 colours in A-flat major (the trio + the Build) -> P11 SET-PIECE SWING in major -> the Ache',
        tone='warm, giddy, late-night garage band; then exhilarating; then the first dark bar',
        scenes=['Ep1 v3 sample 2.5-160.33 s: Act One sc 5-7 (launch night, the odometer, the bill)'],
        motifs=["Gerg's Build in A-flat major (compile passes)", "Alyi's Door head on the felt (Ab Db | C G)",
                'the Build\'s tag "shipped" (Eb5 -> Ab5)', 'the Ache (G4 + Db5 over F)'],
        motif_ids=[], key='A-flat major / D-flat lydian; E and C (chromatic mediants) in the swing; F + the Ache',
        composer='Ep1 v3 sample temp score (the composer pass, 2026-09-27)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=s(A_IN), t1=s(A_OUT), sfx='server_hum (the bullpen, up through the floor)')],
        sfx_slots=[dict(t=round(s(snd('5.08', 'dialog_ok_click')), 3), sfx='dialog_ok_click: the launch button'),
                   dict(t=round(s(clunk), 3), sfx='letter_clunk: through the desk (the hero sound)'),
                   dict(t=round(s(snd('6.06', 'odometer_ratchet')), 3), sfx='odometer_ratchet: 1,000,000'),
                   dict(t=round(s(snd('6.09', 'palette_step_F')), 3), sfx='palette_step_F'),
                   dict(t=round(s(snd('6.09', 'palette_step_Ab')), 3), sfx='palette_step_Ab'),
                   dict(t=round(s(snd('6.09', 'palette_step_C')), 3), sfx='palette_step_C'),
                   dict(t=round(s(snd('7.02', 'steam_hiss')), 3), sfx='steam_hiss: the tear')],
        audition=['2.5-72 s: the trio and the Build under the talk: warm and awake, never busy; the chip a keyboard, '
                  'not a melody on the lines; any Nintendo feel is a fail',
                  '74.5-89.5 s: the felt alone and the Door in the gaps: tender, not the sad-piano cliche',
                  '111.98-134.9 s: the swing in major: exhilarating, not "upbeat corporate"; the E and C drops read '
                  'as falling through the building',
                  '129.27 s: the push and the chip tag into the million: a band shout, or a ta-da? (drop the tag if '
                  'it reads as a button)',
                  '138.6 s: the turn into the Ache: the first dark bar should land because everything before was warm'])
    mk = [(s(t), lab) for t, lab, hit_ in marks if hit_]
    # a fader ride: the counter's swing stands out of the launch-night bed (+0.75 dB; render 3's +1.5 put the cue's
    # short-term p95 at -16.2, over the underscore guide), and settles back after the hit
    macro = [(0.0, 0.0), (s(bar(45)) - 0.4, 0.0), (s(bar(45)) - 0.05, 0.75), (s(hit) + 0.4, 0.75), (s(hit) + 2.0, 0.0),
             (s(A_OUT) + 1.0, 0.0)]
    sc = Score('a_launch', g, T, a.notes, markers=mk, sections=[(lab, s(t0), s(t1)) for lab, t0, t1 in sections],
               macro=macro, length_s=s(A_OUT), tail_s=0.0, end_fade=(s(159.3), s(A_OUT - 0.03)), meta=meta)
    return sc, T0A, marks, sections


# ================================================================== B1 · NOON, LAS VEGAS (Act Four v5's S1, re-fitted)
T0B1 = 162.33
TAPE0 = None                                                    # set in cue_b1: the tape-stop's start


def cue_b1():
    global TAPE0
    noon = load_v5('s1-s4_s1_noon')
    C5 = sys.modules['s1_s4_common']
    plan_off = B('S1.03') - C5.BEATS['S1.03']['f0'] / FPS       # 164.82: S1.01-S1.05 keep v5's frames from here
    lev_off = B('S1.07') - C5.BEATS['S1.07']['f0'] / FPS        # 167.43: S1.07-S1.09 keep v5's frames from here
    vo = [l for l in LINES if is_vo(l) and B('S1.06') <= l['on'] < JOIN][0]    # "alyi set it up. probably..."
    TAPE0 = max(vo['end'] - 0.2, JOIN - 1.0)                     # the tape-stop: after his last word, zero on JOIN
    s = Clock(T0B1)
    vf = lambda t, off: (t - off) * FPS                          # noqa: E731  (sample s -> v5 frame on that clock)
    cueP = C5.Cue('b1_noon', noon.FELT_BAR, vf(JOIN, plan_off), pre=noon.FELT_BAR - vf(T0B1, plan_off))
    cueL = C5.Cue('b1_noon', vf(JOIN, lev_off), vf(CANCEL, lev_off), pre=vf(JOIN, lev_off) - vf(T0B1, lev_off))
    assert abs(cueP.s(noon.BP_CUT) - s(B('S1.03'))) < 1e-6 and abs(cueL.s(vf(JOIN, lev_off)) - s(JOIN)) < 1e-6
    saved = {k: getattr(noon, k) for k in ('TEAR', 'JOIN', 'CLICK')}
    try:
        noon.JOIN, noon.TEAR = vf(JOIN, plan_off), vf(TAPE0, plan_off)
        T = noon.tracks(cueP)                                   # v5's players; THE PLAN's tape-stop on the new frames
        noon.suite(cueP, T)
        noon.plan(cueP, T)                                      # the stuck loop now runs from 711 to the new JOIN
        noon.JOIN, noon.CLICK = vf(JOIN, lev_off), vf(CANCEL, lev_off)
        noon.leverage(cueL, T)
    finally:
        for k, v in saved.items():
            setattr(noon, k, v)
    notes = cueP.notes + cueL.notes
    # thin the stuck loop under his V.O.: the box alone (softer), the triangle root and the pizz root
    kept = []
    for nt in notes:
        tt = s.x(nt.start)
        if vo['on'] - 0.08 <= tt < vo['end'] and nt.inst in ('p_celesta', 'p_tri2', 'p_vla'):
            continue
        if vo['on'] - 0.08 <= tt < vo['end'] and nt.inst == 'p_lead':
            nt.vel *= 0.62
        kept.append(nt)
    notes = kept
    # the suite: a sparse F3/C4 sul-tasto pedal bows in under the room (162.83), gone as THE PLAN's pad enters
    T['sp_vc'] = replace(T['vc'], name='sp_vc')
    T['sp_vla'] = replace(T['vla'], name='sp_vla')
    ga = Arr(Grid(bpm=96, bars=40))
    rebow(ga, 'sp_vc', 'F3', s(B1_IN), s(171.9), 0.14, seg=5.0, xf=1.0, first_att=1.8, last_rel=1.2, art='sus', lp=1100)
    rebow(ga, 'sp_vla', 'C4', s(B1_IN + 0.35), s(171.9), 0.12, seg=5.0, xf=1.0, first_att=1.8, last_rel=1.2, art='sus',
          lp=1300)
    notes += ga.notes
    marks = [(B1_IN, 'the suite: the F3/C4 pedal bows in (air)', False)]
    for t_f, lab in cueP.markers + cueL.markers:
        marks.append((s.x(t_f), lab, True))
    marks.append((TAPE0, 'the tape-stop starts (after his last word)', False))
    marks.append((CANCEL, 'CANCEL = D6: every stem and tail to digital zero', False))
    end = s(CANCEL) + 0.6
    sections = [('B1 the suite: the pedal, the felt Water Line bar', B1_IN, B('S1.03')),
                ('B1 THE PLAN (v5: Blueprint, the waltz, the labels, the held chord, the path)', B('S1.03'),
                 s.x(cueP.s(711))),
                ('B1 BREAK: the stuck loop (thin under the V.O.), the tape-stop onto JOIN', s.x(cueP.s(711)), JOIN),
                ('B1 LEVERAGE (low), v5\'s take', JOIN, CANCEL), ('D6', CANCEL, CANCEL + 0.6)]
    meta = dict(
        id='b1_noon', title='Noon, Las Vegas (Ep1 v3 sample, B1: Act Four v5 S1 re-fitted)', mm='MM-07 + MM-08 (v5)',
        usage='BI', family='P01 -> P14 BLUEPRINT -> P03 LEVERAGE -> D6',
        tone='his calm felt, the board\'s cheerful plan that breaks, a trap closing, then nothing',
        scenes=['Ep1 v3 sample 162.83-208.98 s (v5 S1.01-S1.09)'],
        motifs=['the Water Line bar 1', 'the Blueprint', 'the knee-cell waltz', 'the break + tape-stop',
                "Neleh's clockwork", 'the 1-bit flat line', "Mada's spinner", 'Step Four'],
        motif_ids=['STEP_FOUR'], key='F minor -> F dorian, quartal -> F pedal with semitone clusters',
        composer='Act Four v5 S1 (re-fitted by the v3 sample composer pass)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        silence_windows=[(s(CANCEL) + 0.005, end - 0.01, 'D6: the Cancel click', -90.0)],
        sfx_slots=[dict(t=round(s(snd('S1.03', 'rubber_stamp_C')), 3), sfx='rubber_stamp_C'),
                   dict(t=round(s(snd('S1.05', 'paper_whip')), 3), sfx='paper_whip: the tear'),
                   dict(t=round(s(JOIN), 3), sfx='JOIN (the tape at zero)'),
                   dict(t=round(s(CANCEL), 3), sfx='dialog_ok_click: CANCEL (D6 on its frame)')],
        audition=['162.8-166.9 s: the pedal under the suite\'s room: air, not a drone effect',
                  f'{s(B("S1.06")):.1f}-{s(JOIN):.1f} s: the stuck loop under "alyi set it up. probably just the '
                  'budget.", then the tape-stop onto JOIN: the plan failing under his wrong read',
                  'LEVERAGE and the D6 click, as v5'])
    macro = [(0.0, 0.0), (s(JOIN) - 0.004, 0.0), (s(JOIN), -3.0), (end + 1.0, -3.0)]   # LEVERAGE low (v5)
    sc = Score('b1_noon', cueP.g, T, notes, markers=[(s(t), lab) for t, lab, h in marks if h],
               sections=[(lab, s(a0), s(a1)) for lab, a0, a1 in sections], mutes=[(s(CANCEL), s(CANCEL) + 2.5)],
               macro=macro, length_s=end, tail_s=0.0, meta=meta)
    return sc, T0B1, marks, sections


# ================================================================== B2 · THAT NIGHT (Act Four v5's S2, re-laid)
def cue_b2():
    s2 = load_v5('s1-s4_s2_third_mark')
    C5 = sys.modules['s1_s4_common']
    off = B('S2.01') - C5.BEATS['S2.01']['f0'] / FPS             # 169.82
    sc, cue = s2.build()
    T0 = cue.f0 / FPS + off                                      # the sample time of its file t = 0
    t_end = B2_OUT - T0
    sc.name = 'b2_night'
    sc.meta = dict(sc.meta, id='b2_night', title='That Night (Ep1 v3 sample, B2: Act Four v5 S2 re-laid)',
                   scenes=[f'Ep1 v3 sample {B2_IN:.2f}-{B2_OUT:.2f} s (v5 S2.01-S2.05)'])
    sc.mutes = []                                                # v5 cut the Rewind on the whip into pass one;
    sc.end_fade = (t_end - 0.32, t_end - 0.02)                   # here it rings out fast into the slate
    sc.length_s = t_end
    sc.tail_s = 0.0
    marks = [(f / FPS + off, lab, h) for f, lab, h in cue.log]
    marks.append((B2_OUT, 'the whip into the slate: a fast ring-out (v5 cut it on pass one\'s downbeat)', False))
    sections = [(lab, T0 + a0, T0 + a1) for lab, a0, a1 in sc.sections]
    return sc, T0, marks, sections


# ================================================================== C · 2 AM
T0C = snd('S5.03', 'key_tap_soft_01') - 7.5                     # grid bar 4 = the first heart (241.02)


def tracks_c():
    T = palette()
    T['felt'].gain_db = -1.0
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -14.0
    T['lead'].gain_db = -8.0
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db = -3.0
        T[k].sends = {'hall': -10, 'room': -16}
    T['rhodes'].gain_db = -2.0                                   # Tasya's Rhodes (MM-11 / v5's sends)
    T['rhodes'].sends = {'room': -12, 'plate': -12}
    return T


def cue_c():
    s = Clock(T0C)
    g = Grid(bpm=96, meter='4/4', bars=45, swing=1.0)
    a = Arr(g)
    T = tracks_c()
    bar = lambda b: T0C + 2.5 * (b - 1)                          # noqa: E731
    grid16 = lambda t: T0C + math.ceil((t - T0C) / S16 - 1e-6) * S16   # noqa: E731  (next sixteenth, sample s)
    marks, sections, felt_ped = [], [], []

    def n(inst, p, t, d, v, lock=False, **x):
        return a.n(inst, p, s(t), d, v, lock, **x)

    def ch(inst, ps, t, d, v, roll=0.012, **x):
        return a.ch(inst, ps, s(t), d, v, roll=roll, **x)

    def fch(ps, t, d, v, roll=0.014, span_end=None):
        felt_ped.append((s(t), s(span_end if span_end is not None else t + d)))
        ch('felt', ps, t, d, v, roll=roll)

    def mark(t, label, hit=True):
        marks.append((t, label, hit))

    def build16(t0, count, vel, stop_at=None):
        t0 = grid16(t0)
        ps = cell(0)
        k = 0
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.01:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.004)
            n('lead', ps[i % 16], t, d, vel * ACC4[i % 4], True, duty=0.5, att=0.002, dec=0.09, sus=0.45, rel=0.035)
            if i % 4 == 0:
                n('felt', ps[i % 16] - 12, t, 0.45, 0.16)        # chip plus felt: Mas is with him
            k += 1
        return t0, k

    # the arrival: a D-flat lydian chord in the dark, then the Water Line, warm
    home = B('S5.02')
    fch(['Db3', 'Ab3', 'Eb4'], home + 0.07, 3.0, 0.11, roll=0.03)
    n('felt_mech', 60, home + 0.07, 0.1, 0.3)
    a.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.', (2, 1), vel=0.15, swing=True)
    place_motif(a, 'lead', 'WATER_LINE', (2, 1), part='nudge_double', vel=0.1, swing=1.0, duty=0.5, att=0.004,
                dec=0.25, sus=0.35, rel=0.12)
    fch(['Db3', 'Ab3', 'C4'], bar(2), 2.4, 0.12)
    fch(['Db3', 'F3', 'Ab3'], bar(3), 2.4, 0.11)
    mark(home + 0.07, 'C: the felt alone in the dark (Db lydian)')
    mark(bar(2), 'the Water Line, warm (F F F G-sw F over Dbmaj9(#11) | C F over Bbm9)')
    sections.append(('C the dark room at 2 AM: the felt, the Water Line warm', C_IN, bar(4) - Q))

    # the count: the felt's left hand ticks quarters on the hearts' tempo, varied pitches (never one pitch, never a
    # lub-dub; it starts a beat before the first heart and ends after the last); Eb13sus -> back to Db
    count = [l for l in LINES if is_vo(l) and B('S5.03') <= l['on'] < B('S5.04')][0]
    tick0 = bar(4) - Q
    for k, p in enumerate(['Ab3', 'Eb3', 'Bb3', 'Db4', 'Eb3', 'Db3', 'Ab3', 'C4']):
        n('felt', p, tick0 + k * Q, Q * 0.9, 0.85 * (0.19, 0.17, 0.18, 0.16, 0.18, 0.17, 0.16, 0.15)[k])
    fch(['Db4', 'F4', 'Bb4'], bar(4), 2.4, 0.14)
    fch(['C4', 'Eb4', 'F4'], bar(5), 2.3, 0.14)
    mark(tick0, 'the count: the felt ticks with the hearts (quarters, varied pitches)')
    sections.append(('C the count (the felt\'s pulse under the V.O.)', bar(4) - Q, B('S5.04')))

    # the Orb's look: one held chord; the Water Line's C4 before "mostly." (the settle never comes)
    look_orb = B('S5.04') + 0.05
    fch(['C3', 'Ab3', 'Bb3', 'Eb4'], look_orb, 4.8, 0.17)
    mostly = Lon('a5-29-02')
    n('felt', 'C4', Lend('a5-29-01') + 0.35, mostly - Lend('a5-29-01') + 1.2, 0.19)
    mark(look_orb, 'the Orb\'s look: Ab(add9)/C held (thin under "the badge was a joke." / "mostly.")')
    sections.append(('C the Orb exchange: one held chord', B('S5.04'), B('S5.09')))

    # Gerg's call: A-flat maj9 on the ring; the Build enters warm after the V.O.
    ring = B('S5.09') + 0.1
    fch(['Eb3', 'G3', 'C4', 'Bb4'], ring, 2.4, 0.19)
    v09 = [l for l in LINES if is_vo(l) and B('S5.09') <= l['on'] < B('S5.09') + 3][0]
    mas_2am = LN['a5-29-04']
    passes = [(v09['end'] + 0.05, 4, 0.34, None), (bar(9) + Q, 8, 0.32, None),
              (bar(9) + Q + 8 * S16 + 0.01, 12, 0.3, mas_2am['on'] - 0.12),
              (mas_2am['end'] + 0.12, 8, 0.3, None), (bar(12), 12, 0.28, None), (bar(13) + Q * 1, 8, 0.27, None),
              (bar(14), 4, 0.26, None)]
    for t0, cnt, v, stop in passes:
        tt, k = build16(t0, cnt, v, stop)
        assert not in_vo(tt, tt + k * S16) and not mas_room(tt, tt + k * S16 - 0.1), (t0, cnt)
        mark(tt, f'the Build (chip + felt): compile pass ({k})')
    fch(CH['Dbmaj9#11'][0], bar(9), 2.4, 0.2)
    fch(['Ab3', 'C4', 'Db4', 'F4'], bar(10), 2.3, 0.19, span_end=mas_2am['end'] + 0.08)
    fch(['Eb3', 'Ab3', 'Db4', 'F4'], mas_2am['end'] + 0.08, 2.0, 0.19)
    fch(['Eb3', 'G3', 'C4'], bar(12), 2.4, 0.19)
    fch(CH['Dbmaj9#11'][0], bar(13), 2.4, 0.18)
    fch(['Ab3', 'C4', 'Db4', 'F4'], bar(14), 3.2, 0.17)
    mark(ring, 'Gerg rings: Abmaj9 (felt)')
    sections.append(('C Gerg\'s call: the Build in A-flat major (chip + felt)', B('S5.09'), B('S5.06')))

    # the letter: a Db3/Ab3 pedal only; it goes out on "Alyi signed it."
    signed = Lon('a5-29-12')
    rebow(a, 'vc', 'Db3', s(bar(14) + 0.4), s(signed + 0.1), 0.19, seg=5.0, xf=1.0, first_att=1.6, last_rel=0.9,
          art='sus', lp=1100)
    rebow(a, 'vla', 'Ab3', s(bar(14) + 0.6), s(signed + 0.1), 0.16, seg=5.0, xf=1.0, first_att=1.8, last_rel=0.9,
          art='sus', lp=1300)
    mark(bar(14) + 0.4, 'the letter: the Db3/Ab3 pedal only (the record plays dry)', hit=False)
    mark(signed, '"Alyi signed it.": the pedal lets go (out by 290.3)', hit=False)
    sections.append(('C the letter: the pedal only', B('S5.06'), C_REST[0]))

    # the check: the felt returns softly
    chk = snd('S5.08', 'SLOT') + 0.3
    fch(['Ab3', 'Bb3', 'Eb4'], chk, 4.3, 0.15)
    n('felt_mech', 60, chk, 0.1, 0.25)
    stamp = snd('S5.08', 'rubber_stamp_C')
    fch(['Eb3', 'Ab3', 'Db4', 'F4'], stamp + 0.26, 1.6, 0.15)
    mark(chk, 'the check: the felt returns softly (Ab(add9))')
    sections.append(('C the check: the felt returns', C_REST[1], B('S5.09-back')))

    # the Build returns warm; the V.O.; a pass cut dead by his look up
    back = B('S5.09-back')
    what = LN['a5-29-16']
    again = LN['a5-29-17']
    v10 = [l for l in LINES if is_vo(l) and back <= l['on'] < B('S5.09b')][0]
    look = B('S5.09b')
    tt, k = build16(back + 0.02, 4, 0.33, stop_at=what['on'] - 0.04)
    mark(tt, f'the Build returns (chip + felt): {k} notes, with his keys')
    fch(['Eb3', 'G3', 'C4'], what['end'] + 0.07, 2.2, 0.19)
    tt, k = build16(again['on'] - 0.01, 8, 0.33)
    mark(tt, f'the Build: {k} under "The company. Again. Just in case."')
    fch(CH['Dbmaj9#11'][0], v10['on'] - 0.5, 3.3, 0.19)
    rebow(a, 'vc', 'Ab3', s(v10['on'] - 0.6), s(B('S5.11') + 5.9), 0.13, seg=5.0, xf=1.0, first_att=1.5,
          last_rel=0.8, art='sus', lp=1300)                              # THE HELD NOTE (the pad), into the door
    rebow(a, 'vla', 'Eb4', s(v10['on'] - 0.5), s(B('S5.11') + 5.9), 0.12, seg=5.0, xf=1.0, first_att=1.5,
          last_rel=0.8, art='sus', lp=1500)
    tt, k = build16(v10['end'] + 0.08, 12, 0.34, stop_at=look)
    mark(tt, f'the Build: a 12-note pass, cut DEAD on his look up after {k}')
    mark(look, 'HIS LOOK UP: the Build stops dead; the pad (Ab3/Eb4) holds', hit=False)
    sections.append(('C the Build returns; the V.O.; the look (the held note)', back, B('S5.11')))

    # the door: TASYA'S FLOOR takes the chord (the pad's Ab3 / Eb4 are already hers); the Rhodes on the beats
    door = B('S5.11')
    welcome_end = Lend('a5-29-20')
    ev = LN['a5-29-21']
    desk = W('a5-29-22', 'desk')
    leave = LN['a5-29-23']
    f1, f2, f3 = welcome_end + 0.12, ev['end'] + 0.12, desk          # C, E, home
    FLOOR = [(door + 0.02, f1 + 0.7, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9'),
             (f1, f2 + 0.7, {'vc': 'C3', 'vla': 'E4', 'vln2': 'G4', 'vln1': 'B4'}, 'Cmaj9'),
             (f2, f3 + 0.7, {'vc': 'E3', 'vla': 'E4', 'vln2': 'Ab4', 'vln1': 'B4'}, 'Emaj9'),
             (f3, leave['end'] - 0.2, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9')]
    RH = {'Abmaj9': ['G3', 'Bb3', 'C4', 'Eb4'], 'Cmaj9': ['G3', 'B3', 'D4', 'E4'],
          'Emaj9': ['Ab3', 'B3', 'Eb4', 'Gb4']}
    for i, (t0, t1, voices, name) in enumerate(FLOOR):
        for inst, p in voices.items():
            if i == 0 and inst in ('vc', 'vla'):
                continue                                                 # already sounding: the pad is the floor
            last = i == len(FLOOR) - 1
            n(inst, p, t0, t1 - t0, 0.21 if inst in ('vc', 'vla') else 0.2, art='sus', att=0.9,
              rel=1.3 if last else 0.6, lp=2600)
        mark(t0, f"Tasya's floor: {name} (silent attack)", hit=False)
    t = bar(34) + Q                                                      # the Rhodes on the beats as she appears
    while t < leave['on'] - 1.0:
        chord = [c for (t0, t1, _, c) in FLOOR if t0 <= t][-1]
        if not mas_room(t, t + 0.3, pad=0.1) and not (desk - 0.7 < t < desk + 0.25):
            beat = round((t - T0C) / Q) % 4
            ch('rhodes', RH[chord], t, Q * 0.8, 0.3 if beat in (0, 2) else 0.25, roll=0.006)
        t += Q
    ch('rhodes', RH['Abmaj9'], desk, 2.2, 0.32, roll=0.008)              # home on "desk": one chord, then no more
    mark(door + 0.02, "the door: Tasya's floor takes the held chord", hit=False)
    mark(desk, 'home: Abmaj9 on "desk" (one Rhodes chord)')
    sections.append(("C the door: Tasya's floor (Ab -> C -> E -> Ab), the Rhodes on the beats", door, B('S5.12')))

    # "leave it open.": the felt takes the landlord's chord back WITHOUT ITS THIRD; the Water Line settles C4 -> F4
    tr = leave['end'] + 0.2
    fch(['Eb3', 'Ab3', 'Bb3'], tr, 3.6, 0.17, roll=0.02)
    n('felt', 'C4', tr, Q * 0.95, 0.17)
    n('felt', 'F4', tr + Q, 3.0, 0.19)
    n('felt_mech', 60, tr, 0.1, 0.25)
    mark(tr, 'after "leave it open.": Ab6/9 with no third (Eb3 Ab3 Bb3), the settle C4 -> F4; rings out')
    sections.append(('C "leave it open.": warm, open (no third), ring-out', B('S5.12'), C_OUT))

    T['felt'].pedal = pedal_track(felt_ped)
    T['rhodes'].pedal = [(-1.0, False)]
    meta = dict(
        id='c_two_am', title='2 AM (Ep1 v3 sample, C, temp)', mm='(temp)', usage='BI',
        family='P01 DARK ROOM, warm (D-flat lydian / A-flat major) + the Build + Tasya\'s floor',
        tone='warm, loyal, funny: his felt in the dark, Gerg\'s keyboard, the landlord\'s chord, a door left open',
        scenes=['Ep1 v3 sample 235.33-332.88 s: Act Four S5 (2 AM with Gerg)'],
        motifs=['the Water Line, warm (felt; the chip on the nudge)', "Gerg's Build in A-flat major (chip + felt)",
                "Tasya's floor (Ab -> C -> E -> Ab; the Rhodes)"],
        motif_ids=[], key='D-flat lydian, A-flat major; the floor\'s mediants; Ab6/9 with no third',
        composer='Ep1 v3 sample temp score (the composer pass, 2026-09-27)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=s(C_IN), t1=s(C_OUT), sfx='room_drone (the dark room)')],
        silence_windows=[(s(C_REST[0]) + 0.05, s(C_REST[1]) - 0.05, 'no score: "alyi voted." / "He did both."', -70.0)],
        sfx_slots=[dict(t=round(s(snd('S5.03', f'key_tap_soft_0{k}')), 3), sfx=f'heart {k}') for k in range(1, 6)]
        + [dict(t=round(s(snd('S5.09', 'RING')), 3), sfx='RING'),
           dict(t=round(s(snd('S5.06', 'bell_ding_F6')), 3), sfx="the Orb's chime (F6)"),
           dict(t=round(s(stamp), 3), sfx='rubber_stamp_C: VOID IF CEO MISSING')],
        audition=['235.3-245.7 s: the Water Line warm and the felt\'s count: tender, never the sad-piano cliche; the '
                  'count a pulse, not a note per heart',
                  '251-267 s: the Build warm under Gerg: his keyboard, not a melody on his lines',
                  '289-296.3 s: out on "Alyi signed it.", then 6 s of room: designed, not a hole?',
                  '309.41 s: the Build cut dead on his look, the pad holding: a ring-out, not a glitch',
                  '316-327 s: Tasya\'s floor under her offer: warm, faintly ironic; the landlord owns the chord',
                  '329.2-332.9 s: the felt\'s Ab6/9 with no third: warm but open, not a final cadence'])
    mk = [(s(t), lab) for t, lab, h in marks if h]
    sc = Score('c_two_am', g, T, a.notes, markers=mk, sections=[(lab, s(t0), s(t1)) for lab, t0, t1 in sections],
               mutes=[(s(C_REST[0]), s(C_REST[1]))], length_s=s(C_OUT), tail_s=0.0,
               end_fade=(s(C_OUT - 1.0), s(C_OUT - 0.02)), meta=meta)
    return sc, T0C, marks, sections


CUES = {'a': cue_a, 'b1': cue_b1, 'b2': cue_b2, 'c': cue_c}
RANGES = {'a': (A_IN, A_OUT), 'b1': (B1_IN, CANCEL), 'b2': (B2_IN, B2_OUT), 'c': (C_IN, C_OUT)}


# ================================================================== render, lay, measure
def dry():
    from engine import analysis as an
    out = {}
    for k, fn in CUES.items():
        sc, T0, marks, sections = fn()
        wt = an.written_third(sc.notes, sc.tracks)
        kc = an.knee_completion(sc.notes)
        first = min(nt.start for nt in sc.notes) + T0
        last = max(nt.start + nt.dur for nt in sc.notes) + T0
        out[k] = dict(notes=len(sc.notes), tracks=len({nt.inst for nt in sc.notes}), file_t0=round(T0, 3),
                      first_note=round(first, 3), last_note_end=round(last, 3),
                      written_third=dict(ok=wt['ok'], count=wt['count'], grazes=wt['n_grazes']),
                      knee_completion=kc['count'])
        print(k, json.dumps(out[k], default=str)[:600], flush=True)
    print('clock notes:', check_clock())
    return out


def render(which):
    from engine.export import build as ebuild
    os.makedirs(WORK, exist_ok=True)
    for k in which:
        t0 = time.time()
        sc, T0, marks, sections = CUES[k]()
        ebuild(sc, WORK, sc.name, stems=False, loop=False, previews=False,
               workers=int(os.environ.get('OST_WORKERS', '2')))
        json.dump(dict(T0=T0, marks=marks, sections=sections), open(os.path.join(WORK, f'{sc.name}.lay.json'), 'w'),
                  indent=1)
        print(f'[{k}] {sc.name}: rendered in {time.time() - t0:.0f} s', flush=True)


NAMES = {'a': 'a_launch', 'b1': 'b1_noon', 'b2': 'b2_night', 'c': 'c_two_am'}


def _fade(n, kind):
    u = np.linspace(0.0, 1.0, n, dtype=np.float64)
    return np.sin(0.5 * np.pi * u) if kind == 'in' else np.cos(0.5 * np.pi * u)


def assemble():
    import soundfile as sf
    from engine import analysis as an
    from engine.mix import lufs, true_peak
    N = int(round(LENGTH * SR))
    mix = np.zeros((2, N), dtype=np.float64)
    lay = {}
    for k, name in NAMES.items():
        wav = os.path.join(WORK, f'{name}-underscore.wav')
        info = json.load(open(os.path.join(WORK, f'{name}.lay.json')))
        x, sr = sf.read(wav, always_2d=True, dtype='float64')
        assert sr == SR
        x = x.T
        i0 = int(round(info['T0'] * SR))
        a0, a1 = RANGES[k]
        j0, j1 = int(round(a0 * SR)), int(round(a1 * SR))
        seg = np.zeros((2, N))
        lo, hi = max(0, i0), min(N, i0 + x.shape[1])
        seg[:, lo:hi] = x[:, lo - i0:hi - i0]
        gate = np.zeros(N)
        gate[j0:j1] = 1.0
        if k != 'b1':                                  # a guard fade at the section's out (B1 ends on D6: a dead stop)
            m = int(0.25 * SR)
            gate[j1 - m:j1] *= _fade(m, 'out')
        else:
            m = int(0.003 * SR)
            gate[j1 - m:j1] *= _fade(m, 'out')
        if k == 'c':                                   # the rest: rings out by 290.3, nothing until the check
            r0, r1 = int(round(C_REST[0] * SR)), int(round(C_REST[1] * SR))
            m = int(0.3 * SR)
            gate[r0 - m:r0] *= _fade(m, 'out')
            gate[r0:r1] = 0.0
        mix += seg * gate[None]
        lay[k] = dict(file=os.path.relpath(wav, REPO), laid_at_s=round(info['T0'], 4), window=[a0, a1],
                      marks=info['marks'], sections=info['sections'])
    y = mix.T.astype(np.float32)
    sf.write(OUT_WAV, y, SR, subtype='PCM_24')
    # ---------------------------------------------------------------- measure
    x = mix
    meas = {}

    def seg_stats(t0, t1):
        i0, i1 = int(t0 * SR), int(t1 * SR)
        z = x[:, i0:i1]
        if np.abs(z).max() < 1e-9:
            return dict(lufs_i=None, peak_dbfs=None)
        st = an.short_term_stats(z) if z.shape[1] > int(3.5 * SR) else dict(max=None, p95=None)
        return dict(lufs_i=round(lufs(z), 2) if z.shape[1] > int(0.5 * SR) else None, st_max=st['max'], st_p95=st['p95'],
                    true_peak_dbtp=round(20 * math.log10(true_peak(z) + 1e-12), 2))

    for k, (a0, a1) in RANGES.items():
        meas[k] = seg_stats(a0, a1)
    meas['whole'] = dict(lufs_i=round(lufs(x), 2), true_peak_dbtp=round(20 * math.log10(true_peak(x) + 1e-12), 2),
                         length_s=round(x.shape[1] / SR, 4), samples=int(x.shape[1]))
    sil = []
    for t0, t1, lab in SILENT:
        z = x[:, int(t0 * SR) + 1:int(t1 * SR) - 1]
        pk = float(np.abs(z).max()) if z.size else 0.0
        sil.append(dict(t0=t0, t1=t1, what=lab, peak_dbfs=(None if pk == 0 else round(20 * math.log10(pk), 1)),
                        digital_zero=bool(pk == 0.0)))
    # holes: 50 ms windows, the louder channel under -60 dBFS for 0.3 s or more, inside a scored window
    hop = int(0.05 * SR)
    env = np.abs(x).max(0)[: (N // hop) * hop].reshape(-1, hop).max(1)
    quiet = env < 10 ** (-60 / 20)
    holes, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            t0, t1 = i * hop / SR, j * hop / SR
            if t1 - t0 >= 0.3:
                designed = any(a0 - 1.5 <= t0 and t1 <= a1 + 0.35 for a0, a1, _ in SILENT)   # (a ring-out may
                # end up to 1.5 s before a marked silence; the music must be back within 0.35 s of its end)
                holes.append(dict(t0=round(t0, 2), t1=round(t1, 2), designed=designed))
            i = j
        else:
            i += 1
    # every sub-section's level (the cue sheet's rows)
    rows = []
    for k in ('a', 'b1', 'b2', 'c'):
        for lab, s0, s1 in lay[k]['sections']:
            s0, s1 = max(s0, RANGES[k][0]), min(s1, RANGES[k][1])
            if s1 - s0 < 0.5:
                continue
            st = seg_stats(s0, s1)
            rows.append(dict(cue=NAMES[k], section=lab, start=round(s0, 2), end=round(s1, 2), **st))
    return dict(lay=lay, measured=meas, silences=sil, holes=holes, rows=rows)


def write_cuesheet(res):
    ents = []
    what = {
        'a': 'A LAUNCH NIGHT: warm A-flat major trio (Rhodes, felt, brushes, upright) + Gerg\'s Build in major; the '
             'click held; the felt alone with Alyi\'s Door; the chatbot; SET-PIECE SWING in major (A-flat -> E -> C '
             '-> A-flat) for the counter; the turn into the Ache and the F pedal for the heat',
        'b1': 'B NOON, LAS VEGAS: Act Four v5 S1 re-fitted (suite pedal, the felt bar, THE PLAN, the stuck loop, the '
              'tape-stop on JOIN, LEVERAGE low, D6 on Cancel)',
        'b2': 'B THAT NIGHT: Act Four v5 S2 (MM-08 26A felt, the F/C pedal, the settle, the Rewind), fast ring-out',
        'c': 'C 2 AM: the felt and the Water Line warm, the count, the Build warm with Gerg, the letter\'s pedal, '
             'the rest, the Build cut by his look, Tasya\'s floor, Ab6/9 with no third',
    }
    for k in ('a', 'b1', 'b2', 'c'):
        a0, a1 = RANGES[k]
        m = res['measured'][k]
        ents.append(dict(section=what[k].split(':')[0], cue=NAMES[k], start=a0, end=a1, what=what[k],
                         level=dict(target_lufs_i=(-22.0 if k == 'b2' else -20.0), **m),
                         render=res['lay'][k]['file'], laid_at_s=res['lay'][k]['laid_at_s'],
                         sync=[dict(t=round(t, 3), what=lab, onset_hit=h) for t, lab, h in res['lay'][k]['marks']]))
    doc = dict(
        schema='mrmas-reel-music/1', id='ep01-v3-sample-music', file='audio/reel/ep01-v3-sample/music/music.wav',
        length_s=LENGTH, sample_rate=SR, channels=2, clock='the sample\'s clock: 0 = its first frame (the lead\'s '
        'mix.py beat starts, frame-rounded)', level='underscore, dry of dialogue; the mixer ducks it',
        silences=res['silences'], cues=ents, rows=res['rows'], holes=res['holes'], whole=res['measured']['whole'],
        clock_notes=check_clock(), source='audio/reel/ep01-v3-sample/music/track.py',
        heard='nothing here has been listened to; every number is measured')
    json.dump(doc, open(CUES_JSON, 'w'), indent=1, ensure_ascii=False)
    print(json.dumps(dict(measured=res['measured'], silences=res['silences'], holes=res['holes']), indent=1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--render', nargs='*')
    ap.add_argument('--assemble', action='store_true')
    args = ap.parse_args()
    if args.dry:
        dry()
        return
    if args.render is not None:
        render(args.render or list(CUES))
        args.assemble = True
    if args.assemble:
        write_cuesheet(assemble())


if __name__ == '__main__':
    main()
