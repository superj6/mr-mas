# env: cold-open set + THE ORB + monitor screen, as tonal models

## What was built
- `src/shared/tonal/env/darkRoom.ts`: `darkRoom(params)` is the cold-open set, 1920x1080 local units, box `[0,0,1920,1080]`.
  It's a dark room at night. There is one key light: the monitor, seen from a 3/4 back-side angle with its screen facing Mas.
  The other pieces:
  - a halo on the wall and a light pool on the desk (posterized falloff)
  - a rim light wrapping the bezel
  - window blinds with a faint warm city column and two bent "someone peeked" slats
  - a server rack with deterministic blinking LEDs
  - a framed print (an exponential curve)
  - a desk edge rising toward Mas (leading line)
  - a keyboard
  - **the glass of water**: flat mirror water surface, screen reflections, a caustic inside its cast shadow
  - display and power cables
  Mas's area (x 250-900) is background only.
  Hard-surface props are built in cm world space and go through a pinhole camera (`geo.ts`). Wall art is designed in frame space and pushed onto the wall plane. Result: `camX/camY/zoom` give real parallax.
- `src/shared/tonal/env/orb.ts`: `orb({iris, gazeX, gazeY, glow, spin, R})`. A chrome sphere (R=75, so 150 px) built from reflections:
  - dark ceiling cap, a curved reflected horizon, the lit desk below it
  - the monitor as a warped hot quad on the screen-right side
  - window slats, a sliver of Mas, rack LED sparkles, a Fresnel rim
  The mechanical iris is a real disc on the sphere surface. Gaze sets its ellipse foreshortening, and a seam ring (only its visible half is drawn) is computed in 3D, so gaze changes read as an eyeball turn. It has 7 pinwheel aperture blades that rotate as they open, a lens core with a pupil, and a catch-light that stays fixed in screen space.
- `src/shared/tonal/env/monitorScreen.ts`: `monitorScreen({draft, typed, caret, hype})` is the close-up insert, box `[0,0,1920,1080]`. It's a generic dark-mode "post composer" with a draft reading "we are so close.", and a flat log-scale chart (decade + minor gridlines, then -> now) with a dot labelled **you are here** and a dashed "projection" shooting straight up to "soon". The trending column shows "agi by friday", "is it the knee?" and similar. There are no real logos; the NOLE parody is the only name.
  All text uses `strokeFont.ts`, a small monoline font. Every line (text, icons, rings) is emitted as a **filled outline**, so it follows tone in noir, engrave and dither, which ink real strokes.
- `src/shared/tonal/env/index.ts`: `coldOpen({room, orb, orbAt, mas})` merges set -> Mas -> orb into one model, with hue namespaces. Raster styles sample them together, and each layer gets depth-correct parallax (`layerTransform`). `MAS_PLACE` = translate(575 572) scale 1.0, depth 100. `ORB_PLACE` = (820, 330), depth 104.
- `src/shared/tonal/env/EnvView.tsx`: `<EnvView model style width height view?>` renders any env model in any style:
  - `paint | soft | noir | riso | engrave`: shared `ToneSvg`. Engrave and noir pitch are scaled to output size so thumbnails don't moire.
  - `glyph | dither | stipple`: shared `ToneCanvas`. Cells are specified at full-frame scale.
  - `pixel`: see the pixel notes below.
  - `softenv`: my own soft-light fallback.
  - `value`: a notan check view.
- `src/shared/tonal/env/geo.ts`: camera/projection, path builders, Catmull-Rom `smooth`, `strokeFill`/`ringFill`, `mergeModels`/`transformModel`, deterministic `hash01`.
- `src/styleframes/env.frame.tsx` and `src/dev/env/entry.tsx`.

## Compositions (dev entry `src/dev/env/entry.tsx`)
| id | what |
|---|---|
| `env-tone-test` | set + orb in 8 styles + a value-check panel (3x3 grid) |
| `env-tone-test-mas` | same grid with Mas composited in |
| `env-set-<style>` | full-frame set: paint, soft, softenv, noir, riso, engrave, glyph, pixel, dither, value (+ `env-set-glyph-graded`) |
| `env-mas-<style>` | full-frame set + Mas: paint, soft, softenv, noir, riso, engrave, glyph, pixel, dither, value |
| `env-orb-sheet` | orb model sheet: iris 0/.35/.7/1, glow 0/1, gaze Mas/camera/monitor/up, noir, pixel |
| `env-screen-paint`, `env-screen-noir`, `env-screen-tone-test` | monitor-screen insert |
| `env-motion-{paint,soft,noir,glyph,pixel}` | 3 s tests (72 f): camera drift + push-in with parallax, monitor flicker (pools snap smaller at f30-33), orb notices camera and dilates then looks back, Mas blinks and darts his eyes, LEDs blink, the glass stays perfectly still |

Rendered to `out/dev/env/`. Render with:
`npx remotion still src/dev/env/entry.tsx env-tone-test ../out/dev/env/env-tone-test.png --bundle-cache=false --log=error`

## Model extensions (all optional; other renderers ignore them)
- `soft` is the shared TP field. Light falloff planes use large values, so the soft renderer turns posterized rings into real gradients.
- `bg: true` marks backdrop planes (wall, halo, desk top + pools). In the pixel tier, these are rendered underneath on the same pixel grid: glows are blurred, then quantized with a two-nearest-colour ordered dither. Flat walls stay flat and only glows dither, like hand-dithered bands. Objects are drawn over them by the shared pixel renderer (sel-out and contact lines).
  Why: the shared pixel renderer draws contact lines between hue groups, which outlined the posterized halo like a physical arch. Its backdrop dither has a fixed ±13 offset, which made flat walls shimmer.
- `readTone`: the tone used by value-sampling renderers (glyph/dither/stipple). Colour renderers separate two dark planes by hue alone (warm blinds vs navy wall); value renderers can't. So in glyph/dither:
  - the bare wall and the outer halo read as black;
  - the city gaps read one step up.
  Result: noir keeps big blacks with one glow, and glyph/dither get clear silhouettes (blinds, print, rack faces, orb) cut out of black.
- Per-surface `angle` (engraving): walls are vertical hatch, blinds and rack horizontal, the monitor diagonal, the desk follows its front edge.

## Rig / animation limits in these styles (for the showrunner)
- **What animates cheaply, in every style**:
  - camera drift/push with true parallax (props are 3D-projected, wall art sits on the wall plane);
  - monitor flicker (`glow` changes pool sizes);
  - LED blink (`t`);
  - orb iris, gaze, glow, spin, bob;
  - screen typing (`typed`), caret blink, and the `hype` dash growing.
  The glass never ripples by construction, which is the gag.
- **Light is posterized**: in paint, noir and riso, a light change is a shape change (rings grow and shrink), not a smooth dim. Flicker should be a few snapped frames, not a fade. Soft and pixel give real falloff.
- **No light interaction with Mas**: the set's glow doesn't relight Mas. His rig has fixed monitor-side lighting. A monitor flicker should be paired with an animated Mas highlight (his `light` planes), or the flicker reads only on the set.
- **Orb gaze**: max about 52 deg off-axis (the iris housing must stay on the visible hemisphere). There is no roll. Reflections are environment-fixed and don't update if the orb crosses the frame; they're fine within about ±150 px of the default spot.
- **Monitor**: one fixed 3/4-back view. Don't show the screen face in the wide shot. Cut to `monitorScreen()` for the insert (a different camera; the geometry is not shared).
- **Camera limits**: keep moves small (about ±10 cm lateral, zoom ≤ 1.1). The wall halo is a wall-plane shape, so large moves slide the monitor across its own glow.
- **Pixel**: the backdrop dither is in screen space. On camera moves the dither pattern stays put while the walls shift a few pixels (subtle "shower door"). Prefer locked-off shots in pixel, or move in whole art-pixels (5 px at 1080p).
- **Glyph**: small objects (the orb, about 12 glyph cells wide at cell 12) read as token clusters, not shapes. Use a closer framing or a smaller cell for orb beats.
- **Engrave / riso**: fine hatch moires below about 5 screen px of pitch. EnvView scales the pitch automatically for thumbnails; custom framings should pass a style with `pitch` if needed.

## Known weaknesses
- Paint: the posterized halo still reads a little like concentric rings. It's intentional for the flat style but the least "painterly" part. Soft is the realistic answer.
- The keyboard is simplified: its left end cap and cast shadow form a dark wedge, and the keys read as texture, not legible keys.
- Monitor geometry is cheated: Mas's 3/4 gaze and the 3/4-back monitor are not physically consistent in one space. It's a staging cheat and reads fine.
- Riso inverts the night mood: light paper and ink shadows. It reads as a print, not a night scene.
- The shared renderers (ToneSvg/ToneCanvas) were changing while this was built. The set uses their current API (`soft`, the `pixel` style, `pitch`, `outline`). If their defaults change, re-check the grid.
- The screen insert's text in glyph and dither is texture only.
- Render cost for a 72-frame 1080p motion test at concurrency 2, CPU only:

  | Style | Time |
  |---|---|
  | paint | about 23 s |
  | noir | about 21 s |
  | pixel | about 15 s |
  | glyph | about 27 s |
  | **soft (shared renderer)** | **about 400 s** (per-plane blur filters and brush texture) |

  Budget soft for final passes only, or preview with `softenv`, which is much cheaper.
