#!/usr/bin/env python3
"""MR. MAS - range E1-P1 (1.A, CLOD under its launch light): the TEMP dialogue takes, recorded locally.

Stock Kokoro-82M packs only (lang 'a'); no reference audio of anyone is loaded, nothing is tuned toward a real
person, no external API is called. The Act Four recordist's toolkit is imported READ-ONLY for synthesis,
pause control, measurement and mouth cues (audio/ep01/act4/dialogue/tools/a4lib.py, cast_a4.py).

  MARIO  the returning cast pick (CASTING.md): a-liam-earnest, am_liam, the dry 'lecture' chain, 145-160 wpm
  CLOD   a temp stock pack for the product's voice (logged in the E1-P1 README, not a casting decision):
         af_sky x0.6 + am_echo x0.4, bright and soft, a light 'eager' lift; no room (the mix adds the pool)

  <casting venv python> tools/voice.py <outdir>
writes <outdir>/<id>.wav (48 kHz mono, -16 LUFS, dry) and <outdir>/takes.json (durations in frames, word spans,
mouth cues on 2s, pace, F0, ASR character error rate).
"""
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

sys.path.insert(0, os.path.join(REPO, "audio/ep01/act4/dialogue/tools"))
sys.path.insert(0, os.path.join(REPO, "audio/voices/tools"))
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

import a4lib as L  # noqa: E402  (read-only)
import cast_a4 as CA  # noqa: E402  (read-only)
import cast as C  # noqa: E402  (read-only casting chains)

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

MARIO = dict(CA.RETURNING["mario"])
CLOD = {
    "name": "CLOD", "blend": {"af_sky": 0.6, "am_echo": 0.4}, "speed": 1.02,
    "chain": L.dry(C.bright_dry(1.0)), "wpm": (160, 190),
}

LINES = [
    # id, voice, text (with {s} pause marks), seed
    ("mario-memo", MARIO, "Memo, on race dynamics.{0.30} Point one:{0.22} we must not launch on the same day as them.{0.30} That's how a race starts.", 11, 0.86, None),
    ("clod-right", CLOD, "You're absolutely right!", 5, 1.0, None),
    # one word: a carrier ("Right, okay.") and plain text were both heard as "addendums" by the ASR; the misaki
    # phoneme override (the word's own dictionary phonemes, spelled out) reads clean (CER 0)
    ("mario-addendum", MARIO, "[Addendum](/ədˈɛndəm/).", 3, 1.0, None),
]

res = {}
for lid, v, say, seed, sps, carrier in LINES:
    best = None
    for s in (seed, seed + 1, seed + 2, seed + 3, seed + 4):
        y, toks, info = L.render(say, v, seed=s, speed_scale=sps, wpm_band=v.get("wpm"), carrier=carrier)
        wav = os.path.join(OUT, f"{lid}-s{s}.wav")
        sf.write(wav, y, L.SR, subtype="PCM_24")
        try:
            hyp, _lp, _ws = L.asr_words(wav)
            cer = L.cer(L.parse_say(say)[0], hyp)
        except Exception as e:  # ASR is a check, not a gate
            hyp, cer = f"(asr failed: {e})", None
        an = L.analyse(y, toks)
        cand = {"seed": s, "wav": wav, "y": y, "toks": toks, "info": info, "asr": hyp, "cer": cer, "an": an}
        if best is None or (cer is not None and (best["cer"] is None or cer < best["cer"])):
            best = cand
        if cer is not None and cer <= 0.02:
            break
    y, toks = best["y"], best["toks"]
    final = os.path.join(OUT, f"{lid}.wav")
    sf.write(final, y, L.SR, subtype="PCM_24")
    cues = L.mouth_cues(y, toks, end_shape="smile" if lid.startswith("clod") else "rest")
    words = [{"w": t["text"], "t0": round(t["t0"], 3), "t1": round(t["t1"], 3)} for t in toks if t["word"]]
    an = best["an"]
    res[lid] = {
        "file": final, "seed": best["seed"], "dur_s": round(len(y) / L.SR, 3), "frames": int(np.ceil(len(y) / L.SR * 24)),
        "words": words, "mouth": cues, "asr": best["asr"], "cer": best["cer"],
        "speed": best["info"].get("speed"), "dry_wpm": best["info"].get("dry_wpm"),
        "analysis": {k: (float(vv) if isinstance(vv, (np.floating, float, int)) else vv) for k, vv in an.items() if not isinstance(vv, (list, dict, np.ndarray))},
    }
    print(lid, "seed", best["seed"], "dur", res[lid]["dur_s"], "frames", res[lid]["frames"], "wpm", res[lid]["dry_wpm"], "cer", best["cer"], "|", best["asr"])
json.dump(res, open(os.path.join(OUT, "takes.json"), "w"), indent=1, default=str)
