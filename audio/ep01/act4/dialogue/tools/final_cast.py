"""final_cast.py - QA gate + cast map for the delivered Act Four lines.

1. Validates lines.json against the delivery spec: file exists, 48 kHz / 24-bit mono, the row's target loudness
   (qa.target_lufs: -16 dialogue, -18 MAS V.O., -22 the laptop-speaker line; +-0.1), true peak <= -1.5 dBTP,
   0 clipped samples, MP3 level-matched (+-0.1 LU), mouth track well-formed (starts at f0, holds >= 2 frames except
   the final cue, ends on rest/smile, shapes in the set) wherever a mouth is drawn, and empty wherever none is
   (V.O., O.S., his voice through their speaker, off-face). Draft 3.1 fields (kind, side, pov, shot, lip_sync) are
   checked for presence and values; the fallback and clean copies are checked like lines.
2. Measures each speaker's lane on the lines actually delivered (median F0 over voiced lines, range,
   pace, timbre) and the distinctness of every pair that shares a scene.
Writes qa/final_cast.json and prints a summary.
"""
import json
import os
import sys
from collections import defaultdict
from itertools import combinations

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import soundfile as sf

import a4lib as L
import a4pace as P
from audition import timbre

STATUS_32 = {"new", "changed", "retake-pace", "rederive", "restaged", "moved", "unchanged"}
VO_SLOT = {"a4-26a-vo1": 2.50, "a4-29-vo2": 1.875, "a4-29-vo3": 2.50}

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
SHAPES = {"A", "E", "O", "M", "rest", "smile"}
KINDS, SIDES, POVS = {"dialogue", "vo", "post"}, {"left", "right", "none"}, {"his", "board"}
CUE_CAMS = ("on", "reflection", "monitor", "blueprint", "crowd")


def check_file(tag, wav, mp3, target, dur, problems):
    p = os.path.join(REPO, wav)
    info = sf.info(p)
    y, sr = sf.read(p, dtype="float32")
    if sr != 48000 or info.subtype != "PCM_24" or info.channels != 1:
        problems.append(f"{tag}: format {sr} {info.subtype} {info.channels}ch")
    lu, tp = L.V.lufs(y), L.V.true_peak_db(y)
    if abs(lu - target) > 0.1:
        problems.append(f"{tag}: LUFS {lu:.2f} (target {target})")
    if tp > -1.5:
        problems.append(f"{tag}: TP {tp:.2f}")
    if int(np.sum(np.abs(y) >= 0.999)):
        problems.append(f"{tag}: clipping")
    d, _ = sf.read(os.path.join(REPO, mp3), dtype="float32")
    if abs(L.V.lufs(d) - lu) > 0.1:
        problems.append(f"{tag}: mp3 LUFS {L.V.lufs(d):.2f} vs {lu:.2f}")
    if dur is not None and abs(len(y) / sr - dur) > 0.002:
        problems.append(f"{tag}: duration mismatch")
    return y, sr


def main():
    lines = json.load(open(os.path.join(ROOT, "lines.json")))
    problems = []
    by_spk = defaultdict(list)
    scenes = defaultdict(set)
    ids = [e["id"] for e in lines]
    if len(ids) != len(set(ids)):
        problems.append("duplicate ids")
    for e in lines:
        target = e["qa"].get("target_lufs", -16.0)
        y, sr = check_file(e["id"], e["file"], e["mp3"], target, e["duration_s"], problems)
        if e.get("kind") not in KINDS or e.get("side") not in SIDES or e.get("pov") not in POVS or not e.get("shot"):
            problems.append(f"{e['id']}: staging fields missing or invalid")
        if (e.get("kind") == "post") == e["voiced_in_cut"]:
            problems.append(f"{e['id']}: kind/voiced_in_cut disagree")
        if e.get("kind") == "vo" and (e.get("side") != "none" or e["mouth"] or e.get("lip_sync")):
            problems.append(f"{e['id']}: a V.O. line with a window or a mouth")
        if e.get("fallback"):
            fb = e["fallback"]
            check_file(e["id"] + " fallback", fb["file"], fb["mp3"], fb["qa"]["target_lufs"], fb["duration_s"], problems)
            if fb["qa"].get("cer", 0) > 0.0:
                problems.append(f"{e['id']} fallback: ASR CER {fb['qa']['cer']} ('{fb['qa']['asr']}')")
        if e.get("clean"):
            check_file(e["id"] + " clean", e["clean"]["file"], e["clean"]["mp3"], e["clean"]["lufs_i"], None, problems)
        m = e["mouth"]
        if e["on_camera"] not in CUE_CAMS and m:
            problems.append(f"{e['id']}: mouth cues on a line with no visible mouth ({e['on_camera']})")
        if e.get("lip_sync") and not m:
            problems.append(f"{e['id']}: lip_sync without a mouth track")
        if e["voiced_in_cut"] and m:
            n = int(np.ceil(len(y) / sr * L.FPS))
            if not m or m[0]["f"] != 0:
                problems.append(f"{e['id']}: mouth does not start at f0")
            for a, b in zip(m, m[1:]):
                if b["f"] - a["f"] < 2:
                    problems.append(f"{e['id']}: 1-frame mouth at f{a['f']}")
            if m and m[-1]["shape"] not in ("rest", "smile"):
                problems.append(f"{e['id']}: mouth ends on {m[-1]['shape']}")
            if any(c["shape"] not in SHAPES for c in m):
                problems.append(f"{e['id']}: unknown shape")
            if m and m[-1]["f"] > n:
                problems.append(f"{e['id']}: mouth past end")
            if "smile" in [c["shape"] for c in m[:-1]]:
                problems.append(f"{e['id']}: smile during speech")
        if e["voiced_in_cut"] and not e.get("derived_from"):  # the laptop line is a copy of a4-26-01: no lane of its own
            slug = e["speaker_slug"] + ("-vo" if e.get("kind") == "vo" else "")
            by_spk[slug].append((e, y))
            scenes[e["scene"]].add(slug)
        if e["qa"].get("cer", 0) > 0.0:
            problems.append(f"{e['id']}: ASR CER {e['qa']['cer']} ('{e['qa']['asr']}')")
        # draft 3.2 (tighten-changes §3): status values, trims, internal pauses, hard cut-offs, span vs target
        if e.get("status") not in STATUS_32:
            problems.append(f"{e['id']}: status '{e.get('status')}' is not a 3.2 value")
        if e["voiced_in_cut"] and e.get("target_span_s"):
            a_in, a_out = P.audible(y, sr, -52.0)
            head, tail = a_in, len(y) / sr - a_out
            if head > 0.045 or tail > 0.045:
                problems.append(f"{e['id']}: trim head {head:.3f} s / tail {tail:.3f} s (> 40 ms)")
            cap = 0.42 if e["id"] == "a4-31-03" else 0.32
            g = P.longest_gap(y, sr)
            if g > cap and not e.get("derived_from"):
                problems.append(f"{e['id']}: internal pause {g:.2f} s (cap {cap})")
            if e.get("cutoff"):
                env, hop = L.V._rms_frames(y, sr, 0.01)
                end_db = 20 * np.log10(env[-3:].max() / env.max())  # the loudest of the last 30 ms: a stop, not a decay
                if end_db < -24.0:
                    problems.append(f"{e['id']}: cut-off ends {end_db:.0f} dB under its peak (a tail, not a hard stop)")
            span = e["voiced_span_s"]
            if e.get("kind") == "vo":
                if span > VO_SLOT.get(e["id"], 9) or span < 0.9 * e["target_span_s"]:
                    problems.append(f"{e['id']}: V.O. span {span:.2f} s outside its slot (target {e['target_span_s']}, slot {VO_SLOT.get(e['id'])})")
            elif abs(span / e["target_span_s"] - 1) > 0.10:
                problems.append(f"{e['id']}: span {span:.2f} s is {100 * (span / e['target_span_s'] - 1):+.0f}% of its target {e['target_span_s']} s")
    lanes = {}
    for spk, items in by_spk.items():
        f0s = [e["qa"]["median_f0_hz"] for e, _ in items if e["qa"].get("median_f0_hz")]
        rngs = [e["qa"]["f0_range_st"] for e, _ in items if e["qa"].get("f0_range_st") is not None]
        wpms = [e["qa"]["wpm"] for e, _ in items if e["qa"].get("wpm")]
        mf, ce = zip(*[timbre(y) for _, y in items])
        lanes[spk] = {"name": items[0][0]["speaker"] + (" (V.O.)" if spk.endswith("-vo") else ""), "voice": items[0][0]["voice"], "n_lines": len(items),
                      "median_f0_hz": round(float(np.median(f0s)), 1) if f0s else None,
                      "mean_range_st": round(float(np.mean(rngs)), 1) if rngs else None,
                      "wpm_lines": wpms, "centroid_hz": round(float(np.median(ce))),
                      "_mfcc": np.mean(mf, axis=0).round(3).tolist(),
                      "total_s": round(sum(e["duration_s"] for e, _ in items), 2)}
    pairs = {}
    shared = defaultdict(list)
    for sc, spks in scenes.items():
        for a, b in combinations(sorted(spks), 2):
            shared[(a, b)].append(sc)
    for (a, b), scs in sorted(shared.items()):
        A, B = lanes[a], lanes[b]
        pairs[f"{a}|{b}"] = {"scenes": sorted(scs),
                             "d_f0_st": round(abs(12 * np.log2(A["median_f0_hz"] / B["median_f0_hz"])), 1),
                             "d_mfcc": round(float(np.linalg.norm(np.array(A["_mfcc"]) - np.array(B["_mfcc"]))), 1),
                             "d_centroid_pct": round(100 * abs(A["centroid_hz"] - B["centroid_hz"]) / B["centroid_hz"])}
    out = {"problems": problems, "lanes": lanes, "shared_scene_pairs": pairs}
    json.dump(out, open(os.path.join(ROOT, "qa", "final_cast.json"), "w"), indent=1, ensure_ascii=False)
    print("PROBLEMS:", len(problems))
    for p in problems:
        print("  ", p)
    for s, v in sorted(lanes.items(), key=lambda kv: kv[1]["median_f0_hz"] or 0):
        print(f"{v['name']:15s} F0 {v['median_f0_hz']} rng {v['mean_range_st']} wpm {v['wpm_lines']} cent {v['centroid_hz']} lines {v['n_lines']} {v['total_s']}s")
    for k, v in pairs.items():
        print(f"  {k:32s} sc {','.join(v['scenes']):12s} dF0 {v['d_f0_st']:4.1f} st  dMFCC {v['d_mfcc']:5.1f}  dCent {v['d_centroid_pct']}%")


if __name__ == "__main__":
    main()
