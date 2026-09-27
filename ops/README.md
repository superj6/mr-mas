# ops/

Operational helpers for running this project on one laptop.

- `heavy.sh`: wrap every heavy job (Remotion renders, Kokoro/fastrec recording, OST engine builds, Blender, big ffmpeg encodes):
  `ops/heavy.sh npx remotion render ... --concurrency=4`
  - At most `MRMAS_HEAVY_SLOTS` (default 2) heavy jobs run at once machine-wide, using flock slots `/tmp/mrmas-heavy.N.lock`.
  - It waits until memory, swap and load have headroom, and runs at low priority.
  - Tunables: `MRMAS_MIN_AVAIL_GB` (default 8), `MRMAS_MAX_SWAP_GB` (7: swap pages linger after a spike, so memory available is the main guard), `MRMAS_MAX_LOAD` (16), `MRMAS_HEAVY_WAIT` (3600 s).
  - Why: on 2026-09-27 six passes at once pushed load to 42 on 14 threads and swap to 7.4 of 8 GB, which froze the laptop and killed the session.

- **Also:** `git config core.untrackedCache true` and `feature.manyFiles true` are set locally. `git status` dropped from 4.7 s to instant, and Claude Code runs it for every agent turn.
