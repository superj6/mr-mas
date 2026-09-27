"""E01 Act Four v5 · S5 · HIS SIDE, 2 AM: WHAT THEY DIDN'T KNOW · DARK ROOM (MM-10 a), one continuous performance
act frames 6985 -> 9001 (S5.02, the home shot -> S6.01, the avalanche's downbeat), 84.0 s; file t = 0 = act 6985.

ONE F/C PEDAL from the home shot to the avalanche (the edit plan §4, the script's sc 29 MUSIC line): cello F3 and viola
C4 sul tasto, re-bowed with silent crossfades, over the room's drone (the SFX room_drone is F1 + C2, so nothing here
goes below C3: OST-BIBLE P01, as MM-08's 26A carve does).  Everything else surfaces on it and leaves it:

  act s     what                                                                            picture
  291.04    the pedal bows in under the home shot (the card's felt F4, S1-S4's, rings into it)  S5.02 glass + GUEST
  293.8     Rima's post and the hearts on the beat: the pedal alone (the record; no note per   S5.03
            heart)
  298.10    THE FELT SURFACES for the Orb exchange: one C4 (the Water Line's bar-2 note; the   S5.04 the Orb's look
            settle never comes), pedal down, held and not moving through "mostly."             S5.05
  303.95    THE BUILD enters with his keys, low: compile passes 4 . - . 8 . 12 . 8 . 4        S5.09 Gerg's tile
            (straight 16ths, chip + xylophone), out under Mas's line
  317.72    THE PULSE (upright bass, the pedal's own C3 / F3, soft quarters) enters as he      S5.06 the letter
            reads; under the quoted lines only the pedal and the pulse (the record plays dry);
            it tightens to eighths in the bar before 745 and lands on the count's stop
  337.09    the pulse drops out for the scroll's stop on ALYI (REPORTED) and the Orb's chime   S5.06 the name
  341.79    the pulse comes back on "He did both." and walks on, a notch lower, under the      S5.07b, S5.08 the check
            check (it leaves the stamp's beat to the stamp)
  349.15    the Build again with his keys: 4, then 8 under "The company. Again. Just in case." S5.09 back
  354.17    RING-OUT: the Build stops dead on his look up; the pedal holds under "pack?" and   S5.09b
            "ask me when it compiles."
  361.65    Tasya's Rhodes: ONE soft chord on the door (A-flat maj9 over the F pedal: the     S5.11 the slate door
            title's F9sus4)
  369.9     the second chord on "desk" (C maj9: F lydian over the pedal); gone before          S5.11 "a desk for every
            "leave it open."                                                                  one of them"
  372.7     "leave it open.": the pedal alone                                                 S5.12
  375.04    the pedal rings across the avalanche's downbeat (the S6 cue starts there)          S6.01

Nothing here was listened to.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util as _ilu   # noqa: E402
_sp = _ilu.spec_from_file_location('s5_s8_common', os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                                's5-s8_common.py'))
C = sys.modules.get('s5_s8_common') or _ilu.module_from_spec(_sp)
if 's5_s8_common' not in sys.modules:
    sys.modules['s5_s8_common'] = C
    _sp.loader.exec_module(C)
from engine import *   # noqa: E402,F401,F403
from engine.motifs import line_pitches   # noqa: E402

ID = 's5-s8_s5-two-am'
F0 = C.BEATS['S5.02']['f0']          # 6985
F1 = C.BEATS['S6.01']['f0']          # 9001: the avalanche's downbeat
BUILD = line_pitches(MOTIFS['BUILD']['line'])
CHIP = dict(duty=0.25, rel=0.035, dec=0.09, sus=0.45, att=0.002)
Q = 0.625                            # a beat at 96 BPM (s)


def events():
    """every sync point of this cue, in act seconds, read from the locked stick timeline"""
    B, Lon, Lend, W, snd, txt = C.B, C.Lon, C.Lend, C.W, C.snd, C.txt
    E = dict(
        home=B('S5.02'), post_rima=txt('S5.03', 'RIMA'), heart1=snd('S5.03', 'key_tap_soft_01'),
        orb=B('S5.04'), servo=snd('S5.04', 'orb_servo'), badge_on=Lon('a5-29-01'), mostly_end=Lend('a5-29-02'),
        gerg=B('S5.09'), ring=snd('S5.09', 'RING'), click=snd('S5.09', 'dialog_ok_click'),
        letter=B('S5.06'), read_on=Lon('a5-29-06'), clunk=snd('S5.06', 'odometer_ratchet'),
        alyi=txt('S5.06', 'ALYI (REPORTED)'), chime=snd('S5.06', 'bell_ding_F6'),
        did_both=Lon('a5-29-14'), check=B('S5.08'), stamp=snd('S5.08', 'rubber_stamp_C'),
        back=B('S5.09-back'), look=B('S5.09b'),
        door=B('S5.11'), door3=snd('S5.11', 'landing_thunk', 2), sign=txt('S5.11', 'MAS / GERG'),
        key=snd('S5.11', 'key_tap_space'), desk=W('a5-29-22', 'desk'), leave_on=Lon('a5-29-23'),
        av=B('S6.01'),
    )
    # lines this cue must not move under (Mas's room lines: the pedal holds, nothing starts) -- act s
    E['mas_lines'] = [(Lon(l), Lend(l)) for l in ('a5-29-01', 'a5-29-02', 'a5-29-04', 'a5-29-08', 'a5-29-10',
                                                  'a5-29-13', 'a5-29-16', 'a5-29-19', 'a5-29-21', 'a5-29-23')]
    E['record_lines'] = [(Lon(l), Lend(l)) for l in ('a5-29-06', 'a5-29-07', 'a5-29-09')]
    return E


def tracks():
    T = palette()
    for k in ('ubass', 'cb_pizz'):          # the pizz body resonance near 111 Hz (A2): notched as v4 / MM-08 / MM-09
        T[k].eq = list(T[k].eq) + [('peq', 111.3, -10.0, 8.0)]
    T['felt'].gain_db = -1
    T['felt'].sends = {'room': -12, 'hall': -18}
    T['lead'].gain_db = -5                  # the Build sits low under his voice (render 2: -3 -> -5; with the firmer
                                            # F below, the chip A-flat's 16th-rate AM sideband near 429 Hz reads under
                                            # the F-major check's limit)
    T['lead'].sends = {'room': -14, 'snes': -16}
    T['xylo'].gain_db = -10
    T['rhodes'].gain_db = -6.0              # MM-11's Tasya settings
    T['rhodes'].sends = {'room': -12, 'plate': -12}
    return T


def build():
    E = events()
    cue = C.Cue(ID, F0, F1)
    s, a, g = cue.s, cue.a, cue.g
    T = tracks()
    log = cue.log

    # ------------------------------------------------------------------ the pedal (one performance, home -> avalanche)
    p0, p1 = s(E['home']), s(E['av']) + 0.3
    C.rebow(a, 'vc', 'F3', p0, p1, 0.25, seg=5.0, xf=1.2, first_att=1.4, last_rel=0.5, art='sus', lp=1300)
    C.rebow(a, 'vla', 'C4', p0 + 0.25, p1, 0.18, seg=5.0, xf=1.2, first_att=1.6, last_rel=0.5, art='sus', lp=1500)
    log.append((E['home'], 'the DARK ROOM pedal bows in (vc F3 + vla C4, sul tasto; silent attack 1.4 s)'))

    # ------------------------------------------------------------------ the felt surfaces for the Orb exchange
    tf = E['servo'] + 0.175                                   # just after the Orb's servo, before his line
    a.n('felt', 'C4', s(tf), E['gerg'] - tf, 0.4, lock=True)
    a.n('felt_mech', 'C4', s(tf), 0.05, 0.2, lock=True)
    T['felt'].pedal = [(0.0, False), (s(tf) - 0.02, True), (s(E['gerg']) + 0.3, False)]
    cue.mark(tf, 'the felt surfaces: C4 (the Water Line\'s bar 2; the settle never comes), held through "mostly."')

    # ------------------------------------------------------------------ the Build with Gerg (compile passes)
    def build16(t_act, n, vel, stop_at=None):
        out = []
        for i in range(n):
            tt = t_act + i * Q / 4
            if stop_at is not None and tt >= stop_at - 0.01:
                break
            d = Q / 4 * 0.62
            if stop_at is not None:
                d = min(d, stop_at - tt - 0.005)
            out.append(a.n('lead', BUILD[i % 16], s(tt), d, vel * (1.0, 0.72, 0.84, 0.72)[i % 4], True, **CHIP))
            if i % 4 == 0:
                a.n('xylo', BUILD[i % 16], s(tt), min(0.1, d + 0.03), 0.18, lock=True)
        return out

    b0 = E['click'] + 0.075                                   # the tile opens on the click; his keys start
    passes = [(0, 4), (2, 8), (3, 12), (4, 8), (5, 4)]        # (bar from b0, sixteenths): bar 1 rests under Mas
    for k, n in passes:
        t0 = b0 + k * 4 * Q
        build16(t0, n, 0.46, stop_at=E['letter'])
        cue.mark(t0, f'the Build: compile pass ({n})')
    # back on Gerg: 4 with his keys at the cut; out under "what are you building?"; 8, then a pass cut dead by his look
    tb = E['back'] - 0.06
    build16(tb, 4, 0.46)
    cue.mark(tb, 'the Build: back with his keys (4)')
    t8 = C.Lon('a5-29-17') + 0.01
    build16(t8, 8, 0.48)
    cue.mark(t8, 'the Build: 8 under "The company. Again. Just in case."')
    t12 = t8 + 8 * Q / 4 + 0.25
    build16(t12, 12, 0.5, stop_at=E['look'])
    cue.mark(t12, 'the Build: 12, cut dead by his look')
    log.append((E['look'], 'RING-OUT: the Build stops dead on his look up; the pedal holds'))

    # ------------------------------------------------------------------ the pulse under the letter
    def pulse(t_act, i, v):
        a.n('ubass', 'F3' if i % 2 == 0 else 'C3', s(t_act), 0.3, v, lock=True)

    # quarters in groups of three and a rest (F C F -), so it walks and breathes: never one pitch at an even rate,
    # never a lub-dub; the bar before the count's stop tightens to eighths
    ck = E['clunk']
    k0 = 29                                                   # quarters back from the count's stop: 317.72 s
    t_first = ck - k0 * Q
    for k in range(k0, 4, -1):                                # quarters up to the last bar before the stop
        t = ck - k * Q
        if k % 4 == 1:                                        # beat 4 rests (the bars are counted back from the stop,
            continue                                          # so k % 4 == 0 is a downbeat)
        u = (t - t_first) / (ck - t_first)
        pulse(t, 0 if k % 4 in (0, 2) else 1, 0.26 + 0.12 * u)
    for j in range(8):                                        # the last bar: eighths (the count tightens)
        pulse(ck - 4 * Q + j * Q / 2, j, 0.35 + 0.03 * (j % 2 == 0))
    pulse(ck, 0, 0.42)                                        # on the count's stop (745): F
    pulse(ck + Q, 1, 0.3)
    pulse(ck + 2 * Q, 0, 0.24)                                # its last note decays before the scroll stops on ALYI
    cue.mark(t_first, 'the pulse enters as he reads (C3/F3 on the beat)')
    cue.mark(ck, 'the count stops at 745: the pulse lands')
    log.append((ck + 2 * Q, 'the pulse\'s last note; out for the scroll\'s stop on ALYI (REPORTED) and the chime'))
    # back on "He did both.", a notch lower under the check; the stamp's beat is left to the stamp
    t, i = E['did_both'], 0
    while t < E['back'] - 0.3:
        if abs(t - E['stamp']) > 0.12 and i % 4 != 3:
            pulse(t, i % 4 % 2, max(0.2, 0.34 - 0.012 * i))
        t += Q
        i += 1
    cue.mark(E['did_both'], 'the pulse comes back on "He did both."')

    # ------------------------------------------------------------------ Tasya's Rhodes: the door, and "desk"
    AB = ['G3', 'Bb3', 'C4', 'Eb4']                           # A-flat maj9, rootless (MM-11's floor voicing)
    CM = ['G3', 'B3', 'D4', 'E4']                             # C maj9, rootless
    td = E['sign']                                            # the door is up and its sign is on
    a.ch('rhodes', AB, s(td), 2.6, 0.34, roll=0.006, lock=True)
    tk = E['desk']
    a.ch('rhodes', CM, s(tk), min(2.2, E['leave_on'] - tk - 0.6), 0.32, roll=0.006, lock=True)
    T['rhodes'].pedal = [(0.0, False)]
    cue.mark(td, "Tasya's Rhodes: one chord on the door (Abmaj9 over the F pedal)")
    cue.mark(tk, 'the second chord on "desk" (Cmaj9)')

    # ------------------------------------------------------------------ sections, bookkeeping
    for lab, a0, a1 in [('home + Rima\'s post (the pedal)', E['home'], E['orb']),
                        ('the Orb exchange (the felt C4)', E['orb'], E['gerg']),
                        ('Gerg at 2 AM (the Build)', E['gerg'], E['letter']),
                        ('the letter (the pedal + the pulse)', E['letter'], C.B('S5.07b')),
                        ('"He did both." + the check (the pulse)', C.B('S5.07b'), E['back']),
                        ('the Build again -> his look (ring-out)', E['back'], E['look']),
                        ('the look: the pedal alone', E['look'], E['door']),
                        ('the door (Tasya\'s Rhodes)', E['door'], C.B('S5.12')),
                        ('"leave it open." -> the downbeat', C.B('S5.12'), E['av'])]:
        cue.section(lab, a0, a1)
    meta = C.base_meta(
        ID, 'His Side, 2 AM (Ep1 Act Four v5, S5, to picture)', mm='MM-10',
        family='P01 DARK ROOM (MM-10 form a, re-laid)',
        tone='one low pedal in the dark under the record; the felt once for the Orb; the Build with Gerg; a pulse under '
             'the letter that stops for Alyi\'s name; the Build stops on his look; the landlord\'s two chords at the door',
        scenes=[f'v5 S5.02-S5.12, act {F0}-{F1} ({C.tc(C.S(F0))}-{C.tc(C.S(F1))}); file t=0 = act frame {F0}'],
        motifs=['the DARK ROOM pedal (F3/C4, sul tasto)', "the Water Line's C4 (felt; the settle never comes)",
                "the Build (Gerg's compile passes 4 / 8 / 12 / 8 / 4; 4 / 8 / 12 cut by his look)",
                "Tasya's floor: Abmaj9 on the door, Cmaj9 on \"desk\" (Rhodes)"],
        motif_ids=[], key='F open fifth (F3/C4) throughout; Abmaj9 and Cmaj9 over it at the door',
        underscore_lufs=-20.0, album_lufs=-18.0,
        silence_windows=[],
        room_sfx=[dict(t0=0.0, t1=s(E['av']), sfx='room_drone (the dark room)')],
        room_sfx_drop_stems=[],
        sfx_slots=[dict(t=round(s(E['heart1']) + k * Q, 3), sfx=f'heart tick {k + 1} (key_tap_soft)') for k in range(5)]
        + [dict(t=round(s(E['servo']), 3), sfx='orb_servo'), dict(t=round(s(E['ring']), 3), sfx='RING'),
           dict(t=round(s(E['click']), 3), sfx='dialog_ok_click'),
           dict(t=round(s(E['clunk']), 3), sfx='odometer_ratchet (745)'), dict(t=round(s(E['chime']), 3),
                                                                             sfx="the Orb's chime (bell_ding_F6 temp)"),
           dict(t=round(s(E['stamp']), 3), sfx='rubber_stamp_C: VOID IF CEO MISSING'),
           dict(t=round(s(E['door3']), 3), sfx="the door's third step"), dict(t=round(s(E['key']), 3), sfx='the key')],
        audition=[f'0-{s(E["orb"]):.1f} s: the pedal under the home shot, Rima\'s post and the hearts: air, not a drone '
                  'effect; does the card\'s felt F4 (S1-S4 cue) ring into it?',
                  f'{s(tf):.1f}-{s(E["gerg"]):.1f} s: the felt C4 for the Orb exchange: held, not moving under "mostly."',
                  f'{s(b0):.1f}-{s(E["letter"]):.1f} s: the Build low under Gerg: his keyboard, not a melody on his lines?',
                  f'{s(t_first):.1f}-{s(ck + 2 * Q):.1f} s: the pulse under the quoted letter: a pulse, not a heartbeat? '
                  'its stop for ALYI (REPORTED) and its return on "He did both."',
                  f'{s(E["look"]):.1f} s: the Build stops dead on his look and the pedal holds (a ring-out, not a hole)',
                  f'{s(td):.1f} / {s(tk):.1f} s: Tasya\'s two Rhodes chords over the pedal: warm, and his?'])
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
               length_s=s(E['av']) + 0.05, tail_s=1.2, meta=meta)
    sc.cue = cue
    return sc


if __name__ == '__main__':
    render_cli(build, __file__)
