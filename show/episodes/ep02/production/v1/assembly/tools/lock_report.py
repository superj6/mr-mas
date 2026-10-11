#!/usr/bin/env python3
"""lock_report.py - Ep2 v1: the lock's own checks against the beat plans' marks, and the episode transcript from the locks
(new for Ep2, the lock pass, 2026-10-09; plain python3, reads only, writes two files). Nothing here is heard or watched.

  python3 show/episodes/ep02/production/v1/assembly/tools/lock_report.py [--md]
      reads  show/episodes/ep02/production/v1/lock/<seg>.json      (the pixel locks of the EL-timed master: frames)
             show/reel/ep02-v1-el/ep02-v1-el.manifest.json          (the intro's and the outro's lengths)
             show/episodes/ep02/production/v1/beat-plan/<seg>.json  (the scenes, their targets, arrive / aftermath notes)
             beat-plan/_build.py's build()                          (each tempo gap with its pace class, as the plan set it)
      writes show/episodes/ep02/production/v1/transcript-v1.txt     (every line at its episode timecode, Ep1's format)
             show/episodes/ep02/production/v1/assembly/lock-v1-checks.json
             with --md, the generated blocks of show/episodes/ep02/production/v1/lock-v1.md
                                                                    (<!-- BEGIN generated:NAME --> ... <!-- END generated:NAME -->)
The checks [M], each against its LEARNINGS mark:
  FRAMES   every segment's frames and episode in/out; the pixel locks' ep-in agree with the chapter clock
  SCENES   every scene's frames against the plan's target and the proposal's table; its ARRIVAL (scene start to the first
           line's first sound; P3: 2-4 s on the room) and AFTERMATH (the last line's end to the scene's end; P3: 1.5-3 s,
           4-6 s for the biggest turns), with the plan's own arrive / aftermath note beside each
  TEMPO    every gap the plan marks (W18: quick others 0.15-0.35 s, quick Mas 0.4-0.5 s, normal 0.4-0.6 s, weighted
           longer), measured in the lock on the segment clock (line onsets and ends in seconds), inside a beat and across
           a cut; overlaps (W18: one or two a scene, motivated)
  PACE     (the lock QA, 2026-10-09) the script's TEMPO lines and the proposal's Pace table, as line pairs with their
           marks (PACE_LIST), measured in the lock independently of the plan's own classes: each in its band, or a
           GUIDE break with its one-line reason; and every across-cut reply under 2 s that the list doesn't name and
           the plan doesn't pin is a LOOK unless NOT_EXCHANGE says why it isn't an exchange. "free" gaps (action between
           the lines) are reported apart: they are never counted as in a mark
  MARKS    (the lock QA) the designed cut-offs (the cheer on "And profit—" and its cause before it; "Thanks." over
           "favorite"), word-anchored items (the THE PLAN stamps on their words), read floors before a voice (V.O. 6
           after his post), the 4B aftermath after the Accept click, and the engineer's laugh request ending on "laugh"
  HOLDS    P4: every beat with no line over 4 s, and in it the longest stretch with no sound, text or line event (the
           picture's own motion is the shot pass's: a stretch here is "look again", not a failure)
The episode clock (assemble.py's): cold open, intro (720 f), card (48 f), Acts One to Four, tag, the tag's hum under black
(18 f), the outro (its manifest length).
"""
import json
import math
import os
import re
import statistics as st
import sys

def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, ".mrmas-root")):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit("MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT")


ROOT = os.environ.get("MRMAS_ROOT") or _repo()
P = "show/episodes/ep02/production/v1"
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
FPS = 24
INTRO_F, CARD_F, HUM_F = 720, 48, 18
TITLES = {"coldopen": "Cold open", "intro": "Intro", "card": "ep1.1_her.wav", "tag-hum": "the hum under black", "act1": "Act One · the séance",
          "act2": "Act Two · stage right", "act3": "Act Three · leave them up", "act4": "Act Four · as a guest",
          "tag": "Tag · august", "outro": "Outro · credits"}
BANDS = {"quick": (0.15, 0.35), "quick-mas": (0.4, 0.5), "normal": (0.4, 0.6), "weighted": (0.6, 3.0), "free": (-1.0, 9.0)}
DEVICE_TAGS = {"call": "call", "ghost": "ghost", "offmic": "off mic", "podcast": "podcast", "phone": "phone", "sung": "sung", "tv": "tv", "far": "far", "chant": "chant"}
# on-screen text the transcript carries (rails always). The lock QA (2026-10-09) added the toasts (the Orb's W15
# sequence), the lower thirds (the candidate's own words on Aug 21), the stats, plates, signs and in-world UI, so every
# must-read and in-world word is in the readable record
SHOW_KINDS = ("card", "stat", "plate", "post", "doc", "caption", "lower-third", "toast", "sign", "ui")
# the scenes whose turn the plan calls one of the episode's biggest (P3: 4-6 s): the act-outs and the white room
BIG_TURNS = {"7": "act-out 1", "12": "the midpoint act-out", "17": "act-out 3", "22": "the door", "23": "the hook"}
# The script's TEMPO lines and the proposal's Pace table as line pairs (the lock QA, 2026-10-09): the exchanges the
# plan had left unpinned, where the fit stretched a quick or normal reply to 0.9-1.9 s. (from line | "sound:<beat>:<name>",
# to line, mark, where the script or proposal sets it, GUIDE break or None). Measured on the segment clock: the reply's
# first sound minus the end of the line (or the sound's onset) before it.
PACE_LIST = [
    ("e2-co-0005", "e2-co-0006", "quick", "script 1.07-1.08: quick (Gerg at 0.25 s); proposal Pace: 1 quick",
     "the second THUD lands 0.1 s after Selbeep's line and the coffee jumps; Gerg answers the THUD 0.4 s after it"),
    ("sound:4.07:landing_thunk", "e2-a1-0005", "quick-mas", "proposal Pace: 4 \"you're early.\" quick; Mas 0.4-0.5 s", None),
    ("e2-a1-0005", "e2-a1-0006", "quick", "proposal Pace: 4 Nole's volleys quick; script 4.08: Nole loud, fast, first", None),
    ("e2-a1-0056", "e2-a1-0024", "normal", "script 4.20-4.24: normal for Nole's fear (0.5 s)", None),
    ("e2-a1-0032", "e2-a1-0033", "quick", "script 4A: the line to Mas quick and dry", None),
    ("e2-a2-0002", "e2-a2-0003", "quick", "proposal Pace: 9 quick (the engineer, Gerg)", None),
    ("e2-a1-0042", "e2-a1-0043", "weighted", "script 6.06-6.07 and proposal Pace: weighted (Mas's long answer)", None),
    ("e2-a3-0016", "e2-a3-0017", "quick", "script 17.04-17.06: the driver quick (0.3 s)", None),
    ("e2-a3-0017", "e2-a3-0018", "normal", "script 17.04-17.06: the answer normal (0.5 s)", None),
    ("e2-a4-0004", "e2-a4-0005", "quick", "script 18.08-18.10: quick (Terb)", None),
    ("e2-a4-0005", "e2-a4-0006", "quick-mas", "script 18.08-18.10: Mas at 0.45-0.6 s",
     "the script's own HOLD 2 BEATS on \"our chief executive.\": every face at the table turns to Mas before \"present.\""),
    ("e2-a4-0006", "e2-a4-0007", "quick", "script 18.08-18.10: quick (Terb)", None),
    ("e2-a4-0007", "e2-a4-0008", "normal", "script 18.08-18.10: Mas at 0.45-0.6 s", None),
]
# across-cut replies under 2 s that are not an exchange the pace list marks, each with why (else a LOOK)
NOT_EXCHANGE = {
    ("e2-a1-0002", "e2-a1-0003"): "a new exchange: a staffer's eyes go to the empty chair first, and Gerg answers her look",
    ("e2-a1-0003", "e2-a1-0004"): "not a reply: Mas puts the séance's next question to the table",
    ("e2-a1-0018", "e2-a1-0019"): "not a reply to the ghost: Mas asks the board the question he wants answered (the concept's door)",
    ("e2-a1-0025", "e2-a1-0026"): "not a reply: ghost 3 drifts into his eyeline and replays its own words (a device)",
    ("e2-a2-0005", "e2-a2-0006"): "a new exchange: Mas turns to Rima (9.04's two-shot); Gerg was warning the engineer",
    ("e2-a2-0031", "e2-a2-0032"): "the demo's next step: Rima cues the house, the engineer turns the phone's camera on it, then speaks",
    ("e2-a2-0011", "e2-a2-0012"): "not a reply: Rima taps the monitor and VOICE 1 says hello under her fingertip (9.06; under 2 s since "
                                  "the fixes pass gave sc 9's air to V.O. 6)",
    ("e2-a3-0010", "e2-a3-0011"): "not a reply to the chant: Alyi's raised hand finds Mas in the crowd first; their exchange is quick inside 15.07",
}


def jl(p):
    return json.load(open(os.path.join(ROOT, p)))


def tcf(f):
    """episode frame -> MM:SS:FF (Ep1's transcript format)"""
    s, ff = divmod(int(f), FPS)
    return f"{s // 60:02d}:{s % 60:02d}:{ff:02d}"


def mmss(sec):
    return f"{int(sec // 60)}:{sec % 60:05.2f}"


def chapter_clock():
    locks = {s: jl(f"{P}/lock/{s}.json") for s in SEGS}
    man = jl("show/reel/ep02-v1-el/ep02-v1-el.manifest.json")
    outro_s = next(float(c.get("dur") or 10.125) for c in man["chapters"] if c["id"] == "outro")
    outro_f = int(round(outro_s * FPS))
    order = [("coldopen", locks["coldopen"]["summary"]["frames"]), ("intro", INTRO_F), ("card", CARD_F)]
    order += [(s, locks[s]["summary"]["frames"]) for s in ("act1", "act2", "act3", "act4", "tag")]
    order += [("tag-hum", HUM_F), ("outro", outro_f)]
    ch, f = [], 0
    for cid, n in order:
        ch.append(dict(id=cid, start=f, frames=n))
        f += n
    return locks, ch, f


def proposal_lengths():
    """each scene's length in the proposal's own heading ("### 11. "her" · … · about 1:51"), in seconds"""
    out = {}
    for ln in open(os.path.join(ROOT, P, "proposal.md")):
        m = re.match(r"^### (\w+)\. .*· about (?:(\d+):(\d\d)|(\d+) s)", ln)
        if m:
            out[m.group(1)] = int(m.group(2)) * 60 + int(m.group(3)) if m.group(2) else int(m.group(4))
    return out


def plan_tempo():
    """the plan's tempo rows from _build.build(): (beat, line, who, pace class, planned gap s)"""
    sys.path.insert(0, os.path.join(ROOT, P, "beat-plan"))
    import _build as B  # noqa: E402
    _out, _rep, tempo_rows, _vo = B.build()
    return [(b, lid, who, pc, g) for b, lid, who, pc, g, _ok in tempo_rows]


def main(argv):
    locks, ch, total_f = chapter_clock()
    start = {c["id"]: c["start"] for c in ch}
    plans = {s: jl(f"{P}/beat-plan/{s}.json") for s in SEGS}
    out = {"about": "lock_report.py (Ep2 v1): the lock's checks against the plans' marks. Nothing heard or watched.",
           "chapters": ch, "total_frames": total_f, "segments": {}, "scenes": [], "tempo": [], "overlaps": [], "holds": [],
           "fails": [], "looks": []}
    # ---------------------------------------------------------------- FRAMES
    story_f = 0
    for s in SEGS:
        L = locks[s]
        n = L["summary"]["frames"]
        story_f += n
        epin = L["meta"]["ep_in_frames"]
        if epin != start[s]:
            out["fails"].append(f"{s}: the pixel lock's ep-in {epin} f, the chapter clock's {start[s]} f")
        tl = jl(L["meta"]["timeline"])
        out["segments"][s] = dict(frames=n, seconds=round(n / FPS, 3), timeline_s=round(sum(b["reelDur"] for b in tl["beats"]), 3),
                                  ep_in=tcf(start[s]), ep_out=tcf(start[s] + n), shots=L["summary"]["shots"],
                                  lines=L["summary"]["lines"], vo=L["summary"]["vo"], scenes=len(L["scenes"]),
                                  plan_s=plans[s]["story_s"]["target"], checks_ok=all(c["ok"] for c in L["checks"]),
                                  checks=len(L["checks"]), problems=L["problems"])
        if not all(c["ok"] for c in L["checks"]):
            out["fails"] += [f"{s}: lock check failed: {c['check']}: {c['detail']}" for c in L["checks"] if not c["ok"]]
    out["story_frames"] = story_f
    # ---------------------------------------------------------------- SCENES
    heads = proposal_lengths()
    for s in SEGS:
        L, plan = locks[s], plans[s]
        sc_plan = {x["id"]: x for x in plan["scenes"]}
        beats = {b["id"]: b for b in plan["beats"]}
        lines = L["lines"]
        for sc in L["scenes"]:
            sid = sc["id"].split("~")[0]
            p = sc_plan[sid]
            ls = [l for l in lines if sc["s"] <= l["abs_in"] < sc["e"]]
            spoken = [l for l in ls if l["kind"] != "vo"]
            arr = (min(l["abs_in"] for l in ls) - sc["s"]) / FPS if ls else None
            arr_sp = (min(l["abs_in"] for l in spoken) - sc["s"]) / FPS if spoken else None
            aft = (sc["e"] - max(l["abs_out"] for l in ls)) / FPS if ls else None
            arrive = [(b, beats[b].get("arrive")) for b in sc["shots"] if beats[b].get("arrive")]
            after = [(b, beats[b].get("aftermath")) for b in sc["shots"] if beats[b].get("aftermath")]
            row = dict(seg=s, scene=sc["id"], title=p["title"], frames=sc["e"] - sc["s"], seconds=round((sc["e"] - sc["s"]) / FPS, 3),
                       tc_in=tcf(start[s] + sc["s"]), tc_out=tcf(start[s] + sc["e"]), plan_s=p["target_s"],
                       proposal_s=heads.get(sid, p.get("proposal_s", p["target_s"])), fit_scale=p.get("fit_scale"), shots=len(sc["shots"]),
                       lines=len(ls), arrival_s=None if arr is None else round(arr, 2),
                       arrival_spoken_s=None if arr_sp is None else round(arr_sp, 2),
                       aftermath_s=None if aft is None else round(aft, 2),
                       plan_arrive=[f"{b}: {a.get('s')} s, {a.get('what')}" for b, a in arrive],
                       plan_aftermath=[f"{b}: {a}" for b, a in after], big_turn=BIG_TURNS.get(sid))
            if abs(row["seconds"] - p["target_s"]) > 1.0 / FPS + 1e-6:
                out["fails"].append(f"sc {sc['id']}: {row['seconds']} s in the lock, the plan's {p['target_s']} s")
            if arr is not None and arr < 2.0 - 1e-6:
                out["looks"].append(f"sc {sc['id']}: arrival {arr:.2f} s before the first line (P3 2-4 s; the plan: "
                                    f"{'; '.join(row['plan_arrive']) or 'none'})")
            if aft is not None and aft < 1.5 - 1e-6:
                out["looks"].append(f"sc {sc['id']}: aftermath {aft:.2f} s after the last line (P3 1.5 s at least)")
            out["scenes"].append(row)
    # ---------------------------------------------------------------- TEMPO
    on = {}
    for s in SEGS:
        for l in locks[s]["lines"]:
            on[l["id"]] = (s, l["on_s"], l["end_s"], l["who"], l["kind"])
    by_seg = {s: sorted((v[1], v[2], k) for k, v in on.items() if v[0] == s) for s in SEGS}

    def gap_before(lid):
        s, t0, _e, _w, _k = on[lid]
        ends = [e for (a, e, k) in by_seg[s] if a < t0 - 1e-9 and k != lid]
        return round(t0 - max(ends), 3) if ends else None

    for bid, lid, who, pc, g in plan_tempo():
        m = gap_before(lid)
        lo, hi = BANDS[pc]
        # a "free" gap (action between the lines) has no mark: it is checked as planned, never counted as in a mark
        ok = None if pc == "free" else (m is not None and lo - 0.021 <= m <= hi + 0.021)
        same = m is not None and abs(m - g) <= 1.0 / FPS + 1e-3     # a beat starts on a whole frame: a gap across a cut moves by up to one
        out["tempo"].append(dict(beat=bid, line=lid, who=who, pace=pc, plan_s=g, lock_s=m, in_band=ok, as_planned=same))
        if ok is False:
            out["fails"].append(f"tempo {bid} {lid} ({who}): {m} s outside the {pc} mark {lo}-{hi} s")
        elif pc == "free" and not same:
            out["fails"].append(f"tempo {bid} {lid} ({who}): a free gap {m} s in the lock, {g} s in the plan")
        elif not same:
            out["looks"].append(f"tempo {bid} {lid}: {m} s in the lock, {g} s in the plan (inside the {pc} mark)")
    # ---------------------------------------------------------------- PACE: the script's and the proposal's own marks
    snd_on = {}                                                    # (beat, sound) -> its onset, segment seconds
    for s in SEGS:
        for sh in locks[s]["shots"]:
            for sp in sh["spots"]:
                snd_on.setdefault((sh["id"], sp["name"]), (s, (sh["s"] + sp["k"]) / FPS, sp.get("dur")))
    out["pace"] = []
    listed = set()
    for a, b, pc, src, brk in PACE_LIST:
        lo, hi = BANDS[pc]
        if a.startswith("sound:"):
            _, sb, sn = a.split(":")
            g = round(on[b][1] - snd_on[(sb, sn)][1], 3) if (sb, sn) in snd_on and b in on else None
        else:
            listed.add((a, b))
            g = round(on[b][1] - on[a][2], 3) if a in on and b in on else None
        ok = g is not None and lo - 0.021 <= g <= hi + 0.021
        out["pace"].append(dict(after=a, line=b, mark=pc, source=src, lock_s=g, in_band=ok, guide_break=brk))
        if g is None:
            out["fails"].append(f"pace {a} -> {b}: not measurable in the lock")
        elif not ok and not brk:
            out["fails"].append(f"pace {a} -> {b}: {g} s outside the {pc} mark {lo}-{hi} s ({src})")
    plan_rows = {(lid) for _b, lid, _w, _p, _g in plan_tempo()}
    out["pace_unlisted"] = []
    for s in SEGS:
        L = locks[s]
        sc_of = {sh["id"]: sh["scene"] for sh in L["shots"]}
        ls = sorted((l for l in L["lines"] if l["kind"] != "vo"), key=lambda l: l["on_s"])
        for x, y in zip(ls, ls[1:]):
            if x["beat"] == y["beat"] or sc_of[x["beat"]] != sc_of[y["beat"]] or x["who"] == y["who"]:
                continue
            g = round(y["on_s"] - x["end_s"], 3)
            if g >= 2.0 or (x["id"], y["id"]) in listed or y["id"] in plan_rows:
                continue
            why = NOT_EXCHANGE.get((x["id"], y["id"]))
            out["pace_unlisted"].append(dict(after=x["id"], line=y["id"], beats=f"{x['beat']} -> {y['beat']}", lock_s=g, not_an_exchange=why))
            if why is None:
                out["looks"].append(f"pace {x['beat']} -> {y['beat']} ({x['who']} -> {y['who']}): a reply across the cut at {g} s that "
                                    "neither the pace list nor the plan marks (PACE_LIST, or NOT_EXCHANGE with its reason)")
    # ---------------------------------------------------------------- MARKS: the lock QA's cut-offs, anchors and floors
    out["marks"] = []

    def mark(name, ok, detail):
        out["marks"].append(dict(check=name, ok=bool(ok), detail=detail))
        if not ok:
            out["fails"].append(f"mark {name}: {detail}")

    def text_on(seg, beat, prefix):
        for sh in locks[seg]["shots"]:
            if beat in sh["beats"]:
                for t in sh["texts"]:
                    if t["text"].startswith(prefix):
                        return (sh["s"] + t["s"]) / FPS, (sh["s"] + t["e"]) / FPS, t["text"]
        return None

    def word_on(lid, word):
        s, t0, _e, _w, _k = on[lid]
        L = next(l for l in locks[s]["lines"] if l["id"] == lid)
        w = next((x for x in L["words"] if x[0].lower().strip(".,!?") == word), None)
        return (L["abs_in"] + w[1]) / FPS if w else None, (L["abs_in"] + w[2]) / FPS if w else None

    # the cheer cuts "And profit—" (19.04): its onset inside her line, on "profit"; its cause on screen before it
    cheer = snd_on.get(("19.04", "crowd_cheer"))
    hs, he = on["e2-a4-0021"][1], on["e2-a4-0021"][2]
    pf = word_on("e2-a4-0021", "profit")[0]
    cause = text_on("act4", "19.04", "…AND LATER THIS YEAR")
    mark("the cheer cuts \"And profit—\"", cheer is not None and hs <= cheer[1] < he and pf is not None and cheer[1] <= pf + 0.05,
         f"crowd_cheer at {cheer[1]:.3f} s; her line {hs:.3f}-{he:.3f} s, \"profit\" from {pf:.3f} s" if cheer else "no crowd_cheer in 19.04")
    mark("its cause comes first", cause is not None and cheer is not None and cause[0] < cheer[1] - 0.1,
         f"the stream's announcement up at {cause[0]:.3f} s, the cheer at {cheer[1]:.3f} s" if cause and cheer else "missing")
    # "Thanks." comes in over "favorite" (11.04)
    t0, te = on["e2-a2-0028"][1], on["e2-a2-0027"][2]
    fav = word_on("e2-a2-0027", "favorite")
    mark("\"Thanks.\" over \"favorite\"", t0 < te and fav[0] is not None and fav[0] <= t0 <= fav[1] + 0.05,
         f"\"Thanks.\" at {t0:.3f} s; \"favorite\" {fav[0]:.3f}-{fav[1]:.3f} s; CHATGTP's line ends {te:.3f} s")
    # the cut-offs' subtitles read as the script draws them
    subs = {}
    for s in SEGS:
        for x in locks[s]["subs"]:
            subs.setdefault(x["id"], []).append(x["text"])
    mark("the subtitles of the two cut-offs", subs.get("e2-a2-0027", [])[-2:] == ["Great question! Of course! Honestly, short answers are one of my favorite—", "—things."]
         and subs.get("e2-a4-0021") == ["And profit—"], f"e2-a2-0027 {subs.get('e2-a2-0027')}; e2-a4-0021 {subs.get('e2-a4-0021')}")
    # THE PLAN's stamps on their own words (10.05): within 2 frames of the word's first sound
    for stamp, word in (("2.", "today"), ("3.", "free")):
        it = text_on("act2", "10.05", stamp)
        w0 = word_on("e2-a2-0021", word)[0]
        mark(f"stamp {stamp} on \"{word}\"", it is not None and w0 is not None and abs(it[0] - w0) <= 2.0 / FPS + 1e-6,
             f"the stamp at {it[0]:.3f} s, \"{word}\" from {w0:.3f} s" if it and w0 is not None else "missing")
    # the departure in silence (sc 12; the fixes pass, 2026-10-10: V.O. 6 was "i came back." over his farewell post, cut
    # under W8): no V.O. from Alyi's post to the act-out, and his own post held for its read floor (P15)
    post = text_on("act2", "12.07", "ALYI and NOPEAI")
    floor = 0.25 + 0.05 * len(post[2]) if post else None
    sc12 = next(q for q in locks["act2"]["scenes"] if q["id"] == "12")
    vo12 = [lid for lid, v in on.items() if v[0] == "act2" and v[4] == "vo" and v[1] >= sc12["s"] / FPS - 1e-6]
    mark("sc 12 plays without V.O. (W8)", not vo12, f"V.O. in sc 12: {vo12 or 'none'}")
    mark("his post held for its read floor", post is not None and post[1] - post[0] >= floor - 1.0 / FPS,
         f"the post up {post[0]:.3f}-{post[1]:.3f} s against a floor of {floor:.2f} s" if post else "no post")
    # Act Three's fixes pass (2026-10-10; fixes-v1.md, the episode review's blocker and its majors): no reason for
    # Alyi's leaving placed by juxtaposition (W8): the safety team's plate is out of the Alyi run, V.O. 7 counts no firing
    # clock, the gate's answer is said once in sc 13, and the ISS card carries no line about its product
    a3_texts = [(sh["id"], t["text"]) for sh in locks["act3"]["shots"] for t in sh["texts"]]
    a3_snds = {k[1] for k in snd_on if k[0].split(".")[0] in ("13", "14", "15", "17")}
    sc14 = next(q for q in locks["act3"]["scenes"] if q["id"] == "14")
    mark("sc 14: Ekiel's domino goes straight to Alyi's door, no team plate (W8)",
         not any("SUPERALIGNMENT" in t for sid, t in a3_texts if sid.startswith("14.")) and not any(n.startswith("screw_turn") for n in a3_snds)
         and [sh["id"] for sh in locks["act3"]["shots"] if sh["id"].startswith("14.")][-2:] == ["14.10", "14.12"],
         f"sc 14's last shots {[sh['id'] for sh in locks['act3']['shots'] if sh['id'].startswith('14.')][-3:]}; scene {sc14['s']}-{sc14['e']} f")
    vo7 = next((l for l in locks["act3"]["lines"] if l["id"] == "e2-vo-07"), None)
    mark("V.O. 7 counts on Alyi's own clock, not the firing's",
         vo7 is not None and "seventy-six" not in vo7["text"] and not any(t.startswith("NOV 20") for sid, t in a3_texts if sid == "15.02"),
         f"V.O. 7 \"{vo7['text'] if vo7 else None}\"; 15.02's texts {[t for sid, t in a3_texts if sid == '15.02']}")
    gate = [lid for lid in ("e2-a3-0025", "e2-a3-0026") if lid in on and on[lid][0] == "act3"]
    mark("sc 13: \"Did his post say why?\" / \"No.\"", len(gate) == 2 and on["e2-a3-0025"][1] < on["e2-a3-0026"][1],
         f"lines {gate}" + (f", at {on['e2-a3-0025'][1]:.3f} and {on['e2-a3-0026'][1]:.3f} s" if len(gate) == 2 else ""))
    r23 = next(((r["s"] / FPS, r["e"] / FPS, r["text"]) for r in locks["act3"]["rails"] if r["text"] == "2023"), None)
    p23 = text_on("act3", "15.10", "INTRODUCING")
    mark("the 2023 rail held 2 s, clear of the post", r23 is not None and p23 is not None and r23[1] - r23[0] >= 2.0 - 1e-6 and p23[0] >= r23[1] - 1e-6,
         f"the rail {r23[0]:.3f}-{r23[1]:.3f} s, the post from {p23[0]:.3f} s" if r23 and p23 else "missing")
    mark("the ISS card carries no line about its product", text_on("act4", "20.10", "one goal") is None and text_on("act4", "20.10", "ISS") is not None,
         "20.10's texts: " + str([t["text"] for sh in locks["act4"]["shots"] if sh["id"] == "20.10" for t in sh["texts"]]))
    hk, upd = snd_on.get(("17.15", "car_honk_5")), on.get("e2-a3-0021")
    mark("the last honk clears \"Updating.\"", hk is not None and upd is not None and upd[1] - hk[1] >= 0.3,
         f"car_honk_5 at {hk[1]:.3f} s, \"Updating.\" from {upd[1]:.3f} s" if hk and upd else "missing")
    # 4B: a beat after his thought, and P3's 1.5 s after the Accept click
    acc = snd_on.get(("4B.01", "post_click"))
    sc4b = next(q for q in locks["act1"]["scenes"] if q["id"] == "4B")
    mark("4B: the click a beat after his thought, 1.5 s after it", acc is not None and acc[1] - on["e2-vo-03"][2] >= 0.3
         and sc4b["e"] / FPS - acc[1] >= 1.5 - 1e-6,
         f"V.O. 3 ends {on['e2-vo-03'][2]:.3f} s, the click {acc[1]:.3f} s, the scene ends {sc4b['e'] / FPS:.3f} s" if acc else "no click")
    # the engineer's laugh (9.03): the request runs from the beat's first frames to Gerg's "laugh"
    la = snd_on.get(("9.03", "engineer_laugh_take"))
    lw = word_on("e2-a2-0005", "laugh")
    mark("the engineer's laugh stops on \"laugh\"", la is not None and la[2] is not None and lw[1] is not None
         and abs(la[1] + la[2] - lw[1]) <= 2.0 / FPS + 1e-6,
         f"engineer_laugh_take {la[1]:.3f} s + {la[2]} s; Gerg's \"laugh\" ends {lw[1]:.3f} s" if la and lw[1] is not None else "missing")
    for s in SEGS:
        xs = by_seg[s]
        run_e, run_id = None, None
        for a, e, k in xs:
            if run_e is not None and a < run_e - 1e-6:
                out["overlaps"].append(dict(seg=s, line=k, over=run_id, by_s=round(run_e - a, 3)))
            if run_e is None or e > run_e:
                run_e, run_id = e, k
    # ---------------------------------------------------------------- HOLDS
    for s in SEGS:
        tl = jl(locks[s]["meta"]["timeline"])
        for b in tl["beats"]:
            d = b["reelDur"]
            if b.get("lines") or d <= 4.0:
                continue
            ev = [0.0, d]
            for x in b.get("sounds") or []:
                ev.append(float(x["at"]))
            for o in b.get("onscreen") or []:
                if isinstance(o, dict):
                    ev += [float(o.get("at") or 0.0)] + ([float(o["until"])] if o.get("until") is not None else [])
            ev = sorted(min(max(0.0, x), d) for x in ev)
            still = max(b_ - a_ for a_, b_ in zip(ev, ev[1:]))
            out["holds"].append(dict(seg=s, beat=b["id"], seconds=round(d, 2), events=len(ev) - 2, longest_still_s=round(still, 2),
                                     frame=(b.get("frame") or "")[:90]))
            if still > 8.0:
                out["looks"].append(f"hold {b['id']}: {still:.2f} s with no sound, text or line event (P4: about 8 s)")
    # ---------------------------------------------------------------- the transcript
    rows = []
    for c in ch:
        cid, f0 = c["id"], c["start"]
        if cid == "intro":
            rows.append((f0, TITLES[cid], "", "[the main title, 30 s, the Ep2 variant: its own mix]"))
            rows.append((f0 + 24, TITLES[cid], "mas (v.o.)", "her  [the intro's cold-open line, about f24-33; then the typing indicator]"))
        elif cid == "card":
            rows.append((f0, TITLES[cid], "", "ep1.1_her.wav  [typed on black, 2 s]"))
        elif cid == "tag-hum":
            rows.append((f0, TITLES["tag"], "", f"[the tag's hum under black, {c['frames'] / FPS:.2f} s]"))
        elif cid == "outro":
            rows.append((f0, TITLES[cid], "", "[the Orb's scan; mr. mas · ep1.1_her.wav / viewer: verified: human / art · script · music · voices · edit: opus 5.5 / prompt: jgon]"))
        else:
            L = locks[cid]
            for r in L["rails"]:
                rows.append((f0 + r["s"], TITLES[cid], "", f"[on screen · rail] {r['text']}"))
            seen = {}
            for sh in L["shots"]:
                for t in sh["texts"]:
                    if t["kind"] not in SHOW_KINDS:
                        continue
                    a = sh["s"] + t["s"]
                    if seen.get(t["text"]) is not None and seen[t["text"]] >= sh["s"] - 1:
                        seen[t["text"]] = sh["s"] + t["e"]
                        continue                                  # still on screen from the shot before
                    seen[t["text"]] = sh["s"] + t["e"]
                    rows.append((f0 + a, TITLES[cid], "", f"[on screen · {t['kind']}] {t['text']}"))
            for l in L["lines"]:
                tag = (l.get("tag") or "").lower()
                if l["kind"] == "vo":
                    who, txt = "mas (v.o.)", l["text"].lower()
                else:
                    who = l["who"].lower() + (" (o.s.)" if l.get("os") else "") + (f" ({DEVICE_TAGS[tag]})" if tag in DEVICE_TAGS else "")
                    txt = l["text"]
                rows.append((f0 + l["abs_in"], TITLES[cid], who, txt))
    order = {c["id"]: i for i, c in enumerate(ch)}
    rows.sort(key=lambda r: (r[0], 0 if r[2] else 1))
    nlines = len([r for r in rows if r[2]])
    txt = [f"MR. MAS · ep1.1_her.wav · the full episode (the v1 lock, EL-timed)",
           f"Locks: {P}/lock/<seg>.json (from show/reel/ep02-v1-el/) · {mmss(total_f / FPS)} · {nlines} lines. Episode timecode "
           f"MM:SS:FF (24 fps) at each line's first sound, from the locks; [on screen] rows are every in-world text at its "
           f"first frame: rails, cards, stats, plates, posts, documents, captions, lower thirds, the Orb's toasts, signs and UI.",
           "No film is assembled yet: the intro (30 s), the card (2 s), the tag's hum under black (0.75 s) and the outro are "
           "at their planned lengths (assemble.py's order).",
           f"Generated by {P}/assembly/tools/lock_report.py. Nothing here was heard.", ""]
    cur = None
    for f, title, who, t in rows:
        if title != cur:
            txt.append(f"\n== {title} ==")
            cur = title
        txt.append(f"{tcf(f)}  {who + ': ' if who else ''}{t}")
    open(os.path.join(ROOT, P, "transcript-v1.txt"), "w").write("\n".join(txt) + "\n")
    out["transcript"] = dict(file=f"{P}/transcript-v1.txt", lines=nlines, rows=len(rows))
    del order
    json.dump(out, open(os.path.join(ROOT, P, "assembly/lock-v1-checks.json"), "w"), indent=1, ensure_ascii=False)
    # ---------------------------------------------------------------- print
    print(f"story {story_f} f = {mmss(story_f / FPS)}; episode {total_f} f = {mmss(total_f / FPS)}; transcript {nlines} lines")
    for s, v in out["segments"].items():
        print(f"  {s:<9} {v['frames']:>6} f  {mmss(v['seconds']):>8}  {v['ep_in']} -> {v['ep_out']}  lock checks "
              f"{'ok' if v['checks_ok'] else 'FAIL'} ({v['checks']}); problems {len(v['problems'])}")
    bad_t = [x for x in out["tempo"] if x["in_band"] is False]
    print(f"tempo: {len(out['tempo'])} gaps ({len([x for x in out['tempo'] if x['pace'] == 'free'])} free, no mark), "
          f"{len(bad_t)} outside their marks; overlaps {len(out['overlaps'])}")
    print(f"pace list: {len(out['pace'])} marked exchanges, {sum(1 for x in out['pace'] if x['in_band'])} in their marks, "
          f"{sum(1 for x in out['pace'] if not x['in_band'] and x['guide_break'])} GUIDE breaks; unlisted replies under 2 s: "
          f"{len(out['pace_unlisted'])} ({sum(1 for x in out['pace_unlisted'] if x['not_an_exchange'] is None)} without a reason)")
    print(f"marks: {sum(1 for x in out['marks'] if x['ok'])} of {len(out['marks'])} ok")
    print(f"holds over 4 s with no line: {len(out['holds'])}; FAIL {len(out['fails'])}; LOOK {len(out['looks'])}")
    for x in out["fails"]:
        print("FAIL", x)
    for x in out["looks"]:
        print("LOOK", x)
    if "--md" in argv:
        write_md(out)
    return 1 if out["fails"] else 0


def write_md(out):
    """the generated tables of lock-v1.md"""
    path = os.path.join(ROOT, P, "lock-v1.md")
    md = open(path).read()
    blocks = {}
    seg_rows = ["| Segment | Frames | Runtime | Episode in → out | Shots | Lines (V.O.) | Scenes | Plan | Pixel-lock checks |",
                "|---|---|---|---|---|---|---|---|---|"]
    for s, v in out["segments"].items():
        seg_rows.append(f"| {TITLES[s]} | **{v['frames']:,}** | {mmss(v['seconds'])} | {v['ep_in']} → {v['ep_out']} | {v['shots']} | "
                        f"{v['lines']} ({v['vo']}) | {v['scenes']} | {mmss(v['plan_s'])} | {v['checks']} ok |")
    sf = out["story_frames"]
    seg_rows.append(f"| **Story** | **{sf:,}** | **{mmss(sf / FPS)}** | | {sum(v['shots'] for v in out['segments'].values())} | "
                    f"{sum(v['lines'] for v in out['segments'].values())} ({sum(v['vo'] for v in out['segments'].values())}) | "
                    f"{sum(v['scenes'] for v in out['segments'].values())} | | |")
    ch = {c["id"]: c for c in out["chapters"]}
    seg_rows.append("")
    seg_rows.append(f"The episode clock (MM:SS:FF): " + " · ".join(f"{TITLES.get(c['id'], c['id'])} {tcf(c['start'])}" for c in out["chapters"])
                    + f" · end {tcf(out['total_frames'])} (**{out['total_frames']:,} frames, {mmss(out['total_frames'] / FPS)}**; "
                    f"the intro {ch['intro']['frames']} f, the card {ch['card']['frames']} f, the hum {ch['tag-hum']['frames']} f, "
                    f"the outro {ch['outro']['frames']} f at its planned length).")
    blocks["frames"] = "\n".join(seg_rows)
    sc_rows = ["| Scene | Frames | Seconds | In → out | Plan · the proposal's heading | Air fit | Arrival (spoken) | Aftermath | The plan's arrival · aftermath |",
               "|---|---|---|---|---|---|---|---|---|"]
    for r in out["scenes"]:
        pr = f"{mmss(r['plan_s'])}" + (f" · {mmss(r['proposal_s'])}" if r["proposal_s"] != r["plan_s"] else " · same")
        arr = "—" if r["arrival_s"] is None else f"{r['arrival_s']:.2f}" + (
            f" ({r['arrival_spoken_s']:.2f})" if r["arrival_spoken_s"] is not None and r["arrival_spoken_s"] != r["arrival_s"] else "")
        aft = "—" if r["aftermath_s"] is None else f"{r['aftermath_s']:.2f}" + (f" ({r['big_turn']})" if r["big_turn"] else "")
        notes = "; ".join(r["plan_arrive"] + r["plan_aftermath"]).replace("|", "/")
        sc_rows.append(f"| {r['scene']} {r['title']} | {r['frames']:,} | {r['seconds']:.2f} | {r['tc_in']} → {r['tc_out']} | {pr} | "
                       f"×{r['fit_scale']} | {arr} | {aft} | {notes} |")
    blocks["scenes"] = "\n".join(sc_rows)
    by = {}
    for t in out["tempo"]:
        by.setdefault(t["pace"], []).append(t)
    tr = ["| Mark | Gaps | Lock (median · range, s) | In the mark | As planned (±1 frame) |", "|---|---|---|---|---|"]
    for pc in ("quick", "quick-mas", "normal", "weighted", "free"):
        xs = by.get(pc, [])
        if not xs:
            continue
        v = [x["lock_s"] for x in xs if x["lock_s"] is not None]
        lo, hi = BANDS[pc]
        band = "no mark: action between the lines" if pc == "free" else f"{lo}–{hi} s"
        inm = "— (not a mark)" if pc == "free" else f"{sum(bool(x['in_band']) for x in xs)} of {len(xs)}"
        tr.append(f"| {pc} ({band}) | {len(xs)} | {st.median(v):.2f} · {min(v):.2f}–{max(v):.2f} | "
                  f"{inm} | {sum(x['as_planned'] for x in xs)} of {len(xs)} |")
    marked = [x for x in out["tempo"] if x["pace"] != "free"]
    tr.append("")
    tr.append(f"**{sum(bool(x['in_band']) for x in marked)} of {len(marked)} marked gaps are in their marks**; the "
              f"{len(out['tempo']) - len(marked)} free gaps are checked only against the plan (to a frame).")
    tr.append("")
    tr.append("**The script's and the proposal's own pace list** (`PACE_LIST`, measured in the lock, independent of the plan's classes):")
    tr.append("")
    tr.append("| After | Reply | Mark | Lock (s) | Result | Where the mark is set |")
    tr.append("|---|---|---|---|---|---|")
    for x in out["pace"]:
        res = "in the mark" if x["in_band"] else (f"GUIDE break: {x['guide_break']}" if x["guide_break"] else "**FAIL**")
        tr.append(f"| {x['after'].replace('sound:', 'sound ')} | {x['line']} | {x['mark']} | {x['lock_s']:.2f} | {res} | {x['source']} |")
    unl = out["pace_unlisted"]
    tr.append("")
    tr.append(f"Other replies across a cut inside a scene under 2 s that neither the list nor the plan marks: {len(unl)}"
              + (", each not an exchange: " + "; ".join(f"{x['beats']} {x['lock_s']:.2f} s ({x['not_an_exchange']})" for x in unl) if unl else "")
              + ".")
    tr.append("")
    tr.append("Overlaps (a line starting before the one before it ends): " + (
        "; ".join(f"{o['line']} over {o['over']} by {o['by_s']:.2f} s ({o['seg']})" for o in out["overlaps"]) or "none") + ".")
    blocks["tempo"] = "\n".join(tr)
    mr = ["| Check | Result | Measured |", "|---|---|---|"]
    for x in out["marks"]:
        mr.append(f"| {x['check']} | {'ok' if x['ok'] else '**FAIL**'} | {x['detail'].replace('|', '/')} |")
    blocks["marks"] = "\n".join(mr)
    hr = ["| Beat | Seconds | Events in it | Longest still stretch (s) | Frame |", "|---|---|---|---|---|"]
    for h in sorted(out["holds"], key=lambda x: -x["longest_still_s"])[:20]:
        hr.append(f"| {h['beat']} | {h['seconds']:.2f} | {h['events']} | {h['longest_still_s']:.2f} | {h['frame'].replace('|', '/')} |")
    hr.append("")
    hr.append(f"{len(out['holds'])} wordless beats run over 4 s; the 20 with the longest stretch with no sound, text or line "
              f"event are listed (all of them: assembly/lock-v1-checks.json, `holds`).")
    blocks["holds"] = "\n".join(hr)
    for k, v in blocks.items():
        pat = re.compile(rf"(<!-- BEGIN generated:{k} -->\n).*?(<!-- END generated:{k} -->)", re.S)
        if not pat.search(md):
            raise SystemExit(f"lock-v1.md has no generated:{k} block")
        md = pat.sub(lambda m: m.group(1) + v + "\n" + m.group(2), md)
    open(path, "w").write(md)
    print(f"wrote the generated blocks of {P}/lock-v1.md: {', '.join(blocks)}")


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
