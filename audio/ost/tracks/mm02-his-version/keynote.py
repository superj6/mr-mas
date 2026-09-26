"""The KEYNOTE REEL register (OST-BIBLE s2.3): MAS'S VERSION.  Shared by tracks/mm02-his-version (the library
version) and tracks/e01-s29-d5 (the Ep1 D5 insert).

"A soft keynote-reel piano (an original cue; his brand)" -- the Water Line made pretty: the same shape
(the flat line, the nudge, the settle from the fifth below) moved to Db MAJOR, on his own piano with
everything human removed:

  - the felt upright with NO mechanics (no felt_mech), NO room send, a glossy long hall + plate, a brighter,
    wider, 'finished' EQ (felt_post_bright + air) -- polish, not haze (s1.3: tape haze is NOT his version);
  - perfectly even velocities (vel_jit 0) and 0 ms timing (hum_ms 0, every note lock=True);
  - STRAIGHT (no swing), pedal down (changed exactly on the bar lines: a too-perfect pedal);
  - no chip, no bass instrument, no drums; one chord per bar and no rhythmic motion but the tune ("too still");
  - it is always CUT mid-note by the hard cut (D5); nothing rings on.

Harmony (s2.3): Dbmaj9(#11) | Ab/C | Gbmaj7(#11) | Db/Ab (s2.3 sketches "Db/F ..."; the bass here never lands
on F, his real home -- see VOICINGS).  Melody: KEYNOTE (s2.3) in bars 1-2; the answer in
bars 3-4 is the same shape a fifth lower on Ab (the knee's fourth, C -> F, heard from the other side),
landing open on the fifth.
"""
import os
import sys
from dataclasses import replace

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from engine import *   # noqa: E402,F401,F403

ANSWER = 'Ab4/4 Ab4/4 Ab4/4 Bb4/8 Ab4/8 | Eb4/4 Ab4/2.'

# one chord per bar; each pass adds one voice / widens the spread ("a shade more confident each use")
VOICINGS = {
    # pass 1: plain
    1: [['Db2', 'Ab2', 'F3', 'C4', 'Eb4', 'G4'],          # Dbmaj9(#11)
        ['C2', 'G2', 'Eb3', 'Ab3', 'C4'],                 # Ab/C
        ['Gb2', 'Db3', 'Bb3', 'F4', 'C5'],                # Gbmaj7(#11)
        ['Ab2', 'Db3', 'F3', 'Ab3']],                     # Db/Ab (not Db/F: his version never puts his real home
                                                          # note F in the bass -- and a low piano F's strong 5th
                                                          # partial reads as an A in the s6.9 chroma check)
    # pass 2: one more voice (the 9ths), an octave more at the bottom
    2: [['Db1', 'Db2', 'Ab2', 'F3', 'C4', 'Eb4', 'G4'],
        ['C2', 'G2', 'Eb3', 'Ab3', 'Bb3', 'C4'],
        ['Gb1', 'Gb2', 'Db3', 'Bb3', 'F4', 'Ab4', 'C5'],
        ['Ab1', 'Ab2', 'Eb3', 'F3', 'C4']],
    # pass 3: wider: the right hand's voicing lifted above the tune (a halo)
    3: [['Db1', 'Db2', 'Ab2', 'F3', 'C4', 'Eb4', 'G4', 'C6', 'F6'],
        ['C2', 'G2', 'Eb3', 'Ab3', 'Bb3', 'C4', 'Eb6'],
        ['Gb1', 'Gb2', 'Db3', 'Bb3', 'F4', 'Ab4', 'C5', 'Bb5', 'F6'],
        ['Ab1', 'Ab2', 'Eb3', 'F3', 'C4', 'Ab5', 'Db6']],
}
VOICINGS[4] = VOICINGS[3]


def keynote_track(T):
    """The too-clean felt: the same Upright KW as his real felt, every human thing removed, then polished."""
    post = lambda b: air(2.0, 1.0)(felt_post_bright(b))        # noqa: E731
    T['keynote'] = replace(T['felt'], name='keynote', post=post, sends={'hall': -6, 'plate': -11}, hum_ms=0,
                           vel_jit=0.0, drift_ms=0.0, width=1.0, pan=0.0, gain_db=0.0)
    T['keynote_ch'] = replace(T['keynote'], name='keynote_ch')     # the chords: same piano, own track (matcher)
    return T['keynote']


def keynote_pass(a, bar, k, mel_vel=0.46, chord_vel=0.36, melody=True, answer=True, octave=False, fourths=False):
    """One 4-bar pass from `bar` at confidence level k (1-4): KEYNOTE (bars 1-2) + the answer (bars 3-4).
    Every note locked (0 ms), even velocities; chords rolled by a perfectly even 18 ms."""
    V = VOICINGS[k]
    for i in range(4):
        a.ch('keynote_ch', V[i], (bar + i, 1), '4b', chord_vel, lock=True, roll=0.018 if k >= 3 else 0.0)
    if melody:
        lines = [(MOTIFS['KEYNOTE']['line'], bar)] + ([(ANSWER, bar + 2)] if answer else [])
        for text, b in lines:
            a.line('keynote', text, (b, 1), vel=mel_vel, lock=True, gate=1.0)
            if octave:                                   # pass 3-4: the tune in octaves
                a.line('keynote', text, (b, 1), vel=mel_vel * 0.86, lock=True, gate=1.0, transpose=12)
            if fourths:                                  # pass 4: one voice more, in parallel fourths (the title's
                a.line('keynote', text, (b, 1), vel=mel_vel * 0.8, lock=True, gate=1.0, transpose=-5)   # quartal)


def pedal_bars(g, b0, b1, extra_end=6.0):
    """Pedal down, re-caught exactly on every bar line (the too-perfect pedal)."""
    ev = [(0.0, False)]
    for b in range(b0, b1):
        t = g.t(b)
        ev += [(max(t - 0.012, 0.0), False), (t + 0.012, True)]
    ev.append((g.t(b1) + extra_end, False))
    return ev
