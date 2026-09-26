"""ENGINE DEMO (20 s) -- exercises every OST-engine tool in one short cue.  Not a show cue.
It follows the OST-BIBLE house rules, so composers can copy from it.

  bar 1        cold open        felt piano, clean (his account is cleaner than the truth): the Water Line's
                                first bar (the flat line and the nudge), a 50 % chip square on the nudge ONLY;
                                a third-free quartal left hand; sub pressure (dread, 'none' voicing)
  bars 2-5     LOOP (seamless)  the trio: rootless charleston comping (laid-back groove), walking bass
                                (upright + contrabass pizz), brushes (drum DSL); a pizz pluck, a legato violin
                                counter-line, a viola / cello tremolo swell; knee FRAGMENTS only: the flat line
                                (chip, bar 3) and the kink left hanging (chip, bar 5); a chip arpeggio; GLYPH as
                                token grains (patterns.tokens) + a quantised glyph texture; the Ache for one bar
                                (glass, bar 4); a sub-pressure bed that crossfades over the seam; one brass kick
                                (bar 5, the swung and-of-2) with a stab-fronted lead-trumpet fall; the C7 as an
                                upper-structure triad (Ab/C7); an in-world TV playing a trap beat (808 kick +
                                ratcheted hats through era.futz('tv') + a VHS tape: diegetic source only)
  bar 6 (3/4)  tag, ritardando  84 -> 64 BPM; horn swell p->f and strings on F9sus4 (no third), chip noise
                                riser -- and a D6-style HARD STOP on the and-of-3 (every stem and tail to zero)
  bar 7 (2/4)  title hit        the title chord (no third), sub drop C2 -> F1, chip F6, a restrained impact

Grid: 84.09 BPM (frame-locked: the 16-beat loop is exactly 274 frames), swing 0.55 (a library cue; show cues
use the house swing 1.0).
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403

BPM = frame_lock_bpm(84, 16)

META = dict(
    id='_demo',
    mm='',
    title='Engine Demo (20 s)',
    family='test',
    tone='engine test: cold open -> trio loop -> brass-and-strings tag -> hard stop -> title hit',
    usage='BI',
    tags=['demo', 'test'],
    scenes=['none (engine test cue)'],
    motifs=['Water Line bar 1 (felt, bar 1)', 'flat line (chip, bar 3)', 'kink (chip, bar 5)', 'the Ache (bar 4)',
            'tokens: grains', 'title chord F9sus4 (no third, bar 7)'],
    motif_ids=['FLAT_LINE', 'KINK'],
    key='F dorian / Fm9',
    composer='OST engine demo',
    diegetic_tracks=['h808'],           # the in-world TV (bars 4-5)
    audition=[
        'loop-x3-preview.mp3 at 11.42 s and 22.83 s (the seams): no click, no level dip; the sub bed crossfades; '
        'the walking bass leads back into F',
        'album 12.55 s, the bar-5 brass kick on the swung and-of-2: a section, not a sampler chord; the lead '
        'trumpet fall short and idiomatic (big band), never a sad-trombone joke',
        'album 8.56-14.27 s: the in-world TV trap beat -- clearly a small speaker in the room, not score',
        'album 15.9-16.72 s: the hard stop -- true silence (tails cut), then the title hit lands at 16.72 s; '
        'open and suspended, no major/minor colour',
        'album 0-2.85 s: the Water Line fragment on clean felt, the chip square only on the nudge (G4)',
        'album 14.27-15.9 s: the ritardando should bend, not step',
    ],
)


def build():
    g = Grid(bpm=BPM, meter='4/4', meters=[(6, '3/4'), (7, '2/4')], tempo=[(6, BPM), (7, 64.0, 'ramp')], bars=7,
             swing=0.55)
    a = Arr(g)
    T = palette()
    # the in-world TV: its 808 kit through a VHS tape and a small speaker (diegetic source only)
    tv = lambda b: futz(Era('vhs', seed=5, hiss_db=-66)(b), 'tv')          # noqa: E731
    for k in ('k808', 'h808'):
        T[k].post = tv
        T[k].sends = {'room': -8}
        T[k].pan = 0.55
    T['k808'].gain_db = -8
    T['h808'].gain_db = -12
    T['glyph'].gain_db = -6
    T['tex'].gain_db = -4
    T['brush'].gain_db = 12
    T['glasspad'].gain_db = -10

    # ------------------------------------------------ bar 1: cold open (clean felt: Mas's own account)
    a.section('cold open', 1, 2)
    a.n('tex', 'F1', (1, 1), g.bar_s(1) + 0.9, 0.55, kind='dread', voicing='none', intensity=0.3, fade_in=0.6,
        fade_out=1.0)
    a.ch('felt', voice('F9sus4', 'quartal'), (1, 1), '4b', 0.34)                 # F Bb Eb G: no third
    water_bar1 = MOTIFS['WATER_LINE']['line'].split('|')[0]                     # F4 F4 F4 G4-sw F4
    a.line('felt', water_bar1, (1, 1), vel=0.42, swing=True)
    a.line('lead', MOTIFS['WATER_LINE']['nudge_double'], (1, 1), vel=0.34, swing=True, duty=0.5, rel=0.06)

    # ------------------------------------------------ bars 2-5: the loop body
    a.section('loop', 2, 6)
    prog = progression(g, [(2, 'Fm9'), (3, 'Dbmaj7#11'), (4, 'Bbm9'), (5, 'C7#9b13'), (6, 'F9sus4')])
    comp(a, 'felt', prog, style='charleston', kind='rootless_a', around='C4', vel=0.44, bars=(2, 5))
    for bt in (1.0, 2.5):                         # bar 5: C7 as Ab/C7 (b13, root, #9 over the E-Bb tritone)
        a.ch('felt', ust('C', 'bVI', low='E3'), (5, bt, 'sw'), '1b' if bt == 1.0 else '1/8', 0.44, roll=0.006)
    arc = phrase_arc(g.t(2), g.t(6), low=0.52, peak=0.66, peak_at=0.6)
    a.notes = apply_vel(a.notes, arc, insts=['felt'], ref=0.6)
    a.notes = groove(a.notes, g, 'laidback', insts=['felt', 'ubass', 'cb_pizz'], amount=0.7)
    a.notes = accent(a.notes, g, {1: 1.06, 2: 0.95, 3: 1.02, 4: 0.95}, insts=['felt'])
    walking_bass(a, 'ubass', prog, bars=(2, 6), layer='cb_pizz', vel=0.72, seed=4)
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...x.
        kick:  o...o...
        hatf:  ..x...x.
    ''', bars=(2, 5))
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...xX
        slap:  .......g
        kick:  o...o...
        hatf:  ..x...x.
    ''', bars=(5, 6))
    art.pizz(a, 'vla', ['F3', 'C4'], (2, 1), vel=0.55)
    art.pizz(a, 'vc', 'F2', (2, 1), vel=0.6)
    art.legato(a, 'vln1', [('C5', (3, 1), '1.5b'), ('Bb4', (3, 2.5, 'sw'), '0.5b'), ('Ab4', (3, 3), '2b'),
                           ('G4', (4, 1), '3b'), ('Ab4', (4, 4), '1b'), ('Bb4', (5, 1), '2b'), ('G4', (5, 3), '1b'),
                           ('E4', (5, 4), '0.9b')], vel=0.5, last=dict(rel=0.25))
    art.trem(a, 'vla', ['E4', 'Bb4'], (5, 1), '1bar', vel=0.46, swell=('pp', 'mp'))
    art.trem(a, 'vc', ['C3'], (5, 1), '1bar', vel=0.46, swell=('pp', 'mp'))
    # knee fragments only (the whole knee is for the main title and the credits)
    place_motif(a, 'lead', 'FLAT_LINE', (3, 1), vel=0.5, swing=True, duty=0.125, rel=0.04, sus=0.5)
    place_motif(a, 'lead', 'KINK', (5, 3), vel=0.55, swing=True, duty=0.25, rel=0.05)
    arp(a, 'arp', None, bars=(4, 5), rate=0.25, pattern='updown', low='F5', vel=0.34, follow=prog, swing=0.0,
        accent=(1.0, 0.7, 0.85, 0.7), duty=0.25, rel=0.02, sus=0.4, dec=0.05)
    # the machine, politely: token grains on a 12.5 % chip (straight, 0 ms) + a quantised glyph texture
    tokens(a, 'lead2', bars=(2, 6), stage='grains', seed=2, vel=0.4, duty=0.125, rel=0.03)
    a.n('glyph', 60, (2, 1), '4bar', 0.5, density=0.8, seed=11, quantize_s=g.dur('1/16', (2, 1)))
    # the Ache: one bar of glass inside the warm cue, then it leaves
    a.ch('glasspad', MOTIFS['ACHE']['chord'][2:], (4, 1), '1bar', 0.5)
    # a sub-pressure bed a little longer than the loop, so the fold crossfades it over the seam
    a.n('tex', 'F1', (2, 1), g.dur('4bar', (2, 1)) + 1.4, 0.42, kind='dread', voicing='none', intensity=0.2,
        fade_in=1.4, fade_out=1.4)
    # the in-world TV (diegetic source, bars 4-5): an 808 kick and ratcheted trap hats
    Drums(a, '808').play('''
        kick[pitch=F1]: x.......x.x.....
        hat[swing=0]:   x.x.x.x.x.x.3.x.
    ''', bars=(4, 5))
    Drums(a, '808').play('''
        kick[pitch=F1]: x.......x.......
        hat[swing=0]:   x.x.x.x.x4x.x.x.
    ''', bars=(5, 6))
    # the one brass accent: a kick on the swung and-of-2 (C7#9b13), the lead trumpet falls off
    kick = (5, 2.5, 'sw')
    a.mark('brass kick', kick)
    art.stab(a, 'tpt', ['Eb5', 'Bb4'], kick, vel=0.74, length=0.16)
    art.stab(a, 'tbn', ['E4', 'Bb3', 'E3'], kick, vel=0.72, length=0.18)
    art.fall(a, 'tpt', 'Ab5', kick, 0.5, depth=4, hold=0.34, vel=0.8, front='stab')

    # ------------------------------------------------ bar 6 (3/4, ritardando): the tag, then the hard stop
    a.section('tag', 6, 7)
    art.swell(a, 'hn', ['F3', 'C4', 'Eb4', 'G4'], (6, 1), g.bar_s(6) + 0.1, 'p', 'f', shape='exp')
    for inst, ps in [('cb', ['F1']), ('vc', ['F2', 'C3']), ('vla', ['Bb3', 'Eb4']), ('vln2', ['G4', 'C5']),
                     ('vln1', ['F5'])]:
        art.swell(a, inst, ps, (6, 1), g.bar_s(6) + 0.08, 'pp', 'mf', shape='s')
    a.ch('felt', voice('F9sus4', 'quartal', n=5), (6, 1), '3b', 0.42, roll=0.012)
    a.n('noisesweep', 60, (6, 1), g.bar_s(6), 0.42, c0=2500, c1=22000, l0=0.1)
    a.n('tex', 'F1', (6, 1), g.bar_s(6) + g.bar_s(7) + 0.6, 0.5, kind='dread', intensity=0.5, fade_in=0.4,
        fade_out=1.2)
    stop = g.t(6, 3.5)
    a.mark('hard stop', stop)

    # ------------------------------------------------ bar 7: the title hit (no third)
    a.section('title', 7, 8)
    a.mark('title hit', (7, 1))
    H = g.t(7)
    ring = g.bar_s(7) + 0.4
    decay = [(0, 1.0), (0.35, 0.72), (ring, 0.35)]
    for inst, ps in [('cb', ['F1']), ('vc', ['F2', 'C3']), ('vla', ['F3', 'Bb3']), ('vln2', ['Eb4', 'G4']),
                     ('vln1', ['C5', 'F5', 'G5'])]:
        art.sus(a, inst, ps, H, ring, vel=0.72, lock=True, env=decay, rel=0.6)
    art.swell(a, 'hn', ['C4', 'F4', 'Bb4', 'Eb5'], H, ring, 'f', 'mp', shape='log', lock=True, rel=0.6)
    a.ch('grand', ['F1', 'C2', 'F2', 'Bb2'], H, ring, 0.7, lock=True)
    a.ch('felt', ['C4', 'F4', 'G4', 'C5'], H, ring, 0.46, lock=True)
    a.n('lead', 'F6', H, ring, 0.55, duty=0.25, vib=14, vib_delay=0.3, rel=0.5, sus=0.6, dec=0.8, lock=True)
    a.n('tri', 'F3', H, ring, 0.55, rel=0.4, sus=0.7, lock=True)
    a.n('sub', 'C2', H, ring, 0.9, decay=1.6, punch=4, glide_to=nm('F1'), glide_s=1.2, lock=True)
    a.n('impact', 'F1', H, 0.1, 0.42, tail=2.5, noise=0.35, lock=True)
    a.n('suscym', 60, H, 0.2, 0.35, lock=True)

    META['no_third_windows'] = [(H + 0.1, g.t(8))]
    stem_post = {'chip': Era('reel', hiss_db=-100, seed=1)}          # light T2 colour on the chip (allowed)
    stem_auto = {'synth': [(0.0, 0.0), (g.t(6), 0.0), (g.t(7), 2.0), (g.t(8), 0.0)]}   # lift the dread into the hit
    return Score(META['id'], g, T, a.notes, loop=g.span(2, 6), markers=a.markers, sections=a.sections,
                 stem_post=stem_post, stem_auto=stem_auto, mutes=[(stop, H)], tail_s=2.0, meta=META)


if __name__ == '__main__':
    render_cli(build, __file__)
