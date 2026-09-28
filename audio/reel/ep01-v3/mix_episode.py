#!/usr/bin/env python3
"""Ep1 v3, track A3 (pass v3-sound): the final mix of each segment, and the episode's loudness report.

  audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all [--variant el] [--lock v32|v31|v3]
      v3.2 (show/reel/ep01-v32/, EL show/reel/ep01-v32-el/) is the default lock: its mixes go to
      out/ep01/full-v3/mix-v32/ (EL mix-v32-el/), its QA to audio/reel/ep01-v3/mix-qa/v32/; --lock v31 to mix-v31[-el]/
      and mix-qa/v31/; --lock v3 to the v3 paths below. v3.2 adds: a designed hit at an act's head (cues.json
      designed_hit) keeps its attack (a 40 ms fade, not the act-head fade); outro-mix.wav, the outro's audio with the
      tag's hum held 2 s under it, a 150 ms fade-in and its first hit -6 dB (play it in place of the outro's own audio,
      at the manifest's gain); the phone and stage (PA in a hall) chains. A score render is used only if its cue sheet names this lock's timeline and its length is
      within a frame (the v3 and v3.1 renders share their paths); otherwise the segment mixes with no score and says so.
  v3.1 adds: THE SET PIECES (SETPIECES: the odometer, the avalanche, the hourglass shatter) lifted, score and SFX
      only, until their peak is LIFT_LU (2.5) over the segment's talk; the score's fade-in at each act's head
      (SCORE_HEAD_FADE); score rides for a featured sound (SCORE_RIDE: the lap in S1.01b); the one silence from the
      Remove click; the demo film's voice at full range and Ttemme's line "through his stream" (DEVICE 'stream').
  audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py act3 tag          (some segments)
      Re-runs itself through ops/heavy.sh (--no-heavy to skip that). Rebuilds the room/SFX stems first when any of
      their inputs changed (stems.py's fingerprint: the timelines, the beat plans, the scores' claims), so one command
      is always enough.
  reads   the timelines (kokoro: show/reel/ep01-v3/ep01-v3-<seg>.json; el: show/reel/ep01-v3-el/ep01-v3-el-<seg>.json)
          and the takes they name; the stems audio/reel/ep01-v3[/el]/<seg>-room.wav, -sfx.wav; the score
          audio/ost/tracks/e01-v3-<seg>/render/music.wav (+ its cues.json) if it exists (el: e01-v3-el-<seg>/render/
          music.wav, e01-v3-<seg>/render/music-el.wav or .../render/el/music.wav; none of these -> no score, said so)
  writes  out/ep01/full-v3/mix/<seg>-mix.wav (el: out/ep01/full-v3/mix-el/), 48 kHz / 24-bit stereo, git-ignored,
          each exactly its segment's length; card-mix.wav (the 2 s filename card, at Act One's gain);
          audio/reel/ep01-v3/mix-qa/<variant>/<seg>-mix-qa.json and loudness-report.json (the chapters side by side)

THE MIX, per segment:
  DIALOGUE  every take at beatStart + t - in, dual mono at -3 dB (a -16 LUFS take stays -16 LUFS). Lines tagged
            call / monitor / laptop, and every line inside sc 8's phone POV (room `phone`), go through a small-speaker
            chain (DEVICE: band limits and a presence bump), loudness-matched to the dry take, then -1 dB. The V.O. is
            dry and close at its take's level. An interrupted line (`cut`) stops at its `dur`. EL: each take is levelled
            to its Kokoro counterpart's loudness, so the two mixes differ only in the voices.
  ROOMS     the room stem, dipping 2 dB under speech (the sample's). (The cold open's hall and banquet carry 8 dB more
            in the stem itself: they were built for the lock mixer's 10 dB duck.)
  SFX       the SFX stem as built (not ducked, as the sample and the lock).
  SCORE     music.wav as delivered (the composers render underscore level, dry of dialogue, on the segment's clock;
            the cold open's MM-06 +6 dB, the lead's ruling, onto the -20 LUFS reference),
            DUCKED under speech: the lock mixer's envelope (0.25 s pre, joined across gaps under 2.5 s, 0.2 s in,
            0.6 s out), by a depth per mood (DUCK_BY_MOOD: 6 dB on launch night, 7 on the warm dark-room, 2 AM and tag
            cues, 8-10 elsewhere, 10 on Vegas and the pause letter), smoothed over 1.5 s; a cue sheet's
            "duck_db" (on a cue, row or section, or "mix": {"duck_db": ..}) overrides it for its window. -3 dB under
            a silent POST when no one speaks (the v4.1 note). Act Four's Cancel click -> buzz: the score is gated to
            zero (the one silence; its level before the gate is reported).
            The tag's head: Act Four's score ends on a sounding pedal; its release (music-ringout.wav, the act4
            composer's hand-off) is laid at the tag's first sample and crossfades out (equal power, 2.5 s) under the
            tag's own score from its first entry.
  MASTER    -16 LUFS integrated per segment; a look-ahead peak limiter (ceiling -1.5 dBFS) and a 4x-oversampled
            true-peak check (< -1.0 dBTP, re-limited if not). THE SEAMS: each story chapter's first 2 s ramp from the
            previous chapter's gain to its own, so a sound that crosses a chapter boundary (a pedal, a room, a pre-lap)
            doesn't step by the difference between their gains; the report measures every seam. THE DIALOGUE GUARD (with --all): a segment whose
            dialogue would land more than 1.5 LU above the episode's median dialogue loudness is turned down to it
            (it then sits under -16 LUFS, and the report says so): chapters match by the voice, not by their music.
Nothing here has been listened to. The QA and the report say what was measured.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import statistics
import sys
import time

import numpy as np
import soundfile as sf
from scipy import ndimage, signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
_spec = importlib.util.spec_from_file_location('v3stems', os.path.join(HERE, 'stems.py'))
S = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(S)
SR, FPS = S.SR, S.FPS
SEGS = S.SEGS
OUTS = {'v3': {'kokoro': 'out/ep01/full-v3/mix', 'el': 'out/ep01/full-v3/mix-el'},
        'v31': {'kokoro': 'out/ep01/full-v3/mix-v31', 'el': 'out/ep01/full-v3/mix-v31-el'},
        'v32': {'kokoro': 'out/ep01/full-v3/mix-v32', 'el': 'out/ep01/full-v3/mix-v32-el'},
        'v33': {'kokoro': 'out/ep01/full-v3/mix-v33', 'el': 'out/ep01/full-v3/mix-v33-el'},
        'v34': {'kokoro': 'out/ep01/full-v3/mix-v34', 'el': 'out/ep01/full-v3/mix-v34-el'}}
QA_DIRS = {'v3': 'audio/reel/ep01-v3/mix-qa', 'v31': 'audio/reel/ep01-v3/mix-qa/v31', 'v32': 'audio/reel/ep01-v3/mix-qa/v32',
           'v33': 'audio/reel/ep01-v3/mix-qa/v33', 'v34': 'audio/reel/ep01-v3/mix-qa/v34'}
OUT, QA_DIR = OUTS[S.DEFAULT_LOCK], QA_DIRS[S.DEFAULT_LOCK]


def set_lock(name):
    global OUT, QA_DIR
    S.set_lock(name)
    OUT, QA_DIR = OUTS[name], QA_DIRS[name]
TARGET, CEIL, TP_MAX = -16.0, -1.5, -1.05   # v3.4: TP_MAX 0.05 dB inside -1 dBTP, so no report reads "-1.0" (v3.4 act3: -1.00)
GUARD_LU = 1.5
ROOM_DIP = {}                           # (the cold open's extra 8 dB for its hall and banquet is baked into its stem)
ROOM_DIP_DEFAULT = 2.0
DUCK_DEFAULT = 9.0
SCORE_GAIN_DB = {'coldopen': 6.0}       # the lead, 2026-09-27: the cold open's MM-06 (v2's stem at -26 LUFS-I) +6 dB,
                                        # onto the -20 underscore reference the other segments' scores sit at
DUCK_BY_MOOD = [                        # the beat's `music (v3): ...` heading, by its first words -> dB under speech
    ('LAUNCH NIGHT', 6), ('the Build thins', 6), ('THE ODOMETER', 8), ('the swing turns', 9), ('THE BILL', 9),
    ("ELGOOG'S CODE RED", 8), ("THE LANDLORD'S DEAL", 8), ('THE JOB', 8), ('THE DUEL', 9), ('THE PAUSE LETTER', 10),
    ('THE WHITE HOUSE', 8), ('THE BRIDGE', 10), ('THE SENATE', 9), ('THE TOUR', 8), ('THE ROOFTOP', 9),
    ('THE DARK ROOM', 7), ('ACT-OUT', 9), ('NOON, LAS VEGAS', 10), ('THAT NIGHT', 9), ("THE BOARD'S SIDE", 9),
    ('2 AM', 7), ('THE AVALANCHE', 8), ('THE RETURN', 8), ('CODA', 9), ('TAG', 7), ('COLD OPEN', 9),
    ('SYDNEY', 8), ('ACT THREE', 7), ('THE CLOCK', 9),                                     # v3.1's headings
]
SMALL = {'call', 'monitor', 'laptop', 'phone', 'stage'}     # line tags that take a DEVICE chain
VO_GAIN_DB = 2.0   # the V.O. takes are -18 LUFS (2 under the spoken -16, the take pass's design); +2 puts them level
DESIGNED = {                            # holes that are story beats (the one silence, act-out blacks, the white)
    'act4': [('v31-S1.08d', 'S1.11', 'THE ONE SILENCE: the Remove click -> the buzz (room tone only)'),
             ('S1.09', 'S1.11', 'THE ONE SILENCE: the Cancel click -> the buzz (room tone only)'),
             ('S7.13', 'S7.13', "Ttemme's stream: the held beat, near silence (the sand stands)")],
    'tag': [('v31-32.01d', 'v31-32.01d', "the demo's stills: the room coming back faintly (runway.md §7)")],
    'act1': [('12.07', '12.07', 'the act-out black (the bullpen cuts with the picture)')],
    'act2': [('14.06', '14.06', 'the black: the clone\'s voice finds its mouth'), ('17.13', '17.13', "the black on the bell's last partial")],
    'act3': [('23.04', '23.04', 'the act-out black: THE CLOCK\'s dead stop, the crane pre-lap coming up')],
    'coldopen': [('3.02', '4.01', 'the rewind reaching white')],
}


def db(x):
    return 10.0 ** (np.asarray(x, dtype='float64') / 20.0)


# ------------------------------------------------------------------ loudness helpers (BS.1770 K-weighting at 48 kHz)
_KW = None


def kweight(x):
    global _KW
    if _KW is None:
        import pyloudnorm
        m = pyloudnorm.Meter(SR)
        _KW = [np.concatenate([f.b, f.a])[None, :] for f in m._filters.values()]
    y = np.asarray(x, dtype='float64')
    for s in _KW:
        y = signal.sosfilt(s, y, axis=0)
    return y


def lufs(x):
    return S.lufs(x)


def short_term(x, win=3.0, hop=1.0):
    """short-term loudness (3 s windows, 1 s hop), LUFS"""
    y = kweight(x) ** 2
    e = y.sum(axis=1)
    c = np.concatenate([[0.0], np.cumsum(e)])
    n, h = int(win * SR), int(hop * SR)
    if len(e) < n:
        return np.array([])
    idx = np.arange(0, len(e) - n + 1, h)
    ms = (c[idx + n] - c[idx]) / n
    return -0.691 + 10 * np.log10(ms + 1e-20)


def lra(x):
    st_ = short_term(x)
    st_ = st_[st_ > -70]
    if len(st_) < 3:
        return None
    rel = -0.691 + 10 * np.log10(np.mean(10 ** ((st_ + 0.691) / 10))) - 20
    st_ = st_[st_ > rel]
    return round(float(np.percentile(st_, 95) - np.percentile(st_, 10)), 1) if len(st_) >= 3 else None


def true_peak(x):
    pk = 0.0
    step = 10 * SR
    for i in range(0, len(x), step):
        a, b = max(0, i - 64), min(len(x), i + step + 64)
        y = signal.resample_poly(x[a:b].astype('float64'), 4, 1, axis=0)
        pk = max(pk, float(np.abs(y).max()))
    return 20 * np.log10(pk + 1e-12)


def limiter(x, ceil_db):
    """a look-ahead peak limiter that never overshoots: gain = ceiling / (a boxcar-smoothed max-filtered envelope);
    the max filter's half-width is twice the smoother's, so the smoothed envelope is never below the true one, and a
    second min-filter/boxcar pass (20 ms) smooths the gain's release without letting it rise above the first"""
    c = db(ceil_db)
    env = np.abs(x).max(axis=1)
    W = int(0.005 * SR)
    pk = ndimage.maximum_filter1d(env, size=2 * W + 1)
    sm = ndimage.uniform_filter1d(pk, size=W + 1)
    g = np.minimum(1.0, c / (sm + 1e-12))
    H = int(0.02 * SR)
    g = ndimage.uniform_filter1d(ndimage.minimum_filter1d(g, size=2 * H + 1), size=H + 1)
    return (x * g[:, None]).astype('float32'), float((g < 0.999).sum()) / SR


def win_db(x, w=0.05, mono=False):
    n = int(w * SR)
    k = len(x) // n
    y = x[:k * n].astype('float64')
    if mono:
        y = y.mean(axis=1, keepdims=True)
    r = np.sqrt(np.mean(y.reshape(k, n, -1) ** 2, axis=1)).max(axis=1)
    return 20 * np.log10(r + 1e-12)


def holes(x, thr=-42.0, min_s=0.3, mono=False):
    w = win_db(x, mono=mono)
    out, run = [], 0
    for i, v in enumerate(list(w) + [0.0]):
        if v < thr:
            run += 1
        else:
            if run * 0.05 >= min_s - 1e-9:
                out.append((round((i - run) * 0.05, 2), round(run * 0.05, 2)))
            run = 0
    return out


def jumps(x, speech_on, sfx_on=(), thr=15.0, floor=-60.0):
    """level jumps over thr dB between 50 ms windows (louder channel, ignoring windows under floor), read by cause:
    a rise onto a word, a rise onto an SFX onset, a fall (a word's or a sound's end)"""
    w = win_db(x)
    d = np.diff(w)
    idx = np.where((np.abs(d) > thr) & (np.maximum(w[:-1], w[1:]) > floor))[0]
    ups = [(i + 1) * 0.05 for i in idx if d[i] > 0]
    so, fo = np.array(sorted(speech_on) or [-99.0]), np.array(sorted(sfx_on) or [-99.0])
    near = lambda t, arr: float(np.min(np.abs(arr - t))) < 0.15
    at_word = [t for t in ups if near(t, so)]
    at_sfx = [t for t in ups if not near(t, so) and near(t, fo)]
    other = [round(t, 2) for t in ups if not near(t, so) and not near(t, fo)]
    return {'count': int(len(idx)), 'rising': len(ups), 'rising_at_a_word': len(at_word), 'rising_at_an_sfx': len(at_sfx),
            'rising_other': other, 'falling': int(len(idx) - len(ups))}


def runs_of(x, thr=-55.0, gap=0.3):
    w = win_db(x)
    on = w > thr
    rr, cur = [], None
    for i, v in enumerate(list(on) + [False]):
        if v and cur is None:
            cur = i
        if not v and cur is not None:
            rr.append([cur * 0.05, (i - cur) * 0.05])
            cur = None
    merged = []
    for a, d in rr:
        if merged and a - (merged[-1][0] + merged[-1][1]) < gap:
            merged[-1][1] = a + d - merged[-1][0]
        else:
            merged.append([a, d])
    return [[round(a, 2), round(d, 2)] for a, d in merged]


# ------------------------------------------------------------------ small-speaker chains
def _peq(f0, gain_db, q):
    A = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    al = np.sin(w0) / (2 * q)
    b = np.array([1 + al * A, -2 * np.cos(w0), 1 - al * A])
    a = np.array([1 + al / A, -2 * np.cos(w0), 1 - al / A])
    return np.concatenate([b / a[0], a / a[0]])[None, :]


def _chain(hp_hz, hp_o, lp_hz, lp_o, pk_hz, pk_db, q):
    return np.vstack([signal.butter(hp_o, hp_hz, 'high', fs=SR, output='sos'),
                      signal.butter(lp_o, lp_hz, 'low', fs=SR, output='sos'), _peq(pk_hz, pk_db, q)])


DEVICE = {
    'stream': _chain(150, 2, 7000, 2, 3000, 2.0, 0.9),    # his stream's mic and encode (S7.13's insert)
    'stage': _chain(110, 2, 9000, 2, 2800, 2.5, 0.8),     # v3.2 22.01: DevDay's PA in a hall (reflections added below)
    'call': _chain(300, 4, 3400, 4, 1700, 3.0, 1.0),       # a video call's codec and a laptop speaker
    'phone': _chain(500, 4, 3400, 4, 2000, 2.0, 1.0),      # a phone held at arm's length (sc 8's POV)
    'laptop': _chain(280, 4, 5500, 2, 2200, 2.5, 1.0),
    'monitor': _chain(180, 2, 6500, 2, 2500, 2.0, 0.9),    # a desktop monitor's speakers
}


# ------------------------------------------------------------------ envelopes
def duck_env(speech, N, pre=0.25, post=0.1, hold=2.5, att=0.2, rel=0.6):
    """the lock mixer's duck, 0..1 per sample"""
    CR = 1000
    n = int(N / SR * CR) + 2
    spans = []
    for a, b in sorted(speech):
        s = [a - pre, b + post]
        if spans and s[0] - spans[-1][1] < hold:
            spans[-1][1] = max(spans[-1][1], s[1])
        else:
            spans.append(s)
    u = np.zeros(n)
    t = np.arange(n) / CR
    for a, b in spans:
        i0, i1 = max(0, int((a - att) * CR)), min(n, int(np.ceil((b + rel) * CR)))
        tt = t[i0:i1]
        v = np.where(tt < a, (tt - (a - att)) / att, np.where(tt > b, 1 - (tt - b) / rel, 1.0))
        u[i0:i1] = np.maximum(u[i0:i1], np.clip(v, 0, 1))
    return np.interp(np.arange(N) / SR, t, u).astype('float32'), spans


def mood_depth(g):
    """dB of duck per beat from its mood heading"""
    out = []
    for i, b in enumerate(g.beats):
        m = g.mood(i)
        d = next((v for k, v in DUCK_BY_MOOD if m.startswith(k)), DUCK_DEFAULT)
        out.append((g.starts[i][0], g.starts[i][1], d, m.split(' · ')[0][:40]))
    return out


def cue_duck_overrides(cues):
    """[(t0, t1, dB)] from a cue sheet's duck_db fields"""
    out = []
    def grab(o, t0, t1):
        v = o.get('duck_db', (o.get('mix') or {}).get('duck_db') if isinstance(o.get('mix'), dict) else None)
        if v is not None and t0 is not None:
            out.append((float(t0), float(t1), float(v)))
    for c in cues.get('cues', []) or []:
        w = (c.get('laid') or {}).get('window') if isinstance(c.get('laid'), dict) else None
        grab(c, c.get('start', w[0] if w else None), c.get('end', w[1] if w else None))
    for key in ('rows', 'sections'):
        for r in cues.get(key, []) or []:
            grab(r, r.get('start'), r.get('end'))
    for r in (cues.get('measured') or {}).get('sections', []) or []:
        grab(r, r.get('start'), r.get('end'))
    return out


def designed_silences(cues):
    out = []
    for key in ('silences', 'silences_designed'):
        for s in cues.get(key, []) or []:
            if s.get('t0') is not None:
                out.append((float(s['t0']), float(s['t1']), str(s.get('what') or s.get('why') or '')))
    return out


# ------------------------------------------------------------------ the takes
_TAKE_LUFS = {}


def take(path):
    x, sr = sf.read(os.path.join(ROOT, path), always_2d=True, dtype='float32')
    assert sr == SR, (path, sr)
    return x[:, 0] if x.shape[1] == 1 else x.mean(axis=1)


def take_lufs(path):
    if path not in _TAKE_LUFS:
        _TAKE_LUFS[path] = lufs(np.stack([take(path)] * 2, 1) * 0.7071)
    return _TAKE_LUFS[path]


def dialogue(g, variant, qa):
    N = g.N
    bus = np.zeros((N, 2), 'float32')
    speech, info = [], {'lines': 0, 'device': {}, 'el_matched': 0, 'missing': []}
    for i, b in enumerate(g.beats):
        s0 = g.starts[i][0]
        for l in b['lines']:
            if not l.get('audio') or not os.path.exists(os.path.join(ROOT, l['audio'])):
                info['missing'].append(l['id'])
                continue
            x = take(l['audio']).astype('float64')
            gain = 0.0
            kref = l.get('kokoro_audio') or (l.get('kokoro') or {}).get('audio')
            if variant == 'el' and kref and os.path.exists(os.path.join(ROOT, kref)):
                ref, own = take_lufs(kref), take_lufs(l['audio'])
                if ref > -90 and own > -90:
                    gain = ref - own
                    info['el_matched'] += 1
            dev = l.get('tag') if l.get('tag') in SMALL else ('phone' if b.get('room') == 'phone' else None)
            on_ = s0 + l['t']
            if b['id'] == 'v31-32.01d' and dev and 26 / FPS <= l['t'] <= 151 / FPS:
                dev = None                         # the demo film has opened up to full range (runway.md §7, i22-26)
            if b['id'] == 'S7.13' and (g.starts[i][1] - s0) > 10.5 and 128 / FPS <= l['t'] < 252 / FPS:
                dev = 'stream'                     # Ttemme talks to his chat: "through his stream" (runway.md §11.6)
            if dev:
                pre = lufs(np.stack([x, x], 1) * 0.7071)
                y = signal.sosfilt(DEVICE[dev], x)
                if dev == 'stage':                 # the hall answering the PA
                    rv = np.zeros_like(y)
                    for d_, g_ in ((0.037, -9), (0.083, -12), (0.141, -15), (0.23, -19)):
                        k_ = int(d_ * SR)
                        rv[k_:] += y[:-k_] * db(g_)
                    y = y + signal.sosfilt(signal.butter(2, 4500, 'low', fs=SR, output='sos'), rv)
                post = lufs(np.stack([y, y], 1) * 0.7071)
                x = y * db(pre - post - 1.0) if pre > -90 and post > -90 else y
                info['device'][dev] = info['device'].get(dev, 0) + 1
            on = s0 + l['t']
            if l.get('cut'):                           # an interrupted line stops where it's cut off
                k = int((l.get('in', 0) + l['dur'] + 0.015) * SR)
                x = x[:k].copy()
                f = min(len(x), int(0.015 * SR))
                x[len(x) - f:] *= np.linspace(1, 0, f)
            if l.get('tag') == 'V.O.' and VO_GAIN_DB:
                gain += VO_GAIN_DB
            y = (np.stack([x, x], 1) * 0.7071 * db(gain)).astype('float32')
            S.add(bus, y, on - l.get('in', 0))
            speech.append((on, on + l['dur']))
            info['words'] = info.get('words', []) + ([on + w[1] for w in l.get('words', []) if len(w) >= 2] or [on])
            info['lines'] += 1
    return bus, sorted(speech), info


# ------------------------------------------------------------------ one segment, up to the master
def premix(name, g, variant, use_score=True):
    N = g.N
    qa = {'segment': name, 'variant': variant, 'seconds': round(g.total, 3), 'frames': g.frames, 'samples': N,
          'timeline': os.path.relpath(g.path, ROOT) if g.path else None}
    sd = os.path.join(ROOT, S.VARIANTS[variant]['out'])
    ext = S.VARIANTS[variant]['ext']
    room = sf.read(os.path.join(sd, f'{name}-room.{ext}'), dtype='float32', always_2d=True)[0]
    fx = sf.read(os.path.join(sd, f'{name}-sfx.{ext}'), dtype='float32', always_2d=True)[0]
    assert len(room) == N and len(fx) == N, (name, len(room), len(fx), N)
    if name == 'card':
        qa['layers'] = {'rooms': 'the card room stem', 'sfx': 'none', 'dialogue': 'none', 'score': 'none'}
        return dict(qa=qa, mix=(room + fx), noscore=(room + fx), mus=None, speech=[], spans=[],
                    stats={'dlg': None, 'room': lufs(room), 'sfx': lufs(fx)})
    dlg, speech, dinfo = dialogue(g, variant, qa)
    qa['dialogue'] = dinfo
    u, spans = duck_env(speech, N)
    dip = ROOM_DIP.get(name, ROOM_DIP_DEFAULT)
    room = room * db(-dip * u)[:, None].astype('float32')
    qa['rooms'] = {'stem': os.path.relpath(os.path.join(sd, f'{name}-room.{ext}'), ROOT), 'dip_under_speech_db': dip}
    qa['sfx'] = {'stem': os.path.relpath(os.path.join(sd, f'{name}-sfx.{ext}'), ROOT), 'ducked': False}
    mus = None
    why = []
    wav, cues_p = S.score_files(name, variant, why)
    sq = {'file': os.path.relpath(wav, ROOT) if wav else None, 'cues': os.path.relpath(cues_p, ROOT) if cues_p else None}
    if why:
        sq['not_this_lock'] = why
    if wav and abs(sf.info(wav).frames - N) > SR // FPS + 1:             # more than a frame out: not this cut
        sq['not_this_lock'] = why + [f'{os.path.relpath(wav, ROOT)} is {sf.info(wav).frames / SR:.3f} s, the segment {N / SR:.3f} s']
        wav = None
    if wav and use_score:
        m, sr = sf.read(wav, dtype='float32', always_2d=True)
        if sr != SR:
            m = signal.resample_poly(m, SR, sr, axis=0).astype('float32')
            sq['resampled_from'] = sr
        if m.shape[1] == 1:
            m = np.repeat(m, 2, axis=1)
        sq['length_s'] = round(len(m) / SR, 3)
        sq['length_vs_segment_s'] = round((len(m) - N) / SR, 3)
        mus = np.zeros((N, 2), 'float32')
        mus[:min(N, len(m))] = m[:N]
        if name == 'tag':                 # Act Four's vault pedal, released past its last frame (its composer's hand-off)
            rw, _ = S.score_files('act4', variant)
            ro = rw.replace('.wav', '-ringout.wav') if rw else None
            if ro and os.path.exists(ro):
                r_, rsr = sf.read(ro, dtype='float32', always_2d=True)
                if rsr == SR:
                    r_ = (r_ if r_.shape[1] == 2 else np.repeat(r_, 2, axis=1)).copy()
                    # the crossfade: the release plays from the tag's first sample (continuing Act Four's last one),
                    # then fades out (equal power) over 2.5 s from the tag score's first entry, under its felt
                    w_ = win_db(mus[: 10 * SR], 0.01)
                    t_in = float(np.argmax(w_ > -50) * 0.01) if np.any(w_ > -50) else 0.0
                    i_in, k_ = int(t_in * SR), int(2.5 * SR)
                    gx = np.ones(len(r_), 'float32')
                    seg_ = np.clip((np.arange(len(r_)) - i_in) / k_, 0, 1)
                    gx = np.cos(0.5 * np.pi * seg_).astype('float32')
                    r_ *= gx[:, None]
                    mus[:min(N, len(r_))] += r_[:N]
                    sq['act4_ringout'] = {'file': os.path.relpath(ro, ROOT), 'seconds': round(len(r_) / SR, 2),
                                          'crossfade': f'full from 0 s, out (equal power) over 2.5 s from the tag score\'s entry at {t_in:.2f} s',
                                          'why': "the act4 score's hand-off and the lead's note: the vault pedal's release at the "
                                                 "tag's head, crossfading under the tag's own score, so the seam doesn't cut it"}
        if SCORE_GAIN_DB.get(name):
            mus *= np.float32(db(SCORE_GAIN_DB[name]))
            sq['gain_db'] = SCORE_GAIN_DB[name]
            sq['gain_why'] = "the lead's ruling (2026-09-27): onto the -20 LUFS underscore reference"
        cues = {}
        if cues_p:
            try:
                cues = json.load(open(cues_p))
            except Exception as ex:
                sq['cues_error'] = f'{ex.__class__.__name__}: {ex}'
        sq['lufs_as_delivered'] = round(lufs(m[:N]), 2)
        sq['lufs_after_gain'] = round(lufs(mus), 2)
        # the duck depth: the mood per beat, the cue sheet's duck_db over it, smoothed 1.5 s
        CR = 100
        n = int(N / SR * CR) + 2
        depth = np.full(n, DUCK_DEFAULT)
        md = mood_depth(g)
        for a, b, d, _ in md:
            depth[int(a * CR):int(b * CR) + 1] = d
        ov = cue_duck_overrides(cues)
        for a, b, d in ov:
            depth[int(a * CR):int(b * CR) + 1] = d
        depth = ndimage.uniform_filter1d(depth, size=int(1.5 * CR))
        dep = np.interp(np.arange(N) / SR, np.arange(n) / CR, depth).astype('float32')
        # silent posts: -3 dB when nobody speaks
        pt = np.zeros(N, 'float32')
        for i, b in enumerate(g.beats):
            for o in b.get('onscreen', []):
                if o['text'].startswith('POST:'):
                    a = g.starts[i][0] + o['at']
                    e = g.starts[i][0] + o['until'] if o.get('until') is not None else g.starts[i][1]
                    pt[int(a * SR):int(e * SR)] = 1.0
        pt = ndimage.uniform_filter1d(pt, size=int(0.5 * SR))
        gdb = -dep * u - 3.0 * pt * (1 - u)
        mus *= db(gdb)[:, None].astype('float32')
        sq['duck'] = {'by_mood_db': sorted({(m_, d) for _, _, d, m_ in md}, key=lambda z: z[1]),
                      'cue_sheet_overrides': ov, 'posts_dip_db': -3.0,
                      'envelope': 'pre 0.25 s, joined across gaps < 2.5 s, 0.2 s in, 0.6 s out; depth smoothed 1.5 s'}
        sq['designed_silences'] = designed_silences(cues)
    elif wav:
        sq['used'] = False
    else:
        sq['missing'] = True
    qa['score'] = sq
    # the act breaks: the score enters on the act's first frame over a black; fade it in (the lead, v3.1)
    if mus is not None and SCORE_HEAD_FADE.get(name):
        hits = designed_hits(cues, SCORE_HEAD_FADE[name] + 0.25)
        fd = 0.04 if hits else SCORE_HEAD_FADE[name]          # a designed hit on the act's head keeps its attack
        k = int(fd * SR)
        mus[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2).astype('float32')[:, None]
        sq['head_fade_s'] = fd
        if hits:
            sq['head_fade_why'] = f'designed hit at the head (cues.json designed_hit): {hits[0]}'
    # the one silence: the score gated to zero from the Remove (v3.1) / Cancel (v3) click to the buzz
    ck = S.silence_click(g)
    if name == 'act4' and ck and g.has('S1.11'):
        z = [s_['at'] for s_ in g.beats[g.BI['S1.11']].get('sounds', []) if s_['name'] in ('BUZZ', 'phone_buzz_desk')]
        loc = lambda bid, d: g.starts[g.BI[bid]][0] + d          # the segment's own clock
        ta, tb = loc(ck[0], ck[1]), loc('S1.11', z[0] if z else 0.3)
        ia, ib = int(round(ta * SR)), int(round(tb * SR))
        sil = {'click_beat': ck[0], 'click': round(ta, 3), 'buzz': round(tb, 3), 'seconds': round(tb - ta, 3)}
        if mus is not None:
            seg_ = mus[ia:ib]
            sil['score_peak_before_gate_dbfs'] = round(20 * np.log10(float(np.abs(seg_).max()) + 1e-12), 1)
            k = int(0.012 * SR)
            mus[ia - k:ia] *= np.linspace(1, 0, k, dtype='float32')[:, None]
            mus[ia:ib] = 0.0
        qa['silence'] = sil
    # score rides (the score makes room for a featured sound)
    if mus is not None:
        for bid, d0, d1, gdb_, why_ in SCORE_RIDE.get(name, []):
            if g.has(bid):
                a_ = g.starts[g.BI[bid]][0] + d0
                b_ = g.starts[g.BI[bid]][1] if d1 == 'end' else g.starts[g.BI[bid]][0] + d1
                tt = np.arange(N) / SR
                mus *= db(np.interp(tt, [a_ - 0.6, a_, b_, b_ + 0.6], [0, gdb_, gdb_, 0])).astype('float32')[:, None]
                sq.setdefault('rides', []).append({'beat': bid, 'from': round(a_, 2), 'to': round(b_, 2), 'db': gdb_, 'why': why_})
    # the set pieces rise: +2-3 LU over the talk (mood-analysis §4 #3; the lead, v3.1)
    mus, fx = setpieces(name, g, dlg, room, fx, mus, speech, qa)
    qa['checks'] = sound_checks(name, g, variant, fx, room, mus, speech)
    body = dlg + room + fx
    mix = body + (mus if mus is not None else 0.0)
    stats = {'dlg': lufs(dlg) if np.any(dlg) else None, 'room': lufs(room), 'sfx': lufs(fx)}
    return dict(qa=qa, mix=mix.astype('float32'), noscore=body.astype('float32'), mus=mus, speech=speech, spans=spans,
                stats=stats)


def sound_checks(name, g, variant, fx, room, mus, spans):
    """named moments: the SFX stem against the bed (rooms + score) where nobody speaks (the lines' own spans), dB RMS
    in the sound's own band (gain-free ratios; a band the score leaves open is where a small sound is heard)"""
    loc = lambda bid, d=0.0: g.starts[g.BI[bid]][0] + d
    end = lambda bid, d=0.0: g.starts[g.BI[bid]][1] + d
    sq = os.path.join(ROOT, S.VARIANTS[variant]['out'], f'{name}-stems-qa.json')
    stq = json.load(open(sq)) if os.path.exists(sq) else {}
    W = []
    try:
        KEYS, PEN, LAPS, CHIP = (1000, 5000), (3000, 9000), (300, 2000), (300, 3000)
        if name == 'act3':
            W.append(("Gerg's keys down the line, 20.06 (loud)", loc('20.06'), end('20.06'), KEYS))
            W.append(('the LEDs out, 20.02 (the quiet beat): the room in the ticks\' band', loc('20.02'), end('20.02'), (2500, 4500)))
            W.append(('the LEDs on, 20.01 (for comparison)', loc('20.01'), end('20.01'), (2500, 4500)))
        if name == 'act4':
            ks = (stq.get('keys_stop') or {}).get('at')
            W.append(("Gerg's keys at 2 AM, S5.09 (the tile opens)", loc('S5.09', 2.8), end('S5.09'), KEYS))
            if ks:
                W.append(("Gerg's keys, S5.09-back (typing hard)", loc('S5.09-back'), ks, KEYS))
                W.append(('after "His keys stop." (the first second of his look)', ks + 0.05, ks + 1.0, KEYS))
            W.append(('the practice laps under S1.01 (after the crane)', loc('S1.01', 2.6), end('S1.01'), LAPS))
        if name == 'act4' and g.has('v31-S1.01b'):
            W.append(('the practice lap the Orb follows (S1.01b)', loc('v31-S1.01b'), end('v31-S1.01b'), LAPS))
        if name == 'act4' and g.has('S7.13') and end('S7.13') - loc('S7.13') > 10.5:
            W.append(('the hourglass shatter (S7.13 k173-180)', loc('S7.13', 173 / FPS), loc('S7.13', 180 / FPS), (500, 9000)))
        if name == 'tag' and g.has('v31-32.01d'):
            W.append(("the demo film's bed, opened up (i26-136)", loc('v31-32.01d', 26 / FPS), loc('v31-32.01d', 136 / FPS), (200, 12000)))
            W.append(('the stills (i151-198): the room faint', loc('v31-32.01d', 152 / FPS), loc('v31-32.01d', 198 / FPS), (60, 12000)))
        if name == 'act1' and g.has('v31-10.03'):
            W.append(("Sydney's egg timer (10.03-10.04)", loc('v31-10.03', 1.2), end('v31-10.04'), (2000, 7000)))
        if name == 'act1':
            W.append(("the Build's pre-lap (the last 0.6 s of 9.13)", loc('11.01', -0.6), loc('11.01'), CHIP))
            W.append(('the pen leading 12.04', loc('12.04', -0.5), loc('12.04'), PEN))
    except KeyError:
        pass
    out = []
    for label, a, b, band in W:
        i0, i1 = int(a * SR), int(b * SR)
        mask = np.ones(i1 - i0, bool)
        for s0, s1 in spans:
            mask[max(0, int(s0 * SR) - i0):max(0, min(i1 - i0, int(s1 * SR) - i0))] = False
        whole = mask.sum() < SR // 20
        if whole:
            mask[:] = True
        sos = signal.butter(2, band, 'band', fs=SR, output='sos')
        pad = int(0.2 * SR)
        def rms(x):
            if x is None:
                return None
            y = signal.sosfilt(sos, x[max(0, i0 - pad):i1].astype('float64'), axis=0)[i0 - max(0, i0 - pad):]
            return round(float(20 * np.log10(np.sqrt(np.mean(y[mask] ** 2)) + 1e-12)), 1)
        bed = room + (mus if mus is not None else 0.0)
        r = {'what': label, 'from': round(a, 2), 'to': round(b, 2), 'band_hz': list(band),
             'unspoken_s': round(mask.sum() / SR, 2) if not whole else 'none: measured over the whole window',
             'sfx_rms': rms(fx), 'room_rms': rms(room), 'score_rms': rms(mus), 'bed_rms': rms(bed)}
        r['sfx_minus_bed_db'] = round(r['sfx_rms'] - r['bed_rms'], 1)
        out.append(r)
    return out


SEAM_S = 2.0
PREV = {'act1': 'card', 'act2': 'act1', 'act3': 'act2', 'act4': 'act3', 'tag': 'act4'}   # back to back on the episode clock


SCORE_HEAD_FADE = {'act1': 1.0, 'act2': 1.2, 'act3': 1.2, 'act4': 1.2}   # s: the score's fade-in at an act's head
# score rides: the score makes room for a featured sound (beat, from, to or 'end', dB)
SCORE_RIDE = {'act4': [('v31-S1.01b', 0.0, 'end', -4.0, 'the practice lap the Orb follows: the score makes room for it')]}
LIFT_LU = 2.5                                             # the set pieces' peak over the talk (mood-analysis §4 #3)
LIFT_MAX = {'st': 6.0, 'mom': 9.0}                      # dB: a short hit (the shatter) may take more
# gain rows (v3.3): (what, (beat, s), (beat, s or ('sound', name)), LU): after the set-piece lift, the window's mean
# short-term loudness is raised by LU, score and SFX only. X6: the avalanche +1.5-2 LU over its 14 s (mood-analysis-v32
# §4 #3); the score's own -2 dB ride stays
GAIN_ROWS = {'act4': [('the avalanche (X6)', ('S6.01', 0.0), ('S6.06', ('sound', 'freeze_hit_F')), 1.75)]}
SETPIECES = {   # (what, (beat, s), (beat, s or 'end' or ('sound', name)), measure): 'st' = 3 s short-term, 'mom' = 400 ms
    'act1': [('the odometer', ('5.12', 0.0), ('6.06', 'end'), 'st')],
    'act4': [('the avalanche', ('S6.01', 0.0), ('S6.06', ('sound', 'freeze_hit_F')), 'st'),
             ('the hourglass shatter', ('S7.13', ('sound', 'hourglass_shatter')), ('S7.13', ('sound+', 'hourglass_shatter', 0.5)), 'mom')],
}


def designed_hits(cues, within):
    """[(t, text)] of every entry the cue sheet marks designed_hit (any schema), at or before `within` seconds"""
    out = []

    def take(o):
        t = next((o[k] for k in ('t', 'at', 'start', 't0') if isinstance(o.get(k), (int, float))), None)
        if t is not None and t <= within:
            out.append((round(float(t), 3), str(o.get('what') or o.get('why') or '')[:80]))

    def walk(o):
        if isinstance(o, dict):
            dh = o.get('designed_hit')
            if isinstance(dh, list):           # a list of hits (composer X's v3.2 sheets)
                for e in dh:
                    if isinstance(e, dict):
                        take(e)
            elif dh:                           # a flag on the entry itself
                take(o)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(cues or {})
    return sorted(out)


def loudness_curve(x, win):
    """loudness every 100 ms over win-second windows (LUFS), with the window centres"""
    y = kweight(x) ** 2
    e = y.sum(axis=1)
    c = np.concatenate([[0.0], np.cumsum(e)])
    n, h = int(win * SR), int(0.1 * SR)
    if len(e) < n:
        return np.array([]), np.array([])
    idx = np.arange(0, len(e) - n + 1, h)
    return (idx + n / 2) / SR, -0.691 + 10 * np.log10((c[idx + n] - c[idx]) / n + 1e-20)


def setpieces(name, g, dlg, room, fx, mus, speech, qa):
    """lift the score and the SFX in each set piece until its peak loudness is LIFT_LU over the segment's talk (the
    median 3 s loudness where lines cover most of the window); the dialogue is not lifted"""
    if name not in SETPIECES and name not in GAIN_ROWS:
        return mus, fx
    N = len(fx)
    mix0 = dlg + room + fx + (mus if mus is not None else 0.0)
    tc, st_ = loudness_curve(mix0, 3.0)
    cov = np.zeros(N, bool)
    for a, b in speech:
        cov[max(0, int(a * SR)):int(b * SR)] = True
    cc = np.concatenate([[0], np.cumsum(cov)])
    n3 = int(3.0 * SR)
    frac = [(cc[min(N, int((t + 1.5) * SR))] - cc[max(0, int((t - 1.5) * SR))]) / n3 for t in tc]
    talk = [v for v, f in zip(st_, frac) if f >= 0.6]
    if len(talk) < 5:
        return mus, fx
    talk_ref = float(np.median(talk))
    out = []

    def when(spec):
        bid, v = spec
        if not g.has(bid):
            return None
        s0, s1 = g.starts[g.BI[bid]]
        if v == 'end':
            return s1
        if isinstance(v, tuple):
            at = next((sd['at'] for sd in g.beats[g.BI[bid]].get('sounds', []) if sd['name'] == v[1]), None)
            return None if at is None else s0 + at + (v[2] if v[0] == 'sound+' else 0.0)
        return s0 + v
    for what, sa, sb, meas in SETPIECES.get(name, []):
        a, b = when(sa), when(sb)
        if a is None or b is None or b <= a:
            continue
        if meas == 'mom':
            a, b = a - 0.05, b
        rec = {'what': what, 'from': round(a, 2), 'to': round(b, 2), 'talk_lufs': round(talk_ref, 2), 'measure': meas}
        total = 0.0
        for it in range(3):
            m_ = dlg + room + fx + (mus if mus is not None else 0.0)
            seg0, seg1 = max(0, int((a - 1.6) * SR)), min(N, int((b + 1.6) * SR))
            tcw, lw = loudness_curve(m_[seg0:seg1], 3.0 if meas == 'st' else 0.4)
            tcw = tcw + seg0 / SR
            sel = (tcw >= a) & (tcw <= b)
            if not sel.any():
                break
            peak = float(lw[sel].max())
            if it == 0:
                rec['peak_before_lufs'] = round(peak, 2)
            need = talk_ref + LIFT_LU - peak
            if need < 0.3 or total >= LIFT_MAX[meas]:
                break
            step = min(need, LIFT_MAX[meas] - total)
            total += step
            ramp = 0.1 if meas == 'mom' else 0.6
            tt = np.arange(N) / SR
            gcurve = np.interp(tt, [a - ramp, a, b, b + ramp], [0, 1, 1, 0]).astype('float32')
            gl = (1 + (db(step) - 1) * gcurve).astype('float32')[:, None]
            fx = fx * gl
            if mus is not None:
                mus = mus * gl
        rec['lift_db'] = round(total, 2)
        m_ = dlg + room + fx + (mus if mus is not None else 0.0)
        seg0, seg1 = max(0, int((a - 1.6) * SR)), min(N, int((b + 1.6) * SR))
        tcw, lw = loudness_curve(m_[seg0:seg1], 3.0 if meas == 'st' else 0.4)
        sel = ((tcw + seg0 / SR) >= a) & ((tcw + seg0 / SR) <= b)
        rec['peak_after_lufs'] = round(float(lw[sel].max()), 2) if sel.any() else None
        rec['over_talk_lu'] = round(rec['peak_after_lufs'] - talk_ref, 2) if rec['peak_after_lufs'] is not None else None
        out.append(rec)
    qa['setpieces'] = out
    rows = []
    for what, sa, sb, lu in GAIN_ROWS.get(name, []):
        a, b = when(sa), when(sb)
        if a is None or b is None or b <= a:
            continue

        def mean_st(m_):
            tcw, lw = loudness_curve(m_[max(0, int(a * SR)):min(N, int(b * SR))], 3.0)
            return float(-0.691 + 10 * np.log10(np.mean(10 ** ((lw + 0.691) / 10)))) if len(lw) else None
        l0 = mean_st(dlg + room + fx + (mus if mus is not None else 0.0))
        if l0 is None:
            continue
        total = 0.0
        for it in range(4):
            cur = mean_st(dlg + room + fx + (mus if mus is not None else 0.0))
            need = l0 + lu - cur
            if abs(need) < 0.1 or total >= 4.0:
                break
            step = min(need * 1.05, 4.0 - total)
            total += step
            tt = np.arange(N) / SR
            gcurve = np.interp(tt, [a - 0.6, a, b, b + 0.3], [0, 1, 1, 0]).astype('float32')
            gl = (1 + (db(step) - 1) * gcurve).astype('float32')[:, None]
            fx = fx * gl
            if mus is not None:
                mus = mus * gl
        after = mean_st(dlg + room + fx + (mus if mus is not None else 0.0))
        rows.append({'what': what, 'from': round(a, 2), 'to': round(b, 2), 'target_lu': lu, 'mean_before_lufs': round(l0, 2),
                     'mean_after_lufs': round(after, 2), 'lift_lu': round(after - l0, 2), 'gain_db': round(total, 2)})
    if rows:
        qa['gain_rows'] = rows
    return mus, fx


def master(mix, gain_db, head_from=None):
    """gain (with a SEAM_S ramp from the previous chapter's gain at the head, so a sound crossing the seam doesn't
    step), the limiter, the true-peak check"""
    if head_from is None or abs(head_from - gain_db) < 0.01:
        y = (mix * db(gain_db)).astype('float32')
    else:
        k = min(len(mix), int(SEAM_S * SR))
        g = np.full(len(mix), gain_db, 'float64')
        g[:k] = head_from + (gain_db - head_from) * np.linspace(0, 1, k)
        y = (mix * db(g)[:, None]).astype('float32')
    ceil = CEIL
    for _ in range(4):
        z, lim_s = limiter(y, ceil)
        tp = true_peak(z)
        if tp <= TP_MAX:
            return z, lim_s, tp, ceil
        ceil -= (tp - TP_MAX) + 0.1
    return z, lim_s, tp, ceil


def label_hole(name, g, a, d, extra):
    for b0, b1, why in DESIGNED.get(name, []):
        if g.has(b0) and g.has(b1):
            lo, hi = g.starts[g.BI[b0]][0] - 0.3, g.starts[g.BI[b1]][1] + 0.3
            if lo <= a and a + d <= hi:
                return 'designed: ' + why
    for t0, t1, why in extra:
        if t0 - 0.3 <= a and a + d <= t1 + 0.3:
            return 'designed: ' + why
    i = max(0, np.searchsorted([s for s, _ in g.starts], a, side='right') - 1) if g.starts else 0
    return f'UNMARKED (in beat {g.beats[i]["id"]})' if g.beats else 'UNMARKED'


def measure(name, g, P, gain, out, lim_s, tp, ceil):
    qa = P['qa']
    y = out
    sp_on = ((qa.get('dialogue') or {}).pop('words', None) or []) + [a for a, _ in P['speech']]
    m = {'lufs_i': round(lufs(y), 2), 'true_peak_dbtp': round(tp, 2),
         'sample_peak_dbfs': round(20 * np.log10(float(np.abs(y).max()) + 1e-12), 2), 'lra_lu': lra(y),
         'gain_db': round(gain, 2), 'limiter_ceiling_dbfs': round(ceil, 2), 'limiter_active_s': round(lim_s, 3)}
    gl = db(gain)
    if P['stats']['dlg'] is not None:
        m['dialogue_lufs'] = round(P['stats']['dlg'] + gain, 2)
    if P['mus'] is not None:
        mu = P['mus'] * gl
        m['score_lufs_after_duck'] = round(lufs(mu), 2)
        mask = np.zeros(len(y), bool)
        for a, b in P.get('spans', []):
            mask[max(0, int(a * SR)):int(b * SR)] = True
        if mask.any() and (~mask).any():
            m['score_rms_under_speech_dbfs'] = round(float(20 * np.log10(np.sqrt(np.mean(mu[mask].astype('float64') ** 2)) + 1e-12)), 1)
            m['score_rms_between_speech_dbfs'] = round(float(20 * np.log10(np.sqrt(np.mean(mu[~mask].astype('float64') ** 2)) + 1e-12)), 1)
        rr = runs_of(mu)
        m['score_runs'] = {'count': len(rr), 'shortest_s': min((d for _, d in rr), default=None), 'runs': rr}
    m['rooms_lufs'] = round(P['stats']['room'] + gain, 2) if P['stats']['room'] > -90 else None
    m['sfx_lufs'] = round(P['stats']['sfx'] + gain, 2) if P['stats']['sfx'] > -90 else None
    extra = []
    hl = holes(y)
    m['holes_under_-42dBFS_0.3s'] = [dict(at=a, s=d, what=label_hole(name, g, a, d, extra)) for a, d in hl]
    m['holes_mono_downmix'] = [dict(at=a, s=d, what=label_hole(name, g, a, d, extra)) for a, d in holes(y, mono=True)]
    ns = (P['noscore'] * gl).astype('float32')
    m['holes_without_score'] = [dict(at=a, s=d, what=label_hole(name, g, a, d, extra)) for a, d in holes(ns)]
    m['unmarked_holes'] = sum(1 for h in m['holes_under_-42dBFS_0.3s'] if h['what'].startswith('UNMARKED'))
    m['unmarked_holes_without_score'] = sum(1 for h in m['holes_without_score'] if h['what'].startswith('UNMARKED'))
    sq = os.path.join(ROOT, S.VARIANTS[qa['variant']]['out'], f'{name}-stems-qa.json')
    sfx_on = [r[2] for r in json.load(open(sq)).get('sfx', [])] if os.path.exists(sq) else []
    if os.path.exists(sq):
        sfx_on += [a_['at'] for a_ in json.load(open(sq)).get('added', []) if isinstance(a_.get('at'), (int, float))]
    m['jumps_over_15dB'] = jumps(y, sp_on, sfx_on)
    if 'silence' in qa:
        s_ = qa['silence']
        seg_ = y[int(s_['click'] * SR) + int(0.07 * SR):int(s_['buzz'] * SR)]
        if len(seg_):
            w = win_db(seg_)
            s_['mix_in_window_dbfs_max_50ms'] = round(float(w.max()), 1)
            s_['mix_in_window_lufs'] = round(lufs(seg_), 1) if len(seg_) > SR // 2 else None
    qa['measured'] = m
    return qa


def outro_mix(variant, tag_gain, outd, tag_wav):
    """THE TAG -> OUTRO SEAM (audit-v31 #4; the lead, v3.2): a copy of the outro's audio for the assembler, with the
    tag's hum held 2 s under its start and crossfaded out, a 150 ms fade-in, and its first hit 6 dB down. The manifest
    plays the outro at its own gain; the hum is laid pre-compensated for that gain, so it continues at the tag's level."""
    tl = S.VARIANTS[variant]['tl']
    mdir = os.path.join(ROOT, os.path.dirname(tl))
    mf = next((os.path.join(mdir, f) for f in sorted(os.listdir(mdir)) if f.endswith('.manifest.json')), None)
    if not mf:
        return None
    ch = next((c for c in json.load(open(mf)).get('chapters', []) if c.get('id') == 'outro'), None)
    src = ((ch or {}).get('audio') or {}).get('src')
    og = float(((ch or {}).get('audio') or {}).get('gain', 0.0))
    if not src or not os.path.exists(os.path.join(ROOT, src)):
        return None
    o, sr = sf.read(os.path.join(ROOT, src), dtype='float64', always_2d=True)
    if sr != SR:
        o = signal.resample_poly(o, SR, sr, axis=0)
    if o.shape[1] == 1:
        o = np.repeat(o, 2, axis=1)
    n = len(o)
    t = np.arange(n) / SR
    w = win_db(o[: 2 * SR], 0.01)
    hit = float(np.argmax(w >= w.max() - 6.0) * 0.01)
    g = np.interp(t, [0, hit + 0.35, hit + 0.85, t[-1]], [-6.0, -6.0, 0.0, 0.0])
    o = o * db(g)[:, None]
    k = int(0.15 * SR)
    o[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    ext = S.VARIANTS[variant]['ext']
    tp = os.path.join(ROOT, S.VARIANTS[variant]['out'], f'tag-tail.{ext}')
    hum_s = 0.0
    if os.path.exists(tp):
        h, _ = sf.read(tp, dtype='float64', always_2d=True)
        h = h[: 2 * SR] * db(tag_gain - og)                    # at the tag's level once the manifest applies og
        m = len(h)
        th = np.arange(m) / SR
        h *= np.interp(th, [0, 0.9, 2.0], [1.0, 1.0, 0.0])[:, None] ** 0.5
        o[:m] += h
        hum_s = round(m / SR, 2)
    pk = float(np.abs(o).max())
    if pk > db(-1.0):
        o *= db(-1.0) / pk
    out = os.path.join(outd, 'outro-mix.wav')
    sf.write(out, o.astype('float32'), SR, subtype='PCM_24')
    # the seam as the assembly will play it: the tag's last 200 / 400 ms against the outro copy's first, at og
    tg, _ = sf.read(tag_wav, dtype='float64', always_2d=True)
    oo = o * db(og)
    rms = lambda x: float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12))
    seam = {'tag_last_200ms_dbfs': round(rms(tg[-int(0.2 * SR):]), 1), 'outro_first_200ms_dbfs': round(rms(oo[: int(0.2 * SR)]), 1),
            'step_200ms_db': round(rms(oo[: int(0.2 * SR)]) - rms(tg[-int(0.2 * SR):]), 1),
            'step_400ms_db': round(rms(oo[: int(0.4 * SR)]) - rms(tg[-int(0.4 * SR):]), 1),
            'outro_0.4-1.0s_dbfs': round(rms(oo[int(0.4 * SR): SR]), 1)}
    return {'file': out, 'source': src, 'manifest': os.path.relpath(mf, ROOT), 'manifest_gain_db': og,
            'hum_s': hum_s, 'first_hit_s': round(hit, 2), 'first_hit_db': -6.0, 'fade_in_s': 0.15, 'seam': seam,
            'for_the_assembler': f'play this file in place of {src}, at the manifest\'s {og:+.0f} dB as before; its first '
                                 f'hit is already -6 dB and the tag\'s hum is in it (no further change)'}


def run(names, variant, use_score=True, report_only=False):
    segs = S.load_segs(variant)
    outd = os.path.join(ROOT, OUT[variant])
    qad = os.path.join(ROOT, QA_DIR, variant)
    os.makedirs(outd, exist_ok=True)
    os.makedirs(qad, exist_ok=True)
    if variant == 'el' and not any(segs[s].variant_used == 'el' for s in SEGS):
        print(f"no ElevenLabs-timed timelines for the {S.LOCK} lock yet ({S.VARIANTS['el']['tl'].format(seg='<seg>')}): "
              f"nothing to mix")
        return None
    hints = S.score_hints(variant, segs)
    if not S.stems_fresh(variant, hints):
        print(f'stems ({variant}) are stale or missing: rebuilding')
        S.build(variant, quiet=False)
    skipped = {}
    order = [s for s in ['coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'] if s in names]
    pre = {}
    for s in order:
        g = segs[s]
        if variant == 'el' and s != 'card' and g.variant_used != 'el':
            skipped[s] = 'no ElevenLabs-timed timeline yet (%s)' % S.VARIANTS['el']['tl'].format(seg=s)
            print(f'  {s}: skipped ({skipped[s]})')
            continue
        t0 = time.time()
        P = premix(s, g, variant, use_score)
        P['lufs_pre'] = lufs(P['mix'])
        P['dlg_pre'] = P['stats']['dlg']
        pre[s] = P
        print(f'  {s}: premix {g.total:.2f} s, {P["lufs_pre"]:.2f} LUFS pre-master, score '
              f'{"MISSING" if (P["qa"].get("score") or {}).get("missing") else ((P["qa"].get("score") or {}).get("file") or "-")} '
              f'({time.time() - t0:.0f} s)')
    # gains: -16 LUFS each, then the dialogue guard
    gains, guard = {}, {}
    for s, P in pre.items():
        if s != 'card':
            gains[s] = TARGET - P['lufs_pre']
    rep_p = os.path.join(qad, 'loudness-report.json')
    dl = {s: pre[s]['dlg_pre'] + gains[s] for s in gains if pre[s]['dlg_pre'] is not None}
    if len([s for s in SEGS if s in dl]) >= 4:
        ref = statistics.median(dl[s] for s in SEGS if s in dl)
        ref_src = 'this run'
    elif os.path.exists(rep_p):
        ref = json.load(open(rep_p)).get('dialogue_reference_lufs')
        ref_src = 'the last full run'
    else:
        ref, ref_src = None, None
    if ref is not None:
        for s in list(gains):
            if s in dl and dl[s] > ref + GUARD_LU:
                cut = dl[s] - (ref + GUARD_LU)
                gains[s] -= cut
                guard[s] = round(-cut, 2)
    if 'card' in pre:
        gains['card'] = gains.get('act1')
        if gains['card'] is None and os.path.exists(rep_p):
            gains['card'] = (json.load(open(rep_p)).get('segments', {}).get('act1') or {}).get('gain_db')
        if gains['card'] is None:
            gains['card'] = 0.0
    results = {}
    last = json.load(open(rep_p)).get('segments', {}) if os.path.exists(rep_p) else {}
    for s in sorted(pre, key=lambda k: k == 'card'):             # the card last: it takes Act One's final gain
        P = pre[s]
        if s == 'card' and 'act1' in gains:
            gains['card'] = gains['act1']
        pv = PREV.get(s)
        head = (gains.get('act1') if pv == 'card' else gains.get(pv)) if pv else None
        if head is None and pv:
            head = (last.get(pv) or {}).get('gain_db')
        g = segs[s]
        if s == 'card':
            y = (P['mix'] * db(gains[s])).astype('float32')
            lim_s, tp, ceil = 0.0, true_peak(y), None
            out = y
        else:
            out, lim_s, tp, ceil = master(P['mix'], gains[s], head)
            for _ in range(2):                          # the limiter (and the seam ramp) shave a little: trim, re-master
                d = TARGET - lufs(out) if s not in guard else 0.0
                if abs(d) < 0.05:
                    break
                gains[s] += d
                out, lim_s, tp, ceil = master(P['mix'], gains[s], head)
        wav = os.path.join(outd, f'{s}-mix.wav')
        sf.write(wav, out, SR, subtype='PCM_24')
        qa = measure(s, g, P, gains[s], out, lim_s, tp, ceil if ceil is not None else 0.0)
        qa['file'] = os.path.relpath(wav, ROOT)
        qa['guard_db'] = guard.get(s)
        qa['seam_head'] = ({'from_gain_db': round(head, 2), 'to_gain_db': round(gains[s], 2), 'ramp_s': SEAM_S,
                            'after': PREV.get(s)} if head is not None and s != 'card' else None)
        qa['built'] = time.strftime('%Y-%m-%d %H:%M:%S')
        qa['heard'] = 'nothing here has been listened to; every number is measured'
        json.dump(qa, open(os.path.join(qad, f'{s}-mix-qa.json'), 'w'), indent=1, default=float)
        results[s] = qa
        pre[s] = None                                             # free the buses as we go
        m = qa['measured']
        sc = qa.get('score') or {}
        print(f"  {s}: {qa['file']}: {m['lufs_i']} LUFS, TP {m['true_peak_dbtp']} dBTP, LRA {m['lra_lu']}, dialogue "
              f"{m.get('dialogue_lufs')}, gain {m['gain_db']:+.2f} dB{' (guard %+.2f)' % guard[s] if s in guard else ''}; score "
              f"{'MISSING' if sc.get('missing') else ('-' if not sc else sc.get('file'))}; holes {len(m['holes_under_-42dBFS_0.3s'])} "
              f"({m['unmarked_holes']} unmarked; without score {m['unmarked_holes_without_score']} unmarked)")
    if 'tag' in results:
        oq = outro_mix(variant, gains['tag'], outd, os.path.join(outd, 'tag-mix.wav'))
        if oq:
            json.dump(oq, open(os.path.join(qad, 'outro-mix-qa.json'), 'w'), indent=1, default=float)
            print(f"  outro: {os.path.relpath(oq['file'], ROOT)}: the tag's hum held {oq['hum_s']} s under it, its first hit "
                  f"{oq['first_hit_db']} dB at {oq['first_hit_s']} s; the seam steps {oq['seam']['step_400ms_db']} dB (400 ms)")
    # the episode report (merged with the last one for segments not run this time)
    rep = json.load(open(rep_p)) if os.path.exists(rep_p) else {}
    segs_rep = rep.get('segments', {})
    for s, qa in results.items():
        m = qa['measured']
        sc = qa.get('score') or {}
        segs_rep[s] = {'file': qa['file'], 'seconds': qa['seconds'], 'lufs_i': m['lufs_i'], 'true_peak_dbtp': m['true_peak_dbtp'],
                       'lra_lu': m['lra_lu'], 'dialogue_lufs': m.get('dialogue_lufs'), 'gain_db': m['gain_db'],
                       'guard_db': qa.get('guard_db'),
                       'score': 'none (card)' if s == 'card' else ('MISSING' if sc.get('missing') else sc.get('file')),
                       'unmarked_holes': m['unmarked_holes'], 'unmarked_holes_without_score': m['unmarked_holes_without_score'],
                       'built': qa['built']}
    for s, why in skipped.items():
        segs_rep[s] = {'skipped': why}
    ep = [s for s in ['coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'] if s in segs_rep and 'file' in segs_rep[s]
          and os.path.exists(os.path.join(ROOT, segs_rep[s]['file']))]
    whole = None
    if len(ep) >= 2:
        cat = np.concatenate([sf.read(os.path.join(ROOT, segs_rep[s]['file']), dtype='float32', always_2d=True)[0] for s in ep])
        whole = {'segments': ep, 'seconds': round(len(cat) / SR, 2), 'lufs_i': round(lufs(cat), 2), 'lra_lu': lra(cat),
                 'note': 'the story segments (and the card) back to back; the intro and the outro play their own masters between'}
        del cat
    seams = []
    for a_, b_ in [('card', 'act1'), ('act1', 'act2'), ('act2', 'act3'), ('act3', 'act4'), ('act4', 'tag')]:
        fa, fb = (segs_rep.get(a_) or {}).get('file'), (segs_rep.get(b_) or {}).get('file')
        if fa and fb and os.path.exists(os.path.join(ROOT, fa)) and os.path.exists(os.path.join(ROOT, fb)):
            xa = sf.read(os.path.join(ROOT, fa), dtype='float32', always_2d=True, start=-int(0.2 * SR))[0]
            xb = sf.read(os.path.join(ROOT, fb), dtype='float32', always_2d=True, stop=int(0.2 * SR))[0]
            ra = float(20 * np.log10(np.sqrt(np.mean(xa.astype('float64') ** 2)) + 1e-12))
            rb = float(20 * np.log10(np.sqrt(np.mean(xb.astype('float64') ** 2)) + 1e-12))
            seams.append({'seam': f'{a_} -> {b_}', 'last_200ms_dbfs': round(ra, 1), 'first_200ms_dbfs': round(rb, 1),
                          'step_db': round(rb - ra, 1), 'sample_jump': round(float(np.abs(xb[0] - xa[-1]).max()), 4)})
    li = [segs_rep[s]['lufs_i'] for s in SEGS if s in segs_rep and 'lufs_i' in segs_rep[s]]
    dd = [segs_rep[s]['dialogue_lufs'] for s in SEGS if s in segs_rep and segs_rep[s].get('dialogue_lufs') is not None]
    rep = {'variant': variant, 'target_lufs': TARGET, 'true_peak_max_dbtp': TP_MAX,
           'dialogue_reference_lufs': round(ref, 2) if ref is not None else rep.get('dialogue_reference_lufs'),
           'dialogue_reference_from': ref_src or rep.get('dialogue_reference_from'),
           'guard_lu': GUARD_LU, 'segments': segs_rep, 'episode': whole, 'seams': seams,
           'spread': {'lufs_i_lu': round(max(li) - min(li), 2) if li else None,
                      'dialogue_lu': round(max(dd) - min(dd), 2) if dd else None},
           'updated': time.strftime('%Y-%m-%d %H:%M:%S'),
           'heard': 'nothing here has been listened to; every number is measured'}
    json.dump(rep, open(rep_p, 'w'), indent=1, default=float)
    print(f"\nloudness ({variant}): " + ' · '.join(f"{s} {segs_rep[s].get('lufs_i', '-')}" for s in segs_rep)
          + f"; dialogue spread {rep['spread']['dialogue_lu']} LU; episode {whole['lufs_i'] if whole else '-'} LUFS"
          + f"\nreport: {os.path.relpath(rep_p, ROOT)}")
    return rep


def main(argv):
    ap = argparse.ArgumentParser(description='Ep1 v3: the final mix per segment + the loudness report')
    ap.add_argument('segs', nargs='*', help='segments (coldopen card act1 act2 act3 act4 tag); --all for every one')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--variant', default='kokoro', choices=['kokoro', 'el'])
    ap.add_argument('--no-score', action='store_true', help='mix without the score (a check of the rooms and SFX)')
    ap.add_argument('--rebuild-stems', action='store_true')
    ap.add_argument('--no-heavy', action='store_true', help="don't re-run through ops/heavy.sh")
    ap.add_argument('--lock', default=S.DEFAULT_LOCK, choices=sorted(S.LOCKS),
                    help='v34 (default: show/reel/ep01-v34/), v33, v32, v31 or v3')
    a = ap.parse_args(argv)
    set_lock(a.lock)
    if not a.no_heavy and os.environ.get('MRMAS_V3SOUND_INNER') != '1':
        os.chdir(ROOT)
        os.execvp('bash', ['bash', os.path.join(ROOT, 'ops/heavy.sh'), 'env', 'MRMAS_V3SOUND_INNER=1', sys.executable,
                           os.path.abspath(__file__)] + argv)
    names = (SEGS + ['card']) if a.all or not a.segs else [s for s in a.segs if s in SEGS + ['card']]
    if a.rebuild_stems:
        S.build(a.variant)
    print(f'mix ({a.lock}, {a.variant}): {" ".join(names)}')
    run(names, a.variant, use_score=not a.no_score)


if __name__ == '__main__':
    main(sys.argv[1:])
