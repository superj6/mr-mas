"""V2 'ORCHESTRAL NOIR, CHIP HEART' - SCRIPT v2.1.

Strings, low winds, harp and timpani carry the harmony; the piano recedes to colour.
The chip is reduced to the knee statements - the 'heart' is a metaphor: there is no
lub-dub / pulse figure anywhere (guardrails X3: nothing that reads as a heart monitor).
Brass is horns and trombones only (accents), with one exception: the Harmon trumpet,
whose line runs through bars 10-11 (swung, then straight) and is the noir centre.
Pizzicato bass walks instead of the upright.  Mostly straight time, jazz harmony.
Balance target ~ piano 25 / orchestra 45 / big band 5 / chip 25.
"""
from engine.core import nm, fr, eighth
from engine.render import Score
from .common import (tape_peak, Arr, std_tracks, add_clip_tracks, STEMS, HITS, felt, walk, air, timp_roll, swing_pos,
                     CYM_SWELL_25, SNARE_ROLL, vo_duck, era_1993_core, hook_2008, DINNER_WALKS, COUNTER_LINE,
                     reed_organ, REED_AUTO, ROLL_E, ROLL_TOP, ROLL_BASS, ROLL_VEL, ROLL_RING, roll_chip,
                     roll_counterline_end, harmon_bar10, BAR11_16THS, title_chip, title_sub)

SW = 0.0

# roll call: horns (3) + trombones (2) under the chip's top line (the horns double it an octave down)
ROLL_HN = [('F4', 'C4', 'G3')] * 4 + [('G4', 'C4', 'Ab3'), ('Ab4', 'C4', 'G3'), ('C5', 'Ab4', 'Eb4'),
                                      ('F5', 'C5', 'F4')]
ROLL_TBN = [('Eb3', 'Ab2')] * 4 + [('F3', 'Db3'), ('F3', 'Db3'), ('Bb3', 'E3'), ('C4', 'F3')]
HARMON_V2 = [('C5', 540, 25), ('Bb4', 565, 5), ('Ab4', 570, 15), ('D5', 585, 15),          # bar 10, lightly swung
             ('Eb5', 600, 7.5), ('Db5', 607.5, 7.5), ('C5', 615, 7.5), ('Bb4', 622.5, 5.5)]  # bar 11, straight


def cold_open(a: Arr):
    for f, v in [(0, 0.37), (15, 0.34), (30, 0.28), (45, 0.28)]:
        felt(a, 'F5', f, 14, v, lock=True)
    for f in (0, 15):       # the knee's flat line starts as the cursor glint (cut at f30/f45 under the VO)
        a.n('lead', 'F6', f, 1.5, 0.22, lock=True, duty=0.125, rel=0.05, dec=0.05, sus=0.2)
    a.n('harp', 'F5', 0, 30, 0.34, lock=True, lp=3500)          # harp harmonic F5
    # celli and basses hold the open fifth instead of the sub (no drone in V2's cold open)
    a.n('cb', 'F1', 0, 119, 0.16, lock=True, att=1.1, env=[(0, 0.2), (1.2, 1.0), (4.9, 0.85)], rel=0.3)
    a.n('vc', 'C2', 2, 117, 0.14, lock=True, att=1.1, env=[(0, 0.2), (1.2, 1.0), (4.8, 0.85)], rel=0.3)
    a.n('vc', 'F2', 6, 113, 0.10, lock=True, att=1.2, env=[(0, 0.2), (1.3, 1.0), (4.6, 0.8)], rel=0.3)
    # the D-flat in the pause is on the bass clarinet (bassoon stands in: no bass clarinet in the pack); ends f71
    a.n('bsn', 'Db2', 60, 11, 0.42, lock=True, att=0.03, rel=0.15)
    a.n('cb', 'Db2', 60, 11, 0.10, lock=True, att=0.08, rel=0.15)
    # the pluck (f90): harp F5, pizz C5, chip F6
    a.n('harp', 'F5', 90, 20, 0.5, lock=True)
    a.n('vln_pizz', 'C5', 90, 6, 0.32, lock=True)
    a.n('lead2', 'F6', 90, 2, 0.30, lock=True, duty=0.125, rel=0.18, dec=0.08, sus=0.1)
    # the leap (f105-116): celesta with chip, spiccato + harp under
    run = [('G5', 105), ('Ab5', 108), ('C6', 112), ('F6', 116)]
    for i, (p, f) in enumerate(run):
        a.n('lead', p, f, 3, 0.27 + 0.04 * i, lock=True, duty=0.25, rel=0.06, sus=0.7)
        a.n('vln_spic', p, f, 3, 0.45 + 0.05 * i, lock=True)
        a.n('celesta', p, f, 4, 0.36 + 0.04 * i, lock=True)
        a.n('harp', nm(p) - 12, f, 6, 0.32 + 0.04 * i, lock=True)


def era_1993(a: Arr):
    era_1993_core(a, swung=False, piano='grand', piano_vel=0.34)
    # a timpani F and low strings on the drop
    a.n('timp', 'F2', 120, 20, 0.75, lock=True)
    for i, p in [('cb', 'F1'), ('vc', 'F2'), ('vc', 'C3'), ('vla', 'Ab3')]:
        a.n(i, p, 120, 46, 0.30, env=[(0, 1.0), (0.3, 0.45), (1.9, 0.3)], rel=0.3)
    # f168-179: a harp glissando up with a string swell (no chip arpeggio in V2)
    gl = ['F4', 'G4', 'Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'G5', 'Ab5', 'Bb5', 'C6', 'Eb6', 'F6']
    for k, p in enumerate(gl):
        a.n('harp', p, 168 + k * (11.0 / len(gl)), 5, 0.32 + 0.025 * k, lock=True)
    sw = [(0, 0.1), (0.4, 0.8), (0.5, 1.0)]
    for i, p in [('vln2', 'C5'), ('vla', 'F4'), ('vc', 'Ab3')]:
        a.n(i, p, 168, 12, 0.42, lock=True, att=0.05, env=sw, rel=0.1)


def era_2008(a: Arr):
    b = 4
    # pizzicato strings and harp carry the hook (no kit), at the era's fidelity; the chip doubles it 8va
    for i, (p, f) in enumerate(hook_2008(1.0)):
        v = [0.62, 0.5, 0.58, 0.5, 0.6, 0.55, 0.64, 0.66][i]
        a.n('snes_pizz', p, f, 5, v + 0.1, lock=True)
        a.n('snes_harp', p, f, 8, v * 0.8, lock=True)
        a.n('lead', nm(p) + 12, f, 3.0, v * 0.5, lock=True, duty=0.125, rel=0.04, sus=0.5, tilt=-3.0)
    # the harmony on sample-chip strings: Dbmaj7 -> Fm9 -> C7(b9)
    for p in ['Db3', 'Ab3', 'C4', 'F4']:
        a.n('snes_str', p, fr(b, 1), 29, 0.4, att=0.1)
    for p in ['F3', 'Ab3', 'Eb4', 'G4']:
        a.n('snes_str', p, fr(b, 3), 14.5, 0.4, att=0.05)
    for p in ['E3', 'Bb3', 'Db4', 'G4']:
        a.n('snes_str', p, fr(b, 4), 13, 0.4, att=0.05)
    for p, f in [('Db2', fr(b, 1)), ('Ab2', fr(b, 2)), ('F2', fr(b, 3)), ('C2', fr(b, 4))]:
        a.n('snes_cbpizz', p, f, 10, 0.7, lock=True)
    # brass accent #1 (f195): horns and trombones only, Dbmaj7, through the sample-chip filter
    for p, i, v in [('C5', 'snes_hn', 0.7), ('Ab4', 'snes_hn', 0.66), ('F4', 'snes_hn', 0.64),
                    ('Db4', 'snes_tbn', 0.66), ('Ab3', 'snes_tbn', 0.62)]:
        a.n(i, p, 195, 4, v, lock=True)
    # f225-239: the string swell only
    sw = [(0, 0.12), (0.5, 0.8), (0.62, 1.0)]
    for i, p, v in [('vln1', 'G5', 0.55), ('vln2', 'E5', 0.52), ('vla', 'Bb4', 0.52), ('vc', 'C3', 0.55),
                    ('cb', 'C2', 0.5)]:
        a.n(i, p, 225, 15, v, lock=True, att=0.05, env=sw, rel=0.12)
    a.n('clip_perc', 60, 180, 60, 0.45, lock=True, file=CYM_SWELL_25, align='peak', tail=0.1)


def orch_hit(a: Arr, H, k, h, big=1.0, trombones=True):
    """Orchestral hit: strings sfz, horns, trombones, timpani, bass drum, low piano, sub (no tuba: V2's brass
    is horns and trombones only)."""
    root = h['bass']
    up = h['piano']
    vv = (0.74 + 0.05 * k) * big
    sfz = [(0, 1.0), (0.18, 0.45), (1.8, 0.5)]
    for i, p in [('cb', root), ('vc', nm(root) + 12), ('vc', up[0]), ('vla', up[1]), ('vla', up[2]),
                 ('vln2', up[3]), ('vln2', nm(up[1]) + 12), ('vln1', nm(up[2]) + 12), ('vln1', nm(up[3]) + 12)]:
        a.n(i, p, H, 50, vv, lock=True, env=sfz)
    for p in up:
        a.n('hn', p, H, 20, vv * 0.92, lock=True, env=[(0, 1.0), (0.2, 0.45), (0.8, 0.3)], rel=0.4)
    if trombones:
        for p in [nm(root) + 12, up[0], up[1]]:
            a.n('tbn', p, H, 11, vv * 0.88, lock=True, env=[(0, 1.0), (0.25, 0.4)], rel=0.3)
    a.n('timp', root, H, 25, vv + 0.08, lock=True)
    a.n('bdrum', 60, H, 30, 0.5 + 0.08 * k, lock=True)
    a.n('suscym', 60, H, 30, 0.3 + 0.1 * k, lock=True)
    for p in [nm(root) - 12, root]:
        a.n('grand', p, H, 30, 0.62 + 0.04 * k, lock=True)
    a.n('sub', nm(root) - 12, H, 14, 0.78 + 0.04 * k, lock=True, decay=0.45, punch=7)
    # harp: a rolled chord up through the voicing (colour)
    for q, p in enumerate([root] + list(up) + [nm(up[3]) + 12]):
        a.n('harp', nm(p) + 12 if q == 0 else p, H + 0.6 * q, 12, 0.42, lock=True)


def dinner(a: Arr):
    vln1 = {5: 'G5', 6: 'G5', 7: 'Ab5', 8: 'Ab5'}
    vln2 = {5: 'Eb5', 6: 'F5', 7: 'F5', 8: 'E5'}
    ost = {5: 'F5', 6: 'F5', 7: 'F5', 8: 'E5'}
    winds = {5: ('Ab3', 'Eb4'), 6: ('F3', 'C4'), 7: ('Db3', 'Ab3'), 8: ('E3', 'Bb3')}
    for k, H in enumerate((240, 300, 360, 420)):
        bar = H // 60 + 1
        h = HITS[H]
        orch_hit(a, H, k, h, big=(1.08 if H == 420 else 1.0))
        # pizzicato bass walks (straight)
        walk(a, 'cb_pizz', bar, DINNER_WALKS[bar], vel=0.8, dur=12, body='vc_pizz', body_vel=0.42)
        # violins: the high sustained halo; low winds (bassoon + clarinet) hold the inner harmony
        a.n('vln1', vln1[bar], H + 6, 52, 0.46, att=0.4)
        a.n('vln2', vln2[bar], H + 6, 52, 0.44, att=0.4)
        a.n('bsn', winds[bar][0], H + 4, 54, 0.40, att=0.35, rel=0.3)
        a.n('cl', winds[bar][1], H + 4, 54, 0.38, att=0.35, rel=0.3)
        # piano as colour: one dark toll per bar on beat 3
        a.n('grand', {5: 'C5', 6: 'C5', 7: 'Db5', 8: 'E5'}[bar], fr(bar, 3), 20, 0.36)
        # the chip's flat line: four Fs across beats 2-3 (E on C7alt), straight
        for i in range(4):
            f = fr(bar, 2) + 7.5 * i
            a.n('lead', ost[bar], f, 3.0, [0.66, 0.54, 0.62, 0.56][i], lock=True, duty=0.125 if i % 2 else 0.25,
                rel=0.07, sus=0.45, dec=0.1, gain=3.5)
    # the noir counter-line: violas + celli, legato (straight), landing on F4 inside roll-call stab 1
    seq_hi = [(nm(p), s, d, 0.62) for p, s, d in COUNTER_LINE]
    seq_lo = [(nm(p) - 12, s, d, 0.60) for p, s, d in COUNTER_LINE]
    a.legato('vla', seq_hi, env=None, last=dict(rel=0.1))
    a.legato('vc', seq_lo, env=None, last=dict(rel=0.1))
    reed_organ(a, vel=0.55)
    a.n('vln_pizz', 'C5', 355, 4, 0.5, lock=True)
    a.n('vla_pizz', 'F4', 355, 4, 0.48, lock=True)
    # accent #5 (V2): horns and low strings crescendo into the f420 hit
    cre = [(0, 0.15), (0.5, 0.6), (0.62, 1.0)]
    for p in ['C4', 'E4', 'Bb4']:
        a.n('hn', p, 405, 15, 0.7, lock=True, att=0.1, env=cre, rel=0.08)
    for i, p in [('vc_trem', 'C3'), ('vc_trem', 'G3'), ('cb', 'C2')]:
        a.n(i, p, 405, 15, 0.7, lock=True, att=0.1, env=cre, rel=0.08)
    # into the roll call: chip + spiccato kink, an orchestral snare roll
    for p, f in [('G5', 465), ('Ab5', 470), ('C6', 475)]:
        a.n('lead', p, f, 3.5, 0.55, lock=True, duty=0.25, rel=0.05, sus=0.6)
        a.n('vln_spic', p, f, 3, 0.5, lock=True)
    a.n('clip_drums', 60, 460, 20, 0.42, lock=True, file=SNARE_ROLL, env=[(0, 0.1), (0.8, 1.0), (0.83, 0.0)], tail=0.05)


def rollcall(a: Arr):
    """Bar 9 (f480-539), stop-time: horns and trombones with the chip (top line at pitch, horns an octave
    below), pizzicato basses on every stab, timpani on stabs 1 and 8, sub on 1 and 8.  No mute."""
    roll_counterline_end(a, vel=0.62)
    for i, f in enumerate(ROLL_E):
        v = ROLL_VEL[i]
        ring = i == 7
        L = 4.5 if not ring else 5.5
        for q, p in enumerate(ROLL_HN[i]):
            a.n('hn_stac', p, f + 0.08 * q, L + 1, v * (1.0 if q == 0 else 0.9), lock=True, gain=4.0,
                pan=[-0.3, -0.15, -0.45][q], lp=7000)
        for q, p in enumerate(ROLL_TBN[i]):
            a.n('tbn_stac', p, f + 0.1 + 0.05 * q, L + 0.5, v * 0.88, lock=True, gain=3.0, pan=[0.15, 0.3][q],
                lp=6000)
        a.n('cb_pizz', ROLL_BASS[i], f, ROLL_RING if ring else 5, 0.82, lock=True)
        a.n('vc_pizz', nm(ROLL_BASS[i]) + 12, f, 4, 0.6, lock=True)
    roll_chip(a, octave_up=False, gain=2.0, vel=0.64)
    for f in (ROLL_E[0], ROLL_E[7]):
        a.n('timp', 'F2', f, 7, 0.82, lock=True)
    a.n('sub', 'F1', 480, 6.5, 0.8, lock=True, decay=0.25, punch=7)
    a.n('sub', 'F1', ROLL_E[7], ROLL_RING, 0.85, lock=True, decay=0.45, punch=7, rel=0.08)


def skyline(a: Arr):
    plucks = [('F5', 540), ('F5', 555), ('F5', 570), ('F5', 585), ('G5', 600), ('Ab5', 615), ('C6', 622.5)]
    for k, (p, f) in enumerate(plucks):
        v = 0.55 + 0.03 * k
        a.n('harp', p, f, 12, v, lock=True)
        a.n('vln_pizz', p, f, 5, v * 0.85, lock=True)
        a.n('vla_pizz', nm(p) - 12, f, 5, v * 0.7, lock=True)
        a.n('lead2', nm(p) + 12, f, 1.8, min(1.0, v * 1.25), lock=True, duty=0.125, rel=0.16, dec=0.06, sus=0.15,
            gain=4.0)
    # pizzicato walks the line cliche; low strings sustain under the Harmon
    for p, f in [('F2', 540), ('E2', 555), ('Eb2', 570), ('D2', 585), ('Db2', 600), ('C2', 615)]:
        a.n('cb_pizz', p, f, 12, 0.72, lock=True)
        a.n('cb', p, f, 15, 0.42, att=0.08)
        a.n('vc', nm(p) + 12, f, 15, 0.40, att=0.08)
    a.n('vla', 'Ab3', 540, 60, 0.42, att=0.3); a.n('vla', 'C4', 540, 60, 0.40, att=0.3)
    a.n('vla', 'F3', 600, 15, 0.45); a.n('vla', 'E3', 615, 15, 0.48)
    # the Harmon line runs on through bar 11 (straight there): the noir centre
    harmon_bar10(a, vel=0.64, notes=HARMON_V2)
    trem_env = [(0, 0.2), (1.0, 0.6), (1.25, 1.0)]
    for i, p in [('vln_trem', 'C5'), ('vln_trem', 'G5'), ('vla_trem', 'C4'), ('vla_trem', 'G4'), ('vc_trem', 'C3')]:
        a.n(i, p, 600, 30, 0.72, lock=True, env=trem_env, rel=0.08)
    # grand: dark tolling chords with the line cliche (colour)
    for f, ps in [(540, ['F2', 'C3']), (570, ['Eb2', 'Bb2']), (600, ['Db2', 'Ab2']), (615, ['C2', 'G2'])]:
        for p in ps:
            a.n('grand', p, f, 14, 0.42, lock=True)
    timp_roll(a, 'F2', 590, 40, 0.8, drum='F2')
    a.n('clip_drums', 60, 600, 30, 0.6, lock=True, file=SNARE_ROLL, env=[(0, 0.1), (1.25, 1.0), (1.3, 0.0)], tail=0.05)
    a.n('clip_perc', 60, 570, 60, 0.7, lock=True, file=CYM_SWELL_25, align='peak', tail=0.05)


def title(a: Arr):
    T = 630
    str_env = [(0, 1.0), (0.4, 0.72), (1.6, 0.75), (2.6, 0.35)]
    for i, p, v in [('cb', 'F1', 0.78), ('cb', 'F2', 0.78), ('vc', 'F2', 0.78), ('vc', 'C3', 0.78), ('vla', 'F3', 0.62),
                    ('vla', 'Bb3', 0.62), ('vln2', 'Eb4', 0.76), ('vln2', 'G4', 0.76), ('vln1', 'C5', 0.78),
                    ('vln1', 'F5', 0.78), ('vln1', 'G5', 0.78)]:
        a.n(i, p, T, 66, v, lock=True, env=str_env, rel=0.6)
    # brass accent #8: horns (swell) and trombones - no tuba
    for p in ['C4', 'F4', 'Bb4', 'Eb5']:
        a.n('hn', p, T, 55, 0.76, lock=True, env=[(0, 0.55), (0.7, 1.0), (1.6, 0.65), (2.3, 0.3)], rel=0.6)
    for p in ['F2', 'C3', 'G3']:
        a.n('tbn', p, T, 45, 0.64, lock=True, env=[(0, 1.0), (0.35, 0.6), (2.2, 0.3)], rel=0.5)
    for p in ['F1', 'C2', 'F2', 'Bb2']:
        a.n('grand', p, T, 60, 0.74, lock=True)
    a.n('bsn', 'F2', T, 55, 0.5, lock=True, att=0.05, env=[(0, 1.0), (0.5, 0.7), (2.2, 0.3)], rel=0.5)
    a.n('timp', 'F2', T, 40, 0.95, lock=True)
    a.n('bdrum', 60, T, 40, 0.85, lock=True)
    a.n('crash', 60, T, 60, 0.75, lock=True)
    a.n('suscym', 60, T, 60, 0.6, lock=True)
    title_sub(a, vel=0.95)
    title_chip(a, vel=0.52, vib=12, over=None, tri=None)
    a.n('celesta', 'F6', 660, 20, 0.52, lock=True)
    a.n('revswell', 60, 679, 11, 0.42, lock=True, hi=7000)
    a.n('drone', 'F1', 690, 29, 0.5, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=0.3, fade_out=0.4)


def build():
    a = Arr()
    cold_open(a); era_1993(a); era_2008(a); dinner(a); rollcall(a); skyline(a); title(a)
    T = add_clip_tracks(std_tracks())
    T['felt'].pedal = [(0, True), (58, False)]
    T['grand'].pedal = [(120, True), (164, False), (240, True), (299, False), (300, True), (359, False),
                        (360, True), (419, False), (420, True), (479, False), (540, True), (569, False),
                        (570, True), (599, False), (600, True), (629, False), (630, True), (719, False)]
    T['reed'].auto = REED_AUTO
    T['felt'].gain_db = 0.0
    T['grand'].gain_db = 5.0
    T['lead'].gain_db = 6.5
    T['lead2'].gain_db = 1.0
    T['beeper'].gain_db = 5.0
    T['sqbass'].gain_db = 2.0
    T['harmon'].gain_db = -1.5
    T['harmon'].sends = {'hall': -5, 'room': -12, 'plate': -12}
    T['cb_pizz'].gain_db = 1.0
    T['bsn'].gain_db = 1.0
    T['cl'].gain_db = -1.0
    T['reed'].gain_db = -3.0
    stem_gain = dict(piano=0.5, strings=4.0, brass=0.0, winds=1.0, harmon=0.0, bass=2.0, drums=0.0, perc=0.0,
                     chip=1.5, sub=-7.0, fx=-3.0)
    stem_post = {s: air(2.0) for s in STEMS}
    stem_post['strings'] = air(2.5, 1.0)
    for st_ in ('piano', 'perc', 'drums', 'sub'):
        stem_post[st_] = tape_peak(0.8, stem_post.get(st_))
    macro = [(0, -7), (119, -6), (120, 0), (179, -1), (180, -2), (239, -1.5), (240, 0), (479, 0), (480, 0.5),
             (539, 0.5), (540, -0.5), (629, 0.5), (630, 1.0), (719, 1.0)]
    return Score(name='V2-orchestralnoir', tracks=T, notes=a.notes, stems=STEMS, stem_gain=stem_gain,
                 stem_post=stem_post, macro=macro, stem_auto=vo_duck(STEMS),
                 meta=dict(title='ORCHESTRAL NOIR, CHIP HEART'))
