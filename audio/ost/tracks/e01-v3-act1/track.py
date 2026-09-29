#!/usr/bin/env python3
"""Ep1 v3 · ACT ONE "research preview" (sc 5-12) · the music stem on the segment's own clock (0 = its first frame).

Brief (v3-score-a): "launch night: the sample's warm Build; the odometer: an exhilarating swing, then the heat;
Elgoog's code red: comic panic, pizzicato, the siren as a joke; the lobby deal: a charming caper swing, not dark
LEVERAGE; the duel: rivalry; the pause letter: one chill."  Mood map: v3-plan s6.  Every sync point is a timeline
reference (beats, lines, sounds, gaps), so it follows this lock, and the ElevenLabs-timed one with --el.

ROUND 3 (2026-09-27).  The showrunner, on the v3 film: "i liked the initial ost that was presented ... i thought the
beginning of most recent act1 was slightly corny sounding, but overall it was fine. we want to make sure we're
keeping a unique sound, not toning down to overly generic".  So the round-1 score stands (a round-2 "restrained"
pass was withdrawn), and only LAUNCH NIGHT's opening changes: the A-flat Rhodes / brushes / upright trio becomes the
show's own voice, and the odometer's swing becomes a straight driving figure (not cartoonish); the lift and the heat
turn are kept.

V3.2 (2026-09-28, the final lock, script draft 8.1; the times below are the v3 lock's): the act's downbeat on the
first frame (marked designed_hit in cues.json, audit-v31 #13); his post over the million (no band attack on its pop;
the violins climb into the cut); THE LANDLORD'S CALL (v32-7.03: the F pedal and the glass shimmer hold under it,
Tasya's Rhodes gives one soft chord on "pen", the siren's whine J-cuts in after the hang-up); the floor holds across
"weeks on" and the swing's new phrase enters on the key ring's jangle (v32-9.10k); weeks on's last chord crossfades
into Sydney (audit-v31 #14: no stale silence, no dip); HIS CLICK ships GTP-4 (11.04: the Build's whole pass from
the picture's click, the beat's frame 108); the lobby's entry on its first played note.  README.md has the table.

  s (Kokoro lock)  cue         what plays
  0 - 108.3        a_launch    LAUNCH NIGHT, warm and curious in the show's voice: the felt on each chord (the modal
                               home, two bars a chord: Fm9, Dbmaj9#11, Bbm9, Eb13sus4), a soft straight pulse on the
                               root (the chip's triangle: the rack LEDs' eighths) and a sub on each change; GERG'S
                               BUILD (the bible's F-minor cell) on the chip in compile passes in the gaps and under
                               Gerg's own lines; the felt carries every V.O. (the pulse rests); the Ache's colour
                               shades "what if it wakes up?"; Eb13sus hangs from "Your button." through the click,
                               and after the click THE KNEE'S FLAT LINE on the chip (F F F F, register and duty
                               varied): nothing happens yet; felt alone for Alyi and Mas (the Door's head in the
                               gaps, ending on its #4); the same bed for the chatbot
  108.3 - 131.8    a_launch    THE ODOMETER, a driving figure (straight): the triangle pulse in eighths (sixteenths
                               from the clunk) with a sub on the ones, the chip Build as the lead on the cut frames,
                               THE KNEE'S KINK (G Ab C, left hanging) as the odometer grows, a felt ostinato,
                               spiccato sixteenths from the clunk, the violins in octaves, brass accents; the
                               sample's mediant descent (Ab -> E -> C -> Ab: the landlord's cycle backwards); the
                               CLUNK drops it a major third; one brass hit on the post; the push into the MILLION on
                               the and-of-4 (the ratchet owns the downbeat); one hit on the cut to Rima
  131.8 - 149.6    a_launch    THE HEAT, THE BILL: the held chord voice-leads into THE ACHE over F on the tile (the
                               palette steps spell F minor); the F/C pedal only under the bill; it lets go on the tear
  148.5 - 184.9    code_red    ELGOOG'S CODE RED, on his phone's small speaker (era.futz 'phone'): the siren's whine
                               J-cuts in under the last puff; comic panic in C minor (straight pizzicato 16ths, xylo,
                               timpani, bassoon), THE SIREN AS A JOKE (the whole orchestra wailing its two-tone
                               swoop as the tower rises), thin under every line; the phone's lock kills it dead
  185.3 - 206.5    lobby       THE LANDLORD'S DEAL: THE JOB swing (MM-05 family), charming, in F dorian: the bass
                               walks in under the revolving door; the check jams on the swung and-of-4; the head on
                               vibes + straight mute; Tasya's Rhodes on the beats; the felt under his V.O. in the
                               freeze; the band STOPS DEAD on the collar's pop (a downbeat)
  206.5 - 214.6    -           the room only ("That collar suits you." / "it does." / "and the rent?"): designed
  214.6 - 236.2    floor       THE TERMS: Tasya's floor (A-flat maj9 -> C -> E -> A-flat, silent attacks), moving
                               on her sentence breaks; the key ring's jangle ends it
  235.2 - 260.9    lobby2      WEEKS ON: the swing back on a new phrase from the jangle (her Rhodes on the beats, the
                               jangles on the swung ands), lighter; dry under her quote; it holds under the TV and
                               rings out before Gerg closes his laptop (his button, in the room)
  262.5 - 300.5    duel        THE DUEL (MM-04 Lighthouse, B-flat minor, straight): Gerg's Build (chip + woodclick,
                               left pane) against Mario's Addendum (quartet, right pane) over the Lighthouse's
                               marimba, one tempo, trading bars; the Addendum gains a bar each time; the quartet's
                               held chord under Mas's post; on the turn the chip plays Mario's tail (Gerg ships it)
  301.2 - 316.5    pause       THE PAUSE LETTER: MM-17 low (Nole's Launch stack, THE JOB colour: a low F-minor-blues
                               walk on C7alt that never resolves, a muted-horn stack that falls one note short);
                               nobody pauses, and neither does it; it rings out before the reflection
  316.5 - 320.5    -           no score on the reflection (the pen's scratch; designed)
  320.5 - 322.5    threat      THREAT, once, on the pen's lift (low brass + sub on F, F-C-Gb, no third); its tail
                               rings into the black

  (v3.1)           sydney      PLANNED, built when the lock has sc 10: uncanny and clingy (a glass-and-celesta music
                               box in D-flat lydian, its chip echo a sixteenth late; the Ache under her real line)
  (v3.1)           atem        PLANNED, built when the lock has the ATEM crate: a cool, brief sting (F-C low, the
                               chip's open fifth, the Ache on glass; under 2 s)

Levels (engine underscore masters, per cue): a_launch -20 (the odometer +0.75 dB), code_red -22 after the phone,
lobby -20, floor -22, lobby2 -21, duel -20, pause -21, threat laid at -14 LUFS-M.  Dry of dialogue.

  OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render [cue ...] [--el]
  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --dry | --assemble [--el]
"""
from __future__ import annotations

import math
import os
import sys
from dataclasses import replace

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import v3lib as V   # noqa: E402
from v3lib import palette, nm, Drums, swing_ride, art, futz   # noqa: E402

SEG = 'act1'
Q, BAR, S16 = V.Q, V.BAR, V.S16


def dup(T, src, name, **kw):
    T[name] = replace(T[src], name=name, **kw)
    return T[name]


# ================================================================== A · LAUNCH NIGHT -> THE ODOMETER -> THE HEAT
BUILD_AB = ['Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5']
BUILD_F = ['F4', 'F4', 'G4', 'Ab4', 'C5', 'Ab4', 'G4', 'F4', 'F4', 'F4', 'G4', 'Ab4', 'C5', 'Eb5', 'C5', 'Ab4']
ACC4 = (1.0, 0.72, 0.84, 0.72)
CH = {  # chord -> (upper voicing, felt, bass root, bass fifth): the v3 sample's table (the odometer's harmony).
    'Abmaj9':    (['C4', 'Eb4', 'G4', 'Bb4'], ['Eb3', 'G3', 'C4'], 'Ab2', 'Eb2'),
    'Abmaj9/C':  (['Eb4', 'G4', 'Bb4', 'C5'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Dbmaj9#11': (['F3', 'Ab3', 'C4', 'Eb4'], ['Db3', 'Ab3', 'C4', 'F4'], 'Db3', 'Ab2'),
    'Bbm9':      (['Ab3', 'C4', 'Db4', 'F4'], ['Db3', 'Ab3', 'C4'], 'Bb2', 'F2'),
    'Cm7':       (['Bb3', 'Eb4', 'G4'], ['C3', 'G3', 'Eb4'], 'C3', 'G2'),
    'Eb13sus4':  (['Db4', 'F4', 'Ab4', 'C5'], ['Eb3', 'Ab3', 'Db4', 'F4'], 'Eb2', 'Bb2'),
    'Ab69':      (['C4', 'Eb4', 'F4', 'Bb4'], ['Ab3', 'Eb4', 'F4'], 'Ab2', 'Eb3'),
    'E69':       (['Ab3', 'Db4', 'Gb4', 'B4'], ['E3', 'B3', 'Gb4'], 'E2', 'B2'),
    'B13sus4':   (['A3', 'Db4', 'E4', 'Ab4'], ['B2', 'A3', 'E4'], 'B2', 'Gb2'),
    'C69':       (['E3', 'A3', 'D4', 'G4'], ['C3', 'G3', 'D4'], 'C3', 'G2'),
}
# ROUND 3 (2026-09-27, the showrunner: "the beginning of most recent act1 was slightly corny sounding"): launch night
# leaves the A-flat Rhodes / brushes / upright trio for the show's own voice: the felt, the chip Build (the bible's
# F-minor cell), a soft straight pulse (the chip's triangle, the rack LEDs' eighths) and a sub on the chord changes,
# in the modal home, two bars a chord; the knee's flat line on the click (nothing happens), its kink as the curve lifts.
LN = {   # launch night: (felt voicing, pulse root, sub)
    'Fm9':       (['Ab3', 'C4', 'G4'], 'F3', 'F1'),
    'Dbmaj9#11': (['Ab3', 'C4', 'Eb4', 'G4'], 'Db3', 'Db1'),
    'Bbm9':      (['Db4', 'F4', 'C5'], 'Bb2', 'Bb1'),
    'Eb13sus4':  (['Eb3', 'Ab3', 'Db4', 'F4'], 'Eb3', 'Eb1'),
    'Fache':     (['C4', 'Db4', 'G4'], 'F3', 'F1'),      # "And what if it wakes up?": the Ache's colour, once
    'Abwarm':    (['Ab2', 'Eb3', 'C4', 'G4'], 'Ab2', 'Ab1'),   # v3.3 M1: "it likes me.": the one warm arrival
}
LOOP_LN = ['Fm9', 'Fm9', 'Dbmaj9#11', 'Dbmaj9#11', 'Bbm9', 'Bbm9', 'Eb13sus4', 'Eb13sus4']
LOOP_CH = ['Dbmaj9#11', 'Dbmaj9#11', 'Bbm9', 'Bbm9', 'Fm9', 'Fm9', 'Eb13sus4', 'Eb13sus4']
# the odometer, straight (round 3): per-bar bass for the driving pulse, and the felt ostinato's chord tones
ODO_OST = {'Eb13sus4': ['Db5', 'Ab4', 'F4', 'Ab4'], 'Ab69': ['Eb5', 'C5', 'Ab4', 'C5'],
           'Dbmaj9#11': ['F5', 'C5', 'Ab4', 'C5'], 'E69': ['E5', 'B4', 'Gb4', 'B4'], 'B13sus4': ['E5', 'B4', 'Gb4', 'B4'],
           'C69': ['G5', 'D5', 'C5', 'D5']}


def cell(shift=0):
    """GERG'S BUILD (OST-BIBLE s2.6) in A-flat major: degrees 1 1 2 3 5 3 2 1 | 1 1 2 3 5 7 5 3 (the sample's)"""
    return [nm(p) + shift for p in BUILD_AB]


def tracks_a():
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    T['felt_mech'].gain_db = -14.0
    T['lead'].gain_db, T['lead'].sends = -6.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['tri'].gain_db, T['tri'].eq = -4.0, [('lp', 900), ('hp', 45)]    # the pulse: the chip's triangle bass
    T['sub'].gain_db = -10.0
    T['timp'].gain_db = -6.0
    for k in ('vln1', 'vln2'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    for k in ('vla', 'vc', 'cb'):
        T[k].gain_db, T[k].sends = -2.0, {'hall': -10, 'room': -16}
    for k in ('tpt', 'tbn'):
        T[k].gain_db = -9.0
    T['glasspad'].gain_db = -12.0
    T['rhodes'].gain_db, T['rhodes'].sends = -6.0, {'room': -12, 'plate': -12}   # v3.2: Tasya's one chord on the call
    # the heat's F2 cello pedal on its own track, notched at the cello's ~111 Hz body resonance (an A2 that the
    # engine's F-major check traced to the strings on the first render: nothing written, a resonance)
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]            # (the Ab2 of the turn rings it too: render 2)
    T['cb'].eq = list(T['cb'].eq) + [V.PIZZ_NOTCH]
    dup(T, 'vc', 'vc_f')
    dup(T, 'vc', 'vc_s', gain_db=-5.0)                         # the odometer's spiccato pulse
    return T


def place_passes(c, t0, t1, vel=0.29, allow=('gerg',), spacing=4.2, first=None):
    """the Build's compile passes (4 / 8 / 12 / 16 straight 16ths) in the gaps of [t0, t1): never inside a V.O.
    or anyone's line but Gerg's, never on the heels of a line; about one per `spacing` seconds"""
    tl = c.tl
    out, last = [], -1e9
    for g0, g1 in tl.gaps(t0, t1, min_len=0.75, pad_before=0.1, pad_after=0.5, allow_who=allow):
        t = c.next16(g0)
        while t < g1 - 0.7:
            if t - last < spacing:
                t = c.next16(last + spacing)
                continue
            room = g1 - t - 0.05
            cnt = max([k for k in (16, 12, 8, 4) if k * S16 <= room] or [0])
            if cnt == 0:
                break
            if tl.talking(t, t + cnt * S16, pad=0.02, kinds={'vo', 'mas', 'real'}):
                t += Q
                continue
            out.append((t, cnt, vel))
            last = t
            t = c.next16(t + max(spacing, cnt * S16 + 0.5))
    return out


def whine_t(tl):
    """code red's J-cut: v3.5 (the first weeks, v35-10.*) under his phone's siren whoop as it lights red among the
    others (v35-10.08's siren_whoop_F, the SFX's; the score's whine joins it through the phone); v3.2 (the landlord's
    call, v32-7.03) the siren whines through his phone's small speaker as he lowers it, just after the hang-up tick;
    v3.1 under the last puff of steam (7.02), which holds 1 s longer"""
    wh = tl.snd_any('siren_whoop_F', tl.B('8.01') - 3.0, tl.B('8.01')) if tl.has('8.01') else []
    if wh:
        return min(wh[-1] + 0.02, tl.B('8.01') - 0.1)
    if tl.has('v32-7.03'):
        hang = tl.snd('v32-7.03', 'handset_hangup', default=tl.E('v32-7.03') - 0.7)
        return min(hang + 0.05, tl.B('8.01') - 0.3)
    steam = tl.snd('7.02', 'steam_hiss', default=tl.B('7.02') + 0.45)
    return min(steam + 2.05, tl.B('8.01') - 0.6)


def call_out(tl):
    """where launch night's cue (the call) hands off: v3.5 the first weeks' match cut (v35-10.01: his phone's screen
    becomes the first stranger's phone); before, code red's whine J-cut"""
    return tl.B('v35-10.01') if tl.has('v35-10.01') else whine_t(tl)


def cue_a(tl):
    GROWS = tl.B('6.01')
    clunk = tl.snd('6.02', 'letter_clunk', default=tl.B('6.02'))
    # the grid is anchored on the CLUNK (the set-piece's hero sound) as bar 48: on the Kokoro lock the odometer's
    # beats are whole bars (6.01 = bar 46, 6.04 = 50, 6.06 = 52); on a lock where 6.01 is a frame or two short
    # (the ElevenLabs one: 4.875 s) the clunk, the post and the million stay on their bars
    # (bar numbers count from a bar 1 just before the act's first frame, so a longer launch night gets more bars)
    n_pre = math.ceil((clunk + 1.0) / BAR)
    c = V.Cue('a_launch', tl, anchor=clunk, anchor_bar=n_pre + 1, bars=n_pre + 20, swing=0.0)
    T = tracks_a()
    bar, bt, sw = c.bar, c.bt, c.sw
    rb = lambda t: int(round(c.bar_of(t)))                                 # noqa: E731
    b_click = rb(tl.B('5.08'))
    b_two = b_click + 1
    b_chat = rb(tl.B('5.10'))
    b_lift = rb(tl.B('5.12'))
    b_grow = rb(clunk) - 2
    b_clunk = rb(clunk)
    has_post = tl.has('6.04')                              # v3.1 cut the post (6.04, O1)
    b_post = rb(tl.B('6.04')) if has_post else rb(clunk) + 2
    b_mill = rb(tl.B('6.06'))
    hit = tl.B('6.08')
    heat = tl.B('6.09')
    tear = tl.B('7.02')
    steam = tl.snd('7.02', 'steam_hiss', default=tear + 0.45)
    whine = call_out(tl)                                     # v3.5: the first weeks' match cut (before: code red's J-cut)
    call = tl.B('v32-7.03') if tl.has('v32-7.03') else None  # v3.2: the landlord's call, between the tear and the alert
    notes_off = []
    for lab, t, b in [('the odometer grows (6.01)', GROWS, b_grow)] + ([('post', tl.B('6.04'), b_post),
                                                                         ('million', tl.B('6.06'), b_mill)]
                                                                        if has_post else []):
        if abs(bar(b) - t) > 0.06:
            notes_off.append(f'{lab} at {t:.3f} is {t - bar(b):+.3f} s off its bar')

    def fch(ps, t, d, v, roll=0.014, span_end=None):
        return c.pch('felt', ps, t, d, v, roll=roll, span_end=span_end)

    def build16(t0, count, vel, shift=0, idx0=0, stop_at=None, felt_double=True, pizz=False, duty=0.5):
        ps = cell(shift)
        if duty == 0.25:
            vel *= 1.2
        for i in range(count):
            t = t0 + i * S16
            if stop_at is not None and t >= stop_at - 0.01:
                break
            d = S16 * 0.62 if stop_at is None else min(S16 * 0.62, stop_at - t - 0.005)
            j = (idx0 + i) % 16
            c.n('lead', ps[j], t, d, vel * ACC4[i % 4], True, duty=duty, att=0.002, dec=0.09, sus=0.45, rel=0.035)
            if felt_double and i == 0:
                c.n('felt', ps[j] - 12, t, 0.5, 0.2)
            if pizz and i % 4 == 0:
                c.n('vln1', ps[j], t, 0.2, 0.3, art='pizz')

    def vo_bar(b):
        t0, t1 = bar(b), bar(b) + BAR
        return sum(max(0.0, min(t1, l['end']) - max(t0, l['on'])) for l in tl.lines_in(t0, t1, kinds={'vo'})) > 0.8

    def mas_room(t0, t1=None, pad=0.08):
        return tl.talking(t0, t1, pad, kinds={'mas'})

    def clear_of_mas(t, latest, vo=True):
        hit_ = tl.lines_in(t, t + 1e-3, 0.08, kinds={'mas'}) + (tl.lines_in(t, t + 1e-3, 0.05, kinds={'vo'})
                                                                  if vo else [])
        if not hit_:
            return t
        t2 = max(l['end'] for l in hit_) + 0.06
        return t2 if t2 < latest else None

    wake = [l for l in tl.lines_in(tl.B('5.05'), tl.E('5.05')) if l['who'] == 'alyi']
    b_wake = rb(wake[0]['on']) if wake else None
    if b_wake is not None and b_wake < b_click - 1:
        c.mark(bar(b_wake), 'the Ache\'s colour, once, under "And what if it wakes up?" (the Build gives way on the '
               'cut to her)', hit=False)

    # v3.3: the Ache's colour holds until his answer ("still a preview.") when it falls in the next bar, so no chord
    # change lands just after the cut to Alyi turning to him (5.06; the cut check's +16 dB on the v3.3 lock)
    ans = [l for l in tl.lines_in(tl.B('5.06'), tl.E('5.06')) if l['who'] == 'mas'] if tl.has('5.06') else []
    hold_ache = bool(b_wake is not None and ans and bar(b_wake + 1) <= ans[0]['on'] < bar(b_wake + 2))

    def harm_ln(b):
        if b_wake is not None and (b == b_wake or (hold_ache and b == b_wake + 1)) and b < b_click - 1:
            return 'Fache'
        if b >= b_click - 1:
            return 'Eb13sus4'
        return LOOP_LN[(b - 2) % len(LOOP_LN)]

    # v3.1 (mood §4 #2): "for its first minute only Gerg's Build (chip) and Mas's felt"; the pulse and the sub join
    # when the chat flatters him (5.10), in the show's voice (round 3: no trio)
    pulse_from = b_chat

    def glow(b0, b1, harm):
        """launch night's bed: the felt at each chord change (or under the V.O., which it carries), a soft straight
        pulse on the root (the chip triangle; the rack LEDs' eighths) and a sub on the change; nothing starts
        inside one of Mas's lines, and the pulse rests under the V.O."""
        prev = None
        last_end = -1e9
        for b in range(b0, b1):
            name = harm(b)
            fe, root, sub = LN[name]
            t = bar(b) if bar(b) >= 0.6 else 0.0             # (a bar at the head: its chord is the act's downbeat)
            cut_ = [bb['t0'] for bb in tl.beats if -0.02 < t - bb['t0'] < 0.35]
            if cut_ and t >= 0.6:                            # v3.4: a change just after a cut pre-laps it instead
                t = cut_[0] - (0.25 if abs(t - cut_[0]) < 0.02 else 0.1)   # (sound leads; v3.5: a change ON a cut
                #   pre-laps it 0.25 s: the v3.5 grid put one on the 5.04 cut, +26 dB out of the last chord's decay)
            vo = vo_bar(b)
            change = name != prev
            prev = name
            nxt_mas = tl.lines_in(bar(b + 1), bar(b + 1) + 0.2, 0.08, kinds={'mas'})

            def through(t0, dd):                              # hold through a line of his that blocks the next strike
                return max(dd, (max(l['end'] for l in nxt_mas) + 0.3 - t0) if nxt_mas else dd)
            if vo:
                dd = through(t, 2.4)
                fch(fe, t, dd, 0.15)
                last_end = t + dd
            elif change or last_end < bar(b + 1) - 0.4:     # a change, or the last chord dies in this bar: (re)strike
                tt0 = t if change else max(t, last_end - 0.3)
                tt = clear_of_mas(tt0, (t + Q * 2) if change else bar(b + 1) - 0.3)
                if tt is not None:
                    dd = through(tt, min(4.8, 2 * BAR - (tt - t)) if change else bar(b + 1) - tt + 0.3)
                    if tt == 0.0 and dd > 2.0:
                        # the head (a lock whose bar 2 falls at the first frame): as on the others, the downbeat
                        # chord's pedal lifts at 1.45 s, and its low F with it; the chord re-strikes softly at 1.5 s
                        fch(fe, 0.0, 1.45, 0.15, roll=0.02)
                        fch(fe, 1.5, dd - 1.5, 0.11, roll=0.02)
                    else:
                        fch(fe, tt, dd, 0.15 if change else 0.12, roll=0.02)
                    last_end = tt + dd
                    if b >= pulse_from:
                        c.n('sub', sub, tt, 1.2, 0.34, True, punch=0.0, click=0.0, decay=0.9)
            for k in range(8):
                tp = bar(b) + k * Q / 2
                if b < pulse_from or tp < 0.4 or vo or tl.talking(tp, tp + 0.05, pad=0.05, kinds={'vo', 'mas'}):
                    continue
                busy = tl.talking(tp, tp + 0.05, pad=0.05)
                c.n('tri', root, tp, Q / 2 * 0.7, (0.3 if k % 4 == 0 else 0.24) * (0.8 if busy else 1.0), True,
                    att=0.004, dec=0.1, sus=0.5, rel=0.04)

    def double_dur(t, d=0.5):
        """the Build's felt double (F3) only where no pedal can hold it: a held F3 rings on as the bass under the
        chord, with the chip's A-flat pulses over it (the F-major check's trace on the v3.2 EL and v3.3 locks).
        Returns its length, or None (no double) when a pedalled chord is down at the pass or catches it"""
        tc = c.clk(t)
        spans = c.ped.get('felt', [])
        if any(a - 0.01 <= tc <= b for a, b in spans):
            return None
        nxt = [a for a, _ in spans if a > tc]
        d = min(d, (min(nxt) - tc - 0.06) if nxt else d)
        return d if d >= 0.08 else None

    def build_f(t0, count, vel, felt_double=True):
        for i in range(count):
            t = t0 + i * S16
            c.n('lead', BUILD_F[i % 16], t, S16 * 0.62, vel * ACC4[i % 4], True, duty=0.25, att=0.002, dec=0.09,
                sus=0.45, rel=0.035)
            if felt_double and i == 0 and double_dur(t) is not None:
                c.n('felt', nm(BUILD_F[0]) - 12, t, double_dur(t), 0.18)

    # ---- A1: from the first frame (the felt on the button), the Build in compile passes
    # the act's downbeat (5.01: "HARD CUT on the downbeat, out of the card"): the felt's Fm9 with its low F on the
    # first frame, tight; cues.json marks it `designed_hit`, so the mix's act-head fade leaves it (audit-v31 #13)
    # (the low F under the first chord only; on a lock whose bar 2 falls at the head, the glow's first chord is the
    # downbeat's, struck once)
    c.n('felt', 'F2', 0.0, 1.1 if bar(2) < 0.6 else min(1.1, bar(2) - 0.1), 0.17, rel=0.2)   # (off before a pedal can catch it)
    if bar(2) >= 0.6:
        fch(LN['Fm9'][0], 0.0, bar(2) - 0.05, 0.15, roll=0.008)
    c.mark(0.0, 'A1 THE DOWNBEAT (a designed hit, on the first frame): the felt on the button (Fm9 over its low F); '
           'the Build compiles')
    glow(2, b_click, harm_ln)
    vo1 = tl.lines_in(0.0, tl.E('5.02'), kinds={'vo'})
    first_end = (vo1[0]['on'] - 0.2) if vo1 else 4.0
    passes = []
    t_a = c.next16(0.55)
    if t_a + 12 * S16 < first_end:                       # the button's program: 4, then 8
        passes += [(t_a, 4, 0.30), (c.next16(t_a + 4 * S16 + 0.5), 8, 0.32)]
    passes += place_passes(c, first_end + 0.5, bar(b_click) - 0.05)
    if bar(b_click) - 16 * S16 - 0.05 > (passes[-1][0] + 2.0 if passes else 0) and \
            not tl.talking(bar(b_click) - 16 * S16, bar(b_click), kinds={'vo', 'mas', 'real'}):
        passes.append((bar(b_click) - 16 * S16, 16, 0.3))     # a 16-note pass ends on the click's bar
    for t0, cnt, v in passes:
        build_f(t0, cnt, v)
        c.mark(t0, f'the Build: compile pass ({cnt})')
    c.section('A1 launch night: the felt, a soft pulse, the Build (F minor, the chip)', 0.0, bar(b_click))
    # ---- the click: Eb13sus held; THE KNEE'S FLAT LINE on the chip (F F F F, register and duty varied): nothing
    # happens yet
    fch(LN['Eb13sus4'][0], bar(b_click), 2.45, 0.14, roll=0.01)
    c.n('sub', 'Eb1', bar(b_click), 1.4, 0.3, True, punch=0.0, click=0.0, decay=1.0)
    click = tl.snd('5.08', 'dialog_ok_click', default=bar(b_click) + 1.0)
    fl0 = c.next_beat(click + 0.2)
    for k, (p, duty, v) in enumerate((('F4', 0.5, 0.26), ('F5', 0.25, 0.22), ('F4', 0.125, 0.24), ('F3', 0.25, 0.2))):
        tt = fl0 + k * Q
        if tt < tl.E('5.08') + 0.4 and not tl.talking(tt, tt + 0.3, kinds={'mas', 'vo', 'real'}):
            c.n('lead', p, tt, Q * (0.5 if k < 3 else 0.9), v, True, duty=duty, att=0.003, dec=0.15, sus=0.3,
                rel=0.06)
    c.mark(fl0, 'the click: the knee\'s flat line on the chip (F F F F): nothing happens yet')
    c.section('the click: one held chord, the flat line', bar(b_click), bar(b_two))
    # ---- A2: felt only; Alyi and Mas; the Door's head in the gaps (Ab -> Db | C -> G: it ends on the #4)
    t = bar(b_two)
    ls = [l for l in tl.lines_in(tl.B('5.09'), tl.E('5.09')) if l['kind'] != 'vo']
    alyi = [l for l in ls if l['who'] == 'alyi']
    mas = [l for l in ls if l['who'] == 'mas']
    if len(alyi) >= 2 and len(mas) >= 2:
        a1l, m1, a2l, m2 = alyi[0], mas[0], alyi[1], mas[1]
        t5 = a2l['end'] + 0.12
        fch(['Db3', 'Ab3', 'C4', 'Eb4'], t, t5 - t, 0.17, roll=0.018, span_end=t5)
        c.ch('felt', ['Db3', 'Ab3'], bar(b_two + 1) + Q * 2, 3.0, 0.12, roll=0.02)
        d1 = a1l['end'] + 0.03
        d2 = min(m1['on'] - 0.3, d1 + 0.42)
        d3 = m1['end'] + 0.06
        d4 = min(a2l['on'] - 0.25, d3 + 0.34)
        for p, tt, dd, vv, lab in (('Ab4', d1, 0.5, 0.22, 'the Door: Ab4 (after his first line)'),
                                   ('Db5', d2, 1.4, 0.21, 'the Door: Db5'),
                                   ('C5', d3, 0.4, 0.19, 'the Door: C5 (after "you counted.")'),
                                   ('G4', d4, 1.6, 0.19, 'the Door: G4, the #4 held (it never cadences)')):
            c.n('felt', p, tt, dd, vv)
            c.mark(tt, lab)
        fch(['Db3', 'Ab3', 'C4', 'F4'], t5, m2['end'] + 0.1 - t5, 0.15, roll=0.016, span_end=m2['end'] + 0.1)
        fch(LN['Eb13sus4'][0], m2['end'] + 0.1, max(1.2, bar(b_chat) - m2['end'] - 0.05), 0.16, roll=0.014)
    else:
        fch(['Db3', 'Ab3', 'C4', 'Eb4'], t, bar(b_chat) - t, 0.16)
    c.mark(bar(b_two), 'A2: felt only, Dbmaj9(#11) (the deceptive IV after the click)')
    c.section('A2 the two-hander: felt only (the Door in the gaps)', bar(b_two), bar(b_chat))
    # ---- A3: the chatbot: the same bed, the Build soft in the gaps
    # v3.3 M1 (mood-analysis-v32 s3.2, s4 #1): LAUNCH NIGHT'S ONE WARM ACCENT, the payoff to the click.  The chat
    # flatters him; on "it likes me." the felt arrives on A-flat major (Abmaj7, its root at last), and right after his
    # line the Build plays one pass in its A-flat major (the colour it has at Gerg's call and at 2 AM; the odometer
    # takes it up), under Gerg's "It likes everyone...".  One arrival, then the dominant again under the V.O. and into
    # the counter.  No trio, no Rhodes, no new bed: the same felt, pulse and chip
    warm = None
    likes = [l for l in tl.lines_in(tl.B('5.11'), tl.E('5.11'), kinds={'mas'})] if tl.has('5.11') else []
    if likes:
        lk = likes[0]
        b_w = int(math.floor(c.bar_of(lk['on'] + 0.05) + 1e-6))
        if b_chat <= b_w < b_lift - 1:
            t_p = c.next16(lk['end'] + 0.12)
            stop_ = min([l['on'] - 0.15 for l in tl.lines_in(t_p, bar(b_lift), kinds={'vo', 'mas', 'real'})] +
                        [bar(b_lift) - 0.2])
            cnt = max([k for k in (16, 12, 8) if t_p + k * S16 <= stop_] or [0])
            if cnt:
                warm = (b_w, t_p, cnt)

    def harm_chat(b):
        if warm is not None and warm[0] <= b < min(warm[0] + 2, b_lift - 1):
            return 'Abwarm'
        return 'Eb13sus4' if b == b_lift - 1 else LOOP_CH[(b - b_chat) % 8]
    glow(b_chat, b_lift, harm_chat)
    for t0, cnt, v in place_passes(c, bar(b_chat), bar(b_lift) - 0.2, vel=0.27, spacing=4.5):
        if warm is not None and t0 < warm[1] + warm[2] * S16 + 0.5 and t0 + cnt * S16 > bar(warm[0]) - 1.0:
            continue                                    # the warm pass has this stretch
        build_f(t0, cnt, v)
        c.mark(t0, f'the Build: compile pass ({cnt})')
    if warm is not None:
        b_w, t_p, cnt = warm
        for i in range(cnt):
            t = t_p + i * S16
            c.n('lead', cell()[i % 16], t, S16 * 0.66, 0.31 * ACC4[i % 4], True, duty=0.5, att=0.002, dec=0.1,
                sus=0.5, rel=0.05)
        c.n('felt', 'Ab3', t_p, 0.6, 0.18)
        c.mark(bar(b_w), 'M1: the felt arrives on A-flat major (Abmaj7) with "it likes me." (the one warm arrival)',
               hit=False)
        c.mark(t_p, f'M1 THE WARM ACCENT: the Build\'s pass in its A-flat major ({cnt}), after "it likes me." '
               '(the payoff to the click)')
        c.section('M1 the warm accent: A-flat major, the Build\'s pass (the payoff to the click)', bar(b_w),
                  min(bar(b_w + 2), bar(b_lift - 1)))
    c.section('A3 the chatbot flatters: the felt, the pulse, the Build', bar(b_chat), bar(b_lift))

    # ---- A4: THE ODOMETER, a driving figure (round 3: straight, no ride or walking bass): the chip Build as the
    # lead on the cut frames, the triangle pulse in eighths with a sub on the ones, a felt ostinato from the growth,
    # spiccato sixteenths from the clunk, the violins in octaves, brass accents; the sample's mediant descent kept
    ODO_ROOT = {b_lift: ('Eb13sus4', 'Eb2'), b_grow: ('Ab69', 'Ab2'), b_grow + 1: ('Dbmaj9#11', 'Db3'),
                b_clunk: ('E69', 'E2'), b_clunk + 1: ('B13sus4', 'B2'), b_post: ('C69', 'C3'),
                b_post + 1: ('C69', 'C3'), b_mill: ('Ab69', 'Ab2')}

    def drive(b, vel, step=Q / 2, ost=True, spic=False, from_beat=1.0):
        name, root = ODO_ROOT.get(b, ('Ab69', 'Ab2'))
        t0, t1 = bt(b, from_beat), min(bar(b + 1), hit)
        V.pulse(c, 'tri', lambda t: root, t0, t1, step, vel, att=0.003, dec=0.08, sus=0.6, rel=0.03,
                accent=lambda i: 1.15 if i % int(round(Q / step * 2)) == 0 else 0.92)
        if from_beat == 1.0:
            c.n('sub', nm(root) - 12 if nm(root) >= nm('C2') else root, bar(b), 0.6, 0.4, True, punch=1.0, click=0.0,
                decay=0.5)
        if ost:
            pat = ODO_OST[name]
            for j in range(8):
                tt = bar(b) + j * Q / 2
                if tt >= t1 - 0.01 or tt < t0 - 1e-6:
                    continue
                c.n('felt', pat[j % 4], tt, Q * 0.45, 0.2 if j % 4 == 0 else 0.15)
        if spic:
            V.pulse(c, 'vc_s', lambda t: nm(root) + (12 if nm(root) < nm('G2') else 0), t0, t1, S16, 0.28,
                    art='spic')

    if b_grow - b_lift >= 2:
        # v3.5 (5.12 is 4.6 s: the wait, USERS: 0, Gerg's three refreshes, then the counter rolls): the pulse alone
        # through the wait, a held Eb13sus; the Build's 4 + 8 on the counter's first rolls
        drive(b_lift, 0.24, ost=False)
        fch(LN['Eb13sus4'][0], bar(b_lift), 2 * BAR - 0.1, 0.12, roll=0.012)
        c.mark(bar(b_lift), 'A4 THE WAIT (v3.5): USERS: 0: the pulse alone, a held Eb13sus', hit=False)
        rolls = tl.snd_any('counter_roll', tl.B('5.12'), tl.E('5.12'))
        tr = c.next16(rolls[0]) if rolls else bar(b_lift + 1)
        for bb in range(b_lift + 1, b_grow):
            drive(bb, 0.3, ost=False)
        build16(tr, 4, 0.36, felt_double=False, duty=0.25)
        build16(c.next16(tr + 4 * S16 + 0.3), 8, 0.4, idx0=4, felt_double=False, duty=0.25)
        c.mark(tr, 'A4 THE LIFT: the counter rolls (the pulse, the Build 4 + 8)')
    else:
        drive(b_lift, 0.3, ost=False)
        build16(bar(b_lift), 4, 0.36, felt_double=False, duty=0.25)
        build16(bt(b_lift, 3), 8, 0.4, idx0=4, felt_double=False, duty=0.25)
        c.mark(bar(b_lift), 'A4 THE LIFT: the counter ticks (the pulse, the Build 4 + 8)')
    VL = []
    # phrase 1: the odometer grows (the knee's KINK on the chip, G A-flat C, left hanging: the curve lifts)
    drive(b_grow, 0.34)
    for k, p in enumerate(('G4', 'Ab4', 'C5')):
        c.n('lead', p, bt(b_grow, 1 + k), Q * 0.8, 0.4, True, duty=0.25, att=0.002, dec=0.12, sus=0.4, rel=0.06)
    vo6 = tl.lines_in(bar(b_grow), bar(b_grow + 1), kinds={'vo'})
    if vo6:
        fch(['Eb3', 'Ab3', 'C4', 'F4'], vo6[0]['on'] - 0.3, 1.9, 0.16, roll=0.012)
    c.mark(bar(b_grow), 'phrase 1: the odometer grows: the knee\'s kink (G Ab C), left hanging')
    drive(b_grow + 1, 0.36)
    build16(bar(b_grow + 1), 12, 0.44, felt_double=False, duty=0.25)
    VL += [('Ab4', bt(b_grow + 1, 1), Q), ('Bb4', bt(b_grow + 1, 2), Q), ('C5', bt(b_grow + 1, 3), Q),
           ('Eb5', bt(b_grow + 1, 4), Q)]
    c.n('timp', 'E2', clunk, 1.0, 0.44)
    c.n('sub', 'E1', clunk, 0.9, 0.55, True, punch=2.0, click=0.0, decay=0.8)
    drive(b_clunk, 0.4, step=S16, spic=True)
    build16(bar(b_clunk), 16, 0.44, shift=-4, felt_double=False, duty=0.25)
    VL += [('B4', bt(b_clunk, 1), 2 * Q), ('Ab4', bt(b_clunk, 3), 2 * Q)]
    c.mark(clunk, 'THE CLUNK: through the desk, the harmony drops a major third (E); the spiccato joins')
    drive(b_clunk + 1, 0.42, step=S16, spic=True)
    build16(bar(b_clunk + 1), 12, 0.42, shift=-4, felt_double=False, duty=0.25)
    VL += [('Gb4', bt(b_clunk + 1, 1), 2 * Q), ('Db5', bt(b_clunk + 1, 3), Q), ('B4', bt(b_clunk + 1, 4), Q)]
    if has_post:
        # phrase 2: the post (C, one brass hit, then thin: the pulse alone), the build to the million, the MILLION
        post = bar(b_post)
        V.stab(c, 'tpt', ['E5', 'A4'], post, vel=0.62, length=0.2)
        V.stab(c, 'tbn', ['D4', 'G3'], post, vel=0.6, length=0.22)
        drive(b_post, 0.28, ost=False)
        VL += [('C5', bt(b_post, 1), 4 * Q)]
        c.mark(post, 'the post: C, one brass hit, then thin (the pulse and the held violins)')
        drive(b_post + 1, 0.44, step=S16, spic=True)
        build16(bar(b_post + 1), 12, 0.46, shift=-8, felt_double=False, duty=0.25)
        VL += [('D5', bt(b_post + 1, 1), 2 * Q), ('Eb5', bt(b_post + 1, 3), 1.6 * Q)]
        push = bt(b_mill - 1, 4.5)
        c.n('lead', 'Eb5', bt(b_mill - 1, 4), S16 * 1.6, 0.44, True, duty=0.25, att=0.002, dec=0.12, sus=0.3, rel=0.05)
        c.n('lead', 'Ab5', push, 0.55, 0.46, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
        V.stab(c, 'tpt', ['F5', 'C5'], push, vel=0.66, length=0.24)
        V.stab(c, 'tbn', ['Eb4', 'Bb3'], push, vel=0.62, length=0.26)
        c.n('sub', 'Ab1', push, 0.8, 0.5, True, punch=1.5, click=0.0, decay=0.7)
        c.n('timp', 'Ab2', push, 1.0, 0.4)
        VL += [('Ab5', push, bt(b_mill, 3) - push)]
        c.mark(push, 'the push into the MILLION (the and-of-4): brass + the tag "shipped" (Eb5 -> Ab5)')
        c.mark(bar(b_mill), 'THE MILLION: no attack on the downbeat (the odometer ratchet owns it)', hit=False)
        drive(b_mill, 0.34, from_beat=2.0)

    else:
        # v3.1 (no post): the clunk's bar, then the last second before the million: B13sus with the spiccato, a
        # tremolo swell, the Build climbing; a one-beat break; the push on the and-of-4 of the million's own grid;
        # the million's downbeat is the ratchet's; the pulse comes back on its beat 2
        m = tl.B('6.06')
        tb0 = bar(b_clunk + 1)
        brk = m - Q
        # the clunk bar's violin line stops at the break (its B13sus notes would sound over the million's A-flat)
        VL = [(p, t0, min(d, brk - t0)) for p, t0, d in VL if t0 < brk - 0.05]
        name, root = ('B13sus4', 'B2')
        V.pulse(c, 'tri', lambda t: root, tb0, brk, S16, 0.44, att=0.003, dec=0.08, sus=0.6, rel=0.03)
        V.pulse(c, 'vc_s', lambda t: 'B2', tb0, brk, S16, 0.3, art='spic')
        c.n('sub', 'B1', tb0, 0.5, 0.42, True, punch=1.0, click=0.0, decay=0.5)
        for inst, p in (('vln1', 'Db5'), ('vln2', 'Gb4'), ('vla', 'E4')):
            c.n(inst, p, tb0, brk - tb0 + 0.05, 0.44, art='trem', att=max(0.2, brk - tb0 - 0.1), rel=0.08)
        k = 0
        for i in range(16):
            t = tb0 + i * S16
            if t >= brk - 0.01:
                break
            c.n('lead', cell(-4)[(8 + i) % 16], t, S16 * 0.62, 0.5 * ACC4[i % 4], True, duty=0.25, att=0.002,
                dec=0.09, sus=0.45, rel=0.035)
        push = m - Q / 2
        c.n('lead', 'Eb5', brk + S16, S16 * 1.6, 0.44, True, duty=0.25, att=0.002, dec=0.12, sus=0.3, rel=0.05)
        c.n('lead', 'Ab5', push, 0.55, 0.46, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
        V.stab(c, 'tpt', ['F5', 'C5'], push, vel=0.66, length=0.24)
        V.stab(c, 'tbn', ['Eb4', 'Bb3'], push, vel=0.62, length=0.26)
        c.n('sub', 'Ab1', push, 0.8, 0.5, True, punch=1.5, click=0.0, decay=0.7)
        c.n('timp', 'Ab2', push, 1.0, 0.4)
        VL += [('Db5', tb0, brk - tb0), ('Ab5', push, m + 2 * Q - push)]
        c.mark(tb0, 'the last second before the million: B13sus, the tremolo swell, the Build climbing')
        c.mark(brk, 'a one-beat break before the million', hit=False)
        c.mark(push, 'the push into the MILLION (the and-of-4): brass + the tag "shipped" (Eb5 -> Ab5)')
        c.mark(m, 'THE MILLION: no attack on the downbeat (the odometer ratchet owns it)', hit=False)
        t = m + Q
        j = 0
        pat = ODO_OST['Ab69']
        while t < hit - 0.01:                                  # the pulse back on the million's own grid
            c.n('tri', 'Ab2', t, Q / 2 * 0.8, 0.34 * (1.15 if j % 4 == 0 else 0.92), True, att=0.003, dec=0.08, sus=0.6,
                rel=0.03)
            c.n('felt', pat[(j + 2) % 4], t, Q * 0.45, 0.18 if j % 4 == 0 else 0.14)
            t += Q / 2
            j += 1
        c.n('sub', 'Ab1', m + Q, 0.6, 0.4, True, punch=1.0, click=0.0, decay=0.5)
        VL += [('G5', m + 2 * Q, Q), ('Eb5', m + 3 * Q, Q)]
        pc = tl.snd_any('post_click', tl.B('6.06'), tl.E('6.06'))
        post_t = pc[0] if pc else None
        rem = hit - (m + 4 * Q)
        if post_t is not None and rem > 0.3:
            # v3.2 (6.06): HIS POST pops over the million (its send pop on F, the SFX's): no band attack on it; the
            # drive runs on and the violins climb F5 -> Ab5 into the cut to Rima (v3.3's shorter 6.06: F5 alone)
            VL += ([('F5', m + 4 * Q, 2 * Q), ('Ab5', m + 6 * Q, rem - 2 * Q - 0.02)] if rem >= 3 * Q else
                   [('F5', m + 4 * Q, rem - 0.02)])
            c.mark(post_t, 'his post pops over the million (the SFX\'s pop on F); the drive runs on, the violins '
                   'climb to the cut', hit=False)
    # one band hit on the cut to Rima, then a held Abmaj9 under the two short lines
    V.clip_before(c, hit, insts={'tri', 'felt', 'vc_s', 'lead'}, rel=0.05)
    V.drop_window(c, hit, hit + 60, insts={'tri', 'vc_s', 'lead'})
    c.a.notes = [nt for nt in c.a.notes if not (nt.inst == 'felt' and hit - 0.01 < c.clk.x(nt.start) < heat - 0.1
                                               and nt.dur < 0.5)]
    V.stab(c, 'tpt', ['F5', 'Bb4'], hit, vel=0.66, length=0.3)
    V.stab(c, 'tbn', ['Eb4', 'C4', 'Ab3'], hit, vel=0.62, length=0.32)
    c.n('sub', 'Ab1', hit, 1.2, 0.5, True, punch=1.0, click=0.0, decay=1.0)
    c.n('timp', 'Ab2', hit, 1.4, 0.44)
    c.ch('felt', ['Ab2', 'Eb3', 'C4'], hit, 2.4, 0.22, roll=0.01)
    c.n('lead', 'Ab5', hit, 0.3, 0.36, True, duty=0.25, att=0.002, dec=0.15, sus=0.2, rel=0.08)
    c.mark(hit, 'the band hit on the cut to Rima; then the held chord (thin under "Low-key." / "Basement.")')
    for p, t0, d in VL:
        c.n('vln1', p, t0, d * 0.98, 0.4, art='sus', att=0.06, rel=0.25)
        c.n('vln2', nm(p) - 12, t0, d * 0.98, 0.36, art='sus', att=0.06, rel=0.25)
    for nt in c.a.notes:                                     # thin under "someone noticed."
        tt = c.clk.x(nt.start)
        if vo6 and vo6[0]['on'] - 0.25 <= tt < vo6[0]['end'] and nt.inst in ('tri', 'felt', 'sub'):
            nt.vel *= 0.7
    c.section('A4 the counter: a driving figure (the pulse, the chip Build, the violins, brass accents)', bar(b_lift),
              hit)
    # ---- A5: the held chord, THE TURN into the Ache, the heat, the bill; out on the tear
    c.rebow('vc', 'Ab2', hit + 0.05, heat + 0.25, 0.2, first_att=0.5, last_rel=0.7, art='sus', lp=1300)
    c.rebow('vla', 'C3', hit + 0.05, tear + 0.6, 0.17, first_att=0.5, last_rel=1.6, art='sus', lp=1500)
    ache_end = min(heat + 13.6, tear - 0.3)
    c.rebow('vln2', 'G4', hit + 0.05, ache_end, 0.16, first_att=0.5, last_rel=1.2, art='sus', lp=3000)
    c.n('vln1', 'Eb5', hit + 0.05, heat - hit + 0.1, 0.16, art='sus', att=0.5, rel=0.4, lp=3200)
    c.n('vln1', 'Db5', heat, ache_end - heat, 0.17, art='sus', att=0.55, rel=1.2, lp=3200)
    ped_end = (whine + 0.6) if call is not None else (tear + 0.6)    # v3.2: the pedal holds under the call
    c.rebow('vc_f', 'F2', heat, ped_end, 0.22, first_att=0.9, last_rel=1.6 if call is None else 0.6, art='sus',
            lp=1100)
    c.ch('glasspad', ['G4', 'Db5'], heat + 0.4, ache_end - heat - 0.4, 0.2, roll=0.0, rel=1.0)
    c.mark(heat, 'THE TURN: Abmaj9 -> the Ache over F (vc Ab2 -> F2, vln Eb5 -> Db5; C and G held)')
    if call is None:
        c.ch('glasspad', ['G4', 'Db5'], tear + 0.05, max(3.0, whine - tear + 0.6), 0.14, roll=0.0, rel=0.9)
        c.mark(tear, 'the tear: the pedal lets go, the Ache rings once more; the siren takes over', hit=False)
        c.section('A5 the held chord, then THE TURN: the Ache, the F pedal (the heat, the bill)', hit, tear + 2.5)
    else:
        # v3.2 THE CALL (v32-7.03): "the swing's bass pedal and the shimmer hold under the call; Tasya's Rhodes gives
        # one soft chord on 'pen' (his colour arriving before he does); the siren takes over".  The F pedal holds;
        # the Ache's glass rings on from the tear and, on "pen", its D-flat falls to C under his Rhodes chord (the
        # landlord's floor colour over F: G Bb C Eb, no third); the siren's whine takes over after the hang-up
        tas = [l for l in tl.lines_in(call, tl.E('v32-7.03')) if l['who'] == 'tasya']
        t_pen = (tas[-1]['end'] - 0.28) if tas else call + 6.8
        c.ch('glasspad', ['G4', 'Db5'], tear + 0.05, t_pen - tear + 0.35, 0.14, roll=0.0, rel=0.9)
        c.ch('glasspad', ['G4', 'C5'], t_pen, max(1.0, whine - t_pen + 0.5), 0.12, roll=0.0, rel=0.8)
        c.ch('rhodes', ['G3', 'Bb3', 'C4', 'Eb4'], t_pen, max(1.2, whine - t_pen + 0.2), 0.2, roll=0.012)
        c.mark(tear, 'the tear: the Ache rings once more; the F pedal holds on into the call', hit=False)
        c.mark(call, 'THE CALL (v3.2): the F pedal and the shimmer hold under it', hit=False)
        c.mark(t_pen, 'the call: Tasya\'s Rhodes, one soft chord on "pen" (his colour before he arrives); '
               'the glass D-flat falls to C')
        c.section('A5 the held chord, then THE TURN: the Ache, the F pedal (the heat, the bill)', hit, call)
        c.section('THE CALL (v3.2): the F pedal and the shimmer hold; Tasya\'s Rhodes on "pen"', call, whine)
    macro = [(bar(1), 0.0), (bar(b_lift) - 0.4, 0.0), (bar(b_lift) - 0.05, -1.0), (hit + 0.4, -1.0),
             (hit + 2.0, 0.0), (tear + 4.0, 0.0)]
    end = max(tear + 2.6, whine + 0.7)
    meta = dict(
        id='a_launch', title='Launch Night / The Odometer / The Heat (Ep1 v3 r3, Act One sc 5-7)', mm='(to picture)',
        usage='BI', family='P01 colours (felt, a soft chip pulse, the Build) -> P11 energy, straight (a driving figure) '
                           '-> the Ache',
        tone='warm and curious in the show\'s voice; then a drive that builds; then the first dark bar',
        scenes=['Ep1 v3 Act One sc 5-7'],
        motifs=["Gerg's Build (F minor on launch night; A-flat in the odometer)", 'the knee\'s flat line (the click) '
                'and its kink (the growth)', "Alyi's Door head on the felt (Ab Db | C G)",
                'the Build\'s tag "shipped" (Eb5 -> Ab5)', 'the Ache (G4 + Db5 over F)'],
        motif_ids=[], key='F minor modal (Fm9, Dbmaj9#11, Bbm9, Eb13sus4); the odometer Ab -> E -> C -> Ab; F + the Ache',
        composer='v3-score-a (composer X), from the v3 sample\'s cue A, 2026-09-27',
        underscore_lufs=-20.0, album_lufs=-16.0,
        room_sfx=[dict(t0=c.clk(0.0), t1=c.clk(end), sfx='server_hum (the bullpen, up through the floor)')],
        sfx_slots=[dict(t=round(c.clk(clunk), 3), sfx='letter_clunk: through the desk (the hero sound)')]
        + [dict(t=round(c.clk(t), 3), sfx='odometer_ratchet: 1,000,000') for t in tl.snd_any('odometer_ratchet')]
        + [dict(t=round(c.clk(t), 3), sfx='dialog_ok_click: the launch button') for t in
           tl.snd_any('dialog_ok_click', tl.B('5.08'), tl.E('5.08'))]
        + [dict(t=round(c.clk(t), 3), sfx='post_click: his post over the million (on F)') for t in
           tl.snd_any('post_click', tl.B('6.06'), tl.E('6.06'))]
        + ([dict(t=round(c.clk(t), 3), sfx=f'{n} (the call)') for n in ('call_ring', 'handset_hangup')
            for t in tl.snd_any(n, call, tl.E('v32-7.03'))] if call is not None else []),
        audition=['0-68 s: the felt, the soft pulse and the Build under the talk: warm and curious in the show\'s '
                  'voice, never lounge; any Nintendo feel is a fail', 'the click: the knee\'s flat line: nothing happens', 'the two-hander (5.09): the felt alone and the Door in the gaps: tender, not sad-piano',
                  'the counter (5.12-6.06): a drive that builds, straight: exciting, not cartoonish',
                  'the turn (6.09): the Ache should land because everything before was warm'],
        clock_notes=notes_off)
    sc = c.finish(T, meta, length_end=end, macro=macro, end_fade=(max(tear + 1.2, whine - 0.3), end - 0.02))
    return c, sc


# ================================================================== CODE RED (on the phone: C minor, straight, comic panic)
def tracks_cr():
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc', 'cb'):
        T[k].sends = {'room': -12, 'hall': -16}
    dup(T, 'vln1', 'siren1', gain_db=-3.0)
    dup(T, 'vln2', 'siren2', gain_db=-3.0)
    dup(T, 'vln2', 'pz2', gain_db=-2.0)
    dup(T, 'vla', 'pzv', gain_db=-2.0)
    dup(T, 'vc', 'pzc', gain_db=0.0)
    dup(T, 'hn', 'hn_s', gain_db=-4.0)
    T['xylo'].gain_db = -8.0
    T['woodclick'].gain_db = -10.0
    T['timp'].gain_db = -6.0
    T['bsn'].gain_db = -3.0
    T['tuba'].gain_db = -5.0
    T['snare'].gain_db = -10.0
    return T


def siren(c, inst, t0, dur, lo, vel, swoops=2, up=5.0, att=0.15):
    """THE SIREN AS A JOKE: one bowed note bending up and down (a two-tone swoop), `swoops` times"""
    per = dur / swoops
    bend = [(0.0, 0.0)]
    for k in range(swoops):
        bend += [(k * per + per * 0.45, up), (k * per + per * 0.95, 0.0)]
    c.n(inst, lo, t0, dur, vel, art='sus', att=att, rel=0.3, bend=bend)


def cue_code_red(tl):
    t_in = whine_t(tl)                                       # the J-cut: after the hang-up (v3.2) / the steam (v3.1)
    lock = tl.snd('8.06', 'dialog_ok_click--chip', default=tl.B('8.06') + 0.9)
    c = V.Cue('code_red', tl, anchor=tl.B('8.01'), anchor_bar=3, bars=20, swing=0.0)
    T = tracks_cr()
    tower = tl.B('8.02')
    radnus = tl.B('8.03')
    crypt = tl.B('8.04')
    lany = tl.B('8.05')
    # the whine alone (J-cut): high strings, one swoop, into the alert
    siren(c, 'siren1', t_in, tl.B('8.01') - t_in + 0.4, 'C5', 0.3, swoops=1, up=6.0, att=0.4)
    c.mark(t_in, 'the siren\'s whine J-cuts in ' + ('under his phone\'s whoop as it lights red among the others '
                                                    '(v3.5)' if tl.has('v35-10.08') else
                                                    'as he lowers the phone, after the hang-up (v3.2)'
                                                    if tl.has('v32-7.03') else 'under the last puff') +
           ' (on his phone)', hit=False)
    # the panic ostinato: straight pizz 16ths from the alert (C minor, varied pitches), pizz bass on 8ths
    fig = ['C5', 'Eb5', 'D5', 'C5', 'G4', 'Ab4', 'G4', 'F#4', 'G4', 'C5', 'Bb4', 'Ab4', 'G4', 'Eb4', 'F4', 'F#4']
    bass8 = ['C2', 'G2', 'C2', 'G2', 'Ab1', 'Eb2', 'G1', 'D2']
    t = c.next16(tl.B('8.01') + 0.05)
    i = 0
    while t < lock - 0.01:
        busy = tl.talking(t, t + 0.01, pad=0.1)
        big = tower <= t < radnus
        p = fig[i % 16]
        if i % 2 == 0 or big:
            c.n('pz2', p, t, 0.18, (0.36 if big else 0.3) * (0.6 if busy else 1.0) * (1.1 if i % 4 == 0 else 0.9),
                art='pizz')
        if i % 4 == 2 and not busy:
            c.n('pzv', nm(p) - 12, t, 0.18, 0.26, art='pizz')
        if i % 2 == 0:
            c.n('pzc', bass8[(i // 2) % 8], t, 0.22, 0.44 * (0.75 if busy else 1.0), art='pizz')
        if big and i % 4 == 0:
            c.n('xylo', nm(p) + 12, t, 0.2, 0.34)
            c.n('woodclick', 76, t, 0.05, 0.4)
        t += S16
        i += 1
    # the tower rises: timpani roll into it, then the whole orchestra wails the swoop (a joke the size of a tower)
    for k in range(10):
        c.n('timp', 'C2', tower - 0.62 + k * 0.0625, 0.08, 0.18 + 0.03 * k)
    c.n('timp', 'C2', tower, 1.2, 0.5)
    siren(c, 'siren1', tower, radnus - tower + 0.2, 'G4', 0.4, swoops=2, up=6.0)
    siren(c, 'siren2', tower, radnus - tower + 0.2, 'C4', 0.36, swoops=2, up=6.0)
    siren(c, 'hn_s', tower + 0.05, radnus - tower + 0.1, 'G3', 0.34, swoops=2, up=5.0)
    c.n('tuba', 'C2', tower, radnus - tower, 0.3, art='sus', att=0.1, rel=0.3)
    c.mark(tower, 'THE SIREN AS A JOKE: the tower rises; the orchestra wails the swoop')
    # Radnus, serene: the ostinato soft, a slow hi-lo siren far back (flute) under the talk
    t = radnus + 0.1
    k = 0
    while t < lany - 0.2:
        p = ('Ab5', 'D5')[k % 2]                           # a slow far-off two-tone (it turns, in the back)
        c.n('fl', p, t, 2 * Q * 0.97, 0.13, art='nv', rel=0.25)
        t += 2 * Q
        k += 1
    # the crypt: the founders climb out: a staccato tuba/bassoon ascent (a phrase, not one note per step)
    asc = ['C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2', 'B2', 'C3']
    for k, p in enumerate(asc):
        tt = crypt + 0.3 + k * Q / 2
        c.n('bsn', nm(p) + 12, tt, 0.18, 0.34)
        c.n('tuba', p, tt, 0.2, 0.3, art='stac')
    c.mark(crypt + 0.3, 'the crypt: a staccato ascent (tuba + bassoon)')
    # little panic interjections in the gaps of the exchange (xylo run, a pizz flurry)
    for g0, g1 in tl.gaps(crypt + 2.0, lany, min_len=0.9, pad_before=0.2, pad_after=0.25):
        tt = c.next16(g0)
        for j, p in enumerate(['G5', 'Ab5', 'Bb5', 'C6', 'D6', 'Eb6']):
            if tt + j * S16 >= g1:
                break
            c.n('xylo', p, tt + j * S16, 0.15, 0.3)
        c.mark(tt, 'a xylophone run in a gap')
    # the lanyards: the siren turns once more, then the phone locks: dead stop
    siren(c, 'siren1', lany + 0.1, 2.0, 'G4', 0.3, swoops=1, up=6.0)
    siren(c, 'hn_s', lany + 0.15, 1.9, 'G3', 0.26, swoops=1, up=5.0)
    c.n('snare', 38, lany + 0.1, 0.1, 0.3)
    V.clip_before(c, lock, rel=0.03)
    V.drop_window(c, lock, lock + 30)
    c.mark(lock, 'THE LOCK: the phone locks; its audio stops dead (5 ms)', hit=False)
    V.thin(c, {'talk': dict(drop={'xylo', 'woodclick', 'hn_s', 'siren2'}, soften={'siren1': 0.6, 'bsn': 0.7,
                                                                                    'tuba': 0.7, 'timp': 0.6}),
               'real': dict(drop={'xylo', 'woodclick', 'hn_s', 'siren1', 'siren2', 'pz2', 'pzv'}),
               'mas': dict(drop={'xylo', 'woodclick'})}, t0=tl.B('8.01'))
    c.section('the whine (J-cut: ' + ('under the whoop, v3.5)' if tl.has('v35-10.08') else
                                     'after the call\'s hang-up)' if tl.has('v32-7.03') else 'under the last puff)'),
              t_in, tl.B('8.01'))
    c.section('the alert: the panic ostinato (pizz 16ths)', tl.B('8.01'), tower)
    c.section('the tower rises: the siren as a joke, the whole orchestra', tower, radnus)
    c.section('Radnus, serene; the crypt; the founders (thin under every line)', radnus, lany)
    c.section('the lanyards; the lock: dead stop', lany, lock)
    meta = dict(
        id='code_red', title='Elgoog\'s Code Red (Ep1 v3, Act One sc 8; on his phone)', mm='(to picture)', usage='VI',
        family='comic panic (a v3 colour): P11 energy, pizzicato; diegetic through the phone', diegetic=True,
        tone='comic panic, the siren as a joke', scenes=['Ep1 v3 Act One sc 7.02-8.06'], motifs=[], motif_ids=[],
        key='C minor, straight; the siren a bowed swoop up a tritone', composer='v3-score-a (composer X), 2026-09-27',
        underscore_lufs=-20.0, album_lufs=-16.0,
        audition=['the whole cue through the phone speaker: comic panic, not a real alarm; the siren a joke '
                  '(never a slide whistle)', 'thin enough under the founders\' exchange',
                  'the lock (8.06): the phone\'s audio cut dead: a diegetic stop, not a glitch'])
    sc = c.finish(T, meta, length_end=lock + 0.02, mutes=[(lock, lock + 3.0)])
    return c, sc


# ================================================================== LOBBY (THE JOB swing, F dorian, charming)
LOB = {   # (Rhodes on the beats, walk scale, root)
    'Fm11':      (['Ab3', 'C4', 'Eb4', 'Bb4'], ['F2', 'G2', 'Ab2', 'Bb2', 'C3', 'Db3', 'Eb3'], 'F2'),
    'Bb13':      (['Ab3', 'D4', 'G4'], ['Bb1', 'C2', 'D2', 'Eb2', 'F2', 'G2', 'Ab2'], 'Bb1'),
    'Dbmaj9#11': (['F3', 'C4', 'Eb4', 'G4'], ['Db2', 'Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3'], 'Db2'),
    'C7#9':      (['E3', 'Bb3', 'Eb4'], ['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2'], 'C2'),
    'C7#9b13':   (['E3', 'Bb3', 'Eb4', 'Ab4'], ['C2', 'Db2', 'Eb2', 'E2', 'G2', 'Ab2', 'Bb2'], 'C2'),
    'Ebm9':      (['Gb3', 'Db4', 'F4'], ['Eb2', 'F2', 'Gb2', 'Ab2', 'Bb2', 'Db3'], 'Eb2'),
}
LOB_BARS = {2: 'Fm11', 3: 'Fm11', 4: 'Bb13', 5: 'Fm11', 6: 'Dbmaj9#11', 7: 'C7#9', 8: 'Fm11', 9: 'Bb13'}
HEAD = [(2, 'F4/8 Ab4/8 C5/8 Eb5/8 D5/4 Bb4/8 C5/8'), (3, 'Bb4/8 C5/8 Ab4/4 F4/4 r/4'),
        (4, 'Eb5/8 D5/8 C5/8 Ab4/8 Bb4/4 r/4')]      # bar 2's last 8th is the check's jam (the push's C5)
FILLS = ['Eb5/8 D5/8 C5/4', 'C5/8 Ab4/8 F4/4', 'G4/8 Ab4/8 C5/4']
FILLS1 = ['Eb5/8 C5/8', 'Ab4/8 C5/8', 'D5/8 Bb4/8']            # one-beat fills for the short gaps
TAG_LINE = 'C5/8 Eb5/8 G5/8 F5/8 Eb5/8 C5/8 Bb4/8 Ab4/8 G4/4'


def tracks_lob():
    T = palette()
    T['ubass'].gain_db = -1.0
    T['ubass'].eq = list(T['ubass'].eq) + [V.PIZZ_NOTCH]
    T['cb_pizz'].gain_db = -9.0
    T['cb_pizz'].eq = list(T['cb_pizz'].eq) + [('peq', 112.0, -10.0, 5.0)]
    T['rhodes'].gain_db, T['rhodes'].sends = -3.0, {'room': -12, 'plate': -12}
    T['vibes'].gain_db, T['vibes'].sends = -3.0, {'room': -12, 'hall': -14}
    T['tpt'].gain_db, T['tpt'].sends = -4.0, {'room': -10, 'hall': -14}
    T['tpt'].latency_ms = 12
    T['tpt'].eq = [('peq', 1760, -7.0, 3.0), ('peq', 3000, -4.0, 0.8)]
    T['tbn'].gain_db = -4.0
    T['bsax'].gain_db = -3.0
    T['brush'].gain_db = 9.0
    T['swish'].gain_db = 3.0
    T['jazz'].gain_db = 4.0
    T['lead'].gain_db, T['lead'].eq = -10.0, [('lp', 5200), ('hs', 2400, -5.0)]
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    return T


def walk_eighth_free(c, b, name, nxt, rng, t_min=-1e9, t_max=1e9, vel=0.6, quarters=True):
    """a walking line through one bar (quarters, swung two-feel under the head) approaching the next root"""
    scl = [nm(p) for p in LOB[name][1]]
    root = nm(LOB[name][2])
    seq = [root]
    idx = 0
    for _ in range(2):
        idx = max(0, min(len(scl) - 1, idx + int(rng.choice([1, 2, 1, -1]))))
        seq.append(scl[idx])
    tgt = nm(LOB[nxt][2])
    seq.append(tgt + 1 if seq[-1] > tgt else tgt - 1)
    for k, p in enumerate(seq):
        t = c.bt(b, 1 + k)
        if t_min <= t < t_max:
            c.n('ubass', p, t, Q * 0.9, vel * (1.0 if k in (0, 2) else 0.92))
            c.n('cb_pizz', p, t, Q * 0.7, vel * 0.6, rel=0.16)


def cue_lobby(tl):
    import numpy as _np
    pop = tl.snd('9.08', 'collar_pop_F5', default=tl.B('9.08'))
    c = V.Cue('lobby', tl, anchor=pop, anchor_bar=10, bars=12, swing=1.0)
    T = tracks_lob()
    rng = _np.random.default_rng(909)
    doors = tl.snd_any('revolving_door', tl.B('9.01') - 2.5, tl.B('9.01') - 0.01)   # v3.5: 2018's end (v35-13.06)
    door = doors[0] if doors else tl.snd('8.06', 'revolving_door', default=tl.B('9.01') - 1.0)
    jam = tl.snd('9.01', 'glass_strain_2', default=c.sw(2, 4.5))
    freeze = tl.B('9.04')
    # the pickup under the revolving door (bar 1, beats 3-4), then the walk
    first = c.sw(1, 4.5)
    for p, beat in (('C2', 3), ('Eb2', 4)):
        t = c.bt(1, beat)
        if t > door - 0.3:
            c.n('ubass', p, t, Q * 0.9, 0.5)
            first = min(first, t)
    c.n('ubass', 'E2', c.sw(1, 4.5), Q * 0.3, 0.45)
    c.mark(first, 'the bass walks in under the revolving door', hit=False)
    for b in range(2, 10):
        name = LOB_BARS[b]
        nxt = LOB_BARS.get(b + 1, 'Fm11')
        walk_eighth_free(c, b, name, nxt, rng, t_max=pop - 0.02, vel=0.58)
        rh = LOB[name][0] if b != 9 else LOB['Bb13'][0]
        for k in range(4):                                       # Tasya's Rhodes on the beats
            t = c.bt(b, 1 + k)
            nm_ = 'C7#9b13' if (b == 9 and k >= 2) else name
            if t < pop - 0.05:
                c.ch('rhodes', LOB[nm_][0], t, Q * 0.55, 0.26 if k % 2 == 0 else 0.22, roll=0.005)
        Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.\nkick[vel=0.35]: o.......', bars=(b, b + 1),
                                   vel=0.55)
    # the check jams on the swung and-of-4: a push into bar 3 (vibes + a mute + the bari)
    V.stab(c, 'tbn', ['C3'], jam, vel=0.5, length=0.26)
    V.stab(c, 'bsax', ['F2'], jam, vel=0.5, length=0.26)
    c.n('vibes', 'C5', jam, 0.5, 0.4)
    c.n('tpt', 'C5', jam, 0.3, 0.36, art='straight', rel=0.1)
    c.mark(jam, 'the check jams: a push on the swung and-of-4')
    # the head (vibes + straight mute, unison; the chip on its top notes), bars 3-4, in the open
    for b, text in HEAD:
        t0 = c.bar(b)
        if not tl.talking(t0, t0 + BAR, kinds={'vo', 'real', 'mas'}) and not (freeze - 0.05 <= t0 < freeze + Q) \
                and not (t0 < freeze + Q <= t0 + BAR and tl.talking(freeze, freeze + 3.0, kinds={'vo'})):
            V.phrase(c, 'vibes', t0, text, 0.44, swing=1.0, rel=0.5)
            ns = V.phrase(c, 'tpt', t0, text, 0.4, swing=1.0, art='straight', rel=0.12)
            top = max(ns, key=lambda z: nm(z[1]))
            c.n('lead', nm(top[1]) + 12, top[0], 0.2, 0.2, True, duty=0.25, att=0.002, dec=0.1, sus=0.3, rel=0.05)
            c.mark(t0, f'THE JOB\'s head (bar {b})')
    # fills in the gaps of the partnership talk
    fi = 0
    for g0, g1 in tl.gaps(tl.B('9.06'), tl.B('9.07'), min_len=0.7, pad_before=0.12, pad_after=0.25):
        t = c.next8(g0)
        text = FILLS[fi % 3]
        if t + V.line_len(text) > g1:
            text = FILLS1[fi % 3]
        if t + V.line_len(text) <= g1 + 0.05:
            V.phrase(c, 'vibes', t, text, 0.4, swing=1.0, rel=0.5)
            c.mark(t, 'a vibes fill (a gap)')
            fi += 1
    # the check slides under the door: the head's tag, then the push, and the POP on the downbeat: dead stop
    t_tag = c.next_beat(max(tl.B('9.07'), max([l['end'] for l in tl.lines_in(tl.B('9.06'), tl.B('9.07'))] +
                                              [tl.B('9.07')]) + 0.2))
    V.phrase(c, 'vibes', t_tag, TAG_LINE, 0.46, swing=1.0, rel=0.5, stop_at=c.sw(9, 4.5) - 0.05)
    V.phrase(c, 'tpt', t_tag, TAG_LINE, 0.42, swing=1.0, art='straight', rel=0.12, stop_at=c.sw(9, 4.5) - 0.05)
    c.mark(t_tag, 'the check slides under the door: the head\'s tag')
    pushp = c.sw(9, 4.5)
    V.stab(c, 'tpt', ['E5', 'Bb4'], pushp, vel=0.52, length=0.14)
    V.stab(c, 'tbn', ['Eb4', 'Bb3'], pushp, vel=0.5, length=0.14)
    c.n('ubass', 'C2', pushp, 0.16, 0.6)
    c.n('rhodes', 'E3', pushp, 0.14, 0.3)
    c.mark(pushp, 'the last push (C7#9) on the swung and-of-4')
    V.clip_before(c, pop, rel=0.03)
    V.drop_window(c, pop, pop + 30)
    c.mark(pop, 'THE POP: the band stops dead on the downbeat (5 ms); the collar #3', hit=False)
    # the freeze: the band keeps moving (Mas does) but thins; the felt under the V.O.
    for l in tl.lines_in(freeze, tl.B('9.06'), kinds={'vo'}):
        c.pch('felt', ['Ab3', 'C4', 'Eb4'], l['on'] - 0.3, l['end'] - l['on'] + 0.6, 0.13, roll=0.02)
    V.drop_window(c, freeze, freeze + Q, insts={'rhodes', 'vibes', 'tpt', 'lead'})
    V.thin(c, {'vo': dict(drop={'vibes', 'tpt', 'lead', 'rhodes', 'bsax', 'tbn'}, soften={'ubass': 0.8}),
               'talk': dict(drop={'lead'}, soften={'vibes': 0.75, 'tpt': 0.7, 'rhodes': 0.85}),
               'mas': dict(drop={'vibes', 'tpt', 'lead'}, soften={'rhodes': 0.8}),
               'real': dict(drop={'vibes', 'tpt', 'lead', 'bsax', 'tbn'}, soften={'rhodes': 0.7})},
           t0=tl.B('9.01'), t1=pop)
    c.section('the pickup under the revolving door; the check jams', c.bt(1, 3), c.bar(3))
    c.section('THE JOB\'s head; the freeze' + (' (the felt under the V.O.)' if tl.lines_in(freeze, tl.B('9.06'),
                                                                                  kinds={'vo'}) else ''),
              c.bar(3), tl.B('9.06'))
    c.section('the partnership (thin under the talk; fills in the gaps)', tl.B('9.06'), t_tag)
    c.section('the check slides under the door; the push; the pop', t_tag, pop)
    meta = dict(
        id='lobby', title='The Landlord\'s Deal (Ep1 v3, Act One sc 9)', mm='MM-05 (family)', usage='BI',
        family='P06 THE JOB (Tasya\'s Rhodes colour)', tone='caper, charming: a swinging deal that stops on a pop',
        scenes=['Ep1 v3 Act One sc 9 (9.01-9.08)'], motifs=['THE JOB\'s head (F dorian)', 'Tasya\'s Rhodes on the beats'],
        motif_ids=[], key='F dorian; Bb13, Dbmaj9#11, C7#9; no A-natural',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-20.0, album_lufs=-16.0,
        sfx_slots=[dict(t=round(c.clk(jam), 3), sfx='glass_strain_2: the check jams'),
                   dict(t=round(c.clk(freeze), 3), sfx='freeze_hit_F: Tasya\'s card'),
                   dict(t=round(c.clk(pop), 3), sfx='collar_pop_F5: the downbeat is the pop\'s')],
        silence_windows=[(c.clk(pop) + 0.005, c.clk(pop) + 0.5, 'the pop: the stop', -90.0)],
        audition=['a charming caper swing, not LEVERAGE; Tasya\'s Rhodes on the beats reads as hers',
                  'the stop on the pop: the collar lands in silence'])
    sc = c.finish(T, meta, length_end=pop + 0.02, mutes=[(pop, pop + 3.0)])
    return c, sc


# ================================================================== FLOOR (the terms: Tasya's floor)
def ring_jangle(tl):
    """v3.2: the key ring, large, weeks on (v32-9.10k): its jangle (None on the older locks)"""
    if not tl.has('v32-9.10k'):
        return None
    return tl.snd('v32-9.10k', 'key_ring_jangle_2', default=tl.B('v32-9.10k') + 0.4)


def cue_floor(tl):
    terms = [l for l in tl.lines_in(tl.B('9.09'), tl.E('9.09')) if l['who'] == 'tasya' and l['end'] - l['on'] > 6.0]
    lt = terms[0] if terms else [l for l in tl.lines_in(tl.B('9.09'), tl.E('9.09')) if l['who'] == 'tasya'][-1]
    t_in = lt['on'] - 0.2
    jangle = tl.snd('9.09', 'key_ring_jangle_1', default=tl.E('9.09') - 1.0)
    jk = ring_jangle(tl)
    if jk is not None:           # v3.2: the floor holds across "weeks on" and lets go on the ring's jangle (v32-9.10k)
        jangle = jk
    c = V.Cue('floor', tl, anchor=t_in, anchor_bar=1, bars=12, swing=0.0)
    T = palette()
    for k in ('vln1', 'vln2', 'vla', 'vc'):
        T[k].gain_db, T[k].sends = -3.0, {'hall': -10, 'room': -16}
    T['rhodes'].gain_db, T['rhodes'].sends = -4.0, {'room': -12, 'plate': -12}
    brk = tl.sentence_breaks(lt['id'], n=4, min_gap=0.15)
    brk = [t for t in brk if t > t_in + 2.0][:3]
    while len(brk) < 3:
        brk.append((brk[-1] if brk else t_in) + 3.5)
    f1, f2, f3 = brk
    home_end = jangle + 1.05                        # it holds under the jangles into the swing's entry, then goes
    FLOOR = [(t_in, f1 + 0.7, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9'),
             (f1, f2 + 0.7, {'vc': 'C3', 'vla': 'E4', 'vln2': 'G4', 'vln1': 'B4'}, 'Cmaj9'),
             (f2, f3 + 0.7, {'vc': 'E3', 'vla': 'E4', 'vln2': 'Ab4', 'vln1': 'B4'}, 'Emaj9'),
             (f3, home_end, {'vc': 'Ab3', 'vla': 'Eb4', 'vln2': 'G4', 'vln1': 'C5'}, 'Abmaj9')]
    RH = {'Abmaj9': ['G3', 'Bb3', 'C4', 'Eb4'], 'Cmaj9': ['G3', 'B3', 'D4', 'E4'], 'Emaj9': ['Ab3', 'B3', 'Eb4', 'Gb4']}
    for i, (t0, t1, voices, name) in enumerate(FLOOR):
        for inst, p in voices.items():             # re-bowed (silent attacks): the library's sustains last 8-13 s
            c.rebow(inst, p, t0, t1, 0.21 if inst in ('vc', 'vla') else 0.2, seg=4.5, xf=1.0, first_att=0.9,
                    last_rel=1.3 if i == len(FLOOR) - 1 else 0.6, art='sus', lp=2600)
        if not tl.talking(t0, t0 + 0.3, pad=0.05, kinds={'mas'}):
            c.ch('rhodes', RH[name], t0 + 0.02, 1.4, 0.24, roll=0.008)
        c.mark(t0, f'Tasya\'s floor: {name} (silent attack; one Rhodes chord on her sentence break)', hit=False)
    c.mark(jangle, 'the key ring\'s jangle: the floor lets go' + (' (v3.2: the ring, large, weeks on; the swing comes '
           'in on it)' if jk is not None else ''), hit=False)
    c.section('THE TERMS: Tasya\'s floor (Ab -> C -> E -> Ab), on her sentence breaks', t_in, jangle)
    meta = dict(
        id='floor', title='The Terms: Tasya\'s floor (Ep1 v3, Act One sc 9.09)', mm='(to picture)', usage='BI',
        family='the landlord\'s colour (OST-BIBLE s2.16): held mediants, silent attacks', tone='a welcome that is a lease',
        scenes=['Ep1 v3 Act One 9.09'], motifs=['Tasya\'s floor (Abmaj9 -> Cmaj9 -> Emaj9 -> Abmaj9)'], motif_ids=[],
        key='A-flat major and its major-third mediants', composer='v3-score-a (composer X), 2026-09-27',
        underscore_lufs=-22.0, album_lufs=-16.0,
        audition=['the floor under her terms: warm and faintly ironic; the landlord owns the chord'])
    sc = c.finish(T, meta, length_end=home_end + 0.1, end_fade=(jangle + 0.15, home_end + 0.05))
    return c, sc


# ================================================================== LOBBY2 (weeks on: the swing back from the jangle)
def cue_lobby2(tl):
    import numpy as _np
    jangle = tl.snd('9.09', 'key_ring_jangle_1', default=tl.E('9.09') - 1.0)
    jk = ring_jangle(tl)
    if jk is not None:           # v3.2 (v32-9.10k): "the caper's new phrase comes in on the jangle": the walk's beat 3
        one = jk - 2 * Q
    else:
        one = jangle - Q * 2.0 / 3.0              # beat 1: the jangles fall on the swung ands
    c = V.Cue('lobby2', tl, anchor=one, anchor_bar=1, bars=14, swing=1.0)
    T = tracks_lob()
    rng = _np.random.default_rng(910)
    tv = tl.B('9.11')
    tele = tl.B('9.12')
    last = tl.B('9.13')
    close = tl.snd('9.13', 'folder_close', default=tl.E('9.13') - 1.2)
    bars = {1: 'Fm11', 2: 'Dbmaj9#11', 3: 'Fm11', 4: 'Bb13', 5: 'Ebm9', 6: 'Dbmaj9#11', 7: 'C7#9', 8: 'Fm11',
            9: 'Bb13', 10: 'Fm11', 11: 'Dbmaj9#11'}
    b = 1
    while c.bar(b) < last - 0.1:
        name = bars.get(b, 'Fm11')
        nxt = bars.get(b + 1, 'Fm11')
        t_lo = c.bt(1, 3) if b == 1 else -1e9
        walk_eighth_free(c, b, name, nxt, rng, t_min=t_lo, t_max=min(tv, last) if c.bar(b) < tv else last, vel=0.5)
        for k in range(4):
            t = c.bt(b, 1 + k)
            if t < c.bt(1, 3) or t >= last - 0.05 or (tv <= t < tele):
                continue
            c.ch('rhodes', LOB[name][0], t, Q * 0.55, 0.24 if k % 2 == 0 else 0.2, roll=0.005)
        if b >= 2 and not (tv <= c.bar(b) < tele) and c.bar(b) < last:
            Drums(c.a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..o...o.', bars=(b, b + 1), vel=0.45)
        b += 1
    # the TV (Radnus tap-dances on it): the band holds one chord and lets the TV have the rhythm
    c.ch('rhodes', LOB['Dbmaj9#11'][0], tv + 0.05, tele - tv, 0.2, roll=0.01)
    c.n('ubass', 'Db2', tv + 0.05, tele - tv, 0.4)
    c.mark(tv, 'the TV: the band holds a chord (the tap-dance is the TV\'s)', hit=False)
    # vibes fragments in the gaps (not on her quote)
    fi = 0
    for g0, g1 in tl.gaps(c.bar(2), tv - 0.2, min_len=1.35, pad_before=0.15, pad_after=0.3):
        t = c.next_beat(g0)
        text = FILLS[(fi + 1) % 3]
        if t + V.line_len(text) <= g1:
            V.phrase(c, 'vibes', t, text, 0.36, swing=1.0, rel=0.5)
            c.mark(t, 'a vibes fragment (a gap)')
            fi += 1
    # the last chord at the two-shot: held under "ours does that too."; v3.2 (audit-v31 #14): it rings through the cut
    # and crossfades into Sydney over 0.4 s (Fm9 -> her D-flat lydian: A-flat, C and G stay); before v3.1 it was gone
    # before the laptop closed
    sy = sydney_beats(tl)
    x_out = sy[0]['t0'] if sy else None
    ch_end = (x_out + 0.45) if x_out is not None else close - 0.3
    fin = c.next_beat(last)
    c.ch('rhodes', ['Ab3', 'C4', 'Eb4', 'G4'], fin, ch_end - fin, 0.2, roll=0.01)
    c.ch('vibes', ['C5', 'G5'], fin, ch_end - fin + 0.1, 0.26, roll=0.02)
    c.n('ubass', 'F2', fin, ch_end - fin - 0.1, 0.36)
    if x_out is not None:        # bowed vibes (C5 G5) sustain the chord to the cut, into Sydney's glass
        for p_ in ('C5', 'G5'):
            c.n('vibes', p_, fin + Q, ch_end - fin - Q, 0.16, art='bowed')
        # a soft re-strike after his line (when there is room), so the chord is still there at the cut
        mas_l = [l for l in tl.lines_in(last, x_out) if l['who'] == 'mas']
        rs = (mas_l[-1]['end'] + 0.08) if mas_l else x_out - 0.6
        if rs < x_out - 0.05:
            c.ch('rhodes', ['Ab3', 'C4', 'G4'], rs, x_out + 0.45 - rs, 0.14, roll=0.015)
    c.mark(fin, 'the last chord (Fm9, no motion), held under his line; ' + ('it crossfades into Sydney on the cut '
           '(0.4 s)' if x_out is not None else 'out before the laptop closes'), hit=False)
    V.thin(c, {'talk': dict(drop={'lead'}, soften={'vibes': 0.75, 'rhodes': 0.85}),
               'mas': dict(drop={'vibes', 'lead'}, soften={'rhodes': 0.8}),
               'real': dict(drop={'vibes', 'lead', 'tpt'}, soften={'rhodes': 0.6, 'brush': 0.6, 'swish': 0.7})},
           t0=c.bar(1), t1=last - 0.05)
    c.section('weeks on: the swing back on a new phrase from the jangle', c.bt(1, 3), tv)
    c.section('the TV and the telescope: one held chord, then the walk', tv, last)
    c.section('"ours does that too.": the last chord, ' + ('into Sydney (a crossfade)' if x_out is not None else
                                                           'out before the laptop closes'), last,
              x_out if x_out is not None else close)
    meta = dict(
        id='lobby2', title='Weeks On (Ep1 v3, Act One sc 9.10-9.13)', mm='MM-05 (family)', usage='BI',
        family='P06 THE JOB, light', tone='the deal is done; the landlord where he stood',
        scenes=['Ep1 v3 Act One 9.10-9.13'], motifs=['Tasya\'s Rhodes on the beats (the jangle on the ands)'],
        motif_ids=[], key='F dorian', composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0,
        album_lufs=-16.0,
        audition=['the swing back from the jangle: on a new phrase, the jangles on the swung ands',
                  'the last chord out before Gerg closes his laptop (his button is in the room)'])
    if x_out is not None:        # (the lay-in's crossfade: this rings 0.5 s past the cut, fading over its last 0.4 s)
        sc = c.finish(T, meta, length_end=x_out + 0.55, end_fade=(x_out + 0.1, x_out + 0.52))
    else:
        sc = c.finish(T, meta, length_end=close + 0.1, end_fade=(close - 0.9, close - 0.05))
    return c, sc


# ================================================================== DUEL (MM-04 Lighthouse: the Build vs the Addendum)
BUILD_BB = ['Bb4', 'Bb4', 'C5', 'Db5', 'F5', 'Db5', 'C5', 'Bb4', 'Bb4', 'Bb4', 'C5', 'Db5', 'F5', 'Ab5', 'F5', 'Db5']
ADD = 'Bb3/4 C4/4 Db4/4 F4/4 Eb4/4. Db4/8 C4/4 Bb3/4'
TAILS = ['C4/8 Db4/8', 'C4/8 Db4/8 Eb4/4', 'C4/8 Db4/8 Eb4/8 F4/8 Gb4/4', 'C4/8 Db4/8 Eb4/8 F4/8 Gb4/8 Ab4/8 Bb4/4']
DUEL_CH = {'Bbm9': ['Bb2', 'F3', 'Db4', 'C5'], 'Gbmaj7': ['Gb2', 'Db3', 'Bb3', 'F4'], 'Ebm9': ['Eb3', 'Gb3', 'Db4', 'F4'],
           'Fsus': ['F2', 'C3', 'Bb3', 'Eb4']}
DUEL_LOOP = ['Bbm9', 'Bbm9', 'Gbmaj7', 'Ebm9', 'Bbm9', 'Gbmaj7', 'Ebm9', 'Fsus']


def tracks_duel():
    T = palette()
    T['lead'].gain_db, T['lead'].sends = -4.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5500), ('hs', 2400, -4.0)]
    T['woodclick'].gain_db = -12.0
    T['xylo'].gain_db = -14.0
    T['marimba'].gain_db, T['marimba'].pan = -6.0, 0.35
    T['harp'].gain_db, T['harp'].pan = -8.0, 0.4
    T['svln'].gain_db, T['svln'].pan, T['svln'].sends = -1.0, 0.3, {'hall': -11, 'chamber': -12}
    for k, pan in (('vla', 0.35), ('vc', 0.4), ('cb', 0.45)):
        T[k].pan, T[k].sends, T[k].gain_db = pan, {'hall': -10, 'chamber': -13}, -2.0
    dup(T, 'vc', 'vc_pz', gain_db=-1.0, pan=0.0)
    for k in ('vc', 'vc_pz', 'cb', 'vla'):                  # the low strings' ~110 Hz body resonance (an A2) under the
        T[k].eq = list(T[k].eq) + [('peq', 110.0, -12.0, 3.0)]   # F7sus bar's F bass (v3.1 render 1's F-major trace)
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    return T


CLICK_1104_FRAME = 108          # v3.2: the picture's click in 11.04 (frame 108 of the beat, both locks; the pixel pass)


def waitlist_snap(tl):
    """v3.5 (sc 22, v35-22.01): the velvet rope snaps taut on the wall TV.  The lock carries no sound for it; the
    picture's caption puts it after the TV's two texts (0.2 s), so 0.9 s in (for the sound pass to confirm)"""
    return tl.B('v35-22.01') + 0.9 if tl.has('v35-22.01') else None


def cue_duel(tl):
    end = tl.B('v35-22.01') if tl.has('v35-22.01') else tl.B('12.01')   # v3.5: the waitlist comes before the letter
    four = tl.has('11.06')                                   # the v3 lock's four phrases; v3.1 has two (11.03-11.04)
    if four:
        c = V.Cue('duel', tl, anchor=tl.B('11.04'), anchor_bar=8, bars=20, swing=0.0)
    else:                                                    # v3.1: the letter's downbeat (12.01) on a bar line;
        n_b = math.ceil((end - tl.B('11.01') + 0.5) / BAR)   # bar 1 before the match cut
        c = V.Cue('duel', tl, anchor=end, anchor_bar=n_b + 1, bars=n_b + 6, swing=0.0)
    T = tracks_duel()
    cut = tl.B('11.01')
    split = tl.B('11.03')
    if four:
        post_b = tl.B('11.05')
        turn = tl.B('11.06')
        shutter = tl.snd('11.06', 'camera_shutter', default=turn + 2.6)
    else:                                                    # the turn in the last two bars: the chip copies the tail
        turn = end - 2 * BAR
        post_b = turn
        shutter = end - BAR / 2
    b_end = int(round(c.bar_of(end)))
    # v3.2 (11.04): GTP-4 goes out on HIS click, launch night's button.  The picture clicks on 11.04's frame 108
    # (the pixel pass; the sound pass lays the click there, the stick has none), on both locks.  The score starts the
    # Build's whole pass on the chip on that click: the launch-night click that did nothing, answered
    click = None
    cap4 = (tl.beats[tl.bi['11.04']]['b'].get('caption') or '').lower() if tl.has('11.04') else ''
    if not four and 'click' in cap4:
        cl = tl.snd_any('dialog_ok_click', tl.B('11.04'), tl.E('11.04'))
        click = cl[0] if cl else tl.B('11.04') + CLICK_1104_FRAME / V.FPS

    def chord(b):
        return DUEL_LOOP[(b - 1) % len(DUEL_LOOP)]

    # the laptop opens on the match cut: the chip boots (a 4-note pass), the pizz pulse starts (the pre-beat).
    # v3.1: the match cut is the Atem leak's (its sting, `atem`), so the boot waits for the talk to finish
    boot = cut + 0.02
    if atem_beat(tl) is not None and atem_beat(tl)['id'] == '11.01':
        ls = tl.lines_in(cut, split)
        boot = max([l['end'] for l in ls] + [cut]) + 0.15
    t = c.next16(boot)
    for i in range(4):
        c.n('lead', nm(BUILD_BB[i]), t + i * S16, S16 * 0.62, 0.3 * ACC4[i], True, duty=0.25, att=0.002, dec=0.09,
            sus=0.45, rel=0.035)
    c.mark(t, 'the laptop opens: the chip boots (4)')
    t = c.next8(cut + 0.4)
    while t < end - 0.02:
        b = int(c.bar_of(t))
        busy = tl.talking(t, t + 0.01, pad=0.1)
        c.n('vc_pz', DUEL_CH[chord(b)][0], t, 0.22, 0.4 * (0.75 if busy else 1.0), art='pizz')
        t += Q / 2
    # the Lighthouse (right pane): marimba + harp, the 3-note cell in quarters across 4/4, from the split
    cellp = ['F4', 'Bb4', 'Db5']
    t = c.next_beat(split)
    k = 0
    while t < end - 0.02:
        busy = tl.talking(t, t + 0.01, pad=0.1)
        c.n('marimba', cellp[k % 3], t, 0.5, 0.34 * (0.7 if busy else 1.0))
        if k % 3 == 0:
            c.n('harp', cellp[k % 3], t, 0.8, 0.44)
        t += Q
        k += 1
    # the harmony: a held quartet pad (vla + vc + cb), one chord a bar
    b0 = int(c.bar_of(split)) + 1
    for b in range(b0, b_end):
        ch = DUEL_CH[chord(b)]
        c.n('vc', ch[0], c.bar(b), BAR * 0.98, 0.2, art='sus', att=0.2, rel=0.4)
        c.n('vla', ch[2], c.bar(b), BAR * 0.98, 0.17, art='sus', att=0.2, rel=0.4)
    # trading bars from the split: odd bars the Build (chip + woodclick, left), even bars the Addendum (right)
    add_n = 0
    for b in range(b0, b_end):
        t0 = c.bar(b)
        if post_b - 0.05 <= t0 < turn - 0.05:
            continue                                            # Mas's post: the quartet's held chord only
        if t0 >= turn - 0.05:
            break
        vo_ = tl.talking(t0, t0 + BAR, kinds={'vo'})
        if (b - b0) % 2 == 0:
            if vo_:
                continue
            cnt = 16 if not tl.talking(t0, t0 + BAR, kinds={'talk', 'mas', 'real'}) else 8
            for i in range(cnt):
                tt = t0 + i * S16
                c.n('lead', nm(BUILD_BB[i % 16]), tt, S16 * 0.62, 0.32 * ACC4[i % 4], True, duty=0.25, att=0.002,
                    dec=0.09, sus=0.45, rel=0.035)
                if i % 4 == 0:
                    c.n('woodclick', 76, tt, 0.05, 0.36)
            c.mark(t0, f'the Build\'s bar (Gerg, left pane): {cnt}')
        else:
            if vo_:
                continue
            text = ADD + ' ' + TAILS[min(add_n, len(TAILS) - 1)]
            L = V.line_len(text)
            V.phrase(c, 'svln', t0, text, 0.36 if not tl.talking(t0, t0 + L) else 0.26, art='sus', att=0.05,
                     rel=0.3, stop_at=min(t0 + BAR * 2 - 0.02, post_b - 0.02 if t0 < post_b else turn - 0.02,
                                          1e9))
            c.mark(t0, f'the Addendum\'s bar (Mario, right pane), its tail {add_n + 1}')
            add_n += 1
    # the felt under the V.O. ("mario used to sit where gerg sits.")
    for l in tl.lines_in(split, end, kinds={'vo'}):
        c.pch('felt', ['Db4', 'F4', 'Bb4'], l['on'] - 0.3, l['end'] - l['on'] + 0.6, 0.13, roll=0.02)
    # Mas's post: the quartet's held chord (a real post: no motion), Mario's added line a soft two-note tail
    for inst, p in (zip(('vc', 'vla', 'svln'), ('Gb2', 'Db4', 'Bb4')) if four else ()):
        c.n(inst, p, post_b + 0.02, turn - post_b + 0.1, 0.2, art='sus', att=0.3, rel=0.4)
    if four:
        scrib = tl.snd('11.05', 'pen_scribble_short', default=post_b + 2.8)
        c.n('vla', 'C4', scrib + 0.1, 0.5, 0.16, art='sus', att=0.05, rel=0.2)
        c.n('vla', 'Db4', scrib + 0.4, 0.8, 0.16, art='sus', att=0.05, rel=0.3)
        c.mark(post_b, 'Mas\'s post: the quartet\'s held chord (no motion)', hit=False)
    # THE TURN: the Addendum's longest tail crosses the split; on the photograph the chip plays Mario's tail
    text = ADD + ' ' + TAILS[-1]
    V.phrase(c, 'svln', turn, text, 0.38, art='sus', att=0.05, rel=0.3, stop_at=shutter - 0.02)
    tail = [nm(p) + 12 for p, _ in V.parse_line(TAILS[-1]) if p]
    tt = c.next16(shutter + 0.02)
    for i, p in enumerate(tail):
        if tt + i * S16 * 2 >= end - 0.05:
            break
        c.n('lead', p, tt + i * S16 * 2, S16 * 1.2, 0.34, True, duty=0.25, att=0.002, dec=0.1, sus=0.4, rel=0.04)
    if click is not None:
        # HIS CLICK: the first note on the picture's click itself; the rest of the Build's pass on the grid's 16ths
        # (the click falls between them), up to the chip's copy of Mario's tail
        g16 = c.next16(click + 0.03)
        ts = [click] + [g16 + k * S16 for k in range(15)]
        for i, tt in enumerate(ts):
            if tt >= shutter - 0.05:
                break
            j = 0 if i == 0 else int(round((tt - c.bar1) / S16)) % 4    # accents follow the grid's beats
            c.n('lead', nm(BUILD_BB[i % 16]), tt, S16 * 0.62, 0.36 * ACC4[j], True, duty=0.25, att=0.002,
                dec=0.09, sus=0.45, rel=0.035)
            if j == 0:
                c.n('woodclick', 76, tt, 0.05, 0.38)
        c.n('felt', 'Bb3', click, 0.8, 0.2)
        c.mark(click, 'HIS CLICK ships GTP-4 (the picture\'s click, 11.04 frame 108; the sound pass lays it): the '
               'Build\'s whole pass on the chip, from the click')
    c.mark(turn, 'THE TURN: the Addendum crosses the split')
    c.mark(tt, 'the website: the chip plays Mario\'s tail (his side ships it)' if click is not None else
           'the photograph: the chip plays Mario\'s tail (Gerg ships it)')
    # the end: a held Bbm(add9) on 12.01's downbeat, ringing into the letter (v3.5: on the waitlist's cut, ringing
    # to the rope's snap, where the waitlist's sting takes over)
    snap = waitlist_snap(tl)
    push_ = snap + 0.4 if snap is not None else tl.snd('12.01', 'paper_whip', default=end + 2.0)
    for inst, p in (('vc', 'Bb2'), ('vla', 'F3'), ('svln', 'C5'), ('harp', 'Bb3'), ('marimba', 'Db5')):
        c.n(inst, p, end, max(2.2, push_ - end), 0.2, art='sus', att=0.05, rel=1.2) if inst in ('vc', 'vla', 'svln') \
            else c.n(inst, p, end, 1.6, 0.4)
    c.mark(end, ('the waitlist\'s wall TV (v3.5): a held Bbm(add9), ringing to the rope\'s snap' if snap is not None
                 else 'the letter lights: a held Bbm(add9), ringing out'), hit=False)
    V.thin(c, {'vo': dict(drop={'lead', 'woodclick', 'svln', 'marimba'}, soften={'vc_pz': 0.7, 'harp': 0.6}),
               'talk': dict(soften={'lead': 0.75, 'svln': 0.8, 'marimba': 0.8, 'woodclick': 0.7}),
               'mas': dict(drop={'lead', 'svln'}),
               'real': dict(drop={'lead', 'svln', 'marimba', 'woodclick', 'harp'})}, t0=split, t1=end - 0.05)
    c.section('the laptop opens (the match cut): the boot, the pulse', cut, split)
    c.section('the split: the Build against the Addendum, trading bars over the Lighthouse', split, post_b)
    c.section('Mas\'s post: the quartet\'s held chord', post_b, turn)
    c.section('the turn: the Addendum crosses; the chip copies its tail; the held chord', turn, end + 1.4)
    meta = dict(
        id='duel', title='The Duel (Ep1 v3, Act One sc 11; MM-04 Lighthouse)', mm='MM-04', usage='BI',
        family='P02 room colour (Misanthropic) x the Build', tone='rivalry: the same cell, two panes, one tempo',
        scenes=['Ep1 v3 Act One sc 11'],
        motifs=['Gerg\'s Build in B-flat minor (chip)', 'the Addendum (gains a tail each time)', 'the Lighthouse cell'],
        motif_ids=[], key='B-flat minor; Gbmaj7, Ebm9, F7sus (no third over F)',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-20.0, album_lufs=-16.0,
        sfx_slots=([dict(t=round(c.clk(click), 3), sfx='dialog_ok_click (5.08\'s): his click ships GTP-4, the '
                         'picture\'s click on 11.04 frame 108 (for the sound pass; the stick has no click here)')]
                   if click is not None else []),
        audition=['the trade: rivalry, never Nintendo (the chip in the left pane only)',
                  'the Addendum gaining its tail each time: funny by structure, not by sound',
                  'the turn: the chip copying Mario\'s tail on the photograph'])
    push = tl.snd('12.01', 'paper_whip', default=end + 2.0)     # it rings until the push brings MM-17 in
    if snap is not None:                                        # v3.5: until the waitlist's sting
        push = snap + 0.1
    sc = c.finish(T, meta, length_end=push + 0.5, end_fade=(push - 0.7, push + 0.45))
    return c, sc


# ================================================================== PAUSE (a chill: MM-17 low, Nole's Launch stack)
def cue_pause(tl):
    """v3.1 (script draft 7's music line, the mood analysis's §4 #2): "a chill, played straight: a cold pedal and
    Nole's stack, nothing walking; the THUD stops it".  So the round-1 walk, brushes and Rhodes are gone: a low C / G-flat
    pedal (cello, bass, a dark pad), a slow low-piano tritone in half notes, Nole's Launch stack on muted horns in the
    gaps (one note short of its A-flat).  It stops dead on EMIT's THUD (v31-12.03); on a lock without the THUD (v3) it
    thins to the pedal on the hard cut to his desk and rings out before the reflection."""
    push = tl.snd('12.01', 'paper_whip', default=tl.B('12.01') + 2.0)
    refl = tl.B('12.05')
    desk = tl.B('12.04')
    thud = tl.snd('v31-12.03', 'synth:thud', default=tl.B('v31-12.03')) if tl.has('v31-12.03') else None
    stop = thud if thud is not None else desk
    c = V.Cue('pause', tl, anchor=push, anchor_bar=1, bars=10, swing=0.0)
    T = palette()
    for k in ('vc', 'cb'):
        T[k].sends = {'hall': -12, 'room': -16}
    T['grand'].gain_db, T['grand'].eq, T['grand'].sends = -3.0, [('lp', 2000)], {'room': -14, 'hall': -18}
    dup(T, 'hn', 'hn_m', gain_db=-3.0)
    T['pad'].gain_db = -10.0
    T['lead2'].gain_db = -14.0
    end = stop if thud is not None else refl
    c.rebow('vc', 'C2', push, end, 0.2, first_att=1.0, last_rel=0.8 if thud is None else 0.05, art='sus', lp=1200)
    c.rebow('cb', 'C2', push + 0.2, stop, 0.14, first_att=1.2, last_rel=0.8 if thud is None else 0.05, art='sus',
            lp=900)
    V.pad(c, ['C3', 'Gb3', 'Bb3', 'Eb4'], push, stop - push + (0.4 if thud is None else 0.0), 0.44, attack=2.2,
          release=1.2 if thud is None else 0.05, bright=0.45)
    figs = [('C2', 'Gb2'), ('C2', 'Gb2'), ('Db2', 'G2'), ('C2', 'Gb2')]
    b = 1
    while c.bar(b) < stop - 0.05:
        lo, hi = figs[(b - 1) % 4]
        for k, p in enumerate((lo, hi)):
            t = c.bt(b, 1 + 2 * k)
            if t < stop - 0.05:
                c.n('grand', p, t, Q * 1.9, 0.3 if k == 0 else 0.26)
        b += 1
    n = 0
    for g0, g1 in tl.gaps(push + 0.3, stop - 0.3, min_len=1.5, pad_before=0.2, pad_after=0.3):
        t = c.next_beat(g0)
        if t + 4 * Q > g1 + 0.1:
            continue
        for k, p in enumerate(['C3', 'F3', 'Bb3', 'Eb4']):
            c.n('hn_m', p, t + k * Q * 0.5, Q * (1.6 - 0.3 * k), 0.32, art='mute', rel=0.3)
        c.n('lead2', 'Eb5', t + 1.5 * Q, 0.1, 0.16, True, duty=0.125, att=0.002, dec=0.08, sus=0.1, rel=0.04)
        c.mark(t, 'Nole\'s Launch stack (C F Bb Eb), low and muted: it falls one note short')
        n += 1
        if n >= 2:
            break
    if thud is None:
        c.n('hn_m', 'Gb3', desk + 0.05, refl - desk, 0.2, art='mute', rel=0.6)
        c.mark(desk, 'his desk: the pedal only (C + G-flat), out before the reflection', hit=False)
        V.clip_before(c, desk, insts={'grand', 'hn_m'}, rel=0.3)
    else:
        V.clip_before(c, thud, rel=0.02)
        V.drop_window(c, thud, thud + 60)
        c.mark(thud, 'EMIT\'s THUD stops it dead (5 ms)', hit=False)
    V.thin(c, {'talk': dict(drop={'hn_m', 'lead2'}, soften={'grand': 0.8}),
               'real': dict(drop={'hn_m', 'lead2', 'grand'}),
               'mas': dict(drop={'hn_m', 'lead2'})}, t0=push, t1=stop - 0.02)
    c.section('MM-17 low: the C/G-flat pedal, the low tritone, the Launch stack in the gaps', push, stop)
    if thud is None:
        c.section('his desk: the pedal, rung out before the reflection', desk, refl)
    meta = dict(
        id='pause', title='The Pause Letter (Ep1 v3.1, Act One sc 12; MM-17 low)', mm='MM-17', usage='BI',
        family='P04 / P08 colours, low (Nole)', tone='a chill, played straight: a cold pedal nobody pauses',
        scenes=['Ep1 v3.1 Act One 12.01-12.02 (to the THUD)'], motifs=['Nole\'s Launch stack (C F Bb Eb; one note short)'],
        motif_ids=[], key='C with G-flat (the tritone), never resolving to F; no third',
        composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-21.0, album_lufs=-16.0,
        audition=['a chill: cold and still under Nole and Oigneb, nothing walking', 'the THUD stops it dead'])
    if thud is not None:
        sc = c.finish(T, meta, length_end=thud + 0.02, mutes=[(thud, thud + 3.0)])
    else:
        sc = c.finish(T, meta, length_end=refl + 0.3, end_fade=(refl - 1.2, refl - 0.02))
    return c, sc


def cue_threat(tl):
    lift = tl.snd('12.06', 'pen_tick_3', default=tl.B('12.06') + 1.5)
    end = tl.length
    # the file starts a bar early (silent): the engine's short-term meter needs a render longer than 3 s
    c = V.Cue('threat', tl, anchor=lift, anchor_bar=2, bars=4, swing=0.0)
    T = palette()
    T['tuba'].gain_db = 0.0
    T['tbn'].gain_db = -1.0
    T['hn'].gain_db, T['hn'].sends = -2.0, {'hall': -6}
    T['sub'].gain_db = -6.0
    T['timp'].gain_db = -2.0
    V.stab(c, 'tuba', ['F1'], lift, vel=0.7, length=0.5)
    V.stab(c, 'tbn', ['F2', 'C3'], lift, vel=0.66, length=0.45)
    c.n('hn', 'C3', lift, 0.9, 0.5, art='sus', att=0.01, rel=0.9, lock=True)
    c.n('hn', 'Gb3', lift, 0.9, 0.46, art='sus', att=0.01, rel=0.9, lock=True)
    c.n('timp', 'F2', lift, 1.5, 0.6)
    c.n('sub', 'F1', lift, 0.9, 0.5, rel=0.4)
    c.mark(lift, 'THREAT, once, on the pen\'s lift: F-C-Gb (low brass + sub), no third')
    c.section('THREAT on the pen\'s lift, its tail into the black', lift, end)
    meta = dict(
        id='threat', title='THREAT (Ep1 v3, Act One out; MM-14)', mm='MM-14', usage='BI', family='P08 OUTS KIT: THREAT',
        tone='one chill', scenes=['Ep1 v3 Act One 12.06-12.07'], motifs=[], motif_ids=[],
        key='F, C, G-flat: no third', composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-18.0,
        album_lufs=-14.0,
        audition=['the THREAT on the lift: one chill, not a dun-dun-dunnn'])
    sc = c.finish(T, meta, length_end=end, end_fade=(end - 0.45, end - 0.02))
    return c, sc


# ================================================================== PLANNED FOR v3.1: SYDNEY and THE ATEM LEAK
# The v3.1 script brings back Sydney (sc 10) and the Atem weights leak (sc 11's crate).  These cues are built only
# when the lock has their beats (any beat id 10.*; the beat whose on-screen text names ATEM), so the same track.py
# refits to the v3.1 lock with no edits.  Both are in the show's sound.
def sydney_beats(tl):
    return [b for b in tl.beats if b['id'].startswith('10.') or b['id'].startswith('v31-10.')]


def sydney_in(tl):
    """where Sydney's glass comes in: 0.2 s before her first frame, but never inside his line ("ours does that too.")"""
    t0 = sydney_beats(tl)[0]['t0']
    mas = [l['end'] for l in tl.lines_in(t0 - 3.0, t0) if l['who'] == 'mas']
    return max(t0 - 0.2, (max(mas) + 0.02) if mas else t0 - 0.2)


def cue_sydney(tl):
    """SYDNEY, uncanny and clingy: a sweet glass-and-celesta music box in D-flat lydian (no third) whose chip echo
    follows it a sixteenth late, a pixel too close (THE COPY's device, lent to another machine); dry under her real
    line (the glass pad alone, turning to the Ache over F); it lets her go with one last late echo as she leaves"""
    bs = sydney_beats(tl)
    if not bs:
        return None
    t0, t1 = bs[0]['t0'], bs[-1]['t1']
    # (bar 2 is her first frame: the file starts a bar early, so her glass can lead the cut by a breath)
    c = V.Cue('sydney', tl, anchor=t0, anchor_bar=2, bars=int((t1 - t0) / BAR) + 5, swing=0.0)
    T = palette()
    T['glasspad'].gain_db = -10.0
    T['celesta'].gain_db, T['celesta'].sends = -8.0, {'hall': -8}
    T['lead'].gain_db, T['lead'].eq = -12.0, [('lp', 4200)]
    T['pad'].gain_db = -12.0
    p0 = sydney_in(tl)            # v3.2: the glass leads the cut by up to 0.2 s, under lobby2's last chord
    V.pad(c, ['Db3', 'Ab3', 'C4', 'G4'], p0, t1 - p0 - 0.1, 0.4, kind='glass', attack=0.3, release=1.0,
          bright=0.6)             # (audit-v31 #14: the crossfade, no dip on the cut)
    fig = ['Ab5', 'F5', 'Db5', 'F5', 'G5', 'F5', 'C5', 'F5']
    t = c.next8(t0 + 0.4)
    i = 0
    while t < t1 - 0.8:
        if not tl.talking(t, t + 0.05, pad=0.08, kinds={'real', 'vo', 'mas'}):
            busy = tl.talking(t, t + 0.05, pad=0.08)
            p = fig[i % 8]
            c.n('celesta', p, t, Q * 0.45, 0.3 if busy else 0.36, True)
            c.n('lead', p, t + S16, Q * 0.3, 0.16, True, duty=0.125, att=0.002, dec=0.1, sus=0.2, rel=0.05)  # clingy
        t += Q / 2
        i += 1
    for l in tl.lines_in(t0, t1, kinds={'real'}):
        c.ch('glasspad', ['G4', 'Db5'], l['on'] - 0.2, l['end'] - l['on'] + 0.4, 0.18, roll=0.0, rel=0.8)
        c.mark(l['on'], f'her real line: the glass pad turns to the Ache ({l["id"]})', hit=False)
    c.n('lead', 'F5', t1 - 0.6 + S16, 0.4, 0.14, True, duty=0.125, att=0.002, dec=0.2, sus=0.2, rel=0.2)
    c.mark(t0 + 0.4, 'SYDNEY: the music box and its late chip echo (clingy)')
    c.section('Sydney: uncanny and clingy', t0, t1)
    meta = dict(id='sydney', title='Sydney (Ep1 v3.1, Act One sc 10)', mm='(to picture)', usage='BI',
                family='P05 GLYPH colours, sweetened', tone='uncanny and clingy', scenes=['Ep1 v3.1 sc 10'],
                motifs=['a music-box figure with its chip echo a sixteenth late'], motif_ids=[],
                key='D-flat lydian (no third); the Ache over F under her real line',
                composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-22.0, album_lufs=-16.0,
                audition=['uncanny and clingy: sweet on the surface, the echo too close'])
    sc = c.finish(T, meta, length_end=t1 + 0.3, end_fade=(t1 - 0.9, t1 + 0.25))
    return c, sc


def atem_beat(tl):
    for b in tl.beats:
        if any('ATEM' in o['text'] for o in tl.onscreen if o['beat'] == b['id']) and b['id'].startswith('11.'):
            return b
    return None


def cue_atem(tl):
    """THE ATEM LEAK, a cool, brief sting (P08 DREAD, under 2 s): on the crate's tip, a low felt/grand fifth F1 + C2
    with a sub, the chip's open fifth F5 + C6 (no third), and the Ache on glass for one bar; then gone"""
    b = atem_beat(tl)
    if b is None:
        return None
    hit = min([s['t'] for s in tl.sounds if s['beat'] == b['id'] and s['name'] in ('synth:crate',)] or [b['t0']])
    c = V.Cue('atem', tl, anchor=hit - BAR, anchor_bar=1, bars=4, swing=0.0)
    T = palette()
    T['grand'].gain_db, T['grand'].eq = -2.0, [('lp', 2500)]
    T['sub'].gain_db = -8.0
    T['lead'].gain_db = -8.0
    T['glasspad'].gain_db = -8.0
    c.ch('grand', ['F1', 'C2', 'F2'], hit, 1.6, 0.44, roll=0.004)
    c.n('sub', 'F1', hit, 0.9, 0.5, True, punch=2.0, click=0.0, decay=0.8)
    for k, p in enumerate(('F5', 'C6')):
        c.n('lead', p, hit + 0.01, 0.5, 0.3, True, duty=0.25 if k else 0.5, att=0.002, dec=0.2, sus=0.2, rel=0.2)
    c.ch('glasspad', ['G4', 'Db5'], hit + 0.05, 1.8, 0.2, roll=0.0, rel=0.6)
    c.mark(hit, 'THE ATEM LEAK: a cool sting on the crate (F-C, the chip\'s fifth, the Ache)')
    c.section('the Atem leak: the sting', hit, hit + 2.0)
    meta = dict(id='atem', title='The Atem Leak (Ep1 v3.1, Act One sc 11)', mm='MM-14', usage='BI',
                family='P08 OUTS KIT: DREAD (brief)', tone='cool, brief', scenes=['Ep1 v3.1 sc 11 (the crate)'],
                motifs=[], motif_ids=[], key='F and C, no third; the Ache',
                composer='v3-score-a (composer X), 2026-09-27', underscore_lufs=-19.0, album_lufs=-16.0,
                audition=['a cool, brief sting: not a joke, not a scare'])
    sc = c.finish(T, meta, length_end=hit + 2.2, end_fade=(hit + 1.6, hit + 2.15))
    return c, sc


# ================================================================== v3.5: THE FIRST WEEKS, 3 AM + JUN 2018, THE WINDOW
# + THE VISION POST, THE WAITLIST.  Built only when the lock has their beats (v35-10.*, v35-12.*/13.*, v35-18.*/19.*,
# v35-22.01), so the older locks still refit with no edits.  All in the show's own voice: the chip Build, the felt,
# the 808 and the hybrid strings, the Ache, the Door; no trio, no lounge, no new colour.
AB_STEPS = [0, 2, 4, 5, 7, 9, 11]                  # A-flat major (the Build's own key), from A-flat
BUILD_DEG = [0, 0, 1, 2, 4, 2, 1, 0, 0, 0, 1, 2, 4, 6, 4, 2]     # the Build's contour as scale steps (1 1 2 3 5 3 2 1 ...)


def build_on(deg, base=nm('Ab4')):
    """Gerg's Build moved diatonically inside A-flat major to start on scale degree `deg` (0 = A-flat): its contour
    kept, the key kept (B-flat dorian, C phrygian, D-flat lydian, E-flat mixolydian); from D-flat up, an octave down"""
    out = []
    for st in BUILD_DEG:
        k = deg + st
        p = base + AB_STEPS[k % 7] + 12 * (k // 7)
        out.append(p - (12 if deg >= 3 else 0))
    return out


# the first weeks' chords, one per montage shot: (felt voicing, the pulse's root, the 808's pitch, the Build's degree)
FW = {
    'v35-10.01': ('Abmaj9', ['Eb3', 'G3', 'C4'], 'Ab2', 'Ab1', 0),        # the essay (the match cut)
    'v35-10.02': ('Bbm9', ['Db4', 'F4', 'C5'], 'Bb2', 'Bb1', 1),          # why does this crash (red -> green)
    'v35-10.03': ('Cm7', ['Bb3', 'Eb4', 'G4'], 'C3', 'C2', 2),            # the VCR verse
    'v35-10.04': ('F + the Ache', None, 'F2', 'F1', None),                # NOLE: "scary good" (the flicker)
    'v35-10.05': ('Dbmaj9', ['Ab3', 'C4', 'F4'], 'Db3', 'Db2', 3),        # dinner; how do i say sorry to my sister
    'v35-10.06': ('Eb13sus', ['Db4', 'F4', 'Ab4', 'C5'], 'Eb3', 'Eb2', 4),  # 7 x 8 = 54 (the wince)
    'v35-10.07': ('Abmaj9', ['Eb4', 'G4', 'C5'], 'Ab2', 'Ab1', 0),        # STACK UNDERFLOW bans it (the top)
}
FWB = 0.5                                          # the montage's beat: 120 BPM, so every cut falls on the pulse


def tracks_fw():
    T = palette()
    T['lead'].gain_db, T['lead'].sends = -5.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200), ('hs', 2400, -3.0)]
    T['lead2'].gain_db, T['lead2'].eq = -12.0, [('lp', 5000)]
    T['tri'].gain_db, T['tri'].eq = -4.0, [('lp', 900), ('hp', 45)]
    T['sub'].gain_db = -10.0
    T['k808'].gain_db = -7.0
    T['h808'].gain_db = -15.0
    T['clap808'].gain_db = -13.0
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    T['glasspad'].gain_db = -10.0
    for k in ('vln1', 'vln2'):
        T[k].gain_db, T[k].sends = -6.0, {'hall': -10, 'room': -16}
    dup(T, 'vc', 'vc_s', gain_db=-7.0)
    T['vc_s'].eq = list(T['vc_s'].eq) + [V.PIZZ_NOTCH]
    return T


def cue_first_weeks(tl):
    """THE FIRST WEEKS (sc 10, v35-10.01-10.08), "our Facemash night": a rising, fun pulse in the show's own chip-and-808
    colour.  At 120 BPM every one of the montage's cuts falls on a beat, and each cut takes one step up A-flat major
    (A-flat, B-flat, C, then D-flat, E-flat, A-flat): the chip's triangle pulse in eighths on the root, GERG'S BUILD on
    the chip in straight sixteenths (moved diatonically, its contour kept), the 808 joining a layer a shot (the kick,
    then the hats, then the clap), a felt stab on every cut.  NOLE'S "scary good" is THE FLICKER: the drums and the
    Build drop out, the pulse sits on F and the glass holds the Ache (G4 + D-flat5) for the shot, then it all comes back
    (the bible's first dread leak).  "how do i say sorry to my sister" gets the felt's F4 on top (3 AM's one note,
    planted); "7 x 8 = 54" gets the Build's high note sagging a semitone (the wince).  On the pull back to the desk of
    lit phones (10.08) it stops on the cut with one hit that rings into his phone's siren whoop."""
    bs = [b for b in tl.beats if b['id'].startswith('v35-10.')]
    if not bs:
        return None
    t0 = bs[0]['t0']
    stop = bs[-1]['t0']                                          # 10.08: the pull back; his phone lights red
    whoop = whine_t(tl)
    c = V.Cue('first_weeks', tl, anchor=t0, anchor_bar=2, bars=12, swing=0.0)
    T = tracks_fw()
    shots = [b for b in bs if b['id'] in FW]
    for j, b in enumerate(shots):
        name, felt, root, k808p, deg = FW[b['id']]
        a, e = b['t0'], b['t1']
        n_beats = int(round((e - a) / FWB))
        layer = j                                                # 0 the essay ... 6 the top
        flicker = deg is None
        # the cut: a felt stab (Mas watching the world use it), the 808 sub on the root
        if felt:
            top = ['F4'] if b['id'] == 'v35-10.05' else []
            c.ch('felt', felt + top, a + 0.004, min(1.6, e - a - 0.05) if b['id'] != 'v35-10.05' else e - a - 0.05,
                 0.2 if b['id'] != 'v35-10.05' else 0.22, roll=0.008)
        c.n('k808', k808p, a, 0.5, 0.62 if not flicker else 0.4, True, decay=0.5 if not flicker else 0.9)
        c.mark(a, f'DESIGNED HIT: the first weeks: the cut to {b["id"]} on the pulse ({name})')
        for i in range(n_beats * 2):                             # the triangle pulse, eighths on the root
            t = a + i * FWB / 2
            if t >= e - 0.01:
                break
            v = (0.3 if i % 2 == 0 else 0.24) * (0.75 if flicker else 1.0)
            c.n('tri', root, t, FWB / 2 * 0.7, v, True, att=0.003, dec=0.08, sus=0.6, rel=0.03)
        if flicker:
            # NOLE: the flicker.  The Ache inside the warm cue for one shot, then it leaves
            c.ch('glasspad', ['G4', 'Db5'], a + 0.05, e - a - 0.1, 0.24, roll=0.0, rel=0.4)
            c.n('sub', 'F1', a, e - a - 0.2, 0.3, True, punch=0.0, click=0.0, decay=1.2)
            c.mark(a + 0.05, 'THE FLICKER: Nole\'s "scary good": the drums and the Build drop out; the Ache on glass '
                             'over F for the shot', hit=False)
            c.section(f'the first weeks: {b["id"]} (the flicker: the Ache over F)', a, e)
            continue
        # the 808, a layer a shot: the kick on the beats (from the 2nd shot), hats in sixteenths (from the 3rd),
        # the clap on the backbeat (from the 5th)
        for i in range(n_beats):
            t = a + i * FWB
            if layer >= 1 and i > 0:
                c.n('k808', k808p, t, 0.4, 0.5 + 0.02 * layer, True, decay=0.4)
            if layer >= 3 and i % 2 == 1:
                c.n('clap808', 60, t, 0.1, 0.42 + 0.03 * layer, True)
            if layer >= 2:
                for q in range(4):
                    c.n('h808', 60, t + q * FWB / 4, 0.04, (0.46 if q == 0 else 0.3 if q == 2 else 0.2), True,
                        **({'open': True} if (layer >= 5 and q == 2) else {}))
        # GERG'S BUILD on the chip: straight sixteenths from the cut (moved inside A-flat major)
        ps = build_on(deg)
        n16 = int(round((e - a) / (FWB / 4)))
        for i in range(n16):
            t = a + i * FWB / 4
            if t >= e - 0.02:
                break
            p = ps[i % 16]
            x = dict(duty=0.25 if layer < 4 else 0.5, att=0.002, dec=0.08, sus=0.4, rel=0.03)
            if b['id'] == 'v35-10.06' and i == 4:
                x['bend'] = [(0.0, 0.0), (0.05, -1.0)]            # 7 x 8 = 54: the high note sags (the wince)
                c.mark(t, 'the wince: "7 x 8 = 54": the Build\'s high note sags a semitone', hit=False)
            c.n('lead', p, t, FWB / 4 * 0.62, (0.28 + 0.015 * layer) * ACC4[i % 4], True, **x)
            if layer >= 6 and i % 2 == 0:
                c.n('lead2', p + 12, t, FWB / 4 * 0.5, 0.2 * ACC4[i % 4], True, duty=0.125, att=0.002, dec=0.06,
                    sus=0.3, rel=0.03)
        # the hybrid strings: spiccato sixteenths on the root from the 5th shot, the violins' held top from the 6th
        if layer >= 4:
            V.pulse(c, 'vc_s', lambda t, r=root: nm(r) + (12 if nm(r) < nm('G2') else 0), a, e - 0.01, FWB / 4, 0.26,
                    art='spic')
        if layer >= 5:
            top = {'Eb13sus': 'Db5', 'Abmaj9': 'Eb5'}.get(name, 'C5')
            c.n('vln1', top, a + 0.01, e - a - 0.05, 0.3, art='sus', att=0.05, rel=0.2)
            c.n('vln2', nm(top) - 12, a + 0.01, e - a - 0.05, 0.27, art='sus', att=0.05, rel=0.2)
        c.section(f'the first weeks: {b["id"]} ({name})', a, e)
    # 10.08: the pull back to the desk of lit phones; his own lights red: the drive stops on the cut, one hit rings
    c.ch('felt', ['Ab2', 'Eb3', 'C4', 'G4'], stop + 0.004, whoop - stop + 0.6, 0.22, roll=0.01)
    c.n('k808', 'Ab1', stop, 0.6, 0.6, True, decay=0.7)
    c.n('sub', 'Ab1', stop, whoop - stop, 0.34, True, punch=0.0, click=0.0, decay=1.4)
    c.n('lead', 'Ab5', stop, 0.3, 0.3, True, duty=0.25, att=0.002, dec=0.15, sus=0.2, rel=0.1)
    c.mark(stop, 'DESIGNED HIT: 10.08, the pull back: the drive stops on the cut; one hit rings into his phone\'s '
                 'siren whoop (code red takes over there)')
    c.section('10.08: the stop, the ring into the whoop', stop, whoop + 0.3)
    meta = dict(
        id='first_weeks', title='The First Weeks (Ep1 v3.5, Act One sc 10)', mm='(to picture)', usage='BI',
        family='P11 energy in the show\'s chip-and-808 colour (the Build, the triangle pulse, the 808, spiccato)',
        tone='a rising, fun pulse: our Facemash night; one flicker on Nole', scenes=['Ep1 v3.5 Act One sc 10'],
        motifs=["Gerg's Build (moved inside A-flat major)", 'the Ache (G4 + D-flat5 over F, the flicker)',
                'the felt F4 on "sorry to my sister" (3 AM\'s one note, planted)'], motif_ids=[],
        key='A-flat major rising a shot at a time (Ab, Bbm, Cm, [F + the Ache], Db, Eb, Ab); no A anywhere',
        composer='v3.5 composer (the final pass), from composer X\'s cue A, 2026-09-28', underscore_lufs=-19.0,
        album_lufs=-16.0,
        audition=['fun and rising, never EDM or "upbeat corporate": the chip Build and the felt keep it ours',
                  'the flicker on Nole: the Ache for one shot, a chill inside the fun', 'every cut on the pulse',
                  'the stop on the pull back: the hit rings into the siren'])
    sc = c.finish(T, meta, length_end=whoop + 0.5, end_fade=(whoop - 0.4, whoop + 0.45))
    return c, sc


# ---------------------------------------------------------------- 3 AM + JUN 2018 (one cue: the felt note becomes the dream)
DREAM = {   # the dream's felt voicings (D-flat lydian home, the Water Line's warm colours; no A anywhere)
    'Dbmaj9#11': ['Db3', 'Ab3', 'C4', 'F4'],
    'Ab/C':      ['C3', 'G3', 'Eb4'],
    'Bbm9':      ['Db3', 'F3', 'C4'],
    'Gbmaj9#11': ['Gb2', 'Db3', 'F3', 'C4'],
}
DREAM_LOOP = ['Dbmaj9#11', 'Ab/C', 'Bbm9', 'Gbmaj9#11']
DREAM_ROOT = {'Dbmaj9#11': 'Db3', 'Ab/C': 'C3', 'Bbm9': 'Bb2', 'Gbmaj9#11': 'Gb2'}


def cue_dream(tl):
    """3 AM (sc 12) and THE NIGHT THE MACHINE TAUGHT ITSELF, JUN 2018 (sc 13), one cue.
    3 AM: no score under the at-capacity page and the first read (the fans; the phone's lock stopped code red dead);
    on his SECOND READ (12.02) ONE FELT NOTE, the F4 the first weeks planted on "sorry to my sister", held under "they've
    stopped testing it. they're using it." with nothing attacking: the act's one moved moment.  A sul-tasto viola F3
    takes the note's air after the V.O.  On the glowing line (12.03's counter: 180 YEARS) the render front upgrades
    the same note into the dream: D-flat maj9(#11) blooms around the F, the celesta draws the line.
    JUN 2018, warm awe, in the intro's post-2015 fidelity (T3: acoustic, with the chip; no tape, no bitcrush): his felt
    (his own flashback) a chord a bar through D-flat lydian (Dbmaj9#11, Ab/C, Bbm9, Gbmaj9#11), THE WATER LINE's head
    on the wall of monitors, GERG'S BUILD soft on the chip in the gaps (Gerg coding in the background), a sul-tasto
    string pedal; the felt alone under Mas's lines.  After Alyi's "What else would you build?", THE DOOR'S head (his
    motif, A-flat D-flat | C G) in the gap, ending on its #4, held: no answer.  The side project ("the cat sat on the
    the mat of the"): the chip's flat line F F F, the launch click's rhyme (the knee: nothing happens yet).  Out on the
    sweep: the celesta draws the line back down, and the chord rings under the revolving door into the lobby's bass.
    ATOD's arena plays in it as its own diegetic cue (`arena`, through the monitors)."""
    if not (tl.has('v35-12.02') and tl.has('v35-13.01')):
        return None
    two = tl.B('v35-12.02')
    glow_t = tl.B('v35-12.03') + tl.os_at('v35-12.03', 'PLAYED', default=tl.B('v35-12.03') + 0.3) - tl.B('v35-12.03')
    wall = tl.B('v35-13.01')
    q_b = tl.B('v35-13.04')
    side = tl.B('v35-13.05')
    sweep = tl.B('v35-13.06')
    door = (tl.snd_any('revolving_door', sweep, tl.B('9.01') + 0.01) or [sweep + 1.0])[0]
    out = tl.B('9.01') + 0.45                                     # (the lobby's bass walks in just after)
    c = V.Cue('dream', tl, anchor=wall, anchor_bar=5, bars=int((out - wall) / BAR) + 7, swing=0.0)
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -1.0, {'room': -12, 'hall': -16}
    T['lead'].gain_db, T['lead'].sends = -9.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['celesta'].gain_db, T['celesta'].sends = -9.0, {'hall': -8}
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]
    T['vln2'].gain_db, T['vln2'].sends = -8.0, {'hall': -9}

    def fch(ps, t, d, v, roll=0.018, span_end=None):
        return c.pch('felt', ps, t, d, v, roll=roll, span_end=span_end)

    # ---- 3 AM: the one felt note on the second read
    vo = tl.lines_in(two, tl.E('v35-12.02'), kinds={'vo'})
    tq = two + 0.12
    if vo and vo[0]['on'] - 0.3 < tq:
        tq = max(two + 0.02, vo[0]['on'] - 0.3)
    fch(['F4'], tq, glow_t - tq + 0.2, 0.2, roll=0.0)
    c.mark(tq, 'DESIGNED HIT: 3 AM, his second read: ONE FELT NOTE (F4, the note the first weeks planted), held; the '
               'V.O. sits inside it (the act\'s one moved moment)')
    va = (vo[0]['end'] + 0.15) if vo else tq + 3.0
    c.rebow('vla', 'F3', va, wall + 1.5, 0.12, first_att=1.2, last_rel=1.0, art='sus', lp=1300)
    c.section('3 AM: one felt note on the second read (the V.O. inside it)', tq, glow_t)
    # ---- the glowing line: the render front upgrades the same note into the dream
    fch(DREAM['Dbmaj9#11'], glow_t, wall - glow_t + BAR - 0.1, 0.15, roll=0.03)
    for k, p in enumerate(['Db5', 'F5', 'Ab5', 'C6', 'G6']):
        c.n('celesta', p, glow_t + 0.05 + k * S16, 0.9, 0.2 + 0.02 * k)
    c.mark(glow_t, 'the glowing line: 180 YEARS: the same F becomes D-flat maj9(#11), the celesta draws the line')
    # ---- JUN 2018: a chord a bar (the felt, softly), the string pedal on the root
    ask = [l for l in tl.lines_in(q_b, side) if l['who'] == 'alyi']
    d0 = (ask[-1]['end'] + 0.08) if ask else q_b + 4.0
    b_wall = int(round(c.bar_of(wall)))
    b_end = int(math.ceil(c.bar_of(door)))
    for b in range(b_wall, b_end):
        name = DREAM_LOOP[(b - b_wall) % 4]
        t = c.bar(b)
        if t >= d0 - 1.0:                                         # from the question on, the Door's chord holds
            break
        tt = t
        if tl.talking(t, t + 0.05, pad=0.08, kinds={'mas', 'vo'}):
            ends = [l['end'] for l in tl.lines_in(t, t + 0.05, 0.08, kinds={'mas', 'vo'})]
            tt = max(ends) + 0.08
            if tt > t + 1.2:
                continue                                          # (the chord before holds through his line)
        if b > b_wall:
            fch(DREAM[name], tt, c.bar(b + 1) - tt + 0.3, 0.14)
        c.rebow('vc', DREAM_ROOT[name], t - 0.05, c.bar(b + 1) + 0.1, 0.13, first_att=0.5, last_rel=0.5, art='sus',
                lp=1100)
        c.mark(t, f'2018: {name} (the felt, the string pedal)', hit=False)
    # THE WATER LINE's head on the wall of monitors (before the first line)
    first_line = min([l['on'] for l in tl.lines_in(wall, sweep)] + [wall + 3.0])
    if first_line - wall >= 2.2:
        V.phrase(c, 'felt', wall + 0.02, 'F4/4 F4/4 F4/4 G4/8 F4/8 C4/4 F4/4', 0.2, stop_at=first_line - 0.1)
        c.mark(wall + 0.02, 'JUN 2018: THE WATER LINE\'s head on the felt, on the wall of monitors (wonder)')
    # GERG'S BUILD, soft, on the chip in the gaps (he codes in the background)
    passes = place_passes(c, wall + BAR, q_b - 0.2, vel=0.22, spacing=5.5)
    for t0_, cnt, v in passes:
        for i in range(cnt):
            t = t0_ + i * S16
            c.n('lead', cell()[i % 16], t, S16 * 0.62, v * ACC4[i % 4], True, duty=0.25, att=0.002, dec=0.09,
                sus=0.45, rel=0.035)
        c.mark(t0_, f'2018: the Build ({cnt}), soft (Gerg coding)')
    # THE DOOR after "What else would you build?": its head, ending on the #4, held (no answer)
    fch(DREAM['Dbmaj9#11'][:3], d0, door - d0 + 0.6, 0.13, span_end=door + 0.5)
    c.rebow('vc', 'Db3', d0 - 0.1, door + 0.6, 0.12, first_att=0.8, last_rel=0.8, art='sus', lp=1100)
    for p, dt, dd, vv in (('Ab4', 0.0, 0.45, 0.21), ('Db5', 0.42, 0.5, 0.2), ('C5', 0.9, 0.4, 0.18),
                          ('G4', 1.3, door - d0 - 1.3 + 0.4, 0.18)):
        c.n('felt', p, d0 + dt, dd, vv)
    c.mark(d0, 'THE DOOR after "What else would you build?": A-flat D-flat | C G, ending on its #4, held: no answer')
    c.rebow('vln2', 'Ab4', d0 + 0.3, door + 0.4, 0.1, first_att=1.5, last_rel=0.8, art='sus', lp=3000)
    # the side project: the chip's flat line (F F F), the launch click's rhyme
    fl0 = c.next_beat(side + 0.25)
    for k, (p, duty, v) in enumerate((('F4', 0.5, 0.2), ('F5', 0.25, 0.16), ('F4', 0.125, 0.18))):
        tt = fl0 + k * Q
        if tt < sweep and not tl.talking(tt, tt + 0.3, kinds={'mas', 'vo', 'real'}):
            c.n('lead', p, tt, Q * 0.5, v, True, duty=duty, att=0.003, dec=0.15, sus=0.3, rel=0.06)
    c.mark(fl0, 'the side project ("the cat sat on the the mat of the"): the chip\'s flat line F F F (the launch '
                'click\'s rhyme; the knee: nothing happens yet)')
    # out on the sweep: the celesta draws the line back down; the chord rings under the door
    for k, p in enumerate(['C6', 'Ab5', 'F5', 'Db5']):
        c.n('celesta', p, sweep + 0.05 + k * S16, 0.7, 0.2 - 0.02 * k)
    c.mark(sweep + 0.05, 'the sweep back: the celesta draws the line down; the chord rings under the revolving door',
           hit=False)
    V.thin(c, {'vo': dict(drop={'lead', 'celesta'}), 'mas': dict(drop={'lead', 'celesta'}),
               'talk': dict(soften={'lead': 0.7, 'celesta': 0.7}), 'real': dict(drop={'lead', 'celesta'})},
           t0=wall - 0.01)
    c.section('the glowing line: 180 YEARS', glow_t, wall)
    c.section('JUN 2018: the dream (the felt, the Water Line, the Build soft)', wall, d0)
    c.section('the Door, unanswered; the side project; the sweep back', d0, out)
    meta = dict(
        id='dream', title='3 AM / The Night the Machine Taught Itself (Ep1 v3.5, Act One sc 12-13)', mm='(to picture)',
        usage='BI', family='P01 his felt; the Water Line warm (D-flat lydian); the Build soft; post-2015 BASE fidelity',
        tone='3 AM: quiet, one moved note; JUN 2018: warm awe, the dream', scenes=['Ep1 v3.5 Act One sc 12-13'],
        motifs=['the felt F4 (3 AM)', 'the Water Line\'s head', "Gerg's Build (soft)", 'the Door (unanswered, on its #4)',
                'the knee\'s flat line (the side project)'], motif_ids=[],
        key='D-flat lydian (Dbmaj9#11, Ab/C, Bbm9, Gbmaj9#11); no third over F, no A', underscore_lufs=-22.0,
        album_lufs=-16.0, composer='v3.5 composer (the final pass), 2026-09-28',
        audition=['3 AM: one felt note, not a cue: moved, never sad-piano', 'the bloom on the glowing line: the same '
                  'note becoming the dream', '2018: wonder and warmth under the talk, the arena tinny inside it',
                  'the Door on its #4 after "What else would you build?": the question left open'])
    sc = c.finish(T, meta, length_end=out + 0.4, end_fade=(tl.B('9.01') - 0.5, out + 0.35))
    return c, sc


ARENA_BASS = ['F2', 'F2', 'Db2', 'Eb2']
ARENA_OST = ['F4', 'C5', 'Ab4', 'C5', 'F4', 'C5', 'Ab4', 'C5', 'Db4', 'Ab4', 'F4', 'Ab4', 'Eb4', 'Bb4', 'G4', 'Bb4']


def cue_arena(tl):
    """ATOD's ARENA: the game's own music on the wall of monitors (diegetic, laid through era.futz('tv'), low): a small
    heroic loop in F minor (a string ostinato, a horn call, a snare roll), bots playing bots all night.  Inside the
    dream's D-flat lydian (F minor sits in it); softer under the talk; it leaves on the cut to the lone desk."""
    if not (tl.has('v35-13.01') and tl.has('v35-13.05')):
        return None
    a, e = tl.B('v35-13.01'), tl.B('v35-13.05')
    c = V.Cue('arena', tl, anchor=a, anchor_bar=1, bars=int((e - a) / BAR) + 3, swing=0.0)
    T = palette()
    for k in ('vln1', 'vln2', 'vc'):
        T[k].sends = {'hall': -14}
        T[k].eq = list(T[k].eq) + [('peq', 440.0, -14.0, 5.0), ('peq', 880.0, -8.0, 5.0), ('peq', 1760.0, -6.0, 4.0)]
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]      # (render 1: the spiccato's resonance read as an A over F)
    T['hn'].gain_db = -4.0
    T['snare'].gain_db = -10.0
    T['timp'].gain_db = -8.0
    T['timp'].eq = list(T['timp'].eq) + [V.PIZZ_NOTCH]  # (render 2: the timpani F2's ~111 Hz ring, an A2, 0.082 sieved)
    b = 1
    while c.bar(b) < e + 0.3:
        t0 = c.bar(b)
        busy = tl.talking(t0, t0 + BAR, pad=0.1)
        f = 0.6 if busy else 1.0
        for i in range(16):
            c.n('vln1', ARENA_OST[i], t0 + i * S16, S16 * 0.8, 0.3 * f, art='spic')
        for k in range(4):
            c.n('vc', ARENA_BASS[(b - 1) % 4] if k == 0 else 'F2', t0 + k * Q, Q * 0.8, 0.34 * f, art='spic')
        c.n('timp', 'F2', t0, 0.5, 0.3 * f)
        if b % 2 == 1 and not busy:
            V.phrase(c, 'hn', t0 + 2 * Q, 'C4/8 F4/8 Ab4/4', 0.34, art='sus', rel=0.2)
        for k in range(6):
            c.n('snare', 38, t0 + 3 * Q + k * Q / 6, 0.05, (0.16 + 0.03 * k) * f)
        b += 1
    c.mark(a, 'ATOD\'s arena on the wall of monitors (diegetic, through the TVs)', hit=False)
    c.section('ATOD\'s arena (diegetic)', a, e)
    meta = dict(id='arena', title='ATOD\'s Arena (Ep1 v3.5, sc 13; diegetic, the monitors)', mm='(source)', usage='VI',
                family='source: a game\'s loop, through the monitors', diegetic=True, tone='tinny, heroic, endless',
                scenes=['Ep1 v3.5 Act One sc 13'], motifs=[], motif_ids=[], key='F minor (no A)',
                composer='v3.5 composer (the final pass), 2026-09-28', underscore_lufs=-20.0, album_lufs=-16.0,
                audition=['a game\'s loop on small speakers, far back: the room, not the score'])
    sc = c.finish(T, meta, length_end=e + 0.6, end_fade=(e - 0.3, e + 0.55))
    return c, sc


# ---------------------------------------------------------------- THE WINDOW + THE VISION POST (one cue)
def cue_window(tl):
    """THE WINDOW (sc 18) and THE VISION POST (sc 19), one cue.
    THE WINDOW, joy at the team's peak, a small warm accent (not the trio): Gerg's marker takes the users line off the
    top of the glass on GERG'S BUILD in its A-flat major (launch night's M1 colour), one pass climbing an octave into
    its last notes, over the felt's A-flat maj9 and a soft triangle pulse; thin under "Still a preview?" / "still a
    preview."; on the four of them laughing, the Build's tag "shipped" (E-flat5 -> A-flat5) and the felt's A-flat
    again.  THE LAMP: the others go home: one felt note (F4) under the lamp.
    THE VISION POST, quiet ambition: one held felt line over a sul-tasto D-flat pedal, a note for each thing he writes
    (the lamp's F4, A-flat4 on the title, C5, B-flat4, D-flat5 on the passages; the Ache on glass for "hopeful, and
    scary"), held under "someone gets to be in the room." (nothing attacks); on PUBLISH the line steps to E-flat5 and
    the chip's Build line takes it up to A-flat (his click ships it), ringing through the rival's refresh and the lid
    into the match cut (the Atem sting and the duel's boot)."""
    if not (tl.has('v35-18.01') and tl.has('v35-19.04')):
        return None
    w0 = tl.B('v35-18.01')
    marker = (tl.snd_any('marker_write_q', w0, w0 + 2.0) or [w0 + 0.3])[0]
    ex = tl.B('v35-18.02')
    lamp = tl.B('v35-18.03')
    p0 = tl.B('v35-19.01')
    title = p0 + tl.os_at('v35-19.01', 'Planning', default=p0 + 0.8) - p0
    pas = sorted(o['t'] for o in tl.onscreen if o['beat'] == 'v35-19.02' and not o['text'].startswith('RAIL'))
    face = tl.B('v35-19.03')
    pub_b = tl.B('v35-19.04')
    publish = pub_b + 0.5                           # the Publish click (no sound in the lock; 0.5 s in, before the feed)
    cut = tl.E('v35-19.04')
    c = V.Cue('window', tl, anchor=marker, anchor_bar=2, bars=int((cut - marker) / BAR) + 5, swing=0.0)
    T = palette()
    T['felt'].gain_db, T['felt'].sends = -1.0, {'room': -12, 'hall': -16}
    T['lead'].gain_db, T['lead'].sends = -6.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['tri'].gain_db, T['tri'].eq = -7.0, [('lp', 900), ('hp', 45)]
    T['sub'].gain_db = -12.0
    for k in ('vla', 'vc'):
        T[k].gain_db, T[k].sends = -4.0, {'hall': -10, 'room': -16}
    T['vc'].eq = list(T['vc'].eq) + [V.PIZZ_NOTCH]
    T['glasspad'].gain_db = -12.0

    def fch(ps, t, d, v, roll=0.016, span_end=None):
        return c.pch('felt', ps, t, d, v, roll=roll, span_end=span_end)

    # ---- THE WINDOW: the marker's pass (the Build in A-flat major, climbing off the top of the glass)
    fch(['Ab2', 'Eb3', 'C4', 'G4'], w0 - 0.06, ex - w0 + 0.4, 0.17, roll=0.012)    # (leads the cut from Sydney)
    c.n('sub', 'Ab1', marker, 1.2, 0.3, True, punch=0.0, click=0.0, decay=1.0)
    ps = cell()
    for i in range(16):
        t = marker + i * S16
        p = ps[i % 16] + (12 if i >= 12 else 0)
        c.n('lead', p, t, S16 * 0.66, 0.32 * ACC4[i % 4], True, duty=0.5, att=0.002, dec=0.1, sus=0.5, rel=0.05)
    c.mark(marker, 'DESIGNED HIT: THE WINDOW: Gerg\'s marker takes the line off the top of the glass: the Build\'s pass '
                   'in its A-flat major, climbing (the team\'s peak)')
    t = marker + 16 * S16
    while t < ex - 0.1:
        if not tl.talking(t, t + 0.05, pad=0.08):
            c.n('tri', 'Ab2', t, Q / 2 * 0.7, 0.22, True, att=0.004, dec=0.1, sus=0.5, rel=0.04)
        t += Q / 2
    ls = tl.lines_in(ex, lamp)
    laugh = (max(l['end'] for l in ls) + 0.12) if ls else ex + 3.0
    tb_ = c.next_bar(marker + 16 * S16)
    fch(['Db3', 'Ab3', 'C4', 'F4'], tb_, laugh - tb_ + 0.1, 0.15, span_end=laugh - 0.02)   # held under the exchange
    c.rebow('vla', 'Ab3', ex - 0.4, laugh + 0.6, 0.1, first_att=1.0, last_rel=0.6, art='sus', lp=1300)
    if laugh < lamp - 0.6:
        fch(['Ab2', 'Eb3', 'C4', 'G4'], laugh, lamp - laugh + 0.3, 0.19)
        c.n('lead', 'Eb5', laugh + 0.02, S16 * 1.6, 0.3, True, duty=0.5, att=0.002, dec=0.12, sus=0.3, rel=0.05)
        c.n('lead', 'Ab5', laugh + 0.02 + Q / 2, 0.55, 0.32, True, duty=0.5, att=0.002, dec=0.2, sus=0.35, rel=0.12)
        c.mark(laugh, 'the four of them laugh: the Build\'s tag "shipped" (E-flat5 -> A-flat5), the felt\'s A-flat '
                      'again (the height)')
    c.section('THE WINDOW: the Build in A-flat major, the team\'s peak', marker, lamp)
    # ---- THE LAMP: one felt note
    fch(['F4'], lamp + 0.1, title - lamp + 0.3, 0.18, roll=0.0)
    c.mark(lamp + 0.1, 'the lamp: the others go home; one felt note (F4)')
    # ---- THE VISION POST: the held felt line over a sul-tasto D-flat pedal
    c.rebow('vc', 'Db3', p0 - 0.3, cut + 0.3, 0.12, first_att=1.5, last_rel=0.8, art='sus', lp=1100)
    c.rebow('vla', 'Ab3', p0 + 0.5, cut + 0.3, 0.1, first_att=1.8, last_rel=0.8, art='sus', lp=1300)
    steps = [(title, 'Ab4', ['Db3', 'F3', 'C4'])]
    for t_, p_, ch_ in zip(pas, ('C5', 'Bb4', 'Db5'), (['Ab2', 'Eb3', 'G3'], ['Gb2', 'Db3', 'F3'], ['Bb2', 'F3', 'Ab3'])):
        steps.append((t_, p_, ch_))
    for k, (t_, p_, ch_) in enumerate(steps):
        t_end = steps[k + 1][0] if k + 1 < len(steps) else publish
        tt = t_ + 0.05
        if tl.talking(tt, tt + 0.05, kinds={'vo', 'mas'}):
            continue
        fch(ch_ + [p_], tt, t_end - tt + 0.25, 0.14, span_end=t_end + 0.05)
        c.mark(tt, f'the vision post: the held line steps to {p_}', hit=False)
    if len(pas) >= 3:                                            # "hopeful, and scary": the Ache for a bar
        c.ch('glasspad', ['G4', 'Db5'], pas[2] + 1.2, BAR, 0.2, roll=0.0, rel=0.8)
        c.mark(pas[2] + 1.2, 'the vision post: "hopeful, and scary": the Ache on glass for a bar', hit=False)
    vo = tl.lines_in(face, pub_b, kinds={'vo'})
    for l in vo:
        c.mark(l['on'], f'the V.O. ({l["id"]}) sits in the held D-flat5: nothing attacks', hit=False)
    # PUBLISH: the line steps to E-flat5; the chip's Build line takes it to A-flat (his click ships it)
    fch(['Ab2', 'Eb3', 'C4', 'Eb4'], publish, cut - publish + 0.2, 0.15, span_end=cut + 0.1)
    for i, p in enumerate(['Eb5', 'C5', 'Bb4', 'Ab4', 'Ab4', 'Bb4', 'C5', 'Eb5']):
        c.n('lead', p, publish + i * S16, S16 * 0.62, 0.24 * ACC4[i % 4], True, duty=0.25, att=0.002, dec=0.09,
            sus=0.45, rel=0.035)
    c.n('lead', 'Ab5', publish + 8 * S16, 0.6, 0.24, True, duty=0.25, att=0.002, dec=0.2, sus=0.3, rel=0.12)
    c.mark(publish, 'PUBLISH (0.5 s into 19.04; the lock has no click): the line steps to E-flat5, the chip\'s Build '
                    'line takes it up to A-flat (his click ships it); it rings through the refresh and the lid')
    V.thin(c, {'vo': dict(drop={'lead', 'tri', 'celesta'}), 'mas': dict(drop={'lead', 'tri'}),
               'talk': dict(soften={'lead': 0.75, 'tri': 0.8})}, t0=marker + 16 * S16)
    c.section('the lamp: one felt note', lamp, p0)
    c.section('THE VISION POST: the held felt line (quiet ambition)', p0, publish)
    c.section('Publish: the Build\'s line, ringing into the match cut', publish, cut)
    macro = [(marker - 0.5, 1.5), (lamp, 1.5), (lamp + 1.0, 0.0), (cut + 1.0, 0.0)]
    meta = dict(
        id='window', title='The Window / The Vision Post (Ep1 v3.5, Act One sc 18-19)', mm='(to picture)', usage='BI',
        family='the Build in A-flat major (M1\'s colour) -> his felt, a held line over a sul-tasto pedal',
        tone='the window: joy at the team\'s peak, a small warm accent; the post: quiet ambition',
        scenes=['Ep1 v3.5 Act One sc 18-19'],
        motifs=["Gerg's Build (A-flat major) and its tag \"shipped\"", 'the felt F4 (the lamp)', 'a held felt line',
                'the Ache (once, "scary")'], motif_ids=[], key='A-flat major; D-flat lydian over a D-flat pedal',
        composer='v3.5 composer (the final pass), 2026-09-28', underscore_lufs=-21.0, album_lufs=-16.0,
        audition=['the window: warm, the team\'s height, never a trio or a sitcom button',
                  'the post: quiet ambition, one line held, not a hymn', 'Publish: the chip takes it up'])
    sc = c.finish(T, meta, length_end=cut + 0.5, macro=macro, end_fade=(cut - 1.0, cut + 0.45))
    return c, sc


# ---------------------------------------------------------------- THE WAITLIST (a smug little sting)
def cue_waitlist(tl):
    """ELGOOG'S WAITLIST (sc 22): a smug little sting on the rope's snap: the Build's tag "shipped" (E-flat5 ->
    A-flat5) on the chip, a pizz A-flat under it, the felt's A-flat maj9 (they're ahead); it rings out under the pause
    letter's toast and gives way on the push (MM-17's C comes in there)"""
    snap = waitlist_snap(tl)
    if snap is None:
        return None
    push = tl.snd('12.01', 'paper_whip', default=tl.B('12.01') + 2.0)
    c = V.Cue('waitlist', tl, anchor=snap, anchor_bar=2, bars=5, swing=0.0)
    T = palette()
    T['lead'].gain_db, T['lead'].sends = -5.0, {'room': -14, 'snes': -16}
    T['lead'].eq = [('hp', 220), ('lp', 5200)]
    T['felt'].gain_db, T['felt'].sends = -2.0, {'room': -12, 'hall': -18}
    dup(T, 'vc', 'vc_pz', gain_db=-2.0)
    T['vc_pz'].eq = list(T['vc_pz'].eq) + [V.PIZZ_NOTCH]
    T['vla'].gain_db = -6.0
    c.n('lead', 'Eb5', snap, S16 * 1.6, 0.34, True, duty=0.25, att=0.002, dec=0.12, sus=0.3, rel=0.05)
    c.n('lead', 'Ab5', snap + Q / 2, 0.5, 0.34, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
    c.n('vc_pz', 'Ab2', snap, 0.4, 0.5, art='pizz')
    c.n('vc_pz', 'Eb3', snap + Q / 2, 0.4, 0.42, art='pizz')
    c.pch('felt', ['Ab2', 'Eb3', 'C4', 'G4'], snap + Q / 2 + 0.01, push - snap - Q / 2, 0.16, roll=0.012)
    c.rebow('vla', 'Eb3', snap + 0.4, push + 0.2, 0.1, first_att=1.0, last_rel=0.4, art='sus', lp=1300)
    c.mark(snap, 'THE WAITLIST: the rope snaps: the Build\'s tag "shipped" on the chip, a pizz A-flat (a smug sting)')
    if tl.has('v35-22.02'):
        # v3.5b (SN 00000A step 2): THE USAGE FLASH before the letter (2.0 s). The sting's felt chord rings on under it
        # (the same A-flat maj9), and the chip climbs with the five lines in the Build's own colour: 16ths up A-flat
        # major, landing the tag's A-flat5 on the letter's toast (12.01's pop, a beat early: 0.4 s before the cut)
        fl0 = tl.B('v35-22.02')
        land = tl.B('12.01') - 0.4
        run = ['Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'G5']
        for i, p in enumerate(run):
            t = land - (len(run) - i) * S16
            c.n('lead', p, t, S16 * 0.62, 0.2 + 0.015 * i, True, duty=0.25, att=0.002, dec=0.09, sus=0.4, rel=0.035)
        c.n('lead', 'Ab5', land, 0.5, 0.3, True, duty=0.25, att=0.002, dec=0.2, sus=0.35, rel=0.12)
        c.n('vc_pz', 'Eb3', land, 0.4, 0.36, art='pizz')
        c.mark(land - len(run) * S16, 'v3.5b THE USAGE FLASH: the chip climbs with the lines (16ths up A-flat major), the '
                                      'sting\'s chord ringing on', hit=False)
        c.mark(land, 'the climb lands on A-flat5 (the tag) under the letter\'s toast')
        c.mark(tl.B('12.01'), 'the sting rings out under the pause letter\'s header', hit=False)
        c.section('the waitlist: the smug sting', snap, fl0)
        c.section('v3.5b the usage flash: the sting rings on; the chip climbs with the lines, landing under the toast',
                  fl0, push)
    else:
        c.mark(tl.B('12.01'), 'the sting rings out under the pause letter\'s toast', hit=False)
        c.section('the waitlist: the smug sting, ringing under the toast', snap, push)
    meta = dict(id='waitlist', title='Elgoog\'s Waitlist (Ep1 v3.5, Act One sc 22)', mm='(sting)', usage='BI',
                family='the Build\'s tag, a pizz, the felt', tone='a smug little laugh: they\'re ahead',
                scenes=['Ep1 v3.5 Act One sc 22'], motifs=['the Build\'s tag "shipped" (E-flat5 -> A-flat5)'],
                motif_ids=[], key='A-flat major', composer='v3.5 composer (the final pass), 2026-09-28',
                underscore_lufs=-21.0, album_lufs=-16.0, audition=['smug and small: never a rimshot'])
    sc = c.finish(T, meta, length_end=push + 0.4, end_fade=(push - 0.8, push + 0.35))
    return c, sc


CUES_V35 = {'first_weeks': cue_first_weeks, 'dream': cue_dream, 'arena': cue_arena, 'window': cue_window,
            'waitlist': cue_waitlist}                 # built only when the lock has their beats


CUES_V31 = {'sydney': cue_sydney, 'atem': cue_atem}      # built only when the lock has their beats


CUES = {'a': cue_a, 'code_red': cue_code_red, 'lobby': cue_lobby, 'floor': cue_floor, 'lobby2': cue_lobby2,
        'duel': cue_duel, 'pause': cue_pause, 'threat': cue_threat}


def lay(tl, built, work):
    wav = lambda k: os.path.join(work, f'{built[k][1].name}-underscore.wav')   # noqa: E731
    T0 = lambda k: built[k][0].T0                                              # noqa: E731
    cA = built['a'][0]
    cr = built['code_red'][0]
    lob = built['lobby'][0]
    t_cr = [t for t, lab, h in cr.marks if lab.startswith('the siren\'s whine')][0]
    lock = [t for t, lab, h in cr.marks if lab.startswith('THE LOCK')][0]
    pop = [t for t, lab, h in lob.marks if lab.startswith('THE POP')][0]
    fl = built['floor'][0]
    fl_in = fl.bar1
    jangle = [t for t, lab, h in fl.marks if lab.startswith('the key ring')][0]
    l2 = built['lobby2'][0]
    l2_in = l2.bt(1, 3) - 0.05
    close = tl.snd('9.13', 'folder_close', default=tl.E('9.13') - 1.2)
    duel_in = tl.B('11.01')
    push = tl.snd('12.01', 'paper_whip', default=tl.B('12.01') + 2.0)
    refl = tl.B('12.05')
    lift = tl.snd('12.06', 'pen_tick_3', default=tl.B('12.06') + 1.5)
    thud = tl.snd('v31-12.03', 'synth:thud', default=tl.B('v31-12.03')) if tl.has('v31-12.03') else None
    pause_end = thud if thud is not None else refl
    tear = tl.B('7.02')
    phone = lambda x: futz(x, 'phone')                                          # noqa: E731
    sy_in = sydney_beats(tl)[0]['t0'] if 'sydney' in built else None
    lob_in = [t for t, lab, h in lob.marks if lab.startswith('the bass walks in')][0] - 0.05   # its first note
    v35 = 'first_weeks' in built
    a_end = (call_out(tl) + 0.7) if v35 else max(tear + 2.6, t_cr + 0.7)
    a_post = {}
    if v35:
        # v3.5: the odometer (featured) read p95 -14.6 on the v3.5 render (the lift is a bar longer): a -1.2 dB fader
        # ride on it at the lay, from the wait to the hit on the cut to Rima (0.3 s ramps), to the -16 featured guide
        import numpy as np
        w0_ = [t for t, lab, h in cA.marks if lab.startswith('A4 THE')][0]
        w1_ = [t for t, lab, h in cA.marks if lab.startswith('the band hit on the cut to Rima')][0] + 0.4

        def ride(x, a_=w0_ - cA.T0, b_=w1_ - cA.T0, g_=10 ** (-1.2 / 20.0), r_=0.3):
            n = x.shape[1]
            t = np.arange(n) / V.SR
            env = np.ones(n)
            env = np.where((t >= a_) & (t < b_), g_, env)
            up = (t >= a_ - r_) & (t < a_)
            env[up] = 1.0 + (g_ - 1.0) * (t[up] - (a_ - r_)) / r_
            dn = (t >= b_) & (t < b_ + r_)
            env[dn] = g_ + (1.0 - g_) * (t[dn] - b_) / r_
            return x * env[None]
        a_post = dict(post=ride, post_name='a -1.2 dB fader ride on the odometer (the wait to the hit on Rima)')
    layers = [
        dict(name='a_launch', wav=wav('a'), T0=T0('a'), a0=0.0, a1=a_end, fin=0.0, fout=0.9, **a_post),
        dict(name='code_red', wav=wav('code_red'), T0=T0('code_red'), a0=t_cr, a1=lock, fin=0.4, fout=0.003,
             post=phone, post_name="era.futz('phone'): his phone's small speaker", level=-22.0),
        dict(name='lobby', wav=wav('lobby'), T0=T0('lobby'), a0=lob_in, a1=pop, fin=0.05, fout=0.003),
        dict(name='floor', wav=wav('floor'), T0=T0('floor'), a0=fl_in, a1=jangle + 1.1, fin=0.8, fout=0.6),
        dict(name='lobby2', wav=wav('lobby2'), T0=T0('lobby2'), a0=l2_in,
             a1=(sy_in + 0.55) if sy_in is not None else close + 0.05, fin=0.05,
             fout=0.04 if sy_in is not None else 0.5),      # v3.2: it crossfades into Sydney (audit-v31 #14)
        dict(name='duel', wav=wav('duel'), T0=T0('duel'), a0=duel_in,
             a1=(waitlist_snap(tl) + 0.5) if 'waitlist' in built else push + 0.5, fin=0.0,
             fout=0.6 if 'waitlist' in built else 1.0),
        dict(name='pause', wav=wav('pause'), T0=T0('pause'), a0=push - 0.05, a1=pause_end, fin=0.05,
             fout=0.003 if thud is not None else 0.3),
        dict(name='threat', wav=wav('threat'), T0=T0('threat'), a0=lift - 0.01, a1=tl.length, fin=0.005, fout=0.3),
    ]
    if 'sydney' in built:                                     # v3.1: laid in its beats' window
        bs = sydney_beats(tl)
        layers.append(dict(name='sydney', wav=wav('sydney'), T0=T0('sydney'), a0=sydney_in(tl) - 0.02,
                           a1=bs[-1]['t1'], fin=0.02, fout=0.35))
    if 'atem' in built:
        ca = built['atem'][0]
        h = [t for t, lab, hh in ca.marks if lab.startswith('THE ATEM')][0]
        layers.append(dict(name='atem', wav=wav('atem'), T0=T0('atem'), a0=h - 0.02, a1=h + 2.2, fin=0.005, fout=0.4))
    dream_in = None
    if 'first_weeks' in built:                                # v3.5: the first weeks, into code red's whine
        cf = built['first_weeks'][0]
        layers.append(dict(name='first_weeks', wav=wav('first_weeks'), T0=T0('first_weeks'), a0=tl.B('v35-10.01') - 0.004,
                           a1=t_cr + 0.35, fin=0.004, fout=0.45))
    if 'dream' in built:                                      # v3.5: 3 AM's one note -> JUN 2018 -> the lobby's bass
        cd = built['dream'][0]
        dream_in = [t for t, lab, h in cd.marks if lab.startswith('DESIGNED HIT: 3 AM')][0] - 0.02
        layers.append(dict(name='dream', wav=wav('dream'), T0=T0('dream'), a0=dream_in, a1=lob_in + 0.4, fin=0.02,
                           fout=0.75))
    if 'arena' in built:                                      # the arena: diegetic, through the monitors, low
        layers.append(dict(name='arena', wav=wav('arena'), T0=T0('arena'), a0=tl.B('v35-13.01') - 0.01,
                           a1=tl.B('v35-13.05') + 0.35, fin=0.2, fout=0.5, post=lambda x: futz(x, 'tv'),
                           post_name="era.futz('tv'): the arena on the wall of monitors", level=-31.0))
    if 'window' in built:                                     # v3.5: the window, the lamp, the vision post
        layers.append(dict(name='window', wav=wav('window'), T0=T0('window'), a0=tl.B('v35-18.01') - 0.08,
                           a1=tl.E('v35-19.04') + 0.3, fin=0.04, fout=0.5))
    if 'waitlist' in built:                                   # v3.5: the smug sting, under the toast into the push
        layers.append(dict(name='waitlist', wav=wav('waitlist'), T0=T0('waitlist'), a0=waitlist_snap(tl) - 0.02,
                           a1=push + 0.3, fin=0.005, fout=0.45))
    after_lock = dream_in if dream_in is not None else lob_in
    stops = [(lock, after_lock), (pop, fl_in), (pause_end, lift - 0.01)]
    room = ' / '.join(f'"{l["text"]}"' for l in tl.lines_in(pop, fl_in + 0.2))
    designed = [(lock, after_lock, ('the phone locks (a diegetic stop); 3 AM: no score under the at-capacity page and '
                                    'the first read (the bullpen\'s fans), until his second read\'s one felt note')
                 if dream_in is not None else
                 'the phone locks (a diegetic stop) -> the lobby\'s pickup under the revolving door'),
                (pop, fl_in, 'the collar\'s pop: the swing stops dead; the lobby\'s room under ' + room),
                (pause_end, lift, ('EMIT\'s THUD stops the pause letter: no score through the page, his desk and the '
                                   'reflection, until the THREAT on the pen\'s lift') if thud is not None else
                 'no score on the reflection (Alyi in the glass; the pen\'s scratch only)')]
    if 'sydney' not in built:    # (v3: the laptop closed at the lobby's end; v3.2 crossfades lobby2 into Sydney)
        designed.insert(2, (close, duel_in, 'Gerg closes his laptop: his button, in the room (then the match cut)'))
    stings = [(lift, tl.length, 'THREAT (the act-out sting)')]
    return layers, stops, designed, stings


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))   # render/_work/ (Kokoro), render/_work/el/ (git-ignored)
    built = {k: fn(tl) for k, fn in CUES.items()}
    built.update({k: r for k, r in ((k, fn(tl)) for k, fn in CUES_V31.items()) if r is not None})
    built.update({k: r for k, r in ((k, fn(tl)) for k, fn in CUES_V35.items()) if r is not None})
    if args.dry:
        for k, (c, sc) in built.items():
            print(k, V.note_qa(sc), f'file T0 {c.T0:.3f}', sc.meta.get('clock_notes', ''))
        return
    if args.render is not None:
        for k in (args.render or list(built)):              # every cue this lock has (v3.1: sydney, atem too)
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers, stops, designed, stings = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out, stops=stops, designed=designed)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = []
    for k, (c, sc) in built.items():
        rows += [(f'{sc.name}: {lab}', a0, a1) for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, designed, stings=stings)
    res['threat_momentary_max'] = V.momentary_max(mix, stings[0][0], stings[0][1])
    cues = []
    for L in layers:
        k = [kk for kk, (c, sc) in built.items() if sc.name == L['name']][0]
        c, sc = built[k]
        cues.append(dict(cue=L['name'], start=round(L['a0'], 3), end=round(L['a1'], 3), what=sc.meta.get('tone'),
                         family=sc.meta.get('family'), render=os.path.relpath(L['wav'], V.REPO),
                         laid_at_s=round(c.T0, 4), post=L.get('post_name'), level=res['cues'][L['name']],
                         target_lufs=L.get('level', sc.meta.get('underscore_lufs')),
                         engine_qa=V.engine_qa(work, sc.name), note_qa=V.note_qa(sc),
                         clock_notes=sc.meta.get('clock_notes'),
                         sync=[dict(t=round(t, 3), what=lab, hit=h) for t, lab, h in c.marks]))
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-act1{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='underscore (per-cue engine masters; code red laid at -22 LUFS-I after the phone futz; THREAT a sting), '
              'dry of dialogue; the mixer ducks it', cues=cues,
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed],
        designed_hit=[dict(t=round(t, 3), cue='a_launch', what=lab, exempt='the mix\'s act-head score fade: this '
                           'downbeat is the design (5.01: HARD CUT on the downbeat, out of the card); fade it in 30-50 '
                           'ms at most (audit-v31 #13)')
                      for t, lab, h in built['a'][0].marks if lab.startswith('A1 THE DOWNBEAT')]
        + [dict(t=round(t, 3), cue=sc_.name, what=lab, exempt='a designed entry or step on a cut (v3.5)')
           for k_, (c_, sc_) in built.items() for t, lab, h in c_.marks if lab.startswith('DESIGNED HIT')],
        measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')
    for k, v in res['cues'].items():
        print(f'  {k}: {v}')
    print('threat momentary max:', res['threat_momentary_max'])
    print('unmarked digital silence:', res['unmarked_digital_silence'])
    print('undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
