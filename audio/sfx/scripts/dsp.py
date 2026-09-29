"""MR. MAS SFX board: shared DSP toolkit (numpy/scipy/pedalboard).

Everything renders at 48 kHz float64 stereo arrays shaped (n, 2) unless noted.
Tuning: A4 = 440 Hz, equal temperament, the show key is F minor.
"""
from __future__ import annotations
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()

import functools
import math
import os
import subprocess
from fractions import Fraction

import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
FPS = 24
BPM = 96
BEAT = 60.0 / BPM          # 0.625 s
FRAME = 1.0 / FPS          # 0.041667 s
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))           # .../audio/sfx
AUDIO = os.path.dirname(ROOT)                                                # .../audio
SAMPLES = os.path.join(AUDIO, "samples")
VSCO = os.path.join(SAMPLES, "vsco2ce-sfx")
GUGS = os.path.join(SAMPLES, "generaluser-gs", "GeneralUser-GS.sf2")
FFMPEG_DIR = os.path.join(REPO, "studio/node_modules/@remotion/compositor-linux-x64-gnu")
FFMPEG = os.path.join(FFMPEG_DIR, "ffmpeg")

RNG = np.random.default_rng(1993)


def rng(seed: int) -> np.random.Generator:
    return np.random.default_rng(seed)


# ----------------------------------------------------------------------------- pitch
_NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def midi(name: str) -> int:
    """'F4' -> 65, 'Ab5' -> 80, 'C#3' -> 49, 'Db3' -> 49."""
    name = name.strip()
    pc = _NOTE[name[0].upper()]
    i = 1
    while i < len(name) and name[i] in "#b":
        pc += 1 if name[i] == "#" else -1
        i += 1
    octave = int(name[i:])
    return 12 * (octave + 1) + pc


def hz(n) -> float:
    if isinstance(n, str):
        n = midi(n)
    return 440.0 * 2 ** ((n - 69) / 12.0)


def note_name(m: float) -> str:
    names = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
    m = int(round(m))
    return f"{names[m % 12]}{m // 12 - 1}"


F_MINOR = [0, 2, 3, 5, 7, 8, 10]  # relative to F


def fminor(degree: int, octave: int = 4) -> int:
    """Scale degree (0 = F) in F natural minor -> midi."""
    o, d = divmod(degree, 7)
    return midi(f"F{octave}") + 12 * o + F_MINOR[d]


# ----------------------------------------------------------------------------- basics
def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(round(dur * SR))) / SR


def n_of(dur: float) -> int:
    return int(round(dur * SR))


def silence(dur: float, ch: int = 2) -> np.ndarray:
    return np.zeros((n_of(dur), ch)) if ch > 1 else np.zeros(n_of(dur))


def stereo(x: np.ndarray) -> np.ndarray:
    if x.ndim == 1:
        return np.stack([x, x], axis=1)
    return x


def mono(x: np.ndarray) -> np.ndarray:
    return x.mean(axis=1) if x.ndim == 2 else x


def pan(x: np.ndarray, p: float) -> np.ndarray:
    """Constant-power pan, p in [-1, 1]. Accepts mono or stereo (balance)."""
    a = (p + 1) * math.pi / 4
    gl, gr = math.cos(a) * math.sqrt(2), math.sin(a) * math.sqrt(2)
    if x.ndim == 1:
        return np.stack([x * gl, x * gr], axis=1) / math.sqrt(2) * 1.0
    return np.stack([x[:, 0] * gl, x[:, 1] * gr], axis=1) / math.sqrt(2) * 1.0


def pan_curve(x: np.ndarray, p: np.ndarray) -> np.ndarray:
    x = mono(x)
    a = (np.clip(p, -1, 1) + 1) * math.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def pad_to(x: np.ndarray, n: int) -> np.ndarray:
    if len(x) >= n:
        return x[:n]
    pad = [(0, n - len(x))] + [(0, 0)] * (x.ndim - 1)
    return np.pad(x, pad)


def mix(*parts, n: int | None = None) -> np.ndarray:
    """Sum (array) or (array, offset_seconds) or (array, offset, gain_db) items into stereo."""
    items = []
    for p in parts:
        if isinstance(p, tuple):
            arr = p[0]
            off = p[1] if len(p) > 1 else 0.0
            g = p[2] if len(p) > 2 else 0.0
        else:
            arr, off, g = p, 0.0, 0.0
        items.append((stereo(arr), n_of(off), db(g)))
    total = n or max(o + len(a) for a, o, _ in items)
    out = np.zeros((total, 2))
    for a, o, g in items:
        if o >= total:
            continue
        m = min(len(a), total - o)
        out[o:o + m] += a[:m] * g
    return out


def place(out: np.ndarray, x: np.ndarray, t: float, gain_db: float = 0.0):
    o = n_of(t)
    x = stereo(x)
    if o < 0:
        x = x[-o:]
        o = 0
    if o >= len(out):
        return
    m = min(len(x), len(out) - o)
    out[o:o + m] += x[:m] * db(gain_db)


def db(g: float) -> float:
    return 10 ** (g / 20.0)


def fade(x: np.ndarray, fin: float = 0.0, fout: float = 0.0, shape: str = "cos") -> np.ndarray:
    x = x.copy()
    n = len(x)
    for dur, is_in in ((fin, True), (fout, False)):
        k = min(n, n_of(dur))
        if k <= 0:
            continue
        r = np.linspace(0, 1, k)
        w = np.sin(r * math.pi / 2) ** 2 if shape == "cos" else r
        if x.ndim == 2:
            w = w[:, None]
        if is_in:
            x[:k] *= w
        else:
            x[n - k:] *= w[::-1]
    return x


def circular(fn, x: np.ndarray) -> np.ndarray:
    """Apply a (stateful) filter as if the loop repeated forever: process 3 copies, keep the middle."""
    n = len(x)
    reps = [x, x, x]
    y = fn(np.concatenate(reps, axis=0))
    return y[n:2 * n]


def wrap_tail(y: np.ndarray, n: int) -> np.ndarray:
    """Fold everything past n samples (reverb tails) back onto the loop start so it loops seamlessly."""
    out = y[:n].copy()
    k = n
    while k < len(y):
        seg = y[k:k + n]
        out[:len(seg)] += seg
        k += n
    return out


def trim_silence(x: np.ndarray, thresh_db: float = -60, pre: float = 0.002) -> np.ndarray:
    a = np.abs(mono(x))
    th = a.max() * db(thresh_db) if a.max() > 0 else 0
    idx = np.nonzero(a > th)[0]
    if len(idx) == 0:
        return x
    s = max(0, idx[0] - n_of(pre))
    return x[s:]


def trim_tail(x: np.ndarray, thresh_db: float = -70, keep: float = 0.02) -> np.ndarray:
    a = np.abs(mono(x))
    if a.max() == 0:
        return x
    th = a.max() * db(thresh_db)
    idx = np.nonzero(a > th)[0]
    e = min(len(x), idx[-1] + n_of(keep))
    return fade(x[:e], 0, min(keep, 0.01))


# ----------------------------------------------------------------------------- envelopes
def env_adsr(n: int, a: float, d: float, s: float, r: float, hold: float | None = None) -> np.ndarray:
    A, D, R = n_of(a), n_of(d), n_of(r)
    H = n - A - D - R if hold is None else n_of(hold)
    H = max(0, H)
    e = np.concatenate([
        np.linspace(0, 1, A, endpoint=False) if A else [],
        1 - (1 - s) * (1 - np.exp(-5 * np.linspace(0, 1, D))) / (1 - np.exp(-5)) if D else [],
        np.full(H, s),
        s * np.exp(-6.9 * np.linspace(0, 1, R)) if R else [],
    ])
    return pad_to(e, n)


def env_exp(n: int, tau: float, attack: float = 0.001) -> np.ndarray:
    t = np.arange(n) / SR
    e = np.exp(-t / max(tau, 1e-5))
    A = n_of(attack)
    if A > 1:
        e[:A] *= np.linspace(0, 1, A) ** 1.5
    return e


def env_t60(n: int, t60: float, attack: float = 0.0005) -> np.ndarray:
    return env_exp(n, t60 / 6.9078, attack)


def curve(n: int, pts: list[tuple[float, float]], kind: str = "lin") -> np.ndarray:
    """Breakpoint curve: pts = [(time_s, value), ...]."""
    t = np.arange(n) / SR
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    if kind == "exp":
        ys = np.log(np.maximum(ys, 1e-9))
        return np.exp(np.interp(t, xs, ys))
    return np.interp(t, xs, ys)


# ----------------------------------------------------------------------------- oscillators
def phase_from_freq(freq, n: int | None = None) -> np.ndarray:
    if np.isscalar(freq):
        freq = np.full(n, float(freq))
    return np.cumsum(freq) / SR


def sine(freq, dur: float | None = None, n: int | None = None, phase0: float = 0.0) -> np.ndarray:
    n = n if n is not None else (n_of(dur) if dur is not None else len(freq))
    ph = phase_from_freq(freq, n) + phase0
    return np.sin(2 * math.pi * ph)


def _polyblep(t, dt):
    y = np.zeros_like(t)
    m = t < dt
    x = t[m] / dt[m]
    y[m] = x + x - x * x - 1.0
    m2 = t > 1 - dt
    x = (t[m2] - 1.0) / dt[m2]
    y[m2] = x * x + x + x + 1.0
    return y


def saw(freq, n: int) -> np.ndarray:
    if np.isscalar(freq):
        freq = np.full(n, float(freq))
    dt = np.clip(freq / SR, 1e-9, 0.5)
    ph = np.mod(np.cumsum(freq) / SR, 1.0)
    return 2 * ph - 1 - _polyblep(ph, dt)


def pulse(freq, n: int, duty=0.5, naive: bool = False) -> np.ndarray:
    if np.isscalar(freq):
        freq = np.full(n, float(freq))
    if np.isscalar(duty):
        duty = np.full(n, float(duty))
    dt = np.clip(freq / SR, 1e-9, 0.5)
    ph = np.mod(np.cumsum(freq) / SR, 1.0)
    y = np.where(ph < duty, 1.0, -1.0)
    if naive:
        return y
    y = y + _polyblep(ph, dt)
    ph2 = np.mod(ph - duty + 1.0, 1.0)
    y = y - _polyblep(ph2, dt)
    return y


def triangle(freq, n: int) -> np.ndarray:
    if np.isscalar(freq):
        freq = np.full(n, float(freq))
    ph = np.mod(np.cumsum(freq) / SR, 1.0)
    return 1 - 4 * np.abs(ph - 0.5)


def nes_triangle(freq, n: int) -> np.ndarray:
    """4-bit stepped triangle (32 steps), lightly smoothed so it reads as 8-bit but not harsh."""
    if np.isscalar(freq):
        freq = np.full(n, float(freq))
    ph = np.mod(np.cumsum(freq) / SR, 1.0)
    step = np.floor(ph * 32)
    tri = np.where(step < 16, 15 - step, step - 16) / 7.5 - 1.0
    return lowpass(tri, 9000, 2)


def lfsr_noise(n: int, clock_hz: float = 16000.0, short: bool = False, seed: int = 1) -> np.ndarray:
    """NES-style 15-bit LFSR noise sampled at clock_hz, held between clocks."""
    steps = int(n * clock_hz / SR) + 2
    reg = seed & 0x7FFF or 1
    tap = 6 if short else 1
    out = np.empty(steps)
    for i in range(steps):
        fb = (reg & 1) ^ ((reg >> tap) & 1)
        reg = (reg >> 1) | (fb << 14)
        out[i] = 1.0 if (reg & 1) else -1.0
    idx = np.minimum((np.arange(n) * clock_hz / SR).astype(int), steps - 1)
    return out[idx]


def noise(n: int, color: str = "white", seed: int = 0) -> np.ndarray:
    r = rng(seed)
    w = r.standard_normal(n)
    if color == "white":
        return w / 3
    if color == "pink":
        # Paul Kellet-ish via filtering
        b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
        a = [1, -2.494956002, 2.017265875, -0.522189400]
        p = signal.lfilter(b, a, w)
        return p / (np.std(p) * 3 + 1e-12)
    if color == "brown":
        p = np.cumsum(w)
        p = signal.lfilter([1, -1], [1, -0.995], p)
        return p / (np.std(p) * 3 + 1e-12)
    raise ValueError(color)


def chip_env(n: int, levels: list[float] | np.ndarray, rate: float = 60.0) -> np.ndarray:
    """Envelope stepped at a 60 Hz 'frame' rate and quantized to 16 volume levels."""
    lv = np.round(np.asarray(levels, float) * 15) / 15
    idx = np.minimum((np.arange(n) * rate / SR).astype(int), len(lv) - 1)
    e = lv[idx]
    return lowpass(e, 400, 1)  # de-click steps slightly


def quantize_pitch_60hz(freq: np.ndarray) -> np.ndarray:
    """Hold pitch updates to a 60 Hz frame clock (8-bit style sweeps)."""
    n = len(freq)
    k = SR // 60
    idx = (np.arange(n) // k) * k
    return freq[np.minimum(idx, n - 1)]


# ----------------------------------------------------------------------------- filters
def _sos(kind: str, f, order: int = 2):
    nyq = SR / 2
    if isinstance(f, (list, tuple)):
        wn = [min(max(x / nyq, 1e-5), 0.999) for x in f]
    else:
        wn = min(max(f / nyq, 1e-5), 0.999)
    return signal.butter(order, wn, btype=kind, output="sos")


def _apply(x: np.ndarray, sos) -> np.ndarray:
    return signal.sosfilt(sos, x, axis=0)


def lowpass(x, f, order=2):
    return _apply(x, _sos("low", f, order))


def highpass(x, f, order=2):
    return _apply(x, _sos("high", f, order))


def bandpass(x, lo, hi, order=2):
    return _apply(x, _sos("band", [lo, hi], order))


def biquad_peak(x, f, gain_db, q=1.0):
    A = 10 ** (gain_db / 40)
    w0 = 2 * math.pi * f / SR
    al = math.sin(w0) / (2 * q)
    b = [1 + al * A, -2 * math.cos(w0), 1 - al * A]
    a = [1 + al / A, -2 * math.cos(w0), 1 - al / A]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def shelf(x, f, gain_db, high=True, q=0.707):
    A = 10 ** (gain_db / 40)
    w0 = 2 * math.pi * f / SR
    c, s = math.cos(w0), math.sin(w0)
    al = s / (2 * q)
    sa = 2 * math.sqrt(A) * al
    if high:
        b = [A * ((A + 1) + (A - 1) * c + sa), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sa)]
        a = [(A + 1) - (A - 1) * c + sa, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sa]
    else:
        b = [A * ((A + 1) - (A - 1) * c + sa), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sa)]
        a = [(A + 1) + (A - 1) * c + sa, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sa]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def resonator(x, f, q):
    """2-pole resonant bandpass (constant 0 dB peak)."""
    w0 = 2 * math.pi * f / SR
    al = math.sin(w0) / (2 * q)
    b = [al, 0, -al]
    a = [1 + al, -2 * math.cos(w0), 1 - al]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def sweep_filter(x: np.ndarray, fc: np.ndarray, q: float = 0.707, kind: str = "low", block: int = 64) -> np.ndarray:
    """Time-varying biquad (RBJ) processed in small blocks with state carry-over. x mono."""
    x = np.asarray(x, float)
    y = np.zeros_like(x)
    zi = np.zeros(2)
    for s in range(0, len(x), block):
        f = float(np.clip(fc[min(s + block // 2, len(fc) - 1)], 20, SR * 0.45))
        w0 = 2 * math.pi * f / SR
        c, al = math.cos(w0), math.sin(w0) / (2 * q)
        if kind == "low":
            b = [(1 - c) / 2, 1 - c, (1 - c) / 2]
        elif kind == "high":
            b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
        else:  # band, 0 dB peak
            b = [al, 0, -al]
        a = [1 + al, -2 * c, 1 - al]
        b = np.array(b) / a[0]
        a = np.array(a) / a[0]
        seg, zi = signal.lfilter(b, a, x[s:s + block], zi=zi)
        y[s:s + block] = seg
    return y


def comb(x: np.ndarray, f: float, fb: float = 0.7) -> np.ndarray:
    """Feedback comb tuned to f (integer delay, then fine by nothing — good to ~1 cent above 200 Hz)."""
    d = max(1, int(round(SR / f)))
    a = np.zeros(d + 1)
    a[0] = 1
    a[d] = -fb
    return signal.lfilter([1 - fb], a, x, axis=0)


# ----------------------------------------------------------------------------- synthesis helpers
def modal(freqs, t60s, amps, dur: float, strike: np.ndarray | None = None, seed: int = 0) -> np.ndarray:
    """Sum of exponentially decaying sines (bells, woods, metal)."""
    n = n_of(dur)
    t = np.arange(n) / SR
    r = rng(seed)
    y = np.zeros(n)
    for f, t60, a in zip(freqs, t60s, amps):
        if f >= SR / 2 * 0.95:
            continue
        y += a * np.sin(2 * math.pi * f * t + r.uniform(0, 2 * math.pi)) * np.exp(-6.9078 * t / t60)
    if strike is not None:
        y = signal.fftconvolve(y, strike)[:n]
    return y


def karplus(freq: float, dur: float, damp: float = 0.5, bright: float = 0.5, seed: int = 0,
            pluck_pos: float = 0.2) -> np.ndarray:
    """Karplus-Strong via lfilter, tuned exactly by resampling afterwards."""
    base = 1000.0 if freq < 60 else freq
    N = int(SR / base)
    fo = SR / (N + 0.5)  # actual pitch of the loop with 2-point average
    n = n_of(dur * (fo / freq)) + 16
    r = rng(seed)
    exc = r.uniform(-1, 1, N)
    exc = lowpass(exc, 800 + 12000 * bright, 1)
    # pluck-position comb on the excitation
    k = max(1, int(N * pluck_pos))
    exc = exc - np.concatenate([np.zeros(k), exc[:-k]])
    x = np.zeros(n)
    x[:N] = exc
    g = 0.5 * (0.990 + 0.0099 * (1 - damp))
    a = np.zeros(N + 2)
    a[0] = 1
    a[N] = -g
    a[N + 1] = -g
    y = signal.lfilter([1.0], a, x)
    y = varispeed(y, freq / fo)
    return pad_to(y, n_of(dur))


def varispeed(x: np.ndarray, ratio: float, max_den: int = 400) -> np.ndarray:
    """Play back `ratio` times faster (pitch * ratio, length / ratio)."""
    if abs(ratio - 1) < 1e-6:
        return x
    fr = Fraction(1 / ratio).limit_denominator(max_den)
    return signal.resample_poly(x, fr.numerator, fr.denominator, axis=0)


def resample_sr(x: np.ndarray, sr_in: int, sr_out: int = SR) -> np.ndarray:
    if sr_in == sr_out:
        return x
    g = math.gcd(sr_in, sr_out)
    return signal.resample_poly(x, sr_out // g, sr_in // g, axis=0)


def softclip(x, drive: float = 1.0):
    return np.tanh(x * drive) / np.tanh(drive)


def bitcrush(x, bits: float = 8, down: int = 1):
    y = x
    if down > 1:
        idx = (np.arange(len(x)) // down) * down
        y = x[idx]
    q = 2 ** (bits - 1)
    return np.round(y * q) / q


# ----------------------------------------------------------------------------- reverb (synthetic IRs)
@functools.lru_cache(maxsize=32)
def make_ir(kind: str = "room", seed: int = 7) -> np.ndarray:
    """Stereo synthetic impulse responses: room / studio / hall / cathedral / plate / spring."""
    spec = {
        #            rt60 lo, mid, hi, predelay, er_count, er_spread, width
        "booth":     (0.18, 0.15, 0.08, 0.002, 6, 0.012, 0.6),
        "room":      (0.45, 0.38, 0.22, 0.004, 10, 0.025, 0.8),
        "studio":    (0.70, 0.60, 0.35, 0.008, 12, 0.03, 0.9),
        "hall":      (2.2, 1.9, 1.1, 0.020, 16, 0.06, 1.0),
        "cathedral": (5.5, 4.5, 2.4, 0.035, 20, 0.09, 1.0),
        "plate":     (1.6, 1.8, 1.4, 0.001, 0, 0.0, 1.0),
    }[kind]
    lo, mid, hi, pre, n_er, er_spread, width = spec
    L = n_of(max(lo, mid, hi) * 1.3 + pre + 0.05)
    t = np.arange(L) / SR
    r = rng(seed)
    out = np.zeros((L, 2))
    for ch in range(2):
        w = r.standard_normal(L)
        bands = [
            (lowpass(w, 300, 2), lo),
            (bandpass(w, 300, 3500, 2), mid),
            (highpass(w, 3500, 2), hi),
        ]
        tail = sum(b * np.exp(-6.9078 * t / rt) for b, rt in bands)
        # smooth onset (diffusion build-up)
        build = 1 - np.exp(-t / (0.012 if kind != "plate" else 0.002))
        tail *= build
        er = np.zeros(L)
        for _ in range(n_er):
            k = n_of(pre + r.uniform(0.001, er_spread))
            if k < L:
                er[k] += r.uniform(0.3, 0.9) * r.choice([-1, 1]) * math.exp(-k / SR / (mid / 3))
        er = lowpass(er, 6000, 1)
        sig = np.concatenate([np.zeros(n_of(pre)), tail])[:L] * 0.6 + er
        out[:, ch] = sig
    m = out.mean(axis=1, keepdims=True)
    s = out - m
    out = m + s * width
    out /= np.sqrt((out ** 2).sum() / 2)
    return out


def reverb(x: np.ndarray, kind: str = "room", wet: float = 0.25, dry: float = 1.0,
           hp: float = 150, lp: float = 9000, predelay: float = 0.0, tail: float | None = None) -> np.ndarray:
    x = stereo(x)
    ir = make_ir(kind)
    xin = highpass(x, hp, 2) if hp else x
    xin = lowpass(xin, lp, 2) if lp else xin
    L = len(x) + len(ir) if tail is None else len(x) + n_of(tail)
    wetsig = np.zeros((len(x) + len(ir) - 1, 2))
    wetsig[:, 0] = signal.fftconvolve(xin[:, 0], ir[:, 0])
    wetsig[:, 1] = signal.fftconvolve(xin[:, 1], ir[:, 1])
    if predelay:
        wetsig = np.concatenate([np.zeros((n_of(predelay), 2)), wetsig])
    out = np.zeros((max(L, len(x)), 2))
    out[:len(x)] += x * dry
    m = min(len(out), len(wetsig))
    out[:m] += wetsig[:m] * wet
    return out


def haas_widen(x: np.ndarray, ms: float = 8.0, amount: float = 0.5) -> np.ndarray:
    x = stereo(x)
    d = n_of(ms / 1000)
    m = x.mean(axis=1)
    s = np.concatenate([np.zeros(d), m])[:len(m)] - m
    s = highpass(s, 300, 1)
    return np.stack([m + s * amount, m - s * amount], axis=1) * 0.5 + x * 0.5


def decorrelate(x_mono: np.ndarray, seed: int = 3, amount: float = 1.0) -> np.ndarray:
    """Stereo spread through short random allpass-ish FIRs."""
    r = rng(seed)
    out = []
    for ch in range(2):
        k = r.standard_normal(n_of(0.004)) * np.exp(-np.linspace(0, 5, n_of(0.004)))
        k[0] += 3.0
        k /= np.sqrt((k ** 2).sum())
        out.append(signal.fftconvolve(x_mono, k)[:len(x_mono)])
    y = np.stack(out, axis=1)
    return stereo(x_mono) * (1 - amount) + y * amount


# ----------------------------------------------------------------------------- pedalboard wrappers
def pb(x: np.ndarray, *plugins) -> np.ndarray:
    from pedalboard import Pedalboard
    board = Pedalboard(list(plugins))
    y = board(stereo(x).T.astype(np.float32), SR)
    return y.T.astype(np.float64)


def compress(x, thresh=-18, ratio=3, attack=5, release=80, makeup=0):
    from pedalboard import Compressor, Gain
    return pb(x, Compressor(threshold_db=thresh, ratio=ratio, attack_ms=attack, release_ms=release), Gain(makeup))


# ----------------------------------------------------------------------------- samples
def pitch_detect(x: np.ndarray, fmin: float = 30, fmax: float = 2000, start: float = 0.08, win: float = 0.25) -> float:
    """YIN-style fundamental estimate on a steady segment."""
    x = mono(x)
    s = n_of(start)
    seg = x[s:s + n_of(win)]
    if len(seg) < n_of(0.05):
        seg = x[:n_of(win)]
    seg = seg - seg.mean()
    W = len(seg) // 2
    tmin, tmax = int(SR / fmax), min(int(SR / fmin), W - 1)
    d = np.array([np.sum((seg[:W] - seg[tau:tau + W]) ** 2) for tau in range(tmax + 1)])
    cmnd = np.ones_like(d)
    cs = np.cumsum(d[1:])
    cmnd[1:] = d[1:] * np.arange(1, len(d)) / np.maximum(cs, 1e-12)
    tau = None
    for k in range(tmin, tmax):
        if cmnd[k] < 0.15 and cmnd[k] <= cmnd[k + 1]:
            tau = k
            break
    if tau is None:
        tau = tmin + int(np.argmin(cmnd[tmin:tmax]))
    if 1 <= tau < len(cmnd) - 1:
        a, b, c = cmnd[tau - 1], cmnd[tau], cmnd[tau + 1]
        den = a - 2 * b + c
        shift = 0.5 * (a - c) / den if den != 0 else 0
        tau = tau + shift
    return SR / tau


@functools.lru_cache(maxsize=512)
def _load(path: str) -> np.ndarray:
    x, sr = sf.read(path, always_2d=True)
    x = x.astype(np.float64)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return resample_sr(x[:, :2], sr, SR)


def load(rel: str, trim: bool = True) -> np.ndarray:
    p = rel if os.path.isabs(rel) else os.path.join(VSCO, rel)
    x = _load(p).copy()
    return trim_silence(x, -50) if trim else x


def sample_at(rel: str, target, src=None, fmin=30, fmax=2000, trim=True) -> np.ndarray:
    """Load a VSCO sample and repitch it (varispeed) to `target` (name/midi/Hz)."""
    x = load(rel, trim)
    f_t = target if isinstance(target, float) else hz(target)
    if src is None:
        f_s = pitch_detect(x, fmin, fmax)
    else:
        f_s = src if isinstance(src, float) else hz(src)
    return varispeed(x, f_t / f_s)


# ----------------------------------------------------------------------------- SoundFont
@functools.lru_cache(maxsize=1)
def _synth():
    import tinysoundfont
    s = tinysoundfont.Synth(samplerate=SR, gain=-3)
    sfid = s.sfload(GUGS)
    return s, sfid


def sf_notes(program: int, notes: list[tuple[float, int, int, float]], dur: float, bank: int = 0,
             drums: bool = False, bend: list[tuple[float, float]] | None = None) -> np.ndarray:
    """Render GeneralUser GS notes: [(t_on, midi, vel, len)]. Returns stereo."""
    s, sfid = _synth()
    s.notes_off()
    s.sounds_off()
    s.program_select(0, sfid, bank, program, drums)
    events = []
    for t0, m, v, ln in notes:
        events.append((t0, 1, m, v))
        events.append((t0 + ln, 0, m, 0))
    events.sort()
    total = n_of(dur)
    out = np.zeros((total, 2), dtype=np.float32)
    pos = 0
    ei = 0
    while pos < total:
        nxt = total
        if ei < len(events):
            nxt = min(total, n_of(events[ei][0]))
        if nxt > pos:
            buf = s.generate(nxt - pos)
            a = np.frombuffer(buf, dtype=np.float32).reshape(-1, 2)
            out[pos:nxt] = a
            pos = nxt
        while ei < len(events) and n_of(events[ei][0]) <= pos:
            _, on, m, v = events[ei]
            if on:
                s.noteon(0, m, v)
            else:
                s.noteoff(0, m)
            ei += 1
        if ei >= len(events) and pos >= total:
            break
    s.notes_off()
    s.sounds_off()
    s.generate(2048)
    return out.astype(np.float64)


# ----------------------------------------------------------------------------- loudness
def _kweight(x: np.ndarray) -> np.ndarray:
    """ITU-R BS.1770-4 K-weighting, official 48 kHz coefficients."""
    assert SR == 48000
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    return signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=0), axis=0)


def _blocks(x: np.ndarray, block: float = 0.4, step: float = 0.1) -> np.ndarray:
    x = stereo(x)
    if len(x) < n_of(block):
        x = pad_to(x, n_of(block))
    y = _kweight(x) ** 2
    B, S = n_of(block), n_of(step)
    cs = np.concatenate([np.zeros((1, 2)), np.cumsum(y, axis=0)])
    starts = np.arange(0, len(x) - B + 1, S)
    z = (cs[starts + B] - cs[starts]) / B
    return z.sum(axis=1)


def lufs_integrated(x: np.ndarray) -> float:
    z = _blocks(x)
    l = -0.691 + 10 * np.log10(np.maximum(z, 1e-20))
    g = z[l > -70]
    if len(g) == 0:
        return -99.0
    rel = -0.691 + 10 * np.log10(g.mean()) - 10
    g2 = z[(l > -70) & (l > rel)]
    return float(-0.691 + 10 * np.log10(g2.mean()))


def lufs_momentary_max(x: np.ndarray) -> float:
    z = _blocks(x, 0.4, 0.01)
    return float(-0.691 + 10 * np.log10(max(z.max(), 1e-20)))


def true_peak_db(x: np.ndarray) -> float:
    x = stereo(x)
    y = signal.resample_poly(x, 4, 1, axis=0)
    return float(20 * np.log10(max(np.abs(y).max(), 1e-12)))


def normalize(x: np.ndarray, target_lufs: float = -14.0, tp_ceiling: float = -1.0, mode: str = "auto"):
    """Gain to target loudness, clamped so true peak <= ceiling. mode: integrated|momentary|auto."""
    x = stereo(x)
    dur = len(x) / SR
    if mode == "auto":
        mode = "integrated" if dur >= 2.0 else "momentary"
    L = lufs_integrated(x) if mode == "integrated" else lufs_momentary_max(x)
    g = target_lufs - L
    tp = true_peak_db(x)
    g = min(g, tp_ceiling - tp)
    y = x * db(g)
    return y, {"gainDb": round(g, 2), "mode": mode}


def measure(x: np.ndarray) -> dict:
    return {
        "lufsIntegrated": round(lufs_integrated(x), 1),
        "lufsMomentaryMax": round(lufs_momentary_max(x), 1),
        "truePeakDb": round(true_peak_db(x), 2),
    }


# ----------------------------------------------------------------------------- IO
def write_wav(path: str, x: np.ndarray):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, np.clip(stereo(x), -1, 1).astype(np.float32), SR, subtype="PCM_24")


def write_mp3(wav_path: str, mp3_path: str, kbps: int = 256):
    os.makedirs(os.path.dirname(mp3_path), exist_ok=True)
    env = dict(os.environ, LD_LIBRARY_PATH=FFMPEG_DIR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", wav_path, "-codec:a", "libmp3lame",
                    "-b:a", f"{kbps}k", "-id3v2_version", "3", mp3_path], check=True, env=env)
