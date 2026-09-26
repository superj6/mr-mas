"""lock_v4.py - THE EDITOR's timing lock v4 for Ep1 Act Four (script draft 4.0, the flow pass).

Inputs (read-only):
  show/episodes/ep01/production/act4/shots-v4.json   board v4 (tools/board_v4.py, from edit-plan-v4.md §3 / §5.6)
  audio/ep01/act4/dialogue/lines.json                the takes (frames_24, words, mouths); v4 adds a4-25-10b (an edit
                                                     of a4-25-10's take) and the text rows a4-27-01b, a4-26a-01b
Outputs (generated; re-run after any re-board or re-take, never hand-edit):
  show/episodes/ep01/production/act4/shots-locked-v4.json   the lock: frames, lines, text, rails, story marks, stats
  studio/src/episodes/ep01/animatic -> act4/animatic/data-v4.ts   the same timing for the animatic (frame4.ts / shots4.ts)

How the lock places things (flow-and-continuity §2-§4; guides, not gates; timing-v4.md §1):
  * A line takes its length from its take. A reply is spaced from the line before it by the plan's own gap for that
    exchange (edit-plan-v4 §5.6: quick 0.2-0.5 s, loaded 0.6-1.2 s) or by its scripted overlap. Never a uniform gap.
  * A shot starts where the one before ends, EXCEPT a cut on the turn: that shot starts a set lead before its first
    line (the board's `start`), so the cut lands on the story point, not on a beat grid. Nothing snaps to the grid.
  * A shot keeps its planned length (chosen for comprehension) unless its content needs more: a line + a short tail,
    or a must-read text item held for its read floor (0.25 s + 0.05 s a character), counted in the order it lands.
    Then it grows by exactly the shortfall, and the decision is logged.
  * Rails carry time and place only: they type on (2 characters a frame), hold for the read plus 0.75 s, and clear.
    A rail may run across a cut into the next shot of the same place, never into a new place.
  * Story marks (the click, the glance, the stamp, the label...) are resolved to frames here, so the layouts and the
    sound pass share one clock.
Run:  python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v4.py
"""
from __future__ import annotations

import json
import math
import os
import statistics
from collections import OrderedDict

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
PROD = P("show/episodes/ep01/production/act4")
FPS = 24
EP_IN = (12 * 60 + 31) * FPS
BOARD = json.load(open(os.path.join(PROD, "shots-v4.json")))
REC = OrderedDict((x["id"], x) for x in json.load(open(P("audio/ep01/act4/dialogue/lines.json"))))
SPK = {"MAS MANALT": "MAS", "RIMA TAMURI": "RIMA", "GERG MOCKBRAN": "GERG", "TILED EMPLOYEE": "EMPLOYEE"}
SIDE_LABEL = {"MAS": "HIS SIDE", "BOARD": "THE BOARD'S SIDE"}
TAIL = 8        # frames after a shot's last line before its own cut, when the plan gives less (0.33 s)
RAIL_EXTRA = 18  # a rail holds for its read + 0.75 s
LUFS_DIALOGUE = -16.0


def F(s):
    return int(round(s * FPS))


def tc(f):
    e = EP_IN + f
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def length(fr):
    s = fr / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def clean(s):
    return s.strip().strip('"').replace("“", "").replace("”", "")


def floor_f(text):
    return int(math.ceil((0.25 + 0.05 * len(clean(text))) * FPS))


def gain_for(row):
    if row["id"] == "a4-27-00":
        return 0.0
    tgt = row.get("qa", {}).get("target_lufs", LUFS_DIALOGUE)
    return round(LUFS_DIALOGUE - tgt, 2) if row["kind"] == "vo" else 0.0


def norm(w):
    return "".join(ch for ch in w.lower() if ch.isalnum())


placed: dict[str, dict] = {}
out: list[OrderedDict] = []
decisions: list[str] = []
problems: list[str] = []
rails: list[dict] = []
t = 0


def line_abs(spec, start):
    """(abs_in, how, chained_to, gap_frames) for a board line spec"""
    if spec.get("after"):
        prev = placed.get(spec["after"])
        if prev is None:
            problems.append(f"{spec['id']}: its partner {spec['after']} is not placed yet")
            return start, "unplaced partner", None, None
        if spec.get("ov") is not None:
            g = -int(spec["ov"])
            return prev["abs_out"] + g, f"overlap {spec['ov']} f on {spec['after']} (the scripted overlap)", spec["after"], g
        g = F(spec.get("gap", 0.3))
        return prev["abs_out"] + g, f"gap {spec.get('gap', 0.3):.2f} s ({g} f) after {spec['after']} (edit-plan-v4 §5.6)", spec["after"], g
    return start + F(spec.get("at") or 0.0), f"at {spec.get('at') or 0:.2f} s in the shot (the board's cue)", None, None


def resolve(a, start, marks, texts, lines_by_id):
    """a board time (seconds or an anchor) -> an abs frame"""
    if isinstance(a, (int, float)):
        return start + F(a)
    kind = a[0]
    if kind == "word":
        _, lid, w, off = a
        L = lines_by_id[lid]
        for (ww, f0, _f1) in L["words"]:
            if norm(ww).startswith(norm(w)):
                return L["abs_in"] + f0 + F(off)
        problems.append(f"word {w!r} not found in {lid}")
        return L["abs_in"] + F(off)
    if kind == "end":
        _, lid, off = a
        return lines_by_id[lid]["abs_out"] + F(off)
    if kind == "start" or kind == "line":
        _, lid, off = a
        return lines_by_id[lid]["abs_in"] + F(off)
    if kind == "mark":
        _, name, off = a
        return marks[name] + F(off)
    if kind == "text":
        _, idx, off = a
        return texts[idx]["abs_out_read"] + F(off)
    raise ValueError(a)


def all_lines_by_id(extra):
    d = dict(placed)
    d.update(extra)
    return d


for i, bs in enumerate(BOARD["shots"]):
    sid = bs["id"]
    start = t
    # ---- a cut on the turn: this shot starts `lead` before its (chained) first line
    if bs.get("start"):
        _, lid, lead = bs["start"]
        spec = next(x for x in bs["lines"] if x["id"] == lid)
        a, *_ = line_abs(spec, start)
        want = a - F(lead)
        prev = out[-1]
        # the line this turn answers may run across the cut (an L-cut on the reply); everything else in the
        # previous shot (its other lines + tail, its must-read text, its marks) must land before it
        partner = spec.get("after")
        req = max([prev["start_frame"] + 12] + [f for (f, _what, owner) in prev["items"] if owner != partner])
        if want < req:
            decisions.append(f"{sid}: the turn ({lid} - {lead:.2f} s) would cut {prev['id']} before its content lands; the cut moves {req - want} f later")
            want = req
        prev["end_frame"] = want
        prev["frames"] = want - prev["start_frame"]
        prev["length_rule"] = f"cut on the turn into {sid} ({lid} starts {a - want} f after the cut)" + (f"; {prev['length_rule']}" if prev["length_rule"].startswith("grown") and want > prev["start_frame"] + prev["plan_frames"] else "")
        start = want
    # ---- lines
    lines = []
    local = {}
    for spec in bs["lines"]:
        R = REC.get(spec["id"])
        if R is None:
            problems.append(f"{sid}: {spec['id']} not in lines.json")
            continue
        a, how, chained, g = line_abs(spec, start)
        post = R["kind"] == "post"
        fr = None if post else int(R["frames_24"])
        row = OrderedDict(
            id=spec["id"], kind=R["kind"], mode=R["mode"], speaker=SPK.get(R["speaker"], R["speaker"]), text=R["text"], tag=R["tag"],
            abs_in=a, abs_out=(a + fr) if fr else None, frames=fr, placed_by=how, chained_to=chained, gap_frames=g,
            voiced=bool(R.get("voiced_in_cut")) and not post, file=None if post else R["file"], clean=(R.get("clean") or {}).get("file"),
            gain_db=None if post else gain_for(R), target_lufs=R.get("qa", {}).get("target_lufs"),
            side=R.get("side"), os=bool(spec.get("os")) or R["mode"] in ("speaker",), via=spec.get("via"), lip_sync=bool(R.get("lip_sync")),
            take=R.get("take"), cutoff=R.get("cutoff"), derived_from=R.get("derived_from"),
            mouth=[[m["f"], m["shape"]] for m in R.get("mouth", [])] if not post else [],
            words=[[w["w"], w["f0"], w["f1"]] for w in R.get("words", [])] if not post else [],
        )
        if R["kind"] == "vo":
            row["device"] = {"a4-26a-vo1": "D2", "a4-29-vo2": "D3", "a4-29-vo3": "D8"}.get(spec["id"])
        lines.append(row)
        local[spec["id"]] = row
        if not post:
            placed[spec["id"]] = row
    lines_by_id = all_lines_by_id(local)
    # ---- marks (two passes: marks may name text ends and texts may name marks)
    marks: dict[str, int] = {}
    texts: list[dict] = []

    def do_marks(allow_fail):
        for name, a in bs["marks"].items():
            if name in marks:
                continue
            try:
                marks[name] = resolve(a, start, marks, texts, lines_by_id)
            except (KeyError, IndexError):
                if not allow_fail:
                    raise

    do_marks(True)
    for j, tx in enumerate(bs["texts"]):
        a = resolve(tx["at"], start, marks, texts, lines_by_id)
        fl = floor_f(tx["text"])
        typed = math.ceil(len(clean(tx["text"])) / 2) if tx["kind"] == "rail" else 0
        read_end = a + fl
        if tx["kind"] == "rail":
            read_end = a + max(fl, typed)
            end = a + (F(tx["hold"]) if tx.get("hold") is not None else max(fl, typed) + RAIL_EXTRA)
        else:
            end = a + F(tx["hold"]) if tx.get("hold") is not None else None
        texts.append(dict(kind=tx["kind"], text=tx["text"], abs_in=a, abs_out_read=read_end, abs_out=end, floor_f=fl, must=tx["must"],
                          carry=bool(tx.get("carry")), note=tx.get("note", "")))
    do_marks(False)
    # ---- the shot's end: the planned length, grown only to fit its content
    plan_f = F(bs["board_s"])  # the board's length (the plan's, or a logged departure from it)
    need = start
    why_need = None
    items = []  # (frame the shot must reach, what, owning line id or None)
    for l in lines:
        if l["abs_out"] is not None:
            items.append((l["abs_out"] + (F(bs["tail"]) if bs.get("tail") is not None else TAIL), f"{l['id']} + {TAIL} f tail", l["id"]))
    for tx in texts:
        if tx["must"] and not tx["carry"]:
            items.append((tx["abs_out_read"], f"the read floor of {tx['kind']} {clean(tx['text'])[:32]!r} ({tx['floor_f']} f from f{tx['abs_in'] - start})", None))
    for name, m in marks.items():
        items.append((m + 2, f"mark {name}", None))
    for (fr_, what, _o) in items:
        if fr_ > need:
            need, why_need = fr_, what
    end = max(start + plan_f, need)
    rule = "the plan's length (content fits)"
    if bs.get("departure"):
        rule = f"the board's {bs['board_s']:.2f} s (plan {bs['plan_s']:.2f} s: {bs['departure']})"
    if end > start + plan_f:
        rule = f"grown +{end - start - plan_f} f by {why_need}"
    r = OrderedDict(
        id=sid, seq=bs["seq"], side=bs["side"], side_label=SIDE_LABEL[bs["side"]], start_frame=start, end_frame=end, frames=end - start,
        plan_frames=F(bs["plan_s"]), plan_s=bs["plan_s"], board_frames=plan_f, board_s=bs["board_s"], departure=bs.get("departure", ""), content_end=need, length_rule=rule, tag=bs["tag"], size_class=bs["size_class"],
        framing=bs["framing"], move=bs["move"], from_v3=bs["from_v3"], change=bs["change"], does=bs["does"], build=bs["build"],
        style=bs["style"], sound=bs["sound"], badge=bs.get("badge"), whip=bs.get("whip"), start_rule=bs.get("start"),
        lines=lines, texts=texts, marks=marks, items=items,
    )
    out.append(r)
    t = end

# ---- the final length of every shot against its plan (after the turns): the decisions a reader needs
for r in out:
    d = r["frames"] - r["plan_frames"]
    if d:
        decisions.append(f"{r['id']}: planned {r['plan_s']:.2f} s, locked {r['frames'] / FPS:.2f} s ({d:+d} f): {r['length_rule']}")
# ---- second pass: finalise per-shot relative times, post line ends, rails (clamped at a new place), checks
ACT = out[-1]["end_frame"]
SEQ_END = {}
for r in out:
    SEQ_END[r["seq"]] = r["end_frame"]
for i, r in enumerate(out):
    s0, e0 = r["start_frame"], r["end_frame"]
    r["dur_s"] = round(r["frames"] / FPS, 3)
    r["tc_in"], r["tc_out"] = tc(s0), tc(e0)
    r["lock_delta_f"] = r["frames"] - r["plan_frames"]
    for l in r["lines"]:
        if l["abs_out"] is None:  # a post: on screen from its pop to the cut
            l["abs_out"] = e0
            l["frames"] = e0 - l["abs_in"]
        l["at"], l["end"] = l["abs_in"] - s0, l["abs_out"] - s0
        l["tc_in"] = tc(l["abs_in"])
        l["crosses_cut"] = max(0, l["abs_out"] - e0)
    for tx in r["texts"]:
        if tx["kind"] == "rail":
            # a rail never runs into a new sequence (a new place); it may run into the next shot of its own
            lim = SEQ_END[r["seq"]] if tx["carry"] else e0
            if tx["abs_out"] > lim:
                decisions.append(f"{r['id']}: rail {clean(tx['text'])[:28]!r} clears at the {'sequence' if tx['carry'] else 'shot'} end ({tx['abs_out'] - lim} f early)")
                tx["abs_out"] = lim
            rails.append(dict(text=tx["text"], s=tx["abs_in"], e=tx["abs_out"], shot=r["id"], floor_f=tx["floor_f"]))
        elif tx["abs_out"] is None:
            tx["abs_out"] = e0
        tx["at"], tx["end"] = tx["abs_in"] - s0, tx["abs_out"] - s0
        if tx["must"] and not (tx["carry"] and tx["kind"] != "rail") and tx["abs_out_read"] > (tx["abs_out"] if tx["kind"] == "rail" else e0):
            problems.append(f"{r['id']}: {tx['kind']} {clean(tx['text'])[:30]!r} is up {min(tx['abs_out'], e0) - tx['abs_in']} f, under its read floor {tx['floor_f']} f")
    r["marks"] = {k: v - s0 for k, v in r["marks"].items()}
    del r["content_end"], r["items"]
# rails must not overlap: a new rail replaces the old
rails.sort(key=lambda x: x["s"])
for a, b in zip(rails, rails[1:]):
    if a["e"] > b["s"]:
        decisions.append(f"rail {clean(a['text'])[:24]!r} is replaced by {clean(b['text'])[:24]!r} {a['e'] - b['s']} f early")
        a["e"] = b["s"]

# ---- sound marks (the four stops and the designed rests) on the act clock
SH = {r["id"]: r for r in out}
LN = {l["id"]: l for r in out for l in r["lines"]}


def mark_abs(shot, m):
    r = SH[shot]
    if isinstance(m, (int, float)):
        return r["start_frame"] + F(m)
    if isinstance(m, str):
        return r["start_frame"] + r["marks"][m]
    if m[0] == "line":
        return LN[m[1]]["abs_in"]
    raise ValueError(m)


sound_marks = []
for sm in BOARD["sound_marks"]:
    a = mark_abs(sm["shot"], sm["mark"])
    u = sm.get("until")
    if u is None:
        b = None
    elif u[0] == "shot":
        b = SH[u[1]]["start_frame"] + F(u[2])
    elif u[0] == "mark":
        b = SH[u[1]]["start_frame"] + SH[u[1]]["marks"][u[2]]
    elif u[0] == "shot_end":
        b = SH[u[1]]["end_frame"]
    elif u[0] == "line":
        b = LN[u[1]]["abs_in"]
    else:
        b = None
    sound_marks.append(dict(sm, abs=a, tc=tc(a), abs_until=b, seconds=round((b - a) / FPS, 2) if b is not None else None))
D6 = next(x for x in sound_marks if x["kind"] == "stop" and x["n"] == 1)

# ---- sequences
seqs = []
for q in BOARD["sequences"]:
    ss = [r for r in out if r["seq"] == q["id"]]
    s0, e0 = ss[0]["start_frame"], ss[-1]["end_frame"]
    seqs.append(OrderedDict(id=q["id"], chapter=q["chapter"], title=q["title"], place=q["place"], question=q["question"], turn=q["turn"],
                            cue=q["cue"], bed=q["bed"], v3=q["v3"], shots=len(ss), start_frame=s0, end_frame=e0, frames=e0 - s0,
                            seconds=round((e0 - s0) / FPS, 2), plan_s=q["plan_s"], tc_in=tc(s0), tc_out=tc(e0)))

# ---- stats (spotting tools, never gates)
lens = [r["frames"] / FPS for r in out]
runs = []
cur = []
for r in out:
    if r["frames"] / FPS < 1.6:
        cur.append(r["id"])
    else:
        if len(cur) >= 3:
            runs.append(list(cur))
        cur = []
if len(cur) >= 3:
    runs.append(cur)
runs2 = []
cur = []
for r in out:
    if r["frames"] / FPS < 2.0:
        cur.append(r["id"])
    else:
        if len(cur) >= 3:
            runs2.append(list(cur))
        cur = []
if len(cur) >= 3:
    runs2.append(cur)
cuts = [r["start_frame"] for r in out[1:]]
win_max, win_at = 0, 0
for c in [0] + cuts:
    n = sum(1 for x in cuts if c <= x < c + 10 * FPS)
    if n > win_max:
        win_max, win_at = n, c
windows5 = []
for c in cuts:
    n = sum(1 for x in cuts if c <= x < c + 10 * FPS)
    if n >= 5:
        windows5.append((c, n))
voiced = sorted([l for l in LN.values() if l["voiced"]], key=lambda l: l["abs_in"])
gaps = [dict(a=a["id"], b=b["id"], gap_frames=b["abs_in"] - a["abs_out"], gap_s=round((b["abs_in"] - a["abs_out"]) / FPS, 3), chained=b["chained_to"] == a["id"])
        for a, b in zip(voiced, voiced[1:])]
chained_g = [g["gap_s"] for g in gaps if g["chained"]]
hist = OrderedDict()
for lo, hi in [(0, 1.0), (1.0, 1.5), (1.5, 2.0), (2.0, 2.5), (2.5, 3.0), (3.0, 4.0), (4.0, 5.0), (5.0, 6.0), (6.0, 99)]:
    hist[f"{lo:.1f}-{hi:.1f}" if hi < 99 else f"{lo:.1f}+"] = sum(1 for x in lens if lo <= x < hi)
stats = OrderedDict(
    shots=len(out), act_frames=ACT, act_seconds=round(ACT / FPS, 3), act_length=length(ACT), episode_in=tc(0), episode_out=tc(ACT),
    plan_seconds=round(sum(s["plan_s"] for s in BOARD["shots"]), 2), board_seconds=round(sum(s["board_s"] for s in BOARD["shots"]), 2),
    mean_s=round(statistics.mean(lens), 3), median_s=round(statistics.median(lens), 3), min_s=round(min(lens), 3), max_s=round(max(lens), 3),
    under_1s=sum(1 for x in lens if x < 1.0), under_1_5s=sum(1 for x in lens if x < 1.5), under_1_6s=sum(1 for x in lens if x < 1.6), under_2s=sum(1 for x in lens if x < 2.0),
    runs_3plus_under_1_6s=runs, runs_3plus_under_2s=runs2, max_cuts_in_10s=win_max, max_cuts_in_10s_at=tc(win_at),
    windows_with_5plus_cuts=[dict(tc=tc(c), cuts=n) for c, n in windows5], histogram_s=hist,
    exchange_gap_median_s=round(statistics.median(chained_g), 3) if chained_g else None,
    exchange_gaps_s=sorted(chained_g), D6_frames=[D6["abs"], D6["abs_until"]], D6_seconds=D6["seconds"],
    changed_vs_plan=[d for d in decisions if ": planned " in d],
)

lock = OrderedDict(
    meta=OrderedDict(show="MR. MAS", episode="ep01", act="ACT FOUR · THE BLIP, TOLD TWICE", script="draft 4.0 (the flow pass)", board="board v4 (shots-v4.json)",
                     takes="lines.json (the 3.2 takes; v4: a4-25-10b is an edit of a4-25-10's take)", lock="timing lock v4", owner="THE EDITOR (picture pass v4)",
                     generator="studio/src/episodes/ep01/act4/animatic/tools/lock_v4.py", fps=FPS,
                     rules=["lines take their length from their takes", "replies are spaced by the plan's gap for that exchange, or its scripted overlap (never uniform)",
                            "cuts on the turn start a set lead before the line; nothing snaps to a beat grid",
                            "a shot keeps its planned length unless its content needs more (a line + tail, a must-read item at its read floor, in order)",
                            "rails type on, hold for the read + 0.75 s and clear; never across a new place",
                            "story marks are resolved to frames here for the layouts and the sound pass"],
                     note="Guides, not gates (flow-and-continuity). Nothing here was watched or heard: a human must still watch and listen (edit-plan-v4 §8)."),
    summary=stats, sequences=seqs, shots=out, rails=rails, sound_marks=sound_marks, lines_gaps=gaps,
    audio_cues=[dict(id=l["id"], shot=next(r["id"] for r in out if l in r["lines"]), kind=l["kind"], abs=l["abs_in"], frames=l["frames"], file=l["file"], clean=l["clean"],
                     gain_db=l["gain_db"], mode=l["mode"], os=l["os"], via=l["via"], text=l["text"], speaker=l["speaker"]) for l in voiced],
    posts=[dict(id=l["id"], shot=r["id"], abs=l["abs_in"], frames=l["frames"], text=l["text"], speaker=l["speaker"], tag=l["tag"]) for r in out for l in r["lines"] if l["kind"] == "post"],
    decisions=decisions, problems=problems,
)
json.dump(lock, open(os.path.join(PROD, "shots-locked-v4.json"), "w"), indent=1, ensure_ascii=False)

# ================================================================================================ data-v4.ts
ts_shots = []
for r in out:
    ts_shots.append(dict(
        id=r["id"], seq=r["seq"], side=r["side"], badge=r["badge"], whip=r["whip"], tag=r["tag"], cls=r["size_class"], framing=r["framing"], move=r["move"],
        s=r["start_frame"], e=r["end_frame"], plan=r["plan_frames"], v3=r["from_v3"], style=r["style"], does=r["does"], build=r["build"], sound=r["sound"],
        lines=[dict(id=l["id"], kind=l["kind"], mode=l["mode"], who=l["speaker"], text=l["text"], s=l["at"], e=l["end"], side=l["side"], os=l["os"], via=l["via"],
                    lip=l["lip_sync"], mouth=l["mouth"], words=l["words"]) for l in r["lines"]],
        texts=[dict(kind=x["kind"], text=x["text"], s=x["at"], e=x["end"], must=x["must"]) for x in r["texts"] if x["kind"] != "rail"],
        marks=r["marks"],
    ))
# v4.2: the review band names a speaker only once the picture has (a plate, a card, a call tile), as the timed transcript
# does (report_v4.py UNNAMED_V4): both fresh reads of v4.1 learned NELEH, MADA and ADELINA from the band before the
# picture had named them. Before that, the band says what a viewer can hear or see.
SHOWN_AS = {"a4-25-10b": "A WOMAN'S VOICE", "a4-25-11": "THE SAME VOICE", "a4-25-12": "THE SAME VOICE", "a4-25-13": "THE SAME VOICE",
            "a4-25-02": "A MAN'S VOICE", "a4-27-05": "AN EMPLOYEE", "a4-27-15": "A WOMAN IN MARIO'S OFFICE"}
subs = []
for l in sorted([l for r in out for l in r["lines"]], key=lambda l: l["abs_in"]):
    subs.append(dict(s=l["abs_in"], e=l["abs_out"], hold_to=l["abs_out"] + (12 if l["kind"] != "post" else 0), who=SHOWN_AS.get(l["id"], l["speaker"]), text=l["text"], kind=l["kind"],
                     mode=l["mode"], id=l["id"], os=l["os"]))
for a, b in zip(subs, subs[1:]):
    a["hold_to"] = min(a["hold_to"], max(a["e"], b["s"]))
ts = [
    "// GENERATED by tools/lock_v4.py from shots-v4.json + lines.json (THE EDITOR's timing lock v4). Do not hand-edit: re-run lock_v4.py.",
    "/* eslint-disable */",
    "export interface LineV4 { id: string; kind: 'dialogue' | 'vo' | 'post'; mode: string; who: string; text: string; s: number; e: number; side: string | null; os: boolean; via: string | null; lip: boolean; mouth: Array<[number, string]>; words: Array<[string, number, number]>; }",
    "export interface TextV4 { kind: string; text: string; s: number; e: number; must: boolean; }",
    "export interface ShotV4 { id: string; seq: string; side: 'MAS' | 'BOARD'; badge: string | null; whip: string | null; tag: string; cls: string; framing: string; move: string; s: number; e: number; plan: number; v3: string[]; style: string; does: string; build: string; sound: string; lines: LineV4[]; texts: TextV4[]; marks: Record<string, number>; }",
    "export interface RailV4 { text: string; s: number; e: number; shot: string; }",
    "export interface SeqV4 { id: string; chapter: string; title: string; s: number; e: number; cue: string; }",
    "export interface SubV4 { s: number; e: number; hold_to: number; who: string; text: string; kind: string; mode: string; id: string; os: boolean; }",
    f"export const ACT_FRAMES = {ACT};",
    f"export const EP_IN_FRAMES = {EP_IN};",
    f"export const PLAN_FRAMES = {sum(r['plan_frames'] for r in out)};",
    f"export const D6: [number, number] = [{D6['abs']}, {D6['abs_until']}];",
    "export const SEQS: SeqV4[] = " + json.dumps([dict(id=q["id"], chapter=q["chapter"], title=q["title"], s=q["start_frame"], e=q["end_frame"], cue=q["cue"]) for q in seqs], ensure_ascii=False, separators=(",", ":")) + ";",
    "export const RAILS: RailV4[] = " + json.dumps([dict(text=x["text"], s=x["s"], e=x["e"], shot=x["shot"]) for x in rails], ensure_ascii=False, separators=(",", ":")) + ";",
    "export const SUBS: SubV4[] = " + json.dumps(subs, ensure_ascii=False, separators=(",", ":")) + ";",
    "export const SHOTS: ShotV4[] = " + json.dumps(ts_shots, ensure_ascii=False, separators=(",", ":")) + ";",
    "",
]
open(P("studio/src/episodes/ep01/act4/animatic/data-v4.ts"), "w").write("\n".join(ts))

print(f"lock v4: {len(out)} shots, {ACT} f = {length(ACT)} (plan {stats['plan_seconds']} s), {tc(0)} -> {tc(ACT)}")
print(f"  mean {stats['mean_s']} s, median {stats['median_s']} s, min {stats['min_s']}, under 2 s {stats['under_2s']}, under 1.5 s {stats['under_1_5s']}, under 1.6 s {stats['under_1_6s']}")
print(f"  runs of 3+ under 1.6 s: {runs}; under 2 s: {runs2}; max cuts in 10 s: {win_max} at {tc(win_at)}")
print(f"  exchange gap median {stats['exchange_gap_median_s']} s; D6 {stats['D6_seconds']} s")
for q in seqs:
    print(f"  {q['id']}: {q['shots']} shots, {q['seconds']} s (plan {q['plan_s']})")
print("decisions:")
for d in decisions:
    print("  ", d)
print("problems:", problems or "none")
