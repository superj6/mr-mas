"""record_32.py - re-record Ep1 Act Four for DRAFT 3.2 (the tightening pass) at pace, pick takes by measurement, export.

Run:  HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record_32.py [line-id ...]
      (no ids = the whole act, after archiving the 3.1 deliverables; ids = re-record just those and merge into lines.json)

What it does (tighten-changes §1-§4):
  * archives the 3.1 delivered files (retired/3.1/) and moves the 8 removed lines to retired/ (files + alternates);
  * re-takes EVERY voiced line: span-targeted Kokoro speed (a4pace), light Rubber Band compression only at the speed
    clamp (<= x1.10), 20 ms / 40 ms trims, internal pauses <= 0.3 s (the memo's 0.4 s), hard cut-offs;
  * scores takes on the 3.1 terms (ASR, lane, final contour, creak, contour matches) plus pace: the span against the §2
    target (+-10%), the pull toward the line's aim, compression used, and the longest internal gap;
  * MADA's master read and MAS's echo are chosen as a pair; 'More. Soon.' is matched to a4-27-04's last two words
    (a lifted-words candidate plus fresh reads); the V.O. is paced against his on-camera read of the same words;
  * re-derives the laptop 'super.' (a4-27-00) from the new a4-26-01, and gives 'Share what?' its call filter;
  * writes overlap placements (overlap_prev_s, overlap_place_at_s) and fixed gaps (gap_prev_s) from the word tracks;
  * restages the 7 unvoiced posts on the 3.2 board (a4-26a-01 moves to sc 27); their scratch reads are untouched.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import torch

torch.set_num_threads(4)  # a shared CPU box: stay polite
import numpy as np
import soundfile as sf

import a4lib as L
import a4pace as P
import cast_a4 as CA
import lines_a4_32 as S
from record import voices as voices_31, rel, score_take, MODEL, LIP_CAMS, CUE_CAMS

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
DATE = "2026-09-25"
SR = L.SR
FPS = L.FPS


def log(*a):
    print(*a, flush=True)


# ============================================================================================ voices
def call_filter():
    """NELEH on the call (27.05b, 'Share what?'): a light call-app colour, thinner than the laptop speaker: a gentle band
    (HPF 200 Hz, LPF 7 kHz, single poles), a small 1.8 kHz presence lift, light levelling. No saturation."""
    return [{"fx": "hpf", "hz": 200}, {"fx": "lpf", "hz": 7000}, {"fx": "peak", "hz": 1800, "db": 1.5, "q": 1.0},
            {"fx": "comp", "th": -22, "ratio": 2.5, "att": 5, "rel": 90}]


CALL_LUFS = -18.0  # §4 row 3: NELEH ~2 dB under RIMA


def voices_32():
    V = voices_31()
    V["mas-manalt-vo"] = dict(CA.RETURNING["mas-manalt-vo"])
    for slug, v in V.items():
        v["speed_31"] = v["speed"]
        v["speed"] = S.SPEED_32.get(slug, v["speed"])
    return V


def voice_label(v, sp):
    return f"{L.V.voice_id(v['blend'])} (Kokoro-82M stock) · {v['cand']} · speed {sp:.3f}"


def speed_clamp(v):
    if v.get("lufs") == CA.VO_LUFS:  # the V.O. voice: paced to its wpm band (lines_a4_32.VO_RATIO)
        return S.VO_SPEED_FLOOR, min(v["speed"] * 1.25, 1.45)
    return v["speed"] * 0.85, min(v["speed"] * 1.25, 1.45)


# ============================================================================================ one take
def word_count(toks):
    return len([t for t in toks if t["word"]])


def aim_of(ln, n_words):
    a = S.PACE_AIM.get(ln["speaker"], 1.0) if ln["kind"] == "dialogue" and n_words >= 2 else 1.0
    if ln.get("aim"):
        return ln["aim"]
    return ln["target"] * a


def fspan(y24, toks, v, cut):
    """The audible span of the take as delivered (chain, trims, level), which is what the target is: the dry 24 kHz read
    measures ~0.03-0.1 s shorter (the chain's levelling lifts the decays over the -40 dB line)."""
    return P.span(P.finish(y24, toks, v, cutoff=bool(cut))[0], SR)


def render_take(ln, v, spec, sp_line, aim):
    """One take: read at the line's solved speed (x the take's speed factor), re-read once at its own solved speed if its
    context moved it > 5% off the aim, then compress (<= x1.10) only if the speed clamp stops it short."""
    say = spec.get("say", ln["say"])
    text, breaks = L.parse_say(say)
    cut = ln.get("cutoff")
    cont = spec.get("tail_override", cut[1]) if (cut and cut[0] == "tail") else None
    lo, hi = speed_clamp(v)
    sf_ = spec.get("speed", 1.0)          # a deliberate pace variant: the take is aimed at aim / factor, not re-solved to aim
    tsm_f = spec.get("tsm", 1.0)          # a slower read (aim x tsm) brought back to the aim by light compression
    aim_t = aim / sf_ * tsm_f
    sp = float(np.clip(sp_line * sf_, lo, hi))
    reads = 0
    for _ in range(2):
        y, toks, info = P.dry_take(text, breaks, v["blend"], sp, spec.get("seed", 1), carrier=spec.get("carrier"),
                                   tail=spec.get("tail"), cutoff=cut, cont=cont)
        reads += 1
        got = fspan(y, toks, v, cut)
        if abs(got / aim_t - 1) <= 0.05 or reads == 2:
            break
        sp_new = float(np.clip(P.solve_speed(sp, got, aim_t, info["pause_total"]), lo, hi))
        if abs(sp_new - sp) < 0.005:
            break
        sp = sp_new
    factor = 1.0
    if tsm_f > 1.0:                               # the deliberate slower-read-then-compress take
        factor = float(np.clip(got / (aim / sf_), 1.0, P.TSM_MAX))
        y, toks = P.compress(y, toks, factor)
    elif got > aim_t * 1.03 and sp >= hi - 1e-3:  # compression only where the speed solver hit its clamp
        factor = float(min(P.TSM_MAX, got / aim_t))
        y, toks = P.compress(y, toks, factor)
    info.update({"speed": round(sp, 3), "tsm": round(factor, 3), "reads": reads, "dry_span": round(got, 3),
                 "text_spoken": text, "carrier": spec.get("carrier"), "tail": spec.get("tail"), "cont": cont})
    lufs = CALL_LUFS if ln.get("chain_extra") == "call" else v.get("lufs", CA.DIALOGUE_LUFS)
    return y, toks, info, lufs


def probe_speed(ln, v, aim):
    """Speed that puts the plain read (seed 1, no carrier) on the aim: one probe at the pack's 3.2 start speed."""
    text, breaks = L.parse_say(ln["say"])
    cut = ln.get("cutoff")
    cont = cut[1] if (cut and cut[0] == "tail") else None
    y, toks, info = P.dry_take(text, breaks, v["blend"], v["speed"], 1, cutoff=cut, cont=cont)
    got = fspan(y, toks, v, cut)
    lo, hi = speed_clamp(v)
    sp = float(np.clip(P.solve_speed(v["speed"], got, aim, info["pause_total"]), lo, hi))
    log(f"   probe: {v['speed']:.3f} -> span {got:.3f} s; aim {aim:.3f} s -> speed {sp:.3f}")
    return sp


# ============================================================================================ scoring
def score32(m, ln, v, ctx):
    pick = dict(ln.get("pick") or {})
    sc, terms = score_take(m, pick, v, ctx)
    T, aim, sp = ln["target"], m["aim_s"], m["voiced_span_s"]
    if ln["kind"] == "vo":
        slot = S.VO_SLOT[ln["id"]][0] if ln["id"] in S.VO_SLOT else None
        if slot:
            terms["vo_slot"] = round(30.0 * max(0.0, sp - (slot - 0.03)), 3)
        terms["span_floor"] = round(30.0 * max(0.0, T * (1 - S.TOL) - sp), 3)
        if m.get("wpm_span"):  # the director's V.O. band (~135-145 wpm), where the slot allows
            terms["vo_wpm"] = round(0.05 * max(0.0, 135 - m["wpm_span"], m["wpm_span"] - 145), 3)
        if ctx.get("oncam_span"):
            r = sp / ctx["oncam_span"]
            m["vo_ratio"] = round(r, 3)
            terms["vo_ratio"] = round(6.0 * max(0.0, S.VO_RATIO[0] - r, r - S.VO_RATIO[1]), 3)
    else:
        terms["span_tol"] = round(30.0 * max(0.0, abs(sp / T - 1) - S.TOL), 3)
    terms["span_aim"] = round(3.0 * abs(sp / aim - 1), 3)
    terms["tsm"] = round(8.0 * (m["tsm"] - 1.0), 3)
    cap = 0.42 if ln["id"] == "a4-31-03" else 0.32
    terms["internal_gap"] = round(10.0 * max(0.0, m["longest_gap_s"] - cap), 3)
    if pick.get("below") and ctx.get("below_f0") and m.get("median_f0_hz"):  # 'a shade under' is the direction: weigh it
        terms["below_direction"] = round(2.0 * max(0.0, 12 * np.log2(m["median_f0_hz"] / ctx["below_f0"])), 3)
    if ln["speaker"] == "mas-manalt" and ln["kind"] == "dialogue" and m["n_words"] == 1:
        terms["one_word_len"] = round(20.0 * max(0.0, sp - 0.65), 3)   # one-word Mas lines <= 0.65 s audible
    terms = {k: x for k, x in terms.items() if x}
    return round(sum(terms.values()), 3), terms


def measure(ln, y, toks, info, wav, spec, aim):
    a = L.analyse(y, toks)
    hyp, lp, asr_ws = L.asr_words(wav)
    say = spec.get("say", ln["say"])
    ref = ln["text"].replace("—", "").replace("\"", "").replace("…", " ") if ln.get("cutoff") or ln.get("splice") else L.parse_say(say)[0]
    words = [t for t in toks if t["word"]]
    first, last = P.audible(y, SR)
    m = {**a, "spec": spec, "say": say, "asr": hyp, "cer": round(L.cer(ref, hyp), 3), "logprob": round(lp, 3),
         "align_median_s": L.align_check(toks, asr_ws), "voiced_span_s": round(last - first, 3),
         "audible_in_s": round(first, 3), "audible_out_s": round(last, 3),
         "last_word_s": round(words[-1]["t1"] - words[-1]["t0"], 3) if words else None,
         "pauses": info.get("pauses", []), "speed": info.get("speed"), "tsm": info.get("tsm", 1.0), "reads": info.get("reads"),
         "carrier": info.get("carrier"), "n_words": len(words), "aim_s": round(aim, 3), "target_s": ln["target"],
         "longest_gap_s": round(P.longest_gap(y, SR), 3)}
    m["wpm_span"] = P.wpm(len(words), m["voiced_span_s"])
    return m


def record_line(ln, v, ctx, keep_dir, aim, sp_line=None):
    os.makedirs(keep_dir, exist_ok=True)
    if sp_line is None:
        sp_line = probe_speed(ln, v, aim)
    results = []
    t0 = time.time()
    for i, spec in enumerate(ln["takes"], 1):
        y24, toks, info, lufs = render_take(ln, v, spec, sp_line, aim)
        y, toks = P.finish(y24, toks, dict(v, chain=v["chain"]), cutoff=bool(ln.get("cutoff")), lufs=v.get("lufs", CA.DIALOGUE_LUFS))
        tid = f"t{i:02d}"
        wav = os.path.join(keep_dir, f"{ln['id']}_{tid}.wav")
        L.write(y, wav, None)
        m = measure(ln, y, toks, info, wav, spec, aim)
        m["take"] = tid
        sc, terms = score32(m, ln, v, ctx)
        m["score"], m["score_terms"] = sc, terms
        results.append((m, y, toks, info, wav))
        log(f"  {ln['id']:10s} {tid} sp {info['speed']:.3f} x{info['tsm']:.2f} span {m['voiced_span_s']:.2f} (T {ln['target']:.2f}, aim {aim:.2f}) "
            f"wpm {m['wpm_span']} F0 {m['median_f0_hz']} rng {m['f0_range_st']} fin {m.get('final_move_st')} gap {m['longest_gap_s']:.2f} "
            f"cer {m['cer']:.2f} lp {m['logprob']:.2f} score {sc:6.2f} | {m['asr']}")
    best = min(results, key=lambda r: r[0]["score"])
    log(f"   -> {best[0]['take']} ({time.time() - t0:.0f} s)")
    return best, results, sp_line


# ============================================================================================ special candidates
def splice_more_soon(src_entry, gap=0.12):
    """'More. Soon.' lifted from the delivered a4-27-04 take: 'more' and 'soon' cut at the quietest 5 ms frame between
    them, a 0.12 s stop inserted (3 ms ramps), re-trimmed and re-levelled. Exactly her read of those two words."""
    y, sr = sf.read(os.path.join(REPO, src_entry["file"]), dtype="float32")
    ws = {w["w"].lower(): w for w in src_entry["words"]}
    more, soon = ws["more"], ws["soon"]
    env, hop = L._env(y, sr)
    a = int(max(0.0, min(more["t1"], soon["t0"]) - 0.05) * sr / hop)
    b = max(a + 1, int((soon["t0"] + 0.03) * sr / hop))
    k = (a + int(np.argmin(env[a:b]))) * hop
    # head of 'more': the quietest frame in the 60 ms before its onset ('share' -> 'more' is a nasal onset)
    a0 = int(max(0.0, more["t0"] - 0.06) * sr / hop)
    b0 = max(a0 + 1, int((more["t0"] + 0.01) * sr / hop))
    k0 = (a0 + int(np.argmin(env[a0:b0]))) * hop
    f = int(0.003 * sr)
    w1, w2 = y[k0:k].copy(), y[k:].copy()
    w1[:int(0.004 * sr)] *= np.linspace(0, 1, int(0.004 * sr))
    w1[-f:] *= np.linspace(1, 0, f)
    w2[:f] *= np.linspace(0, 1, f)
    z = np.concatenate([np.zeros(int(0.02 * sr), np.float32), w1, np.zeros(int(gap * sr), np.float32), w2])
    t_more0, t_more1 = 0.02 + (more["t0"] * sr - k0) / sr, 0.02 + (k - k0) / sr
    t_soon0 = t_more1 + gap + max(0.0, soon["t0"] - k / sr)
    toks = [{"text": "More", "ph": "mˈɔɹ", "t0": max(0.0, t_more0), "t1": t_more1, "word": True},
            {"text": ".", "ph": ".", "t0": t_more1, "t1": t_more1, "word": False},
            {"text": "Soon", "ph": "sˈun", "t0": t_soon0, "t1": t_soon0 + (soon["t1"] - soon["t0"]), "word": True},
            {"text": ".", "ph": ".", "t0": t_soon0 + (soon["t1"] - soon["t0"]), "t1": t_soon0 + (soon["t1"] - soon["t0"]), "word": False}]
    z, toks, _ = P._trim(z, sr, toks, -52, P.HEAD_PAD, P.TAIL_PAD)
    z = L.V.normalise(z, target=CA.DIALOGUE_LUFS)
    toks = L.clip_words(z, toks)
    return z, toks, (k0 / sr, k / sr)


def segment_contour(entry, w0, w1):
    y, sr = sf.read(os.path.join(REPO, entry["file"]), dtype="float32")
    ws = {w["w"].lower(): w for w in entry["words"]}
    a, b = ws[w0]["t0"], ws[w1]["t1"]
    seg = y[int(max(0.0, a - 0.02) * sr): int(min(len(y) / sr, b + 0.04) * sr)]
    return L.analyse(seg, [{"word": True, "t0": 0.0, "t1": len(seg) / sr, "text": "x", "ph": ""}])


# ============================================================================================ rows
def stage_fields(ln):
    kind = ln["kind"]
    cam = ln["cam"]
    return {"kind": kind, "side": ln.get("side", "none"), "pov": ln["pov"], "shot": ln["shot"], "shot_id": ln["shot_id"],
            "cue": ln["cue"], "lip_sync": kind != "post" and cam in LIP_CAMS, "status": ln["status"]}


def processing32(v, info, ln, lufs):
    out = L.V.describe_chain(v["chain"])
    if ln.get("chain_extra") == "call":
        out += ["then the call filter: " + "; ".join(L.V.describe_chain(call_filter()))]
    out.append("DRY: no reverb/slap (rooms are mix sends)")
    out.append(f"Kokoro speed {info['speed']:.3f} (3.2 start {v['speed']:.2f}; 3.1 cast {v['speed_31']:.2f}), solved for the audible span"
               + (f"; {info['reads']} reads" if info.get("reads", 1) > 1 else ""))
    if info.get("tsm", 1.0) > 1.0005:
        out.append(f"time-compression x{info['tsm']:.3f} (Rubber Band R3, formants kept): the speed solver hit its clamp")
    if info.get("carrier"):
        out.append(f"context-carrier read, cut at the quietest 5 ms frame before the line (carrier: '{info['carrier']}')")
    if info.get("tail"):
        out.append(f"tail-carrier read (keeps the final level), cut at the quietest 5 ms frame after the line (tail: '{info['tail']}')")
    if ln.get("cutoff"):
        c = ln["cutoff"]
        out.append(f"CUT-OFF: read on into '{info.get('cont')}' and cut at the closure before it; ends on the cut consonant"
                   if c[0] == "tail" else f"CUT-OFF: cut inside '{c[1]}' after {c[2]} phonemes")
        out.append("hard stop: re-cut after the chain, 3 ms de-click ramp, no tail pad, no fade")
    for p in info.get("pauses", []):
        out.append(f"pause after word {p['after_word']}: {p['tts_s']:.2f} s -> {p['final_s']:.2f} s (target {p['target_s']:.2f})")
    out += [f"silence trim (-52 dB rel. peak; {int(P.HEAD_PAD * 1000)} ms head / {0 if ln.get('cutoff') else int(P.TAIL_PAD * 1000)} ms tail)",
            f"48 kHz / 24-bit; {lufs:g} LUFS integrated; true-peak ceiling -1.5 dBTP"]
    return out


def word_track32(toks):
    return [{"w": t["text"], "t0": round(t["t0"], 3), "t1": round(t["t1"], 3), "f0": int(round(t["t0"] * FPS)),
             "f1": int(round(t["t1"] * FPS)), "ph": t.get("ph", "")} for t in toks if t["word"]]


def entry32(ln, v, best, results, out_wav, out_mp3, extra=None):
    m, y, toks, info, _ = best
    mouth = L.mouth_cues(y, toks, end_shape=ln.get("end", "rest")) if ln["cam"] in CUE_CAMS else []
    others = sorted(results, key=lambda r: r[0]["score"])
    reason = "only take" if len(results) == 1 else (
        f"lowest score {m['score']} of {len(results)} takes (next {others[1][0]['take']} at {others[1][0]['score']}); "
        f"terms: " + (", ".join(f"{k} {vv}" for k, vv in m["score_terms"].items()) or "none"))
    lufs = CALL_LUFS if ln.get("chain_extra") == "call" else v.get("lufs", CA.DIALOGUE_LUFS)
    e = {
        "id": ln["id"], "scene": ln["scene"], "speaker": v["name"], "speaker_slug": ln["speaker"], "text": ln["text"],
        "spoken_as": m["say"].replace("{", "<").replace("}", "s>") + (f" [cut before: {info['cont']}]" if info.get("cont") else ""),
        "delivery": ln["delivery"], "tag": ln["tag"], "mode": ln["mode"], "voiced_in_cut": True, "on_camera": ln["cam"],
        **stage_fields(ln),
        "target_span_s": ln["target"], "file": rel(out_wav), "mp3": rel(out_mp3),
        "duration_s": round(len(y) / SR, 3), "frames_24": int(np.ceil(len(y) / SR * FPS)), "voiced_span_s": m["voiced_span_s"],
        "span_vs_target": round(m["voiced_span_s"] / ln["target"], 3),
        "pace": {"words": m["n_words"], "wpm": m["wpm_span"], "speed": info["speed"], "speed_start_32": v["speed"],
                 "speed_31": v["speed_31"], "tsm": info.get("tsm", 1.0), "aim_s": m["aim_s"], "target_s": ln["target"],
                 "longest_internal_gap_s": m["longest_gap_s"], "audible_in_s": m["audible_in_s"], "audible_out_s": m["audible_out_s"]},
        "take": m["take"], "takes_tried": len(results), "pick_reason": reason,
        "voice": voice_label(v, info["speed"]), "voiceId": L.V.voice_id(v["blend"]), "model": MODEL,
        "processing": processing32(v, info, ln, lufs), "mouth": mouth, "words": word_track32(toks),
        "qa": {k: m[k] for k in ("lufs_i", "true_peak_dbtp", "clipped_samples", "median_f0_hz", "f0_range_st", "final_move_st",
                                "asr", "cer", "logprob", "align_median_s") if k in m},
    }
    e["qa"]["wpm"] = m["wpm_span"]
    e["qa"]["target_lufs"] = lufs
    if ln.get("cutoff"):
        e["cutoff"] = {"type": ln["cutoff"][0], "ends_on": ln["text"].rstrip("—").split()[-1] + "—",
                       "note": "hard stop on the cut consonant: no tail pad, no fade (3 ms de-click ramp)"}
    if ln.get("key") and len(results) > 1:
        e["alt_takes"] = [{"take": r[0]["take"], "file": rel(r[4]), "score": r[0]["score"], "span_s": r[0]["voiced_span_s"],
                           "spec": r[0]["spec"]} for r in others]
    if ln.get("master"):
        e["master"] = ln["master"]
    if extra:
        e.update(extra)
    return e


def export(ln, e_best, y, out_sub="wav"):
    out_wav = os.path.join(ROOT, out_sub, ln["id"] + ".wav")
    out_mp3 = os.path.join(ROOT, "mp3", ln["id"] + ".mp3")
    L.write(y, out_wav, out_mp3)
    return out_wav, out_mp3


# ============================================================================================ archive / retire
def archive_31():
    """Once: the 3.1 deliverables move to retired/3.1/ (A/B for the ear pass); removed lines move to retired/."""
    dst = os.path.join(ROOT, "retired", "3.1")
    if os.path.exists(dst):
        log("archive: retired/3.1 exists, skipping")
        return
    os.makedirs(dst)
    removed = {r[0] for r in S.REMOVED_32}
    for sub in ("wav", "mp3"):
        os.makedirs(os.path.join(dst, sub))
        for f in sorted(os.listdir(os.path.join(ROOT, sub))):
            lid = os.path.splitext(f)[0]
            src = os.path.join(ROOT, sub, f)
            if lid in removed:
                shutil.move(src, os.path.join(ROOT, "retired", f))
            else:
                shutil.move(src, os.path.join(dst, sub, f))
    os.makedirs(os.path.join(ROOT, "retired", "takes"), exist_ok=True)
    os.makedirs(os.path.join(dst, "takes"))
    for d in sorted(os.listdir(os.path.join(ROOT, "takes"))):
        src = os.path.join(ROOT, "takes", d)
        shutil.move(src, os.path.join(ROOT, "retired", "takes", d) if d in removed else os.path.join(dst, "takes", d))
    for sub in ("fallback", "clean"):
        if os.path.isdir(os.path.join(ROOT, sub)):
            shutil.move(os.path.join(ROOT, sub), os.path.join(dst, sub))
    for f in ("lines.json", "qa/qa.json", "qa/final_cast.json", "reel_cues.json", "act4-dialogue-reel.mp3"):
        if os.path.exists(os.path.join(ROOT, f)):
            shutil.copyfile(os.path.join(ROOT, f), os.path.join(dst, os.path.basename(f)))
    for sub in ("wav", "mp3", "takes", "fallback", "clean"):
        os.makedirs(os.path.join(ROOT, sub), exist_ok=True)
    log("archive: 3.1 deliverables -> retired/3.1/; removed lines -> retired/")


# ============================================================================================ derived lines
def derive_laptop(ln, src, V_):
    from record import derive
    ln31 = dict(ln, cam="speaker", mode="speaker", side="none", derive={"from": src["id"], "chain": "laptop"})
    e = derive(ln31, src, V_)
    e.update(stage_fields(ln))
    e["target_span_s"] = ln["target"]
    e["span_vs_target"] = round(e["voiced_span_s"] / ln["target"], 3)
    e["pace"] = dict(src["pace"], note="a copy of a4-26-01 (not a read)")
    e["pick_reason"] = f"no new read (tighten-changes §1.4 'rederive'): the delivered {src['id']} take ({src['take']}), processed"
    e["delivery"] = ln["delivery"]
    e["tag"] = ln["tag"]
    return e


def call_version(e, y):
    """'Share what?': the dry read goes to clean/; wav/ + mp3/ get the call filter at -18 LUFS."""
    cwav, cmp3 = os.path.join(ROOT, "clean", e["id"] + ".wav"), os.path.join(ROOT, "clean", e["id"] + ".mp3")
    L.write(y, cwav, cmp3)
    z = L.V.apply_chain(np.concatenate([y, np.zeros(int(0.03 * SR), np.float32)]), SR, call_filter())[: len(y)]
    f = int(0.01 * SR)
    z[-f:] *= np.linspace(1, 0, f)
    z = L.V.normalise(z, target=CALL_LUFS)
    return z, {"file": rel(cwav), "mp3": rel(cmp3), "lufs_i": round(L.V.lufs(y), 2),
               "note": "the dry read (-16 LUFS), for a mix that builds its own call chain"}


# ============================================================================================ placement
def word_of(entry, w):
    return next(x for x in entry["words"] if x["w"].lower().startswith(w.lower()))


def placements(out_by_id):
    """overlap_prev_s: seconds of audible overlap with the previous voiced line (its audible end minus this line's audible
    start). overlap_place_at_s: where this WAV's t=0 sits on the previous WAV's clock. gap_prev_s: a fixed gap."""
    voiced = [i for i in S.ORDER_32 if i in out_by_id and out_by_id[i]["voiced_in_cut"]]
    for j, lid in enumerate(voiced):
        e = out_by_id[lid]
        ln = S.BY_ID_32.get(lid)
        if not ln or j == 0:
            continue
        prev = out_by_id[voiced[j - 1]]
        p_out = prev["pace"]["audible_out_s"]
        me_in = e["pace"]["audible_in_s"]
        if ln.get("overlap"):
            o = ln["overlap"]
            if o[0] == "prev_end":
                start = p_out - o[1]
                anchor = f"{o[1] * FPS:.0f} f before {prev['id']}'s audible end"
            elif o[0] == "in_word":
                w = word_of(prev, o[1])
                start = w["t0"] + o[2]
                anchor = f"{o[2] * FPS:.0f} f into '{o[1]}' ({prev['id']})"
            else:
                w = word_of(prev, o[1])
                sp = L.phoneme_spans({"ph": w["ph"], "t0": w["t0"], "t1": w["t1"]})
                start = sp[min(o[2], len(sp) - 1)][1]
                anchor = f"on the stressed syllable of '{o[1]}' ('-{''.join(s[0] for s in sp[o[2]:])}', {prev['id']})"
            e["overlap_prev_s"] = round(p_out - start, 3)
            e["overlap_prev_frames"] = int(round((p_out - start) * FPS))
            e["overlap_with"] = prev["id"]
            e["overlap_place_at_s"] = round(start - me_in, 3)
            e["overlap_anchor"] = anchor
        elif ln.get("gap") is not None:
            e["gap_prev_s"] = ln["gap"]
            e["gap_with"] = prev["id"]
            e["gap_place_at_s"] = round(p_out + ln["gap"] - me_in, 3)


def sync_marks(e, ln):
    if not ln.get("sync"):
        return
    out = {}
    for w in ln["sync"]:
        try:
            x = word_of(e, w)
        except StopIteration:
            continue
        out[w] = {"t0": x["t0"], "f0": x["f0"], "t1": x["t1"], "f1": x["f1"]}
        if w == "gets":
            sp = L.phoneme_spans({"ph": x["ph"], "t0": x["t0"], "t1": x["t1"]})
            tt = next((s for s in sp if s[0] == "t"), None)
            if tt:
                out[w]["t_of_gets_s"] = round(tt[1], 3)
                out[w]["t_of_gets_f"] = int(round(tt[1] * FPS))
    e["sync"] = out


# ============================================================================================ main
def test(ids):
    """--test: record the given ids into the scratchpad (nothing in the project is touched) and print the picks."""
    V_ = voices_32()
    out = os.environ.get("A4_TEST_DIR", "/tmp/a4test")
    for lid in ids:
        ln = S.BY_ID_32[lid]
        v = V_[ln.get("voice", ln["speaker"])]
        n_words = len(L._words_of(L.parse_say(ln["say"])[0]))
        best, results, sp = record_line(ln, v, {}, os.path.join(out, lid), aim_of(ln, n_words))
        log(f"PICK {lid}: {best[0]['take']} span {best[0]['voiced_span_s']} terms {best[0]['score_terms']}")


def main():
    if "--test" in sys.argv:
        return test([a for a in sys.argv[1:] if not a.startswith("-")])
    only = set(a for a in sys.argv[1:] if not a.startswith("-"))
    t_start = time.time()
    V_ = voices_32()
    if not only:
        archive_31()
    lj = os.path.join(ROOT, "lines.json")
    qa_path = os.path.join(ROOT, "qa", "qa.json")
    old = {e["id"]: e for e in json.load(open(lj))} if os.path.exists(lj) else {}
    qa_all = json.load(open(qa_path)) if (only and os.path.exists(qa_path)) else {}
    new = {}

    def want(i):
        return not only or i in only

    def keep_takes(ln, keep):
        if not ln.get("key"):
            shutil.rmtree(keep, ignore_errors=True)

    # ---- 1. the MADA master x the MAS echo, as a pair
    ln_m = S.BY_ID_32["a4-25-02"]
    ln_e = S.BY_ID_32["a4-30-09"]
    if want("a4-25-02") or want("a4-30-08") or want("a4-30-09"):
        mspec = dict(ln_m, id=S.MASTER_MADA_32, takes=S.MASTER_TAKES_32,
                     pick={"range_max": 9.0, "final": "fall", "lane": True, "flat": True}, key=True)
        log("== master", S.MASTER_MADA_32)
        _, m_res, _ = record_line(mspec, V_["mada"], {}, os.path.join(ROOT, "takes", S.MASTER_MADA_32), aim_of(mspec, 2))
        log("== echo a4-30-09")
        _, e_res, _ = record_line(ln_e, V_["mas-manalt"], {}, os.path.join(ROOT, "takes", "a4-30-09"), aim_of(ln_e, 2))
        best = None
        for mi in m_res:
            for ei in e_res:
                r = L.contour_corr(mi[0].get("_contour"), ei[0].get("_contour"))
                rng_d = abs((mi[0].get("f0_range_st") or 0) - (ei[0].get("f0_range_st") or 0))
                tot = mi[0]["score"] + ei[0]["score"] + 4.0 * (1.0 - (r if r is not None else 0.0)) + 0.3 * rng_d
                if best is None or tot < best[0]:
                    best = (tot, mi, ei, r)
        tot, mi, ei, r = best
        for x in (mi, ei):
            x[0]["pair_score"], x[0]["match_r"] = round(tot, 3), r
        log(f"   calm-off pair: MADA {mi[0]['take']} x MAS {ei[0]['take']}  r={r}  pair score {tot:.2f}")
        qa_all[S.MASTER_MADA_32] = [{k: vv for k, vv in x[0].items() if k != "_contour"} for x in m_res]
        qa_all["a4-30-09"] = [{k: vv for k, vv in x[0].items() if k != "_contour"} for x in e_res]
        for lid in ("a4-25-02", "a4-30-08"):
            ln = S.BY_ID_32[lid]
            w, m3 = export(ln, None, mi[1])
            e = entry32(ln, V_["mada"], mi, m_res, w, m3, {"take": f"{S.MASTER_MADA_32} {mi[0]['take']}",
                        "pick_reason": f"the master read (one canned answer for both lines), chosen as a pair with MAS's echo "
                                       f"a4-30-09 {ei[0]['take']}: contour r {r}, pair score {round(tot, 2)}"})
            e["qa"]["contour_r_vs_mas_echo"] = r
            new[lid] = e
        w, m3 = export(ln_e, None, ei[1])
        e = entry32(ln_e, V_["mas-manalt"], ei, e_res, w, m3)
        e["qa"]["contour_r_vs_mada"] = r
        e["pair"] = {"mada_take": mi[0]["take"], "pair_score": round(tot, 3)}
        new["a4-30-09"] = e
        keep_takes(ln_e, os.path.join(ROOT, "takes", "a4-30-09"))

    # ---- 2. every other read line, V.O. after Mas's on-camera lines, lines with a 'below' reference after it
    queue = [l for l in S.LINES_32 if not l.get("master") and l["id"] != "a4-30-09" and not l.get("derive")]
    first = [l for l in queue if l["kind"] != "vo" and not (l.get("pick") or {}).get("below")]
    vo = [l for l in queue if l["kind"] == "vo"]
    later = [l for l in queue if l["kind"] != "vo" and (l.get("pick") or {}).get("below")]
    mas_speeds = []
    for ln in first + vo + later:
        if not want(ln["id"]):
            continue
        v = V_[ln.get("voice", ln["speaker"])]
        log("==", ln["id"], v["name"], ln["text"], f"(target {ln['target']:.2f} s)")
        keep = os.path.join(ROOT, "takes", ln["id"])
        ctx = {}
        pk = ln.get("pick") or {}
        if pk.get("below"):
            ctx["below_f0"] = (new.get(pk["below"]) or old.get(pk["below"], {})).get("qa", {}).get("median_f0_hz")
        n_words = len(L._words_of(L.parse_say(ln["say"])[0]))
        aim = aim_of(ln, n_words)
        extra = {}
        if ln["kind"] == "vo":
            # V.O. pace: x1.08 of his on-camera voice reading the same words, at his delivered on-camera speed
            oc = V_["mas-manalt"]
            if not mas_speeds:  # a partial run: his delivered multiword on-camera speeds from lines.json
                mas_speeds = [old[i]["pace"]["speed"] for i in ("a4-29-05", "a4-29-08", "a4-31-02", "a4-31-03")
                              if i in old and "pace" in old[i]]
            sp_ref = float(np.median(mas_speeds)) if mas_speeds else oc["speed"]
            text, breaks = L.parse_say(ln["say"])
            yo, to, io = P.dry_take(text, breaks, oc["blend"], sp_ref, 1)
            oc_span = fspan(yo, to, oc, None)
            slot = S.VO_SLOT[ln["id"]][0]
            aim = float(np.clip(oc_span * S.VO_RATIO_AIM, ln["target"] * (1 - S.TOL), slot - 0.075))
            ctx["oncam_span"] = oc_span
            extra["pace_ref"] = {"oncam_speed": round(sp_ref, 3), "oncam_span_s": round(oc_span, 3),
                                 "oncam_wpm": P.wpm(n_words, oc_span), "ratio_rule": f"x{S.VO_RATIO[0]}-{S.VO_RATIO[1]} (aim x{S.VO_RATIO_AIM}); ruling 7's x{S.VO_RATIO_RULING7[0]}-{S.VO_RATIO_RULING7[1]} reads kept in takes/<id>-x108/",
                                 "slot_max_s": slot, "slot_note": S.VO_SLOT[ln["id"]][1], "aim_s": round(aim, 3)}
            log(f"   V.O. ref: on-camera read at {sp_ref:.3f} -> {oc_span:.3f} s; aim {aim:.3f} s (slot {slot})")
        if ln.get("splice_from"):
            src = new.get(ln["splice_from"]) or old[ln["splice_from"]]
            seg = segment_contour(src, "more", "soon")
            ctx["match_contour"], ctx["match_range"] = seg.get("_contour"), seg.get("f0_range_st")
        best, results, sp_line = record_line(ln, v, ctx, keep, aim)
        if ln.get("splice_from"):
            z, zt, cuts = splice_more_soon(src)
            wav = os.path.join(keep, f"{ln['id']}_splice.wav")
            L.write(z, wav, None)
            info = {"speed": src["pace"]["speed"], "tsm": src["pace"].get("tsm", 1.0), "pauses": [{"after_word": 1, "target_s": 0.12, "tts_s": 0.0, "final_s": 0.12}],
                    "reads": 0}
            m = measure(dict(ln, splice=True), z, zt, info, wav, {"splice_from": src["id"], "take": src["take"],
                                                                   "cut_s": [round(c, 3) for c in cuts]}, aim)
            m["take"] = "splice"
            sc, terms = score32(m, ln, v, ctx)
            m["score"], m["score_terms"] = sc, terms
            results.append((m, z, zt, info, wav))
            log(f"  {ln['id']:10s} splice span {m['voiced_span_s']:.2f} F0 {m['median_f0_hz']} cer {m['cer']:.2f} lp {m['logprob']:.2f} "
                f"match {m.get('match_r')} score {sc:6.2f} | {m['asr']}")
            best = min(results, key=lambda r: r[0]["score"])
        if ln["speaker"] == "mas-manalt" and ln["kind"] == "dialogue" and n_words >= 3:
            mas_speeds.append(best[3]["speed"])
        qa_all[ln["id"]] = [{k: vv for k, vv in r[0].items() if k != "_contour"} for r in results]
        y = best[1]
        if ln.get("chain_extra") == "call":
            y, extra["clean"] = call_version({"id": ln["id"]}, y)
        w, m3 = export(ln, None, y)
        e = entry32(ln, v, (best[0], y, best[2], best[3], best[4]), results, w, m3, None)
        if best[0]["take"] == "splice":
            e["processing"] = [f"lifted from {src['file']} ({src['id']} {src['take']}): 'more' and 'soon' cut at the quietest "
                               f"5 ms frame between them, a 0.12 s stop inserted (3 ms ramps)",
                               "silence trim (20 ms head / 40 ms tail)", "48 kHz / 24-bit; -16 LUFS integrated; true-peak ceiling -1.5 dBTP"]
            e["voice"] = src["voice"] + " · lifted from a4-27-04"
            e["derived_from"] = src["id"]
            e["spoken_as"] = "More.<0.12s> Soon. (her a4-27-04 read of 'more soon')"
        if extra.get("clean"):
            e["clean"] = extra.pop("clean")
            e["qa"]["lufs_i"] = round(L.V.lufs(y), 2)
            e["qa"]["true_peak_dbtp"] = round(L.V.true_peak_db(y), 2)
            e["qa"]["clipped_samples"] = int(np.sum(np.abs(y) >= 0.999))
            e["qa"]["target_lufs"] = CALL_LUFS
        if extra.get("pace_ref"):
            e["qa"]["pace_ref"] = extra["pace_ref"]
            e["qa"]["span_vs_oncam"] = round(e["voiced_span_s"] / extra["pace_ref"]["oncam_span_s"], 3)
            e["voice"] += " (V.O., x his on-camera read)"
        if ctx.get("below_f0") and e["qa"].get("median_f0_hz"):
            e["qa"]["below_ref"] = pk["below"]
            e["qa"]["st_vs_ref"] = round(12 * np.log2(e["qa"]["median_f0_hz"] / ctx["below_f0"]), 1)
        if ctx.get("match_contour") is not None:
            e["qa"]["contour_r_vs_a4-27-04_more_soon"] = best[0].get("match_r")
        if ln.get("fallback"):
            e["fallback"] = record_fallback(ln, v, V_, qa_all, extra.get("pace_ref"), sp_line)
        sync_marks(e, ln)
        new[ln["id"]] = e
        keep_takes(ln, keep)

    # ---- 3. the laptop 'super.' from the new a4-26-01
    ln = S.BY_ID_32["a4-27-00"]
    if want("a4-27-00") or want("a4-26-01"):
        log("== a4-27-00 derived")
        src = new.get("a4-26-01") or old["a4-26-01"]
        new["a4-27-00"] = derive_laptop(ln, src, V_)

    # ---- 4. merge, restage the posts, place overlaps, write
    merged = {**old, **new}
    for pid, (scene, shot, beats, status, note) in S.POSTS_32.items():
        e = merged[pid]
        e.update({"scene": scene, "shot": shot, "shot_id": shot.split()[0], "cue": shot.split()[0] + ", on the shot",
                  "status": status, "kind": "post", "side": "none", "pov": "his" if scene != "27" else "board", "lip_sync": False,
                  "popup_hold_beats": beats,
                  "popup_note": f"House rule: posts are pop-ups, never speeches. Unvoiced in the cut; the scratch read in optional/ is "
                                f"for the animatic / audio description only. Draft 3.2 hold: {beats} beats ({beats * L.BEAT:.2f} s), {note}."})
    out = {i: merged[i] for i in S.ORDER_32 if i in merged}
    placements(out)
    missing = [i for i in S.ORDER_32 if i not in out]
    gone = sorted(set(merged) - set(S.ORDER_32))
    if gone:
        log("dropped from lines.json (removed in 3.2):", ", ".join(gone))
    if missing:
        log("MISSING rows:", ", ".join(missing))
    json.dump(list(out.values()), open(lj, "w"), indent=1, ensure_ascii=False)
    json.dump(qa_all, open(qa_path, "w"), indent=1, ensure_ascii=False, default=float)
    log(f"wrote {lj} ({len(out)} rows) in {time.time() - t_start:.0f} s")


def record_fallback(ln, v, V_, qa_all, pace_ref, sp_line):
    fb = ln["fallback"]
    fid = ln["id"] + "-fallback"
    lnf = dict(ln, id=fid, say=fb["say"], text=fb["text"], takes=fb["takes"], fallback=None)
    log("== fallback", fid, fb["text"])
    text, breaks = L.parse_say(fb["say"])
    oc = V_["mas-manalt"]
    yo, to, _ = P.dry_take(text, breaks, oc["blend"], pace_ref["oncam_speed"], 1)
    oc_span = fspan(yo, to, oc, None)
    aim = float(np.clip(oc_span * S.VO_RATIO_AIM, ln["target"] * (1 - S.TOL), S.VO_SLOT[ln["id"]][0] - 0.075))
    best, results, _ = record_line(lnf, v, {"oncam_span": oc_span}, os.path.join(ROOT, "takes", fid), aim)
    qa_all[fid] = [{k: vv for k, vv in r[0].items() if k != "_contour"} for r in results]
    m, y, toks = best[0], best[1], best[2]
    os.makedirs(os.path.join(ROOT, "fallback"), exist_ok=True)
    wav, mp3 = os.path.join(ROOT, "fallback", ln["id"] + ".wav"), os.path.join(ROOT, "fallback", ln["id"] + ".mp3")
    L.write(y, wav, mp3)
    d, _ = sf.read(mp3, dtype="float32")
    others = sorted(results, key=lambda r: r[0]["score"])
    return {"text": fb["text"], "spoken_as": fb["say"], "why": fb["why"], "file": rel(wav), "mp3": rel(mp3),
            "duration_s": round(len(y) / SR, 3), "frames_24": int(np.ceil(len(y) / SR * FPS)), "voiced_span_s": m["voiced_span_s"],
            "take": m["take"], "takes_tried": len(results),
            "pick_reason": f"lowest score {m['score']} of {len(results)} takes (next {others[1][0]['take']} at {others[1][0]['score']}); terms: "
                           + ", ".join(f"{k} {vv}" for k, vv in m["score_terms"].items()),
            "pace": {"words": m["n_words"], "wpm": m["wpm_span"], "speed": best[3]["speed"], "tsm": best[3].get("tsm", 1.0), "aim_s": round(aim, 3)},
            "words": word_track32(toks),
            "qa": {**{k: m[k] for k in ("lufs_i", "true_peak_dbtp", "clipped_samples", "median_f0_hz", "f0_range_st",
                                         "final_move_st", "asr", "cer", "logprob", "align_median_s") if k in m},
                   "wpm": m["wpm_span"], "mp3_lufs_i": round(L.V.lufs(d), 2), "target_lufs": v.get("lufs", CA.DIALOGUE_LUFS),
                   "pace_ref": dict(pace_ref, oncam_span_s=round(oc_span, 3)), "span_vs_oncam": round(m["voiced_span_s"] / oc_span, 3)},
            "alt_takes": [{"take": r[0]["take"], "file": rel(r[4]), "score": r[0]["score"], "spec": r[0]["spec"]} for r in others]}


if __name__ == "__main__":
    main()
