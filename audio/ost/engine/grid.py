"""Grid: musical time -> seconds -> 24 fps frames.

    g = Grid(bpm=84, meter='4/4', bars=16, swing=0.6)
    g.t(5)            # seconds at bar 5, beat 1
    g.t(5, 2.5)       # the straight 'and' of beat 2
    g.s(5, 2.5)       # the same 'and', swung by g.swing
    g.f(5, 3)         # 24 fps frame (float) of bar 5 beat 3;  g.fr(...) -> nearest int frame
    g.dur('2b', at=g.t(5))   # length of two beats starting at bar 5 (tempo-ramp aware)
    g.pos(12.3)       # -> (bar, beat) at 12.3 s

Tempo map (beat-linear ramps, like a DAW):
    Grid(bpm=90, tempo=[(9, 90), (13, 112, 'ramp'), (17, 70)])
      bars 1-8 at 90, ramp 90 -> 112 across bars 9-12, 112 until bar 17, then a step to 70.
    A position may be a bar number (int/float) or (bar, beat).

Meter map:  Grid(meter='4/4', meters=[(9, '3/4'), (10, '4/4')])
Beats are counted in the meter's denominator unit (6/8 has beats 1..6); bpm is per QUARTER note unless
`beat_unit` says otherwise (beat_unit=1.5: bpm counts dotted quarters, for 6/8 or 12/8).

Swing: `swing` 0 = straight, 1 = triplet (2:1), 1.5 = hard 3:1.  swing_unit=0.5 swings eighths,
0.25 swings sixteenths.  Only .s() / swung helpers apply it; .t() is always straight.

pickup: number of meter beats BEFORE bar 1 that the file contains (bar 0 holds the pickup).
"""
from __future__ import annotations

import math
import re
from bisect import bisect_right
from fractions import Fraction

from .core import FPS, SR, SPF


def _meter(m):
    if isinstance(m, str):
        a, b = m.split('/')
        return int(a), int(b)
    return int(m[0]), int(m[1])


def frame_lock_bpm(bpm: float, beats: float, fps: int = FPS, max_change: float = 0.04) -> float:
    """The tempo nearest `bpm` at which `beats` beats last a whole number of 24 fps frames
    (so a loop of that many beats is frame- and sample-exact).  96 -> 96 for any beat count."""
    frames = beats * 60.0 / bpm * fps
    best = None
    for k in range(max(1, int(frames) - 40), int(frames) + 41):
        cand = beats * 60.0 * fps / k
        if abs(cand - bpm) / bpm <= max_change and (best is None or abs(cand - bpm) < abs(best - bpm)):
            best = cand
    return best if best is not None else bpm


class Grid:
    def __init__(self, bpm: float = 96.0, meter='4/4', bars: int | None = None, length_s: float | None = None,
                 swing: float = 0.0, swing_unit: float = 0.5, tempo=None, meters=None, beat_unit: float = 1.0,
                 pickup: float = 0.0, fps: int = FPS):
        self.bpm0 = float(bpm)
        self.swing = float(swing)
        self.swing_unit = float(swing_unit)
        self.beat_unit = float(beat_unit)
        self.fps = fps
        # ---- meter map (bar numbers are 1-based; bar 0 = pickup bar, same meter as bar 1)
        ms = [(1, _meter(meter))]
        for b, m in (meters or []):
            ms = [e for e in ms if e[0] != int(b)] + [(int(b), _meter(m))]
        ms.sort()
        if ms[0][0] != 1:
            raise ValueError('the first meter must start at bar 1')
        self._mbars = [b for b, _ in ms]
        self._meters = [m for _, m in ms]
        self._mq = [0.0]
        for i in range(1, len(ms)):
            n, d = self._meters[i - 1]
            self._mq.append(self._mq[-1] + (self._mbars[i] - self._mbars[i - 1]) * n * 4.0 / d)
        n1, d1 = self._meters[0]
        self.pickup = float(pickup)
        self.q_origin = -self.pickup * 4.0 / d1           # file time 0 lies here (quarters from bar 1)
        # ---- tempo map (quarters)
        pts = [(self.q_origin, self.bpm0, False)]
        for p in (tempo or []):
            q = self._pos_q(p[0])
            ramp = len(p) > 2 and str(p[2]).lower().startswith('ramp')
            pts = [e for e in pts if abs(e[0] - q) > 1e-9] + [(q, float(p[1]), ramp)]
        pts.sort(key=lambda e: e[0])
        if pts[0][0] > self.q_origin + 1e-9:
            pts.insert(0, (self.q_origin, self.bpm0, False))
        self._tq = [p[0] for p in pts]
        self._tb = [p[1] for p in pts]
        self._tr = [p[2] for p in pts]
        self._tT = [0.0]
        for i in range(len(pts) - 1):
            self._tT.append(self._tT[-1] + self._seg_dt(i, self._tq[i], self._tq[i + 1]))
        # ---- length
        self.bars = bars
        if length_s is not None:
            self.length_s = float(length_s)
        elif bars is not None:
            self.length_s = self.t(bars + 1)
        else:
            self.length_s = None

    # ================================================================ positions
    def meter_of(self, bar: int) -> tuple[int, int]:
        i = max(0, bisect_right(self._mbars, int(math.floor(bar))) - 1)
        return self._meters[i]

    def bar_q(self, bar: float) -> float:
        """Quarter-note position of the start of (possibly fractional) bar."""
        b = int(math.floor(bar))
        fracb = bar - b
        if b < 1:
            n, d = self._meters[0]
            q = (b - 1) * n * 4.0 / d
        else:
            i = bisect_right(self._mbars, b) - 1
            n, d = self._meters[i]
            q = self._mq[i] + (b - self._mbars[i]) * n * 4.0 / d
        if fracb:
            n, d = self.meter_of(b)
            q += fracb * n * 4.0 / d
        return q

    def bar_len_q(self, bar: int) -> float:
        n, d = self.meter_of(bar)
        return n * 4.0 / d

    def beat_q(self, bar: int) -> float:
        """Length of one meter beat (the denominator unit) in quarters."""
        return 4.0 / self.meter_of(bar)[1]

    def q(self, bar: float, beat: float = 1.0) -> float:
        return self.bar_q(bar) + (beat - 1.0) * self.beat_q(int(math.floor(bar)))

    def _pos_q(self, p) -> float:
        if isinstance(p, (tuple, list)):
            return self.q(p[0], p[1] if len(p) > 1 else 1.0)
        return self.bar_q(p)

    # ================================================================ tempo
    def _seg_dt(self, i, qa, qb):
        """Seconds between quarter positions qa <= qb inside tempo segment i."""
        b0 = self._tb[i]
        u = self.beat_unit
        if i + 1 < len(self._tq) and self._tr[i + 1]:
            q0, q1, b1 = self._tq[i], self._tq[i + 1], self._tb[i + 1]
            k = (b1 - b0) / (q1 - q0)
            if abs(k) > 1e-12:
                ba = b0 + k * (qa - q0)
                bb = b0 + k * (qb - q0)
                return 60.0 / (u * k) * math.log(bb / ba)
            return 60.0 * (qb - qa) / (u * b0)
        return 60.0 * (qb - qa) / (u * b0)

    def bpm_at_q(self, q: float) -> float:
        i = max(0, bisect_right(self._tq, q) - 1)
        if i + 1 < len(self._tq) and self._tr[i + 1]:
            q0, q1 = self._tq[i], self._tq[i + 1]
            return self._tb[i] + (self._tb[i + 1] - self._tb[i]) * (q - q0) / (q1 - q0)
        return self._tb[i]

    def bpm_at(self, sec: float) -> float:
        return self.bpm_at_q(self.qt(sec))

    def tq(self, q: float) -> float:
        """Quarter position -> seconds from file start."""
        if q < self._tq[0]:
            return -(self._tq[0] - q) * 60.0 / (self.beat_unit * self._tb[0])
        i = bisect_right(self._tq, q) - 1
        return self._tT[i] + self._seg_dt(i, self._tq[i], q)

    def qt(self, sec: float) -> float:
        """Seconds -> quarter position (inverse of tq)."""
        u = self.beat_unit
        if sec < 0:
            return self._tq[0] + sec * u * self._tb[0] / 60.0
        i = bisect_right(self._tT, sec) - 1
        dt = sec - self._tT[i]
        b0 = self._tb[i]
        if i + 1 < len(self._tq) and self._tr[i + 1]:
            q0, q1, b1 = self._tq[i], self._tq[i + 1], self._tb[i + 1]
            k = (b1 - b0) / (q1 - q0)
            if abs(k) > 1e-12:
                return q0 + b0 * (math.exp(dt * u * k / 60.0) - 1.0) / k
        return self._tq[i] + dt * u * b0 / 60.0

    # ================================================================ swing
    def swing_q(self, q: float, amount: float | None = None, unit: float | None = None) -> float:
        """Warp a quarter position so off-beats of `unit` (0.5 = eighths) land swung."""
        amt = self.swing if amount is None else amount
        if not amt:
            return q
        unit = self.swing_unit if unit is None else unit
        cell = 2.0 * unit
        # cells are counted from the start of the bar that contains q (odd meters stay aligned)
        bar = self.bar_at_q(q)
        base = self.bar_q(bar)
        rel = q - base
        k = math.floor(rel / cell + 1e-9)
        f = rel / cell - k
        sp = 0.5 + amt / 6.0
        w = f * (sp / 0.5) if f < 0.5 else sp + (f - 0.5) * (1.0 - sp) / 0.5
        return base + (k + w) * cell

    def bar_at_q(self, q: float) -> int:
        if q < 0:
            n, d = self._meters[0]
            return int(math.floor(q / (n * 4.0 / d))) + 1
        i = bisect_right(self._mq, q) - 1
        n, d = self._meters[i]
        return self._mbars[i] + int(math.floor((q - self._mq[i]) / (n * 4.0 / d) + 1e-9))

    # ================================================================ user-facing
    def t(self, bar: float, beat: float = 1.0, off: float = 0.0) -> float:
        """Seconds at bar/beat (straight).  off: extra seconds."""
        return self.tq(self.q(bar, beat)) + off

    def s(self, bar: float, beat: float = 1.0, amount: float | None = None, off: float = 0.0) -> float:
        """Seconds at bar/beat with swing applied (beat 2.5 = the swung 'and' of 2)."""
        return self.tq(self.swing_q(self.q(bar, beat), amount)) + off

    def eighth(self, bar: int, beat: int, second: bool, amount: float | None = None) -> float:
        """The theme engine's helper: seconds of an eighth note, swung by `amount` (default g.swing)."""
        return self.s(bar, beat + (0.5 if second else 0.0), amount)

    def f(self, bar: float, beat: float = 1.0, swung: bool = False) -> float:
        """24 fps frame (float) at bar/beat."""
        return (self.s(bar, beat) if swung else self.t(bar, beat)) * self.fps

    def fr(self, bar: float, beat: float = 1.0, swung: bool = False) -> int:
        """Nearest whole 24 fps frame at bar/beat."""
        return int(round(self.f(bar, beat, swung)))

    def frame_s(self, frame: float) -> float:
        return frame / self.fps

    def pos(self, sec: float) -> tuple[int, float]:
        """Seconds -> (bar, beat) (beat 1-based, fractional)."""
        q = self.qt(sec)
        bar = self.bar_at_q(q)
        return bar, 1.0 + (q - self.bar_q(bar)) / self.beat_q(bar)

    def label(self, sec: float) -> str:
        b, bt = self.pos(sec)
        return f'{b}:{bt:.3g}'

    def at(self, p) -> float:
        """Position -> seconds.  float/int = seconds; (bar,) or (bar, beat) tuple = musical (straight);
        (bar, beat, 'sw') = swung; 'f123' = 24 fps frame 123."""
        if isinstance(p, (tuple, list)):
            if len(p) > 2 and p[2]:
                return self.s(p[0], p[1])
            return self.t(p[0], p[1] if len(p) > 1 else 1.0)
        if isinstance(p, str):
            p = p.strip()
            if p.startswith('f'):
                return float(p[1:]) / self.fps
            m = re.fullmatch(r'(-?\d+(?:\.\d+)?):(\d+(?:\.\d+)?)(~?)', p)
            if m:
                return (self.s if m.group(3) else self.t)(float(m.group(1)), float(m.group(2)))
            raise ValueError(f'bad position {p!r}')
        return float(p)

    def dur(self, d, at=0.0) -> float:
        """Duration -> seconds, measured from `at` (so tempo ramps are honoured).
        float = seconds.  Strings: '2b' meter beats, '1.5q' quarters, '2bar' bars, '12f' frames,
        '0.5s' seconds, '1/8' whole-note fractions ('1/8d' dotted, '1/8t' triplet)."""
        if not isinstance(d, str):
            return float(d)
        t0 = self.at(at)
        d = d.strip()
        m = re.fullmatch(r'(\d+(?:\.\d+)?)\s*(bars?|b|q|f|s)', d)
        if m:
            v, u = float(m.group(1)), m.group(2)
            if u == 's':
                return v
            if u == 'f':
                return v / self.fps
            q0 = self.qt(t0)
            if u == 'q':
                return self.tq(q0 + v) - t0
            bar = self.bar_at_q(q0)
            if u == 'b':
                return self.tq(q0 + v * self.beat_q(bar)) - t0
            # bars: walk bar by bar (meters may change)
            q, left, b = q0, v, bar
            while left > 1e-9:
                step = min(1.0, left)
                q += step * self.bar_len_q(b)
                left -= step
                b += 1
            return self.tq(q) - t0
        m = re.fullmatch(r'(\d+)/(\d+)([dt]?)', d)
        if m:
            qn = 4.0 * float(Fraction(int(m.group(1)), int(m.group(2))))
            qn *= 1.5 if m.group(3) == 'd' else (2.0 / 3.0 if m.group(3) == 't' else 1.0)
            q0 = self.qt(t0)
            return self.tq(q0 + qn) - t0
        raise ValueError(f'bad duration {d!r}')

    def beats_s(self, beats: float, at=0.0) -> float:
        """Seconds of `beats` meter beats starting at `at`."""
        return self.dur(f'{beats}b', at)

    def bar_s(self, bar: int) -> float:
        return self.t(bar + 1) - self.t(bar)

    def span(self, bar0: float, bar1: float) -> tuple[float, float]:
        """(start_s, end_s) of bars [bar0, bar1) -- e.g. a loop region."""
        return self.t(bar0), self.t(bar1)

    def steps(self, bar0: float, bar1: float, step_q: float, swung: bool = False, amount=None):
        """Seconds of every `step_q`-quarter grid point in bars [bar0, bar1) (tempo/meter aware)."""
        q0, q1 = self.bar_q(bar0), self.bar_q(bar1)
        out = []
        q = q0
        while q < q1 - 1e-9:
            out.append(self.tq(self.swing_q(q, amount) if swung else q))
            q += step_q
        return out

    def bar_starts(self, bar0: int = 1, bar1: int | None = None) -> list[float]:
        bar1 = bar1 if bar1 is not None else (self.bars or 1) + 1
        return [self.t(b) for b in range(bar0, bar1)]

    @property
    def end_s(self) -> float:
        return self.length_s

    @property
    def n_samples(self) -> int:
        return int(round(self.length_s * SR))

    @property
    def n_frames(self) -> float:
        return self.length_s * self.fps

    def is_frame_aligned(self, sec: float, tol_samples: int = 1) -> bool:
        n = sec * SR
        return abs(n - SPF * round(n / SPF)) <= tol_samples

    def describe(self) -> dict:
        tmap = []
        for i, (q, b, r) in enumerate(zip(self._tq, self._tb, self._tr)):
            bar = self.bar_at_q(q)
            beat = 1.0 + (q - self.bar_q(bar)) / self.beat_q(bar)
            tmap.append(dict(bar=bar, beat=round(beat, 4), bpm=round(b, 4), ramp_in=bool(r),
                             sec=round(self.tq(q), 6), frame=round(self.tq(q) * self.fps, 3)))
        mmap = [dict(bar=b, meter=f'{n}/{d}', sec=round(self.t(b), 6), frame=round(self.t(b) * self.fps, 3))
                for b, (n, d) in zip(self._mbars, self._meters)]
        return dict(bpm=self.bpm0, beat_unit_quarters=self.beat_unit, tempo_map=tmap, meter_map=mmap,
                    swing=self.swing, swing_unit_quarters=self.swing_unit, pickup_beats=self.pickup,
                    bars=self.bars, length_s=None if self.length_s is None else round(self.length_s, 6),
                    length_frames=None if self.length_s is None else round(self.length_s * self.fps, 3),
                    fps=self.fps)
