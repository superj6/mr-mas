"""Non-chip synthesis: 808 sub / drop, drone, brush sweeps, felt-piano mechanics, FX."""
from __future__ import annotations

import numpy as np

from .core import SR, midi_hz, lp, hp, bp, to_stereo, soft_sat, db, peq


def sub808(pitch, dur_s, punch_semi=10.0, punch_s=0.035, decay_s=0.9, drive=1.6, click=0.15, glide_to=None,
           glide_s=None, seed=0):
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    p = pitch + punch_semi * np.exp(-t / punch_s)
    if glide_to is not None:
        g = np.clip(t / (glide_s or dur_s), 0, 1)
        g = g * g * (3 - 2 * g)
        p = p + (glide_to - pitch) * g
    f = 440 * 2 ** ((p - 69) / 12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph)
    a = np.exp(-t / decay_s) * np.clip(t / 0.002, 0, 1)
    y = soft_sat(y * a * drive, 1.0) / np.tanh(drive)
    if click:
        rng = np.random.default_rng(seed)
        c = rng.standard_normal(min(n, 480)) * np.exp(-np.arange(min(n, 480)) / 60.0)
        y[:len(c)] += click * lp(c, 3000, 2)
    y = lp(y, 1800, 2)
    return to_stereo(y.astype(np.float32))


def drone(pitches, dur_s, fade_in=1.2, fade_out=0.6, beat_hz=0.13, level=1.0, seed=0):
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(seed)
    y = np.zeros((2, n))
    for i, p in enumerate(pitches):
        f = midi_hz(p)
        for ch in range(2):
            det = 1 + (0.0009 if ch else -0.0009) * (i + 1)
            ph = 2 * np.pi * f * det * t + rng.uniform(0, 6.28)
            w = np.sin(ph) + 0.18 * np.sin(2 * ph + 0.3) + 0.05 * np.sin(3 * ph + 1.1)
            y[ch] += w * (1 + 0.08 * np.sin(2 * np.pi * beat_hz * (i + 1) * t))
    env = np.minimum(np.clip(t / fade_in, 0, 1) ** 2, np.clip((dur_s - t) / fade_out, 0, 1))
    y *= env * level / max(len(pitches), 1)
    return lp(y, 900, 2).astype(np.float32)


def pink(n, rng):
    w = rng.standard_normal(n)
    # Voss-ish via filtering: -3 dB/oct approximation
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    from scipy.signal import lfilter
    return lfilter(b, a, w)


def brush_sweep(dur_s, level=1.0, seed=0, lo=700.0, hi=7500.0, circles=1.0):
    """Wire-brush swish: band-passed pink noise, swelling, with bristle grain and circular motion."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    x = pink(n + 2000, rng)[2000:]
    x = bp(x, lo, hi, 2)
    t = np.arange(n) / SR
    grain = 1 + 0.5 * lp(rng.standard_normal(n), 35, 1) * 6
    circ = 0.65 + 0.35 * np.sin(2 * np.pi * circles * t / dur_s - np.pi / 2)
    env = np.sin(np.pi * np.clip(t / dur_s, 0, 1)) ** 1.2
    y = x * grain * circ * env
    y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.02 * level
    # slight stereo motion
    pan = 0.5 + 0.25 * np.sin(2 * np.pi * circles * t / dur_s)
    return np.stack([y * (1 - pan) * 1.4, y * pan * 1.4]).astype(np.float32)


def brush_tap(level=1.0, seed=0, slap=False):
    rng = np.random.default_rng(seed)
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    burst = rng.standard_normal(n) * np.exp(-t / (0.018 if not slap else 0.035))
    burst = bp(burst, 1200, 9000, 2)
    wires = hp(rng.standard_normal(n), 3500, 2) * np.exp(-t / 0.11) * 0.35
    body = np.sin(2 * np.pi * 196 * t) * np.exp(-t / 0.05) * 0.25
    y = burst + wires + body
    y = y / (np.abs(y).max() + 1e-9) * 0.25 * level
    return to_stereo(y.astype(np.float32))


def felt_mech(level=1.0, seed=0):
    """Felt piano key/hammer thump (close-mic mechanics)."""
    rng = np.random.default_rng(seed)
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    y = rng.standard_normal(n) * np.exp(-t / 0.006)
    y = bp(y, 120, 1400, 2) + 0.4 * np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.015)
    y = y / (np.abs(y).max() + 1e-9) * 0.05 * level
    return to_stereo(y.astype(np.float32))


def reverse_swell(dur_s, level=1.0, seed=0, hi=9000):
    """Reverse-cymbal-like swell: noise with exponential rise, filter opening, hard stop."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    x = np.stack([rng.standard_normal(n), rng.standard_normal(n)])
    x = hp(x, 2500, 2)
    x = lp(x, hi, 2)
    env = (t / dur_s) ** 3.2
    y = x * env * 0.06 * level
    k = int(0.004 * SR)
    y[:, -k:] *= np.linspace(1, 0, k)
    return y.astype(np.float32)


def shimmer(pitches, dur_s, density=18.0, level=1.0, seed=0):
    """Glass shimmer: many tiny high sine pings on chord tones (upper octaves)."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    y = np.zeros((2, n))
    count = int(density * dur_s)
    for i in range(count):
        p = rng.choice(pitches) + 12 * rng.integers(1, 3)
        f = midi_hz(p)
        st = int(rng.uniform(0, dur_s * 0.85) * SR)
        ln = int(0.9 * SR)
        tt = np.arange(ln) / SR
        s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.35) * np.clip(tt / 0.003, 0, 1)
        s += 0.3 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.08)
        pan = rng.uniform(-0.8, 0.8)
        e = min(ln, n - st)
        y[0, st:st + e] += s[:e] * (1 - pan) * 0.5
        y[1, st:st + e] += s[:e] * (1 + pan) * 0.5
    env = np.clip(np.arange(n) / (0.2 * SR), 0, 1)
    return (y * env * 0.02 * level).astype(np.float32)


def room_tone(dur_s, level_db=-62.0, seed=0):
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    x = np.stack([pink(n, rng), pink(n, rng)])
    x = lp(hp(x, 60, 2), 5000, 1)
    x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * db(level_db)
    t = np.arange(n) / SR
    hum = 0.35 * db(level_db) * np.sin(2 * np.pi * 120 * t)
    return (x + hum).astype(np.float32)


def bell(pitch, dur_s=2.5, level=1.0, bright=1.0):
    """Soft synthetic bell (for the notification ding layer): inharmonic partials, fast HF decay."""
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    f = midi_hz(pitch)
    parts = [(1.0, 1.0, 1.6), (2.0, 0.35, 0.8), (2.76, 0.22 * bright, 0.45), (5.4, 0.12 * bright, 0.22),
             (8.93, 0.05 * bright, 0.1)]
    y = np.zeros(n)
    for r, a, d in parts:
        y += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d)
    y *= np.clip(t / 0.0015, 0, 1)
    return to_stereo((y * 0.12 * level).astype(np.float32))
