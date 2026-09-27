# Ep1 v3: rooms, SFX and the final mix (`v3-sound`, 2026-09-27)

> **Status: MIXED, both variants, all six segments and the card, with every score render in place** (Kokoro: all six; ElevenLabs: all six). Tracks A2 (rooms and SFX stems) and A3 (the mix) of [PLAN.md](PLAN.md), under the showrunner's "just do a full episode attempt with your best judgement".
>
> **Nothing here was heard.** Every number below is measured from the files. I also looked at envelope plots of the stems and mixes around the moments listed in §5. Whether a room sounds like its room, whether the keys read as Gerg, and whether any cut plays all need an ear.
> Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The mixes** (Kokoro) | `out/ep01/full-v3/mix/<seg>-mix.wav` for `coldopen act1 act2 act3 act4 tag`, plus `card-mix.wav` (the 2 s filename card). 48 kHz / 24-bit stereo, each exactly its segment's frames × 2000 samples. Git-ignored. |
| **The mixes** (ElevenLabs) | `out/ep01/full-v3/mix-el/<seg>-mix.wav`, on the EL-timed timelines' own clock |
| The stems (Kokoro) | `audio/reel/ep01-v3/<seg>-room.wav`, `<seg>-sfx.wav` (48 kHz / 24-bit, git-ignored), `<seg>-stems-qa.json`, `stems-inputs.json` (the fingerprint) |
| The stems (EL) | `audio/reel/ep01-v3/el/<seg>-room.flac`, `-sfx.flac`. FLAC, lossless: the disk was at 2.7 GB free when they were first built, and FLAC is 3× (rooms) to 9× (SFX) smaller |
| The QA and the report | `audio/reel/ep01-v3/mix-qa/<variant>/<seg>-mix-qa.json`, **`loudness-report.json`** |
| The code | `audio/reel/ep01-v3/stems.py` (A2), `audio/reel/ep01-v3/mix_episode.py` (A3). Each docstring is the full spec. |

## 1. How to re-run

One command per variant, from the repo root:

```sh
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all                  # Kokoro
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --variant el     # ElevenLabs
```

- **It runs itself through `ops/heavy.sh`** (`--no-heavy` skips that). It takes about 4–5 minutes per variant on this laptop, with the stems rebuilt when needed (about 1.5 min of that).
- **It rebuilds the stems only when an input changed.** The inputs are:
  - the six timelines;
  - the beat plans;
  - stems.py itself and the v2 stem modules it borrows from;
  - the SFX manifest;
  - **what the scores claim** (§2.3).

  A new score render, a new take or a re-timed lock is picked up by the same command.
- **Some segments only:** `mix_episode.py act3 tag [--variant el]`. The dialogue guard and the seam ramps then take the other segments' gains from the last full run's report.
- **Checks:** `--no-score` mixes without the scores, a check that the rooms and SFX alone leave no holes. `--rebuild-stems` forces the stems.
- **Where the scores are read from:**
  - Kokoro: `audio/ost/tracks/e01-v3-<seg>/render/music.wav`, with `cues.json` beside it or one level up.
  - EL: `render/music-el.wav` with `cues-el.json`. It also accepts `e01-v3-el-<seg>/render/music.wav` or `render/el/music.wav`.
  - A segment with no render mixes without a score and says `score MISSING`.

## 2. The layers

### 2.1 Rooms (the room stem)

**How it's built:**
- One bed per beat `room`, on one continuous clock for the card and Acts One to the tag (they play back to back). The cold open is built on its own, since the intro video follows it.
- **A new room leads the cut:** it rises (equal power) over the last 0.6 s of the outgoing shot, or over the plan's sound J-cut. The old room trails 0.4 s, or 0.2 s into a black.
- **J-cut leads, from the plans:**
  - 5.01 ← the card: 0.6 s
  - 9.01: 0.8 s (the lobby pre-lapped under his exit)
  - 11.01: 0.8 s
  - 13.01 and 18.01: under the act break's black (capped at the black's length)
  - 15.01: 1.0 s, under the clone's voice over black
  - 17.01: 0.6 s
  - S3.00a: 0.6 s
  - S3.06: 0.8 s
  - S4.09: 0.5 s
  - S5.02: 1.0 s
  - S7.01: 0.8 s
  - S7.05: 0.6 s
  - 32.01 ← Act Four: 0.6 s
- **L-cuts:** 13.14 (the room's air, 1.0 s) and the coda into the tag (0.6 s, the crossfade the script asks for).
- **Levels:** about −36 to −41 LUFS per recipe. Each is then lifted (up to 6 dB) until the 5th percentile of its 50 ms windows reaches −40 dBFS on the louder channel. Every room's level and lift is in its `-stems-qa.json`. Measured whole-stem levels: Kokoro room stems −35.2 (cold open) to −38.2 LUFS.
- **Rooms dip 2 dB under speech** in the mix (the sample's figure).

**Recipes:**

| Where | Room |
|---|---|
| Cold open | **the hall:** room tone −38 and a polite crowd −41, under the 0.5 s black.<br>**The banquet's applause** −29, swelling 6 dB after "forward", cut on the freeze.<br>**The freeze hum:** 120–700 Hz, −39, stepping 0/−4/−9/−16 dB with the rewind.<br>**The rewind:** reversed like tape, its speed following the Orb's counter.<br>**A 1993 PC's fan** under the flashback (new: without the score, v2 had a 5.5 s hole there).<br>These are coldopen_bed.py's recipes on the v3 clock. The hall and banquet carry 8 dB of the lock mixer's duck under the takes, baked into the stem, since they were built for it. |
| Act One | **the bullpen:** server hum −37 and one buzzing tube −49; duller and louder in the basement beats.<br>**The phone POV** (sc 8): the bullpen, plus Elgoog's lobby through his phone's speaker.<br>**The NopeAI lobby:** room tone and far steps on stone.<br>**The split:** the bullpen, plus the lighthouse's wind in the right pane.<br>**A standing desk in the dark.** |
| Act Two | **The White House:** HVAC, the mantel clock.<br>**The bullpen through glass.**<br>**The bay.**<br>**The Senate:** its air and a gallery that never settles.<br>**The rooftop wind.**<br>These are act2_bed.py's recipes, each with a steady air under it: their gusts and laps left lulls that read as holes.<br>The poster run (16.01) gets **a far street** (new; v2 had no room there). |
| Act Three and the tag | **The dark room:** the rack's fans −41 (low-passed), air −47, the drone −50, the cyan key's faint buzz, and **the LEDs ticking in straight eighths** (12 ms at 3.3 kHz, −39 dBFS peak).<br>The LEDs run at 96 bpm, phased so 23.01 falls on the grid, as in v2; the act3 score's bar lines sit on the same grid.<br>**The LEDs are out from 20.02 to 20.06** (the act's one quiet beat).<br>Act Three's room cuts at 23.04's black: the script's "CUT TO BLACK", where the lock's `room` said `dark`. |
| Act Four | **The suite:** its HVAC, the Strip far below, a diesel working on the circuit far off. Every piece stops on the Cancel click.<br>**Neleh's office:** a clock ticking once a second.<br>**The all-hands:** the crowd hushes −7 dB for the question, and the air stays.<br>The TPOOL flashback, the office at night, the boardroom, the split, the CCTV, the bullpen by day, the fires.<br>**The lobby at night:** the sign's neon on F from the moment it lights.<br>**The coda**, with **the vault's F hum** from S8.06, carried 1.5 s into the tag (the plan's L-cut).<br>**The dark room's drone** leads S5.02 by 1.0 s, under S4.15 (−36 LUFS on the lead, settling 10 dB into the bed). |
| The card | room tone −38, and the bullpen leading its last 0.6 s |

### 2.2 SFX (the SFX stem)

**Every beat `sound`**, at its written peak (the lock's makers: SFX-board files and the v2 modules' `synth:<kind>`).
- **Missing:** 0, in either variant.
- **J-cuts that name a beat's own sound** start lead_s before the cut:
  - 12.01's toast pop: 0.4 s
  - 12.04's pen: 0.5 s
  - 20.01's keys: 0.4 s
  - S4.01's heart gliss: 0.5 s
  - S6.01's first thock: 0.4 s
- **S4.07's four speakerphone tones** play Step Four's line, F4 E♭4 D♭4 C4, from the board's tuned keys. That's OST-BIBLE §6.8 request 1, which the act4 score's README says still stands.
- **Cold open:** the SFX keep the −10 dB the lock mixer gave the whole v2 stem under speech, so the plink sits where v2 put it.

**Added** (each listed in the stems QA's `added`, with the line that asks for it):

| Item | What was done | Measured (§5) |
|---|---|---|
| **Practice laps, far off, under S1.01** (notes §7) | Two made passes (an engine through its gears, a Doppler fall, the distance taking the top off), peaks −28 and −32 dBFS | −13.6 dB under the bed in their band (the score's felt bar is loud there): **probably faint** |
| **The Build's chip line leading 9.13 → 11.01** (notes §7) | The act1 score boots the Build on the cut: its first cell a fourth up, B♭, 16ths about 0.15 s apart, measured from the render, after 2 s of designed score silence for the laptop's close. So the pre-lap plays the cell's first four in F (F4 F4 G4 A♭4) at the same tempo and ends one 16th before the cut. The two should read as one line rising a fourth across the match cut. | +4.2 dB over the room in 300–3000 Hz; no score there |
| **The pen's scratch leading 12.04** (notes §7) | The scratch starts 0.5 s before the cut, with a first stroke under Nole's "quarter" | +16.2 dB over the bed in 3–9 kHz |
| **The dark room's drone under S4.15** (notes §7) | See §2.1 | visible in the plot: the room rises about 6 dB into S5.02 |
| **Gerg's keys loud in 20.06** (notes §7) | Typing down the call's line (350–3400 Hz) from where the beat's own `call_keys` ends, through 20.04 (−20 dBFS peak) and 20.05 (−22), **loud in 20.06 (−12, and −16 under the V.O.)**, on past the last line to the cut. Soft-saturated so they read at their peak. | +2.1 dB over the bed in 1–5 kHz, where the score's own chip Build plays |
| **Gerg's keys at 2 AM, so "His keys stop." is heard** (notes §7) | Through the monitor (250–5000 Hz):<br>• S5.09 from the click (−16);<br>• S5.06 sparse, none under his quotes or after "Scroll to the bottom." (−24);<br>• **S5.09-back typing hard (−10, −3 dB under his two thoughts)**, which **stops dead on the cut to his look (S5.09b)**, the same frame where the act4 score's Build "stops dead on his look up";<br>• one key on the cut out of S5.09b;<br>• faint keys on the small tile at the head of S5.11. | • S5.09-back: −1.9 dB against the score's Build in their band<br>• the first second of his look: no keys; the score's held pad at −45 dBFS in band |
| **The crane truck's grind and a dozen glass tings, pre-lapped under 23.04's black** (script) | The diesel grind rises under the black. The pass is loudest at S1.01 +0.5 s, and the glasses shiver across the cut. | the act3 score's sheet expects it ("the SFX pre-lap of the crane and the tings carries it") |
| **Elgoog's siren through his phone** (sc 7–8) | v2's layer on the v3 clock. **Dropped:** the act1 score plays it ("the siren's whine J-cuts in under the last puff (on his phone)") | — |
| **The anchor's too-smooth murmur** (sc 14) | v2's made formant voice through the phone, stopping for the clone's first word | — |
| **The call's waiting tone** (S3.00a J-cut) and **the all-hands hush** (S3.04b → S3.06 J-cut) | the board's ringback through a laptop band; `crowd_hush` 0.8 s before the cut | — |

### 2.3 What the scores claim (one owner per sound)

A sound the score may also play is left out of the SFX stem when the segment's cue sheet claims it. A claim is either:
- `"claims_sfx": ["<id>"]` at the top of the sheet; or
- a sync point, mark, row or cue in the sound's window that names it.

An entry that calls it "a timeline sound" or "the sound stem lays it" isn't a claim. The lead's two rulings apply whenever the segment has a score. **Dropped now:**

| Sound | Why |
|---|---|
| act2 `synth:stab` × 4 (the tour poster) | the lead's ruling; the score plays the knee stabs |
| tag `synth:button_chord` | the lead's ruling; the score plays the button with no third |
| act1's siren layer | the score: "the siren's whine … (on his phone)" |

**Kept:**
- **The cold open's freeze F4:** the score says "a timeline sound: the sound stem lays it".
- **Act Two's bell and KA-CHING:** "the bell decays alone".

**One consequence at 16.01:** the score's first stab lands on the cut. So the first stamp stays on the picture with it, instead of leading by 0.3 s (the plan's 15.18 J-cut), which would flam against the stab. The street's air leads the cut instead.

### 2.4 Dialogue, score and master (the mix)

**Dialogue:**
- Every take is laid at beatStart + t − in, dual mono at −3 dB. An interrupted line (`cut`) stops at its `dur`.
- **Small-speaker chains**, loudness-matched to the dry take and then −1 dB:
  - call: 300–3400 Hz, +3 dB at 1.7 kHz
  - monitor: 180–6500 Hz
  - laptop: 280–5500 Hz
  - phone (every line in sc 8's POV, room `phone`): 500–3400 Hz
- **How many lines take a chain:**
  - Act One: 6 phone
  - Act Three: 5 call, 6 monitor
  - Act Four: 1 laptop, 7 monitor, 1 call
- **EL:** every take (228 of 228) is levelled to its Kokoro counterpart's loudness, so the two mixes differ only in the voices.
- The EL takes' dry files are used, with the same chains, not the EL pass's device copies.

**The score:**
- Laid as delivered. **The cold open's MM-06 gets +6 dB** (the lead's ruling), onto the −20 LUFS reference.
- **Ducked under speech** with the lock mixer's envelope: 0.25 s before a line, joined across gaps under 2.5 s, 0.2 s in, 0.6 s out.
- **The duck depth follows the mood heading, smoothed over 1.5 s:**

  | Depth | Moods |
  |---|---|
  | 6 dB | launch night, "the Build thins" |
  | 7 dB | the dark room, 2 AM, the tag |
  | 8 dB | the odometer, Elgoog, the landlord, the White House, the tour, the avalanche, the return |
  | 9 dB | everything else |
  | 10 dB | the pause letter, the bridge, Vegas |

- A cue sheet's `duck_db` would override the mood depth for its window; none of the current sheets carries one.
- **−3 dB under a silent POST** when nobody speaks.
- **Act Four's Cancel click → buzz:** the score is gated to zero. It was already digital zero there: measured −inf before the gate.
- **The tag's head:** Act Four's score ends on a sounding pedal. Its release (`music-ringout.wav`, the act4 composer's hand-off) is laid at the tag's first sample and crossfades out (equal power, 2.5 s) from the tag score's first entry (0.60 s), as the lead asked.

**The master:**
- −16 LUFS integrated per segment.
- A look-ahead limiter (−1.5 dBFS ceiling) and a 4×-oversampled true-peak check under −1.0 dBTP.
- **The dialogue guard:** a segment whose dialogue would land more than 1.5 LU above the episode's median is turned down. Only the tag trips it (−1.08 dB, so it sits at −17.1 LUFS).
- **The seams:** each chapter's first 2 s ramp from the previous chapter's gain to its own, so a pedal, a room or a pre-lap crossing the seam doesn't step.
- **The card** takes Act One's gain.

## 3. The silences and stops

- **The one designed silence** runs from the Cancel click (S1.09 +2.4 s) to the phone's buzz (S1.11 +0.3 s): 3.69 s in both variants.
  - Every room goes out on the click (12 ms). Room tone only, at −50 LUFS. The rooms come back on the buzz (80 ms).
  - The click keeps its own first 60 ms, and then there's no SFX.
  - **Measured in the mix:** −48.9 LUFS, loudest 50 ms window −47.1 dBFS, in both variants.
- **Act-out blacks:** 12.07 (the bullpen cuts with the picture), 14.06 (the clone's voice over black), 17.13 (the bell's last partial) and 23.04.
  - At 23.04 THE CLOCK stops dead, the room goes out over 0.25 s, and then the crane pre-lap rises.
  - The only measured "hole" there is 0.6 s at the start of that black, and it's marked.
- **The cold open's white:** the rewind steps down to nothing at white, as in v2. With the score and the PC fan it measures no hole.

## 4. What was measured

**Loudness (the report):**

| Segment | s (Kokoro · EL) | LUFS-I | True peak | LRA | Dialogue LUFS | Gain | Score under / between speech (dBFS RMS) |
|---|---|---|---|---|---|---|---|
| cold open | 30.67 · 30.04 | −16.0 · −16.0 | −4.5 · −3.2 | 8.1 · 7.5 | −14.0 · −14.0 | +1.9 · +2.0 | (no score under its lines) / −22.8 |
| card | 2.0 | −36.1 · −36.0 | −23.9 | — | — | Act One's | — |
| Act One | 322.50 · 337.46 | −16.0 · −16.0 | −1.4 · −1.2 | 5.6 · 6.0 | −15.0 · −14.9 | +1.5 · +1.5 | −29.0 / −20.7 |
| Act Two | 204.75 · 197.21 | −16.0 · −16.0 | −2.0 · −1.7 | 7.0 · 8.5 | −15.3 · −15.1 | +0.9 · +1.1 | −30.5 / −21.8 |
| Act Three | 128.04 · 125.33 | −16.0 · −16.0 | −1.5 · −1.4 | 5.2 · 5.0 | −15.1 · −14.9 | +1.9 · +2.1 | −29.1 / −20.5 |
| Act Four | 523.79 · 542.71 | −16.0 · −16.0 | −1.6 · −1.5 | 7.1 · 7.0 | −15.1 · −15.1 | +1.1 · +1.1 | −30.3 / −21.8 |
| tag | 33.88 · 33.71 | **−17.1 · −17.0** | −1.5 · −1.4 | 11.5 · 11.7 | −13.5 · −13.4 | +3.3 · +3.7, guard −1.1 · −0.9 | −44.9 / −22.8 |
| **Episode** (story + card, back to back) | 1245.6 · 1268.5 | **−16.02 · −16.03** | | 6.6 · 6.8 | spread **1.75 · 1.68 LU** | | |

**Holes** (under −42 dBFS for 0.3 s or more, louder channel, 50 ms windows):
- **Unmarked holes: 0 in every segment, in both variants, with the score and without it.**
- The marked ones: the one silence, 23.04's black (0.6 s) and, in EL, 17.13 (0.3 s).
- The mono downmix, which reads decorrelated beds about 3 dB low (the v4 note), counts 0–9 per segment. They're in the QA.

**Level jumps over 15 dB** (between 50 ms windows):

| | Kokoro | EL |
|---|---|---|
| Count per segment | 4–58 | 7–73 |
| Most of them | rises onto a word, or falls | rises onto a word, or falls |
| Rises onto an SFX | 0–4 | 0–4 |
| Rises with no word or SFX near them | 1–8 | 1–15 |

The unexplained rises are listed by time in each QA (`rising_other`).

**Score runs:** Act Three's score is one run of 125.6 s. The cold open's "4 runs" are MM-06's own 1-bit rests.

**Seams** (the last 200 ms against the next chapter's first 200 ms; sample jumps all under 0.005):

| Seam | Step | What it is |
|---|---|---|
| card → Act One | +1.0 dB | the bullpen rising |
| Act Three → Act Four | +0.9 dB | the crane pre-lap, continuous |
| Act Four → tag | −1.1 dB (EL −0.2) | the pedal, continuous |
| **Act One → Act Two** | **+20.3 dB** | a black, then the act2 score (MM-19) and the White House on the first frame |
| **Act Two → Act Three** | **+21.1 dB** | a black, then the felt's D♭ bloom on the first frame |

The two +20 dB steps are the scores' designed act-break entries, not a mix fault, but they are hard. **They're for an ear.**

**Named moments** are in each QA's `checks`: the SFX against the bed (rooms and score) where nobody speaks, in the sound's own band, for 20.06, S5.09, S5.09-back, after the stop, the laps, the pre-lap and the pen. See §2.2 for the values.

## 5. What was looked at

**Envelope plots** of the room stem, the SFX stem, the score and the mix, with the cuts and the lines marked, for Kokoro and EL:
- 12.01 → the black;
- 9.13 → 11.01;
- 20.01 → 20.06;
- the act-out and 23.04;
- S1.01;
- the Cancel silence;
- S4.15 → S5.02;
- 2 AM (S5.09 → S5.11).

They're scratch files, not kept. **Nothing was listened to.**

## 6. Calls I made, and where I departed from the brief or the plans

1. **The keys stop on the cut to Gerg's look,** with the act4 score's Build. The alternative was stopping just after "gerg never waits to be asked."
   - The script puts "His keys stop." after that line, and then, in S5.09b, "the Build and his keys stop together". The plan's why says the line lands before the stop.
   - Stopping on the cut satisfies all three and matches the score frame for frame.
2. **Act Three's room cuts at 23.04's black** (the script's "CUT TO BLACK" and pre-lap), where the lock's `room` field says `dark`.
3. **The Build pre-lap matches the score's tempo** (100 bpm, measured) rather than the bible's 96. It's in F, where the score's boot is in B♭. If the composer would rather own it: `claims_sfx: ["build-prelap"]`.
4. **The first stamp at 16.01 stays on the picture** (§2.3).
5. **The dialogue guard (1.5 LU)** is my addition to "−16 LUFS each". The tag lands at −17.1 LUFS instead of −16 so that its voices don't sit 2.5 LU hotter than the acts'.
6. **The practice laps and the crane are in the SFX stem,** not the room stem. They're events, and that way the mix can measure them.
7. **Added layers the plans didn't list:** the far street (16.01), the PC fan (4.01–4.02), the office clock, the waiting tone, the hush, the anchor murmur and the neon. Each comes from a script SOUND line or a hole, and each is listed in `added`.
8. **The EL stems are FLAC,** for disk. The Kokoro stems stay WAV as briefed.

## 7. For an ear, in order

1. **The act breaks' first frames (Act Two, Act Three):** the score enters about 20 dB over the black. Designed, or a jolt?
2. **Gerg's keys (20.06, 2 AM):** loud enough to be Gerg, not so loud they compete with him? Then **the stop on his look:** is it heard as the change the V.O. planted?
3. **The Build's pre-lap into the match cut:** one rising line, or two passes that don't agree?
4. **The one silence:** does room tone at −49 LUFS read as the room holding its breath, or as a fault? (The script asked for digital silence; the brief says room tone.)
5. **The practice laps:** likely too faint under the score's felt bar (−13.6 dB in band). Raise the first pass's peak in stems.py (`lap`, −28 dBFS) if they're wanted audible.
6. **The LEDs' tick** (−39 dBFS peak, all through Act Three and the tag): texture, or nagging? And is its drop-out at 20.02 heard?
7. **The small-speaker chains** on sc 8, the call and the monitor lines. And EL against Kokoro at matched loudness.
8. **The tag at −17.1 LUFS,** after the guard. Is it level with the acts by ear?

## 8. Hand-offs

- **To the assembly (F):** play `<seg>-mix.wav` as each chapter's whole sound. The card has its own `card-mix.wav`. The intro and the outro keep their own masters.
- **To the composers:** a cue sheet can take a sound over (`claims_sfx`), set a duck depth (`duck_db` on a cue, row or section), or put the LED grid on its tempo (`led_grid: {bpm, t0}`). The next `mix_episode.py --all` picks it up.
