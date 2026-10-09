#!/usr/bin/env python3
"""Hold ../script-v1.md and the beat plans (<seg>.json) to each other.

    python3 show/episodes/ep02/production/v1/beat-plan/_check_script.py

Checks: every beat in the plan appears in the script exactly once as `[id] (≈ X s`, with X the plan's est_s to 0.1 s;
every line in the plan appears in the script exactly once, as its text followed by a tag ending in its id
(`… · e2-a1-0006]`), with the same words (quotation marks and a blockquote's "> " aside), under its own beat (the
nearest `[beat] (≈` above it is the plan's beat for that line); no line id in the script
that the plan doesn't have; every rail line in the script (a line that starts with `RAIL…: <date>`, in a blockquote
too) matches the plan's rails (onscreen_items of kind "rail"), in playing order. Speakers, device tags and other
on-screen text are not compared. Run it after either file changes (rebuild the plan first: _build.py --write).
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
    beats, plan_lines, plan_beat = {}, {}, {}
    plan_rails = []
    for seg in SEGS:
        for b in json.load(open(os.path.join(HERE, f"{seg}.json")))["beats"]:
            beats[b["id"]] = b["est_s"]
            plan_rails += [it["text"][len("RAIL: "):] for it in b.get("onscreen_items", []) if it["kind"] == "rail"]
            for ln in b["lines"]:
                plan_lines[ln["id"]] = ln["text"]
                plan_beat[ln["id"]] = b["id"]
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
    cur = None
    for raw in lines:
        mb = re.search(r"\[(\d+[A-Z]?\.\d{2})\] \(≈ [\d.]+ s", raw)
        if mb:
            cur = mb.group(1)
        m = re.search(r"^(.*?)\s*`\[[^`]*?(e2-(?:co|a1|a2|a3|a4|tg|vo)-\d{2,4})\]`\s*$", raw)
        if not m:
            continue
        lid = m.group(2)
        found[lid] = found.get(lid, 0) + 1
        if lid not in plan_lines:
            bad.append(f"script line {lid} is not in the plan")
            continue
        if cur != plan_beat[lid]:
            bad.append(f"{lid}: under [{cur}] in the script, in [{plan_beat[lid]}] in the plan")
        if norm(m.group(1)) != norm(plan_lines[lid]):
            bad.append(f"{lid}: the script says {norm(m.group(1))!r}, the plan {plan_lines[lid]!r}")
    for lid in plan_lines:
        if found.get(lid, 0) != 1:
            bad.append(f"{lid} appears {found.get(lid, 0)} times in the script")
    script_rails = [m.group(1).strip() for raw in lines
                    for m in [re.match(r"^(?:>\s*)?`RAIL[^`:]*:\s*([^`]+)`", raw)] if m]
    if script_rails != plan_rails:
        bad.append(f"rails: the script has {script_rails}, the plan {plan_rails}")
    print(f"beats: {len(beats)} in the plan, {sum(seen.values())} in the script; lines: {len(plan_lines)} in the plan, "
          f"{sum(found.values())} in the script; rails: {len(plan_rails)} in the plan, {len(script_rails)} in the script")
    for b in bad:
        print("MISMATCH:", b)
    if bad:
        sys.exit(1)
    print("script and plan agree")


if __name__ == "__main__":
    main()
