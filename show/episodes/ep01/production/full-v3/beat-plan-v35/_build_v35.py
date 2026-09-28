#!/usr/bin/env python3
"""The v3.5 beat plans (script draft 8.4, the final version: proposal-v35 with PLAN §8's choices), built from
_spec_v35.py as deltas on the v3.4 LOCK (show/reel/ep01-v34/ep01-v34-<seg>.json).

    python3 show/episodes/ep01/production/full-v3/beat-plan-v35/_build_v35.py           # validate + runtime + V.O. + takes
    python3 show/episodes/ep01/production/full-v3/beat-plan-v35/_build_v35.py --write   # (re)write the six JSON files

Reads only the v3.4 lock, the v3.4 plans (each kept beat's music string), the existing take files (restored and reused
takes) and the v3.5 takes when they exist (audio/ep01/v35/<seg>/lines*.json: new lines' lengths); writes only
beat-plan-v35/<seg>.json. est_s is a planning length, never a measurement.

Checks (it stops on the first failure): every v3.4 beat appears once, in ORDER; every beat CHANGES names is in the
lock; every retimed or dropped line is in its beat; every placement anchor (after / after:<id> / overlap:<id>) is
present in the beat; every on-screen replace/drop names a text the source beat has; every restored take's file exists
and its text matches; every new, reused and cut line id is used exactly once and nowhere else.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, *[".."] * 6))
LOCK = os.path.join(ROOT, "show/reel/ep01-v34/ep01-v34-{seg}.json")
PREV = os.path.join(HERE, "..", "beat-plan-v34", "{seg}.json")
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
sys.path.insert(0, HERE)
import _spec_v35 as S  # noqa: E402

ABOUT = (
    "v35 beat plan (script draft 8.4: the final version, proposal-v35.md with PLAN §8's choices 1A-12A), in the PLAN §2 "
    "format with the v3.1-v3.4 plans' fields, written as deltas on the v3.4 LOCK (show/reel/ep01-v34/ep01-v34-<seg>.json). "
    "Every v3.4 beat appears once (keep, cut, merge), in the v3.5 order; new beats are action \"new\" with their frame, set, "
    "room and chars (a restored v3.3 beat also names its source in restore_from). est_s is a planning length (new lines' "
    "lengths are the recorded v3.5 takes' audible lengths; restored and reused lines use their own takes), never a "
    "measurement. Line flags: keep / new (v35-* ids; takes in audio/ep01/v35/) / restored (an earlier take, with take and "
    "take_file) / reuse_of (a new id on an existing take file) / cut_from (a new id cut from an existing take). Placement: "
    "\"after\" + gap_s (a line id, or start+S) for new lines; a kept line's \"at\" is start+S, after:<id>+S, or overlap:<id>-S "
    "(it starts S before that line ends). New per-beat fields for the art, shot and score passes: scene (proposal-v35's "
    "number), mode (proposal-v35's modes), pace and tempo (the pace table: quick = others 0.15-0.35 s, Mas 0.4-0.5 s; "
    "normal 0.4-0.6 s; weighted = longer, only on turns; tempo.gaps are the gap before each named line), camera (the "
    "frame), picture (notes for the art pass), style (the tier), flashback (when, tier, in, out), style_leap (choice 9A's "
    "macro) and style_leap_optional (CLOD's claymation insert, if the Blender test reads; timing identical either way). "
    "onscreen also takes retime {text: at}. sounds_drop lists sounds a transition moves away. Fix codes are in _spec_v35.py. "
    "The script is show/episodes/ep01/script.md (draft 8.4); the notes are ../script-v35-notes.md."
)


def fail(msg):
    print("SPEC ERROR:", msg)
    sys.exit(1)


def load(seg):
    tl = json.load(open(LOCK.format(seg=seg)))
    prev = {}
    p = PREV.format(seg=seg)
    if os.path.exists(p):
        prev = {b["id"]: b for b in json.load(open(p))["beats"]}
    return tl, prev


def default_music(b, prev):
    if b["id"] in prev and prev[b["id"]].get("music"):
        return prev[b["id"]]["music"]
    for c in b.get("cues", []):
        if c.startswith("music"):
            return c
    return ""


ANCHOR = re.compile(r"^(?:after|overlap|before):(.+?)(?:[+-][0-9.]+)?$")
START = re.compile(r"^start[+-][0-9.]+$")


def flag(line):
    lid = line["id"]
    if lid in S.RESTORE:
        r = S.take_rows()[lid]
        return dict({"id": lid, "restored": True}, **{k: v for k, v in line.items() if k != "id"},
                    take_dur_s=r.get("duration_s"))
    d = dict({"id": lid, "new": True}, **{k: v for k, v in line.items() if k != "id"})
    if lid in S.REUSE:
        d["reuse_of"] = S.REUSE[lid]
    if lid in S.CUT:
        d["cut_from"] = S.CUT[lid][0]
    if lid in S.NEW_VO:
        d["vo"] = True
    return d


def check_restore(lid):
    r = S.take_rows().get(lid)
    if r is None:
        fail(f"restored {lid}: no take row")
    if not os.path.exists(os.path.join(ROOT, r["file"])):
        fail(f"restored {lid}: no take at {r['file']}")
    if r["_file"] != S.RESTORE[lid]:
        fail(f"restored {lid}: row found in {r['_file']}, spec says {S.RESTORE[lid]}")


def build(seg):
    tl, prev = load(seg)
    beats = tl["beats"]
    by_id = {b["id"]: b for b in beats}
    ch = S.CHANGES[seg]
    new = {n["id"]: n for n in S.NEW[seg]}
    order = S.ORDER[seg] or [b["id"] for b in beats]
    for bid in ch:
        if bid not in by_id:
            fail(f"{seg}: CHANGES names {bid}, not in the v3.4 lock")
    for b in beats:
        if order.count(b["id"]) != 1:
            fail(f"{seg}: v3.4 beat {b['id']} appears {order.count(b['id'])} times in ORDER")
    for bid in order:
        if bid not in by_id and bid not in new:
            fail(f"{seg}: ORDER names {bid}: neither a lock beat nor a new beat")
    for nid in new:
        if order.count(nid) != 1:
            fail(f"{seg}: new beat {nid} appears {order.count(nid)} times in ORDER")
    lock_pos = {b["id"]: i for i, b in enumerate(beats)}

    out = []
    lock_ids = [x for x in order if x in by_id]
    moved = S.MOVED.get(seg, {})
    rest = [x for x in lock_ids if x not in moved]
    if rest != [b["id"] for b in beats if b["id"] not in moved]:
        fail(f"{seg}: ORDER moves beats that MOVED doesn't name")
    for pos, bid in enumerate(order):
        prev_id = order[pos - 1] if pos else "(start)"
        sc = S.scene_of(seg, bid)
        if bid in new:
            n = new[bid]
            e = {"id": bid, "action": "new", "after": prev_id, "scene": sc, "mode": S.MODES[sc], "pace": S.pace_of(sc),
                 "est_s": n["est_s"], "frame": n["frame"], "camera": n["frame"], "set": n["set"], "room": n["room"],
                 "chars": n["chars"]}
            present = set()
            lines = []
            for ln in n["lines"]:
                a = ln["after"]
                if not START.match(a) and a not in present:
                    fail(f"{seg}: {ln['id']} after {a}: not in {bid}")
                if ln["id"] in S.RESTORE:
                    check_restore(ln["id"])
                lines.append(flag(ln))
                present.add(ln["id"])
            e["lines"] = lines
            for k in ("caption", "picture", "onscreen", "music", "sounds", "jcut", "lcut", "style", "style_leap",
                      "flashback", "restore_from", "tempo", "fix", "why"):
                if k in n:
                    e[k] = n[k]
            out.append(e)
            continue

        b = by_id[bid]
        c = ch.get(bid, {})
        e = {"id": bid, "action": c.get("action", "keep"), "scene": sc, "mode": S.MODES[sc], "pace": S.pace_of(sc)}
        if e["action"] == "keep":
            e["est_s"] = round(c.get("est_s", b["reelDur"]), 3)
        else:
            e["est_s"] = 0.0   # a cut beat, or a merged one (its time is in the beat it merges into)
        # moved: named in the spec's MOVED (its neighbours' order changes follow from it)
        if bid in S.MOVED.get(seg, {}):
            lock_prev = beats[lock_pos[bid] - 1]["id"] if lock_pos[bid] else "(start)"
            live = [x["id"] for x in out if x["action"] in ("keep", "new")]
            e["moved"] = {"from": f"after {lock_prev} (v3.4)", "to": f"after {live[-1] if live else '(start)'}",
                          "why": S.MOVED[seg][bid]}
        e["frame"] = c.get("frame", b.get("frame", ""))
        e["camera"] = e["frame"]
        e["music"] = c.get("music", default_music(b, prev))
        if "into" in c:
            e["into"] = c["into"]
        for k in ("caption", "picture", "onscreen", "jcut", "lcut", "sounds", "sounds_drop", "shot_note", "style_leap",
                  "style_leap_optional", "tempo"):
            if k in c:
                e[k] = c[k]
        if "picture" not in e:
            e["picture"] = "unchanged (v3.4)" if not c else e.get("caption", "see caption")
        e["fix"] = c.get("fix", [])
        e["why"] = c.get("why", "unchanged" if not c else "")
        e["src_s"] = round(b["reelDur"], 3)
        e["src_frame"] = b.get("frame", "")

        # on-screen edits must name the source's own texts
        texts = [o["text"] for o in b.get("onscreen", [])]
        for old in list(c.get("onscreen", {}).get("replace", {})) + list(c.get("onscreen", {}).get("drop", [])):
            if old not in texts and not any(old in t for t in texts):
                fail(f"{seg}: {bid} onscreen names {old!r}, not in the beat ({texts})")
        for old in c.get("onscreen", {}).get("retime", {}):
            if old not in texts:
                fail(f"{seg}: {bid} onscreen retime names {old!r}, not in the beat")

        tl_ids = [l["id"] for l in b.get("lines", [])]
        for lid in list(c.get("drop", {})) + list(c.get("retime", {})):
            if lid not in tl_ids:
                fail(f"{seg}: {bid} names line {lid}, not in the beat")
        lines = []
        present = set()
        for l in b.get("lines", []):
            lid = l["id"]
            if lid in c.get("drop", {}):
                lines.append({"id": lid, "keep": False, "who": l["who"], "text": l["text"],
                              **({"vo": True} if l.get("tag") == "V.O." else {}), "why": c["drop"][lid]})
            else:
                d = {"id": lid, "keep": True}
                if l.get("tag") == "V.O.":
                    d["vo"] = True
                if lid in c.get("retime", {}):
                    d["at"] = c["retime"][lid]
                lines.append(d)
                present.add(lid)
        for r in c.get("restore", []):
            check_restore(r["id"])
        for extra in c.get("restore", []) + c.get("add", []):
            present.add(extra["id"])
        for extra in c.get("restore", []) + c.get("add", []):
            a = extra["after"]
            m = ANCHOR.match(a)
            anchor = m.group(1) if m else a
            if not START.match(a) and anchor not in present:
                fail(f"{seg}: {extra['id']} after {a}: not in {bid}")
            lines.append(flag(extra))
        for lid, at in c.get("retime", {}).items():
            if START.match(at):
                continue
            m = ANCHOR.match(at)
            if not m or m.group(1) not in present:
                fail(f"{seg}: {bid} retimes {lid} at {at}: anchor not present")
        e["lines"] = lines
        out.append(e)

    src_total = round(sum(b["reelDur"] for b in beats), 2)
    est_total = round(sum(x["est_s"] for x in out if x["action"] in ("keep", "new")), 2)
    plan = {"segment": seg, "source": f"show/reel/ep01-v34/ep01-v34-{seg}.json", "_about": ABOUT,
            "story_s": {"source": src_total, "estimate": est_total}, "beats": out}
    return plan, tl


def fmt(s):
    m, sec = divmod(s, 60)
    return f"{int(m)}:{sec:04.1f}"


def main():
    write = "--write" in sys.argv
    used = {}
    totals = []
    vo_rows = []
    takes = []
    for seg in SEGS:
        plan, tl = build(seg)
        tlb = {b["id"]: b for b in tl["beats"]}
        for e in plan["beats"]:
            for l in e.get("lines", []):
                if l.get("new") or l.get("restored"):
                    if l["id"] in used:
                        fail(f"line {l['id']} used twice ({used[l['id']]} and {seg} {e['id']})")
                    used[l["id"]] = f"{seg} {e['id']}"
                    if l.get("new"):
                        takes.append((seg, e["id"], l["id"], l["who"], l["text"], l.get("take", ""), l.get("len_s")))
                if l.get("vo"):
                    if l.get("new"):
                        vo_rows.append((seg, e["id"], e["scene"], l["id"], l["text"], "new", l.get("at", l.get("after"))))
                    else:
                        src = next(x for x in tlb[e["id"]]["lines"] if x["id"] == l["id"])
                        vo_rows.append((seg, e["id"], e["scene"], l["id"], src["text"], "kept" if l.get("keep") else "CUT",
                                        l.get("at", "")))
        totals.append((seg, plan["story_s"]["source"], plan["story_s"]["estimate"]))
        if write:
            with open(os.path.join(HERE, f"{seg}.json"), "w") as f:
                json.dump(plan, f, indent=1, ensure_ascii=False)
                f.write("\n")
    for group in (S.NEW_VO, S.NEW_LINES, S.REUSE, S.CUT, S.RESTORE):
        for lid in group:
            if lid not in used:
                fail(f"{lid} is defined in the spec but no beat uses it")
    print("== runtime (story; v3.4 lock -> v3.5 estimate)")
    s0 = s1 = 0
    for seg, a, b in totals:
        s0 += a
        s1 += b
        print(f"  {seg:<9} {fmt(a):>7} -> {fmt(b):>7}  ({b - a:+.1f} s)")
    print(f"  {'story':<9} {fmt(s0):>7} -> {fmt(s1):>7}  ({s1 - s0:+.1f} s)")
    print(f"  episode (+30 s intro, 2 s card, 10.125 s outro): {fmt(s1 + 42.125)}")
    kept = [r for r in vo_rows if r[5] != "CUT"]
    words = sum(len(r[4].split()) for r in kept)
    print(f"== V.O.: {len(kept)} lines, {words} words (cut: {len([r for r in vo_rows if r[5] == 'CUT'])})")
    for r in vo_rows:
        print(f"  {r[0]:<6} sc {str(r[2]):<4} {r[1]:<11} {r[3]:<11} {r[5]:<5} {r[4]}")
    print(f"== new / reused / cut lines (takes): {len(takes)}")
    for seg, bid, lid, who, t, tk, ln in takes:
        print(f"  {seg:<5} {bid:<11} {lid:<12} {who:<7} {ln!s:>5} {t[:62]:<62} | {tk[:60]}")
    print("written" if write else "(dry run; --write to write the JSON)")


if __name__ == "__main__":
    main()
