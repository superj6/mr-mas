"""Render, lay and measure: the Ep1 v3 segment scores (shared by tracks/e01-v3-act3 and tracks/e01-v3-act4).

A segment's score is several cues.  Each cue is an OST-engine Score whose file t = 0 sits at segment time T0; the
engine renders it (export.build, underscore master only kept), and lay() places every cue's underscore master on the
segment clock inside its window [a0, a1) with a guard fade, sums them and writes ONE 48 kHz / 24-bit stereo WAV of the
segment's exact length (its frames x 2000 samples).  measure() reads that file back and reports what can be measured:
loudness per cue window and per section, true peak, every digital-silence run (each must sit in a marked silence),
holes (-60 dBFS for 0.3 s or more) and every music run shorter than 2 s (a fragment), plus each cue's engine QA
(rule 12 written and spectral, the knee, the warnings).

This file is identical in tracks/e01-v3-act3/ and tracks/e01-v3-act4/.  Nothing here was listened to.
"""
from __future__ import annotations

import json
import math
import os
import sys
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..'))
if OST not in sys.path:
    sys.path.insert(0, OST)
SR = 48000


def render(cues, work, workers=None, keep_album=False):
    """cues: [(key, builder)] where builder() -> (Score, T0, window, meta_extra).  Writes <work>/<name>-underscore.wav,
    .cue.json, .mid, -pianoroll.png and <name>.lay.json."""
    from engine.export import build as ebuild
    os.makedirs(work, exist_ok=True)
    for key, fn in cues:
        t0 = time.time()
        sc, T0, window, extra = fn()
        ebuild(sc, work, sc.name, stems=False, loop=False, previews=False,
               workers=workers or int(os.environ.get('OST_WORKERS', '2')))
        if not keep_album:
            p = os.path.join(work, f'{sc.name}-album.wav')
            if os.path.exists(p):
                os.remove(p)
        json.dump(dict(key=key, name=sc.name, T0=T0, window=window, **extra),
                  open(os.path.join(work, f'{sc.name}.lay.json'), 'w'), indent=1, default=float)
        print(f'[{key}] {sc.name}: rendered in {time.time() - t0:.0f} s', flush=True)


def _fade(n, kind):
    u = np.linspace(0.0, 1.0, max(1, n), dtype=np.float64)
    return np.sin(0.5 * np.pi * u) if kind == 'in' else np.cos(0.5 * np.pi * u)


def lay(names, work, N, out_wav, zero=()):
    """Lay each cue's underscore master at its T0, gated to its window (fade_in / fade_out seconds, 0 = dead stop
    with a 3 ms fade), sum, write out_wav (24-bit).  Returns (mix, lay info)."""
    import soundfile as sf
    mix = np.zeros((2, N), dtype=np.float64)
    info = {}
    for name in names:
        lj = json.load(open(os.path.join(work, f'{name}.lay.json')))
        x, sr = sf.read(os.path.join(work, f'{name}-underscore.wav'), always_2d=True, dtype='float64')
        assert sr == SR, sr
        x = x.T
        i0 = int(round(lj['T0'] * SR))
        w = list(lj['window']) + [None, None]
        a0, a1 = w[0], w[1]
        fin = 0.0 if w[2] is None else float(w[2])            # 0: the cue's own first sound is its entry
        fout = 0.25 if w[3] is None else float(w[3])          # a guard fade into a1 (0.003 = a dead stop)
        j0, j1 = max(0, int(round(a0 * SR))), min(N, int(round(a1 * SR)))
        seg = np.zeros((2, N))
        lo, hi = max(0, i0), min(N, i0 + x.shape[1])
        if hi > lo:
            seg[:, lo:hi] = x[:, lo - i0:hi - i0]
        gate = np.zeros(N)
        gate[j0:j1] = 1.0
        if fin > 0:
            k = min(int(fin * SR), j1 - j0)
            gate[j0:j0 + k] *= _fade(k, 'in')
        if j1 < N or fout > 0.003:
            k = min(max(int(fout * SR), int(0.003 * SR)), j1 - j0)
            gate[j1 - k:j1] *= _fade(k, 'out')
        for r0, r1 in lj.get('rests', []):                 # designed rests inside the window: digital zero
            gate[int(round(r0 * SR)):int(round(r1 * SR))] = 0.0
        mix += seg * gate[None]
        info[name] = dict(T0=round(lj['T0'], 4), window=[round(a0, 4), round(a1, 4)], fade=[fin, fout],
                          rests=lj.get('rests', []))
    for z0, z1, *_ in zero:                                # the marked silences: digital zero (the designed stops;
        mix[:, max(0, int(round((z0 + 0.003) * SR))):int(round((z1 - 0.02) * SR))] = 0.0   # the mix mutes them anyway)
    y = np.clip(mix, -1.0, 1.0).T.astype(np.float32)
    sf.write(out_wav, y, SR, subtype='PCM_24')
    return mix, info


def _runs(mask, hop_s):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            out.append((i * hop_s, j * hop_s))
            i = j
        else:
            i += 1
    return out


def measure(wav, silences, sections, windows, work, names, rests=()):
    """silences: [(t0, t1, what)] the marked (designed) silences of the music stem.  sections: [(label, t0, t1, cue)].
    windows: {cue: (a0, a1)}."""
    import soundfile as sf
    from engine import analysis as an
    from engine.mix import lufs, true_peak
    x, sr = sf.read(wav, always_2d=True, dtype='float64')
    x = x.T
    N = x.shape[1]

    def stats(t0, t1):
        i0, i1 = max(0, int(t0 * SR)), min(N, int(t1 * SR))
        z = x[:, i0:i1]
        if z.shape[1] < int(0.4 * SR) or np.abs(z).max() < 1e-9:
            return dict(lufs_i=None)
        st = an.short_term_stats(z) if z.shape[1] > int(3.5 * SR) else dict(p95=None, max=None)
        return dict(lufs_i=round(lufs(z), 2), st_p95=st['p95'], st_max=st['max'],
                    true_peak_dbtp=round(20 * math.log10(true_peak(z) + 1e-12), 2))

    res = dict(file=wav, samples=N, seconds=round(N / SR, 4))
    res['whole'] = dict(lufs_i=round(lufs(x), 2), true_peak_dbtp=round(20 * math.log10(true_peak(x) + 1e-12), 2),
                        st=an.short_term_stats(x))
    res['cues'] = {k: dict(window=[round(a, 3), round(b, 3)], **stats(a, b)) for k, (a, b) in windows.items()}
    res['sections'] = [dict(section=lab, cue=cue, start=round(a, 3), end=round(b, 3), **stats(a, b))
                       for lab, a, b, cue in sections if b - a >= 0.5]
    # every digital-zero run (both channels exactly 0) of 10 ms or more
    z = (np.abs(x).max(0) == 0.0)
    hop = int(0.01 * SR)
    zz = z[: (N // hop) * hop].reshape(-1, hop).all(1)
    zero_runs = [(round(a, 3), round(b, 3)) for a, b in _runs(zz, hop / SR) if b - a >= 0.02]

    def marked(a, b, tol=0.12):
        return any(s0 - tol <= a and b <= s1 + tol for s0, s1, _ in silences)
    res['digital_silence'] = [dict(t0=a, t1=b, marked=marked(a, b)) for a, b in zero_runs]
    res['unmarked_digital_silence'] = [r for r in res['digital_silence'] if not r['marked']]
    res['marked_silences'] = []
    for s0, s1, what in silences:
        seg = x[:, int((s0 + 0.005) * SR):int((s1 - 0.02) * SR)]      # inside the 3 ms stop fade and a re-entry's lead
        pk = float(np.abs(seg).max()) if seg.size else 0.0
        res['marked_silences'].append(dict(t0=round(s0, 3), t1=round(s1, 3), what=what, digital_zero=(pk == 0.0),
                                           peak_dbfs=None if pk == 0 else round(20 * math.log10(pk), 1)))
    # holes (under -60 dBFS for 0.3 s or more) and music runs (above it); a run under 2 s is a fragment to hear
    hop = int(0.05 * SR)
    env = np.abs(x).max(0)[: (N // hop) * hop].reshape(-1, hop).max(1)
    quiet = env < 10 ** (-60 / 20)
    holes = []
    for a, b in _runs(quiet, hop / SR):
        if b - a >= 0.3:
            rest = next((w for r0, r1, w in rests if r0 - 1.6 <= a and b <= r1 + 0.6), None)
            holes.append(dict(t0=round(a, 2), t1=round(b, 2), designed=bool(marked(a, b, tol=1.6) or rest),
                              what=rest))
    res['holes'] = holes
    runs = [(round(a, 2), round(b, 2)) for a, b in _runs(~quiet, hop / SR)]
    res['music_runs'] = runs
    res['fragments_under_2s'] = [dict(t0=a, t1=b) for a, b in runs if b - a < 2.0]
    # each cue's engine QA
    qa = {}
    for name in names:
        p = os.path.join(work, f'{name}.cue.json')
        if not os.path.exists(p):
            continue
        cj = json.load(open(p))
        q = cj.get('qa', {})
        fm = q.get('f_major', {}) or {}
        kc = cj.get('knee_completion')
        qa[name] = dict(
            underscore=(cj.get('masters') or {}).get('underscore'),
            f_major_written_ok=fm.get('ok_written'), f_major_spectral_ok=fm.get('ok_spectral'),
            f_major_fails=[dict(t0=w.get('t0'), t1=w.get('t1'), a_over_f=w.get('a_over_f'), cls=w.get('class'))
                           for w in (fm.get('fails') or [])][:8],
            knee_completion=kc,
            knee_whole=cj.get('knee_whole'),
            st_p95=(q.get('short_term_underscore') or {}).get('p95'), band_2_6k_db=q.get('band_2_6k_db'),
            balance=(q.get('balance') or {}).get('balance'), chip_share=(q.get('balance') or {}).get('chip_share'),
            warnings=cj.get('warnings', []))
    res['engine_qa'] = qa
    return res
