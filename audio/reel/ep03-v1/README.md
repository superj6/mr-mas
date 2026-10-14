# Episode 3 base timeline and sound pipeline

Copied from the finished Ep2 v1 tools on 2026-10-13. Inputs/outputs point to Ep3; every Ep2 beat-specific timing, stem, crosscut, score and mix override was reset. The latest content-hash score protection, device chains, scene-bounded SFX, speech pocket and mono-hole checks remain.

The exact commands and current state are in [pipeline.md](../../../show/episodes/ep03/production/v1/pipeline.md). `build_timeline.py` consumes Ep3 beat plans/takes; `mix_episode.py --all` wraps itself in `ops/heavy.sh` and builds required stems. `sound_audit.py` also wraps itself. The source episode folders are read-only; Python bytecode is disabled in copied tools.

[M] Source parses. At setup there are no Ep3 takes, score, stems or mix. Nothing has been heard. Room defaults are explicit fallbacks until Ep3's sound pass authors and validates its rooms.
