#!/usr/bin/env bash
# Ep1 v3, the v3-assemble pass: re-lock every segment on its ElevenLabs-timed timeline with the pixel pipeline's own
# lock.py, each with the flags its shots pass used (full-v3/shots-<seg>.md), but:
#   --timeline  the EL timeline;   --takes  assembly/el[-vNN]/<seg>-takes.json (tools/el_takes.py: the EL takes + mouths);
#   --mix       the EL final mix (for the length check);   --ep-in  the EL episode's frame;
#   --out-json / --out-ts  assembly/el[-vNN]/ (so the Kokoro locks and every <seg>/data.ts stay as they are).
# Light (about a second each). From anywhere:
#   bash show/episodes/ep01/production/full-v3/assembly/tools/el_lock.sh [seg ...]            the v3 lock  -> assembly/el/
#   LOCK=v31 bash .../el_lock.sh [seg ...]    the v3.1 lock -> assembly/el-v31/;   LOCK=v32 -> assembly/el-v32/, and so on
# For v3.1 and later the --ep-in values are computed from the EL timelines (the cold open, then the 30 s intro = 720 f and
# the 2 s card = 48 f, then the acts), with the stick reel's own frame rounding.
set -euo pipefail
cd /home/jgon/project/art/mrmas
LOCKV=${LOCK:-v3}
LOCKPY=studio/src/episodes/ep01/pixel/tools/lock.py
declare -A LABEL=([coldopen]='COLD OPEN' [act1]='ACT ONE' [act2]='ACT TWO' [act3]='ACT THREE' [act4]='ACT FOUR' [tag]='TAG')
if [ "$LOCKV" = v3 ]; then
  EL=show/episodes/ep01/production/full-v3/assembly/el; TL=show/reel/ep01-v3-el/ep01-v3-el; MIX=out/ep01/full-v3/mix-el
  declare -A EPIN=([coldopen]=0 [act1]=1489 [act2]=9588 [act3]=14321 [act4]=17329 [tag]=30354)   # cold open 721 + intro 720 + card 48
else
  EL=show/episodes/ep01/production/full-v3/assembly/el-$LOCKV; TL=show/reel/ep01-$LOCKV-el/ep01-$LOCKV-el; MIX=out/ep01/full-v3/mix-$LOCKV-el
  mkdir -p $EL
  declare -A EPIN
  while read -r k v; do EPIN[$k]=$v; done < <(python3 - "$TL" <<'EOF'
import json, math, sys
tl = sys.argv[1]
def frames(s):
    acc, prev = 0.0, 0
    for b in json.load(open(f"{tl}-{s}.json"))["beats"]:
        acc += float(b.get("reelDur") or 3); prev = max(prev + 1, math.floor(acc * 24 + 0.5))
    return prev
at = 0
for s in ["coldopen", "act1", "act2", "act3", "act4", "tag"]:
    print(s, at)
    at += frames(s) + (720 + 48 if s == "coldopen" else 0)
EOF
)
fi
for s in "${@:-coldopen act1 act2 act3 act4 tag}"; do
  for seg in $s; do
    extra=()
    [ "$seg" = act4 ] && extra=(--plan studio/src/episodes/ep01/pixel/act4/plan.json)
    MIXARG=(--mix $MIX/$seg-mix.wav --mix-offset 0)
    [ -f $MIX/$seg-mix.wav ] || { echo "   (no $MIX/$seg-mix.wav yet: locked without --mix)"; MIXARG=(); }
    echo "== $seg ($LOCKV, ep-in ${EPIN[$seg]})"
    python3 $LOCKPY --seg "$seg" --timeline $TL-$seg.json --takes $EL/$seg-takes.json \
      "${MIXARG[@]}" --ep-in "${EPIN[$seg]}" --label "${LABEL[$seg]}" \
      --out-json $EL/lock-$seg.json --out-ts $EL/data-$seg.ts "${extra[@]}"
  done
done
