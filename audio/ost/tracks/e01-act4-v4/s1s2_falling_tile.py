"""E01 Act Four v4 · S1b + S2 · THE FALLING TILE (MM-08 re-laid to the v4 picture) · act 555-1298 (v4.0), 525-1254 (v4.1)

v4.1 (lock v4.1): the speaker-view pin on Alyi is cut, so LEVERAGE runs 3.5 bars (14 beats) from JOIN to Cancel and
its quiet window is gone; every event is anchored to the lock (the card, the dialog, the eyes strip, the arrow's steps,
the V.O., mark 3, the Orb's lift) instead of v4.0's frame numbers. The table below gives the v4.0 frames.

LEVERAGE (low) from the JOIN click to the Cancel click as ONE take (4 bars on the act's own beat grid: the click
is exactly 16 beats after JOIN), then D6 (every stem to digital zero, 3 ms, until the carve), then 26A: a single
felt in the dark room, a low F/C pedal under the TPOOL insert (no Mas motif under (REPORTED) material), the felt
back on mark 3, the settle, and the Rewind cut on S3's downbeat.  Material, voices and settings are MM-08's
(tracks/mm08-the-falling-tile: leverage() cells, _tweak() levels, dark_room()'s notes); the bar plan is v4's.

  act       what                                                         v4 picture
  555       LEVERAGE: the first eighth on the JOIN click                  S1.06 click -> S1.07 the call
  590-637   Neleh's clockwork pizzicato rides her card                    card at 590
  630       one felt F4 (his calm), pp                                    the grid, the vote icons
  660-690   everything but the eighths drops: Alyi's mouth moves, no sound  pin at 655, caption ...
  692-718   the 1-bit beeper F4 F5 F4, uneven                             the dialog pops (692)
  720-795   the cluster up a semitone, violins trem "sul pont", Mada's    S1.08 the eyes strip (720)
            spinner
  750/765/780 STEP FOUR on the arrow's steps (Bbm(add9), Ab(add9), Gbmaj7)  S1.09 the ALYI cursor
  795       HARD STOP = D6 (step four is the click)                       Cancel
  980       the felt's open fifth F3+C4 on the first stroke (the re-entry)  S2.01 the carve
  1010      the nudge G4, one sustained note under the V.O.               "i don't keep score."
  1062-1230 low strings sul tasto F2+C3, pp: the pedal from the V.O.'s end, under the count     S2.02-S2.04 the Orb counts; F1.2 TPOOL
            and the TPOOL insert (the felt is out: no Mas motif under
            REPORTED material)
  1215      the felt resumes: Eb4 (the b7, unresolved)                    mark 3
  1238/1253 the settle C4 -> F4                                           S2.05 the iris lifts
  1268/1283 THE REWIND: E4, Bb3 on the 16-bit sample-chip piano            rewinding...
  1298      the cut (sc 27's downbeat; MM-09 enters)                      the whip, S3.01
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *   # noqa: E402,F401,F403

ID = 'e01-act4-v4-s1s2-the-falling-tile'
F0, F1 = M('S1.06', 'click'), A('S3.01')            # 525 -> 1254 (lock v4.1; v4.0: 555 -> 1298)
CLICK = M('S1.09', 'click')                          # 735: 14 beats after JOIN (v4.1: 3.5 bars; v4.0 16 beats)
CARVE = A('S2.01')                                   # 924
CARD, DIALOG, EYES = A('S1.07') + 14, M('S1.07', 'dialog'), A('S1.08')          # 560, 630, 660
STEP1, STEP2, STEP0 = M('S1.09', 'step1'), M('S1.09', 'step2'), A('S1.09')      # 705, 720, 690
mm08 = load_track('mm08-the-falling-tile')


def leverage_v4(sec, T, f):
    """LEVERAGE (low) as one 4-bar take, mm08.leverage()'s cells and voices; f(frame) -> seconds on sec's grid."""
    a, g = sec.a, sec.g
    cells = [['F2', 'C3', 'F2', 'F2', 'Gb2', 'F2', 'C3', 'F3'],
             ['F2', 'C3', 'F3', 'F2', 'Gb2', 'C3', 'F2', 'Gb2'],
             ['F2', 'F2', 'C3', 'F2', 'Gb2', 'F2', 'Db3', 'C3'],
             ['F2', 'C3', 'F2', 'Gb2', 'F2', 'C3', 'F3', 'C3']]
    acc = [1.0, 0.78, 0.86, 0.8, 0.94, 0.78, 0.88, 0.82]
    quiet0, quiet1 = 1e9, 1e9                    # v4.1: no quiet window (the speaker-view pin on Alyi is cut)
    eyes = f(EYES)
    for bar in range(1, 5):
        cell = cells[(bar - 1) % 4]
        for i, p in enumerate(cell):
            t = g.t(bar, 1 + 0.5 * i)
            if t >= eyes - 1e-6:
                p = {'F3': 'Gb3'}.get(p, p)      # the cluster moved: the pizz follows its Gb
            a.n('vc', p, t, '1/8', 0.46 * acc[i], lock=True, art='pizz')
        a.n('cb', 'F1', (bar, 1), '1/4', 0.5, lock=True, art='pizz')
        t35 = g.t(bar, 3.5)
        if bar % 2 == 0 and not (quiet0 <= t35 < quiet1):
            a.n('cb', 'F1', t35, '1/4', 0.4, lock=True, art='pizz')
    thud = {1: [1.0, 4.0], 2: [2.5], 3: [3.5], 4: [1.0]}
    for bar, bts in thud.items():
        for bt in bts:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1:
                continue
            v = 0.62 if bt == 1.0 else 0.5
            a.n('k808', 'F1', t, '1/4', v, lock=True, decay=0.26, punch=5.0, click=0.03, drive=1.0)
            a.n('bdrum_muted', 60, t, '1/4', v * 0.55, lock=True)
    keep = [(1.5, 3.0), (2.0, 4.5), (1.0, 3.5), (2.5, 4.0)]
    clocks = [11000.0, 17000.0, 8000.0, 23000.0, 14000.0, 9500.0]
    k = 0
    for bar in range(1, 5):
        for bt in keep[bar - 1]:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1:
                continue
            a.n('noise', 60, t, '1/16', 0.42 if k % 3 else 0.5, lock=True, clock=clocks[k % len(clocks)],
                short=(k % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
            k += 1
    A_, B_ = ['F2', 'Gb2', 'C3'], ['Gb2', 'G2', 'Db3']
    a.ch('grand', A_, g.t(1), g.t(2) - g.t(1), 0.3, roll=0.004)
    a.ch('grand', A_, g.t(2), f(DIALOG) - g.t(2), 0.26, roll=0.004)
    a.ch('grand', A_, f(DIALOG), eyes - f(DIALOG), 0.34, roll=0.004)
    a.ch('grand', B_, eyes, f(STEP0) - eyes, 0.37, roll=0.004)
    T['grand'].pedal = [(-1.0, False), (g.t(1) + 0.01, True), (g.t(2) - 0.015, False), (g.t(2) + 0.01, True),
                        (f(DIALOG) - 0.02, False), (f(DIALOG) + 0.01, True), (eyes - 0.02, False), (eyes + 0.01, True),
                        (f(STEP0) - 0.02, False)]
    # Neleh's clockwork pizzicato rides her card (straight, precise), 2.5 beats after JOIN as in v4.0
    a.line('vln1', 'F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16 F5/16 C5/16 Ab4/16 C5/16', f(F0 + 37.5), vel=0.32,
           lock=True, art='pizz')
    # his calm: one felt F4, pp (5 beats after JOIN)
    a.n('felt', 'F4', f(F0 + 75), '3b', 0.2)
    a.n('felt_mech', 60, f(F0 + 75), 0.1, 0.3)
    # the 1993-style dialog: the 1-bit beeper F F F, uneven, on the dialog's pop
    for p, fr, d in (('F4', 0, '1/8'), ('F5', 15, '1/16'), ('F4', 26, '1/8d')):
        a.n('beeper', p, f(DIALOG + fr), d, 0.6, lock=True, rel=0.01, att=0.0, dec=0.0, sus=1.0)
    # the eyes strip: violins trem "sul pont" ppp; Mada's spinner under his tile, to the click
    art.trem(a, 'vln2', ['F5', 'Gb5'], eyes, f(CLICK) - eyes, vel=0.3, swell=('ppp', 'pp'), lock=True)
    t = eyes
    i = 0
    while t < f(CLICK) - 0.05:
        a.n('celesta', 'C5' if i % 2 == 0 else 'Db5', t, '1/8', 0.34 if i % 2 == 0 else 0.3, lock=True)
        t += g.beats_s(0.5, t)
        i += 1
    # STEP FOUR on the arrow's steps; the Gbmaj7 holds to the click (the fourth step is the click)
    steps = [(STEP0, ['Bb3', 'C4', 'Db4', 'F4'], 'Bb2', STEP1), (STEP1, ['Ab3', 'Bb3', 'C4', 'Eb4'], 'Ab2', STEP2),
             (STEP2, ['F3', 'Gb3', 'Bb3', 'Db4'], 'Gb2', CLICK)]
    for fr, ch, bass, nx in steps:
        d = f(nx) - f(fr) + (0.02 if nx != CLICK else 0.0)
        for j, p in enumerate(ch):
            a.n('hn', p, f(fr), d, 0.5 if j == len(ch) - 1 else 0.42, lock=True, art='mute', rel=0.12)
        a.n('bsn', bass, f(fr), d, 0.5, lock=True, rel=0.12)
        a.ch('grand', [nm(bass) - 12, nm(bass)], f(fr), d, 0.26, lock=True, roll=0.0)


def build():
    cue = Cue(ID, F0, F1)
    s = cue.s
    T = mm08._tweak(palette())
    lev = cue.sec(F0, bars=6)
    f = lambda fr: lev.g.t(1) + (fr - F0) / 24.0   # noqa: E731  (frame -> seconds on lev's grid)
    leverage_v4(lev, T, f)
    lev.commit()
    # D6: every stem and its tails to digital zero from the Cancel click to the carve (back 12 ms early)
    cue.mute(CLICK, CARVE - 0.3)
    # ---------------------------------------------------------------- 26A
    a = cue.a
    carve, vo = s(CARVE), s(L_in('a4-26a-vo1'))
    a.ch('felt', ['F3', 'C4'], carve, '2b', 0.33, lock=True, roll=0.006)          # the carve (the re-entry)
    a.n('felt_mech', 60, carve, 0.1, 0.35, lock=True)
    a.n('felt', 'G4', vo, '6b', 0.31)                                              # the nudge, under the V.O.
    COUNT0 = L_out('a4-26a-vo1') + 8                                               # the pedal from the V.O.'s end
    SETTLE = A('S2.05')
    count0, m3 = s(COUNT0), s(M('S2.04', 'mark3'))
    # the pedal under the count and the TPOOL insert: low strings sul tasto, the open fifth, pp (no motif)
    rebow(a, 'vc', ['F2', 'C3'], count0, m3 + 0.6, 0.2, seg=4.0, xf=1.0, first_att=1.6, last_rel=1.2,
          art='sus', lp=1100)
    a.n('felt', 'Eb4', m3, '1.5b', 0.34, lock=True)                                 # the felt back on mark 3
    a.n('felt_mech', 60, m3, 0.1, 0.3, lock=True)
    st1, st2 = s(SETTLE), s(SETTLE + 15)
    a.n('felt', 'C4', st1, '1b', 0.26)                                              # the settle, C4 -> F4
    a.n('felt', 'F4', st2, '1b', 0.28)
    a.n('snes_piano', 'E4', s(SETTLE + 30), '1b', 0.26, lock=True)                  # THE REWIND (the Orb's)
    a.n('snes_piano', 'Bb3', s(SETTLE + 45), '1b', 0.26, lock=True)
    T['felt'].pedal = [(0.0, False), (f(F0 + 75) + 0.005, True), (f(F0 + 150), False),
                       (carve + 0.005, True), (s(COUNT0 + 38), False),
                       (m3 + 0.01, True), (st1 - 0.02, False), (st1 + 0.01, True), (s(SETTLE + 30) - 0.01, False)]
    end = s(F1)
    cue.mutes.append((end, end + 6.0))                                              # the exit: cut on S3's downbeat
    for fr, lab in [(F0, 'JOIN: LEVERAGE in (first eighth on the click)'), (F0 + 37.5, "Neleh's clockwork (her card)"),
                    (DIALOG, 'the 1993 dialog: F F F'),
                    (EYES, 'the eyes strip: the cluster up a semitone'), (STEP0, 'STEP FOUR 1 (Bbm)'), (STEP1, 'step 2 (Ab)'),
                    (STEP2, 'step 3 (Gbmaj7)'), (CLICK, 'CANCEL = HARD STOP (D6)'), (CARVE, '26A: the felt fifth (re-entry)'),
                    (L_in('a4-26a-vo1'), 'the nudge G4 under the V.O.'), (COUNT0, 'the pedal (the count, TPOOL)'),
                    (M('S2.04', 'mark3'), 'mark 3: the felt back (Eb4)'), (SETTLE, 'the settle C4'), (SETTLE + 15, 'F4'),
                    (SETTLE + 30, 'THE REWIND (E4)'), (SETTLE + 45, 'Bb3'), (F1, 'EXIT: the cut (S3 downbeat)')]:
        cue.mark(fr, lab)
    for lab, a0, a1 in [('LEVERAGE (the call, one take)', F0, CLICK), ('D6', CLICK, CARVE),
                        ('26A carve + V.O.', CARVE, COUNT0), ('the count + TPOOL (pedal)', COUNT0, M('S2.04', 'mark3')),
                        ('mark 3, the settle, the Rewind', M('S2.04', 'mark3'), F1)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'The Falling Tile (Ep1 Act Four v4, S1b + S2, to picture)', mm='MM-08',
        family='P03 LEVERAGE -> D6 -> P01 DARK ROOM',
        tone='a trap closing without a tune in one take, a click that takes every sound away, then one felt in the dark',
        scenes=[f'v4 S1.06 click -> S2.05, act {F0}-{F1}; file t=0 = act frame {F0}'],
        motifs=['Step Four (muted horns + bassoon on the arrow steps; the click is the blank)',
                'the 1-bit flat line F F F', "Neleh's clockwork", "Mada's spinner",
                "the Water Line's open fifth, nudge and settle (felt)", 'THE REWIND'],
        motif_ids=['STEP_FOUR'], key='F pedal, semitone clusters; Step Four over F; 26A F open fifth, no third',
        underscore_lufs=-21.0, album_lufs=-16.0,
        silence_windows=[(s(CLICK) + 0.005, s(CARVE) - 0.4, 'D6: the Cancel click to the carve', -90.0)],
        vo_windows=[(vo, s(L_out('a4-26a-vo1')), '"i don\'t keep score." (felt alone)')],
        room_sfx=[dict(t0=carve, t1=end, sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=s(CLICK), sfx='dialog_ok_click: CANCEL (D6)'), dict(t=s(A('S1.11')), sfx='the phone buzz (the room back)')],
        audition=[f'0-{s(CLICK):.2f} s: LEVERAGE as one take under the call -- a trap closing, not a tune; the thud never '
                  'a heartbeat',
                  f'{s(STEP0):.2f}-{s(CLICK):.2f} s: Step Four on the three arrow steps, then the click takes everything',
                  f'{s(CARVE):.2f} s: the re-entry on the carve after D6 (about 7.7 s of no music, by design)',
                  f'{s(COUNT0):.2f}-{s(M("S2.04", "mark3")):.2f} s: the low F/C pedal under the count and TPOOL -- air, not a drone '
                  'effect; no motif under the (REPORTED) rail',
                  f'{s(SETTLE):.2f}-{end:.2f} s: the settle and the Rewind, cut on S3\'s downbeat'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
                 length_s=end, tail_s=0.3, meta=meta)


if __name__ == '__main__':
    render_cli(build, __file__)
