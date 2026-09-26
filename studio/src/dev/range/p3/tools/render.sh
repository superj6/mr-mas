#!/bin/bash
# range/p3 full render: probe the GPU, render in chunks (the ANGLE backend leaks on long runs), concat, mux the
# temp sound.   tools/render.sh <bundle-dir> <scratch-dir> <out.mp4> [concurrency]
set -e
B=$1; S=$2; OUT=$3; C=${4:-1}
STUDIO=/home/jgon/project/art/mrmas/studio
FF=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$FF
cd $STUDIO
npx remotion still "$B" p3-probe "$S/probe.png" --gl=angle --log=error
echo "probe: $S/probe.png (check it names the Intel iGPU)"
rm -f "$S"/chunk_*.mp4 "$S/chunks.txt"
for R in 0-89 90-179 180-269 270-359; do
  T0=$(date +%s)
  npx remotion render "$B" p3 "$S/chunk_$R.mp4" --frames=$R --gl=angle --concurrency=$C --timeout=600000 --crf=14 --x264-preset=slow --log=error
  echo "chunk $R: $(( $(date +%s) - T0 )) s"
  echo "file '$S/chunk_$R.mp4'" >> "$S/chunks.txt"
done
$FF/ffmpeg -loglevel error -y -f concat -safe 0 -i "$S/chunks.txt" -c copy "$S/video.mp4"
$FF/ffmpeg -loglevel error -y -i "$S/video.mp4" -i "$S/p3.wav" -c:v copy -c:a aac -b:a 256k -shortest "$OUT"
rm -f "$S"/chunk_*.mp4 "$S/chunks.txt" "$S/video.mp4"
echo "wrote $OUT"
