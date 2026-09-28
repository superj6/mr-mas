# ops/

Operational helpers for running this project on one laptop.

- `heavy.sh`: wrap every heavy job (Remotion renders, Kokoro/fastrec recording, OST engine builds, Blender, big ffmpeg encodes):
  `ops/heavy.sh npx remotion render ... --concurrency=4`
  - At most `MRMAS_HEAVY_SLOTS` (default 2) heavy jobs run at once machine-wide, using flock slots `/tmp/mrmas-heavy.N.lock`.
  - It waits until memory, swap and load have headroom, and runs at low priority.
  - Tunables: `MRMAS_MIN_AVAIL_GB` (default 8), `MRMAS_MAX_SWAP_GB` (7: swap pages linger after a spike, so memory available is the main guard), `MRMAS_MAX_LOAD` (16), `MRMAS_HEAVY_WAIT` (3600 s).
  - Why: on 2026-09-27 six passes at once pushed load to 42 on 14 threads and swap to 7.4 of 8 GB, which froze the laptop and killed the session.

- **Also:** `git config core.untrackedCache true` and `feature.manyFiles true` are set locally. `git status` dropped from 4.7 s to instant, and Claude Code runs it for every agent turn.

## 2026-09-28: every heavy job gets its own memory scope

On 2026-09-27 at 19:51, systemd-oomd killed the terminal's whole cgroup, taking down the Claude Code session and every agent it had launched. That cgroup peaked at 23.9 GB, with 1.3 GB of swap: both composers were rendering the ElevenLabs score, the sound pass was building stems, and renders were running, all inside the terminal's cgroup.
- **The fix:** `heavy.sh` now runs each job through `systemd-run --user --scope -p MemoryMax=$MRMAS_HEAVY_MEM_MAX` (default 8G, with MemorySwapMax 1G). A runaway job hits its own cap, or oomd picks its scope, and the session survives. `MRMAS_HEAVY_NO_SCOPE=1` turns the scope off.
- **`MIN_AVAIL_GB` default** raised from 8 to 10.
- **Practice:**
  - Run at most 3 agents at once.
  - Memory-heavy audio work (stems, OST renders, mixes) always goes through `heavy.sh`.
  - Keep one heavy audio job per agent at a time.
