"""Ep2 v1 COPY (audio/ost/tracks/e02-v1-common/, shared by tracks/e02-v1-<seg>/): Ep1's file of the same name (tracks/e01-v3-*/, locked), pointed at Ep2's locks: show/reel/ep02-v1/ep02-v1-<seg>.json (Kokoro) and show/reel/ep02-v1-el/ep02-v1-el-<seg>.json (--el, the master). Ep1's notes follow.

Small composing helpers shared by the Ep1 v3 segment scores (tracks/e01-v3-act3, tracks/e01-v3-act4).

    Cue(name, T0, bars)      a cue whose file t = 0 is segment time T0, with a 96 BPM grid whose bar 1 starts there;
                             cue.s(t) segment -> file seconds, cue.x(tf) file -> segment, cue.bar(b), cue.bt(b, beat),
                             cue.sw(b, beat) (the swung position), cue.n / cue.ch in SEGMENT seconds
    rebow(...)               a long pedal as overlapping bows with silent crossfades (v5's, unchanged)
    remap(...)               move a source score's notes (a window of its own time) onto a cue's clock (v4/v5's)
    pedal_track(spans)       a sustain-pedal track from [(down, up)] spans
    BUILD_AB / build_cell    Gerg's Build moved into A-flat major (the v3 sample's warm colour)

Nothing here was listened to.
"""
from __future__ import annotations

import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..'))
if OST not in sys.path:
    sys.path.insert(0, OST)
from engine import *   # noqa: E402,F401,F403
from engine.core import nm   # noqa: E402

Q = 0.625            # a beat at 96 BPM
S16 = Q / 4
BAR = 2.5


class Cue:
    def __init__(self, name, T0, bars, swing=1.0):
        self.name, self.T0 = name, T0
        self.g = Grid(bpm=96, meter='4/4', bars=bars, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.marks = []                      # (segment s, label, onset_check)
        self.sections = []                   # (label, segment s0, s1)
        self.mutes = []                      # (segment s0, s1)

    # clocks
    def s(self, t):
        return t - self.T0

    def x(self, tf):
        return tf + self.T0

    def bar(self, b):
        return self.T0 + BAR * (b - 1)

    def bt(self, b, beat=1.0):
        return self.bar(b) + (beat - 1.0) * Q

    def sw(self, b, beat):
        return self.x(self.g.s(b, beat))

    def bar_of(self, t):
        """the bar whose span holds segment time t"""
        return int(math.floor((t - self.T0) / BAR + 1e-9)) + 1

    def next_bar(self, t, tol=0.02):
        """the first bar line at or after t"""
        return int(math.ceil((t - self.T0) / BAR - tol / BAR)) + 1

    # writing, in segment seconds
    def n(self, inst, p, t, d, v, lock=False, **x):
        return self.a.n(inst, p, self.s(t), d, v, lock, **x)

    def ch(self, inst, ps, t, d, v, roll=0.012, lock=False, **x):
        return self.a.ch(inst, ps, self.s(t), d, v, roll=roll, lock=lock, **x)

    def line(self, inst, text, b, beat=1.0, **x):
        return self.a.line(inst, text, (b, beat), **x)

    def mark(self, t, label, hit=True):
        self.marks.append((t, label, hit))

    def section(self, label, t0, t1):
        self.sections.append((label, t0, t1))

    def mute(self, t0, t1):
        self.mutes.append((t0, t1))

    def score_args(self):
        return dict(markers=[(self.s(t), lab) for t, lab, h in self.marks if h],
                    sections=[(lab, self.s(a), self.s(b)) for lab, a, b in self.sections],
                    mutes=[(self.s(a), self.s(b)) for a, b in self.mutes])


def rebow(a, inst, pitches, t0, t1, vel, seg=5.0, xf=1.0, first_att=None, last_rel=0.8, later_offset=0.8, **x):
    """A pedal held from t0 to t1 (FILE seconds on a's grid) as overlapping bows of about `seg` seconds, each
    crossfaded over `xf` seconds (silent attacks); every stroke after the first starts `later_offset` seconds into its
    sample, so the crossfade joins sustain to sustain.  (tracks/e01-act4-v5/s5-s8_common.py, unchanged)"""
    if isinstance(pitches, (str, int, float)):
        pitches = [pitches]
    out = []
    total = t1 - t0
    n = max(1, int(round(total / seg)))
    step = total / n
    for i in range(n):
        start = t0 + i * step - (xf * 0.5 if i else 0.0)
        end = t0 + (i + 1) * step + (xf * 0.5 if i < n - 1 else 0.0)
        dur = end - start
        fi = xf if i else (first_att or 0.0)
        fo = xf if i < n - 1 else 0.0
        env = []
        if fi > 0:
            env += [(fi * u, math.sin(0.5 * math.pi * u)) for u in (0.0, 0.25, 0.5, 0.75)]
        env.append((fi, 1.0))
        if fo > 0:
            env += [(dur - fo * (1 - u), math.cos(0.5 * math.pi * u)) for u in (0.0, 0.25, 0.5, 0.75, 1.0)]
            env.append((dur + 5.0, 0.0))
        else:
            env.append((dur + 5.0, 1.0))
        xx = dict(x)
        if i and later_offset > 0:
            xx['offset'] = later_offset
        for p in pitches:
            out.append(a.n(inst, p, start, dur, vel, lock=True, env=env, rel=(0.05 if fo else last_rel), **xx))
    return out


def remap(notes, s0, s1, d0, k=1.0, truncate=True, keep=None, drop=None, vel=1.0, extra_tail=0.0):
    """Source notes whose start is in [s0, s1) (source seconds) -> starting at d0 (cue seconds), time-scaled by k.
    (tracks/e01-act4-v4/common.py, unchanged)"""
    out = []
    d1 = d0 + (s1 - s0) * k + extra_tail
    for n in notes:
        if not (s0 - 1e-6 <= n.start < s1 - 1e-6):
            continue
        if keep is not None and n.inst not in keep:
            continue
        if drop is not None and n.inst in drop:
            continue
        m = n.copy()
        m.x = {kk: (list(v) if isinstance(v, list) else v) for kk, v in n.x.items()}
        m.start = d0 + (n.start - s0) * k
        m.dur = n.dur * k
        if truncate:
            m.dur = max(0.02, min(m.dur, d1 - m.start))
        for key in ('env', 'bend'):
            if m.x.get(key):
                m.x[key] = [(p[0] * k,) + tuple(p[1:]) for p in m.x[key]]
        m.vel = min(1.0, m.vel * vel)
        out.append(m)
    return out


def pedal_track(spans):
    """sustain pedal from [(down, up)] spans (file s): down with each chord, up at its end, re-caught where the next
    chord comes first; notes outside every span play dry.  (the v3 sample's)"""
    spans = sorted(spans)
    out = [(-1.0, False)]
    for i, (t0, t1) in enumerate(spans):
        if i + 1 < len(spans):
            t1 = min(t1, spans[i + 1][0] - 0.03)
        out += [(t0 - 0.03, False), (t0 - 0.005, True), (max(t0 + 0.01, t1), False)]
    return out


# Gerg's Build (OST-BIBLE s2.6) moved into A-flat major, as the v3 sample has it: the same contour, degrees
# 1 1 2 3 5 3 2 1 | 1 1 2 3 5 7 5 3
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
ACC4 = (1.0, 0.72, 0.84, 0.72)


def build_cell(shift=0):
    return [nm(p) + shift for p in BUILD_AB]


def build16(cue, t0, count, vel, stop_at=None, felt_every=4, shift=0, duty=0.5, inst='lead', felt_vel=0.16,
            felt_inst='felt'):
    """a compile pass of `count` straight 16ths from t0 (segment s, snapped up to the grid's next sixteenth); the felt
    doubles every `felt_every`-th note an octave down (Mas is with him; 0 = never).  Stops before stop_at."""
    k0 = math.ceil((t0 - cue.T0) / S16 - 1e-6)
    t0 = cue.T0 + k0 * S16
    ps = build_cell(shift)
    placed = []
    for i in range(count):
        t = t0 + i * S16
        if stop_at is not None and t >= stop_at - 0.01:
            break
        d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.004)
        placed.append(cue.n(inst, ps[i % 16], t, d, vel * ACC4[i % 4], True, duty=duty, att=0.002, dec=0.09,
                            sus=0.45, rel=0.035))
        if felt_every and i % felt_every == 0:
            cue.n(felt_inst, ps[i % 16] - 12, t, 0.45, felt_vel)
    return t0, len(placed)
