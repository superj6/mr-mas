"""Shared helpers for composer X's Ep1 v3 score (`v3-score-a`): the cold open, Act One, Act Two and the tag.

Used by ../e01-v3-{coldopen,act1,act2,tag}/track.py.  Nothing here writes outside the calling track's folder.

  THE CLOCK      TL(path): the segment's stick-lock timeline read exactly as studio/src/reel/schema.ts timeEpisode
                 lays it with head 0: beat starts = cumulative reelDur rounded to 24 fps frames (JS Math.round);
                 a line's first sound = its beat's start + t (t may be negative: a J-cut), a sound = start + at.
                 Every sync point in every track.py comes from here, so the same score re-renders to any variant
                 of the lock (the ElevenLabs-timed timelines: --el) with one command.
  TALK           lines_in / talking / gaps: where the talk is (V.O., real lines, Mas's room lines, the rest).
  THIN           thin(): a timeline-driven pass over a cue's notes: melody and hits out under real lines and
                 the V.O., softer under other talk (OST-BIBLE rule 10; flow-and-continuity s3).
  RENDER         render_cue(): the OST engine's build (no stems, loops or MP3s) into render/_work/ (render/_work/el/ for the EL lock).
  LAY + MEASURE  assemble(): the cue renders laid on the segment clock (gates, crossfades, hard stops, posts)
                 into render/music[-el].wav at the segment's exact sample length; then the measurements the brief
                 asks for (loudness per section, digital silence, holes, fragments, the engine's QA per cue).

Nothing here has been listened to.  Every judgement is a measurement.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
OST = os.path.join(REPO, 'audio', 'ost')
if OST not in sys.path:
    sys.path.insert(0, OST)
from engine import *   # noqa: E402,F401,F403
from engine.core import SR, nm   # noqa: E402

FPS = 24
SPF = SR // FPS                        # 2000 samples a frame
Q = 0.625                              # a beat at 96 BPM
BAR = 2.5
S16 = Q / 4


# ================================================================== which timeline
def kokoro_path(seg):
    """the default: the v3.4 lock (final, 2026-09-28); the older locks are show/reel/ep01-v33/, ep01-v32/, ep01-v31/
    and ep01-v3/ (pass them with --timeline)"""
    return os.path.join(REPO, 'show', 'reel', 'ep01-v34', f'ep01-v34-{seg}.json')


def el_path(seg):
    return os.path.join(REPO, 'show', 'reel', 'ep01-v34-el', f'ep01-v34-el-{seg}.json')


_REAL = None


def real_ids():
    """line ids of the REAL (sourced) lines: the v3.1 and v3.2 locks print spoken lines without their quotation
    marks, so the record comes from the earlier locks, which quote them (the v3 lock, the v2 timelines), and (v3.2)
    from the v3/v3.1/v3.2 takes files, whose source tag says [P ...] (public record) or [V ...] (verbatim)"""
    global _REAL
    if _REAL is None:
        import glob
        _REAL = set()
        for p in glob.glob(os.path.join(REPO, 'show', 'reel', 'ep01-v3', '*.json')) + \
                glob.glob(os.path.join(REPO, 'show', 'reel', 'ep01-full', '*-v2.json')) + \
                glob.glob(os.path.join(REPO, 'show', 'reel', 'ep01-act4-v5.json')):
            try:
                d = json.load(open(p))
            except Exception:           # noqa: BLE001
                continue
            for b in d.get('beats', []):
                for l in b.get('lines', []) or []:
                    if is_real(l.get('text')):
                        _REAL.add(l['id'])
        for p in glob.glob(os.path.join(REPO, 'audio', 'ep01', 'v3*', '*', 'lines-v3*.json')):
            try:
                d = json.load(open(p))
            except Exception:           # noqa: BLE001
                continue
            for l in (d['lines'] if isinstance(d, dict) else d):
                if (l.get('tag') or '').startswith(('[P', '[V', '[K')):
                    _REAL.add(l['id'])
    return _REAL


def cli(seg, argv=None):
    """--el (the ElevenLabs-timed lock), --timeline PATH, or env V3_TIMELINE; default the Kokoro lock.
    Returns (args, timeline path, variant tag: '' for the Kokoro lock, '-el' for the EL one, '-alt' otherwise)"""
    ap = argparse.ArgumentParser()
    ap.add_argument('--el', action='store_true', help='the ElevenLabs-timed timeline (show/reel/ep01-v34-el/)')
    ap.add_argument('--timeline', default=None, help='any timeline JSON of this segment')
    ap.add_argument('--dry', action='store_true', help='build the scores, note-level QA, no audio')
    ap.add_argument('--render', nargs='*', help='render these cues (all if none named), then assemble')
    ap.add_argument('--assemble', action='store_true', help='re-lay the renders in _work and measure')
    args = ap.parse_args(argv)
    path = args.timeline or os.environ.get('V3_TIMELINE') or (el_path(seg) if args.el else kokoro_path(seg))
    if os.path.abspath(path) == os.path.abspath(kokoro_path(seg)):
        tag = ''
    elif os.path.abspath(path) == os.path.abspath(el_path(seg)):
        tag = '-el'
    elif '/ep01-v33/' in os.path.abspath(path):
        tag = '-v33'
    elif '/ep01-v33-el/' in os.path.abspath(path):
        tag = '-v33-el'
    elif '/ep01-v32/' in os.path.abspath(path):
        tag = '-v32'
    elif '/ep01-v32-el/' in os.path.abspath(path):
        tag = '-v32-el'
    elif '/ep01-v31/' in os.path.abspath(path):
        tag = '-v31'
    elif '/ep01-v31-el/' in os.path.abspath(path):
        tag = '-v31-el'
    elif '/ep01-v3/' in os.path.abspath(path):
        tag = '-v3'
    elif '/ep01-v3-el/' in os.path.abspath(path):
        tag = '-v3-el'
    else:
        tag = '-alt'
    if not os.path.exists(path):
        raise SystemExit(f'no timeline at {path}')
    return args, path, tag


# ================================================================== the clock
def js_round(x):
    return math.floor(x + 0.5)


def is_real(text):
    """a real (sourced) line or post: the timelines quote it"""
    return any(q in (text or '') for q in ('"', '“', '”'))


class TL:
    """one segment's timeline on its own clock (0 = the segment's first frame)"""

    def __init__(self, path):
        self.path = path
        d = json.load(open(path))
        self.doc = d
        self.beats, self.lines, self.sounds, self.onscreen = [], [], [], []
        self.bi = {}
        acc, prev = 0.0, 0
        for b in d['beats']:
            acc += b['reelDur']
            end = max(prev + 1, js_round(acc * FPS))
            t0, t1 = prev / FPS, end / FPS
            self.bi[b['id']] = len(self.beats)
            self.beats.append(dict(id=b['id'], t0=t0, t1=t1, f0=prev, f1=end, b=b))
            for l in b.get('lines', []) or []:
                on = t0 + l['t']
                who = l.get('who', '')
                tag = l.get('tag') or ''
                real = is_real(l.get('text')) or l['id'] in real_ids()
                kind = 'vo' if tag == 'V.O.' else ('real' if real else ('mas' if who == 'mas' else 'talk'))
                self.lines.append(dict(id=l['id'], who=who, tag=tag, kind=kind, on=on, end=on + l['dur'],
                                       text=l.get('text', ''), beat=b['id'],
                                       words=[(w[0], on + w[1], on + w[2]) for w in l.get('words', []) or []]))
            for s in b.get('sounds', []) or []:
                self.sounds.append(dict(beat=b['id'], name=s['name'], t=t0 + s.get('at', 0.0)))
            for o in b.get('onscreen', []) or []:
                self.onscreen.append(dict(beat=b['id'], text=o.get('text', ''), t=t0 + (o.get('at') or 0.0)))
            prev = end
        self.frames = prev
        self.length = prev / FPS
        self.samples = prev * SPF
        self.lines.sort(key=lambda l: l['on'])
        self.L = {l['id']: l for l in self.lines}

    # beats
    def B(self, bid):
        return self.beats[self.bi[bid]]['t0']

    def E(self, bid):
        return self.beats[self.bi[bid]]['t1']

    def has(self, bid):
        return bid in self.bi

    # lines
    def on(self, lid):
        return self.L[lid]['on']

    def end(self, lid):
        return self.L[lid]['end']

    def W(self, lid, word, k=1):
        """the start of the k-th word of a line beginning with `word`"""
        n = 0
        for w, a, _ in self.L[lid]['words']:
            if w.lower().strip('.,?!"\'…“”').startswith(word.lower()):
                n += 1
                if n == k:
                    return a
        raise KeyError((lid, word))

    def lines_in(self, t0, t1, pad=0.0, kinds=None, who=None):
        return [l for l in self.lines if l['on'] - pad < t1 and l['end'] + pad > t0
                and (kinds is None or l['kind'] in kinds) and (who is None or l['who'] in who)]

    def talking(self, t0, t1=None, pad=0.05, kinds=None, who=None):
        return bool(self.lines_in(t0, t1 if t1 is not None else t0 + 1e-3, pad, kinds, who))

    def gaps(self, t0, t1, min_len=0.5, pad_before=0.12, pad_after=0.25, kinds=None, allow_who=()):
        """free intervals in [t0, t1): no line of `kinds` sounding (lines by allow_who don't count), with a
        little air before each line and after it"""
        busy = []
        for l in self.lines_in(t0, t1, 0.5, kinds):
            if l['who'] in allow_who and l['kind'] not in ('vo', 'real'):
                continue
            busy.append((l['on'] - pad_before, l['end'] + pad_after))
        busy.sort()
        out, t = [], t0
        for a, b in busy:
            if a > t and a - t >= min_len:
                out.append((t, min(a, t1)))
            t = max(t, b)
            if t >= t1:
                break
        if t1 - t >= min_len:
            out.append((t, t1))
        return [(a, b) for a, b in out if b - a >= min_len]

    def snd(self, bid, name, k=1, default=None):
        hits = [s['t'] for s in self.sounds if s['beat'] == bid and s['name'] == name]
        if len(hits) >= k:
            return hits[k - 1]
        if default is not None:
            return default
        raise KeyError((bid, name, k))

    def snd_any(self, name, t0=0.0, t1=1e9):
        return [s['t'] for s in self.sounds if s['name'] == name and t0 <= s['t'] < t1]

    def os_at(self, bid, prefix, default=None):
        for o in self.onscreen:
            if o['beat'] == bid and o['text'].startswith(prefix):
                return o['t']
        if default is not None:
            return default
        raise KeyError((bid, prefix))

    def sentence_breaks(self, lid, n=3, min_gap=0.18):
        """the n widest pauses between a line's words (its sentence breaks), as the times the next word starts"""
        ws = self.L[lid]['words']
        gs = sorted(((ws[i + 1][1] - ws[i][2], ws[i + 1][1]) for i in range(len(ws) - 1)), reverse=True)
        return sorted(t for g, t in gs[:n] if g >= min_gap)


# ================================================================== composing helpers
class Clock:
    """a cue's file clock: file t = 0 at segment time T0"""

    def __init__(self, T0):
        self.T0 = T0

    def __call__(self, t):
        return t - self.T0

    def x(self, tf):
        return tf + self.T0


class Cue:
    """one cue under construction: an Arr on its own grid, written in SEGMENT seconds.
    bar(b) = anchor + BAR*(b - anchor_bar).  The render file starts at bar 1 (file t = 0), so the engine's own
    grid bars (Drums, swing_ride, walking_bass) are these bars.  Choose anchor_bar so bar 1 comes before the
    cue's first note; bar 1 may lie before the segment's 0 (the lay-in gates it)."""

    def __init__(self, name, tl, anchor, anchor_bar=1, bars=64, swing=0.0, meter='4/4'):
        self.name, self.tl = name, tl
        self.bar1 = anchor - BAR * (anchor_bar - 1)
        self.T0 = self.bar1
        self.clk = Clock(self.T0)
        self.g = Grid(bpm=96, meter=meter, bars=bars, swing=swing)
        self.a = Arr(self.g)
        self.marks, self.sections, self.ped = [], [], {}
        self.swing = swing

    # time
    def bar(self, b):
        return self.bar1 + BAR * (b - 1)

    def bt(self, b, beat=1.0):
        return self.bar(b) + (beat - 1.0) * Q

    def sw(self, b, beat):
        """swung position (seg s): the and-of-a-beat lands 10 frames after it (house swing)"""
        whole = math.floor(beat + 1e-9)
        frac = beat - whole
        base = self.bt(b, whole)
        if abs(frac - 0.5) < 1e-6:
            return base + Q * (2.0 / 3.0) if self.swing else base + Q * 0.5
        return base + frac * Q

    def bar_of(self, t):
        return 1 + (t - self.bar1) / BAR

    def next16(self, t):
        k = math.ceil((t - self.bar1) / S16 - 1e-6)
        return self.bar1 + k * S16

    def next8(self, t):
        k = math.ceil((t - self.bar1) / (Q / 2) - 1e-6)
        return self.bar1 + k * (Q / 2)

    def nearest_beat(self, t):
        return self.bar1 + round((t - self.bar1) / Q) * Q

    def next_beat(self, t):
        return self.bar1 + math.ceil((t - self.bar1) / Q - 1e-6) * Q

    def next_bar(self, t):
        return self.bar1 + math.ceil((t - self.bar1) / BAR - 1e-6) * BAR

    # notes (segment seconds)
    def n(self, inst, p, t, d, v, lock=False, **x):
        return self.a.n(inst, p, self.clk(t), d, v, lock, **x)

    def ch(self, inst, ps, t, d, v, roll=0.01, lock=False, **x):
        return self.a.ch(inst, ps, self.clk(t), d, v, lock=lock, roll=roll, **x)

    def pch(self, inst, ps, t, d, v, roll=0.014, span_end=None):
        """a piano chord with the sustain pedal down for its length (felt / rhodes)"""
        self.ped.setdefault(inst, []).append((self.clk(t), self.clk(span_end if span_end is not None else t + d)))
        return self.ch(inst, ps, t, d, v, roll=roll)

    def mark(self, t, label, hit=True):
        self.marks.append((t, label, hit))

    def section(self, label, t0, t1):
        self.sections.append((label, t0, t1))

    def rebow(self, inst, pitches, t0, t1, vel, seg=5.0, xf=1.0, first_att=None, last_rel=0.8, **x):
        return rebow(self.a, inst, pitches, self.clk(t0), self.clk(t1), vel, seg, xf, first_att, last_rel, **x)

    def finish(self, T, meta, length_end, end_fade=None, mutes=(), macro=None, tail_s=0.0, stem_post=None):
        """a Score on the file clock; the pedal tracks from pch(); markers from the hit marks"""
        for inst, spans in self.ped.items():
            T[inst].pedal = pedal_track(spans)
        for k in ('felt', 'rhodes', 'grand', 'upright'):
            if k in T and k not in self.ped:
                T[k].pedal = [(-1.0, False)]
        mk = [(self.clk(t), lab) for t, lab, h in self.marks if h and self.clk(t) >= 0]
        sc = Score(self.name, self.g, T, self.a.notes, markers=mk,
                   sections=[(lab, self.clk(a0), self.clk(a1)) for lab, a0, a1 in self.sections],
                   macro=[(self.clk(t), dbv) for t, dbv in macro] if macro else None,
                   mutes=[(self.clk(a0), self.clk(a1)) for a0, a1 in mutes],
                   length_s=self.clk(length_end), tail_s=tail_s,
                   end_fade=(self.clk(end_fade[0]), self.clk(end_fade[1])) if end_fade else None,
                   meta=meta, stem_post=stem_post or {},
                   mute_fade_ms=5.0)          # v3.3 (audit-v32 X2): every designed rest fades to zero over 5 ms
        return sc


def parse_line(text):
    """'C5/8 Eb5/8. r/16 G5/2 A4/8t' -> [(pitch or None, beats)] (/4 = a beat; '.' dotted; 't' triplet)"""
    out = []
    for tok in text.replace('|', ' ').split():
        p, d = tok.split('/')
        dots = d.count('.')
        trip = d.endswith('t') or 't' in d
        den = float(d.replace('.', '').replace('t', ''))
        beats = 4.0 / den
        if dots:
            beats *= 1.5
        if trip:
            beats *= 2.0 / 3.0
        out.append((None if p == 'r' else p, beats))
    return out


def phrase(c, inst, t0, text, vel, swing=0.0, gate=0.95, lock=False, stop_at=None, accents=None, **x):
    """Place a line from segment time t0 (on a beat).  swing=1.0: the house swing on 8th off-beats (+Q/6).
    Returns [(t, pitch, dur)] of the placed notes; nothing starts at or after stop_at."""
    pos, out, items = 0.0, [], parse_line(text)
    starts = []
    for p, b in items:
        starts.append(pos)
        pos += b
    starts.append(pos)

    def when(bpos):
        frac = bpos - math.floor(bpos + 1e-9)
        return t0 + bpos * Q + (swing * Q / 6.0 if abs(frac - 0.5) < 1e-6 else 0.0)

    for i, (p, b) in enumerate(items):
        if p is None:
            continue
        t, tn = when(starts[i]), when(starts[i + 1])
        if stop_at is not None and t >= stop_at - 0.01:
            break
        d = (tn - t) * gate
        if stop_at is not None:
            d = min(d, stop_at - t - 0.01)
        v = vel * (accents[i] if accents and i < len(accents) else 1.0)
        c.n(inst, p, t, d, v, lock, **x)
        out.append((t, p, d))
    return out


def line_len(text):
    return sum(b for _, b in parse_line(text)) * Q


def stab(c, inst, pitches, t, vel=0.7, length=0.2, **x):
    """a section stab at segment time t (art.stab: players a hair apart, locked)"""
    return art.stab(c.a, inst, pitches, c.clk(t), vel=vel, length=length, spread_ms=2.0, offset=0.006, **x)


def pad(c, pitches, t, d, vel=0.55, kind='warm', attack=1.5, release=1.8, bright=0.7, inst='pad', **x):
    """a soft analog-style synth pad (engine synth.pad: polyBLEP saws through a slow low-pass) at segment time t"""
    ps = [nm(p) for p in pitches]
    return c.n(inst, ps[0], t, d, vel, True, pitches=ps, kind=kind, attack=attack, release=release, bright=bright,
               **x)


def pulse(c, inst, pitch_of, t0, t1, step, vel, stop_at=None, accent=None, **x):
    """a straight pulse (locked, no swing) from t0 to t1 on the grid step; pitch_of(t) -> pitch; vel(t) -> velocity;
    accent(i) -> factor"""
    t = c.bar1 + math.ceil((t0 - c.bar1) / step - 1e-6) * step
    i, out = 0, []
    while t < t1 - 1e-4:
        if stop_at is not None and t >= stop_at - 0.005:
            break
        p = pitch_of(t)
        v = vel(t) if callable(vel) else vel
        if p is not None and v > 0:
            out.append(c.n(inst, p, t, step * 0.8, v * (accent(i) if accent else 1.0), True, **x))
        t += step
        i += 1
    return out


def drop_window(c, t0, t1, insts=None, keep=()):
    """remove notes starting in [t0, t1) (segment s): a freeze's held beat, a stop"""
    c.a.notes = [nt for nt in c.a.notes
                 if not (t0 - 0.002 <= c.clk.x(nt.start) < t1 and (insts is None or nt.inst in insts)
                         and nt.inst not in keep)]


def clip_before(c, t, insts=None, rel=0.1):
    """nothing held rings past segment time t (for the insts given): the KA-CHING's slot, a cut"""
    for nt in c.a.notes:
        s = c.clk.x(nt.start)
        if (insts is None or nt.inst in insts) and s < t < s + nt.dur:
            nt.dur = max(0.03, t - s - 0.02)
            nt.x['rel'] = min(nt.x.get('rel', 0.3), rel)


def pedal_track(spans):
    """sustain pedal from [(down, up)] spans (file s): down with each chord, up at its end, re-caught where the
    next chord comes first (copied from the v3 sample's track.py)"""
    spans = sorted(spans)
    out = [(-1.0, False)]
    for i, (t0, t1) in enumerate(spans):
        if i + 1 < len(spans):
            t1 = min(t1, spans[i + 1][0] - 0.03)
        out += [(t0 - 0.03, False), (t0 - 0.005, True), (max(t0 + 0.01, t1), False)]
    return out


def rebow(a, inst, pitches, t0, t1, vel, seg=5.0, xf=1.0, first_att=None, last_rel=0.8, **x):
    """A pedal held from t0 to t1 (file s) as overlapping bows of about `seg` seconds, each crossfaded over `xf`
    seconds (silent attacks).  Copied from Act Four v5 (tracks/e01-act4-v5/s1-s4_common.py), unchanged."""
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


PIZZ_NOTCH = ('peq', 111.3, -10.0, 8.0)     # the contrabass pizz body resonance near an A2 (MM-05 fix 1; v5)


def thin(cue, rules, t0=-1e9, t1=1e9, pad=0.1):
    """Timeline-driven thinning of a cue's notes (segment clock).  rules: {kind: {'drop': set(insts),
    'soften': {inst: factor}}} for kind in vo / real / mas / talk (strictest wins: real > vo > mas > talk).
    A note is judged by its onset: inside a line's window (from `pad` before the line to its end)."""
    order = ['real', 'vo', 'mas', 'talk']
    kept = []
    for nt in cue.a.notes:
        t = cue.clk.x(nt.start)
        if not (t0 <= t < t1):
            kept.append(nt)
            continue
        ls = cue.tl.lines_in(t, t + 1e-3, pad)
        kinds = [k for k in order if any(l['kind'] == k for l in ls)]
        if not kinds:
            kept.append(nt)
            continue
        r = rules.get(kinds[0], {})
        if nt.inst in r.get('drop', ()):
            continue
        f = r.get('soften', {}).get(nt.inst)
        if f is not None:
            nt.vel *= f
        kept.append(nt)
    cue.a.notes = kept


# ================================================================== render
def render_cue(sc, work):
    from engine.export import build as ebuild
    os.makedirs(work, exist_ok=True)
    t0 = time.time()
    ebuild(sc, work, sc.name, stems=False, loop=False, previews=False,
           workers=int(os.environ.get('OST_WORKERS', '2')))
    alb = os.path.join(work, f'{sc.name}-album.wav')
    if os.path.exists(alb):
        os.remove(alb)                          # the album master isn't used here (disk: ~9 GB left)
    return time.time() - t0


def note_qa(sc):
    from engine import analysis as an
    wt = an.written_third(sc.notes, sc.tracks)
    kc = an.knee_completion(sc.notes)
    return dict(notes=len(sc.notes), written_third_ok=wt['ok'], written_third_events=wt['events'][:6],
                grazes=wt['n_grazes'], knee_completion=kc['count'], knee_whole=knee_whole_count(sc.notes))


# ================================================================== lay-in and measurement
def _fade(n, kind):
    u = np.linspace(0.0, 1.0, max(n, 1), dtype=np.float64)
    return np.sin(0.5 * np.pi * u) if kind == 'in' else np.cos(0.5 * np.pi * u)


def db(x):
    return 10 ** (x / 20.0)


def assemble(tl, layers, out_wav, stops=(), designed=()):
    """layers: [dict(name, wav, T0, a0, a1, fin=0.0, fout=0.25, gain_db=0.0, post=None, level=None)]:
    the file laid with its t = 0 at segment T0, gated to [a0, a1) with a fade-in of `fin` s after a0 and a
    fade-out of `fout` s before a1 (fout <= 0.005: a hard stop, 5 ms).  `level`: normalise the laid window to
    this LUFS-I (after post) instead of gain_db.  stops: [(t0, t1)] forced to digital zero in the final mix
    (5 ms fades: v3.3, every designed rest fades to zero over 5 ms, so no stop ticks; audit-v32 X2).  designed: [(t0, t1, why)] the marked silences (checked, not forced)."""
    import soundfile as sf
    from engine.mix import lufs
    N = tl.samples
    mix = np.zeros((2, N), dtype=np.float64)
    laid = []
    for L in layers:
        x, sr = sf.read(L['wav'], always_2d=True, dtype='float64')
        assert sr == SR, (L['wav'], sr)
        x = x.T
        if L.get('file_in'):
            x = x[:, int(round(L['file_in'] * SR)):]
        if L.get('post') is not None:
            x = np.asarray(L['post'](x), dtype=np.float64)
        i0 = int(round(L['T0'] * SR))
        seg = np.zeros((2, N))
        lo, hi = max(0, i0), min(N, i0 + x.shape[1])
        if hi > lo:
            seg[:, lo:hi] = x[:, lo - i0:hi - i0]
        j0, j1 = max(0, int(round(L['a0'] * SR))), min(N, int(round(L['a1'] * SR)))
        gate = np.zeros(N)
        gate[j0:j1] = 1.0
        fin = int(max(0.0, L.get('fin', 0.0)) * SR)
        if fin > 0:
            gate[j0:j0 + fin] *= _fade(min(fin, j1 - j0), 'in')[: max(0, min(fin, j1 - j0))]
        fo = L.get('fout', 0.25)
        m = int(max(0.005, fo) * SR)
        m = min(m, j1 - j0)
        if m > 0 and j1 <= N:
            gate[j1 - m:j1] *= _fade(m, 'out')
        seg *= gate[None]
        g = L.get('gain_db', 0.0)
        if L.get('level') is not None:
            z = seg[:, j0:j1]
            cur = lufs(z) if np.abs(z).max() > 0 else -120
            g = L['level'] - cur
        seg *= db(g)
        mix += seg
        laid.append(dict(name=L['name'], file=os.path.relpath(L['wav'], REPO), laid_at_s=round(L['T0'], 4),
                         window=[round(L['a0'], 3), round(L['a1'], 3)], fade_in_s=L.get('fin', 0.0),
                         fade_out_s=fo, gain_db=round(float(g), 2), post=L.get('post_name')))
    for a0, a1 in stops:
        i0, i1 = int(round(a0 * SR)), min(N, int(round(a1 * SR)))
        k = int(0.005 * SR)
        mix[:, max(0, i0 - k):i0] *= _fade(min(k, i0), 'out')[None, : min(k, i0)]
        mix[:, i0:i1] = 0.0
    y = mix.T.astype(np.float32)
    os.makedirs(os.path.dirname(out_wav), exist_ok=True)
    sf.write(out_wav, y, SR, subtype='PCM_24')
    return mix, laid


def measure(tl, x, windows, rows, designed, stings=()):
    """x: [2, N] the laid mix.  windows: {name: (t0, t1)} per cue; rows: [(label, t0, t1)] sub-sections;
    designed: [(t0, t1, why)] marked silences; stings: [(t0, t1, why)] designed short sounds (not fragments)."""
    from engine import analysis as an
    from engine.mix import lufs, true_peak
    N = x.shape[1]

    def stats(t0, t1):
        i0, i1 = max(0, int(t0 * SR)), min(N, int(t1 * SR))
        z = x[:, i0:i1]
        if z.size == 0 or np.abs(z).max() < 1e-9:
            return dict(lufs_i=None, true_peak_dbtp=None)
        st = an.short_term_stats(z) if z.shape[1] > int(3.5 * SR) else dict(max=None, p95=None)
        return dict(lufs_i=round(lufs(z), 2) if z.shape[1] > int(0.5 * SR) else None, st_p95=st['p95'],
                    st_max=st['max'], true_peak_dbtp=round(20 * math.log10(true_peak(z) + 1e-12), 2))

    res = dict(length_s=round(N / SR, 4), samples=int(N), frames=tl.frames, exact=(N == tl.samples))
    res['whole'] = stats(0, N / SR)
    res['cues'] = {k: stats(*w) for k, w in windows.items()}
    res['rows'] = [dict(section=lab, start=round(a, 2), end=round(b, 2), **stats(a, b)) for lab, a, b in rows
                   if b - a >= 0.5]
    # silences: every run of digital zero >= 0.1 s, each checked against the marked ones
    nz = np.abs(x).max(0) > 0.0
    runs, i = [], 0
    edges = np.flatnonzero(np.diff(np.concatenate([[1], nz.astype(np.int8), [1]])))
    for k in range(0, len(edges), 2):
        a, b = edges[k], edges[k + 1]
        if (b - a) / SR >= 0.1:
            t0, t1 = a / SR, b / SR
            why = [w for d0, d1, w in designed if d0 - 0.35 <= t0 and t1 <= d1 + 0.35]
            runs.append(dict(t0=round(t0, 3), t1=round(t1, 3), dur=round(t1 - t0, 3), marked=bool(why),
                             why=why[0] if why else None))
    res['digital_silence'] = runs
    res['unmarked_digital_silence'] = [r for r in runs if not r['marked']]
    # holes: 50 ms windows under -60 dBFS for >= 0.3 s that aren't inside a marked silence
    hop = int(0.05 * SR)
    env = np.abs(x).max(0)[: (N // hop) * hop].reshape(-1, hop).max(1)
    quiet = env < db(-60)
    holes, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            t0, t1 = i * hop / SR, j * hop / SR
            if t1 - t0 >= 0.3:
                ok = any(d0 - 1.6 <= t0 and t1 <= d1 + 0.4 for d0, d1, _ in designed)
                holes.append(dict(t0=round(t0, 2), t1=round(t1, 2), inside_marked=ok))
            i = j
        else:
            i += 1
    res['holes_below_-60'] = holes
    # fragments: music runs (above -60 dBFS, 50 ms hops; rests shorter than 0.75 s inside a phrase don't split a
    # run, e.g. a 1-bit beeper's or a pizzicato's own rests) shorter than 2 s, other than designed stings
    frags, spans, i = [], [], 0
    loud = ~quiet
    while i < len(loud):
        if loud[i]:
            j = i
            while j < len(loud) and loud[j]:
                j += 1
            spans.append([i * hop / SR, j * hop / SR])
            i = j
        else:
            i += 1
    merged = []
    for s in spans:
        if merged and s[0] - merged[-1][1] < 0.75:
            merged[-1][1] = s[1]
        else:
            merged.append(list(s))
    res['music_runs'] = [dict(t0=round(a, 2), t1=round(b, 2), dur=round(b - a, 2)) for a, b in merged]
    for t0, t1 in merged:
        if t1 - t0 < 2.0:
            st = [w for s0, s1, w in stings if s0 - 0.3 <= t0 and t1 <= s1 + 0.6]
            frags.append(dict(t0=round(t0, 2), t1=round(t1, 2), dur=round(t1 - t0, 2),
                              designed_sting=st[0] if st else None))
    res['fragments_under_2s'] = frags
    res['undesigned_fragments'] = [f for f in frags if not f['designed_sting']]
    return res


def momentary_max(x, t0, t1, win=0.4, hop=0.1):
    """the loudest 400 ms momentary loudness (LUFS-M, BS.1770 K-weighted, ungated) in [t0, t1) of x [2, N]"""
    from engine.mix import k_weight
    i0, i1 = max(0, int(t0 * SR)), min(x.shape[1], int(t1 * SR))
    z = k_weight(np.asarray(x[:, i0:i1], dtype=np.float64))
    w, h = int(win * SR), int(hop * SR)
    best = -120.0
    for a in range(0, max(1, z.shape[1] - w), h):
        ms = float(np.mean(z[:, a:a + w] ** 2, axis=1).sum())
        if ms > 0:
            best = max(best, -0.691 + 10 * math.log10(ms))
    return round(best, 2)


def engine_qa(work, name):
    """the engine's own QA for one cue render (its cue.json)"""
    p = os.path.join(work, f'{name}.cue.json')
    if not os.path.exists(p):
        return None
    c = json.load(open(p))
    qa = c.get('qa', {})
    fm = c.get('f_major') or qa.get('f_major') or {}
    out = dict(
        masters=c.get('masters', {}).get('underscore'),
        f_major_ok=(fm.get('ok') if isinstance(fm, dict) else None),
        f_major_ok_written=(fm.get('ok_written') if isinstance(fm, dict) else None),
        f_major_worst=(fm.get('worst') if isinstance(fm, dict) else None),
        knee_whole=c.get('knee_whole'), knee_completion=(c.get('knee_completion') or {}).get('count')
        if isinstance(c.get('knee_completion'), dict) else c.get('knee_completion'),
        hit_check=_hits_summary(c.get('hit_check')),
        warnings=c.get('warnings', [])[:12])
    return out


def _hits_summary(h):
    if not h:
        return None
    try:
        rows = h if isinstance(h, list) else h.get('hits', [])
        ok = sum(1 for r in rows if r.get('offset_ms') is not None and abs(r['offset_ms']) <= 10.0)
        worst = max((abs(r['offset_ms']) for r in rows if r.get('offset_ms') is not None), default=None)
        return dict(within_10ms=ok, of=len(rows), worst_ms=worst)
    except Exception:           # noqa: BLE001
        return None


def write_json(path, doc):
    json.dump(doc, open(path, 'w'), indent=1, ensure_ascii=False, default=float)
