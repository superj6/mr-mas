"""E01 Act Four v5 · S7 + S8 · THE RETURN -> THE LOBBY -> THE CODA · MM-11 re-spotted, one relay, into the vault's F
act frames 9376 -> 12443 (S7.01 -> the act's last frame), 127.8 s, plus a ~4 s ring into the tag; file t = 0 = act 9376.

Other people's sounds hand him back his company one by one; his felt returns last, after "okay.", and settles onto the
vault's F, which carries the coda into the tag.  One dead stop ("of what?"), everything else a decay, a crossfade, a
pre-lap or a designed rest:

  act s      what                                                                      picture
  391.667    a · STRAIGHT: the Door on the senza-vibrato solo violin (A-flat3 D-flat4  S7.01 Alyi's regret post
             C4 G3), under the post only; the violin IS the thinned colour
  397.567    on the first heart the G3 HOLDS and decays (-3 dB by "You sent three.",  the hearts; the exchange
             -10 by "i'm not counting today.", -14 on the IOU beat), no dead stop      across the gap; the IOU beat
  409.3      b · Tasya's floor pre-laps under the decay: the bare A-flat fifth, the    S7.02 the wide; his question
             violin's G its maj7 (no third yet); it sits under Mas's question
  "below"    the pad takes the line's first chord: A-flat maj9 (silent attacks)       S7.02b the record, [V/K]
  "above"    C maj9 · "around" E maj9 (the landlord's mediant steps, no melody)
  422.04     the bloom: Tasya's Rhodes on the beats (E maj9), held under "Hello."      S7.02b -> S7.03
  424.61     home to A-flat maj9 (the landlord's last word), ringing under the rail    S7.05 NOV 21
  425.54     c1 · LEVERAGE fades in under Mada among the fires (the F pedal, straight  S7.05 -> S7.06
             pizz eighths, the muted-808 thud, low grand clusters, a chip noise tick)
  427.417    the door bang lands INSIDE it; the freeze hit keeps its own beat          S7.06 Terb, the freeze card
  435.54     it thins to its pedal under Terb's reading and the terms (two soft        S7.07 the calm-off
             cluster shifts in the gaps, none under a word)
  458.112    STOP (dead, tails cut) on "of what?": Mada's pause, "Good question.",     S7.07 -> S7.08 -> S7.09
             "good question." and the long hold play in the room's crackle
  465.283    c2 · the stamp's C: a low C pedal (the dominant) bows in under it; it     S7.09 the stamp; Gerg's post
             holds under both posts; one pizz grain on the hourglass's last grain      S7.13 Ttemme's post
  476.293    the pedal rests on the sand's held beat (0.49 s: the shatter's tail and   S7.13 the shatter
             the lobby's neon pre-lap under it)
  476.783    the Build's four-note pickup into the sign
  477.408    e · VICTORY LAP: ONE brass stab (A-flat maj9), timpani, a string chop,    S8.01 the sign lights
             the Build at full for a bar; then one chip note (the undercut)
  480.708    the 1993 flat line F5 . F4 . F5, one uneven tenuto phrase under the      S8.03 Cancel greys
             greying; out on the bonk (the SFX's E3 is the wrong note)
  482.9      a designed rest: the lobby's neon buzz (on F) under the CU, "silent       S8.04 the CU; S8.05 "okay."
             like the first"; nothing under "okay."
  486.73     after "okay.": the felt C4 -> F4 on the swung "and", an open fifth       S8.05 the glass
  487.708    f · the vault's F: a glass pedal F3/C4, matched to the hum's fan tones,   S8.06 the Q* vault
             swells in under the felt's decay; the coda's one performance
  496.66     the Q* hook: the Ache (G4 + D-flat5, pure beating tones) over the pedal   S8.07 the (REPORTED) rail
             for the rail's read, cut with the picture (the pedal goes on)
  501.975    the memo, [V]: the pedal alone, ducked (the record)                       S8.08 -> S8.09
  518.458    the act ends; the pedal's release carries ~4 s into the tag               S8.10 the chair

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

ID = 's5-s8_s7s8-the-return'
F0 = C.BEATS['S7.01']['f0']          # 9376
F1 = C.ACT_FRAMES                    # 12443
Q = 0.625


def events():
    B, txt, snd, Lon, Lend, W, pm = C.B, C.txt, C.snd, C.Lon, C.Lend, C.W, C.pmark
    E = dict(
        s7=B('S7.01'), post=txt('S7.01', 'POST: ALYI'), post_end=txt('S7.01', 'POST: ALYI', end=True),
        heart1=snd('S7.01', 'key_tap_soft_02'), iou=txt('S7.01', 'IOU'),
        wide=B('S7.02'), q_on=Lon('a5-30-05'), tasya=B('S7.02b'), rec_on=Lon('a5-30-06'), rec_end=Lend('a5-30-06'),
        below=W('a5-30-06', 'below'), above=W('a5-30-06', 'above'), around=W('a5-30-06', 'around'),
        s703=B('S7.03'), hello=Lon('a5-30-07'), hello_end=Lend('a5-30-07'),
        s705=B('S7.05'), rail21=txt('S7.05', 'RAIL'),
        bang=B('S7.06'), freeze=snd('S7.06', 'freeze_hit_F'), which=Lon('a5-30-08'), ah=Lon('a5-30-09'),
        calm=B('S7.07'), read_on=Lon('a5-30-10'), read_end=Lend('a5-30-10'),
        staying_end=Lend('a5-30-11'), stays_on=Lon('a5-30-12'),
        of_what=Lon('a5-30-15'), of_what_end=Lend('a5-30-15'), gq=Lon('a5-30-16'),
        s709=B('S7.09'), stamp=snd('S7.09', 'rubber_stamp_C'), gerg_post=txt('S7.09', 'POST: GERG'),
        s713=B('S7.13'), ttemme_post=txt('S7.13', 'POST: TTEMME'), ttemme_end=txt('S7.13', 'POST: TTEMME', end=True),
        chat=Lon('a5-30-18'), chat_end=Lend('a5-30-18'), shatter=snd('S7.13', 'hourglass_shatter'),
        s801=B('S8.01'), sign=txt('S8.01', 'DAYS SINCE'), ignite=snd('S8.01', 'neon_ignite'),
        s803=B('S8.03'), bonk=snd('S8.03', 'alert_bonk'), s804=B('S8.04'), s805=B('S8.05'),
        okay=Lon('a5-30-19'), okay_end=Lend('a5-30-19'),
        vault=B('S8.06'), s807=B('S8.07'), qrail=txt('S8.07', 'RAIL: (REPORTED)'),
        qrail_end=txt('S8.07', 'RAIL: (REPORTED)', end=True),
        s808=B('S8.08'), memo=Lon('a5-31-04'), memo_end=Lend('a5-31-04'), s810=B('S8.10'), end=C.ACT_S,
    )
    # the pixel pass's own marks where the stick has no event (fallbacks follow the stick's text)
    E['grain'] = pm('S7.13', 'grain') or (E['s713'] + 0.3)
    dlg = pm('S8.03', 'dialog') or txt('S8.03', 'UI:')
    E['dialog'] = dlg
    E['grey1'] = pm('S8.03', 'grey1') or (dlg + 0.417)
    E['grey2'] = pm('S8.03', 'grey2') or (dlg + 1.042)
    E['mark_src'] = {k: ('pixel lock' if pm(*v) is not None else 'fallback') for k, v in
                     dict(grain=('S7.13', 'grain'), dialog=('S8.03', 'dialog'), grey1=('S8.03', 'grey1'),
                          grey2=('S8.03', 'grey2')).items()}
    return E


def build():
    E = events()
    cue = C.Cue(ID, F0, F1, swing=0.0)
    s, a, g = cue.s, cue.a, cue.g
    mm11 = C.load_track('mm11-the-return')
    sys.path.insert(0, os.path.join(C.OST, 'tracks', 'mm11-the-return'))
    from senza import prewarm   # noqa: E402
    T = mm11.tracks()
    # render 2: the pizz body resonance near 111-112 Hz (an A2) read under LEVERAGE's F pedal (the F-major check,
    # 'a resonance, the same peak under different notes'): notched on the viola pizz and, a touch wider, on MM-11's
    # own notched cello-pizz track (the viola's lowest note is C3, 131 Hz, so its bowed notes are untouched)
    T['vla'].eq = list(T['vla'].eq) + [('peq', 111.3, -10.0, 8.0)]
    T['vc_lev'].eq = list(T['vc_lev'].eq) + [('peq', 112.0, -8.0, 10.0)]
    prewarm(['Ab3', 'Db4', 'C4', 'G3'], vels=(0.5,))
    log = cue.log

    # ================================================================== a · the STRAIGHT violin, then its long decay
    t0 = E['post']
    # render 2: the solo violin's C4_p sample (which D-flat4 and C4 read) swells slowly (-19.7 dB in its first 0.3 s,
    # -6.8 dB at 0.7-1.2 s, measured), so those two notes sounded 8-12 dB under A-flat3 and G3: they start 0.8 s into
    # the sample, with a 50 ms bow attack
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
    log.append((h1, 'a: the first heart: the G3 holds and decays (no stop)'))

    # ================================================================== b · Tasya's floor
    AB = (['G3', 'Bb3', 'C4', 'Eb4'], 'Ab1', ['Ab2', 'Eb3'], ['Bb3', 'C4'])
    CM = (['G3', 'B3', 'D4', 'E4'], 'C2', ['C3', 'G3'], ['D4', 'E4'])
    EM = (['G#3', 'B3', 'D#4', 'F#4'], 'E2', ['B2', 'E3'], ['F#4', 'G#3'])
    pad0 = E['wide'] + 0.3
    bl, ab, ar = E['below'], E['above'], E['around']
    bloom = E['rec_end'] + 0.25
    home = E['hello_end'] + 0.3
    home_end = E['s705'] + 1.5
    # the bare A-flat fifth from the wide (cb + vc), held through "below" (its first chord arrives over it)
    # (render 2: re-bowed with silent crossfades; one 11 s note outlasted its samples and fell to -55 dBFS before
    # "below")
    C.rebow(a, 'cb', 'Ab1', s(pad0), s(ab) + 0.35, 0.37, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35, art='sus',
            lp=2000)
    C.rebow(a, 'vc', ['Ab2', 'Eb3'], s(pad0), s(ab) + 0.35, 0.34, seg=4.0, xf=1.0, first_att=1.6, last_rel=0.35,
            art='sus', lp=2200)
    art.sus(a, 'vla', AB[3], s(bl), ab - bl + 0.35, vel=0.3, att=0.7, lp=2400, rel=0.35)          # "below": maj9
    for (t_a, t_b, (rh, cb, vc, vla), att, v) in [(ab, ar, CM, 0.6, 0.36), (ar, home, EM, 0.6, 0.36),
                                                  (home, home_end, AB, 0.6, 0.33)]:
        last = t_b == home_end
        dur = t_b - t_a + (0.35 if not last else 0.0)
        rel = 0.35 if not last else 1.2
        art.sus(a, 'cb', [cb], s(t_a), dur, vel=v + 0.02, att=att, lp=2000, rel=rel)
        art.sus(a, 'vc', vc, s(t_a), dur, vel=v, att=att, lp=2200, rel=rel)
        art.sus(a, 'vla', vla, s(t_a), dur, vel=v - 0.05, att=att + 0.2, lp=2400, rel=rel)
    # the bloom: the Rhodes on the beats (E maj9) after the line, then held (nothing moves under "Hello.")
    nb = 0
    for k in range(2):
        if bloom + (k + 1) * Q > E['hello'] - 0.1:
            break
        a.ch('rhodes', EM[0], s(bloom + k * Q), Q * 0.92, 0.44 if k == 0 else 0.36, roll=0.004)
        nb = k + 1
    th = bloom + nb * Q
    a.ch('rhodes', EM[0], s(th), home - th, 0.34, roll=0.004)
    a.n('celesta', 'D#6', s(bloom), 2 * Q, 0.3)
    a.ch('rhodes', AB[0], s(home), home_end - home, 0.36, roll=0.004)         # home: the landlord's last word
    a.n('celesta', 'G5', s(home), 2 * Q, 0.26)
    T['rhodes'].pedal = [(0.0, False)]
    log += [(pad0, 'b: the floor pre-laps (the bare A-flat fifth under the violin\'s G)'),
            (bl, 'b: "below": A-flat maj9 (silent attack)'), (ab, 'b: "above": C maj9'), (ar, 'b: "around": E maj9')]
    cue.mark(bloom, 'b: the bloom (the Rhodes on the beats)')
    cue.mark(home, 'b: home (A-flat maj9) under the rail')

    # ================================================================== c1 · LEVERAGE (fade-in -> the bang -> thin -> stop)
    bang, e8 = E['bang'], Q / 2
    c1 = bang - 6 * e8
    thin = E['read_on'] - 0.3
    stop = E['of_what_end']
    # render 2: the F pedal on the cello section, re-bowed with silent crossfades.  On the solo contrabass (MM-11's
    # choice) an F2 is equidistant from its E and F-sharp samples, and the sampler picks one per stroke by the note's
    # own rng: the strokes alternated about 6 dB in level and in colour (measured on render 1).  The cello set's
    # nearest F2 sample is one E, so every stroke is the same sound.
    C.rebow(a, 'vc', 'F2', s(c1), s(stop) + 0.2, 0.36, seg=5.0, xf=1.0, first_att=1.4, last_rel=0.2, art='sus',
            lp=1800)
    cells = [['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Db3', 'C3'], ['F2', 'C3', 'Bb2', 'F2', 'C3', 'Bb2', 'Eb3', 'C3'],
             ['F2', 'Db3', 'Ab2', 'F2', 'Db3', 'Ab2', 'C3', 'Bb2'], ['F2', 'C3', 'Ab2', 'F2', 'C3', 'Ab2', 'Gb2', 'Ab2']]
    fade = lambda t: min(1.0, 0.35 + 0.65 * max(0.0, (t - c1) / (bang - c1)))   # noqa: E731
    for j in range(-6, 1000):                                 # eighths counted from the bang (j = 0)
        t = bang + j * e8
        if t >= thin - 0.02:
            break
        if abs(t - E['freeze']) < 0.08:                      # the freeze hit keeps its own beat
            continue
        i, bar = j % 8, j // 8                               # the eighth inside the bar (the bang is a downbeat)
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
    thud(bang, 0.55)                                          # under the bang
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
    # thinned: the pedal alone under the reading and the terms; two soft cluster shifts in the gaps, none on a word
    for t in (E['read_end'] + 0.15, E['staying_end'] + 0.2):
        a.ch('grand', clusters[k % len(clusters)], s(t), 0.6, 0.2, lock=True)
        k += 1
    cue.mark(c1 + 2 * e8, 'c1: LEVERAGE fades in under Mada')
    cue.mark(bang, 'c1: the door bang (inside the cue)')
    log.append((thin, 'c1: thins to its F pedal (the reading, the terms)'))
    cue.mute(stop, E['stamp'])                                # STOP: "of what?" -> the stamp; the room plays
    log.append((stop, 'STOP (dead, tails cut): "of what?"; Mada\'s pause, "Good question." and the long hold in the room'))

    # ================================================================== c2 · the stamp's C pedal, the posts, the sand
    st, sand = E['stamp'], E['shatter']
    C.rebow(a, 'cb', 'C2', s(st), s(sand), 0.44, seg=5.0, xf=1.0, first_att=0.35, last_rel=0.25, art='sus', lp=1800)
    C.rebow(a, 'vc', 'C3', s(st), s(sand), 0.38, seg=5.0, xf=1.0, first_att=0.5, last_rel=0.25, art='sus', lp=2200)
    C.rebow(a, 'vla', 'G3', s(st) + 1.0, s(sand), 0.2, seg=5.0, xf=1.0, first_att=1.2, last_rel=0.25, art='sus',
            lp=1800)
    art.pizz(a, 'vln1', 'C5', s(E['grain']), vel=0.3, lock=True)                   # the hourglass's last grain
    log.append((st, 'c2: the stamp\'s C: the low C pedal bows in (it holds under both posts)'))
    cue.mark(E['grain'], 'c2: one pizz grain on the last grain (before Ttemme\'s post)')
    log.append((sand, 'the pedal rests on the sand\'s held beat (the shatter)'))

    # ================================================================== d · the pickup into the sign
    sg = E['sign']
    pick = sg - Q
    mm11.build_cell(a, g, s(pick), 4, vel=0.52)
    a.n('cb_pizz', 'Eb3', s(pick), Q, 0.5, lock=True)
    cue.mark(pick, "d: the Build's four-note pickup into the sign")

    # ================================================================== e · VICTORY LAP, one chip note, the flat line
    art.stab(a, 'tpt', ['G5', 'Eb5'], s(sg), vel=0.76, length=0.2)
    art.stab(a, 'tbn', ['C5', 'Bb4'], s(sg), vel=0.74, length=0.22)
    a.n('lead2', 'G5', s(sg), 0.2, 0.56, lock=True, duty=0.25, rel=0.05)
    a.n('timp', 'Ab2', s(sg), 0.6, 0.74, lock=True)
    art.pizz(a, 'cb', 'Ab1', s(sg), vel=0.7, lock=True)
    art.spic(a, 'vln1', ['Eb5', 'G5'], s(sg), vel=0.62, lock=True)
    art.spic(a, 'vla', ['C4', 'Eb4'], s(sg), vel=0.6, lock=True)
    art.spic(a, 'vc', ['Ab2', 'Eb3'], s(sg), vel=0.62, lock=True)
    mm11.build_cell(a, g, s(sg), 16, vel=0.56, full=True)
    a.n('cb_pizz', 'Eb3', s(sg + 2 * Q), Q, 0.56, lock=True)
    one = sg + 16 * Q / 4                                    # the Build's bar ends: one chip note hangs (the undercut)
    a.n('lead', 'G5', s(one), 1.5 * Q, 0.4, lock=True, duty=0.125, rel=0.2, dec=0.3, sus=0.35)
    cue.mark(sg, 'e: the sign: ONE brass stab (A-flat maj9) + the Build at full')
    cue.mark(one, 'e: one chip note (the undercut)')
    for p, t_a, t_b in (('F5', E['dialog'], E['grey1']), ('F4', E['grey1'], E['grey2']), ('F5', E['grey2'], E['bonk'])):
        a.n('beeper', p, s(t_a), t_b - t_a - 0.01, 0.42, lock=True, rel=0.03)      # the flat line, one tenuto phrase
    cue.mark(E['dialog'], 'e: the 1993 flat line F5 . F4 . F5 (tenuto, uneven)')
    log.append((E['bonk'], 'e: the bonk (SFX, E3: the wrong note); a designed rest on the lobby\'s neon F (the CU)'))

    # ================================================================== the felt after "okay.", then the vault's F
    c = E['okay_end'] + 1 / 24
    stl = c + 10 / 24
    a.n('felt', 'C4', s(c), stl - c, 0.33)
    a.n('felt_mech', 60, s(c), 0.1, 0.36)
    a.n('felt', 'F4', s(stl), 2.4, 0.35)
    a.ch('felt', ['F3', 'C4'], s(stl), 2.4, 0.25, roll=0.012)
    a.n('felt_mech', 60, s(stl), 0.1, 0.32)
    T['felt'].pedal = [(0.0, False), (s(c) - 0.02, True), (s(stl) - 0.03, False), (s(stl) + 0.02, True),
                       (s(E['vault']) + 2.5, False)]
    cue.mark(c, 'after "okay.": the felt C4 (his felt, last)')
    cue.mark(stl, 'the felt F4 + the open fifth (the settle)')
    vt, end = E['vault'], E['end']
    a.n('pad', 'F3', s(vt), end - vt, 0.65, lock=True, pitches=['F3', 'C4'], kind='glass', attack=2.2, release=3.8,
        bright=0.6, voices=3, detune_c=5.0)
    log.append((vt, "f: the vault's F: the glass pedal F3/C4 swells in under the felt's decay"))
    qa_, qb_ = E['qrail'], E['s808']
    a.n('drone', 'G4', s(qa_ - 0.4), qb_ - (qa_ - 0.4), 0.25, lock=True, pitches=['G4', 'Db5'], fade_in=1.6,
        fade_out=0.06)
    log.append((qa_ - 0.4, 'f: the Q* hook: the Ache (G4 + D-flat5) over the pedal for the (REPORTED) rail'))
    log.append((qb_, 'f: the Ache cuts with the picture; the pedal goes on (the memo: the pedal alone)'))
    log.append((end, 'the act ends; the pedal\'s release carries into the tag'))

    # ================================================================== sections, bookkeeping
    for lab, a0, a1 in [('a the STRAIGHT violin, then its decay', E['s7'], pad0),
                        ('b Tasya\'s floor (pre-lap -> below/above/around -> bloom -> home)', pad0, c1),
                        ('c1 LEVERAGE (fade-in -> the bang)', c1, thin), ('c1 thinned to the F pedal', thin, stop),
                        ('STOP: "of what?" -> the stamp (the room)', stop, st),
                        ('c2 the C pedal (the posts)', st, sand), ('d the sand\'s rest + the pickup', sand, sg),
                        ('e VICTORY LAP + one chip note', sg, E['dialog']), ('e the flat line', E['dialog'], E['bonk']),
                        ('designed rest: the lobby CU, "okay."', E['bonk'], c),
                        ('the felt settle', c, vt), ('f the vault\'s F (the coda)', vt, end)]:
        cue.section(lab, a0, a1)
    meta = C.base_meta(
        ID, 'The Return (Ep1 Act Four v5, S7 + S8, to picture)', mm='MM-11',
        family='STRAIGHT -> the floor -> LEVERAGE (P03) -> the C pedal -> VICTORY LAP (P09) -> the vault (P05, diegetic)',
        tone='other people\'s sounds hand him back his company one by one; one size too big, then undercut; his felt '
             'last, onto the vault\'s F',
        scenes=[f'v5 S7.01-S8.10, act {F0}-{F1} ({C.tc(C.S(F0))}-{C.tc(C.S(F1))}); file t=0 = act frame {F0}; '
                'a ~4 s ring past the act end for the tag'],
        motifs=['the Door on solo violin, senza vibrato, held and decaying', "Tasya's floor (pad -> bloom -> home)",
                'LEVERAGE (the fade-in, the bang inside it, thinned to its pedal)', "the stamp's C pedal",
                'the Build (pickup 4, 16)', 'the 1-bit flat line F F F (tenuto)', "the Water Line's settle C4 -> F4",
                "the vault's F (glass) and the Ache (the Q* hook)"],
        motif_ids=['DOOR', 'BUILD'],
        key='Db (the Door) -> Ab/C/E mediants -> F pedal -> C pedal -> Abmaj9 -> F, open fifth (the vault)',
        underscore_lufs=-20.0, album_lufs=-16.0,
        no_third_windows=[(s(stl) + 0.05, s(stl) + 2.0)],
        silence_windows=[(s(stop) + 0.005, s(st) - 0.02, 'STOP: "of what?" -> the stamp (the room plays)', -90.0)],
        room_sfx=[dict(t0=s(vt), t1=s(end) + 3.0, sfx='server_hum (the Q* vault\'s F)')],
        room_sfx_drop_stems=[],
        sfx_slots=[dict(t=round(s(E['bang']), 3), sfx='landing_thunk (the door bang)'),
                   dict(t=round(s(E['freeze']), 3), sfx='freeze_hit_F (TERB / THE NEW CHAIR)'),
                   dict(t=round(s(st), 3), sfx='rubber_stamp_C'), dict(t=round(s(sand), 3), sfx='hourglass_shatter'),
                   dict(t=round(s(E['ignite']), 3), sfx='neon_ignite (the neon buzz is on F)'),
                   dict(t=round(s(E['bonk']), 3), sfx='alert_bonk (E3)'),
                   dict(t=round(s(vt), 3), sfx="server_hum: the vault's F (the room's sound becomes the score's root)")],
        audition=[f'{s(t0):.1f}-{s(g_end):.1f} s: the violin plain under the post, then its G held and fading under the '
                  'hearts and the exchange: sincere, not "world\'s smallest violin"; is the decay still audible on '
                  'the IOU beat?',
                  f'{s(pad0):.1f}-{s(home_end):.1f} s: the floor pre-lap under the decay, the three chords on the words '
                  '(silent attacks), the bloom, home under the rail',
                  f'{s(c1):.1f}-{s(stop):.1f} s: LEVERAGE fades in, the bang inside it, then its pedal alone under the '
                  f'terms; the dead stop on "of what?" at {s(stop):.2f} s',
                  f'{s(st):.1f}-{s(sg):.1f} s: the stamp\'s C pedal under both posts; its rest on the sand; the pickup',
                  f'{s(sg):.1f}-{s(E["bonk"]):.1f} s: the stab, the Build\'s bar, one chip note, F F F; then the lobby\'s '
                  'quiet on the neon\'s F: designed, or a hole?',
                  f'{s(c):.1f} s to the end: the felt settle onto the vault\'s F; the Ache under the Q* rail: dread, '
                  'not a sting; the pedal under the memo'])
    # render 3: fader rides for the short-term p95 (render 2: -16.74 against the underscore's -17): LEVERAGE at full
    # -1.5 dB (MM-11's own LEV_RIDE_DB), the floor's bloom -1 dB; 0.4 s ramps, off the words
    rd = lambda t: s(t)   # noqa: E731
    macro = [(0.0, 0.0), (rd(bloom) - 0.4, 0.0), (rd(bloom), -1.0), (rd(home_end), -1.0), (rd(bang) - 0.6, -1.5),
             (rd(thin), -1.5), (rd(thin) + 0.4, 0.0)]
    assert all(b[0] > a_[0] for a_, b in zip(macro, macro[1:])), macro
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes, macro=macro,
               length_s=s(end), tail_s=4.2, meta=meta)
    sc.cue = cue
    sc.events = E
    return sc


if __name__ == '__main__':
    render_cli(build, __file__)
