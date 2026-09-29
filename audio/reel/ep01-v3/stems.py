#!/usr/bin/env python3
"""Ep1 v3, track A2 (pass v3-sound): the ROOM and SFX stems per segment, each on its segment's own clock.

  audio/.venv-casting/bin/python audio/reel/ep01-v3/stems.py [--lock v32|v31|v3] [--variant kokoro|el] [seg ...]

THE LOCKS (LOCKS; v3.2 is the default). v32: show/reel/ep01-v32/ (EL: show/reel/ep01-v32-el/), stems in
  audio/reel/ep01-v3/v32/[el/]. v31: show/reel/ep01-v31/[-el], audio/reel/ep01-v3/v31/[el/]. v3: show/reel/ep01-v3/[-el],
  audio/reel/ep01-v3/[el/]. Every lock also writes tag-tail (2 s past the tag's last frame: the hum, for the outro).
  A score render counts for a lock only if its cue sheet names that lock's timeline (score_files).
V3.1'S NEW SOUNDS (v31_layers and friends; each only if its beats exist): Sydney's egg timer in the lobby cue's
  measured tempo (score_grid); the JOIN ping; the phones in a row (S4.09); the outgoing ring (S5.09); the keys at 2 AM
  stopping on the act4 score's Build stop; the laps, audible but distant (distant()), and the car the Orb follows;
  Ttemme's stream (S7.13: the room swapped for his mic's, crush sweeps, glass, the shatter at -10, shards, sand);
  ELGOOG's demo film (the tag: its bed, the stutter, the stills, the room's return); the hands runner's laugh; the
  cold open's new end (the rewind and a whirr, cut dead on the cursor frame); a faint room tone under every black;
  one deepfake pop per deepfake line (21.02).
V3.2'S (v32_layers, the tables): 11.04's click that ships GTP-4 (ADD_SOUND, 6 frames before the cheer); 15.15's slide and
  stamp on the picture (MOVE_WORD, from "licenses"); the call (a filtered ring, the answer, the siren's J-cut from the
  call's end); the monitor's switch-off and the clapping growing into DevDay's hall (a new room, 'devday'); the sign-ups'
  fans stepping up and the grey-out tick; his thumb and the suite stepping down to night, the drone into S2.01; the lobby
  by day (the revolving door, the lanyard, its clip) handing to the CCTV hum from his look up (LEAD_AFTER, a negative
  TRAIL_AT); the badge's skid (SOUND_SUB). The tag's demo film (its bed, clicks, blip) is left to the score when its
  sheet claims it (CLAIMABLE demo-film, demo-blip).
      Normally mix_episode.py runs this for you, and only when an input changed. Heavy: wrap it in ops/heavy.sh.
  reads   the lock's timelines show/reel/ep01-v3/ep01-v3-<seg>.json (--variant el: the ElevenLabs-timed copies
          show/reel/ep01-v3-el/ep01-v3-el-<seg>.json), the SFX board audio/sfx/wav, the v2 stem modules' made sounds
          (audio/reel/ep01-{act1,act2,act3,coldopen,tag}-v2/*_bed.py), and each segment's score cue sheet if one exists
          (audio/ost/tracks/e01-v3-<seg>/render/cues.json: see SCORE HINTS)
  writes  audio/reel/ep01-v3/<seg>-room.wav and <seg>-sfx.wav (48 kHz / 24-bit stereo, git-ignored), each exactly its
          segment's length (frames x 2000 samples), + <seg>-stems-qa.json; the same for the 2 s filename card
          (card-room.wav / card-sfx.wav); stems-inputs.json (the fingerprint mix_episode.py checks).
          --variant el writes to audio/reel/ep01-v3/el/, as FLAC (lossless, a third to a ninth of the size: the disk
          was nearly full), on the ElevenLabs timelines' own clock.

HOW THE CLOCK WORKS. The card and the five story chapters after it (card, act1, act2, act3, act4, tag) play back to
back, so they are built as ONE continuous block and then cut into segments. A room that leads a chapter's first cut,
an L-cut from the chapter before, a pre-lap under an act break's black and a ringing tail all land in the right stem
without special cases. The cold open is built alone (the intro, a video with its own sound, follows it).

ROOMS (the room stem). One bed per beat `room` (the recipes are in ROOMS below; SFX-board beds and made layers).
  * A new room LEADS the cut: it rises (equal power) over the last 0.6 s of the outgoing shot, or the beat plan's sound
    J-cut (LEAD_AT). The old room trails 0.4 s (0.2 s into a black, or the plan's L-cut: TRAIL_AT). A room after a
    black never starts before the black does.
  * Each recipe is levelled to its LUFS target (about -36 to -41) and then lifted (up to 6 dB) until the 5th
    percentile of its 50 ms windows sits at ROOM_FLOOR (-40 dBFS, louder channel): the v4 note, bursty beds read low
    in short windows. The v2 act-two recipes (gusts, laps, a ticking clock) and the TPOOL flashback get a steady air
    under them for the same reason. No accidental holes.
  * Made room layers: the cold open's hall, banquet, freeze hum and rewind (coldopen_bed.py's recipes on the v3 clock;
    the hall and banquet carry 8 dB of the lock mixer's duck under the takes, baked in, since they were built for
    it); a 1993 PC's fan under the flashback; the lobby's far steps; the dark room's LEDs ticking in straight eighths
    (LED_PEAK; 96 bpm, phased so 23.01 is on the grid, as v2 and the act3 score's bar lines; out from 20.02 to 20.06,
    the act's quiet beat); the suite's Strip and a far diesel; the office's clock; the all-hands hush (the crowd
    -7 dB, the air stays); the lobby sign's neon on F after it lights; the dark room's drone leading S5.02 by 1.0 s
    under S4.15; the vault's F hum (S8.06 on, an L-cut 1.5 s into the tag).
  * THE ONE SILENCE: Act Four's Cancel click (S1.09) to the phone's buzz (S1.11): every room out on the click, room
    tone only (-50 LUFS), back on the buzz (80 ms).
SFX (the SFX stem). Every beat `sound`, at its written peak (the lock's makers: SFX-board files and synth:<kind>),
  plus the "For sound (A2)" items and a few layers the script's SOUND lines call for (ADDED in the QA, with the line):
  the pen's scratch leading 12.04 (and a first stroke under Nole's "quarter"); the Build's chip line leading
  9.13 -> 11.01 (F4 F4 G4 Ab4 at the act1 score's 100 bpm, ending a 16th before the cut, where the score boots the
  Build a fourth up); Elgoog's siren through his phone (sc 7-8; the act1 score claims it); the anchor's too-smooth
  murmur (sc 14); race-weekend practice laps under S1.01; Gerg's keys down the line through all of sc 20, loud in
  20.06; the crane truck's grind and the glass tings pre-lapped under 23.04's black into S1.01; the call's waiting
  tone (S3.00a) and the all-hands hush (S3.04b -> S3.06); Gerg's keys at 2 AM through the monitor, loud in
  S5.09-back, stopping dead on the cut to his look (with the score's Build: "His keys stop."), one key on the cut out
  of S5.09b, faint on the small tile in S5.11. Gerg's typing layers are soft-saturated (dense()) so they read at
  their peak. S4.07's four speakerphone tones play Step Four's line, F4 Eb4 Db4 C4 (OST-BIBLE §6.8 request 1).
  Sound J-cuts that name a beat's own sound move it to start lead_s before its cut (OWN_LEAD / NEXT_OWN_LEAD).
  The cold open's SFX keep the -10 dB the lock's mixer gave its whole v2 stem under speech (so the plink sits where
  v2 put it). The Cancel click lands, then the SFX stem is empty until the buzz.
SCORE HINTS. A sound the score may also play (the freeze F4, the Build's pre-lap, the siren, the knee stabs, the
  register's bell, the tag's button chord: CLAIMABLE) is left out of the SFX stem when the segment's cue sheet claims
  it: an explicit "claims_sfx": ["<id>", ...] at its top level, or a sync point / mark / row / cue whose time falls in
  the sound's window and whose text names it (an entry that calls it "a timeline sound" or "the sound stem lays it"
  is not a claim). The lead's rulings (RULED_DROP: the knee stabs, the button chord) drop those two whenever the
  segment has a score. A cue sheet's "led_grid": {"bpm": .., "t0": ..} (or a cue with "bpm" and "laid_at_s") puts the
  dark room's LED ticks on the score's grid.
Nothing here has been listened to. The QA JSONs say what was measured.
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
SR, FPS, SPF = 48000, 24, 2000
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
OST = os.path.join(ROOT, 'audio/ost/tracks')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
BLOCK = ['card', 'act1', 'act2', 'act3', 'act4', 'tag']      # back to back on the episode clock
CARD_S = 2.0
# THE LOCKS. v3.1 (show/reel/ep01-v31/, the final lock) is the default; v3 still builds (--lock v3). The EL stems are
# FLAC (lossless; the SFX stem is mostly silence): the disk is nearly full.
LOCKS = {
    'v3': dict(bp='show/episodes/ep01/production/full-v3/beat-plan', variants={
        'kokoro': dict(tl='show/reel/ep01-v3/ep01-v3-{seg}.json', out='audio/reel/ep01-v3', ext='wav'),
        'el': dict(tl='show/reel/ep01-v3-el/ep01-v3-el-{seg}.json', out='audio/reel/ep01-v3/el', ext='flac')}),
    'v31': dict(bp='show/episodes/ep01/production/full-v3/beat-plan-v31', variants={
        'kokoro': dict(tl='show/reel/ep01-v31/ep01-v31-{seg}.json', out='audio/reel/ep01-v3/v31', ext='wav'),
        'el': dict(tl='show/reel/ep01-v31-el/ep01-v31-el-{seg}.json', out='audio/reel/ep01-v3/v31/el', ext='flac')}),
    'v32': dict(bp='show/episodes/ep01/production/full-v3/beat-plan-v32', variants={
        'kokoro': dict(tl='show/reel/ep01-v32/ep01-v32-{seg}.json', out='audio/reel/ep01-v3/v32', ext='wav'),
        'el': dict(tl='show/reel/ep01-v32-el/ep01-v32-el-{seg}.json', out='audio/reel/ep01-v3/v32/el', ext='flac')}),
    'v33': dict(bp='show/episodes/ep01/production/full-v3/beat-plan-v33', variants={
        'kokoro': dict(tl='show/reel/ep01-v33/ep01-v33-{seg}.json', out='audio/reel/ep01-v3/v33', ext='wav'),
        'el': dict(tl='show/reel/ep01-v33-el/ep01-v33-el-{seg}.json', out='audio/reel/ep01-v3/v33/el', ext='flac')}),
    'v34': dict(bp='show/episodes/ep01/production/full-v3/beat-plan-v34', variants={
        'kokoro': dict(tl='show/reel/ep01-v34/ep01-v34-{seg}.json', out='audio/reel/ep01-v3/v34', ext='wav'),
        'el': dict(tl='show/reel/ep01-v34-el/ep01-v34-el-{seg}.json', out='audio/reel/ep01-v3/v34/el', ext='flac')}),
    # v3.5, the final version (PLAN §8): one film, the ElevenLabs cast (MARIO on Kokoro); the Kokoro variant still builds
    'v35': dict(bp='show/episodes/ep01/production/full-v3/beat-plan-v35', variants={
        'kokoro': dict(tl='show/reel/ep01-v35/ep01-v35-{seg}.json', out='audio/reel/ep01-v3/v35', ext='wav'),
        'el': dict(tl='show/reel/ep01-v35-el/ep01-v35-el-{seg}.json', out='audio/reel/ep01-v3/v35/el', ext='flac')}),
}
DEFAULT_LOCK = 'v35'                  # the v3.5 lock (show/reel/ep01-v35[-el]/); --lock v34 / v33 / v32 / v31 / v3 still work
LOCK = DEFAULT_LOCK
VARIANTS = LOCKS[LOCK]['variants']
BP_DIR = os.path.join(ROOT, LOCKS[LOCK]['bp'])


def set_lock(name):
    """point every path at one lock (v3 or v31); mix_episode.py calls this too"""
    global LOCK, VARIANTS, BP_DIR
    LOCK = name
    VARIANTS = LOCKS[name]['variants']
    BP_DIR = os.path.join(ROOT, LOCKS[name]['bp'])
LEAD, TRAIL, TRAIL_BLACK = 0.6, 0.4, 0.2
TAIL_S = 2.5                  # s past the tag's end, built for the outro's hum hold (tag-tail.wav)
BLACK_TONE = -54.0            # LUFS: the faint room tone under an act-out black (the one silence has -50)
LED_PEAK = -39.0              # dBFS: the LEDs' 12 ms ticks sit in a band the low-passed rack leaves open
LAP_PEAK = -19.0              # dBFS: the practice laps (v3.1: audible but distant; the far car the Orb follows +2)
EGG_PEAK = -23.0              # dBFS: Sydney's egg timer (over the score's music box)
BUILD_BPM = 96.0              # the house tempo, when a score's own can't be measured (score_grid: the v3 duel measures 95.25)
ROOM_FLOOR = -40.0            # dBFS: the 5th percentile of a room's 50 ms windows, louder channel (see QA)
ROOM_LIFT_MAX = 6.0


def mod(path, name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)   # helpers only: each module's main() runs under __main__
    return m


MOD_PATHS = {'A1': 'audio/reel/ep01-act1-v2/act1_bed.py', 'A2': 'audio/reel/ep01-act2-v2/act2_bed.py',
             'A3': 'audio/reel/ep01-act3-v2/act3_bed.py', 'CO': 'audio/reel/ep01-coldopen-v2/coldopen_bed.py',
             'TG': 'audio/reel/ep01-tag-v2/tag_bed.py'}
A1 = mod(MOD_PATHS['A1'], 'act1_bed')
A2 = mod(MOD_PATHS['A2'], 'act2_bed')
A3 = mod(MOD_PATHS['A3'], 'act3_bed')
CO = mod(MOD_PATHS['CO'], 'coldopen_bed')
TG = mod(MOD_PATHS['TG'], 'tag_bed')
MODS = (A1, A2, A3, CO, TG)
PREFER = {'coldopen': [CO, A1, A2, A3, TG], 'act1': [A1, A2, A3, CO, TG], 'act2': [A2, A1, A3, CO, TG],
          'act3': [A3, A1, A2, CO, TG], 'act4': [A3, A1, A2, CO, TG], 'tag': [TG, A3, A1, A2, CO]}
NAMED = {'BUZZ': 'phone_buzz_desk', 'RING': 'call_ring', 'SLOT': 'slot_whir', 'DIALTONE': 'dial_tone_speaker'}
# OST-BIBLE §6.8 request 1 (standing, per the act4 score's README): sc 27's four speakerphone tones play Step Four's
# line, F4 Eb4 Db4 C4 (the SFX board's tuned keys), and the score rests there
DTMF_TUNED = {('act4', 'S4.07'): ['speakerphone_key_F4', 'speakerphone_key_Eb4', 'speakerphone_key_Db4', 'speakerphone_key_C4']}


# ------------------------------------------------------------------ small helpers
def db(x):
    return 10.0 ** (np.asarray(x, dtype='float64') / 20.0)


def seed_of(*parts):
    return zlib.crc32('|'.join(str(p) for p in parts).encode()) & 0x7fffffff


def reseed(*parts):
    """every made sound draws from its own generator, so a stem never depends on the order things were built in"""
    s = seed_of(*parts)
    for i, m in enumerate(MODS):
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


def tail_safe(x):
    """no SFX ends above -60 dBFS without a fade (v3.3, X1): if the last 2 ms peak above TAIL_LIMIT_DB, fade the last
    20 ms out (cos), so a loop or a truncated sample never stops on a step"""
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


LAID_BUS = {}     # v3.3: id(bus) -> [(start, end)] of everything add_fx laid on it (block clock), for the click scan


def add_fx(bus, x, t):
    """lay an SFX with its tail made safe (tail_safe)"""
    add(bus, tail_safe(x), t)
    LAID_BUS.setdefault(id(bus), []).append((float(t), float(t) + len(x) / SR))


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output='sos')


def filt(x, s):
    return sosfilt(s, x, axis=0)


def bp(x, lo, hi, order=2):
    return filt(x, sos('band', [lo, hi], order))


def lp(x, hz, order=2):
    return filt(x, sos('low', hz, order))


def hp(x, hz, order=2):
    return filt(x, sos('high', hz, order))


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


def smooth_noise(rng, n, rate_hz, lo=0.0, hi=1.0):
    k = max(3, int(n / SR * rate_hz) + 3)
    return np.interp(np.arange(n), np.linspace(0, n, k), rng.uniform(lo, hi, k))


# ------------------------------------------------------------------ the clock
class Seg:
    def __init__(self, name, tl, path):
        self.name, self.tl, self.path = name, tl, path
        self.beats = tl['beats'] if tl else []
        self.starts, acc, prev = [], 0.0, 0
        for b in self.beats:                       # the reel's frame rounding (schema.ts timeEpisode)
            acc += b['reelDur']
            end = max(prev + 1, round(acc * FPS))
            self.starts.append((prev / FPS, end / FPS))
            prev = end
        if name == 'card':
            prev = int(CARD_S * FPS)
        self.frames = prev
        self.total = prev / FPS
        self.N = prev * SPF
        self.BI = {b['id']: i for i, b in enumerate(self.beats)}
        self.off = 0.0                             # its start on the block clock (seconds)

    def s(self, bid, d=0.0):
        return self.off + self.starts[self.BI[bid]][0] + d

    def e(self, bid, d=0.0):
        return self.off + self.starts[self.BI[bid]][1] + d

    def has(self, bid):
        return bid in self.BI

    def line(self, lid):
        for i, b in enumerate(self.beats):
            for l in b['lines']:
                if l['id'] == lid:
                    on = self.off + self.starts[i][0] + l['t']
                    return on, on + l['dur'], l
        raise KeyError(lid)

    def speech(self):
        out = []
        for i, b in enumerate(self.beats):
            for l in b['lines']:
                on = self.off + self.starts[i][0] + l['t']
                out.append((on, on + l['dur']))
        return sorted(out)

    def mood(self, i):
        b = self.beats[i]
        for c in b.get('cues', []):
            m = re.match(r'^music \(v3(?:\.1)?\): (.*)$', c)
            if m:
                return m.group(1)
        return ''


def timeline_path(seg, variant):
    p = os.path.join(ROOT, VARIANTS[variant]['tl'].format(seg=seg))
    if os.path.exists(p):
        return p, variant
    return os.path.join(ROOT, VARIANTS['kokoro']['tl'].format(seg=seg)), 'kokoro'


def load_segs(variant):
    segs = {}
    for name in SEGS:
        p, used = timeline_path(name, variant)
        segs[name] = Seg(name, json.load(open(p)), p)
        segs[name].variant_used = used
    segs['card'] = Seg('card', None, None)
    segs['card'].variant_used = variant
    off = 0.0
    for name in BLOCK:
        segs[name].off = off
        off += segs[name].total
    return segs


# ------------------------------------------------------------------ score hints (what the score claims; its grid)
def cue_timeline(cues):
    """the timeline a cue sheet says it was rendered to (either schema), or None"""
    t = cues.get('timeline') or (cues.get('clock') or {}).get('timeline') if isinstance(cues, dict) else None
    return os.path.normpath(t) if isinstance(t, str) else None


def score_files(seg, variant, why=None):
    """(music.wav, cues.json) for a segment's score on THIS lock, or (None, None). A render whose cue sheet names another
    lock's timeline is not used (the v3 and v3.1 renders share their paths); `why` (a list) gets the reason."""
    w, c = _score_files(seg, variant)
    if w and c:
        try:
            tl = cue_timeline(json.load(open(c)))
        except Exception:
            tl = None
        want = os.path.normpath(VARIANTS[variant]['tl'].format(seg=seg))
        if tl and tl != want:
            if why is not None:
                why.append(f'{os.path.relpath(w, ROOT)} is rendered to {tl}, not {want}: not used')
            return None, None
    return w, c


def _score_files(seg, variant):
    if variant == 'el':
        cands = [(f'e01-v3-el-{seg}/render/music.wav', 'cues.json'), (f'e01-v3-{seg}/render/music-el.wav', 'cues-el.json'),
                 (f'e01-v3-{seg}/render/el/music.wav', 'cues.json')]
    else:
        cands = [(f'e01-v3-{seg}/render/music.wav', 'cues.json')]
    if LOCK == 'v3':                     # the v3 renders, kept under their own names once v3.1 took the plain ones
        v = 'v3-el' if variant == 'el' else 'v3'
        cands = [(f'e01-v3-{seg}/render/music-{v}.wav', f'cues-{v}.json')] + cands
    for wav, cues in cands:
        w = os.path.join(OST, wav)
        if os.path.exists(w):
            c = next((p for p in (os.path.join(os.path.dirname(w), cues), os.path.join(os.path.dirname(w), 'cues.json'),
                                  os.path.join(os.path.dirname(os.path.dirname(w)), cues),
                                  os.path.join(os.path.dirname(os.path.dirname(w)), 'cues.json')) if os.path.exists(p)), None)
            return w, c
    return None, None


def cue_entries(cues):
    """[(t0, t1, text)] from a cue sheet: every cue, row and sync point (mrmas-reel-music/1, read loosely)"""
    out = []
    for c in cues.get('cues', []) or []:
        txt = ' '.join(str(c.get(k, '')) for k in ('section', 'cue', 'id', 'what'))
        win = (c.get('laid') or {}).get('window') if isinstance(c.get('laid'), dict) else None
        if c.get('start') is not None:
            out.append((float(c['start']), float(c.get('end', c['start'])), txt))
        elif win:
            out.append((float(win[0]), float(win[1]), txt))
        for sp in c.get('sync', []) or []:
            if sp.get('t') is not None:
                out.append((float(sp['t']), float(sp['t']), str(sp.get('what', ''))))
        for mk in c.get('marks', []) or []:            # mrmas-segment-music/1: [t, text, hit]
            if isinstance(mk, (list, tuple)) and len(mk) >= 2:
                out.append((float(mk[0]), float(mk[0]), str(mk[1])))
    for sp in cues.get('sync', []) or []:
        if isinstance(sp, dict) and sp.get('t') is not None:
            out.append((float(sp['t']), float(sp['t']), str(sp.get('what', ''))))
    for r in cues.get('rows', []) or []:
        if r.get('start') is not None:
            out.append((float(r['start']), float(r.get('end', r['start'])), ' '.join(str(r.get(k, '')) for k in ('section', 'cue', 'what'))))
    return out


def score_hints(variant, segs=None):
    segs = segs or load_segs(variant)
    hints = {}
    for name in SEGS:
        wav, cues_p = score_files(name, variant)
        h = {'score': os.path.relpath(wav, ROOT) if wav else None, 'cues': os.path.relpath(cues_p, ROOT) if cues_p else None,
             'drop': [], 'why': {}, 'grid': None}
        if wav and not cues_p:
            for cid, why in RULED_DROP.items():
                if next(c for c in CLAIMABLE if c['id'] == cid)['seg'] == name:
                    h['drop'].append(cid)
                    h['why'][cid] = why
        if cues_p:
            try:
                cues = json.load(open(cues_p))
            except Exception as ex:          # a half-written sheet: only the rulings, and say so
                h['error'] = f'{ex.__class__.__name__}: {ex}'
                for cid, why in RULED_DROP.items():
                    if next(c for c in CLAIMABLE if c['id'] == cid)['seg'] == name:
                        h['drop'].append(cid)
                        h['why'][cid] = why
                hints[name] = h
                continue
            ents = cue_entries(cues)
            explicit = set(cues.get('claims_sfx', []) or [])
            sg = segs[name]
            for cl in CLAIMABLE:
                if cl['seg'] != name:
                    continue
                try:
                    w = cl['window'](sg)
                except KeyError:
                    continue
                w = (w[0] - sg.off, w[1] - sg.off)            # the cue sheet runs on the segment's own clock
                hit = None
                if cl['id'] in explicit:
                    hit = 'claims_sfx'
                else:
                    for t0, t1, txt in ents:
                        if NOT_A_CLAIM.search(txt):          # "(a timeline sound)", "the sound stem lays it"
                            continue
                        if w[0] <= t0 <= w[1] and any(re.search(k, txt, re.I) for k in cl['kw']):
                            hit = f'{t0:.2f} s: {txt[:90]}'
                            break
                if hit:
                    h['drop'].append(cl['id'])
                    h['why'][cl['id']] = hit
            for cid, why in RULED_DROP.items():             # the lead's rulings: the score plays these now
                cl = next(c for c in CLAIMABLE if c['id'] == cid)
                if cl['seg'] == name and cid not in h['drop']:
                    h['drop'].append(cid)
                    h['why'][cid] = why
            # the act4 score's Build stop at 2 AM (the keys stop with it)
            if name == 'act4' and sg.has('S5.09-back') and sg.has('S5.09b'):
                lo, hi = sg.s('S5.09-back') - sg.off, sg.s('S5.09b', 0.6) - sg.off
                for t0, t1, txt in ents:
                    if lo <= t0 <= hi and re.search(r'build', txt, re.I) and re.search(r'stops?\b|dead', txt, re.I):
                        h['build_stop'] = round(t0, 3)
                        break
            # the act1 score's tempo in Sydney's scene (the egg timer "ticks in its tempo") and at the duel's head (the
            # Build's pre-lap), measured from the render itself
            if name == 'act1' and wav:
                try:
                    if sg.has('v31-10.02') and sg.has('v31-10.04'):
                        h['grid_lobby'] = score_grid(wav, sg.s('v31-10.02') - sg.off, sg.e('v31-10.04') - sg.off)
                    if sg.has('11.01'):
                        h['grid_duel'] = score_grid(wav, sg.s('11.01') - sg.off, sg.s('11.01', 6.0) - sg.off)
                except Exception as ex:
                    h['grid_error'] = f'{ex.__class__.__name__}: {ex}'
            g = cues.get('led_grid')
            if isinstance(g, dict) and g.get('bpm'):
                h['grid'] = [float(g['bpm']), float(g.get('t0', 0.0))]
            else:
                for c in cues.get('cues', []) or []:
                    bpm = c.get('bpm') or c.get('tempo_bpm')
                    if bpm and c.get('laid_at_s') is not None:
                        h['grid'] = [float(bpm), float(c['laid_at_s'])]
                        break
        hints[name] = h
    return hints


def score_grid(wav, t0, t1):
    """the beat of a stretch of the score, from its onsets: [bpm, the first beat's time (segment clock), strength], or
    None when no beat stands out. Spectral flux (1024-point frames, 5 ms hop), autocorrelated over 0.4-1.2 s periods
    with a mild preference for 80-120 bpm; the phase is where the flux folds at that period peak."""
    x, sr = sf.read(wav, start=int(max(0, t0) * SR), stop=int(t1 * SR), always_2d=True, dtype='float64')
    x = x.mean(axis=1)
    if len(x) < 3 * SR or np.abs(x).max() < 1e-4:
        return None
    hop, nf = 240, 1024
    k = (len(x) - nf) // hop
    fr = np.lib.stride_tricks.sliding_window_view(x, nf)[::hop][:k] * np.hanning(nf)
    mag = np.log1p(100 * np.abs(np.fft.rfft(fr, axis=1))[:, 5:400])
    flux = np.maximum(0, np.diff(mag, axis=0)).sum(axis=1)
    flux = flux - np.convolve(flux, np.ones(41) / 41, mode='same')
    flux = np.maximum(flux, 0)
    fps = SR / hop
    n = len(flux)

    def ac(L):                             # autocorrelation at a fractional lag (frames)
        L0 = int(L)
        if L0 < 1 or L0 + 1 >= n:
            return 0.0
        a0 = np.dot(flux[:-L0], flux[L0:]) / (n - L0)
        a1 = np.dot(flux[:-(L0 + 1)], flux[L0 + 1:]) / (n - L0 - 1)
        return a0 + (a1 - a0) * (L - L0)
    base = np.mean([ac(L) for L in np.linspace(0.05 * fps, 2.0 * fps, 60)]) + 1e-12
    best, best_s, best_bpm = None, -1.0, None
    for bpm in np.arange(60.0, 140.01, 0.25):
        L = 60 * fps / bpm                 # a beat's worth of frames; support from its half, double and quarter
        sup = ac(L) + 0.5 * ac(L / 2) + 0.5 * ac(2 * L) + 0.25 * ac(L / 4)
        sc = sup * np.exp(-0.5 * ((bpm - 96.0) / 20.0) ** 2)
        if sc > best_s:
            best_s, best_bpm, best = sc, bpm, sup
    strength = float(best / (1.75 * base))
    if strength < 1.3:
        return None
    L = int(round(60 * fps / best_bpm))
    fold = np.array([flux[p::L].sum() for p in range(L)])
    ph = int(np.argmax(fold))
    return [round(float(best_bpm), 2), round(t0 + (ph * hop + nf / 2) / SR, 3), round(strength, 2)]


# sounds the score may also play: left out of the SFX stem when the segment's cue sheet claims them
RULED_DROP = {   # the lead, 2026-09-27: "Drop two SFX from the stem ... The score plays them now; don't double them."
    'knee-stabs': "the lead's ruling (2026-09-27): the act2 score plays the tour poster's four knee stabs",
    'button-chord': "the lead's ruling (2026-09-27): the tag score plays the button with no third",
}
NOT_A_CLAIM = re.compile(r'timeline sound|sound stem|\bsfx\b|the stem lays', re.I)
CLAIMABLE = [
    dict(id='freeze-F4', seg='coldopen', kw=[r'\bF4\b'], sound=('2.01', 'piano_fired_F4'),
         window=lambda g: (g.s('2.01', -0.3), g.s('2.01', 0.3))),
    dict(id='build-prelap', seg='act1', kw=[r'\bbuild\b'], layer='build-prelap',
         window=lambda g: (g.s('11.01', -1.2), g.s('11.01', 0.3))),
    dict(id='siren', seg='act1', kw=[r'siren'], layer='siren',
         window=lambda g: (g.s('7.02', 1.0), g.e('8.06'))),
    dict(id='knee-stabs', seg='act2', kw=[r'\bstab'], sound=('16.01', 'synth:stab'),
         window=lambda g: (g.s('16.01', -0.5), g.e('16.01'))),
    dict(id='register-bell', seg='act2', kw=[r'\bbell\b'], sound=('17.07', 'synth:bell'),
         window=lambda g: (g.s('17.07', 0.0), g.s('17.07', 1.2))),
    dict(id='button-chord', seg='tag', kw=[r'no third', r'button'], sound=('33.04', 'synth:button_chord'),
         window=lambda g: (g.s('33.04', 1.0), g.s('33.04', 2.1))),
    # the tag's demo film: v3.2's score carries the film's own track (its bed, the stutter's and the stills' clicks)
    # and the chip blip as the still snaps back; the room's duck and return stay the stem's
    dict(id='demo-film', seg='tag', kw=[r'demo film', r'stutter', r'film.{0,20}own'], layer='demo-film',
         window=lambda g: (g.s('v31-32.01d', -0.2), g.s('v31-32.01d', 151 / FPS))),
    # v3.5 JUN 2018: ATOD's tinny arena from the six screens (the plan's music string names it "inside" the cue: if the
    # act1 score's sheet claims it, the stem leaves it to the score)
    dict(id='atod-arena', seg='act1', kw=[r'arena', r'tinny', r'game audio'], layer='atod-arena',
         window=lambda g: (g.s('v35-13.01', -0.8), g.e('v35-13.06'))),
    dict(id='demo-blip', seg='tag', kw=[r'blip'], layer='demo-blip',
         window=lambda g: (g.s('v31-32.01d', 205 / FPS), g.s('v31-32.01d', 221 / FPS))),
]


# ------------------------------------------------------------------ rooms
RECIPE = {
    ('card', ''): 'card',
    ('act1', 'bullpen'): 'bullpen-a1', ('act1', 'basement'): 'basement', ('act1', 'phone'): 'phone',
    ('act1', 'lobby'): 'lobby-a1', ('act1', 'split'): 'split-a1', ('act1', 'dark-desk'): 'dark-desk',
    ('act2', 'whitehouse'): 'whitehouse', ('act2', 'bullpen-night'): 'bullpen-night', ('act2', 'bay'): 'bay',
    ('act2', 'senate'): 'senate', ('act2', 'rooftop'): 'rooftop', ('act2', 'none'): 'street',
    ('act3', 'dark'): 'dark',
    ('act4', 'suite'): 'suite', ('act4', 'dark'): 'dark', ('act4', 'tpool'): 'tpool', ('act4', 'office'): 'office',
    ('act4', 'allhands'): 'allhands', ('act4', 'office_night'): 'office_night', ('act4', 'boardroom'): 'boardroom',
    ('act4', 'split'): 'split-a4', ('act4', 'cctv'): 'cctv', ('act4', 'bullpen'): 'bullpen-day',
    ('act4', 'fires'): 'fires', ('act4', 'lobby'): 'lobby-night', ('act4', 'coda'): 'coda',
    ('tag', 'darkroom'): 'dark',
}
ROOM_OVERRIDE = {('act3', '23.04'): None,
                 ('act3', '22.01'): 'devday',          # v3.2: DevDay, live: the hall (22.01's room field says dark)
                 ('act4', 'v32-S5.00'): 'lobby-a1'}    # v3.2: the NopeAI lobby by day (act4's lobby is the night one)   # the script: "THE CLOCK stops on the downbeat. CUT TO BLACK." (the pre-lap follows)
# the beat plans' sound J-cuts that are a room leading its own cut (seconds before the cut)
LEAD_AT = {('act1', '5.01'): 0.6, ('act1', '9.01'): 0.8, ('act1', '11.01'): 0.8, ('act2', '13.01'): 1.0,
           ('act2', '15.01'): 1.0, ('act2', '17.01'): 0.6, ('act3', '18.01'): 1.0, ('act4', 'S3.00a'): 0.6,
           ('act4', 'S3.06'): 0.8, ('act4', 'S4.09'): 0.5, ('act4', 'S5.02'): 1.0, ('act4', 'S7.01'): 0.8,
           ('act4', 'S7.05'): 0.6, ('tag', '32.01'): 0.6,
           # v3.1: the act opens on the rack's fans under the black; Neleh's office clock under the whip
           ('act3', 'v31-18.00'): 1.0, ('act4', 'v31-S3.00p'): 0.6,
           # v3.2: the lobby by day under S4.08's dial tone; the hall growing through the black glass into 22.01
           ('act4', 'v32-S5.00'): 0.8, ('act3', '22.01'): 1.0}
# per lock (v3.3 17.13's plan J-cut: "the rack's fans and LED ticks under the black (Act Three's arrival)", lead_s 0.6;
# the glass (17.12) is cut, so the black is Act Two's last beat and Act Three's room comes in 0.6 s before the act)
LEAD_AT_LOCK = {'v33': {('act3', 'v31-18.00'): 0.6}, 'v34': {('act3', 'v31-18.00'): 0.6},
                # v3.5 (the v3.5 plans' J-cuts): 2018's fans under the thought's tail (v35-12.03, 0.8 s); the phone's
                # ring becomes the plane's hum (v35-41.06 L-cut, 0.5 s); the hum becomes the dark room (v35-42.01, 0.6 s)
                'v35': {('act3', 'v31-18.00'): 0.6, ('act1', 'v35-13.01'): 0.8, ('act4', 'v35-42.01'): 0.5,
                        ('act4', 'S2.01'): 0.6,
                        # v3.5b (SN 00000A, lock-v35 §10): the racks' fans lead the cut 0.5 s; the party's walla with its
                        # cheer, 0.4 s early
                        ('act2', 'v35-30A.01'): 0.5, ('act3', 'v35-32A.01'): 0.4}}
# v3.5's new rooms, only on that lock (older locks never had these (segment, room) pairs mapped): 3 AM, the lamp and the
# vision post in Act One's bullpen at night; JUN 2018's first office (its racks' fans and ATOD's tinny arena); MAR 2019's
# office (an old fan); the tour's phone inserts ride the run's street; the flight (the cabin); Alyi alone (the bullpen)
RECIPE_LOCK = {'v35': {('act1', 'bullpen-night'): 'bullpen-night', ('act1', 'office_night'): 'office-2018',
                       ('act2', 'office'): 'office-2019', ('act2', 'phone'): 'street', ('act4', 'none'): 'plane',
                       ('act4', 'bullpen-night'): 'bullpen-night',
                       ('act2', 'racks'): 'racks', ('act3', 'party'): 'party'}}          # v3.5b's added scenes
ROOM_OVERRIDE_LOCK = {'v35': {('act4', 'v35-43.01'): 'tpool-2008', ('act4', 'v35-43.02'): 'tpool-2008'}}   # TPOOL (plan: office)
TRAIL_AT_LOCK = {'v35': {('act4', 'v35-41.06'): 0.5, ('act4', 'v35-42.01'): 0.6,
                         # v3.5b: the racks' fans stop on the cut (the bell rings on); the walla drains into the dark room
                         ('act2', 'v35-30A.02'): 0.02, ('act3', 'v35-32A.03'): 0.6}}
# a lead that depends on the beat before (v3.2: S4.09 after v32-S5.00, whose picture steps into the CCTV's grade from
# his look up at k126, so the CCTV hum comes in there: the L-cut "carried into S4.09")
LEAD_AFTER = {('act4', 'S4.09', 'v32-S5.00'): 2.6}
TRAIL_AT = {('act2', '13.14'): 1.0, ('act4', 'S8.10'): 0.6, ('act1', '12.06'): 0.05, ('act2', '17.12'): 0.1,
            ('act3', '23.03'): 0.25,
            ('act4', 'v32-S5.00'): -2.4}   # negative: fade out over the run's last 2.4 s (the lobby gives way to the CCTV)
# a sound J-cut naming a beat's own sound: the first such sound starts lead_s before the cut
OWN_LEAD = {('act1', '12.01'): ('ui_toast_pop', 0.4), ('act1', '12.04'): ('synth:pen', 0.5),
            ('act3', '20.01'): ('synth:keys', 0.4), ('act4', 'S4.01'): ('heart_gliss', 0.5),
            ('act4', 'S6.01'): ('landing_thunk', 0.4),
            ('act3', 'v35-32A.01'): ('synth:cheer', 0.4)}     # v3.5b: the party's cheer takes the cut 0.4 s early
OWN_LEAD_V31 = {('act3', '20.01'): ('synth:keys', 0.5)}        # v3.1's plan: "his keys, under the runner's last beat"
# a J-cut that only makes sense after a given beat (12.04's pen was "under Nole's last word": in v3.1 EMIT's THUD,
# whose own pen comes in under its tail, sits between them)
OWN_LEAD_AFTER = {('act1', '12.04'): '12.02'}
# ... and one that doesn't after a given beat (v3.5b: 20.01's keys pre-lap would fall under the party's laugh)
OWN_LEAD_NOT_AFTER = {('act3', '20.01'): 'v35-32A.03'}
# ... or the NEXT beat's sound (15.18: "the tour's first stamp thunk" leads 16.01)
NEXT_OWN_LEAD = {('act2', '15.18'): ('16.01', ('rubber_stamp_C', 'synth:stab'), 0.3),
                 ('act2', '15.16'): ('16.01', ('rubber_stamp_C', 'synth:stab'), 0.5),     # (v3.1: 15.17-15.18 cut)
                 ('act2', '15.14'): ('16.01', ('rubber_stamp_C', 'synth:stab'), 0.5)}     # (v3.2: moved from 15.16)
# (v3.5's plan v35-28.05 J-cut, "the gavel's knock becomes a passport stamp (29.01)" 0.2 s, is not laid: the act2 score
#  plays its knee stab on stamp 1 where the timeline has it (29.01 + 0.3 s, its sync 147.883 s), as at 16.01 in v3.2)
# per-beat overrides of a timeline sound: its peak, or what it is
# a beat's pop per copy on screen: keep only as many of the sound as there are lines by that kind of speaker
# (the lead, v3.1: 21.02 shows one deepfake copy; the timeline still carries the second copy's pop)
ONE_PER_LINE = {('act3', '21.02'): ('tower_pop', 'deepfake')}
# a timeline sound laid on another beat: (target beat, from its 'start' or 'end', offset s); its loudest sample lands there
# (the lead, v3.1: the laptop now closes in 10.04, "the lid half down, held 4 frames, then shut, held 16")
MOVE_SOUND = {('act1', '9.13', 'folder_close'): ('v31-10.04', 'end', -16 / FPS)}
# a timeline sound laid relative to a word in its beat: (word, offset s, 'onset' | 'peak'). v3.2 15.15: the cut to the
# HIGH is on "licenses" (k68); the slide's first step lands 10 frames later, the stamp 42 frames later (shots-act2 §2)
MOVE_WORD = {('act2', '15.15', 'folder_slide'): ('licenses', 10 / FPS, 'onset'),
             ('act2', '15.15', 'rubber_stamp_C'): ('licenses', 42 / FPS, 'peak')}
# sounds the timeline doesn't have: (sound, anchor, peak dBFS, why). anchor: ('sound', name, offset s)
ADD_SOUND = {('act1', '11.04'): [('dialog_ok_click', ('sound', 'synth:cheer', -6 / FPS), -12.0,
                                  "the click that ships GTP-4: launch night's click (5.08's), 6 frames before the cheer")],
             # v3.3 (script-v33-notes §6, shots-act1 §13): Tasya's hand settles the collar; on the stick's
             # key_ring_jangle_3 the ring swings against it (the picture's clink at k21, one frame before the jangle's
             # 0.9 s): the gold clasp's small clink, under the ring's
             ('act1', '9.09'): [('CLASP', ('sound', 'key_ring_jangle_3', 21 / FPS - 0.9), -31.0,
                                 "the collar's clasp: the key ring swings against it as her hand settles it (k21)")]}
SOUND_GAIN = {('act4', 'S7.13', 'hourglass_shatter'): -10.0}
# a sound that ends relative to its beat's end: (s after the beat's end, fade s). v3.3 (X1): S4.08's dial tone is a loop
# file that ended hot 1.7 s into the lobby walk-in; it now hands over just after the cut, under the lobby's lead
SOUND_UNTIL = {('act4', 'S4.08', 'DIALTONE'): (0.25, 0.35)}  # runway.md §11.6: "larger than the -18 dB spot"; now real glass
SOUND_SUB = {('act4', 'S5.09', 'RING'): 'RINGBACK',
             ('act1', 'v32-7.03', 'call_ring'): 'RING_PHONE',   # v3.2: "one ring through a phone filter"
             ('act4', 'S5.11', 'folder_slide'): 'BADGE_SLIDE'}  # v3.2: the badge's slide on the floor           # v3.1: "he ... clicks GERG. It rings out." (an outgoing ring)


def lift_to_floor(x, name, log):
    """raise a room until its quiet windows clear ROOM_FLOOR (capped): bursty beds read low in 50 ms windows"""
    w = win_db(x[: min(len(x), 90 * SR)])
    p5 = float(np.percentile(w, 5)) if len(w) > 4 else -120.0
    lift = float(np.clip(ROOM_FLOOR - p5, 0.0, ROOM_LIFT_MAX)) if p5 > -80 else 0.0
    log.append({'room': name, 'p5_50ms_dbfs': round(p5, 1), 'lift_db': round(lift, 1)})
    return x * np.float32(db(lift)), lift


def room_signal(key, n, t0, ctx):
    """a stereo room bed of n samples starting at block time t0"""
    r = reseed('room', key, round(t0, 3), n)
    z = lambda: np.zeros((n, 2), 'float32')
    if key == 'card':
        return loop('room_tone', n, -38, rng=r)
    if key == 'bullpen-a1':
        return loop('server_hum', n, -37, rng=r) + loop('neon_buzz', n, -49, rng=r)
    if key == 'basement':
        return loop('server_hum', n, -35, lambda x: lp(x, 900), 'lp900', rng=r)
    if key == 'phone':                     # the bullpen, and Elgoog's lobby through his phone's small speaker
        m = bp(r.standard_normal(n), 500, 3400) * smooth_noise(r, n, 4.0, 0.2, 1.0)
        m = st(m) * np.float32(db(-47 - lufs(st(m[: 20 * SR]))))
        return loop('server_hum', n, -38, rng=r) + loop('neon_buzz', n, -50, rng=r) + m.astype('float32')
    if key == 'lobby-a1':                  # the NopeAI lobby: room tone and, now and then, far steps on the stone
        x = loop('room_tone', n, -37, rng=r)
        t = r.uniform(0.8, 2.5)
        while t < n / SR - 0.6:
            s = lp(load(f'footstep_hard_{int(r.integers(1, 5))}').astype('float64'), 2200)
            add(x, s * db(-38 - r.uniform(0, 5)), t)
            t += r.uniform(1.8, 4.5)
        return x
    if key == 'split-a1':                  # the bullpen | the lighthouse (its wind in the right pane)
        return (loop('server_hum', n, -37, rng=r) + loop('neon_buzz', n, -49, rng=r)
                + loop('bed_lighthouse', n, -45, rng=r) * np.array([[0.3, 1.0]], 'float32'))
    if key == 'dark-desk':
        return loop('room_tone', n, -41, lambda x: lp(x, 1500), 'lp1500', rng=r)
    if key in ('whitehouse', 'bullpen-night', 'bay', 'senate', 'rooftop'):
        x = np.asarray(A2.room_kind(key, n / SR)[:n], 'float32')
        # a steady floor under the v2 recipes, whose gusts, laps and ticks leave lulls (they were built to sit under a
        # ducked temp score): the room's air (the white house, the senate), the wind's own body (the rooftop), the bay's
        if key in ('whitehouse', 'senate', 'bullpen-night'):
            x = x + loop('room_tone', n, -45, lambda y: lp(y, 2500), 'lp2500', rng=r)
        elif key == 'rooftop':
            w = lp(r.standard_normal((n, 2)), 420)
            x = x + (w * db(-44 - lufs(w[: 20 * SR]))).astype('float32')
        elif key == 'bay':
            w = lp(r.standard_normal((n, 2)), 300)
            x = x + (w * db(-46 - lufs(w[: 20 * SR]))).astype('float32')
        return x
    if key == 'devday':                    # v3.2 22.01: DevDay, live: a big hall, a few thousand people settling
        crowd = loop('bed_allhands', n, -40, lambda y: lp(y, 3000), 'lp3000', rng=r)
        air = loop('room_tone', n, -44, rng=r)
        return (distant(crowd.astype('float64') + air) * db(2.0)).astype('float32')
    if key == 'street':                    # the poster run (16.01): a far street under the stamps
        a = lp(r.standard_normal((n, 2)), 160) * 0.8 + bp(r.standard_normal((n, 2)), 300, 1500) * smooth_noise(r, n, 0.3, 0.1, 0.6)[:, None]
        return (a * db(-44 - lufs(a[: 20 * SR]))).astype('float32')
    if key == 'dark':                      # the dark room: the rack's fans, the air, a low drone, the cyan key, the LEDs
        x = (loop('server_hum', n, -41, lambda x: lp(x, 1400), 'lp1400', rng=r) + loop('room_tone', n, -47, rng=r)
             + loop('room_drone', n, -50, rng=r) + loop('neon_buzz', n, -60, lambda x: bp(x, 1000, 4000), 'bp1-4k', rng=r))
        leds(x, t0, ctx)
        return x
    if key == 'suite':                     # HVAC; the Strip far below; the circuit's diesel working far off
        strip = lp(r.standard_normal((n, 2)), 220) * (0.6 + 0.4 * smooth_noise(r, n, 0.15))[:, None]
        strip = strip * db(-47 - lufs(strip[: 20 * SR]))
        tt = np.arange(n) / SR
        fire = (np.sin(2 * np.pi * 23 * tt) > 0.55).astype('float64')
        dsl = lp(fire * r.standard_normal(n) * 0.8 + np.sin(2 * np.pi * 46 * tt) * 0.4, 300) * smooth_noise(r, n, 0.2, 0.5, 1.0)
        dsl = st(dsl) * db(-51 - lufs(st(dsl[: 20 * SR])))
        return loop('bed_suite', n, -38, rng=r) + strip.astype('float32') + dsl.astype('float32')
    if key == 'office-2018':               # v3.5 JUN 2018: the first office at night: the racks' fans (INVIDIA's boxes),
        # the desk towers' fans and mains hum, the air (ATOD's tinny arena is v35_layers', unless the score claims it)
        return (loop('server_hum', n, -38, lambda y: lp(y, 2600), 'lp2600', rng=r) + pc_fan(r, n)
                + loop('room_tone', n, -46, rng=r))
    if key == 'office-2019':               # v3.5 MAR 2019: an office by day and an old box fan (its blades, its motor)
        tt = np.arange(n) / SR
        air = lp(r.standard_normal((n, 2)), 1100) * (1 + 0.12 * np.sin(2 * np.pi * 11.3 * tt))[:, None]
        fan = air + st(np.sin(2 * np.pi * 118 * tt) * 0.3 + np.sin(2 * np.pi * 236 * tt) * 0.12) * 0.25
        return loop('bed_office_day', n, -40, rng=r) + level_to(fan, -44)
    if key == 'plane':                     # v3.5 the flight: a small jet's cabin (the engines' low roar, the air, a whine)
        tt = np.arange(n) / SR
        roar = lp(r.standard_normal((n, 2)), 320, 2) * (0.9 + 0.1 * smooth_noise(r, n, 0.5))[:, None]
        air = bp(r.standard_normal((n, 2)), 600, 3500) * 0.18
        whine = st(np.sin(2 * np.pi * 1870 * tt + 0.8 * np.sin(2 * np.pi * 0.21 * tt))) * 0.006
        drone = st(np.sin(2 * np.pi * 96 * tt) + 0.5 * np.sin(2 * np.pi * 97.3 * tt)) * 0.05
        return level_to(roar + air + whine + drone, -37)
    if key == 'racks':                     # v3.5b Act Two's racks: the data hall's cold aisle, the fans up close, their air
        return (loop('server_hum', n, -34, rng=r) + level_to(bp(r.standard_normal((n, 2)), 2000, 7000), -48)
                + loop('room_tone', n, -46, rng=r))
    if key == 'party':                     # v3.5b Act Three's launch party (Sep 25, 2023): the staff's walla in the bullpen
        m = bp(r.standard_normal((n, 2)), 300, 2400) * smooth_noise(r, n, 3.0, 0.3, 1.0)[:, None]
        return loop('bed_allhands', n, -35, rng=r) + level_to(m, -41)
    if key == 'tpool-2008':                # v3.5 TPOOL at 240p: the TPOOL room, and the 2008 camcorder's tape hiss
        x = loop('bed_tpool', n, -40, rng=r) + loop('room_tone', n, -44, lambda y: lp(y, 1800), 'lp1800', rng=r)
        return x + level_to(bp(r.standard_normal((n, 2)), 3000, 9000), -52)
    beds = {'tpool': ('bed_tpool', -40), 'office_night': ('bed_office_evening', -40), 'boardroom': ('bed_boardroom_night', -39),
            'cctv': ('bed_cctv', -40), 'bullpen-day': ('bed_bullpen_packing', -38), 'fires': ('bed_fires', -37),
            'coda': ('bed_bullpen_unpack', -40), 'allhands': ('bed_allhands', -36), 'office': ('bed_office_day', -39),
            'lobby-night': ('bed_lobby_night', -38)}
    if key == 'split-a4':                  # the boardroom | the lighthouse
        return (loop('bed_boardroom_night', n, -41, rng=r) * np.array([[1.0, 0.35]], 'float32')
                + loop('bed_lighthouse', n, -43, rng=r) * np.array([[0.35, 1.0]], 'float32'))
    if key in beds:
        x = loop(beds[key][0], n, beds[key][1], rng=r)
        if key == 'tpool':                 # the flashback's bed breathes in and out: keep an air under it
            x = x + loop('room_tone', n, -44, lambda y: lp(y, 1800), 'lp1800', rng=r)
        tt = t0 + np.arange(n) / SR
        if key == 'office':                # Neleh's office: the clock-tick (tick, tock, once a second)
            m = int(0.03 * SR)
            k = np.arange(m) / SR
            for j in range(int(n / SR)):
                f0 = 2300 if j % 2 == 0 else 1900
                c = bp(r.standard_normal(m), f0 * 0.7, f0 * 1.4) * np.exp(-k / 0.006)
                add(x, st(c) * db(-47) / (np.abs(c).max() + 1e-9), j + 0.41)
        if key == 'allhands' and ctx.get('hush'):          # the crowd hushes for the question and stays hushed
            a, b = ctx['hush']
            x *= db(np.interp(tt, [a, b], [0.0, -7.0])).astype('float32')[:, None]
            x += loop('room_tone', n, -41, rng=r)            # the room's air stays
        if key == 'lobby-night' and ctx.get('neon_on'):      # the lobby sign's neon, buzzing on F once it lights
            on = int(max(0, (ctx['neon_on'] - t0) * SR))
            if on < n:
                nb = loop('neon_buzz', n - on, -45, rng=r)
                add(x, pfade(nb, 0.08, 0.0), on / SR)
        return x
    return z()


def level_to(x, target):
    """x at `target` LUFS, measured on its first 10 s (at least 0.5 s: shorter is measured tiled)"""
    x = np.asarray(x, dtype='float64')
    m = x[: 10 * SR]
    if len(m) < int(0.5 * SR):
        m = np.concatenate([m] * (int(0.5 * SR) // max(1, len(m)) + 1))
    v = lufs(m)
    return (x * db(target - v)).astype('float32') if v > -90 else np.zeros(x.shape, 'float32')


def leds(x, t0, ctx):
    """the rack's LEDs ticking in straight eighths (a 12 ms 3.3 kHz tick), out in ctx['led_off'] windows"""
    bpm, g0 = ctx.get('grid') or (96.0, 0.0)
    step = 60.0 / bpm / 2
    n = len(x)
    m = int(0.012 * SR)
    tt = np.arange(m) / SR
    tick = st(np.sin(2 * np.pi * 3300 * tt) * np.exp(-tt / 0.002) * np.minimum(1, tt / 0.001)).astype('float32') * np.float32(db(LED_PEAK))
    k0 = int(np.ceil((t0 - g0) / step))
    k = k0
    while True:
        t = g0 + k * step
        if t >= t0 + n / SR - 0.02:
            break
        near_cut = any(abs(t - c) < 0.04 for c in ctx.get('run_edges', []))   # v3.3 (X4): no tick on a room change
        if not near_cut and not any(a <= t < b for a, b in ctx.get('led_off', [])):
            add(x, tick * (1.0 if k % 2 == 0 else 0.7), t - t0)
        k += 1


def word_time(g, i, word):
    """the start (segment clock) of the first word in beat i's lines that begins with `word`"""
    for l in g.beats[i]['lines']:
        for w in l.get('words', []):
            if w[0].lower().strip('.,!?…"\'').startswith(word.lower()):
                return g.starts[i][0] + l['t'] + w[1]
    return None


def silence_click(g):
    """(beat, at) of the click that starts THE ONE SILENCE: v3.1's Remove dialog (v31-S1.08d), else v3's Cancel (S1.09)"""
    for bid in ('v31-S1.08d', 'S1.09'):
        if g.has(bid):
            c = [sd['at'] for sd in g.beats[g.BI[bid]].get('sounds', []) if 'click' in sd['name']]
            if c:
                return bid, c[-1]
    return ('S1.09', 2.4) if g.has('S1.09') else None


def room_runs(segs):
    """[(key, a, e, first_beat, last_beat, seg_first, seg_last)] on the block clock"""
    runs = []
    for name in BLOCK:
        g = segs[name]
        if name == 'card':
            runs.append(['card', g.off, g.off + g.total, ('card', 'card.01'), ('card', 'card.01')])
            continue
        for i, b in enumerate(g.beats):
            raw = b.get('room') or ''
            ovr = {**ROOM_OVERRIDE, **ROOM_OVERRIDE_LOCK.get(LOCK, {})}
            if (name, b['id']) in ovr:
                key = ovr[(name, b['id'])]
            else:
                key = {**RECIPE, **RECIPE_LOCK.get(LOCK, {})}.get((name, raw))
            a, e = g.off + g.starts[i][0], g.off + g.starts[i][1]
            if runs and runs[-1][0] == key:
                runs[-1][2] = e
                runs[-1][4] = (name, b['id'])
            else:
                runs.append([key, a, e, (name, b['id']), (name, b['id'])])
    return runs


# ------------------------------------------------------------------ sounds
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


JANGLE = {}
LAID = {}     # v3.3: seg -> [(start, end, name)] of every script SFX laid, so the click scan can tell a sample's own
              # envelope (a click's fast decay, inside its body) from a truncation (at its laid end)


def make_sound(seg, name, dur, align, r, beat_id):
    name = NAMED.get(name, name)
    if name == 'JANGLE':                  # a key ring, once: alternate the board's takes so the two differ
        k = JANGLE.setdefault(seg, 0)
        JANGLE[seg] = k + 1
        return load(('key_ring_jangle_1', 'key_ring_jangle_3')[k % 2]).astype('float64'), 0.0
    if name == 'DTMF':
        return dtmf(r, dur or 0.9), 0.0
    if name == 'RINGBACK':                # the call going out, heard through the monitor
        return bp(load('speakerphone_ringback').astype('float64'), 300, 3400), 0.0
    if name == 'RING_PHONE':              # one ring of a phone on the desk, through its own small speaker
        x = load('call_ring').astype('float64')
        return bp(x[: int(1.1 * SR)], 500, 3400, 4), 0.0
    if name == 'CLASP':                   # a small gold clasp touched by a steel key: two bright inharmonic partials, a
        n = int(0.16 * SR)                # 1.5 ms tick, gone in about 120 ms (soft; under the ring's own jangle)
        tt = np.arange(n) / SR
        y = sum(a_ * np.sin(2 * np.pi * f_ * tt + r.uniform(0, 6.28)) * np.exp(-tt / d_)
                for f_, a_, d_ in ((3310, 1.0, 0.030), (5170, 0.55, 0.018), (7940, 0.3, 0.010)))
        y = y * np.minimum(1, tt / 0.0008) + bp(r.standard_normal(n), 3000, 9000) * np.exp(-tt / 0.0015) * 0.5
        y[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
        return st(y), 0.0
    if name == 'BADGE_SLIDE':             # a plastic card skidding across a wooden floor, slowing
        n = int(0.75 * SR)
        tt = np.arange(n) / SR
        sc = bp(r.standard_normal(n), 900, 5200) * (0.55 + 0.45 * np.sin(2 * np.pi * (38 - 30 * tt / tt[-1]) * tt))
        body = lp(r.standard_normal(n), 500) * 0.4
        e = np.minimum(1, tt / 0.02) * (1 - tt / tt[-1]) ** 1.5
        return st((sc + body) * e), 0.0
    if name.endswith('@1bit'):
        return CO.one_bit(load(name[:-5]).astype('float64')), 0.0
    if name.startswith('synth:'):
        kind = name[6:]
        for m in PREFER[seg]:
            try:
                x = m.synth(kind) if m in (CO, TG) else m.synth(kind, dur)
                x = np.asarray(x, dtype='float64')
                return (x if x.ndim == 2 else st(x)), 0.0
            except (KeyError, TypeError, ValueError):
                continue
        raise KeyError(name)
    x = load(name).astype('float64')
    if dur:                               # truncated by its dur: a 50 ms tail fade (the rule's minimum is 20 ms)
        x = x[: int(dur * SR)].copy()
        k = min(len(x), int(0.05 * SR))
        x[len(x) - k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    off = float(np.argmax(np.abs(x).max(axis=1))) / SR if align == 'peak' else 0.0
    return x, off


def duck_u(speech, N, t_off=0.0):
    """how far into the lock mixer's duck each sample is (0.25 s pre, spans joined across gaps under 2.5 s,
    0.2 s attack, 0.6 s release), on a bus that starts at block time t_off"""
    CR = 1000
    n = int(N / SR * CR) + 2
    spans = []
    for a, b in sorted(speech):
        s = [a - t_off - 0.25, b - t_off + 0.1]
        if spans and s[0] - spans[-1][1] < 2.5:
            spans[-1][1] = max(spans[-1][1], s[1])
        else:
            spans.append(s)
    u = np.zeros(n)
    t = np.arange(n) / CR
    for a, b in spans:
        i0, i1 = max(0, int((a - 0.2) * CR)), min(n, int(np.ceil((b + 0.6) * CR)))
        tt = t[i0:i1]
        v = np.where(tt < a, (tt - (a - 0.2)) / 0.2, np.where(tt > b, 1 - (tt - b) / 0.6, 1.0))
        u[i0:i1] = np.maximum(u[i0:i1], np.clip(v, 0, 1))
    return lambda ts: float(np.interp(ts - t_off, t, u))


def typing(r, dur, src='typing_fast_loop', burst=(0.6, 1.6), gap=(0.15, 0.55)):
    """typing in bursts with thought-gaps, cut from a board loop"""
    k = load(src).astype('float64')
    n = int(dur * SR)
    out = np.zeros((n + 3 * SR, 2))
    t = 0.0
    while t < dur:
        b = r.uniform(*burst)
        a = int(r.uniform(0, max(0.01, len(k) / SR - b)) * SR)
        seg = k[a: a + int(b * SR)].copy()
        f = min(len(seg), int(0.012 * SR))
        seg[:f] *= np.linspace(0, 1, f)[:, None]
        g = min(len(seg), int(0.05 * SR))
        seg[len(seg) - g:] *= np.linspace(1, 0, g)[:, None]
        i = int(t * SR)
        out[i:i + len(seg)] += seg * r.uniform(0.75, 1.0)
        t += b + r.uniform(*gap)
    return out[:n]


def dense(x, drive=2.0):
    """normalise to peak 1 and soft-saturate (tanh): a typing layer ~3 dB denser at the same peak"""
    x = x / (np.abs(x).max() + 1e-9)
    return np.tanh(drive * x) / np.tanh(drive)


def gain_curve(n, t0, pts):
    """a gain (dB) through (block time, dB) points, linear in dB"""
    ts = t0 + np.arange(n) / SR
    return db(np.interp(ts, [p[0] for p in pts], [p[1] for p in pts]))[:, None]


def gate(n, t0, windows, fade=0.03):
    """1 outside the windows, 0 inside, with short linear fades"""
    g = np.ones(n)
    ts = t0 + np.arange(n) / SR
    for a, b in windows:
        g = np.minimum(g, np.clip(np.maximum((a - ts) / fade, (ts - b) / fade), 0, 1))
    return g[:, None]


def chip_note(f0, dur, duty=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = (f0 * t) % 1.0
    return lp(np.where(ph < duty, 1.0, -1.0) * np.exp(-t / (dur / 3)) * np.minimum(1, t / 0.002), 5000)


def lap_pass(r, dur, f_base=560.0):
    """a race car's practice lap, far off: an engine climbing through gears, a Doppler fall as it passes, the
    distance taking the top off"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    gear = 1.7
    rpm = 0.78 + 0.22 * ((t % gear) / gear) ** 0.7
    tc = dur * r.uniform(0.42, 0.55)
    dop = 1 + 0.07 * np.tanh((tc - t) / 0.5)
    f = f_base * rpm * dop
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph + r.uniform(0, 6)) / k ** 0.8 for k in range(1, 7))
    x = x + 0.25 * bp(r.standard_normal(n), 900, 3200) * (0.5 + 0.5 * np.sin(ph))
    env = np.exp(-0.5 * ((t - tc) / (dur * 0.2)) ** 2) + 0.08 * np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.5)
    x = hp(lp(x * env, 2000, 4), 150)
    pan = np.clip(0.5 + 0.45 * np.tanh((t - tc) / 1.0), 0.05, 0.95)
    return np.stack([x * (1 - pan) * 1.4, x * pan * 1.4], 1)


def distant(x):
    """far off: the top gone and the walls answering (three late, duller copies)"""
    y = lp(x, 2200, 2)
    out = y.copy()
    for d, g, c in ((0.045, -7, 1600), (0.11, -10, 1200), (0.19, -13, 900)):
        k = int(d * SR)
        out[k:] += lp(y, c, 2)[:-k] * db(g)
    return out


def pc_fan(r, n):
    """a 1993 beige box under the flashback: its fan, its mains hum"""
    tt = np.arange(n) / SR
    fan = bp(r.standard_normal((n, 2)), 90, 900) * (1 + 0.08 * np.sin(2 * np.pi * 37 * tt))[:, None]
    hum = (np.sin(2 * np.pi * 120 * tt) * 0.25 + np.sin(2 * np.pi * 240 * tt) * 0.1 + np.sin(2 * np.pi * 360 * tt) * 0.05)
    x = fan + st(hum) * 0.4
    return (x * db(-41 - lufs(x[: 10 * SR]))).astype('float32')


def tick_sound(r):
    """an egg timer's tick: a 20 ms mechanical click with a 2.9 kHz ring (v2's)"""
    n = int(0.02 * SR)
    tt = np.arange(n) / SR
    return st(bp(r.standard_normal(n), 2000, 7000) * np.exp(-tt / 0.003) + np.sin(2 * np.pi * 2900 * tt) * np.exp(-tt / 0.004) * 0.5)


def crush_sweep(r, dur, up=False):
    """a bit-crush-to-clean (or clean-to-crush) sweep on thin stream noise: the grid dissolving (or returning)"""
    n = int(dur * SR)
    x = bp(r.standard_normal(n), 300, 5000)
    out = np.zeros(n)
    for i0 in range(0, n, 480):
        u = i0 / max(1, n - 1)
        u = u if up else 1 - u                        # 1 = crushed
        bits, hold = 2 + (1 - u) * 10, int(1 + u * 23)
        seg = x[i0:i0 + 480]
        y = np.repeat(seg[::hold], hold)[:len(seg)]
        q = 2 ** (bits - 1)
        out[i0:i0 + len(seg)] = np.round(y * q) / q
    e = np.sin(np.pi * np.arange(n) / n) ** 0.7
    return st(out * e)


def click(r, hard=False):
    """a small digital click (a dropped frame), or a drier, harder slide-change click"""
    n = int((0.03 if hard else 0.012) * SR)
    tt = np.arange(n) / SR
    x = bp(r.standard_normal(n), 1500, 9000) * np.exp(-tt / (0.002 if not hard else 0.004))
    if hard:
        x = x + lp(r.standard_normal(n), 900) * np.exp(-tt / 0.006) * 1.5
    return st(x)


def demo_sheen(r, n):
    """the demo film's bright product-film bed: a clean E-flat major 9 pad (no A natural, no F bass) and a slow shimmer"""
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for f0, a in ((155.56, 0.9), (233.08, 0.7), (293.66, 0.55), (349.23, 0.45), (392.0, 0.4), (466.16, 0.35)):
        for d, pan in ((1.0023, 0.3), (0.9977, 0.7)):
            w = 2 * np.pi * f0 * d * t + r.uniform(0, 6.28)
            v = (np.sin(w) + 0.18 * np.sin(2 * w) + 0.05 * np.sin(3 * w)) * a
            out[:, 0] += v * (1 - pan)
            out[:, 1] += v * pan
    sh = sum(np.sin(2 * np.pi * f * t + r.uniform(0, 6.28)) * (0.5 + 0.5 * np.sin(2 * np.pi * rate * t))
             for f, rate in ((1174.66, 0.23), (1396.9, 0.31), (1864.66, 0.17)))
    out += np.stack([sh, np.roll(sh, int(0.011 * SR))], 1) * 0.12
    return lp(out, 12000)


def laugh(r, dur=1.4, voices=10):
    """a small audience laughing, as heard through a monitor: 'ha' pulses from a few voices, never in unison"""
    n = int(dur * SR)
    out = np.zeros(n)
    for v in range(voices):
        t0 = r.uniform(0, 0.25)
        rate = r.uniform(4.2, 6.0)
        k = int(r.integers(3, 6))
        f1 = r.uniform(650, 950)
        for j in range(k):
            ts = t0 + j / rate
            m = int(0.12 * SR)
            i = int(ts * SR)
            if i + m >= n:
                break
            tt = np.arange(m) / SR
            e = np.minimum(1, tt / 0.012) * np.exp(-tt / 0.05) * (1 - 0.15 * j)
            out[i:i + m] += bp(r.standard_normal(m), f1 * 0.7, f1 * 2.2) * e * r.uniform(0.5, 1.0)
    return st(bp(out, 400, 3500))


def v31_layers(segs, hints, qa, room, fx, note):
    """the v3.1 lock's new sounds (each only if its beats exist, so the v3 lock is untouched by it)"""
    G1, G3, G4, T = segs['act1'], segs['act3'], segs['act4'], segs['tag']
    mon = lambda y: bp(y, 250, 5000)
    # ACT ONE: Sydney's egg timer, "ticking in its tempo" (the lobby cue's, measured), from the clip (10.03) to its
    # ding (10.04), reset to 5 under the lid's close, carrying the match cut two bars into the duel (as v2)
    if G1.has('v31-10.03') and G1.has('v31-10.04') and G1.has('11.01'):
        h1 = hints.get('act1') or {}
        gl, gd = h1.get('grid_lobby'), h1.get('grid_duel')
        bl = gl[0] if gl else BUILD_BPM
        clip = next((sd['at'] for sd in G1.beats[G1.BI['v31-10.03']].get('sounds', []) if sd['name'].startswith('pen_tick')), 0.9)
        ding = next((sd['at'] for sd in G1.beats[G1.BI['v31-10.04']].get('sounds', []) if sd['name'].startswith('bell_ding')), 0.3)
        t_clip, t_ding, cut = G1.s('v31-10.03', clip), G1.s('v31-10.04', ding), G1.s('11.01')
        # v3.5 (check-v35 must-fix 1): the window (v35-18.01) now follows Sydney's scene, so the timer stops at that cut
        # (the last tick 50 ms clear of it) and does not carry into the duel
        stop_at = G1.s('v35-18.01') if G1.has('v35-18.01') else None
        beat_l = 60 / bl
        ph = (G1.off + gl[1]) if gl else cut                  # the lobby cue's beat, else the cut on a beat
        bd = 60 / (gd[0] if gd else BUILD_BPM)
        r = reseed('egg-timer')
        tk = to_peak(tick_sound(r), EGG_PEAK)
        times = []
        t = ph + np.ceil((t_clip + 0.25 - ph) / beat_l) * beat_l
        while t < (stop_at - 0.05 if stop_at is not None else cut - 1e-3):
            if not (t_ding - 0.15 < t < t_ding + beat_l - 0.05):    # the ding, then it starts again (reset to 5)
                times.append(t)
            t += beat_l
        t = cut
        while stop_at is None and t < cut + 8 * bd - 1e-3:     # two bars into the duel, on its grid, fading
            times.append(t)
            t += bd
        for j, t in enumerate(times):
            gdb = 0.0 if t < cut + 4 * bd else -6.0 * (t - (cut + 4 * bd)) / (4 * bd)
            add_fx(fx, tk * (1.0 if j % 2 == 0 else 0.72) * db(gdb), t)
        note('act1', "Sydney's egg timer ticking (in the lobby cue's tempo), the ding, the reset, across the match cut",
             at=round(t_clip + 0.25 - G1.off, 2), to=round(times[-1] - G1.off, 2) if times else None, peak_dbfs=EGG_PEAK,
             bpm=round(bl, 2), bpm_from='the score (measured)' if gl else 'the default', ticks=len(times),
             why='v3.1 mood: "the egg timer ticks in its tempo and carries the match cut into the duel (as v2)"; '
                 'plan v31-10.04 jcut "the egg timer\'s tick (reset to 5) under the lid\'s close"; script-v31-notes §4 For sound')
    # ACT THREE: the hands runner's first item: the monitor down to a murmur, and a laugh from her audience
    if G3.has('v31-19.02'):
        r = reseed('runner-laugh')
        a = G3.s('v31-19.02')
        m = to_peak(mon(np.asarray(A3.synth('murmur', 3.2), 'float64')), -34)
        add_fx(fx, pfade(m, 0.2, 0.4), a + 0.1)
        lg = to_peak(mon(laugh(r)), -30)
        add_fx(fx, pfade(lg, 0.02, 0.3), a + 1.7)
        note('act3', 'the monitor down to a murmur, and a laugh from her audience', at=round(a + 0.1 - G3.off, 2), peak_dbfs=-30,
             why='plan v31-19.02 sounds: "the monitor down to a murmur and a laugh from her audience"')
    # ACT FOUR: the laptop pings with the invite (S1.02)
    if G4.has('S1.02') and G4.has('S1.07'):
        x = to_peak(bp(load('call_join_chime').astype('float64'), 300, 5000), -24)
        add_fx(fx, x, G4.s('S1.02', 0.5))
        note('act4', 'the JOIN ping (the laptop, the invite)', at=round(G4.s('S1.02', 0.5) - G4.off, 2), peak_dbfs=-24,
             why='S1.02 caption: "The laptop pings: BOARD · VIDEO CALL · JOIN"; script-v31-notes §4 For sound')
    # ACT FOUR: the phones on the boardroom table, set in a row and still buzzing (S4.09)
    if G4.has('S4.09'):
        r = reseed('phones-row')
        a, e = G4.s('S4.09'), G4.e('S4.09')
        pts = [(0.25, 1, -26), (0.8, 2, -27), (1.35, 3, -26), (1.9, 4, -28)]
        t = 2.4 + r.uniform(0.8, 1.6)
        while a + t < e - 1.2:
            pts.append((t, int(r.integers(1, 5)), -33))
            t += r.uniform(2.2, 3.8)
        for d, k, pk in pts:
            add_fx(fx, to_peak(load(f'phone_buzz_step_{k}').astype('float64'), pk), a + d)
        note('act4', 'the phones in a row on the table, still buzzing', at=0.25, n=len(pts),
             why='S4.09 caption: "the phones, picked up and set in a row, face up, still buzzing"; script-v31-notes §4 For sound')
    # ACT FOUR S7.13: Ttemme's stream (the Runway insert, k = the beat's frames): runway.md §11.6
    if G4.has('S7.13') and G4.e('S7.13') - G4.s('S7.13') > 10.5:
        K = G4.s('S7.13')
        k = lambda f: K + f / FPS
        r = reseed('s713')
        a, b = k(128), k(252)
        ia, ib, f15 = int(round(a * SR)), int(round(b * SR)), int(0.015 * SR)
        room[ia - f15:ia] *= np.linspace(1, 0, f15, dtype='float32')[:, None]   # the boardroom out: his stream's own sound
        room[ia:ib] = 0.0
        room[ib:ib + f15] *= np.linspace(0, 1, f15, dtype='float32')[:, None]
        sr_ = np.tanh(4 * loop('room_tone', ib - ia, -30, lambda y: bp(y, 250, 5000), 'bp250-5k', rng=r)) / 4
        sr_ = sr_ * np.float32(db(-45 - lufs(sr_[: 5 * SR])))
        add(room, pfade(sr_, 0.015, 0.015), a)
        add_fx(fx, to_peak(crush_sweep(r, 4 / FPS + 0.05), -34), k(140))           # the grid dissolves
        for f, pk in ((155, -36), (161, -34), (168, -32)):                        # the cracks spreading
            m = int(0.2 * SR)
            tt = np.arange(m) / SR
            add_fx(fx, to_peak(st(np.sin(2 * np.pi * r.uniform(3200, 5200) * tt) * np.exp(-tt / 0.03)), pk), k(f))
        sh = np.zeros((int(0.8 * SR), 2))                                          # the shards land and skitter
        for j in range(9):
            nm = f'glass_shiver_{j % 4 + 1}' if j < 3 else None
            if nm:
                g = load(nm).astype('float64') * db(r.uniform(-8, -3))
            else:
                m = int(0.08 * SR)
                tt = np.arange(m) / SR
                g = st(bp(r.standard_normal(m), 2500, 9000) * np.exp(-tt / 0.01) * r.uniform(0.3, 0.8))
            add(sh, g, r.uniform(0.02, 0.2) + 0.03 * j)
        add_fx(fx, to_peak(sh, -26), k(174))
        add_fx(fx, to_peak(load('sand_fall').astype('float64'), -30), k(208))        # the sand slumps, pours, settles
        add_fx(fx, pfade(to_peak(load('sand_trickle').astype('float64'), -34), 0.1, 0.6), k(214))
        add_fx(fx, to_peak(load('sand_last_grain').astype('float64'), -38), k(229))
        add_fx(fx, to_peak(crush_sweep(r, 14 / FPS, up=True), -34), k(238))        # the stream crushes back
        note('act4', "Ttemme's stream (S7.13 insert): the boardroom out k128-252, his mic's thin room; the crush sweeps "
                     "(k140, k238), glass ticks (k155-168), the shatter (the timeline's, -10 dBFS), the shards (k174), "
                     "near silence (k179-207), the sand (k208-229); the boardroom back at k252",
             at=round(a - G4.off, 2), to=round(b - G4.off, 2),
             why='runway.md §11.6 (the insert is silent); the lead: "the hourglass shatter at S7.13"')
    # TAG: ELGOOG's demo film (the Runway insert, i = its frames): runway.md §7
    tdrops = set((hints.get('tag') or {}).get('drop', []))
    if T.has('v31-32.01d') and 'demo-film' in tdrops:
        qa['tag']['sfx_dropped'].append({'layer': 'demo-film (its bed, the stutter and stills clicks)', 'claimed_by_score': 'demo-film',
                                         'evidence': hints['tag']['why'].get('demo-film')})
    if T.has('v31-32.01d') and 'demo-blip' in tdrops:
        qa['tag']['sfx_dropped'].append({'layer': 'demo-blip (i213)', 'claimed_by_score': 'demo-blip',
                                         'evidence': hints['tag']['why'].get('demo-blip')})
    if T.has('v31-32.01d'):
        D = T.s('v31-32.01d')
        i_ = lambda f: D + f / FPS
        r = reseed('demo')
        n = int((151 - 0) / FPS * SR)
        x = demo_sheen(r, n)
        x = x * db(-24 - lufs(x))
        small = bp(x, 300, 3500) * db(-10)                                         # i0-21: from the monitor, small
        u = np.clip((np.arange(n) / SR * FPS - 22) / 4, 0, 1)[:, None]            # i22-26: it opens up, full range
        x = small * (1 - u) + x * u
        tt = np.arange(n) / SR * FPS                                               # frames
        gcur = np.interp(tt, [0, 22, 26, 48, 80, 95, 102, 136], [-4, -4, 0, 0, 3.5, 3.5, 1.0, 1.0])
        x = x * db(gcur)[:, None]
        rise = np.zeros(n)                                                         # i34-47: a faint tonal shimmer rising
        i0, i1 = int(34 / FPS * SR), int(48 / FPS * SR)
        tr = np.arange(i1 - i0) / SR
        fr = 1200 * 2 ** (tr / tr[-1])
        rise[i0:i1] = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * tr / tr[-1]) ** 2
        x = x + st(rise) * db(-22 - 0)
        gi = int(88 / FPS * SR)                                                    # i88: the glow as the duck becomes real
        m = int(1.6 * SR)
        tg = np.arange(m) / SR
        glow = sum(np.sin(2 * np.pi * f * tg) * a_ for f, a_ in ((622.25, 1.0), (932.33, 0.5), (1244.5, 0.3))) * np.exp(-tg / 0.5)
        x[gi:gi + m] += st(glow)[: n - gi] * db(-30) * 3
        for f, L in ((137, 2), (139, 2), (141, 3), (144, 3), (147, 4)):            # the stutter: the bed chopped in step
            a0, a1 = int(f / FPS * SR), int((f + L) / FPS * SR)
            keep = int(0.035 * SR)
            frag = x[a0:a0 + keep].copy()
            x[a0:a1] = 0.0
            x[a0:a0 + keep] = frag * np.linspace(1, 0.3, keep)[:, None]
            if 'demo-film' not in tdrops:
                add_fx(fx, to_peak(click(r), -26), i_(f))
        x[-int(0.003 * SR):] *= np.linspace(1, 0, int(0.003 * SR))[:, None]      # i151: it cuts out dead
        film = 'demo-film' not in tdrops
        if film:
            add_fx(fx, x, D)
            for f in (151, 159, 167):                                              # the stills: slide-change clicks
                add_fx(fx, to_peak(click(r, hard=True), -22), i_(f))
        if 'demo-blip' not in tdrops:
            add_fx(fx, to_peak(st(chip_note(1046.5, 0.06)), -30), i_(213))           # the grid snaps back: a chip blip
        # the dark room ducks under the demo, then comes back in four steps with the pull-back
        a, b = i_(0), i_(210)
        ia, ib = int(round(a * SR)), int(round(b * SR))
        tt = (np.arange(ib - ia) / SR) * FPS
        g = np.interp(tt, [0, 22, 26, 151, 152, 199, 199.5, 202, 202.5, 205, 205.5, 208, 208.5, 210],
                      [0, 0, -10, -10, -8, -8, -6, -6, -4, -4, -2, -2, 0, 0])
        room[ia:ib] *= db(g).astype('float32')[:, None]
        note('tag', "ELGOOG's demo film: its own bright bed (small, then open), the swell, the stutter (clicks at i137-147), "
                    "the cut on the stills (clicks i151, 159, 167), the room ducking -10 dB and returning in four steps "
                    "(i199-208; the LEDs from i202), a chip blip at i213",
             at=round(D - T.off, 2), to=round(i_(213) - T.off, 2), lufs=-24,
             why='runway.md §7 (the insert is silent); plan v31-32.01d; the lead: "the Elgoog demo\'s stutter clicks and the room returning"')


def v32_layers(segs, hints, qa, room, fx, note):
    """the v3.2 lock's new beats (each only if its beats exist): the call, the monitor switch, the hall, the sign-ups,
    his posts, the lobby by day, the drone into the night"""
    G1, G3, G4 = segs['act1'], segs['act3'], segs['act4']
    # ACT ONE v32-7.03: he answers (the cut to his ear comes 6 frames before "Mas.")
    if G1.has('v32-7.03'):
        try:
            on, _, _ = G1.line('v32-a1-0002')
        except KeyError:
            on = G1.s('v32-7.03', 1.5)
        x = to_peak(load('key_tap_soft_02').astype('float64'), -30)
        add_fx(fx, x, on - 0.3)
        note('act1', 'he answers: the tap on the glass', at=round(on - 0.3 - G1.off, 2), peak_dbfs=-30,
             why='v3.2 plan v32-7.03: "a ring, the lift, the hang-up" (the ring is filtered; the hang-up is the timeline\'s)')
    # ACT THREE v32-21.06: the monitor's click-off, and the clapping growing through the black glass into DevDay's hall
    if G3.has('v32-21.06') and G3.has('22.01'):
        r = reseed('switch')
        clk = G3.s('v32-21.06', 21 / FPS)
        m = int(0.06 * SR)
        tt = np.arange(m) / SR
        off_ = st(bp(r.standard_normal(m), 2000, 8000) * np.exp(-tt / 0.004) * 0.6 + np.sin(2 * np.pi * 80 * tt) * np.exp(-tt / 0.02))
        add_fx(fx, to_peak(off_, -30), clk + 0.01)
        a, b = clk + 0.05, G3.s('22.01', 1.4)
        n = int((b - a) * SR)
        cr = st(np.asarray(A3.crowd((b - a) + 0.2, 110, 600, 3600), 'float64')[:n])
        u = np.arange(n) / n
        lo = lp(cr, 900)
        cr = lo * (1 - u[:, None]) + cr * u[:, None]                         # the glass opening into the hall
        cr = cr * db(-18 * (1 - u) ** 1.5)[:, None]
        add_fx(fx, pfade(to_peak(cr, -26), 0.3, 0.6), a)
        note('act3', "the monitor's click-off, then the clapping growing through the black glass into the hall",
             at=round(clk - G3.off, 2), to=round(b - G3.off, 2), peak_dbfs=-26,
             why='v3.2 plan v32-21.06: "the monitor\'s click-off; the clapping growing through the black glass into a hall"')
    # ACT THREE v32-22.04: the rack's fans up a step with each LED step (k23, k47); SIGN UP greys (k87) with a tick
    if G3.has('v32-22.04'):
        a = G3.s('v32-22.04')
        e = G3.e('v32-22.04')
        ia, ib = int(a * SR), int((e + 1.5) * SR)
        tt = np.arange(ib - ia) / SR
        g_ = np.interp(tt, [0, 23 / FPS, 23 / FPS + 0.3, 47 / FPS, 47 / FPS + 0.3, e - a, e - a + 1.5], [0, 0, 2.5, 2.5, 5.0, 5.0, 0])
        room[ia:ib] *= db(g_).astype('float32')[:, None]
        add_fx(fx, to_peak(load('ui_mute_blip').astype('float64'), -30), a + 87 / FPS)
        note('act3', "the rack's fans up a step with each LED step (+2.5, +5 dB), and SIGN UP's grey-out tick",
             at=round(a - G3.off, 2), why='v3.2 plan v32-22.04: "the rack\'s fans up a step; ... the button\'s grey-out tick"')
    # ACT FOUR v32-S1.13: his thumb on the glass up to the post; the suite falls to night in three held steps
    if G4.has('v32-S1.13'):
        r = reseed('s113-taps')
        a = G4.s('v32-S1.13', 0.75)
        pc = next((sd['at'] for sd in G4.beats[G4.BI['v32-S1.13']].get('sounds', []) if sd['name'] == 'post_click'), 3.6)
        x = np.asarray(A1.synth('taps', pc - 0.95), 'float64')
        add_fx(fx, pfade(to_peak(x, -32), 0.02, 0.1), a)
        e = G4.e('v32-S1.13')
        ia, ib = int((e - 23 / FPS) * SR), int((e + 0.6) * SR)
        tt = G4.off * 0 + (np.arange(ib - ia) / SR) + (e - 23 / FPS)
        g_ = np.interp(tt, [e - 22 / FPS, e - 22 / FPS + 0.02, e - 14 / FPS, e - 14 / FPS + 0.02, e - 6 / FPS, e - 6 / FPS + 0.02, e + 0.6],
                       [0, -2, -2, -4, -4, -7, -7])
        room[ia:ib] *= db(g_).astype('float32')[:, None]
        note('act4', 'his thumb on the glass; the suite stepping down with the palette to night (-2, -4, -7 dB)',
             at=round(a - G4.off, 2), why='v3.2 plan v32-S1.13: "his thumb on the glass; his post\'s send pop"; the held steps')
    # ACT FOUR v32-S5.00: the revolving door's sweep under S4.08's dial tone; the lanyard across the stone; its clip
    if G4.has('v32-S5.00'):
        r = reseed('s500')
        a = G4.s('v32-S5.00')
        add_fx(fx, to_peak(lp(load('revolving_door').astype('float64'), 3500), -30), a - 0.8)
        n = int(0.55 * SR)
        tt = np.arange(n) / SR
        sl = st(bp(r.standard_normal(n), 700, 4500) * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * tt)) * np.sin(np.pi * tt / tt[-1]))
        add_fx(fx, to_peak(sl, -32), a + 0.05)
        m = int(0.03 * SR)
        tm = np.arange(m) / SR
        clip = st(bp(r.standard_normal(m), 2500, 9000) * np.exp(-tm / 0.004) + np.sin(2 * np.pi * 2100 * tm) * np.exp(-tm / 0.006) * 0.5)
        add_fx(fx, to_peak(clip, -28), a + 31 / FPS)
        note('act4', "the lobby by day: the revolving door's sweep under the dial tone; the lanyard across the stone; its clip",
             at=round(a - 0.8 - G4.off, 2), why='v3.2 plan v32-S5.00: jcut "the lobby\'s room by day (the revolving door\'s sweep)"; "the lanyard\'s clip"')


# ------------------------------------------------------------------ the block (card, act1 .. tag)
def v35_layers(segs, hints, qa, room, fx, note):
    """the v3.5 lock's new sounds (only on that lock; each only if its beats exist): the tear's sizzle over the macro, the
    vision post's keys, click and lid, JUN 2018's tinny arena, the war room's phone, the flight's pen and bump, Alyi
    alone's hearts. The new rooms are room_signal's (office-2018, office-2019, plane, tpool-2008)."""
    if LOCK != 'v35':
        return
    G1, G4 = segs['act1'], segs['act4']
    drops = {d for s_ in SEGS for d in hints.get(s_, {}).get('drop', [])}

    def blen(g, bid):
        i = g.BI[bid]
        return g.starts[i][1] - g.starts[i][0]

    def onscreen(g, bid):
        return [o for o in g.beats[g.BI[bid]].get('onscreen') or [] if o.get('at') is not None]

    def cut_fade(x, keep, fade):
        x = np.array(x[: int(keep * SR)], dtype='float64', copy=True)
        k = min(len(x), int(fade * SR))
        x[len(x) - k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None]
        return x

    def lay(seg, x, t, pk, what, why, align='onset'):
        x = to_peak(np.asarray(x, dtype='float64'), pk)
        off = float(np.argmax(np.abs(x).max(axis=1))) / SR if align == 'peak' else 0.0
        add_fx(fx, x, t - off)
        LAID.setdefault(seg, []).append((t - off - segs[seg].off, t - off - segs[seg].off + len(x) / SR, what))
        note(seg, what, at=round(t - segs[seg].off, 3), peak_dbfs=pk, why=why)

    # ACT ONE 7.02: the tear on the red-hot heatsink (the macro, k28-87; shots-act1 §15.5): the bead dancing on its own
    # vapour (a dense, flickering crackle of tiny ticks and a thin hiss), its two puffs of steam (k30, about k75), gone
    # into the pixel HIGH at k88 (the pixel tear's own hiss at k10 is the timeline's steam_hiss)
    if G1.has('7.02') and blen(G1, '7.02') * FPS >= 90:
        r = reseed('tear-sizzle')
        t0, t1 = G1.s('7.02', 28 / FPS), G1.s('7.02', 88 / FPS)
        n = int((t1 - t0 + 0.3) * SR)
        tt = np.arange(n) / SR
        chans = []
        for c in range(2):
            ticks = np.zeros(n)
            k = int(r.poisson(170 * n / SR))
            ticks[r.integers(0, n, k)] = r.uniform(0.15, 1.0, k) * r.choice([-1.0, 1.0], k)
            crack = bp(ticks, 2400, 9000, 2) * smooth_noise(r, n, 7.0, 0.35, 1.0)
            hiss = bp(r.standard_normal(n), 3500, 11000) * 0.05 * smooth_noise(r, n, 3.0, 0.5, 1.0)
            chans.append(crack + hiss)
        x = np.stack([chans[0] * 0.8 + chans[1] * 0.2, chans[1] * 0.8 + chans[0] * 0.2], 1)
        env = np.minimum(1, tt / 0.05) * db(np.interp(tt, [0, t1 - t0], [0, -5]))      # the bead shrinking
        env *= np.clip((t1 - t0 + 0.3 - tt) / 0.45, 0, 1)                                  # gone with the steam at k88
        lay('act1', x * env[:, None], t0, -27.0, 'the tear: the bead sizzling on the red-hot fins (the macro, k28-87)',
            'the macro is silent (shots-act1 §15.5: "the macro\'s sizzle and two puffs run k28-87"); the sound pass lays them')
        sh = load('steam_hiss').astype('float64')
        for k_, pk in ((30, -24.0), (75, -27.0)):
            lay('act1', pfade(lp(sh, 7000), 0.004, 0.4), G1.s('7.02', k_ / FPS), pk,
                f'the tear: a puff of steam off the fins (k{k_})', 'shots-act1 §15.5: two puffs (the second about k75)')
    # ACT ONE v35-19.01 / 19.02: his keys as the title and the passages type (the picture's typing rates: the title 1.1
    # characters a frame from its mark, each passage 5 a frame, landing whole); v35-19.04: Publish (k12) and the lid
    # (half at len-8, shut at len-4: 11.01 opens it)
    if G1.has('v35-19.01') and G1.has('v35-19.02'):
        for bid, rate, src in (('v35-19.01', 1.1, 'typing_soft'), ('v35-19.02', 5.0, 'typing_fast_loop')):
            for o in onscreen(G1, bid):                  # (check-v35 #1: the keys +10 dB, -33 -> -23; the click -24 -> -14)
                if o['text'].startswith('RAIL'):
                    continue
                d = min(2.0, max(0.35, len(o['text']) / rate / FPS)) + 0.1
                r = reseed('v35-keys', bid, o['at'])
                x = typing(r, d, src=src, burst=(d, d), gap=(0.0, 0.0))
                lay('act1', pfade(x, 0.01, 0.08), G1.s(bid, o['at']), -23.0, f'his keys: "{o["text"][:28]}" types ({bid})',
                    'the vision post: "one held felt line and his keys" (the plan); typed at the picture\'s own rate')
    if G1.has('v35-19.04'):
        n4 = round(blen(G1, 'v35-19.04') * FPS)
        lay('act1', load('post_click').astype('float64'), G1.s('v35-19.04', 12 / FPS), -14.0, 'Publish: the click (k12)',   # +10 dB
            'shots-act1 v35-19.04: the cursor to Publish and the click', align='peak')
        lay('act1', load('folder_close').astype('float64'), G1.s('v35-19.04', (n4 - 4) / FPS), -27.0,
            'the lid shuts (len-4; 11.01 opens it)', 'shots-act1 v35-19.04: he closes the lid (half, then shut)', align='peak')
    # ACT ONE v35-22.01: the waitlist: the velvet rope snaps taut between its brass stanchions on the picture's k4
    # (art/v35 waitlistTV(fb, k, 4): "the rope's snap is the sound lead in"): a rope's cloth thwup and the hook's clink
    if G1.has('v35-22.01'):
        r = reseed('rope-snap')
        n = int(0.25 * SR)
        tt = np.arange(n) / SR
        thwup = bp(r.standard_normal(n), 140, 1800) * np.exp(-tt / 0.035) * np.minimum(1, tt / 0.002)
        clink = sum(a_ * np.sin(2 * np.pi * f_ * tt + r.uniform(0, 6.28)) * np.exp(-np.maximum(0, tt - 0.006) / d_) * (tt >= 0.006)
                    for f_, a_, d_ in ((1930, 0.5, 0.09), (3120, 0.35, 0.06), (4640, 0.2, 0.035)))
        lay('act1', st(thwup + clink * 0.6), G1.s('v35-22.01', 4 / FPS), -23.0,
            'the waitlist: the velvet rope snaps taut (k4, the picture)', "shots-act1 v35-22.01; the composer's spot list "
            '(the lock has no sound for it; the score places its tag 0.9 s in, from the caption)', align='peak')
    # ACT FOUR S4.10b: the folder's page turned over toward us (close = k315: edge-on 3 f, turning 3 f, BLANK from k321)
    if G4.has('S4.10b') and G4.has('v35-41.01'):
        lay('act4', load('paper_curl').astype('float64'), G4.s('S4.10b', 318 / FPS), -15.0,   # check-v35 #5: +15 dB
            "the folder: Ttemme turns the page over (k315-321): its back is blank",
            "act4 score README (v3.5): \"the folder's page turns blank\"; the lock has no sound for it", align='peak')
    # ACT ONE JUN 2018 (v35-13.01-13.06): ATOD's tinny arena from the six screens: a small-speaker crowd that swells
    # and settles, and the game's little ability chirps; under the fans, leading the cut with them (0.8 s), thinning as
    # he walks out through the seam (13.06). Into the room stem (it dips under the lines with the room).
    if G1.has('v35-13.01') and G1.has('v35-13.06'):
        if 'atod-arena' in drops:
            qa['act1']['sfx_dropped'].append({'layer': 'atod-arena', 'claimed_by_score': 'atod-arena',
                                              'evidence': hints['act1']['why'].get('atod-arena')})
        else:
            r = reseed('atod-arena')
            a, e = G1.s('v35-13.01', -0.8), G1.e('v35-13.06')
            n = int((e - a) * SR)
            tt = np.arange(n) / SR
            crowd = bp(r.standard_normal((n, 2)), 700, 3000) * (0.45 + 0.55 * smooth_noise(r, n, 0.35) ** 2)[:, None]
            game = np.zeros((n, 2))
            t = r.uniform(0.2, 0.6)
            while t < n / SR - 0.3:
                d = r.uniform(0.04, 0.12)
                f0, f1 = r.uniform(700, 1500), r.uniform(1200, 2600)
                m = int(d * SR)
                u = np.arange(m) / SR
                ph = 2 * np.pi * np.cumsum(np.linspace(f0, f1, m)) / SR
                c = np.sign(np.sin(ph)) * np.exp(-u / (d / 2.5)) * np.minimum(1, u / 0.002)
                pan = r.uniform(0.3, 0.7)
                add(game, np.stack([c * (1 - pan), c * pan], 1) * r.uniform(0.4, 1.0), t)
                t += r.uniform(0.35, 1.4)
            x = bp(np.tanh(1.6 * (level_to(crowd, -20).astype('float64') + level_to(game, -24).astype('float64')) * 3) / 3, 650, 4800)
            x = level_to(x, -47).astype('float64')
            s6 = G1.s('v35-13.06')
            x *= db(np.interp(a + tt, [s6, e], [0.0, -12.0]))[:, None]
            add(room, pfade(x, 0.8, 0.3).astype('float32'), a)
            qa['act1']['added'].append(dict(what="ATOD's tinny arena from the six screens (room stem)", at=round(a - G1.off, 2),
                                            to=round(e - G1.off, 2), lufs=-47, why='plan v35-12.03 jcut "2018\'s server fans and a '
                                            'game\'s tinny arena, under the thought\'s tail" 0.8 s; 13.0x "the arena\'s tinny game audio"'))
    # ACT FOUR THE WAR ROOM v35-41.01: his phone face up, the calls landing tile over tile on the lock's onscreen times
    # (GERG, TASYA, AUHSOJ, THE FIRST CHECK, FOUNDER MODE, NOR; the lawyer 6 frames after NOR): a buzz on each landing
    if G4.has('v35-41.01'):
        ats = [o['at'] for o in onscreen(G4, 'v35-41.01')][:6]
        if len(ats) == 6:
            ats.append(ats[5] + 6 / FPS)
        for j, at in enumerate(ats):
            x = cut_fade(load(f'phone_buzz_step_{j % 4 + 1}').astype('float64'), 0.62, 0.14)
            lay('act4', x, G4.s('v35-41.01', at - 0.02), -27.0 if j == 0 else -22.5,       # check-v35 #4: 2-7 +6 dB
                f'the war room: his phone buzzes as a call lands ({j + 1} of {len(ats)})',
                "shots-act4 v35-41.01: the calls and messages stacking tile over tile on the lock's onscreen times")
    if G4.has('v35-41.03'):                # Tasya's key ring, heard only, through his call, after "one minute."
        try:
            on, end, _ = G4.line('v35-a4-0004')
            x = bp(load('key_ring_jangle_2').astype('float64'), 300, 3400, 2)
            lay('act4', x, end + 0.08, -32.0, "Tasya's key ring, heard only, through the call",
                'shots-act4 v35-41.03: "his phone and key ring out of frame, the jangle heard only"')
        except KeyError:
            pass
    if G4.has('v35-41.06'):                # the phone lights again at the frame's right edge (k = len - 16): its buzz
        n6 = round(blen(G4, 'v35-41.06') * FPS)
        lay('act4', load('phone_buzz_desk').astype('float64'), G4.s('v35-41.06', (n6 - 16) / FPS), -29.0,
            'the phone lights again on the notepad (len-16); its buzz becomes the plane\'s hum',
            'plan v35-41.06 lcut "the phone\'s ring becomes a plane\'s hum" 0.5 s')
    # ACT FOUR the flight v35-42.01: 1. GERG written from k8 (by 1.0 s), the pen going on in a scrawl from k30; the bump
    # at k38 (the frame jolts, the cup's coffee slops, his water stays flat)
    if G4.has('v35-42.01'):
        pen = load('pen_scribble_short').astype('float64')
        for k_ in (8, 17):
            lay('act4', pen, G4.s('v35-42.01', k_ / FPS), -33.0, f'the pen on the notepad: 1. GERG (k{k_})',
                'shots-act4 v35-42.01: TERMS, 1. GERG written by 1.0 s')
        x = cut_fade(load('pen_run').astype('float64'), 1.3, 0.3)
        lay('act4', x, G4.s('v35-42.01', 30 / FPS), -35.0, 'the pen goes on: the second line, a scrawl (k30)',
            'shots-act4 v35-42.01: "his pen keeps going, a second line we can\'t read"')
        lay('act4', lp(load('landing_thunk').astype('float64'), 260, 2), G4.s('v35-42.01', 38 / FPS), -27.0,
            'the bump: the cabin jolts (k38)', 'shots-act4 v35-42.01: the bump at 1.6 s', align='peak')
        lay('act4', load('glass_nudge').astype('float64'), G4.s('v35-42.01', 39 / FPS), -33.0, "the bump: the cup rocks on the tray",
            "shots-act4 v35-42.01: the cup's coffee tilts and slops", align='peak')
        lay('act4', lp(load('plop_water').astype('float64'), 2500), G4.s('v35-42.01', 42 / FPS), -38.0, 'the coffee slops',
            "shots-act4 v35-42.01: the cup's coffee tilts and slops", align='peak')
    # ACT FOUR Alyi alone v35-49A.01: a heart, now and then, lifting off his phone (the picture's HEARTS_49A frames):
    # soft ticks, a little closer in the MCU (from f50); two more carry across the cut to Mas's phone (S5.03, 0.4 s)
    if G4.has('v35-49A.01'):
        hearts = [6, 14, 21, 29, 35, 42, 50, 56, 63, 69, 76, 82, 88, 93, 99, 104, 109, 114]
        n9 = round(blen(G4, 'v35-49A.01') * FPS)
        ks = [k_ for k_ in hearts if k_ < n9] + [n9 + 5, n9 + 10]
        for j, k_ in enumerate(ks):
            x = lp(load(f'heart_tap_{j % 3 + 1}').astype('float64'), 5000)
            pk = (-28.0 if k_ < 50 else -25.5) if k_ < n9 else -27.0         # check-v35 #3: +12 dB
            add_fx(fx, to_peak(x, pk), G4.s('v35-49A.01', k_ / FPS))
        note('act4', "the hearts' soft ticks on Alyi's phone (18 on the picture's frames; two carried into S5.03)",
             at=round(G4.s('v35-49A.01', 6 / FPS) - G4.off, 2), peak_dbfs=-25.5,
             why='plan v35-49A.01: "the bullpen\'s night air; the hearts\' soft ticks"; lcut "the hearts\' soft ticks carry across to Mas\'s phone" 0.4 s')


def build_block(segs, hints, qa):
    NB = sum(segs[s].N for s in BLOCK) + int(TAIL_S * SR)     # + a tail past the tag: the hum held under the outro
    room = np.zeros((NB, 2), 'float32')
    fx = np.zeros((NB, 2), 'float32')
    lifts = []
    A, G1, G2, G3, G4, T = (segs[s] for s in BLOCK)
    drops = {d for s in SEGS for d in hints.get(s, {}).get('drop', [])}

    def note(seg, what, **kw):
        qa[seg]['added'].append(dict(what=what, **kw))

    # contexts the room recipes read
    ctx = {'grid': None, 'led_off': [], 'hush': None, 'neon_on': None}
    if G3.has('20.02') and G3.has('20.06'):
        ctx['led_off'].append((G3.s('20.02'), G3.s('20.06')))      # the act's one quiet beat: the LEDs drop out
    for sname in ('act3', 'act4', 'tag'):
        g = hints.get(sname, {}).get('grid')
        if g:
            ctx.setdefault('grids', {})[sname] = (g[0], segs[sname].off + g[1])
    if G4.has('S3.06'):
        ctx['hush'] = (G4.s('S3.06', 0.3), G4.s('S3.06', 0.9))
    if G4.has('S8.01'):
        ctx['neon_on'] = G4.s('S8.01', 0.85)
    if T.has('v31-32.01d'):                                        # the demo film: the LEDs out from i22 to i202
        ctx['led_off'].append((T.s('v31-32.01d', 22 / FPS), T.s('v31-32.01d', 202 / FPS)))

    # ---------------------------------------------------------------- rooms
    runs = room_runs(segs)
    for j, (key, a, e, first, last) in enumerate(runs):
        if key is None:
            # a black: silent-ish, never digital zero (the lead, v3.1: "keep the act-out's black silent-ish"): a faint
            # room tone under it, under whatever leads or trails across it
            n = int(round((e - a) * SR))
            if n > int(0.05 * SR):
                t_ = loop('room_tone', n, BLACK_TONE, lambda y: lp(y, 1500), 'lp1500', rng=reseed('black', round(a, 3)))
                add(room, pfade(t_, 0.08, 0.08), a)
                for sname in {first[0], last[0]}:
                    if sname in qa:
                        qa[sname]['rooms'].append({'room': f'black: room tone {BLACK_TONE} LUFS', 'from': round(a - segs[sname].off, 3),
                                                   'to': round(e - segs[sname].off, 3), 'first': first[1]})
            continue
        prev = runs[j - 1] if j > 0 else None
        nxt = runs[j + 1] if j + 1 < len(runs) else None
        lead = {**LEAD_AT, **LEAD_AT_LOCK.get(LOCK, {})}.get(first, LEAD) if prev is not None else 0.0
        if prev is not None and (first[0], first[1], prev[4][1]) in LEAD_AFTER:
            lead = LEAD_AFTER[(first[0], first[1], prev[4][1])]
        if prev is not None and prev[0] is None:                   # after a black: never before the black starts
            lead = min(lead, prev[2] - prev[1])
        if nxt is None:
            trail = 0.0
            e = min(e, (NB - int(TAIL_S * SR)) / SR)
        elif nxt[0] is None:
            trail = {**TRAIL_AT, **TRAIL_AT_LOCK.get(LOCK, {})}.get(last, TRAIL_BLACK)
        else:
            trail = {**TRAIL_AT, **TRAIL_AT_LOCK.get(LOCK, {})}.get(last, TRAIL)
        early = -trail if trail < 0 else 0.0          # a negative trail: fade out over the run's last |trail| s
        if early:
            trail = 0.05
        a0, e0 = max(0.0, a - lead), min(NB / SR, e + trail)
        n = int(round((e0 - a0) * SR))
        c = dict(ctx)
        c['run_edges'] = [a, e]
        if key == 'dark':
            sname = first[0]
            # the score's grid if its sheet gives one; else 96 bpm, phased (v2's rule) so Act Three's 23.01 (THE CLOCK's
            # bar 1) falls on it; elsewhere from the run's first beat
            dflt = (96.0, G3.s('23.01') if sname == 'act3' and G3.has('23.01') else segs[sname].off)
            c['grid'] = (ctx.get('grids') or {}).get(sname) or dflt
        x = room_signal(key, n, a0, c)
        x, lift = lift_to_floor(x, f'{key}@{first[0]}:{first[1]}', lifts)
        fin = max(lead, 0.02)
        fout = max(trail, 0.02) + early
        if nxt is None:                                              # the block's end: the tag fades on the hum
            fout = 1.0
        x = pfade(x, fin, fout)
        add(room, x, a0)
        for sname in {first[0], last[0]}:
            if sname in qa:
                qa[sname]['rooms'].append({'room': key, 'from': round(a0 - segs[sname].off, 3), 'to': round(e0 - segs[sname].off, 3),
                                           'first': first[1], 'last': last[1], 'lead': round(lead, 2), 'trail': round(trail, 2),
                                           'lift_db': round(lift, 1)})

    # ---------------------------------------------------------------- room events
    # the suite: race-weekend practice laps, far off, under S1.01 ("the Strip's engines under it")
    if G4.has('S1.01'):
        # v3.1 (the lead's polish list: "the Vegas practice laps' level"): audible but distant, so hotter than v3's
        # (-28/-32), with the distance in the sound instead: the top taken off, and the Strip's walls answering late
        passes = [(0.4, 6.5, LAP_PEAK, 560.0, None), (4.4, 6.0, LAP_PEAK - 4.0, 600.0, None)]
        if G4.has('v31-S1.01b'):          # the car the Orb follows round the circuit, lost behind a grandstand, found
            d0 = G4.s('v31-S1.01b') - G4.s('S1.01') - 0.6
            passes.append((d0, G4.e('v31-S1.01b') - G4.s('v31-S1.01b') + 1.4, LAP_PEAK + 2.0, 580.0, (0.42, 0.62)))
        for k, (d, dur, pk, fb, hide) in enumerate(passes):
            r = reseed('laps', k)
            x = lap_pass(r, dur, fb)
            if hide:                       # behind the grandstand: 10 dB down and duller for a moment
                n = len(x)
                u = np.clip(1 - np.abs((np.arange(n) / n - (hide[0] + hide[1]) / 2) / ((hide[1] - hide[0]) / 2)), 0, 1)
                u = np.minimum(1, u * 2.5)
                x = x * (1 - u[:, None]) + lp(x, 700) * u[:, None] * db(-10)
            x = to_peak(distant(x), pk)
            add_fx(fx, x, G4.s('S1.01', d))           # an event, so the SFX stem: the mix can measure it
            note('act4', 'practice lap, far off' + (' (the car the Orb follows; lost behind a grandstand)' if hide else ''),
                 at=round(G4.s('S1.01', d) - G4.off, 2), peak_dbfs=pk, len_s=round(dur, 2),
                 why='script SOUND: "Far off, race-weekend practice laps."; v3.1 S1.01b; the lead: audible but distant')
    # the 1993 flashback: a PC's fan under the dialog (built with the cold open)
    # the vault's F hum: from the vault (S8.06), the coda's pedal, an L-cut 1.5 s into the tag (plan S8.10)
    if G4.has('S8.06'):
        a = G4.s('S8.06')
        b = T.off + 1.5
        x = pfade(loop('vault_hum_F', int((b - a) * SR), -37, rng=reseed('vault')), 0.6, 1.5)
        add(room, x, a)
        note('act4', "the vault's F hum (the coda's pedal)", at=round(a - G4.off, 2), to=round(b - G4.off, 2), lufs=-37,
             why='CODA mood: "the vault\'s F hum as the pedal"; plan S8.10 L-cut "the vault\'s F pedal, into the tag" 1.5 s')
        note('tag', "the vault's F hum, L-cut from Act Four", to=1.5, why='plan S8.10 lcut 1.5 s')
    # the dark room's drone, under S4.15 (it leads S5.02 by 1.0 s and settles into the bed)
    if G4.has('v32-S1.13') and G4.has('S2.01'):
        a = G4.s('S2.01', -0.6)
        x = loop('room_drone', int(3.0 * SR), -40, rng=reseed('drone-s201'))
        x = x * gain_curve(len(x), a, [(a, 0), (a + 0.8, 0), (a + 3.0, -8)]).astype('float32')
        add(room, pfade(x, 0.6, 1.0), a)
        note('act4', "the dark room's drone under the suite's last palette step, leading S2.01", at=round(a - G4.off, 2), lufs=-40,
             why='v3.2 plan v32-S1.13 jcut: "the dark room\'s drone, under the last palette step" 0.6 s')
    if G4.has('S5.02'):
        a = G4.s('S5.02', -1.0)
        x = loop('room_drone', int(4.0 * SR), -36, rng=reseed('drone-lead'))
        x = x * gain_curve(len(x), a, [(a, 0), (a + 1.3, 0), (a + 4.0, -10)]).astype('float32')
        add(room, pfade(x, 1.0, 1.5), a)
        note('act4', "the dark room's drone, leading S5.02 under S4.15", at=round(a - G4.off, 2), lufs=-36,
             why='script-v3-notes §7 For sound; plan S4.15 jcut "the dark room\'s drone, under Mada\'s held note" 1.0 s')

    # ---------------------------------------------------------------- the beats' sounds
    for sname in BLOCK[1:]:
        g = segs[sname]
        own = {}
        prev_of = {b['id']: (g.beats[i - 1]['id'] if i else None) for i, b in enumerate(g.beats)}
        for (sn, bid), (nm, ld) in {**OWN_LEAD, **(OWN_LEAD_V31 if LOCK != 'v3' else {})}.items():
            if sn == sname and g.has(bid):
                if (sn, bid) in OWN_LEAD_AFTER and prev_of.get(bid) != OWN_LEAD_AFTER[(sn, bid)]:
                    continue
                if (sn, bid) in OWN_LEAD_NOT_AFTER and prev_of.get(bid) == OWN_LEAD_NOT_AFTER[(sn, bid)]:
                    continue
                own[bid] = (nm, ld)
        nxt_own = {}
        for (sn, bid), (tgt, names, ld) in NEXT_OWN_LEAD.items():
            if sn == sname and g.has(tgt) and prev_of.get(tgt) == bid:
                if sname == 'act2' and tgt == '16.01' and 'knee-stabs' in drops:
                    # the score plays the knee stabs, its first on 16.01's cut: the first stamp stays on the picture
                    # with it (a 0.3 s lead would flam against the stab); the street's air leads the cut instead
                    qa[sname]['decisions'] = qa[sname].get('decisions', []) + [
                        f'{bid} -> 16.01: the score plays the knee stabs (the first on the cut) and ends its Senate chord '
                        f'there, so the first stamp stays on the picture with them instead of leading by {ld} s (it would '
                        f'flam); the street room leads the cut by 0.6 s']
                    continue
                nxt_own[tgt] = (names, ld)
        for i, b in enumerate(g.beats):
            moved = set()
            first_at = min((sd['at'] for sd in b.get('sounds', [])), default=None)
            tuned = list(DTMF_TUNED.get((sname, b['id']), []))
            opl = ONE_PER_LINE.get((sname, b['id']))
            opl_left = sum(1 for l in b['lines'] if l['who'].startswith(opl[1])) if opl else None
            for k, sd in enumerate(b.get('sounds', [])):
                if opl and sd['name'] == opl[0]:
                    if opl_left <= 0:
                        qa[sname]['sfx_dropped'].append({'beat': b['id'], 'name': sd['name'], 'at': sd['at'],
                                                         'why': f"no {opl[1]} copy left on screen for it (the lead, v3.1)"})
                        continue
                    opl_left -= 1
                if sd['name'] == 'DTMF' and tuned:
                    sd = dict(sd, name=tuned.pop(0))
                sd = dict(sd, orig=sd['name'])
                if (sname, b['id'], sd['name']) in SOUND_SUB:
                    sd = dict(sd, name=SOUND_SUB[(sname, b['id'], sd['name'])])
                if (sname, b['id'], sd['name']) in SOUND_GAIN:
                    sd = dict(sd, gain=SOUND_GAIN[(sname, b['id'], sd['name'])])
                cl = next((c for c in CLAIMABLE if c['seg'] == sname and c.get('sound') == (b['id'], sd['name'])), None)
                if cl and cl['id'] in drops:
                    qa[sname]['sfx_dropped'].append({'beat': b['id'], 'name': sd['name'], 'claimed_by_score': cl['id'],
                                                     'evidence': hints[sname]['why'].get(cl['id'])})
                    continue
                r = reseed('sfx', sname, b['id'], sd['name'], k)
                try:
                    x, off = make_sound(sname, sd['name'], sd.get('dur'), sd.get('align'), r, b['id'])
                except Exception as ex:
                    qa[sname]['sfx_missing'].append(f"{b['id']}:{sd['name']} ({ex.__class__.__name__}: {ex})")
                    continue
                x = to_peak(np.asarray(x, dtype='float64'), sd['gain'])
                at = sd['at']
                why = None
                if b['id'] in own and sd['name'] == own[b['id']][0] and 'own' not in moved:
                    at = min(at, 0.0) - own[b['id']][1]
                    moved.add('own')
                    why = f'sound J-cut: leads the cut by {own[b["id"]][1]} s'
                if b['id'] in nxt_own and sd['name'] in nxt_own[b['id']][0] and sd['at'] == first_at:
                    at = min(at, 0.0) - nxt_own[b['id']][1]
                    why = f'sound J-cut from the beat before: leads the cut by {nxt_own[b["id"]][1]} s'
                t = g.off + g.starts[i][0] + at - off
                su = SOUND_UNTIL.get((sname, b['id'], sd.get('orig', sd['name'])))
                if su:
                    end_t = g.off + g.starts[i][1] + su[0]
                    keep = max(int(0.05 * SR), int((end_t - t) * SR))
                    if keep < len(x):
                        x = x[:keep].copy()
                        kf = min(len(x), int(su[1] * SR))
                        x[len(x) - kf:] *= np.cos(np.linspace(0, np.pi / 2, kf))[:, None]
                        why = f'ends {su[0]} s after the beat, over {su[1]} s'
                mv = MOVE_SOUND.get((sname, b['id'], sd['name']))
                if mv and g.has(mv[0]):
                    j = g.BI[mv[0]]
                    base = g.starts[j][1] if mv[1] == 'end' else g.starts[j][0]
                    pk_ = float(np.argmax(np.abs(x).max(axis=1))) / SR
                    t = g.off + base + mv[2] - pk_
                    why = f'moved onto {mv[0]} ({mv[1]} {mv[2]:+.3f} s, its peak on that frame)'
                mw = MOVE_WORD.get((sname, b['id'], sd['name']))
                if mw:
                    wt = word_time(g, i, mw[0])
                    if wt is not None:
                        pk_ = float(np.argmax(np.abs(x).max(axis=1))) / SR if mw[2] == 'peak' else 0.0
                        t = g.off + wt + mw[1] - pk_
                        why = f'moved onto the picture: "{mw[0]}" {mw[1]:+.3f} s ({mw[2]})'
                add_fx(fx, x, t)
                LAID.setdefault(sname, []).append((t - g.off, t - g.off + len(x) / SR, sd['name']))
                qa[sname]['sfx'].append([b['id'], sd['name'], round(t - g.off, 3), sd['gain']] + ([why] if why else []))
            for nm, anc, pk, why in ADD_SOUND.get((sname, b['id']), []):
                base = None
                if anc[0] == 'sound':
                    at_ = next((sd['at'] for sd in b.get('sounds', []) if sd['name'] == anc[1]), None)
                    base = None if at_ is None else g.starts[i][0] + at_ + anc[2]
                if base is None:
                    continue
                r = reseed('add', sname, b['id'], nm)
                x, off = make_sound(sname, nm, None, None, r, b['id'])
                x = to_peak(np.asarray(x, dtype='float64'), pk)
                pk_ = float(np.argmax(np.abs(x).max(axis=1))) / SR
                add_fx(fx, x, g.off + base - pk_)
                note(sname, why, at=round(base, 3), peak_dbfs=pk)

    # ---------------------------------------------------------------- the added layers
    # ACT ONE: the pen's first stroke under Nole's "quarter", then the pen's scratch leads 12.04 (moved above)
    if G1.has('12.02') and G1.has('12.04') and G1.BI['12.04'] == G1.BI['12.02'] + 1:
        try:
            on, end, l = G1.line('e1-a1-12-03')
            wq = next((w for w in l.get('words', []) if w[0].lower().startswith('quarter')), None)
            t = on + (wq[1] if wq else max(0.0, l['dur'] - 0.5))
            x = to_peak(A1.synth('pen', 0.3), -30)
            add_fx(fx, x, t)
            note('act1', 'a first pen stroke under Nole\'s "quarter"', at=round(t - G1.off, 2), peak_dbfs=-30,
                 why='plan 12.04 jcut: "the pen\'s scratch, under Nole\'s last word" (the full scratch leads the cut by 0.5 s)')
        except KeyError:
            pass
    # ACT ONE: the Build's chip line leading the 9.13 -> 11.01 match cut
    if G1.has('11.01') and 'build-prelap' not in drops:
        cut = G1.s('11.01')
        # the act1 score boots the Build on the cut (its first cell a fourth up, B-flat, 16ths at 100 bpm, after 2 s of
        # designed score silence for the laptop's close): the pre-lap plays the cell's first four in F at the same
        # tempo and ends one 16th before the cut, so the two read as one line rising a fourth across the match cut
        gd = (hints.get('act1') or {}).get('grid_duel')
        bpm_b = gd[0] if gd else BUILD_BPM
        step = 60 / bpm_b / 4
        x = np.zeros((int(1.4 * SR), 2))
        for k, f0 in enumerate((349.23, 349.23, 392.0, 415.30)):         # the Build's first cell: F4 F4 G4 Ab4
            c = chip_note(f0, 0.13)
            add(x, np.stack([c, c * 0.55], 1) * (1.0 if k == 0 else 0.85), k * step)
        x = to_peak(x, -24)
        t0 = cut - 4 * step
        add_fx(fx, x, t0)
        note('act1', "the Build's chip line (F4 F4 G4 Ab4, left pane) leading the match cut, ending a 16th before it",
             at=round(t0 - G1.off, 2), peak_dbfs=-24, bpm=bpm_b, bpm_from='the score (measured)' if gd else 'the default',
             claimable='build-prelap',
             why='script-v3-notes §7 For sound; plan 9.13 jcut "the Build\'s chip arpeggio (sc 11\'s left pane) under the laptop\'s close" 0.8 s')
    elif G1.has('11.01'):
        qa['act1']['sfx_dropped'].append({'layer': 'build-prelap', 'claimed_by_score': 'build-prelap',
                                          'evidence': hints['act1']['why'].get('build-prelap')})
    # ACT ONE: Elgoog's siren through his phone's small speaker (v2's act1 stem, on the v3 clock)
    if G1.has('7.02') and G1.has('8.06') and 'siren' not in drops:
        a = G1.s('8.01', -0.8) if G1.has('v32-7.03') else G1.s('7.02', 2.1)
        t_lock = G1.s('8.06', 0.9)
        wh = load('siren_whoop_F').astype('float64')
        n = int((t_lock - a) * SR)
        x = np.zeros((n + len(wh), 2))
        t = 0.0
        while t * SR < n:
            add(x, A1.fade(wh, 0.05, 0.3), t)
            t += len(wh) / SR * 0.8
        x = to_peak(A1.phone(x[:n]), -24)
        x *= gain_curve(n, a, [(a, -14), (G1.s('8.01'), -8), (G1.s('8.02'), -4), (G1.s('8.02', 1.5), 0), (G1.s('8.03'), -5),
                               (G1.s('8.06'), -6), (t_lock, -8)])
        add_fx(fx, pfade(x, 0.8, 0.05), a)
        note('act1', "Elgoog's siren through his phone (500-3400 Hz)", at=round(a - G1.off, 2), to=round(t_lock - G1.off, 2),
             peak_dbfs=-24, claimable='siren',
             why='mood 7.01 "then the siren through his phone"; 8.x "the siren as a joke (on the phone\'s small speaker)"; Nirb: "We heard the siren."')
    elif G1.has('7.02'):
        qa['act1']['sfx_dropped'].append({'layer': 'siren', 'claimed_by_score': 'siren', 'evidence': hints['act1']['why'].get('siren')})

    # ACT TWO: the anchor's too-smooth murmur through the phone (sc 14), to the clone's first word over the black
    if G2.has('14.01') and G2.has('14.06'):
        a = G2.s('14.01')
        try:
            on, _, _ = G2.line('e1-a2-15-01')
        except KeyError:
            on = G2.s('14.06', 0.35)
        reseed('anchor')
        x = np.asarray(A2.murmur(on - a + 0.1), 'float64')
        x = x * db(-34 - lufs(x))
        x = x[: int((on - a) * SR)]
        add_fx(fx, pfade(x, 0.2, 0.06), a)
        note('act2', "the anchor's too-smooth murmur (no words) through the phone", at=round(a - G2.off, 2),
             to=round(on - G2.off, 2), lufs=-34,
             why='14.01 sound cue: "the anchor\'s too-smooth murmur, no words: a made formant voice"; stops for the clone\'s first word')

    # ACT THREE: Gerg's keys down the line, through the whole call (20.04-20.06), loud in 20.06, on to the cut
    if G3.has('20.04') and G3.has('20.06'):
        a = G3.s('20.04', 0.8 + 5.0 - 0.3)                       # picks up where the beat's own call_keys (5 s) ends
        b = G3.e('20.06', 0.35)
        r = reseed('call-keys')
        x = typing(r, b - a)
        x = dense(bp(x, 350, 3400))
        pts = [(a, -20), (G3.s('20.05'), -22), (G3.e('20.05', -0.3), -22), (G3.s('20.06'), -12)]
        try:
            v0, v1, _ = G3.line('v3-vo-15')
            pts += [(v0 - 0.3, -12), (v0, -16), (v1, -16), (v1 + 0.3, -12)]
        except KeyError:
            pass
        pts += [(b, -12)]
        pts.sort()
        x = x * gain_curve(len(x), a, pts)
        add_fx(fx, pfade(x, 0.3, 0.35), a)
        note('act3', "Gerg's keys down the line (the call's band), loud in 20.06, on past the last line to the cut",
             at=round(a - G3.off, 2), to=round(b - G3.off, 2), peak_dbfs='-20 (20.04) / -22 (20.05) / -12 (20.06; -16 under the V.O.)',
             why='script-v3-notes §7 For sound: "Gerg\'s keys loud in 20.06"; 20.06 sound cue "Gerg\'s keys keep going after the last line"')

    # ACT THREE -> FOUR: the crane truck's grind and a dozen glass tings, pre-lapped under 23.04's black into S1.01
    if G3.has('23.04') and G4.has('S1.01'):
        cut = G4.off
        r = reseed('crane')
        grind = np.asarray(A3.synth('crane', 2.2), 'float64')             # the diesel grind, fading up under the black
        grind = to_peak(lp(grind, 1200), -30)
        add_fx(fx, pfade(grind, 1.0, 0.8), cut - 2.1)
        crane = lp(load('crane_truck_pass').astype('float64'), 1800)      # the pass, its loudest point at S1.01 +0.5
        crane = to_peak(crane, -27)
        add_fx(fx, pfade(crane, 0.6, 0.8), cut + 0.5 - 1.67)
        tings = np.zeros((int(2.2 * SR), 2))
        for k in range(12):
            nm = f'glass_shiver_{k % 4 + 1}' if k < 4 else None
            if nm:
                s = load(nm).astype('float64') * db(r.uniform(-4, 0))
            else:
                m = int(0.25 * SR)
                tt = np.arange(m) / SR
                s = st(np.sin(2 * np.pi * r.uniform(2800, 5200) * tt) * np.exp(-tt / 0.07) * r.uniform(0.3, 0.8))
            add(tings, s, r.uniform(0.0, 1.5))
        tings = to_peak(tings, -30)
        add_fx(fx, tings, cut - 0.5)
        note('act3', 'pre-lap under the black: the crane truck\'s diesel grind, then glass tings', at=round(cut - 2.1 - G3.off, 2),
             why='script 23.04: "Under the black, the next scene\'s sound pre-laps: a crane truck\'s diesel grind, then a dozen small glass tings."')
        note('act4', "the crane truck passes (its loudest at +0.5 s) and the suite's glasses shiver, from the pre-lap",
             at=0.0, peak_dbfs=-27, why='S1.01 caption: "A crane truck grinds past; every glass shivers except his."')

    # ACT FOUR: the call's waiting tone under S3.00a's J-cut
    if G4.has('S3.00a'):
        rb = to_peak(bp(load('speakerphone_ringback').astype('float64'), 300, 3400), -32)
        for d in (-0.6, 1.5):
            add_fx(fx, rb * (1.0 if d < 0 else 0.7), G4.s('S3.00a', d))
        note('act4', "the call's waiting tone (twice), leading S3.00a", at=round(G4.s('S3.00a', -0.6) - G4.off, 2), peak_dbfs=-32,
             why='plan S3.00a jcut: "Neleh\'s office: the clock-tick and the call\'s waiting tone, under the whip\'s tail" 0.6 s')
    # ACT FOUR: the all-hands crowd's hush, leading S3.06
    if G4.has('S3.06'):
        h = to_peak(load('crowd_hush').astype('float64'), -26)
        add_fx(fx, pfade(h, 0.1, 0.4), G4.s('S3.06', -0.8))
        note('act4', "the all-hands crowd's hush, leading S3.06 (the room then stays hushed, -8 dB)",
             at=round(G4.s('S3.06', -0.8) - G4.off, 2), peak_dbfs=-26, why='plan S3.04b jcut: "the all-hands crowd\'s hush" 0.8 s')

    # ACT FOUR: 2 AM. Gerg's keys through the monitor's small speaker; loud in S5.09-back; they stop dead after
    # "gerg never waits to be asked." (so "His keys stop." is heard); one key on the cut out of S5.09b
    if G4.has('S5.09') and G4.has('S5.09-back'):
        mon = lambda y: bp(y, 250, 5000)
        pieces = []
        r = reseed('2am-keys')
        click = next((sd['at'] for sd in G4.beats[G4.BI['S5.09']].get('sounds', []) if sd['name'] == 'dialog_ok_click'), 2.64)
        a, b = G4.s('S5.09', click + 0.12), G4.e('S5.09')
        pieces.append((a, b, -16, 'typing', 'S5.09: the tile opens on him typing ("doesn\'t look up")'))
        a, b = G4.s('S5.06', 0.2), G4.e('S5.06')
        pieces.append((a, b, -24, 'sparse', 'S5.06: light keys between his reads; none under the quoted lines; none from "Scroll to the bottom."'))
        # the stop, dead. v3: on the cut to his look (S5.09b), where the act4 score stops the Build ("the Build and his
        # keys stop together", script sc 29), after the planted line "gerg never waits to be asked." has landed.
        # v3.1: that line moved onto his look, and S5.09-back holds 5.4 s "where his keys stop": they stop after
        # "The company. Again. Just in case." (+0.35 s), or on the score's own Build stop if its sheet marks one there
        stop = G4.e('S5.09-back')
        stop_why = 'on the cut to his look, with the score\'s Build'
        vo_here = any(l['id'] == 'v3-vo-23' for l in G4.beats[G4.BI['S5.09-back']]['lines'])
        if not vo_here:
            try:
                _, e17, _ = G4.line('a5-29-17')
                stop = min(e17 + 0.35, G4.e('S5.09-back', -0.3))
                stop_why = 'after "The company. Again. Just in case." (+0.35 s), before his look'
                ms = (hints.get('act4') or {}).get('build_stop')
                if ms is not None and e17 <= G4.off + ms <= G4.e('S5.09b', 0.5):
                    stop = G4.off + ms
                    stop_why = "on the act4 score's own Build stop (its cue sheet)"
            except KeyError:
                pass
        pieces.append((G4.s('S5.09-back'), stop, -10, 'loud', f'S5.09-back: "typing hard", loud; stop dead {stop_why}'))
        for a, b, pk, style, why in pieces:
            if b - a < 0.2:
                continue
            x = typing(r, b - a, 'typing_fast_loop' if style != 'sparse' else 'typing_soft',
                       burst=(0.8, 2.0) if style == 'loud' else ((0.4, 1.0) if style == 'sparse' else (0.6, 1.6)),
                       gap=(0.1, 0.35) if style == 'loud' else ((0.9, 2.2) if style == 'sparse' else (0.15, 0.55)))
            x = mon(x)
            x = dense(x) * db(pk)
            if style == 'sparse':          # out under the quoted lines and from "Scroll to the bottom." on
                win = []
                for lid in ('a5-29-06', 'a5-29-07', 'a5-29-09'):
                    try:
                        on, en, _ = G4.line(lid)
                        win.append((on - 0.3, en + 0.3))
                    except KeyError:
                        pass
                try:
                    on, _, _ = G4.line('a5-29-11')
                    win.append((on - 0.4, b + 1))
                except KeyError:
                    pass
                x = x * gate(len(x), a, win)
            if style == 'loud':            # a touch under his two thoughts, so the V.O. stays close
                pts = [(a, 0.0)]
                for lid in ('v3-vo-22', 'v3-vo-23'):
                    try:
                        on, en, _ = G4.line(lid)
                        pts += [(on - 0.25, 0.0), (on, -3.0), (en, -3.0), (en + 0.01, -3.0)]
                    except KeyError:
                        pass
                pts.append((b, pts[-1][1]))
                x = x * gain_curve(len(x), a, sorted(pts))
                k = int(0.012 * SR)       # the stop is dead: 12 ms, no ring
                x[len(x) - k:] *= np.linspace(1, 0, k)[:, None]
                add_fx(fx, pfade(x, 0.05, 0.0), a)
            else:
                add_fx(fx, pfade(x, 0.08, 0.25), a)
            note('act4', "Gerg's keys through the monitor", at=round(a - G4.off, 2), to=round(b - G4.off, 2), peak_dbfs=pk,
                 why=why + ' (script-v3-notes §7 For sound; sc 29 SOUND "Gerg\'s keys and room through the monitor\'s small speaker")')
        qa['act4']['keys_stop'] = {'at': round(stop - G4.off, 3), 'beat_end': round(G4.e('S5.09-back') - G4.off, 3),
                                   'rule': stop_why}
        if G4.has('S5.09b'):                                  # "then types again, and on the first key we cut"
            k1 = to_peak(mon(load('key_tap_soft_02').astype('float64')), -18)
            add_fx(fx, k1, G4.e('S5.09b', -0.09))
            note('act4', 'one key on the cut out of S5.09b', at=round(G4.e('S5.09b', -0.09) - G4.off, 2), peak_dbfs=-18,
                 why='script S5.09b: "Gerg holds the look a beat longer, then types again, and on the first key we cut."')
        if G4.has('S5.11'):
            a, b = G4.s('S5.11', 0.05), G4.s('S5.11', 1.8)
            x = mon(typing(r, b - a, 'typing_soft', burst=(0.3, 0.8), gap=(0.2, 0.6)))
            x = x / (np.abs(x).max() + 1e-9) * db(-28)
            add_fx(fx, pfade(x, 0.05, 0.5), a)
            note('act4', "Gerg's keys, faint, on the small tile until the door", at=round(a - G4.off, 2), to=round(b - G4.off, 2),
                 peak_dbfs=-28, why='script S5.11: "Gerg\'s tile small and typing on the monitor"')

    v31_layers(segs, hints, qa, room, fx, note)
    v32_layers(segs, hints, qa, room, fx, note)
    v35_layers(segs, hints, qa, room, fx, note)

    # ---------------------------------------------------------------- THE ONE SILENCE (Act Four)
    ck = silence_click(G4)
    if ck and G4.has('S1.11'):
        zz = [sd['at'] for sd in G4.beats[G4.BI['S1.11']].get('sounds', []) if sd['name'] in ('BUZZ', 'phone_buzz_desk')]
        t_click, t_buzz = G4.s(ck[0], ck[1]), G4.s('S1.11', zz[0] if zz else 0.3)
        ia, ib = int(round(t_click * SR)), int(round(t_buzz * SR))
        k = int(0.012 * SR)
        room[ia - k:ia] *= np.linspace(1, 0, k, dtype='float32')[:, None]
        room[ia:ib] = 0.0
        r8 = int(0.08 * SR)
        room[ib:ib + r8] *= np.linspace(0, 1, r8, dtype='float32')[:, None]
        tone = loop('room_tone', ib - ia, -50, rng=reseed('silence'))
        tone[: int(0.1 * SR)] *= np.linspace(0, 1, int(0.1 * SR), dtype='float32')[:, None]
        tone[-int(0.08 * SR):] *= np.linspace(1, 0, int(0.08 * SR), dtype='float32')[:, None]
        room[ia:ib] += tone
        # the click lands (its own 60 ms), then the SFX stem is empty until the buzz
        k6 = int(0.06 * SR)
        fx[ia + k6:ib - int(0.005 * SR)] = 0.0
        fx[ia:ia + k6] *= np.linspace(1, 0, k6, dtype='float32')[:, None] ** 0.5
        qa['act4']['silence'] = {'click_beat': ck[0], 'click': round(t_click - G4.off, 3), 'buzz': round(t_buzz - G4.off, 3),
                                 'seconds': round(t_buzz - t_click, 3),
                                 'what': 'every room out on the click (12 ms), room tone only at -50 LUFS, back on the buzz (80 ms); '
                                         'the click keeps its first 60 ms, then no SFX until the buzz'}
    qa['_room_levels'] = lifts
    return room, fx


# ------------------------------------------------------------------ the cold open (alone: the intro follows it)
def build_coldopen(g, hints, qa):
    N = g.N
    room = np.zeros((N, 2), 'float32')
    fx = np.zeros((N, 2), 'float32')
    drops = set(hints.get('coldopen', {}).get('drop', []))
    B = {b['id']: b for b in g.beats}
    t_freeze = g.s('2.01')
    t_rw0, t_rw1 = g.s('3.02'), g.e('3.02')
    try:
        on, end, _ = g.line('e1-co-1-02')
        t_forward = end
    except KeyError:
        t_forward = g.e('1.02', -0.5)
    tt = np.arange(N) / SR
    reseed('coldopen-hall')
    # the hall (sc 1): HVAC + a polite crowd, heard under the black (the plan's 0.5 s J-cut), cut (8 ms) on the freeze
    hall = loop('room_tone', N, -38, rng=np.random.default_rng(1116)).astype('float64')
    mur = np.asarray(CO.murmur(N), 'float64')
    hall = hall + mur * db(-41 - lufs(mur[: 20 * SR]))
    nf = int(t_freeze * SR)
    hall_cut = A1.fade(hall[:nf], 0.45, 0.010)
    bus_hall = np.zeros((N, 2))
    bus_hall[:nf] += hall_cut
    # the freeze's hum: the HVAC band-passed 120-700 Hz at -39 LUFS, stepping down with the rewind
    hum = bp(loop('room_tone', N, -14, rng=np.random.default_rng(7)).astype('float64'), 120, 700, 3)
    hum = hum * db(-39 - lufs(hum[: 20 * SR]))
    hg = ((tt >= t_freeze) & (tt < t_rw0)).astype(float)
    steps = [0.0, -4.0, -9.0, -16.0]
    qd = (t_rw1 - t_rw0) / 4
    for k, s in enumerate(steps):
        hg[(tt >= t_rw0 + k * qd) & (tt < t_rw0 + (k + 1) * qd)] = db(s)
    hg = lp(hg, 40, 1)
    if not g.has('4.01'):                      # v3.1's cut: the hum goes with the rewind on the cursor frame (k106)
        kc_ = int(round((t_rw0 + 106 / FPS) * SR))
        if kc_ < N:
            f3 = int(0.010 * SR)
            hg[kc_ - f3:kc_] *= np.linspace(1, 0, f3)
            hg[kc_:] = 0.0
    bus_hall += hum * hg[:, None]
    # the banquet's applause across the street, swelling after "forward", cut by the freeze (from the first frame)
    a1 = g.s('1.01')
    ap_n = int((t_freeze - a1 + 0.01) * SR)
    ap = np.asarray(CO.applause(ap_n), 'float64')
    ap = ap * db(-29 - lufs(ap))
    ta = a1 + np.arange(ap_n) / SR
    swell = 1 + (db(6) - 1) * np.clip((ta - (t_forward + 0.1)) / 1.2, 0, 1)
    ap = A1.fade(ap * swell[:, None], 0.25, 0.010)
    bus_ban = np.zeros((N, 2))
    add(bus_ban, ap, a1)
    # the rewind: the hall and banquet before the freeze, reversed like tape, its speed following the Orb's counter
    y22 = next((o for o in B['3.02'].get('onscreen', []) if o['text'] == '2022'), None)
    n_rw = int((t_rw1 - t_rw0) * SR)
    tr = np.arange(n_rw) / SR
    if y22:
        c0 = y22['at']
        c1 = y22['until'] if y22['until'] is not None else B['3.02']['reelDur']
        speed = np.where(tr < c0, 2.0, np.where(tr < c1, CO.CATCH_SPEED,
                         CO.SLIP_SPEED[0] + (CO.SLIP_SPEED[1] - CO.SLIP_SPEED[0]) * (tr - c1) / max(1e-6, tr[-1] - c1)))
    else:
        speed = np.full(n_rw, 2.0)
    speed = lp(np.concatenate([np.full(SR, speed[0]), speed]), 7.0, 2)[SR:]
    phase = np.concatenate([[0.0], np.cumsum(speed)[:-1]])
    need = phase[-1] / SR + 0.2
    pre = (bus_hall + bus_ban)[max(0, int((t_freeze - need) * SR)): nf][::-1]
    rw = np.stack([np.interp(phase, np.arange(len(pre)), pre[:, c]) for c in range(2)], 1)
    old_end = g.has('4.01')                     # v3's cut had the 1993 flashback after the rewind; v3.1's does not
    out = np.zeros_like(rw)
    if old_end:
        for k, (s, cut) in enumerate(zip(steps, [9000, 4500, 2200, 1000])):
            a, b = int(k * qd * SR), int((k + 1) * qd * SR)
            out[a:b] = lp(rw, cut, 2)[a:b] * db(s - 4)
        add(room, A1.fade(out, 0.03, 0.25), t_rw0)
    else:
        # the 640-frame cut (shots-coldopen §0): "the rewind whirr accelerating from the slip (k 37) through the smear
        # into the collapse, cut on the last frame, so the intro's first beat takes over". The scrub brightens as it
        # speeds; the collapse (k100-105, three held steps) darkens it a rung a step; the last frame cuts it dead.
        c1_ = c1 if y22 else 1.55
        T_ = t_rw1 - t_rw0
        kf = lambda f: f / FPS
        lvl = np.interp(tr, [0, c1_, kf(94), kf(100), kf(102), kf(104), T_], [-4, -4, -1, 0, -1.5, -3, -3])
        bright = [(0.0, c1_, 7000), (c1_, kf(94), 9000), (kf(94), kf(100), 11000), (kf(100), kf(102), 4000),
                  (kf(102), kf(104), 2500), (kf(104), T_ + 1, 1500)]
        for a_, b_, cut in bright:
            ia_, ib_ = int(a_ * SR), min(n_rw, int(b_ * SR))
            if ib_ > ia_:
                out[ia_:ib_] = lp(rw, cut, 2)[ia_:ib_]
        out *= db(lvl)[:, None]
        # the tape transport's whirr: a whine riding the scrub's speed, up from the slip, loudest into the collapse
        f_w = 150.0 * speed
        ph_w = 2 * np.pi * np.cumsum(f_w) / SR
        wh = (np.sin(ph_w) + 0.35 * np.sin(2 * ph_w) + 0.15 * np.sin(3 * ph_w)) * 0.6
        wh = wh + bp(np.random.default_rng(1117).standard_normal(n_rw), 1500, 6000) * (0.1 + 0.05 * speed)
        wg = np.interp(tr, [0, c1_, kf(94), kf(104), T_], [-60, -30, -20, -16, -16])
        wh = bp(wh, 120, 7000) * db(wg)
        out += st(wh * (np.max(np.abs(out)) + 1e-9) / (np.max(np.abs(wh)) + 1e-9) * db(-6))
        # cut dead on the cursor frame (k106), where the cold-open score lands its last swell and then goes to zero
        # for the last two frames (its README); only the black's faint tone is under the cursor on black
        k3 = int(0.010 * SR)
        kc = min(n_rw, int(round(kf(106) * SR)))
        out[:int(0.03 * SR)] *= np.linspace(0, 1, int(0.03 * SR))[:, None]
        out[kc - k3:kc] *= np.linspace(1, 0, k3)[:, None]
        out[kc:] = 0.0
        add(room, out, t_rw0)
        if n_rw - kc > int(0.02 * SR):
            bt = loop('room_tone', n_rw - kc, BLACK_TONE, lambda y: lp(y, 1500), 'lp1500', rng=reseed('co-black'))
            add(room, pfade(bt, 0.005, 0.003), t_rw0 + kc / SR)
        qa['added'].append({'what': "the rewind's end: the scrub brightening as it speeds from the slip, a tape whirr riding "
                                    "its speed, the collapse darkening it in three steps, cut dead on the last frame",
                            'at': round(t_rw0, 2), 'to': round(t_rw1, 2),
                            'why': 'shots-coldopen §0: the 640-frame cut ends on the rewind collapsing into the intro'})
    # sc 1's hall and banquet were built for the lock mixer's 10 dB duck under the takes (v2's "-29 LUFS, so -39 under
    # the talk"): 8 dB of it is baked in here, the mix dips every room 2 dB more. The freeze hum and the rewind are not.
    u = duck_u(g.speech(), N, 0.0)
    uu = np.interp(tt, np.arange(0, N, SR // 100) / SR, [u(t_) for t_ in np.arange(0, N, SR // 100) / SR])
    fwd = np.zeros((N, 2))
    fwd[:nf] = (bus_hall + bus_ban)[:nf] * db(-8.0 * uu[:nf])[:, None]
    fwd[nf:] = (bus_hall + bus_ban)[nf:]
    room += fwd.astype('float32')
    # the 1993 flashback: a PC's fan and mains hum, in after the white, under the dialog and the toast
    a = t_rw1
    if old_end and N - int(a * SR) > SR:
        x = pc_fan(reseed('pc1993'), N - int(a * SR))
        add(room, pfade(x, 0.3, 0.08), a)
        qa['added'].append({'what': "a 1993 PC's fan and mains hum under the flashback (4.01-4.02)", 'at': round(a, 2), 'lufs': -41,
                            'why': 'the flashback had no room in v2 (MM-06 alone): without a score it was a 5.5 s hole'})
    qa['rooms'] += [{'room': 'hall: room_tone -38 + a polite crowd -41 (coldopen_bed.py)', 'from': 0.0, 'to': round(t_freeze, 3),
                     'lead': 'under the 0.5 s black'},
                    {'room': "banquet applause across the street, -29 LUFS, +6 dB swell after 'forward', cut on the freeze",
                     'from': round(a1, 3), 'to': round(t_freeze, 3)},
                    {'room': 'the freeze hum (room tone 120-700 Hz, -39 LUFS), stepping 0/-4/-9/-16 dB with the rewind',
                     'from': round(t_freeze, 3), 'to': round(t_rw1, 3)},
                    {'room': 'the rewind (the hall + banquet reversed, speed on the counter)', 'from': round(t_rw0, 3), 'to': round(t_rw1, 3)},
                    ] + ([{'room': "a 1993 PC's fan", 'from': round(a, 3), 'to': round(g.total, 3)}] if old_end else [])
    kend = int((0.1 if old_end else 0.010) * SR)                  # v3.1: cut dead with the picture into the intro
    room[-kend:] *= np.linspace(1, 0, kend, dtype='float32')[:, None]
    # SFX, with the lock's -10 dB under speech (its v2 stem was ducked whole by the mixer)
    u = duck_u(g.speech(), N, 0.0)
    for i, b in enumerate(g.beats):
        for k, sd in enumerate(b.get('sounds', [])):
            cl = next((c for c in CLAIMABLE if c['seg'] == 'coldopen' and c.get('sound') == (b['id'], sd['name'])), None)
            if cl and cl['id'] in drops:
                qa['sfx_dropped'].append({'beat': b['id'], 'name': sd['name'], 'claimed_by_score': cl['id'],
                                          'evidence': hints['coldopen']['why'].get(cl['id'])})
                continue
            r = reseed('sfx', 'coldopen', b['id'], sd['name'], k)
            try:
                x, off = make_sound('coldopen', sd['name'], sd.get('dur'), sd.get('align'), r, b['id'])
            except Exception as ex:
                qa['sfx_missing'].append(f"{b['id']}:{sd['name']} ({ex.__class__.__name__}: {ex})")
                continue
            t = g.starts[i][0] + sd['at'] - off
            dk = -10.0 * u(t)
            x = to_peak(x, sd['gain'] + dk)
            add_fx(fx, x, t)
            LAID.setdefault('coldopen', []).append((t, t + len(x) / SR, sd['name']))
            qa['sfx'].append([b['id'], sd['name'], round(t, 3), round(sd['gain'] + dk, 1),
                              f'{dk:.1f} dB (the lock\'s duck on the v2 stem)' if dk < -0.05 else ''])
    fx[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR), dtype='float32')[:, None]
    return room, fx


# ------------------------------------------------------------------ fingerprint, QA, main
def fingerprint(variant, hints, segs=None):
    h = hashlib.sha1()
    for p in [os.path.abspath(__file__)] + [os.path.join(ROOT, v) for v in MOD_PATHS.values()]:
        h.update(open(p, 'rb').read())
    segs = segs or load_segs(variant)
    for name in SEGS:
        h.update(open(segs[name].path, 'rb').read())
        bp_ = os.path.join(BP_DIR, f'{name}.json')
        if os.path.exists(bp_):
            h.update(open(bp_, 'rb').read())
    man = os.path.join(ROOT, 'audio/sfx/manifest.json')
    if os.path.exists(man):
        h.update(open(man, 'rb').read())
    h.update(LOCK.encode())
    h.update(json.dumps({s: {k: v.get(k) for k in ('drop', 'grid', 'build_stop', 'grid_lobby', 'grid_duel')} for s, v in hints.items()},
                        sort_keys=True, default=str).encode())
    return h.hexdigest()


def out_dir(variant):
    d = os.path.join(ROOT, VARIANTS[variant]['out'])
    os.makedirs(d, exist_ok=True)
    return d


def stems_fresh(variant, hints=None):
    """True when the stems on disk were built from exactly these inputs"""
    d = out_dir(variant)
    p = os.path.join(d, 'stems-inputs.json')
    if not os.path.exists(p):
        return False
    hints = hints if hints is not None else score_hints(variant)
    try:
        rec = json.load(open(p))
    except Exception:
        return False
    if rec.get('fingerprint') != fingerprint(variant, hints):
        return False
    ext = VARIANTS[variant]['ext']
    return all(os.path.exists(os.path.join(d, f'{s}-{k}.{ext}')) for s in SEGS + ['card'] for k in ('room', 'sfx'))


CLICK_RATIO = 10.0


def _d2(x):
    return np.abs(np.diff(np.asarray(x, dtype='float32'), 2, axis=0)).max(axis=1)


def click_scan(x, boundaries):
    """v3.3 (X7): the second-difference click scan. At every beat boundary: the largest |x[n+1] - 2x[n] + x[n-1]| within
    +-25 ms against the 99th percentile of the local +-0.6 s (the +-0.1 s around the cut left out); anything over
    CLICK_RATIO is listed, as an onset (a sound starting, 10 dB up), a cut-off (10 dB down) or a step. Then the whole
    stem is swept for cut-offs anywhere: a 5 ms level falling 12 dB or more from above -50 dBFS where the second
    difference is over CLICK_RATIO x local (X1 was not on a boundary)."""
    n = len(x)
    out = {'boundaries': [], 'cutoffs': []}
    rms = lambda a, b: float(20 * np.log10(np.sqrt(np.mean(np.asarray(x[max(0, a):max(a + 1, min(n, b))], 'float64') ** 2)) + 1e-12))
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
        if pk < 3e-4:                                    # nothing there (under about -70 dBFS of change)
            continue
        ratio = pk / (float(np.percentile(loc, 99)) + 1e-7)
        if ratio > CLICK_RATIO:
            i = c - w + int(np.argmax(near))                 # the sample index in x
            lb, la = rms(i - int(0.01 * SR), i), rms(i + 1, i + int(0.01 * SR))
            kind = 'onset' if la - lb >= 10 else ('cut-off' if lb - la >= 10 else 'step')
            out['boundaries'].append({'at': round(i / SR, 3), 'boundary': round(tb, 3), 'ratio': round(ratio, 1), 'kind': kind,
                                      'before_dbfs': round(lb, 1), 'after_dbfs': round(la, 1)})
    k = int(0.005 * SR)
    m = n // k
    if m > 4:
        e = 20 * np.log10(np.sqrt(np.mean(np.asarray(x[:m * k], 'float64').reshape(m, k, -1) ** 2, axis=1)).max(axis=1) + 1e-12)
        cand = np.where((e[:-1] > -50) & (e[:-1] - e[1:] >= 12))[0]
        for j in cand:
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


def classify_sfx_flags(q, named, spans):
    """v3.3: tell the SFX stem's flags apart. A cut-off inside a laid sound's body (not in its last 6 ms, where a
    truncation would show) is 'in-sample': the source's own decay, e.g. a UI click falling 20 dB in 5 ms, or the egg
    timer's 3 ms tick. A boundary flag within -5..+30 ms of a laid sound's start is that sound's attack ('laid onset':
    a freeze hit on the cut). Named sounds (the timeline's) are named; the added layers by their QA note."""
    def note_for(t):
        best = None
        for a in q.get('added', []):
            a0 = a.get('at')
            if not isinstance(a0, (int, float)):
                continue
            a1 = a.get('to') if isinstance(a.get('to'), (int, float)) else a0 + (a.get('len_s') or 4.0)
            if a0 - 1.0 <= t <= a1 + 1.0:
                best = a['what']
        return best or 'an added layer'
    for f_ in q['click_scan']['sfx']['cutoffs']:
        t = f_['at']
        body = [nm for a_, e_, nm in named if a_ <= t < e_ - 0.006]
        anyb = [1 for a_, e_ in spans if a_ <= t < e_ - 0.006]
        f_['kind'] = 'in-sample' if (body or anyb) else 'truncation'
        if f_['kind'] == 'in-sample':
            f_['inside'] = body[-1] if body else note_for(t)
    for f_ in q['click_scan']['sfx']['boundaries']:
        if f_['kind'] == 'onset':
            continue
        t = f_['at']
        st_ = [nm for a_, e_, nm in named if a_ - 0.005 <= t <= a_ + 0.03]
        anys = [1 for a_, e_ in spans if a_ - 0.005 <= t <= a_ + 0.03]
        if st_ or anys:
            f_['laid_onset'] = st_[-1] if st_ else note_for(t)
        elif f_['kind'] == 'cut-off' and any(a_ <= t < e_ - 0.006 for a_, e_ in spans):
            f_['in_sample'] = True


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


def build(variant='kokoro', only=None, quiet=False):
    segs = load_segs(variant)
    hints = score_hints(variant, segs)
    d = out_dir(variant)
    qa = {s: {'segment': s, 'variant': variant, 'timeline': os.path.relpath(segs[s].path, ROOT) if segs[s].path else None,
              'timeline_variant': segs[s].variant_used, 'seconds': round(segs[s].total, 3), 'frames': segs[s].frames,
              'rooms': [], 'sfx': [], 'sfx_missing': [], 'sfx_dropped': [], 'added': [],
              'score_hints': hints.get(s)} for s in SEGS + ['card']}
    JANGLE.clear()
    LAID.clear()
    LAID_BUS.clear()
    room_b, fx_b = build_block(segs, hints, qa)
    room_c, fx_c = build_coldopen(segs['coldopen'], hints, qa['coldopen'])
    lifts = qa.pop('_room_levels')
    out = {}
    for s in SEGS + ['card']:
        if s == 'coldopen':
            rm, fx = room_c, fx_c
        else:
            g = segs[s]
            i0 = int(round(g.off * SR))
            rm, fx = room_b[i0:i0 + g.N], fx_b[i0:i0 + g.N]
        assert len(rm) == segs[s].N, (s, len(rm), segs[s].N)
        pk = max(float(np.abs(rm).max()), float(np.abs(fx).max()))
        if pk > 0.999:                   # never happens at these levels; say so if it does
            qa[s]['clipped_peak'] = round(20 * np.log10(pk), 2)
        if only and s not in only:
            continue
        ext = VARIANTS[variant]['ext']
        sf.write(os.path.join(d, f'{s}-room.{ext}'), rm, SR, subtype='PCM_24')
        sf.write(os.path.join(d, f'{s}-sfx.{ext}'), fx, SR, subtype='PCM_24')
        q = qa[s]
        q['room_stem'] = measure_stem(rm)
        q['sfx_stem'] = measure_stem(fx)
        q['room_under_-55dBFS_0.3s'] = quiet_spans(rm)
        bnd = [st_ for st_, _ in segs[s].starts[1:]] if segs[s].starts else []
        q['click_scan'] = {'room': click_scan(rm, bnd), 'sfx': click_scan(fx, bnd),
                           'rule': f'second difference > {CLICK_RATIO}x the local 99th percentile (see click_scan)'}
        spans = [(a_ - (0.0 if s == 'coldopen' else segs[s].off), e_ - (0.0 if s == 'coldopen' else segs[s].off))
                 for a_, e_ in LAID_BUS.get(id(fx_c if s == 'coldopen' else fx_b), [])]
        classify_sfx_flags(q, LAID.get(s, []), spans)
        q['room_levels'] = [l for l in lifts if l['room'].split('@')[1].startswith(s + ':')] if s != 'coldopen' else []
        json.dump(q, open(os.path.join(d, f'{s}-stems-qa.json'), 'w'), indent=1)
        out[s] = q
        cs = q['click_scan']
        flags = [f"{k_}:{f_['kind']}@{f_['at']}({f_['ratio']}x)" for k_ in ('room', 'sfx') for f_ in cs[k_]['boundaries']
                 if f_['kind'] != 'onset' and not f_.get('laid_onset') and not f_.get('in_sample')] + \
                [f"{k_}:cut-off@{f_['at']}({f_['ratio']}x)" for k_ in ('room', 'sfx') for f_ in cs[k_]['cutoffs'] if f_.get('kind') != 'in-sample']
        if not quiet:
            print(f"    clicks (not onsets): {flags or 'none'}; onsets at cuts: "
                  f"{sum(1 for k_ in ('room', 'sfx') for f_ in cs[k_]['boundaries'] if f_['kind'] == 'onset' or f_.get('laid_onset'))}; in-sample decays: "
                  f"{[(f_['at'], f_['inside']) for f_ in cs['sfx']['cutoffs'] if f_.get('kind') == 'in-sample'] or 'none'}")
        if not quiet:
            print(f"  {os.path.relpath(os.path.join(d, s + '-room.' + ext), ROOT)} + -sfx.{ext}: {segs[s].total:.2f} s; room "
                  f"{q['room_stem']['lufs']} LUFS; sfx {len(q['sfx'])} + {len(q['added'])} added; dropped "
                  f"{[x.get('name', x.get('layer')) for x in q['sfx_dropped']]}; missing {q['sfx_missing']}; room quiet "
                  f"{q['room_under_-55dBFS_0.3s']}")
    # the tag's tail: what rings on past the story's last frame (the vault's hum), for the outro's hum hold (the mix
    # lays it under the outro's first 2 s: outro-mix.wav)
    T = segs['tag']
    i0 = int(round(T.off * SR)) + T.N
    tail = (room_b[i0:i0 + int(2.0 * SR)] + fx_b[i0:i0 + int(2.0 * SR)]).astype('float32')
    if len(tail):
        ext = VARIANTS[variant]['ext']
        sf.write(os.path.join(d, f'tag-tail.{ext}'), tail, SR, subtype='PCM_24')
        qa['tag']['tail'] = {'file': f'tag-tail.{ext}', 'seconds': round(len(tail) / SR, 3), 'lufs': round(lufs(tail), 2),
                             'what': "the sound past the tag's last frame (the vault's hum), for the outro's first 2 s"}
        json.dump(qa['tag'], open(os.path.join(d, 'tag-stems-qa.json'), 'w'), indent=1)
    if only:                             # a partial build doesn't vouch for the other stems
        return out
    json.dump({'fingerprint': fingerprint(variant, hints, segs), 'variant': variant,
               'timelines': {s: os.path.relpath(segs[s].path, ROOT) for s in SEGS},
               'hints': hints}, open(os.path.join(d, 'stems-inputs.json'), 'w'), indent=1)
    return out


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('segs', nargs='*')
    ap.add_argument('--variant', default='kokoro', choices=sorted(VARIANTS))
    ap.add_argument('--lock', default=DEFAULT_LOCK, choices=sorted(LOCKS))
    a = ap.parse_args(argv)
    set_lock(a.lock)
    only = [s for s in a.segs if s in SEGS + ['card']] or None
    print(f'stems ({a.lock}, {a.variant}):')
    build(a.variant, only)


if __name__ == '__main__':
    main(sys.argv[1:])
