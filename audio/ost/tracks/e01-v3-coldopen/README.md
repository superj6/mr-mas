# e01-v3-coldopen · Ep1 v3 cold open (sc 1–3) · the music stem

**Composer X (`v3-score-a`), 2026-09-27; round 2.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md). **Nothing here has been listened to.** Every number is measured.

**What changed (round 2).** The showrunner: "i think the cold open to intro is not very good transition." The shot pass cut sc 4 (the 1993 dialog), so the cold open now ends on the rewind: the years count back, "rewinding… too far", and the frame smears and collapses to the intro's first frame, a cyan cursor on black. The lead's brief: drop the 1993 beeper (MM-06) and **let the rewind carry the end**, with an accelerating reverse texture built from the Freeze's F4 and the chip, rising into the cut and **landing on silence exactly at the last frame**, so the intro's first beat takes over clean.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **26.667 s, 1,280,000 samples (640 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **26.042 s, 1,250,000 samples (625 frames), exact.** |
| `render/_work/rewind.wav`, `render/_work/el/rewind.wav` | The rewind before the lay-in (git-ignored). |
| `cues.json`, `cues-el.json` | The cue sheet: every swell's time, the events it follows, the silences, the measurements. |
| `track.py` | The source (numpy only, no engine render). Shared helpers: `../e01-v3-act1/v3lib.py`. |

## What plays

Kokoro-lock seconds. Every time is read from the lock: 3.01's start, 3.02's on-screen years and the last frame.

| s | What |
|---|---|
| 0 → 20.17 | **No score under the hall** (script sc 1), designed and marked. The freeze's dry F4 (2.01) is the timeline's own sound `piano_fired_F4`, laid by the sound stem. |
| 20.17 → 22.67 | **The rewind begins.** As the Orb's iris steps and the count starts, the same F4 (the SFX board's `piano_fired_F4.wav`, the Freeze's own sample) plays **backwards** as grains. Each is a reverse swell whose attack lands on its beat and rings forward into the next, about 0.62 s apart. The 1-bit chip ticks each beat (F, C). |
| 22.67 → 23.72 | **The catch on 2022**: one long drag. The F4 lands, then rings forward slowed two semitones, like tape held back. |
| 23.72 → 25.17 | **The slip**: the swells accelerate (the gap shrinks by a fifth each time) and climb F4 → C5 as the years run 2019 … 2001. |
| 25.17 → 26.58 | **"rewinding… too far" → the smear → the collapse**: the grains shorten and climb to F5, with the chip on F5/C6. The last swell (F5, a whole grain) lands its attack **on the cursor frame**. |
| 26.58 → 26.67 | **Digital zero for the last two frames** (the cursor on black). The intro's first beat takes over on its own: its felt F5 and chip glint at f0, and the sub's F–C fifth fading in. The rewind rises into the intro's F5 from below and never overlaps it. |

**Pitch content:** F and C only (the Freeze's F4 repitched 0, +7 and +12 semitones; the chip on F and C). No third, and nothing of the knee.

## Measured

| | Kokoro | EL |
|---|---|---|
| Length | 26.6667 s, exact | 26.0417 s, exact |
| The rewind (20.17 → 26.58) LUFS-I · ST p95 · true peak | −26.0 · −25.6 · −13.4 dBTP | the same shape (it follows the EL lock's years) |
| The last 0.5 s, momentary max | −23.2 LUFS-M | −23.2 |
| The intro's first 0.5 s (V1 mix at the manifest's −3 dB), momentary max | −30.4 LUFS-M (a quiet felt F5 and the drone fading in) | — |
| Digital silence | 0 → 20.17 (marked) and the last two frames (0.083 s, designed) | 0 → 19.54 (marked) and the last two frames |
| Holes, fragments | none | none |

- The rewind ends about 7 LU above the intro's opening moment. It's a swell into a cut to black, then the intro's quiet first beat, a reset rather than a hand-over at one level. If the ear wants them closer, lower `level` in `track.py` (−26 LUFS-I now).
- The sound stem's own rewind (the hall run backwards, "the rewind whirr accelerates from the slip into the collapse and cuts with the picture") plays with it. This is the pitched layer and that one is noise, so they shouldn't mask each other; that needs an ear.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble          # the Kokoro lock
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble --el     # the ElevenLabs lock
```

Light (numpy, a few seconds). `--timeline PATH` or `V3_TIMELINE=` takes any other variant of the lock.

## For an ear

1. 20.2–22.7 s: the reversed F4 swells under the Orb's count: a rewind, not a gimmick.
2. 22.7–23.7 s: the drag on 2022: does it groan with the picture's catch?
3. 23.7–26.6 s: the acceleration and the climb into the cut: exciting, then gone.
4. The cut: the two frames of silence, then the intro's felt F5. Clean, or a gap?

**Round 1 (history):** v2's MM-06 "Beeper, 1993" from 3.01 to the end at v2's −26 LUFS, carrying the 1993 dialog. That scene is cut now.
