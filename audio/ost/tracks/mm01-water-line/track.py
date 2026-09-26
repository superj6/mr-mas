"""MM-01  WATER LINE  (Mas's theme)  --  library suite, DARK ROOM (OST-BIBLE P01, s5.E2)            composer E

He flirts with the curve and goes back: the glass nudged "one pixel true, back onto a spot it never left".
The Water Line (s2.2) is the one COMPLETE motif in the show, so this cue is calm, not sad: a man alone at
2 a.m. who is sure of himself.  Thin under Mas (s0 rule 1): felt upright first, everything else asks leave.

  bars  1-2   INTRO   the flat line and the nudge, felt alone, over a third-free LH; the settle is WITHHELD
                      (the nudge's F4 is held into bar 2 over Dbmaj7) -- we wait for it
  bars  3-10  A       the Water Line x2 over Fm9 | Dbmaj7 | Bbm9 | C7sus(b9), 2 bars each.  Statement 1 (b3-4,
                      trio: felt, upright pp in a two-feel, brushes), V.O. window (b5-6, felt alone), statement 2
                      (b7-8, trio), V.O. window (b9-10, felt alone; the b9 resolves into the sus: 1-bar ENDING b10)
  bars 11-18  B       "the night": the kink G-Ab-C touched in the violas (b11) and the cellos (b18) and never
                      taken; a chip-triangle counter-line; ONE Harmon trumpet line (b13-16); the verdict (vibes +
                      celesta F5 -> C6, open fifth) at b17; C7sus(b9) 1-bar ENDING b18
  bars 19-26  A'      the motif again, a 50 % chip square doubling ONLY the nudge (G4); cellos sul tasto hold the
                      guide tones; V.O. window b21-22; 1-bar ENDING b26 (loops to b3)
  bars 27-30  CODA    the flat line, then C4 -> F4 on an open fifth (F3 C4 F4), no third; it rings

  LOOP  bars 3-26 (24 bars = 60.0 s = 1440 frames, seamless).  ENDINGS: cut after b10, b18 or b26 (each a
  held suspended chord that rings out on its own).  VARIANTS by stems: felt alone = the piano stem (V.O.-safe),
  trio = piano + bass + drums, full = everything.  Under the SFX room_drone / server_hum drop the bass stem:
  every other part stays at or above C3 (s3 P01 "nothing below C3").
  Cut-downs and the STRAIGHT variant: `python track.py --variants` (see VARIANTS below).

96 BPM, the house swing (+10 frames).  F minor; rootless felt voicings; no third at any cadence.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.export import build as engine_build   # noqa: E402
from dataclasses import replace   # noqa: E402

ID = 'mm01-water-line'

META = dict(
    id=ID,
    mm='MM-01',
    title='Water Line',
    family='P01',
    tone='Mas\'s theme: calm, alone, sure of himself at 2 a.m.; the one complete motif in the show',
    usage='BI',
    tags=['dark room', 'mas', 'theme', 'library', 'felt piano', 'jazz trio', 'V.O.'],
    scenes=['Ep1 sc 18 dark room (10:13)', 'Ep1 sc 20-23 dark room beats', 'every episode: his rooms, nights, V.O.',
            'Ep1 sc 32 tag (MM-12 may quote it)'],
    motifs=['the Water Line (felt RH, b1 fragment, b3, b7, b19, b23, b27-28)',
            'the nudge doubled by a 50 % chip square (A\': b19, b23 only)',
            'the kink G-Ab-C, never taken (violas b11, cellos b18)',
            'the verdict F5 -> C6 (vibes + celesta, b17)', 'one Harmon trumpet line (b13-16)'],
    motif_ids=['WATER_LINE', 'VERDICT'],
    key='F minor (rootless Fm9 - Dbmaj7 - Bbm9 - C7sus(b9)); B: Dbmaj7#11 - Bbm9 - Gbmaj7#11 - F5 - C7sus(b9)',
    composer='Composer E (OST batch 1; fix 1: composer A)',
    version='1.1 (fix 1, 2026-09-26)',
    description='Library suite, 30 bars at 96. Loop b3-26. 1-bar endings at b10, b18, b26. Composed V.O. windows '
                'b5-6, b9-10, b21-22 (felt alone). The trio bass (F2-Db3) is the only part below C3: mute the bass '
                'stem under room_drone / server_hum.  Fix 1 (2026-09-26): balance toward P01 -- strings +2 dB, the violas join '
                'the cellos in A\'s 2nd statement, the Harmon +2 dB, the V.O. felt a touch fuller; room_sfx windows '
                'for the engine\'s sub check; the 5 s cut-down\'s tail fade is in the score; re-rendered on the fixed engine.',
    album_loops=1,
    album_lufs=-16.0,                    # a quiet solo-piano-led cue (OST-BIBLE s6.5 allows down to -16)
    vo_windows=[((5, 1), (7, 1)), ((9, 1), (11, 1)), ((21, 1), (23, 1))],
    no_third_windows=[((17, 1.1), (18, 1)), ((28, 2.2), (31, 1))],
    # fix 1: the engine's sub-under-room check (s6.5).  As a library cue any section may sit under the SFX
    # room_drone (F1 + C2) or server_hum (F2); the instruction is to mute the bass stem there (P01: nothing below C3)
    room_sfx=[dict(t0=(1, 1), t1=(3, 1), sfx='room_drone (intro)'), dict(t0=(3, 1), t1=(11, 1), sfx='room_drone (A)'),
              dict(t0=(11, 1), t1=(19, 1), sfx='room_drone (B)'), dict(t0=(19, 1), t1=(27, 1), sfx="room_drone (A')"),
              dict(t0=(27, 1), t1=(31, 1), sfx='room_drone (coda)')],
    room_sfx_drop_stems=['bass'],
    audition=[],                         # filled below (timecodes from the grid)
)

VARIANTS = {
    # id suffix: (plan, bars, description)
    '30s': ([('A', 1), ('CODA', 9)], 12, '30 s cut-down: A (both statements and both V.O. windows) + the coda'),
    '15s': ([('STATEMENT', 1), ('VO_DB', 3), ('CADENCE', 5)], 6,
            '15 s cut-down: one statement (trio), the Dbmaj7 window, the cadence C4 -> F4 and its ring'),
    '05s': ([('MOTTO', 1)], 2, '5 s cut-down: the Water Line whole, felt alone, open fifth; identifiable in 2 bars'),
    'straight': ([('STRAIGHT', 1)], 8, 'STRAIGHT variant: the Water Line x2 on the cello section, straight (no '
                 'swing), no chip, no piano; for a sanctioned sincere beat'),
}
FULL_PLAN = [('INTRO', 1), ('A', 3), ('B', 11), ('A2', 19), ('CODA', 27)]


# ================================================================== helpers
class Felt:
    """The real felt: the Upright KW with its mechanics (felt_mech) and the pedal changed on every chord."""

    def __init__(self, a):
        self.a = a
        self.ped_changes = []          # seconds where the pedal is re-caught
        self.ped_up = []               # seconds where the pedal lifts and stays up

    def chord(self, ps, at, dur, vel, roll=0.011, mech=0.42, pedal=True, lock=False):
        """A left-hand chord (on 'felt_lh': the same felt, its own track so the motif matcher reads the melody)."""
        a = self.a
        t = a.g.at(at)
        a.ch('felt_lh', ps, t, dur, vel, roll=0.0 if lock else roll, lock=lock)
        if mech:
            a.n('felt_mech', 60, t, 0.1, mech)
        if pedal:
            self.ped_changes.append(t)

    def note(self, p, at, dur, vel):
        return self.a.n('felt', p, at, dur, vel)

    def pedal_track(self, end_s):
        ev = [(0.0, False)]
        for t in sorted(set(round(x, 4) for x in self.ped_changes)):
            ev += [(max(t - 0.035, 0.0), False), (t + 0.025, True)]
        for t in self.ped_up:
            ev.append((t, False))
        ev.append((end_s, False))
        ev.sort()
        return ev


def wl(a, at, vel=0.5, part='line'):
    """The Water Line, as written (swung), on the felt."""
    return place_motif(a, 'felt', 'WATER_LINE', at, vel=vel, part=part)


def two_feel(a, bar, roots, vel=0.34):
    """Upright bass pp in a two-feel: half notes (the half-time feel under a 96 swing)."""
    for i, p in enumerate(roots):
        a.n('ubass', p, (bar, 1 + 2 * i), '1.9b', vel * (1.0 if i == 0 else 0.9))


def brushes(a, b0, b1, vel=1.0):
    Drums(a, 'brushes').play(f'''
        sweep[vel={0.55 * vel:.3f}]: ~~~~~~~~
        tap[vel={0.42 * vel:.3f}]:   ..g...o.
        kick[vel={0.30 * vel:.3f}]:  o.......
    ''', bars=(b0, b1))


# ================================================================== the sections (each writes from bar o)
def sec_intro(a, F, o):
    a.section('intro', o, o + 2)
    F.chord(['Eb3', 'G3', 'C4'], (o, 1), '4b', 0.30)                 # Fm9 with no third: unclear which side
    a.line('felt', 'F4/4 F4/4 F4/4 G4/8', (o, 1), vel=0.46, swing=True)
    F.note('F4', (o, 4.5, 'sw'), a.g.t(o + 1, 4) - a.g.s(o, 4.5), 0.44)   # the nudge's F: held, the settle withheld
    F.chord(['Db3', 'Ab3', 'C4'], (o + 1, 1), '4b', 0.28, mech=0.3)   # Dbmaj7 (the held F is its third)


def statement(a, F, o, chords, bass, trio=True, nudge=False, cello=None, vel=0.46):
    """One Water Line statement over two bars of one chord (voicings kept below the melody)."""
    lh1, lh2, push = chords
    wl(a, (o, 1), vel=vel)
    F.chord(lh1, (o, 1), '1.6b', 0.32)
    F.chord(lh1[:3], (o, 2.5, 'sw'), '1/8', 0.22, mech=0.25, pedal=False)     # charleston: 1 and the swung 2&
    F.chord(lh2, (o + 1, 1), '1.4b', 0.29)                            # under the melody's C4: nothing above Ab3
    F.chord(push, (o + 1, 4.5, 'sw'), '2b', 0.28, mech=0.3)           # the push into the next chord
    if nudge:
        place_motif(a, 'lead', 'WATER_LINE', (o, 1), part='nudge_double', vel=0.34, duty=0.5, rel=0.08,
                    sus=0.5, dec=0.12)
        # the settle doubled by a triangle an octave down: the chip remembers him (s2.2's other doubling)
        a.n('tri', 'C3', (o + 1, 1), '0.9b', 0.34, rel=0.1, sus=0.7)
        a.n('tri', 'F3', (o + 1, 2), '2.8b', 0.34, rel=0.3, sus=0.7)
    if trio:
        two_feel(a, o, bass[0])
        two_feel(a, o + 1, bass[1])
        brushes(a, o, o + 2)
    if cello:                           # sul tasto guide tones (soft attack, low-passed): the world, far off
        art.sus(a, 'vc', cello[:1], (o, 1), '2bar', vel=0.5, lp=2400, att=0.6, rel=0.9)
        art.sus(a, 'vla', cello[1:], (o, 1), '2bar', vel=0.46, lp=2400, att=0.6, rel=0.9)


def vo_window(a, F, o, root, lift=None, lock=False, v=(0.48, 0.45)):
    """Felt alone: the pushed chord rings; one soft root; one inner move in the 2nd bar.  -24 LUFS-S.
    (fix 1: a touch fuller, 0.4/0.37 -> 0.48/0.45, so the windows sit nearer -24 than the -26 edge now that the
    strings and the Harmon around them are 2 dB higher)"""
    F.chord([root], (o, 1), '4b', v[0], mech=0.22)
    if lift:
        F.chord(lift, (o + 1, 1), '4b', v[1], mech=0.18, roll=0.02, lock=lock)


def sec_A(a, F, o, prime=False):
    a.section("A'" if prime else 'A', o, o + 8)
    cello1 = ['Eb3', 'Ab3'] if prime else None
    cello2 = ['Db3', 'Ab3']     # A: the strings creep in on the 2nd statement (fix 1: the violas join the cellos
    #                             there, a bar of A' early -- balance); A': both statements
    # (no sustained vibrato F over the F2 in the bass: its 5th partial reads as an A in the s6.9 chroma check)
    # statement 1: Fm9 (b o, o+1) -> pushes Dbmaj7
    statement(a, F, o, (['Eb3', 'G3', 'Ab3', 'C4'], ['Eb3', 'G3', 'Ab3'], ['F3', 'Ab3', 'C4']),
              (['F2', 'C3'], ['F2', 'Eb2']), nudge=prime, cello=cello1)
    # V.O. window 1: Dbmaj7 (felt alone)
    vo_window(a, F, o + 2, 'Db3', lift=['Ab3', 'C4', 'Eb4'])
    # statement 2: Bbm9 -> pushes C7sus(b9)
    statement(a, F, o + 4, (['Db3', 'F3', 'Ab3', 'C4'], ['Db3', 'F3', 'Ab3'], ['G3', 'Bb3', 'Db4']),
              (['Bb2', 'F2'], ['Bb2', 'Db3']), nudge=prime, cello=cello2)
    if not prime:
        # V.O. window 2: C7sus(b9), felt alone; the b9 settles into the sus -> the 1-bar ENDING at b(o+7)
        vo_window(a, F, o + 6, 'C3', lift=['G3', 'Bb3', 'C4'], lock=True)
        F.ped_up.append(a.g.t(o + 8) - 0.03)
    else:
        # A': the dominant with the trio (no V.O. window), then the ending bar (felt + cello)
        F.chord(['C3', 'G3', 'Bb3', 'Db4'], (o + 6, 1), '3b', 0.3)
        two_feel(a, o + 6, ['C3', 'G2'])
        brushes(a, o + 6, o + 7, vel=0.8)
        art.sus(a, 'vc', ['C3'], (o + 6, 1), '2bar', vel=0.48, lp=2400, att=0.6, rel=0.9)
        art.sus(a, 'vla', ['Bb3'], (o + 6, 1), '2bar', vel=0.44, lp=2400, att=0.6, rel=0.9)
        F.chord(['G3', 'Bb3', 'C4'], (o + 7, 1), '4b', 0.3, mech=0.15, lock=True)   # the b9 settles: the ENDING bar
        F.ped_up.append(a.g.t(o + 8) - 0.03)
    a.mark(f"{'A-prime' if prime else 'A'} ending bar (cut after it)", (o + 7, 1))


def sec_B(a, F, o):
    a.section('B (the night)', o, o + 8)
    g = a.g
    # b o, o+1: Dbmaj7#11 -- the kink in the violas, touched and never taken
    F.chord(['F3', 'C4', 'Eb4', 'G4'], (o, 1), '1.6b', 0.3)
    F.chord(['F3', 'C4', 'G4'], (o, 2.5, 'sw'), '1/8', 0.2, mech=0.22, pedal=False)
    F.chord(['Ab3', 'C4', 'F4'], (o + 1, 1), '3b', 0.26)
    art.legato(a, 'vla', [('G3', (o, 1), '2b'), ('Ab3', (o, 3), '1b'), ('C4', (o, 4), '4b')], vel=0.48,
               last=dict(rel=0.7), lp=2600)
    # the strings' bed (sul tasto: soft attacks, low-passed): the night around him, guide tones only
    for inst, p, b0, nb, v in [('vc', 'F3', o, 2, 0.48), ('vc', 'Db3', o + 2, 2, 0.48), ('vla', 'Ab3', o + 2, 2, 0.44),
                               ('vc', 'Db3', o + 4, 2, 0.46), ('vla', 'F3', o + 4, 2, 0.44),
                               ('vc', 'C3', o + 6, 1, 0.4), ('vla', 'C4', o + 6, 1, 0.38), ('vla', 'Bb3', o + 7, 1, 0.4)]:
        art.sus(a, inst, [p], (b0, 1), f'{nb}bar', vel=v, lp=2400, att=0.7, rel=0.9)
    two_feel(a, o, ['Db2', 'Ab2'])
    two_feel(a, o + 1, ['Db2', 'Ab2'])
    brushes(a, o, o + 6, vel=0.85)
    # the chip triangle counter-line (<= -10 dB under the felt)
    for p, at, d in [('C5', (o, 1), '4b'), ('Bb4', (o + 1, 1), '2b'), ('Ab4', (o + 1, 3), '2b'),
                     ('F4', (o + 2, 1), '8b'), ('Eb4', (o + 4, 1), '4b'), ('Db4', (o + 5, 1), '4b')]:
        a.n('tri', p, at, g.dur(d, g.at(at)) * 0.96, 0.36, rel=0.12, att=0.02, sus=0.8)
    # b o+2, o+3: Bbm9 -- the Harmon enters (the one line per episode: the night)
    F.chord(['Db3', 'F3', 'Ab3', 'C4'], (o + 2, 1), '3b', 0.28)
    F.chord(['Db3', 'Ab3', 'Bb3'], (o + 3, 1), '3b', 0.24)
    two_feel(a, o + 2, ['Bb2', 'F2'])
    two_feel(a, o + 3, ['Bb2', 'Ab2'])
    a.line('harmon', 'r/4 C5/2 Bb4/8 Ab4/8 G4/2. r/4', (o + 2, 1), vel=0.52, swing=True)
    # b o+4, o+5: Gbmaj7#11
    F.chord(['F3', 'Bb3', 'C4'], (o + 4, 1), '3b', 0.27)
    F.chord(['F3', 'Bb3', 'Db4'], (o + 5, 1), '3b', 0.24)
    two_feel(a, o + 4, ['Gb2', 'Db3'])
    two_feel(a, o + 5, ['Db3', 'Gb2'])
    a.line('harmon', 'Ab4/4 C5/4 Eb5/2 Db5/2. r/4', (o + 4, 1), vel=0.5, swing=True)
    # b o+6: the verdict -- open fifth, no third; the texture thins to let it ring
    a.mark('the verdict F5 -> C6 (the Orb acts)', (o + 6, 1))
    F.chord(['F3', 'C4'], (o + 6, 1), '4b', 0.24, mech=0.18)
    a.n('ubass', 'F2', (o + 6, 1), '3.6b', 0.3)
    Drums(a, 'brushes').play('sweep[vel=0.4]: ~~~~~~~~', bars=(o + 6, o + 7))
    for inst, v in (('vibes', 0.44), ('celesta', 0.22)):
        a.n(inst, 'F5', (o + 6, 1), '2b', v, lock=True)
        a.n(inst, 'C6', (o + 6, 2), '3b', v * 0.96, lock=True)
    # b o+7: C7sus(b9), the cellos touch the kink -> the 1-bar ENDING
    F.chord(['G3', 'Bb3', 'Db4', 'F4'], (o + 7, 1), '4b', 0.3, mech=0.2, lock=True)
    art.legato(a, 'vc', [('G3', (o + 7, 1), '2b'), ('Ab3', (o + 7, 3), '1b'), ('C4', (o + 7, 4), '1.6b')],
               vel=0.3, last=dict(rel=0.8))
    F.ped_up.append(g.t(o + 8) - 0.03)
    a.mark('B ending bar (cut after it)', (o + 7, 1))


def sec_coda(a, F, o):
    a.section('coda', o, o + 4)
    F.chord(['Eb3', 'G3', 'C4'], (o, 1), '4b', 0.28)
    a.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8', (o, 1), vel=0.44, swing=True)
    a.n('felt', 'C4', (o + 1, 1), '1b', 0.4)                          # the settle from the fifth below ...
    F.chord(['F3', 'C4', 'F4'], (o + 1, 2), a.g.dur('3b', a.g.t(o + 1, 2)) + 2 * a.g.bar_s(o + 2), 0.36)   # ... open
    a.mark('the settle: F4 on an open fifth (no third)', (o + 1, 2))
    F.ped_up.append(a.g.t(o + 4) - 0.2)


# ---- cut-down / variant sections
def sec_statement_only(a, F, o):
    a.section('statement', o, o + 2)
    statement(a, F, o, (['Eb3', 'G3', 'Ab3', 'C4'], ['Eb3', 'G3', 'Ab3'], ['F3', 'Ab3', 'C4']),
              (['F2', 'C3'], ['F2', 'Eb2']))


def sec_vo_db(a, F, o):
    a.section('Dbmaj7 (felt alone)', o, o + 2)
    vo_window(a, F, o, 'Db3', lift=['Eb4'], v=(0.4, 0.37))   # the cut-down keeps batch 1's touch (no V.O. window)


def sec_cadence(a, F, o):
    a.section('cadence', o, o + 2)
    a.n('felt', 'C4', (o, 1), '1b', 0.4)
    F.chord(['F3', 'C4', 'F4'], (o, 2), a.g.dur('3b', a.g.t(o, 2)) + a.g.bar_s(o + 1), 0.36)
    a.mark('the settle: F4 on an open fifth (no third)', (o, 2))
    F.ped_up.append(a.g.t(o + 2) - 0.2)


def sec_motto(a, F, o):
    a.section('the Water Line', o, o + 2)
    F.chord(['Eb3', 'G3', 'C4'], (o, 1), '4b', 0.3)
    wl(a, (o, 1), vel=0.48)
    F.chord(['F3', 'C4'], (o + 1, 2), '3b', 0.3, mech=0.2)
    a.mark('the settle', (o + 1, 2))


def sec_straight(a, F, o):
    """STRAIGHT (s3 P01 sincere mode): the Water Line on cellos, straight, no chip, no swing, no piano."""
    a.section('STRAIGHT', o, o + 8)
    for k in (0, 4):
        ps = [('F3', (o + k, 1), '1b'), ('F3', (o + k, 2), '1b'), ('F3', (o + k, 3), '1b'), ('G3', (o + k, 4), '0.5b'),
              ('F3', (o + k, 4.5), '0.5b'), ('C3', (o + k + 1, 1), '1b'), ('F3', (o + k + 1, 2), '7b')]
        art.legato(a, 'vc', ps, vel=0.36 if k == 0 else 0.4, last=dict(rel=1.0))


SECTIONS = {'INTRO': sec_intro, 'A': sec_A, 'B': sec_B, 'A2': lambda a, F, o: sec_A(a, F, o, prime=True),
            'CODA': sec_coda, 'STATEMENT': sec_statement_only, 'VO_DB': sec_vo_db, 'CADENCE': sec_cadence,
            'MOTTO': sec_motto, 'STRAIGHT': sec_straight}


# ================================================================== the build
def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -9
    T['ubass'].gain_db = 0.0
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 11
    T['swish'].gain_db = 4
    T['jazz'].gain_db = 4
    T['harmon'].gain_db = -3.0        # fix 1 (balance): +2 dB (big band 2 % against P01's 5)
    T['harmon'].sends = {'hall': -8, 'room': -12}
    T['tri'].gain_db = -4
    T['lead'].gain_db = -9
    T['vibes'].gain_db = -5
    T['celesta'].gain_db = -10
    for k in ('vla', 'vc'):
        T[k].gain_db = 3              # fix 1 (balance): +2 dB, still sul tasto guide tones (orch 16 % against P01's 25)
        T[k].sends = {'hall': -8}
    return T


def build(variant=None):
    meta = dict(META)
    if variant:
        plan, bars, desc = VARIANTS[variant]
        meta.update(id=f'{ID}-{variant}', title=f"Water Line ({variant})", description=desc, album_lufs=-16.0,
                    vo_windows=[], no_third_windows=[], audition=[], motif_ids=['WATER_LINE'], room_sfx=[],
                    room_sfx_drop_stems=[])
        if variant == 'straight':
            meta.update(family='P01 (STRAIGHT)', tags=['straight', 'sincere', 'cello'],
                        motifs=['the Water Line x2 on cellos, straight'])
    else:
        plan, bars = FULL_PLAN, 30
    g = Grid(bpm=96, meter='4/4', bars=bars, swing=0.0 if variant == 'straight' else 1.0)
    a = Arr(g)
    T = tracks()
    F = Felt(a)
    for name, o in plan:
        SECTIONS[name](a, F, o)
    T['felt'].pedal = F.pedal_track(g.t(bars + 1) + 4.0)
    T['felt_lh'].pedal = T['felt'].pedal
    loop = g.span(3, 27) if not variant else None
    if not variant:
        t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
        meta['audition'] = [
            f'album 0-{t(3)} s: the intro -- the flat line and the nudge on the felt, the F4 held into bar 2 over '
            f'Dbmaj7: is it CALM (sure of himself), not sad?  Identifiable in 2 bars?',
            f'album {t(3)}-{t(5)} s and {t(7)}-{t(9)} s: the trio (upright two-feel, brushes) under the Water Line: '
            f'the swing reads human, the push chords on the swung and-of-4 are jazz, not lounge',
            f'album {t(5)}-{t(7)} s, {t(9)}-{t(11)} s, {t(21)}-{t(23)} s: the V.O. windows (felt alone) against a '
            f'stock voice: the lowercase V.O. sits on top; nothing moves under it',
            f'album {t(13)}-{t(17)} s: the one Harmon line -- "the night", never a Miles quote; the chip triangle '
            f'counter-line underneath: identity without toy',
            f'album {t(17)} s: the verdict F5 -> C6 on vibes + celesta: the Orb, an open fifth, no third, no F6 bell',
            f'loop-x3-preview.mp3 at {t(27) - t(3):.2f} s and {2 * (t(27) - t(3)):.2f} s: the seam b26 -> b3 '
            f'(the ending bar\'s held C7sus rolls into Fm9)',
            f'FIX 1 balance: album {t(7)}-{t(11)} s (A\'s 2nd statement, violas now with the cellos) and '
            f'{t(11)}-{t(19)} s (B: strings and Harmon each +2 dB) -- still "everything else asks leave to join"? '
            f'the strings the world far off, not a cushion under his feelings; the Harmon the night, not a feature',
        ]
    # the 5 s cut-down ends on the pedalled open fifth: fade it into the file end over its 1.2 s tail (>= 1 beat,
    # s6.6 item 3), as the music editor's fix_tails did by hand on the batch-1 file (fix 1: now in the score)
    fade = (g.t(bars + 1), g.t(bars + 1) + 1.2) if variant == '05s' else None
    return Score(meta['id'], g, T, a.notes, loop=loop, markers=a.markers, sections=a.sections, meta=meta,
                 tail_s=1.2 if variant == '05s' else 4.0, end_fade=fade)


if __name__ == '__main__':
    if '--variants' in sys.argv:
        sys.argv.remove('--variants')
        here = os.path.dirname(os.path.abspath(__file__))
        for v in (sys.argv[1:] or VARIANTS):
            if v.startswith('-'):
                continue
            sc = build(v)
            engine_build(sc, os.path.join(here, 'render'), sc.meta['id'], stems=False, loop=False)
    else:
        render_cli(build, __file__)
