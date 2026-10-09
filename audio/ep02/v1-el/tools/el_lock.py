#!/usr/bin/env python3
"""el_lock.py - Ep2 v1: the ElevenLabs-timed lock (the master, LEARNINGS R9), from the Kokoro base lock and the EL takes.
A copy of Ep1's (audio/ep01/v3-el/tools/el_lock.py, locked), pointed at Ep2, with two traps fixed:
  * --fixed no longer swallows the segments after it (voices-el.md §AE: `--fixed S7.13 act2` rebuilt all six). It takes
    ONE beat id per flag (comma-separated ids are split): `el_lock.py act2 --fixed 22.04 --fixed 22.05` or
    `--fixed 22.04,22.05`; a value that is a segment name is refused.
  * a rebuild can't silently drop a line (voices-el.md §AD: Act One's hand-placed V.O. went on a re-run). Before it
    overwrites an EL timeline it compares the line ids: if the existing file has a line the new one doesn't, it stops
    and names them (put the line in the beat plan, so the base lock carries it), unless --force.

  audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_lock.py [seg ...] [--set A] [--fixed BEAT] [--force]
      reads  show/reel/ep02-v1/ep02-v1-<seg>.json                 (the Kokoro base lock: never written)
             audio/ep02/v1-el/ep02-v1/<seg>/lines-<set>.json      (el_render.py's takes; --takes-dir another folder)
             audio/ep02/cast-el.json                              (which roles stay on Kokoro: MARIO)
      writes show/reel/ep02-v1-el/ep02-v1-el-<seg>.json           (a copy with the EL takes swapped in)
             show/reel/ep02-v1-el/ep02-v1-el.manifest.json        (key ep02-v1-el-stick; with no segment named)
             audio/ep02/v1-el/ep02-v1/el-lock-report.json         (every beat's change)
  When the base lock was itself built from the EL takes (the beat plan fitted to them), every delta is 0 and this is
  the identity plus the EL fields; it is still the step that writes the master.

(Ep1's notes follow.)
The rule (the lead's brief): every gap the lock chose is kept, between lines, before the first line and after the last,
and every J-cut lead. A beat gets longer or shorter only by what its takes gained or lost; holds, arrivals and
aftermaths are unchanged. Per beat, in the lock's line order:
  * the first line keeps its start (a J-cut's negative t is its lead, kept);
  * each later line starts where the one before it now ends plus the silence the lock left between them;
  * the beat ends where its last line now ends plus the lock's tail (an L-cut keeps its overrun into the next shot);
  * everything timed inside the beat (onscreen text, name reveals, sounds and their lengths, a figure's entrance or
    exit, a mouth's speak window) moves through the same clock: unchanged before the first line, anchored to the
    matching word inside a line (a name revealed on a word lands on that word in the new take), shifted with the gap
    between lines, and by the beat's own change after its last line. In a J-cut beat the cut itself (0.0) stays put.
Beats without lines are unchanged, frame for frame. The picture, captions and cues are the lock's.
A take the lock printed through the call chain (Kokoro mode "call") plays its EL device copy (file_device); every
other take plays dry, as in the lock.
A role cast on Kokoro in the EL film (cast-el.json roles.<role>.engine 'kokoro' from engine_from_lock on; v3.5: MARIO, the
showrunner's call) keeps the Kokoro lock's own take: its audio, in, dur and words are the lock's, its length is unchanged,
and only its start moves (with the EL lines before it in the beat, the lock's gap kept). el_render.py writes such a line's
row as 'engine': 'kokoro' (no API call); a Kokoro-cast line with no row at all is treated the same way.
"""
from __future__ import annotations

import argparse
import copy
import difflib
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../../.."))
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
EP = "ep02"
SRC = "show/reel/ep02-v1"
DST = "show/reel/ep02-v1-el"
TAG = ""
TAKES = "audio/ep02/v1-el/ep02-v1"
LOCK = "v1"            # --lock v2: a later Ep2 round (show/reel/ep02-v2/ -> show/reel/ep02-v2-el/)
FIXED = set()          # --fixed: beats whose length is reserved (the v3.1 Runway frames): they keep their length and
                       #          every line keeps its start (anchored to the picture); the takes are swapped in place
FLAGS = []
KOKORO_USED = []       # the lines that kept their Kokoro take (for the report and the manifest's notes)
CAST = "audio/ep02/cast-el.json"
FORCE = False
KOKORO_ROLES = set()   # roles that keep their Kokoro takes on this lock (cast-el.json engine; set in main)


def kokoro_roles(lock):
    """the roles cast on Kokoro (the same rule as el_render.Cast.engine; Ep2's cast has no engine_from_lock)"""
    d = jload(CAST)
    out = set()
    for k, r in d["roles"].items():
        base = d["roles"].get(r.get("derived_from")) or r
        if (r.get("engine") or base.get("engine")) == "kokoro":
            out.add(k)
    return out


def P():
    """the file-name prefixes of the source lock and of the EL copy"""
    return f"{EP}-{LOCK}-", f"{EP}-{LOCK}-el{TAG}"
FPS = 24


def jload(p):
    with open(os.path.join(REPO, p)) as f:
        return json.load(f)


def jdump(o, p):
    p = os.path.join(REPO, p)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + ".tmp", "w") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)
        f.write("\n")
    os.replace(p + ".tmp", p)


def norm(w):
    return re.sub(r"[^a-z0-9']", "", str(w).lower())


def word_knots(old_t, kw, new_t, ew):
    """matching words of the Kokoro take and the EL take -> [(old time, new time)] at each matched word's start"""
    a = [norm(w[0]) for w in kw]
    b = [norm(w[0]) for w in ew]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    out = []
    for blk in sm.get_matching_blocks():
        for q in range(blk.size):
            out.append((old_t + kw[blk.a + q][1], new_t + ew[blk.b + q][1]))
    return out


class Clock:
    """a beat's old -> new time map: piecewise linear through the knots, constant offset outside them"""

    def __init__(self, knots):
        ks = sorted(knots)
        clean = []
        for o, n in ks:
            if clean and (o <= clean[-1][0] + 1e-6 or n < clean[-1][1] - 1e-6):
                continue                                     # keep it monotone (a word knot that disagrees is dropped)
            clean.append((o, n))
        self.k = clean

    def __call__(self, x):
        if x is None or not self.k:
            return x
        k = self.k
        if x <= k[0][0]:
            return round(x + (k[0][1] - k[0][0]), 3)
        if x >= k[-1][0]:
            return round(x + (k[-1][1] - k[-1][0]), 3)
        for (o0, n0), (o1, n1) in zip(k, k[1:]):
            if o0 <= x <= o1:
                return round(n0 + (x - o0) * (n1 - n0) / (o1 - o0), 3)
        return x


def build_seg(seg, cand):
    T = jload(f"{SRC}/{P()[0]}{seg}.json")
    tp = os.path.join(REPO, f"{TAKES}/{seg}/lines-{cand}.json")
    if not os.path.exists(tp):
        raise SystemExit(f"{seg}: no EL takes at {os.path.relpath(tp, REPO)} (el_render.py render --out {TAKES}/{seg} first)")
    L = {r["id"]: r for r in jload(f"{TAKES}/{seg}/lines-{cand}.json")}
    out = copy.deepcopy(T)
    report, missing = [], []
    t_old = t_new = 0.0
    for b in out["beats"]:
        old_len = b.get("reelDur", 0)
        t_old += old_len
        ls = [l for l in b.get("lines", []) or [] if l.get("text")]      # 'cut' = cut off by the world: played
        kok_ids = {l["id"] for l in ls if (L.get(l["id"]) or {}).get("engine") == "kokoro"
                   or (l["id"] not in L and l.get("who") in KOKORO_ROLES)}      # cast on Kokoro: the lock's own take
        for l in ls:
            if l["id"] not in L and l["id"] not in kok_ids:
                missing.append(l["id"])
        ls = [l for l in ls if l["id"] in L or l["id"] in kok_ids]
        ls.sort(key=lambda l: l["t"])
        if not ls:
            t_new += old_len
            continue
        fixed = b["id"] in FIXED
        knots = []
        prev_old_end = prev_new_end = None
        old_last_end = max(l["t"] + l["dur"] for l in ls)
        changes = []
        for l in ls:
            old_t, old_dur = l["t"], l["dur"]
            new_t = old_t if (prev_old_end is None or fixed) else prev_new_end + (old_t - prev_old_end)
            if l["id"] in kok_ids:
                # the Kokoro lock's own take: the same audio, in, dur and words; only its start moves
                r = L.get(l["id"]) or {}
                kw = l.get("words") or []
                knots.append((old_t, new_t))
                knots += word_knots(old_t, kw, new_t, kw)
                knots.append((old_t + old_dur, new_t + old_dur))
                prev_old_end, prev_new_end = old_t + old_dur, new_t + old_dur
                kok = {"audio": l.get("audio"), "in": l.get("in"), "t": old_t, "dur": old_dur}
                l.update(t=round(new_t, 3))
                l["voice"] = r.get("voice") or "Kokoro (the Kokoro lock's take)"
                l["engine"] = "kokoro"
                l["el"] = None
                l["kokoro"] = kok
                changes.append([l["id"], 0.0])
                KOKORO_USED.append(l["id"])
                continue
            r = L[l["id"]]
            a_in, a_out = r["pace"]["audible_in_s"], r["pace"]["audible_out_s"]
            new_dur = round(a_out - a_in, 3)
            ew = [[w["w"], round(w["t0"] - a_in, 3), round(w["t1"] - a_in, 3)] for w in r["words"]]
            if l.get("cut"):
                # read whole (say_full); dur is the cut-off: the cut word's end in the EL take plus the lock's own
                # trail after that word (the whole file still plays under what interrupts it, as in the lock)
                last = norm(re.sub(r"[—–-]+$", "", l["text"].split()[-1]))
                kw = [w for w in (l.get("words") or []) if norm(w[0]).startswith(last)]
                ewm = [w for w in ew if norm(w[0]).startswith(last)]
                if kw and ewm:
                    new_dur = round(ewm[-1][2] + (old_dur - kw[-1][2]), 3)
            knots.append((old_t, new_t))
            knots += word_knots(old_t, l.get("words") or [], new_t, ew)
            knots.append((old_t + old_dur, new_t + new_dur))
            prev_old_end, prev_new_end = old_t + old_dur, new_t + new_dur
            kref = r.get("kokoro_ref") or {}
            use_dev = bool(r.get("file_device")) and (kref.get("mode") == "call" or
                                                      kref.get("device") in ("call", "monitor", "pa", "tv"))
            kok = {"audio": l.get("audio"), "in": l.get("in"), "t": old_t, "dur": old_dur}
            l.update(t=round(new_t, 3), dur=new_dur, audio=(r["file_device"] if use_dev else r["file"]), **{"in": a_in},
                     words=ew)
            l["voice"] = r["voice"]
            l["el"] = {"take": os.path.basename(r["file"]), "device_copy": use_dev, "dry": r["file"],
                       "reused_from": (r.get("el") or {}).get("reused_from")}
            l["kokoro"] = kok
            changes.append([l["id"], round(new_dur - old_dur, 3)])
        if ls[0]["kokoro"]["t"] < 0:
            knots.append((0.0, 0.0))                          # a J-cut line runs over the cut: the cut itself stays put
        if fixed:                                             # a reserved length: nothing moves; check the takes fit
            knots = []
            ends = [(l["t"] + l["dur"], l) for l in ls]
            for (e_, l), nxt in zip(ends, ls[1:] + [None]):
                if nxt is not None and e_ > nxt["t"] + 1e-6:
                    FLAGS.append(f"{seg} {b['id']} (fixed): {l['id']} now ends {e_ - nxt['t']:.2f} s into {nxt['id']}")
                if nxt is None and e_ > old_len + 1e-6 and l["kokoro"]["t"] + l["kokoro"]["dur"] <= old_len + 1e-6:
                    FLAGS.append(f"{seg} {b['id']} (fixed): {l['id']} now runs {e_ - old_len:.2f} s past the beat's end")
        clk = Clock(knots)
        new_last_end = clk(old_last_end)
        end_delta = round(new_last_end - old_last_end, 3)
        for key in ("onscreen", "names", "sounds", "speak"):
            for o in b.get(key, []) or []:
                if not isinstance(o, dict) or o.get("at") is None:
                    continue
                a0 = o["at"]
                o["at"] = clk(a0)
                if o.get("until") is not None:
                    o["until"] = clk(o["until"])
                if o.get("dur") is not None and key in ("sounds", "speak"):
                    o["dur"] = round(clk(a0 + o["dur"]) - o["at"], 3)
        for c in b.get("chars", []) or []:
            if isinstance(c, dict):
                for f in ("from", "until"):
                    if c.get(f) is not None:
                        c[f] = clk(c[f])
        if abs(end_delta) > 1e-6:
            b["reelDur"] = round(max(0.5, old_len + end_delta), 6)
        t_new += b["reelDur"]
        report.append(dict(beat=b["id"], old_s=round(old_len, 3), new_s=round(b["reelDur"], 3), delta_s=round(b["reelDur"] - old_len, 3),
                           lines=changes))
    out["variant"] = (T.get("variant", "") + f" · ElevenLabs set {cand} takes (eleven_multilingual_v2, library voices), "
                      "EL-timed: the lock's gaps kept, beats changed only by the takes' lengths"
                      + (f" · Kokoro in the EL cast: {', '.join(sorted(KOKORO_ROLES))} (the lock's own takes)" if KOKORO_ROLES else ""))
    out["_source"] = dict(T.get("_source") or {}, kokoro_lock=f"{SRC}/{P()[0]}{seg}.json",
                          takes_files=[f"{TAKES}/{seg}/lines-{cand}.json"], el_builder="audio/ep02/v1-el/tools/el_lock.py",
                          el_notes="show/episodes/ep02/production/v1/pipeline.md", seconds=round(t_new, 3))
    out["runtimeMin"] = round(t_new / 60, 2)
    out["_el_retimed"] = dict(rule="gaps between lines, before the first and after the last kept; J-cut leads kept; "
                                   "beats change only by the takes' lengths; timed items follow the words",
                              seconds_kokoro=round(t_old, 3), seconds_el=round(t_new, 3), delta_s=round(t_new - t_old, 3),
                              beats_changed=sum(1 for r in report if abs(r["delta_s"]) > 1e-6), missing_takes=missing,
                              kokoro_cast=[i for r in report for i, _ in r["lines"] if i in set(KOKORO_USED)])
    # never drop a line silently (Ep1 voices-el.md §AD): the existing EL timeline's lines must all still be here
    dst = os.path.join(REPO, f"{DST}/{P()[1]}-{seg}.json")
    if os.path.exists(dst):
        old = {l["id"] for b in jload(dst)["beats"] for l in b.get("lines", []) or []}
        new = {l["id"] for b in out["beats"] for l in b.get("lines", []) or []}
        lost = sorted(old - new)
        if lost and not FORCE:
            raise SystemExit(f"{seg}: the existing {os.path.relpath(dst, REPO)} has line(s) the new one would drop: {lost[:12]}"
                             f"{'...' if len(lost) > 12 else ''}. A line placed by hand belongs in the beat plan (so the base lock "
                             f"carries it); --force rebuilds anyway.")
        if lost:
            FLAGS.append(f"{seg}: --force: dropped {lost}")
    jdump(out, f"{DST}/{P()[1]}-{seg}.json")
    return dict(segment=seg, seconds_kokoro=round(t_old, 3), seconds_el=round(t_new, 3), delta_s=round(t_new - t_old, 3),
                lines=sum(len(r["lines"]) for r in report), beats_changed=sum(1 for r in report if abs(r["delta_s"]) > 1e-6),
                missing_takes=missing, kokoro_cast=out["_el_retimed"]["kokoro_cast"], beats=report)


def build_manifest(beds):
    M = jload(f"{SRC}/{EP}-{LOCK}.manifest.json")
    m = copy.deepcopy(M)
    m["key"] = f"{P()[1]}-stick"
    m["variant"] = (f"full-episode stick reel Ep2 {LOCK} LOCK, ElevenLabs-timed (the master) · the base lock's picture and gaps · "
                    "every line in the ElevenLabs cast (library voices, eleven_multilingual_v2) · temp rooms, SFX and pads")
    m["_about"] = (f"The ElevenLabs-timed Ep2 {LOCK} lock (the master, LEARNINGS R9): the chapters of {SRC}/{EP}-{LOCK}.manifest.json "
                   f"with the six story chapters from {DST}/{P()[1]}-<seg>.json (audio/ep02/v1-el/tools/el_lock.py: the base "
                   "lock's timelines with every take swapped for its ElevenLabs take, the lock's gaps and J-cut leads kept, beats "
                   "longer or shorter only by the takes' lengths). Notes: show/episodes/ep02/production/v1/pipeline.md. Nothing "
                   "here was watched or heard.")
    if KOKORO_ROLES:
        m["variant"] += f" · {', '.join(sorted(r.upper() for r in KOKORO_ROLES))} on Kokoro (the lock's own takes)"
    for c in m["chapters"]:
        if str(c.get("from", "")).startswith(P()[0]) and c["id"] in SEGS:
            c["from"] = f"{P()[1]}-{c['id']}"
            c["sub"] = c.get("sub", "") + " · EL"
    for bd in m.get("beds", []):
        if bd.get("chapter") in beds:
            bd.update(beds[bd["chapter"]])
    tot = sum(jload(f"{DST}/{P()[1]}-{seg}.json")["_source"]["seconds"] for seg in SEGS)
    other = sum(float(c.get("dur") or 0) for c in m["chapters"] if c.get("kind") == "video") + 2.0   # + the card
    m["runtimeMin"] = round((tot + other) / 60, 2)
    if FIXED:
        m["_about"] += f" Reserved lengths: {', '.join(sorted(FIXED))} keep their length and line starts."
    jdump(m, f"{DST}/{P()[1]}.manifest.json")
    return m


def main(argv=None):
    ap = argparse.ArgumentParser(description="the Ep2 ElevenLabs-timed lock")
    ap.add_argument("segs", nargs="*", help="coldopen act1 act2 act3 act4 tag (default: all six, then the manifest)")
    ap.add_argument("--set", default="A")
    ap.add_argument("--beds", default=None, help="a JSON file {chapter: {src, label, ...}} for the manifest's beds")
    ap.add_argument("--tag", default="", help="a variant tag: files ep02-<lock>-el<T>-<seg>.json in show/reel/ep02-<lock>-el<T>/")
    ap.add_argument("--lock", default="v1", help="the Ep2 round: v1 (show/reel/ep02-v1/ -> show/reel/ep02-v1-el/), v2 ...")
    ap.add_argument("--takes-dir", default=None, help="the EL takes folder (<dir>/<seg>/lines-<set>.json; default audio/ep02/v1-el/ep02-<lock>)")
    ap.add_argument("--fixed", action="append", default=[], metavar="BEAT",
                    help="a beat whose length is reserved (a generated insert): one id per flag, or comma-separated; repeatable")
    ap.add_argument("--force", action="store_true", help="rebuild even if an existing EL timeline has lines the new one would drop")
    ap.add_argument("--src", default=None, help="(a test) the base lock's folder instead of show/reel/ep02-<lock>/")
    ap.add_argument("--dst", default=None, help="(a test) write here instead of show/reel/ep02-<lock>-el/")
    a = ap.parse_intermixed_args(argv)        # segments before, between or after the flags: `act1 --fixed 4A.02 act2` = act1 act2
    global DST, TAG, SRC, TAKES, LOCK, FIXED, KOKORO_ROLES, FORCE
    fixed = [x.strip() for v in a.fixed for x in v.split(",") if x.strip()]
    bad = [x for x in fixed if x in SEGS]
    if bad:
        ap.error(f"--fixed takes beat ids, not segments: {bad} (Ep1's trap: `--fixed S7.13 act2` read act2 as a beat)")
    unknown = [x for x in a.segs if x not in SEGS]
    if unknown:
        ap.error(f"unknown segment(s) {unknown}: {' '.join(SEGS)}")
    TAG, LOCK, FORCE = a.tag, a.lock, a.force
    KOKORO_ROLES = kokoro_roles(LOCK)
    SRC = os.path.relpath(os.path.abspath(a.src), REPO) if a.src else f"show/reel/{EP}-{LOCK}"
    DST = os.path.relpath(os.path.abspath(a.dst), REPO) if a.dst else f"show/reel/{EP}-{LOCK}-el{TAG}"
    TAKES = os.path.relpath(os.path.abspath(a.takes_dir), REPO) if a.takes_dir else f"audio/ep02/v1-el/{EP}-{LOCK}"
    FIXED = set(fixed)
    segs = a.segs or SEGS
    print(f"el_lock {EP} {LOCK}: {' '.join(segs)}; fixed: {sorted(FIXED) or 'none'}; takes {TAKES}/<seg>/lines-{a.set}.json")
    rep = {"set": a.set, "segments": []}
    for s in segs:
        r = build_seg(s, a.set)
        rep["segments"].append(r)
        print(f"{s:9s} kokoro {r['seconds_kokoro']:8.2f} s  el {r['seconds_el']:8.2f} s  {r['delta_s']:+7.2f} s  "
              f"lines {r['lines']}  beats changed {r['beats_changed']}  missing {r['missing_takes'] or '-'}"
              + (f"  kokoro-cast {len(r['kokoro_cast'])}" if r["kokoro_cast"] else ""))
    rep["fixed_beats"] = sorted(FIXED)
    rep["flags"] = FLAGS
    for f in FLAGS:
        print("FLAG", f)
    if not a.segs:
        tk = sum(r["seconds_kokoro"] for r in rep["segments"])
        te = sum(r["seconds_el"] for r in rep["segments"])
        rep["story"] = dict(seconds_kokoro=round(tk, 3), seconds_el=round(te, 3), delta_s=round(te - tk, 3))
        print(f"story     kokoro {tk:8.2f} s  el {te:8.2f} s  {te - tk:+7.2f} s")
        beds = jload(os.path.relpath(a.beds, REPO)) if a.beds else {}
        if os.path.exists(os.path.join(REPO, f"{SRC}/{EP}-{LOCK}.manifest.json")):
            m = build_manifest(beds)
            rep["manifest"] = dict(key=m["key"], runtimeMin=m["runtimeMin"])
    os.makedirs(os.path.join(REPO, TAKES), exist_ok=True)
    jdump(rep, f"{TAKES}/el-lock-report{TAG}" + ("" if not a.segs else "-" + "-".join(segs)) + ".json")


if __name__ == "__main__":
    main()
