# MR. MAS title card — style spectrum (key: `title`)

The wordmark **MR◉MAS**, where the period is THE ORB (a chrome, eye-like sphere with an iris). The subtitle
`now in low-key research preview` sits below in lowercase mono. The background is the AI skyline: a
data-center "cathedral" at dusk, with light pouring out of its rose window. There is one still per style,
plus a 3 s motion test per style.

## Files
| file | what |
|---|---|
| `src/shared/title/common.ts` | PRNG/noise, easing, `useFontsReady` (blocks render until fonts load), `measure`, **`layoutWordmark`** (MR + orb-as-period + MAS, baseline-seated, centred), `swellPath` (variable-width lines for engraving) |
| `src/shared/title/skyline.ts` | **`buildSkyline()`** is the single procedural set every style re-renders. It builds a gothic nave with twin spires (the spires are tapered antenna masts, *no crosses*), server halls with rooftop chillers and dishes, cooling towers, pylons and cables, lancet windows (flagged `arch`), a rose window and beacons. Output is plain SVG path strings, so canvas styles can use `Path2D` on the same data. |
| `src/shared/title/raster.ts` | `useCanvasDraw` (holds the frame until painted), threshold masks, grey fields, dilate/shift, Bayer, `IndexBuf` palette buffer + nearest-neighbour blit |
| `src/shared/title/bitfont.ts` | hand-pixeled 5×9 lowercase bitmap font (used by pixel + dither) |
| `src/shared/title/guilloche.ts` | lace rings, hypo/epitrochoids, woven border bands, ropes |
| `src/shared/title/Title*.tsx` | one component per style (Soft exports the reusable `ChromeOrb`) |
| `src/styleframes/title.frame.tsx` | registers `title-<style>` (still, hero frame 60) and `title-<style>-motion` (72 f / 3 s) |
| `src/dev/title/entry.tsx` | dev entry (only these frames) |

Render:
```
npx remotion still  src/dev/title/entry.tsx title-riso ../out/dev/title/title-riso.png --bundle-cache=false --log=error
npx remotion render src/dev/title/entry.tsx title-riso-motion ../out/dev/title/title-riso-motion.mp4 --bundle-cache=false --log=error --concurrency=2
```
Every component takes an optional `frame` prop. Stills pass `frame: 60` (the settled hero frame, with
the intro skipped). Motion comps use the real frame.

## The styles (ids)
- `title-soft`: cinematic prestige. Bodoni Moda with the tracking closing in, and ChromeOrb, a real chrome sphere that reflects the dusk and has an emissive iris. Volumetric rays from the rose window, a 2:1 letterbox, grain and halation.
- `title-anime`: TV-anime card. A slammed italic Anton wordmark with a double sticker outline, a red slash band, focus lines (集中線) converging on the orb, cel-shaded cumulus, and a light pillar out of the cathedral. A vertical katakana tag reads **ミスター・マス** (Misutā Masu, "Mister Mas"; ー is rendered vertical by `writing-mode`). It includes a 2-frame inverted impact frame on the slam.
- `title-pixel`: 16-bit title screen at native 384×216, shown at 5×, with a 32-colour palette. Banded dusk sky with checker seams, pixel sunset clouds, searchlights, and a chrome-over-sunset extruded logo that is auto-shaded from a thresholded font (rim light, horizon line, extrusion, 1 px outline). The orb twinkles.
- `title-noir`: graphic-novel splash in ink and paper plus ONE spot colour (cyan), used only on the iris and the rose window. The sky is a line-weight gradient, rain inverts itself over ink and paper, the letters get a dry-brush treatment, and the subtitle sits in a caption box.
- `title-riso`: two-ink risograph (Riso Blue + Fluorescent Pink). A true per-pixel AM halftone (euclidean dot at 15°/75°), misregistration, drum-ink mottling, starved-ink speckle and multiply overprint. A flat pink sun anchors the frame, with a paper label behind the subtitle.
- `title-engrave`: STOCK CERTIFICATE. Procedural guilloché border, corner blocks, medallions, underprint and seal. The vignette is an actual line engraving generated from a tone painting (variable-width lines plus crosshatch). Also: shaded engraved Didone letters, an engraved sphere orb with a spirograph iris, red numbering-ink serials and subtitle, "ONE SHARE — NON-VOTING", "Capped-Profit Common Stock" in blackletter, legal text, and signatures ("SECRETARY (ACTING)", "CHIEF EXECUTIVE OFFICER (REINSTATED)").
- `title-glyph`: latent glyph. Everything is a 9 px mono token grid where tone = glyph density. The skyline is a void cut out of a glowing field of tokens, lit racks are bars, and a bloom pass sits on top. In motion the wordmark decodes out of noise and the cursor blinks.
- `title-dither`: 1-bit Mac era at native 640×360, shown at 3×. Atkinson-dithered scene, bitmap serif in the Outline+Shadow text style on a knock-out plate, subtitle in a boxed label, rounded CRT corners, and the arrow cursor drifting in while the orb's iris follows it.
- `title-cartoon`: the old outlined clean-vector look, kept only for comparison.

## Rig / animation limits by style (what is realistic for us)
General: the title is typography plus one "character", the orb. The orb rig is look (iris offset
with foreshortening), dilate (pupil) and lid (shutter). All styles can do blinks, looks and the light
animation (rays, flicker, beacons). None of them can do a continuous 3D turn of the orb; it is a sphere,
so it doesn't need one. Camera: push-ins and parallax work in all the vector and canvas styles.

| style | what animates well | limits / cost |
|---|---|---|
| soft | slow push-in, tracking-in type, ray breathing, iris drift and dilation, grain boil | the most CPU-expensive (SVG blurs, grain turbulence per frame). Any fast motion reads as cheap, so it has to stay slow and smooth. The chrome reflections are painted, not a real environment, so a large orb move needs the reflection re-authored. |
| anime | slams, overshoot, impact frames, smears, held poses, speed-line boil, sparkle glints | wants timing on 2s/3s with holds; smooth 1s interpolation looks like motion graphics, not anime. The cel orb bands are fixed to the sphere, so the iris moves but the "chrome" does not rotate. |
| pixel | integer-pixel moves, palette cycling (windows, sparkles), sprite swaps for the orb (look left/right/centre), sub-sections that scroll | **no rotation, no non-integer scaling, no smooth zoom**: all of them break the grid. Motion quantises to 5 px screen steps, so eases need to be stepped. The logo shading is procedural, so the logo can't be squashed or stretched; it would need a redraw. |
| noir | hard cuts, lightning double-flash, rain loops, slow push, iris darts | only two values plus one spot colour, so it has no soft glows or gradients (fake them with line weight). The dry-brush texture should boil on 2s, not slide. |
| riso | ink misregistration boil, halftone screens that stay locked to the paper while shapes move under them, slide-ins | the halftone screen must stay fixed. If it moves with the objects, the look dies. That makes moving elements shimmer slightly (authentic). Per-pixel compositing costs roughly 1 s per frame on CPU. No true blacks or third colours; everything is pink, blue or their overprint. |
| engrave | draw-on of guilloché (dash offset), "stamp" of the red serials, slow camera across the certificate, iris looking | line engravings **moiré and shimmer when scaled or moved sub-pixel**, so camera moves must be slow, or snap to whole pixels, or be done as crossfades. The vignette engraving is regenerated per frame (canvas), so changing its content means repainting the tone map. Small text is only legible at 1080p and up. |
| glyph | decode-from-noise, token boil, cursor blink, glyph "rain", colour pulses | resolution = the cell grid (≈213×120), so motion quantises to 9 px cells and fine shapes such as the iris break up. Great for transitions and glitches; poor for anything delicate. |
| dither | cursor moves, iris follow, blinking beacons, cuts | error-diffusion (Atkinson) dither **crawls** when the underlying image changes, so animate only small regions or keep the background static. Use ordered dither for anything that moves. 1 bit means no anti-aliasing, so motion reads at native 3× pixel steps. |
| cartoon | pops, squash and stretch, blinks: anything | none technically. It is the look that was rejected as too cartoony. |

## Outputs
Stills: `out/dev/title/title-<style>.png`. Motion: `out/dev/title/title-<style>-motion.mp4`. Contact sheet: `out/dev/title/title-sheet.png`.
Measured motion render times (72 f, concurrency 2, including the ~15 s bundle, with other builders rendering at the same time): glyph 70 s, dither 83 s, pixel 92 s,
riso 92 s, soft 99 s, cartoon 107 s, engrave 121 s, anime 171 s, noir 362 s. Noir is the slowest because the feTurbulence/displacement ink filters
are re-rasterised every frame. If noir is picked, pre-bake those textures.

## Known issues / next
- Katakana uses the system font **Noto Sans CJK JP** (fontconfig) rather than a bundled @fontsource font. It renders on this machine but would fall back to tofu on a box without Noto CJK. Bundle it, or bake the 7 glyphs to paths, before farming renders out.
- Glyph: the orb's interior shading is coarse at a 9 px cell. The iris reads, but the chrome only partly does.
- Dither: Atkinson "worms" in the mid-sky gradient are authentic but a little noisy. An ordered-dither sky would be cleaner and would also stop the crawl in motion.
- Soft and engrave are the slowest to render (heavy SVG filters and the per-frame engraving).
- Cooling towers in the far layer are small and read as generic stacks in some styles.
