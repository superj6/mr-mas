# MR. MAS: Pixel Guide (shared engine v1.1, 2026-09-25: art-director polish pass)

> **Render policy (showrunner, 2026-09-25):** 1080p (1920×1080) is the maximum render size. Never render 4K or use `--scale` above 1 for deliverables. Previews may use `--scale=0.5`.

The show's primary look is pixel art. Every pixel shot is built on one engine: `src/shared/pixel/`.
This guide covers the canvas, when each palette is allowed, scale standards, animation rules, and the API.
It is binding for builders, together with `INTRO_PIXEL_BRIEF.md` (the switch plan) and `ART_GUIDE.md`
(builder rules).

The reference look is `out/lookdev/structures/pixeladv/key.png` and its portraits. The engine demos are in
`out/lookdev/pixel/engine/`; start with `switches-sheet.png`.

```ts
import {PixelScene, Buf, PAL, rect, blitImg, applyPalette, coneMask, glyphDissolve, nameCard} from '../../shared/pixel';
```

---

## 1. Canvas spec

| | |
|---|---|
| Native canvas | **480 × 270**. Everything is authored, lit and animated at this size. |
| Output | 1920 × 1080 = **4× nearest-neighbour**. One art pixel is a 4×4 block. Previews at `--scale=0.5` show 2×2 blocks. `<PixelScene>` always uses the largest *integer* scale that fits, and letterboxes in `bg`. |
| Framebuffer | `Buf`: a `Uint32Array` of packed `0xRRGGBB`. It is **palette-constrained**: every value must be a master-palette colour (`PAL.*`). Because of that, the frame is effectively indexed, and a style switch is a per-colour lookup, not a filter. Run `strayColors(fb)` in dev to catch hand-typed hexes. `PAL_INDEX` maps a colour to its master index for tools and export. |
| Adventure layout | Room 480 × 203, plus the verb/inventory band 480 × 67 (`UI_Y = 203`). Intro and title shots may use the full 270. |
| Frame rate / grid | 24 fps at 96 BPM: 15 frames per beat, 60 per bar (`src/shared/timing.ts`). Switches cut **on the grid**. |
| Determinism | Use `hash(x, y, seed)` and ordered thresholds only. No `Math.random`, no `Date`. Glyph shimmer and dissolve are hash-seeded too. |
| Fonts | 7 px pixel face (`text`, cap height 7, line 11) and the 14 px display face (`bigText`, a Scale2x of the 7 px face). JetBrains Mono appears **only** inside GLYPH, where `PixelScene` loads it with `document.fonts.load` inside `delayRender`. |

Render (always from your own dev entry):
```
npx remotion still  src/dev/<key>/entry.tsx <id> ../out/<...>.png --bundle-cache=false --log=error
npx remotion render src/dev/<key>/entry.tsx <id> ../out/<...>.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
```
To iterate faster, bundle once (`npx remotion bundle <entry> --out-dir=<scratch>/bundle`), then pass that folder in place of the entry. Pure pixel code can also be previewed in Node in seconds; see `src/dev/pixelengine/tools/preview.ts`.

---

## 2. Palettes and the switch rules

**The rules (from the showrunner, binding)**
1. **BASE is the show.** When in doubt, don't switch.
2. **GLYPH is for dark foreshadowing only**: the machine watching, the future leaking in, people becoming tokens. Its placement is chosen for tone and comic timing.
3. **Every other switch is rare and motivated** by era, money, or machine point of view.
4. **Never corny.** No glitch spam, no meme sounds, no winking UI. A switch must be over before the viewer can think "effect". Keep it short (the Orb scan lasts 5 frames, the iris 2), cut it on the beat, and give it one reason.
5. A switch never redraws the art. It remaps the same frame, so it can cut in on any frame and cut back out cleanly.
6. **Dither discipline.** Dither only on backgrounds and light falloff, **never on skin or figures**. Every non-BASE set except ONEBIT lists `solid: SKIN_COLORS`, so a skin colour resolves to one flat output colour (a threshold), never an ordered pair. (ONEBIT is exempt: early-Mac fill patterns are that era's medium; bound them to shapes, never gradients.) A freeze prints as a threshold plus ONE pattern.
7. **Transition vocabulary: four.** The render front, the whip streak, the flash-print of a freeze, the candle wipe. Nothing else (no paper wipes, no dither wipes between eras: cut hard on the stab).

| Set (`PALETTES[id]`) | Colours | Use it for | Never for | Look |
|---|---|---|---|---|
| `BASE` | the 74-colour master palette | everything else | — | hand-ordered light ramps: night, monitor cyan, tungsten |
| `2TONE_FREEZE` | navy `N4` / cream `P2` (both master colours) | generic freeze demos. **The Woodrose dinner uses the founder prints in `freeze.ts`** (cream paper + each founder's ink) | general "flashback" looks | a threshold plus one 50% clustered screen; skin solid |
| `ONEBIT` | `#0e0e10` / `#e9e6da` | **1993 only**: Kid Mas, the beige computer, the system alert | "the model dreaming", AI moments (use GLYPH) | early-Mac fill patterns in 1/8 steps: night walls take a sparse dot, lit planes climb to white |
| `EARLYWEB16` | 16 web-safe colours (`EARLYWEB16_COLORS`) | **2008–14**: the TPOOL stage, the WHY COMBINATOR crown. The palette scales with the era | anything after 2014 | GIF-era checker dithers; hue-preserving pair match |
| `LEDGER` | 3 greens on ledger paper | **money**, a few frames at most (the `$1,000,000,000*` novelty check, `received: $133M`) | holds longer than ~6 frames | horizontal line screen (an engraving stand-in) |
| `TERMINAL` | 4 CRT teals | **the machine's point of view** (Orb POV) | general "tech" flavour | 4-level ordered teal |
| GLYPH (a switch, not a set) | JetBrains Mono tokens, coloured from the frame | **dark foreshadowing** | jokes that need the viewer to read the glyphs | measured-density tokens, contour glyphs (`- \ | /`), bloom |
| family step (`{type:'step', k}`) | the master palette | "the palette blooms brighter" (the CHATGTP button); cutscene dims | long holds | every colour moves k rungs along its own ramp |

**The intro switch plan, as engine calls** (moments from `INTRO_PIXEL_BRIEF.md`):

| Frames | Moment | Call |
|---|---|---|
| 99–104 | Orb scan: the cathedral appears inside the cone | `switch: {type: 'glyph', mask: coneMask(...), source: cathedralBuf}` |
| 120–167 | 1993 | `palette: 'ONEBIT'`, and `alertDialog()` in `after` |
| 168–239 | render front up the eras | `{type: 'front', from: 'ONEBIT', to: 'EARLYWEB16', t0, frames}`, then later `from: 'EARLYWEB16', to: 'BASE'` |
| 240–479 | name cards during the dinner: the world is printed for ONE beat per hit (Gerg 240, Alyi 300, Mario 360, Nole 420 for two beats), then runs again under the card | per-pixel by owner: `freezePrint` (room), `freezeSolid` (figures, lettering, linen, the featured founder), `freezePop` (the 2-frame flash); `founderCard()` in `after` (see `freeze.ts`) |
| ≤ 6 frames | the Nole check | `{type: 'palette', to: 'LEDGER', mask: checkMask}` (or the whole frame) |
| 480–539 | THE PLAYERS roll call (brief v2.1; the old CHATGTP / FIRED / BACK slot is Ep1-only) | BASE; the last portrait is a hand-built GLYPH cursor |
| 718–719 | the iris shows the skyline in glyph | `{type: 'glyph', mask: radialMask(irisX, irisY, r), source: skylineBuf}` for 2 frames |

**Tone curves.** Every non-BASE set maps OKLab lightness through a `ToneCurve {lo, hi, gamma}` tuned on the show's night rooms (most pixels sit at L 0.12–0.4). A brighter set, such as the Woodrose dinner or the dusk skyline, should derive a variant instead of editing the shared set:
```ts
const DINNER_FREEZE = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.25, hi: 0.8, gamma: 1}});
```
To compare curves side by side, render a grid with `src/dev/pixelengine/tools/tune.ts`.

---

## 3. Scale standards

| Thing | Size (native px) | Notes |
|---|---|---|
| Room sprites, standing adults | **70–90 tall** (Mas 74–78, Nole 86) | about a 5.5-head figure. Acting happens in portraits, not here. |
| Room sprites, seated | ~68 (Mas at his desk) | |
| Kid Mas (8) | ~52–56 tall | same head size as adult Mas, shorter body; keep the cowlick |
| Skyline rooftop bosses | 12–20 tall | 1 signature feature and 1 prop, readable as a silhouette |
| Dialogue portrait window | **112 × 136** inner | the approved portraits (`pixeladv/art/portraits.ts`), matching the brief's "~140 px" |
| Name-card portrait | 112 × 136 inner (`NAMECARD`) | same art as the dialogue portrait |
| Faces | hand-placed clusters | no noisy dither on skin; dither only at band seams and in backgrounds |
| Inventory and UI icons | 16–24 | string-map sprites |

**Name-card layout** (`nameCard()`; x, y = top-left of the portrait window):
```
 +--------------+ 10px +----------------------------------+
 |              |      | NOLE          14px display, accent | y+10
 |   portrait   |      | ======        2px rule, accent     | y+27
 |   112 x 136  |      | NAMED IT.     7px face, paper      | y+33
 |              |      | [SUED OVER IT.]  boxed stamp, red  | y+50
 +--------------+      +----------------------------------+   (black plate, accent top rule)
```
The text block is top-aligned so the lower half of the screen stays clear for the live character. Put it on the side away from the action with `textSide`.

Card timeline in frames (`k`): 0–2 the window opens in 3 held steps; 3 the name cuts in; 4 the rule; from 5 the tagline types on at 2 chars/frame; at 14 the stamp lands, kicked 1 px on its first frame.

**Lighting language** (inherited from pixeladv): the key light is the monitor (cyan, `C` family), the back or rim light is the hallway (tungsten, `W` family), and ambient is night (`N` family). Rooms are painted as (material, level) into a `MatBuf` and lit with `resolve()`. Figures are lit by `renderFigure()` bands. New materials: `defineMat(name, night[8], cyan[8], warm[8])`.

---

## 4. Animation conventions

- **Hold drawings.** Animate on 2s or longer. `holds(f, [[pose, n], ...])`, `cycle(f, frames, 2)`.
- **Swap, don't tween.** Mouths, lids, brows, head angles and arm poses are replacement drawings. Use `mouthFor(letter)` under the typewriter head, and `blinkAt(f, t0)` for a 3-frame half-closed-half blink.
- **Whole-pixel motion only.** `moveTo(f, t0, t1, a, b, ease, hold)` rounds to integers; pass `hold = 2` for a stepped move. No sub-pixel drift.
- **Never rotate or scale a sprite.** Draw the angle (three drawn head angles), or lean with an integer-step row `shear()`. Depth scaling and rotsprite look cheap.
- **Shake the room layer, not the UI.** Use integer offsets (`shakeAt(f, t0, SHAKE_DOOR | SHAKE_SLAM)`, `shiftBuf`). The interface never shakes.
- **Light changes are palette steps.** For silhouette to lit, use `stepImg(img, -3 .. 0)` or `silhouette(img, col)`. For flashes and dims, use a family step.
- **Windows open in 3 held steps** (`openStep`, `portraitWindow`), never with a smooth scale.
- **Typewriter** at 1–1.25 chars/frame for dialogue and 2 for card taglines (`typed()`).
- **Springs** such as hair tufts follow through in whole pixels after an impact (`spring()`).
- **Glyph tokens also move on the native grid** (4 px steps at 4×). They fade by walking toward lighter glyphs and the tint colour, not by blurring.

---

## 5. API reference

All exports come from `src/shared/pixel` (`index.ts`). File names are given for reading the source.

### Host: `PixelScene.tsx` / `compose.ts`
```tsx
<PixelScene
  draw={(fb, f) => { /* paint the 480x270 frame */ return {layers: [/* glyph layers */]}; }}
  after={(ui, f) => { /* UI that never switches: cards, dialogs */ }}
  palette={'BASE' | set | ((f) => id | null)}
  switch={spec | spec[] | ((f) => spec | spec[] | null)}
  bg={PAL.N0} hold={frame?} />
```
Pipeline per frame: `new Buf(bg)` → `draw` → `palette` → `switch` specs in order → present at integer scale → glyph layers → the `after` UI layer. `after` paints into a transparent layer (`TRANSPARENT`) that sits above both the frame and the glyph layers.

`SwitchSpec`:
- `{type: 'palette', to, mask?, invert?}`: a masked remap (`invert` means outside the mask).
- `{type: 'step', k, mask?, invert?}`: a family step.
- `{type: 'glyph', mask?, source?, style?}`: glyph render of the frame, or of another `source` buffer (the true world), inside `mask`.
- `{type: 'front', from, to, t0, frames, dir?, glow?, core?, tear?}`: render-front sweep between two palettes of the drawn frame. Leave `palette` unset while it runs.
- `{type: 'fade', from, to, t}`: ordered-dither crossfade between two palettes.

`composeFrame(props, f)` → `{fb, layers, ui, uiLayers}` runs the same pipeline without a DOM (Node previews, tests, contact sheets).

### Framebuffer and primitives: `px.ts`
`W, H, Buf(w, h, fill)` with `.set .get .ink(col) .clone .toRGBA`. Primitives: `rect, line, poly(pts), ellipse`, each taking a `Plot`. Also `copyBuf, cropBuf, shiftBuf, remapRect, clamp, hash, bayer, TRANSPARENT`. Sprites are string maps: `spr(src)`, `blit(b, s, x, y, charPal, {flip, clip, mask})`, `layer, patch, shear, opaqueAt`.

### Palette: `palette.ts`
`PAL.N0 ... PAL.P2`, `PAL_NAMES, PAL_INDEX, ramp(...names), FAMILIES, familyOf(c), stepColor(c, k)`. Colour math: `lum, lightness` (OKLab L), `oklab, nearest, hex`.
- **Promoted (v1.1):** the castrivals kit's extra ramps are now master families, appended so older indices are stable: `F0-F6` Mario's fleece, `I0` his ink blue, `U0-U5` the dusk bridge (violet to coral: the skyline, the roll call, the bosses), `Q0-Q2` the SPACEZ rocket red. Same hexes as `cast/bosses.ts` `CX`, so existing art is unchanged; family steps, prints and `strayColors` now treat them like every other ramp.
- `SKIN_COLORS`: every S, K and X colour (the dither-discipline list).

### Palette sets and remaps: `palettes.ts`
`PALETTES`, plus `BASE, TWOTONE_FREEZE, ONEBIT, EARLYWEB16, LEDGER, TERMINAL`.
- `applyPalette(b, id | set, {mask?, invert?, rect?, edge?})` and `inPalette(b, p)` (returns a copy).
- `remap(b, fn, opts)`, `familyStep(k)`, `lutRemap(table)`, `flatten(col)`, `strayColors(b)`.
- `compilePalette(def)` builds a new set (`mode: 'tone' | 'pair' | 'identity'`, `ramp`, `levels`, `tone`, `pattern`, `pin` for hand overrides, `solid` for colours that must never dither). `set.with({...})` derives a variant (it inherits `solid`), `set.entry(c)` returns `[a, b, t]`, and `set.map(c, x, y)` returns the output colour.

### The freeze print and the founder card: `freeze.ts` (one module for the whole dinner)
- `FOUNDERS[who]` (`'gerg' | 'alyi' | 'mario' | 'nole'`): card copy, the print ink (Gerg `L1`, Alyi `W3`, Mario `F3`, Nole `R0`) and the card accent. `PAPER` = `P2`.
- Print sets per founder: `freezePrint(who, tone?)` (the room: threshold + one 50% clustered screen), `freezeSolid(who, tone?)` (figures, faces, lettering, the linen, the featured founder: a hard threshold, each on its own curve), `freezePop(who, tone?)` (the 2-frame flash-print), `freezeShade`. The dinner applies them per pixel by owner (mdinner1 `printFrame`, mirrored in mdinner2; mdinner1 exports its `PRINT_TONES`). `freezeSwitches(who, masks)` gives the same as switch specs.
- `founderCard(b, {who, x, y, k, portrait, open?, customWindow?, fine?, kFine?, kStamp?})`: ONE geometry (portrait window top-left, the plate to its right, at most one fine-print line, the optional rubber stamp in that row). `rubberStamp()` draws a name-sized stamp with worn-rubber ink breakup. `CARD`, `cardBlockW()`.
- The era stamp (1993 / 2014 / 2015) is `eraStamp()` in `cast/era.ts`.

### Dither: `dither.ts`
`bayer2, bayer4, bayer8, checker, cluster4, lines(period, slant), hatch(period)`. Each is a `Threshold` `(x, y) => (0, 1)`.

### Masks: `mask.ts`
`new Mask()` stores 0–255 coverage per native pixel. Build it with `.addRect / .addEllipse / .addPoly / .addLine / .addImg(img, x, y) / .addSprite / .plot(v)`. Combine with `.invert .union .intersect .subtract .dilate(r) .binarize()`. Read with `.outline()` (beam edges), `.bounds()` and `.on(x, y)`.
Shapes: `coneMask(ax, ay, dirDeg, halfDeg, len, {soft, fade, start})`, `radialMask(cx, cy, r, soft)`, `imgMask(img, x, y)`. Soft coverage resolves with an ordered threshold, so a soft edge becomes a clean dither seam, and a glyph region's edge becomes a stepped cell edge.
To capture a character's coverage while drawing, use `blitImg(b, img, x, y, {mask: m.a})`, which writes 255. The legacy `blit(..., {mask})` writes 1, so call `m.binarize()` after it.

### Glyph: `glyph.ts` (pure) and `glyphDraw.ts` (DOM)
- `glyphLayer(src, style?, mask?, frame)` returns a `GlyphLayer` of tokens (density, contour edge, colour, alpha) plus the cells to fill with `style.bg`.
- `GlyphStyle` fields:
  - cell and density: `cell` (native px, default `[2, 3]`, which is 8 × 12 px at 4×), `tone`, `floor`
  - edges: `edges`, `edgeAt`
  - colour: `gain`, `tint`, `tintAmt`
  - motion and texture: `shimmer`, `shimmerStep`, `seed`, `noise`
  - output: `bg`, `bloom`, `weight`, `chars`, `size`
- `glyphDissolve(fb, img, x, y, {t, frames, wind, from, spread, lead, life, reverse, ...style})` draws the still-solid part of the sprite and returns the tokens. The sequence per cell: convert (a hot flash), sit briefly, lift off. Dim cells burn out in place, and bright cells blow away with per-token wind jitter and turbulence. With `reverse`, tokens fly home and snap back to pixels. Don't also blit the sprite yourself.
- `ensureGlyphFonts()`, `presentBuf(ctx, buf, view)`, `drawGlyphLayer(ctx, layer, view)` and `pickGlyph()` are for custom canvases such as contact sheets. `view = {scale, ox, oy, crop?}`.

### Transitions: `transitions.ts`
- `renderFront(out, a, b, pos, {dir, smear, glow, core, tear})` and `frontPos(f, t0, frames, len)` → `{pos, smear}`. The beam is eased in and out. Behind it, A and B interleave in a dithered band that follows the per-frame travel (capped at 16 px).
- `ditherFade(out, a, b, t, thr)` and `ditherWipe(out, a, b, pos, {dir, soft})`.

### Sprites and poses: `sprite.ts`
- Timing: `holds, onN, cycle, ease, moveTo, moveTo2, hop, shakeAt, SHAKE_DOOR, SHAKE_SLAM, spring, typed, mouthFor, blinkAt, openStep`.
- Images: `imgFromSprite, imgFromBuf, mapImg, silhouette, stepImg, flipImg, outlineImg, imgBounds`.
- Pose sheets: `PoseSheet` and `drawPose(b, sheet, pose, footX, footY)`, which puts the foot anchor on the floor line.

### Figures and light: `figure.ts`, `light.ts`
`renderFigure(fig, rig)` produces an `Img`. The pieces are `P.poly / P.ell / P.rect / P.line / P.map`, `Part`, `Adjust`, `Stamp`, and `LightRig` (key and back bands, rim, outline, falloff). Place the result with `blitImg(b, img, x, y, {flip, clip, map, mask})`. For rooms: `MatBuf`, `resolve(mb, lights, out)`, `MATS`, `defineMat`.

### Text and UI: `font.ts`, `ui.ts`
- Text: `text(b, s, x, y, col, {shadow, outline})`, `textWidth`, `wrap`, `bigText`, `bigTextWidth`, `BIG_CAP`. v1.1 adds the glyphs `$`, `·` and `✓` to the 7px face (and so to the display face).
- Windows: `panel`, `namePlate`, `portraitWindow(b, x, y, w, h, {open, name, accent, content})`, and `dialogueBox(b, x, y, w, str, shown, col, f, tail)`.
- Cards and alerts: `nameCard({x, y, name, line, stamp, accent, k, portrait, textSide})` and `alertDialog(b, x, y, w, {title, body, buttons, disabled, def})`, which draws a 1-bit system alert with greyed buttons.

---

### Generated-video inserts: `genclip.ts`, `GenVideo.tsx`, `plate.ts` (added 2026-09-25)
A clip from a video model, converted offline by `tools/genvideo/pixelize.py`, becomes palette-exact native drawings plus `clip.json` in `studio/public/genvideo/<shot>/`. Inside a shot it is just another `Buf`, so masks, palette switches, GLYPH and the render front all apply to it. The full guide is `tools/genvideo/README.md`.
- `<GenVideoScene clip="genvideo/<shot>" placement={{from, offset, loop}} draw={(fb, f, gen) => ...}>` is a `PixelScene` whose `draw` also receives the clip's current drawing (loaded under `delayRender`). `<GenVideoPlayer src>` is a whole-frame MP4, for straight cuts only.
- `blitGen(fb, gen, {mask, invert, dx, dy, key})` composites the clip inside a mask ("only the sky", "only the ceiling hole"). `maskFromColors(fb, cols, rect)` keys a region by palette colour. `genHandoff(fb, gen, t)` hides the re-quantisation on a **match cut** (2–6 frames on frames that already match; it is not a transition, see §2 rule 7).
- **Clean plates.** Rendering with `--props='{"genvideoPlate":true}'` makes every `PixelScene` show only what `draw()` paints: no `after` UI, no glyph layers, no palette or switches. Scenes that paint UI inside `draw()` can check `isGenvideoPlate()`. It is off by default, so no existing render changes. `tools/genvideo/keyframes.py` uses it to export conditioning frames.

## 6. Recipes

**The Orb scan.** Mas's room stays BASE. Inside the beam, the true world shows in glyph for 5 frames.
```ts
const world = new Buf(); // the true world, drawn by you
<PixelScene
  draw={(fb, f) => { drawRoom(fb, f); drawCathedral(world, f, VP_ON_CONE_AXIS); }}
  switch={(f) => f >= 99 && f < 104 && {type: 'glyph', mask: coneMask(ox, oy, 196, 19, 300, {soft: 2.5, start: 5}), source: world,
    style: {tone: {lo: 0.1, hi: 0.5, gamma: 0.8}, noise: 0.35, bloom: 0.8}}} />
```
Aim the true world's vanishing point along the cone axis so the reveal reads as depth, not texture. Align rectangular masks to the glyph cell grid (multiples of 3 rows for the default cell).

**Freeze everything except Mas.**
```ts
let live = new Mask();
draw = (fb, f) => { live = new Mask().addRect(0, 203, 480, 67); drawWorld(fb, CARD_FRAME); drawMas(fb, f, {mask: live.a}); };
switch = () => ({type: 'palette', to: '2TONE_FREEZE', mask: live, invert: true});
after = (ui, f) => nameCard(ui, {x: 12, y: 28, name: 'NOLE', line: 'NAMED IT.', stamp: 'SUED OVER IT.', accent: PAL.W7, k: f - CARD_IN, portrait: ...});
```

**1-bit, then the render front up the eras.**
```ts
palette = (f) => (f < 8 ? 'ONEBIT' : f >= 20 && f < 28 ? 'EARLYWEB16' : null);
switch  = (f) => f >= 8 && f < 20 ? {type: 'front', from: 'ONEBIT', to: 'EARLYWEB16', t0: 8, frames: 12}
               : f >= 28 && f < 40 ? {type: 'front', from: 'EARLYWEB16', to: 'BASE', t0: 28, frames: 12} : null;
```

**FIRED / BACK.** Paint the tile once into a keyed buffer and capture it with `imgFromBuf(buf, x, y, w, h, KEY)`. Then return `{layers: [glyphDissolve(fb, tile, x, y, {t: f - t0, frames: 22, wind: [7, -1.6]})]}`. For BACK, use the same call with `reverse: true`, or a `front` sweep back to BASE.

**The palette blooms brighter.** `{type: 'step', k: 1}` for 2–4 frames on the button press. Use `k: 2` for a flash.

---

## 7. Compatibility and ownership

**v1.1 behaviour changes (the art director's cross-moment fixes, applied by the engine owner):** `2TONE_FREEZE` is now a threshold plus one pattern (levels 3, was 5) with skin solid; `EARLYWEB16`, `LEDGER` and `TERMINAL` resolve skin to one flat colour (derived sets such as meras' `ERA08`/`ERA14` inherit this unless they pin skin themselves); family steps now walk the promoted `F`/`I`/`U`/`Q` ramps (they used to leave those colours alone). The engine demos in `out/lookdev/pixel/engine/` were re-rendered.

- `src/dev/pixeladv/core/{px,palette,light,font,figure}.ts` are now **re-export shims** of `src/shared/pixel/*`, so every old import path and export still works. `src/dev/pixeladv/PixelCanvas.tsx` now wraps `<PixelScene>`. The approved pixeladv stills re-render **pixel-identically** through both paths, verified by a diff against `out/lookdev/structures/pixeladv/key.png` and `extra-switch.png`.
- New code should import from `src/shared/pixel`.
- `src/shared/pixel/cast/` belongs to the cast builders (character sheets). It is not part of the engine and is not exported from `index.ts`.
- Engine changes must stay additive. Do not change the behaviour of an existing export: other builders render with it.

## 8. Demos
The code is in `src/styleframes/pixelengine.frame.tsx` and `src/dev/pixelengine/`, and the output is in `out/lookdev/pixel/engine/`.

- **`pixelengine-switches`**: one panel per frame. `--frame=N` gives:

  | N | Panel |
  |---|---|
  | 0 | BASE |
  | 1 | freeze |
  | 2 | 1-bit |
  | 3 | early-web |
  | 4 | ledger |
  | 5 | terminal |
  | 6 | cone remap |
  | 7 | cone glyph |
  | 8 | glyph |
  | 9 | family step |

- **`pixelengine-switches-sheet`**: a 3×3 contact sheet of the panels.
- **`pixelengine-dissolve`**: 48 frames. A call tile breaks into tokens, blows away, and re-forms.
- **`pixelengine-renderfront`**: 48 frames. 1-BIT → EARLY-WEB 16 → BASE.
- **`genvideo-window`, `genvideo-handoff`, `genvideo-glyph`** (`src/dev/genvideo/entry.tsx`): converted clips inside pixel shots (a masked sky plate and a ceiling hole, a match-cut handoff, GLYPH on a clip). Their clips come from `tools/genvideo/test_genvideo.py`.
