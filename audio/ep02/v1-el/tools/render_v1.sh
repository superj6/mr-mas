#!/usr/bin/env bash
# Ep2 v1: every line of the beat plans (show/episodes/ep02/production/v1/beat-plan/<seg>.json), set A, through the Ep2 EL
# route (pipeline.md §2; cast.md §6 step 4): dialogue -16 / V.O. -18 LUFS, dry, into audio/ep02/v1-el/ep02-v1/<seg>/.
#   1. el_render.py per segment: every ElevenLabs line at its role's settings (cast-el.json: Ep1's carried voices
#      unchanged, the new roles at their picked settings, line_settings for the reads a brief asks for). Cached requests
#      (the casting pass's auditioned lines, Ep1's cache) are never sent again. The special lines are skipped here:
#        cut      e2-a1-0026, e2-a1-0047 (from Ep2 takes), e2-a3-0008 (Ep1's e1-a1-5-13)   -> el_cut.py
#        crowd    e2-a3-0010 (ten layered library reads)                                     -> el_crowd.py
#        sung     e2-a2-0030 (Maya through the intro's sung-vocal pipeline)                  -> el_sung.py
#        kokoro   MARIO's six lines (am_liam, a-liam-earnest, fastrec)                       -> el_mario.py
#   2. el_qa.py: every take measured (ASR against the text, names by forced choice, length against the plan's slot and
#      the tempo marks, clipping, noise floor, loudness, pitch); a failure is retaken (at most 3 retakes a line, then
#      flagged); the pick is written into the manifest, so a later el_render run keeps it.
#   3. the special lines, added to each segment's lines-A.json (el_render rewrites lines-A.json without them, so this
#      script runs them after every render), then el_qa.py's measure of them and the report (takes-qa.md).
# Run from the repo root, through the laptop guard:
#   bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh            # everything (only new or changed lines send)
#   SEGS="act3" bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh
#   STEPS="special qa report" ...                                          # some steps: render qa special report
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
set -uo pipefail
cd "$REPO"
export HF_HUB_OFFLINE=1
PY=audio/.venv-casting/bin/python
T=audio/ep02/v1-el/tools
BP=show/episodes/ep02/production/v1/beat-plan
OUT=audio/ep02/v1-el/ep02-v1
SKIP=e2-a1-0026,e2-a1-0047,e2-a3-0008,e2-a3-0010,e2-a2-0030,e2-a4-0009,e2-a4-0011,e2-a4-0012,e2-a4-0013,e2-a4-0015,e2-a4-0016
declare -A CAP=([coldopen]=400 [act1]=3600 [act2]=2000 [act3]=1000 [act4]=1600 [tag]=100)
STEPS=${STEPS:-render qa special report}
SEGS=${SEGS:-coldopen act1 act2 act3 act4 tag}
has() { [[ " $STEPS " == *" $1 "* ]]; }
if has render; then
  for s in $SEGS; do
    $PY $T/el_render.py render --lines $BP/$s.json --out $OUT/$s --sets A --target-lufs -16 --vo-lufs -18 \
        --skip $SKIP --max-chars ${CAP[$s]} ${EXTRA:-} || exit 1
  done
fi
if has qa; then
  # e2-a3-0014 (EKIEL, "Nobody knows how to do this yet."): the casting pass's note asked for one more read (its
  # audition take ran 1.52 s against the plan's 2.73 at speed 0.80); the passing read nearer the plan is kept
  $PY $T/el_qa.py retake --segs $SEGS --force e2-a3-0014 ${QA_EXTRA:-} || exit 1
fi
if has special; then
  $PY $T/el_cut.py || exit 1
  $PY $T/el_crowd.py || exit 1
  $PY $T/el_sung.py || exit 1
  $PY $T/el_mario.py || exit 1
fi
if has report; then
  $PY $T/el_qa.py measure --segs coldopen act1 act2 act3 act4 tag || exit 1
  $PY $T/el_qa.py report || exit 1
fi
