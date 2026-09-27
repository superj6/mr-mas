#!/usr/bin/env python3
"""retime.py - a COPY of a stick/reel timeline with the ElevenLabs takes swapped in, gaps kept (track A4).

The source timeline is never touched. For every beat, the lines keep their order and the silence between them:
each line starts where it started, plus whatever the lines before it in the beat grew or shrank. Timed items
(onscreen, names, sounds, fx with an 'at') at or after a moved line move with it, and the beat's length changes by
the same amount. A J-cut (a line with t < 0) keeps its lead-in. Nothing else changes (picture, captions, cues).

  PY=audio/.venv-casting/bin/python
  $PY audio/ep01/v3-el/tools/retime.py --timeline show/reel/trials/ep01-v3-sample.json \
      --lines audio/ep01/v3-el/sample/lines-A.json --out audio/ep01/v3-el/sample/ep01-v3-sample-el-A.json
"""
from __future__ import annotations

import argparse
import copy
import json


def remap_items(b, anchors):
    """anchors: [(old_t, offset)] sorted; an item at old time x takes the offset of the last anchor at or before x"""
    for key in ("onscreen", "names", "sounds", "fx"):
        for o in b.get(key, []) or []:
            if not isinstance(o, dict) or o.get("at") is None:
                continue
            off = 0.0
            for t0, d in anchors:
                if o["at"] >= t0 - 1e-6:
                    off = d
            o["at"] = round(o["at"] + off, 3)
            if o.get("until") is not None:
                o["until"] = round(o["until"] + off, 3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--timeline", required=True)
    ap.add_argument("--lines", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    T = json.load(open(a.timeline))
    L = {r["id"]: r for r in json.load(open(a.lines))}
    out = copy.deepcopy(T)
    report = []
    t_old = t_new = 0.0
    for b in out["beats"]:
        t_old += b.get("reelDur", 0)
        ls = [l for l in b.get("lines", []) if not l.get("cut") and l["id"] in L]
        ls.sort(key=lambda l: l["t"])
        anchors, prev_old_end, prev_new_end = [], None, None
        for l in ls:
            r = L[l["id"]]
            old_t, old_dur = l["t"], l["dur"]
            new_t = old_t if prev_old_end is None else prev_new_end + (old_t - prev_old_end)
            a_in, a_out = r["pace"]["audible_in_s"], r["pace"]["audible_out_s"]
            new_dur = a_out - a_in
            anchors.append((old_t, new_t - old_t))
            prev_old_end, prev_new_end = old_t + old_dur, new_t + new_dur
            l.update(t=round(new_t, 3), dur=round(new_dur, 3), audio=r["file"], **{"in": a_in},
                     words=[[w["w"], round(w["t0"] - a_in, 3), round(w["t1"] - a_in, 3)] for w in r["words"]],
                     voice=r["voice"], kokoro_audio=r["kokoro_ref"].get("file"))
            if r.get("file_device"):
                l["audio_device"] = r["file_device"]
        if ls:
            end_delta = prev_new_end - prev_old_end
            anchors.append((prev_old_end, end_delta))
            remap_items(b, anchors)
            if abs(end_delta) > 1e-6:
                b["reelDur"] = round(max(0.5, b["reelDur"] + end_delta), 3)
                report.append((b["id"], round(end_delta, 2)))
        t_new += b.get("reelDur", 0)
    out["title"] = T.get("title", "") + " · ElevenLabs takes (retimed copy)"
    out["_retimed"] = dict(source=a.timeline, lines=a.lines, beat_changes_s=report,
                           runtime_s_source=round(t_old, 2), runtime_s_retimed=round(t_new, 2),
                           rule="gaps between lines kept; timed items after a moved line move with it")
    out["runtimeMin"] = round(t_new / 60, 2)
    with open(a.out, "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{a.out}: runtime {t_old:.1f} s -> {t_new:.1f} s; beats changed: {len(report)}")
    for bid, d in report:
        print(f"  {bid:10s} {d:+.2f} s")


if __name__ == "__main__":
    main()
