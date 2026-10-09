#!/usr/bin/env python3
"""E02 v1 · TAG "august" (sc 23) · the segment's score, laid on the segment's own clock (0 = its first frame).
One render, E02-13 AUGUST: one continuous performance through the tag, THE RUN (P07) handing over to RUMPT's Podium in
its FEAR colour (P13, MM-19's FEAR), on one 96 BPM grid whose bar line falls on the tag's last frame, so the out (the
cut to black) lands on a downbeat.

The brief (manifest.md §6 E02-13; proposal.md sc 23, "The feeling curve" and "The seams"; script-v1.md sc 23's MUSIC
line; the beat plan's music strings, which the lock carries; the lock's music runs).  The mood map: the run's
momentum; a laugh at the suit's calmer punctuation; satisfaction at the fact-check; a chill at the taut string, and on
Mas's face.  README.md has the cue sheet (seconds, cue, what plays, why) and the measurements.

  s (EL lock)     what plays
   0    -  4.5    THE RUN holds its pedal under the suit's landing: the D-flat fifth bowed sul tasto swells in under Act
                  Four's ring-out (the Door's held G and its D-flat fifth, which the mix lays at the tag's head and
                  crossfades out), the felt's open fifth D-flat 3 + A-flat 3 a beat in (0.75, as he sits); the THUD
                  (1.6) and the docket's caption play over the pedal alone
   4.5  -  8.56   THE RUN (straight; the record): the knee stab (the title's quartal C F B-flat E-flat on brass + a chip
                  double) on the cut to the pages; the felt ostinato (3+3+2 eighths), the cello's pizzicato bass, a dry
                  sticks groove (16th hats, a 3+3+2 kick and side-stick: never boom-bap), the Build's chip arpeggio
                  (eighths, then 16ths); D-flat maj9, then F m9 (a chord a bar); the pages lose their exclamation
                  points under it and the music doesn't comment
   8.56 - 13.09   B-flat m9 (the iv), pre-lapping the cut to the post; under the post (the record) THE RUN thins: the
                  chip and the felt out, the hats and the pizzicato soft, the pad holds; its stab waits
  13.09 - 17.23   the post's stab, waited (the first 16th after the post clears, on the cut to the Orb): C7sus (the
                  V), the engine back; xylophone and wood join on the bar the scan starts (a layer)
  17.23 - 19.5    the engine clears the Orb's F chime (SFX, 17.28): a stop, the bed held; THE VERDICT a beat later:
                  F5 then C6 on vibes and glass over the open fifth F (no third): the iv-V-I lands on the machine's
                  answer
  19.5  - 22.63   THE RUN again (F m9; a violin pizzicato layer), the V.O. "sixty elections this year." inside the bed
                  (the felt takes F for A-flat, the xylophone rests, a -4.5 dB ride)
  22.63           the last knee stab (F7sus) and THE RUN's stop, 0.25 s before the AUG 21 cut
  22.63 - 27.63   THE RUN's pedal: the open fifth F (the room's own F, no third) under the lower third; the neutral text
                  blip (SFX) carries his words
  27.63 - 33.25   RUMPT's Podium, FEAR (under the balloon only): the cup-muted trombone's Podium in E-flat minor
                  (half-time: E-flat F | G-flat B-flat | E-flat held), entering a beat after the cut because the band
                  waits for his words to clear (OST §2.10); muted horns, pp; tremolo low strings; a timpani roll into
                  the held E-flat on the knot; one soft chip glint
  33.25 - 37.0    the Podium thins to one held chord (E-flat minor) under the taut string and Mas's face; his felt F4
                  (the chord's ninth, Mas's home note) on the cut to his face; the cut to black on the downbeat (37.0):
                  every voice stops dead (5 ms), the tails cut

Every sync point comes from the lock (beats, lines, sounds, on-screen items), so the score re-lays itself when timing
moves.  Chord changes that land on cuts pre-lap them by the latest eighth at least 0.15 s before the cut, unless the
record holds the screen up to the cut (then the change waits for it).  No change lands inside the V.O. or the record
on screen (the docket's caption, his post, the lower third): the record plays dry (OST rule 10).

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0, P07, P13, §2.4, §2.10): the 96 BPM grid; the knee's cells;
chip in the cue; no A-natural anywhere; the knee never whole; straight for the record and the machine; no comic scoring
(the stop is the only tool: the engine's stop at the chime, THE RUN's stop at AUG 21, the cut on the downbeat); no
Mickey-Mousing; continuous through the tag (it thins, never stops, until the out); nothing below C3 in his dark room
(room_drone F1 + C2, server_hum F2), except the timpani roll's B-flat 2 (a fourth over the hum's F2: README, judgement
call 4); no 808 (LEVERAGE's only); designed hits marked.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --dry --el          # runs, marks, note QA
    MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --assemble --el     # re-lay render/_work/el, measure
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks
Out: render/music[-el].wav (the segment's exact length) and cues[-el].json, which names the timeline it was laid to.
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
from v3lib import palette, nm   # noqa: E402
from engine import art   # noqa: E402
from engine.arrange import cup_mute, CREDIT_SYN   # noqa: E402
from engine.core import SR, midi_hz   # noqa: E402
from engine.render import Track   # noqa: E402

SEG = 'tag'
Q, BAR, S16 = V.Q, V.BAR, V.S16
E8 = Q / 2.0
PLAN = os.path.join(V.REPO, 'show', 'episodes', 'ep02', 'production', 'v1', 'beat-plan', 'tag.json')
CUE = 'e02-13-august'


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


# ================================================================ the lock: the record on screen, the V.O., events
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


def mark_real(tl):
    """real (sourced) spoken lines, from the plan's notes ([P ...], [V ...], [K ...]); the tag has none: its one line
    is Mas's V.O. (invented), and the record is on screen"""
    pl = plan_doc()['lines']
    out = []
    for ln in tl.lines:
        note = (pl.get(ln['id'], {}).get('note') or '').lstrip()
        if note.startswith(('[P', '[V', '[K')) and ln['kind'] != 'vo':
            ln['kind'] = 'real'
            out.append(ln['id'])
    return out


def record_windows(tl):
    """the record on screen, (t0, t1, text): every post and broadcast lower third, a quoted document, and a document whose
    beat cites a facts row (the docket's caption, facts A48).  Act Four's rule.  A window ends at its shot's cut at the
    latest (the docket's `until` runs 0.02 s past its beat)."""
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
                out.append((a, min(e, b['t1']), txt[:48]))
    return sorted(out)


def merge(ws):
    out = []
    for a, b in sorted(ws):
        if out and a <= out[-1][1]:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return [(a, b) for a, b in out]


def still_windows(tl):
    """where the score doesn't move: the V.O. and the record on screen"""
    w = [(ln['on'] - 0.1, ln['end'] + 0.05) for ln in tl.lines if ln['kind'] in ('mas', 'vo', 'real')]
    w += [(a - 0.1, b) for a, b, _ in record_windows(tl)]
    return merge(w)


def inside(t, ws, pad=0.0):
    return next(((a, b) for a, b in ws if a - pad <= t < b + pad), None)


def _snd(tl, bid, name, default, k=1):
    try:
        return tl.snd(bid, name, k=k, default=default) if tl.has(bid) else default
    except KeyError:
        return default


def _sndall(tl, bid, name):
    return sorted(s['t'] for s in tl.sounds if s['beat'] == bid and s['name'] == name)


def _B(tl, bid, default):
    return tl.B(bid) if tl.has(bid) else default


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


def _vo(tl, near):
    vs = [ln for ln in tl.lines if ln['kind'] == 'vo']
    return min(vs, key=lambda ln: abs(ln['on'] - near)) if vs else None


# ================================================================ the grid
def lead_in(c, t, min_lead=0.15, step=E8):
    """the latest grid point (every `step` s) at least min_lead before t: a change that lands on a cut pre-laps it by
    about a quarter second (Ep1 v3.5's rule; THE RUN is straight, so no swung and)"""
    k = math.floor((t - min_lead - c.bar1) / step + 1e-9)
    return c.bar1 + k * step


def after(c, t, step=E8):
    """the first grid point at or after t"""
    return c.bar1 + math.ceil((t - c.bar1) / step - 1e-9) * step


def grid(c, t0, t1, step=S16):
    k = math.ceil((t0 - c.bar1) / step - 1e-6)
    out = []
    t = c.bar1 + k * step
    while t < t1 - 1e-6:
        out.append(t)
        t += step
    return out


def how(c, t, cut):
    k = (t - c.bar1) / Q
    kind = ('on the bar' if abs((t - c.bar1) / BAR - round((t - c.bar1) / BAR)) < 0.01 else
            'on the beat' if abs(k - round(k)) < 0.02 else
            'on an eighth' if abs(2 * k - round(2 * k)) < 0.04 else 'on a sixteenth')
    return f'{kind}, {cut - t:.2f} s before the cut' if cut >= t else f'{kind}, {t - cut:.2f} s after the cut'


def ride_macro(rides, t_start, t_end, ramp=0.3):
    """fader points [(t, dB)] for rides [(t0, t1, dB)] (a step per ride, each edge ramped over 2 x ramp s, never past
    half-way to its neighbours); overlapping rides add.  Act Three's version (via Act Four)."""
    lvl = lambda t: sum(d for a, b, d in rides if a <= t < b)      # noqa: E731
    pts = [(t_start, lvl(t_start))]
    xs = sorted({a for a, _, _ in rides} | {b for _, b, _ in rides})
    for i, x in enumerate(xs):
        r = min([ramp] + [(x - xs[i - 1]) / 2.0 for _ in (0,) if i > 0] + [(xs[i + 1] - x) / 2.0 for _ in (0,)
                                                                            if i + 1 < len(xs)])
        pts += [(x - r, lvl(x - 1e-3)), (x + r, lvl(x + 1e-3))]
    pts.append((t_end, lvl(t_end)))
    return pts


# ================================================================ the glass (the verdict's second voice)
def glass_fn(n, rng):
    """a struck glass bowl (a rim tap): a nearly pure tone with a slow beat against its neighbour bowl, a touch of its
    2nd harmonic in the first quarter second, a 3 ms tap, ringing free for x ring seconds.  No 3rd or 5th harmonic (no
    A over an F: the verdict is a no-third window)."""
    f0 = midi_hz(n.pitch)
    ring = float(n.x.get('ring', 1.9))
    N = int((max(0.05, float(n.dur)) + ring * 4.0) * SR)
    t = np.arange(N) / SR
    env = np.clip(t / 0.004, 0.0, 1.0) * np.exp(-t / ring)
    beat = rng.uniform(0.55, 0.95)
    ph = rng.uniform(0, 2 * np.pi, 4)
    main = np.sin(2 * np.pi * f0 * t + ph[0])
    partner = np.sin(2 * np.pi * (f0 + beat) * t + ph[1])
    harm = 0.07 * np.exp(-t / 0.22) * np.sin(2 * np.pi * 2.0 * f0 * t + ph[2])
    m = min(N, int(0.012 * SR))
    tap = np.zeros(N)
    tap[:m] = rng.standard_normal(m) * np.exp(-np.arange(m) / (0.003 * SR)) * 0.035
    left = env * (main + 0.4 * partner + harm) + tap
    right = env * (0.85 * main + 0.55 * partner + harm) + tap
    lvl = 10 ** (-24.0 * (1.0 - float(n.vel)) / 20.0) * 0.2
    return (np.stack([left, right]) * lvl).astype(np.float32)


# ================================================================ the harmony
# THE RUN's chord loop (P07: Fm9 - Dbmaj9 - Bbm9 - C7sus; growth is a new layer, never a key change), placed per item.
# Nothing below C3 (his dark room's F hum).  The pad is THE RUN's pedal layer: sul tasto (vc, vla, vln2, vln1).
PAD = {
    'Db5':    ['Db3', 'Ab3'],                        # the head: the Door's D-flat fifth, taken over
    'Dbmaj9': ['Db3', 'Ab3', 'C4', 'F4'],
    'Fm9':    ['F3', 'C4', 'G4', 'Ab4'],
    'Bbm9':   ['F3', 'Bb3', 'Db4', 'C5'],            # B-flat m9 over the room's F
    'C7sus':  ['C3', 'G3', 'Bb3', 'F4'],
    'F5':     ['F3', 'C4', 'G4'],                    # the verdict: the open fifth (+ the 9th), no third
    'Fm9b':   ['F3', 'C4', 'Eb4', 'Ab4'],            # Mas's V.O.: F m9 again, re-voiced
    'Fped':   ['F3', 'C4'],                          # THE RUN's pedal: the room's own F, no third
}
FELT = {   # the felt ostinato: straight eighths in a 3+3+2 grouping (a b c | a b c | d e), rootless above the bass
    'Dbmaj9': ['Ab3', 'Eb4', 'F4', 'Ab3', 'Eb4', 'F4', 'C5', 'Eb4'],
    'Fm9':    ['C4', 'G4', 'Ab4', 'C4', 'G4', 'Ab4', 'Eb5', 'G4'],
    'Bbm9':   ['Db4', 'F4', 'C5', 'Db4', 'F4', 'C5', 'Ab4', 'F4'],
    'C7sus':  ['Bb3', 'F4', 'G4', 'Bb3', 'F4', 'G4', 'Db5', 'F4'],
    'Fm9b':   ['C4', 'G4', 'F4', 'C4', 'G4', 'F4', 'Eb5', 'Bb4'],     # under the V.O.: F, not A-flat (render 2: the
}                                                                     # chip's short A-flats read as A over a weak F)
PIZZ = {   # the cello's pizzicato bass on the 3+3+2 eighths (1, 4, 7): the root, then down the chord (>= C3)
    'Dbmaj9': ('Db3', 'Ab3', 'Eb3'), 'Fm9': ('F3', 'C4', 'Eb3'), 'Bbm9': ('Bb3', 'F3', 'Db3'),
    'C7sus': ('C3', 'G3', 'Bb3'), 'Fm9b': ('F3', 'C4', 'F3'),
}
SCALE = ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb']           # F aeolian: the Build moved diatonically (no A-natural)
BUILD_STEPS = [0, 0, 1, 2, 4, 2, 1, 0, 0, 0, 1, 2, 4, 6, 4, 2]   # Gerg's Build (OST §2.6) as scale steps: a bar of 16ths
BUILD_DEG = {'Dbmaj9': 2, 'Fm9': 0, 'Bbm9': 3, 'C7sus': 4, 'Fm9b': 0}   # where each chord's cell starts (from F4)
STAB = (('tpt', ['Eb5', 'Bb4']), ('tbn', ['F4', 'C4']))   # the knee stab: the title's quartal C F B-flat E-flat
HAT = [1.0, 0.35, 0.55, 0.35, 0.8, 0.35, 0.55, 0.35, 0.95, 0.35, 0.55, 0.35, 0.8, 0.35, 0.55, 0.35]
KICK = {0: 0.8, 6: 0.6}                               # the 3+3+2: beat 1 and the and-of-2 ...
STICK = {12: 0.7, 14: 0.28}                           # ... and the side-stick on beat 4 (a ghost after it)
FEAR_HN = [(['Gb3', 'Bb3', 'Eb4'], 'E-flat minor'), (['Gb3', 'B3', 'Eb4'], 'C-flat/E-flat (the shadow under B-flat)')]


def build_note(chord, i):
    s = BUILD_STEPS[i % 16] + BUILD_DEG[chord]
    name = SCALE[s % 7]
    return f'{name}{4 + s // 7 + (1 if name in ("C", "Db", "Eb") else 0)}'     # degree 0 = F4; C, D-flat, E-flat in 5


def tracks():
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc', 'jazz', 'woodclick', 'xylo', 'timp', 'tpt', 'tbn', 'hn'):
        T[k].drift_ms = 0.0
    T['felt'].gain_db, T['felt'].sends = -3.0, {'room': -12, 'hall': -16}
    T['felt_mech'].gain_db = -20.0
    # the felt ostinato: its own copy (no pedal; dry eighths), its body's A-ish resonances notched (render 1: ~112, 217.5
    # and 428 Hz read as A energy over the F m9 bass at 20.8 s; felt_post lifts 220 Hz by 2 dB)
    dup(T, 'felt', 'felt_ost', gain_db=-8.0, sends={'room': -12, 'hall': -18},
        eq=[('peq', 112.0, -9.0, 10.0), ('peq', 217.5, -9.0, 10.0), ('peq', 428.0, -5.0, 12.0)])
    # the pad (THE RUN's pedal layer): sul tasto, soft
    for k in ('vln1', 'vln2'):
        T[k].gain_db, T[k].sends = -8.0, {'hall': -10, 'room': -16}
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -5.0, {'hall': -11, 'room': -16}
    # the pizzicato: the cello's and the viola's bodies notched (A2, A3, A4: Act Three's and Act Four's findings, with
    # the cello's fixed 109.9 Hz resonance), the violins' 440
    notch_vc = [('peq', 111.3, -10.0, 8.0), ('peq', 109.9, -12.0, 16.0), ('peq', 216.0, -10.0, 7.0),
                ('peq', 440.0, -9.0, 5.0)]
    dup(T, 'vc', 'vc_pz', eq=list(T['vc'].eq) + notch_vc, gain_db=1.0, pan=0.2, sends={'hall': -12, 'room': -12},
        hum_ms=2.0)
    dup(T, 'vln1', 'vln_pz', eq=list(T['vln1'].eq) + [('peq', 440.0, -12.0, 5.0)], gain_db=-5.0, pan=-0.35,
        sends={'hall': -11, 'room': -14}, hum_ms=2.0)
    # the kit: sticks, dry and light (a jazz kit's hats, kick and side-stick; no 808, never boom-bap)
    T['jazz'].gain_db, T['jazz'].sends, T['jazz'].hum_ms = 1.0, {'room': -12, 'hall': -22}, 2.0
    T['jazz'].eq = [('hp', 55), ('hs', 7000, -3.0)]          # (render 3: the kick's sub read -19.5 dB, limit -18)
    T['woodclick'].gain_db, T['woodclick'].pan = -8.0, 0.35
    T['xylo'].gain_db, T['xylo'].pan = -9.0, 0.3
    # the chip: the Build's arpeggio (25 % pulse; P07: the chip is the co-lead) and the stab's double (12.5 %)
    T['lead'].gain_db, T['lead'].sends = 2.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200), ('hs', 2400, -4.0)]
    T['lead2'].gain_db, T['lead2'].eq = -7.0, [('lp', 5000)]
    # the knee stab's brass (accents only): the staccato samples speak ~11 ms in (Act Three's finding)
    for k in ('tpt', 'tbn'):
        T[k].gain_db, T[k].latency_ms, T[k].sends = -7.0, 11.0, {'room': -10, 'hall': -12}
    # the verdict: soft vibes + the glass
    T['vibes'].gain_db, T['vibes'].sends = -4.0, {'hall': -8}
    T['glass'] = Track(name='glass', src=('fn', glass_fn), stem='perc', gain_db=-3.0, pan=0.15, width=0.9,
                       sends={'hall': -8}, hum_ms=0, rel=0.1, credit=CREDIT_SYN, balance='chip')   # glass counts as chip
    # RUMPT's Podium, FEAR (MM-19's): the cup-muted trombone (it speaks ~30 ms late: compensated), muted horns,
    # tremolo low strings, the timpani
    T['tbn_cup'] = replace(T['tbn'], name='tbn_cup', post=cup_mute, gain_db=-2.0, pan=-0.2, sends={'hall': -9},
                           latency_ms=30.0, hum_ms=2.0)
    T['hn'].gain_db, T['hn'].sends = -8.0, {'hall': -8}
    T['timp'].gain_db = -8.0
    return T


def brass(c, inst, p, t, d, vel, rel=0.3):
    """a held brass note that speaks on time: a staccato front crossfaded into the sustain (MM-19's)"""
    c.n(inst, p, t, 0.09, vel, art='stab', rel=0.06, lock=True)
    return c.n(inst, p, t, d, vel, art='sus', offset=0.06, att=0.035, rel=rel, lock=True)


def stab(c, t, bass, vel, length):
    """THE KNEE STAB (P07: a stab on each item): the title's quartal C F B-flat E-flat on brass + a chip double, over
    the bass (the cello's pizzicato)"""
    for inst, ps in STAB:
        V.stab(c, inst, ps, t, vel=vel * (1.0 if inst == 'tpt' else 0.95), length=length)
    c.n('lead2', 'Eb5', t, 0.16, 0.3 + 0.2 * (vel - 0.5), True, duty=0.125, att=0.002, dec=0.12, sus=0.2, rel=0.06)
    c.n('vc_pz', bass, t, 0.3, min(0.72, vel + 0.1), lock=True, art='pizz')


def cue_august(tl):
    end = tl.length
    k = int(math.ceil(end / BAR - 1e-9))
    c = V.Cue(CUE, tl, anchor=end, anchor_bar=k + 1, bars=k + 2, swing=0.0)     # the out (the last frame) is a bar line
    T = tracks()
    W = still_windows(tl)
    rec = record_windows(tl)
    vo = _vo(tl, _B(tl, '23.05', 19.92) + 0.5)
    # ---- the events (all from the lock)
    e = dict(end=end, thud=_snd(tl, '23.01', 'landing_thunk', 1.6), b02=_B(tl, '23.02', 4.58),
             b03=_B(tl, '23.03', 8.92), b04=_B(tl, '23.04', 13.08), scan=_snd(tl, '23.04', 'orb_scan_sweep', 14.48),
             chime=_snd(tl, '23.04', 'orb_chime_F', 17.28), toast_end=_os(tl, '23.04', 'verified', 19.68, until=True),
             b05=_B(tl, '23.05', 19.92), b06=_B(tl, '23.06', 22.88), b07=_B(tl, '23.07', 27.5),
             knot=_snd(tl, '23.07', 'knot_tie', 32.08), b08=_B(tl, '23.08', 33.42),
             taut=_snd(tl, '23.08', 'string_taut', 33.72), b09=_B(tl, '23.09', 35.0))
    e['pages'] = _sndall(tl, '23.02', 'page_turn')
    e['pumps'] = _sndall(tl, '23.07', 'balloon_pump')
    e['vo_on'], e['vo_end'] = (vo['on'], vo['end']) if vo else (e['b05'] + 0.54, e['b05'] + 2.44)
    doc = next(((a, b) for a, b, x in rec if a < e['b02'] <= b + 0.05), (e['b02'] - 2.4, e['b02']))
    post = next(((a, b) for a, b, x in rec if e['b03'] <= a < e['b04']), (e['b03'] + 1.6, e['b04'] - 0.07))
    lower = next(((a, b) for a, b, x in rec if e['b06'] <= a < e['b07']), (e['b06'] + 1.4, e['b07'] - 0.08))
    e.update(doc=doc, post=post, lower=lower)
    # ---- the changes (the plan; every one placed against the cuts and the still windows)
    beats = [c.bar1 + j * Q for j in range(int((end - c.bar1) / Q) + 2)]
    is_bar = lambda t: abs((t - c.bar1) / BAR - round((t - c.bar1) / BAR)) < 1e-3     # noqa: E731

    def near_beat(target, lo, hi, prefer_bar=0.0):
        """the beat nearest `target` inside [lo, hi] (a bar line within prefer_bar s of the target wins), or None"""
        cs = [b for b in beats if lo - 1e-6 <= b <= hi + 1e-6]
        bars_ = [b for b in cs if is_bar(b) and abs(b - target) <= prefer_bar]
        return min(bars_ or cs, key=lambda b: abs(b - target)) if cs else None

    # THE RUN's first downbeat: the beat nearest 0.12 s before the cut to the pages (a bar line if one is that close)
    t_run = near_beat(e['b02'] - 0.12, e['b02'] - 0.35, e['b02'] + 0.04, prefer_bar=0.2) or lead_in(c, e['b02'], 0.05)
    t_fm = t_run + BAR if t_run + BAR < e['b03'] - 0.6 else None                          # a chord a bar
    t_bbm = lead_in(c, e['b03'], 0.15)                                                    # the post's iv, pre-lapped
    t_st2 = max(lead_in(c, e['b04'], 0.15), after(c, post[1] + 0.03, S16))                # the post's stab waits
    t_lay = near_beat(e['scan'], t_st2 + Q, e['chime'] - Q, prefer_bar=0.15) or t_st2    # wood and xylo: the scan
    t_stop1 = e['chime'] - 0.05                                                            # the engine clears the chime
    ev8 = [b for b in grid(c, e['chime'] + 0.45, e['chime'] + Q + 0.35, E8)]
    t_v1 = min(ev8, key=lambda b: abs(b - (e['chime'] + Q))) if ev8 else e['chime'] + Q   # THE VERDICT a beat later
    t_v2 = t_v1 + Q
    t_res = None                                                                          # THE RUN again: on a bar
    for step in (BAR, Q, E8):                                                             # (else a beat, else an
        cand = lead_in(c, e['b05'], 0.15, step)                                           # eighth) pre-lapping Mas
        if e['b05'] - cand <= 0.5 and cand >= t_v2 + Q - 1e-6:
            t_res = cand
            break
    if t_res is None:
        t_res = max(lead_in(c, e['b05'], 0.15), t_v2 + Q)
    t_st3 = lead_in(c, e['b06'], 0.15)                                                    # the last stab, the stop
    w = inside(t_st3, W)
    if w:
        t_st3 = after(c, w[1] + 0.05)
    t_fear = after(c, lower[1] + 0.05) if inside(lead_in(c, e['b07'], 0.15), W) else lead_in(c, e['b07'], 0.15)
    # the Podium's held E-flat: the beat nearest the knot (a bar line if within 0.35 s), with room for the line before it
    t_hold = near_beat(e['knot'], t_fear + 6 * Q, e['b08'] - 0.15, prefer_bar=0.35) or lead_in(c, e['b08'], 0.15, Q)
    t_thin = lead_in(c, e['b08'], 0.15)                                                   # the hook: one held chord
    t_felt = lead_in(c, e['b09'], 0.15)                                                   # his face: his felt F4
    e.update(t_run=t_run, t_fm=t_fm, t_bbm=t_bbm, t_st2=t_st2, t_lay=t_lay, t_stop1=t_stop1, t_v1=t_v1, t_v2=t_v2,
             t_res=t_res, t_st3=t_st3, t_fear=t_fear, t_hold=t_hold, t_thin=t_thin, t_felt=t_felt)
    chords = [(0.0, 'Db5'), (t_run, 'Dbmaj9')] + ([(t_fm, 'Fm9')] if t_fm else []) + \
        [(t_bbm, 'Bbm9'), (t_st2, 'C7sus'), (t_v1, 'F5'), (t_res, 'Fm9b'), (t_st3, 'Fped')]
    e['chords'] = [(round(t, 3), ch) for t, ch in chords]

    def chord_at(t):
        return [ch for t0, ch in chords if t0 <= t + 1e-6][-1]

    # ---- 1 THE PEDAL under the suit's landing (and the docket's caption): the felt's fifth, the bowed fifth
    t_felt0 = after(c, 0.5, Q)              # a beat into the shot, as he sits (render 4: struck on the first frame, the
    c.pch('felt', ['Db3', 'Ab3'], t_felt0, t_run - t_felt0, 0.15, roll=0.03)     # felt was the pedal's loudest moment)
    c.n('felt_mech', 60, t_felt0, 0.1, 0.18)
    e['t_felt0'] = t_felt0
    c.mark(0.0, 'the tag\'s first frame: THE RUN\'s pedal, the D-flat fifth bowed sul tasto, swelling in under Act Four\'s '
                'ring-out (the Door\'s held G and its D-flat fifth, laid by the mix): the same D-flat, taken over', hit=False)
    c.mark(t_felt0, 'as he sits: the felt\'s open fifth D-flat 3 + A-flat 3 (ppp), his piano under the Door\'s fading G',
           hit=False)
    c.mark(e['thud'], f'THE THUD (landing_thunk {e["thud"]:.2f}, the SFX\'s): the pedal holds; nothing hits with it',
           hit=False)
    # ---- the pad (THE RUN's pedal layer): one bowed chord per change, crossfaded, sul tasto
    pads = [(t0, ch) for t0, ch in chords] + [(t_fear, None)]
    for i, (t0, ch) in enumerate(pads[:-1]):
        t1 = pads[i + 1][0]
        ps = PAD[ch]
        insts = ('vc', 'vla', 'vln2', 'vln1')[:len(ps)]
        for inst, p in zip(insts, ps):
            v = 0.2 if ch in ('Db5', 'Fped') else (0.17 if ch in ('F5', 'Fm9b') else 0.15)
            first = 0.6 if i == 0 else 0.2
            c.rebow(inst, p, t0 + (0.0 if i == 0 else -0.03), t1 + (0.3 if pads[i + 1][1] is None else 0.12), v,
                    seg=5.0, xf=0.8, first_att=first, last_rel=0.25, art='sus',
                    lp=1300 if inst in ('vc', 'vla') else 2000)
    # ---- 2 THE RUN: the engine (felt ostinato, cello pizzicato bass, sticks, the Build's chip arpeggio), on 16ths
    run_spans = [(t_run, t_stop1), (t_res, t_st3)]
    vo_w = (e['vo_on'] - 0.12, e['vo_end'] + 0.15)
    post_w = (post[0] - 0.1, t_st2)
    n_ost = n_kit = n_chip = n_xy = n_vpz = 0
    for s0, s1 in run_spans:
        for t in grid(c, s0, s1):
            i = int(round((t - c.bar1) / S16)) % 16
            ch = chord_at(t)
            if ch not in FELT:
                continue
            in_post = post_w[0] <= t < post_w[1]
            in_vo = vo_w[0] <= t < vo_w[1]
            first_bar = t < t_run + BAR - 1e-6
            g = 0.75 if in_vo else 1.0
            # the felt ostinato (eighths): out under the post (the record); softer under the V.O.
            if i % 2 == 0 and not in_post:
                p = FELT[ch][i // 2]
                v = (0.36 if i // 2 in (0, 3, 6) else 0.28) * g
                c.n('felt_ost', p, t, E8 * 0.9, v)
                n_ost += 1
            # the cello's pizzicato bass, 3+3+2 (eighths 1, 4, 7)
            if i in (0, 6, 12):
                p = PIZZ[ch][(0, 6, 12).index(i)]
                c.n('vc_pz', p, t, 0.3, (0.5 if i == 0 else 0.42) * (0.6 if in_post else 1.0) * g, lock=True,
                    art='pizz')
            # the sticks: 16th hats (accents on the beats), the 3+3+2 kick and the side-stick; only soft hats under
            # the post
            hv = HAT[i] * (0.4 if in_post else (0.75 if in_vo else 1.0)) * (0.8 if first_bar else 1.0)
            c.n('jazz', 42, t, 0.06, 0.42 * hv, lock=True)
            n_kit += 1
            if not in_post:
                if i in KICK:
                    c.n('jazz', 36, t, 0.15, 0.5 * KICK[i] * g, lock=True)
                if i in STICK:
                    c.n('jazz', 37, t, 0.1, 0.5 * STICK[i] * g, lock=True)
            # the Build's chip arpeggio: eighths in its first bar, then 16ths; out under the post; soft under the V.O.
            if not in_post and (i % 2 == 0 or not first_bar):
                p = build_note(ch, i)
                acc = (1.0, 0.72, 0.84, 0.72)[i % 4]
                c.n('lead', p, t, S16 * 0.62, 0.3 * acc * (0.6 if in_vo else 1.0), True, duty=0.25, att=0.002,
                    dec=0.08, sus=0.45, rel=0.035)
                n_chip += 1
                # xylophone and wood (a layer, from the bar the scan starts): the arpeggio's beats, the off-eighths
                if t >= t_lay - 1e-6:
                    if i % 4 == 0 and not in_vo:                      # (the xylophone rests under the V.O.)
                        c.n('xylo', p, t, 0.2, 0.3)
                        n_xy += 1
                    if i % 4 == 2:
                        c.n('woodclick', 60, t, 0.05, 0.4 * g, lock=True)
                # the violins' pizzicato (a layer, with Mas): the arpeggio an octave down on the eighths
                if t >= t_res - 1e-6 and i % 2 == 0:
                    c.n('vln_pz', nm(p) - 12, t, 0.2, 0.3 * g, lock=True, art='pizz')
                    n_vpz += 1
    e['engine'] = dict(felt=n_ost, hats=n_kit, chip=n_chip, xylo=n_xy, vln_pz=n_vpz)
    # ---- the knee stabs, one per item
    st = [(t_run, 'Db3', 0.52, 0.2, f'item 1 (AUG 5, the suit is back): THE RUN\'s first downbeat, D-flat maj9; '
                                    f'{how(c, t_run, e["b02"])} to the pages'),
          (t_st2, 'C3', 0.56, 0.22, f'item 2 (AUG 11, his post): the stab waited for the record to clear '
                                   f'(post ends {post[1]:.3f}); C7sus, {how(c, t_st2, e["b04"])} to the Orb'),
          (t_st3, 'F3', 0.6, 0.3, f'item 3 (AUG 21): the last stab, F7sus, and THE RUN\'s stop; '
                                  f'{how(c, t_st3, e["b06"])} to the interview')]
    for t, bass, v, ln, why in st:
        stab(c, t, bass, v, ln)
        c.mark(t, f'DESIGNED HIT: THE KNEE STAB (C F B-flat E-flat over {bass[:-1]}), {why}')
    c.mark(t_bbm, f'B-flat m9 (the iv), {how(c, t_bbm, e["b03"])} to the post; then under the post (the record, '
                  f'{post[0]:.2f}-{post[1]:.2f}) THE RUN thins: the chip and the felt out, the hats and the pizzicato '
                  'soft, the pad holds', hit=False)
    c.mark(t_lay, f'xylophone and wood join (a layer) as the scan starts (orb_scan_sweep {e["scan"]:.2f}; '
                  f'{"the bar" if is_bar(t_lay) else "the beat"} nearest it)', hit=False)
    # ---- 3 THE VERDICT: the engine clears the chime (a stop, the bed held), F5 then C6 on vibes + glass, a beat late
    c.mark(t_stop1, f'the Orb\'s F chime ({e["chime"]:.3f}, the SFX\'s): THE RUN\'s engine stops; the C7sus pad holds '
                    'through the toast', hit=False)
    for p, t in (('F5', t_v1), ('C6', t_v2)):
        c.n('vibes', p, t, 2.6, 0.34)
        c.n('glass', p, t, 0.4, 0.62, ring=1.9)
    c.mark(t_v1, f'DESIGNED HIT: THE VERDICT, F5 (vibes + glass), {t_v1 - e["chime"]:.2f} s after the chime (a beat, '
                 'never with it); the pad resolves C7sus -> the open fifth F (no third): iv - V - I on the machine\'s '
                 'answer')
    c.mark(t_v2, 'THE VERDICT, C6 a beat later, let ring', hit=True)
    # ---- 4 THE RUN again with Mas (F m9; the violins' pizzicato a layer), the V.O. inside the bed
    c.mark(t_res, f'THE RUN again, F m9 ({how(c, t_res, e["b05"])} to Mas at the monitor); the violins\' '
                  f'pizzicato join; the V.O. ({e["vo_on"]:.2f}-{e["vo_end"]:.2f}) sits inside the bed: nothing starts on '
                  'its words but the engine\'s own 16ths, the chip and the kit softer', hit=False)
    c.mark(t_st3 + 0.01, 'THE RUN\'s stop: it thins to its pedal, the open fifth F (the room\'s own F, no third), under '
                         f'the AUG 21 lower third ({lower[0]:.2f}-{lower[1]:.2f}); the neutral text blip (SFX) carries '
                         'his words', hit=False)
    # ---- 5 RUMPT's Podium, FEAR, under the balloon only (MM-19's FEAR, to picture)
    hold_end = end + 0.4
    line = [('Eb3', t_fear, t_hold - 5 * Q), ('F3', t_hold - 5 * Q, t_hold - 4 * Q), ('Gb3', t_hold - 4 * Q,
            t_hold - 2 * Q), ('Bb3', t_hold - 2 * Q, t_hold), ('Eb4', t_hold, hold_end)]
    for p, a, b in line:
        if b - a < 0.2:
            continue
        brass(c, 'tbn_cup', p, a, b - a - (0.02 if p != 'Eb4' else 0.0), 0.5 if p != 'Eb4' else 0.46,
              rel=0.3 if p != 'Eb4' else 0.05)
    e['fear_line'] = [(p, round(a, 3)) for p, a, b in line if b - a >= 0.2]
    c.mark(t_fear, f'DESIGNED HIT: RUMPT\'s Podium, FEAR (cup-muted trombone, E-flat minor, half-time), '
                   f'{how(c, t_fear, e["b07"])} to the balloon' + (
                       f': the band waited for his words to clear (the lower third ends {lower[1]:.3f}; OST §2.10)'
                       if t_fear >= e['b07'] - 0.01 else ' (the lower third has cleared)'))
    hn1 = t_hold - 2 * Q
    for (ps, why), a, b in ((FEAR_HN[0], t_fear, hn1), (FEAR_HN[1], hn1, t_hold), (FEAR_HN[0], t_hold, hold_end)):
        if b - a < 0.2:
            continue
        for j, p in enumerate(ps):
            c.n('hn', p, a + 0.004 * j, b - a + (0.08 if b < hold_end else 0.0), 0.36 if a < t_hold else 0.34,
                art='mute', att=0.25 if a == t_fear else 0.08, rel=0.3 if b < hold_end else 0.05)
    # tremolo low strings (>= C3): the cello's E-flat 3, the viola's B-flat 3; out at the hook
    art.trem(c.a, 'vc', ['Eb3'], c.clk(t_fear), t_thin - t_fear + 0.15, vel=0.42, swell=('pp', 'p'))
    art.trem(c.a, 'vla', ['Bb3'], c.clk(t_fear + 0.02), t_thin - t_fear + 0.13, vel=0.38, swell=('pp', 'p'))
    # a timpani roll into the held E-flat (on the dominant, B-flat 2: a fourth over the room's F hum), then one stroke
    r0 = t_hold - 2 * Q
    kk = 12
    for i in range(kk):
        c.n('timp', 'Bb2', r0 + (t_hold - r0 - 0.11) * i / kk, 0.08, 0.2 + 0.18 * i / kk, lock=True)
    c.n('timp', 'Bb2', t_hold, 1.2, 0.36, lock=True)
    # the gold glint, muted: one soft chip note at the arrival, decaying (never a held tone)
    c.n('lead', 'Eb5', t_hold, 1.5 * Q, 0.3, True, duty=0.5, att=0.01, dec=0.5, sus=0.0, rel=0.3)
    c.mark(t_hold, f'the Podium\'s held E-flat on the knot (knot_tie {e["knot"]:.3f}): the timpani roll\'s arrival, one '
                   'soft chip glint (the gold, muted)', hit=False)
    # ---- 6 the hook: the Podium thins to one held chord; his face: his felt F4 (the ninth); the cut on the downbeat
    c.rebow('vc', 'Eb3', t_thin - 0.1, hold_end, 0.12, seg=5.0, xf=0.8, first_att=0.4, last_rel=0.05, art='sus', lp=1200)
    c.mark(t_thin, f'the hook ({how(c, t_thin, e["b08"])}): the Podium thins to ONE HELD CHORD (E-flat minor: the '
                   'muted horns, the trombone\'s held E-flat, the cello sul tasto); the tremolo and the timpani out; the '
                   f'string goes taut ({e["taut"]:.2f}, the SFX\'s) over it', hit=False)
    c.n('felt', 'F4', t_felt, end - t_felt + 0.3, 0.2)
    c.n('felt_mech', 60, t_felt, 0.1, 0.18)
    c.ped['felt'] = c.ped.get('felt', []) + [(c.clk(t_felt), c.clk(end + 0.3))]
    c.mark(t_felt, f'his face ({how(c, t_felt, e["b09"])}): his felt F4, the chord\'s ninth and his home note, inside '
                   'the candidate\'s E-flat minor', hit=False)
    c.mark(end, 'THE OUT: the cut to black on the downbeat (the tag\'s last frame is a bar line): every voice stops dead '
                '(5 ms), the tails cut', hit=False)
    # ---- the sections (for the cue sheet and the measurements)
    secs = [('1 the pedal under the suit\'s landing (D-flat fifth; the docket\'s caption)', 0.0, t_run),
            ('2 THE RUN: the pages (D-flat maj9, F m9)', t_run, t_bbm),
            ('3 THE RUN: the post (B-flat m9; thinned under the record)', t_bbm, t_st2),
            ('4 THE RUN: the Orb\'s scan (C7sus; xylophone and wood)', t_st2, t_stop1),
            ('5 the chime and THE VERDICT (the open fifth F)', t_stop1, t_res),
            ('6 THE RUN again: Mas at the monitor, the V.O. inside it (F m9)', t_res, t_st3),
            ('7 THE RUN\'s pedal: the AUG 21 lower third (the open fifth F)', t_st3, t_fear),
            ('8 RUMPT\'s Podium, FEAR: the balloon', t_fear, t_thin),
            ('9 one held chord: the taut string, his face; the cut on the downbeat', t_thin, end)]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    rides = [(0.0, t_run - 0.05, -1.0),                    # the pedal: soft under the THUD and the caption
             (t_run - 0.05, t_bbm, 1.5),                   # THE RUN: featured, a little over the bed
             (post[0] - 0.15, t_st2 - 0.02, -2.5),         # the post (the record): thin and ducked
             (t_st2 - 0.02, t_stop1, 1.5),                 # the scan
             (t_res, t_st3, 0.5),                          # with Mas
             (e['vo_on'] - 0.3, e['vo_end'] + 0.15, -4.5),  # the V.O. sits inside the bed (P01's -24 +-2)
             (t_fear, t_thin, -4.0),                       # FEAR: hushed (pp)
             (t_thin, end + 1.0, -6.0)]                    # one held chord: it thins
    macro = ride_macro(rides, -1.0, end + 1.0)
    meta = dict(
        id=CUE, title='August (E02-13, Ep2 v1 tag sc 23)',
        mm='new to picture (P07 THE RUN, MM-03 family) + MM-19 FEAR to picture (P13 THE PODIUM)', usage='BI',
        family='P07 THE RUN -> P13 THE PODIUM (FEAR)',
        tone='momentum; a laugh; satisfaction (the verdict); a chill (the balloon, the taut string, his face)',
        scenes=['Ep2 v1 tag sc 23 (23.01-23.09)'],
        motifs=['THE RUN\'s pedal, engine and stabs: the knee stab (the title\'s quartal C F B-flat E-flat), one per item',
                'the Build\'s chip arpeggio (Gerg\'s cell, moved through the loop)', 'the felt ostinato (3+3+2)',
                'THE VERDICT (F5 -> C6, a beat after the chime)',
                'RUMPT\'s Podium in FEAR (cup-muted trombone: E-flat F | G-flat B-flat | E-flat held)',
                'his felt F4 on his face (the ninth of the candidate\'s chord)'],
        motif_ids=[], key='F minor (D-flat maj9 - F m9 - B-flat m9 - C7sus - F open fifth - F m9 - F); E-flat minor '
                          '(FEAR); no A-natural; the verdict with no third',
        composer='Ep2 v1 score pass (tag), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-20.0,
        album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(0.0), t1=c.clk(end), sfx='room_drone + server_hum (the dark room)')],
        no_third_windows=[(c.clk(t_v1 + 0.02), c.clk(t_res - 0.05))],
        vo_windows=[(c.clk(e['vo_on']), c.clk(e['vo_end']))],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['thud'], 'landing_thunk (C and F): the pedal holds'), (e['scan'], 'orb_scan_sweep'),
            (e['chime'], 'orb_chime_F + ui_toast_pop: the engine clears it; the verdict a beat later'),
            (e['b06'] + 1.5, 'blip_text_neutral: carries his words over the pedal'),
            (e['taut'], 'string_taut: over the held chord'))],
        audition=['0-4.6 s: the pedal takes the Door\'s D-flat, and the THUD lands on it, not with it',
                  '4.5-8.9 s: THE RUN: momentum, dry, never boom-bap or upbeat corporate; the pages get no comment',
                  '17.2-19.5 s: the chime, then the verdict a beat later over the open F: satisfaction, not a ding',
                  '27.6-33.3 s: FEAR: hushed and chilly, not horror-movie; the band entering a beat late reads as '
                  'waiting',
                  '33.3-37.0 s: one held chord under the string and his face; the felt F4; the cut on the downbeat'])
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=end + 0.5, tail_s=0.3, macro=macro)
    c.ev = {kk_: (round(v, 3) if isinstance(v, float) else v) for kk_, v in e.items()}
    return c, sc


def music_runs(tl):
    runs = []
    for b in tl.beats:
        m = next((cc.split(': ', 1)[1] for cc in b['b'].get('cues', []) if cc.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


def change_report(tl, c):
    """every chord change against its nearest cut (Ep1 v3.5's rule: a change on a cut pre-laps it by about 0.25 s)"""
    cuts = [b['t0'] for b in tl.beats[1:]]
    out = []
    for t, ch in c.ev['chords'] + [(c.ev['t_fear'], 'Ebm (FEAR)'), (c.ev['t_thin'], 'Ebm (one held chord)')]:
        cut = min(cuts, key=lambda x: abs(x - t))
        out.append(dict(t=round(t, 3), chord=ch, nearest_cut=round(cut, 3), lead_s=round(cut - t, 3)))
    return out


# ================================================================ main
def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    reals = mark_real(tl)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    c, sc = cue_august(tl)
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s; real lines: {reals}; '
              f'record on screen: {[(round(a, 2), round(b, 2), x[:24]) for a, b, x in record_windows(tl)]}')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m[:110] or "(no music string)"}')
        print(sc.name, V.note_qa(sc), f'file T0 {c.T0:.3f}')
        for t, lab, h in sorted(c.marks):
            print(f'   {t:8.3f} {"*" if h else " "} {lab[:180]}')
        print('   ev:', {kk: vv for kk, vv in c.ev.items()})
        for r in change_report(tl, c):
            print('   change', r)
        return
    if args.render is not None:
        print(f'[{CUE}] rendered in {V.render_cue(sc, work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    wav = os.path.join(work, f'{sc.name}-underscore.wav')
    layers = [dict(name=sc.name, wav=wav, T0=c.T0, a0=0.0, a1=tl.length, fin=0.0, fout=0.003)]
    mix, laid = V.assemble(tl, layers, out)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', max(0.0, a0), min(tl.length, a1)) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, [])
    ev = c.ev
    res['head_momentary_max'] = V.momentary_max(mix, 0.0, 4.5)
    res['momentary'] = {lab: V.momentary_max(mix, a, b) for lab, a, b in (
        ('the pedal', 0.0, ev['t_run']), ('the first stab', ev['t_run'], ev['t_run'] + 0.6),
        ('the pages', ev['t_run'], ev['t_bbm']), ('the post (thinned)', ev['post'][0], ev['post'][1]),
        ('the scan', ev['t_st2'], ev['t_stop1']), ('the verdict', ev['t_v1'], ev['t_res']),
        ('with Mas', ev['t_res'], ev['t_st3']), ('the pedal (lower third)', ev['lower'][0], ev['lower'][1]),
        ('FEAR', ev['t_fear'], ev['t_thin']), ('one held chord', ev['t_thin'], tl.length))}
    from engine.mix import lufs
    res['vo_windows_lufs'] = []
    for ln in tl.lines:
        if ln['kind'] == 'vo':
            i0, i1 = int(ln['on'] * SR), int(ln['end'] * SR)
            z = mix[:, i0:i1]
            res['vo_windows_lufs'].append(dict(line=ln['id'], t0=round(ln['on'], 2), t1=round(ln['end'], 2),
                                               lufs=round(lufs(z), 2) if np.abs(z).max() > 0 else None))
    res['tail_last_10ms_dbfs'] = round(20 * math.log10(np.abs(mix[:, -int(0.01 * SR):]).max() + 1e-12), 1)
    cues = [dict(cue=sc.name, key='august', start=0.0, end=round(tl.length, 3), what=sc.meta.get('tone'),
                 family=sc.meta.get('family'), render=os.path.relpath(wav, V.REPO), laid_at_s=round(c.T0, 4),
                 level=res['cues'][sc.name], target_lufs=sc.meta.get('underscore_lufs'),
                 engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc), motifs=sc.meta.get('motifs'),
                 events=c.ev, changes=change_report(tl, c),
                 sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in sorted(c.marks)])]
    sections = [dict(section=f'{sc.name}: {lab}', start=round(max(0.0, a0), 3), end=round(min(tl.length, a1), 3))
                for lab, a0, a1 in c.sections]
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
        level='underscore (the engine master at -20 LUFS-I, shaped by fader rides), dry of dialogue; the mixer ducks it '
              'under the V.O. (E02-13: 8 dB)',
        cues=cues, silences_designed=[],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack on a story beat; keep its '
                           'attack') for t, lab, h in c.marks if lab.startswith('DESIGNED HIT')],
        claims_sfx=[], sections=sections, real_lines=reals,
        record_on_screen=[dict(t0=round(a, 3), t1=round(b, 3), text=x) for a, b, x in record_windows(tl)],
        prelap=None, ringout=None,
        head='no head fade (mix_episode.py has none for the tag); Act Four\'s render/music-el-ringout.wav (the Door\'s '
             'held G4 and its D-flat fifth) is laid at the tag\'s 0 and crossfaded out over 2.5 s from this score\'s '
             'entry; the score enters at 0.02 s on the same D-flat fifth',
        out='the cut to black on the downbeat at the last frame (%.3f s, a bar line of the cue\'s grid): every voice '
            'stops dead, a 5 ms fade, the tails cut; no ring-out (the outro starts on its own music, E02-14)'
            % tl.length,
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['landing_thunk (23.01): the pedal holds under it; nothing in the score hits with it',
                      'page_turn x3 (23.02): THE RUN runs under them and does not comment on them',
                      'orb_chime_F + ui_toast_pop (23.04): THE RUN\'s engine stops 0.05 s before the chime; the '
                      'verdict (F5, C6 on vibes + glass) follows a beat later. Keep the chime at F',
                      'blip_text_neutral (23.06): it carries his words over THE RUN\'s pedal (the open fifth F)',
                      'balloon_pump x3, knot_tie (23.07): FEAR plays under them; nothing is cut to them',
                      'string_taut (23.08): over the one held chord (E-flat minor): untuned is fine, or E-flat / '
                      'B-flat; never A'],
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for kk, v in res['cues'].items():
        print(f'  {kk}: {v}')
    for r in res['rows']:
        print(f'  {r["start"]:7.2f}-{r["end"]:7.2f} {r["lufs_i"]} LUFS-I {r["true_peak_dbtp"]} dBTP  {r["section"][:90]}')
    print('unmarked digital silence:', res['unmarked_digital_silence'], 'holes:',
          [h for h in res['holes_below_-60'] if not h['inside_marked']], 'undesigned fragments:',
          res['undesigned_fragments'])
    print('music runs:', res['music_runs'])
    print('V.O. windows:', res['vo_windows_lufs'])
    print('momentary:', res['momentary'])
    print('tail last 10 ms:', res['tail_last_10ms_dbfs'], 'dBFS')
    print('engine QA:', json.dumps(V.engine_qa(work, sc.name), default=str)[:1500])


if __name__ == '__main__':
    main()
