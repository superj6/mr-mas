"""Shared helpers for the MR. MAS Ep1 intro re-recording mix (audio/intro/mix).

Clock: 24 fps, 48 kHz, 2000 samples per frame, 720 frames = 1,440,000 samples = 30.000 s.
Loudness: ITU-R BS.1770-4 via pyloudnorm (integrated, gated); momentary/short-term are
ungated K-weighted windows; true peak is 4x oversampled (BS.1770-4 Annex 2).
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

import os
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import resample_poly, lfilter

SR = 48000
FPS = 24
SPF = SR // FPS            # 2000 samples per frame
FRAMES = 720
N = FRAMES * SPF           # 1,440,000

ROOT = REPO
AUDIO = os.path.join(ROOT, 'audio')
OUT_DIR = os.path.join(AUDIO, 'intro/mix')

_METER = pyln.Meter(SR)    # BS.1770-4, 400 ms blocks, 75 % overlap


def db(x):
    return 10.0 ** (x / 20.0)


def todb(x, floor=-240.0):
    x = np.asarray(x, dtype=np.float64)
    with np.errstate(divide='ignore'):
        return np.maximum(20.0 * np.log10(np.maximum(x, 1e-12)), floor)


def f2n(f):
    return int(round(f * SPF))


def read(path):
    """Read a 30.000 s stem as float64 (2, N). Fails loudly on any length/rate mismatch."""
    x, sr = sf.read(path, dtype='float64', always_2d=True)
    assert sr == SR, (path, sr)
    assert x.shape[0] == N, (path, x.shape)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.T.copy()


def write(path, x, subtype='PCM_24'):
    x = np.asarray(x)
    assert x.shape == (2, N), x.shape
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, np.clip(x.T, -1.0, 1.0 - 2 ** -23), SR, subtype=subtype)


def lufs(x):
    """Integrated loudness (gated) of a (2, n) signal; -inf-safe."""
    if x.shape[1] < int(0.4 * SR):
        x = np.pad(x, ((0, 0), (0, int(0.4 * SR) - x.shape[1])))
    v = _METER.integrated_loudness(x.T)
    return float(v) if np.isfinite(v) else -99.0


def lufs_ref(x):
    """Independent BS.1770-4 integrated loudness with the standard's published 48 kHz K-filter
    coefficients (400 ms blocks, 100 ms hop, -70 LUFS absolute and -10 LU relative gates).
    Cross-check for pyloudnorm, which designs its filters per rate (reads a 997 Hz reference 0.04 low)."""
    k = kweight(x)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    nb = (x.shape[1] - blk) // hop + 1
    c = np.concatenate([np.zeros((x.shape[0], 1)), np.cumsum(k ** 2, axis=1)], axis=1)
    idx = np.arange(nb) * hop
    z = ((c[:, idx + blk] - c[:, idx]) / blk).sum(axis=0)
    l = -0.691 + 10 * np.log10(z + 1e-20)
    g1 = l > -70
    lr = -0.691 + 10 * np.log10(z[g1].mean()) - 10
    g2 = g1 & (l > lr)
    return float(-0.691 + 10 * np.log10(z[g2].mean()))


# ---- K-weighting for ungated momentary / short-term curves -------------------------------------
def _kfilter_coeffs():
    # BS.1770 stage 1 (shelf) and stage 2 (RLB high-pass), 48 kHz coefficients from the standard
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    return (b1, a1), (b2, a2)


def kweight(x):
    (b1, a1), (b2, a2) = _kfilter_coeffs()
    return lfilter(b2, a2, lfilter(b1, a1, x, axis=-1), axis=-1)


def loud_curve(x, win_s=0.4, hop_f=1.0):
    """Ungated K-weighted loudness (LUFS) in a sliding window, sampled every hop_f frames.
    Returns (frames, lufs). win 0.4 s = momentary, 3.0 s = short-term. The value at frame f is the
    window ENDING at f (as a meter reads)."""
    k = kweight(x)
    p = (k ** 2).sum(axis=0)
    c = np.concatenate([[0.0], np.cumsum(p)])
    w = int(win_s * SR)
    fr = np.arange(0, FRAMES + 1e-9, hop_f)
    out = []
    for f in fr:
        e = min(f2n(f), N)
        s = max(0, e - w)
        ms = (c[e] - c[s]) / max(w, 1)
        out.append(-0.691 + 10 * np.log10(ms + 1e-20))
    return fr, np.array(out)


def win_loud(x, a_f, b_f):
    """Ungated K-weighted loudness over [a_f, b_f) frames (LUFS)."""
    pre = min(f2n(a_f), SR // 2)                  # 0.5 s of filter warm-up before the window
    k = kweight(x[:, f2n(a_f) - pre:f2n(b_f)])[:, pre:]
    ms = (k ** 2).sum(axis=0).mean()
    return float(-0.691 + 10 * np.log10(ms + 1e-20))


# ---- peaks ---------------------------------------------------------------------------------------
def oversample(x, os_=4):
    return resample_poly(x, os_, 1, axis=-1, window=('kaiser', 10.0))


def true_peak(x):
    """True peak (linear) by 4x polyphase oversampling, max over channels."""
    return float(np.abs(oversample(x)).max())


def true_peak_db(x):
    return float(todb(true_peak(x)))


def sample_peak_db(x):
    return float(todb(np.abs(x).max()))


def tp_envelope(x, os_=4):
    """Per-base-sample true-peak magnitude (max over channels and the os_ sub-samples)."""
    y = np.abs(oversample(x, os_)).max(axis=0)
    y = y[:x.shape[1] * os_].reshape(-1, os_).max(axis=1)
    return y


# ---- limiter -------------------------------------------------------------------------------------
def _running_min(g, w):
    """Forward look-ahead minimum: out[n] = min(g[n : n + w + 1])."""
    from numpy.lib.stride_tricks import sliding_window_view
    return sliding_window_view(np.pad(g, (0, w), mode='edge'), w + 1).min(axis=1)


def limiter_gain(x, ceiling_db=-1.3, look_ms=2.0, rel_ms=120.0):
    """Look-ahead true-peak brickwall gain curve (1, n) for a (2, n) signal.

    Required gain from the 4x true-peak envelope -> forward running minimum over the look-ahead L ->
    a causal Hann-weighted average over the last L samples. Every value in that average is <= the
    requirement at the current sample, so the curve never overshoots, and it ramps smoothly down over
    L samples ahead of each peak -> dB-domain one-pole release. Linked stereo; the same curve is applied
    to every mix stem so the stems still sum to the mix.
    """
    ceil = db(ceiling_db)
    env = tp_envelope(x)
    req = np.minimum(1.0, ceil / np.maximum(env, 1e-12))
    L = max(2, int(look_ms * 1e-3 * SR))
    g1 = _running_min(req, L)
    w = np.hanning(L + 3)[1:-1]
    w /= w.sum()
    g = np.convolve(np.pad(g1, (L, 0), mode='edge'), w[::-1], mode='valid')[:len(g1)]
    g = np.minimum(g, req)
    a = np.exp(-1.0 / (rel_ms * 1e-3 * SR))
    out = _release(todb(g), a)
    return db(out)[None, :]


def _release(gd, a):
    """y[n] = min(gd[n], a*y[n-1] + (1-a)*gd[n]) in dB (instant attack, exponential release).
    Vectorised in chunks with a python loop over samples only where gain < 0 dB."""
    y = np.zeros_like(gd)
    prev = 0.0
    idx = np.nonzero(gd < -1e-6)[0]
    if len(idx) == 0:
        return y
    # process sample by sample but skip long unity stretches where the release has settled
    n = len(gd)
    i = int(idx[0])
    y[:i] = 0.0
    prev = 0.0
    while i < n:
        v = a * prev + (1 - a) * gd[i]
        v = min(v, gd[i])
        y[i] = v
        prev = v
        i += 1
        if prev > -1e-4 and i < n and gd[i] >= -1e-6:
            # settled back to unity: jump to the next reduction
            nxt = np.searchsorted(idx, i)
            if nxt >= len(idx):
                y[i:] = 0.0
                break
            j = int(idx[nxt])
            y[i:j] = 0.0
            i = j
            prev = 0.0
    return y


# ---- misc ----------------------------------------------------------------------------------------
def rel(path):
    return os.path.relpath(path, ROOT)
