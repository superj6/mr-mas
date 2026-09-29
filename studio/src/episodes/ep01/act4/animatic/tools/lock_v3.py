"""lock_v3.py - THE EDITOR's timing lock v3 for Ep1 Act Four (sc 24-31, incl. 26A, 28), script DRAFT 3.2.

Inputs (read-only):
  show/episodes/ep01/production/act4/shots-v3.json   board 3 (sized to the 3.2 TARGET spans; conversations cut on the turn)
  audio/ep01/act4/dialogue/lines.json                the 3.2 RE-RECORD: 46 voiced lines at pace (frames_24, mouth cues,
                                                     word timings, and the dialogue editor's placement relations:
                                                     overlap_with / overlap_prev_frames, gap_with / gap_prev_s)
Outputs (generated; re-run after any re-record, ruling or re-board, never hand-edit):
  show/episodes/ep01/production/act4/shots-locked-v3.json   the lock: exact frames, every line, every cue, checks
  studio/src/episodes/ep01/act4/animatic/data-v3.ts         the same timing for the Remotion / Node animatic
  (timing-v3.md is written by report_v3.py, which also reads the sound mix's report.)

The lock rules (timing-v3.md section 2):
  * Every voiced line takes its length from its take (frames_24). Nothing is lengthened for a window, a box or a typist.
  * A line that ANSWERS or FOLLOWS another inside an exchange is chained to it: it starts where the previous line ends,
    minus the marked overlap (lines.json overlap_prev_frames), or plus the marked gap (gap_prev_s: the scripted pauses,
    <= 1 s), or plus the default gap (the board's own gap clamped to 3-7 f = 0.125-0.29 s).
    A line is chained when lines.json names the relation, or when the board put it <= 8 f after the previous voiced line.
  * Conversation cuts land on the turn: a cut-on-the-turn shot (board on_grid = false) starts at its first line's start
    minus the board's lead (its `at`; a negative `at` is the L-cut pre-lap, kept frame-accurate).
  * A shot inside a conversation block that carries lines keeps the board's TAIL after its last line (the listener's
    hold, a read floor, a rack); its length follows the take. Every other shot keeps the board's length (set-pieces,
    inserts, cards, posts, holds: they are cut to their music and their staged action), unless a take overruns it:
    then it grows by exactly the overrun (frame-accurate, never to the grid).
  * V.O.: ends >= 1 beat before its shot's cut and before the next spoken line (pov-and-framing 5.1): a shot grows by
    the shortfall if needed.
  * No padding: no block is closed back onto the beat grid. Each set-piece is cut to its own music from its own
    first frame (mix_v3.py lays each cue section from the set-piece's cut).
Run:  python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v3.py
"""
from __future__ import annotations
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

import json
import math
import os
import statistics
from collections import OrderedDict

P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
PROD = P("show/episodes/ep01/production/act4")

FPS, BEAT, BAR = 24, 15, 60
EP_IN = (12 * 60 + 31) * FPS  # act frame 0 = episode 12:31:00

BOARD = json.load(open(os.path.join(PROD, "shots-v3.json")))
REC = OrderedDict((x["id"], x) for x in json.load(open(P("audio/ep01/act4/dialogue/lines.json"))))

# the board's conversation blocks (shots-v3 board_calls: "cut on the turn ... each block closed by its last shot")
CONV_BLOCKS = [("26.09", "26.09"), ("27.05", "27.05c"), ("27.07", "27.09"), ("27.13", "27.19"), ("27.21", "27.23"),
               ("29.11a", "29.17"), ("30.06", "30.06b"), ("30.11a", "30.15"), ("31.02", "31.02")]
DEFAULT_GAP = 4          # 0.167 s: inside the 0.10-0.30 s band
GAP_MIN, GAP_MAX = 3, 7  # 0.125-0.29 s
CHAIN_MAX = 8            # a board gap <= 8 f is an exchange (a reply), not a staged pause
MIN_TAIL = 3             # a line never runs into its own hard cut without at least 3 f unless the board L-cuts it
SPK = {"MAS MANALT": "MAS", "RIMA TAMURI": "RIMA", "GERG MOCKBRAN": "GERG", "TILED EMPLOYEE": "EMPLOYEE"}
SIDE_LABEL = {"MAS": "HIS SIDE", "BOARD": "THE BOARD'S SIDE"}
LUFS_DIALOGUE = -16.0


def tc(f):
    e = EP_IN + f
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def length(fr):
    s = fr / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def grid(fr):
    bars, rem = divmod(fr, BAR)
    beats, fx = divmod(rem, BEAT)
    parts = []
    if bars:
        parts.append(f"{bars} bar" + ("s" if bars > 1 else ""))
    if beats:
        parts.append(f"{beats} beat" + ("s" if beats > 1 else ""))
    if fx:
        parts.append(f"{fx} f")
    return " + ".join(parts) or "0"


def gain_for(row):
    """premix gain (dB) to the house dialogue level: V.O. is delivered at -18 and sits AT dialogue level (+2 dB,
    pov-and-framing 5.1); the laptop-speaker 'super.' keeps its delivered -22."""
    if row["id"] == "a4-27-00":
        return 0.0
    tgt = row.get("qa", {}).get("target_lufs", LUFS_DIALOGUE)
    if row["kind"] == "vo":
        return round(LUFS_DIALOGUE - tgt, 2)
    return 0.0


ids = [s["id"] for s in BOARD["shots"]]
IDX = {s: i for i, s in enumerate(ids)}
BLOCK_OF = {}
for a, b in CONV_BLOCKS:
    for i in range(IDX[a], IDX[b] + 1):
        BLOCK_OF[ids[i]] = (a, b)


def board_lines(bs):
    """the board's voiced lines and posts of a shot, in cue order, with their board frames"""
    rows = []
    for d in bs["dialogue"]:
        post = d.get("voiced") is False
        fr = d.get("held") if post else (d.get("frames") or d["end"] - d["at"])
        rows.append(dict(d, _post=post, _vo=False, _fr=fr))
    for d in bs["vo"]:
        rows.append(dict(d, _post=False, _vo=True, _fr=d.get("frames") or d["end"] - d["at"]))
    rows.sort(key=lambda r: r["at"])
    return rows


# ================================================================================================ pass 1: board clock
board_abs = {}  # line id -> (abs_in, abs_out) on the board's clock
for bs in BOARD["shots"]:
    for d in board_lines(bs):
        if not d["_post"]:
            board_abs[d["id"]] = (bs["start_frame"] + d["at"], bs["start_frame"] + d["at"] + d["_fr"])
order = sorted(board_abs, key=lambda k: board_abs[k][0])
board_prev = {}
for i, k in enumerate(order):
    board_prev[k] = order[i - 1] if i else None

# ================================================================================================ pass 2: the lock
out = []
placed = OrderedDict()  # line id -> dict(abs_in, abs_out)
problems, decisions, growth = [], [], []
t = 0
for i, bs in enumerate(BOARD["shots"]):
    sid = bs["id"]
    blk = BLOCK_OF.get(sid)
    bl = board_lines(bs)
    voiced = [d for d in bl if not d["_post"]]
    start = t

    def chain_of(d):
        """how a line is placed: ('prev', gap_frames, why) chained to the previous voiced line, or ('shot', at, why)"""
        R = REC[d["id"]]
        pv = board_prev.get(d["id"])
        if R.get("overlap_with"):
            return ("prev", -int(R["overlap_prev_frames"]), f"overlap {R['overlap_prev_frames']} f on {R['overlap_with']} (cue sheet)", R["overlap_with"])
        if R.get("gap_with"):
            g = int(round(R["gap_prev_s"] * FPS))
            why = "scripted gap" if g > GAP_MAX else "marked gap"
            return ("prev", g, f"{why} {R['gap_prev_s']:.3f} s ({g} f) after {R['gap_with']}", R["gap_with"])
        if pv is not None and blk is not None:
            bg = board_abs[d["id"]][0] - board_abs[pv][1]
            if bg <= CHAIN_MAX:
                g = min(GAP_MAX, max(GAP_MIN, bg))
                return ("prev", g, f"reply: gap {g} f ({g / FPS:.2f} s) after {pv} (board {bg} f)", pv)
        if pv is not None and bs["scene"] == "25":
            bg = board_abs[d["id"]][0] - board_abs[pv][1]
            if 0 <= bg <= CHAIN_MAX:
                return ("prev", min(GAP_MAX, max(GAP_MIN, bg)), f"the blueprint read continues: gap after {pv} (board {bg} f)", pv)
        return ("shot", d["at"], "the board's cue in the shot", None)

    # ---- a cut on the turn: the shot starts on its first line (minus the board's lead)
    turn = False
    if voiced and blk is not None and not bs["on_grid"]:
        d0 = voiced[0]
        how = chain_of(d0)
        if how[0] == "prev" and how[3] in placed:
            ls = placed[how[3]]["abs_out"] + how[1]
            start = ls - d0["at"]
            turn = True
            if out:
                prev = out[-1]
                if start <= prev["start_frame"] + 4:
                    problems.append(f"{sid}: the turn at {start} would leave {prev['id']} under 5 f")
                prev["end_frame"] = start
    # ---- place the lines
    lines = []
    for d in bl:
        lid = d["id"]
        R = REC.get(lid)
        if R is None:
            problems.append(f"{sid}: {lid} not in lines.json")
            continue
        kind = R["kind"]
        if d["_post"]:
            a = start + d["at"]
            fr = d["_fr"]
            how = ("shot", d["at"], "post: the board's pop and hold", None)
        else:
            fr = int(R["frames_24"])
            how = chain_of(d)
            if how[0] == "prev" and how[3] in placed:
                a = placed[how[3]]["abs_out"] + how[1]
            else:
                a = start + d["at"]
                if how[0] == "prev":
                    how = ("shot", d["at"], "the board's cue (its partner is not placed yet)", None)
        row = OrderedDict(
            id=lid, kind=kind, mode=R["mode"], speaker=SPK.get(R["speaker"], R["speaker"]), text=R["text"], tag=R["tag"],
            abs_in=a, abs_out=a + fr, frames=fr, placed_by=how[2], chained_to=how[3] if how[0] == "prev" else None,
            gap_frames=how[1] if how[0] == "prev" else None,
            board_abs_in=board_abs.get(lid, (None,))[0], board_frames=d["_fr"],
            voiced=bool(R.get("voiced_in_cut")) and kind != "post", file=None if kind == "post" else R["file"],
            gain_db=gain_for(R) if kind != "post" else None, target_lufs=R.get("qa", {}).get("target_lufs"),
            side=R.get("side"), os=bool(d.get("os")), lip_sync=bool(R.get("lip_sync")), take=R.get("take"),
            cutoff=R.get("cutoff"), sync=R.get("sync"),
            mouth=[[m["f"], m["shape"]] for m in R.get("mouth", [])] if kind != "post" else [],
            words=[[w["w"], w["f0"], w["f1"]] for w in R.get("words", [])] if kind != "post" else [],
        )
        if kind == "post":
            row["read_min"] = int(math.ceil((0.25 + 0.05 * len(R["text"].strip('"'))) * FPS))
        if d["_vo"]:
            row["device"] = d.get("device")
            row["caught_by"] = d.get("caught_by")
        if kind != "post":
            placed[lid] = row
        lines.append(row)
    lines.sort(key=lambda r: r["abs_in"])

    # ---- the shot's end
    bframes = bs["frames"]
    end = start + bframes
    why = "the board's length (set-piece / staged action / read floor)"
    vl = [l for l in lines if l["kind"] != "post"]
    if blk is not None and vl:
        last = max(vl, key=lambda l: l["abs_out"])
        bl_last = board_abs[last["id"]]
        tail = bs["end_frame"] - bl_last[1]  # the board's tail after this shot's last line (negative = L-cut)
        end = last["abs_out"] + tail
        why = f"the take + the board's tail ({tail:+d} f after {last['id']})"
    # overrun: a line may cross its cut only as far as the board let it, or as an L-cut (<= 8 f) into a shot whose
    # first line continues the read (a chained reply); a line overlapped by a later line in its own shot is exempt
    nxt_bs = BOARD["shots"][i + 1] if i + 1 < len(BOARD["shots"]) else None
    nxt_first = next((d for d in board_lines(nxt_bs) if not d["_post"]), None) if nxt_bs else None
    for l in vl:
        if any(m["chained_to"] == l["id"] and m["abs_in"] < l["abs_out"] for m in vl):
            continue
        bcross = max(0, board_abs[l["id"]][1] - bs["end_frame"])
        allow = bcross if bcross else -MIN_TAIL
        if nxt_first is not None and board_prev.get(nxt_first["id"]) == l["id"] and 0 <= board_abs[nxt_first["id"]][0] - board_abs[l["id"]][1] <= CHAIN_MAX:
            allow = max(allow, 8)
        if l["kind"] == "vo":
            allow = -BEAT
        if l["abs_out"] - end > allow:
            new_end = l["abs_out"] - allow
            growth.append((sid, l["id"], l["frames"], l["board_frames"]))
            end = new_end
            why = f"grown by the take ({l['id']})"
    r = OrderedDict(
        id=sid, scene=bs["scene"], chunk=bs["chunk"], side=bs["side"], side_label=SIDE_LABEL[bs["side"]],
        start_frame=start, end_frame=end, board_start=bs["start_frame"], board_frames=bframes,
        tag=bs["tag"], shotSize=bs["shotSize"], size_class=bs["size_class"], framing=bs["framing"], framing_note=bs["framing_note"],
        angle=bs["angle"], move=bs["move"], move_type=bs["move_type"], box=bs["box"], change=bs["change"], v2_id=bs["v2_id"],
        fv3_id=bs["fv3_id"], block="–".join(blk) if blk else None, turn_cut=turn, length_rule=why,
        room=bs["room"], characters=bs["characters"], action=bs["action"], text=bs["text"], lines=lines,
        rail_change=bs["rail_change"], rail_shown=bs["rail_shown"], style=bs["style"], switches=bs["switches"],
        drop_out=bs["drop_out"], quiet_beat=bs["quiet_beat"], sfx=bs["sfx"], music=bs["music"], gags=bs["gags"],
        notes=bs["notes"], standin=bs["standin"], assets=bs["assets"], record_items=bs["record_items"],
        hand_in_frame=bs["hand_in_frame"], logged_as=bs["logged_as"], faces_hands=bs["faces_hands"],
        face_frames=bs["face_frames"],
    )
    out.append(r)
    t = end

# finalize lengths (a turn may have moved a previous shot's end)
for j, r in enumerate(out):
    if j + 1 < len(out):
        r["end_frame"] = out[j + 1]["start_frame"]
    r["frames"] = r["end_frame"] - r["start_frame"]
    r["dur_s"] = round(r["frames"] / FPS, 3)
    r["grid"] = grid(r["frames"])
    r["tc_in"], r["tc_out"] = tc(r["start_frame"]), tc(r["end_frame"])
    r["lock_delta"] = r["frames"] - r["board_frames"]
    for l in r["lines"]:
        l["at"] = l["abs_in"] - r["start_frame"]
        l["end"] = l["abs_out"] - r["start_frame"]
        l["tc_in"] = tc(l["abs_in"])
        l["crosses_cut"] = max(0, l["abs_out"] - r["end_frame"])
    if r["frames"] < 6:
        problems.append(f"{r['id']}: only {r['frames']} f")
TOTAL = out[-1]["end_frame"]
for sid, lid, fr, bfr in growth:
    r = next(x for x in out if x["id"] == sid)
    if r["lock_delta"] > 0 and not (IDX[sid] + 1 < len(out) and out[IDX[sid] + 1]["turn_cut"]):
        decisions.append(f"{sid}: {lid}'s take ({fr} f, board {bfr}) overruns the board's cut: the shot grows {r['lock_delta']:+d} f (frame-accurate)")

# ---- V.O. clearance: >= 1 beat before the cut and the next spoken line
SPOKEN = sorted([(l["abs_in"], l["abs_out"], l["id"]) for r in out for l in r["lines"] if l["kind"] == "dialogue"])
vo_rows = []
for j, r in enumerate(out):
    for l in r["lines"]:
        if l["kind"] != "vo":
            continue
        nxt = [s for s in SPOKEN if s[0] >= l["abs_out"]]
        prv = [s for s in SPOKEN if s[1] <= l["abs_in"]]
        clr = dict(to_cut=r["end_frame"] - l["abs_out"], next_spoken=(nxt[0][2], nxt[0][0] - l["abs_out"]) if nxt else None,
                   prev_spoken=(prv[-1][2], l["abs_in"] - prv[-1][1]) if prv else None)
        issues = []
        if clr["to_cut"] < BEAT:
            issues.append(f"ends {clr['to_cut']} f before the cut")
        if nxt and nxt[0][0] - l["abs_out"] < BEAT and not REC[nxt[0][2]].get("gap_with") == l["id"]:
            issues.append(f"ends {nxt[0][0] - l['abs_out']} f before {nxt[0][2]}")
        vo_rows.append(OrderedDict(id=l["id"], shot=r["id"], text=l["text"], abs_in=l["abs_in"], abs_out=l["abs_out"], tc_in=l["tc_in"],
                                   frames=l["frames"], clearances=clr, issues=issues, ok=not issues))
        problems.extend(f"V.O. {l['id']}: {x}" for x in issues)

# ================================================================================================ measures
voiced = sorted([l for r in out for l in r["lines"] if l["kind"] != "post"], key=lambda l: l["abs_in"])
gaps = []
for a, b in zip(voiced, voiced[1:]):
    gaps.append(OrderedDict(a=a["id"], b=b["id"], gap_frames=b["abs_in"] - a["abs_out"], gap_s=round((b["abs_in"] - a["abs_out"]) / FPS, 3),
                            chained=b["chained_to"] == a["id"]))
ex_gaps = [g["gap_s"] for g in gaps if g["chained"]]
cover = [0] * TOTAL
for l in voiced:
    for f in range(max(0, l["abs_in"]), min(TOTAL, l["abs_out"])):
        cover[f] = 1
runs, cur, st = [], 0, 0
for f, c in enumerate(cover + [1]):
    if c == 0:
        if cur == 0:
            st = f
        cur += 1
    else:
        if cur:
            runs.append((cur, st))
        cur = 0
long_runs = sorted([r for r in runs if r[0] > 6 * FPS], reverse=True)


def shot_at(f):
    for r in out:
        if r["start_frame"] <= f < r["end_frame"]:
            return r["id"]
    return out[-1]["id"]


# shares by size class (time-weighted)
by_cls = OrderedDict()
for r in out:
    c = r["size_class"]
    by_cls.setdefault(c, [0, 0])
    by_cls[c][0] += 1
    by_cls[c][1] += r["frames"]
shares = OrderedDict((c, OrderedDict(shots=n, frames=fr, pct=round(100 * fr / TOTAL, 1))) for c, (n, fr) in sorted(by_cls.items(), key=lambda x: -x[1][1]))
runs3 = []
for j in range(2, len(out)):
    a, b, c = out[j - 2]["size_class"], out[j - 1]["size_class"], out[j]["size_class"]
    if a == b == c:
        runs3.append((out[j - 2]["id"], out[j]["id"], a))

scenes = OrderedDict()
for r in out:
    s = scenes.setdefault(r["scene"], OrderedDict(scene=r["scene"], start_frame=r["start_frame"], end_frame=r["end_frame"], shots=0))
    s["end_frame"] = r["end_frame"]
    s["shots"] += 1
for s in scenes.values():
    s["frames"] = s["end_frame"] - s["start_frame"]
    s["length"] = length(s["frames"])
    s["tc_in"], s["tc_out"] = tc(s["start_frame"]), tc(s["end_frame"])
    bs = [x for x in BOARD["scenes"] if x["id"] == s["scene"]]
    s["board_frames"] = bs[0]["frames"] if bs else None
chunks = []
for c in BOARD["chunks"]:
    a, b = c["first"], c["last"]
    sa = next(r for r in out if r["id"] == a)
    sb = next(r for r in out if r["id"] == b)
    chunks.append(OrderedDict(id=c["id"], title=c["title"], first=a, last=b, start_frame=sa["start_frame"], end_frame=sb["end_frame"],
                              frames=sb["end_frame"] - sa["start_frame"], tc_in=tc(sa["start_frame"]), tc_out=tc(sb["end_frame"])))

D6 = None
d6 = [r for r in out if r["drop_out"]]
if d6:
    a = next(r for r in out if r["drop_out"] and "start" in r["drop_out"])
    b = next(r for r in out if r["drop_out"] and "ends" in r["drop_out"])
    D6 = OrderedDict(start=a["start_frame"], end=b["start_frame"], frames=b["start_frame"] - a["start_frame"], from_shot=a["id"], to_shot=b["id"])
    if D6["frames"] != 5 * BEAT:
        problems.append(f"D6 runs {D6['frames']} f, needs 75 (5 beats)")

audio_cues = [OrderedDict(id=l["id"], shot=r["id"], kind=l["kind"], abs=l["abs_in"], frames=l["frames"], file=l["file"], gain_db=l["gain_db"],
                          mode=l["mode"], tag=l["tag"], text=l["text"], speaker=l["speaker"])
              for r in out for l in r["lines"] if l["kind"] != "post" and l["voiced"]]
posts = [OrderedDict(id=l["id"], shot=r["id"], abs=l["abs_in"], frames=l["frames"], text=l["text"], speaker=l["speaker"], tag=l["tag"])
         for r in out for l in r["lines"] if l["kind"] == "post"]
summary = OrderedDict(
    act_frames=TOTAL, act_seconds=round(TOTAL / FPS, 3), act_length=length(TOTAL), episode_in=tc(0), episode_out=tc(TOTAL),
    board_frames=BOARD["meta"]["frames"], delta_vs_board=TOTAL - BOARD["meta"]["frames"], v2_frames=10890,
    shots=len(out), voiced_lines=len(voiced), posts=len(posts),
    dialogue_audible_frames=sum(cover), dialogue_coverage_pct=round(100 * sum(cover) / TOTAL, 1),
    median_gap_in_exchange_s=round(statistics.median(ex_gaps), 3) if ex_gaps else None,
    median_gap_all_lines_s=round(statistics.median([g["gap_s"] for g in gaps]), 3),
    exchange_gaps=len(ex_gaps), max_gap_in_exchange_s=max(ex_gaps) if ex_gaps else None,
    stretches_over_6s_without_voice=[OrderedDict(frames=n, seconds=round(n / FPS, 2), start_frame=s0, tc=tc(s0), shot=shot_at(s0)) for n, s0 in long_runs],
    runs_of_3=runs3, D6=D6,
)
lock = OrderedDict(
    meta=OrderedDict(show="MR. MAS", episode="ep01", act="ACT FOUR · THE BLIP, TOLD TWICE", script="draft 3.2", board="board 3 (shots-v3.json)",
                     takes="the 3.2 re-record (lines.json)", lock="timing lock v3", owner="THE EDITOR", generator="studio/src/episodes/ep01/act4/animatic/tools/lock_v3.py",
                     fps=FPS, bpm=96, frames_per_beat=BEAT, frames_per_bar=BAR,
                     rules=["lines take their length from the take", "replies chain to the previous line (overlap / marked gap / 3-7 f default)",
                            "cuts inside conversations land on the turn (the board's lead kept)", "line-carrying shots in a block keep the board's tail",
                            "everything else keeps the board's length; a take that overruns grows its shot frame-accurately",
                            "V.O. ends >= 1 beat before its cut and the next spoken line", "no block is padded back onto the grid"]),
    summary=summary, scenes=list(scenes.values()), chunks=chunks, shots=out, lines_gaps=gaps, vo=vo_rows, audio_cues=audio_cues, posts=posts,
    shares=shares, decisions=decisions, problems=problems,
)
json.dump(lock, open(os.path.join(PROD, "shots-locked-v3.json"), "w"), indent=1, ensure_ascii=False)

# ================================================================================================ data-v3.ts (the animatic)
SPEAKER_TS = {"NELEH (blueprint)": "NELEH"}
subs = []
for r in out:
    for l in r["lines"]:
        if l["kind"] == "post":
            continue
        subs.append(dict(s=l["abs_in"], e=l["abs_out"], hold_to=l["abs_out"] + 12, who=l["speaker"], text=l["text"], kind=l["kind"], mode=l["mode"], id=l["id"], os=l["os"]))
subs.sort(key=lambda x: x["s"])
for j in range(len(subs) - 1):  # a subtitle holds 1/2 s past its line, never over the next one
    subs[j]["hold_to"] = min(subs[j]["hold_to"], max(subs[j]["e"], subs[j + 1]["s"]))
ts_shots = []
for r in out:
    rc = r["rail_change"]
    ts_shots.append(dict(
        id=r["id"], sc=r["scene"], chunk=r["chunk"], side=r["side"], tag=r["tag"], size=r["shotSize"], cls=r["size_class"], framing=r["framing"],
        move=r["move_type"], moveNote=r["move"], box=r["box"], s=r["start_frame"], e=r["end_frame"], b=r["board_frames"], v2=r["v2_id"],
        room=r["room"], rail=rc["text"] if rc else None, railAt=rc["at"] if rc else None, railShown=r["rail_shown"],
        lines=[dict(id=l["id"], kind=l["kind"], mode=l["mode"], who=l["speaker"], text=l["text"], s=l["at"], e=l["end"], side=l["side"],
                    os=l["os"], lip=l["lip_sync"], mouth=l["mouth"], words=l["words"]) for l in r["lines"]],
        texts=[dict(k=x["kind"], t=x["text"], at=x.get("at", 0)) for x in r["text"]],
        drop=r["drop_out"], quiet=r["quiet_beat"], note=r["framing_note"], standin=r["standin"], angle=r["angle"],
        action=r["action"],
    ))
ts = [
    "// GENERATED by tools/lock_v3.py from shots-v3.json + lines.json (THE EDITOR's timing lock v3). Do not hand-edit: re-run lock_v3.py.",
    "/* eslint-disable */",
    "export interface LineV3 { id: string; kind: 'dialogue' | 'vo' | 'post'; mode: string; who: string; text: string; s: number; e: number; side: string | null; os: boolean; lip: boolean; mouth: Array<[number, string]>; words: Array<[string, number, number]>; }",
    "export interface TextV3 { k: string; t: string; at: number; }",
    "export interface ShotV3 { id: string; sc: string; chunk: string; side: 'MAS' | 'BOARD'; tag: string; size: string; cls: string; framing: string; move: string; moveNote: string; box: string; s: number; e: number; b: number; v2: string[]; room: string; rail: string | null; railAt: number | null; railShown: string | null; lines: LineV3[]; texts: TextV3[]; drop: string | null; quiet: boolean; note: string; standin: string; angle: string; action: string[]; }",
    "export interface SubV3 { s: number; e: number; hold_to: number; who: string; text: string; kind: string; mode: string; id: string; os: boolean; }",
    f"export const ACT_FRAMES = {TOTAL};",
    f"export const EP_IN_FRAMES = {EP_IN};",
    f"export const BOARD_FRAMES = {BOARD['meta']['frames']};",
    "export const SHOTS: ShotV3[] = " + json.dumps(ts_shots, ensure_ascii=False, separators=(",", ":")) + ";",
    "export const SUBS: SubV3[] = " + json.dumps(subs, ensure_ascii=False, separators=(",", ":")) + ";",
    "",
]
open(P("studio/src/episodes/ep01/act4/animatic/data-v3.ts"), "w").write("\n".join(ts))

print(f"lock v3: {len(out)} shots, {TOTAL} f = {length(TOTAL)} (board {BOARD['meta']['frames']} f, {TOTAL - BOARD['meta']['frames']:+d}); v2 10890 f")
print(f"  dialogue coverage {summary['dialogue_coverage_pct']}% · median gap in exchange {summary['median_gap_in_exchange_s']} s over {len(ex_gaps)} replies · median gap all lines {summary['median_gap_all_lines_s']} s")
print(f"  stretches > 6 s without voice: {len(long_runs)}, {sum(n for n, _ in long_runs) / FPS:.1f} s")
for d in decisions:
    print("  decision:", d)
for p in problems:
    print("  PROBLEM:", p)
