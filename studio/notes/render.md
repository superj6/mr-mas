# render — tonal renderers (ToneSvg / ToneCanvas / styles)

Owner: `render` builder. Files:

- `src/shared/tonal/ToneSvg.tsx`: vector renderers `paint | soft | noir | riso | engrave`
- `src/shared/tonal/ToneCanvas.tsx`: raster renderers `glyph | pixel | dither | stipple`
- `src/shared/tonal/styles.ts`: style tokens, `paintTone`, `softTone`, `sssTone`, `noirTone`, `TONE_VALUE`
- `src/shared/tonal/render/geom.ts`: path flattening, transforms, plane analysis (base vs interior)
- `src/shared/tonal/render/color2.ts`: HSL tweaks, `isWarm`, OKLab palette matching
- `src/shared/tonal/render/glyphRamp.ts`: measured glyph-density ramp
- `src/styleframes/tonetest.frame.tsx`, `src/dev/tonetest/entry.tsx`, `src/dev/tonetest/debug.tsx` (debug only)
- `types.ts`: added two optional TP fields (`soft`, `base`). Nothing else changed.

## Compositions (dev entry `src/dev/tonetest/entry.tsx`)

| id | what |
|---|---|
| `test-tone-styles` | 1920x1080 grid: soft, paint, noir, riso, engrave, glyph, pixel, dither, hedcut + legend |
| `tone-hero-<style>` | 1920x1080 single-style lookdev still (Mas at hero framing, key from screen-right) |
| `tone-motion-<style>` | 72-frame (3 s) motion test: blink, eye dart, brow, mouth swaps, ±2.2° tilt, monitor flicker, camera move. Everything on 2s. |
| `tone-debug`, `tone-debug-cmp` | plane classification dump, soft-pass A/B toggles (debug only) |

```
npx remotion still  src/dev/tonetest/entry.tsx test-tone-styles ../out/lookdev/looks/tonetest.png --bundle-cache=false --log=error
npx remotion render src/dev/tonetest/entry.tsx tone-motion-pixel ../out/lookdev/looks/render/motion-pixel.mp4 --bundle-cache=false --log=error --concurrency=2
```

## Outputs

- `out/lookdev/looks/tonetest.png` (also `out/lookdev/looks/render/tonetest.png`): the 9-style grid
- `out/lookdev/looks/render/hero-<style>.png`: 1080p lookdev stills for all 9 styles
- `out/lookdev/looks/render/motion-<style>.mp4`: 3 s motion tests for all 9 styles

Measured render cost (1080p, 72 frames, `--concurrency=2`, this CPU): soft ≈ 2m40s, glyph ≈ 1m35s,
engrave ≈ 1m25s, pixel ≈ 1m, and paint/noir/riso/dither/stipple each under about 1 minute.

## API (stable: everything new is optional)

`<ToneSvg model style transform? uid? boil? texture? wobble? />`
- `style`: now also takes `'soft'`. Raster ids passed here fall back to flat paint.
- `boil` (soft): seed for the brush texture and edge wobble. Default fixed. Change it every 6-8 frames only if you
  want a painted boil.
- `texture` (soft, 0..1, default 1), `wobble` (soft, default true).
- Every instance now gets unique def ids from `useId()`, so two characters in one SVG never clash. `uid` is still accepted.
- `feats` (debug only): e.g. `'-rim -bounce -falloff -ao -sss -glow'` switches soft passes off for A/B checks (see `tone-debug-cmp`).

`<ToneCanvas ... bloom? edges? noise? outline? bands? snap? />` (all optional)
- glyph: `bloom` (0.75), `edges` (contour glyphs, true), `noise` (faint background tokens, 0).
  With no `glyphs` it uses a measured token ramp; if you pass `glyphs` it is used as the ramp in the order you give.
- pixel: `outline` (sel-out, true), `bands` (checker transitions on big cloth planes, false), `palette` (default 32 colors).
- `snap` (true): snaps the view origin to the cell grid for glyph, pixel and dither.
- Fixed: every effect run now takes its own delayRender handle, and cancelled runs release theirs. Motion renders
  of glyph used to risk blank frames or timeouts.

`TP` optional fields (for model builders):
- `base?: boolean`: force a plane to be a silhouette (true) or interior shading (false).
- `soft?: number`: edge softness in local units for the soft renderer (0 = crisp).

`ToneStyle` optional tokens: `shade` (cool ambient), `bounce`, `sss`, `pitch` (line/dot pitch for engrave and
the noir halftone, in local units; keep it at 5 screen px or more).

## How to author planes so SOFT looks right (important for model builders)

The soft renderer infers structure from the flat stack (see `analyze()` in `render/geom.ts`):
- The first plane of a hue key is that group's **silhouette**. It has a crisp edge and becomes the clip for later planes.
- A later plane with the **same hue**, a **different tone**, and ≥85% of its outline inside the group's silhouettes is
  **interior shading**. It gets blurred according to size and tone and clipped to the silhouette, edge-extended so
  shadows stay solid up to the contour. Warm hues get a subsurface fringe; tone 0-1 planes get cool bounce from the background.
- The same hue and the same tone as the first plane, or not contained, means another silhouette (hood collar, cowlick, second brow).
- `light: true` planes become screen glows plus bloom.
- Separate objects with the same hue as something behind them (a hand in front of the face, the far arm) should
  set `base: true`. Otherwise they get treated as shading. Crisp cast shadows: `soft: 0`.
- Big silhouettes (minDim ≥ 60) also get a form falloff (inner shadow away from the key), a narrow key rim only
  on edges that border empty background, and a soft contact shadow on whatever is behind them.
- Key light is assumed at screen-right (the MAS convention). A flipped shot will want mirrored rigs.

## Per-style rig limits & animation caveats

These apply to **all** styles: lighting is baked into the planes. Light **color or intensity** can animate
(monitor flicker through `style.spot`), but a light **position** can't move unless the shadow planes are redrawn or
swapped (2-3 lighting variants per drawn head angle). No 3D turns: each head angle is a separate drawing, swapped on cuts or smears.

- **soft (closer to realism)**: the costliest style, about 2.2 s/frame at 1080p on this CPU (≈150 SVG filters per
  character), so budget render time or pre-render long holds. Shading planes rotate with the head, so the light
  "sticks" to the face on tilts. That reads fine up to about ±5°; past that, counter-rotate the shadow planes.
  Soft shading makes sliding features (`turn`) look like cut-outs sooner than flat styles do, so keep `turn` small.
  Texture and edge wobble are computed in each part's own space, so neither swims over the face (no shower-door).
  Leave `boil` fixed: texture boil reads as flicker on a realism style.
- **paint**: flat and cheap. Any 2D rig motion works. Light planes now use the lightened local hue mixed with the
  spot, not raw cyan.
- **noir**: flat ink plus a spot halftone on skin mid-tones. The halftone pattern lives in part space and rotates with
  the head. Hard shadow shapes make lighting changes obvious, so lighting variants must be drawn.
- **riso**: halftone screens are in model space (fine on moves). The misregistration offset is fixed; jitter it on 2s
  for a print boil.
- **engrave**: real swelling burin lines (tone field blurred, then thresholded against a triangle-wave line field)
  with cross-hatching in deep shadow. It **moires** once line pitch drops toward the pixel pitch, so keep `pitch` at
  ≥ ~5.5 screen px (`pitch = 5.5 / pxPerUnit`) and re-derive it on zooms bigger than about ±20%. Thin lines alias
  on sub-pixel drift, so animate on 2s. Lines are straight within each plane (no curved contour-following).
- **glyph**: the cell grid is screen space, so the character moves *through* a fixed terminal grid. That is inherent
  and fits the look. Features smaller than ~2 cells (pupils, lids) drop out: use close-ups with ≥ 40 columns across
  the face, and don't do wide shots. Token reshuffle (seed on 4s) gives a "latent" shimmer; lock it to the beat.
  Blinks and mouths read only in close-up.
- **pixel**: any sub-pixel motion or rotation re-rasterizes edges (**pixel crawl**). Mitigations already in place:
  view snapped to whole cells, dither only on the backdrop (anchored to the view), faces flat-posterized so there
  is no dither crawl on skin, and the motion test on 2s. Still to avoid: continuous head tilt (steps visibly; use 0°
  or hand-authored angle swaps), zooms (cut instead, or use integer scale steps only), and 1-px features like
  catchlights, which can pop in and out as the rig moves.
- **dither (1-bit)**: Bayer is anchored to the view, so camera pans are clean, but anything moving *inside* the frame
  (head tilt, mouth) swims through the screen-space pattern (the classic Obra Dinn problem). Keep in-frame motion
  small and on 2s. Contour lines hold the read.
- **stipple (hedcut)**: dot rows follow each plane's `angle`, the lattice is in model root space, and dot size comes
  from the smoothed tone. Camera moves are clean. The head's dots don't rotate with the head, so tilts swim slightly.
  Animate on 2s or 3s. Re-seeding the lattice offset every 3 frames gives a deliberate hand-stippled boil.

## Known issues

- Earlier Mas rig revisions (another builder's file) showed a hard neck-bottom edge over the hood collar in every
  style. That came from the model, not the renderer.
- Glyph: the mouth registers only faintly at hero framing, even with drawn lines widened to ~1.3 cells. Mouth-driven
  acting needs close-ups in this style.
- Soft's plane classification is heuristic. Odd rigs may need `base`/`soft` hints (see above).
- Engrave line directions are per plane, so abrupt direction changes at plane borders are expected (engraver-like).
- Hedcut/glyph/pixel/dither are CPU canvas renders, roughly 0.5-1.5 s per 1080p frame.
