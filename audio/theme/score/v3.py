"""V3 'PIXEL SWING' - the most playful - SCRIPT v2.1.

The chip leads the melody over a small swing band: grand piano, upright bass, brushes
that switch to sticks at f240.  Swing starts in bar 3 (the 1993 hook itself swings).
The card hits are big-band shout chords; the walking bass runs through bars 4-10; the
roll call is full-band shout kicks with the chip lead; in bar 10 the Harmon trumpet
trades two-beat phrases with the chip.  Strings enter only at the skyline.
Balance target ~ piano 30 / orchestra 15 / big band 15 / chip 40.
"""
from engine.core import nm, fr, eighth
from engine.render import Score
from .common import (tape_peak, Arr, std_tracks, add_clip_tracks, STEMS, HITS, felt, big_band_stab, ride_bar, walk,
                     air, swing_pos, CYM_SWELL_25, vo_duck, era_1993_core, era_1993_front, hook_2008, DINNER_WALKS,
                     COUNTER_LINE, reed_organ, REED_AUTO, trumpet_rip, ROLL_E, ROLL_BRASS, ROLL_INNER, ROLL_VEL,
                     ROLL_LEN, ROLL_RING, ROLL_BASS, roll_chip, harmon_bar10, BAR11_16THS, ARP11, title_chip,
                     title_sub)

SW = 1.0
TPT3 = ['Ab4'] * 4 + ['Ab4', 'Ab4', 'E5', 'F5']     # third trumpet in the roll call (stab 8: open fifths, no third)


def cold_open(a: Arr):
    # the F5 is a 12.5 %-duty chip square doubled by felt piano (f0, f15); f30/f45 felt only, under the VO
    for f, v in [(0, 0.34), (15, 0.31), (30, 0.27), (45, 0.27)]:
        felt(a, 'F5', f, 14, v, lock=True)
        if f < 30:
            a.n('lead', 'F5', f, 6, 0.36, lock=True, duty=0.125, rel=0.08, dec=0.12, sus=0.25)
    a.n('drone', 'F1', 0, 119.5, 0.55, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=1.2, fade_out=0.05)
    # the D-flat colour (no A-flat), ending f71
    for p, v in [('Db2', 0.40), ('C5', 0.24)]:
        a.n('grand', p, 60, 11, v, lock=True)
    a.n('ubass', 'Db2', 60, 11, 0.42, lock=True)
    a.n('jazz', 53, 60, 10, 0.22, lock=True)                   # ride bell, barely
    # the pluck (f90): vibes F5 + chip F6
    a.n('lead2', 'F6', 90, 2, 0.4, lock=True, duty=0.125, rel=0.18, dec=0.08, sus=0.1)
    a.n('vibes', 'F5', 90, 20, 0.45, lock=True)
    # the leap: chip lead, piano under; brushes swirl in under the run (after the glimpse, which has only the drone)
    run = [('G5', 105), ('Ab5', 108), ('C6', 112), ('F6', 116)]
    for i, (p, f) in enumerate(run):
        a.n('lead', p, f, 3, 0.42 + 0.05 * i, lock=True, duty=0.25, rel=0.06, sus=0.7)
        a.n('grand', nm(p) - 12, f, 4, 0.38 + 0.04 * i, lock=True)
        a.n('vibes', p, f, 4, 0.36 + 0.04 * i, lock=True)
    a.n('swish', 60, 105, 15, 0.45, lock=True)


def era_1993(a: Arr):
    # the hook already swings: F f120, F f130, F f135, with brushes
    era_1993_core(a, swung=True, piano='grand', piano_vel=0.38)
    a.n('swish', 60, 120, 30, 0.5, lock=True)
    a.n('brush', 38, 135, 3, 0.45, lock=True)
    a.n('brush', 38, 130, 2, 0.28, lock=True)
    # f168-179: a brush fill with the chip arpeggio (+ second pulse voice, triangle bass)
    era_1993_front(a, arp=True, tri=True, vel=0.55)
    for k, f in enumerate([168, 170, 172, 174, 176, 178]):
        a.n('brush', 38, f, 2, 0.26 + 0.06 * k, lock=True)


def era_2008(a: Arr):
    b = 4
    for i, (p, f) in enumerate(hook_2008(SW)):
        v = [0.66, 0.52, 0.6, 0.52, 0.62, 0.56, 0.66, 0.7][i]
        a.n('lead', p, f, 3.5, v * 0.85, lock=True, duty=0.25, rel=0.05, sus=0.55)
        a.n('snes_piano', nm(p) - 12, f, 5, v * 0.9, lock=True)
        a.n('snes_vibes', p, f, 5, v * 0.7, lock=True)
    for p in ['Db3', 'Ab3', 'C4', 'F4']:
        a.n('snes_piano', p, fr(b, 1), 14, 0.42)
    for p in ['F3', 'Ab3', 'Eb4', 'G4']:
        a.n('snes_piano', p, eighth(b, 2, True, SW), 10, 0.42)
    for p in ['E3', 'Bb3', 'Db4', 'G4']:
        a.n('snes_piano', p, eighth(b, 3, True, SW), 12, 0.42)
    # the walking bass starts here (bars 4-10)
    for p, f in [('Db2', fr(b, 1)), ('Ab2', fr(b, 2)), ('F2', fr(b, 3)), ('C2', fr(b, 4))]:
        a.n('snes_bass', p, f, 13, 0.72, lock=True)
    # a full swing kit through the chip: ride, snare on 2 and 4, kick on 1
    for bt in (1, 2, 3, 4):
        a.n('snes_kit', 51, fr(b, bt), 4, 0.5)
    for bt in (2, 4):
        a.n('snes_kit', 51, eighth(b, bt, True, SW), 3, 0.36)
        a.n('snes_kit', 38, fr(b, bt), 3, 0.62)
    a.n('snes_kit', 36, fr(b, 1), 4, 0.7)
    # brass accent #1 (f195): the full band shouts it (trumpets, trombones, sax), sample-chip filtered
    for p, i, v in [('C5', 'snes_brass', 0.72), ('Ab4', 'snes_brass', 0.68), ('F4', 'snes_brass', 0.66),
                    ('Db4', 'snes_tbn', 0.68), ('Ab3', 'snes_tbn', 0.64), ('F4', 'snes_sax', 0.6)]:
        a.n(i, p, 195, 4, v, lock=True)
    # f225-239: a drum fill with a trumpet pickup into the f240 shout (no roll: the keyboard is the roll)
    for f, k, v in [(225, 38, 0.5), (230, 45, 0.52), (232.5, 43, 0.5), (235, 41, 0.58), (237.5, 38, 0.5)]:
        a.n('jazz', k, f, 3, v, lock=True)
    a.n('tpt_stac', 'G4', 230, 3, 0.62, lock=True, pan=0.1)
    a.n('tpt_stac', 'Bb4', 235, 3.5, 0.68, lock=True, pan=0.1)


def dinner(a: Arr):
    low = {240: ['F1', 'F2'], 300: ['Db1', 'Db2'], 360: ['Bb0', 'Bb1'], 420: ['C1', 'C2']}
    for k, H in enumerate((240, 300, 360, 420)):
        bar = H // 60 + 1
        h = HITS[H]
        # shout chords: trumpets, trombones, saxes (the card-stab gesture includes the sax answer on 2&)
        big_band_stab(a, H, h['stab'], vel=0.84 + 0.04 * k, length=5.0, saxes=True, tuba=False)
        for p, i in [(h['stab'][2], 'tsax_stac'), (h['stab'][3], 'tsax_stac')]:
            a.n(i, p, eighth(bar, 2, True, SW), 3, 0.5, lock=True, pan=0.4)
        a.n('crash', 60, H, 30, 0.45 + 0.08 * k, lock=True)
        a.n('jazz', 36, H, 4, 0.7, lock=True)
        for p in low[H]:
            a.n('grand', p, H, 14, 0.6, lock=True)
        a.n('sub', {240: 'F1', 300: 'Db1', 360: 'Bb1', 420: 'C2'}[H], H, 12, 0.7, lock=True, decay=0.35, punch=8)
        walk(a, 'ubass', bar, DINNER_WALKS[bar], vel=0.8)
        # sticks on the ride from f240
        ride_bar(a, bar, vel=0.6 + 0.03 * k, swing=SW)
        for f, v in {5: [(eighth(5, 3, True), 0.45)], 6: [(eighth(6, 1, True), 0.4), (fr(6, 4), 0.5)],
                     7: [(eighth(7, 2, True), 0.45)], 8: [(eighth(8, 3, True), 0.5)]}[bar]:
            a.n('jazz', 38, f, 3, v, lock=True)
        for bt in (2, 3, 4):
            a.n('jazz', 36, fr(bar, bt), 3, 0.25, lock=True)
        # piano comp (grand, brighter), Charleston-ish + anticipations
        cells = {5: [(eighth(5, 1, True), 6), (fr(5, 3), 5)], 6: [(fr(6, 2), 5), (eighth(6, 3, True), 8)],
                 7: [(eighth(7, 1, True), 6), (fr(7, 3), 5), (eighth(7, 4, True), 4)],
                 8: [(eighth(8, 2, True), 5), (eighth(8, 3, True), 5)]}
        for j, (f, d) in enumerate(cells[bar]):
            vo = [nm(p) + 12 for p in h['piano']] if j == 1 else [nm(p) for p in h['piano']]
            for q, p in enumerate(vo):
                a.n('grand', p, f + 0.08 * q, d, 0.48 + 0.04 * (q == len(vo) - 1), lock=True)
            for p in vo[-2:]:                    # vibes double the comp's top (a swing-band colour)
                a.n('vibes', int(p) + 12, f, d + 4, 0.46, lock=True)
    # the chip sings the noir line an octave up (swung), with a harmony voice in bar 8
    for p, s, d in COUNTER_LINE:
        p8 = nm(p) + 12
        d = 14 if s == 450 else d          # the chip's last E leaves room for the roll call's stab 1
        a.n('lead', p8, s, d, 0.62, lock=True, duty=0.25 if d < 15 else 0.125, duty_to=0.25 if d >= 15 else None,
            vib=16, vib_delay=0.22, rel=0.06, sus=0.75, dec=0.3)
    for p, s, d in [('G5', 420, 14), ('F5', 435, 9), ('E5', 445, 5), ('C5', 450, 14)]:
        a.n('lead2', p, s, d, 0.5, lock=True, duty=0.5, rel=0.05, sus=0.7, dec=0.3)
    # tri doubles the walk an octave up in bar 8 (a pixel wink)
    for i, p in enumerate(DINNER_WALKS[8]):
        a.n('tri', nm(p) + 12, fr(8, i + 1), 5, 0.4, lock=True, rel=0.04, sus=0.5)
    # piano fill into ALYI; the reed organ's D-flat swell
    for p, f in [('Eb5', 285), ('F5', 290), ('G5', 292.5), ('Ab5', 295)]:
        a.n('grand', p, f, 3, 0.45, lock=True)
    reed_organ(a, vel=0.5)
    # MARIO pickup on the swung off-beat (f355): a short piano stab against the klaxon
    for p in ['F4', 'C5']:
        a.n('grand', p, 355, 3, 0.52, lock=True)
    # accent #5: the full band rips up to C (f414-419) with a snare fill
    trumpet_rip(a, 'C5', vel=0.84)
    for p, off in [('C4', 0.1), ('G3', 0.2)]:
        a.n('tbn', p, 414 + off, 5.3, 0.72, lock=True, att=0.02, rel=0.06, bend=[(0.0, -7.0), (0.18, 0.0)],
            env=[(0, 0.35), (0.19, 1.0), (0.22, 1.0)])
    for k, f in enumerate([414, 415.875, 417.75]):
        a.n('jazz', 38, f, 1.5, 0.4 + 0.1 * k, lock=True)
    # f460-464 and f465-479: snare fills; the kink on chip + piano
    for f, v in [(460, 0.42), (462.5, 0.36)]:
        a.n('jazz', 38, f, 2, v, lock=True)
    for p, f in [('G5', 465), ('Ab5', 470), ('C6', 475)]:
        a.n('lead', p, f, 3.5, 0.62, lock=True, duty=0.25, rel=0.05, sus=0.6)
        a.n('grand', nm(p) - 12, f, 4, 0.5, lock=True)
    for f, v in [(465, 0.5), (470, 0.58), (475, 0.66)]:
        a.n('jazz', 38, f, 3, v, lock=True)


def rollcall(a: Arr):
    """Bar 9 (f480-539): full-band shout kicks - 3 trumpets, 3 trombones, 2 tenors - with the chip lead
    an octave up; the drummer kicks every stab (snare + kick), crash on 1 and 8; bass on every stab;
    sub on 1 and 8.  Stop-time: no ride, no mute."""
    for i, f in enumerate(ROLL_E):
        t1, t2, b1, b2 = ROLL_BRASS[i]
        v, L = ROLL_VEL[i], ROLL_LEN[i]
        ring = i == 7
        g = 5.0
        a.n('tpt_stac', t1, f, L, v, lock=True, pan=0.05, gain=g, **(dict(lp=5200) if ring else {}))
        a.n('tpt_stac', t2, f + 0.12, L, v * 0.9, lock=True, pan=0.25, detune=6, gain=g)
        a.n('tpt_stac', TPT3[i], f + 0.2, L, v * 0.86, lock=True, pan=0.45, detune=-5, gain=g)
        a.n('tbn_stac', b1, f + 0.08, L + 0.5, v * 0.9, lock=True, pan=-0.15, detune=-4, gain=g)
        a.n('tbn_stac', b2, f + 0.15, L + 0.5, v * 0.88, lock=True, pan=-0.35, detune=4, gain=g)
        a.n('tbn_stac', nm(ROLL_BASS[i]) + 12, f + 0.05, L + 0.5, v * 0.82, lock=True, pan=-0.5, gain=g - 2)
        a.n('tsax_stac', b1, f + 0.15, L, v * 0.78, lock=True, pan=0.35, gain=g - 2)
        a.n('tsax_stac', t2, f + 0.25, L, v * 0.72, lock=True, pan=0.55, detune=7, gain=g - 2)
        for q, p in enumerate(ROLL_INNER[i]):
            a.n('grand', p, f + 0.2 + 0.05 * q, ROLL_RING if ring else L, 0.3 + 0.1 * v, lock=True)
        a.n('ubass', ROLL_BASS[i], f, ROLL_RING - 0.5 if ring else 4.5, 0.82, lock=True)
        a.n('cb_pizz', ROLL_BASS[i], f, 4, 0.5, lock=True, rel=0.15)
        a.n('jazz', 36, f, 3, 0.5 + 0.2 * (v - 0.7), lock=True)
        a.n('jazz', 38, f, 3, 0.36 + 0.3 * (v - 0.7), lock=True)
    roll_chip(a, octave_up=True, gain=2.0, vel=0.64)
    for f in (ROLL_E[0], ROLL_E[7]):
        a.n('crash', 60, f, 7 if f == 480 else ROLL_RING, 0.5, lock=True)
    a.n('sub', 'F1', 480, 6.5, 0.8, lock=True, decay=0.25, punch=9)
    a.n('sub', 'F1', ROLL_E[7], ROLL_RING, 0.85, lock=True, decay=0.45, punch=9, rel=0.08)


def skyline(a: Arr):
    plucks = [('F5', 540), ('F5', 555), ('F5', 570), ('F5', 585), ('G5', 600), ('Ab5', 615), ('C6', 622.5)]
    for k, (p, f) in enumerate(plucks):
        v = 0.58 + 0.03 * k
        a.n('lead', p, f, 2.2, v, lock=True, duty=0.25, rel=0.14, dec=0.08, sus=0.25)
        a.n('harp', p, f, 12, v * 0.8, lock=True)
        a.n('vln_pizz', p, f, 5, v * 0.8, lock=True)
        a.n('vibes', p, f, 12, v * 0.6, lock=True)
    for p, f in [('F2', 540), ('E2', 555), ('Eb2', 570), ('D2', 585), ('Db2', 600), ('C2', 615)]:
        a.n('ubass', p, f, 13.5, 0.8, lock=True)
        a.n('cb_pizz', p, f, 11, 0.5, lock=True)
    # strings enter: a warm pad + the tremolo riser (open fifth C-G)
    for i, p, v in [('vla', 'Ab3', 0.42), ('vla', 'C4', 0.4), ('vc', 'F3', 0.4), ('vln2', 'C5', 0.34),
                    ('vln1', 'G5', 0.34)]:
        a.n(i, p, 540, 60, v, att=0.7, env=[(0, 0.3), (1.5, 1.0), (2.5, 0.9)])
    trem_env = [(0, 0.2), (1.0, 0.6), (1.25, 1.0)]
    for i, p in [('vln_trem', 'C5'), ('vln_trem', 'G5'), ('vla_trem', 'C4'), ('vla_trem', 'G4')]:
        a.n(i, p, 600, 30, 0.8, lock=True, env=trem_env, rel=0.08)
    for f, ps in [(540, ['Ab4', 'C5', 'G5']), (570, ['Ab4', 'C5', 'G5']), (600, ['F4', 'Ab4', 'C5', 'G5']),
                  (615, ['E4', 'Bb4', 'Db5', 'Ab5'])]:
        for p in ps:
            a.n('grand', p, eighth(f // 60 + 1, (f % 60) // 15 + 1, True, SW if f < 600 else 0.0), 6, 0.45,
                lock=True)
    # bar 10: the Harmon trumpet trades two-beat phrases with the chip lead
    harmon_bar10(a, vel=0.64, notes=[('C5', 540, 25), ('Bb4', 565, 5)], fall=False)
    a.n('lead2', 'Ab5', 570, 14, 0.55, lock=True, duty=0.25, vib=14, vib_delay=0.18, rel=0.05, sus=0.75, dec=0.3)
    a.n('lead2', 'D6', 585, 14, 0.55, lock=True, duty=0.25, rel=0.05, sus=0.75, dec=0.3,
        bend=[(0.0, 0.0), (0.26, 0.0), (0.56, -5.0)])
    ride_bar(a, 10, vel=0.5, swing=SW)
    for bt in (2, 4):
        a.n('jazz', 38, fr(10, bt), 3, 0.34, lock=True)
    # bar 11 squares up: straight 16th snare build, cymbal swell, chip 16ths + noise sweep
    for k, f in enumerate(BAR11_16THS):
        a.n('jazz', 38, f, 2, 0.24 + 0.05 * k, lock=True)
    a.n('clip_perc', 60, 570, 60, 0.65, lock=True, file=CYM_SWELL_25, align='peak', tail=0.05)
    a.n('noisesweep', 60, 600, 29.5, 0.7, lock=True, c0=2500, c1=26000, l0=0.1)
    for i, (p, f) in enumerate(zip(ARP11, BAR11_16THS)):
        a.n('arp', p, f, 3.0, 0.6 + 0.03 * i, lock=True, duty=0.125, rel=0.03, sus=0.3)


def title(a: Arr):
    T = 630
    str_env = [(0, 1.0), (0.35, 0.7), (1.5, 0.75), (2.6, 0.35)]
    for i, p, v in [('cb', 'F1', 0.8), ('vc', 'F2', 0.8), ('vc', 'C3', 0.8), ('vla', 'F3', 0.64), ('vla', 'Bb3', 0.64),
                    ('vln2', 'Eb4', 0.76), ('vln2', 'G4', 0.76), ('vln1', 'C5', 0.8), ('vln1', 'F5', 0.8),
                    ('vln1', 'G5', 0.8)]:
        a.n(i, p, T, 66, v, lock=True, env=str_env, rel=0.6)
    # brass accent #8 (V3): the band shouts the quartal stack
    big_band_stab(a, T, ['G5', 'Eb5', 'Bb4', 'F4', 'C4', 'F3'], vel=0.9, length=7.0, saxes=True, tuba=False)
    for p in ['F1', 'C2', 'F2']:
        a.n('grand', p, T, 60, 0.8, lock=True)
    for p in ['Bb3', 'Eb4', 'G4', 'C5', 'F5']:
        a.n('grand', p, T + 0.3, 58, 0.58, lock=True)
    a.n('ubass', 'F1', T, 40, 0.85, lock=True); a.n('cb_pizz', 'F1', T, 30, 0.6, lock=True)
    a.n('jazz', 36, T, 4, 0.95, lock=True)
    a.n('crash', 60, T, 60, 0.9, lock=True)
    a.n('jazz', 53, T, 30, 0.6, lock=True)
    title_sub(a, vel=0.95, decay=2.0)
    title_chip(a, vel=0.66, vib=16)
    a.n('vibes', 'F5', T, 30, 0.55, lock=True); a.n('vibes', 'C6', T + 0.3, 30, 0.5, lock=True)
    a.n('shimmer', 60, T, 60, 0.45, lock=True, pitches=[nm(p) for p in ['F5', 'G5', 'Bb5', 'C6', 'Eb6']], density=12)
    a.n('celesta', 'F6', 660, 20, 0.55, lock=True)
    a.n('revswell', 60, 679, 11, 0.42, lock=True, hi=7000)
    a.n('drone', 'F1', 690, 29, 0.5, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=0.3, fade_out=0.4)


def build():
    a = Arr()
    cold_open(a); era_1993(a); era_2008(a); dinner(a); rollcall(a); skyline(a); title(a)
    T = add_clip_tracks(std_tracks())
    T['felt'].pedal = [(0, True), (58, False)]
    T['grand'].pedal = [(60, True), (71, False), (105, True), (119, False), (120, True), (164, False),
                        (532.5, True), (539.5, False), (630, True), (719, False)]
    T['grand'].eq = [('hs', 7000, 0.5), ('peq', 250, -1.0, 0.8)]
    T['grand'].gain_db = 6.5
    T['snes_piano'].pedal = [(180, True), (209, False), (210, True), (238, False)]
    T['reed'].auto = REED_AUTO
    T['lead'].gain_db = 3.0
    T['lead'].sends = {'room': -10, 'snes': -8, 'hall': -16}
    T['lead2'].gain_db = 1.0
    T['arp'].gain_db = 0.0
    T['beeper'].gain_db = 5.0
    T['sqbass'].gain_db = 2.0
    T['ubass'].gain_db = 0.0
    T['jazz'].gain_db = 11.0
    T['harmon'].gain_db = 1.0
    T['harmon'].sends = {'hall': -6, 'room': -10, 'plate': -14}
    T['reed'].gain_db = -4.0
    stem_gain = dict(piano=1.5, strings=3.5, brass=1.0, winds=0.0, harmon=0.0, bass=-1.5, drums=1.5, perc=1.0,
                     chip=1.0, sub=-10.0, fx=-3.0)
    stem_post = {s: air(2.0) for s in STEMS}
    stem_post['strings'] = air(2.5, 1.0)
    stem_post['drums'] = air(2.5)
    for st_ in ('piano', 'perc', 'drums', 'sub'):
        stem_post[st_] = tape_peak(0.8, stem_post.get(st_))
    macro = [(0, -6.5), (119, -5.5), (120, 0), (179, -1), (180, -1.5), (239, -1), (240, 0), (479, 0), (480, 0.5),
             (539, 0.5), (540, 0), (629, 0.5), (630, 1.0), (719, 1.0)]
    return Score(name='V3-pixelswing', tracks=T, notes=a.notes, stems=STEMS, stem_gain=stem_gain,
                 stem_post=stem_post, macro=macro, stem_auto=vo_duck(STEMS), meta=dict(title='PIXEL SWING'))
