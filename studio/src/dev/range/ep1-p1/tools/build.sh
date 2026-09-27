#!/bin/bash
# MR. MAS - range E1-P1 (1.A, CLOD under its launch light): the whole build, run from studio/.
#   src/dev/range/ep1-p1/tools/build.sh <scratch dir> [stage ...]
# stages (default: all, in order):
#   voice   the temp takes (stock Kokoro packs, local; tools/voice.py)             -> <S>/vo, gen/takes.json
#   cels    probe the GPU, then every clay cel on the iGPU (--gl=angle)            -> <S>/pub/cels/cel-NNN.png
#   px      the pixel CLOD + the clay's shadows in rungs, from the cels             -> gen/clod-px.json
#   clip    the clip (pixel frame + clay composite), 1080p 24 fps, --concurrency 4  -> <S>/video.mp4
#   sound   the temp sound pass (tools/sound.py)                                   -> <S>/sound.wav
#   mux     video + sound                                                          -> out/range/ep1/ep1-p1.mp4
#   stills  3 key stills, the contact sheet and the blind sheet, from the ENCODED mp4 (full size + 480x270 checks)
set -euo pipefail
S=${1:?scratch dir}; shift
STAGES=${*:-voice cels px clip sound mux stills}
STUDIO=$(pwd)
ROOT=$(cd .. && pwd)
HERE=src/dev/range/ep1-p1
OUT=$ROOT/out/range/ep1
FF=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$FF
mkdir -p $S $OUT
has() { [[ " $STAGES " == *" $1 "* ]]; }
free_gb() { df --output=avail -BG / | tail -1 | tr -dc 0-9; }
[ "$(free_gb)" -lt 5 ] && { echo "under 5 GB free: stopping"; exit 1; }

if has voice; then
  $ROOT/audio/.venv-casting/bin/python $HERE/tools/voice.py $S/vo
  python3 - "$S/vo/takes.json" "$HERE/gen/takes.json" <<'EOF'
import json, sys
d = json.load(open(sys.argv[1]))
json.dump({k: {"frames": v["frames"], "mouth": v["mouth"]} for k, v in d.items()}, open(sys.argv[2], "w"))
EOF
fi
if has cels; then
  rm -rf $S/bundle-cels && npx remotion bundle $HERE/entry.tsx --out-dir=$S/bundle-cels --log=error
  npx remotion still $S/bundle-cels ep1-p1-probe $S/probe.png --gl=angle --log=error
  # the probe writes the renderer string into its frame: cyan text = the Intel iGPU, red = anything else (SwiftShader)
  $ROOT/audio/.venv-mix/bin/python -c "
from PIL import Image; im = Image.open('$S/probe.png').convert('RGB'); px = list(im.getdata())
cy = sum(1 for p in px if p[1] > 180 and p[2] > 170 and p[0] < 160); rd = sum(1 for p in px if p[0] > 200 and p[1] < 110)
print('probe: iGPU' if cy > rd else 'probe: NOT the iGPU'); raise SystemExit(0 if cy > rd else 1)" || { echo "not rendering the cels on this backend"; exit 1; }
  T0=$(date +%s)
  rm -rf $S/cels-raw && npx remotion render $S/bundle-cels ep1-p1-cels $S/cels-raw --sequence --image-format=png --gl=angle --concurrency=1 --timeout=600000 --log=error
  echo "cels: $(( $(date +%s) - T0 )) s"
  rm -rf $S/pub/cels && mkdir -p $S/pub/cels
  for f in $S/cels-raw/element-*.png; do n=$(basename $f .png | sed 's/element-//'); mv $f $S/pub/cels/cel-$(printf %03d $((10#$n))).png; done
  rm -rf $S/cels-raw $S/bundle-cels
fi
if has px; then
  npx esbuild $HERE/tools/pxclod.ts --bundle --platform=node --outfile=$S/pxclod.cjs --log-level=warning
  node $S/pxclod.cjs $S/pub/cels $HERE/gen/clod-px.json
fi
if has clip; then
  rm -rf $S/bundle && npx remotion bundle $HERE/entry.tsx --out-dir=$S/bundle --public-dir=$S/pub --log=error
  T0=$(date +%s)
  npx remotion render $S/bundle ep1-p1 $S/video.mp4 --gl=angle --concurrency=4 --crf=16 --x264-preset=slow --timeout=180000 --log=error
  echo "clip: $(( $(date +%s) - T0 )) s"
fi
if has sound; then
  T0=$(date +%s)
  OST_WORKERS=2 $ROOT/audio/.venv-theme/bin/python $HERE/tools/sound.py $S/sound.wav $S
  echo "sound: $(( $(date +%s) - T0 )) s"
fi
if has mux; then
  $FF/ffmpeg -v error -y -i $S/video.mp4 -i $S/sound.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest $OUT/ep1-p1.mp4
  ls -la $OUT/ep1-p1.mp4
fi
if has stills; then
  rm -rf $S/frames $S/frames-small && mkdir -p $S/frames $S/frames-small
  grab() { $FF/ffmpeg -v error -y -ss $(python3 -c "print(max(0, $1 / 24 - 0.002))") -i $OUT/ep1-p1.mp4 -frames:v 1 $2; }
  rm -f $OUT/ep1-p1-key-*.png
  grab 150 $OUT/ep1-p1-key-1-pixel-clod-p150.png
  grab 268 $OUT/ep1-p1-key-2-launch-p268.png
  grab 452 $OUT/ep1-p1-key-3-the-hold-p452.png
  grab 520 $OUT/ep1-p1-key-4-watching-p520.png
  for f in 0 60 110 150 200 238 239 240 242 244 248 250 256 268 276 290 300 312 330 354 380 400 424 480 500 520 540 560 585 590 599 600 610 659; do grab $f $S/frames/f$(printf %03d $f).png; done
  for p in $S/frames/*.png; do $FF/ffmpeg -v error -y -i $p -vf scale=480:270:flags=area $S/frames-small/$(basename $p); done
  $ROOT/audio/.venv-mix/bin/python $HERE/tools/sheet.py $OUT/ep1-p1-sheet.png $S/frames
  $ROOT/audio/.venv-mix/bin/python $HERE/tools/sheet.py $OUT/ep1-p1-sheet-blind.png $S/frames blind
  $ROOT/audio/.venv-mix/bin/python $HERE/tools/sheet.py $S/sheet-480.png $S/frames-small
fi
echo "done: $STAGES"
