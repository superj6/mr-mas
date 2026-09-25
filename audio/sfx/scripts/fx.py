"""Sound-design building blocks: modal hits, grains, whooshes, crackle, loopable noise."""
from __future__ import annotations

import math

import numpy as np
from scipy import signal

from dsp import (SR, n_of, t_axis, rng, stereo, mono, pan, pan_curve, fade, lowpass, highpass, bandpass,
                 sweep_filter, resonator, noise, env_exp, env_t60, curve, db, hz, sine, pad_to, mix,
                 modal, decorrelate, softclip, pulse, triangle, saw)

# ---------------------------------------------------------------------------- modal ratios
BAR = [1.0, 2.756, 5.404, 8.933]                 # free-free bar (marimba/glock-ish)
WOOD = [1.0, 2.13, 3.42, 4.95, 6.7]              # hollow wood block
PLASTIC = [1.0, 1.61, 2.37, 3.19, 4.28]          # keycap / mouse shell
STEEL = [1.0, 1.59, 2.14, 2.30, 2.65, 2.92, 3.16, 3.50, 4.15, 4.80]
GLASS = [1.0, 2.32, 3.97, 5.81, 7.9]
SMALLBELL = [1.0, 2.0, 2.76, 4.07, 5.40, 6.9, 8.93]


def excite(dur: float = 0.004, bright: float = 8000, seed: int = 0) -> np.ndarray:
    """Short noise-burst exciter (mallet/finger/contact)."""
    n = max(8, n_of(dur))
    x = rng(seed).standard_normal(n) * np.hanning(n)
    return lowpass(x, bright, 2)


def modal_hit(f0: float, ratios, t60, amps=None, dur: float = 1.0, exc_dur: float = 0.002,
              bright: float = 9000, seed: int = 0, detune: float = 0.0) -> np.ndarray:
    """Physical-ish modal hit: exciter convolved with a bank of decaying modes."""
    r = rng(seed)
    k = len(ratios)
    if np.isscalar(t60):
        t60 = [t60 / (1 + 0.6 * i) for i in range(k)]
    if amps is None:
        amps = [1.0 / (1 + i) ** 0.8 for i in range(k)]
    fr = [f0 * q * (1 + detune * r.uniform(-1, 1)) for q in ratios]
    y = modal(fr, t60, amps, dur, seed=seed)
    ex = excite(exc_dur, bright, seed)
    y = signal.fftconvolve(y, ex)[:n_of(dur)]
    y = fade(y, 0, min(0.08, dur * 0.25))  # never truncate a ringing mode abruptly
    return y / (np.abs(y).max() + 1e-12)


def click(freqs=(3200, 5100, 7400), t60=0.012, dur: float = 0.05, noise_amt: float = 0.35, seed: int = 0,
          bright: float = 12000) -> np.ndarray:
    n = n_of(dur)
    r = rng(seed)
    y = modal(list(freqs), [t60 * (1 - 0.15 * i) for i in range(len(freqs))],
              [1 / (1 + 0.5 * i) for i in range(len(freqs))], dur, seed=seed)
    ex = excite(0.0008, bright, seed)
    y = signal.fftconvolve(y, ex)[:n]
    nb = r.standard_normal(n) * env_exp(n, 0.0015)
    nb = highpass(nb, 2000, 2)
    y = y / (np.abs(y).max() + 1e-12) + noise_amt * nb / (np.abs(nb).max() + 1e-12)
    y = fade(y, 0, min(0.03, dur * 0.25))
    return y / (np.abs(y).max() + 1e-12)


def thump(f_start: float, f_end: float, dur: float, drop: float = 0.04, tau: float = 0.12) -> np.ndarray:
    n = n_of(dur)
    t = np.arange(n) / SR
    f = f_end + (f_start - f_end) * np.exp(-t / drop)
    y = np.sin(2 * math.pi * np.cumsum(f) / SR) * env_exp(n, tau, 0.0008)
    return fade(y, 0, min(0.12, dur * 0.3))


def noise_burst(dur: float, lo: float, hi: float, tau: float, attack: float = 0.0005, seed: int = 0,
                color: str = "white") -> np.ndarray:
    n = n_of(dur)
    x = noise(n, color, seed)
    x = bandpass(x, lo, hi, 2)
    return fade(x * env_exp(n, tau, attack), 0, min(0.05, dur * 0.25))


def whoosh(dur: float, f0: float, f1: float, q: float = 1.2, peak: float = 0.5, seed: int = 0,
           color: str = "pink", curve_kind: str = "exp") -> np.ndarray:
    """Band-limited noise with a moving resonant band and a swell envelope peaking at `peak` (0..1)."""
    n = n_of(dur)
    x = noise(n, color, seed)
    fc = curve(n, [(0, f0), (dur, f1)], "exp") if curve_kind == "exp" else np.linspace(f0, f1, n)
    y = sweep_filter(x, fc, q, "band")
    t = np.arange(n) / n
    e = np.where(t < peak, (t / peak) ** 2, np.exp(-((t - peak) / max(1e-3, (1 - peak))) * 4))
    return y * e


def crackle(dur: float, density: float, lo=1500, hi=7000, seed: int = 0, decay: float | None = None,
            amp_jitter: float = 0.8) -> np.ndarray:
    n = n_of(dur)
    r = rng(seed)
    x = np.zeros(n)
    rate = density / SR
    t = np.arange(n) / SR
    dens = np.full(n, rate) if decay is None else rate * np.exp(-t / decay)
    hits = r.random(n) < dens
    x[hits] = r.uniform(1 - amp_jitter, 1, hits.sum()) * r.choice([-1, 1], hits.sum())
    k = excite(0.0006, hi, seed)
    x = signal.fftconvolve(x, k)[:n]
    return bandpass(x, lo, hi, 2)


def grains(dur: float, notes_hz, count: int, glen=(0.012, 0.04), density_curve=None, seed: int = 0,
           pan_spread: float = 0.9, wave: str = "sine", glide: float = 0.0, amp_curve=None) -> np.ndarray:
    """Cloud of tiny tuned grains -> stereo."""
    n = n_of(dur)
    r = rng(seed)
    out = np.zeros((n, 2))
    if density_curve is None:
        times = r.uniform(0, dur, count)
    else:
        # inverse-CDF sampling on a density curve [(t, weight)]
        tt = np.linspace(0, dur, 512)
        w = np.interp(tt, [p[0] for p in density_curve], [p[1] for p in density_curve])
        cdf = np.cumsum(w) / w.sum()
        times = np.interp(r.random(count), cdf, tt)
    for i, t0 in enumerate(np.sort(times)):
        L = r.uniform(*glen)
        m = n_of(L)
        f = notes_hz[r.integers(len(notes_hz))]
        tt = np.arange(m) / SR
        fr = f * 2 ** (glide * tt / L / 12) if glide else np.full(m, f)
        ph = np.cumsum(fr) / SR + r.random()
        if wave == "sine":
            g = np.sin(2 * math.pi * ph)
        elif wave == "pulse":
            g = np.where(np.mod(ph, 1) < 0.25, 1.0, -1.0) * 0.5
        else:
            g = np.sin(2 * math.pi * ph) + 0.3 * np.sin(4 * math.pi * ph)
        g *= np.hanning(m) * r.uniform(0.4, 1.0)
        if amp_curve is not None:
            g *= float(np.interp(t0, [p[0] for p in amp_curve], [p[1] for p in amp_curve]))
        p = r.uniform(-pan_spread, pan_spread)
        s = n_of(t0)
        e = min(n, s + m)
        a = (p + 1) * math.pi / 4
        out[s:e, 0] += g[:e - s] * math.cos(a)
        out[s:e, 1] += g[:e - s] * math.sin(a)
    return out


def loop_noise(n: int, lo: float = 20, hi: float = 20000, tilt_db_per_oct: float = -3.0, seed: int = 0) -> np.ndarray:
    """Perfectly periodic (loopable) band-shaped noise via FFT synthesis."""
    r = rng(seed)
    F = np.fft.rfftfreq(n, 1 / SR)
    mag = np.zeros_like(F)
    m = (F >= lo) & (F <= hi)
    mag[m] = (np.maximum(F[m], 1) / 1000.0) ** (tilt_db_per_oct / 6.0206)
    # soft band edges
    edge = 0.3
    mag *= 1 / (1 + (lo / np.maximum(F, 1e-3)) ** 4) if lo > 20 else 1
    mag *= 1 / (1 + (np.maximum(F, 1e-3) / hi) ** 4)
    ph = r.uniform(0, 2 * math.pi, len(F))
    X = mag * np.exp(1j * ph)
    X[0] = 0
    y = np.fft.irfft(X, n)
    return y / (np.std(y) * 3 + 1e-12)


def loop_lfo(n: int, cycles: int, phase: float = 0.0) -> np.ndarray:
    """Sine LFO with an integer number of cycles over n samples (loop-safe)."""
    return np.sin(2 * math.pi * (cycles * np.arange(n) / n + phase))


def loop_tone(n: int, f: float, loop_s: float, phase: float = 0.0):
    """Tone with frequency snapped so it has integer cycles in the loop."""
    k = max(1, round(f * loop_s))
    return np.sin(2 * math.pi * (k * np.arange(n) / n + phase)), k / loop_s


def reverse_swell_of(x: np.ndarray, dur: float) -> np.ndarray:
    """Take a sound's first `dur` seconds, reverse it (so it swells into the end)."""
    seg = stereo(x)[:n_of(dur)]
    return fade(seg[::-1], 0.03, 0.002)


def freeze_texture(src: np.ndarray, dur: float, grain: float = 0.06, density: float = 120, seed: int = 0,
                   region=(0.0, 0.1)) -> np.ndarray:
    """'Time-stop' texture: grains scattered from a tiny region of a sound (spectral freeze-ish)."""
    src = mono(src)
    n = n_of(dur)
    r = rng(seed)
    out = np.zeros((n, 2))
    g = n_of(grain)
    w = np.hanning(g)
    a0, a1 = n_of(region[0]), max(n_of(region[1]) - g, n_of(region[0]) + 1)
    count = int(dur * density)
    for _ in range(count):
        s = r.integers(0, max(1, n - g))
        o = r.integers(a0, max(a0 + 1, a1))
        seg = src[o:o + g]
        if len(seg) < g:
            continue
        p = r.uniform(-0.8, 0.8)
        a = (p + 1) * math.pi / 4
        out[s:s + g, 0] += seg * w * math.cos(a)
        out[s:s + g, 1] += seg * w * math.sin(a)
    return out / max(1.0, math.sqrt(density * grain))


def time_varying_crush(x: np.ndarray, bits: np.ndarray, hold: np.ndarray, block: int = 256) -> np.ndarray:
    """Bit depth and sample-hold that change over time (for fidelity 'upgrades')."""
    x = mono(x)
    y = np.zeros_like(x)
    for s in range(0, len(x), block):
        seg = x[s:s + block]
        b = float(bits[min(s, len(bits) - 1)])
        h = max(1, int(hold[min(s, len(hold) - 1)]))
        idx = (np.arange(len(seg)) // h) * h
        seg = seg[idx]
        q = 2 ** (b - 1)
        y[s:s + block] = np.round(seg * q) / q if b < 16 else seg
    return y


def varispeed_curve(x: np.ndarray, rate: np.ndarray) -> np.ndarray:
    """Read x with a time-varying speed (1 = normal). len(rate) = output length."""
    x = stereo(x)
    pos = np.cumsum(rate)
    pos = pos[pos < len(x) - 1]
    i = np.floor(pos).astype(int)
    fr = (pos - i)[:, None]
    return x[i] * (1 - fr) + x[i + 1] * fr
