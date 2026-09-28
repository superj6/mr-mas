#!/usr/bin/env python3
"""el_lock.py - the ElevenLabs-timed variant of the Ep1 v3 stick lock (track A4, pass v3-voices-el, phase 2).

  audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_lock.py [--set A] [--tag T] [--beds F] [seg ...]
      --set    the takes: audio/ep01/v3-el/ep01/<seg>/lines-<set>.json (a --label of el_render, e.g. AmasB)
      --tag    a variant: files ep01-v3-el<T>-<seg>.json in show/reel/ep01-v3-el<T>/, key ep01-v3-el<T>-stick
               (the studio copies show/reel/*/ flat, so a variant's timeline keys must differ from this one's)
      reads  show/reel/ep01-v3/ep01-v3-<seg>.json            (the Kokoro lock: never written)
             audio/ep01/v3-el/ep01/<seg>/lines-<set>.json    (el_render.py's takes of that segment)
      writes show/reel/ep01-v3-el/ep01-v3-el-<seg>.json      (a copy with the EL takes swapped in)
             show/reel/ep01-v3-el/ep01-v3-el.manifest.json   (key ep01-v3-el-stick; beds from --beds)
             audio/ep01/v3-el/ep01/el-lock-report.json       (every beat's change, per segment and in total)

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
SRC = "show/reel/ep01-v3"
DST = "show/reel/ep01-v3-el"
TAG = ""
TAKES = "audio/ep01/v3-el/ep01"
LOCK = "v3"            # --lock v31: the v3.1 lock (show/reel/ep01-v31/ -> show/reel/ep01-v31-el/)
FIXED = set()          # --fixed: beats whose length is reserved (the v3.1 Runway frames): they keep their length and
                       #          every line keeps its start (anchored to the picture); the takes are swapped in place
FLAGS = []


def P():
    """the file-name prefixes of the source lock and of the EL copy"""
    return f"ep01-{LOCK}-", f"ep01-{LOCK}-el{TAG}"
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
    L = {r["id"]: r for r in jload(f"{TAKES}/{seg}/lines-{cand}.json")}
    out = copy.deepcopy(T)
    report, missing = [], []
    t_old = t_new = 0.0
    for b in out["beats"]:
        old_len = b.get("reelDur", 0)
        t_old += old_len
        ls = [l for l in b.get("lines", []) or [] if l.get("text")]      # 'cut' = cut off by the world: played
        for l in ls:
            if l["id"] not in L:
                missing.append(l["id"])
        ls = [l for l in ls if l["id"] in L]
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
            r = L[l["id"]]
            old_t, old_dur = l["t"], l["dur"]
            new_t = old_t if (prev_old_end is None or fixed) else prev_new_end + (old_t - prev_old_end)
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
    out["variant"] = (T.get("variant", "") + " · ElevenLabs set A takes (eleven_multilingual_v2, library voices), "
                      "EL-timed: the lock's gaps kept, beats changed only by the takes' lengths")
    out["_source"] = dict(T.get("_source") or {}, kokoro_lock=f"{SRC}/{P()[0]}{seg}.json",
                          takes_files=[f"{TAKES}/{seg}/lines-{cand}.json"], el_builder="audio/ep01/v3-el/tools/el_lock.py",
                          el_notes="show/episodes/ep01/production/full-v3/voices-el.md", seconds=round(t_new, 3))
    out["runtimeMin"] = round(t_new / 60, 2)
    out["_el_retimed"] = dict(rule="gaps between lines, before the first and after the last kept; J-cut leads kept; "
                                   "beats change only by the takes' lengths; timed items follow the words",
                              seconds_kokoro=round(t_old, 3), seconds_el=round(t_new, 3), delta_s=round(t_new - t_old, 3),
                              beats_changed=sum(1 for r in report if abs(r["delta_s"]) > 1e-6), missing_takes=missing)
    jdump(out, f"{DST}/{P()[1]}-{seg}.json")
    return dict(segment=seg, seconds_kokoro=round(t_old, 3), seconds_el=round(t_new, 3), delta_s=round(t_new - t_old, 3),
                lines=sum(len(r["lines"]) for r in report), beats_changed=sum(1 for r in report if abs(r["delta_s"]) > 1e-6),
                missing_takes=missing, beats=report)


def build_manifest(beds):
    M = jload(f"{SRC}/ep01-{LOCK}.manifest.json")
    m = copy.deepcopy(M)
    m["key"] = f"{P()[1]}-stick"
    m["variant"] = ("full-episode stick reel v3 LOCK, ElevenLabs-timed · the lock's picture and gaps · every line in "
                    "ElevenLabs set A (library voices, eleven_multilingual_v2) · temp rooms, SFX and pads · for the voice A/B")
    m["_about"] = ("The ElevenLabs-timed variant of the Ep1 v3 stick lock (pass v3-voices-el, phase 2, 2026-09-27). The same "
                   "chapters as show/reel/ep01-v3/ep01-v3.manifest.json (key ep01-v3-stick), with the six story "
                   "chapters from show/reel/ep01-v3-el/ep01-v3-el-<seg>.json: the lock's timelines with every line's "
                   "take swapped for its ElevenLabs set-A take (audio/ep01/v3-el/ep01/<seg>/), the lock's gaps and "
                   "J-cut leads kept, and beats longer or shorter only by the takes' lengths (tools/el_lock.py). "
                   "Sound: the lock pass's bed builder (audio/reel/ep01-v3/bed.py) re-run on these timelines "
                   "(tools/el_bed.py -> audio/reel/ep01-v3-el/<seg>-bed.wav): rooms, the beats' sounds and pads, laid "
                   "to the new beat times. Notes: show/episodes/ep01/production/full-v3/voices-el.md. Nothing here "
                   "was watched or heard.")
    tot = 0.0
    for c in m["chapters"]:
        if str(c.get("from", "")).startswith(P()[0]) and c["id"] in SEGS:
            c["from"] = f"{P()[1]}-{c['id']}"
            c["sub"] = c.get("sub", "") + " · EL set A"
    for bd in m.get("beds", []):
        if bd.get("chapter") in beds:
            bd.update(beds[bd["chapter"]])
    for seg in SEGS:
        tot += jload(f"{DST}/{P()[1]}-{seg}.json")["_source"]["seconds"]
    other = 0.0
    for c in m["chapters"]:
        if c.get("kind") == "video":
            other += float(c.get("dur") or 0)
    other += 2.0                                              # the card
    m["runtimeMin"] = round((tot + other) / 60, 2)
    if LOCK != "v3":
        m["_about"] = (m["_about"].replace("show/reel/ep01-v3/ep01-v3.manifest.json (key ep01-v3-stick)",
                                           f"show/reel/ep01-{LOCK}/ep01-{LOCK}.manifest.json (key ep01-{LOCK}-stick)")
                       .replace("show/reel/ep01-v3-el/ep01-v3-el-<seg>.json", f"{DST}/{P()[1]}-<seg>.json")
                       .replace("audio/ep01/v3-el/ep01/<seg>/", f"{TAKES}/<seg>/")
                       .replace("audio/reel/ep01-v3/bed.py", f"audio/reel/ep01-{LOCK}/bed.py")
                       .replace("audio/reel/ep01-v3-el/<seg>-bed.wav", f"audio/reel/ep01-{LOCK}-el/<seg>-bed.wav"))
        if FIXED:
            m["_about"] += f" Reserved lengths (the Runway frames): {', '.join(sorted(FIXED))} keep their length and line starts."
        m["variant"] = m["variant"].replace("v3 LOCK", f"{LOCK} LOCK")
    jdump(m, f"{DST}/{P()[1]}.manifest.json")
    return m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("segs", nargs="*")
    ap.add_argument("--set", default="A")
    ap.add_argument("--beds", default=None, help="a JSON file {chapter: {src, label, ...}} for the manifest's beds")
    ap.add_argument("--tag", default="", help="a variant tag (see above)")
    ap.add_argument("--lock", default="v3", choices=["v3", "v31", "v32", "v33"], help="the Kokoro lock: v3 (show/reel/ep01-v3/), v31, v32 or v33")
    ap.add_argument("--fixed", nargs="*", default=None, help="beats with a reserved length (v31 default: S7.13 v31-32.01d)")
    a = ap.parse_args()
    global DST, TAG, SRC, TAKES, LOCK, FIXED
    TAG, LOCK = a.tag, a.lock
    SRC = f"show/reel/ep01-{LOCK}"
    DST = f"show/reel/ep01-{LOCK}-el{TAG}"
    TAKES = "audio/ep01/v3-el/ep01" if LOCK == "v3" else f"audio/ep01/v3-el/ep01-{LOCK}"
    FIXED = set(a.fixed if a.fixed is not None else (["S7.13", "v31-32.01d"] if LOCK in ("v31", "v32", "v33") else []))
    segs = a.segs or SEGS
    rep = {"set": a.set, "segments": []}
    for s in segs:
        r = build_seg(s, a.set)
        rep["segments"].append(r)
        print(f"{s:9s} kokoro {r['seconds_kokoro']:8.2f} s  el {r['seconds_el']:8.2f} s  {r['delta_s']:+7.2f} s  "
              f"lines {r['lines']}  beats changed {r['beats_changed']}  missing {r['missing_takes'] or '-'}")
    if not a.segs:
        tk = sum(r["seconds_kokoro"] for r in rep["segments"])
        te = sum(r["seconds_el"] for r in rep["segments"])
        rep["story"] = dict(seconds_kokoro=round(tk, 3), seconds_el=round(te, 3), delta_s=round(te - tk, 3))
        print(f"story     kokoro {tk:8.2f} s  el {te:8.2f} s  {te - tk:+7.2f} s")
        beds = jload(os.path.relpath(a.beds, REPO)) if a.beds else {}
        m = build_manifest(beds)
        rep["manifest"] = dict(key=m["key"], runtimeMin=m["runtimeMin"])
        rep["fixed_beats"] = sorted(FIXED)
        rep["flags"] = FLAGS
        for f in FLAGS:
            print("FLAG", f)
        jdump(rep, f"{TAKES}/el-lock-report{TAG}.json")


if __name__ == "__main__":
    main()
