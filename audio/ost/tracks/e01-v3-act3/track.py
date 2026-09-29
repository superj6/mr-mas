#!/usr/bin/env python3
"""E01 v3 · ACT THREE "verified: human" · THE DARK ROOM · one cue on the segment's own clock (0 = its first frame)

Brief (v3-score-b, 2026-09-27; v3-plan §6, script draft 6 sc 18-23): intimate, quiet, a little lonely, but WARM, not
dread.  The Water Line (MM-01), warm, as one continuous performance across sc 18-22, thinning to one felt note under
the V.O. and under every real line; the Orb's verdict (the open fifth F5 -> C6) when the Orb acts; THE CLOCK (MM-14's
step figure) only at the act-out, one step a beat, to a dead stop on bar 4's downbeat.  Warm colours away from F
(D-flat lydian, A-flat major) are authorised for Ep1 v3.  Nothing below C3 anywhere (the dark room's drone, F1 + C2).

TIMING IS PARAMETRIC.  Every position below is read from the timeline (beat starts, line spans, words, sounds):
    --variant kokoro   show/reel/ep01-v34/ep01-v34-act3.json          (default)  -> render/music.wav, cues.json
    --variant el       show/reel/ep01-v34-el/ep01-v34-el-act3.json               -> render/music-el.wav, cues-el.json
    (MRMAS_V3_LOCK=v33 or v32 points at an earlier lock; v31 and v3 no longer build)
    --timeline PATH    any timeline with the same beat and line ids              -> render/music-custom.wav
The grid (96 BPM, a bar = 2.5 s) is anchored so that THE CLOCK's bar 1 is 23.01's first frame.

v3.4 (the final lock, show/reel/ep01-v34/; script-v34-notes.md): the Orb's V.O. on the label (18.02: the D-flat maj9
struck before it, the Water Line's B-flat minor held to it), no V.O. at 18.06, the deepfakes cut (21.03-21.04: the
order's G-flat maj9 runs into the pen; one verdict), his DevDay V.O. over the unscored hall (22.01).  The times in
the map below are v3.2's; cues.json carries every v3.4 mark.
v3.2 (script draft 8.1): the V.O. is down to two lines here ("i made it for everyone else.", "thrilled
is too much..."); the LEDs no longer stop at the post; he switches the monitor off; DevDay is live on stage; the surge.
  segment s (kokoro)  what plays                                                      picture
  0.03                the felt alone in the dark: a D-flat lydian bloom                v31-18.00 the home room
  2.42                THE WATER LINE, warm: F F F G(sw) F | C F over Dbmaj9(#11) and    (the monitor lit)
                      Bbm9, the chip square on the nudge only
  3.21                TASYA'S RHODES, his chord (C Eb G Bb), on the cut to the         v31-18.00b the thirteenth
                      monitor; "Everyone is welcome." sits inside the felt              key, Atem blue; KRAM
  7.4-12.4            Abmaj9, Eb13sus + a viola A-flat pad: the tray                   18.01 the slot, the tray
  12.42               Dbmaj9 held, the felt alone: the label reads in it               18.02 the label
  14.92               Gbmaj9(#11) + bowed vibes (Bb4 F5, pp): the lens finds him        18.03 the Orb rises
  19.71               GLYPH grains (F5 C6 Db6, 16ths, 0 ms): the machine, one bar       18.04 the scan, the tokens
  21.24 / 21.86       THE VERDICT: F5 -> C6 over the felt's open fifth: no third       18.05 `verified: human`
  23.56               one felt note (Db3 + Ab3): "i made it for everyone else." sits   18.06 the V.O.; "you can
                      inside it; nothing under "you can stay."                         stay."; the chime (SFX, F)
  28.67 / 29.29       the settle C4 -> F4 over the open fifth: it fits                  the Orb in the outline
  30.4-35.8           Abmaj9 and a solo violin Eb4 -> Db4 held over the iris (a DESIGNED  19.01 the iris; v31-19.02
                      HIT on the cut: cues.json designed_hit, v3.3 X5) and
                      Sirrah's two letters; Dbmaj9 under the runner                     SIRRAH's two letters
  35.68 / 36.78 /     THE HANDS RUNNER: his three gestures on the felt (F F, F G, C F)  v31-19.03 the hands
  37.88               and THE COPY a beat late on the chip, cut off on each whirr       runner (the Orb copies)
  39.9-45.1           Bbm9, held: the monitor's lines play dry (the record)             "Every single person..."
  45.20               he lowers his hand himself: the felt alone (Eb Ab Db)             (no V.O. now)
  46.5-49.6           the record (the post he types): a held F4 over Dbmaj7 and a       20.01 TIDDER (the LEDs no
                      sul-tasto Db3/Ab3 pedal                                           longer stop: v3.2)
  49.6-78.0           GERG'S CALL: A-flat major, one felt chord a bar; GERG'S BUILD      20.03-20.06 he posts; the
                      in compile passes in the gaps and under his lines (53.67 57.42    call; the edit (the record:
                      59.92 66.17 69.92 72.42); his keys run on after "When it          a pedal); "When it
                      compiles." (76.79) to the paper's cut                             compiles."
  78.14               E-flat minor (Ebm9, felt) + a viola B-flat pad: the quote          v31-20.07 Neleh's paper
  83.04               NELEH'S QUESTION (OST-BIBLE s2.16): one high harmonic, C6 ->      v31-20.08 he reads on;
                      D-flat6, held into the order                                      the Orb reads him
  84.3-99             the order: held chords in the gaps (Gbmaj9#11, Ebm9, Ab13sus),    21.02-21.03 NEDIB and the
                      a pedal only under the real line                                  copies
  98.96               Dbmaj9 for "which one's real?", soft, pre-lapped 0.25 s (the      21.04 "which one's real?"
                      audit's unmarked step at v3.1 film 11:48.1: designed, now marked)
  102.35              THE VERDICT again (F5 -> C6): the Orb picks the one with the pen  21.04 the iris x3
  103.81              NEDIB'S FOUNTAIN PEN, bar 2 (C D F Bb), on the quartet, pp        21.05 the real one signs
  105.06              the felt takes the pen's F (F4) and holds it                      v32-21.06 the room; the
  106.84              THE TURN: on the switch the quartet goes with the glass and the   monitor clicks off; the
                      held F turns from B-flat major to D-flat major (his room)         clapping grows into a hall
  107.92-119.19       NO SCORE: DevDay live, the hall's applause, the stage and his     22.01 DevDay, live, full
                      line play dry (marked, digital zero)                              frame
  119.19              home: Dbmaj9#11 on the felt; "thrilled is too much..." inside it  22.02 the phone
  125.54              after "super.": the Water Line's flat line F F F and the nudge     22.03 the Orb lingers
                      G4 ... and the settle never comes:
  127.42              THE SURGE: the nudge decays over an F3/C4 sul-tasto pedal under   v32-22.04 the counter
                      the counter's chip notes; the LEDs step to red, the post pauses   blurs; the rack goes red;
                      the sign-ups (the pedal only)                                     SIGN UP -> NOTIFY ME
  132.42              THE CLOCK takes the next bar on the same pedal: one pizz step a   23.01-23.03 the reminder,
                      beat, the knee's rising F, G, A-flat as upper dyads, a layer a    the iris steps, NOV 16 ->
                      bar (spiccato eighths, then tremolo and the Ache at the peak)     NOV 17
  139.92              DEAD STOP on bar 4's downbeat (tails cut): the C never comes.      23.04 black (the SFX
                      Digital zero to the end (142.42)                                  pre-lap carries it)

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
        home=0.0, key=c.B('v31-18.00b') if c.has('v31-18.00b') else None, slot=c.snd('18.01', 'synth:slot_whir'), thunk=c.snd('18.01', 'landing_thunk'),
        label=c.B('18.02'), lid=c.B('18.03'), scan=c.snd('18.04', 'orb_scan_sweep'),
        glyph=c.snd('18.04g', 'glyph_blink'), toast=c.snd('18.05', 'dialog_ok_click--chip'),
        drift=c.B('18.06'), chime=c.snd('18.06', 'synth:chime'),
        mon=c.B('19.01'), sirrah=c.B('v31-19.02') if c.has('v31-19.02') else None, runner=c.B('v31-19.03'),
        rservo=[c.snd('v31-19.03', 'orb_servo', k) for k in range(3)], paper=c.B('v31-20.07'),
        paper2=c.B('v31-20.08'),
        type=c.B('20.01'), post=c.B('20.03'), ring=c.snd('20.03', 'synth:ring'),
        call=c.B('20.04'), edit=c.B('20.05'), back=c.B('20.06'), order=c.B('21.02'),
        ask=c.B('21.04') if c.has('21.04') else None,                         # (v3.4 cuts 21.03-21.04)
        servo=([x['at'] for x in c.SOUNDS if x['beat'] == '21.04' and x['name'] == 'orb_servo'] or None)
        if c.has('21.04') else None,                                          # (v3.5: two iris flicks, not three)
        pop=([x['at'] for x in c.SOUNDS if x['beat'] == '21.02' and x['name'] == 'tower_pop'] or [None])[-1]
        if c.has('21.03') else None,                                          # v3.5: the copy pops up (the deepfake)
        sign=c.B('21.05'), whip=c.snd('21.05', 'paper_whip'), claps=c.snd('21.05', 'synth:claps'),
        off=c.B('v32-21.06'), switch=c.snd('v32-21.06', 'key_tap_space'),          # v3.2: he switches it off
        devday=c.B('22.01'), phone=c.B('22.02'),
        tap=c.snd('22.02', 'key_tap_soft_01'), s2203=c.B('22.03'),
        surge=c.B('v32-22.04'), counter=c.snd('v32-22.04', 'synth:ratchet_fast'),    # v3.2: the sign-ups paused
        pause=c.snd('v32-22.04', 'post_click'),
        clock=c.B('23.01'), stop=c.B('23.04'), end=c.LEN)
    L = c.LINES
    E.update(thanks=L['e1-a3-18-01'], vo14=L.get('e1-a3-18-04'), stay=L['e1-a3-18-03'],
             vo05=L.get('v34-vo-05'),                                          # v3.4: the Orb's V.O. on the label
             partner=L['e1-a3-22-01'], stage=L['v32-a3-0001'],
             tasya_mon=L['v31-a3-0001'], remuhcs=L['e1-a3-19-01'], nole=L['e1-a3-19-02'],
             compiles=L['e1-a3-20-09'], tasya=L['e1-a3-22-02'], vo16=L['v3-vo-16'], super_=L['e1-a3-22-03'])
    assert E['surge'] < E['clock'] and E['devday'] < E['phone'] < E['surge']
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
    b = cue.next_bar(E['home'] + 0.8)                     # the first bar line after the bloom has sounded (v3.4: 0.8 s)
    fch('Dbly', E['home'] + 0.03, cue.bar(b) - E['home'] + 0.2, 0.12, roll=0.03, span_end=cue.bar(b) - 0.02)
    cue.mark(E['home'] + 0.03, 'A: the felt alone in the dark (D-flat lydian), from the first frame')
    water_line(b, vel=0.17)
    fch('Dbmaj9', cue.bar(b), 2.4, 0.13)
    v5 = E['vo05']
    skipA = v5 is not None and cue.bar(b + 2) >= v5['on'] - 1.5   # (v3.4: the label's V.O. comes before the 3rd bar)
    if skipA:                                             # the Water Line's B-flat minor holds to the label's chord
        tL = v5['on'] - 0.4
        fch('Bbm9', cue.bar(b + 1), max(2.4, tL - cue.bar(b + 1) + 0.1), 0.12, span_end=tL - 0.03)
    else:
        fch('Bbm9', cue.bar(b + 1), 2.4, 0.12)
    cue.mark(cue.bar(b), 'A: THE WATER LINE, warm (F F F G F | C F over Dbmaj9(#11), Bbm9); the chip on the nudge')
    # v3.1: the thirteenth key (the Atem payoff): the cut to the monitor, where Tasya hangs it on his ring, gets his
    # colour, one Rhodes chord (his DevDay chord, the upper four of D-flat lydian), on the Water Line's nearest quarter
    if E['key'] is not None:                              # v3.1-v3.2: the cut to the monitor
        tk = max(E['key'], min((cue.bar(b) + k * Q for k in range(8)), key=lambda t: abs(t - E['key'])))
        dk = min(1.9, E['tasya_mon']['on'] - tk - 0.1)
        cue.mark(tk, "A: TASYA'S RHODES, his chord, on the cut to the monitor: the thirteenth key (Atem blue)")
    else:                                                 # v3.3: the monitor plays in the home room from the first
        tm = E['tasya_mon']                               # frame; his chord answers his line on the Water Line's
        tk = min(cue.bar(b) + k * Q for k in range(12) if cue.bar(b) + k * Q >= tm['end'] + 0.05)   # next quarter
        dk = 1.9
        cue.mark(tk, "A: TASYA'S RHODES, his chord, after \"Everyone is welcome.\" on the monitor: the thirteenth key")
    cue.ch('rhodes', ['C4', 'Eb4', 'G4', 'Bb4'], tk, dk, 0.22, roll=0.008)
    def clear_vo(t, lead=0.3):
        """a chord wanted at t: if a V.O. is sounding there, strike it just before the V.O. (the V.O. sits inside the
        felt; no attack mid-V.O.) (v3.1 EL render: an attack inside "thirteen." read -16.6 LUFS)"""
        hit = c.lines(t - 0.05, t + 0.1, lambda l: l['vo'])
        return (hit[0]['on'] - lead) if hit else t
    tA = clear_vo(cue.bar(b + 2))
    if not skipA:
        fch('Abmaj9', tA, 2.4, 0.12)
    t3 = clear_vo(cue.bar(b + 3))
    bo = cue.next_bar(E['lid'])                           # the Orb rises; the lens finds him (v3.1: from the lid)
    t4 = cue.bar(cue.next_bar(E['label'] + 0.3))          # v3.2: the label reads in the felt alone (no V.O.)
    if t4 >= cue.bar(bo) - 0.5:
        t4 = E['label'] + 0.2
    if v5 is not None:                                    # v3.4: "my other company. for when it gets harder to
        t4 = v5['on'] - 0.4                               # tell." : the chord is struck before the V.O., which sits
    if t3 < t4 - 1.0:                                     # the dominant hangs as he reaches (when there's room)
        fch('Eb13sus', t3, t4 - t3 + 0.1, 0.12, span_end=t4 - 0.03)
        rebow(cue.a, 'vla', 'Ab3', cue.s(t3), cue.s(t4 + 0.3), 0.1, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.8,
              art='sus', lp=1300)                            # the tray and the label: a soft pad under them
    if v5 is None:
        fch('Dbmaj9h', t4, cue.bar(bo) - t4 + 0.2, 0.13, span_end=cue.bar(bo) - 0.03)
        cue.mark(t4, 'A: the label (PROOF YOU\'RE HUMAN · CO-FOUNDER): Dbmaj9 held, the felt alone')
    else:                                                 # inside it (v3.1's window: the felt at -24 LUFS)
        fch('Dbmaj9h', t4, max(v5['end'] + 0.3, cue.bar(bo)) - t4, 0.145, span_end=max(v5['end'] + 0.3, cue.bar(bo)) - 0.03)
        vo_lift(v5, ['Eb3', 'Ab3', 'Db4'], v=0.11)
        cue.mark(t4, 'A: the label and the V.O. ("my other company. for when it gets harder to tell."): Dbmaj9, the felt')
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
    t1 = max(E['drift'] + 0.1, v14['on'] - 0.45) if v14 else E['drift'] + 0.1
    fch(['Db3', 'Ab3'], t1, E['chime'] - t1 + 0.3, VO_VEL, roll=0.02, span_end=E['chime'] + 0.2)
    if v14:
        vo_lift(v14, ['F3', 'Ab3', 'C4'])
    cue.mark(t1, 'A: one felt note (Db3 + Ab3)' + (': the V.O. sits inside it' if v14 else ' as the Orb drifts to '
             'his shoulder (v3.4: no V.O.)') + '; nothing under "you can stay."')
    # the settle after the chime (the Orb fits the outline): C4 -> F4 over the open fifth
    bs = cue.bar_of(E['chime'] + 0.05)
    ts = next(cue.bt(bs + k // 4, 1 + k % 4) for k in range(1, 12)
              if cue.bt(bs + k // 4, 1 + k % 4) > E['chime'] + 0.3)          # the first beat after the chime
    assert ts > E['stay']['end'] + 0.3
    cue.n('felt', 'C4', ts, Q * 0.95, 0.17)
    cue.n('felt_mech', 60, ts, 0.1, 0.2)
    fch(['F3', 'C4'], ts + Q, 2.6, 0.14, roll=0.01, span_end=E['mon'] + 0.4)
    cue.n('felt', 'F4', ts + Q, 2.8, 0.18)
    cue.mark(ts, 'A: the settle C4 (after the chime)')
    cue.mark(ts + Q, 'A: F4 over the open fifth: it fits')
    no_third.append((cue.s(ts + Q) + 0.05, min(cue.s(ts + Q) + 1.8, cue.s(E['mon']) - 0.05)))   # (to the cut: the
    # monitor's A-flat colour is not the settle's: v3.2 EL read A 0.065 across the cut)
    cue.section('A the home room: the Water Line warm, the Orb, the verdict, the settle', 0.0, E['mon'])

    # ---------------------------------------------------------------- B · the monitor: the hands runner (v3.1)
    # the iris flick and Sirrah's two letters (a quote card: held, no melody); the runner in one held room frame:
    # his gestures on the felt, THE COPY (OST-BIBLE s2.5, Ep1: the hands runner) a beat late on the chip, each copy
    # breaking off on the Orb's whirr; the record lines (Remuhcs, Nole) held; the V.O. on the felt alone
    fch('Abmaj9', E['mon'] + 0.08, E['runner'] - E['mon'], 0.12, span_end=E['runner'] - 0.05)
    hits = [(E['mon'] + 0.08, "the iris flicks to the monitor (19.01): A-flat maj9 and the solo violin's E-flat4 on the "
                              "cut, out of the settle's decay: the turn from his room to the screen (v3.3 polish X5, "
                              "audit-v32: a +12 dB step on the cut; designed)")]
    cue.mark(E['mon'] + 0.08, 'B: DESIGNED HIT: the iris flicks to the monitor: Abmaj9 + the solo violin (the screen)')
    sv_ = [('Eb4', E['mon'] + 0.3, E['sirrah'] + 0.3), ('Db4', E['sirrah'] + 0.3, E['runner'] + 0.2)] \
        if E['sirrah'] is not None else [('Eb4', E['mon'] + 0.3, E['runner']), ('Db4', E['runner'], E['runner'] + 1.1)]
    for p, t0, t1 in sv_:                                                   # (v3.3: Sirrah's clip is cut)
        cue.n('svla', p, t0, t1 - t0, 0.26, art='sus', att=0.5, rel=0.6)      # the lonely colour, held
    fch('Dbmaj9h', E['runner'] + 0.05, E['remuhcs']['on'] - E['runner'] - 0.1, 0.12,
        span_end=E['remuhcs']['on'] - 0.1)
    frags = [('F4', 'F4'), ('F4', 'G4'), ('C4', 'F4')]                   # his line, in three gestures
    gest = [(E['rservo'][k], p) for k, p in enumerate(frags)]
    if E['sirrah'] is None:
        # v3.3 (the forum only; his two fingers are cut): ONE gesture, his own hand going up before anyone's (the
        # pixel pass: the second whirr - 8 f, the Orb turning to it); his F -> G on the felt, THE COPY a beat late on
        # the chip, broken off before Remuhcs asks the room (the record plays dry)
        up = E['rservo'][1] - 8 / 24
        gest = [(min(up + 0.95, E['remuhcs']['on'] - 0.1), ('F4', 'G4'))]
    for k, (sv, (p1, p2)) in enumerate(gest):
        t1_ = sv - 0.95 if E['sirrah'] is not None else E['rservo'][1] - 8 / 24
        assert not blocked(t1_, sv, vo=True), ('the runner gesture sits in a line', t1_)
        cue.n('felt', p1, t1_, 0.3, 0.17)
        cue.n('felt', p2, t1_ + 0.3125, 0.4, 0.16)
        cue.n('lead', p1, t1_ + Q, min(0.28, sv - (t1_ + Q) - 0.01), 0.12, lock=True, duty=0.5, att=0.003,
              dec=0.12, sus=0.3, rel=0.02)                                 # the copy: a beat late, cut on the whirr
        cue.mark(t1_, f'B: his gesture {k + 1} on the felt ({p1[:-1]} {p2[:-1]}); THE COPY a beat late, breaking off'
                 if len(gest) > 1 else f'B: his hand goes up, before anyone\'s: {p1[:-1]} {p2[:-1]} on the felt; THE '
                                       'COPY a beat late on the chip, breaking off')
    rl, nl = E['remuhcs'], E['nole']
    th = nl['end'] + 0.15                                  # v3.2: he lowers his hand himself (no V.O.)
    fch('Bbm9h', rl['on'] - 0.25, th - rl['on'] + 0.1, 0.11, span_end=th - 0.05)
    fch(['Eb3', 'Ab3', 'Db4'], th, E['type'] - th + 0.4, 0.15, span_end=E['type'] + 0.1)
    cue.mark(th, 'B: he lowers his hand himself: the felt alone (E-flat A-flat D-flat)')
    cue.section('B the monitor: the iris, Sirrah, the hands runner (THE COPY), his hand', E['mon'], E['type'])

    # ---------------------------------------------------------------- C · the post (the record) and the call
    tr = E['type'] + 0.3                                  # (v3.1: struck on the typing, not the next bar)
    fch('Dbmaj9', tr, E['post'] - tr + 0.6, 0.12, span_end=E['post'] + 0.3)
    cue.n('felt', 'F4', tr, E['post'] - tr + 0.6, 0.15)                    # the Water Line holds its note
    # the call: A-flat major, one felt chord a bar (moved off Mas's lines; none inside the V.O. or the edit)
    bc = cue.next_bar(E['ring'] - 0.15)
    # the pedal carries the ring's pre-lap into the call's first chord (v3.2: without the LEDs' beat the pedal had
    # left 1.5 s before the call's cut, and the first chord read as a +31 dB step 0.2 s after it)
    pe = max(E['ring'] + 0.4, cue.bar(bc) + 0.8)
    rebow(cue.a, 'vc', 'Db3', cue.s(tr - 0.2), cue.s(pe), 0.16, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.8, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Ab3', cue.s(tr), cue.s(pe), 0.14, seg=5.0, xf=1.0, first_att=1.4,
          last_rel=0.8, art='sus', lp=1300)
    cue.mark(tr, 'C: the record (he types the post): a held F4 over Dbmaj7 + the pedal; nothing moves', hit=False)
    cue.mark(cue.bar(bc), "C: Gerg's call: A-flat major, one felt chord a bar, over the record's pedal")
    b_end = cue.next_bar(E['paper'] - 0.3)
    k = 0
    for bb in range(bc, b_end):
        t = cue.bar(bb)
        name = CALL_HARM[k % len(CALL_HARM)]
        k += 1
        if any(r0 - 0.05 <= t < r1 for r0, r1 in rec_windows):
            continue
        tt = c.after_lines(t, t + 1.6, pred=lambda l: l['who'] == 'mas' and not l['vo'])
        if tt is None:
            continue
        fch(name, tt, BAR - (tt - t) - 0.05, 0.12 if c.talk(tt + 0.3) else 0.14)
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
    tl = E['compiles']['end'] + 0.12                          # his keys run on after "When it compiles." (v3.2)
    limit = min(E['paper'] - 0.25, tl - 0.1)                  # (the passes in the call end before the run-on)
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
    if tl + 4 * S16 < E['paper'] - 0.15:
        passes.append(build16(cue, tl, 8, 0.28, stop_at=E['paper'] - 0.15, felt_every=0))
    for t0_, got in passes:
        cue.mark(t0_, f"C: the Build (A-flat), a compile pass of {got}")
    cue.section('C the post (the record)', E['type'], E['post'])
    cue.section("C Gerg's call: A-flat, the Build in passes; the edit (pedal); his keys run on", E['post'], E['paper'])

    # ---------------------------------------------------------------- C' · Neleh's paper: the quote, her question
    # (v3.2: no V.O.; the page is read in the felt's E-flat minor, then her question as it holds)
    fch(['Eb3', 'Gb3', 'Bb3', 'Db4'], E['paper'] + 0.1, E['order'] - E['paper'], 0.16, span_end=E['order'] - 0.05)
    pe_ = E['order'] + 0.3 if E['order'] - E['paper2'] < 1.8 else E['paper2'] + 0.4    # v3.3: his held face on page
    rebow(cue.a, 'vla', 'Bb3', cue.s(E['paper'] + 0.2), cue.s(pe_), 0.135, seg=5.0, xf=1.0,  # 30 gets the harmonic alone
          first_att=1.0, last_rel=0.6, art='sus', lp=1300)
    tq_ = E['paper2'] - 1.3
    cue.n('svla', 'C6', tq_, E['paper2'] - tq_ + 0.05, 0.16, art='sus', att=0.6, rel=0.2, lp=3800)
    cue.n('svla', 'Db6', E['paper2'], E['order'] - E['paper2'] + 0.4, 0.17, art='sus', att=0.25, rel=0.8, lp=3800)
    cue.mark(E['paper'] + 0.1, "C': Neleh's paper: E-flat minor under the quote (held)", hit=False)
    cue.mark(E['paper2'], "C': NELEH'S QUESTION (OST-BIBLE s2.16): one high harmonic, C6 -> D-flat6", hit=False)
    cue.section("C' Neleh's paper: the quote, her question", E['paper'], E['order'])

    # ---------------------------------------------------------------- D · the order (the monitor), the Orb picks
    d_end = E['ask'] if E['ask'] is not None else E['sign']   # v3.4: the order's one line runs into the signing
    rebow(cue.a, 'vc', 'Gb3', cue.s(E['order'] - 0.2), cue.s(d_end + 0.2), 0.13, seg=5.0, xf=1.0,
          first_att=1.0, last_rel=0.7, art='sus', lp=1100)
    rebow(cue.a, 'vla', 'Db4', cue.s(E['order']), cue.s(d_end + 0.2), 0.12, seg=5.0, xf=1.0, first_att=1.2,
          last_rel=0.7, art='sus', lp=1300)
    fch('Gbmaj9', E['order'] + 0.05, 3.0, 0.13)
    cue.mark(E['order'] + 0.05, 'D: DESIGNED HIT: the order on the monitor: Gbmaj9(#11) over the G-flat/D-flat pedal, '
                                'out of his held face (page 30: the harmonic alone)')
    hits.append((E['order'] + 0.05, "the order on the monitor (21.02): G-flat maj9(#11) on the cut, out of 20.08's held "
                                    "face, which v3.3 scores with Neleh's harmonic alone (a +12 dB step on the EL cut; "
                                    "designed)"))
    gaps = []
    ls = c.lines(E['order'], d_end)
    for l1, l2 in zip(ls, ls[1:]):
        if l2['on'] - l1['end'] > 0.3:
            gaps.append(l1['end'] + 0.06)
    for t, name in zip(gaps[:2], ['Ebm9', 'Ab13sus']):
        fch(name, t, 3.0, 0.12)
        cue.mark(t, f'D: {name} in the gap (held under the monitor)', hit=False)
    if E['pop'] is not None:
        # v3.5 THE PRESIDENT'S DEEPFAKE, restored: "a laugh with a chill".  THE LAUGH: on the copy's pop the felt
        # strikes the pen's F and the chip copies it a sixteenth late and a hair flat (THE COPY's device: the echo
        # too close, a pixel off), once, before the copy speaks.  THE CHILL: under the copy's words ("And then the
        # computers regulate themselves.") the glass holds the Ache (G4 + D-flat5) over the G-flat pedal, and lets
        # go under the real one's outrage ("When the hell did I say that?", the record: dry, the pedal only)
        tpp = E['pop'] + 0.01
        fake = [l for l in c.lines(tpp, E['ask'] if E['ask'] else E['sign']) if l['who'] == 'deepfake']
        cue.n('felt', 'F4', tpp, 0.5, 0.13)
        cue.n('lead', 'F4', tpp + S16, 0.14, 0.12, duty=0.25, att=0.003, dec=0.12, sus=0.2, rel=0.05,
              bend=[(0.0, -0.35)])
        cue.mark(tpp, 'D: THE COPY POPS UP (the deepfake, v3.5): the felt F and the chip\'s copy a sixteenth late '
                      'and a hair flat (the laugh)')
        if fake:
            fk = fake[0]
            real_on = [l['on'] for l in c.lines(fk['end'], E['sign']) if l['who'] == 'nedib']
            g_end = (real_on[0] + 0.15) if real_on else fk['end'] + 0.6
            cue.ch('glasspad', ['G4', 'Db5'], fk['on'] - 0.25, g_end - fk['on'] + 0.25, 0.2, roll=0.0, rel=0.9)
            cue.mark(fk['on'] - 0.25, 'D: the chill: the Ache on glass (G4 + D-flat5) under the copy\'s words; it '
                                      'lets go under the real one\'s "When the hell did I say that?"', hit=False)
    if E['ask'] is not None:                              # (v3.4 cuts the deepfakes: no question, no second verdict)
        # "which one's real?": D-flat major9 for his question (designed; the v3.1 audit read it as an unmarked +15 dB
        # step on the cut at film 11:48.1): now marked, softer (0.13 -> 0.10, a slower roll) and pre-lapped 0.25 s so
        # the level step no longer sits on the cut
        tq = E['ask'] - 0.25
        fch('Dbmaj9h', tq, E['servo'][-1] - tq, 0.10, roll=0.05, span_end=E['servo'][-1] - 0.05)
        cue.mark(tq, 'D: Dbmaj9 for "which one\'s real?" (pre-lapped 0.25 s, soft: his question to his witness)',
                 hit=False)
        tv2 = E['servo'][-1] + 0.02
        assert tv2 + 0.3 < E['sign']
        fch('F5', tv2, 2.2, 0.13, roll=0.008)
        for inst, v in (('vibes', 0.38), ('celesta', 0.18)):
            cue.n(inst, 'F5', tv2, 0.9, v, lock=True)
            cue.n(inst, 'C6', tv2 + 0.3, 1.8, v * 0.95, lock=True)
        cue.mark(tv2, 'D: THE VERDICT again: the Orb picks the one with the pen (F5 -> C6)')
        no_third.append((cue.s(tv2) + 0.05, cue.s(tv2) + 1.0))
    # NEDIB'S FOUNTAIN PEN (bar 2: C D F Bb in quarters) as the real one signs, pp, on the quartet
    # the monitor's quartet plays until he switches it off (v3.2: the glass goes black on the click)
    tp = E['whip'] + 0.03
    sw_ = E['switch']
    assert tp + 4 * Q < sw_, (tp, sw_)
    for i, p in enumerate(['C5', 'D5', 'F5', 'Bb5']):
        d_ = Q * 0.96 if i < 3 else sw_ - (tp + i * Q)
        cue.n('vln1', p, tp + i * Q, d_, 0.3, art='sus', att=0.06, rel=0.6 if i < 3 else 0.06)
    for inst, p in (('vln2', 'D5'), ('vla', 'F4'), ('vc', 'Bb3')):
        cue.n(inst, p, tp, sw_ - tp, 0.2, art='sus', att=0.3, rel=0.06, lp=2600)
    cue.mark(tp, "D: NEDIB'S FOUNTAIN PEN (bar 2), pp: the real one signs")
    cue.section('D the order on the monitor; the Orb picks; the pen', E['order'], E['off'])

    # ---------------------------------------------------------------- the switch (v3.2): the turn
    # the Water Line holds its note under the switch: his felt takes the pen's F (F4, from its third note) and holds
    # it; on the click the monitor's quartet goes with the glass and the felt turns the same F from the pen's B-flat
    # major into his own D-flat major (D -> D-flat, B-flat -> D-flat: the room, not the screen); the hall's
    # applause takes the cut to DevDay, where the felt lifts its pedal and the score is out
    tf = tp + 2 * Q
    cue.n('felt', 'F4', tf, E['devday'] - tf + 0.1, 0.15)
    cue.ch('felt_lh', ['Db3', 'Ab3'], sw_ + 0.02, E['devday'] - sw_ + 0.1, 0.11, roll=0.03)
    felt_ped.append((cue.s(tf), cue.s(E['devday'] + 0.05)))
    cue.mark(tf, 'the switch: the felt takes the pen\'s F and holds it (the Water Line\'s note)', hit=False)
    cue.mark(sw_ + 0.02, 'THE TURN: he switches the monitor off: the quartet goes with the glass; the held F turns '
                         'from B-flat major to D-flat major (his room)')
    cue.section('the switch: the held F, the turn', E['off'], E['devday'])
    hall = E['devday'] + 0.9
    cue.mute(hall, E['phone'] + 0.2)
    cue.mark(E['devday'], "DevDay, live: the hall's applause takes the cut; no score under the stage (the hall "
                          'plays it dry)', hit=False)
    cue.section("DevDay, live: no score (the hall's applause, the stage, his line)", E['devday'], E['phone'])

    # ---------------------------------------------------------------- E · home: the phone; "super."
    v16 = E['vo16']
    tph = max(E['phone'] + 0.4, v16['on'] - 0.9)
    fch('Dbmaj9h', tph, v16['end'] - tph + 1.0, VO_VEL4, span_end=E['super_']['end'] + 0.05)
    vo_lift(v16, ['F3', 'Bb3', 'Db4'], v=0.12)          # (v3.1: 0.14 read -21.9)
    cue.mark(tph, 'E: home: Dbmaj9(#11), the felt alone: "thrilled is too much..." sits inside it')
    assert hall + 2.0 < tph
    # after "super.": the Water Line's flat line and the nudge; the settle never comes: the surge cuts in
    # (v3.3: the flat line is the next three quarters after "super.", across the bar line if it must be, and the
    # nudge on the third's swung "and", before the surge's cut; the G hangs into the surge)
    bw = cue.bar_of(E['super_']['end'] + 0.12)
    qs = [(bb, bt) for bb in (bw, bw + 1) for bt in (1, 2, 3, 4) if cue.bt(bb, bt) > E['super_']['end'] + 0.12][:3]
    gb, gt = qs[-1]
    tg = cue.sw(gb, gt + 0.5)
    assert len(qs) == 3 and tg < E['surge'] - 0.05, (qs, tg, E['surge'])
    t0f = cue.bt(*qs[0])
    te = E['surge']
    fch('Dbmaj9', t0f, te - t0f - 0.02, 0.12, span_end=te + 0.6)
    for bb, bt in qs:
        cue.n('felt', 'F4', cue.bt(bb, bt), Q * 0.92, 0.17)
    cue.n('felt', 'G4', tg, te - tg + 0.5, 0.18)
    cue.n('lead', 'G4', tg, 0.18, 0.1, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.08)
    cue.mark(t0f, 'E: the flat line F F F, then the nudge G4 ... the settle never comes')
    cue.section('E home: the phone; "super."', E['phone'], E['surge'])

    # ---------------------------------------------------------------- E' · the surge (v3.2): the sign-ups paused
    # the Water Line thins to its pedal under the counter's chip notes (the SFX, on F) while the rack's LEDs step
    # green, amber, red and he pauses the sign-ups: the nudge's G4 decays over an F3/C4 sul-tasto pedal that bows in
    # on the surge's downbeat; THE CLOCK's first step is the next bar, on the same pedal
    cue.mark(E['surge'], "E': THE SURGE: the Water Line thins to its pedal (F3/C4, sul tasto) under the counter; "
                         'the LEDs step to red; his post pauses the sign-ups', hit=False)
    cue.section("E' the surge: the pedal (the counter, the LEDs, the pause)", E['surge'], CLK)

    # ---------------------------------------------------------------- F · THE CLOCK (3 bars) -> the dead stop
    stop = CLK + 3 * BAR
    rebow(cue.a, 'vc', 'F3', cue.s(E['surge']), cue.s(CLK) + 0.02, 0.15, seg=5.0, xf=1.0, first_att=1.3,
          last_rel=0.1, art='sus', lp=1100)                                   # the surge: the pedal, sul tasto
    rebow(cue.a, 'vla', 'C4', cue.s(E['surge']) + 0.1, cue.s(CLK) + 0.02, 0.12, seg=5.0, xf=1.0, first_att=1.5,
          last_rel=0.1, art='sus', lp=1300)
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
                'GLYPH grains (one bar, the scan)', 'THE COPY (the hands runner)',
                "Gerg's Build in A-flat major (compile passes)", "Nedib's Fountain Pen (bar 2)",
                "Tasya's Rhodes (one chord: the thirteenth key)", "Neleh's question (C6 -> D-flat6)",
                'THE CLOCK (F, G, A-flat: no C)'],
        motif_ids=['WATER_LINE'], key='D-flat lydian / A-flat major; F open fifths (the verdict); F pedal (the clock)',
        composer='Ep1 v3 score, Acts Three and Four (v3-score-b, 2026-09-27; v3.2 refit 2026-09-28)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=no_third,
        vo_windows=[(cue.s(l['on']), cue.s(l['end']), l['text'])
                    for l in (E['vo14'], E['vo05'], E['vo16']) if l],
        room_sfx=[dict(t0=cue.s(0.0), t1=cue.s(stop), sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=round(cue.s(E['thunk']), 3), sfx='landing_thunk: the tray'),
                   dict(t=round(cue.s(E['glyph']), 3), sfx='glyph_blink (the SFX own G6-F7)'),
                   dict(t=round(cue.s(E['chime']), 3), sfx="the Orb's chime (F): the verdict never with it"),
                   dict(t=round(cue.s(E['rservo'][0]), 3), sfx="the Orb's whirr (the runner): the copy breaks off"),
                   dict(t=round(cue.s(E['post']), 3), sfx='post_click'), dict(t=round(cue.s(E['ring']), 3), sfx='the ring'),
                   dict(t=round(cue.s(E['whip']), 3), sfx='paper_whip: the pen'),
                   dict(t=round(cue.s(E['switch']), 3), sfx='the monitor clicks off: the turn'),
                   dict(t=round(cue.s(E['devday']), 3), sfx="the hall's applause (DevDay: no score)"),
                   dict(t=round(cue.s(E['tap']), 3), sfx='key_tap_soft_01: [super]'),
                   dict(t=round(cue.s(E['counter']), 3), sfx="the counter's chip notes (F): the pedal under them"),
                   dict(t=round(cue.s(E['pause']), 3), sfx='his post: the sign-ups paused')],
        audition=[f'{cue.s(0):.1f}-{cue.s(E["mon"]):.1f} s: the felt warm and close from the first frame; the grains '
                  'under the scan read as the machine for one bar, not a sting; the verdict a verdict',
                  f'{cue.s(E["mon"]):.1f}-{cue.s(E["type"]):.1f} s: the solo line: lonely, never the sad-piano cliche',
                  f'{cue.s(E["post"]):.1f}-{cue.s(E["order"]):.1f} s: the Build under the call: his keyboard next door, '
                  'never a melody on his lines',
                  f'{cue.s(E["sign"]):.1f} s: the Fountain Pen under the signing: a nod, not a joke',
                  f'{cue.s(E["switch"]):.1f} s: the turn on the switch: the held F from B-flat to D-flat, then the '
                  "hall's applause takes the cut (no score under DevDay)",
                  f'{cue.s(E["surge"]):.1f} s: the surge: the nudge decays over the pedal; tension without a riser',
                  f'{cue.s(CLK):.1f}-{cue.s(stop):.1f} s: THE CLOCK builds by addition with no riser; the dead stop '
                  'on the black lands as an out'])
    sc = Score(CUE_ID, cue.g, T, cue.notes, macro=macro, length_s=cue.s(E['end']) + 0.2, tail_s=0.0,
               meta=meta, **cue.score_args())
    window = [0.0, c.LEN, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.marks],
                 designed_hit=[(round(t, 4), w) for t, w in hits],
                 sections=[(lab, round(a, 4), round(b_, 4)) for lab, a, b_ in cue.sections],
                 silences=[(hall, tph, "DevDay, live: no score under the stage; the hall's applause, the "
                                       "stage's own sound and his line play it dry; the felt comes back at home"),
                           (stop, c.LEN, "THE CLOCK's dead stop on bar 4's downbeat -> the act's last frame "
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
               designed_hit=[dict(t=t, cue=CUE_ID, what=w) for t, w in lj.get('designed_hit', [])],
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
