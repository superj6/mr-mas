# Outro A · "the closing session" · lookdev mock-up (handoff)

**Status (2026-09-26, polish pass):** a visual outline for comparing the five outro proposals. It is not a final. Brief: `show/production/OUTRO-PROPOSALS.md` §2 and §9 (row A). Nothing is committed. **All legal text is a DRAFT; legal review is pending.** Every render carries a quiet `LEGAL TEXT: DRAFT` corner slug.

**Length: 210 frames, 8.75 s** (3.5 bars at 96 BPM, 24 fps). It was 300 frames, 12.5 s. The mock-up file is 234 frames (9.75 s): 1 s of a stand-in "last frame of the episode", then the outro. Frames are numbered o0–o209. Composition frame = 24 + o.

> `OUTRO-PROPOSALS.md` (§0, §2, §7, §9) and the comparison strip (`out/lookdev/outro/outro-proposals-timeline.png`) still describe A at 12.5 s with the footer on his monitor. They belong to the lead and weren't edited by this pass.

## Polish pass: what changed and why

A cold viewer watched the 12.5 s cut and reported these problems. Each one maps to a change:

| Cold read | Change |
|---|---|
| **The one thing:** the camera went out to the man, back into the screen, then out again. It read as a stutter, and it repeated the intro's "it was on his screen" reveal twice. | **The camera now moves outward only, and the reveal happens once, at the end.** The act's picture goes out inside the monitor's bezel (o0–2). The pane is on that monitor (o3–149). Then it pulls back to Mas in his dark room (o150). The old opening room shot (o2–29) and the second cut back in (o30) are gone. |
| After the typing, a 4.5 s hold showed nothing new, and the music had already faded out. | **The outro is 3.75 s shorter.** The hold after the typing is now 3.46 s, the least the read-time rule allows (credit 5 needs 3.2 s at 15 cps). The music keeps moving through the hold: the answer in bar 2, the chord on 3.1, brushes sweeping through bar 3, a felt dyad on 3.2&, and the bass root on 3.3 as the picture pulls back. |
| **The cream disclaimer bar looked cheap and bolted on.** It was the brightest thing on screen, in a different font and style from the terminal. | **The terms line and the pointer moved into the band**, the show's own UI strip (480 × 67 at y 203), the same one B, C and D use. It is paper on dark, P1 and P0, dimmer than the log's paper. It sits under the picture, never on his monitor, which also answers the old legal question about "never in-world". It is lit o0–o149 (6.25 s) and goes out on the pull-back. The pane sits in the picture's top 203 px, so the band never covers it. |
| **At 480 × 270 the moth was a grey smudge after "it." and read as a typo.** On the full stop it risked a corny "bug" joke. | **The moth moved to the dark room** (Ep1's "Senate moth in the dark room"). It flies to the lit pane, loses the light when the window closes, then goes to the cursor when it comes on. It settles on the glass 2–3 px from the cursor, never on text. It is drawn at room scale (13 px, 52 px at 1080p). In the last blink's light it flicks its wings open once, then twitches an antenna. At 480 × 270 it reads as a moth (checked on `qa/view-o198-480-at2x.png` and a box-downsampled crop). |
| **The man looked like a mannequin:** no blink, no breath. | **He blinks** (o183–185) as the cursor comes on, using the cold open's own lid drawings (f48–50), copied over his eyes only. His light follows the screen: the pane's paper light turns his cyan-lit skin to the mauve mids, and it drops as the window closes (o170–172). The room steps down one light level (o173). **The Orb follows the moth**, re-aiming in held 4-frame drawings, and its iris opens a touch when the moth settles. |
| "The stand-in label is still on it." | The stand-in's baked `HIS SIDE` caption box is blanked (`standin.ts`). The stand-in tag and the DRAFT slug are dim red text now, not red boxes. |
| The pane carried too much text to read in one pass. | **The header drops the filename**, which the title bar already shows: `session closed · DEC 27, 2023`. The pane is 28 characters shorter (404 on screen, down from 432). It still can't be read in one pass (weakness 1). |
| The terminal "glitched off". | **The session window closes the way it opened, in reverse:** half its height, then a line, then gone (o170–172). The cursor comes on at the loop point on 4.1 (o180). The old interlaced LCD-row clear is gone. |

## What it is now

- **o0–2** The act's last frame goes out inside the monitor's bezel. The frames step down one level, then three levels (odd rows a step ahead), then go black. **The band lights on o0.**
- **o3–5** The 1-bit session pane opens in 3 drawings: a line, then half, then full.
- **o7** The header prints.
- **o10–o66** The five credit lines type at 4 characters a frame, back to back, with one frame for each return. The wording is exact from §1.1.
- **o67–149** The log holds for reading, with the cursor blinking on the beat.
- **o150–153** The pull-back. The band goes out. The pull-back drawing (LCD rows, the bezel coming in) plays for 2 frames, then the room's zoom outlines for 2 frames.
- **o154–169** The room. Mas and the Orb sit in the cold open's MEDIUM (`drawMedium`, read-only), with the pane greeked on his monitor and its light on him. The moth arrives (o156).
- **o170–172** The window closes. His light goes, and the room steps down one level (o173).
- **o180** The cursor comes on at `LOOP_CURSOR`, with the cold open's f0 sound. Mas blinks (o183–185).
- **o190** The moth touches down beside the cursor and settles. It flicks its wings in the last blink (o195–202). **Out o209**, on the dark room.

**Sound.** Temp music from the OST engine (`audio/track.py`, Ep1 colour: felt, brushes trio, upright, chip):
- **Bar 0 (pickup):** the button's tail, F–C–G, under the stand-in.
- **Bar 1:** **the knee, whole, once, on the cut.** Swung, with a chip double 8va, Fm(add9), bass and brushes.
- **Bar 2:** the answer, D♭maj7 → C7sus(♭9). The F lands on 2.4.
- **Bar 3:** F–C–G on 3.1, no third, with a celesta G5. The brushes sweep on through the bar, a felt C4–G4 sounds on 3.2&, and the bass F2 and a felt C3 come in on 3.3 (the pull-back).
- **Bar 4 (half):** the pedal lifts, then felt F5 plus a 1-frame chip F6 glint on 4.1 as the cursor comes on. The outro's last note is the intro's first.

**Designed SFX** (from `audio/sfx/wav`, read-only; the full list is in `tools/build.py`):
- `server_hum` as a whisper under the insert, then up in the room with `room_drone`.
- The pane-open click, the header's space, and 53 soft key taps (≤ −30 dBFS).
- 2 pull-back ticks.
- The plain `dialog_ok_click` as the window closes.
- A synthesized moth flutter panned with its flight, a touch and a fold.
- The Orb's servo, very low, as its iris opens.

## Files

| Where | What |
|---|---|
| `out/lookdev/outro/outro-a.mp4` (= `a/outro-a-ep1-1080p.mp4`) | The mock-up. 1920×1080, 24 fps, h264 yuv420p, AAC 256k, 234 frames, 9.75 s. The draft 90-word notice is in its `description` tag, to show "file metadata" as one of the places the full text can live |
| `out/lookdev/outro/a/outro-a-still-{1-log-o120,2-room-o162,3-moth-o198}.png` | The 3 key stills (1080p, the engine's own pixels) |
| `out/lookdev/outro/a/outro-a-keyframes.png` | The small sheet: 6 numbered frames, plus a to-scale outline (picture, typing, the band, moth, cursor, music) drawn over the old 12.5 s cut |
| `out/lookdev/outro/a/outro-a-ep10-still.png` · `-ep10-keys-still.png` · `-ep6-still.png` · `-variants.png` | The ladder: Ep6 BASE UI skin; Ep10 where the machine types, adds `reviewed by: a human` and ticks it itself; Ep10's keyboard insert, keys going down with no hands. The band is identical in every skin |
| `out/lookdev/outro/a/outro-a-ep1-mix.wav` · `-temp-music.wav` (+ cue sheet, piano roll) | The final mix and the music alone, aligned to the mp4 |
| `out/lookdev/outro/a/outro-a-qa.json` | Length, levels (including the music's level per picture section), the SFX cue list, readability of the encoded mp4 per text line, read times |
| `studio/src/dev/outro/a/` | `entry.tsx` (the compositions and re-render commands) · `timeline.ts` (all timing, and the typing schedule) · `scene.ts` · `room.ts` · `pane.ts` (the pane, the band, `textBoxes()`) · `text.ts` (the exact text package, the mono setting, the slugs) · `moth.ts` · `skins.ts` (Ep6/Ep10) · `standin.ts` + `standin-data.ts` (generated) · `audio/track.py` · `tools/{standin.py, preview.ts, build.py}` |

## Re-run

The exact commands are in `entry.tsx`'s header comment. In short, from `studio/`, with `SCR` set to your own scratch folder:
1. `track.py` renders the music into `$SCR/music` (about 35 s).
2. `npx remotion render … outro-a-ep1 $SCR/outro-a-ep1-silent.mp4 --concurrency=4 --image-format=png --crf=12` (about 2.5 min).
3. `../audio/.venv-theme/bin/python src/dev/outro/a/tools/build.py --scratch $SCR` (about 1 min). It takes the layout from the engine (`tools/preview.ts layout`), then mixes, muxes with Remotion's ffmpeg, makes the stills and sheets, and runs the QA.

`build.py` no longer restates the layout. The timeline, typing schedule, text boxes and moth path come from `layout.json`, which the scene's own modules write. Change the timing in `timeline.ts` only.

## Measured (this pass)

- **Length:** 210 frames, 8.75 s. The mp4 is 234 video frames, 9.75 s.
- **Encoded mp4 vs the engine's native pixels**, inside every text box at o20, 50, 80, 120 and 149:
  - max channel error 8/255 at 1920×1080 and 20/255 at 480×270 (area-averaged; the worst is the band's terms line);
  - no pixel off by more than 24;
  - text contrast at 480×270 is ≥ 186 for the pane and the terms line, and 127.5 for the dimmer pointer (P0, the same as B's band).

  Checked by eye: `$SCR/qa/view-o120-480-at2x.png`, `view-o162-…`, `view-o198-…`, `crop-o120-pane-band-1080.png`. A sheet of 16 frames decoded from the final mp4 matches the design frame for frame.
- **Read time** (15 cps, from the frame a line is complete until it leaves): every line passes.
  - The thinnest margins are credit 5 (0.30 s), credit 3 (0.42 s), the terms (6.25 s up against 5.8 s needed, margin 0.45 s) and credit 4 (0.64 s).
  - The terms meet the brief's ≥ 5 s rule.
- **Audio:**
  - Music alone −16.07 LUFS; mix −16.21 LUFS; true peak −2.33 dBTP.
  - The engine's QA passes: the knee is whole once (felt, with its chip double); no written A♮ over F; both no-third windows pass (A 0.010, A♭ 0.012 of F); the sub under the room drone is −37.8 dB.
  - A felt F2 on 3.3 had put its 5th partial on A4 and failed the no-third reading, so the pull-back uses the bass F2 and a felt C3 instead.
  - **Two engine warnings remain:** the markers at 2.4 and 3.3 find their onset 12–14 ms early (the brushes' humanising). That is well inside a frame.
- **The music's level by section:** −18.8 dB RMS while the log holds, −19.5 on the chord, −25.7 across the pull-back and close, −27.6 at the end (the drone carries the room).
- **The stills are the video's pixels:** the engine still at o120 and the decoded mp4 frame differ by a mean of 1.4/255.

**Needs a human:**
- Listening: nobody has heard the mix.
- Whether one cut at o150 feels like the payoff, or too quick after the log.
- Whether the moth reads on a real phone.
- Whether 8.75 s is watchable every week.

## Deviations from the brief (on purpose)

- **The shape.** The brief's A starts with the room (o0–29) and cuts back in to the monitor. This pass cuts from the act straight onto the monitor and keeps the pull-back to Mas for the end. That is the cold read's "one thing", and it removes the brief's own named risk.
- **The terms placement.** The brief's A puts them in a pinned footer on his monitor. This pass puts them in the band, like B, C and D. So A's row in §7 ("Terms placement: the pane's pinned footer") no longer applies, and the legal question about "never in-world" goes away.
- **The moth.** §1.3 has it on the terms' final period. At 480 × 270 that read as a typo, so it is in the dark room now. The brief allows "≤ 2 bars after, in the dark room"; here it sits inside the 3.5 bars.
- **The header.** It is `session closed · DEC 27, 2023`; the filename is in the title bar.
- **The ending.** It no longer dims at o270 (that frame doesn't exist now). The room steps down once, when the screen goes dark (o173).
- **Kept from before:**
  - `track.py` lives in this folder, not scratch.
  - Local slab forms of `i l r t f` for the fixed-width log (the shared font is untouched).
  - Ep6's date (DEC 31, 2025) is still a placeholder.
  - Ep6 and Ep10 still reuse Ep1's credit values.

## Where the full text lives (proposal; legal review pending)

On screen there is one line in the band, fixed all season: `A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.` Under it: `Full notice and sources: in the description.` The full 90-word notice (overview §8), the credits in full, the AI disclosure with the tools named, and the receipts link go:
1. in the episode description;
2. on the per-episode receipts page, once the show has one;
3. in the file's metadata (shown working here: the mp4's description tag);
4. in an optional 20 s legal-card slate, for any platform that requires it on screen.

## Honest weaknesses

1. **The text still can't be read in one pass.** 404 characters (title bar, header, 5 credits, terms, pointer) take about 27 s at 15 cps, and they are up for 6.25 s. Every line meets its own read time, but a viewer reads the band or skims the log, not both.
2. **The hold after the typing is still 3.46 s**, with only the blinking cursor and the music moving. It can't get shorter without failing credit 5's read time, unless the typing starts earlier or the credit lines get shorter.
3. **The room shot is short.** He is on screen for 2.4 s (o152–209), and the pane is on his monitor for only 0.75 s before it closes. The reveal may land too fast. The fix is to take a beat from the log hold, which would cost read margin.
4. **The moth is small.** It is 13 px on a 480-px frame, readable because it moves, flicks and sits by the only light. On a phone, the settled moth alone could still read as a blob. It is the same local sprite as before, so it won't match the other proposals' moths.
5. **The acting is still minimal:** one blink and the Orb's look. Mas holds the cold open's f56–62 drawings, and there's no breath.
6. **The lighting is approximate.** The pane's paper light is a ramp swap (cyan to night, K skin to X mids). The wall's cyan glow from the cold open is only stepped down, not recoloured.
7. **The temp music hasn't been heard.** It's 92% piano. From o150 it's thin (−26 to −28 dB RMS), with the room drone carrying it. The OST owner hasn't approved the colour.
8. **The stand-in is still the Act 4 v4 animatic's last frame.** Its caption is blanked. Ep1's real button isn't built.
9. **The Ep10 differences are motion,** so they are weak in a still.
10. **All legal text is draft,** and legal review is pending. Whether the band's one line and the description cover what the 90-word card did is §10's question 1.
