#!/usr/bin/env bash
# Ep1 v3, the v3-assemble pass: re-lock every segment on its ElevenLabs-timed timeline (show/reel/ep01-v3-el/) with the
# pixel pipeline's own lock.py, each with the flags its shots pass used (full-v3/shots-<seg>.md), but:
#   --timeline  the EL timeline;   --takes  assembly/el/<seg>-takes.json (tools/el_takes.py: the EL takes + mouth tracks);
#   --mix       the EL final mix (out/ep01/full-v3/mix-el/<seg>-mix.wav) for the length check;   --ep-in  the EL episode;
#   --out-json / --out-ts  assembly/el/ (so the Kokoro locks and every <seg>/data.ts stay as they are).
# Light (about a second each). From anywhere:  bash show/episodes/ep01/production/full-v3/assembly/tools/el_lock.sh [seg ...]
set -euo pipefail
cd /home/jgon/project/art/mrmas
EL=show/episodes/ep01/production/full-v3/assembly/el
LOCK=studio/src/episodes/ep01/pixel/tools/lock.py
declare -A EPIN=([coldopen]=0 [act1]=1489 [act2]=9588 [act3]=14321 [act4]=17329 [tag]=30354)   # cold open 721 + intro 720 + card 48, then the acts
declare -A LABEL=([coldopen]='COLD OPEN' [act1]='ACT ONE' [act2]='ACT TWO' [act3]='ACT THREE' [act4]='ACT FOUR' [tag]='TAG')
for s in "${@:-coldopen act1 act2 act3 act4 tag}"; do
  for seg in $s; do
    extra=()
    [ "$seg" = act4 ] && extra=(--plan studio/src/episodes/ep01/pixel/act4/plan.json)
    echo "== $seg"
    python3 $LOCK --seg "$seg" --timeline show/reel/ep01-v3-el/ep01-v3-el-$seg.json --takes $EL/$seg-takes.json \
      --mix out/ep01/full-v3/mix-el/$seg-mix.wav --mix-offset 0 --ep-in "${EPIN[$seg]}" --label "${LABEL[$seg]}" \
      --out-json $EL/lock-$seg.json --out-ts $EL/data-$seg.ts "${extra[@]}"
  done
done
