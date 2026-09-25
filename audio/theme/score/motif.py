"""Motif study (12.0 s): the knee head F F F F G Ab C F through every fidelity tier.

bar A  T0 dark room      felt piano, drone, a pixel glint
bar B  T1 1993 1-bit     beeper + square bass + noise hats over a real sub
bar C  T2 2008-14        16-bit sample-chip piano/vibes (no tape wow since v2.1), chip kit, lo-fi brass
bar D  T3 dinner (full)  felt piano + chip lead + strings + walking bass + brushes + brass stab
f240   T4 title          quartal F9sus4 (no third) + sub drop + chip F6, ding
"""
from engine.core import nm, fr, eighth
from engine.render import Score
from .common import (Arr, std_tracks, add_clip_tracks, STEMS, HITS, felt, big_band_stab, brush_bar, walk, air,
                     swing_pos, knee_notes)

HEAD = ['F', 'F', 'F', 'F', 'G', 'Ab', 'C', 'F']


def head(octave):
    return [nm(f'{p}{octave + (1 if i == 7 else 0)}') for i, p in enumerate(HEAD)]


def build():
    a = Arr()
    # A: T0
    for i, p in enumerate(head(4)):
        felt(a, p, swing_pos(1, i, 0.0), 7, [0.42, 0.34, 0.4, 0.34, 0.42, 0.4, 0.46, 0.5][i], lock=True)
    a.n('lead', 'F6', 0, 1.5, 0.3, lock=True, duty=0.125, rel=0.05, dec=0.05, sus=0.2)
    a.n('drone', 'F1', 0, 60, 0.55, lock=True, pitches=[nm('F1'), nm('C2')], fade_in=0.8, fade_out=0.1)
    a.n('revswell', 60, 48, 12, 0.4, lock=True)
    # B: T1 1-bit
    a.n('sub', 'F1', 60, 20, 0.9, lock=True, decay=0.5, punch=11)
    for i, p in enumerate(head(5)):
        a.n('beeper', p, swing_pos(2, i, 0.0), 5, 0.66 + 0.02 * i, lock=True)
    for bt in (1, 2, 3, 4):
        a.n('sqbass', 'F2' if bt < 4 else 'C3', fr(2, bt), 6, 0.55, lock=True, duty=0.5, max_hz=5000, rel=0.03, sus=0.8)
        a.n('noise', 60, fr(2, bt), 1, 0.45, lock=True, clock=30000, rel=0.02, dec=0.02, sus=0.0)
        a.n('noise', 60, fr(2, bt, 7.5), 1, 0.35, lock=True, clock=30000, rel=0.02, dec=0.02, sus=0.0)
    # C: T2 sample-chip
    b = 3
    for i, p in enumerate(head(5)):
        f = swing_pos(b, i, 1.0)
        v = [0.62, 0.5, 0.58, 0.5, 0.6, 0.55, 0.64, 0.66][i]
        a.n('snes_piano', p, f, 5, v)
        a.n('snes_vibes', p, f, 5, v * 0.8)
    for p in ['Db3', 'Ab3', 'C4', 'F4']:
        a.n('snes_piano', p, fr(b, 1), 28, 0.42)
    for p in ['E3', 'Bb3', 'Db4', 'G4']:
        a.n('snes_piano', p, fr(b, 3), 28, 0.40)
    for p, f in [('Db2', fr(b, 1)), ('Ab2', fr(b, 2)), ('C2', fr(b, 3)), ('G2', fr(b, 4))]:
        a.n('snes_bass', p, f, 12, 0.72)
    for f, k, v in [(fr(b, 1), 36, 0.8), (fr(b, 2), 39, 0.7), (eighth(b, 2, True), 36, 0.55), (fr(b, 4), 39, 0.75)]:
        a.n('snes_kit', k, f, 4, v)
    for p, i in [('C5', 'snes_brass'), ('Ab4', 'snes_brass'), ('F4', 'snes_brass'), ('Db4', 'snes_tbn')]:
        a.n(i, p, fr(b, 2), 4, 0.7, lock=True)
    # D: T3 full
    b = 4
    H = fr(b)
    h = HITS[240]
    big_band_stab(a, H, h['stab'], vel=0.8, length=5.5, bass_note=h['bass'])
    a.n('timp', 'F2', H, 20, 0.75, lock=True)
    a.n('sub', 'F1', H, 14, 0.8, lock=True, decay=0.42, punch=8)
    for i, p in enumerate(head(5)):
        f = swing_pos(b, i, 1.0)
        a.n('lead', p, f, 3.5, 0.66, duty=0.25 if i % 2 == 0 else 0.125, rel=0.06, sus=0.5)
    for f in [eighth(b, 2, True), fr(b, 4)]:
        for p in h['piano']:
            felt(a, p, f, 5, 0.5, mech=False)
    for i, p in [('vln1', 'G5'), ('vln2', 'Eb5'), ('vla', 'C5'), ('vc', 'Ab3'), ('cb', 'F2')]:
        a.n(i, p, H, 58, 0.5, env=[(0, 1.0), (0.25, 0.55), (2.2, 0.8)])
    walk(a, 'ubass', b, ['F2', 'Ab2', 'C3', 'E2'], vel=0.78)
    brush_bar(a, b, vel=0.55, swing=1.0)
    # f240: title chord, no third
    T = 240
    for i, p in [('cb', 'F1'), ('vc', 'F2'), ('vc', 'C3'), ('vla', 'F3'), ('vla', 'Bb3'), ('vln2', 'Eb4'),
                 ('vln2', 'G4'), ('vln1', 'C5'), ('vln1', 'F5'), ('vln1', 'G5')]:
        a.n(i, p, T, 44, 0.82, lock=True, env=[(0, 1.0), (0.35, 0.7), (1.6, 0.4)], rel=0.4)
    for p in ['C4', 'F4', 'Bb4', 'Eb5']:
        a.n('hn', p, T, 40, 0.75, lock=True, env=[(0, 1.0), (0.3, 0.7), (1.6, 0.35)], rel=0.4)
    for p in ['F1', 'C2', 'F2', 'Bb2']:
        a.n('grand', p, T, 44, 0.78, lock=True)
    a.n('timp', 'F2', T, 30, 0.95, lock=True)
    a.n('crash', 60, T, 44, 0.8, lock=True)
    a.n('sub', 'C2', T, 40, 0.95, lock=True, decay=1.6, punch=4, glide_to=nm('F1'), glide_s=1.4)   # C2 -> F1, never via A1
    a.n('lead', 'F6', T, 40, 0.58, duty=0.25, vib=14, vib_delay=0.4, rel=0.3, sus=0.6, dec=0.8, lock=True)
    a.n('glock', 'F6', T, 20, 0.55, lock=True)
    a.n('glock', 'F6', 270, 10, 0.5, lock=True)
    a.n('bell', 'F6', 270, 10, 0.45, lock=True, len=0.8)
    T_ = add_clip_tracks(std_tracks())
    T_['felt'].pedal = [(0, True), (29, False), (30, True), (59, False)]
    T_['grand'].pedal = [(240, True), (288, False)]
    T_['snes_piano'].pedal = [(120, True), (149, False), (150, True), (178, False)]
    T_['lead'].gain_db = 5.0
    T_['beeper'].gain_db = 5.0
    T_['felt'].gain_db = -1.5
    stem_gain = dict(piano=0.0, strings=4.0, brass=1.0, winds=0, bass=0.0, drums=1.0, perc=-0.5, chip=0.0,
                     sub=-7.0, fx=-3.0, harmon=0.0)
    stem_post = {s: air(2.0) for s in STEMS}
    macro = [(0, -5), (59, -5), (60, -1.5), (180, 0), (239, 0), (240, 1.0), (288, 1.0)]
    return Score(name='motif-study', tracks=T_, notes=a.notes, stems=STEMS, stem_gain=stem_gain, stem_post=stem_post,
                 macro=macro, mute_window=None, end_fade=(276, 287.5), meta=dict(seconds=12.0))
