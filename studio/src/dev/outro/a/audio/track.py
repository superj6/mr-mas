"""OUTRO A · "the closing session" -- TEMP credits reprise, Ep1 colour (DARK ROOM: felt upright, brushes trio, chip).
LOOKDEV ONLY. Not an OST track: nothing is written under audio/. It imports the OST engine read-only.
3.5 bars at 96 BPM = 210 frames = 8.75 s (the polish pass: the knee starts on the cut, the music runs to the end).

  file 0.00-1.25 s  bar 0 (2-beat pickup)  the episode's button tail: F-C-G held (no third). The mix trims the first
                                          0.25 s so the file starts 1.0 s before o0, with the 24-frame stand-in.
  bar 1  o0-59    the act goes out; the pane opens and types
                                          THE KNEE WHOLE, once, on the cut: F F F F G Ab C F, swung eighths, felt lead
                                          with a 25 % chip double 8va, over upright bass (two-feel) and brushes; Fm(add9)
  bar 2  o60-119  the log holds            Dbmaj7 -> C7sus(b9): the answer (G Ab C), and the F lands on 2.4
  bar 3  o120-179 hold · pull-back · close the button chord F-C-G on 3.1, no third, celesta G5, the brushes sweeping on
                                          through the bar, a felt C4-G4 dyad on 3.2&; on 3.3 (the pull-back
                                          to the room) the bass re-plucks F2, the felt adds a low C3, and the room
                                          drone (SFX) comes in; the chord rings through the window closing (3.4+)
  bar 4  o180-209 the cursor, the moth     the pedal lifts on 4.1 as the cursor comes on: felt F5 + a 1-frame chip F6
                                          glint = the cold open's f0 sound (the outro's last note is the intro's
                                          first); the drone alone under the moth and the last blink. Out at 4.3 (o210).

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
            'the button chord F-C-G (3.1) + the bass root and a low C on the pull-back (3.3)',
            'the f0 sound, felt F5 + chip F6 glint (4.1, the cursor comes on)'],
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
    g = Grid(bpm=96, meter='4/4', bars=4, swing=1.0, pickup=PICKUP_BEATS)
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
    a.mark('o0 the cut: the act goes out, the band lights; the knee, whole', (1, 1))
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

    # ---------------------------------------------------------------- bar 3: the button chord, no third, rings through
    a.section('button chord (hold, pull-back, close)', 3, 4)
    a.mark('3.1 the button chord F-C-G', (3, 1))
    lh(['F3', 'C4', 'G4'], (3, 1), '3.8b', 0.34, lock=True)
    a.n('felt', 'C5', (3, 1), '3.8b', 0.26, lock=True)
    a.n('ubass', 'F2', (3, 1), '3.5b', 0.34)
    a.n('celesta', 'G5', (3, 1), '2b', 0.30, lock=True)                  # celesta alone (never F6: the SFX ding)
    # the brushes keep sweeping through the hold and the pull-back (the time never stops before the picture does),
    # one soft tap on 3.3 with the cut to the room; a felt dyad on 3.2& (C4 G4, no third) keeps the chord speaking
    Drums(a, 'brushes').play('''
        sweep[vel=0.32]: ~~~~~~~~
        tap[vel=0.26]:   ....o...
    ''', bars=(3, 4))
    a.ch('felt_lh', ['C4', 'G4'], g.at((3, 2.5, 'sw')), '1.2b', 0.2, roll=0.0, lock=True)
    a.mark('3.3 the pull-back to the room: the low fifth, the drone comes in (SFX)', (3, 3))
    # the bass re-plucks the root and the felt adds a low C3 under the chord, on the same pedal (a felt F2 here put
    # its 5th partial on A4, and the no-third reading caught it)
    a.n('ubass', 'F2', (3, 3), '1.9b', 0.34)
    lh(['C3'], (3, 3), '1.9b', 0.26, lock=True, mech=0.0, catch=False)

    # ---------------------------------------------------------------- bar 4 (half): the cursor comes on; f0's sound
    a.section('the cursor, the moth (drone alone, SFX)', 4, 5)
    a.mark('o180 4.1 the cursor comes on: felt F5 + chip F6 glint (= the cold open f0 sound)', (4, 1))
    a.n('felt', 'F5', (4, 1), '0.9b', 0.36, lock=True)
    a.n('lead', 'F6', (4, 1), '1f', 0.28, duty=0.125, att=0.001, dec=0.02, sus=0.3, rel=0.02, lock=True)

    # the pedal: re-caught on every LH chord, up just before 4.1 (the glint and the drone stand alone)
    end = g.t(4, 3)                                                       # o210
    ev = [(0.0, False)]
    for t in sorted(set(round(x, 4) for x in ped)):
        ev += [(max(t - 0.035, 0.0), False), (t + 0.025, True)]
    ev += [(g.t(4) - 0.05, False), (end + 2.0, False)]
    ev.sort()
    T['felt'].pedal = ev
    T['felt_lh'].pedal = ev

    META['no_third_windows'] = [(g.t(0, 3), g.t(1)), (g.t(3) + 0.05, end)]
    META['room_sfx'] = [dict(t0=(3, 3), t1=(4, 3), sfx='room_drone')]
    META['audition'] = [
        f'{g.t(1):.2f}-{g.t(2):.2f} s: the knee whole on the cut, swung, chip 8va under the felt; the ONLY whole knee',
        f'{g.t(2, 4):.2f} s: the F lands on 2.4; then {g.t(3):.2f} s the button chord F-C-G, no third',
        f'{g.t(3, 3):.2f} s: the bass root and a low C under it as the picture pulls back to the room',
        f'{g.t(4):.2f} s: the felt F5 + chip glint, the intro\'s f0 sound, as the cursor comes on; out by {end:.2f} s',
    ]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META,
                 tail_s=0.0, end_fade=(end - 0.30, end), length_s=end)


if __name__ == '__main__':
    render_cli(build, __file__)
