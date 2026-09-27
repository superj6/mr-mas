# E1-P2 · WHAT THE QUACK (1.H) · handoff

The pilot's tag, sc 32 (Dec 6, 2023). This is a fully programmatic filler. ELGOOG's near-photoreal product film plays inside the dark room's pixel monitor, gets exposed as stills, and the clip cuts to the pixel `[2S]`. The brief is style-range §6.1a "E1-P2", and `plan.ts` holds the frame plan. Nothing is committed, no external API was called, and nothing was spent.

Last pass: ep1r-p2r4 (2026-09-26, late). It is the fourth pass on this folder: the scene script is v4, the grade was rebuilt, and both cuts were re-rendered three times.

## Outputs (`out/range/ep1/`)

| File | What |
|---|---|
| `ep1-p2.mp4` | Cut A, the ramp. 264 f (11.0 s), 1920×1080, 24 fps, H.264 + AAC, temp sound, about 2.1 MB |
| `ep1-p2-b.mp4` | Cut B, the break. 216 f (9.0 s), about 1.2 MB |
| `ep1-p2-sheet.png`, `ep1-p2-b-sheet.png` | Labelled contact sheets, pulled from the encoded mp4s and shown at 480×270 |
| `ep1-p2-blind.png`, `ep1-p2-b-blind.png` | The same frames with no captions, for the blind read (every cell is phone size) |
| `ep1-p2-key-1-the-film-p040.png`, `-key-2-exposed-p170.png`, `-key-3-two-shot-p230.png` | Cut A's three key stills, full size, from the encoded mp4 |
| `ep1-p2-b-key-1-the-film-p040.png`, `-key-2-exposed-p122.png`, `-key-3-two-shot-p182.png` | Cut B's three key stills |
| `ep1-p2-measure.json`, `ep1-p2-b-measure.json` | Holds, grade and room levels, measured from the encoded mp4s |
| `ep1-p2-inputs/` | Inputs for the outside-layer test, on paper only: `cycles-f000.png` and `cycles-f119.png` (the arc's two ends, Cycles, 1280×720, 256 spp, denoised), `screen-matte.png` with `screen-matte.json` (the film's rect in the `[OTS]`), and `take-eevee.mp4` (the filler's take, x264 crf 14, for the premium comparison and for composite-only re-runs) |

## How it's built

- **The film:** `blender/duck.py` (v4). It builds a procedural rubber duck from metaballs, meshed at 0.6 mm, trimmed to a flat foot, voxel-remeshed, relaxed and subdivided (about 672k faces). Everything else on the duck is shader work in object space:
  - the bill and eyes are paint masks;
  - the wing relief, the mould's parting line and the bill's smile groove are bump;
  - each eye is a low moulded bead (a 0.9 mm dome bump), so a softbox reflects in it as a small window. Before this, the eyes read as grey discs.
  - The vinyl is satin with a thin coat and a very fine orange peel, plus a little subsurface.
  - The sweep is graduated: pale on the desk, falling to a darker warm grey across the cove. The 100 mm lens only sees the backdrop up to about 10 cm high.
  - Lights: a big key, a strip kicker, an overhead sheet (the contact shadow), a big dim elliptical fill and a soft pool.
  - One camera arc runs from three-quarter to profile with a slow push-in, at 100 mm and f/4, focused near the eye, with motion blur.
  - EEVEE Next renders it on the Intel iGPU (Arrow Lake, Mesa 25.2) at 1056×592. No downloaded assets, no brand and no model-made anything.
- **The composite:** `P2Duck.tsx`, a CPU 2D canvas.
  - The pixel frame is native 480×270, shown at 4×. `ots.ts` draws the `[OTS]`, and `twoshot.ts` draws the `[2S]` through the shared `drawDark2S`.
  - The band is P4's `drawBand`, dimmed for a cutscene, and the rail types on its sentence line.
  - The film is drawn into the screen at output resolution, its super drawn into it, then graded by `grade.ts`:
    - exposure ×0.82;
    - a soft knee on max(R,G,B) with a hard cap 10 levels under 80%, so hue and saturation are kept (the old luminance shoulder turned the yellow mustard);
    - the film's lens vignette;
    - a fine grain, one fixed field per take frame, so it lives on 1s and freezes in every hold;
    - a half-LSB dither.
  - The super is `“What the quack!”`, typeset in Jost at 46 px, lower left, clear of the duck on every frame of the take.
  - The monitor's own UI (the title strip, the chyron) is native pixel UI over the film.
  - The strip of stills is centred in the player.
  - The Orb's eye-light is drawn in 4×4 grid cells, screen-blended over the glass.
  - In the `[2S]`, the small monitor's stills are snapped to the master palette in CIELAB, so the duck stays yellow. A plain RGB nearest-colour match made it brown.
- **Sound:** `tools/sound.py`, all temp.
  - The dark room's bed uses the v5 reel's recipe, at about −39 dBFS RMS, plus faint LED ticks.
  - MM-12 is a temp felt line from the OST engine (read-only, with its calibration cache in scratch). It runs straight through the ramp, holds under the strip, and lifts into the whir without a cadence.
  - The slot's whir is synthesised. The monitor stays silent.

## Re-run (from `studio/`)

```bash
S=<a scratch folder>
bash src/dev/range/ep1-p2/tools/build.sh $S                            # take, sound, both cuts, review (the take is ~35-50 min)
bash src/dev/range/ep1-p2/tools/build.sh $S frames sound render review # composite-only: rebuild the take's PNGs from take-eevee.mp4, no Blender
bash src/dev/range/ep1-p2/tools/build.sh $S cycles                     # the two Cycles conditioning stills (CPU)
```

The composite needs the take's PNGs in `$S/public/take/` (about 68 MB), passed as `--public-dir`. The last pass deleted its PNGs after the intermediate encode, as the shared spec asks, so use the `frames` step. It decodes `take-eevee.mp4`, which is 4:2:0 and so a hair softer in chroma than the original PNGs. For the final look, re-render the take. The script stops if free disk space falls under 5 GB.

**Render time (this pass).** No money was spent: everything ran locally.

| Step | Time |
|---|---|
| The take (120 frames) | 2,924 s (about 19–25 s a frame; the machine was shared) |
| EEVEE shader compile | about 6.5 min cold, about 15 s with Mesa's cache warm |
| Cut A composite | 63 s at `--concurrency=4` |
| Cut B composite | 34 s at `--concurrency=4` |
| Sound, per cut | about 14 s |
| Review (sheets, keys, measures) | about 90 s |
| Cycles stills (2, 1280×720, 256 spp, CPU) | 1,181 s |

## Iteration log (ep1r-p2r4)

- **Take lookdev (3 EEVEE test rounds on f000, f060 and f119):**
  - **Eyes:** they read as grey discs, because the key's reflection filled the whole eye. The fix was the domed bead, less base specular and the dim elliptical fill.
  - **Floor:** a hard-edged vertical streak in the floor reflection. The floor was made rougher, with less specular.
  - **Backdrop:** a flat grey backdrop became a graduated sweep.
  - **Chest:** a grainy highlight patch on the chest came from the orange peel. The peel is now finer and shallower.
- **Round 1 composite:**
  - the super was shrunk, typeset with curly quotes, and cleared of the duck (at 56 px it touched the chest);
  - the film got its grain;
  - the strip was centred;
  - the thumbnails were matched in Lab.
- **Round 2:**
  - Found: the luminance shoulder desaturated the yellow to mustard. Replaced by the max-RGB knee.
  - Found: the `[2S]` thumbnails still skewed brown. The browns (W0–W3) were dropped from their pool.
- **Round 3:**
  - Found: the encoded film overshot 80% on saturated edges (max 215, then 208) through 4:2:0 chroma. The cap was lowered to 194, and the encoded max is now 204.
- Every round was checked on frames pulled from the encoded mp4, at full size and at 480×270.

## Measured (from the encoded mp4s, round 3)

| | A | B |
|---|---|---|
| New drawings in the film, p1–71 (1s) | 71 of 71 | 71 of 71 |
| p72–95 (2s) · p96–111 (4s) · p112–119 (8s) | 12 · 4 · 1 (exactly the plan) | — |
| Film, max channel (8-bit) / 99.9th percentile | 204 / 191 | 204 / 191 |
| Film luma, max / mean (display) | 0.744 / 0.507 | 0.744 / 0.509 |
| Film pixels over 75% | 0.2% | 0.25% |
| Film mean vs the room's mean (OTS) | +4.55 stops | +4.56 stops |
| Film mean vs the room's lit surfaces (99th percentile of the room, the light the screen throws) | +0.46 stops | +0.47 stops |
| Loudness / peak (decoded from the mp4) | −23.7 LUFS / −5.0 dBFS | −23.9 LUFS / −4.8 dBFS |
| The slot's whir | LED at p240 (10.00 s); the motor is audible at 10.3 s (its 0.35 s spin-up) | LED at p192; audible at 8.4 s |

The take itself has an even exposure (mean 140–143 of 255 across the arc) and a steady frame-to-frame change of 0.43–0.56 levels, with no outlier frames: no flicker or pops were found by measurement.

## Deliberate departures from the brief

- **A's strip** shows one hold from each step of the ramp (take frames 72, 96 and 112), not "the last three holds" (104, 108 and 112). Those three are 4 to 8 frames apart on a slow arc and would read as one picture shown three times, which is the "playback glitch" read the brief fails on. Even 72, 96 and 112 are close in angle, about 17° apart.
- **B's first still is p0**, which is before the super sets, but the super is still drawn on it, as the brief asks.
- **The rack at frame right in the `[OTS]`** follows the brief. It's a geography cheat: in the `[2S]` the rack is across the room from the monitor.
- **`RAIL: DEC 6, 2023`** types on the whir, because the script puts the rail "on the delivery".
- **The caption** follows the brief, `LATER: ELGOOG'S DEMO WASN'T REAL-TIME`. The script currently says `LATER: THE DEMO WASN'T REAL-TIME`, and the facts owner decides.

## Needs a person

- Watch both cuts at full size and at phone size, and listen to them. Nothing here has been watched in real time or listened to.
- Run the blind read (`*-blind.png`, then the mp4s): do readers say "an ad" and "ELGOOG", then "fake" or "edited"? Which cut gets "faked" sooner? A tie goes to B.
- In motion, check whether A's ramp reads as the film being exposed or as a player buffering. Only a viewer can tell.
- The facts owner checks the wording of `ELGOOG DEMO · DEC 6` and `LATER: ELGOOG'S DEMO WASN'T REAL-TIME`.
- Rule on the grade (below).

## Open issues and honest weaknesses

- **"Within a stop of the room"** can't be met literally while the film is a pale product film in a dark room: film mean against room mean is +4.55 stops. This pass measures the film against the light the room shows it receiving (the room's lit desk edge and rims, the 99th percentile): +0.46 stops. That is within a stop, and the whites stay under 80% (luma max 0.744). The showrunner or critic rules on which reading holds.
- **The duck is a clean CG product render, not a photograph.**
  - The key's and fill's reflections on the chest read as soft rectangles and ellipses with a faint grain.
  - The metaball back has gentle lumps.
  - The wing relief is bump only, so the silhouette never shows it.
  - EEVEE's subsurface barely shows.
  - The floor reflection is screen-space and faint, and a very soft vertical edge can still appear at the lower left of some frames.
  - It looks finished at monitor size; at 1:1 an expert would call it CG. The planned FINAL (a video model conditioned on the Cycles stills, or Cycles for the whole take) is what closes that gap.
- **A's three stills** are close in angle. B's (p0, p36, p71) differ more, which may help B's "faked" read.
- **The `[2S]` thumbnails** are 30×17 palette pixels. The duck reads yellow-orange rather than lemon yellow.
- **The encoded film** touches exactly 204 (80%) on a few saturated edge pixels.
- **The whir** is audible about 0.3 s after the LED, as the motor spins up. If the magazine's feed should be heard on the frame, move the sound earlier.
- **Mas's `[OTS]` silhouette** has the portrait's hair tuft, which reads a little like an antenna against the cyan rim.
- **Geography:** the `[OTS]` rack cheat stands, as noted above.
