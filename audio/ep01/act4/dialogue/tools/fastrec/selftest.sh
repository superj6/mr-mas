#!/bin/bash
# fastrec self-test: the measurements in README.md "Measured", re-runnable. Run from the repo root:
#   bash audio/ep01/act4/dialogue/tools/fastrec/selftest.sh <scratch dir>
# Everything goes into a new folder <scratch dir>/fastrec-selftest-<time>/ (nothing is deleted, nothing in the repo is
# written). It reads audio/ep01/act4/dialogue/lines-v5.json (read-only). About 5-15 min, depending on the machine's load.
#   1. speed: 10 Act Four lines, defaults (4 workers, 1 take a line, ASR on) -> t10/qa/run.json "takes_per_min"
#   2. resume + flag: the same command with --flag a5-29-20 -> 9 skipped, 1 re-read with 2 takes
#   3. stop + resume: SIGINT the supervisor once 2 of 6 rows exist, then the same command again
#   4. no orphans: SIGKILL the supervisor; its workers must exit within a few seconds
set -u
[ $# -eq 1 ] || { echo "usage: $0 <scratch dir>"; exit 2; }
cd "$(dirname "$(readlink -f "$0")")/../../../../../.." || exit 2          # the repo root
D="$(readlink -f "$1")/fastrec-selftest-$(date +%H%M%S)"; mkdir -p "$D"
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
LINES=audio/ep01/act4/dialogue/lines-v5.json
TEN="a5-26a-01 a5-27-01 a5-27-02 a5-27-19 a5-27-31 a5-27-32 a5-29-20 a5-29-21 a5-29-22 a5-29-23"
SIX="a5-27-02 a5-27-32 a5-29-21 a5-29-23 a5-29-22 a5-27-01"
# an array, not a shell function: a function run with & is a subshell, and $! would be the subshell, not the supervisor
REC=(env HF_HUB_OFFLINE=1 $PY $T record --lines $LINES)
say() { echo "== $* ($(date +%T); $(uptime | sed 's/.*load average/load/'))"; }

say "1. speed: 10 lines"
"${REC[@]}" --out "$D/t10" --ids $TEN > "$D/t10.log" 2>&1; echo "exit $?"
grep -o '"takes_per_min": [0-9.]*\|"wall_s": [0-9.]*' "$D/t10/qa/run.json" | head -2; grep "QA (generic)" "$D/t10.log"

say "2. resume + flag"
"${REC[@]}" --out "$D/t10" --ids $TEN --flag a5-29-20 > "$D/t10-flag.log" 2>&1; echo "exit $?"; head -1 "$D/t10-flag.log"

say "3. stop + resume"
"${REC[@]}" --out "$D/stop" --ids $SIX --workers 2 > "$D/stop-1.log" 2>&1 &
SUP=$!
until [ "$(ls "$D/stop/rows/" 2>/dev/null | grep -c '[0-9]\.json$')" -ge 2 ] || ! kill -0 $SUP 2>/dev/null; do sleep 1; done
kill -INT $SUP; wait $SUP; echo "run 1 exit $? (130 = stopped)"; sleep 1
echo "workers left: $(pgrep -fc "_worker --job $D/stop/tmp/job.json")"; ls "$D"/stop/.lock-* >/dev/null 2>&1 && echo "LOCK LEFT" || echo "no lock left"
"${REC[@]}" --out "$D/stop" --ids $SIX --workers 2 > "$D/stop-2.log" 2>&1; echo "run 2 exit $?"; head -1 "$D/stop-2.log"

say "4. no orphans"
"${REC[@]}" --out "$D/kill" --ids $SIX --workers 2 > "$D/kill.log" 2>&1 &
SUP=$!
until [ "$(pgrep -fc "_worker --job $D/kill/tmp/job.json")" -ge 1 ] || ! kill -0 $SUP 2>/dev/null; do sleep 1; done
sleep 3; kill -KILL $SUP; wait $SUP 2>/dev/null; sleep 3
echo "workers left 3 s after SIGKILL of the supervisor: $(pgrep -fc "_worker --job $D/kill/tmp/job.json") (0 expected)"
say "done: $D"
