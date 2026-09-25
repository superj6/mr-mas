"""Chip voices (numpy): band-limited pulse / triangle / LFSR noise / 1-bit beeper,
plus a '16-bit sample-chip' (SNES-style) processor for real samples.

Tasteful by design: additive band-limited oscillators (no raw aliasing),
envelopes that *can* be stepped like a 60 Hz sound driver, gentle vibrato.
"""
from __future__ import annotations

import numpy as np
from scipy import signal

from .core import SR, midi_hz, lp, hp, to_stereo


def _phase(freq_hz: np.ndarray) -> np.ndarray:
    return 2 * np.pi * np.cumsum(freq_hz) / SR


def _freq_track(pitch, n, vib_cents=0.0, vib_hz=5.5, vib_delay=0.18, slide_from=None, slide_s=0.03,
                bend=None):
    t = np.arange(n) / SR
    p = np.full(n, float(pitch))
    if slide_from is not None:
        k = np.exp(-t / max(slide_s, 1e-4))
        p = pitch + (slide_from - pitch) * k
    if bend is not None:   # list of (sec, semis) relative
        p = p + np.interp(t, [b[0] for b in bend], [b[1] for b in bend])
    if vib_cents:
        ramp = np.clip((t - vib_delay) / 0.25, 0, 1)
        p = p + ramp * vib_cents / 100.0 * np.sin(2 * np.pi * vib_hz * t)
    return 440.0 * 2 ** ((p - 69) / 12.0)


def stepped_env(n, att=0.002, dec=0.25, sus=0.6, rel=0.08, gate_s=None, steps=15, rate=60.0, smooth_ms=1.2):
    """ADSR; optionally quantised to `steps` levels updated at `rate` Hz (sound-driver style)."""
    t = np.arange(n) / SR
    gate = gate_s if gate_s is not None else n / SR
    a = np.clip(t / max(att, 1e-4), 0, 1)
    d = sus + (1 - sus) * np.exp(-np.maximum(t - att, 0) / max(dec, 1e-4))
    e = np.where(t < att, a, d)
    r = np.where(t > gate, np.exp(-(t - gate) / max(rel, 1e-4)), 1.0)
    e = e * r
    if steps:
        tick = np.minimum((np.floor(t * rate) + 1) / rate, t[-1])
        e_att = np.where(t < att, a, 1.0)
        e = np.interp(tick, t, e / np.maximum(e_att, 1e-6)) * e_att   # attack stays continuous (on the grid)
        e = np.round(e * steps) / steps
        k = max(int(smooth_ms * SR / 1000), 1)
        e = np.convolve(e, np.ones(k) / k, mode='same')
    return e.astype(np.float32)


def pulse(pitch, dur_s, duty=0.25, max_hz=12000.0, tilt=0.0, duty_to=None, **fkw):
    """Band-limited pulse by additive synthesis. tilt (dB/oct) softens upper harmonics."""
    n = int(dur_s * SR)
    f = _freq_track(pitch, n, **fkw)
    ph = _phase(f)
    fmax = float(f.max())
    K = max(1, int(max_hz / fmax))
    y = np.zeros(n)
    if duty_to is None:
        for k in range(1, K + 1):
            a = (2.0 / (k * np.pi)) * np.sin(np.pi * k * duty) * (k ** (tilt / 6.02) if tilt else 1.0)
            if abs(a) > 1e-5:
                y += a * np.cos(k * ph)
    else:  # duty sweep over the note
        d = np.linspace(duty, duty_to, n)
        for k in range(1, K + 1):
            a = (2.0 / (k * np.pi)) * np.sin(np.pi * k * d) * (k ** (tilt / 6.02) if tilt else 1.0)
            y += a * np.cos(k * ph)
    # fade harmonics near the top to avoid a brick-wall edge
    return (y * 0.9).astype(np.float32)


def triangle(pitch, dur_s, steps=16, **fkw):
    """NES-flavoured 4-bit stepped triangle, oversampled x4 then decimated (band-limited)."""
    n = int(dur_s * SR)
    os_ = 4
    f = _freq_track(pitch, n, **fkw)
    f4 = np.repeat(f, os_) / os_
    ph = np.cumsum(f4) / SR
    fr_ = ph - np.floor(ph)
    tri = 1 - 4 * np.abs(fr_ - 0.5)
    if steps:
        tri = np.round((tri + 1) * (steps - 1) / 2) / ((steps - 1) / 2) - 1
    y = signal.resample_poly(tri, 1, os_)[:n]
    y = lp(y, 9000, 2)
    return y.astype(np.float32)


def lfsr_noise(dur_s, clock_hz=48000.0, short=False, seed=1):
    """15-bit LFSR noise (NES style). short=True -> 93-step metallic mode."""
    n = int(dur_s * SR)
    nclk = int(dur_s * clock_hz) + 2
    reg = 1 + (seed % 32000)
    out = np.empty(nclk, dtype=np.float32)
    tap = 6 if short else 1
    for i in range(nclk):
        b = (reg & 1) ^ ((reg >> tap) & 1)
        reg = (reg >> 1) | (b << 14)
        out[i] = 1.0 if (reg & 1) else -1.0
    idx = np.minimum((np.arange(n) * clock_hz / SR).astype(int), nclk - 1)
    y = out[idx]
    return lp(y, min(clock_hz * 0.5, 16000), 2).astype(np.float32)


_NOISE_CACHE = {}


def noise_hit(dur_s, clock_hz=24000.0, short=False, seed=3):
    key = (round(dur_s, 3), clock_hz, short, seed)
    if key not in _NOISE_CACHE:
        _NOISE_CACHE[key] = lfsr_noise(dur_s, clock_hz, short, seed)
    return _NOISE_CACHE[key]


def beeper(pitch, dur_s, rate=22254.0, bits=8, **fkw):
    """1-bit-era beeper: 50% square rendered at the early-Mac 22.254 kHz / 8-bit, gently smoothed."""
    y = pulse(pitch, dur_s, duty=0.5, max_hz=rate * 0.5, **fkw)
    step = SR / rate
    idx = (np.floor(np.arange(len(y)) / step) * step).astype(int)
    y = y[np.clip(idx, 0, len(y) - 1)]
    q = 2 ** (bits - 1)
    y = np.round(y * q * 0.7) / q
    return lp(y, 9500, 2).astype(np.float32)


# ----------------------------------------------------------- 16-bit sample chip
def _brr(x: np.ndarray) -> np.ndarray:
    """Very small BRR-style coder: 16-sample blocks, 4-bit residual, filter 0/1 chosen per block."""
    x16 = np.clip(x * 32767, -32768, 32767)
    y = np.zeros_like(x16)
    prev = 0.0
    for b in range(0, len(x16), 16):
        blk = x16[b:b + 16]
        best = None
        for filt in (0, 1):
            p = prev
            res = []
            for s in blk:
                pred = p * (15 / 16) if filt else 0.0
                res.append(s - pred)
                p = s
            m = max(abs(v) for v in res) + 1e-9
            shift = max(0, int(np.ceil(np.log2(m / 7.0))))
            sc = 2 ** shift
            p = prev
            out = []
            err = 0.0
            for s in blk:
                pred = p * (15 / 16) if filt else 0.0
                q = np.clip(np.round((s - pred) / sc), -8, 7) * sc
                v = pred + q
                out.append(v)
                err += (v - s) ** 2
                p = v
            if best is None or err < best[0]:
                best = (err, out)
        y[b:b + len(blk)] = best[1]
        prev = best[1][-1]
    return (y / 32767).astype(np.float32)


def sample_chip(x: np.ndarray, store_rate=16000, brr=True, echo_ms=0.0, echo_fb=0.3, echo_mix=0.25,
                mono=True) -> np.ndarray:
    """SNES-ish treatment: store at low rate, BRR grit, Gaussian-ish interpolation, FIR-filtered echo."""
    x = to_stereo(x)
    m = x.mean(0) if mono else x
    from fractions import Fraction
    f = Fraction(store_rate, SR)
    lo = signal.resample_poly(m, f.numerator, f.denominator, axis=-1)
    if brr:
        lo = _brr(lo) if lo.ndim == 1 else np.stack([_brr(c) for c in lo])
    # Gaussian interpolation back to SR: zero-order upsample then gaussian kernel
    up = signal.resample_poly(lo, f.denominator, f.numerator, axis=-1)
    # SNES gaussian interpolation = soft roll-off well below the storage Nyquist
    up = lp(lp(up, store_rate * 0.36, 2), store_rate * 0.30, 1)
    up = up[..., :x.shape[1]]
    if up.shape[-1] < x.shape[1]:
        up = np.pad(up, [(0, 0)] * (up.ndim - 1) + [(0, x.shape[1] - up.shape[-1])])
    y = to_stereo(up)
    if echo_ms > 0:
        d = int(echo_ms * SR / 1000)
        e = np.zeros_like(y)
        buf = y.copy()
        for k in range(1, 6):
            if d * k >= y.shape[1]:
                break
            buf = lp(buf, 5000, 1) * echo_fb if k > 1 else buf * echo_fb
            e[:, d * k:] += buf[:, :y.shape[1] - d * k]
        # ping-pong-ish spread
        e = np.stack([e[0] * 1.0, np.roll(e[1], d // 3)])
        y = y + echo_mix / max(echo_fb, 1e-3) * e * echo_fb
    return y.astype(np.float32)
