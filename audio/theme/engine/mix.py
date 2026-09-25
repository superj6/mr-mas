"""Reverbs (synthetic stereo IRs, convolution), bus dynamics and the mastering gain computer.

The master chain is computed as a *gain envelope* (glue compressor x true-peak
limiter x make-up) from the summed mix and then applied identically to every
stem, so the exported stems sum back to the master.
"""
from __future__ import annotations

import numpy as np
from scipy import signal
import pyloudnorm as pyln

from .core import SR, lp, hp, bp, db, to_stereo

_IR = {}


def make_ir(kind='hall', seed=11):
    if kind in _IR:
        return _IR[kind]
    P = dict(
        hall=dict(rt=2.5, pre=0.024, er=0.09, lo_mul=1.25, hi_mul=0.42, bright=8500, dens=1.0),
        stage=dict(rt=1.7, pre=0.016, er=0.07, lo_mul=1.15, hi_mul=0.5, bright=9000, dens=1.0),
        room=dict(rt=0.55, pre=0.006, er=0.03, lo_mul=1.0, hi_mul=0.6, bright=9000, dens=1.0),
        plate=dict(rt=1.8, pre=0.010, er=0.0, lo_mul=0.8, hi_mul=0.8, bright=11000, dens=1.0),
        chamber=dict(rt=1.2, pre=0.012, er=0.05, lo_mul=1.1, hi_mul=0.55, bright=9000, dens=1.0),
        snes=dict(rt=0.9, pre=0.0, er=0.0, lo_mul=1.0, hi_mul=0.35, bright=5000, dens=1.0),
    )[kind]
    rng = np.random.default_rng(seed)
    L = int((P['rt'] * 1.5 + P['pre']) * SR)
    t = np.arange(L) / SR
    bands = [(20, 250, P['lo_mul']), (250, 1000, 1.0), (1000, 3000, 0.85), (3000, 7000, 0.65 * P['hi_mul'] / 0.5),
             (7000, 18000, P['hi_mul'])]
    ir = np.zeros((2, L))
    for ch in range(2):
        w = rng.standard_normal(L)
        acc = np.zeros(L)
        for lo_, hi_, mul in bands:
            rt = P['rt'] * mul
            b = bp(w, lo_, min(hi_, 20000), 2) if lo_ > 20 else lp(w, hi_, 2)
            acc += b * np.exp(-6.91 * t / rt)
        # soft onset of the diffuse tail
        acc *= np.clip((t - P['pre']) / 0.03, 0, 1)
        # early reflections
        if P['er'] > 0:
            for k in range(14):
                d = P['pre'] * 0.3 + rng.uniform(0.003, P['er'])
                i = int(d * SR)
                if i < L:
                    acc[i] += rng.uniform(0.2, 0.7) * (1 - d / (P['er'] + 0.05)) * (1 if rng.random() > 0.5 else -1)
        ir[ch] = lp(acc, P['bright'], 1)
    ir = hp(ir, 70, 2)
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    _IR[kind] = ir.astype(np.float32)
    return _IR[kind]


def convolve(x, kind):
    ir = make_ir(kind)
    x = to_stereo(x)
    out = np.stack([signal.fftconvolve(x[c], ir[c])[:x.shape[1]] for c in range(2)])
    # cross-feed a little for width/density
    out = out * 0.85 + 0.15 * out[::-1]
    return out.astype(np.float32)


def envelope_follower(x, att_ms, rel_ms):
    """Peak-ish follower on a mono level signal (vectorised one-pole with different att/rel)."""
    a = np.exp(-1.0 / (att_ms * SR / 1000))
    r = np.exp(-1.0 / (rel_ms * SR / 1000))
    y = np.empty_like(x)
    s = 0.0
    # decimate for speed: follower at SR/16 then interpolate
    D = 16
    xd = x[::D]
    yd = np.empty_like(xd)
    a = a ** D
    r = r ** D
    for i, v in enumerate(xd):
        c = a if v > s else r
        s = c * s + (1 - c) * v
        yd[i] = s
    y = np.interp(np.arange(len(x)), np.arange(len(xd)) * D, yd)
    return y


def comp_gain(x, thresh_db=-18.0, ratio=2.0, att_ms=25.0, rel_ms=220.0, knee_db=6.0, sc_hp=90.0):
    """Returns gain curve (linear) for a feed-forward RMS-ish compressor."""
    m = hp(to_stereo(x).mean(0), sc_hp, 1)
    lvl = np.sqrt(envelope_follower(m * m, att_ms, rel_ms) + 1e-12)
    ldb = 20 * np.log10(lvl + 1e-12)
    over = ldb - thresh_db
    gr = np.where(over <= -knee_db / 2, 0.0,
                  np.where(over >= knee_db / 2, over * (1 - 1 / ratio),
                           (1 - 1 / ratio) * (over + knee_db / 2) ** 2 / (2 * knee_db)))
    return db(-gr).astype(np.float32) if np.ndim(gr) else db(-gr)


def true_peak(x):
    x = to_stereo(x)
    up = signal.resample_poly(x, 4, 1, axis=1)
    return float(np.abs(up).max())


def limiter_gain(x, ceiling_db=-1.0, look_ms=1.5, rel_ms=80.0):
    """Look-ahead limiter gain computed on a 4x oversampled peak envelope (true-peak aware)."""
    x = to_stereo(x)
    up = np.abs(signal.resample_poly(x, 4, 1, axis=1)).max(0)
    pk = up.reshape(-1, 4).max(1)[:x.shape[1]]
    ceil = db(ceiling_db)
    need = np.minimum(1.0, ceil / (pk + 1e-12))
    # look-ahead: running min over window, then smooth
    L = int(look_ms * SR / 1000) + 1
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * L + 1, mode='nearest')
    # release smoothing (only upward motion is slowed)
    r = np.exp(-1.0 / (rel_ms * SR / 1000))
    D = 8
    gd = g[::D].copy()
    s = 1.0
    rd = r ** D
    for i in range(len(gd)):
        v = gd[i]
        s = v if v < s else rd * s + (1 - rd) * v
        gd[i] = s
    g2 = np.interp(np.arange(len(g)), np.arange(len(gd)) * D, gd)
    g2 = np.minimum(g2, g)            # never exceed the instantaneous requirement
    # short attack smoothing without losing the peak catch
    k = max(1, L)
    g3 = np.convolve(g2, np.ones(k) / k, mode='same')
    g3 = np.minimum(g3, g)
    return g3.astype(np.float32)


def lufs(x):
    meter = pyln.Meter(SR)
    return float(meter.integrated_loudness(to_stereo(x).T.astype(np.float64)))


def master_gain(mix, target_lufs=-14.0, ceiling_db=-1.0, comp=dict(thresh_db=-20, ratio=1.8), iters=4):
    """Glue comp + make-up + TP limiter as one gain curve; iterated to hit target LUFS."""
    g_comp = comp_gain(mix, **comp)
    y0 = mix * g_comp[None]
    mk = db(target_lufs - lufs(y0))
    for _ in range(iters):
        y1 = y0 * mk
        g_lim = limiter_gain(y1, ceiling_db - 0.15)
        y2 = y1 * g_lim[None]
        L = lufs(y2)
        err = target_lufs - L
        if abs(err) < 0.05:
            break
        mk *= db(err)
    g = g_comp * mk * g_lim
    return g.astype(np.float32)
