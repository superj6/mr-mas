"""OUTRO E · "file closed" -- TEMP credits reprise in Ep1's colour (DARK ROOM: felt upright, the brushes trio, chip).
LOOKDEV ONLY. Not an OST track: it imports the OST engine read-only and writes nothing under audio/.
(show/production/OUTRO-PROPOSALS.md s6 and s9; the timing is studio/src/dev/outro/e/timeline.ts)

The grid is the outro's own: bar 1 beat 1 = o0 (the cut to the file). 96 BPM, 15 frames a beat, 60 a bar.
POLISH PASS: the outro is 3 bars (o0-o179, 7.5 s); the click is on 3.3 (o150); Ep1's moth lands on 4.1 (o180) and
the mock-up ends on o199. The black tail is gone.

  bar 0, beats 3-4   file 0.00-1.25 s  the stand-in (the episode's last frame). The button's tail: F-C-G, no third,
                                       held soft. The mix trims the first 0.25 s, so the WAV starts 1.0 s (24 f)
                                       before o0, with the 24-frame stand-in.
  bar 1   o0-59      the file          THE KNEE WHOLE, once: F F F F G Ab C F, swung eighths, felt lead with a
                                       chip double 8va (~10 dB under), over the open fifth (upright bass F2 / C3
                                       two-feel, felt LH F3+C4), brushes. Each note lights one line of the credits
                                       block (timeline.ts KNEE). The only whole knee in the episode.
  bar 2   o60-119    hold for reading  2.1 the button chord F-C-G, no third, held (bass F2, felt C3 G3 C4).
                                       2.3-2.4 the colour answers once: the Water Line's own cadence, C4 -> F4
                                       (the fourth that settles). Brushes swirl once.
  bar 3   o120-179   the pointer; the click
                                       3.1 the bass re-strikes F2 under a soft open fifth (F3 C4), one brush
                                       swirl; the pointer's travel has no sound of its own. 3.3 (o150) the click
                                       is SFX (post_click, in the mix); with it the felt F5 + a 1-frame chip F6
                                       glint = the cold open's f0 sound. The dampers come down under the click, so
                                       only the F5 rings on. A plain week ends on o179 (the mix fades it).
  4.1-   o180-199    Ep1: the moth     the F5's decay alone; the moth lands on 4.1 with nothing on the downbeat
                                       (it lands in silence); faded to zero by o199.

Run (repo root). The engine's files go to scratch; tools/mix.py takes the album master from there:
  audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/track.py --no-stems --no-loop --out <scratch>/music
"""
import sys

sys.path.insert(0, '/home/jgon/project/art/mrmas/audio/ost')
from engine import *   # noqa: E402,F401,F403
from dataclasses import replace   # noqa: E402

ID = 'lookdev-outro-e-ep1'
PICKUP_BEATS = 2           # bar 0 holds 2 beats (1.25 s); the mix trims 0.25 s -> 1.0 s of stand-in
TRIM_S = 0.25

META = dict(
    id=ID,
    mm='(temp, lookdev)',
    title='Outro E: file closed (Ep1 colour, temp)',
    family='P01',
    tone='the credits reprise, shortest form: the knee whole once, the button chord, the Water Line settle, '
         'the f0 sound on the click; no third',
    usage='ET',
    tags=['lookdev', 'outro', 'credits reprise', 'temp'],
    scenes=['outro proposal E mock-up (out/lookdev/outro/e/)'],
    motifs=['THE KNEE whole (bar 1, felt + chip 8va)', 'the button chord F-C-G (2.1)',
            'the Water Line cadence C4 -> F4 (2.3)', 'the f0 sound, felt F5 + chip F6 glint (3.1)'],
    motif_ids=['KNEE'],
    key='F minor, open fifths, no third',
    composer='outro-E lookdev builder (temp)',
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
    T['lead'].gain_db = 3                 # the chip double ~10 dB under the felt (P01: <= -10 dB)
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=4, swing=1.0, pickup=PICKUP_BEATS)
    a = Arr(g)
    T = tracks()
    ped = []                              # felt pedal re-catches (seconds)

    def lh(ps, at, dur, vel, roll=0.011, mech=0.36, lock=False):
        t = g.at(at)
        a.ch('felt_lh', ps, t, dur, vel, roll=0.0 if lock else roll, lock=lock)
        if mech:
            a.n('felt_mech', 60, t, 0.1, mech)
        ped.append(t)

    # ---------------------------------------------------------------- bar 0: the button's tail (the stand-in)
    a.section('button tail (stand-in)', 0, 1)
    t0 = g.t(0, 3) + TRIM_S                                              # the trimmed file's first sample
    lh(['F3', 'C4', 'G4'], t0, g.t(1) - t0 - 0.06, 0.34, roll=0.0, mech=0.0, lock=True)
    a.n('ubass', 'F2', t0, g.t(1) - t0 - 0.08, 0.26)

    # ---------------------------------------------------------------- bar 1: THE KNEE, whole, once
    a.section('the knee (whole)', 1, 2)
    a.mark('o0 cut to the file: the knee, whole', (1, 1))
    a.line('felt', 'F4/8 F4/8 F4/8 F4/8 G4/8 Ab4/8 C5/8 F5/8', (1, 1), vel=0.5, swing=True)
    a.line('lead', 'F5/8 F5/8 F5/8 F5/8 G5/8 Ab5/8 C6/8 F6/8', (1, 1), vel=0.34, swing=True, duty=0.25, rel=0.05,
           sus=0.5, dec=0.12, lock=True)
    lh(['F3', 'C4'], (1, 1), '1.8b', 0.30)                               # the open fifth
    lh(['F3', 'C4', 'G4'], (1, 3), '1.8b', 0.24, mech=0.2)               # + the ninth, still no third
    for p, at, d, v in [('F2', (1, 1), '1.9b', 0.36), ('C3', (1, 3), '1.9b', 0.32)]:
        a.n('ubass', p, at, d, v)
    Drums(a, 'brushes').play('''
        sweep[vel=0.46]: ~~~~~~~~
        tap[vel=0.34]:   ..g...o.
        kick[vel=0.24]:  o.......
    ''', bars=(1, 2))

    # ---------------------------------------------------------------- bar 2: the button chord; the answer
    a.section('button chord (hold, the pointer)', 2, 3)
    a.mark('2.1 the button chord F-C-G', (2, 1))
    a.n('ubass', 'F2', (2, 1), '3.4b', 0.34)
    lh(['C3', 'G3', 'C4'], (2, 1), '3.6b', 0.32, lock=True)
    a.mark('2.3 the Water Line cadence C4 -> F4', (2, 3))
    a.n('felt', 'C4', (2, 3), '1b', 0.40)
    a.n('felt', 'F4', (2, 4), '1.7b', 0.42)
    Drums(a, 'brushes').play('swirl[vel=0.30]: x.......', bars=(2, 3))

    # ---------------------------------------------------------------- bar 3: the pointer, then the click on 3.3
    a.section('the pointer; the click on 3.3; (Ep1) the moth', 3, 5)
    a.mark('o120 3.1 the bass re-strikes F2 under a soft open fifth; the pointer moves', (3, 1))
    a.n('ubass', 'F2', (3, 1), '1.9b', 0.30)
    lh(['F3', 'C4'], (3, 1), '1.9b', 0.22, mech=0.2)
    Drums(a, 'brushes').play('swirl[vel=0.24]: x.......', bars=(3, 4))
    a.mark('o150 3.3 the click: felt F5 + chip F6 glint (= the cold open f0 sound)', (3, 3))
    a.n('felt', 'F5', (3, 3), '6b', 0.34, lock=True)
    a.n('lead', 'F6', (3, 3), '1f', 0.28, duty=0.125, att=0.001, dec=0.02, sus=0.3, rel=0.02, lock=True)

    # the pedal: re-caught on every LH chord; up just before 3.3 (the dampers come down under the click), then down
    # again for the F5 alone, so only the F5 rings on
    ev = [(0.0, False)]
    for t in sorted(set(round(x, 4) for x in ped)):
        ev += [(max(t - 0.035, 0.0), False), (t + 0.025, True)]
    t33 = g.t(3, 3)
    ev += [(t33 - 0.06, False), (t33 + 0.03, True), (g.t(5) + 2.0, False)]
    ev.sort()
    T['felt'].pedal = ev
    T['felt_lh'].pedal = ev

    end = g.t(4) + 20 / 24                                                # o200: the Ep1 mock-up's last frame + 1
    META['no_third_windows'] = [(t0, g.t(1)), (g.t(2) + 0.05, end)]
    META['sfx_slots'] = [dict(at=(3, 3), sfx='post_click')]
    META['audition'] = [
        f'{g.t(1):.2f}-{g.t(2):.2f} s: the knee whole, swung, chip 8va under the felt; the ONLY whole knee',
        f'{g.t(2):.2f} s: the button chord F-C-G, no third; {g.t(2, 3):.2f} s the Water Line settle C4 -> F4',
        f'{g.t(3):.2f} s: the bass re-strike under the pointer; {g.t(3, 3):.2f} s the click (SFX) with the felt F5 + '
        f'chip glint, the intro\'s f0 sound',
        f'{g.t(4):.2f} s: Ep1, the moth lands in silence; out by {end:.2f} s (a plain week is faded by {g.t(4):.2f} s)',
    ]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META,
                 tail_s=0.0, end_fade=(end - 0.5, end), length_s=end)


if __name__ == '__main__':
    render_cli(build, __file__)
