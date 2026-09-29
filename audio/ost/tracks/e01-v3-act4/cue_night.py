"""E01 v3 Act Four · S2 · THAT NIGHT: THE THIRD MARK · the carve -> the whip into the board's side

Act Four v5's S2 score (tracks/e01-act4-v5/s1-s4_s2_third_mark.py, MM-08 26A), copied and re-spotted: the felt's open
fifth on the carve is the music's re-entry after D6 (v3.3 polish X3: 0.4 s before the cut, under the post's last
palette step to night, 6.5 dB down, swelling in over 200 ms); the nudge G4 sounds before "i don't keep score." so the V.O. sits
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
    TPOOL = CLK.has('v35-43.01')                          # v3.5: TPOOL, rebuilt, between the count and the rewind
    WHIP = A(CLK.ORDER[CLK.ORDER.index('S2.05') + 1])      # the whip: Neleh's desk at 11:52 (v31-S3.00p)
    if TPOOL:
        # v3.5: S2.05 is 0.5 s longer at its head: the eye-light steps onto mark 3 first, then the rewind
        MARK3 = A('S2.05', 2)
        SETTLE = WHIP - 60
    else:
        MARK3 = A('S2.04', 13) if CLK.has('S2.04') else A('S2.02', 36)
        SETTLE = A('S2.05')
    assert abs(SETTLE + 60 - WHIP) < 0.6 and NUDGE < Lon(VO) and MARK3 < SETTLE, (SETTLE, WHIP, NUDGE, MARK3)
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
    PED1 = A('v35-43.01') + 6 if TPOOL else MARK3            # v3.5: the pedal gives way to TPOOL's 2008 palette
    rebow(a, 'vc', 'F3', s(PED0), s(PED1) + 0.6, 0.15, seg=4.0, xf=1.0, first_att=1.6, last_rel=1.2, art='sus', lp=1100)
    rebow(a, 'vla', 'C4', s(PED0), s(PED1) + 0.6, 0.13, seg=4.0, xf=1.0, first_att=1.8, last_rel=1.2, art='sus', lp=1300)
    if TPOOL:
        # v3.5 TPOOL (sc 43, v35-43.01-43.02): melancholy, in the 2008 palette (ERA TIERS T2, the main title's 2008-14
        # bar: the band through the 16-bit sample-chip, swung, A-flat colours, never F major; no tape, no drums).  The
        # dark room's felt line becomes the sample-chip piano's: the Water Line's head over D-flat maj7 as the staff
        # pass the sheet; passed again, over B-flat minor9, the line settles C4 -> F4 (it held: he walked out still in
        # charge), and A-flat/C rings as the CEO walks out, into the eye-light on mark 3 (the felt's E-flat4)
        T1, T2_ = A('v35-43.01'), A('v35-43.02')
        CEO = A('v35-43.02', 24)
        for inst, ps, f0, f1, v in (('snes_str', ['Db3', 'Ab3', 'C4', 'F4'], T1, T2_, 0.3),
                                    ('snes_str', ['Bb2', 'F3', 'Db4', 'C4'], T2_, CEO, 0.3),
                                    ('snes_str', ['C3', 'G3', 'Eb4', 'Ab3'], CEO, MARK3 + 10, 0.28)):
            for p in ps:
                a.n(inst, p, s(f0), (f1 - f0) / FPS + 0.15, v, lock=True, att=0.25, rel=0.5)
        sw = Q_ = 0.625
        for k, (p, beats) in enumerate((('F4', 1.0), ('F4', 1.0), ('F4', 1.0), ('G4', 0.5), ('F4', 1.5))):
            t_ = s(T1 + 3) + sum((1.0, 1.0, 1.0, 0.5)[:k]) * Q_ + (Q_ / 6 if k == 4 else 0.0)
            a.n('snes_piano', p, t_, beats * Q_ * 0.95, 0.4, lock=True)
        for k, (p, beats) in enumerate((('F4', 1.0), ('F4', 1.0), ('C4', 1.0), ('F4', 1.0))):
            a.n('snes_piano', p, s(T2_ + 3) + k * Q_, beats * Q_ * 0.95, 0.38, lock=True)
        a.n('snes_piano', 'Ab3', s(CEO), 1.2, 0.3, lock=True)
        a.n('snes_bass', 'Db2', s(T1), (T2_ - T1) / FPS, 0.34, lock=True)
        a.n('snes_bass', 'Bb1', s(T2_), (CEO - T2_) / FPS, 0.34, lock=True)
        a.n('snes_bass', 'Ab1', s(CEO), (MARK3 - CEO) / FPS + 0.3, 0.3, lock=True)
        del sw
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
                              'post\'s last palette step to night (6.5 dB down, a 200 ms swell: a return, not a hit)', True),
                         (CARVE, 'the carve (the cut to the dark room): the fifth already sounding', False),
                         (NUDGE, 'the nudge G4, sounding before the V.O.', True),
                         (PED0, 'the F/C pedal (the count' + ('' if TPOOL else ', TPOOL') + ': no motif)', False),
                         *([(A('v35-43.01') + 3, 'TPOOL (2008 palette, T2): the Water Line on the 16-bit sample-chip '
                             'piano over D-flat maj7 (the sheet passed)', True),
                            (A('v35-43.02') + 3, 'TPOOL: passed again (B-flat minor9): the line settles C4 -> F4', True),
                            (A('v35-43.02', 24), 'TPOOL: the CEO walks out still in charge: A-flat/C', True)]
                           if TPOOL else []),
                         (MARK3, 'mark 3: the felt back (Eb4)', True), (SETTLE, 'the settle C4', True),
                         (SETTLE + 15, 'F4', True), (SETTLE + 30, 'THE REWIND: E4', True), (SETTLE + 45, 'Bb3', True),
                         (WHIP, "EXIT: the whip (pass one's downbeat)", False)]:
        cue.mark(fr, lab, hit=hit)
    for lab, a0, a1 in ([('S2 26A: the carve and the V.O.', IN, PED0),
                         ('S2 the count: the pedal', PED0, A('v35-43.01')),
                         ('S2 TPOOL (v3.5): the 2008 palette, melancholy', A('v35-43.01'), MARK3),
                         ('S2 mark 3, the settle, the Rewind', MARK3, WHIP)] if TPOOL else
                        [('S2 26A: the carve and the V.O.', IN, PED0),
                         ('S2 the count and TPOOL: the pedal', PED0, MARK3),
                         ('S2 mark 3, the settle, the Rewind', MARK3, WHIP)]):
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
    # the fifth 6.5 dB down, swelling in over 200 ms from its onset (a fader ride on every stem: the felt's attack
    # arrives under it), then up to the cue's level before the nudge
    macro = [(0.0, -60.0), (s(IN) - 0.002, -60.0), (s(IN) + NIGHT_SWELL_S, NIGHT_ENTRY_DB),
             (s(NUDGE) - 0.35, NIGHT_ENTRY_DB), (s(NUDGE) - 0.05, 0.0)]
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=end + 0.3, tail_s=0.0, meta=meta)
    window = [IN / FPS - 0.01, WHIP / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(l, round(cue.fr(a0) / FPS, 4), round(cue.fr(a1) / FPS, 4)) for l, a0, a1 in cue.sections],
                 silences=[])
    return sc, cue.T0, window, extra
