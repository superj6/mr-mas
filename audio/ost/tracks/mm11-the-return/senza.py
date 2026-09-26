"""SENZA VIBRATO solo violin for the STRAIGHT cue (OST-BIBLE s2.9, s5.E1: "the Door on solo violin, senza
vibrato, with no portamento, swell or chip").

The only solo violin in the sample library is VSCO 2 CE 'Solo Violin / Arco Vib' (vibrato baked in:
measured 5-14 cents RMS, 15-42 cents peak-to-peak).  This helper flattens it: it tracks the sample's
fundamental every 2.5 ms, smooths the track, and re-reads the sample at a time-varying rate so the pitch
holds still (a de-vibrato by variable-rate resampling; the bow noise and the timbre stay the player's).
The amplitude wobble that comes with vibrato is evened out too (partially: the bow still breathes).

It is a composer-side 'fn' source (engine Track src ('fn', svln_nv)); the engine is not modified.

    from senza import svln_track, prewarm
    T['svln_nv'] = svln_track()
    prewarm(['Ab4', 'Db5', 'C5', 'G4'])      # in the parent, before the forked render workers start
    a.n('svln_nv', 'Ab4', (1, 1), '2b', 0.5)  # x: rel, att (s), keep (0..1: how much vibrato to keep)

Used by tracks/mm11-the-return (sec. a) and tracks/e01-s30a-the-door (the editor's own violin track).
"""
from __future__ import annotations

import glob
import os
import re
import sys
from fractions import Fraction
from functools import lru_cache

import numpy as np
from scipy import signal

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine.core import SR, nm, db, to_stereo                                   # noqa: E402
from engine.sampler import load_wav, trim_lead, loudness_ref, ROOT             # noqa: E402
from engine.render import Track                                                 # noqa: E402

FOLDER = os.path.join(ROOT, 'vsco2ce/Strings/Solo Violin/Arco Vib')
CREDIT = 'Orchestral samples: VSCO 2 CE by Versilian Studios (CC0 1.0)'
_PCS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def _entries():
    out = []
    for f in sorted(glob.glob(os.path.join(FOLDER, '*.wav'))):
        m = re.search(r'_([A-G])(\d)_(p|f)\.wav$', os.path.basename(f))
        if not m:
            continue
        out.append(dict(path=f, pitch=12 * (int(m.group(2)) + 1) + _PCS[m.group(1)], layer=m.group(3)))
    return out


ENTRIES = _entries()


def f0_track(m, f_nom, hop_s=0.0025):
    """Fundamental every hop (autocorrelation over ~4 periods, parabolic refinement); NaN where quiet."""
    per = SR / f_nom
    win = int(max(4 * per, 0.012 * SR))
    hop = int(hop_s * SR)
    lo, hi = int(SR / (f_nom * 1.12)), int(SR / (f_nom / 1.12)) + 2
    w = np.hanning(win)
    pk = np.abs(m).max() + 1e-9
    ts, fs = [], []
    nfft = 1 << int(np.ceil(np.log2(2 * win)))
    for i in range(0, len(m) - win, hop):
        s = m[i:i + win] * w
        ts.append(i + win / 2)
        if np.sqrt(np.mean(s ** 2)) < pk * 1e-3:
            fs.append(np.nan)
            continue
        S = np.fft.rfft(s, nfft)
        ac = np.fft.irfft(np.abs(S) ** 2)[:hi + 2]
        k = lo + int(np.argmax(ac[lo:hi]))
        y0, y1, y2 = ac[k - 1], ac[k], ac[k + 1]
        p = float(np.clip(0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-12), -0.5, 0.5))
        f = SR / (k + p)
        fs.append(f if f_nom / 1.15 < f < f_nom * 1.15 else np.nan)
    return np.array(ts), np.array(fs)


def devibrato(x, f_nom, keep=0.12, am_keep=0.5):
    """Hold the pitch of a vibrato sample still.  keep: fraction of the pitch deviation left in (a little,
    so it is a player holding a note, not a sine); am_keep: fraction of the vibrato's amplitude wobble kept."""
    m = x.mean(0).astype(np.float64)
    ts, fs = f0_track(m, f_nom)
    ok = np.isfinite(fs)
    if ok.sum() < 20:
        return x
    fs = np.interp(np.arange(len(fs)), np.flatnonzero(ok), fs[ok])
    fs = signal.medfilt(fs, 7)
    cents = 1200 * np.log2(np.maximum(fs, 1.0) / np.median(fs[len(fs) // 8:]))
    cents = np.clip(cents, -80.0, 80.0)
    sos = signal.butter(2, 14.0, 'low', fs=1 / 0.0025, output='sos')      # keep the 5-6 Hz vibrato, drop jitter
    cents = signal.sosfiltfilt(sos, cents)
    slow = signal.sosfiltfilt(signal.butter(2, 1.2, 'low', fs=1 / 0.0025, output='sos'), cents)   # intonation drift
    dev = (cents - slow) * (1.0 - keep)
    n = x.shape[1]
    dev_s = np.interp(np.arange(n), ts, dev)
    r = 2 ** (-dev_s / 1200.0)                  # read-rate multiplier that cancels the deviation
    pos = np.concatenate([[0.0], np.cumsum(r)[:-1]])
    k = int(np.searchsorted(pos, n - 1))
    pos = pos[:k]
    idx = np.arange(n)
    y = np.stack([np.interp(pos, idx, ch) for ch in x]).astype(np.float32)
    # even out the vibrato's amplitude wobble (short envelope vs a slow one)
    p2 = y.mean(0).astype(np.float64) ** 2
    e_fast = np.sqrt(np.maximum(signal.sosfiltfilt(signal.butter(2, 18.0, 'low', fs=SR, output='sos'), p2), 0) + 1e-12)
    e_slow = np.sqrt(np.maximum(signal.sosfiltfilt(signal.butter(2, 2.0, 'low', fs=SR, output='sos'), p2), 0) + 1e-12)
    g = (e_slow / np.maximum(e_fast, 1e-6)) ** (1.0 - am_keep)
    g = np.clip(g, 0.5, 2.0)
    return (y * g[None]).astype(np.float32)


@lru_cache(maxsize=64)
def _prepared(path, pitch, keep):
    x = trim_lead(load_wav(path))
    f_nom = 440.0 * 2 ** ((pitch - 69) / 12.0)
    y = devibrato(x, f_nom, keep=keep)
    return y, loudness_ref(y, True)


def _choose(pitch, vel):
    layer = 'f' if vel >= 0.62 else 'p'
    cands = [e for e in ENTRIES if e['layer'] == layer]
    return min(cands, key=lambda e: (abs(e['pitch'] - pitch), e['pitch']))


def tuning_cents(path):
    """The engine's measured deviation of this solo-violin sample from its written pitch (library.TUNING['svln'],
    engine fix 2b, 2026-09-26).  This source reads the VSCO files itself, so before fix 2b it played every sample
    exactly as recorded: the C4 p sample is 23 cents sharp, so the Door's D-flat and C sounded 23 cents high."""
    from engine.library import TUNING
    return float(TUNING.get('svln', {}).get(os.path.basename(path), 0.0))


def svln_nv(n, rng):
    """Track source: one senza-vibrato bowed note (no portamento: every note is its own bow)."""
    x = n.x
    e = _choose(n.pitch, n.vel)
    keep = float(x.get('keep', 0.12))
    y, loud = _prepared(e['path'], e['pitch'], keep)
    shift = n.pitch - e['pitch'] - tuning_cents(e['path']) / 100.0      # the measured correction (fix 2b)
    if abs(shift) > 1e-4:
        f = Fraction(1.0 / 2 ** (shift / 12.0)).limit_denominator(1200)
        y = signal.resample_poly(y, f.numerator, f.denominator, axis=1).astype(np.float32)
    rel = float(x.get('rel', 0.12))
    off = int(float(x.get('offset', 0.0)) * SR)
    y = y[:, off:]
    total = int((n.dur + rel) * SR)
    y = y[:, :total].copy()
    a = int(n.dur * SR)
    if a < y.shape[1]:
        t = np.arange(y.shape[1] - a) / max(rel * SR, 1)
        y[:, a:] *= np.exp(-4.6 * t)[None].astype(np.float32)
    att = float(x.get('att', 0.0))
    if att > 0:
        k = min(int(att * SR), y.shape[1])
        y[:, :k] *= (np.linspace(0, 1, k) ** 1.5)[None]
    target = db(-20.0 * (1.0 - n.vel)) * 0.1
    return to_stereo(y * (target / loud)).astype(np.float32)


def svln_track(name='svln_nv', **kw):
    """The Track: close-ish solo violin, a modest hall (a straight, sincere beat: no gloss), no humanised timing
    beyond a player's 4 ms."""
    d = dict(stem='strings', gain_db=0.0, pan=-0.12, width=0.35, sends={'hall': -11, 'room': -16}, hum_ms=4,
             vel_jit=0.02, rel=0.12, credit=CREDIT,
             eq=[('peq', 3200, -4.0, 0.9), ('hs', 6500, -3.0)])      # plain, not strident: no added sweetness
    d.update(kw)
    return Track(name=name, src=('fn', svln_nv), **d)


def prewarm(pitches, vels=(0.4, 0.7), keep=0.12):
    """Compute the de-vibrato'd samples in the parent process (the forked render workers then share them)."""
    for p in pitches:
        for v in vels:
            e = _choose(nm(p), v)
            _prepared(e['path'], e['pitch'], keep)


if __name__ == '__main__':          # measure: vibrato before / after, per sample
    for e in ENTRIES[::2]:
        x = trim_lead(load_wav(e['path']))
        f_nom = 440.0 * 2 ** ((e['pitch'] - 69) / 12.0)
        y = devibrato(x, f_nom)
        out = []
        for z in (x, y):
            seg = z.mean(0)[int(0.4 * SR):int(4.4 * SR)]
            _, f = f0_track(seg, f_nom)
            ok = np.isfinite(f)
            f = np.interp(np.arange(len(f)), np.flatnonzero(ok), f[ok])
            c = 1200 * np.log2(f / np.median(f))
            c = c - signal.sosfiltfilt(signal.butter(2, 1.2, 'low', fs=400, output='sos'), c)
            fr, P = signal.welch(c, fs=400, nperseg=512)
            band = (fr > 3.5) & (fr < 8)
            out.append(float(np.sqrt(np.sum(P[band]) * (fr[1] - fr[0]))))
        print(f"{os.path.basename(e['path']):28s} vibrato band (3.5-8 Hz): raw {out[0]:5.2f} c rms -> senza "
              f"{out[1]:5.2f} c rms ({20 * np.log10(out[1] / out[0]):+.1f} dB)", flush=True)
