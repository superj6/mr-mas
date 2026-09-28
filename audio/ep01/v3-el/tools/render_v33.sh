#!/usr/bin/env bash
# v3.3: every line of show/reel/ep01-v33/, set A (Mas = Jeremy, candidate C), dialogue -16 / V.O. -18 LUFS; the lock's
# eight cut lines are skipped here and cut by el_cut.py from the EL source takes (run from the repo root, in ops/heavy.sh)
set -uo pipefail
cd /home/jgon/project/art/mrmas
export HF_HUB_OFFLINE=1
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
REUSE="audio/ep01/v3-el/sample audio/ep01/v3-el/auditions audio/ep01/v3-el/auditions/principals"
for s in coldopen act1 act2 act3 act4 tag; do REUSE="$REUSE audio/ep01/v3-el/ep01/$s audio/ep01/v3-el/ep01-v31/$s audio/ep01/v3-el/ep01-v32/$s"; done
SKIP=v31-a1-0007,v31-a2-0001,v31-a2-0002,v31-a3-0001,v31-a3-0002,v31-a4-0001,v31-a4-0005,v31-a4-0007,v32-a1-0001,v32-a1-0006,v32-a2-0002,v33-a4-0002
declare -A CAP=([coldopen]=100 [act1]=300 [act2]=300 [act3]=300 [act4]=400 [tag]=100)
for s in ${SEGS:-coldopen act1 act2 act3 act4 tag}; do
  $PY $T render --lines show/reel/ep01-v33/ep01-v33-$s.json --out audio/ep01/v3-el/ep01-v33/$s --sets A --target-lufs -16 --vo-lufs -18 \
      --reuse $REUSE --skip $SKIP --max-chars ${CAP[$s]} --retry-bad 1 --retry-pitch ${EXTRA:-}
done
$PY audio/ep01/v3-el/tools/el_cut.py --lock v33
