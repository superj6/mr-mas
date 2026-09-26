"""E01-S30a  THE DOOR (STRAIGHT)  --  the editor's own violin track for Ep1 sc 30a      composer E (OST-BIBLE s5.E1 a)

"MUSIC: one sad violin, played straight, under the post only."  The one scripted exception to the dry rule:
the Door (s2.9, Alyi's motif) on a SOLO VIOLIN, SENZA VIBRATO (the VSCO solo violin de-vibrato'd by
../mm11-the-return/senza.py: vibrato band -15 dB), no portamento, no swell, no chip, no accompaniment; flat
level, each note its own bow.

The violin "stops dead on the first heart" -- the hearts rise "at the post's own pace, not on the beat", so the
stop is OFF the grid.  Lay this file at act frame 8310 (30.01 f15, the post; Ep1 Act Four lock v2) and cut it on
the first heart with a 3 ms fade and no tail (OST-BIBLE s6.6 rule 4).  The file itself is uncut: A-flat, D-flat,
C, then the G (the Door's #4: it never cadences) HELD, so the heart finds the violin mid-note wherever it lands.

REGISTER: the Door an octave below s2.9's flute pitch (Ab3 Db4 | C4 G3), on the violin's G string, ending on the
OPEN G -- an open string cannot vibrate, the plainest sound a violin makes.  It also keeps the violin out of Alyi's
voice: his post is SPOKEN (a4-30-01), so the 2-6 kHz rule applies; at the written octave the solo violin read
-8 dB in 2-6 kHz (limit -15) even heavily EQ'd, an octave down it reads about -22 dB with a mild EQ.

Pre-cut alternates (3 ms fade, tails cut, digital zero after), written by `python track.py` after the render:
    render/e01-s30a-the-door-stop-f<act frame>.wav   at act 8439 (the lock's first heart, 30.01 f144), 8427
    (half a beat early), 8451 and 8466 (the 2nd and 3rd hearts, if the first is re-timed onto them)
"""
import os
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', 'mm11-the-return')))
from engine import *   # noqa: E402,F401,F403
from senza import svln_track, prewarm   # noqa: E402

ID = 'e01-s30a-the-door'
ACT0 = 8310                         # file t = 0 = act frame 8310 (the post)
STOPS = [8439, 8427, 8451, 8466]    # act frames: the lock's first heart first

META = dict(
    id=ID,
    mm='MM-11',
    title='The Door (STRAIGHT violin, Ep1 sc 30a)',
    family='STRAIGHT (P01 sincere mode)',
    tone='one violin, played straight, under Alyi\'s regret post only; it stops dead on the first heart',
    usage='BI',
    tags=['straight', 'to picture', 'Ep1', 'violin', 'senza vibrato', 'editor-placed stop'],
    scenes=['E01-S30a (18:00): under the regret post; stop on the first heart (editor-placed, off the grid)'],
    motifs=['the Door (s2.9) an octave down: Ab3 Db4 | C4 G3 (the open G, held) -- ends on the #4, never cadences'],
    motif_ids=['DOOR'],
    key='Db lydian',
    composer='Composer E (OST batch 1)',
    description='Lay at act 8310 (lock v2). Uncut violin line; the editor cuts on the first heart (3 ms, tails cut). '
                'Pre-cut stops at act ' + ', '.join(str(f) for f in STOPS) + ' (render/*-stop-f*.wav); the lock\'s '
                'first heart is 8439 = 5.375 s into this file.',
    album_lufs=-18.0,
    underscore_lufs=-22.0,              # s5.E1: section a at -22
    audition=[
        '0-5 s: senza vibrato, no portamento, no swell -- sincere and plain; it must NOT read as "world\'s smallest '
        'violin" (no sob, no sweetness added)',
        'the -stop-f8439.wav alternate at 5.375 s (the lock\'s first heart): a dead stop mid-note, tails cut -- '
        'the laugh on the first heart, or a glitch?',
        'the violin timbre after de-vibrato: still a player (bow noise, slight intonation drift), not a synth',
    ],
)


def build():
    g = Grid(bpm=96, meter='4/4', bars=4, swing=0.0)       # t = 0 = act 8310, a beat (beat 3 of an act bar)
    a = Arr(g)
    T = palette()
    T['svln_nv'] = svln_track(gain_db=-1.0)
    prewarm(['Ab3', 'Db4', 'C4', 'G3'], vels=(0.5,))
    b = g.beats_s(1, 0.0)
    for p, k, nb in [('Ab3', 0, 2), ('Db4', 2, 2), ('C4', 4, 1), ('G3', 5, 8.5)]:
        a.n('svln_nv', p, k * b, nb * b + 0.03, 0.5, rel=0.14)
    a.section('the Door (the G held until the heart)', 1, 5)
    a.mark('the post (violin in)', (1, 1))
    return Score(ID, g, T, a.notes, markers=a.markers, sections=a.sections, meta=META, tail_s=2.5)


def write_stops(render_dir):
    """The pre-cut alternates: the underscore master cut mid-note at each STOP (3 ms fade, then digital zero)."""
    src = os.path.join(render_dir, f'{ID}-underscore.wav')
    x, sr = sf.read(src, always_2d=True)
    out = []
    for fr in STOPS:
        t = (fr - ACT0) / 24.0
        i = int(round(t * sr))
        f = int(0.003 * sr)
        y = x.copy()
        y[i:i + f] *= np.linspace(1, 0, f)[:, None]
        y[i + f:] = 0.0
        y = y[:i + f + int(0.25 * sr)]
        p = os.path.join(render_dir, f'{ID}-stop-f{fr}.wav')
        sf.write(p, y, sr, subtype='PCM_24')
        out.append((p, round(t, 4)))
    return out


if __name__ == '__main__':
    render_cli(build, __file__)
    for p, t in write_stops(os.path.join(HERE, 'render')):
        print(f'[{ID}] stop at {t} s -> {os.path.basename(p)}')
