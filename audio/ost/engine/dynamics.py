"""Dynamic curves: markings, hairpins, phrase arcs -> note velocities, gain automation and sample envelopes.

    from engine.dynamics import Curve, marks, hairpin, apply_vel, gain_points, swell_env, DYN

    c = marks(g, [((1, 1), 'pp'), ((5, 1), 'mf', 'cresc'), ((7, 1), 'f'), ((8, 3), 'p', 'dim')])
        # a value per marking; 'cresc'/'dim' (or any shape name) = ramp INTO that mark from the previous one
    a.notes = apply_vel(a.notes, c, insts=['vln1', 'vln2', 'vla'])      # velocities follow the curve
    tr.auto = gain_points(c, g.t(1), g.t(9), db_range=18)               # or ride the fader instead
    a.n('vln1', 'F4', t, 4.0, 0.6, env=swell_env(4.0, 0.25, 1.0, 's'))  # a per-note swell (sample env)

Shapes: 'lin', 'exp' (slow start), 'log' (fast start), 's' (smooth S), 'step' (jump at the end), 'hold'.
Values are 0..1 on the velocity scale (DYN maps ppp..fff).
"""
from __future__ import annotations

import math

import numpy as np

from .core import db

DYN = {'pppp': 0.08, 'ppp': 0.15, 'pp': 0.25, 'p': 0.38, 'mp': 0.50, 'mf': 0.62, 'f': 0.75, 'ff': 0.88,
       'fff': 0.97}


def _v(x):
    return DYN[x] if isinstance(x, str) else float(x)


def shape_fn(name):
    if name in (None, 'lin', 'cresc', 'dim', 'ramp'):
        return lambda u: u
    if name == 'exp':
        return lambda u: u * u
    if name == 'exp3':
        return lambda u: u ** 3
    if name == 'log':
        return lambda u: 1 - (1 - u) ** 2
    if name == 's':
        return lambda u: u * u * (3 - 2 * u)
    if name == 'step':
        return lambda u: 1.0 if u >= 1 else 0.0
    if name == 'hold':
        return lambda u: 0.0
    raise KeyError(name)


class Curve:
    """Piecewise curve through (t_seconds, value[, shape_into_this_point]) points.
    Before the first point: first value; after the last: last value."""

    def __init__(self, points):
        pts = []
        for p in points:
            pts.append((float(p[0]), _v(p[1]), p[2] if len(p) > 2 else 'lin'))
        pts.sort(key=lambda e: e[0])
        self.pts = pts

    def __call__(self, t):
        if np.ndim(t):
            return np.array([self(float(x)) for x in t])
        p = self.pts
        if t <= p[0][0]:
            return p[0][1]
        for i in range(1, len(p)):
            if t < p[i][0]:
                t0, v0, _ = p[i - 1]
                t1, v1, sh = p[i]
                u = (t - t0) / max(t1 - t0, 1e-9)
                if sh in ('hold', 'step') and u < 1:
                    return v0
                return v0 + (v1 - v0) * shape_fn(sh)(u)
        return p[-1][1]

    def scaled(self, k):
        return Curve([(t, v * k, s) for t, v, s in self.pts])

    def shifted(self, dt):
        return Curve([(t + dt, v, s) for t, v, s in self.pts])

    def __mul__(self, other):
        ts = sorted({t for t, _, _ in self.pts} | {t for t, _, _ in other.pts})
        dense = np.unique(np.concatenate([np.linspace(a, b, 16) for a, b in zip(ts[:-1], ts[1:])])) if len(ts) > 1 else ts
        return Curve([(t, self(t) * other(t)) for t in dense])


def marks(g, items, default_shape='hold'):
    """items: [(pos, marking_or_value[, shape])] with pos = (bar, beat) / bar int / seconds.
    A mark with a shape ramps INTO it from the previous mark; without one the previous level holds
    until the mark and then jumps (subito)."""
    pts = []
    for it in items:
        pos, val = it[0], it[1]
        t = g.t(pos) if isinstance(pos, int) else g.at(pos)
        sh = it[2] if len(it) > 2 else default_shape
        pts.append((t, _v(val), sh))
    return Curve(pts)


def hairpin(t0, t1, v0, v1, shape='lin'):
    return Curve([(t0, _v(v0)), (t1, _v(v1), shape)])


def phrase_arc(t0, t1, low=0.45, peak=0.7, peak_at=0.62, shape='s'):
    """A sung phrase: rise to `peak` at `peak_at` of the way through, relax back to `low`."""
    tp = t0 + (t1 - t0) * peak_at
    return Curve([(t0, low), (tp, peak, shape), (t1, low, shape)])


def apply_vel(notes, curve, insts=None, mode='mul', ref=0.62, lock_too=True):
    """mode 'set': velocity = curve(t); 'mul': velocity *= curve(t) / ref (keeps the written accents)."""
    out = []
    for n in notes:
        if insts and n.inst not in insts or (n.lock and not lock_too):
            out.append(n)
            continue
        c = curve(n.start)
        v = c if mode == 'set' else n.vel * c / ref
        out.append(n.copy(vel=float(np.clip(v, 0.02, 1.0))))
    return out


def gain_points(curve, t0, t1, step=0.05, db_range=18.0, ref=0.62):
    """Curve -> Track.auto / stem gain points [(sec, gain_lin)] (value ref = 0 dB, 0 = -db_range)."""
    out = []
    t = t0
    while t <= t1 + 1e-9:
        v = curve(t)
        out.append((t, db(-db_range * (1 - v / ref)) if v < ref else db(db_range * 0.5 * (v - ref) / (1 - ref))))
        t += step
    return out


def db_points(curve, t0, t1, step=0.05, db_range=18.0, ref=0.62):
    """Same as gain_points but in dB (for Score.stem_auto / Score.macro, which take dB)."""
    return [(t, 20 * math.log10(max(g, 1e-6))) for t, g in gain_points(curve, t0, t1, step, db_range, ref)]


def swell_env(dur_s, v0=0.2, v1=1.0, shape='s', release_to=None, points=12):
    """A per-note gain envelope for sampled sustains (note.x['env']): v0 -> v1 over dur_s.
    release_to: optional level to fall back to over the last 25 % (a messa di voce)."""
    f = shape_fn(shape)
    out = []
    for i in range(points + 1):
        u = i / points
        out.append((u * dur_s, v0 + (v1 - v0) * f(u)))
    if release_to is not None:
        out = [(t * 0.75, v) for t, v in out] + [(dur_s, release_to)]
    return out


def fp_env(dur_s, fp=0.35, dip_s=0.18, to=1.0):
    """Forte-piano then crescendo: the attack at full level, a quick dip to fp, then swell to `to`."""
    return [(0.0, 1.0), (dip_s, fp), (dur_s, to)]


def sfz_env(dur_s, hold=0.12, to=0.45):
    return [(0.0, 1.0), (hold, to), (dur_s, to * 0.9)]
