# Outro B, "the Orb's verdict": Ep1's final outro (v3)

**Status (2026-09-27):** built and rendered. It's Ep1's outro in the v3 full-episode attempt (track P3 in [full-v3/PLAN.md](../../../../../show/episodes/ep01/production/full-v3/PLAN.md)). Nobody has watched or listened to it yet. The mix was measured, not auditioned.

**The ask:** the showrunner, 2026-09-27: "i liked the orb outro. also it should say art, script, etc. created by opus 4.5, prompt jgon". The model is Claude Opus 5.5, so the credit reads **opus 5.5** ([SHOWRUNNER-NOTES](../../../../../show/production/SHOWRUNNER-NOTES.md) note 4). There's no parody line and no pointer on screen (note 3).

**The output:** `out/ep01/outro/outro-b-v3.mp4`. It's 1920×1080, 24 fps, 243 frames (10.125 s), with AAC audio at −16.0 LUFS integrated.

## What's on screen

| Outro frame · bar.beat | Picture | Sound |
|---|---|---|
| o0 · 1.1 | The cut to black. The Orb, close, frame-right, steps up in 3 palette steps. | Drone F1+C2, felt F4 |
| o9 | The toast's header posts: `mr. mas · ep1.0_research_preview.md` | A faint tick |
| o15–19 | The iris turns to the lens | Servo (C6) |
| o30–54 | The scan cone sweeps the toast. Tokens show in its leading half, and the credits resolve into plain type behind it. They're legible from about o47. | Scan shhk, sweep, grains; no music |
| o60 · 2.1 | Its chip lands around the type (the words don't move): `art · script · music · voices · edit: opus 5.5` | The knee begins, whole and straight |
| o75 · 2.2 | `prompt: jgon` | |
| o90–112 | On the leap, the iris narrows one step per note | |
| o120 · 3.1 | `viewer: human ✓`, and the verdict lights the lens (the lamp) | Chime (C7) |
| o135 · 3.2 | | The verdict F5 → C6 over the open fifth |
| o130–165 | The moth drops in, loops the lit lens and bumps the glass on 3.4 | Wingbeats, a glass tink |
| o166–183 | The moth tumbles off to the lower right. The iris flinches, then looks where it fell. The moth flutters up and **lands on top of the Orb** at o183. | Aperture ticks, servo, a landing tick |
| o195 · 4.2 | The Orb, still looking down-right, rolls its eye up to the top of its own head, finds the moth and widens (o199) | Servo |
| o210 · 4.3 | It narrows on the moth; o217 the moth twitches its wings | Celesta F6 over vibes C6, pp |
| o225 · 4.4 | Cut to black; 18 frames of black while the fifth releases | |

A plain week (no stinger) cuts at o180 (7.5 s), with the glance back to the toast on 3.3. The `{ep: 6 | 10}` props and the `outro-b-stills` composition still render those states.

## What changed from the mock-up, and why

The mock-up as the showrunner saw it is `out/lookdev/outro/outro-b.mp4` (left as it was). Its code is in git history, before this rebuild.

- **The band is gone.** It carried only the terms line and the pointer, both cut by note 3, and an empty band read as a web footer. The Orb and its toast are re-centred in the whole frame: the Orb's cy moved from 96 to 132 and the toast moved down with it, so the scan's angles are unchanged.
- **The credits.** The toast is now the header, `art · script · music · voices · edit: opus 5.5` and `prompt: jgon`, in the Orb's lowercase `field: value` voice. They replace `made in code by (creator), with ai tools` and `voices: synthetic · none cloned`. The header went lowercase (`mr. mas`) to match.
- **The moth lands on the Orb,** the lamp it came to, since there's no longer a word to settle beside. The Orb's eye roll up to find it is the button. The mock-up's beam on the moth is cut (the lens is right under it now).
- **Retimed.** There's no stand-in second, and the file starts at o0. The mock-up ran to 5.1 (o240). This one cuts one beat earlier, on 4.4 (o225), because the moth no longer travels down to the band. It still rests on the Orb for 1.75 s before the cut. The file went from 282 to 243 frames.
- **The score** (`audio/track.py`) is the mock-up's pass-5 cue, re-fit to end on 4.4 with Score `length_s`:
  - Bar 4 is three beats.
  - The felt chords are rolled 12–21 ms (they were struck in the same sample, which made the peaks).
  - The knee's felt is a touch softer (vel 0.36 → 0.34, brushes 4 → 3 dB), so the verdict stays the loudest moment.
- **The mix** (`audio/mix.py`):
  - It's set to −16.0 LUFS integrated, with true peaks held to −3 dBTP (OST-BIBLE rule 14) by the OST engine's own look-ahead limiter (`engine/mix.py` `limiter_gain`, imported read-only). That limiter trims about 4 ms of waveform peaks after the 2.1, 2.3 and 3.2 attacks, by at most 2.2 dB.
  - The stand-in's room hum is gone.

## Files

| Path | What |
|---|---|
| `timeline.ts` | The clock (`T`), the per-episode data (`EPS`) and **the credit text (`SHOW`, `CREDITS`)** |
| `scene.ts` | The PixelScene: the Orb's look and aperture over time, the scan, the toast, the moth's flight (`MOTH_WAY`) |
| `art.ts` | The chips, the Orb close (`ORB`), the lamp glow, the glint, the moth and its perch on the Orb (`PERCH`) |
| `OutroB.tsx`, `entry.tsx` | The Remotion hosts: `outro-b-ep1` (243 f) and `outro-b-stills` (4 f; frame 1 is also read by `../_compare/reel.py`) |
| `audio/track.py` | The score (OST engine, read-only) |
| `audio/mix.py` | The SFX, the mix and the loudness |
| `tools/preview.ts` | A fast Node preview and the pixel checks (read time, chip widths, the moth's path and perch) |
| `tools/sheets.py` | The keyframes sheet, the key stills and the QA, all from the encoded mp4 |
| `tools/render.sh` | All of it, in order |

**Outputs** go in `out/ep01/outro/`:
- `outro-b-v3.mp4`
- `outro-b-v3.wav`: the mix, beside it
- `outro-b-v3-{music,sfx}.wav`: the stems at the mix's static gain, pre-limiter (the WAVs and the mp4 are git-ignored)
- `outro-b-v3-keyframes.png`: 8 numbered frames, the bar grid and the read lane
- `outro-b-v3-key-credits.png` (o128) and `outro-b-v3-key-moth.png` (o212)
- `qa/`: text crops at 1080p and 480×270, 480×270 frames, and `qa.json`

## Re-render

From the repo root, in the background (the heavy steps wait for an `ops/heavy.sh` slot):

```bash
SC=/tmp/…/scratchpad/<your-pass>/render      # any scratch folder
nohup bash studio/src/dev/outro/b/tools/render.sh "$SC" > "$SC.log" 2>&1 &
```

`render.sh` runs these steps (don't run it under `ops/heavy.sh` itself; its heavy steps already are):
1. The picture: `ops/heavy.sh npx remotion render src/dev/outro/b/entry.tsx outro-b-ep1 … --concurrency=4 --crf=12` (under a minute).
2. The score: `ops/heavy.sh audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/track.py --out "$SC/music" --no-loop --no-mp3 --workers 2`, with `OST_WORKERS=2` (a few seconds).
3. The mix: `audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/mix.py "$SC"`. It prints the report, including each bar's loudness.
4. The mux, with Remotion's bundled ffmpeg (video stream copy + AAC 256k).
5. It decodes every frame of the encoded mp4 and runs the pixel checks for Eps 1, 6 and 10 (`node "$SC/pv.js" "$SC" 1 <ep> check`).
6. `tools/sheets.py`: the sheet, the stills and the QA.

**Fast look, no Remotion** (the GLYPH tokens are approximated):
```bash
(cd studio && node_modules/.bin/esbuild src/dev/outro/b/tools/preview.ts --bundle --platform=node --outfile="$SC/pv.js")
node "$SC/pv.js" "$SC" 2 1 128,212            # frames at 2x (file frame = outro frame)
node "$SC/pv.js" "$SC" 1 1 grid:10,42,80,128,158,172,192,212
node "$SC/pv.js" "$SC" 1 1 check              # read time, chip widths, the moth
```

## Change the credit text

1. **Edit `timeline.ts`.**
   - `CREDITS` is the two credit lines.
   - `SHOW` is the header's first half. The second half is the episode's file, `EPS[ep].file`.
   - The verdict is `EPS[ep].verdict`.
   - Keep the Orb's voice: lowercase, `field: value`, with ` · ` between fields.
2. **Stay inside the face.**
   - The shared 7-px font has a–z, A–Z, 0–9 and `. , : ; ' " - / ( ) _ * + = ! ? $ · ✓`, plus a space. `art.ts` draws `—` locally.
   - Any other character draws as a blank. Don't edit the shared font. Draw a missing glyph locally, the way `tx()` draws `—`.
3. **Check the fit and the read time:** `node "$SC/pv.js" "$SC" 1 1 check`.
   - `chips` gives each chip's width and right edge. It has to end before x 365 (native) to stay clear of the Orb. The longest now is 205 px, ending at x 237.
   - `perLineOk` and `inOrder` have to hold. Today the whole toast (108 characters), read in order at 16 characters a second, finishes 2.2 s before the cut.
4. **Repeat the credits in `render.sh`'s mp4 `comment` tag,** and in `track.py`'s two `a.mark` labels on 2.1 and 2.2 (these are labels only).
5. **Re-render** with `render.sh`.

A third credit line needs more than the text:
- a new row in `TOAST.y` (`scene.ts`), with the verdict's `vy` moved down 15 px;
- a pop time in `linePops` (`timeline.ts`), on the knee's 2.3 or 2.4;
- the chip tick in `mix.py`.

## Measured (on the final render)

- **The file:** 243 frames, 10.125 s, 1920×1080 at 24 fps, H.264 plus AAC 48 kHz stereo.
- **Loudness:**
  - The mix WAV is −16.02 LUFS integrated and −3.15 dBTP. The mp4's own audio decodes to −16.04 LUFS and −3.13 dBTP.
  - Short-term p95 is −13.9 and the momentary max is −11.4 (the featured-cue limits are ≤ −13 and ≤ −11).
  - Each bar, integrated / momentary max: bar 1 −19.6 / −12.9, bar 2 (the knee) −13.3 / −11.5, bar 3 (the verdict) −15.0 / −11.4, bar 4 −20.1 / −16.6. The verdict edges the knee by 0.1 LU, so they're level in practice.
  - The last 100 ms is at −86.6 dBFS.
- **No third after the verdict:** from 3.2 to the end, the A/F energy ratio is 0.0035. The engine's F-major check raised no flag.
- **Engine warnings:** one marker warning, the mock-up's known one at 3.125 s (the repeated F on 2.2).
- **Read time, measured on the rendered pixels:**

  | Line | Legible from | Seconds on screen |
  |---|---|---|
  | Header | o10 | 8.96 |
  | `art · script · …` | o47 | 7.42 |
  | `prompt: jgon` | o49 | 7.33 |
  | Verdict | o121 | 4.33 |

  Read in order by one reader, the whole toast finishes 2.2 s before the cut at 16 characters a second, 3.0 s before at 18 and 3.6 s before at 20. A plain week (Ep6) fits at 16 characters a second with 0.15 s to spare.
- **The encode against the exact frames:** the text regions differ by a mean of 1.2–1.3 and a max of 4–8 levels out of 255, with 8.9–12.3:1 contrast.
- **The moth:** its whole flight stays at least 146 px from any toast row. At rest its abdomen overlaps the sphere's top 2 rows.
- **Looked at by the builder:** every credit state (o8–11, o36–61, o75–76, o119–121, o224) as crops of the encoded frames, and the sheet's 8 frames.

## Needs a human, and open issues

- **A watch and a listen.** In particular: whether the eye roll up at 4.2 reads as the joke, and whether the moth, lit cyan by the eye (it goes onto the K ramp within 46 px of the lens), still reads as the brown moth that came in.
- **The limiter** takes up to 2.2 dB off about 4 ms of peaks. That's measured as transparent in loudness terms, not auditioned.
- **Lowercase `mr. mas`** in the header follows the lead's brief. The mock-up had `MR. MAS`. It's one string (`SHOW`) if the showrunner wants the capitals back.
- **Length:** a stinger week (Ep1, 9.375 s to the cut) still runs 1.875 s longer than a plain week (7.5 s).
- **Still open from the mock-up:**
  - The lens look every week.
  - The flat terminal chips and the stock decode.
  - Ep7's "no verdict" isn't built.
  - Ep10's score is described, not rendered.
  - For a few frames mid-scan, tokens brush the bottom of the still-resolving line.
- **Downstream:**
  - `studio/src/dev/outro/_compare/reel.py` still describes the mock-up's B (240 f, the band), and it reads `outro-b-stills` frame 1, which now renders the v3 layout (no band). The compare reel (`out/lookdev/outro/outro-compare.mp4`) was not re-cut.
  - The episode assembly places `outro-b-v3.mp4` after the tag. Its o0 is the cut to black.
