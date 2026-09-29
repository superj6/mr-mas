# genvideo: model-generated video, in our look

These tools take video from a generative video model and bring it into MR. MAS as **our pixel art**. The result is a clip on the 480×270 grid, in the master palette, held on 2s, and stable frame to frame. The engine can then mask it, palette-switch it, glyph it and cut it like any other pixel shot. They also go the other way: they export our own shots as conditioning frames for image-to-video models.

The first pass of the show stays fully programmatic. These tools are for **select segments** where generated motion adds something (see [Where it fits](#where-it-fits)). No video model is connected yet. Everything here was tested on our own smooth renders and on two synthetic stand-ins for model output ([Tests](#tests)).

```
 our shot ──keyframes.py──▶ start/end plates, masks, guide ──▶ [ video model ] ──▶ raw.mp4
                                                                                    │
            ┌──────────────────────────────── pixelize.py (or glyphize.py) ◀────────┘
            ▼
 studio/public/genvideo/<shot>/  (indexed PNG drawings + clip.json)
            │
            ▼
 <GenVideoScene> in a composition: blitGen() inside a mask, match cut / genHandoff(), any engine switch
```

| File | What it is |
|---|---|
| `pixelize.py` | video, frame folder or one image → our pixel look: native PNG drawings + `clip.json`, a 1080p MP4, comparison video, stills |
| `glyphize.py` | video or converted clip → the GLYPH look (a port of the engine's glyph renderer), as a 1080p MP4 |
| `keyframes.py` | one of our compositions → conditioning inputs: start/end clean plates, soft and model-size variants, motion masks, a layout guide, a reference video, a prompt scaffold |
| `gvlib.py` | shared code: bundled-ffmpeg IO, OKLab, palette tables, the engine's `hash()` port, k-centroid downscale, temporal filter, 24 fps conform |
| `export_palettes.ts` → `palettes.json` | the engine's palettes, sets, threshold tiles and glyph constants, exported by the engine's own code |
| `test_genvideo.py`, `dump_room.ts` | the test bench (writes `out/lookdev/genvideo/tests/`) |
| `src/shared/pixel/genclip.ts`, `GenVideo.tsx`, `plate.ts` | the Remotion side (exported from `src/shared/pixel`) |
| `src/dev/genvideo/` | demo compositions (`genvideo-window`, `-handoff`, `-glyph`, `-clip`) |

---

## Setup

```bash
cd /home/jgon/project/art/mrmas
python3 -m venv audio/.venv-genvideo
audio/.venv-genvideo/bin/pip install numpy opencv-python-headless imageio pillow scipy   # frozen: audio/requirements/venv-genvideo.txt
```

- **ffmpeg** is Remotion's bundled binary (`studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`, with `LD_LIBRARY_PATH` set to that folder). `gvlib` does this for you.
  - It is a minimal build: no `select`, `fps`, `tile` or `overlay` filters, and no rawvideo muxer or demuxer. Frames therefore leave ffmpeg through `image2pipe` with the rawvideo codec, and go back in as fast PNGs. Every frame operation happens in numpy.
- **`palettes.json`** is generated. Re-export it whenever `palette.ts`, `palettes.ts`, `freeze.ts` or the glyph defaults change:
  ```bash
  cd studio
  npx esbuild tools/genvideo/export_palettes.ts --bundle --platform=node --outfile=/tmp/genvideo-pal.js --log-level=warning
  node /tmp/genvideo-pal.js tools/genvideo/palettes.json
  ```
  The exporter runs the engine's own code: 91 master colours, and the compiled `[a, b, t]` entry of every palette set for every master colour. The Python side never re-types a hex. `gvlib` checks its `hash()` port against the engine's values each time it loads.

---

## The loop, end to end

```bash
PY=audio/.venv-genvideo/bin/python; T=studio/tools/genvideo

# 1. Export conditioning for the shot (Remotion renders it; about 1 min with a bundle)
$PY $T/keyframes.py --entry src/dev/pixeladv/entry.tsx --comp pixeladv-scene --start 0 --end 47 --shot room-sky \
    --mask 'colors:N2,N3,N4@22,32,81,75' --layout adventure --ui-band fill --model-size 1280x720 --ref-video \
    --prompt "Clouds drift slowly across the night sky behind the skyline; nothing else moves."
#    -> out/lookdev/genvideo/keyframes/room-sky/: start-plate.png, end-plate.png, mask-0.png, guide.png, keyframes.json ...

# 2. Generate with an image-to-video model (first frame = start-plate.png, optional last frame = end-plate.png,
#    motion mask = mask-union.png if the model takes one). Use keyframes.json's prompt scaffold. Save as raw.mp4.

# 3. Convert (keyframes.json prints this exact command for the shot)
$PY $T/pixelize.py raw.mp4 --preset plate --families NUCWFG --match out/lookdev/genvideo/keyframes/room-sky/start-native.png \
    --duration 2.0 --out-frames studio/public/genvideo/room-sky --out-mp4 out/lookdev/genvideo/room-sky-1080p.mp4 --compare out/lookdev/genvideo/room-sky-cmp.mp4

# 4. Use it in the shot (see "Remotion" below): <GenVideoScene clip="genvideo/room-sky" .../> + blitGen() in the sky mask
```

---

## pixelize.py

```
video ─ fit 16:9 (cover / crop) ─ block-scale ─ [pan-lock] ─ OKLab ─ k-centroid ↓ 480x270
      ─ motion-compensated temporal filter ─ 24 fps conform (held on 2s) ─ clip-level tone (--match)
      ─ palette mapping with hysteresis (+ dither on big gradients only) ─ blink suppression ─ orphan cleanup
      ─ [1-px dark outline] ─ [engine palette set] ─ outputs
```

- **Downscale (k-centroid).** Each 2×2 to 4×4 source block becomes its area mean where it is flat, and the centroid of its *dominant* 2-means cluster where it straddles an edge. Contours stay crisp, with no muddy in-between colours. Ties go to the darker cluster, so lines keep their ink. The block size comes from the source height (540p gives 2, 1080p gives 4).
- **Temporal filter.** A recursive filter at native resolution, carried along DIS optical flow. It averages where the warped history agrees with the new frame to within noise, and takes the new frame where it disagrees (motion, occlusion, a real change). It removes model grain and exposure flicker *before* quantisation, which is where boiling starts.
- **Conform.** It picks the nearest source frame on the 24 fps grid and never blends, because blends ghost in pixel art.
  - `--on 2` (default) holds drawings on 2s.
  - `--on auto` holds on 2s but switches to 1s through fast camera moves (a pan on 2s judders at 4×), with at least 6 frames per mode.
  - `--speed`, `--t-in`/`--t-out` and `--duration` retime and trim.
  - Any source rate works (16, 24, 25, 30, VFR); timestamps come from the packets.
- **Palette mapping** (`--mode`):
  - `ramp` (the default preset) works the pixel-art way:
    - Each region picks a colour **family** from a blurred, box-smoothed cost to each family's hand-ordered ramp: night N, cyan C, tungsten W, skin S/K/X, and so on.
    - The family choice has its own hysteresis. Small details (text, eye whites, glints) keep their own family when the region's family is clearly wrong.
    - The region is then quantised along that ramp.
    - Faces get one clean skin ramp and never a stray hue.
  - `nearest` (the plate preset) takes the nearest non-skin colour and can dither across neighbouring families. A violet night between N and U renders as a dithered mix. Two different families cost extra to dither (`--xfam`), which removes stray grey dots.
  - `hybrid` uses skin ramps for skin regions and nearest colour elsewhere.
- **Temporal hysteresis.** Each pixel's previous state (colour, or dither pair and mix) is carried along the flow. It is kept unless the new best choice is better by `--hyst` (OKLab ΔE, default 0.02). The flow is checked forward and backward, so occlusions always refresh.
  - **Blink suppression** turns A-B-A flips on static pixels into A-A-A.
  - **Orphan cleanup** merges isolated single pixels into their most similar neighbour. It keeps high-contrast glints.
- **Dither: only on big gradients** (`--dither gradients`). It needs:
  - a smooth region (no edge within 2 px) that holds a broad gradient, with connected area ≥ `--min-area`;
  - never skin (skin families plus a 2-px margin), per the dither-discipline rule;
  - pairs from adjacent rungs (ramp mode) or near palette neighbours only.

  The region itself has hysteresis, so its border doesn't crawl. `--mixes 0.5` (default) gives 50% band seams, like the engine's light falloff; `0.25,0.5,0.75` gives smoother skies. `--protect face.png` blocks dither in a region, and `--dither-mask sky.png` allows it only there.
  - **Anchor.** By default the threshold tile is fixed to the frame, as in the engine: gradients that don't move with the camera (skies, glows) stay rock-solid. `--dither-anchor camera` makes the pattern ride the pan, for painted plates that scroll.
- **`--pan-lock`** (plate preset). It measures the camera translation (phase correlation) and resamples each frame so that content lands on whole native pixels. A pan then moves in rigid 1-px steps, like `shiftBuf`, and edges don't crawl. It handles translation only, not zoom or parallax.
- **Tone.** `--match keyframe.png` maps OKLab L percentiles and the a/b mean to the conditioning keyframe. It takes its statistics from the clip's first 0.5 s (`--match-window`), where an image-to-video model is still showing the keyframe, so the correction captures the model's colour shift and not the content that enters later. Other controls: `--exposure` (stops), `--sat`, `--lift`, `--match-chroma`.
- **`--outline dark`** (character preset). On a strong lightness step, the pixel on the dark side walks `--outline-k` rungs down its own family, which gives a clean 1-px contour. It is a palette operation, like the engine's family step.
- **`--set TERMINAL|ONEBIT|EARLYWEB16|LEDGER|2TONE_FREEZE|FREEZE_<WHO>_ROOM...`** applies an engine palette set exactly as compiled (entries plus threshold tile). In Remotion, prefer to keep the clip BASE and switch it in the engine.
- **`--families`.** Restrict the palette per shot with letters (`NCWSKX`) or a preset: `night`, `sky`, `dusk`, `cool`, `warm`. `--exclude Q` means never rocket red.

**Presets**

| Preset | Use | Mode | Dither | Holds | Notes |
|---|---|---|---|---|---|
| `default` | a generated insert | ramp | 50% seams on big gradients | 2s | denoise 0.7, hyst 0.02 |
| `plate` | skies, weather, smoke, environments, pans | nearest | 25/50/75% on gradients | auto | pan-lock, denoise 0.8 |
| `character` | figures in motion | ramp | none | 2s | 1-px dark outline, hyst 0.025 |
| `pixel` | a source already on our grid (round trip) | nearest | none added | 1s | the source's own dithers survive |
| `naive`, `naive-dither` | baselines, for comparisons only | nearest | none / everywhere | 1s | area downscale, no stabilisation |

**Outputs**
- `--out-frames DIR` writes indexed PNGs (`d0000.png`…, only the unique drawings) and `clip.json`: the timeline (output frame → drawing), source, params and stats.
- `--out-mp4` writes 1920×1080 H.264 (4× nearest, the intro master's settings).
- `--compare` writes before | after at 1920×540.
- `--stills` writes before, after and pair PNGs.
- `--boilmap` writes a heat map.
- `--stats` writes the stability JSON.

**Speed:** about 0.5–1.5 s per source frame on this CPU while other renders run (the k-centroid pass, and DIS flow twice per frame). A 5 s clip takes 1–4 min.

---

## glyphize.py

GLYPH is for **dark foreshadowing only** (PIXEL_GUIDE §2 rule 2). `glyphize.py` is a port of `glyph.ts` `glyphLayer()` plus `glyphDraw.ts` `drawGlyphLayer()`:
- **Cells:** 2×3 native px per cell. Density comes from the OKLab tone curve (62% mean, 38% max), and colour is the lightness-weighted average.
- **Glyph ramp:** measured from the same JetBrains Mono file the engine loads, with the same 44 px probe. Contour glyphs (`- \ | /`) come from a Sobel on cell densities.
- **Colour and shimmer:** colour is `gain · (0.62 + 0.95 v)`, leaning to C6 in the shadows. The shimmer uses the engine's `hash()` (the port is verified), and the two-radius bloom matches the engine's.
- **Additions for video:** the same conform, temporal filter and palette pre-mapping as `pixelize.py`, plus per-cell hysteresis (`--glyph-hyst`) so that the only motion is the intended shimmer.

```bash
$PY $T/glyphize.py studio/public/genvideo/<clip> --out-mp4 out/lookdev/genvideo/<clip>-glyph.mp4   # from a converted clip
$PY $T/glyphize.py raw.mp4 --tone 0.1,0.5,0.8 --noise 0.35 --bloom 0.8 --mask cone.png --out-mp4 ...
```

Inside a composition, the canonical path is the engine itself: `<GenVideoScene clip=... switch={{type: 'glyph', mask}}/>`. Use `glyphize.py` for offline previews and whole-frame glyph inserts. The two are compared in `out/lookdev/genvideo/tests/stills/glyph-compare.png`. The glyph rasteriser differs (Pillow/FreeType vs Chrome), so strokes differ at sub-pixel level. Cells, glyph choice, colours and shimmer are the same.

---

## Remotion: `GenVideo.tsx` / `genclip.ts`

Clip folders live under `studio/public/` (`pixelize.py --out-frames studio/public/genvideo/<shot>`). All of it is exported from `src/shared/pixel`.

```tsx
import {GenVideoScene, blitGen, genHandoff, maskFromColors, radialMask, PAL} from '../../shared/pixel';

// Only the sky: key the window's sky colours inside the window rect (the skyline and blinds stay in front)
<GenVideoScene clip="genvideo/room-sky" placement={{loop: true}}
  draw={(fb, f, gen) => {
    drawRoom(fb, f);
    if (gen) blitGen(fb, gen, {mask: maskFromColors(fb, [PAL.N2, PAL.N3, PAL.N4], [22, 32, 81, 75]), dy: -118});
  }} />

// Only the ceiling hole (it opens in 3 held steps; ink the rim)
blitGen(fb, gen, {mask: new Mask().addEllipse(338, 12, 34 * k, 11 * k)});

// Match cut from our live frame to the clip conditioned on it, hiding the re-quantisation over 5 frames
draw={(fb, f, gen) => { drawRoom(fb, f); if (gen && f >= 40) genHandoff(fb, gen, (f - 39) / 5); }}

// Any engine switch applies to the clip: GLYPH in an iris, a freeze print, the render front
<GenVideoScene clip="genvideo/x" switch={(f) => ({type: 'glyph', mask: radialMask(240, 110, r(f))})} />

// Whole-frame insert, straight cut, nothing of ours on top (H.264: colours no longer exact palette entries)
<GenVideoPlayer src="genvideo/x-1080p.mp4" />
```

- **`<GenVideoScene clip placement draw? ...PixelSceneProps>`** is a `PixelScene` whose `draw(fb, f, gen)` also receives the clip's current drawing as a palette-exact `Buf`, or `null`.
  - `placement`: `{from, offset, loop, stretch, outside: 'hold' | 'none'}`.
  - Every drawing is loaded under `delayRender`, and `continueRender` fires after the drawing is committed, so no frame renders without its drawing.
  - The PNG readback was checked: a rendered demo frame contains 0 colours outside the master palette.
- **Hooks:** `useGenClip`, `useGenDrawing`, `useGenFrame`.
- **Pure helpers** (also for Node previews): `blitGen`, `genHandoff`, `maskFromColors`, `maskFromBuf`, `genDrawingAt`, `bufFromRGBA`.
- **The join rule.** The transition vocabulary is four (PIXEL_GUIDE §2 rule 7). An insert joins by a **match cut**: the clip was conditioned on our own frame, so a hard cut is invisible. `genHandoff` only hides the small re-quantisation differences over 2–6 frames on frames that already match; it is not a visible dissolve. A visible change of world uses the show's own transitions (for example, `renderFront` between our `Buf` and the clip's `Buf`).
- **Clean plates.** Render any composition with `--props='{"genvideoPlate":true}'` and every `<PixelScene>` shows only what `draw()` paints: no `after` UI layer, no glyph layers, no palette or switch specs. The flag is opt-in, so nothing changes without the prop. Scenes that paint UI inside `draw()` (the adventure verb band) can check `isGenvideoPlate()`, or use `keyframes.py --ui-band fill`.

Demos: `npx remotion render src/dev/genvideo/entry.tsx genvideo-window|genvideo-handoff|genvideo-glyph ...`. They use the bench's clips in `studio/public/genvideo/_test/` (gitignored; run the bench first).

---

## keyframes.py

For a composition and frame range it writes the following to `out/lookdev/genvideo/keyframes/<shot>/`:

| File | What it is |
|---|---|
| `start.png`, `end.png` | the frames as they air (1080p) |
| `start-plate.png`, `end-plate.png` | **the conditioning images** (clean plates: first frame / last frame) |
| `*-plate-soft.png` | the grid melted (cubic up plus a light blur), for models that wobble hard 4×4 pixels. Try both; `pixelize` restores the grid either way |
| `*-plate-WxH.png` | the plate at a model's native size (`--model-size`, repeatable) |
| `start-native.png`, `end-native.png` | the 480×270 truth (`pixelize --match` uses it) |
| `mask-N.png`, `mask-union.png` | 1080p motion masks, white = animate here. The same regions go to `blitGen()` when the clip comes back |
| `guide.png` | the plate with the native grid, title/action safe areas, the UI band (adventure layout) and mask outlines |
| `sheet.png` | the contact sheet |
| `ref.mp4` | (`--ref-video`) the shot itself as a 960×540 plate, a motion reference for video-to-video models: our programmatic first pass steering the generated one |
| `keyframes.json` | frames and seconds (ask the model for about 0.5 s more), the colours and families on screen, the exact `pixelize` command, a prompt scaffold with the guardrails |

- **Mask specs** are in native coordinates:
  - `rect:x,y,w,h`
  - `ellipse:cx,cy,rx,ry`
  - `colors:N2,N3,N4@x,y,w,h`: those master colours inside the rect. This keys a sky, a window or a KEY colour you paint on purpose.
  - `png:path`
  - `room`: the adventure room above the verb band
- **The bundle** is cached in `studio/out/genvideo-bundles/` and can be reused with `--bundle`.

---

## Where it fits

The pixel engine stays the show. Generated motion is **raw material** that goes through `pixelize` / `glyphize` and in through a mask. These are pipeline notes; the creative calls are the showrunner's.

**Good fits:** texture-rich, secondary motion that is expensive to hand-pixel and forgiving of small drift.
- Skies and weather behind our windows and skylines: drifting clouds, rain, the dusk skyline's bar-10 sky. Use the `plate` preset with a colour-keyed sky mask. Demo: `genvideo-window`.
- Fire, smoke, dust and debris:
  - the intro ceiling burst (f405–419): tile debris and dust through the hole mask, with the booster flame loop
  - the effigy fire (f290), with the freeze print applied by the engine on top
- Volumetric light and LED shimmer on the server cathedral wall (f285–299), masked to the wall.
- The Orb's "true world" (f100–104). A generated fly-through with a vanishing point on the cone axis, glyphized, inside the cone mask. Five frames of foreshadowing, so the payoff per effort is low.
- Camera moves through a room we already built, conditioned on our start and end plates (the Ep1 vertical scroll into the kitchen). This is the riskiest case: models invent geometry. Check it against `end-plate.png`.

**Keep hand-built:**
- dialogue and acting: mouth charts and held drawings are the look
- portraits and name cards
- any text, logo or UI: models garble text, and parody marks are drawn by us
- close-ups of the cast's faces: likeness and boil risk
- the four transitions
- anything the guardrails touch

**The same ingest works for stills:** `pixelize.py plate.png --duration 4` turns one image-model painting into a pixel plate. That is the "other programmatically generated parts" case for backgrounds and textures.

**Guardrails (binding; they are also written into `keyframes.json`):**
- Never name a real person, company or product in a prompt, and never ask for a likeness. Describe our designs.
- Nothing photoreal ever reaches the screen: everything goes through the converters.
- Parody names and logos are drawn by us, never generated.
- Discard any model audio: no generated voices, and never a cloned voice.
- 1080p maximum.

---

## Tests

`$PY studio/tools/genvideo/test_genvideo.py [--only satire,sky] [--jobs 2]` writes the following to `out/lookdev/genvideo/tests/`:
- `*-sheet.png`: source | naive | tuned, with 4× crops and **boil heat maps**
- `*-cmp.mp4`: before | after
- `*-tuned-1080p.mp4`
- `results.json`

Sources:
- our structure renders `satire` and `puppet` (smooth 2D shading, faces, glows, gradients)
- `stress`: a **synthetic** stand-in for weak model output (satire at 16 fps and 832×480, with grain, exposure flicker, sub-pixel jitter and colour drift)
- `sky`: a **synthetic** procedural night-sky plate (1280×720 at 30 fps, drifting clouds, stars, a pan, grain)
- `pixeladv`: the **round trip**. Our own pixel render goes through H.264 and back, scored against the engine's exact native frames (`dump_room.ts`).

Naive = area downscale + nearest colour, on the same holds. Metrics are measured on flow-static pixels:
- boil/s = colour changes per static pixel per second
- flips = A-B-A reversals per 1000 static pixel-drawings
- mc-boil = changes against the flow-carried previous drawing, on every reliably tracked pixel (moving content included)

| Source | Naive boil/s | Tuned boil/s | Naive flips | Tuned flips | Naive mc-boil % | Tuned mc-boil % | Notes |
|---|---|---|---|---|---|---|---|
| `satire` (--preset default) | 0.705 | **0.091** (8x less) | 16.0 | **0.14** | 11.58 | **4.00** |  |
| `puppet` (--preset default) | 2.180 | **0.232** (9x less) | 60.6 | **0.48** | 25.64 | **8.35** |  |
| `stress` (--preset default) | 3.267 | **0.302** (11x less) | 94.5 | **1.29** | 30.78 | **7.24** | SYNTHETIC stand-in |
| `sky` (--preset plate) | 0.483 | **0.158** (3x less) | 4.1 | **0.00** | 12.88 | **10.79** | SYNTHETIC stand-in |
| `pixeladv` (--preset pixel) | 0.191 | **0.055** (3x less) | 2.5 | **0.16** | 1.73 | **0.80** | round trip vs engine: 85.9% exact, 96.37% visually identical (dE < 0.02) |

Measured 2026-09-25, on this machine under load. How to read the table:
- **Boil (static pixels).** The tuned presets cut colour changes on static pixels by 8–11× on real and stressed footage, and A-B-A flicker by 70–125×. The boil heat maps in the `*-sheet.png` files show it at a glance.
- **Faces.** They go from hue speckle (naive) to one clean skin ramp, with no dither on skin.
- **mc-boil includes real motion.** Characters act and doors open, so it can't reach zero.
- **The sky's mc-boil barely moves (12.9 → 10.8%), and that is expected.** It counts two deliberate choices as change: the dither that stays fixed to the frame while the camera pans (so the gradient doesn't crawl), and pan-lock's whole-pixel steps. The metric warps by the fractional flow instead. Judge the sky by its static boil (3× less), its 0 flips and `sky-tuned-cmp.mp4`.
- **The round trip.** Our own pixel render, through H.264 and back, reproduces the engine's frames at 96.4% visually identical. The misses are near-twin palette colours (N2/F0, ΔE 0.006) that H.264 colour shifts flip between. Plain nearest colour at block centres hits the same ceiling, so the pipeline loses nothing.

Demos (half scale): `demo-window.mp4` (the sky plate in the window and the ceiling hole), `demo-handoff.mp4` (engine → converted clip, 5-frame handoff: the join doesn't show), `demo-glyph.mp4` (the engine's GLYPH on a converted clip). The conditioning export test is in `tests/keyframes/room-sky/`.

---

## Known limits

- **CPU speed.** Expect 1–4 min per 5 s clip. Long plates should be converted once and committed.
- **Non-rigid motion still crawls a little** at edges (a 0.3 px/frame drift is still a drift). Pan-lock fixes rigid pans only; zooms and parallax are not compensated. Holding on 2s halves the crawl.
- **Palette coverage.**
  - The master palette has no mid warm yellows. Daylight or cream footage maps to paper and skin, so condition on our frames and use `--match`.
  - It has near-twin darks (N2/F0 are ΔE 0.006 apart). That is why the round trip is about 86% exact but about 96% visually identical.
- **No automatic face or figure segmentation.** Skin families are protected from dither automatically. For figures, pass `--protect` masks, or use the `character` preset (no dither).
- **Family choice is regional.** A hue exactly between two families can split into blobs. Restrict `--families` per shot, or use `--mode nearest` for atmospherics.

## Resources that would raise quality (to ask the showrunner)

- **API access to an image-to-video model with first-frame and last-frame conditioning** (ideally also motion masks or video-to-video). This is the missing piece: nothing here can generate footage on this CPU-only machine. What to check: a licence that allows commercial use, 720p+ at ≥16 fps, per-second cost, audio that can be switched off, and no likeness features. The OpenAI Sora API is not an option: it shut down on 2026-09-24 (show/_sources/research/gaps.md).
- **Or a GPU** (≥24 GB VRAM, rented is fine) to run an open-weights image-to-video model locally. That would allow unlimited retries and seeds, and no content leaves the machine.
- **Optional: a segmentation model** (a small, CPU-able "segment anything"-class model) to make `--protect` masks for figures and faces automatically.
- **Storage policy for model outputs.** Generated source MP4s can't be regenerated bit for bit, and they are gitignored (`*.mp4`). Keep them in a backed-up archive (or git LFS). Commit the converted `studio/public/genvideo/<shot>/` drawings: small indexed PNGs.
