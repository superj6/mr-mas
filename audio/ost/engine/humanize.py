"""Humanizer: timing, velocity, length and ensemble drift -- deterministic per note.

Every random draw is seeded from the note itself (track, nominal start, pitch), never from a running
generator, so:
  * the same bars render identically in the full cue and in the loop file;
  * editing one bar does not re-roll the humanisation of every later bar.

Two layers:
  1. Track-level (automatic, in render): Track(hum_ms=, offset_ms=, vel_jit=, drift_ms=) -- a player's
     looseness.  Notes with lock=True (sync hits) are never moved.
  2. Composition-level (you call it on Arr notes): Humanizer(...).apply(notes), groove(...), accent(...)
     -- feel templates that know the grid (laid-back 2 & 4, pushed, MPC 16th swing, ride feel).

    from engine.humanize import Humanizer, groove, accent
    a.notes = groove(a.notes, g, 'laidback', insts=['felt', 'ubass'])
    a.notes = accent(a.notes, g, {1: 1.08, 2: 0.94, 3: 1.03, 4: 0.94}, insts=['felt'])
"""
from __future__ import annotations

import math

import numpy as np

from .core import Note, stable_seed


def _rng(*key):
    return np.random.default_rng(stable_seed(*key))


def note_key(tr_name: str, n: Note, k: int = 0):
    """Seed identity of a note.  x['_seedkey'] (set by render.expand_loops(vary=False)) lets a repeated
    note reuse the draws of the note it copies."""
    return (tr_name, round(n.x.get('_seedkey', n.start) * 48000), round(n.pitch * 100), n.x.get('art'), k)


def keyed(notes):
    """[(k, note)] where k counts identical (start, pitch, art) notes, so doublings get distinct draws."""
    seen = {}
    out = []
    for n in notes:
        key = (round(n.start * 48000), round(n.pitch * 100), n.x.get('art'))    # true doublings only
        k = seen.get(key, 0)
        seen[key] = k + 1
        out.append((k, n))
    return out


def drift_fn(drift_ms: float, period_s: float, seed):
    """Smooth, deterministic timing drift (ms) as a function of absolute time."""
    if not drift_ms:
        return lambda t: 0.0
    r = _rng('drift', seed)
    comps = [(period_s * r.uniform(0.6, 1.6), r.uniform(0, 2 * math.pi), r.uniform(0.5, 1.0)) for _ in range(3)]
    norm = sum(c[2] for c in comps)

    def f(t):
        return drift_ms * sum(a * math.sin(2 * math.pi * t / T + ph) for T, ph, a in comps) / norm
    return f


class Humanizer:
    """timing_ms: gaussian sigma of onset jitter (clipped at 2.5 sigma); push_ms: constant lean
    (negative = ahead of the beat); vel: relative velocity jitter; drift_ms/drift_s: slow shared drift;
    len_jit: relative duration jitter; seed: any hashable."""

    def __init__(self, timing_ms=6.0, push_ms=0.0, vel=0.04, drift_ms=0.0, drift_s=6.0, len_jit=0.0, seed='h'):
        self.timing_ms, self.push_ms, self.vel = timing_ms, push_ms, vel
        self.drift = drift_fn(drift_ms, drift_s, seed)
        self.len_jit = len_jit
        self.seed = seed

    def offsets(self, name, n: Note, k=0):
        """(dt_seconds, vel_mul, dur_mul) for one note."""
        r = _rng(self.seed, *note_key(name, n, k))
        dt = r.normal(self.push_ms, self.timing_ms) if self.timing_ms else self.push_ms
        if self.timing_ms:
            dt = float(np.clip(dt, self.push_ms - 2.5 * self.timing_ms, self.push_ms + 2.5 * self.timing_ms))
        dt += self.drift(n.start)
        vm = float(1 + r.normal(0, self.vel)) if self.vel else 1.0
        dm = float(1 + r.normal(0, self.len_jit)) if self.len_jit else 1.0
        return dt / 1000.0, vm, max(0.3, dm)

    def apply(self, notes, name='arr'):
        out = []
        for k, n in keyed(notes):
            if n.lock:
                out.append(n.copy())
                continue
            dt, vm, dm = self.offsets(name, n, k)
            out.append(n.copy(start=max(0.0, n.start + dt), vel=float(np.clip(n.vel * vm, 0.02, 1.0)),
                              dur=n.dur * dm))
        return out


def apply_track(tr, notes, min_start=None):
    """Render-time humanisation for one Track (see render.Track fields)."""
    h = Humanizer(timing_ms=tr.hum_ms, push_ms=tr.offset_ms, vel=tr.vel_jit, drift_ms=getattr(tr, 'drift_ms', 0.0),
                  seed=('track', tr.seed))
    out = []
    for k, n in keyed(notes):
        m = n.copy()
        if not n.lock:
            dt, vm, _ = h.offsets(tr.name, n, k)
            m.start = n.start + dt
            m.vel = float(np.clip(n.vel * vm, 0.02, 1.0))
        m.x['_nominal'] = n.start
        m.x['_seed'] = stable_seed(*note_key(tr.name, n, k), tr.seed)
        out.append(m)
    return out


# ------------------------------------------------------------------ feel templates (grid aware)
def _sel(notes, insts):
    return [(n.inst in insts) if insts else True for n in notes]


def _beat_pos(g, t):
    bar, beat = g.pos(t)
    return bar, beat


GROOVES = {
    # name: function(bar, beat, frac_in_beat) -> ms offset
    'laidback': lambda bar, beat, fr: (10.0 if int(beat) in (2, 4) and fr < 0.1 else 0.0) + (6.0 if 0.4 < fr < 0.8 else 0.0),
    'push': lambda bar, beat, fr: -6.0 - (3.0 if int(beat) == 1 and fr < 0.1 else 0.0),
    'drag': lambda bar, beat, fr: 3.0 * (beat - 1),
    'ride': lambda bar, beat, fr: (-7.0 if 0.55 < fr < 0.8 else 0.0),          # the 'and' a hair early
    'backbeat': lambda bar, beat, fr: (8.0 if int(beat) in (2, 4) and fr < 0.1 else 0.0),
}


def groove(notes, g, template='laidback', insts=None, amount=1.0, mpc_swing=None):
    """Shift unlocked notes by a feel template (ms by metric position).  mpc_swing=56 moves every
    off-16th later so the pair is 56:44 (for straight-16th programming, e.g. trap hats)."""
    out = []
    for n, s in zip(notes, _sel(notes, insts)):
        if not s or n.lock:
            out.append(n)
            continue
        bar, beat = g.pos(n.start)
        fr = beat - math.floor(beat)
        ms = 0.0
        if template:
            ms += GROOVES[template](bar, beat, fr) * amount
        if mpc_swing:
            q = g.qt(n.start)
            six = q / 0.25
            if abs(six - round(six)) < 0.1 and int(round(six)) % 2 == 1:
                pair = 2 * 0.25 * 60.0 / g.bpm_at(n.start)       # seconds of an eighth
                ms += (mpc_swing / 100.0 - 0.5) * pair * 1000.0
        out.append(n.copy(start=max(0.0, n.start + ms / 1000.0)))
    return out


def accent(notes, g, weights: dict, insts=None, offbeat=None):
    """Velocity weights by beat number (e.g. {1: 1.08, 2: 0.94, 3: 1.03, 4: 0.94}); offbeat multiplies
    notes that fall between beats."""
    out = []
    for n, s in zip(notes, _sel(notes, insts)):
        if not s:
            out.append(n)
            continue
        bar, beat = g.pos(n.start)
        fr = beat - math.floor(beat)
        w = weights.get(int(math.floor(beat + 1e-6)), 1.0) if fr < 0.1 or fr > 0.9 else (offbeat or 1.0)
        out.append(n.copy(vel=float(np.clip(n.vel * w, 0.02, 1.0))))
    return out
