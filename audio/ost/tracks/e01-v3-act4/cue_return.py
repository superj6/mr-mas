"""E01 v3 Act Four · S7 + S8 · THE RETURN -> THE LOBBY -> THE CODA · MM-11, one relay, onto the vault's F

Act Four v5's S7-S8 (tracks/e01-act4-v5/s5-s8_s7s8_the_return.py, MM-11's material), copied and re-spotted to the v3
lock's ids, with v3's calls (v3-plan §6: "triumph, one size too big"):
  a  STRAIGHT: the Door on the senza-vibrato solo violin under Alyi's post only; on the first heart its G3 holds and
     decays under the hearts and the exchange (no stop).
  b  Tasya's floor pre-laps under the decay (the bare A-flat fifth), then a chord on each of "below", "above",
     "around" (A-flat, C, E maj9, silent attacks), the Rhodes bloom, home to A-flat maj9 under the rail.  (v3: the
     pre-lap sits under Tasya's own "Everyone's packed..." (v3-a4-0002), not under Mas's cut question.)
  c1 LEVERAGE fades in under Mada among the fires, the door bang inside it, thinned to its F pedal under Terb's
     reading and the terms, and a DEAD STOP on "of what?" (Mada's pause, "Good question.", "good question." and the
     long hold play in the room).
  c2 the stamp's C: a low C pedal bows in; v3: GERG'S BUILD restarts on his post ("Returning to NopeAI & getting back
     to coding tonight" restarts it, OST-BIBLE s2.6), soft, in A-flat; one pizz grain on the hourglass's last grain;
     the pedal rests on the sand.
  d  the Build's pickup into the sign.
  e  VICTORY LAP, one size too big (v3: bigger than v5's single stab): the brass stab on the sign, then a bar and a
     half of A-flat major on strings tutti, horns, timpani roll, the Build at full and a chip-doubled top line
     (E-flat5 -> A-flat5 -> C6) for a lobby sign; cut by the old dialog: one chip note hangs; the 1993 flat line
     F5 . F4 . F5 (tenuto, uneven) under Cancel's greying; the bonk (the SFX's E3, the wrong note).
  -  a designed rest on the lobby's neon F: the CU "silent like the first", nothing under "okay.".
  f  after "okay.": the felt C4 -> F4 over an open fifth; THE VAULT'S F: a glass pedal F3/C4 matched to the hum's fan
     tones; the Ache (G4 + D-flat5, pure beating tones) for the vault's own shot (v3: no rail explains it, the vault
     and its note are the beat), cut with the picture; the pedal alone under the memo (the record) and the chair.
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
from v3music import rebow, build16, BUILD_AB, S16   # noqa: E402

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
    AB = (['G3', 'Bb3', 'C4', 'Eb4'], 'Ab1', ['Ab2', 'Eb3'], ['Bb3', 'C4'])
    CM = (['G3', 'B3', 'D4', 'E4'], 'C2', ['C3', 'G3'], ['D4', 'E4'])
    EM = (['G#3', 'B3', 'D#4', 'F#4'], 'E2', ['B2', 'E3'], ['F#4', 'G#3'])
    pad0 = E['wide'] + 0.3
    bl, ab, ar = E['below'], E['above'], E['around']
    bloom = E['rec_end'] + 0.25
    home = E['hello_end'] + 0.3
    home_end = E['s705'] + 1.5
    rebow(a, 'cb', 'Ab1', s(pad0), s(ab) + 0.35, 0.37, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35, art='sus', lp=2000)
    rebow(a, 'vc', ['Ab2', 'Eb3'], s(pad0), s(ab) + 0.35, 0.34, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35,
          art='sus', lp=2200)
    art.sus(a, 'vla', AB[3], s(bl), ab - bl + 0.35, vel=0.3, att=0.7, lp=2400, rel=0.35)
    for (t_a, t_b, (rh, cb, vc, vla), att, v) in [(ab, ar, CM, 0.6, 0.31), (ar, home, EM, 0.6, 0.31),
                                                  (home, home_end, AB, 0.6, 0.29)]:
        last = t_b == home_end
        dur = t_b - t_a + (0.35 if not last else 0.0)
        rel = 0.35 if not last else 1.2
        art.sus(a, 'cb', [cb], s(t_a), dur, vel=v + 0.02, att=att, lp=2000, rel=rel)
        art.sus(a, 'vc', vc, s(t_a), dur, vel=v, att=att, lp=2200, rel=rel)
        art.sus(a, 'vla', vla, s(t_a), dur, vel=v - 0.05, att=att + 0.2, lp=2400, rel=rel)
    nb = 0
    for k in range(2):
        if bloom + (k + 1) * Q > E['hello'] - 0.1:
            break
        a.ch('rhodes', EM[0], s(bloom + k * Q), Q * 0.92, 0.44 if k == 0 else 0.36, roll=0.004)
        nb = k + 1
    th = bloom + nb * Q
    a.ch('rhodes', EM[0], s(th), max(0.3, home - th), 0.34, roll=0.004)
    a.n('celesta', 'D#6', s(bloom), 2 * Q, 0.3)
    a.ch('rhodes', AB[0], s(home), home_end - home, 0.36, roll=0.004)
    a.n('celesta', 'G5', s(home), 2 * Q, 0.26)
    T['rhodes'].pedal = [(0.0, False)]
    log += [(pad0, "b: the floor pre-laps (the bare A-flat fifth under the violin's G)", False),
            (bl, 'b: "below": A-flat maj9 (silent attack)', False), (ab, 'b: "above": C maj9', False),
            (ar, 'b: "around": E maj9', False)]
    cue.mark(bloom, 'b: the bloom (the Rhodes on the beats)')
    cue.mark(home, 'b: home (A-flat maj9) under the rail')

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
    for n_, dt in ((4, 0.0), (8, 4 * S16 + 2 * Q)):
        tt = gp + dt
        if tt + n_ * S16 < E['ttemme_post'] - 0.1:
            for i in range(n_):
                p = nm(BUILD_AB[i % 16]) - 12 if nm(BUILD_AB[i % 16]) > nm('C5') else nm(BUILD_AB[i % 16])
                a.n('lead', p, s(tt + i * S16), S16 * 0.62, 0.32 * (1.0, 0.72, 0.84, 0.72)[i % 4], lock=True,
                    duty=0.25, att=0.002, dec=0.09, sus=0.45, rel=0.035)
    cue.mark(gp, "c2: GERG'S BUILD restarts on his post (soft, A-flat; F4-C5 under the keycaps)")
    art.pizz(a, 'vln1', 'C5', s(E['grain']), vel=0.3, lock=True)
    cue.mark(E['grain'], "c2: one pizz grain on the last grain (before Ttemme's post)")
    log.append((sand, "the pedal rests on the sand's held beat (the shatter)", False))

    # ================================================================== d · the pickup into the sign
    sg = E['sign']
    pick = sg - Q
    mm11.build_cell(a, g, s(pick), 4, vel=0.52)
    a.n('cb_pizz', 'Eb3', s(pick), Q, 0.5, lock=True)
    cue.mark(pick, "d: the Build's four-note pickup into the sign")

    # ================================================================== e · VICTORY LAP, one size too big
    art.stab(a, 'tpt', ['G5', 'Eb5'], s(sg), vel=0.78, length=0.22)
    art.stab(a, 'tbn', ['C5', 'Bb4'], s(sg), vel=0.76, length=0.24)
    a.n('lead2', 'G5', s(sg), 0.2, 0.56, lock=True, duty=0.25, rel=0.05)
    a.n('timp', 'Ab2', s(sg), 0.6, 0.74, lock=True)
    art.pizz(a, 'cb', 'Ab1', s(sg), vel=0.7, lock=True)
    one = sg + 16 * Q / 4
    lap_end = min(E['dialog'] - 0.12, one + 0.2)
    # the lap: strings tutti swell on A-flat maj9 over the timpani roll; the horns; a chip-doubled top line
    for inst, ps_, v in (('vln1', ['Eb5'], 0.5), ('vln2', ['C5', 'G4'], 0.46), ('vla', ['Eb4', 'C4'], 0.46),
                         ('vc', ['Ab2', 'Eb3'], 0.5), ('cb', ['Ab1'], 0.44)):
        art.sus(a, inst, ps_, s(sg + 0.06), lap_end - sg - 0.06, vel=v, att=0.25, rel=0.18)
    for p, v in (('Eb4', 0.4), ('G4', 0.38), ('C5', 0.4)):
        a.n('hn', p, s(sg + 0.05), lap_end - sg - 0.05, v, lock=True, rel=0.2)
    for k in range(int((lap_end - sg - 0.2) / (Q / 4))):
        a.n('timp', 'Ab2', s(sg + 0.3 + k * Q / 4), 0.2, 0.3 + 0.2 * k / 16, lock=True)
    for p, t_a, t_b in (('Eb5', sg, sg + 1.5 * Q), ('Ab5', sg + 1.5 * Q, sg + 3 * Q), ('C6', sg + 3 * Q, lap_end)):
        a.n('vln1', p, s(t_a), t_b - t_a, 0.52, lock=True, art='sus', att=0.04, rel=0.15)
        a.n('lead', p, s(t_a), (t_b - t_a) * 0.9, 0.3, lock=True, duty=0.25, rel=0.08, dec=0.2, sus=0.4)
    mm11.build_cell(a, g, s(sg), 16, vel=0.56, full=True)
    a.n('cb_pizz', 'Eb3', s(sg + 2 * Q), Q, 0.56, lock=True)
    a.n('lead', 'G5', s(one), 1.5 * Q, 0.4, lock=True, duty=0.125, rel=0.2, dec=0.3, sus=0.35)
    cue.mark(sg, 'e: the sign: the brass stab + VICTORY LAP (A-flat maj9, strings, horns, timpani, the Build)')
    cue.mark(sg + 1.5 * Q, 'e: the top line climbs (E-flat5 -> A-flat5 -> C6, violins + chip)')
    cue.mark(one, 'e: one chip note (the undercut)')
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
                        ("S7 b Tasya's floor (pre-lap -> below/above/around -> bloom -> home)", pad0, c1),
                        ('S7 c1 LEVERAGE (fade-in -> the bang)', c1, thin), ('S7 c1 thinned to the F pedal', thin, stop),
                        ('S7 STOP: "of what?" -> the stamp (the room)', stop, st),
                        ("S7 c2 the C pedal (the posts); the Build restarts", st, sand),
                        ("S7 d the sand's rest + the pickup", sand, sg),
                        ('S8 e VICTORY LAP, one size too big + one chip note', sg, E['dialog']),
                        ('S8 e the flat line', E['dialog'], E['bonk']),
                        ('S8 designed rest: the lobby CU, "okay."', E['bonk'], cc),
                        ('S8 the felt settle', cc, vt), ("S8 f the vault's F (the coda)", vt, end)]:
        cue.section(lab, a0, a1)
    meta = dict(
        id=ID, title='The Return (Ep1 v3 Act Four, S7 + S8, to picture)', mm='MM-11 (Act Four v5 S7-S8, re-spotted)',
        usage='BI',
        family='STRAIGHT -> the floor -> LEVERAGE (P03) -> the C pedal -> VICTORY LAP (P09) -> the vault (P05)',
        tone="other people's sounds hand him back his company one by one; a triumph one size too big for a lobby "
             "sign, undercut by the old dialog; his felt last, onto the vault's F",
        scenes=[f'Ep1 v3 Act Four S7.01-S8.10, segment {E["s7"]:.3f}-{end:.3f} s ({c.variant})'],
        motifs=['the Door on solo violin, senza vibrato, held and decaying', "Tasya's floor (pad -> bloom -> home)",
                'LEVERAGE (the fade-in, the bang inside it, thinned to its pedal)', "the stamp's C pedal",
                'the Build (restart on the post; the pickup; 16 at the sign)', 'VICTORY LAP (A-flat maj9)',
                'the 1-bit flat line F F F (tenuto)', "the Water Line's settle C4 -> F4",
                "the vault's F (glass) and the Ache (the Q* shot)"],
        motif_ids=['BUILD'],
        key='Db (the Door) -> Ab/C/E mediants -> F pedal -> C pedal -> Abmaj9 -> F, open fifth (the vault)',
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
                  f'{s(sg):.1f}-{s(E["dialog"]):.1f} s: VICTORY LAP one size too big for a lobby sign, then undercut: '
                  'a laugh from scale, never a fanfare gag',
                  f'{s(cc):.1f} s to the end: the felt settle onto the vault\'s F; the Ache on the vault shot: dread, '
                  'not a sting; the pedal under the memo'])
    # render 1: the lap read -12.4 LUFS over its 3.3 s (short-term max -12.1): -3.5 dB, ramped under the pickup
    macro = [(0.0, 0.0), (s(bloom) - 0.4, 0.0), (s(bloom), -1.0), (s(home_end), -1.0), (s(bang) - 0.6, -1.5),
             (s(thin), -1.5), (s(thin) + 0.4, 0.0), (s(pick), 0.0), (s(sg) - 0.01, -3.5),
             (s(E['dialog']) - 0.05, -3.5), (s(E['dialog']) + 0.2, 0.0)]
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=s(end), tail_s=4.2, meta=meta)
    window = [E['s7'], end, 0.0, 0.0]
    extra = dict(marks=[(round(t, 4), lab, h) for t, lab, h in log],
                 sections=[(lab, round(cue.act(a0), 4), round(cue.act(a1), 4)) for lab, a0, a1 in cue.sections],
                 silences=[(stop, st, 'the dead stop on "of what?" -> the stamp (Mada\'s pause, "Good question.", '
                                      '"good question." and the long hold play in the room)')],
                 ringout=True)
    return sc, cue.T0, window, extra
