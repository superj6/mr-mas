#!/usr/bin/env python3
"""The Ep1 v3.5 score check: every segment's music stem against its lock, in one table (light: numpy, no render).

    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/v35check.py            # the final film (the EL lock)
    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/v35check.py --kokoro   # the Kokoro lock's stems
    ... --json PATH                                                                   # also write the table

Per segment (cold open, Act One to Act Four, the tag), from render/music[-el].wav, cues[-el].json and the lock:
  LENGTH     samples == the lock's frames x 2000 (exact)
  LOUDNESS   the whole stem's LUFS-I and true peak (dBTP)
  SILENCE    every run of digital zero >= 0.1 s sits in a marked silence or designed rest (+-0.35 s)
  HOLES      no run under -60 dBFS of 0.3 s or more outside a marked silence or rest
  FRAGMENTS  the cue sheet's own count of undesigned music runs under 2 s
  CUT STEPS  the audit's method: the stem's K-weighted level 0.5 s either side of every cut (beat start); every step
             of 12 dB or more must sit within 0.8 s of a cue mark or designed hit, or inside a marked silence or rest
  ENGINE     each cue's F-major check (written and spectral), rule 12 (a written A-natural over an F bass), the knee
             (whole and completion): from the cue sheets
Nothing here listens.  Every judgement is a measurement.
"""
from __future__ import annotations

import json
import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import v3lib as V   # noqa: E402

SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
TRACKS = os.path.join(V.REPO, 'audio', 'ost', 'tracks')


def kdb(x):
    """K-weighted mean-square level of x [2, n] in dB (floor -70)"""
    from engine.mix import k_weight
    if x.shape[1] < 100 or np.abs(x).max() < 1e-9:
        return -70.0
    z = k_weight(np.asarray(x, dtype=np.float64))
    ms = float(np.mean(z ** 2, axis=1).sum())
    return max(-70.0, -0.691 + 10 * math.log10(ms + 1e-20))


def windows(doc):
    """marked silences and designed rests, as (t0, t1, why)"""
    out = []
    for k in ('silences_designed', 'silences', 'rests', 'marked_silences'):
        for r in doc.get(k) or []:
            if isinstance(r, dict) and 't0' in r:
                out.append((r['t0'], r['t1'], r.get('why') or r.get('what') or k))
    m = doc.get('measured') or {}
    for r in m.get('marked_silences') or []:
        out.append((r['t0'], r['t1'], r.get('what') or 'marked'))
    return out


def marks(doc):
    """every cue mark and designed hit (seconds on the segment clock)"""
    out = []
    for c in doc.get('cues') or []:
        for s in c.get('sync') or []:
            out.append(s['t'])
        for s in c.get('marks') or []:
            out.append(s[0] if isinstance(s, (list, tuple)) else s.get('t'))
        for s in c.get('events') or []:
            if isinstance(s, dict) and 't' in s:
                out.append(s['t'])
    for h in doc.get('designed_hit') or []:
        out.append(h['t'])
    return [t for t in out if t is not None]


def engine(doc):
    """(f_major_ok, rule12_ok, knee_whole, knee_completion, notes) over every cue of the segment"""
    fm, r12, kw, kc, notes = True, True, 0, 0, []
    for c in doc.get('cues') or []:
        q, nq = c.get('engine_qa') or {}, c.get('note_qa') or {}
        if q:
            if q.get('f_major_ok') is False or q.get('f_major_ok_written') is False:
                fm = False
                notes.append(f"{c.get('cue')}: F-major worst {q.get('f_major_worst')}")
            kw += q.get('knee_whole') or 0
            kc += q.get('knee_completion') or 0
        if nq:
            r12 = r12 and nq.get('written_third_ok', True)
            kw += nq.get('knee_whole') or 0
            kc += nq.get('knee_completion') or 0
    m = doc.get('measured') or {}
    for name, q in (m.get('engine_qa') or {}).items():
        if not isinstance(q, dict):
            continue
        if q.get('f_major_written_ok') is False:
            r12 = False
            notes.append(f'{name}: rule 12')
        if q.get('f_major_spectral_ok') is False:
            fm = False
            notes.append(f"{name}: spectral F-major {q.get('f_major_fails')}")
        kw += q.get('knee_whole') or 0
        kc += q.get('knee_completion') or 0
    if doc.get('segment') == 'coldopen' or 'coldopen' in (doc.get('id') or ''):
        for c in doc.get('cues') or []:
            nq = c.get('note_qa') or {}
            r12 = r12 and nq.get('written_third_ok', True)
    return fm, r12, kw, kc, notes


def check(seg, el=True):
    import soundfile as sf
    from engine.mix import lufs, true_peak
    tag = '-el' if el else ''
    tl = V.TL(V.el_path(seg) if el else V.kokoro_path(seg))
    wav = os.path.join(TRACKS, f'e01-v3-{seg}', 'render', f'music{tag}.wav')
    doc = json.load(open(os.path.join(TRACKS, f'e01-v3-{seg}', f'cues{tag}.json')))
    x, sr = sf.read(wav, always_2d=True, dtype='float64')
    x = x.T
    N = x.shape[1]
    W = windows(doc)
    M = marks(doc)
    res = dict(seg=seg, frames=tl.frames, seconds=round(N / sr, 4), exact=(N == tl.samples),
               lufs_i=round(lufs(x), 2), true_peak_dbtp=round(20 * math.log10(true_peak(x) + 1e-12), 2))
    # digital silence
    nz = np.abs(x).max(0) > 0.0
    edges = np.flatnonzero(np.diff(np.concatenate([[1], nz.astype(np.int8), [1]])))
    unmarked = []
    for k in range(0, len(edges), 2):
        a, b = edges[k] / sr, edges[k + 1] / sr
        if b - a >= 0.1 and not any(w0 - 0.35 <= a and b <= w1 + 0.35 for w0, w1, _ in W):
            unmarked.append((round(a, 3), round(b, 3)))
    res['unmarked_silence'] = unmarked
    # holes under -60 dBFS
    hop = int(0.05 * sr)
    env = np.abs(x).max(0)[: (N // hop) * hop].reshape(-1, hop).max(1)
    q = env < 10 ** (-60 / 20)
    holes, i = [], 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]:
                j += 1
            a, b = i * hop / sr, j * hop / sr
            if b - a >= 0.3 and not any(w0 - 1.6 <= a and b <= w1 + 0.4 for w0, w1, _ in W):
                holes.append((round(a, 2), round(b, 2)))
            i = j
        else:
            i += 1
    res['holes'] = holes
    m = doc.get('measured') or {}
    fr = m.get('undesigned_fragments')
    if fr is None:
        fr = [f for f in (m.get('fragments_under_2s') or []) if not (isinstance(f, dict) and f.get('designed_sting'))]
    res['fragments'] = fr
    # cut steps
    steps, bad = [], []
    for b in tl.beats[1:]:
        t = b['t0']
        i0, i1 = int(round(t * sr)), int(round(t * sr))
        L0 = kdb(x[:, max(0, i0 - int(0.5 * sr)):i0])
        L1 = kdb(x[:, i1:min(N, i1 + int(0.5 * sr))])
        d = L1 - L0
        if abs(d) >= 12.0:
            near = min((abs(mt - t) for mt in M), default=99)
            inside = [w for w0, w1, w in W if w0 - 0.35 <= t <= w1 + 0.35]
            ok = near <= 0.8 or bool(inside)
            row = dict(beat=b['id'], t=round(t, 3), step_db=round(d, 1), before=round(L0, 1), after=round(L1, 1),
                       mark_within_s=round(near, 2), in_marked=(inside[0][:60] if inside else None), ok=ok)
            steps.append(row)
            if not ok:
                bad.append(row)
    res['cut_steps_12db'] = steps
    res['cut_steps_unmarked'] = bad
    fm, r12, kw, kc, notes = engine(doc)
    res.update(f_major_ok=fm, rule12_ok=r12, knee_whole=kw, knee_completion=kc, engine_notes=notes)
    res['pass'] = bool(res['exact'] and not unmarked and not holes and not fr and not bad and fm and r12 and kw == 0
                       and kc == 0 and res['true_peak_dbtp'] <= -1.0)
    return res


def main():
    el = '--kokoro' not in sys.argv
    out = []
    for seg in SEGS:
        try:
            r = check(seg, el)
        except FileNotFoundError as e:           # noqa: PERF203
            r = dict(seg=seg, error=str(e), **{'pass': False})
        out.append(r)
        if 'error' in r:
            print(f'{seg:9s} MISSING {r["error"]}')
            continue
        print(f"{seg:9s} {r['frames']:6d} f {r['seconds']:9.3f} s exact={r['exact']!s:5s} {r['lufs_i']:6.2f} LUFS-I "
              f"{r['true_peak_dbtp']:6.2f} dBTP | silence {len(r['unmarked_silence'])} holes {len(r['holes'])} "
              f"frag {len(r['fragments'])} | 12 dB steps {len(r['cut_steps_12db'])} unmarked "
              f"{len(r['cut_steps_unmarked'])} | F-major {r['f_major_ok']} rule12 {r['rule12_ok']} knee "
              f"{r['knee_whole']}/{r['knee_completion']} | {'PASS' if r['pass'] else 'FAIL'}")
        for k in ('unmarked_silence', 'holes', 'fragments', 'cut_steps_unmarked', 'engine_notes'):
            if r.get(k):
                print(f'   {k}: {r[k]}')
    if '--json' in sys.argv:
        V.write_json(sys.argv[sys.argv.index('--json') + 1], out)


if __name__ == '__main__':
    main()
