#!/bin/bash
# MR. MAS - style-range Prototype 1: build everything into out/range/ (run from studio/).
#   src/dev/range/p1/tools/build.sh <scratch dir>
# 1 bundle  2 render silent (CPU, --concurrency=4)  3 temp sound (OST engine, read-only)  4 mux (bundled ffmpeg)
# 5 key stills + contact sheet pulled from the ENCODED mp4.  Scratch frames are deleted at the end.
set -euo pipefail
S=${1:?scratch dir}
ROOT=$(cd ../ && pwd)
OUT=$ROOT/out/range
FF=$ROOT/studio/node_modules/@remotion/compositor-linux-x64-gnu
PY=$ROOT/audio/.venv-mix/bin/python
mkdir -p $OUT $S
rm -rf $S/bundle
npx remotion bundle src/dev/range/p1/entry.tsx --out-dir=$S/bundle --log=error
T0=$(date +%s)
npx remotion render $S/bundle range-p1 $S/p1-silent.mp4 --concurrency=4 --crf=16 --timeout=180000 --log=error
T1=$(date +%s)
echo "render: $((T1 - T0)) s for 480 frames"
OST_WORKERS=4 ../audio/.venv-theme/bin/python src/dev/range/p1/tools/sound.py $S/p1-sound.wav $S
LD_LIBRARY_PATH=$FF $FF/ffmpeg -v error -y -i $S/p1-silent.mp4 -i $S/p1-sound.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest $OUT/p1.mp4
npx remotion still $S/bundle range-p1-keytest $OUT/p1-keytest.png --log=error
# key stills and the sheet, from the encoded file
rm -rf $S/frames; mkdir -p $S/frames
grab() { LD_LIBRARY_PATH=$FF $FF/ffmpeg -v error -y -ss $(python3 -c "print(max(0, $1 / 24 - 0.002))") -i $OUT/p1.mp4 -frames:v 1 $2; }
rm -f $OUT/p1-key-*.png
grab 80 $OUT/p1-key-1-hotspot-p080.png
grab 128 $OUT/p1-key-2-eyes-p128.png
grab 238 $OUT/p1-key-3-the-read-p238.png
grab 324 $OUT/p1-key-4-the-blank-p324.png
grab 392 $OUT/p1-key-5-the-machine-p392.png
grab 445 $OUT/p1-key-6-look-at-mas-p445.png
for f in 0 30 60 86 97 110 118 120 136 150 180 195 210 225 260 300 322 350 359 360 366 376 395 406 416 438 460 468; do grab $f $S/frames/f$(printf %03d $f).png; done
$PY src/dev/range/p1/tools/sheet.py $OUT/p1-sheet.png $S/frames
$PY src/dev/range/p1/tools/sheet.py $OUT/p1-sheet-blind.png $S/frames blind
rm -rf $S/frames $S/bundle
echo done
