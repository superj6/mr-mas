"""OUTRO A · "the closing session" -- TEMP credits reprise, Ep1 colour (DARK ROOM: felt upright, brushes trio, chip).
LOOKDEV ONLY. Not an OST track: nothing is written under audio/. It imports the OST engine read-only.
4.75 bars at 96 BPM = 285 frames = 11.875 s (second polish pass: the card holds longer so it can be read in one pass,
and the music keeps moving under it: the chord, then the title's quartal stack, then home on the pull-back).

  file 0.00-1.25 s  bar 0 (2-beat pickup)  the episode's button tail: F-C-G held (no third). The mix trims the first
                                          0.25 s so the file starts 1.0 s before o0, with the 24-frame stand-in.
  bar 1  o0-59    the act goes out; the pane opens, the header prints, the credits type
                                          THE KNEE WHOLE, once, on the cut: F F F F G Ab C F, swung eighths, felt lead
                                          with a 25 % chip double 8va, over upright bass (two-feel) and brushes; Fm(add9)
  bar 2  o60-119  the last credit; o85 the terms print
                                          Dbmaj7 -> C7sus(b9): the answer (G Ab C), and the F lands on 2.4
  bar 3  o120-179 the log holds (reading) the button chord F-C-G on 3.1, no third, celesta G5, the brushes sweeping on,
                                          a felt C4-G4 dyad on 3.2& (o145, the pointer prints), a felt G4 -> C5 lift on
                                          3.4 / 3.4&
  bar 4  o180-239 hold · pull-back       4.1 the title's quartal stack C-F-Bb-Eb (G on top) over a bass Bb1: the
                                          way home; 4.4 (o225, the pull-back to the room) the bass F2 and a felt
                                          C3-G3 fifth: home, no third; the room drone (SFX) comes in under it
  bar 5  o240-284 the room, the cursor, the moth, black
                                          the home fifth rings through the window closing; the pedal lifts on 5.2 as
                                          the cursor comes on: felt F5 + a 1-frame chip F6 glint = the cold open's f0
                                          sound (the outro's last note is the intro's first); it rings under the last
                                          blink and fades with the picture (o278-284). Out at 5.4.

Run (repo root; the engine's render goes to scratch, only the master WAV + cue sheet + piano roll are copied out):
  audio/.venv-theme/bin/python studio/src/dev/outro/a/audio/track.py --no-stems --no-loop --out <scratch>/music
"""
import os
import sys

sys.path.insert(0, '/home/jgon/project/art/mrmas/audio/ost')
from engine import *   # noqa: E402,F401,F403
from dataclasses import replace   # noqa: E402

ID = 'lookdev-outro-a-ep1'
PICKUP_BEATS = 2           # bar 0 holds 2 beats (1.25 s); the mix trims 0.25 s -> 1.0 s of stand-in

META = dict(
    id=ID,
    mm='(temp, lookdev)',
    title='Outro A: the closing session (Ep1 colour, temp)',
    family='P01',
    tone='the credits reprise in the dark room: the knee whole once on the cut, a downward answer, no third',
    usage='ET',
    tags=['lookdev', 'outro', 'credits reprise', 'temp'],
    scenes=['outro proposal A mock-up (out/lookdev/outro/a/)'],
    motifs=['THE KNEE whole (bar 1, felt + chip 8va)', 'the answer, the F on 2.4',
            'the button chord F-C-G (3.1)', "the title's quartal stack over Bb (4.1), home on F-C on the pull-back (4.4)",
            'the f0 sound, felt F5 + chip F6 glint (5.2, the cursor comes on)'],
    motif_ids=['KNEE'],
    key='F minor, open fifths, no third',
    composer='outro-A lookdev builder (temp)',
    knee_whole_ok=True,                   # the credits reprise is the one place the knee plays whole (OST s2.1)
    underscore_lufs=-16.0,                # featured (OUTRO-PROPOSALS s1.2)
    album_lufs=-16.0,
    audition=[],
)


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -10
    T['ubass'].gain_db = -1.0
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 10
    T['lead'].gain_db = 3                # the chip double ~10 dB under the felt (P01: <= -10 dB)
    T['celesta'].gain_db = -9
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=5, swing=1.0, pickup=PICKUP_BEATS)
    a = Arr(g)
    T = tracks()
    ped = []                                        # felt pedal re-catches (seconds)

    def lh(ps, at, dur, vel, roll=0.011, mech=0.36, lock=False, catch=True):
        t = g.at(at)
        a.ch('felt_lh', ps, t, dur, vel, roll=0.0 if lock else roll, lock=lock)
        if mech:
            a.n('felt_mech', 60, t, 0.1, mech)
        if catch:
            ped.append(t)

    # ---------------------------------------------------------------- bar 0: the button's tail (stand-in second)
    a.section('button tail (stand-in)', 0, 1)
    t0 = g.t(0, 3) + 0.25                          # = file 0.25 s = the trimmed file's first sample
    lh(['F3', 'C4', 'G4'], t0, g.t(1) - t0 - 0.05, 0.42, roll=0.0, mech=0.0, lock=True)

    # ---------------------------------------------------------------- bar 1: THE KNEE, whole, once, on the cut
    a.section('the knee (whole)', 1, 2)
    a.mark('o0 the cut: the act goes out; the knee, whole', (1, 1))
    a.line('felt', 'F4/8 F4/8 F4/8 F4/8 G4/8 Ab4/8 C5/8 F5/8', (1, 1), vel=0.5, swing=True)
    a.line('lead', 'F5/8 F5/8 F5/8 F5/8 G5/8 Ab5/8 C6/8 F6/8', (1, 1), vel=0.34, swing=True, duty=0.25, rel=0.05,
           sus=0.5, dec=0.12, lock=True)
    lh(['Eb3', 'G3', 'Ab3', 'C4'], (1, 1), '1.6b', 0.30)                 # Fm(add9), rootless (Ab = b3)
    lh(['Eb3', 'G3', 'Ab3'], (1, 2.5, 'sw'), '1/8', 0.2, mech=0.2)       # charleston
    lh(['F3', 'Ab3', 'C4'], (1, 4.5, 'sw'), '2.4b', 0.26)                 # the push into bar 2
    for p, at, d, v in [('F2', (1, 1), '1.9b', 0.36), ('C3', (1, 3), '1.9b', 0.33)]:
        a.n('ubass', p, at, d, v)
    Drums(a, 'brushes').play('''
        sweep[vel=0.5]: ~~~~~~~~
        tap[vel=0.36]:  ..g...o.
        kick[vel=0.26]: o.......
    ''', bars=(1, 3))

    # ---------------------------------------------------------------- bar 2: the answer; the F lands on 2.4
    a.section('the answer', 2, 3)
    lh(['Db3', 'F3', 'Ab3'], (2, 1), '1.9b', 0.28)                       # Dbmaj7 (C on top comes from the melody)
    a.line('felt', 'G4/8 Ab4/8 C5/4', (2, 1), vel=0.42, swing=True)      # the kink again, and the F withheld 2 beats
    lh(['G3', 'Bb3', 'Db4'], (2, 3), '1.9b', 0.26)                        # C7sus(b9) (no E)
    a.n('felt', 'F4', (2, 4), '1.5b', 0.46, lock=True)                    # settles from the fifth above (C5 -> F4)
    a.mark('2.4 the F lands', (2, 4))
    for p, at, d, v in [('Db2', (2, 1), '1.9b', 0.34), ('C2', (2, 3), '1.9b', 0.32)]:
        a.n('ubass', p, at, d, v)

    # ---------------------------------------------------------------- bar 3: the button chord, no third, the log holds
    a.section('button chord (the log holds)', 3, 4)
    a.mark('3.1 the button chord F-C-G', (3, 1))
    lh(['F3', 'C4', 'G4'], (3, 1), '3.8b', 0.34, lock=True)
    a.n('felt', 'C5', (3, 1), '2.4b', 0.26, lock=True)
    a.n('ubass', 'F2', (3, 1), '3.5b', 0.34)
    a.n('celesta', 'G5', (3, 1), '2b', 0.30, lock=True)                  # celesta alone (never F6: the SFX ding)
    # the brushes keep sweeping through the hold (the time never stops before the picture does); a felt dyad on
    # 3.2& (C4 G4, no third) keeps the chord speaking, and a small lift G4 -> C5 on 3.4 / 3.4& leans into bar 4
    Drums(a, 'brushes').play('''
        sweep[vel=0.32]: ~~~~~~~~
        tap[vel=0.24]:   ....o...
    ''', bars=(3, 4))
    a.ch('felt_lh', ['C4', 'G4'], g.at((3, 2.5, 'sw')), '1.2b', 0.2, roll=0.0, lock=True)
    a.n('felt', 'G4', (3, 4), '1/8', 0.24, lock=True)
    a.n('felt', 'C5', (3, 4.5, 'sw'), '0.9b', 0.26, lock=True)

    # ---------------------------------------------------------------- bar 4: the way home; the pull-back on 4.3&
    a.section("the title's stack, then home (pull-back)", 4, 5)
    a.mark("4.1 the title's quartal stack over Bb", (4, 1))
    a.n('ubass', 'Bb1', (4, 1), '2.3b', 0.32)
    lh(['C4', 'F4', 'Bb4', 'Eb5'], (4, 1), '2.3b', 0.26, roll=0.016)
    a.n('felt', 'G5', (4, 1), '2.3b', 0.22, lock=True)                   # G on top, as in the title
    Drums(a, 'brushes').play('''
        sweep[vel=0.26]: ~~~~~~..
        tap[vel=0.22]:   ......o.
    ''', bars=(4, 5))
    a.mark('4.4 (o225) the pull-back to the room: home on F-C, no third; the drone comes in (SFX)', (4, 4))
    # the bass takes the root and the felt a low open fifth C3-G3 (no felt F below F3: a felt F2 put its 5th
    # partial on A4 once, and the no-third reading caught it)
    a.n('ubass', 'F2', (4, 4), '2.6b', 0.34)
    lh(['C3', 'G3'], (4, 4), '2.6b', 0.24, roll=0.0, lock=True, mech=0.0)

    # ---------------------------------------------------------------- bar 5 (half): the cursor comes on; f0's sound
    a.section('the room, the cursor, the moth, black (drone, SFX)', 5, 6)
    a.mark('o255 5.2 the cursor comes on: felt F5 + chip F6 glint (= the cold open f0 sound)', (5, 2))
    a.n('felt', 'F5', (5, 2), '1.9b', 0.36, lock=True)
    a.n('lead', 'F6', (5, 2), '1f', 0.28, duty=0.125, att=0.001, dec=0.02, sus=0.3, rel=0.02, lock=True)

    # the pedal: re-caught on every LH chord; up just before 5.2 (clearing the home fifth), then down to catch the F5
    end = g.t(5, 4)                                                       # o285
    ev = [(0.0, False)]
    for t in sorted(set(round(x, 4) for x in ped)):
        ev += [(max(t - 0.035, 0.0), False), (t + 0.025, True)]
    ev += [(g.t(5, 2) - 0.05, False), (g.t(5, 2) + 0.02, True), (end + 2.0, False)]
    ev.sort()
    T['felt'].pedal = ev
    T['felt_lh'].pedal = ev

    META['no_third_windows'] = [(g.t(0, 3), g.t(1)), (g.t(3) + 0.05, end)]
    META['room_sfx'] = [dict(t0=g.t(4, 4), t1=end, sfx='room_drone')]
    META['audition'] = [
        f'{g.t(1):.2f}-{g.t(2):.2f} s: the knee whole on the cut, swung, chip 8va under the felt; the ONLY whole knee',
        f'{g.t(2, 4):.2f} s: the F lands on 2.4; then {g.t(3):.2f} s the button chord F-C-G, no third',
        f"{g.t(4):.2f} s: the title's quartal stack over Bb; {g.t(4, 4):.2f} s home on F-C as the picture "
        'pulls back to the room',
        f'{g.t(5, 2):.2f} s: the felt F5 + chip glint, the intro\'s f0 sound, as the cursor comes on; out by {end:.2f} s',
    ]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META,
                 tail_s=0.0, end_fade=(end - 0.30, end), length_s=end)


if __name__ == '__main__':
    render_cli(build, __file__)
