"""E01 v3 Act Four · S6 · THE AVALANCHE · a tense, building pulse (drive and scale, not the full band)

REVISED (the showrunner on the v3 film, 2026-09-27: "i didn't mean for you to overkill and make it sound goofy level
hapy"; SHOWRUNNER-NOTES note 2's correction: no big band, no swing; variety is intensity and texture).  Act Four v5's
avalanche was MM-10 b's swung big band; this is a straight orchestral pulse in the F-minor home that builds by
addition on one 96 BPM grid from S6.01's first frame, and stops dead on Mada's label:
  bar 1-2  the tiles land: low spiccato eighths on varied pitches over F (cello, then violas), soft timpani on the
           downbeats, an irregular chip tick (the grid); the Build as a straight 16th chip figure, soft (his people)
  bar 3    Alyi's tile: STEP FOUR in the low strings and muted horns (B-flat minor(add9)); ALYI RESISTS: the pulse holds
           one beat, then goes on
  bar 4    Neleh's window: the pulse thins (no lead) under "Has anyone read the char--"; Step Four's A-flat, G-flat
  bar 5    THE QUIET VOTE goes without a sound (the board's F pedal ends there, silently); violins join in tremolo on
           Mada's semitone (C-D-flat), the violas double into sixteenths
  bar 6    Mada wedged: the peak: the strings' tremolo on a dark cluster over the F (F C G-flat D-flat E-flat), a
           timpani roll, low horns; DEAD STOP on MADA's label (freeze_hit_F owns the onset)
No brass section, no kit, no swing.  Nothing below C3 (the dark room's drone): the drive is in the register above it.
Digital zero from the label to the Monday bullpen.  Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import build16, BUILD_F, Cue, rebow   # noqa: E402

ID = 'e01-v3-a4-s6-avalanche'
Q = 0.625


def tracks():
    T = palette()
    for tr in T.values():                      # the machine and the board: straight, 0 ms
        tr.hum_ms = 0.0
        tr.drift_ms = 0.0
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].sends = {'hall': -12, 'room': -14}
    T['vc'].eq = list(T['vc'].eq) + [('peq', 111.3, -8.0, 8.0)]
    T['vln1'].eq = list(T['vln1'].eq) + [('peq', 440.0, -8.0, 5.0)]
    T['lead'].gain_db = -10.0
    T['lead'].eq = [('hp', 250), ('lp', 5000)]
    T['noise'].gain_db = -12.0
    T['timp'].gain_db = -3.0
    T['hn'].gain_db = -4.0
    return T


def build():
    c = C.CLK
    E = dict(av=c.B('S6.01'), mas=c.B('S6.02'), alyi_tile=c.B('S6.03'), alyi_left=c.txt('S6.03', 'ALYI left'),
             neleh_on=c.Lon('a5-29-24'), neleh_end=c.Lend('a5-29-24'), neleh_drop=c.txt('S6.04', 'NELEH left'),
             mada=c.B('S6.06'), qv=c.txt('S6.06', 'THE QUIET VOTE'), label=c.txt('S6.06', 'MADA'),
             freeze=c.snd('S6.06', 'freeze_hit_F'), s7=c.B('S7.01'))
    label = round(E['label'] * FPS) / FPS
    cue = Cue(ID, E['av'], 12, swing=0.0)
    T = tracks()
    bt = cue.bt

    def alive(t):
        return t < label - 0.02

    # the pulse: straight eighths on varied pitches (never one pitch at an even rate), 3+3+2 accents
    cells = [['F3', 'C4', 'Ab3', 'F3', 'C4', 'Ab3', 'Db4', 'C4'], ['F3', 'C4', 'Bb3', 'F3', 'C4', 'Bb3', 'Eb4', 'C4'],
             ['F3', 'Db4', 'Ab3', 'F3', 'Db4', 'Ab3', 'C4', 'Bb3'], ['F3', 'C4', 'Ab3', 'F3', 'Gb3', 'Ab3', 'C4', 'Db4']]
    vcells = [['C4', 'F4', 'Eb4', 'C4', 'F4', 'Eb4', 'Ab4', 'G4'], ['Db4', 'F4', 'Eb4', 'Db4', 'Gb4', 'F4', 'Ab4', 'F4']]
    acc = [1.0, 0.78, 0.8, 0.95, 0.78, 0.8, 0.9, 0.78]
    resist = bt(3, 1) + Q * round((E['alyi_tile'] + 1.2 - bt(3, 1)) / Q)      # Alyi's tile holds one beat
    thin0, thin1 = E['neleh_on'] - 0.1, E['neleh_end'] + 0.1
    for b in range(1, 8):
        for i in range(8):
            t = bt(b, 1 + 0.5 * i)
            if not alive(t) or resist - 0.01 <= t < resist + Q - 0.01:
                continue
            ramp = 0.3 + 0.05 * (b - 1)
            v = min(0.62, ramp) * acc[i] * (0.75 if thin0 <= t < thin1 else 1.0)
            cue.n('vc', cells[(b - 1) % 4][i], t, 0.14, v, lock=True, art='spic')
            if b >= 2 and not (thin0 <= t < thin1):
                cue.n('vla', vcells[(b - 1) % 2][i], t, 0.12, v * 0.85, lock=True, art='spic')
            if b >= 5:                                                         # the violas double into sixteenths
                cue.n('vla', vcells[(b - 1) % 2][(i + 3) % 8], t + Q / 4, 0.1, v * 0.7, lock=True, art='spic')
        if alive(bt(b, 1)):
            cue.n('timp', 'F3', bt(b, 1), 0.8, 0.32 + 0.05 * b, lock=True)
    cue.mark(E['av'], 'S6 the pulse: low spiccato eighths over F (the tiles land)')
    # the chip tick (irregular) and the Build as a straight, soft 16th figure (his people), bars 2-4
    for k, (b, beat, clk) in enumerate([(1, 2.5, 11000), (1, 4.0, 17000), (2, 1.5, 8000), (2, 3.5, 23000),
                                        (3, 2.0, 14000), (3, 4.5, 9500), (4, 1.0, 19000), (4, 3.0, 12000),
                                        (5, 1.5, 16000), (5, 2.5, 10000), (5, 4.0, 21000), (6, 1.0, 13000),
                                        (6, 2.0, 18000), (6, 3.0, 9000)]):
        t = bt(b, beat)
        if alive(t):
            cue.n('noise', 60, t, 0.05, 0.3, lock=True, clock=float(clk), short=(k % 4 == 3), dec=0.03, sus=0.0,
                  rel=0.02, hp=2500)
    for b, n in ((2, 8), (3, 8), (5, 12)):
        t0 = bt(b, 1)
        if alive(t0) and not (thin0 <= t0 < thin1):
            build16(cue, t0, n, 0.2, stop_at=min(label, resist if b == 3 else label), felt_every=0, cell=BUILD_F,
                    duty=0.25)
    # STEP FOUR in the low strings and muted horns: Alyi's tile, then Neleh's window
    S4 = [('Bb3', ['Db4', 'F4', 'C5']), ('Ab3', ['C4', 'Eb4', 'Bb4']), ('Gb3', ['Bb3', 'Db4', 'F4'])]
    t_s4 = [E['alyi_tile'], E['neleh_on'] - 0.3, E['neleh_end'] + 0.05, E['mada']]
    for k, (bass, ch) in enumerate(S4):
        a0, a1 = t_s4[k], t_s4[k + 1]
        if a1 - a0 < 0.3:
            continue
        cue.n('vc', bass, a0, a1 - a0 + 0.05, 0.3, lock=True, art='sus', att=0.1, rel=0.2)
        for j, p in enumerate(ch):
            cue.n('hn', p, a0, a1 - a0 + 0.05, 0.32 if j < 2 else 0.28, lock=True, art='mute', rel=0.2)
        cue.mark(a0, f'S6 Step Four ({bass[:-1]}): the board, pushed')
    cue.mark(resist, 'S6 ALYI RESISTS: the pulse holds one beat', hit=False)
    # the board's F pedal: from Neleh's window, ending silently as THE QUIET VOTE goes
    rebow(cue.a, 'vla', 'F3', cue.s(E['neleh_on']), cue.s(E['qv']), 0.26, seg=5.0, xf=1.0, first_att=0.4,
          last_rel=0.35, art='sus')
    cue.mark(E['qv'], 'S6 THE QUIET VOTE: the F pedal ends silently', hit=False)
    # bar 5-6: Mada's semitone in violin tremolo, then the peak: a dark cluster over F, a timpani roll, low horns
    tm = max(E['mada'], bt(5, 1))
    cue.n('vln2', 'C5', tm, label - tm, 0.3, lock=True, art='trem')
    cue.n('vln1', 'Db5', tm + Q, label - tm - Q, 0.26, lock=True, art='trem')
    pk = bt(6, 1) if bt(6, 1) < label - 0.5 else tm + 2 * Q
    for inst, p, v in (('vln1', 'Gb4', 0.32), ('vln2', 'Eb4', 0.32), ('vla', 'C4', 0.34), ('vc', 'F3', 0.36)):
        cue.n(inst, p, pk, label - pk, v, lock=True, art='trem')
    for p in ('F3', 'C4'):
        cue.n('hn', p, pk, label - pk, 0.4, lock=True, rel=0.05)
    k, t = 0, pk
    while t < label - 0.05:
        cue.n('timp', 'F3' if k % 2 == 0 else 'C3', t, 0.2, min(0.72, 0.4 + 0.02 * k), lock=True)
        t += Q / 4
        k += 1
    cue.mark(tm, "S6 Mada: the violins' tremolo on his semitone (C-Db)")
    cue.mark(pk, 'S6 the peak: the dark cluster over F, the timpani roll, low horns')
    cue.mute(label, E['s7'] + 0.5)
    lowest = min(n.pitch for n in cue.notes if n.inst not in ('noise',))
    assert lowest >= nm('C3'), ('below C3 over the room drone', lowest)
    for lab, a0, a1 in [('S6 bars 1-2: the pulse builds (the tiles)', E['av'], bt(3, 1)),
                        ("S6 bar 3: Alyi's tile, Step Four, the held beat", bt(3, 1), E['neleh_on'] - 0.1),
                        ("S6 bar 4: Neleh's window (thin)", E['neleh_on'] - 0.1, E['mada']),
                        ('S6 bars 5-6: Mada, the peak -> the stop', E['mada'], label)]:
        cue.section(lab, a0, a1)
    on_swing = abs((label - E['av']) - (22 * Q + 10 / 24)) < 0.02
    # render 6: the peak read -13.9 LUFS (p95 -13.7) over a -17 cue: scale, but under the old band's level
    macro = [(0.0, -1.5), (cue.s(bt(3, 1)), -0.5), (cue.s(tm), -1.0), (cue.s(pk), -2.5), (cue.s(label) + 1.0, -2.5)]
    meta = dict(
        id=ID, title='The Avalanche (Ep1 v3 Act Four, S6, revised: a building pulse)', mm='(new, from MM-10 b\'s form)',
        usage='BI', family='P11 SET-PIECE (straight, orchestral: no band, no swing) in the F-minor home',
        tone='drive and scale: the company falls into his lap as a building pulse that stops dead on the one man who '
             'will not move',
        scenes=[f'Ep1 v3 Act Four S6.01-S6.06, segment {E["av"]:.3f}-{label:.3f} s ({c.variant})'],
        motifs=['the pulse (spiccato, varied pitches)', 'the Build (straight 16ths, soft)',
                'Step Four (Alyi resists one beat)', "the board's F pedal (ends on the quiet vote)",
                "Mada's semitone (C-Db)", 'the dark cluster over F'],
        motif_ids=[], key='F minor / B-flat minor (Step Four) / a dark cluster over F, unresolved',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27; revised on the showrunner\'s note)',
        underscore_lufs=-17.0, album_lufs=-16.0,
        room_sfx=[dict(t0=0.0, t1=cue.s(label), sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=round(cue.s(c.snd('S6.01', 'landing_thunk', k)), 3), sfx=f'tile landing {k + 1}')
                   for k in range(5)]
        + [dict(t=round(cue.s(E['neleh_drop']), 3), sfx="landing_thunk: Neleh's tile goes"),
           dict(t=round(cue.s(label), 3), sfx='freeze_hit_F: MADA · LAST FIRER STANDING (owns the stop)')],
        audition=['0.0 s: the pulse out of the 2 AM ring-out: tense, not busy; no riser',
                  f'{cue.s(resist):.2f} s: Alyi resists one beat: resistance, not a dropout?',
                  f'{cue.s(pk):.2f}-{cue.s(label):.2f} s: the peak has scale without a band; the dead stop on the '
                  'label lands, never a glitch'])
    sc = Score(ID, cue.g, T, cue.notes, macro=macro, length_s=cue.s(E['s7']), tail_s=0.0, meta=meta,
               **cue.score_args())
    window = [E['av'], label, 0.0, 0.003]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in cue.marks],
                 sections=[(lab, round(a0, 4), round(a1, 4)) for lab, a0, a1 in cue.sections],
                 silences=[(label, E['s7'], "the dead stop on MADA's label -> the Monday bullpen (the dark room's air, "
                                            "then the bullpen's, hold it)")],
                 label_on_swing=on_swing)
    return sc, cue.T0, window, extra
