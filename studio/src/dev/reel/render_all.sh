#!/usr/bin/env bash
# MR. MAS — season outline reel. Renders every show/reel/epNN.json to out/season/reels/epNN.mp4 (1280x720, 24 fps),
# muxes a temp bed from audio/reel/ when one exists, then builds out/season/reels/season.mp4, per-episode contact sheets,
# out/season/reels/season-contact.png and out/season/reels/index.md.
#
#   bash studio/src/dev/reel/render_all.sh                 # every epNN.json
#   bash studio/src/dev/reel/render_all.sh ep03 ep07       # just these (also: 3, ep03.json, reel-ep03, _sample)
#   bash studio/src/dev/reel/render_all.sh ep01-full ep01-full-part1   # the full-length pilot (stitched) / one part
#
# env:  CONC=4 (render concurrency)   NO_SEASON=1   NO_SHEETS=1   REEL_AUDIO_DIR=… (default audio/reel)   REEL_OUT=… (default out/season/reels)
# audio bed lookup per episode, first match wins (wav/mp3/m4a/aac/flac/ogg/opus):
#   audio/reel/epNN.<ext>  ·  audio/reel/epNN[-_]*.<ext>  ·  audio/reel/{bed,temp-bed,temp_bed,reel-bed}.<ext> (looped)
# With no bed the mp4 gets a silent stereo track, so every episode concatenates cleanly into season.mp4.
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
set -euo pipefail
ROOT=$REPO
STUDIO=$ROOT/studio
OUT=${REEL_OUT:-$ROOT/out/season/reels}
AUD=${REEL_AUDIO_DIR:-$ROOT/audio/reel}
CONC=${CONC:-4}
FFD=$STUDIO/node_modules/@remotion/compositor-linux-x64-gnu
FF() { LD_LIBRARY_PATH=$FFD "$FFD/ffmpeg" -hide_banner -v error -y "$@"; }
FP() { LD_LIBRARY_PATH=$FFD "$FFD/ffprobe" -v error "$@"; }
TMP=$OUT/.tmp
cd "$STUDIO"

# 1. copy + lint the writers' JSON into src/reel/data/
node src/reel/sync.mjs
mkdir -p "$OUT" "$TMP"

# 2. which episodes
keys=()
if [ $# -gt 0 ]; then
  for a in "$@"; do
    k=${a%.json}; k=${k#reel-}
    [[ $k =~ ^[0-9]+$ ]] && k=$(printf 'ep%02d' "$((10#$k))")
    [ "$k" = sample ] && k=_sample
    # ep01-full has no file of its own: it is stitched from ep01-full-part1/-part2 (+ ep01-full-act4 if present)
    if [ "$k" = ep01-full ]; then [ -f src/reel/data/ep01-full-part1.json ] && [ -f src/reel/data/ep01-full-part2.json ] || { echo "ep01-full needs show/reel/ep01-full-part1.json and -part2.json"; exit 1; }
    else [ -f "src/reel/data/$k.json" ] || { echo "no show/reel/$k.json"; exit 1; }; fi
    keys+=("$k")
  done
else
  mapfile -t keys < <(ls src/reel/data | grep -E '^ep[0-9]+\.json$' | sed 's/\.json$//' | sort -V)
fi
[ ${#keys[@]} -gt 0 ] || { echo "no show/reel/epNN.json files yet"; exit 0; }
compid() { local k=${1#_}; echo "reel-${k,,}"; }

# 3. bundle once
echo "bundling…"
rm -rf "$TMP/bundle"
npx remotion bundle src/dev/reel/entry.tsx --out-dir "$TMP/bundle" --bundle-cache=false --log=error >/dev/null

find_bed() {
  local k=$1 f
  shopt -s nullglob nocaseglob
  for f in "$AUD/$k".* "$AUD/$k"[-_]*.* "$AUD"/bed.* "$AUD"/temp-bed.* "$AUD"/temp_bed.* "$AUD"/reel-bed.*; do
    case "${f,,}" in *.wav | *.mp3 | *.m4a | *.aac | *.flac | *.ogg | *.opus) echo "$f"; shopt -u nullglob nocaseglob; return 0 ;; esac
  done
  shopt -u nullglob nocaseglob
  return 1
}

# 4. render + mux each episode
for k in "${keys[@]}"; do
  id=$(compid "$k")
  out=$OUT/${k#_}.mp4
  silent=$TMP/${k#_}-silent.mp4
  echo "rendering $id -> $out"
  t0=$(date +%s)
  npx remotion render "$TMP/bundle" "$id" "$silent" --concurrency="$CONC" --bundle-cache=false --log=error
  dur=$(FP -show_entries format=duration -of csv=p=0 "$silent")
  if bed=$(find_bed "${k#_}"); then
    echo "  bed: $bed"
    # (the bundled ffmpeg has no afade: fade in 0.25 s / out 1.5 s with a volume expression)
    FF -i "$silent" -stream_loop -1 -i "$bed" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 \
      -af "volume='min(1,t/0.25)*max(0,min(1,($dur-t)/1.5))':eval=frame" -t "$dur" -movflags +faststart "$out"
  else
    FF -i "$silent" -f lavfi -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -t "$dur" -movflags +faststart "$out"
  fi
  rm -f "$silent"
  echo "  $(FP -show_entries format=duration -of csv=p=0 "$out") s, $(( $(date +%s) - t0 )) s wall"
  if [ -z "${NO_SHEETS:-}" ]; then
    node src/dev/reel/stills.mjs "$id" "$OUT/sheets" --serve="$TMP/bundle" --scale=0.25 --sheet >/dev/null && echo "  sheet: $OUT/sheets/$id-sheet.png" || echo "  (sheet skipped)"
  fi
done

# 5. season: every epNN.mp4 back to back (stream copy; all share codec, size, fps and audio layout)
if [ -z "${NO_SEASON:-}" ]; then
  list=$TMP/season.txt
  : >"$list"
  for f in $(ls "$OUT" | grep -E '^ep[0-9]+\.mp4$' | sort -V); do echo "file '$OUT/$f'" >>"$list"; done
  if [ -s "$list" ]; then
    FF -f concat -safe 0 -i "$list" -c copy -movflags +faststart "$OUT/season.mp4"
    echo "season: $OUT/season.mp4 ($(wc -l <"$list") episodes, $(FP -show_entries format=duration -of csv=p=0 "$OUT/season.mp4") s)"
  fi
fi
# 6. season contact sheet (cold open / midpoint / button per episode) + out/season/reels/index.md
if [ -z "${NO_SHEETS:-}" ] && [ -z "${REEL_OUT:-}" ]; then
  python3 "$STUDIO/src/dev/reel/season_sheet.py" || echo "  (season contact sheet skipped)"
fi
rm -rf "$TMP"
