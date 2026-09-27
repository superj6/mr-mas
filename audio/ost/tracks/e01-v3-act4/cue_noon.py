"""E01 v3 Act Four · S1 · NOON, LAS VEGAS · the suite -> THE PLAN -> the call -> the Cancel click (D6)

Act Four v5's S1 score (tracks/e01-act4-v5/s1-s4_s1_noon.py: MM-07's felt bar, Blueprint, waltz and tape-stop, then
MM-08's LEVERAGE), copied and re-spotted to the v3 lock the way the v3 sample refitted it (audio/reel/ep01-v3-sample/
music/track.py cue_b1): the suite gets a sul-tasto F3/C4 pedal as air under the new V.O.; the stuck G-A-flat loop runs
on under "gerg's not on it. alyi set it up. probably just the budget." (thinned: the box, the triangle root and the
pizz root); the TAPE-STOP starts after his last word and reaches zero ON the JOIN click; LEVERAGE (low) is one take
from the click to Cancel; the Cancel click is a dead stop (D6: every stem and tail to digital zero).  No score from
there to the carve (the room, the buzz, "super." in the suite's air).

Every sync point is re-derived from the timeline (v5 took some from its pixel lock; the v3 lock has none, so those
are the v5 lock's offsets from their beat, which the v3 builder keeps, or the word they sat on):
  NUDGE = S1.02 + 10 f · WALK = "stepped" · the labels = their texts / words, snapped to the plan's eighth grid ·
  the held chord = the last 2-beat point before "Good question." · the moth = the EQUITY stamp + 20 f · the path =
  S1.05's first eighth-grid point · TICK1 = "1. NOON" · TEAR (the paper whip) · JOIN = S1.06's click · CARD, DIALOG =
  their texts · SPEAK = S1.07 + 84 f · EYES = S1.08 · STEP0-2 = S1.09 in thirds to the Cancel click.
Nothing here was listened to.
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


def syncmap():
    M = {}
    M['NUDGE'] = A('S1.02', 10)
    M['FELT_BAR'] = M['NUDGE'] - 45
    M['BP_CUT'] = A('S1.03')
    M['STAMP'] = SND('S1.03', 'rubber_stamp_C')
    M['WALK'] = float(round(W('a5-25-01', 'stepped')))
    M['FOUR'] = W('a5-25-02', 'four')
    M['G0'] = M['WALK'] - 60                              # THE PLAN's grid: beat k at G0 + 15 k
    M['RESUME'] = M['WALK'] + 90                          # the 4/4 returns (waltz bar 3's downbeat)
    G0 = M['G0']
    snap = lambda f: G0 + 7.5 * round((f - G0) / 7.5)     # noqa: E731  the plan's eighth grid
    gq = Lon('a5-25-06')                                  # "Good question."
    k = int((gq - 1 - M['RESUME']) // 30)
    M['HOLD'] = M['RESUME'] + 30 * k                      # the held chord: the last 2-beat point before it
    M['LABELS'] = [(M['RESUME'], 'F4', 'the four: ALYI · NELEH · MADA · THE QUIET VOTE'),
                   (snap(TXT('S1.03', 'NOPEAI · THE NONPROFIT')), 'G4', 'NOPEAI · THE NONPROFIT'),
                   (snap(W('a5-25-03', 'controls')), 'Ab4', '"controls": the arrow'),
                   (snap(W('a5-25-03', 'company')), 'Bb4', '"company"'),
                   (snap(TXT('S1.03', 'NOPEAI · THE COMPANY')), 'C5', 'NOPEAI · THE COMPANY'),
                   (snap(Lend('a5-25-04')), 'Bb4', "VOTES: 0 (after the stamp, on the line's end)"),
                   (snap(TXT('S1.04', 'CEO')), 'Ab4', 'CEO')]
    M['EQUITY'] = SND('S1.04', 'rubber_stamp_C', 1)
    M['VOTES'] = SND('S1.04', 'rubber_stamp_C', 0)
    M['MOTH'] = M['EQUITY'] + 20
    M['PATH'] = A('S1.05')
    M['P0'] = G0 + 7.5 * np.ceil((M['PATH'] - G0 - 0.5) / 7.5)   # the path starts on the plan's grid
    M['TICK1'] = G0 + 7.5 * np.ceil((TXT('S1.05', '1. NOON') - G0 - 0.5) / 7.5)
    M['STUCK'] = M['P0'] + 45                             # the fold curls: the stuck loop
    M['WHIP'] = SND('S1.05', 'paper_whip')
    M['JOIN'] = SND('S1.06', 'dialog_ok_click')           # he clicks JOIN: the tape at zero; LEVERAGE's first eighth
    vo = CLK.LINES['v3-vo-18']
    M['VO_ON'], M['VO_END'] = vo['on'] * FPS, vo['end'] * FPS
    M['TAPE0'] = max(M['VO_END'] - 0.2 * FPS, M['JOIN'] - 1.0 * FPS)   # the tape-stop: after his last word
    M['CARD'] = TXT('S1.07', 'NELEH /')
    M['SPEAK'] = A('S1.07', 84)
    M['DIALOG'] = TXT('S1.07', 'UI: MAS')
    M['EYES'] = A('S1.08')
    M['STEP0'] = A('S1.09')
    M['CLICK'] = SND('S1.09', 'dialog_ok_click')          # Cancel: D6
    d = (M['CLICK'] - M['STEP0']) / 3.0
    M['STEP1'], M['STEP2'] = M['STEP0'] + d, M['STEP0'] + 2 * d
    M['CARVE'] = A('S2.01')
    assert M['TAPE0'] < M['JOIN'] and M['P0'] < M['STUCK'] < M['TAPE0'], M
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
    for k in PLAN_TRACKS:
        T['p_' + k] = replace(T7[k], name='p_' + k, sends={},
                              post=plan_post(dict(T7[k].sends), cue.s(M['TAPE0']), cue.s(M['JOIN']), mm07))
    T['p_vla'].eq = list(T['p_vla'].eq) + [('peq', 223.5, -10.0, 8.0)]          # v5's pizz-body notches
    T['p_cb'].eq = list(T['p_cb'].eq) + [('peq', 111.0, -12.0, 8.0)]
    T7 = mm07.waltz_tracks(T7, cue.s(M['RESUME']))
    for k in ('wz_box', 'wz_cel', 'wz_tri', 'wz_ch'):
        T[k] = T7[k]
    for k in ('felt', 'felt_mech', 'lead'):          # the suite: his felt, as MM-07's sc 24 set it
        T['s_' + k] = replace(T7[k], name='s_' + k)
    T['s_felt'].gain_db += 2.0
    T['sp_vc'] = replace(T['vc'], name='sp_vc')      # the suite's air (the v3 sample's)
    T['sp_vla'] = replace(T['vla'], name='sp_vla')
    return T


def suite(cue, T, M):
    FELT_BAR, NUDGE = M['FELT_BAR'], M['NUDGE']
    # the air under the room and the V.O.: a sparse F3/C4 sul-tasto pedal, gone as THE PLAN's pad enters
    rebow(cue.a, 'sp_vc', 'F3', cue.s(1), cue.s(M['STAMP'] + 26), 0.14, seg=5.0, xf=1.0, first_att=0.9,
          last_rel=1.2, art='sus', lp=1100)
    rebow(cue.a, 'sp_vla', 'C4', cue.s(16), cue.s(M['STAMP'] + 26), 0.12, seg=5.0, xf=1.0, first_att=1.8,
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
    T['s_felt'].pedal = [(-1.0, False), (t1 - 0.05, True), (t2 + 0.01, False), (t2 + 0.05, True),
                         (cue.s(Lon('a5-25-01') - 2), False)]
    sec.commit()
    cue.mark(FELT_BAR, 'S1.01 the Water Line bar (felt, swung): the V.O. sits inside it')
    cue.mark(NUDGE, 'the nudge G4 on his glass nudge (+ the chip square, the nudge only)')
    cue.mark(FELT_BAR + 60, 'the C4 hangs on Dbmaj7: the settle never comes', hit=False)


def plan(cue, T, M, mm07):
    G0, WALK, RESUME, STAMP, HOLD = M['G0'], M['WALK'], M['RESUME'], M['STAMP'], M['HOLD']
    sec = cue.sec(G0, bars=16)
    a = sec.a
    w = mm07.Writer(a, 0)
    q = sec.q
    talk = lambda f: in_talk(f, 2.0)                  # noqa: E731
    w.pad(mm07.Q_F[:3], q(STAMP + 5), q(RESUME + 4), vel=0.24, att=0.45, rel=0.6)
    qw = q(WALK)
    for k, (du, v) in enumerate([(0.25, 0.50), (0.125, 0.44), (0.5, 0.52)]):
        fr = WALK + 15 * k
        w.box('F5', qw + k, v, dq=0.5, duty=du, inst='wz_box', ring=0.28)
        if not talk(fr):
            w.cel('F5', qw + k, 0.40, dq=0.9, inst='wz_cel')
        cue.mark(fr, f'the waltz: walk-off {k + 1} (F)')
    for k, (bass, ch) in enumerate([('F3', ['Ab4', 'C5']), ('Db3', ['F4', 'C5'])]):
        wb = qw + 3 * k
        w.tri(bass, wb, 2.9, 0.55, inst='wz_tri', dec=0.6)
        for bt in (1, 2):
            for p in ch:
                w.n('wz_ch', p, wb + bt, 0.3, 0.42 if bt == 1 else 0.36, duty=0.5, att=0.002, dec=0.12, sus=0.0,
                    rel=0.08, steps=15)
    cue.mark(WALK + 45, 'waltz bar 2: the accompaniment alone (the empty chairs)')
    CH = [('F2', mm07.Q_F), ('Bb2', mm07.Q_BB), ('C2', mm07.Q_C), ('F2', mm07.Q_F), ('G2', mm07.Q_G),
          ('C2', mm07.Q_C), ('F2', mm07.Q_F), ('Bb2', mm07.Q_BB), ('C2', mm07.Q_C), ('F2', mm07.Q_F),
          ('D2', mm07.Q_D)]
    HARM = [(RESUME + 30 * i, CH[i % len(CH)][0], CH[i % len(CH)][1]) for i in range(int((HOLD - RESUME) // 30))]
    for i, (fr, root, chord) in enumerate(HARM):
        nxt = HARM[i + 1][0] if i + 1 < len(HARM) else HOLD
        w.pizz('vc', root, q(fr), 0.50 if talk(fr) else 0.55)
        w.tri(nm(root) + 12, q(fr), (nxt - fr) / 15 * 0.8, 0.42)
        w.pad(chord[:3], q(fr), q(nxt), vel=0.25, att=0.35 if i else 0.12, rel=0.5)
    fr = RESUME
    while fr < HOLD - 1:
        w.tick(q(fr), 0.20 if talk(fr) else 0.28)
        fr += 15
    for fr, p, lab in M['LABELS']:
        if talk(fr):
            w.box(p, q(fr), 0.50, dq=0.6, ring=0.3)
        else:
            w.box(p, q(fr), 0.60, dq=0.7, ring=0.4)
            w.cel(nm(p) + 12, q(fr), 0.42, dq=1.0)
            w.box(mm07.FOURTH_BELOW[p], q(fr), 0.38, dq=0.6, duty=0.5, inst='tri2', ring=0.25)
            w.harp(p, q(fr), 0.34, dq=1.2)
        cue.mark(fr, f'label: {lab} ({p})')
    cue.mark(RESUME, 'the 4/4 returns (the waltz tails gated)', hit=False)
    P0 = M['P0']
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), ['F3', 'Bb3', 'Eb4', 'Ab4']):
        w.n(inst, p, q(HOLD), q(P0) - q(HOLD), 0.14, lp=1800.0, att=0.25, rel=0.35)
    w.n('glasspad', 'Eb5', q(HOLD), q(P0) - q(HOLD), 0.28, rel=0.3)
    w.n('glasspad', 'Ab5', q(HOLD), q(P0) - q(HOLD), 0.24, rel=0.3)
    w.pizz('vc', 'F2', q(HOLD), 0.42, dq=2.0)
    qm = q(M['MOTH'])
    for k in range(6):
        w.cel('G5' if k % 2 == 0 else 'Ab5', qm + k / 6.0, 0.22 - 0.015 * k, dq=0.3)
    cue.mark(HOLD, 'the held chord: "Good question." (pp, no movement)', hit=False)
    cue.mark(M['MOTH'], 'the moth (celesta flutter, pp)', hit=False)
    harp8 = ['F3', 'Bb3', 'Eb4', 'Ab4', 'G4', 'Eb4', 'Bb3', 'G3']
    for k in range(6):
        w.harp(harp8[k % 8], q(P0) + 0.5 * k, 0.30 + 0.06 * (k % 4 == 0), dq=0.8)
    w.pulse(q(P0), q(P0 + 30), mm07.PULSE_G, vel=0.36)
    w.pulse(q(P0 + 30), q(M['STUCK']), mm07.PULSE_F, vel=0.36)
    for fr, root, chord in [(P0, 'G2', mm07.Q_G), (P0 + 30, 'F2', mm07.Q_F)]:
        w.pizz('vc', root, q(fr), 0.5)
        w.tri(nm(root) + 12, q(fr), 1.5, 0.44)
        w.pad(chord[:3], q(fr), q(fr + 30), vel=0.25)
    TICK1 = M['TICK1']
    w.box('F4', q(TICK1), 0.66, dq=1.1, ring=0.55)
    w.cel('F5', q(TICK1), 0.46, dq=1.6)
    w.box('C4', q(TICK1), 0.40, dq=0.9, duty=0.5, inst='tri2', ring=0.4)
    w.tick(q(TICK1), 0.40)
    cue.mark(P0, 'the path: the harp draws it', hit=False)
    cue.mark(TICK1, 'tick 1: 1. NOON (F4)')
    # BREAK: the line's last two beats stick (G, A-flat) as the fold curls, on under his V.O.; the tape-stop after it
    mm07.stuck(w, q(M['STUCK']), q(M['JOIN']), root='F2')
    cue.mark(M['STUCK'], 'BREAK: the stuck G-Ab loop (the fold curls)')
    cue.mark(M['TAPE0'], 'the tape-stop starts (after his last word)', hit=False)
    cue.mark(M['JOIN'], "JOIN: the tape reaches zero; LEVERAGE's first eighth on the click")
    for n in a.notes:
        if n.inst.startswith('wz_'):
            n.vel *= 0.72
    sec.commit()
    # thin the stuck loop under his V.O.: the box alone (softer), the triangle root and the pizz root (the sample's)
    kept = []
    for n in cue.notes:
        fa = cue.fr(n.start)
        if M['VO_ON'] - 2 <= fa < M['VO_END'] and fa >= M['STUCK'] - 1:
            if n.inst in ('celesta', 'tri2', 'vla'):
                continue
            if n.inst == 'lead':
                n.vel *= 0.62
        kept.append(n)
    cue.notes[:] = kept
    for n in cue.notes:
        if n.inst in PLAN_TRACKS:
            n.inst = 'p_' + n.inst


def leverage(cue, T, M):
    JOIN, CLICK, EYES = M['JOIN'], M['CLICK'], M['EYES']
    sec = cue.sec(JOIN, bars=6)
    a, g, f = sec.a, sec.g, sec.f
    t_end, eyes = f(CLICK), f(EYES)
    quiet0, quiet1 = f(M['SPEAK']), f(M['DIALOG'])
    cells = [['F2', 'C3', 'F2', 'F2', 'Gb2', 'F2', 'C3', 'F3'],
             ['F2', 'C3', 'F3', 'F2', 'Gb2', 'C3', 'F2', 'Gb2'],
             ['F2', 'F2', 'C3', 'F2', 'Gb2', 'F2', 'Db3', 'C3'],
             ['F2', 'C3', 'F2', 'Gb2', 'F2', 'C3', 'F3', 'C3']]
    acc = [1.0, 0.78, 0.86, 0.8, 0.94, 0.78, 0.88, 0.82]
    for bar in range(1, 5):
        for i, p in enumerate(cells[bar - 1]):
            t = g.t(bar, 1 + 0.5 * i)
            if t >= t_end - 0.02:
                continue
            if t >= eyes - 1e-6:
                p = {'F3': 'Gb3'}.get(p, p)
            a.n('vc', p, t, '1/8', 0.46 * acc[i], lock=True, art='pizz')
        if g.t(bar) < t_end - 0.02:
            a.n('cb', 'F1', (bar, 1), '1/4', 0.5, lock=True, art='pizz')
        t35 = g.t(bar, 3.5)
        if bar % 2 == 0 and not (quiet0 <= t35 < quiet1) and t35 < t_end - 0.02:
            a.n('cb', 'F1', t35, '1/4', 0.4, lock=True, art='pizz')
    thud = {1: [1.0, 4.0], 2: [2.5], 3: [3.5], 4: [1.0]}
    for bar, bts in thud.items():
        for bt in bts:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1 or t >= t_end - 0.02:
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
            if quiet0 <= t < quiet1 or t >= t_end - 0.02:
                continue
            a.n('noise', 60, t, '1/16', 0.42 if k % 3 else 0.5, lock=True, clock=clocks[k % len(clocks)],
                short=(k % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
            k += 1
    A_, B_ = ['F2', 'Gb2', 'C3'], ['Gb2', 'G2', 'Db3']
    t2 = g.t(2)
    a.ch('grand', A_, g.t(1), t2 - g.t(1), 0.30, roll=0.004)
    a.ch('grand', A_, t2, quiet0 - t2, 0.26, roll=0.004)
    a.ch('grand', A_, quiet1, eyes - quiet1, 0.34, roll=0.004)
    a.ch('grand', B_, eyes, f(M['STEP0']) - eyes, 0.37, roll=0.004)
    T['grand'].pedal = [(-1.0, False), (cue.s(JOIN) + 0.01, True), (cue.s(JOIN) + (t2 - g.t(1)) - 0.015, False),
                        (cue.s(JOIN) + (t2 - g.t(1)) + 0.01, True), (cue.s(M['SPEAK']) - 0.02, False),
                        (cue.s(M['DIALOG']) + 0.01, True), (cue.s(EYES) - 0.02, False), (cue.s(EYES) + 0.01, True),
                        (cue.s(M['STEP0']) - 0.02, False)]
    a.line('vln1', 'F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16 F5/16 C5/16 Ab4/16 C5/16', f(M['CARD'] + 7.5),
           vel=0.32, lock=True, art='pizz')
    a.n('felt', 'F4', f(JOIN + 75), '3b', 0.2)
    a.n('felt_mech', 60, f(JOIN + 75), 0.1, 0.3)
    T['felt'].pedal = [(-1.0, False), (cue.s(JOIN + 75) + 0.005, True), (cue.s(JOIN + 135), False)]
    for p, dfr, d in (('F4', 0, '1/8'), ('F5', 15, '1/16'), ('F4', 26, '1/8d')):
        a.n('beeper', p, f(M['DIALOG'] + dfr), d, 0.6, lock=True, rel=0.01, att=0.0, dec=0.0, sus=1.0)
    art.trem(a, 'vln2', ['F5', 'Gb5'], eyes, t_end - eyes, vel=0.3, swell=('ppp', 'pp'), lock=True)
    t, i = eyes, 0
    while t < t_end - 0.05:
        a.n('celesta', 'C5' if i % 2 == 0 else 'Db5', t, '1/8', 0.34 if i % 2 == 0 else 0.3, lock=True)
        t += g.beats_s(0.5, t)
        i += 1
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
    for fr, lab in [(M['CARD'] + 7.5, "Neleh's clockwork (her card)"), (JOIN + 75, 'his calm: one felt F4'),
                    (M['DIALOG'], 'the dialog: the 1-bit F F F'),
                    (EYES, 'his eyes: the cluster up a semitone; the spinner'),
                    (M['STEP0'], 'STEP FOUR 1 (Bbm(add9)): the arrow'), (M['STEP1'], 'step 2 (Ab(add9))'),
                    (M['STEP2'], 'step 3 (Gbmaj7), held to the click')]:
        cue.mark(fr, lab)
    cue.mark(M['SPEAK'], "Alyi's silent mouth: everything but the eighths drops", hit=False)
    cue.mark(CLICK, 'CANCEL = HARD STOP: D6 (the click is step four)', hit=False)


def build():
    M = syncmap()
    mm07 = load_track('mm07-how-to-fire-a-ceo')
    mm08 = load_track('mm08-the-falling-tile')
    cue = FCue(ID, 7.0, M['CLICK'], pre=7.0)          # file t = 0 = the segment's first frame
    T = tracks(cue, M, mm07, mm08)
    suite(cue, T, M)
    plan(cue, T, M, mm07)
    leverage(cue, T, M)
    s = cue.s
    end = s(M['CLICK']) + 0.6
    cue.mute(M['CLICK'], M['CLICK'] + 60)
    for lab, a0, a1 in [('S1 the suite: the pedal, the felt Water Line bar', 0, M['BP_CUT']),
                        ('S1 WORD + the waltz (3/4)', M['BP_CUT'], M['RESUME']),
                        ('S1 the labels (4/4 Blueprint, thinned under the reading)', M['RESUME'], M['HOLD']),
                        ('S1 "Good question.": the held chord', M['HOLD'], M['P0']),
                        ('S1 the path', M['P0'], M['STUCK']),
                        ('S1 BREAK (stuck, thin under the V.O.) + the tape-stop into JOIN', M['STUCK'], M['JOIN']),
                        ('S1 LEVERAGE (low), one take', M['JOIN'], M['CLICK'])]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title='Noon, Las Vegas: The Plan and the Call (Ep1 v3 Act Four, S1, to picture)',
        mm='MM-07 + MM-08 (Act Four v5 S1, re-spotted)', usage='BI',
        family='P01 DARK ROOM -> P14 BLUEPRINT -> P03 LEVERAGE -> D6',
        tone="his calm felt, the board's cheerful plan that breaks under his one wrong read, a trap closing, then nothing",
        scenes=[f'Ep1 v3 Act Four S1.01-S1.09, segment 0-{M["CLICK"] / FPS:.3f} s ({CLK.variant}); D6 from the Cancel click'],
        motifs=['the Water Line bar 1 (felt, swung; the nudge on his nudge; the settle never comes)',
                'the Blueprint (one chip-box note per label)', 'the knee-cell waltz F F F (the walk-offs)',
                'the Blueprint break + tape-stop (onto JOIN)', "Neleh's clockwork", 'the 1-bit flat line F F F',
                "Mada's spinner", 'Step Four (the arrow; the click is the blank)'],
        motif_ids=['STEP_FOUR'], key='F minor (felt) -> F dorian, quartal (the plan) -> F pedal, semitone clusters',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 S1',
        underscore_lufs=-20.0, album_lufs=-16.0,
        silence_windows=[(s(M['CLICK']) + 0.005, end - 0.01, 'D6: the Cancel click', -90.0)],
        sfx_slots=[dict(t=round(s(M['STAMP']), 3), sfx='rubber_stamp_C: HOW TO FIRE A CEO'),
                   dict(t=round(s(M['VOTES']), 3), sfx='rubber_stamp_C: VOTES: 0'),
                   dict(t=round(s(M['EQUITY']), 3), sfx='rubber_stamp_C: EQUITY: 0'),
                   dict(t=round(s(M['WHIP']), 3), sfx='paper_whip: the tear'),
                   dict(t=round(s(M['JOIN']), 3), sfx='dialog_ok_click: JOIN (the tape at zero)'),
                   dict(t=round(s(M['CLICK']), 3), sfx='dialog_ok_click: CANCEL (D6 on its frame)')],
        audition=[f'0-{s(M["STAMP"]):.1f} s: the pedal under the suite and the V.O., then the felt bar with the nudge on '
                  'his glass: air and one gesture, not a drone effect',
                  f'{s(M["STUCK"]):.1f}-{s(M["JOIN"]):.1f} s: the stuck loop under "gerg\'s not on it. alyi set it up. '
                  'probably just the budget.", then the tape-stop onto JOIN: the plan failing under his wrong read',
                  f'{s(M["JOIN"]):.1f}-{s(M["CLICK"]):.1f} s: LEVERAGE, a trap closing, not a tune; then the click takes it all'])
    macro = [(0.0, 0.0), (s(M['JOIN']) - 0.004, 0.0), (s(M['JOIN']), -3.0), (end + 1.0, -3.0)]
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=end, tail_s=0.0, meta=meta)
    window = [0.0, M['CLICK'] / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(lab, round(a0 / FPS, 4), round(a1 / FPS, 4)) for lab, a0, a1 in
                           [(l, cue.fr(a), cue.fr(b)) for l, a, b in cue.sections]],
                 silences=[(M['CLICK'] / FPS, M['CARVE'] / FPS - 0.015,
                            'D6: the Cancel click -> the phone\'s buzz (every bus at zero in the mix), then no score '
                            'under "super." (the suite\'s air holds it) -> the carve')])
    return sc, cue.T0, window, extra
