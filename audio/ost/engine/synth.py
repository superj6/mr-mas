"""Non-chip synthesis: 808 sub / drop, drone, brush sweeps, felt-piano mechanics, FX.

OST additions (below the theme's voices): the rest of an 808 kit (kick, clap, snare, rim, closed /
open hats for trap patterns), a polyBLEP analog pad, a cinematic impact and a noise riser."""
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


# ====================================================================== OST additions
def kick808(pitch=29.0, decay_s=0.45, punch_semi=14.0, drive=2.0, click=0.35, seed=0):
    """Short 808 kick (not the long sub): a fast pitch drop, a harder click, ~0.45 s decay."""
    return sub808(pitch, decay_s * 2.2, punch_semi=punch_semi, punch_s=0.022, decay_s=decay_s, drive=drive,
                  click=click, seed=seed)


def clap808(level=1.0, seed=0, spread_ms=9.0, tail_s=0.16):
    """808-style clap: three quick noise bursts then a band-passed decaying tail."""
    rng = np.random.default_rng(seed)
    n = int((0.05 + tail_s * 3) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k in range(3):
        st = int(k * spread_ms / 1000 * SR)
        m = n - st
        y[st:] += rng.standard_normal(m) * np.exp(-np.arange(m) / SR / 0.006) * (0.8 + 0.1 * k)
    st = int(3 * spread_ms / 1000 * SR)
    y[st:] += rng.standard_normal(n - st) * np.exp(-np.arange(n - st) / SR / tail_s) * 0.7
    y = bp(y, 900, 2600, 2) + 0.25 * bp(y, 4000, 9000, 1)
    y = y / (np.abs(y).max() + 1e-9) * 0.3 * level
    rs = rng.standard_normal(n) * 0.0
    return np.stack([y, np.roll(y, 24) + rs]).astype(np.float32)


_HAT_F = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]


def hat808(open_=False, level=1.0, seed=0, decay_s=None, tone=1.0):
    """808 hat: six detuned square partials (the classic metallic cluster), band-passed high."""
    rng = np.random.default_rng(seed)
    d = decay_s if decay_s is not None else (0.32 if open_ else 0.045)
    n = int((d * 5 + 0.01) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f in _HAT_F:
        f2 = f * tone * (1 + rng.normal(0, 0.002))
        y += np.sign(np.sin(2 * np.pi * f2 * t + rng.uniform(0, 6.28)))
    y = hp(bp(y, 6500, 16000, 2), 7000, 2)
    y = y + 0.25 * hp(rng.standard_normal(n), 9000, 2)
    env = np.exp(-t / d) * np.clip(t / 0.0005, 0, 1)
    y = y * env
    y = y / (np.abs(y).max() + 1e-9) * 0.2 * level
    return to_stereo(y.astype(np.float32))


def snare808(level=1.0, seed=0, tone_hz=185.0, snappy=0.7):
    rng = np.random.default_rng(seed)
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    body = (np.sin(2 * np.pi * tone_hz * t) + 0.6 * np.sin(2 * np.pi * tone_hz * 1.78 * t)) * np.exp(-t / 0.05)
    nz = hp(rng.standard_normal(n), 1800, 2) * np.exp(-t / 0.12) * snappy
    y = body * 0.6 + nz
    y = y / (np.abs(y).max() + 1e-9) * 0.3 * level
    return to_stereo(y.astype(np.float32))


def rim808(level=1.0, seed=0):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.008) + 0.5 * np.sin(2 * np.pi * 500 * t) * np.exp(-t / 0.01)
    y = hp(y, 300, 1)
    return to_stereo((y / (np.abs(y).max() + 1e-9) * 0.22 * level).astype(np.float32))


def _polyblep_saw(freq, n, phase0=0.0):
    dt = np.asarray(freq, dtype=np.float64) / SR
    if dt.ndim == 0:
        dt = np.full(n, float(dt))
    ph = (phase0 + np.cumsum(dt)) % 1.0
    y = 2.0 * ph - 1.0
    a = ph < dt
    x = ph[a] / dt[a]
    y[a] -= x + x - x * x - 1.0
    b = ph > 1.0 - dt
    x = (ph[b] - 1.0) / dt[b]
    y[b] -= x * x + x + x + 1.0
    return y


def pad(pitches, dur_s, kind='warm', attack=1.2, release=1.5, bright=1.0, detune_cents=7.0, voices=3, seed=0,
        filt_env=0.5, level=1.0):
    """Analog-style pad (polyBLEP saws, or 'hollow' odd-harmonic pulses), slow filter envelope.
    kind: 'warm' (dark, 1.1 kHz), 'glass' (brighter, thin, 3 kHz), 'hollow' (square-ish, woody)."""
    rng = np.random.default_rng(seed)
    n = int((dur_s + release) * SR)
    t = np.arange(n) / SR
    y = np.zeros((2, n))
    for p in pitches:
        f = midi_hz(p)
        for v in range(voices):
            c = (v - (voices - 1) / 2) * detune_cents
            drift = 1 + 0.0012 * lp(rng.standard_normal(n), 0.4, 1) * 20
            fr_ = f * 2 ** (c / 1200) * drift
            if kind == 'hollow':                  # saw minus a half-cycle-shifted saw = a square (odd harmonics)
                ph0 = rng.uniform()
                w = 0.5 * (_polyblep_saw(fr_, n, ph0) - _polyblep_saw(fr_, n, (ph0 + 0.5) % 1.0))
            else:
                w = _polyblep_saw(fr_, n, rng.uniform())
            pan = (v - (voices - 1) / 2) / max(1, voices - 1) * 0.8
            y[0] += w * (1 - pan) * 0.5
            y[1] += w * (1 + pan) * 0.5
    y /= max(1, len(pitches) * voices) ** 0.5
    base = {'warm': 1100.0, 'glass': 3000.0, 'hollow': 1600.0}[kind] * bright
    # slow filter envelope: opens with the attack, closes a little through the note
    fe = np.clip(t / max(attack, 0.05), 0, 1)
    cut = base * (0.45 + filt_env * fe) * np.where(t > dur_s, np.exp(-(t - dur_s) / release), 1.0)
    # time-varying LP via 4 block-wise filters with crossfaded cutoffs (cheap, smooth enough for pads)
    out = np.zeros_like(y)
    blk = int(0.05 * SR)
    from scipy import signal as _s
    zi = None
    for i0 in range(0, n, blk):
        fc = float(np.clip(cut[min(i0 + blk // 2, n - 1)], 80, 16000))
        sos = _s.butter(2, fc, 'low', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((2, sos.shape[0], 2))
        seg = y[:, i0:i0 + blk]
        for ch in range(2):
            out[ch, i0:i0 + blk], zi[ch] = _s.sosfilt(sos, seg[ch], zi=zi[ch])
    amp = np.clip(t / max(attack, 1e-3), 0, 1) ** 2
    amp = amp * np.where(t > dur_s, np.exp(-(t - dur_s) / (release / 4.6)), 1.0)
    if kind == 'glass':
        out = hp(out, 300, 1)
    return (out * amp * 0.25 * level).astype(np.float32)


def impact(level=1.0, seed=0, pitch=29.0, tail_s=3.5, noise=0.6, sub=1.0, bright=4000.0):
    """Cinematic impact (thriller hit): 808-style sub drop + a low boom + a filtered noise burst with
    a long dark tail.  Keep it rare; it is a punctuation mark, not a groove element."""
    rng = np.random.default_rng(seed)
    n = int(tail_s * SR)
    t = np.arange(n) / SR
    s = sub808(pitch, tail_s, punch_semi=18.0, punch_s=0.04, decay_s=tail_s / 3.2, drive=2.2, click=0.3,
               seed=seed)[0]
    boom = np.sin(2 * np.pi * midi_hz(pitch + 12) * t * (1 - 0.15 * t / tail_s)) * np.exp(-t / 0.35) * 0.5
    nz = lp(rng.standard_normal(n), bright, 2) * np.exp(-t / 0.08) * noise
    nz += lp(rng.standard_normal(n), 900, 2) * np.exp(-t / (tail_s / 3)) * noise * 0.3
    y = s[:n] * sub + boom + nz
    y = y / (np.abs(y).max() + 1e-9) * 0.5 * level
    return np.stack([y, lp(y, bright * 0.8, 1) * 0.98 + 0.02 * np.roll(y, 96)]).astype(np.float32)


def noise_riser(dur_s, level=1.0, seed=0, f0=400.0, f1=9000.0, curve=2.2):
    """Filtered-noise riser (non-chip): band-pass sweeping up, level rising, hard stop at the end."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    x = np.stack([rng.standard_normal(n), rng.standard_normal(n)])
    u = np.linspace(0, 1, n)
    out = np.zeros_like(x)
    blk = int(0.02 * SR)
    from scipy import signal as _s
    zi = None
    for i0 in range(0, n, blk):
        fc = f0 * (f1 / f0) ** (u[min(i0, n - 1)] ** 1.2)
        sos = _s.butter(2, [fc * 0.7, min(fc * 1.4, SR * 0.45)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((2, sos.shape[0], 2))
        for ch in range(2):
            out[ch, i0:i0 + blk], zi[ch] = _s.sosfilt(sos, x[ch, i0:i0 + blk], zi=zi[ch])
    env = u ** curve
    k = int(0.004 * SR)
    env[-k:] *= np.linspace(1, 0, k)
    y = out * env * 0.15 * level
    return y.astype(np.float32)
