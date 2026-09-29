#!/bin/bash
# MR. MAS — style-jump prototype 1 (J1 "CANCELLED"): render the picture, build the temp sound pass, mux with the
# bundled ffmpeg, and write the key stills. Run from studio/:
#   bash src/dev/jumps/proto1/tools/build.sh
# Output (1920 x 1080, 24 fps, never --scale):
#   ../out/lookdev/jumps/proto1.mp4                  the clip with sound
#   ../out/lookdev/jumps/proto1-key-{1..4}-p*.png    the four key stills
#   ../out/lookdev/jumps/proto1-sheet.png            contact sheet (key stills + the transition frames)
#   ../out/lookdev/jumps/proto1-steppop.mp4          A/B (silent, full clip): the in as a family step k 2 instead of the print pop
# The vignette's engraved bust is generated offline (not by this script) into ../bustArt.ts; after changing it run
#   ../audio/.venv-mix/bin/python src/dev/jumps/proto1/tools/engrave_bust.py [preview.png] [scale]
# The pixel frames come from the frozen lock-v2 composer (../lockv2.ts), not the live Act Four animatic.
set -euo pipefail
cd "$(dirname "$0")/../../../../.."   # studio/
OUT=../out/lookdev/jumps
TMP=${TMPDIR:-/tmp}/mrmas-jump-proto1
FF=node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
ENTRY=src/dev/jumps/proto1/entry.tsx
mkdir -p "$OUT" "$TMP"

npx remotion bundle $ENTRY --out-dir="$TMP/bundle" --log=error >/dev/null
npx remotion render "$TMP/bundle" jump-proto-1 "$TMP/proto1-silent.mp4" --crf=14 --concurrency=6 --log=error
../audio/.venv-mix/bin/python src/dev/jumps/proto1/tools/sound.py "$TMP/proto1-sound.wav"
$FF -y -loglevel error -i "$TMP/proto1-silent.mp4" -i "$TMP/proto1-sound.wav" -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT/proto1.mp4"

# key stills: the arrow on Cancel (pixel) · the certificate whole · CANCELLED + his pupil step · the snap (scar row)
i=1
for f in 48 68 96 108; do
  npx remotion still "$TMP/bundle" jump-proto-1 "$OUT/proto1-key-$i-p$f.png" --frame=$f --log=error
  i=$((i + 1))
done
rm -f "$TMP"/t-p*.png   # the sheet globs these: never let a stale frame from an earlier build in
# transition frames for the sheet: the click, the flash, the certificate whole, the punch, the snap, the exit (the
# tile falling through its slot, the slot empty, the ranks closed), the [CU]
for f in 59 60 61 63 74 75 104 105 110 114 116 120; do
  npx remotion still "$TMP/bundle" jump-proto-1 "$TMP/t-p$f.png" --frame=$f --log=error
done
npx remotion render "$TMP/bundle" jump-proto-1-steppop "$OUT/proto1-steppop.mp4" --crf=16 --concurrency=6 --log=error
python3 src/dev/jumps/proto1/tools/sheet.py "$OUT" "$TMP"
echo "done: $OUT/proto1.mp4"
