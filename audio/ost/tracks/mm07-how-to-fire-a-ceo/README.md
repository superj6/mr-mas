# MM-07 · "How to Fire a CEO Who Owns Nothing." (THE PLAN)

**Composer A (batch 1); fix pass 1 by composer B, 2026-09-26 · OST-BIBLE §5.A1 · palette P14 BLUEPRINT (with P01 DARK ROOM for sc 24).**
Nobody has listened to this track. Every level, timing and pitch below was set by measurement. The last section lists what a human has to hear first.

**Tone.** THE PLAN is the show's own voice: accurate, cheerful and precise. It draws itself one label per beat, and it always breaks.
- The music is a small **drafting machine in F dorian**: quartal harmony, diatonic fourths under the line, and never an A♮. It plays straight, with 0 ms of humanisation.
- It plays the explanation completely straight. The joke is where it **stops**: the waltz dies under a stamp, the line never reaches step 4, and the tape runs down into the JOIN click.
- Nothing in it winks.

## Fix pass 1 (2026-09-26): what changed

- **PLAN-SHORT and PLAN-MICRO are their own files now**: `render/mm07-how-to-fire-a-ceo-plan-short-*` (12 bars, 30.0 s, with its DIAGRAM loop) and `render/mm07-how-to-fire-a-ceo-plan-micro-*` (8 bars, 20.0 s). Each has album and underscore WAV + MP3, stems, MIDI, piano roll and cue sheet. They are written by the same functions as the suite's bars 21–32 and 33–40 (`build_template()`), on their own grid (bar 1 = 0.0 s, the stamp slot on b1.1), and mastered to the suite's targets (featured −16 underscore, −14 album). They are the generic PLANs for Eps 2–12. The suite still contains them too.
- **The tape-stop alternates have MP3s** beside every WAV in `render/alt/` (for auditioning; deliver the WAVs). They butt onto the picture cue at b16.1 = 42.500 s (frame 1020), as the editor corrected.
- **Re-rendered on the fixed engine** (the corrected meter, the sample tuning, the new render pool, the QA checks 5a–5d). The harp, the clarinet and all the pizzicato now play tuned samples, so the Blueprint's harp and pizz, Step Four's clarinet and PLAN-MICRO's clarinet sit a few cents (up to about 40 for the pizz) closer to their written pitches. The harp clamp and the short-`cl` workaround are kept: they already play the tuned `mf` harp and the `cl` sustains.
- **The picture cue `e01-s25-the-plan` keeps its timing** (it was not re-timed to the Act Four lock v3).
- The batch-1 master MP3s (and the alternates) are in `render/_pre-fix1/`.
- **QA:** no written A♮ anywhere; whole knee 0; knee completion 0; the suite's DIAGRAM loop and PLAN-SHORT's own loop are seamless; PLAN-SHORT and PLAN-MICRO have no warnings. The picture cue and the suite carry **one F-major spectral flag each, in THE BREAK** (below).

## What is in `render/`

| File | What |
|---|---|
| `e01-s25-the-plan-*` | **The Ep1 picture cue.** It covers E01-S24 plus E01-S25, 12:31:00–13:21:00: 20 bars, 50.000 s, 1200 frames.<br>File 0 s is sc 24's first frame. **Bar numbers match the bible:** P1 is bar −1, P2 is bar 0, and the blueprint is bars 1–18.<br>Contents: album and underscore WAV/MP3, 6 stems, MIDI, piano roll and cue sheet. |
| `alt/e01-s25-the-plan-tapestop-b17-{1,2,4}-*-from-b16.wav` | **Tape-stop alternates** (§5.A1: "the stop's start on each beat of bar 17"). The main render starts the stop on b17.3, where the animatic kit tears the sheet.<br>Each file starts at **b16.1 = 42.500 s** of the cue (frame 1020; corrected by the music editor from 32.5 s). Butt it onto the main render at that frame.<br>Before the splice, the alternates match the main render to between −40 and −75 dB. |
| `mm07-how-to-fire-a-ceo-*` | **The album and library suite**, 40 bars, 100 s: bars 1–20 are the picture cue, bars 21–32 are **PLAN-SHORT** and bars 33–40 are **PLAN-MICRO**.<br>It has the same deliverables, plus the **loop**. |
| `mm07-how-to-fire-a-ceo-loop*.wav/.mp3` | PLAN-SHORT's DIAGRAM, suite bars 23–27 (55.0–67.5 s): **12.5 s, exactly 300 frames**, seamless, with its tail and a ×3 preview. |
| `mm07-how-to-fire-a-ceo-plan-short-*` | **PLAN-SHORT on its own** (fix 1): 12 bars, 30.0 s; stamp slot b1.1; ticks at 20.0, 21.25, 22.5; the tape reaches zero at 28.75; digital silence to 30.0. With its own DIAGRAM loop (bars 3–7, 5.0–17.5 s, 300 frames, seamless), stems and cue sheet. |
| `mm07-how-to-fire-a-ceo-plan-micro-*` | **PLAN-MICRO on its own** (fix 1): 8 bars, 20.0 s; stamp slot b1.1; ticks at 12.5, 13.75, 15.0; the tape reaches zero at 20.0. Stems and cue sheet; no loop. |

**Rebuilding:**
- `python track.py` renders everything: the picture cue, the suite, PLAN-SHORT, PLAN-MICRO and the alternates (`--only picture|suite|templates|alts` for one of them).
- `python ../../build.py mm07-how-to-fire-a-ceo` renders the suite only.

**Conforming to picture.** Every sync point lives in the `CUE` dict at the top of `track.py`. Edit the dict to conform. Never stretch the audio.

## Palette

| Role | Voices | Levels (measured) |
|---|---|---|
| Lead: the Blueprint | Chip "music box": a 25 % pulse with a plucked, stepped decay | chip 47 % |
| Colour | Celesta an octave up. In PLAN-SHORT it becomes flute staccato; in PLAN-MICRO, short clarinet. | |
| The fourths below | A second chip triangle | |
| Pulse | Straight-eighth viola pizzicato on varied pitches (never one pitch) | |
| Roots | Contrabass pizzicato and the chip triangle bass | |
| Pad | Quartal strings, sul tasto (low-passed, flat, no swells) | orch 52 % |
| Harp | Doubles the line; eighths in the PLAN section | |
| Pencil | Wood-click ticks, soft | |
| Step Four | Low clarinet over pizzicato fifths | |
| sc 24 only | His felt upright, swung, with the 50 % chip square on the nudge only | piano 1 % |

- **Balance** for the picture cue is **1 · 52 · 0 · 47** (piano · orch · big band · chip). THE PLAN's target is 0 · 50 · 0 · 50. The suite reads 1 · 48 · 0 · 52.
- **No brass. No piano after sc 24. No swing in THE PLAN.**

## Motifs, as written

- **The Water Line, bar 1** (sc 24, felt, swung): F4 F4 F4 G4–F4 | C4, then nothing.
  - **The settle never comes.** The C4 and the D♭maj7 hang until the cut at b1.1, which kills the tails too.
- **The Blueprint** (§2.15):
  - WORD: F4 G4 A♭4 B♭4 C5, answered B♭4 A♭4 G4 F4.
  - Labels: one note per label.
  - Ticks: F – G – A♭.
  - The matcher finds it 8 times in the picture cue and 12 in the suite.
- **The knee-cell waltz** (3/4 on the 96 beat; 4 waltz bars in 3 picture bars):

  | Waltz bar | Melody | Harmony | On screen |
  |---|---|---|---|
  | 1 | F F F | Fm | the chairs appear, three per beat |
  | 2 | F G A♭ | D♭maj7 | DIRE stands on the G, NOVIHS on the A♭ |
  | 3 | C | C7sus | DRUH stands on the C |
  | 4 | **nothing** | Fm (the bass arrives home, the tune doesn't) | the empty chair |

  - The flat line's four Fs each get a different chip duty.
  - The **whole knee appears 0 times**.
- **Step Four**, first statement: B♭m(add9) – A♭(add9) – G♭maj7 – *F bass alone*, in quarters, in parallel fifths. The blank is planted.
- **The break:** the line's last 2 beats (G A♭, steps 2 and 3) loop like a jammed mechanism, identical every time, then the tape runs down. Each version jams over a different root:

  | Version | Jams over |
  |---|---|
  | Ep1 | F |
  | PLAN-SHORT | C |
  | PLAN-MICRO | B♭ |

## Form: the picture cue (`e01-s25-the-plan`, 12:31:00 + file time)

| Bars | File time | Section | Sync |
|---|---|---|---|
| P1–P2 | 0.00–5.00 | sc 24 · DARK ROOM | The Water Line bar 1 · the C4 at 2.50 · the chip nudge at 1.88 · nothing below C3 (the crane truck is SFX) |
| b1 | 5.00–6.25 | **The cut, then the stamp** | 5.00: the felt is cut, tails and all; digital silence while the grid draws · **5.625: the SFX `rubber_stamp_C`** (the kit puts it on beat 2) · 6.25: the score enters |
| b1.3–b3 | 6.25–12.50 | WORD | The Blueprint line, pulse, roots, quartal pad (F – G – B♭ – C) |
| b4–b6 | 12.50–20.00 | **The chip waltz** | Waltz bars at 12.50, 14.375, 16.25 and 18.125 (+0, +45, +90, +135 frames) |
| b7.1 | **20.00** | **The waltz stops dead** | Digital zero for one beat (the SFX stamp LEFT EARLIER IN 2023); the Blueprint resumes at 20.625 |
| b8 | 22.50–25.00 | THESE FOUR VOTE | Step Four in quarters; **24.375: the F bass alone** |
| b9–b10 | 25.00–30.00 | The structure | One note per label (NONPROFIT, CONTROLS, COMPANY, the banner, the key ring, the CEO box) · 28.75: a rest for the SFX stamp EQUITY: 0 · 29.375: the moth (one celesta flutter, pp) |
| b11–b13.2 | 30.00–36.25 | PLAN | Harp eighths draw the path · **ticks at 32.50, 33.75 and 35.00** (F, G, A♭, each with a pencil tick) · **the line stops at 36.25** |
| b13.3–b15 | 36.25–42.50 | "Step four." / "Good question." | One held quartal chord, pp, flat: **−19.8 LUFS**, 4 dB under THE PLAN |
| b16–b17.2 | 42.50–46.25 | BREAK | The stuck G–A♭ loop (the chalk is SFX) |
| b17.3–b18.3 | **46.25–48.75** | Tape-stop | Starts on the tear; the tape **reaches zero exactly on the JOIN click, 48.750 s (frame 1170)** |
| b18.3–b19 | 48.75–50.00 | Silence | Digital zero; MM-08 enters at 50.00 = 13:21:00 |

## Form: the suite (`mm07-how-to-fire-a-ceo`)

| Suite bars | Time | What |
|---|---|---|
| 1–20 | 0–50 s | The picture cue, as above |
| 21–22 | 50.0–55.0 | **PLAN-SHORT** WORD: an SFX stamp slot on b21.1, then F G A♭ B♭ \| C |
| 23–27 | 55.0–67.5 | **PLAN-SHORT** DIAGRAM: 20 labels, one per beat. Its harmony walks F – G – C – D (the dorian brightness) – G. **This is the loop.** |
| 28–30 | 67.5–75.0 | **PLAN-SHORT** PLAN: ticks at 70.0, 71.25 and 72.5; the line stops at 73.75; the title's own stack (C F B♭ E♭) held pp |
| 31–32 | 75.0–80.0 | **PLAN-SHORT** BREAK: stuck over C; the tape-stop from 76.25 reaches zero at 78.75 |
| 33 | 80.0–82.5 | **PLAN-MICRO** WORD: a stamp slot, then F G A♭ |
| 34–36 | 82.5–90.0 | **PLAN-MICRO** DIAGRAM (12 labels) |
| 37–39 | 90.0–97.5 | **PLAN-MICRO** PLAN: ticks at 92.5, 93.75 and 95.0; the hold at 96.25 |
| 40 | 97.5–100.0 | **PLAN-MICRO** BREAK: stuck over B♭; the tape reaches zero at 100.0 |

PLAN-SHORT (12 bars, 2·5·3·2) and PLAN-MICRO (8 bars, 1·3·3·1) are **generic templates for Eps 2–12**. Each episode re-voices them for its concept.

**Loops and edit points.**
- The DIAGRAM loop runs 55.0–67.5 s. Its seam measures seamless, and loop-verify gives −45.9 dB overall. That residual is a long harp tail; every other family is at −118 dB or lower.
- **To lengthen a diagram,** repeat the loop, at most 2 passes (§6.6).
- **Every section starts on a bar line with an attack,** so it can be cut there.

## QA (measured on the renders; §6.9)

| Check | Picture cue | Suite |
|---|---|---|
| Underscore / album | −16.02 / −14.02 LUFS; −3.15 / −1.15 dBTP | −16.01 / −14.01; −3.15 / −1.15 |
| Short-term p95 (the engine's fixed meter) | −14.2 (limit −13) | −14.5 |
| sc 24 · the held chord · THE PLAN body | −22.9 · −19.8 · −15.6 LUFS (targets −22 · −20 · −16) | — |
| Hits (every cue point with an attack) | all within −9.3 … +2.7 ms | all within −9.3 … +2.7 ms |
| Hard stops and silences | −240 dBFS (the cut, the waltz stop, after the JOIN) | −240 / −200 dBFS |
| Written third (every note boundary) | none | none |
| F-major check, spectral | 5 windows in THE BREAK (the tape-stop's glide and the viola pizz body; see above) | the same 5 windows |
| Whole knee · knee completion (pitch class) | 0 · 0 | 0 · 0 |
| Stems vs underscore | −162.7 dB | −162.7 dB |
| 2–6 kHz · centroid | −18.4 dB · 456 Hz | −18.9 dB · 449 Hz |
| PLAN-SHORT / PLAN-MICRO (own files) | −16.04 / −16.02 underscore; −14.0 / −14.02 album; p95 −15.0 / −15.0; no warnings; SHORT's loop seamless, verify −53.5 dB (the harp's tail) | |

**Batch 1's false p95 warning is gone:** the engine's fixed meter now reads −14.2 (picture) and −14.5 (suite), as the editor measured.

**The F-major flag in THE BREAK (fix 1's new trace).** Both the picture cue and the suite flag 5 windows, 43.1–48.7 s, where the F bass is soft (6–23 % of the pitched energy):
- **43.1 s (the stuck loop):** strings at 217–224 Hz. It is a fixed peak of the viola pizzicato (the pulse's F3 C4 B♭3), the same under every note: the pizz body, not a pitch.
- **46.25–48.7 s:** chip and perc at 109–112 Hz and 214–226 Hz. This is **the tape-stop**: every stem slides down in pitch to zero at the JOIN click, so each note sweeps through A. The trace only knows written bends, so it calls the sweep a resonance.
Nothing is written on A. **Listen:** the tape-stop should sound like the plan breaking, and nothing in the break like F major.

## Findings that affect every composer (handed to the engine owner)

**Fixed by the engine owner in fix 2 (2026-09-26):** all three findings below. Every harp, `cl`, `cl_stac` and pizz sample is now tuned (within 5 cents), and the harp never stretches a sample more than 4 semitones. The workarounds in this track are kept because they are equivalent.

1. **The harp's `mp` layer is a single sample, `KSHarp_G1_mp.wav`, and it is out of tune.**
   - Any harp note below vel 0.40 is stretched from it, by up to 44 semitones and about **110 cents flat**. That is audibly the wrong note: F4 sounds near E4.
   - Notes at vel 0.34–0.39 land on it 25 % of the time.
   - The `f` layer (vel ≥ 0.67) is only E1, D7 and F7, so it has the same problem.
   - **My workaround:** these tracks keep the harp at vel 0.42–0.62 and set its level with gain.
2. **Cello pizzicato F2** is stretched from an E1 sample, and its inharmonic partials read as an A over F. This track uses contrabass pizzicato for the roots instead.
3. **`cl_stac` F4 and G4** come from an F3 sample that is 28–44 cents flat. PLAN-MICRO plays short `cl` sustains instead.

## Deviations from the brief, and why

- **The stamp is on b1.2, and the score enters on b1.3.**
  - The animatic kit on its real clock (`studio/src/episodes/ep01/act4/kits/plan.ts`) lands the stamp on beat 2. The bible had it on b1.1.
  - To conform, edit `CUE['stamp']` and `CUE['enter']`. The WORD line refits itself.
- **The kit places the four rings (THESE FOUR VOTE) in bar 7 and the structure in bars 8–9, with a hold in bar 10.**
  - The bible places the waltz stop and a breath in bar 7, Step Four in bar 8 and the labels in bars 9–10. **This cue follows the bible.**
  - Ask of the sc 25 builder: shift 25.02's rings and 25.03's structure by one bar. 25.03's own hold absorbs it.
  - The kit's LEFT EARLIER stamp sits at frame 352 of sc 25, 8 frames before the waltz's dead stop at frame 360 (b7.1). Please move it onto b7.1.
- **The kit's tick frames are off the grid** (sc 25 frames 642, 682 and 722). This cue ticks on b12.1, b12.3 and b13.1 (frames 660, 690 and 720), as in the bible.
- **The JOIN click is on b18.3,** per the kit's shot 25.08 ("the click on beat 3"). The tape-stop runs from the tear (b17.3) to the click: 2.5 s.
- **There is no `bass` stem.** The roots are contrabass pizzicato, which lands in `strings`, plus the chip triangle, which lands in `chip`.

## What a human must audition (in this order)

1. **20.00 s:** does the waltz stopping dead under the stamp land as the joke, and not as a glitch or as cute?
2. **12.5–20.0 s:** is it a music box, small and sweet, and never a circus or a toy? Does waltz bar 4 (18.13 s) read as the empty chair?
3. **46.25–48.75 s:** does the stuck loop and then the tape-stop read as **the plan failing**, rather than a playback fault? Is a 2.5 s run-down too long? If so, try the `b17-4` alternate.
4. **0–5 s:** is the felt his (calm, small), with the chip nudge a glint and not a beep? Is the cut at 5.00 clean?
5. **36.25–42.5 s:** with the two lines read over it, does the held chord sit under the dialogue without any movement or swell?
6. **Suite:** do three tape-stops in one album track tire the ear? For the album, consider ending the album sequence after PLAN-SHORT.
7. **Fix 1's tuning:** the harp and the pizz are now in tune. Does the music box sound more precise, or colder? (Compare with `render/_pre-fix1/`.)
8. **THE BREAK (43–48.75 s):** does anything there sound like F major? The analysis flags the tape-stop's glide and the viola pizz body.
9. **PLAN-SHORT and PLAN-MICRO on their own:** do they start cleanly after the stamp slot and stop dead on the tape?
