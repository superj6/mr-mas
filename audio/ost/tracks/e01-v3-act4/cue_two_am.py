"""E01 v3 Act Four · S5 · 2 AM WITH GERG · warm, loyal, funny · the home shot -> "leave it open." -> the first tile

The v3 sample's C cue (audio/reel/ep01-v3-sample/music/track.py cue_c: D-flat lydian / A-flat major, the felt, the Water
Line warm, the Build with Gerg, Tasya's floor), re-spotted to the v3 lock from its line ids, with script draft 6's
sc 29 calls: a soft upright-bass pulse walks under the letter (only the pedal and the pulse under the quoted lines);
it drops out for the scroll's stop on ALYI and the Orb's chime, and comes back on "He did both."; the Build returns
with "he's typing like it's launch night.", and a pass is cut dead on his look up (the pedal holds: a ring-out);
Tasya's Rhodes gives one soft chord on the door and a second on "desk" over the floor's silent mediant steps; nothing
under "leave it open.", then the felt takes the landlord's chord back WITHOUT ITS THIRD and settles C4 -> F4 over it,
ringing out to the avalanche's first frame.  Nothing below C3 (the dark room's drone).

v3.2 (script draft 8.1): "gerg never waits to be asked." is cut (the pad alone holds the look); the MACROSOFT badge
slides under the door after "Due on the first.": the floor holds through the slide and the tick against his chair
leg, and when he sets the badge down beside the GUEST lanyard, unworn, the floor's third (vln1 C5) leaves, so the
chord is already open when the felt takes it back without its third after "leave it open."

The grid: 96 BPM, swung, bar 4 on the first heart.  Nothing here was listened to.
"""
from __future__ import annotations

import math
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import Cue, rebow, pedal_track, build16, Q, S16, BAR   # noqa: E402

ID = 'e01-v3-a4-s5-two-am'


def tracks():
    T = palette()
    T['felt'].gain_db = -1.0
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['felt_lh'] = replace(T['felt'], name='felt_lh')
    T['felt_mech'].gain_db = -14.0
    T['lead'].gain_db = -8.0
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db = -3.0
        T[k].sends = {'hall': -10, 'room': -16}
    T['rhodes'].gain_db = -2.0
    T['rhodes'].sends = {'room': -12, 'plate': -12}
    T['ubass'].gain_db = -4.0
    T['ubass'].sends = {'room': -12, 'hall': -18}
    T['ubass'].eq = list(T['ubass'].eq) + [('peq', 111.3, -10.0, 8.0)]
    return T


def build():
    c = C.CLK
    home = c.B('S5.02')
    heart1 = c.snd('S5.03', 'key_tap_soft_01')
    V35 = c.B('S5.03') < home                             # v3.5: the hearts come first (the match from Alyi's phone)
    T0 = (home - BAR) if V35 else (heart1 - 3 * BAR)       # grid bar 4 = the first heart (v3.5: bar 2 = the home shot)
    end = c.B('S6.01')
    cue = Cue(ID, T0, int(math.ceil((end - T0) / BAR)) + 4, swing=1.0)
    T = tracks()
    felt_ped = []
    L = c.LINES

    def fch(ps, t, d, v, roll=0.014, span_end=None, mech=0.2):
        felt_ped.append((cue.s(t), cue.s(span_end if span_end is not None else t + d)))
        cue.ch('felt_lh', ps, t, d, v, roll=roll)
        if mech:
            cue.n('felt_mech', 60, t, 0.1, mech)

    def blocked(a, b):
        return c.mas_room(a, b) or c.in_vo(a, b) or c.in_record(a, b)

    def passes(t0, t1, sizes, vel):
        out, t, k = [], t0, 0
        while t < t1:
            n = sizes[k % len(sizes)]
            while n >= 4 and (blocked(t - 0.05, t + n * S16 + 0.08) or t + n * S16 > t1):
                n -= 4
            if n >= 4:
                tt, got = build16(cue, t, n, vel, felt_every=4, felt_inst='felt', felt_vel=0.15)
                out.append((tt, got))
                k += 1
                t = tt + max(2 * BAR / 2, got * S16 + 2 * Q)
            else:
                t += Q
        return out

    if V35:
        # v3.5: the hearts first, on his phone (the match from Alyi's): his room comes back with the felt's first
        # chord on the cut, and the felt's count ticks with the hearts (quarters, varied pitches) into the home shot
        h0 = c.B('S5.03')
        fch(['Db3', 'Ab3', 'Eb4'], h0 + 0.04, home - h0 + 0.2, 0.1, roll=0.03, span_end=home - 0.02)
        for k, p in enumerate(['Ab3', 'Eb3', 'Bb3', 'Db4']):
            tk = heart1 + k * Q
            if tk < home - 0.1:
                cue.n('felt_lh', p, tk, Q * 0.9, 0.55 * (0.19, 0.17, 0.18, 0.16)[k])
        cue.mark(h0 + 0.04, 'C: v3.5: the hearts on his phone: the felt alone on the cut (his room first), the count '
                            'ticking with the hearts')
    # ---------------------------------------------------------------- the home shot: the felt, the Water Line warm
    fch(['Db3', 'Ab3', 'Eb4'], home + 0.07, 3.0, 0.1, roll=0.03)            # (render 1: the opening read -16.2 LUFS)
    cue.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.', 2, vel=0.13, swing=True)
    place_motif(cue.a, 'lead', 'WATER_LINE', (2, 1), part='nudge_double', vel=0.1, swing=1.0, duty=0.5, att=0.004,
                dec=0.25, sus=0.35, rel=0.12)
    fch(['Db3', 'Ab3', 'C4'], cue.bar(2), 2.4, 0.1)
    if V35:
        fch(['Db3', 'F3', 'Ab3'], cue.bar(3), c.B('S5.04') - cue.bar(3) + 0.1, 0.09, span_end=c.B('S5.04') + 0.02)
    else:
        fch(['Db3', 'F3', 'Ab3'], cue.bar(3), 2.4, 0.09)
    cue.mark(home + 0.07, 'C: the felt alone in the dark (Db lydian): his room first')
    cue.mark(cue.bar(2), 'C: the Water Line, warm (F F F G-sw F | C F over Dbmaj9(#11), Bbm9)')
    if V35:
        cue.section('S5 the hearts on his phone: the felt\'s first chord, the count', c.B('S5.03'), home)
        cue.section('S5 the dark room at 2 AM: the felt, the Water Line warm', home, c.B('S5.04'))
    else:
        cue.section('S5 the dark room at 2 AM: the felt, the Water Line warm', home, cue.bar(4) - Q)

    # ---------------------------------------------------------------- the count (a pulse, not a note per heart)
    if not V35:
        tick0 = cue.bar(4) - Q
        for k, p in enumerate(['Ab3', 'Eb3', 'Bb3', 'Db4', 'Eb3', 'Db3', 'Ab3', 'C4']):
            cue.n('felt_lh', p, tick0 + k * Q, Q * 0.9, 0.55 * (0.19, 0.17, 0.18, 0.16, 0.18, 0.17, 0.16, 0.15)[k])
        fch(['Db4', 'F4', 'Bb4'], cue.bar(4), 2.4, 0.1)             # (render 4: the V.O. window read -18.2 LUFS)
        fch(['C4', 'Eb4', 'F4'], cue.bar(5), max(2.3, c.B('S5.04') - cue.bar(5) + 0.3), 0.1,
            span_end=c.B('S5.04') + 0.02)                             # held to the Orb's look (no gap before it)
        cue.mark(tick0, "S5 the count: the felt ticks with the hearts (quarters, varied pitches)")
        cue.section('S5 the count (the felt\'s pulse under the V.O.)', tick0, c.B('S5.04'))

    # ---------------------------------------------------------------- the Orb's look: one held chord
    look_orb = c.B('S5.04') + 0.05
    fch(['C3', 'Ab3', 'Bb3', 'Eb4'], look_orb, 4.8, 0.17)
    mostly = c.Lon('a5-29-02')
    cue.n('felt', 'C4', c.Lend('a5-29-01') + 0.35, mostly - c.Lend('a5-29-01') + 1.2, 0.19)
    cue.mark(look_orb, 'S5 the Orb\'s look: Ab(add9)/C held (thin under "the badge was a joke." / "mostly.")')
    cue.section('S5 the Orb exchange: one held chord', c.B('S5.04'), c.B('S5.09'))

    # ---------------------------------------------------------------- Gerg's call: A-flat, the Build (chip + felt)
    ring = c.B('S5.09') + 0.1
    v21 = L.get('v34-vo-09') or L.get('v3-vo-21')    # v3.4: "gerg walked out for me." (v3.5: cut)
    if v21 is None:                                  # v3.5: no V.O. at the ring: the chord, then the Build
        v21 = dict(on=ring, end=ring + 0.9, words=[])
    fch(['Eb3', 'G3', 'C4', 'Bb4'], ring, max(2.4, v21['end'] - ring + 0.4), 0.15, span_end=v21['end'] + 0.3)
    if v21['end'] - ring > 2.6:                      # a long V.O. (the EL lock: 3.3 s): one soft inner move inside it
        ws = v21['words']
        gaps = [(b_ + 0.03, a2) for (_, _, b_), (_, a2, _) in zip(ws, ws[1:]) if a2 - b_ > 0.15]
        if gaps:
            tl = max(gaps, key=lambda g_: g_[1] - g_[0])[0]
            cue.ch('felt_lh', ['Ab3', 'C4', 'Eb4'], tl, v21['end'] - tl + 0.8, 0.11, roll=0.02)
    letter = c.B('S5.06')
    ps = passes(v21['end'] + 0.05, letter - 0.3, [4, 8, 12, 8, 12, 8, 4], 0.27)
    for tt, got in ps:
        cue.mark(tt, f'S5 the Build (chip + felt): compile pass ({got})')
    b0, b1 = cue.next_bar(ring + 1.0), cue.next_bar(letter - 0.2)
    harm = [['Db3', 'Ab3', 'C4', 'F4'], ['Ab3', 'C4', 'Db4', 'F4'], ['Eb3', 'G3', 'C4'], ['Db3', 'Ab3', 'C4', 'F4'],
            ['Ab3', 'C4', 'Db4', 'F4'], ['Eb3', 'Ab3', 'Db4', 'F4']]
    ch_ = []
    for i, bb in enumerate(range(b0, b1)):
        t = c.after_lines(cue.bar(bb), cue.bar(bb) + 1.5, pred=lambda l: l['who'] == 'mas' and not l['vo'])
        if t is None or c.in_vo(t, t + 0.3):
            continue
        ch_.append((t, i, bb))
    for k, (t, i, bb) in enumerate(ch_):
        d = BAR - (t - cue.bar(bb)) - 0.05
        nx = ch_[k + 1][0] if k + 1 < len(ch_) else None
        if nx is not None and nx - t > d + 0.3 and nx - t < 2 * BAR:    # (v3.4: a chord moved off Mas's line
            d = nx - t - 0.02                                              # left a 0.35 s hole: hold to the next)
        fch(harm[i % len(harm)], t, d, 0.18)
    cue.mark(ring, 'S5 Gerg rings: Abmaj9 (felt)')
    cue.section("S5 Gerg's call: the Build in A-flat major (chip + felt)", c.B('S5.09'), letter)

    # ---------------------------------------------------------------- the letter: the pedal + a walking pulse
    alyi_stop = c.txt('S5.06', 'ALYI') - 0.02
    did_both = c.Lon('a5-29-14')
    rebow(cue.a, 'vc', 'Db3', cue.s(letter + 0.2), cue.s(alyi_stop), 0.19, seg=5.0, xf=1.0, first_att=1.6,
          last_rel=0.25, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(letter + 0.4), cue.s(alyi_stop), 0.16, seg=5.0, xf=1.0, first_att=1.8,
          last_rel=0.25, art='sus', lp=1300)
    walk = ['Db3', 'Ab3', 'F3', 'Ab3', 'C3', 'Ab3', 'Eb3', 'Ab3', 'Db3', 'F3', 'Ab3', 'Gb3', 'Eb3', 'Ab3', 'C3', 'Eb3']
    bl = cue.next_bar(letter + 0.5)
    t, k = cue.bar(bl), 0
    while t < alyi_stop - 0.3:
        v = 0.3 * (1.0 if k % 4 == 0 else 0.86) * (1.0 + 0.1 * min(1.0, (t - letter) / (alyi_stop - letter)))
        cue.n('ubass', walk[k % len(walk)], t, Q * 0.9, v)
        t += Q
        k += 1
    cue.mark(cue.bar(bl), 'S5 the letter: the pedal and a soft walking pulse (only these under the quoted lines)')
    cue.mark(alyi_stop, 'S5 the scroll stops on ALYI: the music drops out (the chime, "alyi voted." in the room)',
             hit=False)
    rest = (alyi_stop, did_both)
    cue.mute(*rest)
    # back on "He did both.": the pedal bows in under it, and holds on his face
    rebow(cue.a, 'vc', 'Db3', cue.s(did_both), cue.s(c.snd('S5.08', 'SLOT') + 1.5), 0.15, seg=5.0, xf=1.0,
          first_att=1.4, last_rel=1.2, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(did_both + 0.15), cue.s(c.snd('S5.08', 'SLOT') + 1.5), 0.13, seg=5.0, xf=1.0,
          first_att=1.6, last_rel=1.2, art='sus', lp=1300)
    cue.mark(did_both, 'S5 "He did both.": the pedal comes back (no melody; the room breathes)', hit=False)
    cue.section('S5 the letter: the pedal and the pulse', letter, alyi_stop)
    cue.section('S5 the rest: ALYI -> "He did both."', alyi_stop, did_both)
    cue.section('S5 "He did both.": the pedal alone', did_both, c.B('S5.08'))

    # ---------------------------------------------------------------- the check: the felt returns softly
    chk = c.snd('S5.08', 'SLOT') + 0.3
    fch(['Ab3', 'Bb3', 'Eb4'], chk, 4.3, 0.15)
    stamp = c.snd('S5.08', 'rubber_stamp_C')
    fch(['Eb3', 'Ab3', 'Db4', 'F4'], stamp + 0.26, 1.6, 0.15)
    cue.mark(chk, 'S5 the check: the felt returns softly (Ab(add9))')
    cue.section('S5 the check: the felt returns', c.B('S5.08'), c.B('S5.09-back'))

    # ---------------------------------------------------------------- the Build returns; the look (the held note)
    back = c.B('S5.09-back')
    v23 = L.get('v3-vo-23')                            # (v3.2 cuts "gerg never waits to be asked.")
    what, again = L['a5-29-16'], L['a5-29-17']
    look = c.B('S5.09b')
    v22 = L.get('v3-vo-22')                            # (v3.1 cuts "he's typing like it's launch night.")
    if v22 and back <= v22['on'] < what['on']:
        fch(['Ab3', 'C4', 'Eb4'], back + 0.03, v22['end'] - back + 0.3, 0.16, span_end=v22['end'] + 0.1)
        t_ret = v22['end'] + 0.04
    else:
        fch(['Ab3', 'C4', 'Eb4'], back + 0.03, what['on'] - back + 0.8, 0.16, span_end=what['end'] + 0.05)
        t_ret = back + 0.02
    tt, k1 = build16(cue, t_ret, 4, 0.33, stop_at=what['on'] - 0.06, felt_every=4, felt_vel=0.15)
    cue.mark(tt, f'S5 the Build returns with his keys ({k1})')
    fch(['Eb3', 'G3', 'C4'], what['end'] + 0.07, 2.2, 0.19)
    tt, k2 = build16(cue, again['on'] - 0.01, 8, 0.33, stop_at=again['end'] + 0.3, felt_every=4, felt_vel=0.15)
    cue.mark(tt, f'S5 the Build: {k2} under "The company. Again. Just in case."')
    # the held note: a soft Ab3/Eb4 pad from the end of his line, through the look, into the door
    pad0 = again['end'] + 0.1
    rebow(cue.a, 'vc', 'Ab3', cue.s(pad0), cue.s(c.B('S5.11') + 5.9), 0.13, seg=5.0, xf=1.0,
          first_att=1.5, last_rel=0.8, art='sus', lp=1300)
    rebow(cue.a, 'vla', 'Eb4', cue.s(pad0 + 0.1), cue.s(c.B('S5.11') + 5.9), 0.12, seg=5.0, xf=1.0,
          first_att=1.5, last_rel=0.8, art='sus', lp=1500)
    tt, k3 = build16(cue, again['end'] + 0.25, 12, 0.34, stop_at=look, felt_every=4, felt_vel=0.15)
    cue.mark(tt, f'S5 the Build: a pass cut DEAD on his look up after {k3}')
    cue.mark(look, 'S5 HIS LOOK UP: the Build stops dead; the pad (Ab3/Eb4) holds (a ring-out)', hit=False)
    if v23:
        fch(['Db3', 'Ab3', 'C4', 'F4'], v23['on'] - 0.5, v23['end'] - v23['on'] + 0.9, 0.19)   # "gerg never waits..."
    cue.section('S5 the Build returns; the look (the held note)', back, c.B('S5.11'))

    # ---------------------------------------------------------------- the door: Tasya's floor; two Rhodes chords
    door = c.B('S5.11')
    welcome_end = c.Lend('a5-29-20')
    ev = L['a5-29-21']
    desk = c.W('a5-29-22', 'desk')
    leave = L['a5-29-23']
    f1, f2, f3 = welcome_end + 0.12, ev['end'] + 0.12, desk
    FLOOR = [(door + 0.02, f1 + 0.7, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9'),
             (f1, f2 + 0.7, {'vc': 'C3', 'vla': 'E4', 'vln2': 'G4', 'vln1': 'B4'}, 'Cmaj9'),
             (f2, f3 + 0.7, {'vc': 'E3', 'vla': 'E4', 'vln2': 'Ab4', 'vln1': 'B4'}, 'Emaj9'),
             (f3, leave['on'] - 0.25, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9')]
    # v3.2, the MACROSOFT badge under the door (S5.11): it slides in and ticks against his chair leg with the floor
    # holding (the offer, held open); when he sets it down beside the GUEST lanyard, square, and doesn't put it on,
    # the floor's third leaves (vln1's C5): the chord goes open, the offer considered with his hands (the felt's
    # chord after "leave it open." is the same one without its third)
    names_ = [x['name'] for x in c.SOUNDS if x['beat'] == 'S5.11']
    badge = c.snd('S5.11', 'folder_slide') if 'folder_slide' in names_ else None
    setdown = None
    if badge is not None:
        taps = [x['at'] for x in c.SOUNDS if x['beat'] == 'S5.11' and x['name'] == 'key_tap_space' and x['at'] > badge]
        setdown = taps[0] if taps else None
    for i, (t0, t1, voices, name) in enumerate(FLOOR):
        for inst, p in voices.items():
            if i == 0 and inst in ('vc', 'vla'):
                continue
            last = i == len(FLOOR) - 1
            t1_ = setdown if (last and inst == 'vln1' and setdown is not None and t0 < setdown < t1) else t1
            cue.n(inst, p, t0, t1_ - t0, 0.21 if inst in ('vc', 'vla') else 0.2, art='sus', att=0.9,
                  rel=1.1 if last else 0.6, lp=2600)
        cue.mark(t0, f"S5 Tasya's floor: {name} (silent attack)", hit=False)
    if setdown is not None:
        cue.mark(badge, 'S5 the MACROSOFT badge slides under the door: the floor holds (the offer, open)', hit=False)
        cue.mark(setdown, 'S5 he sets the badge down beside the lanyard, unworn: the floor\'s third (C5) leaves; the '
                          'chord goes open', hit=False)
    key = c.snd('S5.11', 'key_tap_space')
    tr1 = key + 0.2 if key + 0.7 < c.Lon('a5-29-20') else door + 0.03
    cue.ch('rhodes', ['G3', 'Bb3', 'C4', 'Eb4'], tr1, 2.0, 0.3, roll=0.008)
    cue.ch('rhodes', ['G3', 'Bb3', 'C4', 'Eb4'], desk, 2.2, 0.3, roll=0.008)
    cue.mark(tr1, "S5 the door: one soft Rhodes chord (Tasya's)")
    cue.mark(desk, 'S5 home: Abmaj9 on "desk" (the second Rhodes chord)')
    cue.section("S5 the door: Tasya's floor (Ab -> C -> E -> Ab), two Rhodes chords" +
                ('; the badge (the third leaves)' if setdown is not None else ''), door, c.B('S5.12'))

    # ---------------------------------------------------------------- "leave it open.": the chord back, no third
    tr = leave['end'] + 0.2
    fch(['Eb3', 'Ab3', 'Bb3'], tr, end - tr, 0.17, roll=0.02, span_end=end - 0.02)
    cue.n('felt', 'C4', tr, Q * 0.95, 0.17)
    cue.n('felt', 'F4', tr + Q, end - tr - Q, 0.19)
    cue.n('felt_mech', 60, tr, 0.1, 0.25)
    cue.mark(tr, 'S5 after "leave it open.": Ab6/9 with no third (Eb3 Ab3 Bb3), the settle C4 -> F4; it rings')
    cue.section('S5 "leave it open.": warm, open (no third), the ring-out to the first tile', c.B('S5.12'), end)

    lowest = min(n.pitch for n in cue.notes if n.inst != 'felt_mech')
    assert lowest >= nm('C3'), ('below C3 over the room drone', lowest)
    T['felt'].pedal = pedal_track(felt_ped)
    T['felt_lh'].pedal = T['felt'].pedal
    T['rhodes'].pedal = [(-1.0, False)]
    meta = dict(
        id=ID, title='2 AM (Ep1 v3 Act Four, S5, to picture)', mm='MM-10 a (the v3 sample C cue, re-spotted)',
        usage='BI', family="P01 DARK ROOM, warm (D-flat lydian / A-flat major) + the Build + Tasya's floor",
        tone="warm, loyal, funny: his felt in the dark, Gerg's keyboard, the landlord's chord, a door left open",
        scenes=[f'Ep1 v3 Act Four S5.02-S5.12, segment {home:.3f}-{end:.3f} s ({c.variant})'],
        motifs=['the Water Line, warm (felt; the chip on the nudge)', "Gerg's Build in A-flat major (chip + felt)",
                'the walking pulse under the letter', "Tasya's floor (Ab -> C -> E -> Ab) + two Rhodes chords"],
        motif_ids=['WATER_LINE'], key="D-flat lydian, A-flat major; the floor's mediants; Ab6/9 with no third",
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from the v3 sample C cue',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=cue.s(home), t1=cue.s(end), sfx='room_drone (the dark room)')],
        silence_windows=[(cue.s(rest[0]) + 0.05, cue.s(rest[1]) - 0.05, 'no score: ALYI -> "He did both."', -70.0)],
        vo_windows=[(cue.s(l['on']), cue.s(l['end']), l['text']) for l in (L.get('v3-vo-20'), v21, v22, v23)
                    if l and 'text' in l],
        sfx_slots=[dict(t=round(cue.s(c.snd('S5.03', f'key_tap_soft_0{k}')), 3), sfx=f'heart {k}') for k in range(1, 6)]
        + [dict(t=round(cue.s(c.snd('S5.09', 'RING')), 3), sfx='RING'),
           dict(t=round(cue.s(c.snd('S5.06', 'bell_ding_F6')), 3), sfx="the Orb's chime (F6), in the rest"),
           dict(t=round(cue.s(stamp), 3), sfx='rubber_stamp_C: VOID IF CEO MISSING')],
        audition=[f'{cue.s(home):.1f}-{cue.s(c.B("S5.04")):.1f} s: the Water Line warm and the felt\'s count: tender, '
                  'never the sad-piano cliche; the count a pulse, not a note per heart',
                  f'{cue.s(c.B("S5.09")):.1f}-{cue.s(letter):.1f} s: the Build warm under Gerg: his keyboard, not a melody',
                  f'{cue.s(letter):.1f}-{cue.s(alyi_stop):.1f} s: the walking pulse under the letter: a walk, never a heartbeat',
                  f'{cue.s(rest[0]):.1f}-{cue.s(rest[1]):.1f} s: out on ALYI, back on "He did both.": designed, not a hole?',
                  f'{cue.s(look):.1f} s: the Build cut dead on his look, the pad holding: a ring-out, not a glitch',
                  f'{cue.s(door):.1f}-{cue.s(end):.1f} s: the floor and two Rhodes chords; the open A-flat 6/9 after '
                  '"leave it open." ringing into the first tile'])
    # render 3: the opening read -18.1 LUFS in its first 1.7 s (the felt alone at the home shot, over the board's
    # held C) and Gerg's call p95 -16.7: fader rides, off the words
    if V35:                                          # (v3.5: the hearts come first: the opening at -2.5 dB to S5.04)
        tick0 = c.B('S5.04')
    macro = [(0.0, -2.5), (cue.s(tick0) - 0.4, -2.5), (cue.s(tick0), 0.0), (cue.s(ring) - 0.3, 0.0),
             (cue.s(ring), -1.0), (cue.s(letter) - 0.3, -1.0), (cue.s(letter), 0.0)]
    sc = Score(ID, cue.g, T, cue.notes, macro=macro, length_s=cue.s(end), tail_s=0.0,
               end_fade=(cue.s(end) - 0.35, cue.s(end) - 0.01), meta=meta, **cue.score_args())
    window = [(c.B('S5.03') - 0.02) if V35 else home, end, 0.0, 0.3]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.marks],
                 sections=[(lab, round(a_, 4), round(b_, 4)) for lab, a_, b_ in cue.sections],
                 silences=[(rest[0], rest[1], 'the scroll stops on ALYI -> "He did both." (no score: the chime, '
                                             '"Alyi signed it." and "alyi voted." play in the room)')],
                 rests=[list(rest)])
    return sc, cue.T0, window, extra
