#!/usr/bin/env bash
# v3.1: every line of show/reel/ep01-v31/, set A (Mas = Jeremy, candidate C), dialogue -16 / V.O. -18 LUFS; the lock's
# eight cut lines are skipped here and cut by el_cut.py from the EL source takes (run from the repo root, in ops/heavy.sh)
set -uo pipefail
cd /home/jgon/project/art/mrmas
export HF_HUB_OFFLINE=1
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
REUSE="audio/ep01/v3-el/sample audio/ep01/v3-el/auditions audio/ep01/v3-el/auditions/principals"
for s in coldopen act1 act2 act3 act4 tag; do REUSE="$REUSE audio/ep01/v3-el/ep01/$s"; done
SKIP=v31-a1-0007,v31-a2-0001,v31-a2-0002,v31-a3-0001,v31-a3-0002,v31-a4-0001,v31-a4-0005,v31-a4-0007
declare -A CAP=([coldopen]=100 [act1]=1200 [act2]=600 [act3]=500 [act4]=1800 [tag]=300)
for s in ${SEGS:-coldopen act1 act2 act3 act4 tag}; do
  $PY $T render --lines show/reel/ep01-v31/ep01-v31-$s.json --out audio/ep01/v3-el/ep01-v31/$s --sets A --target-lufs -16 --vo-lufs -18 \
      --reuse $REUSE --skip $SKIP --max-chars ${CAP[$s]} --retry-bad 1 --retry-pitch ${EXTRA:-}
done
$PY audio/ep01/v3-el/tools/el_cut.py
