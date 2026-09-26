"""E01-S29-D5  [MAS'S VERSION]  --  the Ep1 D5 insert (MM-02, the KEYNOTE REEL)       composer E (OST-BIBLE s5.E2 a)

Ep1 sc 29, 16:31: "[MAS'S VERSION] (1 bar) [ECU] His hand on the phone ... Nothing in the frame moves ... Under
it, a soft keynote-reel piano (an original cue; his brand).  HARD CUT on the downbeat, and the piano stops
mid-phrase."  Composer D's MM-10 leaves this bar empty.

  bar 1  (on picture)  KEYNOTE bar 1 on the too-clean felt: Db5 Db5 Db5 Eb5-Db5 over Dbmaj9(#11), pedal down.
                       The last Db5 is HELD across the bar line (a keynote lingers) and nothing new attacks
                       until b2.3, so
  b2.1   THE CUT       the editor's hard cut on bar 2's downbeat lands MID-NOTE (the Db5 and the chord are
                       sounding, nothing is starting).  No fade in the file: the cut is the editor's (3 ms, tails
                       cut: OST-BIBLE s6.6 rule 4).
  bar 2  (handle)      the phrase goes on (Ab/C, the Ab4 -> Db5 settle a beat late) so a late cut still lands
                       mid-phrase.

Pass-1 (the plainest) voicing: this is the season's first use (each later D5 is a shade more confident).
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', 'mm02-his-version')))
from engine import *   # noqa: E402,F401,F403
from keynote import keynote_track, VOICINGS, pedal_bars   # noqa: E402

ID = 'e01-s29-d5'

META = dict(
    id=ID,
    mm='MM-02',
    title='His Version (Ep1 D5 insert)',
    family='KEYNOTE REEL (D5)',
    tone='Mas\'s version, one bar: a keynote-reel piano too clean for the truth, killed by the hard cut',
    usage='BI',
    tags=['keynote reel', 'D5', 'insert', 'hard cut', 'to picture'],
    scenes=['E01-S29 [MAS\'S VERSION] (1 bar, 16:31); the hard cut on the next downbeat'],
    motifs=['KEYNOTE bar 1 (Db5 Db5 Db5 Eb5 Db5), the last Db5 held across the cut'],
    motif_ids=[],
    album_lufs=-16.0,
    key='Db major: Dbmaj9(#11) (| Ab/C in the handle)',
    composer='Composer E (OST batch 1)',
    description='Lay bar 1 under the 1-bar [MAS\'S VERSION] shot; CUT at bar 2\'s downbeat (2.500 s, frame 60 from '
                'the file start). The Db5 and the chord are sustaining there and nothing attacks until 3.75 s, so '
                'the cut is mid-note. Everything after 2.5 s is handle.',
    audition=[
        '0-2.5 s then cut at 2.5 s (frame 60): does the hard cut land MID-NOTE as the correction (the lie '
        'interrupted), not a glitch?',
        '0-2.5 s: pretty in the wrong way (too clean, too still) -- against the real felt of MM-01 / MM-10a',
        '0-2.5 s under the [ECU]: nothing in the frame moves, and nothing in the music moves but the tune',
    ],
)


def build():
    g = Grid(bpm=96, meter='4/4', bars=2, swing=0.0)
    a = Arr(g)
    T = palette()
    keynote_track(T)
    V = VOICINGS[1]
    a.ch('keynote_ch', V[0], (1, 1), g.dur('6b', g.t(1)), 0.36, lock=True)        # Dbmaj9(#11), held across the cut
    a.line('keynote', 'Db5/4 Db5/4 Db5/4 Eb5/8', (1, 1), vel=0.46, lock=True, gate=1.0)
    a.n('keynote', 'Db5', (1, 4.5), g.dur('2.5b', g.t(1, 4.5)), 0.46, lock=True)   # held across the bar line
    a.ch('keynote_ch', V[1], (2, 3), '2b', 0.36, lock=True)                        # handle: Ab/C, a beat late
    a.n('keynote', 'Ab4', (2, 3), '1b', 0.46, lock=True)
    a.n('keynote', 'Db5', (2, 4), '1b', 0.46, lock=True)
    a.section('D5 bar (on picture)', 1, 2)
    a.section('handle (after the cut)', 2, 3)
    a.mark('D5 bar starts (the [ECU])', (1, 1))
    # the pedal stays down across the cut (no re-catch at b2.1: the chord must still be sounding there)
    T['keynote'].pedal = [(0.0, False), (0.012, True), (g.t(2, 3) - 0.012, False), (g.t(2, 3) + 0.012, True),
                          (g.t(3) + 4.0, False)]
    T['keynote_ch'].pedal = T['keynote'].pedal
    return Score(ID, g, T, a.notes, markers=a.markers, sections=a.sections, meta=META, tail_s=3.0)


if __name__ == '__main__':
    render_cli(build, __file__)
