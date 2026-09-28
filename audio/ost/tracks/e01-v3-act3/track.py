#!/usr/bin/env python3
"""E01 v3 · ACT THREE "verified: human" · THE DARK ROOM · one cue on the segment's own clock (0 = its first frame)

Brief (v3-score-b, 2026-09-27; v3-plan §6, script draft 6 sc 18-23): intimate, quiet, a little lonely, but WARM, not
dread.  The Water Line (MM-01), warm, as one continuous performance across sc 18-22, thinning to one felt note under
the V.O. and under every real line; the Orb's verdict (the open fifth F5 -> C6) when the Orb acts; THE CLOCK (MM-14's
step figure) only at the act-out, one step a beat, to a dead stop on bar 4's downbeat.  Warm colours away from F
(D-flat lydian, A-flat major) are authorised for Ep1 v3.  Nothing below C3 anywhere (the dark room's drone, F1 + C2).

TIMING IS PARAMETRIC.  Every position below is read from the timeline (beat starts, line spans, words, sounds):
    --variant kokoro   show/reel/ep01-v3/ep01-v3-act3.json          (default)  -> render/music.wav, cues.json
    --variant el       show/reel/ep01-v3-el/ep01-v3-el-act3.json               -> render/music-el.wav, cues-el.json
    --timeline PATH    any timeline with the same beat and line ids            -> render/music-custom.wav
The grid (96 BPM, a bar = 2.5 s) is anchored so that THE CLOCK's bar 1 is 23.01's first frame.

  segment s (kokoro)  what plays                                                      picture
  0.03                the felt alone in the dark: a D-flat lydian bloom (Db3 Ab3 Eb4)  18.01 the home room
  0.54                THE WATER LINE, warm: F F F G(sw) F | C F over Dbmaj9(#11) and    (the slot whirs 2.5, the
                      Bbm9, the chip square on the nudge only                           tray lands 3.7: SFX)
  5.54 / 8.04         Abmaj9, Eb13sus: the dominant hangs as he reaches for the lid     18.02 the label
  10.54               Gbmaj9(#11) + bowed vibes (Bb4 F5, pp): the lens finds him        18.03 the Orb rises
  14.13-15.4          GLYPH grains (F5 C6 Db6, straight 16ths, 0 ms): the machine,      18.04 the scan; 18.04g the
                      one bar (GLYPH use 1 of 2 is the picture's)                        tokens (glyph_blink: SFX)
  15.65               THE VERDICT: F5 -> C6 (vibes + celesta), over the felt's open     18.05 `verified: human`
                      fifth F3 C4: no third                                              ("thanks." dry)
  18.04               one felt note (Db3 + Ab3) and nothing moves: "i made it for        18.06 the V.O.; "you can
                      everyone else." sits inside it; nothing under "you can stay."     stay."; the chime (SFX, F)
  23.67 / 24.29       the settle C4 -> F4 over the open fifth: it fits                  the Orb in the outline
  25.54-35.5          the Water Line again (Abmaj9 | Dbmaj9#11: the settle lands on     19.x the monitor: Mario,
                      D-flat's third, warm), a solo violin line under it (the lonely     the second phone, the rent
                      colour), Bbm9, Eb13sus                                            meter
  35.54-39.8          the record (the post he types): the felt's held F4 over Dbmaj7    20.01 TIDDER; 20.02 the
                      and a sul-tasto Db3/Ab3 pedal; nothing moves (the LEDs stop)      LEDs stop (the quiet beat)
  40.54-75.7          GERG'S CALL: A-flat major, one felt chord a bar; GERG'S BUILD      20.03 he posts; the ring;
                      (the v3 sample's A-flat colour) in compile passes in the gaps and  20.04-20.06 the call; the
                      under his lines, never under Mas's lines, the V.O. or the edit;    edit (the record: pedal);
                      the V.O. gets the felt alone; the keys run on (a last pass)       "gerg types louder..."
  75.8-93.5           the order: held chords in the gaps (Gbmaj9#11, Ebm9, Ab13sus),     21.02-21.03 NEDIB and the
                      pedal only under the real line                                    copies; "When the hell..."
  93.6-98.5           Dbmaj9; the Orb picks: THE VERDICT again (F5 -> C6) over the      21.04 "which one's real?"
                      open fifth, before "the one with the pen."                        the iris x3
  99.25               NEDIB'S FOUNTAIN PEN, bar 2 (C D F Bb, quarters) on the quartet,   21.05 the real one signs;
                      pp: his pen, his order                                             the copies clap
  102.9               DevDay: Abmaj9; TASYA'S RHODES, one chord, as he walks on; the     22.01 the keynote on the
                      A-flat pedal only under "We love you guys." (the record)          monitor
  109.9               Dbmaj9#11 on the felt; "thrilled is too much..." sits inside      22.02 the phone's three
  116.17              after "super.": the Water Line's flat line F F F and the nudge     22.03 the Orb lingers
                      G4 ... and the settle never comes:
  118.04              THE CLOCK takes the downbeat: an F3/C4 pedal, one pizz step a     23.01-23.03 the reminder,
                      beat on varied pitches + woodclick + an irregular chip tick; the   the iris steps along the
                      knee's rising F, G, A-flat as upper dyads, a layer added a bar     four circles, NOV 16 ->
                      (low spiccato eighths, then tremolo and the Ache at the peak)     NOV 17
  125.54              DEAD STOP on bar 4's downbeat (tails cut): the C never comes.      23.04 black (the crane and
                      Digital zero to the end; the SFX pre-lap carries the black         the tings pre-lap: SFX)

Run (from the repo root; the render is a heavy job):
    OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render
    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --dry          # build + note QA (light)
    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --assemble     # re-lay + measure (light)
    ... --variant el   (the ElevenLabs-timed lock, when it exists)
Nothing here has been listened to.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import v3clock   # noqa: E402
import v3lay     # noqa: E402
from v3music import *   # noqa: E402,F401,F403
from v3music import Cue, rebow, pedal_track, build16, Q, S16, BAR   # noqa: E402
from engine.core import nm   # noqa: E402

SEG = 'act3'
VO_VEL = 0.25                          # the felt under a V.O. (P01: -24 LUFS-S, the felt alone): a dyad
VO_VEL4 = 0.18                         # ... a four-note chord (render 2: 0.25 read -20 LUFS-S)
CUE_ID = 'e01-v3-act3'
REPO = v3clock.REPO


# ================================================================== the sync map (every position from the timeline)
def events(c):
    E = dict(
        home=0.0, slot=c.snd('18.01', 'synth:slot_whir'), thunk=c.snd('18.01', 'landing_thunk'),
        label=c.B('18.02'), lid=c.B('18.03'), scan=c.snd('18.04', 'orb_scan_sweep'),
        glyph=c.snd('18.04g', 'glyph_blink'), toast=c.snd('18.05', 'dialog_ok_click--chip'),
        drift=c.B('18.06'), chime=c.snd('18.06', 'synth:chime'),
        mon=c.B('19.01'), ring2=c.snd('19.13', 'synth:ring'), meter=c.snd('19.13', 'drip_clack'),
        type=c.B('20.01'), ledstop=c.B('20.02'), post=c.B('20.03'), ring=c.snd('20.03', 'synth:ring'),
        call=c.B('20.04'), edit=c.B('20.05'), back=c.B('20.06'), order=c.B('21.02'),
        ask=c.B('21.04'), servo=[c.snd('21.04', 'orb_servo', k) for k in range(3)],
        sign=c.B('21.05'), whip=c.snd('21.05', 'paper_whip'), claps=c.snd('21.05', 'synth:claps'),
        devday=c.B('22.01'), clunk=c.snd('22.01', 'landing_thunk'), phone=c.B('22.02'),
        tap=c.snd('22.02', 'key_tap_soft_01'), s2203=c.B('22.03'),
        clock=c.B('23.01'), stop=c.B('23.04'), end=c.LEN)
    L = c.LINES
    E.update(thanks=L['e1-a3-18-01'], vo14=L['e1-a3-18-04'], stay=L['e1-a3-18-03'], vo15=L['v3-vo-15'],
             real21=L['e1-a3-21-04'], q21=L['e1-a3-21-06'], pen21=L['e1-a3-21-07'], partner=L['e1-a3-22-01'],
             tasya=L['e1-a3-22-02'], vo16=L['v3-vo-16'], super_=L['e1-a3-22-03'])
    assert abs(E['stop'] - (E['clock'] + 3 * BAR)) < 0.05, (E['clock'], E['stop'])
    return E


def tracks():
    T = palette()
    T['felt'].gain_db = -1.0
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['felt_lh'] = replace(T['felt'], name='felt_lh')          # the left hand: its own track, so the matcher
    T['felt_mech'].gain_db = -14.0                              # reads the Water Line in 'felt' (MM-01's way)
    T['lead'].gain_db = -9.0                      # the chip: the nudge double and the Build (a keyboard next door)
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['lead2'].gain_db = -14.0                    # the GLYPH grains
    T['lead2'].hum_ms = 0.0
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db = -3.0
        T[k].sends = {'hall': -10, 'room': -16}
    T['svla'] = replace(T['svln'], name='svla', pan=0.2, width=0.35, sends={'hall': -9}, hum_ms=0.0, vel_jit=0.0,
                        rel=0.6, eq=[('lp', 3000), ('peq', 350, 2.0, 0.9)])       # the lonely solo line (MM-09's)
    T['vibes'].gain_db = -5.0
    T['celesta'].gain_db = -10.0
    T['celesta'].hum_ms = 0.0
    T['rhodes'].gain_db = -4.0                    # Tasya's colour (one chord)
    T['rhodes'].sends = {'room': -12, 'plate': -12}
    T['cl'].gain_db = -3.0
    T['woodclick'].gain_db = -9.0
    T['timp'].gain_db = -8.0
    T['glasspad'].gain_db = -15.0
    # the Clock's pizz ticks: the violin pizz set's body resonance at ~430-450 Hz read as an A over the F pedal
    # (render 1, the engine's F-major trace: 'resonance, the same peak under different notes'): notched there
    T['tick_pz'] = replace(T['vln1'], name='tick_pz', eq=list(T['vln1'].eq) + [('peq', 440.0, -12.0, 5.0)])
    T['vc_sp'] = replace(T['vc'], name='vc_sp', eq=list(T['vc'].eq) + [('peq', 440.0, -9.0, 5.0)])
    return T


CH = {  # felt voicings, nothing below C3 (the room drone); no A natural over an F bass anywhere (rule 12)
    'Dbly':     ['Db3', 'Ab3', 'Eb4'],
    'Dbmaj9':   ['Db3', 'Ab3', 'C4'],
    'Dbmaj9h':  ['Db3', 'F3', 'Ab3', 'C4'],
    'Bbm9':     ['Db3', 'F3', 'Ab3'],
    'Bbm9h':    ['Db3', 'F3', 'Ab3', 'C4'],
    'Abmaj9':   ['Eb3', 'G3', 'C4'],
    'Abmaj9h':  ['Eb3', 'G3', 'Bb3', 'C4'],
    'Eb13sus':  ['Eb3', 'Ab3', 'Db4', 'F4'],
    'Gbmaj9':   ['Gb3', 'Bb3', 'Db4', 'F4'],
    'Ebm9':     ['Eb3', 'Gb3', 'Bb3', 'Db4'],
    'Ab13sus':  ['Ab3', 'Db4', 'Gb4', 'Bb4'],
    'Cm7':      ['C3', 'G3', 'Bb3', 'Eb4'],
    'F5':       ['F3', 'C4'],
}
CALL_HARM = ['Abmaj9', 'Dbmaj9h', 'Bbm9h', 'Eb13sus', 'Abmaj9h', 'Dbmaj9h', 'Cm7', 'Eb13sus']


# ================================================================== the cue
def build(c):
    E = events(c)
    CLK = E['clock']
    K = int(math.ceil((CLK + 0.6) / BAR))
    T0 = CLK - BAR * K                                    # grid bar 1 = T0; THE CLOCK = bar K + 1
    cue = Cue(CUE_ID, T0, K + 8, swing=1.0)
    T = tracks()
    felt_ped = []
    rec_windows = [(E['type'], E['post'] + 0.1), (E['edit'], E['back'])]   # the typed post and its edit: the record
    B1 = K + 1                                            # THE CLOCK's bar

    def fch(name_or_ps, t, d, v, roll=0.014, span_end=None, mech=0.2):
        ps = CH[name_or_ps] if isinstance(name_or_ps, str) else name_or_ps
        felt_ped.append((cue.s(t), cue.s(span_end if span_end is not None else t + d)))
        cue.ch('felt_lh', ps, t, d, v, roll=roll)
        if mech:
            cue.n('felt_mech', 60, t, 0.1, mech)

    def vo_lift(l, ps, v=0.2):
        """one soft inner move inside a long V.O. (MM-01's vo_window), placed in a pause between its words"""
        if l['end'] - l['on'] < 3.0:
            return
        ws = l['words']
        gaps = [(b_ + 0.03, a2) for (_, _, b_), (_, a2, _) in zip(ws, ws[1:]) if a2 - b_ > 0.18]
        mid = l['on'] + 0.45 * (l['end'] - l['on'])
        if gaps:
            t = min(gaps, key=lambda g: abs(g[0] - mid))[0]
            cue.ch('felt_lh', ps, t, l['end'] - t + 0.8, v, roll=0.02)

    def blocked(a, b, vo=True, rec=True):
        if c.mas_room(a, b):
            return True
        if vo and c.in_vo(a, b):
            return True
        if rec and (c.in_record(a, b) or any(r0 < b and r1 > a for r0, r1 in rec_windows)):
            return True
        return False

    def water_line(b, vel=0.17, settle=True, nudge=True, check=True):
        txt = 'F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.' if settle else 'F4/4 F4/4 F4/4 G4/8 F4/8'
        ns = cue.line('felt', txt, b, vel=vel, swing=True)
        if nudge:
            place_motif(cue.a, 'lead', 'WATER_LINE', (b, 1), part='nudge_double', vel=0.1, swing=1.0, duty=0.5,
                        att=0.004, dec=0.25, sus=0.35, rel=0.12)
        if check:
            for nt in ns:
                assert not blocked(cue.x(nt.start), cue.x(nt.start) + 0.05, vo=False), ('WL onset in a line', nt.start)
        return ns

    # ---------------------------------------------------------------- A · the home room; the Orb
    b = cue.next_bar(E['home'] + 0.3)                     # the first bar line after the first frame
    fch('Dbly', E['home'] + 0.03, cue.bar(b) - E['home'] + 0.2, 0.12, roll=0.03, span_end=cue.bar(b) - 0.02)
    cue.mark(E['home'] + 0.03, 'A: the felt alone in the dark (D-flat lydian), from the first frame')
    water_line(b, vel=0.17)
    fch('Dbmaj9', cue.bar(b), 2.4, 0.13)
    fch('Bbm9', cue.bar(b + 1), 2.4, 0.12)
    cue.mark(cue.bar(b), 'A: THE WATER LINE, warm (F F F G F | C F over Dbmaj9(#11), Bbm9); the chip on the nudge')
    fch('Abmaj9', cue.bar(b + 2), 2.4, 0.12)
    fch('Eb13sus', cue.bar(b + 3), 2.4, 0.12)
    bo = cue.next_bar(E['lid'] + 0.6)                     # the lens finds him
    fch('Gbmaj9', cue.bar(bo), 3.4, 0.12)
    cue.n('vibes', 'Bb4', cue.bar(bo), 3.2, 0.2, art='bowed')
    cue.n('vibes', 'F5', cue.bar(bo) + 0.02, 3.2, 0.17, art='bowed')
    cue.mark(cue.bar(bo), 'A: Gbmaj9(#11) + bowed vibes: the lens finds him')
    # the scan: GLYPH grains (Ep1 stage: F5 C6 Db6), straight 16ths with rests, 0 ms, out before the toast
    grains = ['F5', None, 'C6', 'Db6', None, 'F5', None, 'C6', None, None, 'Db6', 'C6', None, 'F5', None, None,
              'C6', None, 'F5']
    t = E['scan']
    for i, p in enumerate(grains):
        tt = t + i * S16
        if tt > E['toast'] - 0.12:
            break
        if p:
            cue.n('celesta', p, tt, 0.12, 0.22, lock=True)
            cue.n('lead2', p, tt, 0.06, 0.2, lock=True, duty=0.125, att=0.001, dec=0.04, sus=0.0, rel=0.02)
    cue.mark(E['scan'], 'A: GLYPH grains under the scan (the machine, one bar; tokens F5 C6 Db6)')
    # THE VERDICT on the toast: F5 -> C6, soft vibes + celesta, over the felt's open fifth (no third)
    tv = E['toast'] + 0.03
    fch('F5', tv, 2.5, 0.14, roll=0.008)
    for inst, v in (('vibes', 0.42), ('celesta', 0.2)):
        cue.n(inst, 'F5', tv, Q * 1.6, v, lock=True)
        cue.n(inst, 'C6', tv + Q, Q * 2.6, v * 0.95, lock=True)
    cue.mark(tv, 'A: THE VERDICT F5 (verified: human)')
    cue.mark(tv + Q, 'A: THE VERDICT C6 (the open fifth, no third)')
    no_third = [(cue.s(tv) + 0.05, cue.s(tv) + 1.5)]
    # "i made it for everyone else.": one felt note, and nothing moves; nothing under "you can stay."
    v14 = E['vo14']
    t1 = max(E['drift'] + 0.1, v14['on'] - 0.45)
    fch(['Db3', 'Ab3'], t1, E['chime'] - t1 + 0.3, VO_VEL, roll=0.02, span_end=E['chime'] + 0.2)
    vo_lift(v14, ['F3', 'Ab3', 'C4'])
    cue.mark(t1, 'A: one felt note (Db3 + Ab3): the V.O. sits inside it; nothing under "you can stay."')
    # the settle after the chime (the Orb fits the outline): C4 -> F4 over the open fifth
    bs = cue.bar_of(E['chime'] + 0.05)
    ts = cue.bt(bs, 2) if cue.bt(bs, 2) > E['chime'] + 0.3 else cue.bt(bs, 3)
    assert ts > E['stay']['end'] + 0.3
    cue.n('felt', 'C4', ts, Q * 0.95, 0.17)
    cue.n('felt_mech', 60, ts, 0.1, 0.2)
    fch(['F3', 'C4'], ts + Q, 2.6, 0.14, roll=0.01, span_end=E['mon'] + 0.4)
    cue.n('felt', 'F4', ts + Q, 2.8, 0.18)
    cue.mark(ts, 'A: the settle C4 (after the chime)')
    cue.mark(ts + Q, 'A: F4 over the open fifth: it fits')
    no_third.append((cue.s(ts + Q) + 0.05, cue.s(ts + Q) + 1.8))
    cue.section('A the home room: the Water Line warm, the Orb, the verdict, the settle', 0.0, E['mon'])

    # ---------------------------------------------------------------- B · the monitor: Mario (a little lonely)
    bm = cue.next_bar(E['mon'] + 0.1)
    water_line(bm, vel=0.15, nudge=True)
    fch('Abmaj9', cue.bar(bm), 2.4, 0.12)
    fch('Dbmaj9h', cue.bar(bm + 1), 2.4, 0.12)
    fch('Bbm9h', cue.bar(bm + 2), 2.4, 0.11)
    fch('Eb13sus', cue.bar(bm + 3), 2.4, 0.11, span_end=E['type'] + 0.1)
    # the lonely colour: a solo violin line under the Water Line (sul tasto, soft attacks)
    for p, bb, beat, nb in [('Eb4', bm, 3, 2), ('Db4', bm + 1, 1, 4), ('C4', bm + 2, 1, 2), ('Bb3', bm + 2, 3, 2),
                            ('Ab3', bm + 3, 1, 4)]:
        cue.n('svla', p, cue.bt(bb, beat), nb * Q * 0.98, 0.28, art='sus', att=0.35, rel=0.5)
    cue.mark(cue.bar(bm), 'B: the Water Line again (Abmaj9 | Dbmaj9: the settle lands on its third) + the solo line')
    cue.section('B the monitor (Mario, the second phone, the rent meter)', E['mon'], E['type'])

    # ---------------------------------------------------------------- C · the post (the record) and the call
    tr = cue.bar(cue.next_bar(E['type'] + 0.3))
    fch('Dbmaj9', tr, E['post'] - tr + 0.6, 0.12, span_end=E['post'] + 0.3)
    cue.n('felt', 'F4', tr, E['post'] - tr + 0.6, 0.15)                    # the Water Line holds its note
    rebow(cue.a, 'vc', 'Db3', cue.s(tr - 0.2), cue.s(E['ring'] + 0.4), 0.16, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.8, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(tr), cue.s(E['ring'] + 0.4), 0.14, seg=5.0, xf=1.0, first_att=1.4,
          last_rel=0.8, art='sus', lp=1300)
    cue.mark(tr, 'C: the record (he types the post): a held F4 over Dbmaj7 + the pedal; nothing moves', hit=False)
    cue.mark(E['ledstop'], 'C: the LEDs stop: the Water Line holds (no attack)', hit=False)
    # the call: A-flat major, one felt chord a bar (moved off Mas's lines; none inside the V.O. or the edit)
    bc = cue.next_bar(E['ring'] - 0.15)
    b_end = cue.next_bar(E['order'] - 0.3)
    vo = E['vo15']
    k = 0
    for bb in range(bc, b_end):
        t = cue.bar(bb)
        name = CALL_HARM[k % len(CALL_HARM)]
        k += 1
        if vo['on'] - 0.6 <= t < vo['end']:
            continue
        if any(r0 - 0.05 <= t < r1 for r0, r1 in rec_windows):
            continue
        tt = c.after_lines(t, t + 1.6, pred=lambda l: l['who'] == 'mas' and not l['vo'])
        if tt is None:
            continue
        fch(name, tt, BAR - (tt - t) - 0.05, 0.12 if c.talk(tt + 0.3) else 0.14)
    fch('Dbmaj9h', vo['on'] - 0.35, vo['end'] - vo['on'] + 0.8, VO_VEL4, span_end=vo['end'] + 0.3)   # the V.O.
    vo_lift(vo, ['Eb3', 'Ab3', 'C4'], v=0.14)
    # the edit: the record again: a sul-tasto Ab3/Eb4 pedal under it (no chord, no Build)
    rebow(cue.a, 'vla', 'Eb4', cue.s(E['edit'] - 0.1), cue.s(E['back'] + 0.5), 0.13, seg=5.0, xf=1.0, first_att=0.8,
          last_rel=0.6, art='sus', lp=1300)
    rebow(cue.a, 'vc', 'Ab3', cue.s(E['edit'] - 0.1), cue.s(E['back'] + 0.5), 0.14, seg=5.0, xf=1.0, first_att=0.8,
          last_rel=0.6, art='sus', lp=1100)
    # GERG'S BUILD in A-flat major: compile passes on the half-bars, in the gaps and under his own lines
    sizes = [4, 8, 8, 12, 4, 8, 16, 8]
    passes = []
    t = cue.bt(bc, 3)
    kk = 0
    limit = E['order'] - 0.25
    while t < limit:
        n = sizes[kk % len(sizes)]
        while n >= 4 and (blocked(t - 0.05, t + n * S16 + 0.1) or t + n * S16 > limit):
            n -= 4
        if n >= 4:
            t0_, got = build16(cue, t, n, 0.3 if c.talk(t) else 0.33, felt_every=4, felt_vel=0.13)
            passes.append((t0_, got))
            kk += 1
            t += 2 * Q * max(2, math.ceil((got * S16) / (2 * Q)) + 1)
        else:
            t += 2 * Q
    tl = vo['end'] + 0.12                                                  # the keys run on after the V.O.
    if tl + 4 * S16 < E['order'] - 0.15:
        passes.append(build16(cue, tl, 8, 0.28, stop_at=E['order'] - 0.15, felt_every=0))
    for t0_, got in passes:
        cue.mark(t0_, f"C: the Build (A-flat), a compile pass of {got}")
    cue.section('C the post (the record) and the LEDs', E['type'], E['post'])
    cue.section("C Gerg's call: A-flat, the Build in passes; the edit (pedal); the V.O. (felt)", E['post'], E['order'])

    # ---------------------------------------------------------------- D · the order (the monitor), the Orb picks
    rebow(cue.a, 'vc', 'Gb3', cue.s(E['order'] - 0.2), cue.s(E['ask'] + 0.2), 0.13, seg=5.0, xf=1.0,
          first_att=1.0, last_rel=0.7, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Db4', cue.s(E['order']), cue.s(E['ask'] + 0.2), 0.12, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.7, art='sus', lp=1300)
    fch('Gbmaj9', E['order'] + 0.05, 3.0, 0.13)
    gaps = []
    ls = c.lines(E['order'], E['ask'])
    for l1, l2 in zip(ls, ls[1:]):
        if l2['on'] - l1['end'] > 0.3:
            gaps.append(l1['end'] + 0.06)
    for t, name in zip(gaps[:2], ['Ebm9', 'Ab13sus']):
        fch(name, t, 3.0, 0.12)
        cue.mark(t, f'D: {name} in the gap (held under the monitor)', hit=False)
    tq = E['ask'] + 0.05
    fch('Dbmaj9h', tq, E['servo'][2] - tq, 0.13, span_end=E['servo'][2] - 0.05)
    tv2 = E['servo'][2] + 0.02
    assert tv2 + 0.3 < E['pen21']['on']
    fch('F5', tv2, 2.2, 0.13, roll=0.008)
    for inst, v in (('vibes', 0.38), ('celesta', 0.18)):
        cue.n(inst, 'F5', tv2, 0.9, v, lock=True)
        cue.n(inst, 'C6', tv2 + 0.3, 1.8, v * 0.95, lock=True)
    cue.mark(tv2, 'D: THE VERDICT again: the Orb picks the one with the pen (F5 -> C6)')
    no_third.append((cue.s(tv2) + 0.05, cue.s(tv2) + 1.0))
    # NEDIB'S FOUNTAIN PEN (bar 2: C D F Bb in quarters) as the real one signs, pp, on the quartet
    tp = E['whip'] + 0.03
    for i, p in enumerate(['C5', 'D5', 'F5', 'Bb5']):
        cue.n('vln1', p, tp + i * Q, Q * (0.96 if i < 3 else 2.4), 0.3, art='sus', att=0.06, rel=0.6)
    for inst, p in (('vln2', 'D5'), ('vla', 'F4'), ('vc', 'Bb3')):
        cue.n(inst, p, tp, 4 * Q + 0.8, 0.2, art='sus', att=0.3, rel=0.8, lp=2600)
    cue.mark(tp, "D: NEDIB'S FOUNTAIN PEN (bar 2), pp: the real one signs")
    cue.section('D the order on the monitor; the Orb picks; the pen', E['order'], E['devday'])

    # ---------------------------------------------------------------- E · DevDay on the monitor; the phone; "super."
    tw = cue.bar(cue.next_bar(E['clunk'] + 0.05))                          # Tasya walks on
    fch('Abmaj9h', E['clunk'] + 0.05, tw - E['clunk'] + 2.0, 0.13)
    cue.ch('rhodes', ['C4', 'Eb4', 'G4', 'Bb4'], tw, 2.2, 0.26, roll=0.008)
    cue.mark(tw, "E: TASYA'S RHODES, one chord, as he walks on")
    rebow(cue.a, 'vc', 'Ab3', cue.s(tw), cue.s(E['phone'] + 0.5), 0.14, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.7, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Eb4', cue.s(tw + 0.2), cue.s(E['phone'] + 0.5), 0.12, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.7, art='sus', lp=1300)
    v16 = E['vo16']
    tph = max(E['phone'] + 0.4, v16['on'] - 0.9)
    fch('Dbmaj9h', tph, v16['end'] - tph + 1.0, VO_VEL4, span_end=E['super_']['end'] + 0.05)
    vo_lift(v16, ['F3', 'Bb3', 'Db4'], v=0.14)
    cue.mark(tph, 'E: Dbmaj9(#11), the felt alone: "thrilled is too much..." sits inside it')
    # after "super.": the Water Line's flat line and the nudge; the settle never comes (THE CLOCK takes it)
    bw = B1 - 1
    beats = [bt for bt in (2, 3, 4) if cue.bt(bw, bt) > E['super_']['end'] + 0.12]
    assert len(beats) >= 2, beats
    b0 = beats[0]
    fch('Dbmaj9', cue.bt(bw, b0), cue.bar(B1) - cue.bt(bw, b0) - 0.02, 0.12, span_end=cue.bar(B1) - 0.03)
    for bt in beats:
        cue.n('felt', 'F4', cue.bt(bw, bt), Q * 0.92, 0.17)
    cue.n('felt', 'G4', cue.sw(bw, 4.5), cue.bar(B1) - cue.sw(bw, 4.5) - 0.01, 0.18)
    cue.n('lead', 'G4', cue.sw(bw, 4.5), 0.18, 0.1, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.08)
    cue.mark(cue.bt(bw, b0), 'E: the flat line F F F, then the nudge G4 ... the settle never comes')
    cue.section('E DevDay; the phone; "super."', E['devday'], CLK)

    # ---------------------------------------------------------------- F · THE CLOCK (3 bars) -> the dead stop
    stop = CLK + 3 * BAR
    rebow(cue.a, 'vc', 'F3', cue.s(CLK), cue.s(stop) + 0.3, 0.2, seg=5.0, xf=1.0, first_att=0.05, last_rel=0.1,
          art='sus', lp=1400)
    rebow(cue.a, 'vla', 'C4', cue.s(CLK), cue.s(stop) + 0.3, 0.17, seg=5.0, xf=1.0, first_att=0.08, last_rel=0.1,
          art='sus', lp=1600)
    cue.n('timp', 'F3', CLK, 1.2, 0.34, lock=True)
    ticks = [['C5', 'Ab4', 'F4', 'Bb4'], ['C5', 'G4', 'Eb5', 'Ab4'], ['Db5', 'Ab4', 'C5', 'G4']]
    for k in range(3):
        bb = B1 + k
        for j, p in enumerate(ticks[k]):
            t = cue.bt(bb, 1 + j)
            cue.n('tick_pz', p, t, 0.25, 0.34 + 0.03 * k if j == 0 else 0.3 + 0.03 * k, lock=True, art='pizz')
            cue.n('woodclick', 60 + (j % 3), t, 0.08, 0.22 + 0.02 * k, lock=True)
        # the knee's rising step as an upper dyad: F, then G, then A-flat (the C never comes)
        top, low = [('C5', 'F4'), ('C5', 'G4'), ('Db5', 'Ab4')][k]
        cue.n('cl', low, cue.bar(bb), BAR + 0.02, 0.22 + 0.03 * k, lock=True, art='sus', rel=0.1)
        cue.n('vln2', top, cue.bar(bb), BAR + 0.02, 0.18 + 0.03 * k, lock=True, art='sus', rel=0.1, lp=3200)
        cue.mark(cue.bar(bb), f'F: THE CLOCK bar {k + 1}: the step on {low[:-1]}')
    # an irregular chip tick (never one pitch at an even rate)
    for k, (bb, bt, clk) in enumerate([(B1, 2.5, 11000), (B1, 4.0, 17000), (B1 + 1, 1.5, 8000), (B1 + 1, 3.0, 23000),
                                       (B1 + 1, 3.5, 14000), (B1 + 2, 1.0, 9500), (B1 + 2, 2.5, 19000),
                                       (B1 + 2, 3.5, 12000), (B1 + 2, 4.5, 16000)]):
        cue.n('noise', 60, cue.bt(bb, bt), 0.06, 0.3 + 0.04 * (k % 3), lock=True, clock=float(clk),
              short=(k % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
    # bar 2: + low spiccato eighths (varied pitches); bar 3: + tremolo violins and the Ache (the peak)
    spic = ['F3', 'C4', 'Ab3', 'C4', 'G3', 'C4', 'Ab3', 'Db4']
    for k in (1, 2):
        for i, p in enumerate(spic):
            cue.n('vc_sp', p, cue.bt(B1 + k, 1 + 0.5 * i), 0.12, (0.26 if k == 1 else 0.3) * (1.0 if i % 2 == 0 else 0.8),
                  lock=True, art='spic')
    cue.n('vln1', 'F5', cue.bar(B1 + 2), BAR, 0.2, lock=True, art='trem', lp=3500)
    cue.n('vln1', 'Gb5', cue.bar(B1 + 2) + 0.01, BAR, 0.16, lock=True, art='trem', lp=3500)
    cue.ch('glasspad', ['G4', 'Db5'], cue.bar(B1 + 2), BAR, 0.3, roll=0.0, lock=True, rel=0.05)
    cue.n('timp', 'C3', cue.bar(B1 + 2), 1.0, 0.3, lock=True)
    cue.mute(stop, E['end'] + 1.0)
    cue.mark(stop, 'F: DEAD STOP on bar 4\'s downbeat (tails cut): the C never comes', hit=False)
    cue.section('F THE CLOCK (3 bars, a layer a bar)', CLK, stop)
    cue.section('the stop: black (the SFX pre-lap carries it)', stop, E['end'])

    # ---------------------------------------------------------------- bookkeeping
    lowest = min(nt.pitch for nt in cue.notes if nt.inst not in ('felt_mech', 'woodclick', 'noise'))
    assert lowest >= nm('C3'), ('below C3 over the room drone', lowest)
    T['felt'].pedal = pedal_track(felt_ped)
    T['felt_lh'].pedal = T['felt'].pedal
    T['rhodes'].pedal = [(-1.0, False)]
    macro = [(0.0, 0.0), (cue.s(CLK) - 0.3, 0.0), (cue.s(CLK), -2.5), (cue.s(CLK + 2 * BAR) - 0.2, -2.5),
             (cue.s(CLK + 2 * BAR), -1.0), (cue.s(stop) + 1.0, -1.0)]
    meta = dict(
        id=CUE_ID, title='The Dark Room (Ep1 v3, Act Three, to picture)', mm='MM-01 (Water Line) + MM-14 (THE CLOCK)',
        usage='BI', family='P01 DARK ROOM, warm (D-flat lydian / A-flat major) -> P04 THE CLOCK',
        tone='intimate, quiet, a little lonely, warm; the Orb as a witness; the clock only at the out',
        scenes=[f'Ep1 v3 Act Three sc 18-23, segment 0-{c.LEN:.3f} s ({c.variant}); file t = 0 = segment {T0:.3f} s'],
        motifs=['the Water Line, warm (felt; the chip on the nudge)', 'the verdict F5 -> C6 (twice)',
                'GLYPH grains (one bar, the scan)', "Gerg's Build in A-flat major (compile passes)",
                "Nedib's Fountain Pen (bar 2)", "Tasya's Rhodes (one chord)", 'THE CLOCK (F, G, A-flat: no C)'],
        motif_ids=['WATER_LINE'], key='D-flat lydian / A-flat major; F open fifths (the verdict); F pedal (the clock)',
        composer='Ep1 v3 score, Acts Three and Four (v3-score-b, 2026-09-27)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=no_third,
        vo_windows=[(cue.s(l['on']), cue.s(l['end']), l['text']) for l in (E['vo14'], E['vo15'], E['vo16'])],
        room_sfx=[dict(t0=cue.s(0.0), t1=cue.s(stop), sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=round(cue.s(E['thunk']), 3), sfx='landing_thunk: the tray'),
                   dict(t=round(cue.s(E['glyph']), 3), sfx='glyph_blink (the SFX own G6-F7)'),
                   dict(t=round(cue.s(E['chime']), 3), sfx="the Orb's chime (F): the verdict never with it"),
                   dict(t=round(cue.s(E['meter']), 3), sfx='the rent meter tick'),
                   dict(t=round(cue.s(E['post']), 3), sfx='post_click'), dict(t=round(cue.s(E['ring']), 3), sfx='the ring'),
                   dict(t=round(cue.s(E['whip']), 3), sfx='paper_whip: the pen'),
                   dict(t=round(cue.s(E['tap']), 3), sfx='key_tap_soft_01: [super]')],
        audition=[f'{cue.s(0):.1f}-{cue.s(E["mon"]):.1f} s: the felt warm and close from the first frame; the grains '
                  'under the scan read as the machine for one bar, not a sting; the verdict a verdict',
                  f'{cue.s(E["mon"]):.1f}-{cue.s(E["type"]):.1f} s: the solo line: lonely, never the sad-piano cliche',
                  f'{cue.s(E["post"]):.1f}-{cue.s(E["order"]):.1f} s: the Build under the call: his keyboard next door, '
                  'never a melody on his lines',
                  f'{cue.s(E["sign"]):.1f} s: the Fountain Pen under the signing: a nod, not a joke',
                  f'{cue.s(CLK):.1f}-{cue.s(stop):.1f} s: THE CLOCK builds by addition with no riser; the dead stop '
                  'on the black lands as an out'])
    sc = Score(CUE_ID, cue.g, T, cue.notes, macro=macro, length_s=cue.s(E['end']) + 0.2, tail_s=0.0,
               meta=meta, **cue.score_args())
    window = [0.0, c.LEN, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.marks],
                 sections=[(lab, round(a, 4), round(b_, 4)) for lab, a, b_ in cue.sections],
                 silences=[(stop, c.LEN, "THE CLOCK's dead stop on bar 4's downbeat -> the act's last frame "
                                        '(black; the SFX pre-lap of the crane and the tings carries it)')])
    return sc, T0, window, extra


# ================================================================== CLI
def paths(variant):
    tag = '' if variant == 'kokoro' else f'-{variant}'
    rd = os.path.join(HERE, 'render')
    return dict(work=os.path.join(rd, '_work', variant), wav=os.path.join(rd, f'music{tag}.wav'),
                cues=os.path.join(HERE, f'cues{tag}.json'))


def dry(c):
    from engine import analysis as an
    sc, T0, window, extra = build(c)
    wt = an.written_third(sc.notes, sc.tracks)
    kc = an.knee_completion(sc.notes)
    out = dict(clock=c.describe(), notes=len(sc.notes), T0=round(T0, 3), written_third_ok=wt['ok'],
               written_third_count=wt['count'], knee_completion=kc['count'],
               marks=len(extra['marks']), first=round(min(n.start for n in sc.notes) + T0, 3))
    print(json.dumps(out, indent=1))
    return out


def assemble(c, variant):
    P = paths(variant)
    lj = json.load(open(os.path.join(P['work'], f'{CUE_ID}.lay.json')))
    sil = [tuple(s) for s in lj['silences']]
    mix, info = v3lay.lay([CUE_ID], P['work'], c.N, P['wav'], zero=sil)
    secs = [(lab, a, b, CUE_ID) for lab, a, b in lj['sections']]
    res = v3lay.measure(P['wav'], sil, secs, {CUE_ID: (0.0, c.LEN)}, P['work'], [CUE_ID])
    doc = dict(schema='mrmas-segment-music/1', segment=SEG, id=f'{CUE_ID}{"" if variant == "kokoro" else "-" + variant}',
               file=os.path.relpath(P['wav'], REPO), clock=c.describe(), sample_rate=48000, channels=2,
               bit_depth=24, level='underscore, dry of dialogue (the mixer ducks it)',
               cues=[dict(id=CUE_ID, laid=info[CUE_ID], marks=lj['marks'], sections=lj['sections'])],
               silences=[dict(t0=round(a, 3), t1=round(b, 3), what=w) for a, b, w in sil],
               measured=res, source=os.path.relpath(os.path.join(HERE, 'track.py'), REPO),
               heard='nothing here has been listened to; every number is measured')
    json.dump(doc, open(P['cues'], 'w'), indent=1, ensure_ascii=False, default=float)
    print(json.dumps(dict(whole=res['whole'], unmarked_digital_silence=res['unmarked_digital_silence'],
                          holes=res['holes'], fragments=res['fragments_under_2s'],
                          engine_qa={k: {kk: v[kk] for kk in ('f_major_written_ok', 'f_major_spectral_ok',
                                                              'knee_completion', 'st_p95', 'warnings')}
                                     for k, v in res['engine_qa'].items()}), indent=1, default=float))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--variant', default=os.environ.get('MRMAS_V3_VARIANT', 'kokoro'), choices=['kokoro', 'el'])
    ap.add_argument('--timeline', default=None)
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--render', action='store_true')
    ap.add_argument('--assemble', action='store_true')
    args = ap.parse_args()
    variant = 'custom' if args.timeline else args.variant
    c = v3clock.Clock(SEG, variant=args.variant, path=args.timeline)
    if args.dry:
        dry(c)
        return
    P = paths(variant)
    if args.render:
        v3lay.render([(CUE_ID, lambda: build(c))], P['work'])
        args.assemble = True
    if args.assemble:
        assemble(c, variant)


if __name__ == '__main__':
    main()
