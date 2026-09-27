#!/usr/bin/env python3
"""Ep1 v3 · ACT ONE "research preview" (sc 5-12) · the music stem on the segment's own clock (0 = its first frame).

Brief (v3-score-a): "launch night: the sample's warm Build; the odometer: an exhilarating swing, then the heat;
Elgoog's code red: comic panic, pizzicato, the siren as a joke; the lobby deal: a charming caper swing, not dark
LEVERAGE; the duel: rivalry; the pause letter: one chill."  Mood map: v3-plan s6.  Launch night, the odometer and
the heat are the v3 sample's cue A (audio/reel/ep01-v3-sample/music/track.py, cue_a), re-fitted: every hard-coded
sample second there is a timeline reference here (beats, lines, sounds, gaps), so it follows this lock, and the
ElevenLabs-timed one with --el.

  s (Kokoro lock)  cue         what plays
  0 - 108.3        a_launch    LAUNCH NIGHT: the late-night trio in A-flat major (Rhodes, felt, brushes, upright);
                               GERG'S BUILD in A-flat on the chip, in compile passes placed in the gaps and under
                               Gerg's own lines (never in a V.O., one of Mas's lines, or on the heels of a line);
                               the felt under every V.O.; Db-minor(add9) shades "what if it wakes up?"; Eb13sus
                               hangs from "Your button." through the click; felt alone for Alyi and Mas (the Door's
                               head in the gaps, ending on its #4); the trio back for the chatbot, the Build + pizz
  108.3 - 131.8    a_launch    THE ODOMETER: SET-PIECE SWING in A-flat major on the cut frames (ride, walk, the chip
                               Build as lead, violins in octaves, brass accents): the lift, the odometer grows, the
                               CLUNK drops it a major third (E), C on the post (thin), the push into the MILLION on
                               the swung and-of-4 (the ratchet owns the downbeat), one band hit on the cut to Rima
  131.8 - 149.6    a_launch    THE HEAT, THE BILL: the held chord voice-leads into THE ACHE over F on the tile (the
                               palette steps spell F minor); the F/C pedal only under the bill; it lets go on the tear
  148.5 - 184.9    code_red    ELGOOG'S CODE RED, on his phone's small speaker (era.futz 'phone'): the siren's whine
                               J-cuts in under the last puff; comic panic in C minor (straight pizzicato 16ths, xylo,
                               timpani, bassoon), THE SIREN AS A JOKE (the whole orchestra wailing its two-tone
                               swoop as the tower rises), thin under every line; the phone's lock kills it dead
  185.3 - 206.5    lobby       THE LANDLORD'S DEAL: THE JOB swing (MM-05 family), charming, in F dorian: the bass
                               walks in under the revolving door; the check jams on the swung and-of-4; the head on
                               vibes + straight mute; Tasya's Rhodes on the beats; the felt under his V.O. in the
                               freeze; the band STOPS DEAD on the collar's pop (a downbeat)
  206.5 - 214.6    -           the room only ("That collar suits you." / "it does." / "and the rent?"): designed
  214.6 - 236.2    floor       THE TERMS: Tasya's floor (A-flat maj9 -> C -> E -> A-flat, silent attacks), moving
                               on her sentence breaks; the key ring's jangle ends it
  235.2 - 260.9    lobby2      WEEKS ON: the swing back on a new phrase from the jangle (her Rhodes on the beats, the
                               jangles on the swung ands), lighter; dry under her quote; it holds under the TV and
                               rings out before Gerg closes his laptop (his button, in the room)
  262.5 - 300.5    duel        THE DUEL (MM-04 Lighthouse, B-flat minor, straight): Gerg's Build (chip + woodclick,
                               left pane) against Mario's Addendum (quartet, right pane) over the Lighthouse's
                               marimba, one tempo, trading bars; the Addendum gains a bar each time; the quartet's
                               held chord under Mas's post; on the turn the chip plays Mario's tail (Gerg ships it)
  301.2 - 316.5    pause       THE PAUSE LETTER: MM-17 low (Nole's Launch stack, THE JOB colour: a low F-minor-blues
                               walk on C7alt that never resolves, a muted-horn stack that falls one note short);
                               nobody pauses, and neither does it; it rings out before the reflection
  316.5 - 320.5    -           no score on the reflection (the pen's scratch; designed)
  320.5 - 322.5    threat      THREAT, once, on the pen's lift (low brass + sub on F, F-C-Gb, no third); its tail
                               rings into the black

Levels (engine underscore masters, per cue): a_launch -20 (the swing +0.75 dB), code_red -22 after the phone,
lobby -20, floor -22, lobby2 -21, duel -20, pause -21, threat laid at -14 LUFS-M.  Dry of dialogue.

  OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render [cue ...] [--el]
  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --dry | --assemble [--el]
"""
from __future__ import annotations

import math
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import v3lib as V   # noqa: E402
from v3lib import palette, nm, Drums, swing_ride, art, futz   # noqa: E402

SEG = 'act1'
Q, BAR, S16 = V.Q, V.BAR, V.S16


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


# ================================================================== A · LAUNCH NIGHT -> THE ODOMETER -> THE HEAT
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
ACC4 = (1.0, 0.72, 0.84, 0.72)
CH = {  # chord -> (Rhodes, felt, bass root, bass fifth): the v3 sample's table.  No F-bass carries an A natural.
    'Abmaj9':    (['C4', 'Eb4', 'G4', 'Bb4'], ['Eb3', 'G3', 'C4'], 'Ab2', 'Eb2'),
    'Abmaj9/C':  (['Eb4', 'G4', 'Bb4', 'C5'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Dbmaj9#11': (['F3', 'Ab3', 'C4', 'Eb4'], ['Db3', 'Ab3', 'C4', 'F4'], 'Db3', 'Ab2'),
    'Dbm(add9)': (['E3', 'Ab3', 'Db4', 'Eb4'], ['Db3', 'Ab3', 'E4'], 'Db3', 'Ab2'),
    'Bbm9':      (['Ab3', 'C4', 'Db4', 'F4'], ['Db3', 'Ab3', 'C4'], 'Bb2', 'F2'),
    'Cm7':       (['Bb3', 'Eb4', 'G4'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Eb13sus4':  (['Db4', 'F4', 'Ab4', 'C5'], ['Eb3', 'Ab3', 'Db4', 'F4'], 'Eb2', 'Bb2'),
    'Ab69':      (['C4', 'Eb4', 'F4', 'Bb4'], ['Ab3', 'Eb4', 'F4'], 'Ab2', 'Eb3'),
    'E69':       (['Ab3', 'Db4', 'Gb4', 'B4'], ['E3', 'B3', 'Gb4'], 'E2', 'B2'),
    'B13sus4':   (['A3', 'Db4', 'E4', 'Ab4'], ['B2', 'A3', 'E4'], 'B2', 'Gb2'),
    'C69':       (['E3', 'A3', 'D4', 'G4'], ['C3', 'G3', 'D4'], 'C3', 'G2'),
}
LOOP_A1 = ['Abmaj9', 'Dbmaj9#11', 'Bbm9', 'Eb13sus4', 'Abmaj9', 'Dbmaj9#11', 'Cm7', 'Eb13sus4',
           'Abmaj9', 'Dbmaj9#11', 'Bbm9', 'Eb13sus4', 'Abmaj9/C', 'Dbmaj9#11', 'Bbm9', 'Eb13sus4']
LOOP_A3 = ['Dbmaj9#11', 'Cm7', 'Bbm9', 'Eb13sus4']


def cell(shift=0):
    """GERG'S BUILD (OST-BIBLE s2.6) in A-flat major: degrees 1 1 2 3 5 3 2 1 | 1 1 2 3 5 7 5 3 (the sample's)"""
    return [nm(p) + shift for p in BUILD_AB]


def tracks_a():
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -14.0
    T['rhodes'].gain_db, T['rhodes'].sends = -7.0, {'room': -12, 'plate': -14}
    T['lead'].gain_db, T['lead'].sends = -6.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    for k in ('ubass', 'cb_pizz'):
        T[k].eq = list(T[k].eq) + [V.PIZZ_NOTCH]
    T['ubass'].gain_db = -1.0
    T['cb_pizz'].gain_db = -7.0
    T['swish'].gain_db, T['swish'].eq = 2.0, [('lp', 6500)]
    T['brush'].gain_db = 8.0
    T['jazz'].gain_db = 3.0
    for k in ('vln1', 'vln2'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -2.0, {'hall': -10, 'room': -16}
    for k in ('tpt', 'tbn'):
        T[k].gain_db = -9.0
    T['glasspad'].gain_db = -12.0
    T['xylo'].gain_db = -14.0
    # the heat's F2 cello pedal on its own track, notched at the cello's ~111 Hz body resonance (an A2 that the
    # engine's F-major check traced to the strings on the first render: nothing written, a resonance)
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]            # (the Ab2 of the turn rings it too: render 2)
    dup(T, 'vc', 'vc_f')
    return T


def place_passes(c, t0, t1, vel=0.29, allow=('gerg',), spacing=4.2, first=None):
    """the Build's compile passes (4 / 8 / 12 / 16 straight 16ths) in the gaps of [t0, t1): never inside a V.O.
    or anyone's line but Gerg's, never on the heels of a line; about one per `spacing` seconds"""
    tl = c.tl
    out, last = [], -1e9
    for g0, g1 in tl.gaps(t0, t1, min_len=0.75, pad_before=0.1, pad_after=0.5, allow_who=allow):
        t = c.next16(g0)
        while t < g1 - 0.7:
            if t - last < spacing:
                t = c.next16(last + spacing)
                continue
            room = g1 - t - 0.05
            cnt = max([k for k in (16, 12, 8, 4) if k * S16 <= room] or [0])
            if cnt == 0:
                break
            if tl.talking(t, t + cnt * S16, pad=0.02, kinds={'vo', 'mas', 'real'}):
                t += Q
                continue
            out.append((t, cnt, vel))
            last = t
            t = c.next16(t + max(spacing, cnt * S16 + 0.5))
    return out


def cue_a(tl):
    GROWS = tl.B('6.01')
    clunk = tl.snd('6.02', 'letter_clunk', default=tl.B('6.02'))
    # the grid is anchored on the CLUNK (the set-piece's hero sound) as bar 48: on the Kokoro lock the odometer's
    # beats are whole bars (6.01 = bar 46, 6.04 = 50, 6.06 = 52); on a lock where 6.01 is a frame or two short
    # (the ElevenLabs one: 4.875 s) the clunk, the post and the million stay on their bars
    # (bar numbers count from a bar 1 just before the act's first frame, so a longer launch night gets more bars)
    n_pre = math.ceil((clunk + 1.0) / BAR)
    c = V.Cue('a_launch', tl, anchor=clunk, anchor_bar=n_pre + 1, bars=n_pre + 20, swing=1.0)
    T = tracks_a()
    bar, bt, sw = c.bar, c.bt, c.sw
    rb = lambda t: int(round(c.bar_of(t)))                                 # noqa: E731
    b_click = rb(tl.B('5.08'))
    b_two = b_click + 1
    b_chat = rb(tl.B('5.10'))
    b_lift = rb(tl.B('5.12'))
    b_grow = rb(clunk) - 2
    b_clunk = rb(clunk)
    b_post = rb(tl.B('6.04'))
    b_mill = rb(tl.B('6.06'))
    hit = tl.B('6.08')
    heat = tl.B('6.09')
    tear = tl.B('7.02')
    notes_off = []
    for lab, t, b in (('the odometer grows (6.01)', GROWS, b_grow), ('post', tl.B('6.04'), b_post),
                      ('million', tl.B('6.06'), b_mill)):
        if abs(bar(b) - t) > 0.06:
            notes_off.append(f'{lab} at {t:.3f} is {t - bar(b):+.3f} s off its bar')

    def fch(ps, t, d, v, roll=0.014, span_end=None):
        return c.pch('felt', ps, t, d, v, roll=roll, span_end=span_end)

    def build16(t0, count, vel, shift=0, idx0=0, stop_at=None, felt_double=True, pizz=False, duty=0.5):
        ps = cell(shift)
        if duty == 0.25:
            vel *= 1.2
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.01:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.005)
            j = (idx0 + i) % 16
            c.n('lead', ps[j], t, d, vel * ACC4[i % 4], True, duty=duty, att=0.002, dec=0.09, sus=0.45, rel=0.035)
            if felt_double and i == 0:
                c.n('felt', ps[j] - 12, t, 0.5, 0.2)
            if pizz and i % 4 == 0:
                c.n('vln1', ps[j], t, 0.2, 0.3, art='pizz')

    def vo_bar(b):
        t0, t1 = bar(b), bar(b) + BAR
        return sum(max(0.0, min(t1, l['end']) - max(t0, l['on'])) for l in tl.lines_in(t0, t1, kinds={'vo'})) > 0.8

    def mas_room(t0, t1=None, pad=0.08):
        return tl.talking(t0, t1, pad, kinds={'mas'})

    def clear_of_mas(t, latest, vo=True):
        hit_ = tl.lines_in(t, t + 1e-3, 0.08, kinds={'mas'}) + (tl.lines_in(t, t + 1e-3, 0.05, kinds={'vo'})
                                                                  if vo else [])
        if not hit_:
            return t
        t2 = max(l['end'] for l in hit_) + 0.06
        return t2 if t2 < latest else None

    def harm_a1(b):
        name = LOOP_A1[(b - 2) % len(LOOP_A1)]
        wake = [l for l in tl.lines_in(tl.B('5.05'), tl.E('5.05')) if l['who'] == 'alyi']
        if wake and rb(wake[0]['end']) - 1 <= b <= rb(wake[0]['end']) - 1 and bar(b) <= wake[0]['end'] <= bar(b) + BAR:
            return 'Dbm(add9)'
        if b >= b_click - 1:
            return 'Eb13sus4'
        return name

    def trio(b0, b1, harm):
        for b in range(b0, b1):
            name = harm(b)
            rh, fe, root, fifth = CH[name]
            t = bar(b)
            vo = vo_bar(b)
            if vo:
                fch(fe, max(0.02, t), 2.4, 0.16)
            else:
                tt = clear_of_mas(max(0.02, t), t + Q * 2)
                if tt is not None:
                    c.ch('rhodes', rh, tt, 2.25 - (tt - t), 0.27 if tl.talking(tt, tt + 1.0) else 0.31, roll=0.008)
            tb = clear_of_mas(max(0.02, t), t + Q, vo=False)
            if tb is not None:
                c.n('ubass', root, tb, (Q * 3.8 if vo else Q * 1.85) - (tb - t), 0.44)
            if not vo:
                t3 = bt(b, 3)
                if not mas_room(t3):
                    c.n('ubass', fifth, t3, Q * 1.85, 0.38)
            taps = ''.join('o' if (k in (2, 6) and not vo and not mas_room(bt(b, 1 + k / 2))
                                   and not tl.talking(bt(b, 1 + k / 2), pad=0.05, kinds={'vo'})) else '.'
                           for k in range(8))
            Drums(c.a, 'brushes').play(f'sweep: ~~~~~~~~\ntap: {taps}', bars=(b, b + 1), vel=0.5)

    # ---- A1: the trio from the first frame (the Rhodes blooms on the button), the Build in compile passes
    c.ch('rhodes', CH['Abmaj9'][0], 0.02, 1.9, 0.22, roll=0.03)
    c.mark(0.02, 'A1: the Rhodes blooms (A-flat maj9) on the button', hit=False)
    trio(2, b_click, harm_a1)
    vo1 = tl.lines_in(0.0, tl.E('5.02'), kinds={'vo'})
    first_end = (vo1[0]['on'] - 0.2) if vo1 else 4.0
    passes = []
    t_a = c.next16(0.55)
    if t_a + 12 * S16 < first_end:                       # the button's program: 4, then 8
        passes += [(t_a, 4, 0.30), (c.next16(t_a + 4 * S16 + 0.5), 8, 0.32)]
    passes += place_passes(c, first_end + 0.5, bar(b_click) - 0.05)
    if bar(b_click) - 16 * S16 - 0.05 > (passes[-1][0] + 2.0 if passes else 0) and \
            not tl.talking(bar(b_click) - 16 * S16, bar(b_click), kinds={'vo', 'mas', 'real'}):
        passes.append((bar(b_click) - 16 * S16, 16, 0.3))     # a 16-note pass ends on the click's bar
    for t0, cnt, v in passes:
        build16(t0, cnt, v)
        c.mark(t0, f'the Build: compile pass ({cnt})')
    c.section('A1 launch night: the trio + the Build in A-flat major', 0.0, bar(b_click))
    # ---- the click: Eb13sus held, nothing moves
    c.ch('rhodes', CH['Eb13sus4'][0], bar(b_click), 2.45, 0.21, roll=0.006)
    fch(CH['Eb13sus4'][1], bar(b_click), 2.45, 0.14, roll=0.01)
    c.n('ubass', 'Eb2', bar(b_click), 2.2, 0.28)
    c.mark(bar(b_click), 'the click: Eb13sus held (the dominant hangs; nothing happens)')
    c.section('the click: one held chord', bar(b_click), bar(b_two))
    # ---- A2: felt only; Alyi and Mas; the Door's head in the gaps (Ab -> Db | C -> G: it ends on the #4)
    t = bar(b_two)
    ls = [l for l in tl.lines_in(tl.B('5.09'), tl.E('5.09')) if l['kind'] != 'vo']
    alyi = [l for l in ls if l['who'] == 'alyi']
    mas = [l for l in ls if l['who'] == 'mas']
    if len(alyi) >= 2 and len(mas) >= 2:
        a1l, m1, a2l, m2 = alyi[0], mas[0], alyi[1], mas[1]
        t5 = a2l['end'] + 0.12
        fch(['Db3', 'Ab3', 'C4', 'Eb4'], t, t5 - t, 0.17, roll=0.018, span_end=t5)
        c.ch('felt', ['Db3', 'Ab3'], bar(b_two + 1) + Q * 2, 3.0, 0.12, roll=0.02)
        d1 = a1l['end'] + 0.03
        d2 = min(m1['on'] - 0.3, d1 + 0.42)
        d3 = m1['end'] + 0.06
        d4 = min(a2l['on'] - 0.25, d3 + 0.34)
        for p, tt, dd, vv, lab in (('Ab4', d1, 0.5, 0.22, 'the Door: Ab4 (after his first line)'),
                                   ('Db5', d2, 1.4, 0.21, 'the Door: Db5'),
                                   ('C5', d3, 0.4, 0.19, 'the Door: C5 (after "you counted.")'),
                                   ('G4', d4, 1.6, 0.19, 'the Door: G4, the #4 held (it never cadences)')):
            c.n('felt', p, tt, dd, vv)
            c.mark(tt, lab)
        fch(['Db3', 'Ab3', 'C4', 'F4'], t5, m2['end'] + 0.1 - t5, 0.15, roll=0.016, span_end=m2['end'] + 0.1)
        fch(CH['Eb13sus4'][1], m2['end'] + 0.1, max(1.2, bar(b_chat) - m2['end'] - 0.05), 0.16, roll=0.014)
    else:
        fch(['Db3', 'Ab3', 'C4', 'Eb4'], t, bar(b_chat) - t, 0.16)
    c.mark(bar(b_two), 'A2: felt only, Dbmaj9(#11) (the deceptive IV after the click)')
    c.section('A2 the two-hander: felt only (the Door in the gaps)', bar(b_two), bar(b_chat))
    # ---- A3: the chatbot: the trio back; the Build lighter, doubled by violin pizz
    trio(b_chat, b_lift, lambda b: 'Eb13sus4' if b == b_lift - 1 else LOOP_A3[(b - b_chat) % 4])
    for t0, cnt, v in place_passes(c, bar(b_chat), bar(b_lift) - 0.2, vel=0.28, spacing=4.5):
        build16(t0, cnt, v, pizz=True)
        c.mark(t0, f'the Build (+ pizz): compile pass ({cnt})')
    c.section('A3 the chatbot flatters: the trio + the Build with pizz', bar(b_chat), bar(b_lift))

    # ---- A4: SET-PIECE SWING in A-flat major
    def walk(b, ps, vel=0.62, beats=(1, 2, 3, 4)):
        for k, p in zip(beats, ps):
            if p is None:
                continue
            t = bt(b, k)
            c.n('ubass', p, t, Q * 0.92, vel * (1.0 if k in (1, 3) else 0.93))
            c.n('cb_pizz', p, t, Q * 0.92, vel * 0.7)

    def comp_ch(name, t, d, v):
        c.ch('rhodes', CH[name][0], t, d, v, roll=0.006)

    def charleston(b, name, v=0.38, second=None):
        comp_ch(name, bt(b, 1), Q * 1.3, v)
        comp_ch(second or name, sw(b, 2.5), Q * 0.45, v * 0.86)

    swing_ride(c.a, (b_lift, b_mill + 1), vel=0.34, hat=True, feathered_kick=0.16)
    walk(b_lift, ['Eb2', 'F2', 'G2', 'A2'], 0.55)
    charleston(b_lift, 'Eb13sus4', 0.3)
    build16(bar(b_lift), 4, 0.36, felt_double=False, duty=0.25)
    build16(bt(b_lift, 3), 8, 0.4, idx0=4, felt_double=False, duty=0.25)
    for bb in (4.0, 4.5):
        c.n('jazz', 38, sw(b_lift, bb), 0.12, 0.28 if bb == 4.0 else 0.36)
    c.mark(bar(b_lift), 'A4 THE LIFT: the counter ticks (ride, walk, the Build 4 + 8)')
    VL = []
    # phrase 1: the odometer grows; Dbmaj9; the CLUNK drops it a major third; B13sus
    c.n('jazz', 36, bar(b_grow), 0.2, 0.42)
    walk(b_grow, ['Ab2', 'C3', 'Eb3', 'D3'])
    charleston(b_grow, 'Ab69', 0.34)
    build16(bar(b_grow), 4, 0.42, felt_double=False, duty=0.25)
    vo6 = tl.lines_in(bar(b_grow), bar(b_grow + 1), kinds={'vo'})
    if vo6:
        fch(['Eb3', 'Ab3', 'C4', 'F4'], vo6[0]['on'] - 0.3, 1.9, 0.16, roll=0.012)
    c.mark(bar(b_grow), 'phrase 1: the odometer grows (Ab6/9)')
    walk(b_grow + 1, ['Db3', 'C3', 'Ab2', 'F2'])
    charleston(b_grow + 1, 'Dbmaj9#11', 0.34)
    build16(bar(b_grow + 1), 12, 0.44, felt_double=False, duty=0.25)
    VL += [('Ab4', bt(b_grow + 1, 1), Q), ('Bb4', bt(b_grow + 1, 2), Q), ('C5', bt(b_grow + 1, 3), Q),
           ('Eb5', bt(b_grow + 1, 4), Q)]
    c.n('jazz', 36, clunk, 0.2, 0.55)
    walk(b_clunk, ['E2', 'Gb2', 'Ab2', 'A2'], 0.66)
    charleston(b_clunk, 'E69', 0.34)
    build16(bar(b_clunk), 16, 0.44, shift=-4, felt_double=False, duty=0.25)
    VL += [('B4', bt(b_clunk, 1), 2 * Q), ('Ab4', bt(b_clunk, 3), 2 * Q)]
    c.mark(clunk, 'THE CLUNK: through the desk, the harmony drops a major third (E6/9)')
    walk(b_clunk + 1, ['B2', 'Ab2', 'B2', 'Db3'])
    charleston(b_clunk + 1, 'E69', 0.33, second='E69')
    comp_ch('B13sus4', bt(b_clunk + 1, 3), Q * 1.6, 0.3)
    build16(bar(b_clunk + 1), 12, 0.42, shift=-4, felt_double=False, duty=0.25)
    VL += [('Gb4', bt(b_clunk + 1, 1), 2 * Q), ('Db5', bt(b_clunk + 1, 3), Q), ('B4', bt(b_clunk + 1, 4), Q)]
    # phrase 2: the post (C6/9, one brass hit, thin: bass and brushes), the build to the million, the MILLION
    post = bar(b_post)
    V.stab(c, 'tpt', ['E5', 'A4'], post, vel=0.62, length=0.2)
    V.stab(c, 'tbn', ['D4', 'G3'], post, vel=0.6, length=0.22)
    c.n('jazz', 36, post, 0.2, 0.45)
    walk(b_post, ['C3', 'G2'], 0.5, beats=(1, 3))
    comp_ch('C69', post, Q * 3.6, 0.27)
    VL += [('C5', bt(b_post, 1), 4 * Q)]
    c.mark(post, 'the post: C6/9, one brass hit, then thin (bass, ride, one chord)')
    walk(b_post + 1, ['C3', 'D3', 'Eb3', 'G2'])
    charleston(b_post + 1, 'C69', 0.33)
    comp_ch('Eb13sus4', bt(b_post + 1, 3), Q * 0.9, 0.3)
    build16(bar(b_post + 1), 12, 0.46, shift=-8, felt_double=False, duty=0.25)
    VL += [('D5', bt(b_post + 1, 1), 2 * Q), ('Eb5', bt(b_post + 1, 3), 1.6 * Q)]
    push = sw(b_mill - 1, 4.5)
    c.n('lead', 'Eb5', bt(b_mill - 1, 4), S16 * 1.6, 0.44, True, duty=0.25, att=0.002, dec=0.12, sus=0.3, rel=0.05)
    c.n('lead', 'Ab5', push, 0.55, 0.46, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
    V.stab(c, 'tpt', ['F5', 'C5'], push, vel=0.66, length=0.24)
    V.stab(c, 'tbn', ['Eb4', 'Bb3'], push, vel=0.62, length=0.26)
    c.n('jazz', 38, push, 0.12, 0.4)
    c.n('jazz', 36, push, 0.2, 0.42)
    c.n('ubass', 'Ab2', push, (bt(b_mill, 2) - push) * 0.95, 0.66)
    c.n('cb_pizz', 'Ab2', push, 0.5, 0.46)
    comp_ch('Ab69', push, Q * 1.4, 0.34)
    VL += [('Ab5', push, bt(b_mill, 3) - push)]
    c.mark(push, 'the push into the MILLION (swung and-of-4): brass + the tag "shipped" (Eb5 -> Ab5)')
    c.mark(bar(b_mill), 'THE MILLION: no attack on the downbeat (the odometer ratchet owns it)', hit=False)
    walk(b_mill, [None, 'C3', 'Eb3', 'D3'])
    comp_ch('Ab69', sw(b_mill, 2.5), Q * 0.5, 0.3)
    VL += [('G5', bt(b_mill, 3), Q), ('Eb5', bt(b_mill, 4), Q)]
    # one band hit on the cut to Rima, then a held Abmaj9 under the two short lines
    V.stab(c, 'tpt', ['F5', 'Bb4'], hit, vel=0.66, length=0.3)
    V.stab(c, 'tbn', ['Eb4', 'C4', 'Ab3'], hit, vel=0.62, length=0.32)
    c.n('jazz', 36, hit, 0.2, 0.5)
    c.n('jazz', 49, hit, 2.5, 0.26)
    c.n('ubass', 'Ab2', hit, 2.4, 0.6)
    c.n('cb_pizz', 'Ab2', hit, 1.0, 0.45)
    comp_ch('Ab69', hit, 3.2, 0.3)
    c.n('lead', 'Ab5', hit, 0.3, 0.36, True, duty=0.25, att=0.002, dec=0.15, sus=0.2, rel=0.08)
    c.mark(hit, 'the band hit on the cut to Rima; then the held chord (thin under "Low-key." / "Basement.")')
    V.clip_before(c, hit, insts={'jazz'}, rel=0.05)          # the ride stops on the hit (the crash rings)
    c.a.notes = [nt for nt in c.a.notes if not (nt.inst == 'jazz' and c.clk.x(nt.start) > hit + 0.01)]
    for p, t0, d in VL:
        c.n('vln1', p, t0, d * 0.98, 0.4, art='sus', att=0.06, rel=0.25)
        c.n('vln2', nm(p) - 12, t0, d * 0.98, 0.36, art='sus', att=0.06, rel=0.25)
    for nt in c.a.notes:                                     # thin under "someone noticed."
        tt = c.clk.x(nt.start)
        if vo6 and vo6[0]['on'] - 0.25 <= tt < vo6[0]['end'] and nt.inst in ('jazz', 'rhodes', 'ubass', 'cb_pizz'):
            nt.vel *= 0.7
    c.section('A4 the counter: SET-PIECE SWING in A-flat major (lift, phrase 1, phrase 2)', bar(b_lift), hit)
    # ---- A5: the held chord, THE TURN into the Ache, the heat, the bill; out on the tear
    c.rebow('vc', 'Ab2', hit + 0.05, heat + 0.25, 0.2, first_att=0.5, last_rel=0.7, art='sus', lp=1300)
    c.rebow('vla', 'C3', hit + 0.05, tear + 0.6, 0.17, first_att=0.5, last_rel=1.6, art='sus', lp=1500)
    ache_end = min(heat + 13.6, tear - 0.3)
    c.rebow('vln2', 'G4', hit + 0.05, ache_end, 0.16, first_att=0.5, last_rel=1.2, art='sus', lp=3000)
    c.n('vln1', 'Eb5', hit + 0.05, heat - hit + 0.1, 0.16, art='sus', att=0.5, rel=0.4, lp=3200)
    c.n('vln1', 'Db5', heat, ache_end - heat, 0.17, art='sus', att=0.55, rel=1.2, lp=3200)
    c.rebow('vc_f', 'F2', heat, tear + 0.6, 0.22, first_att=0.9, last_rel=1.6, art='sus', lp=1100)
    c.ch('glasspad', ['G4', 'Db5'], heat + 0.4, ache_end - heat - 0.4, 0.2, roll=0.0, rel=1.0)
    c.ch('glasspad', ['G4', 'Db5'], tear + 0.05, 3.0, 0.14, roll=0.0, rel=0.9)
    c.mark(heat, 'THE TURN: Abmaj9 -> the Ache over F (vc Ab2 -> F2, vln Eb5 -> Db5; C and G held)')
    c.mark(tear, 'the tear: the pedal lets go, the Ache rings once more; the siren takes over', hit=False)
    c.section('A5 the held chord, then THE TURN: the Ache, the F pedal (the heat, the bill)', hit, tear + 2.5)
    macro = [(bar(1), 0.0), (bar(b_lift) - 0.4, 0.0), (bar(b_lift) - 0.05, 0.75), (hit + 0.4, 0.75),
             (hit + 2.0, 0.0), (tear + 4.0, 0.0)]
    end = tear + 2.6
    meta = dict(
        id='a_launch', title='Launch Night / The Odometer / The Heat (Ep1 v3, Act One sc 5-7)', mm='(to picture)',
        usage='BI', family='P01 colours in A-flat major (the trio + the Build) -> P11 SET-PIECE SWING in major -> the Ache',
        tone='warm, giddy, late-night garage band; then exhilarating; then the first dark bar',
        scenes=['Ep1 v3 Act One sc 5-7'],
        motifs=["Gerg's Build in A-flat major (compile passes)", "Alyi's Door head on the felt (Ab Db | C G)",
                'the Build\'s tag "shipped" (Eb5 -> Ab5)', 'the Ache (G4 + Db5 over F)'],
        motif_ids=[], key='A-flat major / D-flat lydian; E and C (chromatic mediants) in the swing; F + the Ache',
        composer='v3-score-a (composer X), from the v3 sample\'s cue A, 2026-09-27',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(0.0), t1=c.clk(end), sfx='server_hum (the bullpen, up through the floor)')],
        sfx_slots=[dict(t=round(c.clk(clunk), 3), sfx='letter_clunk: through the desk (the hero sound)')]
        + [dict(t=round(c.clk(t), 3), sfx='odometer_ratchet: 1,000,000') for t in tl.snd_any('odometer_ratchet')]
        + [dict(t=round(c.clk(t), 3), sfx='dialog_ok_click: the launch button') for t in
           tl.snd_any('dialog_ok_click', tl.B('5.08'), tl.E('5.08'))],
        audition=['0-68 s: the trio and the Build under the talk: warm and awake, never busy; any Nintendo feel is a '
                  'fail', 'the two-hander (5.09): the felt alone and the Door in the gaps: tender, not sad-piano',
                  'the counter (5.12-6.06): the swing in major: exhilarating, not "upbeat corporate"',
                  'the turn (6.09): the Ache should land because everything before was warm'],
        clock_notes=notes_off)
    sc = c.finish(T, meta, length_end=end, macro=macro, end_fade=(tear + 1.2, end - 0.02))
    return c, sc


# ================================================================== CODE RED (on the phone: C minor, straight, comic panic)
def tracks_cr():
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[k].sends = {'room': -12, 'hall': -16}
    dup(T, 'vln1', 'siren1', gain_db=-3.0)
    dup(T, 'vln2', 'siren2', gain_db=-3.0)
    dup(T, 'vln2', 'pz2', gain_db=-2.0)
    dup(T, 'vla', 'pzv', gain_db=-2.0)
    dup(T, 'vc', 'pzc', gain_db=0.0)
    dup(T, 'hn', 'hn_s', gain_db=-4.0)
    T['xylo'].gain_db = -8.0
    T['woodclick'].gain_db = -10.0
    T['timp'].gain_db = -6.0
    T['bsn'].gain_db = -3.0
    T['tuba'].gain_db = -5.0
    T['snare'].gain_db = -10.0
    return T


def siren(c, inst, t0, dur, lo, vel, swoops=2, up=5.0, att=0.15):
    """THE SIREN AS A JOKE: one bowed note bending up and down (a two-tone swoop), `swoops` times"""
    per = dur / swoops
    bend = [(0.0, 0.0)]
    for k in range(swoops):
        bend += [(k * per + per * 0.45, up), (k * per + per * 0.95, 0.0)]
    c.n(inst, lo, t0, dur, vel, art='sus', att=att, rel=0.3, bend=bend)


def cue_code_red(tl):
    steam = tl.snd('7.02', 'steam_hiss', default=tl.B('7.02') + 0.45)
    t_in = steam + 1.05                                        # the last puff: the siren J-cuts in under it
    lock = tl.snd('8.06', 'dialog_ok_click--chip', default=tl.B('8.06') + 0.9)
    c = V.Cue('code_red', tl, anchor=tl.B('8.01'), anchor_bar=3, bars=20, swing=0.0)
    T = tracks_cr()
    tower = tl.B('8.02')
    radnus = tl.B('8.03')
    crypt = tl.B('8.04')
    lany = tl.B('8.05')
    # the whine alone (J-cut): high strings, one swoop, into the alert
    siren(c, 'siren1', t_in, tl.B('8.01') - t_in + 0.4, 'C5', 0.3, swoops=1, up=6.0, att=0.4)
    c.mark(t_in, 'the siren\'s whine J-cuts in under the last puff (on his phone)', hit=False)
    # the panic ostinato: straight pizz 16ths from the alert (C minor, varied pitches), pizz bass on 8ths
    fig = ['C5', 'Eb5', 'D5', 'C5', 'G4', 'Ab4', 'G4', 'F#4', 'G4', 'C5', 'Bb4', 'Ab4', 'G4', 'Eb4', 'F4', 'F#4']
    bass8 = ['C2', 'G2', 'C2', 'G2', 'Ab1', 'Eb2', 'G1', 'D2']
    t = c.next16(tl.B('8.01') + 0.05)
    i = 0
    while t < lock - 0.01:
        busy = tl.talking(t, t + 0.01, pad=0.1)
        big = tower <= t < radnus
        p = fig[i % 16]
        if i % 2 == 0 or big:
            c.n('pz2', p, t, 0.18, (0.36 if big else 0.3) * (0.6 if busy else 1.0) * (1.1 if i % 4 == 0 else 0.9),
                art='pizz')
        if i % 4 == 2 and not busy:
            c.n('pzv', nm(p) - 12, t, 0.18, 0.26, art='pizz')
        if i % 2 == 0:
            c.n('pzc', bass8[(i // 2) % 8], t, 0.22, 0.44 * (0.75 if busy else 1.0), art='pizz')
        if big and i % 4 == 0:
            c.n('xylo', nm(p) + 12, t, 0.2, 0.34)
            c.n('woodclick', 76, t, 0.05, 0.4)
        t += S16
        i += 1
    # the tower rises: timpani roll into it, then the whole orchestra wails the swoop (a joke the size of a tower)
    for k in range(10):
        c.n('timp', 'C2', tower - 0.62 + k * 0.0625, 0.08, 0.18 + 0.03 * k)
    c.n('timp', 'C2', tower, 1.2, 0.5)
    siren(c, 'siren1', tower, radnus - tower + 0.2, 'G4', 0.4, swoops=2, up=6.0)
    siren(c, 'siren2', tower, radnus - tower + 0.2, 'C4', 0.36, swoops=2, up=6.0)
    siren(c, 'hn_s', tower + 0.05, radnus - tower + 0.1, 'G3', 0.34, swoops=2, up=5.0)
    c.n('tuba', 'C2', tower, radnus - tower, 0.3, art='sus', att=0.1, rel=0.3)
    c.mark(tower, 'THE SIREN AS A JOKE: the tower rises; the orchestra wails the swoop')
    # Radnus, serene: the ostinato soft, a slow hi-lo siren far back (flute) under the talk
    t = radnus + 0.1
    k = 0
    while t < lany - 0.2:
        p = ('Ab5', 'D5')[k % 2]                           # a slow far-off two-tone (it turns, in the back)
        c.n('fl', p, t, 2 * Q * 0.97, 0.13, art='nv', rel=0.25)
        t += 2 * Q
        k += 1
    # the crypt: the founders climb out: a staccato tuba/bassoon ascent (a phrase, not one note per step)
    asc = ['C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2', 'B2', 'C3']
    for k, p in enumerate(asc):
        tt = crypt + 0.3 + k * Q / 2
        c.n('bsn', nm(p) + 12, tt, 0.18, 0.34)
        c.n('tuba', p, tt, 0.2, 0.3, art='stac')
    c.mark(crypt + 0.3, 'the crypt: a staccato ascent (tuba + bassoon)')
    # little panic interjections in the gaps of the exchange (xylo run, a pizz flurry)
    for g0, g1 in tl.gaps(crypt + 2.0, lany, min_len=0.9, pad_before=0.2, pad_after=0.25):
        tt = c.next16(g0)
        for j, p in enumerate(['G5', 'Ab5', 'Bb5', 'C6', 'D6', 'Eb6']):
            if tt + j * S16 >= g1:
                break
            c.n('xylo', p, tt + j * S16, 0.15, 0.3)
        c.mark(tt, 'a xylophone run in a gap')
    # the lanyards: the siren turns once more, then the phone locks: dead stop
    siren(c, 'siren1', lany + 0.1, 2.0, 'G4', 0.3, swoops=1, up=6.0)
    siren(c, 'hn_s', lany + 0.15, 1.9, 'G3', 0.26, swoops=1, up=5.0)
    c.n('snare', 38, lany + 0.1, 0.1, 0.3)
    V.clip_before(c, lock, rel=0.03)
    V.drop_window(c, lock, lock + 30)
    c.mark(lock, 'THE LOCK: the phone locks; its audio stops dead (3 ms)', hit=False)
    V.thin(c, {'talk': dict(drop={'xylo', 'woodclick', 'hn_s', 'siren2'}, soften={'siren1': 0.6, 'bsn': 0.7,
                                                                                    'tuba': 0.7, 'timp': 0.6}),
               'real': dict(drop={'xylo', 'woodclick', 'hn_s', 'siren1', 'siren2', 'pz2', 'pzv'}),
               'mas': dict(drop={'xylo', 'woodclick'})}, t0=tl.B('8.01'))
    c.section('the whine (J-cut under the last puff)', t_in, tl.B('8.01'))
    c.section('the alert: the panic ostinato (pizz 16ths)', tl.B('8.01'), tower)
    c.section('the tower rises: the siren as a joke, the whole orchestra', tower, radnus)
    c.section('Radnus, serene; the crypt; the founders (thin under every line)', radnus, lany)
    c.section('the lanyards; the lock: dead stop', lany, lock)
    meta = dict(
        id='code_red', title='Elgoog\'s Code Red (Ep1 v3, Act One sc 8; on his phone)', mm='(to picture)', usage='VI',
        family='comic panic (a v3 colour): P11 energy, pizzicato; diegetic through the phone', diegetic=True,
        tone='comic panic, the siren as a joke', scenes=['Ep1 v3 Act One sc 7.02-8.06'], motifs=[], motif_ids=[],
        key='C minor, straight; the siren a bowed swoop up a tritone', composer='v3-score-a (composer X), 2026-09-27',
        underscore_lufs=-20.0, album_lufs=-16.0,
        audition=['the whole cue through the phone speaker: comic panic, not a real alarm; the siren a joke '
                  '(never a slide whistle)', 'thin enough under the founders\' exchange',
                  'the lock (8.06): the phone\'s audio cut dead: a diegetic stop, not a glitch'])
    sc = c.finish(T, meta, length_end=lock + 0.02, mutes=[(lock, lock + 3.0)])
    return c, sc


# ================================================================== LOBBY (THE JOB swing, F dorian, charming)
LOB = {   # (Rhodes on the beats, walk scale, root)
    'Fm11':      (['Ab3', 'C4', 'Eb4', 'Bb4'], ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3'], 'F2'),
    'Bb13':      (['Ab3', 'D4', 'G4'], ['Bb1', 'C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2'], 'Bb1'),
    'Dbmaj9#11': (['F3', 'C4', 'Eb4', 'G4'], ['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3'], 'Db2'),
    'C7#9':      (['E3', 'Bb3', 'Eb4'], ['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2'], 'C2'),
    'C7#9b13':   (['E3', 'Bb3', 'Eb4', 'Ab4'], ['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2'], 'C2'),
    'Ebm9':      (['Gb3', 'Db4', 'F4'], ['Eb2', 'F2', 'Gb2', 'Ab2', 'Bb2', 'Db3'], 'Eb2'),
}
LOB_BARS = {2: 'Fm11', 3: 'Fm11', 4: 'Bb13', 5: 'Fm11', 6: 'Dbmaj9#11', 7: 'C7#9', 8: 'Fm11', 9: 'Bb13'}
HEAD = [(2, 'F4/8 Ab4/8 C5/8 Eb5/8 D5/4 Bb4/8 C5/8'), (3, 'Bb4/8 C5/8 Ab4/4 F4/4 r/4'),
        (4, 'Eb5/8 D5/8 C5/8 Ab4/8 Bb4/4 r/4')]      # bar 2's last 8th is the check's jam (the push's C5)
FILLS = ['Eb5/8 D5/8 C5/4', 'C5/8 Ab4/8 F4/4', 'G4/8 Ab4/8 C5/4']
FILLS1 = ['Eb5/8 C5/8', 'Ab4/8 C5/8', 'D5/8 Bb4/8']            # one-beat fills for the short gaps
TAG_LINE = 'C5/8 Eb5/8 G5/8 F5/8 Eb5/8 C5/8 Bb4/8 Ab4/8 G4/4'


def tracks_lob():
    T = palette()
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -9.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['rhodes'].gain_db, T['rhodes'].sends = -3.0, {'room': -12, 'plate': -12}
    T['vibes'].gain_db, T['vibes'].sends = -3.0, {'room': -12, 'hall': -14}
    T['tpt'].gain_db, T['tpt'].sends = -4.0, {'room': -10, 'hall': -14}
    T['tpt'].latency_ms = 12
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['tbn'].gain_db = -4.0
    T['bsax'].gain_db = -3.0
    T['brush'].gain_db = 9.0
    T['swish'].gain_db = 3.0
    T['jazz'].gain_db = 4.0
    T['lead'].gain_db, T['lead'].eq = -10.0, [('lp', 5200), ('hs', 2400, -5.0)]
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    return T


def walk_eighth_free(c, b, name, nxt, rng, t_min=-1e9, t_max=1e9, vel=0.6, quarters=True):
    """a walking line through one bar (quarters, swung two-feel under the head) approaching the next root"""
    scl = [nm(p) for p in LOB[name][1]]
    root = nm(LOB[name][2])
    seq = [root]
    idx = 0
    for _ in range(2):
        idx = max(0, min(len(scl) - 1, idx + int(rng.choice([1, 2, 1, -1]))))
        seq.append(scl[idx])
    tgt = nm(LOB[nxt][2])
    seq.append(tgt + 1 if seq[-1] > tgt else tgt - 1)
    for k, p in enumerate(seq):
        t = c.bt(b, 1 + k)
        if t_min <= t < t_max:
            c.n('ubass', p, t, Q * 0.9, vel * (1.0 if k in (0, 2) else 0.92))
            c.n('cb_pizz', p, t, Q * 0.7, vel * 0.6, rel=0.16)


def cue_lobby(tl):
    import numpy as _np
    pop = tl.snd('9.08', 'collar_pop_F5', default=tl.B('9.08'))
    c = V.Cue('lobby', tl, anchor=pop, anchor_bar=10, bars=12, swing=1.0)
    T = tracks_lob()
    rng = _np.random.default_rng(909)
    door = tl.snd('8.06', 'revolving_door', default=tl.B('9.01') - 1.0)
    jam = tl.snd('9.01', 'glass_strain_2', default=c.sw(2, 4.5))
    freeze = tl.B('9.04')
    # the pickup under the revolving door (bar 1, beats 3-4), then the walk
    for p, beat in (('C2', 3), ('Eb2', 4)):
        t = c.bt(1, beat)
        if t > door - 0.3:
            c.n('ubass', p, t, Q * 0.9, 0.5)
    c.n('ubass', 'E2', c.sw(1, 4.5), Q * 0.3, 0.45)
    c.mark(c.bt(1, 3), 'the bass walks in under the revolving door', hit=False)
    for b in range(2, 10):
        name = LOB_BARS[b]
        nxt = LOB_BARS.get(b + 1, 'Fm11')
        walk_eighth_free(c, b, name, nxt, rng, t_max=pop - 0.02, vel=0.58)
        rh = LOB[name][0] if b != 9 else LOB['Bb13'][0]
        for k in range(4):                                       # Tasya's Rhodes on the beats
            t = c.bt(b, 1 + k)
            nm_ = 'C7#9b13' if (b == 9 and k >= 2) else name
            if t < pop - 0.05:
                c.ch('rhodes', LOB[nm_][0], t, Q * 0.55, 0.26 if k % 2 == 0 else 0.22, roll=0.005)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.\nkick[vel=0.35]: o.......', bars=(b, b + 1),
                                   vel=0.55)
    # the check jams on the swung and-of-4: a push into bar 3 (vibes + a mute + the bari)
    V.stab(c, 'tbn', ['C3'], jam, vel=0.5, length=0.26)
    V.stab(c, 'bsax', ['F2'], jam, vel=0.5, length=0.26)
    c.n('vibes', 'C5', jam, 0.5, 0.4)
    c.n('tpt', 'C5', jam, 0.3, 0.36, art='straight', rel=0.1)
    c.mark(jam, 'the check jams: a push on the swung and-of-4')
    # the head (vibes + straight mute, unison; the chip on its top notes), bars 3-4, in the open
    for b, text in HEAD:
        t0 = c.bar(b)
        if not tl.talking(t0, t0 + BAR, kinds={'vo', 'real', 'mas'}) and not (freeze - 0.05 <= t0 < freeze + Q) \
                and not (t0 < freeze + Q <= t0 + BAR and tl.talking(freeze, freeze + 3.0, kinds={'vo'})):
            V.phrase(c, 'vibes', t0, text, 0.44, swing=1.0, rel=0.5)
            ns = V.phrase(c, 'tpt', t0, text, 0.4, swing=1.0, art='straight', rel=0.12)
            top = max(ns, key=lambda z: nm(z[1]))
            c.n('lead', nm(top[1]) + 12, top[0], 0.2, 0.2, True, duty=0.25, att=0.002, dec=0.1, sus=0.3, rel=0.05)
            c.mark(t0, f'THE JOB\'s head (bar {b})')
    # fills in the gaps of the partnership talk
    fi = 0
    for g0, g1 in tl.gaps(tl.B('9.06'), tl.B('9.07'), min_len=0.7, pad_before=0.12, pad_after=0.25):
        t = c.next8(g0)
        text = FILLS[fi % 3]
        if t + V.line_len(text) > g1:
            text = FILLS1[fi % 3]
        if t + V.line_len(text) <= g1 + 0.05:
            V.phrase(c, 'vibes', t, text, 0.4, swing=1.0, rel=0.5)
            c.mark(t, 'a vibes fill (a gap)')
            fi += 1
    # the check slides under the door: the head's tag, then the push, and the POP on the downbeat: dead stop
    t_tag = c.next_beat(max(tl.B('9.07'), max([l['end'] for l in tl.lines_in(tl.B('9.06'), tl.B('9.07'))] +
                                              [tl.B('9.07')]) + 0.2))
    V.phrase(c, 'vibes', t_tag, TAG_LINE, 0.46, swing=1.0, rel=0.5, stop_at=c.sw(9, 4.5) - 0.05)
    V.phrase(c, 'tpt', t_tag, TAG_LINE, 0.42, swing=1.0, art='straight', rel=0.12, stop_at=c.sw(9, 4.5) - 0.05)
    c.mark(t_tag, 'the check slides under the door: the head\'s tag')
    pushp = c.sw(9, 4.5)
    V.stab(c, 'tpt', ['E5', 'Bb4'], pushp, vel=0.52, length=0.14)
    V.stab(c, 'tbn', ['Eb4', 'Bb3'], pushp, vel=0.5, length=0.14)
    c.n('ubass', 'C2', pushp, 0.16, 0.6)
    c.n('rhodes', 'E3', pushp, 0.14, 0.3)
    c.mark(pushp, 'the last push (C7#9) on the swung and-of-4')
    V.clip_before(c, pop, rel=0.03)
    V.drop_window(c, pop, pop + 30)
    c.mark(pop, 'THE POP: the band stops dead on the downbeat (3 ms); the collar #3', hit=False)
    # the freeze: the band keeps moving (Mas does) but thins; the felt under the V.O.
    for l in tl.lines_in(freeze, tl.B('9.06'), kinds={'vo'}):
        c.pch('felt', ['Ab3', 'C4', 'Eb4'], l['on'] - 0.3, l['end'] - l['on'] + 0.6, 0.13, roll=0.02)
    V.drop_window(c, freeze, freeze + Q, insts={'rhodes', 'vibes', 'tpt', 'lead'})
    V.thin(c, {'vo': dict(drop={'vibes', 'tpt', 'lead', 'rhodes', 'bsax', 'tbn'}, soften={'ubass': 0.8}),
               'talk': dict(drop={'lead'}, soften={'vibes': 0.75, 'tpt': 0.7, 'rhodes': 0.85}),
               'mas': dict(drop={'vibes', 'tpt', 'lead'}, soften={'rhodes': 0.8}),
               'real': dict(drop={'vibes', 'tpt', 'lead', 'bsax', 'tbn'}, soften={'rhodes': 0.7})},
           t0=tl.B('9.01'), t1=pop)
    c.section('the pickup under the revolving door; the check jams', c.bt(1, 3), c.bar(3))
    c.section('THE JOB\'s head; the freeze (the felt under the V.O.)', c.bar(3), tl.B('9.06'))
    c.section('the partnership (thin under the talk; fills in the gaps)', tl.B('9.06'), t_tag)
    c.section('the check slides under the door; the push; the pop', t_tag, pop)
    meta = dict(
        id='lobby', title='The Landlord\'s Deal (Ep1 v3, Act One sc 9)', mm='MM-05 (family)', usage='BI',
        family='P06 THE JOB (Tasya\'s Rhodes colour)', tone='caper, charming: a swinging deal that stops on a pop',
        scenes=['Ep1 v3 Act One sc 9 (9.01-9.08)'], motifs=['THE JOB\'s head (F dorian)', 'Tasya\'s Rhodes on the beats'],
        motif_ids=[], key='F dorian; Bb13, Dbmaj9#11, C7#9; no A-natural',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-20.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(jam), 3), sfx='glass_strain_2: the check jams'),
                   dict(t=round(c.clk(freeze), 3), sfx='freeze_hit_F: Tasya\'s card'),
                   dict(t=round(c.clk(pop), 3), sfx='collar_pop_F5: the downbeat is the pop\'s')],
        silence_windows=[(c.clk(pop) + 0.005, c.clk(pop) + 0.5, 'the pop: the stop', -90.0)],
        audition=['a charming caper swing, not LEVERAGE; Tasya\'s Rhodes on the beats reads as hers',
                  'the stop on the pop: the collar lands in silence'])
    sc = c.finish(T, meta, length_end=pop + 0.02, mutes=[(pop, pop + 3.0)])
    return c, sc


# ================================================================== FLOOR (the terms: Tasya's floor)
def cue_floor(tl):
    terms = [l for l in tl.lines_in(tl.B('9.09'), tl.E('9.09')) if l['who'] == 'tasya' and l['end'] - l['on'] > 6.0]
    lt = terms[0] if terms else [l for l in tl.lines_in(tl.B('9.09'), tl.E('9.09')) if l['who'] == 'tasya'][-1]
    t_in = lt['on'] - 0.2
    jangle = tl.snd('9.09', 'key_ring_jangle_1', default=tl.E('9.09') - 1.0)
    c = V.Cue('floor', tl, anchor=t_in, anchor_bar=1, bars=12, swing=0.0)
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db, T[k].sends = -3.0, {'hall': -10, 'room': -16}
    T['rhodes'].gain_db, T['rhodes'].sends = -4.0, {'room': -12, 'plate': -12}
    brk = tl.sentence_breaks(lt['id'], n=4, min_gap=0.15)
    brk = [t for t in brk if t > t_in + 2.0][:3]
    while len(brk) < 3:
        brk.append((brk[-1] if brk else t_in) + 3.5)
    f1, f2, f3 = brk
    home_end = jangle + 1.05                        # it holds under the jangles into the swing's entry, then goes
    FLOOR = [(t_in, f1 + 0.7, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9'),
             (f1, f2 + 0.7, {'vc': 'C3', 'vla': 'E4', 'vln2': 'G4', 'vln1': 'B4'}, 'Cmaj9'),
             (f2, f3 + 0.7, {'vc': 'E3', 'vla': 'E4', 'vln2': 'Ab4', 'vln1': 'B4'}, 'Emaj9'),
             (f3, home_end, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9')]
    RH = {'Abmaj9': ['G3', 'Bb3', 'C4', 'Eb4'], 'Cmaj9': ['G3', 'B3', 'D4', 'E4'], 'Emaj9': ['Ab3', 'B3', 'Eb4', 'Gb4']}
    for i, (t0, t1, voices, name) in enumerate(FLOOR):
        for inst, p in voices.items():             # re-bowed (silent attacks): the library's sustains last 8-13 s
            c.rebow(inst, p, t0, t1, 0.21 if inst in ('vc', 'vla') else 0.2, seg=4.5, xf=1.0, first_att=0.9,
                    last_rel=1.3 if i == len(FLOOR) - 1 else 0.6, art='sus', lp=2600)
        if not tl.talking(t0, t0 + 0.3, pad=0.05, kinds={'mas'}):
            c.ch('rhodes', RH[name], t0 + 0.02, 1.4, 0.24, roll=0.008)
        c.mark(t0, f'Tasya\'s floor: {name} (silent attack; one Rhodes chord on her sentence break)', hit=False)
    c.mark(jangle, 'the key ring\'s jangle: the floor lets go', hit=False)
    c.section('THE TERMS: Tasya\'s floor (Ab -> C -> E -> Ab), on her sentence breaks', t_in, jangle)
    meta = dict(
        id='floor', title='The Terms: Tasya\'s floor (Ep1 v3, Act One sc 9.09)', mm='(to picture)', usage='BI',
        family='the landlord\'s colour (OST-BIBLE s2.16): held mediants, silent attacks', tone='a welcome that is a lease',
        scenes=['Ep1 v3 Act One 9.09'], motifs=['Tasya\'s floor (Abmaj9 -> Cmaj9 -> Emaj9 -> Abmaj9)'], motif_ids=[],
        key='A-flat major and its major-third mediants', composer='v3-score-a (composer X), 2026-09-27',
        underscore_lufs=-22.0, album_lufs=-16.0,
        audition=['the floor under her terms: warm and faintly ironic; the landlord owns the chord'])
    sc = c.finish(T, meta, length_end=home_end + 0.1, end_fade=(jangle + 0.15, home_end + 0.05))
    return c, sc


# ================================================================== LOBBY2 (weeks on: the swing back from the jangle)
def cue_lobby2(tl):
    import numpy as _np
    jangle = tl.snd('9.09', 'key_ring_jangle_1', default=tl.E('9.09') - 1.0)
    one = jangle - Q * 2.0 / 3.0                  # beat 1: the jangles fall on the swung ands
    c = V.Cue('lobby2', tl, anchor=one, anchor_bar=1, bars=14, swing=1.0)
    T = tracks_lob()
    rng = _np.random.default_rng(910)
    tv = tl.B('9.11')
    tele = tl.B('9.12')
    last = tl.B('9.13')
    close = tl.snd('9.13', 'folder_close', default=tl.E('9.13') - 1.2)
    bars = {1: 'Fm11', 2: 'Dbmaj9#11', 3: 'Fm11', 4: 'Bb13', 5: 'Ebm9', 6: 'Dbmaj9#11', 7: 'C7#9', 8: 'Fm11',
            9: 'Bb13', 10: 'Fm11', 11: 'Dbmaj9#11'}
    b = 1
    while c.bar(b) < last - 0.1:
        name = bars.get(b, 'Fm11')
        nxt = bars.get(b + 1, 'Fm11')
        t_lo = c.bt(1, 3) if b == 1 else -1e9
        walk_eighth_free(c, b, name, nxt, rng, t_min=t_lo, t_max=min(tv, last) if c.bar(b) < tv else last, vel=0.5)
        for k in range(4):
            t = c.bt(b, 1 + k)
            if t < c.bt(1, 3) or t >= last - 0.05 or (tv <= t < tele):
                continue
            c.ch('rhodes', LOB[name][0], t, Q * 0.55, 0.24 if k % 2 == 0 else 0.2, roll=0.005)
        if b >= 2 and not (tv <= c.bar(b) < tele) and c.bar(b) < last:
            Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.', bars=(b, b + 1), vel=0.45)
        b += 1
    # the TV (Radnus tap-dances on it): the band holds one chord and lets the TV have the rhythm
    c.ch('rhodes', LOB['Dbmaj9#11'][0], tv + 0.05, tele - tv, 0.2, roll=0.01)
    c.n('ubass', 'Db2', tv + 0.05, tele - tv, 0.4)
    c.mark(tv, 'the TV: the band holds a chord (the tap-dance is the TV\'s)', hit=False)
    # vibes fragments in the gaps (not on her quote)
    fi = 0
    for g0, g1 in tl.gaps(c.bar(2), tv - 0.2, min_len=1.35, pad_before=0.15, pad_after=0.3):
        t = c.next_beat(g0)
        text = FILLS[(fi + 1) % 3]
        if t + V.line_len(text) <= g1:
            V.phrase(c, 'vibes', t, text, 0.36, swing=1.0, rel=0.5)
            c.mark(t, 'a vibes fragment (a gap)')
            fi += 1
    # the last chord at the two-shot: held under "ours does that too.", gone before the laptop closes
    fin = c.next_beat(last)
    c.ch('rhodes', ['Ab3', 'C4', 'Eb4', 'G4'], fin, close - fin - 0.3, 0.2, roll=0.01)
    c.ch('vibes', ['C5', 'G5'], fin, close - fin - 0.2, 0.26, roll=0.02)
    c.n('ubass', 'F2', fin, close - fin - 0.4, 0.36)
    c.mark(fin, 'the last chord (Fm9, no motion), held under his line; out before the laptop closes', hit=False)
    V.thin(c, {'talk': dict(drop={'lead'}, soften={'vibes': 0.75, 'rhodes': 0.85}),
               'mas': dict(drop={'vibes', 'lead'}, soften={'rhodes': 0.8}),
               'real': dict(drop={'vibes', 'lead', 'tpt'}, soften={'rhodes': 0.6, 'brush': 0.6, 'swish': 0.7})},
           t0=c.bar(1), t1=last - 0.05)
    c.section('weeks on: the swing back on a new phrase from the jangle', c.bt(1, 3), tv)
    c.section('the TV and the telescope: one held chord, then the walk', tv, last)
    c.section('"ours does that too.": the last chord, out before the laptop closes', last, close)
    meta = dict(
        id='lobby2', title='Weeks On (Ep1 v3, Act One sc 9.10-9.13)', mm='MM-05 (family)', usage='BI',
        family='P06 THE JOB, light', tone='the deal is done; the landlord where he stood',
        scenes=['Ep1 v3 Act One 9.10-9.13'], motifs=['Tasya\'s Rhodes on the beats (the jangle on the ands)'],
        motif_ids=[], key='F dorian', composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0,
        album_lufs=-16.0,
        audition=['the swing back from the jangle: on a new phrase, the jangles on the swung ands',
                  'the last chord out before Gerg closes his laptop (his button is in the room)'])
    sc = c.finish(T, meta, length_end=close + 0.1, end_fade=(close - 0.9, close - 0.05))
    return c, sc


# ================================================================== DUEL (MM-04 Lighthouse: the Build vs the Addendum)
BUILD_BB = ['Bb4', 'Bb4', 'C5', 'Db5', 'F5', 'Db5', 'C5', 'Bb4', 'Bb4', 'Bb4', 'C5', 'Db5', 'F5', 'Ab5', 'F5', 'Db5']
ADD = 'Bb3/4 C4/4 Db4/4 F4/4 Eb4/4. Db4/8 C4/4 Bb3/4'
TAILS = ['C4/8 Db4/8', 'C4/8 Db4/8 Eb4/4', 'C4/8 Db4/8 Eb4/8 F4/8 Gb4/4', 'C4/8 Db4/8 Eb4/8 F4/8 Gb4/8 Ab4/8 Bb4/4']
DUEL_CH = {'Bbm9': ['Bb2', 'F3', 'Db4', 'C5'], 'Gbmaj7': ['Gb2', 'Db3', 'Bb3', 'F4'], 'Ebm9': ['Eb3', 'Gb3', 'Db4', 'F4'],
           'Fsus': ['F2', 'C3', 'Bb3', 'Eb4']}
DUEL_LOOP = ['Bbm9', 'Bbm9', 'Gbmaj7', 'Ebm9', 'Bbm9', 'Gbmaj7', 'Ebm9', 'Fsus']


def tracks_duel():
    T = palette()
    T['lead'].gain_db, T['lead'].sends = -4.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5500), ('hs', 2400, -4.0)]
    T['woodclick'].gain_db = -12.0
    T['xylo'].gain_db = -14.0
    T['marimba'].gain_db, T['marimba'].pan = -6.0, 0.35
    T['harp'].gain_db, T['harp'].pan = -8.0, 0.4
    T['svln'].gain_db, T['svln'].pan, T['svln'].sends = -1.0, 0.3, {'hall': -11, 'chamber': -12}
    for k, pan in (('vla', 0.35), ('vc', 0.4), ('cb', 0.45)):
        T[k].pan, T[k].sends, T[k].gain_db = pan, {'hall': -10, 'chamber': -13}, -2.0
    dup(T, 'vc', 'vc_pz', gain_db=-1.0, pan=0.0)
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    return T


def cue_duel(tl):
    a4 = tl.B('11.04')
    c = V.Cue('duel', tl, anchor=a4, anchor_bar=8, bars=20, swing=0.0)
    T = tracks_duel()
    cut = tl.B('11.01')
    split = tl.B('11.03')
    post_b = tl.B('11.05')
    turn = tl.B('11.06')
    end = tl.B('12.01')
    shutter = tl.snd('11.06', 'camera_shutter', default=turn + 2.6)
    b_end = int(round(c.bar_of(end)))

    def chord(b):
        return DUEL_LOOP[(b - 1) % len(DUEL_LOOP)]

    # the laptop opens on the match cut: the chip boots (a 4-note pass), the pizz pulse starts (the pre-beat)
    t = c.next16(cut + 0.02)
    for i in range(4):
        c.n('lead', nm(BUILD_BB[i]), t + i * S16, S16 * 0.62, 0.3 * ACC4[i], True, duty=0.25, att=0.002, dec=0.09,
            sus=0.45, rel=0.035)
    c.mark(t, 'the laptop opens: the chip boots (4)')
    t = c.next8(cut + 0.4)
    while t < end - 0.02:
        b = int(c.bar_of(t))
        busy = tl.talking(t, t + 0.01, pad=0.1)
        c.n('vc_pz', DUEL_CH[chord(b)][0], t, 0.22, 0.4 * (0.75 if busy else 1.0), art='pizz')
        t += Q / 2
    # the Lighthouse (right pane): marimba + harp, the 3-note cell in quarters across 4/4, from the split
    cellp = ['F4', 'Bb4', 'Db5']
    t = c.next_beat(split)
    k = 0
    while t < end - 0.02:
        busy = tl.talking(t, t + 0.01, pad=0.1)
        c.n('marimba', cellp[k % 3], t, 0.5, 0.34 * (0.7 if busy else 1.0))
        if k % 3 == 0:
            c.n('harp', cellp[k % 3], t, 0.8, 0.44)
        t += Q
        k += 1
    # the harmony: a held quartet pad (vla + vc + cb), one chord a bar
    b0 = int(c.bar_of(split)) + 1
    for b in range(b0, b_end):
        ch = DUEL_CH[chord(b)]
        c.n('vc', ch[0], c.bar(b), BAR * 0.98, 0.2, art='sus', att=0.2, rel=0.4)
        c.n('vla', ch[2], c.bar(b), BAR * 0.98, 0.17, art='sus', att=0.2, rel=0.4)
    # trading bars from the split: odd bars the Build (chip + woodclick, left), even bars the Addendum (right)
    add_n = 0
    for b in range(b0, b_end):
        t0 = c.bar(b)
        if post_b - 0.05 <= t0 < turn - 0.05:
            continue                                            # Mas's post: the quartet's held chord only
        if t0 >= turn - 0.05:
            break
        vo_ = tl.talking(t0, t0 + BAR, kinds={'vo'})
        if (b - b0) % 2 == 0:
            if vo_:
                continue
            cnt = 16 if not tl.talking(t0, t0 + BAR, kinds={'talk', 'mas', 'real'}) else 8
            for i in range(cnt):
                tt = t0 + i * S16
                c.n('lead', nm(BUILD_BB[i % 16]), tt, S16 * 0.62, 0.32 * ACC4[i % 4], True, duty=0.25, att=0.002,
                    dec=0.09, sus=0.45, rel=0.035)
                if i % 4 == 0:
                    c.n('woodclick', 76, tt, 0.05, 0.36)
            c.mark(t0, f'the Build\'s bar (Gerg, left pane): {cnt}')
        else:
            if vo_:
                continue
            text = ADD + ' ' + TAILS[min(add_n, len(TAILS) - 1)]
            L = V.line_len(text)
            V.phrase(c, 'svln', t0, text, 0.36 if not tl.talking(t0, t0 + L) else 0.26, art='sus', att=0.05,
                     rel=0.3, stop_at=min(t0 + BAR * 2 - 0.02, post_b - 0.02 if t0 < post_b else turn - 0.02))
            c.mark(t0, f'the Addendum\'s bar (Mario, right pane), its tail {add_n + 1}')
            add_n += 1
    # the felt under the V.O. ("mario used to sit where gerg sits.")
    for l in tl.lines_in(split, end, kinds={'vo'}):
        c.pch('felt', ['Db4', 'F4', 'Bb4'], l['on'] - 0.3, l['end'] - l['on'] + 0.6, 0.13, roll=0.02)
    # Mas's post: the quartet's held chord (a real post: no motion), Mario's added line a soft two-note tail
    for inst, p in zip(('vc', 'vla', 'svln'), ('Gb2', 'Db4', 'Bb4')):
        c.n(inst, p, post_b + 0.02, turn - post_b + 0.1, 0.2, art='sus', att=0.3, rel=0.4)
    scrib = tl.snd('11.05', 'pen_scribble_short', default=post_b + 2.8)
    c.n('vla', 'C4', scrib + 0.1, 0.5, 0.16, art='sus', att=0.05, rel=0.2)
    c.n('vla', 'Db4', scrib + 0.4, 0.8, 0.16, art='sus', att=0.05, rel=0.3)
    c.mark(post_b, 'Mas\'s post: the quartet\'s held chord (no motion)', hit=False)
    # THE TURN: the Addendum's longest tail crosses the split; on the photograph the chip plays Mario's tail
    text = ADD + ' ' + TAILS[-1]
    V.phrase(c, 'svln', turn, text, 0.38, art='sus', att=0.05, rel=0.3, stop_at=shutter - 0.02)
    tail = [nm(p) + 12 for p, _ in V.parse_line(TAILS[-1]) if p]
    tt = c.next16(shutter + 0.02)
    for i, p in enumerate(tail):
        if tt + i * S16 * 2 >= end - 0.05:
            break
        c.n('lead', p, tt + i * S16 * 2, S16 * 1.2, 0.34, True, duty=0.25, att=0.002, dec=0.1, sus=0.4, rel=0.04)
    c.mark(turn, 'THE TURN: the Addendum crosses the split')
    c.mark(tt, 'the photograph: the chip plays Mario\'s tail (Gerg ships it)')
    # the end: a held Bbm(add9) on 12.01's downbeat, ringing into the letter
    push_ = tl.snd('12.01', 'paper_whip', default=end + 2.0)
    for inst, p in (('vc', 'Bb2'), ('vla', 'F3'), ('svln', 'C5'), ('harp', 'Bb3'), ('marimba', 'Db5')):
        c.n(inst, p, end, max(2.2, push_ - end), 0.2, art='sus', att=0.05, rel=1.2) if inst in ('vc', 'vla', 'svln') \
            else c.n(inst, p, end, 1.6, 0.4)
    c.mark(end, 'the letter lights: a held Bbm(add9), ringing out', hit=False)
    V.thin(c, {'vo': dict(drop={'lead', 'woodclick', 'svln', 'marimba'}, soften={'vc_pz': 0.7, 'harp': 0.6}),
               'talk': dict(soften={'lead': 0.75, 'svln': 0.8, 'marimba': 0.8, 'woodclick': 0.7}),
               'mas': dict(drop={'lead', 'svln'}),
               'real': dict(drop={'lead', 'svln', 'marimba', 'woodclick', 'harp'})}, t0=split, t1=end - 0.05)
    c.section('the laptop opens (the match cut): the boot, the pulse', cut, split)
    c.section('the split: the Build against the Addendum, trading bars over the Lighthouse', split, post_b)
    c.section('Mas\'s post: the quartet\'s held chord', post_b, turn)
    c.section('the turn: the Addendum crosses; the chip copies its tail; the held chord', turn, end + 1.4)
    meta = dict(
        id='duel', title='The Duel (Ep1 v3, Act One sc 11; MM-04 Lighthouse)', mm='MM-04', usage='BI',
        family='P02 room colour (Misanthropic) x the Build', tone='rivalry: the same cell, two panes, one tempo',
        scenes=['Ep1 v3 Act One sc 11'],
        motifs=['Gerg\'s Build in B-flat minor (chip)', 'the Addendum (gains a tail each time)', 'the Lighthouse cell'],
        motif_ids=[], key='B-flat minor; Gbmaj7, Ebm9, F7sus (no third over F)',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-20.0, album_lufs=-16.0,
        audition=['the trade: rivalry, never Nintendo (the chip in the left pane only)',
                  'the Addendum gaining its tail each time: funny by structure, not by sound',
                  'the turn: the chip copying Mario\'s tail on the photograph'])
    push = tl.snd('12.01', 'paper_whip', default=end + 2.0)     # it rings until the push brings MM-17 in
    sc = c.finish(T, meta, length_end=push + 0.5, end_fade=(push - 0.7, push + 0.45))
    return c, sc


# ================================================================== PAUSE (MM-17 low: Nole's Launch, THE JOB colour)
def cue_pause(tl):
    push = tl.snd('12.01', 'paper_whip', default=tl.B('12.01') + 2.0)
    refl = tl.B('12.05')
    desk = tl.B('12.04')
    c = V.Cue('pause', tl, anchor=push, anchor_bar=1, bars=10, swing=1.0)
    T = palette()
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['brush'].gain_db, T['swish'].gain_db = 8.0, 2.0
    dup(T, 'hn', 'hn_m', gain_db=-3.0)
    T['tpt'].gain_db, T['tpt'].eq = -6.0, [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['rhodes'].gain_db = -8.0
    T['lead2'].gain_db = -12.0
    # the walk: low, on C7alt that never resolves (C | Gb7 | C | Db7 ...), quarters, swung
    walk = [['C2', 'Bb1', 'G1', 'Gb1'], ['F1', 'Ab1', 'B1', 'Db2'], ['C2', 'E2', 'G1', 'Bb1'], ['Db2', 'F2', 'Ab1', 'B1']]
    comp = [['E3', 'Bb3', 'Eb4', 'Ab4'], ['E3', 'Bb3', 'Db4', 'Ab4'], ['E3', 'Bb3', 'Eb4', 'Ab4'], ['F3', 'B3', 'Eb4', 'Ab4']]
    b = 1
    while c.bar(b) < desk - 0.05:
        wl = walk[(b - 1) % 4]
        for k, p in enumerate(wl):
            t = c.bt(b, 1 + k)
            if t < desk - 0.05:
                c.n('ubass', p, t, Q * 0.9, 0.5 if k % 2 == 0 else 0.44)
        t = c.bt(b, 1)
        if not tl.talking(t, t + 0.4, kinds={'real'}):
            c.ch('rhodes', comp[(b - 1) % 4], t, Q * 1.2, 0.22, roll=0.006)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.', bars=(b, b + 1), vel=0.45)
        b += 1
    # the Launch stack, low and muted, in the gaps: C F Bb Eb ... and it falls one note short of the Ab
    n = 0
    for g0, g1 in tl.gaps(push + 0.3, desk - 0.3, min_len=1.5, pad_before=0.2, pad_after=0.3):
        t = c.next_beat(g0)
        if t + 4 * Q > g1 + 0.1:
            continue
        for k, p in enumerate(['C3', 'F3', 'Bb3', 'Eb4']):
            c.n('hn_m', p, t + k * Q * 0.5, Q * (1.6 - 0.3 * k), 0.34, art='mute', rel=0.3)
        c.n('lead2', 'Eb5', t + 1.5 * Q, 0.1, 0.18, True, duty=0.125, att=0.002, dec=0.08, sus=0.1, rel=0.04)
        c.mark(t, 'Nole\'s Launch stack (C F Bb Eb), low and muted: it falls one note short')
        n += 1
        if n >= 2:
            break
    # his desk (the hard cut): a low pedal (C2 + Gb2), ringing out before the reflection
    c.n('ubass', 'C2', desk, refl - desk + 0.2, 0.34)
    c.n('hn_m', 'Gb3', desk + 0.05, refl - desk, 0.22, art='mute', rel=0.6)
    c.mark(desk, 'his desk: a low pedal (C + Gb), out before the reflection', hit=False)
    V.clip_before(c, desk, insts={'rhodes', 'hn_m'}, rel=0.3)
    V.thin(c, {'talk': dict(drop={'hn_m', 'lead2'}, soften={'rhodes': 0.7, 'ubass': 0.9}),
               'real': dict(drop={'hn_m', 'lead2', 'rhodes'}),
               'mas': dict(drop={'hn_m', 'lead2'})}, t0=push, t1=desk - 0.02)
    c.section('MM-17 low: the walk on C7alt that never resolves; the Launch stack in the gaps', push, desk)
    c.section('his desk: the low pedal, rung out before the reflection', desk, refl)
    meta = dict(
        id='pause', title='The Pause Letter (Ep1 v3, Act One sc 12; MM-17 low)', mm='MM-17', usage='BI',
        family='P06 THE JOB colour, low (Nole)', tone='a chill: a cool walk nobody pauses',
        scenes=['Ep1 v3 Act One 12.01-12.04'], motifs=['Nole\'s Launch stack (C F Bb Eb; one note short)'],
        motif_ids=[], key='C7alt over a low F-minor-blues walk (never resolving to F)',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0, album_lufs=-16.0,
        audition=['the cool walk under Nole and Oigneb: a chill, not LEVERAGE; nobody pauses'])
    sc = c.finish(T, meta, length_end=refl + 0.3, end_fade=(refl - 1.2, refl - 0.02))
    return c, sc


def cue_threat(tl):
    lift = tl.snd('12.06', 'pen_tick_3', default=tl.B('12.06') + 1.5)
    end = tl.length
    # the file starts a bar early (silent): the engine's short-term meter needs a render longer than 3 s
    c = V.Cue('threat', tl, anchor=lift, anchor_bar=2, bars=4, swing=0.0)
    T = palette()
    T['tuba'].gain_db = 0.0
    T['tbn'].gain_db = -1.0
    T['hn'].gain_db, T['hn'].sends = -2.0, {'hall': -6}
    T['sub'].gain_db = -6.0
    T['timp'].gain_db = -2.0
    V.stab(c, 'tuba', ['F1'], lift, vel=0.7, length=0.5)
    V.stab(c, 'tbn', ['F2', 'C3'], lift, vel=0.66, length=0.45)
    c.n('hn', 'C3', lift, 0.9, 0.5, art='sus', att=0.01, rel=0.9, lock=True)
    c.n('hn', 'Gb3', lift, 0.9, 0.46, art='sus', att=0.01, rel=0.9, lock=True)
    c.n('timp', 'F2', lift, 1.5, 0.6)
    c.n('sub', 'F1', lift, 0.9, 0.5, rel=0.4)
    c.mark(lift, 'THREAT, once, on the pen\'s lift: F-C-Gb (low brass + sub), no third')
    c.section('THREAT on the pen\'s lift, its tail into the black', lift, end)
    meta = dict(
        id='threat', title='THREAT (Ep1 v3, Act One out; MM-14)', mm='MM-14', usage='BI', family='P08 OUTS KIT: THREAT',
        tone='one chill', scenes=['Ep1 v3 Act One 12.06-12.07'], motifs=[], motif_ids=[],
        key='F, C, G-flat: no third', composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-18.0,
        album_lufs=-14.0,
        audition=['the THREAT on the lift: one chill, not a dun-dun-dunnn'])
    sc = c.finish(T, meta, length_end=end, end_fade=(end - 0.45, end - 0.02))
    return c, sc


CUES = {'a': cue_a, 'code_red': cue_code_red, 'lobby': cue_lobby, 'floor': cue_floor, 'lobby2': cue_lobby2,
        'duel': cue_duel, 'pause': cue_pause, 'threat': cue_threat}


def lay(tl, built, work):
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')   # noqa: E731
    T0 = lambda k: built[k][0].T0                                              # noqa: E731
    cA = built['a'][0]
    cr = built['code_red'][0]
    lob = built['lobby'][0]
    t_cr = [t for t, lab, h in cr.marks if lab.startswith('the siren\'s whine')][0]
    lock = [t for t, lab, h in cr.marks if lab.startswith('THE LOCK')][0]
    pop = [t for t, lab, h in lob.marks if lab.startswith('THE POP')][0]
    fl = built['floor'][0]
    fl_in = fl.bar1
    jangle = [t for t, lab, h in fl.marks if lab.startswith('the key ring')][0]
    l2 = built['lobby2'][0]
    l2_in = l2.bt(1, 3) - 0.05
    close = tl.snd('9.13', 'folder_close', default=tl.E('9.13') - 1.2)
    duel_in = tl.B('11.01')
    push = tl.snd('12.01', 'paper_whip', default=tl.B('12.01') + 2.0)
    refl = tl.B('12.05')
    lift = tl.snd('12.06', 'pen_tick_3', default=tl.B('12.06') + 1.5)
    tear = tl.B('7.02')
    phone = lambda x: futz(x, 'phone')                                          # noqa: E731
    lob_in = lob.bt(1, 3) - 0.05
    layers = [
        dict(name='a_launch', wav=wav('a'), T0=T0('a'), a0=0.0, a1=tear + 2.6, fin=0.0, fout=1.2),
        dict(name='code_red', wav=wav('code_red'), T0=T0('code_red'), a0=t_cr, a1=lock, fin=0.4, fout=0.003,
             post=phone, post_name="era.futz('phone'): his phone's small speaker", level=-22.0),
        dict(name='lobby', wav=wav('lobby'), T0=T0('lobby'), a0=lob_in, a1=pop, fin=0.05, fout=0.003),
        dict(name='floor', wav=wav('floor'), T0=T0('floor'), a0=fl_in, a1=jangle + 1.1, fin=0.8, fout=0.6),
        dict(name='lobby2', wav=wav('lobby2'), T0=T0('lobby2'), a0=l2_in, a1=close + 0.05, fin=0.05, fout=0.5),
        dict(name='duel', wav=wav('duel'), T0=T0('duel'), a0=duel_in, a1=push + 0.5, fin=0.0, fout=1.0),
        dict(name='pause', wav=wav('pause'), T0=T0('pause'), a0=push - 0.05, a1=refl, fin=0.05, fout=0.3),
        dict(name='threat', wav=wav('threat'), T0=T0('threat'), a0=lift - 0.01, a1=tl.length, fin=0.005, fout=0.3),
    ]
    stops = [(lock, lob_in), (pop, fl_in), (refl, lift - 0.01)]
    designed = [(lock, lob_in, 'the phone locks (a diegetic stop) -> the lobby\'s pickup under the revolving door'),
                (pop, fl_in, 'the collar\'s pop: the swing stops dead; the lobby\'s room under "That collar suits you." '
                             '/ "it does." / "and the rent?"'),
                (close, duel_in, 'Gerg closes his laptop: his button, in the room (then the match cut)'),
                (refl, lift, 'no score on the reflection (Alyi in the glass; the pen\'s scratch only)')]
    stings = [(lift, tl.length, 'THREAT (the act-out sting)')]
    return layers, stops, designed, stings


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))   # render/_work/ (Kokoro), render/_work/el/ (git-ignored)
    built = {k: fn(tl) for k, fn in CUES.items()}
    if args.dry:
        for k, (c, sc) in built.items():
            print(k, V.note_qa(sc), f'file T0 {c.T0:.3f}', sc.meta.get('clock_notes', ''))
        return
    if args.render is not None:
        for k in (args.render or list(CUES)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, stops, designed, stings = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, stops=stops, designed=designed)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = []
    for k, (c, sc) in built.items():
        rows += [(f'{sc.name}: {lab}', a0, a1) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed, stings=stings)
    res['threat_momentary_max'] = V.momentary_max(mix, stings[0][0], stings[0][1])
    cues = []
    for L in layers:
        k = [kk for kk, (c, sc) in built.items() if sc.name == L['name']][0]
        c, sc = built[k]
        cues.append(dict(cue=L['name'], start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                         family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO),
                         laid_at_s=round(c.T0, 4), post=L.get('post_name'), level=res['cues'][L['name']],
                         target_lufs=L.get('level', sc.meta.get('underscore_lufs')),
                         engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc),
                         clock_notes=sc.meta.get('clock_notes'),
                         sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in c.marks]))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-act1{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='underscore (per-cue engine masters; code red laid at -22 LUFS-I after the phone futz; THREAT a sting), '
              'dry of dialogue; the mixer ducks it', cues=cues,
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    print('threat momentary max:', res['threat_momentary_max'])
    print('unmarked digital silence:', res['unmarked_digital_silence'])
    print('undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
