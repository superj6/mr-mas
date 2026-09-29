#!/usr/bin/env bash
# Encode the four mixes to AAC-LC 256 kb/s (.m4a) and mux them onto the silent picture masters.
# Video is stream-copied (no re-encode); the audio in each .mp4 is the same AAC bitstream as the .m4a.
set -euo pipefail
ROOT=/home/jgon/project/art/mrmas
FFD=$ROOT/studio/node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$FFD
FF="$FFD/ffmpeg -hide_banner -loglevel error -y"
MIX=$ROOT/audio/intro-mix
PIC=$ROOT/out/season/intro/picture
OUT=$ROOT/out/season/intro

declare -A NAME=([V1]=chipchamber [V2]=orchestralnoir [V3]=pixelswing [V4]=pianopixels)

for V in V1 V2 V3 V4; do
  W=$MIX/intro-ep1-mix-$V-${NAME[$V]}.wav
  A=$MIX/intro-ep1-mix-$V-${NAME[$V]}.m4a
  $FF -i "$W" -c:a libfdk_aac -profile:a aac_low -b:a 256k -ar 48000 -ac 2 \
      -metadata title="MR. MAS Ep1 intro mix $V (${NAME[$V]})" -movflags +faststart -f mp4 "$A"
done

mux () {  # $1 variation, $2 picture file, $3 out file
  $FF -i "$2" -i "$MIX/intro-ep1-mix-$1-${NAME[$1]}.m4a" -map 0:v:0 -map 1:a:0 -c copy \
      -metadata title="MR. MAS Ep1 intro ($1 ${NAME[$1]})" -metadata:s:a:0 language=eng \
      -movflags +faststart "$3"
}
mux V1 "$PIC/intro-ep1-1080p-silent.mp4" "$OUT/intro-ep1-V1-1080p.mp4"
# Render policy: 1080p max. A legacy 4K master is muxed only if one exists.
[ -f "$PIC/intro-ep1-4k-silent.mp4" ] && mux V1 "$PIC/intro-ep1-4k-silent.mp4" "$OUT/intro-ep1-V1-4k.mp4"
mux V2 "$PIC/intro-ep1-1080p-silent.mp4" "$OUT/intro-ep1-V2-1080p.mp4"
mux V3 "$PIC/intro-ep1-1080p-silent.mp4" "$OUT/intro-ep1-V3-1080p.mp4"
mux V4 "$PIC/intro-ep1-1080p-silent.mp4" "$OUT/intro-ep1-V4-1080p.mp4"
ls -la "$MIX"/*.m4a "$OUT"/*.mp4
