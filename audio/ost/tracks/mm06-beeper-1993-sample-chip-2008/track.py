"""MM-06 "Beeper, 1993 / Sample-Chip, 2008"  (composer C; OST-BIBLE s5.C2, palette P10 ERA TIERS)
A library suite for every 1993 part (Eps 1, 4, 7, 12, NESNEJ's included), the 2005-14 flashbacks (the 2008
keynote, the 2012 sale, TIDDER 2014) and the render-front transitions.  96 BPM so cuts to and from the present
stay on the grid.  His past, not a video game: the chip's MEMORY job (s1.9).

MOVEMENT I · 1993 (1-BIT)  b1-16, straight, the beeper only: TWO voices (a line + root blips), on/off with no
dynamics, mono, dry.  The kid pokes the machine; the machine doesn't swing yet.
  b1-4    the flat line in uneven registers (F4 F5 F4 F3, four Fs per bar, a new rhythm each bar) while the
          root channel walks the title's card roots F - Db - Bb - C underneath (octave-hopping blips, 3+3+2:
          never one pitch at an even rate).                                                     LOOP 1-4
  b5-8    the knee's cells, never whole: the flat line, then the kink G Ab C LEFT HANGING (b6), again an
          octave up (b8).  The kid hasn't finished yet.
  b9-12   Fm9 arpeggios in 16ths (F Ab C Eb G, up-down) over roots F - Db - Bb - C: one hand-shape, four
          harmonies (Fm9, Dbmaj9#11, Bbm13, the Fm/C cadential colour).                          LOOP 9-12
  b13-16  NESNEJ, 1993: the Upsell on the beeper, straight (three cells, each a step higher), the close
          C5 G4 F4 -- and b17.1 is THE EMPTY SLOT: every stem rests, the SFX register "clunks with no bell".

MOVEMENT II · 2005-14 (EARLY-WEB16)  b17-32, SWUNG: the band through the 16-bit sample-chip (BRR grit,
Gaussian interpolation, 144 ms echo), exactly like the main title's 2008 bar: felt piano, upright, brushes, a
lo-fi cup-muted trumpet stab, a chip lead.  A-flat-major colours (the early web's optimism), never F major.
  b17     the band boots in on beat 2 (the slot is b17.1).  Every downbeat of this movement is ANTICIPATED on
          the and-of-4 of the bar before (a jazz push), so in the loop the push from b24 fills b17.1, while in
          the suite b17.1 stays the empty slot.
  b18-24  YOUNG MAS: the Water Line with the nudge twice, a little cocky (Abmaj9 - Dbmaj9); the chip doubles
          the nudges an octave up; a chip answer on the knee's cells (F F F G Ab C -- then Bb: never the
          knee whole); one lo-fi trumpet stab (b21.4&); the line again with the chip an octave up; a clean
          string swell leaks in at b24 (the present, foreshadowing the render front).           LOOP 17-24
  b25-32  THE DIAL-UP ERA: Gerg's Build compiles in 16-bit (4, 8, 12, 16 sixteenths: the napkin that becomes
          a website), straight 16ths over the swung band; the felt joins at b29 (Mas is with him), the ride
          comes in, a trumpet push into b29; the Build's tag "shipped" (C5 F5) ends it on b32.3 over an open
          fifth.                                                                                LOOP 25-32 (push)
RENDER FRONT  b33-34  one chord, Fm(add9) F2 C3 Ab3 C4 G4, rendered 1-bit (b33.1) -> 16-bit (b33.3) -> BASE
          (b34.1, clean felt + strings + upright), 2 beats each, under the SFX render_front_sweep (F4 -> F6).
          The backwards version (BASE -> 16-bit -> 1-bit, "downgrading...") is a part.

Run:  ../../../.venv-theme/bin/python track.py [--no-stems --no-loop] [--no-parts]
"""
import os
import sys
from dataclasses import replace as _rep

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
sys.path.insert(0, HERE)
from engine import *   # noqa: E402,F401,F403
from engine.core import lp as _lp   # noqa: E402
import numpy as np   # noqa: E402

TID = 'mm06-beeper-1993-sample-chip-2008'

META = dict(
    id=TID,
    mm='MM-06',
    title='Beeper, 1993 / Sample-Chip, 2008',
    family='P10 ERA TIERS (T1 1-BIT, T2 EARLY-WEB16) + the render front',
    tone='his past as the machine heard it: a 1-bit kid poking a beeper, then a 16-bit jazz trio remembering '
         'the early web -- a memory, not a video game',
    usage='BI',
    tags=['era tiers', 'flashback', '1993', '1-bit', '2008', '16-bit', 'sample-chip', 'library', 'render front'],
    scenes=['Ep1 sc 3-4 F1.1 (1993, 0:30)', 'Ep4 1993 part 2 (NESNEJ: the empty slot)', 'Ep7 1993 part 3',
            'Ep12 1993 part 4 (see MM-36)', 'Eps 2-3 2005-14 flashbacks (2008 keynote, 2012 sale, TIDDER 2014)',
            'render-front transitions (any episode)'],
    motifs=['the flat line in uneven registers (b1-5, b7)', 'KINK left hanging (b6, b8)', 'UPSELL + close, 1-bit '
            '(b13-16) and the empty slot (b17.1)', 'WATER_LINE young: the nudge twice (b18-19, b22-23)',
            'BUILD compiling 4/8/12/16 (b25-28), full (b28-31), tag (b32.3)', 'render front: Fm(add9) 3 tiers'],
    motif_ids=['KINK', 'UPSELL', 'BUILD'],
    key='F minor (1-bit); A-flat-major colours Abmaj9 - Dbmaj9 - Fm9 - Eb9sus4 (16-bit); Fm(add9) (render front)',
    composer='OST composer C (fix 1: composer A)',
    version='1.1 (fix 1, 2026-09-26)',
    description='Fix 1 (2026-09-26): rule 4 -- bar 7 opens on a re-struck C5 (was F5), so the knee never completes '
                'by pitch class (b5-7 and b7-9 did); re-rendered on the fixed engine (meter, pizz tuning, render '
                'hang); parts render with the engine workers again.',
    audition=[],
)

S1 = dict(att=0.001, dec=0.3, sus=1.0, rel=0.006, steps=0)      # 1-bit: on or off, no dynamics


# ---------------------------------------------------------------------------------------------- tracks
def tracks():
    T = palette()
    for k in ('beeper',):
        T[k].hum_ms = 0
    T['bline'] = _rep(T['beeper'], name='bline', gain_db=3.0, pan=0.0, width=0.0, sends={}, hum_ms=0, vel_jit=0.0,
                      eq=[('hs', 3000, -3.0), ('lp', 9000)])
    T['broot'] = _rep(T['beeper'], name='broot', gain_db=0.0, pan=0.0, width=0.0, sends={}, hum_ms=0, vel_jit=0.0,
                      eq=[('hs', 3000, -3.0), ('lp', 9000)])

    def m16(src, name, store=16000, echo=144, fb=0.3, mix=0.2, gain=0.0, pre=None, pan=None):
        """The clean track rendered through the 16-bit sample-chip (the chip stem): the 2008-14 tier."""
        tr = T[src]
        p0 = pre or tr.post
        sn = snes_post(store, echo, fb, mix)
        post = (lambda b, p0=p0, sn=sn: sn(p0(b))) if p0 else sn
        T[name] = _rep(tr, name=name, stem='chip', post=post, sends={}, gain_db=tr.gain_db + gain, balance='chip',
                       pan=tr.pan if pan is None else pan)
    m16('felt', 'm16_felt', 16000, 144, 0.3, 0.2, gain=1.0)
    m16('ubass', 'm16_bass', 16000, 0, gain=0.0)
    m16('brush', 'm16_brush', 16000, 0, gain=-3.0)
    m16('jazz', 'm16_jazz', 16000, 0, gain=-3.0)
    m16('swish', 'm16_swish', 16000, 0, gain=-4.0)
    m16('tpt', 'm16_tpt', 12000, 144, 0.25, 0.18, gain=0.0, pre=cup_mute, pan=0.2)
    m16('lead', 'm16_lead', 16000, 144, 0.28, 0.18, gain=1.5)
    m16('lead2', 'm16_build', 16000, 0, gain=7.0, pan=0.12)
    m16('vln_pizz', 'm16_pizz', 16000, 144, 0.25, 0.15, gain=-2.0)
    m16('vla', 'm16_str', 16000, 144, 0.3, 0.25, gain=-4.0)
    for k in ('vln2', 'vla', 'vc'):                 # the clean string swell (the present leaking in)
        T[k].sends = {'hall': -10}
    T['build'] = _rep(T['lead2'], name='build', hum_ms=0)     # clean aliases (the BASE-blend part renders them)
    T['pizz'] = _rep(T['vln_pizz'], name='pizz')
    T['strpad'] = _rep(T['vla'], name='strpad')
    return T


# the 16-bit tier is written on the clean instruments, then mapped (the clean set is also the BASE-blend part)
TO16 = {'felt': 'm16_felt', 'ubass': 'm16_bass', 'brush': 'm16_brush', 'jazz': 'm16_jazz', 'swish': 'm16_swish',
        'tpt': 'm16_tpt', 'lead': 'm16_lead', 'build': 'm16_build', 'pizz': 'm16_pizz', 'strpad': 'm16_str'}


# ---------------------------------------------------------------------------------------------- 1-bit helpers
def bl(a, text, bar, vel=0.6):
    """The 1-bit line channel (straight, fixed level)."""
    return a.line('bline', text.replace('^', ''), (bar, 1), vel=vel, swing=False, gate=0.82, lock=True, **S1)


BLIPS = [(0, 'lo'), (2, 'hi'), (4, 'lo'), (5, 'fi'), (7, 'hi')]           # 3+3+2 feel, octave-hopping


def br(a, bar, root, vel=0.55, pat=None):
    """The 1-bit root channel: short blips on the root (lo/hi octave) and its fifth."""
    r = nm(root)
    for i, k in (pat or BLIPS):
        p = {'lo': r, 'hi': r + 12, 'fi': r + 7}[k]
        a.n('broot', p, (bar, 1 + 0.5 * i), '1/16', vel, lock=True, **S1)


ARP = ['F4', 'Ab4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5', 'Ab4']


# ---------------------------------------------------------------------------------------------- 16-bit helpers
PROG2 = [(17, 'Abmaj9'), (19, 'Dbmaj9'), (20, 'Fm9'), (21, 'Eb9sus4'), (22, 'Abmaj9'), (23, 'Dbmaj9'),
         (24, 'Eb9sus4'), (25, 'Abmaj9'), (26, 'Dbmaj9'), (27, 'Fm9'), (28, 'Eb9sus4'), (29, 'Abmaj9'),
         (30, 'Dbmaj9'), (31, 'Fm9'), (32, 'Eb9sus4')]


def push(a, bar, vel=1.0, trumpet=False):
    """The anticipation on the and-of-4 of `bar` (swung), tied over into the next downbeat (Abmaj9)."""
    at = (bar, 4.5, 'sw')
    a.ch('felt', voice('Abmaj9', 'rootless_a', around='Ab3'), at, '1.4b', 0.46 * vel, _push=True)
    a.n('ubass', 'Ab2', at, '1.4b', 0.7 * vel, _push=True)
    a.n('jazz', 36, at, 0.2, 0.42 * vel, _push=True)                      # kick on the push
    a.n('brush', 38, at, 0.2, 0.62 * vel, _push=True)                     # tap accent
    a.n('swish', 60, at, '1.4b', 0.35 * vel, circles=0.6, _push=True)
    if trumpet:
        art.stab(a, 'tpt', ['Eb5', 'C5'], at, vel=0.52 * vel, length=0.2, lock=False, _push=True)


def band_bar(a, bar, ride=False, first=True, kick=True):
    """One bar of the brushes trio (swung).  first=False leaves beat 1 empty (the slot / an anticipated
    downbeat)."""
    b0 = 1 if first else 2
    a.n('swish', 60, (bar, b0), f'{5 - b0}b', 0.5, circles=1.0)
    for bt in (2, 4):
        a.n('brush', 38, (bar, bt), 0.2, 0.5)
        a.n('jazz', 44, (bar, bt), 0.15, 0.4)                             # foot hat on 2 and 4
    if kick:
        for bt in ((1, 3) if first else (3,)):
            a.n('jazz', 36, (bar, bt), 0.2, 0.3)
    if ride:
        for bt, sw in ((1, False), (2, False), (2.5, True), (3, False), (4, False), (4.5, True)):
            if bt < b0:
                continue
            a.n('jazz', 51, (bar, bt, 'sw') if sw else (bar, bt), 0.3, 0.42 if not sw else 0.3)


def build_pass(a, bar, n, vel=0.5):
    """Gerg's Build (s2.6): the first n sixteenths of the cell, straight (machine), 25 % pulse, F4-Eb5."""
    toks = MOTIFS['BUILD']['line'].split()[:n]
    a.line('build', ' '.join(toks), (bar, 1), vel=vel, swing=False, gate=0.7, lock=True, duty=0.25, rel=0.02,
           dec=0.09, sus=0.45)
    for i in range(0, n, 4):                                             # pizzicato doubles each group's first note
        a.n('pizz', toks[i].split('/')[0], (bar, 1 + i * 0.25), 0.2, 0.34, lock=True)


def render_front(a, bar, order=('1', '16', 'base'), vel=1.0):
    """One chord, Fm(add9), rendered tier by tier, 2 beats each."""
    ch = ['F2', 'C3', 'Ab3', 'C4', 'G4']
    for i, tier in enumerate(order):
        at = a.g.tq(a.g.bar_q(bar) + 2 * i)
        last = i == len(order) - 1
        d2 = a.g.beats_s(2, at)
        if tier == '1':
            a.n('broot', 'F2', at, d2 * 0.97, 0.55, lock=True, **S1)
            for k in range(16):                                           # 32nd-note arpeggio: a 1-bit chord
                p = ['Ab3', 'C4', 'G4', 'C4'][k % 4]
                a.n('bline', p, at + k * d2 / 16, d2 / 16 * 0.9, 0.6, lock=True, **S1)
        elif tier == '16':
            a.ch('felt', ch, at, d2 * (2.2 if last else 1.02), 0.5 * vel, lock=True)
            a.ch('strpad', ['F3', 'C4', 'Ab3'], at, d2 * (2.2 if last else 1.02), 0.4 * vel, lock=True)
            a.n('ubass', 'F2', at, d2 * (2.2 if last else 1.02), 0.6 * vel, lock=True)
        else:                                                             # BASE: the present, clean
            ring = d2 * (2.4 if last else 1.02)
            a.ch('felt_base', ch, at, ring, 0.46 * vel, lock=True)
            for inst, ps in (('vc', ['F2', 'C3']), ('vla', ['Ab3', 'C4']), ('vln2', ['G4'])):
                art.sus(a, inst, ps, at, ring, vel=0.3 * vel, lock=True, lp=2200,
                        env=[(0, 0.7), (0.25, 1.0), (ring, 1.0)])
            a.n('ubass_base', 'F2', at, ring, 0.6 * vel, lock=True)


# ---------------------------------------------------------------------------------------------- the suite
LOOP_M2 = (17, 25)


def movement_two(a, g, ending='stop'):
    """b17-32 on the CLEAN instrument names (mapped to the 16-bit tier by build()).  ending: 'stop' (the tag,
    then silence for the render front) | 'push' (the dial-up loop's anticipation back into b25)."""
    # ---- b17-24 YOUNG MAS
    comp(a, 'felt', progression(g, PROG2, end=g.t(33)), style='charleston', kind='rootless_a', around='Ab3',
         vel=0.32, bars=(17, 25))                                            # under the melody (F4-G4)
    walking_bass(a, 'ubass', progression(g, PROG2, end=g.t(33)), bars=(17, 33), seed=6, vel=0.66)
    band_bar(a, 17, first=False, kick=False)
    for b in range(18, 25):
        band_bar(a, b)
    a.line('felt', 'F4/4 F4/4 G4/8 F4/8 G4/8 F4/8 | C4/4 F4/2.', (18, 1), vel=0.58, swing=True)   # the nudge twice
    a.line('lead', 'r/2 G5/8 r/8 G5/8', (18, 1), vel=0.5, swing=True, duty=0.5, rel=0.05, sus=0.5)   # nudge doubles
    a.line('lead', 'F5/8 F5/8 r/8 F5/8 r/8 G5/8 Ab5/8 C6/8 | r/4 Bb5/4. Ab5/8 G5/4', (20, 1), vel=0.46, swing=True,
           duty=0.5, rel=0.06, sus=0.55, vib=8, vib_delay=0.25)              # the answer: F F F G Ab C .. Bb (never the knee)
    art.stab(a, 'tpt', ['Eb5', 'C5'], (21, 4.5, 'sw'), vel=0.5, length=0.2, lock=False)   # the one lo-fi stab
    a.line('felt', 'F4/4 F4/4 G4/8 F4/8 G4/8 F4/8 | C4/4 F4/2.', (22, 1), vel=0.58, swing=True)
    a.line('lead', 'F5/4 F5/4 G5/8 F5/8 G5/8 F5/8 | C5/4 F5/2.', (22, 1), vel=0.42, swing=True, duty=0.5, rel=0.06,
           sus=0.55)                                                          # the chip doubles the line 8va
    a.line('lead', 'r/2 G5/8 F5/8 G5/8 F5/8', (24, 1), vel=0.4, swing=True, duty=0.5, rel=0.05)   # the nudge twice more
    for inst, ps in (('vc', ['Eb3']), ('vla', ['Bb3', 'Db4']), ('vln2', ['F4', 'Ab4'])):
        art.swell(a, inst, ps, (24, 1), g.at((24, 4.5, 'sw')) - g.at((24, 1)) + 0.05, 'pp', 'p', shape='exp',
                  rel=0.25)                                                  # the clean swell (the present leaks in)
    push(a, 24)
    # ---- b25-32 THE DIAL-UP ERA
    for b in range(25, 33):
        band_bar(a, b, ride=b >= 29, first=(b not in (25, 29)) or ending == 'never')
    for b, n in ((25, 4), (26, 8), (27, 12), (28, 16), (29, 16), (30, 16), (31, 16)):
        build_pass(a, b, n, vel=0.72)
    for b, ch in ((25, 'Abmaj9'), (26, 'Dbmaj9'), (27, 'Fm9'), (28, 'Eb9sus4')):   # the napkin: a soft 16-bit pad
        a.ch('strpad', voice(ch, 'rootless_a', around='C4') if 'sus' not in ch else ['Db4', 'F4', 'Bb4'],
             (b, 1 if b != 25 else 1.5), '3.6b' if b != 25 else '3.1b', 0.24, lock=True)
    comp(a, 'felt', progression(g, PROG2, end=g.t(33)), style='charleston', kind='rootless_a', around='Ab3',
         vel=0.26, bars=(29, 33))                                            # the felt joins: Mas is with him
    push(a, 28, trumpet=True)                                                # the website goes live
    for inst, ps in (('vla', ['C4']), ('vln2', ['Eb4', 'G4'])):
        art.swell(a, inst, ps, (31, 3), g.at((32, 3)) - g.at((31, 3)), 'pp', 'p', shape='exp', rel=0.3)
    if ending == 'stop':
        # the tag "shipped": C5 F5 (straight, staccato) with the band's last two hits; an open fifth, no third
        K = dict(_keep=True)
        a.line('build', 'C5/8 F5/8', (32, 3), vel=0.55, swing=False, gate=0.5, lock=True, duty=0.25, rel=0.03, **K)
        a.n('ubass', 'C2', (32, 3), 0.25, 0.7, **K)
        a.n('ubass', 'F2', (32, 3.5), 0.5, 0.72, **K)
        a.ch('felt', ['C4', 'F4', 'G4'], (32, 3.5), 0.45, 0.46, **K)
        a.n('brush', 38, (32, 3.5), 0.2, 0.6, **K)
        a.n('jazz', 36, (32, 3.5), 0.2, 0.4, **K)
    else:
        a.line('build', 'C5/8 F5/8', (32, 3), vel=0.55, swing=False, gate=0.5, lock=True, duty=0.25, rel=0.03)
        push(a, 32)


def clean_up_m2(a, g, t_lo, t_hi, ending):
    """Walking bass / comping / kit hits the pushes replace; everything after the tag in the 'stop' ending."""
    kill = []
    for n in a.notes:
        if not (t_lo <= n.start < t_hi):
            continue
        b, bt = g.pos(n.start)
        slot = abs(n.start - g.t(17)) < 0.03                               # the empty slot: every stem rests
        ant = b in (25, 29) and bt < 1.2 and n.inst in ('ubass', 'felt', 'jazz', 'brush')   # anticipated downbeats
        pu = n.x.get('_push') is not None
        b24 = b == 24 and bt >= 4.0 and n.inst == 'ubass' and not pu      # the walk yields to the push
        b28 = b == 28 and bt >= 4.0 and n.inst == 'ubass' and not pu
        end_ = ending == 'stop' and b == 32 and bt >= 3.0 and n.inst in ('ubass', 'felt', 'jazz', 'brush', 'swish') \
            and n.x.get('_keep') is None and not pu
        b32 = ending == 'push' and b == 32 and bt >= 4.0 and n.inst == 'ubass' and not pu
        if slot or ant or b24 or b28 or b32:
            kill.append(id(n))
        elif end_:
            kill.append(id(n))
    a.notes = [n for n in a.notes if id(n) not in kill]


def m2_notes(g, ending='stop'):
    a = Arr(g)
    movement_two(a, g, ending)
    clean_up_m2(a, g, g.t(17), g.t(34), ending)
    for n in a.notes:
        n.x.pop('_keep', None)
        n.x.pop('_push', None)
    if ending == 'stop':
        for n in a.notes:                                                  # the swish of b32 ends with the tag
            b, bt = g.pos(n.start)
            if n.inst == 'swish' and b == 32:
                n.dur = min(n.dur, g.at((32, 3.9)) - n.start)
    return a.notes


def build():
    g = Grid(bpm=96, meter='4/4', bars=34, swing=1.0)
    a = Arr(g)
    T = tracks()
    T['felt_base'] = _rep(T['felt'], name='felt_base')
    T['ubass_base'] = _rep(T['ubass'], name='ubass_base')

    # ============================================================ MOVEMENT I · 1993 (1-BIT)
    a.section('I 1993: the flat line', 1, 5)
    for b, text, root in ((1, 'F4/8 F5/8 r/8 F4/8 F3/4 r/4', 'F2'), (2, 'r/4 F5/8 F4/8 r/8 F4/8 F3/4', 'Db2'),
                          (3, 'F4/8 r/8 F5/8 F4/8 r/4 F3/8 r/8', 'Bb1'), (4, 'r/8 F4/8 F5/8 r/8 F4/4 F3/4', 'C2')):
        bl(a, text, b)
        br(a, b, root)
    a.mark('I: 1993 (1-bit)', (1, 1))
    a.section('I 1993: the knee\'s cells', 5, 9)
    bl(a, 'F4/8 F4/8 F5/8 r/8 F3/4 r/4', 5)
    bl(a, 'G4/8 Ab4/8 C5/4 r/2', 6)                                          # the kink, left hanging
    # fix 1 (rule 4): bar 7 used to open on F5, a fourth above the hanging C5 -- read by pitch class, that
    # finished the knee late (F F F F G Ab C | F, b5-7) and again (F F F F | G Ab C | F, b7-9).  Now the kid
    # re-strikes the C5 he left hanging (the leap is still not taken), then falls back to the flat line an
    # octave and a fifth lower: never a rising C -> F, and only three Fs before the next kink.
    bl(a, 'r/8 C5/8 F4/8 F4/8 F3/8 r/8 r/4', 7)
    bl(a, 'G5/8 Ab5/8 C6/4 r/2', 8)                                          # again, an octave up: still hanging
    for b, root in ((5, 'F2'), (6, 'Db2'), (7, 'F2'), (8, 'C2')):
        br(a, b, root, pat=[(0, 'lo'), (3, 'hi'), (4, 'lo'), (6, 'fi')] if b in (6, 8) else None)
    a.mark('I: the kink (hanging)', (6, 1))
    a.section('I 1993: Fm9 arpeggios', 9, 13)
    for b, root in ((9, 'F2'), (10, 'Db2'), (11, 'Bb1'), (12, 'C2')):
        for k in range(16):
            a.n('bline', ARP[k % 8], (b, 1 + 0.25 * k), '1/16', 0.6, lock=True, **dict(S1, rel=0.004))
        br(a, b, root)
    a.mark('I: Fm9 arpeggios', (9, 1))
    a.section('I 1993: NESNEJ (the empty slot)', 13, 17)
    bl(a, MOTIFS['UPSELL']['line'], 13)
    bl(a, MOTIFS['UPSELL']['close'], 16)
    for b, root, pat in ((13, 'F2', [(0, 'lo'), (4, 'fi')]), (14, 'Eb2', [(0, 'lo'), (4, 'fi')]),
                         (15, 'Db2', [(0, 'lo'), (4, 'fi')]), (16, 'C2', [(0, 'lo'), (2, 'hi')])):
        br(a, b, root, pat=pat)
    a.n('broot', 'F2', (16, 3), '1/4', 0.55, lock=True, **S1)                # the close lands (F2 under F4)
    a.mark('I: NESNEJ 1993, the Upsell', (13, 1))
    a.mark('I: the close lands', (16, 3))

    # ============================================================ MOVEMENT II · 2005-14 (EARLY-WEB16)
    a.section('II 2008: young Mas', 17, 25)
    a.section('II 2008: the dial-up era', 25, 33)
    m2 = m2_notes(g, 'stop')
    for n in m2:
        n.inst = TO16.get(n.inst, n.inst)
    a.notes += m2
    a.mark('II: the band enters after the slot', (17, 2))
    a.mark('II: young Mas, the Water Line', (18, 1))
    a.mark('II: the Build compiles', (25, 1))
    a.mark('II: the tag "shipped"', (32, 3))

    # ============================================================ RENDER FRONT (b33-34)
    a.section('render front: 1-bit -> 16-bit -> BASE', 33, 35)
    rf = Arr(g)
    render_front(rf, 33)
    for n in rf.notes:
        n.inst = TO16.get(n.inst, n.inst) if n.inst in ('felt', 'strpad', 'ubass') else n.inst
    a.notes += rf.notes
    a.mark('render front: 1-bit', (33, 1))
    a.mark('render front: 16-bit', (33, 3))
    a.mark('render front: BASE', (34, 1))

    META['silence_windows'] = [(g.t(17) + 0.005, g.t(17, 2) - 0.02, 'the empty slot (NESNEJ 1993): the SFX register '
                                                                     'clunks with no bell; every stem rests', -70.0)]
    META['no_third_windows'] = [(g.t(32, 3.5) + 0.12, g.t(33) - 0.02)]
    META['sfx_slots'] = [dict(t=(17, 1), sfx='the register "clunks with no bell" (Ep4 1993 part 2): the empty slot'),
                         dict(t=(33, 1), sfx='render_front_sweep F4 -> F6 across b33.1-b34.2 (the chord sits under '
                                             'it, top G4)')]
    META['audition'] = [
        '0:00-0:10 (b1-4): the 1-bit flat line over the walking roots -- charmingly harsh or fatiguing? '
        '(featured level; the underscore master sits ~2 dB lower, the -lp7k part is the dialogue alternate)',
        '0:12.5-0:20 (b6, b8): the kink left hanging -- does it read as "the kid hasn\'t finished", not as a '
        'mistake? Nothing should sound like the whole knee.  FIX 1: at 0:15.3 (b7) the kid re-strikes the hanging '
        'C5 and drops to F4 F4 F3 -- stuck, not the knee finishing (and not a V-I cadence)?',
        '0:30-0:40 (b13-16) and 0:40 (b17.1): the 1-bit Upsell and the EMPTY SLOT -- with the SFX register clunk '
        'laid in, does the missing bell land as the joke?',
        '0:40.6-1:00 (b17-24): the 16-bit trio -- a memory of 2008, not a video game or a Nintendo overworld? '
        'Is the cocky "nudge twice" charming or smug?',
        '1:00-1:20 (b25-32): the Build compiling over the swung band -- straight 16ths against swing: clean or '
        'lurching? Does "shipped" (1:18.75, b32.3) end it?',
        '1:20-1:25 (b33-34): the render front -- does the same chord read as ONE chord upgrading (1-bit, '
        '16-bit, clean) under the SFX sweep, with no gap at 1:21.25 and 1:22.5?',
    ]
    return Score(TID, g, T, a.notes, loop=g.span(*LOOP_M2), markers=a.markers, sections=a.sections,
                 length_s=g.t(35), tail_s=4.0, meta=META)


# ---------------------------------------------------------------------------------------------- parts
def render_parts(sc, workers=None):
    from parts import Parts
    g = sc.grid
    P = Parts(sc, HERE, TID, workers=workers)
    N = sc.notes

    def between(b0, b1, insts=None):
        t0, t1 = g.at(b0) if isinstance(b0, tuple) else g.t(b0), g.at(b1) if isinstance(b1, tuple) else g.t(b1)
        return [n for n in N if t0 - 1e-6 <= n.start < t1 - 1e-6 and (insts is None or n.inst in insts)]

    # the movements, linear, at the underscore level
    P.linear('m1-1993', between(1, 17), 1, (17, 2), tail_s=1.0,
             note='Movement I (1-bit) with the empty slot on b17.1; underscore level (P10: -22)')
    P.linear('m1-1993-lp7k', between(1, 17), 1, (17, 2), tail_s=1.0, gain_from='m1-1993',
             post=lambda x: _lp(x, 7000, 4),
             note='Movement I low-passed at 7 kHz: the under-dialogue alternate (P10)')
    P.linear('m2-2008', between(17, 33), 17, 33, tail_s=3.0,
             note='Movement II (16-bit), ending on the tag "shipped" (b32.3); underscore level (P10: -20)')
    P.linear('render-front-fwd', between(33, 35), 33, 35, tail_s=3.5,
             note='1-bit -> 16-bit -> BASE on Fm(add9), 2 beats each (the 5 s cut-down)')
    # the backwards render front: BASE -> 16-bit -> 1-bit ("downgrading...")
    rb = Arr(g)
    render_front(rb, 33, order=('base', '16', '1'))
    for n in rb.notes:
        n.inst = TO16.get(n.inst, n.inst) if n.inst in ('felt', 'strpad', 'ubass') else n.inst
    P.linear('render-front-back', rb.notes, 33, (34, 3), tail_s=0.3, gain_from='render-front-fwd',
             note='BASE -> 16-bit -> 1-bit, 2 beats each; ends dead on the 1-bit (b34.3)')
    # seamless loops (the engine's own loop file is II young Mas, b17-24)
    P.loop('m1-flat-line', between(1, 5), 1, 5, gain_from='m1-1993', note='1-bit, bars 1-4')
    P.loop('m1-arps', between(9, 13), 9, 13, gain_from='m1-1993', note='1-bit Fm9 arpeggios, bars 9-12')
    dial = [n for n in m2_notes(g, 'push') if g.t(25) - 1e-6 <= n.start < g.t(33) - 1e-6]
    for n in dial:
        n.inst = TO16.get(n.inst, n.inst)
    P.loop('m2-dial-up', dial, 25, 33, gain_from='m2-2008',
           note='the dial-up era, bars 25-32, with the push on b32.4& back into b25 (instead of the tag)')
    young = between(17, 25)
    P.loop('m2-young-mas-reduced', [n for n in young if n.inst in ('m16_felt', 'm16_bass', 'm16_brush', 'm16_jazz',
                                                                   'm16_swish')], 17, 25, gain_from='m2-2008',
           note='variant: the 16-bit trio only (no chip lead, no trumpet, no clean swell)')
    P.loop('m2-young-mas-solo', [n for n in young if n.inst in ('m16_felt',) or
                                 (n.inst == 'm16_lead' and g.pos(n.start)[0] in (18, 24))], 17, 25,
           gain_from='m2-2008', note='variant: 16-bit felt alone + the chip on the nudges only')
    # cut-downs (s6.4): 30 s = the 1993 story b5-16 + the slot; 15 s = young Mas b18-23 + a button; 5 s = the front
    P.linear('cut30-1993', between(5, 17), 5, (17, 2), tail_s=0.5, gain_from='m1-1993',
             note='30 s: the knee cells -> arpeggios -> NESNEJ -> the empty slot (12 bars)')
    c15 = [n for n in between(18, 24)]
    bt = Arr(g)
    bt.ch('m16_felt', voice('Abmaj9', 'rootless_a', around='C4') + ['Ab2'], (24, 1), '3b', 0.46)
    bt.n('m16_bass', 'Ab2', (24, 1), '2b', 0.68)
    bt.n('m16_lead', 'F5', (24, 1), '2b', 0.36, duty=0.5, rel=0.3, sus=0.5)
    bt.n('m16_brush', 38, (24, 1), 0.2, 0.5)
    P.linear('cut15-young-mas', c15 + bt.notes, 18, 24, tail_s=3.0, gain_from='m2-2008',
             note='15 s: young Mas (b18-23) + a button on Abmaj9 (b24.1)')
    # BASE blend (s5.C2 stems): Movement II's pre-chip piano, bass and drums (clean), not in the master
    base = m2_notes(g, 'stop')
    P.stems('m2-base-blend', base, 17, 33, gain_from='m2-2008', families=['piano', 'bass', 'drums', 'brass'],
            note='Movement II BEFORE the sample-chip (clean felt, upright, brushes, trumpet), level-matched: a '
                 'mixer blends BASE in under the 16-bit stem. Not part of the master.')
    P.save(extra=dict(levels='P10: Movement I underscore -22 (featured -18 = +4 dB); Movement II -20 (featured '
                             '-18 = +2 dB)'))


if __name__ == '__main__':
    # --no-parts: the engine build only.  --parts-only: the parts only (needs the underscore master on disk).
    # Parts render with the engine's own workers (fix 3, 2026-09-26: each track renders in its own forked child,
    # with a timeout guard), so the old workers=1 workaround for the pool hang is gone.
    do_parts = '--no-parts' not in sys.argv
    only = '--parts-only' in sys.argv
    sys.argv = [x for x in sys.argv if x not in ('--no-parts', '--parts-only')]
    os.environ.setdefault('OST_WORKERS', '3')
    if not only:
        cue = render_cli(build, __file__)
    if do_parts or only:
        print('[parts]', flush=True)
        render_parts(build())
