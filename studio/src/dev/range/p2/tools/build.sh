#!/usr/bin/env bash
# Prototype 2 · real 3D · THE CLIFF (style-range §7.2; 11.A, Ep11 #3): the full build.
#   bundle -> GL probe (prints the WebGL renderer) -> exactness check (p59 = p60, p315 = p314) -> picture, both
#   variants (native 480x270 x4, reveal on 2s = p2.mp4; 1080 2x-supersampled + palette snap on 1s = p2-alt.mp4) -> temp sound
#   (OST engine, audio/.venv-theme) -> mux with the bundled ffmpeg -> key stills, the sheet and the seam checks (full size
#   and 480x270) pulled from the ENCODED mp4 -> scratch deleted.
# Run from anywhere:  bash studio/src/dev/range/p2/tools/build.sh [scratchDir]
# The machine is shared: --concurrency=4 at most; 1080p max; no frame sequences are kept.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../../../../.." && pwd)"
ROOT="$(cd "$STUDIO/.." && pwd)"
OUT="$ROOT/out/range"
TMP="${1:-$(mktemp -d)}"
mkdir -p "$OUT" "$TMP"
cd "$STUDIO"
FF="$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu"
ff() { LD_LIBRARY_PATH="$FF" "$FF/ffmpeg" -hide_banner -loglevel error "$@"; }
R() { npx remotion "$@" --gl=angle --log=error; }

echo "[1/7] bundle"
npx remotion bundle src/dev/range/p2/entry.tsx --out-dir="$TMP/bundle" --log=error >/dev/null
echo "[2/7] GL probe + exactness (stills in $TMP)"
R still "$TMP/bundle" range-p2-probe "$TMP/probe.png"
R still "$TMP/bundle" range-p2-exact "$TMP/exact.png"
python3 -c "
from PIL import Image
im = Image.open('$TMP/exact.png').convert('RGB')
labs = ['p59 pixel vs p60 3D (native)', 'p59 pixel vs p60 3D (1080, sampled)', 'p315 room vs p314 3D (native)', 'p315 room vs p314 3D (1080, sampled)']
for i, l in enumerate(labs):
    r, g, b = im.getpixel((i * 8 + 4, 1076)); print(f'  {l}: {(r << 16) | (g << 8) | b} px differ')
"
echo "[3/7] picture: native (p2) and 1080 (p2-alt), 360 f each"
t0=$(date +%s); R render "$TMP/bundle" range-p2 "$TMP/p2-silent.mp4" --codec=h264 --crf=15 --concurrency=4; t1=$(date +%s)
R render "$TMP/bundle" range-p2-hd "$TMP/p2-alt-silent.mp4" --codec=h264 --crf=15 --concurrency=4; t2=$(date +%s)
echo "  native $((t1 - t0)) s, 1080 $((t2 - t1)) s (360 frames each, concurrency 4)"
echo "[4/7] sound"
"$ROOT/audio/.venv-theme/bin/python" "$HERE/cue.py" "$ROOT/audio" "$TMP/p2-sound.wav" "$TMP"
echo "[5/7] mux"
for v in p2 p2-alt; do
  ff -y -i "$TMP/$v-silent.mp4" -i "$TMP/p2-sound.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/$v.mp4"
done
echo "[6/7] key stills + sheet + seam checks (from the encoded p2.mp4)"
grab() { ff -y -ss "$(python3 -c "print(max(0, ($1 - 0.25) / 24))")" -i "$OUT/p2.mp4" -frames:v 1 "$2"; }
mkdir -p "$TMP/sheet" "$TMP/seam"
rm -f "$OUT"/p2-key-*.png
# key stills: the lit cursor sets it off, the room has depth, past his card into the resolving screen, V9, the plunge
grab 30 "$OUT/p2-key-1-look-at-lanyard-p030.png"
grab 110 "$OUT/p2-key-2-the-room-has-depth-p110.png"
grab 147 "$OUT/p2-key-3-past-his-card-p147.png"
grab 228 "$OUT/p2-key-4-exceeds-expectations-p228.png"
grab 262 "$OUT/p2-key-5-the-plot-p262.png"
grab 290 "$OUT/p2-key-6-off-the-chart-p290.png"
LAB=""
for f in 30 50 59 60 100 130 147 152 160 168 178 200 212 228 240 250 262 272 280 290 300 306 310 314 315 326 345 359; do
  grab $f "$TMP/sheet/f$f.png"
  LAB="$LAB $TMP/sheet/f$f.png:p$f"
done
python3 "$HERE/sheet.py" sheet "$OUT/p2-sheet.png" "MR. MAS · Prototype 2 · real 3D · THE CLIFF (11.A) · p2.mp4 = native 480x270 x4, the reveal on 2s, everything after it on 1s" "A/B: p2 ships: every edge stays on the 480x270 grid, so it reads as our frame gaining depth. p2-alt (1080, 2x SS + palette snap, 1s) mixes 1080 voxel edges with 4x4 pixels: engine-like." $LAB
for f in 59 60 314 315; do grab $f "$TMP/seam/f$f.png"; done
"$ROOT/audio/.venv-theme/bin/python" "$HERE/encheck.py" "$TMP/seam" 59:60 314:315
echo "[7/7] clean"
rm -rf "$TMP/bundle" "$TMP/sheet" "$TMP/seam" "$TMP/p2-silent.mp4" "$TMP/p2-alt-silent.mp4"
ls -la "$OUT"/p2*
