#!/usr/bin/env bash
# v3.5: every line of show/reel/ep01-v35/, set A (Mas = Jeremy, candidate C; Sirrah = Ida, candidate B; AUHSOJ cast in
# phase 10), dialogue -16 / V.O. -18 LUFS. MARIO is cast on Kokoro from v35 on (cast-el.json engine): his rows copy his
# Kokoro takes and send nothing. The lock's cut lines are skipped here and cut by el_cut.py from the EL source takes.
# NEW=1: only the writer's new v3.5 takes (audio/ep01/v35/<seg>/lines-v35.json), before the lock exists (phase 10).
# Run from the repo root, in ops/heavy.sh. SEGS="act4" limits it; EXTRA="--retake <id>" adds a listening note's retake.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
set -uo pipefail
cd "$REPO"
export HF_HUB_OFFLINE=1
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
REUSE="audio/ep01/v3-el/sample audio/ep01/v3-el/auditions audio/ep01/v3-el/auditions/principals audio/ep01/v3-el/auditions/sirrah/round2"
for s in coldopen act1 act2 act3 act4 tag; do REUSE="$REUSE audio/ep01/v3-el/ep01/$s audio/ep01/v3-el/ep01-v31/$s audio/ep01/v3-el/ep01-v32/$s audio/ep01/v3-el/ep01-v33/$s audio/ep01/v3-el/ep01-v34/$s"; done
SKIP=v31-a1-0007,v31-a2-0001,v31-a2-0002,v31-a3-0001,v31-a3-0002,v31-a4-0001,v31-a4-0005,v31-a4-0007,v32-a1-0001,v32-a1-0006,v32-a2-0002,v33-a4-0002,v35-a4-0008
declare -A CAP=([coldopen]=100 [act1]=1000 [act2]=700 [act3]=300 [act4]=700 [tag]=100)
if [ -n "${NEW:-}" ]; then
  for s in ${SEGS:-act1 act2 act4}; do
    $PY $T render --lines audio/ep01/v35/$s/lines-v35.json --lock v35 --out audio/ep01/v3-el/ep01-v35/$s --sets A \
        --target-lufs -16 --vo-lufs -18 --reuse $REUSE --skip $SKIP --max-chars ${CAP[$s]} --retry-bad 1 --retry-pitch ${EXTRA:-}
  done
else
  for s in ${SEGS:-coldopen act1 act2 act3 act4 tag}; do
    $PY $T render --lines show/reel/ep01-v35/ep01-v35-$s.json --out audio/ep01/v3-el/ep01-v35/$s --sets A --target-lufs -16 --vo-lufs -18 \
        --reuse $REUSE --skip $SKIP --max-chars ${CAP[$s]} --retry-bad 1 --retry-pitch ${EXTRA:-}
  done
fi
$PY audio/ep01/v3-el/tools/el_cut.py --lock v35
