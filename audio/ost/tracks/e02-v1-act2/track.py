#!/usr/bin/env python3
"""E02 v1 · ACT TWO "her" (sc 8-12) · the segment's score, laid on the segment's own clock (0 = its first frame).
Two cues in four renders: E02-06 DARK ROOM, SPRING · E02-07 ONE WORD (one tune in three rooms: the walk-on through
the wall, THE PLAN's music-box waltz, the demo on stage), its pad held across the black into the afternoon, and the
designed stop that is the midpoint act-out.

The brief (manifest.md §6 E02-06, E02-07; proposal.md sc 8-12, "The feeling curve" and "The seams"; script-v1.md's
MUSIC lines; the lock's music runs).  The mood map: dry amusement, a small thrill, a quiet click of power (8); nervous
fun (9); the explainer's lean-in (10); the episode's biggest laughs, then the coverage swinging away while Rima holds
her mark (11); sudden quiet, a small dry win closed, then separately a loss and a warmth that hurts (12).  README.md has
the cue sheet (seconds, cue, what plays, why) and the measurements.

  s (EL lock)      cue                    what plays
  0.0  -  44.6     E02-06 dark room       THE WATER LINE whole on the felt from the act's first frame (Act One's copy
                                          came first; the original after), its nudge on the chip; D-flat under the
                                          swipe; B-flat minor under the lineup (the monitor's own news-desk sting,
                                          tiny, through its speaker; the headline plays dry); G-flat lydian held under
                                          V.O. 4 (his plan); the calendar: the line again, cocky (the nudge twice), its
                                          settle on an open fifth as the block snaps onto Monday; V.O. 5 inside it; the
                                          call: thin to the pedal; ONE chip note on CONFIRMED; D-flat for the invite,
                                          the nudge as his button
  43.0 -  94.9     E02-07 the walk-on     the demo's walk-on tune (ONE WORD: F dorian, the knee's step cell, a chip
                                          echo at each phrase end) played by the stage band THROUGH THE WALL (low-
                                          passed, mono, a short slap): walking bass, ride, vibes, brass lead and chip;
                                          J 1.0 s under the invite; a dominant vamp under the five hellos
  94.75 - 140.4    E02-07 BLUEPRINT       THE PLAN: the same tune as a chip music-box waltz (3/4 on the 96 beat,
                                          straight, F dorian; box, celesta, harp, pizzicato, a triangle bass; no piano,
                                          no brass, no V.O.), on the downbeat 0.25 s before the cut; one note per label,
                                          the three steps on the step cell F G A-flat; the answer stuck on its last two
                                          beats under the empty bubble; a TAPE-STOP from the tear
  140.7 - 278.2    E02-07 the demo        the walk-on on stage: a swung push 0.29 s before the cut, then a light band
                                          (two-feel upright, brushes, vibes) under every line and the chip lead (with
                                          the violins an octave down) only in the pockets (a brass tap ends a phrase
                                          only when it completes in the clear); the band holds a C pedal under "one
                                          wo-o-ord." and the tune's own chip
                                          echo answers under its held note; no hit on any laugh; the band thins to a
                                          held chord for Rima's hold and close; at ENDED the rhythm stops and the strings
                                          and bowed vibes hold the pad (dry under the post); D-flat for the front row and
                                          THE DOOR on non-vibrato flute, its first note missing, on the chrome's toast;
                                          the pad across the black; the felt on the home shot; the news's tiny bed
                                          through the monitor until he minimises it; the pedal under both posts and
                                          V.O. 6; on his face his Water Line starts (F F G-F) and THE CUE STOPS ON THE
                                          DOWNBEAT where its settle would land (designed: the midpoint act-out)

Every sync point comes from the lock (beats, lines, words, sounds, on-screen items), so the score re-lays itself
when timing moves.  Chord changes that land on cuts pre-lap them by the latest beat or swung and at least 0.15 s
before the cut (about 0.25 s); no change lands inside a V.O., a line of his or a real post (it moves before or after).
The record plays dry (OST rule 10): melody out, no change, under the real posts (kind `post`) and the [H] headline.

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0): the 96 BPM grid; the knee's cells; chip in every cue; no
A-natural anywhere; the knee never whole; swung for people, straight for THE PLAN; no comic scoring (no hit on a laugh,
a punchline or the blimp); no Mickey-Mousing (the swipe, the snaps, the stamps, the blimp's steps are SFX); nothing
below C3 in the dark room (room_drone / server_hum); continuous per sequence, two designed rests (the tape-stop's
beat; the act-out's stop), marked in silences_designed; designed hits marked.  "her" and Alyi's departure never share
a musical cause: no fragment of the demo tune plays after ENDED (the pad is the demo's harmony only), and the phrase
the stop cuts is his own Water Line.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --dry --el          # runs, marks, note QA
    MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --assemble --el     # re-lay render/_work/el, measure
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                    # the segment checks
Out: render/music[-el].wav (the segment's exact length) and cues[-el].json.  Nothing here has been listened to.
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
from engine.core import SR, FAMILIES, lp, hp, peq, to_stereo   # noqa: E402
from engine.era import futz, tape_stop   # noqa: E402

SEG = 'act2'
Q, BAR, S16 = V.Q, V.BAR, V.S16
SW = Q * 2.0 / 3.0                     # the house swing: the and lands 10 frames after its beat
WBAR = 3 * Q                           # THE PLAN's waltz bar: 3/4 on the 96 beat (45 frames; 4 waltz bars = 3 bars)
PLAN = os.path.join(V.REPO, 'show', 'episodes', 'ep02', 'production', 'v1', 'beat-plan', 'act2.json')


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


def mark_real(tl):
    """Ep2's lock prints no quotation marks and its takes carry no source tag: the beat plan's `note` does ([P ...]
    public record, [V ...] verbatim, [K ...] confirmed).  Act Two has none spoken; kept so a re-lock that adds one
    is thinned as the record"""
    pl = plan_doc()['lines']
    out = []
    for ln in tl.lines:
        note = (pl.get(ln['id'], {}).get('note') or '').lstrip()
        if note.startswith(('[P', '[V', '[K')) and ln['kind'] != 'vo':
            ln['kind'] = 'real'
            out.append(ln['id'])
    return out


def record_windows(tl):
    """the record on screen: every post (kind `post`: his 'her', Alyi's two crops, his reply), any quoted text, and a
    document the plan marks [H] (the news site's headline, its exact words): (t0, t1, text)"""
    pb = plan_doc()['beats']
    out = []
    for b in tl.beats:
        pic = pb.get(b['id'], {}).get('picture') or ''
        for o in b['b'].get('onscreen', []) or []:
            txt = o.get('text') or ''
            if o.get('kind') == 'post' or any(q in txt for q in '"“”') or (o.get('kind') == 'doc' and '[H' in pic):
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


def overlaps(a, b, ws):
    return any(x < b and y > a for x, y in ws)


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


def _os(tl, bid, prefix, default):
    try:
        return tl.os_at(bid, prefix) if tl.has(bid) else default
    except KeyError:
        return default


def lead_in(c, t, min_lead=0.15, swung=True):
    """the latest grid point (a beat, or its swung and) at least min_lead before t: a change that lands on a cut
    pre-laps it by about a quarter second (Ep1 v3.5's rule)"""
    k = math.floor((t - min_lead - c.bar1) / Q + 1e-9)
    best = None
    for kk in (k - 1, k):
        for off in ((0.0, SW) if swung else (0.0,)):
            p = c.bar1 + kk * Q + off
            if p <= t - min_lead + 1e-9 and (best is None or p > best):
                best = p
    return best


def how(c, t, cut):
    k = (t - c.bar1) / Q
    kind = 'on the beat' if abs(k - round(k)) < 0.02 else 'on a swung and'
    return f'{kind}, {cut - t:.2f} s before the cut'


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


def next_grid(c, t, swung=True):
    """the first beat (or its swung and) at or after t"""
    k = math.floor((t - c.bar1) / Q - 1e-9)
    cands = [c.bar1 + kk * Q + off for kk in (k, k + 1) for off in ((0.0, SW) if swung else (0.0,))]
    return min(p for p in cands if p >= t - 1e-9)


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


# ================================================================ THE WATER LINE (MM-01; OST §2.2)
WL = [(0, 'F4', 1.0), (1, 'F4', 1.0), (2, 'F4', 1.0), (3, 'G4', 0.5), (3.5, 'F4', 0.5), (4, 'C4', 1.0), (5, 'F4', 3.0)]
WL_COCKY = [(0, 'F4', 1.0), (1, 'F4', 1.0), (2, 'G4', 0.5), (2.5, 'F4', 0.5), (3, 'G4', 0.5), (3.5, 'F4', 0.5),
            (4, 'C4', 1.0), (5, 'F4', 3.0)]     # Ep2-3: the nudge twice, a little cocky (OST §2.2)
DR = {   # the dark room's harmony: (the felt's rootless left hand, the sul-tasto strings vc + vla): nothing below C3
    'Fm9':        (['Eb3', 'G3', 'Ab3', 'C4'], ('F3', 'C4')),
    'Dbmaj9':     (['Db3', 'Ab3', 'C4', 'Eb4'], ('Db3', 'Ab3')),
    'Bbm9':       (['Db3', 'F3', 'Ab3', 'C4'], ('Db3', 'F3')),
    'Gbmaj7#11':  (['Bb3', 'F4', 'C5'], ('Gb3', 'Db4')),
    'F5':         (['F3', 'C4'], ('F3', 'C4')),           # the open fifth: he never takes a third at a cadence
    'Fped':       ([], ('F3', 'C4')),                     # the pedal under the call
    'Dbmaj9#11':  (['F3', 'Ab3', 'C4', 'Eb4'], ('Db3', 'Ab3')),
}


def tracks_darkroom():
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -16}
    dup(T, 'felt', 'felt_lh')
    T['felt_mech'].gain_db = -18.0
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -8.0, {'room': -14, 'snes': -16}, [('hp', 220), ('lp', 5200)]
    T['lead2'].gain_db, T['lead2'].sends, T['lead2'].eq = -5.0, {'room': -12, 'snes': -14}, [('hp', 220), ('lp', 5600)]
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -1.0, {'hall': -11, 'room': -16}
    # the monitor's news-desk sting (MM-21 media bed: original, tiny), through the monitor's speaker
    mon = lambda b: futz(b, 'laptop')                                        # noqa: E731
    for src, name, g in (('tpt_stac', 'n_tpt', -16.0), ('tbn_stac', 'n_tbn', -16.0), ('snare', 'n_snare', -18.0),
                         ('glock', 'n_glock', -20.0)):
        dup(T, src, name, post=mon, sends={}, gain_db=g, hum_ms=0.0)
    return T


def statement(c, t0, notes, vel=0.46, lh=None, lh2=None, nudge_chip=True, stop=None):
    """the Water Line on the felt from t0 (a bar line), swung; lh / lh2: the left hand's bar 1 / bar 2 (rootless,
    MM-01's statement: bar 1, its charleston, bar 2); the chip's 50 % square doubles the nudge (G) only (OST §2.2)"""
    out = []
    for i, (bt, p, d) in enumerate(notes):
        t = sw_at(t0, bt)
        if stop is not None and t >= stop - 0.02:
            break
        dur = (sw_at(t0, bt + d) - t) * (0.96 if d < 2 else 1.0)
        v = vel * (1.0, 0.9, 0.95, 1.04, 0.86, 0.92, 0.97, 0.9)[i % 8]
        first = i == 0
        out.append(c.n('felt', p, t + (0.02 if first else 0.0), dur, v, first))
        if nudge_chip and p == 'G4':
            chip(c, 'lead', 'G4', t, 0.2, 0.34, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.12)
    if lh:
        c.ch('felt_lh', lh, t0 + 0.02, 1.6 * Q, 0.3, roll=0.011, lock=True)
        c.n('felt_mech', 60, t0 + 0.025, 0.1, 0.4, True)
        c.ch('felt_lh', lh[:3], sw_at(t0, 1.5), 0.5 * Q, 0.2, roll=0.01)          # the charleston: 1 and the swung 2&
    if lh2:
        c.ch('felt_lh', lh2, t0 + BAR, 1.4 * Q, 0.27, roll=0.011)
        c.n('felt_mech', 60, t0 + BAR, 0.1, 0.3)
    return out


def news_sting(c, t0):
    """the monitor's own news-desk sting: a snare's short roll into two brass stabs on B-flat sus4 (no third), a glock
    ping on the long one; tiny, through the monitor's speaker"""
    for j in range(8):
        c.n('n_snare', 60, t0 + j * 0.045, 0.04, 0.22 + 0.05 * j, True)
    ch = ['Bb3', 'Eb4', 'F4', 'Bb4']
    s1, s2 = t0 + 0.375, t0 + 0.5625
    for inst in ('n_tpt', 'n_tbn'):
        ps = ch[1:] if inst == 'n_tpt' else ch[:2]
        c.ch(inst, ps, s1, 0.12, 0.62, roll=0.0, lock=True)
        c.ch(inst, ps, s2, 0.55, 0.66, roll=0.0, lock=True)
    c.ch('n_glock', ['Bb5', 'Eb6'], s2, 0.8, 0.5, roll=0.0, lock=True)
    return s2 + 0.9


def cue_darkroom(tl):
    B, E = tl.B, tl.E
    out_t = E('8.07')
    c = V.Cue('e02-06-dark-room-spring', tl, anchor=0.0, anchor_bar=2, bars=int((out_t + 6.0) / BAR) + 3, swing=1.0)
    T = tracks_darkroom()
    W = still_windows(tl)
    rec = record_windows(tl)
    e = dict(toast=_snd(tl, '8.01', 'ui_toast_pop', 2.19), swipe=_snd(tl, '8.01', 'ui_swipe', 6.72),
             sting=_snd(tl, '8.02', 'news_desk_sting', B('8.02') + 0.5),
             snap=_snd(tl, '8.04', 'ui_drop_snap', E('8.04') - 0.6),
             ring=_snd(tl, '8.06', 'call_ring', B('8.06') + 0.35),
             confirmed=_snd(tl, '8.06', 'ui_confirm_chip', E('8.06') - 0.9),
             invite=_snd(tl, '8.07', 'invite_drop', B('8.07') + 0.7),
             accept=_snd(tl, '8.07', 'post_click', B('8.07') + 2.7), out=out_t, j_walkon=out_t - 1.0)
    vo4 = _line(tl, 'e2-vo-04', 'mas', B('8.03') + 0.8)
    vo5 = _line(tl, 'e2-vo-05', 'mas', B('8.05') + 0.7)
    call = _line(tl, 'e2-a2-0001', 'mas', B('8.06') + 2.7)
    s1 = 0.0
    # statement 2: the first bar line in the calendar after V.O. 4 whose settle (bar 2, beat 2) sounds before V.O. 5
    s2 = c.next_bar(max((vo4['end'] + 0.3) if vo4 else 0.0, B('8.04') - 0.3))
    if vo5:
        while s2 + BAR + Q > vo5['on'] - 0.1 and s2 - BAR >= (vo4['end'] + 0.1 if vo4 else 0.0):
            s2 -= BAR
    settle_stop = (vo5['on'] - 0.1) if vo5 else None
    # ---- the harmonic plan: (time, colour, why); moved out of the still windows (V.O., his line, the headline)
    hs = []
    hs.append((s1, 'Fm9', 'the arrival: the Water Line whole on the felt from the first frame (the copy came first)'))
    hs.append((sw_at(s1, 7.5), 'Dbmaj9', 'statement 1 pushes into D-flat on a swung and; the RULEBOOK is on screen and '
                                         'his swipe is the SFX\'s: nothing moves for it'))
    t = place(c, lead_in(c, B('8.02')), W)
    hs.append((t, 'Bbm9', f'the news site ({how(c, t, B("8.02"))}): the lineup; the monitor\'s sting; the headline '
                          'plays dry'))
    t = place(c, lead_in(c, B('8.03')), W, floor=t, limit=(vo4['on'] - 0.15) if vo4 else 1e9)
    hs.append((t, 'Gbmaj7#11', 'after the headline, before V.O. 4 ("the one after runs on ours."): G-flat lydian, '
                               'held; the felt carries the V.O., nothing attacks under it'))
    t = place(c, lead_in(c, B('8.04')), W, floor=t)
    hs.append((min(t, s2), 'Bbm9', f'the calendar ({how(c, min(t, s2), B("8.04"))}): the bed for statement 2'))
    hs.append((s2 + BAR, 'F5', 'statement 2\'s settle on an open fifth: B-flat minor to F with no third (the block '
                               'snaps onto Monday on its downbeat: the SFX owns the snap)'))
    t = place(c, lead_in(c, B('8.06')), W, floor=s2 + BAR)
    hs.append((t, 'Fped', f'the call ({how(c, t, B("8.06"))}): the Water Line thins to its pedal (the felt rests; '
                          'the strings hold F and C under his one sentence of terms)'))
    t = lead_in(c, B('8.07'))
    if t < e['confirmed'] + 0.35:
        t = next_grid(c, e['confirmed'] + 0.35)
    hs.append((t, 'Dbmaj9#11', f'the invite ({how(c, t, B("8.07"))}): a quiet click of power; the Monday square lit'))
    H = []
    for t, col, why in hs:
        if H and t <= H[-1][0] + 0.6:
            H.pop()
        H.append((t, col, why))
    # ---- the felt: statement 1 (whole), statement 2 (cocky), and the left hand / strings per colour
    statement(c, s1, WL, 0.42, lh=DR['Fm9'][0], lh2=DR['Fm9'][0][:3])
    c.mark(s1 + 0.02, 'DESIGNED HIT: the Water Line\'s first F on the act\'s first frame: Act One\'s copy finished his '
                      'line; now the original, whole (the felt, swung; the chip on the nudge)')
    statement(c, s2, WL_COCKY, 0.43, lh=DR['Bbm9'][0], lh2=None, stop=settle_stop)
    c.mark(s2, 'statement 2, a little cocky: the nudge twice (G-F G-F), the chip on both nudges (his launch dragged '
               'onto Monday)', hit=False)
    if abs(s2 + BAR - e['snap']) < 0.08:
        c.mark(s2 + BAR, 'the block snaps onto Monday on the settle\'s downbeat (the SFX owns the snap; the felt\'s C4 '
                         'under it is the line\'s own fifth below)', hit=False)
    for i, (t0, col, why) in enumerate(H):
        t1 = H[i + 1][0] if i + 1 < len(H) else e['out'] + 0.4
        lh, (vc, vla) = DR[col]
        last = i + 1 == len(H)
        if col not in ('Fm9',) and lh and abs(t0 - s2) > 0.05:      # (the statements strike their own left hand)
            vv = 0.4 if col == 'Gbmaj7#11' else (0.27 if col == 'Dbmaj9#11' else (0.33 if col != 'F5' else 0.34))
            c.pch('felt_lh', lh, t0, t1 - t0 + (1.2 if last else 0.05), vv, roll=0.018,
                  span_end=t1 - 0.03 if not last else t1 + 1.5)
            c.n('felt_mech', 60, t0, 0.1, 0.25)
        sv = 0.25 if col in ('Fped', 'Gbmaj7#11', 'Bbm9') else 0.21
        c.rebow('vc', vc, t0 - (0.0 if i == 0 else 0.3), t1 + 0.35, sv, seg=5.0, xf=0.9,
                first_att=1.2 if i else 2.0, last_rel=1.4 if last else 0.3, art='sus', lp=1800)
        c.rebow('vla', vla, t0 - (0.0 if i == 0 else 0.3) + 0.1, t1 + 0.35, sv - 0.01, seg=5.0, xf=0.9,
                first_att=1.3 if i else 2.4, last_rel=1.4 if last else 0.3, art='sus', lp=2000)
        c.mark(t0, f'{col}: {why}', hit=False)
    # the melody's pedal follows the colours (re-caught on every change)
    for i, (t0, col, why) in enumerate(H):
        t1 = H[i + 1][0] if i + 1 < len(H) else e['out'] + 1.0
        c.ped.setdefault('felt', []).append((c.clk(t0 + 0.01), c.clk(t1 - 0.03)))
        if col == 'Fm9':
            c.ped.setdefault('felt_lh', []).append((c.clk(t0 + 0.01), c.clk(t1 - 0.03)))
    # ---- the monitor's news-desk sting (claimed: the score plays the monitor's media bed)
    sting_end = news_sting(c, e['sting'])
    c.mark(e['sting'], 'the news site\'s own desk sting, tiny, through the monitor\'s speaker (B-flat sus4, no third: '
                       'the monitor\'s, not the score\'s; under the lineup)', hit=False)
    # ---- CONFIRMED: one chip note (claimed: ui_confirm_chip)
    chip(c, 'lead2', 'F5', e['confirmed'], 0.42, 0.32, duty=0.5, att=0.002, dec=0.22, sus=0.3, rel=0.35)
    c.mark(e['confirmed'], 'DESIGNED HIT: ONE chip note on CONFIRMED (F5, the 50 % square; the score plays the '
                           'claimed ui_confirm_chip): a quiet click of power')
    # ---- the invite: his button, the nudge alone on the felt (the chip on its G), after he accepts
    tn = c.next_beat(e['accept'] + 0.35)
    if tn + SW + 0.6 < e['j_walkon'] + 0.4:
        c.n('felt', 'G4', tn, SW * 0.95, 0.3)
        c.n('felt', 'F4', tn + SW, 1.6, 0.27)
        chip(c, 'lead', 'G4', tn, 0.2, 0.3, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.12)
        c.mark(tn, 'after he accepts: the nudge alone (G-F) on the felt, the chip on its G: his button', hit=False)
    c.mark(e['j_walkon'], 'the walk-on tune comes through the wall (E02-07, J 1.0 s); the dark room\'s D-flat rings '
                          'out under it', hit=False)
    # ---- the V.O. windows: the felt alone carries them (a -4 dB fader ride, as Act One)
    vo = [ln for ln in tl.lines if ln['kind'] == 'vo' and ln['on'] < out_t]
    rides = [(s1 - 3.0, s1 + 2 * BAR + 0.6, -4.5),
             (s2 - 0.3, ((vo5['end'] + 0.4) if vo5 else s2 + BAR + 2 * Q), -4.5),     # the statements: the felt line
             (H[-1][0] - 0.1, out_t + 3.0, -3.0)]                                    # the invite: a quiet click
    #           sits 4.5 dB under its own attack level (the felt's soft velocities barely move its level); the V.O.
    #           needs no ride (measured -24 LUFS under V.O. 4 as it stands)
    macro = ride_macro(rides, -3.0, out_t + 4.0)
    secs = [('1 the arrival: the Water Line whole (Fm9 -> D-flat), the RULEBOOK swiped', s1, H[2][0]),
            ('2 the lineup: B-flat minor, the monitor\'s sting, the headline dry', H[2][0], H[3][0]),
            ('3 V.O. 4: G-flat lydian held (the felt alone)', H[3][0], s2),
            ('4 the calendar: the Water Line cocky; its settle on an open fifth; V.O. 5 inside it', s2,
             [t for t, col, _ in H if col == 'Fped'][0]),
            ('5 the call: thin to the pedal; one chip note on CONFIRMED', [t for t, col, _ in H if col == 'Fped'][0],
             H[-1][0]),
            ('6 the invite: D-flat, the nudge as his button; out under the walk-on', H[-1][0], out_t + 0.6)]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='Dark Room, Spring (E02-06, Ep2 v1 Act Two sc 8)', mm='MM-01 Water Line (to picture) + MM-21 '
        'media beds', usage='BI', family='P01 DARK ROOM (the Water Line, low) + a news-desk sting (MM-21)',
        tone='dry amusement (the swipe, the lineup) -> a small thrill (the Monday, the line cocky) -> a quiet click of '
             'power (the call; CONFIRMED)',
        scenes=['Ep2 v1 Act Two sc 8 (8.01-8.07)'],
        motifs=['THE WATER LINE whole (F F F G-F | C F), the chip on its nudge; then cocky (the nudge twice: OST §2.2, '
                'Ep2-3)', 'the open fifth at the cadence (no third)', 'one chip note (CONFIRMED)',
                'the news-desk sting (an original media bed through the monitor)'],
        motif_ids=['WATER_LINE'], key='F minor: Fm9, D-flat maj9, B-flat m9, G-flat maj7(#11), the open fifth F-C; '
                                      'no A-natural; nothing below C3 (room_drone / server_hum)',
        composer='Ep2 v1 score pass (act2), 2026-10-09, on the e02-v1-common engine (composer X\'s helpers)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        vo_windows=[(c.clk(ln['on']), c.clk(ln['end']), 'V.O.') for ln in vo],
        room_sfx=[dict(t0=c.clk(0.0), t1=c.clk(out_t), sfx='room_drone + server_hum (the dark room)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['toast'], 'ui_toast_pop: the RULEBOOK (no hit)'), (e['swipe'], 'ui_swipe: swiped away (no hit)'),
            (e['sting'], 'news_desk_sting: CLAIMED (the score plays it through the monitor)'),
            (e['snap'], 'ui_drop_snap: the launch onto Monday (the settle\'s downbeat)'),
            (e['ring'], 'call_ring'), (e['confirmed'], 'ui_confirm_chip: CLAIMED (one chip note)'),
            (e['invite'], 'invite_drop'), (e['accept'], 'post_click: accepted'))],
        audition=['0-5 s: the Water Line whole, calm and sure, the copy\'s tail under its first bar; the chip only on '
                  'the nudge', '8-13 s: the sting is the monitor\'s (tiny, small-speaker), not the score\'s',
                  '22-28 s: the cocky line is a small thrill, not a gag', '37.7 s: one chip note is a quiet click'],
        rides=[dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in sorted(rides)])
    sc = c.finish(T, meta, length_end=out_t + 1.8, tail_s=0.5, macro=macro)
    c.ev = dict(e, H=[(round(t, 3), col) for t, col, _ in H], s1=s1, s2=s2, sting_end=sting_end)
    return c, sc


# ================================================================ ONE WORD: the demo's walk-on tune (original)
# F dorian (F G Ab Bb C D Eb; never an A natural), swung for people.  The call climbs the knee's step cell (F G Ab)
# and its leap (Ab -> C), turns on B-flat and holds the C open; the answer comes down through the dorian D to F.  The
# chip ECHO after each phrase (the call's B-flat C, the answer's G F an octave up) is the tune's own (manifest E02-07).
CALL = [(0, 'F4', 0.5), (0.5, 'G4', 0.5), (1, 'Ab4', 1.0), (2, 'C5', 0.5), (2.5, 'Bb4', 1.0), (3.5, 'Ab4', 0.5),
        (4, 'Bb4', 1.5), (5.5, 'C5', 2.5)]
CALL_ECHO = [(6.5, 'Bb5', 0.25), (7.0, 'C6', 0.5)]
ANSWER = [(0, 'D5', 0.5), (0.5, 'C5', 0.5), (1, 'Bb4', 1.0), (2, 'Ab4', 0.5), (2.5, 'Bb4', 1.0), (3.5, 'G4', 0.5),
          (4, 'F4', 2.0)]
ANSWER_ECHO = [(6.5, 'G5', 0.25), (7.0, 'F5', 0.5)]
BRIDGE = [(0, 'Ab4', 1.5), (1.5, 'C5', 0.5), (2, 'Eb5', 1.0), (3, 'Db5', 1.0), (4, 'C5', 2.0), (6, 'Bb4', 1.0),
          (7, 'Ab4', 1.0), (8, 'Bb4', 1.5), (9.5, 'Ab4', 0.5), (10, 'G4', 1.0), (11, 'F4', 1.0), (12, 'G4', 0.5),
          (12.5, 'Ab4', 0.5), (13, 'Bb4', 1.0), (14, 'C5', 2.0)]
TCH = {   # comp voicing (mid register), bass root, the walk's scale: no A natural anywhere
    'Fm11':      (['Bb3', 'Eb4', 'Ab4', 'C5'], 'F2', ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'D3', 'Eb3']),
    'Bb13':      (['Ab3', 'D4', 'G4', 'C5'], 'Bb1', ['Bb1', 'C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2']),
    'Abmaj9#11': (['C4', 'D4', 'G4', 'Bb4'], 'Ab1', ['Ab1', 'Bb1', 'C2', 'D2', 'Eb2', 'F2', 'G2']),
    'C7sus':     (['Bb3', 'Db4', 'F4', 'G4'], 'C2', ['C2', 'Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2']),
    'Dbmaj9#11': (['F3', 'C4', 'Eb4', 'G4'], 'Db2', ['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3']),
    'Bbm9':      (['Db4', 'F4', 'Ab4', 'C5'], 'Bb1', ['Bb1', 'C2', 'Db2', 'Eb2', 'F2', 'Gb2', 'Ab2']),
    'Eb9':       (['Db4', 'F4', 'G4', 'Bb4'], 'Eb2', ['Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3']),
}
FORM_CH = {'A': [[(0, 'Fm11')], [(0, 'Bb13')], [(0, 'Abmaj9#11')], [(0, 'Fm11'), (2, 'C7sus')]],
           'B': [[(0, 'Dbmaj9#11')], [(0, 'Bbm9')], [(0, 'Eb9')], [(0, 'C7sus')]],
           'intro': [[(0, 'Fm11')], [(0, 'C7sus')]], 'call1': [[(0, 'Fm11')]], 'vamp': [[(0, 'C7sus')], [(0, 'C7sus')]]}


def form_bars(n, tail=True):
    """the walk-on's bars, n of them: two of intro, A A B A ..., then (tail) the call's first bar and two bars of the
    dominant vamp into the next room"""
    end = [('call1', 0), ('vamp', 0), ('vamp', 1)] if tail else []
    body = max(0, n - 2 - len(end))
    seq = [(s, i) for s in ('A', 'A', 'B', 'A', 'A', 'B', 'A', 'A') for i in range(4)][:body]
    return ([('intro', 0), ('intro', 1)] + seq + end)[:n]


def bar_melody(sec, i):
    """the melody notes that start in this bar: [(beat within the bar, pitch, beats)] and the echo"""
    if sec == 'A':
        src, echo, half = (CALL, CALL_ECHO, i) if i < 2 else (ANSWER, ANSWER_ECHO, i - 2)
    elif sec == 'B':
        src, echo, half = BRIDGE, [], i
    elif sec == 'call1':
        src, echo, half = [n for n in CALL if n[0] < 4], [], 0
    else:
        return [], []
    lo, hi = 4 * half, 4 * half + 4
    mel = [(b - lo, p, d) for b, p, d in src if lo <= b < hi]
    ech = [(b - lo, p, d) for b, p, d in echo if lo <= b < hi]
    return mel, ech


def walk_bar(c, t0, chords, nxt_root, rng, vel=0.48, inst='ubass', two_feel=False, double='cb_pizz'):
    """a walking bass over one bar (chords: [(beat, name)]): the root on each change, scale tones between, an approach
    into the next bar's root on beat 4; two_feel: half notes (root, then fifth or approach)"""
    out = []
    beats = [0, 2] if two_feel else [0, 1, 2, 3]
    prev = None
    for bt in beats:
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
        d = (2 if two_feel else 1) * Q * 0.92
        out.append(c.n(inst, p, t0 + bt * Q, d, vel * (1.0 if bt == 0 else 0.9)))
        if double:
            c.n(double, p, t0 + bt * Q, Q * 0.6, vel * 0.5, rel=0.16)
    return out


# ================================================================ E02-07 (1/3): the walk-on, through the wall
def wall_post(buf, ctx=None):
    """the stage's PA through the wings' wall: the highs gone (two low-passes, ~700 Hz), the lows thinned, a boxy
    resonance, mono, and a short slap off the other side of the corridor"""
    x = to_stereo(np.asarray(buf, dtype=np.float64))
    y = hp(x, 75, 2)
    y = lp(lp(y, 900, 2), 1500, 2)
    y = peq(y, 210, 2.5, 1.0)
    m = 0.5 * (y[0] + y[1])
    y = np.stack([0.92 * m + 0.08 * y[0], 0.92 * m + 0.08 * y[1]])
    d = int(0.027 * SR)
    sl = np.zeros_like(y)
    sl[:, d:] = lp(y, 600, 2)[:, :-d] * 10 ** (-9 / 20)
    return (y + sl).astype(np.float32)


def tracks_walkon():
    T = palette()
    T['ubass'].gain_db = 0.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -9.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['jazz'].gain_db = 6.0
    T['vibes'].gain_db, T['vibes'].sends = -3.0, {'room': -10}
    T['hn'].gain_db, T['hn'].sends = -6.0, {'room': -10}
    T['tpt'].gain_db, T['tpt'].sends = -3.0, {'room': -10}
    T['tpt'].eq = [('peq', 880, -5.0, 4.0)]
    T['tpt_stac'].gain_db, T['tbn_stac'].gain_db = -4.0, -4.0
    T['lead'].gain_db, T['lead'].sends = -2.0, {'room': -10}
    T['lead2'].gain_db, T['lead2'].sends = -3.0, {'room': -10}
    return T


def cue_walkon(tl):
    B, E = tl.B, tl.E
    W0 = B('10.01') - 0.25                       # the waltz's downbeat: 0.25 s before the cut to the blueprint
    j_in = E('8.07') - 1.0                       # J 1.0 s under the invite
    n = int(math.ceil((W0 - (j_in - 0.6)) / BAR))
    c = V.Cue('e02-07a-one-word-walk-on', tl, anchor=W0, anchor_bar=n + 1, bars=n + 3, swing=1.0)
    T = tracks_walkon()
    rng = np.random.default_rng(907)
    form = form_bars(n)
    t_first = c.bar(1)
    for k, (sec, i) in enumerate(form):
        t0 = c.bar(1 + k)
        chords = FORM_CH[sec][i]
        nxt = form[k + 1] if k + 1 < len(form) else ('A', 0)
        nxt_root = TCH[FORM_CH[nxt[0]][nxt[1]][0][1]][1]
        walk_bar(c, t0, chords, nxt_root, rng, vel=0.52 if sec != 'intro' else 0.46)
        for bt, name in chords:
            v = TCH[name][0]
            tc = t0 + bt * Q
            c.ch('vibes', v, tc, Q * 1.4, 0.34, roll=0.008)
            c.ch('vibes', v[1:], sw_at(t0, bt + 1.5), Q * 0.4, 0.24, roll=0.006)
            c.ch('hn', v[:3], tc, (4 - bt) * Q * 0.95 if len(chords) == 1 else 2 * Q * 0.95, 0.2, roll=0.0,
                 att=0.08, rel=0.4)
        mel, ech = bar_melody(sec, i)
        for bt, p, d in mel:
            t = sw_at(t0, bt)
            dur = sw_at(t0, bt + d) - t
            c.n('tpt', p, t, dur * 0.9, 0.5, art='sus', att=0.03, rel=0.18)
            chip(c, 'lead', p, t, min(dur * 0.85, 0.5), 0.36, duty=0.25)
        for bt, p, d in ech:
            t = sw_at(t0, bt)
            chip(c, 'lead2', p, t, 0.13, 0.34, duty=0.125, dec=0.06, sus=0.2, rel=0.05)
        # a brass tap on each phrase's end (big band: accents only)
        if (sec == 'A' and i in (1, 3)) or (sec == 'B' and i == 3):
            tt = sw_at(t0, 2.5)
            c.ch('tpt_stac', [TCH[chords[-1][1]][0][-1], TCH[chords[-1][1]][0][-2]], tt, 0.12, 0.42, roll=0.0)
            c.ch('tbn_stac', [TCH[chords[-1][1]][0][0]], tt, 0.12, 0.4, roll=0.0)
    end = W0 + 0.15
    drums_window(c, 'jazz', 'ride: x.xxx.xx\nhatf: ..x...x.\nkick[vel=0.4]: x...x...', t_first, W0, 0.5)
    c.mark(j_in, 'the walk-on tune through the wall (J 1.0 s under the invite): the stage band warming up, low-passed, '
                 'mono, a slap off the corridor', hit=False)
    c.mark(t_first + 2 * BAR, 'the tune (ONE WORD): the call climbs the step cell, the chip echoes each phrase\'s end',
           hit=False)
    for k, (sec, i) in enumerate(form):
        if sec == 'vamp' and i == 0:
            c.mark(c.bar(1 + k), 'the dominant vamp (C7sus) under the five hellos, into the waltz', hit=False)
    secs = [('the walk-on through the wall: intro, A A B A', t_first, c.bar(1 + len(form) - 3)),
            ('the walk-on: the call\'s first bar, the dominant vamp under the hellos', c.bar(1 + len(form) - 3), end)]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='One Word · the walk-on, through the wall (E02-07, Ep2 v1 Act Two sc 9)',
        mm='MM-21 media beds (a keynote walk-on) + new to picture', usage='BI',
        family='ROOM COLOURS: the demo\'s walk-on (diegetic, the stage\'s PA through the wings\' wall)',
        tone='nervous fun: the show about to start, heard through a wall', scenes=['Ep2 v1 Act Two sc 9 (9.01-9.06)'],
        motifs=['ONE WORD (the demo\'s walk-on): the call (F G A-flat C B-flat A-flat B-flat C), the answer (D C B-flat '
                'A-flat B-flat G F), the bridge; the chip echo at each phrase end'],
        motif_ids=[], key='F dorian (Fm11, B-flat 13, A-flat maj9(#11), C7sus; bridge D-flat maj9(#11), B-flat m9, '
                          'E-flat 9); no A-natural', diegetic=True,
        composer='Ep2 v1 score pass (act2), 2026-10-09', underscore_lufs=-24.0, album_lufs=-16.0,
        audition=['a keynote walk-on heard through a wall: confident, swung, the show\'s own band (chip, vibes, brass '
                  'accents), never lounge, never a stock corporate cue'])
    sc = c.finish(T, meta, length_end=end + 0.4, tail_s=0.4,
                  stem_post={fam: wall_post for fam in FAMILIES})
    c.ev = dict(W0=W0, j_in=j_in, first=t_first, end=end, form=[f'{s}{i}' for s, i in form])
    return c, sc


# ================================================================ E02-07 (2/3): BLUEPRINT, THE PLAN's waltz
WZ = {   # waltz bar chords: (the triangle bass, the chip's two-note chord on beats 2-3, the sul-tasto pad)
    'F':   ('F2', ['Ab4', 'C5'], ['F3', 'Bb3', 'Eb4', 'Ab4']),
    'Bb':  ('Bb2', ['Ab4', 'D5'], ['Bb2', 'Ab3', 'D4', 'G4']),
    'C':   ('C3', ['Bb4', 'Eb5'], ['C3', 'F3', 'Bb3', 'Eb4']),
    'D':   ('D3', ['C5', 'F5'], ['D3', 'G3', 'C4', 'F4']),
    'G':   ('G2', ['Bb4', 'F5'], ['G3', 'C4', 'F4', 'Bb4']),
    'Ab':  ('Ab2', ['C5', 'G5'], ['Eb3', 'G3', 'C4', 'D4']),
}
WZ_PULSE = {'F': ['F3', 'C4', 'Bb3', 'C4', 'Eb4', 'C4'], 'Bb': ['Bb3', 'D4', 'Ab3', 'D4', 'F4', 'D4'],
            'C': ['C4', 'F4', 'Bb3', 'F4', 'Eb4', 'Bb3'], 'D': ['D4', 'G4', 'C4', 'G4', 'F4', 'C4'],
            'G': ['G3', 'C4', 'Bb3', 'D4', 'F4', 'D4'], 'Ab': ['Ab3', 'Eb4', 'C4', 'Eb4', 'G4', 'D4']}
FOURTH_BELOW = {'F4': 'C4', 'G4': 'D4', 'Ab4': 'Eb4', 'Bb4': 'F4', 'C5': 'G4', 'D5': 'G4', 'Eb5': 'Bb4'}


def tracks_blueprint(tear_s, zero_s):
    T = palette()
    for k, tr in T.items():                  # THE PLAN is the record: straight, 0 ms
        tr.hum_ms, tr.drift_ms, tr.offset_ms, tr.vel_jit = 0.0, 0.0, 0.0, 0.015
    T['lead'].gain_db, T['lead'].sends = -1.0, {'room': -14, 'chamber': -16}        # the chip music box
    T['lead'].eq = [('hp', 200)]
    T['lead2'].gain_db, T['lead2'].pan, T['lead2'].sends = -9.0, 0.25, {'room': -12, 'chamber': -16}
    T['tri'].gain_db = -7.0
    dup(T, 'tri', 'tri2', gain_db=-10.0, pan=-0.2)
    T['celesta'].gain_db, T['celesta'].sends = 9.0, {'hall': -12, 'chamber': -12}
    T['harp'].gain_db, T['harp'].pan = -7.0, -0.35
    T['woodclick'].gain_db, T['woodclick'].eq, T['woodclick'].pan = -16.0, [('hp', 900), ('hs', 6000, -4)], 0.35
    for k in ('vla_pizz', 'vln_pizz'):
        T[k].gain_db = -5.0
    T['vla_pizz'].eq = list(T['vla_pizz'].eq) + [('peq', 223.5, -10.0, 8.0)]
    for s in ('vln2', 'vla', 'vc'):
        T[s].sends, T[s].gain_db = {'hall': -12, 'chamber': -14}, -5.0

    def tape(buf, ctx=None):
        """the deck loses power at the tear: pitch and speed fall to nothing (MM-07's curve), zero after"""
        y = to_stereo(np.asarray(buf, dtype=np.float32)).copy()
        ia, iz = int(tear_s * SR), int(zero_s * SR)
        if ia < y.shape[1]:
            iz = min(iz, y.shape[1])
            y[:, ia:iz] = tape_stop(y[:, ia:iz], 0.0, (iz - ia) / SR, curve=1.6)
            y[:, iz:] = 0.0
        return y
    return T, tape


def cue_blueprint(tl, demo_entry):
    B, E = tl.B, tl.E
    W0 = B('10.01') - 0.25
    tear = _snd(tl, '10.07', 'paper_tear', E('10.07') - 1.8)
    zero = demo_entry - 0.26                      # the tape reaches nothing a quarter second before the demo's push
    c = V.Cue('e02-07b-one-word-blueprint', tl, anchor=W0, anchor_bar=2, bars=int((zero + 3 - W0) / BAR) + 3,
              swing=0.0)
    T, tape = tracks_blueprint(c.clk(tear), c.clk(zero))
    talk = talk_windows(tl, 0.1, 0.15)
    wb = lambda k: W0 + k * WBAR                  # noqa: E731
    wq = lambda t: W0 + round((t - W0) / (Q / 2)) * (Q / 2)      # noqa: E731  the plan's eighth grid
    nbar = int(math.floor((tear - W0) / WBAR)) + 1
    # ---- the chord per waltz bar, by the plan's sections (the word, the diagram, the plan, the stage, the break)
    S = dict(word=W0, before=_os(tl, '10.02', 'BEFORE', B('10.02') + 0.3), relay=_os(tl, '10.02', 'EAR', B('10.02') + 0.7),
             fell=_os(tl, '10.02', 'TONE', B('10.02') + 6.6),
             laugh_tag=_os(tl, '10.02', '[laughter]', B('10.02') + 8.2), now=_os(tl, '10.03', 'NOW', B('10.03') + 0.3),
             gtp=_os(tl, '10.03', 'GTP', B('10.03') + 0.6), step1=_os(tl, '10.04', '1.', B('10.04') + 3.6),
             step2=_os(tl, '10.05', '2.', B('10.05') + 1.4), step3=_os(tl, '10.05', '3.', B('10.05') + 2.6),
             sheet=B('10.06') if tl.has('10.06') else B('10.05') + 6.0, brk=B('10.07'), tear=tear)
    kb = lambda t: int(math.floor((t - W0) / WBAR + 1e-6))      # noqa: E731
    kr = lambda t: int(round((t - W0) / WBAR))                     # noqa: E731  (the nearest waltz bar)
    chords = {}
    for k in range(nbar + 2):
        t = wb(k)
        if t < S['before'] - 0.3:
            ch = 'F' if k % 4 < 2 else 'Bb'
        elif t < S['laugh_tag'] - 0.2:
            ch = 'C' if (k - kb(S['before'])) % 4 < 2 else 'D'
        elif t < S['now'] - 0.4:
            ch = 'F'
        elif t < S['step1'] - 0.6:
            ch = 'G' if (k - kb(S['now'])) % 4 < 2 else 'Ab'
        elif t < S['sheet'] - 0.4:
            ch = ['F', 'G', 'Bb', 'C', 'F'][min(4, k - kb(S['step1']))]
        elif t < S['brk'] - 0.3:
            ch = 'Ab' if (k - kb(S['sheet'])) < 2 else 'Bb'
        else:
            ch = 'F' if k == kb(S['brk']) + 1 else 'C'
        chords[k] = ch
    # ---- THE BREAK: the answer starts (bar after the break begins), then its last two beats stick and loop
    kb1 = kb(S['brk']) + 1
    brk_notes = [(wb(kb1), 'D5'), (wb(kb1) + Q, 'C5'), (wb(kb1) + 2 * Q, 'Bb4'), (wb(kb1 + 1), 'Ab4'),
                 (wb(kb1 + 1) + Q, 'Bb4'), (wb(kb1 + 1) + 2 * Q, 'G4')]
    stuck0 = wb(kb1 + 2)
    t = stuck0
    j = 0
    while t < tear - 0.05:
        brk_notes.append((t, ['Bb4', 'G4'][j % 2]))
        t += Q
        j += 1
    # ---- the accompaniment: the triangle bass on 1, the chip's chord on 2 and 3, the drafting pizzicato in the
    # relay and the steps, a sul-tasto pad for NOW (one model) and the tiny stage; softer under her lines
    for k in range(nbar + 1):
        t0 = wb(k)
        if t0 >= stuck0 - 0.01 or t0 >= tear:
            break
        ch = chords[k]
        bass, cc, padv = WZ[ch]
        soft = 0.8 if inside(t0, talk) else 1.0
        c.n('tri', bass, t0, WBAR * 0.95, 0.52 * soft, True, att=0.002, dec=0.6, sus=0.0, rel=0.12, steps=15)
        for bt in (1, 2):
            for p in cc:
                c.n('lead2', p, t0 + bt * Q, 0.3, (0.4 if bt == 1 else 0.34) * soft, True, duty=0.5, att=0.002,
                    dec=0.12, sus=0.0, rel=0.08, steps=15)
        relay = S['before'] - 0.3 <= t0 < S['laugh_tag'] - 0.2
        steps = S['step1'] - 0.6 <= t0 < S['sheet'] - 0.4
        if relay or steps:
            for j, p in enumerate(WZ_PULSE[ch]):
                tj = t0 + j * Q / 2
                c.n('vla_pizz' if j % 2 else 'vln_pizz', p, tj, 0.25, (0.42 if j % 2 == 0 else 0.34) * soft, True)
        stage = S['now'] - 0.4 <= t0 < S['step1'] - 0.6 or S['sheet'] - 0.4 <= t0 < S['brk'] - 0.3
        if stage:
            for inst, p in zip(('vc', 'vla', 'vln2'), padv[:3]):
                c.n(inst, p, t0, WBAR + 0.25, 0.18, True, art='sus', att=0.35, rel=0.5, lp=2300.0)
        if k in (0, kb(S['before']), kb(S['now']), kb(S['step1']), kb(S['sheet'])):
            for j, p in enumerate(padv):
                c.n('harp', p, t0 + j * 0.06, 1.6, 0.45, True)
    # the stuck loop: the chip's chord on every beat, no bass (the mechanism caught), until the tear
    t = stuck0
    while t < tear - 0.05:
        for p in WZ['C'][1]:
            c.n('lead2', p, t, 0.28, 0.36, True, duty=0.5, att=0.002, dec=0.12, sus=0.0, rel=0.08, steps=15)
        t += Q
    # ---- the line: one note per label (the plan's steps are the line's steps), the tune in 3/4 in the gaps
    line = [(W0, 'F4', 'the waltz on its downbeat: the walk-on tune\'s head as a music box (F G A-flat C)'),
            (W0 + Q, 'G4', None), (W0 + 2 * Q, 'Ab4', None), (W0 + 3 * Q, 'C5', None),
            (wq(S['before']), 'Bb4', 'BEFORE'), (max(wq(S['before']) + Q / 2, wq(S['relay'])), 'Ab4',
                                                 'the relay drawn (soft, under her line)'),
            (wq(S['fell']), 'G4', '"fell out": the labels drop through the grate (soft)'),
            (wq(S['laugh_tag']), 'F4', 'the [laughter] tag at the bottom of the grate'),
            (wq(S['now']), 'Bb4', 'NOW'), (wq(S['now']) + Q / 2 if wq(S['gtp']) <= wq(S['now']) else wq(S['gtp']),
                                         'C5', 'GTP-4o: one box'),
            (wb(kb(S['step1']) - 2), 'D5', 'the answer begins in the gap'), (wb(kb(S['step1']) - 2) + Q, 'C5', None),
            (wq(S['step1']), 'F4', 'step 1: 232 MS (the step cell begins: F)'),
            (wq(S['step2']), 'G4', 'step 2: MON (G)'), (wq(S['step3']), 'Ab4', 'step 3: $0 (A-flat)'),
            (wb(kr(S['sheet'])) - 3 * Q + Q / 2, 'Bb4', 'the tiny crowd floods in: B-flat A-flat B-flat'),
            (wb(kr(S['sheet'])) - 2 * Q, 'Ab4', None), (wb(kr(S['sheet'])) - Q, 'Bb4', None),
            (wb(kr(S['sheet'])), 'C5', 'the full sheet, the tiny stage: the leap lands on C')]
    lt = dict(line=[], dropped=[])
    for t, p, why in line + [(tt, pp, None) for tt, pp in brk_notes]:
        if t >= tear - 0.03:
            continue
        in_talk = inside(t, talk)
        if in_talk and why is None and t < S['brk']:
            lt['dropped'].append((round(t, 3), p))
            continue
        soft = 0.6 if in_talk else 1.0
        k = kb(t)
        nxt = min([tt for tt, _, _ in line if tt > t + 1e-3] + [t + 2 * Q])
        d = max(0.25, min(0.9, (nxt - t) * 0.6))
        c.n('lead', p, t, d, 0.6 * soft, True, duty=0.25, att=0.0015, dec=0.26 + 0.12 * min(d / Q, 2), sus=0.0,
            rel=0.22, steps=15)
        c.n('celesta', nm(p) + 12, t, max(0.6, d * 1.2), 0.42 * soft, True)
        if p in FOURTH_BELOW and not in_talk and t < S['brk']:
            c.n('tri2', FOURTH_BELOW[p], t, min(0.8, d), 0.36, True, duty=0.5, att=0.002, dec=0.2, sus=0.0,
                rel=0.1, steps=15)
        if why and ('step' in why or why in ('BEFORE', 'NOW')):
            c.n('woodclick', 60, t, 0.2, 0.3, True)                          # the pencil tick (score, soft)
        lt['line'].append((round(t, 3), p))
        if why:
            c.mark(t, f'the line: {p} ({why})', hit=False)
    c.mark(W0, 'DESIGNED HIT: THE PLAN\'s waltz on its downbeat, 0.25 s before the cut: the walk-on\'s tune, now a '
               'chip music box in 3/4 (the panel\'s last square becomes the grid\'s first cell)')
    c.mark(wb(kb1), 'THE BREAK: the answer starts under the empty bubble (D C B-flat | A-flat B-flat G ...)', hit=False)
    c.mark(stuck0, 'its last two beats stick and loop (B-flat G, the chip\'s chord on every beat, no bass): it never '
                   'reaches F', hit=False)
    c.mark(tear, 'the tear: a TAPE-STOP (MM-07\'s curve), to nothing a quarter second before the demo\'s push',
           hit=False)
    for lab, a0, a1 in (('the word: the head as a music box (F G A-flat C); under "Omni."', W0, S['before'] - 0.3),
                        ('the diagram: BEFORE (the relay\'s pizzicato), the grate, [laughter]', S['before'] - 0.3,
                         S['now'] - 0.4),
                        ('NOW: one model (the sul-tasto pad); the answer\'s head', S['now'] - 0.4, S['step1'] - 0.6),
                        ('the plan: the three steps on F G A-flat; the tiny crowd', S['step1'] - 0.6, S['sheet'] - 0.4),
                        ('the tiny stage: the leap to C; her last sentence', S['sheet'] - 0.4, S['brk']),
                        ('the break: the answer sticks; the tape-stop', S['brk'], zero)):
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='One Word · BLUEPRINT (E02-07, Ep2 v1 Act Two sc 10: THE PLAN, OMNI)', mm='P14 BLUEPRINT',
        usage='BI', family='P14 BLUEPRINT: the chip music-box waltz (3/4 on the 96 beat), straight',
        tone='the explainer\'s lean-in: accurate, cheerful, precise; a twinge at the empty bubble',
        scenes=['Ep2 v1 Act Two sc 10 (10.01-10.07)'],
        motifs=['ONE WORD as a music box (one tune in three rooms)', 'the step cell on the plan\'s three steps (F G A-flat)',
                'the stuck loop and the tape-stop (THE PLAN always breaks)'],
        motif_ids=[], key='F dorian, quartal (F, B-flat 13, C, D, G, A-flat colours); no A-natural; no piano, no '
                          'brass, no V.O.',
        composer='Ep2 v1 score pass (act2), 2026-10-09', underscore_lufs=-18.5, album_lufs=-16.0,
        audition=['a music box, small and sweet, never a circus, never "educational" marimba',
                  'the steps tick F G A-flat with the stamps; the empty bubble sticks the box, and the tape-stop is a '
                  'stop, not a gag'])
    macro = ride_macro([(W0 - 0.3, W0 + 2.2, -1.5)], c.bar1 - 1.0, zero + 1.0)   # the head's first bar under the
    #                                                                             featured ceiling (-14 LUFS-M)
    sc = c.finish(T, meta, length_end=zero + 0.3, tail_s=0.3, stem_post={fam: tape for fam in FAMILIES}, macro=macro)
    c.ev = dict(W0=W0, zero=zero, stuck=stuck0, chords={k: v for k, v in chords.items() if k <= nbar},
                **{k: round(v, 3) for k, v in S.items()}, line=lt['line'], dropped=lt['dropped'])
    return c, sc


# ================================================================ E02-07 (3/3): the demo, the pad, the Door, the stop
PAD = {   # the pad: sul-tasto strings (vc, vla, vln2, vln1) and the bowed vibes' two notes
    'Fm11':      (['F2', 'Eb3', 'Ab3', 'Bb3'], ['C5', 'Eb5']),
    'Dbmaj9#11': (['Db3', 'Ab3', 'C4', 'F4'], ['Eb5', 'G5']),
    'Bbm9':      (['Db3', 'F3', 'Ab3', 'C4'], ['Db5', 'F5']),
    'Abmaj9':    (['Eb3', 'G3', 'C4', 'Bb4'], ['C5', 'Eb5']),
    'Fped':      (['F3', 'C4'], []),
}
PAD_DARK = {'Dbmaj9#11': (['Db3', 'Ab3', 'C4', 'F4'], ['Eb5', 'G5'])}     # (the dark room: nothing below C3)


def tracks_demo(news_cut_s):
    T = palette()
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -10.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['brush'].gain_db = 8.0
    T['swish'].gain_db = 2.0
    T['jazz'].gain_db = 2.0
    T['vibes'].gain_db, T['vibes'].sends = -3.0, {'room': -12, 'hall': -14}
    dup(T, 'vibes', 'vb', gain_db=-14.0, sends={'hall': -9, 'room': -14})       # the bowed vibes (the pad's colour;
    #                                                       measured: at 0.22 they read 10 dB over four strings at 0.13)
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -2.0, {'room': -12, 'snes': -12}, [('hp', 220), ('lp', 5600)]
    T['lead2'].gain_db, T['lead2'].sends, T['lead2'].eq = -2.0, {'room': -10, 'snes': -10}, [('hp', 220), ('lp', 6000)]
    dup(T, 'vln1', 'vln_lead', gain_db=-8.0, sends={'hall': -10, 'room': -14})    # the violins an octave under
    T['tpt_stac'].gain_db, T['tbn_stac'].gain_db = -8.0, -8.0
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    T['fl'].gain_db, T['fl'].pan, T['fl'].sends, T['fl'].eq = 1.0, -0.5, {'room': -9}, [('lp', 2600), ('hp', 300)]
    T['felt'].gain_db, T['felt'].sends = -3.0, {'room': -12, 'hall': -16}
    T['felt_mech'].gain_db = -18.0

    def monitor(buf, ctx=None):
        """the news's tiny bed through his monitor's speaker; it stops when he minimises the window"""
        y = futz(buf, 'laptop')
        i = int(news_cut_s * SR)
        k = int(0.012 * SR)
        if i < y.shape[1]:
            y[:, i:i + k] *= np.cos(np.linspace(0, np.pi / 2, min(k, y.shape[1] - i)))[None]
            y[:, i + k:] = 0.0
        return y
    for src, name, g in (('vln_spic', 'nb_spic', -23.0), ('timp', 'nb_timp', -26.0), ('glock', 'nb_glock', -30.0),
                         ('cb_pizz', 'nb_bass', -24.0)):
        dup(T, src, name, post=monitor, sends={}, gain_db=g, hum_ms=0.0, eq=[])
    return T


def cue_demo(tl):
    B, E = tl.B, tl.E
    sung = _line(tl, 'e2-a2-0030', 'chatgtp', B('11.05') + 4.3)
    try:
        S0 = tl.W(sung['id'], 'one')                       # the sung line's first beat ("one")
    except (KeyError, TypeError):
        S0 = (sung['on'] + 0.025) if sung else B('11.05') + 4.3
    cut = B('11.01')
    k_push = int(math.floor((S0 - (cut - 0.15)) / Q)) + 1          # the beats from the push's beat to S0
    beat_after = S0 - (k_push - 1) * Q                             # the beat after the push (on the sung grid)
    if beat_after > cut + 0.05:
        beat_after -= Q
    push = beat_after - Q + SW                                     # a swung push into it
    while push > cut - 0.15:
        beat_after -= Q
        push = beat_after - Q + SW
    stop = round((B('12.08') + 2.0) * 24) / 24.0                   # the designed stop: the downbeat after 2 s on his face
    nb = int(math.ceil((beat_after - (push - 1.0)) / BAR)) + 1
    c = V.Cue('e02-07c-one-word-the-demo', tl, anchor=beat_after, anchor_bar=nb + 1,
              bars=int((stop + 3 - (beat_after - nb * BAR)) / BAR) + 2, swing=1.0)
    minimise = _snd(tl, '12.05', 'ui_minimise', E('12.05') - 1.4)
    T = tracks_demo(c.clk(minimise))
    rng = np.random.default_rng(1105)
    talk = talk_windows(tl, 0.15, 0.2)
    W = still_windows(tl)
    rec = record_windows(tl)
    cuts = [b['t0'] for b in tl.beats]
    ended = _os(tl, '11.10', 'ENDED', B('11.10') + 0.8) if tl.has('11.10') else B('11.10') + 0.8
    hold = B('11.09')
    close = _line(tl, 'e2-a2-0036', 'rima', hold + 2.5)
    e = dict(S0=S0, push=push, beat_after=beat_after, stop=stop, ended=ended, hold=hold, minimise=minimise,
             post=_snd(tl, '11.12', 'post_click', B('11.12') + 1.3),
             door=_snd(tl, '12.03', 'door_motif_note', B('12.03') + 0.2),
             news=_snd(tl, '12.05', 'news_bed_tiny', B('12.05')), phone=_snd(tl, '12.06', 'phone_buzz_step_1',
                                                                              B('12.06') + 0.1),
             black=B('12.04'), home=B('12.05'), face=B('12.08'))
    # ---- the demo's bars: the form from the beat after the push; the band stops into the hold
    hold_t = lead_in(c, hold)                                # the band thins to a held chord for Rima's hold
    end_t = lead_in(c, ended)                                # ENDED: the pad
    nbars = int(math.ceil((hold_t - beat_after) / BAR)) + 1
    form = form_bars(nbars + 2, tail=False)[2:]              # the demo starts on the tune (no intro)
    bars = []
    for k in range(nbars):
        t0 = beat_after + k * BAR
        if t0 >= hold_t - 0.05:
            break
        sec, i = form[k]
        chords = [(bt, n) for bt, n in FORM_CH[sec][i]]
        bars.append(dict(t0=t0, sec=sec, i=i, chords=chords))
    # the sung line: the band holds a C pedal (C7sus) from the bar before the singing to its held note's end; then F
    sung_end = (sung['end'] if sung else S0 + 2.3)
    for b in bars:
        if b['t0'] <= S0 + 0.01 < b['t0'] + BAR or b['t0'] <= sung_end < b['t0'] + BAR or S0 < b['t0'] < sung_end:
            b['chords'] = [(0, 'C7sus')]
            b['sung'] = True
    for j, b in enumerate(bars):
        if b.get('sung') and j + 1 < len(bars) and not bars[j + 1].get('sung'):
            bars[j + 1]['chords'] = [(0, 'Fm11')]
            bars[j + 1]['after_sung'] = True
    # a change that would land just after a cut pre-laps it (the bar's own change moves to the lead-in)
    for b in bars:
        for idx, (bt, n) in enumerate(b['chords']):
            tc = b['t0'] + bt * Q
            cc = next((x for x in cuts if 0.0 < tc - x < 0.35), None)
            if cc is not None:
                b.setdefault('prelap', {})[idx] = lead_in(c, cc)
    # ---- the rhythm section: a two-feel upright, brushes, vibes comp; the push
    c.ch('vibes', TCH['Fm11'][0], push, Q * 1.2, 0.38, roll=0.006)
    c.n('ubass', 'F2', push, beat_after + Q - push, 0.52)
    c.n('cb_pizz', 'F2', push, 0.5, 0.3, rel=0.16)
    c.n('brush', 39, push, 0.3, 0.5)
    c.n('jazz', 53, push, 0.4, 0.32)
    c.ch('tpt_stac', ['Eb5', 'C5'], push, 0.14, 0.34, roll=0.0)
    c.ch('tbn_stac', ['Bb3'], push, 0.14, 0.32, roll=0.0)
    c.mark(push, f'DESIGNED HIT: the demo\'s push ({how(c, push, cut)} to the stage): the walk-on\'s band on stage, the '
                 'tape stopped a quarter second before')
    for j, b in enumerate(bars):
        t0 = b['t0']
        nxt = bars[j + 1]['chords'][0][1] if j + 1 < len(bars) else 'Dbmaj9#11'
        two = True
        walk_bar(c, t0, [(bt, n) for bt, n in b['chords']], TCH[nxt][1], rng,
                 vel=0.44 if not b.get('sung') else 0.4, two_feel=two)
        for idx, (bt, n) in enumerate(b['chords']):
            tc = b.get('prelap', {}).get(idx, t0 + bt * Q)
            v = TCH[n][0]
            soft = 0.75 if inside(tc, talk) else 1.0
            if b.get('sung'):
                if idx == 0:
                    c.ch('vibes', v, tc, BAR * 0.95, 0.3, roll=0.01)          # held under the singing (no comping)
                continue
            c.ch('vibes', v, tc, Q * 1.3, 0.34 * soft, roll=0.008)
            c.ch('vibes', v[1:], sw_at(t0, bt + 1.5), Q * 0.35, 0.22 * soft, roll=0.006)
    drums_window(c, 'brushes', 'sweep: ~~~~~~~~\ntap: ..o...o.\nhatf[vel=0.5]: ..x...x.', beat_after, hold_t, 0.4)
    # ---- the lead: the tune's phrases ONLY in the pockets (a phrase starts only when its first notes are clear and
    # stops when a line begins), the chip with the violins an octave under; the echo; a brass tap at a clear phrase end
    placed = []
    laughs = merge([(s['t'] - 0.1, s['t'] + 0.9) for s in tl.sounds if s['name'].startswith('crowd_laugh')])
    for j, b in enumerate(bars):
        if b.get('sung') or b.get('after_sung'):          # (no lone note after the laugh: no button on a gag)
            continue
        mel, ech = bar_melody(b['sec'], b['i'])
        t0 = b['t0']
        notes = [(sw_at(t0, bt), p, sw_at(t0, bt + d) - sw_at(t0, bt)) for bt, p, d in mel]
        clear = [not inside(t, talk) and not inside(t + 0.12, talk) for t, _, _ in notes]
        if not notes:
            continue
        run = []
        if clear[0] and (len(clear) < 2 or clear[1]):
            for (t, p, d), ok in zip(notes, clear):
                if not ok:
                    break
                run.append((t, p, d))
        # a bar that continues a phrase from the bar before (the call's bar 2, the answer's bar 2)
        if not run and placed and placed[-1]['bar'] == j - 1 and b['i'] in (1, 3) and clear[0]:
            for (t, p, d), ok in zip(notes, clear):
                if not ok:
                    break
                run.append((t, p, d))
        cont = bool(placed) and placed[-1]['bar'] == j - 1 and (b['i'] in (1, 3) if b['sec'] == 'A' else b['i'] > 0)
        starts = b['i'] in (0, 2) if b['sec'] == 'A' else b['i'] == 0     # a phrase starts at its own head only
        if not cont and not starts:
            continue
        if run and not cont and inside(run[0][0], laughs):
            run = []                                         # a phrase never starts on a laugh (no button on a gag)
        if not run or (len(run) < 3 and not cont):
            continue
        run = [(t, p, d) for t, p, d in run if t < hold_t - 0.12]
        if not run:
            continue
        for t, p, d in run:
            nxt_talk = min([a for a, bb in talk if a > t] + [1e9])
            dd = min(d * 0.88, nxt_talk - t - 0.05)
            if dd < 0.08:
                continue
            chip(c, 'lead', nm(p) + 12, t, min(dd, 0.6), 0.32, duty=0.25)
            c.n('vln_lead', p, t, dd, 0.36, art='sus', att=0.02, rel=0.15)
        placed.append(dict(bar=j, t=run[0][0], n=len(run), sec=b['sec'], i=b['i']))
        whole = len(run) == len(notes)
        for bt, p, d in ech:
            te = sw_at(t0, bt)
            if whole and not inside(te, talk) and not inside(te + 0.2, talk):
                chip(c, 'lead2', p, te, 0.13, 0.36, duty=0.125, dec=0.06, sus=0.2, rel=0.05)
        if whole and ((b['sec'] == 'A' and b['i'] in (1, 3)) or (b['sec'] == 'B' and b['i'] == 3)):
            tt = sw_at(t0, 2.5)
            if not inside(tt, talk):
                top = TCH[b['chords'][-1][1]][0]
                c.ch('tpt_stac', [top[-1], top[-2]], tt, 0.12, 0.34, roll=0.0)
                c.ch('tbn_stac', [top[0]], tt, 0.12, 0.32, roll=0.0)
        c.mark(run[0][0], f'the lead in the pocket: {b["sec"]} bar {b["i"] + 1} ({len(run)} of {len(notes)} notes; '
                          'the chip, the violins an octave under)', hit=False)
    # ---- "one wo-o-ord.": the band holds C (no comping attack under the three mouths); the tune's own chip echo
    # (the call's B-flat C) answers under the held "-ord", on the singing's own beat
    if sung:
        te1, te2 = sw_at(S0, 2.5), S0 + 3 * Q
        chip(c, 'lead2', 'Bb5', te1, 0.14, 0.4, duty=0.125, dec=0.06, sus=0.2, rel=0.05)
        chip(c, 'lead2', 'C6', te2, 0.3, 0.42, duty=0.125, dec=0.1, sus=0.25, rel=0.12)
        c.mark(S0, '"one wo-o-ord." (three mouths, on the band\'s beat): the band holds a C pedal under it', hit=False)
        c.mark(te1, 'the tune\'s own chip echo (B-flat C) under the held "-ord": the echo every call has had, not a '
                    'copy of the voice', hit=False)
    # ---- the hold (Rima, 1 bar) and her close: a held D-flat (strings, bowed vibes, the bass's D-flat); no hit
    c.rebow('cb', 'Db2', hold_t, end_t + 0.3, 0.12, seg=5.0, xf=1.0, first_att=0.6, last_rel=0.8, art='sus', lp=900)
    hv, hvb = PAD['Dbmaj9#11']
    for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), hv):
        c.rebow(inst, p, hold_t, end_t + 0.3, 0.16, seg=5.0, xf=1.0, first_att=0.9, last_rel=0.4, art='sus', lp=2400)
    c.ch('vb', hvb, hold_t + 0.05, end_t - hold_t + 0.4, 0.24, roll=0.02, art='bowed')
    c.n('swish', 'C4', hold_t, 1.2, 0.3, True, circles=0.6)
    c.mark(hold_t, f'Rima\'s hold ({how(c, hold_t, hold)}): the band thins to one held chord (D-flat maj9(#11)): the '
                   'house waits on her; nothing under "...and that\'s the demo." moves', hit=False)
    # ---- the pad: from ENDED, held (no tune: the demo's harmony only) to the stop
    plan = [(end_t, 'Fm11', 'ENDED: the rhythm stops; the strings and the bowed vibes hold the pad (dry under the post)')]
    blimp = [s['t'] for s in tl.sounds if s['name'] == 'blimp_inflate_step']
    t = place(c, c.next_bar(max(end_t + BAR, (rec_end(rec, e['post']) + 0.1))), W)
    plan.append((t, 'Dbmaj9#11', 'the blimp rises over the emptying house; the coverage swings away (the pad moves, '
                                 'once a two bars; no hit on the blimp\'s steps)'))
    plan.append((place(c, t + 2 * BAR, W), 'Bbm9', 'Rima holds her mark'))
    plan.append((place(c, lead_in(c, B('12.01')), W), 'Abmaj9', f'the house lights up full; her one breath, and she '
                                                                 f'walks off with the clicker (her own close: warm)'))
    tdb = place(c, lead_in(c, B('12.02')), W)
    plan.append((tdb, 'Dbmaj9#11', 'the front row: the empty seat; D-flat for the Door; held across the black into '
                                   'the afternoon'))
    tped = c.next_beat(minimise + 0.3)
    alyi = next((a for a, b2, _ in rec if a > e['home']), None)
    if alyi is not None and tped > alyi - 0.25:
        tped = lead_in(c, alyi - 0.1, 0.15)
    plan.append((tped, 'Fped', 'he minimises the news; a beat; the pad thins to its pedal under Alyi\'s post (and his '
                               'reply, and V.O. 6): the record plays dry'))
    for i, (t0, col, why) in enumerate(plan):
        t1 = plan[i + 1][0] if i + 1 < len(plan) else stop
        dark = t0 >= e['home'] - 0.6 or (t1 > e['home'] and col != 'Fm11')
        voices, vbs = (PAD_DARK.get(col) or PAD[col]) if dark else PAD[col]
        last = i + 1 == len(plan)
        for inst, p in zip(('vc', 'vla', 'vln2', 'vln1'), voices):
            c.rebow(inst, p, t0 - (0.0 if i == 0 else 0.25), t1 + (0.3 if not last else 0.6), 0.15 if col != 'Fped'
                    else 0.19, seg=5.0, xf=1.0, first_att=0.6 if i == 0 else 0.9, last_rel=0.3, art='sus', lp=2200)
        if vbs:
            c.ch('vb', vbs, t0 + 0.05, max(1.0, t1 - t0 - 0.1), 0.22, roll=0.03, art='bowed')
        c.mark(t0, f'the pad: {col}: {why}', hit=False)
    # ---- THE DOOR on the chrome's toast: non-vibrato flute, its first note missing (D-flat, C, then G held: the #4)
    td = e['door']
    c.n('fl', 'Db5', td, 2 * Q * 0.97, 0.5, art='nv', att=0.08)
    c.n('fl', 'C5', td + 2 * Q, Q * 0.95, 0.48, art='nv')
    c.n('fl', 'G4', td + 3 * Q, max(1.8, e['home'] - (td + 3 * Q) - 0.2), 0.46, art='nv', rel=0.9)
    c.mark(td, 'DESIGNED HIT: THE DOOR on the chrome\'s toast, its first note missing (D-flat, C, then G held: its #4, '
               'no cadence), "through the door" (low-passed, one side, the room\'s reverb only); the score plays the '
               'claimed door_motif_note', hit=False)
    c.mark(e['black'], 'the beat of black: the pad holds across it (one sequence); the Door\'s G rings into it',
           hit=False)
    # ---- the afternoon: the felt on the home shot (his room); the news's tiny bed through the monitor
    th = e['home'] + 0.3
    c.pch('felt', ['F4'], th, 2.4, 0.22, roll=0.0, span_end=th + 2.3)
    c.mark(th, 'his dark room: the felt\'s F within a bar of the home shot (OST rule 7)', hit=False)
    tn = e['news']
    seq = ['Ab4', 'Eb5', 'Db5', 'Eb5', 'Ab4', 'Eb5', 'F5', 'Eb5']
    t, j = tn, 0
    while t < minimise + 0.1:
        c.n('nb_spic', seq[j % 8], t, Q * 0.35, 0.5 if j % 2 == 0 else 0.4, True)
        if j % 4 == 0:
            c.n('nb_bass', 'Db3' if (j // 8) % 2 == 0 else 'Eb3', t, Q * 1.5, 0.5, True)
        if j % 8 == 0:
            c.n('nb_timp', 'Ab3', t, 0.8, 0.45, True)
            c.n('nb_glock', 'Eb6', t + Q, 0.5, 0.4, True)
        t += Q / 2
        j += 1
    c.mark(tn, 'the news\'s tiny bed (Elgoog\'s keynote recapped under OMNI) through his monitor, under the pad; the '
               'score plays the claimed news_bed_tiny', hit=False)
    c.mark(minimise, 'he minimises it: the news\'s bed stops (the window closed); the pad goes on', hit=False)
    # ---- his face: his Water Line starts (F F G-F) and the cue stops on the downbeat where its settle would land
    vo6 = next((ln for ln in tl.lines if ln['kind'] == 'vo' and ln['on'] > e['home']), None)
    floor = max(e['face'] + 0.05, (vo6['end'] + 0.3) if vo6 else 0.0, rec_end(rec, e['face'] - 0.5))
    frag = [(-3, 'F4'), (-2, 'F4'), (-1, 'G4'), (-1 + 2.0 / 3.0, 'F4')]
    frag = [(stop + b * Q, p) for b, p in frag if stop + b * Q >= floor - 1e-6]
    for k, (t, p) in enumerate(frag):
        d = (frag[k + 1][0] - t) * 0.96 if k + 1 < len(frag) else stop - t + 0.4
        c.n('felt', p, t, d, 0.3 if k == 0 else 0.27)
        if p == 'G4':
            chip(c, 'lead', 'G4', t, 0.2, 0.32, duty=0.5, att=0.004, dec=0.25, sus=0.35, rel=0.12)
    if frag:
        c.ped.setdefault('felt', []).append((c.clk(frag[0][0] - 0.02), c.clk(stop + 0.5)))
        c.mark(frag[0][0], f'on his face: his Water Line begins ({" ".join(p for _, p in frag)}), the chip on its nudge',
               hit=False)
    c.mark(stop, 'DESIGNED STOP: the cue stops mid-phrase ON THE DOWNBEAT where the settle (C, then F) would land; '
                 'black: the midpoint act-out (THE CLOCK\'s first tick is Act Three\'s, J 0.8 s)', hit=False)
    # ---- thin: under every line the comp is softer and the brushes lighter (the lead is already out)
    V.thin(c, {'talk': dict(soften={'vibes': 0.82, 'swish': 0.85, 'brush': 0.85, 'jazz': 0.8})}, t1=hold_t)
    secs = [('A the push; the walk-on on stage; Rima\'s welcome (the band under her)', push, B('11.04')),
            ('B "keep your answers short" ... "one wo-o-ord." (the C pedal; the chip echo)', B('11.04'),
             B('11.06')),
            ('C "It\'s live..." ... "It\'s free!" (no hit on any laugh)', B('11.06'), hold_t),
            ('D Rima\'s hold and close: one held chord', hold_t, end_t),
            ('E ENDED: the pad, dry under the post; the blimp; the engineer', end_t, plan[3][0]),
            ('F the house lights up: Rima\'s close; the front row; THE DOOR; the black', plan[3][0], e['home']),
            ('G the afternoon: the felt; the news\'s bed; the pedal under the posts and V.O. 6', e['home'],
             frag[0][0] if frag else stop - 1.0),
            ('H his face: the Water Line begins; THE STOP on the downbeat', frag[0][0] if frag else stop - 1.0, stop)]
    for lab, a0, a1 in secs:
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='One Word · the demo, the pad and the stop (E02-07, Ep2 v1 Act Two sc 11-12; the midpoint '
                         'act-out)', mm='new to picture (P11 SET-PIECE SWING, light) + P01 + the Door', usage='BI',
        family='SET-PIECE SWING, light (the walk-on on stage) -> the demo\'s pad -> the Door -> DARK ROOM -> a stop',
        tone='the biggest laughs, scored straight (no hit on any punchline) -> the coverage swinging away while Rima '
             'holds her mark -> sudden quiet -> a small dry win, closed -> separately, a loss and a warmth that hurts',
        scenes=['Ep2 v1 Act Two sc 11 (11.01-11.16)', 'Ep2 v1 Act Two sc 12 (12.01-12.08)'],
        motifs=['ONE WORD on stage (the chip lead in the pockets, the violins an octave under; the echo; brass taps)',
                'the tune\'s own chip echo under the three-part "one wo-o-ord." (THE COPY is out of the demo, R2)',
                'THE DOOR, its first note missing (D-flat C | G, held: the #4), through the door',
                'his Water Line\'s first bar, cut on the downbeat before its settle'],
        motif_ids=[], key='F dorian (the tune) over a C pedal for the singing; D-flat maj9(#11) for the '
                                      'hold, the front row and the Door; F minor 11, B-flat m9, A-flat maj9 in the pad; '
                                      'the F pedal (F3 C4) in the dark room; no A-natural',
        composer='Ep2 v1 score pass (act2), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-20.5,
        album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(e['home']), t1=c.clk(stop), sfx='room_drone + server_hum (the dark room)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['post'], 'post_click: "her" (the pad holds; dry under the post)'),
            (e['door'], 'door_motif_note: CLAIMED (the Door on flute)'),
            (e['news'], 'news_bed_tiny: CLAIMED (the monitor\'s bed)'), (minimise, 'ui_minimise: the bed stops'),
            (e['phone'], 'phone_buzz_step_1: Alyi\'s post (the pedal)'))],
        audition=['the demo band is light and the show\'s own (chip, vibes, upright, brushes), never lounge, never a '
                  'cheerful corporate cue; nothing lands on a laugh',
                  '"one wo-o-ord.": the band holds; the echo under the held note is the tune\'s, not a copy',
                  'the pad is a held room, not a synth wash; the Door is through a door',
                  'the stop: his line cut on the downbeat into black, the midpoint'])
    # the fader rides (measured, then set): the hold and the Door sit under the band; his line on his face is a
    # whisper, not an out at full size
    rides = [(push - 0.2, push + 2.6, -3.0), (hold_t, end_t, -2.0), (end_t, plan[3][0], -1.0),
             (plan[3][0], e['home'], -2.0)]
    if frag:
        rides.append((frag[0][0] - 0.15, stop + 0.6, -5.5))
    macro = ride_macro(rides, c.bar1 - 1.0, stop + 1.0)
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in rides]
    sc = c.finish(T, meta, length_end=stop + 0.6, tail_s=0.3, mutes=[(stop, stop + 2.0)], macro=macro)
    c.ev = dict({k: (round(v, 3) if isinstance(v, float) else v) for k, v in e.items()}, hold_t=round(hold_t, 3),
                end_t=round(end_t, 3), pad=[(round(t, 3), col) for t, col, _ in plan],
                bars=[dict(t0=round(b['t0'], 3), sec=b['sec'], i=b['i'], chords=b['chords'], sung=b.get('sung', False))
                      for b in bars], lead=placed, frag=[(round(t, 3), p) for t, p in frag], blimp=blimp)
    return c, sc


def ride_macro(rides, t_start, t_end, ramp=0.3):
    """fader points [(t, dB)] for rides [(t0, t1, dB)] (a step per ride, each edge ramped over 2 x ramp s)"""
    lvl = lambda t: next((d for a, b, d in rides if a <= t < b), 0.0)      # noqa: E731
    pts = [(t_start, lvl(t_start))]
    for x in sorted({a for a, _, _ in rides} | {b for _, b, _ in rides}):
        pts += [(x - ramp, lvl(x - 1e-3)), (x + ramp, lvl(x + 1e-3))]
    pts.append((t_end, lvl(t_end)))
    return pts


def rec_end(rec, after):
    """the end of the first record window that starts after `after` (or `after` itself)"""
    return next((b for a, b, _ in rec if a >= after - 0.05), after)


def build_all(tl):
    out = {}
    out['darkroom'] = cue_darkroom(tl)
    out['walkon'] = cue_walkon(tl)
    out['demo'] = cue_demo(tl)
    out['blueprint'] = cue_blueprint(tl, out['demo'][0].ev['push'])
    return {k: out[k] for k in ('darkroom', 'walkon', 'blueprint', 'demo')}


def music_runs(tl):
    runs = []
    for b in tl.beats:
        m = next((c.split(': ', 1)[1] for c in b['b'].get('cues', []) if c.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


# ================================================================ lay-in
def lay(tl, built, work):
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')     # noqa: E731
    cd, cw, cb, cm = (built[k][0] for k in ('darkroom', 'walkon', 'blueprint', 'demo'))
    W0 = cb.ev['W0']
    layers = [
        dict(name=built['darkroom'][1].name, wav=wav('darkroom'), T0=cd.T0, a0=0.0, a1=cd.ev['out'] + 0.6, fin=0.0,
             fout=1.6),
        dict(name=built['walkon'][1].name, wav=wav('walkon'), T0=cw.T0, a0=cw.ev['j_in'], a1=W0 + 0.1, fin=1.0,
             fout=0.3),
        dict(name=built['blueprint'][1].name, wav=wav('blueprint'), T0=cb.T0, a0=W0 - 0.03, a1=cb.ev['zero'] + 0.05,
             fin=0.02, fout=0.005),
        dict(name=built['demo'][1].name, wav=wav('demo'), T0=cm.T0, a0=cm.ev['push'] - 0.012, a1=cm.ev['stop'],
             fin=0.004, fout=0.005),
    ]
    designed = [(cb.ev['zero'] - 0.05, cm.ev['push'] - 0.012,
                 'the tear\'s light, a beat (10.07 -> 11.01): THE PLAN\'s tape-stop reaches nothing a quarter second '
                 'before the demo\'s push (the plan: "a tape-stop into the demo cue"); the blueprint has no room bed, '
                 'the stems put a faint room tone under it'),
                (cm.ev['stop'], tl.length,
                 'THE MIDPOINT ACT-OUT (12.08): the cue stops mid-phrase on the downbeat after 2 s on his face (the plan: '
                 '"the designed stop, mid-phrase on the downbeat"); the dark room\'s room tone under the black; the '
                 're-entry is Act Three\'s THE CLOCK, its first tick J 0.8 s under this black')]
    stings = []
    return layers, designed, stings


# ================================================================ main
def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    reals = mark_real(tl)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    built = build_all(tl)
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s; real lines '
              f'(from the plan): {len(reals)}; record on screen: {len(record_windows(tl))}. Its music runs:')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m[:110] or "(no music string)"}')
        for k, (c, sc) in built.items():
            print(k, sc.name, V.note_qa(sc), f'file T0 {c.T0:.3f}')
            for t, lab, h in sorted(c.marks):
                print(f'   {t:8.3f} {"*" if h else " "} {lab[:150]}')
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
    cd, cm = built['darkroom'][0], built['demo'][0]
    res['head_momentary_max'] = V.momentary_max(mix, 0.0, 5.0)
    res['vo_windows_lufs'] = []
    from engine.mix import lufs
    for ln in tl.lines:
        if ln['kind'] == 'vo':
            i0, i1 = int(ln['on'] * SR), int(ln['end'] * SR)
            z = mix[:, i0:i1]
            res['vo_windows_lufs'].append(dict(line=ln['id'], t0=round(ln['on'], 2), t1=round(ln['end'], 2),
                                               lufs=round(lufs(z), 2) if np.abs(z).max() > 0 else None))
    res['stop_momentary_last_1s'] = V.momentary_max(mix, cm.ev['stop'] - 1.0, cm.ev['stop'])
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
    cw, cb = built['walkon'][0], built['blueprint'][0]
    sections.append(dict(section='e02-07a: the walk-on through the wall (a diegetic source, already low-passed '
                                 'and quiet)', start=round(cw.ev['j_in'], 3), end=round(cb.ev['W0'], 3), duck_db=5.0,
                         duck_why='the PA is behind a wall (nothing above 1.5 kHz) and rendered at -24: 5 dB under the '
                                  'quick talk keeps it a presence, not a hole'))
    sections.append(dict(section='e02-07b: BLUEPRINT (THE PLAN, featured)', start=round(cb.ev['W0'], 3),
                         end=round(cb.ev['zero'], 3), duck_db=4.0,
                         duck_why='P14: featured -16, -20 under the blueprint\'s lines; the cue already thins its line '
                                  'under her voice'))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
        level='underscore (each cue at its engine master: E02-06 -20, the walk-on -24 (through a wall), BLUEPRINT -18 '
              '(featured), the demo and pad -19 LUFS-I), dry of dialogue; the mixer ducks it (E02-06 7 dB, E02-07 8; '
              '`sections` duck_db: the walk-on 5, BLUEPRINT 4)',
        cues=cues,
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack or entry on a story beat; '
                           'keep its attack') for k, (c, sc) in built.items() for t, lab, h in c.marks
                      if lab.startswith('DESIGNED HIT')],
        claims_sfx=['8.02:news_desk_sting', '8.06:ui_confirm_chip', '12.03:door_motif_note', '12.05:news_bed_tiny'],
        sections=sections, real_lines=reals,
        record_on_screen=[dict(t0=round(a, 3), t1=round(b, 3), text=x) for a, b, x in record_windows(tl)],
        prelap=None, ringout=None,
        prelap_note='none: the Water Line starts whole on the act\'s first frame (a designed hit, so the mix keeps its '
                    'attack); the J under act-out 1\'s black is carried by Act One\'s ring-out (THE COPY\'s last F)',
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['news_desk_sting (8.02), ui_confirm_chip (8.06), door_motif_note (12.03), news_bed_tiny (12.05): '
                      'CLAIMED by the score (it plays them: the monitor\'s sting and bed through a small-speaker chain, '
                      'the one chip note, the Door on flute); the SFX board has none of the four',
                      'ui_drop_snap (8.04): lands on the Water Line\'s settle downbeat (the felt\'s C4); keep it dry, '
                      'off A', 'palette_step_F x3 (11.02): the score leaves them room (the lead is out there)',
                      'blimp_inflate_step x4 (11.13): the pad moves between them, never on them',
                      'stream_end_tone (11.10, NEW): the pad\'s Fm11 lands 0.3 s before it; tune it to F or C'],
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    for r in res['rows']:
        print(f'  {r["start"]:7.2f}-{r["end"]:7.2f} {r["lufs_i"]} LUFS-I {r["true_peak_dbtp"]} dBTP  {r["section"][:90]}')
    print('unmarked digital silence:', res['unmarked_digital_silence'], 'holes:',
          [h for h in res['holes_below_-60'] if not h['inside_marked']], 'undesigned fragments:',
          res['undesigned_fragments'])
    print('V.O. windows:', res['vo_windows_lufs'])


if __name__ == '__main__':
    main()
