"""MM-02  HIS VERSION  (the KEYNOTE REEL)  --  library version, 16 bars = 40 s          composer E (OST-BIBLE s5.E2)

Mas's version of events, and his brand music in the world (Ep2: under Rima's demo).  It is the Water Line made
pretty -- Db major, straight, too still, on his own felt piano with everything human removed -- so it must be
pretty IN THE WRONG WAY: parody by polish, never a sincere ad, never a wink.  See keynote.py for the sound.

  bars  1-4   pass 1   KEYNOTE (s2.3) + the answer a fifth lower on Ab; one plain chord per bar
  bars  5-8   pass 2   one voice more (the 9ths), an octave more at the bottom
  bars  9-12  pass 3   wider: the tune in octaves, a halo voicing above it, the chords rolled by an even 18 ms
  bars 13-16  pass 4   the most confident: octaves + a parallel-fourths voice ...
  b16.1.5     CUT      ... and it is CUT mid-note, before the answer can settle (hard stop, tails cut to digital
                       zero).  "It ends cut mid-phrase, even on the album."

Harmony per 4 bars: Dbmaj9(#11) | Ab/C | Gbmaj7(#11) | Db/Ab (the bass never lands on F, his real home).  No chip, no bass instrument, no drums, no swing,
0 ms timing, even velocities.  The Ep1 D5 insert is tracks/e01-s29-d5.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import *   # noqa: E402,F401,F403
from keynote import keynote_track, keynote_pass, pedal_bars   # noqa: E402

ID = 'mm02-his-version'
CUT = (16, 1.5)

META = dict(
    id=ID,
    mm='MM-02',
    title='His Version',
    family='KEYNOTE REEL (s2.3)',
    tone='his flattering account: a keynote-reel piano, too clean, too still, in Db major -- and cut mid-note',
    usage='BI',
    tags=['keynote reel', 'mas\'s version', 'D5', 'unreliable narration', 'felt piano', 'library', 'brand music'],
    scenes=['Ep1 sc 29 [MAS\'S VERSION] (the 1-bar D5 insert: tracks/e01-s29-d5)', 'Ep2 under Rima\'s demo (his brand '
            'music in the world)', 'any later D5 (<= 1 per episode, 1-2 bars, a shade more confident each time)',
            'Ep8 Rashomon: Mas\'s render (uncut)', 'Ep12 (PROPOSED): the model plays it and nothing cuts it'],
    motifs=['KEYNOTE (the Water Line in Db major): b1, b5, b9, b13', 'its answer on Ab: b3, b7, b11, b15'],
    motif_ids=['KEYNOTE'],
    key='Db major / lydian: Dbmaj9(#11) | Ab/C | Gbmaj7(#11) | Db/Ab',
    composer='Composer E (OST batch 1)',
    description='4 passes x 4 bars, each a shade more confident (pass 1 = the Ep1-level voicing). Ends CUT at '
                'b16.1.5 (mid-note). Editor cut points that land mid-note: beat 2.5-4.5 of bars 2, 6, 10, 14 (the '
                'held Db5) and of bars 4, 8, 12 (the held Ab4); never on a bar line (the pedal is re-caught there). '
                'No loop by design: it grows every pass.',
    album_lufs=-16.0,
    audition=[],
)


def build():
    g = Grid(bpm=96, meter='4/4', bars=16, swing=0.0)
    a = Arr(g)
    T = palette()
    keynote_track(T)
    keynote_pass(a, 1, 1)
    keynote_pass(a, 5, 2)
    keynote_pass(a, 9, 3, octave=True)
    keynote_pass(a, 13, 4, octave=True, fourths=True)
    for k, b in enumerate((1, 5, 9, 13)):
        a.section(f'pass {k + 1}', b, b + 4)
        a.mark(f'pass {k + 1}', (b, 1))
    cut = g.t(*CUT)
    T['keynote'].pedal = pedal_bars(g, 1, 17)
    T['keynote_ch'].pedal = T['keynote'].pedal
    t = lambda b, bt=1: round(g.t(b, bt), 2)          # noqa: E731
    META['audition'] = [
        f'album 0-{t(5)} s: pass 1 -- pretty in the wrong way? Parody by POLISH (too clean, too even, too still), '
        f'never a sincere ad and never a wink',
        f'album 0-{t(3)} s against MM-01 0-{t(3)} s: the same shape (flat line, nudge, settle from the fifth below) -- '
        f'is his line recognisable under the major-key gloss?',
        f'album {t(5)}-{t(16)} s: each pass a shade more confident (a voice more, a wider spread) -- confidence, '
        f'not a crescendo into a climax',
        f'album {cut:.2f} s: the CUT mid-note, tails and all -- lands as the correction, not as a playback fault',
        'the felt timbre vs MM-01\'s real felt: same piano, "too clean" should read (no mechanics, no room, even '
        'touch, a glossy hall)',
    ]
    return Score(ID, g, T, a.notes, markers=a.markers, sections=a.sections, meta=META, length_s=cut,
                 mutes=[(cut, cut + 12.0)], tail_s=0.6)


if __name__ == '__main__':
    render_cli(build, __file__)
