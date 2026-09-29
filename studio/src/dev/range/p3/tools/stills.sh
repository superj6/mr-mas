#!/bin/bash
# render a list of frames from the p3 bundle as stills (iGPU), 3 at a time, into a folder.
#   tools/stills.sh <bundle> <outdir> f1 f2 ...
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
B=$1; O=$2; shift 2
cd $REPO/studio
export LD_LIBRARY_PATH=$PWD/node_modules/@remotion/compositor-linux-x64-gnu
mkdir -p "$O"
printf '%s\n' "$@" | xargs -P 3 -I{} sh -c 'npx remotion still "'"$B"'" p3 "'"$O"'/f$(printf %03d {}).png" --frame={} --gl=angle --timeout=600000 --log=error 2>&1 | grep -v "^$" | head -3'
