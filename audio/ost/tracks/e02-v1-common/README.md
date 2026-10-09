# e02-v1-common: the Ep2 v1 score's shared engine

Copies of Ep1's segment-score helpers (locked, in `tracks/e01-v3-*/`), pointed at Ep2's locks (`show/reel/ep02-v1/`, and `show/reel/ep02-v1-el/` with `--el`, the film). The module names are Ep1's, so Ep1 cue code ports with one `sys.path` line.

| File | From | What |
|---|---|---|
| `v3lib.py` | `e01-v3-act1/` (composer X) | the clock (`TL`), talk and gaps, `thin()`, `Cue` (a cue on its own grid in segment seconds), `render_cue`, `assemble` (lay-in), `measure`; `lock_sha1(path)`, the lock's content hash every cue sheet carries (`audio/reel/ep02-v1/stems.py` has the same function: keep them equal) |
| `v3clock.py`, `v3music.py`, `v3lay.py` | `e01-v3-act3/` (composer Y) | the other house style: `Clock`, the composing helpers, render/lay/measure |
| `cueapi.py` | `e01-v3-act4/a4common.py` | frame-style (`FCue`) and seconds-style (`SCue`) cue APIs on a `Clock` (Act Four's own constants left out) |
| `check.py` | `e01-v3-act1/v35check.py` | every segment's stem against its lock: exact length, **the lock's content hash**, loudness, true peak, unmarked silences, holes under −60 dBFS **and S3's own −42 dBFS / 0.3 s scan** (outside `silences_designed`; a neighbour's ring-out or pre-lap counts), **fragments measured from the stem**, 12 dB steps at cuts, the engine's checks, and **the per-line pocket** (`pocket.py`; a line under +10 dB at its onset fails unless the cue sheet's `pocket_exempt` names it). `--no-pocket` skips the pocket; segment names check only those |
| `pocket.py` | new (the score review, 2026-10-09) | every take against the score as the mix will play it, in 1–4 kHz: `mix_episode.py`'s own score bus (the duck by mood and `duck_db`, the head fade, the ring-out and the pre-lap) and its own take processing (level match, device chains, cuts, the V.O. +2 dB). Per line: the margin over the whole line, at its onset (0.6 s from the first word), the worst 0.5 s window while the voice speaks, and the onset before the duck. `pocket.py act2`, `--all --flagged`, `--json` |

Each segment's score is `../e02-v1-<seg>/track.py` (a stub until the score pass fills `CUES`: `--dry` prints the lock's music runs). The rules are manifest.md §6 and LEARNINGS S1–S3, S9. Renders through `ops/heavy.sh` with `OST_WORKERS=2`.

The score review (2026-10-09) found the checks weaker than the rules: the holes scan at −60 dBFS let Act Three's dropout pass (S3 says −42), the fragment count was the cue sheet's own, the pocket was a whole-cue 2–6 kHz average that missed BLUEPRINT and the séance, and the mix took any score of the right length. All four are measured now. The run of 2026-10-09: all six segments PASS (pocket: every line's onset at least +10.9 dB; 10th percentiles +11.9 to +16.4).
