# ep01a4 rooms A (background artist A) — builder notes

The full usage doc (states, anchors, draw order, the shot → call table) is `show/episodes/ep01/production/act4/rooms-a.md`.

- **Modules**, new files in `src/shared/pixel/rooms/`:
  - `boardroom.ts`, `lobby.ts`, `vegas-suite.ts`, `tpool-door.ts`
  - `setkit.ts`: the 480×203 contract, layer overlay, cartoon fire and smoke, shiver
- **Previews:** `src/episodes/ep01/act4/rooms-a/`. `plates.ts` lists every still, `motion.ts` is the 180-f motion test, and `entry.tsx` is the dev entry. Ids are `ep01a4-rooms-*`.
- **Contract:** plates are 480×203. Rows 203–269 are the rail band, which belongs to the rail builder; the previews fill it with a dark placeholder. All colours are master palette, except the `*-ew16` previews, which intentionally show the EARLYWEB16 switch.
- **Fast loop:**
  1. `npx esbuild src/episodes/ep01/act4/rooms-a/tools/preview.ts --bundle --platform=node --outfile=<scratch>/ra.js`
  2. `node <scratch>/ra.js <dir> 4 <plate>[@frame]|all`

  The output is pixel-identical to Remotion (checked by diff).
- **Materials** are registered with `defineMat` under prefixes: `br.*` boardroom, `lb.*` lobby, `vs.*` suite, `tp.*` tpool. The first definition wins, so pick new names rather than redefining these.
- **Rig limits in this style:**
  - Rooms are lit by palette ramps. Light changes are level changes or material swaps, never blends.
  - Anything that moves in a room is a state: held drawings, whole-pixel offsets.
  - Figures never scale, so depth stays shallow and every walk runs along one feet line.
