# Episode 3 · v1 production

An unpublished Codex attempt at `ep1.2_strawberry.jpg`, made in one go under [HANDOFF.md](../../../../../docs/HANDOFF.md). Episode 1 and Episode 2 remain untouched. Start with [DELIVERY.md](DELIVERY.md) for the delivered file, verification and watch-through notes.

| Record | Purpose |
|---|---|
| [LEARNINGS](LEARNINGS.md), [AUDIT](AUDIT.md), [proposal](proposal.md) | Check the stale draft against the showrunner's notes and choose the complete scene flow. |
| [script](script-v1.md), [manifest](manifest.md), `beat-plan/` | Deterministic source, stable line/shot IDs and production inventory. |
| [facts-v1](facts-v1.md), [facts-story](facts-story.md), [review-source](review-source.md) | Source anchors and the writing/guardrail review. |
| [review-picture](review-picture.md) | Native-size still review, fixes and the limits of that inspection. |
| [pipeline](pipeline.md) | Takes, locks, score, sound, titles and exact rebuild commands. |
| [assembly](assembly/README.md) | Whole-film assembly, QA, transcript and stock-pass provenance. |
| [release copy](../../release.md) | Spoiler-free description, chapters and thumbnail choices; no public upload. |

The six segment locks in `lock/` are generated from actual audible take spans. `studio/src/episodes/ep03/pixel/` contains the episode-local renderer and authored art; `audio/ep03/`, `audio/reel/ep03-v1/` and `audio/ost/tracks/e03-v1-*` contain its voice, sound and score sources. Heavy commands always run through `ops/heavy.sh`.

For a picture-only fix, use `ops/rebuild-act.sh --ep 3 <segment> --scene <scene-id> --only picture`, then rebuild that act picture and the film. Dialogue or timing changes require the affected take/lock/score/mix dependencies first; [pipeline.md](pipeline.md) gives the order. Measurements are marked [M] and editorial judgements [J]; neither substitutes for watching and listening.
