"""E01 v3 Act Four · S3 + S4 · THE BOARD'S SIDE (pass one) · the whip -> "Step four?" -> the dark room's door back

PROCEDURE (MM-09, P02), LIGHTER: dry, procedural comedy, one performance whose sections change on the rooms and days.
Act Four v5's pass one (tracks/e01-act4-v5/s1-s4_s3s4_procedure.py) is the template, re-spotted to the v3 lock and
lightened (v3-plan §6: "PROCEDURE, lighter"):
  * the pedals sit an octave up (cello B-flat2 + viola F3 sul tasto; no contrabass under the talk);
  * Neleh's clockwork pizzicato is the connective tissue between lines; under talk only the pedal and a soft clock
    tick, ducked; the viola whisper is kept only under the firing, and it steps down diatonically (no chromatic creep);
  * no piano, no chip, no swing (the exit rule): Mas appears only as record.
v3's cuts: the step-four volley (C13: Alyi's "That is the company telling us." moves into the boardroom wide, after
the first phone's clack), Mario's money call (C14: "no." cuts the Addendum's tail and nothing lands after it; the
dial tone holds), the statement's first sentence (C15: the floor steps to E on the statement), and the
`WHAT THEY DIDN'T KNOW` card (C16: no REVERSAL; the door back is sound: Mada's held C over the blank's F, which rings
into the dark room, where it becomes the major seventh of his D-flat chord).

  section   what                                                         picture
  a         Bbm(add9) + harp harmonics on the whip; the clockwork under  S3.00a 11:59 at Neleh's desk; the connect;
            the wait; the pedal from the connect, the whisper in the      "Mas. The board has decided..."
            gaps; the clockwork creeps back under the tinny "super.";    S3.01 "super." through their laptop
            STEP FOUR in quarters on the pen's run; the blank's F under  S3.02 the list; S3.03 the post [V] read once;
            the post; a tick under "Any objections?"; Post on a tick      "Any objections?"; Post
  b         the pedal; one pizz figure after the join chime; the         S3.04 Rima's appointment; S3.04b "Will we?"
            clockwork in the gaps (none after a punchline)                / "More. Soon."
  c         the hush: the pedal alone under Alyi's answer [V]; then the  S3.06-S3.07 the all-hands; S3.05 the evening,
            pulse with the keycaps, breathing to its downbeats            Gerg's post
  d         NOV 18: a D-flat bed and the hearts' cascade; the blue       S4.01 the hearts; S4.02 the boardroom: the
            heart; the phones' pizz bursts, the tick under Neleh; the    phones, Neleh x2, the clack, Alyi in the glass;
            Door's head through the door and the GPU choir under Alyi;   S4.07 Neleh's real face; the dial tones
            the sincere beat (the solo viola's three steps over Step
            Four); a designed rest for the dial tones
  e         the Lighthouse on the first ring (thinned to half notes      S4.08 the split: the offer; the eleven pages;
            under the talk); the Addendum on "some", cut by "no."; the    "In plain English: no."; the dial tone
            pedal holds under the dial tone
  f         the clockwork on the lobby camera; the straight-mute accent  S4.09 the CCTV; S4.10 the spotlight, S4.10b
            (F4 -> Bb4) on the spotlight; the folder's held chord; the    Ttemme, the sealed folder; S4.11 the hourglass
            hourglass grains, one a beat, falling
  g         TASYA'S FLOOR: Abmaj9 on the slate, Cmaj9 as the door opens,  S4.12 the slate door; S4.13 Tasya; the
            the Rhodes on the beats as he appears (the jangle owns the     statement [V] (one sentence); S4.13e the sign
            offbeats), Emaj9 on the statement, home on the sign
  h         the clockwork winds down and HANGS on one held C over the     S4.14 "Step four?"; S4.15 Mada, silent; the
            blank's F; Mada's spinner; the F leaves before the dark room's dark room's drone J-cuts in (S5.02)
            drone; the C rings on into S5.02
Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
from v3music import rebow   # noqa: E402

ID = 'e01-v3-a4-s3s4-board'


def cc_ramp(t0, fade_in, t1, fade_out, steps=10):
    pts = [(0.0, 11, 0)]
    for i in range(steps + 1):
        pts.append((t0 + fade_in * i / steps, 11, int(round(127 * (i / steps) ** 0.5))))
    for i in range(steps + 1):
        pts.append((t1 + fade_out * i / steps, 11, int(round(127 * (1 - i / steps) ** 2))))
    return pts


def syncmap():
    M = dict(
        WHIP=A('S3.00a'), CONNECT=SND('S3.00a', 'bell_ding_F6'), SUPER=CLK.LINES['a5-27-05'],
        LIST=SND('S3.02', 'key_tap_space'), POSTCLICK=SND('S3.03', 'post_click'), JOIN_R=SND('S3.04', 'bell_ding_F6'),
        HANDS=A('S3.06'), EVENING=A('S3.05'), KEYS=SND('S3.05', 'keycap_popcorn'),
        S4=A('S4.01'), ROOM=A('S4.02'), BUZZ=SND('S4.02', 'BUZZ', 0), BUZZ2=SND('S4.02', 'BUZZ', 1),
        CLACK=SND('S4.02', 'landing_thunk'), SINCERE=A('S4.07'), TONE1=SND('S4.07', 'DTMF', 0),
        SPLIT=A('S4.08'), RING=SND('S4.08', 'RING', 0), SOME=W('a5-27-31', 'some'), NO=W('a5-27-32', 'no'),
        CLICK8=SND('S4.08', 'dialog_ok_click'), DIALTONE=SND('S4.08', 'DIALTONE'), LOBBY=A('S4.09'),
        SPOT=A('S4.10'), FOLDER0=Lend('a5-27-41'), OKAY=Lon('a5-27-42'), FLIP=A('S4.11', 2),
        SLATE=A('S4.12', 2), OPEN=A('S4.12', 36), TASYA=A('S4.13'), GOOD=Lon('a5-27-44'),
        STMT=Lon('v3-a4-0001'), SIGN=A('S4.13e'), BOARD=A('S4.14'), MADA=A('S4.15'), HOME=A('S5.02'))
    M['BURY'] = M['S4'] + 28
    M['BLUE'] = M['S4'] + 103
    M['ALYI_ON'], M['ALYI_END'] = Lon('a5-27-28'), Lend('a5-27-28')
    M['NELEH2_END'] = Lend('a5-27-23')
    M['FLICKER'] = M['ALYI_END'] + 10
    assert M['WHIP'] < M['CONNECT'] < M['LIST'] < M['POSTCLICK'] < M['HANDS'] < M['S4'] < M['SPLIT'] < M['LOBBY']
    assert M['SLATE'] < M['OPEN'] < M['TASYA'] < M['STMT'] < M['SIGN'] < M['BOARD'] < M['MADA'] < M['HOME']
    return M


def tracks(mm09):
    T = mm09.tracks()                                # the exit: 0 ms humanisation, MM-09's voices
    T['rhodes'].gain_db = T['rhodes'].gain_db + 3.0          # (v5 +6; render 1 here: the floor read -18.3 LUFS)
    T['tick'] = replace(T['snare_taps'], name='tick', gain_db=-9.0, sends={'room': -14}, eq=[('hp', 350), ('lp', 7000)],
                        hum_ms=0.0, vel_jit=0.0)
    T['vln1'].eq = list(T['vln1'].eq) + [('peq', 440.0, -9.0, 5.0)]    # the violin pizz body (~430-450 Hz): an A
    return T


def build():
    M = syncmap()
    mm09 = load_track('mm09-the-boards-side')
    TASTO, CELLS, ACC = mm09.TASTO, mm09.CELLS, mm09.ACC
    cue = FCue(ID, M['WHIP'], M['HOME'] + 60, pre=12)
    s, a = cue.s, cue.a
    T = tracks(mm09)
    talk = lambda f: in_talk(f, 2.0)   # noqa: E731
    sup = M['SUPER']

    def talk_x(f):
        return talk(f) and not (sup['on'] * FPS - 3 <= f < sup['end'] * FPS + 3)

    def clock16(t0, n, first='F5', vel=0.3):
        pat = ['F5', 'C5', 'Ab4', 'C5', 'G5', 'C5', 'Ab4', 'C5']
        if first == 'G5':
            pat = pat[4:] + pat[:4]
        d = (15 / 4) / FPS
        for i in range(n):
            v = vel * (1.25 if i == 0 else (1.0 if i % 4 == 0 else 0.86))
            a.n('vln1', pat[i % 8], t0 + i * d, 0.2, min(1.0, v), lock=True, art='pizz')

    def gap_clockwork(f0, f1, vel=0.2, min8=34.0, min4=18.0):
        """Neleh's clockwork in the gaps between lines (8 sixteenths where 34 f are free, else 4 where 18 are)"""
        out = []
        ls = sorted((l['on'] * FPS, l['end'] * FPS) for l in CLK.lines(f0 / FPS, f1 / FPS))
        edges = [(f0, ls[0][0])] if ls else [(f0, f1)]
        edges += [(e1, o2) for (_, e1), (o2, _) in zip(ls, ls[1:])]
        if ls:
            edges.append((ls[-1][1], f1))
        for g0, g1 in edges:
            g0 += 3
            room = g1 - 3 - g0
            if room >= min8:
                clock16(s(g0), 8, 'F5' if len(out) % 2 == 0 else 'G5', vel)
                out.append((g0, 8))
            elif room >= min4:
                clock16(s(g0), 4, 'F5' if len(out) % 2 == 0 else 'G5', vel * 0.9)
                out.append((g0, 4))
        return out

    def tick(frames, vel=0.24):
        for i, fr in enumerate(frames):
            a.n('tick', 60, s(fr), 0.2, vel * (1.12 if i % 4 == 0 else (0.9 if i % 2 else 1.0)), lock=True)

    def pulse(f0, f1, cells, vel=0.24, anchor=None, thin=True):
        anchor = f0 if anchor is None else anchor
        fr = f0
        while fr < f1 - 1:
            i = int(round((fr - anchor) / 7.5)) % 8
            cell = cells[int((fr - anchor + 1e-6) // 60.0) % len(cells)]
            on_beat = abs(((fr - anchor) / 15.0) - round((fr - anchor) / 15.0)) < 1e-6
            if thin and talk(fr):
                if on_beat:
                    a.n('vc', CELLS[cell][i], s(fr), '1/8', vel * 0.72 * ACC[i], lock=True, art='spic')
            else:
                a.n('vc', CELLS[cell][i], s(fr), '1/8', vel * ACC[i], lock=True, art='spic')
            fr += 7.5

    def pedal(f0, f1, vel=0.17, first_att=0.4):
        """the lighter pedal: cello B-flat2 + viola F3, sul tasto (no contrabass under the talk)"""
        rebow(a, 'vc', 'Bb2', s(f0), s(f1), vel, seg=5.0, xf=1.0, first_att=first_att, art='sus', lp=TASTO)
        rebow(a, 'vla', 'F3', s(f0), s(f1), vel * 0.85, seg=5.0, xf=1.0, first_att=first_att + 0.2, art='sus',
              lp=TASTO)

    # ======================================================================= a · NOON, Neleh's desk
    WHIP, CONNECT, LIST, POSTCLICK = M['WHIP'], M['CONNECT'], M['LIST'], M['POSTCLICK']
    for inst, p, v in (('vc', 'Bb2', 0.22), ('vla', 'F3', 0.2), ('vln2', 'C4', 0.18), ('cl', 'F4', 0.22)):
        kw = dict(art='sus', lp=TASTO) if inst in ('vla', 'vln2', 'vc') else {}
        a.n(inst, p, s(WHIP), s(CONNECT + 6) - s(WHIP), v, lock=True, rel=0.45, **kw)
    a.ch('harm', ['Bb3', 'F4'], s(WHIP), 1.2, 0.3, lock=True)
    clock16(s(WHIP + 7.5), 8, 'F5', 0.26)
    clock16(s(WHIP + 37.5), 4, 'G5', 0.23)
    if CONNECT - WHIP > 70:
        clock16(s(WHIP + 52.5), 4, 'F5', 0.21)
    cue.mark(WHIP, 'a: the whip: Bbm(add9) + the harp-harmonic dyad (the board\'s side lands)')
    cue.mark(WHIP + 7.5, "a: Neleh's clockwork under the wait (11:59)")
    pedal(CONNECT, LIST + 2, 0.18, first_att=0.3)
    steps = [(CONNECT, 'Db4')]
    for lid, p in (('a5-27-01', 'C4'), ('a5-27-02', 'Bb3'), ('a5-27-04', 'Ab3')):
        steps.append((Lend(lid) + 3, p))
    steps.append((LIST, None))
    for i, (fr, p) in enumerate(steps[:-1]):
        nx = steps[i + 1][0]
        a.n('vla', p, s(fr), s(nx) - s(fr) + 0.35, 0.16, lock=True, art='sus', lp=TASTO, att=0.45, rel=0.5)
    cue.mark(CONNECT, 'a: the connect: the pedal (it holds under "Mas. The board has decided..."); the whisper '
                      'steps down in the gaps', hit=False)
    clock16(s(LIST - 75), 8, 'F5', 0.11)
    clock16(s(LIST - 45), 8, 'G5', 0.13)
    clock16(s(LIST - 15), 4, 'F5', 0.15)
    cue.mark(LIST - 75, 'a: the clockwork creeps back (under the tinny "super.": the procedure going on)')
    L = cue.sec(LIST, bars=3)
    mm09.step_four(L.a, 1, top='cl', inner=('vla', 'vln2', 'vln1'), vel=0.2, top_vel=0.22, blank=False, unit=1.0)
    L.commit()
    rebow(a, 'vc', 'F2', s(LIST + 45), s(POSTCLICK + 4), 0.18, seg=5.0, xf=1.0, first_att=0.05, art='sus', lp=TASTO)
    rebow(a, 'vla', 'C3', s(LIST + 45), s(POSTCLICK + 4), 0.13, seg=5.0, xf=1.0, first_att=0.3, art='sus', lp=TASTO)
    for k, lab in enumerate(['Bbm(add9) (1 ✓)', 'Ab(add9) (2. BLOG POST)', 'Gbmaj7 (3. INTERIM CEO)',
                             'the blank: the F bass alone (4. ____)']):
        cue.mark(LIST + 15 * k, f'a: STEP FOUR on the list: {lab}', hit=(k < 3))
    tick([POSTCLICK - 15 * k for k in range(5, -1, -1)], 0.24)
    cue.mark(POSTCLICK - 75, 'a: the clock tick (under "Any objections?" and its silence)')
    cue.mark(POSTCLICK, 'a: the Post click is a tick; the pedal back')

    # ======================================================================= b · Rima
    HANDS, EVENING = M['HANDS'], M['EVENING']
    pedal(POSTCLICK, HANDS + 4, 0.17, first_att=0.35)
    a.line('vln1', 'Bb4/16 F5/16 Db5/16 C5/16', s(M['JOIN_R'] + 4), vel=0.22, lock=True, art='pizz')
    cue.mark(M['JOIN_R'] + 4, 'b: one soft pizz figure after her join chime')
    got = gap_clockwork(M['JOIN_R'] + 30, Lon('a5-27-16') - 2, vel=0.17, min8=40.0, min4=17.0)
    for g0, n in got:
        cue.mark(g0, f'b: the clockwork in a gap ({n})')
    tick([f for f in range(int(M['JOIN_R'] + 40), int(Lon('a5-27-16')) - 4, 30) if not talk(f)], 0.18)

    # ======================================================================= c · the all-hands, and the evening
    pedal(HANDS, M['S4'] + 8, 0.15, first_att=0.8)
    cue.mark(HANDS, 'c: the all-hands: the pedal alone (the hush is the bed; the record plays dry)', hit=False)
    pulse(M['KEYS'], M['S4'], ['A', 'B', 'A', 'D', 'C'], vel=0.22, anchor=M['KEYS'])
    cue.mark(M['KEYS'], 'c: the pulse returns softly with the keycaps')

    # ======================================================================= d · NOV 18, the hearts; the boardroom
    D = M['S4']
    L_ = s(M['ROOM'] + 8) - s(D)
    for inst, p, v in (('vc', 'Db3', 0.12), ('vla', 'Ab3', 0.1), ('vln2', 'F4', 0.09)):
        a.n(inst, p, s(D), L_, v, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(L_, 0.6, 0.8))
    H = cue.sec(D, bars=3)
    mm09.cascade(H.a, H.f(D), H.f(M['BURY'] + 4), dens0=5.0, dens1=10.0, vel0=0.13, vel1=0.19)   # (render 1: -15.5)
    for n in H.a.notes:                              # render 2: the cascade peaked at -3.2 dBFS (momentary -13.4)
        if n.inst == 'harp':
            n.x['gain'] = -9.0
        elif n.inst == 'vla':
            n.vel *= 0.6
    H.commit()
    a.n('harm', 'Db6', s(M['BLUE']), 1.0, 0.3, lock=True, env=[(0, 1.0), (0.9, 0.35), (1.6, 0.0)])
    cue.mark(D, 'd: NOV 18: the Db bed; the hearts pour (the cascade, to the burial)')
    cue.mark(M['BLUE'], 'd: the blue heart (one harp harmonic)')
    ROOM, BUZZ, BUZZ2, CLACK = M['ROOM'], M['BUZZ'], M['BUZZ2'], M['CLACK']
    pedal(ROOM, M['SINCERE'] + 4, 0.17, first_att=0.5)
    pulse(BUZZ, BUZZ + 22.5, ['A'], vel=0.26, anchor=BUZZ, thin=False)
    pulse(BUZZ2 - 1, BUZZ2 + 21, ['D'], vel=0.24, anchor=BUZZ2 - 1, thin=False)
    tick([f for f in range(int(BUZZ + 30), int(CLACK) + 1, 15) if not (BUZZ2 - 8 <= f < BUZZ2 + 22)], 0.22)
    cue.mark(BUZZ, 'd: the phones buzz: the pizz locks to it')
    cue.mark(BUZZ2 - 1, 'd: the second buzz')
    cue.mark(CLACK - 1, "d: the clack: the tick's last, clean beat", hit=False)
    dh = M['NELEH2_END'] + 3
    a.n('door', 'Ab4', s(dh), 0.6, 0.4, lock=True, art='nv')
    a.n('door', 'Db5', s(dh + 15), s(M['ALYI_ON'] + 10) - s(dh + 15), 0.4, lock=True, art='nv', rel=0.6)
    r0, r1 = M['NELEH2_END'] + 12, M['FLICKER']
    Lc = s(r1) - s(r0)
    for inst, v in (('choir', 0.24), ('reed', 0.18)):
        for p in chord_of('GPU_CHOIR'):
            a.n(inst, p, s(r0), Lc + 0.05, v, lock=True)
        T[inst].cc = cc_ramp(s(r0), 0.7, s(r1) - 0.9, 0.9)
    cue.mark(dh, 'd: THE DOOR (Ab4 -> Db5) through the door: Alyi in the glass')
    cue.mark(r0, 'd: the GPU choir, ppp, under "That is the company telling us." (to the flicker)', hit=False)
    SB = cue.sec(M['SINCERE'], bars=3)
    SB.a.seq('svla', [('F4', (1, 1), '1b', 0.5), ('Eb4', (1, 2), '1b', 0.48)], lock=True, art='sus')
    SB.a.n('svla', 'Db4', (1, 3), SB.f(M['TONE1'] - 6) - SB.g.at((1, 3)), 0.46, lock=True, art='sus', rel=0.55)
    mm09.step_four(SB.a, 1, top=None, inner=('vla', 'vln2', 'vln1'), vel=0.13, unit=1.0, blank=False)
    for n in SB.a.notes:
        if n.inst != 'svla':
            if n.start >= SB.g.at((1, 3)) - 1e-6:
                n.dur = SB.f(M['TONE1'] - 6) - n.start
            n.x['rel'] = 0.5
    SB.commit()
    cue.mark(M['SINCERE'], 'd: the sincere beat: the solo viola plays the three steps (F Eb Db) over Step Four')
    cue.mark(M['TONE1'], 'd: DESIGNED REST: the four dial tones (room tone)', hit=False)

    # ======================================================================= e · the rival lab (the split)
    RING, SOME, NO, LOBBY = M['RING'], M['SOME'], M['NO'], M['LOBBY']
    E_ = cue.sec(RING, bars=16)
    ea, fl = E_.a, E_.f
    lh = ['F4', 'Bb4', 'Db5']
    k, fr = 0, RING
    first_line = Lon('a5-27-30')
    while fr < M['CLICK8'] - 4:
        p = lh[k % 3]
        if not talk(fr):
            full = fr < first_line
            ea.n('marimba', p, fl(fr), 0.6, 0.32 if full else 0.24, lock=True)
            if full:
                ea.n('harp', p, fl(fr), 0.8, 0.25, lock=True)
        elif k % 2 == 0:
            ea.n('marimba', p, fl(fr), 0.6, 0.18, lock=True)
        fr += 15
        k += 1
    ea.n('celesta', 'F5', fl(RING), 0.6, 0.2, lock=True)
    E_.commit()
    rebow(a, 'vc', 'Bb2', s(RING), s(LOBBY + 8), 0.18, seg=4.5, xf=0.8, first_att=0.3, last_rel=1.0, art='sus', lp=TASTO)
    cue.mark(RING, 'e: the Lighthouse on the first ring')
    Qd = cue.sec(SOME, bars=4)
    qa = Qd.a
    place_motif(qa, 'svla', 'ADDENDUM', (1, 1), vel=0.4, lock=True, art='sus', rel=0.25)
    qa.line('svla', 'C4/8 Db4/8 Eb4/4', (3, 1), vel=0.4, lock=True, art='sus', gate=1.0, rel=0.03)
    qa.seq('vla', [('F3', (1, 1), '4b'), ('Db3', (2, 1), '2b'), ('Eb3', (2, 3), '2b'), ('Eb3', (3, 1), '2b')],
           vel=0.19, lock=True, art='sus', rel=0.05)
    cut = Qd.f(NO)
    for n in qa.notes:
        if n.start >= cut:
            n.vel = 0.0
        n.dur = max(0.02, min(n.dur, cut - n.start))
        n.x['rel'] = 0.03
    qa.notes = [n for n in qa.notes if n.vel > 0.0]
    Qd.commit()
    cue.mark(SOME, 'e: the Addendum (Mario\'s quartet, thin), on "some thoughts"')
    cue.mark(NO, 'e: "no." CUTS the tail (and nothing lands after it: the dial tone)', hit=False)

    # ======================================================================= f · Sunday
    SPOT, FOLDER0, FLIP, SLATE = M['SPOT'], M['FOLDER0'], M['FLIP'], M['SLATE']
    pedal(LOBBY + 10, SLATE + 4, 0.16, first_att=1.2)
    clock16(s(LOBBY + 8), 8, 'F5', 0.19)
    clock16(s(LOBBY + 38), 8, 'G5', 0.17)
    tick([f for f in range(int(LOBBY + 83), int(SPOT) - 10, 15)], 0.2)
    cue.mark(LOBBY + 8, 'f: the clockwork resumes on the lobby camera, thin')
    a.n('cb', 'Bb1', s(SPOT), 0.2, 0.3, lock=True, art='pizz')
    a.seq('tpt', [('F4', s(SPOT), s(SPOT + 7.5) - s(SPOT), 0.23), ('Bb4', s(SPOT + 7.5), 0.94, 0.22)],
          lock=True, art='straight', rel=0.3)
    pulse(SPOT, Lon('a5-27-38') - 3, ['A', 'D', 'A', 'B'], vel=0.24, anchor=SPOT, thin=False)
    tick([f for f in range(int(SPOT + 120), int(FOLDER0) + 1, 15)], 0.2)
    cue.mark(SPOT, 'f: the spotlight: the straight-mute accent (F4 -> Bb4); the pulse')
    Lf = s(FLIP - 2) - s(FOLDER0 + 5)
    for inst, p, v in (('vla', 'F3', 0.16), ('vln2', 'C4', 0.14), ('vln1', 'Db4', 0.12)):
        a.n(inst, p, s(FOLDER0 + 5), Lf, v, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(Lf, 0.9, 0.7))
    cue.mark(FOLDER0 + 5, "f: it holds under the folder's long beat", hit=False)
    for i, (inst, p) in enumerate([('vln1', 'F5'), ('vln2', 'Db5'), ('vla', 'C5'), ('vln1', 'Bb4'), ('vln2', 'Ab4'),
                                   ('vla', 'Gb4')]):
        if FLIP + 2 + 15 * i < SLATE - 4:
            a.n(inst, p, s(FLIP + 2 + 15 * i), 0.3, 0.3 - 0.012 * i, lock=True, art='pizz')
    cue.mark(FLIP + 2, 'f: the hourglass: one grain a beat, falling')

    # ======================================================================= g · the door: Tasya's floor
    OPEN, TASYA, STMT, SIGN, BOARD = M['OPEN'], M['TASYA'], M['STMT'], M['SIGN'], M['BOARD']
    d1 = s(OPEN + 14) - s(SLATE)
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, s(SLATE), d1, 0.2, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d1, 0.6, 0.6))
    d2 = s(STMT + 20) - s(OPEN)
    r0_, r1_ = s(M['GOOD'] - 30) - s(OPEN), s(M['GOOD'] - 4) - s(OPEN)
    env2 = [(0.0, 0.0), (0.7, 1.0), (r0_, 1.0), (r1_, 0.63), (d2 - 0.9, 0.63), (d2, 0.0)]
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'B3'), ('vln1', 'D4')):
        a.n(inst, p, s(OPEN), d2, 0.18, lock=True, art='sus', lp=TASTO, env=env2)
    for k in range(4):
        a.ch('rhodes', ['E3', 'G3', 'B3', 'D4'], s(TASYA + 2 + 15 * k), 0.5, 0.45 if k else 0.5, lock=True)
    d3 = s(SIGN + 6) - s(STMT)
    for inst, p in (('vc', 'B2'), ('vla', 'G#3'), ('vln2', 'D#4'), ('vln1', 'F#4')):
        a.n(inst, p, s(STMT), d3, 0.14, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d3, 1.0, 0.8))
    d4 = s(BOARD + 16) - s(SIGN)
    for inst, p in (('vc', 'Ab2'), ('vla', 'Eb3'), ('vln2', 'G3'), ('vln1', 'C4')):
        a.n(inst, p, s(SIGN), d4, 0.19, lock=True, art='sus', lp=TASTO, env=mm09.sw_env(d4, 0.4, 0.7))
    a.ch('rhodes', ['C4', 'Eb4', 'G4', 'Bb4'], s(SIGN + 1), 0.9, 0.47, lock=True)
    for fr, lab, hit in [(SLATE, "g: Tasya's floor: Abmaj9 on the slate (silent attack)", False),
                         (OPEN, 'g: Cmaj9 as the door opens', False),
                         (TASYA + 2, 'g: the Rhodes on the beats (Tasya appears; the jangle owns the offbeats)', True),
                         (STMT, 'g: the statement [V]: the floor steps to Emaj9 (a colour, not a swell)', False),
                         (SIGN + 1, 'g: home: Abmaj9 on the sign, one Rhodes chord', True)]:
        cue.mark(fr, lab, hit=hit)

    # ======================================================================= h · "Step four?": the hang -> the door back
    HOME, MADA = M['HOME'], M['MADA']
    for p, off, v in zip(['F5', 'C5', 'Ab4', 'C5', 'G5'], [0, 3, 6.5, 10.5, 15], [0.28, 0.25, 0.24, 0.23, 0.22]):
        a.n('vln1', p, s(BOARD + off), 0.3, v, lock=True, art='pizz')
    hang = BOARD + 20
    f_out = HOME - 26                                  # the F leaves before the dark room's drone J-cuts in
    a.n('svln', 'C5', s(hang), s(HOME + 40) - s(hang), 0.2, lock=True, art='sus', att=0.25, lp=2600, rel=1.4)
    a.n('vc', 'F2', s(hang + 2), s(f_out) - s(hang + 2), 0.2, lock=True, art='sus', lp=TASTO, att=0.3, rel=0.6)
    Sp = cue.sec(MADA + 3, bars=2)
    mm09.spinner(Sp.a, (1, 1), 5, 0.15)
    Sp.commit()
    cue.mark(BOARD, 'h: the clockwork winds down')
    cue.mark(hang, 'h: the hang: one held C over the blank F (a pedal, not silence)', hit=False)
    cue.mark(MADA + 3, "h: Mada's spinner turns under the held C (his silence)", hit=False)
    cue.mark(HOME, 'h: the door back: the held C rings on into the dark room (the drone under it)', hit=False)

    # ----------------------------------------------------------------------- thin under the words (compose-level)
    melodic = {'vln1', 'vln2', 'harm', 'harp', 'celesta', 'tpt', 'rhodes', 'door', 'svln', 'cl', 'hn', 'marimba'}
    keep, dropped = [], 0
    for n in cue.notes:
        fa = cue.fr(n.start)
        short = n.dur < 0.9 or n.x.get('art') in ('spic', 'pizz')
        if n.inst in melodic and short and talk_x(fa):
            if not (n.inst == 'marimba' and RING <= fa < LOBBY) and not (n.inst in ('vln1', 'vln2', 'vla')
                                                                          and FLIP <= fa < SLATE):
                dropped += 1
                continue
        keep.append(n)
    cue.notes[:] = keep
    for lab, a0, a1 in [('a NOON: the call, the list, the post', WHIP, POSTCLICK), ('b Rima', POSTCLICK, HANDS),
                        ('c the all-hands and the evening', HANDS, M['S4']), ('d NOV 18 hearts', M['S4'], ROOM),
                        ('d the boardroom: the phones, the glass', ROOM, M['SINCERE']),
                        ('d the sincere beat', M['SINCERE'], M['TONE1']), ('rest: the dial tones', M['TONE1'], RING),
                        ('e the rival lab (the split)', RING, LOBBY), ('f Sunday: the lobby camera', LOBBY, SPOT),
                        ('f Ttemme, the folder, the hourglass', SPOT, SLATE),
                        ("g the door: Tasya's floor", SLATE, BOARD), ('h Step four? (the hang)', BOARD, HOME),
                        ('the held C into the dark room', HOME, HOME + 40)]:
        cue.section(lab, a0, a1)
    end = s(HOME + 40) + 1.4
    meta = dict(
        id=ID, title="The Board's Side, lighter (Ep1 v3 Act Four, S3 + S4, to picture)",
        mm='MM-09 (Act Four v5 pass one, re-spotted and lightened)', usage='BI', family='P02 PROCEDURE (lighter)',
        tone='their side as one polite procedure with a blank fourth step: dry, procedural comedy; dignified',
        scenes=[f'Ep1 v3 Act Four S3.00a-S4.15 (+ the held C into S5.02), segment {M["WHIP"] / FPS:.3f}-'
                f'{(HOME + 40) / FPS:.3f} s ({CLK.variant})'],
        motifs=['STEP_FOUR (the list; the sincere beat)', 'NELEH_CLOCKWORK (between lines)', 'the whisper (the firing)',
                'the hearts', 'DOOR (the head, through the glass) + GPU_CHOIR', 'LIGHTHOUSE', 'ADDENDUM (cut by "no.")',
                'HOURGLASS', 'TASYA_FLOOR (Abmaj9 -> Cmaj9 -> Emaj9 -> Abmaj9)', 'MADA_SPINNER', 'the held C'],
        motif_ids=['ADDENDUM'],
        key='B-flat minor centre; Db lydian (Alyi); Bb minor (Mario); chromatic mediants (Tasya); C over F (the hang)',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 pass one',
        underscore_lufs=-21.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(s(CONNECT), 3), sfx='bell_ding_F6: his tile connects'),
                   dict(t=round(s(LIST), 3), sfx='key_tap_space: the pen ticks step 1'),
                   dict(t=round(s(POSTCLICK), 3), sfx='post_click (on a tick)'),
                   dict(t=round(s(M['JOIN_R']), 3), sfx="bell_ding_F6: Rima's join"),
                   dict(t=round(s(M['KEYS']), 3), sfx='keycap_popcorn (F5-C7; the pulse stays low)'),
                   dict(t=round(s(BUZZ), 3), sfx='BUZZ: the phones'), dict(t=round(s(CLACK), 3), sfx='the clack'),
                   dict(t=round(s(M['TONE1']), 3), sfx='DTMF x4 (the designed rest)'),
                   dict(t=round(s(RING), 3), sfx='RING: the lighthouse phone'),
                   dict(t=round(s(M['DIALTONE']), 3), sfx='DIALTONE (over the Bb pedal)'),
                   dict(t=round(s(SND('S4.13', 'JANGLE')), 3), sfx='JANGLE (the offbeat)')],
        audition=['the whole file: one procedure, lighter than v5 (the pedals an octave up, the clockwork between '
                  'the lines): dry comedy, never a nag',
                  f'{s(CONNECT):.1f}-{s(LIST):.1f} s: the pedal and the whisper under the firing: dignified, not villainous',
                  f'{s(M["ROOM"]):.1f}-{s(M["TONE1"]):.1f} s: the phones, the Door in the glass, the sincere beat: '
                  'do we care about Neleh?',
                  f'{s(SOME):.1f}-{s(LOBBY):.1f} s: the Addendum cut by "no.", then only the dial tone on the pedal',
                  f'{s(SLATE):.1f}-{s(BOARD):.1f} s: Tasya\'s floor: warm, faintly ironic; the E on the statement a colour',
                  f'{s(BOARD):.1f}-{end:.1f} s: the hang, the spinner, and the held C carried into the dark room'])
    # render 3: Tasya's floor read p95 -16.5 against the underscore's -17: a -1.5 dB ride from the slate to "Step four?"
    macro = [(0.0, 0.0), (s(SLATE) - 0.4, 0.0), (s(SLATE), -1.5), (s(BOARD) - 0.2, -1.5), (s(BOARD) + 0.3, 0.0)]
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=end, tail_s=1.0, meta=meta)
    window = [WHIP / FPS - 0.005, (HOME + 40) / FPS + 1.4, 0.0, 1.2]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(l, round(cue.fr(a0) / FPS, 4), round(cue.fr(a1) / FPS, 4)) for l, a0, a1 in cue.sections],
                 silences=[], dropped_under_words=dropped)
    return sc, cue.T0, window, extra
