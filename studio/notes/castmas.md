# castmas: MAS across the eras, GERG, ALYI (approved pixel look)

The character art for the intro, in the pixeladv structure: native 480x270 grid, 4x nearest-neighbour, indexed
`PAL` colours only, light done by swapping hand-ordered ramps. Every sprite and portrait is a pure function that
returns an `Img` (Int32 colour map, -1 = transparent). Nothing is scaled, rotated or tweened.

## Deliverables (`out/pixel/cast/`)
| file | composition | what |
|---|---|---|
| `castmas-sheet.png` | `castmas-sheet` | lineup: 3 portraits, the Mas mouth/lid/eye-dart set, every room sprite, BASE palette |
| `castmas-extra.png` | `castmas-extra` | alternate lights (warm Mas for the dinner), 1993 in BASE vs native 1-bit, pose variants, Gerg/Alyi portrait states, a strobe of the keycap arcs |
| `castmas-motion.mp4` | `castmas-motion` (48f at 24fps) | Mas portrait dart, blink and A E O M rest smile; Mas at the desk types on 2s, turns to camera, blinks; Gerg types on 1s and keycaps pop; Gerg glances up once; Alyi's eyes become tokens on beat 2; Alyi levitates |

Render (from `studio/`):
```
npx remotion still  src/dev/castmas/entry.tsx castmas-sheet  ../out/pixel/cast/castmas-sheet.png --bundle-cache=false --log=error
npx remotion still  src/dev/castmas/entry.tsx castmas-extra  ../out/pixel/cast/castmas-extra.png --bundle-cache=false --log=error
npx remotion render src/dev/castmas/entry.tsx castmas-motion ../out/pixel/cast/castmas-motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
```
Fast preview without Remotion (seconds): bundle `src/dev/castmas/tools/preview.ts` with esbuild for node and run it
with `<outDir> <scale> sheet | extra | motion:<f> | wip:<desk|deskz|mport|kid|eras|gerg<f>|alyi>`.

## Polish pass (polish-a, 2026-09-25)
- **A second portrait head angle**: `masPortrait({..., head: 'front'})` / `drawMasPortrait` is the NEAR-FRONT head (the look to the lens; used by the cold open from f94). Same body, same key (the monitor, camera-left), same plane grammar: the far cheek turns off the light, the far ear shows, the forward cowlick springs off the hairline, calm level eyes with one catchlight each, the one-pixel smile. `head` is optional (default `'34'`), so every existing call is unchanged. The extras sheet shows it in the first window (`MAS  to lens`).
- **The locked lineup**: `masStage` (2008) now stands 78 px (was 82): the canvas and `MAS_STAGE_FOOT` are unchanged; everything above the hips sits `MAS_STAGE_DY` (4) px lower and the legs are shorter (`MAS_STAGE_HIP` = 50). meras' stride drawings follow.
- **One catchlight in every scale**: the room-scale heads (`screen`, `turn`, `camera`) carry a 1 px catchlight beside the pupil on the light side.
- **The era stamp** (`src/shared/pixel/cast/era.ts`, `eraStamp()`): one design for the 1993, 2014 and 2015 slates.
- The founders' freeze print and name card are the engine's (`src/shared/pixel/freeze.ts`); the cast has no second card system.

## Files (all mine)
- `src/shared/pixel/cast/kit.ts`: shared helpers for my three files. These are tone-map `paint` (char = [material, tone]), `over`, `blitTo`, `memo`,
  `seg`, `shiftPrim`, `edgeLight` (second-light rim from any direction, material-aware), `lightPool` (stepped
  dithered light for portrait backgrounds), `hash01`, `fringe`, and the **native 1-bit** renderer (`bitRamps` +
  `blit1bit` with per-material MacPaint pattern ladders and an early-Mac sprite `halo`).
  Note: `kit.ts` is a fourth file inside the cast folder I created, beyond the three named ones. Other builders' files in this folder (`bosses.ts`, `mario.ts`, `nole.ts`) do not import it.
- `src/shared/pixel/cast/mas.ts`, `gerg.ts`, `alyi.ts`: the art (API below).
- `src/styleframes/castmas.frame.tsx`, `src/dev/castmas/{entry.tsx, CastCanvas.tsx, sheet.ts, vignette.ts, tools/preview.ts}`.
  `vignette.ts` holds context props for the sheet only (desk top, dinner table, stage pool, a laptop-throne
  suggestion); they are NOT set art.

Engine: imports only `src/dev/pixeladv/core/{px,palette,figure,font}` (the shim paths) and, in dev only, the
adventure UI's `drawPortraitFrame`.

## API (all authored facing camera-left; blit with `flip` to face right)
**MAS present** (`mas.ts`)
- `drawMasDesk(b, x, y, pose, deskTop?, map?)`: 48x50 room sprite, 3/4 front at the desk. It draws in three layers: back
  (chair, body, head), then your desk top at `y + MAS_DESK_EDGE`, then forearms, hands and keyboard.
  `pose = {head: 'screen'|'turn'|'camera', type: 0..3, lid: 0..2, look: -1|0|1, mouth: 'rest'|'smile'|'open', breathe: 0|1, light: 'orb'|'monitor'}`.
  `light: 'orb'` (default) adds the Orb's cool rim down his back edge; `'monitor'` is key only.
  Layers are exposed separately as `masDeskBack` and `masDeskFront`.
- `drawMasPortrait(b, x, y, state, w?, h?, ox?)` / `masPortrait(state)`: 112x136, 3/4 front toward the monitor.
  `state = {mouth: 'rest'|'smile'|'A'|'E'|'O'|'M', lid: 0|1|2, look: -1|0|1, brow: 0|1, light: 'monitor'|'warm'}`.
  A and O drop the jaw 2 px and 1 px. `smile` is the one-pixel corner lift. `warm` is THE WOODROSE key.
- `drawMasKid(b, x, y, pose, 'base'|'1bit')`: 84x74, 1993. The kid is behind a beige compact computer (back view, no logo),
  the screen glow comes round its edge, and his hand is on a one-button mouse. `pose = {lid, look: 0|1 (up at camera), mouth: 'rest'|'o', click: 0|1}`.
  `'1bit'` is authored, not thresholded: every material has its own pattern ladder, with a 1 px paper halo on hair,
  skin and dark stripes so black hair reads on a black ground.
- `masStage(pose)`: 44x82, 2008. Standing on the stage in two stacked polos, green over coral, both collars popped;
  the coral hem and sleeve edge show under the green. `arm: 'present'|'down'|'point'`, lid, mouth, look.
  The feet are at `MAS_STAGE_FOOT`.
- `masThrone(pose)`: 46x66, 2014. Seated square to camera in the hoodie with a harness, a ripcord handle, and a tiny pack
  over his shoulder. `crown` is a three-point crown with the cowlick coming up through it. The seat line is at `MAS_THRONE_SEAT`,
  the armrests at `MAS_THRONE_ARM` (for the throne builder).

**GERG** (`gerg.ts`)
- `drawGergTable(b, x, y, pose, frame, {table?, flip?, capsFrom?, map?})`: 52x52, hunched over a laptop at the
  dinner table. `pose = {type: 0..2, lid, look: 0|1, mouth, flick: 0|1}`. Use `gergTypeAt(f)` for the typing
  drawing: he types on 1s in an irregular order, against Mas on 2s. `flick` steps the laptop light on his face.
- `gergKeycaps(f, {from, rate, max, floor})` / `drawKeycaps`: deterministic popcorn. Launches are hashed, arcs are on whole
  pixels, three tumble drawings, one bounce, then each cap stays on the table (they accumulate over a shot).
- `drawGergPortrait` / `gergPortrait({mouth: 'rest'|'open'|'smile', lid: 0..2, look})`: warm pendant key, the laptop's cool kiss only on the
  planes facing it (jaw underside, chin). His default is `lid: 1`, a working squint.

**ALYI** (`alyi.ts`)
- `drawAlyiTable(b, x, y, {lid, mouth, light: 'dinner'|'agi'}, {table?})`: 48x50, hands folded. Same 3-layer
  contract (`ALYI_TABLE_EDGE`).
- `drawAlyiLevitate(b, x, y, {lid, mouth, hands: 'knees'|'open'}, lift, {glow?, shadow?})`: cross-legged. The shadow
  stays on the seat (`ALYI_LEV_SEAT`) and shrinks as he rises. `alyiLift(f, period)` is the whole-pixel bob
  (slow rise, hold, settle). The uplight is only on the underside of the legs.
- `drawAlyiPortrait` / `alyiPortrait({eyes: 'open'|'closed'|'tokens', mouth, t})`: the dome carries the highlight, the eyes are
  deep-set, and the short dark hair wraps the ear. In `tokens` mode each eye becomes rows of token runs (1-3 px, 1 px gaps) streaming toward camera-left at
  1 px per frame (pass `t = frame`), and the room behind him cools. This is deliberately text-like, not "matrix rain".

## Design decisions
- **Signature per character, no body-shaming.** MAS has the forward cowlick at every age, calm level eyes, the tiny closed smile,
  and a slight frame. GERG has a close crop, a level low brow and the squint, plus the keyboard. ALYI's dome is lit as the most beautiful form in
  the frame; I added visible side hair and ears so the front view never reads as a "grey alien".
- **Light belongs to the story.** Mas's cold open is lit only by the monitor, with the Orb's rim. THE WOODROSE is warm pendant light,
  with screens adding cool accents. 2008 has a warm stage spot and a cool wash. 2014 has a gold key from above and the laptops' cyan from below.
- **Timing as characterisation.** Mas types on 2s, Gerg on 1s, and Alyi holds long.
- **Glyph foreshadowing is kept to one place.** Alyi's token eyes are the only glyph hook in the cast; everything else stays BASE so
  the style switches stay rare. Ideal placement is on a name-card hold, for 4-6 frames.

## Rig limits (read before scripting)
- **Swaps only.** Mouths, lids, the eye dart (±2 px iris in portraits, a pupil/white swap on sprites), the three desk-head
  drawings, typing drawings, arm poses, crown on/off, light states, lift offsets. There are no turns beyond the three
  drawn desk heads, no walk cycles for these characters yet (Mas 2008 stands, Mas 2014 sits), and no full-body acting.
- Room-sprite faces are about 14 px: acting there is eyes plus a one-pixel mouth; the real acting lives in the portraits.
- The kid's 1-bit patterns are screen-aligned (era-true). If the sprite moves, the patterns "shower-door", so keep
  the 1993 shot locked off or move him in whole 8 px steps.
- The portraits are 3/4 toward camera-left. `flip` works (the lighting flips too), but the hair part and the
  cowlick direction flip with it.

## Known issues / next
- The Mas desk `turn` head is the weakest drawing (it is a 2-frame in-between; fine at speed, odd if held).
- The 2014 throne body is still a little square. The throne itself is only suggested; the set builder owns it.
- Alyi's side hair reads a touch like a band in the 3/4 portrait, and his table-sprite torso is lumpy.
- Gerg's room-sprite face is very small behind the laptop lid. If his name-card freeze needs a closer sprite, a
  medium-scale drawing would help.
- There is no standing present-day Mas yet (for "slides the neon N: OPEN → NOPE" at the dinner). Next asks: a standing
  3/4 Mas with a reach pose, and warm-light variants of the desk sprite.
