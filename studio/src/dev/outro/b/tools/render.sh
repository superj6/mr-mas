#!/usr/bin/env bash
# MR. MAS · outro proposal B ("the Orb's verdict"): the whole mock-up pipeline, from code to the files in
# out/lookdev/outro/b/. Run from anywhere:   bash studio/src/dev/outro/b/tools/render.sh <scratch folder>
# Writes only to <scratch> and out/lookdev/outro/ (the mp4 is also hard-linked as out/lookdev/outro/outro-b.mp4).
# Reads audio/ost/engine and audio/intro-sfx/src read-only. About 3-6 min on a busy 14-core box.
set -euo pipefail
R=/home/jgon/project/art/mrmas
SC=${1:?usage: render.sh <scratch folder>}
mkdir -p "$SC"
SC=$(cd "$SC" && pwd)
OUT=$R/out/lookdev/outro/b
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
ff() { LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner -loglevel error "$@"; }
fp() { LD_LIBRARY_PATH="$FFD" "$FFD/ffprobe" -v error "$@"; }
PY=$R/audio/.venv-theme/bin/python
export PYTHONDONTWRITEBYTECODE=1
mkdir -p "$OUT"

echo "== 1/7 picture (Remotion, 222 f, 1080p)"
(cd "$R/studio" && npx remotion render src/dev/outro/b/entry.tsx outro-b-ep1 "$SC/outro-b-silent.mp4" \
  --concurrency=4 --crf=12 --bundle-cache=false --log=error)

echo "== 2/7 the variant stills (outro-b-stills: 0 Ep10 o40, 1 Ep10 o140, 2 Ep6 o140, 3 Ep6 o172)"
rm -rf "$SC/stills"
(cd "$R/studio" && npx remotion render src/dev/outro/b/entry.tsx outro-b-stills "$SC/stills" \
  --sequence --image-format=png --concurrency=3 --bundle-cache=false --log=error)

echo "== 3/7 the temp score (OST engine, read-only)"
"$PY" "$R/studio/src/dev/outro/b/audio/track.py" --out "$SC/music" --no-loop

echo "== 4/7 the designed sound and the mix"
"$PY" "$R/studio/src/dev/outro/b/audio/mix.py" "$SC"

echo "== 5/7 mux (video stream copy + AAC 256k)"
ff -y -i "$SC/outro-b-silent.mp4" -i "$OUT/outro-b-mix.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -shortest -metadata title="MR. MAS outro proposal B (the Orb's verdict), Ep1 mock-up, lookdev" \
  -metadata comment="Visual outline for comparison, not a final. 1 s stand-in (Ep1's last shot is not built), the 7.5 s outro with Ep1's moth stinger inside it, 0.75 s of black. Temp music (OST engine) + designed SFX. On-screen legal text: draft, legal review pending. (creator) = the credit line, TBD." \
  -movflags +faststart "$OUT/outro-b-ep1-1080p.mp4"
ln -f "$OUT/outro-b-ep1-1080p.mp4" "$R/out/lookdev/outro/outro-b.mp4"

echo "== 6/7 decode every frame of the ENCODED mp4; the exact native frames and the text checks"
rm -rf "$SC/dec" && mkdir -p "$SC/dec" "$SC/native"
ff -i "$OUT/outro-b-ep1-1080p.mp4" -map 0:v:0 "$SC/dec/%04d.png"
(cd "$R/studio" && node_modules/.bin/esbuild src/dev/outro/b/tools/preview.ts --bundle --platform=node \
  --outfile="$SC/pv.js" --log-level=warning)
node "$SC/pv.js" "$SC/native" 1 1 12,74,158,200 >/dev/null
for e in 1 6 10; do node "$SC/pv.js" "$SC" 1 $e check; done

echo "== 7/7 stills, sheets, readability QA (from the encoded mp4)"
"$PY" "$R/studio/src/dev/outro/b/tools/sheets.py" "$SC" | head -2

fp -show_entries stream=codec_name,width,height,nb_frames,pix_fmt,r_frame_rate,sample_rate,channels:format=duration \
  -of compact "$OUT/outro-b-ep1-1080p.mp4"
