# Episode 3 pixel pipeline

Episode-local copy of Ep2's completed renderer, lock, lip-sync, text, transitions and per-scene content-hash cache. Art is authored in `<seg>/scenes/sc-<scene>.ts`; `shots.ts` imports those modules. The generated timing lock is `data.ts`. Existing scenes are never overwritten by `tools/scenes.py`; stand-ins are explicit and fail final validation.

Exact commands and current state: [pipeline.md](../../../../../show/episodes/ep03/production/v1/pipeline.md). From `studio/`, `node src/episodes/ep03/pixel/tools/build.mjs act1 /tmp/mrmas-ep03-session/pipeline/r-act1.cjs`, then `node /tmp/mrmas-ep03-session/pipeline/r-act1.cjs check`. Render using `ops/rebuild-act.sh --ep 3 <seg> --only picture` from the root; heavy work is wrapped by that script.

[M] Setup generated six 48-frame scaffold locks and the real 48-frame filename-card lock. A scaffold is not final picture. Scene timing uses the scene clock `f`; preserve that for cache independence. Frozen Ep1/Ep2 art may be imported read-only; no copied episode layout is treated as Ep3 art.
