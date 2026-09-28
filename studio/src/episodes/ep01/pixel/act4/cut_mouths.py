#!/usr/bin/env python3
"""cut_mouths.py - mouth tracks for the v3.1 takes that were CUT from older takes (audio/ep01/v31/act4/lines-v31.json
carries none for them: v31-a4-0001 from a5-27-01, v31-a4-0005 from a5-27-35, v31-a4-0007 from a5-29-05). The cut is the
same performance, so its mouth track is the source take's, moved onto the cut file's clock: the shift is the cut's first
word (the timeline's `in` + its first word) against the source take's word that the cut starts on (the take's own
"words A-B" note). Writes takes-v31-cut-mouths.json beside this file: each cut take's entry from lines-v31.json, whole,
with `mouth` added, for lock.py --takes (later files win, so this file goes last in plan.json's `takes`).
Run from the repo root:  python3 studio/src/episodes/ep01/pixel/act4/cut_mouths.py
"""
import json, os, re
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
src = {x["id"]: x for f in ("audio/ep01/act4/dialogue/lines-v5.json",) for x in json.load(open(P(f)))}
v31 = json.load(open(P("audio/ep01/v31/act4/lines-v31.json")))
tl = json.load(open(P("show/reel/ep01-v31/ep01-v31-act4.json")))
line = {l["id"]: l for b in tl["beats"] for l in b.get("lines", [])}
out = []
for e in v31:
    if e.get("mouth"):
        continue
    m = re.match(r"(a5-\d+-\d+) words (\d+)-(\d+)", e.get("cut_from") or e.get("source") or e.get("take") or "")
    if not m or m.group(1) not in src or e["id"] not in line:
        continue
    s = src[m.group(1)]
    a, z = int(m.group(2)), int(m.group(3))
    w0, w1 = s["words"][a], s["words"][z]
    L = line[e["id"]]
    cut0 = L["in"] + L["words"][0][1]
    shift = cut0 - w0["t0"]
    mouth = [{"t": 0.0, "shape": "rest"}]
    for q in s["mouth"]:
        if w0["t0"] - 0.15 <= q["t"] <= w1["t1"] + 0.05:
            mouth.append({"t": round(max(0.0, q["t"] + shift), 4), "shape": q["shape"]})
    mouth.append({"t": round(w1["t1"] + shift + 0.04, 4), "shape": "rest"})
    out.append({**e, "mouth": mouth, "mouth_from": f"{m.group(1)} words {a}-{z}, shifted {shift:+.3f} s (cut_mouths.py)"})
    print(e["id"], "<-", m.group(1), f"words {a}-{z}", f"shift {shift:+.3f} s", len(mouth), "shapes")
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "takes-v31-cut-mouths.json"), "w"), indent=1, ensure_ascii=False)
