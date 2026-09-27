#!/usr/bin/env python
"""fastrec.py - the fast dialogue recorder: one natural-pace Kokoro take per line, in parallel, resumable.

Built for the stick-figure reels, where the job is to judge flow and dialogue, not to choose between takes. Full
usage, what is measured and what is not: README.md beside this file. In short (run from the repo root):

  PY=audio/.venv-casting/bin/python
  T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
  $PY $T record --lines <lines.json> --out <dir> [--workers 4] [--ids a b ...] [--flag a b ...] [--takes 1]
               [--takes-flagged 2] [--no-asr] [--utmos] [--prosody] [--breaths] [--mp3] [--force all|id ...]
  $PY $T merge  --lines <lines.json> --out <dir>          # rows/ -> <dir>/lines.json (record does this itself)
  $PY $T qa     --out <dir>                               # the file checks + flags (record does this itself)
  $PY $T voices [--labels <lines.json>]                   # the cast registry, and any label with no voice
  $PY $T plan   --seg act1 --out <plan.json> [--prev <old plan.json>]   # a draft lines JSON from the Ep1 script

Input: a lines JSON in the lines-v5.json row format (audio/ep01/act4/dialogue/lines-v5.json). Only id, speaker and
text are required; spoken_as (or say), speed (or pace.intended.speed), device, kind, bh, trail, est_s, placement and
the rest are used when present. Output: <dir>/lines.json with EVERY key of a lines-v5 row, in lines-v5 order, and
<dir>/wav/<id>.wav (48 kHz / 24-bit mono), <dir>/rows/<id>.json, <dir>/log/, <dir>/qa/.

Nothing here is heard. Every number it prints is a measurement of the file.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(TOOLS, "../../../../.."))
CAST_JSON = os.path.join(REPO, "audio/voices/cast.json")
SCRIPT_EP1 = os.path.join(REPO, "show/episodes/ep01/script.md")
QA_V5 = os.path.join(TOOLS, "v5/qa_v5.py")
PLAN_V5 = os.path.join(TOOLS, "v5/plan_lines.json")
TOOL_VERSION = "fastrec 1.2 (2026-09-26)"   # 1.2: lexicon in any case (plan); clean stop on SIGINT/SIGTERM; no audio change
KEY_VERSION = "fastrec 1.0 (2026-09-26)"     # goes into each line's resume key: bump it only when the AUDIO method changes
FPS = 24
ASR_GAP_S = 1.2                               # silence between two takes packed into one ASR window

# the key order of a lines-v5.json row (the 41 keys every row has, plus nobreath where it has breaths)
V5_KEYS = ["id", "scene", "speaker", "speaker_slug", "text", "spoken_as", "delivery", "tag", "mode", "voiced_in_cut",
           "on_camera", "kind", "side", "pov", "shot", "shot_id", "cue", "lip_sync", "status", "device", "room",
           "est_s", "file", "mp3", "duration_s", "frames_24", "voiced_span_s", "pace", "placement", "take",
           "takes_tried", "pick_reason", "voice", "voiceId", "model", "processing", "mouth", "words", "qa"]
V5_TAIL = ["breaths", "opened_pauses", "alt_takes"]


def log(*a):
    print(*a, flush=True)


def jload(p):
    with open(p) as f:
        return json.load(f)


def jdump_atomic(obj, p, indent=1):
    tmp = p + f".tmp{os.getpid()}"
    with open(tmp, "w") as f:
        json.dump(obj, f, indent=indent, ensure_ascii=False, default=float)
    os.replace(tmp, p)


def rel(p):
    """repo-relative inside the repo (as lines-v5.json writes paths); absolute outside it (a scratch run)"""
    r = os.path.relpath(p, REPO)
    return os.path.abspath(p) if r.startswith("..") else r


# ============================================================================================ the cast registry
class Cast:
    """speaker label -> voice preset. Sources, in order:
      1. audio/voices/cast.json "voices" (the Ep1 casting pass 2 picks, and the derived gloss voices);
      2. the Act Four production voices: cast_a4.RETURNING + cast_a4.NEW_PICKS (what record_32.voices_32() and
         record_v5 use), with the V.O. preset;
      3. the casting pass 1 picks (audio/voices/tools/cast.py PICKS) with their rooms stripped (a4lib.dry), for the
         pass-1 characters Act Four never used (NOLE, NESNEJ, RUMPT, THE INTERN).
    Pace bands: tools/v5/lines_v5.BANDS, then cast.json "bands". A label with no voice is an error, never a fallback."""

    FEMALE_V5 = {"neleh", "rima-tamuri", "adelina", "tiled-employee"}

    def __init__(self, path=CAST_JSON):
        self.path = path
        self.doc = jload(path) if os.path.exists(path) else {"labels": {}, "voices": {}, "bands": {}, "lexicon": {}}
        self._v = None

    # -- the presets
    def _load(self):
        if self._v is not None:
            return self._v
        sys.path.insert(0, TOOLS); sys.path.insert(0, os.path.join(TOOLS, "v5"))
        sys.path.insert(0, os.path.join(REPO, "audio/voices/tools"))
        import cast_a4 as CA
        import cast as C
        from a4lib import dry
        import lines_v5 as S5
        v = {}
        for slug, c in C.PICKS.items():                       # pass 1, rooms stripped
            ch = next(x for x in C.CAST if x["slug"] == slug)
            cand = next(x for x in ch["candidates"] if x["id"] == c)
            v[slug] = {"name": ch["name"], "cand": c + " (pass-1 pick, dry)", "blend": cand["voice"],
                       "speed": cand["speed"], "chain": dry(cand["chain"]), "src": "cast.py pass 1 (rooms stripped)"}
        for slug, x in CA.RETURNING.items():                  # Act Four production presets
            v[slug] = dict(x, src="cast_a4.RETURNING")
        for slug, cid in CA.NEW_PICKS.items():
            role = CA.NEW[slug]
            c = next(x for x in role["cands"] if x["id"] == cid)
            v[slug] = {"name": role["name"], "cand": cid, "blend": c["blend"], "speed": c["speed"], "chain": c["chain"],
                       "grade": c.get("grade"), "src": "cast_a4.NEW_PICKS"}
        for slug, x in self.doc.get("voices", {}).items():    # pass 2 and derived
            if x.get("derive"):
                continue
            v[slug] = dict(x, src="audio/voices/cast.json")
        for slug, x in self.doc.get("voices", {}).items():
            if x.get("derive"):
                base = v[x["derive"]]
                v[slug] = dict(base, name=x.get("name", base["name"]), cand=x.get("cand", base["cand"] + " + gloss"),
                               chain=list(base["chain"]) + list(x.get("chain_add", [])), derive=x["derive"],
                               female=x.get("female", base.get("female")), src="audio/voices/cast.json (derived)")
                if x.get("pitch_add"):
                    v[slug]["chain"] = v[slug]["chain"] + [{"fx": "pitch", "st": x["pitch_add"]}]
        bands = {k: [list(b[0]), list(b[1]), list(b[2])] for k, b in S5.BANDS.items()}
        bands.update({k: [list(b[0]), list(b[1]), list(b[2])] for k, b in self.doc.get("bands", {}).items()})
        for slug, x in v.items():
            base = slug if slug in bands else x.get("derive")
            x["band"] = bands.get(slug) or bands.get(base)
            x["slug"] = slug
            if "female" not in x or x["female"] is None:
                x["female"] = slug in self.FEMALE_V5 or slug.startswith(("rima", "neleh"))
            x["vo"] = slug.endswith("-vo")
        self._v = v
        return v

    def slug_of(self, label, kind=None):
        """script label or display name -> voice slug (or None)"""
        labels = self.doc.get("labels", {})
        lab = re.sub(r"\s+", " ", (label or "").strip().upper())
        vo = "(V.O.)" in lab or kind == "vo"
        cands = [lab, re.sub(r"\s*\((O\.S\.|V\.O\.|CONT'D|CONT’D)\)", "", lab).strip()]
        for c in cands:
            if c in labels:
                s = labels[c]
                return s + "-vo" if vo and not s.endswith("-vo") and (s + "-vo") in self._load() else s
        return None

    def voice(self, row):
        v = self._load()
        slug = row.get("voice_slug")
        if not slug:
            slug = self.slug_of(row.get("speaker_label") or row.get("speaker"), row.get("kind"))
        if not slug and row.get("speaker_slug"):
            slug = row["speaker_slug"] + ("-vo" if row.get("kind") == "vo" else "")
        if not slug or slug not in v:
            raise KeyError(f"NO VOICE: {row.get('speaker')!r} (slug {slug!r}); add it to audio/voices/cast.json")
        if not v[slug].get("band"):
            raise KeyError(f"NO PACE BAND: {slug}; add it to audio/voices/cast.json 'bands'")
        return v[slug]

    def names(self):
        return {w.lower() for w in self.doc.get("names", [])}

    def lexicon(self):
        return self.doc.get("lexicon", {})


# ============================================================================================ rows in, settings
def say_of(row):
    s = row.get("say") or row.get("spoken_as") or row["text"]
    return s


def speed_of(row, v):
    for k in (("speed",), ("pace", "intended", "speed"), ("pace", "speed")):
        x = row
        for kk in k:
            x = x.get(kk) if isinstance(x, dict) else None
        if isinstance(x, (int, float)):
            return float(x)
    lo, hi = v["band"][0]
    return round((lo + hi) / 2, 3)


def trail_of(row):
    if row.get("trail"):
        return row["trail"]
    if row.get("interrupt"):
        try:
            import lines_v5 as S5
            return S5.S.get(row["id"], {}).get("trail")
        except Exception:
            return None
    return None


def bh_of(row):
    if "bh" in row:
        return int(row["bh"])
    try:
        import lines_v5 as S5
        if row["id"] in S5.S:
            return int(S5.S[row["id"]].get("bh", 0))
    except Exception:
        pass
    return 1 if any(b.get("where") == "head" for b in (row.get("breaths") or [])) else 0


def dev_of(row):
    d = row.get("device")
    return d if d in ("call", "monitor", "laptop", "pa", "tv") else None


def is_derived(row):
    return bool(row.get("derived_from") or row.get("reused_from") or row.get("derive") or row.get("reuse"))


def line_key(row, v, s, settings):
    """what makes the audio: the words, the voice preset, the speed, the seeds, the device, the level, the trail"""
    bh = bh_of(row) if settings["breaths"] else 0
    d = {"say": say_of(row), "blend": v["blend"], "chain": v["chain"], "speed": s, "takes": settings_takes(row, settings),
         "dev": dev_of(row), "vo": v["vo"], "bh": bh, "trail": trail_of(row), "tool": KEY_VERSION}
    return hashlib.sha1(json.dumps(d, sort_keys=True, default=str).encode()).hexdigest()[:16]


def settings_takes(row, settings):
    if row.get("takes"):
        return int(row["takes"])
    if row.get("flag") or row["id"] in settings.get("flag", []):
        return settings["takes_flagged"]
    return settings["takes"]


# ============================================================================================ the worker
class Recorder:
    def __init__(self, settings, shard):
        self.s = settings
        self.shard = shard
        self.out = settings["out"]
        self.cast = Cast(settings.get("cast", CAST_JSON))
        import house as H
        self.H = H
        self.L = H.L
        self._asr = None
        self._mos = None
        self.names = self.cast.names() | {"mas", "manalt", "gerg", "mockbran", "alyi", "neleh", "ttemme", "yrral",
                                          "nozama", "macrosoft", "macrosofts", "nopeai", "nopeais", "rima", "terb",
                                          "mada", "mario"}
        self.stats = {"lines": 0, "takes": 0, "synth_s": 0.0, "asr_s": 0.0, "asr_calls": 0, "asr_items": 0}
        self.pending = []                     # single-take lines waiting for a packed ASR window

    # -- checks
    def asr_many(self, items, lim=None):
        """items: [(key, y48, ref)] -> {key: (hyp, logprob, words on the item's own clock, share_s, lines in window)}.

        faster-whisper pads every call to a 30 s window, so one call per short line pays for 30 s of encoder
        (measured 2026-09-26 on the loaded box: 9-15 s a call for a 0.8-7.9 s line). The items are packed into windows
        of at most asr_batch_s, ASR_GAP_S of silence apart, and each window is transcribed once, with word timestamps.
        A word belongs to the item its midpoint falls in (+-0.4 s); a word in a gap belongs to no line.
        Two items with the same words never share a window: whisper may write a repeat once (seen 2026-09-26 on two
        takes of one line). asr_batch_s = 0 (or lim=0) transcribes every item on its own (the fastrec 1.0 behaviour).
        asr_checked() re-runs alone any packed item that comes back short."""
        import numpy as np, soundfile as sf
        if not items:
            return {}
        if self._asr is None:
            from faster_whisper import WhisperModel
            self._asr = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=self.s["threads"])
        SR = self.H.SR
        lim = float(self.s.get("asr_batch_s") or 0.0) if lim is None else lim
        norm = lambda t: " ".join(self.H.plain_words(t))
        windows, cur, cur_len = [], [], 0.0
        for it in items:
            d = len(it[1]) / SR
            if cur and (lim <= 0 or cur_len + d > lim or norm(it[2]) in {norm(x[2]) for x in cur}):
                windows.append(cur); cur, cur_len = [], 0.0
            cur.append(it); cur_len += d + ASR_GAP_S
        if cur:
            windows.append(cur)
        out = {}
        for win in windows:
            t0 = time.time()
            parts, offs, t = [], [], 0.0
            for key, y, ref in win:
                offs.append((key, t, t + len(y) / SR))
                parts += [np.asarray(y, np.float32), np.zeros(int(ASR_GAP_S * SR), np.float32)]
                t += len(y) / SR + ASR_GAP_S
            p = os.path.join(self.out, "tmp", f"asr-{self.shard}.wav")
            sf.write(p, np.concatenate(parts), SR, subtype="PCM_24")     # a trailing gap too: a word whisper invents at the end lands in it and is dropped
            wt = len(win) > 1 or bool(self.s.get("asr_align"))
            segs, _ = self._asr.transcribe(p, language="en", beam_size=self.s["asr_beam"], condition_on_previous_text=False,
                                           vad_filter=False, word_timestamps=wt)
            segs = list(segs)
            for key, a, b in offs:
                if wt:
                    ws = [w for x in segs for w in (x.words or []) if a - 0.4 <= (w.start + w.end) / 2 <= b + 0.4]
                    hyp = "".join(w.word for w in ws).strip()
                    words = [{"w": w.word.strip(), "t0": round(w.start - a, 3), "t1": round(w.end - a, 3)} for w in ws]
                else:
                    hyp, words = " ".join(x.text.strip() for x in segs).strip(), []
                lps = [x.avg_logprob for x in segs if x.end > a and x.start < b]
                out[key] = (hyp, float(np.mean(lps)) if lps else -9.0, words)
            dt = time.time() - t0
            self.stats["asr_s"] += dt; self.stats["asr_calls"] += 1; self.stats["asr_items"] += len(win)
            for key, a, b in offs:
                out[key] = out[key] + (round(dt * (b - a + ASR_GAP_S) / t, 2), len(win))
        return out

    def asr_checked(self, items):
        """asr_many, then any item packed with others whose ASR came back empty or missing a non-name word is
        transcribed again on its own, and that result is kept: a misread flag always rests on a solo read, the
        v5 standard; packing only speeds up the clean lines."""
        res = self.asr_many(items)
        again = [it for it in items if res[it[0]][4] > 1 and
                 (not res[it[0]][0] or self.H.word_recall(it[2], res[it[0]][0], self.names) < 1.0)]
        if again:
            solo = self.asr_many(again, lim=0)
            for it in again:
                r0 = res[it[0]]
                res[it[0]] = solo[it[0]][:3] + (round(r0[3] + solo[it[0]][3], 2), 1, "re-checked alone")
        return res

    def asr_fields(self, ref, toks, res):
        """ASR result -> the take's check fields"""
        hyp, lp, ws = res[0], res[1], res[2]
        return dict(asr=hyp, logprob=round(lp, 3), cer=round(self.L.cer(ref, hyp), 3),
                    recall=self.H.word_recall(ref, hyp, self.names), align=self.L.align_check(toks, ws) if ws else None,
                    asr_share_s=res[3], asr_window_lines=res[4], asr_recheck=len(res) > 5)

    def flush_asr(self, force=False):
        """run the packed ASR on the pending lines once they fill a window (or at the end of the shard), and write
        the results into their rows (atomically)"""
        if not self.pending:
            return
        SR = self.H.SR
        total = sum(len(p["y"]) / SR + ASR_GAP_S for p in self.pending)
        if not force and total < float(self.s.get("asr_batch_s") or 0.0):
            return
        items, self.pending = self.pending, []
        res = self.asr_checked([(p["id"], p["y"], p["ref"]) for p in items])
        for p in items:
            f = self.asr_fields(p["ref"], p["toks"], res[p["id"]])
            rp = os.path.join(self.out, "rows", p["id"] + ".json")
            row = jload(rp)
            row["qa"].update({"asr": f["asr"], "cer": f["cer"], "word_recall_nonames": f["recall"],
                              "logprob": f["logprob"], "align_median_s": f["align"]})
            row["fast"]["asr"] = {"packed_with": f["asr_window_lines"] - 1, "share_s": f["asr_share_s"],
                                  "rechecked_alone": f["asr_recheck"]}
            row["fast"]["wall_s"] = round(row["fast"]["wall_s"] + f["asr_share_s"], 2)
            row["fast"].pop("asr_pending", None)
            jdump_atomic(row, rp)
            log(f"[{self.shard}] {p['id']} ASR recall {f['recall']} '{(f['asr'] or '')[:70]}'"
                + (f" (packed with {f['asr_window_lines'] - 1})" if f["asr_window_lines"] > 1 else "")
                + (" (re-checked alone)" if f["asr_recheck"] else ""))

    def utmos(self, y):
        if self._mos is None:
            sys.path.insert(0, os.path.join(TOOLS, "v5"))
            import mos
            self._mos = mos
        return round(self._mos.utmos(y, self.H.SR), 3)

    # -- one take
    def take(self, row, v, say, speed, seed, dev):
        H = self.H
        lufs = H.VO_LUFS if v["vo"] else H.DLG_LUFS
        bh = bh_of(row) if self.s["breaths"] else 0
        if not self.s["breaths"]:
            say = re.sub(r"\{(s?)b(\d*\.?\d+)\}", r"{\g<1>\2}", say)      # a {b0.5} pause stays, without its inhale
        text, y, toks, opened, mids = H.speech_multi(say, v, speed, seed)
        arr, toks, lay = H.dress(y, toks, mids, bh, seed, v["female"], v["vo"], lufs, dev)
        toks = self.L.clip_words(arr["speech"] + 1e-7, toks)
        m = H.measure_speech(arr["speech"], toks, text)
        t = dict(tag=f"s{seed}", say=say, text=text, speed=speed, seed=seed, opened=opened, layout=lay, toks=toks,
                 arrays=arr, m=m, lufs=lufs, ref=H.ref_text(row["text"] if not trail_of(row) else say))
        if self.s["utmos"]:
            t["utmos"] = self.utmos(arr["dry_nobreath"])
        return t

    def pick(self, takes, est):
        H = self.H
        def key(t):
            return (-(t.get("recall") if t.get("recall") is not None else 1.0),
                    1 if any(H.hard(o) for o in t["opened"]) else 0,
                    abs(t["m"]["span_s"] - est) if est else 0.0,
                    -(t.get("utmos") or 0.0), t["seed"])
        best = sorted(takes, key=key)[0]
        if len(takes) == 1:
            why = "fast: one take (seed 1, plan speed)"
        else:
            why = (f"fast: best of {len(takes)} seeds by ASR word recall, then no pause cut inside the voice, then the "
                   f"span nearest est_s{', then UTMOS' if self.s['utmos'] else ''}")
        return best, why

    # -- one line
    def record(self, row):
        import numpy as np
        H, L = self.H, self.L
        t0 = time.time()
        v = self.cast.voice(row)
        speed = speed_of(row, v)
        dev = dev_of(row)
        n = settings_takes(row, self.s)
        say = say_of(row)
        takes = [self.take(row, v, say, speed, seed, dev) for seed in range(1, n + 1)]
        self.stats["synth_s"] += time.time() - t0; self.stats["lines"] += 1; self.stats["takes"] += n
        deferred = self.s["asr"] and n == 1
        if self.s["asr"] and n > 1:                   # the pick needs ASR now: every take of the line in one window
            res = self.asr_checked([(t["tag"], t["arrays"]["dry_nobreath"], t["ref"]) for t in takes])
            for t in takes:
                t.update(self.asr_fields(t["ref"], t["toks"], res[t["tag"]]))
        best, why = self.pick(takes, row.get("est_s"))
        arr = best["arrays"]
        rid = row["id"]
        extra = {}
        y_out = arr["deliv"]
        tr = trail_of(row)
        if tr:
            c_rel = self.write(arr["deliv"], f"complete/{rid}.wav")
            w = next(t for t in best["toks"] if t["word"] and t["text"].lower().startswith(tr["word"]))
            t_in = (w["t1"] - tr.get("overlap_s", 0.0)) if not tr.get("n_ph") else None
            bed = arr["bed"] if dev != "laptop" else np.zeros_like(arr["bed"])
            sp_t, t_in, t_fade = H.trail(arr["deliv"] - bed, best["toks"], tr["word"], tr.get("n_ph"), t_in,
                                         tr.get("drop_db", -8.0), tr.get("fade_s", 0.15))
            y_out = sp_t + bed[: len(sp_t)]
            f = int(0.01 * H.SR); y_out[-f:] *= np.linspace(1, 0, f)
            extra["complete"] = {"file": c_rel, "note": "the whole sentence as read (the delivered file is this, trailed)"}
            extra["interrupt"] = {"by": tr.get("by"), "voice_drops_at_s": round(t_in, 3), "fade_from_s": round(t_fade, 3),
                                  "fade_s": tr.get("fade_s", 0.15), "drop_db": tr.get("drop_db", -8.0),
                                  "note": f"trailed at '{tr['word']}' (fastrec, the v5 trail method)"}
        f_rel = self.write(y_out, f"wav/{rid}.wav")
        m_rel = None
        if self.s["mp3"]:
            m_rel = rel(os.path.join(self.out, "mp3", rid + ".mp3"))
            os.makedirs(os.path.join(self.out, "mp3"), exist_ok=True)
            L.V.write_wav_mp3(y_out.astype(np.float32), None, os.path.join(REPO, m_rel))
        if dev:
            extra["clean"] = {"file": self.write(arr["dry"], f"clean/{rid}.wav"),
                              "note": f"the dry read (no {dev} chain), {best['lufs']:g} LUFS"}
        if best["layout"]["breaths"] and any("t0" in b for b in best["layout"]["breaths"]):
            extra["nobreath"] = {"file": self.write(arr["deliv_nobreath"], f"nobreath/{rid}.wav"),
                                 "note": "the same take without the placeholder inhale(s)"}
        alts = []
        for t in takes:
            if t is best:
                continue
            p = self.write(t["arrays"]["deliv"], f"takes/{rid}/{t['tag']}.wav")
            alts.append({"tag": t["tag"], "seed": t["seed"], "speed": t["speed"], "file": p, "span_s": t["m"]["span_s"],
                         "wpm": t["m"]["wpm"], "asr": t.get("asr"), "recall": t.get("recall"), "utmos": t.get("utmos")})
        row_out = self.build_row(row, v, best, why, takes, f_rel, m_rel, y_out, dev, extra, alts)
        row_out["fast"] = {"key": line_key(row, v, speed, self.s), "tool": TOOL_VERSION, "shard": self.shard,
                           "wall_s": round(time.time() - t0, 2), "takes": len(takes),
                           "settings": {k: self.s.get(k) for k in ("asr", "asr_beam", "asr_batch_s", "asr_align", "utmos",
                                                                   "prosody", "breaths", "threads")}}
        if n > 1 and self.s["asr"]:
            row_out["fast"]["asr"] = {"packed_with": len(takes) - 1, "share_s": round(sum(t["asr_share_s"] for t in takes), 2)}
        if deferred:
            row_out["fast"]["asr_pending"] = True                      # written now, ASR fields filled by flush_asr()
        jdump_atomic(row_out, os.path.join(self.out, "rows", rid + ".json"))
        err = os.path.join(self.out, "rows", rid + ".error.json")
        if os.path.exists(err):
            os.remove(err)                                             # this tool's own stale failure note
        if deferred:
            self.pending.append({"id": rid, "y": arr["dry_nobreath"], "ref": best["ref"], "toks": best["toks"]})
        return row_out

    def queue_asr_only(self, row, saved):
        """resume: the audio of a line is done (same key) but its ASR never ran. Queue the saved file for ASR."""
        import soundfile as sf
        f = (saved.get("clean") or {}).get("file") or (saved.get("complete") or {}).get("file") or saved["file"]
        y, _ = sf.read(os.path.join(REPO, f), dtype="float32")
        toks = [{"word": True, "text": w["w"], "t0": w["t0"], "t1": w["t1"]} for w in saved.get("words", [])]
        ref = self.H.ref_text(row["text"] if not trail_of(row) else saved.get("spoken_as") or say_of(row))
        self.pending.append({"id": row["id"], "y": y, "ref": ref, "toks": toks})

    def write(self, y, relpath):
        import numpy as np, soundfile as sf
        p = os.path.join(self.out, relpath)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        tmp = p + f".tmp{os.getpid()}.wav"
        sf.write(tmp, np.asarray(y, dtype=np.float32), self.H.SR, subtype="PCM_24")
        os.replace(tmp, p)
        return rel(p)

    def build_row(self, row, v, best, why, takes, f_rel, m_rel, y, dev, extra, alts):
        import numpy as np
        H, L = self.H, self.L
        m, toks = best["m"], best["toks"]
        label = row.get("speaker_label") or row.get("speaker") or v["name"]
        vo = v["vo"] or row.get("kind") == "vo"
        cam = row.get("on_camera") or camera_of(label, dev, vo)
        words = [{"w": t["text"], "t0": round(t["t0"], 3), "t1": round(t["t1"], 3), "f0": int(round(t["t0"] * FPS)),
                  "f1": int(round(t["t1"] * FPS)), "ph": t.get("ph", "")} for t in toks if t["word"]]
        mouth = L.mouth_cues(y, toks) if cam in ("on", "reflection", "monitor", "blueprint") else []
        target = best["arrays"]["target_lufs"]
        q = H.file_qa(y, target)
        d = H.rms_db(y, H.SR, 0.01)
        loud = np.where(d > -40)[0]
        q["first_sound_s"] = round(loud[0] * 0.01, 3) if len(loud) else None
        if self.s["prosody"]:
            an = L.analyse(best["arrays"]["speech"], toks)
            f0m, f0r, fm, meth = an.get("median_f0_hz"), an.get("f0_range_st"), an.get("final_move_st"), "pYIN (a4lib.analyse)"
        else:
            f0m, f0r = H.f0_fast(best["arrays"]["speech"]); fm, meth = None, "YIN (fast)"
        q.update({"median_f0_hz": f0m, "f0_range_st": f0r, "f0_method": meth, "final_move_st": fm,
                  "asr": best.get("asr"), "cer": best.get("cer"), "word_recall_nonames": best.get("recall"),
                  "logprob": best.get("logprob"), "align_median_s": best.get("align"),
                  "utmos_dry": best.get("utmos"), "utmos_plain_read": None, "utmos_vs_plain": None,
                  "utmos_v4_same_words": None, "utmos_delivered_as_is": None,
                  "speech_head_s": m["head_s"], "speech_tail_s": m["tail_s"], "rise_ms": m["rise_ms"],
                  "decay_ms": m["decay_ms"], "decay_to_60_s": m["decay_to_60_s"]})
        if self.s["prosody"] and "?" in row["text"]:
            q["q_lift_st"] = seg_lift(L, best["arrays"]["speech"], toks)
        band = v["band"]
        proc = L.V.describe_chain(v["chain"])
        if dev:
            proc += [f"then the {dev} chain: " + "; ".join(L.V.describe_chain(best["arrays"]["device_chain"])) + f"; {target:g} LUFS"]
        proc += [f"Kokoro speed {best['speed']:.3f} ({'the plan speed' if speed_given(row) else 'the centre of the band'}; "
                 f"{v['slug']} band {band[0][0]:.2f}-{band[0][1]:.2f}); "
                 + ("one whole read" if not any(o.get("split") for o in best["opened"])
                    else f"{1 + sum(1 for o in best['opened'] if o.get('split'))} whole reads, joined in room tone")
                 + "; no time-stretch, no carrier, no splice"]
        proc += [f"pause after '{o['word']}': Kokoro {o['tts_s']:.2f} s -> {o['final_s']:.2f} s (intended {o['target_s']:.2f}; "
                 f"+{o['opened_s']:.2f} s of room tone at the quietest 5 ms"
                 + (f"; Kokoro ran the words together here (dip {o['dip_db']} dB): ear check" if o["joined_speech"] else "") + ")"
                 for o in best["opened"] if not o.get("split")]
        proc += [f"own onset and decay kept: >= {H.HEAD:.2f} s before the first sound, decay to -60 dB re peak + {H.TAIL:.2f} s; "
                 f"{H.HANDLE:.2f} s room-tone handles each side; room-tone bed {H.TONE_DBFS:g} dBFS under the whole file",
                 ("placeholder inhale(s): synthetic band-limited noise (never from a real person)"
                  if any("t0" in b for b in best["layout"]["breaths"]) else "no inhale (fastrec default; --breaths adds them)"),
                 f"48 kHz / 24-bit mono; {target:g} LUFS integrated; true-peak ceiling -1.5 dBTP; DRY (rooms are mix sends)"]
        est = row.get("est_s")
        out = {
            "id": row["id"], "scene": row.get("scene"), "speaker": v["name"], "speaker_slug": v["slug"].replace("-vo", ""),
            "text": row["text"], "spoken_as": best["say"], "delivery": row.get("delivery"), "tag": row.get("tag"),
            "mode": row.get("mode") or {"call": "call", "monitor": "call", "laptop": "speaker", "pa": "pa", "tv": "tv"}.get(dev, "on-mic"),
            "voiced_in_cut": row.get("voiced_in_cut", True), "on_camera": cam, "kind": "vo" if vo else row.get("kind", "dialogue"),
            "side": row.get("side", "none"), "pov": row.get("pov"), "shot": row.get("shot"), "shot_id": row.get("shot_id", row.get("shot")),
            "cue": row.get("cue"), "lip_sync": cam in ("on", "reflection", "monitor"), "status": "fast",
            "device": dev, "room": row.get("room"), "est_s": est,
            "file": f_rel, "mp3": m_rel, "duration_s": round(len(y) / H.SR, 3), "frames_24": int(np.ceil(len(y) / H.SR * FPS)),
            "voiced_span_s": m["span_s"],
            "pace": {"words": m["words"], "wpm": m["wpm"], "speed": best["speed"], "tsm": 1.0,
                     "intended": {"speed": speed_of(row, v), "speed_band": list(band[0]), "articulation_guide_sps": list(band[1]),
                                  "turn_wpm_guide": list(band[2]), "intent": row.get("delivery")},
                     "measured": {"wpm": m["wpm"], "articulation_sps": m["articulation_sps"], "syllables": m["syllables"],
                                  "span_s": m["span_s"], "pauses_s": m["pauses_s"]},
                     "longest_internal_gap_s": m["longest_internal_gap_s"], "audible_in_s": m["audible_in_s"],
                     "audible_out_s": m["audible_out_s"]},
            "placement": row.get("placement") or placement_of(row),
            "take": best["tag"], "takes_tried": len(takes), "pick_reason": why,
            "voice": f"{L.V.voice_id(v['blend'])} (Kokoro-82M stock) · {v['cand']} · speed {best['speed']:.3f}",
            "voiceId": L.V.voice_id(v["blend"]), "model": H.MODEL, "processing": proc, "mouth": mouth, "words": words, "qa": q,
        }
        if label and label.upper() != v["name"]:
            out["speaker_label"] = label
        for k in ("clean", "complete", "interrupt", "nobreath"):
            if k in extra:
                out[k] = extra[k]
        if row.get("joined"):
            out["joined_note"] = "fastrec reads each part of a joined pair on its own (no shared read); see README"
        out["breaths"] = best["layout"]["breaths"] if self.s["breaths"] else []
        out["opened_pauses"] = best["opened"]
        out["alt_takes"] = alts
        return out


def speed_given(row):
    return isinstance(row.get("speed"), (int, float)) or isinstance(((row.get("pace") or {}).get("intended") or {}).get("speed"), (int, float))


def camera_of(label, dev, vo):
    l = (label or "").lower()
    if vo or "v.o." in l: return "vo"
    if dev == "laptop" or "through their laptop" in l: return "speaker"
    if "o.s." in l: return "os"
    if "reflection" in l: return "reflection"
    if dev in ("call", "monitor", "tv") or "monitor" in l or "tile" in l: return "monitor"
    if dev == "pa": return "os"
    return "on"


def placement_of(row):
    g = row.get("gap_before_s")
    if isinstance(g, (int, float)):
        p = {"gap_before_s": float(g), "follows": "voice"}
        if g < 0:
            p["overlap_prev_s"] = -float(g)
        return p
    return {"gap_before_s": None, "follows": "picture"}


def seg_lift(L, y, toks):
    """a question's final move (st): the last word's last 35 % of voiced frames against the rest of it and the word
    before (record_v5.seg_lift on the last word)"""
    import numpy as np
    words = [w for w in toks if w["word"]]
    if not words:
        return None
    w = words[-1]; wp = words[-2] if len(words) > 1 else w
    t, f0, _ = L.f0_contour(y)
    ok = np.isfinite(f0)
    sel = ok & (t >= w["t0"]) & (t <= w["t1"] + 0.05)
    prev = ok & (t >= wp["t0"]) & (t < w["t0"])
    fv = f0[sel]
    if len(fv) < 4:
        return None
    k = max(1, int(round(len(fv) * 0.35)))
    ref = np.concatenate([fv[:-k], f0[prev]]) if prev.any() else fv[:-k]
    return round(float(12 * np.log2(np.median(fv[-k:]) / np.median(ref))), 2)


def file_ok(row, out_dir):
    """the cheap checks on a row's delivered WAV (used to decide whether a line can be skipped on resume)"""
    import soundfile as sf
    p = os.path.join(REPO, row.get("file") or "")
    if not row.get("file") or not os.path.exists(p):
        return False
    info = sf.info(p)
    return info.samplerate == 48000 and info.channels == 1 and info.subtype == "PCM_24" and info.frames > 0


def worker_main(job_path, shard):
    job = jload(job_path)
    s = job["settings"]
    out = s["out"]
    ids = job["shards"][shard]
    lock = os.path.join(out, f".lock-{shard}")
    if os.path.exists(lock):
        try:
            pid = int(open(lock).read().strip() or 0)
            cmd = open(f"/proc/{pid}/cmdline", "rb").read().decode(errors="replace")
            if pid != os.getpid() and "fastrec" in cmd and "_worker" in cmd:
                log(f"[{shard}] shard is locked by a live fastrec worker, pid {pid}; exiting"); return 3
        except (OSError, ValueError):
            pass                                                       # stale lock: that process is gone
    with open(lock, "w") as f:
        f.write(str(os.getpid()))
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(143))           # stopped by the supervisor: run finally, drop the lock
    try:
        import torch
        torch.set_num_threads(s["threads"])
        rows = {r["id"]: r for r in jload(s["lines"]) if r}
        t_load = time.time()
        rec = Recorder(s, shard)
        rec.L.V.pipeline()                                             # load Kokoro once
        asr_only = (job.get("asr_only") or [[]] * len(job["shards"]))[shard]
        log(f"[{shard}] {len(ids)} lines to read, {len(asr_only)} for ASR only; Kokoro loaded in {time.time() - t_load:.1f} s; "
            f"threads {s['threads']}")
        done = fails = 0
        for rid in ids:
            row = rows[rid]
            t0 = time.time()
            try:
                r = rec.record(row)
                done += 1
                q = r["qa"]
                log(f"[{shard}] {rid} {r['speaker'][:16]:16s} {r['voiced_span_s']:5.2f} s span, {r['pace']['wpm']:5.0f} wpm, "
                    f"takes {r['takes_tried']}, wall {time.time() - t0:5.1f} s"
                    + ("" if not s["asr"] else " | ASR queued (packed window)" if r["fast"].get("asr_pending")
                       else f" | ASR recall {q['word_recall_nonames']} '{(q['asr'] or '')[:60]}'"))
            except Exception as e:                                     # one bad line never stops the shard
                fails += 1
                log(f"[{shard}] {rid} FAILED: {type(e).__name__}: {e}")
                jdump_atomic({"id": rid, "error": f"{type(e).__name__}: {e}", "tool": TOOL_VERSION},
                             os.path.join(out, "rows", rid + ".error.json"))
            try:
                rec.flush_asr()
            except Exception as e:
                fails += 1
                log(f"[{shard}] ASR window FAILED: {type(e).__name__}: {e} (those rows keep asr_pending; re-run to redo the ASR only)")
        for rid in asr_only:
            try:
                rec.queue_asr_only(rows[rid], jload(os.path.join(out, "rows", rid + ".json")))
                rec.flush_asr()
            except Exception as e:
                fails += 1
                log(f"[{shard}] {rid} ASR-only FAILED: {type(e).__name__}: {e}")
        try:
            rec.flush_asr(force=True)
        except Exception as e:
            fails += 1
            log(f"[{shard}] ASR window FAILED: {type(e).__name__}: {e} (those rows keep asr_pending; re-run to redo the ASR only)")
        st = dict(rec.stats, shard=shard, worker_s=round(time.time() - t_load, 1))
        st = {k: round(v, 2) if isinstance(v, float) else v for k, v in st.items()}
        jdump_atomic(st, os.path.join(out, "tmp", f"stats-{shard}.json"))
        log(f"[{shard}] done {done}, failed {fails}; synthesis {st['synth_s']} s, ASR {st['asr_s']} s in {st['asr_calls']} "
            f"call(s) for {st['asr_items']} take(s)")
        return 0 if not fails else 2
    finally:
        try:
            os.remove(lock)
        except FileNotFoundError:
            pass


# ============================================================================================ supervisor
def _raise_interrupt(*_):
    raise KeyboardInterrupt


def _die_with_parent():
    """worker preexec (Linux): the worker gets SIGTERM if the supervisor dies, even by SIGKILL, so no orphan keeps
    reading after an interruption (prctl PR_SET_PDEATHSIG). Elsewhere a no-op."""
    try:
        import ctypes
        ctypes.CDLL("libc.so.6", use_errno=True).prctl(1, int(signal.SIGTERM))
    except Exception:
        pass


def cmd_record(a):
    # Ctrl-C and kill both stop the run cleanly, also when it was started as a background job (where a shell starts it
    # with SIGINT ignored): the workers are stopped, the finished lines are merged, and the same command resumes
    signal.signal(signal.SIGINT, signal.default_int_handler)
    signal.signal(signal.SIGTERM, _raise_interrupt)
    out = os.path.abspath(a.out)
    for sub in ("wav", "rows", "log", "qa", "tmp"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    lines_path = os.path.abspath(a.lines)
    rows = [r for r in jload(lines_path) if r]
    if a.ids:
        want = set(a.ids)
        rows = [r for r in rows if r["id"] in want]
    cast = Cast(a.cast)
    ncpu = os.cpu_count() or 4
    threads = a.threads or max(1, min(4, (ncpu - 2) // max(1, a.workers)))
    settings = {"lines": lines_path, "out": out, "cast": os.path.abspath(a.cast), "takes": a.takes,
                "takes_flagged": a.takes_flagged, "flag": a.flag or [], "asr": not a.no_asr, "asr_beam": a.asr_beam,
                "asr_batch_s": a.asr_batch_s, "asr_align": a.asr_align,
                "utmos": a.utmos, "prosody": a.prosody, "breaths": a.breaths, "mp3": a.mp3, "threads": threads}
    # which lines need a read
    force = set(a.force or [])
    todo, skipped, derived, problems, asr_only = [], [], [], [], []
    for r in rows:
        if is_derived(r):
            derived.append(r); continue
        try:
            v = cast.voice(r)
        except KeyError as e:
            problems.append(f"{r['id']}: {e}"); continue
        key = line_key(r, v, speed_of(r, v), settings)
        rp = os.path.join(out, "rows", r["id"] + ".json")
        if "all" not in force and r["id"] not in force and os.path.exists(rp):
            old = jload(rp)
            if old.get("fast", {}).get("key") == key and file_ok(old, out):
                if old["qa"].get("asr") is not None or not settings["asr"]:
                    skipped.append(r["id"]); continue
                asr_only.append(r); continue                       # the audio is done; only its ASR is missing
        todo.append(r)
    for p in problems:
        log("  " + p)
    if problems and not a.skip_missing:
        log(f"{len(problems)} line(s) have no voice: fix audio/voices/cast.json, or pass --skip-missing"); return 2
    log(f"{len(rows)} lines: {len(todo)} to record, {len(skipped)} already done (same key), {len(asr_only)} need ASR only, "
        f"{len(derived)} derived/reused, {len(problems)} with no voice")
    # shards: longest-first by estimated cost (words + a fixed 3 per line for the per-line overhead)
    nw = max(1, min(a.workers, len(todo) + len(asr_only)))
    cost = lambda r: (len(re.findall(r"\w+", r["text"])) + 3) * settings_takes(r, settings)
    shards = [[] for _ in range(nw)]
    load = [0] * nw
    for r in sorted(todo, key=cost, reverse=True):
        k = load.index(min(load))
        shards[k].append(r["id"]); load[k] += cost(r)
    order = {r["id"]: i for i, r in enumerate(rows)}
    shards = [sorted(s, key=order.get) for s in shards]
    asr_shards = [[r["id"] for r in asr_only[k::nw]] for k in range(nw)]
    job = {"settings": settings, "shards": shards, "asr_only": asr_shards}
    job_path = os.path.join(out, "tmp", "job.json")
    jdump_atomic(job, job_path)
    for f in os.listdir(os.path.join(out, "tmp")):
        if f.startswith("stats-") and f.endswith(".json"):
            os.remove(os.path.join(out, "tmp", f))                     # this tool's own per-run worker stats
    t0 = time.time()
    if todo or asr_only:
        env = dict(os.environ, HF_HUB_OFFLINE="1", OMP_NUM_THREADS=str(threads), MKL_NUM_THREADS=str(threads),
                   OPENBLAS_NUM_THREADS=str(threads), TMPDIR=os.path.join(out, "tmp"), PYTHONWARNINGS="ignore")
        procs = []
        for k in range(nw):
            lf = open(os.path.join(out, "log", f"shard-{k}.log"), "a")
            lf.write(f"\n==== {time.strftime('%Y-%m-%d %H:%M:%S')} {TOOL_VERSION} shard {k}/{nw} ({len(shards[k])} lines)\n"); lf.flush()
            procs.append((subprocess.Popen([sys.executable, os.path.abspath(__file__), "_worker", "--job", job_path, "--shard", str(k)],
                                           env=env, stdout=lf, stderr=subprocess.STDOUT, preexec_fn=_die_with_parent), lf))
        log(f"{nw} workers x {threads} threads; logs in {rel(os.path.join(out, 'log'))}/")
        try:
            while any(p.poll() is None for p, _ in procs):
                time.sleep(2)
        except KeyboardInterrupt:
            log("interrupted: stopping workers (finished lines are kept; re-run the same command to resume)")
            for p, _ in procs:
                if p.poll() is None:
                    p.send_signal(signal.SIGTERM)
            for p, _ in procs:
                p.wait()
            merge(lines_path, out, a.lines_out, [r["id"] for r in rows])   # the lines JSON holds what is finished so far
            return 130
        for p, lf in procs:
            lf.close()
        codes = [p.returncode for p, _ in procs]
        log(f"workers exited {codes}")
    wall = time.time() - t0
    # derived and reused lines, after their sources exist
    for r in derived:
        try:
            derive_line(r, rows, out, cast, settings)
        except Exception as e:
            log(f"  {r['id']}: derive failed: {type(e).__name__}: {e}")
    lines_out = merge(lines_path, out, a.lines_out, [r["id"] for r in rows])
    n_takes = sum(settings_takes(r, settings) for r in todo)
    rep = {"lines": len(rows), "recorded": len(todo), "takes": n_takes, "skipped_same_key": len(skipped),
           "asr_only": len(asr_only), "derived": len(derived), "workers": nw, "threads_per_worker": threads,
           "wall_s": round(wall, 1), "takes_per_min": round(n_takes / wall * 60, 1) if todo and wall > 0 else None,
           "load_avg_at_end": list(os.getloadavg()), "cpus": ncpu,
           "settings": {k: settings[k] for k in ("asr", "asr_beam", "asr_batch_s", "asr_align", "utmos", "prosody", "breaths",
                                                 "mp3", "takes", "takes_flagged")}}
    st = [jload(os.path.join(out, "tmp", f)) for f in sorted(os.listdir(os.path.join(out, "tmp")))
          if f.startswith("stats-") and f.endswith(".json")]
    if st:
        rep["workers_cpu"] = {k: round(sum(x.get(k, 0) for x in st), 1) for k in ("synth_s", "asr_s", "asr_calls", "asr_items")}
        rep["workers_cpu"]["note"] = "summed over workers: seconds of wall inside each worker spent reading (Kokoro + house method) and in ASR"
    walls = []
    for r in todo:
        rp = os.path.join(out, "rows", r["id"] + ".json")
        if os.path.exists(rp):
            f = jload(rp).get("fast", {})
            if f.get("key") and f.get("wall_s"):
                walls.append(f["wall_s"])
    if walls:
        rep["per_line_wall_s"] = {"median": round(sorted(walls)[len(walls) // 2], 2), "max": max(walls), "sum": round(sum(walls), 1)}
    rep["finished"] = time.strftime("%Y-%m-%d %H:%M:%S")
    jdump_atomic(rep, os.path.join(out, "qa", "run.json"))                 # the latest run
    with open(os.path.join(out, "qa", "runs.jsonl"), "a") as f:            # every run, for the record
        f.write(json.dumps(rep) + "\n")
    log(json.dumps(rep))
    if not a.no_qa:
        run_qa(out, lines_out)
    return 0


def derive_line(r, rows, out, cast, settings):
    """reuse = the source take copied; derived = the source take through the laptop chain at -22 LUFS (record_v5's
    method for the laptop 'super.')"""
    import numpy as np, soundfile as sf
    sys.path.insert(0, HERE)
    import house as H
    src_id = r.get("reused_from") or r.get("reuse") or r.get("derived_from") or r.get("derive")
    sp = os.path.join(out, "rows", src_id + ".json")
    if not os.path.exists(sp):
        raise FileNotFoundError(f"source {src_id} not recorded in this run (include it in the lines JSON)")
    src = jload(sp)
    rid = r["id"]
    if r.get("reused_from") or r.get("reuse"):
        dst = os.path.join(out, "wav", rid + ".wav")
        shutil.copyfile(os.path.join(REPO, src["file"]), dst)
        new = json.loads(json.dumps(src))
        new.update(id=rid, scene=r.get("scene", src["scene"]), text=r["text"], delivery=r.get("delivery"), tag=r.get("tag"),
                   shot=r.get("shot"), shot_id=r.get("shot_id", r.get("shot")), cue=r.get("cue"), file=rel(dst),
                   reused_from=src_id, status="fast-reused", takes_tried=0, alt_takes=[],
                   pick_reason=f"the same read as {src_id} (a reuse by design)", placement=r.get("placement") or placement_of(r))
    else:
        y, _ = sf.read(os.path.join(REPO, (src.get("nobreath") or {}).get("file") or src["file"]), dtype="float32")
        bed = H.tone(len(y), 26, dbfs=H.TONE_DBFS - 6.0)
        chain = H.laptop_speaker()
        z = H.L.V.apply_chain(np.concatenate([y, np.zeros(int(0.05 * H.SR), np.float32)]), H.SR, chain)[: len(y)]
        z = H.L.V.normalise(z.astype(np.float32), target=H.LAPTOP_LUFS)
        for _ in range(3):
            z = z * 10 ** ((H.LAPTOP_LUFS - H.L.V.lufs(z + bed)) / 20)
        z = (z + bed).astype(np.float32)
        dst = os.path.join(out, "wav", rid + ".wav")
        sf.write(dst, z, H.SR, subtype="PCM_24")
        new = json.loads(json.dumps(src))
        q = H.file_qa(z, H.LAPTOP_LUFS)
        new["qa"].update(q)
        new["qa"]["f0_note"] = "pitch numbers are the source take's: the 330 Hz high-pass removes the fundamental"
        new.update(id=rid, scene=r.get("scene", src["scene"]), text=r["text"], delivery=r.get("delivery"), tag=r.get("tag"),
                   shot=r.get("shot"), shot_id=r.get("shot_id", r.get("shot")), cue=r.get("cue"), file=rel(dst), mp3=None,
                   derived_from=src_id, device="laptop", mode="speaker", on_camera="speaker", lip_sync=False, mouth=[],
                   status="fast-derived", takes_tried=0, alt_takes=[], breaths=[],
                   pick_reason=f"no new read: the {src_id} take through the laptop speaker",
                   processing=[f"source: {src_id} (the same read, unchanged in time)"] + H.L.V.describe_chain(chain)
                              + [f"48 kHz / 24-bit; {H.LAPTOP_LUFS:g} LUFS integrated; room-tone bed {H.TONE_DBFS - 6:g} dBFS"],
                   placement=r.get("placement") or placement_of(r))
        new.pop("nobreath", None); new.pop("clean", None)
    new["fast"] = {"key": None, "tool": TOOL_VERSION, "source": src_id}
    jdump_atomic(new, os.path.join(out, "rows", rid + ".json"))


def order_keys(r):
    out = {k: r.get(k) for k in V5_KEYS}
    for k, v in r.items():
        if k not in out and k not in V5_TAIL:
            out[k] = v
    for k in V5_TAIL:
        out[k] = r.get(k, [])
    return out


def merge(lines_path, out, lines_out=None, ids=None):
    rows = [r for r in jload(lines_path) if r]
    ids = ids or [r["id"] for r in rows]
    merged, missing = [], []
    for rid in ids:
        rp = os.path.join(out, "rows", rid + ".json")
        if os.path.exists(rp):
            merged.append(order_keys(jload(rp)))
        else:
            missing.append(rid)
    lo = os.path.abspath(lines_out or os.path.join(out, "lines.json"))
    jdump_atomic(merged, lo)
    log(f"wrote {rel(lo)}: {len(merged)} rows" + (f"; not recorded: {', '.join(missing)}" if missing else ""))
    return lo


def cmd_merge(a):
    merge(os.path.abspath(a.lines), os.path.abspath(a.out), a.lines_out)
    return 0


# ============================================================================================ QA
def run_qa(out, lines_out=None):
    """1. the file checks and flags of tools/v5/qa_v5.py, applied to any lines JSON (qa_generic);
       2. qa_v5.py itself, unchanged, when every id is an Act Four v5 plan id (it needs plan_lines.json)."""
    lo = lines_out or os.path.join(out, "lines.json")
    res = qa_generic(lo, out)
    rows = jload(lo)
    try:
        plan = {r["id"] for r in jload(PLAN_V5)["voiced"]}
    except Exception:
        plan = set()
    if rows and all(r["id"] in plan for r in rows) and not any(r["id"] == "a5-29-12" and not r.get("joined") for r in rows):
        env = dict(os.environ, V5_LINES=os.path.abspath(lo), V5_QA_OUT=os.path.abspath(out), HF_HUB_OFFLINE="1")
        with open(os.path.join(out, "qa", "qa_v5.log"), "w") as f:
            rc = subprocess.run([sys.executable, QA_V5], env=env, stdout=f, stderr=subprocess.STDOUT).returncode
        log(f"qa_v5.py (the existing Act Four QA, unchanged) exit {rc}: {rel(os.path.join(out, 'qa', 'qa_v5.log'))}, "
            f"{rel(os.path.join(out, 'qa', 'qa-v5.json'))}, string-outs in {rel(os.path.join(out, 'reel'))}/")
        res["qa_v5_exit"] = rc
    else:
        log("qa_v5.py not run: it needs Act Four v5 plan ids (tools/v5/plan_lines.json); the generic checks above apply")
    return res


def qa_generic(lo, out):
    """the hard checks of qa_v5.py (format, loudness +-0.1 LU, true peak <= -1.5 dBTP, no clipping, no digital black,
    handles >= 0.30 s, speech >= 0.12 s in, a natural decay, speed in band +-0.05, mouth tracks well formed) and its
    ear flags (ASR missed a non-name word, pause opened inside the voice, articulation outside the guide), plus a
    dialogue string-out per scene (NOT a timing reference)."""
    import numpy as np, soundfile as sf
    sys.path.insert(0, HERE)
    import house as H
    L = H.L
    rows = jload(lo)
    problems, flags = [], []
    shapes = {"A", "E", "O", "M", "rest", "smile"}
    for r in rows:
        i = r["id"]
        p = os.path.join(REPO, r["file"])
        info = sf.info(p)
        y, sr = sf.read(p, dtype="float32")
        if sr != 48000 or info.subtype != "PCM_24" or info.channels != 1:
            problems.append(f"{i}: format {sr} {info.subtype} {info.channels}ch")
        lu, tp = L.V.lufs(y), L.V.true_peak_db(y)
        tgt = r["qa"]["target_lufs"]
        if r.get("interrupt"):
            cy, _ = sf.read(os.path.join(REPO, r["complete"]["file"]), dtype="float32")
            if abs(L.V.lufs(cy) - tgt) > 0.1:
                problems.append(f"{i}: the complete read measures {L.V.lufs(cy):.2f} LUFS (target {tgt})")
        elif abs(lu - tgt) > 0.1:
            problems.append(f"{i}: LUFS {lu:.2f} (target {tgt})")
        if tp > -1.5:
            problems.append(f"{i}: true peak {tp:.2f} dBTP")
        if int(np.sum(np.abs(y) >= 0.999)):
            problems.append(f"{i}: clipping")
        if H.zero_runs(y):
            problems.append(f"{i}: {H.zero_runs(y)} runs of digital black")
        db = H.rms_db(y, 48000, 0.01)
        loud = np.where(db > -40)[0]
        first, last = loud[0] * 0.01, (loud[-1] + 1) * 0.01
        dur = len(y) / 48000
        if first < 0.30:
            problems.append(f"{i}: head handle {first:.2f} s (< 0.30)")
        if dur - last < 0.30:
            problems.append(f"{i}: tail handle {dur - last:.2f} s (< 0.30)")
        if r["pace"]["audible_in_s"] < 0.12:
            problems.append(f"{i}: speech starts {r['pace']['audible_in_s']:.2f} s into the file (< 0.12)")
        if not r.get("interrupt") and not r.get("derived_from") and r["qa"].get("decay_ms", 99) < 20:
            problems.append(f"{i}: the last word decays in {r['qa']['decay_ms']} ms (a hard stop)")
        if not r.get("derived_from") and not r.get("reused_from"):
            lo_, hi_ = r["pace"]["intended"]["speed_band"]
            if not (lo_ - 0.05 <= r["pace"]["speed"] <= hi_ + 0.05):
                problems.append(f"{i}: speed {r['pace']['speed']} outside the band {lo_}-{hi_}")
        m = r.get("mouth") or []
        if m:
            n = int(np.ceil(dur * 24))
            if m[0]["f"] != 0: problems.append(f"{i}: mouth does not start at f0")
            if any(b["f"] - a["f"] < 2 for a, b in zip(m, m[1:])): problems.append(f"{i}: a 1-frame mouth")
            if m[-1]["shape"] not in ("rest", "smile"): problems.append(f"{i}: mouth ends on {m[-1]['shape']}")
            if any(c["shape"] not in shapes for c in m): problems.append(f"{i}: unknown mouth shape")
            if m[-1]["f"] > n: problems.append(f"{i}: mouth past the end")
        if r.get("derived_from") or r.get("reused_from"):
            continue
        q = r["qa"]
        if q.get("word_recall_nonames") is not None and q["word_recall_nonames"] < 1.0:
            flags.append((i, "asr", f"ASR missed a word: '{q.get('asr')}' (recall {q['word_recall_nonames']})"))
        for o in r.get("opened_pauses", []):
            if o.get("joined_speech") and o.get("opened_s", 0) > 0.01 and (o.get("dip_db") or -99) > -30:
                flags.append((i, "pause-in-voice", f"the {o['target_s']} s pause after '{o['word']}' is opened while the voice still sounds (dip {o.get('dip_db')} dB)"))
        art = r["pace"]["measured"]["articulation_sps"]
        g = r["pace"]["intended"]["articulation_guide_sps"]
        if art and r["pace"]["words"] >= 3 and (art > 6.0 or art > g[1] * 1.15 or art < g[0] * 0.85):
            flags.append((i, "pace", f"articulation {art} syll/s against the guide {g[0]}-{g[1]}"))
        if q.get("q_lift_st") is not None and q["q_lift_st"] < 1.0 and r["text"].rstrip().endswith("?"):
            flags.append((i, "question", f"final move {q['q_lift_st']} st: does it read as a question?"))
    # string-outs per scene (dialogue only, for the ear; gaps from placement, 1.0 s where a line follows picture)
    os.makedirs(os.path.join(out, "reel"), exist_ok=True)
    scenes = {}
    for r in rows:
        scenes.setdefault(str(r.get("scene")), []).append(r)
    made = []
    for sc, rs in scenes.items():
        parts, prev_end = [], 0.0
        for j, r in enumerate(rs):
            y, _ = sf.read(os.path.join(REPO, r["file"]), dtype="float32")
            a_in = r["pace"]["audible_in_s"]
            g = (r.get("placement") or {}).get("gap_before_s")
            on = 1.0 if j == 0 else prev_end + (g if g is not None else 1.0)
            start = max(0.0, on - a_in)
            parts.append((start, y))
            out_s = (r["interrupt"]["fade_from_s"] + 0.05) if r.get("interrupt") else r["pace"]["audible_out_s"]
            prev_end = start + out_s
        n = int((max(s + len(y) / 48000 for s, y in parts) + 0.5) * 48000)
        mix = np.zeros(n, np.float32)
        for s, y in parts:
            k = int(s * 48000); mix[k:k + len(y)] += y[: n - k]
        mp = os.path.join(out, "reel", f"sc{sc}-fast-stringout.mp3")
        L.V.write_wav_mp3(mix, None, mp)
        made.append(rel(mp))
    wc = lambda t: len(re.findall(r"[A-Za-z0-9*']+(?:[-’'][A-Za-z0-9]+)*", t))
    audible = sum(r["voiced_span_s"] for r in rows)
    words = sum(wc(r["text"]) for r in rows)
    summary = {"problems": problems, "flags": [{"id": a, "kind": b, "note": c} for a, b, c in flags],
               "totals": {"lines": len(rows), "words": words, "audible_s": round(audible, 1),
                          "wpm_overall": round(words / audible * 60, 0) if audible else None},
               "stringouts": made,
               "method": "fastrec qa_generic: qa_v5.py's hard checks and ear flags, without its Act Four conversation table"}
    jdump_atomic(summary, os.path.join(out, "qa", "fastrec-qa.json"))
    log(f"QA (generic): {len(problems)} problems, {len(flags)} flags -> {rel(os.path.join(out, 'qa', 'fastrec-qa.json'))}")
    for p in problems:
        log("   PROBLEM " + p)
    for a, b, c in flags:
        log(f"   flag {a} | {b} | {c}")
    return summary


def cmd_qa(a):
    run_qa(os.path.abspath(a.out), a.lines_out)
    return 0


# ============================================================================================ voices
def cmd_voices(a):
    cast = Cast(a.cast)
    v = cast._load()
    for slug in sorted(v):
        x = v[slug]
        b = x.get("band")
        log(f"{slug:24s} {x['name'][:22]:22s} {cast_id(x):34s} {x['cand'][:36]:36s} band {b[0] if b else 'NONE'}  [{x['src']}]")
    labels = cast.doc.get("labels", {})
    bad = [k for k, s in labels.items() if s not in v]
    if bad:
        log("labels pointing at no voice: " + ", ".join(bad))
    if a.labels:
        rows = [r for r in jload(a.labels) if r]
        miss = sorted({r.get("speaker") for r in rows if not is_derived(r) and not _resolves(cast, r)})
        log(f"{len(rows)} rows; labels with no voice: {miss or 'none'}")
    return 0


def cast_id(x):
    import importlib
    sys.path.insert(0, os.path.join(REPO, "audio/voices/tools"))
    V = importlib.import_module("vcast")
    return V.voice_id(x["blend"])


def _resolves(cast, r):
    try:
        cast.voice(r); return True
    except KeyError:
        return False


# ============================================================================================ plan (script -> lines JSON)
SEGS = {"coldopen": ("## COLD OPEN", "## [INTRO"), "act1": ("## ACT ONE", "## ACT TWO"), "act2": ("## ACT TWO", "## ACT THREE"),
        "act3": ("## ACT THREE", "## ACT FOUR"), "act4": ("## ACT FOUR", "## TAG"), "tag": ("## TAG", "# Writer's notes")}
SEG_CODE = {"coldopen": "co", "act1": "a1", "act2": "a2", "act3": "a3", "act4": "a4", "tag": "tg"}
HEAD_RE = re.compile(r"^\*\*([A-Z][A-Z .()#0-9'’-]*?)\*\*\s*(\*\((.*?)\)\*)?\s*(`(\[[^`]*\])`)?\s*\\?\s*$")


def parse_script(path, seg):
    """speaker blocks of one segment: **LABEL** [*(paren)*]\\ / [*(paren)*\\] / text `[tag]` (or a bare [V · …] tag)"""
    src = open(path).read()
    a, b = SEGS[seg]
    i = src.index(a)
    j = src.index(b, i + 1)
    lines = src[i:j].splitlines()
    out, scene, shot = [], None, None
    k = 0
    while k < len(lines):
        ln = lines[k]
        m = re.match(r"^### (\d+[A-Z]?)\.", ln)
        if m:
            scene = m.group(1); k += 1; continue
        m = re.match(r"^`\[([^\]]+)\]`", ln)
        if m:
            shot = m.group(1)
        m = HEAD_RE.match(ln)
        if m and m.group(1).strip() not in ("SOUND", "MUSIC"):
            label = m.group(1).strip()
            paren = [m.group(3)] if m.group(3) else []
            k += 1
            while k < len(lines) and re.match(r"^\*\((.*)\)\*\\?\s*$", lines[k]):
                paren.append(re.match(r"^\*\((.*)\)\*\\?\s*$", lines[k]).group(1)); k += 1
            body = []
            while k < len(lines) and lines[k].strip():
                body.append(lines[k].rstrip("\\").strip()); k += 1
            text = " ".join(body)
            tag = m.group(5)
            mt = None if tag else re.search(r"\s*`(\[[^`]*\])`\s*$", text) or re.search(r"\s*(\[(?:V|P|P✓|K|H|SINGLE|INVENTED)\b[^\]]*\])\s*$", text)
            if mt:
                tag = mt.group(1); text = text[: mt.start()].strip()
            if tag is None:
                mt = re.search(r"\s*`(\[[^`]*\])`\s*$", text)
                if mt:
                    tag = mt.group(1); text = text[: mt.start()].strip()
            if not text:
                continue
            out.append({"scene": scene, "shot": shot, "label": label, "paren": "; ".join(paren), "text": text, "tag": tag})
            continue
        k += 1
    return out


def say_from_text(text, lexicon):
    s = text
    s = re.sub(r"\*\((beat|a beat|pause)\)\*", "{0.6}", s, flags=re.I)
    s = re.sub(r"\*\([^)]*\)\*", "", s)                                   # other stage directions out
    s = re.sub(r"[\U0001F300-\U0001FAFF☀-➿]", "", s)             # emoji out
    s = s.replace("“", "").replace("”", "").replace('"', "").replace("…", "...").strip()
    s = re.sub(r"^\.\.\.\s*", "", s)
    for w, ph in lexicon.items():          # any case ('GNIB' and 'gnib'), the script's own spelling kept inside [ ]
        s = re.sub(rf"(?<![\w\[/]){re.escape(w)}(?![\w\]/])", lambda m, ph=ph: f"[{m.group(0)}](/{ph}/)", s, flags=re.I)
    s = re.sub(r"\s+\{", "{", s)                                          # 'Ours. {0.6} We' -> 'Ours.{0.6} We'
    return re.sub(r"\s+", " ", s).strip()


def cmd_plan(a):
    import difflib
    cast = Cast(a.cast)
    blocks = parse_script(a.script, a.seg)
    prev = [r for r in jload(a.prev) if r] if a.prev and os.path.exists(a.prev) else []
    used = {r["id"] for r in prev}
    code = SEG_CODE[a.seg]
    rows, nextn = [], {}
    for r in prev:
        m = re.match(rf"^e1-{code}-(\w+)-(\d+)$", r["id"])
        if m:
            nextn[m.group(1)] = max(nextn.get(m.group(1), 0), int(m.group(2)))
    matched = set()
    last_speaker, last_scene = None, None
    for b in blocks:
        text_disp = re.sub(r"\s*\*\([^)]*\)\*\s*", " ", b["text"]).strip()
        rid = None
        cands = [r for r in prev if r["id"] not in matched and r.get("scene") == b["scene"]]
        best = max(cands, key=lambda r: difflib.SequenceMatcher(a=r["text"], b=text_disp).ratio(), default=None)
        if best and difflib.SequenceMatcher(a=best["text"], b=text_disp).ratio() >= 0.6:
            rid = best["id"]; matched.add(rid)
        if not rid:
            sc = str(b["scene"]).lower()
            nextn[sc] = nextn.get(sc, 0) + 1
            rid = f"e1-{code}-{sc}-{nextn[sc]:02d}"
            while rid in used:
                nextn[sc] += 1; rid = f"e1-{code}-{sc}-{nextn[sc]:02d}"
            used.add(rid)
        label = b["label"]
        slug = cast.slug_of(label)
        kind = "vo" if "(V.O.)" in label else "dialogue"
        paren = b["paren"].lower()
        has = lambda w: re.search(rf"\b{w}\b", paren) is not None       # whole words: 'microphone' is not a phone
        dev = ("monitor" if has("monitor") else
               "call" if has("on the call") or (has("phone") and not has("on his phone") and not has("on her phone")) else
               "pa" if has("pa") else None)
        if b["scene"] != last_scene:
            gap = None
        else:
            gap = 0.35 if label == last_speaker else 0.7
        n_words = len(re.findall(r"\w+", text_disp))
        row = {"id": rid, "scene": b["scene"], "speaker": label, "speaker_label": label, "text": text_disp,
               "say": say_from_text(b["text"], cast.lexicon()), "delivery": b["paren"] or None, "tag": b["tag"],
               "kind": kind, "device": dev, "shot": b["shot"], "voice_slug": slug, "speed": None,
               "gap_before_s": gap, "est_s": round(0.4 + n_words / 2.6, 1)}
        rows.append(row)
        last_speaker, last_scene = label, b["scene"]
    if prev:
        old = {r["id"]: r for r in prev}
        new = {r["id"]: r for r in rows}
        log(f"added {sorted(set(new) - set(old))}")
        log(f"dropped {sorted(set(old) - set(new))}")
        log(f"changed {[k for k in new if k in old and old[k]['text'] != new[k]['text']]}")
    miss = sorted({r["speaker"] for r in rows if not r["voice_slug"]})
    jdump_atomic(rows, os.path.abspath(a.out))
    log(f"wrote {rel(os.path.abspath(a.out))}: {len(rows)} lines, {sum(len(re.findall(chr(92) + 'w+', r['text'])) for r in rows)} words; "
        f"labels with no voice: {miss or 'none'}")
    return 0


# ============================================================================================ CLI
def main(argv=None):
    ap = argparse.ArgumentParser(prog="fastrec", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("record", help="record every line that needs a take, in parallel, then merge and QA")
    r.add_argument("--lines", required=True, help="the lines JSON (lines-v5.json row format)")
    r.add_argument("--out", required=True, help="the output folder (wav/, rows/, log/, qa/, lines.json)")
    r.add_argument("--lines-out", help="where the merged lines JSON goes (default <out>/lines.json)")
    r.add_argument("--ids", nargs="*", help="only these ids")
    r.add_argument("--workers", type=int, default=4)
    r.add_argument("--threads", type=int, default=0, help="torch / ASR threads per worker (default (cores - 2) / workers, max 4)")
    r.add_argument("--takes", type=int, default=1, help="takes per line (seeds 1..N)")
    r.add_argument("--flag", nargs="*", help="ids that get --takes-flagged takes (also: a row's \"flag\": true or \"takes\": N)")
    r.add_argument("--takes-flagged", type=int, default=2)
    r.add_argument("--no-asr", action="store_true", help="skip the ASR check (the only automatic misread check)")
    r.add_argument("--asr-beam", type=int, default=1, help="faster-whisper beam size (1 = greedy, the fast default; v5 used 5)")
    r.add_argument("--asr-batch-s", type=float, default=24.0,
                   help="pack single-take lines into ASR windows of up to this many seconds (0 = one ASR call per line)")
    r.add_argument("--asr-align", action="store_true", help="ASR word timestamps and the Kokoro/ASR onset check (align_median_s); ~20%% more ASR time")
    r.add_argument("--utmos", action="store_true", help="UTMOS22 naturalness score per take (the audit round)")
    r.add_argument("--prosody", action="store_true", help="pYIN F0 (a4lib.analyse) and the question final-move check")
    r.add_argument("--breaths", action="store_true", help="placeholder inhales (off by default: audit §3.5)")
    r.add_argument("--mp3", action="store_true", help="also write level-matched MP3s")
    r.add_argument("--force", nargs="*", help="re-record these ids (or 'all') even when the key matches")
    r.add_argument("--skip-missing", action="store_true", help="record what has a voice; report the rest")
    r.add_argument("--no-qa", action="store_true")
    r.add_argument("--cast", default=CAST_JSON)
    m = sub.add_parser("merge", help="rows/ -> one lines JSON in input order")
    m.add_argument("--lines", required=True); m.add_argument("--out", required=True); m.add_argument("--lines-out")
    q = sub.add_parser("qa", help="the file checks and flags; qa_v5.py too for Act Four ids")
    q.add_argument("--out", required=True); q.add_argument("--lines-out")
    v = sub.add_parser("voices", help="list the cast registry; check a lines JSON's labels")
    v.add_argument("--labels"); v.add_argument("--cast", default=CAST_JSON)
    p = sub.add_parser("plan", help="draft a lines JSON from the Ep1 script's speaker blocks")
    p.add_argument("--seg", required=True, choices=sorted(SEGS)); p.add_argument("--out", required=True)
    p.add_argument("--prev", help="an earlier plan: ids are kept for lines that match it"); p.add_argument("--script", default=SCRIPT_EP1)
    p.add_argument("--cast", default=CAST_JSON)
    w = sub.add_parser("_worker"); w.add_argument("--job", required=True); w.add_argument("--shard", type=int, required=True)
    a = ap.parse_args(argv)
    sys.path.insert(0, HERE); sys.path.insert(0, TOOLS); sys.path.insert(0, os.path.join(TOOLS, "v5"))
    if a.cmd == "_worker":
        return worker_main(a.job, a.shard)
    return {"record": cmd_record, "merge": cmd_merge, "qa": cmd_qa, "voices": cmd_voices, "plan": cmd_plan}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
