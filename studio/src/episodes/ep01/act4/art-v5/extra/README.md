# Ep1 · Act Four · v5 extra pixel assets (`art-v5/extra/`)

The lower-priority assets from [`art-needs-v5.md`](../../../../../../../show/episodes/ep01/production/act4/art-needs-v5.md) §2 that
[`art-built-v5.md`](../../../../../../../show/episodes/ep01/production/act4/art-built-v5.md) §4 lists as not built: the P4
POLISH-STANDINS in kept v4 shots, ROOM-LOBBY-LOW, the optional PROP-PODCAST-BOOM, and a pixel variant of Tasya's room
remap staged the way E1-P3 (1.D) moves. Built by the `a4fin-pixelextra` pass on 2026-09-27, in parallel with the pixel
preview pass, which owns `animatic/**`, `shots5.ts` and the existing `art-v5` modules; nothing of theirs was edited.

**The hand-off list** (asset, module, the shot it serves, the exact call that wires it):
[`show/episodes/ep01/production/act4/art-extra-v5.md`](../../../../../../../show/episodes/ep01/production/act4/art-extra-v5.md).
**The stills:** `out/ep01/act4/assets/v5/extra/` (`sheet-native.png`, `native/` 480×270, `full/` 1920×1080, `index.json`).

| File | Exports | Serves |
|---|---|---|
| `hands.ts` | `drawNelehPenHand`, `nelehPenHand` (her pen or marker from above); `drawWorkerScrewHand`, `workerScrewHand` (the maintenance worker's screwdriver fist, 3 roll drawings); `drawWorkerCarryHand`, `workerCarryHand` (the same worker carrying the carton); `deeperSkin` | S3.02, S4.14, S8.09, S8.01 |
| `observer-chair.ts` | `drawObserverChair`, `observerPlacard`, `CHAIR` (rail / seat anchors), `chairKeysAt`, `KEYS_LAND` | S8.10 |
| `cards-inserts.ts` | `drawChapterCard`, `drawLobbyStoneNudge` | S5.01, S8.05 |
| `landlord.ts` | `drawLandlordRemapPlate`, `landlordRemapAt`, `landlordRemapKey`; `drawPodcastBoom`, `boomStepAt` | S7.02b (options) |
| `lobby-low.ts` | `drawLobbyLow`, `signAt`, `boxAt`, `LOBBY_LOW` | S8.01 |
| `demos.ts` | `DEMOS`: one still per asset state (24), the sheet's registry | the sheet |
| `tools/sheet.ts` | the Node stills renderer (a copy of `art-v5/tools/sheet.ts` pointed at `extra/demos.ts`; it was already here from this pass's earlier, interrupted run and is used unchanged) | — |

Every module is Node-safe (no DOM), draws into a `Buf` in native 480×270 pixels, uses the master palette only, and moves in
whole pixels on held drawings. The hands are posed in centimetres and re-rasterised with `kits/inserts-hands.ts`'s capsule
renderer (`renderCaps`, `viewCM`, `CEL`: imported, not edited). No file imports from `src/dev/`.

## Run (from `studio/`)

```bash
S=<scratch dir>            # your own subfolder of the session scratchpad
npx esbuild src/episodes/ep01/act4/art-v5/extra/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
node $S/sheet.cjs all ../out/ep01/act4/assets/v5/extra     # native/ + full/ + sheet-native.png + index.json (~8 s)
node $S/sheet.cjs strays                                   # every line must end "ok"
node $S/sheet.cjs one  $S/x.png POLISH-FOLD-CHAIR@u3-keys-landed 2
node $S/sheet.cjs crop $S/c.png POLISH-PEN-HAND@S4.14-question 150 100 150 103 4
```

Typecheck only these files (a scratch tsconfig that extends `studio/tsconfig.json` with `"files"` listing the six `.ts`
modules and `"types": []`): `npx tsc -p $S/tsconfig.extra.json` printed nothing on 2026-09-27. The sheet is light (one Node
process, about 8 s); it isn't a heavy job for `ops/heavy.sh`.

## Measured versus needs a person

- **Measured:** 24 stills render; `strays` prints ok for all 24; `tsc` clean on the six modules; no existing file changed
  (`git status`: only `extra/` and `out/ep01/act4/assets/v5/extra/` are new from this pass).
- **Needs a person:** every still was checked by one reader (this pass), at 1× on the sheet and in 3–5× crops. Nothing has
  been seen in motion. Open calls are listed in the hand-off doc (§4).
