# ANIME CEL — lookdev notes (key: `anime`)

Modern prestige-TV anime look (seinen maturity: Psycho-Pass / Death Note / Monster, not moe).
Thin variable-weight lineart, one hard cel shadow per material, a soft 1-step highlight, clumped hair
with a broken specular band, rim lights, and a compositing ("satsuei") pass: night multiply, light wrap,
bottom para, diffusion bloom, grain.

## Files (all owned by this builder)
| file | what |
|---|---|
| `src/shared/anime/ink.ts` | Point-list authoring kit: Catmull-Rom fills (`curve`), **tapered pen strokes** (`ink`: filled polygon, in/out taper + pressure), corner points `[x,y,1]`, `chains`, `swayTips`/`bend` (hair spring), `prng` |
| `src/shared/anime/cel.tsx` | Shared rig types (`AnimeRig`), `Eye` (lids/iris/glints/closed drawing), `MouthDraw` (6 shapes), `Rim` (automatic silhouette rim light), `Clip`, `SoftDef` |
| `src/shared/anime/hair.tsx` | `Lock` (overlapping front locks), `lockLines`, `shineBand` (broken angel-ring highlight with teeth) |
| `src/shared/anime/palette.ts` | Night/monitor color scripts for Mas, Nole, lights |
| `src/shared/anime/Mas.tsx` | `AnimeMas` bust rig |
| `src/shared/anime/Nole.tsx` | `AnimeNole` bust rig (+ `phoneGlow`) |
| `src/shared/anime/Room.tsx` | `RoomBack` (wall, window city + bokeh, curtain, LED shelf, light cone, dither), `RoomFront` (desk, keyboard, mug, monitor UI in fake perspective, bloom), `Motes`, `ForegroundBlur` |
| `src/shared/anime/Grade.tsx` | `AnimeGrade` (para, vignette, grain), `DiffusionDefs` (bright-pass bloom) |
| `src/shared/anime/Motion.tsx` | `AnimeMotion` + timing helpers (`hairSpring`, `flickerAt`, `tiltAt`) |
| `src/styleframes/anime.frame.tsx` | frames: `anime-lookdev`, `anime-motion`, `anime-rig-sheet` |
| `src/dev/anime/entry.tsx` | dev entry |

## Renders
```
npx remotion still  src/dev/anime/entry.tsx anime-lookdev   ../out/dev/anime/lookdev.png   --bundle-cache=false --log=error
npx remotion still  src/dev/anime/entry.tsx anime-rig-sheet ../out/dev/anime/rig-sheet.png --bundle-cache=false --log=error
npx remotion render src/dev/anime/entry.tsx anime-motion    ../out/dev/anime/motion.mp4    --bundle-cache=false --log=error --concurrency=2
```
Cost on this CPU box: still ~30-45 s (incl. bundle); motion ~15 s/frame/worker → 72 frames ≈ 9.5 min at concurrency 2.
The diffusion pass (`<use href=#scene>` + blur) roughly doubles frame cost. Drop it for animatics.

## Using the rigs
```tsx
<svg viewBox="0 0 1920 1080">
  <g transform="translate(1060 505) scale(0.8)">
    <AnimeMas uid="shot12-mas" lookX={0.5} lid={0.14} mouth="E" brow={0.3} tilt={-2}
              hairX={hairSpring(frame)} light={flickerAt(frame)} ink={1} night={0.5} />
  </g>
</svg>
```
- Local units: eye line y≈-8, chin ≈176 (Mas) / 191 (Nole), crown hair ≈-278/-314, neck pivot (10,150)/(14,160).
- `uid` must be unique per instance on a page (SVG defs ids).
- `ink`: line-weight multiplier. ~1.0 for two-shots (scale 0.7-0.8), **~0.7 for close-ups** (scale 1.3+) so lines stay pen-sized on screen, as in real anime (genga paper size is fixed).
- `light` drives the monitor: rims, light wrap, cyan hair shine, iris glint. `night` = compositing multiply (0.5-0.6 in the night room).
- Mouths: `rest` (Mas: calm closed smile / Nole: smirk), `smile`, `A`, `E`, `O`, `M`.
- `lid` > 0.9 swaps to the closed-lid drawing (not a squashed eye). Blink = 4 frames: `0.55, 1, 1, 0.5`.
- Hair: `hairX/hairY` move lock tips only (roots pinned); the cowlick bends from its root with 1.8x gain. Drive it with `hairSpring()` (damped spring on head angular acceleration).
- Rims are automatic: `Rim` = silhouette minus silhouette shifted toward the light, so they follow tilt and hair sway and can be re-aimed per shot (change dx/dy).

## Timing rules that make it read as anime (not Flash)
- Character drawings **on 2s** (`on2s(frame)` for rig params); blinks/darts are placed on exact frames.
- Camera push, light flicker, dust, bokeh, grain run **on 1s**. That's the real TV-anime split.
- Eye dart = 1 in-between (smear) + 1 overshoot frame + settle. Lip flap: M → E → A → O → E → rest, 2-3 frames each.

## Rig limitations in this style (honest)
1. **Head turns need separate drawn angles.** Everything here is authored for ONE angle (3/4 facing screen-right).
   Front / profile / 3/4-left means a new FACE, EYE, NOSE, MOUTH, HAIR and LOCKS point set (≈1-2 days per angle per
   character). Anime faces are contour-driven: in a turn the nose crosses the cheek contour and the far eye
   changes shape, so tweening points between angles produces rubbery morphs. Switch angles **on a cut, a blink, or a
   1-2 frame smear drawing**, never with an interpolated morph.
2. **Lineart must be redrawn per angle.** Lines are generated from the same points as the fills, so they stay registered
   through tilt/sway/lids, but a new angle means new lines. Line weight is global (`ink`), not per-shot hand-tuned.
3. **Cel shadows are drawn for one light direction** (key from screen-right). Changing light color/intensity is free
   (compositing); changing its direction needs redrawn shadow shapes. **Mirroring** (to face left) also mirrors the
   shadows, so a mirrored character is lit from the other side unless you author a second shadow set. Nole mirrors
   cleanly; Mas's cowlick flips with him (fine, it follows his facing).
4. **Head tilt is limited to about ±5°.** Beyond that the baked shading, the neck junction and the hood read as
   a rotated cut-out.
5. **Hands are the most expensive part.** Nole's phone hand is a single held drawing. Any hand acting (typing,
   gesturing) needs new drawings. Stage hands off-screen, in held poses, or in silhouette.
6. **No jaw drop** on open vowels (only the mouth shape changes). Fine for TV lip flap; a close-up scream needs a
   separate jaw/chin drawing.
7. **Hair sways only at lock tips** (secondary motion). Big hair motion (wind, a head whip) needs drawn hair keys.

**Looks great:** blinks, eye darts, 4-6 shape lip flap on 2s, brow acting, small tilts with hair follow-through, held
poses with light acting (monitor flicker, a new-message flash, phone glow), slow camera push with BG parallax, dust,
bokeh, diffusion. Holds with living compositing are authentic anime, not a shortcut.

**Looks cheap (avoid):** smooth-tweened body sway on 1s (Flash puppet), sliding pupils on 1s, morphing between mouth
shapes, head rotation past ~5°, mirrored flips without relight, continuous arm/hand motion, squash/stretch on faces,
lip sync on 1s.

## Known weaknesses / next steps
- Nole's fist is readable but stiff (stacked fingers). A real hand drawing would help a close-up.
- Clothing folds are minimal. Nole's black tee is a big flat mass (the violet window rim is doing the separation).
- BG city is procedural blocks under DOF blur: good out of focus, not usable in sharp focus.
- Hair shine teeth are hand-placed per character and could use another art pass. Nole's hair reads slightly helmet-like.
- Only one lookdev angle per character. No turnaround yet (see limitation 1).
- Sky gradients band at 8-bit. `RoomBack` adds a soft-light noise layer to dither, still faint on huge flat areas.
- Cost: the diffusion pass is the main render expense.
