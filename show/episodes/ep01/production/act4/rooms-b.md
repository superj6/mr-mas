# Ep1 · Act 4 · Rooms B: bullpen, lighthouse, dark room

Owner: background artist, rooms B. There are three reusable room modules plus previews. Every plate is a 480×203 room, drawn at 4× to 1920×1080. The rail band at y 203–269 belongs to the rail builder. The previews fill it with a dark placeholder.

## Files

| What | Path |
|---|---|
| Bullpen (DAY) | `studio/src/shared/pixel/rooms/bullpen.ts` |
| Lighthouse (NIGHT) | `studio/src/shared/pixel/rooms/lighthouse.ts` |
| Dark room (NIGHT) and the desk close-up | `studio/src/shared/pixel/rooms/darkroom.ts` |
| Shared helpers: 3×5 text with `%`, `RoomOut`, pools, vignette | `studio/src/shared/pixel/rooms/kit-b.ts` |
| Previews (pure scene defs), Remotion frames, dev entry | `studio/src/episodes/ep01/act4/rooms-b/{scenes.ts,frames.tsx,entry.tsx}` |
| Node preview (pixel-identical to Remotion, which was checked by diff) | `studio/src/episodes/ep01/act4/rooms-b/tools/preview.ts` |
| Stills (23), contact sheet, 3 motion tests | `out/ep01/act4/assets/rooms-b/` |

Render commands, from `studio/`:
- Still: `npx remotion still src/episodes/ep01/act4/rooms-b/entry.tsx <id> ../out/ep01/act4/assets/rooms-b/<id>.png --bundle-cache=false --log=error`
- Motion test: the same entry with `render`, plus `--scale=0.5 --concurrency=2`. A test takes about 20 s.
- Fast preview: `npx esbuild src/episodes/ep01/act4/rooms-b/tools/preview.ts --bundle --platform=node --outfile=<scratch>/rb.js`, then `node <scratch>/rb.js <outDir> 4 <id|all>`.

Every draw returns a `RoomOut`:
- `masks`: one per surface.
- `anchors`: feet, seats and prop marks, as `[x, y]` in room pixels. For feet, `y` is the floor row under the feet.
- `front(b)` (optional): repaints the near furniture over anyone drawn behind it.

All colours are master palette; `strayColors` is empty on every still. Nothing scales or rotates, and all motion happens in held steps.

## 1. NOPEAI BULLPEN — DAY (`drawBullpen(b, f, opts)`)

The camera faces the back wall, and the stage is shallow because figures never scale. Left to right:
- **The hall mouth**, with its tungsten spill on the carpet. The Q\* vault goes here (`vaultQ`).
- **Rima's whiteboard** (`LOW-KEY`) under the neon `NOPE AI`.
- **The conference glass wall.** Alyi's reflection lives in pane 2, `GLASS_PANES[1]`.
- **The conference door.** Latch on the left, nameplate `ALYI`, and the yellowed `IOU: 20%` / `COMPUTE` note taped to the latch jamb at shoulder height.
- **The windows** in daylight, with the credenza under them. The folding chair's mark is `observerChair`.
- **One long bench of four stations.** Mas has the end desk, index 3, directly in front of the door.
- **The drop ceiling**, with one panel out (continuity with sc 5's "one ceiling lamp out"), and a foreground planter at the right edge.

| Option | Values |
|---|---|
| `variant` | `'day'` · `'allhands'` · `'walkout'` |
| `door` | `'shut'` · `'crack'` (sc 30) · `'open'` (the all-hands doorway) |
| `nameplate` | string, or `null` for no plate. Default `'ALYI'`. |
| `iou` | the note (default on; it flutters off in Ep2) |
| `chairs[4]` | Empty chair backs. Turn a station's chair off where a seated sprite brings its own. |
| `masDesk`, `masGlass` | His laptop and water glass. Set `masGlass: false` if the cast draws the glass. |
| `handsUp` | For the all-hands: indices into `ALLHANDS_TILES`. **22** makes a good first hand, **44** a second. |
| `crowd` | For the walkout: the crowd in coats (default on) |

**Anchors:**
- `masDesk`, `gergDesk`, `seat0`, `seat2`: sprite top-left for `drawMasDesk` / `drawGergTable`.
- `alyiCrack`: clip him to `DOOR_CRACK`.
- `alyiDoorway`: clip him to `DOOR_OPENING`.
- `rimaBoard`, `tasyaFloor` (236, 197), `vaultQ`, `observerChair`.
- `heartsDoor`: where sc 30's three hearts hang.
- `masWalkPath0/1`: the front lane for sc 31's walk-pasts.
- `masGlass`, `neon`.

**Draw order:**
1. `drawBullpen`
2. Optional: `bullpenLandlord`
3. Anyone standing behind the bench, or Alyi clipped to the door
4. `room.front(b)`: the bench, its dressing and the desk boxes
5. Seated cast (`drawMasDesk`), then everyone in front

`front` also works as `drawMasDesk`'s `deskTop` callback.

**Masks:** `ceiling, walls, floor, glass, door, window, furniture, hall, dressing, sign, bench`.

**Variants:**
- **All-hands (sc 27):** 70 employee tiles in four rows, facing the door, with an aisle kept clear to the door and the IOU note. `employeeTile(seed, {hand, look})` returns a 22×28 image: the tile is rows 6–27, and rows 0–5 are headroom for the raised hand. This is a face in a square. **The tile-avalanche and heart kit can reuse it** for sc 29's 745 falling faces.
- **Walkout (sc 30):**
  - A packed kraft box sits on every desk (`packedBox(kind)`, kind 0–4).
  - Ten extras in coats hold boxes (`walkoutExtra(seed, {coat})`, 30×78, foot at (15, 77), about 5.8 heads tall). They face Tasya's mark: `CROWD_LOOK_X`.
  - The four behind the bench are cut at the desk top.
- **THE LANDLORD (sc 30, S2):** `bullpenLandlord(b, room, {floor, ceiling, walls, origin?, sign?})`.
  - Each surface takes 0–3 held steps. Steps 1 and 2 are ellipses spreading from his feet; step 3 covers everything.
  - It is a lightness-matched remap to the slate ramp `SLATE_RAMP`, N2…N7, N8, G6 (MACROSOFT #5B6B8C sits between N7 and G4).
  - Doors, glass, windows, furniture and people keep their colours. The neon goes slate with the walls unless you pass `sign: false`.
  - The hall's tungsten spill is floor, so it goes slate too. The only warm thing left is the hall itself.
  - `rb-motion-landlord` shows the three words on the bar grid: steps at +0, +5 and +10 frames.
- **Reflections:** `drawGlassReflection(b, room, img, x, y, {flip, strength})`. The figure only modulates the glass (light pixels lift it one rung, dark ones sink it one), and it is clipped to the glass mask, with no dither. The preview uses a stand-in figure; the Alyi builder supplies the real drawing.

## 2. MISANTHROPIC LIGHTHOUSE — NIGHT (`drawLighthouse(b, f, opts)`)

**The room:**
- A round tower in Misanthropic brick (off-brand #B8573A, built from W and U). Each brick is flattened to one colour, so the light steps brick by brick.
- The courses bow with 1/cos, as seen from inside the drum.
- A spiral stair of **bound drafts** climbs from behind the desk to the lantern gallery. Each step is a page block between coloured boards, and there's a rope handrail.
- Paper stacks everywhere. `STACKS` includes a foreground tower on the left edge.
- Mario's partner desk sits under a brass lamp with a parchment shade: the warm key light.

**THE LAMP:**
- A beehive lens with `SAFETY` cast on its plinth, and four bullseye panels.
- It makes one revolution per 120 frames (2 bars), in 3-frame holds. A panel faces the camera every 30 frames and gives a small flare cross.
- The panel facing away throws a lit band that walks across the upper wall (`lampSweepX`).
- `lampTurns: false` holds it still.

| Option | Values |
|---|---|
| `meters` | 0 · 1 (sc 19: NOZAMA) · 2 (sc 27: NOZAMA `UP TO $4B` + ELGOOG `UP TO $2B`). Taxi-style, with an amber RENT flag and spinning blurred digits. |
| `phone1`, `phone2` | `'cradle'` · `'off'`. Phone 1 is cream and is the throne line; phone 2 is black. |
| `throne` | `'on'` (glued to the handset) · `'fallen'` (tipped on the desk, a drawn angle) · `'none'` |
| `ring1`, `ring2` | Start frame of the ring. The handset hops 1 px on 3s, in bursts of 18 frames every 48 (`ringHop`). |

**Props for the cast:**
- `handsetImg('cream' | 'black', throne)` gives the handset for a hand once it's off the hook.
- `throneImg(tipped)`, `drawDeskPhone`, `drawRentMeter`.

**Anchors:**
- `marioDesk` (140, 194): the desk's left end, in front. The desk reads hip-high there.
- `adelinaDesk` (196, 199) and `adelinaIn` (372, 198).
- `marioBehind` (238, 170): only with `room.front(b)`. The no-scaling rule makes the desk read low for someone behind it.
- `phone1`, `phone2`, `handset1`, `handset2`, `lamp`, `meter1`, `meter2`, `deskLamp`.

`front(b)` repaints the desk and everything on it from the current frame. Draw figures in front of the desk after it.

**Masks:** `wall, floor, stair, gallery, lantern, furniture, paper, window, desk`.

## 3. MAS'S DARK ROOM — NIGHT

**The wide:** `drawDarkRoom(b, f, opts)`, then Mas and the Orb, then `drawDarkRoomFront(b, f, opts)`.

This is the intro's approved cold-open room, copied from `dev/mcoldopen/wide.ts` with identical geometry, materials and lights, and with no characters. Mas goes at `DARKROOM.mas` (`drawMasDesk`, as in the intro). The Orb goes at `DARKROOM.orb`, radius 6. The Orb drawing still lives in `dev/mcoldopen/orb.ts`; the previews import it from there.

| Option | Use |
|---|---|
| `tally` 2 / 3, `carve` 0–1 | The firing tally, right of his forearms at x 342–350. The two old marks are one rung down. The fresh mark is two rungs down with a lit edge, and it grows in quarters. |
| `lanyard` | The GUEST lanyard lying beside the glass: a plain grey-blue strap and a card with a red band, no brand. In the wide it reads as "a badge"; the word reads in the close-up. |
| `screen` | `'post'` (the intro composer and chart), `'feed'` (a column of posts with red hearts, one per beat), or a custom painter on the 51×29 virtual screen |
| `boardGrid` | The board's four-tile grid, small in the monitor's corner: ALYI · NELEH / MADA · the QUIET VOTE black tile. `drawBoardGridMini` gives the same art for other screens. |
| `clock` | `'1:36'` (the intro), `'9:32'` (sc 26A), `'2:06'` (sc 29) |
| `blueDoor` 1–4, `blueDoorAjar` | Tasya's slate door, far left in the back wall. It steps up out of the shadow as a palette step each beat: steps 1–3, then fully there at 4. The key is already in the lock and jiggles. From step 3 a line of slate light shows under it. Ajar spills his light onto the floor ("leave it open"). Anchor `blueDoorKey` is for the jangle SFX. |
| `fullFrame` | Draws and vignettes all 270 rows, as the intro did |

Other anchors: `rackSlot` (where the tray and the check come out), `monitor`, `glass`, `tally`, `lanyard`.

**The desk close-up (sc 26A):** `drawDarkDesk(b, f, {tally, carve, glass, phone, lanyard})`.
- Flat-sawn grain, long and horizontal, fills the frame, so the F1.2 EARLY-WEB16 dither can "settle into wood grain".
- The two old marks are worn and broken. The third, carved with the pen's clip, is clean, with wood crumbs.
- The tumbler has its one flat water row. The phone lies face-up, screen dark.
- The monitor's foot and its reflection in the varnish sit at top-left; the rack LEDs are far off.
- Anchors: `carveTip` (the pen's clip tip at the current quarter, for the hand), `mark1`, `mark2`, `mark3`, `glass`, `phone`, and `orb` (420, 16) for where the Orb watches.
- `lanyard: true` is only for after Nov 19. It isn't in sc 26A.

## Which state each scene uses

| Scene | Call |
|---|---|
| 26A | `drawDarkDesk({tally: 3, carve: 0 → 1})`, carving in quarters on the beat. Wide, if needed: `drawDarkRoom({clock: '9:32', tally: 3, screen: 'post'})` |
| 27 all-hands | `drawBullpen({variant: 'allhands', door: 'open', handsUp: [22]})`, then `[22, 44]`. Alyi is clipped to `DOOR_OPENING`; afterwards the doorway is empty. |
| 27 lighthouse | `drawLighthouse({meters: 0, ring1: t})`. Then `throne: 'fallen'` on the click, `ring2`, and `meters: 2` when the rent meters appear. |
| 29 | `drawDarkRoom({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true})`. Then `blueDoor` 1→4 on the beats and `blueDoorAjar` on "leave it open." |
| 30 back wall | `drawBullpen({door: 'crack'})`. Alyi is clipped to `DOOR_CRACK`; the hearts go at `heartsDoor`. |
| 30 walkout and landlord | `drawBullpen({variant: 'walkout'})` + `bullpenLandlord`. Tasya stands at `tasyaFloor`; Mas's desk is `masDesk`. |
| 31 | `drawBullpen({door: 'shut'})`. The vault goes at `vaultQ` in the spill; the lane is `masWalkPath0/1`; the chair is `observerChair`. |

## Strengths
- All three rooms read at a glance:
  - The bullpen is a daylit office with a warm hall, a readable door gag (`ALYI` / `IOU: 20% COMPUTE`) and a glass wall that reads as glass.
  - The lighthouse is brick-red and cozy, with a turning lamp, a paper stair and meters that read.
  - The dark room is the intro's room, pixel for pixel.
- The expensive S2 pieces are nearly free:
  - THE LANDLORD is one call per step.
  - The blue door is one option per beat.
  - The all-hands tiles double as the avalanche's faces.
- Every room returns masks, anchors and a front pass, so blocking, clipping and remaps don't require editing the room.

## Weaknesses and known limits
- **Bullpen:**
  - DAY only. Act 1's NIGHT bullpen (sc 5–7) needs a night light rig. The geometry is ready; the lights function is the only thing to swap.
  - The extras are simple held background figures, not cast-grade, and they don't animate.
  - The extras' daylight rim assumes the windows are on screen-right, so flip them only across `CROWD_LOOK_X`.
  - The all-hands fills the room's lower half. It is a crowd shot by design.
- **Lighthouse:**
  - The perspective is a stylised cheat: the courses bow, but the gallery is flat.
  - The stair is set dressing. Nobody can be staged on it without custom clipping.
  - The lamp's flare is one small cross every 30 frames, well under 3 flashes per 24 frames, but it still needs to go through the luminance audit.
- **Dark room:**
  - In the wide, the four-tile grid is about 6×5 px on the 3/4 monitor. Only an insert can read Alyi's tile; the sc 29 insert belongs to the monitor/insert builder.
  - The tally is about 3 px in the wide, and the GUEST text shows only in the close-up.
- **Interpretation to confirm:**
  - In sc 31, "the conference-room door … is shut, with its nameplate still on" is read as a door plate reading `ALYI`. `nameplate` can change it.
  - The whiteboard eggs (`LOW-KEY`, `1M`, `?`) are invented scribbles with no dates.

## For the next stage
- The sc 26A → F1.2 handoff: the grain rows run long and horizontal from y 34 down. Aim the EARLY-WEB16 dither's settle at those rows.
- `drawDarkRoomFront` applies the intro vignette to rows 0–202 only. With `fullFrame` it covers 270.
- Timing: the lamp's period is 120 frames. The flare is centred on each multiple of 30 and holds for 9 frames (27–35, 57–65, …). The ring bursts start on `ringN`, take 18 frames and repeat every 48. Cut the ring SFX on those frames.
- Nothing here plays a sound. SFX hooks: lamp flare, ring bursts, door steps, key jiggle on `blueDoorKey`, the carve strokes (quarters of `carve`).
