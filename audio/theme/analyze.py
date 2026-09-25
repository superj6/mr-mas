"""Analysis (SCRIPT v2.1): loudness, stem balance, spectrum, cue timing on the carrying stems, the roll-call level (no mute), no-third chroma windows.

python analyze.py V1 [V2 ...]   -> analysis/<V>.json + analysis/<V>.png
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy import signal
import pyloudnorm as pyln
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

sys.path.insert(0, os.path.dirname(__file__))
from engine.core import SR, SPF, N
from build import FILES

OUT = os.path.dirname(os.path.abspath(__file__))
# v2.1 music cue frames (SCRIPT v2.1).  Straight off-beats sound at +7.5 in the music (127.5, the roll call's
# 487.5 / 502.5 / 517.5 / 532.5, 622.5); the picture/SFX use the floor.  f150 (bonk) and f705 (ding) are SFX-owned.
ROLL = [480, 487.5, 495, 502.5, 510, 517.5, 525, 532.5]
CUES = [0, 15, 30, 45, 60, 90, 105, 108, 112, 116, 120, 127.5, 135, 165, 172, 180, 195, 240, 300, 355, 360, 414, 420,
        465, 470, 475] + ROLL + [540, 555, 570, 585, 600, 615, 622.5, 630, 660, 690]
BIG = [120, 240, 300, 360, 420, 630] + ROLL
BANDS = [(20, 60), (60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000),
         (8000, 16000)]


def onset_env(x):
    m = x.mean(0)
    hop = 96  # 2 ms
    f, t, Z = signal.stft(m, SR, nperseg=1024, noverlap=1024 - hop, boundary=None, padded=False)
    S = np.log1p(40 * np.abs(Z))
    flux = np.maximum(0, np.diff(S, axis=1)).sum(0)
    tt = t[1:] - (1024 / 2) / SR + hop / SR   # approx attack time
    return tt, flux


def cue_timing(x, frames, win_ms=40):
    """1 ms-resolution onset: steepest rise of the (log) envelope of the >1 kHz band, and of the full band."""
    m = x.mean(0)
    out = {}
    for f in frames:
        t0 = f / 24
        a = int((t0 - 0.12) * SR); b = int((t0 + 0.12) * SR)
        a = max(a, 0); seg = m[a:b]
        best = None
        for band in ('hf', 'full'):
            y = signal.sosfilt(signal.butter(2, 1000, 'high', fs=SR, output='sos'), seg) if band == 'hf' else seg
            env = np.sqrt(signal.sosfiltfilt(signal.butter(2, 250, 'low', fs=SR, output='sos'), y * y).clip(0) + 1e-12)
            le = 20 * np.log10(env + 1e-9)
            hop = SR // 1000
            le = le[::hop]
            d = np.diff(le, prepend=le[0])
            d = np.convolve(d, np.ones(3) / 3, mode='same')
            tt = a / SR + np.arange(len(le)) / 1000
            k = (tt > t0 - win_ms / 1000) & (tt < t0 + win_ms / 1000)
            i = int(np.argmax(np.where(k, d, -1e9)))
            # first rise: the earliest 1-ms bin in the window that leaves the preceding level by >= 3 dB and
            # keeps rising (>= 6 dB within 4 ms) to within 15 dB of the window peak - the audible attack,
            # which for soft-hammer felt piano comes well before its steepest (body) rise
            idx = np.where(k)[0]
            wmax = float(le[idx].max())
            first = None
            for j in idx:
                base = float(np.median(le[max(0, j - 10):max(1, j - 1)]))
                j3 = min(j + 3, len(le) - 1)
                if le[j] - base >= 3.0 and le[j3] - base >= 8.0 and le[j3] >= wmax - 10.0:
                    first = j
                    break
            cand = (float(d[i]), float((tt[i] - t0) * 1000), band,
                    float((tt[first] - t0) * 1000) if first is not None else None)
            if best is None or cand[0] > best[0]:
                best = cand
        onset = best[3] if best[3] is not None else best[1]
        out[f] = dict(offset_ms=round(onset, 1), steepest_ms=round(best[1], 1), rise_db_per_ms=round(best[0], 2),
                      band=best[2])
    return out


CUE_STEMS = {0: 'piano', 15: 'piano', 30: 'piano', 45: 'piano', 60: 'piano', 90: 'strings', 105: 'chip', 108: 'chip',
             112: 'chip', 116: 'chip', 120: 'chip', 127.5: 'chip', 135: 'chip', 165: 'chip', 172: 'chip',
             180: 'chip', 195: 'chip', 240: 'brass', 300: 'brass', 355: 'strings', 360: 'brass', 414: 'brass',
             420: 'brass', 465: 'chip', 470: 'chip', 475: 'chip',
             **{f: 'brass' for f in ROLL},
             540: 'strings', 555: 'strings', 570: 'strings', 585: 'strings', 600: 'strings',
             615: 'strings', 622.5: 'strings', 630: 'perc', 660: 'perc', 690: 'sub'}
# per-variation carriers where the orchestration differs (SCRIPT s3.1)
CUE_STEMS_BY_VAR = {
    'V2': {414: None},
    'V3': {90: 'chip', 355: 'piano', 630: 'brass', **{f: 'chip' for f in (540, 555, 570, 585, 600, 615, 622.5)}},
    'V4': {90: 'chip', 195: 'chip', 240: 'piano', 300: 'piano', 355: 'chip', 360: 'piano', 414: None, 420: 'piano',
           **{f: 'piano' for f in ROLL}, **{f: 'piano' for f in (540, 555, 570, 585, 600, 615, 622.5)},
           630: 'piano', 660: 'piano'},
}


# V3 swings the 1993 hook: its second F is at f130 (not the straight 127.5)
CUE_FRAME_BY_VAR = {'V3': {127.5: 130}}


def cues_for(v):
    sub = CUE_FRAME_BY_VAR.get(v, {})
    return [sub.get(f, f) for f in CUES]


def cue_stems_for(v):
    m = dict(CUE_STEMS)
    m.update(CUE_STEMS_BY_VAR.get(v, {}))
    for a_, b_ in CUE_FRAME_BY_VAR.get(v, {}).items():
        m[b_] = m.pop(a_)
    return {k: st for k, st in m.items() if st}


def stem_timing(v, cue_stems=None):
    res = {}
    cache = {}
    cue_stems = cue_stems or cue_stems_for(v)
    for f, st in cue_stems.items():
        # carriers in priority order (the sharpest-speaking member of the gesture first)
        if f in ROLL:
            cands = ['chip', st]                       # the stab's chip double (instant attack), then the section
        elif f == 414:
            cands = [st]                               # the rip starts here (a crescendo, not a hit)
        elif f in (240, 300, 360, 420, 630):
            cands = ['sub', 'perc', st, 'brass', 'piano', 'chip']   # the 808 click / timpani / section / piano
        elif f in (540, 555, 570, 585, 600, 615, 622.5) and st in ('strings', 'piano'):
            cands = ['chip', st]                       # skyline plucks: the chip octave, then harp/pizz or piano
        else:
            cands = [st]
        best = None
        for c in cands:                          # in priority order: the first carrier with a clear attack wins
            pc = f'{OUT}/stems/{v}-{c}.wav'
            if not os.path.exists(pc):
                continue
            if c not in cache:
                y, _ = sf.read(pc, always_2d=True)
                cache[c] = y.T
            r = cue_timing(cache[c], [f], win_ms=25)[f]
            if r['rise_db_per_ms'] >= 1.0:
                best = (c, r)
                break
            if best is None or r['rise_db_per_ms'] > best[1]['rise_db_per_ms']:
                best = (c, r)
        if best:
            res[f] = dict(stem=best[0], **best[1])
    return res


def chroma(x, a, b):
    seg = x.mean(0)[int(a * SPF):int(b * SPF)]
    seg = seg * np.hanning(len(seg))
    S = np.abs(np.fft.rfft(seg, 1 << 19)) ** 2
    fr = np.fft.rfftfreq(1 << 19, 1 / SR)
    k = (fr > 60) & (fr < 4000)
    midi = 69 + 12 * np.log2(fr[k] / 440)
    pc = np.round(midi).astype(int) % 12
    c = np.bincount(pc, weights=S[k], minlength=12)
    return c / c.max()


def analyse(v):
    base = FILES[v]
    x, sr = sf.read(f'{OUT}/{base}.wav', always_2d=True)
    x = x.T
    meter = pyln.Meter(SR)
    L = meter.integrated_loudness(x.T)
    up = signal.resample_poly(x, 4, 1, axis=1)
    tp = 20 * np.log10(np.abs(up).max())
    # short-term loudness (3 s) & momentary (0.4 s) every 100 ms
    st = []
    mom = pyln.Meter(SR, block_size=0.399)
    for i in range(0, x.shape[1] - int(0.4 * SR), int(0.1 * SR)):
        seg = x[:, i:i + int(0.4 * SR)]
        try:
            v_ = mom.integrated_loudness(seg.T)
            st.append(v_ if np.isfinite(v_) else -70)
        except Exception:
            st.append(-70)
    # stems balance
    stems = {}
    for f in sorted(os.listdir(f'{OUT}/stems')):
        if f.startswith(v + '-') and f.endswith('.wav'):
            y, _ = sf.read(f'{OUT}/stems/{f}', always_2d=True)
            try:
                e = 10 ** (meter.integrated_loudness(y) / 10)
            except Exception:
                e = 0.0
            stems[f[len(v) + 1:-4]] = e if np.isfinite(e) else 0.0
    tot = sum(stems.values())
    share = {k: round(100 * e / tot, 1) for k, e in sorted(stems.items(), key=lambda t: -t[1])}
    # spectrum balance (octave bands, dB rel. max)
    m = x.mean(0)
    Pxx_f, Pxx = signal.welch(m, SR, nperseg=8192)
    bands = {}
    for lo, hi in BANDS:
        k = (Pxx_f >= lo) & (Pxx_f < hi)
        bands[f'{lo}-{hi}'] = float(10 * np.log10(Pxx[k].sum() + 1e-20))
    mx = max(bands.values())
    bands = {k: round(b - mx, 1) for k, b in bands.items()}
    # cue timing
    timing = cue_timing(x, cues_for(v))
    st_timing = stem_timing(v)
    # the roll-call stabs on the section stem itself (brass; V4: piano), besides the chip double
    rc_stem = 'piano' if v == 'V4' else 'brass'
    yb, _ = sf.read(f'{OUT}/stems/{v}-{rc_stem}.wav', always_2d=True)
    rc = cue_timing(yb.T, ROLL, win_ms=25)
    rollcall_section_onsets = {str(k): dict(stem=rc_stem, offset_ms=o['offset_ms']) for k, o in rc.items()}
    # the Harmon trumpet's first note (bar 10) on its own stem
    hp_ = f'{OUT}/stems/{v}-harmon.wav'
    harmon_onset = None
    if os.path.exists(hp_):
        yh, _ = sf.read(hp_, always_2d=True)
        harmon_onset = cue_timing(yh.T, [540], win_ms=25)[540]
    # v2.1: there is no 'music fired' mute - the roll call must be continuous and loud (f495-509 was the old hole)
    def win_rms(a_, b_):
        seg = x[:, int(a_ * SPF):int(b_ * SPF)]
        return round(float(20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-12)), 1)
    rollcall_rms = dict(bar8=win_rms(420, 480), bar9=win_rms(480, 540), old_mute_f495_509=win_rms(495, 509),
                        bar10=win_rms(540, 600))
    names = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    def chroma_d(a_, b_):
        c_ = chroma(x, a_, b_)
        return {names[i]: round(float(c_[i]), 3) for i in range(12)}
    # no-third windows: the cold open around the D-flat pause and before the leap, roll-call stab 8, the title
    no_third = {}
    for nm_, (a_, b_) in dict(cold_open_f0_57=(0, 57), cold_open_f72_104=(72, 104), stab8=(533, 539.5), title=(633, 655)).items():
        cd = chroma_d(a_, b_)
        no_third[nm_] = dict(A=cd['A'], Ab=cd['Ab'], F=cd['F'], C=cd['C'], third_ratio=round(max(cd['A'], cd['Ab']), 3))
    c = chroma(x, 633, 655)
    ch = {names[i]: round(float(c[i]), 3) for i in range(12)}
    third = max(ch['A'], ch['Ab'])
    res = dict(variation=v, integrated_lufs=round(L, 2), true_peak_dbtp=round(tp, 2), stem_loudness_share_pct=share,
               octave_bands_db=bands, cue_onsets=timing, cue_onsets_by_stem=st_timing, rollcall_rms_dbfs=rollcall_rms, no_third_windows=no_third, harmon_f540_onset=harmon_onset, rollcall_section_onsets=rollcall_section_onsets,
               final_chord_chroma=ch, final_chord_third_ratio=round(float(third), 3),
               duration_s=x.shape[1] / SR)
    json.dump(res, open(f'{OUT}/analysis/{v}.json', 'w'), indent=1)
    # plot
    fig, ax = plt.subplots(3, 1, figsize=(16, 10), gridspec_kw=dict(height_ratios=[3, 1, 1]))
    f, t, Z = signal.stft(m, SR, nperseg=2048, noverlap=2048 - 480)
    S = 20 * np.log10(np.abs(Z) + 1e-7)
    ax[0].pcolormesh(t * 24, f, S, vmin=S.max() - 90, vmax=S.max(), shading='auto', cmap='magma')
    ax[0].set_yscale('symlog', linthresh=200)
    ax[0].set_ylim(30, 18000)
    for cf in CUES:
        ax[0].axvline(cf, color='c' if cf in BIG else 'w', lw=0.6 if cf in BIG else 0.3, alpha=0.7)
    ax[0].set_title(f'{v}  {L:.1f} LUFS  TP {tp:.1f} dBTP')
    ax[1].plot(np.arange(len(st)) * 0.1 * 24, st)
    ax[1].set_xlim(0, 720); ax[1].set_ylim(-50, -5); ax[1].grid(alpha=0.3)
    ax[1].set_ylabel('~LUFS 400ms')
    tt, fl = onset_env(x)
    ax[2].plot(tt * 24, fl, lw=0.5)
    for cf in CUES:
        ax[2].axvline(cf, color='r', lw=0.4, alpha=0.5)
    ax[2].set_xlim(0, 720)
    plt.tight_layout()
    plt.savefig(f'{OUT}/analysis/{v}.png', dpi=80)
    plt.close()
    return res


if __name__ == '__main__':
    for v in sys.argv[1:]:
        r = analyse(v)
        print(json.dumps({k: r[k] for k in ['integrated_lufs', 'true_peak_dbtp', 'stem_loudness_share_pct',
                                           'octave_bands_db', 'rollcall_rms_dbfs', 'no_third_windows',
                                           'final_chord_third_ratio']}, indent=1))
        big = {k: vv for k, vv in r['cue_onsets'].items() if k in BIG}
        print('big hits:', big)
        print('all cues (mix):', {k: vv['offset_ms'] for k, vv in r['cue_onsets'].items()})
        print('cues by stem:', {k: (vv['stem'][:5], vv['offset_ms']) for k, vv in r['cue_onsets_by_stem'].items()})
