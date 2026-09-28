#!/usr/bin/env python3
"""el_audition.py - audition a supporting role's recast in ElevenLabs (track A4, v3-voices-el; v3.5: SIRRAH), or cast a new
one (v3.5: AUHSOJ, who had no voice).

The showrunner: "harris's voice is not very good. the rest are fine." SIRRAH's current voice is the library's
'Marie - Professional & Warm'. This auditions 3-4 other library voices on her two lines and picks by measurement and fit
against the scene's other voices. It never imitates the real person: the screen drops any voice whose name or
description names or evokes a real person (cast_el.py's red flags) and, for this role, anything political; nothing is
chosen for resembling anyone; no laugh or accent is asked for (guardrails §6).

  screen  (.venv-casting)  the library's female American voices (free listing), filtered and keyword-ranked; the
                           previews (public CDN) measured for pitch and accent -> cache/audition-<role>/screen.json
  render  (.venv-casting)  the role's lines for each candidate, eleven_multilingual_v2, dressed as the episode's
                           takes (-16 LUFS, dry); measured (pitch, pace, tails, ASR, p(en) per take)
  reference                the current voice's episode takes of the same lines (free): the reference to beat
  ingest  (.venv-casting)  round 2: a voice's episode takes, rendered by el_render.py at a fitted speed with the
                           episode's own seeds (so the v3.5 render finds them in the cache), added to the index
  scene   (.venv-casting)  every voice against the scene's other voices (the v3.4 EL lock's sc 13 lines; MARIO as his
                           Kokoro takes): semitones apart, spectral centroid, 2-5 kHz presence, mean-MFCC distance
  pick                     the ranking per voice over all its takes (lane, separation from the photographer, accent,
                           clean takes); pace is reported beside it with the speed that reads it, since speed is a setting
  file    (.venv-casting)  a listening file: a Kokoro slate before each voice's lines, in rank order, then round 2

Outputs: audio/ep01/v3-el/auditions/<role>/ (index.json, the takes); the listening file in out/ep01/full-v3/voices/.

A new role (AUHSOJ) has no current voice: `reference` is skipped, round 1 is skipped too (el_render.py renders each
candidate's episode take straight away, with the episode's seed: one render per voice, and the pick's take is the film's),
and `scene` measures against the takes of the scene he overlaps as the film plays them (the call copies of the call
tiles, Mas's V.O. dry), from their lines JSON, since the scene has no EL lock yet.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402
import el_render as R  # noqa: E402

REPO = ellib.REPO
ROLE = dict(
    sirrah=dict(
        lines=[("e1-a2-13-02", "Any questions, before we take the picture?"), ("e1-a2-13-04", "Is it just the one?")],
        lane=(170.0, 205.0), pace=(140.0, 155.0),
        settings=dict(stability=0.55, similarity_boost=0.75, style=0.1, use_speaker_boost=True, speed=1.0),
        # the scene's other voices (the White House photo, 13.05-13.14) and the one other woman in it
        neighbours=dict(photographer=(183.8, 217.2)),
        # the scene for `scene`: the v3.4 EL lock's White House photo (sc 13); MARIO plays his Kokoro takes in the final film
        scene_timeline="show/reel/ep01-v34-el/ep01-v34-el-act2.json", scene_prefix="13.", kokoro_roles=("mario",),
        kw_plus=["warm", "confident", "measured", "calm", "clear", "professional", "natural", "conversational", "witty",
                 "dry", "poised", "friendly", "articulate", "composed", "steady", "smart", "wry", "grounded"],
        kw_minus=["narrat", "audiobook", "seduct", "sultry", "breath", "whisper", "asmr", "news", "anchor", "announcer",
                  "commercial", "hype", "energetic", "upbeat", "bubbly", "sassy", "young", "teen", "elderly", "old ",
                  "character", "villain", "cartoon"],
        # this role quotes a real public figure's phrasing in the script: any political colour is out
        ban=["politic", "president", "senator", "campaign", "vice", "government", "congress", "election", "speech",
             "impression", "celebrity", "famous", "like ", "sound-alike", "soundalike", "parody"],
    ),
    # v3.5: AUHSOJ, an investor on a call tile in the war room (sc 41), one overlapping fragment. No voice yet: cast here.
    # Brief: male, brisk, American; a man mid-sentence on a call. Never the real person's voice: nothing is chosen for
    # resembling anyone, and the screen drops the real person's names and anything political or impression-like.
    auhsoj=dict(
        lines=[("v35-a4-0007", "—the tender's in trouble—")],
        gender="male", ages=("middle_aged", "young"), new_role=True,
        lane=None,                               # no lane a priori: the voices he overlaps decide (overlap, below)
        pace=(180.0, 240.0),                     # brisk: the four words at 180-240 wpm (the Kokoro read: 190)
        settings=dict(stability=0.45, similarity_boost=0.75, style=0.1, use_speaker_boost=True, speed=1.05),
        lines_json="audio/ep01/v35/act4/lines-v35.json",
        # the scene as the film plays it: the war room's other voices (call tiles through their call copies; Mas's V.O. dry)
        # (the two takes he overlaps are scored: Tasya's "Then we should talk." under his first word, and the count, which
        # starts under his fragment; the scene's other takes are reported beside them)
        scene_takes={"mas V.O. (the count)": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-vo-04"]),
                     "tasya (then we should talk)": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-a4-0006"]),
                     "mas V.O. (the budget)": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-vo-03"]),
                     "tasya (a minute)": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-a4-0004"]),
                     "gerg": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-a4-0001", "v35-a4-0003"]),
                     "mas": ("audio/ep01/v3-el/ep01-v35/act4/lines-A.json", ["v35-a4-0002", "v35-a4-0005"])},
        film_device=True,
        file_intro="Auhsoj, cast. His one fragment per voice, in ranked order: dry, then on the call.",
        # the two voices his fragment overlaps (it starts 0.3 s under Tasya's last word; the V.O. starts under it):
        # at least 2 st from each; Gerg and Mas's spoken lines are reported, not scored
        overlap={"mas V.O. (the count)": 2.0, "tasya (then we should talk)": 2.0},
        kw_plus=["brisk", "quick", "fast", "crisp", "confident", "direct", "clear", "sharp", "punchy", "dynamic",
                 "conversational", "business", "professional", "natural", "snappy", "efficient", "articulate", "engaging",
                 "energetic", "upbeat", "modern", "smart"],
        kw_minus=["narrat", "audiobook", "deep", "bass", "soothing", "calm", "slow", "whisper", "asmr", "trailer",
                  "announcer", "commercial", "hype", "character", "cartoon", "villain", "old ", "elderly", "teen", "sultry",
                  "meditat", "gravel", "raspy", "relax", "gentle", "soft", "sleep", "story"],
        ban=["politic", "president", "senator", "campaign", "government", "congress", "election", "impression",
             "celebrity", "famous", "like ", "sound-alike", "soundalike", "parody", "josh", "kushner", "thrive",
             "billionaire", "royal", "prince"],
    ),
)
TAKES = lambda role: os.path.join(REPO, f"audio/ep01/v3-el/auditions/{role}")
CACHE = lambda role: os.path.join(REPO, f"audio/ep01/v3-el/cache/audition-{role}")


def jdump(o, p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + ".tmp", "w") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)
        f.write("\n")
    os.replace(p + ".tmp", p)


def cmd_screen(a):
    import cast_el
    import mas_recast as M
    spec = ROLE[a.role]
    cast = json.load(open(os.path.join(REPO, "audio/ep01/v3-el/cast-el.json")))
    used = {c["voice_id"] for r in cast["roles"].values() for c in r.get("candidates", [])}
    pool, seen = [], set()
    for age in spec.get("ages", ("middle_aged",)):
        page = 0
        while True:
            r = ellib.get("/v1/shared-voices", page_size=100, page=page, language="en", accent="american",
                          gender=spec.get("gender", "female"), age=age)
            vs = r.get("voices", [])
            pool += [v for v in vs if v["voice_id"] not in seen]
            seen.update(v["voice_id"] for v in vs)
            if not r.get("has_more") or not vs or page > 12:
                break
            page += 1
    cand = []
    for v in pool:
        txt = (v.get("name", "") + " " + (v.get("description") or "") + " " + (v.get("descriptive") or "")).lower()
        if v["voice_id"] in used or float(v.get("rate") or 1.0) > 1.0 or cast_el.red_flags(v):
            continue
        if any(b in txt for b in spec["ban"]):
            continue
        sc = sum(1 for k in spec["kw_plus"] if k in txt) - 1.5 * sum(1 for k in spec["kw_minus"] if k in txt)
        sc += 0.5 * (v.get("use_case") in ("conversational", "informative_educational"))
        cand.append((sc, math.log10(1 + (v.get("usage_character_count_1y") or 0)), v))
    cand.sort(key=lambda x: (-x[0], -x[1]))
    pick = [v for _, _, v in cand[: a.n]]
    pdir = os.path.join(CACHE(a.role), "previews")
    os.makedirs(pdir, exist_ok=True)
    rows = []
    print(f"screen: {len(pool)} {spec.get('gender', 'female')} American {'/'.join(spec.get('ages', ('middle_aged',)))} "
          f"library voices; {len(cand)} pass; measuring {len(pick)} previews")
    for v in pick:
        p = os.path.join(pdir, v["voice_id"] + ".mp3")
        if not os.path.exists(p):
            try:
                ellib.download(v["preview_url"], p)
            except Exception as ex:  # noqa: BLE001
                print("  no preview", v["name"], type(ex).__name__)
                continue
        y = E.decode(open(p, "rb").read())
        f0, rng = M.f0_of(y)
        ac = M.accent(y)
        rows.append(dict(voice_id=v["voice_id"], name=v["name"], category=v.get("category"), use_case=v.get("use_case"),
                         descriptive=v.get("descriptive"), age=v.get("age"), description=v.get("description"), f0=f0,
                         f0_range=rng, p_en=ac["p_en"], top_other=ac["top_other"],
                         usage_1y=v.get("usage_character_count_1y"), kw_score=next(round(k, 2) for k, _, w in cand if w is v)))
        print(f"  {v['name'][:46]:46s} {v['voice_id']} f0 {str(f0):6s} p_en {ac['p_en']:.4f} | {(v.get('description') or '')[:70]}")
    jdump(dict(n_pool=len(pool), n_pass=len(cand), rows=rows), os.path.join(CACHE(a.role), "screen.json"))


def render_cand(role, key, voice_id, name, settings, spec, budget):
    import mas_recast as M
    cdir = os.path.join(REPO, "audio/ep01/v3-el/cache")
    d = os.path.join(TAKES(role), key)
    os.makedirs(d, exist_ok=True)
    cast = R.Cast()
    takes, spent = [], 0
    for lid, text in spec["lines"]:
        row = dict(id=lid, who=role, text=text, tag="")
        sent = R.text_to_send(row, cast, role, voice_id=voice_id)
        seed = R.seed_of(f"audition-{lid}", voice_id)
        fmt = "mp3_44100_192"
        rk = R.request_key(voice_id, "eleven_multilingual_v2", settings, sent, seed, fmt)
        mp3p, jsp = os.path.join(cdir, rk + ".mp3"), os.path.join(cdir, rk + ".json")
        cost = None
        if not (os.path.exists(mp3p) and os.path.exists(jsp)):
            if len(sent) > budget[0]:
                raise SystemExit(f"budget: {len(sent)} needed, {budget[0]} left")
            audio, al, body = ellib.tts(voice_id, sent, model_id="eleven_multilingual_v2", settings=settings, seed=seed,
                                        output_format=fmt)
            hdr = dict(ellib.LAST)
            open(mp3p, "wb").write(audio)
            ellib.jdump(dict(request=body, output_format=fmt, headers=hdr, alignment=al), jsp)
            budget[0] -= len(sent)
            spent += len(sent)
            cost = hdr.get("character-cost")
        y = E.decode(open(mp3p, "rb").read())
        wav, off, info = E.dress(y, seed, -16.0)
        p = os.path.join(d, f"{lid}.wav")
        E.write24(p, wav)
        m = E.measure(wav, text)
        asr_txt, _ = E.asr(wav)
        pe = M.detect_en(wav)
        takes.append(dict(line=lid, text=text, sent=sent, file=os.path.relpath(p, REPO), seed=seed, key=rk,
                          chars=len(sent), cost_header=cost, voiced_s=m["span_s"], wpm=m["wpm"], sps=m["articulation_sps"],
                          pauses=m["pauses_s"], f0=m["median_f0_hz"], f0_range=m["f0_range_st"], tail_cut=info["raw_tail_cut"],
                          asr=asr_txt, recall=E.word_recall(text, asr_txt, set(cast.d.get("names", []))), p_en=round(pe, 4)))
    return takes, spent


def cmd_render(a):
    spec = ROLE[a.role]
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p)) if os.path.exists(ix_p) else dict(role=a.role, candidates=[])
    scr = {r["voice_id"]: r for r in json.load(open(os.path.join(CACHE(a.role), "screen.json")))["rows"]}
    budget = [a.max_chars]
    have = {c["voice_id"]: c for c in ix["candidates"]}
    for vid in a.voice_ids:
        s = scr.get(vid) or {}
        key = re.sub(r"[^a-z0-9]+", "-", (s.get("name") or vid).split(" - ")[0].split(" – ")[0].lower()).strip("-")
        c = have.get(vid) or dict(key=key, voice_id=vid, name=s.get("name"), source=f"shared Voice Library ({s.get('category')})",
                                  library=dict(use_case=s.get("use_case"), descriptive=s.get("descriptive"),
                                               description=s.get("description")),
                                  preview=dict(f0=s.get("f0"), p_en=s.get("p_en")))
        c["settings"] = spec["settings"]
        c["takes"], n = render_cand(a.role, c["key"], vid, c["name"], spec["settings"], spec, budget)
        c["chars_sent"] = c.get("chars_sent", 0) + n
        if vid not in have:
            ix["candidates"].append(c)
        jdump(ix, ix_p)
        t = c["takes"]
        print(f"{c['key']:18s} sent {n:3d} | " + " | ".join(f"{x['line']}: {x['voiced_s']:.2f}s f0 {x['f0']} p_en {x['p_en']:.3f} "
                                                            f"cut {x['tail_cut']} asr {x['asr']!r}" for x in t))


def cmd_reference(a):
    """the current voice's episode takes of the same lines (free): the reference to beat"""
    import mas_recast as M
    spec = ROLE[a.role]
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p)) if os.path.exists(ix_p) else dict(role=a.role, candidates=[])
    rows = {}
    for seg in ("act2",):
        for r in json.load(open(os.path.join(REPO, f"audio/ep01/v3-el/ep01-v34/{seg}/lines-A.json"))):
            rows[r["id"]] = r
    takes = []
    for lid, text in spec["lines"]:
        r = rows[lid]
        y = M.load_audio(os.path.join(REPO, r["file"]))
        takes.append(dict(line=lid, text=text, file=r["file"], speed=r["pace"]["speed"], voiced_s=r["pace"]["measured"]["span_s"], wpm=r["pace"]["wpm"],
                          sps=r["pace"]["measured"]["articulation_sps"], pauses=r["pace"]["measured"]["pauses_s"],
                          f0=r["qa"]["median_f0_hz"], f0_range=r["qa"]["f0_range_st"], tail_cut=r["qa"]["raw_tail_cut"],
                          asr=r["qa"]["asr"], recall=r["qa"]["word_recall_nonames"], p_en=round(M.detect_en(y), 4)))
    ix["current"] = dict(key="marie (current)", voice_id=rows[spec["lines"][0][0]]["el"]["voice_id"],
                         name=rows[spec["lines"][0][0]]["el"]["voice_name"], settings=rows[spec["lines"][0][0]]["el"]["settings"],
                         takes=takes)
    jdump(ix, ix_p)
    print("current:", [(t["line"], t["f0"], t["voiced_s"], t["p_en"]) for t in takes])


def recall_noapos(x):
    """ASR word recall with apostrophes dropped on both sides (homophones such as tender's / tenders); names excepted"""
    if not x.get("asr"):
        return x["recall"]
    names = set(json.load(open(os.path.join(REPO, "audio/ep01/v3-el/cast-el.json"))).get("names", []))
    return E.word_recall(x["text"].replace("'", ""), x["asr"].replace("'", ""), {n.replace("'", "") for n in names})


def final_contour(path):
    """the line's last 0.25 s of voiced, loud speech against the take's median, in semitones: a finished statement
    falls (about -2 st or lower); a fragment cut off mid-sentence stays level or rises"""
    import librosa
    from scipy.signal import resample_poly
    import mas_recast as M
    y = M.load_audio(os.path.join(REPO, path))
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0 = librosa.yin(y16, fmin=55, fmax=420, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][: len(f0)]
    f0 = f0[: len(rms)]
    loud = 20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12) > -28
    idx = np.where(loud)[0]
    if len(idx) < 10:
        return None
    med = np.median(f0[idx])
    ok = idx[np.abs(12 * np.log2(f0[idx] / med)) <= 9]
    tail = ok[ok >= ok[-1] - 25]                       # the last 0.25 s of loud voiced frames (10 ms hop)
    return round(float(12 * np.log2(np.median(f0[tail]) / med)), 2)


def score(t, spec, pace_take=None):
    """the penalties of one voice over all its takes (audition and episode rounds). Pace is kept out of the sum: it is
    the speed setting's, and is reported with the speed that read it (pace_take: the round the film would use)."""
    f0 = float(np.median([x["f0"] for x in t if x["f0"]]))
    lane = spec["lane"]
    pen = {}
    if lane:
        pen["lane"] = 0.0 if lane[0] <= f0 <= lane[1] else abs(12 * math.log2(f0 / (lane[0] if f0 < lane[0] else lane[1])))
    if spec.get("overlap"):
        # the voices this role overlaps (the scene's measured takes, as the film plays them): at least N st from each
        pen["separation"] = sum(max(0.0, need - abs(12 * math.log2(f0 / spec["_nb_f0"][n]))) for n, need in spec["overlap"].items())
    else:
        # the photographer (the scene's other woman): at least 1.5 st away from her median
        ph = math.sqrt(spec["neighbours"]["photographer"][0] * spec["neighbours"]["photographer"][1])
        pen["separation"] = max(0.0, 1.5 - abs(12 * math.log2(f0 / ph)))
    pen["accent"] = max(0.0, (0.985 - float(np.mean([x["p_en"] for x in t]))) * 100)
    # 2 per clipped tail or ASR recall under 0.9, per pair of takes (a voice heard in two rounds isn't counted twice).
    # Recall is read blind to apostrophes: "tender's" written "tenders" is the recogniser's spelling, not a lost word
    pen["artifacts"] = 4.0 * (sum(1 for x in t if x["tail_cut"]) + sum(1 for x in t if recall_noapos(x) < 0.9)) / len(t)
    pt = pace_take or next(x for x in t if x["line"] == spec["lines"][0][0])
    w = pt["wpm"]
    pace = 0.0 if spec["pace"][0] <= w <= spec["pace"][1] else min(abs(w - spec["pace"][0]), abs(w - spec["pace"][1])) / 10
    return round(sum(pen.values()), 2), {k: round(v, 2) for k, v in pen.items()}, round(f0, 1), w, round(pace, 2)


def cmd_pick(a):
    spec = dict(ROLE[a.role])
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p))
    if spec.get("overlap"):
        spec["_nb_f0"] = {n: v["f0_geo"] for n, v in ix["scene"]["neighbours"].items()}
    ents = ix["candidates"] + ix.get("episode_takes", []) + ([ix["current"]] if ix.get("current") else [])
    by = {}
    for c in ents:
        by.setdefault(c["voice_id"], []).append(c)
    rows = []
    for vid, cs in by.items():
        t = [x for c in cs for x in c["takes"]]
        ep = [c for c in cs if c.get("round") == "episode"] or [c for c in cs if c is ix.get("current")]
        base = ep[0] if ep else cs[0]
        pt = next(x for x in base["takes"] if x["line"] == spec["lines"][0][0])
        sc, pen, f0, w, pace = score(t, spec, pt)
        speed = (base.get("settings") or {}).get("speed", pt.get("speed"))
        key = cs[0]["key"].replace("-ep", "")
        for c in cs:
            c["score"], c["penalties"] = sc, pen
        tb = 0.0
        if spec.get("overlap"):
            for c in cs:
                for x in c["takes"]:
                    x["recall_noapos"] = recall_noapos(x)
                    x["final_st"] = final_contour(x["file"])
            # the tie-break: first the brief's two measurable qualities, then the nearest timbre among the overlapped
            # voices. Brisk: the pace penalty, plus 1 for a pause of 0.15 s or more inside the fragment. A fragment: 1 if
            # the final falls 1 st or more (it lands as a finished statement)
            brief = pace + sum(1 for x in t if any(p >= 0.15 for p in (x.get("pauses") or []))) \
                + sum(1 for x in t if x.get("final_st") is not None and x["final_st"] <= -1.0)
            vs = (ix["scene"]["voices"].get(f"{key} (all takes)") or {}).get("vs") or {}
            tb = (brief, -min((vs[n]["mfcc_dist"] for n in spec["overlap"] if n in vs), default=0.0))
            for c in cs:
                c["brief_points"] = brief
        rows.append((sc, key, f0, w, speed, pace, pen, len(t), tb))
    rows.sort(key=lambda r: (r[0], r[8], r[5]) if spec.get("overlap") else (r[0], r[5]))
    fin = {k: [x.get("final_st") for c in by[vid] for x in c["takes"]] for vid in by for k in [by[vid][0]["key"].replace("-ep", "")]}
    rows = [r[:8] for r in rows]
    ix["ranking"] = [dict(rank=i + 1, key=k, score=sc, takes=n, f0=f0, wpm_line1=w, at_speed=sp, pace_penalty=pc,
                          penalties=pen, **({"final_st": fin.get(k)} if spec.get("overlap") else {}))
                     for i, (sc, k, f0, w, sp, pc, pen, n) in enumerate(rows)]
    ix["ranking_rule"] = ("per voice over all its takes, lower is better: the lane 170-205 Hz (semitones outside), at least "
                          "1.5 st from the photographer (the scene's other woman, 184-217 Hz), p(en) under 0.985 (1 point per "
                          "0.01), 2 per clipped tail or ASR recall under 0.9 per pair of takes. Pace is not in the score (the speed "
                          "setting sets it): 'Any questions…' against 140-155 wpm (1 point per 10 wpm outside) is reported for "
                          "the round the film would use, at its speed") if not spec.get("overlap") else (
        "per voice over its takes, lower is better: at least 2 st from each voice the fragment overlaps (" +
        ", ".join(f"{n} {v:.0f} Hz" for n, v in spec["_nb_f0"].items() if n in spec["overlap"]) +
        "; 1 point per semitone short), p(en) under 0.985 (1 point per 0.01), 4 per clipped tail or ASR recall under 0.9 "
        "per take (recall read blind to apostrophes). Ties are broken by the brief, then by timbre: brisk (the fragment "
        f"against {spec['pace'][0]:.0f}-{spec['pace'][1]:.0f} wpm, 1 point per 10 wpm outside, and 1 for a pause of 0.15 s "
        "or more inside it) and a fragment (1 if its final falls 1 st or more under the take's median: a finished "
        "statement); then the larger of the smaller mean-MFCC distances to the overlapped voices")
    jdump(ix, ix_p)
    for sc, k, f0, w, sp, pc, pen, n in rows:
        print(f"{k:18s} score {sc:5.2f} ({n} takes) f0 {f0:6.1f} | line 1 {w:6.1f} wpm at speed {sp} (pace {pc:4.2f}) | {pen}"
              + (f" | final {fin.get(k)} st" if spec.get("overlap") else ""))


def cmd_ingest(a):
    """round 2: el_render.py's episode takes of the role's lines for one voice (its lines JSON) -> the index"""
    import mas_recast as M
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p))
    rows = json.load(open(os.path.join(REPO, a.lines)))
    el = rows[0]["el"]
    r1 = next((c for c in ix["candidates"] if c["voice_id"] == el["voice_id"]), {})
    takes = []
    for r in rows:
        y = M.load_audio(os.path.join(REPO, r["file"]))
        m, q = r["pace"]["measured"], r["qa"]
        takes.append(dict(line=r["id"], text=r["text"], sent=r["spoken_as"], file=r["file"], file_device=r.get("file_device"),
                          seed=r["el"]["seed"],
                          key=r["el"]["request_key"], chars=r["el"]["chars_sent"], speed=r["pace"]["speed"],
                          voiced_s=m["span_s"], wpm=r["pace"]["wpm"], sps=m["articulation_sps"], pauses=m["pauses_s"],
                          f0=q["median_f0_hz"], f0_range=q["f0_range_st"], tail_cut=q["raw_tail_cut"], asr=q["asr"],
                          recall=q["word_recall_nonames"], p_en=round(M.detect_en(y), 4)))
    ent = dict(key=(r1.get("key") or el["voice_name"].split(" - ")[0].lower()) + "-ep", round="episode", voice_id=el["voice_id"],
               name=el["voice_name"], cand=el["cand"], settings=el["settings"], lines_json=a.lines,
               note="el_render.py with the episode's seeds (seed_of(line id, voice)) at the fitted speed: the takes the "
                    "v3.5 render gets from the cache for free if this voice is cast", takes=takes)
    ix["episode_takes"] = [c for c in ix.get("episode_takes", []) if c["voice_id"] != el["voice_id"]] + [ent]
    jdump(ix, ix_p)
    print(ent["key"], [(x["line"], x["f0"], x["wpm"], x["p_en"], x["tail_cut"]) for x in takes])


def cmd_scene(a):
    """every voice against the scene's other voices: the v3.4 EL lock's sc 13 lines (MARIO as his Kokoro takes, as the
    final film plays him). Semitones between median F0s; spectral centroid and 2-5 kHz presence (0-8 kHz, active
    frames); the distance between mean MFCCs (c1-c19, 0-8 kHz): larger = more distinct timbre."""
    import librosa
    import mas_recast as M
    spec = ROLE[a.role]
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p))

    def feats(p):
        y = M.load_audio(os.path.join(REPO, p))
        d = E.rms_db(y, 0.01)
        idx = np.where(d > -40)[0]
        y = y[int(idx[0] * 0.01 * E.SR): int((idx[-1] + 1) * 0.01 * E.SR)]
        med, _ = E.f0_fast(y)
        y16 = librosa.resample(y, orig_sr=E.SR, target_sr=16000)
        S = np.abs(librosa.stft(y16, n_fft=512, hop_length=160)) ** 2
        fr = librosa.fft_frequencies(sr=16000, n_fft=512)
        e = S.sum(axis=0)
        act = e > e.max() * 10 ** (-3.5)
        Sa = S[:, act]
        mf = librosa.feature.mfcc(y=y16, sr=16000, n_mfcc=20, n_fft=512, hop_length=160, fmax=8000)[:, act]
        return dict(f0=med, cen=float((fr[:, None] * Sa).sum() / Sa.sum()),
                    pres=10 * math.log10(Sa[(fr >= 2000) & (fr < 5000)].sum() / Sa[(fr >= 100) & (fr < 2000)].sum()),
                    mfcc=mf[1:].mean(axis=1))

    def agg(fs):
        f0s = [f["f0"] for f in fs if f["f0"]]
        return dict(f0=float(np.exp(np.mean(np.log(f0s)))), cen=float(np.mean([f["cen"] for f in fs])),
                    pres=float(np.mean([f["pres"] for f in fs])), mfcc=np.mean([f["mfcc"] for f in fs], axis=0))
    nb = {}
    if spec.get("scene_takes"):                  # a scene with no EL lock yet: its takes, as the film plays them
        for k, (lj, ids) in spec["scene_takes"].items():
            rows = {r["id"]: r for r in json.load(open(os.path.join(REPO, lj)))}
            nb[k] = [(rows[i].get("file_device") if spec.get("film_device") and rows[i].get("file_device") else rows[i]["file"])
                     for i in ids if i in rows]
    else:
        T = json.load(open(os.path.join(REPO, spec["scene_timeline"])))
        for b in T["beats"]:
            if not b["id"].startswith(spec["scene_prefix"]):
                continue
            for l in b.get("lines") or []:
                if l["who"] == a.role or l.get("tag") == "V.O.":
                    continue
                if l["who"] in spec.get("kokoro_roles", ()):
                    nb.setdefault(l["who"] + " (kokoro)", []).append(l["kokoro"]["audio"])
                else:
                    nb.setdefault(l["who"], []).append(l["audio"])
    N = {k: agg([feats(p) for p in ps]) for k, ps in nb.items()}
    ents = ix["candidates"] + ix.get("episode_takes", []) + ([ix["current"]] if ix.get("current") else [])
    fpath = lambda x: (x.get("file_device") or x["file"]) if spec.get("film_device") else x["file"]
    by = {}
    for c in ents:
        by.setdefault(c["voice_id"], []).append(c)
    out = dict(neighbours={k: dict(f0_geo=round(v["f0"], 1), centroid_hz=round(v["cen"]), presence_db=round(v["pres"], 2),
                                   files=nb[k]) for k, v in N.items()}, voices={})
    for vid, cs in by.items():
        key = cs[0]["key"].replace("-ep", "")
        for label, group in ((key + " (all takes)", [x for c in cs for x in c["takes"]]),
                             *[(c["key"] + " (episode takes)", c["takes"]) for c in cs if c.get("round") == "episode"]):
            g = agg([feats(fpath(x)) for x in group])
            out["voices"][label] = dict(
                f0_geo=round(g["f0"], 1), centroid_hz=round(g["cen"]), presence_db=round(g["pres"], 2), takes=len(group),
                vs={n: dict(st=round(12 * math.log2(g["f0"] / v["f0"]), 2), mfcc_dist=round(float(np.linalg.norm(g["mfcc"] - v["mfcc"])), 1))
                    for n, v in N.items()})
    ix["scene"] = dict(about=cmd_scene.__doc__.strip(), timeline=spec.get("scene_timeline"), beats=spec.get("scene_prefix", "") + "*",
                       takes=spec.get("scene_takes"), film_device=bool(spec.get("film_device")), **out)
    jdump(ix, ix_p)
    print("neighbours:", {k: (v["f0_geo"], v["centroid_hz"], v["presence_db"]) for k, v in out["neighbours"].items()})
    for k, v in out["voices"].items():
        print(f"{k:34s} f0 {v['f0_geo']:6.1f} cen {v['centroid_hz']:4d} pres {v['presence_db']:6.2f} | "
              + " | ".join(f"{n}: {x['st']:+.1f} st d {x['mfcc_dist']}" for n, x in v["vs"].items()))


def cmd_file(a):
    """the listening file, for the showrunner's ear and a later swap: the current voice, the candidates in rank order
    (their audition reads, speed 1.0), then round 2 (the episode takes at the fitted speed: what the film would play)"""
    import soundfile as sf
    from kokoro import KPipeline
    from scipy.signal import resample_poly
    import mas_recast as M
    ix_p = os.path.join(TAKES(a.role), "index.json")
    ix = json.load(open(ix_p))
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")

    def slate(txt):
        chunks = [np.asarray(r.audio, dtype=np.float32) for r in pipe(txt, voice="af_heart", speed=1.0)]
        return E.normalise(resample_poly(np.concatenate(chunks).astype(np.float64), 2, 1).astype(np.float32), -20.0)
    gap = lambda s: np.zeros(int(s * E.SR), np.float32)
    first = lambda c: re.split(r" [-–] ", c["name"])[0]
    rank = [r["key"] for r in ix.get("ranking", [])]
    cands = sorted(ix["candidates"], key=lambda c: rank.index(c["key"]) if c["key"] in rank else 99)
    eps = sorted(ix.get("episode_takes", []), key=lambda c: rank.index(c["key"].replace("-ep", "")) if c["key"].replace("-ep", "") in rank else 99)
    words = ["one", "two", "three", "four", "five", "six"]
    order = [(f"The current voice: {first(ix['current'])}.", "current", ix["current"])] if ix.get("current") else []
    order += [(f"Candidate {words[n]}: {first(c)}.", f"candidate {n + 1}", c) for n, c in enumerate(cands)]
    if ROLE[a.role].get("new_role"):             # a new role: its candidates' episode takes, in rank order, as the film plays them
        order += [(f"Candidate {words[n]}: {first(c)}.", f"candidate {n + 1} ({c['settings']['speed']:g})", c) for n, c in enumerate(eps)]
    else:
        order += [((f"Round two, at the episode's pace. {first(c)}, speed {c['settings']['speed']:g}." if n == 0 else
                    f"{first(c)}, speed {c['settings']['speed']:g}."), f"round 2 ({c['settings']['speed']:g})", c) for n, c in enumerate(eps)]
    intro = ROLE[a.role].get("file_intro") or ("Sirrah, recast. Her two lines per voice: the current voice, four candidates "
                                               "in ranked order, then the top two at the episode's pace.")
    parts, idx = [slate(intro), gap(1.0)], []
    for say, label, c in order:
        t = sum(len(p) for p in parts) / E.SR
        parts += [slate(say), gap(0.7)]
        for x in c["takes"]:
            parts += [M.load_audio(os.path.join(REPO, x["file"])), gap(0.6)]
            if ROLE[a.role].get("film_device") and x.get("file_device"):     # then as the film plays it (the call chain)
                parts += [M.load_audio(os.path.join(REPO, x["file_device"])), gap(0.6)]
        parts.append(gap(0.8))
        idx.append(dict(slate=say, what=label, key=c["key"], name=c["name"], voice_id=c["voice_id"], starts_s=round(t, 2),
                        speed=(c.get("settings") or {}).get("speed", (c["takes"][0].get("speed")))))
    y = np.concatenate(parts)
    out = os.path.join(REPO, f"out/ep01/full-v3/voices/{a.role}-{'cast' if ROLE[a.role].get('new_role') else 'recast'}.mp3")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sf.write(out, y, E.SR, format="MP3")
    ix["listening_file"] = dict(file=os.path.relpath(out, REPO), seconds=round(len(y) / E.SR, 1), order=idx,
                                slate="Kokoro af_heart, -20 LUFS; the takes as dressed (-16 LUFS)")
    jdump(ix, ix_p)
    print("wrote", os.path.relpath(out, REPO), round(len(y) / E.SR, 1), "s")
    for i in idx:
        print(f"  {i['starts_s']:6.1f} s  {i['slate']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    for n in ("screen", "render", "reference", "ingest", "scene", "pick", "file"):
        x = sp.add_parser(n)
        x.add_argument("--role", default="sirrah")
        if n == "screen":
            x.add_argument("--n", type=int, default=30)
        if n == "render":
            x.add_argument("voice_ids", nargs="+")
            x.add_argument("--max-chars", type=int, default=400)
        if n == "ingest":
            x.add_argument("lines", help="el_render.py's lines JSON of the role's lines for one voice (repo-relative)")
    a = ap.parse_args()
    dict(screen=cmd_screen, render=cmd_render, reference=cmd_reference, ingest=cmd_ingest, scene=cmd_scene, pick=cmd_pick,
         file=cmd_file)[a.cmd](a)


if __name__ == "__main__":
    main()
