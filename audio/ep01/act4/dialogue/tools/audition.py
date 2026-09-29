"""audition.py - cast the Act Four speakers who are not in CASTING.md (pass 1).

Each new role gets three stock-pack candidates (cast_a4.NEW), read on that role's actual Act Four lines,
DRY. Measured: median F0, per-line F0 range, pace, ASR intelligibility, spectral centroid, and a timbre
vector (mean MFCC 1-12 over loud frames). Distinctness is computed against every scene partner
(returning picks and the other new roles), because the brief is "every character distinct, especially
in shared scenes". Writes auditions/<slug>/<cand>-<line>.mp3, auditions/<slug>/<slug>-reel.mp3
(chime pings = candidate index, as in CASTING.md) and auditions/auditions.json.

Run: HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/audition.py
"""
from __future__ import annotations
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
import cast_a4 as CA
from lines_a4 import LINES

ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
AUD = os.path.join(ROOT, "auditions")

EXTRA = {  # audition-only sides where a role has one very short act line (never used in the cut)
    "adelina": [("x-ep4", "In plain English:{0.30} we raised money to warn about raising money.")],
    "mada": [("x-seed2", "Good question.")],
    "tiled-employee": [("x-2", "Is this a coup, or is this a reorg?")],
}

REFS = {  # returning picks, read on their own Act Four lines, for the distinctness matrix
    "mas-manalt": ["the hearts{0.12} were sincere.", "leave it open.", "good question."],
    "alyi": ["The company{0.15} will tell us.", "That is the company{0.15} telling us."],
    "rima-tamuri": ["I'll hold it together.", "We'll share more soon."],
    "gerg-mockbran": ["The company.{0.20} Again.{0.20} Just in case.", "What's in there?"],
    "mario": ["I've written up some thoughts.", "Hi.{0.16} Yes.{0.16} We're very worried.{0.20} How much?"],
}

PARTNERS = {
    "neleh": ["rima-tamuri", "alyi", "mada", "ttemme", "tasya", "tiled-employee"],
    "mada": ["mas-manalt", "neleh", "terb", "alyi", "tasya", "ttemme"],
    "terb": ["mas-manalt", "mada", "gerg-mockbran"],
    "tasya": ["mas-manalt", "gerg-mockbran", "alyi", "ttemme", "mada", "neleh"],
    "ttemme": ["tasya", "mada", "neleh", "gerg-mockbran"],
    "adelina": ["mario", "rima-tamuri", "neleh"],
    "tiled-employee": ["alyi", "rima-tamuri", "neleh"],
}


def timbre(y):
    import librosa
    from scipy.signal import resample_poly
    y16 = resample_poly(y.astype(np.float64), 1, 3).astype(np.float32)
    S = np.abs(librosa.stft(y16, n_fft=512, hop_length=160))
    loud = S.sum(0) > np.percentile(S.sum(0), 50)
    mf = librosa.feature.mfcc(S=librosa.power_to_db(librosa.feature.melspectrogram(S=S ** 2, sr=16000, n_mels=40)), n_mfcc=13)
    cent = librosa.feature.spectral_centroid(S=S, sr=16000)[0]
    return mf[1:13, loud].mean(axis=1), float(np.median(cent[loud]))


def run_voice(slug, cand_id, voice, sides, out_dir, wpm_band):
    os.makedirs(out_dir, exist_ok=True)
    res, clips, mfccs, cents = [], [], [], []
    for lid, say in sides:
        y, toks, info = L.render(say, voice, seed=1, wpm_band=wpm_band)
        base = os.path.join(out_dir, f"{cand_id}-{lid}")
        L.write(y, base + ".wav", base + ".mp3")
        a = L.analyse(y, toks)
        a.pop("_contour", None)
        hyp, lp, _ = L.asr_words(base + ".wav")
        c = L.cer(L.parse_say(say)[0], hyp)
        m, ce = timbre(y)
        mfccs.append(m)
        cents.append(ce)
        os.remove(base + ".wav")
        clips.append(y)
        res.append({"line": lid, "say": say, "asr": hyp, "cer": round(c, 3), "logprob": round(lp, 3), **a,
                    "speed": info["speed"], "file": os.path.relpath(base + ".mp3", ROOT)})
        print(f"  {slug:15s} {cand_id:22s} {lid:9s} {a['duration_s']:5.2f}s F0 {a['median_f0_hz']} rng {a['f0_range_st']} "
              f"wpm {a.get('wpm')} cer {c:.2f} | {hyp}", flush=True)
    f0s = [r["median_f0_hz"] for r in res if r["median_f0_hz"]]
    summ = {
        "median_f0_hz": round(float(np.median(f0s)), 1),
        "mean_range_st": round(float(np.mean([r["f0_range_st"] for r in res if r["f0_range_st"] is not None])), 1),
        "wpm": [r["wpm"] for r in res if r.get("wpm")],
        "worst_cer": max(r["cer"] for r in res),
        "mean_logprob": round(float(np.mean([r["logprob"] for r in res])), 3),
        "centroid_hz": round(float(np.median(cents))),
        "_mfcc": np.mean(mfccs, axis=0).round(3).tolist(),
    }
    return res, summ, clips


def main():
    os.makedirs(AUD, exist_ok=True)
    report = {"refs": {}, "roles": {}}
    # returning references
    for slug, sides in REFS.items():
        v = CA.RETURNING[slug]
        print("== ref", slug, flush=True)
        res, summ, _ = run_voice(slug, "ref-" + v["cand"], v, [(f"r{i + 1}", s) for i, s in enumerate(sides)],
                                 os.path.join(AUD, "_refs", slug), v["wpm"])
        report["refs"][slug] = {"cand": v["cand"], "summary": summ, "lines": res}
    # new roles
    for slug, role in CA.NEW.items():
        sides = [(ln["id"], ln["say"]) for ln in LINES if ln["speaker"] == slug and ln["mode"] != "post-popup" and not ln.get("cut")]
        seen, uniq = set(), []
        for lid, say in sides:
            if say not in seen:
                seen.add(say)
                uniq.append((lid, say))
        uniq += EXTRA.get(slug, [])
        print("== role", slug, [u[0] for u in uniq], flush=True)
        report["roles"][slug] = {"name": role["name"], "brief": role["brief"], "cands": {}}
        reel = []
        for ci, cand in enumerate(role["cands"]):
            res, summ, clips = run_voice(slug, cand["id"], cand, uniq, os.path.join(AUD, slug), role["wpm"])
            report["roles"][slug]["cands"][cand["id"]] = {
                "voiceId": L.V.voice_id(cand["blend"]), "blend": cand["blend"], "speed": cand["speed"],
                "grade": cand["grade"], "processing": L.V.describe_chain(cand["chain"]), "summary": summ, "lines": res}
            gap = np.zeros(int(0.4 * L.SR), np.float32)
            reel += [L.V.chime(ci + 1), gap]
            for y in clips:
                reel += [y, gap]
        reel_y = L.V.normalise(np.concatenate(reel[:-1]))
        L.V.write_wav_mp3(reel_y, None, os.path.join(AUD, slug, f"{slug}-reel.mp3"))
    # distinctness: every candidate vs every partner (ref picks, and every candidate of new partners)
    def feats(slug, cand=None):
        if slug in report["refs"]:
            return report["refs"][slug]["summary"]
        return report["roles"][slug]["cands"][cand]["summary"]

    dist = {}
    for slug, role in report["roles"].items():
        for cid, c in role["cands"].items():
            rows = {}
            for p in PARTNERS[slug]:
                cands_p = [None] if p in report["refs"] else list(report["roles"][p]["cands"].keys())
                for pc in cands_p:
                    fp = feats(p, pc)
                    d_st = abs(12 * np.log2(c["summary"]["median_f0_hz"] / fp["median_f0_hz"]))
                    d_mf = float(np.linalg.norm(np.array(c["summary"]["_mfcc"]) - np.array(fp["_mfcc"])))
                    d_ce = abs(c["summary"]["centroid_hz"] - fp["centroid_hz"]) / fp["centroid_hz"]
                    rows[p + ("" if pc is None else ":" + pc)] = {"d_f0_st": round(d_st, 1), "d_mfcc": round(d_mf, 1),
                                                                  "d_centroid_pct": round(100 * d_ce)}
            dist[f"{slug}:{cid}"] = rows
    report["distinctness"] = dist
    json.dump(report, open(os.path.join(AUD, "auditions.json"), "w"), indent=1, ensure_ascii=False)
    print("wrote auditions.json", flush=True)


if __name__ == "__main__":
    main()
