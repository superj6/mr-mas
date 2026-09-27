"""Act Four's cue APIs on the v3 clock: Act Four v5's two styles, so its scores carry over with their sync maps
re-derived from the v3 (or ElevenLabs-timed) lock instead of v5's.

bind(clock) first (a v3clock.Clock for 'act4').  Then:

  FRAMES (v5 S1-S4 style; act frame 0 = the segment's first frame, floats):
    A(beat, k)  Lon(line)  Lend(line)  W(line, word)  SND(beat, name, k)  TXT(beat, prefix)   act frames
    in_talk(frame, pad_f)                                                                    any line sounding?
    FCue(id, f_in, f_end, pre)   file t = 0 at act frame f_in - pre; cue.s(frame) -> file seconds
    cue.sec(anchor)              a local 96 BPM grid whose bar 1 beat 1 sits on that act frame (Sec)
  SECONDS (v5 S5-S8 style):
    SCue(id, f0, f1)             file t = 0 at act frame f0 (an integer); cue.s(act s) -> file seconds
  load_track(folder)             a batch-1 tracks/<folder>/track.py, imported read-only

Copied from tracks/e01-act4-v5/s1-s4_common.py and s5-s8_common.py (read-only there).  Nothing here was listened to.
"""
from __future__ import annotations

import importlib.util
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..'))
if OST not in sys.path:
    sys.path.insert(0, OST)
from engine import *   # noqa: E402,F401,F403
from engine.core import Note, nm   # noqa: E402,F401

FPS = 24
BEAT_F = 15.0
CLK = None


def bind(clock):
    global CLK
    CLK = clock
    return clock


# ------------------------------------------------------------------ frames
def A(bid, k=0.0):
    return CLK.B(bid) * FPS + k


def AE(bid):
    return CLK.BE(bid) * FPS


def Lon(lid):
    return CLK.Lon(lid) * FPS


def Lend(lid):
    return CLK.Lend(lid) * FPS


def W(lid, word, nth=1, end=False):
    return CLK.W(lid, word, nth, end) * FPS


def SND(bid, name, k=0):
    return CLK.snd(bid, name, k) * FPS


def TXT(bid, prefix, end=False):
    return CLK.txt(bid, prefix, end) * FPS


def in_talk(frame, pad_f=3.0):
    t, p = frame / FPS, pad_f / FPS
    return any(l['on'] - p <= t < l['end'] + p for l in CLK.LINES.values())


_ASCII = {'✓': 'v', '→': '->', '…': '...', '—': '-', '–': '-', '“': '"', '”': '"', '’': "'", '‘': "'", '♥': '<3'}


def midi_safe(text):
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
        return self.g.t(1) + (frame - self.anchor) / FPS

    def q(self, frame):
        return (frame - self.anchor) / BEAT_F

    def commit(self):
        for n in self.a.notes:
            n.start += self.off
        self.cue.notes += self.a.notes
        self.a.notes = []
        return self


class FCue:
    """v5's frame-clock cue: f_in is the act frame of its first sound; file t = 0 is f_in - pre."""

    def __init__(self, cid, f_in, f_end, pre=12, swing=0.0):
        self.id, self.f_in, self.f_end, self.f0 = cid, f_in, f_end, f_in - pre
        self.len_s = (f_end - self.f0) / FPS
        self.g = Grid(bpm=96, meter='4/4', bars=int(math.ceil(self.len_s / 2.5)) + 4, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.markers, self.sections, self.mutes, self.log = [], [], [], []

    @property
    def T0(self):
        return self.f0 / FPS

    def s(self, frame):
        return (frame - self.f0) / FPS

    def fr(self, sec):
        return self.f0 + sec * FPS

    def sec(self, anchor, bars=24, swing=0.0, meter='4/4'):
        return Sec(self, anchor, bars, swing, meter)

    def mark(self, frame, label, hit=True):
        if hit:
            self.markers.append((self.s(frame), midi_safe(label)))
        self.log.append((float(frame) / FPS, label, hit))

    def section(self, label, f0, f1):
        self.sections.append((midi_safe(label), self.s(f0), self.s(f1)))

    def mute(self, f0, f1):
        self.mutes.append((self.s(f0), self.s(f1)))


# ------------------------------------------------------------------ seconds
class SCue:
    """v5 S5-S8's seconds-clock cue: file t = 0 is act frame f0 (int); positions passed in are act SECONDS."""

    def __init__(self, cid, f0, f1, swing=0.0):
        self.id, self.f0, self.f1 = cid, int(f0), int(f1)
        self.t0 = self.f0 / FPS
        self.len_s = (self.f1 - self.f0) / FPS
        self.g = Grid(bpm=96, meter='4/4', bars=int(math.ceil(self.len_s / 2.5)) + 4, swing=swing)
        self.a = Arr(self.g)
        self.notes = self.a.notes
        self.markers = self.a.markers
        self.sections = self.a.sections
        self.mutes = []
        self.log = []

    @property
    def T0(self):
        return self.t0

    def s(self, act_sec):
        return act_sec - self.t0

    def act(self, cue_sec):
        return cue_sec + self.t0

    def mark(self, act_sec, label, hit=True):
        if hit:
            self.markers.append((self.s(act_sec), midi_safe(label)))
        self.log.append((act_sec, label, hit))

    def section(self, label, a0, a1):
        self.sections.append((midi_safe(label), self.s(a0), self.s(a1)))

    def mute(self, a0, a1):
        self.mutes.append((self.s(a0), self.s(a1)))


def load_track(folder, name=None):
    """Import tracks/<folder>/track.py read-only (its own folder on sys.path, as the batch expects)."""
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
