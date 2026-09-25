"""V1 'CHIP CHAMBER JAZZ' (recommended; the primary mix) - SCRIPT v2.1.

Felt piano with jazz voicings + chamber strings + a chip lead that carries the knee
at every scale; a trio of piano, upright bass and brushes; brass only at the eight
scripted accents (f195 cup-muted stab, the f240/300/360 card stabs, the f414 rip,
the f420 shout, the eight roll-call stabs f480-532.5, the f630 horn swell) plus the
one horn melody, the Harmon-muted trumpet over bar 10.  The title chord has no third.
Balance target ~ piano 35 / orchestra 30 / big band 10 / chip 25 (rhythm excluded).
"""
from engine.core import nm, fr, eighth
from engine.render import Score
from .common import (tape_peak, Arr, std_tracks, add_clip_tracks, STEMS, HITS, felt, big_band_stab, brush_bar, walk,
                     air, timp_roll, swing_pos, CYM_SWELL_25, SNARE_ROLL, vo_duck, era_1993_core, era_1993_front,
                     hook_2008, DINNER_WALKS, COUNTER_LINE, reed_organ, REED_AUTO, trumpet_rip, ROLL_E, ROLL_BRASS,
                     ROLL_INNER, ROLL_VEL, ROLL_LEN, ROLL_RING, ROLL_BASS, roll_chip, roll_counterline_end,
                     harmon_bar10, BAR11_16THS, ARP11, title_chip, title_sub)

SW = 1.0     # swing amount for the swung sections (10-frame off-beat)
CHIP_UP = 4.0   # SCRIPT s9.2 item 6: dinner ostinato and skyline chip +4 dB (chip >= 20 % in every section)
BRASS_UP = 6.0  # the roll call is brass accent #7: the section leads it, the felt voicing sits under it


def cold_open(a: Arr):
    # felt piano pings F5 on the cursor blink (the VO duck takes f30/f45 down -6 dB)
    for f, v in [(0, 0.34), (15, 0.31), (30, 0.27), (45, 0.27)]:
        felt(a, 'F5', f, 14, v, lock=True)
    for f in (0, 15):       # 1-frame chip cursor glint; the f30/f45 glints are cut (they sat on the consonants)
        a.n('lead', 'F6', f, 1.5, 0.30, lock=True, duty=0.125, rel=0.05, dec=0.05, sus=0.2)
    # the colour note in the pause: low D-flat (b6 of F; no A-flat, still no third), ending at f71
    felt(a, 'Db2', 60, 11, 0.40, lock=True)
    felt(a, 'C5', 60.5, 10.5, 0.25, mech=False, lock=True)
    a.n('grand', 'Db1', 60, 11, 0.24, lock=True)
    a.n('cb', 'Db2', 60, 11, 0.11, att=0.08, rel=0.22, lock=True)
    # the music owns the drone: F1 + C2 open fifth, fading in over f0-29
    a.n('drone', 'F1', 0, 119.5, 0.62, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=1.2, fade_out=0.05)
    # the pluck as the dot exits (f90): harp F5, pizz C5, chip F6 (the duck holds it at -3 dB)
    a.n('harp', 'F5', 90, 20, 0.55, lock=True)
    a.n('lead2', 'F6', 90, 2, 0.34, lock=True, duty=0.125, rel=0.18, dec=0.08, sus=0.1)
    a.n('vln_pizz', 'C5', 90, 6, 0.35, lock=True)
    # the knee's leap on Post: G5 A-flat5 C6 F6 (f105/108/112/116), the chip doubling an octave up
    run = [('G5', 105), ('Ab5', 108), ('C6', 112), ('F6', 116)]
    for i, (p, f) in enumerate(run):
        a.n('lead', nm(p), f, 3 if i < 3 else 3.5, 0.36 + 0.05 * i, lock=True, duty=0.25, rel=0.06, sus=0.7)
        a.n('celesta', p, f, 4, 0.38 + 0.04 * i, lock=True)
        a.n('harp', nm(p) - 12, f, 6, 0.34 + 0.04 * i, lock=True)
        felt(a, nm(p) - 12, f, 4, 0.32 + 0.03 * i, lock=True)
    # (the reverse swell into f120 belongs to the SFX: no music revswell at f105)


def era_1993(a: Arr):
    era_1993_core(a, swung=False, piano='felt', piano_vel=0.40)
    era_1993_front(a, arp=True, tri=True, vel=0.5)
    # a brushed-snare swell (f172-179) brings in the trio
    a.n('swish', 60, 171, 9, 0.62, circles=0.5, lock=True)
    for f, v in [(174, 0.22), (176, 0.28), (177.5, 0.34)]:
        a.n('brush', 38, f, 2, v, lock=True)


def era_2008(a: Arr):
    b = 4
    # the trio at the era's fidelity (16-bit sample-chip, no tape wow): piano plays the knee, swung;
    # the chip doubles the hook's top line an octave up
    for i, (p, f) in enumerate(hook_2008(SW)):
        v = [0.62, 0.5, 0.58, 0.5, 0.6, 0.55, 0.64, 0.66][i]
        a.n('snes_piano', p, f, 5 if i < 7 else 4, v, lock=True)
        a.n('snes_vibes', p, f, 5, v * 0.7, lock=True)
        a.n('lead', nm(p) + 12, f, 3.2, v * 0.55, lock=True, duty=0.25, rel=0.04, sus=0.5, tilt=-3.0)
    # Dbmaj7 (f180-209) -> Fm9 (f210-224) -> C7(b9) (f225-239)
    for p in ['Db3', 'Ab3', 'C4', 'F4']:
        a.n('snes_piano', p, fr(b, 1), 28, 0.42)
    for p in ['F3', 'Ab3', 'Eb4', 'G4']:
        a.n('snes_piano', p, fr(b, 3), 14, 0.40)
    for p in ['E3', 'Bb3', 'Db4', 'G4']:
        a.n('snes_piano', p, fr(b, 4), 13, 0.40)
    for p, f in [('Db2', fr(b, 1)), ('Ab2', fr(b, 2)), ('F2', fr(b, 3)), ('C2', fr(b, 4)), ('E2', eighth(b, 4, True))]:
        a.n('snes_bass', p, f, 12 if p != 'E2' else 4, 0.72)
    # brushes through the chip: kick on 1 and 3 only (the boom-bap kicks on 2& / 3& are gone), taps on 2 and 4
    for f, k, v in [(fr(b, 1), 36, 0.7), (fr(b, 3), 36, 0.6), (fr(b, 2), 39, 0.68), (fr(b, 4), 39, 0.7)]:
        a.n('snes_kit', k, f, 4, v)
    for bt in (1, 2, 3, 4):
        a.n('snes_kit', 42, fr(b, bt), 2, 0.38)
        a.n('snes_kit', 42, eighth(b, bt, True), 2, 0.28)
    # brass accent #1, f195: a cup-muted stab, 3 trumpets + 2 trombones on Dbmaj7, through the sample-chip filter
    for p, i, v in [('C5', 'snes_cup', 0.74), ('Ab4', 'snes_cup', 0.7), ('F4', 'snes_cup', 0.68),
                    ('Db4', 'snes_tbn', 0.7), ('Ab3', 'snes_tbn', 0.66)]:
        a.n(i, p, 195, 4, v, lock=True)
    # f225-239: chamber strings (a quartet plus bass) enter with a swell into the dinner
    sw = [(0, 0.12), (0.5, 0.8), (0.62, 1.0)]
    for i, p, v in [('vln1', 'G5', 0.5), ('vln2', 'E5', 0.48), ('vla', 'Bb4', 0.48), ('vc', 'C3', 0.5),
                    ('cb', 'C2', 0.46)]:
        a.n(i, p, 225, 15, v, lock=True, att=0.05, env=sw, rel=0.12)
    a.n('clip_perc', 60, 180, 60, 0.5, lock=True, file=CYM_SWELL_25, align='peak', tail=0.1)
    # (the keyboard is the roll: no brush roll / revswell at f228)


def dinner(a: Arr):
    vln1 = {5: 'G5', 6: 'G5', 7: 'Ab5', 8: 'Ab5'}
    vln2 = {5: 'Eb5', 6: 'F5', 7: 'F5', 8: 'E5'}
    timp = {240: 'F2', 300: 'Db2', 360: 'Bb1', 420: 'C2'}
    low = {240: ['F1', 'F2'], 300: ['Db1', 'Db2'], 360: ['Bb0', 'Bb1'], 420: ['C1', 'C2']}
    sub = {240: 'F1', 300: 'Db1', 360: 'Bb1', 420: 'C2'}
    ost = {5: 'F5', 6: 'F5', 7: 'F5', 8: 'E5'}
    for k, H in enumerate((240, 300, 360, 420)):
        bar = H // 60 + 1
        h = HITS[H]
        vv = 0.80 + 0.05 * k
        # accents #2-#4: trumpets and trombones only; #6 (f420) is the only full shout (saxes in)
        big_band_stab(a, H, h['stab'], vel=vv, length=5.5, saxes=(H == 420), tuba=False)
        a.n('timp', timp[H], H, 20, 0.78 + 0.06 * k, lock=True)
        for p in low[H]:
            a.n('grand', p, H, 28, 0.62 + 0.05 * k, lock=True)
        for p in h['piano']:
            felt(a, p, H + 0.3, 9, 0.52, mech=False, lock=True)
        a.n('sub', sub[H], H, 14, 0.80 + 0.04 * k, lock=True, decay=0.42, punch=8)
        a.n('bdrum', 60, H, 20, 0.45 + 0.08 * k, lock=True)
        a.n('suscym', 60, H, 30, 0.35 + 0.1 * k, lock=True)
        # the strings hold the hit chord (violin halo sfz -> p -> swell)
        a.n('vln1', vln1[bar], H, 58, 0.64, env=[(0, 1.0), (0.25, 0.55), (2.2, 0.8)])
        a.n('vln2', vln2[bar], H, 58, 0.61, env=[(0, 1.0), (0.25, 0.55), (2.2, 0.8)])
        a.n('cb', h['bass'], H, 30, 0.58, env=[(0, 1.0), (0.3, 0.5), (1.2, 0.3)])
        # the harmony freezes; the bass keeps walking, like Mas
        walk(a, 'ubass', bar, DINNER_WALKS[bar], vel=0.78)
        # felt-piano comp: rootless voicings, a different swung cell each bar
        cells = {5: [(eighth(bar, 2, True, SW), 5, 0.52), (fr(bar, 4), 7, 0.46)],
                 6: [(eighth(bar, 1, True, SW), 6, 0.48), (fr(bar, 3), 5, 0.5), (eighth(bar, 3, True, SW), 4, 0.42)],
                 7: [(fr(bar, 2), 5, 0.5), (eighth(bar, 3, True, SW), 8, 0.52)],
                 8: [(eighth(bar, 2, True, SW), 4, 0.5), (eighth(bar, 3, True, SW), 4, 0.52)]}
        for j, (f, d, v) in enumerate(cells[bar]):
            vo = list(h['piano'])
            if j % 2 == 1:
                vo = [nm(vo[-1]) - 12] + vo[:-1]
            for q, p in enumerate(vo):
                felt(a, p, f + 0.08 * q, d, v * (0.9 + 0.1 * (q == len(vo) - 1)), mech=False, lock=True)
            a.n('felt_mech', 60, f, 2, 0.7, lock=True)
        brush_bar(a, bar, vel=0.55 + 0.03 * k, swing=SW, fill=(bar == 8))
        # the chip's flat line: four Fs across beats 2-3 (E on C7alt = the kink), swung
        for i, f in enumerate([fr(bar, 2), eighth(bar, 2, True, SW), fr(bar, 3), eighth(bar, 3, True, SW)]):
            a.n('lead', ost[bar], f, 3.2, [0.70, 0.58, 0.66, 0.6][i], lock=True, duty=0.125 if i % 2 else 0.25,
                rel=0.07, sus=0.45, dec=0.1, gain=CHIP_UP)
    # the noir counter-line (f255 -> F4 inside roll-call stab 1): violas + celli in octaves, legato, swung
    seq_hi = [(nm(p), s, d, 0.70) for p, s, d in COUNTER_LINE]
    seq_lo = [(nm(p) - 12, s, d, 0.68) for p, s, d in COUNTER_LINE]
    a.legato('vla', seq_hi, env=None, last=dict(rel=0.1))
    a.legato('vc', seq_lo, env=None, last=dict(rel=0.1))
    # ALYI: a reed-organ swell on a D-flat pedal (f285-299) into the f300 hit
    reed_organ(a, vel=0.55)
    # brush pickups / fills: into the ALYI swell (f282-284), into MARIO (f340-344), before the rocket (f403-404)
    for f, v in [(282, 0.34), (283.75, 0.4), (340, 0.4), (342, 0.46), (343.5, 0.5), (403, 0.4), (404, 0.46)]:
        a.n('brush', 38, f, 1.5, v, lock=True)
    # MARIO pickup: pizzicato on the swung off-beat (f355) against the klaxon's straight eighths
    a.n('vln_pizz', 'C5', 355, 4, 0.5, lock=True)
    a.n('vla_pizz', 'F4', 355, 4, 0.48, lock=True)
    # accent #5: the trumpet-section rip up to C (f414-419), the pickup into the shout
    trumpet_rip(a, 'C5', vel=0.8)
    # f460-464 drum fill, then the kink G-Ab-C (f465/470/475) into F at f480
    a.n('brush', 38, 460, 2.5, 0.42, lock=True)
    a.n('brush', 38, 462.5, 2, 0.36, lock=True)
    for p, f in [('G5', 465), ('Ab5', 470), ('C6', 475)]:
        a.n('lead', p, f, 3.5, 0.62, lock=True, duty=0.25, rel=0.05, sus=0.6, gain=CHIP_UP * 0.5)
        a.n('celesta', p, f, 4, 0.5, lock=True)
    felt(a, 'G4', 465, 4, 0.45, lock=True); felt(a, 'Ab4', 470, 4, 0.47, lock=True)
    felt(a, 'C5', 475, 4, 0.5, lock=True)


def rollcall(a: Arr):
    """Bar 9, THE PLAYERS (f480-539): brass accent #7, stop-time.  Eight stabs on straight eighths
    (480, 487.5 ... 532.5): 2 trumpets + 2 trombones, open and short, doubled an octave up by the chip lead;
    felt piano's rootless voicing underneath; upright bass and kick on every stab; sub F1 on stabs 1 and 8.
    No ride, no sustained strings, no SFX, no 'music fired' mute."""
    roll_counterline_end(a, vel=0.68)
    for i, f in enumerate(ROLL_E):
        t1, t2, b1, b2 = ROLL_BRASS[i]
        v, L = ROLL_VEL[i], ROLL_LEN[i]
        ring = i == 7
        g = BRASS_UP
        a.n('tpt_stac', t1, f, L, v, lock=True, pan=0.08, gain=g, **(dict(lp=5200) if ring else {}))
        a.n('tpt_stac', t2, f + 0.12, L, v * 0.9, lock=True, pan=0.3, detune=6, gain=g)
        a.n('tbn_stac', b1, f + 0.08, L + 0.5, v * 0.9, lock=True, pan=-0.18, detune=-4, gain=g)
        a.n('tbn_stac', b2, f + 0.15, L + 0.5, v * 0.88, lock=True, pan=-0.38, detune=4, gain=g)
        for q, p in enumerate(ROLL_INNER[i]):
            felt(a, p, f + 0.1 + 0.05 * q, ROLL_RING if ring else L, 0.22 + 0.1 * v, mech=False, lock=True)
        a.n('ubass', ROLL_BASS[i], f, ROLL_RING - 0.5 if ring else 4.5, 0.8 + 0.1 * (v - 0.7), lock=True)
        a.n('cb_pizz', ROLL_BASS[i], f, 4, 0.5, lock=True, rel=0.15)
        a.n('jazz', 36, f, 3, 0.48 + 0.25 * (v - 0.7), lock=True)
    roll_chip(a, octave_up=True, gain=2.5, vel=0.6)
    a.n('sub', 'F1', 480, 6.5, 0.85, lock=True, decay=0.25, punch=9)
    a.n('sub', 'F1', ROLL_E[7], ROLL_RING, 0.9, lock=True, decay=0.45, punch=9, rel=0.08)


def skyline(a: Arr):
    # the knee, slow, one tower per beat: F F F F G Ab C (the C on the straight 'and' of 11.2 = 622.5)
    plucks = [('F5', 540), ('F5', 555), ('F5', 570), ('F5', 585), ('G5', 600), ('Ab5', 615), ('C6', 622.5)]
    for k, (p, f) in enumerate(plucks):
        v = 0.55 + 0.03 * k
        a.n('harp', p, f, 12, v, lock=True)
        a.n('vln_pizz', p, f, 5, v * 0.85, lock=True)
        a.n('lead2', nm(p) + 12, f, 1.8, min(1.0, v * 1.35), lock=True, duty=0.125, rel=0.16, dec=0.06, sus=0.15,
            gain=CHIP_UP + 1.0)
    # upright walking bass, swung: the line cliche F2-E2-Eb2-D2, then Db2 -> C2 (bar 11, straight)
    for p, f in [('F2', 540), ('E2', 555), ('Eb2', 570), ('D2', 585), ('Db2', 600), ('C2', 615)]:
        a.n('ubass', p, f, 14, 0.78, lock=True)
        a.n('cb_pizz', p, f, 11, 0.45, lock=True, rel=0.18)
    a.n('cb', 'F2', 540, 60, 0.42, att=0.2)
    a.n('cb', 'Db2', 600, 15, 0.5); a.n('cb', 'C2', 615, 15, 0.55)
    # felt chords under the plucks (Fm, Fm(maj7), Fm7, Fm6 -> Db -> C7)
    ch = [(540, ['Ab3', 'C4', 'G4']), (555, ['Ab3', 'C4', 'G4']), (570, ['Ab3', 'C4', 'G4']),
          (585, ['Ab3', 'C4', 'F4']), (600, ['F3', 'Ab3', 'C4', 'G4']), (615, ['E3', 'Bb3', 'Db4', 'Ab4'])]
    for f, ps in ch:
        for p in ps:
            felt(a, p, f, 13, 0.38, mech=False, lock=True)
        a.n('felt_mech', 60, f, 2, 0.6, lock=True)
    # strings: sustained inner voices, then the tremolo riser on the open fifth C-G (no third)
    a.n('vla', 'Ab3', 540, 60, 0.42, att=0.25); a.n('vc', 'C3', 540, 60, 0.40, att=0.25)
    a.n('vc', 'F3', 600, 15, 0.5); a.n('vc', 'E3', 615, 15, 0.52)
    trem_env = [(0, 0.2), (1.0, 0.6), (1.25, 1.0)]
    for i, p in [('vln_trem', 'C5'), ('vln_trem', 'G5'), ('vla_trem', 'C4'), ('vla_trem', 'G4')]:
        a.n(i, p, 600, 30, 0.8, lock=True, env=trem_env, rel=0.08)
    a.n('vln1', 'G5', 540, 58, 0.30, att=0.6)
    a.n('vln2', 'C5', 540, 58, 0.28, att=0.6)
    # THE MUTED-TRUMPET MOMENT: the only horn melody (its own stem)
    harmon_bar10(a, vel=0.64)
    # brushes bar 10 (swung), then bar 11 squares up: straight 16th brush roll + snare roll + timpani F roll
    brush_bar(a, 10, vel=0.55, swing=SW)
    for k, f in enumerate(BAR11_16THS):
        a.n('brush', 38, f, 2, 0.30 + 0.05 * k, lock=True)
    a.n('clip_drums', 60, 600, 30, 0.7, lock=True, file=SNARE_ROLL, env=[(0, 0.1), (1.25, 1.0), (1.3, 0.0)], tail=0.05)
    timp_roll(a, 'F2', 600, 30, 0.75, drum='F2')
    a.n('clip_perc', 60, 570, 60, 0.7, lock=True, file=CYM_SWELL_25, align='peak', tail=0.05)
    a.n('noisesweep', 60, 600, 29.5, 0.7, lock=True, c0=2500, c1=26000, l0=0.1)
    # chip: swung arpeggio in bar 10, straight 16ths in bar 11 (the knee accelerating; on the grid)
    arp10 = ['F5', 'C6', 'Ab5', 'C6', 'F5', 'C6', 'Ab5', 'C6']
    for i, p in enumerate(arp10):
        a.n('arp', p, swing_pos(10, i, SW), 3, 0.55 + 0.01 * i, lock=True, duty=0.125, rel=0.04, sus=0.3,
            gain=CHIP_UP + 1.0)
    for i, (p, f) in enumerate(zip(ARP11, BAR11_16THS)):
        a.n('arp', p, f, 3.0, 0.58 + 0.03 * i, lock=True, duty=0.125, rel=0.03, sus=0.3, gain=CHIP_UP)


def title(a: Arr):
    T = 630
    # quartal: C-F-Bb-Eb over F, topped by G (the 9th) - no A, no A-flat
    str_env = [(0, 1.0), (0.35, 0.7), (1.5, 0.75), (2.6, 0.35)]
    for i, p, v in [('cb', 'F1', 0.85), ('vc', 'F2', 0.85), ('vc', 'C3', 0.85), ('vla', 'F3', 0.66),
                    ('vla', 'Bb3', 0.66), ('vln2', 'Eb4', 0.8), ('vln2', 'G4', 0.8), ('vln1', 'C5', 0.85),
                    ('vln1', 'F5', 0.85), ('vln1', 'G5', 0.85)]:
        a.n(i, p, T, 66, v, lock=True, env=str_env, rel=0.6)   # violas thinned: the PAD doubles F3-Bb3 on top
    # brass accent #8, the last brass: a horn swell C4 F4 Bb4 Eb5
    for p in ['C4', 'F4', 'Bb4', 'Eb5']:
        a.n('hn', p, T, 55, 0.8, lock=True, env=[(0, 0.55), (0.7, 1.0), (1.6, 0.7), (2.3, 0.3)], rel=0.6)
    # low piano F1 + C2 with F2-Bb2 above
    for p in ['F1', 'C2', 'F2', 'Bb2']:
        a.n('grand', p, T, 60, 0.8, lock=True)
    for p in ['C4', 'F4', 'Bb4', 'Eb5', 'G5']:
        felt(a, p, T + 0.4, 58, 0.52, mech=False, lock=True)
    a.n('timp', 'F2', T, 40, 1.0, lock=True)
    a.n('bdrum', 60, T, 40, 0.9, lock=True)
    a.n('crash', 60, T, 60, 0.9, lock=True)
    a.n('suscym', 60, T, 60, 0.7, lock=True)
    title_sub(a, vel=1.0)
    title_chip(a, vel=0.62)
    a.n('shimmer', 60, T, 60, 0.5, lock=True, pitches=[nm(p) for p in ['F5', 'G5', 'Bb5', 'C6', 'Eb6']], density=12)
    # the hold: celesta F6 alone at f660 (no chip echo)
    a.n('celesta', 'F6', 660, 20, 0.55, lock=True)
    # bookend: the music's reverse swell lands on the f690 cut; the drone returns (no celesta at f690;
    # the f705 ding belongs to the SFX)
    a.n('revswell', 60, 679, 11, 0.45, lock=True, hi=7000)
    a.n('drone', 'F1', 690, 29, 0.5, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=0.3, fade_out=0.4)


def build():
    a = Arr()
    cold_open(a); era_1993(a); era_2008(a); dinner(a); rollcall(a); skyline(a); title(a)
    T = add_clip_tracks(std_tracks())
    # felt sustain pedal: pings ring, the D-flat stops at f71, Fm9 rings to f164, the dinner breathes,
    # the roll call is dry until stab 8 rings to f539, the title rings
    T['felt'].pedal = [(0, True), (58, False), (60, True), (71, False), (105, True), (119, False), (120, True),
                       (164, False), (240, True), (252, False), (300, True), (312, False), (360, True),
                       (372, False), (420, True), (432, False), (532.5, True), (539.5, False), (540, True),
                       (598, False), (600, True), (628, False), (630.5, True), (719, False)]
    T['grand'].pedal = [(240, True), (299, False), (300, True), (359, False), (360, True), (419, False),
                        (420, True), (479, False), (630, True), (719, False)]
    T['snes_piano'].pedal = [(180, True), (209, False), (210, True), (238, False)]
    T['reed'].auto = REED_AUTO
    # V1 mix balance
    T['felt'].gain_db = 0.5
    T['beeper'].gain_db = 5.0
    T['sqbass'].gain_db = 2.0
    T['arp'].gain_db = 2.0
    T['lead2'].gain_db = 3.0
    T['grand'].gain_db = -2.0
    T['lead'].gain_db = 5.5
    T['lead'].sends = {'room': -12, 'snes': -9}
    T['ubass'].gain_db = -1.5
    T['harmon'].gain_db = 3.0
    T['harmon'].sends = {'hall': -6, 'room': -12, 'plate': -14}
    T['reed'].gain_db = -2.0
    stem_gain = dict(piano=0.5, strings=5.0, brass=0.0, winds=0.0, harmon=0.0, bass=0.0, drums=1.0, perc=-1.0,
                     chip=0.5, sub=-7.0, fx=-3.0)
    stem_post = {s: air(2.0) for s in STEMS}
    stem_post['strings'] = air(2.5, 1.0)
    stem_post['drums'] = air(2.0)
    for st_ in ('piano', 'perc', 'drums', 'sub'):
        stem_post[st_] = tape_peak(0.8, stem_post.get(st_))
    macro = [(0, -8.5), (119, -7.5), (120, 0), (179, -1), (180, -2), (239, -1.5), (240, 0), (479, 0), (480, 0.5),
             (539, 0.5), (540, -0.5), (629, 0.5), (630, 1.5), (719, 1.5)]
    return Score(name='V1-chipchamber', tracks=T, notes=a.notes, stems=STEMS, stem_gain=stem_gain, stem_post=stem_post,
                 macro=macro, stem_auto=vo_duck(STEMS), meta=dict(title='CHIP CHAMBER JAZZ'))
