"""Shared tools for the Ep1 Act Four v5 to-picture score, sequences S1-S4 and the card (files prefixed s1-s4_).

THE CLOCK.  Every sync point is an ACT FRAME (24 fps; act frame 0 = episode 12:31:00) read from the LOCKED stick
timeline show/reel/ep01-act4-v5.json and the takes audio/ep01/act4/dialogue/lines-v5.json (the pixel preview
follows both shot for shot and line for line).  A beat's act start = its realStart - 751.0 s; a line's first sound
= beat start + t; its last sound = that + dur; a word = the first sound + its word time.  Story marks that the
timeline only implies (the walk-offs' word, the arrow's steps, the folder's slide) are read from the pixel pass's
lock show/episodes/ep01/production/act4/shots-locked-v5.json, which is derived from the same timeline;
verify() re-derives every shot start and every line onset from the timeline and fails loudly if the two disagree.

Frames are kept as floats (a sound can fall inside a frame); the cue sheet reports them rounded.

  SH[id], LN[id], POSTS      shots (s, e, marks), lines (on, end, words, tag, record, mode), silent posts (a, b)
  A(sid, k)  E(sid)  M(sid, mark)  Lon(lid)  Lend(lid)  W(lid, word)       act frames
  Cue(id, f_in, f_end, pre=12)  a cue whose file t = 0 is act frame f_in - pre; cue.s(frame) -> file seconds
  cue.sec(anchor_frame)         a local 96 BPM grid whose bar 1 beat 1 sits on that act frame (for bar/beat writers)
  remap(...), rebow(...)         note-level moves and long pedals (copied from tracks/e01-act4-v4/common.py)
  load_track(folder)             a batch-1 track.py, imported read-only

The engine and the batch-1 tracks are imported read-only.  Nothing here was listened to.
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
BEAT_F = 15.0                                        # 96 BPM: a beat is 15 frames, a bar 60
REEL_PATH = os.path.join(REPO, 'show/reel/ep01-act4-v5.json')
LINES_PATH = os.path.join(REPO, 'audio/ep01/act4/dialogue/lines-v5.json')
LOCK_PATH = os.path.join(REPO, 'show/episodes/ep01/production/act4/shots-locked-v5.json')
RENDER = os.path.join(HERE, 'render')
ACT_START_EP = 12 * 60 + 31

REEL = json.load(open(REEL_PATH))
TAKES = {t['id']: t for t in json.load(open(LINES_PATH))}
LOCK = json.load(open(LOCK_PATH))
_A0 = REEL['beats'][0]['realStart']                  # 751.0 s = 12:31:00

# ---------------------------------------------------------------- the timeline (primary)
BEATS = {}
LN = {}
for _b in REEL['beats']:
    f0 = (_b['realStart'] - _A0) * FPS
    BEATS[_b['id']] = dict(f0=f0, f1=f0 + _b['realDur'] * FPS, beat=_b)
    for _l in _b['lines']:
        on = f0 + _l['t'] * FPS
        tk = TAKES[_l['id']]
        tag = tk.get('tag', '')
        br = []                                          # breaths before / inside the take, act frames
        for x in tk.get('breaths') or []:
            br.append((on + (x['t0'] - _l['in']) * FPS, on + (x['t1'] - _l['in']) * FPS, x.get('where')))
        LN[_l['id']] = dict(id=_l['id'], on=on, end=on + _l['dur'] * FPS, who=_l['who'], text=_l['text'],
                            beat=_b['id'], tag=tag, record=tag.startswith('[V'), mode=tk.get('mode'),
                            kind=tk.get('kind'), device=tk.get('device'), breaths=br,
                            words=[(w, on + a * FPS, on + b * FPS) for w, a, b in _l['words']])
POSTS = []                                               # the silent posts: record items on screen, never voiced
for _b in REEL['beats']:
    f0 = (_b['realStart'] - _A0) * FPS
    for o in _b.get('onscreen', []):
        if o['text'].startswith('POST:'):
            end = f0 + (o['until'] if o['until'] is not None else _b['realDur']) * FPS
            POSTS.append(dict(beat=_b['id'], a=f0 + o['at'] * FPS, b=end, text=o['text']))

# ---------------------------------------------------------------- the pixel lock (marks; cross-checked)
SH = {s['id']: s for s in LOCK['shots']}


def A(sid, k=0.0):
    """act frame of a shot-relative frame"""
    return SH[sid]['s'] + k


def E(sid):
    return SH[sid]['e']


def M(sid, mark):
    """act frame of a story mark (pixel lock)"""
    return SH[sid]['s'] + SH[sid]['marks'][mark]


def Lon(lid):
    return LN[lid]['on']


def Lend(lid):
    return LN[lid]['end']


def W(lid, word, nth=1, end=False):
    k = 0
    for w, a, b in LN[lid]['words']:
        if w.lower().strip('.,?!—-…"“”\'').startswith(word.lower()):
            k += 1
            if k == nth:
                return b if end else a
    raise KeyError((lid, word, nth))


def verify():
    """Re-derive the pixel lock's shot starts and line onsets from the timeline; fail on any disagreement."""
    bad = []
    for s in LOCK['shots']:
        b = BEATS.get(s['beats'][0])
        if b is None or abs(b['f0'] - s['s']) > 0.51:
            bad.append(('shot', s['id'], s['s'], b and b['f0']))
    for l in LOCK['lines']:
        me = LN.get(l['id'])
        if me is None or not (math.floor(me['on'] + 1e-6) == l['abs_in'] or abs(me['on'] - l['abs_in']) < 1.01):
            bad.append(('line', l['id'], l['abs_in'], me and me['on']))
    if bad:
        raise SystemExit(f'the pixel lock disagrees with the stick timeline: {bad[:6]}')
    return dict(shots=len(LOCK['shots']), lines=len(LOCK['lines']), ok=True)


def tc(frame):
    """act frame -> episode timecode MM:SS:FF"""
    f = int(round(ACT_START_EP * FPS + frame))
    return f'{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}'


def load_track(folder, name=None):
    """Import tracks/<folder>/track.py read-only as a module (its own folder on sys.path, as the batch expects)."""
    d = os.path.join(OST, 'tracks', folder)
    if d not in sys.path:
        sys.path.insert(0, d)
    mod_name = name or f'src_{folder.replace("-", "_")}'
    if mod_name in sys.modules:
        return sys.modules[mod_name]
    spec = importlib.util.spec_from_file_location(mod_name, os.path.join(d, 'track.py'))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[mod_name] = mod
    spec.loader.exec_module(mod)
    return mod


def load_local(name):
    """import a sibling s1-s4_*.py file (hyphenated names can't be imported with `import`)"""
    path = os.path.join(HERE, name if name.endswith('.py') else name + '.py')
    mod_name = os.path.basename(path)[:-3].replace('-', '_')
    if mod_name in sys.modules:
        return sys.modules[mod_name]
    spec = importlib.util.spec_from_file_location(mod_name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[mod_name] = mod
    spec.loader.exec_module(mod)
    return mod


# ---------------------------------------------------------------- cues
_ASCII = {'✓': 'v', '→': '->', '…': '...', '—': '-', '–': '-', '“': '"', '”': '"', '’': "'", '‘': "'"}


def midi_safe(text):
    """MIDI marker text must be latin-1 (mido): swap the few typographic marks the labels use"""
    for k, v in _ASCII.items():
        text = text.replace(k, v)
    return text.encode('latin-1', 'replace').decode('latin-1')


class Sec:
    """A local 96 BPM grid whose bar 1 beat 1 is an act frame; commit() moves its notes onto the cue clock."""

    def __init__(self, cue, anchor, bars=24, swing=0.0, meter='4/4'):
        self.cue, self.anchor = cue, anchor
        self.g = Grid(bpm=96, meter=meter, bars=bars, swing=swing)
        self.a = Arr(self.g)
        self.off = cue.s(anchor) - self.g.t(1)

    def f(self, frame):
        """an act frame -> seconds on this grid"""
        return self.g.t(1) + (frame - self.anchor) / FPS

    def q(self, frame):
        """an act frame -> this grid's quarter position (bar 1 beat 1 = 0)"""
        return (frame - self.anchor) / BEAT_F

    def commit(self):
        for n in self.a.notes:
            n.start += self.off
        self.cue.notes += self.a.notes
        self.a.notes = []
        return self


class Cue:
    def __init__(self, cid, f_in, f_end, pre=12, swing=0.0):
        """f_in: the act frame of the cue's first sound; the file's t = 0 is f_in - pre (a pre-roll of silence,
        so sample latency never trims an entry).  f_end: the act frame where the cue's music ends (its out)."""
        self.id, self.f_in, self.f_end, self.f0 = cid, f_in, f_end, f_in - pre
        self.len_s = (f_end - self.f0) / FPS
        self.g = Grid(bpm=96, meter='4/4', bars=int(math.ceil(self.len_s / 2.5)) + 4, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.markers = []
        self.sections = []
        self.mutes = []
        self.log = []

    def s(self, frame):
        return (frame - self.f0) / FPS

    def fr(self, sec):
        return self.f0 + sec * FPS

    def sec(self, anchor, bars=24, swing=0.0, meter='4/4'):
        return Sec(self, anchor, bars, swing, meter)

    def mark(self, frame, label, hit=True):
        """a cue point at an act frame; hit=True: the onset QA checks a note starts there (+-10 ms)"""
        if hit:
            self.markers.append((self.s(frame), midi_safe(label)))
        self.log.append((float(frame), label, hit))

    def section(self, label, f0, f1):
        self.sections.append((midi_safe(label), self.s(f0), self.s(f1)))

    def mute(self, f0, f1):
        """a designed hard stop between act frames: every stem and its tails to digital zero within 3 ms"""
        self.mutes.append((self.s(f0), self.s(f1)))


def remap(notes, s0, s1, d0, k=1.0, truncate=True, keep=None, drop=None, vel=1.0, extra_tail=0.0):
    """Source notes whose start is in [s0, s1) (source seconds) -> starting at d0 (cue seconds), time-scaled by k.
    (tracks/e01-act4-v4/common.py, unchanged)"""
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


def rebow(a, inst, pitches, t0, t1, vel, seg=5.0, xf=1.0, first_att=None, last_rel=0.8, **x):
    """A pedal held from t0 to t1 (seconds on a's grid) as overlapping bows of about `seg` seconds, each crossfaded
    over `xf` seconds (silent attacks: the library's sustains last 8-13 s).  (tracks/e01-act4-v4/common.py)"""
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
        for p in pitches:
            out.append(a.n(inst, p, start, dur, vel, lock=True, env=env, rel=(0.05 if fo else last_rel), **x))
    return out


def talk_windows(f0=0.0, f1=1e9, hold_f=0.0):
    """[(on, end, id)] of the voiced lines between two act frames (the thin windows; hold_f widens each)"""
    out = []
    for l in LN.values():
        if l['end'] > f0 and l['on'] < f1:
            out.append((l['on'] - hold_f, l['end'] + hold_f, l['id']))
    return sorted(out)


def in_talk(frame, pad_f=3.0):
    """is an act frame inside a voiced line (with a small pad either side)?"""
    return any(l['on'] - pad_f <= frame < l['end'] + pad_f for l in LN.values())


def base_meta(cid, title, **kw):
    m = dict(id=cid, title=title, usage='BI', composer='Ep1 Act Four v5 score, S1-S4 (re-laid from the batch-1 cues)',
             version='v5', tags=['to picture', 'Ep1', 'act four', 'v5', 'continuous', 'S1-S4'])
    m.update(kw)
    return m
