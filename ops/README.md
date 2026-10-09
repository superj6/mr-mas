# ops/

Operational helpers for running this project on one laptop.

- `heavy.sh`: wrap every heavy job (Remotion renders, Kokoro/fastrec recording, OST engine builds, Blender, big ffmpeg encodes):
  `ops/heavy.sh npx remotion render ... --concurrency=4`
  - At most `MRMAS_HEAVY_SLOTS` (default 2) heavy jobs run at once machine-wide, using flock slots `/tmp/mrmas-heavy.N.lock`.
  - It waits until memory, swap and load have headroom, and runs at low priority.
  - Tunables: `MRMAS_MIN_AVAIL_GB` (default 10; lower it for a light check when other apps hold memory but pressure is 0), `MRMAS_MAX_SWAP_GB` (7: swap pages linger after a spike, so memory available is the main guard), `MRMAS_MAX_LOAD` (16), `MRMAS_HEAVY_WAIT` (3600 s).
  - Why: on 2026-09-27 six passes at once pushed load to 42 on 14 threads and swap to 7.4 of 8 GB, which froze the laptop and killed the session.

- `rebuild-act.sh <act> [--from STEP] [--only STEP] [--dry-run]`: rebuild one changed act of the Ep1 film end to end (lock, score, mix, picture, mux, film), each heavy step through `heavy.sh`. Documented in its header and in `show/episodes/ep01/production/full-v3/assembly.md` §Z.5.
  - `--dry-run` runs nothing and writes nothing in the repo. It prints every command in order and checks that every path it names exists, and for the film step every input `assemble.py` reads. It exits 1 if anything is missing. Use it first, and after any move.
  - **Act One stops at its lock step on purpose.** Its EL timeline carries two hand-placed V.O. lines that `el_lock.py` would drop, and `el_lock.py --fixed S7.13 <seg> …` swallows the segment names after `--fixed` and rebuilds all six segments (`voices-el.md` §AD, §AE). Splice a changed Act One beat by hand, then run `--from mix`.

- `rebuild-act.sh --ep 2 <act> [--scene ID[,ID]] [--from STEP] [--only STEP] [--dry-run]` runs `rebuild-act-ep2.sh`, Ep2 v1's copy (2026-10-08): the same steps on Ep2's tools (lock, score, mix, picture, mux, scenecut, film). Its picture step is the per-scene render (only scenes whose content changed are drawn; the act picture is their lossless concat), and `--scene` renders just those scenes and cuts each one with its sound for review. Without `--ep` (or with `--ep 1`) `rebuild-act.sh` runs exactly as before (its six dry runs are identical). Documented in `show/episodes/ep02/production/v1/pipeline.md` §7.

- `pressure-governor.sh [minutes] &`: pauses this project's heavy jobs (their `heavy.sh` scopes) while the session's memory pressure is above 20%, and resumes them under 5%. It never touches another project's processes.

### The reorganization tools (docs/ORGANIZATION-PLAN.md)

- `orgmove.py`: the move and rewrite tool (plan Appendix B). `plan` is a dry run (the diff and the MANUAL lists), `apply` rewrites the references and then moves, `frag` exits 1 while anything is unrewritten or unreviewed, and `undo` moves everything back. Always set `MRMAS_ROOT` to the repo. How to run a phase: plan §7.
- `fraggrep.sh 2|2d|3|4|5a|5b`: the independent fragment check (plan Appendix B.2); it uses only `git grep`.
- `keyscan.py [range]`: checks that no API key value from `.env` is in the staged files (no argument) or in the commits about to be pushed (`origin/main..HEAD`). It never prints a value. Run it before every commit and push.
- `reorg/`: what each reorg phase ran. `phaseN.tsv` is the manifest, `phaseN.ok.tsv` the reviewed MANUAL lines, `phaseN.frag.txt` the tool's final `frag` output.
  - `reorg/smoke.sh <outdir> [<baseline>]`: the smoke tests for the finished Ep1 (checks only: the typecheck, `lock.py` on the six EL v3.5 segments, the v3.5 score check, the `rebuild-act.sh` dry runs, the film fingerprint, the dialogue paths).
  - `reorg/ep01-final.sha1`: the SHA-1 of the final film `out/ep01/full-v3/ep01-v35.mp4` and of every chapter input (the EL pictures, the v3.5 mixes, the hum gap). `sha1sum -c ops/reorg/ep01-final.sha1` proves they are unchanged.
- `workflows/`: the 25 workflow scripts of the early passes, as they ran. They are records and never rewritten (`workflows/README.md`).

- **Also:** `git config core.untrackedCache true` and `feature.manyFiles true` are set locally. `git status` dropped from 4.7 s to instant, and Claude Code runs it for every agent turn.

## 2026-09-28: every heavy job gets its own memory scope

On 2026-09-27 at 19:51, systemd-oomd killed the terminal's whole cgroup, taking down the Claude Code session and every agent it had launched. That cgroup peaked at 23.9 GB, with 1.3 GB of swap: both composers were rendering the ElevenLabs score, the sound pass was building stems, and renders were running, all inside the terminal's cgroup.
- **The fix:** `heavy.sh` now runs each job through `systemd-run --user --scope -p MemoryMax=$MRMAS_HEAVY_MEM_MAX` (default 8G, with no swap: `MRMAS_HEAVY_SWAP_MAX`, default 0). A runaway job hits its own cap, or oomd picks its scope, and the session survives. `MRMAS_HEAVY_NO_SCOPE=1` turns the scope off.
- **`MIN_AVAIL_GB` default** raised from 8 to 10.
- **Practice:**
  - Run at most 3 agents at once.
  - Memory-heavy audio work (stems, OST renders, mixes) always goes through `heavy.sh`.
  - Keep one heavy audio job per agent at a time.
