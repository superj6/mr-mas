# pixeladv — structure test: 1990s point-and-click adventure, true pixel art

**Pitch.** The whole show is played as a LucasArts/Sierra-era adventure game, lit like contemporary indie pixel art.
All art is authored on a native 480x270 grid and scaled 4x nearest-neighbour to 1080p. Nothing is downsampled
from vector art, and no filter is applied. Limited animation is the medium's own convention, not a shortcut: sprite
drawings held on 2s, replacement mouths, whole-pixel nudges, palette swaps.

## Deliverables (out/structures/pixeladv/)
| file | composition | notes |
|---|---|---|
| scene.mp4 | `pixeladv-scene` (120f @24) | rendered `--scale=0.5 --concurrency=1` (each art pixel = 2x2 px) |
| key.png | `pixeladv-key` (still, holds f74) | Nole's jab on "I came up with the name!" |
| extra-portraits.png | `pixeladv-extra-portraits` | both conversation portraits + replacement parts at 2x |
| extra-lineup.png | `pixeladv-extra-lineup` | height lineup, Nole walk/jab/slam frames, Mas desk drawings, master palette |
| extra-switch.png | `pixeladv-extra-switch` | the same frame as BASE / 1-BIT / LEDGER / TERMINAL: a style switch is a palette swap |

Render: `npx remotion still src/dev/pixeladv/entry.tsx pixeladv-key ../out/structures/pixeladv/key.png --bundle-cache=false --log=error`

## Files (all mine)
- `src/styleframes/pixeladv.frame.tsx`: frame defs. `src/dev/pixeladv/entry.tsx`: dev entry.
- `src/dev/pixeladv/PixelCanvas.tsx`: Remotion host (native buffer to 1920x1080 canvas, smoothing off).
- `src/dev/pixeladv/scene.ts`: the beat as a pure function `frame -> 480x270 buffer`, plus the sheets.
- `core/px.ts`: integer primitives (Bresenham line, scanline poly, ellipse), string-map sprites, Bayer.
- `core/palette.ts`: the curated master palette (~85 colours in hand-ordered families).
- `core/light.ts`: palette-shaded light zones. The room is painted as (material, level), and a light pass walks each
  material's hand-ordered ramp for whichever light dominates (night / monitor cyan / hallway tungsten), with
  a narrow ordered-dither seam at band edges.
- `core/figure.ts`: the pixel rig. Parts are grouped by body part and shaded in bands from each group's own
  silhouette (key band, shadow band, 1px rim, warm back-rim, shadow-side outline), with light falloff masks.
  Faces are painted planes (explicit ramp indexes) and hand-pixelled stamps.
- `core/font.ts`: hand-pixelled 7px font. `art/*`: room, Mas, Nole, portraits, UI (verbs, inventory icons as
  string maps), foreground plant, timing.
- `tools/preview.ts` + `tools/png.ts`: Node-only preview (bundled with esbuild, `@ts-nocheck`). It renders frames,
  sheets, `grid:` contact sheets and `crop:` zooms in seconds, without Remotion.

## The beat as staged
- 0-23: night. Mas is seen from behind, silhouetted against his monitor, typing (2 arm drawings, irregular
  keystroke pattern, code appears on screen pixel by pixel). The player's crosshair drifts to the glass:
  sentence line "Look at glass of water" plants the payoff. Verb list gag: **Open** is struck out, and **Pivot** and
  **Raise** replace Push/Pull. Clock reads 1:36.
- 14-23: feet break the light under the closed door (foreshadowing that costs nothing).
- 24-31: door kicked open, the slab rebounds (4 drawings), hallway flash, 2px integer screen shake, the poster
  knocked crooked, Mas's cowlick springs. Nole is a pure backlit silhouette in the doorway, and his shadow runs
  down the light wedge toward Mas. The interface dims into cutscene mode.
- 32-47: 4-drawing walk on 2s; palette steps silhouette -> fade1 -> fade2 -> lit as he leaves the backlight.
- 48-83: lean (integer row-shear), phone jabs on "came" and "name". Portrait window opens in 3 stepped frames. The
  text types on, and mouths are chosen from the letter under the typewriter head.
- 84-107: Mas stops typing. The head turns in 3 drawings (back / lost profile / profile) held 4, 8, 8+ frames. His
  portrait opens, one blink (half-closed-half, then a slightly heavier "content" lid), and the smile is **one pixel**. "super."
- 108-119: Nole slams his phone on the desk. The room shakes 3px and every object hops on its own curve (mug
  slops coffee, monitor tears, book topples, pencil cup tips, bin jumps, plant quivers). The glass is composited
  after the shake: it doesn't move a pixel and the water line stays dead flat. An adventure-game item glint
  follows, then the interface returns with the cursor back on "Look at glass of water".

## Rig limits in this style (read before scripting)
- **Moves well:** anything that is a swap. Mouths, lids, brows, head angles, arm poses, palette/lighting states,
  screen content, door states, object hops, integer shakes, text/typewriter timing, cursor moves, walk cycles.
- **Would look cheap:** rotating or scaling sprites (rotsprite mush, depth scaling), sub-pixel drift, smooth
  tweens between poses, soft blurs/glows, continuous 3D turns, crowds of unique walkers, cloth.
  The conventions hide all of that. Characters are small in wide shots (so acting lives in the portraits). Camera
  moves are cuts or whole-pixel scroll. Held drawings are the idiom, and light does the emotional work.
- Portrait scale (~136px) is the acting limit: 4 mouths, 3-4 lids, brow swap, integer nudges. That covers the whole
  show, whose comedy is deadpan.
- The room is dark on purpose. Only light zones get detail, so new sets are cheap, but the mix must be checked
  on a real screen (the style is intentionally low-key).

## Cost / reuse
- New room: 1-2 days (materials + lights). New character: sprite rig ~1 day, portrait ~1-2 days, then reusable
  across every scene. Per minute of show it is **low-medium**: dialogue scenes are nearly free (portraits + text);
  walk-ins and slapstick beats need extra drawings.
- **Style switches are nearly free.** Every pixel is an indexed palette colour, so a flashback can be a palette
  remap (see extra-switch: 1-bit Mac, ledger line-screen, CGA-teal terminal). No redraw, and it can cut in on any frame.

## Known issues / next
- Room sprites are rim-lit silhouettes. That is intentional, but Nole's sprite torso is still a little boxy and the
  lineup's standing Mas is rough.
- Mas's portrait face planes are good but could take one more hand pass (cheek/terminator), done as string-map
  edits to the stamps.
- Door-burst flash halo is a dithered radial and could be hand-shaped.
