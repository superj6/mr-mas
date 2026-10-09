# e02-v1-common: the Ep2 v1 score's shared engine

Copies of Ep1's segment-score helpers (locked, in `tracks/e01-v3-*/`), pointed at Ep2's locks (`show/reel/ep02-v1/`, and `show/reel/ep02-v1-el/` with `--el`, the film). The module names are Ep1's, so Ep1 cue code ports with one `sys.path` line.

| File | From | What |
|---|---|---|
| `v3lib.py` | `e01-v3-act1/` (composer X) | the clock (`TL`), talk and gaps, `thin()`, `Cue` (a cue on its own grid in segment seconds), `render_cue`, `assemble` (lay-in), `measure` |
| `v3clock.py`, `v3music.py`, `v3lay.py` | `e01-v3-act3/` (composer Y) | the other house style: `Clock`, the composing helpers, render/lay/measure |
| `cueapi.py` | `e01-v3-act4/a4common.py` | frame-style (`FCue`) and seconds-style (`SCue`) cue APIs on a `Clock` (Act Four's own constants left out) |
| `check.py` | `e01-v3-act1/v35check.py` | every segment's stem against its lock: exact length, loudness, true peak, unmarked silences and holes, fragments, 12 dB steps at cuts, the engine's checks |

Each segment's score is `../e02-v1-<seg>/track.py` (a stub until the score pass fills `CUES`: `--dry` prints the lock's music runs). The rules are manifest.md §6 and LEARNINGS S1–S3, S9. Renders through `ops/heavy.sh` with `OST_WORKERS=2`.
