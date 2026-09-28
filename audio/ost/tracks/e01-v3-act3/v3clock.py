"""The v3 clock: one segment of the Ep1 v3 lock (or its ElevenLabs-timed variant) as seconds on the segment's own clock.

0 is the segment's first frame.  A beat starts at the cumulative reelDur rounded to 24 fps frames, exactly as
studio/src/reel/schema.ts timeEpisode() lays it with head 0 (Math.round, so .5 rounds up).  A line's first sound is
its beat's start + t, its last sound that + dur; a word is the first sound + its word time; a sound is the beat's start
+ at; an on-screen text runs from the beat's start + at to + until (or the beat's end).

    clk = Clock('act4')                       # the Kokoro lock: show/reel/ep01-v32/ep01-v32-act4.json (v3.2, final)
    clk = Clock('act4', variant='el')         # show/reel/ep01-v32-el/ep01-v32-el-act4.json
    (MRMAS_V3_LOCK=v31 or v3 selects an earlier lock, show/reel/ep01-v31/ or ep01-v3/)
    clk = Clock('act4', path='some.json')     # any timeline with the same beat and line ids

    clk.B(id) clk.BE(id)                      beat start / end
    clk.Lon(id) clk.Lend(id) clk.W(id, word)  line first / last sound, a word's start (or end=True)
    clk.snd(beat, name, k=0)                  the k-th sound of that name in that beat
    clk.txt(beat, prefix, end=False)          when an on-screen text that starts with prefix appears (or goes)
    clk.lines(t0, t1, pred)                   the lines sounding between t0 and t1
    clk.talk(t, pad)                          is any line sounding at t (with a pad)?

A line is RECORD when its take's tag marks it as real ([V, [P, [K, or "+ V ·"); V.O. is tag 'V.O.' in the timeline.
The takes files are the timeline's own _source.takes_files.

This file is identical in tracks/e01-v3-act3/ and tracks/e01-v3-act4/.  Nothing here was listened to.
"""
from __future__ import annotations

import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
FPS = 24
SR = 48000


def js_round(x):
    return int(math.floor(x + 0.5))


LOCK = os.environ.get('MRMAS_V3_LOCK', 'v32')           # the final lock is v3.2 (2026-09-28); 'v31', 'v3' = earlier
TAGS = {'v32': 'ep01-v32', 'v31': 'ep01-v31', 'v3': 'ep01-v3'}


def timeline_path(seg, variant='kokoro', lock=None):
    lock = lock or LOCK
    tag = TAGS[lock]
    if variant in (None, '', 'kokoro'):
        return os.path.join(REPO, 'show', 'reel', tag, f'{tag}-{seg}.json')
    if variant == 'el':
        return os.path.join(REPO, 'show', 'reel', f'{tag}-el', f'{tag}-el-{seg}.json')
    raise ValueError(variant)


def _is_record(tag, text):
    tag = tag or ''
    if tag.startswith('[V') or tag.startswith('[P') or tag.startswith('[K') or '+ V ·' in tag or '· V ·' in tag:
        return True
    return False


class Clock:
    def __init__(self, seg, variant='kokoro', path=None):
        self.seg = seg
        self.variant = 'custom' if path else (variant or 'kokoro')
        self.path = path or timeline_path(seg, variant)
        tl = json.load(open(self.path))
        self.tl = tl
        tags = {}
        for tf in (tl.get('_source') or {}).get('takes_files') or []:
            p = os.path.join(REPO, tf)
            if os.path.exists(p):
                for t in json.load(open(p)):
                    tags[t['id']] = t.get('tag', '')
        self.BEATS, self.LINES, self.TEXTS, self.SOUNDS, self.ORDER = {}, {}, [], [], []
        acc, prev = 0.0, 0
        for b in tl['beats']:
            acc += b['reelDur']
            end = max(prev + 1, js_round(acc * FPS))
            s0, e0 = prev / FPS, end / FPS
            self.BEATS[b['id']] = dict(s=s0, e=e0, f0=prev, f1=end, beat=b)
            self.ORDER.append(b['id'])
            for l in b.get('lines') or []:
                on = s0 + l['t']
                tag = tags.get(l['id'], '')
                self.LINES[l['id']] = dict(
                    id=l['id'], on=on, end=on + l['dur'], who=l['who'], text=l['text'], beat=b['id'],
                    vo=(l.get('tag') == 'V.O.'), device=l.get('tag') or '', take_tag=tag,
                    record=_is_record(tag, l['text']),
                    words=[(w[0], on + w[1], on + w[2]) for w in l.get('words') or []])
            for o in b.get('onscreen') or []:
                self.TEXTS.append(dict(beat=b['id'], text=o['text'], at=s0 + o['at'],
                                       until=(s0 + o['until']) if o.get('until') is not None else e0))
            for o in b.get('sounds') or []:
                self.SOUNDS.append(dict(beat=b['id'], name=o['name'], at=s0 + o['at']))
            prev = end
        self.FRAMES = prev
        self.LEN = prev / FPS
        self.N = prev * (SR // FPS)                      # exact samples: 2000 per frame

    # ------------------------------------------------------------------ lookups
    def has(self, bid):
        return bid in self.BEATS

    def B(self, bid, off=0.0):
        return self.BEATS[bid]['s'] + off

    def BE(self, bid):
        return self.BEATS[bid]['e']

    def Lon(self, lid, off=0.0):
        return self.LINES[lid]['on'] + off

    def Lend(self, lid, off=0.0):
        return self.LINES[lid]['end'] + off

    def W(self, lid, word, nth=1, end=False):
        k = 0
        want = word.lower()
        for w, a, b in self.LINES[lid]['words']:
            if w.lower().strip('.,?!—-…"“”\'').startswith(want):
                k += 1
                if k == nth:
                    return b if end else a
        raise KeyError((lid, word, nth))

    def snd(self, bid, name, k=0):
        hits = [x['at'] for x in self.SOUNDS if x['beat'] == bid and x['name'] == name]
        return hits[k]

    def txt(self, bid, prefix, end=False):
        for x in self.TEXTS:
            if x['beat'] == bid and x['text'].startswith(prefix):
                return x['until'] if end else x['at']
        raise KeyError((bid, prefix))

    def lines(self, t0, t1, pred=None, pad=0.0):
        return sorted((l for l in self.LINES.values()
                       if (pred is None or pred(l)) and l['on'] - pad < t1 and l['end'] + pad > t0),
                      key=lambda l: l['on'])

    def talk(self, t, pad=0.08, pred=None):
        return bool(self.lines(t, t + 1e-3, pred, pad))

    def mas_room(self, t0, t1=None, pad=0.08):
        """one of Mas's room lines (aloud, not V.O.) is sounding"""
        return bool(self.lines(t0, t1 if t1 is not None else t0 + 1e-3,
                               lambda l: l['who'] == 'mas' and not l['vo'], pad))

    def in_vo(self, t0, t1=None, pad=0.05):
        return bool(self.lines(t0, t1 if t1 is not None else t0 + 1e-3, lambda l: l['vo'], pad))

    def in_record(self, t0, t1=None, pad=0.1):
        return bool(self.lines(t0, t1 if t1 is not None else t0 + 1e-3, lambda l: l['record'], pad))

    def after_lines(self, t, latest, pred=None, pad=0.06):
        """t if no line (matching pred) is sounding there; else just after the line(s), if that is before latest"""
        hit = self.lines(t, t + 1e-3, pred, pad)
        if not hit:
            return t
        t2 = max(l['end'] for l in hit) + pad
        return t2 if t2 < latest else None

    def describe(self):
        return dict(timeline=os.path.relpath(self.path, REPO), variant=self.variant, frames=self.FRAMES,
                    seconds=round(self.LEN, 4), samples=self.N, beats=len(self.BEATS), lines=len(self.LINES))
