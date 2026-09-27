"""OUTRO B · "the Orb's verdict": the TEMP credits reprise in Ep1's colour (lookdev only; OUTRO-PROPOSALS §3, §9).

Timeline (outro frames; the mock-up file puts a 24-frame stand-in before o0, so the mix places this at file 1.000 s):
  bar 1  (o0-59)    the Orb wakes. The score owns the room: the drone F1 + C2 (the open fifth) from the cut, and one
                    felt F4 on the downbeat. NOTHING under the scan (1.3-1.4): the servo, the scan and the GLYPH grains
                    are SFX and own it.
  bar 2  (o60-119)  THE KNEE, WHOLE, once (the credits reprise is the only place an episode plays it, OST-BIBLE §2.1,
                    rule 4), STRAIGHT because the machine owns this frame (rule 6), in Ep1's colour: the felt upright
                    leads (F4..F5), a chip pulse doubles it an octave up (rule 3; its duty changes on every F of the
                    flat line), upright bass and brushes. The two credit chips land on 2.1 and 2.2 (the flat line);
                    on the leap (G Ab C F) the Orb's iris narrows one held step per note.
  3.1    (o120)     the Orb's chime (SFX, C7) owns the downbeat: no score onset there.
  3.2    (o135)     the score's verdict (§2.4), F5 -> C6 on soft vibes + celesta over the open fifth (felt F3 C4, bass
                    F2, the drone): no third anywhere (rule 12). Ep1's moth stinger plays over it, inside the bar (SFX).
  4.1    (o180)     the cut to black: every note ends on it; the fifth's release and the drone's fade ring ~0.75 s into
                    the black (pass 4: the outro no longer runs on under a 3.75 s moth coda).

Engine: audio/ost/engine, imported READ-ONLY. The sampler's calibration cache is redirected into the output folder's
parent (a copy), so nothing is written under audio/.  Run (from the repo root):
  PYTHONDONTWRITEBYTECODE=1 audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/track.py --out "$SC/music" --no-stems --no-loop
"""
import os
import shutil
import sys

ROOT = '/home/jgon/project/art/mrmas'
sys.path.insert(0, os.path.join(ROOT, 'audio/ost'))
sys.dont_write_bytecode = True

# ---- keep the engine read-only: point its calibration cache at a scratch copy BEFORE any sampler loads
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

ID = 'outro-b-temp'
META = dict(
    id=ID, mm='(MM-15 temp)', title='Outro B temp reprise (Ep1 colour)', family='P01 + credits reprise',
    tone='the Orb reads the credits, then gives its verdict on the viewer: an open fifth', usage='ET',
    tags=['outro', 'credits', 'knee', 'lookdev', 'temp'], scenes=['outro proposal B mock-up'],
    motifs=['THE KNEE whole, straight (bar 2)', 'the verdict F5 -> C6 (3.2)'], motif_ids=['KNEE', 'VERDICT'],
    key='F minor; no third at the end', composer='outro-b builder (lookdev)',
    knee_whole_ok=True, album_lufs=-16.0, underscore_lufs=-16.0,
    audition=[],
)


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -9
    T['ubass'].gain_db = -1.0
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 10
    T['lead'].gain_db = 0          # the chip double must be heard (rule 3), still under the felt
    T['vibes'].gain_db = -4
    T['celesta'].gain_db = -9
    T['drone'].gain_db = -8
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=4, swing=0.0)       # straight: the machine's frame (bar 4 = the tail)
    a = Arr(g)
    T = tracks()

    # ---- the room: the open fifth from the cut to black (o0) to the cut out (4.1, o180), fading through the tail
    a.n('drone', 'F1', (1, 1), g.t(4, 1) - g.t(1, 1) + 0.45, 0.62, lock=True, pitches=['F1', 'C2'], fade_in=0.35, fade_out=1.1)

    # ---- bar 1: the Orb wakes. One felt F4 on the downbeat. Nothing under the scan.
    a.section('wake', 1, 2)
    a.n('felt', 'F4', (1, 1), '2b', 0.42, lock=True)
    a.n('felt_mech', 60, (1, 1), 0.1, 0.35, lock=True)
    a.mark('o0 cut to black: felt F4', (1, 1))

    # ---- bar 2: THE KNEE, whole, straight. Felt leads (F4 .. F5), chip doubles an octave up.
    a.section('knee', 2, 3)
    place_knee(a, 'felt', 2, octave=4, rate=0.5, swing=False, vel=0.5, gate=0.9, lock=True)
    duties = [0.125, 0.25, 0.5, 0.25, 0.25, 0.25, 0.125, 0.25]
    for i, n in enumerate(place_knee(a, 'lead', 2, octave=5, rate=0.5, swing=False, vel=0.5, gate=0.85, lock=True)):
        n.x.update(duty=duties[i], rel=0.06, dec=0.1, sus=0.6)
    for n in a.notes:                      # the octave F (2.4&) lets ring to 3.3
        if n.inst == 'felt' and abs(n.start - g.t(2, 4.5)) < 1e-6:
            n.dur = g.t(3, 3) - n.start
    # LH: Fm9 with no third under the flat line (Eb G C), Dbmaj7 under the leap (G is its #11)
    a.ch('felt_lh', ['Eb3', 'G3', 'C4'], (2, 1), '1.8b', 0.3, roll=0.0, lock=True)
    a.ch('felt_lh', ['F3', 'Ab3', 'C4'], (2, 3), '1.8b', 0.28, roll=0.0, lock=True)
    a.n('ubass', 'F2', (2, 1), '1.9b', 0.4, lock=True)
    a.n('ubass', 'Db2', (2, 3), '1.9b', 0.38, lock=True)
    Drums(a, 'brushes').play('''
        sweep[vel=0.42]: ~~~~~~~~
        tap[vel=0.34]:   ..o...o.
        kick[vel=0.26]:  o...o...
    ''', bars=(2, 3))
    a.mark('2.1 credit chip 1 lands (made in code by ...)', (2, 1))
    a.mark('2.2 credit chip 2 lands (voices ...)', (2, 2))
    a.mark('2.3 the leap: the iris narrows one step per note', (2, 3))

    # ---- bar 3: 3.1 is the Orb's chime (SFX, C7): no score onset on it. 3.2 the verdict over the open fifth.
    a.section('verdict', 3, 4)
    a.mark('3.2 the verdict F5', (3, 2))
    a.ch('felt_lh', ['F3', 'C4'], (3, 2), '3b', 0.24, roll=0.0, lock=True)   # F3 C4, not F2: a felt F2's 5th partial reads as A
    a.n('ubass', 'F2', (3, 2), '3b', 0.3, lock=True)
    for inst, v in (('vibes', 0.44), ('celesta', 0.22)):
        a.n(inst, 'F5', (3, 2), '3b', v, lock=True)
        a.n(inst, 'C6', (3, 3), '2b', v * 0.96, lock=True)
    a.mark('3.3 Ep1: the iris swivels down after the moth', (3, 3))
    a.mark('4.1 the cut to black', (4, 1))

    META['no_third_windows'] = [(g.t(3, 2), g.t(4, 1) + 0.75)]
    T['felt'].pedal = [(0.0, False), (g.t(1, 1) + 0.02, True), (g.t(1, 3), False), (g.t(3, 2) - 0.03, False),
                       (g.t(3, 2) + 0.02, True), (g.t(4, 1) + 0.05, False)]
    T['felt_lh'].pedal = T['felt'].pedal
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    META['audition'] = [
        f'{t(2)}-{t(3)} s: the knee whole, straight, felt + chip: complete and clear, and not the title again (no brass, '
        f'no riser); the two credit chips land on 2.1 and 2.2, the iris steps on the leap',
        f'{t(3)} s: the downbeat is empty for the chime (SFX C7); {t(3, 2)} s the verdict F5 -> C6: no third',
        f'{t(3, 2)}-{t(4)} s: the open fifth under the Ep1 moth (SFX); {t(4)} s the cut: the notes end on it and '
        f'release into ~0.75 s of black (the drone fades through it)',
    ]
    return Score(ID, g, T, a.notes, loop=None, markers=a.markers, sections=a.sections, meta=META, tail_s=1.2)


if __name__ == '__main__':
    render_cli(build, __file__)
