#!/usr/bin/env bash
# MR. MAS — outro C: re-render everything (picture, stills, temp score, SFX + mix, mux, sheets + QA).
# Usage (repo root):  bash studio/src/dev/outro/c/tools/render.sh <scratch-dir> [picture|stills|audio|mux|sheets|all]
#   picture = the motion mock-up + the variant stills; stills = the variant stills only (no motion render)
# Writes only into <scratch-dir> and out/lookdev/outro/ (outro-c.mp4) + out/lookdev/outro/c/.
set -euo pipefail
ROOT=/home/jgon/project/art/mrmas
SC=${1:?scratch dir}
STEP=${2:-all}
OUT=$ROOT/out/lookdev/outro/c
FFD=$ROOT/studio/node_modules/@remotion/compositor-linux-x64-gnu
PY=$ROOT/audio/.venv-theme/bin/python
mkdir -p "$SC" "$OUT/qa"
export PYTHONDONTWRITEBYTECODE=1

if [[ $STEP == all || $STEP == picture ]]; then
  (cd "$ROOT/studio" && npx remotion render src/dev/outro/c/entry.tsx outro-c-ep1 "$SC/outro-c-silent.mp4" \
      --concurrency=4 --codec=h264 --crf=12 --pixel-format=yuv420p --bundle-cache=false --log=error)
fi

if [[ $STEP == all || $STEP == picture || $STEP == stills ]]; then
  for k in 0 1 2; do
    (cd "$ROOT/studio" && npx remotion still src/dev/outro/c/entry.tsx outro-c-stills "$SC/still-$k.png" \
        --frame=$k --bundle-cache=false --log=error)
  done
fi

if [[ $STEP == all || $STEP == audio ]]; then
  "$PY" "$ROOT/studio/src/dev/outro/c/audio/track.py" --no-stems --no-loop --out "$SC/music"
  "$PY" "$ROOT/studio/src/dev/outro/c/audio/mix.py" "$SC"
fi

if [[ $STEP == all || $STEP == mux ]]; then
  LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y \
    -i "$SC/outro-c-silent.mp4" -i "$SC/mix.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 \
    -metadata title="MR. MAS outro proposal C (after hours: DAYS SINCE), lookdev mock-up, Ep1" \
    -metadata comment="LOOKDEV. Legal text DRAFT, review pending. Temp score (OST engine) + designed SFX." \
    -movflags +faststart "$ROOT/out/lookdev/outro/.outro-c.tmp.mp4"
  # swap in by rename (atomic on one filesystem), so anyone decoding the old file never reads a half-written one
  ln -f "$ROOT/out/lookdev/outro/.outro-c.tmp.mp4" "$OUT/.outro-c-ep1-1080p.tmp.mp4"
  mv -f "$ROOT/out/lookdev/outro/.outro-c.tmp.mp4" "$ROOT/out/lookdev/outro/outro-c.mp4"
  mv -f "$OUT/.outro-c-ep1-1080p.tmp.mp4" "$OUT/outro-c-ep1-1080p.mp4"
  LD_LIBRARY_PATH=$FFD $FFD/ffprobe -v error -show_entries stream=codec_name,width,height,nb_frames,r_frame_rate,sample_rate:format=duration \
    -of compact "$ROOT/out/lookdev/outro/outro-c.mp4"
fi

if [[ $STEP == all || $STEP == sheets ]]; then
  rm -rf "$SC/dec" && mkdir -p "$SC/dec"
  LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i "$ROOT/out/lookdev/outro/outro-c.mp4" \
    -map 0:v:0 "$SC/dec/f%03d.png"
  (cd "$ROOT/studio" && npx esbuild src/dev/outro/c/tools/preview.ts --bundle --platform=node \
      --outfile="$SC/preview.cjs" --log-level=warning)
  mkdir -p "$SC/native"
  node "$SC/preview.cjs" "$SC/native" 1 12 64 84 99 129 144 154 174 194 check > "$SC/native/check.txt"
  "$PY" "$ROOT/studio/src/dev/outro/c/tools/sheets.py" "$SC"
fi
