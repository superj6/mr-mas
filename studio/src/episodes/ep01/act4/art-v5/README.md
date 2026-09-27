# Ep1 Act Four · v5 art pass (`art-v5/`)

The code side of the Act Four v5 pixel assets. The assets themselves are additive modules in
`studio/src/shared/pixel/{rooms,cast,kits}/`. This folder holds what shows and checks them, plus the J1 port.

**The record** (what each asset is, its module, how to use it, what is still a stand-in, what was not built):
[`show/episodes/ep01/production/act4/art-built-v5.md`](../../../../../../show/episodes/ep01/production/act4/art-built-v5.md).
**The asks it answers:** [`art-needs-v5.md`](../../../../../../show/episodes/ep01/production/act4/art-needs-v5.md) §2.

| File | What it is |
|---|---|
| `demos.ts` | The stills registry: one `D({id, state, module, note, standin, draw})` per asset state (88). Each `draw` paints the 480×203 picture the way the v5 shot would use the asset, often over THE EDITOR's v4 frame for that shot (`native4`). These are previews, not the v5 layouts (`shots5.ts`, not built yet). |
| `tools/sheet.ts` | The Node renderer for the stills sheet (no browser). Modes: `all`, `one`, `crop`, `list`, `strays`. |
| `tools/v4check.mjs` | The v4 non-regression check: builds v4's renderer with `callgrid.ts` as committed and as edited, and md5-compares 812 native frames. |
| `j1/` | J1 `CANCELLED`, ported for a drop-in at the Cancel click (conditional, off by default). See below. |

## Run (from `studio/`)

```bash
S=<scratch dir>   # e.g. the session scratchpad, in your own subfolder
npx esbuild src/episodes/ep01/act4/art-v5/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
node $S/sheet.cjs all ../out/ep01/act4/assets/v5        # native/ + full/ + sheet-native.png + index.json (~80 s)
node $S/sheet.cjs strays                               # every line must end "ok" (master palette + THE PLAN's BP palette)
node $S/sheet.cjs one $S/x.png ROOM-NELEH-DESK@ots-day-waiting 2
node $S/sheet.cjs crop $S/c.png ROOM-NELEH-DESK@ots-day-waiting 220 0 190 130 4
node src/episodes/ep01/act4/art-v5/tools/v4check.mjs $S/v4check    # prints IDENTICAL (about 3 min)
```

## J1 (`j1/`)

| File | What it is |
|---|---|
| `timing.ts` | The beats as t = frames since the click (`J1_LEN` 60, `J1_T`, `J1_FALL`, `J1_CLOSE`, `j1PhaseOf`, `j1Active`). |
| `pixel.ts` | The pixel side: `j1PixelFrame(t, hostFrame, {fClick, neonGuard, g5, g4})` (the flash-print, the snap, the fall, the close); `j1Snap`; `j1ScarTile`. Node-safe. |
| `J1Cancelled.tsx` | The component: `<J1Cancelled t frame click pixel grade />`. Mount it for `j1Active(t)` in place of the host's picture, and don't draw the host's tile drop / GLYPH dissolve then. |
| `Certificate.tsx`, `bust.ts`, `bustArt.ts`, `perforation.ts` | Copies of `src/dev/jumps/proto1/` (import paths only changed; `bustArt.ts` byte-identical). The prototype stays frozen. |
| `J1Preview.tsx`, `entry.tsx` | The preview host `ep01-act4-j1-v5-preview`: J1 dropped into v4's S1.09 at its click (act frame 735). Registered only by this entry (not by `src/Root.tsx`). |

```bash
npx remotion render src/episodes/ep01/act4/art-v5/j1/entry.tsx ep01-act4-j1-v5-preview ../out/ep01/act4/assets/v5/j1/j1-v5-preview-silent.mp4 --concurrency=4 --crf=18 --log=error
npx remotion bundle src/episodes/ep01/act4/art-v5/j1/entry.tsx --out-dir=$S/j1b --log=error      # then stills without re-bundling:
npx remotion still $S/j1b ep01-act4-j1-v5-preview ../out/ep01/act4/assets/v5/j1/j1-t+46.png --frame=82 --log=error   # frame = t + 36
```

## Rules this code keeps

- Assets are new files. The one edit to an existing shared file (`kits/callgrid.ts`: `vegasBg` guard, `TileState.neonGuard`, `TileState.mouth`) is opt-in and defaults to v4's drawing. `tools/v4check.mjs` proves it (812/812 identical, 2026-09-26).
- Native 480×270, master palette only (`PAL.*`; THE PLAN keeps its own BP palette), whole-pixel moves, held drawings, no scaled sprites, no mirrored frames with lettering.
- No new imports from `src/dev/` (ORGANIZATION-PLAN phase 5a).

## Measured versus needs a person

- **Measured:** the 88 stills render and are palette-clean; v4 renders byte-identical and its `check` passes; `tsc` adds no errors; the J1 preview renders (120 f).
- **Needs a person:** every still was looked at by one reader (the pass). Nothing was seen in motion. The open judgment calls are in art-built-v5.md §5 and §7.
