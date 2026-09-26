"""Chords, scales and jazz / orchestral voicings (MIDI numbers out).

    from engine.harmony import parse, voice, drop2, rootless, quartal, ust, spread, lead, scale

    parse('Dbmaj9#11')                 -> Chord(root=1, ivs=[0,4,7,11,14,18], bass=1)
    voice('Fm11', 'rootless_a', around='C4')      rootless A (3-5-7-9 family) centred near C4
    drop2('C7#9b13', top='Ab5')        4-note close voicing with Ab5 on top, 2nd voice dropped an octave
    quartal('D4', 4, scale=scale('F', 'dorian'))  diatonic 4ths stacked from D4 in F dorian
    so_what('E3')                      E A D G B (three 4ths and a 3rd)
    ust('C', 'II', low='E3')           upper-structure triad D/C7: LH tritone E-Bb, RH D F# A
    spread('Fm9', low='F1', high='C6', n=8)       orchestral open voicing (wide low, close high)
    lead(prev, 'Bbm9', kind='drop2')   the voicing of that kind nearest to prev (smooth voice leading)
    progression(g, [(1, 'Fm9'), (3, 'Dbmaj7#11'), (5, 'C7alt')])  -> [(t0, t1, Chord)]

Symbols: roots A-G with # or b; qualities '', maj, M, ^, m, min, -, dim, o, dim7, o7, m7b5, ø, aug, +,
sus, sus2, sus4, 5; extensions 6, 7, 9, 11, 13, maj7/maj9/maj11/maj13, add9, add11, 6/9 (69), alt;
alterations b5 #5 b9 #9 #11 b13 (in any order); slash bass '/F'.  No third means no third: 'F5',
'F9sus4', 'Fsus2' contain no A / Ab.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from .core import nm, pc_of, note_name

# ------------------------------------------------------------------ scales
MODES = {
    'ionian': [0, 2, 4, 5, 7, 9, 11], 'major': [0, 2, 4, 5, 7, 9, 11],
    'dorian': [0, 2, 3, 5, 7, 9, 10], 'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11], 'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'aeolian': [0, 2, 3, 5, 7, 8, 10], 'minor': [0, 2, 3, 5, 7, 8, 10], 'locrian': [0, 1, 3, 5, 6, 8, 10],
    'melodic_minor': [0, 2, 3, 5, 7, 9, 11], 'harmonic_minor': [0, 2, 3, 5, 7, 8, 11],
    'lydian_dominant': [0, 2, 4, 6, 7, 9, 10], 'altered': [0, 1, 3, 4, 6, 8, 10],
    'phrygian_dominant': [0, 1, 4, 5, 7, 8, 10], 'dorian_b2': [0, 1, 3, 5, 7, 9, 10],
    'whole_tone': [0, 2, 4, 6, 8, 10], 'dim_hw': [0, 1, 3, 4, 6, 7, 9, 10], 'dim_wh': [0, 2, 3, 5, 6, 8, 9, 11],
    'blues': [0, 3, 5, 6, 7, 10], 'pent_major': [0, 2, 4, 7, 9], 'pent_minor': [0, 3, 5, 7, 10],
    'chromatic': list(range(12)),
}


def scale(root, mode='dorian'):
    """Pitch-class set (sorted list of 0-11) of a scale/mode."""
    r = pc_of(root) if isinstance(root, str) else int(root) % 12
    return sorted({(r + i) % 12 for i in MODES[mode]})


def scale_notes(root, mode, low, high):
    pcs = set(scale(root, mode))
    return [m for m in range(nm(low), nm(high) + 1) if m % 12 in pcs]


def degree(root, mode, deg, octave=4):
    """1-based scale degree (may exceed 7) -> MIDI.  degree('F', 'dorian', 3) -> Ab4."""
    r = pc_of(root)
    ivs = MODES[mode]
    d = deg - 1
    o, i = divmod(d, len(ivs))
    return 12 * (octave + 1) + r + ivs[i] + 12 * o


# ------------------------------------------------------------------ chord symbols
@dataclass
class Chord:
    root: int            # pitch class
    ivs: list            # semitones above the root (0 first), sorted, may exceed 12 (9ths etc.)
    bass: int            # pitch class of the bass (slash chords)
    symbol: str = ''

    @property
    def pcs(self):
        return sorted({(self.root + i) % 12 for i in self.ivs})

    def has(self, iv):
        return any(i % 12 == iv % 12 for i in self.ivs)

    @property
    def third(self):
        for i in self.ivs:
            if i % 12 in (3, 4):
                return i % 12
        return None

    @property
    def seventh(self):
        for i in self.ivs:
            if i % 12 in (10, 11) or (i % 12 == 9 and 'dim7' in self.symbol.replace('o7', 'dim7')):
                return i % 12
        return None

    def tones(self, octave=3):
        base = 12 * (octave + 1) + self.root
        return [base + i for i in self.ivs]

    def name_of(self, m):
        return note_name(m)

    def __repr__(self):
        return f'Chord({self.symbol}: {[note_name(60 + self.root + i)[:-1] for i in self.ivs]})'


_ROOT = re.compile(r'^([A-Ga-g])([#b]?)')


def parse(sym: str) -> Chord:
    s0 = sym.strip()
    m = _ROOT.match(s0)
    if not m:
        raise ValueError(f'bad chord {sym!r}')
    root = pc_of(m.group(1).upper() + m.group(2))
    rest = s0[m.end():]
    bass = root
    if '/' in rest and not re.search(r'6/9', rest):
        rest, b = rest.rsplit('/', 1)
        bass = pc_of(b)
    elif re.search(r'6/9/', rest):
        rest, b = rest.rsplit('/', 1)
        bass = pc_of(b)
    r = rest.replace('(', '').replace(')', '').replace(',', '').replace(' ', '')
    r = r.replace('ø', 'm7b5').replace('Δ', 'maj').replace('^', 'maj').replace('min', 'm').replace('-', 'm')
    r = re.sub(r'^M(?=\d|$)', 'maj', r)
    ivs = set()
    third, fifth = 4, 7
    sev = None
    ext = 0
    # quality
    if r.startswith('mmaj') or r.startswith('mM'):
        third, sev = 3, 11
        r = r[4:] if r.startswith('mmaj') else r[2:]
    elif r.startswith('maj'):
        sev = 11
        r = r[3:]
        if r and r[0].isdigit() and r[0] != '7':
            pass
        elif r.startswith('7'):
            r = r[1:]
    elif r.startswith('m7b5'):
        third, fifth, sev = 3, 6, 10
        r = r[4:]
    elif r.startswith('dim7') or r.startswith('o7'):
        third, fifth, sev = 3, 6, 9
        r = r[4:] if r.startswith('dim7') else r[2:]
    elif r.startswith('dim') or r.startswith('o'):
        third, fifth = 3, 6
        r = r[3:] if r.startswith('dim') else r[1:]
    elif r.startswith('aug') or r.startswith('+'):
        fifth = 8
        r = r[3:] if r.startswith('aug') else r[1:]
    elif r.startswith('m') and not r.startswith('maj'):
        third = 3
        r = r[1:]
    elif r.startswith('5'):
        third = None
        r = r[1:]
    # numbers
    mnum = re.match(r'^(69|6|7|9|11|13)', r)
    six = False
    if mnum:
        v = mnum.group(1)
        r = r[len(v):]
        if v == '69':
            six, ext = True, 9
        elif v == '6':
            six = True
        else:
            ext = int(v)
            if sev is None:
                sev = 10
    # maj9 etc: 'maj' consumed, number follows
    if sev == 11 and ext == 0 and re.match(r'^(9|11|13)', r):
        mm = re.match(r'^(9|11|13)', r)
        ext = int(mm.group(1))
        r = r[len(mm.group(1)):]
    # sus
    if r.startswith('sus2'):
        third = 2
        r = r[4:]
    elif r.startswith('sus4') or r.startswith('sus'):
        third = 5
        r = r[4:] if r.startswith('sus4') else r[3:]
    alt = False
    if r.startswith('alt'):
        alt = True
        r = r[3:]
        if sev is None:
            sev = 10
    adds = re.findall(r'add(b9|#9|9|11|#11|13|b13)', r)
    r = re.sub(r'add(b9|#9|9|11|#11|13|b13)', '', r)
    alts = re.findall(r'(b5|#5|b9|#9|#11|b13|b6|9|11|13)', r)
    # assemble
    ivs.add(0)
    if third is not None:
        ivs.add(third)
    if fifth is not None and not alt:
        ivs.add(fifth)
    if six:
        ivs.add(9)
    if sev is not None:
        ivs.add(sev)
    if ext >= 9:
        ivs.add(14)
    if ext >= 11:
        if third == 4 and sev == 10 and ext == 11:
            ivs.discard(4)                          # 'C11' = C9sus4 (real-book practice): no 3rd
            ivs.add(17)
        elif third != 4:
            ivs.add(17)                             # m11, sus: natural 11 (maj11 omits it: use #11)
    if ext >= 13:
        ivs.add(21)
    if alt:
        ivs.update([13, 15, 20])
        ivs.discard(7)
    for a in alts + adds:
        v = {'b5': 6, '#5': 8, 'b9': 13, '#9': 15, '#11': 18, 'b13': 20, 'b6': 20, '9': 14, '11': 17, '13': 21}[a]
        if a in ('b5', '#5'):
            ivs.discard(7)
        if a in ('b9', '#9'):
            ivs.discard(14)
        if a == '#11':
            ivs.discard(17)
        if a in ('b13', 'b6'):
            ivs.discard(21)
        ivs.add(v)
    if ext >= 13 and 17 in ivs and third == 4:
        ivs.discard(17)
    low_pcs = {i % 12 for i in ivs if i < 12}
    ivs = {i for i in ivs if i < 12 or i % 12 not in low_pcs}     # 13sus: the 11 is already the sus4
    return Chord(root, sorted(ivs), bass, s0)


def as_chord(c) -> Chord:
    return c if isinstance(c, Chord) else parse(c)


# ------------------------------------------------------------------ voicing primitives
def _near(pc, target):
    """MIDI note with pitch class pc nearest to target."""
    base = target - ((target - pc) % 12)
    return base if target - base <= 6 else base + 12


def stack_close(pcs_top_down, top):
    """Close position below `top`: each next pitch class placed just below the previous note."""
    out = [top]
    for pc in pcs_top_down[1:]:
        m = out[-1] - 1
        while m % 12 != pc:
            m -= 1
        out.append(m)
    return sorted(out)


def _four(c: Chord):
    """The four most characteristic tones (pitch classes) for 4-note voicings: 3/7 + colour."""
    ivs = [i % 12 for i in c.ivs]
    t = c.third
    s = c.seventh
    colour = [i % 12 for i in c.ivs if i >= 12] + [9] * (9 in ivs)
    picks = []
    for iv in [t, s]:
        if iv is not None:
            picks.append(iv)
    for iv in colour:
        if iv not in picks:
            picks.append(iv)
    for iv in [7, 6, 8, 0]:
        if iv in ivs and iv not in picks:
            picks.append(iv)
    for iv in ivs:
        if iv not in picks:
            picks.append(iv)
    return [(c.root + i) % 12 for i in picks[:4]]


def close(chord, top=None, around='C4', n=4):
    c = as_chord(chord)
    pcs = _four(c)[:n]
    tgt = nm(top) if top is not None else nm(around) + 5
    top_pc = min(pcs, key=lambda pc: abs(_near(pc, tgt) - tgt)) if top is None else nm(top) % 12
    top_m = _near(top_pc, tgt) if top is None else nm(top)
    order = sorted(pcs, key=lambda pc: (top_pc - pc) % 12)
    return stack_close(order, top_m)


def drop2(chord, top=None, around='C4'):
    """4-note close voicing (3, 7, 9/13 colour, 5) with `top` on top, second-from-top dropped 8vb."""
    v = close(chord, top=top, around=around, n=4)
    v = sorted(v)
    v[-2] -= 12
    return sorted(v)


def drop3(chord, top=None, around='C4'):
    v = sorted(close(chord, top=top, around=around, n=4))
    v[-3] -= 12
    return sorted(v)


def drop24(chord, top=None, around='C4'):
    v = sorted(close(chord, top=top, around=around, n=4))
    v[-2] -= 12
    v[-4] -= 12
    return sorted(v)


def rootless(chord, kind='A', around='C4'):
    """Bill Evans-style rootless left hand.  A: 3-5-7-9 (or 3-13-7-9 on dominants), B: 7-9-3-5 (7-9-3-13).
    Sus / no-third chords fall back to 4-7-9-5 shapes."""
    c = as_chord(chord)
    ivs = [i % 12 for i in c.ivs]
    t = c.third if c.third is not None else 5
    s = c.seventh if c.seventh is not None else (9 if 9 in ivs else 10)
    nine = next((i % 12 for i in c.ivs if i % 12 in (1, 2, 3) and i >= 12), 2)
    dom = t == 4 and s == 10
    five = 9 if (dom and (21 in c.ivs or 9 in ivs)) else next((i for i in (7, 6, 8) if i in ivs), 7)
    if dom and 20 in c.ivs:
        five = 8
    if kind.upper() == 'A':
        order = [t, five, s, nine]
    else:
        order = [s, nine, t, five]
    pcs = [(c.root + i) % 12 for i in order]
    lo = _near(pcs[0], nm(around) - 4)
    out = [lo]
    for pc in pcs[1:]:
        m = out[-1] + 1
        while m % 12 != pc:
            m += 1
        out.append(m)
    return out


def shell(chord, kind='137', bass_octave=2):
    """Bud Powell shells: root in the bass + 3 & 7 ('137') or 7 & 3 ('173')."""
    c = as_chord(chord)
    root = 12 * (bass_octave + 1) + c.bass
    t = c.third if c.third is not None else 5
    s = c.seventh if c.seventh is not None else 9
    if kind == '137':
        return [root, root + 12 + ((c.root + t - c.bass) % 12), root + 12 + ((c.root + s - c.bass) % 12)]
    return [root, root + ((c.root + s - c.bass) % 12), root + 12 + ((c.root + t - c.bass) % 12)]


def quartal(bottom, n=4, scale=None, perfect=True):
    """Stacked fourths from `bottom`.  With scale (a pitch-class list), stacks DIATONIC fourths (a P4 or
    an A4 as the scale allows) -- the McCoy / modal-jazz sound.  Contains no third by construction."""
    b = nm(bottom)
    out = [b]
    for _ in range(n - 1):
        m = out[-1] + 5
        if scale is not None and m % 12 not in scale:
            m = out[-1] + 6 if (out[-1] + 6) % 12 in scale else out[-1] + 4
        out.append(m)
    return out


def so_what(bottom):
    """Three perfect 4ths and a major 3rd (the 'So What' chord), e.g. E3 -> E A D G B."""
    b = nm(bottom)
    return [b, b + 5, b + 10, b + 15, b + 19]


UST = {                     # triad root above the dominant root, triad quality, what it adds
    'II':   (2, 'maj', '9 #11 13'),
    'bIII': (3, 'maj', '#9 5 b7'),
    'bV':   (6, 'maj', 'b5 b7 b9'),
    'bVI':  (8, 'maj', 'b13 1 #9'),
    'VI':   (9, 'maj', '13 b9 3'),
    'III':  (4, 'maj', '3 #5 7'),
    'bVII': (10, 'maj', 'b7 9 11'),
    'bIIm': (1, 'min', 'b9 3 #5'),
}


def triad(root_pc, quality='maj', low=60):
    third = 4 if quality == 'maj' else 3
    fifth = 7 if quality in ('maj', 'min') else (6 if quality == 'dim' else 8)
    r = _near(root_pc, low + 3)
    if r < low:
        r += 12
    return [r, r + third, r + fifth]


def ust(dom_root, degree='II', low='E3', inversion=0, rh_low=None):
    """Upper-structure triad over a dominant: returns LH tritone (3 & b7) + RH triad.
    ust('C', 'II') -> [E3, Bb3] + [D4, F#4, A4]."""
    r = pc_of(dom_root) if isinstance(dom_root, str) else int(dom_root) % 12
    lo = nm(low)
    third = _near((r + 4) % 12, lo + 2)
    if third < lo:
        third += 12
    lh = [third, third + 6]
    off, q, _ = UST[degree]
    rl = rh_low if rh_low is not None else lh[-1] + 1
    tri = triad((r + off) % 12, q, nm(rl))
    for _ in range(inversion):
        tri = tri[1:] + [tri[0] + 12]
    return lh + tri


def cluster(center, n=4, step=2):
    c = nm(center)
    lo = c - (n - 1) * step // 2
    return [lo + i * step for i in range(n)]


def spread(chord, low='F1', high='C6', n=8, bass=True):
    """Orchestral open voicing: bass root, then wide intervals low (5ths, octaves), closing up high
    (harmonic-series spacing).  Uses chord tones only; colour tones go to the top half."""
    c = as_chord(chord)
    lo, hi = nm(low), nm(high)
    b = lo + ((c.bass - lo) % 12)
    out = [b] if bass else []
    core = [(c.root + i) % 12 for i in c.ivs if i < 12]
    colour = [(c.root + i) % 12 for i in c.ivs if i >= 12]
    fifth = next(((c.root + i) % 12 for i in (7, 6, 8) if c.has(i)), None)
    order = ([c.root % 12] + ([fifth] if fifth is not None else []) + [p for p in core if p not in (c.root % 12, fifth)] +
             colour)
    gaps = [12, 7, 5, 4, 4, 3, 3, 3, 2, 2, 2]
    cur = out[-1] if out else lo
    k = 0
    i = 0
    while len(out) < n and cur < hi:
        pc = order[i % len(order)]
        m = cur + max(gaps[min(k, len(gaps) - 1)] - 2, 1)
        while m % 12 != pc:
            m += 1
        if m > hi:
            break
        out.append(m)
        cur = m
        k += 1
        i += 1
    return sorted(set(out))


KINDS = {'close': close, 'drop2': drop2, 'drop3': drop3, 'drop24': drop24}


def implied_mode(chord):
    """The chord-scale a jazz player would assume: m7 dorian, m7b5 locrian, dim7 whole-half, dominant
    mixolydian (altered with b9/#9/b13, lydian dominant with #11), maj7 ionian (lydian with #11), sus
    mixolydian, m(maj7) melodic minor."""
    c = as_chord(chord)
    ivs = {i % 12 for i in c.ivs}
    t, sv = c.third, c.seventh
    if t == 3 and 6 in ivs and sv == 9:
        return 'dim_wh'
    if t == 3 and 6 in ivs:
        return 'locrian'
    if t == 3 and sv == 11:
        return 'melodic_minor'
    if t == 3:
        return 'aeolian' if 8 in ivs else 'dorian'
    if t == 4 and sv == 10:
        if ivs & {1, 3} or 8 in ivs:
            return 'altered'
        return 'lydian_dominant' if 6 in ivs else 'mixolydian'
    if t == 4:
        return 'lydian' if 6 in ivs else 'ionian'
    return 'mixolydian'


def voice(chord, kind='drop2', around='C4', top=None, **kw):
    """One entry point: kind in close, drop2, drop3, drop24, rootless_a, rootless_b, shell, shell173,
    spread, quartal (from the 3rd/7th region of the chord's scale), tones."""
    c = as_chord(chord)
    if kind in KINDS:
        return KINDS[kind](c, top=top, around=around)
    if kind == 'rootless_a':
        return rootless(c, 'A', around)
    if kind == 'rootless_b':
        return rootless(c, 'B', around)
    if kind == 'shell':
        return shell(c, '137', **kw)
    if kind == 'shell173':
        return shell(c, '173', **kw)
    if kind == 'spread':
        return spread(c, **kw)
    if kind == 'quartal':
        # diatonic 4ths in the chord's implied mode, from the 3rd (major / dominant), the 5th (minor) or the
        # root (sus / power chords): Dm11 -> A D G C, G7 -> B E A D, Cmaj7 -> E A D G, Fm9 -> C F Bb Eb
        mode = implied_mode(c)
        sc_ = scale(c.root, mode)
        t = c.third
        if t is None:                                   # sus / power chord: keep it third-free
            sc_ = [p for p in sc_ if (p - c.root) % 12 not in (3, 4)]
        start_iv = 7 if t == 3 else (t if t == 4 else 0)
        start = _near((c.root + start_iv) % 12, nm(around) - 3)
        return quartal(start, kw.get('n', 4), scale=sc_ if kw.get('diatonic', True) else None)
    if kind == 'tones':
        return c.tones(kw.get('octave', 3))
    raise KeyError(kind)


def lead(prev, chord, kind='drop2', around='C4', span=7):
    """The voicing of `kind` for `chord` whose notes move least from `prev` (smooth voice leading):
    tries every top note within +-span semitones of prev's top."""
    c = as_chord(chord)
    if not prev:
        return voice(c, kind, around=around)
    best, cost = None, 1e9
    ptop = max(prev)
    for top in range(ptop - span, ptop + span + 1):
        if kind in KINDS and top % 12 not in c.pcs:
            continue
        try:
            v = voice(c, kind, around=note_name(top - 5), top=top if kind in KINDS else None)
        except Exception:
            continue
        if len(v) != len(prev):
            k = sum(min(abs(a - b) for b in prev) for a in v)
        else:
            k = sum(abs(a - b) for a, b in zip(sorted(v), sorted(prev)))
        k += 0.3 * abs(max(v) - ptop)
        if k < cost:
            best, cost = v, k
    return best


def progression(g, changes, end=None):
    """changes: [(pos, symbol)] with pos a bar number, (bar, beat) or seconds (float with .0 -> bar!).
    Returns [(t0, t1, Chord)] in seconds; the last chord runs to `end` (default the grid end)."""
    pts = []
    for p, sym in changes:
        t = g.t(p) if isinstance(p, int) else g.at(p)
        pts.append((t, as_chord(sym)))
    pts.sort(key=lambda e: e[0])
    out = []
    for i, (t, c) in enumerate(pts):
        t1 = pts[i + 1][0] if i + 1 < len(pts) else (g.at(end) if end is not None else g.length_s)
        out.append((t, t1, c))
    return out


def chord_at(prog, t):
    for t0, t1, c in prog:
        if t0 - 1e-6 <= t < t1 - 1e-6:
            return c
    return prog[-1][2] if prog else None


def names(ms):
    return [note_name(m) for m in ms]
