#!/usr/bin/env python3
"""mas_recast.py - recast MAS for the ElevenLabs pass (track A4, v3-voices-el, phase 3, 2026-09-27).

The showrunner heard Mas A (Giovanni) as accented ("strangely russian"), although the library labels him American. A label
can't be trusted for accent, so every step here MEASURES it:

  accent   a take (or a preview) through faster-whisper SMALL (multilingual) with the language left to detection:
           p(en), the top other language, and the English decode's mean log-probability; plus small.en's word recall.
           Read against references: Kokoro's American stock voices (the lock's takes) and Giovanni (heard as accented).

  screen   the phase-1 library pool (American English, male, the cast_el.py red-flag screen): keyword-ranked, previews
           downloaded (public CDN, no key, no characters), each measured for accent and pitch. -> screen.json
  design   voice design (text-to-voice) from ONE generic description, no reference audio: previews of the six test lines,
           measured; the best two are saved as account voices so they render like the others (--save).
  render   the six test lines for each candidate (eleven_multilingual_v2, steady settings; --v3 for eleven_v3), dressed as
           el_render dresses takes (dialogue -16, V.O. -18 LUFS), measured. -> audio/ep01/v3-el/mas-recast/<cand>/
  rank     all candidates by the pick rules (accent, the 105-125 Hz lane, a 110-140 wpm pace, clean tails, no artifacts).
  audition out/ep01/full-v3/voices/mas-recast.mp3: a Kokoro slate ("candidate one" ...) before each candidate's six lines.

The key stays inside ellib. No voice is cloned: library voices by voice_id, and designed voices from a text description.
"""
from __future__ import annotations

import argparse
import base64
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
S = "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/v3-voices-el"
OUT = os.path.join(REPO, "audio/ep01/v3-el/mas-recast")
INDEX = os.path.join(REPO, "audio/ep01/v3-el/mas-recast.json")
AUDITION = os.path.join(REPO, "out/ep01/full-v3/voices/mas-recast.mp3")
LANE = (105.0, 125.0)
PACE = (110.0, 140.0)

LINES = [
    ("t1", "talk", "it's a preview."),
    ("t2", "talk", "super."),
    ("t3", "talk", "ask me when it compiles."),
    ("v1", "vo", "gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first."),
    ("v2", "vo", "alyi set it up. probably just the budget."),
    ("v3", "vo", "four hundred and six. four hundred and seven. four hundred and six."),
]
# steady settings, the same for every candidate (a fair comparison; the winner's speed can be tuned after)
TALK = dict(stability=0.6, similarity_boost=0.75, style=0.0, use_speaker_boost=True, speed=0.95)
VO = dict(stability=0.65, similarity_boost=0.75, style=0.0, use_speaker_boost=True, speed=0.9)
V3 = dict(stability=0.5, similarity_boost=0.75, style=0.0, use_speaker_boost=True)   # eleven_v3: 0.5 = "Natural"
DESIGN_TEXT_NOTE = "the six test lines, as sent"
DESIGN_DESCRIPTION = ("American man in his late thirties, soft-spoken and measured, calm and warm, light baritone, plain neutral "
                      "American accent, conversational, understated, slight smile in the voice.")


def jload(p):
    with open(p) as f:
        return json.load(f)


def sent_text(t):
    """as el_render sends a Mas line: sentence case, names capitalised, the house respellings (no per-voice fixes)"""
    cast = R.Cast()
    norm = R.sentence_case(R.normalise_text(t), cast.d.get("names", []))
    return cast.respell(norm)[0]


# ------------------------------------------------------------------------------------------------ the accent measure
_ML = None


def ml():
    global _ML
    if _ML is None:
        from faster_whisper import WhisperModel
        _ML = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
    return _ML


def to16(y48):
    from scipy.signal import resample_poly
    return resample_poly(np.asarray(y48, dtype=np.float64), 1, 3).astype(np.float32)


def accent(y48):
    """-> {p_en, top_other, p_other, en_logprob, ml_text}: language detection over the first 30 s, and the English decode"""
    m = ml()
    y16 = to16(y48)
    segs, info = m.transcribe(y16, language=None, beam_size=5, condition_on_previous_text=False, vad_filter=False)
    segs = list(segs)
    probs = dict(info.all_language_probs or [])
    others = sorted(((k, v) for k, v in probs.items() if k != "en"), key=lambda kv: -kv[1])
    segs_en, _ = m.transcribe(y16, language="en", beam_size=5, condition_on_previous_text=False, vad_filter=False)
    segs_en = list(segs_en)
    lp = [s.avg_logprob for s in segs_en] or [None]
    return dict(p_en=round(float(probs.get("en", 0.0)), 4), detected=info.language,
                top_other=others[0][0] if others else None, p_other=round(float(others[0][1]), 4) if others else 0.0,
                en_logprob=round(float(np.mean([x for x in lp if x is not None])), 3) if lp[0] is not None else None,
                ml_text=" ".join(s.text.strip() for s in segs_en))


def load_audio(path):
    import soundfile as sf
    if path.endswith(".mp3"):
        return E.decode(open(path, "rb").read())
    y, sr = sf.read(path, dtype="float32", always_2d=True)
    y = y.mean(axis=1)
    if sr != E.SR:
        from scipy.signal import resample_poly
        from math import gcd
        g = gcd(E.SR, sr)
        y = resample_poly(y.astype("float64"), E.SR // g, sr // g).astype("float32")
    return y


def f0_of(y):
    d = E.rms_db(y, 0.01)
    idx = np.where(d > -40)[0]
    if not len(idx):
        return None, None
    a, b = idx[0] * 0.01, (idx[-1] + 1) * 0.01
    return E.f0_fast(y[int(a * E.SR): int(b * E.SR)])


# ------------------------------------------------------------------------------------------------ screen
KW_PLUS = ["calm", "soft", "soft-spoken", "measured", "gentle", "warm", "thoughtful", "grounded", "relaxed", "understated",
           "natural", "conversational", "mellow", "quiet", "reflective", "easygoing", "laid-back", "friendly", "sincere"]
KW_MINUS = ["narrat", "audiobook", "deep", "radio", "announcer", "commercial", "energetic", "upbeat", "trailer", "hype",
            "polished", "broadcast", "storytell", "documentary", "podcast", "villain", "character", "old", "elderly"]


def cmd_screen(a):
    sys.path.insert(0, HERE)
    import cast_el
    pool = jload(os.path.join(S, "pool.json"))
    cand = []
    for v in pool:
        if v.get("gender") != "male" or v.get("age") != "middle_aged":
            continue
        if v.get("use_case") not in ("conversational", "social_media", "informative_educational"):
            continue
        if float(v.get("rate") or 1.0) > 1.0 or cast_el.red_flags(v):
            continue
        if v["voice_id"] in ("g6fJBFvZZp41FerGMMx7",):
            continue
        txt = (v.get("name", "") + " " + v.get("description", "") + " " + (v.get("descriptive") or "")).lower()
        sc = sum(1 for k in KW_PLUS if k in txt) - 1.5 * sum(1 for k in KW_MINUS if k in txt)
        sc += 0.5 * (v.get("use_case") == "conversational")
        cand.append((sc, math.log10(1 + (v.get("usage_character_count_1y") or 0)), v))
    cand.sort(key=lambda x: (-x[0], -x[1]))
    pick = [v for _, _, v in cand[: a.n]]
    ev = next(v for v in pool if v["voice_id"] == "TWutjvRaJqAX89preB4e")
    if ev not in pick:
        pick.insert(0, ev)
    gio = next(v for v in pool if v["voice_id"] == "g6fJBFvZZp41FerGMMx7")
    pick.insert(0, gio)                                        # the reference heard as accented
    pdir = os.path.join(S, "previews")
    os.makedirs(pdir, exist_ok=True)
    rows = []
    print(f"screen: {len(cand)} voices pass the filters; measuring the top {len(pick)} previews")
    for v in pick:
        p = os.path.join(pdir, v["voice_id"] + ".mp3")
        if not os.path.exists(p):
            try:
                ellib.download(v["preview_url"], p)
            except Exception as ex:  # noqa: BLE001
                print("  no preview", v["name"], type(ex).__name__)
                continue
        y = load_audio(p)
        f0, rng = f0_of(y)
        ac = accent(y)
        r = dict(voice_id=v["voice_id"], name=v["name"], category=v.get("category"), age=v.get("age"),
                 use_case=v.get("use_case"), descriptive=v.get("descriptive"), description=v.get("description"),
                 preview_s=round(len(y) / E.SR, 1), f0=f0, f0_range=rng, **ac,
                 reference=("Giovanni: heard as accented" if v["voice_id"] == gio["voice_id"] else None))
        rows.append(r)
        print(f"  {v['name'][:44]:44s} f0 {str(f0):6s} p_en {ac['p_en']:.3f} other {ac['top_other']}:{ac['p_other']:.3f} "
              f"lp {ac['en_logprob']}")
    ellib.jdump(dict(n_pass=len(cand), rows=rows), os.path.join(S, "recast-screen.json"))


def cmd_refs(a):
    """free references: the Kokoro lock's own takes (American stock voices) and Giovanni's episode takes, same lines"""
    ids = {"t1": "e1-a1-5-07", "t2": "a5-26-01", "t3": "a5-29-19", "v1": "v3-vo-01", "v2": None, "v3": "v3-vo-20"}
    kok, gio = {}, {}
    for s in ("act1", "act4"):
        for b in jload(os.path.join(REPO, f"show/reel/ep01-v3/ep01-v3-{s}.json"))["beats"]:
            for l in b["lines"]:
                kok[l["id"]] = l["audio"]
        for r in jload(os.path.join(REPO, f"audio/ep01/v3-el/ep01/{s}/lines-A.json")):
            gio[r["id"]] = r["file"]
    out = {}
    for name, src in (("kokoro", kok), ("giovanni-episode", gio)):
        ys = [load_audio(os.path.join(REPO, src[i])) for i in ids.values() if i and i in src]
        cat = np.concatenate([np.concatenate([y, np.zeros(int(0.4 * E.SR), np.float32)]) for y in ys])
        out[name] = accent(cat)
        out[name]["f0"] = f0_of(cat)[0]
        print(name, out[name])
    ellib.jdump(out, os.path.join(S, "recast-refs.json"))


# ------------------------------------------------------------------------------------------------ the index
def load_index():
    return jload(INDEX) if os.path.exists(INDEX) else {"candidates": []}


def save_index(ix):
    ellib.jdump(ix, INDEX)


def cmd_add(a):
    """add library candidates from the screen (and the reference) to the index"""
    ix = load_index()
    scr = {r["voice_id"]: r for r in jload(os.path.join(S, "recast-screen.json"))["rows"]}
    have = {c["voice_id"] for c in ix["candidates"]}
    for vid in a.voice_ids:
        if vid in have:
            continue
        r = scr[vid]
        ix["candidates"].append(dict(key=re.sub(r"[^a-z0-9]+", "-", r["name"].split(" - ")[0].split(" – ")[0].lower()).strip("-"),
                                     voice_id=vid, name=r["name"], source=f"shared Voice Library ({r['category']})",
                                     library=dict(age=r["age"], use_case=r["use_case"], descriptive=r["descriptive"],
                                                  description=r["description"]),
                                     preview=dict(f0=r["f0"], p_en=r["p_en"], en_logprob=r["en_logprob"]),
                                     reference=vid == "g6fJBFvZZp41FerGMMx7"))
    save_index(ix)
    print([c["key"] for c in ix["candidates"]])


def cmd_design(a):
    """voice design from one generic description (no reference audio); previews of the six lines, measured"""
    text = " ".join(sent_text(t) for _, _, t in LINES)
    body = dict(voice_description=DESIGN_DESCRIPTION, text=text, model_id="eleven_multilingual_ttv_v2", seed=a.seed,
                auto_generate_text=False)
    r = ellib.post("/v1/text-to-voice/design", body, timeout=240)
    hdr = dict(ellib.LAST)
    d = os.path.join(OUT, "design")
    os.makedirs(d, exist_ok=True)
    rows = []
    for i, pv in enumerate(r.get("previews", [])):
        mp3 = base64.b64decode(pv["audio_base_64"])
        p = os.path.join(d, f"preview-{a.seed}-{i + 1}.mp3")
        open(p, "wb").write(mp3)
        y = E.decode(mp3)
        f0, rng = f0_of(y)
        ac = accent(y)
        rows.append(dict(i=i + 1, generated_voice_id=pv["generated_voice_id"], file=os.path.relpath(p, REPO),
                         duration_s=pv.get("duration_secs"), f0=f0, f0_range=rng, **ac))
        print(f"  preview {i + 1}: f0 {f0} p_en {ac['p_en']:.4f} lp {ac['en_logprob']} | {ac['ml_text'][:80]}")
    rec = dict(description=DESIGN_DESCRIPTION, text=text, model_id=body["model_id"], seed=a.seed, chars=len(text),
               cost_header=hdr.get("character-cost"), request_id=hdr.get("request-id"), at=time.strftime("%H:%M:%S"),
               previews=rows)
    ix = load_index()
    ix.setdefault("design_runs", []).append(rec)
    save_index(ix)
    print("design call: chars", len(text), "cost header", hdr.get("character-cost"))


def cmd_save(a):
    """save chosen design previews as account voices (so they render with the same model and settings as the rest)"""
    ix = load_index()
    runs = ix.get("design_runs", [])
    for spec in a.pick:
        seed, i = [int(x) for x in spec.split(":")]
        run = next(r for r in runs if r["seed"] == seed)
        pv = next(p for p in run["previews"] if p["i"] == i)
        name = f"mrmas-mas-design-{seed}-{i}"
        r = ellib.post("/v1/text-to-voice", dict(voice_name=name, voice_description=run["description"],
                                                 generated_voice_id=pv["generated_voice_id"]))
        vid = r.get("voice_id")
        ix["candidates"].append(dict(key=f"design-{seed}-{i}", voice_id=vid, name=name,
                                     source="voice design (text-to-voice, eleven_multilingual_ttv_v2) from a generic "
                                            "description; no reference audio; saved to this account",
                                     design=dict(description=run["description"], seed=seed, preview=i,
                                                 generated_voice_id=pv["generated_voice_id"]),
                                     preview=dict(f0=pv["f0"], p_en=pv["p_en"], en_logprob=pv["en_logprob"])))
        print("saved", name, vid)
    save_index(ix)


# ------------------------------------------------------------------------------------------------ render the six lines
def render_cand(c, model, budget):
    """-> (takes, chars sent). Cached by request (el_render's cache); no automatic retakes: first takes are the measure."""
    cdir = os.path.join(REPO, "audio/ep01/v3-el/cache")
    tag = c["key"] + ("" if model == "eleven_multilingual_v2" else "-" + model.replace("eleven_", ""))
    d = os.path.join(OUT, tag)
    os.makedirs(d, exist_ok=True)
    takes, spent = [], 0
    for lid, kind, text in LINES:
        sent = sent_text(text)
        st = dict(V3) if model == "eleven_v3" else dict(TALK if kind == "talk" else VO)
        seed = R.seed_of(f"recast-{lid}", c["voice_id"])
        fmt = "mp3_44100_192"
        key = R.request_key(c["voice_id"], model, st, sent, seed, fmt)
        mp3p, jsp = os.path.join(cdir, key + ".mp3"), os.path.join(cdir, key + ".json")
        if not (os.path.exists(mp3p) and os.path.exists(jsp)):
            if len(sent) > budget[0]:
                raise SystemExit(f"budget: {len(sent)} chars needed, {budget[0]} left")
            audio, al, body = ellib.tts(c["voice_id"], sent, model_id=model, settings=st, seed=seed, output_format=fmt)
            hdr = dict(ellib.LAST)
            open(mp3p, "wb").write(audio)
            ellib.jdump(dict(request=body, output_format=fmt, headers=hdr, alignment=al, at=time.strftime("%Y-%m-%dT%H:%M:%S")), jsp)
            budget[0] -= len(sent)
            spent += len(sent)
            c.setdefault("calls", []).append(dict(line=lid, model=model, key=key, chars=len(sent), cost_header=hdr.get("character-cost"),
                                                  at=time.strftime("%H:%M:%S")))
        y = E.decode(open(mp3p, "rb").read())
        tgt = -16.0 if kind == "talk" else -18.0
        wav, off, info = E.dress(y, seed, tgt)
        p = os.path.join(d, f"{lid}.wav")
        E.write24(p, wav)
        m = E.measure(wav, text)
        asr_txt, _ = E.asr(wav)
        takes.append(dict(line=lid, kind=kind, text=text, sent=sent, model=model, settings=st, seed=seed, key=key,
                          file=os.path.relpath(p, REPO), duration_s=round(len(wav) / E.SR, 3), span_s=m["span_s"], wpm=m["wpm"],
                          sps=m["articulation_sps"], pauses=m["pauses_s"], f0=m["median_f0_hz"], f0_range=m["f0_range_st"],
                          tail_cut=info["raw_tail_cut"], lufs=round(E.lufs(wav), 2), tp=round(E.true_peak_db(wav), 2),
                          clipped=int((abs(wav) >= 0.999).sum()), asr=asr_txt,
                          recall=E.word_recall(text, asr_txt, set(R.Cast().d.get("names", []))),
                          head=m["speech_head_s"], tail=m["speech_tail_s"], longest_gap=m["longest_internal_gap_s"]))
    return takes, spent


def summarise(takes):
    ys = [load_audio(os.path.join(REPO, t["file"])) for t in takes]
    cat = np.concatenate([np.concatenate([y, np.zeros(int(0.4 * E.SR), np.float32)]) for y in ys])
    ac = accent(cat)
    f0s = [t["f0"] for t in takes if t["f0"]]
    med = float(np.median(f0s)) if f0s else None
    vo = [t for t in takes if t["kind"] == "vo"]
    vo_wpm = sum(len(re.findall(r"[a-z0-9']+", t["text"])) for t in vo) / (sum(t["span_s"] for t in vo) / 60)
    talk = [t for t in takes if t["kind"] == "talk"]
    talk_sps = float(np.median([t["sps"] for t in talk if t["sps"]]))
    out = dict(**ac, f0_median=round(med, 1) if med else None, f0_lines=[t["f0"] for t in takes],
               f0_outliers=[t["line"] for t in takes if t["f0"] and med and abs(12 * math.log2(t["f0"] / med)) > 4],
               vo_wpm=round(vo_wpm, 1), talk_sps=round(talk_sps, 2), t3_wpm=next(t["wpm"] for t in takes if t["line"] == "t3"),
               tail_cuts=[t["line"] for t in takes if t["tail_cut"]], clipped=sum(t["clipped"] for t in takes),
               min_recall=min(t["recall"] for t in takes), longest_gap=max(t["longest_gap"] for t in takes),
               voiced_s=round(sum(t["span_s"] for t in takes), 2))
    return out


def cmd_render(a):
    ix = load_index()
    budget = [a.max_chars]
    for c in ix["candidates"]:
        if a.only and c["key"] not in a.only:
            continue
        for model in a.models:
            takes, n = render_cand(c, model, budget)
            summ = summarise(takes)
            summ.update(accent_takes(takes))
            c.setdefault("renders", {})[model] = dict(takes=takes, summary=summ, chars_sent=n)
            save_index(ix)
            print(f"{c['key']:22s} {model:24s} sent {n:4d} | p_en {summ['p_en']:.4f} lp {summ['en_logprob']} "
                  f"f0 {summ['f0_median']} vo {summ['vo_wpm']} wpm talk {summ['talk_sps']} sps cuts {summ['tail_cuts']} "
                  f"rec {summ['min_recall']} | {summ['ml_text'][:70]}")
    print("chars left in this run's cap:", budget[0])


# ------------------------------------------------------------------------------------------------ accent, per take
def forced_per_token(y48, text, multilingual=False):
    """mean log P per token of the exact intended text given the take (CTranslate2 forced alignment): a pronunciation
    score that doesn't depend on how a free decode punctuates. small.en by default; the multilingual small with en."""
    from faster_whisper.audio import pad_or_trim
    from faster_whisper.tokenizer import Tokenizer
    if multilingual:
        m = ml()
        tok = Tokenizer(m.hf_tokenizer, True, task="transcribe", language="en")
    else:
        import pron_check
        m, tok = pron_check._model()
    feats = m.feature_extractor(to16(y48))
    nf = min(feats.shape[-1], m.feature_extractor.nb_max_frames)
    enc = m.encode(pad_or_trim(feats[:, :nf]))
    tt = tok.encode(" " + text.strip())
    r = m.model.align(enc, tok.sot_sequence, [tt], [nf])[0]
    p = list(r.text_token_probs)[: len(tt)]
    return float(np.mean([math.log(max(x, 1e-12)) for x in p]))


def detect_en(y48):
    m = ml()
    segs, info = m.transcribe(to16(y48), language=None, beam_size=1, condition_on_previous_text=False, vad_filter=False)
    list(segs)
    return float(dict(info.all_language_probs or []).get("en", 0.0))


def display_text(t):
    """the line as an American listener would write it: sentence case, the registry's spellings"""
    return R.sentence_case(R.normalise_text(t), R.Cast().d.get("names", []))


def accent_takes(takes):
    pe, fe, fm = [], [], []
    for t in takes:
        y = load_audio(os.path.join(REPO, t["file"]))
        txt = display_text(t["text"])
        pe.append(detect_en(y))
        fe.append(forced_per_token(y, txt))
        fm.append(forced_per_token(y, txt, multilingual=True))
        t.update(p_en=round(pe[-1], 4), forced_en=round(fe[-1], 3), forced_ml=round(fm[-1], 3))
    return dict(p_en_takes=round(float(np.mean(pe)), 4), p_en_min=round(float(np.min(pe)), 4),
                forced_en=round(float(np.mean(fe)), 3), forced_ml=round(float(np.mean(fm)), 3))


def cmd_accent(a):
    """per-take accent measures for every rendered candidate, and the Kokoro / Giovanni episode references"""
    ix = load_index()
    for c in ix["candidates"]:
        for model, r in (c.get("renders") or {}).items():
            r["summary"].update(accent_takes(r["takes"]))
            s_ = r["summary"]
            print(f"{c['key']:22s} {model:22s} p_en(cat) {s_['p_en']:.4f} p_en(takes) {s_['p_en_takes']:.4f} min {s_['p_en_min']:.4f} "
                  f"forced en {s_['forced_en']:.3f} ml {s_['forced_ml']:.3f}")
    save_index(ix)
    # the references, on the lock's takes of the same lines (v2 has no Kokoro take of its own: v3-vo-18 ends with it)
    ids = {"t1": "e1-a1-5-07", "t2": "a5-26-01", "t3": "a5-29-19", "v1": "v3-vo-01", "v3": "v3-vo-20"}
    kok = {}
    for s in ("act1", "act4"):
        for b in jload(os.path.join(REPO, f"show/reel/ep01-v3/ep01-v3-{s}.json"))["beats"]:
            for l in b["lines"]:
                kok[l["id"]] = l["audio"]
    txt = {lid: t for lid, _, t in LINES}
    tk = [dict(file=kok[i], text=txt[lid]) for lid, i in ids.items()]
    refs = jload(os.path.join(S, "recast-refs.json"))
    refs["kokoro"].update(accent_takes(tk))
    print("kokoro (the lock's American stock voice, 5 lines)", {k: refs["kokoro"][k] for k in ("p_en_takes", "p_en_min", "forced_en", "forced_ml")})
    ellib.jdump(refs, os.path.join(S, "recast-refs.json"))


def cmd_principals(a):
    """the principals' A voices on their episode takes vs the Kokoro lock's takes of the same lines (free): p(en) per
    take, the forced log-probability per token, and detection on up to 25 s of each role's lines joined"""
    kok, el = {}, {}
    for s in ("coldopen", "act1", "act2", "act3", "act4", "tag"):
        for b in jload(os.path.join(REPO, f"show/reel/ep01-v3/ep01-v3-{s}.json"))["beats"]:
            for l in b["lines"]:
                kok[l["id"]] = l
        for r in jload(os.path.join(REPO, f"audio/ep01/v3-el/ep01/{s}/lines-A.json")):
            el[r["id"]] = r
    roles = a.roles
    out = {}
    for role in roles:
        rows = [r for r in el.values() if r["speaker_slug"] == role and r["kind"] == "dialogue" and r["id"] in kok
                and len(r["text"].split()) >= 4 and not kok[r["id"]].get("cut")]
        rows.sort(key=lambda r: -len(r["text"]))
        rows = rows[: a.n]
        res = {}
        for lab, getf in (("el", lambda r: r["file"]), ("kokoro", lambda r: kok[r["id"]]["audio"])):
            tk = [dict(file=getf(r), text=r["text"]) for r in rows]
            m = accent_takes(tk)
            ys = [load_audio(os.path.join(REPO, t["file"])) for t in tk]
            cat = np.concatenate([np.concatenate([y, np.zeros(int(0.3 * E.SR), np.float32)]) for y in ys])[: int(28 * E.SR)]
            ac = accent(cat)
            m.update(p_en_cat=ac["p_en"], top_other=ac["top_other"], p_other=ac["p_other"])
            res[lab] = m
        res["lines"] = [r["id"] for r in rows]
        res["voice"] = rows[0]["el"]["voice_name"] if rows else None
        out[role] = res
        e, k = res["el"], res["kokoro"]
        print(f"{role:14s} {str(res['voice'])[:34]:34s} EL p_en {e['p_en_takes']:.4f} (cat {e['p_en_cat']:.4f}, min {e['p_en_min']:.4f}) "
              f"forced {e['forced_en']:.3f}/{e['forced_ml']:.3f} | Kokoro p_en {k['p_en_takes']:.4f} (cat {k['p_en_cat']:.4f}) "
              f"forced {k['forced_en']:.3f}/{k['forced_ml']:.3f} | top other {e['top_other']}:{e['p_other']}")
    fp = os.path.join(REPO, "audio/ep01/v3-el/ep01/qa/accent-principals.json")
    prev = jload(fp) if os.path.exists(fp) else {}
    if a.as_key:
        out = {a.as_key: out[roles[0]]}
    prev.update(out)
    ellib.jdump(prev, fp)


# ------------------------------------------------------------------------------------------------ rank
def score(summ, ref):
    """lower is better. ref = Kokoro's American takes of the same lines (p(en) per take, mean and worst).
    accent: 1 point per 0.01 of mean p(en) under the reference, 1 per 0.05 of the worst take under 0.95; the lane
    (semitones outside 105-125 Hz); the V.O. pace (1 point per 10 wpm outside 110-140); artifacts (2 per clipped tail,
    3 if any clipped samples, 1 per line > 4 st off the voice's own median, 2 if ASR recall < 0.8)"""
    pen = {}
    pen["accent"] = max(0.0, (ref["p_en_takes"] - summ["p_en_takes"]) * 100) + max(0.0, (0.95 - summ["p_en_min"]) * 20)
    f = summ["f0_median"] or 0
    pen["lane"] = 0.0 if LANE[0] <= f <= LANE[1] else abs(12 * math.log2(f / (LANE[0] if f < LANE[0] else LANE[1])))
    w = summ["vo_wpm"]
    pen["pace"] = 0.0 if PACE[0] <= w <= PACE[1] else min(abs(w - PACE[0]), abs(w - PACE[1])) / 10
    pen["artifacts"] = 2.0 * len(summ["tail_cuts"]) + (3.0 if summ["clipped"] else 0) + 1.0 * len(summ["f0_outliers"]) + \
        (2.0 if summ["min_recall"] < 0.8 else 0)
    return round(sum(pen.values()), 2), {k: round(v, 2) for k, v in pen.items()}


def cmd_rank(a):
    ix = load_index()
    refs = jload(os.path.join(S, "recast-refs.json"))
    ref = refs["kokoro"]
    rows = []
    for c in ix["candidates"]:
        for model, r in (c.get("renders") or {}).items():
            sc, pen = score(r["summary"], ref)
            r["score"], r["penalties"] = sc, pen
            rows.append((sc, c["key"], model, r["summary"], pen, c.get("reference")))
    rows.sort(key=lambda x: x[0])
    ix["ranking"] = [dict(rank=i + 1, key=k, model=m, score=sc, penalties=pen, reference=bool(rf),
                          vo_speed_for_125wpm=round(0.9 * 125 / s_["vo_wpm"], 2) if m == "eleven_multilingual_v2" else None)
                     for i, (sc, k, m, s_, pen, rf) in enumerate(rows)]
    ix["ranking_rule"] = (score.__doc__.strip() + f" Reference (Kokoro, the lock's American stock voice, the same lines): "
                          f"p(en) per take {ref['p_en_takes']} (worst {ref['p_en_min']}). The free-decode log-probability "
                          "and the forced log-probability per token are recorded but not scored: neither separated Giovanni.")
    save_index(ix)
    print(f"{'#':>2s} {'candidate':22s} {'model':22s} {'score':>6s} {'p_en':>7s} {'worst':>7s} {'F0':>6s} {'VO wpm':>7s} {'sps':>5s} cuts  penalties")
    for i, (sc, k, m, s_, pen, rf) in enumerate(rows):
        print(f"{i + 1:2d} {k + (' (ref)' if rf else ''):22s} {m:22s} {sc:6.2f} {s_['p_en_takes']:7.4f} {s_['p_en_min']:7.4f} "
              f"{str(s_['f0_median']):>6s} {s_['vo_wpm']:7.1f} {s_['talk_sps']:5.2f} {len(s_['tail_cuts'])}  {pen} outliers {s_['f0_outliers']}")


# ------------------------------------------------------------------------------------------------ the audition file
WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]


def cmd_audition(a):
    import soundfile as sf
    from kokoro import KPipeline
    ix = load_index()
    order = [c for c in ix["candidates"] if not c.get("reference") and "eleven_multilingual_v2" in (c.get("renders") or {})]
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    from scipy.signal import resample_poly

    def slate(txt):
        chunks = [np.asarray(r.audio, dtype=np.float32) for r in pipe(txt, voice="af_heart", speed=1.0)]
        y = resample_poly(np.concatenate(chunks).astype(np.float64), 2, 1).astype(np.float32)    # 24 k -> 48 k
        return E.normalise(y, -20.0)

    gap = lambda s: np.zeros(int(s * E.SR), np.float32)
    parts, index = [slate("[Mas](/mˈɑs/), recast. The same six lines per candidate."), gap(1.2)], []
    t = sum(len(p) for p in parts) / E.SR
    extra = []
    for n, c in enumerate(order, 1):
        start = t
        parts += [slate(f"Candidate {WORDS[n - 1]}."), gap(0.8)]
        for tk in c["renders"]["eleven_multilingual_v2"]["takes"]:
            parts += [load_audio(os.path.join(REPO, tk["file"])), gap(0.5 if tk["kind"] == "talk" else 0.7)]
        parts.append(gap(1.0))
        t = sum(len(p) for p in parts) / E.SR
        index.append(dict(number=n, key=c["key"], name=c["name"], voice_id=c["voice_id"], source=c["source"],
                          model="eleven_multilingual_v2", settings=dict(talk=TALK, vo=VO), starts_s=round(start, 2)))
        c["audition_number"] = n
    # the eleven_v3 takes of the best two, after the rest
    for c in order:
        if "eleven_v3" in (c.get("renders") or {}):
            start = t
            parts += [slate(f"Candidate {WORDS[c['audition_number'] - 1]}, on the newer model."), gap(0.8)]
            for tk in c["renders"]["eleven_v3"]["takes"]:
                parts += [load_audio(os.path.join(REPO, tk["file"])), gap(0.6)]
            parts.append(gap(1.0))
            t = sum(len(p) for p in parts) / E.SR
            extra.append(dict(number=c["audition_number"], key=c["key"], model="eleven_v3", settings=V3, starts_s=round(start, 2)))
    y = np.concatenate(parts)
    os.makedirs(os.path.dirname(AUDITION), exist_ok=True)
    wav = os.path.join(S, "mas-recast.wav")
    sf.write(wav, y, E.SR, subtype="PCM_16")
    sf.write(AUDITION, y, E.SR, format="MP3")
    ix["audition"] = dict(file=os.path.relpath(AUDITION, REPO), seconds=round(len(y) / E.SR, 1),
                          slate="Kokoro af_heart (a stock American voice), -20 LUFS; the takes as dressed (spoken -16, V.O. -18 LUFS)",
                          order=index, eleven_v3=extra)
    save_index(ix)
    print("wrote", os.path.relpath(AUDITION, REPO), round(len(y) / E.SR, 1), "s")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("screen")
    s.add_argument("--n", type=int, default=40)
    sp.add_parser("refs")
    x = sp.add_parser("add")
    x.add_argument("voice_ids", nargs="+")
    x = sp.add_parser("design")
    x.add_argument("--seed", type=int, default=2027)
    x = sp.add_parser("save")
    x.add_argument("pick", nargs="+", help="SEED:PREVIEW")
    x = sp.add_parser("render")
    x.add_argument("--only", nargs="*", default=[])
    x.add_argument("--models", nargs="+", default=["eleven_multilingual_v2"])
    x.add_argument("--max-chars", type=int, default=2500)
    sp.add_parser("rank")
    sp.add_parser("accent")
    x = sp.add_parser("principals")
    x.add_argument("--roles", nargs="+", default=["mas-manalt", "gerg-mockbran", "alyi", "rima-tamuri", "neleh", "tasya"])
    x.add_argument("--n", type=int, default=8)
    x.add_argument("--as-key", default="", help="store the (single) role's result under this key, e.g. mas-manalt-C")
    sp.add_parser("audition")
    a = ap.parse_args()
    dict(screen=cmd_screen, refs=cmd_refs, add=cmd_add, design=cmd_design, save=cmd_save, render=cmd_render,
         rank=cmd_rank, audition=cmd_audition, accent=cmd_accent, principals=cmd_principals)[a.cmd](a)


if __name__ == "__main__":
    main()
