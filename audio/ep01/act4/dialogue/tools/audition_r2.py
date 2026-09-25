"""audition_r2.py - round 2: TTEMME without the eric pack, checked against the round-1 picks as placed
(NELEH aoede -2 st, MADA adam +1.5 st, TASYA eric -1.5 st). Appends to auditions/auditions.json['round2']."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import audition as A
import cast_a4 as CA

rep = json.load(open(os.path.join(A.AUD, "auditions.json")))
r2 = {"cands": {}, "placed": {}, "distinctness": {}}
role = CA.NEW["ttemme"]
sides = [("a4-27-18", "Chat.{0.28} I'm the CEO now."), ("a4-27-19", "Chat...{0.55} for how long?")]
for cand in role["cands"][3:]:
    res, summ, clips = A.run_voice("ttemme", cand["id"], cand, sides, os.path.join(A.AUD, "ttemme"), role["wpm"])
    r2["cands"][cand["id"]] = {"voiceId": A.L.V.voice_id(cand["blend"]), "grade": cand["grade"],
                               "processing": A.L.V.describe_chain(cand["chain"]), "summary": summ, "lines": res}
# re-measure the placed picks whose pitch moved
for slug in ("neleh", "mada"):
    cid = CA.NEW_PICKS[slug]
    cand = next(c for c in CA.NEW[slug]["cands"] if c["id"] == cid)
    lines = rep["roles"][slug]["cands"][cid]["lines"]
    res, summ, _ = A.run_voice(slug, cid + "-placed", cand, [(l["line"], l["say"]) for l in lines], os.path.join(A.AUD, slug), CA.NEW[slug]["wpm"])
    r2["placed"][slug] = {"cand": cid, "summary": summ, "lines": res}

def f(slug):
    if slug in r2["placed"]:
        return r2["placed"][slug]["summary"]
    if slug in rep["refs"]:
        return rep["refs"][slug]["summary"]
    return rep["roles"][slug]["cands"][CA.NEW_PICKS[slug]]["summary"]

def d(a, b):
    return {"d_f0_st": round(abs(12 * np.log2(a["median_f0_hz"] / b["median_f0_hz"])), 1),
            "d_mfcc": round(float(np.linalg.norm(np.array(a["_mfcc"]) - np.array(b["_mfcc"]))), 1),
            "d_centroid_pct": round(100 * abs(a["centroid_hz"] - b["centroid_hz"]) / b["centroid_hz"])}

for cid, c in r2["cands"].items():
    r2["distinctness"][cid] = {p: d(c["summary"], f(p)) for p in ("tasya", "mada", "neleh", "gerg-mockbran", "mario")}
for slug in ("neleh", "mada"):
    parts = {"neleh": ("rima-tamuri", "alyi", "tasya", "tiled-employee", "adelina"), "mada": ("mas-manalt", "terb", "tasya", "neleh", "alyi")}[slug]
    r2["distinctness"][slug + "-placed"] = {p: d(f(slug), f(p)) for p in parts}
rep["round2"] = r2
json.dump(rep, open(os.path.join(A.AUD, "auditions.json"), "w"), indent=1, ensure_ascii=False)
for k, rows in r2["distinctness"].items():
    print(k, json.dumps(rows))
for cid, c in r2["cands"].items():
    x = c["summary"]; print(cid, x["median_f0_hz"], x["mean_range_st"], x["wpm"], x["worst_cer"], x["mean_logprob"])
for s, c in r2["placed"].items():
    x = c["summary"]; print("placed", s, x["median_f0_hz"], x["mean_range_st"], x["worst_cer"])
