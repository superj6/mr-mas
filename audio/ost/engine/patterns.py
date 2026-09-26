"""Pattern generators: arpeggiator, ostinato, euclidean rhythms, piano comping, walking bass.

All positions go through the Grid (tempo ramps, meter changes and swing honoured).  Rates are in
QUARTER notes (0.5 = eighths, 1/3 = triplet eighths, 0.25 = sixteenths).  Every generator returns the
Notes it added (and adds them to the Arr) so you can post-process them.

    from engine.patterns import arp, ostinato, euclid, rhythm, comp, walking_bass

    arp(a, 'arp', 'Fm9', bars=(3, 7), rate=0.25, pattern='updown', octaves=2, low='F4', vel=0.5)
    ostinato(a, 'vc', ['F3', 'C4', 'Ab3', 'C4'], bars=(1, 9), rate=0.5, art='spic',
             follow=prog, mode='transpose')          # the cell follows the chord roots
    rhythm(a, 'lead', 'F6', bars=(9, 13), k=5, n=16, rate=0.25)      # 5-in-16 euclidean pulse
    comp(a, 'felt', prog, style='charleston', kind='rootless_a', around='C4')
    walking_bass(a, 'ubass', prog, bars=(3, 11))
"""
from __future__ import annotations

import numpy as np

from .core import nm, Note, stable_seed
from .harmony import as_chord, voice, lead, chord_at, Chord


def _add(a, inst, pitch, t, d, vel, lock=False, **x):
    n = Note(inst, float(nm(pitch)), float(t), float(d), float(vel), lock, dict(x))
    a.notes.append(n)
    return n


def _bars(g, bars):
    b0, b1 = bars
    return g.bar_q(b0), g.bar_q(b1)


def step_times(g, bars, rate, swing=None, offset_q=0.0):
    """[(t_start, t_next)] for every `rate`-quarter step in bars [b0, b1) (swung if the grid swings,
    or by `swing`)."""
    q0, q1 = _bars(g, bars)
    amt = g.swing if swing is None else swing
    out = []
    q = q0 + offset_q
    while q < q1 - 1e-9:
        ta = g.tq(g.swing_q(q, amt))
        tb = g.tq(g.swing_q(min(q + rate, q1), amt))
        out.append((ta, tb, q))
        q += rate
    return out


# ------------------------------------------------------------------ euclid
def euclid(k, n, rot=0):
    """Bjorklund: k onsets spread over n steps -> list of bools (rotated left by rot)."""
    if k <= 0:
        return [False] * n
    pat = [((i * k) // n) != (((i - 1) * k) // n) if i else True for i in range(n)]
    return pat[rot % n:] + pat[:rot % n]


def rhythm(a, inst, pitch, bars, k=3, n=8, rate=0.5, vel=0.6, gate=0.8, accent=0.12, rot=0, swing=None, **x):
    """Euclidean pulse on one pitch (or a list cycled per onset)."""
    g = a.g
    pat = euclid(k, n, rot)
    out = []
    steps = step_times(g, bars, rate, swing)
    pitches = pitch if isinstance(pitch, (list, tuple)) else [pitch]
    j = 0
    for i, (ta, tb, q) in enumerate(steps):
        if pat[i % n]:
            v = vel * (1 + accent if i % n == 0 else 1.0)
            out.append(_add(a, inst, pitches[j % len(pitches)], ta, (tb - ta) * gate, min(v, 1.0), **x))
            j += 1
    return out


# ------------------------------------------------------------------ arpeggiator
def _order(n, pattern, seed):
    if isinstance(pattern, (list, tuple)):
        return [i % n for i in pattern]
    if pattern == 'up':
        return list(range(n))
    if pattern == 'down':
        return list(range(n))[::-1]
    if pattern == 'updown':
        return list(range(n)) + list(range(n - 2, 0, -1))
    if pattern == 'downup':
        return list(range(n))[::-1] + list(range(1, n - 1))
    if pattern == 'converge':
        o = []
        lo, hi = 0, n - 1
        while lo <= hi:
            o.append(lo)
            if hi != lo:
                o.append(hi)
            lo += 1
            hi -= 1
        return o
    if pattern == 'random':
        r = np.random.default_rng(seed)
        return list(r.permutation(n))
    raise KeyError(pattern)


def arp(a, inst, chord, bars, rate=0.25, pattern='up', octaves=1, low='F4', vel=0.55, gate=0.85,
        accent=(1.0,), follow=None, kind='tones', swing=None, seed=0, **x):
    """Arpeggiate a chord (symbol, Chord or list of MIDI notes) across bars [b0, b1).
    follow: a harmony.progression -> the arp re-voices on every chord change (nearest to `low`).
    accent: velocity multipliers cycled per step (e.g. (1.0, 0.7, 0.8, 0.7))."""
    g = a.g
    out = []

    def notes_for(c):
        if isinstance(c, (list, tuple)):
            base = sorted(nm(p) for p in c)
        else:
            cc = as_chord(c)
            lo = nm(low)
            base = sorted({lo + ((cc.root + i - lo) % 12) + 12 * (i // 12) for i in cc.ivs})
        full = []
        for o in range(octaves):
            full += [p + 12 * o for p in base]
        return full

    steps = step_times(g, bars, rate, swing)
    cur_c, seq, order = None, None, None
    for i, (ta, tb, q) in enumerate(steps):
        c = chord_at(follow, ta) if follow else chord
        if c is not cur_c:
            cur_c = c
            seq = notes_for(c)
            order = _order(len(seq), pattern, stable_seed(seed, i))
            j = 0
        p = seq[order[j % len(order)]]
        j += 1
        v = vel * accent[i % len(accent)]
        out.append(_add(a, inst, p, ta, (tb - ta) * gate, float(np.clip(v, 0.02, 1.0)), **x))
    return out


# ------------------------------------------------------------------ ostinato
def ostinato(a, inst, cell, bars, rate=0.5, vel=0.6, gate=0.9, follow=None, mode='transpose', ref=None,
             accent=(1.0,), swing=None, **x):
    """Repeat a cell of pitches (None = rest, '-' = tie the previous note) on a `rate` grid.
    follow (a progression): mode 'transpose' shifts the cell by (chord root - ref root) with the
    nearest-octave move; mode 'fit' snaps each note to the nearest chord tone."""
    g = a.g
    cellm = [None if p is None else ('-' if p == '-' else nm(p)) for p in cell]
    refpc = (nm(ref) % 12) if ref is not None else next(p for p in cellm if p not in (None, '-')) % 12
    out = []
    last = None
    for i, (ta, tb, q) in enumerate(step_times(g, bars, rate, swing)):
        p = cellm[i % len(cellm)]
        if p == '-':
            if last is not None:
                last.dur = (tb - last.start) * gate
            continue
        if p is None:
            last = None
            continue
        if follow:
            c = chord_at(follow, ta)
            if mode == 'transpose':
                d = (c.root - refpc) % 12
                d = d - 12 if d > 6 else d
                p = p + d
            else:
                p = min((p + k for k in range(-6, 7) if (p + k) % 12 in c.pcs), key=lambda m: abs(m - p))
        v = vel * accent[i % len(accent)]
        last = _add(a, inst, p, ta, (tb - ta) * gate, float(np.clip(v, 0.02, 1.0)), **x)
        out.append(last)
    return out


# ------------------------------------------------------------------ piano comping
COMP = {
    # beats (1-based, fractional = off-beat, swung by the grid) and relative lengths in beats
    'whole':      [(1.0, 3.9, 1.0)],
    'halves':     [(1.0, 1.9, 1.0), (3.0, 1.9, 0.92)],
    'charleston': [(1.0, 1.2, 1.0), (2.5, 0.9, 0.88)],
    'anticipate': [(1.0, 1.4, 1.0), (4.5, 1.4, 0.9)],       # the next bar's chord pushed onto 4-and
    'twofour':    [(2.0, 0.6, 0.95), (4.0, 0.6, 0.95)],
    'freddie':    [(1.0, 0.7, 1.0), (2.0, 0.6, 0.85), (3.0, 0.7, 0.95), (4.0, 0.6, 0.85)],
    'sparse':     [(1.0, 2.8, 1.0)],
    'stabs':      [(1.5, 0.35, 0.9), (3.5, 0.35, 0.85)],
}


def comp(a, inst, prog, style='charleston', kind='rootless_a', around='C4', vel=0.5, roll=0.006, bars=None,
         smooth=True, lock=False, **x):
    """Comp through a progression [(t0, t1, Chord)] with a rhythm style (COMP) and a voicing kind
    (harmony.voice kinds).  smooth=True voice-leads each chord from the previous one."""
    g = a.g
    out = []
    prev = None
    pat = COMP[style] if isinstance(style, str) else style
    b_first = g.pos(prog[0][0])[0] if bars is None else bars[0]
    b_last = g.pos(prog[-1][1] - 1e-6)[0] + 1 if bars is None else bars[1]
    for bar in range(b_first, b_last):
        for beat, dur_b, vm in pat:
            b, bt = bar, beat
            n_beats = g.meter_of(bar)[0]
            if bt > n_beats + 0.99:
                continue
            t = g.s(b, bt)
            if style == 'anticipate' and beat > 4:
                t = g.s(b, 4.5)
            c = chord_at(prog, t + (g.beats_s(1, t) if beat > 4 else 0.0) + 1e-4)
            if c is None:
                continue
            v = lead(prev, c, kind, around=around) if (smooth and prev and kind in ('close', 'drop2', 'drop3',
                                                                                   'drop24')) else voice(c, kind, around=around)
            prev = v
            d = g.beats_s(dur_b, t)
            for i, p in enumerate(sorted(v)):
                out.append(_add(a, inst, p, t + i * roll, d, vel * vm * (0.92 if i else 1.0), lock, **x))
    return out


# ------------------------------------------------------------------ walking bass
def walking_bass(a, inst, prog, bars, low='C2', high='D3', vel=0.72, gate=0.92, approach='mixed', seed=0,
                 layer=None, layer_vel=0.55, **x):
    """Quarter-note walking line: chord root on beat 1, chord/scale tones through the bar, and a
    chromatic or scale approach into the next bar's root on beat 4.  layer='cb_pizz' doubles it with a
    real contrabass pizz (the theme's trick for wood and weight).  The default register (roots C2-B2,
    line up to D3) is the theme's: lower walks (E1-B1 roots) pile 40-60 Hz energy under a sub or 808."""
    g = a.g
    lo, hi = nm(low), nm(high)
    rng = np.random.default_rng(stable_seed('walk', seed))
    out = []
    cur = None
    for bar in range(bars[0], bars[1]):
        nb = g.meter_of(bar)[0]
        c = chord_at(prog, g.t(bar) + 1e-4)
        nxt = chord_at(prog, g.t(bar + 1) + 1e-4) or c
        root = c.bass
        target = lo + ((root - lo) % 12)
        if cur is not None and abs(target + 12 - cur) < abs(target - cur) and target + 12 <= hi:
            target += 12
        line = [target]
        tones = sorted({lo + ((c.root + i - lo) % 12) + 12 * k for i in c.ivs for k in range(3)})
        tones = [t for t in tones if lo <= t <= hi]
        p = target
        for beat in range(2, nb + 1):
            if beat == nb:
                nroot = lo + ((nxt.bass - lo) % 12)
                cands = [nroot + 12 * k for k in range(3) if lo <= nroot + 12 * k <= hi]
                nr = min(cands, key=lambda m: abs(m - p)) if cands else nroot
                mode = approach if approach != 'mixed' else ('chrom' if rng.random() < 0.6 else 'five')
                if mode == 'chrom':
                    p = nr + (1 if p > nr else -1)
                else:
                    p = nr + 7 if nr + 7 <= hi and p > nr else nr - 5
            else:
                up = [t for t in tones if 0 < t - p <= 5]
                dn = [t for t in tones if 0 < p - t <= 5]
                pool = up if (p < (lo + hi) / 2 or not dn) else dn
                if not pool:
                    pool = up or dn or [p]
                p = pool[int(rng.integers(0, len(pool)))]
            line.append(int(np.clip(p, lo, hi)))
        for i, p in enumerate(line):
            t = g.t(bar, i + 1)
            d = g.beats_s(1, t) * gate
            v = vel * (1.0 if i in (0, 2) else 0.93)
            out.append(_add(a, inst, p, t, d, v, **x))
            if layer:
                out.append(_add(a, layer, p, t, d * 0.8, layer_vel * v / vel, rel=0.18))
        cur = line[-1]
    return out


# ------------------------------------------------------------------ GLYPH's token stream (OST-BIBLE s2.5)
TOKEN_STAGES = {
    # Eps 1-3: 2-3 grains only
    'grains':    dict(pool=['F5', 'C6', 'Db6'], rest=0.82),
    # Eps 4-6: the knee's notes in the wrong order (or reversed)
    'scrambled': dict(seq=['Ab4', 'F4', 'C5', 'G4', 'F4', 'F4', 'F4', 'F4'], rest=0.4),
    'reversed':  dict(seq=['F5', 'C5', 'Ab4', 'G4', 'F4', 'F4', 'F4', 'F4'], rest=0.4),
    # Eps 7-8: one wrong token (the Ache's Db for the C), never reaching the octave
    'almost':    dict(seq=['F4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'Db5'], rest=0.3),
    # the general stream: tokens from {F G Ab C} (+Db) in F4-Db6
    'stream':    dict(pool=['F4', 'G4', 'C5', 'Db5', 'F5', 'G5', 'C6', 'Db6', 'Ab4'], rest=0.45),
}


def tokens(a, inst, bars, stage='stream', rest=None, rate=0.25, vel=0.42, seed=0, swing=0.0, gate=0.55,
           lock=True, accent=(1.0, 0.8, 0.9, 0.8), **x):
    """THE TOKEN STREAM: straight 16ths (rate 0.25), 30-60 % rests ('sampling'), 0 ms humanise (lock=True),
    no vibrato.  stage: grains | scrambled | reversed | almost | stream (TOKEN_STAGES).  Sequence stages keep
    their order through the rests (a rest replaces a token, the sequence moves on).  swing=0 until Ep10;
    from Ep10 pass the grid's swing (it has learned his).  Suggested voices: 'lead2' with duty=0.125,
    'celesta', 'glasspad', 'bell'."""
    g = a.g
    st = TOKEN_STAGES[stage]
    rp = st['rest'] if rest is None else rest
    rng = np.random.default_rng(stable_seed('tokens', seed, stage))
    out = []
    j = 0
    for i, (ta, tb, q) in enumerate(step_times(g, bars, rate, swing)):
        if 'seq' in st:
            p = st['seq'][j % len(st['seq'])]
            j += 1
        else:
            p = st['pool'][int(rng.integers(0, len(st['pool'])))]
        if rng.random() < rp:
            continue
        kw = dict(x)
        kw.setdefault('vib', 0.0)
        out.append(_add(a, inst, p, ta, (tb - ta) * gate, float(np.clip(vel * accent[i % len(accent)], 0.02, 1.0)),
                        lock, **kw))
    return out
