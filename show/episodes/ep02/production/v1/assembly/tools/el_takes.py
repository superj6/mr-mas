#!/usr/bin/env python3
"""el_takes.py - Ep2 v1: the takes files the ElevenLabs picture locks read, one per segment. A copy of Ep1's
(show/episodes/ep01/production/full-v3/assembly/tools/el_takes.py, locked), pointed at Ep2:
  * the EL takes: audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json (el_render.py; --takes-dir another folder);
  * the camera fields (kind, mode, on_camera, lip_sync, device, speaker...) come from the Kokoro take of the same line
    when the base lock used one (show/reel/ep02-v1/ep02-v1-<seg>.json _source.takes_files); an Ep2 line voiced
    straight in ElevenLabs keeps the EL row's own fields;
  * every non-V.O. take gets a mouth track by the house method (mouths.py's mouth_cues, Ep2's copy at
    studio/src/episodes/ep02/pixel/tools/mouths.py), misaki's G2P per word (a word misaki doesn't know takes a Kokoro
    take's phonemes, else a letter guess, logged); MARIO's Kokoro rows keep their own mouth track.
  audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/el_takes.py [--lock v1] [--takes-dir D] [seg ...]
  -> show/episodes/ep02/production/v1/assembly/el-v1/<seg>-takes.json (+ el-takes-report.json). The audio is never touched.
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

import importlib.util
import json
import os
import re
import sys

import numpy as np
import soundfile as sf

ROOT = REPO
LOCKV = "v1"
OUT = f"{ROOT}/show/episodes/ep02/production/v1/assembly/el-v1"
EL_TAKES = f"{ROOT}/audio/ep02/v1-el/ep02-v1"
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
FROM_KOKORO = ("kind", "mode", "on_camera", "lip_sync", "device", "speaker", "speaker_slug", "tag", "side", "pov", "shot", "shot_id")

_spec = importlib.util.spec_from_file_location("ep2_mouths", f"{ROOT}/studio/src/episodes/ep02/pixel/tools/mouths.py")
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
        tl = f"{ROOT}/show/reel/ep02-{LOCKV}/ep02-{LOCKV}-{seg}.json"           # the Kokoro base lock's takes, if any
        files = (json.load(open(tl)).get("_source") or {}).get("takes_files") or [] if os.path.exists(tl) else []
        for p in files:
            if not os.path.exists(f"{ROOT}/{p}") or os.path.basename(p).startswith("lines-A") or not p.endswith(".json"):
                continue
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

    report = {"about": "el_takes.py (Ep2): EL takes with the Kokoro takes' camera fields (where a Kokoro take exists) and a mouth track (mouths.py's mouth_cues)", "segments": {}}
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
            elif r.get("engine") == "kokoro" and r.get("mouth") is not None:
                # cast on Kokoro in the EL film (cast-el.json engine; v3.5: MARIO): the Kokoro take's own row, words
                # and mouth track, as the Kokoro picture lock has them
                rep["kokoro_cast"] = rep.get("kokoro_cast", 0) + 1
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
            x["_assembly"] = "Ep2 el_takes.py: EL take (file, length, words) + the Kokoro take's camera fields (if any) + a mouth track (ep02 pixel/tools/mouths.py mouth_cues)"
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
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("segs", nargs="*")
    ap.add_argument("--lock", default="v1")
    ap.add_argument("--takes-dir", default=None, help="the EL takes folder (<dir>/<seg>/lines-A.json)")
    ap.add_argument("--out", default=None, help="(a test) write here instead of assembly/el-<lock>/")
    a = ap.parse_intermixed_args()
    LOCKV = a.lock
    OUT = os.path.abspath(a.out) if a.out else f"{ROOT}/show/episodes/ep02/production/v1/assembly/el-{a.lock}"
    EL_TAKES = os.path.abspath(a.takes_dir) if a.takes_dir else f"{ROOT}/audio/ep02/v1-el/ep02-{a.lock}"
    main(a.segs or SEGS)
