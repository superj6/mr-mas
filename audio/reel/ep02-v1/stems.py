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
QA: per segment, the stems' loudness, the room's quiet windows, the second-difference click scan at every cut (onsets
  told apart from cut-offs), every sound laid, dropped or missing. Nothing here has been listened to.
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
# per-beat fix tables, empty for Ep2 until a pass needs one (Ep1's are its record): (seg, beat) -> ...
ROOM_OVERRIDE = {}            # (seg, beat) -> room
SOUND_GAIN = {}               # (seg, beat, name) -> peak dBFS


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
def score_files(seg, variant, why=None):
    """(music.wav, cues.json) for a segment's score rendered to THIS lock, or (None, None)"""
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
        except Exception:  # noqa: BLE001
            tl = None
        want = os.path.normpath(VARIANTS[variant]['tl'].format(seg=seg))
        if tl and os.path.normpath(tl) != want:
            if why is not None:
                why.append(f'{os.path.relpath(w, ROOT)} is rendered to {tl}, not {want}: not used')
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
    {(seg, beat, sound): lead_s} for a beat's own sound moved earlier"""
    lead, trail, own = {}, {}, {}
    for name in names:
        if name == 'card':
            continue
        PB = plan_beats(name)
        for b in segs[name].beats:
            pb = PB.get(b['id'], {})
            for j in as_list(pb.get('jcut')):
                if not isinstance(j, dict) or 'sound' not in j:
                    continue
                words = set(re.findall(r'[a-z]+', str(j['sound']).lower()))
                hit = next((sd for sd in b.get('sounds', []) if words & name_words(sd['name'])), None)
                ls = float(j.get('lead_s', LEAD))
                if hit is not None:
                    own[(name, b['id'], hit['name'])] = max(own.get((name, b['id'], hit['name']), 0.0), ls)
                else:
                    lead[(name, b['id'])] = ls
            for lc in as_list(pb.get('lcut')):
                if isinstance(lc, dict):
                    trail[(name, b['id'])] = float(lc.get('over_s', 1.0))
    return lead, trail, own


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
    # the beats' sounds
    for sname in names:
        g = segs[sname]
        for i, b in enumerate(g.beats):
            moved = set()                                  # a J-cut moves the FIRST sound of its name in the beat
            for k, sd in enumerate(b.get('sounds', [])):
                if f"{b['id']}:{sd['name']}" in claims.get(sname, set()):
                    qa[sname]['sfx_dropped'].append({'beat': b['id'], 'name': sd['name'], 'why': 'the score claims it (claims_sfx)'})
                    continue
                r = reseed('sfx', sname, b['id'], sd['name'], k)
                try:
                    x, off = make_sound(sd['name'], sd.get('dur'), sd.get('align'), r)
                except Exception as ex:  # noqa: BLE001
                    qa[sname]['sfx_missing'].append(f"{b['id']}:{sd['name']} ({ex.__class__.__name__}: {ex})")
                    continue
                gain = SOUND_GAIN.get((sname, b['id'], sd['name']), sd.get('gain', -24))
                x = to_peak(np.asarray(x, dtype='float64'), gain)
                lead = OWN.get((sname, b['id'], sd['name']), 0.0) if sd['name'] not in moved else 0.0
                moved.add(sd['name'])
                at = (min(sd['at'], 0.0) - lead) if lead else sd['at']
                t = g.off - t_base + g.starts[i][0] + at - off
                add_fx(fx, x, t)
                LAID.setdefault(sname, []).append((t + t_base - g.off, t + t_base - g.off + len(x) / SR, sd['name']))
                qa[sname]['sfx'].append([b['id'], sd['name'], round(t + t_base - g.off, 3), gain] + ([f'J-cut: leads by {lead} s'] if lead else []))
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
    for p in [os.path.abspath(__file__), os.path.join(HERE, 'rooms.py')] + [os.path.join(ROOT, v) for v in MOD_PATHS.values()]:
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
              'sfx_dropped': [], 'score_claims': sorted(claims.get(s, set()))} for s in SEGS + ['card']}
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
