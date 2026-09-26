"""Era filters: wow/flutter tape (sync-safe), plus a tape stop and a 2008 low-bitrate codec colour.

    from engine.era import Era
    sc.stem_post['piano'] = Era('cassette')            # a stem through a 1990s cassette deck
    buf = Era('memory', mix=0.6)(buf)                   # 60 % wet haze for a flashback
    Era('reel', wow_cents=5)                            # any preset field can be overridden

Wow and flutter are a MODULATED DELAY (read position = t + d(t), d zero-mean and bounded to a few
ms), not a resample of the whole file, so the output never drifts off the picture: a hit at frame
240 still lands at frame 240 (+- the wow excursion, about 1-3 ms).
periodic=True makes the modulation wrap exactly around the buffer (for loop files processed after
the fold); the engine's loop export does not need it because it folds after processing.

Presets (ERA_PRESETS): reel, cassette, walkman, vhs, dictaphone, memory, broken.

OST-BIBLE s1 (binding): tape haze is NOT Mas's version -- his account is cleaner than the truth.  Never mark
his recollection with wow, flutter or 'memory'.  The tape presets are for real recordings on screen (a
camcorder's audio, a dictaphone, an archive clip) and for LIGHT T2 colour (the 2008-14 sample-chip band).
Cassette-piano wow as a style is retired (intro SCRIPT s9.9).

futz(buf, 'tv' | 'phone' | 'laptop' | 'pa' | 'radio'): an in-world speaker, for diegetic source music.
"""
from __future__ import annotations

import numpy as np
from scipy import signal

from .core import SR, lp, hp, peq, shelf, to_stereo, db

ERA_PRESETS = {
    # 1970s studio reel: barely there, a bit of weight and glue
    'reel':       dict(wow_cents=3.0, wow_hz=0.45, flutter_cents=1.0, flutter_hz=9.0, drive=1.15, hiss_db=-84,
                       lp_hz=17000, hp_hz=25, head_bump_db=1.0, head_bump_hz=70, dropouts=0.0, mono=0.0,
                       wander_db=0.10, azimuth_ms=0.0),
    # 1990s type-I cassette (the 1993 flashbacks)
    'cassette':   dict(wow_cents=9.0, wow_hz=0.55, flutter_cents=4.0, flutter_hz=7.5, drive=1.45, hiss_db=-64,
                       lp_hz=11500, hp_hz=40, head_bump_db=1.8, head_bump_hz=90, dropouts=0.25, mono=0.0,
                       wander_db=0.35, azimuth_ms=0.03),
    # a worn portable player: seasick
    'walkman':    dict(wow_cents=16.0, wow_hz=0.8, flutter_cents=6.0, flutter_hz=6.0, drive=1.6, hiss_db=-58,
                       lp_hz=9000, hp_hz=60, head_bump_db=2.0, head_bump_hz=100, dropouts=0.5, mono=0.1,
                       wander_db=0.6, azimuth_ms=0.05),
    # VHS linear audio track: dull, a little mono, fast flutter
    'vhs':        dict(wow_cents=6.0, wow_hz=0.3, flutter_cents=6.0, flutter_hz=12.0, drive=1.3, hiss_db=-60,
                       lp_hz=8500, hp_hz=60, head_bump_db=2.0, head_bump_hz=100, dropouts=0.4, mono=0.35,
                       wander_db=0.4, azimuth_ms=0.0),
    # micro-cassette dictaphone: band-limited, mono, obviously a recording
    'dictaphone': dict(wow_cents=18.0, wow_hz=1.1, flutter_cents=8.0, flutter_hz=9.0, drive=1.8, hiss_db=-50,
                       lp_hz=4200, hp_hz=300, head_bump_db=0.0, head_bump_hz=100, dropouts=0.3, mono=1.0,
                       wander_db=0.8, azimuth_ms=0.0),
    # an archival / home-video recording: slow drift, soft top, gentle hiss (NOT Mas's recollection)
    'memory':     dict(wow_cents=16.0, wow_hz=0.33, flutter_cents=2.5, flutter_hz=7.0, drive=1.3, hiss_db=-68,
                       lp_hz=6800, hp_hz=50, head_bump_db=1.5, head_bump_hz=85, dropouts=0.1, mono=0.15,
                       wander_db=0.5, azimuth_ms=0.02),
    # the machine is failing: deep, uneven wow, frequent dropouts
    'broken':     dict(wow_cents=38.0, wow_hz=0.27, flutter_cents=12.0, flutter_hz=5.0, drive=1.9, hiss_db=-56,
                       lp_hz=5200, hp_hz=80, head_bump_db=2.5, head_bump_hz=110, dropouts=1.0, mono=0.3,
                       wander_db=1.2, azimuth_ms=0.08),
}

_DEFAULT = dict(wow_cents=0.0, wow_hz=0.7, flutter_cents=0.0, flutter_hz=8.0, drive=1.2, hiss_db=-120,
                lp_hz=None, hp_hz=None, head_bump_db=0.0, head_bump_hz=90, dropouts=0.0, mono=0.0,
                wander_db=0.0, azimuth_ms=0.0)


def _circ_noise(n, lo, hi, rng):
    """Zero-mean, unit-RMS band-limited noise that wraps around the buffer exactly (FFT-made)."""
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-12)


def _hermite(x, pos, periodic):
    """Catmull-Rom read of 1-D x at fractional positions pos."""
    n = len(x)
    i = np.floor(pos).astype(np.int64)
    f = pos - i
    if periodic:
        im1, i0, i1, i2 = (i - 1) % n, i % n, (i + 1) % n, (i + 2) % n
    else:
        im1, i0, i1, i2 = [np.clip(k, 0, n - 1) for k in (i - 1, i, i + 1, i + 2)]
    y0, y1, y2, y3 = x[im1], x[i0], x[i1], x[i2]
    c1 = 0.5 * (y2 - y0)
    c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3
    c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2)
    return ((c3 * f + c2) * f + c1) * f + y1


def wow_flutter_displacement(n, wow_cents, wow_hz, flutter_cents, flutter_hz, seed=0):
    """Read-position offset d[n] in samples (zero-mean, periodic over n) for the given pitch wobble."""
    rng = np.random.default_rng(seed)
    T = n / SR
    t = np.arange(n) / SR
    cents = np.zeros(n)
    if wow_cents:
        k1 = max(1, round(wow_hz * T))                 # whole cycles -> periodic
        k2 = max(1, round(wow_hz * 1.618 * T))
        cents += wow_cents * (0.8 * np.sin(2 * np.pi * k1 / T * t + rng.uniform(0, 6.28)) +
                              0.35 * np.sin(2 * np.pi * k2 / T * t + rng.uniform(0, 6.28)))
        cents += wow_cents * 0.25 * _circ_noise(n, 0.05, wow_hz * 2.0, rng)
    if flutter_cents:
        k3 = max(1, round(flutter_hz * T))
        cents += flutter_cents * (0.6 * np.sin(2 * np.pi * k3 / T * t + rng.uniform(0, 6.28)) +
                                  0.5 * _circ_noise(n, flutter_hz * 0.5, flutter_hz * 2.5, rng))
    if not cents.any():
        return np.zeros(n)
    r = 2.0 ** (cents / 1200.0) - 1.0                   # instantaneous speed error
    R = np.fft.rfft(r - r.mean())
    f = np.fft.rfftfreq(n, 1 / SR)
    D = np.zeros_like(R)
    nz = f > 0.02                                       # drop < 0.02 Hz: the tape never drifts off sync
    D[nz] = R[nz] / (2j * np.pi * f[nz] / SR)           # integrate: displacement in samples
    return np.fft.irfft(D, n)


class Era:
    def __init__(self, preset: str | None = 'cassette', mix: float = 1.0, seed: int = 0, **over):
        p = dict(_DEFAULT)
        if preset:
            if preset not in ERA_PRESETS:
                raise KeyError(f'unknown era preset {preset!r}: {sorted(ERA_PRESETS)}')
            p.update(ERA_PRESETS[preset])
        p.update(over)
        self.p = p
        self.preset = preset
        self.mix = mix
        self.seed = seed

    def describe(self) -> dict:
        return dict(preset=self.preset, mix=self.mix, **{k: v for k, v in self.p.items() if v is not None})

    def __call__(self, buf, periodic: bool = False):
        p = self.p
        x = to_stereo(np.asarray(buf, dtype=np.float64))
        n = x.shape[1]
        if n < 16:
            return x.astype(np.float32)
        rng = np.random.default_rng(self.seed + 17)
        # periodic: every modulation signal is generated on the n-sample cycle, the audio is padded
        # circularly (so the IIR filters are warm at the wrap), processed, then cropped back to n.
        pad = min(n, 2 * SR) if periodic else 0
        idx = np.arange(-pad, n + pad) % n
        xp = x[:, idx] if pad else x
        m = xp.shape[1]
        y = xp
        # --- transport: wow & flutter as a modulated delay (+ azimuth skew on R)
        if p['wow_cents'] or p['flutter_cents'] or p['azimuth_ms']:
            d = wow_flutter_displacement(n, p['wow_cents'], p['wow_hz'], p['flutter_cents'], p['flutter_hz'],
                                         self.seed)
            d = d[idx] if pad else d
            base = np.arange(m, dtype=np.float64)
            az = p['azimuth_ms'] * SR / 1000.0
            y = np.stack([_hermite(y[0], base + d, False), _hermite(y[1], base + d + az, False)])
        # --- electronics: head bump, record EQ, saturation (tiny bias -> a little 2nd harmonic)
        if p['hp_hz']:
            y = hp(y, p['hp_hz'], 2)
        if p['head_bump_db']:
            y = peq(y, p['head_bump_hz'], p['head_bump_db'], 0.9)
        if p['drive'] and p['drive'] > 0:
            dr, bias = p['drive'], 0.04
            y = (np.tanh(dr * (y + bias)) - np.tanh(dr * bias)) / dr
        if p['lp_hz']:
            y = shelf(y, p['lp_hz'] * 0.5, -1.5, True)
            y = lp(y, p['lp_hz'], 2)
        # --- mono-ish (VHS / dictaphone)
        if p['mono']:
            mm = 0.5 * (y[0] + y[1]); ss = 0.5 * (y[0] - y[1]) * (1 - p['mono'])
            y = np.stack([mm + ss, mm - ss])
        # --- slow level wander (and a little L/R difference)
        if p['wander_db']:
            w = _circ_noise(n, 0.03, 0.6, rng)
            wr = _circ_noise(n, 0.03, 0.6, rng)
            w, wr = w / (np.abs(w).max() + 1e-12), wr / (np.abs(wr).max() + 1e-12)
            g = np.stack([db(p['wander_db'] * w), db(p['wander_db'] * (0.8 * w + 0.2 * wr))])
            y = y * (g[:, idx] if pad else g)
        # --- dropouts: short dips with top loss (oxide flaking)
        if p['dropouts'] > 0:
            k = rng.poisson(p['dropouts'] * 0.12 * n / SR)
            if k:
                g = np.ones(n)
                mixw = np.zeros(n)
                for _ in range(k):
                    c = int(rng.uniform(0, n))
                    L = int(rng.uniform(0.02, 0.15) * SR)
                    depth = rng.uniform(3, 12)
                    a0, a1 = max(0, c - L // 2), min(n, c + L // 2)
                    win = np.hanning(a1 - a0) if a1 - a0 > 2 else np.ones(a1 - a0)
                    g[a0:a1] = np.minimum(g[a0:a1], 1 - (1 - db(-depth)) * win)
                    mixw[a0:a1] = np.maximum(mixw[a0:a1], win)
                if pad:
                    g, mixw = g[idx], mixw[idx]
                dull = lp(y, 2500, 1)
                y = (y * (1 - mixw) + dull * mixw) * g
        # --- hiss (FFT noise, wraps exactly)
        if p['hiss_db'] > -110:
            h = np.stack([_circ_noise(n, 1500, 14000, rng), _circ_noise(n, 1500, 14000, rng)])
            h = h * np.linspace(1.0, 0.7, h.shape[0])[:, None]
            y = y + (h[:, idx] if pad else h) * db(p['hiss_db'])
        if pad:
            y = y[:, pad:pad + n]
        out = x * (1 - self.mix) + y * self.mix if self.mix < 1 else y
        return out.astype(np.float32)


def tape_stop(buf, at_s: float, dur_s: float = 0.6, curve: float = 2.0):
    """The deck loses power at at_s: pitch and speed fall to zero over dur_s, then silence.
    A punctuation device for a hard cut -- use sparingly (it is a joke that dies on repetition)."""
    x = to_stereo(np.asarray(buf, dtype=np.float64))
    n = x.shape[1]
    a = int(at_s * SR)
    L = int(dur_s * SR)
    if a >= n:
        return x.astype(np.float32)
    u = np.linspace(0, 1, L)
    speed = (1 - u) ** curve
    pos = a + np.cumsum(speed)
    out = x.copy()
    seg = np.stack([_hermite(x[c], pos, False) for c in range(2)])
    seg *= np.clip((1 - u) * 4, 0, 1)[None]
    end = min(n, a + L)
    out[:, a:end] = seg[:, :end - a]
    out[:, end:] = 0
    return out.astype(np.float32)


def codec_2008(buf, strength: float = 0.5, band_hz: float = 15500.0, seed: int = 0):
    """2008-14 era colour: a low-bitrate perceptual-codec look (weak STFT bins zeroed per frame, top band
    cut, pre-echo smear).  strength 0..1 (0.5 ~ a 96 kb/s MP3 of the day)."""
    x = to_stereo(np.asarray(buf, dtype=np.float64))
    nper = 1024
    f, t, Z = signal.stft(x, SR, nperseg=nper, noverlap=nper // 2, axis=-1)
    mag = np.abs(Z)
    thr_db = -52 + 30 * strength
    ref = mag.max(axis=1, keepdims=True) + 1e-12
    keep = 20 * np.log10(mag / ref + 1e-12) > thr_db
    Z = Z * keep
    Z[:, f > band_hz, :] = 0
    _, y = signal.istft(Z, SR, nperseg=nper, noverlap=nper // 2)
    y = y[:, :x.shape[1]]
    if y.shape[1] < x.shape[1]:
        y = np.pad(y, ((0, 0), (0, x.shape[1] - y.shape[1])))
    return y.astype(np.float32)


# ------------------------------------------------------------------ in-world speakers (diegetic source)
FUTZ = {
    'phone':  dict(lo=320.0, hi=3400.0, mono=1.0, drive=2.2, res=(1800.0, 4.0, 1.4), slap_ms=0.0),
    'laptop': dict(lo=420.0, hi=9000.0, mono=0.7, drive=1.5, res=(1200.0, 5.0, 1.0), slap_ms=0.0),
    'tv':     dict(lo=160.0, hi=8000.0, mono=0.9, drive=1.3, res=(900.0, 3.0, 0.9), slap_ms=0.0),
    'radio':  dict(lo=220.0, hi=5000.0, mono=1.0, drive=1.6, res=(1500.0, 3.0, 1.0), slap_ms=0.0),
    'pa':     dict(lo=120.0, hi=7000.0, mono=0.5, drive=1.7, res=(2500.0, 3.0, 1.0), slap_ms=180.0),
}


def futz(buf, kind='tv', mix=1.0, drive=None):
    """Play buf through an in-world speaker: band limits, a cone resonance, small-amp drive, mono-ish,
    and (pa) an arena slap-back.  For diegetic source music (the 808 / trap kits live here, per the bible)."""
    p = dict(FUTZ[kind])
    if drive is not None:
        p['drive'] = drive
    x = to_stereo(np.asarray(buf, dtype=np.float64))
    y = hp(x, p['lo'], 4)
    y = lp(y, p['hi'], 4)
    f0, g0, q0 = p['res']
    y = peq(y, f0, g0, q0)
    pk = np.abs(y).max() + 1e-12
    dr = p['drive']
    y = np.tanh(dr * y / pk) / np.tanh(dr) * pk
    if p['mono']:
        mm = 0.5 * (y[0] + y[1]); ss = 0.5 * (y[0] - y[1]) * (1 - p['mono'])
        y = np.stack([mm + ss, mm - ss])
    if p['slap_ms']:
        d = int(p['slap_ms'] * SR / 1000)
        e = np.zeros_like(y)
        e[:, d:] = lp(y, 3000, 2)[:, :-d] * db(-9)
        y = y + e
    out = x * (1 - mix) + y * mix if mix < 1 else y
    return out.astype(np.float32)
