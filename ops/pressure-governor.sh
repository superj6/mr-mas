#!/usr/bin/env bash
# pressure-governor.sh: keep the user session's memory pressure (PSI) far from systemd-oomd's kill threshold (50% for
# 20 s), which killed the terminal three times on 2026-09-28. Every 2 s it reads /proc/pressure/memory. Above HIGH
# (avg10 %) it pauses (SIGSTOP) this project's heavy jobs: processes in a systemd-run scope (run-*.scope) whose command
# line mentions the project. Below LOW it resumes them (SIGCONT). It never touches any other project's processes.
# Usage: ops/pressure-governor.sh [minutes] &      (default 240)
REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do { [ "$d" = / ] || [ "$d" = . ]; } && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)
HIGH=${MRMAS_PSI_HIGH:-20}; LOW=${MRMAS_PSI_LOW:-5}; MIN=${1:-240}
ROOT=$REPO
ours() { for p in /proc/[0-9]*; do c=$(cat "$p/cgroup" 2>/dev/null) || continue
  case "$c" in *app.slice/run-*.scope*) tr '\0' ' ' < "$p/cmdline" 2>/dev/null | grep -q "$ROOT" && basename "$p";; esac; done; }
paused=0; end=$(( $(date +%s) + MIN*60 ))
trap 'pids=$(ours); [ -n "$pids" ] && kill -CONT $pids 2>/dev/null; exit 0' EXIT INT TERM
while [ "$(date +%s)" -lt "$end" ]; do
  psi=$(awk '/^some/ {split($2,a,"="); printf "%d", a[2]}' /proc/pressure/memory)
  if [ "$paused" = 0 ] && [ "$psi" -ge "$HIGH" ]; then pids=$(ours); [ -n "$pids" ] && kill -STOP $pids 2>/dev/null && paused=1 && echo "$(date +%T) paused (psi $psi%): $pids"
  elif [ "$paused" = 1 ] && [ "$psi" -le "$LOW" ]; then pids=$(ours); [ -n "$pids" ] && kill -CONT $pids 2>/dev/null; paused=0; echo "$(date +%T) resumed (psi $psi%)"; fi
  sleep 2
done
