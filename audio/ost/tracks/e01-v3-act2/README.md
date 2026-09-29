# e01-v3-act2 · Ep1 v3 Act Two "the regulate-me tour" (sc 13–17) · the music stem

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md), on the mood map of [v3-plan §6](../../../../show/episodes/ep01/production/stick/v3-plan.md) ("pomp and comedy"). **Nothing here has been listened to.** Every number is measured.

## v3.5 FINAL (current, 2026-09-28): the ElevenLabs-timed lock

**The final film is `show/reel/ep01-v35-el/` (the ElevenLabs cast, Mario on Kokoro).** `render/music-el.wav`: **202.000 s (4,848 frames), exact.** `v3lib` now defaults to the v3.5 locks, and `--el` is the film. The Kokoro v3.5 stem was not rendered.

**The cue sheet (EL seconds):**

| s | Cue | What plays |
|---|---|---|
| 0 → 63.2 | `wh_pomp` | Unchanged: the White House pomp, NEDIB's pen, the print. |
| 63.2 → 68.1 | — | The bridge: no score (marked). |
| 68.1 → 109.5 | `senate_a` | **In on the gavel** (v35-27.00, the clone is cut): the pizz two-feel's first downbeat is the gavel's knock (a mark), with no bowed pedal first. The rest is as v3.4: the pedal under each real line, PLEASE REGULATE ME on the mute, the stop on the wallet. |
| 109.5 → 121.4 | — | The wallet's stop (marked): the card, "i get paid enough for health insurance.", the gasp, Sucram, "…i have no equity in nopeai." |
| 121.4 → 145.7 | **`mar2019` (new)** | **MAR 2019, the company with a ceiling: admiration with a flicker of unease.** |
| 145.1 → 147.9 | `senate_b` | **MM-20's last phrase, out on the gavel:** the two-feel on the hearing's return (the glowing line sweeps back), landing on the chairman's gavel (28.05 + 1.9 s) with the F7sus(♭9) held until the first passport stamp cuts it. |
| 147.9 → 164.5 | `run_roof` | **The tour (new form): brisk fun, the stamps on the beat.** |
| 164.5 → 182.0 | `run_roof` | The statement's pad, as v3.4: A♭maj9 from the guest book, then D♭maj9(♯11), B♭m9 and C7sus(♭9) on "we'll read it." |
| 181.4 → 202.0 | `upsell` | Unchanged: the chips, the KA-CHING, and the climb off the frame (the act-out). |

**`mar2019` in detail:** his own flashback, so his felt, with Gerg's Build on the chip and a sul-tasto low-string pedal.
- It swells in out of the wallet's silence 0.3 s after "…no equity", leading the flashback's cut (a designed hit).
- On the glowing line the felt blooms A♭maj9 and the celesta draws the line, the same device as JUN 2018.
- The felt plays a chord after each of Mas's lines, never inside one. The Build compiles under Gerg's cloud-bill line.
- **The flicker:** on "the board." the pedal slips from A♭ to G under a held D♭ (the tritone). "nothing." gets an open A♭ fifth.
- **The check under the door:** Tasya's Rhodes, her chord (C E♭ G B♭) over the A♭, the landlord arriving.

**The tour in detail:**
- **The stamps:** the seven passport stamps land 0.5 s apart, so the RUN plays at 120 BPM and **every stamp is a beat**, with one knee stab per stamp (the quartal C F B♭ E♭ on brass and chip) and a layer added per stamp. The Build moves diatonically in A♭ (no A). MUNICH is the biggest, with the timpani.
- **The lectern** (his real line) plays on the held chord and the bass.
- **The posts:** the engine comes back soft under NOTERB's post and his.
- **His one-pixel smile:** the felt's nudge, G4.
- **The guest book:** the engine stops, and the last chord rings into the statement's pad.
- **A fader ride:** the stamps read −15.0 LUFS on the render, so the lay rides them −1.5 dB, to −16.5 (`stamps_ride()`).

**Measured:**
- **Levels:** −20.16 LUFS-I, −3.15 dBTP. Per cue: senate −21.1 / −20.9, `mar2019` −20.9 (the entry −17.8, the check −25.4), `run_roof` −19.0 (the stamps −16.5, featured), upsell −19.5.
- **Silence and gaps:** digital silence only in the two marked windows (the bridge, the wallet). No holes or fragments.
- **Engine checks:** F-major OK; rule 12 and the knee both 0.
- **Cut steps:** all four steps of 12 dB or more are marked (`../e01-v3-act1/v35check.py`).

**Re-run:**
```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render --el
```
The cue names are `wh senate_a senate_b run_roof upsell mar2019`.

## v3.4 (superseded by v3.5, 2026-09-28): refit to the v3.4 lock

**The locks:** `show/reel/ep01-v34/` and `-el`. **`render/music.wav`: 181.208 s (4,349 frames); `render/music-el.wav`: 170.167 s (4,084 frames); both exact.**
- **Sirrah's line (13.02) and 13.09's V.O. are cut:** the pomp follows the timeline.
- **"mine's half written." (13.13)** falls after the flash, between Nedib's lines. The Ebmaj7 pad holds under it with no attack. The door's Gm7 now only follows a V.O. that falls between the door and the flash.
- **The May 12 clip beats (14.03, 14.05) are cut:** the bridge is shorter and still has no score.
- **The act-out (17.11)** is kept as in v3.3. The Upsell is laid 0.6 dB down, because the act-out's quiet tail had lifted the cue's master; phrase 3's p95 is now −16.4 / −16.3.
- **Measured:**
  - **Levels:** −20.1 / −20.05 LUFS-I.
  - **QA checks:** F-major OK, knee 0, written A♮ over F 0, no unmarked silence, holes or fragments; every 12 dB cut step is marked.

## v3.3 (superseded by v3.4, 2026-09-28): refit, and the new act-out

**The locks:** `show/reel/ep01-v33/` and `-el`. **`render/music.wav`: 190.542 s (4,573 frames); `render/music-el.wav`: 180.833 s (4,340 frames); both exact.**
- **Timing:** "he's not wrong." (13.09) gets the felt under it, as every V.O. does. 17.10 is 0.5 s longer, and the Upsell follows the timeline.
- **THE ACT-OUT (P8; the glass, 17.12, is cut).** `act_out()` reads the picture's own timing for 17.11: the line lifts at frame 6, its head leaves the top at 40 % of the shot, its tail at 52 %, then the tilt to the empty sky.
  - The band stops on the cut to the sky with its last word: the close's F–C fifth (bari, trombone, bass) and the grand's chord with no third.
  - The climb then goes on alone with the line: vibes and chip in 16ths up the F-minor scale, **landing on the bell's own F6 as the line's head leaves the frame**. So the climb that the crack used to cut now lands, on the register's bell.
  - A high open fifth (bowed vibes F5 + C6) swells in under the landing, holds over the tilt and the empty sky, and dies in 17.13's black with the bell's tail. It reaches digital zero by the act's last frame, so Act Three's head (composer Y's; its room leads 0.6 s under the black) starts clean.
  - The old designed silence "the bell alone" is gone.
  - **Measured through 17.11 and the black** (0.4 s windows): −27 → −30 over the climb, −35.6 just after the landing, −31 to −29 under the fifth, −36.5 into the last 0.4 s, and −96 dB in the last 50 ms.
- **Every rest fades over 5 ms.**
- **Measured:**
  - **Levels:** −20.0 LUFS-I on both locks (the White House −20.0, the Senate −21.0, the run −19.0, the Upsell −19.0 with phrase 3 featured at p95 −16.0).
  - **QA checks:** F-major OK, knee 0, written A♮ over F 0, no unmarked silence, holes or fragments; every 12 dB cut step is marked.

## v3.2 (superseded by v3.3, 2026-09-28): refit to the final lock

**The locks:** `show/reel/ep01-v32/ep01-v32-act2.json` (the default) and `show/reel/ep01-v32-el/` (`--el`). **`render/music.wav`: 193.042 s (4,633 frames); `render/music-el.wav`: 183.250 s (4,398 frames); both exact.** The round-1 score stands.
- **The White House:** the V.O.s are cut (13.01, 13.09, 13.11), and Mas is already in the seat nearest the teacher. The pomp still runs from the first frame, with no new cue. The print's last B♭ still bridges the match cut (1.1 s), and the bridge is still no score.
- **The Senate, in draft 8.1's order.**
  - **Before the wallet:** the committee asks for his ask (15.10). **His ask (15.15, a real line, "…i would form a new agency…")** plays on MM-20's low-string pedal alone. Sucram's CALLED IT stamp is the SFX's.
  - **The straight mute's one rising line** (PLEASE REGULATE ME) now goes to the senators' delight (15.16), in the gap before "Would you come and run it?". Then the two-feel continues through 15.11, with "i love my current job." on the pedal.
  - **The wallet** (15.12) stops it, as before. No score through the gasp, "Health insurance.", Sucram and "…no equity" (designed, 11.8 s).
- **`senate_b` (15.14):** "MM-20 back on a new phrase; a held beat on the two of them; the tour's stamp thunks in under it." After "…i have no equity in nopeai." the pizz F and the bassoon come back on a downbeat, with the F7sus(♭9) held on the two of them (1.0 s), cut by the tour's stamp at 16.01. **If the sound pass J-cuts that stamp into 15.14** (notes §5), the hang should end on it; that's one number in `lay()`.
- **The tour poster (16.01, his own hand on the last stamp):** unchanged. There's one knee stab per stamp, and his is the last and biggest.
- **Real lines** now include the v3.1/v3.2 takes tagged `[P]`/`[V]`: the chairman's "That voice was not mine…" and his ask. Each gets the pedal only.

**Measured.**
- **Kokoro:** −20.05 LUFS-I, −3.15 dBTP.
  - the White House −20.0;
  - the Senate −21.05 / −21.0;
  - the run and the rooftop −19.0 (the RUN −16.4, featured);
  - the Upsell −19.0 (phrase 3 −16.6, featured).
- **EL:** −20.0 overall, with the same per-cue levels to ±0.1.
- **Silence:** digital silence only in the three marked windows (the bridge, the wallet, the act-out's bell). There are no holes and no fragments.
- **QA checks:** written A♮ over F 0, F-major OK, knee 0, on both locks.
- **The cut check:**
  - Every score step of 12 dB or more on a cut is a designed stop or sits within 0.8 s of a mark.
  - 15.10's −12.9 dB is the pedal letting go after his real line, now marked.


## v3.1 (superseded by v3.2, 2026-09-27): refit to the v3.1 lock

**The lock:** `show/reel/ep01-v31/ep01-v31-act2.json` (the default). **`render/music.wav`: 201.250 s, 9,660,000 samples (4,830 frames), exact.** The round-1 score, refitted:
- **The bay's new match cut:** the print in his hand becomes his phone at the bay's window (13.14 → 14.01). The Fountain Pen's last B♭ now **bridges the cut**, ringing about 1.1 s into the bridge and gone well before its first line; the bridge itself is still no score (designed).
- **The Senate:** 15.17 (the back of the sheet) and 15.18 (the stare) are cut, so the F7sus(♭9) hang goes under the dais (15.16), and the tour's first stamp cuts it at 16.01. The wallet's stop and the re-entry after "…i have no equity in nopeai." are as before.
- **The tour poster** is 5.0 s now (four stamps in it); one knee stab per stamp, as before.
- **The real lines** come from `v3lib.real_ids()` (the v3.1 lock drops their quotation marks), so the court's pedal-only windows are unchanged.

**Measured (Kokoro v3.1):** the whole stem −20.0 LUFS-I, −3.15 dBTP; the White House −20.0, the Senate −21.0 / −21.0, the run and the rooftop −19.0 (the RUN −16.4, featured), the Upsell −19.0 (phrase 3 −16.6, featured). Digital silence only in the three marked windows (the bridge, the wallet, the act-out's bell). Written A♮ over F 0, F-major OK, knee 0.

**The print's F-major fix (v3.1):** the EL render first failed the sieved F-major check at the leap (≈ 67.1 s, strings ≈ 217/226 Hz, sieved 0.29 to 0.34, where the ringing F9sus4 overlapped the B♭ chord's D). Two changes fixed it: a 221 Hz notch on viola and cello (−10 dB, Q 4), and the F9sus4 now lets go before the B♭ arrives (no 0.25 s overlap, 0.08 s release). Both locks now pass (worst sieved 0.19).

**The EL variant:** `render/music-el.wav` from `show/reel/ep01-v31-el/` (`--el`); the v3-EL render is kept as `render/music-v3-el.wav` / `cues-v3-el.json`, superseded.


| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **204.750 s, 9,828,000 samples (4,914 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **197.208 s, 9,466,000 samples, exact.** |
| `cues.json`, `cues-el.json` | The cue sheets (windows, sync points, engine QA, note QA, loudness per sub-section, silences). |
| `track.py` | The source: five cue builders and the lay-in. Shared helpers: `../e01-v3-act1/v3lib.py` (the clock, gaps, thinning, render, lay-in, measurement). |

The clock, the levels and the parametric timing work as in [Act One's README](../e01-v3-act1/README.md): 0 is the act's first frame, every sync point comes from the timeline, and each cue is the engine's underscore master, dry of dialogue.

## What plays (the cue sheet)

Kokoro-lock seconds.

| s | Cue | Mood · palette | What plays, the hits, the thinning |
|---|---|---|---|
| 0 → 74.1 | `wh_pomp` | **Pomp and comedy.** P13, NEDIB's chamber colours (MM-19 family), **B♭ major**, straight | A light chamber processional **from the first frame**: dotted-rhythm quartet figures, a pizz march bass, a harp on every second bar, soft timpani and snare taps. Its dominant is F9sus4, never F major. **The felt under both of Mas's V.O. lines** (his head inside the world's pomp). Theme fragments only in the gaps (after Sirrah's card, before the tripods); **the pan along the row (13.07) gets the whole phrase**, its held C5 on his one look at the lens. **Both freeze cards hold their chord for their beat** (no attack). **On the door (13.11) NEDIB's Fountain Pen takes over:** the march stops, the quartet turns legato, and the straight-mute trumpet plays the flat line (B♭ × 4) under "i'll turn when he finishes the sentence."; the pen hovers (held chords) under his two lines; **its leap and pen-stroke turn sign the print (13.14)**, and the final B♭ is held under "it's a good photo." and rung out by the bridge. |
| 74.1 → 85.1 | — | **The bridge: a hush** | No score (script sc 14): the phone's clip, the water, the plink. Designed and marked. |
| 85.1 → 130.3 | `senate_a` | **Procedural comedy.** A lighter Under Oath (P02 court, MM-20 family): **D♭ major over the court's F** | A bowed F pedal under the clone's real opening line; then a deadpan pizzicato two-feel (low strings, a dry bassoon on the roots), brushed snare, a viola pad, and a straight-mute aside only in a gap. **A low-string pedal only under every real line** (the chairman's card, "…tasks, not jobs.", "i love my current job."). Sucram's card holds its beat. **It stops on the wallet (15.12)**, 3 ms. |
| 130.3 → 142.1 | — | designed stop | The wallet, the moth, the gasp, "Health insurance.", the stamps, "…i have no equity in nopeai.": the room's air only (script: "It stops once, on the wallet"). |
| 142.1 → 155.8 | `senate_b` | the same, back **on a new phrase after his line** | The two-feel under the senator's question; **PLEASE REGULATE ME** gets the mute's one rising line, which ends before Sucram's stamp. On the back of the sheet the harmony is left hanging (F7sus♭9) under his stare, and the tour's first stamp cuts it. |
| 155.8 → 163.8 | `run_roof` | **The run.** P07 THE RUN (MM-03 family), **A♭ major**, a straight 16th engine | In on the stamp's thunk: the Build's chip arpeggio, brushes, bass. **One layer and one knee stab per stamp**: the title's quartal C F B♭ E♭ on brass (+ a chip double) over a bass that moves A♭ → D♭ → B♭ → E♭ with the stamps. It thins under the quote strip and his post (the record plays dry: the layer holds). The engine stops on the cut. |
| 163.8 → 180.9 | `run_roof` | **Grand, then uneasy** | The last stab rings into a held pad: A♭maj9 with horns and a harp roll, **grand**, under the statement (dry, pad only); then **uneasy** at the sheet: D♭maj9(♯11) after "It doesn't say what it costs.", B♭m9 after "A short one.", and **C7sus(♭9) on "we'll read it."** (the knife), held into the register. |
| 180.5 → 195.1 | `upsell` | **The caper, the sale.** P06 THE JOB, MM-05's Upsell, **F dorian**, double-time swing | In on the register's roll: walking eighths, the chip GPU clock (12.5 %, nothing above E♭6), grand comping; Nesnej's card holds one chord for its beat; **the Upsell's cells, each a step higher** (vibes + straight mute), soft under Mario and **dry under Nesnej's real line**. **The close** (C G F, with the bari/trombone F–C fifth on the cut to his finger) **leaves the downbeat for the KA-CHING** (a timeline sound): the band rests in its beat. Phrase 3 climbs on, featured (+3.5 dB), and at the crack in the sky (17.11) **it drops out mid-climb** (3 ms), before its target lands. |
| 195.1 → 204.75 | — | **The act-out** | No score: the register's bell alone (a timeline sound), decaying, with the wind. Designed. |

**Variety across the act:** B♭-major pomp → a hush → deadpan D♭ procedure → an A♭ run → a grand pad that turns uneasy → an F-dorian caper → the bell alone.

## Measured

| Cue | LUFS-I | ST p95 | True peak | Engine QA |
|---|---|---|---|---|
| `wh_pomp` | −20.0 (the door and the print −18.7) | −17.8 | −3.2 | F-major OK, written third 0, knee 0 |
| `senate_a` | −21.0 (the pedal under the clone −24.3) | −18.5 | −3.2 | OK |
| `senate_b` | −21.0 | −19.4 | −4.3 | OK |
| `run_roof` | −19.0 (the RUN −17.4, p95 −16.3: featured; the pad −19 → −21.7) | −16.4 | −3.2 | OK |
| `upsell` | −19.0 (before the slot −21.3; phrase 3 −16.6: featured) | −16.6 | −4.3 | OK |
| **The whole stem** | **−20.0** | −17.4 | −3.15 | |

EL: the same within 0.3 LU per cue (whole −20.0 LUFS-I).

- **Length:** exact on both locks.
- **Digital silence:** only the three marked windows (the bridge 11.0 s; the wallet 11.8 s; the act-out 9.7 s). No unmarked digital silence; no hole below −60 dBFS for 0.3 s or more outside them; no fragment under 2 s.
- **OST checks (every cue, both locks):** written A♮ over an F bass 0 (the Fountain Pen's turn A4 sits over a B♭ bass); sieved F-major OK; the knee whole 0; knee completion 0.
- **Engine warnings left:** `run_roof` and `upsell` short-term p95 (−16.4, −16.6) over the −17 underscore guide: those are the RUN and the Upsell's phrase 3, the act's featured set-pieces (≈ −16 allowed). Marker misses of 15–60 ms are soft entries (the muted trumpet's first note on the door, bowed pedals).
- Render 1's `senate_b` read −14.6 dB in the 2–6 kHz band (the limit is −15); the Senate's straight mute now has a deeper 3 kHz dip and a high shelf.

## The ElevenLabs variant

`render/music-el.wav` comes from `show/reel/ep01-v3-el/ep01-v3-el-act2.json` with the same code. That lock is 7.5 s shorter (the White House −2.9 s, the Senate −4.0 s, the rooftop −0.5 s); every cue follows it, and it measures clean on every check above.

## Re-run

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render [--el]         # all five cues (~45 s)
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render upsell [--el]  # only some
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --assemble [--el]    # light: re-lay, measure, cues.json
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --dry [--el]         # light: scores + note QA
```

Cue names: `wh senate_a senate_b run_roof upsell`.

## Decide (one owner per sound)

**The timeline has four `synth:stab` sounds on the tour's stamps (16.01)**, the v2 bed's temp "knee stab". The score now plays the knee stab itself (brass + chip, tuned to each stamp's chord), which is the bible's split (P07: "a stab on each item" is the score's). **The sound stem should drop `synth:stab`**, or the mix mutes one of the two. If both play, they land on the same frames, and the v2 stab's A♭maj9 is consonant with the score's first stab but not a match for the later three. The KA-CHING and the register's bell (`ka_ching`, `synth:bell`) stay SFX, as the bible says.

## For an ear, in order

1. The pomp under the talk: light and straight, never Sousa or an anthem.
2. 13.07 (the pan): the theme's held note on his look: wry, not a button.
3. 13.11 (the door): the flat line on the straight mute under his V.O.: the president arriving and Mas not turning.
4. 13.14 (the print): the leap and the turn sign the photo, and the B♭ rings out into the hush.
5. The Senate: deadpan and light, never *Law & Order*; the pedal-only stretches under the real lines; the wallet's stop, and the re-entry after "…no equity".
6. The tour: momentum without "upbeat corporate"; one stab per stamp, never a rimshot.
7. The rooftop pad: grand, then uneasy on "we'll read it."
8. The Upsell's close into the KA-CHING: does the sale close on the bell? The drop-out at the crack: the climb that never lands.
