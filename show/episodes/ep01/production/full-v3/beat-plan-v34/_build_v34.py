#!/usr/bin/env python3
"""The v3.4 beat plans (script draft 8.3, the planner voice, PLAN §7), built from _spec_v34.py as deltas
on the v3.3 LOCK (show/reel/ep01-v33/ep01-v33-<seg>.json).

    python3 show/episodes/ep01/production/full-v3/beat-plan-v34/_build_v34.py           # validate + runtime + V.O. + takes
    python3 show/episodes/ep01/production/full-v3/beat-plan-v34/_build_v34.py --write   # (re)write the six JSON files

Reads only the v3.3 lock, the v3.3 plans (each kept beat's music string) and the restored V.O. takes' files;
writes only beat-plan-v34/<seg>.json. Same checks as the v3.2 builder, plus: every restored line's take exists
and names the same text. est_s is a planning length, never a measurement.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, *[".."] * 6))
LOCK = os.path.join(ROOT, "show/reel/ep01-v33/ep01-v33-{seg}.json")
V31PLAN = os.path.join(HERE, "..", "beat-plan-v33", "{seg}.json")
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
sys.path.insert(0, HERE)
from _spec_v34 import CHANGES, NEW, VO_TAKES  # noqa: E402

ABOUT = (
    "v34 beat plan (script draft 8.3: Mas the planner and the mastermind by foresight; PLAN §7, SHOWRUNNER-NOTES 000 and "
    "the showrunner's update), in the PLAN §2 format with the v3.1-v3.3 plans' fields, written as deltas on the v3.3 LOCK "
    "(show/reel/ep01-v33/ep01-v33-<seg>.json). Every v3.3 beat appears once (keep, cut, merge). est_s is a planning length "
    "(new V.O. lengths are the recorded takes' audible lengths), never a measurement. New V.O. lines are new lines with "
    "\"vo\": true and tag V.O. (takes in audio/ep01/v34/); restored V.O. carries \"restored\": true and its take path. Fix "
    "codes: A the planner voice, MM the mastermind layer, B one deepfake, C the duck cut, G guardrails §2a rule 3. The script "
    "is show/episodes/ep01/script.md (draft 8.3); the notes are ../script-v34-notes.md; the spec is _spec_v34.py."
)

# ---------------------------------------------------------------------------------------------
# The builder
# ---------------------------------------------------------------------------------------------

def fail(msg):
    print("SPEC ERROR:", msg)
    sys.exit(1)


def load(seg):
    with open(LOCK.format(seg=seg)) as f:
        tl = json.load(f)
    v31 = {}
    p = V31PLAN.format(seg=seg)
    if os.path.exists(p):
        with open(p) as f:
            v31 = {b["id"]: b for b in json.load(f)["beats"]}
    return tl, v31


def is_vo(line):
    return line.get("tag") == "V.O."


def default_music(b, v31):
    if b["id"] in v31 and v31[b["id"]].get("music"):
        m = v31[b["id"]]["music"]
        return m if m.endswith("unchanged") else m
    for c in b.get("cues", []):
        if c.startswith("music"):
            return c
    return ""


def build(seg):
    tl, v31 = load(seg)
    beats = tl["beats"]
    by_id = {b["id"]: b for b in beats}
    ch = CHANGES[seg]
    new = NEW[seg]
    for bid in ch:
        if bid not in by_id:
            fail(f"{seg}: CHANGES names {bid}, not in the v3.3 lock")

    # ---- order
    order = [b["id"] for b in beats if "moved_after" not in ch.get(b["id"], {})]
    inserts = [(c["moved_after"], bid, "moved") for bid, c in ch.items() if "moved_after" in c]
    inserts += [(n["after"], n["id"], "new") for n in new]
    pending = list(inserts)
    guard = 0
    while pending:
        guard += 1
        if guard > 100:
            fail(f"{seg}: unresolvable anchors {pending}")
        anchor, bid, kind = pending.pop(0)
        if anchor in order:
            order.insert(order.index(anchor) + 1, bid)
        else:
            pending.append((anchor, bid, kind))
    if len(order) != len(set(order)):
        fail(f"{seg}: duplicate ids in order")
    for b in beats:
        if order.count(b["id"]) != 1:
            fail(f"{seg}: v3.3 beat {b['id']} appears {order.count(b['id'])} times")

    # ---- moved lines bookkeeping
    moved_out = {}
    for bid, c in ch.items():
        for lid, to in c.get("move_out", {}).items():
            moved_out[(bid, lid)] = to
    for bid, c in ch.items():
        for m in c.get("move_in", []):
            if moved_out.get((m["from"], m["id"])) != bid:
                fail(f"{seg}: {m['id']} moved into {bid} but not moved out of {m['from']}")

    new_ids = {n["id"] for n in new}
    out = []
    for bid in order:
        if bid in new_ids:
            n = next(x for x in new if x["id"] == bid)
            entry = {"id": n["id"], "action": "new", "after": n["after"], "est_s": n["est_s"]}
            for k in ("frame", "set", "room", "chars"):
                entry[k] = n[k]
            present = set()
            lines = []
            for l in n["lines"]:
                lines.append(dict({"id": l["id"], "new": True}, **{k: v for k, v in l.items() if k != "id"}))
                present.add(l["id"])
            for l in n["lines"]:
                a = l["after"]
                if not re.match(r"^start[+-][0-9.]+$", a) and a not in present:
                    fail(f"{seg}: {l['id']} after {a}: not in {bid}")
            entry["lines"] = lines
            for k in ("caption", "onscreen", "jcut", "lcut", "music", "art", "sounds", "fix", "why"):
                if k in n:
                    entry[k] = n[k]
            out.append(entry)
            continue

        b = by_id[bid]
        c = ch.get(bid, {})
        entry = {"id": bid, "action": c.get("action", "keep")}
        entry["est_s"] = round(c.get("est_s", b["reelDur"]), 3)
        if "moved_after" in c:
            entry["moved"] = {"from": f"after {_prev_in_lock(beats, bid)} (v3.3)",
                              "to": f"after {c['moved_after']}"}
        if "frame" in c:
            entry["frame"] = c["frame"]
        entry["music"] = c.get("music", default_music(b, v31))
        if "into" in c:
            entry["into"] = c["into"]
        for k in ("caption", "onscreen", "jcut", "lcut", "art", "sounds", "shot_note", "device"):
            if k in c:
                entry[k] = c[k]
        entry["fix"] = c.get("fix", [])
        entry["why"] = c.get("why", "unchanged")
        entry["src_s"] = round(b["reelDur"], 3)
        entry["src_frame"] = b.get("frame", "")

        tl_ids = [l["id"] for l in b.get("lines", [])]
        for lid in list(c.get("drop", {})) + list(c.get("retime", {})) + list(c.get("move_out", {})):
            if lid not in tl_ids:
                fail(f"{seg}: {bid} names line {lid}, not in the beat")
        lines = []
        present = set()
        for l in b.get("lines", []):
            lid = l["id"]
            if lid in c.get("drop", {}):
                lines.append({"id": lid, "keep": False, "who": l["who"], "text": l["text"],
                              **({"vo": True} if is_vo(l) else {}), "why": c["drop"][lid]})
            elif lid in c.get("move_out", {}):
                lines.append({"id": lid, "keep": False, "who": l["who"], "text": l["text"],
                              "moves_to": c["move_out"][lid], "why": f"moves to {c['move_out'][lid]}"})
            else:
                e = {"id": lid, "keep": True}
                if is_vo(l):
                    e["vo"] = True
                if lid in c.get("retime", {}):
                    e["at"] = c["retime"][lid]
                lines.append(e)
                present.add(lid)
        for m in c.get("move_in", []):
            src = next(l for l in by_id[m["from"]]["lines"] if l["id"] == m["id"])
            lines.append({"id": m["id"], "moved_from": m["from"], "who": src["who"], "text": src["text"],
                          "at": m["at"], "note": m.get("note", "")})
            present.add(m["id"])
        for r in c.get("restore", []):
            present.add(r["id"])
        for l in c.get("add", []):
            present.add(l["id"])
        for r in c.get("restore", []):
            take, lines_file = VO_TAKES[r["id"]]
            if not os.path.exists(os.path.join(ROOT, take)):
                fail(f"{seg}: restored {r['id']}: no take at {take}")
            row = next((x for x in json.load(open(os.path.join(ROOT, lines_file))) if x["id"] == r["id"]), None)
            if row is None or row["text"].strip() != r["text"].strip():
                fail(f"{seg}: restored {r['id']}: text doesn't match {lines_file}")
            a = r["after"]
            if not re.match(r"^start[+-][0-9.]+$", a) and a not in present:
                fail(f"{seg}: {r['id']} after {a}: not in {bid}")
            lines.append(dict({"id": r["id"], "restored": True}, **{k: v for k, v in r.items() if k != "id"},
                              take=take, take_file=lines_file, take_dur_s=row.get("duration_s")))
        for l in c.get("add", []):
            a = l["after"]
            if not re.match(r"^start[+-][0-9.]+$", a) and a not in present:
                fail(f"{seg}: {l['id']} after {a}: not in {bid}")
            lines.append(dict({"id": l["id"], "new": True}, **{k: v for k, v in l.items() if k != "id"}))
        for lid, at in c.get("retime", {}).items():
            m = re.match(r"^after:(.+)\+[0-9.]+$", at)
            if m and m.group(1) not in present:
                fail(f"{seg}: {bid} retimes {lid} after {m.group(1)}, not present")
        entry["lines"] = lines
        out.append(entry)

    src_total = round(sum(b["reelDur"] for b in beats), 2)
    est_total = round(sum(e["est_s"] for e in out if e["action"] in ("keep", "new")), 2)
    plan = {
        "segment": seg,
        "source": f"show/reel/ep01-v33/ep01-v33-{seg}.json",
        "_about": ABOUT,
        "story_s": {"source": src_total, "estimate": est_total},
        "beats": out,
    }
    return plan, tl


def _prev_in_lock(beats, bid):
    ids = [b["id"] for b in beats]
    i = ids.index(bid)
    return ids[i - 1] if i else "(start)"


def fmt(s):
    m, sec = divmod(s, 60)
    return f"{int(m)}:{sec:04.1f}"


def main():
    write = "--write" in sys.argv
    all_ids = set()
    totals = []
    vo_kept = []
    vo_cut = []
    takes = []
    for seg in SEGS:
        plan, tl = build(seg)
        for e in plan["beats"]:
            if e["action"] == "new":
                if e["id"] in all_ids:
                    fail(f"duplicate beat id {e['id']}")
                all_ids.add(e["id"])
            for l in e.get("lines", []):
                if l.get("new"):
                    if l["id"] in all_ids:
                        fail(f"duplicate line id {l['id']}")
                    all_ids.add(l["id"])
                    takes.append((seg, l["id"], l["who"], l["text"], l.get("take", "")))
        # V.O. roster, in order
        tlb = {b["id"]: b for b in tl["beats"]}
        for e in plan["beats"]:
            for l in e.get("lines", []):
                if l.get("vo") and l.get("restored"):
                    vo_kept.append((seg, e["id"], l["id"], l["text"] + "   [restored]"))
                elif l.get("vo") and l.get("new"):
                    vo_kept.append((seg, e["id"], l["id"], l["text"] + "   [new]"))
                elif l.get("vo"):
                    src = next(x for x in tlb[e["id"]]["lines"] if x["id"] == l["id"])
                    (vo_kept if l.get("keep") else vo_cut).append((seg, e["id"], l["id"], src["text"]))
        totals.append((seg, plan["story_s"]["source"], plan["story_s"]["estimate"]))
        if write:
            p = os.path.join(HERE, f"{seg}.json")
            with open(p, "w") as f:
                json.dump(plan, f, indent=1, ensure_ascii=False)
                f.write("\n")
    print("== runtime (story; v3.3 lock -> v3.4 estimate)")
    s0 = s1 = 0
    for seg, a, b in totals:
        s0 += a
        s1 += b
        print(f"  {seg:<9} {fmt(a):>7} -> {fmt(b):>7}  ({b - a:+.1f} s)")
    print(f"  {'story':<9} {fmt(s0):>7} -> {fmt(s1):>7}  ({s1 - s0:+.1f} s)")
    words = sum(len(t.replace("   [restored]", "").split()) for *_, t in vo_kept)
    print(f"== V.O. kept: {len(vo_kept)} lines, {words} words")
    for seg, bid, lid, t in vo_kept:
        print(f"  {seg:<6} {bid:<10} {lid:<12} {t}")
    print(f"== V.O. cut: {len(vo_cut)}")
    for seg, bid, lid, t in vo_cut:
        print(f"  {seg:<6} {bid:<10} {lid:<12} {t}")
    print(f"== new or changed lines (takes): {len(takes)}")
    for seg, lid, who, t, tk in takes:
        print(f"  {seg:<6} {lid:<12} {who:<8} {t:<70} | {tk}")
    print("written" if write else "(dry run; --write to write the JSON)")


if __name__ == "__main__":
    main()
