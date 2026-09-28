#!/usr/bin/env python3
"""cut_mouths.py - mouth tracks for the takes that were CUT from older takes. Their takes files carry none:
  v3.1 (audio/ep01/v31/act4/lines-v31.json): v31-a4-0001 from a5-27-01, v31-a4-0005 from a5-27-35, v31-a4-0007 from
       a5-29-05 -> takes-v31-cut-mouths.json
  v3.3 (audio/ep01/v33/act4/lines-v33.json): v33-a4-0002 from v3-a4-0003 (Tasya's TV clip, its last sentence)
       -> takes-v33-cut-mouths.json
  v3.3 EL (audio/ep01/v3-el/ep01-v33/act4/lines-A.json): the EL take of the same cut, v33-a4-0002 from the EL
       v3-a4-0003 (whose mouth is the assembly's el_takes.py track, assembly/el-v32/act4-takes.json)
       -> audio/ep01/v3-el/ep01-v33/act4/lines-A-cut-mouths.json (beside the EL takes, for the assembly's EL lock:
       pass it after the EL takes; the EL lines-A.json itself is not touched)
The cut is the same performance, so its mouth track is the source take's, moved onto the cut file's clock: the shift is
the cut's first word (the timeline's `in` + its first word) against the source take's word that the cut starts on (the
take's own "<id> words A-B" note). Each output holds the cut takes' entries from their takes file, whole, with `mouth`
added, for lock.py --takes (later files win, so each goes after its takes file in plan.json's `takes`).
Run from the repo root:  python3 studio/src/episodes/ep01/pixel/act4/cut_mouths.py
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, *[".."] * 6))
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
KOKORO = ("audio/ep01/act4/dialogue/lines-v5.json", "audio/ep01/v3/act4/lines-v3.json")
EL = ("show/episodes/ep01/production/full-v3/assembly/el-v32/act4-takes.json",)
JOBS = [  # (the cut takes' file, the timeline that places them (None: the cut take's own words), the source takes, the output, only these ids)
    ("audio/ep01/v31/act4/lines-v31.json", "show/reel/ep01-v31/ep01-v31-act4.json", KOKORO, os.path.join(HERE, "takes-v31-cut-mouths.json"), None),
    ("audio/ep01/v33/act4/lines-v33.json", "show/reel/ep01-v33/ep01-v33-act4.json", KOKORO, os.path.join(HERE, "takes-v33-cut-mouths.json"), None),
    ("audio/ep01/v3-el/ep01-v33/act4/lines-A.json", None, EL, P("audio/ep01/v3-el/ep01-v33/act4/lines-A-cut-mouths.json"), {"v33-a4-0002"}),
]
for takes, timeline, sources, dest, only in JOBS:
    src = {x["id"]: x for f in sources for x in json.load(open(P(f)))}
    line = {l["id"]: l for b in json.load(open(P(timeline)))["beats"] for l in b.get("lines", [])} if timeline else {}
    out = []
    for e in json.load(open(P(takes))):
        if e.get("mouth") or (only and e["id"] not in only):
            continue
        m = re.match(r"((?:a5|v3)-[\w-]*?\d+-?\d*) words (\d+)-(\d+)", e.get("cut_from") or e.get("source") or e.get("take") or "")
        if not m or m.group(1) not in src or (timeline and e["id"] not in line) or (not timeline and not e.get("words")):
            continue
        s = src[m.group(1)]
        a, z = int(m.group(2)), int(m.group(3))
        w0, w1 = s["words"][a], s["words"][z]
        if timeline:
            L = line[e["id"]]
            cut0 = L["in"] + L["words"][0][1]  # the cut file's first word (the timeline's in-point + its offset)
        else:
            cut0 = float(e["words"][0]["t0"])  # the cut file's own first word
        shift = cut0 - w0["t0"]
        mouth = [{"t": 0.0, "shape": "rest"}]
        for q in s["mouth"]:
            if w0["t0"] - 0.15 <= q["t"] <= w1["t1"] + 0.05:
                mouth.append({"t": round(max(0.0, q["t"] + shift), 4), "shape": q["shape"]})
        mouth.append({"t": round(w1["t1"] + shift + 0.04, 4), "shape": "rest"})
        out.append({**e, "mouth": mouth, "mouth_from": f"{m.group(1)} words {a}-{z}, shifted {shift:+.3f} s (cut_mouths.py)"})
        print(e["id"], "<-", m.group(1), f"words {a}-{z}", f"shift {shift:+.3f} s", len(mouth), "shapes")
    json.dump(out, open(dest, "w"), indent=1, ensure_ascii=False)
