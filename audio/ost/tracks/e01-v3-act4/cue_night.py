"""E01 v3 Act Four · S2 · THAT NIGHT: THE THIRD MARK · the carve -> the whip into the board's side

Act Four v5's S2 score (tracks/e01-act4-v5/s1-s4_s2_third_mark.py, MM-08 26A), copied and re-spotted: the felt's open
fifth on the carve is the music's re-entry after D6 (v3.3 polish X3: 0.4 s before the cut, under the post's last
palette step to night, 3 dB down); the nudge G4 sounds before "i don't keep score." so the V.O. sits
inside it; a violas-and-celli F/C pedal an octave above the room drone under the count and the TPOOL flash (no Mas
motif on it); the felt back on mark 3; the settle C4 -> F4; THE REWIND (E4, B-flat3 on the 16-bit sample-chip piano,
a retrograde); cut on the whip, where the board's side lands on the same frame.  Nothing below C3.
Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
from v3music import rebow   # noqa: E402

ID = 'e01-v3-a4-s2-night'
VO = 'a5-26a-01'


def build():
    mm08 = load_track('mm08-the-falling-tile')
    CARVE = A('S2.01')
    NUDGE = CARVE + 30
    PED0 = Lend(VO) + 8
    MARK1 = A('S2.02', 14)
    # v3.1: S2.03 (TPOOL) and S2.04 are cut; the Orb's light counts all three marks in S2.02 (mark 3 at + 36 f)
    MARK3 = A('S2.04', 13) if CLK.has('S2.04') else A('S2.02', 36)
    SETTLE = A('S2.05')
    WHIP = A(CLK.ORDER[CLK.ORDER.index('S2.05') + 1])      # the whip: Neleh's desk at 11:52 (v31-S3.00p)
    assert abs(SETTLE + 60 - WHIP) < 0.6 and NUDGE < Lon(VO), (SETTLE, WHIP, NUDGE)
    IN = CARVE - NIGHT_PRELAP_S * FPS                    # the re-entry: under the post's last palette step (v3.3 X3)
    cue = FCue(ID, IN, WHIP, pre=12)
    s = cue.s
    T = mm08._tweak(palette())
    T['felt'].gain_db += 3.0
    # v3.3: the softer re-entry (0.28) reads the felt's sympathetic ring at ~444 / ~217 Hz as an A over the F fifth
    # (the engine's spectral trace, class 'resonance'); notched there, as the Clock's pizz is in Act Three
    T['felt'].eq = list(T['felt'].eq) + [('peq', 442.0, -9.0, 5.0), ('peq', 218.0, -6.0, 5.0)]
    a = cue.a
    # (v3.3 X3: velocity 0.33 -> 0.28 with the -3 dB ride; the engine's cue normalisation gives part of a ride back,
    # and v3.2's entry read -16.2 LUFS over its first 400 ms)
    a.ch('felt', ['F3', 'C4'], s(IN), 1.25 + NIGHT_PRELAP_S, 0.28, lock=True, roll=0.008)
    a.n('felt_mech', 60, s(IN), 0.1, 0.3, lock=True)
    a.n('felt', 'G4', s(NUDGE), 3.75, 0.44, lock=True)
    rebow(a, 'vc', 'F3', s(PED0), s(MARK3) + 0.6, 0.15, seg=4.0, xf=1.0, first_att=1.6, last_rel=1.2, art='sus', lp=1100)
    rebow(a, 'vla', 'C4', s(PED0), s(MARK3) + 0.6, 0.13, seg=4.0, xf=1.0, first_att=1.8, last_rel=1.2, art='sus', lp=1300)
    a.n('felt', 'Eb4', s(MARK3), 0.9, 0.34, lock=True)
    a.n('felt_mech', 60, s(MARK3), 0.1, 0.3, lock=True)
    a.n('felt', 'C4', s(SETTLE), 0.62, 0.26, lock=True)
    a.n('felt', 'F4', s(SETTLE + 15), 0.62, 0.28, lock=True)
    a.n('snes_piano', 'E4', s(SETTLE + 30), 0.62, 0.26, lock=True)
    a.n('snes_piano', 'Bb3', s(SETTLE + 45), 0.62, 0.26, lock=True)
    T['felt'].pedal = [(-1.0, False), (s(IN) + 0.005, True), (s(PED0 + 30), False),
                       (s(MARK3) + 0.01, True), (s(SETTLE) - 0.02, False), (s(SETTLE) + 0.01, True),
                       (s(SETTLE + 30) - 0.01, False)]
    end = s(WHIP)
    cue.mutes.append((end, end + 3.0))
    for fr, lab, hit in [(IN, 'the re-entry after D6: the felt open fifth, 0.4 s before the carve\'s cut, under the '
                              'post\'s last palette step to night (3 dB down: a return, not a jolt)', True),
                         (CARVE, 'the carve (the cut to the dark room): the fifth already sounding', False),
                         (NUDGE, 'the nudge G4, sounding before the V.O.', True),
                         (PED0, 'the F/C pedal (the count, TPOOL: no motif)', False),
                         (MARK3, 'mark 3: the felt back (Eb4)', True), (SETTLE, 'the settle C4', True),
                         (SETTLE + 15, 'F4', True), (SETTLE + 30, 'THE REWIND: E4', True), (SETTLE + 45, 'Bb3', True),
                         (WHIP, "EXIT: the whip (pass one's downbeat)", False)]:
        cue.mark(fr, lab, hit=hit)
    for lab, a0, a1 in [('S2 26A: the carve and the V.O.', IN, PED0),
                        ('S2 the count and TPOOL: the pedal', PED0, MARK3),
                        ('S2 mark 3, the settle, the Rewind', MARK3, WHIP)]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title='That Night: The Third Mark (Ep1 v3 Act Four, S2, to picture)', mm='MM-08 (26A; Act Four v5 S2)',
        usage='BI', family='P01 DARK ROOM',
        tone='one felt in the dark after the silence; the count held, not counted; the Orb takes the settle back',
        scenes=[f'Ep1 v3 Act Four S2.01-S2.05, segment {CARVE / FPS:.3f}-{WHIP / FPS:.3f} s ({CLK.variant})'],
        motifs=["the Water Line's open fifth, nudge and settle (felt)", 'THE REWIND (16-bit retrograde)'],
        motif_ids=[], key='F, open fifths, no third',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 S2',
        underscore_lufs=-22.0, album_lufs=-18.0,
        vo_windows=[(s(Lon(VO)), s(Lend(VO)), '"i don\'t keep score." (the felt G4 alone)')],
        room_sfx=[dict(t0=s(CARVE), t1=end, sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=round(s(MARK1), 3), sfx='the Orb counts (the score holds; it does not count)'),
                   dict(t=round(s(SND('S2.02', 'render_front_sweep')), 3), sfx='render_front_sweep (the count)'),
                   dict(t=round(s(SND('S2.05', 'reverse_swell_1beat')), 3), sfx='reverse_swell_1beat (the SFX own it)')],
        audition=[f'{s(IN):.2f} s: the re-entry after D6, 0.4 s before the cut: a return, not a jolt or a sting',
                  f'{s(NUDGE):.2f}-{s(Lend(VO)):.2f} s: the G4 under "i don\'t keep score.": still, not sad',
                  f'{s(SETTLE):.2f}-{end:.2f} s: the settle and the Rewind, cut on the whip into pass one'])
    macro = [(0.0, NIGHT_ENTRY_DB), (s(NUDGE) - 0.35, NIGHT_ENTRY_DB), (s(NUDGE) - 0.05, 0.0)]   # the fifth 3 dB down
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=end + 0.3, tail_s=0.0, meta=meta)
    window = [IN / FPS - 0.01, WHIP / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(l, round(cue.fr(a0) / FPS, 4), round(cue.fr(a1) / FPS, 4)) for l, a0, a1 in cue.sections],
                 silences=[])
    return sc, cue.T0, window, extra
