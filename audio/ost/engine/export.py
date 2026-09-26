"""Masters, stems, loops, previews, MIDI and the cue sheet for one OST track.

build(sc, out_dir, track_id) renders and writes (all 48 kHz):

  <id>-album.wav / .mp3          album master      (default -14 LUFS-I, -1 dBTP, glue comp 1.8:1)
  <id>-underscore.wav / .mp3     underscore master (default -20 LUFS-I, -3 dBTP, light comp, a -2 dB
                                 dialog pocket at 2.5 kHz) -- the level editors cut under dialog
  stems/<id>-<family>.flac       the ten families (silent ones skipped), post underscore master:
                                 they SUM to <id>-underscore.wav (residual reported in the cue sheet)
  <id>-loop.wav                  (if Score.loop) the seamless loop body at the underscore level:
                                 exactly loop-length samples, tail folded in, periodic master gain
  <id>-loop-tail.wav             what rings on after the last pass (butt it to the end of any pass)
  <id>-loop-x3-preview.mp3       loop x3 + tail, for auditioning the seam (MP3 itself never loops)
  <id>.mid                       the score as written, with the tempo map, meters and markers
  <id>-pianoroll.png             notes by family, bars, loop, markers, loudness curve
  <id>.cue.json                  the cue sheet (timing, sync points, loop, files, loudness, QC, credits)

WAV masters are 24-bit PCM; stems FLAC 24-bit (lossless, ~30 % of WAV in practice: the disk is tight).
A full build is ~1.5 MB per second of music (~280 MB per 3 min); draft with stems=False, loop=False.
"""
from __future__ import annotations

import datetime
import json
import os
import subprocess
import time

import numpy as np
import soundfile as sf

from .core import SR, FPS, FAMILIES, s2n, db, todb, peq, to_stereo
from .mix import comp_gain, limiter_gain, lufs, true_peak, master_gain_periodic
from .render import render_score, render_loop, expand_loops, mute_gain
from . import analysis
from .motifs import find_motif, knee_whole_count, MOTIFS

ENGINE_VERSION = 'mrmas-ost-engine 1.1 (2026-09-26: fix1 -- meter axis, sample tuning, render pool, QA 5a-d)'
FFDIR = '/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu'
FFMPEG = f'{FFDIR}/ffmpeg'

MASTERS = {
    'album': dict(target=-14.0, ceiling=-1.0, comp=dict(thresh_db=-20, ratio=1.8), pocket=None),
    'underscore': dict(target=-20.0, ceiling=-3.0, comp=dict(thresh_db=-28, ratio=1.3, att_ms=40.0, rel_ms=350.0),
                       pocket=dict(f=2500.0, db=-2.0, q=0.7)),
}


# ------------------------------------------------------------------ audio file helpers
def mp3(wav_path, mp3_path, kbps=192):
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a',
                    f'{kbps}k', mp3_path], check=True, env=env)


def write_audio(path, x, subtype='PCM_24'):
    x = to_stereo(x)
    fmt = 'FLAC' if path.endswith('.flac') else 'WAV'
    sf.write(path, np.ascontiguousarray(x.T), SR, subtype=subtype, format=fmt)


def mp3_from_array(x, mp3_path, tmp_dir, kbps=192):
    tmp = os.path.join(tmp_dir, f'_tmp_{os.getpid()}.wav')
    write_audio(tmp, x)
    try:
        mp3(tmp, mp3_path, kbps)
    finally:
        os.remove(tmp)


# ------------------------------------------------------------------ mastering
def master_chain(mix, target=-14.0, ceiling=-1.0, comp=None, iters=5):
    """Glue comp x make-up x true-peak limiter as ONE gain curve (applied identically to every stem so
    the stems sum to the master).  Returns (gain_curve, makeup_linear)."""
    g_comp = comp_gain(mix, **comp) if comp else np.ones(mix.shape[1], dtype=np.float32)
    y0 = mix * g_comp[None]
    L0 = lufs(y0)
    if not np.isfinite(L0):
        return np.ones(mix.shape[1], dtype=np.float32), 1.0
    mk = db(target - L0)
    g_lim = np.ones(mix.shape[1], dtype=np.float32)
    for _ in range(iters):
        y1 = y0 * mk
        g_lim = limiter_gain(y1, ceiling - 0.15)
        L = lufs(y1 * g_lim[None])
        err = target - L
        if abs(err) < 0.05:
            break
        mk *= db(err)
    g = (g_comp * mk * g_lim).astype(np.float32)
    tp = true_peak(mix * g[None])
    if tp > db(ceiling):
        g *= db(ceiling) / tp * 0.995
    return g, float(mk)


def pocket(x, spec):
    if not spec:
        return x
    return peq(x, spec['f'], spec['db'], spec.get('q', 0.7)).astype(np.float32)


def trim_len(mix, min_n, floor_db=-66.0, pad_s=0.3):
    a = np.abs(to_stereo(mix)).max(0)
    pk = a.max() + 1e-12
    idx = np.nonzero(a > pk * db(floor_db))[0]
    last = int(idx[-1]) if len(idx) else min_n
    return int(min(len(a), max(min_n, last + s2n(pad_s))))


def end_fade(x, ms=30.0):
    k = min(x.shape[1], int(ms / 1000 * SR))
    x = x.copy()
    x[:, -k:] *= np.linspace(1, 0, k, dtype=np.float32)[None] ** 2
    return x


# ------------------------------------------------------------------ MIDI (tempo map, meters, markers)
GM = dict(felt=0, upright=0, grand=0, rhodes=4, snes_piano=0, vln1=48, vln2=48, vla=48, vc=48, cb=48, svln=40,
          harp=46, vln_trem=44, vla_trem=44, vc_trem=44, vln_pizz=45, vla_pizz=45, vc_pizz=45, fl=73, cl=71, bsn=70,
          tsax=66, tsax_stac=66, asax=65, bsax=67, reed=20, tpt=56, hn=60, tbn=57, tuba=58, harmon=59, tpt_stac=56,
          tbn_stac=57, tuba_stac=58, hn_stac=60, ubass=32, cb_pizz=32, sub=38, timp=47, glock=9, celesta=8,
          vibes=11, marimba=12, xylo=13, chimes=14, lead=80, lead2=80, arp=80, tri=81, beeper=80, sqbass=80,
          drone=89, pad=89, gupad=89, glasspad=92, tex=95, glyph=99, shimmer=98, riser=97)
DRUM_TRACKS = {'brush', 'jazz', 'kit808', 'snes_kit'}
DRUM_MAP = {'k808': 36, 'sn808': 38, 'clap808': 39, 'h808': 42, 'rim808': 37, 'swish': 40, 'snare': 38, 'hat': 42,
            'bdrum': 36, 'crash': 49, 'suscym': 51, 'cym_swell': 52, 'gong': 52, 'snare_taps': 38, 'claves': 75,
            'woodclick': 76, 'cabasa': 69, 'rimshot': 37, 'bdrum_muted': 35, 'chipkick': 36, 'noise': 42,
            'noisesweep': 55, 'impact': 57, 'revswell': 57, 'room': 0, 'felt_mech': 0}


def write_midi(sc, path, ppq=960):
    import mido
    g = sc.grid
    mid = mido.MidiFile(ticks_per_beat=ppq)
    q0 = g.q_origin

    def tick(sec):
        return max(0, int(round((g.qt(sec) - q0) * ppq)))

    meta = mido.MidiTrack()
    mid.tracks.append(meta)
    ev = [(0, mido.MetaMessage('track_name', name=sc.name, time=0))]
    # tempo: exact steps, ramps sampled every sixteenth (tempo = quarter-note tempo for MIDI)
    qs = sorted(set(g._tq))
    q_end = g.qt(sc.end_s + sc.tail_s)
    q = q0
    last = None
    while q <= q_end + 1e-9:
        nxt = [p for p in qs if p > q + 1e-9]
        q2 = min(q + 0.25, nxt[0]) if nxt else q + 0.25
        # the step's exact average quarter-note tempo -> every step boundary lands on the grid's seconds
        bpm = 60.0 * (q2 - q) / max(g.tq(q2) - g.tq(q), 1e-9)
        if last is None or abs(bpm - last) > 1e-4:
            ev.append((int(round((q - q0) * ppq)), mido.MetaMessage('set_tempo', tempo=int(round(60e6 / bpm)), time=0)))
            last = bpm
        q = q2
    # meters (a pickup gets its own short bar)
    n1, d1 = g.meter_of(1)
    if g.pickup:
        ev.append((0, mido.MetaMessage('time_signature', numerator=max(1, int(round(g.pickup))), denominator=d1, time=0)))
    for b, (n, d) in zip(g._mbars, g._meters):
        ev.append((int(round((g.bar_q(b) - q0) * ppq)), mido.MetaMessage('time_signature', numerator=n, denominator=d,
                                                                           time=0)))
    for t, lab in sc.markers:
        ev.append((tick(t), mido.MetaMessage('marker', text=str(lab), time=0)))
    for lab, a, _ in sc.sections:
        ev.append((tick(a), mido.MetaMessage('marker', text=f'[{lab}]', time=0)))
    if sc.loop:
        ev.append((tick(sc.loop[0]), mido.MetaMessage('marker', text='LOOP START', time=0)))
        ev.append((tick(sc.loop[1]), mido.MetaMessage('marker', text='LOOP END', time=0)))
    ev.sort(key=lambda e: e[0])
    now = 0
    for t, m in ev:
        m.time = t - now
        now = t
        meta.append(m)
    by = {}
    for n in sc.notes:
        by.setdefault(n.inst, []).append(n)
    ch_i = 0
    for inst, ns in by.items():
        tr = mido.MidiTrack()
        mid.tracks.append(tr)
        drum = inst in DRUM_TRACKS or inst in DRUM_MAP
        if drum:
            ch = 9
        else:
            ch = ch_i % 15
            ch = ch + 1 if ch >= 9 else ch
            ch_i += 1
        tr.append(mido.MetaMessage('track_name', name=inst, time=0))
        if not drum:
            tr.append(mido.Message('program_change', program=GM.get(inst, 0), channel=ch, time=0))
        evs = []
        for n in ns:
            p = DRUM_MAP.get(inst, int(round(n.pitch))) if inst in DRUM_MAP else int(round(n.pitch))
            if inst == 'h808' and n.x.get('open'):
                p = 46
            p = int(np.clip(p, 0, 127))
            v = int(np.clip(round(n.vel * 127), 1, 127))
            a, e = tick(n.start), tick(n.start + max(n.dur, 0.03))
            evs.append((a, 1, p, v))
            evs.append((max(e, a + 1), 0, p, 0))
        evs.sort(key=lambda e: (e[0], e[1]))
        now = 0
        for t, on, p, v in evs:
            tr.append(mido.Message('note_on' if on else 'note_off', note=p, velocity=v, channel=ch, time=t - now))
            now = t
    mid.save(path)


# ------------------------------------------------------------------ the build
def _pos(g, t):
    b, bt = g.pos(t)
    return dict(sec=round(t, 6), frame=round(t * FPS, 3), bar=b, beat=round(bt, 4))


def _window(g, w, label='', lim=-70.0):
    """(t0, t1[, label[, max_dbfs]]) with positions as seconds / (bar, beat) / 'f123', or a dict."""
    if isinstance(w, dict):
        return (g.at(w['t0']), g.at(w['t1']), w.get('label', label), w.get('max_dbfs', lim))
    return (g.at(w[0]), g.at(w[1]), w[2] if len(w) > 2 else label, w[3] if len(w) > 3 else lim)


def verify_loop(sc, workers=None):
    """s6.9 item 8: the loop file (+ its tail) reproduces the linear render.  Renders the body twice with
    identical draws (track and stem inserts removed: time-variant inserts such as Era or futz are not periodic
    by nature; the seam check still covers them) and compares pass 2 with the folded loop.  Returns the
    residual (dB rel. the loop) per family."""
    from dataclasses import replace
    from .render import render_loop as _rl
    tr0 = {k: replace(t, post=None) for k, t in sc.tracks.items()}      # inserts off: Era / futz are time-variant
    s0 = replace(sc, stem_post={}, tracks=tr0, meta={k: v for k, v in sc.meta.items() if k != '_passes'})
    loops, _, info = _rl(s0, workers=workers, verbose=False)
    s2 = expand_loops(s0, 2, vary=False)
    lin = render_score(s2, workers=workers, verbose=False)
    L0n, P = s2n(sc.loop[0]), info['samples']
    out = {}
    tot_l, tot_e = 0.0, 0.0
    for fam, lp_ in loops.items():
        e = lin[fam][:, L0n + P:L0n + 2 * P] - lp_
        pl, pe = float(np.mean(lp_.astype(np.float64) ** 2)), float(np.mean(e.astype(np.float64) ** 2))
        tot_l += pl
        tot_e += pe
        if pl > 1e-14:
            out[fam] = round(10 * np.log10(pe / pl + 1e-30), 1)
    return dict(total_db=round(10 * np.log10(tot_e / max(tot_l, 1e-30) + 1e-30), 1), per_family=out,
                note='pass 2 of the body played twice (identical draws) vs the folded loop; ~-70 dB = the outro\'s '
                     'humanised lead-in reaching back into pass 2 (not a loop error); intro tails reaching pass 2 '
                     'would also raise it')


def build(sc, out_dir, track_id=None, stems=True, loop=True, previews=True, loop_stems=False, workers=None,
          verbose=True, stem_format='flac', check_loop=False):
    t_start = time.time()
    tid = track_id or sc.name
    os.makedirs(out_dir, exist_ok=True)
    stem_dir = os.path.join(out_dir, 'stems')
    meta = dict(sc.meta)
    g = sc.grid
    M = {k: dict(v) for k, v in MASTERS.items()}
    for k, v in (sc.master or {}).items():
        M[k].update(v)
    if 'album_lufs' in meta:
        M['album']['target'] = float(meta['album_lufs'])
    if 'underscore_lufs' in meta:
        M['underscore']['target'] = float(meta['underscore_lufs'])
    files, warnings = {}, []
    rel = lambda p: os.path.relpath(p, os.path.dirname(out_dir.rstrip('/')))   # noqa: E731
    # ---------------------------------------------------------- the linear cue (album form)
    loops_n = int(meta.get('album_loops', 1))
    sa = expand_loops(sc, loops_n) if (sc.loop and loops_n > 1) else sc
    if verbose:
        print(f'[{tid}] full render: {len(sa.notes)} notes, {sa.end_s:.2f} s + tail', flush=True)
    groups = {}
    raw = render_score(sa, workers=workers, verbose=verbose, balance_out=groups)
    mix_raw = sum(raw.values())
    n = trim_len(mix_raw, s2n(sa.end_s))
    raw = {k: end_fade(v[:, :n]) for k, v in raw.items()}
    groups = {k: v[:, :n] for k, v in groups.items()}
    gate = mute_gain(sa, n)                      # hard stops: re-applied after every EQ / master stage
    # ---------------------------------------------------------- album master
    mix_a = sum(raw.values())
    g_a, mk_a = master_chain(mix_a, M['album']['target'], M['album']['ceiling'], M['album']['comp'])
    if gate is not None:
        g_a = g_a * gate
    album = (mix_a * g_a[None]).astype(np.float32)
    p = os.path.join(out_dir, f'{tid}-album.wav')
    write_audio(p, album)
    files['album_wav'] = rel(p)
    if previews:
        mp3(p, p.replace('.wav', '.mp3'))
        files['album_mp3'] = rel(p.replace('.wav', '.mp3'))
    # ---------------------------------------------------------- underscore master + stems
    pk = M['underscore']['pocket']
    su = {k: pocket(v, pk) for k, v in raw.items()}
    mix_u = sum(su.values())
    g_u, mk_u = master_chain(mix_u, M['underscore']['target'], M['underscore']['ceiling'], M['underscore']['comp'])
    if gate is not None:
        g_u = g_u * gate                          # the pocket EQ rang into the stop: gate it to digital zero
    under = (mix_u * g_u[None]).astype(np.float32)
    p = os.path.join(out_dir, f'{tid}-underscore.wav')
    write_audio(p, under)
    files['underscore_wav'] = rel(p)
    if previews:
        mp3(p, p.replace('.wav', '.mp3'))
        files['underscore_mp3'] = rel(p.replace('.wav', '.mp3'))
    stems_u = {k: (v * g_u[None]).astype(np.float32) for k, v in su.items()}
    files['stems'] = {}
    if stems:
        os.makedirs(stem_dir, exist_ok=True)
        for old in os.listdir(stem_dir):
            if old.startswith(f'{tid}-'):
                os.remove(os.path.join(stem_dir, old))
        for fam, x in stems_u.items():
            if np.abs(x).max() < 1e-6:
                continue
            sp = os.path.join(stem_dir, f'{tid}-{fam}.{stem_format}')
            write_audio(sp, x)
            files['stems'][fam] = rel(sp)
    resid = analysis.stems_residual(stems_u, under)
    del raw, su
    # ---------------------------------------------------------- loop
    loop_info = None
    if sc.loop and loop:
        if verbose:
            print(f'[{tid}] loop render', flush=True)
        loops, rings, info = render_loop(sc, workers=workers, verbose=verbose)
        lu = {k: pocket(v, pk) for k, v in loops.items()} if not pk else None
        # the pocket EQ is linear: apply it circularly (tile x3, keep the middle) so the wrap stays exact
        if pk:
            lu = {}
            for k, v in loops.items():
                t3 = pocket(np.concatenate([v, v, v], 1), pk)
                lu[k] = t3[:, v.shape[1]:2 * v.shape[1]]
        ru = {k: pocket(v, pk) for k, v in rings.items()}
        mix_l = sum(lu.values())
        g_l = master_gain_periodic(mix_l, mk_u, M['underscore']['ceiling'], M['underscore']['comp'])
        from .render import mute_gain as _mg
        L0_, L1_ = sc.loop
        gl = _mg(sc, g_l.shape[0] + s2n(L0_))
        if gl is not None:
            g_l = g_l * gl[s2n(L0_):s2n(L0_) + g_l.shape[0]]
        loop_m = (mix_l * g_l[None]).astype(np.float32)
        ring_m = (sum(ru.values()) * g_l[0]).astype(np.float32)
        nr = trim_len(np.concatenate([loop_m[:, -1:], ring_m], 1), 1, floor_db=-60) if ring_m.shape[1] > 1 else 1
        ring_m = end_fade(ring_m[:, :nr], 50)
        p = os.path.join(out_dir, f'{tid}-loop.wav')
        write_audio(p, loop_m)
        files['loop_wav'] = rel(p)
        p2 = os.path.join(out_dir, f'{tid}-loop-tail.wav')
        write_audio(p2, ring_m)
        files['loop_tail_wav'] = rel(p2)
        if previews:
            pv = np.concatenate([loop_m, loop_m, loop_m, ring_m], 1)
            p3 = os.path.join(out_dir, f'{tid}-loop-x3-preview.mp3')
            mp3_from_array(pv, p3, out_dir)
            files['loop_preview_mp3'] = rel(p3)
        if loop_stems:
            files['loop_stems'] = {}
            for fam, x in lu.items():
                if np.abs(x).max() < 1e-6:
                    continue
                sp = os.path.join(stem_dir, f'{tid}-loop-{fam}.{stem_format}')
                write_audio(sp, x * g_l[None])
                files['loop_stems'][fam] = rel(sp)
        seam = analysis.loop_seam(loop_m)
        L0, L1 = sc.loop
        loop_info = dict(start=_pos(g, L0), end=_pos(g, L1), samples=info['samples'], seconds=round(info['seconds'], 6),
                         frames=round(info['frames'], 3), frame_aligned=info['frame_aligned'], notes=info['notes'],
                         tail_seconds=round(ring_m.shape[1] / SR, 3), seam=seam,
                         loudness=analysis.loudness(np.concatenate([loop_m] * 2, 1)))
        if not info['frame_aligned']:
            warnings.append(f"loop length {info['frames']:.3f} frames is not a whole number of 24 fps frames "
                            f"(grid.frame_lock_bpm() gives the nearest tempo that is)")
        if seam['verdict'] != 'seamless':
            warnings.append(f'loop seam needs a listen: {seam}')
    # ---------------------------------------------------------- MIDI + piano roll
    p = os.path.join(out_dir, f'{tid}.mid')
    write_midi(sc, p)
    files['midi'] = rel(p)
    p = os.path.join(out_dir, f'{tid}-pianoroll.png')
    sil_w = [_window(g, w, 'silence', -70.0) for w in meta.get('silence_windows', [])]
    fz = sa.mute_fade_ms / 1000.0
    sil_w += [(a + fz, b - fz, 'D6 / hard stop', -90.0) for a, b in sa.mutes if b - a > 2 * fz]
    analysis.piano_roll(sa.notes, g, p, tracks=sc.tracks, title=f"{meta.get('title', tid)} ({tid})",
                        loop=sa.loop, markers=sa.markers, sections=sa.sections, level=under, length_s=n / SR,
                        shade=[(a, b_, lab) for a, b_, lab, _ in sil_w])
    files['pianoroll'] = rel(p)
    # ---------------------------------------------------------- QC (OST-BIBLE s6.9)
    tol = float(meta.get('hit_tol_ms', 10.0))
    stops = [a for a, _ in sa.mutes]
    hit_times = sorted({round(t, 4) for t, _ in sa.markers if not any(abs(t - a) < 0.005 for a in stops)})
    hitqc = analysis.hits(under, hit_times) if hit_times else []
    for h in hitqc:
        if h['offset_ms'] is None or abs(h['offset_ms']) > tol:
            warnings.append(f"marker at {h['t']} s: no clear onset within {tol:g} ms ({h})")
    qa = {}
    secs = sa.sections or [(f'bars {b}-{min(b + 3, g.bars or b)}', g.t(b), min(g.t(b + 4), n / SR))
                           for b in range(1, (g.bars or 1) + 1, 4)]
    if not g.bars and not sa.sections:
        secs = [(f'{a:.0f}s', a, min(a + 10.0, n / SR)) for a in np.arange(0, n / SR, 10.0)]
    qa['balance'] = analysis.balance(groups, secs)
    qa['short_term_underscore'] = analysis.short_term_stats(under)
    qa['band_2_6k_db'] = analysis.band_ratio_db(under)
    qa['centroid_hz'] = analysis.bands(under)['centroid_hz']
    # chroma checks listen to the PITCHED families only (brush / cymbal noise smears every pitch class)
    pstems = {k: v for k, v in stems_u.items() if k not in ('drums', 'fx')}
    pitched = sum(pstems.values())
    # (5a + 5b) rule 12: the written third from the notes at every boundary; the spectral A/F traced to its stem
    qa['f_major'] = analysis.f_major_check(pitched, sa.notes, g, stems=pstems, tracks=sc.tracks, mutes=sa.mutes)
    fm = qa['f_major']
    if not fm['ok_written']:
        ev = fm['written_third']['events']
        warnings.append(f"WRITTEN A-natural over an F bass (rule 12) in {fm['written_third']['count']} place(s): "
                        + '; '.join(f"{e['t0']}-{e['t1']} s {', '.join(e['a'])} over {', '.join(e['f_bass'])}"
                                    for e in ev[:4]))
    if not fm['ok_spectral']:
        bad = [w for w in fm['fails'] if not w.get('ok_spectral', True)]
        res = [w for w in bad if w.get('a_class') == 'resonance']
        other = [w for w in bad if w.get('a_class') != 'resonance']
        if res:
            where = sorted({f"{q['stem']} ~{q['hz']:g} Hz" for w in res for q in w['a_peaks'] if q['cls'] == 'resonance'})
            fixed = '; '.join(f"{r['stem']} ~{r['hz']:g} Hz x{r['windows']}" for r in fm['fixed_resonances'])
            warnings.append(f"F-major check (spectral): {len(res)} F-bass window(s) carry A energy that NO written note "
                            f"explains (a resonance, not a written third), first at {res[0]['t0']} s, worst sieved A/F "
                            f"{max(w['a_over_f_sieved'] for w in res)}: {', '.join(where[:6])}"
                            + (f"; FIXED (same peak under different notes): {fixed}" if fixed else '')
                            + ' -- audition: does it sound major?')
        if other:
            warnings.append(f"F-major check (spectral): sieved A/F >= {fm['limit']} in {len(other)} window(s) "
                            f"({', '.join(sorted({w.get('a_class', '?') for w in other}))}), first at {other[0]['t0']} s")
    # (5c) rule 4: the knee completed by pitch class in any register, across phrase boundaries (and the loop seam)
    kc = analysis.knee_completion(sa.notes)
    if sc.loop and loops_n == 1:
        s2 = expand_loops(sc, 2, vary=False)
        L1 = sc.loop[1]
        seam = [h for h in analysis.knee_completion(s2.notes)['hits'] if h['t0'] < L1 <= h['t1']]
        for h in seam:
            h['across_loop_seam'] = True
        kc['hits'] += seam
        kc['count'] += len(seam)
    qa['knee_completion'] = kc
    if kc['count'] and not meta.get('knee_whole_ok'):
        warnings.append(f"the knee COMPLETES by pitch class {kc['count']} time(s) (rule 4; any register, across a "
                        f"phrase): " + '; '.join(f"{h['inst']} {h['t0']}-{h['t1']} s {' '.join(h['notes'])}"
                                                 f"{' (loop seam)' if h.get('across_loop_seam') else ''}"
                                                 for h in kc['hits'][:3]))
    # (5d) s6.5: the sub under the room SFX
    rw = analysis.room_sfx_windows(meta, g, n / SR)
    qa['sub_under_room'] = analysis.sub_under_room(under, rw, stems=stems_u, notes=sa.notes,
                                                   drop=meta.get('room_sfx_drop_stems')) if rw else []
    for w in qa['sub_under_room']:
        if not w['ok']:
            warnings.append(f"sub under {w['sfx']} {w['t0']}-{w['t1']} s: < 60 Hz reads {w['sub_db']} dB of the total "
                            f"(limit {w['limit_db']}; from {w.get('sub_from')})")
    feat = M['underscore']['target'] >= -17.0
    p95 = qa['short_term_underscore']['p95']
    if p95 is not None and p95 > (-13.0 if feat else -17.0):
        warnings.append(f"underscore short-term p95 {p95} LUFS > {'-13 (featured)' if feat else '-17 (underscore)'} "
                        f"(s6.5): the loudest moments sit high above the bed")
    if qa['band_2_6k_db'] > -15.0 and not feat:
        warnings.append(f"2-6 kHz band {qa['band_2_6k_db']} dB > -15 dB (s6.5: under dialogue)")
    ntw = [_window(g, w) for w in meta.get('no_third_windows', [])]
    qa['no_third'] = analysis.no_third(pitched, [(a, b) for a, b, _, _ in ntw]) if ntw else []
    for w in qa['no_third']:
        if not w['ok']:
            warnings.append(f'no-third window {w} has a third')
    qa['silence'] = analysis.silence(under, sil_w) if sil_w else []
    for w in qa['silence']:
        if not w['ok']:
            warnings.append(f"silence window {w['label']} {w['t0']}-{w['t1']} s peaks {w['peak_dbfs']} dBFS "
                            f"(limit {w['limit']})")
    qa['hard_stops'] = analysis.hard_stops(under, [(a, b - fz) for a, b in sa.mutes], sa.mute_fade_ms) if sa.mutes else []
    for w in qa['hard_stops']:
        if not w['ok']:
            warnings.append(f"hard stop at {w['t0']} s leaves a tail ({w['peak_dbfs']} dBFS)")
    vo = [_window(g, w, 'V.O.') for w in meta.get('vo_windows', [])]
    qa['vo_windows'] = [dict(t0=round(a, 3), t1=round(b, 3), lufs=round(lufs(under[:, int(a * SR):int(b * SR)]), 1),
                             target='-24 +-2') for a, b, _, _ in vo]
    qa['knee_whole'] = knee_whole_count(sc.notes)
    if qa['knee_whole'] and not meta.get('knee_whole_ok'):
        warnings.append(f"the WHOLE knee appears {qa['knee_whole']} time(s): only the main title / credits may "
                        f"(set META knee_whole_ok=True for those)")
    qa['motifs_found'] = {mid: find_motif(sc.notes, mid)[:12] for mid in meta.get('motif_ids', []) if mid in MOTIFS
                          and 'line' in MOTIFS[mid]}
    for mid, occ in qa['motifs_found'].items():
        if not occ:
            warnings.append(f'motif {mid} is listed in META motif_ids but was not found in any line')
    qa['swing'] = analysis.swing_report(sc.notes, g, sc.tracks)
    qa['banned'] = analysis.banned(sc.notes, sc.tracks, meta)
    warnings += qa['banned']
    if check_loop and sc.loop:
        qa['loop_verify'] = verify_loop(sc, workers)
        if qa['loop_verify']['total_db'] > -40:
            warnings.append(f"loop verify: pass 2 differs from the loop file by {qa['loop_verify']['total_db']} dB")
    used = {}
    for x in sc.notes:
        used.setdefault(x.inst, 0)
        used[x.inst] += 1
    inst = {k: dict(family=sc.tracks[k].stem, notes=v, source=sc.tracks[k].src[0], credit=sc.tracks[k].credit)
            for k, v in sorted(used.items())}
    credits = sorted({v['credit'] for v in inst.values() if v['credit'] and 'no samples' not in v['credit']})
    la = analysis.loudness(album)
    lu_ = analysis.loudness(under)
    for name, L, spec in [('album', la, M['album']), ('underscore', lu_, M['underscore'])]:
        if abs(L['lufs'] - spec['target']) > 0.3:
            warnings.append(f"{name} master reads {L['lufs']} LUFS (target {spec['target']})")
        if L['true_peak_db'] > spec['ceiling'] + 0.05:
            warnings.append(f"{name} master true peak {L['true_peak_db']} dBTP over the {spec['ceiling']} ceiling")
    cue = dict(
        schema='mrmas-ost-cue/1',
        id=tid, mm=meta.get('mm', ''), family=meta.get('family', ''),
        title=meta.get('title', tid), version=meta.get('version', '1'), composer=meta.get('composer', ''),
        tone=meta.get('tone', ''), tags=meta.get('tags', []), usage=meta.get('usage', 'BI'),
        scenes=meta.get('scenes', []), description=meta.get('description', ''), motifs=meta.get('motifs', []),
        key=meta.get('key', ''),
        engine=dict(version=ENGINE_VERSION, rendered=datetime.datetime.now().isoformat(timespec='seconds'),
                    render_seconds=None),
        timing=dict(**g.describe(), end=_pos(g, sc.end_s), album_duration_s=round(n / SR, 4),
                    album_duration_frames=round(n / SR * FPS, 2), album_loops=loops_n),
        sections=[dict(label=lab, start=_pos(g, a), end=_pos(g, e)) for lab, a, e in sc.sections],
        markers=[dict(label=lab, **_pos(g, t)) for t, lab in sc.markers],
        hit_check=hitqc,
        sfx_slots=meta.get('sfx_slots', []), silence_windows=[dict(t0=round(a, 4), t1=round(b, 4), label=l, max_dbfs=m)
                                                              for a, b, l, m in sil_w],
        vo_windows=qa['vo_windows'], knee_whole=qa['knee_whole'], f_major=qa['f_major'],
        knee_completion=qa['knee_completion']['count'], room_sfx_windows=[dict(t0=round(a, 3), t1=round(b, 3), sfx=l)
                                                                         for a, b, l in rw],
        qa=qa,
        loop=loop_info,
        files=files,
        masters={k: dict(target_lufs=M[k]['target'], ceiling_dbtp=M[k]['ceiling'],
                         comp=M[k]['comp'], dialog_pocket=M[k]['pocket'], measured=L)
                 for k, L in (('album', la), ('underscore', lu_))},
        stems=dict(sum_vs_underscore_residual_db=resid, families_present=sorted(files['stems']),
                   family_share_lu=analysis.family_share(stems_u)),
        spectrum=analysis.bands(under),
        bar_levels=analysis.bar_levels(under, g) if g.bars else [],
        instrumentation=inst,
        credits=credits,
        audition=meta.get('audition', []),
        warnings=warnings,
    )
    cue['engine']['render_seconds'] = round(time.time() - t_start, 1)
    p = os.path.join(out_dir, f'{tid}.cue.json')
    with open(p, 'w') as fh:
        json.dump(cue, fh, indent=1, default=float)
    if verbose:
        print(f"[{tid}] done in {cue['engine']['render_seconds']} s  album {la['lufs']} LUFS / {la['true_peak_db']} dBTP  "
              f"underscore {lu_['lufs']} LUFS / {lu_['true_peak_db']} dBTP  stems residual {resid} dB", flush=True)
        for w in warnings:
            print(f'[{tid}] WARNING {w}', flush=True)
    return cue


def render_cli(build_fn, track_file):
    """For a track.py: `python track.py [--no-stems] [--no-loop] [--no-mp3] [--verify-loop] [--workers N]`."""
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--no-stems', action='store_true')
    ap.add_argument('--no-loop', action='store_true')
    ap.add_argument('--no-mp3', action='store_true')
    ap.add_argument('--loop-stems', action='store_true')
    ap.add_argument('--workers', type=int, default=None)
    ap.add_argument('--out', default=None)
    ap.add_argument('--verify-loop', action='store_true')
    a = ap.parse_args()
    here = os.path.dirname(os.path.abspath(track_file))
    sc = build_fn()
    tid = sc.meta.get('id') or os.path.basename(here)
    return build(sc, a.out or os.path.join(here, 'render'), tid, stems=not a.no_stems, loop=not a.no_loop,
                 previews=not a.no_mp3, loop_stems=a.loop_stems, workers=a.workers, check_loop=a.verify_loop)
