#!/usr/bin/env bash
# MR. MAS · Ep2's outro: the whole pipeline, from code to out/ep02/v1/outro/ (a copy of Ep1's outro B render.sh,
# studio/src/dev/outro/b/tools/render.sh, read, never edited).
#   bash studio/src/episodes/ep02/outro/tools/render.sh <scratch folder>
# Writes only to <scratch> and out/ep02/v1/outro/. Reads audio/ost/engine, audio/intro/sfx/src and the intro singer
# (audio/intro/vocals/scripts) read-only. Every heavy step goes through ops/heavy.sh (Remotion --concurrency=4,
# OST_WORKERS=2); don't run this script itself under heavy.sh. About 3 minutes once it has its slots.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
set -euo pipefail
R=$REPO
SC=${1:?usage: render.sh <scratch folder>}
mkdir -p "$SC"
SC=$(cd "$SC" && pwd)
OUT=$R/out/ep02/v1/outro
HEAVY=$R/ops/heavy.sh
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
ff() { LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner -loglevel error "$@"; }
fp() { LD_LIBRARY_PATH="$FFD" "$FFD/ffprobe" -v error "$@"; }
PY=$R/audio/.venv-theme/bin/python
export PYTHONDONTWRITEBYTECODE=1 OST_WORKERS=2 HF_HUB_OFFLINE=1
mkdir -p "$OUT/qa"
O=$R/studio/src/episodes/ep02/outro

echo "== 1/7 picture (Remotion, 360 f, 1080p; heavy)"
(cd "$R/studio" && bash "$HEAVY" npx remotion render src/episodes/ep02/outro/entry.tsx outro-b-ep2 "$SC/outro-b-ep2-silent.mp4" \
  --concurrency=4 --crf=12 --bundle-cache=false --log=error)

echo "== 2/7 the score, E02-14 (OST engine, read-only; heavy)"
bash "$HEAVY" "$PY" "$O/audio/track.py" --out "$SC/music" --no-loop --no-mp3 --workers 2

echo "== 3/7 the vocal pad's flat line (the intro's singer, read-only; heavy)"
bash "$HEAVY" "$R/audio/.venv-vocals/bin/python" "$O/audio/vocal.py" "$SC"

echo "== 4/7 the designed sound and the mix (page 1 at Ep1's level)"
bash "$HEAVY" "$PY" "$O/audio/mix.py" "$SC"
cp "$SC/mix-report.json" "$OUT/qa/mix-report.json"

echo "== 5/7 mux (video stream copy + AAC 256k)"
ff -y -i "$SC/outro-b-ep2-silent.mp4" -i "$OUT/outro-b-ep2.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -shortest -metadata title="MR. MAS Ep2 outro (B, the Orb's verdict), v1" \
  -metadata comment="mr. mas · ep1.1_her.wav · art · script · music · voices · edit: opus 5.5 · prompt: jgon · the voice cast and tools on page 2" \
  -movflags +faststart "$OUT/outro-b-ep2.mp4"

echo "== 6/7 decode every frame of the ENCODED mp4; the exact native frames and the text checks"
rm -rf "$SC/dec" && mkdir -p "$SC/dec" "$SC/native"
ff -i "$OUT/outro-b-ep2.mp4" -map 0:v:0 "$SC/dec/%04d.png"
(cd "$R/studio" && node_modules/.bin/esbuild src/episodes/ep02/outro/tools/preview.ts --bundle --platform=node \
  --outfile="$SC/pv.js" --log-level=warning)
node "$SC/pv.js" "$SC/native" 1 10,50,80,128,170,183,200,260,330 >/dev/null
node "$SC/pv.js" "$SC" 1 check

echo "== 7/7 the keyframes sheet, key stills and the readability QA (from the encoded mp4)"
bash "$HEAVY" "$PY" "$O/tools/sheets.py" "$SC" | head -40
bash "$HEAVY" "$R/audio/.venv-casting/bin/python" "$R/show/episodes/ep02/production/v1/assembly/tools/flash_seg.py" "$OUT/outro-b-ep2.mp4" \
  | tee "$OUT/qa/flash.json"

fp -show_entries stream=codec_name,width,height,nb_frames,pix_fmt,r_frame_rate,sample_rate,channels:format=duration \
  -of compact "$OUT/outro-b-ep2.mp4"
