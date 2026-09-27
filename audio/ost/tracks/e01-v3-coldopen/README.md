# e01-v3-coldopen · Ep1 v3 cold open (sc 1–4) · the music stem

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md). **Nothing here has been listened to.** Every number is measured.

**What it is.** One 48 kHz / 24-bit stereo WAV on the cold open's own clock (0 = its first frame), dry of dialogue. The mixer ducks it.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **30.667 s, 1,472,000 samples (736 frames × 2000), exact**. Git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **30.042 s, 1,442,000 samples, exact**. Git-ignored. |
| `cues.json`, `cues-el.json` | The cue sheet: what plays, the sync point, the designed silence, every measurement. |
| `track.py` | The source (a lay-in, no engine render). Shared helpers: `../e01-v3-act1/v3lib.py`. |

## What plays

The brief: "its v2 stem still lines up (see lock.md). Keep it unless the lock changed its timing; if it did, re-fit it." The lock changed one thing, a 0.5 s black beat (1.00) in front of 1.01, so this is **v2's music re-fitted by reading the lock**, not re-composed (mood map: *poised, curious*, "as now").

| Kokoro s | EL s | What |
|---|---|---|
| 0 → 20.17 | 0 → 19.54 | **No score under the hall** (script sc 1). Designed and marked. The freeze's dry F4 ("MM-14 Freeze F4", 2.01) is the timeline's own sound `piano_fired_F4`: the sound stem lays it, as in v2, so this stem leaves it alone (one owner per sound). |
| 20.17 → 30.67 | 19.54 → 30.04 | **MM-06 "Beeper, 1993"**, its underscore master from file 0.0 (movement I, the 1-bit flat line), faded in over 0.3 s under the F4's decay on 3.01 (the Orb's iris). It carries the rewind and the 1993 dialog. The smash to the main titles cuts it (3 ms, on the last frame). |

**Level: v2's.** v2's `coldopen_bed.py` set MM-06 so its first 12 s read −26 LUFS against the hall (−38/−41), the banquet (−29) and the rewind, and this stem keeps that relation (gain −3.45 dB on the master). **+6 dB would put it on the house −20 underscore reference**, if the mix wants the stems level-matched instead.

## Measured

| | Kokoro | EL |
|---|---|---|
| Length | 30.6667 s, exact | 30.0417 s, exact |
| MM-06 window LUFS-I · ST p95 · true peak | −26.1 · −25.6 · −20.5 dBTP | the same file: −26.1 · −25.6 · −20.5 |
| Digital silence | 0 → 20.167 only (marked: no score under the hall) | 0 → 19.542 only (marked) |
| Fragments under 2 s | none | none |
| Knee / F-major | MM-06's own cue sheet: knee whole 0, F-major OK (the file is unchanged) | same |

- **Holes below −60 dBFS inside the scored window** (0.3–0.4 s at about 22.0, 22.9 and 25.5 s): these are the 1-bit beeper's own rests (on or off, no tails, P10 T1), the same as v2. Not a gap in the cue.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble          # the Kokoro lock
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-coldopen/track.py --assemble --el     # the ElevenLabs lock
```

Light (no engine render): it reads MM-06's existing underscore master. `--timeline PATH` or `V3_TIMELINE=` takes any other variant of the lock; the only sync point is beat 3.01's start.

## For an ear

1. 20.2 s: MM-06 fading in under the F4's decay: a hand-off, not two sounds colliding.
2. The level against the rewind SFX (v2's relation, −26): the beeper should sit under the scrub, not over it.
