# Episode 3 pixel pipeline

Episode-local copy of Ep2's completed renderer, lock, lip-sync, text, transitions and per-scene content-hash cache. Art is authored in `<seg>/scenes/sc-<scene>.ts`; `shots.ts` imports those modules. The generated timing lock is `data.ts`. Existing scenes are never overwritten by `tools/scenes.py`; stand-ins are explicit and fail final validation.

Exact commands and current state: [pipeline.md](../../../../../show/episodes/ep03/production/v1/pipeline.md). From `studio/`, `node src/episodes/ep03/pixel/tools/build.mjs act1 /tmp/mrmas-ep03-session/pipeline/r-act1.cjs`, then `node /tmp/mrmas-ep03-session/pipeline/r-act1.cjs check`. Render using `ops/rebuild-act.sh --ep 3 <seg> --only picture` from the root; heavy work is wrapped by that script.

[M] Setup generated six 48-frame scaffold locks and the real 48-frame filename-card lock. A scaffold is not final picture. Scene timing uses the scene clock `f`; preserve that for cache independence. Frozen Ep1/Ep2 art may be imported read-only; no copied episode layout is treated as Ep3 art.

## Authored picture pass

All 124 story shots now register explicit layouts through their scene modules and `art/story.ts`. The act painters own scenery, native portrait coverage and physical props; the host owns dialogue clocks, lip sync, transitions and the reserved text band. Unknown `VISUAL:` keys fail the picture build. `tools/picture.py` refreshes the explicit registrations after a timing relock and removes only its own unused pending scaffold.

[M] Stock-take picture renders finished at 1080p24 with zero stand-ins and passed all six segment flash scans. `art/locked-review.ts` draws the actual host at three positions per shot; all 372 samples drew without failure. [J] Both reviewers inspected all 124 middle-shot frames at native size across unscaled pages, then inspected critical fixes again. See [review-picture.md](../../../../../show/episodes/ep03/production/v1/review-picture.md) for the exact scope and limitations. Final library-take durations require a fresh timing/render pass.
