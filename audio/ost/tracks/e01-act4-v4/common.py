"""Shared tools for the Ep1 Act Four v4 to-picture cues (tracks/e01-act4-v4/).

Every cue here is rendered TO THE V4 PICTURE LOCK (show/episodes/ep01/production/act4/shots-locked-v4.json):
positions are act frames read from the lock (shot starts, story marks, line and word frames), so picture and
score share one clock.  The engine and the batch-1 tracks are imported read-only; their composers' helpers
(pulses, chorales, cells, motifs) and track settings are reused, and the material is re-laid to v4's lengths.

  Cue(id, f0, f1)          a cue that starts at act frame f0 (cue t = 0) and ends at f1
  cue.s(frame)             act frame -> cue seconds
  cue.sec(anchor, ...)     a section Arr on its own 96 BPM grid whose bar 1 lands on act frame `anchor`
                           (so the source helpers can keep writing in bars and beats); sec.commit() adds its notes
  remap(notes, ...)        note-level edit: move a source cue's notes (a window of its own time) onto the act clock,
                           at a tempo factor k (k = 1: unchanged).  A re-layout of the score, not an audio edit:
                           every note is re-rendered, so tails and reverbs ring naturally across the joins.
  rebow(...)               a long sustained pedal as overlapping bows (the samples are 8-13 s long)
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
from engine.core import Note   # noqa: E402

FPS = 24
LOCK_PATH = os.path.join(REPO, 'show/episodes/ep01/production/act4/shots-locked-v4.json')
LOCK = json.load(open(LOCK_PATH))
SH = {s['id']: s for s in LOCK['shots']}
LN = {l['id']: l for s in LOCK['shots'] for l in s['lines']}
TX = [t for s in LOCK['shots'] for t in s['texts']]
ACT_FRAMES = LOCK['summary']['act_frames']


# ---- v4.1: the cues were written on lock v4.0's frames. lock-v4.0.json is that lock (a snapshot, never edited);
# w(frame) maps a v4.0 frame literal onto the current lock, piecewise-linear between knots that exist in both: every
# kept shot's start and end, every story mark kept by name, every line's in and out. Shots v4.1 removed collapse to
# their cut point; S6.05 + S6.06 merged (old S6.05's start is the new S6.06's start); the old S5.09 'type' mark is the
# new S5.09b 'type'. A literal frame in a cue is a v4.0 frame; a lock anchor (A, M, L_in, W...) is already current.
OLD_PATH = os.path.join(HERE, 'lock-v4.0.json')


def _warp_knots():
    old = json.load(open(OLD_PATH))
    OS = {s['id']: s for s in old['shots']}
    OL = {l['id']: l for s in old['shots'] for l in s['lines']}
    kn = []
    for sid, n in SH.items():
        o = OS.get(sid)
        if o is None:
            continue
        if sid != 'S6.06':
            kn += [(o['start_frame'], n['start_frame']), (o['end_frame'], n['end_frame'])]
        else:
            kn += [(OS['S6.05']['start_frame'], n['start_frame']), (o['end_frame'], n['end_frame'])]
        for m, v in o['marks'].items():
            if m in n['marks']:
                kn.append((o['start_frame'] + v, n['start_frame'] + n['marks'][m]))
    for lid, l in LN.items():
        if lid in OL:
            kn += [(OL[lid]['abs_in'], l['abs_in']), (OL[lid]['abs_out'], l['abs_out'])]
    if 'S5.09b' in SH:
        kn.append((OS['S5.09']['start_frame'] + OS['S5.09']['marks']['type'], SH['S5.09b']['start_frame'] + SH['S5.09b']['marks']['type']))
    kn.sort()
    out, last = [], -1e9
    for a, b in kn:                                     # strictly increasing in v4.0, never going back in the new lock
        if out and a <= out[-1][0]:
            continue
        if b < last:
            continue
        out.append((a, b))
        last = b
    return out


_KN = _warp_knots()


def w(f_old):
    """a v4.0 lock frame -> the current lock's frame (float)"""
    xs = [a for a, _ in _KN]
    ys = [b for _, b in _KN]
    if f_old <= xs[0]:
        return ys[0] + (f_old - xs[0])
    if f_old >= xs[-1]:
        return ys[-1] + (f_old - xs[-1])
    lo, hi = 0, len(xs) - 1
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if xs[mid] <= f_old:
            lo = mid
        else:
            hi = mid
    t = (f_old - xs[lo]) / (xs[hi] - xs[lo])
    return ys[lo] + t * (ys[hi] - ys[lo])


def A(sid, k=0):
    """act frame of shot-relative frame k"""
    return SH[sid]['start_frame'] + k


def E(sid):
    return SH[sid]['end_frame']


def M(sid, mark):
    """act frame of a story mark"""
    return SH[sid]['start_frame'] + SH[sid]['marks'][mark]


def L_in(lid):
    return LN[lid]['abs_in']


def L_out(lid):
    return LN[lid]['abs_out']


def W(lid, word):
    """act frame where a word of a line starts (lines.json word timings, as placed by the lock)"""
    l = LN[lid]
    for w, f0, f1 in l.get('words', []):
        if w.lower().strip('.,?!—-…"\'').startswith(word.lower()):
            return l['abs_in'] + f0
    raise KeyError((lid, word))


def load_track(folder, name=None):
    """Import tracks/<folder>/track.py read-only as a module (its own folder on sys.path, as the batch expects)."""
    d = os.path.join(OST, 'tracks', folder)
    if d not in sys.path:
        sys.path.insert(0, d)
    spec = importlib.util.spec_from_file_location(name or f'src_{folder.replace("-", "_")}', os.path.join(d, 'track.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class Sec:
    """A section written on its own grid; commit() shifts it onto the cue clock."""

    def __init__(self, cue, g, off, label=None):
        self.cue, self.g, self.off, self.label = cue, g, off, label
        self.a = Arr(g)

    def t(self, pos):
        """cue seconds of a section position"""
        return self.g.at(pos) + self.off

    def commit(self):
        for n in self.a.notes:
            n.start += self.off
        self.cue.notes += self.a.notes
        self.cue.markers += [(t + self.off, lab) for t, lab in self.a.markers]
        self.cue.sections += [(lab, t0 + self.off, t1 + self.off) for lab, t0, t1 in self.a.sections]
        self.a.notes, self.a.markers, self.a.sections = [], [], []
        return self


class Cue:
    def __init__(self, cid, f0, f1, swing=0.0):
        self.id, self.f0, self.f1 = cid, f0, f1
        self.len_s = (f1 - f0) / FPS
        self.g = Grid(bpm=96, meter='4/4', bars=int(math.ceil(self.len_s / 2.5)) + 3, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.markers = self.a.markers
        self.sections = self.a.sections
        self.mutes = []

    def s(self, frame):
        return (frame - self.f0) / FPS

    def sec(self, anchor_frame, bars=16, pickup=0, swing=0.0, meters=None, tempo=None, bpm=96, label=None):
        g = Grid(bpm=bpm, meter='4/4', bars=bars, pickup=pickup, swing=swing, meters=meters or [], tempo=tempo or [])
        return Sec(self, g, self.s(anchor_frame) - g.t(1), label)

    def mark(self, frame, label):
        self.markers.append((self.s(frame), label))

    def section(self, label, f0, f1):
        self.sections.append((label, self.s(f0), self.s(f1)))

    def mute(self, f0, f1):
        """a designed hard stop on the cue clock (every stem and its tails to digital zero, 3 ms)"""
        self.mutes.append((self.s(f0), self.s(f1)))


def remap(notes, s0, s1, d0, k=1.0, truncate=True, keep=None, drop=None, vel=1.0, extra_tail=0.0):
    """Source notes whose start is in [s0, s1) (source seconds) -> starting at d0 (cue seconds), time-scaled by k.
    truncate: gate each note off at the chunk's end (+extra_tail) -- the release still rings.  keep/drop: sets of
    instrument names to keep or drop.  vel: a velocity factor."""
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
    over `xf` seconds (silent attacks: the sample library's sustains last 8-13 s)."""
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


def pedal_points(spans, pre=0.01):
    """sustain pedal automation from [(t_down, t_up)] (seconds)"""
    pts = [(0.0, False)]
    for d, u in spans:
        pts += [(d + pre, True), (u, False)]
    return pts


def base_meta(cid, title, **kw):
    m = dict(id=cid, title=title, usage='BI', composer='Ep1 Act Four v4 sound pass (re-laid from batch-1 cues)',
             version='v4', tags=['to picture', 'Ep1', 'act four', 'v4', 'continuous'])
    m.update(kw)
    return m
