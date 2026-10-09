#!/usr/bin/env python3
"""Ep2 v1: THE POCKET, per line. Each take against the score as the mix will play it, in the voice's presence band
(1-4 kHz), from the score review of 2026-10-09 (finding: "the pocket is checked only as whole-cue 2-6 kHz averages, never
per line in 1-4 kHz with the mixer's duck").

    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/pocket.py act2            # one segment, every line
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/pocket.py act2 --from 94 --to 141
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/pocket.py --all --flagged  # the episode, flags only
    ... --json PATH                                                                          # also write the rows

How it hears (all from audio/reel/ep02-v1/mix_episode.py, imported read-only, so the check and the mix can't drift):
  THE SCORE   mix_episode.score_bus(): music-el.wav on this lock with the previous chapter's ring-out, the duck (the
              depth by mood, the cue sheet's duck_db, the speech envelope, the silent-post dip), the head fade and the
              next chapter's pre-lap: the score bus exactly as the mix lays it, before the master (the master's gain is
              common to voice and score, so the margins hold after it).
  THE TAKES   mix_episode.line_audio(): each take with its level match, MARIO's EQ, its device chain and its cut, dual
              mono at -3 dB, the V.O. +2 dB: the dialogue bus's own processing, one line at a time.
  THE BAND    a 4th-order Butterworth band-pass, 1-4 kHz (the consonants and the presence peak), on both.
Per line (on the segment clock; a line = its take's span on .. on + dur):
  whole       the voice's band power over the line against the score's, in dB (the margin)
  onset       the same over the first 0.6 s from the first word (where a masked word is lost)
  worst       the lowest margin of any 0.5 s window inside the line (50 ms hop) in which the voice speaks (its band
              level within 10 dB of the line's own; a breath between sentences is not a word)
  raw_onset   the onset margin against the score as delivered, before the duck (Ep1's final measured about +3.9 dB at
              the 10th percentile of its line onsets on this basis: the score review)
FLOOR: an onset under +10 dB is flagged (the review's bar: "re-measure per line until the onset margins are at least
+10 dB"). check.py fails a segment with a flagged line its cue sheet doesn't list in `pocket_exempt` ([{line, why}]).
The takes' levels are measured, never listened to. [M]
"""
from __future__ import annotations

import importlib.util
import json
import math
import os
import sys

import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
BAND = (1000.0, 4000.0)
ONSET_S, WIN_S, HOP_S = 0.6, 0.5, 0.05
FLOOR_DB = 10.0
SPEAKS_DB = 10.0          # a window counts toward `worst` when the voice's band level is within this of the line's
CAP_DB = 60.0             # a margin over silence reads +60
_M = None


def mixer():
    global _M
    if _M is None:
        spec = importlib.util.spec_from_file_location('ep2mix_pocket', os.path.join(REPO, 'audio', 'reel', 'ep02-v1',
                                                                                     'mix_episode.py'))
        _M = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(_M)
    return _M


def _sos():
    return signal.butter(4, BAND, 'bandpass', fs=48000, output='sos')


def _pow_frames(x, hop):
    """mean square per hop of a [n] or [n, ch] signal (channels averaged)"""
    if x.ndim == 2:
        x = np.mean(x.astype(np.float64) ** 2, axis=1)
    else:
        x = x.astype(np.float64) ** 2
    k = len(x) // hop
    return x[:k * hop].reshape(k, hop).mean(axis=1)


def _db(p):
    return 10 * math.log10(p) if p > 1e-20 else -200.0


def _margin(pv, pm):
    if pv <= 1e-20:
        return None
    if pm <= 1e-14:
        return CAP_DB
    return round(min(CAP_DB, _db(pv) - _db(pm)), 1)


def segment(seg, variant='el', t_from=0.0, t_to=1e9, mus=None, raw=None):
    """every line's margins in one segment: a list of rows (dicts). mus / raw: [N, 2] arrays to test instead of the
    score bus and the delivered score (default: what's on disk, laid by the mixer's own code)"""
    M = mixer()
    S = M.S
    SR = S.SR
    p = S.timeline_path(seg, variant)
    g = S.Seg(seg, json.load(open(p)), p)
    N = g.N
    speech = M.speech_spans(g)
    u, _ = M.duck_env(speech, N)
    if mus is None:
        mus, sq, _ = M.score_bus(seg, g, variant, u, True)
        if mus is None:
            return [], dict(seg=seg, error=f'no score on this lock: {sq}')
    if raw is None:
        wav, _ = S.score_files(seg, variant)
        raw = sf.read(wav, dtype='float32', always_2d=True)[0][:N] if wav else np.zeros((N, 2), 'float32')
    sos = _sos()
    hop = int(HOP_S * SR)
    mb = signal.sosfilt(sos, mus.astype(np.float64), axis=0)
    rb = signal.sosfilt(sos, raw.astype(np.float64), axis=0)
    pm_all, pr_all = _pow_frames(mb, hop), _pow_frames(rb, hop)
    del mb, rb
    rows = []
    for i, b in enumerate(g.beats):
        s0 = g.starts[i][0]
        for l in b.get('lines') or []:
            if not l.get('audio') or not os.path.exists(os.path.join(REPO, l['audio'])):
                continue
            on = s0 + l['t']
            end = on + l['dur']
            if end < t_from or on > t_to:
                continue
            x, gain = M.line_audio(l, b.get('room'), variant)
            v = signal.sosfilt(sos, x) * 0.7071 * M.db(gain)        # one channel of the dual mono (both the same)
            at = on - l.get('in', 0.0)                                # where the take's sample 0 lands
            k0 = int(round(at / HOP_S))
            pv = _pow_frames(v, hop)
            # the line's frames on the segment's 50 ms grid
            f_on, f_end = int(math.floor(on / HOP_S)), int(math.ceil(end / HOP_S))
            words = l.get('words') or []
            w0 = on + max(0.0, words[0][1]) if words else on
            f_w0 = int(math.floor(w0 / HOP_S))
            f_w1 = min(f_end, f_w0 + int(round(ONSET_S / HOP_S)))

            def vpow(a, z):
                ia, iz = a - k0, z - k0
                ia, iz = max(0, ia), min(len(pv), iz)
                return pv[ia:iz] if iz > ia else np.zeros(0)

            def mpow(arr, a, z):
                a, z = max(0, a), min(len(arr), z)
                return arr[a:z] if z > a else np.zeros(0)

            V_line, M_line, R_line = vpow(f_on, f_end), mpow(pm_all, f_on, f_end), mpow(pr_all, f_on, f_end)
            n = min(len(V_line), len(M_line))
            if n == 0:
                continue
            V_line, M_line, R_line = V_line[:n], M_line[:n], R_line[:n]
            whole = _margin(V_line.mean(), M_line.mean())
            Vo, Mo, Ro = vpow(f_w0, f_w1), mpow(pm_all, f_w0, f_w1), mpow(pr_all, f_w0, f_w1)
            no = min(len(Vo), len(Mo))
            onset = _margin(Vo[:no].mean(), Mo[:no].mean()) if no else None
            raw_onset = _margin(Vo[:no].mean(), Ro[:no].mean()) if no else None
            # worst 0.5 s window where the voice speaks
            w = int(round(WIN_S / HOP_S))
            lv = _db(V_line.mean())
            worst, worst_t = None, None
            if n <= w:
                worst, worst_t = whole, on
            else:
                cv = np.concatenate([[0.0], np.cumsum(V_line)])
                cm = np.concatenate([[0.0], np.cumsum(M_line)])
                for j in range(0, n - w + 1):
                    a_v = (cv[j + w] - cv[j]) / w
                    if _db(a_v) < lv - SPEAKS_DB:
                        continue
                    mg = _margin(a_v, (cm[j + w] - cm[j]) / w)
                    if mg is not None and (worst is None or mg < worst):
                        worst, worst_t = mg, (f_on + j) * HOP_S
            rows.append(dict(line=l['id'], who=l.get('who', ''), tag=l.get('tag') or '', beat=b['id'],
                             on=round(on, 2), end=round(end, 2), whole=whole, onset=onset, worst=worst,
                             worst_at=round(worst_t, 2) if worst_t is not None else None, raw_onset=raw_onset,
                             score_onset_dbfs=round(_db(Mo[:no].mean()), 1) if no else None,
                             voice_onset_dbfs=round(_db(Vo[:no].mean()), 1) if no else None,
                             flag=bool(onset is not None and onset < FLOOR_DB)))
    rows.sort(key=lambda r: r['on'])
    ons = [r['onset'] for r in rows if r['onset'] is not None and r['onset'] < CAP_DB]
    raws = [r['raw_onset'] for r in rows if r['raw_onset'] is not None and r['raw_onset'] < CAP_DB]
    summ = dict(seg=seg, lines=len(rows), under_score=len(ons), flagged=sum(r['flag'] for r in rows),
                onset_p10=round(float(np.percentile(ons, 10)), 1) if ons else None,
                onset_min=round(min(ons), 1) if ons else None,
                raw_onset_p10=round(float(np.percentile(raws, 10)), 1) if raws else None)
    return rows, summ


def exempt(seg, variant='el'):
    """{line id: why} from the cue sheet's pocket_exempt"""
    M = mixer()
    _, cp = M.S.score_files(seg, variant)
    if not cp:
        return {}
    d = json.load(open(cp))
    return {e['line']: e.get('why', '') for e in d.get('pocket_exempt') or [] if isinstance(e, dict) and e.get('line')}


def main(argv):
    segs = SEGS if '--all' in argv else [a for a in argv if a in SEGS]
    t_from = float(argv[argv.index('--from') + 1]) if '--from' in argv else 0.0
    t_to = float(argv[argv.index('--to') + 1]) if '--to' in argv else 1e9
    only_flag = '--flagged' in argv
    out = {}
    for seg in segs:
        rows, summ = segment(seg, t_from=t_from, t_to=t_to)
        ex = exempt(seg)
        out[seg] = dict(summary=summ, rows=rows)
        print(f"{seg}: {summ.get('lines')} lines ({summ.get('under_score')} with score under them); onset margin p10 "
              f"{summ.get('onset_p10')} dB, min {summ.get('onset_min')}; before the duck p10 {summ.get('raw_onset_p10')}; "
              f"flagged (onset < +{FLOOR_DB:.0f}) {summ.get('flagged')}"
              f"{' (exempt: ' + str(sum(1 for r in rows if r['flag'] and r['line'] in ex)) + ')' if ex else ''}")
        for r in rows:
            if only_flag and not r['flag']:
                continue
            f = ('EXEMPT' if r['line'] in ex else 'FLAG') if r['flag'] else ''
            print(f"  {r['on']:8.2f}-{r['end']:7.2f} {r['line']:12s} {r['who'][:9]:9s} {r['tag'][:6]:6s} whole "
                  f"{r['whole']!s:>5} onset {r['onset']!s:>5} worst {r['worst']!s:>5} @{r['worst_at']!s:>7} | raw onset "
                  f"{r['raw_onset']!s:>5} | score {r['score_onset_dbfs']!s:>6} voice {r['voice_onset_dbfs']!s:>6} dBFS {f}")
    if '--json' in argv:
        json.dump(out, open(argv[argv.index('--json') + 1], 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1:])
