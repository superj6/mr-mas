"""MM-05 "The More You Buy" (Nesnej / INVIDIA) -- library suite, THE JOB (OST-BIBLE s5.B2, P06).  Composer B.

A sales pitch that climbs a step every bar.  Double-time swing on the 96 grid: the upright walks EIGHTHS (the
192 feel's quarters), the ride plays the double-time pattern, the swing lives on the 16ths (~61 %), and the
hits sit on 96's beats.  F dorian / F minor blues with C7#9(b13).  THE UPSELL (s2.12) on vibes + straight-mute
trumpet in unison; the close (C5 G4 F4) lands on an F-C open fifth with a bari + trombone stab; then beat 1 of
the next bar is a REST in every stem: the KA-CHING slot (the SFX bell F6 + C7 is the downbeat, on the root).

Form (28 bars = 70.0 s; bar n starts at (n-1) x 2.5 s):
  1-2    intro   walking bass, brushes (double-time taps), the chip GPU clock (12.5 % 16th arps, pp); piano in b2
  3-8    A       the Upsell: four cells a step higher each (targets G Ab Bb C) over Fm9 Bb13 Dbmaj9#11 C7#9b13;
                 the close on b7 (C5 G4 F4, the F on 7.3 with the bari + trombone open-fifth stab);
                 SLOT 1 = 8.1 (17.5 s); then the bass walks up (C Db Eb E G E -> F)
  9-14   B       sticks from b9; a vibes solo (hard mallets) over F dorian <-> C7#9, built from the Upsell's
                 stepwise climbs; the chip arpeggios rise a register every 2 bars
  15-20  B'      the mute trumpet trades 1-bar phrases with the chip: every chip answer is the trumpet's phrase
                 ONE STEP HIGHER, WITH ONE MORE NOTE (the upsell, in counterpoint)
  21-26  A'      the Upsell climbs further (targets Bb C Db Eb5), trombone + bari stabs on each target, the chip
                 doubles the line an octave up; the close on b25 (stab 25.3); SLOT 2 = 26.1 (62.5 s); the walk-up
                 back into A (the loop seam)
  27-28  tag     "sweats": the close starts (C5 G4) and STALLS on C7#9b13 -- the trumpet holds Db5, vibes
                 tremble Eb5/Ab5, the chip clock sticks on Eb/E; a short tutti hit on 28.2; SLOT 3 lands LATE,
                 on 28.3 (68.75 s).  The cue ends in the slot: on picture the bell resolves the C7 to F.
Loop: bars 3-26 (24 bars = 60.0 s = 1440 frames), seamless: A''s last bar walks back into A.

Variants (python track.py --variants -> render/variants/):
  trio     the full form without melody, brass or chip lead: piano, bass, drums and the GPU clock (the bed to
           cut under dialogue; the slots stay)
  limbo    Ep2 "the limbo under the cut line": for once the cells go DOWN (the Upsell inverted, sequenced
           downward over 8 bars), normal walking time, brushes; no sale, no slot; 8-bar loop
  cut30 / cut15 / cut05   30.0 / 15.0 / 5.0 s cut-downs, each ending in a KA-CHING slot
"""
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, '..', '..')))
from engine import *   # noqa: E402,F401,F403
from engine.core import nm, Note, stable_seed   # noqa: E402
from engine.export import build as _export_build   # noqa: E402

SW = 0.66                         # double-time swing on the 16ths: sp = 0.61 (a 192-BPM swing ratio)
LO, HI = nm('G1'), nm('F3')       # the walking register: roots C2-B2 (the theme's), the line up to F3 (double time sits light)

# ----------------------------------------------------------------------------- the bar specs (full form)
# ch: [(beat, symbol)]; mel: (text, tpt?, vibes art); sec: section; kit: drums; comp: piano pattern
BARS = {
    1: dict(sec='intro', ch=[(1, 'Fm11')], kit='brush', comp=None, arp=dict(v=0.24, low='F4', pat='up')),
    2: dict(sec='intro', ch=[(1, 'Fm11')], kit='brush', comp='sp', arp=dict(v=0.26, low='F4', pat='up')),
    3: dict(sec='A', ch=[(1, 'Fm9')], mel='C4/8 Eb4/8 F4/8 G4/2 r/8', kit='brush', comp='a3',
            arp=dict(v=0.28, low='F4', pat='updown')),
    4: dict(sec='A', ch=[(1, 'Bb13')], mel='Eb4/8 F4/8 G4/8 Ab4/2 r/8', kit='brush', comp='sp',
            arp=dict(v=0.28, low='F4', pat='updown')),
    5: dict(sec='A', ch=[(1, 'Dbmaj9#11')], mel='F4/8 G4/8 Ab4/8 Bb4/2 r/8', kit='brush', comp='a3',
            arp=dict(v=0.29, low='F4', pat='updown')),
    6: dict(sec='A', ch=[(1, 'C7#9b13')], mel='G4/8 Ab4/8 Bb4/8 C5/2 r/8', kit='brush', comp='a4',
            arp=dict(v=0.3, low='F4', pat='updown')),
    7: dict(sec='A', ch=[(1, 'C7#9b13'), (3, 'F5')], mel='C5/4 G4/4 F4/4. r/8', close=True, kit='brush',
            comp='close', arp=dict(v=0.3, low='F4', pat='updown')),
    8: dict(sec='A', ch=[(1, 'C7#9')], slot=1.0, walkup=True, kit='brush', comp=None,
            arp=dict(v=0.22, low='F4', pat='up')),
    9: dict(sec='B', ch=[(1, 'Fm11')], kit='sticks', comp='a1', arp=dict(v=0.3, low='F4', pat='updown'),
            solo='r/8 C5/16 Eb5/16 F5/16 G5/16 Ab5/8 G5/16 F5/16 Eb5/16 C5/16 D5/8 Eb5/8'),
    10: dict(sec='B', ch=[(1, 'Bb13')], kit='sticks', comp='a2', arp=dict(v=0.31, low='F4', pat='updown'),
             solo='F5/16 G5/16 Ab5/16 Bb5/16 C6/8 Ab5/8 G5/16 F5/16 D5/16 Eb5/16 F5/4'),
    11: dict(sec='B', ch=[(1, 'Fm11')], kit='sticks', comp='a4', arp=dict(v=0.32, low='Ab4', pat='updown'),
             solo='r/16 Ab5/16 G5/16 F5/16 Eb5/16 C5/16 Bb4/16 Ab4/16 G4/8 C5/8 Eb5/8 G5/8'),
    12: dict(sec='B', ch=[(1, 'C7#9')], kit='sticks', comp='a1', arp=dict(v=0.33, low='Ab4', pat='updown'),
             solo='Ab5/8 Gb5/16 E5/16 Eb5/16 Db5/16 C5/16 Bb4/16 Db5/8. E5/16 G5/8 Bb5/8'),
    13: dict(sec='B', ch=[(1, 'Dbmaj7#11')], kit='sticks', comp='a2', arp=dict(v=0.35, low='C5', pat='updown'),
             solo='C6/8 Bb5/16 Ab5/16 G5/16 F5/16 Eb5/16 F5/16 Ab5/8 C6/4.'),
    14: dict(sec='B', ch=[(1, 'C7#9b13')], kit='sticks', comp='a4', arp=dict(v=0.36, low='C5', pat='updown'),
             solo='r/8 Db6/16 C6/16 Bb5/16 Ab5/16 E5/16 Eb5/16 Db5/16 C5/16 Bb4/16 G4/16 E4/8 r/8'),
    15: dict(sec="B'", ch=[(1, 'Fm11')], kit='sticks', comp='a3', arp=dict(v=0.27, low='F4', pat='down'),
             tpt='r/8 C4/16 Eb4/16 F4/8 Ab4/8 G4/8. F4/16 Eb4/8 C4/8'),
    16: dict(sec="B'", ch=[(1, 'Bb13')], kit='sticks', comp='a2', arp=dict(v=0.2, low='F4', pat='down'),
             chip='r/8 D4/16 F4/16 G4/8 Bb4/8 Ab4/8. G4/16 F4/8 D4/16 Eb4/16'),
    17: dict(sec="B'", ch=[(1, 'Fm11')], kit='sticks', comp='a1', arp=dict(v=0.27, low='F4', pat='down'),
             tpt='Ab4/8 G4/16 F4/16 Eb4/8 F4/8 r/16 C4/16 Eb4/16 F4/16 G4/4'),
    18: dict(sec="B'", ch=[(1, 'Dbmaj7#11')], kit='sticks', comp='a4', arp=dict(v=0.2, low='F4', pat='down'),
             chip='Bb4/8 Ab4/16 G4/16 F4/8 G4/8 r/16 Db4/16 F4/16 G4/16 Ab4/8 Bb4/8'),
    19: dict(sec="B'", ch=[(1, 'Gb7#11')], kit='sticks', comp='a1', arp=dict(v=0.27, low='F4', pat='down'),
             tpt='Bb4/16 Ab4/16 Gb4/16 E4/16 Eb4/8 Db4/8 C4/8. Db4/16 Eb4/4'),
    20: dict(sec="B'", ch=[(1, 'C7#9b13')], kit='sticks', comp='a2', arp=dict(v=0.2, low='F4', pat='down'),
             chip='C5/16 Bb4/16 Ab4/16 Gb4/16 E4/8 Eb4/8 Db4/8. Eb4/16 E4/8 G4/8'),
    21: dict(sec="A'", ch=[(1, 'Fm11')], mel='F4/8 G4/8 Ab4/8 Bb4/2 r/8', kit='sticks', comp='a3',
             arp=dict(v=0.34, low='F4', pat='updown', oct=2), stab=(['Ab3', 'Eb4'], 'F2'), dbl=True),
    22: dict(sec="A'", ch=[(1, 'Dbmaj9#11')], mel='G4/8 Ab4/8 Bb4/8 C5/2 r/8', kit='sticks', comp='a4',
             arp=dict(v=0.35, low='F4', pat='updown', oct=2), stab=(['F3', 'C4'], 'Db2'), dbl=True),
    23: dict(sec="A'", ch=[(1, 'Bbm9')], mel='Ab4/8 Bb4/8 C5/8 Db5/2 r/8', kit='sticks', comp='a3',
             arp=dict(v=0.36, low='F4', pat='updown', oct=2), stab=(['Ab3', 'Db4'], 'Bb2'), dbl=True),
    24: dict(sec="A'", ch=[(1, 'C7#9b13')], mel='Bb4/8 C5/8 Db5/8 Eb5/2 r/8', kit='sticks', comp='a4',
             arp=dict(v=0.37, low='F4', pat='updown', oct=2), stab=(['E3', 'Bb3'], 'C2'), dbl=True),
    25: dict(sec="A'", ch=[(1, 'C7#9b13'), (3, 'F5')], mel='C5/4 G4/4 F4/4. r/8', close=True, kit='sticks',
             comp='close', arp=dict(v=0.34, low='F4', pat='updown')),
    26: dict(sec="A'", ch=[(1, 'C7#9')], slot=1.0, walkup=True, kit='sticks', comp=None,
             arp=dict(v=0.24, low='F4', pat='up')),
    27: dict(sec='tag', ch=[(1, 'Fm11'), (3, 'C7#9b13')], mel='C5/4 G4/4', stall=True, kit='sticks', comp='stall',
             arp=None),
    28: dict(sec='tag', ch=[(1, 'C7#9b13')], stall2=True, slot=3.0, kit=None, comp=None, arp=None),
    'end': dict(sec='end', ch=[(1, 'F5')], slot=1.0, end=True, kit=None, comp=None, arp=None),
}

FORMS = {
    'full': list(range(1, 29)),
    'trio': list(range(1, 29)),
    'cut30': [1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 27, 28],
    'cut15': [2, 3, 4, 5, 6, 7, 'end'],
    'cut05': [6, 7, 'end'],
}

# fix 1 (rule 12): the A-natural energy on the F downbeats is NOT the straight mute (the engine's F-major trace, 2026-09-26,
# puts 98-99 % of it in the bass stem).  It is a body resonance of the solo-contrabass pizz layer: F2 plays the E2 v3
# sample a semitone up, and that sample rings about 5-7 dB under its 2nd partial at ~111-113 Hz, an A2.  A narrow
# notch on the cb_pizz layer only (Q 5, -10 dB at 112 Hz) takes it down ~9 dB; the bass stem's level moves 0.06 dB and
# the upright (the walking line's body) is untouched.  No A-natural is written anywhere in the cue.
CB_NOTCH = [('peq', 112.0, -10.0, 5.0)]

# the bass WALK's scales.  Over F minor it takes Db, not the dorian D: a bass D2's 3rd partial is an A (s6.9)
SCALE_IVS = {'dorian': [0, 2, 3, 5, 7, 8, 10], 'mixo': [0, 2, 4, 5, 7, 9, 10], 'lydian': [0, 2, 4, 6, 7, 9, 11],
             'alt': [0, 1, 3, 4, 7, 8, 10], 'lyddom': [0, 2, 4, 6, 7, 9, 10], 'fifth': [0, 2, 3, 5, 7, 8, 10]}
SCALE_OF = {'Fm11': 'dorian', 'Fm9': 'dorian', 'Fm13': 'dorian', 'Bb13': 'mixo', 'Bb9': 'mixo',
            'Dbmaj9#11': 'lydian', 'Dbmaj7#11': 'lydian', 'Dbmaj9': 'lydian', 'C7#9b13': 'alt', 'C7#9': 'alt',
            'Bbm9': 'dorian', 'Gb7#11': 'lyddom', 'F5': 'fifth', 'Abmaj9': 'lydian', 'Ebmaj9': 'lydian'}

SHAPES = [[0, 2, 4, 6, 7, 6, 4], [0, 1, 2, 4, 3, 2, 1], [0, -1, -3, -5, -4, -3, -1], [0, 2, 1, 3, 2, 4, 5],
          [0, 4, 2, 4, 5, 4, 2], [0, -2, -1, -3, -2, 1, 2]]

COMP = {   # double-time comping (beats; .25/.75 are swung 16ths)
    'a1': [(1.0, 0.35, 1.0), (2.75, 0.25, 0.85), (4.25, 0.4, 0.9)],
    'a2': [(1.5, 0.3, 0.9), (3.0, 0.35, 1.0), (4.75, 0.25, 0.85)],
    'a3': [(1.0, 0.9, 0.9), (3.5, 0.3, 0.85)],
    'a4': [(2.25, 0.25, 0.9), (3.75, 0.25, 0.85), (4.5, 0.4, 0.95)],
    'sp': [(1.0, 1.6, 0.85)],
}


def _at(bar, beat):
    """(bar, beat) with 16th-off positions marked swung."""
    f = (beat - 1.0) * 4.0
    return (bar, beat, 'sw') if abs(f - round(f)) < 1e-6 and int(round(f)) % 2 == 1 else (bar, beat)


def _chord(spec, beat):
    cur = spec['ch'][0][1]
    for b, s in spec['ch']:
        if beat >= b - 1e-6:
            cur = s
    return cur


def _scale_pitches(sym):
    c = parse(sym)
    ivs = SCALE_IVS[SCALE_OF.get(sym, 'dorian')]
    return c.root, sorted({p for p in range(LO - 12, HI + 13) if (p - c.root) % 12 in ivs})


def walk_bar(a, bar, sym, next_sym, prev, shape_i, vel=0.7, notes=None):
    """Eight walking eighths through one chord (the 192 feel's quarters), approaching the next root."""
    root, sc = _scale_pitches(sym)
    if notes is None:
        cands = [p for p in sc if p % 12 == root and LO <= p <= HI - 5]
        r = min(cands, key=lambda p: abs(p - prev)) if prev else cands[0]
        i0 = sc.index(r)
        shape = SHAPES[shape_i % len(SHAPES)]
        seq = [sc[i0 + k] for k in shape]
        if max(seq) > HI or min(seq) < LO:
            seq = [sc[i0 - k] for k in shape]
        seq = [p + 12 if p < LO else p - 12 if p > HI else p for p in seq]
        nr_pc = parse(next_sym).root
        tgt = min((p for p in range(LO, HI + 1) if p % 12 == nr_pc), key=lambda p: abs(p - seq[-1]))
        h = stable_seed('mm05-walk', bar) % 10
        if h < 6:
            app = tgt + (1 if seq[-1] > tgt else -1)
        else:
            app = tgt + 7 if tgt + 7 <= HI else tgt - 5
        seq.append(int(np.clip(app, LO, HI)))
        notes = [(p, 1.0 + 0.5 * i) for i, p in enumerate(seq)]
    last = prev
    for it in notes:
        p, bt = it[0], it[1]
        d = it[2] if len(it) > 2 else 0.46
        v = vel * (1.0 if (bt - 1.0) % 1.0 < 1e-6 else 0.9)
        a.n('ubass', p, (bar, bt), g_beats(a, bar, bt, d), v)
        a.n('cb_pizz', p, (bar, bt), g_beats(a, bar, bt, d * 0.8), 0.5 * v / 0.7, rel=0.16)
        last = nm(p)
    return last


def g_beats(a, bar, bt, d):
    return a.g.beats_s(d, a.g.t(bar, bt))


def comp_bar(a, bar, spec, next_spec, pat, around, vel, flip):
    for bt, dur, vm in COMP[pat]:
        sym = _chord(next_spec, 1.0) if (bt >= 4.5 and next_spec and not next_spec.get('slot') == 1.0) else \
            _chord(spec, bt)
        if bt >= 4.5 and next_spec and next_spec.get('slot') == 1.0:
            continue
        v = voice(sym, 'rootless_b' if flip else 'rootless_a', around=around)
        a.ch('grand', v, _at(bar, bt), g_beats(a, bar, bt, dur), vel * vm, roll=0.005)


def drums_bar(a, bar, kit, section, variant):
    if kit == 'brush':
        Drums(a, 'brushes').play('''
            sweep: ~~~~~~~~~~~~~~~~
            tap[vel=0.8]:  x.Xgx.Xgx.Xgx.Xg
            kick[vel=0.5]: o.......o.......
            hatf:  ....x.......x...
        ''', bars=(bar, bar + 1))
    elif kit == 'sticks':
        sn = ['.......g.....x..', '...g.......g..x.', '.....x.......g..', '.g.....x...g....',
              '...........g.x.x', '..g.....g.....x.'][variant % 6]
        hot = section in ("A'",)
        Drums(a, 'jazz').play(f'''
            ride[vel={0.62 if hot else 0.55}]: x.Xox.Xox.Xox.Xo
            hatf[vel=0.7]: ..x...x...x...x.
            kick[vel={0.32 if hot else 0.26}]:  o...o...o...o...
            snare[vel={0.5 if hot else 0.42}]: {sn}
        ''', bars=(bar, bar + 1))


def upsell(a, bar, text, v_tpt=0.56, v_vib=0.5, tpt=True, vib=True, tpt_text=None):
    out = []
    if tpt:
        out += a.line('tpt', tpt_text or text, (bar, 1), vel=v_tpt, swing=True, art='straight', rel=0.12)
    if vib:
        out += a.line('vibes', text, (bar, 1), vel=v_vib, swing=True, rel=0.6)
    return out


def clear_slot(a, t0, t1):
    """Beat `t0..t1` is the KA-CHING's: no note starts in it, and nothing held rings into it."""
    keep = []
    for n in a.notes:
        if t0 - 0.002 <= n.start < t1 - 0.002:
            continue
        if n.start < t0 and n.start + n.dur > t0 - 0.03:
            n.dur = max(0.03, t0 - 0.03 - n.start)
            n.x['rel'] = min(n.x.get('rel', 0.3), 0.12)
        keep.append(n)
    a.notes = keep


def compose(form='full'):
    order = FORMS[form]
    nb = len(order)
    g = Grid(bpm=96, meter='4/4', bars=nb, swing=SW, swing_unit=0.25)
    a = Arr(g)
    T = palette()
    # ---- per-cue mix
    T['ubass'].gain_db = -2.0
    T['cb_pizz'].gain_db = -10
    T['cb_pizz'].eq = T['cb_pizz'].eq + CB_NOTCH
    T['grand'].gain_db = 0.5
    T['grand'].sends = {'room': -12, 'hall': -18}
    T['vibes'].gain_db = -3.0
    T['vibes'].sends = {'room': -12, 'hall': -14}
    T['tpt'].gain_db = -3
    T['tpt'].sends = {'room': -10, 'hall': -14}
    T['tpt'].latency_ms = 12
    # the straight mute's fixed resonance sits near 1.75 kHz (an A6, whatever the note) and its nasal band near
    # 3 kHz: notch the first (the F-major chroma read it as a third), dip the second (dialogue)
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['tbn'].gain_db = -1
    T['bsax'].gain_db = -1
    T['arp'].gain_db = 8
    T['arp'].sends = {'snes': -16, 'room': -16}
    T['arp'].eq = [('lp', 5000), ('hs', 2200, -7.0)]   # the GPU clock: present, but out of the voice band
    T['lead'].gain_db = -1
    T['lead'].eq = [('lp', 5500), ('hs', 2400, -5.0)]
    T['jazz'].gain_db = 13
    T['jazz'].eq = [('peq', 3800, -4.0, 0.7)]
    T['brush'].gain_db = 13
    T['swish'].gain_db = 6
    specs = [BARS[k] for k in order]
    prev_bass = nm('F2')
    solo_bars = [i for i, s in enumerate(specs) if s.get('solo')]
    slots = []
    for i, spec in enumerate(specs):
        bar = i + 1
        nxt = specs[i + 1] if i + 1 < nb else specs[0]
        sec = spec['sec']
        # ---------------------------------------------------------------- bass
        if spec.get('end'):
            pass
        elif spec.get('walkup'):
            prev_bass = walk_bar(a, bar, 'C7#9', 'Fm11', prev_bass, 0, vel=0.72,
                                 notes=[('C2', 2.0), ('Db2', 2.5), ('Eb2', 3.0), ('E2', 3.5), ('G2', 4.0),
                                        ('E2', 4.5)])
        elif spec.get('close'):
            prev_bass = walk_bar(a, bar, 'C7#9b13', 'F5', prev_bass, 0, vel=0.72,
                                 notes=[('C2', 1.0), ('E2', 1.5), ('G2', 2.0), ('E2', 2.5), ('F2', 3.0, 1.4)])
        elif spec.get('stall'):
            prev_bass = walk_bar(a, bar, 'C7#9b13', 'C7#9b13', prev_bass, 0, vel=0.72,
                                 notes=[('F2', 1.0), ('Ab2', 1.5), ('G2', 2.0), ('Db2', 2.5), ('C2', 3.0),
                                        ('C3', 3.5), ('C2', 4.0), ('C2', 4.5)])
        elif spec.get('stall2'):
            prev_bass = walk_bar(a, bar, 'C7#9b13', 'C7#9b13', prev_bass, 0, vel=0.74,
                                 notes=[('C2', 1.0), ('C3', 1.5), ('C2', 2.0, 0.2)])
        else:
            prev_bass = walk_bar(a, bar, _chord(spec, 1.0), _chord(nxt, 1.0), prev_bass, i + (3 if sec == 'B' else 0),
                                 vel=0.7 if sec != 'intro' else 0.66)
        # ---------------------------------------------------------------- drums
        if spec.get('kit'):
            drums_bar(a, bar, spec['kit'], sec, i)
        if spec.get('walkup'):                       # a short snare pickup into the next section
            Drums(a, 'jazz').play('snare[vel=0.5]: ............g.xX', bars=(bar, bar + 1))
        # ---------------------------------------------------------------- piano
        if spec.get('comp') == 'close':
            a.ch('grand', voice('C7#9b13', 'rootless_a', around='A3'), (bar, 1), '1b', 0.42, roll=0.005)
            a.ch('grand', ['F3', 'C4', 'F4'], (bar, 3), '1.4b', 0.46, roll=0.004)
        elif spec.get('comp') == 'stall':
            a.ch('grand', voice('Fm11', 'rootless_a', around='A3'), (bar, 1), '1b', 0.4, roll=0.005)
            for bt in (3.0, 3.75, 4.5):
                a.ch('grand', voice('C7#9b13', 'rootless_a', around='A3'), _at(bar, bt), '0.3b', 0.44, roll=0.004)
        elif spec.get('stall2'):
            a.ch('grand', voice('C7#9b13', 'rootless_a', around='A3'), (bar, 1.25, 'sw'), '0.3b', 0.46, roll=0.004)
            a.ch('grand', ['C2', 'C3'] + voice('C7#9b13', 'rootless_a', around='A3'), (bar, 2), '0.25b', 0.42,
                 roll=0.003)
        elif spec.get('comp'):
            around = 'G3' if sec in ('A', "A'") else 'Bb3'
            comp_bar(a, bar, spec, nxt, spec['comp'], around, 0.44 if sec != 'intro' else 0.36, i % 2 == 1)
        # ---------------------------------------------------------------- melody
        if spec.get('mel'):
            # the close: vibes play the Upsell's close note for note (C5 G4 F4); the mute trumpet lands on the
            # fifth (C5), so the close IS the open fifth F-C (and the straight mute's strong 5th partial on an F4
            # -- an A6 -- stays out of the no-third window)
            upsell(a, bar, spec['mel'], tpt_text='C5/4 G4/4 C5/4. r/8' if spec.get('close') else None)
            if spec.get('dbl'):                    # A': the chip doubles the climb an octave up (the gadget line)
                a.line('lead', spec['mel'], (bar, 1), vel=0.34, swing=True, transpose=12, duty=0.125, rel=0.05,
                       dec=0.15, sus=0.55)
        if spec.get('solo'):
            a.line('vibes', spec['solo'], (bar, 1), vel=0.56 if i != solo_bars[0] else 0.52, swing=True, art='hard',
                   rel=0.35)
        if spec.get('tpt'):
            a.line('tpt', spec['tpt'], (bar, 1), vel=0.58, swing=True, art='straight', rel=0.12)
        if spec.get('chip'):                         # the answer: one step higher, one more note (octave up)
            a.line('lead', spec['chip'], (bar, 1), vel=0.48, swing=True, transpose=12, duty=0.25, rel=0.05,
                   dec=0.12, sus=0.6)
        # ---------------------------------------------------------------- brass accents
        if spec.get('close'):
            art.stab(a, 'bsax', ['F2'], (bar, 3), vel=0.72, length=0.34, art=None)
            art.stab(a, 'tbn', ['C3'], (bar, 3), vel=0.66, length=0.3)
            a.mark(f'b{bar}.3 the close: F-C stab', (bar, 3))
        if spec.get('stab'):
            tb, bs = spec['stab']
            art.stab(a, 'tbn', tb, (bar, 2.5), vel=0.52, length=0.22)
            art.stab(a, 'bsax', [bs], (bar, 2.5), vel=0.56, length=0.24, art=None)
        # ---------------------------------------------------------------- the tag's stall ("sweats")
        if spec.get('stall'):
            art.swell(a, 'tpt', ['Db5'], (bar, 3), g.dur('3b', (bar, 3)), 'pp', 'mf', art='straight', shape='exp')
            art.swell(a, 'tbn', ['E3', 'Bb3'], (bar, 3), g.dur('3b', (bar, 3)), 'pp', 'mp', shape='exp')
            art.swell(a, 'bsax', ['C2'], (bar, 3), g.dur('3b', (bar, 3)), 'pp', 'mp', shape='exp')
            for k in range(12):                      # vibes tremble on the #9 and b13 (to the last hit, 3 beats)
                q = 2.0 + 0.25 * k
                a.n('vibes', 'Eb5' if k % 2 == 0 else 'Ab5', _at(bar + int(q // 4), 1 + q % 4), '1/16',
                    0.34 + 0.012 * k, art='hard', rel=0.2)
            for k in range(12):                      # the GPU clock sticks: Eb / E (minor or major? unclear)
                q = 2.0 + 0.25 * k
                a.n('arp', 'Eb5' if k % 2 == 0 else 'E5', _at(bar + int(q // 4), 1 + q % 4), '1/16', 0.3 + 0.01 * k,
                    duty=0.125, rel=0.02, sus=0.4, dec=0.05)
            a.mark(f'b{bar}.3 the stall (C7#9b13)', (bar, 3))
        if spec.get('stall2'):
            art.stab(a, 'tbn', ['E3', 'Bb3'], (bar, 2), vel=0.7, length=0.16)
            art.stab(a, 'bsax', ['C2'], (bar, 2), vel=0.74, length=0.18, art=None)
            art.stab(a, 'tpt', ['Db5'], (bar, 2), vel=0.7, length=0.14, art='straight')
            Drums(a, 'jazz').play('ride[vel=0.6]: x.Xo............\nhatf[vel=0.7]: ..x.............\n'
                                  'kick[vel=0.55]: ....x...........\nsnare[vel=0.45]: ....x...........',
                                  bars=(bar, bar + 1))
            a.mark(f'b{bar}.2 the last hit', (bar, 2))
        # ---------------------------------------------------------------- the GPU clock
        if spec.get('arp'):
            ar = spec['arp']
            prog = progression(g, [((bar, b), s) for b, s in spec['ch']], end=g.t(bar + 1))
            arp(a, 'arp', None, bars=(bar, bar + 1), rate=0.25, pattern=ar['pat'], octaves=ar.get('oct', 1),
                low=ar['low'], vel=ar['v'], follow=prog, accent=(1.0, 0.62, 0.8, 0.66), duty=0.125, rel=0.02,
                sus=0.4, dec=0.05, seed=bar)
        if spec.get('slot'):
            slots.append((bar, spec['slot']))
    # chip register: nothing above Eb6 (the KA-CHING owns F6 + C7; the GLYPH grains G6-F7)
    for n in a.notes:
        if T[n.inst].stem == 'chip':
            while n.pitch > nm('Eb6'):
                n.pitch -= 12
    # ---- the slots: a 1-beat rest in every stem
    for bar, bt in slots:
        t0 = g.t(bar, bt)
        clear_slot(a, t0, g.t(bar, bt + 1))
        # the GPU clock stops one beat before the sale: its 16ths (and their sample-chip echo) leave the bell room
        tb = t0 - g.beats_s(1, t0 - 0.7)
        a.notes = [n for n in a.notes if not (n.inst == 'arp' and tb - 0.002 <= n.start < t0)]
    if form == 'trio':
        a.notes = [n for n in a.notes if n.inst not in ('vibes', 'tpt', 'tbn', 'bsax', 'lead')]
    # ---- sections + marks (intensity: 1 low, 2 mid, 3 high)
    inten = {'intro': 1, 'A': 2, 'B': 3, "B'": 2, "A'": 3, 'tag': 3, 'end': 1}
    run = None
    for i, spec in enumerate(specs + [dict(sec=None)]):
        if run and spec['sec'] != run[0]:
            a.section(f"{run[0]} (intensity {inten[run[0]]})", run[1], i + 1)
            run = None
        if run is None and spec['sec']:
            run = (spec['sec'], i + 1)
            if spec['sec'] not in ('end',):
                a.mark(f"b{i + 1}.1 {spec['sec']}", (i + 1, 1))
    # ---- the dynamic arc (a fader ride on every stem, stepped on downbeats; it returns to 0 dB on A''s slot so
    # the loop seam 26 -> 3 has no level step)
    ride = {'intro': -2.5, 'A': 0.0, 'B': 0.5, "B'": -0.5, "A'": 1.5, 'tag': 1.0, 'end': 0.0}
    macro, cur = [], None
    for i, spec in enumerate(specs):
        bar = i + 1
        lv = ride[spec['sec']]
        if spec.get('walkup'):
            lv = 0.0
        if lv != cur:
            t = g.t(bar)
            macro += ([(t - 0.004, cur)] if cur is not None else []) + [(t, lv)]
            cur = lv
    a._macro = macro
    end = g.t(nb) if specs[-1].get('end') else None
    if specs[-1].get('end'):
        end = g.t(nb, 2)
    elif order[-1] == 28:
        end = g.t(nb + 1)
    return g, a, T, slots, end


def _meta_common():
    return dict(
        mm='MM-05', family='P06 THE JOB', usage='BI',
        tags=['nesnej', 'invidia', 'the job', 'upsell', 'deal', 'double-time swing', 'ka-ching slots', 'library'],
        motifs=['THE UPSELL (vibes + straight-mute trumpet in unison): cells a step higher each, the close C5 G4 F4',
                'the KA-CHING slots (the SFX bell is the downbeat)', 'the GPU clock (12.5 % chip 16th arpeggios)',
                "B': the chip answers each trumpet phrase one step higher with one more note"],
        key='F dorian / F minor blues, C7#9(b13); the close on an F-C open fifth (no third)',
        composer='Composer B (OST batch 1; fix 1: composer A)',
        version='1.1 (fix 1, 2026-09-26)',
        description='Fix 1 (2026-09-26): the A-natural on the F downbeats is traced (engine F-major check) to a body '
                    'resonance of the cb_pizz layer at ~112 Hz (its F2 is the E2 v3 sample a semitone up), not '
                    'the straight mute; a narrow notch on that layer only (Q 5, -10 dB at 112 Hz); the limbo\'s '
                    'chroma wrapper is removed; re-rendered on the fixed engine.',
    )


META = dict(
    _meta_common(),
    id='mm05-the-more-you-buy',
    title='The More You Buy (Nesnej)',
    tone='a sales pitch that climbs a step every bar and always closes: double-time swing, vibes and a '
         'straight mute over a walking bass, the chip as the GPU clock -- and a rest where the register rings',
    scenes=['Ep1 sc 17 rooftop (9:33): lead-in to the register bell, clear of the statement\'s quote box and of '
            'his real line', 'Nesnej / INVIDIA scenes, deals, draft trades (Eps 2-12)', 'Ep2: the limbo variant',
            'Ep9: $5B at Alyi\'s door (the slot on the Door\'s G)'],
    motif_ids=['UPSELL'],
    album_loops=1,
    audition=[
        '0:17.5, 1:02.5 and 1:08.75 (the three slots, 8.1 / 26.1 / 28.3): with the KA-CHING laid in '
        '(render/extras/*-kaching-check.mp3) -- does the sale CLOSE, or does it sound like a dropout?',
        '0:00-0:20: does double-time swing on the 96 grid SIT (a brisk 192 feel), rather than lurch? The Upsell '
        'eighths are the 192 quarters (straight); only the 16ths swing',
        '0:15.0-0:17.5: the close (C5 G4 F4) and the bari + trombone open-fifth stab at 16.25 s -- an accent, '
        'not a big-band hit; no Pink Panther, no lounge',
        '0:35.0-0:50.0 (B\'): the chip answering the trumpet a step higher with one more note -- witty, not '
        'cute; nothing Nintendo',
        '1:05.0-1:10.0 (tag): the stall on C7 (trumpet Db5 swell, vibes and chip trembling) and the late slot '
        'at 1:08.75 -- sweat, not slapstick',
        'the loop-x3 preview at 57.5 s and 115.0 s: A\'s walk-up back into A must not click or dip',
        'FIX 1: the contrabass-pizz layer is notched at 112 Hz (its F2 rang an A2 body resonance): on the F '
        'downbeats (e.g. 10.625 s, 65.0 s) does the walk still sound woody and full, and does anything sound major?',
    ],
)


def build(form='full'):
    g, a, T, slots, end = compose(form)
    meta = dict(META)
    meta['sfx_slots'] = [dict(t=f'{b}:{int(bt)}', bar=b, beat=bt, sec=round(g.t(b, bt), 6),
                              frame=round(g.t(b, bt) * 24, 3), sample=int(round(g.t(b, bt) * 48000)),
                              sfx='ka_ching (F6 + C7, the bell ~+55 ms after the latch)',
                              note='the SFX file starts at the slot; the music rests this whole beat')
                         for b, bt in slots]
    closes = [i + 1 for i, k in enumerate(FORMS[form]) if BARS[k].get('close')]
    meta['no_third_windows'] = [((b, 3.05), (b, 4.9)) for b in closes]
    loop = g.span(3, 27) if form in ('full', 'trio') else None
    return Score(meta['id'], g, T, a.notes, loop=loop, markers=a.markers, sections=a.sections, meta=meta,
                 length_s=end, tail_s=3.0, macro=a._macro)


# ============================================================================ the limbo (Ep2): the cells go down
LIMBO = [  # (chord, the inverted cell: -2, -1, -1 scale steps, each bar a step lower)
    ('Fm13', 'G5/8 Eb5/8 D5/8 C5/2 r/8'),
    ('Bb9', 'F5/8 D5/8 C5/8 Bb4/2 r/8'),
    ('Abmaj9', 'Eb5/8 C5/8 Bb4/8 Ab4/2 r/8'),
    ('C7#9b13', 'Db5/8 Bb4/8 Ab4/8 G4/2 r/8'),
    ('Fm9', 'C5/8 Ab4/8 G4/8 F4/2 r/8'),
    ('Ebmaj9', 'Bb4/8 G4/8 F4/8 Eb4/2 r/8'),
    ('Dbmaj9', 'Ab4/8 F4/8 Eb4/8 Db4/2 r/8'),
    ('C7#9b13', 'G4/8 Eb4/8 Db4/8 C4/2 r/8'),
]


def build_limbo():
    g = Grid(bpm=96, meter='4/4', bars=8, swing=1.0)
    a = Arr(g)
    T = palette()
    T['grand'].gain_db = 1.5
    T['vibes'].gain_db = -3.5
    T['tpt'].gain_db = -6
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['bsax'].gain_db = -3
    T['arp'].gain_db = 6
    T['arp'].eq = [('lp', 5000), ('hs', 2200, -7.0)]
    T['arp'].sends = {'snes': -14, 'room': -16}
    T['brush'].gain_db = 10
    T['swish'].gain_db = 4
    T['cb_pizz'].eq = T['cb_pizz'].eq + CB_NOTCH         # fix 1: the same A2 body resonance (see CB_NOTCH)
    prog = progression(g, [(i + 1, c) for i, (c, _) in enumerate(LIMBO)])
    walking_bass(a, 'ubass', prog, bars=(1, 9), layer='cb_pizz', vel=0.66, seed=5)
    comp(a, 'grand', prog, style='charleston', kind='rootless_a', around='Bb3', vel=0.36)
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap[vel=0.7]: ..x...x.
        kick[vel=0.4]: o.......
        hatf: ..x...x.
    ''', bars=(1, 9))
    for i, (c, cell) in enumerate(LIMBO):
        bar = i + 1
        a.line('vibes', cell, (bar, 1), vel=0.46, swing=True, rel=0.9)
        if i < 4:                                    # the mute trumpet goes down with it, then gives up
            a.line('tpt', cell, (bar, 1), vel=0.46 - 0.04 * i, swing=True, art='straight', rel=0.12)
        else:                                        # ... the bari takes the descent under the cut line
            a.line('bsax', cell, (bar, 1), vel=0.44, swing=True, transpose=-12)
        arp(a, 'arp', None, bars=(bar, bar + 1), rate=0.5, pattern='down', low='F4', vel=0.26, follow=prog,
            duty=0.125, rel=0.02, sus=0.35, dec=0.05, seed=bar)
    a.section('limbo (loop, intensity 1)', 1, 9)
    a.mark('b1.1 limbo', (1, 1))
    meta = dict(_meta_common(), id='mm05-the-more-you-buy-limbo', title='The More You Buy: Limbo (Ep2)',
                tone='the upsell deflated: for once the cells go down, a step lower every bar; no sale, no slot',
                scenes=['Ep2: the limbo under the cut line'], motif_ids=[], album_loops=2,
                audition=['the loop seam at 20.0 s in the x3 preview: C7 falls back up into Fm13 without a '
                          'bump', 'does it read as the SAME tune going the wrong way (a joke only if you know '
                          'it), not as a sad version?'])
    return Score(meta['id'], g, T, a.notes, loop=g.span(1, 9), markers=a.markers, sections=a.sections, meta=meta,
                 tail_s=3.0)


def build_variants(argv):
    vdir = os.path.join(HERE, 'render', 'variants')
    stems = '--stems' in argv
    only = next((x.split('=', 1)[1].split(',') for x in argv if x.startswith('--only=')), None)
    # (the old _robust_chroma() wrapper is gone: the engine's fix 3 made chroma(sieve=True) NaN-safe)
    for form, title, tone in [
            ('trio', 'The More You Buy: Trio (bed)', 'the full form without melody, brass or chip lead: piano, '
             'bass, drums and the GPU clock -- the bed to cut under dialogue'),
            ('cut30', 'The More You Buy: 30 s', 'intro, the Upsell and slot 1, two trade bars, the stall and '
             'the late slot'),
            ('cut15', 'The More You Buy: 15 s', 'the four cells and the close, ending in the slot'),
            ('cut05', 'The More You Buy: 5 s', 'the last cell and the close, ending in the slot')]:
        if only and form not in only:
            continue
        sc = build(form)
        sc.meta['id'] = f'mm05-the-more-you-buy-{form}'
        sc.name = sc.meta['id']
        sc.meta['title'] = title
        sc.meta['tone'] = tone
        sc.meta['audition'] = ['as the full cue; check the ending slot lands exactly at the cue end']
        if form in ('trio', 'cut05'):
            sc.meta['motif_ids'] = []          # the trio has no melody; the 5 s cut has one cell + the close
        if form in ('cut15', 'cut05'):
            sc.meta['underscore_lufs'] = -16.0  # buttons into the bell: FEATURED, not a bed under dialogue
        _export_build(sc, vdir, sc.meta['id'], stems=stems, loop=form == 'trio', previews=True)
    if not only or 'limbo' in only:
        sc = build_limbo()
        _export_build(sc, vdir, sc.meta['id'], stems=stems, loop=True, previews=True)


if __name__ == '__main__':
    if '--variants' in sys.argv:
        sys.argv.remove('--variants')
        build_variants(sys.argv)
        sys.exit(0)
    render_cli(build, __file__)
