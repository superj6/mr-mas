"""OUTRO B · "the Orb's verdict": Ep1's credits reprise in Ep1's colour (v3, the final outro; OUTRO-PROPOSALS §1.2, §3).

Timeline (outro frames; the file starts at o0, the cut to black):
  bar 1  (o0-59)    the Orb wakes. The score owns the room: the drone F1 + C2 (the open fifth) from the cut, and one
                    felt F4 on the downbeat. NOTHING under the scan (1.3-1.4): the servo, the scan and the GLYPH grains
                    are SFX and own it.
  bar 2  (o60-119)  THE KNEE, WHOLE, once (the credits reprise is the only place an episode plays it, OST-BIBLE §2.1,
                    rule 4), STRAIGHT because the machine owns this frame (rule 6), in Ep1's colour: the felt upright
                    leads (F4..F5), a chip pulse doubles it an octave up (rule 3; its duty changes on every F of the
                    flat line), upright bass and brushes. The two credit chips land on 2.1 and 2.2 (the flat line:
                    `art · script · music · voices · edit: opus 5.5`, then `prompt: jgon`); on the leap (G Ab C F) the
                    Orb's iris narrows one held step per note. The knee sits under the verdict (pass 5 of the mock-up),
                    so bar 3 is the fullest moment.
  3.1    (o120)     the Orb's chime (SFX, C7) owns the downbeat: no score onset there. The lens lights.
  3.2    (o135)     the score's verdict (§2.4), F5 -> C6 on vibes + celesta, over a felt F4-C5 fifth, the open fifth
                    below (felt F3 C4, bass F2, the drone): no third anywhere (rule 12). The moth is looping the lamp.
  3.4    (o165)     the moth bumps the lens (SFX glass tink): no score onset.
  bar 4  (o180-224) Ep1's stinger (a plain week cuts at 4.1): the fifth held (the felt LH re-struck pp on 4.1); the
                    moth lands on the Orb just after it (SFX); 4.2 the Orb rolls its eye up to it (SFX servo); 4.3 it
                    narrows on it: celesta F6 over vibes C6, pp, once.
  4.4    (o225)     the cut to black: every note ends on it; the fifth's release and the drone's fade ring ~0.75 s into
                    the black (the file's tail).

v3 re-fit (2026-09-27): the mock-up ran to 5.1 (the moth landed by the band's terms line on 4.2); the final cuts one
beat earlier, on 4.4, so bar 4 is three beats. Everything before 4.1 is the mock-up's pass-5 score unchanged.

Engine: audio/ost/engine, imported READ-ONLY. The sampler's calibration cache is redirected into the output folder's
parent (a copy), so nothing is written under audio/.  Run (from the repo root; tools/render.sh does it):
  OST_WORKERS=2 PYTHONDONTWRITEBYTECODE=1 audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/track.py \
      --out "$SC/music" --no-loop --workers 2
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

ROOT = REPO
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

ID = 'outro-b-v3-ep1'
META = dict(
    id=ID, mm='(MM-15, Ep1 colour)', title='Outro B credits reprise (Ep1 colour)', family='P01 + credits reprise',
    tone='the Orb reads the credits, then gives its verdict on the viewer: an open fifth', usage='ET',
    tags=['outro', 'credits', 'knee', 'ep1'], scenes=['Ep1 outro (B, the Orb\'s verdict)'],
    motifs=['THE KNEE whole, straight (bar 2)', 'the verdict F5 -> C6 (3.2)'], motif_ids=['KNEE', 'VERDICT'],
    key='F minor; no third at the end', composer='outro-b builder; v3 re-fit by v3-outro',
    knee_whole_ok=True, album_lufs=-16.0, underscore_lufs=-16.0,
    audition=[],
)


def tracks():
    T = palette()
    T['felt'].gain_db = 0.0
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -9
    T['ubass'].gain_db = -2.5
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['brush'].gain_db = 3         # pass 5: 10 -> 4 (the knee was the loudest bar); v3: 4 -> 3 (see the knee's vel)
    T['lead'].gain_db = -5         # the chip double must be heard (rule 3), still under the felt; pass 5: 0 -> -5
    T['vibes'].gain_db = 1         # pass 5: -4 -> +1 (the verdict is the payoff)
    T['celesta'].gain_db = -5      # pass 5: -9 -> -5
    T['drone'].gain_db = -8
    return T


def build():
    g = Grid(bpm=96, meter='4/4', bars=5, swing=0.0)       # straight: the machine's frame (bar 4 = the stinger, 5 = the tail)
    a = Arr(g)
    T = tracks()
    CUT = g.t(4, 4)                                        # the cut to black (o225): the musical end

    # ---- the room: the open fifth from the cut to black (o0) to the cut out (4.4, o225), fading through the tail
    a.n('drone', 'F1', (1, 1), CUT - g.t(1, 1) + 0.45, 0.62, lock=True, pitches=['F1', 'C2'], fade_in=0.35, fade_out=1.1)

    # ---- bar 1: the Orb wakes. One felt F4 on the downbeat. Nothing under the scan.
    a.section('wake', 1, 2)
    a.n('felt', 'F4', (1, 1), '2b', 0.42, lock=True)
    a.n('felt_mech', 60, (1, 1), 0.1, 0.35, lock=True)
    a.mark('o0 cut to black: felt F4', (1, 1))

    # ---- bar 2: THE KNEE, whole, straight. Felt leads (F4 .. F5), chip doubles an octave up.
    a.section('knee', 2, 3)
    # v3: vel 0.36 -> 0.34. At -16 LUFS / -3 dBTP the limiter took the verdict's peaks down to the knee's level; a
    # slightly softer knee keeps the verdict (bar 3) the cue's loudest moment, as the mock-up's pass 5 set it
    place_knee(a, 'felt', 2, octave=4, rate=0.5, swing=False, vel=0.34, gate=0.9, lock=True)
    duties = [0.125, 0.25, 0.5, 0.25, 0.25, 0.25, 0.125, 0.25]
    for i, n in enumerate(place_knee(a, 'lead', 2, octave=5, rate=0.5, swing=False, vel=0.4, gate=0.85, lock=True)):
        n.x.update(duty=duties[i], rel=0.06, dec=0.1, sus=0.6)
    for n in a.notes:                      # the octave F (2.4&) lets ring to 3.3
        if n.inst == 'felt' and abs(n.start - g.t(2, 4.5)) < 1e-6:
            n.dur = g.t(3, 3) - n.start
    # LH: Fm9 with no third under the flat line (Eb G C), Dbmaj7 under the leap (G is its #11)
    # v3: every felt chord is rolled a little, low to high (12-14 ms a note, the first note on the beat), the way a
    # pianist's hand lands: four hammers struck in the same sample made the cue's true peaks (2.1, 2.3, 3.2), and at
    # -16 LUFS a limiter had to take 2 dB off the verdict, which flattened the payoff under the knee
    ROLL = 0.012
    a.ch('felt_lh', ['Eb3', 'G3', 'C4'], (2, 1), '1.8b', 0.22, roll=ROLL, lock=True)
    a.ch('felt_lh', ['F3', 'Ab3', 'C4'], (2, 3), '1.8b', 0.21, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (2, 1), '1.9b', 0.3, lock=True)
    a.n('ubass', 'Db2', (2, 3), '1.9b', 0.29, lock=True)
    Drums(a, 'brushes').play('''
        sweep[vel=0.36]: ~~~~~~~~
        tap[vel=0.3]:    ..o...o.
        kick[vel=0.22]:  o...o...
    ''', bars=(2, 3))
    a.mark('2.1 credit chip 1 lands (art · script · music · voices · edit: opus 5.5)', (2, 1))
    a.mark('2.2 credit chip 2 lands (prompt: jgon)', (2, 2))
    a.mark('2.3 the leap: the iris narrows one step per note', (2, 3))

    # ---- bar 3: 3.1 is the Orb's chime (SFX, C7): no score onset on it. 3.2 the verdict over the open fifth, the
    # fullest moment of the cue (pass 5). 3.4 is the moth's glass tap (SFX): no score onset on it either.
    a.section('verdict', 3, 4)
    a.mark('3.2 the verdict F5', (3, 2))
    a.ch('felt_lh', ['F3', 'C4'], (3, 2), '3b', 0.3, roll=0.014, lock=True)   # F3 C4, not F2: a felt F2's 5th partial reads as A
    a.ch('felt', ['F4', 'C5'], g.t(3, 2) + 0.007, g.t(4, 1) - g.t(3, 2) - 0.007, 0.4, roll=0.014, lock=True)  # F3 F4 C4 C5: 0, 7, 14, 21 ms
    a.n('ubass', 'F2', (3, 2), '3b', 0.34, lock=True)
    for inst, v in (('vibes', 0.56), ('celesta', 0.28)):
        a.n(inst, 'F5', (3, 2), '3b', v, lock=True)
        a.n(inst, 'C6', (3, 3), '2b', v * 0.96, lock=True)
    a.mark('3.3 the moth loops the lamp', (3, 3))

    # ---- bar 4: Ep1's stinger, three beats (a plain week cuts at 4.1). The fifth held; the moth lands on the Orb just
    # after 4.1 (SFX); 4.2 the Orb rolls its eye up to it (SFX servo); on 4.3 it narrows on it: celesta F6 over vibes
    # C6, pp, once. Everything ends on the cut (4.4).
    a.section('stinger', 4, 5)
    a.ch('felt_lh', ['F3', 'C4'], (4, 1), '3b', 0.2, roll=ROLL, lock=True)
    a.n('ubass', 'F2', (4, 1), '3b', 0.22, lock=True)
    a.n('vibes', 'C6', (4, 3), '1b', 0.26, lock=True)
    a.n('celesta', 'F6', (4, 3), '1b', 0.2, lock=True)
    a.mark('4.1 the fifth re-struck pp (the moth lands on the Orb 3 f later)', (4, 1))
    a.mark('4.3 it narrows on the moth', (4, 3))
    # (no markers on 4.2, the eye roll, or 4.4, the cut: neither has a score onset, by design)

    META['no_third_windows'] = [(g.t(3, 2), CUT + 0.75)]
    T['felt'].pedal = [(0.0, False), (g.t(1, 1) + 0.02, True), (g.t(1, 3), False), (g.t(3, 2) - 0.03, False),
                       (g.t(3, 2) + 0.02, True), (g.t(4, 1) - 0.03, False), (g.t(4, 1) + 0.02, True), (CUT + 0.05, False)]
    T['felt_lh'].pedal = T['felt'].pedal
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    META['audition'] = [
        f'{t(2)}-{t(3)} s: the knee whole, straight, felt + chip: complete and clear, and not the title again (no brass, '
        f'no riser), and no longer the loudest bar; the two credit chips land on 2.1 and 2.2, the iris steps on the leap',
        f'{t(3)} s: the downbeat is empty for the chime (SFX C7); {t(3, 2)} s the verdict F5 -> C6 over a felt fifth: '
        f'the fullest moment, no third',
        f'{t(4)}-{t(4, 4)} s: the stinger (3 beats): the fifth held under the moth landing on the Orb (SFX), the eye roll '
        f'on {t(4, 2)} s (SFX servo), celesta F6 on {t(4, 3)} s; {t(4, 4)} s the cut: the notes end on it and release into '
        f'~0.75 s of black (the drone fades through it)',
    ]
    return Score(ID, g, T, a.notes, loop=None, markers=a.markers, sections=a.sections, meta=META, length_s=CUT, tail_s=1.2)


if __name__ == '__main__':
    render_cli(build, __file__)
