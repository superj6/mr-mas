"""Bar 9 per INTRO_PIXEL_BRIEF v2.1: "THE PLAYERS" roll call (f480-539), replacing the old
"music fired / rehired" bar that the theme renders still contain.

Eight portrait flashes, one per straight eighth (7-8 frames each), play the knee
F F F F G Ab C F as eight stabs, brass section doubled by the chip lead.  Under the
melody the bass recaps the four dinner card roots (F . . . Db Bb C), so the roll
call quietly summarises the dinner before the skyline.  Flash 8 (the unnamed player:
a GLYPH cursor in an empty portrait window) is deliberately *empty*: no band, just a
lone chip F6 and its echo - the player who doesn't exist yet.

Each variation gets its own orchestration of the same notes:
  V1 chip chamber   small brass section + felt piano + chamber spiccato + brushes
  V2 orch noir      horns/trombones/tuba stac + string spiccato + timpani + chip heartbeat
  V3 pixel swing    big-band stabs with saxes + drummer kicks + ride quarters + grand
  V4 piano&pixels   felt-piano block chords + chip + pizz (no brass, as in V4)
"""
from engine.core import nm, fr
from score.common import felt, big_band_stab

E = [480 + 7.5 * i for i in range(8)]          # straight eighths (music exact)
FLASH_FRAMES = [480, 487, 495, 502, 510, 517, 525, 532]   # picture cuts (rounded down, 7-8 f each)
TOP = ['F5', 'F5', 'F5', 'F5', 'G5', 'Ab5', 'C6', 'F6']
CAST = ['TASYA', 'RADNUS', 'KRAM', 'NESNEJ', 'RIMA TAMURI', 'THE WHALE', 'RUMPT (silhouette)', '(unnamed GLYPH cursor)']
# 6-voice section voicings (top 3 = trumpets, low 3 = trombones), bass root
VOX = [
    (['F5', 'C5', 'Ab4', 'Eb4', 'Bb3', 'F3'], 'F2', 'Fm11'),
    (['F5', 'C5', 'Ab4', 'Eb4', 'Bb3', 'F3'], 'F2', 'Fm11'),
    (['F5', 'C5', 'Ab4', 'Eb4', 'Bb3', 'F3'], 'F2', 'Fm11'),
    (['F5', 'C5', 'Ab4', 'Eb4', 'Bb3', 'F3'], 'F2', 'Fm11'),
    (['G5', 'Eb5', 'C5', 'F4', 'Ab3', 'Db3'], 'Db2', 'Dbmaj9#11'),
    (['Ab5', 'F5', 'C5', 'Db4', 'Ab3', 'Bb2'], 'Bb1', 'Bbm9'),
    (['C6', 'Ab5', 'E5', 'Bb4', 'Db4', 'E3'], 'C2', 'C7b9b13'),
    (None, None, 'F (bare, empty portrait)'),
]
VEL = [0.74, 0.62, 0.66, 0.62, 0.76, 0.82, 0.9, 0.0]      # flat four (accent on 1), then the knee climbs
LEN = [4.5, 4.0, 4.5, 4.0, 5.0, 5.0, 6.0, 0.0]


def chip_double(a, lead_gain=1.0):
    for i, f in enumerate(E[:7]):
        a.n('lead', TOP[i], f, 3.6, min(1.0, (0.5 + 0.2 * VEL[i]) * lead_gain), lock=True, duty=0.25, rel=0.05,
            sus=0.6, dec=0.1)
    # flash 8: the empty portrait - one chip F6 + a 16th echo (the cursor blinking), nothing else
    a.n('lead', 'F6', E[7], 3.0, 0.5 * lead_gain, lock=True, duty=0.125, rel=0.06, sus=0.35, dec=0.08)
    a.n('lead2', 'F6', E[7] + 3.75, 2.0, 0.34 * lead_gain, lock=True, duty=0.125, rel=0.08, sus=0.2, dec=0.06)


def bass_roots(a, inst='ubass', vel=0.78, body=True):
    for i in (0, 2, 4, 5, 6):
        root = VOX[i][1]
        a.n(inst, root, E[i], 6.5 if i < 4 else 5.5, vel * (1.0 if i != 5 else 0.92), lock=True)
        if body and inst == 'ubass':
            a.n('cb_pizz', root, E[i], 5, 0.5, lock=True, rel=0.18)


def rollcall_v1(a):
    """Chip chamber jazz: brass only as accents (this is one of them), felt piano, chamber spiccato."""
    for i in range(7):
        vo, root, _ = VOX[i]
        big_band_stab(a, E[i], vo, vel=0.66 + 0.26 * VEL[i], length=LEN[i], saxes=(i >= 4), tuba=False)
        # felt piano: rootless inner voices, slightly under the brass
        for q, p in enumerate(vo[1:5]):
            felt(a, p, E[i] + 0.1 + 0.05 * q, LEN[i], 0.28 + 0.15 * VEL[i], mech=(q == 0), lock=True)
        # chamber strings: spiccato roots + top voice an octave down on the rising half
        a.n('vc_spic', nm(root) + 12, E[i], 3, 0.45 + 0.2 * VEL[i], lock=True)
        a.n('cb_spic', root, E[i], 3, 0.4 + 0.2 * VEL[i], lock=True)
        if i >= 4:
            a.n('vln_spic', nm(vo[0]) - 12, E[i], 3, 0.5 + 0.2 * VEL[i], lock=True)
            a.n('vla_spic', vo[2], E[i], 3, 0.45 + 0.2 * VEL[i], lock=True)
    chip_double(a, 1.15)
    bass_roots(a, 'ubass', 0.74)
    a.n('sub', 'F1', 480, 12, 0.8, lock=True, decay=0.5, punch=9)
    a.n('sub', 'Db1', 510, 10, 0.72, lock=True, decay=0.4, punch=8)
    a.n('sub', 'C2', 525, 7, 0.7, lock=True, decay=0.3, punch=8)
    for p in ('F1', 'F2'):
        a.n('grand', p, 480, 14, 0.54, lock=True)
    a.n('grand', 'Db2', 510, 7, 0.52, lock=True)
    a.n('grand', 'C2', 525, 7, 0.56, lock=True)
    a.n('timp', 'F2', 480, 12, 0.62, lock=True)
    a.n('timp', 'C2', 525, 7, 0.66, lock=True)
    a.n('crash', 60, 480, 14, 0.42, lock=True)
    # brushes: accents with the stabs, a swish under the flat four, a short feathered build into the knee
    a.n('swish', 60, 480, 30, 0.5)
    for i in (0, 4, 6):
        a.n('brush', 38, E[i], 3, 0.5 + 0.1 * (i / 6), lock=True)
        a.n('jazz', 36, E[i], 3, 0.42, lock=True)
    for k in range(4):
        a.n('brush', 38, 502.5 + k * 1.875, 2, 0.24 + 0.05 * k, lock=True)
    a.n('suscym', 60, 510, 22, 0.3, lock=True)


def rollcall_v2(a):
    """Orchestral noir: the 'brass section' is horns + trombones + tuba, with string spiccato and timpani;
    the chip heartbeat keeps going underneath."""
    from score.v2 import heartbeat
    for i in range(7):
        vo, root, _ = VOX[i]
        v = 0.58 + 0.3 * VEL[i]
        for p in vo[:3]:
            a.n('hn_stac', nm(p) - 12, E[i], LEN[i] + 1, v, lock=True)
        for p in vo[3:]:
            a.n('tbn_stac', p, E[i] + 0.1, LEN[i] + 1, v * 0.92, lock=True)
        a.n('tuba_stac', root, E[i], LEN[i] + 1, v * 0.85, lock=True)
        for inst, p in [('vln_spic', vo[0]), ('vln_spic', vo[1]), ('vla_spic', vo[2]), ('vla_spic', vo[3]),
                        ('vc_spic', nm(root) + 12), ('cb_spic', root)]:
            a.n(inst, p, E[i], 3, v * 0.9, lock=True)
        if i >= 4:
            a.n('tpt_stac', vo[0], E[i] + 0.15, LEN[i], v * 0.75, lock=True, pan=0.15)
    chip_double(a, 1.05)
    heartbeat(a, 9, beats=(1, 3), vel=0.48)
    for f, p, v in [(480, 'F2', 0.8), (510, 'Db2', 0.8), (525, 'C2', 0.86)]:
        a.n('timp', p, f, 10, v, lock=True)
    for f, p in [(480, 'F1'), (510, 'Db1'), (525, 'C1')]:
        a.n('grand', p, f, 10, 0.68, lock=True)
        a.n('grand', nm(p) + 12, f, 10, 0.6, lock=True)
    a.n('sub', 'F1', 480, 12, 0.78, lock=True, decay=0.5, punch=7)
    a.n('sub', 'Db1', 510, 10, 0.72, lock=True, decay=0.4, punch=7)
    a.n('bdrum', 60, 480, 16, 0.5, lock=True)
    a.n('bdrum', 60, 525, 10, 0.55, lock=True)
    a.n('suscym', 60, 480, 20, 0.35, lock=True)
    a.n('clip_perc', 60, 505, 20, 0.5, lock=True, file='vsco2ce/Percussion/susCymb1-cresc-Short_v1.wav',
        align='peak', tail=0.05)


def rollcall_v3(a):
    """Pixel swing: the big band plays the roll call - section stabs with saxes, the drummer kicks them,
    ride on straight quarters so the eighths stay square (it's a lineup, not a groove)."""
    for i in range(7):
        vo, root, _ = VOX[i]
        big_band_stab(a, E[i], vo, vel=0.66 + 0.26 * VEL[i], length=LEN[i], saxes=True, tuba=False)
        for q, p in enumerate(vo[1:5]):
            a.n('grand', nm(p), E[i] + 0.2 + 0.05 * q, LEN[i], 0.3 + 0.14 * VEL[i], lock=True)
        # drummer kicks: snare + kick on the stabs that matter
        if i in (0, 4, 5, 6):
            a.n('jazz', 38, E[i], 3, 0.36 + 0.2 * VEL[i], lock=True)
            a.n('jazz', 36, E[i], 3, 0.45 + 0.15 * VEL[i], lock=True)
    chip_double(a, 1.0)
    # parallel-fourth chip voice under the lead on the rising half (chiptune interval)
    for i in range(4, 7):
        a.n('lead2', nm(TOP[i]) - 5, E[i], 3.2, 0.5, lock=True, duty=0.125, rel=0.05, sus=0.5, dec=0.1)
    bass_roots(a, 'ubass', 0.8)
    for bt in (1, 2, 3):
        a.n('jazz', 51, fr(9, bt), 6, 0.42 if bt != 1 else 0.5, lock=True)
    a.n('jazz', 44, fr(9, 2), 3, 0.45, lock=True)
    a.n('jazz', 44, fr(9, 4), 3, 0.4, lock=True)
    a.n('crash', 60, 480, 14, 0.55, lock=True)
    a.n('sub', 'F1', 480, 12, 0.8, lock=True, decay=0.5, punch=9)
    a.n('sub', 'Db1', 510, 10, 0.7, lock=True, decay=0.4, punch=8)
    for p in ('F1', 'F2'):
        a.n('grand', p, 480, 14, 0.66, lock=True)
    a.n('grand', 'Db2', 510, 7, 0.62, lock=True)
    a.n('grand', 'C2', 525, 7, 0.66, lock=True)
    # snare pickup into flash 8's hole
    for k in range(3):
        a.n('jazz', 38, 528.75 + k * 1.25, 1.5, 0.28 + 0.06 * k, lock=True)


def rollcall_v4(a):
    """Piano & pixels: no brass (V4 has none) - felt-piano block chords doubled by the chip lead, pizz on top,
    chip triangle bass."""
    for i in range(7):
        vo, root, _ = VOX[i]
        v = 0.36 + 0.24 * VEL[i]
        for q, p in enumerate(vo):
            felt(a, p, E[i] + 0.05 * q, LEN[i] - 0.5, v * (1.0 if q == 0 else 0.86), mech=(q == 0), lock=True)
        felt(a, root, E[i], LEN[i], v * 0.75, mech=False, lock=True)
        a.n('vln_pizz', vo[0], E[i], 3, 0.4 + 0.2 * VEL[i], lock=True)
        a.n('tri', root, E[i], 5 if i < 4 else 4.5, 0.62, lock=True, rel=0.04, sus=0.7)
    chip_double(a, 1.0)
    a.n('sub', 'F1', 480, 12, 0.7, lock=True, decay=0.5, punch=7)
    a.n('sub', 'Db1', 510, 10, 0.65, lock=True, decay=0.4, punch=7)
    a.n('suscym', 60, 480, 20, 0.35, lock=True)
    a.n('glock', 'F6', E[7], 6, 0.3, lock=True)


# fader trim on the whole music bus inside bar 9 (dB), so the roll call sits ~1-1.5 LU over the dinner
# and stays under the title
BAR9_TRIM = {'V1': -1.2, 'V2': -0.6, 'V3': -2.0, 'V4': -2.0}


def bar9_macro(macro, trim):
    fr_ = [p[0] for p in macro]
    dv = [p[1] for p in macro]
    import numpy as _np
    at = lambda f: float(_np.interp(f, fr_, dv))
    pts = [(f, d) for f, d in macro if f < 479.6 or f > 539.6]
    pts += [(479.6, at(479.6)), (480.0, at(480.0) + trim), (539.0, at(539.0) + trim), (539.6, at(539.6))]
    return sorted(pts)


ROLLCALL = {'V1': rollcall_v1, 'V2': rollcall_v2, 'V3': rollcall_v3, 'V4': rollcall_v4}


def strip_pedal(ped, a=479.5, b=539.5):
    """Drop sustain-pedal events inside bar 9 and hold the pedal up there (dry stabs)."""
    if not ped:
        return ped
    out = [(f, on) for f, on in ped if not (a <= f <= b)]
    # state at bar 9 entry
    state = False
    for f, on in ped:
        if f < a:
            state = on
    if state:
        out.append((a, False))
    return sorted(out)


def cue_list():
    out = []
    for i in range(8):
        out.append(dict(flash=i + 1, frame=FLASH_FRAMES[i], music_frame=E[i], note=TOP[i], chord=VOX[i][2],
                        who=CAST[i]))
    return out
