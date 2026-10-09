#!/usr/bin/env bash
# MR. MAS — Ep2 v1 pixel pipeline: the PER-SCENE RENDER's self-test, on the example segment (pixel/example/: three
# scenes, a rail that runs from scene A into B, a V.O. line, a dither exit from B into C). It renders, changes things,
# renders again, and shows which scenes rendered; it puts every file back at the end (the example is committed).
#   bash studio/src/episodes/ep02/pixel/tools/scenetest.sh <scratch dir>      (renders go through ops/heavy.sh)
# What it shows (show/episodes/ep02/production/v1/pipeline.md §4 has the 2026-10-08 run):
#   1 the first render: every scene renders; `scenecheck`: every act frame = the same frame drawn by its scene alone
#   2 scene A's art changes: only A renders
#   3 A's art put back: nothing renders (A's first file is still in the cache)
#   4 scene B's timing changes (C moves 12 frames later): only B renders, C is cached
#   4b the cached C against a fresh render of C at its new place: the same bytes (X264_THREADS=1)
#   4c scene A's timing changes: A and B render (A's rail runs into B: its tail over B moves)
#   5 scene C's art changes: C and B render (B's last shot dissolves into C's first frame)
#   6 the act's H.264 stream = the scenes' streams back to back (the concat is lossless)
#   7 everything put back: nothing renders
# Uses the cache out/ep02/v1/scenes/example/ (cleared at the start) and writes out/ep02/v1/picture/example.mp4.
set -euo pipefail
S=${1:?usage: scenetest.sh <scratch dir>}; P=$S/scenetest; mkdir -p "$P"
R=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../../.." && pwd)
[ -e "$R/.mrmas-root" ] || { echo "no .mrmas-root at $R" >&2; exit 1; }
cd "$R/studio"
EX=src/episodes/ep02/pixel/example; B=$P/r-example.cjs; H="bash $R/ops/heavy.sh"
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
export X264_THREADS=1
cp $EX/scenes/sc-a.ts $P/sc-a.orig; cp $EX/scenes/sc-c.ts $P/sc-c.orig; cp $EX/timeline.json $P/timeline.orig
restore() { cp $P/sc-a.orig $EX/scenes/sc-a.ts; cp $P/sc-c.orig $EX/scenes/sc-c.ts; cp $P/timeline.orig $EX/timeline.json; relock; }
build() { node src/episodes/ep02/pixel/tools/build.mjs example $B > /dev/null; }
relock() { (cd $R && python3 studio/src/episodes/ep02/pixel/tools/lock.py --seg example --timeline studio/$EX/timeline.json --no-takes \
            --label EXAMPLE --out-json studio/$EX/lock.json --quiet); }
scenes() { echo "\$ scenes $*"; $H node $B scenes "$@" 2>&1 | grep -v '^\[heavy\]'; }
retime() { python3 - $EX/timeline.json "$1" "$2" <<'PY'
import json, sys; p = sys.argv[1]; d = json.load(open(p)); d['beats'][int(sys.argv[2])]['reelDur'] = float(sys.argv[3]); json.dump(d, open(p, 'w'), indent=1)
PY
}
step() { echo; echo "=== $*"; }
trap restore EXIT
rm -rf "$R/out/ep02/v1/scenes/example"
step "1. the first render: every scene renders"
relock; build; node $B scenecheck | tr -d '\n'; echo; scenes
step "2. scene A's art changes (the bar's colour): only A re-renders"
sed -i 's#rect(20 + k \* 8, 60, 24, 60, fb.ink(PAL.W6));#rect(20 + k * 8, 60, 24, 60, fb.ink(PAL.W5));#' $EX/scenes/sc-a.ts
build; node $B scenekeys; scenes
step "3. scene A's art is put back: nothing renders (A's first file is still in the cache)"
cp $P/sc-a.orig $EX/scenes/sc-a.ts; build; scenes
step "4. scene B's timing changes (ex-b1 2.5 -> 3.0 s: B grows 12 frames, C starts 12 frames later): only B re-renders"
retime 2 3.0; relock; build; node $B scenecheck | tr -d '\n'; echo; scenes
step "4b. the cached C (rendered at frame 180) against a fresh render of C at its new place (frame 192), forced, into another cache"
rm -rf $P/fresh
CC=$(python3 -c "import json; print([s['file'] for s in json.load(open('$R/out/ep02/v1/scenes/example/index.json'))['scenes'] if s['id']=='C'][0])")
$H node $B scenes --cache $P/fresh --only C --force C 2>&1 | grep -v '^\[heavy\]'
FC=$(ls $P/fresh/sc-c-*.mp4); A1=$(md5sum < $R/$CC | cut -c1-32); A2=$(md5sum < $FC | cut -c1-32)
echo "cached: $A1  $CC"; echo "fresh:  $A2  ${FC#$S/}"; [ "$A1" = "$A2" ] && echo "IDENTICAL BYTES" || echo "DIFFERENT"
step "4c. scene A's timing changes too (ex-a1 2.0 -> 2.5 s): A re-renders, and so does B (A's rail runs on into B)"
retime 0 2.5; relock; build; scenes
step "5. scene C's art changes: C re-renders, and so does B (its last shot dissolves into C's first frame)"
sed -i 's#rect(470 - k \* 6, 120, 36, 16, fb.ink(PAL.R2));#rect(470 - k * 6, 120, 36, 16, fb.ink(PAL.R3));#' $EX/scenes/sc-c.ts
build; scenes
step "6. lossless concat: the act's H.264 stream = the scenes' streams back to back"
ann() { LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -v error -i "$1" -map 0:v:0 -c copy -f h264 -; }
IDX=$R/out/ep02/v1/scenes/example/index.json
M1=$(ann $R/out/ep02/v1/picture/example.mp4 | md5sum | cut -c1-32)
M2=$(for f in $(python3 -c "import json; print(' '.join(s['file'] for s in json.load(open('$IDX'))['scenes']))"); do ann $R/$f; done | md5sum | cut -c1-32)
echo "act stream md5 $M1; the scenes' streams, concatenated: $M2; $([ "$M1" = "$M2" ] && echo IDENTICAL || echo DIFFERENT)"
step "7. everything put back (the committed example): every scene is cached from step 1, nothing renders"
trap - EXIT; restore; build; scenes
git -C $R status --short $R/studio/src/episodes/ep02/pixel/example
