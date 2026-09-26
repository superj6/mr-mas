"""TEMPLATE -- copy this folder to tracks/<id>/ (mm##-<slug> for album / library tracks, e<ep>-s<scene>-<slug>
for to-picture cuts; OST-BIBLE s6.3) and write your cue in build().

Run:   ../../../.venv-theme/bin/python track.py [--no-stems --no-loop]      (drafts: fast, small)
       ../../../.venv-theme/bin/python track.py --verify-loop               (finals: every s6.9 check)
       python ../../build.py <id>                                           (or every track: python ../../build.py)
Out:   render/<id>-album.wav|mp3, <id>-underscore.wav|mp3, stems/*.flac, <id>-loop.wav, <id>-loop-tail.wav,
       <id>-loop-x3-preview.mp3, <id>.mid, <id>-pianoroll.png, <id>.cue.json      (engine/README.md)

HOUSE TEMPO IS 96 BPM (1 bar = 60 frames = 2.5 s; the picture grid).  The 24 rule (OST-BIBLE s0): a to-picture
cue in a bar-timed scene uses a multiple of 24 BPM (48, 72, 96, 120, 144, 192) with meter n/4, n = BPM / 24,
so every picture bar is a downbeat.  Library cues may use any tempo, but lock their loops with
frame_lock_bpm().  HOUSE SWING is swing=1.0 (the swung eighth +10 frames at 96 BPM): Mas and the people swing;
the machine, the board, the record and THE PLAN play straight (swing=0, lock=True).

The house sound (showrunner notes, binding): between PIANO, ORCHESTRAL and BIG BAND -- big-band brass as
ACCENTS, not the engine -- with some jazz feel, and 8-bit chip motifs as the show's identity.  Use the named
motifs (engine.motifs.MOTIFS, from the OST-BIBLE s2) so every composer places the same notes.  Nothing corny:
no sad-trombone falls on punchlines, no mickey-mousing, no heartbeat pulses, no data bleeps or glitch
stutters, no 808 / trap outside diegetic source (era.futz), no tape wow on Mas's own memories.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403

META = dict(
    id='_template',
    mm='',                              # 'MM-07' (the album / library number)
    title='Template Cue',
    family='P01',                       # the OST-BIBLE s3 palette
    tone='what this cue is FOR, in one line (e.g. "quiet dread under a boardroom stand-off")',
    usage='BI',                         # BI background instrumental | VI visual | MT main title | ET end title
    tags=['template'],
    scenes=[],                          # where the editor might use it
    motifs=['the flat line (chip, bar 3)'],
    motif_ids=['FLAT_LINE'],            # checked by the motif matcher (engine.motifs.MOTIFS names)
    key='F minor',
    composer='',
    album_loops=1,                      # >1 repeats the loop body in the album version
    # album_lufs=-16.0,                 # quiet cues: the album loudness (default -14)
    # underscore_lufs=-16.0,            # FEATURED cues (wordless set-pieces, runs, THE PLAN): -16 (default -20)
    # silence_windows=[((9, 1), (10, 1), 'real line', -70)],     # (t0, t1, label, max dBFS); D6 mutes add -90
    # no_third_windows=[((6, 1), (7, 1))],                       # buttons, the verdict: A and Ab <= 0.06 of F
    # vo_windows=[((3, 1), (5, 1))],                             # composed V.O. windows: -24 LUFS +-2
    # sfx_slots=[dict(t=(5, 1), sfx='ka_ching')],                # where the SFX own the downbeat
    # diegetic_tracks=['h808'],                                  # in-world source (808 / trap only here)
    audition=['3-6 items, each with a timecode: what a human must hear before this ships'],
)


def build():
    # 1. time: the house tempo and swing
    g = Grid(bpm=96, meter='4/4', bars=6, swing=1.0)
    a = Arr(g)
    T = palette()                       # every instrument; tweak per cue, e.g. T['felt'].gain_db = -2

    # 2. harmony (the Water Line's changes)
    prog = progression(g, [(1, 'Fm(add9)'), (2, 'Dbmaj7'), (3, 'Bbm9'), (4, 'C7sus(b9)'), (5, 'Fm(add9)')])

    # 3. notes
    comp(a, 'felt', prog, style='charleston', kind='rootless_a', around='C4', vel=0.42, bars=(1, 6))
    walking_bass(a, 'ubass', prog, bars=(2, 6), layer='cb_pizz')
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...x.
        kick:  x...x...
        hatf:  ..x...x.
    ''', bars=(2, 6))
    place_motif(a, 'lead', 'FLAT_LINE', (3, 1), vel=0.45, duty=0.125, rel=0.05)
    art.legato(a, 'vln1', [('C5', (4, 1), '2b'), ('Bb4', (4, 3), '1b'), ('Ab4', (4, 4), '5b')], vel=0.45)
    a.ch('felt', voice('F9sus4', 'quartal', n=5), (6, 1), '4b', 0.4)     # the button: no third
    a.n('lead', 'F6', (6, 1), '4b', 0.45, duty=0.25, vib=12, rel=0.4)

    # 4. structure + sync points (they go in the cue sheet and the MIDI file)
    a.section('intro', 1, 2)
    a.section('loop', 2, 6)
    a.section('button', 6, 7)
    a.mark('button', (6, 1))
    META['no_third_windows'] = [(g.t(6) + 0.05, g.t(7))]

    # 5. the score: loop = the seamless loop body (bars 2-5 here); mutes=[(t0, t1)] for hard stops (D6)
    return Score(META['id'], g, T, a.notes, loop=g.span(2, 6), markers=a.markers, sections=a.sections, meta=META)


if __name__ == '__main__':
    render_cli(build, __file__)
