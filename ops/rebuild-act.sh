#!/usr/bin/env bash
# ops/rebuild-act.sh: rebuild ONE changed act of the Ep1 film end to end, in order, with the existing tools.
#
#   ops/rebuild-act.sh <act> [--from STEP] [--only STEP]      act: coldopen act1 act2 act3 act4 tag
#   STEPS, in order:  lock  score  mix  picture  mux  film
#     lock     the base (Kokoro) lock's timelines, the EL-timed lock of this act, its takes with mouth tracks and its
#              picture lock (assembly/el-v35/), plus the tag's (its episode-in moves when an act changes length)
#     score    the act's EL score (audio/ost/tracks/e01-v3-<act>/track.py --render, EL)
#     mix      the room/SFX stems (one block, card to tag) and the EL mix of this act and the chapter after it (its
#              head ramps from this act's gain); the card with Act One; then the picture lock is re-checked against it
#     picture  the act's EL picture (build_el.mjs; Act One's tear macro, Acts Three/Four's GLYPH frames, Act Four's
#              hourglass, all from the lock), silent, then the flash check
#     mux      the picture with its mix (-c:v copy, libfdk_aac)
#     film     assemble.py + qa.py + seam_frames.py: out/ep01/full-v3/ep01-v35.mp4 and its records
#
# Every heavy step goes through ops/heavy.sh, one at a time (the steps are sequential). What it does NOT do:
#   - write lines or record takes (audio/ep01/v35/takes.py, record.sh, the EL render_v35.sh come first);
#   - draw new shots (the act's shots.ts and art are the picture pass's work; this renders what is there);
#   - the EL lock of Act One: its committed timeline carries hand-placed V.O. lines (voices-el.md §AD) that
#     el_lock.py would drop, so a changed Act One beat is spliced by hand (lock-v35.md §10); this script stops there.
# The lock version is LOCK (default v35). Written by the v3.5 finishing pass (assembly.md §Z) so the next episodes have
# one command per changed act.
set -euo pipefail
ACT=${1:?usage: ops/rebuild-act.sh <act> [--from STEP] [--only STEP]}; shift
STEPS=(lock score mix picture mux film)
FROM=lock; ONLY=
while [ $# -gt 0 ]; do case "$1" in --from) FROM=$2; shift 2;; --only) ONLY=$2; shift 2;; *) echo "unknown: $1" >&2; exit 2;; esac; done
cd /home/jgon/project/art/mrmas
R=$PWD; LOCK=${LOCK:-v35}; PY=$R/audio/.venv-casting/bin/python; TH=$R/audio/.venv-theme/bin/python
A=show/episodes/ep01/production/full-v3/assembly; H="bash $R/ops/heavy.sh"
S=${SCRATCH:-/tmp/rebuild-$ACT-$$}; mkdir -p "$S"; export ASM_SCRATCH=$S
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
NEXT=$(case $ACT in coldopen) ;; act1) echo "act2 card";; act2) echo act3;; act3) echo act4;; act4) echo tag;; esac)
idx() { local i; for i in "${!STEPS[@]}"; do [ "${STEPS[$i]}" = "$1" ] && { echo "$i"; return; }; done; echo "unknown step $1" >&2; exit 2; }
F=$(idx "$FROM")
run() { [ -n "$ONLY" ] && [ "$ONLY" != "$1" ] && return 0
        [ -z "$ONLY" ] && [ "$(idx "$1")" -lt "$F" ] && return 0
        echo "== $(date +%T) $1 ($ACT)"; "step_$1"; }
lockq() { $PY -c "import json,sys; d=json.load(open('$A/el-$LOCK/lock-$ACT.json')); $1"; }

step_lock() {
  python3 audio/reel/ep01-$LOCK/build_timeline.py
  if [ "$ACT" = act1 ]; then echo "act1: splice the changed beats into show/reel/ep01-$LOCK-el/ by hand (voices-el.md §AD), then --from mix"; exit 3; fi
  $H $PY audio/ep01/v3-el/tools/el_lock.py "$ACT" --lock "$LOCK" --fixed S7.13       # the segment BEFORE the flags
  $H $PY $A/tools/el_takes.py --lock "$LOCK" "$ACT"
  # the length check against the old mix fails until the mix step (re-checked there)
  LOCK=$LOCK bash $A/tools/el_lock.sh "$ACT" tag || echo "   (the picture lock is re-checked after the mix)"
}
step_score() {
  case $ACT in act3|act4) V=(--variant el);; *) V=(--el);; esac
  OST_WORKERS=2 $H $TH audio/ost/tracks/e01-v3-$ACT/track.py --render "${V[@]}"
}
step_mix() {
  $H $PY audio/reel/ep01-v3/stems.py --lock "$LOCK" --variant el
  PYTHONUNBUFFERED=1 $PY audio/reel/ep01-v3/mix_episode.py "$ACT" $NEXT --variant el --lock "$LOCK"   # re-runs itself via heavy.sh
  LOCK=$LOCK bash $A/tools/el_lock.sh "$ACT"                                                           # every check, the mix included
}
step_picture() {
  export ELDIR=$R/$A/el-$LOCK
  (cd studio && node ../$A/tools/build_el.mjs "$ACT" "$S/r-$ACT-el.cjs" && node "$S/r-$ACT-el.cjs" check > "$S/check-$ACT.json")
  G=
  if [ "$ACT" = act1 ]; then                       # the tear macro on 7.02 (k28-87), from the EL renderer's own stills
    T=$(lockq "print(next(s['s'] for s in d['shots'] if s['id']=='7.02') + 28)")
    (cd studio && $H node "$S/r-act1-el.cjs" picstills "$S/tearpics" $(seq "$T" $((T + 59))))
    $H $PY studio/src/dev/genvideo/runway/tear.py --pics "$S/tearpics" --png "$S/glyph" --start "$T"; G=$S/glyph
  fi
  if [ "$ACT" = act3 ] || [ "$ACT" = act4 ]; then  # GLYPH frames from a Remotion bundle on the EL locks
    (cd studio && $H node ../$A/tools/bundle_el.mjs "$S/bundle")
    O=(); [ "$ACT" = act4 ] && O=(--opt hourglass=false)
    (cd studio && BUNDLE=$S/bundle $H node "$S/r-$ACT-el.cjs" glyphs "$S/glyph" 2 "${O[@]}"); G=$S/glyph
  fi
  if [ "$ACT" = act4 ]; then                       # S7.13's hourglass: its first frame; a5-30-18's end + 1
    S713=$(lockq "print(next(s['s'] for s in d['shots'] if s['id']=='S7.13'))")
    BACK=$(lockq "s=next(s['s'] for s in d['shots'] if s['id']=='S7.13'); print(next(l['abs_out'] for l in d['lines'] if l['id']=='a5-30-18') - s + 1)")
    $H $PY $A/tools/hourglass_el.py --scratch "$S/hg" --out "$S/hg-out" --png "$S/glyph" --s713 "$S713" --back-at "$BACK"
  fi
  (cd studio && GLYPH_DIR=$G SEGDIR=$S X264_THREADS=1 $H node "$S/r-$ACT-el.cjs" picture "$R/out/ep01/full-v3/picture-el/$ACT.mp4" --jobs 2 --no-audio)
  $H $PY $A/tools/flash_seg.py "out/ep01/full-v3/picture-el/$ACT.mp4"                                 # limit 3 in any 1 s
}
step_mux() {
  P=$R/out/ep01/full-v3/picture-el/$ACT.mp4
  LD_LIBRARY_PATH=$FFD $H $FFD/ffmpeg -v error -y -i "$P" -i "$R/out/ep01/full-v3/mix-$LOCK-el/$ACT-mix.wav" -map 0:v -map 1:a \
    -c:v copy -c:a libfdk_aac -b:a 256k -ar 48000 -movflags +faststart "$P.part.mp4" && mv "$P.part.mp4" "$P"
}
step_film() {
  $H $PY $A/tools/assemble.py "el-$LOCK"
  $H $PY $A/tools/qa.py "el-$LOCK"
  $H $PY $A/tools/seam_frames.py "el-$LOCK"
}
for st in "${STEPS[@]}"; do run "$st"; done
echo "== $(date +%T) done ($ACT); scratch $S"
