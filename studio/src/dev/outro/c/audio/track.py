"""OUTRO C · "after hours: DAYS SINCE" -- TEMP credits reprise in Ep1's colour (felt upright, brushes trio, chip).
LOOKDEV ONLY, not an OST track. It imports the OST engine READ-ONLY and writes nothing under audio/: the render goes
to --out, and the sampler's calibration cache is redirected to a copy inside that folder (sampler.CACHE).

96 BPM, 60 frames a bar. Fourth pass: the outro is 192 frames (8.0 s): 3 bars and the button chord's ring-out
(to o190). The file has a 2-beat pickup (bar 0, 1.25 s); mix.py trims its first 0.25 s, so the WAV it writes starts
exactly with the mock-up's 24-frame stand-in (composition f0) and o0 = 1.000 s.

  bar 0  stand-in (the dark room)  the episode's last chord ringing out: felt F3-C4-G4, no third (over room_drone, SFX)
  bar 1  o0-59   the wall, lit sign    THE FLAT LINE: felt F on every beat, each in another register (F4 F5 F3 F2),
                                       over a soft score drone F2+C3 (the sign's F2 tube hum is the SFX under it)
  bar 2  o60-119 the hand, the plate   THE KNEE WHOLE, once: F F F F G Ab C F, swung, felt lead + chip 8va double
                                       (25 % pulse, ~10 dB under); upright bass two-feel, brushes. The knee's flat
                                       half is still the quiet read (the hand comes in on 2.2+, o84); the leap lands
                                       with the plate: G on 2.3 (o90, the fingers reach last night's 5), C on 2.4
                                       (o105, the 5 clear of the slot: 36). Fm9 on 2.1; the push on 2.4& is
                                       Dbmaj7(#11) over Db, so the knee's last F (o112, the 5 let go over the box)
                                       sits on Db's third and falls to...
  bar 3  o120-    house light down     THE BUTTON CHORD F-C-G on 3.1, no third, with one chip glint: the hand has
                                       gone, the timer throws. It rings through the sign going out (3.3, o150; the
                                       SFX own that: the hum stops) and the moth's landing (3.4, o165); nothing
                                       comments on either. Faded to zero by o190 (the picture's dip ends there)

Run (repo root):
  PYTHONDONTWRITEBYTECODE=1 audio/.venv-theme/bin/python studio/src/dev/outro/c/audio/track.py \
      --no-stems --no-loop --out <scratch>/music
"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import os
import shutil
import sys

sys.path.insert(0, os.path.join(REPO, 'audio/ost'))
sys.dont_write_bytecode = True
from engine import *   # noqa: E402,F401,F403
import engine.sampler as _sampler   # noqa: E402
from dataclasses import replace   # noqa: E402


def _redirect_cache():
    """Point the sampler's calibration cache at a private copy (never write audio/ost/cache)."""
    out = None
    if '--out' in sys.argv:
        out = sys.argv[sys.argv.index('--out') + 1]
    if not out:
        raise SystemExit('track.py: pass --out <scratch dir> (nothing may be written under audio/)')
    cdir = os.path.join(os.path.abspath(out), '_cache')
    os.makedirs(cdir, exist_ok=True)
    src = os.path.join(_sampler.CACHE, 'calib.json')
    dst = os.path.join(cdir, 'calib.json')
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copyfile(src, dst)
    _sampler.CACHE = cdir


ID = 'lookdev-outro-c-ep1'
PICKUP_BEATS = 2

META = dict(
    id=ID,
    mm='(temp, lookdev)',
    title='Outro C: after hours, DAYS SINCE (Ep1 colour, temp)',
    family='P01',
    tone='the credits reprise in the empty lobby: the flat line, the knee whole once under the plates, the button',
    usage='ET',
    tags=['lookdev', 'outro', 'credits reprise', 'temp'],
    scenes=['outro proposal C mock-up (out/lookdev/outro/c/)'],
    motifs=['the flat line (bar 1, four registers)', 'THE KNEE whole (bar 2, felt + chip 8va)',
            'the Dbmaj7(#11) push (2.4&)', 'the button chord F-C-G (3.1)'],
    motif_ids=['KNEE'],
    key='F minor, open fifths, no third',
    composer='outro-C lookdev builder (temp)',
    knee_whole_ok=True,                    # the credits reprise is the one place the knee plays whole (OST s2.1)
    underscore_lufs=-16.0,                 # featured (OUTRO-PROPOSALS s1.2)
    album_lufs=-16.0,
    audition=[],
)


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh', gain_db=-2.0)
    T['felt_mech'].gain_db = -11
    T['ubass'].gain_db = -1.5
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 9
    T['lead'].gain_db = 2                   # the chip double sits ~10 dB under the felt (P01: <= -10 dB)
    T['lead2'].gain_db = -1                 # the kink echo
    T['drone'].gain_db = -14
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=3, swing=1.0, pickup=PICKUP_BEATS)
    a = Arr(g)
    T = tracks()
    ped = []

    def lh(ps, at, dur, vel, roll=0.012, mech=0.3, lock=False):
        t = g.at(at)
        a.ch('felt_lh', ps, t, dur, vel, roll=0.0 if lock else roll, lock=lock)
        if mech:
            a.n('felt_mech', 60, t, 0.1, mech)
        ped.append(t)

    # ------------------------------------------------------------ bar 0: the stand-in second (the episode's last chord)
    a.section('stand-in tail', 0, 1)
    t0 = 0.25                                                        # = the trimmed file's first sample
    lh(['F3', 'C4', 'G4'], t0, g.t(1) - t0 - 0.06, 0.30, roll=0.0, mech=0.0, lock=True)

    # ------------------------------------------------------------ bar 1: the flat line, four registers, over a drone
    a.section('flat line (the wall)', 1, 2)
    a.mark('o0 cut to the lobby', (1, 1))
    for p, bt, v in [('F4', 1, 0.44), ('F5', 2, 0.34), ('F3', 3, 0.40), ('F2', 4, 0.36)]:
        a.n('felt', p, (1, bt), '0.9b', v)
    a.n('felt_mech', 60, (1, 1), 0.1, 0.25)
    a.n('drone', 'F2', (1, 1), '6b', 0.34, att=0.4, rel=0.9)
    a.n('drone', 'C3', (1, 1), '6b', 0.26, att=0.6, rel=0.9)
    Drums(a, 'brushes').play('swirl[vel=0.22]: ......~~', bars=(1, 2))   # the trio breathes in on 1.4

    # ------------------------------------------------------------ bar 2: THE KNEE, whole, once (the plates)
    a.section('the knee (whole): the hand turns 35 to 36', 2, 3)
    a.mark('o60 the knee, whole (still the quiet read; the hand comes in at o84)', (2, 1))
    a.mark('o90 G: the fingers reach last night\'s 5', (2, 3))
    a.mark('o105 C: the 5 clear of the slot: 36', (2, 4))
    a.line('felt', 'F4/8 F4/8 F4/8 F4/8 G4/8 Ab4/8 C5/8 F5/8', (2, 1), vel=0.5, swing=True)
    a.line('lead', 'F5/8 F5/8 F5/8 F5/8 G5/8 Ab5/8 C6/8 F6/8', (2, 1), vel=0.32, swing=True, duty=0.25, rel=0.05,
           sus=0.5, dec=0.12, lock=True)
    for n in a.notes:                                                  # the G and the C land ON the plate: no drift
        if n.inst == 'felt' and min(abs(n.start - g.t(2, 3)), abs(n.start - g.t(2, 4))) < 1e-6:
            n.lock = True
    lh(['G3', 'Ab3', 'C4', 'Eb4'], (2, 1), '1.8b', 0.28)             # Fm9, rootless (9 b3 5 b7)
    lh(['G3', 'Ab3', 'C4'], (2, 2.5, 'sw'), '1/8', 0.18, mech=0.18)    # a charleston echo
    # the push into bar 3: Dbmaj7(#11) (F Ab C G over Db), cut 40 ms before 3.1 so no Ab rings into the button
    t_push = g.at((2, 4.5, 'sw'))
    d_push = g.t(3) - t_push - 0.04
    lh(['F3', 'Ab3', 'C4', 'G4'], (2, 4.5, 'sw'), d_push, 0.24)
    for p, at, d, v in [('F2', (2, 1), '1.9b', 0.38), ('C3', (2, 3), '1.4b', 0.34), ('Db2', (2, 4.5, 'sw'), d_push, 0.30)]:
        a.n('ubass', p, at, d, v)
    Drums(a, 'brushes').play('''
        sweep[vel=0.48]: ~~~~~~~~
        tap[vel=0.34]:   ..g...o.
        kick[vel=0.24]:  o.......
    ''', bars=(2, 3))

    # ------------------------------------------------------------ bar 3: the button chord, no third
    a.section('button chord (the hand gone, house light down; the sign out; the moth lands)', 3, 4)
    a.mark('o120 the button chord F-C-G (3.1): house light down', (3, 1))
    # (no markers at 3.3, the sign going out, or 3.4, the moth landing: the score plays nothing there on purpose,
    #  so the engine's onset check would flag them; the SFX own both, mix.py)
    lh(['F3', 'C4', 'G4'], (3, 1), '4.6b', 0.32, lock=True)
    a.n('felt', 'C5', (3, 1), '4.6b', 0.24, lock=True)
    a.n('ubass', 'F2', (3, 1), '3.6b', 0.32)
    a.n('lead', 'C6', (3, 1), '1b', 0.16, duty=0.125, rel=0.3, sus=0.3, dec=0.2, lock=True)   # one chip glint
    Drums(a, 'brushes').play('swirl[vel=0.24]: ~~~~....', bars=(3, 4))

    # the pedal: re-caught on every LH chord
    ev = [(0.0, False)]
    for t in sorted(set(round(x, 4) for x in ped)):
        ev += [(max(t - 0.035, 0.0), False), (t + 0.025, True)]
    o_end = g.t(1) + 190 / 24                                         # o190: the sound is at zero (the dip ends)
    ev += [(o_end - 0.02, False), (o_end + 2.0, False)]
    ev.sort()
    T['felt'].pedal = ev
    T['felt_lh'].pedal = ev

    end = g.t(1) + 192 / 24                                           # o192 (the outro's last frame + 1)
    META['no_third_windows'] = [(0.25, g.t(1)), (g.t(3) + 0.05, end)]
    META['audition'] = [
        f'{g.t(1):.2f} s: the flat line, one F per beat in four registers: a count that has lost count, not a count-in',
        f'{g.t(2):.2f}-{g.t(3):.2f} s: the knee whole, swung, chip 8va ~10 dB under the felt; G and C land with the plates',
        f'{t_push:.2f} s: the Dbmaj7(#11) push under the knee\'s last F, cut before 3.1',
        f'{g.t(3):.2f} s: the button chord F-C-G, no third, as the house light goes; it rings through the sign going out '
        f'(o150) and the moth\'s landing (o165); faded to zero by {o_end:.2f} s = o190',
    ]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META,
                 tail_s=0.0, end_fade=(g.t(1) + 176 / 24, o_end), length_s=end)


if __name__ == '__main__':
    _redirect_cache()
    render_cli(build, __file__)
