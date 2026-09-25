# Ep1 · Act 4 · Rooms A: boardroom, lobby, Vegas suite, TPOOL door

Owner: background artist, rooms A. This covers four reusable room modules plus their inserts. They follow the shotlist contract (`shotlist.md` / `shots.json`):
- Every plate is a 480×203 room area, drawn at 4× to 1920×1080. Inserts are room-area plates too, because the rail persists across cuts.
- Rows 203–269 belong to the rail builder. The preview stills fill them with a dark placeholder (`railPlaceholder`).
- Everything uses master-palette colours. `strayColors` is empty on every BASE still; the two `*-ew16` previews use the era set on purpose.
- Nothing scales or rotates. All motion happens in held, whole-pixel steps.
- The Node preview and Remotion are pixel-identical (checked by diff on four plates).

## Files

| What | Path |
|---|---|
| Boardroom (NIGHT), with 5 inserts | `studio/src/shared/pixel/rooms/boardroom.ts` |
| Lobby (DAY / NIGHT), security-cam plates, floor insert | `studio/src/shared/pixel/rooms/lobby.ts` |
| Vegas suite (DAY), laptop / desk inserts, tile and portrait backgrounds | `studio/src/shared/pixel/rooms/vegas-suite.ts` |
| TPOOL corridor (F1.2), wide and close | `studio/src/shared/pixel/rooms/tpool-door.ts` |
| Shared kit: the 480×203 contract (`RH`, `RAIL_Y`), layer overlay, cartoon fire and smoke, shiver | `studio/src/shared/pixel/rooms/setkit.ts` |
| Plates, motion test, Remotion frames, dev entry | `studio/src/episodes/ep01/act4/rooms-a/{plates.ts,motion.ts,RoomsA.tsx,frames.tsx,entry.tsx}` |
| Node preview | `studio/src/episodes/ep01/act4/rooms-a/tools/preview.ts` |
| Stills (35) and the motion test (`rooms-a-motion.mp4`, 180 f) | `out/ep01/act4/assets/rooms-a/` |

Render commands, run from `studio/`. Every composition id is `ep01a4-rooms-<plate>`.
- Still: `npx remotion still src/episodes/ep01/act4/rooms-a/entry.tsx ep01a4-rooms-<plate> ../out/ep01/act4/assets/rooms-a/<plate>.png --bundle-cache=false --log=error`
- Motion test: `npx remotion render … ep01a4-rooms-motion … --scale=0.5 --concurrency=2`
- Fast preview:
  1. `npx esbuild src/episodes/ep01/act4/rooms-a/tools/preview.ts --bundle --platform=node --outfile=<scratch>/ra.js`
  2. `node <scratch>/ra.js <outDir> 4 <plate>[@frame] | all`

**How to use a room.** Each room ships as depth layers so figures can be sandwiched:
- `drawX(b, state, castCallbacks)` composites the whole room.
- `xLayers(state)` returns the raw layers if you need them.
- Anchors are exported constants (`BR`, `LOBBY`, `CAM`, `SUITE`, `TPOOL`, `*_INSERT`).
- Shake the room layers, never the UI: the last argument of `drawX` is an integer offset `[dx, dy]` (use `shakeAt`).

## 1. NOPEAI BOARDROOM — NIGHT (`drawBoardroom(b, state, {wall, seated, hands, near}, shake)`)

The camera is frontal and slightly elevated, looking at the long table (the Woodrose staging, one floor up).

**Left to right:**
- **The dark window.** The Valley at night: a city grid, a freeway river and blinking towers. The speed-dial wheel egg stands in the Valley. The glass reflects the pendant, and ALYI lives in it.
- **The pendant.** A linear LED over the table. It is the key light, in the cyan family.
- **The framed `CHARTER`.** An egg, with one highlighted clause.
- **TASYA's door slot.** It sits between seats D and E.
- **The frosted-glass entry door.** Warm hallway behind it. It rhymes with the TPOOL door.
- **The wordmark.** Raised metal `NOPE AI` above the entry door. It stays when the wall goes slate.
- **A plant** in the far right corner.

**Seats:**
- **L:** the left end, turned in. THE QUIET VOTE's laptop goes here, and later Mas.
- **A–E:** far side, facing camera. **C** is the CEO chair.
- **R:** the right end, MADA's. It is bolted to a floor plate with four bolts and has no casters. There is **no fire slot for R**: it never burns.
- **The ends:** each sits under its own downlight, so MADA is lit like an exhibit. In 30.10 the door wedge stops short of him.

**Draw order:**
1. `far`
2. `wall`: TASYA in his door, TERB entering
3. `mid`: the chairs and the pendant
4. `seated`: the cast `*Back` table sprites. Their `TABLE_EDGE` row goes on `BR.SEATS[id].tableEdgeY`.
5. `front`: the table and everything on it
6. `hands`: the cast `*Front` sprites
7. `near`: anyone on the near side
8. `fore`: the near chair backs, cropped by the frame

| Option | Values / use |
|---|---|
| `slate` | Boolean. The back wall steps to MACROSOFT slate (27.32). It is a material swap on the wall only. Doors, window, table and wordmark keep their colours. |
| `tasyaDoor` | `0` none · `1` the outline steps out of the shadow · `2` closed, slate with panes and the key in the lock · `3` ajar (a bright crack) · `4` open, showing the labelled desks and throwing slate light onto the wall and the floor right of the table |
| `door`, `doorFlash` | `'closed'` (frosted, warm) · `'open'` (the hallway, a warm wedge across the floor; the table casts its shadow). Keep `doorFlash: 1` to ≤ 1 frame. |
| `doorShadows` | Two shadows on the frosted door (the TPOOL rhyme, for later episodes) |
| `rolodex` | `true` spinning (27, the phone frenzy) · `'still'` parked (sc 30, the calls have stopped) · `false` |
| `blueprint` | `{word}`: the PLAN sheet on the table, step 4 a blank line. `word: true` adds NELEH's scribble and `?` (illegible). |
| `plates` | Tent cards on A–E. The default is A `GERG`, B `ALYI`, D `NELEH`. Long names split onto two lines (`THE QUIET VOTE`, `THE OTHER YRRAL`). `null` removes a card. |
| `sticky` | `{seat, text}` replaces a seat's card with a yellow sticky note (27.27: `{seat: 'C', text: 'CEO (TEMP)'}`) |
| `phones`, `phoneSeats` | `{lit, buzz, step}`. `buzz` jitters 1 px on alternate frames. `step` 0–6 walks each phone 3 px per held step toward the near edge (27.13: 4 steps). |
| `speaker` | 0–4 dial LEDs lit, one per tone (27.17) |
| `laptop` | THE QUIET VOTE: a laptop on seat L showing the black camera-off screen |
| `fires` | `FireSpot[]`: `{at: 'table', x, y}` · `{at: 'chair', seat}` (L, A–E) · `{at: 'plate', seat}` (A–E). Each has `state: 'burn' \| 'out'` and `outAt`, which gives 24 frames of smoke in held steps plus a scorch. Fires are 3 drawings on 2s, phase-staggered, with a flickering warm light pool. `FIRES_SC30` is the table, chair B and plate D. `FIRES_ALL_CHAIRS` is the "every chair but his" reading. |
| `spot` | `{x, y, r}`: a hard theatre spot, warm tungsten, with one dithered rim pixel. 27.27 swings it in 3 held positions from seat C to TTEMME. |
| `reflection` | `{img, x, y, k}`: an image painted into the glass. Each pixel steps down k rungs; city lights brighter than the reflection shine through; mullions cut it. Put ALYI here. His two-frame flicker is simply `reflection: null` for 2 frames. |
| `gergLaptop` | `'off' \| 'green'` on the table at seat A (`BR.GERG_LAPTOP`): the lid back with a green spill (30.14) |
| `termSheet` | `'blank' \| 'stamped'` at `BR.TERM_SHEET` (30.18) |
| `pendant`, `noNear` | Key light multiplier; hides the foreground chairs |

**Anchors:**
- `BR.SEATS[id]`: `{x, tableEdgeY, facing, plate, phone}`
- `BR.NELEH_AT` (159, 162): she stands behind the table between A and B, over the blueprint. Her legs are hidden by `front`.
- `BR.PROP_SPOT`: where the hourglass stands in the wide
- `BR.WINDOW` / `BR.REFLECT`: the glass and the zone where a reflection reads above the chairs
- `BR.DOOR`, `BR.TASYA_DOOR`: TERB's and TASYA's feet on `BR.WALL_FLOOR_Y` (150)
- `BR.TABLE`, `BR.SPEAKER`, `BR.BLUEPRINT`, `ROLODEX`, `END_SEAT_Y`

**Inserts** (room-area, 480×203):
- **`drawTableInsert(b, {focus, word, laptop})`**, framed on the walnut with the pendant's reflection band:
  - `'blueprint'` (27.16, 27.35): the PLAN sheet at insert scale. `1. NOON · VIDEO CALL ✓`, `2. BLOG POST ✓` and `3. INTERIM CEO ✓` are readable; `4.` is a blank line. `word` 0–3 adds NELEH's scribble: stroke, then loop, then `?`. It is illegible at 4×. `TABLE_INSERT.wordAt` is where her marker hand goes.
  - `'prop'` (27.30, 30.21): a clear spot for the hourglass (`TABLE_INSERT.prop`), with the blueprint's corner at the edge
  - `'laptop'` (30.20): GERG's laptop turned toward us, a green terminal and a keyboard for the cast's keycaps (`TABLE_INSERT.keys`)
- **`drawLaptopChairInsert(b, {screen})`** (27.15): the laptop on the chair. The default screen is the black tile, a grey avatar and `THE QUIET VOTE · camera off`. Pass the cast's tile painter for `LAPTOP_CHAIR.screen`.
- **`drawTasyaDoorInsert(b)`** (27.34): through the open door, rows of slate desks recede, each with a tiny illegible label. Slate jambs frame the view, and the key glints.
- **`drawChairBackInsert(b, {name, screws, plateOff})`** (31.07): the back of ALYI's board chair. A brass plate is engraved `ALYI`. `screws` 0–4 go out one per beat, in the order of `PLATE_INSERT.screws`; `plateOff` leaves four holes and less-faded leather. The hand and screwdriver are the cast's.

## 2. NOPEAI LOBBY — DAY / NIGHT (`drawLobby(b, {time, …}, {back, lobby}, shake)`)

The lobby is the narthex of THE CATHEDRAL (the intro skyline's HQ).

**Left to right:**
- **The entrance.** A glass wall onto a generic city street with a revolving door in it.
- **Rack pillar A.**
- **The chancel.**
  - The GPU-die rose window.
  - The twin steel elevators under a pointed arch.
  - Blind-arcade niches with tiered LED votive stands.
  - The reception desk: a stone top with a row of LED tea-lights, a bell and a guest book. The black-glass front carries the cyan neon `NOPE AI`.
- **Rack pillar B.**
- **The right bay.** The TV high up, THE SIGN below it, and the floor under the sign.
- **The floor.** Polished checker stone with reflections, and a wine aisle runner.

**Light by time of day:**
- **DAY:** sun through the entrance lays a slab with mullion shadows on the floor, and the rose window's jewel pools fall in front of the desk.
- **NIGHT:** neon, votives, the sign's lightbox and a street lamp. The rose window glows server-cyan.

**Draw order:**
1. `far`
2. `back`: anyone inside the drum, or behind the desk stepping out of the elevator, feet on `LOBBY.WALL_FLOOR_Y` (158)
3. `door`: the drum's front glass and wings
4. `front`: the desk
5. `lobby`: anyone in the lobby, feet on `LOBBY.FEET.desk` (178), `.mid` (188) or `.near` (200)
6. `fore`: optional rope stanchions

| Option | Values / use |
|---|---|
| `sign` | `0` blank board, no letters (the check scene, sc 9) · `1` letters, unlit · `2` half-lit · `3` lit. It reads `DAYS SINCE / SOMEONE / TRIED TO / FIRE MAS:` with a hanging number plate. The ignite for 30.22 is `1,2,1,2,3` on 3-frame holds: two catches in 12 f, inside the flash rule. |
| `days` | The number plate. Default `'0'`. |
| `zeroBox` | The box of spare `0` plates on the floor under the sign (`LOBBY.BOX`) |
| `revolve` | 0–3: four held wing drawings, 22.5° apart. The pattern repeats every quarter turn, so cycle 0→3 on 2s to turn. |
| `elevator` | `[a, b]`, each 0–3 held steps from shut to open. The car interior is warm. |
| `tv` | `'off'` · `'on'` (a blank glow for the scene to paint into `LOBBY.TV`; sc 9 GNIB) |
| `ropes` | Velvet-rope stanchions at the frame edges |

**Security camera (27.26)**, two readings (pick one at layout):
- **`drawLobbyCam(b, {f, revolve}, cast)`:** a high reverse angle from over the reception desk, looking back at the entrance.
  - The glass wall runs across the top, with the street outside and a passing car.
  - The revolving drum is seen from above; the sun slab has leaning mullion shadows; the aisle runs to the drum.
  - At the bottom is the desk's top, seen from the guard's side. The guard's monitor shows the camera grid (an egg).
  - A walk-in crosses **at one depth**, feet on `CAM.PATH.feetY` (140) from x 92 to 470, so a room sprite needs no scaling.
- **`drawLobbyCamWide(b, {f}, cast)`:** the DAY wide itself inside the same chrome. This is the shotlist's literal reading.

Both plates share the rest:
- Both are graded to CCTV grey-blue inside the master palette: a lightness ramp, a scan texture on every third row, and neon that keeps a cyan tint.
- `camChrome` draws corner brackets, `CAM 02 · LOBBY` and a REC dot blinking on 12s. **There is no clock or timestamp** (guardrails: an invented log never sits next to the rail's real date).
- The upside-down post goes in `CAM.POST_CORNER`.

**Floor insert (30.23):** `drawSignFloorInsert(b, {box, days})`.
- Close on the wall's foot under the lit sign: cream light down the stone, big polished tiles.
- The box of spare `0` plates is shown at insert scale. `box` 0 = none · 1 = being set down (2 px up, a small shadow: the hand's drawing 1) · 2 = set.
- `SIGN_FLOOR.hand` is where the maintenance hand holds the flap.

## 3. LAS VEGAS HOTEL SUITE — DAY (`drawSuite(b, state, {mas, room}, shake)`)

A high suite over the Strip on the race weekend. It is contre-jour: the window is the brightest thing.

**The window view:**
- A desert range in the haze, over generic towers: slabs, stepped, cylinder, twin, and one blue glass tower.
- Daytime neon: a red marquee pylon with chasing bulbs and a neon star, and a red blade sign.
- The closed street circuit: grandstand, catch fence, concrete barriers, red/white kerbs, the road and the verge.
- **No F1 or race marks and no race cars**, per the shotlist and guardrails. The crane truck (`truckX`) grinds along it.

**The room:**
- **MAS's desk in the left third.** His laptop is at his left, lid toward him, so we see its back and the cyan glow that is his key light. His glass (the cast's `drawGlass` at `SUITE.GLASS_AT`) sits at his right, and the phone at `SUITE.PHONE`.
- **Right side:** gathered wine drapes, then a quilted leather wall with a small neon star in a ring, a floor lamp, and the minibar with the four glasses.

**Draw order:**
1. `back`
2. `mas(b, front)`:
   1. `blitTo(masDeskBack)` at `SUITE.MAS_AT` (106, 101): its desk edge lands on `SUITE.DESK.top` (138).
   2. `front(b)`.
   3. `masDeskFront`, then his glass.
3. `room`: anyone standing, feet on `SUITE.FEET` (196)

`front` also works as `drawMasDesk`'s `deskTop` callback.

| Option | Values / use |
|---|---|
| `truckX` | The truck's front bumper x on the circuit, clipped to the glass. Move it in whole pixels on 2s (24.01: 1 px / 2 f). Its amber beacon is lit 4 f of every 12. |
| `shiverT0`, `shiverDur` | The frame the rattle reaches the flute. Each glass (flute → tumbler → ice bucket → vase) alternates 2 held drawings, rest and 1 px over, on 2s for `shiverDur` (24) frames, **3 f apart**. `glassShiver()` exposes the same offsets for inserts. His glass is not part of this. |
| `phoneLit` | The phone on the desk lights up (26.06) |
| `laptop` | Laptop glow, 0–1 |
| `emptyChair` | Draws the desk chair when he isn't there. The desk sprite brings its own chair. |

**Tile, portrait and inserts:**
- **`suiteTileBg(b, x, y, w, h, f)`:** MAS's call-tile background by DAY, cropped from this window and centred on the pylon. It replaces the salvaged night `vegasBg` and its race car (26.01, 26.05).
- **`suitePortraitBg(b, x, y, f)`:** the inside of his 112×136 window at portrait scale (26.07), authored rather than enlarged. It shows the marquee with its bulbs, a sunlit tower, the grandstand band, a mullion and the drape's edge. Paint it before the portrait figure.
- **`drawLaptopInsert(b, {cursor, pressed, screen, mic})`:**
  - `screen: 'join'` (24.02 / 25.08): the call app `BOARD · VIDEO CALL`, a five-tile preview whose last tile is black, and `JOIN`. The cursor is an arrow at `cursor`; `pressed` is JOIN's 1-frame, 1-px pressed drawing.
  - `screen: 'gone'`: the call has ended.
  - `mic: true`: the live-mic icon is still lit red in the title bar.
  - `screen` may also be a painter function.
  - 24.02's flash-print to blueprint is a palette remap of this frame, done by the kits builder.
- **`drawDeskInsert(b, {phoneLit, mic})`** (26.06): the phone face-up, big. Its screen rect is `DESK_INSERT.phoneScreen`, where the post-ui kit paints `[super] [super] [super]`. The laptop's corner shows the lit mic icon, and the edge of his tumbler shows one flat water row. It doesn't move.

## 4. TPOOL CORRIDOR (`drawTpoolDoor(b, {lean})`, `drawTpoolClose(b, {lean})`)

F1.2 (26.12–26.13).
- **Authored in BASE; show it only through EARLYWEB16.** Apply the palette to the whole shot; `tpool-door-ew16.png` previews the result. Never redraw it.
- **The corridor:** a mid-2000s office. Beige walls, a fluorescent ceiling panel, grey carpet tiles, a water cooler, a ficus, an abstract print and a `BOARDROOM` plate.
- **The door:** an aluminium-framed glass door with frosted sidelights, lit warm from the room behind.
- **The two shadows:** unidentifiable silhouettes with no faces. `lean: 0` stands them apart; `lean: 1` leans them together as an integer row-shear of the rows above the shoulders. Their edge is a 1-px dithered blur, because they are behind frosted film.
- **The frosted film:** horizontal bands on a **5-row period, with the dark film edge on rows ≡ 0 (mod 5)** (`TPOOL_BAND`). Rooms B's dark-room desk (`drawDarkDesk`) puts its late-wood lines on those same rows, so the 26.13 render front back to BASE lands the bands on the grain.
- **The close (`drawTpoolClose`):** the bands fill the room area, with the shadows' edge drifting through and the door's stile at the left edge.

## Which call each shot uses

| Shot | Call |
|---|---|
| 24.01 / 26.09 | `drawSuite({f, truckX: x0 + ⌊f/2⌋, shiverT0})`: Mas at `SUITE.MAS_AT`, his glass at `SUITE.GLASS_AT` |
| 24.02 → 25.08 | `drawLaptopInsert({cursor: [JOIN.x+50, JOIN.y+12]})` → `pressed: true` on the click frame |
| 26.01 / 26.05 | Mas's tile: `suiteTileBg(...)` (cast: `cast.mas.tile`) |
| 26.06 | `drawDeskInsert({phoneLit: true, mic: true})` (or `drawLaptopInsert({screen: 'gone', mic: true})`) |
| 26.07 | `suitePortraitBg` inside Mas's left window over the held `drawSuite` |
| 26.12 / 26.13 | `drawTpoolDoor({lean: 0 → 1})` / `drawTpoolClose({lean: 1})`, all under EARLYWEB16 |
| 27.11 / 27.13 | `drawBoardroom({blueprint: {}, laptop: true, phones: {lit, buzz, step: 0 → 4}, reflection: ALYI})`: MADA seat R, NELEH at `NELEH_AT` |
| 27.14 | same, `reflection: null` for 2 frames (the flicker) |
| 27.15 | `drawLaptopChairInsert()` |
| 27.16 / 27.35 | `drawTableInsert({focus: 'blueprint', word: 0 → 3})` / `word: 3` |
| 27.17 | `drawBoardroom({…, speaker: 1 → 4})` on the beats |
| 27.26 | `drawLobbyCam({f, revolve})` (or `drawLobbyCamWide`) with the GUEST walk on `CAM.PATH` |
| 27.27 | `drawBoardroom({sticky: {seat: 'C', text: 'CEO (TEMP)'}, spot: 3 held positions})` |
| 27.30 / 30.21 | `drawTableInsert({focus: 'prop'})` with the hourglass at `TABLE_INSERT.prop` |
| 27.32 | `slate: true`, then `tasyaDoor` 1 → 2 → 3 → 4 on beats; TASYA in `BR.TASYA_DOOR` via the `wall` slot |
| 27.34 | `drawTasyaDoorInsert()` |
| 30.09 – 30.19 | `drawBoardroom({fires: FIRES_SC30, rolodex: 'still', gergLaptop: 'green', termSheet})`: Mas seat L, MADA seat R, `door: 'open'` + `shakeAt(f, t0, SHAKE_DOOR)` on the bang, the chair fire → `'out'` on the spray |
| 30.20 | `drawTableInsert({focus: 'laptop', laptop: 'green'})` |
| 30.22 – 30.25 | `drawLobby({time: 'night', sign: 1,2,1,2,3})`; the dialog is the kits' |
| 30.23 | `drawSignFloorInsert({box: 1 → 2})` |
| 31.07 | `drawChairBackInsert({screws: 0 → 4, plateOff})` |

## Strengths
- All four rooms read at a glance, in the approved pixeladv language: cyan key, tungsten rim, night ambient, hand-ordered ramps, and dither only at light seams.
  - **The boardroom** has the most range: four scripted states from one module (Nov 17 plan, Nov 19 spot, 11:53 slate plus the door, Nov 21 fires). The downlit ends give the calm-off a staged look: MADA stays cool and still while the fires and the door wedge are warm.
  - **The suite** is strongly Vegas without any real mark.
  - **The lobby** carries the cathedral HQ from the intro into an interior.
  - **The TPOOL door** survives the EARLYWEB16 switch and looks GIF-era.
- The gags are built in and state-driven: the glasses' shiver, the walking phones, the speaker tones, the slate step, the door that appears, fires on 2s, the parked speed-dial wheel, the sign's ignite, the box of zeros, the four screws.
- Anchors match the cast sprites. The staged plates put GERG and MAS table sprites on the seat anchors, and MAS's desk sprite and glass on the suite desk.

## Weaknesses and known limits
- **General:**
  - The rooms are dark, as the approved key is. Check them on a real screen and run the luminance audit.
  - Some 1-px details read only at 4×: the tent-card micro text, the charter, the guard's monitor egg.
- **Boardroom:**
  - The end seats are 3/4 chairs, but the cast only has far-side table sprites. The asset list already asks the cast for a seated-at-table pose facing screen-right for seat L.
  - Seat R's sitter (MADA) needs the mirrored pose.
  - GERG's current table sprite carries its Woodrose warm light. It needs a boardroom (cyan key) light state from the cast.
  - The spotlight is warm tungsten, so on dark leather it reads orange rather than white.
  - The speed-dial wheel is a subtle egg: it reads as a Ferris wheel of cards, not literally a desk Rolodex.
- **Lobby:**
  - The revolving door is a front view, so it reads as a glass booth with a canopy and wings. It reads better when a figure turns it (`revolve` on 2s).
  - The sign's `0` is the show font's slashed zero.
  - The DAY lobby is a cool, grey stone by design. It has less colour than the suite.
- **Suite:** the four glasses are small (5–11 px), as a room wide demands. If the gag needs more read, cut to a minibar close (not built yet).
- **Security cam:**
  - I built both readings, the high angle and the graded wide. The high angle is my recommendation.
  - Walking toward the camera would need scaling, so the walk-in is lateral by design.
- **Inserts:**
  - The table's `'prop'` framing is sparse on purpose: the hourglass is the subject.
  - The through-the-door insert is flat and bright, in contrast with the room.
- **Scope:**
  - The shotlist's "hourglass" and "keycaps" are cast/kits props. Here there is a spot and an anchor for each.
  - There is no NIGHT suite. The Ep10 PACE table can reuse the view with a night light rig.

## For the next stage
- **Interpretations to confirm:**
  - The CEO chair is seat C. RIMA's empty chair (27.27) is C, and so is TTEMME's sticky note.
  - THE QUIET VOTE's laptop sits on seat L. In sc 30 Mas takes L, opposite MADA at R.
  - The table fire, chair B and plate D are sc 30's three fires.
- **Continuity:** the script's Ep1 lobby has a revolving door, but `world/locations.md` says one is "installed" in Ep3. The script wins for Ep1. Flag it to the bible owner.
- **TASYA's slate door:** the boardroom door (panes, key in the lock) and rooms B's dark-room `blueDoor` are separate drawings. Keep their key and slate the same if they cut together.
- **Timing hooks for SFX:**
  - Door bang: `door: 'open'` frame
  - Speaker tones: `speaker` increments
  - Phone buzz: `buzz` frames
  - Glass clinks: `shiverT0 + 3i`
  - Truck: `truckX` crossing the glass
  - Sign ignite: the steps
  - Screws: `screws` increments
  - Fire out: `outAt`
- **Photosensitivity:** these stay small and below 3 flashes per 24 f:
  - the marquee bulbs, which chase on 3s
  - the truck beacon, 4 of 12
  - the tower beacons, 18 f
  - the sign ignite, two catches in 12 f
  - `doorFlash`, which should stay ≤ 1 frame
