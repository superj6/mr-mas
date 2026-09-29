# MR. MAS story reels: temp bed (key: `reel`)

This folder holds a temp music bed for each rough-outline reel. There is one WAV per episode, cut to the picture the studio generator renders from `show/reel/epNN.json`. Each bed has these parts:

- a sting from the V1 main title over the 3 s title card;
- a quiet, evolving piano-and-chip pad under the beats;
- a soft tick on every beat change;
- brass or chip accents on the set-pieces and cards;
- 1-bit beeper texture under the flashbacks;
- a glass shimmer under the GLYPH beats.

It is a temp bed. It is not score. Its job is to make a 2–3 minute story preview sit together and read as the show. **None of these beds has been listened to.** Every level below comes from measurement, so audition before you rely on it.

## Deliverables

| File | What |
|---|---|
| `epNN.wav` | The bed for `show/reel/epNN.json`. 48 kHz, 24-bit, stereo. It is exactly as long as the reel picture: `frames × 2000` samples. |
| `qa/epNN.json` | Everything about one build:<br>• the length (frames, samples, and `sum_reelDur_plus_title_s` for comparison);<br>• the loudness (bed short-term median / p5 / p95, each accent's momentary max, true peak);<br>• the chord at every change;<br>• every accent, with its source;<br>• the flashback, GLYPH and intro regions;<br>• the layer gains;<br>• `inputs_hash` (what the rebuild check compares). |
| `qa/summary.json` | The last `build_all.py` run: what was built, what failed, and one row per reel. |
| `preview/epNN.mp4` | Written only with `--mux`, and only where the generator has rendered `out/season/reels/epNN.mp4`. The picture stream is copied untouched, and this bed is added as AAC 192 kb/s. |
| `reelbed.py` | The renderer: one reel JSON in, one WAV and one QA JSON out. |
| `build_all.py` | The batch builder. Re-runnable, and incremental. |

## How to re-run

Use the audio venv, from the project root:

```sh
audio/.venv/bin/python audio/reel/build_all.py            # every show/reel/epNN.json; rebuilds only what changed
audio/.venv/bin/python audio/reel/build_all.py ep04 ep07  # just these reels
audio/.venv/bin/python audio/reel/build_all.py --force    # rebuild everything
audio/.venv/bin/python audio/reel/build_all.py --mux      # also make preview/epNN.mp4 wherever out/season/reels/epNN.mp4 exists
audio/.venv/bin/python audio/reel/build_all.py --all      # also reel JSONs that aren't epNN (e.g. ep01-full-part1)
audio/.venv/bin/python audio/reel/reelbed.py show/reel/ep03.json -o /tmp/ep03.wav   # one reel, anywhere
```

**When a reel is rebuilt:** only when its JSON, `reelbed.py` or the two V1 files it samples have changed. The check is a content hash stored in `qa/epNN.json`, not a file date.

**Speed and memory:** a reel of about 3 minutes takes about 1–2 minutes to render and needs about 1.7 GB of memory. By default the builder runs three at a time; use `--jobs 1` on a busy machine. Reels over 400 s run one at a time after the others. The 1:1 full-episode animatic `ep01-full-part1` runs about 10 minutes, so plan on about 6 GB of memory for it. It is left out unless you pass `--all` or name it.

**Output is deterministic.** The same JSON and code give the same WAV. The random seed comes from the episode number and the file key.

## Timing contract

The bed follows the picture's clock, not a sum of seconds. `reelbed.load_reel` mirrors `studio/src/reel/schema.ts`:

- It reads the file the way `normalizeEpisode` does:
  - the same kind, act and style aliases;
  - `reelDur`, then `dur`, then `duration`;
  - a missing or ≤ 0 duration becomes 3 s, and every duration is clamped to 0.5–120 s;
  - bad JSON becomes a 4 s error card.
- It times the beats the way `timeEpisode` does:
  - the 72-frame (3.000 s) title card comes first;
  - each beat ends at `72 + Math.round(Σ reelDur × 24)`;
  - every beat gets at least one frame.
- **Checked:** the ep01 bed is 4224 frames (176.000 s). That is the frame count of the generator's `out/season/reels/ep01.mp4`.

When every `reelDur` is a whole number of frames, the length equals Σ `reelDur` + 3 s. Otherwise the frame rounding wins, and the QA file shows both numbers.

**Using the bed in the reel composition:** start `epNN.wav` at frame 0. It ends on the reel's last frame, with a fade over the last beat (at most 2 s) and a 30 ms de-click to digital zero.

## What plays when

| Reel event | Sound | Source | Level |
|---|---|---|---|
| **Title card** (0–3 s) | **V1 bar 9, the roll call** (f478–540): the knee (F F F F G A♭ C F) in eight stabs, with stab 8 ringing on the open fifth. f480 lands at 0.125 s. It is cut before the skyline (f540), and a little extra hall carries the ring past the cut. | `theme/theme-V1-chipchamber.wav` (the locked main title) | accent |
| **Every beat** | **The pad.** It has these layers:<br>• **Felt upright piano** (the theme's UprightPianoKW SF2 with `felt_post`, the same EQ as the theme's felt). It plays a rootless jazz voicing, rolled, over the root, and pedals it through the chord. Sparse, soft high "glints" from the chord's upper tones keep it moving.<br>• **Chip pad:** two band-limited pulse voices a 10th apart, with a slow duty sweep, a slow breath LFO and delayed vibrato, low-passed at 1.8 kHz.<br>• **From ACT TWO:** a quiet NES triangle on the root, and a sparse swung 12.5 % chip arpeggio on the theme's 96 BPM grid, through the theme's sample-chip echo (144 ms). It gets busier in ACT THREE and ACT FOUR.<br>• **In the TAG:** the chip plays the knee once, softly. | `theme/engine` (chip, sampler, synth, hall/room IRs) | bed |
| **Beat change** | A soft chip "tk" (a triangle blip with a breath of noise). An **act change** gets a double tick, like a page turn. | synthesized | bed, −22 dBFS peak |
| **`setpiece`** | **The V1 brass-stem card stab** in the chord the pad moves to on that beat: f240 Fm11, f300 D♭maj9♯11 or f360 B♭m9, in rotation. A chip lead doubles the stab's top two voices an octave up, 6 LU under the brass, with a triangle root.<br>• **A key set-piece** (`reelDur` ≥ 6 s) gets the **f414 trumpet rip into the f420 C7♯9♭13 shout**. The rip leads the cut by 6 frames, and the next chord change resolves to Fm.<br>• **A set-piece that follows a set-piece** gets a chip-only stab in the current chord, so a run of set-pieces doesn't become a run of brass. | `theme/stems/V1-brass.wav` + chip | accent |
| **`card`** | The same stab, through the theme's sample-chip (SNES) filter and thinned, like the theme's accent #1, with the chip 4 LU under it. | V1 brass + chip | accent |
| **`flashback`**, and any **`1-BIT`** beat | A **1-bit beeper texture**: 16ths at 96 BPM arpeggiating the current chord, with a root blip every beat as a "second channel". It is a 22.254 kHz beeper with no dynamics, only on and off. The arpeggio drops out under it. | `engine.chip.beeper` | bed |
| **`GLYPH`** beats, or `fx: glyph-dissolve` | A **glass shimmer**: tiny high sine pings on the chord's tones, in the hall. | `engine.synth.shimmer` | bed |
| **`intro`** (the 30 s main-title stand-in) | **The V1 title section** from f630: horn swell, the chip arpeggio F–B♭–E♭–F into F6, and the celesta at f660. It is cut to the beat with a fade, and runs at most 3.75 s, to the cue's end. The bed moves to the same title chord (F9sus4) and ducks −12 dB under it. It comes back as the excerpt fades. | V1 master | accent |

**Harmony.** The bed stays in the theme's world: F minor, with the theme's card-hit voicings (`theme/score/common.py HITS`) plus A♭maj9, E♭9sus4, Gø and D♭6/9♯11.

- **When the chord changes:** only on a beat change. Each act opens on its home chord:

  | Act | Home chord |
  |---|---|
  | COLD OPEN | Fm9 |
  | ACT ONE | Fm11 |
  | ACT TWO | D♭maj9♯11 |
  | ACT THREE | B♭m9 |
  | ACT FOUR | Fm9 |

  Inside an act, a chord moves on after 4–6 s. The minimum shortens as the acts go on.
- **Accents:** on an accent beat the pad moves to the stab's chord, so every sampled hit is in tune with the bed.
- **The last beat:** it lands on the title chord, F9sus4, which has no third, unless that beat carries a brass stab.
- **Intro beats:** the bed also sits on F9sus4 under the V1 title excerpt, which uses the same voicing (`TITLE` in `common.py`).
- **Eps 10–12 (`speculative: true`):** the progressions are more open and quartal, with fewer resolutions, and there is more shimmer. The piano gets a slight tape wow, and the chip pad is darker and a little detuned.

## Levels

Loudness is BS.1770-4 K-weighting with the standard's 48 kHz coefficients. It is implemented in `reelbed.py`, because `audio/.venv` has no pyloudnorm.

| Part | Target | How |
|---|---|---|
| **Bed** (pad + textures + ticks) | **−20 LUFS short-term (3 s)** | Each layer is first set to a relative loudness (`LAYER_LUFS`). The piano gets a slow 3:1 RMS squash, so the pedalled chords read as a pad and not as a solo.<br>A slow leveller then rides the whole bed so its 3 s short-term sits at −20. It uses a centred window that averages only the steady parts (not the head, an intro duck or the tail), smoothed over 1.5 s.<br>The bed dips −3 dB under each accent: 30 ms in, 0.45 s hold, 0.85 s out. |
| **Accents** (sting, stabs, intro excerpt) | **−14 LUFS momentary max (400 ms)**, each measured on its own | Each accent is normalised alone, then capped at −3 dBTP. |
| **Mix** | ≤ −1 dBTP | A safety look-ahead true-peak limiter, which should have nothing to do. The QA file reports its gain reduction and lists every place it had to act (`limiter_events`). |

### Measured (2026-09-25 build, all 12 reels)

Bed short-term is the 3 s trailing meter on the bed alone. It excludes the title card, 3.5 s after each intro excerpt, and the last 2.2 s. Accent M is the momentary max of each accent on its own, after its cap.

| Reel | Length | Beats | Bed ST median [p5, p95] | Accents | Accent M (min..max) | Mix true peak |
|---|---|---|---|---|---|---|
| ep01 | 176.00 s (4224 fr) | 45 | -20.0 [-20.5, -19.5] LUFS | 11 | -14.5..-14.0 LUFS | -1.4 dBTP |
| ep02 | 176.50 s (4236 fr) | 45 | -20.0 [-20.4, -19.6] LUFS | 15 | -14.2..-14.0 LUFS | -1.4 dBTP |
| ep03 | 174.00 s (4176 fr) | 42 | -20.0 [-20.4, -19.6] LUFS | 14 | -14.2..-14.0 LUFS | -1.4 dBTP |
| ep04 | 173.50 s (4164 fr) | 44 | -20.0 [-20.4, -19.6] LUFS | 8 | -14.1..-14.0 LUFS | -1.3 dBTP |
| ep05 | 172.00 s (4128 fr) | 45 | -20.0 [-20.4, -19.5] LUFS | 8 | -14.2..-14.0 LUFS | -1.6 dBTP |
| ep06 | 172.50 s (4140 fr) | 44 | -20.0 [-20.4, -19.6] LUFS | 9 | -14.1..-14.0 LUFS | -1.4 dBTP |
| ep07 | 172.00 s (4128 fr) | 44 | -20.0 [-20.4, -19.6] LUFS | 10 | -14.1..-14.0 LUFS | -1.5 dBTP |
| ep08 | 172.50 s (4140 fr) | 44 | -20.0 [-20.4, -19.6] LUFS | 7 | -14.1..-14.0 LUFS | -1.6 dBTP |
| ep09 | 174.00 s (4176 fr) | 44 | -20.0 [-20.4, -19.6] LUFS | 11 | -14.2..-14.0 LUFS | -1.5 dBTP |
| ep10 | 174.00 s (4176 fr) | 42 | -20.0 [-20.4, -19.5] LUFS | 10 | -14.1..-14.0 LUFS | -1.9 dBTP |
| ep11 | 168.00 s (4032 fr) | 44 | -20.0 [-20.5, -19.5] LUFS | 14 | -14.5..-14.0 LUFS | -1.0 dBTP |
| ep12 | 176.00 s (4224 fr) | 43 | -20.0 [-20.4, -19.6] LUFS | 7 | -14.1..-14.0 LUFS | -1.9 dBTP |

- **Length:** every WAV is exactly `frames × 2000` samples, and equals Σ `reelDur` + 3 s for all 12 current reels.
- **Limiter:** the safety limiter acted once, on ep11 at 26.03 s, for −0.24 dB lasting 0.1 ms. It did nothing on the other eleven reels.
- **Accents below −14:** the few accents that read −14.5 are chip stabs the −3 dBTP cap trimmed.
- **Disk:** about 50 MB per WAV.

## Knobs

These are the constants at the top of `reelbed.py`:

- **Levels:** `BED_ST`, `ACCENT_M`, `TICK_PEAK`, `ACCENT_TP`, `INTRO_DUCK`.
- **The balance inside the bed:** `LAYER_LUFS`.
- **How busy each act is:** `ACT_DENS` sets the glint gap, the arpeggio probability and whether the triangle bass plays.
- **Harmonic rhythm:** `ACT_MIN`.
- **Chords:** the chord vocabulary is `CHORDS`, the progressions are `MOVES` and `MOVES_SPEC`, and each act's opening chord is `ACT_HOME`.
- **The shout threshold:** `BIG_SETPIECE_S`.

The rebuild check hashes `reelbed.py`, so any change there rebuilds every reel on the next run.

## Limits and open items

- **Not auditioned.** In particular, check these:
  - the tick level against the piano re-strikes;
  - the cut at the end of the title sting;
  - the density of the ACT FOUR arpeggio.
- **There is no dialogue, VO or SFX.** The reel shows its lines as captions. If temp VO is added later, the bed will need ducking under it, which it doesn't do now.
- **The flashback beeper's register:** it is fixed at C5–C6. Only 1-BIT and flashback beats get it; EARLY-WEB16, TERMINAL, LEDGER and 2-TONE get nothing extra.
- **The V2–V4 alternates aren't used.** V4 "Piano Pixels", suggested for quieter episodes, would be an easy swap for the title sting: `V1_MASTER`.
