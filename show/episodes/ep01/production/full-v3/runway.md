# Ep1 v3.1: the Runway inserts, ELGOOG's duck demo and Ttemme's hourglass (`v31-runway`, 2026-09-27)

> **Status: both inserts are built and rendered.** This is PLAN §5 item 6. This pass didn't touch any `shots.ts` or timeline: the tag and Act Four shot passes splice the inserts (§6 and §11.5).
> - **The duck (the tag):** ELGOOG's demo film, the pilot's one near-photoreal image. It's a staged demo, exposed inside the shot.
>   - **The lead's ruling:** (a), the push-in, rendered with `--no-chip`. The "● LIVE" chip was invented, and the stutter carries the joke without it.
>   - **The final** is `out/ep01/full-v3/runway/elgoog-demo-final.mp4`.
> - **The hourglass (Act Four S7.13, a second insert, lead's ruling, up to 150 credits):** Ttemme's own broadcast. His stream-cam hourglass shatters, and the sand stands on its own for a beat, then falls. It plays inside our coded pixel stream frame. See §11.
>
> **Authorized by the showrunner (2026-09-27):** "is there anywhere here you wanted to try using runway?" and "you can also attempt the runway transition variations, try your best to get a fully finalized version". The budget was 500 credits: at most 350 for this, and 150 kept in reserve.
>
> **Spent: 295 credits of the 500. The balance is 205, above the 150 reserve.**
> - The duck: 160, on three video generations.
> - The hourglass: 135, on two video takes (120) and three stills (15).
>
> **Nothing here was watched or heard.** I looked at contact sheets and full-size stills of the clips, at every transition and at frames decoded from the encoded MP4s. The motion numbers, the flash check and the luminance figures are measured.
>
> Nothing was committed.

---

## 1. Files

| What | Where |
|---|---|
| **THE FINAL DUCK INSERT: (a), the push-in, no chip.** 233 frames, 9.71 s. The tag pass splices this one | `out/ep01/full-v3/runway/elgoog-demo-final.mp4` (every frame's source: `elgoog-demo-final-timing.json`) |
| (a) with the chip, as first reviewed. 233 frames, 9.71 s | `out/ep01/full-v3/runway/elgoog-demo-a.mp4` |
| (b), the hard cut. 215 frames, 8.96 s | `out/ep01/full-v3/runway/elgoog-demo-b.mp4` |
| (c), the inset. 215 frames, 8.96 s | `out/ep01/full-v3/runway/elgoog-demo-c.mp4` |
| **Side by side:** the three, time-aligned on the film's first frame, with a legend | `out/ep01/full-v3/runway/elgoog-demo-compare.mp4` |
| Contact sheet: one row per variant, each frame labelled with its insert frame, film frame and mode | `out/ep01/full-v3/runway/elgoog-demo-sheet.png` |
| Every frame's source, per variant and for the film | `out/ep01/full-v3/runway/elgoog-demo-timing.json` |
| **The generated clips kept, each with its `provenance.json`** | `out/ep01/full-v3/runway/clips/` (`v2-…` and `v3-…` for the duck, `h4-…` for the hourglass, and `h1-…`'s record) |
| The records of the rejected and unused generations (the downloads were deleted) | `out/ep01/full-v3/runway/clips/rejected/` (`v1`, `h0`, `h2`, `h3`) |
| **The hourglass insert:** k128–263 of S7.13. 136 frames, 5.67 s | `out/ep01/full-v3/runway/hourglass-s713.mp4` |
| **The hourglass in context:** the whole new S7.13, k0–263. Its k0–127 is the Act Four pipeline's own frames | `out/ep01/full-v3/runway/hourglass-s713-in-context.mp4` (11.00 s) and `hourglass-s713-sheet.png` |
| Every hourglass frame's source | `out/ep01/full-v3/runway/hourglass-s713-timing.json` |
| The conditioning images sent to Runway, as sent (hashes in the provenance files) | `out/ep01/full-v3/runway/inputs/` |
| The held still at the show's three monitor sizes, snapped to the palette, for the tag's later shots | `out/ep01/full-v3/runway/painter/held-still-{2s-96x60,ots-258x138,pov-380x186}.png` |
| **The Runway client** | `studio/src/dev/genvideo/runway/gen.py` |
| The pencil tracing (our drawing, no model) | `studio/src/dev/genvideo/runway/sketch.py` |
| The pixel room, drawn by the show's own kits | `studio/src/dev/genvideo/runway/pxframes.ts` |
| The compositor: the film edit, the grade, the wordmark, the three transitions, the comparison | `studio/src/dev/genvideo/runway/insert.py` |
| Contact-sheet helper | `studio/src/dev/genvideo/runway/sheet.py` |
| The hourglass: its keyframe edits (code), the stream frame (pixel), the compositor | `studio/src/dev/genvideo/runway/hg_still.py`, `hg_after.py`, `streamframes.ts`, `hourglass.py` |

All the MP4s are 1920×1080, 24 fps, H.264 yuv420p and silent, the same as the tag's own `picture/tag.mp4` (untagged BT.601, the pipeline's default).

---

## 2. The client, the model and the spend

**`gen.py`** runs `balance`, `t2v`, `i2v` (first frame, or first and last), `task` and `estimate`, with `--dry-run`, `--cap` and `--floor`:
- It polls `/v1/tasks/{id}`, downloads the output, and writes `<name>.provenance.json` beside the clip, including for a failed job. That covers the model, endpoint, prompt, negative prompt, seed, ratio, duration, audio flag, input paths and SHA-256s, the task id, the times, the credits before and after, the estimate and the output's SHA-256.
- The key is read from `.env` inside the script. It is never printed, and error text is scrubbed of it.
- `publicFigureThreshold` is sent as `auto` wherever a model takes it, and a request that sets anything else is refused before it's sent. Model audio is always sent off.

**What the account serves:** `/v1/organization` lists 62 models, including `veo3.1`, `veo3.1_fast`, `wan3`, `gen4_turbo`, `gen4.5`, `seedance2*`, `kling3.0_*` and `h3_max`. The prices come from docs.dev.runwayml.com/guides/pricing, fetched today: 1 credit = $0.01.

| Model | Credits per second (720p, no audio) | Why it was or wasn't used |
|---|---|---|
| `veo3.1_fast` | 10 | **Used.** It takes a first and a last keyframe, a `negativePrompt` and a `seed`, and runs at 24 fps. It's the strongest product-shot realism at the budget price |
| `wan3` | 10 at 720p | Same price. No `seed` or `negativePrompt` in the API. Held as the second model; not needed |
| `gen4_turbo` | 5 | Cheaper, but first-frame only and an older model. Not needed |
| `veo3.1` | 20 | Twice the price, with no need seen for it |

**The ledger** (balance from `/v1/organization` before and after each job):

| # | Clip | Model · mode | Length | Credits | Balance | Wall time | Verdict |
|---|---|---|---|---|---|---|---|
| v1 | `v1-veo31fast-t2v-s1206` | veo3.1_fast · text-to-video · seed 1206 · 1280:720 | 6 s | 60 | 500 → 440 | 51 s | **REJECTED:** a human hand draws with a pencil, and another hand holds the paper (f000–f048), although the prompt said no hand and the negative prompt listed hands. Its second half was a clean glossy duck, but the clip is used nowhere. The download is deleted; its record is kept |
| v2 | `v2-veo31fast-i2v-sketch-s1206` | veo3.1_fast · image-to-video, first frame = **our** pencil drawing of E1-P2's Blender duck (`inputs/v2-first-sketch.png`) · seed 1206 | 6 s | 60 | 440 → 380 | 85 s | **KEPT: the turn.** Clean: no person, hand, face, text or logo in 144 frames. Its own morph (paint fills, then the page tears open) isn't used. A yellow duck on a white turntable, grey sweep, soft light, turning from right profile through front to three-quarter left (f048–f143) |
| v3 | `v3-veo31fast-keyframes-sketch2duck-s1206` | veo3.1_fast · first + last keyframes: first = **our** tracing of v2 f048 (`inputs/v3-first-sketch-of-v2f048.png`), last = v2 f048 (`inputs/v3-last-v2f048.png`) · seed 1206 | 4 s | 40 | 380 → 340 | 52 s | **KEPT: the morph.** Clean. The lines refine themselves (the wing is redrawn by nothing, f006–f019), glow, fill and become the duck in place, settling onto v2 f048 by f054, so the two clips splice |

**I stopped after three.** v2 and v3 together read clean and glossy, which is the brief's "stop early".

**The prompts, verbatim:**
- **v1:** "A clean, high-end product film on a white seamless tabletop under soft studio light. It opens on a simple graphite pencil line drawing of a rubber duck on a sheet of white paper; the pencil lines draw themselves, stroke by stroke, with no hand and no pencil in view. The sketch then smoothly fills with colour and volume and becomes a real, glossy yellow rubber duck toy with an orange beak, sitting on the white surface. The duck slowly turns on an unseen turntable, soft highlights sliding across its vinyl, a faint reflection on the table below it. Macro lens, shallow depth of field, locked-off camera with a very slow push in, the duck centred in frame, calm and minimal, neutral warm-grey background."
- **v2:** "The pencil line drawing of a duck on the white page comes to life: its outline fills with glossy yellow colour and real volume, and it becomes a real rubber duck toy with an orange beak, standing on a clean white tabletop as the paper dissolves into the white table. Soft studio softbox light, gentle highlights sliding over the glossy vinyl, a faint reflection on the table below. Then the duck slowly turns on an unseen turntable toward the camera. Locked-off camera with a very slow push in, macro lens, shallow depth of field, a calm, premium product film. Nothing else enters the frame."
- **v3:** "A pencil line drawing of a rubber duck on white paper transforms, in place, into a real glossy yellow rubber duck toy that fills exactly the same outline: colour and volume flow smoothly into the lines, the eye and the orange beak appear, and the white paper becomes a white turntable in a soft grey studio. Soft studio softbox light, gentle highlights on the vinyl. Locked-off camera. One smooth, elegant, seamless transformation, like a premium product film. Nothing else enters the frame."
- **The negative prompt (all three):** "hand, hands, fingers, arm, person, people, face, human, pencil held, pen, stylus, text, letters, words, numbers, logo, watermark, signature, caption, subtitles, brand name, label"

**What v1 taught:** asking a model for lines that "draw themselves" invites the hand that draws them. So the drawing is ours (`sketch.py`), and the model only turns our drawing into the object. Every prompt names only physics, material, light and camera: no company, product, person or style.

**Guardrails kept:**
- No person, face, hand or performance came from a model into anything used.
- No text or logo from a model: the wordmark, the chip and every piece of type are ours.
- The duck is generic: no toy brand.
- Moderation was never lowered.
- No visible watermark was seen on any clip. Veo embeds SynthID (per GENAI §5.1; not re-verified this pass), so the end credits should carry the AI-assisted line (GENAI §6).
- The duck's moulded bill is a toy's, and it never moves or speaks.

---

## 3. The film: ELGOOG's product film, 199 frames, shared by all three

It's built once in `insert.py`. The edit, the grade and everything except v2 and v3 are code.

| Film frames | What | Source |
|---|---|---|
| F0–33 | **A clean colour field and the ELGOOG wordmark.** The field is warm off-white with a soft falloff. The wordmark is Jost 500 at 196 px, each letter in ELGOOG's skewed primaries: rotated, muted and off-brand (teal `#2b9c8c`, raspberry `#c2415e`, indigo `#5a5fc4`, ochre `#de8f2a`). It fades up over F0–4 and drifts up 6 px. From F30 the field dissolves into the page | ours |
| F34–47 | **The line drawing laid down stroke by stroke, drawn by nothing.** It's revealed in `sketch.py`'s stroke order over v3's first frame, with the lines lifted off to make the blank page | ours, on v3 f000 |
| F48–102 | The lines refine themselves, glow, fill and become the duck on its turntable | v3 f000–f054 |
| F103–106 | Dissolve | v3 f055–f058 → v2 f062–f065 |
| F107–136 | **The turn, smooth, on 1s** | v2 f066–f095 |
| F137–150 | **The stutter:** held 2, 2, 3, 3 and 4 frames on v2 f096, f100, f105, f111 and f118. It drops more frames with each hold | v2 |
| F151–198 | **The stills, like a slideshow:** v2 f124 (8 f), f132 (8 f), then **f140 held 32 f (1.33 s)** | v2 |

**The polish, and how it drops away.** On F0–150 the grade is the studio-demo sheen: a soft highlight bloom, the lens vignette and a touch of contrast.
- At the first dropped frame (F137), the smooth motion breaks.
- At the stills (F151) the sheen, the bloom and the vignette go: the stills are flatter and a little less saturated.
- No caption says what happened.
- **The final has no chip** (the lead's ruling). The first review cut had a generic "● LIVE" chip top left over F34–136, gone at the first dropped frame. It survives only in the review cuts `elgoog-demo-a/b/c.mp4`.

**Levels:** exposure is ×0.94, with a soft knee to a hard cap at 194/255, ten levels under 80% white (GENAI §1.10).
- Measured on (a), the film's maximum display luma is 0.799.
- Its picture-area mean luma is 0.648, against 0.296 for the OTS and 0.100 for the two-shot.
- The pixel versions use only palette colours at or below linear Y 0.60, which also leaves out monitor cyan and the cool skin ramps, so the page stays paper.

**Framing:** the full-frame window is the film's rows 100–912 of 1080, because the duck spans rows about 141–900. Inside the monitors, the film is cover-fitted.

---

## 4. The three transitions

**Two things are common to all three:**
- **The pixel room is the show's own art, re-drawn by `pxframes.ts`:**
  - the tag's two-shot: `drawDarkA3` with 32.01's plate (`tally: 3`), Mas `head '34'`, `arm 'rest'`, `look -1`, lit by the monitor, the Orb at his shoulder looking at the monitor (`DPLATE_LOOK.grid`)
  - the monitor kit's `[OTS]` (`drawMonitorOTS`, the screen `MON_OTS` 258×138 at 110, 22)
  - the monitor's picture is the film snapped to the master palette (OKLab nearest, 4×4 ordered dither)
- **The 2S frames continue 32.01's animation phase:** f = 108 + i.

### (a) Push-in: the pick. 233 frames, 9.71 s

| Insert frames | Shows |
|---|---|
| i0–9 | `[OTS]` over his shoulder. His monitor plays the film's opening card in pixel |
| i10–21 | **The push**, in whole-pixel steps held on 3s: a native pixel grows 4 → 5 → 6 → 7 → 8 px (i10, 13, 16, 19), centring on the screen until it fills the frame and the bezel leaves |
| i22–25 | **The grid dissolves into the footage:** the screen's picture at 4-px blocks in the palette (i22–23), then 2-px blocks in true colour (i24–25) |
| i26–198 | **The real film** (F = i). Over F26–33 it settles from the screen's framing to the full-frame window, a smooth 7% ease on real footage while the wordmark is up. Then the lines (i34), the morph (i48), the turn (i107), **the stutter (i137)** and **the stills (i151, i159, i167; the last held to i198)** |
| i199–210 | **The pixel monitor pulls back** around the held still: 8 → 7 → 6 → 5 → 4 px on 3s (i199, 202, 205, 208). The still stays real inside the bezel |
| i211–216 | `[OTS]` hold. At i213 the still on the monitor snaps back to the grid (the palette painter), and the room is whole again |
| i217–232 | **The two-shot:** Mas at the desk, his face lit by the monitor, which holds the frozen duck in pixel. The Orb is watching it |

### (b) Hard cut. 215 frames, 8.96 s

| Insert frames | Shows |
|---|---|
| i0–13 | The two-shot. The demo starts small, in pixel, on his monitor at frame left |
| **i14** | **A hard cut on the beat**, full frame, into the ELGOOG card (F14) |
| i14–150 | The real film, full frame, through the stutter |
| i151–198 | The stills return to the grid: real (i151), then 4-px blocks in true colour (i159), then from i169 **the pixel still**, snapped to the palette on the native grid and held to i198 |
| i199–214 | The two-shot, the pixel still on his monitor |

### (c) Inset. 215 frames, 8.96 s

| Insert frames | Shows |
|---|---|
| i0–198 | The whole film inside the bezel in the `[OTS]`: the real footage at 1032×552, the stutter and the stills visible there, and his head in the foreground |
| i199–214 | The two-shot, the pixel still on his monitor |

### Measured (from the encoded MP4s)

| Check | (a) | (b) | (c) |
|---|---|---|---|
| **Flashes** (`coldopen/tools/flashcheck.py`: the most in any 1 s, limit 3) | **0** (transitions at 22, 208, 217) | **0** (14, 199) | **0** (199) |
| Red flashes | 0 | 0 | 0 |
| Largest mean-luminance step | 0.102 at i217 (the cut to the 2S) | **0.357 at i14 (the hard cut)** | 0.095 at i199 |
| Pass | yes | yes | yes |

- **Film pixels over 0.8 luma:** at most 3 in any frame, all on chroma edges. The room's own highlights, the Orb's lens and the rack, reach 0.985, the same as `tag.mp4` itself.
- **The stutter in (a):**
  - the smooth turn changes 0.50 levels a frame (mean; 0.63 at most)
  - the stutter's holds change by 0.85, 1.71, 1.99, 2.39 and 2.66, so each drop is up to 5× the smooth step
  - the stills change by 8.95, 2.85 and 3.03
- **Reproducible:** re-running `insert.py` from the archived clips gave (c) bit-identical to the file here (the largest mean frame difference was 0.0). `sketch.py` reproduces both conditioning drawings byte-for-byte.

---

## 5. The pick: (a), the push-in (the lead chose it, without the chip)

1. **It's the only one that makes the whole "pixel → native → pixel" arc visible** (PLAN §5.6).
   - We enter through his screen: the push, in the show's own whole-pixel steps.
   - The grid literally dissolves into the real image.
   - We leave the same way: the monitor pulls back around the frozen still, and the still snaps back onto the grid before the two-shot.
2. **It keeps the bezel rule** (style-range §1.4: near-photoreal machine images stay inside a bezel or a signposted render until J5).
   - The full-frame seconds are his screen, reached by pushing into it and left by pulling out of it: the Act Four POV convention.
   - (b)'s hard cut from the two-shot, where the monitor is 60 px wide at the frame's edge, is the weakest signpost of the three. A cold viewer could read it as the show itself changing medium.
3. **The exposure plays full frame, where it reads.**
   - The polish is at its biggest when it breaks: the smooth turn drops frames and the stutter grows.
   - In (c) the stutter happens in a 1032-px inset, and the drops are 1–3 levels on a small picture.
4. **It's the gentlest on the eye.**
   - The luminance rises over the push (i10–26) instead of in one frame. (b)'s cut is a 0.357 mean-luminance step, still passing.
   - It comes back down in four steps.

**Runners-up:**
- **(b)'s way out** (the stills returning to the grid, one per still) is the clearest image of "the polish drops away". If the showrunner wants that, it can be (a)'s way in with (b)'s way out, with no new generation.
- **(c)** is the fallback if full-frame near-photoreal is judged too much for a quiet tag. It's also the closest to E1-P2's filler.

---

## 6. How the tag shot pass splices it

**Where:**
- **At 32.01, after Mas looks up.** In 32.01 he looks up at k50.
- **Recommended:** cut 32.01 at k62, twelve frames on his eyeline, and cut to the insert's i0, the `[OTS]` on his monitor. His look motivates the cut.
- **The file is `elgoog-demo-final.mp4`:** its frame i is tag segment frame 62 + i (i0–232 → frames 62–294).
- **The insert's two-shot (i217–232) replaces 32.01's tail.** There, the Orb's iris goes to the rack 6 frames before the whir. Redraw those 16 frames in `tag/shots.ts` with the plate's `screen` set to `painter/held-still-2s-96x60.png`, and with the Orb's look stepping to `DPLATE_LOOK.tray` 6 frames before 32.02's whir, as 32.01 does now.
- **Net for the tag:** +233 − 46 = **+187 frames (+7.79 s)**, from 33.88 s to about 41.7 s. The simplest alternative is the whole insert after 32.01's last frame (108), for +233 frames (+9.71 s).
- The lock (`show/reel/ep01-v3/ep01-v3-tag.json` → `tag/data.ts`) needs one new shot, `32.01b · ELGOOG DEMO`, and every later shot moves by the insert's length.

**How:**
- The renderer already splices whole frames from PNGs for the frames a segment declares as browser frames (`tools/render.ts`, `GLYPH_DIR/pic/NNNNN.png`).
- Declare the new shot's frames in the tag spec's `browser.frames` (`spec.ts` `BrowserFrames`: `browser: {frames: (f) => f >= 62 && f < 295}` on `defineSegment`), then write the insert's frames numbered from its first segment frame. The Remotion review host would need the same PNGs or a `tag/browser.tsx`; the Node picture render needs only the PNGs.

  ```sh
  S=<scratch>
  bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/insert.py \
      --scratch $S/rw --out $S/rw-out --variants a --no-chip --png $S/glyph --png-offset 62
  GLYPH_DIR=$S/glyph ... node $S/r-tag.cjs picture ...
  ```

  That's 233 PNGs, about 60 MB, identical in picture to `elgoog-demo-final.mp4` before its encode. Delete them after the render.
- The insert's band is the bare band: 32.01's, with no rail. If `DEC 6, 2023` should type here instead of at 32.02, the PNGs need that rail laid over rows 812–1080. The insert's band is constant, so a band-only overlay from the pipeline's `band()` is enough.

**Continuity (optional):** the tag's later two-shots (32.04's scan and 33.01's thud) can keep the frozen duck on his monitor. Pass `painter/held-still-2s-96x60.png` as the plate's `screen` instead of `screenDim`. That's a quiet callback: the Orb re-scans the cover while the staged duck is still up behind him.

**Room for Mas's inner voice** (the script pass may add one line):
- The stillness runs i167–216, about 2.1 s: the last still held for 1.33 s, then the pull-back and its hold. A second window is the two-shot, i217–232.
- Nothing in the insert explains the joke.
- If the V.O. types in the picture's lower rows, as in 32.03, over the full-frame still (i167–198), the pixel type needs its dark shadow on the pale still. Or start the line at the pull-back (i199), so it types over the room.

---

## 7. Sound notes (for the sound and mix passes; the insert is silent)

Frames are (a)'s insert frames. The monitor is the source: the film's sound belongs to the demo, and the room is Mas's.

| Frames | Cue |
|---|---|
| i0–21 | The dark room's bed, as in 32.01. The demo's own bed is heard small, as from the monitor's speaker (band-limited, low) |
| i10, 13, 16, 19 | Optional: four soft detents, one on each whole-pixel push step (or none; the push can be silent) |
| i22–26 | **The studio-demo sheen opens up** as the grid dissolves: full range, bright and airy. Clean pads, a light shimmer, no melody (from the OST engine; no generative music, OST §6.10). The room bed ducks about −10 dB under it |
| i34–47 | The lines drawn by nothing: a faint tonal shimmer rising. No pencil-on-paper scratch, which implies a hand |
| i48–102 | The morph: a slow swell to the fill (about i80–95) and a soft glow or bloom tone as the duck becomes real |
| i107–136 | The turn under the steady sheen |
| **i137, 139, 141, 144, 147** | **The stutter clicks:** a small digital click on each dropped-frame hold, with the sheen chopped in step, a buffering stutter of the bed rather than a musical beat |
| **i151, 159, 167** | **The stills:** the sheen cuts out dead at i151, and there's a drier, harder slide-change click on each still |
| i167–198 | Nothing but the room coming back faintly: the V.O. window |
| i199, 202, 205, 208 | **The room returns** in four steps with the pull-back: fans, LED ticks, MM-12's felt line |
| i213 | A tiny blip (the show's own chip sound) as the monitor's still snaps back to the grid |
| i217–232 | The two-shot: the room full. Hand off to 32.02's whir |

- **For (b):** the sheen hits on the hard cut at i14, and the stutter and stills cues are the same. The grid's return at i159 and i169 gets a small bit-crush step on the dying sheen. The room is back at i199.
- **For (c):** everything stays at monitor-speaker size throughout, with no opening up.

---

## 8. Re-running

```sh
S=/tmp/…/scratchpad/<yours>
# the client (reads RUNWAY_API_KEY from .env; never prints it)
audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/gen.py balance
audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/gen.py i2v --model veo3.1_fast --prompt "…" --negative "…" \
    --first A.png [--last B.png] --duration 6 --ratio 1280:720 --seed 1206 --out $S/raw --name NAME --cap 70 --floor 150 [--dry-run]
# the conditioning drawings (deterministic)
audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/sketch.py $S/v2-first.png                     # = inputs/v2-first-sketch.png
audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/sketch.py $S/v3-first.png --order $S/order.npy \
    --src out/ep01/full-v3/runway/clips/v2-veo31fast-i2v-sketch-s1206.mp4 --frame 48 --keep-pos --facing right
# the three inserts, the comparison, the sheet and the timing (about 2 min of CPU; ~3 GB RAM)
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/insert.py --scratch $S/build \
    [--variants abc] [--no-chip] [--stills a:40,b:14] [--png DIR --png-offset N]
audio/.venv-casting/bin/python studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py out/ep01/full-v3/runway/elgoog-demo-a.mp4
```

`--no-chip` renders without the LIVE chip; the final is `--variants a --no-chip` (§9, point 5).

---

## 9. What's weakest

1. **Nobody has watched it in motion.** Whether the stutter reads as the film breaking, and not as the player buffering, is a viewer's call. Measured, each hold jumps up to 5× the smooth step, and the flat stills give it an in-film cause. Without the chip, nothing in the frame labels it; it could read as "lag" for its first half-second.
2. **v2's turn is slow at first** (F107–136 is mostly the early, profile part of the turn), so the smooth seconds show a gentle rotation, not a showy spin.
3. **The morph's middle** (F70–95, v3 f022–f047) is a soft yellow glow and a double image as the fill arrives. It's clean, but it's the most "AI" looking passage in the film.
4. **The pixel versions of the white card** dither between warm paper and cool grey in the palette. That's the palette's honest limit on a pale field. It shows on the monitor (i0–21) and at (a)'s palette dissolve step (i22–23).
5. **The "● LIVE" chip: resolved.** It was invented (the real demo was a pre-recorded "hands-on" video, not labelled live), so the lead cut it. The final's exposure is the stutter and the polish dropping.
6. **The wordmark echoes a four-colour scheme on white in a geometric sans.**
   - That's the parody, in the show's established ELGOOG "skewed primaries": rotated order, muted, off-brand hues, and Jost, not any real mark's type.
   - The guardrails owner should look at it once.
7. **(a)'s settle** (F26–33) is a smooth, non-grid 7% reframe on the real footage, under the wordmark. It's intended as the film's own move, but a sharp eye may see the frame breathe.
8. **The `[OTS]`'s back of Mas's head** is the monitor kit's existing drawing: a hatched oval and a flat shoulder, reused as is.
9. **SYNTH** (style-range R23: a near-raw model clip in its native look) was on paper until today. The showrunner's go covers trying it; whether it ships is still the showrunner's call on picture.

---

## 10. Keys and disk

- **Keys:** the key never left `gen.py`'s Authorization header. After both inserts, I scanned every file this pass wrote for the key's value and found no match: the tools, `out/ep01/full-v3/runway/`, this file and both scratch folders.
- **Disk:** `out/ep01/full-v3/runway/` is about 23 MB.
  - **Kept:**
    - the three chosen clips (v2, v3, h4: 3.1 MB)
    - the finals and review cuts
    - the inputs (4 MB)
    - the provenance of all eight generations
  - **Deleted:** the downloads of v1, h0, h2 and h3, the working renders, the frame caches and both scratch folders.

---

## 11. The second insert: Ttemme's hourglass (Act Four S7.13)

**The lead's brief (2026-09-27, the same authorization):**
- Act Four's hourglass at the return (S7.13: "the hourglass shatters, only the glass… the sand holds the shape for one beat, then falls").
- To pass the style-range owner test, it's **Ttemme's own broadcast**, not the show's flourish. He ran a streaming site, and S7.13 already shows his `LIVE · CHAT`.
- Objects only. It's wrapped in our coded stream UI, and it ends back in pixel.
- His post's text stays as the lock has it.
- At most 150 credits and 2 video takes. Stop and report if the first take shows a person, a hand or text.

**Result:** 135 credits: two video takes (60 each) and three stills (5 each). Take 2 is kept. Neither take showed a person, a hand, a face or text, so the stop rule never triggered.

### 11.1 Files

| What | Where |
|---|---|
| **The insert:** S7.13 k128–263, 136 frames, 5.67 s, 1920×1080, 24 fps, silent | `out/ep01/full-v3/runway/hourglass-s713.mp4` |
| **In context:** the whole new S7.13, k0–263, 264 frames, 11.00 s. k0–127 is the Act Four pipeline's own frames (`r-act4.cjs native`), untouched | `out/ep01/full-v3/runway/hourglass-s713-in-context.mp4`, `hourglass-s713-sheet.png` |
| Every frame's source (pane mode, take frame) and the marks | `out/ep01/full-v3/runway/hourglass-s713-timing.json` |
| **The take kept**, with its provenance | `out/ep01/full-v3/runway/clips/h4-veo31fast-keyframes-shatter-s1121.mp4` (+ `.provenance.json`) |
| The still used for the first keyframe (its record) | `clips/h1-gen4image-still-s1121.provenance.json` |
| The unused and rejected generations' records (the downloads were deleted) | `clips/rejected/h0-…`, `h2-…` (take 1), `h3-…` |
| **The two keyframes sent, as sent**, and the model still the first one was made from | `inputs/s713-first-keyframe.png`, `inputs/s713-last-keyframe.png`, `inputs/s713-h1-model-still.png` |
| The tools | `studio/src/dev/genvideo/runway/hg_still.py` (runs the model still's sand out), `hg_after.py` (builds the aftermath keyframe), `streamframes.ts` (the pixel stream frame), `hourglass.py` (the compositor), and `gen.py` (now with `t2i` for stills) |

### 11.2 The generations, in order

| # | What | Model | Credits (balance) | Verdict |
|---|---|---|---|---|
| h0 | A still of his hourglass on the desk (the first keyframe's source) | gen4_image 720p, seed 1121 | 5 (340 → 335) | Unused. Clean, but the upper bulb was still full and the camera was at desk level |
| **h1** | The same, asked to show the sand run out and a higher angle | gen4_image 720p, seed 1121 | 5 (335 → 330) | **Used as the source.** Clean, but the model still left sand on top. `hg_still.py` (code) runs it out: each sand row of the upper bulb takes one of the bulb's empty rows above it, squeezed to that row's glass width, the glass glints kept; the grain thread is painted out. Result: `inputs/s713-first-keyframe.png` |
| h2 | **Take 1:** image-to-video from the first keyframe | veo3.1_fast, 6 s, seed 1121 | 60 (330 → 270) | **Rejected.** Clean (no person, hand or text), but the model refilled the upper bulb (f025), burst the top (f038–f046), then **re-formed the glass whole** and poured the sand from an intact hourglass. The sand never held its shape |
| h3 | An aftermath still for a last keyframe, referenced on the first | gen4_image 720p, `@glass` reference | 5 (270 → 265) | Unused. The model kept the bulbs whole (it only added shards) and moved the camera. The last keyframe was built in code instead: **`hg_after.py`** removes the bulbs from our first keyframe (a measured profile), fills in what was behind them (the wall and the LED strip from the same rows, lighting-matched), draws the back post solid, heaps the sand on the base, restores the front posts, and scatters **take 1's own shards** on the desk (its f070, same locked camera). Result: `inputs/s713-last-keyframe.png` |
| **h4** | **Take 2:** first and last keyframes, both ours | veo3.1_fast, 6 s, seed 1121 | 60 (265 → 205) | **KEPT.** Clean. The glass cracks (f028–f045), bursts (f046–f052, the bulbs fly off), **the sand stands on its own with no glass (f052–f080)**, slumps (f086–f100) and heaps (f106), landing on our aftermath |

**The prompts, verbatim.** Only physics, material, light and camera. No person, site, brand or style.
- **h0:** "A real photograph taken by a streaming webcam on a desk at night: an antique tabletop hourglass stands alone on a dark walnut desk, seen from slightly above. Turned dark walnut end caps, four slim turned wooden posts, clear glass bulbs. Almost all of the orange-amber sand has run into the lower bulb; a thin last thread of grains falls through the neck. The room is dark; a cyan LED strip behind the desk throws a cool rim light along the glass, and a soft warm key light comes from the front left. Slight webcam softness and sensor noise, shallow depth of field, the hourglass centred with empty desk around it. Nothing else on the desk."
- **h1:** "A real photograph from a streaming webcam clipped above a dark walnut desk at night, looking down at about 35 degrees: an antique tabletop hourglass stands alone in the middle of the desk. Turned dark walnut end caps, four slim turned wooden posts, clear glass bulbs. The upper bulb is completely empty: all of the orange-amber sand has run out and lies heaped in the lower bulb. The room is dark; a cyan LED strip along the far edge of the desk throws a cool rim light on the glass, and a soft warm key light comes from the front left. Slight webcam softness and sensor noise, the hourglass centred with empty desk around it. Nothing else on the desk."
- **h2 (take 1):** "Locked-off streaming-webcam view of an antique hourglass on a dark walnut desk at night; all its sand has run out into the lower bulb. For a moment nothing moves. Then the glass of both bulbs suddenly cracks and shatters outward into small glittering shards that fly out and fall onto the desk, but the orange sand keeps the exact shape of the lower bulb, standing on its own for a moment with no glass around it, before it collapses and pours down over the wooden base into a soft heap. The wooden frame and its posts stay standing. The cyan light and the warm key stay unchanged; slight webcam softness and sensor noise. Nothing else enters the frame."
- **h3:** "@glass photographed from the same camera a moment after its glass shattered: the same walnut hourglass frame, its two end caps and four turned posts, stands on the dark desk with no glass left in it at all. Small clear glass shards lie scattered across the desk around it. The orange sand lies in a soft low heap on the wooden base, where the lower bulb was. Same framing, same cyan LED strip and warm key light, same webcam softness. Nothing else on the desk."
- **h4 (take 2):** "Locked-off streaming-webcam view of an antique hourglass on a dark walnut desk at night; the upper bulb is empty, all the sand is in the lower bulb. For a moment nothing moves. Then both glass bulbs crack and shatter at once, the shards flying out and scattering across the desk, and the glass is gone for good. For one still beat the orange sand keeps the exact shape of the lower bulb, standing on the base like a sand sculpture with no glass around it. Then it slumps and pours down into a low heap on the wooden base. The wooden frame and its posts stay standing and never move. The camera never moves; the cyan light and the warm key stay unchanged; slight webcam softness and sensor noise. Nothing else enters the frame."
- **The negative prompt for both takes:** "hand, hands, fingers, arm, person, people, face, human, text, letters, words, numbers, logo, watermark, caption, subtitles, fire, smoke, explosion"

**The one repair in the take:** in f025–f045 the model refilled the upper bulb again for about 0.9 s before the burst. The camera is locked, so `hourglass.py` gives those frames' upper bulb f024's pixels everywhere except the new crack lines (bright, colourless, changed), and paints out the grain thread under the neck. On the frames, the bulb stays empty while the cracks spread.

### 11.3 The beat (frames are S7.13's own k, from its first frame)

**The stream frame** (`streamframes.ts`, native 480×270, the show's palette and type):
- the player pane at native (8, 11), 328×184, which is 1312×736 on screen
- `● LIVE  TTEMME` under it
- the `LIVE · CHAT` column at right, in the chat-panel kit's look: the N1 panel, the N3 header, the red dot, every handle a coloured dash, no usernames
- a thin generic top bar with three dots. It has no mark and no colours of any real site.

| k | Shows |
|---|---|
| 0–127 | **Unchanged:** the lock's S7.13 as the Act Four pass draws it, the pixel overhead, the chat corner and **his post, k21–127, as the lock has it** |
| **128** | **Cut to his stream**, on the post clearing. The pane is his cam in pixel: the take snapped to the palette on the native grid. The chat scrolls `F`, `F F` |
| 134–166 | His line, "Chat, we're so back." (O.S., the lock's take), plays over the stream |
| 140–143 | **The grid dissolves:** the native grid in true colour (k140–141), then 2-px blocks (k142–143) |
| 144–237 | **His cam, real** (take f017–f110): the calm, the cracks spreading (from about k155) |
| **167** | The chat turns: every new message is "we're so back" (`WE'RE SO BACK`, `so back`, `WE ARE SO BACK`), scrolling four times as fast |
| **173** | **THE SHATTER** (take f046), on the lock's own mark and SFX spot. The bulbs burst and fly off |
| 179–207 | **The sand holds its shape, standing on the base with no glass:** "one beat", about 1.2 s |
| 208–227 | It slumps and pours |
| 228–237 | The heap, settling |
| 238–241 | The grid returns (2-px blocks, then the native grid in true colour) |
| 242–251 | The pane in pixel again (f115–f124) |
| **252–263** | **Back to the show's pixel:** S7.13's own last frame (lock k194, the Act Four pipeline's pixel aftermath: the frame empty, the heap on the base, the shards), held 12 frames |
| 264 | S8.01 |

**Measured** (the encoded MP4s):
- The flash check (limit 3) passes on the insert and the in-context cut: **0 flashes**, 0 red, and no frame-level transitions at all.
- The largest mean-luminance step is 0.035.
- The real part is graded as a webcam, not a product film: no bloom and no vignette, exposure ×0.95 and the same soft knee to 194/255, clamped after resizing. The brightest decoded pane pixel is 0.829 luma, on isolated chroma edges from the 4:2:0 encode.
- The pane's mean luma is 0.24 in pixel and real alike, so the dissolve doesn't jump.
- A rebuild from the archived clip is bit-identical, with the largest mean frame difference 0.0.

### 11.4 Why this passes the owner test

- **Every near-photoreal frame is his broadcast:** inside his stream's player, with his name under it and his chat beside it. It's machine-adjacent media inside a bezel, not the show changing medium. That keeps the bezel rule (style-range §1.4).
- **The pixel arc is complete.** We cut from the show's pixel overhead into his stream, the stream's picture resolves to real, it breaks, it returns to the grid, and we're back on the show's own pixel aftermath.
- **The chat carries the story:** F while the time runs out, "we're so back" when he says it, and the glass going on the flood.

### 11.5 Splice notes for the Act Four pass

**On the current lock** (`act4/data.ts`, from `show/reel/ep01-v3/ep01-v3-act4.json`):
- S7.13 is segment frames **11326–11520** (195 f).
- Its marks: `grain 7`, `post 21–127`, the line a5-30-18 at k134–166 (held to k178), `shatter 173`, `fall 183`, and SFX `hourglass_shatter @173`.
- S8.01 starts at 11521.

**All positions are relative to S7.13's first frame** (k), so they hold if the v3.1 revision moves the beat.
1. **Lengthen S7.13 from 195 to 264 frames** (8.125 → 11.00 s, +69 f, +2.875 s). S8.01 then starts at S7.13 + 264. Act Four grows from 12,571 to 12,640 frames.
2. **k0–127 stay the Act Four layout.** **k128–263 are the insert**: `hourglass-s713.mp4` frame j = S7.13 k(128 + j).
3. **The marks:**
   - `shatter` stays at k173.
   - `fall` becomes the slump at k208. The sand stands k179–207 and is heaped by k233.
   - New marks: `stream` k128, `real` k144–237, `pixel` k242, `room` k252.
4. **The render:**
   - Declare k128–263 as browser frames in the Act Four spec (`act4/shots.ts`'s `defineSegment`, which declares none today; `act4-v5` shows the pattern for its J1: `browser: {frames: (f) => …}`). The Node picture render needs only the PNGs. The Remotion review host would need them too, or an `act4/browser.tsx`.
   - Write the PNGs numbered by segment frame:

     ```sh
     bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/hourglass.py \
         --scratch $S/hg --out $S/hg-out --png $S/glyph --s713 <S7.13's first frame on the lock in use>
     GLYPH_DIR=$S/glyph ... node $S/r-act4.cjs picture ...
     ```

     That's 136 PNGs, about 35 MB. Delete them after the render.
   - Or splice the MP4 at assembly.
5. **If the revision moves marks inside S7.13:**
   - `--shift N` moves the whole insert, and its shatter, N frames later. Use it if the post's end and the shatter move together.
   - `--back-at K` sets when the chat turns (his line's end + 1).
   - `--s713` must name the lock's S7.13 start, because the insert's last 12 frames are that lock's own pixel aftermath (its k194).
6. **The band:** the insert carries the Act Four frame's own bare band, constant through S7.13. No rail or V.O. types there.
7. **Continuity:** the room's chat corner in the last 12 frames is the lock's drawing, which still says `F`. If the Act Four pass wants the flood to carry over, its S7.13 last frame can show "so back" rows.

### 11.6 Sound notes (the insert is silent)

| k | Cue |
|---|---|
| 128 | The cut into his stream: the room drops to the stream's own sound, his mic's room tone (thin, a little compressed). MM-11 carries under it, ducked |
| 134–166 | His line, as recorded (O.S.). It could take a light "through his stream" colour, since he's talking to his chat |
| 140–143 | A short bit-crush-to-clean sweep on the stream audio as the grid dissolves |
| ~155, 161, 168 | Small glass ticks as the cracks spread |
| **173** | **The lock's `hourglass_shatter`**, now over real glass. It can be larger than the −18 dB spot, within the act's mix |
| 174–178 | Shards landing and skittering on the desk |
| **179–207** | **The held beat: near silence.** The sand stands. Let the music hold its breath here too; it's the gag's timing |
| 208–227 | The sand slumps: a soft pouring hiss, then a settle |
| 238–251 | The stream audio crushes back as the grid returns |
| 252 | The cut back to the boardroom: its room tone and MM-11 at full, handing to S8.01's brass stab on the sign |

- The chat stays silent: no notification pings. The flood reads on screen.

### 11.7 What's weakest

1. **Nobody has watched it in motion.** In particular: does the 1.2 s stand of sand read as "the sand holds the shape", or as a model glitch? It is a tall cone rather than the exact bulb.
2. **The bulbs leave as two whole round bubbles**, not a spray of shards (f050–f075). The shards on the desk come later, from the keyframe.
3. **The repaired frames (k152–172)** keep a faint seam where the old sand surface was, visible at 1:1 in the zoomed stills. It's small at pane size.
4. **The site chrome is deliberately generic.** It's dark, with no mark, and doesn't echo any real streaming site's colours or layout beyond a player and a chat.
5. **SYNTH again:** as with the duck, a near-raw clip inside a bezel is the showrunner's call on picture.
