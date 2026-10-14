#!/usr/bin/env bash
# Ep3 v1: the PIXEL LOCK of every segment on its canonical delivered-take timeline (LEARNINGS R9), with the pixel
# pipeline's own lock.py. A copy of Ep1's (show/episodes/ep01/production/full-v3/assembly/tools/el_lock.sh, locked),
# Ep3 has ONE lock path. The inherited v1-el directory name is a route, not an engine claim: the delivered attempt
# uses Kokoro stock takes because platform review blocked the planned paid pass. The lock is written to the files the
# renderer read, studio/src/episodes/ep03/pixel/<seg>/data.ts and show/episodes/ep03/production/v1/lock/<seg>.json (Ep1
# wrote a second set into assembly/el-vNN/ and redirected the renderer's ./data import with build_el.mjs; Ep3 needs neither).
#   --timeline  show/reel/ep03-v1-el/ep03-v1-el-<seg>.json (audio/ep03/v1-el/tools/el_lock.py)
#   --takes     assembly/el-v1/<seg>-takes.json (tools/el_takes.py: the EL takes with mouth tracks)
#   --mix       out/ep03/v1/mix/<seg>-mix.wav when it exists (the length check)
#   --ep-in     the episode frame: the cold open, then the 30 s intro (720 f) and the 2 s card (48 f), then the acts
# Light (about a second each). From anywhere:
#   bash show/episodes/ep03/production/v1/assembly/tools/el_lock.sh [seg ...]
#   KOKORO=1 bash .../el_lock.sh [seg ...]   the Kokoro base lock instead (show/reel/ep03-v1/, the timeline's own takes):
#                                            for picture passes before the EL takes exist; the EL lock replaces it
#   EP3_LOCK_WITHOUT_MIX=1 ...             a retime before its new mix exists; verify again with the mix afterward
#   LOCK=v2 ...                              a later round (show/reel/ep03-v2-el/, assembly/el-v2/)
# After a re-lock: python3 studio/src/episodes/ep03/pixel/tools/scenes.py <seg> adds a stub for every new scene.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
set -euo pipefail
cd "$REPO"
LOCKV=${LOCK:-v1}
LOCKPY=studio/src/episodes/ep03/pixel/tools/lock.py
P=show/episodes/ep03/production/v1
declare -A LABEL=([coldopen]='COLD OPEN' [act1]='ACT ONE' [act2]='ACT TWO' [act3]='ACT THREE' [act4]='ACT FOUR' [tag]='TAG')
if [ -n "${KOKORO:-}" ]; then TL=show/reel/ep03-$LOCKV/ep03-$LOCKV; else TL=show/reel/ep03-$LOCKV-el/ep03-$LOCKV-el; fi
EL=$P/assembly/el-$LOCKV; MIX=out/ep03/v1/mix
for s in coldopen act1 act2 act3 act4 tag; do [ -f "$TL-$s.json" ] || { echo "no $TL-$s.json: lock that segment first" >&2; exit 2; }; done
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
for s in "${@:-coldopen act1 act2 act3 act4 tag}"; do
  for seg in $s; do
    TAKES=()
    if [ -z "${KOKORO:-}" ]; then
      [ -f "$EL/$seg-takes.json" ] || { echo "no $EL/$seg-takes.json: run tools/el_takes.py $seg first" >&2; exit 2; }
      TAKES=(--takes "$EL/$seg-takes.json")
    fi
    MIXARG=(--mix "$MIX/$seg-mix.wav" --mix-offset 0)
    if [ "${EP3_LOCK_WITHOUT_MIX:-0}" = 1 ]; then
      echo "   (explicit timing rebuild before current mix: locked without --mix)"; MIXARG=()
    elif [ ! -f "$MIX/$seg-mix.wav" ]; then
      echo "   (no $MIX/$seg-mix.wav yet: locked without --mix)"; MIXARG=()
    fi
    echo "== $seg ($LOCKV${KOKORO:+, KOKORO}, ep-in ${EPIN[$seg]})"
    python3 $LOCKPY --seg "$seg" --timeline "$TL-$seg.json" "${TAKES[@]}" "${MIXARG[@]}" --ep-in "${EPIN[$seg]}" \
      --label "${LABEL[$seg]}" --out-json "$P/lock/$seg.json" --out-ts "studio/src/episodes/ep03/pixel/$seg/data.ts"
  done
done
