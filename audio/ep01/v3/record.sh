#!/usr/bin/env bash
# Ep1 v3 takes (pass v3-lock, PLAN.md S2): fastrec, one run per segment, into audio/ep01/v3/<seg>/.
# Run from anywhere, through the laptop guard:   bash ops/heavy.sh bash audio/ep01/v3/record.sh [seg ...]
# Re-running resumes (finished lines are skipped); add FORCE="id ..." to re-read lines.
# Then: python3 audio/ep01/v3/takes.py assemble   (-> <seg>/lines-v3.json, with the reused sample takes)
set -euo pipefail
cd "$(dirname "$0")/../../.."
PY=audio/.venv-casting/bin/python
T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
segs=("$@"); [ ${#segs[@]} -eq 0 ] && segs=(act1 act2 act3 act4 tag)
for s in "${segs[@]}"; do
  [ -f audio/ep01/v3/$s/lines-in.json ] || continue
  echo "== $s"
  extra=()
  [ -n "${FORCE:-}" ] && extra=(--force $FORCE)
  HF_HUB_OFFLINE=1 OMP_NUM_THREADS=3 $PY $T record --lines audio/ep01/v3/$s/lines-in.json --out audio/ep01/v3/$s \
    --workers 2 --threads 3 "${extra[@]}"
done
