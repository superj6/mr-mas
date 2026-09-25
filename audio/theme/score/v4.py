"""V4 'PIANO & PIXELS' - intimate / minimal (quiet-episode intro) - SCRIPT v2.1.

Solo felt piano and chip, with sub - nothing else (the vocal PAD at the title is the only
other colour, and it lives on the vocals bus).  The card hits are piano clusters with
chip arpeggios and sub; the piano's left hand walks; its right hand takes the muted-
trumpet line in octaves in bar 10.  The v2.0 clarinet line and title string pad are cut
(SCRIPT s9.2 item 7a); the noir counter-line moves to a soft chip square.
Balance ~ piano 55 / chip 45 (no orchestra, no big band).
"""
from engine.core import nm, fr, eighth
from engine.render import Score
from .common import (felt_post_bright, tape_peak, Arr, std_tracks, add_clip_tracks, STEMS, HITS, felt, walk, air,
                     swing_pos, vo_duck, era_1993_core, era_1993_front, hook_2008, DINNER_WALKS, COUNTER_LINE,
                     ROLL_E, ROLL_TOP, ROLL_BASS, ROLL_VEL, ROLL_RING, roll_chip, BAR11_16THS, ARP11, title_chip,
                     title_sub)

SW = 1.0     # swung 2nd eighth = beat + 10 frames (SCRIPT grid; v2.0 used 0.8 = +9.5)
# roll call: right-hand clusters under the knee's top line (stab 8: open fifths, no third)
RH = [('F5', 'Eb5', 'C5', 'Ab4')] * 4 + [('G5', 'F5', 'C5', 'Ab4'), ('Ab5', 'F5', 'C5', 'G4'),
                                        ('C6', 'Ab5', 'Eb5', 'Bb4'), ('F6', 'C6', 'F5', 'C5')]
LH_GUIDE = [None] * 4 + [None, None, ('E3', 'Bb3'), ('C3',)]


def cold_open(a: Arr):
    # piano alone: F5 on the cursor blink, low F1 + C2 under the pedal (no sub, no chip until the pluck)
    for f, v in [(0, 0.34), (15, 0.31), (30, 0.27), (45, 0.27)]:
        felt(a, 'F5', f, 14, v, lock=True)
    for p, v in [('F1', 0.46), ('C2', 0.40)]:
        felt(a, p, 0, 118, v, lock=True, mech=False)
    # the D-flat colour in the pause (no A-flat), ending f71
    felt(a, 'Db2', 60, 11, 0.38, lock=True)
    felt(a, 'C5', 60.5, 10.5, 0.24, mech=False, lock=True)
    # the pluck: piano F5 + chip F6 (the chip's first word)
    felt(a, 'F5', 90, 12, 0.3, lock=True)
    a.n('lead2', 'F6', 90, 2, 0.34, lock=True, duty=0.125, rel=0.18, dec=0.08, sus=0.1)
    # the leap: the machine takes the tune (chip), piano an octave under
    run = [('G5', 105), ('Ab5', 108), ('C6', 112), ('F6', 116)]
    for i, (p, f) in enumerate(run):
        a.n('lead', p, f, 3, 0.36 + 0.05 * i, lock=True, duty=0.25, rel=0.06, sus=0.7)
        felt(a, nm(p) - 12, f, 4, 0.34 + 0.03 * i, lock=True)


def era_1993(a: Arr):
    era_1993_core(a, swung=False, piano='felt', piano_vel=0.42, bdrum=False)
    # f168-179: a piano run up with the chip arpeggio
    era_1993_front(a, arp=True, tri=True, vel=0.5)
    for k, p in enumerate(['F3', 'Ab3', 'C4', 'Eb4', 'F4', 'Ab4', 'C5', 'Eb5']):
        felt(a, p, 168 + 1.4 * k, 3, 0.28 + 0.03 * k, mech=False, lock=True)


def era_2008(a: Arr):
    b = 4
    # piano hook and chip only (the sample-chip piano; the chip doubles it)
    for i, (p, f) in enumerate(hook_2008(SW)):
        v = [0.62, 0.5, 0.58, 0.5, 0.6, 0.55, 0.64, 0.66][i]
        a.n('snes_piano', p, f, 5, v, lock=True)
        a.n('lead', nm(p) + 12, f, 3.0, v * 0.5, lock=True, duty=0.25, rel=0.04, sus=0.5, tilt=-3.0)
    for p in ['Db3', 'Ab3', 'C4', 'F4']:
        a.n('snes_piano', p, fr(b, 1), 28, 0.42)
    for p in ['F3', 'Ab3', 'Eb4', 'G4']:
        a.n('snes_piano', p, fr(b, 3), 14, 0.40)
    for p in ['E3', 'Bb3', 'Db4', 'G4']:
        a.n('snes_piano', p, fr(b, 4), 13, 0.40)
    for p, f in [('Db2', fr(b, 1)), ('Ab2', fr(b, 2)), ('F2', fr(b, 3)), ('C2', fr(b, 4))]:
        a.n('tri', p, f, 12, 0.6, lock=True, rel=0.04, sus=0.7)
    for f in [fr(b, 2), fr(b, 4)]:
        a.n('noise', 60, f, 2, 0.45, lock=True, clock=12000, hp=1500, rel=0.08, dec=0.06, sus=0.0)
    for bt in (1, 2, 3, 4):
        a.n('noise', 60, eighth(b, bt, True, SW), 1, 0.3, lock=True, clock=30000, rel=0.02, dec=0.02, sus=0.0)
    # f195 (accent #1 in the other variations): a piano cluster with chip - V4 has no brass
    for q, p in enumerate(['Db4', 'F4', 'Ab4', 'C5']):
        a.n('snes_piano', p, 195 + 0.1 * q, 4, 0.58, lock=True)
    a.n('lead2', 'C6', 195, 3, 0.5, lock=True, duty=0.25, rel=0.1, dec=0.08, sus=0.2)
    a.n('arp', 'Ab5', 195, 3, 0.45, lock=True, duty=0.125, rel=0.1, dec=0.08, sus=0.2)
    # f225-234: a piano run (real piano: the frame is back in BASE) under the hook's last C and F
    for k, p in enumerate(['C4', 'E4', 'G4', 'Bb4', 'Db5']):
        felt(a, p, 225.5 + 1.9 * k, 3, 0.3 + 0.03 * k, mech=False, lock=True)


def arps(a: Arr, bar, tones, vel=0.46, start_beat=1, swing=SW, gain=0.0):
    """Swung eighth arpeggio (pulse 12.5%) on chord tones, from start_beat to the end of the bar."""
    for i in range((start_beat - 1) * 2, 8):
        p = tones[i % len(tones)]
        a.n('arp', p, swing_pos(bar, i, swing), 3.2, vel * (1.0 if i % 2 == 0 else 0.82), lock=True, duty=0.125,
            rel=0.08, dec=0.12, sus=0.25, gain=gain)


def dinner(a: Arr):
    arp_t = {5: ['F5', 'C6', 'G5', 'Ab5', 'Eb6', 'C6', 'Bb5', 'G5'],
             6: ['F5', 'C6', 'G5', 'Eb6', 'Ab5', 'C6', 'G5', 'F5'],
             7: ['F5', 'Db6', 'C6', 'Ab5', 'F5', 'Db6', 'Bb5', 'C6'],
             8: ['E5', 'Bb5', 'Eb6', 'Ab5', 'E5', 'Bb5', 'Db6', 'G5']}
    low = {240: ['F1', 'F2'], 300: ['Db1', 'Db2'], 360: ['Bb0', 'Bb1'], 420: ['C1', 'C2']}
    for k, H in enumerate((240, 300, 360, 420)):
        bar = H // 60 + 1
        h = HITS[H]
        big = 1.15 if H == 420 else 1.0
        # the hit: a pedalled piano cluster (low octave + voicing 8va), a chip chord, a soft sub
        for p in low[H]:
            felt(a, p, H, 12, (0.62 + 0.04 * k) * big, lock=True, mech=False)
        for q, p in enumerate(h['piano']):
            felt(a, nm(p) + 12, H + 0.1 * q, 12, (0.52 + 0.03 * k) * big, lock=True, mech=(q == 0))
        for p in h['stab'][:3]:
            a.n('lead2', p, H, 3, 0.55 + 0.04 * k, lock=True, duty=0.25, rel=0.2, dec=0.1, sus=0.2)
        a.n('sub', {240: 'F1', 300: 'Db1', 360: 'Bb1', 420: 'C2'}[H], H, 12, 0.66 + 0.04 * k, lock=True, decay=0.4,
            punch=6)
        # the left hand walks (a soft triangle doubles it for definition)
        walk(a, 'felt', bar, DINNER_WALKS[bar], vel=0.5, dur=12, body=None)
        for i, p in enumerate(DINNER_WALKS[bar]):
            a.n('tri', p, fr(bar, i + 1), 11, 0.5 * (1 if i % 2 == 0 else 0.92), lock=True, rel=0.05, sus=0.7)
        arps(a, bar, arp_t[bar], vel=0.44 + 0.02 * k, start_beat=2)
        # felt comp on 3& - rootless voicing, short
        for q, p in enumerate(h['piano']):
            felt(a, p, eighth(bar, 3, True, SW) + 0.08 * q, 5, 0.40, mech=(q == 0), lock=True)
        for bt in (2, 4):
            a.n('noise', 60, fr(bar, bt), 1.5, 0.35, lock=True, clock=26000, hp=5000, rel=0.03, dec=0.03, sus=0.0)
            a.n('noise', 60, eighth(bar, bt, True, SW), 1, 0.26, lock=True, clock=30000, hp=6000, rel=0.02, dec=0.02,
                sus=0.0)
    # the noir counter-line on a soft chip square (the v2.0 clarinet is cut: V4 is piano, chip and sub)
    for p, s, d in COUNTER_LINE:
        a.n('lead2', p, s, min(d, 26), 0.46, lock=True, duty=0.5, vib=10, vib_delay=0.3, rel=0.08, sus=0.7,
            dec=0.4, max_hz=4000, tilt=-4.0)
    # ALYI: a chip 'harmonium' swell on the D-flat pedal (f285-299) into the f300 hit
    for p in ['Db3', 'Ab3']:
        a.n('sqbass', p, 285, 15, 0.5, lock=True, duty=0.5, max_hz=3000, att=0.55, dec=2.0, sus=1.0, rel=0.25,
            tilt=-4.0)
    # MARIO pickup (f355): a chip pluck on the swung off-beat
    for p in ['F5', 'C6']:
        a.n('arp', p, 355, 2.5, 0.5, lock=True, duty=0.25, rel=0.06, dec=0.06, sus=0.2)
    # f405-419 (the rocket): a piano glissando with a chip riser
    gl = ['C4', 'D4', 'E4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5', 'D5', 'E5', 'F5', 'G5', 'Ab5', 'Bb5', 'C6']
    for k, p in enumerate(gl):
        felt(a, p, 411 + k * (6.0 / len(gl)), 2, 0.3 + 0.012 * k, mech=False, lock=True)
    a.n('lead2', 'C6', 405, 14.5, 0.5, lock=True, duty=0.25, att=0.4, sus=1.0, dec=2.0, rel=0.03,
        bend=[(0.0, -12.0), (0.55, 0.0)], tilt=-3.0)
    # the kink into F at f480
    for p, f in [('G5', 465), ('Ab5', 470), ('C6', 475)]:
        a.n('lead', p, f, 3.5, 0.55, lock=True, duty=0.25, rel=0.05, sus=0.6)
        felt(a, nm(p) - 12, f, 4, 0.42, lock=True)


def rollcall(a: Arr):
    """Bar 9 (f480-539): piano right-hand clusters on the eighths, doubled by the chip; the left hand
    (and a triangle) on the root of every stab; sub on stabs 1 and 8.  Stop-time, dry until stab 8 rings."""
    for i, f in enumerate(ROLL_E):
        v = 0.5 + 0.3 * (ROLL_VEL[i] - 0.7)
        ring = i == 7
        L = ROLL_RING if ring else 4.0
        for q, p in enumerate(RH[i]):
            felt(a, p, f + 0.06 * q, L, v * (1.0 if q == 0 else 0.84), mech=(q == 0), lock=True)
        felt(a, ROLL_BASS[i], f, L, v * 0.9, mech=False, lock=True)
        for p in (LH_GUIDE[i] or ()):
            felt(a, p, f + 0.05, L, v * 0.72, mech=False, lock=True)
        a.n('tri', ROLL_BASS[i] if i < 7 else 'F2', f, 4.5 if not ring else ROLL_RING, 0.62, lock=True, rel=0.04,
            sus=0.7)
        a.n('noise', 60, f, 1.2, 0.34, lock=True, clock=5000, hp=200, rel=0.03, dec=0.04, sus=0.0)
    roll_chip(a, octave_up=True, gain=1.0, vel=0.58)
    a.n('sub', 'F1', 480, 6.5, 0.72, lock=True, decay=0.25, punch=7)
    a.n('sub', 'F1', ROLL_E[7], ROLL_RING, 0.78, lock=True, decay=0.45, punch=7, rel=0.08)


def skyline(a: Arr):
    plucks = [('F5', 540), ('F5', 555), ('F5', 570), ('F5', 585), ('G5', 600), ('Ab5', 615), ('C6', 622.5)]
    for k, (p, f) in enumerate(plucks):
        v = 0.46 + 0.03 * k
        felt(a, p, f, 12, v, lock=True, mech=False)
        a.n('lead', nm(p) + 12, f, 1.8, min(1.0, v * 1.25), lock=True, duty=0.125, rel=0.16, dec=0.06, sus=0.15)
    # the left hand walks the line cliche (triangle doubles it)
    for p, f in [('F2', 540), ('E2', 555), ('Eb2', 570), ('D2', 585), ('Db2', 600), ('C2', 615)]:
        felt(a, p, f, 13, 0.5, mech=False, lock=True)
        a.n('tri', p, f, 13, 0.56, lock=True, rel=0.05, sus=0.75)
    # the right hand takes the muted-trumpet line in octaves; its 'fall' is a quick run down
    for p, f, d, v in [('C4', 540, 25, 0.44), ('Bb3', 565, 5, 0.38), ('Ab3', 570, 15, 0.42), ('D4', 585, 9, 0.42)]:
        felt(a, p, f, d, v, mech=True, lock=True)
        felt(a, nm(p) + 12, f + 0.08, d, v * 0.95, mech=False, lock=True)
    for k, p in enumerate(['D5', 'C5', 'Bb4', 'Ab4']):
        felt(a, p, 594 + 1.4 * k, 1.6, 0.3 - 0.04 * k, mech=False, lock=True)
    # bar 11 squares up: chords on the grid
    for f, ps in [(600, ['F3', 'Ab3', 'C4', 'G4']), (615, ['E3', 'Bb3', 'Db4', 'Ab4'])]:
        for p in ps:
            felt(a, p, f, 13, 0.36, mech=False, lock=True)
    arps(a, 10, ['F5', 'C6', 'Ab5', 'C6'], vel=0.46, gain=2.0)
    for i, (p, f) in enumerate(zip(ARP11, BAR11_16THS)):
        a.n('arp', p, f, 3.0, 0.5 + 0.03 * i, lock=True, duty=0.125, rel=0.03, sus=0.3, gain=2.0)
    a.n('noisesweep', 60, 600, 29.5, 0.6, lock=True, c0=2500, c1=24000, l0=0.1)


def title(a: Arr):
    T = 630
    # the piano's quartal cluster (no third) with the chip and the sub
    for p in ['F1', 'C2', 'F2']:
        felt(a, p, T, 60, 0.72, lock=True, mech=False)
    for p in ['Bb3', 'Eb4', 'G4', 'C5', 'F5']:
        felt(a, p, T + 0.3, 58, 0.56, mech=False, lock=True)
    a.n('felt_mech', 60, T, 2, 0.8, lock=True)
    title_sub(a, vel=0.8, decay=1.8)
    title_chip(a, vel=0.5, vib=14, tri='F2')
    # the hold: F6 alone (piano) at f660
    felt(a, 'F6', 660, 20, 0.42, lock=True, mech=False)
    # the swell into the f690 cut (a soft chip noise swell), then the drone returns
    a.n('noisesweep', 60, 679, 11, 0.4, lock=True, c0=1500, c1=9000, l0=0.05, hp=800)
    a.n('drone', 'F1', 690, 29, 0.45, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=0.3, fade_out=0.4)


def build():
    a = Arr()
    cold_open(a); era_1993(a); era_2008(a); dinner(a); rollcall(a); skyline(a); title(a)
    T = add_clip_tracks(std_tracks())
    T['felt'].pedal = [(0, True), (58, False), (60, True), (71, False), (72, True), (104, False), (105, True),
                       (119, False), (120, True), (164, False), (168, True), (179, False), (225, True), (238, False),
                       (240, True), (250, False), (300, True), (310, False), (360, True), (370, False), (420, True),
                       (430, False), (411, True), (418.2, False), (532.5, True), (539.5, False), (540, True),
                       (554, False), (555, True), (569, False), (570, True), (584, False), (585, True), (599, False),
                       (600, True), (614, False), (615, True), (628, False), (630.5, True), (719, False)]
    T['felt'].pedal.sort()
    T['snes_piano'].pedal = [(180, True), (209, False), (210, True), (238, False)]
    T['felt'].gain_db = -1.0
    T['felt'].post = felt_post_bright
    T['felt'].sends = {'room': -12, 'hall': -15}
    T['lead'].gain_db = 4.5
    T['lead2'].gain_db = 1.0
    T['arp'].gain_db = 2.0
    T['arp'].sends = {'snes': -8, 'room': -12}
    T['tri'].gain_db = 0.5
    T['tri'].eq = [('hp', 40), ('peq', 1200, 2.0, 1.0)]
    T['beeper'].gain_db = 5.0
    T['sqbass'].gain_db = 2.0
    stem_gain = dict(piano=0.0, strings=0.0, brass=0.0, winds=0.0, harmon=0.0, bass=0.0, drums=0.0, perc=-2.0,
                     chip=3.0, sub=-8.0, fx=-4.0)
    stem_post = {s: air(3.0, 1.5) for s in STEMS}
    for st_ in ('piano', 'perc', 'drums', 'sub'):
        stem_post[st_] = tape_peak(0.8, stem_post.get(st_))
    macro = [(0, -7.5), (119, -6.5), (120, 0), (179, -1), (180, -1), (239, -0.5), (240, 0), (479, 0), (480, 0.5),
             (539, 0.5), (540, 0), (629, 0.5), (630, 1.0), (719, 1.0)]
    return Score(name='V4-pianopixels', tracks=T, notes=a.notes, stems=STEMS, stem_gain=stem_gain,
                 stem_post=stem_post, macro=macro, stem_auto=vo_duck(STEMS), meta=dict(title='PIANO & PIXELS'))
