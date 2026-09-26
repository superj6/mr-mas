"""Articulation switching for strings and brass (and the reeds that share the tricks).

The palette's section tracks are keyswitched: src=('art', 'vln') plays each note from the sample set
named by note.x['art'] (library.ART).  These helpers write the right notes for each articulation:

  strings   legato (crossfaded pseudo-legato, optional portamento), sus, pizz, spic(cato), trem(olo),
            swell (a crescendo on one bow), fp (forte-piano then crescendo), sfz
  brass     stab (a section hit: micro-offsets + detune), swell (p < f on a held note), fall, rip, doit,
            scoop, and harmon / straight-mute lines via art=
  big band  shout(): trumpets on top, trombones under, saxes doubling inner voices

Positions/durations: seconds, (bar, beat) tuples or grid duration strings ('2b', '1bar', '1/8').

    from engine import articulations as art
    art.legato(a, 'vln1', [('F4', (5, 1), '2b'), ('G4', (5, 3), '1b'), ('Ab4', (5, 4), '5b')], vel=0.55)
    art.pizz(a, 'vc', ['F2', 'C3'], (7, 1), vel=0.6)
    art.trem(a, 'vla', ['C4', 'Eb4'], (9, 1), '2bar', vel=0.4, swell=('pp', 'mf'))
    art.stab(a, 'tpt', ['C5', 'Ab4', 'F4'], (9, 1), vel=0.85)
    art.fall(a, 'tbn', 'Bb3', (12, 3), '2b', real=True)      # the real old-trombone fall sample
    art.swell(a, 'hn', ['F3', 'C4', 'Eb4'], (13, 1), '1bar', 'p', 'f')
"""
from __future__ import annotations

import numpy as np

from .core import nm, Note
from .dynamics import swell_env, fp_env, sfz_env, DYN


def _tv(a, at, d):
    t = a.g.at(at)
    return t, a.g.dur(d, t)


def _vel(v):
    return DYN[v] if isinstance(v, str) else float(v)


def _n(a, inst, pitch, t, d, vel, lock=False, **x):
    n = Note(inst, float(nm(pitch)), float(t), float(d), float(vel), lock, dict(x))
    a.notes.append(n)
    return n


# ------------------------------------------------------------------ strings
def legato(a, inst, seq, vel=0.6, overlap=0.07, offset=0.09, att=0.06, rel_inner=0.12, port=None, port_s=0.09,
           art='leg', lock=False, last=None, **x):
    """Crossfaded pseudo-legato (the theme's Arr.legato, in seconds):
    later notes skip their attack (offset into the sample, faded in over att) and each note but the last
    overlaps the next by `overlap` with a short release -> the join sounds bowed, not re-attacked.
    seq: [(pitch, at, dur[, vel])].  port: semitones of portamento slide allowed (e.g. 12) -> intervals
    up to that size slide in over port_s (solo strings / expressive lines).  last: extras for the final
    note (e.g. dict(rel=0.6) or a fall bend)."""
    out = []
    prev_p = None
    for i, s in enumerate(seq):
        p = nm(s[0])
        t, d = _tv(a, s[1], s[2])
        v = _vel(s[3]) if len(s) > 3 else vel
        kw = dict(x)
        kw['art'] = art
        if i > 0:
            kw.setdefault('offset', offset)
            kw.setdefault('att', att)
            if port and prev_p is not None and 0 < abs(p - prev_p) <= port:
                kw['bend'] = [(0.0, float(prev_p - p)), (port_s, 0.0)]
        if i < len(seq) - 1:
            kw.setdefault('rel', rel_inner)
            dd = d + overlap
        else:
            kw.update(last or {})
            dd = d + kw.pop('overlap', 0.0)
        out.append(_n(a, inst, p, t, dd, v, lock, **kw))
        prev_p = p
    return out


def sus(a, inst, pitches, at, d, vel=0.55, lock=False, **x):
    t, dd = _tv(a, at, d)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    return [_n(a, inst, p, t, dd, _vel(vel), lock, art=x.pop('art', 'sus'), **x) for p in ps]


def pizz(a, inst, pitches, at, vel=0.6, d=0.35, lock=False, **x):
    t = a.g.at(at)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    return [_n(a, inst, p, t + 0.004 * i, d, _vel(vel), lock, art='pizz', **x) for i, p in enumerate(ps)]


def spic(a, inst, pitches, at, vel=0.6, d=0.12, lock=False, **x):
    t = a.g.at(at)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    return [_n(a, inst, p, t, d, _vel(vel), lock, art='spic', **x) for p in ps]


def trem(a, inst, pitches, at, d, vel=0.5, swell=None, shape='s', lock=False, **x):
    """Bowed tremolo; swell=('pp', 'mf') rides the note from the first to the second level."""
    t, dd = _tv(a, at, d)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    kw = dict(x)
    v = _vel(vel)
    if swell:
        v0, v1 = _vel(swell[0]), _vel(swell[1])
        v = max(v0, v1)
        kw['env'] = swell_env(dd, v0 / v, v1 / v, shape)
    return [_n(a, inst, p, t, dd, v, lock, art='trem', **kw) for p in ps]


def swell(a, inst, pitches, at, d, v0='p', v1='f', shape='s', art='sus', release_to=None, lock=False, **x):
    """A crescendo (or diminuendo) on one held note/chord: sampled at the peak dynamic's layer,
    gain-enveloped from v0 to v1 -> the timbre is the loud one, the level grows (brass swells, string
    swells into a hit)."""
    t, dd = _tv(a, at, d)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    lo, hi = _vel(v0), _vel(v1)
    peak = max(lo, hi)
    env = swell_env(dd, lo / peak, hi / peak, shape, release_to)
    return [_n(a, inst, p, t + 0.003 * i, dd, peak, lock, art=art, env=env, **x) for i, p in enumerate(ps)]


def fp(a, inst, pitches, at, d, vel='f', dip='p', to='f', art='sus', lock=False, **x):
    t, dd = _tv(a, at, d)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    v = _vel(vel)
    env = fp_env(dd, _vel(dip) / v, 0.18, _vel(to) / v)
    return [_n(a, inst, p, t, dd, v, lock, art=art, env=env, **x) for p in ps]


def sfz(a, inst, pitches, at, d, vel='ff', to='mp', art='sus', lock=False, **x):
    t, dd = _tv(a, at, d)
    ps = pitches if isinstance(pitches, (list, tuple)) else [pitches]
    v = _vel(vel)
    return [_n(a, inst, p, t, dd, v, lock, art=art, env=sfz_env(dd, 0.12, _vel(to) / v), **x) for p in ps]


# ------------------------------------------------------------------ brass
def stab(a, inst, pitches, at, vel=0.8, length=0.13, spread_ms=5.0, detune=6.0, art='stab', lock=True, **x):
    """A section stab: each voice a hair apart (spread_ms) and detuned (+-detune cents) so it reads as
    players, not a sampler chord.  Brass is an ACCENT in this score: use stabs sparingly."""
    t = a.g.at(at)
    ps = sorted((nm(p) for p in (pitches if isinstance(pitches, (list, tuple)) else [pitches])), reverse=True)
    rel = x.pop('rel', 0.1)
    pan0 = x.pop('pan', 0.0)
    offs = [0.0, 0.6, 0.25, 0.9, 0.4, 0.75, 0.15]
    dets = [0.0, 1.0, -0.8, 0.5, -0.4, 0.9, -1.0]
    out = []
    for i, p in enumerate(ps):
        out.append(_n(a, inst, p, t + offs[i % 7] * spread_ms / 1000.0, length,
                      _vel(vel) * (1.0 if i == 0 else 0.92), lock, art=art, detune=dets[i % 7] * detune, rel=rel,
                      pan=pan0 + 0.12 * ((i % 3) - 1), **x))
    return out


def fall(a, inst, pitch, at, d, depth=5.0, hold=0.45, vel=0.7, real=False, art=None, front=None, lock=True, **x):
    """Fall-off: hold `hold` of the note, then drop `depth` semitones while fading.  real=True uses the
    VSCO old-trombone fall samples (trombone tracks only).  front='stab' starts the note with a staccato
    attack crossfaded into the sustain sample (the sustain samples speak ~30 ms late: use it on kicks)."""
    t, dd = _tv(a, at, d)
    if real:
        return [_n(a, inst, pitch, t, dd, _vel(vel), lock, art='fall', rel=0.1, **x)]
    out = []
    kw = dict(x)
    kw['art'] = art or 'sus'
    kw['bend'] = [(0.0, 0.0), (hold * dd, 0.0), (0.95 * dd, -float(depth))]
    kw['env'] = [(0.0, 1.0), (hold * dd, 1.0), (dd, 0.0)]
    kw.setdefault('rel', 0.05)
    if front == 'stab':
        out.append(_n(a, inst, pitch, t, 0.09, _vel(vel), lock, art='stab', rel=0.06))
        kw.setdefault('offset', 0.06)
        kw.setdefault('att', 0.035)
    out.append(_n(a, inst, pitch, t, dd, _vel(vel), lock, **kw))
    return out


def rip(a, inst, pitch, at, d, depth=9.0, frac=0.8, vel=0.8, art='sus', lock=True, **x):
    """Rip up into the note: starts `depth` semitones low, glisses up over `frac` of the length,
    growing from 35 % to full level (the theme's accent #5)."""
    t, dd = _tv(a, at, d)
    return [_n(a, inst, pitch, t, dd, _vel(vel), lock, art=art, att=0.02, rel=x.pop('rel', 0.06),
               bend=[(0.0, -float(depth)), (dd * frac, 0.0)], env=[(0, 0.35), (dd * 0.85, 1.0), (dd, 1.0)], **x)]


def doit(a, inst, pitch, at, d, depth=4.0, start=0.6, vel=0.7, art='sus', lock=True, **x):
    """Doit: the note bends UP at its end and fades (jazz inflection)."""
    t, dd = _tv(a, at, d)
    return [_n(a, inst, pitch, t, dd, _vel(vel), lock, art=art, rel=0.05,
               bend=[(0.0, 0.0), (start * dd, 0.0), (dd, float(depth))],
               env=[(0.0, 1.0), (start * dd, 1.0), (dd, 0.0)], **x)]


def scoop(a, inst, pitch, at, d, depth=0.6, s=0.07, vel=0.65, art='sus', lock=False, **x):
    t, dd = _tv(a, at, d)
    return [_n(a, inst, pitch, t, dd, _vel(vel), lock, art=art, bend=[(0.0, -float(depth)), (s, 0.0)], **x)]


def shout(a, voicing, at, vel=0.85, length=0.2, trumpets='tpt', trombones='tbn', saxes='tsax', tuba=None,
          bass_note=None, n_tpt=3):
    """Big-band shout: the top n_tpt notes to trumpets, the rest to trombones, a tenor doubling the
    4th voice; optional tuba on bass_note.  voicing high -> low (e.g. harmony.voice(...) reversed)."""
    v = sorted((nm(p) for p in voicing), reverse=True)
    out = stab(a, trumpets, v[:n_tpt], at, vel, length)
    if v[n_tpt:]:
        out += stab(a, trombones, v[n_tpt:], at, vel * 0.92, length + 0.02)
    if saxes and len(v) > 3:
        out += stab(a, saxes, [v[3]], at, vel * 0.8, length, art='stac')
    if tuba and bass_note:
        out += stab(a, tuba, [bass_note], at, vel * 0.85, length + 0.05)
    return out
