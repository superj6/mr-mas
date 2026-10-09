#!/usr/bin/env python3
"""E02 v1 · ACT FOUR "as a guest" (sc 18-22) · the segment's score, laid on the segment's own clock (0 = its first frame).
Four renders: E02-11 LEVERAGE, QUARTET (one performance through sc 18-20, from the black's pre-lap to the complaint's
exit), two layers on its grid (E02-11b the keynote's walk-on bed, diegetic: the lobby's wall screen, then the campus PA
far off; E02-11c F2.1's band through the 16-bit sample-chip, a render of its own because the sample-chip post runs over
the whole buffer) and E02-12 ONE DOOR (sc 22), plus render/music-el-prelap.wav (the quartet's first pizzicato under Act Three's black, J 1.2 s) and
render/music-el-ringout.wav (the Door's held sharp-4, left open over the match cut into the tag).

The brief (manifest.md §6 E02-11, E02-12; proposal.md sc 18-22, "The feeling curve" and "The seams"; script-v1.md's MUSIC
lines; the beat plan's J and L cuts; the lock's music runs).  The mood map: a jolt of truth and a held breath, then comedy
and a dry chill (18); a giddy cheer, a small thrill (his post), a lonely call, nostalgia and a pang, wit, a pang at the
gate (19); a laugh, a smile at the rope, then a jolt and his still face deciding (20); stillness, a held breath, the one
quiet ache (22).  README.md has the cue sheet (seconds, cue, what plays, why) and the measurements.

  s (EL lock)        cue                       what plays
  -1.04 -  266.9     E02-11 LEVERAGE, QUARTET  P03 LEVERAGE as a string quartet: straight pizzicato eighths on varied
                                               pitches (3+3+2, cello and viola), a muted 808 (k808 through 150 Hz + a
                                               muted bass drum), the violins' close dyad shifting a semitone when the
                                               leverage moves, one chip noise tick on some eighths.  B-flat at the
                                               lighthouse (the Lighthouse cell on marimba and harp), F as the beam crosses
                                               the boardroom; the pedal alone under Neleh and the card (Neleh's high
                                               harmonic rising a semitone on his face); the split; the 808 drops out on
                                               "present."; Mario's Addendum (it gains a bar each time) cut off by "It's
                                               that we might win." and the Ache under it; the lobby's A-flat (the giddy
                                               violins); the stop on his post; the call; F2.1 (ERA T2: the band through
                                               the 16-bit sample-chip, the young Water Line, the pins' falling figure)
                                               over the quartet's A-flat pedal; the garden-party quartet (D-flat, three
                                               phrases, one violin under the exchange); the cello's C on the gate; the
                                               808 again under zAI, Nole's short fanfare (claimed), the 808 out on the
                                               padlock; the lobby's morning pedal (F); the cello's last pizzicato on the
                                               (FOR NOW) note's landing
  94.2  -  171.0     E02-11b the keynote bed   ELPPA's walk-on bed (an original media bed, diegetic, 96, D-flat lydian:
                                               a glassy pad, a Rhodes ostinato, a soft sub), through the lobby's wall
                                               screen, then the campus PA far off; J 0.8 s under the reminder, L 0.8 s
                                               across the cut to the campus, gone with the push into his phone
  170.8 -  188.7     E02-11c the F2.1 band     ERA T2 (MM-06 II): the band through the 16-bit sample-chip, swung, A-flat
                                               colours (no F in its bass), in on the render front with the quartet's own
                                               chord; the young Water Line (the nudge twice); one falling chip note a grey
                                               pin; over E02-11's A-flat pedal
  266.9 -  283.0     room tone only            the designed silence: the dark room's Jun 19 post (W8) and the white
  283.0  - 319.0     E02-12 ONE DOOR           P01 DARK ROOM, sparse: one felt note a phrase (the first, E-flat, the D-flat
                                               fifth's 9th, as the lot appears), a sul-tasto D-flat fifth; the Door, its
                                               first note missing, on non-vibrato flute through the door under "Use flyer
                                               on door"; the GPU choir under the glimpse; the designed stop on the flap's
                                               spring (room tone only); the return as his hand lowers; the Door again
                                               across the walk, its G held, no cadence, ringing over the cut (the out)

Every sync point comes from the lock (beats, lines, sounds, on-screen items) and the plan's J and L cuts, so the score
re-lays itself when timing moves.  Chord changes that land on cuts pre-lap them by the latest grid point at least 0.15 s
before the cut (about 0.25 s); no change lands inside a V.O., a line of his, a real line or the record on screen.  The
record plays dry (OST rule 10): no melody and no change under posts, the quoted card, the highlighted line, the ad's end
card and the docket.

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0): the 96 BPM grid; the knee's cells; chip in every cue; no
A-natural anywhere; the knee never whole; straight for the machine and LEVERAGE, swung for the people (F2.1); no comic
scoring (the stop is the only tool: the 808 on "present." and on the padlock, the eighths on his post, the Addendum on
"we might win"); no Mickey-Mousing; continuous per sequence; the two designed silences marked; designed hits marked.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --dry --el          # runs, marks, note QA
    MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --assemble --el     # re-lay render/_work/el, measure
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                    # the segment checks
Out: render/music[-el].wav (the segment's exact length), render/music[-el]-prelap.wav, render/music[-el]-ringout.wav and
cues[-el].json.  Nothing here has been listened to.
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
from v3lib import palette, nm   # noqa: E402
from engine.core import SR, FAMILIES, lp, hp, to_stereo   # noqa: E402
from engine.era import futz   # noqa: E402
from engine.sampler import GU   # noqa: E402

SEG = 'act4'
Q, BAR, S16 = V.Q, V.BAR, V.S16
E8 = Q / 2.0
SW = Q * 2.0 / 3.0                     # the house swing: the and lands 10 frames after its beat
PLAN = os.path.join(V.REPO, 'show', 'episodes', 'ep02', 'production', 'v1', 'beat-plan', 'act4.json')


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


def plan_arrive(bid, default):
    """a beat's arrival length from the plan (`arrive`: {s, what}): the plan's own number, which the picture draws to"""
    a = plan_doc()['beats'].get(bid, {}).get('arrive')
    return float(a['s']) if isinstance(a, dict) and a.get('s') is not None else default


HAND_S = 2.0        # 22.08: his hand is up by the shot's first beat, held two beats, and lowers at 2.0 s (frame 48 of the
#                     shot): written into the beat plan's picture note for 22.08, so the picture draws to the score's
#                     return (the score review, 2026-10-09, S5: it was an estimate in the code alone)


def mark_real(tl):
    """Ep2's lock prints no quotation marks and its takes carry no source tag: the beat plan's `note` does ([P ...]
    public record, [V ...] verbatim, [K ...] confirmed).  In Act Four: Neleh's two lines through the podcast player"""
    pl = plan_doc()['lines']
    out = []
    for ln in tl.lines:
        note = (pl.get(ln['id'], {}).get('note') or '').lstrip()
        if note.startswith(('[P', '[V', '[K')) and ln['kind'] != 'vo':
            ln['kind'] = 'real'
            out.append(ln['id'])
    return out


def record_windows(tl):
    """the record on screen: every post (his, Nole's, Alyi's), a broadcast's lower third, a quoted document (the board's
    card, the ad's end card), and a document whose beat cites a facts row (the highlighted line, the docket tab):
    (t0, t1, text).  (Act Three's rule, widened to sourced documents: the highlighted line and the docket carry no
    quotation marks but are the record.)"""
    pb = plan_doc()['beats']
    out = []
    for b in tl.beats:
        why = pb.get(b['id'], {}).get('why') or ''
        pic = pb.get(b['id'], {}).get('picture') or ''
        for o in b['b'].get('onscreen', []) or []:
            txt = o.get('text') or ''
            k = o.get('kind')
            quoted = any(q in txt for q in '"“”') and k in ('post', 'doc', 'caption', 'ui')
            sourced = k == 'doc' and ('facts A' in why or '[H' in pic) and not txt.startswith('—')
            if k in ('post', 'lower-third') or quoted or sourced:
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


def talk_windows(tl, pre=0.15, post=0.2, kinds=None):
    """lines (the melody stays out of all of them: the pockets)"""
    return merge([(ln['on'] - pre, ln['end'] + post) for ln in tl.lines if kinds is None or ln['kind'] in kinds])


def inside(t, ws, pad=0.0):
    return next(((a, b) for a, b in ws if a - pad <= t < b + pad), None)


def _snd(tl, bid, name, default, k=1):
    try:
        return tl.snd(bid, name, k=k, default=default) if tl.has(bid) else default
    except KeyError:
        return default


def _sndall(tl, bid, name):
    return [s['t'] for s in tl.sounds if s['beat'] == bid and s['name'] == name]


def _line(tl, lid, who, near):
    if lid in tl.L:
        return tl.L[lid]
    ls = [ln for ln in tl.lines if ln['who'] == who]
    return min(ls, key=lambda ln: abs(ln['on'] - near)) if ls else None


def _B(tl, bid, default):
    return tl.B(bid) if tl.has(bid) else default


def _E(tl, bid, default):
    return tl.E(bid) if tl.has(bid) else default


def _os(tl, bid, prefix, default, until=False):
    """an on-screen item's start (or its end) on the segment clock"""
    for b in tl.beats:
        if b['id'] != bid:
            continue
        for o in b['b'].get('onscreen', []) or []:
            if (o.get('text') or '').startswith(prefix):
                if until:
                    return b['t0'] + (o['until'] if o.get('until') is not None else b['t1'] - b['t0'])
                return b['t0'] + (o.get('at') or 0.0)
    return default


def lead_in(c, t, min_lead=0.15, step=E8):
    """the latest grid point (every `step` s: an eighth by default) at least min_lead before t: a change that lands on
    a cut pre-laps it by about a quarter second (Ep1 v3.5's rule; LEVERAGE is straight, so no swung and)"""
    k = math.floor((t - min_lead - c.bar1) / step + 1e-9)
    return c.bar1 + k * step


def how(c, t, cut):
    k = (t - c.bar1) / Q
    kind = 'on the beat' if abs(k - round(k)) < 0.02 else ('on an eighth' if abs(2 * k - round(2 * k)) < 0.04
                                                             else 'off the grid')
    return f'{kind}, {cut - t:.2f} s before the cut' if cut >= t else f'{kind}, {t - cut:.2f} s after the cut'


def place(c, t, ws, floor=-1e9, limit=1e9, step=E8):
    """a change at t, moved out of any still window: to the first grid point after it when that is clear of the next
    window and before `limit`, else to the latest grid point at least 0.2 s before it"""
    for _ in range(6):
        w = inside(t, ws)
        if not w:
            return t
        after = c.bar1 + math.ceil((w[1] + 0.05 - c.bar1) / step - 1e-9) * step
        nxt = min([a for a, b in ws if a > w[1]] + [1e9])
        if after < nxt - 0.1 and after < limit:
            t = after
        else:
            early = lead_in(c, w[0], min_lead=0.2, step=step)
            t = early if early > floor + Q else after
    return t


def grid(c, t0, t1, step=E8):
    """the grid points (every `step` s from the cue's bar 1) in [t0, t1)"""
    k = math.ceil((t0 - c.bar1) / step - 1e-6)
    out = []
    t = c.bar1 + k * step
    while t < t1 - 1e-6:
        out.append(t)
        t += step
    return out


def sw_at(t0, beat):
    """a beat position from t0 with the house swing on the eighths (x.5 lands 10 frames after its beat)"""
    whole = math.floor(beat + 1e-9)
    frac = beat - whole
    return t0 + whole * Q + (SW if abs(frac - 0.5) < 1e-6 else frac * Q)


def chip(c, inst, p, t, d, v, duty=0.25, **x):
    """a chip note (locked to the grid: the machine's own voice)"""
    kw = dict(duty=duty, att=0.002, dec=0.09, sus=0.35, rel=0.06)
    kw.update(x)
    return c.n(inst, p, t, d, v, True, **kw)


def ride_macro(rides, t_start, t_end, ramp=0.3):
    """fader points [(t, dB)] for rides [(t0, t1, dB)] (a step per ride, each edge ramped over 2 x ramp s, never past
    half-way to its neighbours); overlapping rides add (a V.O. ride inside a section's ride).  Act Three's version."""
    lvl = lambda t: sum(d for a, b, d in rides if a <= t < b)      # noqa: E731
    pts = [(t_start, lvl(t_start))]
    xs = sorted({a for a, _, _ in rides} | {b for _, b, _ in rides})
    for i, x in enumerate(xs):
        r = min([ramp] + [(x - xs[i - 1]) / 2.0 for _ in (0,) if i > 0] + [(xs[i + 1] - x) / 2.0 for _ in (0,)
                                                                            if i + 1 < len(xs)])
        pts += [(x - r, lvl(x - 1e-3)), (x + r, lvl(x + 1e-3))]
    pts.append((t_end, lvl(t_end)))
    return pts


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


def wall_tv(x):
    """the keynote stream on the lobby's wall screen: a TV's speaker (futz 'tv'), a touch of the room"""
    y = futz(np.asarray(x, dtype=np.float64), 'tv', drive=1.15)
    return np.asarray(y, dtype=np.float64) * 10 ** (-3.5 / 20)     # (render 1: the bed alone read -22.6 through the TV)


def far_pa(x):
    """the same stream on the campus PA, far off across the lawn: the arena slap, the highs gone, mono"""
    y = futz(np.asarray(x, dtype=np.float64), 'pa', drive=1.3)
    y = lp(np.asarray(y, dtype=np.float64), 2600, 2)
    m = 0.5 * (y[0] + y[1])
    return np.stack([m, m]) * 10 ** (-7.0 / 20)                     # (render 1: -27.9 alone at -5 dB)


# ================================================================ the Door and the GPU choir (OST §2.9)
GPU = ['Db3', 'Ab3', 'Eb4', 'G4']                  # D-flat sus2(#11), no third (+C5)
DOOR_MISSING = [('Db5', 2), ('C5', 1), ('G4', 3)]  # WHERE'S ALYI?: the Door with its first note (A-flat) missing


def door(c, t0, notes, vel, hold_to=None, inst='door'):
    """the Door on non-vibrato flute (sermon pace); the last note (its #4) held to hold_to; never a cadence"""
    t = t0
    out = []
    for i, (p, beats) in enumerate(notes):
        last = i == len(notes) - 1
        d = (max(beats * Q, hold_to - t) if (last and hold_to) else beats * Q * 0.97)
        c.n(inst, p, t, d, vel * (1.0 if i == 0 else 0.95), art='nv', att=0.08 if i == 0 else 0.03,
            rel=1.1 if last else 0.2)
        out.append((round(t, 3), p))
        t += beats * Q
    return out


# ================================================================ E02-11 LEVERAGE, QUARTET (P03)
# the pizzicato eighths' cells (MM-11's 3+3+2 grouping on varied pitches): the cello takes the eighths 1 and 4 and
# anything under C3, the viola the rest; never one pitch at an even rate
CELLS = {
    'Bb': [['Bb2', 'F3', 'Db3', 'Bb2', 'F3', 'Db3', 'Eb3', 'F3'], ['Bb2', 'F3', 'C3', 'Bb2', 'F3', 'C3', 'Db3', 'C3'],
           ['Bb2', 'Gb3', 'Db3', 'Bb2', 'Gb3', 'Db3', 'F3', 'Eb3'], ['Bb2', 'F3', 'Db3', 'Bb2', 'F3', 'Db3', 'C3', 'Db3']],
    'F':  [['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Db3', 'C3'], ['F2', 'C3', 'Bb2', 'F2', 'C3', 'Bb2', 'Eb3', 'C3'],
           ['F2', 'Db3', 'Ab2', 'F2', 'Db3', 'Ab2', 'C3', 'Bb2'], ['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Gb2', 'Ab2']],
    'Ab': [['Ab2', 'Eb3', 'C3', 'Ab2', 'Eb3', 'C3', 'Bb2', 'C3'], ['Ab2', 'Eb3', 'Bb2', 'Ab2', 'Eb3', 'Bb2', 'C3', 'Eb3']],
    'Db': [['Db3', 'Ab3', 'F3', 'Db3', 'Ab3', 'F3', 'Eb3', 'F3'], ['Db3', 'Ab3', 'G3', 'Db3', 'Ab3', 'G3', 'F3', 'Ab3']],
    'Bbm': [['Bb2', 'F3', 'Db3', 'Bb2', 'F3', 'Db3', 'C3', 'Db3'], ['Bb2', 'F3', 'C3', 'Bb2', 'F3', 'C3', 'Ab2', 'C3']],
    'Eb': [['Eb2', 'Bb2', 'Ab2', 'Eb2', 'Bb2', 'Ab2', 'Db3', 'Bb2'], ['Eb2', 'Bb2', 'F3', 'Eb2', 'Bb2', 'Ab2', 'Db3', 'C3']],
}
ACC = (1.0, 0.72, 0.8, 0.95, 0.72, 0.8, 0.9, 0.74)       # the 3+3+2 accents (eighths 1, 4 and 7)
VLN_PZ = {'Ab': (['C5', 'G5'], ['Eb5', 'Bb5'], ['C5', 'Eb5']), 'Db': (['F5', 'C6'], ['Ab5', 'Eb6'], ['F5', 'Ab5']),
          'Bbm': (['Db5', 'Ab5'], ['F5', 'C6'], ['Db5', 'F5']), 'Eb': (['Db5', 'Bb5'], ['F5', 'Ab5'], ['Eb5', 'Bb5'])}
LOBBY = ['Ab', 'Db', 'Bbm', 'Eb']                         # the deal's day: a two-bar cycle (A-flat maj9, D-flat maj9(#11),
#                                                           B-flat m9, E-flat 9sus): brighter colours away from F
LOBBY_CH = {'Ab': ['Ab2', 'Eb3', 'G3', 'Bb3', 'C4'], 'Db': ['Db3', 'Ab3', 'C4', 'F4', 'G4'],
            'Bbm': ['Bb2', 'F3', 'Ab3', 'C4', 'Db4'], 'Eb': ['Eb3', 'Bb3', 'Db4', 'F4', 'Ab4']}
LIGHT = ['F4', 'Bb4', 'Db5']                              # the Lighthouse cell: a 3-note cell in quarters (realigns every
#                                                           3 bars: the beam sweeps one step a beat)
ADD_HEAD = [('Bb3', 1), ('C4', 1), ('Db4', 1), ('F4', 1), ('Eb4', 1.5), ('Db4', 0.5), ('C4', 1), ('Bb3', 1)]
ADD_TAIL = {1: [('C4', 0.5), ('Db4', 0.5), (None, 3)],                                     # the Addendum's tail:
            2: [('C4', 0.5), ('Db4', 0.5), ('Eb4', 1), ('F4', 1), (None, 1), ('Gb4', 2), (None, 2)],   # it climbs and
            3: [('C4', 0.5), ('Db4', 0.5), ('Eb4', 1), ('F4', 1), ('Gb4', 1), ('Ab4', 2), (None, 6)]}   # never cadences
DYAD = [('C5', 'Db5'), ('Db5', 'D5'), ('D5', 'Eb5')]      # the violins' close dyad: a semitone up each time he gains
#                                                           ground ("present.", "also present.")
T2 = {   # F2.1 (ERA T2, MM-06 II): the band through the 16-bit sample-chip in A-flat colours (no F major):
    #      (the sample-chip piano's rootless chord, the sample-chip upright's root)
    'Abmaj9': (['C4', 'Eb4', 'G4', 'Bb4'], 'Ab2'), 'Dbmaj9': (['C4', 'Eb4', 'F4', 'Ab4'], 'Db2'),
    'Fm9': (['Ab3', 'C4', 'Eb4', 'G4'], 'F2'), 'Ebsus': (['Db4', 'F4', 'Ab4', 'Bb4'], 'Eb2'),
}
YOUNG_WL = 'F4/4 G4/8 F4/8 G4/8 F4/8 r/4'                  # the young Water Line: the nudge twice, a little cocky
GARDEN = [   # the garden-party arrangement (D-flat; the #11 is its one wrong element; never a wedding march):
    #          (chord: the cello's root, the vln2 and viola chord tones), the first violin's bar
    (('Db2', ['F3', 'Ab3', 'C4', 'G4']), 'Ab4/4 Db5/8 Eb5/8 F5/4 Eb5/4'),
    (('Gb2', ['Bb3', 'Db4', 'F4', 'Ab4']), 'Db5/4. Bb4/8 Ab4/2'),
    (('Eb2', ['Gb3', 'Bb3', 'Db4', 'F4']), 'Gb4/8 Ab4/8 Bb4/4 Db5/4 Eb5/4'),
    (('Ab2', ['Db4', 'Eb4', 'Gb4', 'Bb4']), 'F5/2. r/4'),
    (('Db2', ['F3', 'Ab3', 'C4', 'G4']), 'Ab4/8 Bb4/8 Db5/4 G5/2'),
    (('Bb2', ['Db4', 'F4', 'Ab4', 'C5']), 'r/4 F5/4 Eb5/4 Db5/4'),
    (('Gb2', ['Bb3', 'Db4', 'F4', 'C5']), 'C5/4. Db5/8 Eb5/4 F5/4'),
    (('Ab2', ['Db4', 'Eb4', 'Gb4', 'C5']), 'Eb5/2 r/2'),
]
NOLE = ['C4', 'F4', 'Bb4', 'Eb5']                          # the Launch: the title's quartal stack, fired; it falls off one
#                                                           note short of A-flat 5 (OST §2.7)


def tracks_leverage():
    T = palette()
    notch_vc = [('peq', 111.3, -10.0, 8.0), ('peq', 109.9, -12.0, 16.0), ('peq', 216.0, -10.0, 7.0),
                ('peq', 440.0, -9.0, 5.0)]     # (render 1: a fixed body resonance at 109.9 Hz over the F pedal)
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb', 'k808', 'bdrum_muted', 'noise', 'timp'):
        T[k].drift_ms = 0.0
    # the pizzicato: the cello's and the viola's bodies (A2, A3, A4) notched (Act Three's finding), the violins' 440
    dup(T, 'vc', 'vc_pz', eq=list(T['vc'].eq) + notch_vc, gain_db=-4.0, pan=0.3, sends={'hall': -12, 'room': -12},
        hum_ms=2.0)
    dup(T, 'vc_pz', 'vc_last', latency_ms=20.0)  # (render 1: the last pizzicato's C3 spoke 21.6 ms after its mark)
    dup(T, 'vla', 'vla_pz', eq=list(T['vla'].eq) + [('peq', 216.0, -9.0, 7.0), ('peq', 440.0, -9.0, 5.0)], gain_db=-4.0,
        pan=0.15, sends={'hall': -12, 'room': -12}, hum_ms=2.0)
    dup(T, 'vln1', 'vln_pz', eq=list(T['vln1'].eq) + [('peq', 440.0, -12.0, 5.0)], gain_db=-7.0, pan=-0.35,
        sends={'hall': -11, 'room': -14}, hum_ms=2.0)
    # the arco: sul tasto (low-passed per note), soft
    for k in ('vln1', 'vln2'):
        T[k].gain_db, T[k].sends = -6.0, {'hall': -10, 'room': -16}
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -3.0, {'hall': -11, 'room': -16}
    T['cb'].gain_db, T['cb'].sends = -5.0, {'hall': -12, 'room': -16}
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    # the garden's arco quartet (light, detached): its own copies, so the sul-tasto settings above stay put
    dup(T, 'vln1', 'g_vln1', gain_db=-2.0, sends={'hall': -9, 'room': -14}, pan=-0.4)
    dup(T, 'vln2', 'g_vln2', gain_db=-7.0, sends={'hall': -10, 'room': -14}, pan=-0.15)
    dup(T, 'vla', 'g_vla', gain_db=-7.0, sends={'hall': -10, 'room': -14},
        eq=list(T['vla'].eq) + [('peq', 216.0, -6.0, 7.0), ('peq', 440.0, -6.0, 5.0)])
    # the muted 808: a pitched sub-thud through 150 Hz + a muted bass drum (never a kit; MM-11)
    T['k808'].eq, T['k808'].gain_db = [('lp', 150), ('hp', 26)], -9.0
    T['bdrum_muted'].gain_db = -11.0
    T['noise'].gain_db = -13.0
    T['tri'].gain_db = -12.0
    T['lead'].gain_db, T['lead'].sends = -9.0, {'room': -12, 'snes': -12}
    T['lead2'].gain_db, T['lead2'].sends = -12.0, {'room': -14}
    # the Lighthouse cell (marimba + harp) and the Ache's glass
    T['marimba'].gain_db, T['marimba'].sends = -10.0, {'room': -12, 'hall': -12}
    T['harp'].gain_db, T['harp'].pan = -10.0, -0.3
    T['glasspad'].gain_db = -11.0
    T['timp'].gain_db = -10.0
    # Nole's Launch: staccato trumpets (they speak ~12 ms in: Act Three's finding), a chip burst, timpani
    T['tpt_stac'].gain_db, T['tpt_stac'].latency_ms = -8.0, 11.0
    T['tpt_stac'].sends = {'room': -10, 'hall': -12}
    return T


def eighths(c, t0, t1, colour, vel, rng, vfac=None, cello_only=False, ticks=True, out=None):
    """the LEVERAGE engine: straight pizzicato eighths (locked: the rack LEDs' eighths) in [t0, t1) on a colour's
    cells, the 3+3+2 accents, the cello under C3 and on eighths 1 and 4, the viola above; a soft chip noise tick on
    some eighths (varied clock, never one pitch at an even rate); vfac(t) -> a velocity factor (the talk)"""
    cells = CELLS[colour]
    n = 0
    for t in grid(c, t0, t1):
        k = int(round((t - c.bar1) / E8))
        i = k % 8
        bar = k // 8
        p = cells[bar % len(cells)][i]
        f = vfac(t) if vfac else 1.0
        if f <= 0:
            continue
        v = vel * ACC[i] * f
        lowp = nm(p) < nm('C3')
        if i in (0, 3) or lowp:
            c.n('vc_pz', p, t, 0.2, v, lock=True, art='pizz')
        elif not cello_only:
            c.n('vla_pz', p, t, 0.2, v * 0.92, lock=True, art='pizz')
        else:
            continue
        n += 1
        if ticks and i in (1, 4, 7) and (bar + i) % 3 != 0 and f > 0.5:
            c.n('noise', 60, t, 0.03, 0.2 + 0.05 * ((bar + i) % 3), lock=True, clock=float(16000 + 4000 * (i % 3)),
                dec=0.02, sus=0.0, rel=0.02, hp=3000)
        if out is not None:
            out.append(round(t, 3))
    return n


def thud(c, t, p, v):
    """the muted 808: a pitched, low-passed sub-thud and a muted bass drum (MM-11's)"""
    c.n('k808', p, t, 0.4, v, lock=True, decay=0.35, punch=6.0, drive=1.2, click=0.05)
    c.n('bdrum_muted', 60, t, 0.2, v * 0.55, lock=True)


def thuds(c, t0, t1, p, v, stop_before=None, vfac=None, out=None):
    """the 808 on beat 1 of every bar and the and-of-3 every other bar (never two close hits: no heartbeat)"""
    b0 = int(math.ceil(c.bar_of(t0) - 1e-6))
    b1 = int(math.ceil(c.bar_of(t1) - 1e-6))
    for b in range(b0, b1 + 1):
        for bt in ((1.0, 3.5) if b % 2 == 0 else (1.0,)):
            t = c.bt(b, bt)
            if t < t0 - 1e-6 or t >= t1 - 1e-6 or (stop_before is not None and t >= stop_before):
                continue
            f = vfac(t) if vfac else 1.0
            thud(c, t, p, v * f * (1.0 if bt == 1.0 else 0.8))
            if out is not None:
                out.append(round(t, 3))


def cue_leverage(tl):
    B, E = tl.B, tl.E
    G0 = _B(tl, '19.16', 192.708)                            # the grid: the garden's first 4-bar phrase is a bar line
    k = int(math.ceil((G0 + 2.6) / BAR))
    end_est = _snd(tl, '20.09', 'sticky_flutter', _B(tl, '20.09', 263.0) + 2.6) + 3.0
    c = V.Cue('e02-11-leverage-quartet', tl, anchor=G0, anchor_bar=k + 1,
              bars=int((end_est - (G0 - k * BAR)) / BAR) + 3, swing=0.0)
    rng = np.random.default_rng(1811)
    W = still_windows(tl)
    rec = record_windows(tl)
    recw = [(a, b) for a, b, _ in rec]
    talk = talk_windows(tl, 0.12, 0.15)
    # ---- the events (all from the lock)
    j0 = -plan_cut('17.21', 'jcut', 'lead_s', 1.2)                        # Act Three's 17.21: J 1.2 s under its black
    e = dict(j0=j0, beam=_B(tl, '18.02', 5.75), tv=_B(tl, '18.03', 7.75), face=_B(tl, '18.06', 28.42),
             click_tv=_snd(tl, '18.06', 'tv_click_off', _B(tl, '18.06', 28.42) + 2.3), split=_B(tl, '18.07', 32.17),
             lanyard=_snd(tl, '18.07', 'lanyard_drop', _B(tl, '18.07', 32.17) + 1.77), left=_B(tl, '18.08', 35.71),
             right=_B(tl, '18.11', 62.92), mario_end=_E(tl, '18.14', 91.63), remind=_B(tl, '18.15', 91.63),
             toast=_snd(tl, '18.15', 'ui_toast_pop', _B(tl, '18.15', 91.63) + 0.4),
             lobby=_B(tl, '19.01', 95.0), campus=_B(tl, '19.07', 132.04),
             click_post=_snd(tl, '19.07', 'post_click', _B(tl, '19.07', 132.04) + 2.5), call=_B(tl, '19.09', 148.38),
             ring=_snd(tl, '19.09', 'call_ring', _B(tl, '19.09', 148.38) + 0.14), f21=_B(tl, '19.11', 170.13),
             sweep=_snd(tl, '19.11', 'render_front_sweep', _B(tl, '19.11', 170.13) + 0.8), ad=_B(tl, '19.12', 172.13),
             stage=_B(tl, '19.13', 176.92), click_map=_B(tl, '19.14', 181.96), match=_B(tl, '19.15', 189.04),
             garden=G0, g2=_B(tl, '19.17', G0 + 10.0), g3=_B(tl, '19.18', G0 + 20.0), gate=_B(tl, '19.19', 221.38),
             gate_swing=_snd(tl, '19.19', 'gate_iron_swing', _B(tl, '19.19', 221.38) + 0.42),
             lock_turn=_snd(tl, '19.19', 'lock_big_turn', _B(tl, '19.19', 221.38) + 1.97),
             fold=_B(tl, '19.20', 225.63), split2=_B(tl, '20.01', 229.0), lamp=_snd(tl, '20.02', 'lamp_click',
                                                                                     _B(tl, '20.02', 232.92) + 0.1),
             fanfare=_snd(tl, '20.02', 'nole_fanfare_short', _B(tl, '20.02', 232.92) + 0.3),
             padlock=_snd(tl, '20.03', 'padlock_snap', _B(tl, '20.03', 240.5) + 5.71),
             lamp_off=_snd(tl, '20.04', 'lamp_click', _B(tl, '20.04', 246.63) + 2.89), morning=_B(tl, '20.05', 249.92),
             rope=_snd(tl, '20.09', 'rope_drop', _B(tl, '20.09', 263.0) + 0.2),
             haul=_snd(tl, '20.09', 'rope_haul', _B(tl, '20.09', 263.0) + 1.1),
             flutter=_snd(tl, '20.09', 'sticky_flutter', _B(tl, '20.09', 263.0) + 2.6),
             landing=_os(tl, '20.09', '(FOR NOW)', _B(tl, '20.09', 263.0) + 3.0), dark=_B(tl, '20.10', 267.0))
    e['pins'] = sorted(_sndall(tl, '19.14', 'pin_grey_tick')) or [e['click_map'] + 2.26 + 0.85 * i for i in range(4)]
    e['last_updated'] = _os(tl, '19.14', 'LAST UPDATED', e['click_map'] + 5.37)
    e['card_end'] = next((b for a, b, x in rec if e['face'] - 4.5 < a < e['face']), e['face'] + 0.13)
    e['doc_hl'] = next(((a, b) for a, b, x in rec if e['right'] < a < e['mario_end'] and x.startswith('Building')),
                       (e['right'] + 8.5, e['right'] + 12.8))
    e['end_card'] = next(((a, b) for a, b, x in rec if e['ad'] - 0.1 < a < e['click_map']), (e['ad'] + 2.54, e['ad'] + 7.2))
    e['post'] = next(((a, b) for a, b, x in rec if e['campus'] < a < e['call']), (e['click_post'] + 0.1, e['click_post'] + 9.3))
    e['nole_post'] = next(((a, b) for a, b, x in rec if e['split2'] < a < e['morning']), (e['fanfare'], e['fanfare'] + 7.5))
    e['docket'] = next(((a, b) for a, b, x in rec if e['morning'] < a < e['dark'] and x.startswith('HEARING')),
                       (e['rope'] - 2.3, e['rope'] - 0.1))
    first_line = next((ln for ln in tl.lines if ln['who'] == 'neleh'), None)
    present = _line(tl, 'e2-a4-0006', 'mas', 49.46)
    also = _line(tl, 'e2-a4-0008', 'mas', 56.71)
    vo11 = _line(tl, 'e2-vo-11', 'mas', 60.07)
    win = _line(tl, 'e2-a4-0016', 'mario', 89.18)
    vo12 = _line(tl, 'e2-vo-12', 'mas', 144.0)
    miss = _line(tl, 'e2-a4-0028', 'gerg', 164.2)
    clicker = _line(tl, 'e2-a4-0029', 'mas', 165.96)
    guest = _line(tl, 'e2-a4-0031', 'mas', 218.26)
    radnus = _line(tl, 'e2-a4-0030', 'radnus', 214.96)
    nole = _line(tl, 'e2-a4-0032', 'nole', 240.81)
    vo13 = _line(tl, 'e2-vo-13', 'mas', 256.95)
    T = tracks_leverage()

    def vf(t):
        """the eighths' velocity under talk: softer under every line, softest under his, the V.O. and the record"""
        if inside(t, W):
            return 0.5
        if inside(t, talk):
            return 0.72
        return 1.0

    ev8, thd = [], []
    secs = []
    # ================================================================ A: the black's pre-lap, the lighthouse (B-flat)
    first = c.bar1 + math.ceil((j0 + 0.08 - c.bar1) / Q - 1e-6) * Q        # the first beat inside the J
    beam = lead_in(c, e['beam'])                                           # the beam crosses the boardroom: F
    stop_tv = lead_in(c, e['tv'])                                          # the TV: thin to the pedal
    eighths(c, first, beam, 'Bb', 0.42, rng, out=ev8)
    eighths(c, beam, stop_tv, 'F', 0.42, rng, out=ev8)
    bar0 = c.next_bar(first + 0.01)
    thuds(c, bar0, beam, 'Bb1', 0.6, out=thd)
    thuds(c, beam, stop_tv, 'F1', 0.6, out=thd)
    c.mark(first, f'the quartet\'s first pizzicato, J {-first:.3f} s into Act Three\'s black (17.21 J {-j0:.1f} s): in '
                  'render/music-el-prelap.wav', hit=False)
    c.mark(bar0, 'DESIGNED HIT: the muted 808\'s first thud on the lighthouse\'s first bar line (the quartet already '
                 'running from the black): the mix keeps its attack')
    # the Lighthouse cell under the opening (marimba + harp, the beam's sweep one step a beat), out as the beam crosses
    lh = []
    for i, t in enumerate(grid(c, c.next_beat(first + 0.01), beam + 0.01, Q)):
        p = LIGHT[i % 3]
        c.n('marimba', p, t, 0.5, 0.3 * (1.0 if i % 3 == 0 else 0.82), lock=True)
        if i % 3 == 0:
            c.n('harp', nm(p) - 12, t, 1.2, 0.26, lock=True)
        lh.append(round(t, 3))
    c.mark(c.next_beat(first + 0.01), 'the Lighthouse cell (marimba + harp, F B-flat D-flat in quarters: the beam) over '
                                      'the B-flat eighths: Misanthropic\'s lighthouse, Ekiel climbing with his box',
           hit=False)
    c.mark(beam, f'the beam crosses the NopeAI boardroom\'s window ({how(c, beam, e["beam"])}): the eighths and the 808 '
                 'move to F; the Lighthouse cell stays behind', hit=False)
    secs.append(('A1 the black\'s pre-lap; the lighthouse (B-flat): the eighths, the 808, the Lighthouse cell', 0.0, beam))
    secs.append(('A2 the beam crosses the boardroom (F)', beam, stop_tv))
    # ================================================================ B: Neleh, the card, his face: the pedal
    re_in = lead_in(c, e['split'])                                         # the split: the engine back
    c.rebow('vc', 'F2', stop_tv - 0.05, re_in + 0.6, 0.17, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.4, art='sus',
            lp=1300)
    c.rebow('vla', 'C3', stop_tv, re_in + 0.6, 0.15, seg=5.0, xf=1.0, first_att=0.7, last_rel=0.4, art='sus', lp=1500)
    h_on = stop_tv + 0.3
    t_rise = place(c, c.next_beat(e['card_end'] + 0.05), W, step=Q)        # after the card's read, on his face
    h_off = e['click_tv'] + 0.12
    c.rebow('vln1', 'C6', h_on, t_rise + 0.25, 0.1, seg=6.0, xf=1.0, first_att=2.2, last_rel=0.25, art='sus', lp=5000)
    c.rebow('vln1', 'Db6', t_rise, h_off, 0.1, seg=6.0, xf=1.0, first_att=0.35, last_rel=0.2, art='sus', lp=5000)
    c.mark(stop_tv, f'the TV: Neleh\'s voice through the podcast player ({how(c, stop_tv, e["tv"])}): the quartet thins '
                    'to its pedal (F2 + C3, sul tasto; no eighths, no 808); a high violin harmonic (C6, her colour) '
                    'enters softly before her first word; her words and the board\'s card play dry', hit=False)
    c.mark(t_rise, 'his face holds still (2 s), after the card\'s read: the harmonic rises a semitone (C6 to D-flat 6: '
                   'Neleh\'s question colour, OST §2.16): the held breath', hit=False)
    c.mark(e['click_tv'], 'Terb clicks the TV off: the harmonic goes with it; the pedal holds under "First item."',
           hit=False)
    secs.append(('B1 Neleh\'s voice and the board\'s card: the pedal, the harmonic (dry)', stop_tv, t_rise))
    secs.append(('B2 his face (the harmonic a semitone up); "First item."', t_rise, re_in))
    # ================================================================ C: the split, the committee (F, the 808, the dyad)
    t_present = present['on'] if present else e['left'] + 13.75
    t_d1 = place(c, c.next_beat((present['end'] if present else t_present + 0.6) + 0.03), W, step=Q)
    t_d2 = place(c, c.next_beat((also['end'] if also else t_d1 + 6.5) + 0.03), W, step=Q)
    eighths(c, re_in, e['right'] - 0.25, 'F', 0.4, rng, vfac=lambda t: vf(t) * (0.8 if vo11 and vo11['on'] - 0.3 <= t <
                                                                                vo11['end'] + 0.1 else 1.0), out=ev8)
    thuds(c, c.next_bar(re_in - 0.01), t_present - 0.1, 'F1', 0.58, vfac=lambda t: 0.85 if inside(t, talk) else 1.0,
          out=thd)
    lan = c.nearest_beat(e['lanyard'])
    if all(abs(lan - x) > 0.05 for x in thd):
        thud(c, lan, 'F1', 0.5)
        thd.append(round(lan, 3))
    c.mark(lan, f'the lanyards drop in both panes on one beat (lanyard_drop {e["lanyard"]:.3f}): the rhyme on one action; '
                'an 808 thud on that beat (the 808\'s, not a hit on the lanyard)', hit=False)
    last808 = max([x for x in thd if x < t_present], default=None)
    c.mark(re_in, f'the split ({how(c, re_in, e["split"])}): LEVERAGE back: the eighths, the 808, the violins\' close '
                  'dyad (C5 + D-flat 5, sul tasto)', hit=False)
    for (a, b), (lo_, hi_) in zip(((re_in, t_d1), (t_d1, t_d2), (t_d2, e['right'] - 0.25)), DYAD):
        c.rebow('vln2', lo_, a, b + 0.3, 0.12, seg=5.0, xf=0.8, first_att=0.8 if a == re_in else 0.4, last_rel=0.3,
                art='sus', lp=2400)
        c.rebow('vln1', hi_, a + 0.02, b + 0.3, 0.11, seg=5.0, xf=0.8, first_att=0.8 if a == re_in else 0.4,
                last_rel=0.3, art='sus', lp=2600)
    c.mark(t_present, f'"present.": THE 808 DROPS OUT (its last thud {last808}; the stop is the move, P03); the quartet '
                      'carries on alone', hit=False)
    c.mark(t_d1, 'after "present.": the violins\' dyad a semitone up (D-flat + D: the leverage moved)', hit=False)
    c.mark(t_d2, 'after "also present.": the dyad a semitone up again (D + E-flat); Mada\'s second word; the table holds '
                 'its breath; V.O. 11 inside the bed (the eighths softer, nothing attacks on the words)', hit=False)
    secs.append(('C1 the split, the lanyards; Terb (F: the eighths, the 808, the dyad)', re_in, t_present))
    secs.append(('C2 "present.": the 808 out; "also present."; V.O. 11', t_present, e['right'] - 0.25))
    # ================================================================ D: RIGHT, Mario (B-flat minor): the Addendum
    rp = lead_in(c, e['right'])
    dh0, dh1 = e['doc_hl']
    s1 = c.next_bar(rp - 0.01) if c.next_bar(rp - 0.01) - rp < 0.05 else rp
    s2 = c.next_beat(dh1 + 0.05)
    stop_win = lead_in(c, win['on'] if win else e['mario_end'] - 2.4, min_lead=0.2, step=Q)   # the Addendum's stop

    def statement(t0, tail_n, stop_at=None):
        """the Addendum on the viola's pizzicato (the head, then its tail, which the second violin doubles an octave up);
        nothing under the record; nothing at or after stop_at"""
        out = []
        t = t0
        for part, seq in (('head', ADD_HEAD), ('tail', ADD_TAIL[tail_n] if tail_n else [])):
            for p, beats in seq:
                if stop_at is not None and t >= stop_at - 0.02:
                    return out, t
                if p is not None and not inside(t, recw):
                    d = beats * Q * 0.9
                    if stop_at is not None:
                        d = min(d, stop_at - t - 0.03)
                    c.n('vla_pz', p, t, d, 0.4, lock=True, art='pizz')
                    if part == 'tail':
                        c.n('vln_pz', nm(p) + 12, t, d, 0.26, lock=True, art='pizz')
                    out.append((round(t, 3), p, part))
                t += beats * Q
        return out, t

    a1, s1_end = statement(s1, 1)
    a2, s2_end = statement(s2, 2)
    s3 = c.next_bar(s2_end - 0.01) if c.next_bar(s2_end - 0.01) < stop_win - 2 * Q else s2_end
    a3, _ = statement(s3, 3, stop_at=stop_win)
    add_notes = a1 + a2 + a3
    # the cello's off-beat plucks (B-flat 2, F3), a soft arco bass on B-flat (the Addendum's "soft bass")
    for t in grid(c, rp, stop_win):
        kk = int(round((t - c.bar1) / E8))
        if kk % 2 == 1:
            p = 'Bb2' if (kk // 2) % 2 == 0 else 'F3'
            c.n('vc_pz', p, t, 0.18, 0.26 * (0.75 if inside(t, recw) else 1.0) * (0.85 if inside(t, talk) else 1.0),
                lock=True, art='pizz')
    c.rebow('cb', 'Bb1', rp, stop_win + 0.4, 0.15, seg=5.0, xf=1.0, first_att=0.6, last_rel=0.4, art='sus', lp=900)
    c.rebow('vln2', 'Db5', rp, stop_win + 0.2, 0.09, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.3, art='sus', lp=2200)
    for i, t in enumerate(grid(c, rp, stop_win, Q)):
        p = LIGHT[i % 3]
        f = 0.7 if inside(t, recw) else (0.85 if inside(t, talk) else 1.0)
        c.n('marimba', p, t, 0.5, 0.26 * f * (1.0 if i % 3 == 0 else 0.82), lock=True)
        if i % 3 == 0:
            c.n('harp', nm(p) - 12, t, 1.2, 0.22 * f, lock=True)
        if i % 4 == 0:
            chip(c, 'tri', 'Bb2', t, Q * 0.8, 0.3 * f, att=0.004, dec=0.2, sus=0.3, rel=0.1)
    V.clip_before(c, stop_win, insts={'vla_pz', 'vln_pz', 'vc_pz', 'marimba', 'harp', 'cb', 'vln2'}, rel=0.08)
    c.mark(rp, f'RIGHT: Mario\'s pane ({how(c, rp, e["right"])}): B-flat minor; Mario\'s Addendum (B-flat C D-flat F | '
               'E-flat D-flat C B-flat) in the viola\'s pizzicato, the cello\'s off-beats, a soft arco bass on B-flat; the '
               'Lighthouse cell (marimba, harp) beside it; the chip a triangle bass only (OST §2.8)', hit=False)
    c.mark(s1, 'the Addendum, statement 1: the head and a one-bar tail (C D-flat, then a rest)', hit=False)
    c.mark(dh0, 'the highlighted line (Ekiel\'s own, [V]): the Addendum rests; the cell and the bass hold (the record dry)',
           hit=False)
    c.mark(s2, 'statement 2: it gains a bar (the tail climbs C D-flat E-flat F, then G-flat; never cadences)', hit=False)
    c.mark(s3, 'statement 3: it gains another bar...', hit=False)
    c.mark(stop_win, f'...and is cut off before "It\'s that we might win." ({win["on"]:.2f}): the stop; the dry chill: '
                     'the Ache (glass G4 + D-flat 5) over an F pedal, under the line' if win else 'the stop', hit=False)
    # the dry chill: the Ache under "It's that we might win." (a silent attack: no hit on the line)
    ache_end = lead_in(c, e['toast'] + 0.4, step=Q)
    c.rebow('cb', 'F1', stop_win, ache_end + 0.8, 0.15, seg=5.0, xf=1.0, first_att=0.7, last_rel=0.6, art='sus', lp=800)
    c.rebow('vc', 'C3', stop_win + 0.1, ache_end + 0.8, 0.12, seg=5.0, xf=1.0, first_att=0.9, last_rel=0.6, art='sus',
            lp=1300)
    c.ch('glasspad', ['G4', 'Db5'], stop_win, ache_end - stop_win + 0.6, 0.28, roll=0.0, lock=True, att=0.9, rel=0.8)
    secs.append(('D1 RIGHT: Mario, the Addendum (statements 1 and 2), the Lighthouse cell', rp, s3))
    secs.append(('D2 statement 3, cut off; the dry chill (the Ache) under "It\'s that we might win."', s3, ache_end))
    # ================================================================ E: the reminder; the lobby (A-flat)
    t_rem = max(ache_end, c.next_beat((win['end'] if win else e['remind']) + 0.05))
    lob = lead_in(c, e['lobby'])
    eighths(c, t_rem, lob, 'F', 0.34, rng, vfac=vf, out=ev8)
    c.mark(t_rem, 'LEFT: his phone lights with the reminder (ELPPA · KEYNOTE · JUN 10): the F eighths again, softly; the '
                  'keynote\'s walk-on bed comes up under them (J %.1f s, E02-11b)' % plan_cut('18.15', 'jcut', 'lead_s', 0.8),
           hit=False)
    # the lobby: a two-bar cycle; the giddy violins' pizzicato double stops on the 3+3+2 accents
    stop_post = c.bar1 + math.ceil((e['click_post'] - c.bar1) / E8 - 1e-6) * E8     # the first eighth from the click
    cyc = []
    t = lob
    while t < stop_post - 1e-6:
        bidx = int(math.floor((t - c.bar1) / BAR + 1e-9))
        col = LOBBY[(bidx // 2) % 4]
        t1 = min(c.bar1 + (bidx + 1) * BAR, stop_post)
        cyc.append((round(t, 3), col))
        eighths(c, t, t1, col, 0.4, rng, vfac=vf, out=ev8)
        for tt in grid(c, t, t1):
            kk = int(round((tt - c.bar1) / E8)) % 8
            if kk in (0, 3, 6):
                f = 0.0 if inside(tt, W) else (0.55 if inside(tt, talk) else 1.0)
                if f > 0:
                    c.ch('vln_pz', VLN_PZ[col][(0, 3, 6).index(kk)], tt, 0.18, 0.3 * f, lock=True, art='pizz', roll=0.0)
        t = t1
    c.mark(lob, f'the lobby ({how(c, lob, e["lobby"])}): the quartet alone (no 808) on the deal day\'s A-flat cycle (A-flat '
                'maj9, D-flat maj9(#11), B-flat m9, E-flat 9sus, two bars each), the violins\' pizzicato double stops on '
                'the accents (giddy), over the keynote\'s own walk-on bed on the wall screen; the cheer gets no hit',
           hit=False)
    secs.append(('E1 the reminder (F)', t_rem, lob))
    secs.append(('E2 the lobby: the quartet alone, giddy (A-flat cycle), the keynote bed under it', lob, e['campus']))
    secs.append(('E3 the campus: the crowd, the giant screen, his thumbs', e['campus'], stop_post))
    # ================================================================ F: THE STOP on his post; the pedal; V.O. 12
    call_in = c.next_bar((vo12['end'] if vo12 else e['call'] - 0.6) - 0.02)
    if call_in > e['ring'] + 0.6:
        call_in = c.next_beat((vo12['end'] if vo12 else e['call'] - 0.6) + 0.02)
    c.rebow('vc', 'Ab2', stop_post, call_in + 0.5, 0.17, seg=5.0, xf=1.0, first_att=0.35, last_rel=0.4, art='sus',
            lp=1300)
    c.rebow('vla', 'Eb3', stop_post + 0.05, call_in + 0.5, 0.15, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.4, art='sus',
            lp=1500)
    c.rebow('vln2', 'C5', stop_post + 0.1, call_in + 0.3, 0.09, seg=5.0, xf=1.0, first_att=0.9, last_rel=0.4, art='sus',
            lp=2200)
    c.rebow('vln1', 'Eb5', stop_post + 0.15, call_in + 0.3, 0.08, seg=5.0, xf=1.0, first_att=1.1, last_rel=0.4,
            art='sus', lp=2400)
    c.mark(stop_post, f'THE STOP: his thumb sends the post (post_click {e["click_post"]:.3f}): the eighths stop dead on '
                      'the next eighth (the stop is the move, P03); the quartet holds its A-flat pedal under his post '
                      '(dry) and V.O. 12', hit=False)
    secs.append(('F his post (dry): the pedal; the chat, the phones; V.O. 12', stop_post, call_in))
    # ================================================================ G: the call (the A-flat cycle, thinner)
    end_call = lead_in(c, e['f21'])
    t = call_in
    while t < end_call - 1e-6:
        bidx = int(math.floor((t - c.bar1) / BAR + 1e-9))
        col = LOBBY[(bidx // 2) % 4]
        t1 = min(c.bar1 + (bidx + 1) * BAR, end_call)
        late = miss and t >= miss['on'] - 0.3
        eighths(c, t, t1, col, 0.34 if not late else 0.27, rng, vfac=vf, cello_only=bool(late), ticks=not late, out=ev8)
        cyc.append((round(t, 3), col))
        t = t1
    c.rebow('vln2', 'C5', call_in + 0.2, (miss['on'] if miss else end_call - 5.0) + 0.3, 0.08, seg=5.0, xf=1.0,
            first_att=1.2, last_rel=0.6, art='sus', lp=2000)
    c.mark(call_in, 'the call: the eighths back after V.O. 12, softer, cello and viola only (lonely, a little funny), '
                    'the keynote\'s bed on the campus PA far off; his lines dry', hit=False)
    if miss:
        c.mark(miss['on'], '"You ever miss being up there?": the eighths thin to the cello alone, no tick (weighted)',
               hit=False)
    secs.append(('G the call (the A-flat cycle, thinner)', call_in, end_call))
    # ================================================================ H: F2.1 (ERA T2) over the quartet's A-flat pedal
    gpick = c.bar(int(round(c.bar_of(G0))) - 1) + 2 * Q                     # the garden's two-beat pickup
    c.rebow('vc', 'Ab2', end_call - 0.05, gpick + 0.4, 0.15, seg=5.0, xf=1.0, first_att=0.6, last_rel=0.5, art='sus',
            lp=1300)
    c.rebow('vla', 'Eb3', end_call, gpick + 0.4, 0.13, seg=5.0, xf=1.0, first_att=0.8, last_rel=0.5, art='sus', lp=1500)
    c.mark(end_call, f'after "they let me hold the clicker." ({how(c, end_call, e["f21"])}): the eighths stop; the quartet '
                     'holds its A-flat pedal (cello, viola) through F2.1', hit=False)
    band_in = c.nearest_beat(e['sweep']) if abs(c.nearest_beat(e['sweep']) - e['sweep']) < 0.2 else lead_in(c, e['sweep'],
                                                                                                           step=Q)
    c.mark(e['last_updated'], 'LAST UPDATED 2012: the band (E02-11c) is gone; the quartet\'s A-flat pedal alone (the pang)',
           hit=False)
    secs.append(('H1 F2.1: the quartet\'s A-flat pedal under the band (E02-11c)', end_call, e['last_updated']))
    secs.append(('H2 LAST UPDATED 2012; the match: the pedal; the garden\'s pickup', e['last_updated'], G0))
    # ================================================================ I: the walled garden (D-flat): three phrases
    g_rows = []
    gv = []
    # the pickup: two beats on the first violin, the chord's push on the and-of-4 (pre-laps the garden's cut)
    push = G0 - E8
    V.phrase(c, 'g_vln1', gpick, 'Eb4/4 F4/8 G4/8', 0.34, lock=False)
    c.n('vc_pz', 'Db3', push, 0.3, 0.36, lock=True, art='pizz')
    c.mark(push, f'the garden\'s push ({how(c, push, G0)}): back from the memory, the quartet takes the garden-party '
                 'arrangement (D-flat; the #11 its one wrong element; never a wedding march)', hit=False)
    ph3 = min(lead_in(c, e['g3']), G0 + len(GARDEN) * BAR)              # (a longer phrase 2 on a re-timed lock: the
    #                                                                     one violin takes over where the eight bars end)
    for bi, ((root, chord), mel) in enumerate(GARDEN):
        t0 = G0 + bi * BAR
        if t0 >= ph3 - 0.01:
            break
        g_rows.append((round(t0, 3), root))
        c.n('vc_pz', root, t0, 0.5, 0.42, lock=True, art='pizz')
        c.n('vc_pz', nm(root) + 7, t0 + 2 * Q, 0.4, 0.32, lock=True, art='pizz')
        # vln2: a held chord tone; viola: broken-chord eighths (light spiccato), never oom-pah
        c.n('g_vln2', chord[-1], t0, BAR * 0.96, 0.22, art='sus', att=0.08, rel=0.3, lp=4000)
        for j in range(8):
            tt = t0 + j * E8
            if tt >= ph3 - 0.01:
                break
            p = chord[[0, 1, 2, 1, 3, 1, 2, 1][j]]
            c.n('g_vla', p, tt, E8 * 0.8, 0.26 * (1.0 if j % 4 == 0 else 0.8), art='spic')
        notes = V.phrase(c, 'g_vln1', t0, mel, 0.42, lock=False, art='sus', att=0.04, rel=0.25)
        gv += notes
        if bi in (0, 4):
            top = max(notes, key=lambda z: nm(z[1])) if notes else None
            if top:
                chip(c, 'lead2', top[1], top[0], min(top[2], 0.5), 0.34, duty=0.5, att=0.004, dec=0.25, sus=0.3,
                     rel=0.15)
    c.mark(G0, 'the garden, phrase 1 (the gate opens; the guest on its velvet rope): the first violin\'s tune, the '
               'viola\'s broken chords, the cello\'s pizzicato; the chip\'s square doubles its top note', hit=False)
    c.mark(e['g2'], 'phrase 2 (the raised hands, the nods, the text bubbles: the SFX\'s chip blips): the tune asks '
                    '(the #11 held), then answers', hit=False)
    # phrase 3: one violin under the exchange; the falling step in the held smile; the cello's C on the gate
    gate_in = lead_in(c, e['gate'])
    c.rebow('vln1', 'Db5', ph3, (guest['end'] if guest else e['gate'] - 2.0) + 0.35, 0.16, seg=5.0, xf=1.0,
            first_att=0.4, last_rel=0.3, art='sus', lp=3000)
    fall_t = c.next_beat((guest['end'] if guest else e['gate'] - 2.0) + 0.2)
    c.rebow('vln1', 'C5', fall_t, gate_in + 0.15, 0.16, seg=5.0, xf=1.0, first_att=0.25, last_rel=0.25, art='sus',
            lp=3000)
    c.mark(ph3, f'phrase 3 ({how(c, ph3, e["g3"])}): the quartet thins to one violin (D-flat 5, sul tasto) under Radnus '
                'and "as a guest."', hit=False)
    c.mark(fall_t, 'Radnus\'s smile holds a beat too long: the violin falls a semitone (D-flat to C: the pang begins)',
           hit=False)
    secs.append(('I1 the garden: phrases 1 and 2 (the garden-party quartet)', G0, ph3))
    secs.append(('I2 phrase 3: one violin under the exchange; the held smile', ph3, gate_in))
    # ================================================================ J: the gate; zAI (the C pedal; the 808; the Launch)
    morn = lead_in(c, e['morning'])
    c.rebow('vc', 'C2', gate_in, morn + 0.6, 0.18, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.5, art='sus', lp=1100)
    c.rebow('vla', 'C3', e['lock_turn'], morn + 0.6, 0.11, seg=5.0, xf=1.0, first_att=1.6,
            last_rel=0.5, art='sus', lp=1300)
    c.mark(gate_in, f'the gate swings shut ({how(c, gate_in, e["gate"])}): the violin\'s C hands down to the cello\'s C '
                    'pedal (arco, sul tasto): the pang at the gate; the viola\'s C3 joins on the lock\'s turn '
                    f'({e["lock_turn"]:.2f}); the pedal carries across the fold into sc 20 (L {plan_cut("19.20", "lcut", "over_s", 0.6):.1f} s)',
           hit=False)
    z_in = c.nearest_beat(e['split2']) if abs(c.nearest_beat(e['split2']) - e['split2']) < 0.15 else lead_in(c, e['split2'],
                                                                                                            step=Q)
    npost0, npost1 = e['nole_post']
    thuds(c, z_in, e['padlock'] - 0.05, 'C1', 0.56,
          vfac=lambda t: 0.75 if (npost0 - 0.1 <= t < npost1) else (0.85 if inside(t, talk) else 1.0), out=thd)
    if z_in not in thd:
        thud(c, z_in, 'C1', 0.5)
        thd.append(round(z_in, 3))
    last_z = max([x for x in thd if x < e['padlock']], default=None)
    # sparse LED ticks with the 808 (the chip), none under Nole's post
    for t in grid(c, z_in, e['padlock'] - 0.1):
        kk = int(round((t - c.bar1) / E8))
        if kk % 8 in (2, 5) and (kk // 8) % 2 == 0 and not (npost0 - 0.1 <= t < npost1):
            c.n('noise', 60, t, 0.03, 0.22, lock=True, clock=float(18000 + 3000 * (kk % 3)), dec=0.02, sus=0.0,
                rel=0.02, hp=3000)
    c.mark(z_in, f'the split ({how(c, z_in, e["split2"])}): the muted 808 returns under zAI\'s drone (on C, the pedal\'s '
                 'root); the cello\'s C pedal; a sparse chip tick', hit=False)
    # Nole's Launch, short: C4 F4 B-flat4 E-flat5 in sixteenths, falling off one note short of A-flat 5 (claimed)
    tf = e['fanfare']
    for i, p in enumerate(NOLE):
        c.n('tpt_stac', p, tf + i * S16 * 0.8, 0.11 if i < 3 else 0.3, 0.42 + 0.04 * i, lock=True,
            bend=[(0.0, 0.0), (0.12, 0.0), (0.3, -3.0)] if i == 3 else None)
    c.n('noise', 60, tf, 0.25, 0.4, lock=True, clock=9000.0, dec=0.18, sus=0.0, rel=0.08, hp=900)
    c.n('timp', 'C3', tf, 0.9, 0.34, lock=True)
    c.mark(tf, 'DESIGNED HIT: Nole\'s lamp clicks on (the SFX\'s, %.3f) and his short fanfare (claimed '
               'nole_fanfare_short): the Launch\'s quartal stack C F B-flat E-flat on staccato trumpets, a chip burst, '
               'a timpani C; it falls off one note short of A-flat (OST §2.7), done before his post can be read'
           % e['lamp'])
    c.mark(npost0, 'Nole\'s post (the record): dry: the C pedal and the 808, softer; no tick, no change', hit=False)
    c.mark(e['padlock'], f'the padlock snaps on his own phone: THE 808 DROPS OUT (its last thud {last_z}): the stop is '
                         'the move, his own; the buzzing inside the cage gets nothing (the laugh is the picture\'s)',
           hit=False)
    secs.append(('J1 the gate: the cello\'s C pedal; the fold', gate_in, z_in))
    secs.append(('J2 zAI: the 808 again; the lamp; the Launch (short); his post (dry); the cage', z_in, e['padlock']))
    secs.append(('J3 the padlock: the 808 out; the buzzing; the lamp off: the cello\'s pedal', e['padlock'], morn))
    # ================================================================ K: the lobby's morning (F); the cello's last pizz
    # the quartet's pedal lifts on the lock's sticky_flutter (the note flutters down onto the clean rectangle once the
    # complaint has gone), not on an estimate of the picture (the score review, 2026-10-09: rope_haul + 1.0 s was one)
    out_t = e['flutter']
    for inst, p, v, att in (('vc', 'F3', 0.16, 0.6), ('vla', 'C4', 0.14, 0.8), ('vln2', 'G4', 0.1, 1.0),
                            ('vln1', 'C5', 0.09, 1.2)):
        c.rebow(inst, p, morn + (0.0 if inst == 'vc' else 0.08), out_t, v, seg=5.0, xf=1.0, first_att=att,
                last_rel=0.6, art='sus', lp=1500 if inst in ('vc', 'vla') else 2400)
    pz = e['landing']
    c.n('vc_last', 'C3', pz, 0.6, 0.44, lock=True, art='pizz', rel=0.5)
    c.mark(morn, f'the lobby\'s morning ({how(c, morn, e["morning"])}): the C pedal resolves to F (the quartet\'s pedal: F3 '
                 'C4 G4 C5, sul tasto, nothing below C3 under the lobby\'s hum); V.O. 13 and the docket play inside it, '
                 'no change', hit=False)
    c.mark(out_t, 'the complaint has risen out of frame; the sticky note flutters down (sticky_flutter, the lock\'s): the '
                  'quartet\'s pedal lifts; the quartet ends', hit=False)
    c.mark(pz, 'DESIGNED HIT: the (FOR NOW) note lands on the clean rectangle: the cello\'s last pizzicato, C3 (the '
               'dominant, left open: for now). E02-11 ends; room tone only from here (the designed silence)')
    secs.append(('K the lobby\'s morning: the F pedal; V.O. 13; the docket; the rope; the last pizzicato', morn, pz + 0.8))
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    # ---- the rides: the pedals sit inside the talk; the flashback and the garden a touch forward
    rides = [(-3.0, beam, -3.0),                               # the lighthouse (render 2: -17.9, the head -13.1 LUFS-M)
             (stop_tv - 0.2, re_in, -3.5),                     # Neleh and the card: a held breath (render 2: -20.3)
             (re_in, e['right'] - 0.3, -1.5),                  # the committee (render 2: -18.6, -13.9 LUFS-M)
             (rp - 0.2, ache_end, -0.5),                       # Mario: the pane beside his (render 1: -22.4)
             (ache_end, lob, 1.0),                             # the reminder (render 1: -24.7)
             (lob - 0.2, stop_post, -0.5),                     # the lobby: giddy (render 1: -19.7)
             (stop_post, call_in, -2.5),                       # his post and V.O. 12: the pedal (render 1: -21.4)
             (call_in, end_call, 1.0),                         # the call (render 1: -24.4)
             (e['last_updated'], gpick, -1.0),                 # the pang: the pedal alone
             (gpick - 0.2, ph3, -1.0),                         # the garden (render 2: -19.4, -13.1 LUFS-M)
             (ph3, gate_in, 2.5),                              # one violin (render 1: -28.9; render 2: -21.9)
             (z_in - 0.2, e['padlock'], -1.5),                 # zAI (render 2: -19.0, the fanfare -13.9 LUFS-M)
             (e['padlock'], morn, -1.0),
             (morn - 0.2, out_t + 0.2, -2.0)]                  # the lobby's morning (render 1: -22.9)
    for ln, d in ((vo11, -3.0), (vo12, -2.5), (vo13, -2.5)):    # the V.O. inside the bed (render 2: -21.5, -21.3, -22.2)
        if ln:
            rides.append((ln['on'] - 0.5, ln['end'] + 0.3, d))
    rides.sort()
    macro = ride_macro(rides, c.bar1 - 1.0, pz + 2.5)
    meta = dict(
        id=c.name, title='Leverage, Quartet (E02-11, Ep2 v1 Act Four sc 18-20)',
        mm='new to picture (P03 LEVERAGE as a string quartet + the Addendum and the Lighthouse (MM-09 family, OST §2.8) '
           '+ P10 ERA T2 (MM-06 II) + the Launch (OST §2.7))', usage='BI',
        family='P03 LEVERAGE (a string quartet: pizzicato over a muted 808) -> the pedal -> the Addendum -> the lobby\'s '
               'cycle -> P10 ERA T2 (F2.1) -> a garden-party quartet -> the cello\'s pedal, the 808 -> the morning pedal',
        tone='a jolt of truth and a held breath; comedy and a dry chill; a giddy cheer; a small thrill (the stop on his '
             'post); a lonely call; nostalgia, then a pang; wit; a pang at the gate; a laugh (no hit); a smile at the '
             'rope; the last pizzicato',
        scenes=['Ep2 v1 Act Four sc 18 (18.01-18.15)', 'sc 19 (19.01-19.20, F2.1 19.11-19.15)', 'sc 20 (20.01-20.09)'],
        motifs=['LEVERAGE: pizzicato eighths (3+3+2) on varied pitches, the muted 808, the violins\' semitone dyads',
                'the Lighthouse cell (marimba + harp) and Mario\'s Addendum (it gains a bar each time)',
                'the Ache (G + D-flat over F) under "It\'s that we might win."', 'Neleh\'s harmonic (C6 to D-flat 6)',
                'the young Water Line (the nudge twice) through the 16-bit sample-chip', 'the pins\' falling figure',
                'the garden-party tune (the knee\'s steps and leaps in D-flat)', 'Nole\'s Launch (short, one note short)'],
        motif_ids=[], key='B-flat minor (the lighthouse, Mario), F (the boardroom, the morning), A-flat (the deal\'s day, '
                          'F2.1), D-flat (the garden), C (the gate, zAI); no A-natural; the knee never whole',
        composer='Ep2 v1 score pass (act4), 2026-10-09, on the e02-v1-common engine (composer X\'s helpers)',
        underscore_lufs=-20.5, album_lufs=-16.0,
        vo_windows=[(c.clk(ln['on']), c.clk(ln['end']), 'V.O.') for ln in (vo11, vo12, vo13) if ln],
        room_sfx=[dict(t0=c.clk(morn), t1=c.clk(pz + 0.8), sfx='server_hum (the lobby\'s morning bed\'s stand-in)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['lanyard'], 'lanyard_drop x2: on an 808 beat (no hit)'),
            (e['click_tv'], 'tv_click_off: the harmonic goes with the TV'),
            (e['toast'], 'ui_toast_pop: the reminder (F eighths)'),
            (e['click_post'], 'post_click: THE STOP (the eighths stop on the next eighth)'),
            (e['sweep'], 'render_front_sweep: the T2 band (E02-11c) in on the same chord'),
            (e['pins'][0], 'pin_grey_tick x4: the falling figure (E02-11c), a note a pin'),
            (e['lock_turn'], 'lock_big_turn: the viola joins the cello\'s C (no hit)'),
            (e['lamp'], 'lamp_click: Nole\'s'), (e['fanfare'], 'nole_fanfare_short: CLAIMED (the score plays the Launch)'),
            (e['padlock'], 'padlock_snap: the 808 drops out'), (pz, 'the (FOR NOW) note\'s landing: the last pizzicato'))],
        audition=['-1.0-7.7 s: the quartet\'s pizzicato under the black, then the lighthouse: LEVERAGE, never a heartbeat',
                  '7.7-31.8 s: the pedal under Neleh is a held breath, not a sad cue; the harmonic\'s rise on his face',
                  '49.5 s: the 808\'s drop on "present." reads as the move', '62.7-89 s: the Addendum gains a bar; the '
                  'stop before "It\'s that we might win." and the Ache under it: a dry chill, not a horror sting',
                  '94.6-134.5 s: the lobby is giddy, not lounge or corporate cheer', '134.6 s: the stop on his post',
                  '170.8-189 s: F2.1 sounds like a memory, not a video game; the pins\' figure is a pang',
                  '192.7-221 s: the garden is witty and polite, never a wedding march', '233.2 s: the fanfare is Nole\'s, '
                  'short, one note short', '246.2 s: the 808\'s drop on the padlock', '266.0 s: the last pizzicato'])
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=pz + 1.0, tail_s=0.8, macro=macro)
    c.ev = dict({k_: (round(v, 3) if isinstance(v, float) else v) for k_, v in e.items() if not isinstance(v, tuple)},
                first=round(first, 3), bar0=round(bar0, 3), beam=round(beam, 3), stop_tv=round(stop_tv, 3),
                t_rise=round(t_rise, 3), re_in=round(re_in, 3), lan=round(lan, 3), last808=last808,
                t_present=round(t_present, 3), t_d1=round(t_d1, 3), t_d2=round(t_d2, 3), rp=round(rp, 3), s1=round(s1, 3), s2=round(s2, 3),
                s3=round(s3, 3), stop_win=round(stop_win, 3), ache_end=round(ache_end, 3), t_rem=round(t_rem, 3),
                lob=round(lob, 3), stop_post=round(stop_post, 3), call_in=round(call_in, 3), end_call=round(end_call, 3),
                band_in=round(band_in, 3), gpick=round(gpick, 3),
                push=round(push, 3), ph3=round(ph3, 3), fall_t=round(fall_t, 3), gate_in=round(gate_in, 3),
                z_in=round(z_in, 3), last_z=last_z, morn=round(morn, 3), out_t=round(out_t, 3), pz=round(pz, 3),
                eighths=len(ev8), thuds=len(thd), addendum=add_notes, lobby_cycle=cyc[:40],
                garden_rows=g_rows, lighthouse_head=len(lh), doc_hl=[round(x, 3) for x in e['doc_hl']],
                end_card=[round(x, 3) for x in e['end_card']], post=[round(x, 3) for x in e['post']],
                nole_post=[round(x, 3) for x in e['nole_post']], docket=[round(x, 3) for x in e['docket']])
    return c, sc


# ================================================================ E02-11c: F2.1, the band through the 16-bit sample-chip (P10 T2)
def tracks_f21():
    T = palette()
    # the band through the 16-bit sample-chip (MM-06 II): piano, upright, brushes, a chip lead (Ep1's title, 2008 bar)
    T['snes_piano'].gain_db = -6.0
    dup(T, 'snes_piano', 'snes_mel', gain_db=-4.0, pan=0.05)
    T['snes_bass'].gain_db = -3.0
    T['snes_bass'].eq = [V.PIZZ_NOTCH, ('peq', 110.0, -12.0, 16.0), ('peq', 216.0, -6.0, 6.0)]   # (render 2: the
    #                                                         sample-chip upright's ~111 Hz body read 0.085 A/F over F2)
    T['snes_kit'].gain_db = -6.0
    T['snes_vibes'].gain_db = -4.0
    T['lead'].gain_db, T['lead'].sends = -9.0, {'room': -12, 'snes': -12}
    return T


def cue_f21(tl, lev):
    """F2.1 (SEP 2006 -> JUN 9, 2008): the ERA T2 band (MM-06 II: the band through the 16-bit sample-chip, swung, the
    brighter A-flat colours, no cassette piano, no boom-bap) over E02-11's A-flat pedal, on E02-11's grid: in on the
    render front with the quartet's own chord; the young Water Line (the nudge twice) in the ad and on the 2008 stage,
    never under the ad's end card; one falling chip note a grey pin, each a step lower and dimmer"""
    cl = lev[0]
    e = dict(cl.ev)
    e['end_card'] = tuple(e['end_card'])
    band_in = cl.ev['band_in']
    b_in = cl.bar1 + math.floor((band_in - cl.bar1) / BAR + 1e-9) * BAR
    c = V.Cue('e02-11c-f21-band', tl, anchor=b_in, anchor_bar=2,
              bars=int((e['last_updated'] + 4.0 - (b_in - BAR)) / BAR) + 2, swing=1.0)
    T = tracks_f21()
    ec0, ec1 = e['end_card']
    bars_t2 = grid(c, c.next_bar(band_in - 0.01) - BAR, e['pins'][0] + 0.01, BAR)
    plan_t2 = ['Abmaj9', 'Abmaj9', 'Dbmaj9', 'Abmaj9', 'Dbmaj9', 'Ebsus', 'Abmaj9']   # (render 3: an F-bass bar (Fm9)
    #                                     read 0.09 A/F from the sample-chip's ~111 Hz grit: no F in the band's bass)
    t2_rows = []
    pins = e['pins']
    for bi, t0 in enumerate(bars_t2):
        name = plan_t2[min(bi, len(plan_t2) - 1)]
        rh, root = T2[name]
        a0 = max(t0, band_in)
        if a0 >= pins[0] - 0.05:
            break
        sw_v = 0.36 if t0 >= band_in - 0.01 else 0.3
        for bt in (1.0, 2.5, 3.0) if t0 >= band_in - 0.01 else (1.0,):
            tt = sw_at(t0, bt - 1.0) if bt != 1.0 else max(t0, band_in)
            if tt < a0 - 1e-6 or tt >= pins[0] - 0.05:
                continue
            d = (Q * 1.4 if bt != 2.5 else Q * 0.45)
            c.ch('snes_piano', rh if bt != 2.5 else rh[1:], tt, d, sw_v * (1.0 if bt == 1.0 else 0.8), roll=0.008)
        for bt, p in ((1.0, root), (3.0, root)):
            tt = t0 + (bt - 1.0) * Q
            if a0 - 1e-6 <= tt < pins[0] - 0.05:
                c.n('snes_bass', p, tt, Q * 1.8, 0.42)
        for bt in (2.0, 4.0):
            tt = t0 + (bt - 1.0) * Q
            if a0 - 1e-6 <= tt < pins[0] - 0.05:
                c.n('snes_kit', 38, tt, 0.2, 0.32, lock=False)
        for bt in (1.0, 2.5, 3.0, 4.5):
            tt = sw_at(t0, bt - 1.0)
            if a0 - 1e-6 <= tt < pins[0] - 0.05:
                c.n('snes_kit', 51 if bt in (1.0, 3.0) else 42, tt, 0.2, 0.22, lock=False)
        t2_rows.append((round(t0, 3), name))
    c.mark(band_in, f'F2.1 (the render front, render_front_sweep {e["sweep"]:.3f}): the ERA T2 band (MM-06 II) comes in '
                    'through the 16-bit sample-chip on the quartet\'s own chord (A-flat maj9): sample-chip piano, upright, '
                    'brushes, swung; the quartet\'s A-flat pedal under it (OST P10: the same chord upgraded)', hit=False)
    # the young Water Line (the nudge twice, a little cocky): the 2006 ad, before its end card; again on the 2008 stage
    wl_rows = []
    t_wl1 = c.next_bar(e['ad'] + 0.3)
    if t_wl1 + 2 * Q + SW > ec0 - 0.15:                                  # its last note must clear the end card
        t_wl1 = c.next_beat(e['ad'] + 0.05)
    pl1 = V.phrase(c, 'snes_mel', t_wl1, YOUNG_WL, 0.44, swing=1.0, stop_at=ec0 - 0.1, lock=True)
    for t_, p, d in pl1:
        if p == 'G4':
            chip(c, 'lead', 'G4', t_, min(d, 0.2), 0.36, duty=0.5, att=0.004, dec=0.2, sus=0.35, rel=0.1)
    wl_rows.append(('the 2006 ad', round(t_wl1, 3)))
    t_wl2 = c.next_bar(max(ec1, e['stage']) + 0.05)
    if t_wl2 + 6 * Q > pins[0] - 0.1:
        t_wl2 = c.next_beat(max(ec1, e['stage']) + 0.05)
    pl2 = V.phrase(c, 'snes_mel', t_wl2, YOUNG_WL + ' C4/4 F4/2.', 0.46, swing=1.0, stop_at=pins[0] - 0.02, lock=True)
    for t_, p, d in pl2:
        if p == 'G4':
            chip(c, 'lead', 'G4', t_, min(d, 0.2), 0.38, duty=0.5, att=0.004, dec=0.2, sus=0.35, rel=0.1)
    wl_rows.append(('the 2008 stage (the settle C F)', round(t_wl2, 3)))
    c.mark(t_wl1, 'the young Water Line on the sample-chip piano (F G-F G-F: the nudge twice, a little cocky), the chip\'s '
                  '50 % square on the nudges: the 2006 phone ad, before its end card', hit=False)
    c.mark(ec0, '"WHERE YOU AT?" (the ad\'s end card, the record): the band comps, no lead', hit=False)
    c.mark(t_wl2, 'the 2008 stage, after the card: the young Water Line again, settling (C F) as TPOOL\'s map fills with '
                  'pins', hit=False)
    # the pins grey: the sample-chip's falling figure, one note a pin, each a step lower and dimmer (the band thins)
    fall = ['Ab5', 'G5', 'F5', 'Eb5', 'Db5', 'C5']
    fig = []
    for i, tp in enumerate(pins):
        p = fall[min(i, len(fall) - 1)]
        v = 0.42 * (0.78 ** i)
        chip(c, 'lead', p, tp, 0.5, v, duty=0.25, att=0.003, dec=0.3, sus=0.25, rel=0.25)
        c.n('snes_vibes', p, tp, 0.8, v * 0.9, lock=True)
        if i < 2:
            c.n('snes_piano', T2['Abmaj9'][0][-1], tp, 0.9, 0.22 * (0.8 ** i), lock=True)
        fig.append((round(tp, 3), p))
    c.n('snes_bass', 'Ab2', pins[0], pins[1] - pins[0] if len(pins) > 1 else 1.0, 0.34)
    c.mark(pins[0], 'the pins grey out one by one (pin_grey_tick x%d, the SFX\'s): the sample-chip\'s falling figure, one '
                    'note a pin, each a step lower and dimmer (A-flat G F E-flat); the band drops away under it' % len(pins),
           hit=False)
    c.mark(e['last_updated'], 'LAST UPDATED 2012: the band is gone (E02-11\'s A-flat pedal alone: the pang)', hit=False)
    secs = [('1 F2.1: the render front; the 2006 ad; the end card (the band, the young Water Line)', band_in, e['stage']),
            ('2 F2.1: the 2008 stage; the map; the pins grey (the falling figure)', e['stage'], e['last_updated'])]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='F2.1, the sample-chip band (E02-11c, Ep2 v1 Act Four sc 19, inside E02-11)',
        mm='P10 ERA T2 (MM-06 II, "Sample-Chip, 2008") to picture', usage='BI',
        family='P10 ERA TIERS, T2 EARLY-WEB16: the band through the 16-bit sample-chip (BRR, 144 ms echo), swung',
        tone='nostalgia (the 2006 ad, the 2008 stage), a little cocky; then a pang (the pins going grey)',
        scenes=['Ep2 v1 Act Four sc 19, F2.1 (19.11-19.15)'],
        motifs=['the young Water Line (F G-F G-F: the nudge twice; the settle C F), the chip square on the nudges',
                'the pins\' falling figure (A-flat G F E-flat, each dimmer)'],
        motif_ids=[], key='A-flat maj9, D-flat maj9, E-flat 9sus (the early web\'s brighter A-flat colours; no F in the '
                          'bass, no F major, no A-natural)',
        composer='Ep2 v1 score pass (act4), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-21.0,
        album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['sweep'], 'render_front_sweep: the band in on the same chord'),
            (pins[0], 'pin_grey_tick x4: one falling note a pin'))],
        audition=['170.8-187.3 s: a memory, not a video game: the band through the sample-chip, swung; the pins\' figure '
                  'is a pang, not a game-over'])
    sc = c.finish(T, meta, length_end=e['last_updated'] + 1.5, tail_s=0.8)
    c.ev = dict(band_in=round(band_in, 3), t_wl1=round(t_wl1, 3), t_wl2=round(t_wl2, 3), t2=t2_rows, fall=fig,
                wl=wl_rows, pins=pins, last_updated=e['last_updated'])
    return c, sc


# ================================================================ E02-11b: the keynote's walk-on bed (diegetic)
KEY_CH = {   # ELPPA's walk-on bed: the glassy pad's voicing, the Rhodes ostinato's two notes, the sub's root
    'Ab': (['Eb4', 'G4', 'Bb4', 'C5'], ['Eb5', 'Bb4'], 'Ab1'), 'Db': (['F4', 'Ab4', 'C5', 'G5'], ['Ab5', 'C5'], 'Db2'),
    'Bbm': (['F4', 'Ab4', 'C5', 'Db5'], ['F5', 'C5'], 'Bb1'), 'Eb': (['Db4', 'F4', 'Ab4', 'Bb4'], ['Bb4', 'F5'], 'Eb2'),
}


def tracks_keynote():
    T = palette()
    T['rhodes'].gain_db, T['rhodes'].sends = -6.0, {'room': -14, 'plate': -12}
    T['pad'].gain_db = -8.0
    T['sub'].gain_db = -14.0
    T['cabasa'].gain_db = -16.0
    T['rim808'].gain_db = -14.0
    T['glock'].gain_db = -18.0
    return T


def cue_keynote(tl, lev):
    """ELPPA's keynote walk-on bed: an original media bed in the show's own design (OST rule 5: it crosses cuts, so it is
    on 96 and on the quartet's grid and its two-bar cycle).  Glassy and polite: a pad, a Rhodes ostinato in straight
    eighths, a soft sub on the bar, a cabasa; no four-on-the-floor, no claps, no stock rising piano.  Rendered dry; the
    lay-in plays it through the wall screen, then the campus PA"""
    cl = lev[0]
    e = cl.ev
    j_in = _B(tl, '19.01', 95.0) - plan_cut('18.15', 'jcut', 'lead_s', 0.8)
    t_out = e['f21'] + 0.9
    c = V.Cue('e02-11b-keynote-bed', tl, anchor=cl.bar1, anchor_bar=1, bars=int((t_out + 3.0 - cl.bar1) / BAR) + 2,
              swing=0.0)
    T = tracks_keynote()
    b0 = int(math.floor(c.bar_of(j_in - 0.6) + 1e-9))
    b1 = int(math.ceil(c.bar_of(t_out) - 1e-9))
    rows = []
    for b in range(b0, b1 + 1):
        t0 = c.bar(b)
        col = LOBBY[((b - 1) // 2) % 4]
        pad, ost, sub = KEY_CH[col]
        if (b - 1) % 2 == 0:
            V.pad(c, pad, t0, 2 * BAR + 0.3, vel=0.5, kind='warm', attack=0.6, release=0.8, bright=0.65)
            c.n('sub', sub, t0, 1.2, 0.36, True, punch=2.0, click=0.0, decay=1.4)
            rows.append((round(t0, 3), col))
        for j in range(8):
            tt = t0 + j * E8
            c.n('rhodes', ost[j % 2], tt, E8 * 0.7, 0.34 if j % 2 == 0 else 0.26)
            c.n('cabasa', 60, tt, 0.05, 0.3 if j % 2 else 0.22, lock=True)
        c.n('rim808', 60, t0 + 3 * Q, 0.1, 0.3, lock=True)
        if (b - 1) % 4 == 3:
            c.n('glock', ost[0], t0 + 3.5 * Q, 0.4, 0.3, lock=True)
    c.section('the keynote\'s walk-on bed (diegetic; the lobby\'s wall screen, then the campus PA)', j_in, t_out)
    c.mark(j_in, 'the keynote\'s walk-on bed comes up under the quartet (18.15 J %.1f s): ELPPA\'s stage music on the '
                 'lobby\'s wall screen, low' % (_B(tl, '19.01', 95.0) - j_in), hit=False)
    meta = dict(id=c.name, title='The keynote bed (E02-11b, Ep2 v1 Act Four sc 19, diegetic)',
                mm='MM-21 media beds (a keynote walk-on bed, original)', usage='BI',
                family='ROOM COLOURS: ELPPA\'s walk-on bed (diegetic, a wall screen and a PA)',
                tone='polished, polite, a little too glassy: someone else\'s stage', scenes=['Ep2 v1 Act Four sc 19'],
                motifs=['none (diegetic source music; it follows the quartet\'s two-bar cycle so the two agree)'],
                motif_ids=[], key='A-flat, D-flat lydian, B-flat m, E-flat sus (the quartet\'s cycle); no A-natural',
                diegetic=True, composer='Ep2 v1 score pass (act4), 2026-10-09', underscore_lufs=-24.0, album_lufs=-16.0,
                audition=['a tech keynote\'s walk-on through a TV and a far PA: polished, never "inspirational corporate", '
                          'never a stock cue'])
    sc = c.finish(T, meta, length_end=t_out + 0.5, tail_s=0.5)
    c.ev = dict(j_in=round(j_in, 3), t_out=round(t_out, 3), rows=rows, campus=e['campus'])
    return c, sc


# ================================================================ E02-12 ONE DOOR (P01 DARK ROOM, sparse)
def tracks_door():
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -4.0, {'room': -12, 'hall': -14}
    T['felt_mech'].gain_db = -22.0
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    T['door'] = replace(T['fl'], name='door', pan=0.5, width=0.35, sends={'hall': -18}, hum_ms=0.0, vel_jit=0.0,
                        rel=0.5, post=door_post, gain_db=-3.0)
    choir_src = ('sf2', GU, 0, 52, False)
    cred = T['reed'].credit
    T['choir'] = replace(T['reed'], name='choir', src=choir_src, credit=cred, gain_db=-6.0, pan=0.0, width=0.7,
                         sends={'hall': -9}, hum_ms=0.0, vel_jit=0.0, eq=[('hp', 90), ('lp', 4200)])
    T['reed'].gain_db, T['reed'].sends, T['reed'].pan = -12.0, {'hall': -10}, 0.1
    T['tri'].gain_db = -14.0
    return T


def cue_door(tl):
    B, E = tl.B, tl.E
    b22 = _B(tl, '22.01', 281.0)
    pin = _snd(tl, '22.01', 'pin_fall', b22 + 0.43)
    lot = max(b22 + plan_arrive('22.01', 2.0), pin + 1.2)   # the white turns out to be sky over the lot: the plan's
    #                                                         arrival (22.01 arrive.s), the picture's own number
    c = V.Cue('e02-12-one-door', tl, anchor=lot, anchor_bar=2, bars=int((tl.length + 4.0 - (lot - BAR)) / BAR) + 3,
              swing=0.0)
    T = tracks_door()
    e = dict(b22=b22, pin=pin, lot=lot, walk=_B(tl, '22.02', 288.46), orb=_snd(tl, '22.02', 'orb_scan_sweep', 292.75),
             band=_snd(tl, '22.03', 'ui_band_on', _B(tl, '22.03', 295.0)), verb=_os(tl, '22.03', 'Use flyer', 295.4),
             slot=_snd(tl, '22.04', 'flyer_into_slot', _B(tl, '22.04', 299.0) + 2.0),
             lift=_snd(tl, '22.04', 'mail_flap_lift', _B(tl, '22.04', 299.0) + 3.15), glimpse=_B(tl, '22.05', 303.58),
             shut=_snd(tl, '22.06', 'mail_flap_spring_shut', _B(tl, '22.06', 307.21) + 0.2),
             flap_mcu=_B(tl, '22.07', 308.42), hand=_B(tl, '22.08', 311.0), away=_B(tl, '22.09', 314.21),
             end=tl.length)
    e['jdrone'] = e['end'] - plan_cut('22.09', 'jcut', 'lead_s', 1.0)
    stop = e['shut'] - 0.02                                 # the designed stop: the flap shuts in room tone only
    ret = e['hand'] + HAND_S                                # his hand lowers (the plan's 22.08 note): the return
    e.update(stop=stop, ret=ret)
    # ---- one felt note a phrase (the first, A-flat, is the Door's missing note, given by his own piano)
    # (the first note is E-flat 4, the D-flat fifth's 9th, open, no third; no A-flat in the lot's first phrase: an
    # A-flat there would supply the Door's missing first note, which stays missing until Ep11; the score review)
    felt = [(lot, 'Eb4', 0.2, 'the lot appears: the first felt note, E-flat 4, alone in the sky (the D-flat fifth\'s '
                                '9th: open, no third)'),
            (c.bar(4), 'Bb3', 0.17, 'he walks up from frame-left, never running (a fourth down: quartal, still)'),
            (c.bar(6), 'Db4', 0.16, 'the Orb scans the cube and toasts nothing')]
    door1 = c.next_bar(e['verb'] - 0.2) if c.next_bar(e['verb'] - 0.2) - e['verb'] < 0.7 else c.next_beat(e['verb'])
    felt.append((door1 + 2 * BAR if door1 + 2 * BAR < e['slot'] - 0.3 else door1 + BAR, 'C4', 0.15,
                 'the flyer out of his jacket, unfolded'))
    felt.append((ret, 'Bb3', 0.16, 'THE RETURN: his raised hand lowers (held two beats): the felt\'s B-flat, the D-flat '
                                   'fifth under it again (soft entries)'))
    t_walk2 = c.next_beat(e['away'] + 0.02)
    felt.append((c.next_bar(t_walk2 + 1.0) if c.next_bar(t_walk2 + 1.0) < e['jdrone'] - 0.2 else t_walk2 + 2 * Q,
                 'Ab3', 0.14, 'his back, small, crossing the lot'))
    felt.sort()
    for t, p, v, why in felt:
        c.n('felt', p, t, 4.0, v)
        c.n('felt_mech', 60, t, 0.1, 0.22)
        c.mark(t, f'felt {p}: {why}', hit=False)
    c.ped['felt'] = [(c.clk(t), c.clk(min(t + 4.6, (stop if t < stop else e['end'] + 0.8)))) for t, _, _, _ in felt]
    # ---- the bowed D-flat fifth (sul tasto, ppp): the bed under the walk-up, the verb, the glimpse; back on the return
    c.rebow('vc', 'Db3', lot + 0.2, stop + 0.4, 0.11, seg=5.0, xf=1.0, first_att=3.0, last_rel=0.2, art='sus', lp=1100)
    c.rebow('vla', 'Ab3', lot + 0.6, stop + 0.4, 0.1, seg=5.0, xf=1.0, first_att=3.2, last_rel=0.2, art='sus', lp=1300)
    c.rebow('vc', 'Db3', ret, e['end'] + 1.6, 0.11, seg=5.0, xf=1.0, first_att=1.2, last_rel=1.4, art='sus', lp=1100)
    c.rebow('vla', 'Ab3', ret + 0.2, e['end'] + 1.6, 0.1, seg=5.0, xf=1.0, first_att=1.4, last_rel=1.4, art='sus', lp=1300)
    # ---- THE DOOR, its first note missing, through the door, under the verb; its G held into the glimpse's choir
    d1 = door(c, door1, DOOR_MISSING, 0.4, hold_to=e['glimpse'] + 0.8)
    c.mark(door1, f'"Use flyer on door" (the band, {e["band"]:.2f}): THE DOOR, its first note missing (D-flat 5, C5, then '
                  'G4 held: the #4), non-vibrato flute through the door (low-passed, one side)', hit=False)
    # ---- the GPU choir under the glimpse (its G is the Door's G)
    ch_on = e['lift']
    for inst, v in (('choir', 0.3), ('reed', 0.22)):
        c.ch(inst, GPU + ['C5'], ch_on, stop - ch_on + 0.05, v, roll=0.0, lock=True)
    T['choir'].auto = [(c.clk(ch_on - 0.05), 10 ** (-40 / 20)), (c.clk(e['glimpse'] + 0.3), 1.0),
                       (c.clk(stop - 0.05), 1.0)]
    T['reed'].auto = list(T['choir'].auto)
    c.mark(ch_on, f'the flap lifts ({e["lift"]:.2f}): the GPU choir (D-flat sus2(#11), no third, + C5) swells in under '
                  'the glimpse of Alyi at work (he never looks up); the Door\'s G becomes the choir\'s G', hit=False)
    c.mark(stop, 'THE DESIGNED STOP: the flap swings shut on its spring in room tone only (mail_flap_spring_shut %.3f): '
                 'every voice and tail to zero 0.02 s before it' % e['shut'], hit=False)
    # ---- the return (soft), and the Door again across the walk: its G held, no cadence, ringing over the cut
    d2 = door(c, t_walk2, DOOR_MISSING, 0.36, hold_to=e['end'] + 0.6)
    chip(c, 'tri', 'Bb3', ret, 1.2, 0.3, att=0.02, dec=0.5, sus=0.3, rel=0.4)
    c.mark(t_walk2, 'he turns and walks away: THE DOOR again, its first note missing, its G held across the walk and '
                    'over the cut: no cadence (the Door cadences only in Ep11)', hit=False)
    c.mark(e['jdrone'], 'the dark room\'s drone fades up under the Door\'s last bar (22.09 J %.1f s, the stems\'s): the G '
                        'rings on into the tag (render/music-el-ringout.wav: the out)' % (e['end'] - e['jdrone']),
           hit=False)
    secs = [('1 the lot appears: the first felt note (E-flat); the walk-up; the Orb', lot, door1),
            ('2 "Use flyer on door": THE DOOR (first note missing); the flyer into the slot', door1, ch_on),
            ('3 the glimpse: the GPU choir under it', ch_on, stop),
            ('4 THE DESIGNED STOP: the flap shuts in room tone only; Mas at the shut flap', stop, ret),
            ('5 the return as his hand lowers; the walk away: THE DOOR again, no cadence', ret, e['end'])]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    rides = [(lot - 0.3, door1 - 0.2, -2.5),                  # the felt alone in the sky: hushed
             (ch_on, stop, 0.5),                               # the glimpse
             (ret - 0.1, t_walk2, -1.5)]                       # the return: soft
    macro = ride_macro(rides, c.bar1 - 1.0, e['end'] + 3.0)
    meta = dict(
        id=c.name, title='One Door (E02-12, Ep2 v1 Act Four sc 22)',
        mm='new to picture (P01 DARK ROOM, sparse + the Door and the GPU choir, MM-18)', usage='BI',
        family='P01 DARK ROOM (one felt note a phrase) + the Door through the door + the GPU choir',
        tone='stillness; a held breath at the gap; the one quiet ache, landing on his choice',
        scenes=['Ep2 v1 Act Four sc 22 (22.01-22.09)'],
        motifs=['the felt, one note a phrase (the first: the Door\'s missing A-flat)',
                'THE DOOR with its first note missing (flute, through the door), twice; its G held, no cadence',
                'the GPU choir (D-flat sus2(#11)) under the glimpse'],
        motif_ids=[], key='D-flat lydian (the Door), a D-flat fifth; no third over F; no A-natural',
        composer='Ep2 v1 score pass (act4), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-21.5,
        album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (pin, 'pin_fall: into the white (no music yet)'), (e['orb'], 'orb_scan_sweep: toasts nothing'),
            (e['band'], 'ui_band_on: the Door under the verb'), (e['slot'], 'flyer_into_slot'),
            (e['lift'], 'mail_flap_lift: the choir swells in'),
            (e['shut'], 'mail_flap_spring_shut: THE DESIGNED STOP (room tone only)'))],
        audition=['283-295 s: the felt notes are sparse and still, never a sad-piano cliché', '295.5-303 s: the Door '
                  'through the door under the verb: longing, not a hymn', '302-307.4 s: the choir under the glimpse is a '
                  'held breath; the stop on the flap lands', '313 s: the return as his hand lowers is soft',
                  '314-319 s and the ring-out: the Door\'s G left open over the cut'])
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=e['end'] + 2.6, tail_s=0.4, macro=macro, mutes=[(stop, ret - 0.01)])
    c.ev = dict({k: (round(v, 3) if isinstance(v, float) else v) for k, v in e.items()}, door1=d1, door2=d2,
                felt=[(round(t, 3), p) for t, p, _, _ in felt], t_walk2=round(t_walk2, 3), ch_on=round(ch_on, 3))
    return c, sc


def build_all(tl):
    out = {}
    out['leverage'] = cue_leverage(tl)
    out['keynote'] = cue_keynote(tl, out['leverage'])
    out['f21'] = cue_f21(tl, out['leverage'])
    out['door'] = cue_door(tl)
    return out


def music_runs(tl):
    runs = []
    for b in tl.beats:
        m = next((c.split(': ', 1)[1] for c in b['b'].get('cues', []) if c.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


# ================================================================ lay-in, the pre-lap, the ring-out
def lay(tl, built, work):
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')     # noqa: E731
    cl, ck, cf, cd = (built[k][0] for k in ('leverage', 'keynote', 'f21', 'door'))
    lev_end = cl.ev['pz'] + 1.3
    campus = ck.ev['campus']
    l_over = plan_cut('19.06', 'lcut', 'over_s', 0.8)
    layers = [
        dict(name=built['leverage'][1].name, wav=wav('leverage'), T0=cl.T0, a0=0.0, a1=lev_end, fin=0.0, fout=0.6),
        dict(name=built['keynote'][1].name + ' (wall screen)', wav=wav('keynote'), T0=ck.T0, a0=ck.ev['j_in'],
             a1=campus + l_over, fin=0.8, fout=l_over, post=wall_tv, post_name='futz tv: the lobby\'s wall screen'),
        dict(name=built['keynote'][1].name + ' (campus PA)', wav=wav('keynote'), T0=ck.T0, a0=campus,
             a1=ck.ev['t_out'], fin=l_over, fout=0.9, post=far_pa, post_name='futz pa, low-passed, -5 dB: the campus PA '
                                                                             'far off'),
        dict(name=built['f21'][1].name, wav=wav('f21'), T0=cf.T0, a0=cf.ev['band_in'] - 0.05,
             a1=cf.ev['last_updated'] + 1.4, fin=0.05, fout=0.9),
        dict(name=built['door'][1].name, wav=wav('door'), T0=cd.T0, a0=cd.ev['lot'] - 0.02, a1=tl.length, fin=0.01,
             fout=0.005),
    ]
    designed = [(round(cl.ev['pz'] + 0.35, 3), round(cd.ev['lot'] - 0.02, 3),
                 'the quartet has ended as the complaint left the lobby (the cello\'s last pizzicato on the (FOR NOW) '
                 'note\'s landing); room tone only under the dark room\'s Jun 19 post (Alyi\'s own act: W8, the plan\'s '
                 '"under the dark room, room tone only") and the hard cut to white; the re-entry is E02-12\'s first felt '
                 'note as the lot appears'),
                (round(cd.ev['stop'], 3), round(cd.ev['ret'], 3),
                 'THE DESIGNED STOP (22.06): the flap swings shut on its spring in room tone only; Mas at the shut flap; '
                 'the re-entry as his raised hand lowers (22.08)')]
    stings = [(cl.ev['pz'] - 0.1, cl.ev['pz'] + 1.3, 'E02-11: the cello\'s last pizzicato (designed, on the note\'s '
                                                     'landing)')]
    return layers, designed, stings


def write_prelap(tl, built, work, tag):
    """render/music<tag>-prelap.wav: the quartet's first pizzicato under Act Three's black (17.21 J 1.2 s), from Act
    Three's (length - 1.2) to its last sample, continuous with music<tag>.wav's first sample"""
    import soundfile as sf
    cl, sl = built['leverage']
    x, _ = sf.read(os.path.join(work, f'{sl.name}-underscore.wav'), always_2d=True, dtype='float64')
    a = cl.ev['j0']
    i0, i1 = int(round((a - cl.T0) * SR)), int(round((0.0 - cl.T0) * SR))
    if i0 < 0 or i1 <= i0:
        return None
    y = x[i0:i1].copy()
    k = int(0.005 * SR)
    y[:k] *= np.linspace(0.0, 1.0, k)[:, None]
    fp = os.path.join(HERE, 'render', f'music{tag}-prelap.wav')
    sf.write(fp, y.astype(np.float32), SR, subtype='PCM_24')
    pk = float(np.abs(y).max())
    try:
        t3 = V.TL(V.el_path('act3'))
        a3 = t3.length + a
    except Exception:           # noqa: BLE001
        a3 = None
    return dict(file=os.path.relpath(fp, V.REPO), seconds=round(len(y) / SR, 4), starts_at_act3_s=a3,
                first_pizzicato_s=round(cl.ev['first'], 4), peak_dbfs=round(20 * math.log10(pk + 1e-12), 1),
                lay=f'under Act Three\'s black: its last {len(y) / SR:.3f} s (from {a3:.3f} s on Act Three\'s clock; its '
                    f'DREAD sting at 318.217 rings on underneath), so the quartet\'s first pizzicato sounds '
                    f'{-cl.ev["first"]:.3f} s before Act Four\'s first frame (17.21 J {-a:.1f} s: the beacon\'s motor '
                    'and the quartet\'s first pizzicato under the black); continuous with music' + tag + '.wav\'s first '
                    'sample. mix_episode.py lays it on Act Three\'s score bus from that time (score_bus: the next chapter\'s '
                    'pre-lap, ending on Act Three\'s last sample, at Act Four\'s head gain), and Act Four\'s head fade is '
                    'off: the texture is already playing (designed_hit at %.3f; the score review, 2026-10-09)' % cl.ev['bar0']
                if a3 is not None else 'under Act Three\'s last 1.2 s', fade_in_s=0.005)


def write_ringout(tl, built, work, tag, seconds=2.6):
    """render/music<tag>-ringout.wav: E02-12 released past Act Four's last frame (the Door's held G and the D-flat fifth's
    release), which mix_episode.py lays at the tag's head and crossfades out under the tag's own score"""
    import soundfile as sf
    cd, sd = built['door']
    x, _ = sf.read(os.path.join(work, f'{sd.name}-underscore.wav'), always_2d=True, dtype='float64')
    i0 = int(round((tl.length - cd.T0) * SR))
    i1 = min(len(x), i0 + int(seconds * SR))
    if i1 <= i0:
        return None
    y = x[i0:i1].copy()
    n = len(y)
    f = np.cos(0.5 * np.pi * np.linspace(0.0, 1.0, n)) ** 1.5
    y *= f[:, None]
    fp = os.path.join(HERE, 'render', f'music{tag}-ringout.wav')
    sf.write(fp, y.astype(np.float32), SR, subtype='PCM_24')
    pk = float(np.abs(y).max())
    return dict(file=os.path.relpath(fp, V.REPO), seconds=round(n / SR, 4), peak_dbfs=round(20 * math.log10(pk + 1e-12), 1),
                lay='the tag\'s head: mix_episode.py lays music' + tag + '-ringout.wav (the previous chapter\'s score '
                    'released past its last frame) at the tag\'s 0 and crossfades it out over 2.5 s from the tag\'s own '
                    'score entry; continuous with music' + tag + '.wav\'s last sample (the act\'s last 5 ms are not faded)',
                fade='a cosine^1.5 over its length')


def unfade_tail(out_wav, tl, built, work, m_s=0.005):
    """V.assemble fades every layer's window end over 5 ms; E02-12's last 5 ms are put back un-faded, so the act's last
    sample runs straight into the ring-out's first"""
    import soundfile as sf
    cd, sd = built['door']
    y, sr = sf.read(out_wav, always_2d=True, dtype='float64')
    x, _ = sf.read(os.path.join(work, f'{sd.name}-underscore.wav'), always_2d=True, dtype='float64')
    N = len(y)
    m = int(m_s * SR)
    i0 = N - m
    j0 = i0 - int(round(cd.T0 * SR))
    if j0 < 0 or j0 + m > len(x):
        return False
    u = np.linspace(0.0, 1.0, m)
    fade = np.cos(0.5 * np.pi * u)
    y[i0:N] += x[j0:j0 + m] * (1.0 - fade)[:, None]
    sf.write(out_wav, y.astype(np.float32), SR, subtype='PCM_24')
    return True


# ================================================================ main
def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    reals = mark_real(tl)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    built = build_all(tl)
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s; real lines '
              f'(from the plan): {reals}; record on screen: {[(round(a, 2), round(b, 2), x[:24]) for a, b, x in record_windows(tl)]}')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m[:110] or "(no music string)"}')
        for k, (c, sc) in built.items():
            print(k, sc.name, V.note_qa(sc), f'file T0 {c.T0:.3f}')
            for t, lab, h in sorted(c.marks):
                print(f'   {t:8.3f} {"*" if h else " "} {lab[:170]}')
            print('   ev:', {kk: vv for kk, vv in c.ev.items() if not isinstance(vv, list)})
        return
    if args.render is not None:
        for k in (args.render or list(built)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, designed, stings = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, designed=designed)
    unf = unfade_tail(out, tl, built, work)
    import soundfile as sf
    mix = sf.read(out, always_2d=True, dtype='float64')[0].T
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', max(0.0, a0), min(tl.length, a1)) for k, (c, sc) in built.items()
            for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed, stings=stings)
    cl, cd = built['leverage'][0], built['door'][0]
    res['head_momentary_max'] = V.momentary_max(mix, 0.0, 5.0)
    res['momentary'] = {lab: V.momentary_max(mix, a, b) for lab, a, b in (
        ('the lighthouse', 0.0, cl.ev['beam']), ('Neleh, the card (the pedal)', cl.ev['stop_tv'], cl.ev['re_in']),
        ('the committee', cl.ev['re_in'], cl.ev['t_present']),
        ('Mario', cl.ev['rp'], cl.ev['stop_win']), ('the chill', cl.ev['stop_win'], cl.ev['ache_end']),
        ('the lobby', cl.ev['lob'], cl.ev['stop_post']), ('his post (the pedal)', cl.ev['stop_post'], cl.ev['call_in']),
        ('the call', cl.ev['call_in'], cl.ev['end_call']), ('F2.1', cl.ev['band_in'], cl.ev['last_updated']),
        ('the garden', cl.ev['garden'], cl.ev['ph3']), ('one violin', cl.ev['ph3'], cl.ev['gate_in']),
        ('the gate', cl.ev['gate_in'], cl.ev['z_in']), ('zAI', cl.ev['z_in'], cl.ev['padlock']),
        ('the fanfare', cl.ev['fanfare'], cl.ev['fanfare'] + 1.2), ('the morning', cl.ev['morn'], cl.ev['pz']),
        ('the last pizzicato', cl.ev['pz'], cl.ev['pz'] + 1.0), ('the lot', cd.ev['lot'], cd.ev['door1'][0][0]),
        ('the Door (1)', cd.ev['door1'][0][0], cd.ev['ch_on']), ('the glimpse', cd.ev['ch_on'], cd.ev['stop']),
        ('the return, the walk', cd.ev['ret'], tl.length))}
    from engine.mix import lufs
    res['vo_windows_lufs'] = []
    for ln in tl.lines:
        if ln['kind'] == 'vo':
            i0, i1 = int(ln['on'] * SR), int(ln['end'] * SR)
            z = mix[:, i0:i1]
            res['vo_windows_lufs'].append(dict(line=ln['id'], t0=round(ln['on'], 2), t1=round(ln['end'], 2),
                                               lufs=round(lufs(z), 2) if np.abs(z).max() > 0 else None))
    prelap = write_prelap(tl, built, work, tag)
    ringout = write_ringout(tl, built, work, tag)
    by_name = {sc.name: (k, c, sc) for k, (c, sc) in built.items()}
    cues = []
    for L in layers:
        nm_ = L['name'].split(' (')[0]
        k, c, sc = by_name[nm_]
        cues.append(dict(cue=L['name'], key=k, start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                         family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO),
                         laid_at_s=round(c.T0, 4), post=L.get('post_name'), level=res['cues'][L['name']],
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
        level='underscore (each cue at its engine master: E02-11 -20.5, the keynote bed -24 (laid through a wall screen '
              'and a far PA), E02-12 -21.5 LUFS-I), dry of dialogue; the mixer ducks it (E02-11 9 dB, E02-12 7 by mood)',
        cues=cues, silences_designed=[dict(t0=a, t1=b, why=w) for a, b, w in designed],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack or entry on a story beat; '
                           'keep its attack') for k, (c, sc) in built.items() for t, lab, h in c.marks
                      if lab.startswith('DESIGNED HIT')],
        claims_sfx=['20.02:nole_fanfare_short'],
        sections=sections, real_lines=reals,
        record_on_screen=[dict(t0=round(a, 3), t1=round(b, 3), text=x) for a, b, x in record_windows(tl)],
        prelap=prelap, ringout=ringout, tail_unfaded=unf,
        picture_sync=[
            dict(what='the lot appears: the designed silence ends, E02-12\'s first felt note',
                 t=round(cd.ev['lot'], 3), frame=int(round(cd.ev['lot'] * 24)),
                 source='the beat plan\'s 22.01 arrive.s (2.0 s: "the white and the falling pin"), read by track.py; '
                        'the picture draws its arrival to the same number'),
            dict(what='the quartet\'s pedal lifts (the complaint has risen out of frame)', t=round(cl.ev['flutter'], 3),
                 frame=int(round(cl.ev['flutter'] * 24)), source='the lock\'s 20.09 sticky_flutter (a sound)'),
            dict(what='the return as his raised hand lowers', t=round(cd.ev['ret'], 3),
                 frame=int(round(cd.ev['ret'] * 24)),
                 source='the beat plan\'s 22.08 picture note: the hand lowers 2.0 s into the shot (frame 48); '
                        'track.py HAND_S. The picture draws to it')],
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['nole_fanfare_short (20.02): CLAIMED by the score (Nole\'s Launch, short: it is music, tuned to '
                      'the C pedal); the SFX board has none',
                      'lamp_click (20.02, 20.04): the SFX\'s; the fanfare starts 0.2 s after the first',
                      'pin_grey_tick x4 (19.14): the SFX\'s soft ticks; the score\'s falling figure puts one chip note on '
                      'each (A-flat 5, G5, F5, E-flat 5): tune each tick a step lower, never to A',
                      'lanyard_drop x2 (18.07): on an 808 beat; keep them dry',
                      'post_click (19.07): the eighths stop on the next eighth (the stop is the move): keep its attack',
                      'padlock_snap (20.03): the 808 drops out there: keep it dry',
                      'mail_flap_spring_shut (22.06): THE DESIGNED STOP: the music is at zero from 0.02 s before it to '
                      'the return; the flap plays in room tone only',
                      'render_front_sweep (19.11): F4 to F6; the T2 band enters on the quartet\'s own A-flat chord',
                      'the keynote\'s walk-on bed is the score\'s (E02-11b, an original media bed, not an SFX)'],
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]} (tail un-faded: {unf})')
    if prelap:
        print('prelap:', prelap['file'], prelap['seconds'], 's, peak', prelap['peak_dbfs'], 'dBFS')
    if ringout:
        print('ringout:', ringout['file'], ringout['seconds'], 's, peak', ringout['peak_dbfs'], 'dBFS')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    for r in res['rows']:
        print(f'  {r["start"]:7.2f}-{r["end"]:7.2f} {r["lufs_i"]} LUFS-I {r["true_peak_dbtp"]} dBTP  {r["section"][:90]}')
    print('unmarked digital silence:', res['unmarked_digital_silence'], 'holes:',
          [h for h in res['holes_below_-60'] if not h['inside_marked']], 'undesigned fragments:',
          res['undesigned_fragments'])
    print('V.O. windows:', res['vo_windows_lufs'])
    print('momentary:', res['momentary'])


if __name__ == '__main__':
    main()
