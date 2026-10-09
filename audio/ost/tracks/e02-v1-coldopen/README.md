# e02-v1-coldopen · Ep2 v1 cold open (sc 1) · E02-01 THE MAMMOTH

**The score pass, 2026-10-09.** One cue, `e02-01-the-mammoth`, laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-coldopen.json`, 1,320 frames, 55.00 s) with the `e02-v1-common` engine (composer X's `v3lib`). **Nothing here has been listened to.** Every number below is measured [M]; the musical calls are judged [J]; the "For an ear" list says what only a person can check.

**The brief:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-01. SET-PIECE SWING, low, with only a chip lead (the Build's) and never the full band. Wonder, then suspense, then a comic jolt. "Thins to a bass pedal on the first THUD (outside) and holds it through the doors." The out: "the knee's first four notes on dry piano … the first on the complaint's THUD, the fourth on the SMASH TO INTRO." The mood map ([proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 1 and "The feeling curve") runs: awe, then a laugh (the chair); suspense (the thuds, the misdirect); a jolt and a bigger laugh (`!!!`); a small question (the flyer).

## The render

| | |
|---|---|
| `render/music-el.wav` | **55.000 s, 2,640,000 samples (1,320 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored. md5 `d6a6e6c5…` |
| Level | −20.04 LUFS-I (the engine's underscore master, −20); true peak −3.15 dBTP; short-term p95 −17.6, max −16.5 |
| `check.py` (the v35check copy) | `coldopen 1320 f 55.000 s exact=True −20.04 LUFS-I −3.15 dBTP \| silence 0 holes 0 frag 0 \| 12 dB steps 0 unmarked 0 \| F-major True rule12 True knee 0/0 \| PASS` |
| Engine QA | no warnings. F-major (written and spectral) ok; rule 12 ok (no A-natural anywhere); knee whole 0, completions 0; 11 of 11 hit marks have an onset within 10 ms (worst 7.7 ms); sub under the lobby's rack hum −18.5 dB (limit −18) |
| Music runs | one run, 0 → 55.0 s: no digital silence, no hole under −60 dBFS, no fragment |
| `cues-el.json` | The cue sheet: every sync mark, the lock's events, the sections (with the pedal's `duck_db`), the measurements and the engine QA. It names the timeline it was laid to |

The Kokoro lock (`show/reel/ep02-v1/`) has the same timing (the EL retime changed 0 beats), so `--render` without `--el` would give the same notes. It wasn't rendered, because the film is the EL lock.

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = the cold open's first frame; 55.0 = the cut to the intro). The 96 BPM grid is anchored on the smash, so bar 23 of this cue is the intro's f0.

| s | Cue | What plays | Why |
|---|---|---|---|
| 0 → 10.0 | **1 · the clip** (D-flat lydian) | Brushes in slow circles (a foot hi-hat on 2 and 4, very soft). The upright's two-feel on a D-flat pedal (Db–Ab, then Db–Eb, then C–G into the turn). A high felt chord once a bar: Dbmaj9(♯11), Eb(add9)/Db, then C7sus4(♭9♭13). **One bowed-vibes line** (G5 → E♭5 → D♭5) runs over all of it and ends at 9.2 s, as the foot breaks the bezel. The lay fades it in over 0.8 s. Under Selbeep (3.6–9.6) the felt is softer and nothing leads | **Awe.** The mammoth is near-photoreal inside the bezel, so the cue has no chip yet. The bowed vibes are "too smooth for this building", a colour rather than a pad. The felt sits above the voice's band. "In under the clip": the room's votive tick and rack hum are the arrival, and the music swells in under them |
| 9.375 | the chip enters | **Gerg's Build, compile pass 1 (4 notes)** on the beat before the step-out, on the last syllable of "sentence" | The foot breaks the bezel (9.2) and it "becomes ours": the chip arrives with the pixel. The leap's contrast is in the sound too (P12) |
| 10.0 → 19.8 | **2 · the step-out** (F minor) | The swing walks: upright and pizz walking quarters, a feathered ride, and sparse quartal felt on 1 and the swung and-of-2. The Build's chip lead (25% duty, straight 16ths, a pizz on each group's first note) plays **pass 2 (8 notes) on the downbeat, 0.29 s before the cut to 1.03**, then **pass 3 (12 notes) through Gerg's "Which sentence?"**, and gives way to Selbeep. Harmony: Fm11 two spans, D♭(♯11) under the melting chair, then the peak C7(♯9♭13) | **The laugh, scored straight.** The product (Gerg's build) compiles as the mammoth steps out: machine-straight 16ths over a human swing. Thin under Selbeep (the lead out, comping ×0.6). The chair's three drips are SFX, so no hit lands on them |
| 19.79 | the push | Fm9 on the swung and-of-4, **0.21 s before the cut to 1.05**. The felt's pedal holds it | Pre-lap. The swing carries into the punchline shot |
| 20.3 → 21.3 | "Directionally." | The ride and bass thin (kit ×0.75), and no new chord | No comic scoring on the punchline (OST rule 1) |
| 21.29 → 23.54 | **3 · THE HOLD** | On the freeze the band stops its time. The felt's Fm9 rings on the pedal, and an arco bass F2 swells in (0.45 s attack) under the card. `freeze_hit_F` (the SFX) owns the beat | **"The cue thins or holds"** (OST rule 1): a held breath under the 2-tone freeze card, not a stop. The held chord contains the F the freeze hit is tuned to |
| 23.54 | re-entry | A♭maj9 and a bass A♭2 on a swung push, **0.21 s before the cut to 1.06** | Two weeks later: a chromatic-mediant step (F → A♭, P11's "chromatic mediants between phrases"), with a clear re-entry after the hold |
| 23.5 → 26.81 | **4 · two weeks later** (A-flat) | Brushes (sweep and taps). The bass walks E♭ A♭ G G♭, falling into the pedal. **The Build's WHOLE pass, in A-flat** (Ep1's odometer colour) from 25.0, which **stops dead on THUD 1** at its 12th note | The build has compiled 4, 8, 12 and now plays whole. The first THUD interrupts it: the cut-off is the show's comic tool, on a story beat (the misdirect starts) |
| 26.81 → 45.03 | **5 · the bass pedal** (C) | An arco bass C2 from THUD 1 (0.55 s attack, so the thud keeps its own transient). **THUD 2 (33.11):** a tremolo cello C3 swells in. **Gerg's line (33.5–36.5):** the Build compiles under it, soft (4, then 8, then 12, cut off). **THUD 3 (37.31):** tremolo viola G3 + D♭4 swell in: an open fifth with a flat nine, no third. **The doors (37.71):** the Build stops dead, and the pedal holds through the complaint's entry and page one, dry | **Suspense by layers**, one per thud, with no note on any thud (they are SFX, "tuned to the bass pedal": C). Gerg doesn't look up, so his motif keeps compiling until the doors. The `!!!` laugh gets no scoring. C is the dominant, so the complaint's landing is the resolution |
| 45.025 | **6 · the out**, note 1 | **F2, dry felt piano** (no room, no hall), on the complaint's THUD, with a sub F1 under it: the cue's one 808 sub-thud. The pedal lets go on the THUD | "The first on the complaint's THUD." The jolt resolves C → F |
| 45.1 → 54.8 | the resolved pedal | A soft arco F2 (its own track, 6 dB under the pedal) swells in after the THUD and lets go on note 4 | The dry piano decays fast. Without a bed the out fell to −40 LUFS-M between notes, then jumped +28 dB on note 3: S3 (a continuous bed) and S9 (soft entries) |
| 47.29 | note 2 | **F3** (+ the chip's F4, duty 0.5) on a swung and, 0.17 s before the cut to 1.12 (DOT's spare 0, the head shake) | The flat line, each note a register up, the chip's duty narrowing each time ("vary the register and chip duty on every note; never even beeps") |
| 52.50 | note 3 | **F4** (+ the chip's F5, duty 0.25) on the beat, 0.21 s before the cut to 1.13 (the flyer's doorway; the Orb's iris at 53.1) | The second sign's laugh (50.2) sits in the held F3, with no hit |
| 54.79 | note 4 | **F5** (+ the chip's F6, duty 0.125: the intro's own cursor glint) on a swung and, **0.21 s before the smash**; cut hard (5 ms) on the last frame | "The fourth on the SMASH TO INTRO", cut on the smash. The intro's first felt F5 ping lands on the next bar line of the same grid, so the line runs F2 · F3 · F4 · F5 \| F5 F5 F5 F5 G A♭ C F: the cold open's flat line climbs into the main title's |

**Pitch content:** F minor and its colours (D♭ lydian, A♭, the C pedal with G and D♭). **No A-natural anywhere** [M: rule 12 ok, 0 written-third events, 0 grazes]. The knee appears only as its cells: the Build (the flat-line pair and the kink) and the out's flat line, 4 notes [M: knee whole 0, completions 0, any key, any register].

## The sync points (all read from the lock; the cue re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| `mammoth_step_pixel` (1.02): the foot through the bezel | 9.20 | the bowed vibes end; the chip's pickup starts on the next beat (9.375) |
| the cut to 1.03 (the step-out) | 10.29 | the step-out's change on the latest beat at least 0.15 s before it (10.0) |
| Gerg's "Which sentence?" | 12.10 | the Build plays through it (his own line) |
| Selbeep's lines | 3.57, 13.13, 20.28 | thin: no lead, softer comping and kit |
| the cut to 1.05; `freeze_hit_F` | 20.00; 21.29 | the push (19.79); the hold from the freeze |
| the cut to 1.06 | 23.75 | the re-entry push (23.54) |
| `hand_truck_step` ×3 (THUDs 1–3) | 26.81, 33.11, 37.31 | the Build cut off (THUD 1); a layer swells in after each, never on it |
| `door_bang_open` | 37.71 | the Build stops dead; the pedal holds |
| `paper_stack_fall` (the last THUD) | 45.025 | the knee's note 1 (designed hit) |
| the cuts to 1.12, 1.13; the segment's end | 47.46, 52.71, 55.00 | the knee's notes 2–4, each the latest beat or swung and at least 0.15 s before its cut |

**Re-timing [M]:** dry runs on two scratch copies of the lock with scenes re-timed (1.04 +0.7 s, 1.07 +1.2 s, 1.12 −0.4 s; then 1.02 +0.9 s, 1.06 −0.6 s, 1.10 +1.3 s) re-laid every mark to the new events. In both, notes 1–4 kept their roles and note 4 stayed a swung and before the smash's bar line; note QA stayed clean (written third ok, knee 0/0). That pass found and fixed one fault: a shifted grid put the step-out's bar line 1.3 s before its cut, with the pickup after it. Phrase 2 now runs in four-beat spans from the step-out's own beat. On this lock the note list is identical before and after the fix (262 notes) [M].

## Measured

| Section | s | LUFS-I | True peak | Balance: piano · orch · chip (engine, rhythm excluded) |
|---|---|---|---|---|
| 1 the clip | 0 → 10.0 | −20.4 | −5.7 | 40 · 31 · 29 |
| 2 the step-out | 10.0 → 19.8 | −18.4 | −3.2 | 56 · 8 · 36 |
| 3 the hold | 19.8 → 23.5 | −19.2 | −3.2 | 47 · 53 · 0 |
| 4 two weeks later | 23.5 → 26.8 | −16.8 | −4.4 | 71 · 6 · 23 |
| 5 the pedal | 26.8 → 45.0 | −22.3 | −7.7 | 0 · 78 · 22 |
| 6 the out | 45.0 → 55.0 | −21.9 | −4.2 | 91 · 7 · 1 |
| **whole** | 0 → 55.0 | **−20.04** | **−3.15** | **46 · 35 · 19** (big band 0: the full band never plays) |

- **Momentary peaks (LUFS-M, 0.5 s windows)** [M]: the entry −26 (it swells in); the step-out downbeat −14.1; the re-entry −14.3; the knee's notes −14.3, −17.6, −14.6, −19.2. The pedal rises −29 → −19 from THUD 1 to the THUD. The out's maximum is −14.2, and the outs guide is −14.
- **Into the intro** [M]: the last 0.5 s peaks at −19.2 LUFS-M. The intro's first 0.5 s (V1's mix at the manifest's −3 dB; read from `audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`, whose music the Ep2 variant keeps) peaks at −30.4. That is an 11 LU drop on the smash: the dry F5 is cut, and the intro's quiet felt F5 continues the line. Ep1's cold open handed over 7 LU above the intro. This one is a smash cut by design, so the drop is larger [J; ear check 5].
- **Mood shares** (by time) [M/J]: wonder 18% (0–10), comic and giddy swing 27% (10–21.3, 23.5–26.8), the held breath 4%, suspense 33% (the pedal), the quiet question 18% (the out). Suspense stays a minority (S2).
- **The dialogue pocket** [M]: thinned under every line, plus the engine master's 2.5 kHz pocket (−2 dB). The mixer ducks E02-01 9 dB under speech. `cues-el.json` → `sections` asks for **5 dB under the pedal** (26.8–45.0): it is already the thinned bed, and 9 dB under Selbeep's O.S. line would leave the room alone (`mix_episode.py` reads a section's `duck_db`).

## Judgement calls (rules bent on purpose, one line each)

1. **"The fourth on the SMASH"** lands 0.21 s before the cut (a swung push), not on the cut frame. A note can't start in the intro's chapter. One frame before the cut would flam with the intro's own f0 felt F5. As a push, it is heard as belonging to the smash's downbeat, and the cut chops its ring ("cut on the smash").
2. **The out has a soft F pedal under the "dry piano"** (6 dB under the C pedal). Without it the out had 4 s near −40 LUFS-M and a +28 dB jump on note 3 (S3, S9). The piano itself stays dry.
3. **"Chip lead only"** is read as: the only lead is the chip. The pedal's colour is arco and tremolo strings (the hybrid orchestra), and the clip has a bowed-vibes line. No other instrument plays a melody, and no brass or full band plays.
4. **Peaks at −14.1 / −14.3 LUFS-M** on the step-out downbeat and the re-entry sit on P11's set-piece peak guide (−14), on purpose: they are the cue's two downbeats on picture.

## For the other passes

- **SFX:** tune `hand_truck_step` ×3 to **C** (the pedal is C2 bowed, C3 tremolo). The score never doubles a thud. `paper_stack_fall` carries the knee's F (a dry F2 and a sub F1), so leave its low end to F. `freeze_hit_F` stays on F (the hold is Fm9).
- **Mix:** the pedal section's `duck_db` 5 (above). There is no head fade on the cold open: the cue fades itself in over 0.8 s. The hard stop at 55.0 is the design (the smash); a ring-out file isn't needed, because the intro's first ping continues the line.
- **Picture (optional):** the Build stops dead on the door bang (37.71). If the shot pass has Gerg look up, the doors are the frame for it.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --dry --el          # the lock's runs, the marks, note QA
MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --render --el
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-coldopen/track.py --assemble --el     # re-lay render/_work/el, measure
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                       # the segment checks (PASS)
```

The render takes about 20 s through `heavy.sh`. After any re-lock, re-render: every sync point comes from the lock (S5).

## For an ear, in order

1. 0–10 s: wonder, not a pad: do the bowed vibes over the high felt and the two-feel read as "too smooth for this building"? Is the absence of chip noticeable before the foot breaks the bezel?
2. 9.4–19.8 s: the Build compiling as the mammoth steps out. It should be playful and the show's own: never lounge (the felt is sparse and the chip leads, at 36% of the section), never Nintendo.
3. 21.3–23.5 s: the hold on the freeze card: a held breath, not a joke sting.
4. 25–26.8 s: the whole A-flat pass cut dead by THUD 1: a cut-off, not a glitch. Then the pedal: does the suspense grow by layers without ever doubling a thud?
5. 45–55 s: the knee on dry piano, a register up each time, into the intro's own F5. Does it read as one line across the cut, and does the 11 LU drop read as a smash rather than a dropout?

## Rules checked

[M] measured, [J] judged.
- **S1:** the knee's cells, the chip (19%), the Build leitmotif, the hybrid orchestra pedal, jazz colour (walking bass, ride, quartal felt, swung pushes), no third. No lounge cheer: the comping is sparse and the chip leads. No generic pads: the one sustained colour is bowed vibes [M balance / J].
- **S2:** suspense is 33% of the cue [J].
- **S3:** one continuous run, 0 holes, 0 fragments, 0 unmarked silences, and holds instead of stops [M].
- **S5:** every layer is anchored to the lock's events, and re-timed locks re-lay [M].
- **S9:** laid to the lock's frames; the designed hits are marked (`designed_hit`: the knee's notes 1 and 4); soft entries [M].
- **OST rules:** 1 (no comic scoring), 4 (the knee never whole) and 12 (no A-natural) [M]; the 96 BPM grid, aligned with the intro's [M].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2`, one at a time; 9 renders of about 20 s each [M].
- **R1:** Ep1 untouched: only Ep2 files were written. The Ep1 intro mix was read, never written.
- **R8:** nothing heard.
- **Broken on purpose:** the four calls above.

**Resource ask (R16, non-blocking):** one human listen of the five points above, with the SFX laid (the thuds' pitch against the pedal is the main unknown).
