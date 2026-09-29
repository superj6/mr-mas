"""qa_v5.py - QA gate + summary for the v5 takes (lines-v5.json). Measured, not heard.

Hard checks (the method, voice-diagnosis-v4 §4.7, and the pipeline's existing file checks, final_cast.py):
  format 48 kHz / 24-bit mono; loudness to the row's target +-0.1 LU; true peak <= -1.5 dBTP; 0 clipped samples;
  MP3 level-matched +-0.1 LU; no digital black (exact zeros >= 10 ms); room-tone handles >= 0.30 s at both ends;
  >= 0.12 s before the first speech sound; a natural decay at the end (no line ends in a hard stop, the two trailed
  interruptions fade over >= 100 ms); no time-stretch, no carrier cut, no splice; Kokoro speed inside the character's
  band (+-0.05 for a stated change of state); mouth tracks well formed.
Flags for the ear (not failures): UTMOS more than 0.3 under a plain read of the same words; ASR missing a non-name
word; yes/no questions without a 1 st final lift; pauses opened where Kokoro ran the words together; articulation
outside the character's guide; pace spread within a scene.
Also: totals, per-character pace, the conversations' talk time against the plan, and dialogue string-outs.
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
import json, os, re, sys, statistics as st, warnings
warnings.filterwarnings("ignore")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(REPO, "audio/ep01/act4/dialogue/tools")); sys.path.insert(0, HERE)
import numpy as np, soundfile as sf
import a4lib as L
import lines_v5 as S5

DLG = os.path.join(REPO, "audio/ep01/act4/dialogue")
OUT = os.path.join(DLG, "v5")
LJ = os.environ.get("V5_LINES", os.path.join(DLG, "lines-v5.json"))
QOUT = os.environ.get("V5_QA_OUT", OUT)
ROWS = [r for r in json.load(open(LJ)) if r]
PLAN = {r["id"]: r for r in json.load(open(os.path.join(HERE, "plan_lines.json")))["voiced"]}
TAKES = {}
SR = 48000
wc = lambda t: len(re.findall(r"[A-Za-z0-9*']+(?:[-’'][A-Za-z0-9]+)*", t))
SHAPES = {"A", "E", "O", "M", "rest", "smile"}


def rms_db(y, win=0.01):
    n = int(SR * win); m = len(y) // n
    e = np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e / e.max())


def zero_runs(y):
    z = (y == 0.0).astype(np.int8)
    dz = np.diff(np.concatenate([[0], z, [0]]))
    s, e = np.where(dz == 1)[0], np.where(dz == -1)[0]
    return int(np.sum((e - s) >= int(0.01 * SR)))


problems, flags = [], []
for r in ROWS:
    i = r["id"]
    p = os.path.join(REPO, r["file"])
    info = sf.info(p)
    y, sr = sf.read(p, dtype="float32")
    if sr != SR or info.subtype != "PCM_24" or info.channels != 1:
        problems.append(f"{i}: format {sr} {info.subtype} {info.channels}ch")
    lu, tp = L.V.lufs(y), L.V.true_peak_db(y)
    tgt = r["qa"]["target_lufs"]
    if r.get("joined"):
        jy, _ = sf.read(os.path.join(REPO, r["joined"]["file"]), dtype="float32")
        jl = L.V.lufs(jy)
        if abs(jl - tgt) > 0.1:
            problems.append(f"{i}: the joined read measures {jl:.2f} LUFS (target {tgt})")
        r["qa"]["lufs_note"] = f"part of one read: the joined read is {jl:.2f} LUFS; this part measures {lu:.2f}"
    elif r.get("interrupt"):
        cy, _ = sf.read(os.path.join(REPO, r["complete"]["file"]), dtype="float32")
        cl = L.V.lufs(cy)
        if abs(cl - tgt) > 0.1:
            problems.append(f"{i}: the complete read measures {cl:.2f} LUFS (target {tgt})")
        r["qa"]["lufs_note"] = f"trailed from the complete read ({cl:.2f} LUFS) at the same gain; the trailed file measures {lu:.2f}"
    elif abs(lu - tgt) > 0.1:
        problems.append(f"{i}: LUFS {lu:.2f} (target {tgt})")
    if tp > -1.5:
        problems.append(f"{i}: true peak {tp:.2f} dBTP")
    if int(np.sum(np.abs(y) >= 0.999)):
        problems.append(f"{i}: clipping")
    if r.get("mp3"):
        d, _ = sf.read(os.path.join(REPO, r["mp3"]), dtype="float32")
        if abs(L.V.lufs(d) - lu) > 0.1:
            problems.append(f"{i}: mp3 LUFS {L.V.lufs(d):.2f} vs {lu:.2f}")
    if zero_runs(y):
        problems.append(f"{i}: {zero_runs(y)} runs of digital black")
    db = rms_db(y)
    loud = np.where(db > -40)[0]
    first, last = loud[0] * 0.01, (loud[-1] + 1) * 0.01
    dur = len(y) / SR
    if first < 0.30:
        problems.append(f"{i}: head handle {first:.2f} s (< 0.30)")
    if dur - last < 0.30:
        problems.append(f"{i}: tail handle {dur - last:.2f} s (< 0.30)")
    if r["pace"]["audible_in_s"] < 0.12:
        problems.append(f"{i}: speech starts {r['pace']['audible_in_s']:.2f} s into the file (< 0.12)")
    trail = r.get("interrupt")
    if trail:
        if trail["fade_s"] < 0.10:
            problems.append(f"{i}: the trail fades over {trail['fade_s']} s (< 0.10)")
    elif not (r.get("joined") and r["joined"]["offset_in_joined_s"] == 0.0) and not r.get("derived_from"):
        if r["qa"].get("decay_ms", 99) < 20:
            problems.append(f"{i}: the last word decays in {r['qa']['decay_ms']} ms (a hard stop)")
    procs = " ".join(r.get("processing", [])).lower()
    if r["pace"].get("tsm", 1.0) != 1.0 or "time-compression" in procs or "carrier read" in procs or "lifted" in procs:
        problems.append(f"{i}: processing outside the method")
    if not r.get("derived_from") and not r.get("reused_from"):
        lo, hi = r["pace"]["intended"]["speed_band"]
        if not (lo - 0.05 <= r["pace"]["speed"] <= hi + 0.05):
            problems.append(f"{i}: speed {r['pace']['speed']} outside the band {lo}-{hi}")
    m = r.get("mouth") or []
    if m:
        n = int(np.ceil(dur * 24))
        if m[0]["f"] != 0: problems.append(f"{i}: mouth does not start at f0")
        if any(b["f"] - a["f"] < 2 for a, b in zip(m, m[1:])): problems.append(f"{i}: a 1-frame mouth")
        if m[-1]["shape"] not in ("rest", "smile"): problems.append(f"{i}: mouth ends on {m[-1]['shape']}")
        if any(c["shape"] not in SHAPES for c in m): problems.append(f"{i}: unknown mouth shape")
        if m[-1]["f"] > n: problems.append(f"{i}: mouth past the end")
    # ------------------------------------------------ flags for the ear
    q = r["qa"]
    if r.get("derived_from") or r.get("reused_from"):
        continue
    if q.get("utmos_vs_plain") is not None and q["utmos_vs_plain"] < -0.3:
        flags.append((i, "naturalness", f"UTMOS {q['utmos_dry']:.2f} is {q['utmos_vs_plain']:+.2f} against a plain read of the same words ({q['utmos_plain_read']:.2f})"))
    if (q.get("word_recall_nonames") or 1) < 1.0:
        flags.append((i, "asr", f"ASR missed a word: '{q.get('asr')}' (recall {q['word_recall_nonames']})"))
    if i in S5.YESNO:
        lift = q.get("q_lift_st")
        if lift is None or lift < 1.0:
            flags.append((i, "question", f"no clear final lift ({lift} st): does it read as a question?"))
    for o in r.get("opened_pauses", []):
        if o.get("split"):
            flags.append((i, "split-read", f"read as separate whole reads at '{o['word']}' ({o['target_s']} s of room tone between them): Kokoro runs these words together; does the turn still hang together?"))
        elif o.get("joined_speech") and o.get("opened_s", 0) > 0.01 and (o.get("dip_db") or -99) > -30:
            flags.append((i, "pause-in-voice", f"the {o['target_s']} s pause after '{o['word']}' is opened while the voice still sounds (dip {o.get('dip_db')} dB): the cut is shaped as a decay and an onset"))
    for pno in r.get("pauses_not_opened", []):
        flags.append((i, "pause-not-opened", f"the intended {pno['intended_s']} s stop after '{pno['after']}' is not opened: Kokoro runs the words together and opening it would cut the voice (the split-read alternate is in takes/)"))
    art = r["pace"]["measured"]["articulation_sps"]
    g = r["pace"]["intended"]["articulation_guide_sps"]
    if art and r["pace"]["words"] >= 3 and (art > 6.0 or art > g[1] * 1.15 or art < g[0] * 0.85):
        flags.append((i, "pace", f"articulation {art} syll/s against the guide {g[0]}-{g[1]}" + (" (above 6: reads rushed)" if art > 6.0 else "")))

# ------------------------------------------------ totals
voiced = ROWS
words = sum(wc(r["text"]) for r in voiced)


def as_played_span(r):
    s = r["voiced_span_s"]
    if r.get("interrupt"):
        s = min(s, r["interrupt"]["fade_from_s"] + 0.05 - r["pace"]["audible_in_s"])
    return s


audible = sum(as_played_span(r) for r in voiced)
by = {}
for r in voiced:
    if r.get("derived_from"):
        continue
    k = r["speaker"] + (" (V.O.)" if r["kind"] == "vo" else "")
    b = by.setdefault(k, {"lines": 0, "words": 0, "span": 0.0, "art": [], "speeds": set(), "wpm_lines": []})
    b["lines"] += 1; b["words"] += wc(r["text"]); b["span"] += as_played_span(r)
    if r["pace"]["words"] >= 3 and r["pace"]["measured"]["articulation_sps"]:
        b["art"].append(r["pace"]["measured"]["articulation_sps"])
    b["speeds"].add(r["pace"]["speed"])
per_char = {k: {"lines": b["lines"], "words": b["words"], "audible_s": round(b["span"], 1),
                "wpm": round(b["words"] / b["span"] * 60, 0) if b["span"] else None,
                "articulation_median_sps": round(st.median(b["art"]), 2) if b["art"] else None,
                "articulation_range_sps": [min(b["art"]), max(b["art"])] if b["art"] else None,
                "speeds": sorted(b["speeds"])}
            for k, b in sorted(by.items(), key=lambda kv: -kv[1]["words"])}
# pace stability per character per scene
stab = []
for sc in sorted({r["scene"] for r in voiced}):
    for k in sorted({r["speaker"] + ("-vo" if r["kind"] == "vo" else "") for r in voiced if r["scene"] == sc}):
        rs = [r for r in voiced if r["scene"] == sc and r["speaker"] + ("-vo" if r["kind"] == "vo" else "") == k
              and not r.get("derived_from") and not r.get("reused_from")]
        if len(rs) < 2:
            continue
        sp = [r["pace"]["speed"] for r in rs]
        ar = [r["pace"]["measured"]["articulation_sps"] for r in rs if r["pace"]["words"] >= 4 and r["pace"]["measured"]["articulation_sps"]]
        row = {"scene": sc, "speaker": k, "lines": len(rs), "speed_spread": round(max(sp) - min(sp), 3),
               "articulation_spread_pct": round(100 * (max(ar) - min(ar)) / st.median(ar), 0) if len(ar) >= 2 else None}
        stab.append(row)
        if row["speed_spread"] > 0.08:
            flags.append((f"sc {sc} {k}", "pace-stability", f"speed spread {row['speed_spread']}"))
        if row["articulation_spread_pct"] and row["articulation_spread_pct"] > 20:
            flags.append((f"sc {sc} {k}", "pace-stability", f"articulation spread {row['articulation_spread_pct']:.0f}% over {len(ar)} lines of 4+ words (text-driven; hold the ear on it)"))

# ------------------------------------------------ against the plan
CONV = [("1 THE PLAN", "a5-25-01", "a5-25-06"), ("2 the noon call, their side", "a5-27-01", "a5-27-05"),
        ("3 step two and Rima", "a5-27-06", "a5-27-17"), ("4 the all-hands", "a5-27-18", "a5-27-19"),
        ("5 Gerg quits", "a5-27-20", "a5-27-21"), ("6 the committee and the rival lab", "a5-27-22", "a5-27-34"),
        ("7 Sunday", "a5-27-35", "a5-27-46"), ("8 Gerg at 2 AM", "a5-29-03", "a5-29-19"),
        ("9 Tasya at the door", "a5-29-20", "a5-29-23"), ("10 Alyi across the gap", "a5-30-01", "a5-30-04"),
        ("11 Tasya on the floor", "a5-30-05", "a5-30-07"), ("12 the terms", "a5-30-08", "a5-30-17"),
        ("13 the vault", "a5-31-01", "a5-31-03"), ("14 the memo", "a5-31-04", "a5-31-04")]
ids = [r["id"] for r in voiced]
R = {r["id"]: r for r in voiced}
conv = []
for name, a, b in CONV:
    if a not in ids or b not in ids: continue
    seg = ids[ids.index(a): ids.index(b) + 1]
    gaps = [PLAN[x]["gap"] for x in seg[1:]]
    num = [float(re.match(r"^(-?\d*\.?\d+)", g).group(1)) for g in gaps if re.match(r"^-?\d", g)]
    pic = sum(1 for g in gaps if g.startswith("—"))
    talk = sum(as_played_span(R[x]) for x in seg) + sum(num)
    est = sum(float(PLAN[x]["est"]) for x in seg) + sum(num)
    conv.append({"conversation": name, "lines": len(seg), "talk_s": round(talk, 1), "plan_talk_s": round(est, 1),
                 "delta_s": round(talk - est, 1), "picture_beats_inside": pic})
delta_all = sum(as_played_span(r) - float(PLAN[r["id"]]["est"]) for r in voiced)
est_all = sum(float(PLAN[r["id"]]["est"]) for r in voiced)

# ------------------------------------------------ v4 against v5 on the same words
same = [(r["id"], r["qa"].get("utmos_v4_same_words"), r["qa"]["utmos_dry"]) for r in voiced
        if r["qa"].get("utmos_v4_same_words") is not None and not r.get("reused_from") and not r.get("derived_from")]

# ------------------------------------------------ string-outs (dialogue only, for the ear; NOT a timing reference)
os.makedirs(os.path.join(QOUT, "reel"), exist_ok=True); os.makedirs(os.path.join(QOUT, "qa"), exist_ok=True)
place = []
scenes = {}
for r in voiced:
    scenes.setdefault(r["scene"], []).append(r)
for sc, rs in scenes.items():
    t = 0.5; parts = []; prev_end = 0.0; prev_row = None
    for r in rs:
        y, _ = sf.read(os.path.join(REPO, r["file"]), dtype="float32")
        a_in = r["pace"]["audible_in_s"]
        g = r["placement"].get("gap_before_s")
        if prev_row is None:
            on = t + 0.5
        elif r["id"] == "a5-27-32" and prev_row.get("interrupt"):
            on = prev_start + prev_row["interrupt"]["voice_drops_at_s"]
        elif r["id"] == "a5-29-12":
            on = prev_start + (r["joined"]["offset_in_joined_s"]) + a_in - a_in  # butt-joined: the file follows 29-11 exactly
            start = prev_start + len(prev_y) / SR
            parts.append((start, y)); place.append({"id": r["id"], "scene": sc, "onset_s": round(start + a_in, 3), "gap": "joined"})
            prev_end = start + r["pace"]["audible_out_s"]; prev_row = r; prev_start = start; prev_y = y
            continue
        else:
            on = prev_end + (g if g is not None else 1.0)
        start = on - a_in
        parts.append((start, y))
        place.append({"id": r["id"], "scene": sc, "onset_s": round(on, 3), "gap": g if g is not None else "picture (1.0 s placeholder)"})
        out_s = (r["interrupt"]["fade_from_s"] + 0.05) if r.get("interrupt") else r["pace"]["audible_out_s"]
        prev_end = start + out_s; prev_row = r; prev_start = start; prev_y = y
    n = int((max(s + len(y) / SR for s, y in parts) + 0.5) * SR)
    mix = np.zeros(n, np.float32)
    for s, y in parts:
        k = int(s * SR); mix[k:k + len(y)] += y[: n - k]
    L.V.write_wav_mp3(mix, None, os.path.join(QOUT, "reel", f"sc{sc}-stringout.mp3"))
json.dump(place, open(os.path.join(QOUT, "reel", "stringout.json"), "w"), indent=1)

summary = {"problems": problems, "flags": [{"id": a, "kind": b, "note": c} for a, b, c in flags],
           "totals": {"lines": len(voiced), "words": words, "audible_s": round(audible, 1),
                      "wpm_overall": round(words / audible * 60, 0),
                      "plan_est_s": round(est_all, 1), "takes_minus_plan_est_s": round(delta_all, 1)},
           "per_character": per_char, "pace_stability": stab, "conversations": conv,
           "v4_vs_v5_same_words": [{"id": a, "v4": b, "v5": c, "diff": round(c - b, 2)} for a, b, c in same]}
json.dump(summary, open(os.path.join(QOUT, "qa", "qa-v5.json"), "w"), indent=1, ensure_ascii=False, default=float)
if LJ == os.path.join(DLG, "lines-v5.json"):
    json.dump(ROWS, open(LJ, "w"), indent=1, ensure_ascii=False, default=float)   # carries the lufs notes
print("PROBLEMS", len(problems)); [print("  ", p) for p in problems]
print("FLAGS", len(flags)); [print("  ", a, "|", b, "|", c) for a, b, c in flags]
print(json.dumps(summary["totals"]))
for k, v in per_char.items(): print(f"  {k:22s} {v}")
for c in conv: print("  ", c)
print("v4 vs v5:", summary["v4_vs_v5_same_words"])
