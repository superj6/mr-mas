#!/usr/bin/env bash
# MR. MAS — an intro silent master (picture only), with Ep1's master.sh settings (studio/src/dev/intro/tools/master.sh,
# read, never edited: its output path is fixed to out/season/intro/, Ep1's locked input). This copy takes the
# composition and the output path, and refuses to write under out/season/.
#   bash studio/src/episodes/ep02/intro/tools/master.sh <intro-ep2|intro-ep1> <out.mp4> <scratch dir>
#     intro-ep2  Ep2's variant (src/episodes/ep02/intro/entry.tsx) -> out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4
#     intro-ep1  Ep1's intro from the dev entry (src/dev/intro/entry.tsx), to a SCRATCH path only: the proof that the
#                slot left Ep1's picture as it was (compare with out/season/intro/picture/intro-ep1-1080p-silent.mp4)
# 1. Remotion renders the composition as a lossless PNG sequence (1080p) through ops/heavy.sh (--concurrency=4).
# 2. The bundled ffmpeg encodes it exactly as Ep1's master: h264 (libx264, preset slow, crf 12), yuv420p, bt709,
#    24 fps, nearest-neighbour chroma (every native pixel is a 4x4 block aligned to even coordinates).
# 3. Verifies 720 frames, 24/1, 1920x1080, yuv420p; keeps the PNGs in <scratch>/png for the full-size look.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
set -euo pipefail
COMP=${1:?usage: master.sh <intro-ep2|intro-ep1> <out.mp4> <scratch dir>}
OUTF=${2:?usage: master.sh <comp> <out.mp4> <scratch dir>}
TMP=${3:?usage: master.sh <comp> <out.mp4> <scratch dir>}
case $COMP in
  intro-ep2) ENTRY=src/episodes/ep02/intro/entry.tsx ;;
  intro-ep1) ENTRY=src/dev/intro/entry.tsx ;;
  *) echo "unknown composition $COMP"; exit 2 ;;
esac
mkdir -p "$(dirname "$OUTF")"
OUTF=$(cd "$(dirname "$OUTF")" && pwd)/$(basename "$OUTF")
case $OUTF in "$REPO"/out/season/*) echo "refusing to write under out/season/ (Ep1's intro)"; exit 3 ;; esac
STUDIO=$REPO/studio
FFD=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
FF() { LD_LIBRARY_PATH=$FFD "$FFD/ffmpeg" "$@"; }
FP() { LD_LIBRARY_PATH=$FFD "$FFD/ffprobe" "$@"; }
dir=$TMP/png
rm -rf "$dir"; mkdir -p "$dir"
cd "$STUDIO"
bash "$REPO/ops/heavy.sh" npx remotion render "$ENTRY" "$COMP" "$dir" --sequence --image-format=png --scale=1 \
  --concurrency=4 --bundle-cache=false --log=error
n=$(ls "$dir" | wc -l); [ "$n" = 720 ] || { echo "expected 720 PNGs, got $n"; exit 1; }
bash "$REPO/ops/heavy.sh" env LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner -v error -y -framerate 24 -start_number 0 \
  -i "$dir/element-%03d.png" \
  -vf "scale=out_color_matrix=bt709:out_range=tv:flags=neighbor" \
  -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p -r 24 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -movflags +faststart -an "$OUTF"
info=$(FP -v error -count_frames -select_streams v:0 \
  -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_read_frames -of csv=p=0 "$OUTF")
echo "$OUTF: $info"
[ "$info" = "h264,1920,1080,yuv420p,24/1,720" ] || { echo "VERIFY FAILED: $info"; exit 1; }
