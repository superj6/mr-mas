#!/usr/bin/env python3
"""el_takes.py - Ep1 v3, the v3-assemble pass: the takes files the ElevenLabs picture locks read, one per segment.

The EL takes (audio/ep01/v3-el/ep01/<seg>/lines-A.json, the v3-voices-el pass's) carry no mouth track, and their
on-camera / mode / device fields are the renderer's own, not the Kokoro takes' the picture passes locked against. So
for each segment this writes a COPY of the EL rows (the audio and the EL files are never touched):
  * the file, its length (frames_24, duration_s) and the words are the EL take's;
  * kind, mode, on_camera, lip_sync, device, speaker (and the stick-facing tags) are the Kokoro take's, the same row
    the Kokoro lock read (so every line is on or off camera, through a device or not, exactly as the Kokoro picture);
  * every non-V.O. take gets a mouth track by the house method, a4lib.mouth_cues as the cold-open pass re-implemented
    it (studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py, imported, not copied or edited): the take's own word
    spans with their phonemes, gated by the WAV's 10 ms envelope. The EL words have no phonemes, so each word gets
    misaki's G2P (the Kokoro front end); a word misaki doesn't know (the parody names) takes the phonemes the Kokoro
    takes gave the same word, and failing that a letter-by-letter guess (logged).
  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/el_takes.py [--lock v31] [seg ...]
  -> show/episodes/ep01/production/full-v3/assembly/el/<seg>-takes.json (+ el-takes-report.json)
  --lock v31: the v3.1 EL takes (audio/ep01/v3-el/ep01-v31/) -> assembly/el-v31/. The Kokoro takes are always the ones
  the current Kokoro locks (full-v3/lock/<seg>.json) name.
"""
from __future__ import annotations

import importlib.util
import json
import os
import re
import sys

import numpy as np
import soundfile as sf

ROOT = "/home/jgon/project/art/mrmas"
OUT = f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/el"
EL_TAKES = f"{ROOT}/audio/ep01/v3-el/ep01"
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
FROM_KOKORO = ("kind", "mode", "on_camera", "lip_sync", "device", "speaker", "speaker_slug", "tag", "side", "pov", "shot", "shot_id")

_spec = importlib.util.spec_from_file_location("co_mouths", f"{ROOT}/studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py")
M = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(M)


def rms_db_np(y, sr, win=0.01):
    """mouths.rms_db, the same numbers, in numpy (the pure-python one is slow over 228 takes)"""
    n = max(1, int(sr * win))
    a = np.asarray(y, dtype="float64")
    m = (len(a) - n) // n + 1 if len(a) >= n else 0
    if m <= 0:
        return [], n
    seg = a[: m * n].reshape(m, n)
    env = np.sqrt((seg * seg).sum(axis=1) / n + 1e-12)
    ref = env.max()
    return list(20 * np.log10(env / ref)), n


M.rms_db = rms_db_np


def load_mono(path):
    y, sr = sf.read(path, dtype="float64", always_2d=True)
    return list(y[:, 0]), sr


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower())


LETTER = {"a": "æ", "e": "ɛ", "i": "ɪ", "o": "ɑ", "u": "ʌ", "y": "i", "w": "w", "m": "m", "b": "b", "p": "p"}


def main(segs):
    from misaki import en  # the Kokoro front end (audio/.venv-casting)
    g2p = en.G2P(trf=False, british=False, fallback=None)
    kok_ph: dict[str, str] = {}
    kokoro: dict[str, dict] = {}
    for seg in SEGS:
        lk = json.load(open(f"{ROOT}/show/episodes/ep01/production/full-v3/lock/{seg}.json"))
        for p in lk["meta"]["takes"]:
            for r in json.load(open(f"{ROOT}/{p}")):
                kokoro.setdefault(seg, {})[r["id"]] = r
                for w in r.get("words") or []:
                    if w.get("ph"):
                        kok_ph.setdefault(norm(w["w"]), w["ph"])
    cache: dict[str, tuple[str, str]] = {}

    def ph_of(word):
        k = norm(word)
        if k in cache:
            return cache[k]
        ph, src = None, None
        clean = re.sub(r"[^A-Za-z0-9'\- ]", "", word).strip()
        if clean:
            try:
                ps, toks = g2p(clean)
                if toks and all(t.phonemes for t in toks if re.search(r"[A-Za-z0-9]", t.text)) and "❓" not in ps:
                    ph, src = re.sub(r"[^\wɐ-˿ᴀ-ᶿˈˌ ]", "", ps), "misaki"
            except Exception:  # noqa: BLE001
                ph = None
        if not ph and k in kok_ph:
            ph, src = kok_ph[k], "kokoro-take"
        if not ph:
            ph, src = "".join(LETTER.get(c, "n" if c.isalpha() else "") for c in k) or "ə", "letters"
        cache[k] = (ph, src)
        return cache[k]

    report = {"about": "el_takes.py: EL takes with the Kokoro takes' camera fields and a mouth track (mouths.py's mouth_cues)", "segments": {}}
    os.makedirs(OUT, exist_ok=True)
    for seg in segs:
        rows = json.load(open(f"{EL_TAKES}/{seg}/lines-A.json"))
        K = kokoro.get(seg, {})
        out, rep = [], {"rows": len(rows), "with_kokoro_row": 0, "mouths": 0, "vo": 0, "ph_sources": {}, "letter_guesses": [], "no_kokoro_row": []}
        for r in rows:
            x = dict(r)
            k = K.get(r["id"])
            if k:
                rep["with_kokoro_row"] += 1
                for f in FROM_KOKORO:
                    if f in k:
                        x[f] = k[f]
                    elif f in x:
                        del x[f]
            else:
                rep["no_kokoro_row"].append(r["id"])
            kind = x.get("kind") or ("vo" if re.fullmatch(r"V\.?O\.?", (x.get("tag") or "").strip(), re.I) else "dialogue")
            if kind == "vo":
                x["mouth"] = []
                rep["vo"] += 1
            else:
                words = []
                for w in r.get("words") or []:
                    ph, src = ph_of(w["w"])
                    rep["ph_sources"][src] = rep["ph_sources"].get(src, 0) + 1
                    if src == "letters":
                        rep["letter_guesses"].append(w["w"])
                    words.append({"w": w["w"], "t0": float(w["t0"]), "t1": float(w["t1"]), "ph": ph})
                y, sr = load_mono(os.path.join(ROOT, r["file"]))
                x["mouth"] = M.mouth_cues(y, sr, words) if words else []
                x["words"] = words
                rep["mouths"] += 1 if x["mouth"] else 0
            x["_assembly"] = "v3-assemble el_takes.py: EL take (file, length, words) + the Kokoro take's camera fields + a mouth track (coldopen/tools/mouths.py mouth_cues)"
            out.append(x)
        json.dump(out, open(f"{OUT}/{seg}-takes.json", "w"), ensure_ascii=False, indent=1)
        rep["letter_guesses"] = sorted(set(rep["letter_guesses"]))
        report["segments"][seg] = rep
        print(f"{seg}: {len(out)} rows, {rep['with_kokoro_row']} with a Kokoro row, {rep['mouths']} mouth tracks, {rep['vo']} V.O.; phonemes {rep['ph_sources']}; letter guesses {rep['letter_guesses']}")
    prev = f"{OUT}/el-takes-report.json"
    if os.path.exists(prev):
        old = json.load(open(prev))
        old["segments"].update(report["segments"])
        report = old
    json.dump(report, open(prev, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--lock"]:
        v = args[1]
        OUT = f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/el-{v}"
        EL_TAKES = f"{ROOT}/audio/ep01/v3-el/ep01-{v}"
        args = args[2:]
    main(args or SEGS)
