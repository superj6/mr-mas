"""E01 Act Four v5 · S1 · NOON, LAS VEGAS: THE PLAN AND THE CALL · act 0 -> 997 (the Cancel click: D6)

One performance from the suite to the Cancel click, file t = 0 = act frame 0.  Three colours hand off inside it,
never by a cut between unrelated sections:  his felt (DARK ROOM, MM-07 sc 24) rings on under the stamp into THE
PLAN (BLUEPRINT, MM-07's voices, straight, 0 ms); the plan's own tape-stop runs from the tear and reaches zero ON
the JOIN click; LEVERAGE (low, MM-08's cells and voices) enters on that click's frame and plays as one take until
the Cancel click, where every stem and tail goes to digital zero (D6, the act's one designed silence).  Nothing
plays after it: D6 runs to the phone's buzz (1086) and the room alone carries "super." (1135); S2's felt is the
re-entry at 1178 (s1-s4_s2_third_mark.py).

  act frame  music                                                   picture (lock v5)
  49-109     the Water Line bar on the felt, swung; its nudge G4      S1.01 the suite; S1.02 he nudges the glass
             (+ the 50 % chip square, the nudge only) ON the glass     (94); the glow turns to blueprint
             nudge (94); the C4 hangs on Dbmaj7 (109), pedal down
  144-176    the felt rings on through the blueprint's cut and the   S1.03 the sheet; HOW TO FIRE A CEO stamps
             stamp (151, SFX, C); the quartal pad after the stamp      (151)
  186/201/216 the chip waltz (3/4 on the 96 beat): F F F, one a beat,  the three walk off, one a waltz beat
             each walk-off on its F (the flat line, a new duty on      (plan4.ts: three, +15, +30), under
             every note); celesta only once the line has ended         "...stepped down this year." (177-215)
  231-276    waltz bar 2: the accompaniment alone (the empty chairs)  "Leave out Mas and Gerg, and the four..."
  276        the 4/4 returns on "four" (the waltz players' tails      the ring draws round the four
             gated there); one Blueprint note per label from here:
             F (276) G (313.5) Ab (328.5) Bb (358.5) C (411)           the four / NONPROFIT / controls /
             under a line: the box alone; in a gap: the full voice    company / NOPEAI · THE COMPANY
  426-606    the zeros: Bb on VOTES: 0's line end (531), Ab on CEO    S1.04 VOTES: 0 (the stamp, SFX), CEO
             (546); the EQUITY stamp is the SFX's (a rest)
  606-666    one held quartal chord, pp, no movement: "Good          "Good question."; the two zeros; the moth
             question." and the moth's celesta flutter (636)
  666-711    the path: the harp draws it, the pulse, tick 1 = F4      S1.05 the four step onto 1. NOON (679)
             on 1. NOON (681); the later ticks are left out
  711-772    BREAK: the stuck G-Ab loop; the TAPE-STOP from the       the fold curls (714), the tear (729),
             tear (729) reaches zero on the JOIN click (772)            S1.06 JOIN (772)
  772-997    LEVERAGE (low) as one take, 15 beats: pizz eighths on    S1.07 the call; Neleh's card (787); Alyi's
             the F pedal, the muted-808 thud, the chip tick (one of    silent mouth (862); the dialog (888);
             four), low grand clusters; Neleh's clockwork on her card S1.08 his eyes (910); S1.09 the ALYI arrow
             (794.5); his calm, one felt F4 (847); everything but the  steps (940, 959, 978)
             eighths drops under Alyi's silent mouth (862-888); the
             1-bit beeper F F F on the dialog (888); the cluster up a
             semitone + Mada's spinner on his eyes (910); STEP FOUR on
             the arrow's steps (Bbm(add9), Ab(add9), Gbmaj7)
  997        CANCEL = HARD STOP: D6 (step four is the click)         the click; the tile falls

Under Neleh's reading THE PLAN is thinned in the notes: the pad, the roots, a soft pencil tick and one box note per
label (no celesta, harp or 4ths below on a word); the mix ducks it further (s1-s4_duckmap.json).  The PLAN's
players each carry their own reverb and the tape-stop inside the track, so their tails die on the JOIN click and
LEVERAGE starts clean on the same frame.

Run: OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py s1
"""
import importlib.util
import os
import sys
from dataclasses import replace

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('s1_s4_common', os.path.join(HERE, 's1-s4_common.py'))
if 's1_s4_common' in sys.modules:
    _C = sys.modules['s1_s4_common']
else:
    _C = importlib.util.module_from_spec(_spec)
    sys.modules['s1_s4_common'] = _C
    _spec.loader.exec_module(_C)
globals().update({k: getattr(_C, k) for k in dir(_C) if not k.startswith('__')})
from engine.core import s2n   # noqa: E402
from engine.mix import convolve   # noqa: E402

ID = 's1-s4_noon'
mm07 = load_track('mm07-how-to-fire-a-ceo')
mm08 = load_track('mm08-the-falling-tile')

# ------------------------------------------------------------------------------------------------ the sync map
NUDGE = M('S1.02', 'nudge')             # 94: he nudges the glass
FELT_BAR = NUDGE - 45                   # 49: the Water Line's bar starts so its nudge (beat 4) is his nudge
BP_CUT = A('S1.03')                     # 144: the blueprint
STAMP = M('S1.03', 'stamp')             # 151: HOW TO FIRE A CEO (rubber_stamp_C)
WALK = M('S1.03', 'three')              # 186: walk-off 1 (the pixel pass: three, three + 15, three + 30)
FOUR = W('a5-25-02', 'four')            # 272.6: "four"
G0 = WALK - 60                          # 126: THE PLAN's grid; beat k at G0 + 15 k (the walk-offs are beats 4-6)
RESUME = WALK + 90                      # 276: the 4/4 returns on "four" (waltz bar 3's downbeat)
PATH = A('S1.05')                       # 665 -> the grid's 666
TICK1 = 681                             # "1. NOON · VIDEO CALL" types on at 679
CURL = M('S1.05', 'curl')               # 714
TEAR = M('S1.05', 'tear')               # 729: the tape-stop starts
JOIN = M('S1.06', 'click')              # 772: the tape reaches zero; LEVERAGE's first eighth
CARD = M('S1.07', 'card')               # 787: NELEH / READ THE CHARTER
SPEAK, DIALOG = M('S1.07', 'speak'), M('S1.07', 'dialog')    # 862, 888
EYES = A('S1.08')                       # 910
STEP0, STEP1, STEP2 = A('S1.09'), M('S1.09', 'step1'), M('S1.09', 'step2')   # 940, 959, 978
CLICK = M('S1.09', 'click')             # 997: Cancel = D6
assert (FELT_BAR, STAMP, WALK, RESUME, JOIN, CLICK) == (49, 151, 186, 276, 772, 997), 'the lock moved: re-check'
assert RESUME >= FOUR and (CLICK - JOIN) == 225

PLAN_TRACKS = ('lead', 'lead2', 'tri', 'tri2', 'celesta', 'harp', 'woodclick', 'glasspad', 'vln1', 'vln2', 'vla',
               'vc', 'cb', 'cl')


def plan_post(sends, t_tear, t_join):
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


def tracks(cue):
    T = mm08._tweak(palette())                       # LEVERAGE's players keep their own names and settings
    T7 = mm07.tracks()
    for k in PLAN_TRACKS:
        T['p_' + k] = replace(T7[k], name='p_' + k, sends={}, post=plan_post(dict(T7[k].sends), cue.s(TEAR), cue.s(JOIN)))
    # the pizz sets' fixed body resonances, read as A under the F roots by the engine's F-major trace (3 windows
    # each): the viola pizz at ~222.7 Hz (v4's S1a notch) and the contrabass pizz at ~111 Hz (MM-08's)
    T['p_vla'].eq = list(T['p_vla'].eq) + [('peq', 223.5, -10.0, 8.0)]          # 221-226 Hz: both readings
    T['p_cb'].eq = list(T['p_cb'].eq) + [('peq', 111.0, -12.0, 8.0)]
    T7 = mm07.waltz_tracks(T7, cue.s(RESUME))        # the waltz's own players: tails gated as the 4/4 returns
    for k in ('wz_box', 'wz_cel', 'wz_tri', 'wz_ch'):
        T[k] = T7[k]
    for k in ('felt', 'felt_mech', 'lead'):          # the suite: his felt, as MM-07's sc 24 set it
        T['s_' + k] = replace(T7[k], name='s_' + k)
    T['s_felt'].gain_db += 2.0                       # v5: it read -25.6 LUFS against the plan's -21 (first render)
    return T


# ------------------------------------------------------------------------------------------------ sc 24: the suite
def suite(cue, T):
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
    # the pedal: down for bar 1, re-caught on the C4, held through the blueprint's cut and the stamp, up before her
    # first word (177.6): the felt rings on into WORD
    T['s_felt'].pedal = [(-1.0, False), (t1 - 0.05, True), (t2 + 0.01, False), (t2 + 0.05, True),
                         (cue.s(Lon('a5-25-01') - 2), False)]
    sec.commit()
    cue.mark(FELT_BAR, 'S1.01 the suite: the Water Line bar (felt, swung)')
    cue.mark(NUDGE, 'the nudge G4 on his glass nudge (+ the chip square, the nudge only)')
    cue.mark(FELT_BAR + 60, 'the C4 hangs on Dbmaj7: the settle never comes', hit=False)
    cue.mark(BP_CUT, 'the blueprint: the felt rings on (no cut)', hit=False)


# ------------------------------------------------------------------------------------------------ THE PLAN
def plan(cue, T):
    sec = cue.sec(G0, bars=14)
    a = sec.a
    w = mm07.Writer(a, 0)
    q = sec.q                                         # act frame -> quarter on this grid (G0 = 0)
    talk = lambda f: in_talk(f, 2.0)                  # noqa: E731  (a word is sounding here)

    # WORD: the stamp (SFX, C) is the pickup; a quartal pad enters after it and holds under the waltz and its
    # empty-chairs bar to the 4/4's return (v5 render 2: without it the bar decayed to about -40 LUFS under her words)
    w.pad(mm07.Q_F[:3], q(STAMP + 5), q(RESUME + 4), vel=0.24, att=0.45, rel=0.6)

    # the waltz, 3/4 on the 96 beat: the three walk off on its F F F (one a beat), then the empty chairs
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

    # the 4/4 Blueprint returns on "four": roots every 2 beats, quartal pads, a soft pencil tick on the beat
    HARM = [(276, 'F2', mm07.Q_F), (306, 'Bb2', mm07.Q_BB), (336, 'C2', mm07.Q_C), (366, 'F2', mm07.Q_F),
            (396, 'G2', mm07.Q_G), (426, 'C2', mm07.Q_C), (456, 'F2', mm07.Q_F), (486, 'Bb2', mm07.Q_BB),
            (516, 'C2', mm07.Q_C), (546, 'F2', mm07.Q_F), (576, 'D2', mm07.Q_D)]
    for i, (fr, root, chord) in enumerate(HARM):
        nxt = HARM[i + 1][0] if i + 1 < len(HARM) else 606
        w.pizz('vc', root, q(fr), 0.50 if talk(fr) else 0.55)
        w.tri(nm(root) + 12, q(fr), (nxt - fr) / 15 * 0.8, 0.42)
        w.pad(chord[:3], q(fr), q(nxt), vel=0.25, att=0.35 if i else 0.12, rel=0.5)
    for fr in range(276, 606, 15):
        w.tick(q(fr), 0.20 if talk(fr) else 0.28)
    # one Blueprint note per label: the box alone on a word, the full voice in a gap
    LABELS = [(276, 'F4', 'the four: ALYI · NELEH · MADA · THE QUIET VOTE'), (313.5, 'G4', 'NOPEAI · THE NONPROFIT'),
              (328.5, 'Ab4', '"controls": the arrow'), (358.5, 'Bb4', '"company"'),
              (411, 'C5', 'NOPEAI · THE COMPANY'), (531, 'Bb4', 'VOTES: 0 (after the stamp, on the line\'s end)'),
              (546, 'Ab4', 'CEO')]
    for fr, p, lab in LABELS:
        if talk(fr):
            w.box(p, q(fr), 0.50, dq=0.6, ring=0.3)
        else:
            w.box(p, q(fr), 0.60, dq=0.7, ring=0.4)
            w.cel(nm(p) + 12, q(fr), 0.42, dq=1.0)
            w.box(mm07.FOURTH_BELOW[p], q(fr), 0.38, dq=0.6, duty=0.5, inst='tri2', ring=0.25)
            w.harp(p, q(fr), 0.34, dq=1.2)
        cue.mark(fr, f'label: {lab} ({p})')
    cue.mark(RESUME, 'the 4/4 returns on "four" (the waltz tails gated)', hit=False)

    # "Good question." and the two zeros: one held quartal chord, pp, no movement; the moth's celesta flutter
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), ['F3', 'Bb3', 'Eb4', 'Ab4']):
        w.n(inst, p, q(606), q(PATH + 1) - q(606), 0.14, lp=1800.0, att=0.25, rel=0.35)
    w.n('glasspad', 'Eb5', q(606), q(PATH + 1) - q(606), 0.28, rel=0.3)
    w.n('glasspad', 'Ab5', q(606), q(PATH + 1) - q(606), 0.24, rel=0.3)
    w.pizz('vc', 'F2', q(606), 0.42, dq=2.0)
    qm = q(M('S1.04', 'moth') + 1)
    for k in range(6):
        w.cel('G5' if k % 2 == 0 else 'Ab5', qm + k / 6.0, 0.22 - 0.015 * k, dq=0.3)
    cue.mark(606, 'the held chord: "Good question." (pp, no movement)', hit=False)
    cue.mark(M('S1.04', 'moth') + 1, 'the moth (celesta flutter, pp)', hit=False)

    # the path: the harp draws it (quartal eighths), the pulse, tick 1 on "1. NOON"
    P0 = PATH + 1                                                     # 666 (on the grid)
    harp8 = ['F3', 'Bb3', 'Eb4', 'Ab4', 'G4', 'Eb4', 'Bb3', 'G3']
    for k in range(6):
        w.harp(harp8[k % 8], q(P0) + 0.5 * k, 0.30 + 0.06 * (k % 4 == 0), dq=0.8)
    w.pulse(q(P0), q(P0 + 30), mm07.PULSE_G, vel=0.36)
    w.pulse(q(P0 + 30), q(711), mm07.PULSE_F, vel=0.36)
    for fr, root, chord in [(P0, 'G2', mm07.Q_G), (P0 + 30, 'F2', mm07.Q_F)]:
        w.pizz('vc', root, q(fr), 0.5)
        w.tri(nm(root) + 12, q(fr), 1.5, 0.44)
        w.pad(chord[:3], q(fr), q(fr + 30), vel=0.25)
    w.box('F4', q(TICK1), 0.66, dq=1.1, ring=0.55)
    w.cel('F5', q(TICK1), 0.46, dq=1.6)
    w.box('C4', q(TICK1), 0.40, dq=0.9, duty=0.5, inst='tri2', ring=0.4)
    w.tick(q(TICK1), 0.40)
    cue.mark(P0, 'the path: the harp draws it', hit=False)
    cue.mark(TICK1, 'tick 1: 1. NOON (F4)')

    # BREAK: the line's last two beats stick (G, Ab) as the fold curls; the tape-stop from the tear
    mm07.stuck(w, q(711), q(JOIN), root='F2')
    cue.mark(711, 'BREAK: the stuck G-Ab loop (the fold curls at 714)')
    cue.mark(TEAR, 'the tear: the tape-stop starts', hit=False)
    cue.mark(JOIN, 'JOIN: the tape reaches zero; LEVERAGE\'s first eighth on the click')
    for n in a.notes:                                                # v5 first render: the waltz under her first line
        if n.inst.startswith('wz_'):                                 # read -18.2 LUFS, 3-4 dB over the labels
            n.vel *= 0.72
    sec.commit()
    for n in cue.notes:                                              # THE PLAN's players: their own reverb + the tape
        if n.inst in PLAN_TRACKS:
            n.inst = 'p_' + n.inst


# ------------------------------------------------------------------------------------------------ LEVERAGE (low)
def leverage(cue, T):
    sec = cue.sec(JOIN, bars=6)
    a, g, f = sec.a, sec.g, sec.f
    t_end, eyes = f(CLICK), f(EYES)
    quiet0, quiet1 = f(SPEAK), f(DIALOG)              # Alyi's silent mouth: everything but the eighths drops
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
                p = {'F3': 'Gb3'}.get(p, p)           # the cluster moved: the pizz follows its Gb
            a.n('vc', p, t, '1/8', 0.46 * acc[i], lock=True, art='pizz')
        if g.t(bar) < t_end - 0.02:
            a.n('cb', 'F1', (bar, 1), '1/4', 0.5, lock=True, art='pizz')
        t35 = g.t(bar, 3.5)
        if bar % 2 == 0 and not (quiet0 <= t35 < quiet1) and t35 < t_end - 0.02:
            a.n('cb', 'F1', t35, '1/4', 0.4, lock=True, art='pizz')
    thud = {1: [1.0, 4.0], 2: [2.5], 3: [3.5], 4: [1.0]}          # uneven: never a heartbeat
    for bar, bts in thud.items():
        for bt in bts:
            t = g.t(bar, bt)
            if quiet0 <= t < quiet1 or t >= t_end - 0.02:
                continue
            v = 0.62 if bt == 1.0 else 0.5
            a.n('k808', 'F1', t, '1/4', v, lock=True, decay=0.26, punch=5.0, click=0.03, drive=1.0)
            a.n('bdrum_muted', 60, t, '1/4', v * 0.55, lock=True)
    keep = [(1.5, 3.0), (2.0, 4.5), (1.0, 3.5), (2.5, 4.0)]         # the chip tick keeps one eighth in four
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
    A_, B_ = ['F2', 'Gb2', 'C3'], ['Gb2', 'G2', 'Db3']            # the low grand clusters (who has the leverage)
    t2 = g.t(2)
    a.ch('grand', A_, g.t(1), t2 - g.t(1), 0.30, roll=0.004)
    a.ch('grand', A_, t2, quiet0 - t2, 0.26, roll=0.004)
    a.ch('grand', A_, quiet1, eyes - quiet1, 0.34, roll=0.004)
    a.ch('grand', B_, eyes, f(STEP0) - eyes, 0.37, roll=0.004)
    T['grand'].pedal = [(-1.0, False), (cue.s(JOIN) + 0.01, True), (cue.s(JOIN) + (t2 - g.t(1)) - 0.015, False),
                        (cue.s(JOIN) + (t2 - g.t(1)) + 0.01, True), (cue.s(SPEAK) - 0.02, False),
                        (cue.s(DIALOG) + 0.01, True), (cue.s(EYES) - 0.02, False), (cue.s(EYES) + 0.01, True),
                        (cue.s(STEP0) - 0.02, False)]
    # Neleh's clockwork pizzicato rides her card (straight, precise), an eighth after it types on
    a.line('vln1', 'F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16 F5/16 C5/16 Ab4/16 C5/16', f(CARD + 7.5),
           vel=0.32, lock=True, art='pizz')
    # his calm: one felt F4, pp, as her card holds; it rings as Alyi's mouth starts
    a.n('felt', 'F4', f(JOIN + 75), '3b', 0.2)
    a.n('felt_mech', 60, f(JOIN + 75), 0.1, 0.3)
    T['felt'].pedal = [(-1.0, False), (cue.s(JOIN + 75) + 0.005, True), (cue.s(JOIN + 135), False)]
    # the 1993-style dialog: the 1-bit beeper F F F, uneven, on its pop
    for p, dfr, d in (('F4', 0, '1/8'), ('F5', 15, '1/16'), ('F4', 26, '1/8d')):
        a.n('beeper', p, f(DIALOG + dfr), d, 0.6, lock=True, rel=0.01, att=0.0, dec=0.0, sus=1.0)
    # his eyes: violins trem "sul pont" ppp; Mada's spinner under his tile, to the click
    art.trem(a, 'vln2', ['F5', 'Gb5'], eyes, t_end - eyes, vel=0.3, swell=('ppp', 'pp'), lock=True)
    t, i = eyes, 0
    while t < t_end - 0.05:
        a.n('celesta', 'C5' if i % 2 == 0 else 'Db5', t, '1/8', 0.34 if i % 2 == 0 else 0.3, lock=True)
        t += g.beats_s(0.5, t)
        i += 1
    # STEP FOUR on the arrow's three steps; the Gbmaj7 holds to the click: the click is step four
    steps = [(STEP0, ['Bb3', 'C4', 'Db4', 'F4'], 'Bb2', STEP1), (STEP1, ['Ab3', 'Bb3', 'C4', 'Eb4'], 'Ab2', STEP2),
             (STEP2, ['F3', 'Gb3', 'Bb3', 'Db4'], 'Gb2', CLICK)]
    for fr, ch, bass, nx in steps:
        d = f(nx) - f(fr) + (0.02 if nx != CLICK else 0.0)
        for j, p in enumerate(ch):
            a.n('hn', p, f(fr), d, 0.5 if j == len(ch) - 1 else 0.42, lock=True, art='mute', rel=0.12)
        a.n('bsn', bass, f(fr), d, 0.5, lock=True, rel=0.12)
        a.ch('grand', [nm(bass) - 12, nm(bass)], f(fr), d, 0.26, lock=True, roll=0.0)
    sec.commit()
    for fr, lab in [(CARD + 7.5, "Neleh's clockwork (her card)"), (JOIN + 75, 'his calm: one felt F4'),
                    (DIALOG, 'the dialog: the 1-bit F F F'), (EYES, 'his eyes: the cluster up a semitone; the spinner'),
                    (STEP0, 'STEP FOUR 1 (Bbm(add9)): the arrow'), (STEP1, 'step 2 (Ab(add9))'),
                    (STEP2, 'step 3 (Gbmaj7), held to the click')]:
        cue.mark(fr, lab)
    cue.mark(SPEAK, "Alyi's silent mouth: everything but the eighths drops", hit=False)
    cue.mark(CLICK, 'CANCEL = HARD STOP: D6 (the click is step four)', hit=False)


def build():
    verify()
    cue = Cue(ID, FELT_BAR, CLICK, pre=FELT_BAR)       # file t = 0 = act frame 0
    T = tracks(cue)
    suite(cue, T)
    plan(cue, T)
    leverage(cue, T)
    s = cue.s
    end = s(CLICK) + 0.6
    cue.mute(CLICK, CLICK + 60)                         # D6: every stem and tail to digital zero on the click
    for lab, a0, a1 in [('the suite: the felt Water Line bar', 0, BP_CUT), ('WORD + the waltz (3/4)', BP_CUT, RESUME),
                        ('the labels (4/4 Blueprint, thinned under the reading)', RESUME, 606),
                        ('"Good question.": the held chord', 606, PATH + 1), ('the path', PATH + 1, 711),
                        ('BREAK + the tape-stop into JOIN', 711, JOIN), ('LEVERAGE (low), one take', JOIN, CLICK),
                        ('D6 (digital silence)', CLICK, CLICK + 14)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'Noon, Las Vegas: The Plan and the Call (Ep1 Act Four v5, S1, to picture)', mm='MM-07 + MM-08',
        family='P01 DARK ROOM -> P14 BLUEPRINT -> P03 LEVERAGE -> D6',
        tone='his calm felt, the board\'s cheerful plan that breaks, a trap closing without a tune, then nothing',
        scenes=[f'v5 S1.01-S1.09, act 0-{CLICK} (lock v5); file t = 0 = act frame 0; D6 from {CLICK}'],
        motifs=['the Water Line bar 1 (felt, swung; the nudge on his nudge; the settle never comes)',
                'the Blueprint (one chip-box note per label)', 'the knee-cell waltz F F F (the walk-offs)',
                'the Blueprint break + tape-stop', "Neleh's clockwork", 'the 1-bit flat line F F F', "Mada's spinner",
                'Step Four (the arrow; the click is the blank)'],
        motif_ids=['STEP_FOUR'],
        key='F minor (felt) -> F dorian, quartal, no A natural (the plan) -> F pedal with semitone clusters',
        underscore_lufs=-20.0, album_lufs=-16.0,
        silence_windows=[(s(CLICK) + 0.005, end - 0.01, 'D6: the Cancel click (no score until S2)', -90.0)],
        sfx_slots=[dict(t=s(STAMP), sfx='rubber_stamp_C: HOW TO FIRE A CEO'),
                   dict(t=s(M('S1.04', 'votes')), sfx='rubber_stamp_C: VOTES: 0 (the score leaves it)'),
                   dict(t=s(M('S1.04', 'equity')), sfx='rubber_stamp_C: EQUITY: 0 (a rest)'),
                   dict(t=s(M('S1.05', 'tear')), sfx='paper_whip: the tear'),
                   dict(t=s(JOIN), sfx='dialog_ok_click: JOIN (the tape at zero)'),
                   dict(t=s(CLICK), sfx='dialog_ok_click: CANCEL (D6 starts on its frame)')],
        audition=[f'{s(FELT_BAR):.2f}-{s(STAMP):.2f} s: the felt bar; is the nudge G4 at {s(NUDGE):.2f} s his glass '
                  'nudge (one note on one gesture, not mickey-mousing)? the chip square a glint, not a beep',
                  f'{s(WALK):.2f}-{s(RESUME):.2f} s: the three walk-offs on F F F under "...stepped down this year." '
                  '-- a music box, small, never a circus; then the accompaniment alone (the empty chairs)',
                  f'{s(RESUME):.2f} s: the 4/4 back on "four": a joke, not a glitch?',
                  f'{s(RESUME):.2f}-{s(606):.2f} s: thinned under the reading (pad, roots, tick, one box note a label): '
                  'does the drafting machine still read as a machine under her voice?',
                  f'{s(711):.2f}-{s(JOIN):.2f} s: stuck, then the tape-stop into JOIN: the plan failing, not a playback '
                  'fault; LEVERAGE starts on the same frame',
                  f'{s(JOIN):.2f}-{s(CLICK):.2f} s: LEVERAGE -- a trap closing, not a tune; then the click takes it all'])
    # LEVERAGE (low): MM-08's brief puts it at -22 -> -20 under the plan's level; the first render read it 2-3 dB over
    # the plan's labels, so it steps down 3 dB on the JOIN click (the tape is at zero there: the step can't be heard)
    macro = [(0.0, 0.0), (s(JOIN) - 0.004, 0.0), (s(JOIN), -3.0), (end + 1.0, -3.0)]
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
                 length_s=end, tail_s=0.0, meta=meta), cue


if __name__ == '__main__':
    sc, _ = build()
    print(sc.name, len(sc.notes), 'notes', round(sc.end_s, 2), 's')
