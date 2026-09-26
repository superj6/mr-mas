"""Writing notes: Arr (the composer's builder) and palette() (every playable instrument as a Track,
routed to one of the ten stem families).

    g = Grid(bpm=84, bars=16, swing=0.6)
    a = Arr(g)
    a.n('felt', 'F4', (1, 1), '1b', 0.5)               # inst, pitch, position, duration, velocity
    a.ch('felt', ['Ab3', 'C4', 'Eb4'], (1, 2.5, 'sw'), '1/8', 0.4)   # swung 'and' of 2
    a.line('lead', 'F5/8 F5/8 F5/8 F5/8 G5/8 Ab5/8 C6/8 F6/8', (5, 1), vel=0.55, swing=True)
    a.mark('door slam', (9, 1))                        # a sync point for the cue sheet
    a.section('A', 1, 9)
    tracks = palette()

Positions: seconds (float), (bar, beat) tuples, (bar, beat, 'sw') swung, 'f123' frames, '5:2.5' strings.
Durations: seconds or grid strings ('2b' beats, '1.5q' quarters, '1bar', '12f' frames, '1/8', '1/4d').
"""
from __future__ import annotations

import re

import numpy as np

from .core import (Note, nm, SR, db, lp, hp, peq, shelf, to_stereo, midi_hz, stable_seed, FAMILIES)
from .render import Track
from . import chip, synth, texture
from .sampler import SALAMANDER, UPRIGHT_KW, GU, load_wav, trim_lead, resolve


# ====================================================================== Arr
class Arr:
    def __init__(self, grid):
        self.g = grid
        self.notes: list[Note] = []
        self.markers: list = []
        self.sections: list = []

    # ---- positions
    def t(self, pos) -> float:
        return self.g.at(pos)

    def d(self, dur, at=0.0) -> float:
        return self.g.dur(dur, at)

    # ---- notes
    def n(self, inst, pitch, at, dur, vel=0.7, lock=False, **x) -> Note:
        t = self.g.at(at)
        note = Note(inst, float(nm(pitch)), float(t), float(self.g.dur(dur, t)), float(vel), lock, x)
        self.notes.append(note)
        return note

    def ch(self, inst, pitches, at, dur, vel=0.7, lock=False, roll=0.0, **x):
        """Chord; roll = seconds between successive notes (low to high)."""
        t = self.g.at(at)
        d = self.g.dur(dur, t)
        return [self.n(inst, p, t + i * roll, d, vel, lock, **x) for i, p in enumerate(sorted(nm(q) for q in pitches))]

    def seq(self, inst, items, vel=0.6, lock=False, **x):
        """items: [(pitch, at, dur[, vel])] (pitch None = rest)."""
        out = []
        for it in items:
            if it[0] is None:
                continue
            out.append(self.n(inst, it[0], it[1], it[2], it[3] if len(it) > 3 else vel, lock, **x))
        return out

    _TOK = re.compile(r'^(r|[A-Ga-g][#b]?-?\d)(?:/(\d+)(\.?)(t?))?(\^?)$')

    def line(self, inst, text, at, vel=0.6, swing=False, gate=0.95, lock=False, transpose=0, **x):
        """Tiny melody DSL: 'F5/8 F5/8 G5/4. r/8 C6/2' -- pitch or r(est), /denominator (4 = quarter),
        '.' dotted, 't' triplet, '^' accent (+15 %).  swing=True swings eighth off-beats by the grid's
        swing; a number swings by that amount (1.0 = the house +10 frames at 96 BPM).  '|' is ignored."""
        g = self.g
        q = g.qt(g.at(at))
        out = []
        amt = None if swing is True else (float(swing) if swing else 0.0)
        text = text.replace('|', ' ')
        for tok in text.split():
            m = self._TOK.match(tok)
            if not m:
                raise ValueError(f'line(): bad token {tok!r}')
            p, den, dot, trip, acc = m.groups()
            ql = 4.0 / int(den or 4)
            ql *= 1.5 if dot else 1.0
            ql *= 2.0 / 3.0 if trip else 1.0
            if p != 'r':
                ta = g.tq(g.swing_q(q, amt) if swing else q)
                tb = g.tq(g.swing_q(q + ql, amt) if swing else q + ql)
                v = min(1.0, vel * (1.15 if acc else 1.0))
                out.append(self.n(inst, nm(p) + transpose, ta, (tb - ta) * gate, v, lock, **x))
            q += ql
        return out

    # ---- structure
    def mark(self, label, at):
        self.markers.append((self.g.at(at), label))

    def section(self, label, bar0, bar1):
        self.sections.append((label, self.g.t(bar0), self.g.t(bar1)))

    # ---- editing
    def select(self, insts=None, t0=None, t1=None):
        return [n for n in self.notes if (not insts or n.inst in insts) and (t0 is None or n.start >= t0 - 1e-9)
                and (t1 is None or n.start < t1 - 1e-9)]

    def copy_bars(self, src, dst, insts=None, transpose=0):
        """Copy notes in bars [src0, src1) so they start at bar dst (mapped through quarter positions, so
        tempo ramps / meter changes between the two places are honoured)."""
        g = self.g
        q0, q1, qd = g.bar_q(src[0]), g.bar_q(src[1]), g.bar_q(dst)
        out = []
        for n in self.select(insts, g.tq(q0), g.tq(q1)):
            qs = g.qt(n.start)
            qe = g.qt(n.start + n.dur)
            ns = g.tq(qs - q0 + qd)
            ne = g.tq(qe - q0 + qd)
            m = n.copy(start=ns, dur=ne - ns, pitch=n.pitch + transpose)
            self.notes.append(m)
            out.append(m)
        return out

    def transpose(self, semis, insts=None, t0=None, t1=None):
        for n in self.select(insts, t0, t1):
            n.pitch += semis

    def scale_vel(self, k, insts=None, t0=None, t1=None):
        for n in self.select(insts, t0, t1):
            n.vel = float(np.clip(n.vel * k, 0.02, 1.0))

    def remove(self, insts=None, t0=None, t1=None):
        kill = set(map(id, self.select(insts, t0, t1)))
        self.notes = [n for n in self.notes if id(n) not in kill]


# ====================================================================== track sources (seconds)
def _chip_level(vel):
    return db(-22 * (1 - vel)) * 0.5


def chip_fn(kind):
    """kind: pulse | tri | beeper | noise.  x: duty, duty_to, max_hz, tilt, vib, vib_delay, slide, bend,
    att, dec, sus, rel, steps, rate, clock, short, hp, gain."""
    def f(n: Note, rng):
        x = n.x
        gate = n.dur
        rel = x.get('rel', 0.05)
        dur = gate + rel + 0.01
        if kind == 'pulse':
            y = chip.pulse(n.pitch, dur, duty=x.get('duty', 0.25), max_hz=x.get('max_hz', 9000),
                           duty_to=x.get('duty_to'), tilt=x.get('tilt', -1.5), vib_cents=x.get('vib', 0.0),
                           vib_delay=x.get('vib_delay', 0.16), slide_from=x.get('slide'), bend=x.get('bend'))
        elif kind == 'tri':
            y = chip.triangle(n.pitch, dur, vib_cents=x.get('vib', 0.0), slide_from=x.get('slide'),
                              bend=x.get('bend')) * 1.3
        elif kind == 'beeper':
            y = chip.beeper(n.pitch, dur, bend=x.get('bend'), slide_from=x.get('slide')) * 0.8
        elif kind == 'noise':
            y = chip.noise_hit(dur, clock_hz=x.get('clock', 22000.0), short=x.get('short', False),
                               seed=int(rng.integers(1, 9999)))
            y = hp(y, x.get('hp', 5000), 2)
        else:
            raise ValueError(kind)
        env = chip.stepped_env(len(y), att=x.get('att', 0.002), dec=x.get('dec', 0.18), sus=x.get('sus', 0.55),
                               rel=rel, gate_s=gate, steps=x.get('steps', 15), rate=x.get('rate', 60.0))
        return to_stereo(y * env * _chip_level(n.vel) * db(x.get('gain', 0.0)))
    return f


def chipkick_fn(n: Note, rng):
    """Chip kick: a triangle that drops an octave in 40 ms, stepped envelope."""
    d = min(n.dur, 0.25) + 0.05
    y = chip.triangle(n.pitch + 12, d, bend=[(0.0, 0.0), (0.04, -12.0)]) * 1.4
    env = chip.stepped_env(len(y), att=0.001, dec=0.06, sus=0.0, rel=0.03, gate_s=d - 0.05, steps=15, rate=60.0)
    return to_stereo(y * env * _chip_level(n.vel))


def sub_fn(n: Note, rng):
    x = n.x
    return synth.sub808(n.pitch, n.dur + x.get('rel', 0.3), punch_semi=x.get('punch', 9.0),
                        decay_s=x.get('decay', 0.8), drive=x.get('drive', 1.5), click=x.get('click', 0.08),
                        glide_to=x.get('glide_to'), glide_s=x.get('glide_s')) * db(-24 * (1 - n.vel)) * 0.5


def k808_fn(n: Note, rng):
    x = n.x
    return synth.kick808(n.pitch, decay_s=x.get('decay', 0.45), punch_semi=x.get('punch', 14.0),
                         drive=x.get('drive', 2.0), click=x.get('click', 0.35),
                         seed=int(rng.integers(0, 1 << 30))) * db(-20 * (1 - n.vel)) * 0.5


def h808_fn(n: Note, rng):
    x = n.x
    return synth.hat808(open_=x.get('open', False), level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)),
                        decay_s=x.get('decay'), tone=x.get('tone', 1.0))


def clap808_fn(n: Note, rng):
    return synth.clap808(level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)))


def sn808_fn(n: Note, rng):
    return synth.snare808(level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)),
                          tone_hz=n.x.get('tone', 185.0), snappy=n.x.get('snappy', 0.7))


def rim808_fn(n: Note, rng):
    return synth.rim808(level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)))


def drone_fn(n: Note, rng):
    x = n.x
    ps = x.get('pitches', [n.pitch])
    return synth.drone([nm(p) for p in ps], n.dur, fade_in=x.get('fade_in', 1.0), fade_out=x.get('fade_out', 0.5)) * \
        db(-24 * (1 - n.vel)) * 0.5


def pad_fn(n: Note, rng):
    x = n.x
    ps = [nm(p) for p in x.get('pitches', [n.pitch])]
    return synth.pad(ps, n.dur, kind=x.get('kind', 'warm'), attack=x.get('attack', 1.2), release=x.get('release', 1.5),
                     bright=x.get('bright', 1.0), detune_cents=x.get('detune_c', 7.0), voices=x.get('voices', 3),
                     seed=int(rng.integers(0, 1 << 30)), level=db(-24 * (1 - n.vel)))


def swish_fn(n: Note, rng):
    return synth.brush_sweep(n.dur, level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)),
                             circles=n.x.get('circles', 1.0))


def mech_fn(n: Note, rng):
    return synth.felt_mech(level=db(-12 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)))


_REV = {}


def revswell_fn(n: Note, rng):
    """Reverse cymbal: the first `dur` of a real VSCO 2 CE crash, reversed, swelling into the downbeat."""
    if 'crash' not in _REV:
        _REV['crash'] = trim_lead(load_wav(resolve('vsco2ce/Percussion/cymbal-crash1_mf_rr1.wav')))
    y = _REV['crash']
    L = int(n.dur * SR)
    seg = y[:, :L][:, ::-1].copy()
    if seg.shape[1] < L:
        seg = np.pad(seg, ((0, 0), (L - seg.shape[1], 0)))
    k = min(int(0.05 * SR), L)
    seg[:, :k] *= np.linspace(0, 1, k)[None]
    seg = lp(seg, n.x.get('hi', 9000), 2)
    return (seg * db(-20 * (1 - n.vel)) * 0.5).astype(np.float32)


def shimmer_fn(n: Note, rng):
    return synth.shimmer([nm(p) for p in n.x['pitches']], n.dur, density=n.x.get('density', 16),
                         level=db(-18 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)))


def bell_fn(n: Note, rng):
    return synth.bell(n.pitch, n.x.get('len', 1.2), level=db(-18 * (1 - n.vel)), bright=n.x.get('bright', 1.0))


def room_fn(n: Note, rng):
    return to_stereo(synth.room_tone(n.dur, level_db=n.x.get('db', -60)))


def impact_fn(n: Note, rng):
    x = n.x
    return synth.impact(level=db(-20 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)), pitch=n.pitch,
                        tail_s=x.get('tail', 3.5), noise=x.get('noise', 0.6), sub=x.get('sub', 1.0),
                        bright=x.get('bright', 4000.0))


def riser_fn(n: Note, rng):
    x = n.x
    return synth.noise_riser(n.dur, level=db(-20 * (1 - n.vel)), seed=int(rng.integers(0, 1 << 30)),
                             f0=x.get('f0', 400.0), f1=x.get('f1', 9000.0), curve=x.get('curve', 2.2))


_LFSR = {}


def _lfsr_seq(short=False):
    if short not in _LFSR:
        reg, tap, out = 1, (6 if short else 1), np.empty(32767, dtype=np.float32)
        for i in range(32767):
            b = (reg & 1) ^ ((reg >> tap) & 1)
            reg = (reg >> 1) | (b << 14)
            out[i] = 1.0 if (reg & 1) else -1.0
        _LFSR[short] = out
    return _LFSR[short]


def noise_sweep_fn(n: Note, rng):
    """Chip noise riser: one continuous LFSR voice whose clock steps up at the 60 Hz driver rate (no
    retriggered attacks).  x: c0/c1 clock Hz, l0 start level, hp, short."""
    x = n.x
    dur = n.dur
    L = int(dur * SR)
    t = np.arange(L) / SR
    tick = np.floor(t * 60.0) / 60.0
    u = np.clip(tick / max(dur, 1e-3), 0, 1)
    clk = x.get('c0', 3000.0) * (x.get('c1', 28000.0) / x.get('c0', 3000.0)) ** u
    ph = np.cumsum(clk / SR)
    seq = _lfsr_seq(x.get('short', False))
    y = seq[(ph.astype(np.int64) + int(rng.integers(0, 30000))) % len(seq)]
    y = hp(y, x.get('hp', 1500), 2)
    y = lp(y, 14000, 2)
    lev = x.get('l0', 0.15) + (1 - x.get('l0', 0.15)) * u ** 1.6
    lev = np.round(lev * 15) / 15
    k = int(0.004 * SR)
    lev = np.convolve(lev, np.ones(k) / k, mode='same')
    return to_stereo((y * lev * _chip_level(n.vel) * 0.6).astype(np.float32))


def clip_fn(n: Note, rng):
    """Play a whole sample file.  x: file ('vsco2ce/...' or 'sfx:...'), align='start'|'peak', shift
    (semitones), env [(sec, gain)], tail (s).  align='peak' puts the file's loudest point at start+dur
    (for swells, rolls, risers)."""
    from fractions import Fraction
    from scipy import signal as sig
    x = n.x
    y = trim_lead(load_wav(resolve(x['file'])))
    if x.get('shift'):
        f = Fraction(2 ** (-x['shift'] / 12)).limit_denominator(1200)
        y = sig.resample_poly(y, f.numerator, f.denominator, axis=1).astype(np.float32)
    dur = n.dur
    tail = x.get('tail', 1.5)
    if x.get('align') == 'peak':
        m = np.abs(y).max(0)
        k = int(0.05 * SR)
        e = np.convolve(m, np.ones(k) / k, mode='same')
        pk = int(np.argmax(e[: int(8 * SR)]))
        a0 = max(0, pk - int(dur * SR))
        y = y[:, a0:pk + int(tail * SR)]
        if pk - a0 < int(dur * SR):
            y = np.pad(y, ((0, 0), (int(dur * SR) - (pk - a0), 0)))
    else:
        y = y[:, :int((dur + tail) * SR)]
    y = y.copy()
    if x.get('env'):
        ts = [p[0] * SR for p in x['env']]
        y *= np.interp(np.arange(y.shape[1]), ts, [p[1] for p in x['env']]).astype(np.float32)[None]
    k = min(int(0.02 * SR), y.shape[1])
    y[:, -k:] *= np.linspace(1, 0, k)[None]
    return y * db(-20 * (1 - n.vel)) * db(x.get('gain', 0.0))


def glyph_fn(n: Note, rng):
    """The 'glyph' track: texture.glyph unless note.x['kind'] says otherwise."""
    if 'kind' not in n.x:
        n = n.copy()
        n.x['kind'] = 'glyph'
    return texture.tex_fn(n, rng)


# ====================================================================== inserts
def felt_post(buf):
    buf = hp(buf, 45, 2)
    buf = lp(buf, 3200, 2)
    buf = peq(buf, 220, 2.0, 0.8)
    return shelf(buf, 5000, -4, True)


def felt_post_bright(buf):
    buf = hp(buf, 45, 2)
    buf = lp(buf, 5200, 2)
    buf = peq(buf, 220, 1.5, 0.8)
    buf = peq(buf, 2500, 1.5, 0.9)
    return shelf(buf, 7000, -2, True)


def snes_post(store=16000, echo_ms=144, fb=0.32, mix=0.22):
    """The 16-bit sample-chip treatment (2008-14 tier): low storage rate, BRR grit, FIR-ish echo."""
    def f(buf):
        return chip.sample_chip(buf, store_rate=store, brr=True, echo_ms=echo_ms, echo_fb=fb, echo_mix=mix)
    return f


def cup_mute(buf):
    buf = hp(buf, 220, 2)
    buf = lp(buf, 2600, 2)
    return peq(buf, 1000, 3.0, 1.1)


def air(db_air=1.5, db_pres=0.0, hp_hz=None):
    def f(buf):
        if hp_hz:
            buf = hp(buf, hp_hz, 2)
        if db_pres:
            buf = peq(buf, 3200, db_pres, 0.7)
        return shelf(buf, 9000, db_air, True)
    return f


def tape_peak(ratio=0.8, then=None):
    """Soft saturation relative to the stem's own peak (about 3 dB off the transients)."""
    def f(buf):
        if then:
            buf = then(buf)
        pk = float(np.abs(buf).max()) + 1e-9
        T = pk * ratio
        return (T * np.tanh(buf / T)).astype(np.float32)
    return f


# ====================================================================== the palette
# OST-BIBLE s0 / s6.9 item 11: these belong to in-world (diegetic) source music only -- an arena PA, a phone,
# a TV -- played through an in-world speaker (era.futz).  The build warns if a cue uses them without
# META['diegetic'] = True.  k808 / sub stay available for LEVERAGE's pitched sub-thud.
DIEGETIC_ONLY = {'kit808', 'clap808', 'gong', 'h808', 'sn808', 'rim808'}

# balance groups (the theme's stemtable method, OST-BIBLE s3): piano / orch / bigband / chip, rhythm and fx
# excluded.  Default by stem family; these tracks override it ("glass and tokens count as chip").
BALANCE_GROUP = {'glasspad': 'chip', 'shimmer': 'chip', 'bell': 'chip', 'glyph': 'chip', 'celesta': 'orch'}
FAMILY_GROUP = {'piano': 'piano', 'strings': 'orch', 'winds': 'orch', 'perc': 'orch', 'brass': 'bigband',
                'chip': 'chip', 'bass': 'rhythm', 'drums': 'rhythm', 'synth': 'fx', 'fx': 'fx'}


def balance_group(tr):
    return getattr(tr, 'balance', None) or BALANCE_GROUP.get(tr.name) or FAMILY_GROUP.get(tr.stem, 'fx')


CREDIT_SAL = 'Salamander Grand Piano by Alexander Holm (CC BY 3.0) -- ATTRIBUTION REQUIRED'
CREDIT_KW = 'Upright Piano KW by FreePats (CC0 1.0)'
CREDIT_GU = 'GeneralUser GS by S. Christian Collins'
CREDIT_VS = 'VSCO 2 CE by Versilian Studios (CC0 1.0)'
CREDIT_VC = 'VCSL by Versilian Studios (CC0 1.0)'
CREDIT_SYN = 'engine synthesis (no samples)'


def palette(only=None):
    """Every instrument as a Track (fresh objects: tweak gain/pan/sends per cue).  Unused tracks cost
    nothing.  Articulated sections (vln1, vln2, vla, vc, cb, svln, tpt, hn, tbn, tuba, cl, fl, tsax,
    vibes) switch sample sets per note with note.x['art'] (see library.ART)."""
    T = {}

    def add(name, src, stem, credit='', **kw):
        assert stem in FAMILIES, stem
        T[name] = Track(name=name, src=src, stem=stem, credit=credit, **kw)

    # ---------------- piano
    add('felt', ('sf2', UPRIGHT_KW, 0, 0, False), 'piano', CREDIT_KW, gain_db=-1, pan=-0.05, width=0.8,
        sends={'room': -14, 'hall': -17}, hum_ms=3, post=felt_post, latency_ms=5)
    add('felt_mech', ('fn', mech_fn), 'piano', CREDIT_SYN, gain_db=-6, pan=-0.05, hum_ms=3)
    add('upright', ('sf2', UPRIGHT_KW, 0, 0, False), 'piano', CREDIT_KW, gain_db=-2, pan=-0.05, width=0.85,
        sends={'room': -12, 'hall': -18}, hum_ms=4, eq=[('hp', 40), ('hs', 8000, -2)], latency_ms=5)
    add('grand', ('sf2', SALAMANDER, 0, 0, False), 'piano', CREDIT_SAL, gain_db=-2, width=0.9,
        sends={'hall': -12, 'room': -16}, hum_ms=3, eq=[('hs', 7000, -2)], latency_ms=14)
    add('rhodes', ('sf2', GU, 0, 4, False), 'piano', CREDIT_GU, gain_db=-4, pan=0.1, width=0.8,
        sends={'room': -12, 'plate': -16}, hum_ms=4, eq=[('hp', 50), ('lp', 7000)])
    # ---------------- strings (keyswitched sections, stage seating: vln L, vla/vc R, cb far R)
    for nm_, inst, pan in [('vln1', 'vln', -0.45), ('vln2', 'vln', -0.2), ('vla', 'vla', 0.2), ('vc', 'vc', 0.4),
                           ('cb', 'cb', 0.55)]:
        add(nm_, ('art', inst), 'strings', CREDIT_VS, pan=pan, width=0.7, sends={'hall': -9, 'room': -18}, hum_ms=8,
            rel=0.35)
    add('svln', ('art', 'svln'), 'strings', CREDIT_VS, pan=-0.25, width=0.5, sends={'hall': -8}, hum_ms=8, rel=0.4)
    add('harp', ('ss', 'harp'), 'strings', CREDIT_VS, pan=-0.3, width=0.8, sends={'hall': -10}, hum_ms=4, rel=1.5)
    # theme-compatible single-articulation string tracks
    for nm_, st, pan in [('vln_trem', 'vln_trem', -0.35), ('vla_trem', 'vla_trem', 0.15), ('vc_trem', 'vc_trem', 0.35)]:
        add(nm_, ('ss', st), 'strings', CREDIT_VS, pan=pan, width=0.7, sends={'hall': -9}, hum_ms=8, rel=0.3)
    for nm_, st, pan in [('vln_pizz', 'vln_pizz', -0.4), ('vla_pizz', 'vla_pizz', 0.15), ('vc_pizz', 'vc_pizz', 0.35),
                         ('vln_spic', 'vln_spic', -0.4), ('vla_spic', 'vla_spic', 0.1), ('vc_spic', 'vc_spic', 0.35),
                         ('cb_spic', 'cb_spic', 0.5)]:
        add(nm_, ('ss', st), 'strings', CREDIT_VS, pan=pan, width=0.6, sends={'hall': -10, 'room': -16}, hum_ms=3,
            rel=0.2, latency_ms=6 if 'pizz' in st else 0)
    # ---------------- winds (orchestral woodwinds + the harmonium; the saxes are big band -> 'brass')
    add('fl', ('art', 'fl'), 'winds', CREDIT_VS, pan=-0.2, width=0.4, sends={'hall': -8}, hum_ms=8, rel=0.35)
    add('cl', ('art', 'cl'), 'winds', CREDIT_VS, pan=-0.1, width=0.4, sends={'hall': -8, 'room': -14}, hum_ms=8, rel=0.35)
    add('bsn', ('ss', 'bsn'), 'winds', CREDIT_VS, pan=0.1, sends={'hall': -9}, hum_ms=8, rel=0.3)
    add('tsax', ('art', 'tsax'), 'brass', CREDIT_VC, pan=0.2, width=0.4, sends={'hall': -9, 'room': -10}, hum_ms=8,
        rel=0.3)
    add('tsax_stac', ('ss', 'tsax_stac'), 'brass', CREDIT_VC, pan=0.3, sends={'hall': -13, 'room': -10}, hum_ms=5, rel=0.1)
    add('asax', ('sf2', GU, 0, 65, False), 'brass', CREDIT_GU, pan=0.35, gain_db=-4, sends={'room': -10, 'hall': -14},
        hum_ms=5)
    add('bsax', ('sf2', GU, 0, 67, False), 'brass', CREDIT_GU, pan=0.2, gain_db=-4, sends={'room': -10, 'hall': -14},
        hum_ms=5)
    add('reed', ('sf2', GU, 0, 20, False), 'winds', CREDIT_GU, gain_db=-4, pan=-0.2, width=0.7,
        sends={'hall': -9, 'room': -12}, hum_ms=0, eq=[('hp', 70), ('lp', 5200), ('peq', 1800, -2.0, 0.8)])
    # ---------------- brass = the big-band horns (trumpets, trombones, horns, tuba AND the saxes; accents,
    #                  not the engine).  The saxes sit here so the stem and the balance count them as big band.
    add('tpt', ('art', 'tpt'), 'brass', CREDIT_VS, pan=0.2, width=0.8, sends={'hall': -9, 'room': -10}, hum_ms=6, rel=0.3)
    add('hn', ('art', 'hn'), 'brass', CREDIT_VS, pan=-0.3, width=0.7, sends={'hall': -7}, hum_ms=8, rel=0.5)
    add('tbn', ('art', 'tbn'), 'brass', CREDIT_VS, pan=-0.15, width=0.7, sends={'hall': -9, 'room': -10}, hum_ms=6,
        rel=0.4)
    add('tuba', ('art', 'tuba'), 'brass', CREDIT_VS, pan=0.1, sends={'hall': -10}, hum_ms=6, rel=0.4)
    add('harmon', ('ss', 'tpt_harmon'), 'brass', CREDIT_VS, pan=0.15, width=0.4, sends={'hall': -6, 'room': -12},
        hum_ms=0, rel=0.35, latency_ms=10)
    for nm_, st, pan in [('tpt_stac', 'tpt_stac', 0.1), ('tbn_stac', 'tbn_stac', -0.15), ('tuba_stac', 'tuba_stac', 0.0),
                         ('hn_stac', 'hn_stac', -0.3)]:
        add(nm_, ('ss', st), 'brass', CREDIT_VS, pan=pan, width=0.8, sends={'hall': -12, 'room': -10}, hum_ms=5,
            rel=0.12)
    # ---------------- bass
    add('ubass', ('sf2', GU, 0, 32, False), 'bass', CREDIT_GU, gain_db=2, pan=0.05, width=0.3,
        sends={'room': -12, 'hall': -20}, hum_ms=3, offset_ms=-4,
        eq=[('hp', 38), ('peq', 90, 2.0, 0.9), ('peq', 700, 1.5, 1.2)])
    add('cb_pizz', ('ss', 'cb_pizz'), 'bass', CREDIT_VS, gain_db=-5, pan=0.05, width=0.3,
        sends={'room': -12, 'hall': -16}, hum_ms=3, offset_ms=-4, rel=0.25, eq=[('hp', 35), ('lp', 2500)])
    add('sub', ('fn', sub_fn), 'bass', CREDIT_SYN, hum_ms=0)
    # ---------------- drums
    add('brush', ('sf2', GU, 128, 40, True), 'drums', CREDIT_GU, gain_db=14, pan=0.05, width=0.8,
        sends={'room': -9, 'hall': -18}, hum_ms=3)
    add('jazz', ('sf2', GU, 128, 32, True), 'drums', CREDIT_GU, gain_db=9, width=0.9, sends={'room': -10, 'hall': -18},
        hum_ms=3)
    add('kit808', ('sf2', GU, 128, 25, True), 'drums', CREDIT_GU, gain_db=6, width=0.9, sends={'room': -16}, hum_ms=0)
    add('swish', ('fn', swish_fn), 'drums', CREDIT_SYN, gain_db=10, sends={'room': -10}, hum_ms=0)
    add('k808', ('fn', k808_fn), 'drums', CREDIT_SYN, gain_db=0, hum_ms=0)
    add('h808', ('fn', h808_fn), 'drums', CREDIT_SYN, gain_db=-2, pan=0.2, sends={'room': -18}, hum_ms=1)
    add('clap808', ('fn', clap808_fn), 'drums', CREDIT_SYN, gain_db=-3, sends={'room': -12, 'plate': -16}, hum_ms=1)
    add('sn808', ('fn', sn808_fn), 'drums', CREDIT_SYN, gain_db=-3, sends={'room': -12}, hum_ms=1)
    add('rim808', ('fn', rim808_fn), 'drums', CREDIT_SYN, gain_db=-4, pan=-0.15, sends={'room': -14}, hum_ms=1)
    add('snare', ('ss', 'snare'), 'drums', CREDIT_VS, pan=0.05, sends={'room': -8, 'hall': -14}, hum_ms=3, rel=0.4)
    add('hat', ('ss', 'hat'), 'drums', CREDIT_VC, pan=0.3, sends={'room': -14}, hum_ms=4, rel=0.2)
    # ---------------- orchestral percussion, mallets, small percussion
    add('timp', ('ss', 'timp'), 'perc', CREDIT_VS, pan=-0.1, sends={'hall': -6}, hum_ms=0, rel=1.2)
    add('bdrum', ('ss', 'bdrum'), 'perc', CREDIT_VS, sends={'hall': -8}, hum_ms=0, rel=1.5)
    add('crash', ('ss', 'crash'), 'perc', CREDIT_VS, pan=0.2, width=0.9, sends={'hall': -9}, hum_ms=0, rel=2.5)
    add('suscym', ('ss', 'suscym'), 'perc', CREDIT_VS, pan=0.25, sends={'hall': -9}, hum_ms=0, rel=2.5)
    add('cym_swell', ('ss', 'cym_swell'), 'perc', CREDIT_VC, pan=0.1, width=0.9, sends={'hall': -10}, hum_ms=0, rel=0.05)
    add('gong', ('ss', 'gong'), 'perc', CREDIT_VS, sends={'hall': -8}, hum_ms=0, rel=4.0)
    add('snare_taps', ('ss', 'snare_taps'), 'perc', CREDIT_VS, pan=0.05, sends={'hall': -10, 'room': -10}, hum_ms=2)
    add('glock', ('ss', 'glock'), 'perc', CREDIT_VS, pan=0.3, sends={'hall': -8}, hum_ms=3, rel=1.5)
    add('celesta', ('sf2', GU, 0, 8, False), 'perc', CREDIT_GU, gain_db=-2, pan=0.25, sends={'hall': -7}, hum_ms=4)
    add('vibes', ('art', 'vibes'), 'perc', CREDIT_VC, pan=0.25, width=0.8, sends={'hall': -9, 'room': -12}, hum_ms=5,
        rel=1.4)
    add('marimba', ('ss', 'marimba'), 'perc', CREDIT_VS, pan=-0.2, width=0.8, sends={'room': -12, 'hall': -12}, hum_ms=4,
        rel=0.8)
    add('xylo', ('ss', 'xylo'), 'perc', CREDIT_VS, pan=0.25, sends={'hall': -10}, hum_ms=3, rel=0.5)
    add('chimes', ('ss', 'chimes'), 'perc', CREDIT_VC, pan=0.2, sends={'hall': -7}, hum_ms=0, rel=2.0)
    add('bell', ('fn', bell_fn), 'perc', CREDIT_SYN, pan=0.1, sends={'hall': -10}, hum_ms=0)
    for nm_ in ('claves', 'woodclick', 'cabasa', 'rimshot', 'bdrum_muted'):
        add(nm_, ('ss', nm_), 'perc', CREDIT_VS, pan=0.1, sends={'room': -12}, hum_ms=2, rel=0.3)
    add('clip_perc', ('fn', clip_fn), 'perc', CREDIT_VS, sends={'hall': -9}, hum_ms=0)
    # ---------------- chip (the show's identity)
    add('lead', ('fn', chip_fn('pulse')), 'chip', CREDIT_SYN, pan=0.08, sends={'room': -12, 'snes': -14}, hum_ms=0)
    add('lead2', ('fn', chip_fn('pulse')), 'chip', CREDIT_SYN, gain_db=-3, pan=-0.25, sends={'room': -12, 'snes': -14},
        hum_ms=0)
    add('arp', ('fn', chip_fn('pulse')), 'chip', CREDIT_SYN, gain_db=-6, pan=0.3, sends={'snes': -10}, hum_ms=0)
    add('tri', ('fn', chip_fn('tri')), 'chip', CREDIT_SYN, hum_ms=0)
    add('noise', ('fn', chip_fn('noise')), 'chip', CREDIT_SYN, gain_db=-6, pan=0.15, sends={'room': -14}, hum_ms=0)
    add('beeper', ('fn', chip_fn('beeper')), 'chip', CREDIT_SYN, gain_db=-2, sends={'room': -16}, hum_ms=0)
    add('sqbass', ('fn', chip_fn('pulse')), 'chip', CREDIT_SYN, gain_db=-2, hum_ms=0)
    add('chipkick', ('fn', chipkick_fn), 'chip', CREDIT_SYN, gain_db=0, hum_ms=0)
    add('noisesweep', ('fn', noise_sweep_fn), 'chip', CREDIT_SYN, gain_db=-4, sends={'room': -14}, hum_ms=0)
    add('snes_piano', ('sf2', UPRIGHT_KW, 0, 0, False), 'chip', CREDIT_KW, gain_db=-1, pan=-0.1, hum_ms=3,
        post=snes_post(16000, 144, 0.3, 0.2))
    add('snes_vibes', ('ss', 'vibes'), 'chip', CREDIT_VC, gain_db=-2, pan=0.2, hum_ms=3, post=snes_post(16000, 144, 0.3, 0.25))
    add('snes_brass', ('ss', 'tpt_stac'), 'chip', CREDIT_VS, pan=0.1, hum_ms=3, post=snes_post(12000, 144, 0.25, 0.18))
    add('snes_tbn', ('ss', 'tbn_stac'), 'chip', CREDIT_VS, pan=-0.1, hum_ms=3, post=snes_post(12000, 144, 0.25, 0.18))
    add('snes_bass', ('sf2', GU, 0, 32, False), 'chip', CREDIT_GU, gain_db=2, hum_ms=3, post=snes_post(16000, 0))
    add('snes_kit', ('sf2', GU, 128, 40, True), 'chip', CREDIT_GU, gain_db=1, hum_ms=3, post=snes_post(16000, 0))
    add('snes_str', ('ss', 'vla'), 'chip', CREDIT_VS, gain_db=-3, width=0.8, hum_ms=6, rel=0.3,
        post=snes_post(16000, 144, 0.35, 0.3))
    add('snes_pizz', ('ss', 'vln_pizz'), 'chip', CREDIT_VS, pan=-0.15, hum_ms=0, post=snes_post(16000, 144, 0.3, 0.22))
    add('snes_harp', ('ss', 'harp'), 'chip', CREDIT_VS, gain_db=-1, pan=0.2, hum_ms=0, post=snes_post(16000, 144, 0.3, 0.25))
    add('snes_cup', ('ss', 'tpt_stac'), 'chip', CREDIT_VS, gain_db=1, pan=0.12, hum_ms=0,
        post=lambda b: snes_post(12000, 144, 0.25, 0.18)(cup_mute(b)))
    # ---------------- synth / pad / texture
    add('drone', ('fn', drone_fn), 'synth', CREDIT_SYN, gain_db=-10, hum_ms=0)
    add('pad', ('fn', pad_fn), 'synth', CREDIT_SYN, gain_db=-4, width=1.0, sends={'hall': -10}, hum_ms=0)
    add('gupad', ('sf2', GU, 0, 89, False), 'synth', CREDIT_GU, gain_db=-6, sends={'hall': -12}, hum_ms=0,
        eq=[('hp', 80), ('lp', 6000)])
    add('glasspad', ('sf2', GU, 0, 92, False), 'synth', CREDIT_GU, gain_db=-8, sends={'hall': -10}, hum_ms=0,
        eq=[('hp', 150)])
    add('tex', ('fn', texture.tex_fn), 'synth', CREDIT_SYN, sends={'hall': -12}, hum_ms=0)
    # ---------------- fx
    add('glyph', ('fn', glyph_fn), 'fx', CREDIT_SYN, sends={'room': -14, 'hall': -18}, hum_ms=0)
    add('revswell', ('fn', revswell_fn), 'fx', CREDIT_VS, sends={'hall': -8}, hum_ms=0)
    add('shimmer', ('fn', shimmer_fn), 'fx', CREDIT_SYN, sends={'hall': -4}, hum_ms=0)
    add('riser', ('fn', riser_fn), 'fx', CREDIT_SYN, sends={'hall': -12}, hum_ms=0)
    add('impact', ('fn', impact_fn), 'fx', CREDIT_SYN, sends={'hall': -10}, hum_ms=0)
    add('room', ('fn', room_fn), 'fx', CREDIT_SYN, hum_ms=0)
    add('clip_fx', ('fn', clip_fn), 'fx', CREDIT_VS, sends={'hall': -10}, hum_ms=0)
    if only:
        return {k: v for k, v in T.items() if k in only}
    return T
