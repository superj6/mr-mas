"""OUTRO D · "the curve" -- TEMP credits reprise, Ep1 colour (DARK ROOM: felt upright, brushes trio, chip; strings
enter on the leap only). LOOKDEV ONLY, not an OST track: nothing is written under audio/. It imports the OST engine
read-only; the engine's render goes wherever --out points (scratch).

d4 (polish): 4.5 bars (o0-o269, 11.25 s), down from 6. 96 BPM, 15 frames a beat, 60 a bar. The file holds a 2-beat
pickup (1.25 s); mix.py trims its first 0.25 s so the file starts 1.0 s before o0, with the 24-frame stand-in.

  bar 0 (pickup)  stand-in   the button's tail: felt F3-C4-G4 (no third) under the pedal, the drone F1+C2; both are
                             gone by o14, when the thread has lifted into the flat line (never a held tone under it)
  bars 1-2 o0-104  the flat  THE KNEE, part 1, in half notes: F on 1.1 (the lift, with a harp F5) 1.3 (the title)
                             2.1 2.3 (the flat plates), each SHORT, each in another register (F3, F5, F4, F2+F3) and
                             another chip duty (50 %, 12.5 %, 25 %, triangle); swung brushes; the Water Line's harmony
                             as short comps only, Fm(add9) -> Dbmaj7; the upright short, two-feel. Pedal UP.
  2.4-3.3 o105-150 the leap  THE KNEE, part 2, in QUARTERS: G (2.4) Ab (3.1) C (3.2) F (3.3), felt with chip 8va, the
                             strings in: the curve takes off and so does the rhythm. Bbm9 -> C7sus(b9) -> on 3.3 the
                             title's quartal stack C-F-Bb-Eb over F with G on top: NO THIRD. No riser, no snare roll.
  3.3-4.4 o150-239 the ring  the stack rings under the final frame; a harp F5 as the moth lands (4.1)
  5.1 o240         the out   everything releases with the picture
  5.2 o255         the loop  felt F5 + a 1-frame chip F6 glint (the cold open's f0 sound) under the lone caret;
                             out by o269

The knee plays whole exactly once (8 notes, F F F F G Ab C F), doubled by chip on every note.

Run (repo root):
  PYTHONDONTWRITEBYTECODE=1 OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python -B studio/src/dev/outro/d/audio/track.py --no-stems --no-loop --out <scratch>/music
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
import sys

sys.path.insert(0, os.path.join(REPO, 'audio/ost'))
from engine import *   # noqa: E402,F401,F403
from dataclasses import replace   # noqa: E402

ID = 'lookdev-outro-d-ep1'
PICKUP_BEATS = 2

META = dict(
    id=ID,
    mm='(temp, lookdev)',
    title='Outro D: the curve (Ep1 colour, temp)',
    family='P01',
    tone='the credits reprise as the thread runs home: the flat line in half notes, the leap in quarters onto the quartal stack, the f0 sound under the lone caret',
    usage='ET',
    tags=['lookdev', 'outro', 'credits reprise', 'temp'],
    scenes=['outro proposal D mock-up (out/lookdev/outro/d/)'],
    motifs=['THE KNEE whole: the flat augmented to half notes, the leap in quarters (1.1-3.3, felt + chip)',
            'the title quartal stack (3.3)', 'the f0 sound, felt F5 + chip F6 glint (5.2)'],
    motif_ids=[],                         # the knee is placed note by note, so the line detector can't see it
    key='F minor, open fifths and quartal, no third',
    composer='outro-D lookdev builder (temp)',
    knee_whole_ok=True,                   # the credits reprise is the one place the knee plays whole (OST s2.1)
    underscore_lufs=-16.0,
    album_lufs=-16.0,
    audition=[],
)


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_lh'].gain_db = -2.0
    T['ubass'].gain_db = -1.0
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['cb_pizz'].gain_db = -6
    T['vln_pizz'].gain_db = -6
    T['vla_pizz'].gain_db = -5
    T['brush'].gain_db = 10
    T['lead'].gain_db = 2                # the chip double ~10 dB under the felt (P01: <= -10 dB)
    T['tri'].gain_db = -2
    T['harp'].gain_db = -4
    for s in ('vln1', 'vln2', 'vla', 'vc'):
        T[s].gain_db = -9
    T['drone'].gain_db = -12
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=5, swing=1.0, pickup=PICKUP_BEATS)
    a = Arr(g)
    T = tracks()
    pedal = []                                     # (sec, down?)
    o = lambda f: g.t(1) + f / 24.0                # outro frame -> seconds  # noqa: E731

    # ---------------------------------------------------------------- bar 0: the button's tail (stand-in second)
    a.section('button tail (stand-in)', 0, 1)
    t0 = g.t(0, 3) + 0.25                          # = the trimmed file's first sample (o-24)
    a.ch('felt_lh', ['F3', 'C4', 'G4'], t0, g.t(1) + 0.1 - t0, 0.36, roll=0.0, lock=True)
    a.n('drone', 'F1', t0, o(12) - t0, 0.62, pitches=['F1', 'C2'], fade_in=0.8, fade_out=0.5)
    pedal += [(t0 + 0.02, True), (g.t(1) + 0.08, False)]   # up on the lift: nothing rings under the flat line

    # ---------------------------------------------------------------- bars 1-2: the flat line, F in half notes, SHORT
    a.section('the flat line (knee 1-4)', 1, 3)
    a.mark('o0 the thread lifts: harp F5', (1, 1))
    a.n('harp', 'F5', (1, 1), '3b', 0.40, lock=True)
    flat = [  # (pos, felt pitches, chip pitch, chip kind/duty, pizz track, pizz pitch, what)
        ((1, 1), ['F3'], 'F4', ('lead', 0.5), 'cb_pizz', 'F2', 'the lift'),
        ((1, 3), ['F5'], 'F5', ('lead', 0.125), 'vln_pizz', 'F5', 'the title'),
        ((2, 1), ['F4'], 'F5', ('lead', 0.25), 'vla_pizz', 'F4', 'created by'),
        ((2, 3), ['F2', 'F3'], 'F4', ('tri', None), 'cb_pizz', 'F2', 'written'),
    ]
    for i, (pos, felt, chip, (ctrk, duty), ptrk, pp, what) in enumerate(flat):
        a.mark(f'o{30 * i} F: {what}', pos)
        a.ch('felt', felt, pos, '0.42b', 0.50 if i != 1 else 0.44, roll=0.0, lock=True)
        kw = dict(att=0.002, dec=0.08, sus=0.35, rel=0.05, lock=True)
        if duty is not None:
            kw['duty'] = duty
        a.n(ctrk, chip, pos, '0.40b', 0.34 if ctrk == 'lead' else 0.46, **kw)
        art.pizz(a, ptrk, pp, pos, vel=0.52, lock=True)
    # the Water Line's harmony as short comps (never held): Fm(add9) in bar 1, Dbmaj7 in bar 2 (Ab3 at the bottom:
    # the d3 fix, no F under the felt's Ab3 resonance)
    a.ch('felt_lh', ['Ab3', 'C4', 'Eb4', 'G4'], (1, 2.5, 'sw'), '1/8', 0.24, roll=0.006)
    a.ch('felt_lh', ['Ab3', 'C4', 'Eb4', 'G4'], (1, 4.5, 'sw'), '1/8', 0.22, roll=0.006)
    a.ch('felt_lh', ['Ab3', 'C4', 'Db4', 'F4'], (2, 2.5, 'sw'), '1/8', 0.24, roll=0.006)
    for p, at in [('F2', (1, 1)), ('C3', (1, 3)), ('Db2', (2, 1)), ('Ab2', (2, 3))]:
        a.n('ubass', p, at, '0.9b', 0.40)
    Drums(a, 'brushes').play('''
        sweep[vel=0.32]: ~~~~~~~~
        tap[vel=0.28]:   ..g..xg.
    ''', bars=(1, 2))
    Drums(a, 'brushes').play('''
        sweep[vel=0.40]: ~~~~~~~~
        tap[vel=0.34]:   ..g..xg.
        kick[vel=0.22]:  o.......
    ''', bars=(2, 3))

    # ---------------------------------------------------------------- 2.4-3.3: the leap in quarters, strings in
    a.section('the leap (knee 5-8)', 2, 4)
    leap = [((2, 4), 'G4', 'G5', 'picture · music'), ((3, 1), 'Ab4', 'Ab5', 'voices'), ((3, 2), 'C5', 'C6', 'AI tools'),
            ((3, 3), 'F5', 'F6', 'the post box')]
    for i, (pos, p, c, what) in enumerate(leap):
        a.mark(f'o{105 + 15 * i} {p[:-1]}: {what}', pos)
        last = i == 3
        a.n('felt', p, pos, '6b' if last else '0.95b', 0.52 + 0.03 * i, lock=True)
        a.n('lead', c, pos, '1.6b' if last else '0.8b', 0.32, duty=0.25, att=0.002, dec=0.1, sus=0.5, rel=0.08, lock=True)
        pedal += [(g.t(*pos) - 0.03, False), (g.t(*pos) + 0.03, True)]
    # Bbm9 (2.4-3.1) -> C7sus(b9) (3.2) -> the title's quartal stack over F, G on top (3.3 on); no E, no A
    a.ch('felt_lh', ['Db3', 'F3', 'Ab3', 'C4'], (2, 4), '1.9b', 0.30, roll=0.01, lock=True)
    a.ch('felt_lh', ['Bb2', 'Db3', 'F3', 'G3'], (3, 2), '0.95b', 0.30, roll=0.01, lock=True)
    # the stack over the bass's F1 (the felt leaves out its own F2: see the strings below)
    a.ch('felt_lh', ['C3', 'F3', 'Bb3', 'Eb4', 'G4'], (3, 3), '6b', 0.36, roll=0.014, lock=True)
    for p, at, d in [('Bb1', (2, 4), '0.95b'), ('Ab1', (3, 1), '0.95b'), ('C2', (3, 2), '0.95b'), ('F1', (3, 3), '3b')]:
        a.n('ubass', p, at, d, 0.42, lock=True)
    art.sus(a, 'vc', ['Bb2'], (2, 4), '1.95b', vel=0.40)
    art.sus(a, 'vla', ['Db4', 'F4'], (2, 4), '1.95b', vel=0.36)
    art.sus(a, 'vc', ['C3'], (3, 2), '0.95b', vel=0.42)
    art.sus(a, 'vla', ['Bb3', 'Db4'], (3, 2), '0.95b', vel=0.38)
    art.sus(a, 'vln2', ['G4'], (3, 2), '0.95b', vel=0.34)
    # the ring holds 6 beats, so the sustained strings leave the F to the felt and the bass (which decay): a held
    # F2 / F3 in the strings puts their own 5th partial (A) under the whole final frame (d4: raw A/F 0.29 in the
    # no-third window with vc F2 + vla F3; the engine's sieve calls it explained, but it colours the chord)
    art.sus(a, 'vc', ['C3'], (3, 3), '6b', vel=0.46)
    art.sus(a, 'vla', ['Bb3'], (3, 3), '6b', vel=0.42)
    art.sus(a, 'vln2', ['Eb4'], (3, 3), '6b', vel=0.40)
    art.sus(a, 'vln1', ['G4'], (3, 3), '6b', vel=0.38)
    Drums(a, 'brushes').play('''
        sweep[vel=0.46]: ~~~~~~~~
        tap[vel=0.38]:   ..g..xg.
        kick[vel=0.26]:  o...o...
    ''', bars=(3, 4))
    a.mark('3.3 the F lands on the quartal stack (no third)', (3, 3))

    # ---------------------------------------------------------------- bar 4: the ring; the moth lands on 4.1
    a.section('the ring (the final frame)', 4, 5)
    a.mark('o180 the moth lands on the post box: harp F5', (4, 1))
    a.n('harp', 'F5', (4, 1), '3b', 0.26, lock=True)
    Drums(a, 'brushes').play('''
        sweep[vel=0.26]: ~~~~....
    ''', bars=(4, 5))

    # ---------------------------------------------------------------- bar 5: the out (5.1) and the loop (5.2)
    a.section('the out + the loop', 5, 6)
    cut = g.t(5, 1)
    a.mark('o255 the lone caret: felt F5 + chip F6 glint', (5, 2))
    for nt in a.notes:
        if nt.start < cut and nt.start + nt.dur > cut - 0.02:
            nt.dur = max(0.02, cut + 0.12 - nt.start)
            nt.x['rel'] = 0.28
    pedal += [(cut + 0.1, False), (g.t(5, 2) - 0.01, True)]
    a.n('felt', 'F5', (5, 2), '0.9b', 0.40, lock=True)
    a.n('lead', 'F6', (5, 2), '1f', 0.30, duty=0.125, att=0.001, dec=0.02, sus=0.3, rel=0.02, lock=True)

    end = g.t(5, 3)                                # o270
    ev = sorted([(0.0, False)] + pedal + [(end + 2.0, False)])
    T['felt'].pedal = ev
    T['felt_lh'].pedal = ev

    META['no_third_windows'] = [(g.t(0, 3), o(14)), (g.t(3, 3), end)]
    META['audition'] = [
        f'{g.t(1):.2f} s (o0): the lift, harp F5 + the first F; the drone is gone by {o(14):.2f} s',
        f'{g.t(1):.2f}-{g.t(2, 4):.2f} s: the flat line, four short Fs in half notes, four registers, never a held tone under it',
        f'{g.t(2, 4):.2f}-{g.t(3, 3):.2f} s: the leap G Ab C F in quarters with chip 8va and strings; 3.3 the quartal stack, no third',
        f'{g.t(4):.2f} s (o180): harp F5 as the moth lands; {cut:.2f} s (o240) the release; {g.t(5, 2):.2f} s the f0 sound; out by {end:.2f} s',
    ]
    return Score(META['id'], g, T, a.notes, markers=a.markers, sections=a.sections, meta=META,
                 tail_s=0.0, end_fade=(end - 0.3, end), length_s=end)


if __name__ == '__main__':
    render_cli(build, __file__)
