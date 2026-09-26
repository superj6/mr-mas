"""E01 Act Four v4 · S5 + S6 · HIS SIDE, 2 AM -> THE AVALANCHE (MM-10 re-laid) · act 3302-4628 (v4.0), 3159-4336 (v4.1)

v4.1 (lock v4.1, after the flow audit): STOP 2 is a RING-OUT, not a dead stop: the Build and his keys stop on the glance
and the dark-room pedal holds straight through into the avalanche (the audit: the stop fell on a glance a few pixels
big and left 3.5 s of room tone, the likeliest "random pause" in the act; the glance is now its own cut-in, S5.09b,
and the V.O. that followed it is cut). A soft pulse (upright bass, F/C) enters with the letter's counter and tightens
into eighths up to the launch-night clunk, then walks on a notch lower under the check, so the reveals play over a
heartbeat instead of a hush. The mix lifts the cue 4 dB. The avalanche is unchanged (the same 312 frames).

S5 is the DARK ROOM as one continuous pedal: an F/C open fifth, low strings sul tasto over the room drone, from the
home shot (the 09x felt F4 rings into it) to Gerg's glance.  It is the thinned floor under every real item here
(Rima's post and the heart ticks, the staff letter with the counter's ratchet and clunk as SFX, the check).  The
felt surfaces once, a C4 (the Water Line's bar-2 note), for "the badge was a joke." and holds, not moving, through
"mostly.".  The Build first appears with Gerg's tile: 4 notes after "Compiling-", 8 notes to his glance.
STOP 2 on the glance: the Build, his keys and the pedal stop together (digital zero on the music; the room plays).
The pedal returns under D8 and carries "Everyone is welcome." and "leave it open." into the swing's downbeat.

S6 is MM-10's avalanche itself (its own notes, voices and swing), re-laid as five whole phrase-statements at
k = 0.9905 (96.9 BPM, the only time-scale in Act Four, under 1 %) so 21 beats fill the montage exactly:
  4316  A1   the compile: timpani F, the Build's first 4 notes (+ A2's    S6.01 the first tile
             last two walking notes, B-flat, B, into A4's C)
  4375  A4   the Build at 16 notes; the brass kick ends the phrase (4420) the stack (S6.02 Mas at 4424)
  4435  A6   Step Four's G-flat: ALYI RESISTS on beat 3 (4465)           S6.03 Alyi's tile (4460)
  4494  A7   Neleh's thinned window; the second statement shoved early    S6.04 "Has anyone read the char-"
  4531  (A8's bowed F pedal: the QUIET VOTE's layer; it drops out silently at 4568)   S6.05 the black tile
  4554  A9   the Water Line augmented, its first F                       S6.05
  4583  A13  THE FULL BAND (3 beats: C7(#9b13), trem, timpani roll, spinner) S6.06 Mada wedged
  4628  STOP 3: dead on MADA's label (everything to digital zero)        the label flips
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *   # noqa: E402,F401,F403
from engine.motifs import line_pitches   # noqa: E402

ID = 'e01-act4-v4-s5s6-his-side-745'
F0 = A('S5.02')                      # 3302
AV = A('S6.01')                      # 4316
LABEL = M('S6.06', 'label')          # 4628
GLANCE = M('S5.09', 'glance')        # 3827 (v4.1)
BACK = A('S5.11')                    # 3907: the door (v4.1: the pedal never left)
F1 = LABEL
mm10 = load_track('mm10-his-side-745')
BUILD = line_pitches(MOTIFS['BUILD']['line'])
CHIP = dict(duty=0.25, rel=0.035, dec=0.09, sus=0.45, att=0.002)


def build():
    src = mm10._score(album=False)
    T = src.tracks
    # the upright and contrabass pizz samples ring a body resonance at ~111 Hz (an A2) under the F pedal (the same
    # fix MM-08 and MM-09 made on their pizz): a narrow notch on the two bass layers
    for k in ('ubass', 'cb_pizz'):
        T[k].eq = list(T[k].eq) + [('peq', 111.3, -10.0, 8.0)]
    cue = Cue(ID, F0, F1)
    s = cue.s
    a, g = cue.a, cue.g
    # ---------------------------------------------------------------- S5: the DARK ROOM pedal
    p0 = s(F0)
    # v4.1: ONE pedal from the home shot into the avalanche's downbeat (stop 2 is a ring-out: only the Build stops)
    rebow(a, 'vc', 'F2', p0, s(AV) + 0.3, 0.2, seg=5.0, xf=1.2, first_att=1.4, last_rel=0.5, art='sus', lp=1200)
    rebow(a, 'vla', 'C3', p0 + 0.2, s(AV) + 0.3, 0.17, seg=5.0, xf=1.2, first_att=1.6, last_rel=0.5, art='sus', lp=1400)
    # v4.1: the pulse under the record: upright bass on the beat from the counter's roll, eighths in the last bar before
    # the clunk (it tightens with the count), then quarters a notch lower under the demand, the scroll and the check;
    # out where Gerg's tile opens (his Build takes over). No pitch but the pedal's own F and C: no melody under a quote.
    c0, ck, gerg = M('S5.06', 'count0'), M('S5.06', 'clunk'), A('S5.09')
    bt = g.beats_s(1, 0.0)
    t, i = s(c0), 0
    while t < s(ck) - 0.05:
        u = (t - s(c0)) / max(0.1, s(ck) - s(c0))
        a.n('ubass', 'F2' if i % 2 == 0 else 'C3', t, 0.3, 0.3 + 0.16 * u, lock=True)
        t += bt if s(ck) - t > 2 * bt else bt / 2
        i += 1
    a.n('ubass', 'F2', s(ck), 0.5, 0.5, lock=True)                               # on the clunk
    t, i = s(ck) + bt, 0
    while t < s(gerg) - 0.1:
        a.n('ubass', 'F2' if i % 2 == 0 else 'C3', t, 0.3, max(0.18, 0.32 - 0.012 * i), lock=True)
        t += bt
        i += 1
    c4 = s(W('a4-29-vo2', 'badge'))                                             # the felt surfaces for the V.O.
    a.n('felt', 'C4', c4, s(A('S5.06')) - c4, 0.4, lock=True)
    a.n('felt_mech', 'C4', c4, 0.05, 0.2, lock=True)
    T['felt'].pedal = [(0.0, False), (c4 - 0.02, True), (s(A('S5.06') + 12), False)]
    # the Build with Gerg's tile: 4 notes after "Compiling-", then 8 to his glance (straight, chip + xylo)
    def build16(t0, n, vel):
        b16 = g.beats_s(0.25, t0)
        out = []
        for i in range(n):
            tt = t0 + i * b16
            out.append(a.n('lead', BUILD[i % 16], tt, b16 * 0.62, vel * (1.0, 0.72, 0.84, 0.72)[i % 4], True, **CHIP))
            if i % 4 == 0:
                a.n('xylo', BUILD[i % 16], tt, 0.1, 0.2, lock=True)
        return out
    build16(s(L_out('a4-29-04') + 2), 4, 0.56)                                   # pass 1: 4 notes
    p2 = s(GLANCE) - g.beats_s(2, 0.0)
    build16(p2, 8, 0.56)                                                         # pass 2: 8 notes, to the glance
    # (v4.0's cue.mute(GLANCE, BACK - 1), stop 2, is gone: the pedal holds; the keys stop as SFX)
    # ---------------------------------------------------------------- S6: MM-10's avalanche, re-laid (k = 0.9905)
    kt = (LABEL - AV) / (21 * 15.0)
    ta = lambda k: 58.75 + (k - 1) * 2.5    # noqa: E731  (avalanche bar k -> source seconds)
    beat = lambda b: s(AV) + b * 15.0 * kt / 24.0   # noqa: E731
    N = src.notes
    add = cue.notes.extend
    add(remap(N, ta(1), ta(2), beat(0), k=kt))                                   # A1 the compile
    # A1's second half is only the ride in the source (A2's walking bass came next): A2's last two walking notes
    # (Bb2, B2 -> A4's C3) carry the compile into the stack under A1's own ride, so the phrase never empties
    add(remap(N, ta(2) + 1.25, ta(3), beat(2), k=kt, keep={'ubass', 'cb_pizz'}))
    add(remap(N, ta(4), ta(5), beat(4), k=kt))                                   # A4 16 notes + the brass kick
    add(remap(N, ta(6), ta(8), beat(8), k=kt))                                   # A6-A7 Alyi resists; Neleh's window
    q8 = [n for n in remap(N, 77.0, 77.6, beat(14.5), k=kt, truncate=False, keep={'cb', 'vc', 'hn'})
          if n.dur > 1.0]
    for n in q8:                                                                 # the QUIET VOTE's layer
        n.dur = beat(17) - n.start
        n.x['rel'] = 0.35
    add(q8)
    add(remap(N, ta(9), ta(9) + 1.25, beat(16), k=kt))                            # A9 the Water Line augmented
    add(remap(N, ta(13), ta(13) + 1.875, beat(18), k=kt))                         # A13 THE FULL BAND (3 beats)
    cue.mute(LABEL, LABEL + 200)                                                 # STOP 3: dead on MADA's label
    for fr, lab in [(F0, 'S5: the DARK ROOM pedal (F/C)'), (W('a4-29-vo2', 'badge'), 'the felt C4 (the V.O.)'),
                    (c0, 'the pulse enters with the counter'), (ck, 'the clunk (the pulse lands)'),
                    (L_out('a4-29-04') + 2, 'the Build: 4 notes'), (GLANCE - 30, 'the Build: 8 notes'),
                    (GLANCE, "the glance: the Build stops, the pedal holds (ring-out)"), (BACK, 'the door'),
                    (AV, 'AVALANCHE A1: the compile'), (w(4375), 'A4'), (w(4435), 'A6: Step Four (Gb)'),
                    (w(4465), 'ALYI RESISTS'), (w(4494), "A7: Neleh's window"), (w(4531), 'the quiet vote\'s layer (A8 F pedal)'),
                    (w(4554), 'A9: the Water Line augmented'), (w(4583), 'A13: THE FULL BAND'),
                    (LABEL, "STOP 3: dead on MADA's label")]:
        cue.mark(fr, lab)
    for lab, a0, a1 in [('S5 the dark room pedal (+ the pulse)', F0, GLANCE), ('the glance: ring-out (the pedal holds)', GLANCE, BACK),
                        ('S5 the pedal: the door, "leave it open."', BACK, AV), ('S6 phrase 1: the compile', AV, w(4435)),
                        ('S6 phrase 2: Step Four, Alyi, Neleh', w(4435), w(4554)), ('S6 phrase 3: the Water Line', w(4554), w(4583)),
                        ('S6 phrase 4: the full band', w(4583), LABEL)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'His Side / 745 (Ep1 Act Four v4, S5 + S6, to picture)', mm='MM-10',
        family='P01 DARK ROOM -> P11 SET-PIECE SWING',
        tone='his side: one low pedal in the dark under the record, the Build with Gerg, a held look; then the company '
             'falls into his lap as a swung avalanche that stops dead on the one man who will not move',
        scenes=[f'v4.1 S5.02-S6.06, act {F0}-{F1} (the stop holds to S7.01); file t=0 = act frame {F0}'],
        motifs=['the DARK ROOM pedal (F/C, sul tasto)', "the Water Line's C4 (felt, the V.O.)",
                "the Build (Gerg's compile passes 4, 8)", "MM-10's avalanche: the Build swung, Step Four, Alyi's held "
                'beat, the Water Line augmented, the full band'],
        motif_ids=['BUILD', 'STEP_FOUR'], key='F open fifth -> F minor -> C7(#9b13), unresolved',
        underscore_lufs=-16.0, album_lufs=-16.0,
        silence_windows=[],
        vo_windows=[(s(L_in('a4-29-vo2')), s(L_out('a4-29-vo2')), '"the badge was a joke." (the felt C4)')],
        room_sfx=[dict(t0=p0, t1=s(AV), sfx='room_drone (the dark room)')],
        room_sfx_drop_stems=[],
        sfx_slots=[dict(t=s(M('S5.06', 'clunk')), sfx='odometer_ratchet clunk at 745'),
                   dict(t=s(M('S5.08', 'stamp')), sfx='rubber_stamp_C: VOID IF CEO MISSING'),
                   dict(t=s(LABEL), sfx='freeze_hit_F (the MADA label)')],
        audition=[f'0-{s(GLANCE):.1f} s: the pedal under the posts and the letter -- air, not a drone effect; does it '
                  'hold the room together without ever being noticed?',
                  f'{s(c0):.1f}-{s(A("S5.09")):.1f} s: the pulse under the counter and the check: a heartbeat, not a groove?',
                  f'{s(GLANCE):.1f}-{s(BACK):.1f} s: the glance: the Build stops, the pedal holds (a ring-out, not a hole)',
                  f'{s(AV):.1f} s: the avalanche erupts out of the pedal (the only time-scale in Act Four: 96.9 BPM)',
                  f'{s(w(4465)):.1f} s: Alyi resists one beat; {s(w(4583)):.1f} s: the band, 3 beats; {s(LABEL):.1f} s: '
                  'the dead stop on the label'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
                 length_s=s(LABEL) + 0.5, tail_s=0.3, meta=meta)


if __name__ == '__main__':
    render_cli(build, __file__)
