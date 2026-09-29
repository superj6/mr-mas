"""E01 v3.1 Act Four · THE PLAN, on the board's side · Neleh's desk at 11:52 -> the 11:59 tick

v3.1 (script draft 7; lock-v31.md; mood-analysis §4 #6): THE PLAN moves off his side.  The Orb's rewind lands on
Neleh's desk at 11:52 (Mada has joined early), and the blueprint is her document on the desk; the waltz (BLUEPRINT,
MM-07) comes in under her pointer at underscore and builds, and hands to PROCEDURE on the call clock's 11:59 tick.
Act Four v5's THE PLAN score (tracks/e01-act4-v5/s1-s4_s1_noon.py), copied and re-spotted, as the first round had it:
  * Neleh's clockwork pizzicato on her card as the whip lands (NELEH / READ THE CHARTER. LITERALLY.), eight sixteenths,
    clear of her "Once more, before the others join.";
  * the quartal pad from the end of her line (the push into the paper), then the stamp (SFX, C);
  * the chip waltz walks the three chairs off on its F F F ("stepped down"), the empty chairs, the 4/4 back;
  * one Blueprint note per label, thinned under her reading; one held chord for "Good question." (from Mada's tile)
    and the zeros; the moth; the harp draws the path, tick 1 on "1. NOON";
  * the fold runs on: the stuck G-A-flat loop, and the TAPE-STOP from the pull back to her desk (the paper whip),
    reaching zero on S3.00a's first frame, the 11:59 tick, where PROCEDURE's first chord lands (cue_board.py).
Every sync point is read from the timeline (as cue_noon.py's docstring lists).  Nothing here was listened to.
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
from engine.core import s2n   # noqa: E402
from engine.mix import convolve   # noqa: E402

ID = 'e01-v31-a4-plan'
PLAN_TRACKS = ('lead', 'lead2', 'tri', 'tri2', 'celesta', 'harp', 'woodclick', 'glasspad', 'vln1', 'vln2', 'vla',
               'vc', 'cb', 'cl')


def syncmap():
    M = {}
    M['DESK'] = A('v31-S3.00p')
    M['CARD'] = TXT('v31-S3.00p', 'NELEH /')
    M['ONCE_ON'], M['ONCE_END'] = Lon('v31-a4-0002'), Lend('v31-a4-0002')
    M['BP_CUT'] = A('S1.03')
    M['STAMP'] = SND('S1.03', 'rubber_stamp_C')
    if 'a5-25-01' in C.CLK.LINES:                         # (v3.1-v3.4: "Three of us stepped down this year.")
        M['WALK'] = float(round(W('a5-25-01', 'stepped')))
        M['RESUME'] = M['WALK'] + 90                      # the 4/4 returns (waltz bar 3's downbeat)
        M['WALTZ_BARS'] = 2
    else:
        # v3.5: the line is cut; the three outlines walk off on the waltz with no line while DIRE · NOVIHS · DRUH
        # hold, and the ring draws round the four: the walk-offs F F F end on it, and the 4/4 returns on the four
        four = TXT('S1.03', 'ALYI · NELEH')
        M['WALK'] = float(round(four - 47))
        M['RESUME'] = M['WALK'] + 45                      # one waltz bar, then the 4/4 on the four
        M['WALTZ_BARS'] = 1
    M['FOUR'] = W('a5-25-02', 'four')
    M['G0'] = M['WALK'] - 60                              # THE PLAN's grid: beat k at G0 + 15 k
    G0 = M['G0']
    snap = lambda f: G0 + 7.5 * round((f - G0) / 7.5)     # noqa: E731  the plan's eighth grid
    gq = Lon('a5-25-06')                                  # "Good question." (from Mada's tile)
    k = int((gq - 1 - M['RESUME']) // 30)
    M['HOLD'] = M['RESUME'] + 30 * k
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
    M['P0'] = G0 + 7.5 * np.ceil((M['PATH'] - G0 - 0.5) / 7.5)
    M['TICK1'] = G0 + 7.5 * np.ceil((TXT('S1.05', '1. NOON') - G0 - 0.5) / 7.5)
    M['STUCK'] = M['P0'] + 45                             # the fold runs on: the stuck loop
    M['WHIP'] = SND('S1.05', 'paper_whip')                # the pull back out of the linework to her desk
    M['JOIN'] = A('S3.00a')                               # (the name kept from v5) the 11:59 tick: the tape at zero
    M['TAPE0'] = min(M['WHIP'], M['JOIN'] - 8)            # the tape-stop from the pull back
    assert M['DESK'] < M['CARD'] < M['ONCE_ON'] < M['STAMP'] < M['WALK'] < M['PATH'] < M['TAPE0'] < M['JOIN'], M
    return M


def plan_post(sends, t_tear, t_join, mm07):
    """THE PLAN's players: their own reverb (so the tails are theirs), the tape-stop from the pull back, zero from the
    11:59 tick."""
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


def tracks(cue, M, mm07):
    T = palette()
    T7 = mm07.tracks()
    for k in PLAN_TRACKS:
        T['p_' + k] = replace(T7[k], name='p_' + k, sends={},
                              post=plan_post(dict(T7[k].sends), cue.s(M['TAPE0']), cue.s(M['JOIN']), mm07))
    T['p_vla'].eq = list(T['p_vla'].eq) + [('peq', 223.5, -10.0, 8.0)]          # v5's pizz-body notches
    T['p_cb'].eq = list(T['p_cb'].eq) + [('peq', 111.0, -12.0, 8.0)]
    T7 = mm07.waltz_tracks(T7, cue.s(M['RESUME']))
    for k in ('wz_box', 'wz_cel', 'wz_tri', 'wz_ch'):
        T[k] = T7[k]
    T['clk_vln'] = replace(T['vln1'], name='clk_vln', hum_ms=0.0, vel_jit=0.0, sends={'room': -14},
                           eq=list(T['vln1'].eq) + [('peq', 437.0, -12.0, 3.0)])  # Neleh's clockwork (the pizz body)
    return T


def plan(cue, T, M, mm07):
    G0, WALK, RESUME, STAMP, HOLD = M['G0'], M['WALK'], M['RESUME'], M['STAMP'], M['HOLD']
    sec = cue.sec(G0, bars=16)
    a = sec.a
    w = mm07.Writer(a, 0)
    q = sec.q
    talk = lambda f: in_talk(f, 2.0)                  # noqa: E731
    w.pad(mm07.Q_F[:3], q(min(STAMP + 5, M['ONCE_END'] + 3)), q(RESUME + 4), vel=0.24, att=0.8, rel=0.6)
    qw = q(WALK)
    for k, (du, v) in enumerate([(0.25, 0.50), (0.125, 0.44), (0.5, 0.52)]):
        fr = WALK + 15 * k
        w.box('F5', qw + k, v, dq=0.5, duty=du, inst='wz_box', ring=0.28)
        if not talk(fr):
            w.cel('F5', qw + k, 0.40, dq=0.9, inst='wz_cel')
        cue.mark(fr, f'the waltz: walk-off {k + 1} (F)')
    for k, (bass, ch) in enumerate([('F3', ['Ab4', 'C5']), ('Db3', ['F4', 'C5'])][:M['WALTZ_BARS']]):
        wb = qw + 3 * k
        w.tri(bass, wb, 2.9, 0.55, inst='wz_tri', dec=0.6)
        for bt in (1, 2):
            for p in ch:
                w.n('wz_ch', p, wb + bt, 0.3, 0.42 if bt == 1 else 0.36, duty=0.5, att=0.002, dec=0.12, sus=0.0,
                    rel=0.08, steps=15)
    if M['WALTZ_BARS'] > 1:
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
        w.cel('G5' if k % 2 == 0 else 'Bb5', qm + k / 6.0, 0.22 - 0.015 * k, dq=0.3)   # (v3.1: Bb, not Ab: the
        # celesta's Ab5 sample read as an A over the F in render 1)
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
    cue.mark(M['STUCK'], 'BREAK: the stuck G-Ab loop (the fold runs on)')
    cue.mark(M['TAPE0'], 'the tape-stop starts (the pull back to her desk)', hit=False)
    cue.mark(M['JOIN'], "the 11:59 tick: the tape reaches zero; PROCEDURE's first chord (cue_board)", hit=False)
    for n in a.notes:
        if n.inst.startswith('wz_'):
            n.vel *= 0.72
    # v3.5: nothing new starts inside the tape-stop, and the stuck loop's F root lets go as the tape starts to stop.
    # The loop's B-flat (the viola pizz) pitch-warped down through A over the held F read A/F 0.40 in the spectral
    # F-major check (v3.1-v3.4 carried the same window at ~0.10 as a known exception); now the tape drags only the
    # loop's own tails (G, A-flat, E-flat, D) into the 11:59 tick
    tq = sec.f(M['TAPE0'])
    a.notes = [n for n in a.notes if n.start < tq - 1e-6]
    for n in a.notes:
        if int(round(n.pitch)) % 12 in (5, 10) and n.start + n.dur > tq:   # the F root and the B-flat
            n.dur = max(0.03, tq - n.start - 0.01)
            n.x['rel'] = min(n.x.get('rel', 0.1), 0.06)
    sec.commit()
    for n in cue.notes:
        if n.inst in PLAN_TRACKS:
            n.inst = 'p_' + n.inst



def build():
    M = syncmap()
    mm07 = load_track('mm07-how-to-fire-a-ceo')
    cue = FCue(ID, M['DESK'], M['JOIN'], pre=12)
    T = tracks(cue, M, mm07)
    s = cue.s
    # Neleh's clockwork on her card as the whip lands (straight, precise), clear of her line
    n16 = 8 if M['CARD'] + 7.5 + 8 * 3.75 < M['ONCE_ON'] - 2 else 4
    pat = ['F5', 'C5', 'Ab4', 'C5', 'G5', 'C5', 'Ab4', 'C5']
    for i in range(n16):
        cue.a.n('clk_vln', pat[i % 8], s(M['CARD'] + 7.5 + 3.75 * i), 0.2, 0.3 * (1.25 if i == 0 else 1.0),
                lock=True, art='pizz')
    cue.mark(M['CARD'] + 7.5, "11:52: Neleh's clockwork on her card (the office, her desk)")
    # a sul-tasto quartal pad from her card to the stamp: the Blueprint's colour arriving under her desk (render 1:
    # the clockwork alone left a 1.6 s fragment and a 1.9 s hole before the pad)
    t_a, t_b = s(M['CARD'] + 7.5), s(M['STAMP'] + 8)
    for inst, p, v in (('vc', 'F3', 0.14), ('vla', 'Bb3', 0.12), ('vln2', 'Eb4', 0.1)):
        cue.a.n(inst, p, t_a, t_b - t_a, v, lock=True, art='sus', lp=1800, att=1.2, rel=0.6)
    plan(cue, T, M, mm07)
    end = s(M['JOIN']) + 0.3
    cue.mute(M['JOIN'], M['JOIN'] + 30)
    for lab, a0, a1 in [("PLAN Neleh's desk, 11:52: the clockwork, the pad", M['DESK'], M['BP_CUT']),
                        ('PLAN WORD + the waltz (3/4)', M['BP_CUT'], M['RESUME']),
                        ('PLAN the labels (4/4 Blueprint, thinned under the reading)', M['RESUME'], M['HOLD']),
                        ('PLAN "Good question.": the held chord', M['HOLD'], M['P0']),
                        ('PLAN the path', M['P0'], M['STUCK']),
                        ('PLAN the fold: stuck, the tape-stop into 11:59', M['STUCK'], M['JOIN'])]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title="THE PLAN, on the Board's Side (Ep1 v3.1 Act Four, to picture)",
        mm='MM-07 (Act Four v5 S1\'s PLAN, re-spotted to Neleh\'s desk)', usage='BI',
        family='P14 BLUEPRINT (+ NELEH_CLOCKWORK)',
        tone="the board's cheerful plan as her own document, precise and a little too pleased with itself; it stalls "
             'as the real call begins',
        scenes=[f'Ep1 v3.1 Act Four v31-S3.00p, S1.03-S1.05, segment {M["DESK"] / FPS:.3f}-{M["JOIN"] / FPS:.3f} s '
                f'({CLK.variant})'],
        motifs=['NELEH_CLOCKWORK (her card)', 'the Blueprint (one chip-box note per label)',
                'the knee-cell waltz F F F (the walk-offs)', 'the Blueprint break + tape-stop (into 11:59)'],
        motif_ids=[], key='F dorian, quartal (no A natural)',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27; v3.1 refit), from Act Four v5 S1',
        underscore_lufs=-20.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(s(M['STAMP']), 3), sfx='rubber_stamp_C: HOW TO FIRE A CEO'),
                   dict(t=round(s(M['VOTES']), 3), sfx='rubber_stamp_C: VOTES: 0'),
                   dict(t=round(s(M['EQUITY']), 3), sfx='rubber_stamp_C: EQUITY: 0'),
                   dict(t=round(s(M['WHIP']), 3), sfx='paper_whip: the pull back to her desk')],
        audition=[f'0-{s(M["STAMP"]):.1f} s: the office first (her clock, SFX), her clockwork on the card, then the '
                  'pad under her pointer: the board\'s side arrives as hers, not as a joke at his expense',
                  f'{s(M["WALK"]):.1f}-{s(M["RESUME"]):.1f} s: the walk-offs on F F F, a music box, never a circus',
                  f'{s(M["STUCK"]):.1f}-{end:.1f} s: stuck, then the tape-stop into 11:59: the plan stalling as the real '
                  'call begins'])
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
               length_s=end, tail_s=0.0, meta=meta)
    window = [M['DESK'] / FPS - 0.005, M['JOIN'] / FPS, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(l, round(cue.fr(a0) / FPS, 4), round(cue.fr(a1) / FPS, 4)) for l, a0, a1 in cue.sections],
                 silences=[])
    return sc, cue.T0, window, extra
