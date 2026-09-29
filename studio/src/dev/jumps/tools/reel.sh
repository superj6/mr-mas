#!/usr/bin/env bash
# MR. MAS — style-jump prototypes: the review reel. proto1, 1 s of black, proto2, 1 s of black, proto3 (1080p24).
# INTERNAL ONLY (style-jumps §3.6): J3 and J6 spoil Ep9 and Ep12; the reel never leaves the room.
# The bundled ffmpeg is a minimal build (no setpts / asplit / color source), so the reel is assembled exactly from
# decoded frames and samples, then encoded once. Run after each prototype's build.sh:
#   bash studio/src/dev/jumps/tools/reel.sh [scratchDir]
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO="$(cd "$HERE/../../../.." && pwd)"
ROOT="$(cd "$STUDIO/.." && pwd)"
OUT="$ROOT/out/lookdev/jumps"
TMP="${1:-$(mktemp -d)}"
PY="$ROOT/audio/.venv-mix/bin/python"
FFD="$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu"
ff() { LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner -loglevel error "$@"; }
mkdir -p "$TMP/frames" "$TMP/seq"
rm -f "$TMP"/frames/* "$TMP"/seq/*
for c in proto1 proto2 proto3; do
  ff -y -i "$OUT/$c.mp4" -vsync 0 "$TMP/frames/$c-%03d.png"
  ff -y -i "$OUT/$c.mp4" -vn -ac 2 -ar 48000 -c:a pcm_s16le "$TMP/frames/$c.wav"
done
"$PY" - "$TMP" <<'EOF'
import glob, os, sys
import numpy as np, soundfile as sf
from PIL import Image
T = sys.argv[1]
Image.new('RGB', (1920, 1080), (0, 0, 0)).save(os.path.join(T, 'frames', 'black.png'))
k, aud = 0, []
for name in ['proto1', None, 'proto2', None, 'proto3']:
    frames = sorted(glob.glob(os.path.join(T, 'frames', f'{name}-*.png'))) if name else [os.path.join(T, 'frames', 'black.png')] * 24
    for f in frames:
        os.symlink(f, os.path.join(T, 'seq', f'f{k:04d}.png')); k += 1
    n = len(frames) * 2000  # 48000 / 24 samples a frame
    if name:
        x, sr = sf.read(os.path.join(T, 'frames', f'{name}.wav'), always_2d=True)
        assert sr == 48000
        x = x[:n]
        x = np.vstack([x, np.zeros((n - len(x), 2))]) if len(x) < n else x
    else:
        x = np.zeros((n, 2))
    aud.append(x)
sf.write(os.path.join(T, 'seq', 'reel.wav'), np.vstack(aud), 48000, subtype='PCM_24')
print('reel', k, 'frames')
EOF
ff -y -framerate 24 -i "$TMP/seq/f%04d.png" -i "$TMP/seq/reel.wav" -map 0:v -map 1:a -c:v libx264 -crf 14 -preset slow \
  -pix_fmt yuv420p -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT/jumps-reel.mp4"
echo "done: $OUT/jumps-reel.mp4"
