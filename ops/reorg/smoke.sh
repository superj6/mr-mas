#!/usr/bin/env bash
# ops/reorg/smoke.sh <outdir> [<baseline outdir>]: the reorg's smoke tests on the finished Ep1. Checks only: it renders,
# mixes, locks and records nothing in the repo (every output goes to <outdir>). With a baseline, it diffs against it.
#   1. tsc      the studio typecheck (through ops/heavy.sh); the error list must equal the baseline's
#   2. lock     pixel/tools/lock.py on the six EL v3.5 segments, with el_lock.sh's own arguments but into <outdir>/lock/;
#               every check must pass and each output must be byte-identical to the committed assembly/el-v35/ files
#   3. score    audio/ost/tracks/e01-v3-act1/v35check.py (through heavy.sh): every segment PASS, the table = the baseline's
#   4. rebuild  ops/rebuild-act.sh <act> --dry-run for the six acts: 0 missing paths (the film step checks every input
#               assemble.py reads, from its own chapter list)
#   5. film     the final film and its chapter inputs are byte-identical to ops/reorg/ep01-final.sha1
#   6. lines    every take path in the Act Four dialogue line lists resolves (docs/ORGANIZATION-PLAN.md §7.2 step 6)
# Exit 0 only if every test passes. Written for the 2026-09-29 reorg (docs/ORGANIZATION-PLAN.md §7.5, §0).
set -uo pipefail
OUT=${1:?usage: ops/reorg/smoke.sh <outdir> [<baseline outdir>]}; BASE=${2:-}
REPO=${MRMAS_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}
cd "$REPO" || exit 1
export MRMAS_ROOT=$REPO
mkdir -p "$OUT/lock"
H="bash $REPO/ops/heavy.sh"
A=show/episodes/ep01/production/full-v3/assembly
fail=()

# 1. typecheck
(cd studio && $H npx tsc --noEmit) > "$OUT/tsc.txt" 2>&1; echo "exit $?" >> "$OUT/tsc.txt"
grep -v '^\[heavy\]' "$OUT/tsc.txt" > "$OUT/tsc.clean.txt"
if [ -n "$BASE" ]; then diff -q "$BASE/tsc.clean.txt" "$OUT/tsc.clean.txt" >/dev/null || fail+=(tsc); fi
echo "tsc: $(grep -c 'error TS' "$OUT/tsc.clean.txt") errors, $(tail -1 "$OUT/tsc.clean.txt")"

# 2. the EL v3.5 locks, re-derived into <outdir>/lock/
sed "s#--out-json \$EL/lock-\$seg.json --out-ts \$EL/data-\$seg.ts#--out-json $OUT/lock/lock-\$seg.json --out-ts $OUT/lock/data-\$seg.ts#" \
  $A/tools/el_lock.sh > "$OUT/lock/el_lock_smoke.sh"
grep -q "$OUT/lock/lock-" "$OUT/lock/el_lock_smoke.sh" || { echo "lock: could not redirect el_lock.sh's outputs"; fail+=(lock-redirect); }
LOCK=v35 bash "$OUT/lock/el_lock_smoke.sh" > "$OUT/lock.txt" 2>&1 || fail+=(lock-run)
nfail=$(grep -c '\[FAIL\]' "$OUT/lock.txt"); nsame=0
for s in coldopen act1 act2 act3 act4 tag; do
  for f in lock-$s.json data-$s.ts; do
    if cmp -s "$OUT/lock/$f" "$A/el-v35/$f"; then nsame=$((nsame + 1)); else echo "   lock: $f differs from $A/el-v35/$f"; fi
  done
done
[ "$nfail" -eq 0 ] && [ "$nsame" -eq 12 ] || fail+=(lock)
echo "lock: $(grep -c '^== ' "$OUT/lock.txt") segments, $nfail failed checks, $nsame/12 outputs byte-identical to el-v35/"

# 3. the v3.5 score check
$H audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/v35check.py --json "$OUT/v35check.json" > "$OUT/v35check.txt" 2>&1
grep -v '^\[heavy\]' "$OUT/v35check.txt" > "$OUT/v35check.clean.txt"
npass=$(grep -c '| PASS$' "$OUT/v35check.clean.txt")
[ "$npass" -eq 6 ] || fail+=(score)
if [ -n "$BASE" ]; then diff -q "$BASE/v35check.clean.txt" "$OUT/v35check.clean.txt" >/dev/null || fail+=(score-diff); fi
echo "score: $npass/6 segments PASS"

# 4. rebuild-act.sh dry runs
: > "$OUT/rebuild.txt"; nmiss=0
for a in coldopen act1 act2 act3 act4 tag; do
  bash ops/rebuild-act.sh "$a" --dry-run >> "$OUT/rebuild.txt" 2>&1 || nmiss=$((nmiss + 1))
done
grep '^== dry run\|MISSING\|assemble.py el' "$OUT/rebuild.txt" | sed 's/^/   /'
[ "$nmiss" -eq 0 ] || fail+=(rebuild)

# 5. the final film and its inputs
sha1sum --quiet -c ops/reorg/ep01-final.sha1 > "$OUT/ep01-final.txt" 2>&1 || fail+=(film)
echo "film: $(wc -l < ops/reorg/ep01-final.sha1) files checked, $(grep -c . "$OUT/ep01-final.txt") differ"

# 6. dialogue line lists
python3 - > "$OUT/lines.txt" <<'EOF'
import json, os, re
for f in ['audio/ep01/act4/dialogue/lines.json', 'audio/ep01/act4/dialogue/lines-v5.json']:
    miss, tot = [], 0
    def walk(o):
        global tot
        if isinstance(o, dict): [walk(v) for v in o.values()]
        elif isinstance(o, list): [walk(v) for v in o]
        elif isinstance(o, str) and re.match(r'^(audio|out|show|studio)/.*\.(wav|mp3|json|flac)$', o):
            tot += 1; os.path.exists(o) or miss.append(o)
    walk(json.load(open(f))); print(f, 'paths', tot, 'missing', len(miss), miss[:5])
EOF
cat "$OUT/lines.txt"; grep -q 'missing [1-9]' "$OUT/lines.txt" && fail+=(lines)

if [ ${#fail[@]} -eq 0 ]; then echo "SMOKE: PASS"; exit 0; fi
echo "SMOKE: FAIL (${fail[*]})"; exit 1
