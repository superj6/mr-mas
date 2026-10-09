#!/usr/bin/env bash
# ops/rebuild-act-ep2.sh: rebuild ONE changed act of the Ep2 v1 film (or one SCENE of it) end to end, in order, with
# Ep2's tools. Ep1's ops/rebuild-act.sh (locked behaviour) runs this when given --ep 2:
#
#   ops/rebuild-act.sh --ep 2 <act> [--scene ID[,ID]] [--from STEP] [--only STEP] [--dry-run]
#   act: coldopen act1 act2 act3 act4 tag (card too: its picture only)
#   STEPS, in order:  lock  score  mix  picture  mux  scenecut  film
#     lock      the base (Kokoro) lock of this act from its beat plan (audio/reel/ep02-v1/build_timeline.py <act>), its
#               EL-timed lock (audio/ep02/v1-el/tools/el_lock.py <act>: --fixed EP2_FIXED, never swallowing a segment;
#               refuses to drop a line), its takes with mouth tracks (el_takes.py), the pixel lock of this act and of
#               every act after it (their episode-in moved; el_lock.sh), then scenes.py (a stub for any new scene)
#     score     the act's score (audio/ost/tracks/e02-v1-<act>/track.py --render --el), OST_WORKERS=2
#     mix       the room/SFX stems (stems.py, one block) and the mix of this act and the chapter after it
#               (mix_episode.py: its head ramps from this act's gain; Act One takes the card); then the pixel lock is
#               re-checked against the new mix's length
#     picture   the act's renderer (build.mjs) and `check` (stand-ins allowed only with EP2_ALLOW_STANDINS=1); the
#               GLYPH frames from a Remotion bundle when the act has any; then the PER-SCENE render (render.ts
#               `scenes`): only the scenes whose content hash changed are rendered, the act picture is their lossless
#               concat (out/ep02/v1/picture/<act>.mp4); then the flash check (limit 3 in any second)
#               --scene ID: render only those scenes (forced), no concat (the act picture stays as it was)
#     mux       the act picture with its mix (-c:v copy, libfdk_aac), into out/ep02/v1/picture-mux/<act>.mp4
#     scenecut  with --scene: each scene with its sound, from the cache and the mix (scene_cut.py):
#               out/ep02/v1/review/scenes/<act>-sc-<scene>.mp4. Without --scene: skipped
#     film      assemble.py v1 + qa.py v1 + seam_frames.py v1: out/ep02/v1/ep02-v1.mp4 and its records
#   --dry-run  run nothing and write nothing in the repo: print every command in order and check that every input it
#              names exists (and, for film, every input assemble.py would read). Exit 1 if anything is missing.
#
# Every heavy step goes through ops/heavy.sh, one at a time. What it does NOT do: write the beat plan, record or render
# takes (the voices pass: audio/ep02/v1-el/tools/el_render.py), draw shots (the scene modules), make the intro variant or
# the outro (pipeline.md §8, §6). SCRATCH=<dir> sets the scratch folder (default /tmp/rebuild-ep2-<act>-<pid>).
# Written by the Ep2 pipeline pass (show/episodes/ep02/production/v1/pipeline.md §7).
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
set -euo pipefail
ACT=${1:?usage: ops/rebuild-act.sh --ep 2 <act> [--scene ID[,ID]] [--from STEP] [--only STEP] [--dry-run]}; shift
case $ACT in coldopen|act1|act2|act3|act4|tag|card) ;; *) echo "unknown act: $ACT (coldopen act1 act2 act3 act4 tag card)" >&2; exit 2;; esac
STEPS=(lock score mix picture mux scenecut film)
FROM=lock; ONLY=; DRY=; SCENES=
while [ $# -gt 0 ]; do case "$1" in --from) FROM=$2; shift 2;; --only) ONLY=$2; shift 2;; --dry-run) DRY=1; shift;;
  --scene) SCENES=$2; shift 2;; *) echo "unknown: $1" >&2; exit 2;; esac; done
cd "$REPO"
R=$PWD; PY=$R/audio/.venv-casting/bin/python; TH=$R/audio/.venv-theme/bin/python
A=show/episodes/ep02/production/v1/assembly; PX=studio/src/episodes/ep02/pixel; H="bash $R/ops/heavy.sh"
S=${SCRATCH:-/tmp/rebuild-ep2-$ACT-$$}; mkdir -p "$S"; export ASM_SCRATCH=$S
X=; exec 3>&1
if [ -n "$DRY" ]; then                       # --dry-run: every command goes through x, which only prints and checks
  X=x; : > "$S/.missing"
  x() {
    local a p; { printf '   $'; printf ' %q' "$@"; printf '\n'; } >&3
    for a in "$@"; do
      case $a in -*|*=*|*' '*) continue;; esac; case $a in */*) ;; *) continue;; esac
      case $a in "$S"/*|*.part.mp4|out/ep02/*|"$R"/out/ep02/*) continue;; esac    # scratch, and Ep2's outputs (inputs: need)
      p=$a; [ "${a#/}" = "$a" ] && p=$PWD/$a
      [ -e "$p" ] || { echo "   MISSING $a (from $PWD)" >&3; echo "$a" >> "$S/.missing"; }
    done; }
fi
need() { [ -n "$DRY" ] || return 0; local f; for f in "$@"; do [ -e "$f" ] || { echo "   MISSING $f (read by this step)" >&3; echo "$f" >> "$S/.missing"; }; done; }
FFD=$R/studio/node_modules/@remotion/compositor-linux-x64-gnu
SEGS=(coldopen act1 act2 act3 act4 tag)
NEXT=$(case $ACT in act1) echo "act2 card";; act2) echo act3;; act3) echo act4;; act4) echo tag;; esac)
LATER=$(case $ACT in coldopen) echo "act1 act2 act3 act4 tag";; act1) echo "act2 act3 act4 tag";; act2) echo "act3 act4 tag";; act3) echo "act4 tag";; act4) echo tag;; esac)
idx() { local i; for i in "${!STEPS[@]}"; do [ "${STEPS[$i]}" = "$1" ] && { echo "$i"; return; }; done; echo "unknown step $1" >&2; exit 2; }
F=$(idx "$FROM")
run() { [ -n "$ONLY" ] && [ "$ONLY" != "$1" ] && return 0
        [ -z "$ONLY" ] && [ "$(idx "$1")" -lt "$F" ] && return 0
        echo "== $(date +%T) $1 ($ACT${SCENES:+, scene $SCENES})"; "step_$1"; }

step_lock() {
  [ "$ACT" = card ] && { $X python3 $PX/tools/lock.py --seg card --timeline $PX/card/timeline.json --no-takes --label CARD \
                          --out-json $PX/card/lock.json; return 0; }
  need "show/episodes/ep02/production/v1/beat-plan/$ACT.json"
  $X python3 audio/reel/ep02-v1/build_timeline.py "$ACT"
  FX=(); for b in ${EP2_FIXED:+${EP2_FIXED//,/ }}; do FX+=(--fixed "$b"); done
  $X $H $PY audio/ep02/v1-el/tools/el_lock.py "$ACT" "${FX[@]+"${FX[@]}"}"
  $X $H $PY $A/tools/el_takes.py "$ACT"
  $X bash $A/tools/el_lock.sh "$ACT" $LATER || echo "   (the pixel lock is re-checked after the mix)"
  $X python3 $PX/tools/scenes.py "$ACT"
}
step_score() {
  [ "$ACT" = card ] && return 0
  need "audio/ost/tracks/e02-v1-$ACT/track.py"
  OST_WORKERS=2 $X $H $TH audio/ost/tracks/e02-v1-$ACT/track.py --render --el
}
step_mix() {
  [ "$ACT" = card ] && return 0
  need "show/reel/ep02-v1-el/ep02-v1-el-$ACT.json"
  $X $H $PY audio/reel/ep02-v1/stems.py --variant el
  PYTHONUNBUFFERED=1 $X $PY audio/reel/ep02-v1/mix_episode.py "$ACT" $NEXT --variant el      # re-runs itself via heavy.sh
  $X bash $A/tools/el_lock.sh "$ACT"                                                           # every check, the mix included
}
step_picture() {
  need "$PX/$ACT/data.ts" "$PX/$ACT/shots.ts"
  CHK=(); [ -n "${EP2_ALLOW_STANDINS:-}" ] && CHK=(--allow-standins)
  (cd studio && $X node src/episodes/ep02/pixel/tools/build.mjs "$ACT" "$S/r-$ACT.cjs" \
     && $X node "$S/r-$ACT.cjs" check "${CHK[@]+"${CHK[@]}"}" > "$S/check-$ACT.json")
  G=
  if [ -z "$DRY" ] && (cd studio && node "$S/r-$ACT.cjs" glyphspan) | grep -q '"browser_frames":[1-9]'; then
    (cd studio && $X $H node "$S/r-$ACT.cjs" bundle "$S/bundle" && BUNDLE=$S/bundle $X $H node "$S/r-$ACT.cjs" glyphs "$S/glyph" 2)
    G=$S/glyph
  fi
  if [ -n "$SCENES" ]; then
    (cd studio && GLYPH_DIR=$G X264_THREADS=1 $X $H node "$S/r-$ACT.cjs" scenes --only "$SCENES" --force "$SCENES" --jobs 2)
  else
    (cd studio && GLYPH_DIR=$G X264_THREADS=1 $X $H node "$S/r-$ACT.cjs" scenes "$R/out/ep02/v1/picture/$ACT.mp4" --jobs 2)
    $X $H $PY $A/tools/flash_seg.py "out/ep02/v1/picture/$ACT.mp4"                              # limit 3 in any 1 s
  fi
}
step_mux() {
  [ -n "$SCENES" ] && { echo "   (--scene: the act picture is unchanged; scenecut makes the scene's own file)"; return 0; }
  P=$R/out/ep02/v1/picture/$ACT.mp4; M=$R/out/ep02/v1/mix/$ACT-mix.wav; O=$R/out/ep02/v1/picture-mux/$ACT.mp4
  [ -n "$DRY" ] || mkdir -p "$(dirname "$O")"
  LD_LIBRARY_PATH=$FFD $X $H $FFD/ffmpeg -v error -y -i "$P" -i "$M" -map 0:v -map 1:a \
    -c:v copy -c:a libfdk_aac -b:a 256k -ar 48000 -movflags +faststart "$O.part.mp4" && $X mv "$O.part.mp4" "$O"
}
step_scenecut() {
  [ -n "$SCENES" ] || { echo "   (no --scene: nothing to cut)"; return 0; }
  $X $PY $A/tools/scene_cut.py "$ACT" ${SCENES//,/ }
}
step_film() {
  [ -n "$SCENES" ] && { echo "   (--scene: no film; run --only film when the act is done)"; return 0; }
  if [ -n "$DRY" ]; then   # every input assemble.py reads, from its own chapter list (imports it; runs nothing)
    $PY - "$A/tools" v1 >&3 <<'EOF' || echo "assemble.py inputs" >> "$S/.missing"
import json, os, sys
sys.path.insert(0, sys.argv[1]); import assemble as A                     # noqa: E402
v = sys.argv[2]; V = A.VARIANTS[v]
if not os.path.exists(f"{A.ROOT}/{V['man']}"):
    print(f"   MISSING {V['man']} (the EL manifest: el_lock.py with no segment named)"); sys.exit(1)
CH = A.chapters(v)
need = [(c['id'] + ' picture', c['video']) for c in CH] + [(c['id'] + ' audio', c['audio']) for c in CH]
need += [('manifest', f"{A.ROOT}/{V['man']}"), ('ffmpeg', A.FF), ('ffprobe', A.FP)]
need += [(s + ' lock', f"{A.ROOT}/" + V['locks'].format(seg=s)) for s in ('coldopen', 'act1', 'act2', 'act3', 'act4', 'tag')]
if V.get('hum_gap'):
    need += [('hum tail', f"{A.ROOT}/{V['hum_gap']['tail']}")]
miss = [(k, os.path.relpath(p, A.ROOT)) for k, p in need if not os.path.exists(p)]
print(f'   assemble.py {v}: {len(need)} inputs, {len(miss)} missing')
for k, p in miss:
    print(f'   MISSING {p} ({k})')
sys.exit(1 if miss else 0)
EOF
  fi
  $X $H $PY $A/tools/assemble.py v1
  $X $H $PY $A/tools/qa.py v1
  $X $H $PY $A/tools/seam_frames.py v1
}
for st in "${STEPS[@]}"; do run "$st"; done
if [ -n "$DRY" ]; then
  n=$(sort -u "$S/.missing" | grep -c . || true); rm -rf "$S"
  echo "== dry run (Ep2 v1, $ACT${SCENES:+, scene $SCENES}): $n missing"; [ "$n" -eq 0 ] || exit 1; exit 0
fi
echo "== $(date +%T) done (Ep2 $ACT${SCENES:+, scene $SCENES}); scratch $S"
