#!/usr/bin/env bash
# MR. MAS — style jump prototype C · J6 · THE RING: the full build.
#   picture (Remotion, 1080p) -> sound pass + mux (tools/sound.mjs) -> key stills (Remotion) -> glass sheet (Node preview,
#   the same pure renderer) ; the quantized A/B is rebuilt too so the record matches the current art.
# Run from anywhere:  bash studio/src/dev/jumps/proto3/tools/build.sh [scratchDir]
# Deliverables land in out/jumps/ (1920x1080 max; never --scale above 1). INTERNAL until Ep12 airs.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../../../../.." && pwd)"
ROOT="$(cd "$STUDIO/.." && pwd)"
OUT="$ROOT/out/jumps"
TMP="${1:-$(mktemp -d)}"
mkdir -p "$OUT" "$TMP"
cd "$STUDIO"

echo "[1/5] bundle"
npx remotion bundle src/dev/jumps/proto3/entry.tsx --out-dir="$TMP/bundle" --log=error

echo "[2/5] picture (120 f) + the quantized A/B"
npx remotion render "$TMP/bundle" jump-proto-3 "$TMP/proto3-picture.mp4" --codec=h264 --crf=14 --concurrency=4 --log=error
npx remotion render "$TMP/bundle" jump-proto-3-quantized "$TMP/proto3-quantized-picture.mp4" --codec=h264 --crf=14 --concurrency=4 --log=error

echo "[3/5] sound + mux"
node src/dev/jumps/proto3/tools/sound.mjs "$TMP/proto3-picture.mp4" "$OUT/proto3.mp4"
node src/dev/jumps/proto3/tools/sound.mjs "$TMP/proto3-quantized-picture.mp4" "$OUT/proto3-quantized.mp4"

echo "[4/5] key stills"
rm -f "$OUT"/proto3-key-*.png
npx remotion still "$TMP/bundle" jump-proto-3 "$OUT/proto3-key-1-pixel-before-p20.png" --frame=20 --log=error
npx remotion still "$TMP/bundle" jump-proto-3 "$OUT/proto3-key-2-ring-in-the-type-p46.png" --frame=46 --log=error
npx remotion still "$TMP/bundle" jump-proto-3 "$OUT/proto3-key-3-real-water-p84.png" --frame=84 --log=error
npx remotion still "$TMP/bundle" jump-proto-3 "$OUT/proto3-key-4-snap-p90.png" --frame=90 --log=error

echo "[5/5] glass sheet (1:1 crops: before, the ring's run, settle, snap)"
npx esbuild src/dev/jumps/proto3/tools/preview.ts --bundle --platform=node --outfile="$TMP/p3.js" --log-level=warning
node "$TMP/p3.js" "$TMP" jump 20,30,34,40,46,52,58,64,70,76,84,89,90 sheet
cp "$TMP/jump-sheet.png" "$OUT/proto3-sheet.png"
ls -la "$OUT"/proto3*
