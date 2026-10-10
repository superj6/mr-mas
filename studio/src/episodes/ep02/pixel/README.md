# The Ep2 v1 pixel pipeline

This folder turns each Ep2 segment's lock into the pixel picture: the cold open, Acts One to Four, the tag and the filename card. It is a **copy of the Ep1 pipeline** (`../../ep01/pixel/`, locked: never edited), with Ep2's paths and one addition: **the per-scene render**, so a change to one scene re-renders only that scene. The record and the proof are in [pipeline.md](../../../../../show/episodes/ep02/production/v1/pipeline.md) §3–§4. Ep1's [README](../../ep01/pixel/README.md) still describes everything the two share (the shot spec, anchors, mouths, the band, transitions, stand-ins, GLYPH and browser frames, the review frame).

## What is different from Ep1

| | Ep1 | Ep2 |
|---|---|---|
| Layouts | one `<seg>/shots.ts` | **one module per scene**, `<seg>/scenes/sc-<scene>.ts` (`defineScene({scene, layouts, assets?})`); `shots.ts` only imports them (`fromScenes`), in a block `tools/scenes.py` writes |
| A layout's `f` | the act frame | **the frame inside its scene** (`sh.s - sh.sceneS + k`), so a scene draws the same pixels wherever it sits in the act |
| The lock | shots and sequences | the same, plus **scenes**: each shot has `scene` and `sceneS`; `LOCK.scenes` = runs of shots with one beat-plan scene id (`passes.scene`), tiling the act |
| The act picture | chunks cut on shot starts | **`scenes`**: each scene renders alone into a content-hash cache, `out/ep02/v1/scenes/<seg>/`; the act is their lossless concat (`-c copy`) |
| Paths | `full-v3/lock/<seg>.json`, `out/ep01/full-v3/picture/` | `show/episodes/ep02/production/v1/lock/<seg>.json`, `out/ep02/v1/picture/` |
| Compositions | `ep01-pixel-<seg>` | `ep02-pixel-<seg>` (+ `-review`, `-still`), from `entry.tsx` |
| One lock path | the picture passes drew on the Kokoro lock; the EL lock was a second set, redirected in at build time | the EL-timed lock is written into the same `<seg>/data.ts` (`assembly/tools/el_lock.sh`); the Kokoro lock is only for passes before the EL takes exist |

The layout helpers (`kit.ts`: the pixel font, `held`, the framing moves, lip-sync) are Ep1's Act Four modules, **imported read-only** from `../../ep01/act4/animatic/`. Ep1 is locked, so they never change; an Ep2 helper goes in a new Ep2 file.

## What a shot pass does

```sh
cd /home/jgon/project/art/mrmas
# 1. Lock (light). The master is the EL lock (once its takes exist); before that, the Kokoro base lock:
bash show/episodes/ep02/production/v1/assembly/tools/el_lock.sh act1            # or KOKORO=1 bash .../el_lock.sh act1
# 2. A stub module for every scene the lock has and shots.ts doesn't import yet (never touches a module that exists;
#    --refresh-stubs rewrites only a bare stub's header, its frames and picture notes, for the new lock):
python3 studio/src/episodes/ep02/pixel/tools/scenes.py act1 --refresh-stubs
# 3. Draw: fill studio/src/episodes/ep02/pixel/act1/scenes/sc-<scene>.ts, L.add(<shot id>, {st, draw, marks, face, ...})
cd studio
node src/episodes/ep02/pixel/tools/build.mjs act1 $S/r-act1.cjs     # the renderer + its metafile (<bundle>.meta.json)
node $S/r-act1.cjs check                                           # exit 1 on stand-ins, marks that didn't resolve, layouts that throw
node $S/r-act1.cjs contact $S/act1-contact.png                     # one still per shot; picstills / stills / native as Ep1
node $S/r-act1.cjs scenekeys                                       # each scene: its key, cached or not, what changed
node $S/r-act1.cjs scenecheck --every 4                            # act frames = the same frames drawn by each scene alone
GLYPH_DIR=$S/glyph X264_THREADS=1 ../ops/heavy.sh node $S/r-act1.cjs scenes --jobs 2      # -> out/ep02/v1/picture/act1.mp4
X264_THREADS=1 ../ops/heavy.sh node $S/r-act1.cjs scenes --only 4A --force 4A             # one scene, no concat
node $S/r-act1.cjs sceneprune                                      # drop cache entries no index names (keeps the last two)
```

- **The cache key** hashes everything that can change a scene's pixels: its slice of the lock (shots, lines, mouths, texts, marks, spots, rails and burned subtitles over it, rebased to the scene), the source files its layouts import (from the bundle's esbuild metafile: the scene module and its imports, plus the pipeline), the files it names as `assets` and its overlays, the GLYPH PNGs of its browser frames, and the encoder's settings and segment options. The next scene's first shot is in the key only when the scene's last shot dissolves into it (`exit: {kind: 'dither'}`). A layout written straight in `shots.ts` hashes all of `shots.ts`'s imports (correct, just less precise).
- **Purity is now per scene.** A layout may use `k`, `sh` (but not `sh.s` or `sh.e` as a clock: they are act frames) and `f` (the scene frame). `scenecheck` catches a layout that reads the act's clock: it compares every act frame with the same frame drawn by its scene alone.
- **Rebuild the renderer** after any change (the bundle is what renders, and its metafile is what the cache reads).
- Any render of more than a few frames goes through `ops/heavy.sh`. `X264_THREADS=1` makes a scene file's bytes reproducible.
- The whole act, step by step (lock, score, mix, picture, mux, film): `ops/rebuild-act.sh --ep 2 <act> [--scene ID]`.

## Segments here

| Folder | What |
|---|---|
| `coldopen/ act1/ act2/ act3/ act4/ tag/` | the six story segments. **Locked on the v1 EL master (2026-10-09, [lock-v1.md](../../../../../show/episodes/ep02/production/v1/lock-v1.md)):** `data.ts` is the real lock (243 shots, 20 scenes) and `scenes/` holds a stub module per scene (no layouts yet: every shot renders as a stand-in until the shot pass draws). Each text carries the beat plan's own kind (post, doc, sign, plate, …), and a line the plan tags `os` is off screen. **Since the lock QA** (2026-10-09): each shot carries the beat plan's `picture` note (`sh.picture`: the eggs, the Ep1 payoffs and constraints such as "no image of Alyi in any surface"), the bare stubs list those notes in their headers, and a cut-off line's subtitle is drawn from its `sub` pieces (`lock.subs`: "…one of my favorite—" / "Thanks." / "—things."; "And profit—"). Before a lock, `data.ts` was the **scaffold** (`tools/lock.py --scaffold`) |
| `card/` | the 2 s filename card, `ep1.1_her.wav` (Ep1's card, re-typed at 1 character a frame so the cursor keeps Ep1's rhythm and the cut lands on an off frame). Its own `timeline.json` and lock |
| `example/` | the per-scene test bed (not the show): three scenes, a rail that runs from A into B, a V.O. line, a dither exit from B into C. `tools/scenetest.sh <scratch>` renders it, changes it and shows only the changed scenes render |

## Files

| File | What |
|---|---|
| `tools/lock.py` | the lock (Ep1's + scenes + `--scaffold`): timeline + takes → `<seg>/data.ts` and `production/v1/lock/<seg>.json` |
| `tools/scenes.py` | writes a stub module for each new scene and the `shots.ts` import block |
| `tools/render.ts`, `tools/build.mjs` | the Node renderer (Ep1's + `scenes`, `scenekeys`, `scenecheck`, `sceneprune`) and the bundle builder (+ the metafile) |
| `tools/scenetest.sh` | the per-scene render's self-test on `example/` |
| `tools/mp4cmp.mjs`, `tools/flashcheck.py`, `tools/mouths.py` | Ep1's tools, copied: two renders compared; the flash measure; the house mouth tracks (a library for `el_takes.py`) |
| `types.ts`, `spec.ts`, `frame.ts` | the lock's schema (+ `scene`, `sceneS`, `scenes`), the shot spec (+ `defineScene`, `fromScenes`, `sceneSlug`), the host (+ `sceneSeg`; `f` is the scene frame) |
| `kit.ts`, `anchors.ts`, `lipsync.ts`, `text.ts`, `standin.ts` | Ep1's, copied (Ep2 labels) |
| `Host.tsx`, `frames.ts`, `entry.tsx` | Remotion: `ep02-pixel-<seg>` compositions, every `<seg>/shots.ts` found automatically |

## Limits

- **Nothing here has been watched.** The proof is measured: which scenes rendered, byte-identical files, identical streams, pixel-identical frames.
- **The review frame** (`review`, `both`) still renders per act (its margin and timeline are the act's); only the picture is per scene.
- **Browser frames** (GLYPH tokens) are drawn by the Remotion host for the act (`glyphs`, then `GLYPH_DIR`); the scene key hashes the PNGs it splices.
- A scene is a run of consecutive shots with one scene id; a scene that comes back later in the act is a second run, `id~2`.
- **Mas's posts read `@masa` (the fixes pass, Act Two, 2026-10-10).** `art/props/ui.ts drawEp2Post` draws his posts through the shared post-any kit with `POSTERS_EP2.masa` (post-card's own avatar, colours and initial, copied; the handle naming.md gives). The shared post-card kit still says `@mas` and stays as it is: Ep1 renders through it. `drawEp2Post`'s sixth argument sets a card's time as the app shows it (12.07: `now`). Any scene importing the posts kit was re-keyed by this change; see `show/episodes/ep02/production/v1/fixes-v1.md`, Act Two, row 12.
