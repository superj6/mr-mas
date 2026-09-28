#!/usr/bin/env bash
# MR. MAS: CLOD look-dev (a test, not the episode). Re-runs every deliverable into out/lookdev/clod-3d/.
# From the repo root:   studio/src/dev/blender/clod/run.sh [turnaround] [clip] [pane] [plates] [composite] [clean]
# (no steps = all of them, in that order). Every render goes through ops/heavy.sh, one at a time.
# Env: BLENDER (default ~/Downloads/blender-4.5.3-linux-x64/blender), LOCK (default the full-v3 act1 lock),
#      SHOT (11.04), SAMPLES_STILL (128), SAMPLES_CLIP (48), SAMPLES_PANE (64).
# Small timing logs are kept in out/lookdev/clod-3d/logs/; 'clean' deletes out/lookdev/clod-3d/tmp/ entirely.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../../../../.." && pwd)
cd "$REPO"
B=${BLENDER:-/home/jgon/Downloads/blender-4.5.3-linux-x64/blender}
PY=$(dirname "$B")/4.5/python/bin/python3.11
FFD=studio/node_modules/@remotion/compositor-linux-x64-gnu
ff() { LD_LIBRARY_PATH=$FFD nice -n 15 "$FFD/ffmpeg" -hide_banner -loglevel error "$@"; }
H=$REPO/ops/heavy.sh
HERE=studio/src/dev/blender/clod
OUT=out/lookdev/clod-3d
W=$OUT/tmp/work
LOCK=${LOCK:-show/episodes/ep01/production/full-v3/lock/act1.json}
SHOT=${SHOT:-11.04}
TAKE=audio/ep01/act1/dialogue/fast-v1/wav/e1-a1-11-02.wav      # CLOD's Kokoro take, "You're absolutely right!"
MIX=out/ep01/full-v3/picture/act1-v34-stick-mix.wav              # the act's temp track, as muxed into act1.mp4
mkdir -p "$W" "$OUT/logs"
steps=("$@")
[ ${#steps[@]} -eq 0 ] && steps=(turnaround clip pane plates composite)
# the mock-up's window: 50 frames of 11.03's tail, all of 11.04, 24 frames of the cut to 12.01
read -r S0 E0 < <(python3 -c "import json;s=[x for x in json.load(open('$LOCK'))['shots'] if x['id']=='$SHOT'][0];print(s['s'],s['e'])")
FROM=$((S0 - 50)); TO=$((E0 + 24))

for step in "${steps[@]}"; do
  case $step in
  turnaround)
    $H "$B" -b --factory-startup --python $HERE/turnaround.py -- --out $OUT/clod-turnaround.png \
      --engine CYCLES --key 75 --samples "${SAMPLES_STILL:-128}" --log $OUT/logs/turnaround-log.json ;;
  clip)
    rm -rf $W/clip
    $H "$B" -b --factory-startup --python $HERE/nod_clip.py -- --outdir $W/clip --samples "${SAMPLES_CLIP:-48}"
    # 48 drawings at 12 fps -> 24 fps (each drawing held two frames); the take starts on frame 14 (0.583 s)
    DELAY=$(python3 -c "import json;print(round(json.load(open('$W/clip/clip-log.json'))['audio_delay_frames']*1000/24))")
    $H env LD_LIBRARY_PATH=$FFD "$FFD/ffmpeg" -hide_banner -loglevel error -y -framerate 12 -i $W/clip/f%03d.png -i $TAKE \
      -filter_complex "[1:a]adelay=${DELAY},apad,pan=stereo|c0=c0|c1=c0,aresample=48000[a]" -map 0:v -map '[a]' \
      -r 24 -c:v libx264 -preset medium -crf 16 -tune animation -pix_fmt yuv420p -threads 2 -c:a aac -b:a 192k -t 4 \
      -movflags +faststart $OUT/clod-nod-absolutely-right.mp4
    cp $W/clip/f018.png $OUT/clod-nod-squash-accent.png           # drawing 18 (frames 36-37): the squash's bottom on "AB-"
    cp $W/clip/clip-log.json $OUT/logs/clip-log.json
    rm -f $W/clip/f*.png ;;
  pane)
    rm -rf $W/pane
    $H "$B" -b --factory-startup --python $HERE/pane_insert.py -- --outdir $W/pane --lock $LOCK --shot $SHOT \
      --samples "${SAMPLES_PANE:-64}"
    cp $W/pane/pane-log.json $OUT/logs/pane-log.json ;;
  plates)
    (cd studio && node src/dev/blender/clod/plate-build.mjs act1 "$REPO/$W/r-act1-plate.cjs" --plate \
      && node src/dev/blender/clod/plate-build.mjs act1 "$REPO/$W/r-act1-real.cjs")
    rm -rf $W/plate $W/real; mkdir -p $W/plate $W/real
    FR=$(seq $FROM $((TO - 1)) | tr '\n' ' ')
    (cd studio && $H node "$REPO/$W/r-act1-plate.cjs" native "$REPO/$W/plate" $FR > /dev/null \
      && $H node "$REPO/$W/r-act1-real.cjs" native "$REPO/$W/real" $FR > /dev/null) ;;
  composite)
    rm -rf $W/comp
    $H "$PY" $HERE/composite.py --real $W/real --plate $W/plate --pane $W/pane --out $W/comp --from $FROM --to $TO \
      --stills "$((S0 + 20)),$((S0 + 40)),$((S0 + 90)),$((S0 + 140))"
    $H env LD_LIBRARY_PATH=$FFD "$FFD/ffmpeg" -hide_banner -loglevel error -y -framerate 24 -i $W/comp/c%05d.png \
      -ss "$(python3 -c "print($FROM/24)")" -t "$(python3 -c "print(($TO-$FROM)/24)")" -i $MIX -map 0:v -map 1:a \
      -c:v libx264 -preset medium -crf 16 -tune animation -pix_fmt yuv420p -threads 2 -c:a aac -b:a 192k -ac 2 -ar 48000 \
      -movflags +faststart $OUT/clod-in-episode-11.04-mockup.mp4
    for f in $W/comp/still-*.png; do cp "$f" "$OUT/clod-in-episode-$(basename "$f" .png | sed 's/still-/f/').png"; done
    "$PY" $HERE/sheet.py --comp $W/comp --out $OUT/clod-in-episode-sheet.png --from $FROM --pick "$((S0 - 10)),$((S0 + 8)),$((S0 + 14)),$((S0 + 30)),$((S0 + 60)),$((S0 + 90)),$((S0 + 130)),$((S0 + 200))"
    rm -f $W/comp/c*.png ;;
  clean)
    rm -rf "$OUT/tmp" ;;
  *) echo "unknown step $step"; exit 2 ;;
  esac
done
