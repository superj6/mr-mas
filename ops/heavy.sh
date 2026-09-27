#!/usr/bin/env bash
# ops/heavy.sh: run a limited number of heavy jobs at once on this laptop, gently.
# Usage: ops/heavy.sh <command> [args...]
# Heavy = Remotion renders, Kokoro/fastrec recording, OST engine builds, Blender, big ffmpeg encodes.
# - Machine-wide slots: at most MRMAS_HEAVY_SLOTS heavy jobs (default 2) run at once, across every agent and pass.
# - Waits (up to MRMAS_HEAVY_WAIT seconds, default 3600) until memory and swap have headroom
#   and the 1-minute load average is reasonable, re-checking every 30 s.
# - Runs at low CPU and IO priority so the desktop stays responsive.
# Caps to use inside heavy jobs: Remotion --concurrency=4, fastrec --workers 2, OST_WORKERS=2.
set -euo pipefail
SLOTS=${MRMAS_HEAVY_SLOTS:-2}
MIN_AVAIL_GB=${MRMAS_MIN_AVAIL_GB:-8}
MAX_SWAP_GB=${MRMAS_MAX_SWAP_GB:-7}
MAX_LOAD=${MRMAS_MAX_LOAD:-16}
WAIT=${MRMAS_HEAVY_WAIT:-3600}
ok() {
  local avail swap load
  avail=$(awk '/MemAvailable/ {printf "%d", $2/1048576}' /proc/meminfo)
  swap=$(awk '/SwapTotal/ {t=$2} /SwapFree/ {f=$2} END {printf "%d", (t-f)/1048576}' /proc/meminfo)
  load=$(awk '{printf "%d", $1}' /proc/loadavg)
  # Swap only counts when memory is also getting low: stale pages linger in swap after a spike.
  [ "$avail" -ge "$MIN_AVAIL_GB" ] && [ "$load" -le "$MAX_LOAD" ] && { [ "$avail" -ge 12 ] || [ "$swap" -le "$MAX_SWAP_GB" ]; }
}
start=$(date +%s)
echo "[heavy] waiting for a slot (max $SLOTS)..." >&2
got=""
while [ -z "$got" ]; do
  for i in $(seq 1 "$SLOTS"); do
    exec 9>"/tmp/mrmas-heavy.$i.lock"
    if flock -n 9; then got=$i; break; fi
    exec 9>&-
  done
  if [ -z "$got" ]; then
    [ $(( $(date +%s) - start )) -ge "$WAIT" ] && { echo "[heavy] no slot free after ${WAIT}s" >&2; exit 75; }
    sleep 15
  fi
done
echo "[heavy] got slot $got" >&2
until ok; do
  [ $(( $(date +%s) - start )) -ge "$WAIT" ] && { echo "[heavy] machine still busy after ${WAIT}s (avail/swap/load); aborting" >&2; exit 75; }
  echo "[heavy] machine busy; re-checking in 30 s" >&2; sleep 30
done
echo "[heavy] running: $*" >&2
nice -n 15 ionice -c3 "$@"
