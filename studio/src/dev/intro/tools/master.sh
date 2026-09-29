#!/usr/bin/env bash
# MR. MAS — intro-ep1 silent masters (picture only). Run from anywhere:
#   bash studio/src/dev/intro/tools/master.sh [1080|4k|all] [scratch dir]
# 1. Remotion renders the composition as a lossless PNG sequence (1080p; 4K with --scale=2).
# 2. The bundled ffmpeg encodes it: h264 (libx264, preset slow), yuv420p, bt709, 24 fps; crf 12 (1080p) / 16 (4K).
#    The RGB->YUV conversion uses nearest-neighbour chroma (`flags=neighbor`): every native pixel is a 4x4 (8x8 at 4K)
#    block aligned to even coordinates, so 4:2:0 chroma is exact. Remotion's own encoder filters chroma across pixel
#    edges (measured worst-frame PSNR 29.6 dB vs 35.2 dB at 1080p on the dithered paper fade, same crf).
# 3. Verifies 720 frames, 24/1, size, pix_fmt, and deletes the PNG dumps.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
set -euo pipefail
WHAT=${1:-1080}   # render policy: 1080p max; "4k"/"all" kept only for legacy use
STUDIO=$REPO/studio
OUT=$REPO/out/season/intro/picture
TMP=${2:-/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/master}
FFD=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
FF() { LD_LIBRARY_PATH=$FFD "$FFD/ffmpeg" "$@"; }
FP() { LD_LIBRARY_PATH=$FFD "$FFD/ffprobe" "$@"; }
cd "$STUDIO"

master() { # $1 tag  $2 scale  $3 crf  $4 WxH  $5 out
  local dir=$TMP/$1
  rm -rf "$dir"; mkdir -p "$dir"
  npx remotion render src/dev/intro/entry.tsx intro-ep1 "$dir" --sequence --image-format=png --scale="$2" \
    --concurrency=4 --bundle-cache=false --log=error
  local n; n=$(ls "$dir" | wc -l); [ "$n" = 720 ] || { echo "expected 720 PNGs, got $n"; exit 1; }
  FF -hide_banner -v error -y -framerate 24 -start_number 0 -i "$dir/element-%03d.png" \
    -vf "scale=out_color_matrix=bt709:out_range=tv:flags=neighbor" \
    -c:v libx264 -preset slow -crf "$3" -pix_fmt yuv420p -r 24 \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
    -movflags +faststart -an "$5"
  local info; info=$(FP -v error -count_frames -select_streams v:0 \
    -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_read_frames -of csv=p=0 "$5")
  echo "$5: $info"
  [ "$info" = "h264,${4/x/,},yuv420p,24/1,720" ] || { echo "VERIFY FAILED: $info"; exit 1; }
  rm -rf "$dir"
}

case $WHAT in
  1080) master 1080 1 12 1920x1080 "$OUT/intro-ep1-1080p-silent.mp4" ;;
  4k) master 4k 2 16 3840x2160 "$OUT/intro-ep1-4k-silent.mp4" ;;
  all) master 1080 1 12 1920x1080 "$OUT/intro-ep1-1080p-silent.mp4"; master 4k 2 16 3840x2160 "$OUT/intro-ep1-4k-silent.mp4" ;;
esac
