All four rooms are built at 480x203 with their inserts: 35 stills, a 7.5-second motion test and a usage doc for the next stage. Midway through, the act's shotlist (`shotlist.md` / `shots.json`) showed my first pass was full-frame 480x270. It turned out to be the binding contract, so I reworked everything to 480x203 room plates, with the rail band (rows 203–269) left to the rail builder. The same shotlist gave rooms-a a fourth room, the TPOOL flashback door, plus 8 inserts, so I built those too.

My files typecheck clean. Node previews match the Remotion renders pixel for pixel on the 4 plates I diffed. Every standard-palette still uses only master-palette colours. I looked at every plate across 3–7 rounds of fixes.

## Files
Shared room modules (new files only; nothing else in the repo was edited). All are under `/home/jgon/project/art/mrmas/studio/src/shared/pixel/rooms/`:

| File | What it holds |
|---|---|
| `boardroom.ts` | The boardroom wide in 4 depth layers, plus 5 inserts |
| `lobby.ts` | Lobby day/night, the security-camera plates, the floor insert |
| `vegas-suite.ts` | The suite wide, laptop and desk inserts, Mas's call-tile and portrait backgrounds |
| `tpool-door.ts` | The TPOOL corridor wide and its close-up |
| `setkit.ts` | The 480x203 constants, layer compositing, cartoon fire and smoke, the glass shiver |

Previews and dev entry, under `/home/jgon/project/art/mrmas/studio/src/episodes/ep01/act4/rooms-a/`:
- `plates.ts` (every still), `motion.ts` (the motion test), `RoomsA.tsx`, `frames.tsx`, `entry.tsx`
- `tools/preview.ts`: a fast Node preview

Docs:
- `/home/jgon/project/art/mrmas/show/episodes/ep01/production/act4/rooms-a.md`: options, anchors, draw order and a table mapping each shot to its call.
- `/home/jgon/project/art/mrmas/studio/notes/ep01a4-rooms-a.md`: short builder notes.

Renders: `/home/jgon/project/art/mrmas/out/ep01/act4/assets/rooms-a/`, 35 PNGs at 1920x1080 plus `rooms-a-motion.mp4` (960x540, 24 fps, 180 frames), 3.5 MB total.

## Composition ids (`ep01a4-rooms-<plate>`)
- **Boardroom:**
  - Wides: `boardroom-night`, `-plan`, `-plan-late`, `-slate`, `-fires`, `-calmoff`, `-newboard`, `-staged`
  - Inserts: `-blueprint-insert`, `-blueprint-insert-word`, `-table-insert`, `-gerglaptop-insert`, `-laptopchair-insert`, `-door-insert`, `-plate-insert`, `-plate-insert-off`
- **Lobby:** `lobby-day`, `-night`, `-night-unlit`, `-cam`, `-cam-wide`, `-floor-insert`, `-floor-insert-set`
- **Suite:** `suite-day`, `-staged`, `-laptop-join`, `-laptop-gone`, `-desk-insert`, `-portrait-bg`, `-tile-bg`
- **TPOOL:** `tpool-door`, `-door-lean`, `-door-ew16`, `-close`, `-close-ew16`
- **Motion test:** `ep01a4-rooms-motion`

## Strengths
- **Look:** all four rooms use the approved language (cyan key light, warm tungsten rim, night ambient). They read at a glance.
- **Boardroom:** one module covers all four script states: Nov 17 with the plan, Nov 19 with the spotlight, the 11:53 PM slate wall with TASYA's door appearing, and Nov 21 with the fires. MADA's end chair is bolted to the floor and has no fire slot, so it can never burn. The end chairs sit under downlights, so in the calm-off MADA stays cool and still while the fires and door light are warm.
- **Scripted gags as simple states:** glasses shivering in turn, phones buzzing and walking to the table edge, speakerphone tones, the sign lighting in three steps, the box of zeros, the four screws.
- **Fits the cast:** existing cast sprites (Gerg, Mas) sit correctly on the seat and desk anchors.
- **TPOOL door:** survives the early-web palette switch. Its frosted bands repeat every 5 rows, on the same rows as the lines in rooms B's desk grain, so the transition in shot 26.13 matches.
- **Guardrails:**
  - No real Vegas, hotel or F1 marks, and no race cars.
  - The security tile carries no clock or timestamp.
  - Every name on screen is in the naming registry.

## Weaknesses
- The rooms are dark, like the approved key frame. They need a real-screen check and the luminance audit.
- Micro text (tent cards, the framed charter) only reads at 4x.
- Cast gaps:
  - The boardroom's end seats need a side-facing seated pose from the cast (the asset list already asks for one).
  - Gerg's existing table sprite still carries the dinner's warm lighting, so he needs a boardroom light state.
- The spotlight is warm tungsten, so it reads orange on the dark chairs.
- The speed-dial wheel reads as a Ferris wheel of cards more than a literal Rolodex.
- The revolving door is seen head-on, so it looks like a glass booth until someone turns it.
- The four shivering glasses are 5–11 px, as a wide shot demands. A minibar close-up would help if the gag needs more read, and it isn't built.
- There is no night version of the suite.

## For the next stage
- **Decisions to confirm:**
  - The CEO chair is seat C (Rima's empty chair, then TTEMME's sticky note).
  - THE QUIET VOTE's laptop sits on seat L. Mas takes L in scene 30, opposite MADA at R.
  - The three fires in scene 30 are on the table, chair B and nameplate D.
- **Security camera (27.26):** I built both readings, a high reverse angle (`drawLobbyCam`, my recommendation) and the day wide inside camera chrome (`drawLobbyCamWide`). Layout should pick one. The walk-in crosses sideways at one depth, so the sprite never needs scaling.
- **Continuity flag for the bible owner:** the script puts a revolving door in the Ep1 lobby, but `world/locations.md` says one is installed in Ep3.
- **Cast and kits own:** the ALYI reflection art, the hands, the hourglass, keycaps, the phone's suggested-replies strip, the tile chrome, the 1993 dialog and the flash-print to blueprint. The rooms provide an anchor or a screen area for each.