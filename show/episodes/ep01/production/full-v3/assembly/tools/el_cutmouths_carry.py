#!/usr/bin/env python3
"""el_cutmouths_carry.py - the v3-assemble pass: carry a shots pass's EL cut-take mouth tracks (lines-A-cut-mouths.json) from
an earlier round to a later one that has none, for the rows whose take is the same audio (compared sample by sample)
and the same words. The row is the later round's EL row (its file) with the earlier round's `mouth`.
  audio/.venv-casting/bin/python .../assembly/tools/el_cutmouths_carry.py v33 v34 act4  -> assembly/el-v34/act4-cut-mouths.json"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json, os, sys
import numpy as np, soundfile as sf
ROOT = REPO
src_v, dst_v, seg = sys.argv[1:4]
src = json.load(open(f"{ROOT}/audio/ep01/v3-el/ep01-{src_v}/{seg}/lines-A-cut-mouths.json"))
dst = {r["id"]: r for r in json.load(open(f"{ROOT}/audio/ep01/v3-el/ep01-{dst_v}/{seg}/lines-A.json"))}
out, log = [], []
for r in src:
    d = dst.get(r["id"])
    if not d:
        log.append(f"{r['id']}: not in {dst_v}"); continue
    a, _ = sf.read(f"{ROOT}/{r['file']}"); b, _ = sf.read(f"{ROOT}/{d['file']}")
    same = a.shape == b.shape and np.array_equal(a, b) and [w["w"] for w in r["words"]] == [w["w"] for w in d["words"]]
    if not same:
        log.append(f"{r['id']}: the {dst_v} take differs; not carried"); continue
    x = dict(d); x["mouth"] = r["mouth"]; x["mouth_from"] = f"{r.get('mouth_from', '')} (carried from ep01-{src_v} by el_cutmouths_carry.py: same audio, same words)"
    out.append(x); log.append(f"{r['id']}: carried")
os.makedirs(f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/el-{dst_v}", exist_ok=True)
json.dump(out, open(f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/el-{dst_v}/{seg}-cut-mouths.json", "w"), ensure_ascii=False, indent=1)
print("\n".join(log))
