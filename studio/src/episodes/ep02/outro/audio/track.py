"""E02-14 END CREDITS · Ep2's outro score: the knee whole, in Ep2's colour (manifest.md §6; proposal, OUTRO; OST-BIBLE
§2.1 rule 4: the credits reprise is the one place an episode plays the knee whole). Ep1's outro B score
(studio/src/dev/outro/b/audio/track.py, read, never edited) is the model; Ep2's colour, as the manifest asks:
  * SWUNG (Ep1's was straight: the machine owned that frame; Ep2's credits swing, house swing 1.0 = +10 frames);
  * THE PAUSED VOICE: the title's wordless vocal pad takes the flat line (F F F F) and STOPS before the leap. The pad is
    not an engine instrument: it is sung by the intro's own singer (vocal.py, Kokoro-82M stock voices re-sung through
    WORLD, the title PAD's recipe), placed on this grid by mix.py. This score leaves the flat line's melody to it;
  * celesta and chip finish the knee (G Ab C F), then the verdict F5 -> C6 over the open fifth, as Ep1's;
  * the second page (bars 4-6, the voice cast and the tools): the fifth held, NOTHING under the second scan (4.1-4.3,
    the SFX own it, as in bar 1); on 5.1 the celesta remembers the flat line, pp, without the voice; 6.3 Ep1's button
    (celesta F6 over vibes C6, pp); everything ends on the cut, 6.4, and the fifth releases into the black.
No third anywhere after the verdict (rule 12); the D-flat only under the leap.

Timeline (outro frames; the file starts at o0 = the cut from the tag's hum to black; 15 frames a beat):
  bar 1 (o0-59)     the drone F1 + C2 from the cut; felt F4 on the downbeat; nothing under the scan (1.3-1.4)
  bar 2 (o60-119)   the knee, swung: the vocal pad on F F F F (2.1-2.2&), stopping on 2.3; celesta + chip on G Ab C F
                    (2.3-2.4&); felt LH Fm9-no-third then Dbmaj7; upright bass; brushes. The credit chips land on 2.1, 2.2
  3.1  (o120)       the Orb's chime (SFX) owns the downbeat; 3.2 (o135) the verdict F5 -> C6, vibes + celesta, felt fifth
  bar 4 (o180-239)  4.1 the page turns: the felt fifth re-struck pp; the second scan (SFX) 4.1-4.3, no score onset
  bar 5 (o240-299)  5.1, 5.2 the tools chips land: the celesta's flat line, pp, swung, no voice; under the reading a
                    soft swung bed (the felt fifth on 1 and 3, the bass on F and C, brushes), into bar 6
  bar 6 (o300-344)  6.1 the fifth pp; 6.3 celesta F6 over vibes C6, pp; 6.4 (o345) the cut: the fifth releases

Engine: audio/ost/engine, imported READ-ONLY; its calibration cache is redirected beside --out (nothing under audio/).
  OST_WORKERS=2 PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-theme/bin/python \
      studio/src/episodes/ep02/outro/audio/track.py --out "$SC/music" --no-loop --no-mp3 --workers 2
"""
import os  # noqa: E402
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
import shutil  # noqa: E402

ROOT = REPO
sys.path.insert(0, os.path.join(ROOT, 'audio/ost'))
sys.dont_write_bytecode = True


def _redirect_cache():
    out = None
    if '--out' in sys.argv:
        out = sys.argv[sys.argv.index('--out') + 1]
    if not out:
        raise SystemExit('pass --out <scratch folder>: this track never writes under audio/')
    cache = os.path.join(os.path.dirname(os.path.abspath(out)), 'ost-cache')
    os.makedirs(cache, exist_ok=True)
    src = os.path.join(ROOT, 'audio/ost/cache/calib.json')
    if not os.path.exists(os.path.join(cache, 'calib.json')) and os.path.exists(src):
        shutil.copy(src, os.path.join(cache, 'calib.json'))
    import engine.sampler as sampler
    sampler.CACHE = cache


_redirect_cache()
from engine import *   # noqa: E402,F401,F403
from dataclasses import replace   # noqa: E402

ID = 'e02-14-end-credits'
META = dict(
    id=ID, mm='(MM-15, Ep2 colour)', title='E02-14 End credits: the knee whole, Ep2 colour (the paused voice)',
    family='P01 + credits reprise', usage='ET',
    tone='the Orb reads the credits and the cast; the voice sings the flat line and stops before the leap',
    tags=['outro', 'credits', 'knee', 'ep2'], scenes=['Ep2 outro (B, the Orb\'s verdict, with the cast page)'],
    motifs=['THE KNEE whole, swung (bar 2; the flat line is the vocal pad\'s, mix.py)', 'the verdict F5 -> C6 (3.2)',
            'the flat line again on celesta, no voice (5.1)'], motif_ids=['KNEE', 'VERDICT'],
    key='F minor; no third at the end', composer='Ep2 titles pass (after outro B v3)',
    knee_whole_ok=True, album_lufs=-16.0, underscore_lufs=-16.0, audition=[],
)
SWING = 1.0          # the house swing: an eighth's off-beat on +10 frames


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -9
    T['ubass'].gain_db = -2.5
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 3
    T['lead'].gain_db = -6         # the chip doubles the celesta's leap an octave up, under it
    T['vibes'].gain_db = 1
    T['celesta'].gain_db = -3      # the celesta carries the leap here (Ep1: the felt did)
    T['drone'].gain_db = -8
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=7, swing=SWING)
    a = Arr(g)
    T = tracks()
    CUT = g.t(6, 4)                                        # the cut to black (o345): the musical end

    # ---- the room: the open fifth from the cut to black to the cut out (6.4), fading through the tail
    a.n('drone', 'F1', (1, 1), CUT - g.t(1, 1) + 0.45, 0.62, lock=True, pitches=['F1', 'C2'], fade_in=0.35, fade_out=1.1)

    # ---- bar 1: the Orb wakes. One felt F4 on the downbeat; nothing under the scan.
    a.section('wake', 1, 2)
    a.n('felt', 'F4', (1, 1), '2b', 0.42, lock=True)
    a.n('felt_mech', 60, (1, 1), 0.1, 0.35, lock=True)
    a.mark('o0 cut to black: felt F4', (1, 1))

    # ---- bar 2: THE KNEE, swung. The flat line (2.1-2.2&) is the vocal pad's (vocal.py, laid by mix.py); it stops on
    # 2.3, where celesta and chip take the leap
    a.section('knee', 2, 3)
    a.line('celesta', 'r/8 r/8 r/8 r/8 G4/8 Ab4/8 C5/8 F5/2', (2, 1), vel=0.72, swing=True, lock=True)
    duties = [0.25, 0.25, 0.125, 0.25]
    for i, n in enumerate(a.line('lead', 'r/8 r/8 r/8 r/8 G5/8 Ab5/8 C6/8 F6/8', (2, 1), vel=0.46, swing=True, gate=0.85, lock=True)):
        n.x.update(duty=duties[i], rel=0.06, dec=0.1, sus=0.6)
    ROLL = 0.012
    a.ch('felt_lh', ['Eb3', 'G3', 'C4'], (2, 1), '1.8b', 0.22, roll=ROLL, lock=True)
    a.ch('felt_lh', ['F3', 'Ab3', 'C4'], (2, 3), '1.8b', 0.21, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (2, 1), '1.9b', 0.3, lock=True)
    a.n('ubass', 'Db2', (2, 3), '1.9b', 0.29, lock=True)
    Drums(a, 'brushes').play('''
        sweep[vel=0.34]: ~~~~~~~~
        tap[vel=0.28]:   ..o...o.
        kick[vel=0.2]:   o...o...
    ''', bars=(2, 3), swing=SWING)
    a.mark('2.1 the vocal pad takes the flat line; credit chip 1 lands (art · script · music · voices · edit: opus 5.5)', (2, 1))
    a.mark('2.2 credit chip 2 lands (prompt: jgon)', (2, 2))
    a.mark('2.3 the pad stops (the paused voice); celesta + chip take the leap; the iris narrows one step per note', (2, 3))

    # ---- bar 3: 3.1 is the Orb's chime (SFX): no score onset. 3.2 the verdict over the open fifth, the fullest moment
    a.section('verdict', 3, 4)
    a.mark('3.2 the verdict F5', (3, 2))
    a.ch('felt_lh', ['F3', 'C4'], (3, 2), '3b', 0.3, roll=0.014, lock=True)
    a.ch('felt', ['F4', 'C5'], g.t(3, 2) + 0.007, g.t(4, 1) - g.t(3, 2) - 0.007, 0.4, roll=0.014, lock=True)
    a.n('ubass', 'F2', (3, 2), '3b', 0.34, lock=True)
    for inst, v in (('vibes', 0.46), ('celesta', 0.24)):     # Ep1: 0.56 / 0.28; softer here, because this knee is
                                                             # lighter (the voice, then celesta): the verdict stays the
                                                             # fullest bar without passing the -11 LUFS momentary limit
        a.n(inst, 'F5', (3, 2), '3b', v, lock=True)
        a.n(inst, 'C6', (3, 3), '2b', v * 0.96, lock=True)

    # ---- bar 4: the page turns (4.1): the fifth re-struck pp; the second scan (SFX, 4.1-4.3) has no score onset
    a.section('the cast: the second scan', 4, 5)
    a.ch('felt_lh', ['F3', 'C4'], (4, 1), '4b', 0.2, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (4, 1), '3b', 0.22, lock=True)
    a.mark('4.1 the page turns; the second scan 4.1+10 - 4.3+4 (SFX only)', (4, 1))

    # ---- bar 5: the tools chips land on 5.1, 5.2: the celesta's flat line, pp, swung, where the voice was
    a.section('the tools', 5, 6)
    a.line('celesta', 'F5/8 F5/8 F5/8 F5/8', (5, 1), vel=0.22, swing=True, lock=True)
    # under the reading, a soft swung bed so the page isn't held in near-silence: the felt fifth on 1 and 3, the bass on
    # the root and the fifth (no third), brushes sweeping with a light tap on 2 and 4
    a.ch('felt_lh', ['F3', 'C4'], (5, 1), '2b', 0.2, roll=ROLL, lock=True)
    a.ch('felt_lh', ['F3', 'C4'], (5, 3), '2b', 0.17, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (5, 1), '1.9b', 0.24, lock=True)
    a.n('ubass', 'C3', (5, 3), '1.9b', 0.21, lock=True)
    Drums(a, 'brushes').play('''
        sweep[vel=0.26]: ~~~~~~~~
        tap[vel=0.2]:    ..o...o.
    ''', bars=(5, 7), swing=SWING)
    a.mark('5.1 tools chip 1; the celesta remembers the flat line, no voice', (5, 1))
    a.mark('5.2 tools chip 2', (5, 2))

    # ---- bar 6: the fifth pp; 6.3 Ep1's button; the cut on 6.4
    a.section('out', 6, 7)
    a.ch('felt_lh', ['F3', 'C4'], (6, 1), '3b', 0.18, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (6, 1), '3b', 0.2, lock=True)
    a.n('vibes', 'C6', (6, 3), '1b', 0.24, lock=True)
    a.n('celesta', 'F6', (6, 3), '1b', 0.18, lock=True)
    a.mark('6.3 celesta F6 over vibes C6, pp', (6, 3))

    META['no_third_windows'] = [(g.t(3, 2), CUT + 0.6)]
    T['felt'].pedal = [(0.0, False), (g.t(1, 1) + 0.02, True), (g.t(1, 3), False), (g.t(3, 2) - 0.03, False),
                       (g.t(3, 2) + 0.02, True), (g.t(4, 1) - 0.03, False), (g.t(4, 1) + 0.02, True),
                       (g.t(5, 1) - 0.03, False), (g.t(5, 1) + 0.02, True), (g.t(6, 1) - 0.03, False),
                       (g.t(6, 1) + 0.02, True), (CUT + 0.05, False)]
    T['felt_lh'].pedal = T['felt'].pedal
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    META['audition'] = [
        f'{t(2)}-{t(3)} s: the knee whole, swung: the vocal pad on the flat line (mix.py) stops on {t(2, 3)} s and celesta '
        f'+ chip finish it; not the title again (no brass, no riser)',
        f'{t(3)} s: the downbeat empty for the chime; {t(3, 2)} s the verdict F5 -> C6 over a felt fifth, no third',
        f'{t(4)}-{t(6, 4)} s: the cast page: the fifth held, nothing under the second scan, the celesta\'s flat line pp on '
        f'{t(5)} s, the button on {t(6, 3)} s; {t(6, 4)} s the cut, ~0.6 s of release in the black',
    ]
    return Score(ID, g, T, a.notes, loop=None, markers=a.markers, sections=a.sections, meta=META, length_s=CUT, tail_s=1.2)


if __name__ == '__main__':
    render_cli(build, __file__)
