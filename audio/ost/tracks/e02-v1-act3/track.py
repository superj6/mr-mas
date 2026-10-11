#!/usr/bin/env python3
"""E02 v1 · ACT THREE "leave them up" (sc 13-17) · the segment's score, laid on the segment's own clock (0 = its first frame).
Three cues in three renders: E02-08 WHERE'S ALYI? (THE CLOCK, first step) · E02-09 FEEL IT (the dark room, F2.2, the felt
again) · E02-10 THE BRIDGE (the S3: the episode's one full-band stretch, the scramble, the night, the posts, the rain,
the DREAD out), plus render/music-el-prelap.wav: THE CLOCK's first tick under Act Two's black.

The brief (manifest.md §6 E02-08, E02-09, E02-10; proposal.md sc 13-17, "The feeling curve" and "The seams" 15-20;
script-v1.md's MUSIC lines; the beat plan's J and L cuts; the lock's music runs).  The mood map: a wry, sad beat, then a
dry laugh (13); playful, then lonely, with a chill (14); loneliness, then warmth and joy, gravity, resolve and dread
(F2.2), a determined evening (15); the big comic set-piece, respect, frantic hands and the relief of hearing him act, a
laugh at the forecast, pathos (17).  README.md has the cue sheet (seconds, cue, what plays, why) and the measurements.

  s (EL lock)       cue                    what plays
  -0.63 -  91.0     E02-08 THE CLOCK       a pizzicato and woodblock tick on varied pitches, one a beat (the first step:
                                           quarters), straight, its grid locked to the pivot's creak (the clock stops
                                           dead on it; until the fixes pass, 2026-10-10, to the four screws of 14.11, cut
                                           from the act); its first tick a beat into Act Two's black (the prelap file);
                                           an F pedal, sul tasto;
                                           the knee's rising F G A-flat C as the clarinet's held dyads, one step a story
                                           beat (the staffers; "leave them up."; the walk-off; C on the threshold, the
                                           band lit); the presser a tiny bed; the chip's irregular seconds.  The open
                                           floor adds the cello's pizzicato eighths (playful); THE DOOR, its first note
                                           missing, blooms once on his own reflection (D-flat under it); the chair's hum
                                           is the GPU choir (D-flat sus2(#11)), diegetic into score (claimed
                                           chair_hum_choir); Ekiel: spiccato (the chill), then the pedal alone under his
                                           post; the domino at his shoe: the ticks again over the Ache; the clock stops
                                           dead on the pivot's creak; the hum swells, rings 1.0 s over the cut, stops
  91.0  - 189.9     E02-09 FEEL IT         the felt (his interior) on the hum's stop: D-flat, B-flat minor under the
                                           thread, F minor before the count (V.O. 7), A-flat for TPOOL (the chip, his
                                           past), G-flat lydian under the old map; the choir swells in on the pin's ripple.
                                           F2.2 (no felt, no chip pulse, no swing: his POV is left): the GPU choir and glass
                                           shimmer, ppp, the string lights as a cycling celesta and harp; the chant's lift
                                           (two more voices, the lights an octave up; no melody on the record); thin under
                                           the exchange; THE DOOR whole over the check-in; the racks' hum and GLYPH's grains;
                                           the choir thins to its no-third chord under the post and "Someone should."; THE
                                           DOOR again, its held #4 under the Publish click; the Ache under the fire; the
                                           felt returns a beat before the pin (F), V.O. 8 inside it; D-flat as he goes (the
                                           leap A-flat C); the pedal on the stairs; the buzz is the out
  189.8 - 320.0     E02-10 THE BRIDGE      SET-PIECE SWING: a swung push into the doors, the walk and the Build compiling;
                                           THE FULL BAND for the run across the lanes (two bars and a pickup, the Build in
                                           octaves with the violins, the peak on C7(#9b13)), cut off as the traffic stops;
                                           a C pedal through the card; a two-feel under the Forecaster; the horns'
                                           respect after "Already did."; the scramble: the bass in eighths and the Build,
                                           out under his call and V.O. 9; the swing again under the forecast; a held
                                           chord under V.O. 10; one held chord through the night (2 s); the bass pedal
                                           under the posts (the honks take the phrase ends); a pad in the rain, five
                                           voices, the fifth (VOICE 5) stopping on his pause tap; the pedal; the DREAD
                                           sting on the blimp's last light (claimed dread_sting), its air into the black

Every sync point comes from the lock (beats, lines, sounds, on-screen items) and the plan's J and L cuts, so the score
re-lays itself when timing moves.  Chord changes that land on cuts pre-lap them by the latest grid point at least 0.15 s
before the cut (about 0.25 s); no change lands inside a V.O., a line of his, a real line or the record on screen.  The
record plays dry (OST rule 10): no melody and no change under posts (kind `post`), the presser's lower third and the
[V] chant (its lift is texture, the plan's call).

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0): the 96 BPM grid; the knee's cells; chip in every cue; no
A-natural anywhere; the knee never whole; swung for people, straight for THE CLOCK, the machine and the record; no comic
scoring (the stop and the cut-off are the only tools; no hit on a laugh, a honk or a bonk); no Mickey-Mousing (the
bonks, the honks, the blimp's lights are SFX); nothing below C3 in the dark room; continuous per sequence,
no designed silence inside the act; designed hits marked.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --dry --el          # runs, marks, note QA
    MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --assemble --el     # re-lay render/_work/el, measure
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                    # the segment checks
Out: render/music[-el].wav (the segment's exact length), render/music[-el]-prelap.wav and cues[-el].json.
Nothing here has been listened to.
"""
from __future__ import annotations

import json
import math
import os
import sys
from dataclasses import replace

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e02-v1-common'))
import v3lib as V   # noqa: E402
from v3lib import palette, nm, Drums   # noqa: E402
from engine.core import SR, lp, hp, to_stereo   # noqa: E402
from engine.sampler import GU   # noqa: E402

SEG = 'act3'
Q, BAR, S16 = V.Q, V.BAR, V.S16
SW = Q * 2.0 / 3.0                     # the house swing: the and lands 10 frames after its beat
PLAN = os.path.join(V.REPO, 'show', 'episodes', 'ep02', 'production', 'v1', 'beat-plan', 'act3.json')


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


# ================================================================ the lock: real lines, the record on screen, events
_PLAN = None


def plan_doc():
    global _PLAN
    if _PLAN is None:
        try:
            d = json.load(open(PLAN))
        except (OSError, ValueError):
            d = {'beats': []}
        _PLAN = dict(beats={b['id']: b for b in d.get('beats', [])},
                     lines={ln['id']: ln for b in d.get('beats', []) for ln in (b.get('lines') or [])})
    return _PLAN


def plan_cut(bid, kind, key, default):
    """a beat's J or L cut from the plan (jcut lead_s, lcut over_s), else the default"""
    for c in plan_doc()['beats'].get(bid, {}).get(kind) or []:
        if isinstance(c, dict) and c.get(key) is not None:
            return float(c[key])
    return default


def mark_real(tl):
    """Ep2's lock prints no quotation marks and its takes carry no source tag: the beat plan's `note` does ([P ...]
    public record, [V ...] verbatim, [K ...] confirmed).  In Act Three: Alyi's "FEEL THE AGI!" and the chant (F2.2)"""
    pl = plan_doc()['lines']
    out = []
    for ln in tl.lines:
        note = (pl.get(ln['id'], {}).get('note') or '').lstrip()
        if note.startswith(('[P', '[V', '[K')) and ln['kind'] != 'vo':
            ln['kind'] = 'real'
            out.append(ln['id'])
    return out


def record_windows(tl):
    """the record on screen: every post (kind `post`: his phone's thread, Ekiel's, the Superalignment post, his apology,
    NopeAI's), a broadcast's own lower third (the presser), a quoted post or document, and a document the plan marks [H]:
    (t0, t1, text)"""
    pb = plan_doc()['beats']
    out = []
    for b in tl.beats:
        pic = pb.get(b['id'], {}).get('picture') or ''
        for o in b['b'].get('onscreen', []) or []:
            txt = o.get('text') or ''
            k = o.get('kind')
            quoted = any(q in txt for q in '"“”') and k in ('post', 'doc', 'caption')
            if k in ('post', 'lower-third') or quoted or (k == 'doc' and '[H' in pic):
                a = b['t0'] + (o.get('at') or 0.0)
                e = b['t0'] + (o['until'] if o.get('until') is not None else b['t1'] - b['t0'])
                out.append((a, e, txt[:48]))
    return sorted(out)


def merge(ws):
    out = []
    for a, b in sorted(ws):
        if out and a <= out[-1][1]:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return [(a, b) for a, b in out]


def still_windows(tl, kinds=('mas', 'vo', 'real')):
    """where the score doesn't move: his lines, the V.O., real lines and the record on screen"""
    w = [(ln['on'] - 0.1, ln['end'] + 0.05) for ln in tl.lines if ln['kind'] in kinds]
    w += [(a - 0.1, b) for a, b, _ in record_windows(tl)]
    return merge(w)


def talk_windows(tl, pre=0.15, post=0.2):
    """every line (the melody stays out of all of them: the pockets)"""
    return merge([(ln['on'] - pre, ln['end'] + post) for ln in tl.lines])


def inside(t, ws, pad=0.0):
    return next(((a, b) for a, b in ws if a - pad <= t < b + pad), None)


def _snd(tl, bid, name, default, k=1):
    try:
        return tl.snd(bid, name, k=k, default=default) if tl.has(bid) else default
    except KeyError:
        return default


def _line(tl, lid, who, near):
    if lid in tl.L:
        return tl.L[lid]
    ls = [ln for ln in tl.lines if ln['who'] == who]
    return min(ls, key=lambda ln: abs(ln['on'] - near)) if ls else None


def _B(tl, bid, default):
    return tl.B(bid) if tl.has(bid) else default


def lead_in(c, t, min_lead=0.15, swung=True, step=None):
    """the latest grid point (a beat, or its swung and; or every `step` s) at least min_lead before t: a change that
    lands on a cut pre-laps it by about a quarter second (Ep1 v3.5's rule)"""
    st = step or Q
    k = math.floor((t - min_lead - c.bar1) / st + 1e-9)
    best = None
    for kk in (k - 1, k):
        for off in ((0.0, SW) if (swung and step is None) else (0.0,)):
            p = c.bar1 + kk * st + off
            if p <= t - min_lead + 1e-9 and (best is None or p > best):
                best = p
    return best


def how(c, t, cut):
    k = (t - c.bar1) / Q
    kind = 'on the beat' if abs(k - round(k)) < 0.02 else ('on an eighth' if abs(2 * k - round(2 * k)) < 0.04
                                                             else 'on a swung and')
    return f'{kind}, {cut - t:.2f} s before the cut' if cut >= t else f'{kind}, {t - cut:.2f} s after the cut'


def place(c, t, ws, floor=-1e9, limit=1e9):
    """a change at t, moved out of any still window: to the first beat after it when that is clear of the next window
    and before `limit`, else to the latest beat at least 0.2 s before it"""
    for _ in range(6):
        w = inside(t, ws)
        if not w:
            return t
        after = c.next_beat(w[1] + 0.05)
        nxt = min([a for a, b in ws if a > w[1]] + [1e9])
        if after < nxt - 0.1 and after < limit:
            t = after
        else:
            early = lead_in(c, w[0], min_lead=0.2, swung=False)
            t = early if early is not None and early > floor + Q else after
    return t


def sw_at(t0, beat):
    """a beat position from t0 with the house swing on the eighths (x.5 lands 10 frames after its beat)"""
    whole = math.floor(beat + 1e-9)
    frac = beat - whole
    return t0 + whole * Q + (SW if abs(frac - 0.5) < 1e-6 else frac * Q)


def drums_window(c, kit, pattern, a0, a1, vel):
    """a drum pattern played whole bars, kept to [a0, a1)"""
    b0, b1 = int(math.floor(c.bar_of(a0) + 1e-6)), int(math.ceil(c.bar_of(a1) - 1e-6))
    n0 = len(c.a.notes)
    Drums(c.a, kit).play(pattern, bars=(max(1, b0), max(2, b1 + 1)), vel=vel)
    c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if a0 - 0.02 <= c.clk.x(nt.start) < a1 - 0.03]


def chip(c, inst, p, t, d, v, duty=0.25, **x):
    """a chip note (locked to the grid: the machine's own voice)"""
    kw = dict(duty=duty, att=0.002, dec=0.09, sus=0.35, rel=0.06)
    kw.update(x)
    return c.n(inst, p, t, d, v, True, **kw)


def chip_det(c, inst, p, t, d, v, cents=12.0, **x):
    """a detuned chip note (GLYPH's 12.5 % pair): two pulses `cents` apart"""
    return [chip(c, inst, nm(p), t, d, v * 0.75, **x), chip(c, inst, nm(p) + cents / 100.0, t, d, v * 0.75, **x)]


def ride_macro(rides, t_start, t_end, ramp=0.3):
    """fader points [(t, dB)] for rides [(t0, t1, dB)] (a step per ride, each edge ramped over 2 x ramp s);
    overlapping rides add (a V.O. ride inside a section's ride)"""
    lvl = lambda t: sum(d for a, b, d in rides if a <= t < b)      # noqa: E731
    pts = [(t_start, lvl(t_start))]
    xs = sorted({a for a, _, _ in rides} | {b for _, b, _ in rides})
    for i, x in enumerate(xs):                  # each edge ramps over 2 x r, r never past half-way to its neighbours
        r = min([ramp] + [(x - xs[i - 1]) / 2.0 for _ in (0,) if i > 0] + [(xs[i + 1] - x) / 2.0 for _ in (0,)
                                                                            if i + 1 < len(xs)])
        pts += [(x - r, lvl(x - 1e-3)), (x + r, lvl(x + 1e-3))]
    pts.append((t_end, lvl(t_end)))
    return pts


def ramp_auto(c, pts):
    """track gain automation [(segment s, dB)] -> the engine's [(file s, linear)]"""
    return [(c.clk(t), 10 ** (d / 20.0)) for t, d in sorted(pts)]


def door_post(buf):
    """'Through the door' (OST §2.9; MM-09's): low-passed, and the room on ONE side only (short right-side reflections)"""
    y = lp(hp(to_stereo(np.asarray(buf, dtype=np.float64)), 180, 2), 2300, 2)
    out = y.copy()
    r = np.zeros_like(y[1])
    for ms, gdb in ((19, -8), (37, -11), (61, -14), (97, -18)):
        d = int(ms * 48)
        r[d:] += y[1][:-d] * 10 ** (gdb / 20)
    out[1] += lp(r, 1800, 1)
    out[0] *= 0.55
    return out.astype(np.float32)


def hum_post(buf):
    """the chair's hum, in the room: the GPU choir heard as a machine's hum (two low-passes near 500 Hz, the lows
    thinned, almost mono), before it opens into the score's choir"""
    y = hp(to_stereo(np.asarray(buf, dtype=np.float64)), 70, 2)
    y = lp(lp(y, 520, 2), 900, 2)
    m = 0.5 * (y[0] + y[1])
    return np.stack([0.9 * m + 0.1 * y[0], 0.9 * m + 0.1 * y[1]]).astype(np.float32)


def act2_stop_rel(default=-0.8):
    """Act Two's designed stop (B('12.08') + 2.0 on the frame grid) on Act Three's clock: where its black begins"""
    try:
        t2 = V.TL(V.el_path('act2'))
        return round((t2.B('12.08') + 2.0) * 24) / 24.0 - t2.length
    except Exception:           # noqa: BLE001
        return default


# ================================================================ the GPU choir and the Door (OST §2.9)
GPU = ['Db3', 'Ab3', 'Eb4', 'G4']                  # D-flat sus2(#11), no third (+C5)
GPU_UP = ['C5', 'Eb5']                             # the chant's lift: two more voices
DOOR_WHOLE = [('Ab4', 2), ('Db5', 2), ('C5', 1), ('G4', 3)]       # half notes: A-flat D-flat | C G (held: the #4)
DOOR_MISSING = DOOR_WHOLE[1:]                                       # WHERE'S ALYI?: the first note missing


def door(c, t0, notes, vel, hold_to=None, inst='door'):
    """the Door on non-vibrato flute (sermon pace); the last note (its #4) held to hold_to; never a cadence"""
    t = t0
    out = []
    for i, (p, beats) in enumerate(notes):
        last = i == len(notes) - 1
        d = (max(beats * Q, hold_to - t) if (last and hold_to) else beats * Q * 0.97)
        c.n(inst, p, t, d, vel * (1.0 if i == 0 else 0.95), art='nv', att=0.08 if i == 0 else 0.03,
            rel=0.9 if last else 0.2)
        out.append((t, p))
        t += beats * Q
    return out


# ================================================================ E02-08 WHERE'S ALYI?: THE CLOCK, first step (P04)
STEP = {   # the knee's rising F G A-flat C: (the clarinet's lower note, the violins' upper note), held dyads
    'F': ('F4', 'C5'), 'G': ('G4', 'C5'), 'Ab': ('Ab4', 'Db5'), 'C': ('C5', 'F5'), 'Ek': ('Ab4', 'Db5'),
}
TICK_POOL = {   # the tick's varied pitches (violin pizzicato, F4-Eb5), per colour; never one pitch at an even rate
    'F': ['C5', 'Ab4', 'F4', 'Bb4', 'Eb5', 'G4'],
    'G': ['C5', 'G4', 'Eb5', 'Ab4', 'Bb4', 'F4'],
    'Ab': ['Db5', 'Ab4', 'C5', 'G4', 'Eb5', 'Bb4'],
    'C': ['C5', 'F4', 'G4', 'Eb5', 'Bb4', 'Ab4'],
    'Db': ['Db5', 'Ab4', 'Eb5', 'G4', 'C5', 'F4'],
    'Ek': ['Ab4', 'C5', 'Db5', 'G4', 'F4', 'Eb5'],
}
PEDAL = {'F': ('F3', 'C4'), 'Db': ('Db3', 'Ab3')}
PZ8 = {'F': ['F3', 'C4', 'Ab3', 'C4', 'G3', 'C4', 'Ab3', 'Db4'],       # the cello's pizzicato eighths (playful)
       'Db': ['Db3', 'Ab3', 'F3', 'Ab3', 'Eb3', 'Ab3', 'F3', 'Bb3']}
SPIC8 = ['F3', 'C4', 'Ab3', 'C4', 'G3', 'C4', 'Ab3', 'Db4']            # Ep1's clock: low spiccato (the chill)


def tracks_clock(hum_on, hum_off, hum2_on, swell, hum_stop, choir_on, choir_off, clk):
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cl', 'woodclick', 'noise', 'timp', 'glasspad'):
        T[k].hum_ms, T[k].drift_ms = 0.0, 0.0                 # THE CLOCK is straight: the machine's time
    # the tick: the violin pizz set's body resonance (430-450 Hz) read as an A over the F pedal (Ep1 Act Three's fix)
    dup(T, 'vln1', 'tick_pz', eq=list(T['vln1'].eq) + [('peq', 440.0, -12.0, 5.0)], gain_db=-1.0, pan=-0.2,
        sends={'hall': -12, 'room': -14})
    # the cello's pizzicato and spiccato bodies: A2 (~111 Hz) and A3 (~215 Hz) under the F pedal (render 1, the engine's
    # F-major trace: 'resonance (no written note has this partial)'), notched with the 440 Hz one
    notch = [('peq', 111.3, -10.0, 8.0), ('peq', 216.0, -10.0, 7.0), ('peq', 440.0, -9.0, 5.0)]
    dup(T, 'vc', 'vc_sp', eq=list(T['vc'].eq) + notch, gain_db=-4.0)
    dup(T, 'vc', 'vc_pz', eq=list(T['vc'].eq) + notch, gain_db=-5.0, pan=0.3, sends={'hall': -12, 'room': -12})
    T['woodclick'].gain_db, T['woodclick'].eq, T['woodclick'].pan = -10.0, [('hp', 700), ('hs', 6000, -4)], 0.2
    T['timp'].gain_db = -9.0
    T['glasspad'].gain_db = -12.0
    T['cl'].gain_db, T['cl'].sends = -4.0, {'hall': -10, 'room': -14}
    T['vln2'].gain_db, T['vln2'].sends = -6.0, {'hall': -10, 'room': -16}
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -2.0, {'hall': -11, 'room': -16}
    T['noise'].gain_db = -12.0
    T['door'] = replace(T['fl'], name='door', pan=0.5, width=0.35, sends={'hall': -20}, hum_ms=0.0, vel_jit=0.0,
                        rel=0.5, post=door_post, gain_db=0.0)
    choir_src = ('sf2', GU, 0, 52, False)
    cred = T['reed'].credit
    # the chair's hum: the GPU choir in the room (diegetic), then the score's choir over it (diegetic into score)
    T['hum'] = replace(T['reed'], name='hum', src=choir_src, credit=cred, gain_db=-3.0, pan=0.35, width=0.4,
                       sends={'room': -10}, hum_ms=0.0, vel_jit=0.0, post=hum_post, eq=[])
    T['hum_rd'] = replace(T['reed'], name='hum_rd', gain_db=-6.0, pan=0.35, width=0.4, sends={'room': -12},
                          post=hum_post, eq=[], hum_ms=0.0)
    T['choir'] = replace(T['reed'], name='choir', src=choir_src, credit=cred, gain_db=-8.0, pan=0.3, width=0.6,
                         sends={'hall': -12}, hum_ms=0.0, vel_jit=0.0, eq=[('hp', 90), ('lp', 4200)])
    T['reed'].gain_db, T['reed'].pan, T['reed'].sends = -12.0, 0.3, {'hall': -12}
    # the hum: in at the chair, out as Ekiel walks off; back at the pivot, swelling over the cut to its stop
    hum_auto = [(hum_on - 0.05, -40.0), (hum_on + 0.6, 0.0), (hum_off - 2.5, 0.0), (hum_off, -40.0),
                (hum2_on, -40.0), (hum2_on + 1.0, -4.0), (swell, -2.0), (swell + 2.2, 4.0), (hum_stop, 4.0)]
    for k in ('hum', 'hum_rd'):
        T[k].auto = [(clk(t), 10 ** (d / 20.0)) for t, d in hum_auto]
    ch_auto = [(choir_on, -40.0), (choir_on + 5.0, -2.0), (choir_off - 1.0, -2.0), (choir_off + 0.4, -40.0),
               (swell, -40.0), (swell + 2.4, 3.0), (hum_stop, 4.0)]
    for k in ('choir', 'reed'):
        T[k].auto = [(clk(t), 10 ** (d / 20.0)) for t, d in ch_auto]
    return T


def cue_clock(tl):
    B, E = tl.B, tl.E
    stop2 = act2_stop_rel()
    # the grid's anchor: the pivot's creak, where THE CLOCK stops dead (the fixes pass, 2026-10-10: it was the first of
    # 14.11's four screws, and 14.11 is cut from the act: the safety team's plate came between Ekiel's exit and Alyi's
    # door, the episode review's blocker)
    creak = _snd(tl, '14.12', 'door_pivot_creak', _B(tl, '14.12', 79.37) + 1.49)
    out_t = E('14.12') if tl.has('14.12') else _B(tl, '15.01', 90.0)
    L = plan_cut('14.12', 'lcut', 'over_s', 1.0)
    hum_stop = round((out_t + L) * 24) / 24.0
    k = int(math.ceil((creak - (stop2 - 0.2)) / BAR - 1e-9))
    c = V.Cue('e02-08-wheres-alyi', tl, anchor=creak, anchor_bar=k + 1, bars=int((hum_stop + 2.0 - (creak - k * BAR))
                                                                                 / BAR) + 3, swing=0.0)
    W = still_windows(tl)
    rec = record_windows(tl)
    talk = talk_windows(tl, 0.1, 0.15)
    first = c.next_beat(stop2 + 0.06)                   # the first tick: the first beat into Act Two's black
    e = dict(stop2=stop2, first=first, out=out_t, hum_stop=hum_stop,
             tv=_B(tl, '13.04', 19.29), presser_end=E('13.05') if tl.has('13.05') else 27.75,
             floor=_B(tl, '14.01', 31.0), band_on=_snd(tl, '13.06', 'ui_band_on', _B(tl, '13.06', 27.75) + 2.2),
             door=_B(tl, '14.04', 43.79), dot=_B(tl, '14.05', 49.0), note=_B(tl, '14.06', 52.63),
             bonk=_snd(tl, '14.06', 'alert_bonk', _B(tl, '14.06', 52.63) + 0.6),
             chair=_snd(tl, '14.07', 'chair_hum_choir', _B(tl, '14.07', 56.79)), ekiel=_B(tl, '14.09', 70.83),
             freeze=_snd(tl, '14.09', 'freeze_hit_F', _B(tl, '14.09', 70.83) + 0.6), post=_B(tl, '14.10', 74.25),
             domino=_snd(tl, '14.10', 'domino_topple_run', _B(tl, '14.10', 78.37) + 4.6), pivot=_B(tl, '14.12', 79.37),
             creak=creak)
    # the staffers' low exchange (13.03b, the fixes pass: "Did his post say why?" / "No."): the clock a tiny bed under
    # it, like the presser (said low; at the talk level the ticks held its onset to +7.0 dB over the score, under +10)
    e['hush'] = (B('13.03b') - 0.1, E('13.03b') - 0.2) if tl.has('13.03b') else (-9.0, -9.0)
    ek_rec = next((a for a, b, _ in rec if a >= e['post'] - 0.2), e['post'] + 0.6)
    ek_end = max([b for a, b, _ in rec if e['post'] - 0.2 <= a < e['pivot']] + [e['domino']])
    # ---- the plan: (t, step or None, pedal, layers, why); every change pre-laps its cut and avoids the still windows
    hs = []
    hs.append((first, 'F', 'F', 'the black: the first tick one beat into Act Two\'s black (J %.2f s, the first grid beat '
                                'after its designed stop); an F pedal; the knee\'s F' % -first))
    t_g = place(c, lead_in(c, B('13.03'), swung=False), W)
    hs.append((t_g, 'G', 'F', f'"leave them up." ({how(c, t_g, B("13.03"))}): the step to G, as he picks up the '
                              'fallen flyer and tapes it back (hope, his own hand)'))
    t_ab = place(c, lead_in(c, B('13.06'), swung=False), W, floor=t_g)
    hs.append((t_ab, 'Ab', 'F', f'the walk-off ({how(c, t_ab, B("13.06"))}): A-flat'))
    t_c = place(c, lead_in(c, e['floor'], swung=False), W, floor=t_ab)
    hs.append((t_c, 'C', 'F', f'the threshold ({how(c, t_c, e["floor"])}): the knee\'s leap lands on C as the open '
                              'floor\'s band lights; the clock carries'))
    t_door = c.nearest_beat(e['door']) if abs(c.nearest_beat(e['door']) - e['door']) < 0.12 else lead_in(c, e['door'],
                                                                                                         swung=False)
    hs.append((t_door, None, 'Db', f'his own reflection mouths "can we talk?" ({how(c, t_door, e["door"])}): THE DOOR '
                                  'blooms, its first note missing; D-flat under it; the ticks soften'))
    t_dot = lead_in(c, e['dot'], swung=False)
    hs.append((t_dot, 'C', 'F', f'DOT\'s cuff points at the door ({how(c, t_dot, e["dot"])}): the F pedal and the C '
                                'dyad again; the playful pizzicato'))
    t_ch = lead_in(c, e['chair'], swung=False, step=Q / 2)
    hs.append((t_ch, None, 'Db', f'the chair ({how(c, t_ch, e["chair"])}): the pedal to D-flat; the hum is the GPU '
                                 'choir\'s chord in the room, then the score\'s (Bukaj, the exchange)'))
    t_ek = lead_in(c, e['ekiel'], swung=False)
    hs.append((t_ek, 'Ek', 'F', f'Ekiel ({how(c, t_ek, e["ekiel"])}): the F pedal; low spiccato eighths (the chill); '
                                'the freeze is the SFX\'s'))
    t_po = c.next_beat(e['post'] + 0.02)
    if t_po > ek_rec - 0.2:
        t_po = lead_in(c, ek_rec, min_lead=0.2, swung=False)
    hs.append((t_po, None, 'F', f'Ekiel\'s post (from {ek_rec:.2f}): THE CLOCK thins to its pedal (no tick, no dyad): '
                                'the record plays dry'))
    stop = c.next_beat(e['creak'] - 0.05)                               # the clock stops dead on the creak's beat
    # the domino at his shoe, after the post has played dry: the ticks again over the Ache (G + D-flat over the F
    # pedal), the chill, to the creak (a beat at least; the screws' four ticks had it until the fixes pass)
    t_sc = min(c.next_beat(ek_end + 0.05), stop - Q)
    hs.append((t_sc, None, 'F', 'the domino at his shoe (the post played dry): the ticks again; the Ache (G + D-flat '
                                'over the F pedal), the chill, to the creak'))
    H = sorted(hs)
    e['clock_stop'] = stop

    def at(t):
        return [h for h in H if h[0] <= t + 1e-6][-1] if t >= H[0][0] else H[0]

    T = tracks_clock(hum_on=e['chair'], hum_off=t_ek + BAR, hum2_on=e['pivot'], swell=stop, hum_stop=hum_stop,
                     choir_on=e['chair'] + 0.8, choir_off=t_ek, clk=c.clk)
    rng = np.random.default_rng(1308)
    # ---- the tick: violin pizzicato + woodblock on every beat, varied pitches; softer under talk, tiny under the
    # presser, out under the record; it stops dead on the creak
    t = first
    j = 0
    prev = None
    ticks = []
    while t < stop - 0.01:
        h = at(t)
        col = h[1] or h[2]
        if h[0] == t_po:                               # Ekiel's post: the pedal alone
            t += Q
            j += 1
            continue
        pool = TICK_POOL['Db' if h[2] == 'Db' else col]
        cand = [p for p in pool if p != prev]
        p = cand[int(rng.integers(0, len(cand)))] if j % 4 else (pool[0] if prev != pool[0] else pool[1])
        prev = p
        v = 0.36 if j % 4 == 0 else 0.3
        if e['tv'] - 0.1 <= t < e['presser_end'] - 0.2 or e['hush'][0] <= t < e['hush'][1]:
            v *= 0.45                                  # the presser, the staffers' low exchange: a tiny bed
        elif inside(t, talk):
            v *= 0.72
        if h[0] == t_door and t < t_dot:
            v *= 0.6                                   # under the Door: softer
        if t_ch <= t < t_ek:
            v *= 0.62                                  # the chair, Bukaj: softer
        if t >= t_sc:
            v *= 1.12                                  # the domino's beats and after: the peak
        c.n('tick_pz', p, t, 0.25, v, lock=True, art='pizz')
        c.n('woodclick', 60 + (j % 3), t, 0.08, v * 0.7, lock=True)
        ticks.append(round(t, 3))
        t += Q
        j += 1
    c.n('timp', 'F3', first, 1.4, 0.26, lock=True)
    c.mark(first, f'THE CLOCK\'s first tick, one beat into Act Two\'s black (J {-first:.3f} s; Act Two\'s designed stop '
                  f'is at {stop2:.3f}): in render/music-el-prelap.wav', hit=False)
    t0f = c.next_beat(-0.01) if abs(c.next_beat(-0.01)) < 0.02 else None
    if t0f is not None:
        c.mark(t0f, 'DESIGNED HIT: THE CLOCK\'s third tick on the act\'s first frame (the first two are in the prelap '
                    'under Act Two\'s black): the mix keeps its attack')
    # ---- the chip's seconds: irregular noise ticks (never one pitch at an even rate)
    secs = []
    t = c.bar(1)
    while t < stop - 0.2:
        h = at(t)
        dens = 0 if h[0] == t_po else (1 if t < e['floor'] else (1 if t_ch <= t < t_ek else 3 if t >= t_sc else 2))
        if t >= first + Q and dens:
            pos = sorted(rng.choice(np.arange(16), size=dens, replace=False))
            for q in pos:
                tt = t + q * S16
                if (tt < stop - 0.1 and not (e['tv'] - 0.1 <= tt < e['presser_end'] - 0.2) and not inside(tt, W)
                        and not (e['hush'][0] <= tt < e['hush'][1])):
                    c.n('noise', 60, tt, 0.06, 0.3 + 0.05 * (q % 3), lock=True, clock=float(rng.integers(8, 24) * 1000),
                        short=bool(q % 4 == 3), dec=0.03, sus=0.0, rel=0.02, hp=2500)
                    secs.append(round(tt, 3))
        t += BAR
    # ---- the pedal (sul tasto) and the dyads (the knee's rising step), per section of the plan
    for i, (t0, step, ped, why) in enumerate(H):
        t1 = H[i + 1][0] if i + 1 < len(H) else stop
        last = i + 1 == len(H)
        vc, vla = PEDAL[ped]
        sv = 0.16 if t0 != t_po else 0.19
        c.rebow('vc', vc, t0 - (0.0 if i == 0 else 0.25), t1 + (0.35 if not last else 0.6), sv, seg=5.0, xf=1.0,
                first_att=2.4 if i == 0 else 0.9, last_rel=0.6 if last else 0.3, art='sus', lp=1400)
        c.rebow('vla', vla, t0 - (0.0 if i == 0 else 0.25) + 0.1, t1 + (0.35 if not last else 0.6), sv - 0.02,
                seg=5.0, xf=1.0, first_att=2.6 if i == 0 else 1.0, last_rel=0.6 if last else 0.3, art='sus', lp=1600)
        if step:
            lo, top = STEP[step]
            d = t1 - t0
            c.rebow('cl', lo, t0, t1 + 0.15, 0.2 + (0.02 if step in ('Ab', 'C') else 0.0), seg=5.0, xf=0.8,
                    first_att=0.5 if i else 1.4, last_rel=0.3, art='sus')
            c.rebow('vln2', top, t0 + 0.02, t1 + 0.15, 0.15, seg=5.0, xf=0.8, first_att=0.6 if i else 1.6,
                    last_rel=0.3, art='sus', lp=3200)
            if d < 0.5:
                pass
        c.mark(t0, f'{step or "-"} / {ped} pedal: {why}', hit=False)
    # ---- the open floor's playful pizzicato eighths (cello), and Ekiel's low spiccato (the chill)
    for a0, a1, pat, inst, v in ((t_c, t_door, PZ8['F'], 'vc_pz', 0.3), (t_dot, t_ch, PZ8['F'], 'vc_pz', 0.26),
                                 (t_ek, t_po, SPIC8, 'vc_sp', 0.24), (t_sc, stop, SPIC8, 'vc_sp', 0.28)):
        t = c.next_bar(a0 - 0.01) if inst == 'vc_pz' else a0
        i = 0
        while t < a1 - 0.05:
            if inst == 'vc_pz':
                c.n('vc_pz', pat[i % 8], t, 0.2, v * (1.0 if i % 2 == 0 else 0.78), lock=True, art='pizz')
            else:
                c.n('vc_sp', pat[i % 8], t, 0.12, v * (1.0 if i % 2 == 0 else 0.8), lock=True, art='spic')
            t += Q / 2
            i += 1
    c.mark(c.next_bar(t_c - 0.01), 'the open floor: the cello\'s pizzicato eighths join (playful: the verbs, the '
                                   'heatsink, the strip)', hit=False)
    # ---- THE DOOR, its first note missing, on his own reflection (D-flat, C, then G held: the #4)
    dn = door(c, t_door, DOOR_MISSING, 0.38, hold_to=t_dot + 0.4)
    c.mark(t_door, 'THE DOOR blooms once, its first note missing (D-flat C | G held, the #4; no cadence), through the '
                   'door, on his own reflection mouthing "can we talk?"', hit=False)
    # ---- the chair's hum (claimed chair_hum_choir): the GPU choir's chord, in the room, then the score's
    for inst, v in (('hum', 0.4), ('hum_rd', 0.3)):
        c.ch(inst, GPU, e['chair'], t_ek + BAR + 0.5 - e['chair'], v, roll=0.0, lock=True)
        c.ch(inst, GPU + ['C5'], e['pivot'], hum_stop + 0.3 - e['pivot'], v * 1.25, roll=0.0, lock=True)
    for inst, v in (('choir', 0.32), ('reed', 0.24)):
        c.ch(inst, GPU, e['chair'] + 0.8, t_ek + 0.6 - (e['chair'] + 0.8), v, roll=0.0, lock=True)
        c.ch(inst, GPU + ['C5'], stop, hum_stop + 0.3 - stop, v * 1.4, roll=0.0, lock=True)
    c.mark(e['chair'], 'the chair\'s hum: the GPU choir\'s chord (D-flat sus2(#11), no third) in the room, low-passed '
                       'and narrow; over two bars the score\'s choir opens out of it (diegetic into score; the score '
                       'plays the claimed chair_hum_choir)', hit=False)
    # ---- the Ache at the domino (glass: G4 + D-flat5 over the F pedal), soft timpani on F
    ache_end = stop
    c.ch('glasspad', ['G4', 'Db5'], t_sc, ache_end - t_sc + 0.2, 0.3, roll=0.0, lock=True, rel=0.4)
    c.n('timp', 'F3', t_sc, 1.2, 0.24, lock=True)
    c.mark(t_sc, 'the domino at his shoe, the post played dry: the ticks again over the Ache (the chill), to the creak',
           hit=False)
    c.mark(stop, 'THE CLOCK stops dead on the pivot\'s creak (the reveal: the door he couldn\'t open turns on its pin); '
                 'the hum swells', hit=False)
    c.mark(out_t, f'the cut to the empty office: the hum rings over it (L {L:.1f} s)', hit=False)
    c.mark(hum_stop, 'the hum stops where the chair used to be; the felt (E02-09) takes the downbeat', hit=False)
    # ---- the rides: the presser is a tiny bed; the hum's swell sits under the out's ceiling
    rides = [(e['tv'] - 0.1, e['presser_end'] - 0.25, -5.0),     # the presser: a tiny bed
             (e['hush'][0], e['hush'][1], -3.0),                    # the staffers' low exchange (the fixes pass)
             (t_sc - 0.1, stop, 1.5),                               # the domino: THE CLOCK's peak (P04: up to -18)
             (stop, hum_stop + 0.5, 2.5)]                           # the hum's swell over the cut
    macro = ride_macro(rides, c.bar1 - 1.0, hum_stop + 1.5)
    secs_ = [('1 the black, the staffers: F (the first step: a tick a beat; the pedal)', first, t_g),
             ('2 "leave them up.", the flyer: G', t_g, e['tv']),
             ('3 the presser on the lobby TV: a tiny bed (the record dry; no change)', e['tv'], t_ab),
             ('4 the walk-off: A-flat; the threshold: C (the band lit)', t_ab, t_c),
             ('5 the open floor: playful (the pizzicato eighths; the chip\'s seconds)', t_c, t_door),
             ('6 the reflection: THE DOOR, first note missing (D-flat)', t_door, t_dot),
             ('7 DOT\'s cuff; the note into his pocket (F, C)', t_dot, t_ch),
             ('8 the chair: the hum, the GPU choir (D-flat); Bukaj', t_ch, t_ek),
             ('9 Ekiel: the card (spiccato); his post: the pedal alone', t_ek, t_sc),
             ('10 the domino at his shoe: the Ache; the clock\'s peak', t_sc, stop),
             ('11 the pivot: the clock stops; the hum swells and rings over the cut', stop, hum_stop)]
    for lab, a0, a1 in secs_:
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='Where\'s Alyi? (E02-08, Ep2 v1 Act Three sc 13-14)', mm='new to picture, from MM-18 (the '
        'Door and the GPU choir) + P04 THE CLOCK', usage='BI',
        family='P04 THE CLOCK, first step (quarters), straight; the Door and the GPU choir (MM-18)',
        tone='wry; a sad beat, then a dry laugh (the presser, scored as a tiny bed); playful (the open floor), then '
             'lonely (his own face saying it); a chill at the domino',
        scenes=['Ep2 v1 Act Three sc 13 (13.01-13.06)', 'sc 14 (14.01-14.12)'],
        motifs=['THE CLOCK, first step: a pizzicato and woodblock tick a beat on varied pitches, the chip\'s irregular '
                'seconds', 'the knee\'s rising F G A-flat C as held dyads (clarinet, violins)',
                'THE DOOR with its first note missing (flute, through the door)',
                'the GPU choir as the chair\'s hum (diegetic into score)', 'the Ache at the domino'],
        motif_ids=[], key='F pedal (the clock), the knee\'s step dyads; D-flat for the Door and the chair (D-flat '
                          'sus2(#11), no third); the Ache (G, D-flat over F); no A-natural',
        composer='Ep2 v1 score pass (act3), 2026-10-09, on the e02-v1-common engine (composer X\'s helpers)',
        underscore_lufs=-20.5, album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(first), t1=c.clk(e['floor']), sfx='server_hum (the lobby\'s stand-in bed)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['band_on'], 'ui_band_on: the band lights (the C step pre-laps the cut)'),
            (e['bonk'], 'alert_bonk: Open greyed (no hit)'),
            (e['chair'], 'chair_hum_choir: CLAIMED (the score plays the hum)'),
            (e['freeze'], 'freeze_hit_F: Ekiel\'s card (the F pedal under it)'),
            (e['domino'], 'domino_topple_run: the post plays dry; the Ache comes in after it'),
            (e['creak'], 'door_pivot_creak: the clock stops on its beat'))],
        audition=['0-12 s: the tick is a clock, not a countdown cliché (no tick sample, no heartbeat); the pedal under '
                  'the staffers is a held room', '19-27 s: the presser is a tiny bed, the record dry',
                  '43.8-49 s: the Door through the door: lonely, not a hymn',
                  '56.8-62 s: the hum reads as the chair\'s, then opens into the choir',
                  'the domino to the creak: the Ache is a chill, not a horror sting'])
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=hum_stop + 0.6, tail_s=0.4, macro=macro)
    c.ev = dict({k: (round(v, 3) if isinstance(v, float) else v) for k, v in e.items()},
                plan=[(round(t, 3), s, p) for t, s, p, _ in H], ticks=len(ticks), chip_seconds=len(secs),
                door=[(round(t, 3), p) for t, p in dn])
    return c, sc


# ================================================================ E02-09 FEEL IT: the felt, F2.2, the felt again
DR = {   # the felt's rootless voicings and the sul-tasto cello + viola: nothing below C3 (his dark room)
    'Dbmaj9':    (['F3', 'Ab3', 'C4', 'Eb4'], ('Db3', 'Ab3')),
    'Bbm9':      (['Db3', 'F3', 'Ab3', 'C4'], ('Db3', 'F3')),
    'Fm9':       (['Eb3', 'G3', 'Ab3', 'C4'], ('F3', 'C4')),
    'Abmaj9':    (['Eb3', 'G3', 'Bb3', 'C4'], ('Eb3', 'C4')),
    'Gbmaj7#11': (['Bb3', 'F4', 'C5'], ('Gb3', 'Db4')),
    'Dbsus#11':  (['Ab3', 'Eb4', 'G4', 'C5'], ('Db3', 'Ab3')),
    'F5':        (['F3', 'C4', 'F4'], ('F3', 'C4')),
    'Dbmaj9b':   (['F3', 'Ab3', 'C4', 'Eb4'], ('Db3', 'Ab3')),
    'Fped':      ([], ('F3', 'C4')),
}
LIGHTS = ['Ab4', 'Eb5', 'G4', 'Db5', 'C5', 'Eb5', 'Ab4', 'G4']        # the string lights: a cycling figure on the choir
GLYPH_G = ['F5', 'C6', 'Db6']                                           # Ep2's GLYPH stage: grains (OST §2.5)


def tracks_feel(clk, choir_pts, felt_on):
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -6.0, {'room': -12, 'hall': -16}   # (render 1: the felt read -18.8 and
    T['felt_mech'].gain_db = -21.0                                           # the party -24.8: the felt down 4 dB)
    dup(T, 'felt', 'felt_ret', gain_db=-13.0)      # the felt's return at the pin: 7 dB under the felt (score review)
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -1.0, {'hall': -11, 'room': -16}
    T['tri'].gain_db, T['tri'].sends = -14.0, {'room': -14}                    # the chip, ≤ -10 dB under the felt
    T['lead2'].gain_db, T['lead2'].sends = -12.0, {'room': -14, 'hall': -16}   # GLYPH's detuned 12.5 % grains
    choir_src = ('sf2', GU, 0, 52, False)
    cred = T['reed'].credit
    T['choir'] = replace(T['reed'], name='choir', src=choir_src, credit=cred, gain_db=-3.0, pan=0.0, width=0.8,
                         sends={'hall': -10}, hum_ms=0.0, vel_jit=0.0, eq=[('hp', 90), ('lp', 5000)])
    T['reed'].gain_db, T['reed'].sends, T['reed'].pan = -9.0, {'hall': -10}, 0.1
    T['choir'].auto = [(clk(t), 10 ** (d / 20.0)) for t, d in choir_pts]
    T['reed'].auto = list(T['choir'].auto)
    T['glasspad'].gain_db = -12.0
    T['shimmer'].gain_db = -4.0
    T['celesta'].gain_db, T['celesta'].sends, T['celesta'].hum_ms = -4.0, {'hall': -8}, 0.0
    T['harp'].gain_db, T['harp'].pan = -6.0, -0.3
    T['door'] = replace(T['fl'], name='door', pan=0.5, width=0.35, sends={'hall': -20}, hum_ms=0.0, vel_jit=0.0,
                        rel=0.5, post=door_post, gain_db=-3.0)                  # (render 1: the turn read -16.8)
    T['cb'].gain_db, T['cb'].sends = -3.0, {'hall': -12, 'room': -16}
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    for k in ('vln2', 'vln1'):
        T[k].gain_db, T[k].sends = -6.0, {'hall': -10, 'room': -16}
    return T


def cue_feel(tl, hum_stop, push):
    E = tl.E
    hs0 = hum_stop
    c = V.Cue('e02-09-feel-it', tl, anchor=hs0, anchor_bar=2,
              bars=int((push + 3.0 - (hs0 - BAR)) / BAR) + 3, swing=0.0)
    W = still_windows(tl)
    talk = talk_windows(tl, 0.1, 0.15)
    e = dict(hs=hs0, c02=_B(tl, '15.02', 92.58), c03=_B(tl, '15.03', 96.38), c04=_B(tl, '15.04', 103.54),
             c05=_B(tl, '15.05', 110.13), ping=_snd(tl, '15.05', 'pin_ping', _B(tl, '15.05', 110.13) + 3.0),
             party=_B(tl, '15.06', 117.54), c07=_B(tl, '15.07', 124.58), c08=_B(tl, '15.08', 132.04),
             racks=_B(tl, '15.09', 138.5), glyph=_snd(tl, '15.09', 'glyph_shimmer', _B(tl, '15.09', 138.5) + 0.8),
             off23=_B(tl, '15.10', 142.0), turn=_B(tl, '15.12', 156.29), fire1=_B(tl, '15.13', 159.5),
             cut14=_B(tl, '15.14', 164.33), click=_snd(tl, '15.14', 'post_click', _B(tl, '15.14', 164.33) + 0.41),
             fire2=_B(tl, '15.15', 166.25), glow=_B(tl, '15.16', 171.04), pin=_B(tl, '15.17', 175.63),
             leave=_B(tl, '15.18', 180.46), door_close=_snd(tl, '15.18', 'door_close_soft', _B(tl, '15.18', 180.46) + 3.0),
             stairs=_B(tl, '15.19', 185.0), buzz=_snd(tl, '15.19', 'phone_buzz_step_1', _B(tl, '15.19', 185.0) + 1.2),
             end=E('15.19') if tl.has('15.19') else 190.0, push=push)
    e['chatter'] = e['end'] - plan_cut('15.19', 'jcut', 'lead_s', 1.0)
    far = _line(tl, 'e2-a3-0008', 'alyi', e['c03'] + 0.5)
    vo7 = _line(tl, 'e2-vo-07', 'mas', e['c03'] + 3.8)
    vo8 = _line(tl, 'e2-vo-08', 'mas', e['pin'] + 1.9)
    chant = _line(tl, 'e2-a3-0010', 'crowd', e['party'] + 3.5)
    # ---- the harmonic plan (his POV): (t, colour, why)
    H = [(hs0, 'Dbmaj9', 'the hum stops where the chair used to be: the felt\'s first chord on the same downbeat '
                         '(his interior); D-flat keeps the choir\'s root')]
    t = place(c, lead_in(c, e['c02'], swung=False, step=Q / 2), W, floor=hs0)
    H.append((t, 'Bbm9', f'the thread on his phone ({how(c, t, e["c02"])}): his post, its date, "almost a decade" (loneliness); '
                         'held under the posts and Alyi\'s far line (unscored)'))
    t_fm = c.next_beat((far['end'] if far else e['c03'] + 2.6) + 0.1)
    if vo7 and t_fm > vo7['on'] - 0.25:
        t_fm = lead_in(c, vo7['on'], min_lead=0.3, swung=False)
    H.append((t_fm, 'Fm9', 'between Alyi\'s far line and V.O. 7: F minor, struck before the count; nothing attacks under '
                           'it'))
    t = place(c, lead_in(c, e['c04'], swung=False, step=Q / 2), W, floor=t_fm)
    H.append((t, 'Abmaj9', f'TPOOL ({how(c, t, e["c04"])}): the early web\'s brighter A-flat (P10 T2), the chip on its '
                           'top: his past'))
    t_ab = t
    t = place(c, lead_in(c, e['c05'], swung=False, step=Q / 2), W, floor=t)
    H.append((t, 'Gbmaj7#11', f'"where u at?", every pin LAST SEEN: 2012 ({how(c, t, e["c05"])}): G-flat lydian, the '
                              'old map'))
    t_dbs = c.next_bar(e['ping'] + 0.2)
    H.append((t_dbs, 'Dbsus#11', 'the one warm pin: its ripple; the felt on the choir\'s chord as the choir swells in '
                                 'under it (the sound lead into F2.2)'))
    # ---- F2.2: no felt, no chip pulse, no swing (OST rule 7: his POV is left); the GPU choir, glass, the lights
    t_party = lead_in(c, e['party'], swung=False)
    # the chant's lift waits until the chant is established (its first word + 0.5 s: the score review, 2026-10-09,
    # measured the lights' octave climb on its onset)
    w_ch = (chant['words'][0][1] if chant['words'] else chant['on']) if chant else None
    t_lift = c.next_beat(w_ch + 0.5) if chant else t_party + 2 * BAR
    t_ex = lead_in(c, e['c07'], swung=False)
    t_door1 = c.next_bar(e['c08'] + 0.4)
    t_racks = lead_in(c, e['racks'], swung=False, step=Q / 2)
    t_23 = lead_in(c, e['off23'], swung=False)
    t_turn = lead_in(c, e['turn'], swung=False)
    g_t = lead_in(c, e['cut14'], swung=False)               # the Door's held #4 pre-laps the cut to the click
    if g_t > e['click'] - 0.12:
        g_t = lead_in(c, e['click'], min_lead=0.3, swung=False)
    t_door2 = g_t - 5 * Q                                    # A-flat (2) D-flat (2) C (1) | G
    t_ache = lead_in(c, e['fire2'], swung=False)
    t_glow = lead_in(c, e['glow'], swung=False, step=Q / 2)
    t_pin = lead_in(c, e['pin'], swung=False, step=Q / 2)
    t_go = place(c, lead_in(c, e['leave'], swung=True), W, floor=t_pin)
    t_st = lead_in(c, e['stairs'], swung=False)
    # the felt (his POV) per colour, the strings under it (sul tasto), the pedal re-caught on each change
    for i, (t0, col, why) in enumerate(H):
        t1 = H[i + 1][0] if i + 1 < len(H) else t_party - 0.05
        lh, (vc, vla) = DR[col]
        last = i + 1 == len(H)
        v = 0.22 if col != 'Fm9' else 0.24                   # (render 4: the felt's attacks peaked -12 to -13 LUFS-M)
        c.pch('felt', lh, t0, t1 - t0 + (0.4 if last else 0.05), v, roll=0.025,
              span_end=(t1 - 0.03) if not last else t_party - 0.1)
        c.n('felt_mech', 60, t0, 0.1, 0.25)
        c.rebow('vc', vc, t0 - (0.0 if i == 0 else 0.25), t1 + 0.35, 0.18, seg=5.0, xf=1.0,
                first_att=0.6 if i == 0 else 1.0, last_rel=0.5 if last else 0.3, art='sus', lp=1600)
        c.rebow('vla', vla, t0 - (0.0 if i == 0 else 0.25) + 0.1, t1 + 0.35, 0.16, seg=5.0, xf=1.0,
                first_att=0.8 if i == 0 else 1.1, last_rel=0.5 if last else 0.3, art='sus', lp=1800)
        c.mark(t0, f'{col}: {why}', hit=False)
    # the felt's top answers in the gaps (his interior, one note a phrase), never under a line or the record
    tops = []
    for i, (t0, col, why) in enumerate(H[:-1]):
        t1 = H[i + 1][0]
        tn = sw_at(c.next_bar(t0 + 0.01) if c.next_bar(t0 + 0.01) - t0 < 1.4 else t0 + BAR / 2, 1.5)
        if tn < t1 - 1.0 and not inside(tn, talk) and not inside(tn, W) and not inside(tn + 0.6, W):
            p = {'Dbmaj9': 'Ab4', 'Bbm9': 'F4', 'Fm9': 'G4', 'Abmaj9': 'Eb5', 'Gbmaj7#11': 'Db5'}.get(col)
            if p:
                c.n('felt', p, tn, 1.2, 0.18)
                tops.append((round(tn, 3), p))
    # TPOOL's chip (his past: the triangle on the A-flat chord's top, two notes)
    tc = c.next_beat(t_ab + 2 * Q)
    if not inside(tc, W) and not inside(tc + Q, W):
        chip(c, 'tri', 'C5', tc, Q * 0.9, 0.42, att=0.004, dec=0.3, sus=0.4, rel=0.2)
        chip(c, 'tri', 'Eb5', tc + Q, Q * 1.6, 0.4, att=0.004, dec=0.4, sus=0.4, rel=0.3)
        c.mark(tc, 'TPOOL: the chip\'s triangle answers the felt (C, E-flat): his 2006 app still knows him', hit=False)
    # the felt's last chord before F2.2 lets go before the cut (the pedal up 0.1 s before)
    # ---- the choir: in on the ripple, through F2.2; its level as CC-free track automation
    # (the glow: the choir thins to ppp and HOLDS to the pin, under the felt's return; the score review, 2026-10-09:
    # the glass alone decayed under -48 dBFS from about 172.8 s, an undeclared dropout, then a +35 dB step)
    choir_pts = [(t_dbs - 0.1, -30.0), (t_party, -6.0), (t_lift, -5.0), (t_lift + 1.2, 0.0), (t_ex, 0.0),
                 (t_ex + 1.0, -6.0), (t_racks, -4.0), (t_racks + 1.5, 1.0), (t_23, 1.0), (t_23 + 1.2, -5.0),
                 (t_ache, -5.0), (t_ache + 1.2, -8.0), (t_glow, -8.0), (t_glow + 1.6, -11.0), (t_pin + 0.3, -11.0),
                 (t_pin + 2.2, -40.0)]
    T = tracks_feel(c.clk, choir_pts, hs0)
    for inst, v in (('choir', 0.34), ('reed', 0.26)):
        c.ch(inst, GPU, t_dbs - 0.05, t_pin + 2.4 - t_dbs, v, roll=0.0, lock=True)
        c.ch(inst, GPU_UP, t_lift, t_ex + 0.8 - t_lift, v * 0.85, roll=0.0, lock=True)
        c.ch(inst, ['C5'], t_racks, t_23 + 0.4 - t_racks, v * 0.8, roll=0.0, lock=True)
    c.mark(t_dbs, 'the choir swells in under the pin\'s ripple (the GPU choir, D-flat sus2(#11), ppp): the sound lead '
                  'into F2.2', hit=False)
    # the string lights (celesta + harp, a cycling figure, straight eighths: the lights palette-cycle, never strobe)
    lights = []
    for a0, a1, up, v in ((t_party, t_lift, 0, 0.3), (t_lift, t_ex, 12, 0.36), (t_door1, t_racks, 0, 0.22)):
        t = a0
        i = 0
        while t < a1 - 0.05:
            p = nm(LIGHTS[i % 8]) + up
            if p > nm('Db6'):
                p -= 12
            vv = v * (1.0 if i % 4 == 0 else 0.8)
            if inside(t, W):
                vv *= 0.75                                     # (under the record: texture, softer)
            c.n('celesta', p, t, Q * 0.45, vv, lock=True)
            if i % 2 == 0:
                c.n('harp', nm(LIGHTS[(i + 3) % 8]) - 12, t, 1.2, vv * 0.8, lock=True)
            lights.append(round(t, 3))
            t += Q / 2
            i += 1
    shimmer_pitches = ['Db4', 'Ab3', 'Eb4', 'C4']
    c.n('shimmer', 'Db4', t_party, t_ex + 0.6 - t_party, 0.5, True, pitches=shimmer_pitches, density=10)
    c.n('shimmer', 'Db4', t_lift, t_ex + 0.4 - t_lift, 0.6, True, pitches=shimmer_pitches, density=14)
    c.ch('glasspad', ['Ab4', 'Eb5'], t_party, t_23 + 0.5 - t_party, 0.22, roll=0.0, lock=True, rel=1.0)
    c.mark(t_party, f'F2.2 ({how(c, t_party, e["party"])}): the GPU choir and glass shimmer, ppp; the string lights '
                    '(celesta, harp) cycling; no felt, no chip pulse, no swing (his POV is left)', hit=False)
    c.mark(t_lift, 'the chant\'s lift (warm, giddy, never a hymn): the choir adds C and E-flat, the lights climb an '
                   'octave, the shimmer thickens; no melody on the record (the chant is [V])', hit=False)
    c.mark(t_ex, f'the exchange ({how(c, t_ex, e["c07"])}): the lights stop; the choir thins', hit=False)
    # THE DOOR whole over the check-in (A-flat D-flat | C G, the G held into the racks)
    d1 = door(c, t_door1, DOOR_WHOLE, 0.44, hold_to=t_racks + 1.0)
    c.mark(t_door1, 'THE DOOR, whole, over the choir (his joke check-in; Mas raises his glass): it never cadences, '
                    'its G held', hit=False)
    # the racks hum along: GLYPH's grains (Ep2: grains, F5 C6 D-flat6; straight 16ths, half rests; celesta + chip)
    grains = []
    rng = np.random.default_rng(1509)
    t = t_racks + 2 * Q
    while t < t_23 - 0.1:
        if rng.random() < 0.5:
            p = GLYPH_G[int(rng.integers(0, 3))]
            c.n('celesta', p, t, 0.2, 0.3, lock=True)
            chip_det(c, 'lead2', p, t, 0.09, 0.32, duty=0.125, dec=0.05, sus=0.1, rel=0.04)
            grains.append(round(t, 3))
        t += S16
    c.mark(t_racks, f'the racks hum along ({how(c, t_racks, e["racks"])}): the choir swells (the racks are the choir); '
                    'GLYPH\'s grains on celesta and the 12.5 % chip (the glyph is on the room)', hit=False)
    # gravity: the choir thins to its no-third chord; the strings under it (D-flat, A-flat), sul tasto
    c.rebow('vc', 'Db3', t_23, t_ache + 0.4, 0.15, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.4, art='sus', lp=1500)
    c.rebow('vla', 'Ab3', t_turn, t_ache + 0.4, 0.13, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.4, art='sus', lp=1700)
    c.rebow('vln2', 'Eb4', t_turn + 0.1, t_ache + 0.4, 0.11, seg=5.0, xf=1.0, first_att=1.6, last_rel=0.4, art='sus',
            lp=2200)
    c.mark(t_23, f'2023 ({how(c, t_23, e["off23"])}): the choir thins to its no-third chord under the post and '
                 '"Someone should."; the cello\'s D-flat (gravity)', hit=False)
    c.mark(t_turn, f'the turn ({how(c, t_turn, e["turn"])}): the viola and violins join the choir\'s chord', hit=False)
    # THE DOOR again: its held #4 under the Publish click; then the same G becomes the Ache's
    d2 = door(c, t_door2, DOOR_WHOLE, 0.48, hold_to=t_ache + 0.9)
    c.mark(g_t, f'the Door\'s held #4 (G) lands {e["click"] - g_t:.2f} s before the Publish click ({how(c, g_t, e["cut14"])}'
                f'): warm resolve, no cadence; the click is the SFX\'s', hit=False)
    # the Ache under the fire (F2 C3 | G4 D-flat5, + C6 on glass), under the choir; it thins as the glow shrinks
    c.rebow('cb', 'F2', t_ache, t_glow + 1.6, 0.16, seg=5.0, xf=1.0, first_att=1.0, last_rel=1.2, art='sus', lp=900)
    c.rebow('vc', 'C3', t_ache, t_glow + 1.6, 0.14, seg=5.0, xf=1.0, first_att=1.0, last_rel=1.2, art='sus', lp=1300)
    c.ch('glasspad', ['G4', 'Db5'], t_ache, t_pin + 0.6 - t_ache, 0.3, roll=0.0, lock=True, rel=1.2)
    c.n('glasspad', 'C6', t_ache + BAR, t_glow - (t_ache + BAR) + 1.0, 0.2, lock=True, rel=1.0)
    c.mark(t_ache, f'the fire ({how(c, t_ache, e["fire2"])}): the Ache under the choir (F C | G D-flat): the Door\'s G '
                   'is the Ache\'s G; resolve and dread together', hit=False)
    c.mark(t_glow, f'the glow shrinks to one point ({how(c, t_glow, e["glow"])}): the bass lets go; the choir thins to '
                   'ppp and holds its no-third chord to the pin (no dropout: the bed stays over -35 LUFS-M)', hit=False)
    # ---- back: the felt a beat before the pin; V.O. 8 inside it; D-flat as he goes (the leap A-flat C); the pedal
    # the sul-tasto F pedal swells in first (over the choir's hold), the felt a beat later and soft (the score review:
    # the felt's return jumped from -52.8 to -17.3 LUFS-M; S9's soft entry)
    t_felt = t_pin + Q
    if vo8 and t_felt > vo8['on'] - 0.6:
        t_felt = t_pin
    c.pch('felt_ret', DR['F5'][0], t_felt, t_go - t_felt + 0.05, 0.15, roll=0.04, span_end=t_go - 0.03)
    c.n('felt_mech', 60, t_felt, 0.1, 0.18)
    c.rebow('vc', 'F3', t_pin - 0.9, t_st + 0.4, 0.17, seg=5.0, xf=1.0, first_att=1.6, last_rel=0.3, art='sus', lp=1500)
    c.rebow('vla', 'C4', t_pin - 0.8, t_st + 0.4, 0.15, seg=5.0, xf=1.0, first_att=1.8, last_rel=0.3, art='sus', lp=1700)
    c.mark(t_pin - 0.9, f'the pin ({how(c, t_pin, e["pin"])}): the sul-tasto F pedal swells in over the choir\'s hold',
           hit=False)
    c.mark(t_felt, 'the felt returns a beat later, soft (F, the open fifth); V.O. 8 inside it, nothing attacks',
           hit=False)
    lv = DR['Dbmaj9b'][0]
    c.pch('felt', lv, t_go, t_st - t_go + 0.3, 0.21, roll=0.025, span_end=t_st - 0.02)
    c.n('felt_mech', 60, t_go, 0.1, 0.25)
    c.n('felt', 'Ab4', t_go, BAR, 0.22)
    t_leap = c.next_bar(t_go + 0.3)
    if t_leap < e['door_close'] - 0.4 and not inside(t_leap, W):
        c.n('felt', 'C5', t_leap, t_st - t_leap, 0.21)
        chip(c, 'tri', 'C5', t_leap, 0.5, 0.3, att=0.004, dec=0.3, sus=0.3, rel=0.2)
    c.rebow('vc', 'Db3', t_go, t_st + 0.4, 0.14, seg=5.0, xf=1.0, first_att=0.8, last_rel=0.3, art='sus', lp=1500)
    c.mark(t_go, f'he goes ({how(c, t_go, e["leave"])}): D-flat; the felt\'s A-flat, then C on the bar (the knee\'s leap, '
                 'the chip under its C): the decision, no F after it', hit=False)
    # the stairs: the pedal (strings); the buzz is the out; it fades under the receipt's chatter into the band's push
    c.rebow('vc', 'F3', t_st, push + 0.6, 0.15, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.6, art='sus', lp=1400)
    c.rebow('vla', 'C4', t_st + 0.1, push + 0.6, 0.13, seg=5.0, xf=1.0, first_att=1.2, last_rel=0.6, art='sus', lp=1600)
    c.mark(t_st, f'the stairs ({how(c, t_st, e["stairs"])}): the felt rests; the pedal (F, C) holds through the buzz '
                 '(the out); it fades under the receipt\'s chatter (J %.1f s, SFX) into the band\'s push' %
                 (e['end'] - e['chatter']), hit=False)
    # ---- rides: the dark room's felt under the V.O. sits inside the bed; the party a touch up (warmth)
    rides = [(hs0 - 0.5, t_party - 0.3, -2.5),                 # his room: the felt under F2.2's warmth (render 2:
             (t_party - 0.3, t_ex, 1.0),                       # the dark room -18.9, the party -21.4, the check-in
             (t_ex, t_door1 - 0.2, 2.5), (t_racks, t_23, 1.0),  # -24.6, the turn -17.2; render 4: the check-in's
             #                                                   Door -13.5 LUFS-M with the exchange's +2.5 over it)
             (t_door2 - 0.2, t_ache, -3.0), (t_pin - 0.3, t_st, -2.0)]
    for ln, d in ((vo7, -2.0), (vo8, -0.5)):                  # the V.O. sits inside the bed (P01: about -24)
        if ln:
            rides.append((ln['on'] - 0.9, ln['end'] + 0.4, d))
    rides.sort()
    macro = ride_macro(rides, c.bar1 - 1.0, push + 1.5)
    secs = [('1 the empty office: the felt (D-flat), the thread (B-flat minor)', hs0, t_fm),
            ('2 Alyi far off (unscored); V.O. 7 inside F minor', t_fm, H[3][0]),
            ('3 TPOOL: A-flat (the chip, his past); the map: G-flat lydian; the ripple: the choir in', H[3][0], t_party),
            ('4 F2.2 the party: the choir, glass, the string lights; the chant\'s lift', t_party, t_ex),
            ('5 F2.2 the exchange (thin); the check-in: THE DOOR whole', t_ex, t_racks),
            ('6 F2.2 the racks: the choir swells; GLYPH\'s grains', t_racks, t_23),
            ('7 F2.2 2023: the no-third chord under the post and "Someone should."', t_23, t_door2),
            ('8 F2.2 the turn: THE DOOR, its #4 under the Publish click', t_door2, t_ache),
            ('9 F2.2 the fire: the Ache under the choir; the glow shrinks', t_ache, t_pin),
            ('10 the pin: the felt (F); V.O. 8; D-flat as he goes', t_pin, t_st),
            ('11 the stairs: the pedal; the buzz; into the band', t_st, push)]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    vo = [ln for ln in tl.lines if ln['kind'] == 'vo' and hs0 <= ln['on'] < push]
    meta = dict(
        id=c.name, title='Feel It (E02-09, Ep2 v1 Act Three sc 15, with F2.2)', mm='new to picture (P01 DARK ROOM + '
        'P10\'s Orb-era glossy colour + the Door, the GPU choir and the Ache)', usage='BI',
        family='P01 DARK ROOM (one felt piano) -> the Orb-era glossy colour (GPU choir aahs, glass shimmer, ppp) -> felt',
        tone='loneliness; warmth and joy (the chant, the check-in); gravity (the post, "Someone should."); resolve and '
             'dread together (the click, the fire); a determined evening',
        scenes=['Ep2 v1 Act Three sc 15 (15.01-15.19), F2.2 (15.06-15.16)'],
        motifs=['the felt (his interior), one chord a phrase, a top note in the gaps',
                'the GPU choir (D-flat sus2(#11), no third) with glass shimmer; the string lights (celesta, harp)',
                'THE DOOR whole, twice (the check-in; its #4 under the Publish click)', 'GLYPH\'s grains (F5 C6 D-flat6)',
                'the Ache (F C | G D-flat) under the fire', 'the knee\'s leap A-flat C as he goes'],
        motif_ids=[], key='D-flat, B-flat minor, F minor, A-flat, G-flat lydian (his room); D-flat sus2(#11) (F2.2); '
                          'the Ache over F; F open fifth; no A-natural; nothing below C3 in his room',
        composer='Ep2 v1 score pass (act3), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-20.0,
        album_lufs=-16.0,
        vo_windows=[(c.clk(ln['on']), c.clk(ln['end']), 'V.O.') for ln in vo],
        room_sfx=[dict(t0=c.clk(e['off23']), t1=c.clk(e['turn']), sfx='server_hum (office 2023, stand-in)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['ping'], 'pin_ping: the warm pin (the choir swells after it)'),
            (e['glyph'], 'glyph_shimmer: the SFX\'s grains (G6-F7; the score\'s stay at F5-D-flat6)'),
            (e['click'], 'post_click: Publish (on the Door\'s held G)'), (e['buzz'], 'phone_buzz_step_1: the out'))],
        audition=['91-117 s: the felt is his interior, never a sad-piano cliché', '117-124 s: the party is warm and '
                  'giddy, never a hymn (the choir is a tech cathedral)', '133.5-141 s: the Door over the check-in is '
                  'warm', '161-168 s: the click on the held G; the Ache under the fire is dread, not horror',
                  '175.4-185 s: the felt returns; D-flat and the leap as he goes'])
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=push + 0.8, tail_s=0.4, macro=macro)
    c.ev = dict({k: (round(v, 3) if isinstance(v, float) else v) for k, v in e.items()},
                harmony=[(round(t, 3), col) for t, col, _ in H], tops=tops, lights=len(lights), grains=len(grains),
                door1=[(round(t, 3), p) for t, p in d1], door2=[(round(t, 3), p) for t, p in d2],
                t_party=round(t_party, 3), t_lift=round(t_lift, 3), t_ex=round(t_ex, 3), t_racks=round(t_racks, 3),
                t_23=round(t_23, 3), t_turn=round(t_turn, 3), g_t=round(g_t, 3), t_ache=round(t_ache, 3),
                t_glow=round(t_glow, 3), t_pin=round(t_pin, 3), t_felt=round(t_felt, 3), t_go=round(t_go, 3),
                t_st=round(t_st, 3))
    return c, sc


# ================================================================ E02-10 THE BRIDGE: SET-PIECE SWING, the full band (P11)
TCH = {   # comp voicing (mid register), bass root, the walk's scale: no A natural anywhere
    'Fm11':      (['Bb3', 'Eb4', 'Ab4', 'C5'], 'F2', ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'D3', 'Eb3']),
    'Dbmaj9#11': (['F3', 'C4', 'Eb4', 'G4'], 'Db2', ['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3']),
    'Bbm9':      (['Db4', 'F4', 'Ab4', 'C5'], 'Bb1', ['Bb1', 'C2', 'Db2', 'Eb2', 'F2', 'Gb2', 'Ab2']),
    'Eb9':       (['Db4', 'F4', 'G4', 'Bb4'], 'Eb2', ['Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3']),
    'Eb9sus':    (['Db4', 'F4', 'Ab4', 'Bb4'], 'Eb2', ['Eb2', 'F2', 'Ab2', 'Bb2', 'C3', 'Db3']),
    'Abmaj9':    (['C4', 'Eb4', 'G4', 'Bb4'], 'Ab1', ['Ab1', 'Bb1', 'C2', 'Db2', 'Eb2', 'F2', 'G2']),
    'C7sus':     (['Bb3', 'Db4', 'F4', 'G4'], 'C2', ['C2', 'Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2']),
    'C7alt':     (['E3', 'Bb3', 'Eb4', 'Ab4'], 'C2', ['C2', 'Db2', 'Eb2', 'E2', 'Gb2', 'Ab2', 'Bb2']),
    'Gbmaj7#11': (['Bb3', 'Db4', 'F4', 'C5'], 'Gb2', ['Gb2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3', 'F2']),
}
BRASS = {   # the full band's shout voicings: (trumpets, trombones, saxes); no third over F, no A natural
    'Fm11':  (['Eb5', 'Ab5'], ['Bb3', 'Eb4'], ['C4', 'F4']),
    'Db':    (['Eb5', 'G5'], ['Ab3', 'C4'], ['F4', 'Ab4']),
    'C7alt': (['Eb5', 'Ab5'], ['E3', 'Bb3'], ['Gb4', 'Bb4']),
}
BUILD_F = ['F4', 'F4', 'G4', 'Ab4', 'C5', 'Ab4', 'G4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'Eb5', 'C5', 'Ab4']
ACC4 = (1.0, 0.72, 0.84, 0.72)
RUSH = {'F': ['F2', 'F2', 'C3', 'F2', 'Ab2', 'F2', 'Eb2', 'G2'],            # the scramble's bass, eighths
        'Db': ['Db2', 'Db2', 'Ab2', 'Db2', 'F2', 'Db2', 'C2', 'Eb2']}
RAIN = {   # the pad in the rain: four strings (vc vla vln2 vln1) and VOICE 5 (the bowed vibes' two notes)
    'Dbmaj9':    (['Db3', 'Ab3', 'C4', 'F4'], ['Eb5', 'G5']),
    'Bbm9':      (['Db3', 'F3', 'Ab3', 'C4'], ['Db5', 'F5']),
    'Gbmaj7#11': (['Gb2', 'Db3', 'F3', 'Bb3'], ['C5', 'F5']),
    'Fped':      (['F3', 'C4'], []),
}


def walk_bar(c, t0, chords, nxt_root, rng, vel=0.48, inst='ubass', two_feel=False, double='cb_pizz', stop_at=None,
             gate=0.92):
    """a walking bass over one bar (chords: [(beat, name)]): the root on each change, scale tones between, an approach
    into the next bar's root on beat 4; two_feel: half notes (root, then fifth or approach)"""
    out = []
    beats = [0, 2] if two_feel else [0, 1, 2, 3]
    prev = None
    for bt in beats:
        tb = t0 + bt * Q
        if stop_at is not None and tb >= stop_at - 0.02:
            break
        name = [n for b, n in chords if b <= bt + 1e-6][-1]
        _, root, scl = TCH[name]
        r = nm(root)
        if any(abs(b - bt) < 1e-6 for b, _ in chords):
            p = r
        elif bt == beats[-1] and nxt_root is not None:
            tgt = nm(nxt_root)
            while tgt - (prev if prev is not None else r) > 6:
                tgt -= 12
            while (prev if prev is not None else r) - tgt > 6:
                tgt += 12
            p = tgt + (1 if rng.random() < 0.5 else -1) if not two_feel else tgt + (2 if rng.random() < 0.5 else -2)
        else:
            cur = prev if prev is not None else r
            cand = [nm(s) for s in scl if 0 < abs(nm(s) - cur) <= 4] or [nm(s) for s in scl]
            p = int(rng.choice(cand))
        p = max(nm('Ab1'), min(nm('Eb3'), p))
        if p % 12 == 9:                       # never an A natural, even passing
            p -= 1
        prev = p
        d = (2 if two_feel else 1) * Q * gate
        if stop_at is not None:
            d = min(d, stop_at - tb - 0.02)
        out.append(c.n(inst, p, tb, d, vel * (1.0 if bt == 0 else 0.9)))
        if double:
            c.n(double, p, tb, min(Q * 0.6, d), vel * 0.5, rel=0.16)
    return out


def tracks_bridge(pause_s):
    T = palette()
    T['ubass'].gain_db = 0.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -9.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['cb'].gain_db, T['cb'].sends = -2.0, {'hall': -12, 'room': -16}
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    T['jazz'].gain_db = 4.0
    T['vibes'].gain_db, T['vibes'].sends = -4.0, {'room': -12, 'hall': -14}
    dup(T, 'vibes', 'vb', gain_db=-14.0, sends={'hall': -9, 'room': -14})        # the bowed vibes: VOICE 5 (measured in
    #                                                     Act Two: at 0.22 they read 10 dB over four strings at 0.13)
    T['hn'].gain_db, T['hn'].sends = -7.0, {'hall': -8, 'room': -12}
    T['tpt_stac'].gain_db, T['tbn_stac'].gain_db = -5.0, -5.0
    T['tsax_stac'].gain_db = -5.0
    T['hn_stac'].gain_db = -6.0
    for k in ('tpt_stac', 'tbn_stac', 'tsax_stac', 'hn_stac'):     # the stac samples speak ~12 ms in (render 3's hit
        T[k].latency_ms = 11.0                                    # check: the brass-only pickup read 13.3 ms late)
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -3.0, {'room': -12, 'snes': -14}, [('hp', 220), ('lp', 5600)]
    T['lead2'].gain_db, T['lead2'].sends = -8.0, {'room': -12}
    dup(T, 'vln1', 'vln_oct', gain_db=-8.0, sends={'hall': -10, 'room': -14},       # the violins: the Build's octave
        eq=list(T['vln1'].eq) + [('peq', 440.0, -8.0, 5.0)])
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -9, 'room': -16}
    T['harp'].gain_db, T['harp'].pan = -9.0, -0.3
    # the floor under the two-feel and the forecast's swing: an arco bass on the root, low and dark (the score review,
    # 2026-10-09: the band emptied to -40/-47 dBFS before each bar line, then re-attacked: a 20-30 dB pump)
    dup(T, 'cb', 'cb_floor', gain_db=-1.0, sends={'hall': -14, 'room': -18}, eq=list(T['cb'].eq) + [('lp', 700)])
    T['grand'].gain_db = -4.0
    T['glasspad'].gain_db = -10.0
    T['timp'].gain_db = -8.0
    T['sub'].gain_db = -12.0
    T['crash'].gain_db = -10.0
    T['tri'].gain_db = -10.0
    T['noise'].gain_db = -12.0
    return T


def cue_bridge(tl):
    doors = _B(tl, '17.01', 190.0)
    c = V.Cue('e02-10-the-bridge', tl, anchor=doors, anchor_bar=2, bars=int((tl.length + 4.0 - (doors - BAR)) / BAR) + 3,
              swing=1.0)
    W = still_windows(tl)
    talk = talk_windows(tl, 0.15, 0.2)
    rng = np.random.default_rng(1710)
    e = dict(doors=doors, run=_B(tl, '17.02', 194.42), honk1=_snd(tl, '17.02', 'car_honk_1', _B(tl, '17.03', 201.0) - 0.8),
             card=_B(tl, '17.03', 201.0), freeze=_snd(tl, '17.03', 'freeze_hit_F', _B(tl, '17.03', 201.0) + 1.0),
             fc=_B(tl, '17.04', 204.79), driver=_B(tl, '17.05', 219.42), already=_B(tl, '17.06', 222.63),
             sees=_B(tl, '17.07', 228.54), scr=_B(tl, '17.08', 233.21), call=_B(tl, '17.09', 238.0),
             draft=_B(tl, '17.10', 244.54), vo9b=_B(tl, '17.11', 249.13), fcast=_B(tl, '17.12', 253.71),
             thumb=_B(tl, '17.13', 263.83), night=_B(tl, '17.14', 268.83), posts=_B(tl, '17.15', 270.83),
             honk_btn=_B(tl, '17.16', 282.71), rain=_B(tl, '17.17', 288.58), ink=_B(tl, '17.18', 298.58),
             menu=_B(tl, '17.19', 305.58), pause=_snd(tl, '17.19', 'ui_pause_tap', _B(tl, '17.19', 305.58) + 2.0),
             nopost=_B(tl, '17.20', 310.0), blimp=_B(tl, '17.21', 315.42), end=tl.length,
             thunder=_snd(tl, '17.17', 'thunder_tuned_F', _B(tl, '17.17', 288.58) + 7.4))
    lights = [s['t'] for s in tl.sounds if s['beat'] == '17.21' and s['name'] == 'blimp_lights_off']
    e['dread'] = _snd(tl, '17.21', 'dread_sting', lights[-1] if lights else e['blimp'] + 2.8)
    e['honks'] = [round(s['t'], 3) for s in tl.sounds if s['name'].startswith('car_honk') and s['t'] >= e['doors']]
    fc2 = _line(tl, 'e2-a3-0018', 'forecaster', e['already'] + 0.35)
    callx = _line(tl, 'e2-a3-0019', 'mas', e['call'] + 2.3)
    vo9 = _line(tl, 'e2-vo-09', 'mas', e['vo9b'] + 0.3)
    vo10 = _line(tl, 'e2-vo-10', 'mas', e['thumb'] + 1.5)
    T = tracks_bridge(c.clk(e['pause']))
    push = doors - Q + SW                                        # the swung push into the doors
    # ---- phrase points
    full_in = lead_in(c, e['run'])                               # the full band's pickup pre-laps the run's cut
    b_full = c.next_bar(full_in + 0.05)                          # its first bar
    peak = b_full + BAR                                          # the second bar: C7(#9b13)
    cutoff = b_full + 2 * BAR                                    # the cut-off: the next downbeat (the traffic stops)
    reent = lead_in(c, e['fc'])                                  # the band re-enters under the Forecaster
    scr = lead_in(c, e['scr'])
    mediant = place(c, lead_in(c, e['draft']), W, floor=scr)
    fcast = lead_in(c, e['fcast'])
    hold = place(c, lead_in(c, e['thumb']), W, floor=fcast)
    night = lead_in(c, e['night'])
    ped = lead_in(c, e['posts'])
    rain = lead_in(c, e['rain'], step=Q / 2)
    rain2 = place(c, lead_in(c, e['ink'], step=Q / 2), W)
    rain3 = place(c, lead_in(c, e['menu'], step=Q / 2), W)
    final = place(c, lead_in(c, e['blimp'], step=Q / 2), W)
    dread = e['dread']
    # ================================================================ A: the doors (the band in; the Build compiles)
    c.ch('vibes', TCH['Fm11'][0], push, Q * 1.2, 0.38, roll=0.006)
    c.n('ubass', 'F2', push, doors + Q - push, 0.52)
    c.n('cb_pizz', 'F2', push, 0.5, 0.3, rel=0.16)
    c.n('jazz', 53, push, 0.4, 0.34)
    c.ch('tpt_stac', ['Eb5', 'C5'], push, 0.14, 0.36, roll=0.0, lock=True)
    c.ch('tbn_stac', ['Bb3'], push, 0.14, 0.34, roll=0.0, lock=True)
    c.mark(push, f'DESIGNED HIT: the swung push into NopeAI\'s doors ({how(c, push, doors)}): the band in; the receipt '
                 'already pouring (its chatter is the SFX\'s J)')
    bars_a = []
    t = doors
    while t < full_in - 0.3:
        bars_a.append(t)
        t += BAR
    names_a = ['Fm11', 'Fm11', 'Dbmaj9#11'][:len(bars_a)]
    for k_, t0 in enumerate(bars_a):
        nxt = TCH[names_a[k_ + 1]][1] if k_ + 1 < len(names_a) else 'F2'
        walk_bar(c, t0, [(0, names_a[k_])], nxt, rng, vel=0.5, stop_at=full_in)
        v = TCH[names_a[k_]][0]
        c.ch('vibes', v, t0, Q * 1.3, 0.32, roll=0.008)
        if sw_at(t0, 1.5) < full_in - 0.1:
            c.ch('vibes', v[1:], sw_at(t0, 1.5), Q * 0.4, 0.24, roll=0.006)
        if t0 + 2 * Q < full_in - 0.1:
            c.ch('vibes', v, t0 + 2 * Q, Q * 0.8, 0.26, roll=0.008)
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nhatf: ..x...x.\nkick[vel=0.35]: x...x...', doors, full_in, 0.48)

    def build(t0, count, vel, stop_at=None, inst='lead', octave=12, pizz=False, oct_inst=None, idx0=0):
        out = []
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.012:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.006)
            p = nm(BUILD_F[(idx0 + i) % 16]) + octave
            chip(c, inst, p, t, d, vel * ACC4[i % 4], duty=0.25, sus=0.45, rel=0.035)
            if oct_inst:
                c.n(oct_inst, p - 12, t, 0.14, 0.3 * ACC4[i % 4], lock=True, art='spic')
            if pizz and i % 4 == 0:
                c.n('vln1', p - 12, t, 0.2, 0.24, art='pizz')
            out.append(t)
        return out
    if bars_a:
        build(bars_a[0] + Q, 4, 0.34, stop_at=full_in, octave=0)
        c.mark(bars_a[0] + Q, 'the Build compiles on the chip (pass 1: 4)', hit=False)
    if len(bars_a) > 1:
        build(bars_a[1], 8, 0.34, stop_at=full_in, octave=0, pizz=True)
        c.mark(bars_a[1], 'the Build (pass 2: 8), the violins\' pizzicato under it', hit=False)
    # ================================================================ B: THE FULL BAND (the run across the lanes)
    tp, tb, ts = BRASS['Fm11']
    pick2 = b_full - Q + SW                                      # the pickup's second hit: the and-of-4
    for inst, ps in (('tpt_stac', tp), ('tbn_stac', tb), ('tsax_stac', ts)):
        c.ch(inst, ps, full_in, 0.12, 0.5, roll=0.0, lock=True)
        if pick2 > full_in + 0.2:
            c.ch(inst, ps, pick2, 0.14, 0.55, roll=0.0, lock=True)
    c.n('crash', 49, b_full, 1.5, 0.42, lock=True)
    c.mark(full_in, f'DESIGNED HIT: THE FULL BAND\'s pickup ({how(c, full_in, e["run"])} to the run): the receipt down '
                    'the hill and across five lanes (the episode\'s one full-band stretch: a pickup and two bars)')
    for k_, (t0, name, bname) in enumerate(((b_full, 'Fm11', 'Fm11'), (peak, 'C7alt', 'C7alt'))):
        walk_bar(c, t0, [(0, name)], 'C2' if k_ == 0 else 'C2', rng, vel=0.58, stop_at=cutoff)
        v = TCH[name][0]
        tp, tb, ts = BRASS[bname]
        hits = [(0.0, 0.16, 0.6), (1.5, 0.14, 0.52), (3.0, 0.3, 0.56)] if k_ == 0 else \
               [(0.0, 0.16, 0.62), (1.5, 0.14, 0.54), (2.5, 0.12, 0.5)]
        for bt, d, vv in hits:
            th = sw_at(t0, bt)
            for inst, ps in (('tpt_stac', tp), ('tbn_stac', tb), ('tsax_stac', ts), ('hn_stac', tb)):
                c.ch(inst, ps, th, d, vv * (0.85 if inst == 'hn_stac' else 1.0), roll=0.0)
            c.ch('vibes', v, th, Q * 0.6, 0.36, roll=0.006)
        c.ch('hn', v[:3], t0, BAR * 0.95, 0.3, roll=0.0, att=0.06, rel=0.3)
        build(t0, 16, 0.4, stop_at=cutoff - Q + SW if k_ == 1 else None, octave=12, oct_inst='vln_oct')
    # the phrase end: the full band's last stab on the and-of-4, then THE CUT-OFF on the downbeat (the traffic stops)
    last = cutoff - Q + SW
    tp, tb, ts = BRASS['C7alt']
    for inst, ps in (('tpt_stac', tp), ('tbn_stac', tb), ('tsax_stac', ts), ('hn_stac', tb)):
        c.ch(inst, ps, last, 0.2, 0.62, roll=0.0, lock=True)
    c.ch('vibes', TCH['C7alt'][0], last, 0.4, 0.36, roll=0.006, lock=True)
    c.n('ubass', 'C2', last, cutoff - last - 0.02, 0.56, True)
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nsnare[vel=0.5]: ...x..x.\nhatf: ..x...x.\nkick[vel=0.5]: x..x..x.', full_in,
                 cutoff, 0.56)
    c.mark(peak, 'the peak: C7(#9b13), the Build in octaves with the violins', hit=False)
    c.mark(last, 'DESIGNED HIT: the phrase\'s last stab (C7(#9b13), the and-of-4); then THE CUT-OFF on the downbeat '
                 '(the traffic stops; the honk lands in the gap: the SFX\'s)')
    V.clip_before(c, cutoff, insts={'ubass', 'cb_pizz', 'jazz', 'lead', 'vln_oct', 'vibes', 'hn'}, rel=0.08)
    # ================================================================ C: the stall (a C pedal through the card)
    c.rebow('cb', 'C2', cutoff - 0.02, reent + 0.3, 0.2, seg=5.0, xf=1.0, first_att=0.25, last_rel=0.3, art='sus',
            lp=900)
    c.rebow('vc', 'C3', cutoff + 0.05, reent + 0.3, 0.14, seg=5.0, xf=1.0, first_att=0.8, last_rel=0.3, art='sus',
            lp=1300)
    c.rebow('vla', 'G3', cutoff + 0.3, reent + 0.3, 0.12, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.3, art='sus',
            lp=1500)
    c.mark(cutoff, 'the stall: the arco bass holds C (the cello C, the viola G: an open fifth) through the card; the '
                   'freeze\'s F is the SFX\'s, a fourth over it', hit=False)
    # ================================================================ D: the refusal (a two-feel under the Forecaster)
    c.ch('vibes', TCH['C7sus'][0], reent, Q * 1.4, 0.3, roll=0.008)
    c.n('ubass', 'C2', reent, Q * 0.9, 0.46)
    c.mark(reent, f'the Forecaster ({how(c, reent, e["fc"])}): the band again, thin: a two-feel, the ride soft, the '
                  'vibes; no lead under his terms (respect)', hit=False)
    plan_d = ['Fm11', 'Fm11', 'Dbmaj9#11', 'C7sus', 'Fm11', 'Bbm9', 'Eb9', 'Abmaj9', 'Dbmaj9#11', 'Dbmaj9#11',
              'C7sus', 'C7sus', 'C7sus', 'C7sus']
    t = c.next_bar(reent + 0.05)
    bars_d = []
    while t < scr - 0.1:
        bars_d.append(t)
        t += BAR
    walkq = c.next_bar(e['sees'] - 0.3)                        # Mas sees it: the bass walks quarters again
    for k_, t0 in enumerate(bars_d):
        name = plan_d[min(k_, len(plan_d) - 1)]
        nxt = plan_d[min(k_ + 1, len(plan_d) - 1)] if k_ + 1 < len(bars_d) else 'Fm11'
        two = t0 < walkq - 0.05
        walk_bar(c, t0, [(0, name)], TCH[nxt][1], rng, vel=0.44 if two else 0.48, two_feel=two, stop_at=scr,
                 gate=0.98 if two else 0.92)
        c.n('cb_floor', TCH[name][1], t0, min(BAR, scr - t0) + 0.08, 0.2, art='sus', att=0.25, rel=0.35)
        v = TCH[name][0]
        soft = 0.75 if inside(t0, talk) else 1.0
        c.ch('vibes', v, t0, Q * 1.3, 0.3 * soft, roll=0.008)
        if sw_at(t0, 2.5) < scr - 0.1:
            c.ch('vibes', v[1:], sw_at(t0, 2.5), Q * 0.4, 0.2 * soft, roll=0.006)
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nhatf: ..x...x.', c.next_bar(reent + 0.05), walkq, 0.34)
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nhatf: ..x...x.\nkick[vel=0.3]: x...x...', walkq, scr, 0.42)
    t_resp = c.next_beat((fc2['end'] if fc2 else e['already'] + 3.6) + 0.04)
    if not inside(t_resp, talk) and t_resp < e['sees'] - 0.3:
        c.ch('hn', ['Ab3', 'C4', 'Eb4', 'F4'], t_resp, max(1.6, e['sees'] - t_resp - 0.2), 0.3, roll=0.02, att=0.35,
             rel=0.6)
        c.mark(t_resp, 'after "Already did.": the horns\' soft D-flat chord (respect; no hit): the pen withdraws (SFX)',
               hit=False)
    c.mark(walkq, 'Mas sees it, his phone lit: the bass walks quarters again, the kick feathers in', hit=False)
    # ================================================================ E: the scramble (the bass in eighths, the Build)
    c.mark(scr, f'THE SCRAMBLE ({how(c, scr, e["scr"])}): the band drops to the bass and the Build\'s chip lead, busier on '
                'the same grid (swung eighths in the bass, the Build\'s straight 16ths)', hit=False)
    still_b = merge([(ln['on'] - 0.15, ln['end'] + 0.2) for ln in (callx, vo9) if ln])
    t = scr
    i = 0
    while t < fcast - 0.05:
        pedal = 'F' if t < mediant - 0.01 else 'Db'
        bt = (t - c.bar1) / Q
        p = RUSH[pedal][i % 8]
        v = 0.5 if i % 2 == 0 else 0.42
        if inside(t, still_b):
            v *= 0.62
        c.n('ubass', p, t, Q * 0.42, v)
        if i % 2 == 0:
            c.n('cb_pizz', p, t, 0.3, v * 0.45, rel=0.12)
        i += 1
        whole = math.floor(bt + 1e-9)
        frac = bt - whole
        t = (c.bar1 + (whole + 1) * Q) if frac > 0.1 else (c.bar1 + whole * Q + SW)
    t = c.next_beat(scr + 0.05)
    passes = []
    cnt = [4, 8, 12, 16, 16, 16, 16, 16]
    k_ = 0
    while t < fcast - 0.3:
        n0 = cnt[min(k_, len(cnt) - 1)]
        fits = [n for n in (n0, 12, 8, 4) if n <= n0 and not any(a < t + n * S16 and b > t for a, b in still_b)
                and t + n * S16 < fcast - 0.05]
        if not fits:                    # a pass never starts inside his call or V.O. 9: wait for the window's end
            nx = max([b for a, b in still_b if a < t + 4 * S16 and b > t] + [t + Q])
            t = c.next_beat(nx + 0.05)
            continue
        n = fits[0]
        build(t, n, 0.36, stop_at=fcast - 0.05, octave=0)
        passes.append((round(t, 3), n))
        t = c.next_beat(t + n * S16 + 0.3)
        k_ += 1
    c.mark(mediant, 'the draft: the pedal moves a mediant down (F to D-flat), the Build keeps compiling', hit=False)
    if callx:
        c.mark(callx['on'], 'his call ("everyone who signed one..."): the Build out, the bass under it (he is heard acting)',
               hit=False)
    if vo9:
        c.mark(vo9['on'], 'V.O. 9 on his still face: the Build out, the bass softer (the frantic inside, no attack on '
                          'the words)', hit=False)
    # ================================================================ F: the forecast (the swing again, A-flat)
    c.ch('vibes', TCH['Abmaj9'][0], fcast, Q * 1.3, 0.32, roll=0.008)
    c.n('ubass', 'Ab2', fcast, c.next_bar(fcast) - fcast - 0.02, 0.46)
    c.n('cb_floor', 'Ab1', fcast, c.next_bar(fcast + 0.05) - fcast + 0.08, 0.2, art='sus', att=0.25, rel=0.35)
    c.mark(fcast, f'the Forecaster beside him ({how(c, fcast, e["fcast"])}): the swing returns (A-flat), thin under his '
                  'forecast; no hit on the laugh', hit=False)
    plan_f = ['Abmaj9', 'Dbmaj9#11', 'Bbm9', 'Eb9sus', 'Eb9sus']
    t = c.next_bar(fcast + 0.05)
    k_ = 0
    while t < hold - 0.1:
        name = plan_f[min(k_, len(plan_f) - 1)]
        nxt = plan_f[min(k_ + 1, len(plan_f) - 1)]
        walk_bar(c, t, [(0, name)], TCH[nxt][1], rng, vel=0.46, stop_at=hold)
        c.n('cb_floor', TCH[name][1], t, min(BAR, hold - t) + 0.08, 0.2, art='sus', att=0.25, rel=0.35)
        v = TCH[name][0]
        soft = 0.75 if inside(t, talk) else 1.0
        c.ch('vibes', v, t, Q * 1.3, 0.3 * soft, roll=0.008)
        if sw_at(t, 1.5) < hold - 0.1:
            c.ch('vibes', v[1:], sw_at(t, 1.5), Q * 0.4, 0.2 * soft, roll=0.006)
        t += BAR
        k_ += 1
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nhatf: ..x...x.', fcast, hold, 0.36)
    # V.O. 10: a held chord (strings sul tasto, the bass arco); nothing attacks under it
    hv = ['Eb3', 'Ab3', 'Db4', 'F4']
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), hv):
        c.rebow(inst, p, hold, night + 0.3, 0.15, seg=5.0, xf=1.0, first_att=0.7, last_rel=0.3, art='sus', lp=2200)
    c.rebow('cb', 'Eb2', hold, night + 0.3, 0.15, seg=5.0, xf=1.0, first_att=0.6, last_rel=0.3, art='sus', lp=900)
    c.mark(hold, f'his thumb over Post ({how(c, hold, e["thumb"])}): the band thins to a held E-flat 9sus (strings, the '
                 'arco bass); V.O. 10 inside it', hit=False)
    # ================================================================ G: the night (one held chord, 2 s)
    hv, hvb = RAIN['Dbmaj9']
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), hv):
        c.rebow(inst, p, night, ped + 0.4, 0.16, seg=5.0, xf=1.0, first_att=0.4, last_rel=0.4, art='sus', lp=2300)
    c.rebow('cb', 'Db2', night, ped + 0.3, 0.15, seg=5.0, xf=1.0, first_att=0.4, last_rel=0.3, art='sus', lp=900)
    c.ch('vb', hvb, night + 0.05, ped - night + 0.3, 0.22, roll=0.02, art='bowed')
    c.mark(night, f'the night ({how(c, night, e["night"])}): one held chord, D-flat maj9 (the strings, the bowed vibes), '
                  'the bridge\'s lights cycling once', hit=False)
    # ================================================================ H: the posts (the bass pedal; the honks)
    t = c.next_bar(ped - 0.01) - BAR if c.next_bar(ped - 0.01) - ped > 0.3 else c.next_bar(ped - 0.01)
    c.n('ubass', 'F2', ped, max(0.6, c.next_beat(ped + 0.05) + Q - ped), 0.44)
    t = c.next_bar(ped + 0.05)
    k_ = 0
    while t < rain - 0.05:
        for bt, p in ((0, 'F2'), (2, 'C2' if k_ % 2 == 0 else 'F2')):
            tb_ = t + bt * Q
            if tb_ >= rain - 0.05:
                break
            v = 0.4 if not inside(tb_, W) else 0.34
            c.n('ubass', p, tb_, min(2 * Q * 0.92, rain - tb_ - 0.03), v)
            c.n('cb_pizz', p, tb_, 0.4, v * 0.45, rel=0.16)
        t += BAR
        k_ += 1
    c.rebow('vc', 'F3', ped, rain + 0.3, 0.1, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.3, art='sus', lp=1300)
    c.mark(ped, f'the next afternoon ({how(c, ped, e["posts"])}): the bass pedal (F, C) under his posts (the record '
                'dry); the honks take the phrase ends; "Updating." and the driver play over it, no hit', hit=False)
    # ================================================================ I: the pad in the rain (five voices; VOICE 5)
    plan_i = [(rain, 'Dbmaj9', 'May 20: the pad in the rain (the thunder is tuned to F: the pad\'s F4)'),
              (rain2, 'Bbm9', 'the ink runs'), (rain3, 'Gbmaj7#11', 'the voice menu: his thumb finds VOICE 5'),
              (final, 'Fped', 'the blimp sags: the pad thins to its pedal (F, C)')]
    for i, (t0, col, why) in enumerate(plan_i):
        t1 = plan_i[i + 1][0] if i + 1 < len(plan_i) else dread
        voices, vbs = RAIN[col]
        lastp = i + 1 == len(plan_i)
        insts = ('vc', 'vla', 'vln2', 'vln1') if len(voices) == 4 else ('vc', 'vla')
        for inst, p in zip(insts, voices):
            c.rebow(inst, p, t0 - (0.0 if i == 0 else 0.25), t1 + (0.3 if not lastp else 0.25), 0.15 if col != 'Fped'
                    else 0.17, seg=5.0, xf=1.0, first_att=1.2 if i == 0 else 0.9, last_rel=0.3 if not lastp else 0.25,
                    art='sus', lp=2200)
        if vbs:
            v_end = min(t1, e['pause']) if t0 < e['pause'] else None
            if v_end is None or v_end - t0 > 0.6:
                c.ch('vb', vbs, t0 + 0.05, (v_end or t1) - t0 - 0.05, 0.22, roll=0.03, art='bowed',
                     rel=0.25 if v_end is not None and v_end == e['pause'] else 0.8)
        c.mark(t0, f'the pad: {col}: {why}', hit=False)
    # a few harp harmonics, irregular (never on the rain's own drops: the SFX)
    for k_, (bb, bt) in enumerate(((1, 2.5), (3, 1.0), (6, 3.5), (8, 2.0), (11, 1.5))):
        th = c.bar(int(c.bar_of(rain)) + bb) + (bt - 1) * Q
        if th < final - 0.5 and not inside(th, W):
            p = ['F5', 'Ab5', 'Db6', 'C6', 'Eb5'][k_]
            c.n('harp', p, th, 1.8, 0.3, lock=True)
    c.mark(e['pause'], 'his thumb taps Pause: VOICE 5 (the pad\'s fifth voice, the bowed vibes) stops; four voices hold '
                       '(no hit, no notification)', hit=False)
    c.mark(e['nopost'], 'NopeAI\'s post (two fragments): the pad holds, no change (the record dry)', hit=False)
    # chip: the Build's tag, once, small, after the ink (the show's stamp in the rain; F4-C5, never on a drop)
    t_tag = c.next_beat(rain2 + BAR)
    if t_tag < rain3 - 0.6 and not inside(t_tag, W):
        chip(c, 'lead2', 'C5', t_tag, 0.25, 0.3, duty=0.125, dec=0.2, sus=0.2, rel=0.2)
        chip(c, 'lead2', 'F5', t_tag + Q, 0.6, 0.28, duty=0.125, dec=0.4, sus=0.2, rel=0.4)
        c.mark(t_tag, 'the chip, once, in the rain: the Build\'s tag (C F), small and far ("shipped", no longer)',
               hit=False)
    # ================================================================ J: the DREAD sting on the blimp's last light
    c.n('sub', 'F1', dread, 1.2, 0.34, True, punch=0.5, click=0.0, decay=1.4)
    c.n('grand', 'F2', dread, 1.7, 0.4, True)
    c.n('grand', 'C3', dread + 0.01, 1.7, 0.32, True)
    for p, dt in (('G4', 0.0), ('Db5', 0.004), ('C6', 0.008)):
        chip_det(c, 'lead', p, dread + dt, 0.5, 0.4, cents=10.0, duty=0.125, dec=0.6, sus=0.15, rel=0.9)
    c.ch('glasspad', ['G4', 'Db5'], dread, 1.6, 0.32, roll=0.0, lock=True, rel=0.6)
    c.n('timp', 'F2', dread, 1.6, 0.3, lock=True)
    c.mark(dread, 'DESIGNED HIT: the DREAD sting (P08: chip, no third: the Ache on the 12.5 % chip, glass, the grand\'s '
                  'F and C, a sub and timpani on F) on the blimp\'s last running light; one stab, then air into the black '
                  '(the score plays the claimed dread_sting)')
    # ---- thin: under every line the comp is softer and the ride lighter (the lead is already out of the talk)
    V.thin(c, {'talk': dict(soften={'vibes': 0.82, 'jazz': 0.8}), 'mas': dict(drop={'lead', 'vln_oct'},
                                                                           soften={'vibes': 0.7, 'jazz': 0.7}),
               'vo': dict(drop={'lead', 'vln_oct', 'tpt_stac', 'tbn_stac'}, soften={'vibes': 0.6, 'jazz': 0.6})},
           t0=doors, t1=night)
    secs = [('A the doors: the push, the walk, the Build compiling', push, full_in),
            ('B the run: THE FULL BAND (a pickup and two bars), the peak on C7(#9b13); the cut-off', full_in, cutoff),
            ('C the stall: the C pedal through the card', cutoff, reent),
            ('D the refusal: the two-feel under the Forecaster and the driver; respect; Mas sees it', reent, scr),
            ('E the scramble: the bass in eighths, the Build; his call; the draft; V.O. 9', scr, fcast),
            ('F the forecast: the swing again (A-flat); V.O. 10 on a held chord', fcast, night),
            ('G the night: one held chord (2 s)', night, ped),
            ('H the posts: the bass pedal; the honks; "Updating."; the driver', ped, rain),
            ('I the rain: the pad (five voices; VOICE 5 stops on the pause); NopeAI\'s post', rain, final),
            ('J the pedal; the DREAD sting on the blimp\'s last light; the black', final, e['end'])]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    vo = [ln for ln in tl.lines if ln['kind'] == 'vo' and ln['on'] >= doors]
    meta = dict(
        id=c.name, title='The Bridge (E02-10, Ep2 v1 Act Three sc 17: the S3; act-out 2)',
        mm='new to picture (P11 SET-PIECE SWING, the full band) + P01 (the rain) + P08 (the DREAD out)', usage='BI',
        family='P11 SET-PIECE SWING (the full band at its peak only) -> the scramble -> a held night -> the bass pedal '
               '-> a pad in the rain -> P08 DREAD',
        tone='the big comic set-piece (scored straight, the stop its only joke); respect; frantic hands under a still '
             'face, the relief of hearing him act; a laugh at the forecast (no hit); pathos in the rain; the act-out '
             'on a DREAD sting',
        scenes=['Ep2 v1 Act Three sc 17 (17.01-17.21)'],
        motifs=['the Build\'s chip lead (compiling 4, 8; whole in octaves with the violins at the peak; the scramble)',
                'brass hits at phrase ends (the full band\'s shout; the honks take the posts\' phrase ends)',
                'one held chord through the night', 'a pad in the rain, five voices (VOICE 5 stops on the pause)',
                'the DREAD sting (the Ache on the chip, no third)'],
        motif_ids=[], key='F minor and its mediants (Fm11, D-flat maj9(#11), B-flat m9, E-flat 9, A-flat maj9, '
                          'G-flat maj7(#11)); the peak on C7(#9b13); the F pedal; no A-natural',
        composer='Ep2 v1 score pass (act3), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-19.5,
        album_lufs=-16.0,
        vo_windows=[(c.clk(ln['on']), c.clk(ln['end']), 'V.O.') for ln in vo],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            [(e['honk1'], 'car_honk_1: the traffic stops (in the cut-off\'s gap)'),
             (e['freeze'], 'freeze_hit_F: the card (over the C pedal: F a fourth up)'),
             (e['thunder'], 'thunder_tuned_F: the pad carries F4'), (e['pause'], 'ui_pause_tap: VOICE 5 stops'),
             (dread, 'dread_sting: CLAIMED (the score plays the DREAD out)')]
            + [(h, 'car_honk: the posts\' phrase ends (no brass there)') for h in e['honks'][1:]])],
        audition=['189.8-200 s: the band is the show\'s own (chip Build, walking upright, vibes, a brass shout), never '
                  'lounge; the full band only for the run', '200 s: the cut-off reads as the traffic stopping, not a gag',
                  '233-253 s: the scramble is frantic in the hands, quiet under his voice',
                  '268.5-270.6 s: one held chord, the night', '288-318 s: the rain pad is a played room, not a synth '
                  'wash; VOICE 5 leaving is felt, not noticed', '318.2 s: the DREAD is one stab, then air'])
    rides = [(push - 0.2, full_in - 0.1, -1.5),               # the doors: featured -16 (render 2: -15.8)
             (full_in - 0.1, cutoff + 0.2, -3.5),              # the peak at about -14 LUFS-M (P11; render 2: -12.7)
             (scr - 0.1, fcast, -1.0)]                         # the scramble under the band's level
    for ln in (vo9, vo10):
        if ln:
            rides.append((ln['on'] - 0.3, ln['end'] + 0.3, -3.5))   # the V.O. inside the bed (about -24)
    rides.sort()
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    macro = ride_macro(rides, c.bar1 - 1.0, e['end'] + 1.0)
    sc = c.finish(T, meta, length_end=e['end'] + 0.3, tail_s=0.2, macro=macro)
    c.ev = dict({k: (round(v, 3) if isinstance(v, float) else v) for k, v in e.items()}, push=round(push, 3),
                full_in=round(full_in, 3), b_full=round(b_full, 3), peak=round(peak, 3), cutoff=round(cutoff, 3),
                reent=round(reent, 3), scr=round(scr, 3), mediant=round(mediant, 3), fcast=round(fcast, 3),
                hold=round(hold, 3), night=round(night, 3), ped=round(ped, 3), rain=round(rain, 3),
                rain2=round(rain2, 3), rain3=round(rain3, 3), final=round(final, 3), passes=passes)
    return c, sc


def build_all(tl):
    out = {}
    out['clock'] = cue_clock(tl)
    out['bridge'] = cue_bridge(tl)
    out['feel'] = cue_feel(tl, out['clock'][0].ev['hum_stop'], out['bridge'][0].ev['push'])
    return {k: out[k] for k in ('clock', 'feel', 'bridge')}


def music_runs(tl):
    runs = []
    for b in tl.beats:
        m = next((c.split(': ', 1)[1] for c in b['b'].get('cues', []) if c.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


# ================================================================ lay-in, the prelap
def lay(tl, built, work):
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')     # noqa: E731
    ck, cf, cb = (built[k][0] for k in ('clock', 'feel', 'bridge'))
    hs = ck.ev['hum_stop']
    push = cb.ev['push']
    layers = [
        dict(name=built['clock'][1].name, wav=wav('clock'), T0=ck.T0, a0=0.0, a1=hs + 0.05, fin=0.0, fout=0.12),
        dict(name=built['feel'][1].name, wav=wav('feel'), T0=cf.T0, a0=hs - 0.02, a1=push + 0.05, fin=0.015, fout=0.9),
        dict(name=built['bridge'][1].name, wav=wav('bridge'), T0=cb.T0, a0=push - 0.012, a1=tl.length, fin=0.004,
             fout=0.35),
    ]
    designed = []                    # no designed silence inside Act Three: one continuous bed, three handovers
    stings = [(cb.ev['dread'], tl.length, 'E02-10: the DREAD sting (designed)')]
    return layers, designed, stings


def write_prelap(tl, built, work, tag):
    """render/music<tag>-prelap.wav: THE CLOCK's first tick(s) under Act Two's black (from its designed stop to Act
    Three's first frame), continuous with music<tag>.wav's first sample"""
    import soundfile as sf
    ck, sk = built['clock']
    x, _ = sf.read(os.path.join(work, f'{sk.name}-underscore.wav'), always_2d=True, dtype='float64')
    a = ck.ev['stop2']
    i0, i1 = int(round((a - ck.T0) * SR)), int(round((0.0 - ck.T0) * SR))
    if i0 < 0 or i1 <= i0:
        return None
    y = x[i0:i1].copy()
    k = int(0.005 * SR)
    y[:k] *= np.linspace(0.0, 1.0, k)[:, None]
    fp = os.path.join(HERE, 'render', f'music{tag}-prelap.wav')
    sf.write(fp, y.astype(np.float32), SR, subtype='PCM_24')
    pk = float(np.abs(y).max())
    return dict(file=os.path.relpath(fp, V.REPO), seconds=round(len(y) / SR, 4), starts_at_act2_s=round(a, 4),
                first_tick_s=round(ck.ev['first'], 4), peak_dbfs=round(20 * math.log10(pk + 1e-12), 1),
                lay=f'under Act Two\'s black: its last {len(y) / SR:.3f} s (Act Two\'s designed stop at {a:.3f} s on this '
                    f'clock, i.e. the black\'s first frame), so THE CLOCK\'s first tick sounds {-ck.ev["first"]:.3f} s '
                    'before Act Three\'s first frame (the plan\'s J 0.8 s, on the first grid beat after the stop); '
                    'continuous with music' + tag + '.wav\'s first sample. mix_episode.py lays it on Act Two\'s score bus '
                    'from that time (score_bus: the next chapter\'s pre-lap, ending on Act Two\'s last sample, at Act '
                    'Three\'s head gain), over Act Two\'s black (digital zero in Act Two\'s stem: its silences_designed), '
                    'and Act Three\'s head fade is off (the score review, 2026-10-09)',
                fade_in_s=0.005)


# ================================================================ main
def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    reals = mark_real(tl)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    built = build_all(tl)
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s; real lines '
              f'(from the plan): {reals}; record on screen: {len(record_windows(tl))}. Its music runs:')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m[:110] or "(no music string)"}')
        for k, (c, sc) in built.items():
            print(k, sc.name, V.note_qa(sc), f'file T0 {c.T0:.3f}')
            for t, lab, h in sorted(c.marks):
                print(f'   {t:8.3f} {"*" if h else " "} {lab[:160]}')
            print('   ev:', {kk: vv for kk, vv in c.ev.items() if not isinstance(vv, list)})
        return
    if args.render is not None:
        for k in (args.render or list(built)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, designed, stings = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, designed=designed)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', max(0.0, a0), min(tl.length, a1)) for k, (c, sc) in built.items()
            for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed, stings=stings)
    cb = built['bridge'][0]
    res['head_momentary_max'] = V.momentary_max(mix, 0.0, 5.0)
    res['full_band_momentary_max'] = V.momentary_max(mix, cb.ev['full_in'], cb.ev['cutoff'])
    res['dread_momentary_max'] = V.momentary_max(mix, cb.ev['dread'], min(tl.length, cb.ev['dread'] + 1.5))
    res['vo_windows_lufs'] = []
    from engine.mix import lufs
    for ln in tl.lines:
        if ln['kind'] == 'vo':
            i0, i1 = int(ln['on'] * SR), int(ln['end'] * SR)
            z = mix[:, i0:i1]
            res['vo_windows_lufs'].append(dict(line=ln['id'], t0=round(ln['on'], 2), t1=round(ln['end'], 2),
                                               lufs=round(lufs(z), 2) if np.abs(z).max() > 0 else None))
    prelap = write_prelap(tl, built, work, tag)
    by_name = {sc.name: (k, c, sc) for k, (c, sc) in built.items()}
    cues = []
    for L in layers:
        k, c, sc = by_name[L['name']]
        cues.append(dict(cue=L['name'], key=k, start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                         family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO),
                         laid_at_s=round(c.T0, 4), level=res['cues'][L['name']],
                         target_lufs=sc.meta.get('underscore_lufs'), engine_qa=V.engine_qa(work, sc.name),
                         note_qa=V.note_qa(sc), motifs=sc.meta.get('motifs'),
                         events={kk: (round(v, 3) if isinstance(v, float) else v) for kk, v in c.ev.items()},
                         sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in sorted(c.marks)]))
    sections = []
    for k, (c, sc) in built.items():
        for lab, a0, a1 in c.sections:
            sections.append(dict(section=f'{sc.name}: {lab}', start=round(max(0.0, a0), 3),
                                 end=round(min(tl.length, a1), 3)))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), lock_sha1=V.lock_sha1(path), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
        level='underscore (each cue at its engine master: E02-08 -20.5, E02-09 -20, E02-10 -19.5 LUFS-I), dry of '
              'dialogue; the mixer ducks it (E02-08 9 dB, E02-09 7, E02-10 9 by mood)',
        cues=cues, silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack or entry on a story beat; '
                           'keep its attack') for k, (c, sc) in built.items() for t, lab, h in c.marks
                      if lab.startswith('DESIGNED HIT')],
        claims_sfx=['14.07:chair_hum_choir', '17.21:dread_sting'],
        sections=sections, real_lines=reals,
        record_on_screen=[dict(t0=round(a, 3), t1=round(b, 3), text=x) for a, b, x in record_windows(tl)],
        prelap=prelap, ringout=None,
        ringout_note='none: the DREAD sting\'s air ends with the act (its tail faded into the last 0.35 s); the black\'s '
                     'J 1.2 s (the beacon\'s motor and the quartet\'s first pizzicato) is Act Four\'s own pre-lap',
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['chair_hum_choir (14.07) and dread_sting (17.21): CLAIMED by the score (it plays the chair\'s hum '
                      'as the GPU choir, diegetic into score, and the DREAD out); the SFX board has neither',
                      'door_pivot_creak (14.12): THE CLOCK\'s grid is anchored on it and stops on its beat; keep its '
                      'attack (the fixes pass: 14.11\'s four screws, which the grid was anchored on, are cut)',
                      'freeze_hit_F (14.09, 17.03): over the F pedal (14.09) and the C pedal (17.03)',
                      'thunder_tuned_F (17.17): the rain pad carries F4 there; tune it to F, never A',
                      'car_honk_1-5 (17.02, 17.15, 17.16): the score leaves the phrase ends to them; nothing tuned',
                      'blimp_lights_off x4 (17.21): no music on the first three; the DREAD on the fourth'],
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    if prelap:
        print('prelap:', prelap['file'], prelap['seconds'], 's, peak', prelap['peak_dbfs'], 'dBFS')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    for r in res['rows']:
        print(f'  {r["start"]:7.2f}-{r["end"]:7.2f} {r["lufs_i"]} LUFS-I {r["true_peak_dbtp"]} dBTP  {r["section"][:90]}')
    print('unmarked digital silence:', res['unmarked_digital_silence'], 'holes:',
          [h for h in res['holes_below_-60'] if not h['inside_marked']], 'undesigned fragments:',
          res['undesigned_fragments'])
    print('V.O. windows:', res['vo_windows_lufs'])
    print('momentary: head', res['head_momentary_max'], 'full band', res['full_band_momentary_max'], 'dread',
          res['dread_momentary_max'])


if __name__ == '__main__':
    main()
