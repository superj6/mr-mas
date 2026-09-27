"""Shared tools for the Ep1 Act Four v5 to-picture score, sequences S5-S8 (files prefixed s5-s8_).

THE CLOCK.  Every position here is an ACT position read from the locked v5 stick timeline,
show/reel/ep01-act4-v5.json (the pixel preview follows it shot for shot and line for line), at 24 fps.
Act frame 0 is the act's first frame (episode 12:31:00).  A beat's act start = its realStart - 751.0 s; a line's
speech onset = beat start + t, its end = onset + dur; a word = onset + its word time (the timeline's words are
relative to the speech onset).  Positions are kept as act SECONDS (floats) and reported as act FRAMES.

  BEATS[id]        dict(s, e, f0, f1, beat)      act seconds / frames of a stick beat (shot or continuation)
  LINES[id]        dict(on, end, words, who, text, record, beat, tag)   placed takes (lines-v5 + the timeline)
  TEXTS, SOUNDS    on-screen texts (at, until) and the stick's sound spots (at), act seconds
  Lon, Lend, W     line onset / end / word start (act s)
  snd(beat, name, k)  the k-th stick sound spot of that name in that beat (act s)
  txt(beat, prefix)   the act s at which an on-screen text that starts with `prefix` appears
  pmark(shot, mark)   a story mark from the pixel pass's lock (shots-locked-v5.json), act s, or None

  Cue(id, f0, f1)  a cue whose file t = 0 is act frame f0 (an integer); cue.s(act_s) -> cue seconds
  remap(...)       move a source cue's notes (a window of its own time) onto the cue clock (note-level, re-rendered)
  rebow(...)       a long sustained pedal as overlapping bows with silent crossfades

The engine and the batch-1 tracks are imported read-only (their helpers, cells and track settings are reused).
Nothing here was listened to.
"""
from __future__ import annotations

import importlib.util
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..'))
REPO = os.path.abspath(os.path.join(OST, '..', '..'))
if OST not in sys.path:
    sys.path.insert(0, OST)
from engine import *   # noqa: E402,F401,F403
from engine.core import Note   # noqa: E402,F401

FPS = 24
REEL_PATH = os.path.join(REPO, 'show/reel/ep01-act4-v5.json')
LINES_PATH = os.path.join(REPO, 'audio/ep01/act4/dialogue/lines-v5.json')
PIXEL_LOCK_PATH = os.path.join(REPO, 'show/episodes/ep01/production/act4/shots-locked-v5.json')
ACT_START_EP = 12 * 60 + 31          # the act's first frame in the episode (12:31:00)

REEL = json.load(open(REEL_PATH))
ACT_S = float(REEL['_source']['act_seconds'])         # 518.458
ACT_FRAMES = int(round(ACT_S * FPS))                   # 12443
_A0 = REEL['beats'][0]['realStart']                    # 751.0 (= 12:31)
_TAKES = {l['id']: l for l in json.load(open(LINES_PATH))}

BEATS, LINES, TEXTS, SOUNDS = {}, {}, [], []
for _b in REEL['beats']:
    s0 = round(_b['realStart'] - _A0, 6)
    e0 = round(s0 + _b['realDur'], 6)
    BEATS[_b['id']] = dict(s=s0, e=e0, f0=int(round(s0 * FPS)), f1=int(round(e0 * FPS)), beat=_b)
    for _l in _b['lines']:
        on = s0 + _l['t']
        tk = _TAKES.get(_l['id'], {})
        tag = tk.get('tag', '')
        LINES[_l['id']] = dict(on=on, end=on + _l['dur'], who=_l['who'], text=_l['text'], beat=_b['id'],
                               words=[(w, on + a, on + b) for w, a, b in _l['words']], tag=tag,
                               record=('[V' in tag or '[K' in tag), file=_l['audio'], in_s=_l['in'])
    for _o in _b.get('onscreen', []):
        TEXTS.append(dict(beat=_b['id'], text=_o['text'], at=s0 + _o['at'],
                          until=(s0 + _o['until']) if _o['until'] is not None else e0))
    for _o in _b.get('sounds', []):
        SOUNDS.append(dict(beat=_b['id'], name=_o['name'], at=s0 + _o['at'], gain=_o.get('gain')))

try:
    PIXEL_LOCK = json.load(open(PIXEL_LOCK_PATH))
    _PSH = {s['id']: s for s in PIXEL_LOCK['shots']}
except Exception:                                      # the pixel pass may be rewriting it; its marks are optional
    PIXEL_LOCK, _PSH = None, {}


def F(sec):
    """act seconds -> act frame (float)"""
    return sec * FPS


def S(frame):
    """act frame -> act seconds"""
    return frame / FPS


def B(bid, off=0.0):
    return BEATS[bid]['s'] + off


def BE(bid):
    return BEATS[bid]['e']


def Lon(lid, off=0.0):
    return LINES[lid]['on'] + off


def Lend(lid, off=0.0):
    return LINES[lid]['end'] + off


def W(lid, word, nth=1, end=False):
    """act s of the start (or end) of a word of a placed line (case and punctuation ignored)"""
    k = 0
    want = word.lower()
    for w, a, b in LINES[lid]['words']:
        if w.lower().strip('.,?!—-…"“”\'').startswith(want):
            k += 1
            if k == nth:
                return b if end else a
    raise KeyError((lid, word, nth))


def snd(bid, name, k=0):
    hits = [x['at'] for x in SOUNDS if x['beat'] == bid and x['name'] == name]
    return hits[k]


def txt(bid, prefix, end=False):
    for x in TEXTS:
        if x['beat'] == bid and x['text'].startswith(prefix):
            return x['until'] if end else x['at']
    raise KeyError((bid, prefix))


def pmark(shot, mark):
    """a story mark from the pixel pass's lock (act seconds), or None if the lock or the mark is missing"""
    s = _PSH.get(shot)
    if not s or mark not in s.get('marks', {}):
        return None
    return (s['s'] + s['marks'][mark]) / FPS


def tc(sec):
    """act seconds -> episode timecode HH:MM:SS:FF-style 'MM:SS:FF' (24 fps)"""
    f = int(round((ACT_START_EP + sec) * FPS))
    return f'{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}'


def load_track(folder, name=None):
    """Import tracks/<folder>/track.py read-only as a module (its own folder on sys.path, as the batch expects)."""
    d = os.path.join(OST, 'tracks', folder)
    if d not in sys.path:
        sys.path.insert(0, d)
    spec = importlib.util.spec_from_file_location(name or f'src_{folder.replace("-", "_")}', os.path.join(d, 'track.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class Cue:
    """A cue whose file t = 0 is act frame f0 (int).  Positions passed in are ACT SECONDS."""

    def __init__(self, cid, f0, f1, swing=0.0):
        self.id, self.f0, self.f1 = cid, int(f0), int(f1)
        self.t0 = self.f0 / FPS
        self.len_s = (self.f1 - self.f0) / FPS
        # the cue's own 96 BPM grid, bar 1 at the file's t = 0 (the MIDI's tempo map and the piano roll use it);
        # to-picture notes are placed in explicit seconds from act positions, so the grid never moves a sync point
        self.g = Grid(bpm=96, meter='4/4', bars=int(math.ceil(self.len_s / 2.5)) + 4, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.markers = self.a.markers
        self.sections = self.a.sections
        self.mutes = []
        self.log = []                                                       # (act s, what) for the cue sheet

    def s(self, act_sec):
        """act seconds -> cue (file) seconds"""
        return act_sec - self.t0

    def act(self, cue_sec):
        return cue_sec + self.t0

    def mark(self, act_sec, label):
        self.markers.append((self.s(act_sec), label))
        self.log.append((act_sec, label))

    def section(self, label, a0, a1):
        self.sections.append((label, self.s(a0), self.s(a1)))

    def mute(self, a0, a1):
        """a designed hard stop (act seconds): every stem and its tails to digital zero within 3 ms"""
        self.mutes.append((self.s(a0), self.s(a1)))


def remap(notes, s0, s1, d0, k=1.0, truncate=True, keep=None, drop=None, vel=1.0, extra_tail=0.0):
    """Source notes whose start is in [s0, s1) (source seconds) -> starting at d0 (cue seconds), time-scaled by k.
    truncate: gate each note off at the chunk's end (+extra_tail) -- the release still rings.  keep/drop: sets of
    instrument names.  vel: a velocity factor.  (Copied from tracks/e01-act4-v4/common.py, unchanged.)"""
    out = []
    d1 = d0 + (s1 - s0) * k + extra_tail
    for n in notes:
        if not (s0 - 1e-6 <= n.start < s1 - 1e-6):
            continue
        if keep is not None and n.inst not in keep:
            continue
        if drop is not None and n.inst in drop:
            continue
        m = n.copy()
        m.x = {kk: (list(v) if isinstance(v, list) else v) for kk, v in n.x.items()}
        m.start = d0 + (n.start - s0) * k
        m.dur = n.dur * k
        if truncate:
            m.dur = max(0.02, min(m.dur, d1 - m.start))
        for key in ('env', 'bend'):
            if m.x.get(key):
                m.x[key] = [(p[0] * k,) + tuple(p[1:]) for p in m.x[key]]
        m.vel = min(1.0, m.vel * vel)
        out.append(m)
    return out


def rebow(a, inst, pitches, t0, t1, vel, seg=5.0, xf=1.0, first_att=None, last_rel=0.8, later_offset=0.8, **x):
    """A pedal held from t0 to t1 (cue seconds) as overlapping bows of about `seg` seconds, each crossfaded over
    `xf` seconds (silent attacks: the library's sustains last 8-13 s).  (From tracks/e01-act4-v4/common.py.)
    v5: every stroke after the first starts `later_offset` seconds into its sample, so the crossfade joins sustain
    to sustain; faded in over the sample's own bow attack, each change measured a +2-3 dB swell (render 1)."""
    if isinstance(pitches, (str, int, float)):
        pitches = [pitches]
    out = []
    total = t1 - t0
    n = max(1, int(round(total / seg)))
    step = total / n
    for i in range(n):
        start = t0 + i * step - (xf * 0.5 if i else 0.0)
        end = t0 + (i + 1) * step + (xf * 0.5 if i < n - 1 else 0.0)
        dur = end - start
        fi = xf if i else (first_att or 0.0)
        fo = xf if i < n - 1 else 0.0
        env = []
        if fi > 0:
            env += [(fi * u, math.sin(0.5 * math.pi * u)) for u in (0.0, 0.25, 0.5, 0.75)]
        env.append((fi, 1.0))
        if fo > 0:
            env += [(dur - fo * (1 - u), math.cos(0.5 * math.pi * u)) for u in (0.0, 0.25, 0.5, 0.75, 1.0)]
            env.append((dur + 5.0, 0.0))
        else:
            env.append((dur + 5.0, 1.0))
        xx = dict(x)
        if i and later_offset > 0:
            xx['offset'] = later_offset
        for p in pitches:
            out.append(a.n(inst, p, start, dur, vel, lock=True, env=env, rel=(0.05 if fo else last_rel), **xx))
    return out


def base_meta(cid, title, **kw):
    m = dict(id=cid, title=title, usage='BI', composer='Ep1 Act Four v5 score, S5-S8 (re-laid from the batch-1 cues)',
             version='v5', tags=['to picture', 'Ep1', 'act four', 'v5', 'continuous', 'S5-S8'])
    m.update(kw)
    return m


def load_local(name):
    """import a sibling s5-s8_*.py file (hyphenated names can't be imported with `import`)"""
    path = os.path.join(HERE, name if name.endswith('.py') else name + '.py')
    mod_name = os.path.basename(path)[:-3].replace('-', '_')
    if mod_name in sys.modules:
        return sys.modules[mod_name]
    spec = importlib.util.spec_from_file_location(mod_name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[mod_name] = mod
    spec.loader.exec_module(mod)
    return mod
