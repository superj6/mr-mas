"""E01 v3 Act Four · S5 · 2 AM WITH GERG · warm but sparse · the home shot -> "leave it open." -> the first tile

REVISED (the showrunner on the v3 film, 2026-09-27: "i didn't mean for you to overkill and make it sound goofy level
hapy"; SHOWRUNNER-NOTES note 2's correction: variety is intensity and texture, not genre; the dark, modal home; a major
colour is fleeting, an added 9th with no third).  The v3 sample's C cue was D-flat lydian / A-flat major with the Build
in major passes and Tasya's major-ninth floor; this is its sparse, modal rewrite:
  * the felt and a quiet sul-tasto pad (F3/C4, then D-flat3/A-flat3 under the letter), in the F-minor home: the Water
    Line over Fm9 and B-flat minor; the count very soft; the Orb's look on the title's quartal stack over C;
  * Gerg's Build as a small soft figure: three short passes in F minor (the bible's own cell), a chord every other
    bar; it comes back small after "he's typing like it's launch night." and stops dead on his look up (the pad holds);
  * the letter: the pad only; out on the scroll's stop at ALYI, back on "He did both.";
  * Tasya's door: a quiet, slightly uneasy lift: the landlord's mediants (A-flat -> C -> E -> A-flat) with no thirds,
    one B-flat held through all four (the 9th, then the flat 7th, then the sharp 11th over E, then home), and two quiet
    Rhodes chords with no third (the door, "desk");
  * after "leave it open.": the settle C4 -> F4 over F(add9), no third, ringing out to the avalanche's first frame.
Nothing below C3 (the dark room's drone).  The grid: 96 BPM, swung, bar 4 on the first heart.
Nothing here was listened to.
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
from v3music import Cue, rebow, pedal_track, build16, BUILD_F, Q, S16, BAR   # noqa: E402

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
    T0 = heart1 - 3 * BAR                                  # grid bar 4 = the first heart
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
                tt, got = build16(cue, t, n, vel, felt_every=0 if k else 4, felt_inst='felt', felt_vel=0.12,
                                  cell=BUILD_F)
                out.append((tt, got))
                k += 1
                t = tt + max(2 * BAR / 2, got * S16 + 2 * Q)
            else:
                t += Q
        return out

    # ---------------------------------------------------------------- the home shot: the felt, a quiet pad
    fch(['F3', 'C4', 'G4'], home + 0.07, 3.0, 0.1, roll=0.03)               # F(add9), no third: his room first
    rebow(cue.a, 'vc', 'F3', cue.s(home + 0.3), cue.s(c.B('S5.04') + 0.3), 0.09, seg=5.0, xf=1.0, first_att=2.0,
          last_rel=1.0, art='sus', lp=1100)                                 # the quiet pad (sul tasto, over the drone)
    rebow(cue.a, 'vla', 'C4', cue.s(home + 0.6), cue.s(c.B('S5.04') + 0.3), 0.075, seg=5.0, xf=1.0, first_att=2.2,
          last_rel=1.0, art='sus', lp=1300)
    cue.line('felt', 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.', 2, vel=0.13, swing=True)
    place_motif(cue.a, 'lead', 'WATER_LINE', (2, 1), part='nudge_double', vel=0.08, swing=1.0, duty=0.5, att=0.004,
                dec=0.25, sus=0.35, rel=0.12)
    fch(['Eb3', 'G3', 'Ab3', 'C4'], cue.bar(2), 2.4, 0.1)                 # Fm9, rootless (the home)
    fch(['Db3', 'Bb3'], cue.bar(3), 2.4, 0.09)                            # Bbm over D-flat: the settle on F
    cue.mark(home + 0.07, 'C: the felt alone in the dark, F(add9) with no third; a quiet sul-tasto pad')
    cue.mark(cue.bar(2), 'C: the Water Line in its home (F F F G-sw F | C F over Fm9, Bbm/Db)')
    cue.section('S5 the dark room at 2 AM: the felt, the pad, the Water Line', home, cue.bar(4) - Q)

    # ---------------------------------------------------------------- the count (a pulse, not a note per heart)
    tick0 = cue.bar(4) - Q
    for k, p in enumerate(['Ab3', 'Eb3', 'Bb3', 'Db4', 'Eb3', 'Db3', 'Ab3', 'C4']):
        cue.n('felt_lh', p, tick0 + k * Q, Q * 0.9, 0.4 * (0.19, 0.17, 0.18, 0.16, 0.18, 0.17, 0.16, 0.15)[k])
    fch(['Db4', 'F4', 'Bb4'], cue.bar(4), 2.4, 0.07)                 # (render 6: the V.O. window read -19 LUFS)
    fch(['C4', 'Eb4', 'F4'], cue.bar(5), 2.3, 0.07)
    cue.mark(tick0, "S5 the count: the felt ticks with the hearts (quarters, varied pitches), very soft")
    cue.section("S5 the count (the felt's pulse under the V.O.)", tick0, c.B('S5.04'))

    # ---------------------------------------------------------------- the Orb's look: one held chord
    look_orb = c.B('S5.04') + 0.05
    fch(['C3', 'F3', 'Bb3', 'Eb4'], look_orb, 4.8, 0.15)                   # the title's quartal stack over C
    mostly = c.Lon('a5-29-02')
    cue.n('felt', 'C4', c.Lend('a5-29-01') + 0.35, mostly - c.Lend('a5-29-01') + 1.2, 0.17)
    cue.mark(look_orb, 'S5 the Orb\'s look: the quartal C-F-Bb-Eb held (thin under "the badge was a joke." / "mostly.")')
    cue.section('S5 the Orb exchange: one held chord', c.B('S5.04'), c.B('S5.09'))

    # ---------------------------------------------------------------- Gerg's call: the felt, the Build small and soft
    ring = c.B('S5.09') + 0.1
    v21 = L['v3-vo-21']
    fch(['Eb3', 'Ab3', 'Db4'], ring, max(2.4, v21['end'] - ring + 0.4), 0.13, span_end=v21['end'] + 0.3)
    if v21['end'] - ring > 2.6:                      # a long V.O. (the EL lock: 3.3 s): one soft inner move inside it
        ws = v21['words']
        gaps = [(b_ + 0.03, a2) for (_, _, b_), (_, a2, _) in zip(ws, ws[1:]) if a2 - b_ > 0.15]
        if gaps:
            tl = max(gaps, key=lambda g_: g_[1] - g_[0])[0]
            cue.ch('felt_lh', ['Ab3', 'Db4', 'Eb4'], tl, v21['end'] - tl + 0.8, 0.1, roll=0.02)
    letter = c.B('S5.06')
    # the quiet pad under the call (render 6: without it the call fell under -60 dBFS for 2 s between chords)
    rebow(cue.a, 'vc', 'Eb3', cue.s(ring + 0.2), cue.s(letter + 1.0), 0.09, seg=5.0, xf=1.0, first_att=1.5,
          last_rel=1.0, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Bb3', cue.s(ring + 0.5), cue.s(letter + 1.0), 0.075, seg=5.0, xf=1.0, first_att=1.8,
          last_rel=1.0, art='sus', lp=1300)
    ps = passes(v21['end'] + 0.05, letter - 0.3, [4, 8, 4], 0.2)[:3]        # three small passes, then it rests
    for tt, got in ps:
        cue.mark(tt, f'S5 the Build (small, soft, F minor): a pass of {got}')
    b0, b1 = cue.next_bar(ring + 1.0), cue.next_bar(letter - 0.2)
    harm = [['Eb3', 'G3', 'Ab3', 'C4'], ['Db3', 'Ab3', 'C4'], ['Db3', 'F3', 'Bb3'], ['C3', 'F3', 'Bb3', 'Eb4']]
    for i, bb in enumerate(range(b0, b1, 2)):                               # one chord every other bar (sparse)
        t = c.after_lines(cue.bar(bb), cue.bar(bb) + 1.5, pred=lambda l: l['who'] == 'mas' and not l['vo'])
        if t is None or c.in_vo(t, t + 0.3):
            continue
        fch(harm[i % len(harm)], t, 2 * BAR - (t - cue.bar(bb)) - 0.05, 0.13)
    cue.mark(ring, 'S5 Gerg rings: a quartal chord on the felt')
    cue.section("S5 Gerg's call: the felt, and the Build as a small soft figure", c.B('S5.09'), letter)

    # ---------------------------------------------------------------- the letter: the pad only
    alyi_stop = c.txt('S5.06', 'ALYI') - 0.02
    did_both = c.Lon('a5-29-14')
    rebow(cue.a, 'vc', 'Db3', cue.s(letter + 0.2), cue.s(alyi_stop), 0.17, seg=5.0, xf=1.0, first_att=1.6,
          last_rel=0.25, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(letter + 0.4), cue.s(alyi_stop), 0.14, seg=5.0, xf=1.0, first_att=1.8,
          last_rel=0.25, art='sus', lp=1300)
    cue.mark(letter + 0.2, 'S5 the letter: the pad only (the record plays dry)', hit=False)
    cue.mark(alyi_stop, 'S5 the scroll stops on ALYI: the music drops out (the chime, "alyi voted." in the room)',
             hit=False)
    rest = (alyi_stop, did_both)
    cue.mute(*rest)
    rebow(cue.a, 'vc', 'Db3', cue.s(did_both), cue.s(c.snd('S5.08', 'SLOT') + 1.5), 0.14, seg=5.0, xf=1.0,
          first_att=1.4, last_rel=1.2, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(did_both + 0.15), cue.s(c.snd('S5.08', 'SLOT') + 1.5), 0.12, seg=5.0, xf=1.0,
          first_att=1.6, last_rel=1.2, art='sus', lp=1300)
    cue.mark(did_both, 'S5 "He did both.": the pad comes back (no melody; the room breathes)', hit=False)
    cue.section('S5 the letter: the pad only', letter, alyi_stop)
    cue.section('S5 the rest: ALYI -> "He did both."', alyi_stop, did_both)
    cue.section('S5 "He did both.": the pad alone', did_both, c.B('S5.08'))

    # ---------------------------------------------------------------- the check: the felt returns softly
    chk = c.snd('S5.08', 'SLOT') + 0.3
    fch(['Ab3', 'Bb3', 'Eb4'], chk, 4.3, 0.13)
    stamp = c.snd('S5.08', 'rubber_stamp_C')
    fch(['Eb3', 'Ab3', 'Db4', 'F4'], stamp + 0.26, 1.6, 0.13)
    cue.mark(chk, 'S5 the check: the felt returns softly (Ab sus2, no third)')
    cue.section('S5 the check: the felt returns', c.B('S5.08'), c.B('S5.09-back'))

    # ---------------------------------------------------------------- the Build returns, small; it stops on his look
    back = c.B('S5.09-back')
    v22, v23 = L['v3-vo-22'], L['v3-vo-23']
    what, again = L['a5-29-16'], L['a5-29-17']
    look = c.B('S5.09b')
    fch(['Ab3', 'Db4', 'Eb4'], back + 0.03, v22['end'] - back + 0.3, 0.13, span_end=v22['end'] + 0.1)
    tt, k1 = build16(cue, v22['end'] + 0.04, 4, 0.22, stop_at=what['on'] - 0.06, felt_every=4, felt_vel=0.12,
                     cell=BUILD_F)
    cue.mark(tt, f'S5 the Build returns, small ({k1}), after "he\'s typing like it\'s launch night."')
    fch(['Eb3', 'Bb3', 'F4'], what['end'] + 0.07, 2.2, 0.14)
    tt, k2 = build16(cue, again['on'] - 0.01, 4, 0.22, stop_at=v23['on'] - 0.08, felt_every=4, felt_vel=0.12,
                     cell=BUILD_F)
    cue.mark(tt, f'S5 the Build: {k2} under "The company. Again. Just in case."')
    fch(['Db3', 'Ab3', 'C4', 'Eb4'], v23['on'] - 0.5, 3.3, 0.15)            # D-flat(add9), no third: fleeting
    rebow(cue.a, 'vc', 'Ab3', cue.s(v23['on'] - 0.6), cue.s(c.B('S5.11') + 5.9), 0.12, seg=5.0, xf=1.0,
          first_att=1.5, last_rel=0.8, art='sus', lp=1300)
    rebow(cue.a, 'vla', 'Eb4', cue.s(v23['on'] - 0.5), cue.s(c.B('S5.11') + 5.9), 0.11, seg=5.0, xf=1.0,
          first_att=1.5, last_rel=0.8, art='sus', lp=1500)
    tt, k3 = build16(cue, v23['end'] + 0.08, 8, 0.22, stop_at=look, felt_every=4, felt_vel=0.12, cell=BUILD_F)
    cue.mark(tt, f'S5 the Build: a pass cut DEAD on his look up after {k3}')
    cue.mark(look, 'S5 HIS LOOK UP: the Build stops dead; the pad (Ab3/Eb4) holds (a ring-out)', hit=False)
    cue.section('S5 the Build returns, small; the V.O.; the look (the held note)', back, c.B('S5.11'))

    # ---------------------------------------------------------------- the door: a quiet, slightly uneasy lift
    door = c.B('S5.11')
    welcome_end = c.Lend('a5-29-20')
    ev = L['a5-29-21']
    desk = c.W('a5-29-22', 'desk')
    leave = L['a5-29-23']
    f1, f2, f3 = welcome_end + 0.12, ev['end'] + 0.12, desk
    # the landlord's mediants (A-flat -> C -> E -> A-flat) with no thirds; one B-flat held through all four is the
    # unease: the 9th over A-flat, the flat 7th over C, the sharp 11th (a tritone) over E, the 9th again at home
    FLOOR = [(door + 0.02, f1 + 0.7, {}, 'Ab(add9)'),
             (f1, f2 + 0.7, {'vc': 'C3', 'vla': 'G3', 'vln1': 'D5'}, 'C(add9)(b7)'),
             (f2, f3 + 0.7, {'vc': 'E3', 'vla': 'B3', 'vln1': 'F#5'}, 'E(add9)(#11)'),
             (f3, leave['on'] - 0.25, {'vc': 'Ab3', 'vla': 'Eb4'}, 'Ab(add9)')]
    cue.n('vln2', 'Bb4', door + 0.3, leave['on'] - 0.25 - door - 0.3, 0.14, art='sus', att=1.2, rel=1.1, lp=2400)
    for i, (t0, t1, voices, name) in enumerate(FLOOR):
        for inst, p in voices.items():
            last = i == len(FLOOR) - 1
            cue.n(inst, p, t0, t1 - t0, 0.17 if inst in ('vc', 'vla') else 0.12, art='sus', att=0.9,
                  rel=1.1 if last else 0.6, lp=2400)
        cue.mark(t0, f"S5 Tasya's lift: {name} (silent attack; the held B-flat)", hit=False)
    key = c.snd('S5.11', 'key_tap_space')
    tr1 = key + 0.2 if key + 0.7 < c.Lon('a5-29-20') else door + 0.03
    cue.ch('rhodes', ['Eb4', 'Ab4', 'Bb4'], tr1, 2.0, 0.2, roll=0.008)
    cue.ch('rhodes', ['Eb4', 'Ab4', 'Bb4'], desk, 2.2, 0.2, roll=0.008)
    cue.mark(tr1, "S5 the door: one quiet Rhodes chord (Tasya's, no third)")
    cue.mark(desk, 'S5 "desk": the second, home on A-flat (no third)')
    cue.section("S5 the door: a quiet, uneasy lift (Ab -> C -> E -> Ab, no thirds, the held Bb)", door, c.B('S5.12'))

    # ---------------------------------------------------------------- "leave it open.": home, the settle on F
    tr = leave['end'] + 0.2
    fch(['F3', 'C4', 'G4'], tr + Q, end - tr - Q, 0.14, roll=0.02, span_end=end - 0.02)
    cue.n('felt', 'C4', tr, Q * 0.95, 0.15)
    cue.n('felt', 'F4', tr + Q, end - tr - Q, 0.17)
    cue.n('felt_mech', 60, tr, 0.1, 0.22)
    cue.mark(tr, 'S5 after "leave it open.": the settle C4 -> F4 over F(add9), no third; it rings')
    cue.section('S5 "leave it open.": home (F, no third), the ring-out to the first tile', c.B('S5.12'), end)

    lowest = min(n.pitch for n in cue.notes if n.inst != 'felt_mech')
    assert lowest >= nm('C3'), ('below C3 over the room drone', lowest)
    T['felt'].pedal = pedal_track(felt_ped)
    T['felt_lh'].pedal = T['felt'].pedal
    T['rhodes'].pedal = [(-1.0, False)]
    meta = dict(
        id=ID, title='2 AM (Ep1 v3 Act Four, S5, to picture)', mm='MM-10 a (the v3 sample C cue, re-spotted)',
        usage='BI', family="P01 DARK ROOM (the F-minor home; fleeting add9 colours, no thirds)",
        tone="warm but sparse: his felt and a quiet pad in the dark, Gerg's keyboard small and soft, a quiet uneasy "
             "lift for the landlord's door",
        scenes=[f'Ep1 v3 Act Four S5.02-S5.12, segment {home:.3f}-{end:.3f} s ({c.variant})'],
        motifs=['the Water Line (felt; the chip on the nudge)', "Gerg's Build, F minor, small (chip + felt)",
                "Tasya's lift (Ab -> C -> E -> Ab with no thirds; a held B-flat) + two quiet Rhodes chords"],
        motif_ids=['WATER_LINE'], key="F minor / modal; add9 colours with no third; the mediant lift; F(add9) at the end",
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from the v3 sample C cue',
        underscore_lufs=-21.0, album_lufs=-16.0,                      # sparse: a dB under the act's underscore
        room_sfx=[dict(t0=cue.s(home), t1=cue.s(end), sfx='room_drone (the dark room)')],
        silence_windows=[(cue.s(rest[0]) + 0.05, cue.s(rest[1]) - 0.05, 'no score: ALYI -> "He did both."', -70.0)],
        vo_windows=[(cue.s(l['on']), cue.s(l['end']), l['text']) for l in (L['v3-vo-20'], v21, v22, v23)],
        sfx_slots=[dict(t=round(cue.s(c.snd('S5.03', f'key_tap_soft_0{k}')), 3), sfx=f'heart {k}') for k in range(1, 6)]
        + [dict(t=round(cue.s(c.snd('S5.09', 'RING')), 3), sfx='RING'),
           dict(t=round(cue.s(c.snd('S5.06', 'bell_ding_F6')), 3), sfx="the Orb's chime (F6), in the rest"),
           dict(t=round(cue.s(stamp), 3), sfx='rubber_stamp_C: VOID IF CEO MISSING')],
        audition=[f'{cue.s(home):.1f}-{cue.s(c.B("S5.04")):.1f} s: the felt and the pad: warm, never happy; the count '
                  'a pulse, not a note per heart',
                  f'{cue.s(c.B("S5.09")):.1f}-{cue.s(letter):.1f} s: the Build small under Gerg: his keyboard, not a tune',
                  f'{cue.s(letter):.1f}-{cue.s(alyi_stop):.1f} s: the pad alone under the letter',
                  f'{cue.s(rest[0]):.1f}-{cue.s(rest[1]):.1f} s: out on ALYI, back on "He did both.": designed, not a hole?',
                  f'{cue.s(look):.1f} s: the Build cut dead on his look, the pad holding: a ring-out, not a glitch',
                  f'{cue.s(door):.1f}-{cue.s(end):.1f} s: the lift at the door: quiet and a little uneasy, never '
                  'sweet; the settle on F after "leave it open." ringing into the first tile'])
    # render 3: the opening read -18.1 LUFS in its first 1.7 s (the felt alone at the home shot, over the board's
    # held C) and Gerg's call p95 -16.7: fader rides, off the words
    macro = [(0.0, -1.5), (cue.s(tick0) - 0.4, -1.5), (cue.s(tick0), 0.0)]
    sc = Score(ID, cue.g, T, cue.notes, macro=macro, length_s=cue.s(end), tail_s=0.0,
               end_fade=(cue.s(end) - 0.35, cue.s(end) - 0.01), meta=meta, **cue.score_args())
    window = [home, end, 0.0, 0.3]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.marks],
                 sections=[(lab, round(a_, 4), round(b_, 4)) for lab, a_, b_ in cue.sections],
                 silences=[(rest[0], rest[1], 'the scroll stops on ALYI -> "He did both." (no score: the chime, '
                                             '"Alyi signed it." and "alyi voted." play in the room)')],
                 rests=[list(rest)])
    return sc, cue.T0, window, extra
