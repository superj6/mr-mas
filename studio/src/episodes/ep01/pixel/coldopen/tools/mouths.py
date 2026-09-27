#!/usr/bin/env python3
"""mouths.py - MR. MAS Ep1 v3 pixel shots (the v3-shots-coldopen-tag pass): mouth tracks for the on-camera takes of the
cold open and the tag, whose fastrec takes carry none (they were recorded with `lip_sync: false`, `mouth: []`).

Without a track the pipeline flaps a faced line on 4s, and lock.py only builds a track from the words when a line has no
take at all (it then loses the take's mode and O.S. flag). This writes a COPY of the takes rows the segment needs, with a
`mouth` track added to the on-camera ones, so `lock.py --takes <this file>` gives the layouts real mouths. The audio and
the original takes files are never touched.

The method is the house one, a4lib.mouth_cues (audio/ep01/act4/dialogue/tools/a4lib.py) re-implemented in the standard
library (that module imports torch and the casting renderer): the take's own word spans with their misaki phonemes, time
split across the phonemes by weight; each phoneme to a portrait mouth (A open, E spread, O round, M closed); the 10 ms
envelope gates it (soft frames never open past E, inaudible frames inside a word are gaps); gaps of 3 frames or more
rest; drawings held on 2s, with M / O / A stealing a frame from a longer neighbour so a closure always reads.

  python3 studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py coldopen   # -> pixel/coldopen/takes-mouth.json
  python3 studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py tag        # -> pixel/tag/takes-mouth.json
"""
from __future__ import annotations

import json
import math
import os
import struct
import sys
import wave

ROOT = "/home/jgon/project/art/mrmas"
FPS = 24
SEGS = {
    "coldopen": {"takes": ["audio/ep01/coldopen/dialogue/lines-fast-v1.json"],
                 "faced": ["e1-co-1-02", "e1-co-2-01"],
                 "out": "studio/src/episodes/ep01/pixel/coldopen/takes-mouth.json"},
    "tag": {"takes": ["audio/ep01/tag/dialogue/lines-fast-v1.json", "audio/ep01/v3/tag/lines-v3.json"],
            "faced": ["e1-tg-32-01", "e1-tg-33-01"],
            "out": "studio/src/episodes/ep01/pixel/tag/takes-mouth.json"},
}

# misaki American phonemes -> portrait mouths (a4lib.MOUTH_OF)
MOUTH_OF: dict[str, str] = {}
for ch in "ɑæʌaɐɛIWA":
    MOUTH_OF[ch] = "A"
for ch in "iɪeəᵊᵻ":
    MOUTH_OF[ch] = "E"
for ch in "uʊoɔOYɒɜɚ":
    MOUTH_OF[ch] = "O"
for ch in "pbm":
    MOUTH_OF[ch] = "M"
MOUTH_OF["w"] = "O"
VOWELS = set("ɑæʌaɐIWiɪeɛAəᵊᵻɚɜuʊoɔOYɒ")
DIPH = set("AIOWY")
SONOR = set("lɹwjnŋm")


def read_wav(path: str) -> tuple[list[float], int]:
    w = wave.open(path)
    n, sw, ch, sr = w.getnframes(), w.getsampwidth(), w.getnchannels(), w.getframerate()
    raw = w.readframes(n)
    out: list[float] = []
    step = sw * ch
    for i in range(0, len(raw) - step + 1, step):
        b = raw[i:i + sw]
        if sw == 3:
            v = int.from_bytes(b, "little", signed=True) / 8388608.0
        elif sw == 2:
            v = struct.unpack("<h", b)[0] / 32768.0
        else:
            v = struct.unpack("<i", b)[0] / 2147483648.0
        out.append(v)
    return out, sr


def rms_db(y: list[float], sr: int, win: float = 0.01) -> tuple[list[float], int]:
    n = max(1, int(sr * win))
    env = [math.sqrt(sum(s * s for s in y[i:i + n]) / n + 1e-12) for i in range(0, len(y) - n + 1, n)]
    ref = max(env) if env else 1.0
    return [20 * math.log10(e / ref) for e in env], n


def phoneme_spans(tok: dict) -> list[tuple[str, float, float, bool]]:
    units, stress_next = [], False
    for ch in tok.get("ph", ""):
        if ch in "ˈˌ":
            stress_next = ch == "ˈ"
            continue
        if ch in " -":
            continue
        w = 2.4 if ch in DIPH else 2.0 if ch in VOWELS else 1.0 if ch in SONOR else 0.6 if ch == "h" else 0.8
        units.append((ch, w, stress_next and ch in VOWELS))
        if ch in VOWELS:
            stress_next = False
    if not units:
        return [("", tok["t0"], tok["t1"], False)]
    tot = sum(u[1] for u in units)
    t, span, out = tok["t0"], tok["t1"] - tok["t0"], []
    for ch, w, s in units:
        d = span * w / tot
        out.append((ch, t, t + d, s))
        t += d
    return out


def mouth_cues(y: list[float], sr: int, words: list[dict], hold: int = 2, closed_db: float = -38.0, soft_db: float = -22.0) -> list[dict]:
    n = int(math.ceil(len(y) / sr * FPS))
    db, hop = rms_db(y, sr)
    spans = [s for t in words for s in phoneme_spans(t)]
    last_end = max([t["t1"] for t in words] or [0.0])
    shapes: list[str | None] = []
    for f in range(n):
        tc = (f + 0.5) / FPS
        i = min(len(db) - 1, int(tc * sr / hop))
        e = max(db[max(0, i - 1): i + 2])
        ph = next((s for s in spans if s[1] <= tc < s[2]), None)
        if ph is None:
            shapes.append(None)
            continue
        ch = ph[0]
        if e < -42.0 and ch not in "pbm":
            shapes.append(None)
            continue
        if ch == "h":
            j = spans.index(ph)
            ch = next((s[0] for s in spans[j + 1:] if s[0] in VOWELS), "ə")
        m = MOUTH_OF.get(ch, "E")
        if m == "E" and ch in VOWELS and ph[3] and e > -8.0:
            m = "A"
        if m == "A" and e < soft_db and not ph[3]:
            m = "E"
        if m == "A" and e < closed_db:
            m = "E"
        shapes.append(m)
    i = 0
    while i < n:
        if shapes[i] is None:
            j = i
            while j < n and shapes[j] is None:
                j += 1
            after = (i + 0.5) / FPS >= last_end
            fill = "rest" if (j - i >= 3 or i == 0 or after) else shapes[i - 1]
            for k in range(i, j):
                shapes[k] = fill
            i = j
        else:
            i += 1
    changed = True
    while changed:
        changed = False
        runs: list[list] = []
        for f, s in enumerate(shapes):
            if runs and runs[-1][0] == s:
                runs[-1][2] = f + 1
            else:
                runs.append([s, f, f + 1])
        for r_i, (s, a, b) in enumerate(runs):
            if b - a >= hold or b == n:
                continue
            if s in ("M", "O", "A") and r_i + 1 < len(runs) and runs[r_i + 1][2] - runs[r_i + 1][1] > hold:
                shapes[b] = s
            elif s in ("M", "O", "A") and r_i > 0 and runs[r_i - 1][2] - runs[r_i - 1][1] > hold:
                shapes[a - 1] = s
            elif r_i > 0:
                for k in range(a, b):
                    shapes[k] = runs[r_i - 1][0]
            elif r_i + 1 < len(runs):
                for k in range(a, b):
                    shapes[k] = runs[r_i + 1][0]
            changed = True
            break
    cues: list[dict] = []
    for f, s in enumerate(shapes):
        if not cues or cues[-1]["shape"] != s:
            cues.append({"t": round(f / FPS, 3), "f": f, "shape": s})
    if not cues or cues[-1]["shape"] != "rest":
        cues.append({"t": round(n / FPS, 3), "f": n, "shape": "rest"})
    return cues


def main(seg: str) -> None:
    cfg = SEGS[seg]
    rows = []
    for p in cfg["takes"]:
        rows += json.load(open(os.path.join(ROOT, p)))
    made = []
    for r in rows:
        r = dict(r)
        if r["id"] in cfg["faced"]:
            y, sr = read_wav(os.path.join(ROOT, r["file"]))
            r["mouth"] = mouth_cues(y, sr, r["words"])
            r["_mouth_src"] = "v3-shots-coldopen-tag coldopen/tools/mouths.py (a4lib.mouth_cues on the take's words + WAV)"
            made.append(f"{r['id']} {len(r['mouth'])} keys: " + " ".join(f"{c['f']}{c['shape']}" for c in r["mouth"]))
        rows[rows.index(next(x for x in rows if x["id"] == r["id"]))] = r
    out = os.path.join(ROOT, cfg["out"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(rows, open(out, "w"), ensure_ascii=False, indent=1)
    print(f"wrote {cfg['out']} ({len(rows)} rows, {len(made)} mouth tracks)")
    for m in made:
        print("  " + m)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "coldopen")
