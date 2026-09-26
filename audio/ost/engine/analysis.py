"""QC without ears: loudness, spectrum, onsets vs written hits, loop seams, stem sums, piano rolls.

    from engine import analysis as A
    A.loudness(x)                 -> {lufs, lra, true_peak_db, peak_db, rms_db, crest_db, seconds}
    A.bands(x)                    -> dB per band (sub / bass / low-mid / mid / presence / air), centroid
    A.hits(x, times)              -> for each written hit time: the nearest detected onset (ms offset)
    A.loop_seam(loop)             -> click check across the wrap (HF energy at the seam vs elsewhere)
    A.bar_levels(x, grid)         -> short-term loudness per bar (the dynamic arc)
    A.family_share(stems)         -> each stem's loudness relative to the mix
    A.chroma(x, t0, t1)           -> pitch-class energy (e.g. 'is there a third in the title chord?')
    A.piano_roll(notes, grid, png, tracks=..., loop=..., markers=..., level=x)
"""
from __future__ import annotations

import numpy as np
from scipy import signal

from .core import SR, FAMILIES, to_stereo, hp, todb
from .mix import lufs, true_peak, lra, short_term_lufs, k_weight

BANDS = [('sub', 20, 60), ('bass', 60, 250), ('lowmid', 250, 1000), ('mid', 1000, 4000), ('presence', 4000, 8000),
         ('air', 8000, 18000)]


def loudness(x):
    x = to_stereo(x)
    pk = float(np.abs(x).max()) + 1e-12
    rms = float(np.sqrt(np.mean(x.astype(np.float64) ** 2))) + 1e-12
    L = lufs(x) if x.shape[1] > int(0.5 * SR) else float('nan')
    return dict(lufs=round(L, 2), lra=round(lra(x), 2) if x.shape[1] > 3 * SR else None,
                true_peak_db=round(todb(true_peak(x)), 2), peak_db=round(todb(pk), 2), rms_db=round(todb(rms), 2),
                crest_db=round(todb(pk) - todb(rms), 2), seconds=round(x.shape[1] / SR, 4))


def bands(x):
    m = to_stereo(x).mean(0).astype(np.float64)
    f, P = signal.welch(m, SR, nperseg=8192)
    tot = P.sum() + 1e-20
    out = {}
    for name, a, b in BANDS:
        sel = (f >= a) & (f < b)
        out[name] = round(10 * np.log10(P[sel].sum() / tot + 1e-12), 1)
    out['centroid_hz'] = round(float((f * P).sum() / tot), 0)
    return out


def onset_env(x, hop=128):
    m = to_stereo(x).mean(0)
    f, t, Z = signal.stft(m, SR, nperseg=1024, noverlap=1024 - hop)
    mag = np.log1p(np.abs(Z) * 100)
    flux = np.maximum(np.diff(mag, axis=1), 0).sum(0)
    tt = t[1:]
    return tt, flux


def onsets(x, thresh=1.8, min_gap=0.05):
    tt, fl = onset_env(x)
    med = signal.medfilt(fl, 61) + 1e-9
    r = fl / med
    pk, _ = signal.find_peaks(r, height=thresh, distance=max(1, int(min_gap * SR / 128)))
    return tt[pk], r[pk]


def hits(x, times, window=0.06):
    """For each written hit time: the onset nearest it within +-window.  The onset time is where the
    spectral flux first reaches half of its local peak (the attack's start, not its steepest point)."""
    tt, fl = onset_env(x)
    med = signal.medfilt(fl, 61) + 1e-9
    r = fl / med
    out = []
    for t in times:
        sel = np.nonzero((tt >= t - window) & (tt <= t + window))[0]
        if not len(sel):
            out.append(dict(t=round(t, 4), offset_ms=None, strength=0.0))
            continue
        i = sel[np.argmax(r[sel])]
        j = i
        while j > sel[0] and r[j - 1] >= 0.5 * r[i]:
            j -= 1
        out.append(dict(t=round(t, 4), offset_ms=round((tt[j] - t) * 1000, 1), strength=round(float(r[i]), 2)))
    return out


def loop_seam(loop, win_ms=3.0):
    """Click detector across the loop wrap: tile [loop, loop], high-pass at 6 kHz, and compare the
    short-window HF energy at the seam with the distribution everywhere else.
    ratio_to_median ~1-3 is normal music; a click shows as a large ratio AND a top-percentile rank
    (and a raw sample jump many times the typical step)."""
    x = to_stereo(loop).astype(np.float64)
    n = x.shape[1]
    tile = np.concatenate([x, x], axis=1)
    h = hp(tile.mean(0), 6000, 4)
    w = max(8, int(win_ms / 1000 * SR))
    e = np.convolve(h ** 2, np.ones(w) / w, mode='same')
    seam = e[n - w:n + w].max()
    body = e[w:n - w]
    med = np.median(body) + 1e-20
    rank = float((body < seam).mean())
    step = np.abs(np.diff(tile, axis=1)).max(0)
    typical = np.percentile(step[:n - 1], 99) + 1e-12
    wrap_jump = float(np.abs(x[:, 0] - x[:, -1]).max())
    return dict(seam_hf_ratio_to_median=round(float(seam / med), 2), seam_hf_percentile=round(rank * 100, 2),
                wrap_jump=round(wrap_jump, 5), wrap_jump_vs_p99_step=round(wrap_jump / typical, 3),
                rms_last_50ms_db=round(todb(np.sqrt(np.mean(x[:, -int(0.05 * SR):] ** 2))), 1),
                rms_first_50ms_db=round(todb(np.sqrt(np.mean(x[:, :int(0.05 * SR)] ** 2))), 1),
                verdict='seamless' if (wrap_jump / typical < 1.0 and rank < 0.999) else 'CHECK')


def stems_residual(stems, master):
    s = sum(stems.values())
    n = min(s.shape[1], master.shape[1])
    r = s[:, :n] - master[:, :n]
    return round(todb(np.sqrt(np.mean(r.astype(np.float64) ** 2)) + 1e-15), 1)


def bar_levels(x, grid, bars=None):
    x = to_stereo(x)
    out = []
    b1 = (grid.bars or 1) + 1 if bars is None else bars[1]
    b0 = 1 if bars is None else bars[0]
    for b in range(b0, b1):
        a, e = int(grid.t(b) * SR), int(grid.t(b + 1) * SR)
        seg = x[:, a:e]
        if seg.shape[1] < 64:
            continue
        out.append(dict(bar=b, rms_db=round(todb(np.sqrt(np.mean(seg.astype(np.float64) ** 2))), 1),
                        peak_db=round(todb(np.abs(seg).max()), 1)))
    return out


def family_share(stems):
    mix = sum(stems.values())
    L = lufs(mix)
    out = {}
    for k, v in stems.items():
        if np.abs(v).max() < 1e-6:
            continue
        out[k] = round(lufs(v) - L, 1)
    return out


def _fund_chroma(f, S, fmin, fmax, tol=0.005, kmax=8):
    """Fundamental-only chroma: spectral peaks that sit on a harmonic (x2..x8, within tol) of a lower peak at
    least a quarter as strong are CREDITED to that fundamental's pitch class, so a low F's 5th partial counts
    as F, not as a written A."""
    from scipy.signal import find_peaks
    S = np.nan_to_num(np.asarray(S, dtype=np.float64), nan=0.0, posinf=0.0, neginf=0.0)
    P = S ** 2
    sel = (f > fmin) & (f < fmax * 4)
    Pm = np.where(sel, P, 0.0)
    c = np.zeros(12)
    if not np.any(Pm > 0):
        return c
    pk, _ = find_peaks(Pm, height=Pm.max() * 1e-6)
    funds = []
    df = f[1] - f[0]
    lm = np.log(P + 1e-30)

    def fr(i):
        """Parabolic peak refinement (sub-bin frequency).  Fix 3 (2026-09-26): only at a true local maximum of
        the UNmasked spectrum, and the vertex clamped to +-0.5 bin.  The old code also 'refined' the skirt that
        the fmin mask turns into a peak (P[i-1] > P[i]); with a near-zero curvature the vertex flew millions of
        bins away, the frequency went negative and log2() gave NaN -> int(round(nan)) raised ValueError."""
        if 0 < i < len(P) - 1 and lm[i] >= lm[i - 1] and lm[i] >= lm[i + 1]:
            d = lm[i - 1] - 2 * lm[i] + lm[i + 1]
            if d < 0:
                return f[i] + float(np.clip(0.5 * (lm[i - 1] - lm[i + 1]) / d, -0.5, 0.5)) * df
        return f[i]
    for i in pk[np.argsort(f[pk])]:
        fi = fr(i)
        if not (np.isfinite(fi) and fi > 0):
            continue
        pw = P[max(0, i - 2):i + 3].sum()
        owner = None
        for j, fj, pj in funds:
            k = round(fi / fj)
            if 2 <= k <= kmax and abs(fi / (k * fj) - 1) < tol and pj >= 0.25 * pw:
                owner = fj
                break
        tgt = owner if owner is not None else fi
        if tgt < fmax:
            c[int(round(12 * np.log2(tgt / 440.0) + 69)) % 12] += pw
        if owner is None:
            funds.append((i, fi, pw))
    return c


PC_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']


def pc_energy(x, t0=0.0, t1=None, fmin=55.0, fmax=2000.0, sieve=False):
    """ABSOLUTE pitch-class energy (12 floats, C..B) of the mono sum in [t0, t1): the un-normalised chroma, so the
    classes of different stems can be compared with the mix's (the F-major attribution)."""
    m = to_stereo(x).mean(0)
    a = max(0, int(t0 * SR))
    b = min(len(m), int(t1 * SR) if t1 else len(m))
    if b - a < 64:
        return np.zeros(12)
    seg = np.nan_to_num(m[a:b].astype(np.float64)) * np.hanning(b - a)
    S = np.abs(np.fft.rfft(seg))
    f = np.fft.rfftfreq(len(seg), 1 / SR)
    if sieve:
        return _fund_chroma(f, S, fmin, fmax)
    sel = (f > fmin) & (f < fmax)
    pc = np.round(12 * np.log2(f[sel] / 440.0) + 69).astype(int) % 12
    return np.bincount(pc, weights=S[sel] ** 2, minlength=12)


def chroma(x, t0=0.0, t1=None, fmin=55.0, fmax=2000.0, sieve=False):
    """Pitch-class energy in [t0, t1) (relative to the strongest class).  sieve=True credits every partial
    that is a harmonic of a lower one to that fundamental (a fundamental-only reading)."""
    c = pc_energy(x, t0, t1, fmin, fmax, sieve)
    c = c / (c.max() + 1e-20)
    return {PC_NAMES[i]: round(float(c[i]), 3) for i in range(12)}


FAM_COLOR = {'piano': '#3a6ea5', 'strings': '#b5543c', 'winds': '#6a9a3a', 'brass': '#d9a21b', 'bass': '#5b4a8a',
             'drums': '#555555', 'perc': '#8a6d3b', 'chip': '#18a3a3', 'synth': '#a04a8a', 'fx': '#999999'}


def piano_roll(notes, grid, path, tracks=None, title='', loop=None, markers=(), sections=(), level=None,
               length_s=None, shade=()):
    """PNG: notes as bars (y = pitch, colour = stem family), bar lines, the loop region shaded, markers,
    and (if level is given) the short-term loudness of the mix underneath."""
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    L = length_s or max((n.start + n.dur for n in notes), default=1.0)
    fig, axes = plt.subplots(2 if level is not None else 1, 1, figsize=(max(10, min(40, L / 2.2)), 7 if level is not None else 5.5),
                             sharex=True, gridspec_kw=dict(height_ratios=[4, 1]) if level is not None else None)
    ax = axes[0] if level is not None else axes
    for n in notes:
        fam = tracks[n.inst].stem if tracks and n.inst in tracks else 'fx'
        ax.add_patch(plt.Rectangle((n.start, n.pitch - 0.4), max(n.dur, 0.02), 0.8, color=FAM_COLOR.get(fam, '#999'),
                                   alpha=0.35 + 0.6 * n.vel, lw=0))
    ps = [n.pitch for n in notes] or [60]
    ax.set_ylim(min(ps) - 2, max(ps) + 2)
    ax.set_xlim(0, L)
    b = 1
    while grid.t(b) <= L + 1e-6 and b < 2000:
        t = grid.t(b)
        ax.axvline(t, color='#bbb', lw=0.6, zorder=0)
        ax.text(t + 0.02, max(ps) + 1.2, str(b), fontsize=6, color='#777')
        b += 1
    if loop:
        ax.axvspan(loop[0], loop[1], color='#18a3a3', alpha=0.07)
        ax.text(loop[0], min(ps) - 1.6, 'loop', fontsize=7, color='#18a3a3')
    for t, lab in markers:
        ax.axvline(t, color='#c0392b', lw=0.8, ls='--')
        ax.text(t + 0.03, min(ps) - 1.0, lab, fontsize=7, color='#c0392b', rotation=90, va='bottom')
    for lab, a, e in sections:
        ax.text(a + 0.05, max(ps) + 0.3, lab, fontsize=8, color='#333', weight='bold')
    for a, e, lab in shade:
        ax.axvspan(a, e, color='#c0392b', alpha=0.10)
        ax.text(a + 0.03, max(ps) - 1.5, lab, fontsize=6, color='#c0392b')
    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for f, c in FAM_COLOR.items()]
    ax.legend(handles, list(FAM_COLOR), fontsize=6, ncol=10, loc='upper right', framealpha=0.6)
    ax.set_ylabel('MIDI pitch')
    ax.set_title(title, fontsize=10)
    if level is not None:
        st = short_term_lufs(level, 0.4, 0.1)
        axes[1].plot(np.arange(len(st)) * 0.1 + 0.2, st, color='#333', lw=0.8)
        axes[1].set_ylabel('LUFS (0.4 s)')
        axes[1].set_ylim(max(-60, np.min(st) - 3) if len(st) else -60, (np.max(st) + 3) if len(st) else 0)
        axes[1].set_xlabel('seconds')
        axes[1].grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(path, dpi=110)
    plt.close(fig)
    return path


# ====================================================================== OST-BIBLE s6.9 checks
def band_ratio_db(x, lo=2000.0, hi=6000.0):
    """Power in [lo, hi) relative to total power, dB (the bible's 2-6 kHz dialogue check: <= -15 dB)."""
    m = to_stereo(x).mean(0).astype(np.float64)
    f, P = signal.welch(m, SR, nperseg=8192)
    sel = (f >= lo) & (f < hi)
    return round(10 * np.log10(P[sel].sum() / (P.sum() + 1e-20) + 1e-12), 1)


def short_term_stats(x, gate=-60.0):
    """Short-term loudness (3 s window, 0.5 s hop), windows below the gate left out (s6.5)."""
    st = short_term_lufs(x, 3.0, 0.5)
    st = st[st > gate]
    if not len(st):
        return dict(p95=None, median=None, max=None)
    return dict(p95=round(float(np.percentile(st, 95)), 2), median=round(float(np.median(st)), 2),
                max=round(float(st.max()), 2))


def _k_lufs(x):
    import pyloudnorm as pyln
    m = pyln.Meter(SR, block_size=0.4)
    x = to_stereo(x)
    if x.shape[1] < int(0.45 * SR):
        x = np.pad(x, ((0, 0), (0, int(0.45 * SR) - x.shape[1])))
    try:
        v = m.integrated_loudness(x.T.astype(np.float64))
    except Exception:
        return -99.0
    return v if np.isfinite(v) else -99.0


def _k_power(x):
    """Mean-square of the K-weighted signal (BS.1770 filters, run along time), channels summed: UNgated
    loudness power.  (Fix 1: the old code filtered across the two channels; see mix.k_weight.)"""
    x = to_stereo(x)
    if x.shape[1] < 64:
        return 0.0
    y = k_weight(x)
    return float((y ** 2).sum(0).mean())


def balance(groups, sections):
    """The theme's stemtable metric: per section, the K-weighted loudness of each group; shares by power,
    time-weighted over the sections, with rhythm and fx left out -> piano / orch / bigband / chip (%).
    groups: {group: [2, n]} (render_score(balance_out=...)); sections: [(label, t0, t1)]."""
    names = ['piano', 'orch', 'bigband', 'chip', 'rhythm', 'fx']
    tw = {g: 0.0 for g in names}
    per = []
    for lab, a, b in sections:
        i0, i1 = int(a * SR), int(b * SR)
        row = {}
        for g in names:
            if g in groups:
                L = _k_lufs(groups[g][:, i0:i1])
                row[g] = L
                if L > -90:
                    tw[g] += (b - a) * 10 ** (L / 10)
        pw = {g: 10 ** (row[g] / 10) for g in row if row[g] > -90 and g in ('piano', 'orch', 'bigband', 'chip')}
        tot = sum(pw.values()) or 1.0
        per.append(dict(section=lab, share={g: round(100 * pw.get(g, 0.0) / tot) for g in ('piano', 'orch', 'bigband',
                                                                                          'chip')}))
    tot4 = sum(tw[g] for g in ('piano', 'orch', 'bigband', 'chip')) or 1.0
    totall = sum(tw.values()) or 1.0
    # the ungated variant: K-weighted ENERGY over the whole cue (a short stab counts for its length only)
    ep = {g: _k_power(groups[g]) if g in groups else 0.0 for g in names}
    e4 = sum(ep[g] for g in ('piano', 'orch', 'bigband', 'chip')) or 1.0
    return dict(balance={g: round(100 * tw[g] / tot4) for g in ('piano', 'orch', 'bigband', 'chip')},
                rhythm_pct_of_all=round(100 * tw['rhythm'] / totall), chip_share=round(100 * tw['chip'] / tot4),
                balance_energy={g: round(100 * ep[g] / e4) for g in ('piano', 'orch', 'bigband', 'chip')},
                method='theme stemtable (gated loudness per section, time-weighted, rhythm/fx excluded; it counts a '
                       'brief stab at its own loudness for the whole section) + balance_energy (ungated energy)',
                sections=per)


def _sounding(notes, t, skip):
    return [n for n in notes if n.start <= t < n.start + n.dur and n.inst not in skip]


# ====================================================================== fix 5: the editor's QA checks (2026-09-26)
PITCHED_SYNTHS = {'drone', 'pad'}          # pitched, though motifs.DRUMLIKE leaves them out of the line matcher
PC = {n: i for i, n in enumerate(PC_NAMES)}


def _harmony_skip(skip=None):
    from .motifs import DRUMLIKE
    return (set(DRUMLIKE) - PITCHED_SYNTHS) | set(skip or ())


def _pedal_end(tr, end):
    """A sustain-pedalled note (render_sf2's emulation) sounds until the next pedal-up."""
    ped = sorted((float(t), bool(on)) for t, on in (getattr(tr, 'pedal', None) or []))
    if not ped:
        return end
    down = False
    for t, on in ped:
        if t > end:
            break
        down = on
    if not down:
        return end
    for t, on in ped:
        if t > end and not on:
            return t
    return end + 10.0


def _glide_range(n):
    """(lowest, highest) MIDI pitch a note passes through: bend [(sec, semis)], slide (from), glide_to (to)."""
    lo = hi = float(n.pitch)
    b = n.x.get('bend')
    if b:
        try:
            ss = [float(q[1]) for q in b]
            lo, hi = min(lo, n.pitch + min(ss)), max(hi, n.pitch + max(ss))
        except (TypeError, ValueError, IndexError):
            pass
    for k in ('slide', 'glide_to'):
        v = n.x.get(k)
        if isinstance(v, (int, float)):
            lo, hi = min(lo, float(v)), max(hi, float(v))
    return lo, hi


def sounding_spans(notes, tracks=None, skip=None):
    """[(start, end, pitch, inst, (glide_lo, glide_hi))] of the pitched notes as they SOUND (the gate, extended by
    the sustain pedal)."""
    sk = _harmony_skip(skip)
    out = []
    for n in notes:
        if n.inst in sk or n.dur <= 0 or n.vel <= 0:
            continue
        end = n.start + n.dur
        if tracks and n.inst in tracks:
            end = _pedal_end(tracks[n.inst], end)
        out.append((float(n.start), float(end), float(n.pitch), n.inst, _glide_range(n)))
    return out


def _sweep(spans):
    """Yield (t0, t1, [span, ...]) for every interval between consecutive note boundaries."""
    ev = sorted({t for s in spans for t in (s[0], s[1])})
    if not ev:
        return
    by_start = sorted(spans, key=lambda s: s[0])
    active, i = [], 0
    for t0, t1 in zip(ev[:-1], ev[1:]):
        while i < len(by_start) and by_start[i][0] <= t0 + 1e-9:
            active.append(by_start[i])
            i += 1
        active = [s for s in active if s[1] > t0 + 1e-9]
        if active:
            yield t0, t1, active


def written_third(notes, tracks=None, skip=None, min_s=0.02):
    """(a) OST-BIBLE rule 12 from the NOTE DATA: any sounding A-natural (any octave) at any moment where F is the
    lowest sounding pitch.  Every note boundary is examined (not one sample per beat), sustain pedal included.
    Overlaps shorter than min_s (a legato crossfade, a roll) are listed as grazes and do not fail."""
    from .core import note_name
    spans = sounding_spans(notes, tracks, skip)
    raw = []
    for t0, t1, act in _sweep(spans):
        low = min(s[2] for s in act)
        if int(round(low)) % 12 != PC['F']:
            continue
        a = [s for s in act if int(round(s[2])) % 12 == PC['A']]
        if not a:
            continue
        bass = [s for s in act if s[2] == low]
        key = (tuple(sorted({(s[3], note_name(s[2])) for s in a})), tuple(sorted({(s[3], note_name(s[2])) for s in bass})))
        if raw and abs(raw[-1]['t1'] - t0) < 1e-6 and raw[-1]['_key'] == key:
            raw[-1]['t1'] = t1
        else:
            raw.append(dict(t0=t0, t1=t1, _key=key))
    events, grazes = [], []
    for r in raw:
        a_notes, bass = r.pop('_key')
        e = dict(t0=round(float(r['t0']), 3), t1=round(float(r['t1']), 3), dur=round(float(r['t1'] - r['t0']), 3),
                 a=[f'{i} {p}' for i, p in a_notes], f_bass=[f'{i} {p}' for i, p in bass])
        (events if e['dur'] >= min_s else grazes).append(e)
    return dict(ok=not events, count=len(events), events=events[:24], grazes=grazes[:12], n_grazes=len(grazes),
                rule='OST-BIBLE rule 12: no A-natural over an F root or bass (from the notes, every boundary)')


def f_bass_windows(notes, tracks=None, skip=None, max_len=0.625, min_len=0.15):
    """Windows where F is the lowest sounding pitch (from the notes), cut into pieces <= max_len (one beat at
    96) so a short A is not averaged away."""
    spans = sounding_spans(notes, tracks, skip)
    wins = []
    for t0, t1, act in _sweep(spans):
        if int(round(min(s[2] for s in act))) % 12 != PC['F']:
            continue
        if wins and abs(wins[-1][1] - t0) < 1e-6:
            wins[-1][1] = t1
        else:
            wins.append([t0, t1])
    out = []
    for a, b in wins:
        n = max(1, int(np.ceil((b - a) / max_len - 1e-9)))
        for k in range(n):
            w0, w1 = a + (b - a) * k / n, a + (b - a) * (k + 1) / n
            if w1 - w0 >= min_len:
                out.append((w0, w1))
    return out


def _pc_peaks(x, t0, t1, pc, fmin=80.0, fmax=2000.0, rel_db=-30.0):
    """Spectral peaks of pitch class `pc` in [t0, t1): [(freq, power)], strongest first."""
    from scipy.signal import find_peaks
    m = to_stereo(x).mean(0)
    a, b = max(0, int(t0 * SR)), min(len(m), int(t1 * SR))
    if b - a < 256:
        return []
    seg = np.nan_to_num(m[a:b].astype(np.float64)) * np.hanning(b - a)
    N = max(1 << 15, 1 << int(np.ceil(np.log2(len(seg) * 2))))
    P = np.abs(np.fft.rfft(seg, N)) ** 2
    f = np.fft.rfftfreq(N, 1 / SR)
    sel = (f > fmin) & (f < fmax)
    Pm = np.where(sel, P, 0.0)
    if Pm.max() <= 0:
        return []
    pk, _ = find_peaks(Pm, height=Pm.max() * 10 ** (rel_db / 10))
    out = [(float(f[i]), float(P[i])) for i in pk if int(round(12 * np.log2(f[i] / 440.0) + 69)) % 12 == pc]
    return sorted(out, key=lambda q: -q[1])


def _explain_peak(fq, spans, tol_c=30.0, kmax=16):
    """Is fq a harmonic (k <= kmax, within tol) of a written note sounding in this stem, or inside the sweep of
    a written glide (bend / slide / glide_to)?  -> (inst, note, k, 'partial' | 'glide') or None."""
    from .core import note_name, midi_hz
    best = None
    for s in spans:
        f0 = midi_hz(s[2])
        k = int(round(fq / f0))
        if 1 <= k <= kmax and abs(1200 * np.log2(fq / (k * f0))) <= tol_c:
            if best is None or k < best[2]:
                best = (s[3], note_name(s[2]), k, 'partial')
    if best is None:
        for s in spans:
            lo, hi = s[4] if len(s) > 4 else (s[2], s[2])
            if hi - lo < 0.5:
                continue
            for k in range(1, 9):
                if midi_hz(lo) * k * 2 ** (-tol_c / 1200) <= fq <= midi_hz(hi) * k * 2 ** (tol_c / 1200):
                    return (s[3], note_name(s[2]), k, 'glide')
    return best


def _minus(wins, holes, min_len):
    """Windows with the holes (hard stops) cut out; pieces shorter than min_len dropped."""
    out = []
    for a, b in wins:
        pieces = [(a, b)]
        for h0, h1 in holes:
            nxt = []
            for p0, p1 in pieces:
                if h1 <= p0 or h0 >= p1:
                    nxt.append((p0, p1))
                    continue
                if h0 > p0:
                    nxt.append((p0, h0))
                if h1 < p1:
                    nxt.append((h1, p1))
            pieces = nxt
        out += [p for p in pieces if p[1] - p[0] >= min_len]
    return out


def f_major_check(x, notes, grid=None, step_beats=1.0, limit=0.08, skip=None, stems=None, tracks=None, mutes=(),
                  f_min_share=0.05, tail_s=1.5):
    """The F-major check (s6.9 item 4, rule 12), from the notes AND the audio.

    Windows: wherever F is the lowest sounding pitch (every note boundary, pedal included), in pieces of at
    most one beat, with the hard stops (mutes: digital silence) cut out.  A window whose F holds less than
    f_min_share of its (sieved) pitched energy is not judged on A/F (the F is written but not heard: a decayed
    pluck, a buried pedal); it is counted in f_inaudible_windows.  In each: the raw and the harmonic-sieved A/F of the pitched mix `x`.
    (a) written: any A-natural sounding over the F bass (written_third) -> fail.
    (b) spectral: sieved A/F >= limit -> the A energy is traced to its stem (stems: {family: [2, n]}), and each
        A peak of that stem is classed as a WRITTEN A, a PARTIAL of a written note of that stem (the sieve
        credits a partial only when its fundamental is in the window), a GLIDE (a written bend / slide / sub
        drop sweeping through A), a TAIL (a partial of a note of that stem released < tail_s before), or a RESONANCE (a partial of nothing
        written: a mute's fixed formant, a body resonance, noise).  A resonance that recurs at the same
        frequency (+-1.5 %) under different written notes is reported as FIXED.
    A window over the limit is classed 'written' (fail), 'resonance' (>= 25 % of its A peaks' power is a
    partial of nothing written: fail, audition it), 'explained' (only partials of written non-A notes -- most
    often the F bass's own 5th partial when its fundamental is too weak for the sieve --, tails and glides: it
    passes) or 'unattributed' (no stems given: fail on the number alone, as before)."""
    from .core import note_name
    L = x.shape[1] / SR
    step = (grid.beats_s(step_beats, 0.0) if grid is not None else 0.625)
    wt = written_third(notes, tracks, skip)
    spans = sounding_spans(notes, tracks, skip)
    fam_of = (lambda inst: tracks[inst].stem if tracks and inst in tracks else None)
    out = []
    worst = worst_s = 0.0
    res_hits = {}
    for a, b in _minus(f_bass_windows(notes, tracks, skip, max_len=step), list(mutes or ()), 0.15):
        if a >= L:
            continue
        b = min(b, L)
        if b - a < 0.15:
            continue
        a2 = a + min(0.03, (b - a) / 5)
        c = pc_energy(x, a2, b, 80.0, 2000.0)
        cs = pc_energy(x, a2, b, 80.0, 2000.0, sieve=True)
        r = c[PC['A']] / max(c[PC['F']], 1e-20)
        rs = cs[PC['A']] / max(cs[PC['F']], 1e-20)
        w_a = [s for s in spans if min(s[1], b) - max(s[0], a) >= 0.02 and int(round(s[2])) % 12 == PC['A']]
        worst, worst_s = max(worst, r), max(worst_s, rs)
        row = dict(t0=round(a, 3), t1=round(b, 3), a_over_f=round(float(r), 3), a_over_f_sieved=round(float(rs), 3),
                   written_a=sorted({f'{s[3]} {note_name(s[2])}' for s in w_a})[:6])
        f_share = cs[PC['F']] / max(cs.sum(), 1e-20)
        row['f_share'] = round(float(f_share), 3)
        f_heard = f_share >= f_min_share
        if rs >= limit and stems and f_heard:
            fam = {}
            for k, v in stems.items():
                if v is None or not np.any(v):
                    continue
                e = pc_energy(v, a2, b, 80.0, 2000.0, sieve=True)
                if e[PC['A']] > 0:
                    fam[k] = e[PC['A']]
            tot = sum(fam.values()) or 1.0
            src = sorted(fam, key=lambda k: -fam[k])
            row['a_from'] = {k: round(100 * fam[k] / tot) for k in src[:3]}
            kinds = []
            for k in src[:2]:
                if fam[k] / tot < 0.2:
                    continue
                sp = [s for s in spans if s[0] < b and s[1] > a and fam_of(s[3]) == k]
                tails = [s for s in spans if a - tail_s <= s[1] <= a and fam_of(s[3]) == k]
                for fq, pw in _pc_peaks(stems[k], a2, b, PC['A'])[:3]:
                    ex = _explain_peak(fq, sp)
                    tx = None if ex else _explain_peak(fq, tails)
                    if ex and ex[1][:-1].rstrip('-') == 'A' and ex[3] == 'partial':
                        kd, cls = f'written A ({ex[0]} {ex[1]}, partial {ex[2]})', 'written'
                    elif ex and ex[3] == 'glide':
                        kd, cls = f'glide of written {ex[1]} ({ex[0]}, partial {ex[2]})', 'glide'
                    elif ex:
                        kd, cls = f'partial {ex[2]} of written {ex[1]} ({ex[0]})', 'partial'
                    elif tx:
                        kd, cls = f'tail of written {tx[1]} ({tx[0]}, partial {tx[2]}, released before the window)', 'tail'
                    else:
                        kd, cls = 'resonance (no written note has this partial)', 'resonance'
                        res_hits.setdefault(k, []).append((fq, a, frozenset(round(s[2]) for s in sp)))
                    kinds.append(dict(stem=k, hz=round(fq, 1), kind=kd, cls=cls, _pw=pw * fam[k] / tot))
            pw_tot = sum(q['_pw'] for q in kinds) or 1.0
            for q in kinds:
                q['share'] = round(q.pop('_pw') / pw_tot, 2)
            row['a_peaks'] = kinds
            if any(q['cls'] == 'written' for q in kinds) or w_a:
                row['a_class'] = 'written'
            elif sum(q['share'] for q in kinds if q['cls'] == 'resonance') >= 0.25:
                row['a_class'] = 'resonance'
            elif kinds:
                row['a_class'] = 'explained'           # partials of written non-A notes, tails, glides
            else:
                row['a_class'] = 'unattributed'
        elif rs >= limit and not f_heard:
            row['note'] = 'the F bass holds under 5 % of this window\'s pitched energy: A/F is not a judgement here'
        spectral_ok = rs < limit or not f_heard or row.get('a_class') == 'explained'
        row['ok'] = bool(spectral_ok and not w_a)
        row['ok_spectral'] = bool(spectral_ok)
        out.append(row)
    fixed = []
    for k, hits in res_hits.items():
        hits.sort()
        used = [False] * len(hits)
        for i, (fq, t, ps) in enumerate(hits):
            if used[i]:
                continue
            grp = [j for j in range(len(hits)) if not used[j] and abs(hits[j][0] / fq - 1) < 0.015]
            for j in grp:
                used[j] = True
            if len(grp) >= 2 and len({hits[j][2] for j in grp}) >= 2:
                fixed.append(dict(stem=k, hz=round(float(np.median([hits[j][0] for j in grp])), 1),
                                  windows=len(grp), at=[round(hits[j][1], 2) for j in grp][:8],
                                  note='the same A-class peak under different written notes: a fixed resonance of '
                                       'an instrument in this stem, not a written third'))
    fails = [w for w in out if not w['ok']]
    return dict(limit=limit, windows=len(out), worst=round(float(worst), 3), worst_sieved=round(float(worst_s), 3),
                ok=bool(wt['ok'] and not fails), ok_written=wt['ok'],
                ok_spectral=all(w['ok_spectral'] for w in out),
                f_inaudible_windows=sum(w['f_share'] < f_min_share for w in out),
                a_classes={c: sum(w.get('a_class') == c for w in out) for c in
                           ('written', 'resonance', 'explained', 'unattributed')},
                written_a_over_f_bass=wt['events'][:12], written_third=wt,
                fails=fails[:16], explained=[w for w in out if w.get('a_class') == 'explained'][:8],
                fixed_resonances=fixed,
                note='ok = no WRITTEN A-natural over an F bass (every note boundary) and, in every F-bass window where '
                     'the F is heard, the harmonic-sieved A/F < limit or its excess explained by partials of written '
                     'non-A notes; a window over the limit names its stem and classes each A peak (written A / '
                     'partial of a written note / tail / glide / resonance)')


KNEE_PCS = (0, 0, 0, 0, 2, 3, 7, 0)       # F F F F G Ab C F, relative to its first note (any key)


def _lines(notes, skip=None, chord_ms=12.0):
    """{(inst, 'top'|'bottom'): [(t, pitch)]}: each instrument's top line, and its bottom line where it differs."""
    sk = _harmony_skip(skip)
    by = {}
    for n in sorted(notes, key=lambda n: (n.start, n.pitch)):
        if n.inst in sk:
            continue
        by.setdefault(n.inst, []).append(n)
    out = {}
    for inst, ns in by.items():
        top, bot = [], []
        for n in ns:
            if top and n.start - top[-1][0] < chord_ms / 1000.0:
                top[-1] = (top[-1][0], max(top[-1][1], n.pitch))
                bot[-1] = (bot[-1][0], min(bot[-1][1], n.pitch))
            else:
                top.append((n.start, n.pitch))
                bot.append((n.start, n.pitch))
        out[(inst, 'top')] = top
        if any(a[1] != b[1] for a, b in zip(top, bot)):
            out[(inst, 'bottom')] = bot
    return out


def knee_completion(notes, max_gap_s=2.5, skip=None, any_key=True):
    """(c) OST-BIBLE rule 4 by PITCH CLASS: in any one line (an instrument's top line, or its bottom line), eight
    consecutive onsets reading F F F F G Ab C F (any register; any key if any_key), each within max_gap_s of
    the one before.  Rests and phrase boundaries do NOT break it: the last F starting a new phrase still
    completes the knee.  (motifs.knee_whole_count only finds it in the exact register, gaps <= 1.6 s.)"""
    from .core import note_name
    hits = []
    for (inst, which), seq in _lines(notes, skip).items():
        if len(seq) < 8:
            continue
        pcs = [int(round(p)) % 12 for _, p in seq]
        for i in range(len(seq) - 7):
            base = pcs[i]
            if not any_key and base != PC['F']:
                continue
            if any((pcs[i + j] - base) % 12 != KNEE_PCS[j] for j in range(8)):
                continue
            ts = [seq[i + j][0] for j in range(8)]
            gaps = np.diff(ts)
            if gaps.max() > max_gap_s:
                continue
            hits.append(dict(inst=inst, line=which, t0=round(float(ts[0]), 3), t1=round(float(ts[7]), 3),
                             key=PC_NAMES[base], notes=[note_name(seq[i + j][1]) for j in range(8)],
                             last_gap_s=round(float(gaps[-1]), 3), max_gap_s=round(float(gaps.max()), 3),
                             registers=len({int(round(seq[i + j][1])) // 12 for j in range(8)}),
                             new_phrase=bool(gaps[-1] > 1.0 or gaps[-1] > 2.5 * np.median(gaps[:-1]))))
    hits.sort(key=lambda h: (h['t0'], h['inst']))
    return dict(count=len(hits), hits=hits[:24], max_gap_s=max_gap_s,
                rule='OST-BIBLE rule 4: the knee never plays whole in an episode, in any register, across a phrase '
                     'boundary too')


ROOM_SFX = ('room_drone', 'server_hum')


def room_sfx_windows(meta, grid, end_s):
    """(t0, t1, label) wherever the cue sheet marks the SFX room_drone or server_hum: META['room_sfx'] entries
    (dict(t0=, t1=, sfx=) or (t0, t1[, sfx])), and any sfx_slots entry whose text names one of them (its t1 /
    end / dur if given, else to the end of the cue).  Positions: seconds, (bar, beat), 'f123' or 'bar:beat'."""
    def at(p):
        return float(grid.at(p)) if grid is not None and not isinstance(p, (int, float)) else float(p)
    out = []
    for w in meta.get('room_sfx', []) or []:
        if isinstance(w, dict):
            out.append((at(w['t0']), at(w['t1']) if 't1' in w else end_s, str(w.get('sfx', 'room_drone'))))
        else:
            out.append((at(w[0]), at(w[1]), str(w[2]) if len(w) > 2 else 'room_drone'))
    for s in meta.get('sfx_slots', []) or []:
        if not isinstance(s, dict):
            continue
        txt = ' '.join(str(s.get(k, '')) for k in ('sfx', 'act', 'note', 'label'))
        if not any(r in txt for r in ROOM_SFX):
            continue
        t0 = s.get('sec', s.get('t'))
        if t0 is None:
            continue
        t0 = at(t0)
        if 't1' in s or 'end' in s:
            t1 = at(s.get('t1', s.get('end')))
            lab = next(r for r in ROOM_SFX if r in txt)
        elif 'dur' in s:
            t1 = t0 + float(s['dur'])
            lab = next(r for r in ROOM_SFX if r in txt)
        else:
            t1 = end_s
            lab = next(r for r in ROOM_SFX if r in txt) + ' (no end marked: checked to the end of the cue)'
        out.append((t0, t1, lab))
    return sorted(out)


def sub_under_room(x, windows, stems=None, notes=None, drop=None, limit_db=-18.0, fc=60.0, floor_dbfs=-70.0):
    """(d) s6.5: under room_drone / server_hum the sub band (< fc Hz) must sit >= 18 dB under the total power.
    x: the underscore master; stems: {family: [2, n]} (to name the stem that carries the sub); drop: stems the
    cue's notes tell the editor to mute under the room SFX (META room_sfx_drop_stems) -> judged without them,
    and reported both ways.  Also lists pitched notes below C3 in the window (the palette rule), for info."""
    from .core import note_name

    def ratio(sig, a, b):
        m = to_stereo(sig).mean(0)[int(a * SR):int(b * SR)].astype(np.float64)
        if len(m) < 2048 or np.sqrt(np.mean(m ** 2)) < 10 ** (floor_dbfs / 20):
            return None
        f, P = signal.welch(m, SR, nperseg=min(16384, len(m)))
        return float(10 * np.log10(P[f < fc].sum() / (P.sum() + 1e-30) + 1e-30))
    out = []
    for a, b, lab in windows:
        r = ratio(x, a, b)
        row = dict(t0=round(a, 3), t1=round(b, 3), sfx=lab, sub_db=None if r is None else round(r, 1), limit_db=limit_db)
        if stems:
            sh = {}
            for k, v in stems.items():
                m = to_stereo(v).mean(0)[int(a * SR):int(b * SR)].astype(np.float64)
                if len(m) >= 2048 and np.any(m):
                    f, P = signal.welch(m, SR, nperseg=min(16384, len(m)))
                    sh[k] = float(P[f < fc].sum())
            tot = sum(sh.values())
            if tot > 0:
                row['sub_from'] = {k: round(100 * v / tot) for k, v in sorted(sh.items(), key=lambda q: -q[1])[:3]
                                   if v / tot >= 0.05}
            if drop:
                kept = sum(v for k, v in stems.items() if k not in set(drop))
                rd = ratio(kept, a, b) if not np.isscalar(kept) else None
                row['sub_db_without'] = {'stems': list(drop), 'sub_db': None if rd is None else round(rd, 1)}
        judged = row.get('sub_db_without', {}).get('sub_db', row['sub_db']) if drop else row['sub_db']
        row['ok'] = judged is None or judged <= limit_db
        if notes is not None:
            low = sorted({(n.inst, note_name(n.pitch)) for n in notes if n.inst not in _harmony_skip()
                          and n.pitch < 48 and n.start < b and n.start + n.dur > a})
            row['notes_below_c3'] = [f'{i} {p}' for i, p in low[:8]]
        out.append(row)
    return out


def no_third(x, windows, limit=0.06):
    """A and Ab each <= limit x F inside each (t0, t1) window (buttons, the verdict, the title chord)."""
    out = []
    for w in windows:
        a, b = w[0], w[1]
        c = chroma(x, a, b, fmin=80, fmax=2000)
        f = max(c['F'], 1e-9)
        out.append(dict(t0=a, t1=b, a=round(c['A'] / f, 3), ab=round(c['Ab'] / f, 3),
                        ok=c['A'] / f <= limit and c['Ab'] / f <= limit))
    return out


def silence(x, windows):
    """windows: [(t0, t1, label, max_dbfs)] -> peak dBFS inside each (D6 -90, real lines -70)."""
    out = []
    xs = to_stereo(x)
    for w in windows:
        a, b = w[0], w[1]
        lab = w[2] if len(w) > 2 else ''
        lim = w[3] if len(w) > 3 else -70.0
        seg = xs[:, int(a * SR):int(b * SR)]
        pk = todb(np.abs(seg).max()) if seg.size else -200.0
        out.append(dict(t0=round(a, 4), t1=round(b, 4), label=lab, peak_dbfs=round(pk, 1), limit=lim, ok=pk < lim))
    return out


def hard_stops(x, mutes, fade_ms=3.0, limit=-90.0):
    """After each hard stop's fade, nothing may remain (tails included)."""
    return silence(x, [(a + fade_ms / 1000.0, b, 'hard stop', limit) for a, b in mutes if b - a > fade_ms / 1000.0])


def swing_report(notes, grid, tracks=None):
    """Per track: how many notes sit on an off-beat, their median offset from the beat in frames (house
    swing at 96 BPM = +10.0; straight = +7.5), and the track's humanisation."""
    by = {}
    for n in notes:
        bar, beat = grid.pos(n.start)
        fr = beat - np.floor(beat)
        if 0.4 < fr < 0.8:
            off = (n.start - grid.t(bar, np.floor(beat))) * grid.fps
            by.setdefault(n.inst, []).append(off)
    out = {}
    for k, v in by.items():
        out[k] = dict(offbeats=len(v), median_frames=round(float(np.median(v)), 2),
                      hum_ms=(tracks[k].hum_ms if tracks and k in tracks else None))
    return out


def banned(notes, tracks, meta):
    """s6.9 item 11: diegetic-only tracks outside a diegetic cue, the gong, an F6 bell in underscore."""
    from .arrange import DIEGETIC_ONLY
    used = {n.inst for n in notes}
    out = []
    if not meta.get('diegetic'):
        declared = set(meta.get('diegetic_tracks', []))
        for k in sorted((used & DIEGETIC_ONLY) - declared):
            out.append(f'{k} is diegetic-only: in-world source music through era.futz (declare it in META '
                       f'diegetic_tracks, or set diegetic=True for a source cue)')
    if any(n.inst == 'bell' and int(round(n.pitch)) == 89 for n in notes):
        out.append('an F6 bell in the score (the SFX own the F6 bells: KA-CHING, the Orb)')
    return out
