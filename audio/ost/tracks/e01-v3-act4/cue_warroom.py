"""E01 v3.5 Act Four · S1A-S1B · THE WAR ROOM and THE FLIGHT · his post -> the calls -> the notepad -> the plane

v3.5 (sc 41-42; proposal-v35 "shock turns to fight", the showrunner's Social Network note): after the one silence
(the Remove click -> the buzz -> "super." -> his post typed twice, all unscored, D6 kept exactly), "before the card
fades, the phone lights and doesn't stop.  A driving pulse starts."  The pulse is THE SHOW'S OWN LEVERAGE (MM-08,
noon's trap) turned round: his leverage now.  Not a generic synth bed: the chip's triangle pulse in sixteenths on the
F (the motor), LEVERAGE's pizz eighths on the F pedal, its muted-808 thud (uneven) and chip ticks, the low grand
cluster; his calm on top (the felt, his Water Line, only where he isn't speaking).
  * the phone lights (his post's card, + 0.9 s): the triangle pulse swells in from the silence (a designed entry, a
    fader ride over 0.8 s, as the night's re-entry learned); the tiles stack over it
  * "the budget. i said the budget." (V.O.): the pulse alone, soft (thin under the inner voice)
  * GERG's call: LEVERAGE's pizz and thud come in on the cut; thinned to the pulse under Mas's "you didn't have to."
    (no score under his lines); under Gerg's "Yeah. I did." his Build, four notes, left hanging (the hurt)
  * TASYA's call: warm on top, cold under: on "Then we should talk." her Rhodes, one soft chord (the landlord's
    floor colour over the F, no third), her colour arriving as it did on "pen"
  * AUHSOJ, and "gerg. tasya. the money. the money. the money." (V.O., faster): the pulse and the pedal only
  * the 9:32 PM post: the full pulse back, and his calm on top: the felt's Water Line head (F F F G F)
  * the notepad (NEW COMPANY · MACROSOFT · BACK), the phone lighting again: the cluster up a semitone
  * THE FLIGHT: the pulse drops out on the cut to the plane; a sul-tasto F/C holds as the plane's hum; ONE FELT
    NOTE on "1. GERG" (his terms: relief, a spark), the F4, ringing into the night's re-entry (the same fifth)
Nothing below F1; no A anywhere; no third over the F.  Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import rebow   # noqa: E402

ID = 'e01-v35-a4-s1a-warroom'
S16 = 0.15625
Q = 0.625
BARS = 2.5
CELLS = [['F2', 'C3', 'F2', 'F2', 'Gb2', 'F2', 'C3', 'F3'],       # LEVERAGE's pizz cells (MM-08, noon's)
         ['F2', 'C3', 'F3', 'F2', 'Gb2', 'C3', 'F2', 'Gb2'],
         ['F2', 'F2', 'C3', 'F2', 'Gb2', 'F2', 'Db3', 'C3'],
         ['F2', 'C3', 'F2', 'Gb2', 'F2', 'C3', 'F3', 'C3']]
ACC = [1.0, 0.78, 0.86, 0.8, 0.94, 0.78, 0.88, 0.82]
THUD = {0: [1.0, 4.0], 1: [2.5], 2: [3.5], 3: [1.0]}               # the muted 808, uneven (a bar pattern of 4)


def present():
    return C.CLK.has('v35-41.01') and C.CLK.has('v35-42.01')


def entry():
    """the pulse's entry: his post's card up (v32-S1.13's post_click) + 0.9 s: the phone lights and doesn't stop"""
    return C.CLK.snd('v32-S1.13', 'post_click') + 0.9


def build():
    clk = C.CLK
    mm08 = load_track('mm08-the-falling-tile')
    w_in = entry()
    tiles = clk.B('v35-41.01')
    gerg = clk.B('v35-41.02')
    tasya = clk.B('v35-41.03')
    money = clk.B('v35-41.04')
    post = clk.B('v35-41.05')
    pad_ = clk.B('v35-41.06')
    plane = clk.B('v35-42.01')
    carve = clk.B('S2.01')
    terms = plane + (clk.txt('v35-42.01', '1. GERG') - plane if any(
        x['text'].startswith('1. GERG') for x in clk.TEXTS if x['beat'] == 'v35-42.01') else 1.0)
    cue = SCue(ID, int((w_in - BARS) * FPS), int((carve + 1.0) * FPS))
    a, s = cue.a, cue.s
    T = mm08._tweak(palette())
    T['vc'].eq = list(T['vc'].eq) + [('peq', 222.7, -10.0, 8.0), ('peq', 111.3, -8.0, 8.0)]   # (noon's notches)
    T['bdrum_muted'].eq = list(T['bdrum_muted'].eq) + [('peq', 111.3, -12.0, 6.0)]
    T['grand'].eq = list(T['grand'].eq) + [('peq', 111.3, -8.0, 8.0)]
    T['cb'].eq = list(T['cb'].eq) + [('peq', 110.0, -10.0, 8.0), ('peq', 221.5, -8.0, 8.0)]
    T['tri'].gain_db, T['tri'].eq = -6.0, [('lp', 900), ('hp', 45)]
    T['lead'].gain_db, T['lead'].eq, T['lead'].sends = -9.0, [('hp', 220), ('lp', 5200)], {'room': -14}
    T['felt'].gain_db, T['felt'].sends = -1.0, {'room': -12, 'hall': -16}
    T['felt'].eq = list(T['felt'].eq) + [('peq', 442.0, -9.0, 5.0), ('peq', 218.0, -6.0, 5.0)]   # (the night's)
    T['rhodes'].gain_db, T['rhodes'].sends = -6.0, {'room': -12, 'plate': -12}
    from dataclasses import replace
    T['vc_h'] = replace(T['vc'], name='vc_h', eq=[('lp', 1100), ('peq', 111.3, -10.0, 6.0)])   # the hum (bowed)
    T['vla'].gain_db = -4.0
    bar1 = tiles                                                  # the grid: bar 1 on the tiles' first frame

    def bt(b, beat=1.0):
        return bar1 + BARS * (b - 1) + (beat - 1.0) * Q

    def lines_at(t, pad=0.08):
        return clk.lines(t, t + 1e-3, pad=pad)

    def kind(t):
        ls = lines_at(t)
        if any(l['vo'] for l in ls):
            return 'vo'
        if any(l['who'] == 'mas' for l in ls):
            return 'mas'
        return 'talk' if ls else None

    # ---- the pulse: the chip's triangle in sixteenths on the F, from the phone lighting to the plane's cut
    t = bar1 - BARS * 2
    while t < w_in - 1e-6:
        t += S16
    i = 0
    while t < plane - 0.01:
        k = kind(t)
        v = 0.34 * (1.1 if i % 4 == 0 else 0.92)
        v *= 0.55 if k in ('vo', 'mas') else (0.8 if k == 'talk' else 1.0)
        p = 'F2' if not (pad_ <= t) else ('Gb2' if i % 8 == 6 else 'F2')
        a.n('tri', p, s(t), S16 * 0.7, v, lock=True, att=0.003, dec=0.08, sus=0.6, rel=0.03)
        t += S16
        i += 1
    cue.mark(w_in, 'DESIGNED HIT: the phone lights and doesn\'t stop (his post\'s card + 0.9 s): the war room\'s pulse '
                   'swells in out of the one silence (a 0.8 s fader ride)')
    # ---- LEVERAGE (pizz eighths, cb, the muted thud, chip ticks) from Gerg's call to the plane
    b0 = int((gerg - bar1) // BARS) + 1
    b1 = int((plane - bar1) // BARS) + 2
    clocks = [11000.0, 17000.0, 8000.0, 23000.0, 14000.0, 9500.0]
    kk = 0
    for b in range(b0, b1):
        for j, p in enumerate(CELLS[(b - b0) % 4]):
            tt = bt(b, 1 + 0.5 * j)
            if tt < gerg - 0.01 or tt >= plane - 0.02:
                continue
            k = kind(tt)
            if k in ('vo', 'mas'):
                continue                                          # no score under his lines (the pulse holds)
            if tt >= pad_:
                p = {'F3': 'Gb3', 'C3': 'Db3'}.get(p, p)          # the notepad: the cluster moves a semitone
            a.n('vc', p, s(tt), '1/8', 0.44 * ACC[j] * (0.8 if k == 'talk' else 1.0), lock=True, art='pizz')
        tt = bt(b)
        if gerg - 0.01 <= tt < plane - 0.02:
            a.n('cb', 'F1', s(tt), '1/4', 0.46 if kind(tt) is None else 0.34, lock=True, art='pizz')
        for btt in THUD[(b - b0) % 4]:
            tt = bt(b, btt)
            if gerg - 0.01 <= tt < plane - 0.02 and kind(tt) is None:
                a.n('k808', 'F1', s(tt), '1/4', 0.56 if btt == 1.0 else 0.46, lock=True, decay=0.26, punch=5.0,
                    click=0.03, drive=1.0)
                a.n('bdrum_muted', 60, s(tt), '1/4', 0.3, lock=True)
        for btt in ((1.5, 3.0), (2.0, 4.5), (1.0, 3.5), (2.5, 4.0))[(b - b0) % 4]:
            tt = bt(b, btt)
            if gerg - 0.01 <= tt < plane - 0.02 and kind(tt) is None:
                a.n('noise', 60, s(tt), '1/16', 0.4, lock=True, clock=clocks[kk % 6], short=(kk % 4 == 3), dec=0.03,
                    sus=0.0, rel=0.02, hp=2500)
                kk += 1
    cue.mark(gerg, 'GERG\'s call: LEVERAGE comes in on the cut (the pizz eighths, the thud, the ticks): his leverage now')
    # the low grand cluster (who has the leverage): A_ from Gerg's call, B_ (up a semitone) on the notepad
    A_, B_ = ['F2', 'Gb2', 'C3'], ['Gb2', 'G2', 'Db3']
    a.ch('grand', A_, s(tiles + 0.05), gerg - tiles - 0.05 + 0.2, 0.18, roll=0.004)
    a.ch('grand', A_, s(gerg), pad_ - gerg, 0.24, roll=0.004)
    a.ch('grand', B_, s(pad_), plane - pad_, 0.3, roll=0.004)
    T['grand'].pedal = [(-1.0, False)]
    cue.mark(pad_, 'the notepad (NEW COMPANY · MACROSOFT · BACK), the phone lighting again: the cluster up a semitone')
    # Gerg's hurt: his Build, four notes, left hanging, under his own "Yeah. I did."
    gl = [l for l in clk.lines(gerg, tasya) if l['who'] == 'gerg']
    if gl:
        tg = gl[-1]['on'] + 0.08
        for j, p in enumerate(['F4', 'F4', 'G4', 'Ab4']):
            a.n('lead', p, s(tg + j * S16), S16 * 0.62, 0.26 * (1.0, 0.72, 0.84, 0.72)[j], lock=True, duty=0.25,
                att=0.002, dec=0.09, sus=0.45, rel=0.035)
        cue.mark(tg, 'Gerg\'s "Yeah. I did.": his Build, four notes, left hanging (the hurt)')
    # Tasya: her Rhodes, one soft chord, on "Then we should talk." (the landlord's colour over the F, no third)
    tl_ = [l for l in clk.lines(tasya, money) if l['who'] == 'tasya']
    if tl_:
        tr = tl_[-1]['end'] - 0.28
        a.ch('rhodes', ['G3', 'Bb3', 'C4', 'Eb4'], s(tr), 1.6, 0.2, roll=0.012)
        cue.mark(tr, 'Tasya\'s "Then we should talk.": her Rhodes, one soft chord (warm on top, cold under it)')
    # his calm on top, after the count: the felt's Water Line head on the 9:32 PM post
    vo4 = [l for l in clk.lines(money, post + 1.0) if l['vo']]
    tw = max(post + 0.1, (vo4[-1]['end'] + 0.1) if vo4 else post + 0.1)
    for j, (p, d) in enumerate((('F4', Q), ('F4', Q), ('F4', Q), ('G4', Q / 2), ('F4', Q / 2 + 0.6))):
        t_ = tw + (sum((Q, Q, Q, Q / 2)[:j]) if j else 0.0)
        if t_ < plane - 0.1:
            a.n('felt', p, s(t_), d * 0.95, 0.24)
    a.ch('felt', ['Db3', 'Ab3'], s(tw), 3.0, 0.14, roll=0.02)
    T['felt'].pedal = [(-1.0, False)]
    cue.mark(tw, 'the 9:32 PM post: his calm on top: the felt\'s Water Line head (F F F G F) over the pulse')
    # THE FLIGHT: the pulse drops out on the cut; a sul-tasto F/C as the plane's hum; one felt note on "1. GERG"
    rebow(a, 'vc_h', 'F3', s(pad_ + 0.5), s(carve + 0.7), 0.13, seg=4.0, xf=1.0, first_att=1.2, last_rel=1.0,
          art='sus', lp=1100)
    rebow(a, 'vla', 'C4', s(plane - 0.3), s(carve + 0.7), 0.11, seg=4.0, xf=1.0, first_att=1.0, last_rel=1.0,
          art='sus', lp=1300)
    a.n('felt', 'F4', s(terms), carve - terms + 0.4, 0.26)
    a.n('felt_mech', 60, s(terms), 0.1, 0.3)
    T['felt'].pedal = [(-1.0, False), (s(tw) - 0.02, True), (s(plane - 0.2), False), (s(terms) - 0.02, True),
                       (s(carve + 0.9), False)]
    cue.mark(plane, 'THE FLIGHT: the pulse drops out on the cut; the F/C holds as the plane\'s hum', hit=False)
    cue.mark(terms, 'the flight: "1. GERG": ONE FELT NOTE (F4): relief, a spark; it rings into the night\'s re-entry')
    for lab, t0_, t1_ in [('S1A the war room: the pulse in (the tiles; the V.O.)', w_in, gerg),
                          ('S1A the calls: LEVERAGE, his (Gerg, Tasya, AUHSOJ, the count)', gerg, post),
                          ('S1A the 9:32 PM post, the notepad: his calm on top', post, plane),
                          ('S1B the flight: the hum, one felt note (relief)', plane, carve)]:
        cue.section(lab, t0_, t1_)
    meta = dict(
        id=ID, title='The War Room / The Flight (Ep1 v3.5 Act Four, sc 41-42)', mm='MM-08 LEVERAGE (his, now)',
        usage='BI', family='P03 LEVERAGE turned round: the chip pulse, the pizz, the thud, the felt on top',
        tone='shock turns to fight: a driving pulse, his calm on top; then relief on the plane',
        scenes=[f'Ep1 v3.5 Act Four sc 41-42, segment {w_in:.3f}-{carve:.3f} s ({clk.variant})'],
        motifs=['LEVERAGE (the pizz cells, the muted thud)', 'the Water Line head (his calm)', "Gerg's Build (four "
                'notes, left hanging)', "Tasya's Rhodes (one chord)", 'the felt F4 (the flight)'], motif_ids=[],
        key='F pedal, semitone clusters (F Gb C -> Gb G Db); no third over the F, no A',
        composer='v3.5 composer (the final pass), 2026-09-28', underscore_lufs=-20.0, album_lufs=-16.0,
        audition=['the pulse out of the silence: the phone lighting, not a trailer hit',
                  'the calls: driving but under the talk; nothing under his lines; the Social Network grammar in our '
                  'own sound (never a generic synth bed)', 'the flight: relief, one note'])
    # (render 1: the 9:32 PM post and the notepad read -15.7 LUFS, p95 -15.2: -1.5 dB there, off the words)
    macro = [(0.0, -60.0), (s(w_in) - 0.002, -60.0), (s(w_in) + 0.8, 0.0), (s(post) - 0.3, 0.0), (s(post), -1.5),
             (s(plane) + 10.0, -1.5)]
    sc = Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=s(carve + 1.0), tail_s=0.0, meta=meta)
    window = [w_in - 0.01, carve + 0.25, 0.0, 0.6]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.log],
                 sections=[(l, round(cue.act(a0), 4), round(cue.act(a1), 4)) for l, a0, a1 in cue.sections],
                 silences=[])
    return sc, cue.T0, window, extra
