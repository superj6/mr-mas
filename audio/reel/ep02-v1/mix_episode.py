#!/usr/bin/env python3
"""Ep2 v1: the final mix of each segment, and the episode's loudness report. A copy of Ep1's (audio/reel/ep01-v3/
mix_episode.py, locked) with EVERY Ep1-specific layer removed (its set pieces, gain rows, score rides and curves, the one
silence, the demo film's and Ttemme's devices, the cold open's +6 dB, Ep1's mood table and holes). What stays is the
machinery, on Ep2's lock:

  audio/.venv-casting/bin/python audio/reel/ep02-v1/mix_episode.py --all [--variant el|kokoro]
  audio/.venv-casting/bin/python audio/reel/ep02-v1/mix_episode.py act2 act3            (some segments)
      Re-runs itself through ops/heavy.sh (--no-heavy to skip that). Rebuilds the room/SFX stems first (stems.py) when
      any of their inputs changed, so one command is always enough.
  reads   the timelines (el, the master and the default: show/reel/ep02-v1-el/ep02-v1-el-<seg>.json; kokoro:
          show/reel/ep02-v1/ep02-v1-<seg>.json) and the takes they name; the stems audio/reel/ep02-v1/stems/[el/];
          the score audio/ost/tracks/e02-v1-<seg>/render/music[-el].wav (+ cues[-el].json) if it exists and names this
          lock's timeline (no score -> the segment mixes without one, and says so)
  writes  out/ep02/v1/mix/<seg>-mix.wav (kokoro: out/ep02/v1/mix-kokoro/), 48 kHz / 24-bit stereo, git-ignored, each
          exactly its segment's length; card-mix.wav (the 2 s card, at Act One's gain); outro-mix.wav (the outro's audio
          with the tag's hum held 2 s under its head, its first hit -6 dB); audio/reel/ep02-v1/mix-qa/<variant>/
          <seg>-mix-qa.json and loudness-report.json

THE MIX, per segment:
  DIALOGUE  every take at beatStart + t - in, dual mono at -3 dB. Lines tagged call / monitor / laptop / phone / stage /
            stream / tv / podcast go through a small-speaker chain (DEVICE), loudness-matched to the dry take, then -1 dB.
            The V.O. is dry and close, +VO_GAIN_DB (2.0: its takes are -18 LUFS, 2 under the spoken -16). An interrupted
            line (`cut`) stops at its `dur`. EL: each take is levelled to its Kokoro counterpart's loudness when the
            lock carries one. MARIO (a Kokoro take in the EL film): voices-el.md §AB3's EQ (+1.5 dB at 350 Hz, -1.5 dB at
            2.2 kHz) and -0.5 dB, before any device chain.
  ROOMS     the room stem, dipping 2 dB under speech.
  SFX       the SFX stem as built (not ducked).
  SCORE     music.wav as delivered (underscore level, on the segment's clock), DUCKED under speech: 0.25 s pre, joined
            across gaps under 2.5 s, 0.2 s in, 0.6 s out, by a depth per cue (DUCK_BY_MOOD, keyed by the beat's
            `music (v1): E02-NN ...`, default 9 dB) smoothed over 1.5 s; a cue sheet's "duck_db" overrides it for its
            window. -3 dB under a silent POST when no one speaks. The score's fade-in at each act's head (a designed hit
            keeps its attack). The previous chapter's score ring-out (music[-el]-ringout.wav, if its composer wrote one)
            is laid at this chapter's head and crossfades out under its own score. The NEXT chapter's score pre-lap (its
            cue sheet's `prelap`: music[-el]-prelap.wav) is laid under this chapter's tail, ending on its last sample, at
            the next score's head gain; that chapter's head fade is then off (its score is already sounding). The card
            gets a score bus for Act One's pre-lap (S4: the sound leads; S3: the re-entry after a designed stop).
  MASTER    -16 LUFS integrated per segment; a look-ahead peak limiter (ceiling -1.5 dBFS) and a 4x-oversampled
            true-peak check (< -1.0 dBTP). THE SEAMS: each story chapter's first 2 s ramp from the previous chapter's
            gain to its own. THE DIALOGUE GUARD (--all): a segment whose dialogue would land more than 1.5 LU above the
            episode's median dialogue loudness is turned down to it.
The per-beat tables (SETPIECES, GAIN_ROWS, SCORE_RIDE, DESIGNED, ROOM_DEVICE) start empty: an Ep2 pass adds its own,
with the reason. Nothing here has been listened to. The QA and the report say what was measured.

THE SOUND PASS (2026-10-10; show/episodes/ep02/production/v1/sound-v1.md). Ep2's voice chains, cast.md §4:
  ghost    GHOST-NOLE: the take a little darker, a short dark reverb (RT 0.75 s, -7 dB) and a chip doubler (8 kHz
           sample-and-hold, 5 bits, 400-3500 Hz) 25 ms late at -15 dB; matched, -1 dB
  far      Ep1's take down a corridor (Alyi's "Six years and eleven months."): 280 Hz-3 kHz, early reflections, a 1.3 s
           tail; matched, -6 dB
  os       off screen in the same room: off-axis (6.5 kHz) with the room's first reflections, -2 dB (dry where the room
           has no space: a black, the blueprint)
  offmic   the ENGINEER after the headset comes off: close and dry, a little darker, -2 dB, never the PA
  chant    the CROWD's composite in the party room: reflections and a short tail
  podcast  Neleh on the boardroom TV's podcast player: 150 Hz-7.5 kHz, then the boardroom's reflections (DEVICE_ROOM);
           tv, phone and monitor take their rooms' reflections too
  call     cast.md: dry while the speaker is in frame, the phone's band-pass only where he isn't (crosscut.py: sc 19's
           crosscut; 8.06 and 17.09 hold on Mas, so dry); 30 ms crossfades at the picture's cuts
  PA       ROOM_DEVICE: every line in the demo house (Rima, the ENGINEER, CHATGTP, the sung line) through the house PA
           ('stage'); LINE_DEVICE: 9.06's VOICE previews from the wings' monitor
The previous chapter's ring-out is kept apart from this score's head fade and rides (it continues across the seam);
SCORE_RIDE['act2'] softens Act Two's act-in hit (S9). premix(keep_buses=True) hands the four buses to sound_audit.py.
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
_spec = importlib.util.spec_from_file_location('ep2stems', os.path.join(HERE, 'stems.py'))
S = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(S)
SR, FPS = S.SR, S.FPS
SEGS = S.SEGS
OUTS = {'el': 'out/ep02/v1/mix', 'kokoro': 'out/ep02/v1/mix-kokoro'}
QA_DIR = 'audio/reel/ep02-v1/mix-qa'
TARGET, CEIL, TP_MAX = -16.0, -1.5, -1.05   # v3.4: TP_MAX 0.05 dB inside -1 dBTP, so no report reads "-1.0" (v3.4 act3: -1.00)
GUARD_LU = 1.5
ROOM_DIP = {}
ROOM_DIP_DEFAULT = 2.0
DUCK_DEFAULT = 9.0
SCORE_GAIN_DB = {}                      # seg -> dB on the score as delivered (a ruling, with its reason)
# seg -> dB on the dialogue bus before the master (a ruling, with its reason). The fixes pass (2026-10-10, the review's
# "dialogue level by chapter"): the tag's one V.O. line sat 1.54 LU over the episode's median dialogue (over the
# guard): -1.0 dB on its bus lands it about 0.9 LU lower (its score carries most of its loudness)
DLG_SEG_DB = {'tag': -1.0}
# seg -> LU over TARGET for the segment's integrated loudness (a ruling, with its reason). The fixes pass (2026-10-10):
# Act One is wall-to-wall talk, so at -16 LUFS integrated its dialogue sat at -15.0, 1.4 dB under Act Two's (the
# speech jumped at the Act One -> Two seam). A dialogue bus lift barely moved it (+2 dB on the bus gave +0.14 at the
# master: its talk IS its loudness), so the act sits 1 LU over the target instead (-15.0 LUFS integrated), which puts
# its lines at about -14.0, with the other acts (its score, rooms and SFX were the quietest of the acts as well)
SEG_TRIM_LU = {'act1': 1.0}
DUCK_BY_MOOD = [                        # the beat's `music (v1): E02-NN ...` cue -> dB under speech (manifest.md §6)
    ('E02-01', 9), ('E02-02', 8), ('E02-03', 9), ('E02-04', 9), ('E02-05', 8), ('E02-06', 7), ('E02-07', 8),
    ('E02-08', 9), ('E02-09', 7), ('E02-10', 9), ('E02-11', 9), ('E02-12', 7), ('E02-13', 8),
]
VO_GAIN_DB = 2.0   # the V.O. takes are -18 LUFS (2 under the spoken -16, the take pass's design); +2 puts them level
DESIGNED = {}                           # seg -> [(first beat, last beat, why)]: holes that are story beats
# room -> a DEVICE chain every line in it goes through. Ep2 (the sound pass): the demo house hears every line through the
# house PA (Rima's headset, the ENGINEER's, CHATGTP on the phone the PA carries, the sung line); an `offmic` line never
ROOM_DEVICE = {'demo_house': 'stage'}
# line id -> a DEVICE chain (cast.md §4 names the tags; these lines play from a screen the tags don't name): 9.06's
# VOICE panel, each slot saying hello from the wings' monitor
LINE_DEVICE = {'e2-a2-0012': 'monitor', 'e2-a2-0013': 'monitor', 'e2-a2-0014': 'monitor', 'e2-a2-0015': 'monitor',
               'e2-a2-0016': 'monitor'}
NO_SPACE = {'black', 'void', 'none', '', 'blueprint'}   # rooms with no acoustic space (an `os` line there stays dry)


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
    'stream': _chain(150, 2, 7000, 2, 3000, 2.0, 0.9),    # a stream's mic and encode
    'podcast': _chain(150, 2, 7500, 2, 2800, 2.0, 0.9),   # Ep2: the boardroom TV's podcast player (Neleh), then the room
    'tv': _chain(200, 2, 6000, 2, 2500, 2.0, 0.9),        # a TV across a room
    'stage': _chain(110, 2, 9000, 2, 2800, 2.5, 0.8),     # v3.2 22.01: DevDay's PA in a hall (reflections added below)
    'call': _chain(300, 4, 3400, 4, 1700, 3.0, 1.0),       # a video call's codec and a laptop speaker
    'phone': _chain(500, 4, 3400, 4, 2000, 2.0, 1.0),      # a phone held at arm's length (sc 8's POV)
    'laptop': _chain(280, 4, 5500, 2, 2200, 2.5, 1.0),
    'monitor': _chain(180, 2, 6500, 2, 2500, 2.0, 0.9),    # a desktop monitor's speakers
}


SMALL = set(DEVICE)                     # line tags that take a DEVICE chain
# the room a device's speaker sits in answers it (early reflections, ms and dB): cast.md §4's "then the room"
DEVICE_ROOM = {'podcast': ((9, -11), (17, -14), (29, -17), (43, -21)), 'tv': ((13, -10), (27, -13), (41, -17), (66, -21)),
               'phone': ((5, -13), (11, -16), (19, -20)), 'monitor': ((4, -13), (9, -16), (16, -20))}


# ------------------------------------------------------------------ Ep2's voice treatments (cast.md §4; the sound pass)
def _ir(rt60, lp_hz, pre_s, seed, length=None):
    """a synthetic mono impulse response: exponentially decaying noise, low-passed, after a pre-delay (deterministic)"""
    n = int((length or rt60 * 1.2) * SR)
    r = np.random.default_rng(seed)
    t = np.arange(n) / SR
    x = r.standard_normal(n) * np.exp(-6.9078 * t / rt60) * (1 - np.exp(-t / 0.006))
    x = signal.sosfilt(signal.butter(2, lp_hz, 'low', fs=SR, output='sos'), x)
    x = np.concatenate([np.zeros(int(pre_s * SR)), x])
    return x / (np.sqrt(np.sum(x ** 2)) + 1e-12)


def _reflect(y, taps):
    out = np.array(y, dtype='float64', copy=True)
    for ms, g in taps:
        k = int(ms / 1000 * SR)
        if 0 < k < len(y):
            out[k:] += y[:-k] * db(g)
    return out


def _rms(x):
    return float(np.sqrt(np.mean(np.asarray(x, 'float64') ** 2)) + 1e-12)


def _ext(x, s_):
    return np.concatenate([x, np.zeros(int(s_ * SR))])


def ghost(x):
    """GHOST-NOLE (cast.md §4): a short dark reverb and a chip doubler a hair late, over a slightly darkened voice"""
    x = _ext(x, 0.9)
    dry = signal.sosfilt(signal.butter(2, 6500, 'low', fs=SR, output='sos'), x)
    wet = signal.fftconvolve(x, _ir(0.75, 2600, 0.012, 2101))[:len(x)]
    wet *= _rms(dry) / _rms(wet) * db(-7.0)
    h = 6                                               # the chip: 8 kHz sample-and-hold, 5 bits, band-limited, 25 ms late
    c = np.repeat(x[::h], h)[:len(x)]
    pk = float(np.abs(c).max()) + 1e-12
    c = np.round(c / pk * 15) / 15 * pk
    c = signal.sosfilt(signal.butter(2, [400, 3500], 'band', fs=SR, output='sos'), c)
    k = int(0.025 * SR)
    c = np.concatenate([np.zeros(k), c[:-k]])
    c *= _rms(dry) / _rms(c) * db(-15.0)
    return dry + wet + c


def far(x):
    """Ep1's take, far off, as if down a corridor (cast.md §4: Alyi's 'Six years and eleven months.', 15.03)"""
    x = _ext(x, 1.5)
    b = signal.sosfilt(np.vstack([signal.butter(2, 280, 'high', fs=SR, output='sos'),
                                  signal.butter(2, 3000, 'low', fs=SR, output='sos')]), x)
    wet = signal.fftconvolve(b, _ir(1.3, 2200, 0.028, 2111))[:len(b)]
    wet *= _rms(b) / _rms(wet) * db(-3.0)
    return _reflect(b * db(-4.0), ((19, -9), (37, -12), (61, -15))) + wet


def offmic(x):
    """close and dry, a little lower and darker, after the headset comes off (11.15): no PA"""
    return signal.sosfilt(signal.butter(2, 8500, 'low', fs=SR, output='sos'), x)


def offscreen(x, room):
    """O.S. in the same room: off-axis (the top end softened) and the room's first reflections"""
    if (room or '') in NO_SPACE:
        return x
    y = signal.sosfilt(signal.butter(2, 6500, 'low', fs=SR, output='sos'), _ext(x, 0.1))
    return _reflect(y, ((11, -10), (23, -13), (37, -16), (53, -20)))


def chant(x):
    """the CROWD's layered chant (el_crowd.py's composite): the party room around it"""
    x = _ext(x, 0.8)
    wet = signal.fftconvolve(x, _ir(0.6, 4000, 0.01, 2121))[:len(x)]
    return _reflect(x, ((13, -11), (29, -14))) + wet * _rms(x) / _rms(wet) * db(-11.0)


TREAT = {'ghost': ghost, 'far': far, 'offmic': offmic, 'chant': chant}
TREAT_DB = {'ghost': -1.0, 'far': -6.0, 'offmic': -2.0, 'os': -2.0, 'chant': 0.0}   # after the loudness match
_FAR = {}


def far_index(variant):
    """{line id: [(t0, t1)] in take-file seconds} where a `call` line's speaker is NOT on screen (crosscut.py): there the
    line is the phone's far end (cast.md §4). Built from the lock itself, so the mix and the pocket check agree"""
    if variant not in _FAR:
        import crosscut as XC
        out = {}
        for seg in SEGS:
            p = S.timeline_path(seg, variant)
            if not os.path.exists(p):
                continue
            g = S.Seg(seg, json.load(open(p)), p)
            sp = XC.spans(seg, g.beats, g.starts)
            if not sp:
                continue
            for i, b in enumerate(g.beats):
                for l in b.get('lines') or []:
                    if (l.get('tag') or '').lower() != 'call':
                        continue
                    me = XC.WHO_OF.get(l.get('who'))
                    on = g.starts[i][0] + float(l['t'])
                    z = on - float(l.get('in', 0))
                    rng_ = [(max(a, on), min(e, on + float(l['dur']) + 0.3)) for who, ss in sp.items() if who != me for a, e in ss]
                    rng_ = [(round(a - z, 4), round(e - z, 4)) for a, e in rng_ if e > a]
                    if rng_:
                        out[l['id']] = rng_
        _FAR[variant] = out
    return _FAR[variant]

# voices-el.md §AB3: a Kokoro-cast line in the EL film (MARIO): the two peaks that undo fastrec's chain, -0.5 dB
KOKORO_IN_EL_EQ = np.vstack([_peq(350, 1.5, 1.0), _peq(2200, -1.5, 0.9)])
KOKORO_IN_EL_DB = -0.5


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


def line_audio(l, room, variant, info=None):
    """one take as the dialogue bus lays it: (x, gain_db), x mono float64 with the EL level match's source, MARIO's EQ,
    the device chain and the interrupt cut applied, gain_db the level match plus the V.O. lift; the bus adds
    x * 0.7071 * db(gain_db) to both channels from (line on - in). Shared with the score's pocket check
    (audio/ost/tracks/e02-v1-common/pocket.py), so the check hears the takes exactly as the mix lays them"""
    info = info if info is not None else {'device': {}, 'el_matched': 0}
    x = take(l['audio']).astype('float64')
    gain = 0.0
    kref = l.get('kokoro_audio') or (l.get('kokoro') or {}).get('audio')
    if variant == 'el' and kref and os.path.exists(os.path.join(ROOT, kref)):
        ref, own = take_lufs(kref), take_lufs(l['audio'])
        if ref > -90 and own > -90:
            gain = ref - own
            info['el_matched'] += 1
    if variant == 'el' and l.get('engine') == 'kokoro':
        # MARIO on his Kokoro takes in the EL film (voices-el.md §AB3): undo fastrec's own shaping, lightly
        # (+1.5 dB at 350 Hz, Q 1.0; -1.5 dB at 2.2 kHz, Q 0.9) and -0.5 dB, before any device chain
        x = signal.sosfilt(KOKORO_IN_EL_EQ, x) * db(KOKORO_IN_EL_DB)
        info['kokoro_cast'] = info.get('kokoro_cast', 0) + 1
    tg = (l.get('tag') or '').lower()
    if l.get('id') in LINE_DEVICE:
        dev = LINE_DEVICE[l['id']]
    elif tg in SMALL and tg != 'call':
        dev = tg
    elif tg in ('', 'sung'):
        dev = ROOM_DEVICE.get(room)                # the demo house's PA; never under V.O., os, offmic, a call
    else:
        dev = None
    if tg in TREAT or (tg == 'os' and (room or '') not in NO_SPACE):   # an O.S. line over a black or the blueprint: dry, level
        pre = lufs(np.stack([x, x], 1) * 0.7071)
        y = offscreen(x, room) if tg == 'os' else TREAT[tg](x)
        post = lufs(np.stack([y, y], 1) * 0.7071)
        x = y * db(pre - post + TREAT_DB[tg]) if pre > -90 and post > -90 else y
        info.setdefault('treat', {})[tg] = info.get('treat', {}).get(tg, 0) + 1
    if tg == 'call':                               # the far end only where the speaker is off screen (crosscut.py)
        spans = far_index(variant).get(l.get('id'))
        if spans:
            pre = lufs(np.stack([x, x], 1) * 0.7071)
            y = signal.sosfilt(DEVICE['call'], x)
            post = lufs(np.stack([y, y], 1) * 0.7071)
            y = y * db(pre - post - 1.0) if pre > -90 and post > -90 else y
            w = np.zeros(len(x))
            for a, e in spans:
                w[max(0, int(a * SR)):max(0, int(e * SR))] = 1.0
            w = ndimage.uniform_filter1d(w, int(0.03 * SR))                    # 30 ms crossfades at the cuts
            x = x * np.cos(w * np.pi / 2) + y * np.sin(w * np.pi / 2)
            info['device']['call (far end, off screen)'] = info['device'].get('call (far end, off screen)', 0) + 1
    if dev:
        pre = lufs(np.stack([x, x], 1) * 0.7071)
        y = signal.sosfilt(DEVICE[dev], x)
        if dev == 'stage':                 # the hall answering the PA
            rv = np.zeros_like(y)
            for d_, g_ in ((0.037, -9), (0.083, -12), (0.141, -15), (0.23, -19)):
                k_ = int(d_ * SR)
                rv[k_:] += y[:-k_] * db(g_)
            y = y + signal.sosfilt(signal.butter(2, 4500, 'low', fs=SR, output='sos'), rv)
        elif dev in DEVICE_ROOM:           # the room the speaker sits in (Ep2: cast.md §4, "then the room")
            y = _reflect(np.concatenate([y, np.zeros(int(0.08 * SR))]), DEVICE_ROOM[dev])
        post = lufs(np.stack([y, y], 1) * 0.7071)
        x = y * db(pre - post - 1.0) if pre > -90 and post > -90 else y
        info['device'][dev] = info['device'].get(dev, 0) + 1
    if l.get('cut'):                           # an interrupted line stops where it's cut off
        k = int((l.get('in', 0) + l['dur'] + 0.015) * SR)
        x = x[:k].copy()
        f = min(len(x), int(0.015 * SR))
        x[len(x) - f:] *= np.linspace(1, 0, f)
    if l.get('tag') == 'V.O.' and VO_GAIN_DB:
        gain += VO_GAIN_DB
    return x, gain


def speech_spans(g):
    """(on, on + dur) of every line the dialogue bus lays (a line with a take on disk), as dialogue() returns them"""
    out = []
    for i, b in enumerate(g.beats):
        for l in b.get('lines') or []:
            if l.get('audio') and os.path.exists(os.path.join(ROOT, l['audio'])):
                on = g.starts[i][0] + l['t']
                out.append((on, on + l['dur']))
    return sorted(out)


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
            x, gain = line_audio(l, b.get('room'), variant, info)
            on = s0 + l['t']
            y = (np.stack([x, x], 1) * 0.7071 * db(gain)).astype('float32')
            S.add(bus, y, on - l.get('in', 0))
            speech.append((on, on + l['dur']))
            info['words'] = info.get('words', []) + ([on + w[1] for w in l.get('words', []) if len(w) >= 2] or [on])
            info['lines'] += 1
    return bus, sorted(speech), info


# ------------------------------------------------------------------ the score bus
def score_duck_db(g, cues, u, n_samples=None):
    """the score's duck in dB per sample (<= 0) over the first n_samples (all of g by default): the depth by mood per
    beat (DUCK_BY_MOOD), the cue sheet's duck_db over it, smoothed 1.5 s, times the speech envelope u; -3 dB under a
    silent POST when no one speaks. Returns (gdb, mood rows, cue-sheet overrides). Shared with the score's pocket
    check (audio/ost/tracks/e02-v1-common/pocket.py), so the check ducks the score exactly as the mix does"""
    N = g.N if n_samples is None else n_samples
    CR = 100
    n = int(g.N / SR * CR) + 2
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
    uu = u[:N]
    return -dep * uu - 3.0 * pt * (1 - uu), md, ov


def prelap_of(seg, variant):
    """(the segment's score pre-lap [n, 2] float32 or None, its cue-sheet entry): the cue sheet's `prelap` file, which
    plays under the PREVIOUS chapter's tail and ends on that chapter's last sample, continuous with this score's first
    sample (each composer wrote it so)"""
    if not seg or seg == 'card':
        return None, None
    wav, cp = S.score_files(seg, variant)
    if not wav or not cp:
        return None, None
    try:
        pl = json.load(open(cp)).get('prelap')
    except Exception:  # noqa: BLE001
        return None, None
    if not isinstance(pl, dict) or not pl.get('file'):
        return None, None
    p = os.path.join(ROOT, pl['file'])
    if not os.path.exists(p):
        return None, dict(pl, missing=True)
    x, sr = sf.read(p, dtype='float32', always_2d=True)
    if sr != SR:
        x = signal.resample_poly(x, SR, sr, axis=0).astype('float32')
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x, pl


def score_head_gain_db(seg, variant):
    """the gain (dB) a segment's own premix puts on its score's first sample (SCORE_GAIN_DB and the duck there; its head
    fade is off when its pre-lap plays): the level its pre-lap is laid at under the previous chapter, so the two meet
    without a step (the seam ramp starts the next chapter at the previous chapter's master gain)"""
    p = S.timeline_path(seg, variant)
    g = S.Seg(seg, json.load(open(p)), p)
    _, cp = S.score_files(seg, variant)
    cues = json.load(open(cp)) if cp else {}
    k = int(0.05 * SR)
    u, _ = duck_env(speech_spans(g), k)
    gdb, _, _ = score_duck_db(g, cues, u, k)
    return float(SCORE_GAIN_DB.get(seg, 0.0) + gdb[0])


def score_bus(name, g, variant, u, use_score=True):
    """the score bus of one chapter as the mix lays it, before the master: music[-el].wav on this lock, the previous
    chapter's ring-out under its head, SCORE_GAIN_DB, the duck (score_duck_db), the head fade at an act break (none
    when a designed hit is at the head or this score's pre-lap already plays under the previous chapter), the score
    rides, and the NEXT chapter's pre-lap under this chapter's tail (at the next score's head gain). Returns
    (mus [N, 2] float32 or None, the QA record, the cue sheet)"""
    N = g.N
    mus, cues = None, {}
    ro_arr = None
    sq = {}
    if name != 'card':
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
            ro_arr = None                            # the previous chapter's ring-out, kept apart: the head fade and the
            pv = PREV.get(name)                      # rides are this score's own; the ring-out continues across the seam
            rw, _ = S.score_files(pv, variant) if pv and pv != 'card' else (None, None)
            ro = rw.replace('.wav', '-ringout.wav') if rw else None
            if ro and os.path.exists(ro):            # the previous chapter's score, released past its last frame
                r_, rsr = sf.read(ro, dtype='float32', always_2d=True)
                if rsr == SR:
                    r_ = (r_ if r_.shape[1] == 2 else np.repeat(r_, 2, axis=1)).copy()
                    w_ = win_db(mus[: 10 * SR], 0.01)
                    t_in = float(np.argmax(w_ > -50) * 0.01) if np.any(w_ > -50) else 0.0
                    i_in, k_ = int(t_in * SR), int(2.5 * SR)
                    seg_ = np.clip((np.arange(len(r_)) - i_in) / k_, 0, 1)
                    r_ *= np.cos(0.5 * np.pi * seg_).astype('float32')[:, None]
                    ro_arr = np.zeros((N, 2), 'float32')
                    ro_arr[:min(N, len(r_))] = r_[:N]
                    sq['prev_ringout'] = {'file': os.path.relpath(ro, ROOT), 'seconds': round(len(r_) / SR, 2),
                                          'crossfade': f'full from 0 s, out (equal power) over 2.5 s from this score\'s entry at {t_in:.2f} s'}
            if SCORE_GAIN_DB.get(name):
                mus *= np.float32(db(SCORE_GAIN_DB[name]))
                if ro_arr is not None:
                    ro_arr *= np.float32(db(SCORE_GAIN_DB[name]))
                sq['gain_db'] = SCORE_GAIN_DB[name]
                sq['gain_why'] = 'SCORE_GAIN_DB (a ruling)'
            if cues_p:
                try:
                    cues = json.load(open(cues_p))
                except Exception as ex:
                    sq['cues_error'] = f'{ex.__class__.__name__}: {ex}'
            sq['lufs_as_delivered'] = round(lufs(m[:N]), 2)
            sq['lufs_after_gain'] = round(lufs(mus if ro_arr is None else mus + ro_arr), 2)
            gdb, md, ov = score_duck_db(g, cues, u)
            mus *= db(gdb)[:, None].astype('float32')
            if ro_arr is not None:
                ro_arr *= db(gdb)[:, None].astype('float32')
            sq['duck'] = {'by_mood_db': sorted({(m_, d) for _, _, d, m_ in md}, key=lambda z: z[1]),
                          'cue_sheet_overrides': ov, 'posts_dip_db': -3.0,
                          'envelope': 'pre 0.25 s, joined across gaps < 2.5 s, 0.2 s in, 0.6 s out; depth smoothed 1.5 s'}
            sq['designed_silences'] = designed_silences(cues)
        elif wav:
            sq['used'] = False
        else:
            sq['missing'] = True
        # the act breaks: the score enters on the act's first frame over a black; fade it in (the lead, v3.1), unless its
        # pre-lap already plays under the previous chapter's tail (then the score is sounding: no fade, no dip)
        own_pl = prelap_of(name, variant)[0] if (mus is not None and PREV.get(name)) else None
        if mus is not None and SCORE_HEAD_FADE.get(name):
            if own_pl is not None:
                sq['head_fade_s'] = 0.0
                sq['head_fade_why'] = (f'its pre-lap ({len(own_pl) / SR:.3f} s) plays under {PREV[name]}\'s tail, '
                                       'continuous with this score\'s first sample')
            else:
                hits = designed_hits(cues, SCORE_HEAD_FADE[name] + 0.25)
                fd = 0.04 if hits else SCORE_HEAD_FADE[name]          # a designed hit on the act's head keeps its attack
                k = int(fd * SR)
                mus[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2).astype('float32')[:, None]
                sq['head_fade_s'] = fd
                if hits:
                    sq['head_fade_why'] = f'designed hit at the head (cues.json designed_hit): {hits[0]}'
        # score rides (the score makes room for a featured sound): SCORE_RIDE[seg] = [(beat, from s, to s | 'end', dB, why)]
        if mus is not None:
            for bid, d0, d1, gdb_, why_ in SCORE_RIDE.get(name, []):
                if bid in g.BI:
                    a_ = g.starts[g.BI[bid]][0] + d0
                    b_ = g.starts[g.BI[bid]][1] if d1 == 'end' else g.starts[g.BI[bid]][0] + d1
                    tt = np.arange(N) / SR
                    mus *= db(np.interp(tt, [a_ - 0.6, a_, b_, b_ + 0.6], [0, gdb_, gdb_, 0])).astype('float32')[:, None]
                    sq.setdefault('rides', []).append({'beat': bid, 'from': round(a_, 2), 'to': round(b_, 2), 'db': gdb_, 'why': why_})
        if mus is not None and name != 'card' and ro_arr is not None:
            mus += ro_arr                            # the ring-out: ducked and gained as the score, never faded or ridden
    # the NEXT chapter's pre-lap (its J under this chapter's tail: an act break's black, the card), at the next score's
    # head gain, ending on this chapter's last sample (S4: the sound leads; S3: the re-entry after a designed stop)
    nx = NEXT.get(name)
    if use_score and nx:
        pl, info = prelap_of(nx, variant)
        if pl is not None and len(pl) <= N:
            hg = score_head_gain_db(nx, variant)
            if mus is None:
                mus = np.zeros((N, 2), 'float32')
            mus[N - len(pl):] += pl * np.float32(db(hg))
            sq['next_prelap'] = {'file': info.get('file'), 'of': nx, 'seconds': round(len(pl) / SR, 3),
                                 'laid_from_s': round((N - len(pl)) / SR, 3), 'gain_db': round(hg, 2),
                                 'lay': f'ends on this chapter\'s last sample, continuous with {nx}\'s first; at '
                                        f'{nx}\'s score head gain (its duck there), its head fade off'}
        elif info and info.get('missing'):
            sq['next_prelap'] = {'file': info.get('file'), 'of': nx, 'missing': True}
    return mus, sq, cues


# ------------------------------------------------------------------ one segment, up to the master
def premix(name, g, variant, use_score=True, keep_buses=False):
    """one segment up to the master; keep_buses also returns the four buses as laid (the sound audit's input)"""
    N = g.N
    qa = {'segment': name, 'variant': variant, 'seconds': round(g.total, 3), 'frames': g.frames, 'samples': N,
          'timeline': os.path.relpath(g.path, ROOT) if g.path else None}
    sd = os.path.join(ROOT, S.VARIANTS[variant]['out'])
    ext = S.VARIANTS[variant]['ext']
    room = sf.read(os.path.join(sd, f'{name}-room.{ext}'), dtype='float32', always_2d=True)[0]
    fx = sf.read(os.path.join(sd, f'{name}-sfx.{ext}'), dtype='float32', always_2d=True)[0]
    assert len(room) == N and len(fx) == N, (name, len(room), len(fx), N)
    if name == 'card':
        mus, sq, _ = score_bus('card', g, variant, np.zeros(N, 'float32'), use_score)
        qa['score'] = sq
        qa['layers'] = {'rooms': 'the card room stem', 'sfx': 'none', 'dialogue': 'none',
                        'score': (f"Act One's pre-lap under the card's last {sq['next_prelap']['seconds']} s"
                                  if mus is not None else 'none')}
        body = room + fx
        return dict(qa=qa, mix=(body + (mus if mus is not None else 0.0)).astype('float32'), noscore=body, mus=mus,
                    speech=[], spans=[], stats={'dlg': None, 'room': lufs(room), 'sfx': lufs(fx)})
    dlg, speech, dinfo = dialogue(g, variant, qa)
    if DLG_SEG_DB.get(name):
        dlg = dlg * np.float32(db(DLG_SEG_DB[name]))
        dinfo['bus_gain_db'] = DLG_SEG_DB[name]
    qa['dialogue'] = dinfo
    u, spans = duck_env(speech, N)
    dip = ROOM_DIP.get(name, ROOM_DIP_DEFAULT)
    room = room * db(-dip * u)[:, None].astype('float32')
    qa['rooms'] = {'stem': os.path.relpath(os.path.join(sd, f'{name}-room.{ext}'), ROOT), 'dip_under_speech_db': dip}
    qa['sfx'] = {'stem': os.path.relpath(os.path.join(sd, f'{name}-sfx.{ext}'), ROOT), 'ducked': False}
    mus, sq, _ = score_bus(name, g, variant, u, use_score)
    qa['score'] = sq
    # the set pieces rise: +2-3 LU over the talk (mood-analysis §4 #3; the lead, v3.1)
    mus, fx = setpieces(name, g, dlg, room, fx, mus, speech, qa)
    body = dlg + room + fx
    mix = body + (mus if mus is not None else 0.0)
    stats = {'dlg': lufs(dlg) if np.any(dlg) else None, 'room': lufs(room), 'sfx': lufs(fx)}
    out = dict(qa=qa, mix=mix.astype('float32'), noscore=body.astype('float32'), mus=mus, speech=speech, spans=spans,
               stats=stats)
    if keep_buses:
        out['buses'] = {'dlg': dlg, 'room': room, 'sfx': fx, 'score': mus}
    return out


SEAM_S = 2.0
PREV = {'act1': 'card', 'act2': 'act1', 'act3': 'act2', 'act4': 'act3', 'tag': 'act4'}   # back to back on the episode clock
NEXT = {v: k for k, v in PREV.items()}                    # the chapter whose pre-lap plays under each one's tail


SCORE_HEAD_FADE = {'act1': 1.0, 'act2': 1.2, 'act3': 1.2, 'act4': 1.2}   # s: the score's fade-in at an act's head
# score rides: the score makes room for a featured sound (beat, from, to or 'end', dB)
SCORE_RIDE = {                                           # seg -> [(beat, from s, to s | 'end', dB, why)]
    # the sound pass (2026-10-10): Act Two's head. The Water Line's first F is a designed hit on the act's first frame
    # (its attack is kept: no fade), but it landed at -12 dBFS (100 ms RMS) straight out of Act One's black at -32: the
    # jump LEARNINGS S9 names (Ep1's 3 AM bloom, -36 to -14 in 0.1 s). 7 dB down for its first second, back by 1.6 s.
    'act2': [('8.01', 0.0, 1.0, -7.0, 'S9: the act-in hit out of the black, softened (attack kept)'),
             # S11: the phone moments the picture holds on (ECUs on his thumb): the score makes room for the taps
             ('11.11', 0.8, 2.4, -4.0, 'S11: h · e · r typed in the wings (ECU), the taps over the pad'),
             ('12.07', 0.4, 3.5, -3.0, 'S11: his post typed and posted (ECU), the taps and the click')],
    'act3': [('17.07', 1.7, 4.66 + 4.8, -3.0, 'S11: "His phone won\'t stop": the buzzes over the scramble (17.07-17.08)')],
}
LIFT_LU = 2.5                                             # a set piece's peak over the talk
LIFT_MAX = {'st': 6.0, 'mom': 9.0}
GAIN_ROWS = {}                                            # seg -> [(what, (beat, s), (beat, s | ('sound', name)), LU)]
SETPIECES = {}                                            # seg -> [(what, (beat, s), (beat, s | 'end' | ('sound', name)), 'st' | 'mom')]


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
        if bid not in g.BI:
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
        if b0 in g.BI and b1 in g.BI:
            lo, hi = g.starts[g.BI[b0]][0] - 0.3, g.starts[g.BI[b1]][1] + 0.3
            if lo <= a and a + d <= hi:
                return 'designed: ' + why
    for t0, t1, why in extra:
        if t0 - 0.3 <= a and a + d <= t1 + 0.3:
            return 'designed: ' + why
    i = max(0, np.searchsorted([s for s, _ in g.starts], a, side='right') - 1) if g.starts else 0
    if g.beats and S.RM.recipe(S.room_of(name, g.beats[i]))[0] is None:
        return f'designed: a black ({g.beats[i]["id"]})'
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
    # the mono downmix counted too (the fixes pass, 2026-10-10: the report's "0 holes" had counted the louder channel only)
    m['unmarked_holes_mono'] = sum(1 for h in m['holes_mono_downmix'] if h['what'].startswith('UNMARKED'))
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
    if not os.path.isdir(mdir):
        return None
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
    outd = os.path.join(ROOT, OUTS[variant])
    qad = os.path.join(ROOT, QA_DIR, variant)
    os.makedirs(outd, exist_ok=True)
    os.makedirs(qad, exist_ok=True)
    claims = S.score_claims(variant)
    if not S.stems_fresh(variant, claims):
        print(f'stems ({variant}) are stale or missing: rebuilding')
        S.build(variant, quiet=False)
    skipped = {}
    order = [s for s in ['coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'] if s in names]
    pre = {}
    for s in order:
        g = segs[s]
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
            gains[s] = TARGET + SEG_TRIM_LU.get(s, 0.0) - P['lufs_pre']
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
                d = TARGET + SEG_TRIM_LU.get(s, 0.0) - lufs(out) if s not in guard else 0.0
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
              f"({m['unmarked_holes']} unmarked; mono {len(m['holes_mono_downmix'])}, {m['unmarked_holes_mono']} unmarked; without score "
              f"{m['unmarked_holes_without_score']} unmarked)")
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
                       'score': ((f"Act One's pre-lap ({sc['next_prelap']['seconds']} s)" if (sc.get('next_prelap') or {}).get('seconds')
                                  else 'none') + ' (card)') if s == 'card' else ('MISSING' if sc.get('missing') else sc.get('file')),
                       'unmarked_holes': m['unmarked_holes'], 'unmarked_holes_mono': m.get('unmarked_holes_mono'),
                       'unmarked_holes_without_score': m['unmarked_holes_without_score'],
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
    rep = {'variant': variant, 'target_lufs': TARGET, 'seg_trim_lu': SEG_TRIM_LU, 'dialogue_bus_db': DLG_SEG_DB, 'true_peak_max_dbtp': TP_MAX,
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
    ap = argparse.ArgumentParser(description='Ep2 v1: the final mix per segment + the loudness report')
    ap.add_argument('segs', nargs='*', help='segments (coldopen card act1 act2 act3 act4 tag); --all for every one')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--variant', default='el', choices=['el', 'kokoro'])
    ap.add_argument('--no-score', action='store_true', help='mix without the score (a check of the rooms and SFX)')
    ap.add_argument('--rebuild-stems', action='store_true')
    ap.add_argument('--no-heavy', action='store_true', help="don't re-run through ops/heavy.sh")
    a = ap.parse_args(argv)
    if not a.no_heavy and os.environ.get('MRMAS_EP2SOUND_INNER') != '1':
        os.chdir(ROOT)
        os.execvp('bash', ['bash', os.path.join(ROOT, 'ops/heavy.sh'), 'env', 'MRMAS_EP2SOUND_INNER=1', sys.executable,
                           os.path.abspath(__file__)] + argv)
    names = (SEGS + ['card']) if a.all or not a.segs else [s for s in a.segs if s in SEGS + ['card']]
    if a.rebuild_stems:
        S.build(a.variant)
    print(f'mix (Ep2 v1, {a.variant}): {" ".join(names)}')
    run(names, a.variant, use_score=not a.no_score)


if __name__ == '__main__':
    main(sys.argv[1:])
