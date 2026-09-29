#!/usr/bin/env bash
# ops/rebuild-act.sh: rebuild ONE changed act of the Ep1 film end to end, in order, with the existing tools.
#
#   ops/rebuild-act.sh <act> [--from STEP] [--only STEP] [--dry-run]      act: coldopen act1 act2 act3 act4 tag
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
#   --dry-run  run nothing and write nothing in the repo: print every command in order, and check that every path it
#              names exists (plus the inputs each step reads, and, for film, every input assemble.py would read, from
#              its own chapter list). Exit 1 if anything is missing. Added in the 2026-09-29 reorg as its smoke test.
#
# Every heavy step goes through ops/heavy.sh, one at a time (the steps are sequential). What it does NOT do:
#   - write lines or record takes (audio/ep01/v35/takes.py, record.sh, the EL render_v35.sh come first);
#   - draw new shots (the act's shots.ts and art are the picture pass's work; this renders what is there);
#   - the EL lock of Act One: its committed timeline carries hand-placed V.O. lines (voices-el.md §AD) that
#     el_lock.py would drop, so a changed Act One beat is spliced by hand (lock-v35.md §10); this script stops there.
# The lock version is LOCK (default v35). Written by the v3.5 finishing pass (assembly.md §Z) so the next episodes have
# one command per changed act.
set -euo pipefail
ACT=${1:?usage: ops/rebuild-act.sh <act> [--from STEP] [--only STEP] [--dry-run]}; shift
STEPS=(lock score mix picture mux film)
FROM=lock; ONLY=; DRY=
while [ $# -gt 0 ]; do case "$1" in --from) FROM=$2; shift 2;; --only) ONLY=$2; shift 2;; --dry-run) DRY=1; shift;; *) echo "unknown: $1" >&2; exit 2;; esac; done
cd /home/jgon/project/art/mrmas
R=$PWD; LOCK=${LOCK:-v35}; PY=$R/audio/.venv-casting/bin/python; TH=$R/audio/.venv-theme/bin/python
A=show/episodes/ep01/production/full-v3/assembly; H="bash $R/ops/heavy.sh"
S=${SCRATCH:-/tmp/rebuild-$ACT-$$}; mkdir -p "$S"; export ASM_SCRATCH=$S
X=; exec 3>&1
if [ -n "$DRY" ]; then                       # --dry-run: every command goes through x, which only prints and checks
  X=x; : > "$S/.missing"
  x() {
    local a p; { printf '   $'; printf ' %q' "$@"; printf '\n'; } >&3
    for a in "$@"; do
      case $a in -*|*=*|*' '*) continue;; esac; case $a in */*) ;; *) continue;; esac
      case $a in "$S"/*|*.part.mp4) continue;; esac          # scratch and temporary outputs
      p=$a; [ "${a#/}" = "$a" ] && p=$PWD/$a
      [ -e "$p" ] || { echo "   MISSING $a (from $PWD)" >&3; echo "$a" >> "$S/.missing"; }
    done; }
fi
need() { [ -n "$DRY" ] || return 0; local f; for f in "$@"; do [ -e "$f" ] || { echo "   MISSING $f (read by this step)" >&3; echo "$f" >> "$S/.missing"; }; done; }
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
NEXT=$(case $ACT in coldopen) ;; act1) echo "act2 card";; act2) echo act3;; act3) echo act4;; act4) echo tag;; esac)
idx() { local i; for i in "${!STEPS[@]}"; do [ "${STEPS[$i]}" = "$1" ] && { echo "$i"; return; }; done; echo "unknown step $1" >&2; exit 2; }
F=$(idx "$FROM")
run() { [ -n "$ONLY" ] && [ "$ONLY" != "$1" ] && return 0
        [ -z "$ONLY" ] && [ "$(idx "$1")" -lt "$F" ] && return 0
        echo "== $(date +%T) $1 ($ACT)"; "step_$1"; }
lockq() { $PY -c "import json,sys; d=json.load(open('$A/el-$LOCK/lock-$ACT.json')); $1"; }

step_lock() {
  need studio/src/episodes/ep01/pixel/tools/lock.py "show/reel/ep01-$LOCK-el/ep01-$LOCK-el-$ACT.json"
  $X python3 audio/reel/ep01-$LOCK/build_timeline.py
  if [ "$ACT" = act1 ]; then echo "act1: splice the changed beats into show/reel/ep01-$LOCK-el/ by hand (voices-el.md §AD), then --from mix"
    [ -n "$DRY" ] && return 0 || exit 3; fi
  $X $H $PY audio/ep01/v3-el/tools/el_lock.py "$ACT" --lock "$LOCK" --fixed S7.13       # the segment BEFORE the flags
  $X $H $PY $A/tools/el_takes.py --lock "$LOCK" "$ACT"
  # the length check against the old mix fails until the mix step (re-checked there)
  LOCK=$LOCK $X bash $A/tools/el_lock.sh "$ACT" tag || echo "   (the picture lock is re-checked after the mix)"
}
step_score() {
  case $ACT in act3|act4) V=(--variant el);; *) V=(--el);; esac
  OST_WORKERS=2 $X $H $TH audio/ost/tracks/e01-v3-$ACT/track.py --render "${V[@]}"
}
step_mix() {
  need "$A/el-$LOCK/lock-$ACT.json" "audio/ost/tracks/e01-v3-$ACT"
  $X $H $PY audio/reel/ep01-v3/stems.py --lock "$LOCK" --variant el
  PYTHONUNBUFFERED=1 $X $PY audio/reel/ep01-v3/mix_episode.py "$ACT" $NEXT --variant el --lock "$LOCK"   # re-runs itself via heavy.sh
  LOCK=$LOCK $X bash $A/tools/el_lock.sh "$ACT"                                                           # every check, the mix included
}
step_picture() {
  export ELDIR=$R/$A/el-$LOCK
  need "$A/el-$LOCK/lock-$ACT.json" "$A/el-$LOCK/data-$ACT.ts" "studio/src/episodes/ep01/pixel/$ACT"
  (cd studio && $X node ../$A/tools/build_el.mjs "$ACT" "$S/r-$ACT-el.cjs" && $X node "$S/r-$ACT-el.cjs" check > "$S/check-$ACT.json")
  G=
  if [ "$ACT" = act1 ]; then                       # the tear macro on 7.02 (k28-87), from the EL renderer's own stills
    T=$(lockq "print(next(s['s'] for s in d['shots'] if s['id']=='7.02') + 28)")
    (cd studio && $X $H node "$S/r-act1-el.cjs" picstills "$S/tearpics" $(seq "$T" $((T + 59))))
    $X $H $PY studio/src/dev/genvideo/runway/tear.py --pics "$S/tearpics" --png "$S/glyph" --start "$T"; G=$S/glyph
  fi
  if [ "$ACT" = act3 ] || [ "$ACT" = act4 ]; then  # GLYPH frames from a Remotion bundle on the EL locks
    (cd studio && $X $H node ../$A/tools/bundle_el.mjs "$S/bundle")
    O=(); [ "$ACT" = act4 ] && O=(--opt hourglass=false)
    (cd studio && BUNDLE=$S/bundle $X $H node "$S/r-$ACT-el.cjs" glyphs "$S/glyph" 2 "${O[@]}"); G=$S/glyph
  fi
  if [ "$ACT" = act4 ]; then                       # S7.13's hourglass: its first frame; a5-30-18's end + 1
    S713=$(lockq "print(next(s['s'] for s in d['shots'] if s['id']=='S7.13'))")
    BACK=$(lockq "s=next(s['s'] for s in d['shots'] if s['id']=='S7.13'); print(next(l['abs_out'] for l in d['lines'] if l['id']=='a5-30-18') - s + 1)")
    $X $H $PY $A/tools/hourglass_el.py --scratch "$S/hg" --out "$S/hg-out" --png "$S/glyph" --s713 "$S713" --back-at "$BACK"
  fi
  (cd studio && GLYPH_DIR=$G SEGDIR=$S X264_THREADS=1 $X $H node "$S/r-$ACT-el.cjs" picture "$R/out/ep01/full-v3/picture-el/$ACT.mp4" --jobs 2 --no-audio)
  $X $H $PY $A/tools/flash_seg.py "out/ep01/full-v3/picture-el/$ACT.mp4"                                 # limit 3 in any 1 s
}
step_mux() {
  P=$R/out/ep01/full-v3/picture-el/$ACT.mp4
  LD_LIBRARY_PATH=$FFD $X $H $FFD/ffmpeg -v error -y -i "$P" -i "$R/out/ep01/full-v3/mix-$LOCK-el/$ACT-mix.wav" -map 0:v -map 1:a \
    -c:v copy -c:a libfdk_aac -b:a 256k -ar 48000 -movflags +faststart "$P.part.mp4" && $X mv "$P.part.mp4" "$P"
}
step_film() {
  if [ -n "$DRY" ]; then   # every input assemble.py reads, from its own chapter list (imports it; runs nothing)
    $PY - "$A/tools" "el-$LOCK" >&3 <<'EOF' || echo "assemble.py inputs" >> "$S/.missing"
import json, os, sys
sys.path.insert(0, sys.argv[1]); import assemble as A                     # noqa: E402
v = sys.argv[2]; V = A.VARIANTS[v]; CH = A.chapters(v)
need = [(c['id'] + ' picture', c['video']) for c in CH] + [(c['id'] + ' audio', c['audio']) for c in CH]
need += [('manifest', f"{A.ROOT}/{V['man']}"), ('transcript', f"{A.ASM}/{V['transcript']}"), ('ffmpeg', A.FF), ('ffprobe', A.FP)]
need += [(s + ' lock', f"{A.ROOT}/" + V['locks'].format(seg=s)) for s in ('coldopen', 'act1', 'act2', 'act3', 'act4', 'tag')]
if V.get('hum_gap'):
    man = json.load(open(f"{A.ROOT}/{V['man']}"))
    need += [('hum tail', f"{A.ROOT}/{V['hum_gap']['tail']}"),
             ('outro master audio', f"{A.ROOT}/" + next(c for c in man['chapters'] if c['id'] == 'outro')['audio']['src'])]
miss = [(k, os.path.relpath(p, A.ROOT)) for k, p in need if not os.path.exists(p)]
print(f'   assemble.py {v}: {len(need)} inputs, {len(miss)} missing')
for k, p in miss:
    print(f'   MISSING {p} ({k})')
sys.exit(1 if miss else 0)
EOF
  fi
  $X $H $PY $A/tools/assemble.py "el-$LOCK"
  $X $H $PY $A/tools/qa.py "el-$LOCK"
  $X $H $PY $A/tools/seam_frames.py "el-$LOCK"
}
for st in "${STEPS[@]}"; do run "$st"; done
if [ -n "$DRY" ]; then
  n=$(sort -u "$S/.missing" | grep -c . || true); rm -rf "$S"
  echo "== dry run ($ACT, lock $LOCK): $n missing"; [ "$n" -eq 0 ] || exit 1; exit 0
fi
echo "== $(date +%T) done ($ACT); scratch $S"
