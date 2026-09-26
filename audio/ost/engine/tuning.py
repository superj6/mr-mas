"""Sample tuning: measure each sample's fundamental and check the library's per-sample corrections.

Fix 2 (2026-09-26).  The sampler's own calibration (sampler.detect_f0, a harmonic-product spectrum) makes
octave and twelfth errors on plucked, short and clarinet samples (the odd harmonics win), and the short sets
(pizz, stac) were never fine-tuned at all (fine_tune=False).  So a mis-pitched sample played exactly as far
off as it was recorded.  This module measures every sample with a harmonic-comb estimator that searches only
+-3 semitones around the sample's mapped pitch (so it cannot jump an octave), and library.TUNING carries the
result as a fixed per-sample correction.  The sample files are never touched.

    ../.venv-theme/bin/python -m engine.tuning                 # measure the tuned sets, print the table
    ../.venv-theme/bin/python -m engine.tuning --verify        # render every corrected sample, check <= 5 cents
    ../.venv-theme/bin/python -m engine.tuning --sets tuba_stac,hn_stac   # survey any other set (report only)

Measurement: the body of the note (plucks 30 ms -> the -30 dB point or 0.6 s; sustains 0.25-1.25 s; staccato
20-180 ms), Hann window, zero-padded FFT.  A comb over f_nom * 2^(c/1200), c = -300..+300 cents, finds the
harmonic series; then each of the first harmonics (k <= 6, within 30 dB of the strongest) is refined by a
parabola on the log spectrum and the fundamental is the magnitude-weighted median of f_k / k.
Verification renders the sample through SampleSet.render at its own pitch and a fifth up and down, with no
detune, and re-measures the result.

Fix 2b (2026-09-26): the brass and bass shorts (tuba_stac, tpt_stac, hn_stac, cb_spic), the tremolo sections
(vla_trem, vc_trem) and the solo violin (svln).  harmonic_f0 on a fixed window misreads them: a brass staccato
glides 20-150 cents through its first 200 ms (a crack, a scoop), the contrabass spiccato's bow noise fills its
first 100 ms, and a section's partials scatter +-20 cents (one strong non-harmonic partial -- vc_trem E1's second
"harmonic" sits 60 cents flat of the rest -- wins the power-weighted comb).  These sets use METHOD[set]:
  vote_f0     every harmonic votes with its own spectrum normalised to its band maximum (so no single partial
              outvotes the series), weighted to the pitch-dominant harmonics 2-6; then each harmonic's frequency
              (the interpolated peak for a single player, the power centroid for a section) weighted by dominance
              x sqrt(power) x resolution; a weighted median and a 20-cent trimmed mean, iterated to convergence.
  'short'     a frame track over the note's body (onset to its -20 dB point on a 30 ms RMS envelope, <= 0.5 s): frames >= 8 periods and
              >= 50 ms every 10 ms, weighted by power x stability (1 / (1 + |slope| / 400 c/s): the slowly moving
              part of a gliding tone sets its pitch -- Gockel, Moore & Carlyon 2001); the weighted median.
  'held'      one time-weighted mean spectrum (0.5 s frames from 0.15 s, weight 1 to 1.0 s, tapering to 0 at 3.0
              s: a held note is heard from the sample's start) -> vote_f0 with section centroids.
The older sets keep harmonic_f0 on their windows (method 'window'), so their table and verify are unchanged.
"""
from __future__ import annotations

import os
import sys

import numpy as np

from .core import SR, midi_hz

TUNED_SETS = ('harp', 'cl', 'cl_stac', 'vln_pizz', 'vla_pizz', 'vc_pizz', 'cb_pizz',
              'tuba_stac', 'tpt_stac', 'hn_stac', 'cb_spic', 'vla_trem', 'vc_trem', 'svln')      # + fix 2b
# how each set is measured (and re-measured by verify_set); a set not listed uses 'window' (harmonic_f0)
METHOD = {'tuba_stac': 'short', 'tpt_stac': 'short', 'hn_stac': 'short', 'cb_spic': 'short',
          'vla_trem': 'held', 'vc_trem': 'held', 'svln': 'held'}


def _window(x, sustained, short, scale=1.0):
    """The body of the note.  scale: time scale of a transposed render (a sample played up by r plays 1/r
    as long), so a render is measured over the same part of the note as the sample was."""
    m = x.mean(0).astype(np.float64)
    n = len(m)
    if short:
        a, b = int(0.02 * SR * scale), int(0.18 * SR * scale)
    elif sustained:
        a, b = int(0.25 * SR * scale), int(1.25 * SR * scale)
    else:
        a = int(0.04 * SR * scale)
        env = np.sqrt(np.convolve(m ** 2, np.ones(480) / 480, mode='same'))
        pk = env[:int(0.2 * SR * scale) + 480].max() if n else 0.0
        below = np.nonzero(env[a:] < pk * 10 ** (-30 / 20))[0]
        b = a + (int(below[0]) if len(below) else n - a)
        b = min(b, a + int(0.6 * SR * scale))
        b = max(b, a + int(0.12 * SR * scale))
    b = min(b, n)
    if b - a < int(0.04 * SR):                           # a very short sample: take what there is
        a, b = min(int(0.01 * SR), n // 4), n
    return m[a:b]


def _spectrum(seg, min_n=1 << 18):
    seg = seg * np.hanning(len(seg))
    N = max(min_n, 1 << int(np.ceil(np.log2(len(seg) * 8))))
    S = np.abs(np.fft.rfft(seg, N))
    return np.fft.rfftfreq(N, 1 / SR), S


def _peak(f, S, fc, cents):
    lo, hi = fc * 2 ** (-cents / 1200), fc * 2 ** (cents / 1200)
    i0, i1 = np.searchsorted(f, lo), np.searchsorted(f, hi)
    if i1 - i0 < 3 or i1 >= len(S) - 1:
        return None, 0.0
    i = i0 + int(np.argmax(S[i0:i1]))
    if i in (i0, i1 - 1):                               # on the window edge: not a peak of this harmonic
        return None, 0.0
    y0, y1, y2 = np.log(S[i - 1] + 1e-20), np.log(S[i] + 1e-20), np.log(S[i + 1] + 1e-20)
    d = y0 - 2 * y1 + y2
    p = float(np.clip(0.5 * (y0 - y2) / d, -0.5, 0.5)) if d < 0 else 0.0
    return f[i] + p * (f[1] - f[0]), float(S[i])


def _centroid(f, P, fc, cents):
    """Power-weighted mean frequency of the band fc +- cents (above the band's floor): an ensemble's centre."""
    lo, hi = fc * 2 ** (-cents / 1200), fc * 2 ** (cents / 1200)
    i0, i1 = np.searchsorted(f, lo), np.searchsorted(f, hi)
    if i1 - i0 < 3:
        return None, 0.0
    w = P[i0:i1] - P[i0:i1].min()
    if w.sum() <= 0:
        return None, 0.0
    return float((f[i0:i1] * w).sum() / w.sum()), float(w.sum())


def harmonic_f0(seg, f_nom, search_cents=300.0, kmax=8, K=None):
    """-> (f0_hz, info).  f_nom: the pitch the sample is mapped to (Hz).

    1. A comb over f_nom * 2^(c/1200), c = -300..+300 cents, finds the series (no octave jumps possible).
    2. Each harmonic k <= kmax within 30 dB of the strongest gives f_k / k, from the power-weighted centre of
       its band (+-40 cents): for an ensemble (the pizz sections) that is the section's centre, for a solo
       string its partial.  Weights: band power x k^2 (a high partial pins the pitch k times finer) /
       (1 + (k/4)^2) (but it is stretched sharp on a string).  Estimates > 20 cents from the weighted median
       are dropped, then the weighted mean is the fundamental."""
    f, S = _spectrum(seg)
    P = S ** 2
    K = K or int(max(1, min(kmax, 5000.0 // max(f_nom, 1.0))))
    cs = np.arange(-search_cents, search_cents + 0.5, 1.0)
    f0s = f_nom * 2 ** (cs / 1200)
    score = np.zeros(len(cs))
    for k in range(1, K + 1):
        score += np.interp(k * f0s, f, S) / np.sqrt(k)
    c0 = cs[int(np.argmax(score))]
    f_est = f_nom * 2 ** (c0 / 1200)
    for _ in range(2):
        ks, ests, pw = [], [], []
        for k in range(1, K + 1):
            fk, pk = _centroid(f, P, k * f_est, 40.0)
            if fk is not None:
                ks.append(k)
                ests.append(fk / k)
                pw.append(pk)
        if not ests:
            return f_est, dict(n=0, spread_c=None, comb_c=float(c0))
        ks, ests, pw = np.array(ks), np.array(ests), np.array(pw)
        keep = pw >= pw.max() * 1e-3
        ks, ests, pw = ks[keep], ests[keep], pw[keep]
        w = pw * ks ** 2 / (1 + (ks / 4.0) ** 2)
        o = np.argsort(ests)
        med = ests[o][np.searchsorted(np.cumsum(w[o]) / w.sum(), 0.5)]
        ok = np.abs(1200 * np.log2(ests / med)) <= 20.0
        f_est = float((ests[ok] * w[ok]).sum() / w[ok].sum())
    spread = float(1200 * np.log2(ests[ok].max() / ests[ok].min())) if ok.sum() > 1 else 0.0
    return f_est, dict(n=int(ok.sum()), spread_c=round(spread, 1), comb_c=float(c0), K=K)


def _yin_frame(x, sr, t_lo, t_hi, W):
    x0 = x[:W]
    taus = np.arange(1, t_hi + 1)
    d = np.array([np.sum((x0 - x[t:t + W]) ** 2) for t in taus])
    cm = d * taus / np.maximum(np.cumsum(d), 1e-30)
    sel = np.arange(max(t_lo, 2), t_hi - 1)
    i = int(sel[np.argmin(cm[sel - 1])])               # cm[i - 1] belongs to lag i
    y0, y1, y2 = cm[i - 2], cm[i - 1], cm[i]
    den = y0 - 2 * y1 + y2
    p = 0.5 * (y0 - y2) / den if den > 0 else 0.0
    return sr / (i + float(np.clip(p, -1, 1)))


def yin_f0(seg, f_nom, cents=150.0, hop_s=0.04, win_s=0.06):
    """Independent time-domain check: YIN's cumulative-mean-normalised difference on 4x-upsampled frames across
    the whole segment (median of the frames).  It reads the waveform's period, so stretched upper partials pull
    it a few cents sharp of the fundamental on wound low strings; it is a cross-check, not the measure."""
    from scipy import signal
    x = signal.resample_poly(seg, 4, 1)
    sr = 4 * SR
    t_lo = int(np.floor(sr / (f_nom * 2 ** (cents / 1200))))
    t_hi = int(np.ceil(sr / (f_nom * 2 ** (-cents / 1200)))) + 2
    W = max(int(win_s * sr), 2 * t_hi)
    out = []
    for a in range(0, len(x) - W - t_hi - 1, int(hop_s * sr)):
        out.append(_yin_frame(x[a:], sr, t_lo, t_hi, W))
    return float(np.median(out)) if out else None


def cents(f, f_ref):
    return float(1200 * np.log2(f / f_ref))


# ====================================================================== fix 2b: the vote estimator, 'short' and 'held'
def dominance(k):
    """Pitch dominance of harmonic k: the 2nd-6th carry the pitch of a complex tone; the fundamental (often weak,
    or pulled by a body resonance on a low string) and the high partials (stretched) count less."""
    return 0.6 if k == 1 else 1.0 if k <= 6 else 0.7 if k <= 8 else 0.5


def spectrum_of(seg, min_n=1 << 18):
    """-> (f, S, T): the Hann-windowed magnitude spectrum of seg and its length in seconds."""
    seg = np.asarray(seg, dtype=np.float64)
    f, S = _spectrum(seg, min_n)
    return f, S, len(seg) / SR


def held_spectrum(m, a_s=0.15, full_s=1.0, end_s=3.0, fl_s=0.5, hop_s=0.1, scale=1.0, min_n=1 << 18):
    """-> (f, S, T): the time-weighted mean spectrum of a held note: fl_s frames every hop_s from a_s, weight 1 up
    to full_s then a linear taper to 0 at end_s.  scale: the time scale of a transposed render (all times are the
    sample's own)."""
    L = int(fl_s * SR * scale)
    if len(m) < int(a_s * SR * scale) + L:
        return spectrum_of(m[int(min(a_s, 0.05) * SR * scale):], min_n)
    N = max(min_n, 1 << int(np.ceil(np.log2(L * 8))))
    win = np.hanning(L)
    acc, wsum, t = None, 0.0, a_s
    while t <= end_s:
        i0 = int(round(t * SR * scale))
        if i0 + L > len(m):
            break
        tc = t + fl_s / 2
        w = 1.0 if tc <= full_s else max(0.0, (end_s - tc) / (end_s - full_s))
        if w > 0:
            P = np.abs(np.fft.rfft(m[i0:i0 + L] * win, N)) ** 2
            acc = P * w if acc is None else acc + P * w
            wsum += w
        t += hop_s
    return np.fft.rfftfreq(N, 1 / SR), np.sqrt(acc / wsum), fl_s * scale


def vote_f0(spec, f_nom, search=300.0, center_c=0.0, K=None, mode='centroid', floor_db=-40.0):
    """spec = (f, S, T) (spectrum_of / held_spectrum).  -> (f0_hz, info).
    1. Vote: each harmonic k <= K votes over f_nom * 2^(c/1200), c = center_c +- search (so no octave jump), with
       its spectrum normalised to its own band maximum and weighted by dominance(k): the series wins by
       consensus, not by its strongest partial.
    2. Refine: each harmonic's frequency -- mode 'peak' the interpolated spectral peak (a single player), mode
       'centroid' the power centroid of a band at least 1.5 main lobes (>= 30 cents) wide (a section's centre) --
       weighted by dominance x sqrt(relative power) x resolution (a partial less than a lobe from its neighbours
       in cents counts less), combined by a Cauchy M-estimate (scale 12 cents) from the vote's answer, iterated
       until it moves < 0.02 cent (continuous in the input: a transposed render reads the same)."""
    f, S, T = spec
    P = S ** 2
    K = K or int(max(2, min(10, 5000.0 // max(f_nom, 1.0))))
    cs = np.arange(center_c - search, center_c + search + 0.5, 1.0)
    f0s = f_nom * 2 ** (cs / 1200)
    score = np.zeros(len(cs))
    i_lo, i_hi = np.searchsorted(f, f0s[0] * 0.9), np.searchsorted(f, K * f0s[-1] * 1.1)
    gmax = S[i_lo:max(i_hi, i_lo + 2)].max() + 1e-20
    votes = 0
    for k in range(1, K + 1):
        i0 = np.searchsorted(f, k * f0s[0] * 2 ** (-60 / 1200))
        i1 = np.searchsorted(f, k * f0s[-1] * 2 ** (60 / 1200))
        if i1 - i0 < 3:
            continue
        smax = S[i0:i1].max()
        if smax < gmax * 10 ** (floor_db / 20):
            continue
        votes += 1
        score += dominance(k) * np.interp(k * f0s, f, S) / smax
    c0 = float(cs[int(np.argmax(score))])
    f_est = f_nom * 2 ** (c0 / 1200)
    info = dict(comb_c=c0, K=K, votes=votes)
    ks = ests = ok = None
    for _ in range(30):
        rows = []
        for k in range(1, K + 1):
            fc = k * f_est
            lobe = 1200 * np.log2(1 + 2.0 / (T * fc))             # Hann main-lobe half width, in cents
            if mode == 'peak':
                fk, pk = _peak(f, S, fc, max(40.0, 1.2 * lobe))
                pk = pk ** 2 if fk is not None else 0.0
            else:
                fk, pk = _centroid(f, P, fc, min(250.0, max(30.0, 1.5 * lobe)))
            if fk is None or pk <= 0:
                continue
            rows.append((k, fk / k, pk, min(1.0, (30.0 / max(30.0, lobe)) ** 2)))
        if not rows:
            return f_est, dict(info, n=0)
        ks = np.array([r[0] for r in rows])
        ests = np.array([r[1] for r in rows])
        pw = np.array([r[2] for r in rows])
        res = np.array([r[3] for r in rows])
        keep = pw >= pw.max() * 10 ** (-35 / 10)
        ks, ests, pw, res = ks[keep], ests[keep], pw[keep], res[keep]
        w = np.array([dominance(k) for k in ks]) * np.sqrt(pw / pw.max()) * res
        d = 1200 * np.log2(ests / f_est)
        wr = w / (1.0 + (d / 12.0) ** 2)                 # a Cauchy M-estimate (continuous: no partial flips in
        ok = np.abs(d) <= 20.0                           # or out as the input moves a cent)
        f_new = float((ests * wr).sum() / wr.sum())
        moved = abs(1200 * np.log2(f_new / f_est))
        f_est = f_new
        if moved < 0.02:
            break
    spread = float(1200 * np.log2(ests[ok].max() / ests[ok].min())) if ok.sum() > 1 else 0.0
    return f_est, dict(info, n=int(ok.sum()), spread_c=round(spread, 1))


def _env_db(m, scale=1.0):
    """The RMS envelope (dB re its peak) over 30 ms (x the render's time scale): longer than a period of the
    lowest notes (a 10 ms window ripples on a 40 Hz tone, and the -20 dB point would move with transposition)."""
    w = max(1, int(0.03 * SR * scale))
    c = np.concatenate([[0.0], np.cumsum(m.astype(np.float64) ** 2)])
    env = np.empty(len(m))
    h = w // 2
    i = np.arange(len(m))
    lo, hi = np.clip(i - h, 0, len(m)), np.clip(i - h + w, 0, len(m))
    env[:] = np.sqrt(np.maximum(c[hi] - c[lo], 0.0) / w) + 1e-12
    return 20 * np.log10(env / env.max())


def _wmedian(v, w):
    o = np.argsort(v)
    c = np.cumsum(w[o]) / w.sum()
    return float(v[o][min(int(np.searchsorted(c, 0.5)), len(v) - 1)])


def short_body(m, scale=1.0):
    """(a, b) in samples: a short note's body, from the onset to its -20 dB point after the peak (0.12-0.5 s)."""
    e = _env_db(m[:int(0.8 * SR * scale)], scale)
    ipk = int(np.argmax(e))
    below = np.nonzero(e[ipk:] < -20.0)[0]
    b = ipk + (int(below[0]) if len(below) else len(e) - ipk)
    b = min(max(b, int(0.12 * SR * scale)), int(0.5 * SR * scale), len(m))
    return int(0.005 * SR * scale), b


def short_f0(x, f_nom, scale=1.0, K=None, frames=False):
    """A short note (stac / spic) -> (f0_hz, info[, (t_s, cents, weights)]).  The whole body votes for the series
    first; then frames (>= 8 periods, >= 50 ms, every 10 ms, within 25 dB of the peak) each vote within 150 cents
    of it; the frames' weighted median, weights = power x 1 / (1 + |slope| / 400 cents per second)."""
    m = x.mean(0).astype(np.float64) if np.ndim(x) == 2 else np.asarray(x, dtype=np.float64)
    a, b = short_body(m, scale)
    f_all, info_all = vote_f0(spectrum_of(m[a:b]), f_nom, K=K, mode='peak')
    K = info_all['K']
    c_all = cents(f_all, f_nom)
    L = int(max(0.05 * SR * scale, 8 * SR / f_all))       # 8 periods of the note as played (transposition-invariant)
    hop = max(1, int(round(0.01 * SR * scale)))
    e = _env_db(m, scale)
    ts, cs, ws = [], [], []
    for i0 in range(a, max(a + 1, b - L + 1), hop):
        i1 = i0 + L
        if i1 > len(m):
            break
        if float(np.max(e[i0:i1])) < -25.0:
            continue
        f0, inf = vote_f0(spectrum_of(m[i0:i1], 1 << 16), f_nom, search=150.0, center_c=c_all, K=K, mode='peak')
        c = cents(f0, f_nom)
        if inf.get('n', 0) == 0 or abs(c - c_all) > 145:
            continue
        ts.append((i0 + i1) / 2 / SR / scale)
        cs.append(c)
        ws.append(float(np.mean(m[i0:i1] ** 2)))
    if len(cs) < 3:
        out = (f_all, dict(info_all, frames=len(cs), method='short'))
        return out + (None,) if frames else out
    ts, cs, ws = np.array(ts), np.array(cs), np.array(ws)
    wst = ws / (1.0 + np.abs(np.gradient(cs, ts)) / 400.0)
    c_med = _wmedian(cs, wst)
    q = np.percentile(cs, [10, 90])
    info = dict(info_all, frames=int(len(cs)), whole_c=round(float(c_all), 1), glide_c=round(float(q[1] - q[0]), 1),
                method='short')
    out = (f_nom * 2 ** (c_med / 1200), info)
    return out + ((ts, cs, wst),) if frames else out


def held_f0(x, f_nom, scale=1.0, K=None):
    """A held note (tremolo sections, the vibrato solo violin) -> (f0_hz, info): vote_f0 with section centroids on
    the time-weighted mean spectrum (held_spectrum)."""
    m = x.mean(0).astype(np.float64) if np.ndim(x) == 2 else np.asarray(x, dtype=np.float64)
    f0, info = vote_f0(held_spectrum(m, scale=scale), f_nom, K=K, mode='centroid')
    return f0, dict(info, method='held')


def short_yin(x, f_ref, frame_track):
    """Independent time-domain cross-check of short_f0: YIN on the same frames, the same weights (cents re f_ref)."""
    ts, cs, ws = frame_track
    m = x.mean(0).astype(np.float64) if np.ndim(x) == 2 else np.asarray(x, dtype=np.float64)
    L_s = max(0.05, 8 / f_ref)
    out = []
    for t in ts:
        i0 = max(0, int((t - L_s / 2) * SR))
        seg = m[i0:i0 + int(L_s * SR)]
        y = yin_f0(seg, f_ref, cents=160.0, hop_s=0.01, win_s=min(0.04, L_s / 3))
        out.append(cents(y, f_ref) if y else np.nan)
    out = np.array(out)
    ok = np.isfinite(out)
    return _wmedian(out[ok], ws[ok]) if ok.sum() >= 3 else None


def note_f0(x, f_nom, method, scale=1.0, K=None):
    """The fix-2b measurement of one sample (or render) by METHOD: 'short' or 'held'.  -> (f0_hz, info)."""
    if method == 'short':
        return short_f0(x, f_nom, scale=scale, K=K)
    return held_f0(x, f_nom, scale=scale, K=K)


def measure_set(name, raw=True):
    """Measure every sample of a pitched set against its mapped pitch.  raw=True ignores any TUNING entry, so
    the result is the sample's own deviation.  -> list of rows."""
    from . import library
    from .sampler import load_wav, trim_lead
    spec = library.SETS[name]
    ss = library.get(name)
    short = (not spec.get('sustained', True)) and any(k in name for k in ('stac', 'spic', 'short'))
    method = METHOD.get(name, 'window')
    rows = []
    for e in ss.entries:
        x = trim_lead(load_wav(e['path']))
        f_nom = midi_hz(e['pitch'])
        if method == 'short':
            f0, info, fr = short_f0(x, f_nom, frames=True)
            yc = short_yin(x, f0, fr) if fr is not None else None
            y = f0 * 2 ** (yc / 1200) if yc is not None else None
        elif method == 'held':
            f0, info = held_f0(x, f_nom)
            y = yin_f0(x.mean(0)[int(0.2 * SR):int(2.5 * SR)], f0)
        else:
            seg = _window(x, ss.sustained, short)
            f0, info = harmonic_f0(seg, f_nom)
            y = yin_f0(seg, f0) if f0 else None
        rows.append(dict(set=name, file=os.path.basename(e['path']), path=e['path'], pitch=e['pitch'], vel=e['vel'],
                         f0=round(f0, 4), cents=round(cents(f0, f_nom), 1),
                         yin_cents=round(cents(y, f_nom), 1) if y else None,
                         engine_cents_before=round(e.get('cents_hps', e['cents']), 1), **info))
    return rows


def table_block(rows_by_set):
    """The TUNING literal for library.py: {set: {file: cents}}; every measured sample of the tuned sets."""
    out = ['TUNING = {']
    for name, rows in rows_by_set.items():
        out.append(f'    {name!r}: {{')
        for r in sorted(rows, key=lambda r: (r['pitch'], r['vel'], r['file'])):
            out.append(f"        {r['file']!r}: {r['cents']:+.1f},")
        out.append('    },')
    out.append('}')
    return '\n'.join(out)


def zone(ss, e, cap=7):
    """The transpositions (semitones) the sampler will actually ask of sample e: the pitches for which its
    velocity layer has no nearer sample (capped at `cap`, and at the set's max_stretch)."""
    others = sorted({o['pitch'] for o in ss.entries if o['vel'] == e['vel'] and o['pitch'] != e['pitch']})
    lo = [p for p in others if p < e['pitch']]
    hi = [p for p in others if p > e['pitch']]
    cap = min(cap, ss.max_stretch) if ss.max_stretch is not None else cap
    down = min(cap, int((e['pitch'] - lo[-1]) // 2)) if lo else cap
    up = min(cap, int((hi[0] - e['pitch']) // 2)) if hi else cap
    return -down, up


def verify_set(name, tol=5.0, shifts=None):
    """Render every sample of a set through SampleSet.render (no detune) at its own pitch and at the two ends of
    its zone (the furthest the sampler transposes it, <= a fifth), and re-measure the render over the same part of the note (the window follows the transposition's
    time scale, and the same harmonics are used as for the sample, so a fifth down does not trade the
    fundamental for a different set of partials).  -> rows with the error in cents from the written pitch."""
    from . import library
    from .sampler import load_wav, trim_lead
    ss = library.get(name)
    short = any(k in name for k in ('stac', 'spic', 'short'))
    method = METHOD.get(name, 'window')
    rows = []
    for e in ss.entries:
        x0 = trim_lead(load_wav(e['path']))
        if method == 'window':
            _, info0 = harmonic_f0(_window(x0, ss.sustained, short), midi_hz(e['pitch']))
        else:
            _, info0 = note_f0(x0, midi_hz(e['pitch']), method)
        for sh in (shifts or sorted({0, *zone(ss, e)})):
            target = e['pitch'] + sh
            shift = target - e['pitch'] - e['cents'] / 100.0            # what SampleSet.render transposes by
            scale = 2 ** (-shift / 12.0)
            dur = max(4.0, 3.2 * scale + 0.5) if method == 'held' else 4.0      # a held set is read to 3 s
            y = _render_entry(ss, e, target, np.random.default_rng(0), dur=dur)
            f_t = midi_hz(target)
            if method == 'window':
                f0, info = harmonic_f0(_window(y, ss.sustained, short, scale=scale), f_t, K=info0.get('K'))
            else:
                f0, info = note_f0(y, f_t, method, scale=scale, K=info0.get('K'))
            err = cents(f0, f_t)
            rows.append(dict(set=name, file=os.path.basename(e['path']), vel=e['vel'], target=target, shift=sh,
                             correction_cents=round(e['cents'], 1), err_cents=round(err, 2), ok=abs(err) <= tol))
    return rows


def _render_entry(ss, e, pitch, rng, dur=4.0):
    orig = ss.choose
    ss.choose = lambda *a, **k: e
    try:
        return ss.render(pitch, 0.7, dur, rng, rel_s=0.3, detune_cents=0.0)     # long: the release never
    finally:                                                                        # reaches the window
        ss.choose = orig


def main(argv=None):
    import argparse
    import json
    ap = argparse.ArgumentParser()
    ap.add_argument('--sets', default=','.join(TUNED_SETS))
    ap.add_argument('--verify', action='store_true')
    ap.add_argument('--json', default=None)
    ap.add_argument('--block', action='store_true', help='print the TUNING literal for library.py')
    a = ap.parse_args(argv)
    names = [s for s in a.sets.split(',') if s]
    if a.verify:
        bad = 0
        allrows = []
        for nm in names:
            rows = verify_set(nm)
            allrows += rows
            worst = max(rows, key=lambda r: abs(r['err_cents']))
            nbad = sum(not r['ok'] for r in rows)
            bad += nbad
            w0 = max((r for r in rows if r['shift'] == 0), key=lambda r: abs(r['err_cents']))
            print(f'{nm:10s} {len(rows):4d} renders  worst {worst["err_cents"]:+6.2f} c ({worst["file"]} '
                  f'{worst["shift"]:+d} st)  at its own pitch {w0["err_cents"]:+5.2f} c  over 5 c: {nbad}')
        if a.json:
            with open(a.json, 'w') as fh:
                json.dump(allrows, fh, indent=1)
        return 1 if bad else 0
    by = {}
    for nm in names:
        by[nm] = measure_set(nm)
        for r in sorted(by[nm], key=lambda r: (r['pitch'], r['vel'], r['file'])):
            print(f"{nm:9s} {r['file']:42s} p={r['pitch']:5.1f} v{r['vel']} {r['cents']:+7.1f} c "
                  f"(yin {r['yin_cents'] if r['yin_cents'] is not None else float('nan'):+7.1f}, "
                  f"{r['n']} partials, spread {r['spread_c']}, engine had {r['engine_cents_before']:+.1f})")
    if a.json:
        with open(a.json, 'w') as fh:
            json.dump({k: v for k, v in by.items()}, fh, indent=1, default=float)
    if a.block:
        print(table_block(by))
    return 0


if __name__ == '__main__':
    sys.exit(main())
