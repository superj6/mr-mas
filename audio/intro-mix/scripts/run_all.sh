#!/usr/bin/env bash
# Rebuild the whole intro mix: mixes + V1 stems -> AAC + muxes -> QA. About 2 minutes, CPU only.
set -euo pipefail
cd "$(dirname "$0")"
PY=../../.venv-mix/bin/python          # numpy, scipy, soundfile, pyloudnorm, matplotlib
$PY analyze_inputs.py > /dev/null      # qa/inputs.json   (pre-mix bus measurements, duck probe)
$PY mix_intro.py                       # WAV mixes, stems/V1, qa/mix_build.json
./encode_mux.sh                        # .m4a (AAC-LC 256k) + out/intro/intro-ep1-*.mp4 (video stream-copied)
$PY sfx_balance.py                     # qa/sfx_vs_music.json, qa/V1_loudness_timeline.png
$PY verify.py                          # qa/deliverables_qa.json (loudness, peaks, lengths, A/V sync)
