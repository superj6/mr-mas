#!/bin/bash
# range E1-P2 (1.H, WHAT THE QUACK): the whole build, from studio/.
#   src/dev/range/ep1-p2/tools/build.sh <scratch-dir> [take|cycles|sound|render|review|all ...]
# Steps (default: all but cycles):
#   frames  rebuild <scratch>/public/take/ from the kept take-eevee.mp4 (a composite-only re-run without Blender)
#   take    the Blender take, EEVEE Next on the iGPU: <scratch>/public/take/f000..f119.png (1056x592), plus an
#           intermediate encode kept for the outside-layer comparison: out/range/ep1/ep1-p2-inputs/take-eevee.mp4
#   cycles  the two conditioning stills (Cycles, CPU, 1280x720, 256 spp): out/range/ep1/ep1-p2-inputs/cycles-f000.png, -f119.png
#   sound   the temp sound pass for A and B: <scratch>/a.wav, b.wav
#   render  both cuts (CPU composite, --concurrency=4), muxed: out/range/ep1/ep1-p2.mp4 (A), ep1-p2-b.mp4 (B); the matte
#   review  sheets, blind sheets, key stills, measures (all from the encoded mp4s)
# Disk: stops if free space is under 5 GB. The take's PNGs (~110 MB) stay in scratch until you delete the scratch.
set -e
S=${1:?scratch dir}; shift
STEPS=${*:-take sound render review}
STUDIO=/home/jgon/project/art/mrmas/studio
HERE=$STUDIO/src/dev/range/ep1-p2
OUT=/home/jgon/project/art/mrmas/out/range/ep1
IN=$OUT/ep1-p2-inputs
BL=/home/jgon/Downloads/blender-4.5.3-linux-x64/blender
FFD=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$FFD
PY=/home/jgon/project/art/mrmas/audio/.venv-theme/bin/python
mkdir -p "$S/public/take" "$OUT" "$IN"
disk() { local free=$(df -BG --output=avail / | tail -1 | tr -dc 0-9); if [ "$free" -lt 5 ]; then echo "STOP: only ${free} GB free"; exit 3; fi; echo "disk: ${free} GB free"; }
cd $STUDIO
for step in $STEPS; do
  disk
  case $step in
    take)
      T0=$(date +%s)
      $BL -b --factory-startup --python $HERE/blender/duck.py -- --mode eevee --out "$S/public/take" --frames 0-119 --res 1056x592 > "$S/take-log.txt" 2>&1
      echo "take: $(grep -c WROTE "$S/take-log.txt") frames in $(( $(date +%s) - T0 )) s"
      $FFD/ffmpeg -loglevel error -y -framerate 24 -i "$S/public/take/f%03d.png" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p "$IN/take-eevee.mp4"
      ;;
    frames)
      # rebuild the take's PNGs from the kept intermediate encode (no Blender needed for a composite-only re-run;
      # the encode is x264 crf 14, 4:2:0, so it's a hair softer in chroma than the original PNGs)
      $FFD/ffmpeg -loglevel error -y -i "$IN/take-eevee.mp4" -start_number 0 "$S/public/take/f%03d.png"
      echo "frames: $(ls "$S/public/take" | wc -l) take frames rebuilt from take-eevee.mp4"
      ;;
    cycles)
      T0=$(date +%s)
      $BL -b --factory-startup --python $HERE/blender/duck.py -- --mode cycles --out "$S/cycles" --frames 0,119 --res 1280x720 --samples 256 > "$S/cycles-log.txt" 2>&1
      cp "$S/cycles/f000.png" "$IN/cycles-f000.png"; cp "$S/cycles/f119.png" "$IN/cycles-f119.png"
      echo "cycles: 2 stills in $(( $(date +%s) - T0 )) s"
      ;;
    sound)
      $PY $HERE/tools/sound.py A "$S/a.wav" "$S"
      $PY $HERE/tools/sound.py B "$S/b.wav" "$S"
      ;;
    render)
      for V in A B; do
        ID=ep1-p2; [ $V = B ] && ID=ep1-p2-b
        W=$S/a.wav; [ $V = B ] && W=$S/b.wav
        T0=$(date +%s)
        npx remotion render src/dev/range/ep1-p2/entry.tsx $ID "$S/$ID-video.mp4" --public-dir="$S/public" --concurrency=4 --crf=16 --x264-preset=slow --timeout=120000 --log=error
        echo "$ID: $(( $(date +%s) - T0 )) s"
        $FFD/ffmpeg -loglevel error -y -i "$S/$ID-video.mp4" -i "$W" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "$OUT/$ID.mp4"
        rm -f "$S/$ID-video.mp4"
      done
      npx remotion still src/dev/range/ep1-p2/entry.tsx ep1-p2-matte "$IN/screen-matte.png" --public-dir="$S/public" --log=error
      printf '{"frame": [1920, 1080], "screen_px": {"x": 600, "y": 56, "w": 1056, "h": 592}, "title_strip_h": 44, "native_scale": 4, "note": "white = the film; the title strip and the caption are drawn over it by code"}\n' > "$IN/screen-matte.json"
      ;;
    review)
      $PY $HERE/tools/sheet.py sheet "$OUT/ep1-p2.mp4" A "$OUT/ep1-p2-sheet.png" "$OUT/ep1-p2-blind.png"
      $PY $HERE/tools/sheet.py sheet "$OUT/ep1-p2-b.mp4" B "$OUT/ep1-p2-b-sheet.png" "$OUT/ep1-p2-b-blind.png"
      $PY $HERE/tools/sheet.py keys "$OUT/ep1-p2.mp4" A "$OUT"
      $PY $HERE/tools/sheet.py keys "$OUT/ep1-p2-b.mp4" B "$OUT"
      $PY $HERE/tools/sheet.py measure "$OUT/ep1-p2.mp4" A "$OUT/ep1-p2-measure.json"
      $PY $HERE/tools/sheet.py measure "$OUT/ep1-p2-b.mp4" B "$OUT/ep1-p2-b-measure.json"
      ;;
  esac
done
disk
