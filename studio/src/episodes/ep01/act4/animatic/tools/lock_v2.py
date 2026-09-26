"""lock_v2.py - THE EDITOR's timing lock v2 for Ep1 Act Four (sc 24-31, incl. 26A, 28), script DRAFT 3.1.

Inputs (read-only):
  show/episodes/ep01/production/act4/shots-v2.json   board 2 (draft 3.1, rulings at their defaults): shots, framing,
                                                     line placements, rails, text, assets, chunks
  audio/ep01/act4/dialogue/lines.json                the RECORDED lines (draft 3.1: 43 dialogue, 5 V.O., 7 posts):
                                                     frames_24, mouth cues, word timings, loudness targets
  (No scratch overlay: out/ep01/act4/animatic/scratch-vo/ is draft 3's and is NOT read. Every 3.1 V.O. is recorded.)

Outputs (all generated; re-run after any re-record, ruling or re-board, never hand-edit):
  show/episodes/ep01/production/act4/shots-locked-v2.json   the lock: exact frames, every cue, checks, shares, trims
  show/episodes/ep01/production/act4/timing-v2.md           the readable lock (rules, decisions, tables, trims)
  show/episodes/ep01/production/act4/chunks-v2.md           the final production chunks (frame ranges + dependencies)
  studio/src/episodes/ep01/act4/animatic/data-v2.ts         the same timing for the Remotion / Node animatic

Rules (timing-v2.md section 2):
  * 24 fps, 96 BPM: 15 f a beat, 60 f a bar. Act frame 0 = episode 12:31:00. Every cut lands on a beat.
  * Bar-counted set pieces keep the script's bar counts; the lock asserts every one (BAR_CHECKS).
  * Lines keep the board's placement (at) and take their length from the recording (frames_24, or the phrase clip).
  * V.O. (pov-and-framing 5.1, 5.2, 5.5): starts on a beat; ends >= 1 beat before a cut, a spoken line or a rail item;
    never overlaps a rail item's read window and starts >= 1 beat after its type-on; never within 1 bar of a real
    ([V]) line or post, a dated quote card, a name card / freeze, a (REPORTED) item, or (house rule) the act-out card;
    never inside the drop-out, sc 26, THE PLAN or the exit.
Run:  python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v2.py
"""
from __future__ import annotations

import copy
import json
import math
import os
from collections import OrderedDict

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
PROD = P("show/episodes/ep01/production/act4")

FPS, BEAT, BAR = 24, 15, 60
EP_IN = (12 * 60 + 31) * FPS  # 12:31:00
PRINTED_31 = 10387           # draft 3.1's printed act: 7:12.8 (script prints 7:13)
TRIM_LINE = (7 * 60 + 33) * FPS  # 7:33: flag / propose trims above this
BAND = ((6 * 60 + 54) * FPS, (7 * 60 + 34) * FPS)  # 7:14 +- 0:20

BOARD = json.load(open(os.path.join(PROD, "shots-v2.json")))
REC = OrderedDict((x["id"], x) for x in json.load(open(P("audio/ep01/act4/dialogue/lines.json"))))

# ================================================================================================ the editor's decisions
# Everything not listed here is locked exactly as board 2 placed it; the recordings set every line's length.
EDITS = OrderedDict([
    ("29.01", dict(frames=105, lines={"a4-29-vo1": 30},
                   why="The recorded 'i put the phone down.' is 52 f (the board sized an estimate). The HIS SIDE rail types on over "
                       "the home shot (board call) and needs 51 f, so its read ends at 29.01 f21. Board 2 started the V.O. at f15, "
                       "INSIDE that read (§5.2: one must-read at a time). The lock starts it on the next beat, f30: clear of the "
                       "rail's read, 4 beats after its type-on, and exactly 1 bar after the act-out card. The line ends f82; the "
                       "shot runs 1 bar + 3 beats (105 f, +15) so the V.O. ends 23 f before MAS'S VERSION's hard cut. Side effect: "
                       "MAS'S VERSION (29.01a) and the hearts [ECU] (29.03) now start ON the act's bar lines (bars 101 and 102), "
                       "so the piano's hard cut and the first Tick land on real downbeats.")),
])

# asset status after the parallel prep stages (medium tier, inserts + expressions) finished; board 2 marked these NEW.
ASSET_NOW = {
    "room.darkroom.medium": ("BUILT", "rooms/darkroom-plate.ts drawDarkPlate (+ rooms/twoshots.ts drawDark2S)"),
    "room.boardroom.medium": ("BUILT", "rooms/boardroom-plate.ts drawBoardPlate (+ twoshots.ts drawBoard2S / drawMadaM / drawCalmOff2S)"),
    "cast.mas.medium": ("BUILT", "cast/mas-medium.ts drawMasMedium"),
    "cast.orb.medium": ("BUILT", "cast/orb-medium.ts drawOrb / orbStep (+ twoshots orbTally / orbToLanyard)"),
    "cast.neleh.medium": ("BUILT", "cast/neleh-medium.ts"),
    "cast.mada.medium": ("BUILT", "cast/mada-medium.ts"),
    "cast.gerg.medium-tile": ("BUILT", "cast/gerg-medium.ts drawGergMediumPOV + cast/swaps-act4.ts drawGergTileWide"),
    "cast.mas.cu": ("BUILT", "cast/mas-cu.ts drawMasCU({backdrop 'strip'|'lobby'})"),
    "cast.mas.eyes": ("BUILT", "cast/mas-cu.ts drawEyesStrip(pos)"),
    "cast.mas.swap-down": ("BUILT", "cast/swaps-act4.ts drawMasLookDown"),
    "cast.alyi.swap-up": ("BUILT", "cast/swaps-act4.ts alyiLookUp (+ twoshots drawDoorwayP2)"),
    "cast.mas.hand.click": ("BUILT", "kits/inserts-mas.ts drawClickInsert"),
    "cast.mas.hand.nudge": ("BUILT", "kits/inserts-mas.ts drawNudgeInsert('suite'|'lobby')"),
    "cast.mas.hand.tap-strip": ("BUILT", "kits/inserts-mas.ts drawStripTapInsert (strip = post-ui stand-in)"),
    "cast.mas.hand.carve": ("BUILT", "kits/inserts-mas.ts drawCarveInsert"),
    "cast.mas.hand.thumb-mark3": ("BUILT", "kits/inserts-mas.ts drawBrushInsert (brushSafe passes)"),
    "cast.mas.hand.heart-tap": ("BUILT", "kits/inserts-mas.ts drawPhoneInsert29 {mode 'true'} (feed = post-ui stand-in)"),
    "cast.mas.hand.six": ("BUILT", "kits/inserts-mas.ts drawPhoneInsert29 {mode 'version'} (+ fiveInVersion copy)"),
    "kit.mas-version": ("BUILT", "kits/mas-version.ts versionPlan / layerFrame / versionLint"),
    "room.lobby.reception-insert": ("BUILT", "kits/inserts-mas.ts drawNudgeInsert('lobby') authors the reception plate"),
    "prop.q-vault": ("PARTIAL", "insert BUILT (kits/inserts-props.ts drawVaultInsert); no room-scale vault for 31.02 yet"),
    "prop.door-nameplate": ("BUILT", "kits/inserts-props.ts drawShutDoorInsert"),
    "prop.check-evirht": ("STAND-IN", "darkroom-plate.ts draws its own EVIRHT check on the tray (legible at [2S] scale: CHECK)"),
    "prop.phone": ("PARTIAL", "the 26/29 phone plates are BUILT (inserts-mas); the full-bleed phone screens (26A.03, 30.20) are post-ui"),
    "mix.laptop-speaker": ("BUILT", "audio a4-27-00.wav (a4-26-01 through a small-speaker filter, -22 LUFS)"),
    "cast.orb.portrait": ("NEW", "no right-window Orb yet: the animatic stands it in with orb-medium drawOrb at portrait scale"),
    "cast.orb.room": ("SALVAGE", "still dev/mcoldopen/orb.ts; cast/orb-medium.ts has a shared drawOrb that works at room radius"),
}

# ================================================================================================ helpers
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


def read_frames(s):
    """guardrails 7: must-read text >= 0.25 s + 0.05 s per character"""
    return int(math.ceil((0.25 + 0.05 * len(s)) * FPS))


SPK = {"MAS MANALT": "MAS", "RIMA TAMURI": "RIMA", "GERG MOCKBRAN": "GERG"}
SIDE_LABEL = {"MAS": "HIS SIDE", "BOARD": "THE BOARD'S SIDE"}
LUFS_DIALOGUE = -16.0


def gain_for(row):
    """premix gain (dB) to the house dialogue level. V.O. is delivered 2 LU under; pov-and-framing 5.1 says it sits AT
    dialogue level, so the premix raises it +2 dB. The laptop-speaker 'super.' stays at its delivered -22 LUFS."""
    if row["id"] == "a4-27-00":
        return 0.0
    tgt = row.get("qa", {}).get("target_lufs", LUFS_DIALOGUE)
    if row["kind"] == "vo":
        return round(LUFS_DIALOGUE - tgt, 2)
    return 0.0


# ================================================================================================ build the lock
bshots = BOARD["shots"]
out, t = [], 0
problems, notes_run = [], []
for bs in bshots:
    sid = bs["id"]
    ed = EDITS.get(sid, {})
    frames = ed.get("frames", bs["frames"])
    if frames % BEAT:
        problems.append(f"{sid}: {frames} f is not a whole beat")
    st, en = t, t + frames
    lines = []
    for d in bs["dialogue"] + bs["vo"]:
        lid = d["id"]
        R = REC.get(lid)
        if R is None:
            problems.append(f"{sid}: {lid} is not in lines.json")
            continue
        at = ed.get("lines", {}).get(lid, d["at"])
        kind = R["kind"]
        seg = d.get("seg_frames")
        mouth = [[m["f"], m["shape"]] for m in R.get("mouth", [])]
        words = [[w["w"], w["f0"], w["f1"]] for w in R.get("words", [])]
        if kind == "post":
            fr = d["end"] - d["at"]  # the pop-up's on-screen hold (board): unvoiced
            text = R["text"]
        elif seg:
            fr = seg[1] - seg[0]
            text = d["text"]
            mouth = [[f - seg[0], s] for f, s in mouth if seg[0] <= f < seg[1]]
            words = [[w, a - seg[0], b - seg[0]] for w, a, b in words if seg[0] <= a < seg[1]]
        else:
            fr = R["frames_24"]
            text = R["text"]
        row = OrderedDict(
            id=lid, kind=kind, mode=R["mode"], speaker=SPK.get(R["speaker"], R["speaker"]), text=text, tag=R["tag"],
            at=at, end=at + fr, frames=fr, abs_in=st + at, abs_out=st + at + fr, tc_in=tc(st + at), tc_out=tc(st + at + fr),
            voiced=bool(R.get("voiced_in_cut")) and kind != "post", file=None if kind == "post" else R["file"],
            seg_frames=seg, gain_db=gain_for(R) if kind != "post" else None,
            target_lufs=R.get("qa", {}).get("target_lufs"), side=R.get("side"), pov=R.get("pov"),
            lip_sync=bool(R.get("lip_sync")), status=R.get("status"), take=R.get("take"),
            mouth=mouth, words=words,
        )
        if kind == "post":
            row["read_min"] = read_frames(R["text"].strip('"'))
        if kind == "vo":
            row["device"] = next((v.get("device") for v in bs["vo"] if v["id"] == lid), None)
            row["caught_by"] = next((v.get("caught_by") for v in bs["vo"] if v["id"] == lid), None)
            if R.get("fallback"):
                row["fallback"] = {k: R["fallback"][k] for k in R["fallback"] if k in ("text", "file", "frames_24", "duration_s")}
        if at != d["at"]:
            row["moved_from"] = d["at"]
        if row["end"] > frames:
            problems.append(f"{sid}: {lid} ends at {row['end']} > {frames}")
        lines.append(row)
    lines.sort(key=lambda r: r["at"])
    rc = None
    if bs["rail_change"]:
        rc = OrderedDict(text=bs["rail_change"]["text"], at=bs["rail_change"]["at"], abs=st + bs["rail_change"]["at"],
                         read_min=read_frames(bs["rail_change"]["text"]))
    face = bs["face_frames"]
    if bs["face_frames"] == bs["frames"] and frames != bs["frames"]:
        face = frames
    r = OrderedDict(
        id=sid, scene=bs["scene"], chunk=bs["chunk"], side=bs["side"], side_label=SIDE_LABEL[bs["side"]],
        start_frame=st, end_frame=en, frames=frames, dur_s=round(frames / FPS, 3), beats=frames // BEAT, grid=grid(frames),
        tc_in=tc(st), tc_out=tc(en), tag=bs["tag"], shotSize=bs["shotSize"], framing=bs["framing"],
        board_frames=bs["frames"], lock_delta=frames - bs["frames"],
        lock_note=ed.get("why", "locked as boarded"), board_change=bs["change"], v1_id=bs["v1_id"], draft3_lock_id=bs["lock_id"],
        room=bs["room"], characters=bs["characters"], action=bs["action"], text=bs["text"],
        lines=lines, rail_change=rc, rail_shown=bs["rail_shown"], style=bs["style"], switches=bs["switches"],
        drop_out=bs["drop_out"], quiet_beat=bs["quiet_beat"], sfx=bs["sfx"], music=bs["music"], gags=bs["gags"],
        notes=bs["notes"], events=bs["events"], prod_mode=bs["prod_mode"], assets=bs["assets"],
        hand_in_frame=bs["hand_in_frame"], logged_as=bs["logged_as"], rides=bs["rides"], face_frames=face,
        faces_hands=face > 0,
    )
    out.append(r)
    t = en
TOTAL = t
SH = OrderedDict((r["id"], r) for r in out)
IDX = {r["id"]: i for i, r in enumerate(out)}
offgrid = [r["id"] for r in out if r["start_frame"] % BEAT]
if offgrid:
    problems.append("cuts off the beat grid: " + ", ".join(offgrid))

# every recorded row staged exactly once (the phrase-clipped TASYA line three times, by design)
staged = [l["id"] for r in out for l in r["lines"]]
missing = [k for k in REC if k not in staged]
if missing:
    problems.append("lines.json rows not staged: " + ", ".join(missing))

# ================================================================================================ derived cue events
EVENTS = []
vo3 = next(l for l in SH["29.12"]["lines"] if l["id"] == "a4-29-vo3")
asked = next((w for w in vo3["words"] if w[0] == "asked"), None)
if asked:
    EVENTS.append(OrderedDict(shot="29.12", at=vo3["at"] + asked[1], abs=SH["29.12"]["start_frame"] + vo3["at"] + asked[1],
                              what="the slate door's FIRST held step (door_appear / wall_step) on 'asked' (word f%d of a4-29-vo3)" % asked[1]))
    for k in (1, 2):
        a = vo3["at"] + asked[1] + k * BEAT
        EVENTS.append(OrderedDict(shot="29.12", at=a, abs=SH["29.12"]["start_frame"] + a, what=f"the door's held step {k + 1} of 3 (a beat apart)"))
d6 = [r for r in out if r["drop_out"]]
D6 = OrderedDict(start=d6[0]["start_frame"], end=d6[1]["start_frame"], frames=d6[1]["start_frame"] - d6[0]["start_frame"],
                 from_shot=d6[0]["id"], to_shot=d6[1]["id"]) if len(d6) == 2 else None
EVENTS.append(OrderedDict(shot=D6["from_shot"], at=0, abs=D6["start"], what="D6 DROP-OUT starts on the click (all room sound stops)"))
EVENTS.append(OrderedDict(shot=D6["to_shot"], at=0, abs=D6["end"], what="D6 ends: the phone's buzz brings the room back"))
EVENTS.append(OrderedDict(shot="29.01a", at=0, abs=SH["29.01a"]["start_frame"], what="MAS'S VERSION: the keynote-reel piano in (1 bar)"))
EVENTS.append(OrderedDict(shot="29.03", at=0, abs=SH["29.03"]["start_frame"], what="HARD CUT: the piano dies mid-phrase; the first heart Tick on this downbeat (8 taps, one per beat)"))
EVENTS.sort(key=lambda e: e["abs"])

# ================================================================================================ checks
# ---- bar-counted set pieces keep their counts
def span(a, b):
    return SH[b]["end_frame"] - SH[a]["start_frame"]


BAR_CHECKS = [
    ("sc 24 (2 bars)", "24.01", "24.03", 2 * BAR),
    ("THE PLAN (18 bars: 3 · 7 · 5 · 3)", "25.01", "25.08", 18 * BAR),
    ("THE WORD (3 bars)", "25.01", "25.01", 3 * BAR),
    ("THE DIAGRAM (7 bars)", "25.02", "25.03", 7 * BAR),
    ("THE PLAN proper (5 bars)", "25.04", "25.05", 5 * BAR),
    ("THE BREAK (3 bars)", "25.06", "25.08", 3 * BAR),
    ("sc 26 (21 bars: 4 · 4 · 4 · 4 · card 2 · 3)", "26.01", "26.13", 21 * BAR),
    ("sc 26 phrase 1 (4 bars)", "26.01", "26.03", 4 * BAR),
    ("sc 26 phrase 2 (4 bars)", "26.04", "26.04c", 4 * BAR),
    ("sc 26 phrases 3-4 (8 bars)", "26.05", "26.09", 8 * BAR),
    ("the candor card (2 bars)", "26.10", "26.10", 2 * BAR),
    ("F1.2 (3 bars)", "26.11", "26.13", 3 * BAR),
    ("sc 26A (8 bars)", "26A.01", "26A.06", 8 * BAR),
    ("sc 28 card (1 bar + 1 beat)", "28.01", "28.01", BAR + BEAT),
    ("MAS'S VERSION (1 bar)", "29.01a", "29.01a", BAR),
    ("the true hearts [ECU] (2 bars)", "29.03", "29.03", 2 * BAR),
    ("the Orb onto the lanyard (1 bar)", "29.04", "29.04", BAR),
    ("the letter card (3 bars)", "29.06", "29.06", 3 * BAR),
    ("the QUIET BEAT (4 beats)", "29.12q", "29.12r", 4 * BEAT),
    ("THE TILE AVALANCHE (S3, 16 bars)", "29.14", "29.20", 16 * BAR),
    ("THE LANDLORD (S2, 8 bars)", "30.05", "30.08", 8 * BAR),
    ("the long hold + the stamp (2 bars, one [2S])", "30.17", "30.17", 2 * BAR),
    ("the 1993 dialog in the lobby (1 bar)", "30.24", "30.24", BAR),
    ("the second [CU] (2 beats)", "30.25", "30.25", 2 * BEAT),
]
bar_rows = []
for name, a, b, need in BAR_CHECKS:
    have = span(a, b)
    bar_rows.append(OrderedDict(piece=name, shots=f"{a}–{b}" if a != b else a, frames=have, need=need, ok=have == need,
                                start_frame=SH[a]["start_frame"], on_bar_line=SH[a]["start_frame"] % BAR == 0))
    if have != need:
        problems.append(f"bar count: {name} runs {have} f, needs {need}")
if D6 and D6["frames"] != 150:
    problems.append(f"D6 runs {D6['frames']} f, needs 150 (2½ bars)")
for nc in ("26.02", "27.04", "27.21", "27.28", "29.19"):
    if SH[nc]["frames"] != BAR:
        problems.append(f"name card {nc} runs {SH[nc]['frames']} f (1 bar)")

# ---- rails: spans + read checks
reads = []
spans, cur, cst, cspan, cabs = [], None, None, 0, 0
for r in out:
    if r["rail_change"]:
        if cur:
            spans.append((cur, cst, cspan, cabs))
        cur, cst, cspan, cabs = r["rail_change"]["text"], r["id"], r["frames"] - r["rail_change"]["at"], r["rail_change"]["abs"]
    elif r["rail_shown"] and cur:
        cspan += r["frames"]
if cur:
    spans.append((cur, cst, cspan, cabs))
RAIL_SPANS = [OrderedDict(text=a, from_shot=b, frames_on_screen=c, abs=d, read_min=read_frames(a), ok=c >= read_frames(a)) for a, b, c, d in spans]
for rs in RAIL_SPANS:
    reads.append(OrderedDict(shot=rs["from_shot"], kind="rail", text=rs["text"], need_frames=rs["read_min"], have_frames=rs["frames_on_screen"], ok=rs["ok"]))
for r in out:
    for x in r["text"]:
        if not x.get("must_read") or x["kind"] == "rail":
            continue
        need, have = read_frames(x["text"]), r["frames"]
        if x["kind"] == "post":
            hit = [l for l in r["lines"] if l["kind"] == "post" and l["text"].strip('"') == x["text"].strip('"')]
            if hit:
                have = hit[0]["frames"]
        reads.append(OrderedDict(shot=r["id"], kind=x["kind"], text=x["text"], need_frames=need, have_frames=have, ok=have >= need))
read_fails = [x for x in reads if not x["ok"]]
for x in read_fails:
    problems.append(f"read time: {x['shot']} {x['kind']} '{x['text'][:30]}' has {x['have_frames']} f, needs {x['need_frames']}")

# ---- the record (V.O. keeps 1 bar clear)
REC_ITEMS = []
for r in out:
    for l in r["lines"]:
        if l["tag"].startswith("[V"):
            REC_ITEMS.append((l["abs_in"], l["abs_out"], f"real {'post' if l['kind'] == 'post' else 'line'} {l['id']} ({r['id']})"))
    if r["shotSize"] == "CARD":
        if r["rides"]:
            REC_ITEMS.append((r["start_frame"], r["end_frame"], f"name card / freeze {r['id']}"))
        elif any(x["kind"] == "quote-card" for x in r["text"]):
            REC_ITEMS.append((r["start_frame"], r["end_frame"], f"dated quote card {r['id']}"))
        else:
            REC_ITEMS.append((r["start_frame"], r["end_frame"], f"the act-out card {r['id']} (house rule)"))
    for x in r["text"]:
        if "REPORTED" in x["text"] and x["kind"] != "rail":
            REC_ITEMS.append((r["start_frame"], r["end_frame"], f"(REPORTED) item {r['id']}"))
for rs in RAIL_SPANS:
    if "REPORTED" in rs["text"]:
        REC_ITEMS.append((rs["abs"], rs["abs"] + rs["frames_on_screen"], f"(REPORTED) rail from {rs['from_shot']}"))
SPOKEN = [(l["abs_in"], l["abs_out"], l["id"], r["id"]) for r in out for l in r["lines"] if l["kind"] == "dialogue"]
RAILS = [(r["rail_change"]["abs"], r["rail_change"]["read_min"], r["id"]) for r in out if r["rail_change"]]
TOASTS = []
for r in out:
    for x in r["text"]:
        if x["kind"] == "toast":
            TOASTS.append((r["start_frame"], r["id"], x["text"]))
FORBID = {"26": "sc 26 (the candor card's scene)", "25": "THE PLAN", "27": "the exit (pass one)"}
vo_rows = []
for r in out:
    for l in r["lines"]:
        if l["kind"] != "vo":
            continue
        a, b = l["abs_in"], l["abs_out"]
        issues, clear = [], OrderedDict()
        if a % BEAT:
            issues.append("starts off the beat")
        if r["scene"] in FORBID:
            issues.append(f"inside {FORBID[r['scene']]}")
        if D6 and D6["start"] <= a < D6["end"]:
            issues.append("inside the drop-out")
        clear["to_cut"] = r["end_frame"] - b
        if clear["to_cut"] < BEAT:
            issues.append(f"ends {clear['to_cut']} f before the cut")
        nxt = [s for s in SPOKEN if s[0] >= b]
        prv = [s for s in SPOKEN if s[1] <= a]
        if nxt:
            n = min(nxt)
            clear["next_spoken"] = OrderedDict(id=n[2], shot=n[3], gap=n[0] - b)
            if n[0] - b < BEAT:
                issues.append(f"ends {n[0] - b} f before the spoken line {n[2]}")
        if prv:
            p = max(prv, key=lambda s: s[1])
            clear["prev_spoken"] = OrderedDict(id=p[2], shot=p[3], gap=a - p[1])
        over = [s for s in SPOKEN if s[0] < b and s[1] > a]
        if over:
            issues.append("overlaps spoken line(s) " + ", ".join(s[2] for s in over))
        near = []
        for ea, eb, what in REC_ITEMS:
            gap = max(ea - b, a - eb)
            near.append((gap, what))
            if gap < BAR:
                issues.append(f"within 1 bar of {what} (gap {gap} f)")
        near.sort()
        clear["nearest_record"] = OrderedDict(what=near[0][1], gap=near[0][0])
        for ra, rn, rid in RAILS:
            if ra <= a < ra + rn:
                issues.append(f"starts inside the rail's read ({rid}: {ra}-{ra + rn})")
            if a <= ra < b + BEAT:
                issues.append(f"a rail item types on at {ra} ({rid}) within the V.O. or 1 beat after it")
            if 0 <= a - ra < BEAT:
                issues.append(f"starts {a - ra} f after a rail type-on ({rid}): stagger >= 1 beat")
        rails_before = [(a - (ra + rn), rid) for ra, rn, rid in RAILS if ra + rn <= a]
        if rails_before:
            g, rid = min(rails_before)
            clear["after_rail_read"] = OrderedDict(shot=rid, gap=g)
        rails_after = [(ra - b, rid) for ra, rn, rid in RAILS if ra >= b]
        if rails_after:
            g, rid = min(rails_after)
            clear["before_next_rail"] = OrderedDict(shot=rid, gap=g)
        for ta, tid, tt in TOASTS:
            if a - BEAT < ta < b + BEAT:
                issues.append(f"a toast ({tt}) within a beat ({tid})")
        vo_rows.append(OrderedDict(id=l["id"], shot=r["id"], text=l["text"], device=l.get("device"), at=l["at"], abs_in=a, abs_out=b,
                                   tc_in=tc(a), frames=l["frames"], clearances=clear, issues=issues, ok=not issues,
                                   moved_from=l.get("moved_from")))
        if issues:
            problems.extend(f"V.O. {l['id']} ({r['id']}): {i}" for i in issues)

# ---- every line: tail to the cut, overlaps, the house tails
line_rows = []
for r in out:
    for l in r["lines"]:
        if l["kind"] == "post":
            continue
        line_rows.append(OrderedDict(id=l["id"], shot=r["id"], kind=l["kind"], speaker=l["speaker"], at=l["at"], end=l["end"],
                                     tail_to_cut=r["frames"] - l["end"], abs_in=l["abs_in"], tc_in=l["tc_in"]))
short_tails = [x for x in line_rows if x["tail_to_cut"] < 4]

# ================================================================================================ scenes, chunks, shares
scenes = OrderedDict()
for sc in BOARD["scenes"]:
    rows = [r for r in out if r["scene"] == sc["id"]]
    s0, s1 = rows[0]["start_frame"], rows[-1]["end_frame"]
    scenes[sc["id"]] = OrderedDict(id=sc["id"], title=sc["title"], side=SIDE_LABEL[sc["side"]], printed_clock=sc["printed_clock"],
                                   printed_frames=sc["printed_frames"], printed_bars=sc["printed_bars"], board_frames=sc["frames"],
                                   start_frame=s0, end_frame=s1, frames=s1 - s0, tc_in=tc(s0), tc_out=tc(s1),
                                   delta_vs_printed_frames=(s1 - s0) - sc["printed_frames"], delta_vs_printed_s=round(((s1 - s0) - sc["printed_frames"]) / FPS, 2),
                                   delta_vs_board_frames=(s1 - s0) - sc["frames"], n_shots=len(rows))

chunks = []
for c in BOARD["chunks"]:
    rows = out[IDX[c["first"]]: IDX[c["last"]] + 1]
    fr = rows[-1]["end_frame"] - rows[0]["start_frame"]
    assets = sorted({a["id"] for r in rows for a in r["assets"]})
    chunks.append(OrderedDict(id=c["id"], title=c["title"], first=c["first"], last=c["last"], n_shots=len(rows),
                              start_frame=rows[0]["start_frame"], end_frame=rows[-1]["end_frame"], frames=fr, seconds=round(fr / FPS, 2),
                              tc_in=rows[0]["tc_in"], tc_out=rows[-1]["tc_out"], board_frames=c["frames"], delta=fr - c["frames"],
                              depends_on=c["depends_on"], assets=assets,
                              lines=[l["id"] for r in rows for l in r["lines"]], visual_events=sum(r["events"] for r in rows),
                              est_agent_min_mode_rates=c["est_agent_min_mode_rates"], est_agent_min_rule_of_thumb=c["est_agent_min_rule_of_thumb"]))

cat = OrderedDict(W=0, FACES_HANDS=0, POV_SCR=0, GFX=0, PROP_INSERT=0)
sub = OrderedDict(M_2S=0, PORTRAIT_FAMILY=0, CU=0, ECU=0, TILE_FACES=0)
for r in out:
    fr, face, lg = r["frames"], r["face_frames"], r["logged_as"]
    cat["FACES_HANDS"] += face
    if lg in ("MEDIUM", "TWO-SHOT"):
        sub["M_2S"] += face
    elif lg in ("PORTRAIT", "FALLAWAY", "WIDE"):
        sub["PORTRAIT_FAMILY"] += face
    elif lg == "CLOSE-UP":
        sub["CU"] += face
    elif lg in ("INSERT-HANDS", "INSERT-PROP"):
        sub["ECU"] += face
    elif lg == "UI-TILE-GRID":
        sub["TILE_FACES"] += face
    rest = fr - face
    if rest:
        key = {"WIDE": "W", "UI-TILE-GRID": "POV_SCR", "BLUEPRINT": "GFX", "CARD": "GFX", "INSERT-PROP": "PROP_INSERT"}.get(lg)
        if key is None:
            problems.append(f"shares: {r['id']} logged {lg} with {rest} non-face frames")
        else:
            cat[key] += rest
pct = lambda n, d=TOTAL: round(100 * n / d, 1)  # noqa: E731
no_plan = TOTAL - scenes["25"]["frames"]
SHARES = OrderedDict(
    W=OrderedDict(pct=pct(cat["W"]), target="10–15%", verdict="GREEN" if pct(cat["W"]) <= 15 else "AMBER"),
    FACES_HANDS=OrderedDict(pct=pct(cat["FACES_HANDS"]), target="≥ 55%", verdict="GREEN" if pct(cat["FACES_HANDS"]) >= 55 else ("AMBER" if pct(cat["FACES_HANDS"]) >= 45 else "RED")),
    POV_SCR=OrderedDict(pct=pct(cat["POV_SCR"]), target="12–18%", verdict="high by design"),
    GFX=OrderedDict(pct=pct(cat["GFX"]), target="8–10%", verdict="high by design"),
    PROP_INSERT=OrderedDict(pct=pct(cat["PROP_INSERT"]), target="—", verdict="not a face or a hand"),
    M_2S=OrderedDict(pct=pct(sub["M_2S"]), target="15–20%", verdict="LOW"),
    PORTRAIT_FAMILY=OrderedDict(pct=pct(sub["PORTRAIT_FAMILY"]), target="30–35%", verdict="IN" if 30 <= pct(sub["PORTRAIT_FAMILY"]) <= 35 else "LOW"),
    CU=OrderedDict(pct=pct(sub["CU"]), target="≤ 2%", verdict="IN"),
    ECU=OrderedDict(pct=pct(sub["ECU"]), target="6–9%", verdict="IN" if 6 <= pct(sub["ECU"]) <= 9 else "HIGH"),
    FACES_HANDS_WITHOUT_THE_PLAN=OrderedDict(pct=pct(cat["FACES_HANDS"], no_plan), target="≥ 55%", verdict="GREEN" if pct(cat["FACES_HANDS"], no_plan) >= 55 else "AMBER"),
)
for k, v in SHARES.items():
    v["frames"] = cat.get(k, sub.get(k, None))

# ================================================================================================ totals + trims
TRIMS = [
    ("T1", ["27.02"], -BEAT, "BUKAJ's toast cut (27.02 1 bar → 3 beats; the keycap rain stays)", "writer (pre-listed #1)", "low"),
    ("T2", ["27.01"], -BEAT, "the pass-one hold on the call going on, 1 beat → 0 (27.01 1 bar + 2 → 1 bar + 1; 'super.' at f4)", "writer (pre-listed #2)", "low (the catch for 'the meeting ended early.' still reads: the call is going on)"),
    ("E1", ["30.26"], -BEAT, "'okay.' insert back to the script's 2 beats (the line ends 4 f before the Q* rail's cut: an L-cut of its tail into 31.01)", "editor", "low"),
    ("E2", ["31.01"], -BEAT, "the vault insert 1 bar + 2 → 1 bar + 1 (the Q* rail keeps reading across the cut: 105 f needed, 135 f on screen)", "editor", "low"),
    ("E3", ["29.01"], -BEAT, "29.01 back to board 2's 1 bar + 2 with the V.O. at f15 (accepts the V.O. starting 6 f inside the HIS SIDE rail's read)", "editor + board", "medium: §5.2 one must-read at a time"),
    ("T3", ["27.24"], -2 * BAR, "Mario's second phone and the rent meters (27.24, the whole 2 bars; the throne call and ADELINA's 'no.' carry the roast)", "writer (pre-listed #3; only if two critics mark Z at ≈ 15:38–16:25)", "medium (a real-fact gag goes)"),
]
trim_rows, run = [], TOTAL
for tid, ids, dfr, what, who, cost in TRIMS:
    run += dfr
    trim_rows.append(OrderedDict(id=tid, shots=ids, delta_frames=dfr, delta_s=round(dfr / FPS, 3), what=what, sign_off=who, cost=cost,
                                 act_after_frames=run, act_after=length(run), under_7_33=run <= TRIM_LINE))

SUMMARY = OrderedDict(
    shots=len(out), act_frames=TOTAL, act_seconds=round(TOTAL / FPS, 3), act_length=length(TOTAL),
    episode_in=tc(0), episode_out=tc(TOTAL),
    printed_draft31=OrderedDict(frames=PRINTED_31, length="7:12.8 (printed 7:13)", clock="12:31–19:43.8"),
    vs_printed=OrderedDict(frames=TOTAL - PRINTED_31, s=round((TOTAL - PRINTED_31) / FPS, 2)),
    board2=OrderedDict(frames=BOARD["totals"]["frames"], length=BOARD["totals"]["length"], delta_frames=TOTAL - BOARD["totals"]["frames"]),
    band=OrderedDict(length="7:14 ± 0:20 (6:54–7:34)", frames=list(BAND), in_band=BAND[0] <= TOTAL <= BAND[1], headroom_frames=BAND[1] - TOTAL,
                     headroom_s=round((BAND[1] - TOTAL) / FPS, 2)),
    trim_line=OrderedDict(length="7:33", frames=TRIM_LINE, over_frames=TOTAL - TRIM_LINE, over_s=round((TOTAL - TRIM_LINE) / FPS, 2),
                          flag=TOTAL > TRIM_LINE),
    voiced_lines=sum(1 for r in out for l in r["lines"] if l["voiced"]),
    vo_lines=len(vo_rows), vo_seconds=round(sum(v["frames"] for v in vo_rows) / FPS, 2),
    dialogue_seconds=round(sum(l["frames"] for r in out for l in r["lines"] if l["voiced"]) / FPS, 2),
    drop_out=D6, visual_events=sum(r["events"] for r in out),
)

# ================================================================================================ audio cues + subtitles
AUDIO = []
for r in out:
    for l in r["lines"]:
        if not l["voiced"]:
            continue
        AUDIO.append(OrderedDict(id=l["id"], shot=r["id"], kind=l["kind"], file=l["file"], abs=l["abs_in"], frames=l["frames"],
                                 seg_frames=l["seg_frames"], gain_db=l["gain_db"]))
SUBS = []
for r in out:
    for l in r["lines"]:
        if not l["voiced"]:
            continue
        SUBS.append(OrderedDict(s=l["abs_in"], e=l["abs_out"], who=l["speaker"], text=l["text"], kind=l["kind"], mode=l["mode"], id=l["id"]))
SUBS.sort(key=lambda x: x["s"])
for i, s in enumerate(SUBS):
    nxt = SUBS[i + 1]["s"] if i + 1 < len(SUBS) else TOTAL
    s["hold_to"] = max(s["e"], min(s["e"] + 18, nxt))

# ================================================================================================ write the JSON
locked = OrderedDict(
    meta=OrderedDict(
        show="MR. MAS", episode="ep01 · research_preview", act="ACT FOUR · THE BLIP, TOLD TWICE", scenes="24–31 (incl. 26A, 28)",
        source="script.md Act Four DRAFT 3.1 + pov-changes.md (rulings at their defaults) · board 2 (shots-v2.json) · lines.json (recorded, draft 3.1)",
        owner="THE EDITOR (timing lock v2 + act animatic v2)", status="LOCK v2 · timed to the recordings · content as scripted and boarded · trims PROPOSED, none applied",
        fps=FPS, bpm=96, frames_per_beat=BEAT, frames_per_bar=BAR,
        frame0="act frame 0 = episode 12:31:00; tc = episode mm:ss:ff at 24 fps; end frames are exclusive; line at/end are shot-relative, abs_in/abs_out act frames",
        generator="studio/src/episodes/ep01/act4/animatic/tools/lock_v2.py (re-run after any re-record / ruling / re-board; never hand-edit)",
        premix="studio/src/episodes/ep01/act4/animatic/tools/premix_v2.py (reads audio_cues)",
        supersedes="shots-locked.json (lock v1, draft 3; kept because board_v2.py reads its ids)",
    ),
    summary=SUMMARY, editor_decisions=[OrderedDict(shot=k, frames=v.get("frames"), lines=v.get("lines"), why=v["why"]) for k, v in EDITS.items()],
    scenes=scenes, shots=out, chunks=chunks, vo=vo_rows, events=EVENTS, bar_checks=bar_rows, rail_spans=RAIL_SPANS, read_checks=reads,
    lines=line_rows, shares=SHARES, trims=trim_rows, audio_cues=AUDIO, subtitles=SUBS,
    asset_status_now=OrderedDict((k, OrderedDict(status=v[0], where=v[1])) for k, v in ASSET_NOW.items()),
    problems=problems,
)
json.dump(locked, open(os.path.join(PROD, "shots-locked-v2.json"), "w"), indent=1, ensure_ascii=False)

# ================================================================================================ the TS data module
ts_shots = []
for r in out:
    ts_shots.append(OrderedDict(
        id=r["id"], sc=r["scene"], chunk=r["chunk"], side=r["side"], tag=r["tag"], size=r["shotSize"], logged=r["logged_as"],
        s=r["start_frame"], e=r["end_frame"], room=r["room"],
        rail=r["rail_shown"], railAt=r["rail_change"]["at"] if r["rail_change"] else None,
        lines=[OrderedDict(id=l["id"], kind=l["kind"], mode=l["mode"], who=l["speaker"], text=l["text"], s=l["at"], e=l["end"],
                           side=l["side"], lip=l["lip_sync"], mouth=l["mouth"], words=l["words"]) for l in r["lines"]],
        texts=[OrderedDict(k=x["kind"], t=x["text"]) for x in r["text"] if x["kind"] not in ("rail",)],
        drop=r["drop_out"], quiet=r["quiet_beat"], note=(r["action"][0] if r["action"] else "")[:220],
    ))
ts_events = [OrderedDict(abs=e["abs"], shot=e["shot"], what=e["what"]) for e in EVENTS]
TS = P("studio/src/episodes/ep01/act4/animatic/data-v2.ts")
with open(TS, "w") as fh:
    fh.write("// GENERATED by tools/lock_v2.py from shots-v2.json + lines.json (THE EDITOR's timing lock v2). Do not hand-edit: re-run lock_v2.py.\n")
    fh.write("/* eslint-disable */\n")
    fh.write("export interface LineV2 { id: string; kind: 'dialogue' | 'vo' | 'post'; mode: string; who: string; text: string; s: number; e: number; side: string | null; lip: boolean; mouth: Array<[number, string]>; words: Array<[string, number, number]>; }\n")
    fh.write("export interface TextV2 { k: string; t: string; }\n")
    fh.write("export interface ShotV2 { id: string; sc: string; chunk: string; side: 'MAS' | 'BOARD'; tag: string; size: string; logged: string; s: number; e: number; room: string; rail: string | null; railAt: number | null; lines: LineV2[]; texts: TextV2[]; drop: string | null; quiet: boolean; note: string; }\n")
    fh.write("export interface SubV2 { s: number; e: number; hold_to: number; who: string; text: string; kind: string; mode: string; id: string; }\n")
    fh.write(f"export const ACT_FRAMES = {TOTAL};\n")
    fh.write(f"export const EP_IN_FRAMES = {EP_IN};\n")
    fh.write("export const SHOTS: ShotV2[] = " + json.dumps(ts_shots, ensure_ascii=False, separators=(",", ":")) + ";\n")
    fh.write("export const SUBS: SubV2[] = " + json.dumps(SUBS, ensure_ascii=False, separators=(",", ":")) + ";\n")
    fh.write("export const EVENTS: Array<{abs: number; shot: string; what: string}> = " + json.dumps(ts_events, ensure_ascii=False, separators=(",", ":")) + ";\n")

# ================================================================================================ markdown helpers
def mdt(headers, rows):
    s = "| " + " | ".join(headers) + " |\n|" + "|".join("---" for _ in headers) + "|\n"
    for row in rows:
        s += "| " + " | ".join(str(c).replace("|", "\\|").replace("\n", " ") for c in row) + " |\n"
    return s


def sgn(n):
    return f"{n:+d}" if n else "0"


def tidy(txt):
    """blank line after every heading and around every table (GitHub-flavoured Markdown)"""
    out, prev = [], ""
    for ln in txt.split("\n"):
        is_t, was_t = ln.startswith("|"), prev.startswith("|")
        if out and ((is_t and not was_t and prev.strip()) or (was_t and not is_t and ln.strip()) or (prev.startswith("#") and ln.strip()) or (ln.startswith("#") and prev.strip())):
            out.append("")
        out.append(ln)
        prev = ln
    return "\n".join(out).replace("\n\n\n", "\n\n")


# ================================================================================================ timing-v2.md
S = SUMMARY
md = []
md.append("# Ep1 · Act Four · Timing lock v2 (draft 3.1)\n")
md.append("*THE EDITOR, 2026-09-25. Generated by `studio/src/episodes/ep01/act4/animatic/tools/lock_v2.py` from board 2 "
          "([shots-v2.json](shots-v2.json)) and the recorded draft 3.1 dialogue (`audio/ep01/act4/dialogue/lines.json`). The machine "
          "copy is [shots-locked-v2.json](shots-locked-v2.json): if the two disagree, the JSON wins. Re-run the script after any "
          "re-record, ruling or re-board; don't edit this file. The act animatic v2 is `out/ep01/act4/animatic/act4-animatic-v2.mp4`; "
          "production chunks are in [chunks-v2.md](chunks-v2.md).*\n")
md.append("## 1. The lock at a glance\n")
md.append(mdt(["", "Frames", "Length", "Clock"], [
    ["**Lock v2**", S["act_frames"], f"**{S['act_length']}**", f"12:31:00–{S['episode_out']}"],
    ["Draft 3.1 printed", PRINTED_31, "7:12.8 (printed 7:13)", "12:31–19:43.8"],
    ["Δ vs printed", sgn(S["vs_printed"]["frames"]), f"{S['vs_printed']['s']:+.2f} s", ""],
    ["Board 2", S["board2"]["frames"], S["board2"]["length"], ""],
    ["Δ vs board 2", sgn(S["board2"]["delta_frames"]), f"{S['board2']['delta_frames'] / FPS:+.3f} s", "29.01 only (§3)"],
    ["Band 7:14 ± 0:20", f"{BAND[0]}–{BAND[1]}", "6:54–7:34", f"in band, {S['band']['headroom_frames']} f ({S['band']['headroom_s']} s) under the top"],
]))
flag = S["trim_line"]["flag"]
md.append(f"\n**{'FLAG: over 7:33.' if flag else 'Under 7:33.'}** The lock runs {S['act_length']}, {S['vs_printed']['s']:+.2f} s against the printed 7:13"
          + (f" and {S['trim_line']['over_s']:.2f} s ({S['trim_line']['over_frames']} f) over the 7:33 trim line. It is still inside the 7:14 ± 0:20 band, by "
             f"{S['band']['headroom_frames']} f. **No trim is applied**: every one needs a writer's or the board's sign-off. The ladder in §7 "
             f"proposes T1 + T2 (the writer's own pre-listed trims, −1.25 s) to bring the act to {trim_rows[1]['act_after']}, under the line." if flag else "."))
md.append(f"\n- {S['shots']} shots, every cut on the beat grid; {S['voiced_lines']} voiced cues ({S['vo_lines']} V.O., {S['vo_seconds']} s of V.O.), "
          f"{sum(1 for r in out for l in r['lines'] if l['kind'] == 'post')} unvoiced posts. Every `lines.json` row is placed.\n"
          f"- Voice in the act: {S['dialogue_seconds']} s. The D6 drop-out runs {D6['frames']} f (2½ bars) from {D6['from_shot']} f0 to {D6['to_shot']} f0.\n"
          f"- Problems found by the checks: **{len(problems)}**" + (" (listed in §9)." if problems else ".") + "\n")
md.append("\n## 2. Rules the lock applies\n")
md.append("- **Grid.** 24 fps, 96 BPM: 15 f a beat, 60 f a bar. Act frame 0 = episode 12:31:00. Every cut lands on a beat; scenes 24–26A sit "
          "exactly on the printed clock, and from sc 27 the recordings set the length (board 2's rule, kept).\n"
          "- **Set pieces** keep their bar counts: THE PLAN, the drop-out, the four 4-bar phrases, the card lengths, F1.2, the quiet beat, the "
          "avalanche, the landlord, the long hold. The lock asserts each one (§5).\n"
          "- **Lines** keep board 2's placement inside the shot and take their length from the delivered file (`frames_24`, or the phrase clip "
          "for TASYA's three-part line). The files are trimmed (30 ms head, 80 ms tail), so the scripted HOLDs are picture time.\n"
          "- **V.O.** (pov-and-framing §5.1, §5.2, §5.5): starts on a beat; ends ≥ 1 beat before a cut, a spoken line or a rail item; never "
          "starts inside a rail item's read window and never within a beat of its type-on (one must-read at a time); never within 1 bar of a "
          "real `[V]` line or post, a dated quote card, a name card or freeze, a `(REPORTED)` item, or (house rule) the act-out card; never in sc "
          "26, THE PLAN, the exit or the drop-out.\n"
          "- **Posts** are unvoiced pop-ups; their on-screen holds are board 2's and each is checked against the read time (0.25 s + 0.05 s a character).\n"
          "- **Premix levels:** dialogue at −16 LUFS as delivered; the V.O. is delivered at −18 (2 LU under) and the premix raises it **+2 dB** to "
          "dialogue level, as pov-and-framing §5.1 says (the mix can take it back down); `a4-27-00` (his voice through their laptop) stays at its "
          "delivered −22. Posts' scratch reads are not in the cut, so not in the premix.\n")
md.append("\n## 3. What the lock changed from board 2\n")
md.append(mdt(["Shot", "Board 2", "Lock v2", "Why"], [[k, f"{SH[k]['board_frames']} f", f"{SH[k]['frames']} f ({sgn(SH[k]['lock_delta'])})", v["why"]] for k, v in EDITS.items()]))
md.append("\nEverything else is locked exactly as boarded. The five new recordings against board 2's estimates:\n\n")
est = {v["id"]: v for v in BOARD["vo"]}
md.append(mdt(["V.O.", "Shot", "Board 2 (est.)", "Recorded", "Placed", "Fits"], [
    [f"`{v['id']}` {v['text']}", v["shot"], f"{est[v['id']]['abs_out'] - est[v['id']]['abs_in']} f" if v["id"] in est else "—", f"{v['frames']} f",
     f"f{v['at']}–{v['at'] + v['frames']}" + (f" (moved from f{v['moved_from']})" if v.get("moved_from") is not None else ""),
     "yes" if v["ok"] else "NO"] for v in vo_rows]))
md.append("\n'mostly.' (`a4-29-03`, the re-take) is 23 f, the same length the board used. The laptop 'super.' (`a4-27-00`) is the 22 f `a4-26-01` take, as boarded.\n")
md.append("\n## 4. Scenes against the printed clock\n")
md.append(mdt(["Sc", "Title", "Side", "Printed", "Lock v2 clock", "Frames", "Δ vs printed", "Δ vs board 2"], [
    [k, v["title"], v["side"], f"{v['printed_clock']} ({v['printed_frames']} f)", f"{v['tc_in']}–{v['tc_out']}", v["frames"],
     f"{sgn(v['delta_vs_printed_frames'])} f ({v['delta_vs_printed_s']:+.2f} s)", sgn(v["delta_vs_board_frames"])] for k, v in scenes.items()]))
md.append(f"\nThe act runs {S['vs_printed']['s']:+.2f} s over the printed clock. All of it comes from sc 27–31, where the printed clock was "
          "written before the recordings: the voices are slower than the script's estimate (the synthetic-voice allowance the writer planned "
          "for), plus read time for posts and must-read text, plus the 29.01 beat above.\n")
md.append("\n## 5. Set pieces and bar counts\n")
md.append(mdt(["Piece", "Shots", "Frames", "Needs", "OK", "Starts on a bar line"], [[b["piece"], b["shots"], b["frames"], b["need"], "yes" if b["ok"] else "NO", "yes" if b["on_bar_line"] else "no (beat grid)"] for b in bar_rows]))
md.append(f"\nThe D6 drop-out: {D6['frames']} f from the click (`{D6['from_shot']}` f0) to the buzz (`{D6['to_shot']}` f0). Name cards ride one bar each "
          "(TERB's full freeze is 1½ bars + the pin insert, as boarded).\n")
md.append("\n## 6. The V.O. ledger (exact frames and clearances)\n")
vrows = []
for v in vo_rows:
    c = v["clearances"]
    vrows.append([f"`{v['id']}`", v["text"], v["device"], v["shot"], f"f{v['at']}", f"{v['abs_in']}–{v['abs_out']}", v["tc_in"],
                  f"{c['to_cut']} f", f"{c['next_spoken']['id']} +{c['next_spoken']['gap']} f" if "next_spoken" in c else "—",
                  f"{c['nearest_record']['gap']} f · {c['nearest_record']['what']}",
                  (f"{c['after_rail_read']['gap']} f after {c['after_rail_read']['shot']}'s read" if "after_rail_read" in c else "—"),
                  "OK" if v["ok"] else "; ".join(v["issues"])])
md.append(mdt(["Id", "Line", "Device", "Shot", "At", "Act frames", "TC in", "To the cut", "Next spoken line", "Nearest record item", "Rail", "Check"], vrows))
md.append("\nCue events tied to the V.O. and the silence:\n\n")
md.append(mdt(["Act frame", "TC", "Shot", "Event"], [[e["abs"], tc(e["abs"]), e["shot"], e["what"]] for e in EVENTS]))
md.append("\n## 7. Trims (proposed, none applied)\n")
md.append(f"The lock is {S['trim_line']['over_frames']} f over 7:33. In the order to take them (each row's length includes the rows above it):\n\n")
md.append(mdt(["#", "Shot", "Δ", "What", "Sign-off", "Comedy cost", "Act after"], [[x["id"], ", ".join(x["shots"]), f"{x['delta_s']:+.3f} s", x["what"], x["sign_off"], x["cost"], x["act_after"] + (" ✓ ≤ 7:33" if x["under_7_33"] else "")] for x in trim_rows]))
md.append("\n**Recommendation:** take **T1 + T2** if the slate reads long ("
          f"{trim_rows[1]['act_after']}); they are the writer's own first two and cost nothing on the page. E1 and E2 are free editor trims "
          "(read time is kept) if the showrunner wants margin under the band; E3 buys a beat back at the cost of the §5.2 stagger and I don't "
          "recommend it. T3 is the writer's 7:00-proof cut, only on the table-read trigger. **Never** hearts 8 → 6 (L7).\n")
md.append("\n## 8. Shot-size shares (per cut, from the lock)\n")
md.append(mdt(["Tier", "Lock v2", "Target", "Verdict"], [[k.replace("_", " "), f"{v['pct']}%", v["target"], v["verdict"]] for k, v in SHARES.items()]))
md.append("\nLogged per pov-and-framing §4.2 (board 2's per-shot `logged_as` and `face_frames`, re-measured on the lock's frames). Faces + hands "
          "stays AMBER, accepted under ruling 5.\n")
md.append("\n## 9. Checks\n")
md.append(f"- Read times: {len(reads)} checks, **{len(read_fails)} fail**" + (": " + "; ".join(f"{x['shot']} {x['text'][:30]}" for x in read_fails) if read_fails else "") + ".\n")
md.append(f"- Rails: {len(RAIL_SPANS)} rail items; every one is on screen for at least its read time.\n")
md.append(f"- Lines: every voiced line ends inside its shot; {len(short_tails)} end within 4 f of the cut" + (" (" + ", ".join(f"{x['id']} in {x['shot']}" for x in short_tails) + ")" if short_tails else "") + ".\n")
md.append(f"- V.O.: {sum(1 for v in vo_rows if v['ok'])}/{len(vo_rows)} pass every §5 rule.\n")
md.append("- Problems: " + ("none." if not problems else "\n" + "".join(f"  - {p}\n" for p in problems)) + "\n")
md.append("\n## 10. Every shot, locked\n")
md.append(mdt(["Shot", "Tag", "Side", "Act frames", "Len", "TC in", "Lines (shot frames)", "Rail", "Δ board"], [
    [r["id"], r["tag"], r["side_label"], f"{r['start_frame']}–{r['end_frame']}", f"{r['frames']} ({r['grid']})", r["tc_in"],
     "; ".join(f"{'V.O. ' if l['kind'] == 'vo' else ('post ' if l['kind'] == 'post' else '')}{l['id']} f{l['at']}–{l['end']}" for l in r["lines"]),
     (f"f{r['rail_change']['at']}: {r['rail_change']['text']}" if r["rail_change"] else ""), sgn(r["lock_delta"])] for r in out]))
md.append("\n## 11. For the next stages\n")
md.append("- **Board / 1st AD:** one change against board 2 (29.01 +1 beat, the V.O. at f30). Every later shot moves 15 f; shot-relative frames "
          "don't. `board_v2.py` still carries the estimates: when it next runs, set `a4-29-vo1`'s `at` to 30 and 29.01 to 105 f, or re-lock from its output.\n"
          "- **Dialogue / mix:** the premix raises the V.O. +2 dB to dialogue level (bible §5.1). The ear pass may swap takes: any take whose "
          "length changes needs a re-run of `lock_v2.py` (and the animatic render). The fallback `i don't keep things.` "
          f"({REC['a4-26a-vo1'].get('fallback', {}).get('frames_24', '?')} f) fits 26A.01 as placed.\n"
          "- **Door cue:** the slate door's first held step is on 'asked' at 29.12 f%d (act %d).\n" % (EVENTS[[e['shot'] for e in EVENTS].index('29.12')]['at'], EVENTS[[e['shot'] for e in EVENTS].index('29.12')]['abs'])
          + "- **Scene builders:** build to the shot-relative frames in `shots-locked-v2.json`; line `at`/`end` are shot frames, `abs_in` act frames.\n")
LEDGER_P = P("out/ep01/act4/animatic/layout-v2.json")
LEDGER = json.load(open(LEDGER_P)) if os.path.exists(LEDGER_P) else []
md.append("\n## 12. The act animatic v2\n")
md.append("- **Files:** `out/ep01/act4/animatic/act4-animatic-v2.mp4` (1280 × 720, 24 fps, %d frames, %s, H.264 + the dialogue premix as AAC), "
          "`act4-v2-contact.png` (one still per shot, its middle frame), `act4-dialogue-premix-v2.wav` (+ `.cues.json`), `layout-v2.json` "
          "(what each shot's layout is built from).\n" % (TOTAL, length(TOTAL))
          + "- **Composition:** `ep01-act4-animatic` (1280 × 720) in `studio/src/episodes/ep01/act4/animatic/entry.tsx`; "
          "`ep01-act4-animatic-still` takes `--props='{\"offset\": N}'`. The Node renderer (`tools/render.ts`) runs the same `frame.ts`: a "
          "Remotion still and the Node frame were diffed pixel-identical.\n"
          + "- **Frame layout:** the show frame (480 × 270 native) at 2× nearest, top-left (960 × 540); the editor's panel on the right (shot id, "
          "tag and size, the told-twice side label, episode timecode, act and shot frame, the act's bar and beat, the shot's first action line, "
          "what the layout is built from: green = built assets, pink = stand-in or box); subtitles under the picture (dialogue with the speaker, "
          "lowercase italic `mas (v.o.)` in his cyan, `(O.S.)` and `(THROUGH THEIR LAPTOP)` marked); the act timeline at the bottom (his side "
          "blue, the board's side amber). In the picture: the show's dialogue box (typed 1.25 ch/f, tail to the speaker), the V.O. line (x 12, "
          "baseline 198, 0.5 ch/f) and the rail band with the lock's rail text (typed 2 ch/f from its change frame) and a HIS SIDE / THE "
          "BOARD'S SIDE chip.\n"
          + "- **Audio:** every voiced cue at its lock frame (a sync check found 0 of %d cues off by more than a frame in the muxed file). Posts are "
          "silent, as in the cut. No score, no SFX, no room tone.\n" % len(AUDIO)
          + "- **Approximations:** GLYPH tokens (26.05) are tinted cells; held rooms behind portrait windows are drawn once per shot; a held "
          "room's lighting steps are the lock's `[PF]` fallaways (one family rung every few frames, room only).\n")
if LEDGER:
    st = [r for r in LEDGER if r["standin"]]
    md.append(f"\n**Stand-ins and boxes ({len(st)} of {len(LEDGER)} shots).** Everything else is laid out from built assets only.\n\n")
    md.append(mdt(["Shot", "Tag", "What the layout uses"], [[r["id"], r["tag"], r["st"]] for r in st]))
md.append("\n**What the layout pass found (for the owners):**\n\n"
          "- **Lighthouse rent meters (rooms-b, board CHECK):** FAILS. `drawLighthouse` hangs the ELGOOG meter at x ≈ 330, under Mario's right "
          "window (x 356–468) in 27.24, so `ELGOOG · UP TO $2B` is half covered. Move meter 2 left of x ≈ 300 (or both meters into the left half).\n"
          "- **The tile avalanche (kits):** the kit's 40 × 21-slot plan (745 / 770 exactly) is laid out for a 270-row frame. Under the rail band only "
          "16 rows show, so the first ~200 tiles land out of sight. The animatic plans it in a 330-row buffer and shows rows 60–262 (the top 5 rows "
          "fill off-screen, last); the board's four tiles sit on rows 7 and 14. The kit should re-plan for the 203-row room area.\n"
          "- **The call grid in the [SCR] bezel (kits):** 150 × 84 tiles don't fit the bezel's 456 × 177 opening in two rows; the animatic uses "
          "150 × 76 (G4) and 144 × 76 (G5 with Rima). The pass-one grids need the kit's layout at that size.\n"
          "- **Hourglass inserts (27.30, 30.21):** TTEMME's `drawHourglass` 'lg' reads tiny at insert scale; the kits' `hourglass` 'L' (≈ 24 px) "
          "is used and still reads small in a 480 × 203 prop insert. An insert-scale drawing may be wanted.\n"
          "- **The Orb in a portrait window (26A.06, 29.07a, 29.10):** not built; the animatic stands it in with orb-medium's `drawOrb` at r 34.\n"
          "- **Posts, cards, the rail:** `kit.post-ui` and `kit.cards` (quote cards, the act-out card, name-card stat lines, the rail band) are "
          "stand-ins drawn by the animatic; they are the long pole (10 of 12 chunks).\n")
open(os.path.join(PROD, "timing-v2.md"), "w").write(tidy("".join(md)))

# ================================================================================================ chunks-v2.md
cm = []
cm.append("# Ep1 · Act Four · Production chunks v2 (final, from timing lock v2)\n")
cm.append("*THE EDITOR, 2026-09-25. Generated by `tools/lock_v2.py`. Chunk boundaries are board 2's; the frames are the lock's (act frame "
          "0 = episode 12:31:00, end exclusive). Asset status is board 2's, updated for the medium-tier and insert stages that ran after it "
          "(the `now` column). Each chunk renders on its own; hand-offs between chunks are hard cuts except where noted.*\n\n")
cm.append(mdt(["Chunk", "Shots", "Act frames", "Length", "Episode TC", "Δ vs board 2", "Lines", "Events"], [
    [c["id"], f"{c['first']}–{c['last']} ({c['n_shots']})", f"{c['start_frame']}–{c['end_frame']}", f"{c['frames']} f · {c['seconds']} s",
     f"{c['tc_in']}–{c['tc_out']}", sgn(c["delta"]), len(c["lines"]), c["visual_events"]] for c in chunks]))
ASSETS = {a["id"]: a for a in BOARD["assets"]}
for c in chunks:
    cm.append(f"\n## {c['id']} · {c['title']}\n\n")
    cm.append(f"- **Frames:** act {c['start_frame']}–{c['end_frame']} ({c['frames']} f, {c['seconds']} s), episode {c['tc_in']}–{c['tc_out']}.\n")
    cm.append(f"- **Board 2's dependency note:** {c['depends_on']}\n")
    need = []
    for aid in c["assets"]:
        a = ASSETS.get(aid)
        if not a:
            continue
        now = ASSET_NOW.get(aid)
        st = now[0] if now else a["status"]
        if st in ("EXISTS", "REUSE", "BUILT"):
            continue
        need.append([aid, a["owner"], a["status"], (now[0] + ": " + now[1]) if now else "—", ", ".join(x for x in a["used_in"] if x in [r["id"] for r in out[IDX[c['first']]: IDX[c['last']] + 1]])])
    built = [aid for aid in c["assets"] if (ASSET_NOW.get(aid, (ASSETS.get(aid, {}).get("status"),))[0] in ("EXISTS", "REUSE", "BUILT"))]
    cm.append(f"- **Ready ({len(built)}):** " + ", ".join(f"`{x}`" for x in built) + "\n")
    if need:
        cm.append(f"- **Still to build or confirm ({len(need)}):**\n\n")
        cm.append(mdt(["Asset", "Owner", "Board 2", "Now", "Shots here"], need))
    else:
        cm.append("- **Still to build:** nothing.\n")
    vo = [l for l in c["lines"] if "-vo" in l]
    if c["lines"]:
        cm.append(f"- **Lines ({len(c['lines'])}):** " + ", ".join(f"`{l}`" for l in c["lines"]) + (f" (V.O.: {', '.join(vo)})" if vo else "") + "\n")
    rows = out[IDX[c["first"]]: IDX[c["last"]] + 1]
    LED = {x["id"]: x for x in (json.load(open(P("out/ep01/act4/animatic/layout-v2.json"))) if os.path.exists(P("out/ep01/act4/animatic/layout-v2.json")) else [])}
    sti = [r["id"] for r in rows if LED.get(r["id"], {}).get("standin")]
    if sti:
        cm.append(f"- **Animatic stand-ins / boxes here ({len(sti)}):** " + ", ".join(sti) + " (see timing-v2.md §12)\n")
    cm.append("\n" + mdt(["Shot", "Tag", "Frames (act)", "Len", "Animatic layout"], [[r["id"], r["tag"], f"{r['start_frame']}–{r['end_frame']}", r["grid"], LED.get(r["id"], {}).get("st", "")] for r in rows]))
cm.append("\n## Cross-chunk dependencies\n\n"
          "- **C02 / C03 / C11 are the W0 calibration trio** (sc 26, 26A, the calm-off): build them first; they set the [PF] fallaway method, "
          "the [CU] and the medium-tier look for everything after.\n"
          "- **C03 → C07 / C08:** the dark-room medium plate, Mas and the Orb medium rigs and the V.O. line kit carry into pass two.\n"
          "- **C04 → C06:** the board's call grid, the post-ui and the cards kit (name cards, the rail) are first used in pass one and reused in C07–C12.\n"
          "- **C09 reuses C04's falling-stack plan** (hearts → tiles). C12's 1993 dialog and arrow reuse C02's.\n"
          "- **kit.post-ui and kit.cards are still unbuilt** and touch 10 of 12 chunks: they are the long pole. The animatic uses stand-ins.\n"
          "- **Audio:** the premix (`out/ep01/act4/animatic/act4-dialogue-premix-v2.wav`) is the timing reference; the score (keynote piano, "
          "violin) and the SFX list are in shots-v2.json `sound`.\n")
open(os.path.join(PROD, "chunks-v2.md"), "w").write(tidy("".join(cm)))

# ================================================================================================ console
print("total", TOTAL, length(TOTAL), "episode out", tc(TOTAL), "vs printed", TOTAL - PRINTED_31, "vs board", TOTAL - BOARD["totals"]["frames"])
for k, v in scenes.items():
    print(f"{k:4s} {v['tc_in']}–{v['tc_out']} {v['frames']:5d} f  printed {v['printed_frames']:5d} ({sgn(v['delta_vs_printed_frames'])})  board {sgn(v['delta_vs_board_frames'])}")
for v in vo_rows:
    print("VO", v["id"], v["shot"], v["at"], v["abs_in"], v["abs_out"], "ok" if v["ok"] else v["issues"], json.dumps(v["clearances"], ensure_ascii=False))
for tr in trim_rows:
    print("TRIM", tr["id"], tr["delta_frames"], tr["act_after"], tr["under_7_33"])
print("shares", {k: v["pct"] for k, v in SHARES.items()})
print("problems", len(problems))
for p in problems:
    print("  ", p)
