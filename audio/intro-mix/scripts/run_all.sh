#!/usr/bin/env bash
# Rebuild the whole intro mix: mixes + V1 stems -> AAC + muxes -> QA. About 2 minutes, CPU only.
set -euo pipefail
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
cd "$(dirname "$0")"
PY=$REPO/audio/.venv-mix/bin/python          # numpy, scipy, soundfile, pyloudnorm, matplotlib
$PY analyze_inputs.py > /dev/null      # qa/inputs.json   (pre-mix bus measurements, duck probe)
$PY mix_intro.py                       # WAV mixes, stems/V1, qa/mix_build.json
./encode_mux.sh                        # .m4a (AAC-LC 256k) + out/season/intro/intro-ep1-*.mp4 (video stream-copied)
$PY sfx_balance.py                     # qa/sfx_vs_music.json, qa/V1_loudness_timeline.png
$PY verify.py                          # qa/deliverables_qa.json (loudness, peaks, lengths, A/V sync)
