#!/usr/bin/env python3
"""E02 v1 · ACT ONE "the séance" (sc 4, 4A, 4B, 6, 7) · the segment's score, laid on the segment's own clock (0 = its
first frame).  Four cues: E02-02 THE SÉANCE · E02-03 PROCEDURE, MARCH · E02-04 LONG-FORM · E02-05 A TENANT.

The brief (manifest.md §6; proposal.md sc 4-7, "The feeling curve" and "The seams"; script-v1.md; the lock's music
runs).  The mood map: a ghost-story giggle and courtroom comedy (4); wonder and a chill at Move 37, the act's quiet
centre; a sting, melancholy and one warm second between the two who stayed (F2.3); dry satisfaction and a warm
half-second with Gerg (4A); a growing laugh (6, unscored: the studio's padded room tone is the joke); comedy with a
chill (7).  README.md has the cue sheet (seconds, cue, what plays, why) and the measurements.

  s (EL lock)      cue                 what plays
  -1.0 -  106.3    E02-02 the séance   THE ROOM COLOUR, picked by audition (README §audition): a GLASS HARMONICA (the
                                       period séance instrument; synthesised here: a rubbed bowl that rings free when
                                       the finger lifts) in F minor over a sul-tasto bass, the chip glinting the top of
                                       each phrase.  It moves only in the gaps: it holds under every V.O., real line,
                                       ghost caption and line of his; Nole's dominant (C) under his case; the felt under
                                       his two V.O.s.  NOLE'S LAUNCH on the `!` ghost: the stack three times, each
                                       shorter (staccato trumpets, a chip booster)
  106.3 -  138.0   ·  Move 37          the room thins to the open fifth; from the stone, THE GO FIGURE (celesta + chip,
                                       straight, F C G: stones on a board); the knobs as soft pizzicato grains from
                                       "Nobody" (a human stream), straight 16ths from "Then it played itself", stopping
                                       dead when the wall freezes; THE ACHE on glass under Nole's fear
  138.0 -  152.4   ·  back             the room colour; the felt under V.O. 2; B-flat minor under "You kept them."
  152.4 -  174.0   ·  F2.3 (ERA T3)    on the smoke the glass rings free and the cut-paper chamber tier swells in on the
                                       same chord: a timpani hit on the arrival, NOLE'S LAUNCH on slow horns (its one
                                       sincere version, C F B-flat E-flat, the A-flat never comes), the upper strings
                                       leaving one by one as the room turns back to work; under the look, THE DOOR on
                                       non-vibrato flute, its first note missing, ending on its held sharp-4
  174.0 -  193.0   ·  back             the glass returns on the Door's own G; his fanfare stops one note short on his
                                       exit; the room's F minor returns only when he's gone: THE LAST CHORD, struck
                                       before the candle and ringing free from the blow into E02-03
  192.75 - 226.6   E02-03 procedure    PROCEDURE: low strings sul tasto (B-flat minor), a spiccato pulse and dry snare
                                       taps; thin to the pedal under the reading (the record plays dry); a step warmer
                                       as he sits; the warm half-second on Gerg's laptop (muted horns, the chip's
                                       triangle, the Build's "shipped" tag); F7sus(b9) left hanging under the invite
  226.6 -  234.2   (designed rest)     none under the read (V.O. 3): the boardroom's room tone
  234.2 -  238.9   E02-04 long-form    an original podcast-intro sting, J 0.8 s under the card settling: a brush swell,
                                       a push 0.25 s before the cut, a vibes question (C E-flat G, the chip on its top),
                                       left hanging on D-flat(#11) under XEL's first words
  238.9 -  315.8   (designed rest)     no score in the studio: the padded room tone is the joke; the hops are SFX
  315.8 -  364.0   E02-05 a tenant     SET-PIECE SWING, low, on the split (a swung push 0.2 s before it): walking bass,
                                       brushes, the chip lead leading us down (out under his recorded voice); the
                                       basement leaves his POV (no chip, no felt): Tasya's Rhodes on the beats, then ONE
                                       Rhodes chord under the welcome (his "G B-flat C E-flat over F"), a hold on the
                                       Ache under "We keep a spare." (no comic scoring), the pan up on Tasya's floor
                                       (A-flat -> C -> E -> A-flat); home on Mas: the felt's flat line and its nudge,
                                       and THE COPY, his line on the chip a beat late, which finishes the line he
                                       doesn't; the key ring's jangle on the downbeat; the copy's last F rings into the
                                       black (render/music-el-ringout.wav carries it under Act Two's head)

Every sync point comes from the lock (beats, lines and their words, sounds), so the score re-lays itself when timing
moves.  Chord changes that land on cuts pre-lap them by the latest beat or swung and at least 0.15 s before the cut
(about 0.25 s); a change never lands inside a V.O., a real line, a ghost caption or a line of his (it moves before).
Real lines come from the beat plan's [P]/[V]/[K] notes (the lock prints no quotes, so the engine's own test finds none).

Rules (manifest.md §6, LEARNINGS S1-S3, S9; OST-BIBLE §0): the 96 BPM grid; the knee's cells; chip in every cue; no
A-natural anywhere; the knee never whole; no comic scoring (holds, a stop that's a designed rest, a size too big); no
Mickey-Mousing (the knocks, the crash, the slap, the clicks, the mic's hops are SFX and the score never doubles them);
continuous per sequence, two designed rests (marked: silences_designed); designed hits marked.

Run (from the repo root; a render is heavy: OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --dry --el          # runs, marks, note QA
    MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --assemble --el     # re-lay render/_work/el, measure
    ... --audition --el                    # the séance's two 30 s room-colour samples (render/_work/audition/)
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                    # the segment checks
Out: render/music[-el].wav (the segment's exact length), render/music-el-prelap.wav (the J 1.0 s under the card),
render/music-el-ringout.wav (THE COPY into Act Two's head), cues[-el].json.  Nothing here has been listened to.
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
from engine.render import Track   # noqa: E402
from engine.arrange import CREDIT_SYN   # noqa: E402
from engine.core import SR, midi_hz, bp, hp, to_stereo   # noqa: E402

SEG = 'act1'
Q, BAR, S16 = V.Q, V.BAR, V.S16
SW = Q * 2.0 / 3.0                     # the house swing: the and lands 10 frames after its beat
PLAN = os.path.join(V.REPO, 'show', 'episodes', 'ep02', 'production', 'v1', 'beat-plan', 'act1.json')


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


# ================================================================ the lock: real lines, captions, events
_PLAN = None


def plan_lines():
    global _PLAN
    if _PLAN is None:
        _PLAN = {}
        try:
            for b in json.load(open(PLAN))['beats']:
                for ln in b.get('lines', []) or []:
                    _PLAN[ln['id']] = ln
        except (OSError, ValueError, KeyError):
            pass
    return _PLAN


def mark_real(tl):
    """Ep2's lock prints no quotation marks and its takes carry no source tag, so v3lib's test classes every line as
    talk.  The beat plan's `note` carries the tag ([P ...] public record, [V ...] verbatim, [K ...] confirmed): those
    lines are real (the record plays dry: melody and hits out, no chord change under them)"""
    pl = plan_lines()
    out = []
    for ln in tl.lines:
        note = (pl.get(ln['id'], {}).get('note') or '').lstrip()
        if note.startswith(('[P', '[V', '[K')) and ln['kind'] != 'vo':
            ln['kind'] = 'real'
            out.append(ln['id'])
    return out


def caption_windows(tl):
    """the real quotes on screen (a ghost's email header, the cow's crop): (t0, t1, text)"""
    out = []
    for b in tl.beats:
        for o in b['b'].get('onscreen', []) or []:
            if any(q in (o.get('text') or '') for q in '"“”'):
                a = b['t0'] + (o.get('at') or 0.0)
                e = b['t0'] + (o['until'] if o.get('until') is not None else b['t1'] - b['t0'])
                out.append((a, e, o['text'][:48]))
    return sorted(out)


def merge(ws):
    out = []
    for a, b in sorted(ws):
        if out and a <= out[-1][1]:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return [(a, b) for a, b in out]


def still_windows(tl, kinds=('mas', 'vo', 'real'), caps=True):
    """where the score doesn't move: his lines, the V.O., real lines and real captions (0.1 s before each, 0.05 after)"""
    w = [(ln['on'] - 0.1, ln['end'] + 0.05) for ln in tl.lines if ln['kind'] in kinds]
    if caps:
        w += [(a - 0.1, b) for a, b, _ in caption_windows(tl)]
    return merge(w)


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


def _word(tl, ln, word, default):
    try:
        return tl.W(ln['id'], word) if ln else default
    except KeyError:
        return default


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


def how(c, t, cut):
    """what a pre-lap is, in words"""
    k = (t - c.bar1) / Q
    kind = 'on the beat' if abs(k - round(k)) < 0.02 else 'on a swung and'
    return f'{kind}, {cut - t:.2f} s before the cut'


def change_at(c, t, ws, floor=-1e9):
    """a change at t, moved out of any still window: to the latest beat at least 0.2 s before the window, or (when that
    would cross the previous change) to the first beat after it"""
    for _ in range(6):
        w = inside(t, ws)
        if not w:
            return t
        early = lead_in(c, w[0], min_lead=0.2, swung=False)
        t = early if early is not None and early > floor + Q else c.next_beat(w[1] + 0.1)
    return t


# ================================================================ THE GLASS HARMONICA (synthesised)
def armonica_fn(n, rng):
    """the glass harmonica: a wet finger on a turning glass bowl.  A soft rub swell (x att), a nearly pure tone with
    a little 2nd and 3rd harmonic while the finger rubs (no 5th: no A over an F), the bowl's turning tremolo, a faint
    rub noise at the fundamental, a slow beat against its neighbour bowl; when the finger lifts the bowl rings free,
    pure, for x ring seconds (the instrument's own release: the ring is the cue's soft exit)."""
    x = n.x
    f0 = midi_hz(n.pitch)
    gate = max(0.06, float(n.dur))
    att = float(x.get('att', 0.16))
    ring = float(x.get('ring', 1.5 if f0 < 600 else 1.15))
    tail = ring * 5.0
    N = int((gate + tail) * SR)
    t = np.arange(N) / SR
    u = np.clip(t / att, 0.0, 1.0)
    swell = 0.5 - 0.5 * np.cos(np.pi * u)
    tg = np.minimum(t, gate)
    press = 1.0 - 0.1 * (1.0 - np.exp(-tg / 3.0)) + 0.03 * np.sin(2 * np.pi * 0.21 * tg + rng.uniform(0, 6.28))
    free = np.where(t < gate, 1.0, np.exp(-(t - gate) / ring))
    env = swell * press * free
    rubbing = swell * np.where(t < gate, 1.0, np.exp(-(t - gate) / 0.07))
    rot = rng.uniform(2.3, 3.4)
    trem = 1.0 + 0.045 * np.sin(2 * np.pi * rot * t + rng.uniform(0, 6.28)) * np.where(t < gate, 1.0, 0.35)
    beat = rng.uniform(0.45, 0.85)
    f1 = f0 + beat
    ph = rng.uniform(0, 6.28, 4)
    main = np.sin(2 * np.pi * f0 * t + ph[0])
    partner = np.sin(2 * np.pi * f1 * t + ph[1])
    harm = 0.09 * np.sin(2 * np.pi * 2 * f0 * t + ph[2]) + 0.025 * np.sin(2 * np.pi * 3 * f0 * t + ph[3])
    bowl = 0.012 * np.exp(-t / 0.3) * np.sin(2 * np.pi * 2.70 * f0 * t)
    nr = min(N, int((gate + 0.3) * SR))
    noise = np.zeros(N)
    if nr > 64:
        z = rng.standard_normal(nr)
        noise[:nr] = bp(z, f0 * 0.95, f0 * 1.05, order=2) * 0.05
    left = env * trem * (main + 0.45 * partner) + rubbing * (harm + noise) + bowl * swell
    right = env * trem * (0.85 * main + 0.6 * partner) + rubbing * (0.9 * harm + noise) + bowl * swell
    lvl = 10 ** (-24.0 * (1.0 - float(n.vel)) / 20.0) * 0.2
    return (np.stack([left, right]) * lvl).astype(np.float32)


def glass_track(name, gain_db, pan, sends):
    return Track(name=name, src=('fn', armonica_fn), stem='perc', gain_db=gain_db, pan=pan, width=0.9, sends=sends,
                 hum_ms=4, rel=0.1, credit=CREDIT_SYN)


def glass_shelf(spans, f=1000.0, cut_db=-5.0, ramp=0.25):
    """the glass while voices sound: a dynamic high shelf, cut_db above about f Hz (the bowls' rubbed 2nd and 3rd
    harmonics, a top bowl's fundamental: the voices' 1-4 kHz), in and out over `ramp` s around each line (spans: file
    seconds).  The score review (2026-10-09): the room colour sat at -27 to -30 dBFS in 1-4 kHz under the talk"""
    def post(buf):
        x = to_stereo(np.asarray(buf, dtype=np.float64))
        n = x.shape[1]
        env = np.zeros(n)
        for a, b in spans:
            i0, i1 = max(0, int(a * SR)), min(n, int(b * SR))
            if i1 > i0:
                env[i0:i1] = 1.0
        k = max(1, int(ramp * SR))
        cs = np.concatenate([[0.0], np.cumsum(env)])
        lo, hi_ = np.clip(np.arange(n) - k // 2, 0, n), np.clip(np.arange(n) + k // 2, 0, n)
        env = (cs[hi_] - cs[lo]) / np.maximum(1, hi_ - lo)
        y = x - (1.0 - 10 ** (cut_db / 20.0)) * env[None] * hp(x, f, 2)
        return y.astype(np.float32)
    return post


# ================================================================ E02-02 THE SÉANCE
# the room colour's harmony: (the glass's voicing, above the voices' core; the bass root and fifth, sul tasto)
SEANCE = {
    'Fm9':       (['Ab4', 'C5', 'G5'], 'F2', 'C3'),        # Fm(add9): the room's home
    'Dbmaj9#11': (['F4', 'C5', 'G5'], 'Db2', 'Ab2'),       # the post is out: the room tilts to D-flat
    'Bbm9':      (['C5', 'F5', 'Ab5'], 'Bb1', 'F2'),         # (9, 5, 7: no bowl over A-flat5; its C6 sat in the
    #                                                          voices' band under the ghost email, "we keep everything."
    #                                                          and "You sat at the back": the score review, 2026-10-09)
    'C7sus':     (['Bb4', 'Db5', 'F5'], 'C2', 'G2'),       # Nole's dominant (C7sus(b9)): pushing, never landing
    'C11b9':     (['Ab4', 'Db5', 'F5'], 'C2', 'G2'),       # B-flat minor over his C: his case
    'Open5':     (['F4', 'C5'], 'F2', 'C3'),               # the Go board: the open fifth, no third
    'Ache':      (['G4', 'Db5'], 'F2', 'C3'),              # THE ACHE (D-flat + G over F): his fear, on glass
}
LINE = {   # the glass's phrase in each colour (half notes): built from the knee's step and its neighbours
    'Fm9': ['C5', 'Db5', 'C5'],            # the sigh: the Ache's D-flat over the fifth
    'Dbmaj9#11': ['G5', 'F5', 'C5'],       # the sharp-4 falling to the 7th
    'Bbm9': ['F5', 'Eb5', 'Db5'],
    'C7sus': ['Db5', 'C5', 'Bb4'],         # the flat 9 sinking
    'C11b9': ['Ab4', 'G4', 'F4'],
}
BUILD_F = ['F4', 'F4', 'G4', 'Ab4', 'C5', 'Ab4', 'G4', 'F4']       # Gerg's Build (OST §2.6), a pass of up to 8
LINE2 = {  # the second phrase in a long colour: the same cells turned round
    'Fm9': ['G5', 'Ab5', 'G5'], 'Dbmaj9#11': ['C5', 'Eb5', 'F5'], 'Bbm9': ['C5', 'Db5', 'F5'],
    'C7sus': ['F5', 'Eb5', 'Db5'], 'C11b9': ['Db5', 'C5', 'Ab4'],
}
STONES = ['F5', 'C6', 'G5', 'C5', 'F4', 'C5', 'G4', 'F5', 'C6', 'G5', 'F5', 'C5']      # the Go figure: F C G only
STONE_MASK = [[1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0], [1, 0, 1, 0, 0, 0, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0]]
GRAINS_HUMAN = ['F5', 'G5', 'Ab5', 'C6', 'Db6', 'Eb5', 'C5', 'G5']     # people's games: every pitch of the cell
GRAINS_SELF = ['F5', 'C6', 'G5', 'C6', 'F5', 'G5', 'C6', 'Db6']        # its own games: tighter, quantised


def tracks_seance(colour='glass', shelf=None):
    T = palette()
    T['arm'] = glass_track('arm', -3.0, -0.1, {'hall': -9, 'room': -16})          # the chords (the room)
    T['arm_lead'] = glass_track('arm_lead', -2.0, 0.18, {'hall': -8, 'room': -16})  # the phrase (the medium's call)
    if shelf is not None:                                                          # the glass under the voices
        T['arm'].post = shelf
        T['arm_lead'].post = shelf
    T['reed'].gain_db, T['reed'].sends = -7.0, {'hall': -10, 'room': -14}      # (audition b: the low reed pad)
    T['celesta'].gain_db, T['celesta'].sends = -4.0, {'hall': -8}
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -2.0, {'room': -14, 'snes': -14}, [('hp', 220), ('lp', 5200)]
    T['lead2'].gain_db, T['lead2'].sends, T['lead2'].eq = -1.0, {'room': -12, 'snes': -12}, [('lp', 6000)]
    T['noise'].gain_db = -14.0
    for k in ('vc', 'cb'):
        T[k].gain_db, T[k].sends = -2.0, {'hall': -11, 'room': -16}
        T[k].eq = list(T[k].eq) + [V.PIZZ_NOTCH]
    T['vln_pizz'].gain_db, T['vln_pizz'].sends, T['vln_pizz'].hum_ms = -6.0, {'hall': -10, 'room': -14}, 9.0
    T['felt'].gain_db, T['felt'].sends = -4.0, {'room': -12, 'hall': -16}
    T['felt_mech'].gain_db = -18.0
    # F2.3: the cut-paper chamber tier (its own band-limit: the memory's paper)
    for src, nm_ in (('vln1', 'c_vln1'), ('vln2', 'c_vln2'), ('vla', 'c_vla'), ('vc', 'c_vc'), ('cb', 'c_cb')):
        dup(T, src, nm_, gain_db=-1.0, sends={'hall': -9, 'room': -16},
            eq=list(T[src].eq) + [('lp', 6500)] + ([V.PIZZ_NOTCH] if src in ('vc', 'cb') else []))
    T['hn'].gain_db, T['hn'].sends, T['hn'].eq = -1.0, {'hall': -7}, [('lp', 6500)]
    T['timp'].gain_db = -5.0
    T['fl'].gain_db, T['fl'].pan, T['fl'].sends, T['fl'].eq = 1.0, -0.5, {'room': -9}, [('lp', 2600), ('hp', 300)]
    T['tpt'].gain_db, T['tpt'].sends, T['tpt'].latency_ms = -5.0, {'hall': -10, 'room': -12}, 12
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 880, -6.0, 4.0)]                # no A-ish resonance under F
    return T


def seance_events(tl):
    e = dict(end=tl.B('4A.01') if tl.has('4A.01') else tl.length)
    e['click'] = _snd(tl, '4.02', 'post_click', tl.B('4.02') + 0.4)
    e['knock1'] = _snd(tl, '4.06', 'ceiling_knock', tl.E('4.06') - 2.1)
    e['burst'] = _snd(tl, '4.07', 'ceiling_burst', tl.B('4.07'))
    e['lamp'] = _snd(tl, '4.15', 'lamp_click', tl.B('4.15') + 0.22)
    e['post_rise'] = _snd(tl, '4.15', 'reverse_swell_1beat', tl.B('4.15') + 1.7)
    e['slap'] = _snd(tl, '4.17', 'phone_clack_floor', tl.B('4.17') + 0.22)
    e['stone'] = _snd(tl, '4.19', 'go_stone_click', tl.B('4.19') + 2.93)
    e['snuff'] = _snd(tl, '4.27', 'candle_snuff', tl.B('4.27') + 0.57)
    e['sweep_in'] = _snd(tl, '4.27', 'render_front_sweep', tl.E('4.27') - 0.9)
    e['hatch'] = _snd(tl, '4.30', 'hatch_slide_shut', tl.E('4.30') - 1.0)
    e['sweep_out'] = _snd(tl, '4.33', 'render_front_sweep', tl.B('4.33') + 0.22)
    e['rocket'] = _snd(tl, '4.35', 'rocket_roar', tl.B('4.35') + 2.2)
    e['blow'] = _snd(tl, '4.36', 'candle_blow', tl.B('4.36') + 0.5)
    L = dict(vo1=_line(tl, 'e2-vo-01', 'mas', tl.B('4.02') + 3.0), vo2=_line(tl, 'e2-vo-02', 'mas', tl.B('4.25') + 2.0),
             nobody=_line(tl, 'e2-a1-0056', 'gerg', tl.B('4.22') + 6.0),
             fear=_line(tl, 'e2-a1-0024', 'nole', tl.B('4.23') + 0.2),
             court=_line(tl, 'e2-a1-0030', 'nole', tl.B('4.35') + 0.4),
             mas_knock=_line(tl, 'e2-a1-0004', 'mas', tl.B('4.06') + 0.5))
    e['stream'] = _word(tl, L['nobody'], 'Nobody', tl.B('4.22') + 6.0)
    e['selfplay'] = _word(tl, L['nobody'], 'Then', e['stream'] + 7.3)
    gend = L['nobody']['end'] if L['nobody'] else e['selfplay'] + 3.0
    e['freeze'] = min(gend + 0.08, tl.B('4.23') - 0.12) if tl.has('4.23') else gend + 0.08
    return e, L


def cue_seance(tl, colour='glass', end_at=None):
    """E02-02: the room colour (glass, or the audition's celesta-over-reed), Move 37, F2.3, the exit and the last chord.
    end_at: build only up to that time (the 30 s audition samples)"""
    e, L = seance_events(tl)
    stone = e['stone']
    end = e['end']
    ab = int(math.ceil((stone + 2.0) / BAR)) + 1                 # bar 1 before the J (-1.0 s): the stone is a downbeat
    name = 'e02-02-the-seance' + ('' if end_at is None else f'-audition-{colour}')
    c = V.Cue(name, tl, anchor=stone, anchor_bar=ab, bars=int((end + 6.0 - (stone - BAR * (ab - 1))) / BAR) + 2,
              swing=0.0)
    voice_spans = merge([(ln['on'] - 0.3, ln['end'] + 0.2) for ln in tl.lines if ln['on'] < end + 1.0])
    T = tracks_seance(colour, shelf=glass_shelf([(a - c.T0, b - c.T0) for a, b in voice_spans]) if colour == 'glass'
                      else None)
    glass = colour == 'glass'
    PADI, LEADI = ('arm', 'arm_lead') if glass else ('reed', 'celesta')
    stop = end_at if end_at is not None else 1e9
    W = still_windows(tl)
    caps = caption_windows(tl)
    B = lambda bid, d=0.0: tl.B(bid) if tl.has(bid) else d   # noqa: E731

    def cut(bid):
        return lead_in(c, B(bid))

    # ---- the harmonic plan: (time, colour, why); each change pre-laps its cut and is moved out of still windows
    plan = [(-1.0, 'Fm9', 'the arrival: the room colour already playing (J 1.0 s under the card), the hands joined')]
    t_vo1 = L['vo1']['on'] if L['vo1'] else 5.7
    plan.append((min(c.next_beat(e['click'] + 0.75), lead_in(c, t_vo1, 0.6, swung=False)), 'Dbmaj9#11',
                 'after his click: the post is out, the room tilts to D-flat (his V.O. sits inside it)'))
    plan += [(cut('4.03'), 'Bbm9', 'his question, the procedure'),
             (cut('4.04'), 'C7sus', 'ghost 1 rises (the dominant; it thins under the caption and the Yup)'),
             (cut('4.05'), 'Fm9', 'Gerg, quietly: "He signed it."'),
             (cut('4.06'), 'Dbmaj9#11', '"one knock if we promised a nonprofit."'),
             (cut('4.07'), 'C7sus', 'NOLE drops in: his dominant, C, under his case'),
             (cut('4.09'), 'C11b9', 'his case (the scene\'s one speech): B-flat minor over his C, pushing'),
             (cut('4.10'), 'C7sus', '"spirit, what did we call it?": OPEN, Nole\'s hope; NOPE gets no hit'),
             (cut('4.13'), 'Fm9', 'the cow (the room\'s F minor under the crop; thin)'),
             (cut('4.15'), 'C7sus', 'the lamp: Nole\'s Launch, three times, each shorter'),
             (cut('4.16'), 'Bbm9', 'ghost 3, DEC 2018 (thin under the header and "billions")'),
             (cut('4.18'), 'C7sus', '"That was a different me." (after the slap: no hit on it)'),
             (cut('4.19'), 'Open5', 'Move 37: the room thins to the open fifth'),
             (cut('4.23'), 'Ache', 'the fear: THE ACHE on glass, the wall frozen'),
             (cut('4.24'), 'Fm9', 'back to the room colour ("We had a blog.")'),
             (cut('4.25'), 'Bbm9', 'ghost 3 again, V.O. 2 (the felt), "You kept them." held into the smoke'),
             (cut('4.33'), 'Dbmaj9#11', 'back from 2018: the glass on the Door\'s own G (the same chord)'),
             (cut('4.34'), 'Bbm9', '"You sat at the back."'),
             (cut('4.35'), 'C7sus', '"Keep that too. See you in court." and his fanfare'),
             (cut('4.36'), 'Fm9', 'THE LAST CHORD: F minor returns when he is gone; rings free from the blow')]
    H, floor = [], -1e9
    for t, col, why in plan:
        t2 = t if t < 0 else change_at(c, t, W, floor)
        if H and t2 <= H[-1][0] + 0.6:          # two changes can't crowd: drop the earlier one's colour
            H.pop()
        H.append((t2, col, why))
        floor = t2
    f23_in, f23_out = e['snuff'], cut('4.33')            # the glass rests through F2.3 (it rings free on the snuff)
    pad_drop = (L['mas_knock']['end'] + 0.12) if L['mas_knock'] else None   # "the room colour drops to its pad"
    # ---- the top bowl lifts under his lines (on camera and V.O.) and the real ones (the record): it lets go 0.6 s
    # before the line with a short ring and is re-rubbed after it (the score review, 2026-10-09: the room colour sat in
    # the voices' 1-4 kHz under the ghost email, "is there anyone here...", "we keep everything.")
    lifts = merge([(ln['on'] - 0.6, ln['end'] + 0.15) for ln in tl.lines if ln['kind'] in ('real', 'mas', 'vo')])

    def top_pieces(a, b):
        out, t = [], a
        for h0, h1 in lifts:
            if h1 <= t or h0 >= b:
                continue
            if h0 - t >= 1.0:
                out.append((t, h0, True))
            t = max(t, h1)
        if b - t >= 1.0:
            out.append((t, b, False))
        return out
    n_lift = 0
    # ---- the chords and the bass
    for i, (t0, col, why) in enumerate(H):
        if t0 >= stop:
            break
        t1 = H[i + 1][0] if i + 1 < len(H) else e['blow']
        last = i + 1 == len(H)
        if t0 < f23_in < t1:
            t1 = f23_in
        if t0 >= f23_in and t0 < f23_out - 0.05:
            continue
        voic, root, fifth = SEANCE[col]
        gate_end = min(t1 + (0.0 if last or t1 == f23_in else 0.35), stop)
        if last:
            gate_end = e['blow']
        vel = 0.5 if col not in ('Open5', 'Ache') else (0.36 if col == 'Open5' else 0.44)
        att = 1.0 if t0 < 0 else (0.5 if col != 'Ache' else 0.9)
        ring = 2.6 if last else (2.2 if t1 == f23_in else None)
        # the bowls enter one by one, lowest first (an armonica player's rub, not a sampler's block chord), unless
        # that would put an attack inside a line of his, a V.O., a real line or a caption
        stag = 0.3 if (t0 > 0 and col not in ('Open5', 'Ache') and not inside(t0 + 0.65, W)
                       and not inside(t0 + 0.35, W)) else 0.0
        for k, p in enumerate(voic):
            ps = p if glass else nm(p) - 12
            tp, gp = t0 + k * stag, gate_end
            if pad_drop and t0 < pad_drop < t1 and k < len(voic) - 1:
                gp = pad_drop                         # the pad: only the top voice holds through the knocks
            x = dict(att=att) if glass else {}
            if glass and ring:
                x['ring'] = ring
            if glass and k == len(voic) - 1 and len(voic) > 1:
                pcs = top_pieces(tp, gp)
                n_lift += sum(1 for _, _, lift in pcs if lift) + (1 if not pcs else 0)
                for j, (a_, b_, lift) in enumerate(pcs):
                    xx = dict(x, att=0.7) if (j or a_ > tp + 0.01) else dict(x)
                    if lift:
                        xx['ring'] = 0.3
                    c.n(PADI, ps, a_, max(0.2, b_ - a_), vel * 0.92 * (0.9 if xx.get('att') == 0.7 else 1.0), **xx)
                continue
            # the glass breathes: on a long chord the middle bowl is re-rubbed every two bars, never under a still line
            cuts = [tp]
            if glass and k == 1 and gp - tp > 7.0:
                r = tp + 2 * BAR
                while r < gp - 2.0:
                    if not inside(r, W) and not inside(r + 0.4, W):
                        cuts.append(r)
                    r += 2 * BAR
            for j, a_ in enumerate(cuts):
                b_ = cuts[j + 1] + 0.18 if j + 1 < len(cuts) else gp
                xx = dict(x, att=0.7) if j else x
                c.n(PADI, ps, a_, max(0.2, b_ - a_), vel * (0.92 if k else 1.0) * (0.9 if j else 1.0), **xx)
        b0, b1 = max(t0 - 0.3, -1.0), min(t1 + 0.35, stop)
        brel = 2.2 if last else (0.9 if t1 == f23_in else 0.3)
        if last:
            b1 = e['blow'] + 0.1
        c.rebow('cb', root, b0, b1, 0.15, seg=5.0, xf=0.8, first_att=0.9 if t0 > 0 else 1.2, last_rel=brel,
                art='sus', lp=900)
        c.rebow('vc', fifth, b0 + 0.15, b1, 0.14, seg=5.0, xf=0.8, first_att=1.0, last_rel=brel, art='sus', lp=1100)
        c.mark(t0, f'{col}: {why}', hit=False)
    # ---- the glass's phrase, in the gaps (one per colour; out under every still window; softer under talk)
    talk = merge([(ln['on'] - 0.1, ln['end'] + 0.05) for ln in tl.lines if ln['kind'] == 'talk'])
    stack_t0 = c.next16(max(e['lamp'] + 0.4, B('4.15') + 0.6))            # Nole's three stacks (below)
    fan_t0 = c.next16((L['court']['end'] + 0.08) if L['court'] else e['rocket'] - 0.1)   # his exit's fanfare
    busy = [(stack_t0 - 0.3, stack_t0 + 2.4), (fan_t0 - 0.4, fan_t0 + 1.2)]     # a phrase never crosses them,
    ticks = tl.snd_any('planchette_letter_tick', B('4.10') - 0.1, B('4.11'))      # nor the board's spellings (OPEN,
    if ticks:                                                                    # NOPE: no comic scoring) ...
        busy.append((ticks[0] - 0.3, ticks[-1] + 0.6))
    nope = _snd(tl, '4.11', 'planchette_glide', B('4.11') + 3.0)
    busy.append((nope - 0.4, tl.E('4.12') if tl.has('4.12') else nope + 6.0))     # NOPE to the three hands: held
    busy.append(((pad_drop if pad_drop else e['knock1'] - 1.4), e['burst'] + 1.2))  # the knocks: the colour's pad
    busy.append((e['slap'] - 0.6, e['slap'] + 1.6))                                 # the slap: his hand doesn't move
    yup2 = _line(tl, 'e2-a1-0018', 'ghost-nole', B('4.18') + 8.6)                  # Nole's held beat, "...Yup.": held
    if yup2:
        busy.append((yup2['on'] - 2.4, yup2['end'] + 0.4))
    for lid, near in (('e2-a1-0007', B('4.08') + 4.2), ('e2-a1-0016', B('4.18') + 4.5)):   # ... nor Gerg's Build
        g = _line(tl, lid, 'gerg', near)
        if g:
            busy.append((g['on'] - 0.2, g['end'] + 0.2))
    n_ph = 0
    for i, (t0, col, why) in enumerate(H):
        t1 = H[i + 1][0] if i + 1 < len(H) else e['blow']
        if t0 < f23_in < t1:
            t1 = f23_in - 0.4                     # the phrase ends before the smoke
        if col not in LINE or t0 >= stop or (f23_in - 1.0 <= t0 < f23_out) or i + 1 == len(H):
            continue
        t = c.next_beat(max(t0 + Q, 0.5))
        placed_in_span = 0
        while t < t1 - 2.6:
            nts = LINE[col]
            span = [t + j * 2 * Q for j in range(len(nts))]
            nxt_busy = min([a for a, b in busy if a > span[-1]] + [1e9])
            hold_end = min(t1 + 0.2, span[-1] + 3.2, stop, nxt_busy - 0.1)
            ends = span[1:] + [hold_end]
            clear = not any(inside(tt, W) or inside(tt + 2 * Q * 0.9, W) for tt in span)
            clear = clear and not any(a < hold_end and b > span[0] for a, b in busy)
            if clear and hold_end - span[-1] > 0.8:
                if placed_in_span:
                    nts = LINE2[col]
                soft = 0.72 if any(inside(tt, talk) for tt in span) else (0.78 if t0 < 0 else 1.0)
                for j, (p, a_, b_) in enumerate(zip(nts, span, ends)):
                    ps = p if glass else nm(p) + 12
                    x = dict(att=0.22) if glass else {}
                    c.n(LEADI, ps, a_, b_ - a_ + (0.05 if glass else 0.0), 0.56 * soft * (1.0 if j else 1.05), **x)
                    # the chip shadows the glass an octave up, short and soft: its stamp on the room (the duty narrows)
                    lastn = j == len(nts) - 1
                    c.n('lead2', nm(p) + 12, a_ + 0.02, 0.3 if lastn else 0.16, (0.36 if lastn else 0.31) * soft, True,
                        duty=(0.25, 0.125, 0.125)[j % 3], att=0.002, dec=0.09, sus=0.3 if lastn else 0.2,
                        rel=0.25 if lastn else 0.08)
                c.mark(t, f'the glass\'s phrase ({col}: {" ".join(nts)}), the chip shadowing it an octave up', hit=False)
                n_ph += 1
                placed_in_span += 1
                if placed_in_span >= 2 or t1 - t0 < 9.0:      # a long colour gets a second phrase, turned round
                    break
                t = span[-1] + 2 * BAR
                continue
            t += Q
    # ---- the felt under his two V.O.s (his room, inside the bed: soft entries, nothing attacks under the words)
    for key, ps in (('vo1', ['F3', 'C4']), ('vo2', ['Db4', 'F4'])):
        ln = L[key]
        if ln and ln['on'] < stop:
            t = lead_in(c, ln['on'], 0.3, swung=False)
            c.pch('felt', ps, t, ln['end'] - t + 0.8, 0.13, roll=0.03)
            c.mark(t, f'the felt under V.O. {key[-1]} ({" + ".join(ps)}): his room, inside the bed', hit=False)
    c.top_lifts = n_lift
    if end_at is not None:
        return _finish_seance(c, T, tl, e, H, end_at, colour)

    # ---- NOLE'S LAUNCH on the `!` ghost: the stack three times, each shorter (staccato trumpets, the chip's booster)
    t = stack_t0
    for k, cnt in enumerate((4, 3, 2)):
        for j, p in enumerate(['C4', 'F4', 'Bb4', 'Eb5'][:cnt]):
            tj = t + j * S16
            lastn = j == cnt - 1
            c.n('tpt', p, tj, S16 * (1.6 if lastn else 0.8), 0.5 - 0.05 * k, art='stac',
                **({'bend': [(0.05, 0.0), (0.24, -2.5)]} if lastn else {}))
        c.n('noise', 'C5', t, 0.07, 0.3, True, clock=12000.0, short=True, dec=0.05, sus=0.0, rel=0.03)
        if k == 0:
            c.n('timp', 'C2', t, 0.8, 0.3)
        c.mark(t, f'NOLE\'S LAUNCH, stack {k + 1} of 3 ({cnt} notes; it falls off one note short)')
        t = c.next16(t + (cnt + 2) * S16)
    # ---- GERG'S BUILD under his typing lines ("It's a blog post.", "Same email address, though.": his keys, not
    # looking up): a soft compile pass of 4, then 8 (straight 16ths, the chip at 25 %), out before anyone else speaks
    for lid, near in (('e2-a1-0007', B('4.08') + 4.2), ('e2-a1-0016', B('4.18') + 4.5)):
        g = _line(tl, lid, 'gerg', near)
        if not g:
            continue
        t = c.next16(g['on'] + 0.05)
        for cnt in (4, 8):
            if t + cnt * S16 > g['end'] + 0.1:
                break
            for j in range(cnt):
                c.n('lead', BUILD_F[j], t + j * S16, S16 * 0.62, 0.32 * (1.0, 0.72, 0.84, 0.72)[j % 4], True,
                    duty=0.25, att=0.002, dec=0.09, sus=0.45, rel=0.035)
            t = c.next16(t + cnt * S16 + 0.3)
        c.mark(c.next16(g['on'] + 0.05), f'GERG\'S BUILD under his own line ({lid}): typing, not looking up (4, then 8)',
               hit=False)
    # ---- MOVE 37: the Go figure (celesta + chip, straight), from the beat after the stone to the freeze
    t = stone + Q
    k = 0
    while t < e['freeze'] - 0.05:
        b = int(math.floor(c.bar_of(t) + 1e-6))
        step = int(round((t - c.bar(b)) / (Q / 2))) % 8
        if STONE_MASK[b % 4][step]:
            p = STONES[k % len(STONES)]
            soft = 0.75 if inside(t, talk) else 1.0
            c.n('celesta', p, t, 0.6, 0.34 * soft)
            c.n('lead', p, t, 0.11, 0.4 * soft, True, duty=0.25 if k % 3 else 0.125, att=0.002, dec=0.06, sus=0.15,
                rel=0.06)
            k += 1
        t += Q / 2
    c.mark(stone + Q, 'THE GO FIGURE: the beat after the stone (the SFX owns the click): celesta + chip, F C G')
    # the knobs: a human stream (irregular, every pitch of the cell) from "Nobody", its own games (straight 16ths) from
    # "Then it played itself", stopping dead when the wall freezes
    rng = np.random.default_rng(37)
    t = c.next16(e['stream'])
    i = 0
    while t < e['freeze'] - 0.03:
        selfp = t >= e['selfplay'] - 0.02
        if rng.random() < (0.82 if selfp else 0.46):
            if selfp:                                   # its own games: quantised, a tighter set, locked to the grid,
                c.n('vln_pizz', GRAINS_SELF[i % 8], t, 0.12, 0.21, True)       # and the machine's own voice on them
                c.n('lead', GRAINS_SELF[i % 8], t, 0.07, 0.32, True, duty=0.125, att=0.002, dec=0.05, sus=0.1, rel=0.04)
            else:                                       # people's games: any pitch of the cell, loose, uneven
                c.n('vln_pizz', GRAINS_HUMAN[int(rng.integers(0, 8))], t, 0.12, float(rng.uniform(0.15, 0.25)))
            i += 1
        t += S16
    c.mark(c.next16(e['stream']), 'the knobs: soft pizzicato grains, a human stream (from "Nobody")', hit=False)
    c.mark(e['selfplay'], 'its own games: the grains straighten into 16ths, the chip on them ("Then it played itself")',
           hit=False)
    c.mark(e['freeze'], 'THE WALL FREEZES: the grains and the Go figure stop dead (the numbers fixed during play)',
           hit=False)
    V.clip_before(c, e['freeze'], insts={'vln_pizz', 'celesta', 'lead'}, rel=0.05)
    # ---- F2.3 · the cut-paper chamber tier: the same chord, upgraded on the smoke
    arrive = cut('4.28')
    look = cut('4.32')
    back = f23_out
    # (the C pedal comes in under the arrival, after the room's B-flat has let go; it lets go as the D-flat comes in)
    c.rebow('c_cb', 'C2', arrive - 0.6, look + 0.1, 0.24, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.4, art='sus')
    c.rebow('c_vc', 'C3', arrive - 0.5, look + 0.1, 0.24, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.4, art='sus')
    turn = [B('4.29') + 0.7, B('4.29') + 2.0, B('4.29') + 3.2]          # the staff turn back, one by one
    for (inst, p, v), off in zip((('c_vln1', 'Eb4', 0.23), ('c_vln2', 'Bb3', 0.23), ('c_vla', 'F3', 0.24)), turn):
        c.rebow(inst, p, f23_in + 0.3, off, v, seg=5.0, xf=1.0, first_att=1.8, last_rel=1.1, art='sus')
    c.n('timp', 'C2', arrive, 1.6, 0.52)
    c.mark(arrive, f'F2.3\'s arrival: the T3 tier\'s timpani, soft under the swell ({how(c, arrive, B("4.28"))} to '
                   f'2018)', hit=False)
    t = c.next_beat(arrive + Q * 0.9)
    for j, p in enumerate(['C4', 'F4', 'Bb4', 'Eb5']):
        lastn = j == 3
        d = 2 * Q * 0.97 if not lastn else max(1.5, turn[0] + 0.9 - (t + j * 2 * Q))
        c.n('hn', p, t + j * 2 * Q, d, 0.55 if not lastn else 0.52, art='sus', att=0.12, rel=0.9 if lastn else 0.4)
    c.mark(t, 'NOLE\'S LAUNCH on slow horns: its one sincere version (C F B-flat E-flat; the A-flat never comes)',
           hit=False)
    c.mark(turn[0], 'nobody applauds: the upper strings leave one by one as the staff turn back to work', hit=False)
    # the look: a D-flat pedal and THE DOOR on non-vibrato flute, its first note missing, ending on its held #4
    c.rebow('c_cb', 'Db2', look, back + 0.6, 0.22, seg=5.0, xf=1.0, first_att=0.9, last_rel=0.9, art='sus')
    c.rebow('c_vc', 'Ab2', look + 0.1, back + 0.6, 0.21, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.9, art='sus')
    td = c.next_beat(look + 0.3)
    c.n('fl', 'Db5', td, 2 * Q * 0.97, 0.58, art='nv', att=0.08)
    c.n('fl', 'C5', td + 2 * Q, Q * 0.95, 0.55, art='nv')
    c.n('fl', 'G4', td + 3 * Q, max(1.5, back + 0.5 - (td + 3 * Q)), 0.54, art='nv', rel=0.8)
    c.mark(td, 'THE DOOR, its first note missing (D-flat, C, then G held: the sharp-4, no cadence), through the door',
           hit=False)
    c.section('F2.3 (ERA T3): the cut-paper chamber tier; Nole\'s Launch on slow horns; the Door under the look',
              f23_in, back)
    # ---- the exit: his fanfare stops one note short (staccato trumpets; the A-flat never comes)
    t = fan_t0
    for j, p in enumerate(['C4', 'F4', 'Bb4', 'Eb5']):
        c.n('tpt', p, t + j * S16, S16 * 0.85, 0.52, art='stac')
    c.n('noise', 'C5', t, 0.08, 0.32, True, clock=12000.0, short=True, dec=0.06, sus=0.0, rel=0.03)
    c.mark(t, 'his exit: the fanfare stops ONE NOTE SHORT (C F B-flat E-flat, then nothing)')
    c.mark(e['blow'], 'the last candle: the glass\'s finger lifts; THE LAST CHORD rings free into E02-03', hit=False)
    return _finish_seance(c, T, tl, e, H, None, colour)


def _finish_seance(c, T, tl, e, H, end_at, colour):
    W = still_windows(tl)
    caps = caption_windows(tl)
    melodic = {'arm_lead', 'celesta', 'lead', 'lead2', 'tpt', 'noise'}
    # thin: melody and hits out under his lines, the V.O., real lines and the ghosts' captions; softer under talk
    V.thin(c, {'real': dict(drop=melodic, soften={'vln_pizz': 0.85}),
               'vo': dict(drop=melodic, soften={'vln_pizz': 0.85}),
               'mas': dict(drop=melodic),
               'talk': dict(soften={'lead2': 0.85, 'tpt': 0.9})}, t1=e['end'])
    c.a.notes = [nt for nt in c.a.notes if not (nt.inst in melodic and inside(c.clk.x(nt.start), [(a, b) for a, b, _
                                                                                                   in caps]))]
    secs = []
    if end_at is None:
        mv = [t for t, col, _ in H if col == 'Open5'][0]
        ache = [t for t, col, _ in H if col == 'Ache'][0]
        back = [t for t, col, _ in H if col == 'Fm9' and t > ache][0]
        f23 = (e['snuff'], lead_in(c, tl.B('4.33')))
        secs = [('1 the room colour: the glass harmonica (F minor) under the séance; Nole\'s dominant; the Launch x3', -1.0,
                 mv),
                ('2 Move 37: the open fifth, the Go figure, the knobs (human, then its own), the freeze', mv, ache),
                ('3 the fear: THE ACHE on glass', ache, back),
                ('4 back: the room colour, V.O. 2, "You kept them."', back, f23[0]),
                ('5 F2.3: the chamber tier, the Launch on horns, the Door', f23[0], f23[1]),
                ('6 back: "You sat at the back.", the fanfare one note short, the last chord', f23[1], e['end'])]
        for lab, a0, a1 in secs:
            c.section(lab, a0, a1)
    else:
        c.section(f'the room colour ({colour})', -1.0, end_at)
    vo = [ln for ln in tl.lines if ln['kind'] == 'vo' and ln['on'] < (end_at or e['end'])]
    meta = dict(
        id=c.name, title='The Séance (E02-02, Ep2 v1 Act One sc 4)' + ('' if end_at is None else f' · audition ({colour})'),
        mm='MM-21 Room Colours (Ep2)', usage='BI',
        family='ROOM COLOURS (the séance) -> the Go figure -> ERA T3 (cut-paper chamber) -> the room colour',
        tone='a ghost-story giggle played straight (glass, F minor) -> wonder and a chill (Move 37) -> melancholy and a '
             'warm second (F2.3) -> the room\'s F minor when he has gone',
        scenes=['Ep2 v1 Act One sc 4 (4.01-4.36), with Move 37 and F2.3'],
        motifs=['the room colour (the glass harmonica; the knee\'s step and its neighbours)',
                'Nole\'s Launch (C F B-flat E-flat): three stacks each shorter; slow horns in F2.3; one note short',
                'the Go figure (F C G, stones on a board)', 'THE ACHE (D-flat + G over F)',
                'the Door (A-flat D-flat | C G: its first note missing)'],
        motif_ids=[], key='F minor (Fm9, Dbmaj9#11, Bbm9) over Nole\'s C (C7sus(b9)); the open fifth; D-flat for the '
                          'Door; no A-natural anywhere',
        composer='Ep2 v1 score pass (act1), 2026-10-09, on the e02-v1-common engine (composer X\'s helpers)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        vo_windows=[(c.clk(ln['on']), c.clk(ln['end']), 'V.O.') for ln in vo],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (e['click'], 'post_click: his Publish (no hit: the SFX owns it)'),
            (e['knock1'], 'ceiling_knock x3 (the room colour has dropped to its pad; no hit)'),
            (e['burst'], 'ceiling_burst: Nole crashes in (the dominant arrives under it, soft)'),
            (e['lamp'], 'lamp_click: Nole\'s lamp (his motif\'s own click; the stacks follow it)'),
            (e['slap'], 'phone_clack_floor: the slap (no hit; the flames jump)'),
            (e['stone'], 'go_stone_click: MOVE 37 (the Go figure starts the beat after)'),
            (e['snuff'], 'candle_snuff: the glass rings free; the chamber tier swells in'),
            (e['rocket'], 'rocket_roar: his exit (the fanfare stops one note short beside it)'),
            (e['blow'], 'candle_blow: the last chord rings free')) if t < (end_at or 1e9)],
        audition=['0-30 s: the glass harmonica reads as a period séance instrument, uncanny and played straight, never '
                  'a horror organ, a hymn, a theremin or a Halloween music box',
                  'the `!` ghost: the Launch three times, each shorter: a deflating fanfare, not a gag',
                  'Move 37: the room goes quiet; the Go figure and the knobs are a texture, not a melody; the stop on '
                  'the freeze is clean',
                  'F2.3: the horns are sincere, and the strings leaving read as the room turning away',
                  'the Door on flute is through a door (low-passed, one side); the last chord rings into PROCEDURE'])
    end = end_at if end_at is not None else e['end'] + 2.4
    rides = [(ln['on'] - 0.45, ln['end'] + 0.35, -4.0) for ln in vo]
    # the real lines (the ghosts' emails read aloud): the room thins 4 dB under the record, as under the V.O.
    rides += [(ln['on'] - 0.45, ln['end'] + 0.35, -4.0) for ln in tl.lines
              if ln['kind'] == 'real' and ln['on'] < (end_at or e['end'])]
    speech = merge([(ln['on'] - 0.2, ln['end'] + 0.2) for ln in tl.lines])
    for a, b, _ in caps:
        if a < (end_at or e['end']) and not any(x < b and y > a for x, y in speech):
            rides.append((a - 0.3, b + 0.2, -3.0))
    mr = []                                         # (overlapping rides merge: the deeper one holds)
    for a, b, d in sorted(rides):
        if mr and a <= mr[-1][1]:
            mr[-1] = (mr[-1][0], max(mr[-1][1], b), min(mr[-1][2], d))
        else:
            mr.append((a, b, d))
    macro = [(-3.0, 0.0)]
    for a, b, d in mr:
        macro += [(a, 0.0), (a + 0.4, d), (b - 0.3, d), (b, 0.0)]
    sc = c.finish(T, meta, length_end=end, end_fade=((end_at - 1.5, end_at) if end_at is not None else None),
                  tail_s=0.5, macro=macro)
    meta['rides'] = [dict(t0=round(a, 3), t1=round(b, 3), db=d) for a, b, d in sorted(rides)]
    c.ev = dict(e, H=[(round(t, 3), col) for t, col, _ in H], top_bowl_lifts=getattr(c, 'top_lifts', 0))
    return c, sc


# ================================================================ E02-03 PROCEDURE, MARCH
PROC = {   # the table, sul tasto (cb, vc, vla, vln2, vln1), and the spiccato pulse's root and fifth (B-flat minor centred)
    'Bbm9':      (['Bb1', 'F2', 'Db3', 'C4', 'F4'], ('Bb2', 'F2')),
    'Gbmaj7#11': (['Gb2', 'Db3', 'F3', 'Bb3', 'C4'], ('Gb2', 'Db3')),
    'Dbmaj9':    (['Db2', 'Ab2', 'F3', 'C4', 'Eb4'], ('Db3', 'Ab2')),
    'F7sus_b9':  (['F2', 'C3', 'Eb3', 'Bb3', 'Gb4'], ('F2', 'C3')),       # the dominant left suspended
}
PULSE = [0, 0, 1, 0, 0, 1, 0, 0]             # the spiccato pulse per bar of 8ths: root / fifth (straight; never 4 alike)


def tracks_procedure():
    T = palette()
    for k, g in (('cb', -2.0), ('vc', -2.0), ('vla', -3.0), ('vln2', -4.0), ('vln1', -5.0)):
        T[k].gain_db, T[k].sends = g, {'hall': -10, 'room': -16}
        if k in ('cb', 'vc'):
            T[k].eq = list(T[k].eq) + [V.PIZZ_NOTCH]
    T['vc'].hum_ms = 4.0
    T['snare_taps'].gain_db, T['snare_taps'].sends = -6.0, {'room': -10}
    T['timp'].gain_db = -8.0
    T['hn'].gain_db, T['hn'].sends = -6.0, {'hall': -8}
    T['tri'].gain_db = -12.0
    T['lead2'].gain_db, T['lead2'].sends, T['lead2'].eq = -10.0, {'room': -12, 'snes': -14}, [('lp', 6000)]
    return T


def cue_procedure(tl):
    t_in = tl.B('4A.01')
    c = V.Cue('e02-03-procedure-march', tl, anchor=t_in - 0.25, anchor_bar=2,
              bars=int((tl.B('4B.01') + 6.0 - (t_in - 0.25 - BAR)) / BAR) + 2, swing=0.0)
    T = tracks_procedure()
    W = still_windows(tl)
    B = tl.B
    entry = lead_in(c, t_in, swung=False)                         # the lights step up: 0.25 s before the cut
    reading = _line(tl, 'e2-a1-0032', 'terb', B('4A.02') + 1.0)
    chair = _snd(tl, '4A.03', 'chair_unfold', tl.E('4A.03') - 1.2)
    toast = _snd(tl, '4A.06', 'ui_toast_pop', B('4A.06') + 0.5)
    lift = c.next_beat(B('4A.05') + 1.5)                          # Gerg lifts the laptop an inch, like a toast
    plan = [(entry, 'Bbm9', 'the room by day: the room colour\'s last chord rings into the low strings'),
            (change_at(c, lead_in(c, B('4A.04')), W), 'Gbmaj7#11', 'he sits; the nameplates (SFX): a step warmer'),
            (change_at(c, lead_in(c, B('4A.05')), W), 'Dbmaj9', 'the glance at Gerg: the warm half-second'),
            (change_at(c, lead_in(c, B('4A.06')), W), 'F7sus_b9', 'the invite lights his phone: left hanging')]
    out = max(toast + 2.0, B('4B.01') + 0.6)
    for i, (t0, col, why) in enumerate(plan):
        t1 = plan[i + 1][0] if i + 1 < len(plan) else out
        last = i + 1 == len(plan)
        for inst, p, v in zip(('cb', 'vc', 'vla', 'vln2', 'vln1'), PROC[col][0], (0.17, 0.17, 0.15, 0.13, 0.12)):
            c.rebow(inst, p, t0 - (0.0 if i == 0 else 0.25), t1 + (0.25 if not last else 0.0), v, seg=5.0, xf=0.9,
                    first_att=1.4 if i == 0 else 0.8, last_rel=1.4 if last else 0.3, art='sus',
                    lp=1200 if inst in ('vln1', 'vln2', 'vla') else 900)     # (1200, not 1500: Terb's quiet take
        c.mark(t0, f'{col}: {why}' + (f' ({how(c, t0, t_in)})' if i == 0 else ''), hit=False)   # needs the room)
    # the pulse (spiccato 8ths, straight) and the dry snare taps: under Terb's opening, thin to the pedal under the
    # reading (the record plays dry), back as he sits, out under the invite
    p_end1 = lead_in(c, reading['on'], 0.35, swung=False) if reading else B('4A.02')
    p_in2 = c.next_beat(max(chair + 0.25, plan[1][0]))
    p_end2 = plan[3][0]
    spans = [(c.next_bar(entry + 1.0), p_end1), (p_in2, p_end2)]
    for a0, a1 in spans:
        t = c.next8(a0)
        while t < a1 - 0.02:
            col = [cl for tt, cl, _ in plan if tt <= t + 1e-6][-1]
            k = int(round((t - c.bar1) / (Q / 2))) % 8
            p = PROC[col][1][PULSE[k]]
            sp = 0.75 if tl.talking(t, kinds={'talk', 'mas'}) else 1.0     # (softer under a line: score review)
            c.n('vc', p, t, Q * 0.42, (0.3 if k % 2 == 0 else 0.24) * sp, art='spic')
            t += Q / 2
        b0 = int(math.floor(c.bar_of(a0) + 1e-6))
        b1 = int(math.ceil(c.bar_of(a1) - 1e-6))
        n0 = len(c.a.notes)
        Drums(c.a, 'orch').play('taps: ..o...o.', bars=(b0, b1 + 1), vel=0.32)
        c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if a0 - 0.01 <= c.clk.x(nt.start) < a1 - 0.02]
    c.n('timp', 'Gb2', plan[1][0], 1.0, 0.25)
    c.mark(spans[0][0], 'the procedure: a spiccato pulse and dry snare taps (straight) under Terb\'s opening', hit=False)
    c.mark(p_end1, 'thin to the pedal: the reading plays dry (no motion under the record)', hit=False)
    c.mark(p_in2, 'he sits: the pulse back, a step warmer (G-flat), under the nameplates (the clicks are SFX)',
           hit=False)
    # the warm half-second: muted horns, the chip's triangle under the bass, the Build's "shipped" tag (C5 F5)
    tw = plan[2][0]
    c.ch('hn', ['Ab3', 'C4', 'F4'], tw, 1.2, 0.21, roll=0.02, art='mute', att=0.2, rel=0.5)
    c.n('tri', 'Db3', tw, 2.2, 0.35, True, att=0.02, dec=0.4, sus=0.5, rel=0.3)
    c.n('lead2', 'C5', lift, Q * 0.42, 0.2, True, duty=0.25, att=0.002, dec=0.08, sus=0.3, rel=0.05)
    c.n('lead2', 'F5', lift + Q / 2, Q * 0.42, 0.22, True, duty=0.25, att=0.002, dec=0.08, sus=0.3, rel=0.08)
    c.mark(tw, 'the warm half-second: D-flat, muted horns, the chip\'s triangle (he is in the room)', hit=False)
    c.mark(lift, 'Gerg lifts the laptop like a toast: the Build\'s "shipped" tag on the chip (C5 F5)')
    c.mark(out, 'PROCEDURE rings out under the invite; none under the read (V.O. 3)', hit=False)
    V.thin(c, {'real': dict(drop={'vc_spic', 'snare_taps', 'timp', 'lead2', 'hn'}),
               'vo': dict(drop={'lead2', 'hn', 'snare_taps'}), 'talk': dict(soften={'snare_taps': 0.6})})
    #   (the taps are noise in the voices' band: 0.6 under talk, not 0.85; the score review, 2026-10-09)
    c.a.notes = [nt for nt in c.a.notes if not (nt.inst == 'vc' and nt.x.get('art') == 'spic' and
                                                tl.talking(c.clk.x(nt.start), kinds={'real'}))]
    c.section('PROCEDURE: the low strings, the pulse and taps; thin to the pedal under the reading', entry, plan[1][0])
    c.section('he sits: a step warmer; the warm half-second; F7sus(b9) under the invite, rung out', plan[1][0], out)
    meta = dict(
        id=c.name, title='Procedure, March (E02-03, Ep2 v1 Act One sc 4A)', mm='MM-09 family (to picture)', usage='BI',
        family='P02 PROCEDURE (the table)', tone='dry, institutional: the record read whole; a warm half-second',
        scenes=['Ep2 v1 Act One sc 4A (4A.01-4A.06)'],
        motifs=['the table\'s pedal (B-flat minor), the dominant left suspended',
                'Gerg\'s Build: its "shipped" tag (C5 F5, the knee\'s last interval alone)'],
        motif_ids=[], key='B-flat minor (Bbm9, Gbmaj7#11, Dbmaj9, F7sus(b9)); no A-natural',
        composer='Ep2 v1 score pass (act1), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-21.0,
        album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(chair), 3), sfx='chair_unfold: he sits'),
                   dict(t=round(c.clk(toast), 3), sfx='ui_toast_pop: the invite (over the hanging chord)')],
        audition=['the reading plays dry: the pedal only, no motion', 'the warm half-second is warm, not cute'])
    sc = c.finish(T, meta, length_end=out + 0.6, end_fade=(out - 1.4, out + 0.4), tail_s=0.3)
    c.ev = dict(entry=entry, out=out, plan=[(round(t, 3), col) for t, col, _ in plan], lift=lift, toast=toast)
    return c, sc


# ================================================================ E02-04 LONG-FORM (the podcast's own intro sting)
def tracks_longform():
    T = palette()
    T['vibes'].gain_db, T['vibes'].sends = -2.0, {'room': -12, 'hall': -14}
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['swish'].gain_db = 1.0
    T['jazz'].gain_db = 0.0
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -3.0, {'room': -12, 'snes': -12}, [('lp', 5200)]
    return T


def cue_longform(tl):
    cut6 = tl.B('6.01')
    c = V.Cue('e02-04-long-form', tl, anchor=cut6 - 0.25, anchor_bar=3, bars=6, swing=1.0)
    T = tracks_longform()
    xel = _line(tl, 'e2-a1-0034', 'xel', cut6 + 1.4)
    swell = cut6 - 0.8                                            # J 0.8 s, under the card settling
    down = cut6 - 0.25                                            # the push into the studio: 0.25 s before the cut
    stop = (xel['on'] - 0.12) if xel else cut6 + 1.3              # the melody is out before XEL's first word
    c.n('swish', 'C4', swell, down - swell + 0.05, 0.55, True, circles=0.5)
    c.ch('vibes', ['Ab3', 'C4', 'Eb4', 'G4'], down, 1.0, 0.42, roll=0.01)
    c.n('ubass', 'F2', down, Q * 1.8, 0.52)
    c.n('jazz', 53, down, 0.4, 0.3)                               # the ride's bell, once
    mot = [('C5', down + Q), ('Eb5', down + Q + SW), ('G5', down + 2 * Q)]
    for i, (p, t) in enumerate(mot):
        if t >= stop:
            break
        held = i == len(mot) - 1
        c.n('vibes', p, t, 1.6 if held else 0.3, 0.44)
        c.n('lead', p, t, 0.12, 0.28, True, duty=0.25 if not held else 0.125, att=0.002, dec=0.07, sus=0.25, rel=0.1)
    if down + 2 * Q < stop:
        c.ch('vibes', ['F3', 'C4', 'Eb4'], down + 2 * Q, 1.6, 0.3, roll=0.01)
        c.n('ubass', 'Db2', down + 2 * Q, Q * 2.2, 0.46)
    out = down + 2 * Q + 2.9
    c.mark(swell, 'the sting pre-laps under the card settling (J 0.8 s): a brush swell', hit=False)
    c.mark(down, f'DESIGNED HIT: the podcast\'s intro, Fm9 on a push {cut6 - down:.2f} s before the cut to XEL\'s studio')
    c.mark(down + Q, 'the question (vibes + the chip): C, E-flat, G; left hanging on D-flat(#11) under XEL\'s first words')
    c.section('E02-04: the podcast-intro sting', swell, out)
    meta = dict(
        id=c.name, title='Long-Form (E02-04, Ep2 v1 Act One sc 4B -> 6)', mm='MM-21 media beds (Ep2)', usage='BI',
        family='MM-21 media bed: an original podcast-intro sting', tone='an earnest long question, left hanging',
        scenes=['Ep2 v1 Act One 4B.01 -> 6.01'], motifs=['the long question (C E-flat G over F, to D-flat(#11))'],
        motif_ids=[], key='F minor to D-flat lydian; no A-natural', diegetic=False,
        composer='Ep2 v1 score pass (act1), 2026-10-09', underscore_lufs=-20.0, album_lufs=-16.0,
        audition=['a podcast intro in the show\'s own voice (vibes, upright, brushes, the chip): earnest, not lounge'])
    sc = c.finish(T, meta, length_end=out + 0.4, end_fade=(out - 1.4, out + 0.3), tail_s=0.3)
    c.ev = dict(swell=swell, down=down, out=out, stop=stop)
    return c, sc


# ================================================================ E02-05 A TENANT
TEN = {   # Rhodes (on the beats), the walk's scale, its root: nothing below C2 (the cathedral's hum)
    'Fm11':      (['Ab3', 'C4', 'Eb4', 'Bb4'], ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3'], 'F2'),
    'Dbmaj9#11': (['F3', 'C4', 'Eb4', 'G4'], ['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3'], 'Db2'),
    'Abmaj9':    (['G3', 'Bb3', 'C4', 'Eb4'], ['Ab2', 'Bb2', 'C3', 'Db3', 'Eb3', 'F2', 'G2'], 'Ab2'),
    'Bb13':      (['Ab3', 'D4', 'G4'], ['Bb2', 'C3', 'D3', 'Eb3', 'F2', 'G2', 'Ab2'], 'Bb2'),
    'C7#9b13':   (['E3', 'Bb3', 'Eb4', 'Ab4'], ['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2'], 'C2'),
}
TASYA = ['G3', 'Bb3', 'C4', 'Eb4']           # his chord (Ep1's, on "pen"): G B-flat C E-flat over F, no third
FLOOR = [('Abmaj9', {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Ab2'),     # Tasya's floor (Ep1's)
         ('Cmaj9', {'vc': 'C3', 'vla': 'E4', 'vln2': 'G4', 'vln1': 'B4'}, 'C3'),
         ('Emaj9', {'vc': 'E3', 'vla': 'E4', 'vln2': 'Ab4', 'vln1': 'B4'}, 'E2'),
         ('Abmaj9', {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Ab2')]
HOME = {'vc': 'F3', 'vla': 'C4', 'vln2': 'G4', 'vln1': 'Ab4'}          # Fm(add9), above C3: his room (the hum)
ACHE = {'vc': 'F3', 'vla': 'C4', 'vln2': 'G4', 'vln1': 'Db5'}          # THE ACHE under "We keep a spare."
WATER = [('F4', 0.0), ('F4', 1.0), ('F4', 2.0), ('G4', 3.0), ('F4', 3.0 + 2.0 / 3.0)]   # his line's first bar (swung)
COPY = WATER + [('C4', 4.0), ('F4', 5.0)]                                 # the copy finishes it: C4, then F4


def tracks_tenant():
    T = palette()
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -10.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['rhodes'].gain_db, T['rhodes'].sends = -4.0, {'room': -12, 'plate': -12}
    T['brush'].gain_db = 8.0
    T['swish'].gain_db = 2.0
    T['jazz'].gain_db = 2.0
    T['lead'].gain_db, T['lead'].sends, T['lead'].eq = -4.0, {'room': -14, 'snes': -16}, [('hp', 220), ('lp', 5200)]
    T['lead2'].gain_db, T['lead2'].sends, T['lead2'].eq = -1.0, {'room': -10, 'snes': -10}, [('hp', 180), ('lp', 5600)]
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    T['cb'].gain_db, T['cb'].sends = -3.0, {'hall': -12, 'room': -16}
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -16}
    T['felt_mech'].gain_db = -16.0
    return T


def walk(c, t0, t1, changes, rng, vel=0.5, first_root=True):
    """a walking bass on the beats of [t0, t1): the chord's root on its first beat, scale tones through it, an approach
    a semitone or a step into the next chord's root; changes = [(t, chord)]"""
    beats = []
    t = c.next_beat(t0 - 1e-3)
    while t < t1 - 0.05:
        beats.append(t)
        t += Q
    out = []
    for i, tb in enumerate(beats):
        ch = [cl for tt, cl in changes if tt <= tb + 1e-3][-1]
        nxt_t = next((tt for tt, cl in changes if tt > tb + 1e-3), None)
        nxt = next((cl for tt, cl in changes if tt > tb + 1e-3), ch)
        scl = [nm(p) for p in TEN[ch][1]]
        root = nm(TEN[ch][2])
        first = (i == 0 and first_root) or (i > 0 and [cl for tt, cl in changes if tt <= beats[i - 1] + 1e-3][-1] != ch)
        if first:
            p = root
        elif nxt_t is not None and tb + Q >= nxt_t - 0.05:
            tgt = nm(TEN[nxt][2])
            p = tgt + (1 if out and out[-1] > tgt else -1) if rng.random() < 0.6 else tgt + (2 if rng.random() < .5
                                                                                             else -2)
        else:
            cur = out[-1] if out else root
            cand = [s for s in scl if 0 < abs(s - cur) <= 4] or scl
            p = int(rng.choice(cand))
        p = max(nm('C2'), min(nm('Eb3'), p))
        out.append(p)
        c.n('ubass', p, tb, Q * 0.9, vel * (1.0 if (i % 2 == 0) else 0.92))
        c.n('cb_pizz', p, tb, Q * 0.6, vel * 0.55, rel=0.16)
    return beats


def cue_tenant(tl):
    jangle = _snd(tl, '7.08', 'key_ring_jangle_1', tl.B('7.08') + 2.6)
    end = tl.length
    split = tl.B('7.01')
    ab = int(math.ceil((jangle - split + BAR) / BAR)) + 1
    c = V.Cue('e02-05-a-tenant', tl, anchor=jangle, anchor_bar=ab, bars=ab + 4, swing=1.0)
    T = tracks_tenant()
    rng = np.random.default_rng(705)
    B = tl.B
    entry = lead_in(c, split)                                     # the swung push into the split
    bB, bC, bD = lead_in(c, B('7.02')), lead_in(c, B('7.03'), 0.06), lead_in(c, B('7.04'))   # (the welcome's
    # chord pushes the cut by a swung and: the beat before it would sit under the Humanist's last word)
    bE, bF, bG = lead_in(c, B('7.05')), lead_in(c, B('7.06')), lead_in(c, B('7.07'))
    bH = jangle - BAR                                             # his line's bar: the jangle is its bar 2 downbeat
    phone = _line(tl, 'e2-a1-0047', 'mas', split + 1.5)
    spare = _line(tl, 'e2-a1-0052', 'tasya', B('7.05') + 2.4)
    tenant = _line(tl, 'e2-a1-0054', 'tasya', B('7.07') + 3.6)
    # ---- the harmony of the swing sections (changes on bar lines where they fit; each section pre-laps its cut)
    nb = lambda t: c.next_bar(t + 0.05)                           # noqa: E731
    chA = [(entry, 'Fm11')] + ([(nb(entry) + 2 * BAR, 'Dbmaj9#11')] if nb(entry) + 2 * BAR < bB - 0.6 else [])
    chB = [(bB, 'Abmaj9')] + ([(nb(bB) + BAR, 'Fm11')] if nb(bB) + BAR < bC - 1.2 else [])
    chD = [(bD, 'Bb13')]
    for col in ('Fm11', 'Dbmaj9#11', 'C7#9b13'):
        t = nb(chD[-1][0])
        if t < bE - 1.0:
            chD.append((t, col))
    chF = [(bF, 'Fm11')]
    # the push: the bass's F2 on the swung and, tied over the downbeat; a brush slap and the ride's bell with it
    c.n('ubass', 'F2', entry, c.next_beat(entry + Q * 1.2 - 1e-3) - entry - 0.04, 0.62)
    c.n('cb_pizz', 'F2', entry, 0.5, 0.36, rel=0.16)
    c.n('brush', 39, entry, 0.3, 0.55)
    c.n('jazz', 53, entry, 0.4, 0.34)
    for a0, a1, chs in ((entry, bB, chA), (bB, bC, chB), (bD, bE, chD), (bF, bG, chF)):
        walk(c, a0 + (Q * 1.2 if a0 == entry else 0.0), a1, chs, rng, vel=0.5 if a0 != entry else 0.54,
             first_root=a0 != entry)
        for t, col in chs:
            c.mark(t, f'the swing: {col}', hit=False)
    # brushes in the swing sections (the drum DSL plays whole bars: kept to each section)
    for a0, a1 in ((entry, bB), (bB, bC), (bD, bE), (bF, bG)):
        b0, b1 = int(math.floor(c.bar_of(a0) + 1e-6)), int(math.ceil(c.bar_of(a1) - 1e-6))
        n0 = len(c.a.notes)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.\nhatf[vel=0.5]: ..x...x.', bars=(b0, b1 + 1),
                                   vel=0.44)
        c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if a0 - 0.02 <= c.clk.x(nt.start) < a1 - 0.03]
    # ---- A: the chip leads us down the building (out under his recorded voice)
    p_on = phone['on'] if phone else split + 1.5
    p_end = phone['end'] if phone else split + 4.0
    V.phrase(c, 'lead', c.next_bar(entry + 0.05), 'C5/8 Ab4/8 G4/8 F4/8 Eb4/4 r/4', 0.32, swing=1.0,
             stop_at=p_on - 0.15, duty=0.25, att=0.002, dec=0.09, sus=0.4, rel=0.05)
    t2 = c.next_beat(p_end + 0.25)
    V.phrase(c, 'lead', t2, 'Eb5/8 C5/8 Bb4/8 Ab4/8 G4/8 F4/8 Eb4/4', 0.3, swing=1.0, stop_at=bB - 0.08, duty=0.25,
             att=0.002, dec=0.09, sus=0.4, rel=0.05)
    c.mark(entry, f'DESIGNED HIT: the swing enters on the split (a push {how(c, entry, split)}): walking bass, brushes')
    c.mark(c.next_bar(entry + 0.05), 'the chip leads us down the building (out under his recorded voice)', hit=False)
    # ---- B, D, F: the basement (his POV left: no chip, no felt): Tasya's Rhodes on the beats
    # (on 2 and 4 only, short and soft: Rhodes on every beat over brushes and an upright is Ep1's corny trio)
    for a0, a1, chs in ((bB, bC, chB), (bD, bE, chD), (bF, bG, chF)):
        t = c.next_beat(a0 - 1e-3)
        while t < a1 - 0.08:
            col = [cl for tt, cl in chs if tt <= t + 1e-3][-1]
            beat = int(round((t - c.bar1) / Q)) % 4
            if beat in (1, 3):
                c.ch('rhodes', TEN[col][0], t, Q * 0.42, 0.19 if beat == 1 else 0.17, roll=0.005)
            t += Q
    c.mark(bB, f'the basement: Tasya\'s Rhodes on 2 and 4 (no chip, no felt: his POV left) ({how(c, bB, B("7.02"))})',
           hit=False)
    # ---- C: ONE Rhodes chord under the welcome (his chord over F), the floor held under it (silent attacks)
    dup(T, 'rhodes', 'rhodes_one', gain_db=1.0)                  # the one chord: its own fader, heard as THE chord
    c.pch('rhodes_one', TASYA, bC, bD - bC - 0.1, 0.6, roll=0.012, span_end=bD - 0.12)
    c.rebow('cb', 'F2', bC, bD + 0.2, 0.15, seg=5.0, xf=1.0, first_att=0.4, last_rel=0.3, art='sus', lp=900)
    for inst, p in (('vc', 'C3'), ('vla', 'G3'), ('vln2', 'Bb3'), ('vln1', 'Eb4')):
        c.rebow(inst, p, bC + 0.2, bD + 0.2, 0.15, seg=5.0, xf=1.0, first_att=1.3, last_rel=0.3, art='sus', lp=2400)
    n0 = len(c.a.notes)
    Drums(c.a, 'brushes').play('sweep: ~~~~~~~~', bars=(int(c.bar_of(bC)), int(c.bar_of(bD)) + 1), vel=0.34)
    c.a.notes = c.a.notes[:n0] + [nt for nt in c.a.notes[n0:] if bC - 0.02 <= c.clk.x(nt.start) < bD - 0.03]
    c.mark(bC, f'ONE Rhodes chord under the welcome (his G B-flat C E-flat over F) ({how(c, bC, B("7.03"))}); '
               'the band holds', hit=False)
    # ---- E: the hold under "We keep a spare." (no comic scoring): THE ACHE in the strings, the bass's F
    c.rebow('cb', 'F2', bE, bF + 0.2, 0.15, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.3, art='sus', lp=900)
    for inst, p in ACHE.items():
        c.rebow(inst, p, bE + 0.05, bF + 0.2, 0.19, seg=5.0, xf=1.0, first_att=1.0, last_rel=0.3, art='sus', lp=2400)
    c.mark(bE, f'the key: the band holds on THE ACHE (D-flat + G over F) under "We keep a spare." '
               f'({how(c, bE, B("7.05"))})', hit=False)
    # ---- G: the pan up through his floors: Tasya's floor, A-flat -> C -> E -> A-flat (silent attacks)
    n = len(FLOOR)
    step = max(Q, math.floor(((bH - bG) / n) / Q + 1e-6) * Q)
    starts = [bG + i * step for i in range(n)]
    for i, (col, voices, root) in enumerate(FLOOR):
        a0 = starts[i]
        a1 = starts[i + 1] if i + 1 < n else bH
        for inst, p in voices.items():
            c.rebow(inst, p, a0 - (0.0 if i == 0 else 0.25), a1 + 0.3, 0.21, seg=5.0, xf=0.8,
                    first_att=0.7 if i else 0.5, last_rel=0.3, art='sus', lp=2600)
        c.rebow('cb', root, a0, a1 + 0.3, 0.14, seg=5.0, xf=0.8, first_att=0.5, last_rel=0.3, art='sus', lp=900)
        c.mark(a0, f'the pan up: Tasya\'s floor, {col}', hit=False)
    # ---- H: home on Mas: the felt's flat line and its nudge; THE COPY, his line on the chip a beat late, finishing it
    for inst, p in HOME.items():
        c.rebow(inst, p, bH - 0.25, jangle + 0.1, 0.14, seg=5.0, xf=0.8, first_att=1.1, last_rel=2.8, art='sus',
                lp=2400)
    for p, bt_ in WATER:
        c.n('felt', p, bH + bt_ * Q, Q * (0.95 if bt_ < 3.5 else 3.5), 0.26 if bt_ == 0 else 0.22)
    c.ped.setdefault('felt', []).append((c.clk(bH - 0.01), c.clk(end + 0.3)))
    for j, (p, bt_) in enumerate(COPY):
        last = j == len(COPY) - 1
        c.n('lead2', p, bH + (bt_ + 1.0) * Q, 0.32 if not last else 0.95, 0.3 if not last else 0.3, True,
            duty=0.25 if j < 4 else 0.125, att=0.002, dec=0.1 if not last else 0.35, sus=0.45 if not last else 0.3,
            rel=0.07 if not last else 1.4)
    c.mark(bH, 'home on Mas: the felt\'s flat line and its nudge (F F F G-F), within a bar of the home shot')
    c.mark(bH + Q, 'THE COPY: his line on the chip, a beat late')
    c.mark(jangle, 'the key ring\'s jangle on the downbeat (diegetic, SFX); the strings let go; the copy finishes '
                   'his line (C4, then F4), the felt\'s last F ringing under it', hit=False)
    c.mark(bH + 6.0 * Q, 'the copy\'s last F rings into the black (render/music-el-ringout.wav)', hit=False)
    # ---- thin: melody out under his recorded voice (a real line); the Rhodes softer under the talk
    V.thin(c, {'real': dict(drop={'lead', 'lead2'}, soften={'rhodes': 0.6, 'ubass': 0.85, 'brush': 0.8}),
               'talk': dict(soften={'rhodes': 0.8, 'brush': 0.85, 'swish': 0.9})}, t1=bH - 0.3)
    for lab, a0, a1 in (('A the split: the swing low (bass, brushes), the chip leading us down', entry, bB),
                        ('B the basement: Tasya\'s Rhodes on the beats (no chip, no felt)', bB, bC),
                        ('C the welcome: one Rhodes chord, the floor held', bC, bD),
                        ('D "Is there room for them?": the swing again', bD, bE),
                        ('E "We keep a spare.": the hold on the Ache', bE, bF),
                        ('F "Who else lives here?"', bF, bG),
                        ('G the pan up: Tasya\'s floor (A-flat, C, E, A-flat); "A tenant."', bG, bH),
                        ('H home on Mas: the flat line, THE COPY, the jangle, into the black', bH, end)):
        c.section(lab, a0, a1)
    meta = dict(
        id=c.name, title='A Tenant (E02-05, Ep2 v1 Act One sc 7, act-out 1)', mm='(to picture; MM-05 family)', usage='BI',
        family='P11 SET-PIECE SWING, low -> Tasya\'s Rhodes (one chord) -> Tasya\'s floor -> THE COPY',
        tone='comedy with a chill: the landlord\'s spare, downstairs; the copy finishes his line',
        scenes=['Ep2 v1 Act One sc 7 (7.01-7.08)'],
        motifs=['Tasya: the Rhodes on the beats, one chord on the welcome, the floor (A-flat C E A-flat)',
                'THE ACHE (D-flat + G over F)', 'Mas: the Water Line\'s first bar (the flat line and its nudge)',
                'THE COPY (his line on the chip, a beat late: it finishes the line)'],
        motif_ids=[], key='F minor / dorian (Fm11, Dbmaj9#11, Abmaj9, Bb13, C7#9b13); F9sus4 (Tasya); A-flat, C, E '
                          'majors (the floor: no A anywhere); Fm(add9) home',
        composer='Ep2 v1 score pass (act1), 2026-10-09, on the e02-v1-common engine', underscore_lufs=-20.0,
        album_lufs=-16.0,
        room_sfx=[dict(t0=round(c.clk(entry), 3), t1=round(c.clk(end), 3), sfx='server_hum (the cathedral, floor by '
                       'floor; the basement lower)')],
        sfx_slots=[dict(t=round(c.clk(t), 3), sfx=s) for t, s in (
            (split, 'dollhouse_slide: the split (the swing\'s push 0.2 s before it)'),
            (_snd(tl, '7.05', 'door_key_turn', B('7.05') + 0.3), 'door_key_turn: the key twisted off (the hold)'),
            (_snd(tl, '7.05', 'alert_bonk', B('7.05') + 4.0), 'alert_bonk: the INQUIRY envelope (no hit)'),
            (jangle, 'key_ring_jangle_1: on the downbeat (the copy\'s G on it)'))],
        audition=['the split: the swing low and charming, the chip leading down, never Nintendo, never lounge',
                  'the welcome: one Rhodes chord that IS the lease', 'the spare: a held chill, not a sting',
                  'the out: the felt stops; the chip, a beat late, finishes his line into the black'])
    sc = c.finish(T, meta, length_end=end + 3.2, tail_s=0.5)
    c.ev = dict(entry=entry, jangle=jangle, bH=bH, sections=dict(B=bB, C=bC, D=bD, E=bE, F=bF, G=bG))
    return c, sc


CUES = {'seance': cue_seance, 'procedure': cue_procedure, 'longform': cue_longform, 'tenant': cue_tenant}


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


# ================================================================ lay-in
def lay(tl, built, work):
    """the four cues on the segment clock; two designed rests (none under the read; no score in the studio)"""
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')     # noqa: E731
    cs, cp, cl, ct = (built[k][0] for k in ('seance', 'procedure', 'longform', 'tenant'))
    s_end = cs.ev['end'] + 1.6                    # the last chord rings 1.6 s into PROCEDURE, then crossfades out
    layers = [
        dict(name=built['seance'][1].name, wav=wav('seance'), T0=cs.T0, a0=0.0, a1=s_end, fin=0.0, fout=1.4),
        dict(name=built['procedure'][1].name, wav=wav('procedure'), T0=cp.T0, a0=cp.ev['entry'] - 0.02,
             a1=cp.ev['out'], fin=0.25, fout=1.2),
        dict(name=built['longform'][1].name, wav=wav('longform'), T0=cl.T0, a0=cl.ev['swell'] - 0.01, a1=cl.ev['out'],
             fin=0.05, fout=1.4),
        dict(name=built['tenant'][1].name, wav=wav('tenant'), T0=ct.T0, a0=ct.ev['entry'] - 0.01, a1=tl.length,
             fin=0.004, fout=0.005),
    ]
    read = next((ln for ln in tl.lines if ln['kind'] == 'vo' and cp.ev['out'] - 2 < ln['on'] < cl.ev['swell']), None)
    designed = [(cp.ev['out'] - 0.5, cl.ev['swell'] - 0.01,
                 '4B: none under the read (V.O. 3' + (f', {read["on"]:.2f}-{read["end"]:.2f}' if read else '') +
                 '): the boardroom\'s room tone; PROCEDURE has rung out under the invite, and the podcast sting is the '
                 're-entry (J 0.8 s)'),
                (cl.ev['out'] - 0.5, ct.ev['entry'] - 0.01,
                 '6: no score in XEL\'s studio (the padded room tone is the joke; the mic\'s hops and the counter\'s ticks '
                 'are SFX), and none under the curtain\'s part (6.11); the swing\'s push into the split is the re-entry')]
    stings = [(cl.ev['swell'], cl.ev['out'], 'E02-04: the podcast-intro sting (designed)')]
    return layers, designed, stings


def write_extras(tl, built, work, tag):
    """render/music<tag>-prelap.wav: the séance's 1.0 s before the act's first frame (the J under the card); and
    render/music<tag>-ringout.wav: E02-05 past the act's last frame (THE COPY's last F into Act Two's head)"""
    import soundfile as sf
    out = {}
    cs, ss = built['seance']
    p = os.path.join(work, f'{ss.name}-underscore.wav')
    x, sr = sf.read(p, always_2d=True, dtype='float64')
    i1 = int(round((0.0 - cs.T0) * SR))
    i0 = int(round((-1.0 - cs.T0) * SR))
    if i0 >= 0:
        y = x[i0:i1].copy()
        k = int(0.3 * SR)
        y[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
        fp = os.path.join(HERE, 'render', f'music{tag}-prelap.wav')
        sf.write(fp, y.astype(np.float32), SR, subtype='PCM_24')
        out['prelap'] = dict(file=os.path.relpath(fp, V.REPO), seconds=round(len(y) / SR, 3),
                             lay='under the filename card\'s last 1.0 s (the J 1.0 s: "the séance\'s room colour already '
                                 'playing"); continuous with music' + tag + '.wav\'s first sample. mix_episode.py lays it '
                                 '(score_bus: the card gets a score bus for it, ending on the card\'s last sample, at '
                                 'Act One\'s head gain) and drops Act One\'s 1.0 s head fade (the colour is already '
                                 'playing; the score review, 2026-10-09)',
                             fade_in_s=0.3)
    ct, st = built['tenant']
    p = os.path.join(work, f'{st.name}-underscore.wav')
    x, sr = sf.read(p, always_2d=True, dtype='float64')
    j0 = int(round((tl.length - ct.T0) * SR))
    y = x[j0:j0 + int(3.0 * SR)].copy()
    if len(y) > SR // 10:
        k = min(len(y), int(1.6 * SR))
        y[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None]
        fp = os.path.join(HERE, 'render', f'music{tag}-ringout.wav')
        sf.write(fp, y.astype(np.float32), SR, subtype='PCM_24')
        out['ringout'] = dict(file=os.path.relpath(fp, V.REPO), seconds=round(len(y) / SR, 3),
                              lay='mix_episode.py lays it at Act Two\'s head and crossfades it out over 2.5 s from Act '
                                  'Two\'s own score entry: THE COPY\'s last F and the room\'s tail, continuous with '
                                  'the stem\'s last sample')
    return out


def restore_tail(tl, built, work, out_wav, mix):
    """assemble() fades every layer's last 5 ms; Act One's last layer runs on into the ring-out, so put its last 5 ms
    back (no notch at the seam)"""
    import soundfile as sf
    ct, st = built['tenant']
    x, _ = sf.read(os.path.join(work, f'{st.name}-underscore.wav'), always_2d=True, dtype='float64')
    N = tl.samples
    m = int(0.005 * SR)
    i0 = int(round(ct.T0 * SR))
    a, b = N - m, N
    seg = x[a - i0:b - i0].T
    fade = np.cos(0.5 * np.pi * np.linspace(0.0, 1.0, m))
    mix[:, a:b] += seg * (1.0 - fade)[None]
    sf.write(out_wav, mix.T.astype(np.float32), SR, subtype='PCM_24')
    return mix


# ================================================================ the audition (the séance's room colour)
def audition(tl, work):
    """the two 30 s samples the plan asks for (manifest E02-02; proposal D-35, D-49): (a) the glass harmonica with chip;
    (b) celesta and chip over a low reed pad.  Same harmony, phrases, chip and bass, on the lock's first 30 s (the
    click, V.O. 1, his question, ghost 1, Gerg, "one knock")"""
    import soundfile as sf
    from engine.mix import lufs
    adir = os.path.join(work, 'audition')
    res = {}
    for colour in ('glass', 'celesta'):
        c, sc = cue_seance(tl, colour=colour, end_at=30.0)
        print(f'[audition {colour}] rendered in {V.render_cue(sc, adir):.0f} s', flush=True)
        cj = json.load(open(os.path.join(adir, f'{sc.name}.cue.json')))
        qa = cj['qa']
        x, _ = sf.read(os.path.join(adir, f'{sc.name}-underscore.wav'), always_2d=True, dtype='float64')
        x = x.T
        i0 = int(round((0.0 - c.T0) * SR))
        y = x[:, i0:i0 + int(30.0 * SR)]
        spec = np.abs(np.fft.rfft(y.mean(0) * np.hanning(y.shape[1])))
        f = np.fft.rfftfreq(y.shape[1], 1.0 / SR)
        p = spec ** 2
        band = lambda lo, hi: float(p[(f >= lo) & (f < hi)].sum() / p.sum())    # noqa: E731
        # sustain vs attack: the share of 50 ms windows whose level is within 3 dB of the 1 s median (a pad's flatness)
        env = np.sqrt(np.convolve(y.mean(0) ** 2, np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'))[::int(0.05 * SR)]
        envd = 20 * np.log10(env + 1e-9)
        med = np.array([np.median(envd[max(0, i - 10):i + 10]) for i in range(len(envd))])
        flat = float(np.mean(np.abs(envd - med) < 1.5))
        res[colour] = dict(
            file=os.path.relpath(os.path.join(adir, f'{sc.name}-underscore.wav'), V.REPO), lufs_i=round(lufs(y), 2),
            band_2_6k_db=qa['band_2_6k_db'], centroid_hz=qa['centroid_hz'],
            share_80_300=round(band(80, 300), 3), share_300_1k=round(band(300, 1000), 3),
            share_1k_4k=round(band(1000, 4000), 3), flatness_within_1_5db=round(flat, 3),
            balance=qa['balance']['balance'], chip_share=qa['balance']['chip_share'],
            f_major_ok=qa['f_major']['ok'], knee=qa['knee_completion']['count'], warnings=cj.get('warnings', [])[:6])
        print(colour, json.dumps(res[colour], ensure_ascii=False))
    V.write_json(os.path.join(adir, 'audition.json'), res)
    return res


# ================================================================ main
def main():
    want_audition = '--audition' in sys.argv
    if want_audition:
        sys.argv.remove('--audition')
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    reals = mark_real(tl)
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else ('kokoro' if tag == '' else 'alt'))
    if want_audition:
        audition(tl, os.path.join(HERE, 'render', '_work'))
        return
    built = {k: fn(tl) for k, fn in CUES.items()}
    if args.dry:
        print(f'{SEG}: the lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, {tl.length:.2f} s; real lines '
              f'(from the plan): {len(reals)}. Its music runs:')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m[:110] or "(no music string)"}')
        for k, (c, sc) in built.items():
            print(k, sc.name, V.note_qa(sc), f'file T0 {c.T0:.3f}', sc.meta.get('clock_notes', ''))
            for t, lab, h in sorted(c.marks):
                print(f'   {t:8.3f} {"*" if h else " "} {lab[:150]}')
        return
    if args.render is not None:
        for k in (args.render or list(built)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, designed, stings = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, designed=designed)
    mix = restore_tail(tl, built, work, out, mix)
    laid[-1]['tail_restored'] = 'its last 5 ms fade put back: Act One runs on into render/music-el-ringout.wav'
    extras = write_extras(tl, built, work, tag)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', max(0.0, a0), min(tl.length, a1)) for k, (c, sc) in built.items()
            for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed, stings=stings)
    res['last_second_momentary_max'] = V.momentary_max(mix, tl.length - 1.0, tl.length)
    res['copy_momentary_max'] = V.momentary_max(mix, built['tenant'][0].ev['bH'], tl.length)
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
    # the mix's duck overrides: the knobs are the scene's story sound (S11): 5 dB under Gerg there, not 8
    cs = built['seance'][0]
    sections = []
    for k, (c, sc) in built.items():
        for lab, a0, a1 in c.sections:
            row = dict(section=f'{sc.name}: {lab}', start=round(max(0.0, a0), 3), end=round(min(tl.length, a1), 3))
            sections.append(row)
    sections.append(dict(section='e02-02: the knobs (pizzicato grains, from "Nobody" to the freeze)',
                         start=round(cs.ev['stream'] - 0.2, 3), end=round(cs.ev['freeze'] + 0.3, 3), duck_db=5.0,
                         duck_why='the grains are the knob wall\'s own sound (the score claims knob_tick_grain): they '
                                  'must read under Gerg\'s explanation (S11)'))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), lock_sha1=V.lock_sha1(path), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
        level='underscore (each cue at its engine master: E02-02 -20, E02-03 -21, E02-04 -20, E02-05 -20 LUFS-I), dry '
              'of dialogue; the mixer ducks it (E02-02 8 dB, E02-03 9, E02-04 9, E02-05 8; `sections` duck_db overrides)',
        cues=cues,
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab, exempt='a designed attack or entry on a story beat; '
                           'keep its attack') for k, (c, sc) in built.items() for t, lab, h in c.marks
                      if lab.startswith('DESIGNED HIT')],
        claims_sfx=['4.22:knob_tick_grain'],
        sections=sections, real_lines=reals, prelap=extras.get('prelap'), ringout=extras.get('ringout'),
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        sfx_requests=['ceiling_knock x3, ceiling_burst, landing_thunk: the room colour has dropped to its pad; tune the '
                      'knocks anywhere but on A (the pad is D-flat major 7 #11: F C G over D-flat)',
                      'go_stone_click: the Go figure starts the beat after it; keep it dry and short',
                      'knob_tick_grain: CLAIMED by the score (its pizzicato grains, 4.22, stopping on the freeze)',
                      'lamp_click (4.15): Nole\'s motif starts after it; candle_blow (4.36): the last chord rings free '
                      'from it',
                      'key_ring_jangle_1 (7.08): the downbeat of THE COPY\'s second bar; keep its pitch off A'],
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
    print('extras:', {k: v['file'] for k, v in extras.items()})


if __name__ == '__main__':
    main()
