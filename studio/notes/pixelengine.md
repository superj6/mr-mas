# pixelengine: the shared pixel engine (src/shared/pixel)

## What I built
- The pixeladv core is promoted to **`src/shared/pixel/`**: `px`, `palette`, `light`, `font` and `figure` were moved verbatim and then extended only additively.
- **New modules:**
  - `dither`: ordered threshold maps
  - `mask`: coverage masks, cone, radial and image masks
  - `palettes`: the six palette sets plus remaps
  - `transitions`: render front, dither fade, dither wipe
  - `sprite`: timing, pose and image helpers
  - `glyph`: tokens and the dissolve (pure)
  - `glyphDraw`: font load, measured ramp, bloom, presentation
  - `ui`: dialogue box, portrait window, name plate, name card, 1-bit alert
  - `compose`: the pure frame pipeline
  - `PixelScene.tsx`: the Remotion host
  - `index.ts`: the barrel
- **Compatibility:**
  - `src/dev/pixeladv/core/*.ts` are now one-line `export *` shims.
  - `src/dev/pixeladv/PixelCanvas.tsx` wraps `<PixelScene>` with the same props.
  - The pixeladv key and switch stills re-render **pixel-identically**, diffed against the approved PNGs in both Node and Remotion.
  - The castmas and castrivals builders import through the shims, and it typechecks.
- **Guide:** `studio/PIXEL_GUIDE.md` (canvas, palette rules, scales, animation conventions, API, recipes).
- **Demos:** `src/styleframes/pixelengine.frame.tsx` and `src/dev/pixelengine/`:
  - `scenes.ts`: pure scene definitions
  - `room.ts`: the pixeladv room recomposited with a separate clock for Mas and a mask for him
  - `art.ts`: the Orb sprite and the data-center cathedral
  - `Demos.tsx`
  - `tools/preview.ts` and `tools/tune.ts`: Node-only (`@ts-nocheck`)

## Outputs: `out/lookdev/pixel/engine/`
- `switches-00-base.png` … `switches-09-bloom.png` come from `pixelengine-switches --frame=N`.
- `switches-sheet.png` comes from `pixelengine-switches-sheet`.
- `dissolve.mp4` comes from `pixelengine-dissolve` (48 frames, 960×540, rendered with `--scale=0.5`).
- `renderfront.mp4` comes from `pixelengine-renderfront` (48 frames, 960×540), with stills `renderfront-f13/16/33/36.png`.

## Iteration log (what changed after looking)
1. **1-bit.** The first curve crushed the room to speckle. It then became uniform 25% grey and, after that, bare line art. The final version uses 9 levels: N0/N1 are solid, the N2 night wall gets a sparse 1/8 dot, and lit planes go to white. The greyed button went from an illegible checker to a dotted frame with 75% text.
2. **2-tone.** The curve was too dark at first. A clustered-dot halftone (`cluster4`) gives it a screen-print read. The verb bar is excluded from the freeze because the interface is not world.
3. **Early-web.** A chroma boost caused orange artifacts on the window. The fix was checker-only mixes, a higher pair bias, and an exposure lift.
4. **Glyph.**
   - The glyph region used to paint over the caption and cards. `after` is now a transparent UI layer above the glyph layers.
   - The default tone curve was lifted so night walls register as faint tokens.
   - The room-only mask is aligned to the 3-row cell grid.
5. **Cathedral.** The focal length was in the wrong units. The vanishing point is now aimed down the Orb's cone, and luminance contrast is higher so the arches read in tokens.
6. **Dissolve.** The first version had a uniform sliding column. It now has per-token wind jitter, a speed spread, turbulence that grows with age, and dim cells that burn out in place.
7. **Render front.** The interleave band was capped at 16 px so the front stays crisp at peak speed.

## Rig and style limits
- **Glyph needs the DOM** (font rasterisation). The Node preview only approximates tokens as tinted cells, so judge glyph work in Remotion stills.
- **Palette sets are tuned on night rooms.** Bright scenes (dinner, dusk skyline) should derive variants with `.with({tone})`.
- **EARLYWEB16 is hue-faithful but dark**, dominated by navy checkers in the room. That is period-true, but a lit 2008 stage set will look far better than the remapped night room.
- **The cathedral and Orb are demo art.** The intro builder owns the final versions; the Orb scan recipe is in the guide.
- **Name-card stamps are straight, not tilted**, per the no-rotation rule. A tilted stamp would have to be hand-pixelled as its own drawing.
- **A glyph region mask resolves per cell** (2×3 px), so very thin masks (under 3 px) will alias. Align rectangular masks to the cell grid.

## Known issues / next
- Masked-glyph cone: at 4×, the rack contour glyphs (`|`, `#`) form a regular grid. A softer `edgeAt` or a larger cell for this one moment could read calmer.
- `renderFront`'s `tear` (the 1-px raster displacement under the beam) is barely visible at this scale. It is harmless, and can be set to 0.
- An indexed export (for example PNG-8 or a palette-cycling tool) is not built. `PAL_INDEX` is there for it.

## Polish pass (art director, 2026-09-25): engine v1.1
These are the cross-moment fixes, applied to the engine. `PIXEL_GUIDE.md` §2, §5 and §7 are updated to match.

**The CX dusk ramps are promoted into the master palette** (`palette.ts`). They are appended, so older indices stay
stable, and they use the same hexes as `cast/bosses.ts` `CX`, so existing art is unchanged:
- `F0-F6`: fleece
- `I0`: ink blue
- `U0-U5`: dusk
- `Q0-Q2`: rocket red

Family steps, prints and `strayColors` now treat them as master families.

**Dither discipline.**
- `compilePalette` takes `solid` (colours that never dither), and `SKIN_COLORS` lists S, K and X.
- `2TONE_FREEZE`, `EARLYWEB16`, `LEDGER` and `TERMINAL` resolve skin to one flat colour.
- `2TONE_FREEZE` is now a threshold plus one pattern (levels 3).
- ONEBIT is exempt: its fill patterns are the 1993 medium.

**`freeze.ts`, the founders' print and card, is one module for the whole dinner.** mdinner1 (GERG, ALYI) and
mdinner2 (MARIO, NOLE) both use it:
- `FOUNDERS`: the card copy and the inks (Gerg `L1`, Alyi `W3`, Mario `F3`, Nole `R0`)
- `freezePrint`, `freezeSolid`, `freezePop`, `freezeShade`, `freezeSwitches`
- `founderCard`: one geometry, at most one fine-print line
- `rubberStamp`

The era stamp is the cast's `cast/era.ts`. My duplicate in `ui.ts` was removed before anyone used it.

**Font.** `$`, `·` and `✓` are added to the 7px face.

**Engine demos re-rendered** in `out/lookdev/pixel/engine/`:
- `switches-01-freeze`
- `switches-03-earlyweb16`
- `switches-04-ledger`
- `switches-05-terminal`
- `switches-06-cone-terminal`
- `switches-sheet`
- `renderfront.mp4` and its stills f13, f16, f33 and f36

These all change with the skin rule. The other demos are unaffected.
