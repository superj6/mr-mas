"""Shared constants, the Note record and DSP helpers for the MR. MAS OST engine.

Generalised from audio/theme/engine/core.py (the locked main-title engine).  The one
big change: there is no fixed length or tempo here any more.  Every Note time is in
SECONDS; bars / beats / 24 fps frames live in grid.Grid, which turns musical
positions into seconds (tempo ramps, meter changes and swing included).

At 48 kHz one 24 fps frame is exactly 2000 samples, so frame-accurate hits are
sample-accurate too.
"""
from __future__ import annotations

import zlib
from dataclasses import dataclass, field

import numpy as np
from scipy import signal

SR = 48000
FPS = 24
SPF = SR // FPS           # 2000 samples per frame

# the ten stem families every OST track exports (a track may leave some silent)
FAMILIES = ['piano', 'strings', 'winds', 'brass', 'bass', 'drums', 'perc', 'chip', 'synth', 'fx']


# ----------------------------------------------------------------- time units
def s2n(sec: float) -> int:
    """seconds -> samples.  Half-samples always round UP (grid points often fall exactly on .5 samples, e.g.
    a 16th at 84.09 BPM is 8562.5 samples; float noise must not round the same note differently in two
    loop passes)."""
    return int(np.floor(sec * SR + 0.5 + 1e-6))


def n2s(n: int) -> float:
    return n / SR


def f2s(frames: float) -> float:
    """24 fps frames -> seconds"""
    return frames / FPS


def s2f(sec: float) -> float:
    """seconds -> 24 fps frames (float)"""
    return sec * FPS


def f2n(frames: float) -> int:
    return int(np.floor(frames * SPF + 0.5 + 1e-6))


# ----------------------------------------------------------------- pitch
NOTE_NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


def midi_hz(m: float) -> float:
    return 440.0 * 2.0 ** ((m - 69.0) / 12.0)


def hz_midi(f: float) -> float:
    return 69.0 + 12.0 * np.log2(f / 440.0)


def nm(name) -> int:
    """'F5' -> 77, 'Ab3' -> 56, 'C#4' -> 61, 'Bb1' -> 34 (scientific, C4 = 60).  Ints pass through."""
    if isinstance(name, (int, float, np.integer, np.floating)):
        return name
    name = name.strip()
    pc = NOTE_NAMES[name[0].upper()]
    i = 1
    while i < len(name) and name[i] in '#b':
        pc += 1 if name[i] == '#' else -1
        i += 1
    octv = int(name[i:])
    return 12 * (octv + 1) + pc


def pc_of(name: str) -> int:
    """'Eb' -> 3 (pitch class of a note name without octave)."""
    name = name.strip()
    pc = NOTE_NAMES[name[0].upper()]
    for ch in name[1:]:
        if ch == '#':
            pc += 1
        elif ch == 'b':
            pc -= 1
    return pc % 12


def note_name(m: float, flats: bool = True) -> str:
    m = int(round(m))
    return (FLAT_NAMES if flats else SHARP_NAMES)[m % 12] + str(m // 12 - 1)


def chord(*names) -> list[int]:
    return [nm(n) for n in names]


@dataclass
class Note:
    inst: str
    pitch: float
    start: float            # SECONDS from the start of the cue file
    dur: float              # seconds (gate length; the release rings past it)
    vel: float = 0.7        # 0..1
    lock: bool = False      # True -> no timing humanisation (sync hits, stingers)
    x: dict = field(default_factory=dict)   # instrument specific extras (art, rel, att, env, bend, pan, ...)

    def copy(self, **kw) -> 'Note':
        n = Note(self.inst, self.pitch, self.start, self.dur, self.vel, self.lock, dict(self.x))
        for k, v in kw.items():
            setattr(n, k, v)
        return n


def stable_seed(*parts) -> int:
    """Process-independent seed (Python's hash() of str is randomised per process)."""
    return zlib.crc32(repr(parts).encode()) & 0x7FFFFFFF


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
    """Constant-power pan, p in -1..1 (unity at centre)."""
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


def todb(x: float) -> float:
    return 20 * np.log10(max(abs(x), 1e-12))


_DN = None


def _dn(x):
    """x + a fixed -400 dB dither.  IIR state decaying through long silences reaches subnormal floats,
    which the CPU computes ~100x slower (a sparse 25 s track took 12 s to filter).  The dither keeps
    every state normal; it is deterministic (fixed sequence) and 380 dB below 24-bit resolution."""
    global _DN
    x = np.asarray(x)
    n = x.shape[-1]
    if _DN is None:
        _DN = (np.random.default_rng(12345).standard_normal(1 << 16) * 1e-20)
    reps = -(-n // _DN.shape[0])
    d = np.tile(_DN, reps)[:n] if reps > 1 else _DN[:n]
    return x + d


def sosfilt(sos, x):
    return signal.sosfilt(sos, _dn(x), axis=-1)


def lp(x, fc, order=2, sr=SR):
    fc = min(fc, sr * 0.45)
    return sosfilt(signal.butter(order, fc, 'low', fs=sr, output='sos'), x)


def hp(x, fc, order=2, sr=SR):
    return sosfilt(signal.butter(order, fc, 'high', fs=sr, output='sos'), x)


def bp(x, f1, f2, order=2, sr=SR):
    f2 = min(f2, sr * 0.45)
    return sosfilt(signal.butter(order, [f1, f2], 'band', fs=sr, output='sos'), x)


def _biquad(b, a):
    return np.array([[b[0] / a[0], b[1] / a[0], b[2] / a[0], 1.0, a[1] / a[0], a[2] / a[0]]])


def peq(x, f0, gain_db, q=1.0, sr=SR):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / sr; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return sosfilt(_biquad(b, a), x)


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
    return sosfilt(_biquad(b, a), x)


def env_curve(points, n: int, unit: str = 's') -> np.ndarray:
    """Piecewise-linear gain curve from (time, value) points.  unit 's' (seconds, default) or 'frames'."""
    t = np.arange(n)
    xs = [s2n(p[0]) if unit == 's' else f2n(p[0]) for p in points]
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
    """The theme engine's tape colour, kept for compatibility.  New work: use era.Era (sync-safe wow,
    presets, dropouts, loop-safe)."""
    from .era import Era
    return Era(None, drive=drive, wow_cents=wow_cents, wow_hz=wow_hz, flutter_cents=flutter_cents,
               hiss_db=hiss_db, lp_hz=lp_hz, seed=seed, head_bump_db=1.2)(x)


def bitcrush(x, bits=8, rate=None):
    x = to_stereo(x)
    if rate:
        step = SR / rate
        idx = (np.floor(np.arange(x.shape[1]) / step) * step).astype(int)
        x = x[:, np.clip(idx, 0, x.shape[1] - 1)]
    q = 2 ** (bits - 1)
    return (np.round(x * q) / q).astype(np.float32)


def rms_db(x) -> float:
    return todb(float(np.sqrt(np.mean(np.asarray(x, dtype=np.float64) ** 2)) + 1e-12))
