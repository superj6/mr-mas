"""Timing grid + shared DSP helpers for "The Knee (Main Title)".

Everything in the score is expressed in FRAMES (24 fps) so it lines up with
beats.json / the Remotion edit:  96 BPM -> 15 frames per beat, 60 per bar,
720 frames = 30.000 s.  At 48 kHz one frame is exactly 2000 samples.
"""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass, field
from scipy import signal

SR = 48000
FPS = 24
BPM = 96
FPB = 15                  # frames per beat
FPBAR = 60                # frames per bar
SPF = SR // FPS           # 2000 samples per frame
TOTAL_FRAMES = 720
N = TOTAL_FRAMES * SPF    # 1_440_000 samples = 30.000 s
SWING_OFF = 10.0          # swung 2nd eighth lands 10 frames after the beat
STRAIGHT_OFF = 7.5


def fr(bar: int, beat: float = 1.0, off: float = 0.0) -> float:
    """Frame of bar (1-based) / beat (1-based, may be fractional) + extra frames."""
    return (bar - 1) * FPBAR + (beat - 1.0) * FPB + off


def eighth(bar: int, beat: int, second: bool, swing: float = 1.0) -> float:
    """Frame of an eighth note.  swing=1 -> 10 frames (triplet swing), 0 -> 7.5 straight."""
    base = fr(bar, beat)
    if not second:
        return base
    return base + STRAIGHT_OFF + (SWING_OFF - STRAIGHT_OFF) * swing


def f2s(frames: float) -> float:
    return frames / FPS


def f2n(frames: float) -> int:
    return int(round(frames * SPF))


def s2n(sec: float) -> int:
    return int(round(sec * SR))


def midi_hz(m: float) -> float:
    return 440.0 * 2.0 ** ((m - 69.0) / 12.0)


NOTE_NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def nm(name: str) -> int:
    """'F5' -> 77, 'Ab3' -> 56, 'C#4' -> 61, 'Bb1' -> 34 (scientific, C4 = 60)."""
    name = name.strip()
    pc = NOTE_NAMES[name[0].upper()]
    i = 1
    while i < len(name) and name[i] in '#b':
        pc += 1 if name[i] == '#' else -1
        i += 1
    octv = int(name[i:])
    return 12 * (octv + 1) + pc


def chord(*names: str) -> list[int]:
    return [nm(n) for n in names]


@dataclass
class Note:
    inst: str
    pitch: float
    start: float            # frames
    dur: float              # frames
    vel: float = 0.7        # 0..1
    lock: bool = False      # True -> no timing humanisation (cue hits)
    x: dict = field(default_factory=dict)   # instrument specific extras


# ----------------------------------------------------------------- DSP helpers

def to_stereo(x: np.ndarray) -> np.ndarray:
    if x.ndim == 1:
        return np.stack([x, x], 0)
    if x.shape[0] == 2:
        return x
    if x.shape[1] == 2:
        return x.T.copy()
    if x.shape[0] == 1:
        return np.repeat(x, 2, 0)
    return x[:2]


def pan_gains(p: float) -> tuple[float, float]:
    """Constant-power pan, p in -1..1."""
    a = (p + 1) * np.pi / 4
    return float(np.cos(a) * np.sqrt(2)), float(np.sin(a) * np.sqrt(2))


def apply_pan(x: np.ndarray, p: float, width: float = 1.0) -> np.ndarray:
    x = to_stereo(x)
    if width != 1.0:
        m = 0.5 * (x[0] + x[1]); s = 0.5 * (x[0] - x[1]) * width
        x = np.stack([m + s, m - s])
    gl, gr = pan_gains(p)
    return np.stack([x[0] * gl, x[1] * gr])


def db(x: float) -> float:
    return 10 ** (x / 20.0)


def sos_filter(x, sos):
    return signal.sosfilt(sos, x, axis=-1)


def lp(x, fc, order=2, sr=SR):
    fc = min(fc, sr * 0.45)
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=sr, output='sos'), x, axis=-1)


def hp(x, fc, order=2, sr=SR):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=sr, output='sos'), x, axis=-1)


def bp(x, f1, f2, order=2, sr=SR):
    f2 = min(f2, sr * 0.45)
    return signal.sosfilt(signal.butter(order, [f1, f2], 'band', fs=sr, output='sos'), x, axis=-1)


def _biquad(b, a):
    return np.array([[b[0] / a[0], b[1] / a[0], b[2] / a[0], 1.0, a[1] / a[0], a[2] / a[0]]])


def peq(x, f0, gain_db, q=1.0, sr=SR):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / sr; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return signal.sosfilt(_biquad(b, a), x, axis=-1)


def shelf(x, f0, gain_db, high=True, sr=SR, s=0.8):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / sr
    al = np.sin(w) / 2 * np.sqrt((A + 1 / A) * (1 / s - 1) + 2); c = np.cos(w)
    if high:
        b = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * c),
             A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
        a = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * c),
             (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    else:
        b = [A * ((A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al), 2 * A * ((A - 1) - (A + 1) * c),
             A * ((A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al)]
        a = [(A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al, -2 * ((A - 1) + (A + 1) * c),
             (A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al]
    return signal.sosfilt(_biquad(b, a), x, axis=-1)


def env_curve(points: list[tuple[float, float]], n: int = N, unit: str = 'frames') -> np.ndarray:
    """Piecewise-linear gain curve from (time, value) points (time in frames by default)."""
    t = np.arange(n)
    xs = [f2n(p[0]) if unit == 'frames' else s2n(p[0]) for p in points]
    ys = [p[1] for p in points]
    return np.interp(t, xs, ys).astype(np.float32)


def fade(n: int, kind: str = 'cos') -> np.ndarray:
    t = np.linspace(0, 1, max(n, 1), endpoint=True)
    if kind == 'cos':
        return (0.5 - 0.5 * np.cos(np.pi * t)).astype(np.float32)
    return t.astype(np.float32)


def add_at(buf: np.ndarray, x: np.ndarray, start: int):
    """Mix stereo x into stereo buf at sample offset start (clipped to buffer)."""
    if start >= buf.shape[1]:
        return
    s0 = max(start, 0)
    x0 = s0 - start
    n = min(x.shape[1] - x0, buf.shape[1] - s0)
    if n > 0:
        buf[:, s0:s0 + n] += x[:, x0:x0 + n]


def soft_sat(x, drive=1.0):
    """Gentle tape-ish saturation, unity small-signal gain."""
    if drive <= 0:
        return x
    return np.tanh(x * drive) / drive


def tape(x, drive=1.2, wow_cents=0.0, wow_hz=0.7, flutter_cents=0.0, hiss_db=-90.0, seed=0, lp_hz=None):
    """Tape colour: wow/flutter (variable delay), saturation, head bump, optional LP and hiss."""
    x = to_stereo(x).astype(np.float64)
    n = x.shape[1]
    if wow_cents or flutter_cents:
        rng = np.random.default_rng(seed)
        t = np.arange(n) / SR
        wob = wow_cents * np.sin(2 * np.pi * wow_hz * t + rng.uniform(0, 6.28))
        wob += 0.5 * wow_cents * np.sin(2 * np.pi * wow_hz * 1.73 * t + rng.uniform(0, 6.28))
        fl = rng.standard_normal(n // 200 + 2)
        fl = np.interp(np.arange(n), np.arange(len(fl)) * 200, fl)
        fl = lp(fl, 12.0, 1) * flutter_cents * 8
        ratio = 2 ** ((wob + fl) / 1200.0)
        pos = np.cumsum(ratio) - ratio[0]
        pos = pos - (pos[-1] - (n - 1)) * np.linspace(0, 1, n)  # keep length/sync
        idx = np.clip(pos, 0, n - 1)
        x = np.stack([np.interp(idx, np.arange(n), ch) for ch in x])
    x = soft_sat(x, drive)
    x = peq(x, 90, 1.2, 0.8)
    if lp_hz:
        x = lp(x, lp_hz, 2)
    if hiss_db > -89:
        rng = np.random.default_rng(seed + 7)
        h = rng.standard_normal(x.shape) * db(hiss_db)
        x = x + hp(lp(h, 9000, 1), 1500, 1)
    return x.astype(np.float32)


def bitcrush(x, bits=8, rate=None):
    x = to_stereo(x)
    if rate:
        step = SR / rate
        idx = (np.floor(np.arange(x.shape[1]) / step) * step).astype(int)
        x = x[:, np.clip(idx, 0, x.shape[1] - 1)]
    q = 2 ** (bits - 1)
    return (np.round(x * q) / q).astype(np.float32)
