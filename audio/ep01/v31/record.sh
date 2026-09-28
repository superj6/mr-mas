#!/usr/bin/env bash
# Ep1 v3.1 takes (pass v3-lock): fastrec, one run per segment, into audio/ep01/v31/<seg>/.
# Run through the laptop guard:   bash ops/heavy.sh bash audio/ep01/v31/record.sh [seg ...]
# (the cast is audio/ep01/v31/cast-v31.json: the registry plus ELGOOG'S DEMO's stock voice; takes.py plan writes it)
set -euo pipefail
cd "$(dirname "$0")/../../.."
PY=audio/.venv-casting/bin/python
T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
segs=("$@"); [ ${#segs[@]} -eq 0 ] && segs=(act1 act2 act3 act4 tag)
for s in "${segs[@]}"; do
  [ -f audio/ep01/v31/$s/lines-in.json ] || continue
  echo "== $s"
  extra=()
  [ -n "${FORCE:-}" ] && extra=(--force $FORCE)
  HF_HUB_OFFLINE=1 OMP_NUM_THREADS=3 $PY $T record --lines audio/ep01/v31/$s/lines-in.json --out audio/ep01/v31/$s \
    --workers 2 --threads 3 --cast audio/ep01/v31/cast-v31.json "${extra[@]}"
done
