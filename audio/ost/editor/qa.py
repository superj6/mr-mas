"""Music editor's QA pass over every rendered OST cue, re-measured from the FILES on disk.

    ../../.venv-theme/bin/python qa.py            # every cue sheet under ../tracks/*/render/ (and one level down)
    ../../.venv-theme/bin/python qa.py mm05       # only cue sheets whose path contains 'mm05' (-> qa-partial.json)
    ../../.venv-theme/bin/python qa.py --loops    # only every loop file on disk (-> qa-loops.json; a full run does it too)
    QA_WORKERS=4 ...                              # parallel cues (default 4; the machine is shared)

v2 (fix pass 1, 2026-09-26): the meters and the rule checks are the ENGINE's corrected functions, run on the
files, not the cue sheets' numbers:
  * album + underscore masters: LUFS-I (pyloudnorm), true peak (4x), sample peak, clipped samples, DC, length;
    short-term (3 s / 0.5 s) with the engine's corrected `mix.short_term_lufs` (K-weighting along time, fix 1),
    cross-checked against this file's own along-time meter (`st_meter_delta_lu`, expect ~0.000); momentary max;
  * the underscore's spectrum (2-6 kHz share, < 60 Hz share, centroid);
  * stems: sum to the underscore master (residual dB re the master's RMS), same length;
  * loops: frame-aligned length, the wrap step, the HF click energy at the seam, the level across the wrap;
  * hits: every cue-sheet marker (not on a stop) re-measured on the underscore WAV with `analysis.hits`;
  * silence: every silence window and hard stop re-measured (peak dBFS) on both masters;
  * V.O. windows: LUFS of the underscore inside each composed V.O. window (-24 +-2);
  * MIDI (the notes as written; the file carries no pedal or bends):
      - the whole knee in the exact old sense (F F F F G Ab C F in one line, any key, < 8 s),
      - `analysis.knee_completion` (by pitch class, any register, gaps <= 2.5 s, across phrases AND the loop seam),
      - `analysis.written_third` (A-natural sounding where F is the lowest note, at EVERY note boundary);
  * F-major, spectral: `analysis.f_major_check` on the sum of the pitched stems (no drums / fx), with the MIDI
    notes and the cue sheet's instrument families, so an A peak is traced to its stem and classed.  This is a
    CROSS-CHECK: the MIDI has no pedal, and two same-pitch notes on one track collapse to the shorter (MM-09's
    arco + pizz Bb1 at 5.0 s), so the engine's cue-sheet result (full note data) is the verdict and a file-only
    disagreement is listed under `crosscheck` for the editor to inspect;
  * sub under the room SFX: `analysis.sub_under_room` on the underscore + stems, in the cue sheet's windows;
  * the MIDI is not stale (written within 15 min of the underscore / album WAV);
  * the MP3 previews exist, decode to the WAV's length and are newer than the WAV.
The engine's own cue-sheet QA (warnings, balance, f_major with the pedal) is copied alongside for comparison.
Writes editor/qa.json, and (full run or --loops) editor/qa-loops.json: every loop file on disk, parts included.
"""
import glob
import json
import os
import subprocess
import sys
import types
from concurrent.futures import ProcessPoolExecutor

import numpy as np
import pretty_midi
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.dirname(HERE)
sys.path.insert(0, OST)
from engine import analysis as EA          # noqa: E402  (the corrected meters and fix-5 checks)
from engine import mix as EM               # noqa: E402
from engine.core import Note               # noqa: E402

FFDIR = '/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu'
SR = 48000
KNEE_PC = [0, 0, 0, 0, 2, 3, 7, 0]


def read(p, dtype='float64'):
    x, sr = sf.read(p, dtype=dtype, always_2d=True)
    assert sr == SR, (p, sr)
    return x.T                                                  # [ch, n]


def kweight(x):
    """BS.1770 K-weighting along TIME for each channel (x: [ch, n]); independent of the engine's."""
    y = x.astype(np.float64, copy=True)
    for _, f in pyln.Meter(SR)._filters.items():
        y = f.passband_gain * signal.lfilter(f.b, f.a, y, axis=1)
    return y


def windowed_lufs(x, win_s, hop_s):
    y = kweight(x)
    ms = (y ** 2).sum(0)
    w, h = int(win_s * SR), int(hop_s * SR)
    c = np.concatenate([[0.0], np.cumsum(ms)])
    starts = np.arange(0, max(1, len(ms) - w + 1), h)
    e = (c[np.minimum(starts + w, len(ms))] - c[starts]) / w
    return starts / SR, -0.691 + 10 * np.log10(e + 1e-15)


def lufs_i(x):
    try:
        v = pyln.Meter(SR).integrated_loudness(x.T.astype(np.float64))
    except Exception:
        return None
    return round(float(v), 2) if np.isfinite(v) else None


def true_peak_db(x):
    up = signal.resample_poly(x, 4, 1, axis=1)
    return round(20 * np.log10(np.abs(up).max() + 1e-15), 2)


def level_report(x):
    st_e = EM.short_term_lufs(x, 3.0, 0.5)                     # the engine's corrected meter (fix 1)
    _, st_o = windowed_lufs(x, 3.0, 0.5)                        # this file's own
    m = min(len(st_e), len(st_o))
    live = (st_e[:m] > -60) & (st_o[:m] > -60)
    delta = float(np.abs(st_e[:m][live] - st_o[:m][live]).max()) if live.any() else 0.0
    stg = st_e[st_e > -60]
    _, mo = windowed_lufs(x, 0.4, 0.1)
    return dict(lufs=lufs_i(x), tp_db=true_peak_db(x),
                peak_db=round(20 * np.log10(np.abs(x).max() + 1e-15), 2),
                clipped=int((np.abs(x) >= 0.9999).sum()),
                dc=round(float(np.abs(x.mean(1)).max()), 6),
                st_p95=round(float(np.percentile(stg, 95)), 2) if len(stg) else None,
                st_median=round(float(np.median(stg)), 2) if len(stg) else None,
                st_max=round(float(stg.max()), 2) if len(stg) else None,
                st_meter_delta_lu=round(delta, 4),
                mom_max=round(float(mo.max()), 2),
                seconds=round(x.shape[1] / SR, 4), samples=int(x.shape[1]))


def spectrum(x):
    m = x.mean(0)
    f, P = signal.welch(m, SR, nperseg=8192)
    tot = P.sum() + 1e-20
    band = P[(f >= 2000) & (f < 6000)].sum() / tot
    sub = P[f < 60].sum() / tot
    return dict(band_2_6k_db=round(10 * np.log10(band + 1e-20), 1), sub_60_db=round(10 * np.log10(sub + 1e-20), 1),
                centroid_hz=round(float((f * P).sum() / tot)))


def loop_check(p, tail_p=None):
    x = read(p)
    n = x.shape[1]
    spf = SR / 24
    tile = np.concatenate([x, x], 1)
    step = np.abs(np.diff(x, axis=1)).max(0)
    p99 = float(np.percentile(step, 99)) + 1e-12
    p999 = float(np.percentile(step, 99.9)) + 1e-12
    wrap = float(np.abs(x[:, 0] - x[:, -1]).max())
    sos = signal.butter(4, 6000, 'hp', fs=SR, output='sos')
    h = signal.sosfilt(sos, tile.mean(0))
    w = int(0.003 * SR)
    e = np.convolve(h ** 2, np.ones(w) / w, mode='same')
    seam = e[n - w:n + w].max()
    body = e[n + 4 * w: 2 * n - 4 * w]
    rank = float((body < seam).mean())
    k = int(0.05 * SR)
    r_end = 20 * np.log10(np.sqrt((x[:, -k:] ** 2).mean()) + 1e-15)
    r_beg = 20 * np.log10(np.sqrt((x[:, :k] ** 2).mean()) + 1e-15)
    out = dict(file=os.path.relpath(p, OST), seconds=round(n / SR, 4), frames=round(n / spf, 3),
               frame_aligned=abs(n / spf - round(n / spf)) < 1e-6,
               wrap_step=round(wrap, 5), wrap_vs_p99_step=round(wrap / p99, 3), wrap_vs_p999_step=round(wrap / p999, 3),
               seam_hf_ratio=round(float(seam / (np.median(body) + 1e-20)), 2), seam_hf_rank=round(rank * 100, 2),
               rms_end_db=round(r_end, 1), rms_begin_db=round(r_beg, 1),
               lufs_2x=lufs_i(tile), tp_db=true_peak_db(x))
    out['verdict'] = 'seamless' if (wrap / p99 < 1.0 or rank < 0.995) else 'CHECK'
    if tail_p and os.path.exists(tail_p):
        t = read(tail_p)
        out['tail_s'] = round(t.shape[1] / SR, 3)
        out['tail_end_db'] = round(20 * np.log10(np.abs(t[:, -int(0.01 * SR):]).max() + 1e-15), 1)
    return out


def mp3_check(mp3, wav):
    if not os.path.exists(mp3):
        return dict(ok=False, why='missing')
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    r = subprocess.run([f'{FFDIR}/ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
                        'default=nw=1:nk=1', mp3], capture_output=True, text=True, env=env)
    try:
        d = float(r.stdout.strip())
    except ValueError:
        return dict(ok=False, why=f'ffprobe: {r.stderr.strip()[:120]}')
    wd = sf.info(wav).duration
    newer = os.path.getmtime(mp3) >= os.path.getmtime(wav) - 1
    return dict(ok=abs(d - wd) < 0.08 and newer, mp3_s=round(d, 3), wav_s=round(wd, 3), newer_than_wav=newer)


# ---------------------------------------------------------------------------------------------- MIDI
def midi_notes(p):
    pm = pretty_midi.PrettyMIDI(p)
    out = []
    for ins in pm.instruments:
        if ins.is_drum:
            continue
        name = ins.name or f'prog{ins.program}'
        for n in ins.notes:
            out.append(Note(name, float(n.pitch), float(n.start), float(n.end - n.start), n.velocity / 127.0))
    out.sort(key=lambda n: (n.start, n.pitch))
    return out


def knee_exact(notes):
    """The old check: F F F F G Ab C F by pitch class in one instrument's top line, any key, within 8 s."""
    by = {}
    for n in notes:
        by.setdefault(n.inst, []).append((n.start, n.pitch))
    hits = []
    for name, ns in by.items():
        ns.sort()
        top = []
        for s, pch in ns:
            if top and abs(top[-1][0] - s) < 0.02:
                top[-1] = (top[-1][0], max(top[-1][1], pch))
            else:
                top.append((s, pch))
        pcs = [int(round(q)) % 12 for _, q in top]
        for i in range(len(pcs) - 7):
            base = pcs[i]
            if all((pcs[i + j] - base) % 12 == KNEE_PC[j] for j in range(8)) and top[i + 7][0] - top[i][0] < 8.0:
                hits.append(dict(inst=name, t=round(top[i][0], 3), key_pc=base))
    return hits


def midi_checks(p, loop=None):
    notes = midi_notes(p)
    kc = EA.knee_completion(notes)
    seam = []
    if loop:
        t0, t1 = loop
        L = t1 - t0
        pre = [n for n in notes if n.start < t0 - 1e-6]
        body = [n for n in notes if t0 - 1e-6 <= n.start < t1 - 1e-6]
        post = [n for n in notes if n.start >= t1 - 1e-6]
        two = pre + body + [n.copy(start=n.start + L) for n in body] + [n.copy(start=n.start + L) for n in post]
        seam = [h for h in EA.knee_completion(two)['hits'] if h['t0'] < t1 <= h['t1']]
    wt = EA.written_third(notes)
    return dict(notes=len(notes), lines=len({n.inst for n in notes}), knee_whole=knee_exact(notes),
                knee_completion=kc['count'] + len(seam),
                knee_completion_hits=(kc['hits'] + [dict(h, across_loop_seam=True) for h in seam])[:6],
                written_third=wt['count'], written_third_events=wt['events'][:8], written_third_grazes=wt['n_grazes']), notes


# ---------------------------------------------------------------------------------------------- per cue
def qa_cue(cue_path):
    c = json.load(open(cue_path))
    rdir = os.path.dirname(cue_path)
    tdir = os.path.dirname(rdir) if os.path.basename(rdir) == 'render' else os.path.dirname(os.path.dirname(rdir))
    F = c.get('files', {})

    def path(rel):
        if rel is None:
            return None
        for base in (tdir, os.path.dirname(rdir), rdir, os.path.dirname(tdir)):
            q = os.path.join(base, rel)
            if os.path.exists(q):
                return q
        return os.path.join(tdir, rel)

    out = dict(id=c['id'], mm=c.get('mm'), family=c.get('family'), title=c['title'], cue=os.path.relpath(cue_path, OST))
    tgt = c.get('masters', {})
    qa = c.get('qa', {})
    # MM-10 / MM-11 (fix pass 1): the PICTURE cue sheet's album_wav is the album EDIT (another timeline), so the
    # picture's silence windows are judged on the underscore only
    edit_album = 'album edit' in str(tgt.get('album', {}).get('source', ''))
    if edit_album:
        out['album_is_album_edit'] = tgt['album']['source']
    masters = {}
    for role in ('album', 'underscore'):
        p = path(F.get(f'{role}_wav'))
        if not p or not os.path.exists(p):
            out[role] = dict(missing=True)
            continue
        x = read(p)
        masters[role] = x
        r = level_report(x)
        r['target_lufs'] = tgt.get(role, {}).get('target_lufs')
        r['ceiling_dbtp'] = tgt.get(role, {}).get('ceiling_dbtp')
        r['file'] = os.path.relpath(p, OST)
        r['mtime'] = os.path.getmtime(p)
        if role == 'underscore':
            r.update(spectrum(x))
        r['mp3'] = mp3_check(p.replace('.wav', '.mp3'), p)
        out[role] = r
    under = masters.get('underscore')
    # stems
    st = F.get('stems') or {}
    stems = {}
    if st and under is not None:
        acc = np.zeros_like(under)
        lens = {}
        for fam, rel in st.items():
            q = path(rel)
            if not os.path.exists(q):
                lens[fam] = 'MISSING'
                continue
            s = read(q)
            lens[fam] = s.shape[1]
            stems[fam] = s
            m = min(acc.shape[1], s.shape[1])
            acc[:, :m] += s[:, :m]
        n = under.shape[1]
        rms = np.sqrt((under ** 2).mean()) + 1e-15
        res = np.sqrt(((acc - under) ** 2).mean()) + 1e-15
        out['stems'] = dict(families=sorted(st), residual_db_re_master=round(20 * np.log10(res / rms), 1),
                            residual_peak_dbfs=round(20 * np.log10(np.abs(acc - under).max() + 1e-15), 1),
                            lengths_match=all(v == n for v in lens.values()))
        del acc
    elif under is not None:
        out['stems'] = dict(families=[], note='no stems in the cue sheet')
    # loops
    loops = []
    if F.get('loop_wav') and os.path.exists(path(F['loop_wav'])):
        loops.append(loop_check(path(F['loop_wav']), path(F.get('loop_tail_wav'))))
    for extra in sorted(glob.glob(os.path.join(rdir, f"{c['id']}-loop*.wav"))):
        if extra.endswith('-tail.wav') or (F.get('loop_wav') and os.path.samefile(extra, path(F['loop_wav']))):
            continue
        loops.append(loop_check(extra, extra.replace('.wav', '-tail.wav')))
    out['loops'] = loops
    ref = under if under is not None else masters.get('album')      # hits / V.O.: the picture master first
    # hits, re-measured on the file
    stops = [(h['t0'] - 0.003, h['t1'] + 0.003) for h in qa.get('hard_stops', []) or []]
    tol = float(c.get('hit_tol_ms', 10.0) or 10.0)
    if ref is not None and c.get('markers'):
        times = sorted({round(m['sec'], 4) for m in c['markers'] if not any(abs(m['sec'] - a) < 0.005 for a, _ in stops)})
        h = EA.hits(ref, times) if times else []
        out['hits'] = dict(n=len(h), within_tol=sum(1 for q in h if q['offset_ms'] is not None and abs(q['offset_ms']) <= tol),
                           off=[q for q in h if q['offset_ms'] is None or abs(q['offset_ms']) > tol], tol_ms=tol)
    # silence windows and hard stops on both masters
    sil = []
    for w in (qa.get('silence', []) or []) + (qa.get('hard_stops', []) or []):
        row = dict(t0=w['t0'], t1=w['t1'], label=w.get('label', '')[:60], limit=w.get('limit', -70.0))
        for role, x in masters.items():
            if role == 'album' and edit_album:
                continue
            a, b = int(w['t0'] * SR), int(w['t1'] * SR)
            seg = x[:, a:b]
            row[role] = round(20 * np.log10(np.abs(seg).max() + 1e-12), 1) if seg.size else None
        row['ok'] = all(v is None or v <= row['limit'] for k, v in row.items() if k in masters)
        sil.append(row)
    out['silence'] = dict(n=len(sil), ok=all(s['ok'] for s in sil), bad=[s for s in sil if not s['ok']])
    # V.O. windows
    if ref is not None and c.get('vo_windows'):
        vo = []
        for w in c['vo_windows']:
            seg = ref[:, int(w['t0'] * SR):int(w['t1'] * SR)]
            v = lufs_i(seg)
            vo.append(dict(t0=w['t0'], t1=w['t1'], lufs=v, ok=v is not None and abs(v + 24.0) <= 2.0))
        out['vo_windows'] = vo
    # MIDI + the rule checks
    notes = None
    if F.get('midi') and os.path.exists(path(F['midi'])):
        mp = path(F['midi'])
        loop = None
        if c.get('loop') and (c.get('timing') or {}).get('album_loops', 1) == 1:
            loop = (c['loop']['start']['sec'], c['loop']['end']['sec'])
        out['midi'], notes = midi_checks(mp, loop)
        wav_t = max(r.get('mtime', 0) for r in (out.get('album', {}), out.get('underscore', {})) if isinstance(r, dict))
        out['midi']['fresh'] = abs(os.path.getmtime(mp) - wav_t) < 900
    fams = {k: types.SimpleNamespace(stem=v.get('family'), pedal=None) for k, v in (c.get('instrumentation') or {}).items()}
    if notes is not None and stems:
        pstems = {k: v for k, v in stems.items() if k not in ('drums', 'fx')}
        pitched = sum(pstems.values())
        fm = EA.f_major_check(pitched, notes, None, stems=pstems, tracks=fams, mutes=stops)
        out['f_major'] = dict(ok=fm['ok'], ok_written=fm['ok_written'], ok_spectral=fm['ok_spectral'],
                              windows=fm['windows'], worst_sieved=fm['worst_sieved'], a_classes=fm['a_classes'],
                              fails=[dict(t0=w['t0'], t1=w['t1'], a_f=w['a_over_f_sieved'], cls=w.get('a_class'),
                                          a_from=w.get('a_from'),
                                          peaks=[f"{q['stem']} {q['hz']} Hz {q['cls']}" for q in w.get('a_peaks', [])])
                                     for w in fm['fails']][:10],
                              fixed_resonances=[f"{r['stem']} ~{r['hz']} Hz x{r['windows']}" for r in fm['fixed_resonances']])
        del pitched
    # sub under the room SFX
    rw = [(w['t0'], w['t1'], w['sfx']) for w in (c.get('room_sfx_windows') or [])]
    if rw and under is not None:
        drop = next((w['sub_db_without']['stems'] for w in qa.get('sub_under_room', []) or [] if w.get('sub_db_without')), None)
        su = EA.sub_under_room(under, rw, stems=stems or None, notes=notes, drop=drop)
        out['sub_under_room'] = dict(n=len(su), ok=all(w['ok'] for w in su),
                                     worst_db=max((w.get('sub_db_without', {}).get('sub_db', w['sub_db']) if drop else w['sub_db'])
                                                  for w in su if w['sub_db'] is not None) if any(w['sub_db'] is not None for w in su) else None,
                                     bad=[w for w in su if not w['ok']])
    # the engine's own numbers, for comparison
    efm = qa.get('f_major') or {}
    out['engine'] = dict(balance=(qa.get('balance') or {}).get('balance'),
                         balance_energy=(qa.get('balance') or {}).get('balance_energy'),
                         st=qa.get('short_term_underscore'), band_2_6k_db=qa.get('band_2_6k_db'),
                         f_major_ok=efm.get('ok'), f_major_worst_sieved=efm.get('worst_sieved'),
                         f_major_classes=efm.get('a_classes'),
                         written_third=(efm.get('written_third') or {}).get('count'),
                         knee_completion=(qa.get('knee_completion') or {}).get('count'),
                         knee_whole=c.get('knee_whole'), warnings=c.get('warnings', []),
                         banned=qa.get('banned'), editor=c.get('editor'),
                         instruments=sorted((c.get('instrumentation') or {}).keys()))
    for r in (out.get('album', {}), out.get('underscore', {})):
        if isinstance(r, dict):
            r.pop('mtime', None)
    return out


def verdict(r):
    """The editor's flags for one cue (empty = clean)."""
    fl = []
    for role, lim_st in (('album', None), ('underscore', None)):
        m = r.get(role, {})
        if m.get('missing'):
            continue
        if m.get('target_lufs') is not None and m.get('lufs') is not None and abs(m['lufs'] - m['target_lufs']) > 0.5:
            fl.append(f"{role} {m['lufs']} LUFS vs {m['target_lufs']}")
        if m.get('ceiling_dbtp') is not None and m.get('tp_db') is not None and m['tp_db'] > m['ceiling_dbtp'] + 0.05:
            fl.append(f"{role} TP {m['tp_db']} > {m['ceiling_dbtp']}")
        if m.get('clipped'):
            fl.append(f"{role} {m['clipped']} clipped samples")
        if not m.get('mp3', {}).get('ok', True):
            fl.append(f"{role} MP3 {m['mp3']}")
    u = r.get('underscore', {})
    if not u.get('missing') and u.get('st_p95') is not None and u.get('target_lufs') is not None:
        lim = -13.0 if u['target_lufs'] >= -17 else -17.0
        if u['st_p95'] > lim:
            fl.append(f"underscore ST p95 {u['st_p95']} > {lim}")
    s = r.get('stems', {})
    if s.get('families') and (s.get('residual_db_re_master', 0) > -90 or not s.get('lengths_match')):
        fl.append(f"stems residual {s.get('residual_db_re_master')} dB, lengths {s.get('lengths_match')}")
    for l in r.get('loops', []):
        if l['verdict'] != 'seamless' or not l['frame_aligned']:
            fl.append(f"loop {os.path.basename(l['file'])} {l['verdict']} aligned={l['frame_aligned']}")
    if r.get('hits', {}).get('off'):
        fl.append('hits off: ' + ', '.join(f"{q['t']} s {q['offset_ms']} ms" for q in r['hits']['off']))
    if not r.get('silence', {}).get('ok', True):
        fl.append(f"silence windows over their limit: {r['silence']['bad'][:2]}")
    for w in r.get('vo_windows', []):
        if not w['ok']:
            fl.append(f"V.O. window {w['t0']}-{w['t1']} s {w['lufs']} LUFS")
    m = r.get('midi', {})
    if m.get('knee_whole'):
        fl.append(f"whole knee {m['knee_whole']}")
    if m.get('knee_completion'):
        fl.append(f"knee completes x{m['knee_completion']}: {m['knee_completion_hits'][:2]}")
    if m.get('written_third'):
        fl.append(f"written A over F bass x{m['written_third']}: {m['written_third_events'][:2]}")
    if m and not m.get('fresh', True):
        fl.append('MIDI older/newer than the WAVs by > 15 min (stale?)')
    e = r.get('engine', {})
    if e.get('f_major_ok') is False:
        fl.append(f"F-major (engine, full note data) worst sieved A/F {e['f_major_worst_sieved']}, "
                  f"classes {e['f_major_classes']}")
    if e.get('written_third'):
        fl.append(f"written third (engine, pedal included) x{e['written_third']}")
    if e.get('knee_completion'):
        fl.append(f"knee completion (engine) x{e['knee_completion']}")
    if r.get('sub_under_room') and not r['sub_under_room']['ok']:
        fl.append(f"sub under room SFX {r['sub_under_room']['bad'][:2]}")
    return fl


def crosscheck(r):
    """Where the file-based re-run (MIDI: no pedal, gate lengths only) disagrees with the engine's full-data
    F-major check: listed for the editor to inspect by hand, not a fail on its own."""
    fm, e = r.get('f_major'), r.get('engine', {})
    if not fm or fm['ok'] or e.get('f_major_ok') is False:
        return []
    return [f"file re-run: {w['t0']}-{w['t1']} s A/F {w['a_f']} {w['cls']} {w['peaks'][:3]}" for w in fm['fails']]


def _loop_one(p):
    return loop_check(p, p.replace('.wav', '-tail.wav'))


def all_loops(nw=4):
    """Every loop file on disk (cue loops, level loops, variant and parts loops), not only the cue sheets' own:
    editor/qa-loops.json."""
    ps = sorted(q for q in glob.glob(os.path.join(OST, 'tracks', '[!_]*', 'render', '**', '*loop*.wav'), recursive=True)
                if not q.endswith('-tail.wav') and '/_pre-' not in q)
    with ProcessPoolExecutor(nw) as ex:
        res = list(ex.map(_loop_one, ps))
    with open(os.path.join(HERE, 'qa-loops.json'), 'w') as fh:
        json.dump(res, fh, indent=1, default=float)
    bad = [r for r in res if r['verdict'] != 'seamless' or not r['frame_aligned']]
    print(f'loops: {len(res)} files, {len(res) - len(bad)} seamless and frame-aligned', flush=True)
    for r in bad:
        print('      !', r['file'], r['verdict'], r['frame_aligned'])
    return res


def main():
    pats = sys.argv[1:]
    if pats == ['--loops']:
        all_loops(int(os.environ.get('QA_WORKERS', '4')))
        return
    cues = sorted(glob.glob(os.path.join(OST, 'tracks', '[!_]*', 'render', '*.cue.json')) +
                  glob.glob(os.path.join(OST, 'tracks', '[!_]*', 'render', '[!_]*', '*.cue.json')))
    if pats:
        cues = [p for p in cues if any(k in p for k in pats)]
    nw = int(os.environ.get('QA_WORKERS', '4'))
    with ProcessPoolExecutor(nw) as ex:
        res = list(ex.map(qa_cue, cues))
    for r in res:
        r['editor_flags'] = verdict(r)
        r['crosscheck'] = crosscheck(r)
        a, u = r.get('album', {}), r.get('underscore', {})
        m = r.get('midi', {})
        print(f"{r['id']:<44} A {a.get('lufs')!s:>7} tp {a.get('tp_db')!s:>6} | U {u.get('lufs')!s:>7} tp "
              f"{u.get('tp_db')!s:>6} p95 {u.get('st_p95')!s:>6} | stems {r.get('stems', {}).get('residual_db_re_master')} "
              f"| loops {[l['verdict'] for l in r['loops']]} | knee {len(m.get('knee_whole', []))}/{m.get('knee_completion')} "
              f"| 3rd {m.get('written_third')} | Fmaj {(r.get('f_major') or {}).get('worst_sieved')} "
              f"| flags {len(r['editor_flags'])}", flush=True)
        for f in r['editor_flags']:
            print('      !', f[:220])
        for f in r['crosscheck']:
            print('      ?', f[:220])
    out = os.path.join(HERE, 'qa.json' if not pats else 'qa-partial.json')
    with open(out, 'w') as fh:
        json.dump(res, fh, indent=1, default=float)
    print('->', out, f'({len(res)} cue sheets)')
    if not pats:
        all_loops(nw)


if __name__ == '__main__':
    main()
