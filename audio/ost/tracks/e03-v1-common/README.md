# Episode 3 score helpers

Copies of Ep2's final shared score engine, pointed at Ep3's base/master timelines. `v3lib.py` supplies the lock clock, cue construction, note thinning, rendering, assembly and measurement; `v3clock.py`, `v3music.py`, `v3lay.py`, `cueapi.py` retain the alternate cue APIs. `check.py` validates exact length, lock hash, measured fragments, −42 dB holes, engine rules and `pocket.py`'s per-line voice margin.

Tracks are siblings `e03-v1-<seg>/track.py`. `episode_score.py` composes continuous scene sections in five colors, keeping 96 BPM, chip, open fifths and partial knee cells. All six actual stock-pass stems rendered and passed exact-length/lock-hash, holes/fragments, engine and all249 dialogue-pocket checks. Final-library timing will require another render. The sample calibration cache is episode-local and ignored. The [pipeline](../../../../show/episodes/ep03/production/v1/pipeline.md) has commands; all renders/checks go through heavy.sh with `OST_WORKERS=2`. No source/shared engine writes are needed. Nothing has been heard.

The Episode 3 scene composer was written by Codex using the inherited Opus 5.5 engine and musical vocabulary; credit the attempt accurately while preserving legacy asset attribution.
