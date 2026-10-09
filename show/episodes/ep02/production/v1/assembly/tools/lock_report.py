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
          "act2": "Act Two · her", "act3": "Act Three · leave them up", "act4": "Act Four · as a guest",
          "tag": "Tag · august", "outro": "Outro · credits"}
BANDS = {"quick": (0.15, 0.35), "quick-mas": (0.4, 0.5), "normal": (0.4, 0.6), "weighted": (0.6, 3.0), "free": (-1.0, 9.0)}
DEVICE_TAGS = {"call": "call", "ghost": "ghost", "offmic": "off mic", "podcast": "podcast", "phone": "phone", "sung": "sung", "tv": "tv", "far": "far", "chant": "chant"}
SHOW_KINDS = ("card", "post", "doc", "caption")   # on-screen text the transcript carries (rails always)
# the scenes whose turn the plan calls one of the episode's biggest (P3: 4-6 s): the act-outs and the white room
BIG_TURNS = {"7": "act-out 1", "12": "the midpoint act-out", "17": "act-out 3", "22": "the door", "23": "the hook"}


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
        ok = m is not None and lo - 0.021 <= m <= hi + 0.021
        same = m is not None and abs(m - g) <= 1.0 / FPS + 1e-3     # a beat starts on a whole frame: a gap across a cut moves by up to one
        out["tempo"].append(dict(beat=bid, line=lid, who=who, pace=pc, plan_s=g, lock_s=m, in_band=ok, as_planned=same))
        if not ok:
            out["fails"].append(f"tempo {bid} {lid} ({who}): {m} s outside the {pc} mark {lo}-{hi} s")
        elif not same:
            out["looks"].append(f"tempo {bid} {lid}: {m} s in the lock, {g} s in the plan (inside the {pc} mark)")
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
            rows.append((f0, TITLES[cid], "", "[the Orb's scan; mr. mas · ep1.1_her.wav / art · script · music · voices · edit: opus 5.5 / prompt: jgon]"))
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
           f"MM:SS:FF (24 fps) at each line's first sound, from the locks; [on screen] rows are rails, posts, documents, "
           f"cards and captions at their first frame.",
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
    bad_t = [x for x in out["tempo"] if not x["in_band"]]
    print(f"tempo: {len(out['tempo'])} gaps, {len(bad_t)} outside their marks; overlaps {len(out['overlaps'])}")
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
        tr.append(f"| {pc} ({lo}–{hi} s) | {len(xs)} | {st.median(v):.2f} · {min(v):.2f}–{max(v):.2f} | "
                  f"{sum(x['in_band'] for x in xs)} of {len(xs)} | {sum(x['as_planned'] for x in xs)} of {len(xs)} |")
    tr.append("")
    tr.append("Overlaps (a line starting before the one before it ends): " + (
        "; ".join(f"{o['line']} over {o['over']} by {o['by_s']:.2f} s ({o['seg']})" for o in out["overlaps"]) or "none") + ".")
    blocks["tempo"] = "\n".join(tr)
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
