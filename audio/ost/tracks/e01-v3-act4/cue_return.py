"""E01 v3 Act Four · S7 + S8 · THE RETURN -> THE LOBBY -> THE CODA · restrained irony, onto the vault's F

REVISED (the showrunner on the v3 film, 2026-09-27: "i didn't mean for you to overkill and make it sound goofy level
hapy"; SHOWRUNNER-NOTES note 2's correction: no victory laps; a major colour is fleeting, an added 9th with no third).
Act Four v5's S7-S8 (tracks/e01-act4-v5/s5-s8_s7s8_the_return.py, MM-11's material), copied and re-spotted to the v3
lock's ids, then pared back:
  a  STRAIGHT: the Door on the senza-vibrato solo violin under Alyi's post only; on the first heart its G3 holds and
     decays under the hearts and the exchange (no stop).
  b  Tasya's floor, quiet: the bare A-flat fifth pre-laps under the decay (under his "Everyone's packed..."), then the
     landlord's mediants on "below", "above", "around" (A-flat, C, E) as open fifths with the added 9th and no third,
     silent attacks; one quiet Rhodes chord (no third) home under the rail.
  c1 LEVERAGE fades in under Mada among the fires, the door bang inside it, thinned to its F pedal under Terb's
     reading and the terms, and a DEAD STOP on "of what?" (Mada's pause, both "good question"s and the long hold play
     in the room).
  c2 the stamp's C: a low C pedal bows in; Gerg's Build restarts on his post, four soft notes (F minor, OST-BIBLE
     s2.6); one pizz grain on the hourglass's last grain; the pedal rests on the sand.
  e  the sign: ONE UNDERSTATED STATEMENT, a little too calm: a still D-flat(add9) chord with no third on low strings
     and one soft horn, no swell, no motion, until the old dialog pops over it; the 1993 flat line F5 . F4 . F5 under
     Cancel's greying; the bonk (the SFX's E3).
  -  a designed rest on the lobby's neon F: the CU "silent like the first", nothing under "okay.".
  f  after "okay.": the felt C4 -> F4 over an open fifth; THE VAULT'S F: a glass pedal F3/C4 matched to the hum's fan
     tones; the Ache (G4 + D-flat5, pure beating tones) for the vault's own shot, cut with the picture; the pedal
     alone under the memo (the record) and the chair.
The act ends on the pedal (it carries into the tag: its release is render/music-ringout.wav).
Nothing here was listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from a4common import *   # noqa: E402,F401,F403
import a4common as C   # noqa: E402
from v3music import rebow, build16, BUILD_F, S16   # noqa: E402


class _Proxy:
    """lets v3music.build16 write on an SCue (act seconds)"""

    def __init__(self, cue):
        self.cue, self.T0 = cue, cue.T0

    def n(self, inst, p, t, d, v, lock=False, **x):
        return self.cue.a.n(inst, p, self.cue.s(t), d, v, lock, **x)

ID = 'e01-v3-a4-s7s8-return'
Q = 0.625


def events(c):
    B, txt, snd, Lon, Lend, W = c.B, c.txt, c.snd, c.Lon, c.Lend, c.W
    E = dict(
        s7=B('S7.01'), post=txt('S7.01', 'POST: ALYI'), post_end=txt('S7.01', 'POST: ALYI', end=True),
        heart1=snd('S7.01', 'key_tap_soft_02'), iou=txt('S7.01', 'IOU'),
        wide=B('S7.02'), q_on=Lon('v3-a4-0002'), tasya=B('S7.02b'), rec_on=Lon('v3-a4-0003'),
        rec_end=Lend('v3-a4-0003'), below=W('v3-a4-0003', 'below'), above=W('v3-a4-0003', 'above'),
        around=W('v3-a4-0003', 'around'), s703=B('S7.03'), hello=Lon('a5-30-07'), hello_end=Lend('a5-30-07'),
        s705=B('S7.05'), rail21=txt('S7.05', 'RAIL'), bang=B('S7.06'), freeze=snd('S7.06', 'freeze_hit_F'),
        which=Lon('a5-30-08'), ah=Lon('a5-30-09'), calm=B('S7.07'), read_on=Lon('v3-a4-0004'),
        read_end=Lend('v3-a4-0004'), staying_end=Lend('a5-30-11'), stays_on=Lon('a5-30-12'),
        of_what=Lon('a5-30-15'), of_what_end=Lend('a5-30-15'), gq=Lon('a5-30-16'),
        s709=B('S7.09'), stamp=snd('S7.09', 'rubber_stamp_C'), gerg_post=txt('S7.09', 'POST: GERG'),
        s713=B('S7.13'), ttemme_post=txt('S7.13', 'POST: TTEMME'), ttemme_end=txt('S7.13', 'POST: TTEMME', end=True),
        chat=Lon('a5-30-18'), chat_end=Lend('a5-30-18'), shatter=snd('S7.13', 'hourglass_shatter'),
        s801=B('S8.01'), sign=txt('S8.01', 'DAYS SINCE'), ignite=snd('S8.01', 'neon_ignite'),
        s803=B('S8.03'), bonk=snd('S8.03', 'alert_bonk'), s804=B('S8.04'), s805=B('S8.05'),
        okay=Lon('a5-30-19'), okay_end=Lend('a5-30-19'), vault=B('S8.06'), s807=B('S8.07'),
        s808=B('S8.08'), memo=Lon('a5-31-04'), memo_end=Lend('a5-31-04'), s810=B('S8.10'), end=c.LEN)
    E['grain'] = E['s713'] + 7 / FPS                         # v5's pixel mark (S7.13 + 7 f), kept
    E['dialog'] = txt('S8.03', 'UI:')
    E['grey1'] = E['s803'] + 15 / FPS                        # v5's pixel marks (S8.03 + 15 / + 30 f), kept
    E['grey2'] = E['s803'] + 30 / FPS
    return E


def build():
    c = C.CLK
    E = events(c)
    F0 = int(round(E['s7'] * FPS))
    F1 = c.FRAMES
    cue = SCue(ID, F0, F1, swing=0.0)
    s, a, g = cue.s, cue.a, cue.g
    mm11 = load_track('mm11-the-return')
    sys.path.insert(0, os.path.join(OST, 'tracks', 'mm11-the-return'))
    from senza import prewarm   # noqa: E402
    T = mm11.tracks()
    T['vla'].eq = list(T['vla'].eq) + [('peq', 111.3, -10.0, 8.0)]
    T['vc_lev'].eq = list(T['vc_lev'].eq) + [('peq', 112.0, -8.0, 10.0)]
    T['vln1'].eq = list(T['vln1'].eq) + [('peq', 440.0, -8.0, 5.0)]    # the violin pizz body (~430-450 Hz)
    T['hn'].gain_db = T['hn'].gain_db - 3.0
    prewarm(['Ab3', 'Db4', 'C4', 'G3'], vels=(0.5,))
    log = cue.log
    cue_proxy = _Proxy(cue)

    # ================================================================== a · the STRAIGHT violin, then its long decay
    t0 = E['post']
    for p, k, nb, xx in [('Ab3', 0, 2, {}), ('Db4', 2, 2, dict(offset=0.8, att=0.05)),
                         ('C4', 4, 1, dict(offset=0.8, att=0.05))]:
        a.n('svln_nv', p, s(t0 + k * Q), nb * Q + 0.03, 0.5, rel=0.14, **xx)
    tg = t0 + 5 * Q
    g_end = E['wide'] + 1.9
    a.n('svln_nv', 'G3', s(tg), g_end - tg, 0.5, rel=0.8)
    h1 = E['heart1']
    T['svln_nv'].auto = [(0.0, 1.0), (s(h1), 1.0), (s(h1) + 2.0, 0.71), (s(h1) + 5.0, 0.5), (s(h1) + 8.0, 0.32),
                         (s(E['iou']), 0.2), (s(E['wide']), 0.12), (s(g_end), 0.0), (1e4, 0.0)]
    cue.mark(t0, 'a: the violin (the Door, STRAIGHT), under the post')
    log.append((h1, 'a: the first heart: the G3 holds and decays (no stop)', False))

    # ================================================================== b · Tasya's floor
    # (revised: no thirds; the landlord's mediants as open fifths with the added 9th, quiet)
    AB = (['Eb4', 'G4', 'Bb4'], 'Ab1', ['Ab2', 'Eb3'], ['Bb3', 'Eb4'])
    CM = (['D4', 'G4', 'B4'], 'C2', ['C3', 'G3'], ['D4', 'G4'])
    EM = (['F#4', 'B4', 'D#5'], 'E2', ['B2', 'E3'], ['F#4', 'B4'])
    pad0 = E['wide'] + 0.3
    bl, ab, ar = E['below'], E['above'], E['around']
    bloom = E['rec_end'] + 0.25
    home = E['hello_end'] + 0.3
    home_end = E['s705'] + 1.5
    rebow(a, 'cb', 'Ab1', s(pad0), s(ab) + 0.35, 0.3, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35, art='sus', lp=2000)
    rebow(a, 'vc', ['Ab2', 'Eb3'], s(pad0), s(ab) + 0.35, 0.28, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35,
          art='sus', lp=2200)
    art.sus(a, 'vla', AB[3], s(bl), ab - bl + 0.35, vel=0.3, att=0.7, lp=2400, rel=0.35)
    for (t_a, t_b, (rh, cb, vc, vla), att, v) in [(ab, ar, CM, 0.6, 0.27), (ar, home, EM, 0.6, 0.27),
                                                  (home, home_end, AB, 0.6, 0.25)]:
        last = t_b == home_end
        dur = t_b - t_a + (0.35 if not last else 0.0)
        rel = 0.35 if not last else 1.2
        art.sus(a, 'cb', [cb], s(t_a), dur, vel=v + 0.02, att=att, lp=2000, rel=rel)
        art.sus(a, 'vc', vc, s(t_a), dur, vel=v, att=att, lp=2200, rel=rel)
        art.sus(a, 'vla', vla, s(t_a), dur, vel=v - 0.05, att=att + 0.2, lp=2400, rel=rel)
    a.ch('rhodes', AB[0], s(home), home_end - home, 0.22, roll=0.006)          # one quiet chord, home, no third
    T['rhodes'].pedal = [(0.0, False)]
    log += [(pad0, "b: the floor pre-laps (the bare A-flat fifth under the violin's G)", False),
            (bl, 'b: "below": A-flat maj9 (silent attack)', False), (ab, 'b: "above": C maj9', False),
            (ar, 'b: "around": E maj9', False)]
    cue.mark(home, 'b: home (A-flat, no third) under the rail: one quiet Rhodes chord')

    # ================================================================== c1 · LEVERAGE -> the dead stop on "of what?"
    bang, e8 = E['bang'], Q / 2
    c1 = bang - 6 * e8
    thin = E['read_on'] - 0.3
    stop = E['of_what_end']
    rebow(a, 'vc', 'F2', s(c1), s(stop) + 0.2, 0.36, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.2, art='sus', lp=1800)
    cells = [['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Db3', 'C3'], ['F2', 'C3', 'Bb2', 'F2', 'C3', 'Bb2', 'Eb3', 'C3'],
             ['F2', 'Db3', 'Ab2', 'F2', 'Db3', 'Ab2', 'C3', 'Bb2'], ['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Gb2', 'Ab2']]
    fade = lambda t: min(1.0, 0.35 + 0.65 * max(0.0, (t - c1) / (bang - c1)))   # noqa: E731
    for j in range(-6, 1000):
        t = bang + j * e8
        if t >= thin - 0.02:
            break
        if abs(t - E['freeze']) < 0.08:
            continue
        i, bar = j % 8, j // 8
        p = cells[bar % 4][i]
        acc = 1.0 if i in (0, 3, 6) else 0.78
        inst = 'vc_lev' if (i in (0, 3) or p in ('F2', 'Gb2', 'Ab2', 'Bb2')) else 'vla'
        art.pizz(a, inst, p, s(t), vel=0.44 * acc * fade(t), lock=True)
        if t > bang and i in (1, 4, 7) and (bar + i) % 3 != 0:
            a.n('noise', 60, s(t), 0.03, 0.18 + 0.05 * ((bar + i) % 3), lock=True, clock=18000 + 4000 * (i % 3),
                dec=0.02, sus=0.0, rel=0.02)
    clusters = [['C3', 'Db3', 'Eb3'], ['B2', 'C3', 'Db3'], ['C3', 'Db3', 'D3'], ['C3', 'Db3', 'Eb3'], ['Bb2', 'C3', 'Db3']]

    def thud(t, v=0.62):
        a.n('k808', 'F1', s(t), 0.4, v, lock=True, decay=0.35, punch=6.0, drive=1.2, click=0.05)
        a.n('bdrum_muted', 60, s(t), 0.2, v * 0.55, lock=True)
    thud(bang, 0.55)
    a.ch('grand', clusters[-1], s(bang), Q, 0.26, lock=True)
    k, m = 0, 1
    while True:
        tb = bang + 4 * Q * m
        if tb >= thin - 0.1:
            break
        for bt in ((0.0, 2.5) if m % 2 == 0 else (0.0,)):
            t = tb + bt * Q
            if t < thin - 0.05:
                thud(t)
                if bt == 0.0:
                    a.ch('grand', clusters[k % len(clusters)], s(t), min(3 * Q, thin - t), 0.3, lock=True)
                    k += 1
        m += 1
    for t in (E['read_end'] + 0.15, E['staying_end'] + 0.2):
        a.ch('grand', clusters[k % len(clusters)], s(t), 0.6, 0.2, lock=True)
        k += 1
    cue.mark(c1 + 2 * e8, 'c1: LEVERAGE fades in under Mada')
    cue.mark(bang, 'c1: the door bang (inside the cue)')
    log.append((thin, 'c1: thins to its F pedal (the reading, the terms)', False))
    cue.mute(stop, E['stamp'])
    log.append((stop, 'STOP (dead, tails cut): "of what?"; Mada\'s pause, "Good question.", "good question." and '
                      'the long hold in the room', False))

    # ================================================================== c2 · the stamp's C; the Build restarts
    st, sand = E['stamp'], E['shatter']
    rebow(a, 'cb', 'C2', s(st), s(sand), 0.44, seg=5.0, xf=1.0, first_att=0.35, last_rel=0.25, art='sus', lp=1800)
    rebow(a, 'vc', 'C3', s(st), s(sand), 0.38, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.25, art='sus', lp=2200)
    rebow(a, 'vla', 'G3', s(st) + 1.0, s(sand), 0.2, seg=5.0, xf=1.0, first_att=1.2, last_rel=0.25, art='sus', lp=1800)
    log.append((st, "c2: the stamp's C: the low C pedal bows in", False))
    gp = E['gerg_post'] + 0.05
    build16(cue_proxy, gp, 4, 0.2, felt_every=0, cell=BUILD_F, duty=0.25)          # 4 soft notes: it restarts
    cue.mark(gp, "c2: GERG'S BUILD restarts on his post (four soft notes, F minor, under the keycaps)")
    art.pizz(a, 'vln1', 'C5', s(E['grain']), vel=0.3, lock=True)
    cue.mark(E['grain'], "c2: one pizz grain on the last grain (before Ttemme's post)")
    log.append((sand, "the pedal rests on the sand's held beat (the shatter), and stays at rest into the sign", False))

    # ================================================================== e · the sign: one understated statement
    # (revised: no victory lap, no stab.)  One still chord, a little too calm: D-flat(add9) with no third on low
    # strings and one soft horn, no swell and no motion, until the old dialog pops over it.
    sg = E['sign']
    calm_end = E['dialog'] - 0.1
    for inst, ps_, v in (('vc', ['Db3', 'Ab3'], 0.3), ('vla', ['Eb4'], 0.26), ('vln2', ['Ab4'], 0.22)):
        art.sus(a, inst, ps_, s(sg), calm_end - sg, vel=v, att=0.5, rel=0.4, lp=2400)
    a.n('hn', 'Ab3', s(sg + 0.05), calm_end - sg - 0.05, 0.26, lock=True, rel=0.4)
    cue.mark(sg, 'e: the sign: one understated chord (D-flat(add9), no third), a little too calm')
    for p, t_a, t_b in (('F5', E['dialog'], E['grey1']), ('F4', E['grey1'], E['grey2']), ('F5', E['grey2'], E['bonk'])):
        a.n('beeper', p, s(t_a), t_b - t_a - 0.01, 0.42, lock=True, rel=0.03)
    cue.mark(E['dialog'], 'e: the 1993 flat line F5 . F4 . F5 (tenuto, uneven)')
    log.append((E['bonk'], "e: the bonk (SFX, E3: the wrong note); a designed rest on the lobby's neon F (the CU)", False))

    # ================================================================== the felt after "okay.", then the vault's F
    cc = E['okay_end'] + 1 / 24
    stl = cc + 10 / 24
    a.n('felt', 'C4', s(cc), stl - cc, 0.33)
    a.n('felt_mech', 60, s(cc), 0.1, 0.36)
    a.n('felt', 'F4', s(stl), 2.4, 0.35)
    a.ch('felt', ['F3', 'C4'], s(stl), 2.4, 0.25, roll=0.012)
    a.n('felt_mech', 60, s(stl), 0.1, 0.32)
    T['felt'].pedal = [(0.0, False), (s(cc) - 0.02, True), (s(stl) - 0.03, False), (s(stl) + 0.02, True),
                       (s(E['vault']) + 2.5, False)]
    cue.mark(cc, 'after "okay.": the felt C4 (his felt, last)')
    cue.mark(stl, 'the felt F4 + the open fifth (the settle)')
    vt, end = E['vault'], E['end']
    a.n('pad', 'F3', s(vt), end - vt + 0.5, 0.65, lock=True, pitches=['F3', 'C4'], kind='glass', attack=2.2,
        release=3.8, bright=0.6, voices=3, detune_c=5.0)
    log.append((vt, "f: the vault's F: the glass pedal F3/C4 swells in under the felt's decay", False))
    qa_, qb_ = vt + 0.3, E['s807']
    a.n('drone', 'G4', s(qa_), qb_ - qa_, 0.25, lock=True, pitches=['G4', 'Db5'], fade_in=1.2, fade_out=0.06)
    log.append((qa_, "f: the Q* hook: the Ache (G4 + D-flat5) over the pedal for the vault's own shot", False))
    log.append((qb_, 'f: the Ache cuts with the picture; the pedal goes on (the memo: the pedal alone)', False))
    log.append((end, "the act ends on the pedal; its release carries into the tag (music-ringout.wav)", False))

    for lab, a0, a1 in [('S7 a the STRAIGHT violin, then its decay', E['s7'], pad0),
                        ("S7 b Tasya's floor, quiet (pre-lap -> below/above/around -> home, no thirds)", pad0, c1),
                        ('S7 c1 LEVERAGE (fade-in -> the bang)', c1, thin), ('S7 c1 thinned to the F pedal', thin, stop),
                        ('S7 STOP: "of what?" -> the stamp (the room)', stop, st),
                        ("S7 c2 the C pedal (the posts); the Build restarts", st, sand),
                        ("S7 d the sand's rest", sand, sg),
                        ('S8 e the sign: one understated chord, a little too calm', sg, E['dialog']),
                        ('S8 e the flat line', E['dialog'], E['bonk']),
                        ('S8 designed rest: the lobby CU, "okay."', E['bonk'], cc),
                        ('S8 the felt settle', cc, vt), ("S8 f the vault's F (the coda)", vt, end)]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title='The Return (Ep1 v3 Act Four, S7 + S8, to picture)', mm='MM-11 (Act Four v5 S7-S8, re-spotted)',
        usage='BI',
        family='STRAIGHT -> the floor (quiet) -> LEVERAGE (P03) -> the C pedal -> one still chord -> the vault (P05)',
        tone="restrained irony: other people's sounds hand him back his company one by one; at the sign one still "
             "chord, a little too calm; his felt last, onto the vault's F",
        scenes=[f'Ep1 v3 Act Four S7.01-S8.10, segment {E["s7"]:.3f}-{end:.3f} s ({c.variant})'],
        motifs=['the Door on solo violin, senza vibrato, held and decaying', "Tasya's floor (quiet, no thirds)",
                'LEVERAGE (the fade-in, the bang inside it, thinned to its pedal)', "the stamp's C pedal",
                "the Build's four-note restart", 'one still chord at the sign (D-flat(add9), no third)',
                'the 1-bit flat line F F F (tenuto)', "the Water Line's settle C4 -> F4",
                "the vault's F (glass) and the Ache (the Q* shot)"],
        motif_ids=['BUILD'],
        key='Db (the Door) -> Ab/C/E open fifths (no thirds) -> F pedal -> C pedal -> Db(add9) -> F, open fifth',
        composer='Ep1 v3 score, Act Four (v3-score-b, 2026-09-27), from Act Four v5 S7-S8',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=[(s(stl) + 0.05, s(stl) + 2.0)],
        silence_windows=[(s(stop) + 0.005, s(st) - 0.02, 'STOP: "of what?" -> the stamp (the room plays)', -90.0)],
        room_sfx=[dict(t0=s(vt), t1=s(end), sfx="server_hum (the Q* vault's F)")],
        sfx_slots=[dict(t=round(s(E['bang']), 3), sfx='landing_thunk (the door bang)'),
                   dict(t=round(s(E['freeze']), 3), sfx='freeze_hit_F (TERB / THE NEW CHAIR)'),
                   dict(t=round(s(st), 3), sfx='rubber_stamp_C'), dict(t=round(s(sand), 3), sfx='hourglass_shatter'),
                   dict(t=round(s(E['ignite']), 3), sfx='neon_ignite (the neon buzz is on F)'),
                   dict(t=round(s(E['bonk']), 3), sfx='alert_bonk (E3)')],
        audition=[f'{s(t0):.1f}-{s(g_end):.1f} s: the violin plain under the post, then its G held and fading: '
                  'sincere, not "world\'s smallest violin"',
                  f'{s(c1):.1f}-{s(stop):.1f} s: LEVERAGE in the fires, its pedal alone under the terms; the dead stop '
                  'on "of what?"',
                  f'{s(st):.1f}-{s(sg):.1f} s: the C pedal and the Build restarting under Gerg\'s post: soft, not a button',
                  f'{s(sg):.1f}-{s(E["dialog"]):.1f} s: the sign\'s one still chord: restrained, a little too calm, '
                  'never a fanfare',
                  f'{s(cc):.1f} s to the end: the felt settle onto the vault\'s F; the Ache on the vault shot: dread, '
                  'not a sting; the pedal under the memo'])
    macro = [(0.0, 0.0), (s(bang) - 0.6, 0.0), (s(bang) - 0.2, -1.5), (s(thin), -1.5), (s(thin) + 0.4, 0.0)]
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=s(end), tail_s=4.2, meta=meta)
    window = [E['s7'], end, 0.0, 0.0]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in log],
                 sections=[(lab, round(cue.act(a0), 4), round(cue.act(a1), 4)) for lab, a0, a1 in cue.sections],
                 silences=[(stop, st, 'the dead stop on "of what?" -> the stamp (Mada\'s pause, "Good question.", '
                                      '"good question." and the long hold play in the room)')],
                 ringout=True)
    return sc, cue.T0, window, extra
