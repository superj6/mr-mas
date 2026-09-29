"""E01 v3 Act Four · S6 · THE AVALANCHE · SET-PIECE SWING (MM-10 form b), the episode's one full band

Act Four v5's S6 (tracks/e01-act4-v5/s5-s8_s6_avalanche.py), copied and re-spotted: MM-10's own avalanche bars at
exactly 96 BPM from S6.01's first frame, each phrase arriving whole (the compile; the Build at 16 and the brass kick;
Step Four's G-flat with Alyi resisting one beat; Neleh's window with no lead; the board's bowed F pedal ending
silently on THE QUIET VOTE; the Water Line augmented; THE FULL BAND on C7(#9b13)), to a DEAD STOP on Mada's label
(`MADA · LAST FIRER STANDING`, freeze_hit_F owns the onset).  In the v3 lock the label lands where it did in v5
relative to S6.01 (22 2/3 beats: the swung "and" of beat 3, bar 6); if a re-timed lock moves it, the stop follows the
label and the last bar is cut there.  Digital zero from the label to the Monday bullpen (the dark room's air holds it).
Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import remap   # noqa: E402

ID = 'e01-v3-a4-s6-avalanche'
Q = 0.625


def build():
    c = C.CLK
    E = dict(av=c.B('S6.01'), mas=c.B('S6.02'), alyi_tile=c.B('S6.03'), alyi_left=c.txt('S6.03', 'ALYI left'),
             neleh_on=c.Lon('a5-29-24'), neleh_end=c.Lend('a5-29-24'), neleh_drop=c.txt('S6.04', 'NELEH left'),
             mada=c.B('S6.06'), qv=c.txt('S6.06', 'THE QUIET VOTE'), label=c.txt('S6.06', 'MADA'),
             freeze=c.snd('S6.06', 'freeze_hit_F'), s7=c.B('S7.01'))
    F0 = int(round(E['av'] * FPS))
    cue = SCue(ID, F0, int(round(E['s7'] * FPS)), swing=1.0)
    s, g = cue.s, cue.g
    mm10 = load_track('mm10-his-side-745')
    src = mm10._score(album=False)
    T = src.tracks
    for k in ('ubass', 'cb_pizz'):
        T[k].eq = list(T[k].eq) + [('peq', 111.3, -10.0, 8.0)]
    N = src.notes
    ta = lambda k: src.grid.t(23 + k)                         # noqa: E731  avalanche bar k -> source seconds
    assert abs(ta(1) - 58.75) < 1e-6 and abs(ta(13) - 88.75) < 1e-6, (ta(1), ta(13))
    lab_s = s(round(E['label'] * FPS) / FPS)
    beat = lambda b: b * Q                                     # noqa: E731
    on_swing = abs(lab_s - beat(22) - 10 / 24) < 0.02
    add = cue.notes.extend
    qv = s(E['qv'])
    compressed = lab_s < beat(16)          # v3.5: the quicker board exit: the label 11.4 beats in (v3.4: 22 2/3)
    if not compressed:
        add(remap(N, ta(1), ta(2), beat(0)))
        add(remap(N, ta(2) + 2 * Q, ta(3), beat(2), keep={'ubass', 'cb_pizz'}))
        add(remap(N, ta(4), ta(5), beat(4)))
        add(remap(N, ta(6), ta(8), beat(8)))
        q8 = [n for n in remap(N, ta(8) + 1.0, ta(8) + 1.6, beat(14.5), truncate=False, keep={'cb', 'vc', 'hn'})
              if n.dur > 1.0]
        for n in q8:
            n.dur = max(0.1, qv - n.start)
            n.x['rel'] = 0.35
        add(q8)
        add(remap(N, ta(9), ta(10), beat(16)))
        add(remap(N, ta(13), ta(13) + max(0.1, lab_s - beat(20)), beat(20)))
        marks_ = [(0, 'A1: the compile (timpani F, the Build 4)'), (4, 'A4: the Build at 16'),
                  (7, 'A4 beat 4: the brass kick (end of phrase 1)'), (8, "A6: Step Four's G-flat"),
                  (10, 'ALYI RESISTS (A6.3): timpani G-flat, the plucked no'), (16, 'A9: the Water Line augmented'),
                  (20, 'A13: THE FULL BAND, C7(#9b13)')]
        b_pedal, b_full = 14.5, 20
    else:
        # v3.5: the board exits in 7 s, so the avalanche is MM-10's own bars, compressed to the picture: the compile
        # under the tiles (A1); Step Four's G-flat on Mas's tile and ALYI RESISTS one beat as his tile goes (A6, cut
        # before Neleh); Neleh's window, no lead, on the board's bowed F pedal (A8's), ending silently on THE QUIET
        # VOTE; THE FULL BAND on C7(#9b13) (A13) a beat before Mada's shot, cutting her "char-" off, to the dead stop
        # on his label.  (The Build at 16 and the Water Line augmented have no room: the whole avalanche is 11 beats)
        b_pedal, b_full = 7.5, 9
        add(remap(N, ta(1), ta(2), beat(0)))
        add(remap(N, ta(2) + 2 * Q, ta(3), beat(2), keep={'ubass', 'cb_pizz'}))
        add(remap(N, ta(6), ta(6) + beat(b_pedal - 4), beat(4)))
        q8 = [n for n in remap(N, ta(8) + 1.0, ta(8) + 1.6, beat(b_pedal), truncate=False, keep={'cb', 'vc', 'hn'})
              if n.dur > 1.0]
        for n in q8:
            n.dur = max(0.1, qv - n.start)
            n.x['rel'] = 0.35
        add(q8)
        add(remap(N, ta(13), ta(13) + max(0.1, lab_s - beat(b_full)), beat(b_full)))
        marks_ = [(0, 'A1: the compile (timpani F, the Build 4), under the tiles'),
                  (4, "A6: Step Four's G-flat (Mas's tile)"),
                  (6, 'ALYI RESISTS (A6.3): timpani G-flat, the plucked no (his tile goes)'),
                  (b_pedal, "the board's bowed F pedal: Neleh's window, no lead (v3.5)"),
                  (b_full, 'A13: THE FULL BAND, C7(#9b13), a beat before Mada\'s shot (it cuts her "char-" off)')]
    cue.notes[:] = [n for n in cue.notes if n.start < lab_s - 0.005]
    cue.mutes.append((lab_s, s(E['s7']) + 0.5))
    for b_, lab in marks_:
        if beat(b_) < lab_s:
            cue.mark(cue.act(beat(b_)), lab)
    cue.log += [(E['neleh_on'], "NELEH's window (A7): no lead", False),
                (cue.act(beat(b_pedal)), "the board's bowed F pedal enters (A8's)", False),
                (E['qv'], 'THE QUIET VOTE: the F pedal ends silently', False),
                (E['label'], "STOP: dead on MADA's label (freeze_hit_F owns the onset); digital zero to the bullpen",
                 False)]
    secs_ = ([('S6 phrase 1: the compile (A1, A4)', 0, 8), ('S6 phrase 2: Step Four, Alyi, Neleh (A6-A7)', 8, 16),
              ('S6 phrase 3: the Water Line, the quiet vote (A9)', 16, 20),
              ('S6 phrase 4: the full band (A13) -> the stop', 20, lab_s / Q)] if not compressed else
             [('S6 phrase 1: the compile (A1)', 0, 4), ('S6 phrase 2: Step Four, Alyi resists (A6)', 4, b_pedal),
              ("S6 Neleh's window: the board's F pedal, the quiet vote", b_pedal, b_full),
              ('S6 the full band (A13) -> the stop', b_full, lab_s / Q)])
    for lab, b0, b1 in secs_:
        cue.section(lab, cue.act(beat(b0)), cue.act(min(beat(b1), lab_s)))
    meta = dict(
        id=ID, title='The Avalanche (Ep1 v3 Act Four, S6, to picture)', mm='MM-10 b (Act Four v5 S6, re-spotted)',
        usage='BI', family='P11 SET-PIECE SWING (MM-10 form b, 96 BPM, k = 1)',
        tone='the company falls into his lap as a swung avalanche that stops dead on the one man who will not move',
        scenes=[f'Ep1 v3 Act Four S6.01-S6.06, segment {E["av"]:.3f}-{E["label"]:.3f} s ({c.variant}); the label '
                f'{"on" if on_swing else "OFF"} the swung and of beat 3, bar 6'],
        motifs=['the Build as the swung chip lead (4 -> 16)', 'Step Four (G-flat; Alyi resists one beat)',
                "the board's bowed F pedal", 'the Water Line augmented', "the full band on C7(#9b13); Mada's spinner"],
        motif_ids=['BUILD', 'STEP_FOUR'], key='F minor -> B-flat minor (Step Four) -> F -> C7(#9b13), unresolved',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 S6',
        underscore_lufs=-17.0 if not compressed else -18.5, album_lufs=-16.0,   # v3.1: -1 dB with the -2 dB peak
        # ride = the peak ~2 dB down; v3.5 (11 beats: the quiet compile and window pull the mean down, so the engine's
        # normalisation lifted the full band to -14.9): -18.5, the full band back near v3.4's -16.8
        sfx_slots=[dict(t=round(s(c.snd('S6.01', 'landing_thunk', k)), 3), sfx=f'tile landing {k + 1}') for k in range(5)]
        + [dict(t=round(s(E['neleh_drop']), 3), sfx="landing_thunk: Neleh's tile goes"),
           dict(t=round(lab_s, 3), sfx='freeze_hit_F: MADA · LAST FIRER STANDING (owns the stop)')],
        audition=['0.0 s: does the avalanche erupt out of the 2 AM ring-out (no pickup, no riser)?',
                  f'{beat(10):.2f} s: Alyi resists one beat: resistance, not a dropout?',
                  f'{beat(20):.2f}-{lab_s:.2f} s: the full band and the dead stop on the swung "and": the laugh on '
                  'the label, never a glitch'])
    # v3.1 (the lead, 2026-09-27): the peak about 2 dB down (phrases 3-4: the Water Line augmented, the full band),
    # ramped in over the last half-beat of phrase 2, off Neleh's line.  The engine normalises the cue to its target,
    # so the ride alone lifted phrases 1-2 (render 8: the peak only -0.9 dB); the target goes to -17 with it
    if not compressed:
        macro = [(0.0, 0.0), (beat(15.5), 0.0), (beat(16), -2.0), (s(E['s7']) + 1.0, -2.0)]
    else:
        # v3.5 (render 1: Step Four / Alyi read -14.6 LUFS over 2.2 s, the full band -16.3): phrase 2 -2.5 dB, the
        # full band -1 dB, so the full band stays the peak and nothing passes the featured guide
        macro = [(0.0, 0.0), (beat(3.8), 0.0), (beat(4), -2.5), (beat(b_pedal - 0.2), -2.5), (beat(b_pedal), -1.0),
                 (s(E['s7']) + 1.0, -1.0)]
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=s(E['s7']), tail_s=0.0, meta=meta)
    window = [E['av'], round(E['label'] * FPS) / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(lab, round(cue.act(a0), 4), round(cue.act(a1), 4)) for lab, a0, a1 in cue.sections],
                 silences=[(round(E['label'] * FPS) / FPS, E['s7'] + 0.0,
                            "the dead stop on MADA's label -> the Monday bullpen (the dark room's air, then the "
                            "bullpen's, hold it)")],
                 label_on_swing=on_swing)
    return sc, cue.T0, window, extra
