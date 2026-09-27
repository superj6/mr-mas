#!/bin/bash
# MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): build everything into out/range/ep1/ (run from studio/).
#   src/dev/range/ep1-p3/tools/build.sh <scratch dir> [--no-sound]
# 0 the timing lock (data.ts)  1 bundle  2 render silent (CPU, --concurrency=4)  3 sound (the v5 bed re-run read-only +
# the additions; the OST engine for the Rhodes)  4 the subtitle track (tools/subs.py)  5 mux (bundled ffmpeg: picture,
# sound, and the subtitles as a soft mov_text stream, default on)  6 three key stills (p250, p318, p360) + the contact
# sheet + the blind sheet, all pulled from the ENCODED mp4.  Scratch frames and the bundle are deleted at the end.
set -euo pipefail
S=${1:?scratch dir}
ROOT=$(cd ../ && pwd)
OUT=$ROOT/out/range/ep1
FF=$ROOT/studio/node_modules/@remotion/compositor-linux-x64-gnu
PYM=$ROOT/audio/.venv-mix/bin/python
PYT=$ROOT/audio/.venv-theme/bin/python
mkdir -p $OUT $S
python3 src/dev/range/ep1-p3/tools/lock.py
rm -rf $S/bundle
npx remotion bundle src/dev/range/ep1-p3/entry.tsx --out-dir=$S/bundle --log=error
T0=$(date +%s)
npx remotion render $S/bundle ep1-p3 $S/ep1-p3-silent.mp4 --concurrency=4 --crf=16 --timeout=180000 --log=error
T1=$(date +%s)
echo "render: $((T1 - T0)) s for 437 frames"
if [ "${2:-}" != "--no-sound" ]; then
  $PYT src/dev/range/ep1-p3/tools/sound.py $S/ep1-p3-sound.wav $S
fi
python3 src/dev/range/ep1-p3/tools/subs.py $S/ep1-p3.srt > /dev/null
LD_LIBRARY_PATH=$FF $FF/ffmpeg -v error -y -i $S/ep1-p3-silent.mp4 -i $S/ep1-p3-sound.wav -i $S/ep1-p3.srt \
  -map 0:v -map 1:a -map 2:s -c:v copy -c:a aac -b:a 256k -c:s mov_text -metadata:s:s:0 language=eng \
  -disposition:s:0 default -t $(python3 -c "print(437 / 24)") $OUT/ep1-p3.mp4
# key stills and the sheets, from the encoded file
rm -rf $S/frames; mkdir -p $S/frames
grab() { LD_LIBRARY_PATH=$FF $FF/ffmpeg -v error -y -ss $(python3 -c "print(max(0, $1 / 24 - 0.002))") -i $OUT/ep1-p3.mp4 -frames:v 1 $2; }
rm -f $OUT/ep1-p3-key-*.png
grab 250 $OUT/ep1-p3-key-1-below-p250.png
grab 318 $OUT/ep1-p3-key-2-landlord-p318.png
grab 360 $OUT/ep1-p3-key-3-hello-p360.png
for f in 0 60 119 120 160 230 246 249 252 256 269 272 276 292 296 300 304 308 318 326 354 388 389 400 436; do grab $f $S/frames/f$(printf %03d $f).png; done
$PYM src/dev/range/ep1-p3/tools/sheet.py $OUT/ep1-p3-sheet.png $S/frames
$PYM src/dev/range/ep1-p3/tools/sheet.py $OUT/ep1-p3-sheet-blind.png $S/frames blind
rm -rf $S/frames $S/bundle
ls -la $OUT/ep1-p3*
echo done
