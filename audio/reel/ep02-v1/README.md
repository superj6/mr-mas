# audio/reel/ep02-v1: Ep2 v1's base lock, temp beds, stems and mix

Copies of Ep1's tools (locked: `audio/reel/ep01-v35/`, `audio/reel/ep01-v3/`), pointed at Ep2, with every Ep1-specific table and layer removed. The full flow, with commands, is [pipeline.md](../../../show/episodes/ep02/production/v1/pipeline.md) §1 and §5.

| File | What | From |
|---|---|---|
| `build_timeline.py` | THE BASE LOCK (Kokoro timing): the beat plans (`show/episodes/ep02/production/v1/beat-plan/<seg>.json`) → `show/reel/ep02-v1/ep02-v1-<seg>.json` + the manifest + the card's timeline; `lock-report.json`. A plan with `"source": null` builds every beat `new`. The per-beat fix tables are empty, for Ep2's own entries | `ep01-v35/build_timeline.py` |
| `bed.py` | the temp bed per chapter for the stick reel (rooms, SFX, a pad per E02 cue) | `ep01-v35/bed.py` |
| `measure.py` | the lock's transcript and measurements (runtimes, gaps between lines, pacing, the V.O.) | `ep01-v35/measure.py` |
| `rooms.py` | NEW: the room recipes (lock `room` → SFX-board beds, first candidate on the board), shared by `bed.py` and `stems.py` | — |
| `stems.py` | the ROOM and SFX stems per segment, from the lock alone | `ep01-v3/stems.py` |
| `mix_episode.py` | the final mix per segment: dialogue from the takes (V.O. +2.0 dB, MARIO's EQ), rooms dipping 2 dB, SFX, the score ducked by cue, −16 LUFS, true peak < −1 dBTP, the seams and the dialogue guard; `outro-mix.wav` | `ep01-v3/mix_episode.py` |

Outputs (git-ignored audio): `stems/[el/]`, `<seg>-bed.wav`; the mixes go to `out/ep02/v1/mix/` (EL, the master) or `out/ep02/v1/mix-kokoro/`; QA to `mix-qa/<variant>/`. Nothing here has been listened to: every number is measured.

Tested 2026-10-08 on a synthetic six-segment lock in scratch (the real takes don't exist yet): the base lock from a plan with no source, the bed, the stems and the mix (every segment −16.0 LUFS, true peak −2.85 to −3.0 dBTP, seams within 0.5 dB). The real beat plans parse; every line waits for its take.

**The v1 lock, 2026-10-09** ([lock-v1.md](../../../show/episodes/ep02/production/v1/lock-v1.md)): built on the recorded takes, 23:02.00 of story (33,168 frames), 0 check failures. The lock pass added to `build_timeline.py` what the copy lacked: the plans' `keep_parens` (five on-screen items had lost their parentheses or gone), each on-screen item's plan `kind`, a check that every plan item is in the lock with its words, window and kind, the tempo gaps measured across a cut (`cut_gaps`), only JSON in `takes_files`, and its first table entries (`ONSCREEN_SET`: sc 14's sentence line held to its read floor). **The lock QA** (2026-10-09, lock-v1.md §3.5) rebuilt it at 22:54.00 of story (32,976 frames): a plan line's `sub` (a cut-off's subtitle pieces, `[text, word index | "after:<line>"]`) is carried into its lock line and checked, the take still whole.

**The score review, 2026-10-09** (the score's composer; nothing mixed yet, the stems not built). Two of its findings live here:
- **The pre-laps are laid.** `mix_episode.py`'s score path is one function, `score_bus()`, and it now lays each next chapter's score pre-lap (its cue sheet's `prelap`: Act One's 1.0 s under the card, Act Three's 0.792 s under Act Two's black, Act Four's 1.2 s under Act Three's black) on the previous chapter's score bus, ending on its last sample, at the next score's head gain (`score_head_gain_db`: its duck there); that chapter's head fade is then off. The card gets a score bus for Act One's. Tested on the score buses alone (`score_bus` for each pair, the same gain both sides, as the seam ramp makes it): every seam's sample jump ≤ 0.005; card → Act One +0.8 dB (was silence → a 1 s fade), Act Two → Act Three +8.6 dB onto the ticks (was digital zero), Act Three → Act Four −21.3 → −15.5 LUFS-M (was −33.9 → −15.6, the review's +15 LU step).
- **A score is used only on its own lock's content.** `stems.score_files()` (which the mix reads too) refuses a cue sheet whose `lock_sha1` (`e02-v1-common/v3lib.py lock_sha1`: the sha1 of the lock's beats) differs from the lock's, as well as one laid to another timeline; before, a retime that kept the act's length passed a stale score (S5).
- `line_audio()`, `speech_spans()` and `score_duck_db()` are the dialogue bus's and the duck's own code, split out unchanged so the score's per-line pocket check (`audio/ost/tracks/e02-v1-common/pocket.py`) hears the takes and the duck exactly as the mix does.
