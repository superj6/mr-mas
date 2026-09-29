"""reel_32.py - the draft 3.2 dialogue stem on the beat model's clock (tighten-changes §5), and what it measures.

Every voiced line is laid at its §5 cue: the shot's In time + (cue beat - 1) x 0.625 s puts its first audible sample
there. A line with a marked overlap or a fixed gap (lines.json overlap_place_at_s / gap_place_at_s) is placed from the
previous line instead, since that is what the lock will do. This is NOT the lock (THE EDITOR re-locks as timing-v3):
it is the recordist's check that the takes fit the board. It writes

  act4-dialogue-reel.mp3   dialogue only, 4:09.4 on the 3.2 clock (the set-pieces are silent here: no score or SFX)
  reel_cues.json           {id, start_s, audible_in_s, audible_out_s, end_s, cue_s, placed_by} per line + the measures

and prints: voiced seconds (the union of audible spans), coverage of the act, stretches > 6 s with no voice, the gap
between consecutive lines inside an exchange, and any collision a take causes with the next line's cue.
"""
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
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import soundfile as sf

import a4lib as L
import lines_a4_32 as S

ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
ACT_IN = 12 * 60 + 31.0
ACT_LEN = 249.375
BEAT = L.BEAT

# §5: the In time (episode clock) of every shot a line plays over
SHOT_IN = {
    "25.02": "12:37.25", "26.09": "13:04.75", "26A.01": "13:10.38", "27.01": "13:18.50", "27.05": "13:27.25",
    "27.05b": "13:29.12", "27.05c": "13:29.75", "27.07": "13:34.12", "27.08": "13:36.00", "27.13b": "13:51.62",
    "27.14": "13:54.12", "27.16": "13:58.50", "27.17": "14:00.38", "27.22a": "14:07.25", "27.22b": "14:08.50",
    "27.23": "14:11.62", "27.27": "14:21.00", "27.29": "14:24.75", "27.30": "14:27.25", "29.04": "14:41.62",
    "29.05": "14:44.12", "29.11a": "15:01.00", "29.11b": "15:02.25", "29.12": "15:03.50", "29.16": "15:07.25",
    "29.17": "15:11.62", "29.24": "15:22.25", "30.01": "15:34.12", "30.03": "15:40.38", "30.06": "15:46.62",
    "30.06b": "15:47.88", "30.11a": "15:55.38", "30.11b": "15:56.62", "30.12": "15:57.88", "30.13": "15:59.12",
    "30.14": "16:00.38", "30.23": "16:21.00", "31.02": "16:27.25", "31.03": "16:30.38",
}
# exchanges: consecutive lines inside one of these are one conversation (the <= 0.3 s placement rule applies)
EXCHANGES = [("a4-25-10", "a4-25-02"), ("a4-27-04", "a4-27-24"), ("a4-27-08", "a4-27-13"), ("a4-27-14", "a4-27-16"),
             ("a4-29-vo2", "a4-29-03"), ("a4-29-04", "a4-29-06"), ("a4-29-vo3", "a4-29-08"), ("a4-30-03", "a4-30-04"),
             ("a4-30-05", "a4-30-09"), ("a4-31-01", "a4-31-02")]


def clock(s):
    m, x = s.split(":")
    return int(m) * 60 + float(x) - ACT_IN


def main():
    rows = [e for e in json.load(open(os.path.join(ROOT, "lines.json"))) if e["voiced_in_cut"]]
    order = [i for i in S.ORDER_32 if any(r["id"] == i for r in rows)]
    R = {r["id"]: r for r in rows}
    place = {}
    for lid in order:
        e = R[lid]
        shot, beat = e["cue"].split(", beat ")
        cue = clock(SHOT_IN[shot]) + (float(beat) - 1) * BEAT
        a_in = e["pace"]["audible_in_s"]
        start, by = cue - a_in, "cue"
        if e.get("overlap_place_at_s") is not None and e.get("overlap_with") in place:
            start, by = place[e["overlap_with"]]["start_s"] + e["overlap_place_at_s"], f"overlap on {e['overlap_with']}"
        elif e.get("gap_place_at_s") is not None and e.get("gap_with") in place:
            start, by = place[e["gap_with"]]["start_s"] + e["gap_place_at_s"], f"gap after {e['gap_with']}"
        place[lid] = {"id": lid, "scene": e["scene"], "speaker": e["speaker"] + (" (V.O.)" if e["kind"] == "vo" else ""),
                      "cue_s": round(cue, 3), "placed_by": by, "start_s": round(start, 3),
                      "audible_in_s": round(start + a_in, 3), "audible_out_s": round(start + e["pace"]["audible_out_s"], 3),
                      "end_s": round(start + e["duration_s"], 3), "cue_shift_s": round(start + a_in - cue, 3)}
    # audio
    n = int((ACT_LEN + 1.0) * L.SR)
    mix = np.zeros(n, np.float32)
    for lid in order:
        y, sr = sf.read(os.path.join(REPO, R[lid]["file"]), dtype="float32")
        a = int(round(place[lid]["start_s"] * sr))
        if a < 0:
            y, a = y[-a:], 0
        mix[a:a + len(y)] += y[: max(0, n - a)]
    mix = mix[: int(ACT_LEN * L.SR)]
    pk = np.max(np.abs(mix))
    if pk > 0.89:  # overlaps can sum: keep the reel under -1 dBFS
        mix *= 0.89 / pk
    L.V.write_wav_mp3(mix, None, os.path.join(ROOT, "act4-dialogue-reel.mp3"))
    # measures
    iv = sorted((p["audible_in_s"], p["audible_out_s"]) for p in place.values())
    union = []
    for a, b in iv:
        if union and a <= union[-1][1]:
            union[-1][1] = max(union[-1][1], b)
        else:
            union.append([a, b])
    voiced = sum(b - a for a, b in union)
    edges = [0.0] + [x for ab in union for x in ab] + [ACT_LEN]
    silences = [(edges[i], edges[i + 1]) for i in range(0, len(edges), 2)]
    long_ = [(round(a, 2), round(b - a, 2)) for a, b in silences if b - a > 6.0]
    gaps, collisions = [], []
    ids = order
    for x, y_ in zip(ids, ids[1:]):
        g = place[y_]["audible_in_s"] - place[x]["audible_out_s"]
        inside = any(S.ORDER_32.index(a) <= S.ORDER_32.index(x) and S.ORDER_32.index(y_) <= S.ORDER_32.index(b) for a, b in EXCHANGES)
        if inside:
            gaps.append((x, y_, round(g, 3)))
        marked = R[y_].get("overlap_prev_s") is not None
        if g < -0.02 and not marked:
            collisions.append((x, y_, round(g, 3)))
    ex = [g for _, _, g in gaps]
    open_by_rule = {("a4-30-08", "a4-30-09"), ("a4-29-vo3", "a4-29-07")}  # the 1-beat-late echo; the V.O. clearance
    ex_rule = [g for a, b, g in gaps if (a, b) not in open_by_rule]
    out = {"note": "the 3.2 dialogue stem on the beat model's clock (tighten-changes §5); not the lock",
           "act_s": ACT_LEN, "voiced_s": round(voiced, 2), "coverage_pct": round(100 * voiced / ACT_LEN, 1),
           "sum_of_audible_spans_s": round(sum(p["audible_out_s"] - p["audible_in_s"] for p in place.values()), 2),
           "silences_over_6s": {"count": len(long_), "total_s": round(sum(d for _, d in long_), 2), "list": long_},
           "exchange_gaps": {"n": len(ex), "median_s": round(float(np.median(ex)), 3) if ex else None,
                             "median_excl_open_by_rule_s": round(float(np.median(ex_rule)), 3) if ex_rule else None,
                             "pairs": gaps},
           "collisions": collisions, "cues": [place[i] for i in order]}
    json.dump(out, open(os.path.join(ROOT, "reel_cues.json"), "w"), indent=1)
    print(f"voiced {voiced:.1f} s of {ACT_LEN} s ({100 * voiced / ACT_LEN:.1f}%); >6 s silences: {len(long_)} = "
          f"{sum(d for _, d in long_):.1f} s; exchange gap median {out['exchange_gaps']['median_s']} s "
          f"(excl. the two open-by-rule gaps {out['exchange_gaps']['median_excl_open_by_rule_s']} s); collisions {collisions}")
    for a, d in long_:
        print(f"   silence {d:5.2f} s from {a:6.2f} s")


if __name__ == "__main__":
    main()
