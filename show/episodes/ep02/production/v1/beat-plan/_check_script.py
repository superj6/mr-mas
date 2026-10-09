#!/usr/bin/env python3
"""Hold ../script-v1.md and the beat plans (<seg>.json) to each other.

    python3 show/episodes/ep02/production/v1/beat-plan/_check_script.py

Checks: every beat in the plan appears in the script exactly once as `[id] (≈ X s`, with X the plan's est_s to 0.1 s;
every line in the plan appears in the script exactly once, as its text followed by a tag ending in its id
(`… · e2-a1-0006]`), with the same words (quotation marks and a blockquote's "> " aside); no line id in the script
that the plan doesn't have. Run it after either file changes (rebuild the plan first: _build.py --write).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "..", "script-v1.md")
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]


def norm(t):
    t = t.strip()
    t = re.sub(r"^>\s*", "", t)
    t = t.strip().strip('"“”').strip()
    return t


def main():
    text = open(SCRIPT).read()
    lines = text.split("\n")
    beats, plan_lines = {}, {}
    for seg in SEGS:
        for b in json.load(open(os.path.join(HERE, f"{seg}.json")))["beats"]:
            beats[b["id"]] = b["est_s"]
            for ln in b["lines"]:
                plan_lines[ln["id"]] = ln["text"]
    bad = []
    seen = {}
    for m in re.finditer(r"\[(\d+[A-Z]?\.\d{2})\] \(≈ ([\d.]+) s", text):
        bid, x = m.group(1), float(m.group(2))
        seen[bid] = seen.get(bid, 0) + 1
        if bid not in beats:
            bad.append(f"script beat [{bid}] is not in the plan")
        elif abs(beats[bid] - x) > 0.06:
            bad.append(f"[{bid}]: the script says ≈ {x} s, the plan {beats[bid]} s")
    for bid in beats:
        if seen.get(bid, 0) != 1:
            bad.append(f"[{bid}] appears {seen.get(bid, 0)} times in the script")
    found = {}
    for raw in lines:
        m = re.search(r"^(.*?)\s*`\[[^`]*?(e2-(?:co|a1|a2|a3|a4|tg|vo)-\d{2,4})\]`\s*$", raw)
        if not m:
            continue
        lid = m.group(2)
        found[lid] = found.get(lid, 0) + 1
        if lid not in plan_lines:
            bad.append(f"script line {lid} is not in the plan")
            continue
        if norm(m.group(1)) != norm(plan_lines[lid]):
            bad.append(f"{lid}: the script says {norm(m.group(1))!r}, the plan {plan_lines[lid]!r}")
    for lid in plan_lines:
        if found.get(lid, 0) != 1:
            bad.append(f"{lid} appears {found.get(lid, 0)} times in the script")
    print(f"beats: {len(beats)} in the plan, {sum(seen.values())} in the script; lines: {len(plan_lines)} in the plan, "
          f"{sum(found.values())} in the script")
    for b in bad:
        print("MISMATCH:", b)
    if bad:
        sys.exit(1)
    print("script and plan agree")


if __name__ == "__main__":
    main()
