#!/usr/bin/env python3
"""E02 v1 · COLD OPEN (sc 1) · E02-01 THE MAMMOTH · the segment's score, laid on the segment's own clock (0 = its first frame).

The brief (manifest.md §6, E02-01; proposal.md sc 1 and "The feeling curve"; the lock's music runs): SET-PIECE SWING,
low, chip lead only (the Build's chip lead), in under the clip, the full band never; wonder -> suspense -> comic jolt;
"thins to a bass pedal on the first THUD (outside) and holds it through the doors"; out: "the knee's first four notes on
dry piano, spaced across the aftermath: the first on the complaint's THUD, the fourth on the SMASH TO INTRO".  The mood
map: awe, then a laugh (the chair); suspense (the thuds, the misdirect); a jolt and a bigger laugh (!!!); a small
question (the flyer).  One continuous performance: it thins and holds, it never stops.

  s (EL lock)     what plays
  0    - 10.0     THE CLIP (wonder, D-flat lydian): brushes in slow circles, the upright's two-feel on a D-flat pedal, a
                  high felt Dbmaj9(#11) a bar, and one BOWED VIBES line (G5 -> Eb5 -> Db5: too smooth for this
                  building) that ends as the foot breaks the bezel.  No chip while the mammoth is near-photoreal.
  9.4  - 19.8     THE STEP-OUT (F minor, the swing walks): the chip enters as it turns pixel: GERG'S BUILD compiles, 4
                  notes on the pickup, 8 on the bar that pre-laps the cut to 1.03, 12 through "Which sentence?"; walking
                  bass, a feathered ride, sparse quartal felt; the bar line pre-laps the cut by 0.29 s.  Thin under
                  Selbeep (no lead, softer comping); the chair melts on Db(#11), the peak C7(#9b13).
  19.8 - 23.5     THE PUNCHLINE: a swung push into 1.05 (Fm9, 0.21 s before the cut); thin under "Directionally.";
                  on the freeze the band HOLDS (the felt's pedal rings, the arco bass swells in on F): freeze_hit_F owns
                  the beat (no comic scoring: OST rule 1, "the cue thins or holds").
  23.5 - 26.8     TWO WEEKS LATER (A-flat, the mediant): a swung push 0.21 s before the cut; brushes; the bass walks
                  down A-flat G G-flat into the pedal; the Build's WHOLE pass, in A-flat (Ep1's odometer colour), and it
                  STOPS DEAD on THUD 1 (the cut-off on the story beat).
  26.8 - 45.0     THE PEDAL (C, the dominant): arco bass from THUD 1 (pp, a slow attack: the SFX keeps its thud);
                  tremolo cello an octave up from THUD 2; tremolo viola G3 + Db4 (an open fifth with a flat nine, no
                  third) from THUD 3; Gerg's Build compiles under his own line ("not looking up": 4, 8, then 12 cut off)
                  and stops dead on the doors.  The pedal holds through the doors, the complaint and page one (dry).
  45.0 - 55.0     THE OUT: the pedal lets go on the complaint's THUD and the knee's flat line plays on dry felt piano,
                  F2 (a sub F1 under it: the score's one 808 thud) on the THUD, F3 a swung eighth before the cut to
                  1.12, F4 0.21 s before the cut to 1.13, F5 a swung push into the SMASH: each a register up, each held
                  to the next, the chip glinting on 2-4 with its duty narrowing (0.5, 0.25, 0.125: the last is the
                  intro's own F6 glint); under them the pedal RESOLVES, C -> F: a soft arco F2 swells in after the
                  THUD and lets go on the fourth note (the dry piano decays fast: without it the out fell to -40 LUFS-M
                  between notes, S3/S9).  The fourth is cut on the smash, and the intro's first felt F5 lands on the next
                  beat of the same 96 BPM grid (bar 23 of this cue = the intro's f0).
  The mix: the pedal's section carries duck_db 5 in cues-el.json `sections` (it is already the thinned bed; the
  E02-01 default of 9 dB under Selbeep's O.S. line would leave only the room).

Every sync point comes from the lock: the beats, the SFX (mammoth_step_pixel, freeze_hit_F, hand_truck_step x3,
door_bang_open, paper_stack_fall), the lines (Gerg's and Selbeep's windows), and the segment's end.  The grid is anchored on
the SMASH (the last frame's bar line), so the knee always hands over on the intro's beat.  Cuts that carry a change are
pre-lapped by the latest grid point (a beat or a swung and) at least 0.15 s before the cut (about 0.25 s, Ep1's v3.5 rule).

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0): the 96 BPM grid; built from the knee's cells (the Build is
the flat-line pair and the kink; the out is the flat line); chip in the cue; no A-natural anywhere (no third over F); the
knee never whole (4 notes only); no comic scoring (holds and a cut-off, no stingers); no Mickey-Mousing (nothing doubles
the thuds or the steps: the pedal's layers swell in after them); no music fragment; designed hits marked.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --dry [--el]          # the runs; build + note QA
    OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --assemble --el       # re-lay render/_work, measure
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                         # the segment checks
Out: render/music[-el].wav (the segment's exact length) and cues[-el].json (the timeline it was laid to).
Nothing here has been listened to.
"""
from __future__ import annotations

import math
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e02-v1-common'))
import v3lib as V   # noqa: E402
from v3lib import palette, nm, Drums   # noqa: E402

SEG = 'coldopen'
Q, BAR, S16 = V.Q, V.BAR, V.S16
SW = Q * 2.0 / 3.0                     # the house swing: the and lands 10 frames after its beat

# GERG'S BUILD (OST-BIBLE §2.6): straight 16ths on the chip, the knee's flat-line pair and the kink, rotating
BUILD_F = ['F4', 'F4', 'G4', 'Ab4', 'C5', 'Ab4', 'G4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'Eb5', 'C5', 'Ab4']
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
ACC4 = (1.0, 0.72, 0.84, 0.72)

# the clip (D-flat lydian): felt voicing (high: above the voice's band), bass two-feel, the bowed vibes' note
PH1 = {
    'Db_a': (['F4', 'C5', 'Eb5', 'G5'], ('Db2', 'Ab2'), 'G5'),     # Dbmaj9(#11)
    'Db_b': (['Ab4', 'C5', 'F5', 'G5'], ('Db2', 'Ab2'), 'G5'),     # Dbmaj9(#11), the top held
    'EbDb': (['G4', 'Bb4', 'Eb5', 'F5'], ('Db2', 'Eb2'), 'Eb5'),   # Eb(add9)/Db: Db13(#11)
    'Csus': (['Bb3', 'Db4', 'F4', 'Ab4'], ('C2', 'G2'), 'Db5'),    # C7sus4(b9 b13): the turnaround into F
}
# the swing (F minor and its mediants): comping voicings (rootless, quartal), the walking line per bar
COMP = {
    'Fm11':  ['Bb3', 'Eb4', 'Ab4', 'C5'],
    'Fm9':   ['Ab3', 'C4', 'Eb4', 'G4'],
    'Db':    ['F3', 'C4', 'Eb4', 'G4'],
    'C7alt': ['E3', 'Bb3', 'Eb4', 'Ab4'],
    'Abmaj9': ['C4', 'Eb4', 'G4', 'Bb4'],
}
WALK = {
    'Fm11':  [['F2', 'G2', 'Ab2', 'Bb2'], ['C3', 'Ab2', 'F2', 'D2']],
    'Db':    [['Db2', 'Eb2', 'F2', 'Db2']],
    'C7alt': [['C2', 'Db2', 'E2', 'G2']],
}


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


def tracks():
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -16.0
    dup(T, 'felt', 'dry', sends={}, post=V.felt_post_bright, gain_db=-1.0)   # the knee's dry piano: no room, no hall
    T['dry'].pedal = [(-1.0, False)]                                           # keys held, no pedal: dry
    T['dry'].hum_ms = 0.0                                                      # the knee lands on its marks
    T['lead'].gain_db, T['lead'].sends = -3.0, {'room': -14, 'snes': -16}   # the Build leads (P11: chip ~25%)
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['lead2'].gain_db, T['lead2'].sends = -9.0, {'room': -16}                 # the chip's glints on the knee
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -9.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['cb'].gain_db, T['cb'].sends = 1.0, {'hall': -12, 'room': -16}
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    dup(T, 'cb', 'cb_out', gain_db=-5.0)                                       # the resolved F under the out
    T['vc'].gain_db, T['vc'].sends = -1.0, {'hall': -11, 'room': -16}
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]
    T['vla'].gain_db, T['vla'].sends = -3.0, {'hall': -11, 'room': -16}
    T['vln1'].gain_db = -7.0                                                  # the Build's pizzicato doubling
    T['vibes'].gain_db, T['vibes'].sends = -7.0, {'hall': -10}
    T['jazz'].gain_db = 3.0
    T['brush'].gain_db = 8.0
    T['swish'].gain_db = 2.0
    T['sub'].gain_db = -11.0
    return T


# ---------------------------------------------------------------- the lock's events (each with a fallback)
def _snd(tl, bid, name, default, k=1):
    try:
        return tl.snd(bid, name, k=k, default=default)
    except KeyError:
        return default


def _line(tl, lid, who, near):
    if lid in tl.L:
        return tl.L[lid]
    ls = [l for l in tl.lines if l['who'] == who]
    return min(ls, key=lambda l: abs(l['on'] - near)) if ls else None


def events(tl):
    e = dict(end=tl.length)
    e['bezel'] = _snd(tl, '1.02', 'mammoth_step_pixel', tl.E('1.02') - 1.0)
    e['cut03'] = tl.B('1.03')
    e['chair'] = _snd(tl, '1.04', 'palette_drip', tl.E('1.04') - 2.2)
    e['cut05'] = tl.B('1.05')
    e['freeze'] = _snd(tl, '1.05', 'freeze_hit_F', tl.B('1.05') + 1.29)
    e['cut06'] = tl.B('1.06')
    e['plate'] = _snd(tl, '1.06', 'plate_hang', tl.B('1.06') + 1.1)
    e['thud1'] = _snd(tl, '1.06', 'hand_truck_step', tl.E('1.06') - 1.0)
    e['thud2'] = _snd(tl, '1.07', 'hand_truck_step', tl.E('1.07') - 0.15)
    e['thud3'] = _snd(tl, '1.09', 'hand_truck_step', tl.B('1.09') + 0.23)
    e['doors'] = _snd(tl, '1.09', 'door_bang_open', e['thud3'] + 0.4)
    e['page'] = tl.B('1.10')
    e['tip'] = tl.B('1.11')
    e['thud4'] = _snd(tl, '1.11', 'paper_stack_fall', tl.B('1.11') + 0.15)
    e['cut12'] = tl.B('1.12')
    e['cut13'] = tl.B('1.13')
    e['orb'] = _snd(tl, '1.13', 'orb_servo', tl.B('1.13') + 0.4)
    e['flyer'] = _snd(tl, '1.11', 'paper_flutter', e['thud4'] + 0.75)
    ln = dict(sel1=_line(tl, 'e2-co-0001', 'selbeep', tl.B('1.02')), gerg1=_line(tl, 'e2-co-0002', 'gerg', tl.B('1.03')),
              sel2=_line(tl, 'e2-co-0003', 'selbeep', tl.B('1.04')), dir=_line(tl, 'e2-co-0004', 'selbeep', tl.B('1.05')),
              sel3=_line(tl, 'e2-co-0005', 'selbeep', tl.B('1.07')), gerg2=_line(tl, 'e2-co-0006', 'gerg', tl.B('1.08')))
    return e, ln


def lead_in(c, t, min_lead=0.15, swung=True):
    """the latest grid point (a beat, or its swung and) at least min_lead before t: a change that lands on a cut
    pre-laps it by about a quarter second (Ep1 v3.5's rule), on the beat or on a swung push"""
    k = math.floor((t - min_lead - c.bar1) / Q + 1e-9)
    best = None
    for kk in (k - 1, k):
        for off in ((0.0, SW) if swung else (0.0,)):
            p = c.bar1 + kk * Q + off
            if p <= t - min_lead + 1e-9 and (best is None or p > best):
                best = p
    return best


# ---------------------------------------------------------------- E02-01 THE MAMMOTH
def cue_mammoth(tl):
    e, ln = events(tl)
    end = e['end']
    n_bars = max(4, math.ceil(end / BAR - 1e-6))
    # the grid is anchored on the SMASH: the segment's last frame is a bar line (bar n_bars + 1), the intro's f0
    c = V.Cue('e02-01-the-mammoth', tl, anchor=end, anchor_bar=n_bars + 1, bars=n_bars + 3, swing=1.0)
    T = tracks()
    bar, bt = c.bar, c.bt
    rb = lambda t: int(math.floor(c.bar_of(t) + 1e-6))          # noqa: E731  the bar a time falls in

    def fch(ps, t, d, v, roll=0.014, span_end=None):
        return c.pch('felt', ps, t, d, v, roll=roll, span_end=span_end)

    def how(t, cut):
        """what a pre-lap is, in words: on a beat or on its swung and, and by how much it leads the cut"""
        k = (t - c.bar1) / Q
        kind = 'on the beat' if abs(k - round(k)) < 0.02 else 'on a swung and'
        return f'{kind}, {cut - t:.2f} s before the cut'

    def bass(p, t, d, v):
        c.n('ubass', p, t, d, v)
        c.n('cb_pizz', p, t, min(d, 0.5), v * 0.6, rel=0.16)

    def build(cell, t0, count, vel, stop_at=None, pizz=False, idx0=0):
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.012:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.006)
            p = cell[(idx0 + i) % 16]
            c.n('lead', p, t, d, vel * ACC4[i % 4], True, duty=0.25, att=0.002, dec=0.09, sus=0.45, rel=0.035)
            if pizz and i % 4 == 0:
                c.n('vln1', p, t, 0.2, 0.26, art='pizz')

    # ---- the phrase points, from the lock
    p2 = lead_in(c, e['cut03'], swung=False)        # the step-out: the latest BEAT at least 0.15 s before the cut to 1.03
    pick = p2 - Q                                   # the chip's pickup (pass 1): the beat before, as the foot breaks the bezel
    push05 = lead_in(c, e['cut05'])                 # the push into 1.05 (the punchline's shot)
    d9 = c.next_beat(push05 + 0.01)                 # the beat the push anticipates
    freeze = e['freeze']
    reentry = lead_in(c, e['cut06'])                # two weeks later: the re-entry push
    thud1, thud2, thud3, doors, thud4 = e['thud1'], e['thud2'], e['thud3'], e['doors'], e['thud4']
    k2 = lead_in(c, e['cut12'])                     # the knee: note 2 pre-laps the cut to 1.12
    k3 = lead_in(c, e['cut13'])                     # note 3 pre-laps the cut to 1.13
    k4 = lead_in(c, end)                            # note 4: a swung push into the SMASH TO INTRO
    knee = [thud4, k2, k3, k4]
    notes_off = []
    if p2 < e['cut03'] - 0.7:
        notes_off.append(f'the step-out\'s change at {p2:.3f} leads its cut ({e["cut03"]:.3f}) by more than 0.7 s')
    for i in range(1, 4):
        if knee[i] < knee[i - 1] + 0.6:
            notes_off.append(f'knee note {i + 1} at {knee[i]:.3f} crowds note {i} ({knee[i - 1]:.3f}); moved')
            knee[i] = knee[i - 1] + 0.6 if i < 3 else max(knee[i - 1] + 0.3, end - 0.25)

    # ================================================================ 1 · THE CLIP: wonder (D-flat lydian)
    bars1 = [b for b in range(max(1, rb(0.0)), rb(p2) + 1) if bar(b) < p2 - 0.3 and bar(b) + BAR > 0]
    names1 = []
    for i, b in enumerate(bars1):
        if i == len(bars1) - 1:
            names1.append('Csus')
        elif i == len(bars1) - 2:
            names1.append('EbDb')
        else:
            names1.append('Db_a' if (b - 1) % 2 == 0 else 'Db_b')
    vib_runs = []
    for i, b in enumerate(bars1):
        name = names1[i]
        felt, (r1, r3), vtop = PH1[name]
        t1 = max(bar(b), 0.0)
        fch(felt, t1 + 0.04, min(BAR - 0.1, p2 - t1 - 0.09), 0.14 if b > 1 else 0.12, roll=0.03)
        bass(r1, t1, min(2 * Q * 0.9, p2 - t1 - 0.03), 0.34 if b > 1 else 0.3)
        if bt(b, 3) < min(e['bezel'] + 0.4, p2 - 0.3):
            bass(r3, bt(b, 3), min(2 * Q * 0.85, p2 - bt(b, 3) - 0.03), 0.3)
        if vib_runs and vib_runs[-1][0] == vtop:
            vib_runs[-1][2] = min(bar(b + 1), p2)
        else:
            vib_runs.append([vtop, t1, min(bar(b + 1), p2)])
    for p, a, z in vib_runs:                        # one bowed line, too smooth for this building; ends on the bezel
        z = min(z, e['bezel'])
        if z - a > 0.4:
            c.n('vibes', p, a, z - a + 0.02, 0.2, art='bowed', att=0.6 if a <= 0.05 else 0.25, rel=0.35)
    if bars1:
        n0 = len(c.a.notes)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\nhatf[vel=0.5]: ..x...x.', bars=(bars1[0], bars1[-1] + 1), vel=0.42)
        c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if c.clk.x(nt.start) < p2 - 0.02]  # up to p2
        V.clip_before(c, p2, insts={'swish', 'brush', 'jazz'}, rel=0.1)
    c.mark(0.0, 'the clip: brushes in circles, the two-feel on D-flat, the felt\'s Dbmaj9(#11), the bowed vibes',
           hit=False)
    c.section('1 the clip: wonder (D-flat lydian: brushes, two-feel, bowed vibes; no chip yet)', 0.0, p2)

    # ================================================================ 2 · THE STEP-OUT: the chip enters, the swing walks
    build(BUILD_F, pick, 4, 0.34)
    c.mark(pick, 'the chip enters as the foot breaks the bezel: the Build compiles (pass 1: 4)')
    spans = []                                       # phrase 2 in four-beat spans from the step-out's beat
    t = p2
    while t < push05 - 0.3:
        spans.append(t)
        t += BAR
    names2 = ['C7alt' if k == len(spans) - 1 else ('Db' if k == len(spans) - 2 and k > 0 else 'Fm11')
              for k in range(len(spans))]
    fm_i = 0
    for k, s0 in enumerate(spans):
        name = names2[k]
        if name == 'Fm11':
            line = WALK['Fm11'][fm_i % 2]
            fm_i += 1
        else:
            line = WALK[name][0]
        for j, p in enumerate(line):
            tj = s0 + j * Q
            if tj >= push05 - 0.02:
                break
            bass(p, tj, Q * 0.9, 0.5 if j in (0, 2) else 0.46)
        # comping: sparse quartal Charleston (1 and the swung and-of-2), never on the beats
        v = COMP['Fm11' if name == 'Fm11' and k % 2 == 1 else ('Fm9' if name == 'Fm11' else name)]
        fch(v, s0, Q * 0.5, 0.13, roll=0.008)
        if s0 + Q + SW < push05 - 0.05:
            fch(v, s0 + Q + SW, Q * 0.7, 0.11, roll=0.008)
    n0 = len(c.a.notes)
    V.swing_ride(c.a, (rb(p2), rb(push05) + 2), vel=0.3, hat=True)
    c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if c.clk.x(nt.start) >= p2 - 0.02]   # the ride from p2
    build(BUILD_F, p2, 8, 0.34, pizz=True)
    p3 = c.next16(p2 + 8 * S16)
    sel2_on = ln['sel2']['on'] if ln['sel2'] else e['cut03'] + 2.8
    build(BUILD_F, p3, 12, 0.33, stop_at=sel2_on - 0.08, pizz=True)
    c.mark(p2, f'the step-out: F minor, {how(p2, e["cut03"])} to 1.03; the walk, the ride, the Build (pass 2: 8)')
    c.mark(p3, 'the Build (pass 3: 12), through Gerg\'s "Which sentence?"; it gives way to Selbeep')
    if spans:
        c.mark(spans[-1], 'the peak: C7(#9b13) under "It understands physics." (the chair melts: the SFX\'s three '
               'drips)', hit=False)
    c.section('2 the step-out: the chip Build compiles 4 / 8 / 12; the swing walks (F minor)', p2, push05)

    # ================================================================ 3 · THE PUNCHLINE: the push, then THE HOLD
    fch(COMP['Fm9'], push05, max(0.5, reentry - push05 - 0.1), 0.18, roll=0.01, span_end=reentry - 0.06)
    bass('F2', push05, min(0.8, d9 + Q - push05 - 0.03), 0.5)
    c.mark(push05, f'the push into 1.05: Fm9 {how(push05, e["cut05"])} (the felt\'s pedal holds it)')
    if d9 + Q < freeze - 0.3:
        bass('Ab2', d9 + Q, min(Q * 0.9, freeze - (d9 + Q) - 0.08), 0.4)
    hold_ok = reentry - freeze > 0.6
    if hold_ok:
        c.n('cb', 'F2', freeze + 0.02, reentry - freeze + 0.1, 0.2, art='sus', att=0.45, rel=0.22)
        c.mark(freeze, 'THE HOLD: the band holds on the freeze (the felt rings, the arco bass swells in on F); '
               'freeze_hit_F owns the beat', hit=False)
    c.section('3 "Directionally.", the freeze: the band holds', push05, reentry)

    # ================================================================ 4 · TWO WEEKS LATER: A-flat, the whole Build, cut off
    fch(COMP['Abmaj9'], reentry, 0.9, 0.15, roll=0.01)
    bass('Ab2', reentry, Q * 1.1, 0.42)
    c.mark(reentry, f'two weeks later: the re-entry, Abmaj9 {how(reentry, e["cut06"])} to 1.06')
    beats = []
    t = c.next_beat(reentry + Q * 0.5)
    while t < thud1 - 0.12:
        beats.append(t)
        t += Q
    walk3 = (['C3', 'Eb2', 'Ab2', 'G2', 'Gb2'] if len(beats) <= 5 else
             ['C3', 'Eb2', 'Ab2', 'Bb2', 'C3', 'Eb2'] * 4)
    walk3 = walk3[-len(beats):] if len(beats) <= 5 else (walk3[:len(beats) - 3] + ['Ab2', 'G2', 'Gb2'])
    for t, p in zip(beats, walk3):
        bass(p, t, Q * 0.9, 0.46)
    t = c.next_beat(reentry + Q)
    b = rb(t)
    while bt(b, 2) + SW < thud1 - 0.1:
        if bt(b, 2) + SW > reentry + 0.5:
            fch(COMP['Abmaj9'], bt(b, 2) + SW, Q * 0.7, 0.11, roll=0.008)
        b += 1
    b_r = rb(reentry)
    Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.\nhatf[vel=0.5]: ..x...x.', bars=(b_r, rb(thud1) + 1),
                               vel=0.46)
    t_ab = bar(rb(reentry) + 1)
    if t_ab - reentry < Q:
        t_ab += BAR
    n_ab = 0
    while t_ab < thud1 - 0.3:
        build(BUILD_AB, t_ab, 16, 0.32, stop_at=thud1 - 0.01, pizz=True)
        n_ab += 1
        t_ab += 16 * S16 + Q
    c.mark(bar(rb(reentry) + 1), 'the Build\'s WHOLE pass, in A-flat (the odometer\'s colour)')
    c.mark(thud1, 'THUD 1 (outside): the Build stops dead mid-pass; the swing thins to the bass pedal (C)', hit=False)
    c.section('4 two weeks later: A-flat, brushes, the whole Build pass, cut off by THUD 1', reentry, thud1)

    # ---- the swing's notes stop where their section ends (the hold; THUD 1)
    swing = {'ubass', 'cb_pizz', 'felt', 'lead', 'vln1', 'jazz', 'brush', 'swish', 'sub', 'vibes'}
    if hold_ok:
        V.drop_window(c, freeze - 0.07, reentry - 0.02, insts=swing - {'felt'})
        V.clip_before(c, freeze - 0.03, insts={'ubass', 'cb_pizz', 'jazz', 'brush', 'swish', 'lead'}, rel=0.12)
    V.drop_window(c, push05 + 0.02, reentry - 0.02, insts={'lead', 'vln1'})
    V.drop_window(c, thud1 - 0.02, end + 60, insts=swing)
    V.clip_before(c, thud1, insts=swing, rel=0.06)
    # the brushes' sweep starts again only at the re-entry (the drum DSL plays whole bars)
    if hold_ok:
        V.drop_window(c, freeze - 0.07, reentry - 0.02, insts={'jazz', 'brush', 'swish'})

    # ================================================================ 5 · THE PEDAL: C, through the thuds and the doors
    c.rebow('cb', 'C2', thud1, thud4 + 0.02, 0.24, seg=5.0, xf=1.0, first_att=0.55, last_rel=0.1, art='sus')
    c.rebow('vc', 'C3', thud2, thud4 + 0.02, 0.17, seg=5.0, xf=1.0, first_att=0.9, last_rel=0.1, art='trem')
    for p, v in (('G3', 0.15), ('Db4', 0.13)):
        c.rebow('vla', p, thud3, thud4 + 0.02, v, seg=6.0, xf=1.0, first_att=1.1, last_rel=0.1, art='trem')
    c.mark(thud2, 'THUD 2 (closer): the cello\'s tremolo C3 swells in over the pedal', hit=False)
    c.mark(thud3, 'THUD 3 (the top step): the viola\'s tremolo G3 + Db4 swell in (an open fifth and a flat nine)',
           hit=False)
    g2 = ln['gerg2']
    if g2 is not None:
        t = c.next16(max(g2['on'] + 0.05, thud2 + 0.3))
        for cnt in (4, 8, 12, 16):
            if t > doors - 0.35:
                break
            build(BUILD_F, t, cnt, 0.24, stop_at=doors - 0.01)
            t = c.next16(t + cnt * S16 + 0.45)
        c.mark(c.next16(max(g2['on'] + 0.05, thud2 + 0.3)), 'Gerg, not looking up: the Build compiles under his '
               'line (4, 8, then 12), soft, over the pedal')
    c.mark(doors, 'the doors blow open: the Build stops dead; the pedal holds through the doors (no hit: the SFX\'s)',
           hit=False)
    c.section('5 the bass pedal (C): THUD 1, Selbeep\'s misdirect, THUD 2, Gerg (the Build), THUD 3, the doors, '
              'page one', thud1, thud4)

    # ================================================================ 6 · THE OUT: the knee's flat line on dry piano
    regs = [['F2'], ['F3'], ['F4'], ['F5']]          # (a dry F1 under it read as an A3 resonance: its 5th partial)
    vels = [0.4, 0.36, 0.25, 0.28]                   # lighter as they climb: the intro opens on a quiet felt F5
    chip = [None, ('F4', 0.5), ('F5', 0.25), ('F6', 0.125)]
    for i, t in enumerate(knee):
        nxt = knee[i + 1] if i + 1 < 4 else end + 0.6
        for j, p in enumerate(regs[i]):
            c.n('dry', p, t, nxt - t + 0.25, vels[i])
        if chip[i]:
            p, duty = chip[i]
            c.n('lead2', p, t, 0.16 if duty > 0.2 else 0.12, (0.2, 0.13, 0.15)[i - 1], True, duty=duty, att=0.002,
                dec=0.08, sus=0.25, rel=0.12)
    c.n('sub', 'F1', thud4, 1.4, 0.3, True, punch=0.5, click=0.0, decay=1.8)
    # the pedal resolves: C -> F, a soft arco F2 that swells in after the THUD's attack and holds to the smash, so
    # the dry notes ring over a bed (the dry piano decays fast: without it the out fell to -40 LUFS-M between notes)
    c.rebow('cb_out', 'F2', thud4 + 0.1, knee[3] + 0.05, 0.17, seg=5.0, xf=1.0, first_att=1.2, last_rel=0.5,
            art='sus')                       # it lets go on the fourth note: the smash carries the knee alone
    lab = ['DESIGNED HIT: the knee\'s note 1, F2 (dry; a sub F1 under it) on the complaint\'s THUD: the pedal lets go',
           f'the knee\'s note 2: F3 (+ the chip\'s F4, duty 0.5), {how(knee[1], e["cut12"])} to 1.12',
           f'the knee\'s note 3: F4 (+ the chip\'s F5, duty 0.25), {how(knee[2], e["cut13"])} to 1.13',
           f'DESIGNED HIT: the knee\'s note 4: F5 (+ the chip\'s F6, duty 0.125: the intro\'s own glint), '
           f'{how(knee[3], end)}: the SMASH TO INTRO; cut on the smash']
    for t, l_ in zip(knee, lab):
        c.mark(t, l_)
    c.mark(end, 'the SMASH: the intro\'s first felt F5 lands on this bar line (the same 96 BPM grid)', hit=False)
    c.section('6 the out: the knee\'s flat line on dry piano, F2 -> F3 -> F4 -> F5, over the resolved F pedal, into '
              'the smash', thud4, end)

    # ---- thin under the talk (the mixer ducks it too): the lead out under Selbeep, the comping and kit softer;
    # Gerg's own lines keep the Build (his keys, not looking up)
    kept = []
    for nt in c.a.notes:
        t = c.clk.x(nt.start)
        ls = tl.lines_in(t, t + 1e-3, 0.1)
        if not ls or t >= thud1 - 0.05 or t < 0 or (nt.inst == 'lead' and pick - 0.01 <= t < p2):
            kept.append(nt)          # (the pickup starts on the last syllable of "sentence", with the foot: designed)
            continue
        gerg = all(l['who'] == 'gerg' for l in ls)
        if nt.inst in ('lead', 'vln1') and not gerg:
            continue
        f = {'felt': 0.6, 'jazz': 0.8, 'brush': 0.8, 'swish': 0.85, 'ubass': 0.9, 'cb_pizz': 0.85, 'vibes': 0.8}
        if nt.inst in f:
            nt.vel *= f[nt.inst]
        kept.append(nt)
    c.a.notes = kept
    # the push leading into "Directionally." and the punchline: the kit softer still
    if ln['dir'] is not None:
        for nt in c.a.notes:
            t = c.clk.x(nt.start)
            if ln['dir']['on'] - 0.1 <= t < freeze and nt.inst in ('jazz', 'brush', 'swish'):
                nt.vel *= 0.75

    meta = dict(
        id='e02-01-the-mammoth', title='The Mammoth (E02-01, Ep2 v1 cold open sc 1)', mm='(to picture; MM-16 kit)',
        usage='BI', family='P11 SET-PIECE SWING, low (chip lead only) -> a bass pedal -> the knee\'s flat line',
        tone='wonder (D-flat lydian) -> a walking swing with the chip Build -> the hold -> a dominant pedal under the '
             'thuds -> the knee\'s flat line into the smash',
        scenes=['Ep2 v1 cold open sc 1 (1.01-1.13)'],
        motifs=["Gerg's Build (F minor; A-flat two weeks later): compile passes 4 / 8 / 12, the whole bar, cut off",
                "the knee's flat line (F F F F, four registers, the chip's duty narrowing), into the intro's own"],
        motif_ids=[], key='D-flat lydian -> F minor (Fm11, Db(#11), C7(#9b13)) -> A-flat -> C pedal (C, G, Db) -> F; '
                          'no A-natural anywhere',
        composer='Ep2 v1 score pass (coldopen), 2026-10-09, on the e02-v1-common engine (composer X\'s helpers)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=0.0, t1=c.clk(end), sfx='server_hum (the lobby\'s rack hum)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['bezel'], 'mammoth_step_pixel: the foot through the bezel'),
            (e['chair'], 'palette_drip: the chair melts (three steps)'),
            (freeze, 'freeze_hit_F: the card (the band holds; the SFX takes the beat)'),
            (e['plate'], 'plate_hang: 86 -> 100'),
            (thud1, 'hand_truck_step: THUD 1, outside (tune to the pedal C)'),
            (thud2, 'hand_truck_step: THUD 2, closer (tune to C)'),
            (thud3, 'hand_truck_step: THUD 3, the top step (tune to C)'),
            (doors, 'door_bang_open: the doors'),
            (thud4, 'paper_stack_fall: the last THUD (the knee\'s F on it)'),
            (e['orb'], 'orb_servo: the iris onto the flyer'))],
        audition=['0-10 s: wonder, not a pad: the bowed vibes and the high felt over the two-feel; no chip until the foot '
                  'breaks the bezel',
                  '10-20 s: the Build compiling as the mammoth steps out: playful, never Nintendo, never lounge',
                  '21-23.5 s: the hold on the freeze: a held breath, not a joke sting',
                  '23.5-26.8 s: the whole Build in A-flat cut dead by THUD 1: a cut-off, not a glitch',
                  '26.8-45 s: the pedal: suspense that grows by layers, never doubling a thud',
                  '45-55 s: the knee on dry piano, each a register up, into the intro\'s own F5: one line, not two'],
        clock_notes=notes_off)
    sc = c.finish(T, meta, length_end=end, tail_s=0.5)
    c.ev = dict(e, push05=push05, reentry=reentry, p2=p2, pick=pick, knee=knee, n_bars=n_bars, n_ab_passes=n_ab)
    return c, sc


CUES = {'mammoth': cue_mammoth}


def music_runs(tl):
    """the lock's music runs: [(cue text, first beat, t0, t1)] (consecutive beats with one `music (v1): ...` string)"""
    runs = []
    for b in tl.beats:
        m = next((c.split(': ', 1)[1] for c in b['b'].get('cues', []) if c.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


def lay(tl, built, work):
    """one continuous performance: in under the clip (0.8 s), a hard stop (5 ms) on the smash"""
    c, sc = built['mammoth']
    return [dict(name=sc.name, wav=os.path.join(work, f'{sc.name}-underscore.wav'), T0=c.T0, a0=0.0, a1=tl.length,
                 fin=0.8, fout=0.005)]


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    built = {k: fn(tl) for k, fn in CUES.items()}
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s. Its music runs:')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m or "(no music string)"}')
        for k, (c, sc) in built.items():
            print(k, V.note_qa(sc), f'file T0 {c.T0:.3f}', sc.meta.get('clock_notes', ''))
            for t, lab, h in sorted(c.marks):
                print(f'   {t:8.3f} {"*" if h else " "} {lab}')
        return
    if args.render is not None:
        for k in (args.render or list(built)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out)
    c, sc = built['mammoth']
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', a0, a1) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, [])
    ev = c.ev
    res['out_momentary_max'] = V.momentary_max(mix, ev['thud4'], tl.length)
    res['last_half_second_momentary_max'] = V.momentary_max(mix, tl.length - 0.5, tl.length)
    try:
        import soundfile as sf
        xi, _ = sf.read(os.path.join(V.REPO, 'audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav'), always_2d=True)
        res['intro_first_half_second_momentary_max_at_-3dB'] = round(V.momentary_max(xi.T * V.db(-3.0), 0.0, 0.5), 2)
        res['intro_reference'] = ('audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav (read only; the Ep2 variant '
                                  'keeps V1\'s music and swaps the VO and SFX buses)')
    except Exception as ex:          # noqa: BLE001
        res['intro_reference_error'] = f'{ex.__class__.__name__}: {ex}'
    cues = [dict(cue=L['name'], start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                 family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO), laid_at_s=round(c.T0, 4),
                 level=res['cues'][L['name']], target_lufs=sc.meta.get('underscore_lufs'),
                 engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc), clock_notes=sc.meta.get('clock_notes'),
                 events={k: (round(v, 3) if isinstance(v, float) else v) for k, v in ev.items()
                         if k not in ('knee',)},
                 knee=[round(t, 3) for t in ev['knee']],
                 sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in sorted(c.marks)])
            for L in layers]
    # the sections, for the mix: the pedal is already thinned to a bass note under Selbeep and Gerg, so the mix's
    # E02-01 duck (9 dB) would leave only the room: 5 dB there (mix_episode.py reads a section's duck_db)
    sections = []
    for lab, a0, a1 in c.sections:
        row = dict(section=lab, start=round(max(0.0, a0), 3), end=round(min(tl.length, a1), 3))
        if lab.startswith('5 the bass pedal'):
            row['duck_db'] = 5.0
            row['duck_why'] = 'the pedal is the thinned bed already; a 9 dB duck under the O.S. line leaves the room alone'
        sections.append(row)
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), lock_sha1=V.lock_sha1(path), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
        level='underscore (the engine\'s -20 LUFS-I master), dry of dialogue; the mixer ducks it (E02-01: 9 dB)',
        cues=cues, silences_designed=[],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack on a story beat (the plan: '
                           'the knee\'s first note on the THUD, the fourth into the smash); keep its attack')
                      for t, lab, h in c.marks if lab.startswith('DESIGNED HIT')],
        claims_sfx=[], sections=sections, measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['hand_truck_step x3: tune to the pedal, C (C1/C2); the score never doubles them',
                      'paper_stack_fall: the knee\'s F lands on it (a dry F2 and a sub F1): leave its low end to F'],
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    for r in res['rows']:
        print(f'  {r["start"]:6.2f}-{r["end"]:6.2f} {r["lufs_i"]} LUFS-I {r["true_peak_dbtp"]} dBTP  {r["section"][:80]}')
    print('out M max', res['out_momentary_max'], 'last 0.5 s M max', res['last_half_second_momentary_max'],
          'intro first 0.5 s at -3 dB', res.get('intro_first_half_second_momentary_max_at_-3dB'))
    print('unmarked digital silence:', res['unmarked_digital_silence'], 'holes:', res['holes_below_-60'],
          'undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
