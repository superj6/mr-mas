#!/usr/bin/env python3
"""Ep2 v1: the ROOM and SFX stems per segment, each on its segment's own clock. A copy of Ep1's stems builder
(audio/reel/ep01-v3/stems.py, locked) with EVERY Ep1-specific layer removed (its v3.1/v3.2/v3.5 layers, the made rooms of
Ep1's sets, the practice laps, the vault hum, Gerg's keys, THE ONE SILENCE, the egg timer, the per-beat move tables...).
What stays is the machinery, driven by the lock alone:

  audio/.venv-casting/bin/python audio/reel/ep02-v1/stems.py [--variant el|kokoro] [seg ...]
      Normally mix_episode.py runs this for you, and only when an input changed. Heavy: wrap it in ops/heavy.sh.
  reads   the lock's timelines: el (the master, default) show/reel/ep02-v1-el/ep02-v1-el-<seg>.json, kokoro
          show/reel/ep02-v1/ep02-v1-<seg>.json; the beat plans' J-/L-cut sound notes (show/episodes/ep02/production/v1/
          beat-plan/<seg>.json); the room recipes (rooms.py); the SFX board (audio/sfx/wav); each segment's score cue sheet
          if one exists (audio/ost/tracks/e02-v1-<seg>/render/cues[-el].json: its claims_sfx)
  writes  audio/reel/ep02-v1/stems/[el/]<seg>-room.<ext> and <seg>-sfx.<ext> (48 kHz / 24-bit stereo; el: FLAC, kokoro:
          WAV; git-ignored), each exactly its segment's length (frames x 2000 samples), + <seg>-stems-qa.json; the same
          for the 2 s filename card; tag-tail (2.5 s past the tag's last frame, for the outro's hum hold); stems-inputs.json

THE CLOCK. The card and the five story chapters after it (card, act1 .. act4, tag) play back to back, so they are built
as ONE block and cut into segments: a room that leads a chapter's first cut, an L-cut from the chapter before, a pre-lap
under an act break's black and a ringing tail land in the right stem without special cases. The cold open is built
alone (the intro, a video with its own sound, follows it).
ROOMS (the room stem). One bed per run of beats with one `room` (rooms.py: the room's SFX-board beds, the first
  candidate on the board). A new room LEADS the cut: it rises (equal power) over the last 0.6 s of the outgoing shot, or
  the beat plan's sound J-cut lead (a jcut whose words name no sound of the beat is its room leading). The old room
  trails 0.4 s (0.2 s into a black, or the plan's L-cut over_s). A black (rooms.py: no bed) gets a faint room tone
  (BLACK_TONE), never digital zero. Each bed is lifted (up to 6 dB) until its quiet windows clear ROOM_FLOOR.
SFX (the SFX stem). Every beat `sound` at its written peak: SFX-board files, NAMED aliases, DTMF, or synth:<kind> from
  Ep1's v2 bed modules (imported read-only; Ep1 is locked, so they never change). `dur` truncates with a 50 ms fade,
  `align: peak` lands the loudest sample on the time. A plan J-cut whose words name one of the beat's own sounds starts
  that sound lead_s before the cut. A sound the segment's score claims (its cue sheet's "claims_sfx": ["<beat>:<name>"])
  is left out (the score plays it). Every SFX ends faded (tail_safe: no step above -60 dBFS).
  THE SOUND PASS (2026-10-10, sound-v1.md): SOUND_SWAP lays a board sound in place of the lock's name where the picture
  needs it (every Ep2 typing beat is on a phone: the lock's keyboard taps become thumb taps; the second and third THUDs
  closer; the four pin ticks a step lower each; the gate's second swing shuts), SOUND_FILE lays a take as a sound (the
  ENGINEER's laugh, 9.03), SOUND_DUCK dips one sound under a line (the laugh under Gerg's), SOUND_GAIN rides a sound
  the audit found masked. S5: NOTHING RUNS PAST ITS SCENE: every sound is cut (60 ms fade) at the end of its beat's
  scene (a run of beats with one `passes.scene`), unless SCENE_RUN_ON names it; each cut is listed. The crosscut call
  (crosscut.py, sc 19) lays the lobby's watch-party bed under Gerg's shots, the campus under Mas's.
QA: per segment, the stems' loudness, the room's quiet windows, the second-difference click scan at every cut (onsets
  told apart from cut-offs), every sound laid, swapped, cut at its scene's end, dropped or missing. Nothing here has
  been listened to.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import re
import sys
import warnings
import zlib

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

warnings.filterwarnings('ignore')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
sys.path.insert(0, HERE)
import rooms as RM  # noqa: E402
import crosscut as XC  # noqa: E402

SR, FPS, SPF = 48000, 24, 2000
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
OST = os.path.join(ROOT, 'audio/ost/tracks')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
BLOCK = ['card', 'act1', 'act2', 'act3', 'act4', 'tag']      # back to back on the episode clock
CARD_S = 2.0
CUT = 'v1'
BP_DIR = os.path.join(ROOT, 'show/episodes/ep02/production/v1/beat-plan')
VARIANTS = {
    'el': dict(tl='show/reel/ep02-v1-el/ep02-v1-el-{seg}.json', out='audio/reel/ep02-v1/stems/el', ext='flac'),
    'kokoro': dict(tl='show/reel/ep02-v1/ep02-v1-{seg}.json', out='audio/reel/ep02-v1/stems', ext='wav'),
}
LEAD, TRAIL, TRAIL_BLACK = 0.6, 0.4, 0.2
TAIL_S = 2.5                  # s past the tag's end (tag-tail: the outro's hum hold)
BLACK_TONE = -54.0            # LUFS: the faint room tone under a black
ROOM_FLOOR = -40.0            # dBFS: the 5th percentile of a room's 50 ms windows, louder channel
ROOM_LIFT_MAX = 6.0
NAMED = {'BUZZ': 'phone_buzz_desk', 'RING': 'call_ring', 'SLOT': 'slot_whir', 'DIALTONE': 'dial_tone_speaker',
         'JANGLE': 'key_ring_jangle_1'}
# per-beat fix tables (Ep1's are its record); Ep2's entries are the sound pass's (2026-10-10), each with its reason
ROOM_OVERRIDE = {             # (seg, beat) -> room
    # the demo house empties under full house lights (manifest §7: "an emptying variant, with the house lights' hum")
    ('act2', '12.01'): 'demo_house_empty', ('act2', '12.02'): 'demo_house_empty', ('act2', '12.03'): 'demo_house_empty',
    # 17.02: "traffic slows on it, then stops"; from 17.03 the lanes idle on the receipt until May 20 (manifest §7: a
    # stalled variant, idling engines); 17.14 is the night (its own room)
    **{('act3', f'17.{k:02d}'): 'bridge_stalled' for k in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16)},
}
SOUND_GAIN = {                # (seg, beat, name) -> peak dBFS: a hand ruling (the lock's gain otherwise; no audit ride on top)
    # the beacon's motor leads Act Four under Act Three's black (17.21's J 1.2 s): a texture under a black, so a judged
    # level, not the audit's ride toward +2 dB over the quartet (which reached +14 dB and stepped at the seam)
    ('act4', '18.01', 'beacon_motor'): -21.0,
}
# the lock's name -> the board sound laid instead (one name, or a list per occurrence in the beat, in order)
_TAPS = ['phone_key_tap_1', 'phone_key_tap_2', 'phone_key_tap_3', 'phone_key_tap_4', 'phone_key_tap_5', 'phone_key_tap_6']
SOUND_SWAP = {
    ('coldopen', '1.02', 'mammoth_step_pixel'): 'mammoth_step_bezel',   # "the foot through the bezel"
    ('coldopen', '1.07', 'hand_truck_step'): 'hand_truck_step_mid',     # THUD 2, closer
    ('coldopen', '1.09', 'hand_truck_step'): 'hand_truck_step_near',    # THUD 3, the top step at the doors
    ('act1', '4.15', 'key_tap_soft_01'): 'phone_type_furious',          # Nole "types furiously" on his phone
    ('act2', '11.11', 'typing_soft'): _TAPS[:3],                        # h · e · r, a key each (the picture's t1..t3)
    ('act2', '12.07', 'key_tap_soft_01'): 'phone_key_tap_1',            # his post, typed on his phone (sc-12.ts)
    ('act2', '12.07', 'key_tap_soft_03'): 'phone_key_tap_3',
    ('act2', '12.07', 'key_tap_soft_05'): 'phone_key_tap_5',
    ('act3', '15.05', 'key_tap_soft_02'): 'phone_type_burst',           # "where u at?" on TPOOL's field
    ('act3', '15.05', 'key_tap_soft_04'): 'phone_key_tap_4',
    ('act3', '17.10', 'key_tap_soft_01'): 'phone_type_burst',           # a draft typed, deleted, typed (his phone)
    ('act3', '17.10', 'key_tap_soft_03'): 'phone_type_burst',
    ('act4', '19.07', 'typing_soft'): ['phone_type_burst', 'phone_type_burst'],   # he finishes his post on the lawn
    ('act4', '18.01', 'footstep_soft_1'): 'footstep_drafts_1',          # "climbs the stair of bound drafts"
    ('act4', '18.01', 'footstep_soft_2'): 'footstep_drafts_2',
    ('act4', '19.14', 'pin_grey_tick'): ['pin_grey_tick', 'pin_grey_tick_2', 'pin_grey_tick_3', 'pin_grey_tick_4'],
    ('act4', '19.19', 'gate_iron_swing'): 'gate_iron_shut',             # it swings shut behind CHATGTP
    ('act4', '22.02', 'footstep_gravel'): ['footstep_gravel', 'footstep_gravel_2', 'footstep_gravel_3'],
    ('act4', '22.09', 'footstep_gravel'): ['footstep_gravel_2', 'footstep_gravel_3', 'footstep_gravel'],
}
# the sound audit's rides (sound_audit.py --rides): (seg, beat, lock name) -> dB added to the lock's gain, each with its
# measured reason in the file; sound-v1.md §4
RIDES_FILE = os.path.join(HERE, 'sfx-rides.json')
RIDE = ({(r['seg'], r['beat'], r['name']): float(r['ride_db']) for r in json.load(open(RIDES_FILE)).get('rides', [])}
        if os.path.exists(RIDES_FILE) else {})
# a sound that is a take, not a board file (repo path)
SOUND_FILE = {
    'engineer_laugh_take': 'audio/ep02/v1-el/sound/wav/e2-a2-0005-laugh__engineer-A.wav',   # lock-v1.md §6's request
    'crowd_chant_under': 'audio/ep02/v1-el/ep02-v1/act3/wav/e2-a3-0010__crowd-layered.wav',  # 15.06's composite (ADD)
}
# (seg, beat, name) -> (line id, dB): the sound dips under that line (80 ms ramps), as a voice under a voice
SOUND_DUCK = {
    ('act2', '9.03', 'engineer_laugh_take'): ('e2-a2-0005', -9.0),      # "ducked under Gerg's line" (the lock's note)
}
# sounds the sound pass adds where the picture needs one the lock doesn't name: (seg, beat) -> [{name, at, gain, ...}]
# (dur, lp: a low-pass in Hz, fade_in: s); each with its reason
ADD = {
    # 15.07: "His raised hand finds Mas in the crowd, the only one not chanting... Under the chant, a word between them."
    # The chant (15.06's line) has ended; the room keeps chanting under the exchange: its own composite again, far and
    # low (the pocket check holds the three lines' margins)
    ('act3', '15.07'): [{'name': 'crowd_chant_under', 'at': 0.0, 'gain': -30, 'dur': 7.0, 'lp': 1800, 'fade_in': 0.4,
                         'why': 'the party keeps chanting under the exchange (the picture: "the only one not chanting")'}],
}
# (seg, beat, name): a sound allowed to ring past its scene's end (none: S5)
SCENE_RUN_ON = set()
SCENE_CUT_FADE = 0.06
# the crosscut call: the room under each speaker's shots (crosscut.py)
CROSS_ROOM = {('act4', 'GERG'): 'lobby_cheering'}


# ------------------------------------------------------------------ small helpers (Ep1's, unchanged)
def db(x):
    return 10.0 ** (np.asarray(x, dtype='float64') / 20.0)


def seed_of(*parts):
    return zlib.crc32('|'.join(str(p) for p in parts).encode()) & 0x7fffffff


def reseed(*parts):
    """every made sound draws from its own generator, so a stem never depends on the order things were built in"""
    s = seed_of(*parts)
    for i, m in enumerate(v2_mods()):
        m.rng = np.random.default_rng(s + i)
    return np.random.default_rng(s + 99)


def st(x):
    x = np.asarray(x, dtype='float64')
    return np.stack([x, x], 1) if x.ndim == 1 else x


def add(bus, x, t):
    i = int(round(t * SR))
    x = np.asarray(x, dtype='float32')
    if i >= len(bus) or i + len(x) <= 0:
        return
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(bus), i + len(x))
    bus[i:j] += x[: j - i]


TAIL_FADE_S, TAIL_LIMIT_DB = 0.02, -60.0
HEAD_FADE_S = 0.02            # the sound pass: a board LOOP laid as a sound (it starts mid-waveform) fades in over 20 ms
_LOOPS_SET = None


def board_loops():
    """the ids the SFX board marks as loops (manifest.json and manifest-ep2.json): only these get a head fade, so a
    one-shot keeps its attack"""
    global _LOOPS_SET
    if _LOOPS_SET is None:
        _LOOPS_SET = set()
        for m in ('audio/sfx/manifest.json', 'audio/sfx/manifest-ep2.json'):
            p_ = os.path.join(ROOT, m)
            if os.path.exists(p_):
                _LOOPS_SET |= {r['id'] for r in json.load(open(p_)) if r.get('loop')}
    return _LOOPS_SET


def tail_safe(x):
    """no SFX ends above -60 dBFS without a fade: if the last 2 ms peak above TAIL_LIMIT_DB, fade the last 20 ms (cos)"""
    x = np.asarray(x)
    if len(x) < 8:
        return x
    k2 = min(len(x), int(0.002 * SR))
    if float(np.abs(x[-k2:]).max()) > 10 ** (TAIL_LIMIT_DB / 20):
        x = np.array(x, dtype='float32', copy=True)
        k = min(len(x), int(TAIL_FADE_S * SR))
        g = np.cos(np.linspace(0, np.pi / 2, k)).astype('float32')
        x[len(x) - k:] *= g[:, None] if x.ndim == 2 else g
    return x


LAID_BUS = {}     # id(bus) -> [(start, end)] of everything add_fx laid on it, for the click scan


def add_fx(bus, x, t):
    add(bus, tail_safe(x), t)
    LAID_BUS.setdefault(id(bus), []).append((float(t), float(t) + len(x) / SR))


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output='sos')


def bp(x, lo, hi, order=2):
    return sosfilt(sos('band', [lo, hi], order), x, axis=0)


def lp(x, hz, order=2):
    return sosfilt(sos('low', hz, order), x, axis=0)


def pfade(x, fin=0.0, fout=0.0):
    """equal-power fades (sin / cos in amplitude): two uncorrelated rooms crossing keep their summed power"""
    x = np.array(x, dtype='float32', copy=True)
    if fin > 0:
        k = min(len(x), int(fin * SR))
        x[:k] *= np.sin(np.linspace(0, np.pi / 2, k, dtype='float32'))[:, None]
    if fout > 0:
        k = min(len(x), int(fout * SR))
        x[len(x) - k:] *= np.cos(np.linspace(0, np.pi / 2, k, dtype='float32'))[:, None]
    return x


def to_peak(x, target):
    p = float(np.abs(x).max()) if len(x) else 0.0
    return x * (db(target) / p) if p > 0 else x


_LOAD = {}


def load(name):
    if name not in _LOAD:
        x, sr = sf.read(os.path.join(SFXD, name + '.wav'), always_2d=True, dtype='float32')
        assert sr == SR, (name, sr)
        _LOAD[name] = x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)
    return _LOAD[name]


_METER = None


def lufs(x):
    global _METER
    import pyloudnorm
    if _METER is None:
        _METER = pyloudnorm.Meter(SR)
    x = np.asarray(x, dtype='float64')
    if len(x) < int(0.5 * SR) or not np.any(x):
        return -99.0
    v = _METER.integrated_loudness(x)
    return float(v) if np.isfinite(v) else -99.0


_LOOPS = {}


def loop(name, n, target, f=None, fkey='', rng=None):
    """an SFX-board loop (the beds are seamless), filtered, levelled on the file itself, from a random offset"""
    key = (name, fkey, target)
    if key not in _LOOPS:
        x = load(name).astype('float64')
        if f is not None:                   # filter a 3x tile and keep the middle: no start-up transient at the seam
            x = f(np.concatenate([x, x, x]))[len(x):2 * len(x)]
        _LOOPS[key] = (x * db(target - lufs(x))).astype('float32')
    x = _LOOPS[key]
    o = int((rng or np.random.default_rng(seed_of(name, n))).integers(0, len(x)))
    reps = (o + n) // len(x) + 1
    return np.concatenate([x] * reps)[o:o + n]


def win_db(x, w=0.05):
    """dBFS RMS of each w-second window, louder channel"""
    n = int(w * SR)
    k = len(x) // n
    if k == 0:
        return np.array([-120.0])
    r = np.sqrt(np.mean(x[:k * n].astype('float64').reshape(k, n, -1) ** 2, axis=1)).max(axis=1)
    return 20 * np.log10(r + 1e-12)


def lift_to_floor(x, name, log):
    """raise a room until its quiet windows clear ROOM_FLOOR (capped): bursty beds read low in 50 ms windows"""
    w = win_db(x[: min(len(x), 90 * SR)])
    p5 = float(np.percentile(w, 5)) if len(w) > 4 else -120.0
    lift = float(np.clip(ROOM_FLOOR - p5, 0.0, ROOM_LIFT_MAX)) if p5 > -80 else 0.0
    log.append({'room': name, 'p5_50ms_dbfs': round(p5, 1), 'lift_db': round(lift, 1)})
    return x * np.float32(db(lift)), lift


# ------------------------------------------------------------------ Ep1's v2 bed modules: synth:<kind> (read only)
_MODS = None
MOD_PATHS = {'A1': 'audio/reel/ep01-act1-v2/act1_bed.py', 'A2': 'audio/reel/ep01-act2-v2/act2_bed.py',
             'A3': 'audio/reel/ep01-act3-v2/act3_bed.py', 'CO': 'audio/reel/ep01-coldopen-v2/coldopen_bed.py',
             'TG': 'audio/reel/ep01-tag-v2/tag_bed.py'}


def v2_mods():
    """the made sounds' recipes (synth:<kind>), imported read-only on first use: helpers only (their main() runs under
    __main__); Ep1 is locked, so they never change"""
    global _MODS
    if _MODS is None:
        _MODS = []
        for k, p in MOD_PATHS.items():
            spec = importlib.util.spec_from_file_location(f'v2_{k}', os.path.join(ROOT, p))
            m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(m)
            _MODS.append(m)
    return _MODS


def dtmf(r, dur=0.9):
    rows, cols = [697, 770, 852, 941], [1209, 1336, 1477]
    out = np.zeros(int(dur * SR))
    t0 = 0.0
    while t0 + 0.12 < dur:
        n = int(0.09 * SR)
        tt = np.arange(n) / SR
        x = np.sin(2 * np.pi * r.choice(rows) * tt) + np.sin(2 * np.pi * r.choice(cols) * tt)
        i = int(t0 * SR)
        out[i:i + n] += x * np.minimum(1, tt / 0.004) * np.minimum(1, (0.09 - tt) / 0.004)
        t0 += r.uniform(0.14, 0.22)
    return st(bp(out, 400, 3400))


def make_sound(name, dur, align, r):
    """-> (stereo float64, offset s): a timeline sound by name"""
    name = NAMED.get(name, name)
    if name == 'DTMF':
        return dtmf(r, dur or 0.9), 0.0
    if name.startswith('synth:'):
        kind = name[6:]
        mods = v2_mods()
        for m in mods:
            try:
                x = m.synth(kind) if m.__name__ in ('v2_CO', 'v2_TG') else m.synth(kind, dur)
                x = np.asarray(x, dtype='float64')
                return (x if x.ndim == 2 else st(x)), 0.0
            except (KeyError, TypeError, ValueError, AttributeError):
                continue
        raise KeyError(name)
    if name.endswith('@1bit'):
        co = v2_mods()[3]
        return co.one_bit(load(name[:-5]).astype('float64')), 0.0
    if name in SOUND_FILE:
        x, sr = sf.read(os.path.join(ROOT, SOUND_FILE[name]), always_2d=True, dtype='float32')
        assert sr == SR, (name, sr)
        x = (x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)).astype('float64')
    else:
        x = load(name).astype('float64')
    if dur:                               # truncated by its dur: a 50 ms tail fade
        x = x[: int(dur * SR)].copy()
        k = min(len(x), int(0.05 * SR))
        x[len(x) - k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    off = float(np.argmax(np.abs(x).max(axis=1))) / SR if align == 'peak' else 0.0
    return x, off


# ------------------------------------------------------------------ the clock
class Seg:
    def __init__(self, name, tl, path):
        self.name, self.tl, self.path = name, tl, path
        self.beats = tl['beats'] if tl else []
        self.starts, acc, prev = [], 0.0, 0
        for b in self.beats:                       # the reel's frame rounding (schema.ts timeEpisode)
            acc += b['reelDur']
            end = max(prev + 1, int(np.floor(acc * FPS + 0.5)))
            self.starts.append((prev / FPS, end / FPS))
            prev = end
        if name == 'card':
            prev = int(CARD_S * FPS)
        self.frames = prev
        self.total = prev / FPS
        self.N = prev * SPF
        self.BI = {b['id']: i for i, b in enumerate(self.beats)}
        self.off = 0.0                             # its start on the block clock (seconds)

    def mood(self, i):
        for c in self.beats[i].get('cues', []):
            m = re.match(r'^music \(v[\d.]+\): (.*)$', c)
            if m:
                return m.group(1)
        return ''


def timeline_path(seg, variant):
    return os.path.join(ROOT, VARIANTS[variant]['tl'].format(seg=seg))


def load_segs(variant):
    segs = {}
    for name in SEGS:
        p = timeline_path(name, variant)
        if not os.path.exists(p):
            raise SystemExit(f'no {os.path.relpath(p, ROOT)}: lock every segment first ({variant})')
        segs[name] = Seg(name, json.load(open(p)), p)
    segs['card'] = Seg('card', None, None)
    off = 0.0
    for name in BLOCK:
        segs[name].off = off
        off += segs[name].total
    return segs


def plan_beats(seg):
    p = os.path.join(BP_DIR, f'{seg}.json')
    return {b['id']: b for b in json.load(open(p))['beats']} if os.path.exists(p) else {}


def as_list(v):
    return v if isinstance(v, list) else ([v] if isinstance(v, dict) else [])


def name_words(name):
    return set(re.split(r'[_:\-@]', name.lower())) - {'synth', 'c', 'f', 'soft', '1', '2', '3', '4', 'a', 'b'}


# ------------------------------------------------------------------ the score's claims
_LOCK_SHA1 = {}


def lock_sha1(path):
    """the lock's content hash: sha1 of its beats as canonical JSON. The same function as audio/ost/tracks/e02-v1-common/
    v3lib.py lock_sha1 (keep the two equal): each score's cue sheet carries the hash of the lock it was laid to"""
    key = (path, os.path.getmtime(path))
    if key not in _LOCK_SHA1:
        d = json.load(open(path))
        _LOCK_SHA1[key] = hashlib.sha1(json.dumps(d['beats'], sort_keys=True, ensure_ascii=False,
                                                  separators=(',', ':')).encode('utf-8')).hexdigest()
    return _LOCK_SHA1[key]


def score_files(seg, variant, why=None):
    """(music.wav, cues.json) for a segment's score rendered to THIS lock, or (None, None): its cue sheet names this
    timeline and carries this lock's content hash (`lock_sha1`; the score review, 2026-10-09: a retime that kept the act's
    length used to pass a stale score, S5)"""
    d = os.path.join(OST, f'e02-{CUT}-{seg}')
    sfx = '-el' if variant == 'el' else ''
    w = os.path.join(d, 'render', f'music{sfx}.wav')
    if not os.path.exists(w):
        return None, None
    c = next((p for p in (os.path.join(d, f'cues{sfx}.json'), os.path.join(d, 'render', f'cues{sfx}.json')) if os.path.exists(p)), None)
    if c:
        try:
            cues = json.load(open(c))
            tl = cues.get('timeline') or (cues.get('clock') or {}).get('timeline')
            h = cues.get('lock_sha1')
        except Exception:  # noqa: BLE001
            tl, h = None, None
        want = os.path.normpath(VARIANTS[variant]['tl'].format(seg=seg))
        if tl and os.path.normpath(tl) != want:
            if why is not None:
                why.append(f'{os.path.relpath(w, ROOT)} is rendered to {tl}, not {want}: not used')
            return None, None
        want_h = lock_sha1(os.path.join(ROOT, want)) if os.path.exists(os.path.join(ROOT, want)) else None
        if want_h and h != want_h:
            if why is not None:
                why.append(f'{os.path.relpath(c, ROOT)} was laid to a different version of {want} (lock_sha1 '
                           f'{(h or "missing")[:12]}, the lock {want_h[:12]}): re-render the score; not used')
            return None, None
    return w, c


def score_claims(variant):
    """{seg: {'beat:name', ...}} from each cue sheet's top-level claims_sfx (the score plays those sounds)"""
    out = {}
    for s in SEGS:
        _, c = score_files(s, variant)
        claims = set()
        if c:
            try:
                for x in json.load(open(c)).get('claims_sfx', []) or []:
                    claims.add(x if isinstance(x, str) else f"{x.get('beat')}:{x.get('name')}")
            except Exception:  # noqa: BLE001
                pass
        out[s] = claims
    return out


# ------------------------------------------------------------------ rooms
def room_signal(room, n, t0):
    lay, note = RM.recipe(room)
    r = reseed('room', room, round(t0, 3), n)
    x = np.zeros((n, 2), 'float32')
    for ly in lay or []:
        f = (lambda y, hz=ly['lp']: lp(y, hz)) if ly.get('lp') else None
        y = loop(ly['bed'], n, ly['lufs'], f, f"lp{ly.get('lp', '')}", rng=r)
        if ly.get('pan'):
            y = y * np.array([ly['pan']], 'float32')
        x += y
    return x, note


def room_of(seg, b):
    return ROOM_OVERRIDE.get((seg, b['id'])) or b.get('room') or ''


def room_runs(segs, names):
    """[[room, a, e, (seg, first beat), (seg, last beat)]] on the block clock, over the named segments in order"""
    runs = []
    for name in names:
        g = segs[name]
        if name == 'card':
            runs.append(['card', g.off, g.off + g.total, ('card', 'card.01'), ('card', 'card.01')])
            continue
        for i, b in enumerate(g.beats):
            k = room_of(name, b)
            if RM.recipe(k)[0] is None:
                k = None                                   # a black
            a, e = g.off + g.starts[i][0], g.off + g.starts[i][1]
            if runs and runs[-1][0] == k:
                runs[-1][2] = e
                runs[-1][4] = (name, b['id'])
            else:
                runs.append([k, a, e, (name, b['id']), (name, b['id'])])
    return runs


def cuts_from_plans(segs, names):
    """the plans' J-/L-cut sounds: {(seg, beat): lead_s} for a room leading its cut, {(seg, beat): over_s} for a trail,
    {(seg, beat, sound): lead_s} for a beat's own sound moved earlier. A J on a chapter's LAST beat that names a sound of
    the next chapter's first beat (17.21: "the lighthouse beacon's motor ... under the black") moves that sound earlier,
    under this chapter's black (the sound pass, 2026-10-10)"""
    lead, trail, own = {}, {}, {}
    order = [n for n in names if n != 'card']
    for ni, name in enumerate(order):
        PB = plan_beats(name)
        bs = segs[name].beats
        for bi, b in enumerate(bs):
            pb = PB.get(b['id'], {})
            nxt = None
            if bi + 1 == len(bs) and ni + 1 < len(order) and segs[order[ni + 1]].beats:
                nxt = (order[ni + 1], segs[order[ni + 1]].beats[0])
            for j in as_list(pb.get('jcut')):
                if not isinstance(j, dict) or 'sound' not in j:
                    continue
                words = set(re.findall(r'[a-z]+', str(j['sound']).lower()))
                hit = next((sd for sd in b.get('sounds', []) if words & name_words(sd['name'])), None)
                ls = float(j.get('lead_s', LEAD))
                nhit = next((sd for sd in nxt[1].get('sounds', []) if words & name_words(sd['name'])), None) if nxt else None
                if hit is not None:
                    own[(name, b['id'], hit['name'])] = max(own.get((name, b['id'], hit['name']), 0.0), ls)
                elif nhit is not None:
                    k = (nxt[0], nxt[1]['id'], nhit['name'])
                    own[k] = max(own.get(k, 0.0), ls)
                else:
                    lead[(name, b['id'])] = ls
            for lc in as_list(pb.get('lcut')):
                if isinstance(lc, dict):
                    trail[(name, b['id'])] = float(lc.get('over_s', 1.0))
    return lead, trail, own


# ------------------------------------------------------------------ the sound pass's helpers
def swap_of(seg, beat, name, occ):
    """the board sound laid for the occ-th sound of this name in the beat (SOUND_SWAP), else the lock's name"""
    v = SOUND_SWAP.get((seg, beat, name))
    if v is None:
        return name
    if isinstance(v, list):
        return v[(occ - 1) % len(v)]
    return v


def scene_ends(g):
    """the end (segment clock) of each beat's scene: a run of consecutive beats with one passes.scene"""
    sc = [(b.get('passes') or {}).get('scene') for b in g.beats]
    ends = [0.0] * len(sc)
    cur = g.total
    for i in range(len(sc) - 1, -1, -1):
        if i < len(sc) - 1 and sc[i] != sc[i + 1]:
            cur = g.starts[i][1]
        ends[i] = cur
    return ends


def line_span(g, lid):
    for i, b in enumerate(g.beats):
        for l in b.get('lines') or []:
            if l['id'] == lid:
                on = g.starts[i][0] + float(l['t'])
                return on, on + float(l['dur'])
    return None


def duck_under(x, ts, g, spec):
    """dip a laid sound by spec's dB while spec's line speaks (80 ms ramps)"""
    lid, dbv = spec
    sp = line_span(g, lid)
    if sp is None:
        return x, f'duck: {lid} not in the lock'
    tt = ts + np.arange(len(x)) / SR
    gcurve = np.interp(tt, [sp[0] - 0.08, sp[0], sp[1], sp[1] + 0.08], [0.0, dbv, dbv, 0.0])
    return x * db(gcurve)[:, None], f'ducked {dbv:+.0f} dB under {lid} ({sp[0]:.2f}-{sp[1]:.2f} s)'


def cross_rooms(segs, names, t_base, room, qa, lifts):
    """the crosscut call (crosscut.py): under each speaker's shots, his own room crossfades in (40 ms, equal power)
    over the beat's room (CROSS_ROOM: Gerg's shots in the lobby's watch party, Mas's on the campus as the lock has it)"""
    for sname in names:
        if sname == 'card':
            continue
        g = segs[sname]
        for who, sp in XC.spans(sname, g.beats, g.starts).items():
            rk = CROSS_ROOM.get((sname, who))
            if not rk or RM.recipe(rk)[0] is None:
                continue
            for a, e in sp:
                a0, e0 = g.off - t_base + a, g.off - t_base + e
                i0, i1 = int(round(a0 * SR)), int(round(e0 * SR))
                if i1 - i0 < int(0.1 * SR):
                    continue
                x, note = room_signal(rk, i1 - i0, a0 + t_base)
                x, lift = lift_to_floor(x, f'{rk}@{sname}:cross', lifts)
                k = int(0.04 * SR)
                w = np.ones(i1 - i0, 'float32')
                w[:k] = np.linspace(0, 1, k)
                w[-k:] = np.linspace(1, 0, k)
                th = (w * np.pi / 2).astype('float32')
                room[i0:i1] = room[i0:i1] * np.cos(th)[:, None] + x * np.sin(th)[:, None]
                qa[sname]['rooms'].append({'room': rk, 'recipe': note, 'from': round(a, 3), 'to': round(e, 3),
                                           'cross': f'{who} on screen (crosscut.py)', 'lift_db': round(lift, 1)})


# ------------------------------------------------------------------ one run of segments (the block, or the cold open)
def build_run(segs, names, qa, claims, tail_s=0.0):
    first = segs[names[0]]
    t_base = first.off
    NB = sum(segs[s].N for s in names) + int(tail_s * SR)
    room = np.zeros((NB, 2), 'float32')
    fx = np.zeros((NB, 2), 'float32')
    lifts = []
    LEAD_AT, TRAIL_AT, OWN = cuts_from_plans(segs, names)
    runs = room_runs(segs, names)
    for j, (key, a, e, fb, lb) in enumerate(runs):
        a, e = a - t_base, e - t_base
        if key is None:                                    # a black: a faint room tone, never digital zero
            n = int(round((e - a) * SR))
            if n > int(0.05 * SR):
                t_ = loop('room_tone', n, BLACK_TONE, lambda y: lp(y, 1500), 'lp1500', rng=reseed('black', round(a, 3)))
                add(room, pfade(t_, 0.08, 0.08), a)
                for sname in {fb[0], lb[0]}:
                    qa[sname]['rooms'].append({'room': f'black: room tone {BLACK_TONE} LUFS', 'from': round(a + t_base - segs[sname].off, 3),
                                               'to': round(e + t_base - segs[sname].off, 3), 'first': fb[1]})
            continue
        prev = runs[j - 1] if j > 0 else None
        nxt = runs[j + 1] if j + 1 < len(runs) else None
        lead = LEAD_AT.get(fb, LEAD) if prev is not None else 0.0
        if prev is not None and prev[0] is None:           # after a black: never before the black starts
            lead = min(lead, prev[2] - prev[1])
        if nxt is None:
            trail = 0.0
            e = min(e, (NB - int(tail_s * SR)) / SR) if tail_s else e
        else:
            trail = TRAIL_AT.get(lb, TRAIL_BLACK if nxt[0] is None else TRAIL)
        a0, e0 = max(0.0, a - lead), min(NB / SR, e + trail + (tail_s if nxt is None else 0.0))
        n = int(round((e0 - a0) * SR))
        x, note = room_signal(key, n, a0 + t_base)
        x, lift = lift_to_floor(x, f'{key}@{fb[0]}:{fb[1]}', lifts)
        fout = 1.0 if (nxt is None and tail_s) else max(trail, 0.02)
        x = pfade(x, max(lead, 0.02), fout)
        add(room, x, a0)
        for sname in {fb[0], lb[0]}:
            qa[sname]['rooms'].append({'room': key, 'recipe': note, 'from': round(a0 + t_base - segs[sname].off, 3),
                                       'to': round(e0 + t_base - segs[sname].off, 3), 'first': fb[1], 'last': lb[1],
                                       'lead': round(lead, 2), 'trail': round(trail, 2), 'lift_db': round(lift, 1)})
    # the crosscut call: each speaker's own room under his shots (crosscut.py)
    cross_rooms(segs, names, t_base, room, qa, lifts)
    # the beats' sounds
    for sname in names:
        g = segs[sname]
        send = scene_ends(g)
        for i, b in enumerate(g.beats):
            moved = set()                                  # a J-cut moves the FIRST sound of its name in the beat
            occ = {}
            for k, sd in enumerate(list(b.get('sounds', [])) + [dict(a_, added=True) for a_ in ADD.get((sname, b['id']), [])]):
                nm = sd['name']
                occ[nm] = occ.get(nm, 0) + 1
                if f"{b['id']}:{nm}" in claims.get(sname, set()):
                    qa[sname]['sfx_dropped'].append({'beat': b['id'], 'name': nm, 'why': 'the score claims it (claims_sfx)'})
                    continue
                use = swap_of(sname, b['id'], nm, occ[nm])
                r = reseed('sfx', sname, b['id'], nm, k)
                try:
                    x, off = make_sound(use, sd.get('dur'), sd.get('align'), r)
                except Exception as ex:  # noqa: BLE001
                    qa[sname]['sfx_missing'].append(f"{b['id']}:{use} ({ex.__class__.__name__}: {ex})")
                    continue
                gain = SOUND_GAIN.get((sname, b['id'], nm), sd.get('gain', -24))
                ride = 0.0 if (sname, b['id'], nm) in SOUND_GAIN else RIDE.get((sname, b['id'], nm), 0.0)   # the audit's ride
                gain = gain + ride
                if sd.get('lp'):
                    x = lp(np.asarray(x, dtype='float64'), float(sd['lp']), 4)
                x = to_peak(np.asarray(x, dtype='float64'), gain)
                lead = OWN.get((sname, b['id'], nm), 0.0) if nm not in moved else 0.0
                fin = float(sd.get('fade_in') or 0.0)
                if lead:
                    fin = max(fin, min(0.25, lead))                 # a J-led sound rises under the black
                elif use in board_loops():
                    fin = max(fin, HEAD_FADE_S)                     # a loop starts mid-waveform: no step (never a one-shot's attack)
                if fin:
                    x = pfade(x, fin, 0.0).astype('float64')
                moved.add(nm)
                at = (min(sd['at'], 0.0) - lead) if lead else sd['at']
                ts = g.starts[i][0] + at - off             # on the segment clock
                notes = []
                if use != nm:
                    notes += [f'swapped: {use}', f'lock: {nm}']
                dk = SOUND_DUCK.get((sname, b['id'], nm))
                if dk:
                    x, why = duck_under(x, ts, g, dk)
                    notes.append(why)
                over = ts + len(x) / SR - send[i]
                if over > 1e-3 and (sname, b['id'], nm) not in SCENE_RUN_ON:      # S5: nothing runs past its scene
                    keep = max(0, int(round((send[i] - ts) * SR)))
                    x = np.array(x[:keep], dtype='float64', copy=True)
                    kf = min(len(x), int(SCENE_CUT_FADE * SR))
                    if kf:
                        x[len(x) - kf:] *= np.cos(np.linspace(0, np.pi / 2, kf))[:, None]
                    qa[sname]['sfx_cut_at_scene_end'].append({'beat': b['id'], 'name': use, 'at': round(ts, 3),
                                                              'scene_end': round(send[i], 3), 'would_have_run_past_s': round(over, 3)})
                    notes.append(f'cut at its scene\'s end ({over:.2f} s early)')
                if not len(x):
                    continue
                t = g.off - t_base + ts
                add_fx(fx, x, t)
                LAID.setdefault(sname, []).append((ts, ts + len(x) / SR, use))
                if ride:
                    notes.append(f'ride {ride:+.1f} dB (sfx-rides.json)')
                if sd.get('added'):
                    notes.append(f"added by the sound pass: {sd.get('why', '')}")
                    qa[sname].setdefault('added', []).append({'beat': b['id'], 'name': use, 'at': round(ts, 3), 'why': sd.get('why', '')})
                qa[sname]['sfx'].append([b['id'], use, round(ts, 3), gain] + ([f'J-cut: leads by {lead} s'] if lead else []) + notes)
    qa['_room_levels'] = qa.get('_room_levels', []) + lifts
    return room, fx


def build_card_and_block(segs, qa, claims):
    """the card's own room (room tone), then the block card..tag"""
    room, fx = build_run(segs, BLOCK, qa, claims, tail_s=TAIL_S)
    return room, fx


# ------------------------------------------------------------------ QA: the click scan (Ep1 v3.3 X7, unchanged)
CLICK_RATIO = 10.0
LAID = {}


def _d2(x):
    return np.abs(np.diff(np.asarray(x, dtype='float32'), 2, axis=0)).max(axis=1)


def click_scan(x, boundaries):
    """at every beat boundary: the largest second difference within +-25 ms against the 99th percentile of the local
    +-0.6 s; over CLICK_RATIO it is listed as an onset (10 dB up), a cut-off (10 dB down) or a step. Then the whole stem
    is swept for cut-offs: a 5 ms level falling 12 dB or more from above -50 dBFS with a sharp second difference."""
    n = len(x)
    out = {'boundaries': [], 'cutoffs': []}
    rms = lambda a, b: float(20 * np.log10(np.sqrt(np.mean(np.asarray(x[max(0, a):max(a + 1, min(n, b))], 'float64') ** 2)) + 1e-12))  # noqa: E731
    for tb in boundaries:
        c = int(round(tb * SR))
        if c < int(0.7 * SR) or c > n - int(0.7 * SR):
            continue
        w = int(0.025 * SR)
        seg = _d2(x[c - int(0.6 * SR):c + int(0.6 * SR)])
        m0 = int(0.6 * SR)
        near = seg[m0 - w:m0 + w]
        loc = np.concatenate([seg[:m0 - int(0.1 * SR)], seg[m0 + int(0.1 * SR):]])
        pk = float(near.max()) if len(near) else 0.0
        if pk < 3e-4:
            continue
        ratio = pk / (float(np.percentile(loc, 99)) + 1e-7)
        if ratio > CLICK_RATIO:
            i = c - w + int(np.argmax(near))
            lb, la = rms(i - int(0.01 * SR), i), rms(i + 1, i + int(0.01 * SR))
            kind = 'onset' if la - lb >= 10 else ('cut-off' if lb - la >= 10 else 'step')
            out['boundaries'].append({'at': round(i / SR, 3), 'boundary': round(tb, 3), 'ratio': round(ratio, 1), 'kind': kind,
                                      'before_dbfs': round(lb, 1), 'after_dbfs': round(la, 1)})
    k = int(0.005 * SR)
    m = n // k
    if m > 4:
        e = 20 * np.log10(np.sqrt(np.mean(np.asarray(x[:m * k], 'float64').reshape(m, k, -1) ** 2, axis=1)).max(axis=1) + 1e-12)
        for j in np.where((e[:-1] > -50) & (e[:-1] - e[1:] >= 12))[0]:
            c = (j + 1) * k
            a0, a1 = max(0, c - int(0.5 * SR)), min(n, c + int(0.5 * SR))
            seg = _d2(x[a0:a1])
            ci = c - a0
            near = seg[max(0, ci - k):ci + k]
            loc = np.concatenate([seg[:max(0, ci - int(0.05 * SR))], seg[ci + int(0.05 * SR):]])
            if len(near) == 0 or len(loc) < 100:
                continue
            ratio = float(near.max()) / (float(np.percentile(loc, 99)) + 1e-7)
            if ratio > CLICK_RATIO:
                out['cutoffs'].append({'at': round(c / SR, 3), 'ratio': round(ratio, 1), 'from_dbfs': round(float(e[j]), 1),
                                       'to_dbfs': round(float(e[j + 1]), 1)})
    return out


def measure_stem(x):
    w = win_db(x)
    return {'lufs': round(lufs(x), 2), 'peak_dbfs': round(20 * np.log10(float(np.abs(x).max()) + 1e-12), 2),
            'p10_50ms_dbfs': round(float(np.percentile(w, 10)), 1)}


def quiet_spans(x, thr=-55.0, min_s=0.3):
    w = win_db(x)
    out, run = [], 0
    for i, v in enumerate(list(w) + [0.0]):
        if v < thr:
            run += 1
        else:
            if run * 0.05 >= min_s:
                out.append([round((i - run) * 0.05, 2), round(run * 0.05, 2)])
            run = 0
    return out


# ------------------------------------------------------------------ fingerprint, build, main
def fingerprint(variant, claims, segs=None):
    h = hashlib.sha1()
    for p in [os.path.abspath(__file__), os.path.join(HERE, 'rooms.py'), os.path.join(HERE, 'crosscut.py')] + \
            [os.path.join(ROOT, v) for v in MOD_PATHS.values()]:
        h.update(open(p, 'rb').read())
    # the board's Ep2 sounds (a re-made sound counts) and the takes laid as sounds
    m2 = os.path.join(ROOT, 'audio/sfx/manifest-ep2.json')
    if os.path.exists(m2):
        h.update(open(m2, 'rb').read())
        for r in json.load(open(m2)):
            f = os.path.join(ROOT, 'audio/sfx', r['file'])
            if os.path.exists(f):
                st_ = os.stat(f)
                h.update(f"{r['id']}:{st_.st_size}:{int(st_.st_mtime)}".encode())
    if os.path.exists(RIDES_FILE):
        h.update(open(RIDES_FILE, 'rb').read())
    for p in SOUND_FILE.values():
        f = os.path.join(ROOT, p)
        h.update(f"{p}:{os.path.getsize(f) if os.path.exists(f) else -1}".encode())
    segs = segs or load_segs(variant)
    for name in SEGS:
        h.update(open(segs[name].path, 'rb').read())
        bp_ = os.path.join(BP_DIR, f'{name}.json')
        if os.path.exists(bp_):
            h.update(open(bp_, 'rb').read())
    man = os.path.join(ROOT, 'audio/sfx/manifest.json')
    if os.path.exists(man):
        h.update(open(man, 'rb').read())
    beds = sorted({ly['bed'] for c in RM.ROOMS.values() if c for cand in c for ly in cand})
    h.update(json.dumps({b: RM.have(b) for b in beds}, sort_keys=True).encode())       # a new bed on the board counts
    h.update(json.dumps({s: sorted(v) for s, v in claims.items()}, sort_keys=True).encode())
    return h.hexdigest()


def out_dir(variant):
    d = os.path.join(ROOT, VARIANTS[variant]['out'])
    os.makedirs(d, exist_ok=True)
    return d


def stems_fresh(variant, claims=None):
    """True when the stems on disk were built from exactly these inputs"""
    d = out_dir(variant)
    p = os.path.join(d, 'stems-inputs.json')
    if not os.path.exists(p):
        return False
    claims = claims if claims is not None else score_claims(variant)
    try:
        rec = json.load(open(p))
    except Exception:  # noqa: BLE001
        return False
    if rec.get('fingerprint') != fingerprint(variant, claims):
        return False
    ext = VARIANTS[variant]['ext']
    return all(os.path.exists(os.path.join(d, f'{s}-{k}.{ext}')) for s in SEGS + ['card'] for k in ('room', 'sfx'))


def build(variant='el', only=None, quiet=False):
    segs = load_segs(variant)
    claims = score_claims(variant)
    d = out_dir(variant)
    qa = {s: {'segment': s, 'variant': variant, 'timeline': os.path.relpath(segs[s].path, ROOT) if segs[s].path else None,
              'seconds': round(segs[s].total, 3), 'frames': segs[s].frames, 'rooms': [], 'sfx': [], 'sfx_missing': [],
              'sfx_dropped': [], 'sfx_cut_at_scene_end': [], 'score_claims': sorted(claims.get(s, set()))}
          for s in SEGS + ['card']}
    LAID.clear()
    LAID_BUS.clear()
    room_b, fx_b = build_card_and_block(segs, qa, claims)
    co = segs['coldopen']
    co.off = 0.0
    room_c, fx_c = build_run({'coldopen': co}, ['coldopen'], qa, claims)
    lifts = qa.pop('_room_levels', [])
    ext = VARIANTS[variant]['ext']
    for s in SEGS + ['card']:
        if s == 'coldopen':
            rm, fx = room_c[:co.N], fx_c[:co.N]
        else:
            g = segs[s]
            i0 = int(round(g.off * SR))
            rm, fx = room_b[i0:i0 + g.N], fx_b[i0:i0 + g.N]
        assert len(rm) == segs[s].N, (s, len(rm), segs[s].N)
        if only and s not in only:
            continue
        sf.write(os.path.join(d, f'{s}-room.{ext}'), rm, SR, subtype='PCM_24')
        sf.write(os.path.join(d, f'{s}-sfx.{ext}'), fx, SR, subtype='PCM_24')
        q = qa[s]
        q['room_stem'] = measure_stem(rm)
        q['sfx_stem'] = measure_stem(fx)
        q['room_under_-55dBFS_0.3s'] = quiet_spans(rm)
        bnd = [st_ for st_, _ in segs[s].starts[1:]] if segs[s].starts else []
        q['click_scan'] = {'room': click_scan(rm, bnd), 'sfx': click_scan(fx, bnd),
                           'rule': f'second difference > {CLICK_RATIO}x the local 99th percentile'}
        q['room_levels'] = [l_ for l_ in lifts if l_['room'].split('@')[1].startswith(s + ':')]
        json.dump(q, open(os.path.join(d, f'{s}-stems-qa.json'), 'w'), indent=1)
        if not quiet:
            flags = [f"{k_}:{f_['kind']}@{f_['at']}({f_['ratio']}x)" for k_ in ('room', 'sfx') for f_ in q['click_scan'][k_]['boundaries'] if f_['kind'] != 'onset']
            print(f"  {os.path.relpath(os.path.join(d, s + '-room.' + ext), ROOT)} + -sfx.{ext}: {segs[s].total:.2f} s; room "
                  f"{q['room_stem']['lufs']} LUFS; sfx {len(q['sfx'])} laid, {len(q['sfx_dropped'])} claimed by the score, missing "
                  f"{q['sfx_missing'] or 'none'}; clicks at cuts (not onsets) {flags or 'none'}")
            for r in q['rooms']:
                if 'NO RECIPE' in str(r.get('recipe')) or 'stand-in' in str(r.get('recipe')):
                    print(f"    room {r['recipe']}")
    T = segs['tag']
    i0 = int(round(T.off * SR)) + T.N
    tail = (room_b[i0:i0 + int(2.0 * SR)] + fx_b[i0:i0 + int(2.0 * SR)]).astype('float32')
    if len(tail):
        sf.write(os.path.join(d, f'tag-tail.{ext}'), tail, SR, subtype='PCM_24')
    if only:                             # a partial build doesn't vouch for the other stems
        return qa
    json.dump({'fingerprint': fingerprint(variant, claims, segs), 'variant': variant,
               'timelines': {s: os.path.relpath(segs[s].path, ROOT) for s in SEGS},
               'claims': {s: sorted(v) for s, v in claims.items()}}, open(os.path.join(d, 'stems-inputs.json'), 'w'), indent=1)
    return qa


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('segs', nargs='*')
    ap.add_argument('--variant', default='el', choices=sorted(VARIANTS))
    a = ap.parse_args(argv)
    only = [s for s in a.segs if s in SEGS + ['card']] or None
    print(f'stems (Ep2 {CUT}, {a.variant}):')
    build(a.variant, only)


if __name__ == '__main__':
    main(sys.argv[1:])
