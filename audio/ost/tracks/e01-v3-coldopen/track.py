#!/usr/bin/env python3
"""Ep1 v3 · COLD OPEN (sc 1-4) · the music stem on the segment's own clock (0 = the cold open's first frame).

Brief (v3-score-a, 2026-09-27): "its v2 stem still lines up (see lock.md). Keep it unless the lock changed its
timing; if it did, re-fit it."  The lock changed one thing: a 0.5 s black beat (1.00) in front of 1.01.  After it,
every frame is v2's.  So this is v2's music, re-fitted by reading the lock, not re-composed:

  0 -> 3.01         no score under the hall (script sc 1: "No score under the hall").  The freeze's dry F4
                    ("MM-14 Freeze F4", 2.01) is the timeline's own sound `piano_fired_F4`, laid by the sound stem
                    as in v2: this stem leaves it alone (one owner per sound).
  3.01 -> the end   MM-06 "Beeper, 1993" underscore master from its file 0.0 (movement I, the 1-bit flat line),
                    faded in over 0.3 s under the F4's decay, as v2's coldopen_bed.py laid it; it carries the Orb's
                    rewind and the 1993 dialog, and the smash to the main titles cuts it (3 ms, on the last frame).

Level: v2's.  coldopen_bed.py set MM-06 so its first 12 s read -26 LUFS against the hall (-38/-41), the banquet
(-29) and the rewind; this stem keeps that relation.  (+6 dB would put it on the house -20 underscore reference.)

The same command re-fits it to any variant of the lock (the ElevenLabs-timed one: --el), because the only sync
point is the start of beat 3.01, read from the timeline.

  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble [--el]
    (light: no engine render; it reads MM-06's existing underscore master)
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e01-v3-act1'))
import v3lib as V   # noqa: E402

SEG = 'coldopen'
MM06 = os.path.join(V.OST, 'tracks', 'mm06-beeper-1993-sample-chip-2008', 'render',
                    'mm06-beeper-1993-sample-chip-2008-underscore.wav')


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    t_mm06 = tl.B('3.01')
    import soundfile as sf
    import numpy as np
    from engine.mix import lufs
    x, sr = sf.read(MM06, always_2d=True, dtype='float64')
    g06 = -26.0 - lufs(x[: 12 * sr].T)                 # v2: MM-06's first 12 s at -26 LUFS
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers = [dict(name='mm06', wav=MM06, T0=t_mm06, a0=t_mm06, a1=tl.length, fin=0.3, fout=0.003,
                   gain_db=g06)]
    designed = [(0.0, t_mm06, 'no score under the hall (sc 1-2): the room, the freeze\'s F4 (a timeline sound)')]
    mix, laid = V.assemble(tl, layers, out, designed=designed)
    rows = [('3.01 the Orb\'s iris steps (MM-06 fades in)', tl.B('3.01'), tl.E('3.01')),
            ('3.02 the room scrubs back (the rewind)', tl.B('3.02'), tl.E('3.02')),
            ('4.01-4.02 1993: the dialog, the toast; the smash cuts it', tl.B('4.01'), tl.length)]
    res = V.measure(tl, mix, {'mm06': (t_mm06, tl.length)}, rows, designed)
    f4 = [s['t'] for s in tl.sounds if s['name'] == 'piano_fired_F4']
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-coldopen{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='v2\'s: MM-06 at -26 LUFS over its first 12 s (the v2 bed\'s relation to the hall); dry of dialogue',
        cues=[dict(cue='MM-06 Beeper, 1993 (underscore master, movement I)', start=round(t_mm06, 3),
                   end=round(tl.length, 3), what='the Orb\'s rewind and the 1993 dialog; in 0.3 s under the F4\'s '
                   'decay; a 3 ms cut on the smash to the main titles', render=os.path.relpath(MM06, V.REPO),
                   file_in_s=0.0, gain_db=round(g06, 2), level=res['cues']['mm06'],
                   engine_qa=dict(knee_whole=0, f_major_ok=True, note='MM-06\'s own cue sheet (unchanged file)'))],
        sync=[dict(t=round(t, 3), what='the freeze: piano_fired_F4 (MM-14 "Freeze F4"), a timeline sound: the sound '
                   'stem lays it, this stem enters under its decay') for t in f4]
        + [dict(t=round(t_mm06, 3), what='MM-06 in (0.3 s fade) on 3.01, the Orb\'s iris')],
        silences_designed=[dict(t0=a, t1=b, why=w) for a, b, w in designed], measured=res, laid=laid,
        source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s ({res["samples"]} samples, exact='
          f'{res["exact"]}); MM-06 from {t_mm06:.3f} s at {g06:+.2f} dB; LUFS {res["cues"]["mm06"]}')
    print('digital silence:', res['digital_silence'])
    print('undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
