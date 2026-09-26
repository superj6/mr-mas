"""Sub-deliverables for one track (OST-BIBLE s6.4): section cuts, extra seamless loops, alternates.

Rendered with the OST engine's own render_score / render_loop (the engine is never edited), then levelled
to the track's OWN underscore master: each part's raw mix (with the underscore dialog pocket) is matched in K-weighted
loudness to the loudness of the matching slice of <id>-underscore.wav, so a part intercuts with the stitched cue.
Parts that are not in the stitched cue (hold bars, alternates) take a gain from a named reference part.

Every part is written as render/parts/<id>-<part>.wav (24-bit, 48 kHz) + .mp3; loops also get
-loop.wav / -loop-tail.wav / -loop-x3-preview.mp3.  render/parts/<id>-parts.json lists each part with its
bars, frames, measured loudness and (for loops) the seam check.
"""
from __future__ import annotations

import json
import os
from dataclasses import replace

import numpy as np
import soundfile as sf

from engine import render_score, render_loop, analysis
from engine.core import SR, FPS, s2n, todb, to_stereo, lp
from engine.mix import true_peak
from engine.export import pocket, MASTERS, write_audio, mp3, mp3_from_array, end_fade, trim_len
import pyloudnorm as pyln

PK = MASTERS['underscore']['pocket']
CEIL = MASTERS['underscore']['ceiling']          # -3 dBTP: the picture masters' ceiling (s0 rule 14)


def safe(x, periodic=False):
    """The underscore master's true-peak ceiling for a part (the stitched master has a limiter; a part is levelled
    by one gain, so its peaks can land higher).  periodic=True: a loop (limiter run on the loop tiled x3)."""
    from engine.mix import limiter_gain
    if todb(true_peak(x)) <= CEIL - 0.05:
        return x
    if periodic:
        n = x.shape[1]
        t3 = np.concatenate([x, x, x], 1)
        g = limiter_gain(t3, CEIL - 0.15)[n:2 * n]
    else:
        g = limiter_gain(x, CEIL - 0.15)
    y = (x * g[None]).astype(np.float32)
    tp = true_peak(y)
    if todb(tp) > CEIL:
        y = (y * (10 ** (CEIL / 20) / tp * 0.995)).astype(np.float32)
    return y


def kcurve(x, win_s=3.0, hop_s=0.5):
    """BS.1770 short-term (3 s) / momentary (0.4 s) loudness, K-weighted PER CHANNEL along time.
    (Until the engine's fix 1 (2026-09-26), engine.mix.short_term_lufs ran its K-weighting across the two
    channels instead of along time and read several dB hot on low-heavy material.  The engine now matches this
    meter (mix.k_weight); the parts keep their own copy so their numbers stay comparable across renders.)"""
    m = pyln.Meter(SR)
    y = to_stereo(x).astype(np.float64)
    for _, f in m._filters.items():
        y = np.stack([f.apply_filter(c) for c in y])
    ms = (y ** 2).sum(0)
    w, h = int(win_s * SR), int(hop_s * SR)
    c = np.concatenate([[0.0], np.cumsum(ms)])
    return np.array([-0.691 + 10 * np.log10((c[a + w] - c[a]) / w + 1e-12)
                     for a in range(0, max(1, len(ms) - w + 1), h)])


def _shift(notes, t0):
    out = []
    for n in notes:
        m = n.copy(start=n.start - t0)
        m.x = {k: v for k, v in m.x.items() if not k.startswith('_') or k == '_seedkey'}
        m.x['_seedkey'] = n.x.get('_seedkey', n.start)      # keep the note's own humanise draws
        if m.start < 0:                                      # a note sounding into the part's first bar
            m.dur, m.start = max(0.05, m.dur + m.start), 0.0
            m.x['att'] = max(m.x.get('att', 0.0), 0.15)
        out.append(m)
    return out


def _shift_pts(pts, t0):
    return [(t - t0, v) for t, v in pts] if pts else pts


def sub_score(sc, notes, t0, t1, tail_s=4.0, loop=None, extra_mutes=(), autos=True):
    """The notes (chosen by the caller) as a new Score whose time 0 is t0.  autos=False drops the cue's own
    rides and cut-offs (stem_auto, macro, mutes): a hold loop must not inherit a fader move from elsewhere."""
    mutes = [(a - t0, b - t0) for a, b in list(sc.mutes) + list(extra_mutes) if b > t0 and a < t1 + tail_s]
    return replace(sc, notes=_shift(notes, t0), loop=(loop[0] - t0, loop[1] - t0) if loop else None,
                   length_s=t1 - t0, tail_s=tail_s, mutes=mutes if autos else [], markers=[], sections=[],
                   stem_auto={k: _shift_pts(v, t0) for k, v in (sc.stem_auto or {}).items()} if autos else {},
                   macro=_shift_pts(sc.macro, t0) if (sc.macro and autos) else None, end_fade=None,
                   meta={k: v for k, v in sc.meta.items() if k in ('id', 'title')})


def _mix(stems):
    return sum(pocket(v, PK) for v in stems.values())


def fit_gain(raw, under, t0, a=0.25, b=None):
    """k so that k * raw has the same K-weighted loudness as under[t0 + ...] over [a, b] seconds of the part.
    Loudness matching, not a waveform least-squares fit: a note that restarts at a part's head is not
    phase-coherent with the stitched master, and a least-squares fit would read it as a level error."""
    n = raw.shape[1]
    i0, i1 = s2n(a), min(n, s2n(b) if b else n)
    u = under[:, s2n(t0):s2n(t0) + n]
    if u.shape[1] < i1:
        u = np.pad(u, ((0, 0), (0, i1 - u.shape[1])))
    m = pyln.Meter(SR)
    try:
        lu = m.integrated_loudness(u[:, i0:i1].T.astype(np.float64))
        lr = m.integrated_loudness(raw[:, i0:i1].T.astype(np.float64))
    except Exception:
        return 1.0
    if not (np.isfinite(lu) and np.isfinite(lr)):
        return 1.0
    return float(10 ** ((lu - lr) / 20))


def measure(x):
    L = analysis.loudness(x)
    st = kcurve(x, 3.0, 0.5)
    mo = kcurve(x, 0.4, 0.1)
    st, mo = st[st > -60], mo[mo > -60]
    return dict(lufs_i=L['lufs'], true_peak_db=L['true_peak_db'],
                short_term_p95=round(float(np.percentile(st, 95)), 2) if len(st) else None,
                short_term_max=round(float(st.max()), 2) if len(st) else None,
                momentary_max=round(float(mo.max()), 2) if len(mo) else None,
                band_2_6k_db=analysis.band_ratio_db(x) if x.shape[1] > SR else None)


class Parts:
    def __init__(self, sc, track_dir, tid, workers=None):
        self.sc, self.g, self.tid = sc, sc.grid, tid
        self.out = os.path.join(track_dir, 'render', 'parts')
        os.makedirs(self.out, exist_ok=True)
        up = os.path.join(track_dir, 'render', f'{tid}-underscore.wav')
        self.under = sf.read(up, always_2d=True)[0].T.astype(np.float32)
        self.workers = workers
        self.k = {}
        self.rows = []

    def _write(self, name, x, previews=True):
        p = os.path.join(self.out, f'{self.tid}-{name}.wav')
        write_audio(p, x)
        if previews:
            mp3(p, p.replace('.wav', '.mp3'))
        return os.path.relpath(p, os.path.dirname(self.out))

    def _span(self, b0, b1):
        return self.g.t(*b0) if isinstance(b0, tuple) else self.g.t(b0), \
            self.g.t(*b1) if isinstance(b1, tuple) else self.g.t(b1)

    def linear(self, name, notes, b0, b1, tail_s=3.0, gain_from=None, fit=True, post=None, note='',
               fit_window=None, extra_mutes=(), gain_db=0.0):
        """A part at its place in the cue (bars [b0, b1)), plus up to tail_s of its own ring-out."""
        t0, t1 = self._span(b0, b1)
        sub = sub_score(self.sc, notes, t0, t1, tail_s, extra_mutes=extra_mutes)
        raw = _mix(render_score(sub, workers=self.workers, verbose=False))
        n = trim_len(raw, s2n(t1 - t0), floor_db=-70.0)
        raw = end_fade(raw[:, :n], 60)
        if gain_from:
            k = self.k[gain_from]
        elif fit:
            fa, fb = fit_window or (0.25, t1 - t0)
            k = fit_gain(raw, self.under, t0, fa, fb)
        else:
            k = 1.0
        k *= 10 ** (gain_db / 20)
        self.k[name] = k
        x = (raw * k).astype(np.float32)
        if post:
            x = post(x).astype(np.float32)
        x = safe(x)
        f = self._write(name, x)
        row = dict(part=name, kind='linear', file=f, bars=[str(b0), str(b1)], start_s=round(t0, 4),
                   start_frame=round(t0 * FPS, 2), body_s=round(t1 - t0, 4), file_s=round(x.shape[1] / SR, 4),
                   gain_vs_raw_db=round(todb(abs(k)), 2), note=note, **measure(x))
        self.rows.append(row)
        print(f'  part {name}: {row["file_s"]} s, {row["lufs_i"]} LUFS-I, M max {row["momentary_max"]}, '
              f'TP {row["true_peak_db"]}', flush=True)
        return x

    def stems(self, name, notes, b0, b1, gain_from, tail_s=3.0, families=None, note=''):
        """Per-family FLAC stems of these notes (e.g. an alternate orchestration a mixer can blend in), at the
        level of part `gain_from`.  They are NOT part of the master (they do not sum to it)."""
        t0, t1 = self._span(b0, b1)
        sub = sub_score(self.sc, notes, t0, t1, tail_s)
        st = render_score(sub, workers=self.workers, verbose=False)
        n = trim_len(sum(st.values()), s2n(t1 - t0), floor_db=-70.0)
        k = self.k[gain_from]
        files = {}
        for fam, v in st.items():
            if families and fam not in families:
                continue
            x = end_fade(pocket(v, PK)[:, :n] * k, 60).astype(np.float32)
            if np.abs(x).max() < 1e-6:
                continue
            p = os.path.join(self.out, f'{self.tid}-{name}-{fam}.flac')
            write_audio(p, x)
            files[fam] = os.path.relpath(p, os.path.dirname(self.out))
        row = dict(part=name, kind='stems', files=files, bars=[str(b0), str(b1)], start_s=round(t0, 4), note=note)
        self.rows.append(row)
        print(f'  stems {name}: {sorted(files)}', flush=True)
        return files

    def loop(self, name, notes, b0, b1, gain_from, note='', post=None):
        """A seamless loop of bars [b0, b1) (the body = these notes), at the level of part `gain_from`."""
        t0, t1 = self._span(b0, b1)
        sub = sub_score(self.sc, notes, t0, t1, 4.0, loop=(t0, t1), autos=False)
        loops, rings, info = render_loop(sub, workers=self.workers, verbose=False)
        lu = {}
        for k_, v in loops.items():
            t3 = pocket(np.concatenate([v, v, v], 1), PK)
            lu[k_] = t3[:, v.shape[1]:2 * v.shape[1]]
        k = self.k[gain_from]
        L = (sum(lu.values()) * k).astype(np.float32)
        R = (sum(pocket(v, PK) for v in rings.values()) * k).astype(np.float32)
        if post:
            L3 = post(np.concatenate([L, L, L], 1))
            L = L3[:, L.shape[1]:2 * L.shape[1]].astype(np.float32)
            R = post(R).astype(np.float32)
        L = safe(L, periodic=True)
        R = safe(R)
        nr = trim_len(np.concatenate([L[:, -1:], R], 1), 1, floor_db=-60) if R.shape[1] > 1 else 1
        R = end_fade(R[:, :nr], 50)
        f = self._write(f'{name}-loop', L, previews=False)
        ft = self._write(f'{name}-loop-tail', R, previews=False)
        pv = os.path.join(self.out, f'{self.tid}-{name}-loop-x3-preview.mp3')
        mp3_from_array(np.concatenate([L, L, L, R], 1), pv, self.out)
        seam = analysis.loop_seam(L)
        row = dict(part=name, kind='loop', file=f, tail=ft, preview=os.path.relpath(pv, os.path.dirname(self.out)),
                   bars=[str(b0), str(b1)], start_s=round(t0, 4), loop_s=round(info['seconds'], 6),
                   loop_frames=round(info['frames'], 3), frame_aligned=info['frame_aligned'],
                   tail_s=round(R.shape[1] / SR, 3), seam=seam, note=note,
                   **measure(np.concatenate([L, L], 1)))
        self.rows.append(row)
        print(f'  loop {name}: {row["loop_s"]} s ({row["loop_frames"]} fr), seam {seam["verdict"]}, '
              f'{row["lufs_i"]} LUFS-I', flush=True)
        return L, R

    def save(self, extra=None):
        p = os.path.join(self.out, f'{self.tid}-parts.json')
        with open(p, 'w') as fh:
            json.dump(dict(id=self.tid, level='each part is levelled to the track underscore master '
                                                '(K-weighted loudness match on its own span), or to the named part',
                           parts=self.rows, **(extra or {})), fh, indent=1, default=float)
        print(f'  parts -> {p}', flush=True)
