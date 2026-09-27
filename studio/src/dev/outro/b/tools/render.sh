#!/usr/bin/env bash
# MR. MAS · outro B, Ep1's final outro (v3): the whole pipeline, from code to the files in out/ep01/outro/.
#   bash studio/src/dev/outro/b/tools/render.sh <scratch folder>
# Writes only to <scratch> and out/ep01/outro/. Reads audio/ost/engine and audio/intro-sfx/src read-only. The heavy
# steps (the Remotion render, the OST engine build) each go through ops/heavy.sh (Remotion --concurrency=4,
# OST_WORKERS=2), so start this in the background and poll it: a heavy step can wait for a slot. Don't run this script
# itself under ops/heavy.sh (the steps inside would wait on a second slot). About 3-6 min once it has its slots.
set -euo pipefail
R=/home/jgon/project/art/mrmas
SC=${1:?usage: render.sh <scratch folder>}
mkdir -p "$SC"
SC=$(cd "$SC" && pwd)
OUT=$R/out/ep01/outro
HEAVY=$R/ops/heavy.sh
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
ff() { LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner -loglevel error "$@"; }
fp() { LD_LIBRARY_PATH="$FFD" "$FFD/ffprobe" -v error "$@"; }
PY=$R/audio/.venv-theme/bin/python
export PYTHONDONTWRITEBYTECODE=1 OST_WORKERS=2
mkdir -p "$OUT/qa"

echo "== 1/6 picture (Remotion, 243 f, 1080p; heavy)"
(cd "$R/studio" && bash "$HEAVY" npx remotion render src/dev/outro/b/entry.tsx outro-b-ep1 "$SC/outro-b-v3-silent.mp4" \
  --concurrency=4 --crf=12 --bundle-cache=false --log=error)

echo "== 2/6 the score (OST engine, read-only; heavy)"
bash "$HEAVY" "$PY" "$R/studio/src/dev/outro/b/audio/track.py" --out "$SC/music" --no-loop --no-mp3 --workers 2

echo "== 3/6 the designed sound and the mix (-16 LUFS integrated)"
"$PY" "$R/studio/src/dev/outro/b/audio/mix.py" "$SC"

echo "== 4/6 mux (video stream copy + AAC 256k)"
ff -y -i "$SC/outro-b-v3-silent.mp4" -i "$OUT/outro-b-v3.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -shortest -metadata title="MR. MAS Ep1 outro (B, the Orb's verdict), v3" \
  -metadata comment="mr. mas · ep1.0_research_preview.md · art · script · music · voices · edit: opus 5.5 · prompt: jgon" \
  -movflags +faststart "$OUT/outro-b-v3.mp4"

echo "== 5/6 decode every frame of the ENCODED mp4; the exact native frames and the pixel checks"
rm -rf "$SC/dec" && mkdir -p "$SC/dec" "$SC/native"
ff -i "$OUT/outro-b-v3.mp4" -map 0:v:0 "$SC/dec/%04d.png"
(cd "$R/studio" && node_modules/.bin/esbuild src/dev/outro/b/tools/preview.ts --bundle --platform=node \
  --outfile="$SC/pv.js" --log-level=warning)
node "$SC/pv.js" "$SC/native" 1 1 10,50,80,128,212 >/dev/null
for e in 1 6 10; do node "$SC/pv.js" "$SC" 1 $e check; done

echo "== 6/6 the keyframes sheet, key stills and the readability QA (from the encoded mp4)"
"$PY" "$R/studio/src/dev/outro/b/tools/sheets.py" "$SC" | head -3

fp -show_entries stream=codec_name,width,height,nb_frames,pix_fmt,r_frame_rate,sample_rate,channels:format=duration \
  -of compact "$OUT/outro-b-v3.mp4"
