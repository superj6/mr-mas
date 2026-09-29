"""E01 v3.1 Act Four · S1 · NOON, LAS VEGAS · the suite -> JOIN -> Alyi's sentence -> the Remove click (D6)

v3.1 (script draft 7; lock-v31.md; mood-analysis §4 #1): his side opens on the shock.  The suite has its ordinary life
(the crane, the glasses, a practice lap), then the JOIN click, Alyi's sentence heard over a thinned LEVERAGE, the
literal Remove dialog as a bright hard cut, and the one silence.  THE PLAN has moved to the board's side
(cue_plan.py), so the waltz no longer plays here.  From Act Four v5's S1 (tracks/e01-act4-v5/s1-s4_s1_noon.py) and the
first-round v3 score:
  * the suite: a sul-tasto F3/C4 pedal as air from the first frame to JOIN; his felt Water Line bar with its nudge G4
    (and the chip square) on his glass nudge (S1.02 + 10 f); its C4 hangs on D-flat maj7; the V.O. sits inside the
    pedal; v3.4: he plans the meeting with his pointer ("gerg's not on it. probably the budget. good. i'll ask for
    more compute."), and after it the settle comes, confident and light (C4 -> F4, the chip on the F), just before
    he clicks JOIN, so the blow's silence lands harder;
  * LEVERAGE (low, MM-08) from the JOIN click, one take: pizz eighths on the F pedal, the muted-808 thud (uneven),
    the chip tick, the low grand clusters; THINNED TO ITS PEDAL under Alyi's sentence (the loudest thing in the
    call); his calm, one felt F4, after it; back up on the dialog's hard cut: the cluster up a semitone, the 1-bit
    F F F on the dialog, trem violins, STEP FOUR on ALYI's pointer's three steps (one a beat);
  * the Remove click (on the downbeat) is a DEAD STOP: D6, every stem and tail to digital zero; no score through the
    buzz and "super.", and (v3.2) none under his 1:46 PM post (v32-S1.13) and the fall to night: the suite's air, then
    the dark room's drone (SFX) carry it to the carve.
Every sync point is read from the timeline: NUDGE = S1.02 + 10 f (v5's pixel offset, kept) · JOIN = S1.02's click ·
Alyi's line v31-a4-0001 · the dialog = v31-S1.08d · the click = its dialog_ok_click · the steps one beat apart before
it.  Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys
from dataclasses import replace

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import rebow   # noqa: E402
from engine.core import s2n   # noqa: E402
from engine.mix import convolve   # noqa: E402

ID = 'e01-v3-a4-s1-noon'
PLAN_TRACKS = ('lead', 'lead2', 'tri', 'tri2', 'celesta', 'harp', 'woodclick', 'glasspad', 'vln1', 'vln2', 'vla',
               'vc', 'cb', 'cl')


def warroom_entry():
    """v3.5: the war room's pulse enters as the phone lights, his post's card + 0.9 s (cue_warroom.entry())"""
    if C.CLK.has('v35-41.01'):
        import cue_warroom
        return cue_warroom.entry()
    return None


def syncmap():
    M = {}
    M['NUDGE'] = A('S1.02', 10)
    M['FELT_BAR'] = M['NUDGE'] - 45
    M['JOIN'] = SND('S1.02', 'dialog_ok_click')           # he clicks JOIN: LEVERAGE's first eighth
    M['ALYI_ON'], M['ALYI_END'] = Lon('v31-a4-0001'), Lend('v31-a4-0001')
    M['DIALOG'] = A('v31-S1.08d')                          # the hard cut to the bright Remove dialog
    M['CLICK'] = SND('v31-S1.08d', 'dialog_ok_click')      # Remove: D6
    beat = 15.0
    M['STEP0'], M['STEP1'], M['STEP2'] = M['CLICK'] - 3 * beat, M['CLICK'] - 2 * beat, M['CLICK'] - beat
    M['CARVE'] = A('S2.01')
    assert M['FELT_BAR'] > 0 and M['JOIN'] < M['ALYI_ON'] < M['ALYI_END'] < M['DIALOG'] < M['CLICK'], M
    M['STEP0'] = max(M['STEP0'], M['DIALOG'])
    return M


def plan_post(sends, t_tear, t_join, mm07):
    """THE PLAN's players: their own reverb (so the tails are theirs), the tape-stop from the tear, zero from JOIN."""
    def f(buf):
        y = buf.astype(np.float32).copy()
        for kind, lvl in sends.items():
            y += convolve(buf, kind).astype(np.float32) * db(lvl)
        ia, iz = s2n(t_tear), s2n(t_join)
        if ia < y.shape[1]:
            iz = min(iz, y.shape[1])
            y[:, ia:iz] = tape_stop(y[:, ia:iz], 0.0, t_join - t_tear, curve=mm07.TAPE_CURVE)
            y[:, iz:] = 0.0
        return y
    return f


def tracks(cue, M, mm07, mm08):
    T = mm08._tweak(palette())                       # LEVERAGE's players keep their own names and settings
    T7 = mm07.tracks()
    for k in ('felt', 'felt_mech', 'lead'):          # the suite: his felt, as MM-07's sc 24 set it
        T['s_' + k] = replace(T7[k], name='s_' + k)
    T['s_felt'].gain_db += 2.0
    # v3.1 render 1: the pizz and the muted bass drum's body resonances (~111 and ~222 Hz, an A) read under the F at
    # LEVERAGE's first bar (the engine's F-major trace: 'resonance, the same peak under different notes'): notched
    T['vc'].eq = list(T['vc'].eq) + [('peq', 222.7, -10.0, 8.0), ('peq', 111.3, -8.0, 8.0)]
    T['bdrum_muted'].eq = list(T['bdrum_muted'].eq) + [('peq', 111.3, -12.0, 6.0)]
    T['grand'].eq = list(T['grand'].eq) + [('peq', 111.3, -8.0, 8.0)]
    T['cb'].eq = list(T['cb'].eq) + [('peq', 110.0, -10.0, 8.0), ('peq', 221.5, -8.0, 8.0)]   # (v3.4 EL: its ~222 Hz body)
    T['sp_vc'] = replace(T['vc'], name='sp_vc')      # the suite's air (the v3 sample's)
    T['sp_vla'] = replace(T['vla'], name='sp_vla')
    return T


def suite(cue, T, M):
    FELT_BAR, NUDGE = M['FELT_BAR'], M['NUDGE']
    # the air under the room and the V.O.: a sparse F3/C4 sul-tasto pedal, gone as THE PLAN's pad enters
    rebow(cue.a, 'sp_vc', 'F3', cue.s(1), cue.s(M['JOIN'] + 8), 0.14, seg=5.0, xf=1.0, first_att=0.9,
          last_rel=1.2, art='sus', lp=1100)
    rebow(cue.a, 'sp_vla', 'C4', cue.s(16), cue.s(M['JOIN'] + 8), 0.12, seg=5.0, xf=1.0, first_att=1.8,
          last_rel=1.2, art='sus', lp=1300)
    cue.mark(1, 'S1.01 the suite: the F3/C4 pedal bows in (air)', hit=False)
    sec = cue.sec(FELT_BAR, bars=4, swing=1.0)
    a = sec.a
    a.line('s_felt', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4', (1, 1), vel=0.40, swing=1.0)
    a.ch('s_felt', ['Ab3', 'C4', 'Eb4'], (1, 1), '3.8b', 0.26, roll=0.012)
    a.ch('s_felt', ['Db3', 'F3', 'Ab3'], (2, 1), '3.9b', 0.25, roll=0.014)
    a.n('s_felt_mech', 60, (1, 1), 0.1, 0.35)
    a.n('s_felt_mech', 60, (2, 1), 0.1, 0.3)
    place_motif(a, 's_lead', 'WATER_LINE', (1, 1), part='nudge_double', vel=0.2, swing=1.0, duty=0.5,
                att=0.004, dec=0.25, sus=0.35, rel=0.12)
    t1, t2 = cue.s(FELT_BAR), cue.s(FELT_BAR + 60)
    sec.commit()
    cue.mark(FELT_BAR, 'S1.01 the Water Line bar (felt, swung): the V.O. sits inside it')
    cue.mark(NUDGE, 'the nudge G4 on his glass nudge (+ the chip square, the nudge only)')
    vo = C.CLK.LINES.get('v34-vo-07')
    if vo is None:                                         # (v3.1-v3.3: the C4 hangs; the settle never comes)
        T['s_felt'].pedal = [(-1.0, False), (t1 - 0.05, True), (t2 + 0.01, False), (t2 + 0.05, True),
                             (cue.s(M['JOIN'] - 2), False)]
        cue.mark(FELT_BAR + 60, 'the C4 hangs on Dbmaj7: the settle never comes', hit=False)
        return
    # v3.4: he plans the meeting with his pointer ("gerg's not on it. probably the budget. good. i'll ask for more
    # compute."), then clicks JOIN.  Confident and light, so the blow's silence lands harder: the C4 that hung on
    # D-flat maj7 is answered after his V.O., the Water Line's settle C4 -> F4 over the open fifth, the chip square
    # doubling the F (lightly): it fits, he thinks.  The F lands just before the click and rings into LEVERAGE.
    jn = M['JOIN'] / FPS
    tf = vo['end'] + 0.08 + 0.625
    if tf > jn - 0.05:
        tf = jn - 0.08
    tc = max(vo['end'] + 0.05, tf - 0.625)
    a2 = cue.a
    a2.n('s_felt', 'C4', cue.s(tc * FPS), tf - tc - 0.02, 0.34)
    a2.n('s_felt_mech', 60, cue.s(tc * FPS), 0.1, 0.3)
    a2.n('s_felt', 'F4', cue.s(tf * FPS), 1.2, 0.36)
    a2.ch('s_felt', ['F3', 'C4'], cue.s(tf * FPS), 1.2, 0.24, roll=0.01)
    a2.n('s_lead', 'F4', cue.s(tf * FPS), 0.2, 0.14, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.1)
    T['s_felt'].pedal = [(-1.0, False), (t1 - 0.05, True), (t2 + 0.01, False), (t2 + 0.05, True),
                         (cue.s(tc * FPS) - 0.03, False), (cue.s(tc * FPS) + 0.02, True),
                         (cue.s(tf * FPS) - 0.03, False), (cue.s(tf * FPS) + 0.02, True),
                         (cue.s(tf * FPS) + 1.1, False)]
    cue.mark(FELT_BAR + 60, 'the C4 hangs on Dbmaj7 under his plan (the V.O.)', hit=False)
    cue.mark(tc * FPS, 'v3.4: after "i\'ll ask for more compute.": the settle C4 -> F4 over the open fifth, the chip on '
                       'the F: confident, light (it fits, he thinks)')
    cue.mark(tf * FPS, 'the F4 lands just before he clicks JOIN')


def leverage(cue, T, M):
    JOIN, CLICK, DIALOG = M['JOIN'], M['CLICK'], M['DIALOG']
    sec = cue.sec(JOIN, bars=6)
    a, g, f = sec.a, sec.g, sec.f
    t_end, cut = f(CLICK), f(DIALOG)
    quiet0, quiet1 = f(M['ALYI_ON'] - 4), f(DIALOG)      # Alyi's sentence: LEVERAGE thinned to its pedal
    cells = [['F2', 'C3', 'F2', 'F2', 'Gb2', 'F2', 'C3', 'F3'],
             ['F2', 'C3', 'F3', 'F2', 'Gb2', 'C3', 'F2', 'Gb2'],
             ['F2', 'F2', 'C3', 'F2', 'Gb2', 'F2', 'Db3', 'C3'],
             ['F2', 'C3', 'F2', 'Gb2', 'F2', 'C3', 'F3', 'C3']]
    acc = [1.0, 0.78, 0.86, 0.8, 0.94, 0.78, 0.88, 0.82]
    for bar in range(1, 6):
        for i, p in enumerate(cells[(bar - 1) % 4]):
            t = g.t(bar, 1 + 0.5 * i)
            if t >= t_end - 0.02 or quiet0 <= t < quiet1:
                continue
            if t >= cut - 1e-6:
                p = {'F3': 'Gb3'}.get(p, p)           # the cluster moved: the pizz follows its Gb
            a.n('vc', p, t, '1/8', 0.46 * acc[i], lock=True, art='pizz')
        if g.t(bar) < t_end - 0.02:
            a.n('cb', 'F1', (bar, 1), '1/4', 0.5 if not (quiet0 <= g.t(bar) < quiet1) else 0.36, lock=True, art='pizz')
        t35 = g.t(bar, 3.5)
        if bar % 2 == 0 and not (quiet0 <= t35 < quiet1) and t35 < t_end - 0.02:
            a.n('cb', 'F1', t35, '1/4', 0.4, lock=True, art='pizz')
    thud = {1: [1.0, 4.0], 2: [2.5], 3: [3.5], 4: [1.0], 5: [1.0]}
    for bar, bts in thud.items():
        for bt in bts:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1 or t >= t_end - 0.02:
                continue
            v = 0.62 if bt == 1.0 else 0.5
            a.n('k808', 'F1', t, '1/4', v, lock=True, decay=0.26, punch=5.0, click=0.03, drive=1.0)
            a.n('bdrum_muted', 60, t, '1/4', v * 0.55, lock=True)
    keep = [(1.5, 3.0), (2.0, 4.5), (1.0, 3.5), (2.5, 4.0), (1.5, 3.0)]
    clocks = [11000.0, 17000.0, 8000.0, 23000.0, 14000.0, 9500.0]
    k = 0
    for bar in range(1, 6):
        for bt in keep[bar - 1]:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1 or t >= t_end - 0.02:
                continue
            a.n('noise', 60, t, '1/16', 0.42 if k % 3 else 0.5, lock=True, clock=clocks[k % len(clocks)],
                short=(k % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
            k += 1
    A_, B_ = ['F2', 'Gb2', 'C3'], ['Gb2', 'G2', 'Db3']            # the low grand clusters (who has the leverage)
    t2 = g.t(2)
    a.ch('grand', A_, g.t(1), t2 - g.t(1), 0.30, roll=0.004)
    a.ch('grand', A_, t2, max(0.3, quiet0 - t2 + 0.05), 0.26, roll=0.004)
    a.ch('grand', A_, quiet0 + 0.05, cut - quiet0 - 0.05, 0.2, roll=0.004)          # the pedal under Alyi
    a.ch('grand', B_, cut, f(M['STEP0']) - cut + 0.3, 0.37, roll=0.004)
    T['grand'].pedal = [(-1.0, False)]
    tc = f(M['ALYI_END'] + 3)                                     # his calm: one felt F4, after the sentence
    if tc < cut - 0.3:
        a.n('felt', 'F4', tc, cut - tc, 0.2)
        a.n('felt_mech', 60, tc, 0.1, 0.3)
        T['felt'].pedal = [(-1.0, False), (cue.s(M['ALYI_END'] + 3) + 0.005, True), (cue.s(DIALOG) - 0.02, False)]
    for p, dfr, d in (('F4', 0, '1/8'), ('F5', 15, '1/16'), ('F4', 26, '1/8d')):
        a.n('beeper', p, f(DIALOG + 4 + dfr), d, 0.6, lock=True, rel=0.01, att=0.0, dec=0.0, sus=1.0)
    art.trem(a, 'vln2', ['F5', 'Gb5'], cut, t_end - cut, vel=0.3, swell=('ppp', 'pp'), lock=True)
    steps = [(M['STEP0'], ['Bb3', 'C4', 'Db4', 'F4'], 'Bb2', M['STEP1']),
             (M['STEP1'], ['Ab3', 'Bb3', 'C4', 'Eb4'], 'Ab2', M['STEP2']),
             (M['STEP2'], ['F3', 'Gb3', 'Bb3', 'Db4'], 'Gb2', CLICK)]
    for fr, ch, bass, nx in steps:
        d = f(nx) - f(fr) + (0.02 if nx != CLICK else 0.0)
        for j, p in enumerate(ch):
            a.n('hn', p, f(fr), d, 0.5 if j == len(ch) - 1 else 0.42, lock=True, art='mute', rel=0.12)
        a.n('bsn', bass, f(fr), d, 0.5, lock=True, rel=0.12)
        a.ch('grand', [nm(bass) - 12, nm(bass)], f(fr), d, 0.26, lock=True, roll=0.0)
    sec.commit()
    for fr, lab in [(JOIN, "JOIN: LEVERAGE's first eighth on the click"), (M['ALYI_END'] + 3, 'his calm: one felt F4'),
                    (DIALOG + 4, 'the Remove dialog (bright hard cut): the 1-bit F F F; the cluster up a semitone'),
                    (M['STEP0'], 'STEP FOUR 1 (Bbm(add9)): ALYI\'s pointer'), (M['STEP1'], 'step 2 (Ab(add9))'),
                    (M['STEP2'], 'step 3 (Gbmaj7), held to the click')]:
        cue.mark(fr, lab)
    cue.mark(M['ALYI_ON'], "Alyi's sentence: LEVERAGE thinned to its pedal (the loudest thing in the call)", hit=False)
    cue.mark(CLICK, 'REMOVE = HARD STOP: D6 (the click is step four)', hit=False)


def build():
    M = syncmap()
    mm07 = load_track('mm07-how-to-fire-a-ceo')
    mm08 = load_track('mm08-the-falling-tile')
    cue = FCue(ID, 7.0, M['CLICK'], pre=7.0)          # file t = 0 = the segment's first frame
    T = tracks(cue, M, mm07, mm08)
    suite(cue, T, M)
    leverage(cue, T, M)
    s = cue.s
    end = s(M['CLICK']) + 0.6
    cue.mute(M['CLICK'], M['CLICK'] + 60)
    for lab, a0, a1 in [('S1 the suite: the pedal, the felt Water Line bar, the V.O.', 0, M['JOIN']),
                        ("S1 LEVERAGE (low): the connect, Alyi's sentence (thinned), the dialog", M['JOIN'], M['CLICK'])]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title='Noon, Las Vegas: The Call (Ep1 v3.1 Act Four, S1, to picture)',
        mm='MM-07 felt + MM-08 (Act Four v5 S1, re-spotted to v3.1)', usage='BI',
        family='P01 DARK ROOM -> P03 LEVERAGE -> D6',
        tone="his calm felt over the suite's ordinary life, a trap closing under Alyi's plain sentence, the bright "
             'dialog, then nothing',
        scenes=[f'Ep1 v3.1 Act Four S1.01-v31-S1.08d, segment 0-{M["CLICK"] / FPS:.3f} s ({CLK.variant}); D6 from the '
                'Remove click'],
        motifs=['the Water Line bar 1 (felt, swung; the nudge on his nudge; the settle never comes)',
                'LEVERAGE (thinned to its pedal under the sentence)', 'the 1-bit flat line F F F (the dialog)',
                'Step Four (the pointer; the click is the blank)'],
        motif_ids=['STEP_FOUR'], key='F minor (felt) -> F pedal, semitone clusters',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 S1',
        underscore_lufs=-20.0, album_lufs=-16.0,
        silence_windows=[(s(M['CLICK']) + 0.005, end - 0.01, 'D6: the Cancel click', -90.0)],
        sfx_slots=[dict(t=round(s(M['JOIN']), 3), sfx='dialog_ok_click: JOIN'),
                   dict(t=round(s(M['CLICK']), 3), sfx='dialog_ok_click: REMOVE (D6 on its frame)')],
        audition=[f'0-{s(M["JOIN"]):.1f} s: the pedal under the suite\'s ordinary life, the felt bar with the nudge '
                  'on his glass, the V.O. inside it: calm with somewhere to fall from',
                  f'{s(M["ALYI_ON"]):.1f}-{s(M["DIALOG"]):.1f} s: Alyi\'s sentence over LEVERAGE\'s pedal alone: the '
                  'loudest thing in the call',
                  f'{s(M["DIALOG"]):.1f}-{s(M["CLICK"]):.1f} s: the bright dialog, Step Four on the pointer, then the click '
                  'takes it all'])
    macro = [(0.0, 0.0), (s(M['JOIN']) - 0.004, 0.0), (s(M['JOIN']), -3.0), (end + 1.0, -3.0)]
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=end, tail_s=0.0, meta=meta)
    window = [0.0, M['CLICK'] / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(lab, round(a0 / FPS, 4), round(a1 / FPS, 4)) for lab, a0, a1 in
                           [(l, cue.fr(a), cue.fr(b)) for l, a, b in cue.sections]],
                 silences=[(M['CLICK'] / FPS, (warroom_entry() - 0.015) if warroom_entry() else
                            M['CARVE'] / FPS - NIGHT_PRELAP_S - 0.015,     # (to the war room's pulse / the night)
                            'D6: the Remove click -> the phone\'s buzz (every bus at zero in the mix), then no score '
                            'under "super." (the suite\'s air holds it)' +
                            ((', nor under his 1:46 PM post typed twice (v32-S1.13) -> the phone lights: the war '
                              'room\'s pulse (v3.5)') if warroom_entry() else
                             (', nor under his 1:46 PM post and the fall to night (v32-S1.13: the suite\'s air, then '
                              'the drone)' if C.CLK.has('v32-S1.13') else '') + ' -> the carve'))])
    return sc, cue.T0, window, extra
