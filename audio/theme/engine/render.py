"""Score -> tracks -> stems -> master."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Callable

import numpy as np

from .core import (SR, N, SPF, Note, f2n, f2s, db, to_stereo, apply_pan, add_at, env_curve, lp, hp,
                   peq, shelf, soft_sat, tape)
from . import library, sampler, chip, synth
from .mix import convolve

TAIL = int(4.0 * SR)          # render headroom past 30 s (cut before master)


@dataclass
class Track:
    name: str
    src: tuple                     # ('ss', set) | ('sf2', path, bank, preset, drums) | ('fn', callable)
    stem: str
    gain_db: float = 0.0
    pan: float = 0.0
    width: float = 1.0
    sends: dict = field(default_factory=dict)       # {'hall': dB, 'room': dB, ...}
    hum_ms: float = 6.0            # timing humanisation (sigma)
    offset_ms: float = 0.0         # push/pull (negative = ahead)
    vel_jit: float = 0.04
    rel: float = 0.3               # default release seconds
    post: Callable | None = None   # buf -> buf
    eq: list = field(default_factory=list)          # [('hp',f),('lp',f),('peq',f,g,q),('hs',f,g),('ls',f,g)]
    auto: list | None = None       # gain automation points [(frame, gain_lin)]
    sf2_gain: float = 0.0
    pedal: list | None = None      # [(frame, bool)]
    seed: int = 0
    latency_ms: float = 0.0        # sample/SF2 onset latency, compensated on every note (incl. locked hits)


@dataclass
class Score:
    name: str
    tracks: dict
    notes: list
    stems: list
    stem_post: dict = field(default_factory=dict)      # stem -> callable(buf)->buf
    stem_gain: dict = field(default_factory=dict)      # stem -> dB
    mute_window: tuple | None = None                   # v2.0 'music fired' window; retired in v2.1 (keep None)
    unmuted_stems: tuple = ()
    stem_auto: dict = field(default_factory=dict)      # stem -> [(frame, dB)] gain ride (e.g. the VO duck)
    end_fade: tuple = (706, 719.5)
    macro: list | None = None                          # [(frame, dB)] fader ride applied to every stem
    meta: dict = field(default_factory=dict)


def humanise(notes, tr: Track, rng):
    out = []
    for n in notes:
        m = Note(n.inst, n.pitch, n.start, n.dur, n.vel, n.lock, dict(n.x))
        if not n.lock:
            dt_ms = rng.normal(tr.offset_ms, tr.hum_ms)
            dt_ms = float(np.clip(dt_ms, tr.offset_ms - 2.5 * tr.hum_ms, tr.offset_ms + 2.5 * tr.hum_ms))
            m.start = n.start + dt_ms / 1000 * 24
            m.vel = float(np.clip(n.vel * (1 + rng.normal(0, tr.vel_jit)), 0.02, 1.0))
        m.start = max(0.0, m.start)
        out.append(m)
    return out


def _eq(buf, eq):
    for e in eq:
        k = e[0]
        if k == 'hp':
            buf = hp(buf, e[1], e[2] if len(e) > 2 else 2)
        elif k == 'lp':
            buf = lp(buf, e[1], e[2] if len(e) > 2 else 2)
        elif k == 'peq':
            buf = peq(buf, e[1], e[2], e[3] if len(e) > 3 else 1.0)
        elif k == 'hs':
            buf = shelf(buf, e[1], e[2], True)
        elif k == 'ls':
            buf = shelf(buf, e[1], e[2], False)
    return buf


def render_track(tr: Track, notes):
    rng = np.random.default_rng(1000 + tr.seed + sum(map(ord, tr.name)))
    notes = humanise(notes, tr, rng)
    if tr.latency_ms:
        for n in notes:
            n.start = max(0.0, n.start - tr.latency_ms / 1000 * 24)
    buf = np.zeros((2, N + TAIL), dtype=np.float32)
    kind = tr.src[0]
    if kind == 'ss':
        ss = library.get(tr.src[1])
        for n in notes:
            x = n.x
            y = ss.render(n.pitch, n.vel, f2s(n.dur), rng, rel_s=x.get('rel', tr.rel), att_s=x.get('att', 0.0),
                          offset_s=x.get('offset', 0.0), detune_cents=x.get('detune', rng.normal(0, 2.0)),
                          gain_db=x.get('gain', 0.0), lp_hz=x.get('lp'), env=x.get('env'),
                          tail_s=x.get('tail'), bend=x.get('bend'))
            if 'pan' in x:
                y = apply_pan(y, x['pan'])
            add_at(buf, y, f2n(n.start))
    elif kind == 'sf2':
        _, path, bank, preset, drums = tr.src
        ev = []
        for n in notes:
            s = f2n(n.start)
            e = f2n(n.start + n.dur)
            ev.append((s, max(e, s + 64), int(round(n.pitch)), int(round(n.vel * 127))))
        ped = [(f2n(f), on) for f, on in (tr.pedal or [])]
        buf = sampler.render_sf2(path, bank, preset, ev, N + TAIL, drums=drums, gain_db=tr.sf2_gain, pedal=ped)
    elif kind == 'fn':
        fn = tr.src[1]
        for n in notes:
            y = fn(n, rng)
            if y is None:
                continue
            y = to_stereo(y).astype(np.float32)
            k = min(144, y.shape[1])                     # 3 ms de-click at the tail
            y[:, -k:] *= np.linspace(1, 0, k, dtype=np.float32)[None]
            if 'pan' in n.x:
                y = apply_pan(y, n.x['pan'])
            add_at(buf, y, f2n(n.start))
    if tr.post:
        buf = tr.post(buf)
    buf = _eq(buf, tr.eq)
    if tr.pan or tr.width != 1.0:
        buf = apply_pan(buf, tr.pan, tr.width)
    buf = buf * db(tr.gain_db)
    if tr.auto:
        g = env_curve(tr.auto, N + TAIL)
        buf = buf * g[None]
    return buf.astype(np.float32)


def render_score(sc: Score, cache_dir=None, only=None, verbose=True):
    """Returns dict stem -> stereo [2, N] (pre-master, mute & end fade applied)."""
    by_track = {}
    for n in sc.notes:
        by_track.setdefault(n.inst, []).append(n)
    stems = {s: np.zeros((2, N + TAIL), dtype=np.float32) for s in sc.stems}
    sends = {}
    for name, tr in sc.tracks.items():
        if only and tr.stem not in only:
            continue
        ns = by_track.get(name, [])
        if not ns:
            continue
        if verbose:
            print(f'  track {name:14s} -> {tr.stem:8s} ({len(ns)} notes)', flush=True)
        y = render_track(tr, ns)
        stems[tr.stem] += y
        for bus, lvl in tr.sends.items():
            key = (tr.stem, bus)
            if key not in sends:
                sends[key] = np.zeros_like(y)
            sends[key] += y * db(lvl)
    for (stem, bus), x in sends.items():
        stems[stem] += convolve(x, bus)
    out = {}
    for s, x in stems.items():
        if s in sc.stem_post:
            x = sc.stem_post[s](x)
        x = x * db(sc.stem_gain.get(s, 0.0))
        out[s] = x[:, :N].astype(np.float32)
    for s, pts in (sc.stem_auto or {}).items():
        if s in out and pts:
            out[s] = out[s] * env_curve([(f, db(d)) for f, d in pts], N)[None]
    if sc.macro:
        g = env_curve([(f, db(d)) for f, d in sc.macro], N)
        for s in out:
            if s not in sc.unmuted_stems:
                out[s] = out[s] * g[None]
    # music fired: every stem muted (10 ms fades) except the unmuted bus
    if sc.mute_window:
        a, b = sc.mute_window
        fl = int(0.010 * SR)
        g = np.ones(N, dtype=np.float32)
        s0, s1 = f2n(a), f2n(b)
        g[s0:s1] = 0.0
        g[s0 - fl:s0] = np.linspace(1, 0, fl)
        g[s1 - fl:s1] = np.linspace(0, 1, fl)  # fully back exactly on the slam frame
        for s in out:
            if s not in sc.unmuted_stems:
                out[s] = out[s] * g[None]
    if sc.end_fade:
        a, b = sc.end_fade
        g = env_curve([(0, 1.0), (a, 1.0), (b, 0.0), (720, 0.0)], N)
        g = g ** 2
        for s in out:
            out[s] = out[s] * g[None]
    return out
