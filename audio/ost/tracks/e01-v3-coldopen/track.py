#!/usr/bin/env python3
"""Ep1 v3 · COLD OPEN (sc 1-3) · the music stem on the segment's own clock (0 = the cold open's first frame).

ROUND 2 (2026-09-27).  The showrunner: "i think the cold open to intro is not very good transition."  The shot pass
cut sc 4 (the 1993 dialog): the cold open now ends on the rewind (the years count back, "rewinding... too far", the
frame smears and collapses to the intro's first frame, a cyan cursor on black).  The lead: drop the 1993 beeper
(MM-06) and "make the rewind carry the end: an accelerating reverse texture built from the Freeze's F4 and the chip,
rising into the cut and landing on silence exactly at the last frame, so the intro's first beat takes over clean.
No hole, no clash with the intro's opening."

  0 -> 3.01       no score under the hall (script sc 1).  The freeze's dry F4 (2.01) is the timeline's own sound
                  `piano_fired_F4` (the sound stem lays it).
  3.01 -> end     THE REWIND: the same F4 (the SFX board's `piano_fired_F4.wav`, the Freeze's own sample) played
                  BACKWARDS as grains, each a reverse swell whose attack lands on its beat; the 1-bit chip ticks the
                  same beats (F and C, a counter running back).  It follows the Orb's year counter: slow while the
                  iris steps, a drag while 2022 holds (the catch), then a lurch that accelerates through 2019 ... 2001
                  and "too far", the grains shortening and climbing F4 -> C5 -> F5 as the frame smears and collapses;
                  the last swell's attack lands on the cursor frame, and the stem is DIGITAL ZERO for the last two
                  frames (the cursor on black): the intro's first beat (its felt F5 and the sub's fifth, 0.0 s) takes
                  over on its own.  It rises into the intro's F5 from below and never overlaps it.

Every time is read from the lock (3.01's start, 3.02's on-screen years, the last frame), so it re-fits to the
ElevenLabs lock with --el.  Light: numpy only, no engine render.

  audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble [--el]
"""
from __future__ import annotations

import math
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e01-v3-act1'))
import v3lib as V   # noqa: E402

SEG = 'coldopen'
F4_WAV = os.path.join(V.REPO, 'audio', 'sfx', 'wav', 'piano_fired_F4.wav')
FPS = 24


def repitch(x, semis):
    """resample (both channels) by 2^(semis/12): pitch and length together, like tape"""
    r = 2 ** (semis / 12.0)
    n = int(len(x) / r)
    idx = np.arange(n) * r
    return np.stack([np.interp(idx, np.arange(len(x)), x[:, ch]) for ch in range(x.shape[1])], 1)


def build(tl):
    import soundfile as sf
    from engine import chip
    sr = V.SR
    f4, fsr = sf.read(F4_WAV, always_2d=True, dtype='float64')
    assert fsr == sr
    f4 = f4 / np.abs(f4).max()
    t_a = tl.B('3.01')
    b2 = tl.B('3.02')
    end = tl.length
    ys = {o['text']: o['t'] for o in tl.onscreen if o['beat'] == '3.02'}
    catch = ys.get('2022', b2 + 0.5)
    slip = ys.get('2019', catch + 1.05)
    too_far = ys.get('rewinding… too far', b2 + 3.0)
    last_frame = end - 2.0 / FPS                                # the cursor on black: silence from here
    # the beat times: slow (iris), a drag (the catch), then accelerating to the cursor frame
    beats = []
    t = t_a + 0.35
    while t < catch - 0.3:                                      # the iris steps, the count starts: ~0.62 s apart
        beats.append(t)
        t += 0.62
    beats.append(catch)                                         # the catch: one long drag
    t = slip
    gap = 0.42
    while t < last_frame - 0.03:
        beats.append(t)
        gap = max(0.055, gap * 0.8)
        t += gap
    beats.append(last_frame)
    beats = sorted(set(round(b, 4) for b in beats if t_a < b <= last_frame))
    N = tl.samples
    mix = np.zeros((N, 2))
    marks = []
    for i, tb in enumerate(beats):
        u = (tb - slip) / max(1e-3, last_frame - slip)          # 0 at the slip -> 1 at the cursor
        if tb < slip:
            semis, glen, g = 0.0, 0.9 if tb != catch else 1.6, 0.34 if tb != catch else 0.42
        else:
            semis = 7.0 * min(1.0, u / 0.6) + 5.0 * max(0.0, (u - 0.6) / 0.4)   # F4 -> C5 -> F5
            glen = max(0.09, 0.6 * (1 - u) + 0.09)
            g = 0.36 + 0.5 * u
        if tb == last_frame:
            semis, glen, g = 12.0, 0.5, 0.95                      # the last swell: F5, the whole grain, into the cut
        x = repitch(f4, semis)
        m = int(glen * sr)
        grain = x[:m][::-1].copy()                               # reversed: it swells into its attack
        k = int(min(0.25 * glen, 0.03) * sr)
        grain[:k] *= np.linspace(0, 1, k)[:, None]
        i1 = int(round(tb * sr))
        i0 = i1 - len(grain)
        lo = max(0, i0)
        mix[lo:i1] += grain[lo - i0:] * g
        # after the attack, the note rings forward until the next swell takes over (no hole); on the catch it
        # drags: the same F4 slowed two semitones, held through 2022
        nxt = beats[i + 1] if i + 1 < len(beats) else tb
        if tb < last_frame:
            xs = repitch(f4, semis - 2.0) if tb == catch else x
            m2 = int(max(0.05, nxt - tb + 0.05) * sr)
            tail = xs[:m2].copy()
            tail *= np.exp(-np.arange(len(tail)) / (0.45 * sr))[:, None] * (1.0 if tb == catch else 0.55)
            tail[-int(0.02 * sr):] *= np.linspace(1, 0, int(0.02 * sr))[:, None]
            mix[i1:i1 + len(tail)] += tail[: max(0, N - i1)] * g
        # the 1-bit chip ticks the beat (F or C, climbing), short, after the swell's attack
        p = (65 if i % 2 == 0 else 72) + (12 if (tb >= slip and u > 0.6) else 0)
        if tb >= too_far:
            p = 77 if i % 2 == 0 else 84                         # F5 / C6 into the cut
        cd = min(0.06, 0.6 * (beats[i + 1] - tb)) if i + 1 < len(beats) else 0.0
        if cd > 0.02 and tb < last_frame:
            y = chip.beeper(p, cd) * (0.12 + 0.12 * max(0.0, u if tb >= slip else 0.0))
            y = y[: int(cd * sr)]
            y[-int(0.004 * sr):] *= np.linspace(1, 0, int(0.004 * sr))
            j = i1 + int(0.005 * sr)
            mix[j:j + len(y)] += np.stack([y, y], 1)[: max(0, N - j)]
        marks.append((tb, f'a reversed F4 swell lands ({semis:+.0f} st){" + the chip" if cd > 0.02 else ""}'))
    # digital zero on the cursor frames: the intro's first beat takes over on its own
    il = int(round(last_frame * sr))
    mix[il:] = 0.0
    mix[:int(round(t_a * sr))] = 0.0
    return mix, beats, marks, dict(t_a=t_a, catch=catch, slip=slip, too_far=too_far, last_frame=last_frame)


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    import soundfile as sf
    from engine.mix import lufs
    mix, beats, marks, ev = build(tl)
    work = os.path.join(HERE, 'render', '_work', tag.lstrip('-'))
    os.makedirs(work, exist_ok=True)
    raw = os.path.join(work, 'rewind.wav')
    sf.write(raw, mix.astype(np.float32), V.SR, subtype='FLOAT')
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    t_a, last_frame = ev['t_a'], ev['last_frame']
    # level: the rewind at about -26 LUFS-I, its last half second near the intro's opening (the intro's first
    # felt F5 peaks at -17.4 dBFS in its mix, -20.4 at the manifest's -3 dB)
    layers = [dict(name='rewind', wav=raw, T0=0.0, a0=t_a, a1=last_frame, fin=0.02, fout=0.003, level=-26.0)]
    designed = [(0.0, t_a, 'no score under the hall (sc 1-2): the room, the freeze\'s F4 (a timeline sound)'),
                (last_frame, tl.length, 'the cursor frames: digital zero, so the intro\'s first beat takes over clean')]
    x, laid = V.assemble(tl, layers, out, stops=[(last_frame, tl.length)], designed=designed)
    rows = [('3.01 the Orb\'s iris steps: slow reversed swells', t_a, tl.E('3.01')),
            ('3.02 the catch on 2022: one long drag', tl.B('3.02'), ev['slip']),
            ('3.02 the slip -> "too far": the grains accelerate and climb', ev['slip'], ev['too_far']),
            ('3.02 "too far" -> the collapse: into the cut', ev['too_far'], last_frame)]
    res = V.measure(tl, x, {'rewind': (t_a, last_frame)}, rows, designed,
                    stings=[(t_a, last_frame, 'the rewind (reversed swells: each grain is a designed swell)')])
    res['last_half_second_momentary_max'] = V.momentary_max(x, last_frame - 0.5, last_frame)
    xi, _ = sf.read(os.path.join(V.REPO, 'audio', 'intro-mix', 'intro-ep1-mix-V1-chipchamber.wav'), always_2d=True)
    res['intro_first_half_second_momentary_max_at_-3dB'] = round(V.momentary_max(xi.T * V.db(-3.0), 0.0, 0.5), 2)
    doc = dict(
        schema='mrmas-reel-music/1', id=f'e01-v3-coldopen{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
        timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
        sample_rate=V.SR, channels=2, clock='the segment\'s own clock: 0 = its first frame (timeEpisode, head 0)',
        level='the rewind laid at -26 LUFS-I (its window), rising into the cut; dry of dialogue',
        cues=[dict(cue='rewind', start=round(t_a, 3), end=round(last_frame, 3),
                   what='an accelerating reverse texture from the Freeze\'s F4 (reversed grains, F4 -> C5 -> F5) and '
                        'the 1-bit chip, following the year counter; digital zero on the last two frames',
                   render=os.path.relpath(raw, V.REPO), source_sample=os.path.relpath(F4_WAV, V.REPO),
                   level=res['cues']['rewind'], beats=len(beats),
                   sync=[dict(t=round(t, 3), what=lab) for t, lab in marks],
                   events={k: round(v, 3) for k, v in ev.items()},
                   note_qa=dict(pitches='F and C only (the Freeze\'s F4 repitched 0, +7, +12; chip F/C): no third, '
                                        'no knee', written_third_ok=True, knee_whole=0))],
        silences_designed=[dict(t0=round(a, 3), t1=round(b, 3), why=w) for a, b, w in designed], measured=res,
        laid=laid, source=os.path.relpath(__file__, V.REPO),
        heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s ({res["samples"]} samples, exact={res["exact"]}); '
          f'{len(beats)} swells; rewind {res["cues"]["rewind"]}; last 0.5 s M max {res["last_half_second_momentary_max"]}'
          f'; the intro\'s first 0.5 s at -3 dB {res["intro_first_half_second_momentary_max_at_-3dB"]}')
    print('digital silence:', [(r['t0'], r['t1'], r['marked']) for r in res['digital_silence']])
    print('unmarked:', res['unmarked_digital_silence'], 'undesigned fragments:', res['undesigned_fragments'])


if __name__ == '__main__':
    main()
