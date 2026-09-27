"""E01 Act Four v5 · S2 · THAT NIGHT: THE THIRD MARK · act 1178 -> 1512 (the whip into pass one)

DARK ROOM (MM-08 26A's notes, his felt), the music's re-entry after D6.  File t = 0 = act frame 1166 (a 0.5 s
pre-roll of silence); the first note sounds on 1178.

  act frame  music                                                   picture (lock v5)
  1178       the felt's open fifth F3 + C4 on the first stroke:     S2.01 he carves the third mark (the drone,
             the re-entry after D6 (above the room drone: nothing     SFX, pre-lapped at 1154)
             below C3)
  1208       the nudge G4, one sustained note, sounding BEFORE the   "i don't keep score." (V.O. 1216-1263)
             V.O. starts (it sits inside the bed: no sting, no swell)
  1271-1440  the drone's F/C pedal an octave up: violas and celli    S2.02 the Orb's light steps onto mark 1
             sul tasto F3 + C4, pp (no felt: the (REPORTED) rail      (1291); S2.03 TPOOL, HIS FIRST COMPANY ·
             carries no Mas motif)                                   TWO STAFF REVOLTS · (REPORTED); S2.04 marks
                                                                       2 and 3
  1429       the felt back: Eb4 (the b7, unresolved) on mark 3       mark 3
  1452/1467  the settle C4 -> F4 (the Water Line's bar 2)            S2.05 the iris lifts; `rewinding…` (1466)
  1482/1497  THE REWIND: E4, Bb3 on the 16-bit sample-chip piano,    the Orb takes it back (the reverse swell
             a semitone lower per beat (a retrograde, not a tape       is the SFX's, 1485)
             effect)
  1512       the cut on the whip: pass one's first chord lands on   S3.00a (s1-s4_s3s4_procedure.py)
             the same frame (Bb3 -> Bbm(add9))

Run: OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py s2
"""
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('s1_s4_common', os.path.join(HERE, 's1-s4_common.py'))
if 's1_s4_common' in sys.modules:
    _C = sys.modules['s1_s4_common']
else:
    _C = importlib.util.module_from_spec(_spec)
    sys.modules['s1_s4_common'] = _C
    _spec.loader.exec_module(_C)
globals().update({k: getattr(_C, k) for k in dir(_C) if not k.startswith('__')})

ID = 's1-s4_third-mark'
mm08 = load_track('mm08-the-falling-tile')

CARVE = A('S2.01')                       # 1178
VO = 'a5-26a-01'                         # "i don't keep score." 1216-1263
NUDGE = CARVE + 30                       # 1208: two beats after the carve, before the V.O.
PED0 = Lend(VO) + 8                      # ~1271: the pedal from the V.O.'s end
MARK1 = M('S2.02', 'mark1')              # 1291
MARK3 = M('S2.04', 'mark3')              # 1429
SETTLE = A('S2.05')                      # 1452
WHIP = A('S3.00a')                       # 1512
assert (CARVE, SETTLE, WHIP) == (1178, 1452, 1512) and SETTLE + 60 == WHIP


def build():
    verify()
    cue = Cue(ID, CARVE, WHIP, pre=12)
    s = cue.s
    T = mm08._tweak(palette())
    T['felt'].gain_db += 3.0         # the V.O. window read -28.3 LUFS (render 2) against the -24 +-2 of s6.5
    a = cue.a
    a.ch('felt', ['F3', 'C4'], s(CARVE), 1.25, 0.33, lock=True, roll=0.006)          # the re-entry after D6
    a.n('felt_mech', 60, s(CARVE), 0.1, 0.35, lock=True)
    a.n('felt', 'G4', s(NUDGE), 3.75, 0.44, lock=True)                                  # the nudge, under the V.O.
    # the drone's F/C pedal, an octave and more above it: violas and celli sul tasto, pp, under the count and TPOOL
    rebow(a, 'vc', 'F3', s(PED0), s(MARK3) + 0.6, 0.15, seg=4.0, xf=1.0, first_att=1.6, last_rel=1.2, art='sus', lp=1100)
    rebow(a, 'vla', 'C4', s(PED0), s(MARK3) + 0.6, 0.13, seg=4.0, xf=1.0, first_att=1.8, last_rel=1.2, art='sus', lp=1300)
    a.n('felt', 'Eb4', s(MARK3), 0.9, 0.34, lock=True)                                 # the felt back on mark 3
    a.n('felt_mech', 60, s(MARK3), 0.1, 0.3, lock=True)
    a.n('felt', 'C4', s(SETTLE), 0.62, 0.26, lock=True)                                # the settle C4 -> F4
    a.n('felt', 'F4', s(SETTLE + 15), 0.62, 0.28, lock=True)
    a.n('snes_piano', 'E4', s(SETTLE + 30), 0.62, 0.26, lock=True)                     # THE REWIND (the Orb's)
    a.n('snes_piano', 'Bb3', s(SETTLE + 45), 0.62, 0.26, lock=True)
    T['felt'].pedal = [(-1.0, False), (s(CARVE) + 0.005, True), (s(PED0 + 30), False),
                       (s(MARK3) + 0.01, True), (s(SETTLE) - 0.02, False), (s(SETTLE) + 0.01, True),
                       (s(SETTLE + 30) - 0.01, False)]
    end = s(WHIP)
    cue.mutes.append((end, end + 3.0))                  # the exit: the Rewind is cut on the whip (S3's downbeat)
    for fr, lab, hit in [(CARVE, 'the carve: the felt open fifth (the re-entry after D6)', True),
                         (NUDGE, 'the nudge G4, sounding before the V.O.', True),
                         (PED0, 'the F/C pedal (the count, TPOOL: no motif)', False),
                         (MARK3, 'mark 3: the felt back (Eb4)', True), (SETTLE, 'the settle C4', True),
                         (SETTLE + 15, 'F4', True), (SETTLE + 30, 'THE REWIND: E4', True), (SETTLE + 45, 'Bb3', True),
                         (WHIP, 'EXIT: the whip (pass one\'s downbeat)', False)]:
        cue.mark(fr, lab, hit=hit)
    for lab, a0, a1 in [('26A: the carve and the V.O.', CARVE, PED0), ('the count and TPOOL: the pedal', PED0, MARK3),
                        ('mark 3, the settle, the Rewind', MARK3, WHIP)]:
        cue.section(lab, a0, a1)
    meta = base_meta(
        ID, 'That Night: The Third Mark (Ep1 Act Four v5, S2, to picture)', mm='MM-08 (26A)', family='P01 DARK ROOM',
        tone='one felt in the dark after the silence; the count held, not counted; the Orb takes the settle back',
        scenes=[f'v5 S2.01-S2.05, act {CARVE}-{WHIP}; file t = 0 = act frame {cue.f0}'],
        motifs=["the Water Line's open fifth, nudge and settle (felt)", 'THE REWIND (16-bit retrograde)'],
        motif_ids=[], key='F, open fifths, no third',
        underscore_lufs=-22.0, album_lufs=-18.0,
        vo_windows=[(s(Lon(VO)), s(Lend(VO)), '"i don\'t keep score." (the felt G4 alone)')],
        room_sfx=[dict(t0=s(CARVE), t1=end, sfx='room_drone (the dark room)')],
        sfx_slots=[dict(t=s(MARK1), sfx='orb_servo: the Orb counts (the score holds; it does not count)'),
                   dict(t=s(A('S2.03')), sfx='render_front_sweep (F4 -> F6): the TPOOL render'),
                   dict(t=s(M('S2.05', 'toast')), sfx='the toast `rewinding…`'),
                   dict(t=s(SETTLE + 33), sfx='reverse_swell_1beat (the SFX own reverse swells)')],
        audition=[f'{s(CARVE):.2f} s: the re-entry after D6 -- the felt fifth on the stroke, not a sting',
                  f'{s(NUDGE):.2f}-{s(Lend(VO)):.2f} s: the G4 under "i don\'t keep score.": still, not sad',
                  f'{s(PED0):.2f}-{s(MARK3):.2f} s: the pedal under the count and TPOOL -- air, not a drone effect',
                  f'{s(SETTLE):.2f}-{end:.2f} s: the settle and the Rewind, cut on the whip into pass one'])
    return Score(ID, cue.g, T, cue.notes, markers=cue.markers, sections=cue.sections, mutes=cue.mutes,
                 length_s=end + 0.3, tail_s=0.0, meta=meta), cue


if __name__ == '__main__':
    sc, _ = build()
    print(sc.name, len(sc.notes), 'notes', round(sc.end_s, 2), 's')
