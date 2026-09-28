#!/usr/bin/env bash
# Ep1 v3, the v3-assemble pass: re-lock every segment on its ElevenLabs-timed timeline with the pixel pipeline's own
# lock.py, each with the flags its shots pass used (full-v3/shots-<seg>.md), but:
#   --timeline  the EL timeline;   --takes  assembly/el[-v31]/<seg>-takes.json (tools/el_takes.py: the EL takes + mouths);
#   --mix       the EL final mix (for the length check);   --ep-in  the EL episode's frame;
#   --out-json / --out-ts  assembly/el[-v31]/ (so the Kokoro locks and every <seg>/data.ts stay as they are).
# Light (about a second each). From anywhere:
#   bash show/episodes/ep01/production/full-v3/assembly/tools/el_lock.sh [seg ...]            the v3 lock  -> assembly/el/
#   LOCK=v31 bash show/episodes/ep01/production/full-v3/assembly/tools/el_lock.sh [seg ...]   the v3.1 lock -> assembly/el-v31/
set -euo pipefail
cd /home/jgon/project/art/mrmas
LOCKV=${LOCK:-v3}
LOCKPY=studio/src/episodes/ep01/pixel/tools/lock.py
declare -A LABEL=([coldopen]='COLD OPEN' [act1]='ACT ONE' [act2]='ACT TWO' [act3]='ACT THREE' [act4]='ACT FOUR' [tag]='TAG')
if [ "$LOCKV" = v31 ]; then
  EL=show/episodes/ep01/production/full-v3/assembly/el-v31; TL=show/reel/ep01-v31-el/ep01-v31-el; MIX=out/ep01/full-v3/mix-v31-el
  # the EL v3.1 episode: cold open 583 + intro 720 + card 48, then 8290, 4645, 3436, 12701
  declare -A EPIN=([coldopen]=0 [act1]=1351 [act2]=9641 [act3]=14286 [act4]=17722 [tag]=30423)
else
  EL=show/episodes/ep01/production/full-v3/assembly/el; TL=show/reel/ep01-v3-el/ep01-v3-el; MIX=out/ep01/full-v3/mix-el
  declare -A EPIN=([coldopen]=0 [act1]=1489 [act2]=9588 [act3]=14321 [act4]=17329 [tag]=30354)   # cold open 721 + intro 720 + card 48
fi
for s in "${@:-coldopen act1 act2 act3 act4 tag}"; do
  for seg in $s; do
    extra=()
    [ "$seg" = act4 ] && extra=(--plan studio/src/episodes/ep01/pixel/act4/plan.json)
    echo "== $seg ($LOCKV)"
    python3 $LOCKPY --seg "$seg" --timeline $TL-$seg.json --takes $EL/$seg-takes.json \
      --mix $MIX/$seg-mix.wav --mix-offset 0 --ep-in "${EPIN[$seg]}" --label "${LABEL[$seg]}" \
      --out-json $EL/lock-$seg.json --out-ts $EL/data-$seg.ts "${extra[@]}"
  done
done
