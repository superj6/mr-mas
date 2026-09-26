"""MM-19  "Renamed It. / The Fountain Pen"  --  composer A  --  OST-BIBLE s5.A2, P13 THE PODIUM

A library suite for every administration, at EQUAL WEIGHT (guardrails s2a rules 3-4): NEDIB's Fountain Pen (a
string quartet with harp, B-flat major, measured and legato: a signing) and RUMPT's Podium (brass one size too
big, E-flat major, varied by phase: FEAR muted, LOVE full, WHO? with a missing beat, SUPER renamed twice).
The band is the world performing; it plays everything straight and stops for real words.  The joke is the
Rename: the bass and the top note hold, only the inner voices slip a semitone -- same note, a new name.

Straight, 96 BPM, 36 bars = 90 s.  Word windows (pp sustain only, <= -28 LUFS) at b3-4, b13-14, b21-22.

  bars  1-8   THE FOUNTAIN PEN (NEDIB)       quartet + harp + one chip triangle; the motif at b1 (viola) and b5
                                             (solo violin 8va); a word window b3-4.  LOOP A (seamless).
  bars  9-10  THE MARKER                     the pen's turn is cut on b9.2 by one dry snare hit and a tuba Eb
  bars 11-18  FEAR                           cup-muted trombones + muted horns, pp, E-flat minor, half-time;
                                             tremolo low strings; a word window b13-14; a timpani roll into b15
  bars 19-26  LOVE                           the full march; the fanfare at b19 and b23 (<= 2 bars each); chip
                                             piccolo 8va; glock on the held note; a word window b21-22 (the snare
                                             stops, the tuba holds).  LOOP B (seamless, the Score's loop).
  bars 27-28  THE RENAME                     the held E-flat; on b27.3 the inner voices slip: Eb -> B/D#
  bars 29-32  WHO?                           the fanfare's last note never arrives (b30.1 is a hole); the band
                                             vamps, then waits; at b32 only the pickup plays
  bars 33-36  SUPER                          the Rename twice, Eb -> B -> G; the chip takes the top line; a
                                             1-beat button stop

  python track.py        renders the suite (loop B = LOVE), then loop A (the Fountain Pen) as extra loop files, then
                         the library variants (fix pass 1, 2026-09-26) to render/variants/: the 30 / 15 / 5 s
                         cut-downs, the NEDIB 15 / 5 s cut-downs (parity), reduced and solo piano
                         (--variants-only [names] / --no-variants)
"""
import os
import sys
from dataclasses import replace

import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.core import s2n   # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

META = dict(
    id='mm19-renamed-it',
    mm='MM-19',
    title='Renamed It. / The Fountain Pen',
    family='P13',
    tone='state occasions at equal weight: a fountain-pen quartet signing, and a brass podium one size too big that '
         'renames the world under a held note',
    usage='BI',
    tags=['podium', 'march', 'string quartet', 'parity', 'the rename', 'rumpt', 'nedib', 'library', 'featured',
          'word windows'],
    scenes=['Ep1 sc 13 White House (NEDIB: the Fountain Pen, b1-8)', 'NEDIB props: the pen, the PINKY-PROMISE scroll, '
            'EO 14110, the three-tier map', 'RUMPT\'s marker voids the three-tier map (b9-10)',
            'RUMPT phases: FEAR Ep2 (b11-18), the reveal Ep3 (b18.4-b19 only), LOVE Eps 4-6 (b19-26), the label gun '
            '(b27), "Who?" Ep8 (b29-32), SUPER Ep9 (b33-36)',
            'cut-downs: 5 s = b27-28 (the Rename); 15 s = b23-28; 30 s = b17-28 or b1-12'],
    motifs=['the Fountain Pen (viola b1, solo violin 8va b5; the turn C Bb A Bb)', 'the Podium (FEAR in Eb minor, '
            'half-time, b11 and b15; LOVE b19 and b23; WHO? b29)', 'the Rename (b27.3, b33.3, b35.3)',
            'the chip piccolo (gold glint) and the chip top line (SUPER)'],
    motif_ids=['FOUNTAIN_PEN', 'PODIUM'],
    key='Bb major (NEDIB); Eb minor (FEAR); Eb major (LOVE) -> B/D# -> G/B (the Renames)',
    composer='Composer A (OST batch 1)',
    description='Word windows (pp sustain only, target <= -28 LUFS): b3-4 = 5.0-10.0 s, b13-14 = 30.0-35.0 s, '
                'b21-22 = 50.0-55.0 s.  SFX sync (no musical attack by design): the label gun on the Rename '
                'slips b27.3 = 66.25 s, b33.3 = 81.25 s, b35.3 = 86.25 s.  Loops: A = b1-8 (0-20 s, '
                'mm19-renamed-it-fountainpen-loop.wav), B = b19-26 (45-65 s, mm19-renamed-it-loop.wav).  '
                'Cut-downs on bar lines: 5 s = b27-28 (with the b26.4.5 pickup); 15 s = b23-28; 30 s = b17-28.',
    underscore_lufs=-16.0,          # featured: the Fountain Pen and LOVE both at the same level (parity)
    album_loops=1,
)

WORD = [(3, 5, 'word window: NEDIB (pp sustain only)'), (13, 15, 'word window: FEAR (pp sustain only)'),
        (21, 23, 'word window: LOVE (the snare stops, the tuba holds)')]


# ============================================================================ tools
def stem_mutes(windows):
    """Stem inserts: family -> [(t0, t1)] windows of digital zero (3 ms fades), tails included.  Skipped in the
    loop render (no window lies in a loop body)."""
    def make(ws):
        def f(buf, ctx):
            if ctx.get('loop'):
                return buf
            x = np.asarray(buf, dtype=np.float32).copy()
            n = x.shape[1]
            k = int(0.003 * SR)
            for a, b in ws:
                ia, ib = s2n(a), min(s2n(b), n)
                if ia >= n:
                    continue
                e = min(n, ia + k)
                x[:, ia:e] *= np.linspace(1, 0, e - ia, dtype=np.float32)[None]
                x[:, e:ib] = 0.0
                if ib < n:
                    r = min(n, ib + k)
                    x[:, ib:r] *= np.linspace(0, 1, r - ib, dtype=np.float32)[None]
            return x
        return f
    return {fam: make(ws) for fam, ws in windows.items()}


def tracks():
    T = palette()
    for k in ('tpt', 'tbn', 'hn', 'tuba', 'snare', 'bdrum', 'suscym', 'timp', 'grand', 'glock'):
        T[k].hum_ms = min(T[k].hum_ms, 3.0)                  # a tight band: straight, barely human
    T['tbn_cup'] = replace(T['tbn'], name='tbn_cup', post=cup_mute, gain_db=3.0, pan=-0.2, sends={'hall': -9},
                           latency_ms=30.0)                  # the cup-muted attack speaks ~30 ms late: compensated
    T['snare_dry'] = replace(T['snare'], name='snare_dry', sends={'room': -22}, hum_ms=0.0, gain_db=0.0)
    T['tuba_dry'] = replace(T['tuba'], name='tuba_dry', sends={'room': -20}, hum_ms=0.0, gain_db=0.0)
    # NEDIB's quartet: a solo violin over chamber sections, close and warm
    T['svln'].gain_db = 1.0
    T['svln'].pan = -0.2
    T['svln'].sends = {'hall': -11, 'chamber': -12}
    for s, pan in (('vln1', -0.35), ('vln2', -0.15), ('vla', 0.15), ('vc', 0.3), ('cb', 0.45)):
        T[s].pan = pan
        T[s].width = 0.55
        T[s].sends = {'hall': -10, 'chamber': -13}
    T['harp'].gain_db = 0.0
    T['harp'].pan = -0.4
    T['tri'].gain_db = -6.0
    # RUMPT's band
    T['tuba'].gain_db = 0.0
    T['tpt'].gain_db = -4.0
    T['tbn'].gain_db = -7.0
    T['hn'].gain_db = -3.0
    T['snare'].gain_db = -3.0
    T['snare'].pan = 0.1
    T['bdrum'].gain_db = -2.0
    T['grand'].gain_db = 2.0
    T['glock'].gain_db = -8.0
    T['suscym'].gain_db = -12.0
    T['lead'].gain_db = 3.0                                   # the chip piccolo: the gold glint on top
    T['lead'].sends = {'hall': -14, 'room': -12}
    T['timp'].gain_db = -2.0
    return T


def brass(a, inst, p, at, dur, vel, rel=0.15, **x):
    """A held brass note that speaks on time: a staccato front crossfaded into the sustain sample (the VSCO
    sustains speak ~30 ms late; engine README s10, front='stab')."""
    a.n(inst, p, at, 0.09, vel, art='stab', rel=0.06, lock=True)
    return a.n(inst, p, at, dur, vel, art='sus', offset=0.06, att=0.035, rel=rel, lock=True, **x)


def harp(a, p, at, dur, vel=0.5):
    """VSCO harp: stay in its mf layer (vel 0.42-0.62); the level goes on gain (see MM-07's note)."""
    v = min(max(vel, 0.42), 0.62)
    return a.n('harp', p, at, dur, v, gain=18.0 * (vel - v))


def chord(a, insts, pitches, at, dur, vel, **x):
    for inst, p in zip(insts, pitches):
        a.n(inst, p, at, dur, vel, **x)


# ============================================================================ 1. THE FOUNTAIN PEN (b1-8)
def fountain_pen(a, g):
    a.section('THE FOUNTAIN PEN (NEDIB) -- loop A', 1, 9)
    # statement 1 (b1-2): the viola section, careful and legato; the turn lands on b3.1
    art.legato(a, 'vla', [('Bb3', (1, 1), '1b'), ('Bb3', (1, 2), '1b'), ('Bb3', (1, 3), '1b'), ('Bb3', (1, 4), '1b'),
                          ('C4', (2, 1), '1b'), ('D4', (2, 2), '1b'), ('F4', (2, 3), '1b'), ('Bb4', (2, 4), '1/16'),
                          ('C5', (2, 4.25), '1/16'), ('Bb4', (2, 4.5), '1/16'), ('A4', (2, 4.75), '1/16'),
                          ('Bb4', (3, 1), '1b', 0.4)], vel=0.56, last=dict(rel=0.9))
    a.mark('b1 the Fountain Pen (viola)', (1, 1))
    # the harmony: Bb | Gm7 | Ebmaj7 | Eb/G | Cm7 | Bb/D | Eb/F (F9sus4, no third) | Bb
    bass = [('Bb2', 1, 1), ('G2', 1, 2), ('Eb2', 1, 3), ('G2', 1, 4), ('C3', 2, 1), ('D3', 2, 2), ('F2', 2, 3),
            ('Bb2', 2, 4)]
    upper = [['D4', 'F4'], ['D4', 'F4'], ['G4', 'D5'], ['G4', 'Eb5'], ['G4', 'Eb5'], ['F4', 'Bb4'], ['G4', 'Eb5'],
             ['F4', 'D5']]
    for (bp, bar, bt), (u2, u1) in zip(bass, upper):
        a.n('vc', 'C3' if bp == 'F2' else bp, (bar, bt), '1b', 0.5, rel=0.3)
        if bp == 'F2':                                          # soft: the chip triangle carries the clean F
            a.n('cb', 'F2', (bar, bt), '1b', 0.28, rel=0.3)
        a.n('tri', bp, (bar, bt), '0.9b', 0.5, att=0.004, dec=0.4, sus=0.0, rel=0.1)
        a.n('vln2', u2, (bar, bt), '1b', 0.42, rel=0.3)
        a.n('vln1', u1, (bar, bt), '1b', 0.40, rel=0.3)
    for bar, ps in ((1, ['Bb2', 'F3', 'Bb3', 'F4', 'C5']), (2, ['C3', 'G3', 'Eb4', 'G4', 'C5'])):   # b1: no third (a D
        # ringing into the b1.4 F bass reads as an A partial)
        for i, p in enumerate(ps):                                  # one rolled harp chord per bar
            harp(a, p, g.t(bar) + 0.035 * i, '2b', 0.46)
    # b3-4: the word window -- pp sustain only (Bb add9, no motion)
    for inst, p in (('vc', 'Bb2'), ('vln2', 'D4'), ('vln1', 'F4'), ('cb', 'Bb1')):
        a.n(inst, p, (3, 1), '2bar', 0.22, att=0.25, rel=0.5, lp=2500.0)
    a.n('vla', 'C4', (3, 3), '6b', 0.2, att=0.4, rel=0.5, lp=2500.0)
    # statement 2 (b5-8): the solo violin, an octave up, over the whole quartet, harp arpeggios, a soft grand
    a.mark('b5 the Fountain Pen (solo violin)', (5, 1))
    art.legato(a, 'svln', [('Bb4', (5, 1), '1b'), ('Bb4', (5, 2), '1b'), ('Bb4', (5, 3), '1b'), ('Bb4', (5, 4), '1b'),
                           ('C5', (6, 1), '1b'), ('D5', (6, 2), '1b'), ('F5', (6, 3), '1b'), ('Bb5', (6, 4), '1/16'),
                           ('C6', (6, 4.25), '1/16'), ('Bb5', (6, 4.5), '1/16'), ('A5', (6, 4.75), '1/16'),
                           ('Bb5', (7, 1), '1b'), ('Eb6', (7, 2), '1b'), ('D6', (7, 3), '1b'), ('C6', (7, 4), '1b'),
                           ('Bb5', (8, 1), '2.8b')], vel=0.6, last=dict(rel=0.5))
    bass2 = [('Bb2', 5, 1), ('G2', 5, 2), ('Eb2', 5, 3), ('F2', 5, 4), ('C3', 6, 1), ('D3', 6, 2), ('F2', 6, 3),
             ('Bb2', 6, 4), ('Eb2', 7, 1), ('G2', 7, 2), ('C3', 7, 3), ('F2', 7, 4), ('Bb1', 8, 1)]
    inner = [['F3', 'D4'], ['F3', 'D4'], ['G3', 'Bb3'], ['Eb3', 'G3'], ['Eb3', 'G3'], ['F3', 'Bb3'], ['Eb3', 'G3'],
             ['F3', 'D4'], ['G3', 'Bb3'], ['F3', 'D4'], ['Eb3', 'G3'], ['Eb3', 'G3'], ['F3', 'D4']]
    for i, ((bp, bar, bt), (iv, iv2)) in enumerate(zip(bass2, inner)):
        d = '2.8b' if bar == 8 else '1b'
        a.n('vc', 'C3' if bp == 'F2' else bp, (bar, bt), d, 0.55, rel=0.3)
        a.n('cb', 'F2' if bp == 'F2' else (nm(bp) - 12 if nm(bp) >= 40 else bp), (bar, bt), d, 0.4, rel=0.3)
        a.n('tri', bp, (bar, bt), '0.9b', 0.52, att=0.004, dec=0.4, sus=0.0, rel=0.1)
        a.n('vla', iv, (bar, bt), d, 0.46, rel=0.3)
        a.n('vln2', iv2, (bar, bt), d, 0.44, rel=0.3)
    # the grand: one soft chord per half bar (the same instrument LOVE marches on: parity of means)
    for bar, bt, ps in ((5, 1, ['Bb2', 'F3', 'D4']), (5, 3, ['Eb3', 'Bb3', 'G4']), (6, 1, ['C3', 'G3', 'Eb4']),
                        (6, 3, ['F2', 'Eb3', 'G3', 'C4']), (7, 1, ['Eb3', 'Bb3', 'G4']), (7, 3, ['C3', 'G3', 'Eb4']),
                        (8, 1, ['Bb1', 'F2', 'D3', 'F3'])):
        a.ch('grand', ps, (bar, bt), '1.9b' if bar < 8 else '2.8b', 0.34, roll=0.01)
    # the harp: eighth-note arpeggios on the chord of each half bar (the pen's loops)
    arps = {(5, 1): ['Bb3', 'D4', 'F4', 'Bb4'], (5, 3): ['Eb4', 'G4', 'Bb4', 'D5'], (6, 1): ['C4', 'Eb4', 'G4', 'C5'],
            (6, 3): ['Eb4', 'G4', 'Bb4', 'C5'], (7, 1): ['Eb4', 'G4', 'Bb4', 'Eb5'], (7, 3): ['C4', 'Eb4', 'G4', 'C5']}
    for (bar, bt), ps in arps.items():
        for k, p in enumerate(ps):
            harp(a, p, (bar, bt + 0.5 * k), '1b', 0.44 if k else 0.5)
    for i, p in enumerate(['Bb1', 'F2', 'Bb2', 'D3', 'F3', 'Bb3']):
        harp(a, p, g.t(8) + 0.03 * i, '2.8b', 0.5)
    # b8.4: the breath (every voice has released): the loop comes round to the careful flat line


# ============================================================================ 2. THE MARKER (b9-10)
def marker(a, g):
    a.section('THE MARKER: the map voided (cut mid-turn on b9.2)', 9, 11)
    # the pen's final flourish: the turn begins and is cut on b9.2 (its A4 never sounds)
    art.legato(a, 'svln', [('C5', (9, 1), '1/8'), ('Bb4', (9, 1.5), '1/8'), ('A4', (9, 2), '1/8')], vel=0.58)
    for inst, p in (('vc', 'D3'), ('vla', 'F3'), ('vln2', 'Bb3'), ('cb', 'D2')):
        a.n(inst, p, (9, 1), '2b', 0.46, rel=0.3)
    for i, p in enumerate(['D3', 'F3', 'Bb3', 'D4']):
        harp(a, p, g.t(9) + 0.03 * i, '1b', 0.46)
    a.n('tri', 'D3', (9, 1), '0.9b', 0.5, att=0.004, dec=0.4, sus=0.0, rel=0.1)
    # RUMPT's marker: one dry snare hit and a tuba Eb, on b9.2
    a.n('snare_dry', 60, (9, 2), 0.3, 0.9, lock=True)
    a.n('tuba_dry', 'Eb2', (9, 2), '0.9b', 0.62, art='stac', lock=True)
    a.mark('b9.2 THE MARKER: dry snare + tuba Eb (the pen is cut)', (9, 2))


# ============================================================================ 3. FEAR (b11-18)
def fear(a, g):
    a.section('FEAR (muted brass, Eb minor, half-time)', 11, 19)
    # the Podium in E-flat minor at half-time, on cup-muted trombones (an octave under the written line)
    fear_line = [('Bb2', (10, 4), '1b'), ('Eb3', (11, 1), '3b'), ('F3', (11, 4), '1b'), ('Gb3', (12, 1), '2b'),
                 ('Bb3', (12, 3), '2b'), ('Eb4', (13, 1), '2bar')]
    for p, at, d in fear_line:
        brass(a, 'tbn_cup', p, at, d, 0.5 if p != 'Eb4' else 0.44, rel=0.35)
    a.mark('b10.4 FEAR pickup (cup-muted trombone)', (10, 4))
    fear2 = [('Bb2', (14, 4), '1b'), ('Eb3', (15, 1), '3b'), ('F3', (15, 4), '1b'), ('Gb3', (16, 1), '2b'),
             ('Bb3', (16, 3), '2b'), ('Eb4', (17, 1), '4b'), ('Eb4', (18, 1), '2b')]
    for p, at, d in fear2:
        brass(a, 'tbn_cup', p, at, d, 0.52, rel=0.3)
    # muted horns: the chords, pp (vel < 0.66: the mute set's top layer is a single sample)
    hchords = [((11, 1), '6b', ['Gb3', 'Bb3', 'Eb4']), ((12, 3), '2b', ['Gb3', 'B3', 'Eb4']),       # Ebm | Cb(=B)/Eb
               ((13, 1), '2bar', ['Gb3', 'Bb3', 'F4']),                                           # Ebm(add9): window
               ((15, 1), '6b', ['Gb3', 'Bb3', 'Eb4']), ((16, 3), '2b', ['Ab3', 'Cb4', 'Eb4']),   # Ebm | Abm/Eb
               ((17, 1), '4b', ['Gb3', 'B3', 'Eb4']), ((18, 1), '2b', ['Gb3', 'Bb3', 'Eb4'])]     # Cb/Eb | Ebm
    for at, d, ps in hchords:
        for p in ps:
            a.n('hn', p, at, d, 0.36 if at[0] in (13, 14) else 0.42, art='mute', rel=0.4)
    # tremolo low strings on the E-flat pedal
    for bar0, bar1, v in ((11, 13, 0.34), (13, 15, 0.26), (15, 18, 0.36)):
        art.trem(a, 'vc', ['Eb2', 'Bb2'], (bar0, 1), f'{bar1 - bar0}bar', vel=v)
        art.trem(a, 'vla', ['Eb3', 'Gb3'], (bar0, 1), f'{bar1 - bar0}bar', vel=v - 0.04)
    art.trem(a, 'vc', ['Eb2', 'Bb2'], (18, 1), '2b', vel=0.36)
    art.trem(a, 'vla', ['Eb3', 'Gb3'], (18, 1), '2b', vel=0.32)
    # the grand's ghost of a march: a low octave, pp, at each statement
    a.ch('grand', ['Eb1', 'Eb2'], (11, 1), '2bar', 0.3)
    a.ch('grand', ['Eb1', 'Eb2'], (15, 1), '2bar', 0.32)
    # a timpani roll into b15 (on the last beat of the word window), then the arrival
    t0, t1 = g.t(14, 4), g.t(15, 1)
    k = 10
    for i in range(k):                                           # the roll clears the arrival by 110 ms
        a.n('timp', 'Eb2', t0 + (t1 - t0 - 0.11) * i / k, 0.08, 0.26 + 0.2 * i / k, lock=True)
    a.n('timp', 'Eb2', (15, 1), '1b', 0.62, lock=True)
    a.mark('b15.1 timpani arrival (FEAR statement 2)', (15, 1))
    # the gold glint, muted: one soft chip note at the arrival, decaying (never a held tone)
    a.n('lead', 'Eb5', (15, 1), '1.5b', 0.42, duty=0.5, att=0.01, dec=0.5, sus=0.0, rel=0.3)


# ============================================================================ 4. LOVE (b19-26) and the march
PODIUM = [('Eb4', 1, '1.5b'), ('F4', 2.5, '0.5b'), ('G4', 3, '1b'), ('Bb4', 4, '1b')]


def fanfare(a, bar, held=True, held_harm='Eb', vel=0.72, chip=True, last=True):
    """The Podium: (pickup Bb3 on the bar before) | Eb4 q. F4 e G4 q Bb4 q | Eb5 w.  Trumpets in two parts,
    trombones harmonising; the chip piccolo an octave above the top line."""
    harm = {1: ['Eb3', 'G3', 'Bb3'], 2.5: ['D3', 'F3', 'Ab3'], 3: ['Eb3', 'G3', 'Bb3'], 4: ['D3', 'F3', 'Ab3']}
    second = {1: 'G3', 2.5: 'Ab3', 3: 'Bb3', 4: 'D4'}
    for p, bt, d in PODIUM:
        brass(a, 'tpt', p, (bar, bt), d, vel, rel=0.12)
        brass(a, 'tpt', second[bt], (bar, bt), d, vel - 0.08, rel=0.12)
        for q in harm[bt]:
            brass(a, 'tbn', q, (bar, bt), d, vel - 0.12, rel=0.12)
        if chip:
            a.n('lead', nm(p) + 12, (bar, bt), d, 0.55, duty=0.125, att=0.002, dec=0.25, sus=0.35, rel=0.08,
                lock=True)
    if last:                                                   # the held Eb5: the note RUMPT is standing on
        brass(a, 'tpt', 'Eb5', (bar + 1, 1), '3.6b', vel, rel=0.3)
        brass(a, 'tpt', 'G4', (bar + 1, 1), '3.6b', vel - 0.1, rel=0.3)
        tb = {'Eb': ['Eb3', 'G3', 'Bb3'], 'Ab': ['Eb3', 'Ab3', 'C4']}[held_harm]
        for q in tb:
            brass(a, 'tbn', q, (bar + 1, 1), '3.6b', vel - 0.14, rel=0.3)
        a.n('glock', 'Eb6', (bar + 1, 1), '2b', 0.62, lock=True)
        if chip:
            a.n('lead', 'Eb6', (bar + 1, 1), '1.5b', 0.55, duty=0.125, att=0.002, dec=0.4, sus=0.0, rel=0.2,
                lock=True)
        a.n('suscym', 60, (bar + 1, 1), 0.5, 0.5, lock=True)


def pickup(a, bar, vel=0.66, chip=True):
    """The Podium's pickup: Bb3 on the and-of-4 of `bar`."""
    a.n('tpt', 'Bb3', (bar, 4.5), '0.45b', vel, art='stab', rel=0.1, lock=True)
    a.n('tbn', 'Bb2', (bar, 4.5), '0.45b', vel - 0.14, art='stab', rel=0.1, lock=True)
    if chip:
        a.n('lead', 'Bb4', (bar, 4.5), '0.45b', 0.5, duty=0.125, att=0.002, dec=0.2, sus=0.3, rel=0.06, lock=True)


def march(a, bars, harm, snare=True, grand=True, strings=True, vel=1.0):
    """The engine: field snare, bass drum on 1 and 3, staccato tuba on 1 and 3, grand march chords on every beat,
    strings holding the harmony.  harm: {bar: [(beat, root, bass2, chord)]}."""
    b0, b1 = bars
    if snare:
        Drums(a, 'orch').play('''
            snare: X..x x.x. X..x x.xx
            bd:    x... .... x... ....
        ''', bars=(b0, b1), vel=vel)
    else:
        Drums(a, 'orch').play('''
            bd:    x... .... x... ....
        ''', bars=(b0, b1), vel=vel * 0.8)
    for bar in range(b0, b1):
        for bt, root, b2, ch in harm[bar]:
            a.n('tuba', root, (bar, bt), '0.8b', 0.62 * vel, art='stac', lock=True)
            if grand:
                for k in range(2):                                 # chords on each beat of the half bar
                    a.ch('grand', [b2] + ch, (bar, bt + k), '0.7b', (0.5 if k == 0 else 0.42) * vel, roll=0.006)
            if strings:
                a.n('vc', b2, (bar, bt), '1.9b', 0.56 * vel, rel=0.2)
                a.n('vla', ch[0], (bar, bt), '1.9b', 0.54 * vel, rel=0.2)
                a.n('vln2', ch[1], (bar, bt), '1.9b', 0.54 * vel, rel=0.2)
                a.n('vln1', ch[2], (bar, bt), '1.9b', 0.5 * vel, rel=0.2)


EB = ('Eb2', 'Eb3', ['G3', 'Bb3', 'Eb4'])
BB7 = ('Bb1', 'D3', ['F3', 'Ab3', 'D4'])
AB = ('Ab1', 'Eb3', ['Ab3', 'C4', 'Eb4'])
CM = ('C2', 'Eb3', ['G3', 'C4', 'Eb4'])
FM7 = ('F2', 'Eb3', ['Ab3', 'C4', 'Eb4'])            # F minor 7: Ab, never an A
BB7S = ('Bb1', 'Eb3', ['F3', 'Ab3', 'Eb4'])          # Bb7sus4


def H(*items):
    return [(bt, r, b2, ch) for bt, (r, b2, ch) in items]


def love(a, g):
    a.section('LOVE (the full march) -- loop B', 19, 27)
    pickup(a, 18)
    fanfare(a, 19)
    a.mark('b19 fanfare 1', (19, 1))
    march(a, (19, 21), {19: H((1, EB), (3, EB)), 20: H((1, EB), (3, BB7))})
    # b21-22 the word window: the snare stops, the tuba holds, strings pp
    a.n('tuba', 'Eb2', (21, 1), '2bar', 0.36, rel=0.4)
    for inst, p in (('vc', 'Eb3'), ('vla', 'G3'), ('vln2', 'Bb3')):
        a.n(inst, p, (21, 1), '7.4b', 0.2, att=0.2, rel=0.4, lp=2600.0)
    pickup(a, 22)
    fanfare(a, 23, held_harm='Ab')
    a.mark('b23 fanfare 2', (23, 1))
    march(a, (23, 25), {23: H((1, EB), (3, EB)), 24: H((1, AB), (3, EB))})
    # b25-26: the tag -- strings and chip carry the Podium's dotted rhythm up a sequence; stop on b26.3
    march(a, (25, 27), {25: H((1, AB), (3, CM)), 26: H((1, BB7S), (3, BB7))})
    a.remove(t0=g.t(26, 4), t1=g.t(27, 1))                      # the band's 1-beat stop (the pickup follows)
    for n in a.notes:
        if g.t(25) <= n.start < g.t(26, 4) < n.start + n.dur:
            n.dur = g.t(26, 4) - n.start - 0.02
    tag = [('Ab4', (25, 1), '1.5b'), ('Bb4', (25, 2.5), '0.5b'), ('C5', (25, 3), '1b'), ('Eb5', (25, 4), '1b'),
           ('D5', (26, 1), '1.5b'), ('Eb5', (26, 2.5), '0.5b'), ('F5', (26, 3), '1b')]
    for p, at, d in tag:
        a.n('vln1', p, at, d, 0.56, rel=0.15)
        a.n('svln', nm(p) + 12, at, d, 0.5, rel=0.15)
        a.n('lead', p, at, d, 0.5, duty=0.125, att=0.002, dec=0.25, sus=0.3, rel=0.06, lock=True)
    art.stab(a, 'tbn', ['F3', 'Bb3', 'D4'], (26, 3), vel=0.66, length=0.4)
    art.stab(a, 'tpt', ['F4', 'Bb4'], (26, 3), vel=0.66, length=0.4)
    pickup(a, 26)


# ============================================================================ 5. THE RENAME (b27-28)
def rename(a, g, bar, frm, top, bass, vel=0.5, hold_to=None, label='THE RENAME'):
    """Hold bass and top; over the 2 beats from `bar`.3 the inner voices slip a semitone (a legato slip, no new
    attack): same note, same floor, a new name.  frm/to: the inner voices [(inst, pitch_from, pitch_to)]."""
    t_hold = g.at(hold_to) if hold_to else g.t(bar + 1, 3)
    for inst, p in bass + top:
        v = vel + 0.05 if (inst, p) in bass else vel
        if inst in ('tpt', 'tbn', 'tuba', 'hn'):
            brass(a, inst, p, (bar, 1), t_hold - g.t(bar), v, rel=0.3)
        else:
            a.n(inst, p, (bar, 1), t_hold - g.t(bar), v, rel=0.3, lock=True)
    for inst, p0, p1 in frm:
        art.legato(a, inst, [(p0, (bar, 1), '2b'), (p1, (bar, 3), t_hold - g.t(bar, 3))], vel=vel - 0.04,
                   last=dict(rel=0.3))


def the_rename(a, g):
    a.section('THE RENAME (Eb -> B/D#)', 27, 29)
    rename(a, g, 27,
           frm=[('hn', 'G3', 'F#3'), ('hn', 'Bb3', 'B3'), ('vla', 'G3', 'F#3'), ('vln2', 'Bb3', 'B3')],
           top=[('tpt', 'Eb5'), ('vln1', 'Eb5'), ('svln', 'Eb5')],
           bass=[('tuba', 'Eb2'), ('vc', 'Eb2'), ('cb', 'Eb2')], vel=0.5)
    a.ch('grand', ['Eb1', 'Eb2', 'Eb4', 'Eb5'], (27, 1), '5.9b', 0.5)      # outer notes only: the piano can't slip
    a.n('glock', 'Eb6', (27, 1), '2b', 0.6, lock=True)
    a.n('lead', 'Eb6', (27, 1), '1.5b', 0.52, duty=0.125, att=0.002, dec=0.5, sus=0.0, rel=0.2, lock=True)
    a.n('bdrum', 60, (27, 1), 0.5, 0.6, lock=True)


# ============================================================================ 6. WHO? (b29-32)
def who(a, g):
    a.section('WHO? (the missing beat; then only the pickup)', 29, 33)
    pickup(a, 28)
    fanfare(a, 29, last=False)
    march(a, (29, 32), {29: H((1, EB), (3, EB)), 30: H((1, EB), (3, EB)), 31: H((1, EB), (3, BB7))})
    a.mark('b30.2 WHO?: the band resumes after the missing downbeat', (30, 2))
    pickup(a, 32, vel=0.6, chip=True)                           # b32: only the pickup plays (one trumpet + glint)
    a.remove(insts=['tbn'], t0=g.t(32, 4.4), t1=g.t(32, 4.6))
    a.mark('b32.4.5 only the pickup', (32, 4.5))


# ============================================================================ 7. SUPER (b33-36)
def super_(a, g):
    a.section('SUPER (the Rename twice: Eb -> B -> G; the chip takes the top line)', 33, 37)
    # the arrival: a tutti stab, then the band marches on while the world is renamed under it
    art.stab(a, 'tpt', ['Eb5', 'G4'], (33, 1), vel=0.7, length=0.5)
    art.stab(a, 'tbn', ['Eb3', 'G3', 'Bb3'], (33, 1), vel=0.62, length=0.5)
    a.n('suscym', 60, (33, 1), 0.5, 0.5, lock=True)
    rename(a, g, 33,
           frm=[('hn', 'G3', 'F#3'), ('hn', 'Bb3', 'B3'), ('vla', 'G3', 'F#3'), ('vln2', 'Bb3', 'B3')],
           top=[('vln1', 'Eb5')], bass=[('vc', 'Eb2'), ('cb', 'Eb2')], vel=0.46, hold_to=(35, 1),
           label='SUPER rename 1')
    # the march engine keeps its step: Eb, then B/D# (tuba and bass hold the same note)
    Drums(a, 'orch').play('''
        snare: X..x x.x. X..x x.xx
        bd:    x... .... x... ....
    ''', bars=(33, 36))
    Drums(a, 'orch').play('''
        snare: X..x x... ........
        bd:    x... .... ........
    ''', bars=(36, 37))
    B_D = ('D#2', 'D#3', ['F#3', 'B3', 'D#4'])
    B_B = ('B1', 'B2', ['F#3', 'B3', 'D#4'])
    G_B = ('B1', 'B2', ['G3', 'B3', 'D4'])
    eng = [(33, 1, EB), (33, 3, B_D), (34, 1, B_D), (34, 3, B_D), (35, 1, B_B), (35, 3, G_B), (36, 1, G_B)]
    for bar, bt, (root, b2, ch) in eng:
        a.n('tuba', root, (bar, bt), '0.8b', 0.6, art='stac', lock=True)
        for k in range(2):
            a.ch('grand', [b2] + ch, (bar, bt + k), '0.7b', 0.5 if k == 0 else 0.42, roll=0.006)
    # the chip takes the top line: RUMPT's flat line in the Podium's dotted rhythm, on the held note
    for bar, p in ((33, 'Eb5'), (34, 'D#5'), (35, 'B4'), (36, 'B4')):
        for bt, d in ((1, '1.5b'), (2.5, '0.5b'), (3, '1b'), (4, '1b')):
            if bar == 36 and bt > 1:
                continue
            a.n('lead', nm(p) + 12, (bar, bt), d, 0.58 if bt == 1 else 0.5, duty=0.125 if bt != 1 else 0.25,
                att=0.002, dec=0.22, sus=0.3, rel=0.06, lock=True)
    # b35: re-voice to B (bass and top move together), a stab, and the second slip on b35.3
    art.stab(a, 'tpt', ['B4', 'F#4'], (35, 1), vel=0.66, length=0.5)
    art.stab(a, 'tbn', ['B2', 'F#3', 'D#4'], (35, 1), vel=0.6, length=0.5)
    rename(a, g, 35,
           frm=[('hn', 'D#4', 'D4'), ('hn', 'F#3', 'G3'), ('vla', 'F#3', 'G3'), ('vln2', 'D#4', 'D4')],
           top=[('vln1', 'B4')], bass=[('vc', 'B2'), ('cb', 'B1')], vel=0.46, hold_to=(36, 2),
           label='SUPER rename 2')
    # the button: a short tutti on b36.1 (G/B), then the 1-beat stop
    art.stab(a, 'tpt', ['B4', 'G4', 'D4'], (36, 1), vel=0.7, length=0.45)
    art.stab(a, 'tbn', ['B2', 'G3', 'D4'], (36, 1), vel=0.64, length=0.45)
    a.n('glock', 'B5', (36, 1), '1b', 0.6, lock=True)
    a.mark('b36.1 the button (G/B)', (36, 1))


# ============================================================================ the Score
def build(loop=(19, 27)):
    g = Grid(bpm=96, bars=36)
    a = Arr(g)
    T = tracks()
    fountain_pen(a, g)
    marker(a, g)
    fear(a, g)
    love(a, g)
    the_rename(a, g)
    who(a, g)
    super_(a, g)
    a.remove(t0=g.t(30, 1), t1=g.t(30, 2))                       # WHO?: the missing beat (nothing starts there)
    a.remove(t0=g.t(32, 1), t1=g.t(32, 4.4))                     # the band waits
    meta = dict(META)
    meta['audition'] = AUDITION
    meta['sfx_slots'] = [dict(t=(27, 3), sfx='the label gun (RUMPT renames): lands on the slip'),
                         dict(t=(33, 3), sfx='label gun'), dict(t=(35, 3), sfx='label gun')]
    # the hard stops: digital zero, tails included
    mutes = [(g.t(18, 3), g.t(18, 4.5)),                        # FEAR's 1-beat stop, then LOVE's pickup
             (g.t(28, 3), g.t(28, 4.5)),                        # the Rename's stop, then WHO?'s pickup
             (g.t(30, 1), g.t(30, 2)),                          # WHO?: the missing beat
             (g.t(32, 1), g.t(32, 4.5)),                        # the band waits; only the pickup
             (g.t(36, 2), g.t(37, 1) + 3.0)]                    # SUPER's button: the 1-beat stop and out
    # the marker: the pen and its room are cut dead on b9.2 (the snare and the tuba are not)
    cut = (g.t(9, 2), g.t(10, 4))
    posts = stem_mutes({f: [cut] for f in ('strings', 'perc', 'piano', 'chip', 'winds')})
    return Score(meta['id'], g, T, a.notes, loop=g.span(*loop), markers=a.markers, sections=a.sections,
                 mutes=mutes, stem_post=posts, macro=level_map(g), length_s=g.t(37), tail_s=0.5, meta=meta)


LEVELS = dict(fp=+2.4, fp_word=-7.5, fear=-4.0, fear_word=-12.5, love_word=-8.5)


def level_map(g):
    """The conductor's fader (Score.macro, dB): the Fountain Pen trimmed to LOVE's level (parity), FEAR hushed,
    and every word window ridden down to pp.  0.3 s ramps, always inside a sustained chord."""
    L, r = LEVELS, 0.3
    pts = [(0.0, L['fp']), (g.t(3, 1) + 0.35, L['fp']), (g.t(3, 1) + 0.35 + r, L['fp_word']),
           (g.t(5, 1) - r, L['fp_word']), (g.t(5, 1) - 0.02, L['fp']), (g.t(9, 2), L['fp']),
           (g.t(9, 2) + 0.01, 0.0), (g.t(10, 4) - 0.05, 0.0), (g.t(10, 4) - 0.04, L['fear']),
           (g.t(13, 1) - r, L['fear']), (g.t(13, 1) + 0.1, L['fear_word']), (g.t(14, 4) - 0.05, L['fear_word']),
           (g.t(15, 1) - 0.02, L['fear']), (g.t(18, 3), L['fear']), (g.t(18, 3) + 0.01, 0.0),
           (g.t(21, 1) - 0.15, 0.0), (g.t(21, 1) + 0.15, L['love_word']), (g.t(22, 4) - r, L['love_word']),
           (g.t(22, 4.45), 0.0), (g.t(37) + 5.0, 0.0)]
    return pts


AUDITION = [
    '0-20 s vs 45-65 s: PARITY -- do the Fountain Pen and LOVE feel equally grand (same level, same size, same '
    'seriousness)? neither may sound like the joke',
    '65.0-70.0 s (b27-28): THE RENAME -- the inner voices slip at 66.25 s under a held E-flat; deadpan, or too '
    'cute? the label gun lands on 66.25 s',
    '20.0-21.0 s: the marker -- the pen is cut on 20.625 s by one dry snare and a tuba E-flat: a void, not a gag',
    '25-45 s: FEAR -- hushed and ceremonial (muted brass pp, tremolo) without being horror-movie; the timpani roll '
    'at 34.4 s is a roll, never a pulse',
    '72.5-80 s: WHO? -- the missing downbeat at 72.5 s and the band waiting (77.5-79.7 s): deadpan timing',
    '80-90 s: SUPER -- the chip top line holds while Eb -> B (81.25 s) -> G (86.25 s); the button at 87.5 s',
]


# ============================================================================ loop A (the Fountain Pen)
def render_loop_a(out_dir):
    """Loop A (b1-8) through the engine's own build (same masters, same make-up), keeping only its loop files."""
    import glob
    import shutil
    from engine.export import build as ebuild
    tmp = os.path.join(out_dir, '_loopA_tmp')
    sid = 'mm19-renamed-it-fountainpen'
    sc = build(loop=(1, 9))
    cue = ebuild(sc, tmp, sid, stems=False, loop=True, previews=True, verbose=False)
    for f in glob.glob(os.path.join(tmp, f'{sid}-loop*')):
        shutil.move(f, os.path.join(out_dir, os.path.basename(f)))
    import json
    with open(os.path.join(out_dir, f'{sid}-loop.json'), 'w') as fh:
        json.dump(dict(id=sid, loop=cue['loop'], underscore_master=cue['masters']['underscore']['measured'],
                       note='loop A = bars 1-8 (the Fountain Pen) at the suite\'s underscore make-up; loop B (LOVE, '
                            'bars 19-26) is mm19-renamed-it-loop.wav'), fh, indent=1, default=float)
    shutil.rmtree(tmp, ignore_errors=True)
    print('loop A', cue['loop']['seconds'], 's', cue['loop']['frames'], 'f', cue['loop']['seam']['verdict'])



# ============================================================================ library variants (OST-BIBLE s6.4, s6.7)
# Cut-downs are windows of the suite on bar lines (each keeps its pickup and ends on a stop); PARITY: the Fountain
# Pen gets its own 15 s and 5 s cut-downs beside RUMPT's (its movement is 8 bars, so its 30 s is loop A).  REDUCED
# and SOLO PIANO are the whole suite with fewer players.  All go to render/variants/ (`python track.py`, or
# `python track.py --variants-only [names]`), mastered to the suite's targets; no stems (the suite's stems carry
# every voice).
VARIANTS = {
    '30s': dict(spans=[((17, 1), (28, 3))], end=(29, 1), pickup=0, title='30 s cut-down (RUMPT)',
                desc='30 s (b17-28): FEAR\'s close (the cup-muted Eb and its stop), LOVE whole (both fanfares, the '
                     'word window, the tag) and THE RENAME, ending on its stop. The tremolo re-enters on bar 1.'),
    '15s': dict(spans=[((22, 4), (28, 3))], end=(29, 1), pickup=1, title='15 s cut-down (RUMPT)',
                desc='15 s (b23-28 + the b22.4.5 pickup): fanfare 2, the tag and THE RENAME, ending on its stop.'),
    '05s': dict(spans=[((26, 4), (28, 3))], end=(29, 1), pickup=1, title='5 s cut-down (RUMPT)',
                desc='5 s (b27-28 + the b26.4.5 pickup): the band arrives on Eb and THE RENAME slips under the held '
                     'note (label gun at 2.5 + 0.625 s); ends on the stop.'),
    '15s-nedib': dict(spans=[((1, 1), (3, 1)), ((5, 1), (9, 1))], end=(9, 1), pickup=0,
                      title='15 s cut-down (NEDIB)',
                      desc='15 s (b1-2 + b5-8): the Fountain Pen on the violas, then on the solo violin with the '
                           'whole quartet, harp and grand, ending on the breath (b8). Parity with RUMPT\'s 15 s.'),
    '05s-nedib': dict(spans=[((1, 1), (3, 1))], end=(3, 3), pickup=0, landing=True, title='5 s cut-down (NEDIB)',
                      desc='5 s (b1-2 + the b3.1 landing): the Fountain Pen once, the turn landing on Bb over a soft '
                           'Bb chord. Parity with RUMPT\'s 5 s.'),
    'reduced': dict(title='reduced',
                    desc='REDUCED: the whole suite with fewer players. NEDIB: the quartet and the chip triangle (no '
                         'harp, no piano). FEAR: the cup-muted trombone, tremolo strings and the timpani (no horns, '
                         'no piano ghost). RUMPT: ONE trumpet on the Podium over the march engine (snare, bass drum, '
                         'tuba, grand chords, strings) with the chip piccolo; no trombones, no horns, no 2nd trumpet. '
                         'The Renames slip in the violas and 2nd violins. Same form, stops, word windows and parity '
                         'fader as the suite.'),
    'solo': dict(title='solo piano',
                 desc='SOLO PIANO: the whole suite on the grand alone (the chip identity layer stays: NEDIB\'s '
                      'triangle, RUMPT\'s piccolo glints and SUPER\'s top line). The Fountain Pen in the melody with '
                      'its bass line and chords; the marker as one dry low Eb octave; FEAR in pp octaves; the march '
                      'as the suite\'s own grand chords over the tuba\'s roots, the fanfare in two parts; the Renames '
                      'as a re-voicing under held outer keys. Parity by the same fader.'),
}


def _clip_window(full, t0, t1, shift, keep_from_before=()):
    """Notes starting in [t0, t1), moved by -shift."""
    return [n.copy(start=n.start - shift) for n in full.notes if t0 - 1e-9 <= n.start < t1 - 1e-9]


def _macro_on(full, pts_src, shift, t_end):
    xs = [p[0] for p in full.macro]
    ys = [p[1] for p in full.macro]
    return [(t - shift, float(np.interp(t, xs, ys))) for t in sorted(set(pts_src))] + [(t_end + 5.0, 0.0)]


def build_cut(name):
    v = VARIANTS[name]
    full = build()
    g0 = full.grid
    notes, mk, se, mu, mac = [], [], [], [], []
    dst = 0.0
    for (b0, b1) in v['spans']:
        t0, t1 = g0.at(b0), g0.at(b1)
        sh = t0 - dst
        notes += _clip_window(full, t0, t1, sh)
        mk += [(t - sh, lab) for t, lab in full.markers if t0 - 1e-6 <= t < t1]
        se += [(lab, max(x0, t0) - sh, min(x1, t1) - sh) for lab, x0, x1 in full.sections if x1 > t0 and x0 < t1]
        mu += [(max(x0, t0) - sh, min(x1, t1) - sh) for x0, x1 in full.mutes if x1 > t0 and x0 < t1]
        xs = [p[0] for p in full.macro]
        mac += [(t - sh, float(np.interp(t, xs, [p[1] for p in full.macro])))
                for t in sorted({t0, t1 - 1e-3} | {x for x in xs if t0 < x < t1})]
        dst += t1 - t0
    L = g0.at(v['end']) - g0.at(v['spans'][-1][0]) + (dst - (g0.at(v['spans'][-1][1]) - g0.at(v['spans'][-1][0])))
    if v.get('landing'):                     # the turn lands on b3.1: the viola's Bb4 and the soft Bb chord, 1 beat
        t3 = g0.t(3)
        b = g0.beats_s(1, t3)
        for n in full.notes:
            if abs(n.start - t3) < 0.05 and n.inst in ('vla', 'vc', 'vln1', 'vln2', 'cb'):
                notes.append(n.copy(start=n.start - t3 + dst, dur=min(n.dur, b * 1.5)))
        L = dst + g0.beats_s(2, t3)
    pk_s = g0.beats_s(v['pickup'], 0.0)
    g = Grid(bpm=96, bars=max(1, int(np.ceil((L - pk_s) / g0.bar_s(1) - 1e-6))), pickup=v['pickup'])
    a = Arr(g)
    if name == '30s':                        # FEAR's tremolo began at b15: re-enter it for bar 17 (it resumes at b18)
        art.trem(a, 'vc', ['Eb2', 'Bb2'], 0.0, '1bar', vel=0.36)
        art.trem(a, 'vla', ['Eb3', 'Gb3'], 0.0, '1bar', vel=0.32)
    a.notes = notes + a.notes
    stop = g0.t(28, 3) - (g0.at(v['spans'][0][0]))
    if name in ('30s', '15s', '05s'):
        mu.append((stop, L + 3.0))           # the Rename's stop is the ending
    meta = {k: val for k, val in META.items()}
    meta.update(id=f"{META['id']}-{name}", title=f"Renamed It. / The Fountain Pen ({v['title']})",
                description=v['desc'], tags=META['tags'] + ['variant', 'cut-down'], version='1',
                motif_ids=['FOUNTAIN_PEN'] if 'nedib' in name else (['PODIUM'] if name != '05s' else []))
    slots = [dict(t=round(t, 4), sfx='the label gun: lands on the slip') for t in
             [g0.t(27, 3) - (g0.at(v['spans'][0][0])), g0.t(33, 3) - (g0.at(v['spans'][0][0]))] if 0 < t < L]
    meta['sfx_slots'] = slots
    meta['audition'] = [f'0-{L:.2f} s: a clean start on its (pick-up) bar line; the ending is the suite\'s own stop',
                        'against the suite at the same bars: the same music and the same level']
    pts = sorted(mac) or [(0.0, 0.0)]
    return Score(meta['id'], g, full.tracks, a.notes, markers=mk, sections=se, mutes=mu, stem_post={},
                 macro=pts + [(L + 5.0, pts[-1][1])], length_s=L, tail_s=1.2 if 'nedib' in name else 0.5, meta=meta)


def _top_line(ns, win=0.035):
    """Keep only the highest pitch of each onset cluster (a section's notes a hair apart)."""
    ns = sorted(ns, key=lambda n: n.start)
    out, i = [], 0
    while i < len(ns):
        j = i
        while j + 1 < len(ns) and ns[j + 1].start - ns[i].start < win:
            j += 1
        grp = ns[i:j + 1]
        top = max(n.pitch for n in grp)
        out += [n for n in grp if n.pitch == top]      # (a held brass note is a stab front + its sustain: keep both)
        i = j + 1
    return out


def build_reduced():
    full = build()
    g = full.grid
    t19 = g.t(19) - 0.5
    keep = [n for n in full.notes if n.inst not in ('harp', 'hn', 'tbn', 'tpt')
            and not (n.inst == 'grand' and n.start < t19)]
    keep += _top_line([n for n in full.notes if n.inst == 'tpt'])
    meta = dict(META)
    meta.update(id=f"{META['id']}-reduced", title='Renamed It. / The Fountain Pen (reduced)',
                description=VARIANTS['reduced']['desc'], tags=META['tags'] + ['variant', 'reduced'], version='1')
    meta['audition'] = ['0-20 s vs 45-65 s: PARITY still holds with fewer players (the quartet vs one trumpet over the '
                        'engine)', '66.25 s: the Rename in the strings alone -- still deadpan?',
                        '45-65 s: one trumpet on the Podium: ceremonial, never a bugle call or "Taps"']
    return Score(meta['id'], g, full.tracks, keep, loop=None, markers=full.markers, sections=full.sections,
                 mutes=full.mutes, stem_post=full.stem_post, macro=full.macro, length_s=full.end_s, tail_s=0.5,
                 meta=meta)


def build_solo():
    """The suite on the grand alone (plus the chip): each line routed onto the piano, sections a hair apart merged."""
    full = build()
    g = full.grid
    t = g.t
    P = []

    def put(n, pitch=None, vel=None, dur=None, start=None):
        P.append(Note('grand', float(pitch if pitch is not None else n.pitch), n.start if start is None else start,
                      n.dur if dur is None else dur, n.vel if vel is None else vel, n.lock, {}))
    chip = []
    for n in full.notes:
        s0 = n.start
        if n.inst in ('lead', 'lead2', 'tri'):
            chip.append(n.copy())                                       # the chip layer stays as written
        if n.inst == 'grand':                                            # the suite's own piano part (under the
            put(n, vel=min(0.62, n.vel * (0.9 if s0 >= t(19) - 0.5 else 1.05)))   # march's tune: a shade down)
        elif n.inst == 'vla' and s0 < t(3) + 0.05:                        # statement 1: the viola's line, 8va
            put(n, pitch=n.pitch + 12, vel=0.5 if s0 < t(3) - 0.01 else 0.4)
        elif n.inst == 'harp' and s0 < t(3) and n.pitch < 72:            # its two rolled chords (below the tune)
            put(n, vel=0.34, dur=g.beats_s(2, s0))
        elif n.inst == 'tri' and s0 < t(3):                              # statement 1's bass line
            put(n, vel=0.4, dur=g.beats_s(0.95, s0))
        elif n.inst == 'cb' and t(5) - 0.01 <= s0 < t(9):                # statement 2's: the contrabass's octave
            put(n, vel=0.42, dur=min(n.dur, g.beats_s(0.95, s0)))       # (a Bb1 under the held Eb/F, never F2)
        elif t(3) - 0.01 <= s0 < t(5) - 0.01 and n.inst in ('vc', 'vla', 'vln1', 'vln2', 'cb'):
            put(n, vel=0.22, dur=min(n.dur, g.beats_s(7.5, s0)))          # the word window: one pp chord, held
        elif n.inst == 'svln' and s0 < t(9, 2) - 0.01:                   # statement 2 + the marker's cut turn
            put(n, vel=0.54, dur=min(n.dur, t(9, 2) - s0 - 0.01) if s0 >= t(9) else None)
        elif t(9) - 0.01 <= s0 < t(9, 2) - 0.01 and n.inst in ('vc', 'vla', 'vln2', 'cb'):
            put(n, vel=0.36, dur=t(9, 2) - s0 - 0.01)                    # the turn's Bb/D, cut with it on b9.2
        elif t(21) - 0.01 <= s0 < t(22, 4) and n.inst in ('vc', 'vla', 'vln2'):
            put(n, vel=0.2)                                              # LOVE's word window: pp, held
        elif n.inst == 'tuba_dry':                                       # the marker: one dry low Eb octave
            put(n, pitch=n.pitch, vel=0.62, dur=0.35)
            put(n, pitch=n.pitch - 12, vel=0.56, dur=0.35)
        elif n.inst == 'tbn_cup':                                        # FEAR: the Podium in pp octaves
            put(n, vel=0.36)
            put(n, pitch=n.pitch + 12, vel=0.3)
        elif n.inst == 'hn' and t(10, 4) <= s0 < t(19):                   # FEAR's muted chords, ppp
            put(n, vel=0.2)
        elif n.inst == 'tpt':                                            # fanfares, pickups, stabs: both parts
            put(n, vel=min(0.6, n.vel * 0.8))
        elif n.inst == 'tuba':                                           # the march's roots (and the word window)
            put(n, vel=min(0.56, n.vel * 0.9))
        elif n.inst == 'vln1' and t(25) <= s0 < t(26, 4):                 # LOVE's tag
            put(n, vel=0.5)
        elif n.inst in ('vla', 'vln2', 'vln1', 'vc', 'cb') and (t(27) <= s0 < t(29) or t(33) <= s0 < t(37)) \
                and n.x.get('art') != 'trem' and n.dur > g.beats_s(1.5, s0):
            put(n, vel=0.36)                                             # the Renames: the slipping inner voices
    # a section's players a hair apart become one piano note (the longest, the loudest)
    P.sort(key=lambda n: (n.pitch, n.start))
    merged = []
    for n in P:
        m = merged[-1] if merged else None
        if m and m.pitch == n.pitch and n.start - m.start < 0.04:
            m.dur = max(m.dur, n.dur + (n.start - m.start))
            m.vel = max(m.vel, n.vel)
        else:
            merged.append(n)
    meta = dict(META)
    meta.update(id=f"{META['id']}-solo", title='Renamed It. / The Fountain Pen (solo piano)',
                description=VARIANTS['solo']['desc'], tags=META['tags'] + ['variant', 'solo', 'piano'], version='1',
                motif_ids=['PODIUM'])        # (the Fountain Pen is at b1 and b5, but the rolled piano chords break the
    #                                          matcher's top line)
    from dataclasses import replace as _rp
    T = dict(full.tracks)                    # the chip was balanced against the full band: a glint over one piano
    for k in ('lead', 'tri'):
        T[k] = _rp(T[k], gain_db=T[k].gain_db - 8.0)
    meta['audition'] = ['the whole file: a pianist at a state occasion -- straight, measured, never a rehearsal '
                        'pianist, ragtime or oom-pah', '66.25 s: the Rename as a re-voicing under held outer keys: '
                        'does the slip still read?', '0-20 s vs 45-65 s: parity on one instrument']
    return Score(meta['id'], g, T, merged + chip, loop=None, markers=full.markers, sections=full.sections,
                 mutes=full.mutes, stem_post={'chip': full.stem_post['chip']}, macro=full.macro, length_s=full.end_s,
                 tail_s=1.0, meta=meta)


def build_variant(name):
    if name == 'reduced':
        return build_reduced()
    if name == 'solo':
        return build_solo()
    return build_cut(name)


def render_variants(names=None, workers=None, previews=True):
    from engine.export import build as ebuild
    vdir = os.path.join(HERE, 'render', 'variants')
    for name in (names or VARIANTS):
        sc = build_variant(name)
        ebuild(sc, vdir, sc.meta['id'], stems=False, loop=False, previews=previews, workers=workers)

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--no-stems', action='store_true')
    ap.add_argument('--no-loop', action='store_true')
    ap.add_argument('--no-mp3', action='store_true')
    ap.add_argument('--verify-loop', action='store_true')
    ap.add_argument('--workers', type=int, default=None)
    ap.add_argument('--no-loop-a', action='store_true')
    ap.add_argument('--no-variants', action='store_true')
    ap.add_argument('--variants-only', nargs='*', default=None)
    args = ap.parse_args()
    from engine.export import build as ebuild
    out = os.path.join(HERE, 'render')
    if args.variants_only is None:
        ebuild(build(), out, META['id'], stems=not args.no_stems, loop=not args.no_loop, previews=not args.no_mp3,
               workers=args.workers, check_loop=args.verify_loop)
        if not (args.no_loop or args.no_loop_a):
            render_loop_a(out)
    if not args.no_variants:
        render_variants(args.variants_only or None, workers=args.workers, previews=not args.no_mp3)
