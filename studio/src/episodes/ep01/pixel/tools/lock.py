#!/usr/bin/env python3
"""lock.py - the Ep1 pixel pipeline's timing lock (P0, the v3-pipeline pass), generalized from Act Four's lock_v5.py.

ANY segment's stick timeline in, the frame-exact data the pixel layouts need out. Like lock_v5.py it re-times nothing:
it reads the stick timeline's beats, lines and in-world text as they are, adds what a layout needs on the same clock
(mouth tracks, word frames, story marks, who shows a mouth, the texts sorted by kind, the rails, the subtitles), checks
it and writes it out.

Inputs (read-only):
  --timeline  a stick timeline (show/reel/ep01-v3/<seg>.json; any "dialogueReel" timeline): beat lengths, lines (t, dur,
              in, words; t may be negative, down to -4 s: a pre-lap under the previous shot), onscreen, sounds, names,
              seq, side, frame, chars, cont, shotId, speak
  --takes     one or more takes files (fastrec's lines-*.json: mouth visemes, file length, speaker, mode, on_camera),
              merged by id, later files win. Default: the timeline's _source.takes when it names a file. A line with no
              take still locks: its kind and mode come from its tag, its mouth track from its words (logged)
  --mix       the temp track (length check; its path and offset go into the lock for the renderer's mux)
  --plan      optional per-segment plan (JSON): per-shot marks (anchors), faces, verdicts, whips, badges; post ids,
              text kinds, sequence titles, extra refs and sound marks; `plan_py` reads the same tables out of a
              python file's top-level assignments (Act Four: lock_v5.py's PLAN, V4_IDS, POST_IDS, TEXT_KIND, CLS)
              without running it; `base_lock` = an older lock whose marks a reused layout keeps, scaled
Outputs (generated; re-run after any change to the inputs; never hand-edit):
  show/episodes/ep01/production/full-v3/lock/<seg>.json      the lock: shots, lines, mouths, texts, rails, marks, checks
  studio/src/episodes/ep01/pixel/<seg>/data.ts               the same for the layouts and the host (export LOCK)

The clock (as lock_v5, timing-v5.md §1):
  * Segment frame 0 = the timeline's first beat. Beats start at the cumulative beat lengths rounded to frames (the stick
    reel's own rule, schema.ts timeEpisode: half-up rounding, at least one frame per beat).
  * A shot is a beat. A `cont` beat that follows its own shot directly merges into it; one that returns after a
    cutaway is its own shot on the same setup (shotId).
  * A line starts on the frame in which its first sound falls (beat start + t) and ends after the frame of its last
    sound. Mouth changes and word starts use the same rule. A line appears in every shot it sounds in: its own, every
    later shot it runs into (`carry`, an L-cut) and, for a pre-lap (t < 0), the earlier shot it starts under (`pre`).
  * Marks are anchors (below), resolved on the stick's own sound spots, text times and the takes' words, so the
    picture lands on the sounds in the mix. A shot-spec (shots.ts) may declare more marks; the host resolves those the
    same way at load time (pixel/anchors.ts).
Anchors (offsets are FRAMES; the same grammar in plan JSON arrays and in shots.ts):
  ('f', n)                      n frames into the shot          ('len', off)            the shot's end + off
  ('snd', name, n, off)         the n-th sound spot of that name in the shot (1-based)
  ('txt', substr, 'at'|'until', off)   an in-world text item's start or end
  ('on'|'end', line, off)       a line's first / last sound
  ('w'|'we', line, word, off)   a word's start / end ('word#2' = its 2nd occurrence)
  ('speak', who, 'at'|'end', off)   a silent speaking highlight      ('beat', beat_id, off)   a merged beat's first frame
  ('mark', name, off)           another mark of the same shot
Run:
  python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v3/act1.json \\
      [--takes audio/ep01/v3/act1/lines.json ...] [--mix audio/.../mix.wav --mix-offset 0] [--plan .../act1/plan.json]
  (prints the checks; exits 1 on a failed check, or on any problem with --strict)
Record: show/episodes/ep01/production/full-v3/pipeline.md; how a shot pass uses it: studio/src/episodes/ep01/pixel/README.md
"""
from __future__ import annotations

import argparse
import ast
import json
import math
import os
import re
import statistics
import subprocess
import sys
import wave
from collections import OrderedDict

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
FPS = 24
EPS = 1e-6

# ====================================================================================== defaults (overridable by the plan)
SIDE = {"HIS SIDE": "MAS", "THE BOARD'S SIDE": "BOARD"}
# in-world text kinds for a segment with no plan table: the reel's device prefixes (schema.ts deviceOf), which are
# pointers and never rendered (stripped), then toasts and clocks by their shape. Plates are found by name (below).
DEFAULT_TEXT_KIND = [
    (r"^\s*(?:RAIL|DATE RAIL|CHYRON|DATE CHYRON|LOWER THIRD)\s*:\s*", "rail", True),
    (r"^\s*(?:POST|TWEET)\s*:\s*", "post", False),
    (r"^\s*(?:UI|BUTTON)\s*:\s*", "ui", True),
    (r"^\s*(?:TICKER|CRAWL)\s*:\s*", "ticker", True),
    (r"^\s*SIGN\s*:\s*", "sign", True),
    (r"^\s*STAMP\s*:\s*", "stamp", True),
    (r"^\s*PLATE\s*:\s*", "plate", True),
    (r"^\s*(?:TITLE CARD|TITLE|CARD|SUPER|CAPTION|ON ?SCREEN)\s*:\s*", "card", True),
    (r"^\s*(?:TOAST|NOTICE)\s*:\s*", "toast", True),
    (r"^You've been removed from the meeting\.$|left the call$|joined the call$|was removed from the meeting\.$|^rewinding", "toast", False),
    (r"^\d+:\d\d$", "clock", False),
]
# a shot's size class for the margin (frame4's CLS_NAME keys), from the stick's framing (lock_v5.py CLS)
DEFAULT_CLS = [(r"^WIDE|^SPLIT", "W"), (r"^TWO-SHOT|^MEDIUM", "M"), (r"^OTS", "OTS"), (r"^SINGLE · MCU", "MCU"), (r"^SINGLE · CU", "CU"),
               (r"^SINGLE · ECU|^INSERT|^OVERHEAD|^LOW|^SINGLE · the Orb", "ECU"), (r"^SCREEN", "SW"), (r"^POV", "SC"),
               (r"^GFX · detail", "GD"), (r"^GFX", "GS"), (r"^CARD|^FLASH", "GFX"), (r"^BOX", "BOX"),
               # the v2/v3 timelines' own framing words (after Act Four's, so Act Four's classes are unchanged)
               (r"^MCU", "MCU"), (r"^ECU|^CU", "ECU"), (r"^HIGH", "W"), (r"^SCR|^2S·SCR", "SW"), (r"^BLACK", "GFX"), (r"^MEDIUM CLOSE", "MCU")]
REVIEWER_SLATE = re.compile(r"reviewer[- ]only|^reviewer slate", re.I)


def fr(sec: float) -> int:
    """the frame in which a moment (segment seconds) falls"""
    return int(math.floor(sec * FPS + EPS))


def js_round(x: float) -> int:
    """JavaScript's Math.round (half up), so beat starts match the stick reel's own (schema.ts timeEpisode)"""
    return int(math.floor(x + 0.5))


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9']", "", w.lower())


def parse_tc(v, fps=FPS) -> int:
    """'12:31:00' (MM:SS:FF when 3 parts... no: HH? we use the show's MM:SS:FF), '12:31' (MM:SS), 18024 (frames)"""
    if v is None:
        return 0
    if isinstance(v, (int, float)):
        return int(v)
    s = str(v).strip()
    if re.fullmatch(r"\d+", s):
        return int(s)
    p = [int(x) for x in s.split(":")]
    if len(p) == 3:  # the show's episode timecode: MM:SS:FF (tc() below writes it this way)
        return (p[0] * 60 + p[1]) * fps + p[2]
    if len(p) == 2:
        return (p[0] * 60 + p[1]) * fps
    raise ValueError(f"bad timecode {v!r}")


def read_py_tables(path: str, names: list[str]) -> dict:
    """the named top-level assignments of a python file, evaluated WITHOUT running the file (lock_v5.py writes its outputs
    when run). Only literal/dict()/tuple expressions are evaluated, in an empty namespace."""
    tree = ast.parse(open(path).read(), path)
    out: dict = {}
    for node in tree.body:
        targets = []
        if isinstance(node, ast.Assign):
            targets, value = node.targets, node.value
        elif isinstance(node, ast.AnnAssign) and node.value is not None:
            targets, value = [node.target], node.value
        for t in targets:
            if isinstance(t, ast.Name) and t.id in names:
                code = compile(ast.Expression(value), path, "eval")
                out[t.id] = eval(code, {"__builtins__": {"dict": dict, "tuple": tuple, "list": list, "set": set}}, {})  # noqa: S307
    return out


def wav_frames(path: str) -> float | None:
    try:
        with wave.open(path) as w:
            return w.getnframes() / w.getframerate() * FPS
    except (FileNotFoundError, wave.Error, EOFError):
        return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--seg", required=True, help="segment key: coldopen, act1, act2, act3, act4, tag, act4-v5 (the port test)...")
    ap.add_argument("--timeline", help="the stick timeline JSON, or git:<rev>:<path> (default: the plan's `timeline`)")
    ap.add_argument("--takes", action="append", default=None, help="a takes JSON (repeatable; default: the timeline's _source.takes)")
    ap.add_argument("--no-takes", action="store_true", help="lock from the timeline's own lines only")
    ap.add_argument("--mix", help="the temp track WAV (default: the plan's mix.path)")
    ap.add_argument("--mix-offset", type=int, default=None, help="mix frame of segment frame 0 (a standalone stick reel's mix: 72)")
    ap.add_argument("--plan", help="the per-segment plan JSON")
    ap.add_argument("--ep-in", default=None, help="episode timecode of segment frame 0 (MM:SS:FF or frames; default: the plan's, else the first beat's realStart, else 0)")
    ap.add_argument("--label", default=None, help="the segment's name for the margin, e.g. 'ACT ONE' (default: the first beat's act)")
    ap.add_argument("--out-json", default=None)
    ap.add_argument("--out-ts", default=None)
    ap.add_argument("--strict", action="store_true", help="exit 1 on any problem, not only on a failed check")
    ap.add_argument("--quiet", action="store_true")
    A = ap.parse_args()

    SEG = A.seg
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", SEG):
        ap.error("--seg: lowercase letters, digits and dashes (it names a folder and a Remotion composition)")
    PLAN_FILE = A.plan
    PL = json.load(open(PLAN_FILE)) if PLAN_FILE else {}
    rel = lambda p: p if os.path.isabs(p) else P(p)  # noqa: E731

    tables: dict = {}
    if PL.get("plan_py"):
        tables = read_py_tables(rel(PL["plan_py"]), ["PLAN", "V4_IDS", "POST_IDS", "TEXT_KIND", "CLS", "SEQ_TITLE"])
    PLAN: dict[str, dict] = {k: dict(v) for k, v in (tables.get("PLAN") or {}).items()}
    for sid, extra in (PL.get("shots") or {}).items():  # JSON shot entries merge over the python ones
        e = PLAN.setdefault(sid, {})
        for k, v in extra.items():
            if k == "marks":
                e.setdefault("marks", {}).update({n: tuple(a) for n, a in v.items()})
            else:
                e[k] = v
    V4_IDS = dict(tables.get("V4_IDS") or {}) | dict(PL.get("v4_ids") or {})
    POST_IDS = dict(tables.get("POST_IDS") or {}) | dict(PL.get("post_ids") or {})
    if tables.get("TEXT_KIND") or PL.get("text_kinds"):
        # a plan's table replaces the defaults (Act Four's own names); only a 'ui' item loses its 'UI: ' (lock_v5's rule)
        TEXT_KIND = [(rx, k, None) for rx, k in (PL.get("text_kinds") or tables.get("TEXT_KIND"))]
        plan_kinds = True
    else:
        TEXT_KIND = DEFAULT_TEXT_KIND
        plan_kinds = False
    CLS = [tuple(x) for x in (PL.get("cls") or tables.get("CLS") or DEFAULT_CLS)]
    SEQ_TITLE = {k: tuple(v) for k, v in ((tables.get("SEQ_TITLE") or {}) | (PL.get("seq_titles") or {})).items()}

    TL_ARG = A.timeline or PL.get("timeline") or ""
    if TL_ARG.startswith("git:"):  # git:<rev>:<path> = the timeline as committed (Act Four's port reads the one v5 was cut from)
        _, rev, gpath = TL_ARG.split(":", 2)
        REEL = json.loads(subprocess.run(["git", "-C", REPO, "show", f"{rev}:{gpath}"], check=True, capture_output=True, text=True).stdout)
        TL_PATH, TL_NAME = P(gpath), f"{gpath}@{rev}"
    else:
        TL_PATH = rel(TL_ARG)
        if not os.path.isfile(TL_PATH):
            ap.error(f"no timeline at {TL_PATH!r} (--timeline)")
        REEL = json.load(open(TL_PATH))
        TL_NAME = os.path.relpath(TL_PATH, REPO)
    SRC = REEL.get("_source") if isinstance(REEL.get("_source"), dict) else {}
    takes_paths = [] if A.no_takes else (A.takes if A.takes is not None else (PL.get("takes") or ([SRC["takes"]] if isinstance(SRC.get("takes"), str) else [])))
    TAKES: OrderedDict[str, dict] = OrderedDict()
    for tp in takes_paths:
        if not os.path.isfile(rel(tp)):
            print(f"warning: no takes file {tp}", file=sys.stderr)
            continue
        for x in json.load(open(rel(tp))):
            TAKES[x["id"]] = x
    BASE = json.load(open(rel(PL["base_lock"]))) if PL.get("base_lock") else None
    BASESH = {s["id"]: s for s in (BASE or {}).get("shots", [])}
    CAST = REEL.get("cast") or {}
    CAST_UP = {cid.upper(): cid for cid in CAST}

    OUT_JSON = rel(A.out_json or f"show/episodes/ep01/production/full-v3/lock/{SEG}.json")
    OUT_TS = rel(A.out_ts or f"studio/src/episodes/ep01/pixel/{SEG}/data.ts")
    MIX_PATH = A.mix or (PL.get("mix") or {}).get("path")
    MIX_OFF = A.mix_offset if A.mix_offset is not None else int((PL.get("mix") or {}).get("offset", 0))

    problems: list[str] = []
    decisions: list[str] = []
    checks: list[dict] = []

    def check(name: str, ok: bool, detail: str):
        checks.append(dict(check=name, ok=bool(ok), detail=detail))
        if not ok:
            problems.append(f"CHECK FAILED: {name}: {detail}")

    # ================================================================================== 1. beats -> frames
    beats = REEL.get("beats") or []
    if not beats:
        ap.error("the timeline has no beats")
    for i, b in enumerate(beats):  # the reel names an unnamed beat by its position (schema.ts normBeat); so do we
        if not b.get("id"):
            b["id"] = f"{i + 1:02d}"
            decisions.append(f"beat {i + 1} has no id: called {b['id']}")
    if REEL.get("dialogueReel") is not True:
        decisions.append("the timeline does not set dialogueReel: line t read as SECONDS anyway (the pixel lock has no fraction rule)")
    starts = []
    acc, prev = 0.0, 0
    for b in beats:
        acc += float(b.get("reelDur") or 3)
        end = max(prev + 1, js_round(acc * FPS))
        starts.append((prev, end))
        prev = end
    ACT = prev
    BEAT_AT = {b["id"]: i for i, b in enumerate(beats)}
    rs = [b.get("realStart") for b in beats]
    if PL.get("ep_in") is not None or A.ep_in is not None:
        EP_IN = parse_tc(A.ep_in if A.ep_in is not None else PL.get("ep_in"))
    elif isinstance(rs[0], (int, float)):
        EP_IN = int(round(rs[0] * FPS))
    else:
        EP_IN = 0
    if all(isinstance(x, (int, float)) for x in rs):
        worst = max(abs((x * FPS - EP_IN) - s0) for x, (s0, _e) in zip(rs, starts))
        check("beat starts agree with realStart", worst <= 0.5, f"largest difference {worst:.3f} f")
    whole = [b["id"] for b in beats if abs(float(b.get("reelDur") or 3) * FPS - round(float(b.get("reelDur") or 3) * FPS)) >= 0.02]
    if whole:
        decisions.append(f"{len(whole)} beat lengths are not whole frames ({', '.join(whole[:6])}{'...' if len(whole) > 6 else ''}): beats start on the rounded running total, as the stick reel draws them")
    if isinstance(SRC.get("act_seconds"), (int, float)):
        check("segment length = the stick's act_seconds", ACT == js_round(SRC["act_seconds"] * FPS), f"{ACT} f vs act_seconds {SRC['act_seconds']} s")

    def tc(f: int) -> str:
        e = EP_IN + f
        return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"

    def length(frames: int) -> str:
        s = frames / FPS
        return f"{int(s // 60)}:{s % 60:05.2f}"

    # ================================================================================== 2. shots (a cont beat right after its shot merges)
    shots: list[OrderedDict] = []
    for i, b in enumerate(beats):
        s0, e0 = starts[i]
        sid = b.get("shotId", b["id"])
        if b.get("cont") and shots and shots[-1]["setup"] == sid:
            sh = shots[-1]
            sh["beats"].append(b["id"])
            sh["e"] = e0
            sh["_beats"].append((b, s0, e0))
            continue
        shots.append(OrderedDict(id=b["id"], setup=sid, beats=[b["id"]], s=s0, e=e0, _beats=[(b, s0, e0)]))
    SH = {s["id"]: s for s in shots}
    if len(SH) != len(shots):
        dup = sorted({s["id"] for s in shots if sum(1 for x in shots if x["id"] == s["id"]) > 1})
        problems.append(f"duplicate shot ids (beat ids): {dup}")
    if PL.get("require_plan_for_every_shot"):
        check("every shot has a plan entry", all(s["id"] in PLAN for s in shots), f"missing: {[s['id'] for s in shots if s['id'] not in PLAN]}")
    extra = [k for k in PLAN if k not in SH]
    if extra:
        (check if PL.get("require_plan_for_every_shot") else lambda n, ok, d: decisions.append(d))("no plan entry without a shot", not extra, f"plan entries with no shot: {extra}")

    # ================================================================================== 3. lines (voiced), on the stick's frames
    LINES: dict[str, OrderedDict] = {}
    no_take: list[str] = []

    def words_mouth(words: list, n_frames: int) -> list:
        """a stand-in mouth track from the words when a line has no take's visemes: open on the words, shut between"""
        out: list[list] = []
        for (w, f0, f1) in words:
            f0, f1 = max(0, f0), max(f0 + 1, f1)
            first = norm(w)[:1]
            k = f0
            if first in ("m", "b", "p"):
                out.append([k, "M"])
                k += 2
            shapes = ["E", "A", "O", "A"]
            j = 0
            while k < f1:
                out.append([k, shapes[j % 4]])
                k += 3
                j += 1
            out.append([f1, "rest"])
        out.sort(key=lambda x: x[0])
        m: list[list] = []
        for fk, s in out:
            fk = min(fk, n_frames)
            if m and m[-1][0] == fk:
                m[-1][1] = s
            elif not m or m[-1][1] != s:
                m.append([fk, s])
        if m and m[0][0] != 0:
            m.insert(0, [0, "rest"])
        if m and m[-1][1] != "rest":
            m.append([n_frames, "rest"])
        return m

    for sh in shots:
        for (b, s0, e0) in sh["_beats"]:
            for l in b.get("lines") or []:
                if not l.get("text"):
                    continue
                lid = l.get("id") or f"{b['id']}-L{(b.get('lines') or []).index(l) + 1}"
                R = TAKES.get(lid)
                t = max(-4.0, float(l.get("t", 0) or 0))
                dur = max(0.05, float(l.get("dur", 1) or 1))
                fin = float(l.get("in", 0) or 0)
                on_s = s0 / FPS + t
                end_s = on_s + dur
                file_s = on_s - fin
                on_f = fr(on_s)
                e_f = int(math.floor(end_s * FPS - EPS)) + 1
                words = [[w[0], fr(on_s + w[1]) - on_f, fr(on_s + w[2]) - on_f] for w in (l.get("words") or [])]
                tag = l.get("tag", "") or ""
                mouth: list[list] = []
                if R is not None:
                    for m in R.get("mouth", []):
                        f_rel = fr(file_s + m["t"]) - on_f
                        if f_rel >= e_f - on_f:
                            break
                        f_rel = max(0, f_rel)
                        if mouth and mouth[-1][0] == f_rel:
                            mouth[-1][1] = m["shape"]
                        elif not mouth or mouth[-1][1] != m["shape"]:
                            mouth.append([f_rel, m["shape"]])
                    if mouth and mouth[0][0] != 0:
                        mouth.insert(0, [0, "rest"])
                    if mouth and mouth[-1][1] != "rest":
                        mouth.append([e_f - on_f, "rest"])
                    kind, mode = R.get("kind", "dialogue"), R.get("mode") or "on-mic"
                    kind = kind if kind in ("dialogue", "vo") else ("vo" if re.fullmatch(r"V\.?O\.?", tag.strip(), re.I) else "dialogue")
                    file, frames24 = R.get("file") or l.get("audio", ""), int(R.get("frames_24") or math.ceil((fin + dur + 0.3) * FPS))
                    on_camera, lip_sync, device = R.get("on_camera"), bool(R.get("lip_sync")), R.get("device")
                    tw = (R.get("speaker") or "").upper()
                    lw = (l.get("who") or "").upper()
                    toks = lambda x: set(re.findall(r"[A-Z0-9]+", x.upper()))  # noqa: E731
                    if lw and tw and not toks(lw) <= (toks(tw) | toks(R.get("speaker_slug") or "")):
                        problems.append(f"{lid}: the stick's speaker {l.get('who')} vs the take's {R.get('speaker')}")
                else:
                    no_take.append(lid)
                    kind = "vo" if re.fullmatch(r"V\.?O\.?", tag.strip(), re.I) else "dialogue"
                    mode = {"laptop": "speaker", "monitor": "speaker"}.get(tag.lower(), "on-mic")
                    file = l.get("audio", "")
                    wf = wav_frames(rel(file)) if file else None
                    frames24 = int(math.ceil(wf)) if wf else int(math.ceil((fin + dur + 0.3) * FPS))
                    on_camera, lip_sync, device = ("os" if tag.upper() in ("O.S.", "OS") else None), False, (tag.lower() if tag.lower() in ("laptop", "monitor") else None)
                    if kind != "vo" and words:
                        mouth = words_mouth(words, e_f - on_f)
                who = (l.get("who") or "").upper()
                if lid in LINES:
                    problems.append(f"line id {lid} appears twice (the second one wins)")
                LINES[lid] = OrderedDict(
                    id=lid, shot=sh["id"], beat=b["id"], kind=kind, mode=mode, who=who, text=l["text"], tag=tag,
                    on_s=round(on_s, 4), end_s=round(end_s, 4), file_s=round(file_s, 4), abs_in=on_f, abs_out=e_f,
                    file_in=fr(file_s), file_out=fr(file_s) + frames24, file=file, stick_t=l.get("t", 0), stick_in=fin,
                    cut=bool(l.get("cut")), on_camera=on_camera, take_lip_sync=lip_sync,
                    # off screen: the take says so (lock_v5's rule); with no take, the stick's tag does
                    os=on_camera == "os" or mode == "speaker" or (R is None and tag.upper() in ("O.S.", "OS")), via=device, words=words, mouth=mouth,
                    mouth_src="take" if R is not None and mouth else ("words" if mouth else "none"), pre=t < 0,
                )
    if no_take:
        decisions.append(f"{len(no_take)} lines have no take in the takes files: kind/mode from the tag, mouth track from the words ({', '.join(no_take[:8])}{'...' if len(no_take) > 8 else ''})")

    # ================================================================================== 4. posts and in-world text, rails
    RAILS: list[OrderedDict] = []
    POSTS: dict[str, OrderedDict] = {}
    CAST_NAMES = sorted(((c.get("name") or "").upper(), cid) for cid, c in CAST.items() if c.get("name"))

    def text_kind(t: str) -> tuple[str, str]:
        """(kind, the text as drawn): the plan's table or the defaults"""
        for rx, k, strip in TEXT_KIND:
            m = re.search(rx, t)
            if m:
                if plan_kinds:
                    return k, (t[4:] if k == "ui" else t)
                return k, (t[m.end():] if strip else t)
        return "label", t

    def floor_f(t: str) -> int:
        return int(math.ceil((0.25 + 0.05 * len(t)) * FPS))

    for sh in shots:
        sh["texts"] = []
        sh["onscreen"] = []
        npost = 0
        for (b, s0, e0) in sh["_beats"]:
            name_at = [float(n.get("at", 0) or 0) for n in (b.get("names") or [])]
            for o in b.get("onscreen") or []:
                if isinstance(o, str):
                    o = {"text": o, "at": 0, "until": None}
                t = o.get("text") or ""
                if not t:
                    continue
                a = s0 + fr(float(o.get("at", 0) or 0))
                u = s0 + fr(float(o["until"])) if o.get("until") is not None else sh["e"]
                sh["onscreen"].append(OrderedDict(text=t, s=a - sh["s"], e=u - sh["s"]))
                kind, shown = text_kind(t)
                # "NAME: text" with a cast name = a post (Act Four's S5.03 "RIMA: ..." is the case lock_v5 special-cased)
                mm = re.match(r"^([A-Z][A-Z\-]*): (.+)$", t)
                if kind == "label" and mm and mm.group(1) in CAST_UP:
                    kind, t = "post", "POST: " + t
                if kind == "label" and not plan_kinds:
                    up = t.upper()
                    if any(abs(float(o.get("at", 0) or 0) - x) < 0.05 for x in name_at) or any(nm and up.startswith(nm) for nm, _ in CAST_NAMES):
                        kind = "plate"
                if kind == "rail":
                    rt = t[len("RAIL: "):] if plan_kinds else shown
                    RAILS.append(OrderedDict(text=rt, s=a, e=u, shot=sh["id"], floor_f=floor_f(rt if not plan_kinds else t[6:])))
                    continue
                if kind == "post":
                    m = re.match(r"^\s*(?:POST|TWEET)\s*:\s*([A-Z][A-Z .\-]*?): “?(.*?)”?$", t)
                    npost += 1
                    pid = POST_IDS.get(sh["id"]) if POST_IDS else None
                    if not pid and not POST_IDS:
                        pid = f"{sh['id']}-P{npost}"
                    if not m or not pid:
                        problems.append(f"{sh['id']}: a post I can't parse or name: {t!r}")
                        continue
                    POSTS[pid] = OrderedDict(id=pid, shot=sh["id"], beat=b["id"], kind="post", mode="post", who=m.group(1).strip(), text=m.group(2), tag="",
                                             abs_in=a, abs_out=u, words=[], mouth=[], os=False, via=None, cut=False, on_camera="post", take_lip_sync=False, pre=False)
                    continue
                sh["texts"].append(OrderedDict(kind=kind, text=shown, abs_in=a, abs_out=u, floor_f=floor_f(t), must=kind not in ("clock",)))
        for x in sh["texts"]:
            if x["must"] and x["abs_out"] - x["abs_in"] < x["floor_f"]:
                decisions.append(f"{sh['id']}: {x['kind']} {x['text'][:32]!r} is up {x['abs_out'] - x['abs_in']} f, under its read floor {x['floor_f']} f (the stick's timing; kept)")
    if POST_IDS:
        check("every silent post found", set(POSTS) == set(POST_IDS.values()), f"{sorted(POSTS)}")
    for r in RAILS:
        if r["e"] - r["s"] < r["floor_f"]:
            decisions.append(f"rail {r['text'][:28]!r} is up {r['e'] - r['s']} f, under its read floor {r['floor_f']} f (the stick's; kept)")

    # ================================================================================== 5. marks
    scaled_log: list[str] = []

    def word_frame(lid: str, word: str, which: int) -> int:
        L = LINES[lid]
        m = re.match(r"^(.*?)(?:#(\d+))?$", word)
        want, nth = norm(m.group(1)), int(m.group(2) or 1)
        hits = [w for w in L["words"] if norm(w[0]) == want]
        if len(hits) < nth:
            hits = [w for w in L["words"] if norm(w[0]).startswith(want)]
        if len(hits) < nth:
            raise KeyError(f"{lid}: no word {word!r} in {[w[0] for w in L['words']]}")
        return L["abs_in"] + hits[nth - 1][which]

    def resolve(sh: OrderedDict, a, marks: dict) -> int:
        """an anchor -> a segment frame"""
        kind = a[0]
        if kind == "f":
            return sh["s"] + a[1]
        if kind == "len":
            return sh["e"] + a[1]
        if kind == "mark":
            return marks[a[1]] + a[2]
        if kind == "beat":
            _, bid, off = a
            return starts[BEAT_AT[bid]][0] + off
        if kind == "snd":
            _, name, n, off = a
            hits = []
            for (b, s0, _e) in sh["_beats"]:
                hits += [s0 + fr(x["at"]) for x in (b.get("sounds") or []) if x["name"] == name]
            if len(hits) < n:
                raise KeyError(f"{sh['id']}: no sound {name!r} #{n}")
            return hits[n - 1] + off
        if kind == "txt":
            _, sub, which, off = a
            for (b, s0, _e) in sh["_beats"]:
                for o in b.get("onscreen") or []:
                    o = o if isinstance(o, dict) else {"text": o, "at": 0, "until": None}
                    if sub in o["text"]:
                        v = o.get("at", 0) if which == "at" else o.get("until")
                        return (s0 + fr(v) if v is not None else sh["e"]) + off
            raise KeyError(f"{sh['id']}: no text {sub!r}")
        if kind == "speak":
            _, who, which, off = a
            for (b, s0, _e) in sh["_beats"]:
                for x in b.get("speak") or []:
                    if x["id"] == who:
                        return s0 + fr(x["at"] + (x["dur"] if which == "end" else 0)) + off
            raise KeyError(f"{sh['id']}: no speak {who!r}")
        if kind in ("on", "end"):
            _, lid, off = a
            L = LINES[lid]
            return (L["abs_in"] if kind == "on" else L["abs_out"]) + off
        if kind in ("w", "we"):
            _, lid, word, off = a
            return word_frame(lid, word, 1 if kind == "w" else 2) + off
        raise ValueError(a)

    for sh in shots:
        pl = PLAN.get(sh["id"], {})
        n = sh["e"] - sh["s"]
        marks: dict[str, int] = {}
        src: dict[str, str] = {}
        base = BASESH.get(pl.get("v4") or pl.get("base") or "")
        # the base lock's own marks, re-scaled onto this shot's length (a reused layout); explicit anchors replace them
        if base:
            n4 = base["frames"]
            for name, m4 in base["marks"].items():
                v = sh["s"] + (m4 if n == n4 else int(round(m4 * n / n4)))
                marks[name] = v
                src[name] = "v4" if n == n4 else f"v4 {m4}/{n4} scaled"
        for name, a in (pl.get("marks") or {}).items():
            key = name.rstrip("_")
            try:
                marks[key] = resolve(sh, tuple(a), marks)
                src[key] = " ".join(str(x) for x in a)
            except (KeyError, IndexError, ValueError) as ex:
                problems.append(f"{sh['id']}: mark {key}: {ex}")
        for name in list(marks):
            if not (sh["s"] - 400 <= marks[name] <= sh["e"] + 400):
                problems.append(f"{sh['id']}: mark {name} at segment f {marks[name]} is far outside the shot")
            if src[name].startswith("v4 ") and "scaled" in src[name]:
                scaled_log.append(f"{sh['id']}.{name}: {src[name]} -> {marks[name] - sh['s']}")
        sh["marks_abs"] = marks
        sh["mark_src"] = src

    # ================================================================================== 6. lines per shot (own, carried in, pre-lapped), faces
    for sh in shots:
        pl = PLAN.get(sh["id"], {})
        face = pl.get("face") or {}
        rows = []
        for L in list(LINES.values()) + list(POSTS.values()):
            own = L["shot"] == sh["id"]
            carried = (not own) and L["kind"] != "post" and L["abs_in"] < sh["s"] < L["abs_out"]
            pre = (not own) and (not carried) and L["kind"] != "post" and sh["s"] <= L["abs_in"] < sh["e"] and L["abs_out"] > sh["s"]
            if not (own or carried or pre):
                continue
            f = face.get(L["who"], None) if L["kind"] != "post" else None
            rows.append(OrderedDict(
                id=L["id"], kind=L["kind"], mode=L["mode"], who=L["who"], text=L["text"], s=L["abs_in"] - sh["s"], e=L["abs_out"] - sh["s"],
                fs=(L["file_in"] - sh["s"]) if L["kind"] != "post" else None, fe=(L["file_out"] - sh["s"]) if L["kind"] != "post" else None,
                os=L["os"], via=L["via"], face=f, lip=f == "lip", carry=carried, cut=L["cut"], mouth=L["mouth"], words=L["words"],
                tag=L.get("tag", ""), pre=pre,
            ))
        rows.sort(key=lambda r: r["s"])
        sh["lines"] = rows
        for who in face:
            if face[who] and not any(r["who"] == who and r["kind"] != "post" for r in rows):
                decisions.append(f"{sh['id']}: the face table names {who}, who has no line in the shot")

    # ================================================================================== 7. sequences, refs, sound marks
    SEQS = []
    cur = None
    for sh in shots:
        b0 = sh["_beats"][0][0]
        q = b0.get("seq")
        if (q and q.get("id")) or cur is None:
            q = q if (q and q.get("id")) else {"id": SEG.upper(), "place": "", "time": "", "side": ""}
            cur = OrderedDict(id=q["id"], side=q.get("side", ""), place=q.get("place", ""), time=q.get("time", ""), s=sh["s"], e=sh["e"], shots=[])
            SEQS.append(cur)
        cur["shots"].append(sh["id"])
        cur["e"] = sh["e"]
        sh["seq"] = cur["id"]
    BASESEQ = {q["id"]: q for q in (BASE or {}).get("sequences", [])}
    for q in SEQS:
        if q["id"] in BASESEQ:
            q["chapter"], q["title"] = BASESEQ[q["id"]]["chapter"], BASESEQ[q["id"]]["title"]
        else:
            # a plan's own tables keep lock_v5's default (id, place); a plain timeline's sequence reads by its time
            q["chapter"], q["title"] = SEQ_TITLE.get(q["id"], (q["id"], q["place"]) if (tables or BASE) else (q["time"] or q["id"], q["place"]))
        cues = []
        for sid in q["shots"]:
            for (b, _s0, _e) in SH[sid]["_beats"]:
                cues += [c for c in (b.get("cues") or []) if c not in cues]
        q["cue"] = " · ".join(cues)
        q["frames"] = q["e"] - q["s"]
        q["tc_in"], q["tc_out"] = tc(q["s"]), tc(q["e"])

    def ref(r):
        """'SHOT.mark' | 'line:ID.in|out' | 'shot:ID.s|e' | an int | None -> a segment frame"""
        if r is None or isinstance(r, int):
            return r
        m = re.fullmatch(r"line:(.+)\.(in|out)", r)
        if m:
            L = LINES.get(m.group(1)) or POSTS.get(m.group(1))
            return L["abs_in"] if m.group(2) == "in" else L["abs_out"]
        m = re.fullmatch(r"shot:(.+)\.(s|e)", r)
        if m:
            return SH[m.group(1)][m.group(2)]
        sid, _, mk = r.rpartition(".")
        return SH[sid]["marks_abs"][mk]

    REFS: dict = {}
    for name, v in (PL.get("refs") or {}).items():
        try:
            REFS[name] = [ref(x) for x in v] if isinstance(v, list) else ref(v)
        except (KeyError, TypeError) as ex:
            problems.append(f"ref {name}: {ex!r}")
    SOUND_MARKS = []
    for m in PL.get("sound_marks") or []:
        try:
            SOUND_MARKS.append(OrderedDict(kind=m["kind"], n=m["n"], name=m["name"], s=ref(m["s"]), e=ref(m.get("e")), shot=m["shot"]))
        except (KeyError, TypeError) as ex:
            problems.append(f"sound mark {m.get('name')}: {ex!r}")
    for c in PL.get("ref_checks") or []:  # [name, ref_a, ref_b, min_s, max_s]: the seconds between two refs
        try:
            a_, b_ = ref(c[1]), ref(c[2])
            check(c[0], c[3] <= (b_ - a_) / FPS <= c[4], f"{c[1]} f {a_} -> {c[2]} f {b_} = {(b_ - a_) / FPS:.2f} s")
        except (KeyError, TypeError) as ex:
            problems.append(f"ref check {c[0]}: {ex!r}")

    # ================================================================================== 8. the subtitles, named as the stick names them
    named: dict[str, int] = {cid: -1 for cid, c in CAST.items() if c.get("known")}
    for sh in shots:
        for (b, s0, _e) in sh["_beats"]:
            for nm in b.get("names") or []:
                f0 = s0 + fr(nm["at"])
                if nm["id"] not in named or named[nm["id"]] > f0:
                    named[nm["id"]] = f0

    def shown_as(who: str, f: int) -> str:
        cid = CAST_UP.get(who, who.lower())
        c = CAST.get(cid, {})
        at = named.get(cid)
        return (c.get("name") or who) if at is not None and at <= f else (c.get("role") or ("VOICE" if CAST else who))

    SUBS = []
    allrows = sorted(list(LINES.values()) + list(POSTS.values()), key=lambda l: l["abs_in"])
    for l in allrows:
        SUBS.append(OrderedDict(s=l["abs_in"], e=l["abs_out"], hold_to=l["abs_out"] + (12 if l["kind"] != "post" else 0), who=l["who"],
                                shown=shown_as(l["who"], l["abs_in"]), text=l["text"], kind=l["kind"], mode=l["mode"], id=l["id"], os=l["os"]))
    for a, b in zip(SUBS, SUBS[1:]):
        a["hold_to"] = min(a["hold_to"], max(a["e"], b["s"]))

    # ================================================================================== 9. checks
    check("shot frames = their beats' frames", all(sh["e"] - sh["s"] == sum(e0 - s0 for (_b, s0, e0) in sh["_beats"]) for sh in shots),
          f"{len(shots)} shots from {len(beats)} beats")
    check("shots tile the segment with no gap", all(a["e"] == b["s"] for a, b in zip(shots, shots[1:])) and shots[0]["s"] == 0 and shots[-1]["e"] == ACT, f"0 -> {ACT}")
    # every line starts on the frame of its first sound, re-derived from realStart (when the timeline carries it)
    if all(isinstance(x, (int, float)) for x in rs):
        bad = []
        for b in beats:
            for l in b.get("lines") or []:
                if l.get("id") not in LINES:
                    continue
                b0 = round(b["realStart"] * FPS - EP_IN)
                want = fr(b0 / FPS + max(-4.0, float(l.get("t", 0) or 0)))
                if want != LINES[l["id"]]["abs_in"]:
                    bad.append((l["id"], LINES[l["id"]]["abs_in"], want))
        check("every line starts on the stick's frame", not bad, f"{len(LINES)} lines, re-derived from realStart + t; differ: {bad[:6]}")
    reel_first = {lid: math.ceil(L["on_s"] * FPS - EPS) for lid, L in LINES.items()}
    d = [reel_first[lid] - L["abs_in"] for lid, L in LINES.items()]
    check("the lock vs the stick reel's own line frames", all(x in (0, 1) for x in d),
          f"same frame: {d.count(0)}; 1 f earlier (the onset falls inside the frame): {d.count(1)}; other: {len([x for x in d if x not in (0, 1)])}")
    if TAKES:
        placed = [lid for lid in LINES if lid in TAKES]
        unused = [lid for lid in TAKES if lid not in LINES]
        check("every line has a take", not no_take, f"{len(placed)} of {len(LINES)} placed; no take: {no_take[:8]}")
        if unused:
            decisions.append(f"{len(unused)} takes are not in the timeline: {unused[:8]}{'...' if len(unused) > 8 else ''}")
        fit = [lid for lid, L in LINES.items() if lid in TAKES and not (L["file_in"] <= L["abs_in"] and L["abs_out"] <= L["file_out"] + 1)]
        check("every line's speech lies inside its take file", not fit, f"outside: {fit}")
        nomouth = [lid for lid, L in LINES.items() if lid in TAKES and not L["mouth"] and TAKES[lid].get("mouth")]
        check("mouth tracks carried over", not nomouth, f"{sum(1 for L in LINES.values() if L['mouth'])} lines with a mouth track; lost: {nomouth}")
    faced = [f"{sh['id']}:{r['id']}" for sh in shots for r in sh["lines"] if r["face"] and r["kind"] != "post" and not r["mouth"]]
    check("every on-camera mouth has a track", not faced, f"{sum(1 for sh in shots for r in sh['lines'] if r['face'])} faced rows; without a track: {faced}")
    mix_frames = None
    if MIX_PATH:
        mix_frames = wav_frames(rel(MIX_PATH))
        if mix_frames is None:
            problems.append(f"mix {MIX_PATH} not found (git-ignored audio?): the length check was skipped")
        else:
            check("the mix = its offset + the segment", abs(mix_frames - (MIX_OFF + ACT)) < 0.5, f"mix {mix_frames:.2f} f vs {MIX_OFF} + {ACT}")
    out_of = [f"{sh['id']}.{k}={v - sh['s']}" for sh in shots for k, v in sh["marks_abs"].items() if not (sh["s"] <= v <= sh["e"])]
    if out_of:
        decisions.append(f"marks outside their shot (base marks the layout may not read, or anchors on carried lines): {out_of}")
    # the V.O. and the rails never share the screen (pov-and-framing §5.2): a warning for the shot pass, never a fail
    vo_rail = [f"{L['id']}~{r['text'][:20]!r}" for L in LINES.values() if L["kind"] == "vo" for r in RAILS if L["abs_in"] < r["e"] and r["s"] < L["abs_out"] + 15]
    if vo_rail:
        decisions.append(f"V.O. on screen with a rail item (§5.2 wants one must-read at a time; stagger by a beat): {vo_rail}")

    # ================================================================================== 10. stats
    lens = [(sh["e"] - sh["s"]) / FPS for sh in shots]
    voiced = sorted(LINES.values(), key=lambda l: l["abs_in"])
    crossing = [f"{l['id']} ({l['shot']} -> {', '.join(s['id'] for s in shots if l['abs_in'] < s['s'] < l['abs_out'])})" for l in voiced if l["abs_out"] > SH[l["shot"]]["e"]]
    prelaps = [f"{l['id']} ({l['stick_t']:+.2f} s into {l['shot']})" for l in voiced if l["pre"]]
    verd = sorted({PLAN.get(s["id"], {}).get("verdict", "") for s in shots})
    stats = OrderedDict(
        shots=len(shots), beats=len(beats), frames=ACT, seconds=round(ACT / FPS, 3), length=length(ACT), episode_in=tc(0), episode_out=tc(ACT),
        verdicts={v or "-": sum(1 for s in shots if PLAN.get(s["id"], {}).get("verdict", "") == v) for v in verd},
        mean_s=round(statistics.mean(lens), 3), median_s=round(statistics.median(lens), 3), min_s=round(min(lens), 3), max_s=round(max(lens), 3),
        lines=len(LINES), posts=len(POSTS), vo=sum(1 for l in LINES.values() if l["kind"] == "vo"), lines_with_mouth=sum(1 for l in LINES.values() if l["mouth"]),
        mouths_from_words=sum(1 for l in LINES.values() if l["mouth_src"] == "words"),
        on_camera_mouths=sorted({f"{s['id']}:{r['who']}:{r['face']}" for s in shots for r in s["lines"] if r["face"]}),
        lines_crossing_a_cut=crossing, prelaps=prelaps, reviewer_slates=[s["id"] for s in shots if s.get("slate")],
        mix=dict(path=MIX_PATH, offset_frames=MIX_OFF, frames=mix_frames) if MIX_PATH else None, refs=REFS,
    )

    # ================================================================================== 11. write
    for sh in shots:
        pl = PLAN.get(sh["id"], {})
        b0 = sh["_beats"][0][0]
        frame = b0.get("frame", "")
        cls = next((c for rx, c in CLS if re.search(rx, frame)), "M")
        sounds, spots = [], []
        for (b, s0, _e) in sh["_beats"]:
            sounds += [f"{x['name']} @{s0 + fr(x['at']) - sh['s']}" for x in (b.get("sounds") or [])]
            spots += [OrderedDict(name=x["name"], k=s0 + fr(x["at"]) - sh["s"], dur=x.get("dur")) for x in (b.get("sounds") or [])]
        base = BASESH.get(pl.get("v4") or pl.get("base") or "")
        caption = " / ".join(b.get("caption", "") for (b, _s, _e) in sh["_beats"])
        cues = [c for (b, _s, _e) in sh["_beats"] for c in (b.get("cues") or [])]
        slate = pl.get("slate", bool(b0.get("kind") == "card" and (REVIEWER_SLATE.search(b0.get("caption", "") or "") or any(REVIEWER_SLATE.search(c) for c in cues))))
        cast, seen = [], set()
        for (b, s0, _e) in sh["_beats"]:
            for c in b.get("chars") or []:
                c = {"id": c} if isinstance(c, str) else c
                if c.get("id") in seen:
                    continue
                seen.add(c.get("id"))
                cast.append(OrderedDict(id=c.get("id"), pose=c.get("pose", "stand"), face=c.get("face", "calm"), x=c.get("x"),
                                        **{"from": (s0 - sh["s"] + fr(c["from"])) if c.get("from") is not None else None},
                                        until=(s0 - sh["s"] + fr(c["until"])) if c.get("until") is not None else None))
        sh.update(OrderedDict(
            verdict=pl.get("verdict", ""), v4=pl.get("v4"), side=SIDE.get(b0.get("side"), "MAS"), side_label=b0.get("side") or "",
            badge=pl.get("badge"), whip=pl.get("whip"), frame=frame, cls=cls, move="hold" if "held" in frame or cls in ("M", "OTS") else "cut",
            does=caption, chars=sorted({(c["id"] if isinstance(c, dict) else c) for (b, _s, _e) in sh["_beats"] for c in b.get("chars", [])}),
            cues=cues, sounds=sounds, spots=spots, v4_frames=base["frames"] if base else None,
            kind=b0.get("kind", "scene"), set=b0.get("set", ""), room=b0.get("room", ""), style=b0.get("style", "BASE"),
            fx=sorted({x for (b, _s, _e) in sh["_beats"] for x in (b.get("fx") or [])}), slate=bool(slate), caption=caption, cast=cast,
            speak=[OrderedDict(who=x["id"].upper(), s=s0 + fr(x["at"]) - sh["s"], e=s0 + fr(x["at"] + x.get("dur", 1)) - sh["s"])
                   for (b, s0, _e) in sh["_beats"] for x in (b.get("speak") or [])],
            beat_starts={b["id"]: s0 - sh["s"] for (b, s0, _e) in sh["_beats"]},
            names=[OrderedDict(id=n["id"], k=s0 + fr(n.get("at", 0)) - sh["s"]) for (b, s0, _e) in sh["_beats"] for n in (b.get("names") or [])],
            fg=b0.get("fg"),
        ))
    stats["reviewer_slates"] = [s["id"] for s in shots if s.get("slate")]
    lock = OrderedDict(
        meta=OrderedDict(
            show="MR. MAS", episode="ep01", seg=SEG, label=A.label or PL.get("label") or beats[0].get("act") or SEG.upper(),
            timeline=TL_NAME, takes=takes_paths, plan=os.path.relpath(rel(PLAN_FILE), REPO) if PLAN_FILE else None,
            plan_py=PL.get("plan_py"), base_lock=PL.get("base_lock"), generator="studio/src/episodes/ep01/pixel/tools/lock.py", fps=FPS,
            ep_in=tc(0), ep_in_frames=EP_IN,
            rules=["the picture is cut to the stick timeline: its beats are the shots, its lines are the lines, nothing re-timed",
                   "a continuation beat that follows its own shot directly merges into it",
                   "a line starts on the frame in which its first sound falls (beat start + t; t may be negative, a pre-lap), ends after the frame of its last sound",
                   "mouths and words on the same rule; a line appears in every shot it sounds in (carry = runs in from an earlier shot, pre = starts under this one before its own)",
                   "marks come from the stick's own sound spots and text, the takes' words, or a base lock's marks scaled to the new length",
                   "the framing decides who shows a mouth (face), not the take's lip_sync flag"],
            note="Nothing here was watched or heard. The numbers are measured from the files; whether the picture reads needs a person."),
        summary=stats, checks=checks, sequences=SEQS,
        shots=[OrderedDict((k, v) for k, v in sh.items() if not k.startswith("_") and k not in ("marks_abs", "mark_src", "texts"))
               | OrderedDict(marks={k: v - sh["s"] for k, v in sh["marks_abs"].items()}, mark_src=sh["mark_src"],
                             texts=[OrderedDict(kind=x["kind"], text=x["text"], s=x["abs_in"] - sh["s"], e=x["abs_out"] - sh["s"], must=x["must"]) for x in sh["texts"]])
               for sh in shots],
        lines=list(LINES.values()), posts=list(POSTS.values()), rails=RAILS, sound_marks=SOUND_MARKS, subs=SUBS, refs=REFS,
        v4_ids=V4_IDS, base_marks_scaled=scaled_log, decisions=decisions, problems=problems,
    )
    for s in lock["shots"]:
        s["tc_in"], s["tc_out"], s["frames"] = tc(s["s"]), tc(s["e"]), s["e"] - s["s"]
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    json.dump(lock, open(OUT_JSON, "w"), indent=1, ensure_ascii=False)

    # ------------------------------------------------------------------------------------------------ data.ts
    LKEYS = ("id", "kind", "mode", "who", "text", "s", "e", "fs", "fe", "os", "via", "face", "lip", "carry", "cut", "mouth", "words", "tag", "pre")
    ts_shots = []
    for sh in shots:
        ts_shots.append(OrderedDict(
            id=sh["id"], setup=sh["setup"], beats=sh["beats"], seq=sh["seq"], side=sh["side"], badge=sh["badge"], whip=sh["whip"], tag=sh["frame"],
            cls=sh["cls"], framing=sh["frame"], move=sh["move"], s=sh["s"], e=sh["e"], plan=sh["e"] - sh["s"], v4=sh["v4"], verdict=sh["verdict"],
            does=sh["does"], sound=" · ".join(sh["sounds"]), chars=sh["chars"],
            lines=[OrderedDict((k, r[k]) for k in LKEYS) for r in sh["lines"]],
            texts=[OrderedDict(kind=x["kind"], text=x["text"], s=x["abs_in"] - sh["s"], e=x["abs_out"] - sh["s"], must=x["must"]) for x in sh["texts"]],
            marks={k: v - sh["s"] for k, v in sh["marks_abs"].items()},
            # the general fields (the Act Four v5 records stop at `marks`)
            kind=sh["kind"], set=sh["set"], room=sh["room"], style=sh["style"], fx=sh["fx"], slate=sh["slate"], sideLabel=sh["side_label"],
            cues=sh["cues"], spots=sh["spots"], onscreen=sh["onscreen"], speak=sh["speak"], beatStarts=sh["beat_starts"], names=sh["names"],
            fg=sh["fg"], cast=sh["cast"],
        ))
    J = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))  # noqa: E731
    data = OrderedDict(
        seg=SEG, label=lock["meta"]["label"], fps=FPS, frames=ACT, epIn=EP_IN,
        mix=OrderedDict(path=MIX_PATH, offsetFrames=MIX_OFF, frames=(MIX_OFF + ACT)) if MIX_PATH else None,
        source=OrderedDict(timeline=lock["meta"]["timeline"], takes=takes_paths, plan=lock["meta"]["plan"]),
        cast={cid: OrderedDict((k, c[k]) for k in ("name", "role") if c.get(k)) for cid, c in CAST.items()},
        refs=REFS, soundMarks=SOUND_MARKS,
        seqs=[OrderedDict(id=q["id"], chapter=q["chapter"], title=q["title"], place=q["place"], time=q["time"], s=q["s"], e=q["e"], cue=q["cue"], side=q["side"]) for q in SEQS],
        rails=[OrderedDict(text=r["text"], s=r["s"], e=r["e"], shot=r["shot"]) for r in RAILS],
        subs=SUBS, v4Ids=V4_IDS, shots=ts_shots,
    )
    ts = [
        f"// GENERATED by studio/src/episodes/ep01/pixel/tools/lock.py from {lock['meta']['timeline']}",
        f"// (takes: {', '.join(takes_paths) or 'none'}; plan: {lock['meta']['plan'] or 'none'}). Do not hand-edit: re-run lock.py.",
        "// Frames are segment frames (0 = the timeline's first beat; epIn = its episode frame). Shot-relative: lines[].s/e (first",
        "// sound / after the last; s < 0 = it started earlier, carry = from an earlier shot, pre = a pre-lap under this shot),",
        "// fs/fe (the take file), texts[].s/e, marks, spots[].k, onscreen[].s/e. mouth = [[frame from s, viseme]], words = [[w, f0, f1]].",
        "// face = who shows a mouth in this framing ('lip' | 'room' | null). The layouts read this through ../types.ts.",
        "/* eslint-disable */",
        "import type {SegLock} from '../types';",
        "export const LOCK: SegLock = " + J(data) + ";",
        "export default LOCK;",
        "",
    ]
    os.makedirs(os.path.dirname(OUT_TS), exist_ok=True)
    open(OUT_TS, "w").write("\n".join(ts))

    # ------------------------------------------------------------------------------------------------ report
    if not A.quiet:
        print(f"lock {SEG}: {len(shots)} shots from {len(beats)} beats, {ACT} f = {length(ACT)}, {tc(0)} -> {tc(ACT)}")
        print(f"  lines {stats['lines']} (+{stats['posts']} posts, {stats['vo']} V.O.), with mouth tracks {stats['lines_with_mouth']} ({stats['mouths_from_words']} from words); on-camera mouths {len(stats['on_camera_mouths'])}")
        print(f"  lines across a cut: {len(crossing)}; pre-laps: {len(prelaps)}; reviewer slates: {stats['reviewer_slates']}; refs: {REFS}")
        for c in checks:
            print(f"  [{'ok' if c['ok'] else 'FAIL'}] {c['check']}: {c['detail']}")
        print(f"decisions ({len(decisions)}):")
        for d_ in decisions:
            print("  ", d_)
        if scaled_log:
            print(f"base marks scaled onto new lengths ({len(scaled_log)}): " + "; ".join(scaled_log))
        print("problems:", problems or "none")
        print(f"wrote {os.path.relpath(OUT_JSON, REPO)} and {os.path.relpath(OUT_TS, REPO)}")
    failed = any(not c["ok"] for c in checks)
    return 1 if failed or (A.strict and problems) else 0


if __name__ == "__main__":
    sys.exit(main())
