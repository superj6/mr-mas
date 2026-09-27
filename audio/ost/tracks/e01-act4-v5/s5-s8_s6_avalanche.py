"""E01 Act Four v5 · S6 · THE AVALANCHE · SET-PIECE SWING (MM-10 form b, its own notes re-laid) · the episode's one full band
act frames 9001 -> 9341 (S6.01's first frame -> MADA's label, the dead stop), 14.17 s; the file runs to 9376 (S7.01)
in digital silence after the stop.  File t = 0 = act 9001.

AT 96 BPM EXACTLY (no time-scale at all; v4 needed 96.9).  S6.01 -> the label is 340 frames = 22 2/3 beats, and the
swung eighth sits 10 frames after the beat, so with the downbeat on S6.01's first frame the label lands exactly on the
swung "and" of beat 3 of bar 6: the band's anticipation, and the stop is on it.  Six bars, each one of MM-10's own:

  bar  act s     MM-10 source            what                                                picture
  1    375.042   A1 (+ A2's last two     the compile: timpani F, the Build's first 4 notes   S6.01 the first tile
                 walking notes)          (swung chip lead), the ride; B-flat, B -> C          (then ten, hundreds)
  2    377.542   A4                      the Build at 16, the low strings; the brass kick    S6.02 Mas watching (379.542)
                                         on beat 4 (379.417, 3 frames before the cut)
  3    380.042   A6                      Step Four's G-flat; ALYI RESISTS on beat 3          S6.03 Alyi's tile (381.042);
                                         (381.292): the engine stops, the chorale holds;     shoved: "ALYI left the call"
                                         step four = the bass alone; the Build resumes       (382.242)
  4    382.542   A7 (+ A8's bowed F      NELEH's window: no lead, the chorale pp shoved a    S6.04 "Has anyone read the
                 pedal from beat 3.5)    swung eighth early; the board's F pedal enters      char--" (383.258-384.578)
  5    385.042   A9 (its first bar)      the Water Line augmented (F5 . F5, violins in       S6.06 (384.917); THE QUIET
                                         octaves + chip), the Build low; THE QUIET VOTE:     VOTE leaves (385.917)
                                         the board's F pedal ends silently (no hit)
  6    387.542   A13 (2 2/3 beats)       THE FULL BAND on C7(#9b13), strings tremolo,        Mada wedged, not moving
                                         timpani roll, Mada's spinner (C5-Db5)
       389.208   STOP (dead, tails cut)  on MADA · LAST FIRER STANDING (freeze_hit_F owns    the label flips
                                         the onset); the dark room's air holds it until
                                         the violin's entry in S7 (391.667)

Neleh's line is ducked about -6 dB (the ducking map), inside a composed window.  Nothing here was listened to.
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

ID = 's5-s8_s6-avalanche'
F0 = C.BEATS['S6.01']['f0']          # 9001
F_END = C.BEATS['S7.01']['f0']       # 9376
Q = 0.625


def events():
    B, txt, snd, Lon, Lend = C.B, C.txt, C.snd, C.Lon, C.Lend
    return dict(
        av=B('S6.01'), mas=B('S6.02'), alyi_tile=B('S6.03'), alyi_left=txt('S6.03', 'ALYI left'),
        neleh_tile=B('S6.04'), neleh_on=Lon('a5-29-24'), neleh_end=Lend('a5-29-24'),
        neleh_drop=txt('S6.04', 'NELEH left'), mada=B('S6.06'), qv=txt('S6.06', 'THE QUIET VOTE'),
        label=txt('S6.06', 'MADA'), freeze=snd('S6.06', 'freeze_hit_F'), s7=B('S7.01'),
    )


def build():
    E = events()
    cue = C.Cue(ID, F0, F_END, swing=1.0)
    s, g = cue.s, cue.g
    mm10 = C.load_track('mm10-his-side-745')
    src = mm10._score(album=False)
    T = src.tracks
    for k in ('ubass', 'cb_pizz'):                           # the pizz body resonance at ~111 Hz (as v4)
        T[k].eq = list(T[k].eq) + [('peq', 111.3, -10.0, 8.0)]
    N = src.notes
    ta = lambda k: src.grid.t(23 + k)                        # noqa: E731  avalanche bar k -> source seconds
    assert abs(ta(1) - 58.75) < 1e-6 and abs(ta(13) - 88.75) < 1e-6, (ta(1), ta(13))
    LABEL = C.F(E['label'])                                  # act frame 9341.0 (float)
    lab_s = s(round(LABEL) / C.FPS)                          # the label's frame, in cue seconds
    beat = lambda b: b * Q                                   # noqa: E731  cue seconds of beat b (0-based) from S6.01
    assert abs(lab_s - beat(22) - 10 / 24) < 1e-3, (lab_s, beat(22))   # the swung 'and' of beat 3, bar 6
    add = cue.notes.extend
    add(C.remap(N, ta(1), ta(2), beat(0)))                                          # bar 1: A1, the compile
    add(C.remap(N, ta(2) + 2 * Q, ta(3), beat(2), keep={'ubass', 'cb_pizz'}))       # + A2's Bb2, B2 -> C
    add(C.remap(N, ta(4), ta(5), beat(4)))                                          # bar 2: A4, 16 + the kick
    add(C.remap(N, ta(6), ta(8), beat(8)))                                          # bars 3-4: A6-A7
    q8 = [n for n in C.remap(N, ta(8) + 1.0, ta(8) + 1.6, beat(14.5), truncate=False, keep={'cb', 'vc', 'hn'})
          if n.dur > 1.0]                                                            # A8's bowed F pedal (the board's)
    qv = s(E['qv'])
    for n in q8:
        n.dur = qv - n.start                                                         # THE QUIET VOTE: it ends there,
        n.x['rel'] = 0.35                                                            # silently (no hit)
    add(q8)
    add(C.remap(N, ta(9), ta(10), beat(16)))                                        # bar 5: A9, the Water Line
    add(C.remap(N, ta(13), ta(13) + (lab_s - beat(20)), beat(20)))                   # bar 6: A13, the full band
    cue.mutes.append((lab_s, s(E['s7']) + 0.5))                                      # STOP: dead on MADA's label
    # markers (onsets the engine checks) and the log (the cue sheet)
    for b_, lab in [(0, 'A1: the compile (timpani F, the Build 4)'), (4, 'A4: the Build at 16'),
                    (7, 'A4 beat 4: the brass kick (end of phrase 1)'), (8, "A6: Step Four's G-flat"),
                    (10, 'ALYI RESISTS (A6.3): timpani G-flat, the plucked no'), (16, 'A9: the Water Line augmented'),
                    (20, 'A13: THE FULL BAND, C7(#9b13)')]:
        cue.markers.append((beat(b_), lab))
        cue.log.append((cue.act(beat(b_)), lab))
    cue.log += [(E['neleh_on'], "NELEH's window (A7): no lead; the line ducked about -6 dB"),
                (cue.act(beat(14.5)), "the board's bowed F pedal enters (A8's)"),
                (E['qv'], 'THE QUIET VOTE: the F pedal ends silently'),
                (E['label'], "STOP: dead on MADA's label (freeze_hit_F owns the onset); digital zero to the file end")]
    for lab, b0, b1 in [('phrase 1: the compile (A1, A4)', 0, 8), ('phrase 2: Step Four, Alyi, Neleh (A6-A7)', 8, 16),
                        ('phrase 3: the Water Line, the quiet vote (A9)', 16, 20),
                        ('phrase 4: the full band (A13) -> the stop', 20, lab_s / Q)]:
        cue.sections.append((lab, beat(b0), beat(b1)))
    meta = C.base_meta(
        ID, 'The Avalanche (Ep1 Act Four v5, S6, to picture)', mm='MM-10',
        family='P11 SET-PIECE SWING (MM-10 form b, re-laid at 96 BPM, k = 1)',
        tone='the company falls into his lap as a swung avalanche that stops dead on the one man who will not move',
        scenes=[f'v5 S6.01-S6.06, act {F0}-{round(LABEL)} (the stop holds to {F_END}); file t=0 = act frame {F0}'],
        motifs=['the Build as the swung chip lead (4 -> 16)', 'Step Four (G-flat; Alyi resists one beat)',
                "the board's bowed F pedal (the quiet vote's layer)", 'the Water Line augmented (F . F)',
                "the full band on C7(#9b13); Mada's spinner"],
        motif_ids=['BUILD', 'STEP_FOUR'], key='F minor -> B-flat minor (Step Four) -> F -> C7(#9b13), unresolved',
        underscore_lufs=-16.0, album_lufs=-16.0,
        silence_windows=[],
        sfx_slots=[dict(t=round(s(C.snd('S6.01', 'landing_thunk', k)), 3), sfx=f'tile landing {k + 1}') for k in range(5)]
        + [dict(t=round(s(E['neleh_drop']), 3), sfx="landing_thunk: Neleh's tile goes (her voice drops)"),
           dict(t=round(lab_s, 3), sfx='freeze_hit_F: MADA · LAST FIRER STANDING (owns the stop)')],
        audition=['0.0 s: does the avalanche erupt out of the S5 pedal (no pickup, no riser)?',
                  f'{beat(7):.2f} s: the phrase-1 kick lands 3 frames before the cut to Mas (S6.02): early, or fine?',
                  f'{beat(10):.2f} s: Alyi resists one beat: resistance, not a dropout?',
                  f'{s(E["neleh_on"]):.2f}-{s(E["neleh_end"]):.2f} s: Neleh\'s line over the thinned window, ducked -6 dB',
                  f'{beat(20):.2f}-{lab_s:.2f} s: the full band, 2 2/3 beats, and the dead stop on the swung "and": '
                  'the laugh on the label, never a glitch'])
    sc = Score(ID, g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
               length_s=s(E['s7']), tail_s=0.2, meta=meta)
    sc.cue = cue
    return sc


if __name__ == '__main__':
    render_cli(build, __file__)
