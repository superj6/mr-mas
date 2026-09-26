"""E01 Act Four v4 · S1a · THE PLAN (MM-07 re-laid to the v4 picture) · act 0-525 (lock v4.1)

One performance from the suite to the JOIN click, re-laid from MM-07's own notes (tracks/mm07-how-to-fire-a-ceo,
build_picture()) at 96 BPM on the act's own beat grid (the v4 lock keeps THE PLAN's marks on it: the stamp, the
walk-offs, VOTES: 0, the moth, the tear and the click all sit on 15-frame beats).  k = 1 everywhere: nothing is
time-scaled; phrases are chosen, reordered and joined on beats.

  act     source (MM-07 picture cue)                          v4 picture
  0-114   sc 24: the felt Water Line bar, the C4 hangs         S1.01-S1.02 the suite, the nudge, the glow
          (the piano stem is gated on the blueprint's cut)
  120-150 WORD b1.3-b2.1: the Blueprint's first two notes     S1.03 the stamp HOW TO FIRE A CEO (its hit)
  150-240 the waltz b4.1-b5.3: F F F | F G Ab                 the three walk off on F F F (150/165/180),
          (its own players, tails gated at 240)               "Four of us vote."; the C never comes
  240-300 the 4/4 Blueprint resumes b7.2-b8.1 ON the beat     "This board controls the company.", the tilt
          (v4.1: no musical-chairs rest: it fell inside a line and read as a dropout)
  300-420 the labels b9-b10, one note a label                 COMPANY / the cut to the 2x detail (330) /
          (C on VOTES: 0 at 360, the rest on EQUITY: 0,       "The investor gets-" / VOTES: 0 / "And the CEO
          the moth's celesta flutter at 405)                  owns-" / EQUITY: 0 / the moth
  390-420 the held quartal chord (b13.3) under                "Good question.", the two zeros side by side
          "Good question."
  420-465 PLAN b11.3-b12.2: the harp draws the path; one      S1.05 the four walk onto 1. NOON (tick at 450)
          tick (the later ticks are left out: no spoiler)
  465-525 BREAK: the stuck G-Ab loop; the tape-stop from      the curl, the tear (S1.05 marks), JOIN (525)
          the tear reaches zero ON the JOIN click
v4.1 (lock v4.1): S1.04 is two beats shorter, so everything from the path on sits 30 f (2 beats) earlier, still on
the grid; the felt rings through the blueprint's cut (the piano gate moves 1.5 s later, after its tail); the rest is
gone (the waltz's tails still gate at 240, on the downbeat where the 4/4 resumes).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *   # noqa: E402,F401,F403

ID = 'e01-act4-v4-s1-the-plan'
F0, F1 = 0, M('S1.06', 'click')          # 0 -> 525 (lock v4.1)
mm07 = load_track('mm07-how-to-fire-a-ceo')


def build():
    src = mm07.build_picture()
    cue = Cue(ID, F0, F1)
    s = cue.s
    P = lambda bar, beat=1.0: 5.0 + (bar - 1) * 2.5 + (beat - 1) * 0.625   # noqa: E731  (PLAN bar -> source s)
    T = mm07.tracks()
    rest0 = 240                                                           # v4.1: the waltz ends here; no rest
    T = mm07.waltz_tracks(T, s(rest0))                                    # the waltz's own reverb, gated on the downbeat
    SH_ = A('S1.05') - 456                                                # v4.1: the path onward moves with S1.05 (-30 f)
    # the viola pizz samples ring a fixed body resonance at ~222.7 Hz (an A3; the octave of the 111 Hz mode MM-08 and
    # MM-09 notch) under the F pad when the pulse resumes: the same narrow notch on the viola only
    T['vla'].eq = list(T['vla'].eq) + [('peq', 222.7, -10.0, 10.0)]
    N = src.notes
    add = cue.notes.extend
    # sc 24: the felt, ringing into the glow; the blueprint's cut (S1.03 f0) gates the piano stem
    add(remap(N, 0.0, 5.0, s(0)))
    T['felt'].pedal = [(-0.05, True), (2.51, False), (2.55, True), (s(A('S1.03') + 8), False)]   # v4.1: it rings into WORD
    # WORD: the Blueprint on the stamp (its first two notes, the pulse, the roots, the pad)
    add(remap(N, P(1, 3), P(2, 1), s(120)))
    # the waltz: F F F | F G Ab (the three walk off on the flat line), its tails gated at the rest
    add(remap(N, P(4, 1), P(5, 3), s(150)))
    # the 4/4 Blueprint resumes (the pulse and the Fm11 pad) on the waltz's last downbeat: no rest (v4.1)
    add(remap(N, P(7, 2), P(8, 2), s(rest0)))
    # the labels, one Blueprint note a label (C = VOTES: 0; the rest = the EQUITY: 0 stamp; the moth)
    add(remap(N, P(9, 1), P(11, 1), s(300)))
    # the held quartal chord (pp) under "Good question." and the two zeros side by side
    add(remap(N, P(13, 3), P(13, 3) + (450 + SH_ - 390) / 24.0, s(390), keep={'vc', 'vla', 'vln2', 'vln1', 'glasspad'}))
    # the path: the harp draws it; the Q_G pad (it started a bar earlier in the source) carries its first beats
    pads = {'vc', 'vla', 'vln2', 'vln1'}
    PATH = 450 + SH_
    add([n for n in remap(N, P(11, 1), P(11, 1) + 0.01, s(PATH), keep=pads, truncate=False) if 'lp' in n.x])
    path = remap(N, P(11, 3), P(11, 3) + 1.875, s(PATH))
    tick1 = s(PATH) + (P(12, 1) - P(11, 3))
    path = [n for n in path if not (n.inst == 'woodclick' and abs(n.start - tick1) > 0.05)]
    add(path)
    for n in cue.notes:                                                    # the pad from P11.1 lasts 1.25 s here
        if n.inst in pads and 'lp' in n.x and abs(n.start - s(PATH)) < 1e-6:
            n.dur = min(n.dur, 1.25)
    # BREAK: the stuck loop, then the tape-stop from the tear to zero on the JOIN click
    add(remap(N, P(16, 1), P(16, 1) + 2.5, s(495 + SH_)))
    t_tear, t_join = s(M('S1.05', 'tear')), s(F1)
    posts = mm07.stem_posts([(t_tear, t_join, t_join + 10.0)], {'piano': s(A('S1.03') + 36)})   # v4.1: after the felt's tail
    # sync marks (the cue sheet and the MIDI file)
    for f, lab in [(0, 'S1.01 the suite: the felt Water Line bar'), (60, 'the C4 hangs: the settle never comes'),
                   (A('S1.03'), 'the blueprint cut: the felt rings on into WORD'), (120, 'the stamp: WORD'),
                   (150, 'the waltz: the first walk-off (F)'), (165, 'walk-off 2 (F)'), (180, 'walk-off 3 (F)'),
                   (rest0, 'the 4/4 Blueprint resumes (no rest)'),
                   (300, 'the labels'), (360, 'VOTES: 0 (C)'), (390, 'EQUITY: 0 (the label rest) + the held chord'),
                   (405, 'the moth'), (PATH, 'the path'), (PATH + 30, 'tick 1: 1. NOON'), (495 + SH_, 'BREAK: stuck'),
                   (M('S1.05', 'tear'), 'the tear: the tape-stop starts'), (F1, 'JOIN: the tape reaches zero')]:
        cue.mark(f, lab)
    for lab, a0, a1 in [('sc 24 the suite (felt)', 0, 114), ('WORD', 120, 150), ('the waltz (musical chairs)', 150, 240),
                        ('the Blueprint resumes', 240, 300), ('the labels', 300, 420),
                        ('the held chord', 390, PATH), ('the path', PATH, 495 + SH_), ('BREAK + tape-stop', 495 + SH_, F1)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'How to Fire a CEO Who Owns Nothing. (Ep1 Act Four v4, S1a, to picture)', mm='MM-07', family='P14 BLUEPRINT',
        tone='THE PLAN as one performance from the suite to the JOIN click: cheerful, accurate, and it breaks',
        scenes=['v4 S1.01-S1.06, act 0-525 (lock v4.1); file t=0 = act frame 0'],
        motifs=['the Water Line bar 1 (felt; the settle never comes)', 'the Blueprint (chip box + celesta)',
                'the knee-cell waltz F F F | F G Ab (the C never comes)', 'the Blueprint break + tape-stop'],
        motif_ids=['BLUEPRINT'], key='F dorian (quartal; no A natural); sc 24 F minor', underscore_lufs=-16.0,
        album_lufs=-16.0,
        silence_windows=[],
        sfx_slots=[dict(t=s(121), sfx='rubber_stamp_C: HOW TO FIRE A CEO'), dict(t=s(360), sfx='stamp VOTES: 0'),
                   dict(t=s(399), sfx='stamp EQUITY: 0'), dict(t=s(F1), sfx='the JOIN click (tape at zero)')],
        audition=['0-4.75 s: the felt bar, then the blueprint cut at 4.75 s: the felt rings on into WORD',
                  '6.25-10.0 s: the three walk-offs on the waltz\'s F F F; the 4/4 resumes on the downbeat at 10.0 s '
                  '(v4.1: no rest)',
                  '12.5-18.75 s: the labels under Neleh\'s read (ducked in the mix): C on VOTES: 0 at 15.0 s; the '
                  'held chord under "Good question." from 16.25 s',
                  f'{s(495 + SH_):.1f}-{s(F1):.1f} s: stuck, then the tape-stop onto the JOIN click'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, stem_post=posts,
                 mutes=cue.mutes, length_s=s(F1), tail_s=0.4, meta=meta)


if __name__ == '__main__':
    render_cli(build, __file__)
