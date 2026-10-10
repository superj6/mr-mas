#!/usr/bin/env python3
"""Ep2 v1: THE SOUND AUDIT, by measurement (new, the sound pass 2026-10-10; sound-v1.md is its write-up).

    audio/.venv-casting/bin/python audio/reel/ep02-v1/sound_audit.py [seg ...]      (default: all six; re-runs itself
                                                                                    through ops/heavy.sh; --no-heavy)
Reads the mix's own code (mix_episode.py, imported: premix() with its buses, line_audio(), the loudness report and each
segment's mix QA) and the stems' QA, so it hears exactly what the mix laid. Writes audio/reel/ep02-v1/mix-qa/el/
sound-audit.json and prints a summary. Nothing here is listened to; every number is measured [M].

  SFX       every sound the stems laid: its level in its OWN bands (octave-ish bands where it is within 10 dB of its
            loudest) against everything else in the mix there (dialogue + rooms + score), over its first 0.3 s (0.8 s for
            a sound longer than 2 s). best_snr = the best of those band margins. FLOOR +3 dB ('masked' under 0 dB,
            'marginal' 0 to +3). The SFX stem's other sounds in the same window count with it (they play together).
  POCKET+   every line's 1-4 kHz onset margin (its first 0.6 s from the first word) against rooms + SFX + score as laid
            (pocket.py does the score alone, as the score review asked; this adds the rest of the mix).
  VOICES    every line's level as laid (LUFS, after its match, chain, V.O. lift and the segment's master gain), per
            speaker and per scene; MARIO against the lines around him (LEARNINGS S7: within about 1 dB).
  JUMPS     every 50 ms rise over 15 dB that the mix QA could not put on a word or an SFX onset: which bus rose.
  LOCK      every lock sound accounted for: laid, swapped, claimed by the score, cut at its scene's end, missing.
"""
from __future__ import annotations

import importlib.util
import json
import os
import statistics
import sys

import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
_spec = importlib.util.spec_from_file_location('ep2mix_audit', os.path.join(HERE, 'mix_episode.py'))
M = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(M)
S = M.S
SR = S.SR
SEGS = S.SEGS
BANDS = [(60, 250), (250, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]
FLOOR_SFX = 3.0
POCKET_BAND = (1000, 4000)


def _pow_cum(x):
    """cumulative mean-square of a mono signal (for window means)"""
    return np.concatenate([[0.0], np.cumsum(np.asarray(x, 'float64') ** 2)])


def _wmean(c, a, b):
    a, b = max(0, a), min(len(c) - 1, b)
    return (c[b] - c[a]) / max(1, b - a) if b > a else 0.0


def _db(p):
    return 10 * np.log10(p) if p > 1e-20 else -200.0


FR, FR2 = 480, 96                          # 10 ms frames; 2 ms frames for a transient's peak


def band_frames(x, fr=FR):
    """per band, the mean square of each frame (mono)"""
    m = np.asarray(x, 'float64').mean(axis=1) if np.ndim(x) == 2 else np.asarray(x, 'float64')
    k = len(m) // fr
    out = []
    for lo, hi in BANDS:
        sos = signal.butter(4, [lo, min(hi, SR / 2 - 100)], 'bandpass', fs=SR, output='sos')
        y = signal.sosfilt(sos, m)[:k * fr]
        out.append((y ** 2).reshape(k, fr).mean(axis=1))
    return out


# sounds that are a texture or a place, not a beat: "audible" means present (+2 dB), not on top (+6)
AMBIENT = {'candle_crackle', 'lab_room_tone', 'beacon_motor', 'receipt_unroll_loop', 'umbrella_rain', 'fire_crackle',
           'server_hum', 'receipt_printer', 'calc_tape_spool', 'crowd_hush', 'house_lights_up', 'tiny_crowd_patter',
           'phone_buzz_muffled', 'stream_announce_roar', 'chat_ping_run', 'vhs_applause', 'glyph_shimmer',
           'reverse_swell_1beat', 'render_front_sweep', 'rope_haul', 'dollhouse_slide', 'hand_truck_roll', 'crowd_cheer',
           'phone_wave_buzz', 'light_bank_click', 'crowd_chant_under'}
TARGET_STORY, TARGET_AMBIENT = 6.0, 2.0
RIDE_CAP, RIDE_CAP_AMBIENT, PEAK_CAP = 18.0, 14.0, -12.0


SHORT_S = 0.3                               # a sound this short is heard by its peak over the local mix (a click)
TARGET_PEAK = 6.0


def sfx_audit(seg, g, B, gain, sq, ride_now):
    import soundfile as sf
    fx2 = band_frames(B['sfx'], FR2)
    rest = B['room'] + (B['score'] if B['score'] is not None else 0.0)
    mk2 = band_frames(rest, FR2)
    dl2 = band_frames(B['dlg'], FR2)
    k5 = FR // FR2
    fold = lambda a: a[:len(a) // k5 * k5].reshape(-1, k5).mean(axis=1)   # noqa: E731
    fxb, mkb, dlb = [fold(a) for a in fx2], [fold(a) for a in mk2], [fold(a) for a in dl2]
    rows = []
    for r in sq.get('sfx', []):
        beat, name, ts, laid_pk = r[0], r[1], r[2], r[3]
        notes = [n for n in r[4:] if isinstance(n, str)]
        lock = next((n[6:] for n in notes if n.startswith('lock: ')), name)
        f = os.path.join(S.SFXD, name + '.wav')
        dur = sf.info(f).duration if os.path.exists(f) else 1.0
        a, b = int(max(0.0, ts) * SR / FR), int((ts + min(dur, 1.5)) * SR / FR) + 1
        if b <= a:
            continue
        E = [float(x[a:b].sum()) for x in fxb]
        top = max(E)
        if top <= 0:
            continue
        own = [i for i, v in enumerate(E) if v >= top * 0.1]
        snr, snr_d = {}, {}
        for i in own:
            ps, pm, pd = fxb[i][a:b], mkb[i][a:b], dlb[i][a:b]
            sel = ps >= ps.max() * 10 ** (-6 / 10)
            snr[i] = 10 * np.log10(ps[sel].mean() / (pm[sel].mean() + 1e-20) + 1e-20)
            snr_d[i] = 10 * np.log10(ps[sel].mean() / (pm[sel].mean() + pd[sel].mean() + 1e-20) + 1e-20)
        bi = max(own, key=lambda i: snr[i])
        best = round(float(snr[bi]), 1)
        target = TARGET_AMBIENT if lock in AMBIENT or name in AMBIENT else TARGET_STORY
        # its attack: the loudest 2 ms in each own band over the local mix's mean power around its first 0.3 s (+-50 ms)
        a2, b2 = int(max(0.0, ts) * SR / FR2), int((ts + min(dur, 0.3)) * SR / FR2) + 1
        m0, m1 = max(0, a2 - int(0.05 * SR / FR2)), b2 + int(0.05 * SR / FR2)
        # the attack's own bands are by PEAK (a lamp's click outshines its hum in 2 ms, not in energy)
        P = [float(x[a2:b2].max()) if b2 > a2 else 0.0 for x in fx2]
        own_pk = [i for i, v in enumerate(P) if v >= max(P) * 0.1] if max(P) > 0 else own
        att = {i: 10 * np.log10(fx2[i][a2:b2].max() / (mk2[i][m0:m1].mean() + 1e-20) + 1e-20) for i in own_pk}
        pk_best = round(float(max(att.values())), 1)
        short = dur <= SHORT_S
        # the level actually in the stem where it lands, against the level it was laid at (a fade, a duck or a cut that
        # ate its attack shows here: the check that found the first head fade's bug)
        i0, i1 = int(max(0.0, ts) * SR), int((ts + min(dur, 3.0)) * SR) + 1          # its whole length (a swell peaks late)
        stem_pk = float(20 * np.log10(np.abs(B['sfx'][i0:i1]).max() + 1e-12)) if (i1 > i0 and ts >= 0) else None
        under_line = bool(dlb[bi][a:b].max() > fxb[bi][a:b].max() * 0.1)
        rows.append({'beat': beat, 'name': name, 'lock_name': lock, 'at': ts, 'peak_dbfs_laid': laid_pk, 'notes': notes,
                     'band_db_in_mix': round(10 * np.log10(top / (b - a) + 1e-20) + gain, 1),
                     'best_band': f'{BANDS[bi][0]}-{BANDS[bi][1]} Hz', 'best_snr_db': best,
                     'best_snr_with_dialogue_db': round(float(snr_d[bi]), 1), 'under_a_line': under_line,
                     'target_db': target, 'ride_now_db': ride_now.get((seg, beat, lock), 0.0),
                     'short': short, 'peak_over_local_db': pk_best, 'stem_peak_dbfs': None if stem_pk is None else round(stem_pk, 1),
                     'stem_under_laid_db': (round(float(laid_pk) - stem_pk, 1) if isinstance(laid_pk, (int, float)) and stem_pk is not None
                                            else None),
                     # heard if its attack pops (+6 over the local mix) or its body sits over the bed (its target)
                     'verdict': ('ok' if (pk_best >= TARGET_PEAK or best >= target) else
                                 ('masked' if max(pk_best - TARGET_PEAK, best - target) < -6 else 'marginal'))})
    return rows


def jump_cause(seg, g, rec, cues):
    t, bus = rec['at'], rec['rose']
    if bus == 'score':
        for s_ in cues.get('silences_designed') or []:
            if s_.get('t1') is not None and abs(t - float(s_['t1'])) < 0.6:
                return f"marked: the re-entry after a designed silence ({str(s_.get('why'))[:90]})"
        for h in cues.get('designed_hit') or []:
            if isinstance(h, dict) and abs(t - float(h.get('t', -99))) < 0.3:
                return f"marked: a designed hit ({str(h.get('what'))[:90]})"
        sec = [x for x in cues.get('sections') or [] if float(x.get('start', 0)) - 0.3 <= t <= float(x.get('end', 0)) + 0.3]
        if sec:
            return f"named: the score's own entry in {str(sec[-1].get('section') or sec[-1].get('cue') or '?')[:90]}"
        return 'UNMARKED (score)'
    if bus == 'dlg':
        best = None
        for i, b in enumerate(g.beats):
            for l in b.get('lines') or []:
                z = g.starts[i][0] + l['t'] - l.get('in', 0)
                on, end = g.starts[i][0] + l['t'], g.starts[i][0] + l['t'] + l['dur']
                if z - 0.2 <= t <= on + 0.6:
                    best = f'the first breath or word of {l["id"]}'
                elif on <= t <= end + 0.3 and best is None:
                    best = f'a word after a pause inside {l["id"]}'
        return f'named: {best}' if best else 'UNMARKED (dialogue)'
    if bus == 'room':
        return 'named: a room change at a cut (the room bus rose)'
    if bus == 'sfx':
        return 'named: an SFX onset'
    return 'UNMARKED'


def pocket_plus(seg, g, B, variant):
    sos = signal.butter(4, POCKET_BAND, 'bandpass', fs=SR, output='sos')
    masker = B['room'] + B['sfx'] + (B['score'] if B['score'] is not None else 0.0)
    mb = signal.sosfilt(sos, np.asarray(masker, 'float64').mean(axis=1))
    cm = _pow_cum(mb)
    del mb
    rows = []
    for i, b in enumerate(g.beats):
        for l in b.get('lines') or []:
            if not l.get('audio') or not os.path.exists(os.path.join(ROOT, l['audio'])):
                continue
            x, gdb = M.line_audio(l, b.get('room'), variant)
            v = signal.sosfilt(sos, x) * 0.7071 * M.db(gdb)
            on = g.starts[i][0] + l['t']
            z = on - l.get('in', 0.0)
            words = l.get('words') or []
            w0 = on + max(0.0, words[0][1]) if words else on
            a, e = w0, min(on + l['dur'], w0 + 0.6)
            ia, ie = int((a - z) * SR), int((e - z) * SR)
            vv = v[max(0, ia):max(0, ie)]
            if len(vv) == 0:
                continue
            pv = float(np.mean(vv ** 2))
            pm = _wmean(cm, int(a * SR), int(e * SR))
            mg = round(min(60.0, _db(pv) - _db(pm)), 1) if pm > 1e-14 else 60.0
            rows.append({'line': l['id'], 'who': l.get('who'), 'tag': l.get('tag') or '', 'beat': b['id'],
                         'on': round(on, 2), 'onset_margin_vs_all_db': mg})
    return rows


def voices(seg, g, variant, gain):
    rows = []
    for i, b in enumerate(g.beats):
        for l in b.get('lines') or []:
            if not l.get('audio') or not os.path.exists(os.path.join(ROOT, l['audio'])):
                continue
            x, gdb = M.line_audio(l, b.get('room'), variant)
            y = np.stack([x, x], 1) * 0.7071 * M.db(gdb + gain)
            rows.append({'line': l['id'], 'who': l.get('who'), 'tag': l.get('tag') or '', 'beat': b['id'],
                         'scene': (b.get('passes') or {}).get('scene'), 'lufs': round(M.lufs(y), 2),
                         'engine': l.get('engine') or 'el'})
    return rows


def jumps_by_bus(seg, B, gain, mq):
    out = []
    j = ((mq.get('measured') or {}).get('jumps_over_15dB') or {})
    for t in j.get('rising_other', []):
        a, b = int((t - 0.05) * SR), int((t + 0.05) * SR)          # mix_episode.jumps()' windows: [t-0.05, t) -> [t, t+0.05)
        rec = {'at': t}
        for k, x in B.items():
            if x is None:
                continue
            pre = x[max(0, a):max(0, a + int(0.05 * SR))]
            post = x[max(0, b - int(0.05 * SR)):b]
            lp = 20 * np.log10(np.sqrt(np.mean(np.asarray(pre, 'float64') ** 2)) + 1e-12) + gain
            lq = 20 * np.log10(np.sqrt(np.mean(np.asarray(post, 'float64') ** 2)) + 1e-12) + gain
            rec[k] = [round(lp, 1), round(lq, 1)]
        rise = {k: v[1] - v[0] for k, v in rec.items() if k != 'at' and v[1] > -70}
        rec['rose'] = max(rise, key=rise.get) if rise else None
        out.append(rec)
    return out


def loud_moments(seg, B, gain, thr=-10.0):
    """momentary loudness (400 ms) over thr LUFS-M in the final mix, merged into events, with the bus that carries each"""
    import soundfile as sf
    y = sf.read(os.path.join(ROOT, M.OUTS['el'], f'{seg}-mix.wav'), dtype='float32', always_2d=True)[0]
    tc, lm = M.loudness_curve(y, 0.4)
    ev = []
    for t, v in zip(tc, lm):
        if v > thr:
            if ev and t - ev[-1]['to'] <= 0.25:
                ev[-1]['to'] = round(float(t), 2)
                ev[-1]['max_lufs_m'] = round(max(ev[-1]['max_lufs_m'], float(v)), 1)
            else:
                ev.append({'from': round(float(t), 2), 'to': round(float(t), 2), 'max_lufs_m': round(float(v), 1)})
    for e in ev:
        a, b = int((e['from'] - 0.2) * SR), int((e['to'] + 0.2) * SR)
        lv = {k: round(float(10 * np.log10(np.mean(np.asarray(x[max(0, a):b], 'float64') ** 2) + 1e-20)) + gain, 1)
              for k, x in B.items() if x is not None}
        e['buses_db'] = lv
        e['carried_by'] = max(lv, key=lv.get)
    return ev


def episode_seams():
    """the seams around the intro and the outro, as the assembly plays them (the manifest's gains)"""
    import soundfile as sf
    man = json.load(open(os.path.join(ROOT, 'show/reel/ep02-v1-el/ep02-v1-el.manifest.json')))
    ch = {c['id']: c for c in man['chapters']}
    rms = lambda x: float(20 * np.log10(np.sqrt(np.mean(np.asarray(x, 'float64') ** 2)) + 1e-12))  # noqa: E731
    out = []
    def side(path, gain, tail):
        f = os.path.join(ROOT, path)
        if not os.path.exists(f):
            return None
        info = sf.info(f)
        if tail:
            x = sf.read(f, start=max(0, info.frames - int(0.2 * info.samplerate)), dtype='float32', always_2d=True)[0]
        else:
            x = sf.read(f, stop=int(0.2 * info.samplerate), dtype='float32', always_2d=True)[0]
        return rms(x) + gain
    io = (ch.get('intro') or {}).get('audio') or {}
    oo = (ch.get('outro') or {}).get('audio') or {}
    for a, b in [((f"{M.OUTS['el']}/coldopen-mix.wav", 0.0), (io.get('src'), io.get('gain', 0))),
                 ((io.get('src'), io.get('gain', 0)), (f"{M.OUTS['el']}/card-mix.wav", 0.0)),
                 ((f"{M.OUTS['el']}/tag-mix.wav", 0.0), (f"{M.OUTS['el']}/outro-mix.wav", oo.get('gain', 0)))]:
        if not a[0] or not b[0]:
            continue
        la, lb = side(a[0], a[1], True), side(b[0], b[1], False)
        out.append({'seam': f'{os.path.basename(a[0])} -> {os.path.basename(b[0])}', 'last_200ms_dbfs': None if la is None else round(la, 1),
                    'first_200ms_dbfs': None if lb is None else round(lb, 1),
                    'step_db': None if la is None or lb is None else round(lb - la, 1)})
    return out


RIDES = os.path.join(HERE, 'sfx-rides.json')


def load_rides():
    if not os.path.exists(RIDES):
        return {}, {}
    d = json.load(open(RIDES))
    return {(r['seg'], r['beat'], r['name']): float(r['ride_db']) for r in d.get('rides', [])}, \
        {(r['seg'], r['beat'], r['name']): r for r in d.get('rides', [])}


def update_rides(res, segs, lock_gain):
    """one more step toward each sound's target, per (seg, beat, lock name): the largest need among its occurrences, so a
    beat's own steps (three knocks, each louder) keep their order; capped at RIDE_CAP and a laid peak of PEAK_CAP dBFS.
    Each sound is heard if its attack pops (its loudest 2 ms over the local mix by TARGET_PEAK) or its body sits over the
    bed (its target): the ride is the smaller lift that meets either, so it can come down; a change under 1 dB is
    ignored (damping); a sound is never laid under the lock's own gain, and a ride never lays a peak over PEAK_CAP"""
    now, recs = load_rides()
    need, latest = {}, {}
    for seg in segs:
        for x in res[seg]['sfx']:
            k = (seg, x['beat'], x['lock_name'])
            if k in S.SOUND_GAIN:                    # a hand ruling in stems.py: no ride on top
                continue
            # the smaller lift that meets either test (both scale 1:1 with the sound's level)
            nd = min(TARGET_PEAK - x['peak_over_local_db'], x['target_db'] - x['best_snr_db'])
            if nd > need.get(k, -99.0):
                latest[k] = x
            need[k] = max(need.get(k, -99.0), nd)
            recs.setdefault(k, {'seg': seg, 'beat': x['beat'], 'name': x['lock_name'], 'laid_as': x['name'],
                                'snr_before_db': x['best_snr_db'], 'band': x['best_band'], 'target_db': x['target_db']})
    out = []
    for k, nd in sorted(need.items()):
        cur = now.get(k, 0.0)
        new = max(0.0, cur + nd)                 # down too: the smaller of the two needs (never under the lock's gain)
        if abs(new - cur) < 1.0 and cur > 0:     # damping: a reading within a dB of its target keeps its ride
            new = cur
        top = max(PEAK_CAP - lock_gain.get(k, -24.0), 0.0)
        cap = RIDE_CAP_AMBIENT if recs[k]['target_db'] == TARGET_AMBIENT else RIDE_CAP
        new = round(min(new, cap, top), 1)
        if new <= 0.05:
            continue
        r = dict(recs[k])
        r['ride_db'] = new
        x = latest[k]
        r['measured_with_ride'] = {'ride_db': cur, 'attack_over_local_db': x['peak_over_local_db'], 'body_db': x['best_snr_db'],
                                   'band': x['best_band']}
        r['why'] = (f"first heard {r['snr_before_db']:+.1f} dB over rooms and score in its own band ({r['band']}) at the lock's "
                    f"gain; the ride is the smaller lift to an attack of +{TARGET_PEAK:.0f} dB over the local mix or a body of "
                    f"{r['target_db']:+.0f} dB" + (' (capped)' if new in (cap, round(top, 1)) and nd > 0 else ''))
        out.append(r)
    json.dump({'about': 'the sound audit\'s rides (sound_audit.py --rides; stems.py adds ride_db to the lock\'s gain): each '
               'masked sound lifted toward its target over rooms and score in its own band, measured where it sounds; '
               'one offset per (segment, beat, lock name)', 'rides': out}, open(RIDES, 'w'), indent=1)
    return out


def lock_account(seg, g, sq):
    names = [(b['id'], sd['name']) for b in g.beats for sd in b.get('sounds', [])]
    laid = sum(1 for r in sq.get('sfx', []) if not any(str(n).startswith('added by') for n in r[4:]))
    return {'lock_sounds': len(names), 'laid': laid, 'claimed_by_score': len(sq.get('sfx_dropped', [])),
            'missing': sq.get('sfx_missing', []), 'swapped': sum(1 for r in sq.get('sfx', []) if any('swapped' in str(n) for n in r[4:])),
            'cut_at_scene_end': sq.get('sfx_cut_at_scene_end', []), 'added': sq.get('added', []),
            'balanced': len(names) == laid + len(sq.get('sfx_dropped', [])) + len(sq.get('sfx_missing', []))}


def main(argv):
    if '--no-heavy' not in argv and os.environ.get('MRMAS_EP2AUDIT_INNER') != '1':
        os.chdir(ROOT)
        os.execvp('bash', ['bash', os.path.join(ROOT, 'ops/heavy.sh'), 'env', 'MRMAS_EP2AUDIT_INNER=1', sys.executable,
                           os.path.abspath(__file__)] + argv)
    variant = 'el'
    segs = [a for a in argv if a in SEGS] or SEGS
    qad = os.path.join(ROOT, M.QA_DIR, variant)
    rep = json.load(open(os.path.join(qad, 'loudness-report.json')))
    sd = os.path.join(ROOT, S.VARIANTS[variant]['out'])
    outp = os.path.join(qad, 'sound-audit.json')
    res = json.load(open(outp)) if os.path.exists(outp) else {}
    for seg in segs:
        p = S.timeline_path(seg, variant)
        g = S.Seg(seg, json.load(open(p)), p)
        gain = float(rep['segments'][seg]['gain_db'])
        sq = json.load(open(os.path.join(sd, f'{seg}-stems-qa.json')))
        mq = json.load(open(os.path.join(qad, f'{seg}-mix-qa.json')))
        P = M.premix(seg, g, variant, True, keep_buses=True)
        B = P['buses']
        r = {'gain_db': gain}
        ride_now, _ = load_rides()
        r['sfx'] = sfx_audit(seg, g, B, gain, sq, ride_now)
        r['pocket_plus'] = pocket_plus(seg, g, B, variant)
        r['voices'] = voices(seg, g, variant, gain)
        r['jumps'] = jumps_by_bus(seg, B, gain, mq)
        _, cp = S.score_files(seg, variant)
        cues = json.load(open(cp)) if cp else {}
        for x in r['jumps']:
            x['cause'] = jump_cause(seg, g, x, cues)
        r['lock'] = lock_account(seg, g, sq)
        r['loud_moments'] = loud_moments(seg, B, gain)
        m = mq.get('measured') or {}
        r['mix'] = {k: m.get(k) for k in ('lufs_i', 'true_peak_dbtp', 'lra_lu', 'dialogue_lufs', 'rooms_lufs', 'sfx_lufs',
                                         'score_lufs_after_duck', 'score_rms_under_speech_dbfs', 'score_rms_between_speech_dbfs',
                                         'holes_under_-42dBFS_0.3s', 'unmarked_holes', 'unmarked_holes_without_score')}
        r['score'] = {k: (mq.get('score') or {}).get(k) for k in ('file', 'next_prelap', 'prev_ringout', 'head_fade_s', 'head_fade_why')}
        r['rooms'] = [{k: x.get(k) for k in ('room', 'recipe', 'from', 'to', 'lead', 'trail', 'lift_db', 'cross')} for x in sq.get('rooms', [])]
        r['room_quiet_spans'] = sq.get('room_under_-55dBFS_0.3s')
        r['click_scan'] = {k: [f for f in (sq.get('click_scan') or {}).get(k, {}).get('boundaries', []) if f.get('kind') != 'onset']
                           for k in ('room', 'sfx')}
        res[seg] = r
        del P, B
        nm = sum(1 for x in r['sfx'] if x['verdict'] == 'masked')
        r['jumps_unmarked'] = sum(1 for x in r['jumps'] if x['cause'].startswith('UNMARKED'))
        nmg = sum(1 for x in r['sfx'] if x['verdict'] == 'marginal')
        low = [x for x in r['pocket_plus'] if x['onset_margin_vs_all_db'] < 6]
        eaten = [x for x in r['sfx'] if (x.get('stem_under_laid_db') or 0) > 3
                 and not any(k_ in n for n in x['notes'] for k_ in ('duck', 'cut at', 'added by', 'J-cut'))]
        r['laid_level_check'] = {'sounds': len(r['sfx']), 'more_than_3db_under_their_laid_peak': [(x['beat'], x['name'], x['stem_under_laid_db']) for x in eaten]}
        for x in eaten:
            print(f"   LEVEL    {x['beat']:7s} {x['name']:24s} @{x['at']:8.2f} the stem's peak is {x['stem_under_laid_db']:.1f} dB under its laid peak")
        print(f"{seg}: sfx {len(r['sfx'])} laid, {nm} masked, {nmg} marginal; lines {len(r['pocket_plus'])}, onset vs all "
              f"under +6 dB: {len(low)}; jumps unplaced {len(r['jumps'])}; lock {r['lock']['lock_sounds']} = laid "
              f"{r['lock']['laid']} + claimed {r['lock']['claimed_by_score']} + missing {len(r['lock']['missing'])} "
              f"({'ok' if r['lock']['balanced'] else 'UNBALANCED'}); cut at scene end {len(r['lock']['cut_at_scene_end'])}")
        for x in r['sfx']:
            if x['verdict'] != 'ok':
                print(f"   {x['verdict']:8s} {x['beat']:7s} {x['name']:24s} @{x['at']:8.2f} {'peak ' + format(x['peak_over_local_db'], '+.1f') + ' over local; ' if x['short'] else ''}best {x['best_snr_db']:+.1f} dB in {x['best_band']} "
                      f"(laid at {x['peak_dbfs_laid']} dBFS peak, ride {x['ride_now_db']:+.1f}){' under a line' if x['under_a_line'] else ''}")
        for x in low:
            print(f"   pocket+  {x['beat']:7s} {x['line']:14s} {x['who']:10s} {x['tag']:7s} @{x['on']:8.2f} onset vs all {x['onset_margin_vs_all_db']:+.1f} dB")
        for x in r['jumps']:
            print(f"   jump     @{x['at']:8.2f} rose: {x['rose']}: {x['cause']}")
    # the episode's voices: per speaker, and MARIO against his scene
    allv = [v for seg in SEGS if seg in res for v in res[seg]['voices']]
    by = {}
    for v in allv:
        if v['tag'] in ('', 'os', 'call', 'offmic'):
            by.setdefault(v['who'], []).append(v['lufs'])
    res['_speakers'] = {w: {'lines': len(x), 'median_lufs': round(statistics.median(x), 2), 'min': min(x), 'max': max(x)}
                        for w, x in sorted(by.items())}
    sc18 = [v for v in res.get('act4', {}).get('voices', []) if v['scene'] == '18' and v['tag'] == '']
    mar = [v['lufs'] for v in sc18 if v['who'] == 'mario']
    nb = [v['lufs'] for v in sc18 if v['who'] in ('ekiel', 'terb', 'mas')]
    if mar and nb:
        res['_mario'] = {'mario_median_lufs': round(statistics.median(mar), 2), 'neighbours_median_lufs': round(statistics.median(nb), 2),
                         'diff_db': round(statistics.median(mar) - statistics.median(nb), 2), 'rule': 'S7: within about 1 dB'}
    res['_seams'] = rep.get('seams')
    res['_episode_seams'] = episode_seams()
    res['_segments'] = {s: {k: rep['segments'][s].get(k) for k in ('lufs_i', 'true_peak_dbtp', 'dialogue_lufs', 'gain_db', 'guard_db')}
                        for s in rep.get('segments', {})}
    if '--rides' in argv:
        lock_gain = {}
        for seg in segs:
            p = S.timeline_path(seg, variant)
            for b in json.load(open(p))['beats']:
                for sd in b.get('sounds', []):
                    lock_gain[(seg, b['id'], sd['name'])] = float(S.SOUND_GAIN.get((seg, b['id'], sd['name']), sd.get('gain', -24)))
        rr = update_rides(res, segs, lock_gain)
        print(f'rides: {len(rr)} entries -> {os.path.relpath(RIDES, ROOT)}')
    json.dump(res, open(outp, 'w'), indent=1, default=float)
    print('speakers:', json.dumps(res['_speakers']))
    print('mario:', res.get('_mario'))
    print('seams:', json.dumps(res['_seams']))
    print('episode seams:', json.dumps(res['_episode_seams']))
    for seg in segs:
        for e in res[seg].get('loud_moments', []):
            print(f"   loud {seg} {e['from']:8.2f}-{e['to']:7.2f} {e['max_lufs_m']} LUFS-M, carried by {e['carried_by']}")
    print(f'-> {os.path.relpath(outp, ROOT)}')


if __name__ == '__main__':
    main(sys.argv[1:])
