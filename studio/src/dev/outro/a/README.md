# Outro A · "the closing session" · lookdev mock-up (handoff)

**Status (2026-09-27, second polish pass):** a visual outline for comparing the five outro proposals, not a final. Brief: `show/production/OUTRO-PROPOSALS.md` §2 and §9 (row A). Nothing is committed. **All legal text is a DRAFT; legal review is pending.** Every render carries a quiet `LEGAL TEXT: DRAFT` corner slug.

**Length: 285 frames, 11.875 s** (4.75 bars at 96 BPM, 24 fps). History: 12.5 s (first build) → 8.75 s (first polish) → 11.875 s (this pass). The mock-up file is 309 frames (12.875 s): 1 s of a stand-in "last frame of the episode", then the outro. Outro frames are numbered o0–o284; composition frame = 24 + o.

> `OUTRO-PROPOSALS.md` (§0, §2, §7, §9), the comparison strip (`out/lookdev/outro/outro-proposals-timeline.png`) and the comparison reel (`out/lookdev/outro/outro-compare.mp4`, `outro-compare-sheet.png`) still show older cuts of A. They belong to the lead and this pass did not edit them.

## Second polish pass: what changed and why

A second cold viewer watched the 8.75 s cut. They found a good ending but said it asked for too much reading too fast: two text blocks at once (the card, plus the terms in a navy band in another face), about 55 words in about 6 s. **Their one fix:** make the disclaimer the card's last lines, in the same face, and cut the credit lines to about half their words, so the whole card is one block you can read in one pass.

| Cold read 2 | Change |
|---|---|
| **The one thing:** two text blocks at once, two faces, about 55 words in about 6 s. | **One block, one face.** The band is gone. The terms (2 rows) and the pointer are the log's last lines, under a dotted rule, in the same fixed-width setting as the credits. The title bar is set in it too. The credit rows go from 32 words to 13 (below). |
| "The card types at about 76 characters a second, faster than anyone reads; you read it in the hold." | **The reveal is paced to a reader.** The credits type at 2 characters a frame (48 cps, was 96). Each line waits until a 25 cps reader has finished the one before it (`O.lines`). The terms print whole at o85, and the pointer prints under them at o145, when the reader is still on the terms. |
| "The dim second line ('Full notice and sources…') got skipped." | **The pointer is in full paper like everything else,** and it prints as its own beat (o145, with a tick and the prompt's return), so the eye goes to it. |
| "The long 'picture · music:' label pushes the values far right"; "the '·' is used five times"; "'created by' has no colon while every other label does." | Labels are `created by`, `made`, `voices`, with **no colons**, and the values sit at cell 12. The `·` appears once, in the title bar. The date sits flush right on the header row instead of after a `·`. |
| "The music fades to silence by about 9.5 s but the picture never goes to black; the last frame can feel cut off." | **It ends on black, with the music still sounding.** On the last blink (o270–277), the room goes down around the lit cursor in three held drawings (o272, o274, o276). They walk the whole room onto the night ramp (a palette operation), and the cursor's cyan rim on the moth stays lit. Black comes at o278, as the cursor goes off. The felt F5 of the cursor's f0 sound rings under all of it, and the music's end fade matches the black (o278–284). |
| "The '6' on the clock is a broken glyph"; "the clock turns to mush" at 480 × 270. | **The shelf clock is redrawn locally** (`room.ts drawClock`) with 3 × 5 digits in the same box and reds. The cold open's `medium.ts` is untouched. The time is now a per-episode value (`EpText.clock`; Ep1 keeps the cold open's `1:36`). |
| "I'd watch the room beat every week, especially if the clock time or the moth changed." | The clock is per episode now (above). The room shot also gets a longer look: the lit room runs 23 frames (was 16) before the window closes. |

**The credit rows (the long forms go to the description with the full notice):**

| §1.1 field | §1.1 Ep1 value | On screen now |
|---|---|---|
| Title | `MR. MAS · ep1.0_research_preview.md` | the title bar (unchanged) |
| Created by | `(creator)` | `created by  (creator)` |
| Written | `(creator), with AI` | folded into `made  in code, with AI tools` |
| Picture · music | `pixel art and original score, rendered in code` | (same row) |
| AI tools | `used throughout · listed in the notice` | (same row; "listed" is carried by the pointer) |
| Voices | `synthetic, designed from text · none cloned` | `voices  synthetic, none cloned` |

The AI-tool disclosure is still the last two credit rows, and it is still exact per episode. The `made` row is the one that changes when an outside layer ships. **The terms line keeps the brief's words exactly.** It is set on two rows (`TERMS_ROWS`) because 87 fixed-width cells don't fit the frame, and the rows join back to the one-line `TERMS`.

**Kept from the first polish pass:** the camera moves one way only (act → his monitor → out to him, one reveal, at the end). Also kept: the window closing the way it opened; the moth in the dark room, never on text; Mas's one blink and the Orb following the moth; the stand-in's caption blanked; the slugs as dim red text.

## What it is now

- **o0–2** The act's last frame goes out inside the monitor's bezel (one step down, three steps with odd rows ahead, black).
- **o3–5** The 1-bit session pane opens in 3 drawings (a line, half, full), with the title bar.
- **o6** The header prints: `session closed`, with `DEC 27, 2023` flush right.
- **o9–69** Three credit lines type at 2 characters a frame. They start at o9, o29 and o55, each waiting for a 25 cps reader.
- **o85** (2.2&) **The terms print whole**, both rows in one frame, under a dotted rule. They never move after that. The cursor waits on the next row, blinking on the beat.
- **o145** (3.2&) **The pointer prints**, with the prompt `>`. The log is complete and holds.
- **o225–228** (4.4) The pull-back: LCD rows and the bezel coming in (the text is still intact on o225–226), then the room's zoom outlines.
- **o229–251** The room. Mas and the Orb in the cold open's MEDIUM (`drawMedium`, read-only), the pane greeked on his monitor, its light on him. The moth comes to the light (o231) and bumps the glass.
- **o252–254** The window closes (half, a line, gone), and his light goes with it.
- **o255** (5.2) The cursor comes on at `LOOP_CURSOR`, with the cold open's f0 sound. The room is one step down. Mas blinks (o258–260).
- **o265** The moth touches down beside the cursor, twitches an antenna, and settles.
- **o270–277** (5.3) The last blink. The moth flicks its wings in its light, and the room goes down around it (o272, o274, o276).
- **o278–284** Black. Out o284.

**Sound.** Temp music from the OST engine (`audio/track.py`, Ep1 colour: felt, brushes trio, upright, chip):
- **Bar 0 (pickup):** the button's tail, F–C–G, under the stand-in.
- **Bar 1:** **the knee, whole, once, on the cut.** Swung, with a chip double 8va, Fm(add9), bass and brushes.
- **Bar 2:** the answer, D♭maj7 → C7sus(♭9). The F lands on 2.4.
- **Bar 3:** F–C–G on 3.1, no third, with a celesta G5. The brushes sweep on, with a felt C4–G4 on 3.2& (the pointer's print) and a small felt G4 → C5 lift on 3.4 / 3.4&.
- **Bar 4:** on 4.1, the title's quartal stack (C–F–B♭–E♭, G on top) over a bass B♭1, the way home. On 4.4 (the pull-back), the bass F2 and a felt C3–G3: home, no third. The room drone comes in under it.
- **Bar 5 (to 5.4):** the home fifth rings through the window closing. On 5.2 the pedal lifts, then catches a felt F5 plus a 1-frame chip F6 glint as the cursor comes on. It rings under the last blink and fades with the black.

**Designed SFX** (from `audio/sfx/wav`, read-only; the full list is in `tools/build.py`):
- `server_hum` whispering under the insert, up in the room with `room_drone`, both down with the lights.
- The pane-open click, the header's return, 39 soft key taps (≤ −30 dBFS), 2 row ticks when the terms print, and a tick plus a return when the pointer prints.
- 2 pull-back ticks.
- The plain `dialog_ok_click` as the window closes.
- The synthesized moth: a flutter panned with its flight, a touch and a fold.
- The Orb's servo, very low.

## Files

| Where | What |
|---|---|
| `out/lookdev/outro/outro-a.mp4` (= `a/outro-a-ep1-1080p.mp4`) | The mock-up: 1920×1080, 24 fps, h264 yuv420p, AAC 256k, 309 frames, 12.875 s. The draft 90-word notice is in its `description` tag, showing file metadata as one place the full text can live. |
| `out/lookdev/outro/a/outro-a-still-{1-log-o200,2-room-o240,3-moth-o273}.png` | The 3 key stills (1080p, the engine's own pixels). The previous pass's o120/o162/o198 stills were removed because they showed the replaced cut. |
| `out/lookdev/outro/a/outro-a-keyframes.png` | The small sheet: 6 numbered frames, plus a to-scale outline. Its lanes: picture, typing, the terms, the pointer, **where a 25 cps first-time reader is**, the moth, the cursor, the music, and the 8.75 s cut it replaces. |
| `out/lookdev/outro/a/outro-a-ep10-still.png` · `-ep10-keys-still.png` · `-ep6-still.png` · `-variants.png` | The ladder: Ep6 BASE UI skin; Ep10, where the machine types, adds `reviewed by  a human` and ticks it itself; Ep10's keyboard insert, keys going down with no hands. The legal block's words and rows are the same in every skin. |
| `out/lookdev/outro/a/outro-a-ep1-mix.wav` · `-temp-music.wav` (+ cue sheet, piano roll) | The final mix and the music alone, aligned to the mp4. |
| `out/lookdev/outro/a/outro-a-qa.json` | Length; levels (including the music's level per section); the SFX cues; readability of the encoded mp4 per text line; per-line read times; **the one-pass reader simulation**. |
| `studio/src/dev/outro/a/` | `entry.tsx` (compositions and re-render commands) · `timeline.ts` (all timing, the typing schedule, the reading pace, the end fade) · `scene.ts` · `room.ts` (the room, the light, the blink, the clock, the lights going down) · `pane.ts` (the window layout `winFor()`, the log, `textBoxes()`, the greeked monitor pane) · `text.ts` (the text package and the field mapping, the fixed-width setting, the slugs) · `moth.ts` · `skins.ts` (Ep6/Ep10) · `standin.ts` + `standin-data.ts` (generated) · `audio/track.py` · `tools/{standin.py, preview.ts, build.py}` |

## Re-run

The exact commands are in `entry.tsx`'s header comment. In short, from `studio/`, with `SCR` set to your own scratch folder:
1. `track.py` renders the music into `$SCR/music` (about 10 s).
2. `npx remotion render … outro-a-ep1 $SCR/outro-a-ep1-silent.mp4 --concurrency=4 --image-format=png --crf=12` (about 20 s on this machine).
3. `../audio/.venv-theme/bin/python src/dev/outro/a/tools/build.py --scratch $SCR` (about 10 s). It takes the layout from the engine (`tools/preview.ts layout`), then mixes, muxes with Remotion's ffmpeg, makes the stills and sheets, and runs the QA.

`build.py` does not restate the layout. Change timing in `timeline.ts` only. The text boxes (with each line's first visible and complete frame) come from `pane.ts textBoxes()`.

## Measured (this pass)

- **Length:** 285 frames, 11.875 s. The mp4 is 309 video frames, 12.875 s.
- **Text on screen:** one block. 43 words, 268 characters in all. The must-read lines (credits, terms, pointer) are 34 words and 206 characters. The last cut had about 55–62 words (the cold reader's count and this one's) in two blocks.
- **Per-line read time** (15 cps, from the frame a line is complete until the pull-back): every line passes.
  - Thinnest: the pointer, up 3.33 s against 2.93 s needed (margin 0.4 s).
  - The terms are up 5.83 s (the brief's rule is ≥ 5 s; 3.0 s needed per row).
  - The credit rows have 4.6–7.3 s of margin.
- **One pass** (`one_pass()` in `build.py`): a first-time reader goes top to bottom once. They can start a line from its first typed character, and they skim the title bar and header in 0.4 s each. The text stays intact through o226.

  | Reader | Finishes | Margin |
  |---|---|---|
  | 25 cps (about 240 wpm, average silent reading) | o222 | **+0.21 s** |
  | 4 words a second (the cold reader's own figure) | o228 | **−0.05 s**, on the last word, as the room comes in |
  | 20 cps | | −1.85 s |
  | 15 cps (subtitle rate) | | −5.3 s |
  | 25 cps, reading the title bar and header in full | | −1.47 s |

  So an average reader gets through everything once. A slow or careful reader does not, and they lose the end of the pointer first.
- **Encoded mp4 vs the engine's native pixels,** inside every text box at o30, 60, 100, 150 and 219:
  - max channel error 8/255 at 1920×1080 and 12/255 at 480×270 (area-averaged);
  - no pixel off by more than 24;
  - text contrast at 480×270 ≥ 216 for every line.

  Checked by eye: `$SCR/qa/view-o150-480-at2x.png`, `view-o240-…`, `view-o273-…`, `crop-o150-pane-1080.png`, and a 1080p crop of the clock.
- **The stills are the video's pixels:** the engine still at o200 and the decoded mp4 frame differ by a mean of 1.36/255.
- **Audio:**
  - Music alone −16.07 LUFS; mix −16.22 LUFS; true peak −1.70 dBTP.
  - The engine's QA passes: the knee is whole once (felt, plus its chip double: `knee_completion` hits = felt and lead at 1.25 s only); no written A♮ over F; both no-third windows pass (A 0.017, A♭ 0.041 of F; limit 0.06; the A♭ reading was 0.012 before bar 4's B♭ stack was added, probably from the B♭1 bass's flat 7th partial, not checked); the sub under the room drone is −39.5 dB.
  - **One engine warning remains:** the 2.4 marker's onset lands 14 ms early (the brushes' humanising), well inside a frame.
- **The music's level by section** (RMS): −15.6 dB (the knee), −18.2 (the answer), −20.8 (the chord), −22.5 (the stack), −24.0 (home, the room), −26.6 (the cursor to black; the drone carries the room).

**Needs a human:**
- Listening: nobody has heard the mix.
- A real first-time read on a phone: can a viewer get through the card once?
- Whether 11.9 s is watchable every week, since the card is identical each time.

## Deviations from the brief (on purpose)

- **The words.** The credit rows are cut from 32 words to 13, with the mapping in the table above. Written, Picture · music and AI tools share one row. The brief says "the same words in every proposal"; B and E also cut theirs, but differently.
- **The terms placement is back on his monitor,** as the last lines of the session pane. The brief's A had them in the pane's pinned footer; the first polish pass moved them to the band. They are interface text, never a plaque, but the room reveal shows it's his screen. **Legal should say whether that counts as "never in-world."**
- **The terms print; they are not typed** (rule 2, "never animated"). The pointer prints a beat after them; it is not bound by the ≥ 5 s rule, and its own read time passes.
- **The length went up** from 8.75 s to 11.875 s, so an average reader can get through the card once. It is still inside 6–15 s, but A is now the longest of the five (D is 11.25 s).
- **The moth** is in the dark room beside the cursor, not on the terms' final period (kept from the first polish pass).
- **Kept from before:** `track.py` lives in this folder, not scratch; local slab forms of `i l r t f` for the fixed-width log (the shared font is untouched); Ep6's date (DEC 31, 2025) and the Ep6/Ep10 clock times are placeholders; Ep6 and Ep10 reuse Ep1's credit values.

## Where the full text lives (proposal; legal review pending)

On screen, fixed all season: `A parody. Events dramatized, scenes invented.` / `No one depicted took part or endorsed it.`, then `Full notice and sources: in the description.` The full 90-word notice (overview §8), the credits in full (the long forms above), the AI disclosure with the tools named, and the receipts link go:
1. in the episode description;
2. on the per-episode receipts page, once the show has one;
3. in the file's metadata (shown working here: the mp4's description tag);
4. in an optional 20 s legal-card slate, for any platform that requires it on screen.

## Honest weaknesses

1. **A slow reader still can't finish in one pass.** An average reader (25 cps) finishes 0.2 s before the room comes in; a 4-words-a-second reader is on the pointer's last word as it goes. Anyone reading the title bar and header in full, or reading at subtitle speed, loses the pointer. The card is long for its time because the fixed terms line alone is 15 words.
2. **It is now the longest proposal (11.9 s),** and the card is identical every week. The returning viewer's static stretch is the terms from o85 to o225, with only the pointer's print, the cursor and the music moving.
3. **The terms sit on Mas's own monitor again.** That is a legal question (above), and the reason the first polish pass had moved them off it.
4. **The credit rows lost the brief's exact words.** "Written" is no longer its own credit, and "listed in the notice" is carried only by the pointer. The showrunner and legal should confirm that `made  in code, with AI tools` plus `voices  synthetic, none cloned` is a sufficient on-screen disclosure.
5. **Mas has no new acting.** He holds the cold open's f56–62 drawings, with one blink. His forearms still read as stiff panels (the cold open's torso painting, read-only here).
6. **The moth is small:** 13 px on a 480-px frame, a speck at phone size until it sits in the cursor's light. It is the same local sprite as before, so it won't match the other proposals' moths.
7. **The lighting is approximate.** The pane light is a ramp swap, and the lights-down is a night-ramp remap (it reads as moonlight, which is a choice nobody has approved).
8. **The temp music hasn't been heard.** It's 93% piano. The bar-4 stack over B♭ is new, and the OST owner hasn't approved the colour.
9. **The stand-in is still the Act 4 v4 animatic's last frame,** with its caption blanked. Ep1's real button isn't built.
10. **The Ep10 differences are motion,** so they are weak in a still. The later skins aren't animated.
11. **All legal text is draft,** and legal review is pending. Whether the two terms rows and the description cover what the 90-word card did is §10's question 1.
