#!/usr/bin/env bash
# Style jump prototype 2 · J3 "THE SKY OPENS": the full build (final polish: the TEAR ships; the seam and the glass are
# kept for the record: out/jumps/history/proto2-p*.png (the seam build) and out/jumps/proto2-alt-glass-p075.png).
#   picture (Remotion, 1080p) -> temp sound pass (tools/mix.ts) -> mux with the bundled ffmpeg -> key stills + sheet
# Run from anywhere:  bash studio/src/dev/jumps/proto2/tools/build.sh [scratchDir]
# Deliverables land in out/jumps/ (1920x1080 max; never --scale above 1). The machine is shared: concurrency 6 at most.
# The sheet is built by tools/sheet.ts (labelled in the show's pixel font), not by the Remotion `jump-proto-2-sheet`
# composition, whose labels in styleframes/jumps/proto2.frame.tsx still describe the retired fracture build.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../../../../.." && pwd)"
ROOT="$(cd "$STUDIO/.." && pwd)"
OUT="$ROOT/out/jumps"
TMP="${1:-$(mktemp -d)}"
mkdir -p "$OUT" "$TMP"
cd "$STUDIO"
FF="$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu"
ff() { LD_LIBRARY_PATH="$FF" "$FF/ffmpeg" -hide_banner -loglevel error "$@"; }
node_tool() { npx esbuild "src/dev/jumps/proto2/tools/$1.ts" --bundle --platform=node --outfile="$TMP/$1.js" --log-level=warning; }

echo "[1/5] bundle"
npx remotion bundle src/dev/jumps/proto2/entry.tsx --out-dir="$TMP/bundle" --log=error

echo "[2/5] picture (120 f, 1920x1080, 24 fps)"
npx remotion render "$TMP/bundle" jump-proto-2 "$TMP/proto2-silent.mp4" --codec=h264 --crf=14 --concurrency=6 --log=error

echo "[3/5] sound"
node_tool mix
node "$TMP/mix.js" "$ROOT/audio" "$OUT/proto2-sound.wav"

echo "[4/5] mux"
ff -y -i "$TMP/proto2-silent.mp4" -i "$OUT/proto2-sound.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/proto2.mp4"

echo "[5/5] stills + sheet"
# the four key stills (same frame numbers as the earlier builds, for a straight comparison): the torn hairline with
# the Orb turned, the tear pulled apart, the hold, the scar after
for p in 40 56 84 112; do
  npx remotion still "$TMP/bundle" jump-proto-2 "$OUT/proto2-p$(printf %03d $p).png" --frame=$p --log=error
done
# the sheet (Node: the same compose() as the composition). The rejected GLASS still is NOT re-rendered: the file in
# out/jumps/ is the frame that was judged (the far side's floor has since been darkened for the tear)
node_tool sheet
node "$TMP/sheet.js" "$OUT/proto2-sheet.png"
ls -la "$OUT"/proto2*
