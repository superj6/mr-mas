"""SUPERSEDED for draft 3.2 by record_32.py (2026-09-25): running this would overwrite the 3.2 deliverables with the 3.1 pass.
Kept because the 3.2 tools import from it.

record.py - record every line of Ep1 Act Four (draft 3.1), pick takes by measurement, export.

Run:  HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record.py [line-id ...]
      (no ids = the whole act; ids re-record just those lines and merge into lines.json)
Writes (under audio/ep01/act4/dialogue/):
  wav/<id>.wav  48 kHz / 24-bit mono, DRY, -16 LUFS integrated, <= -1.5 dBTP, trimmed (30 ms head, 80 ms tail)
  mp3/<id>.mp3  160 kbps, level-matched to the WAV
  optional/<id>.{wav,mp3}  scratch reads of post pop-ups (unvoiced in the cut by house rule)
  takes/<id>/<id>_tNN.{wav}  every take of the key comedic lines
  lines.json    [{id, scene, speaker, text, kind, side, pov, shot, delivery, file, duration_s, take, voice, processing, mouth, ...}]
  qa/qa.json    every take's measurements and score
Draft 3.1 additions:
  * a line may name a voice override (MAS V.O. = 'mas-manalt-vo': the same pack, closer and softer, -18 LUFS);
  * fallback/<id>.{wav,mp3}  a recorded alternate wording (a4-26a-vo1: the guardrails fallback)
  * a derived line (a4-27-00) is not read: it is another line's delivered take through a process (the laptop
    speaker), written to wav/ + mp3/, with the unprocessed copy in clean/;
  * every run refreshes the draft 3.1 staging (kind, side, pov, shot, cam, lip_sync, delivery, holds) on every row,
    re-recorded or not; rows whose speaker has no visible mouth (V.O., O.S., speaker, off-face) carry mouth: [].
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
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import soundfile as sf

import a4lib as L
import cast_a4 as CA
from lines_a4 import LINES, MASTER_MADA

LIP_CAMS = ("on", "reflection", "monitor")          # a mouth is drawn and animated
CUE_CAMS = LIP_CAMS + ("blueprint", "crowd")        # the speaker is drawn: cues are kept as an option

ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
MODEL = "Kokoro-82M v1.0 (hexgrad/Kokoro-82M; misaki G2P; lang 'a' American English)"
LICENSE = ("Kokoro-82M weights + stock voice packs: Apache-2.0; misaki: Apache-2.0; pedalboard: GPL-3.0 (tool only); "
           "no third-party or real-person audio used")

MASTER_TAKES = [{"seed": 1}, {"seed": 2}, {"seed": 1, "carrier": "Right. Okay."}, {"seed": 3, "carrier": "Hm.", "speed": 0.95},
                {"seed": 4, "speed": 0.9}, {"seed": 5, "speed": 1.05}, {"seed": 6, "carrier": "Mm.", "speed": 0.95},
                {"seed": 7, "carrier": "Hm.", "speed": 0.9}]
MASTER_PICK = {"dur": (0.75, 1.15), "range_max": 9.0, "final": "fall", "lane": True, "flat": True}


def rel(p):
    return os.path.relpath(p, REPO)


def voices():
    v = dict(CA.RETURNING)
    for slug, cid in CA.NEW_PICKS.items():
        role = CA.NEW[slug]
        c = next(x for x in role["cands"] if x["id"] == cid)
        v[slug] = {"name": role["name"], "cand": cid, "blend": c["blend"], "speed": c["speed"], "chain": c["chain"],
                   "wpm": role["wpm"], "lane_hz": role["lane_hz"], "grade": c["grade"]}
    return v


def voice_of(ln, V_):
    return V_[ln.get("voice", ln["speaker"])]


def voice_label(v):
    return f"{L.V.voice_id(v['blend'])} (Kokoro-82M stock) · {v['cand']} · speed {v['speed']}"


def processing(v, info):
    out = L.V.describe_chain(v["chain"])
    out.append("DRY: no reverb/slap (rooms are mix sends)")
    if info.get("carrier"):
        out.append(f"context-carrier read, cut at the quietest 5 ms frame before the line (carrier: '{info['carrier']}')")
    if info.get("tail"):
        out.append(f"tail-carrier read (keeps the final level), cut at the quietest 5 ms frame after the line (tail: '{info['tail']}')")
    for p in info.get("pauses", []):
        out.append(f"pause after word {p['after_word']}: {p['tts_s']:.2f} s -> {p['final_s']:.2f} s (target {p['target_s']:.2f})")
    out += ["silence trim (-52 dB rel. peak; 30 ms head / 80 ms tail pad)",
            f"48 kHz / 24-bit; {v.get('lufs', CA.DIALOGUE_LUFS):g} LUFS integrated; true-peak ceiling -1.5 dBTP"]
    return out


def voiced_span(y, sr=L.SR, thresh_db=-40.0):
    env, hop = L.V._rms_frames(y, sr, 0.01)
    db = 20 * np.log10(env / env.max())
    idx = np.where(db > thresh_db)[0]
    return (idx[-1] - idx[0] + 1) * hop / sr if len(idx) else 0.0


def score_take(m, pick, v, ctx):
    """Lower is better. Every term is logged so the pick can be explained."""
    terms = {}
    terms["asr_cer"] = 12.0 * m["cer"]
    terms["asr_conf"] = round(max(0.0, -m["logprob"] - 0.2) * 1.5, 3)
    if m.get("creak_tail", 0) > 0.15:
        terms["creak"] = round(8.0 * m["creak_tail"], 3)  # house rule: no fry/creak (reads as age coding)
    if not pick:
        return round(sum(terms.values()), 3), terms
    span = m["voiced_span_s"]
    needs_f0 = any(k in pick for k in ("range_max", "final", "lane", "flat", "below", "match"))
    if needs_f0 and m.get("median_f0_hz") is None:
        terms["f0_unmeasured"] = 6.0  # never let a take win by being unmeasurable
    if "dur" in pick:
        lo, hi = pick["dur"]
        terms["duration"] = round(30.0 * max(0.0, lo - span, span - hi), 3)
    rng = m.get("f0_range_st")
    if rng is not None and "range_max" in pick:
        terms["range"] = round(0.6 * max(0.0, rng - pick["range_max"]), 3)
    if rng is not None and pick.get("flat"):
        terms["flatness"] = round(0.25 * rng, 3)
    if rng is not None and pick.get("understated"):
        terms["understated"] = round(pick["understated"] * rng, 3)  # V.O.: told, never performed
    if pick.get("wpm") and m.get("wpm"):
        lo, hi = v["wpm"] if pick["wpm"] == "voice" else pick["wpm"]
        terms["pace"] = round(0.05 * max(0.0, lo - m["wpm"], m["wpm"] - hi), 3)
    mv = m.get("final_move_st")
    if mv is not None and pick.get("final") == "fall":
        terms["final_fall"] = round(0.8 * max(0.0, mv + 0.5), 3)
        if pick.get("gentle"):
            floor = pick.get("fall_floor", -7.0)  # Mas: level or gently falling (V.O.: an even tighter floor)
            terms["fall_too_steep"] = round(0.3 * max(0.0, floor - mv), 3)
    if mv is not None and pick.get("final") == "rise":
        terms["final_rise"] = round(0.8 * max(0.0, 1.0 - mv), 3)
    med = m.get("median_f0_hz")
    if med and pick.get("lane"):
        lo, hi = v["lane_hz"]
        out_st = max(0.0, 12 * np.log2(lo / med), 12 * np.log2(med / hi))
        terms["lane"] = round(1.5 * out_st, 3)
    if med and pick.get("below") and ctx.get("below_f0"):
        d = 12 * np.log2(med / ctx["below_f0"])  # want -2.5 .. 0 st
        terms["below_prev"] = round(1.0 * max(0.0, d) + 0.5 * max(0.0, -2.5 - d), 3)
    if pick.get("match") and ctx.get("match_contour") is not None:
        r = L.contour_corr(m.get("_contour"), ctx["match_contour"])
        m["match_r"] = r
        terms["contour_match"] = round(4.0 * (1.0 - (r if r is not None else 0.0)), 3)
        if ctx.get("match_range") is not None and rng is not None:
            terms["range_match"] = round(0.3 * abs(rng - ctx["match_range"]), 3)
    if "last_word_dur" in pick and m.get("last_word_s") is not None:
        lo, hi = pick["last_word_dur"]
        terms["last_word"] = round(20.0 * max(0.0, lo - m["last_word_s"], m["last_word_s"] - hi), 3)
    for p in m.get("pauses", []):
        terms.setdefault("pauses", 0.0)
        terms["pauses"] = round(terms["pauses"] + 10.0 * abs(p["final_s"] - p["target_s"]), 3)
    return round(sum(terms.values()), 3), terms


VO_SLOWER = (1.08, 1.20)  # V.O. span / his on-camera span for the same words (pov-and-framing §5.1: 110-125 vs 125-135 wpm)
VO_BASE = 0.88            # the V.O.'s starting speed, x the on-camera read's final speed


def vo_pace(say, V_):
    """Pace the V.O. against his own on-camera read of the same words. Words-per-minute alone can't say 'a touch slower
    than his scenes' across line shapes (a line of monosyllables reads ~150 wpm at a drawl), so each V.O. line is held to
    8-20% longer than the on-camera voice (a-michael-close, seed 1, its own pace band) speaking the same words: the
    bible's 110-125 vs 125-135 wpm, as a ratio. Returns the reference and the wpm band that ratio implies for this line."""
    oc = V_["mas-manalt"]
    y, toks, info = L.render(say, oc, seed=1, wpm_band=oc["wpm"])
    words = [t for t in toks if t["word"]]
    span = words[-1]["t1"] - words[0]["t0"]
    n = len(words)
    band = (round(n / (span * VO_SLOWER[1]) * 60, 1), round(n / (span * VO_SLOWER[0]) * 60, 1))
    ref = {"oncam_span_s": round(span, 3), "oncam_speed": info["speed"], "oncam_wpm": round(n / span * 60),
           "wpm_band": band, "rule": f"V.O. span = {VO_SLOWER[0]}-{VO_SLOWER[1]} x his on-camera read of the same words"}
    print(f"   pace ref (on-camera read): span {span:.2f} s, {ref['oncam_wpm']} wpm, speed {info['speed']} -> V.O. band {band}", flush=True)
    return ref


def vo_voice(v, ref):
    return dict(v, speed=round(ref["oncam_speed"] * VO_BASE, 3), wpm=ref["wpm_band"])


def record_takes(ln, v, takes, pick, ctx, keep_dir):
    os.makedirs(keep_dir, exist_ok=True)
    results = []
    for i, tk in enumerate(takes, 1):
        say = tk.get("say", ln["say"])
        y, toks, info = L.render(say, v, seed=tk.get("seed", 1), carrier=tk.get("carrier"), cut=ln.get("cut"),
                                 speed_scale=tk.get("speed", 1.0), wpm_band=v.get("wpm"), tail=tk.get("tail"))
        tid = f"t{i:02d}"
        wav = os.path.join(keep_dir, f"{ln['id']}_{tid}.wav")
        L.write(y, wav, None)
        a = L.analyse(y, toks)
        hyp, lp, asr_ws = L.asr_words(wav)
        ref_text = L.parse_say(say)[0]
        if ln.get("cut"):
            ref_text = ln["text"].replace("—", "").replace("\"", "")
        c = L.cer(ref_text, hyp)
        words = [t for t in toks if t["word"]]
        m = {**a, "take": tid, "spec": tk, "say": say, "asr": hyp, "cer": round(c, 3), "logprob": round(lp, 3),
             "align_median_s": L.align_check(toks, asr_ws), "voiced_span_s": round(voiced_span(y), 3),
             "last_word_s": round(words[-1]["t1"] - words[-1]["t0"], 3) if words else None,
             "pauses": info["pauses"], "speed": info["speed"], "dry_wpm": info.get("dry_wpm"), "carrier": info.get("carrier")}
        sc, terms = score_take(m, pick, v, ctx)
        m["score"], m["score_terms"] = sc, terms
        results.append((m, y, toks, info, wav))
        print(f"  {ln['id']:10s} {tid} {a['duration_s']:5.2f}s span {m['voiced_span_s']:.2f} F0 {a['median_f0_hz']} "
              f"rng {a['f0_range_st']} fin {a.get('final_move_st')} cer {c:.2f} lp {lp:.2f} score {sc:6.2f} | {hyp}", flush=True)
    best = min(results, key=lambda r: r[0]["score"])
    return best, results


def entry(ln, v, best, results, out_wav, out_mp3, voiced):
    m, y, toks, info, _ = best
    words = L.word_track(toks)
    mouth = L.mouth_cues(y, toks, end_shape=ln.get("end", "rest")) if (voiced and ln["cam"] in CUE_CAMS) else []
    others = sorted(results, key=lambda r: r[0]["score"])
    reason = "only take" if len(results) == 1 else (
        f"lowest score {m['score']} of {len(results)} takes (next {others[1][0]['take']} at {others[1][0]['score']}); "
        f"terms: " + ", ".join(f"{k} {vv}" for k, vv in m["score_terms"].items() if vv))
    e = {
        "id": ln["id"], "scene": ln["scene"], "speaker": v["name"], "speaker_slug": ln["speaker"],
        "text": ln["text"], "spoken_as": m["say"].replace("{", "<").replace("}", "s>"),
        "delivery": ln["delivery"], "tag": ln["tag"], "mode": ln["mode"], "voiced_in_cut": voiced,
        "on_camera": ln["cam"],
        **stage_fields(ln),
        "file": rel(out_wav), "mp3": rel(out_mp3),
        "duration_s": m["duration_s"], "frames_24": m["frames_24"], "voiced_span_s": m["voiced_span_s"],
        "take": m["take"], "takes_tried": len(results), "pick_reason": reason,
        "voice": voice_label(v), "voiceId": L.V.voice_id(v["blend"]), "model": MODEL,
        "processing": processing(v, info),
        "mouth": mouth, "words": words,
        "qa": {k: m[k] for k in ("lufs_i", "true_peak_dbtp", "clipped_samples", "median_f0_hz", "f0_range_st",
                                "final_move_st", "wpm", "asr", "cer", "logprob", "align_median_s") if k in m},
    }
    e["qa"]["target_lufs"] = v.get("lufs", CA.DIALOGUE_LUFS)
    if ln.get("voice") == "mas-manalt-vo":
        e["voice_desc"] = v.get("desc")
    if ln["mode"] == "post-popup":
        e.update(popup_fields(ln))
    if ln.get("master"):
        e["master"] = ln["master"]
    return e


def stage_fields(ln):
    """The draft 3.1 staging carried on every row."""
    return {"kind": ln["kind"], "side": ln["side"], "pov": ln["pov"], "shot": ln["shot"],
            "lip_sync": ln["kind"] != "post" and ln["cam"] in LIP_CAMS, "status": ln.get("status", "unchanged")}


def popup_fields(ln):
    chars = len(ln["text"].strip("\""))
    hold = max(1.5, chars / 14.0 + 0.5)
    beats = int(np.ceil(hold / L.BEAT))
    note = ("House rule: posts are pop-ups, never speeches. Unvoiced in the cut; this scratch read is for the "
            f"animatic / audio description only. Suggested on-screen hold >= {beats} beats ({beats * L.BEAT:.2f} s) at ~14 chars/s.")
    if ln.get("hold_beats"):
        beats = ln["hold_beats"]
        note = ("House rule: posts are pop-ups, never speeches. Unvoiced in the cut; this scratch read is for the "
                f"animatic / audio description only. Draft 3.1 sets the hold: {beats} beats ({beats * L.BEAT:.2f} s). {ln['hold_note']}")
    return {"popup_hold_beats": beats, "popup_note": note}


def refresh(e, ln, V_):
    """Carry the draft 3.1 staging onto a row that was not re-recorded this run (words, take and audio unchanged)."""
    e.update({"text": ln["text"], "delivery": ln["delivery"], "tag": ln["tag"], "mode": ln["mode"],
              "voiced_in_cut": ln["kind"] != "post", "on_camera": ln["cam"], **stage_fields(ln)})
    if ln["cam"] not in CUE_CAMS:
        e["mouth"] = []
    e["qa"].setdefault("target_lufs", voice_of(ln, V_).get("lufs", CA.DIALOGUE_LUFS))
    if ln["mode"] == "post-popup":
        e.update(popup_fields(ln))
    # keep the field order stable: staging next to on_camera
    keys = list(e.keys())
    head = keys[:keys.index("on_camera") + 1]
    st = ["kind", "side", "pov", "shot", "lip_sync", "status"]
    return {k: e[k] for k in head + st + [k for k in keys if k not in head and k not in st]}


def record_fallback(ln, v, V_, qa_all):
    """A recorded alternate wording (not a row: it rides on its line as `fallback`)."""
    fb = ln["fallback"]
    fid = ln["id"] + "-fallback"
    lnf = {"id": fid, "say": fb["say"], "text": fb["text"]}
    print("== fallback", fid, fb["text"], flush=True)
    ref = None
    if ln.get("voice") == "mas-manalt-vo":
        ref = vo_pace(fb["say"], V_)
        v = vo_voice(v, ref)
    best, results = record_takes(lnf, v, fb["takes"], ln.get("pick"), {}, os.path.join(ROOT, "takes", fid))
    qa_all[fid] = [dict({k: vv for k, vv in r[0].items() if k != "_contour"}) for r in results]
    m, y, toks = best[0], best[1], best[2]
    os.makedirs(os.path.join(ROOT, "fallback"), exist_ok=True)
    wav, mp3 = os.path.join(ROOT, "fallback", ln["id"] + ".wav"), os.path.join(ROOT, "fallback", ln["id"] + ".mp3")
    L.write(y, wav, mp3)
    d, _ = sf.read(mp3, dtype="float32")
    others = sorted(results, key=lambda r: r[0]["score"])
    return {"text": fb["text"], "spoken_as": fb["say"], "why": fb["why"], "file": rel(wav), "mp3": rel(mp3),
            "duration_s": m["duration_s"], "frames_24": m["frames_24"], "voiced_span_s": m["voiced_span_s"],
            "take": m["take"], "takes_tried": len(results),
            "pick_reason": f"lowest score {m['score']} of {len(results)} takes (next {others[1][0]['take']} at {others[1][0]['score']}); terms: "
                           + ", ".join(f"{k} {vv}" for k, vv in m["score_terms"].items() if vv),
            "words": L.word_track(toks),
            "qa": {**{k: m[k] for k in ("lufs_i", "true_peak_dbtp", "clipped_samples", "median_f0_hz", "f0_range_st",
                                         "final_move_st", "wpm", "asr", "cer", "logprob", "align_median_s") if k in m},
                   "mp3_lufs_i": round(L.V.lufs(d), 2), "target_lufs": v.get("lufs", CA.DIALOGUE_LUFS),
                   **({"pace_ref": ref, "span_vs_oncam": round(m["speech_span_s"] / ref["oncam_span_s"], 3)} if ref else {})},
            "alt_takes": [{"take": r[0]["take"], "file": rel(r[4]), "score": r[0]["score"], "spec": r[0]["spec"]} for r in others]}


def derive(ln, src, V_):
    """A line that is not read: another line's delivered take through a process. Only 'laptop' exists: his voice
    through the board's laptop speaker (sc 27). Writes wav/ + mp3/ (processed) and clean/ (the untouched copy)."""
    assert ln["derive"]["chain"] == "laptop"
    y, sr = sf.read(os.path.join(REPO, src["file"]), dtype="float32")
    chain = CA.laptop_speaker()
    z = L.V.apply_chain(np.concatenate([y, np.zeros(int(0.05 * sr), np.float32)]), sr, chain)[: len(y)]
    f = int(0.03 * sr)
    z[-f:] *= np.linspace(1, 0, f)
    z = L.V.normalise(z, target=CA.LAPTOP_LUFS)
    wav, mp3 = os.path.join(ROOT, "wav", ln["id"] + ".wav"), os.path.join(ROOT, "mp3", ln["id"] + ".mp3")
    L.write(z, wav, mp3)
    os.makedirs(os.path.join(ROOT, "clean"), exist_ok=True)
    cwav, cmp3 = os.path.join(ROOT, "clean", ln["id"] + ".wav"), os.path.join(ROOT, "clean", ln["id"] + ".mp3")
    shutil.copyfile(os.path.join(REPO, src["file"]), cwav)
    shutil.copyfile(os.path.join(REPO, src["mp3"]), cmp3)
    hyp, lp, asr_ws = L.asr_words(wav)
    d, _ = sf.read(mp3, dtype="float32")
    v = V_[ln["speaker"]]
    e = {"id": ln["id"], "scene": ln["scene"], "speaker": v["name"], "speaker_slug": ln["speaker"], "text": ln["text"],
         "spoken_as": src["spoken_as"], "delivery": ln["delivery"], "tag": ln["tag"], "mode": ln["mode"],
         "voiced_in_cut": True, "on_camera": ln["cam"], **stage_fields(ln),
         "derived_from": src["id"], "file": rel(wav), "mp3": rel(mp3),
         "clean": {"file": rel(cwav), "mp3": rel(cmp3), "lufs_i": src["qa"]["lufs_i"],
                   "note": f"the unprocessed {src['id']} take (dry, {src['qa']['lufs_i']:g} LUFS), for a mix that builds its own speaker"},
         "duration_s": round(len(z) / sr, 3), "frames_24": int(np.ceil(len(z) / sr * L.FPS)),
         "voiced_span_s": src["voiced_span_s"], "take": f"{src['id']} {src['take']}", "takes_tried": 0,
         "pick_reason": f"no new read (pov-changes §1.1): the delivered {src['id']} take ({src['take']}), processed",
         "voice": src["voice"] + " · through the board's laptop speaker", "voiceId": src["voiceId"], "model": src["model"],
         "processing": [f"source: {src['file']} (the delivered take, unchanged in time)"] + L.V.describe_chain(chain)
                       + [f"48 kHz / 24-bit; {CA.LAPTOP_LUFS:g} LUFS integrated (quieter than the room: "
                          f"{CA.DIALOGUE_LUFS - CA.LAPTOP_LUFS:g} LU under dialogue); true-peak ceiling -1.5 dBTP",
                          "no room added: the board's room tone and any call-codec colour are the mix's"],
         "mouth": [], "words": src["words"],
         "qa": {"lufs_i": round(L.V.lufs(z), 2), "true_peak_dbtp": round(L.V.true_peak_db(z), 2),
                "clipped_samples": int(np.sum(np.abs(z) >= 0.999)), "median_f0_hz": src["qa"].get("median_f0_hz"),
                "f0_note": "pitch numbers are the source take's: the 330 Hz high-pass removes the fundamental (heard as the missing fundamental)",
                "f0_range_st": src["qa"].get("f0_range_st"), "final_move_st": src["qa"].get("final_move_st"),
                "wpm": None, "asr": hyp, "cer": round(L.cer(ln["text"], hyp), 3), "logprob": round(lp, 3),
                "align_median_s": L.align_check([{"word": True, "t0": w["t0"]} for w in src["words"]], asr_ws),
                "mp3_lufs_i": round(L.V.lufs(d), 2), "mp3_true_peak_dbtp": round(L.V.true_peak_db(d), 2),
                "target_lufs": CA.LAPTOP_LUFS}}
    print(f"  {ln['id']} derived from {src['id']}: {e['qa']['lufs_i']} LUFS, TP {e['qa']['true_peak_dbtp']}, ASR '{hyp}'", flush=True)
    return e


def main():
    only = set(sys.argv[1:])
    V_ = voices()
    for d in ("wav", "mp3", "optional", "takes", "qa"):
        os.makedirs(os.path.join(ROOT, d), exist_ok=True)
    lj_path = os.path.join(ROOT, "lines.json")
    qa_path = os.path.join(ROOT, "qa", "qa.json")
    old = {e["id"]: e for e in json.load(open(lj_path))} if (only and os.path.exists(lj_path)) else {}
    qa_all = json.load(open(qa_path)) if (only and os.path.exists(qa_path)) else {}

    # the MADA master: one canned read shared by all three of his lines
    master = None
    need_master = (not only) or any(l.get("master") and l["id"] in only for l in LINES) or "a4-30-09" in only
    if need_master:
        ln_m = {"id": MASTER_MADA, "say": "Good question.", "text": "Good question."}
        print("== master", MASTER_MADA, flush=True)
        best, results = record_takes(ln_m, V_["mada"], MASTER_TAKES, MASTER_PICK, {}, os.path.join(ROOT, "takes", MASTER_MADA))
        master = (best, results)
        qa_all[MASTER_MADA] = [dict({k: vv for k, vv in r[0].items() if k != "_contour"}) for r in results]

    # the calm-off as a PAIR: every MADA master take x every MAS echo take
    echo = None
    if master and (not only or "a4-30-09" in only):
        ln_e = next(l for l in LINES if l["id"] == "a4-30-09")
        print("== echo", ln_e["id"], flush=True)
        _, e_res = record_takes(ln_e, V_["mas-manalt"], ln_e["takes"], ln_e["pick"], {}, os.path.join(ROOT, "takes", ln_e["id"]))
        best_pair = None
        for mi in master[1]:
            for ei in e_res:
                r = L.contour_corr(mi[0].get("_contour"), ei[0].get("_contour"))
                rng_d = abs((mi[0].get("f0_range_st") or 0) - (ei[0].get("f0_range_st") or 0))
                tot = mi[0]["score"] + ei[0]["score"] + 4.0 * (1.0 - (r if r is not None else 0.0)) + 0.3 * rng_d
                if best_pair is None or tot < best_pair[0]:
                    best_pair = (tot, mi, ei, r)
        tot, mi, ei, r = best_pair
        for x in (mi, ei):
            x[0]["pair_score"], x[0]["match_r"] = round(tot, 3), r
        ei[0]["score_terms"]["pair_contour_match"] = round(4.0 * (1.0 - r), 3)
        master = (mi, master[1])
        echo = (ei, e_res)
        print(f"   calm-off pair: MADA {mi[0]['take']} x MAS {ei[0]['take']}  r={r}  pair score {tot:.2f}", flush=True)
        qa_all["a4-30-09"] = [dict({k: vv for k, vv in x[0].items() if k != "_contour"}) for x in e_res]
        qa_all[MASTER_MADA] = [dict({k: vv for k, vv in x[0].items() if k != "_contour"}) for x in master[1]]

    new = {}
    for ln in LINES:
        if only and ln["id"] not in only and not (ln.get("master") and need_master):
            continue
        if ln.get("derive"):
            continue  # derived lines are processed after the reads they come from
        v = voice_of(ln, V_)
        voiced = ln["kind"] != "post"
        sub = "optional" if not voiced else None
        out_wav = os.path.join(ROOT, sub or "wav", ln["id"] + ".wav")
        out_mp3 = os.path.join(ROOT, sub or "mp3", ln["id"] + ".mp3")
        print("==", ln["id"], v["name"], ln["text"], flush=True)
        if ln.get("master"):
            best, results = master
        elif ln["id"] == "a4-30-09" and echo:
            best, results = echo
        else:
            ctx = {}
            pk = ln.get("pick")
            if pk and pk.get("below"):
                ctx["below_f0"] = (new.get(pk["below"]) or old.get(pk["below"], {})).get("qa", {}).get("median_f0_hz")

            takes = ln.get("takes") or [{"seed": 1}]
            keep = os.path.join(ROOT, "takes", ln["id"])
            if ln.get("voice") == "mas-manalt-vo":
                pace_ref = vo_pace(ln["say"], V_)
                v = vo_voice(v, pace_ref)
            best, results = record_takes(ln, v, takes, pk, ctx, keep)
            qa_all[ln["id"]] = [dict({k: vv for k, vv in r[0].items() if k != "_contour"}) for r in results]
            if len(takes) == 1 or not ln.get("key"):
                shutil.rmtree(keep, ignore_errors=True)  # keep alternate takes only for the key comedic lines
        m, y = best[0], best[1]
        L.write(y, out_wav, out_mp3)
        d, _ = sf.read(out_mp3, dtype="float32")
        e = entry(ln, v, best, results, out_wav, out_mp3, voiced)
        e["qa"]["mp3_lufs_i"] = round(L.V.lufs(d), 2)
        e["qa"]["mp3_true_peak_dbtp"] = round(L.V.true_peak_db(d), 2)
        if ln.get("key") and len(results) > 1:
            e["alt_takes"] = [{"take": r[0]["take"], "file": rel(r[4]), "score": r[0]["score"], "spec": r[0]["spec"]}
                              for r in sorted(results, key=lambda r: r[0]["score"])]
        if ln["id"] == "a4-30-09" and master:
            e["qa"]["contour_r_vs_mada"] = m.get("match_r")
            e["pair"] = {"mada_take": master[0][0]["take"], "pair_score": m.get("pair_score")}
        if ln.get("master") and master:
            e["qa"]["contour_r_vs_mas_echo"] = master[0][0].get("match_r")
        if ln.get("below") or (ln.get("pick") or {}).get("below"):
            e["qa"]["below_ref"] = ln["pick"]["below"]
        if ln.get("voice") == "mas-manalt-vo":
            e["qa"]["pace_ref"] = pace_ref
            e["qa"]["span_vs_oncam"] = round(m["speech_span_s"] / pace_ref["oncam_span_s"], 3)
            e["voice"] = voice_label(v) + " (x on-camera read)"
        if ln.get("fallback"):
            e["fallback"] = record_fallback(ln, V_[ln["voice"]], V_, qa_all)
        new[ln["id"]] = e

    for ln in LINES:
        if ln.get("derive") and (not only or ln["id"] in only or ln["derive"]["from"] in only):
            print("==", ln["id"], "derived", flush=True)
            src = new.get(ln["derive"]["from"]) or old[ln["derive"]["from"]]
            new[ln["id"]] = derive(ln, src, V_)

    order = [l["id"] for l in LINES]
    by_id = {l["id"]: l for l in LINES}
    merged = {**old, **new}
    for i in order:  # every row carries the draft 3.1 staging, re-recorded or not
        if i in merged and i not in new:
            merged[i] = refresh(merged[i], by_id[i], V_)
    gone = sorted(set(merged) - set(order))
    if gone:
        print("dropped from lines.json (not in draft 3.1; see lines_a4.RETIRED):", ", ".join(gone), flush=True)
    out = [merged[i] for i in order if i in merged]
    json.dump(out, open(lj_path, "w"), indent=1, ensure_ascii=False)
    json.dump(qa_all, open(qa_path, "w"), indent=1, ensure_ascii=False, default=float)
    print(f"wrote {lj_path} ({len(out)} lines)", flush=True)


if __name__ == "__main__":
    main()
