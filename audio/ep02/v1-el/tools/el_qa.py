#!/usr/bin/env python3
"""el_qa.py - Ep2 v1: QA every take, since nobody can listen; retake the failures; write the report (takes-qa.md).

Reads the beat plans (show/episodes/ep02/production/v1/beat-plan/<seg>.json), each segment's takes
(audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json + manifest.json, written by el_render.py and the special-line tools) and the
cast (audio/ep02/cast-el.json). Writes audio/ep02/v1-el/ep02-v1/qa/<seg>-qa.json (every attempt's measures, the pick and
the verdict; committed) and show/episodes/ep02/production/v1/takes-qa.md.

  retake  --segs S ...      measure every ElevenLabs take of the segments; a take that fails is retaken on a new seed
                            (bump 1000, 2000, 3000: at most 3 retakes a line), the first take that passes is kept (else
                            the best-measured, flagged); the pick goes into the manifest (so el_render.py keeps it) and
                            lines-A.json. --dry: measure and say what would be retaken, send nothing
  measure --segs S ...      measure every row of lines-A.json (the special lines too) into the QA JSON; sends nothing
  variant --seg S --id ID --settings JSON [--label L]
                            one line read with other settings (a line_settings candidate), measured beside its take, in
                            scratch; the cache keeps it, so choosing it later (cast-el.json line_settings) costs nothing
  report                    takes-qa.md from the QA JSONs, the manifests' credit headers and the casting pass's total

THE CHECKS (each take; [M] measured):
  asr       faster-whisper small.en (beam 5, the house recogniser) against the line's text, both sides normalised
            (numbers and years as words, spelled letters joined, 'alright' = 'all right', accents stripped, a hyphen or
            a space inside a word ignored). A parody name in the text matches up to three heard words (the name check
            covers it). Any other dropped, added or changed word is a MISMATCH; it is then scored by forced alignment
            (log P(the text as sent | audio) minus log P(what the recogniser heard | audio), the same model): a margin
            under -3.0 confirms a misread (FAIL: retake); at or over -3.0 the audio supports the text as well as the
            recogniser's guess, so the mismatch is the recogniser's (LOOK, noted)
  names     pron_check.py's forced choice for every watched name (the real word the parody turns is a competitor):
            margin < -2.0 FAIL (retake), -2.0 to 0 LOOK
  length    the audible span against the plan's planning length (the words-at-rate estimate, _spec.py, before any
            take replaced it): lines of 4+ words FAIL under 0.55 or over 1.70 of the plan, LOOK outside 0.85-1.15;
            shorter lines FAIL more than 1.0 s off, LOOK more than 0.35 s off. A silence inside the read over 1.0 s that
            the text doesn't mark (an ellipsis or a dash) is a FAIL
  tempo     words a minute against the line's mark (W18 and cast.md): Mas ~140 (120-160), his call to LEGAL ~180
            (160-200), his V.O. 110-130, V.O. 9 ~145-165, every other role its planned rate +-15 % (_spec.py RATE);
            lines of 5+ words only; outside is LOOK (the lock fits the takes; a speed change is a casting call)
  level     the take at its target (-16 LUFS dialogue, -18 V.O.) within 0.5 LU, true peak <= -1.5 dBTP; a miss is a
            dressing fault (FAIL: re-dress)
  clipping  no sample at full scale in the take; no run of 3+ samples at |x| >= 0.99 in the raw ElevenLabs audio; the
            raw audio not stopping while it still sounds (el_render's tail check). Any is a FAIL
  floor     the raw ElevenLabs file's noise floor (5th percentile of 20 ms frames) and speech-to-floor: under 25 dB FAIL,
            under 45 dB (the house bed's depth under dialogue) LOOK; the take's own floor (the -62 dBFS room tone)
  pitch     the take's median F0 against its role's median over the episode: more than 4 st off and outside the
            role's lane widened by 2 st is a FAIL (an octave slip), lines of 3+ words only
Nothing here is heard. A LOOK is a number at the edge of its band, for the ear list; a FAIL is retaken.
"""
from __future__ import annotations

import argparse
import copy
import glob
import json
import math
import os
import re
import statistics
import sys
import time
import types
import unicodedata

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np  # noqa: E402
import el_render as R  # noqa: E402
import elaudio as E  # noqa: E402
import ellib  # noqa: E402
import pron_check as P  # noqa: E402

REPO = R.REPO
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
BP = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
OUT = os.path.join(REPO, "audio/ep02/v1-el/ep02-v1")
QA = os.path.join(OUT, "qa")
REPORT = os.path.join(REPO, "show/episodes/ep02/production/v1/takes-qa.md")
MAX_RETAKES = 3
BUMPS = [1000, 2000, 3000]
ASR_FAIL_MARGIN = -3.0
NAME_FAIL, NAME_LOOK = -2.0, 0.0
# ASR controls: a mismatch the recogniser can't separate from the text, shown by reading both on purpose in the same
# voice (Ep1's pron_check method: a margin is read against controls). The pair (text words, heard words) is then a LOOK.
CONTROLS = {
    "e2-a1-0011": dict(pair=("n", "end"), note="the recogniser can't tell the letter 'N' from 'end' here: scored on the same "
                       "two texts, a control read of 'En' gives -4.5 and a control read of 'end' -4.9, and the four reads "
                       "-2.6 to -4.5 (variants/n-controls.json)"),
}
NAMES_WILD = {"mas", "gerg", "alyi", "nole", "nopeai", "chatgtp", "rettiwt", "minddeep", "aros", "manalt", "ekiel",
              "agi", "tasya", "rima", "terb"}

sys.path.insert(0, BP)
import _spec as S  # noqa: E402  (the shooting script as data: the planning lengths and the rates)


def jload(p):
    with open(p) as f:
        return json.load(f)


def rel(p):
    return os.path.relpath(os.path.abspath(p), REPO)


# ============================================================================================ the plan
_PLAN = None


def plan():
    """line id -> its beat plan entry, with seg, beat, scene, beat pace and the planning length (before takes)"""
    global _PLAN
    if _PLAN is None:
        _PLAN = {}
        for seg in SEGS:
            d = jload(os.path.join(BP, f"{seg}.json"))
            order = 0
            for b in d["beats"]:
                for ln in b.get("lines") or []:
                    e = dict(ln, seg=seg, beat=b["id"], scene=b.get("scene"), beat_pace=b.get("pace"), order=order)
                    e["plan_len"] = plan_len(ln["id"])
                    _PLAN[ln["id"]] = e
                    order += 1
    return _PLAN


def plan_len(lid):
    """the planning length the script pass fitted the scenes to: the words-at-rate estimate (or a fixed length),
    never a take (once the plan is re-run on the takes, its len_s is the take's own)"""
    if lid in S.NEW_VO:
        return S.est_len("mas", S.NEW_VO[lid][2], vo=True, rate=S.VO_RATES.get(lid))
    d = S.NEW_LINES[lid]
    return d.get("len") or S.est_len(d["who"], d["text"], rate=d.get("rate"))


def tempo_band(lid, who, vo):
    """the line's words-a-minute mark: (lo, hi, what)"""
    if vo:
        return (145, 175, "V.O. 9, faster than he thinks (~145-165)") if lid == "e2-vo-09" else (110, 130, "his V.O. 110-130")
    if lid == "e2-a3-0019":
        return (160, 200, "the call to LEGAL, quicker than he ever talks (~180)")
    if who == "mas":
        return (120, 160, "Mas unhurried (~140)")
    r = S.RATE.get(who)
    if not r:
        return None
    return (round(r * 0.85), round(r * 1.15), f"{who} at the planned {r} wpm +-15 %")


# ============================================================================================ text compare
ORD = {"16th": "sixteenth", "17th": "seventeenth", "1st": "first", "2nd": "second", "3rd": "third", "4th": "fourth"}
EQUIV = [(r"\balright\b", "all right"), (r"\bokay\b", "ok"), (r"\bgonna\b", "going to"), (r"\bwanna\b", "want to"),
         (r"\byep\b", "yup"), (r"\b'?til\b", "till"), (r"\bmister\b", "mr"), (r"\bmr\.", "mr")]
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen " \
       "seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def n2w(n):
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + n2w(n % 100))
    if n < 1_000_000:
        return n2w(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + n2w(n % 1000))
    return n2w(n // 1_000_000) + " million" + ("" if n % 1_000_000 == 0 else " " + n2w(n % 1_000_000))


def numbers(s):
    s = re.sub(r"(?<=\d)\s*,\s*(?=\d{3}\b)", "", s)

    def year(m):
        y = int(m.group(0))
        return ("twenty " + n2w(y % 100)) if 2010 <= y <= 2099 else n2w(y)
    s = re.sub(r"\b(19|20)\d\d\b", year, s)
    s = re.sub(r"\b\d+(st|nd|rd|th)\b", lambda m: ORD.get(m.group(0), m.group(0)), s)
    s = re.sub(r"\b\d+\b", lambda m: n2w(int(m.group(0))), s)
    s = re.sub(r"\bone hundred\b", "a hundred", s)
    s = re.sub(r"\bhundred and\b", "hundred", s)
    return s


def toks(s):
    """a text as plain comparable words"""
    s = re.sub(r"(?i)\bwo-o-ord\b", "word", s or "")              # the sung word, as written
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"\b([A-Za-z])\s*[.\-]\s*([A-Za-z])\s*[.\-]\s*([A-Za-z])\b\.?", r"\1\2\3", s)   # A.G.I. / A-G-I -> AGI
    s = s.lower().replace("’", "'").replace("—", " ").replace("…", " ").replace("-", " ")
    for rx, rep in EQUIV:
        s = re.sub(rx, rep, s)
    s = numbers(s)
    out = []
    for w in re.findall(r"[a-z0-9']+", s):
        w = w.strip("'")
        if w.endswith("'s") and w[:-2] in NAMES_WILD:
            w = w[:-2]
        if w:
            out.append(w)
    return out


def asr_diff(text, heard):
    """-> list of mismatches [(ref words, heard words)] after the house's normalisation; a parody name matches up to 3
    heard words, and a region whose letters agree (a word split or joined) matches"""
    import difflib
    r, h = toks(text), toks(heard)
    sm = difflib.SequenceMatcher(a=r, b=h, autojunk=False)
    ops = [op for op in sm.get_opcodes()]
    regions, cur = [], None
    for tag, i1, i2, j1, j2 in ops:            # merge adjacent non-equal opcodes into regions
        if tag == "equal":
            if cur:
                regions.append(cur)
                cur = None
            continue
        if cur is None:
            cur = [i1, i2, j1, j2]
        else:
            cur[1], cur[3] = i2, j2
    if cur:
        regions.append(cur)
    bad = []
    for i1, i2, j1, j2 in regions:
        rr, hh = r[i1:i2], h[j1:j2]
        names = [w for w in rr if w in NAMES_WILD]
        plain = [w for w in rr if w not in NAMES_WILD]
        if "".join(plain) == "".join(hh):
            continue
        if names:
            # the plain words must still be heard, in order, inside the region; the rest of the heard words are the
            # names' renderings (at most 3 each)
            left = "".join(hh)
            ok, pos = True, 0
            for w in plain:
                k = left.find(w, pos)
                if k < 0:
                    ok = False
                    break
                pos = k + len(w)
            extra = len(hh) - len(plain)
            if ok and extra <= 3 * len(names):
                continue
        bad.append((" ".join(rr) or "(nothing)", " ".join(hh) or "(nothing)"))
    return bad


# ============================================================================================ measures
def raw_measures(key):
    """the raw ElevenLabs audio of a request: noise floor and speech-to-floor (el_audition's raw_floor), clipping runs"""
    cdir = os.path.join(REPO, "audio/ep02/v1-el/cache")
    p = os.path.join(cdir, key + ".mp3")
    if not os.path.exists(p):
        return {}
    y = E.decode(open(p, "rb").read())
    n = int(0.02 * E.SR)
    m = len(y) // n
    rr = 20 * np.log10(np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1)) + 1e-7)
    floor = float(np.percentile(rr, 5))
    speech = float(np.median(rr[rr >= rr.max() - 20]))
    hot = np.abs(y) >= 0.99
    runs = 0
    if hot.any():
        d = np.diff(np.concatenate([[0], hot.astype(np.int8), [0]]))
        s, e = np.where(d == 1)[0], np.where(d == -1)[0]
        runs = int(np.sum((e - s) >= 3))
    quiet = rr[rr <= rr.max() - 35]
    pf = float(np.median(quiet)) if len(quiet) >= 5 else None
    return dict(raw_floor_dbfs=round(floor, 1), raw_speech_to_floor_db=round(speech - floor, 1),
                raw_pause_floor_dbfs=round(pf, 1) if pf is not None else None,
                raw_pause_sf_db=round(speech - pf, 1) if pf is not None else None, raw_quiet_frames=int(len(quiet)),
                raw_peak_dbfs=round(float(20 * np.log10(np.max(np.abs(y)) + 1e-9)), 2), raw_clip_runs=runs)


def attempt_audio(key, seed, vo):
    """an attempt's dressed take, rebuilt from its cached request (el_render's dressing is deterministic), in memory"""
    p = os.path.join(REPO, "audio/ep02/v1-el/cache", key + ".mp3")
    y = E.decode(open(p, "rb").read())
    out, _, _ = E.dress(y, seed, -18.0 if vo else -16.0)
    return out


def take_floor(y):
    n = int(0.02 * E.SR)
    m = len(y) // n
    rr = 20 * np.log10(np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1)) + 1e-9)
    return round(float(np.percentile(rr, 5)), 1)


def load(path):
    return P.load(os.path.join(REPO, path))


def measure_row(row, cast, sent=None, y=None):
    """every check's numbers for one take (a lines-A row, or its audio passed as y) -> dict"""
    pl = plan()[row["id"]]
    y = load(row["file"]) if y is None else y
    q = row.get("qa") or {}
    pace = row.get("pace") or {}
    a_in, a_out = pace.get("audible_in_s"), pace.get("audible_out_s")
    if a_in is None or a_out is None:
        m = E.measure(y, row["text"])
        a_in, a_out = m["audible_in_s"], m["audible_out_s"]
        pace = dict(pace, audible_in_s=a_in, audible_out_s=a_out, longest_internal_gap_s=m["longest_internal_gap_s"],
                    wpm=m["wpm"])
    span = round(a_out - a_in, 3)
    nwords = len([w for w in row["text"].split() if re.search(r"[A-Za-z0-9]", w)])
    heard = q.get("asr")
    if heard is None:
        heard, _ = E.asr(y)
    diff = asr_diff(row["text"], heard)
    asr_margin = None
    sent = sent or row.get("spoken_as") or row["text"]
    enc = None                                   # one encoder pass, only when a check needs the forced alignment
    if diff:
        enc = P.encode(y)
        sc = P.forced(y, [sent, heard or "."], enc=enc)
        asr_margin = round(sc[0][1] - sc[1][1], 2)
    who = row.get("speaker_slug")
    sc_case = (cast.roles.get(who) or {}).get("sentence_case")
    names = P.name_margins(y, row["text"], sc_case, cast.d.get("names", []), enc=enc)
    lufs = round(E.lufs(y), 2)
    tp = round(E.true_peak_db(y), 2)
    clipped = int((np.abs(y) >= 0.999).sum())
    key = (row.get("el") or {}).get("request_key")
    raw = raw_measures(key) if key else {}
    f0 = q.get("median_f0_hz")
    if f0 is None:
        f0, _ = E.f0_fast(y[int(a_in * E.SR): int(a_out * E.SR)])
    return dict(
        heard=heard, asr_mismatch=diff, asr_margin=asr_margin, names=names,
        span_s=span, plan_len_s=pl["plan_len"], ratio=round(span / pl["plan_len"], 3) if pl["plan_len"] else None,
        words=nwords, wpm=round(nwords / span * 60, 1) if span > 0 else None,
        longest_gap_s=pace.get("longest_internal_gap_s"), lufs=lufs, true_peak=tp, clipped=clipped,
        raw_tail_cut=bool(q.get("raw_tail_cut")), f0=f0, f0_range_st=q.get("f0_range_st"),
        take_floor_dbfs=take_floor(y), duration_s=round(len(y) / E.SR, 3), **raw)


def verdict(row, m, role_f0, lane):
    """-> (FAIL reasons, LOOK notes)"""
    pl = plan()[row["id"]]
    fail, look = [], []
    vo = (row.get("kind") == "vo") or row.get("tag") == "V.O."
    special = row.get("special")
    ctl = CONTROLS.get(row["id"])
    if m["asr_mismatch"] and ctl and all((a, b) == ctl["pair"] for a, b in m["asr_mismatch"]):
        look.append(f"asr: '{ctl['pair'][0]}' heard '{ctl['pair'][1]}' ({ctl['note']})")
    elif m["asr_mismatch"]:
        what = "; ".join(f"'{a}' heard '{b}'" for a, b in m["asr_mismatch"])
        if special in ("sung", "crowd"):
            look.append(f"asr: {what} (a {special} take: the recogniser is not built for it)")
        elif m["asr_margin"] is not None and m["asr_margin"] < ASR_FAIL_MARGIN:
            fail.append(f"asr: {what} (forced margin {m['asr_margin']:+.1f})")
        else:
            look.append(f"asr: {what} (the recogniser's; the text scores {m['asr_margin']:+.1f} against what it heard)")
    for n in m["names"]:
        if n["margin"] < NAME_FAIL:
            fail.append(f"name {n['word']}: {n['margin']:+.1f} against '{n['best_competitor']}'")
        elif n["margin"] < NAME_LOOK:
            look.append(f"name {n['word']}: {n['margin']:+.1f} against '{n['best_competitor']}'")
    r, d = m["ratio"], m["span_s"] - m["plan_len_s"]
    if special not in ("crowd", "sung"):
        if m["words"] >= 4:
            if r < 0.55 or r > 1.70:
                fail.append(f"length {m['span_s']:.2f} s against the plan's {m['plan_len_s']:.2f} ({r:.2f})")
            elif r < 0.85 or r > 1.15:
                look.append(f"length {r:.2f} of the plan")
        else:
            if abs(d) > 1.0:
                fail.append(f"length {m['span_s']:.2f} s against the plan's {m['plan_len_s']:.2f}")
            elif abs(d) > 0.35:
                look.append(f"length {d:+.2f} s off the plan")
        if (m["longest_gap_s"] or 0) > 1.0 and not re.search(r"…|\.\.\.|—|-$", row["text"]):
            fail.append(f"a {m['longest_gap_s']:.2f} s silence inside the read")
    tb = tempo_band(row["id"], pl["who"], vo)
    if tb and m["words"] >= 5 and m["wpm"] and special not in ("crowd", "sung"):
        if not (tb[0] <= m["wpm"] <= tb[1]):
            look.append(f"tempo {m['wpm']:.0f} wpm against {tb[2]}")
    tgt = -18.0 if vo else -16.0
    if special != "crowd" and abs(m["lufs"] - tgt) > 0.5:
        fail.append(f"level {m['lufs']:.1f} LUFS against {tgt:g}")
    if m["true_peak"] > -1.45:
        fail.append(f"true peak {m['true_peak']:.2f} dBTP")
    if m["clipped"]:
        fail.append(f"{m['clipped']} samples at full scale")
    if m.get("raw_clip_runs"):
        fail.append(f"{m['raw_clip_runs']} clipped runs in the raw audio")
    if m["raw_tail_cut"]:
        fail.append("the raw audio stops while still sounding")
    psf = m.get("raw_pause_sf_db")
    sf_ = m.get("raw_speech_to_floor_db")
    if psf is not None and psf < 25:
        fail.append(f"noise: the raw file's pauses sit {psf:.0f} dB under the speech")
    elif sf_ is not None and sf_ < 45:
        look.append(f"floor {sf_:.0f} dB under the speech (p5; house bed depth 45)")
    if m["f0"] and role_f0 and special not in ("sung", "crowd"):
        off = 12 * math.log2(m["f0"] / role_f0)
        in_wide = lane and (lane[0] * 2 ** (-2 / 12) <= m["f0"] <= lane[1] * 2 ** (2 / 12))
        if abs(off) > 4 and not in_wide:
            if m["words"] >= 3:
                fail.append(f"pitch {m['f0']:.0f} Hz, {off:+.1f} st from the role's {role_f0:.0f}")
            else:     # one or two words: the house tracker slips an octave on a syllable (cast.md §3.5), so only a look
                look.append(f"pitch {m['f0']:.0f} Hz, {off:+.1f} st from the role's {role_f0:.0f} (a short line)")
    return fail, look


# ============================================================================================ the takes
def seg_rows(seg):
    p = os.path.join(OUT, seg, "lines-A.json")
    return jload(p) if os.path.exists(p) else []


def qa_path(seg):
    return os.path.join(QA, f"{seg}-qa.json")


def qa_load(seg):
    p = qa_path(seg)
    return jload(p) if os.path.exists(p) else {"segment": seg, "lines": {}}


def qa_save(seg, d):
    os.makedirs(QA, exist_ok=True)
    d["updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
    ellib.jdump(d, qa_path(seg))


def role_stats(cast):
    """each role's median F0 over its takes in the episode (dialogue and V.O. apart), and its lane"""
    f0s = {}
    for seg in SEGS:
        for r in seg_rows(seg):
            f = (r.get("qa") or {}).get("median_f0_hz")
            if f and not r.get("special") and len(r["text"].split()) >= 3:
                f0s.setdefault((r["speaker_slug"], r.get("kind")), []).append(f)
    out = {}
    for (role, kind), v in f0s.items():
        base = (cast.roles.get(role) or {}).get("derived_from") or role
        lane = (cast.roles.get(base) or {}).get("lane_hz")
        ref = statistics.median(v) if len(v) >= 3 else ((lane[0] * lane[1]) ** 0.5 if lane else statistics.median(v))
        out[(role, kind)] = (ref, lane)
    return out


def attempt_record(rec, m, fail, look, label):
    el = rec if "voice_id" in rec else {}
    return dict(label=label, bump=rec.get("bump", 0), seed=rec.get("seed"), key=rec.get("key"),
                settings=rec.get("settings"), file=rec.get("file"), measures=m, fail=fail, look=look,
                sent=rec.get("sent"), voice=el.get("voice_name"))


def args_ns(**kw):
    a = dict(dry_run=False, redress=False, budget_left=None, reuse=[], target_lufs=-16.0, vo_lufs=-18.0, retry_bad=0)
    a.update(kw)
    return types.SimpleNamespace(**a)


def cmd_retake(a):
    cast = R.Cast()
    stats = role_stats(cast)
    total_sent = 0
    for seg in a.segs:
        rows = seg_rows(seg)
        if not rows:
            print(f"== {seg}: no lines-A.json")
            continue
        out = os.path.join(OUT, seg)
        man = R.load_manifest(out)
        bp_rows = {r["id"]: r for r in R.read_rows(os.path.join(BP, f"{seg}.json"))}
        qa = qa_load(seg)
        logf = open(os.path.join(out, "log", "qa.log"), "a") if not a.dry else None

        def log(s):
            print(s, flush=True)
            if logf:
                logf.write(ellib.redact(s) + "\n")
                logf.flush()
        log(f"== qa {seg} at {time.strftime('%Y-%m-%d %H:%M:%S')}{' (dry)' if a.dry else ''}")
        changed = False
        for i, row in enumerate(rows):
            if row.get("status") != "el" or row.get("special") or (row.get("el") or {}).get("cut_from"):
                continue
            if a.only and row["id"] not in a.only.split(","):
                continue
            lid, role = row["id"], row["speaker_slug"]
            ref, lane = stats.get((role, row.get("kind")), (None, None))
            prev = qa["lines"].get(lid) or {}
            r = bp_rows[lid]
            c, rdef = cast.voice(role, R.cand_map(None, cast, "A").get(role, "A"))
            take_name = f"{lid}__{role}-{c['cand']}"
            cur = man["takes"][take_name]
            # attempts already measured for this take (same base key: same voice, settings and text)
            atts = [x for x in prev.get("attempts", []) if x.get("base_key") == cur["base_key"]]
            superseded = (prev.get("superseded") or []) + [x for x in prev.get("attempts", [])
                                                           if x.get("base_key") != cur["base_key"]]
            have = {x["bump"]: x for x in atts}
            if cur.get("bump", 0) not in have or a.remeasure:
                m = measure_row(row, cast, cur["sent"])
                f, lk = verdict(row, m, ref, lane)
                x = attempt_record(cur, m, f, lk, "first" if not cur.get("bump") else f"retake {cur.get('bump')}")
                x["base_key"] = cur["base_key"]
                have[cur.get("bump", 0)] = x
            vo = row.get("kind") == "vo"
            for b_, x in have.items():
                mm = x["measures"]
                if "raw_quiet_frames" not in mm and x.get("key"):
                    mm.update(raw_measures(x["key"]))
                if a.rescore_names and x.get("key") and x.get("seed") is not None:
                    yy = attempt_audio(x["key"], x["seed"], vo)
                    sc_case = (cast.roles.get(role) or {}).get("sentence_case")
                    mm["names"] = P.name_margins(yy, row["text"], sc_case, cast.d.get("names", []))
                x["fail"], x["look"] = verdict(row, mm, ref, lane)
            ordered = [have[b] for b in sorted(have)]
            passing = [x for x in ordered if not x["fail"]]
            n_retakes = len([b for b in have if b in BUMPS])
            retook = False
            forced = lid in set(x for x in (a.force or "").split(",") if x)
            while (not passing or (forced and n_retakes == 0)) and n_retakes < MAX_RETAKES and not a.dry:
                bump = BUMPS[n_retakes]
                why = "; ".join(ordered[-1]["fail"]) or "asked (--force): one more read, the one nearer the plan kept"
                log(f"  RETAKE {take_name} (bump {bump}): {why}")
                args = args_ns()
                rec, n = R.render_take(r, role, c, rdef, cast, out, man, args, log, bump=bump)
                total_sent += n
                row2 = R.row_out(r, rec, role, rdef, c)
                m = measure_row(row2, cast, rec["sent"])
                f, lk = verdict(row2, m, ref, lane)
                x = attempt_record(rec, m, f, lk, f"retake {bump}")
                x["base_key"] = rec["base_key"]
                x["why"] = why                          # what the read before it failed, at the time
                have[bump] = x
                ordered = [have[b] for b in sorted(have)]
                passing = [x for x in ordered if not x["fail"]]
                n_retakes += 1
                retook = True
                log(f"    {'PASS' if not f else 'FAIL: ' + '; '.join(f)} | heard {m['heard']!r}")
                changed = True
            if a.dry and not passing:
                log(f"  would retake {take_name}: {'; '.join(ordered[-1]['fail'])}")
            if passing:
                if forced:
                    passing = sorted(passing, key=lambda x: abs(math.log(x["measures"]["ratio"] or 1.0)))
                pick, status = passing[0], ("look" if passing[0]["look"] else "pass")
            else:
                pick = min(ordered, key=lambda x: (len(x["fail"]), len(x["look"])))
                status = "flag"
            if not a.dry and pick["bump"] != cur.get("bump", 0):
                # the pick goes into the manifest; a free re-dress of its cached audio restores its file
                man["takes"][take_name] = dict(cur, bump=pick["bump"], proc=None)
                rec, _ = R.render_take(r, role, c, rdef, cast, out, man, args_ns(), log, bump=0)
                rows[i] = R.row_out(r, rec, role, rdef, c)
                changed = True
                log(f"  kept {take_name} bump {pick['bump']}")
            elif not a.dry and retook and pick["bump"] == cur.get("bump", 0):
                # the retakes overwrote the file: re-dress the pick (free)
                man["takes"][take_name] = dict(cur, proc=None)
                rec, _ = R.render_take(r, role, c, rdef, cast, out, man, args_ns(), log, bump=0)
                rows[i] = R.row_out(r, rec, role, rdef, c)
                changed = True
            qa["lines"][lid] = dict(id=lid, who=role, take=take_name, attempts=[have[b] for b in sorted(have)],
                                    picked_bump=pick["bump"], status=status, fail=pick["fail"], look=pick["look"],
                                    superseded=superseded, sent=cur.get("sent"), settings=cur.get("settings"))
            if status != "pass":
                log(f"  {status.upper():5s} {take_name}: {'; '.join(pick['fail'] + pick['look'])}")
        if not a.dry:
            R.save_manifest(out, man)
            if changed:
                ellib.jdump(rows, os.path.join(out, "lines-A.json"))
            qa_save(seg, qa)
        if logf:
            logf.close()
    print(f"== chars sent by retakes this run: {total_sent}")


def cmd_measure(a):
    """measure every row of lines-A.json (the special lines too) into the QA JSON; nothing is sent"""
    cast = R.Cast()
    stats = role_stats(cast)
    for seg in a.segs:
        rows = seg_rows(seg)
        qa = qa_load(seg)
        man = R.load_manifest(os.path.join(OUT, seg))
        for row in rows:
            lid = row["id"]
            prev = qa["lines"].get(lid)
            sig = [row.get("file"), (row.get("el") or {}).get("request_key"), row.get("duration_s")]
            if prev and prev.get("sig") == sig and not a.remeasure:
                continue
            role = row["speaker_slug"]
            ref, lane = stats.get((role, row.get("kind")), (None, None))
            m = measure_row(row, cast, row.get("spoken_as"))
            f, lk = verdict(row, m, ref, lane)
            take_name = os.path.splitext(os.path.basename(row["file"]))[0]
            cur = man["takes"].get(take_name) or {}
            atts = [x for x in (prev or {}).get("attempts", []) if x.get("bump") != cur.get("bump", 0)
                    and x.get("base_key") == cur.get("base_key") and x.get("label") != "the take"] if prev else []
            sup = list((prev or {}).get("superseded") or [])
            if prev and prev.get("sig") and prev.get("sig") != sig and row.get("special"):
                sup += [x for x in prev.get("attempts", []) if x.get("label") == "the take"]   # an earlier special take
            x = dict(label="the take", bump=cur.get("bump", 0), seed=cur.get("seed"), key=cur.get("key"),
                     settings=cur.get("settings"), file=row["file"], measures=m, fail=f, look=lk,
                     sent=row.get("spoken_as"), base_key=cur.get("base_key"))
            status = "flag" if f else ("look" if lk else "pass")
            if not row.get("special") and prev and prev.get("attempts"):
                # an EL line keeps the retake pass's record: only the pick's verdict is refreshed
                qa["lines"][lid] = dict(prev, sig=sig, status=status, fail=f, look=lk)
                for y_ in qa["lines"][lid]["attempts"]:
                    if y_["bump"] == prev.get("picked_bump"):
                        y_.update(measures=m, fail=f, look=lk)
                print(f"{lid:12s} {role:15s} {status:5s} {'; '.join(f + lk)[:150]}")
                continue
            qa["lines"][lid] = dict(id=lid, who=role, take=take_name, attempts=atts + [x],
                                    picked_bump=x["bump"], status=status, fail=f, look=lk, sig=sig,
                                    special=row.get("special"), superseded=sup)
            print(f"{lid:12s} {role:15s} {status:5s} {'; '.join(f + lk)[:150]}")
        qa_save(seg, qa)


def cmd_variant(a):
    """one line under other settings, measured in scratch beside its take (the cache keeps the read)"""
    cast = R.Cast()
    row = next(r for r in R.read_rows(os.path.join(BP, f"{a.seg}.json")) if r["id"] == a.id)
    role = cast.role_of(row["who"])
    c, rdef = cast.voice(role, R.cand_map(None, cast, "A").get(role, "A"))
    cast2 = copy.deepcopy(cast)
    ls = cast2.d.setdefault("line_settings", {})
    st = json.loads(a.settings)
    if st:
        ls[a.id] = {c["voice_id"]: st}
    else:
        ls.pop(a.id, None)
    if a.say:
        cast2.d.setdefault("say_lines", {})[a.id] = a.say
    out = os.path.abspath(a.out)
    for sub in ("wav", "wav-device", "log"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    man = R.load_manifest(out)
    man["takes"].pop(f"{a.id}__{role}-{c['cand']}", None)
    rec, n = R.render_take(row, role, c, rdef, cast2, out, man, args_ns(), print, bump=a.bump)
    R.save_manifest(out, man)
    r2 = R.row_out(row, rec, role, rdef, c)
    r2["file"] = rec["file"]
    stats = role_stats(cast)
    ref, lane = stats.get((role, r2.get("kind")), (None, None))
    m = measure_row(r2, cast, rec["sent"])
    f, lk = verdict(r2, m, ref, lane)
    res = dict(id=a.id, label=a.label, settings=rec["settings"], bump=a.bump, chars=n, key=rec["key"], measures=m,
               fail=f, look=lk)
    p = os.path.join(out, f"variant-{a.id}-{a.label}.json")
    ellib.jdump(res, p)
    print(json.dumps(dict(res, measures={k: m[k] for k in ("heard", "span_s", "plan_len_s", "wpm", "f0", "f0_range_st",
                                                              "asr_mismatch", "asr_margin")}), indent=1))


# ============================================================================================ the report
def credits():
    """the takes pass's credits from every manifest's character-cost headers under audio/ep02/v1-el/ep02-v1"""
    calls = []
    for p in glob.glob(os.path.join(OUT, "**", "manifest.json"), recursive=True):
        for cl in jload(p).get("calls", []):
            calls.append(dict(cl, manifest=rel(p)))
    chars = sum(c.get("chars") or 0 for c in calls)
    cost = sum(int(c["cost_header"]) for c in calls if c.get("cost_header") not in (None, ""))
    return dict(calls=len(calls), chars=chars, credits=cost)


def fmt(x, nd=2):
    return "" if x is None else (f"{x:.{nd}f}" if isinstance(x, float) else str(x))


def esc(t):
    return (t or "").replace("|", "\\|").replace("\n", " ")


def take_cell(seg, row, q):
    """the take used: its file, and the seed and settings when they are not the role's first read"""
    f = os.path.basename(row["file"])
    bits = [f"`{f}`"]
    el = row.get("el") or {}
    if row.get("special") == "kokoro":
        bits.append("Kokoro am_liam, a-liam-earnest, speed " + str((row.get("pace") or {}).get("speed")))
    elif row.get("special") == "cut":
        bits.append("cut from " + (el.get("cut_from") or "") + (" (Ep1's take)" if el.get("source_episode") == "ep01" else ""))
    elif row.get("special") == "crowd":
        bits.append("10 layers")
    elif row.get("special") == "sung":
        bits.append("WORLD, 3 parts")
    else:
        b = (q or {}).get("picked_bump") or 0
        if b:
            bits.append(f"retake, seed +{b}")
        ls = (R.Cast().d.get("line_settings") or {}).get(row["id"])
        if ls:
            st = el.get("settings") or {}
            bits.append(f"line settings: stability {st.get('stability')}, style {st.get('style')}, speed {st.get('speed')}")
    return " · ".join(bits)


def names_cell(m):
    out = []
    for n in m.get("names") or []:
        t = f"{n['word']} {n['margin']:+.1f}"
        if n.get("real") and n["real"] not in (n.get("best_competitor") or "") and "margin_vs_real" in n:
            t += f" ({n['real']} {n['margin_vs_real']:+.1f})"
        out.append(t)
    return "; ".join(out)


def cmd_report(a):
    cast = R.Cast()
    pl = plan()
    rows_all = {}
    for seg in SEGS:
        for r in seg_rows(seg):
            rows_all[r["id"]] = (seg, r)
    qas = {seg: qa_load(seg) for seg in SEGS}
    cr = credits()
    status = {}
    for seg in SEGS:
        for lid, q in qas[seg]["lines"].items():
            status[lid] = q
    missing = [lid for lid in pl if lid not in rows_all]
    unmeasured = [lid for lid in rows_all if lid not in status]
    cnt = {"pass": 0, "look": 0, "flag": 0}
    for q in status.values():
        cnt[q["status"]] = cnt.get(q["status"], 0) + 1
    retaken = {lid: q for lid, q in status.items() if len(q.get("attempts") or []) + len(q.get("superseded") or []) > 1}
    seg_tables = []
    for seg in SEGS:
        t = [f"### {seg}", "",
             "| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |",
             "|---|---|---|---|---|---|---|---|---|---|---|"]
        for lid, e in [(k, v) for k, v in pl.items() if v["seg"] == seg]:
            if lid not in rows_all:
                t.append(f"| {lid} | {e['who']} | **no take** | | | | | | | | **MISSING** |")
                continue
            _, row = rows_all[lid]
            q = status.get(lid) or {}
            att = next((x for x in (q.get("attempts") or []) if x["bump"] == q.get("picked_bump")), None) or \
                ((q.get("attempts") or [None])[-1])
            m = (att or {}).get("measures") or {}
            tb = tempo_band(lid, e["who"], e.get("vo"))
            wpm = m.get("wpm")
            wcell = (f"{wpm:.0f}" if wpm else "") + (f" ({tb[0]}-{tb[1]})" if tb and (m.get("words") or 0) >= 5 else "")
            span = f"{m.get('span_s', 0):.2f} / {m.get('plan_len_s', 0):.2f} ({m.get('ratio', 0):.2f})" if m else ""
            lv = f"{m.get('lufs', 0):.1f} · {m.get('true_peak', 0):.1f}" if m else ""
            fl = (f"{m['raw_floor_dbfs']:.0f} · {m['raw_speech_to_floor_db']:.0f} dB" if m.get("raw_floor_dbfs") is not None
                  else (f"take {m['take_floor_dbfs']:.0f}" if m.get("take_floor_dbfs") is not None else ""))
            v = q.get("status", "?").upper()
            notes = "; ".join((q.get("fail") or []) + (q.get("look") or []))
            nr = len(q.get("attempts") or []) + len(q.get("superseded") or [])
            if nr > 1:
                notes = f"{nr} reads" + (f"; {notes}" if notes else "")
            t.append(f"| {lid} | {e['who']} | {esc(take_cell(seg, row, q))} | {esc(m.get('heard'))} | {span} | {wcell} | "
                     f"{fmt(m.get('f0'), 0)} | {lv} | {fl} | {names_cell(m)} | **{v}**{(': ' + esc(notes)) if notes else ''} |")
        seg_tables.append("\n".join(t))
    rt = ["| Line | Who | Reads | Why it was read again | Kept |", "|---|---|---|---|---|"]
    for lid, q in retaken.items():
        sup = q.get("superseded") or []
        why = " / ".join(x.get("why") or "asked: one more read" for x in q["attempts"] if x["bump"] in BUMPS)

        def was(x):
            t = [l for l in x.get("look") or [] if l.startswith(("tempo", "length"))]
            return "; ".join(x.get("fail") or []) or ("passed, " + "; ".join(t) if t else "passed")
        if sup:
            why = (f"{len(sup)} read(s) at an earlier reading or setting: " + " / ".join(was(x) for x in sup) +
                   (" — then " + why if why else ""))
        kept = next((x for x in q["attempts"] if x["bump"] == q["picked_bump"]), {})
        rt.append(f"| {lid} | {q['who']} | {len(q['attempts']) + len(sup)} | {esc(why)} | "
                  f"{'the first read' if not q['picked_bump'] else 'seed +' + str(q['picked_bump'])}: "
                  f"{q['status'].upper()}{(' (' + esc('; '.join((kept.get('fail') or []) + (kept.get('look') or []))) + ')') if (kept.get('fail') or kept.get('look')) else ''} |")
    ear = ["| Line | Who | Status | What the numbers say |", "|---|---|---|---|"]
    n_minor = 0
    for lid, q in status.items():
        if q["status"] not in ("look", "flag"):
            continue
        att = next((x for x in (q.get("attempts") or []) if x["bump"] == q.get("picked_bump")), None) or {}
        mm = att.get("measures") or {}
        r_ = mm.get("ratio") or 1.0
        sub = [l for l in (q.get("look") or []) if not l.startswith(("floor", "tempo", "length"))]
        far = (mm.get("words") or 0) >= 4 and (r_ < 0.7 or r_ > 1.3)
        if q["status"] == "flag" or sub or far:
            ear.append(f"| {lid} | {q['who']} | {q['status'].upper()} | {esc('; '.join((q.get('fail') or []) + (q.get('look') or [])))} |")
        else:
            n_minor += 1
    ear.append("")
    ear.append(f"The other {n_minor} LOOKs are a raw noise floor under the house bed's 45 dB (p5 measure), a length 0.70-0.85 or "
               "1.15-1.30 of the plan, or a tempo outside its mark: each is in its line's row in §3.")
    summary = (f"{len(rows_all)} of {len(pl)} lines have a take (missing: {', '.join(missing) or 'none'}; unmeasured: "
               f"{', '.join(unmeasured) or 'none'}). **{cnt.get('pass', 0)} PASS** every check, **{cnt.get('look', 0)} LOOK** "
               f"(they pass, with a number at the edge of its band: for the ear), **{cnt.get('flag', 0)} FLAG** (still failing "
               f"after three retakes). {len(retaken)} lines were read more than once. The takes pass sent {cr['chars']:,} "
               f"characters in {cr['calls']} calls, **{cr['credits']:,} credits** by the API's own character-cost headers.")
    blocks = dict(summary=summary, tables="\n\n".join(seg_tables), retakes="\n".join(rt), ear="\n".join(ear),
                  credits=f"Summed from every manifest at report time: {cr['calls']} calls, {cr['chars']:,} characters, "
                          f"**{cr['credits']:,} credits** (the takes pass).")
    txt = open(REPORT).read() if os.path.exists(REPORT) else "# Ep2 v1: the takes, and their QA\n\n" + "\n\n".join(
        f"<!-- BEGIN generated:{k} -->\n<!-- END generated:{k} -->" for k in blocks)
    for k, v in blocks.items():
        rx = re.compile(rf"(<!-- BEGIN generated:{k} -->\n).*?(\n?<!-- END generated:{k} -->)", re.S)
        if rx.search(txt):
            txt = rx.sub(lambda mm: mm.group(1) + v + "\n" + mm.group(2).lstrip("\n"), txt)
    open(REPORT, "w").write(txt)
    print(f"wrote {rel(REPORT)}: {len(rows_all)} takes, {cnt}, {len(retaken)} retaken; takes pass {cr}")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    p = sp.add_parser("retake")
    p.add_argument("--segs", nargs="+", default=SEGS)
    p.add_argument("--only", default="")
    p.add_argument("--force", default="", help="line ids: one more read even if the take passes; the one nearer the plan is kept")
    p.add_argument("--dry", action="store_true")
    p.add_argument("--remeasure", action="store_true")
    p.add_argument("--rescore-names", action="store_true", help="re-run the name checks on every read (rebuilt from the cache)")
    q = sp.add_parser("measure")
    q.add_argument("--segs", nargs="+", default=SEGS)
    q.add_argument("--remeasure", action="store_true")
    v = sp.add_parser("variant")
    v.add_argument("--seg", required=True)
    v.add_argument("--id", required=True)
    v.add_argument("--settings", required=True, help="JSON of line settings over the role's, {} for none")
    v.add_argument("--label", default="v")
    v.add_argument("--bump", type=int, default=0)
    v.add_argument("--say", default="", help="a per-line reading (say_lines: the same words, other punctuation)")
    v.add_argument("--out", default=os.path.join(OUT, "variants"))
    sp.add_parser("report")
    a = ap.parse_args(argv)
    dict(retake=cmd_retake, measure=cmd_measure, variant=cmd_variant, report=cmd_report)[a.cmd](a)


if __name__ == "__main__":
    main()
