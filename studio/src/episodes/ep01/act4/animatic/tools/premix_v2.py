"""premix_v2.py - THE EDITOR's dialogue premix for the Act Four animatic v2 (timing lock v2).

Lays every voiced cue of shots-locked-v2.json `audio_cues` (dialogue + V.O.; posts are unvoiced in the cut) at its act
frame (1 frame = 2000 samples at 48 kHz), with the lock's gain (V.O. +2 dB to dialogue level, pov-and-framing 5.1;
a4-27-00 at its delivered -22 LUFS). Phrase-clipped cues (TASYA's three-part line) take only their clip. Dry: no room
tone, no score, no SFX (those are the mix's). Digital silence between lines, as the dialogue stage delivered them.

Output: out/ep01/act4/animatic/act4-dialogue-premix-v2.wav (48 kHz, mono, 24-bit) + a cue sheet next to it.
Run (needs numpy + soundfile; the casting venv has both):
  audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/premix_v2.py
"""
import json
import os

import numpy as np
import soundfile as sf

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
SR, FPS = 48000, 24
SPF = SR // FPS  # 2000 samples a frame

L = json.load(open(P("show/episodes/ep01/production/act4/shots-locked-v2.json")))
total = L["summary"]["act_frames"]
mix = np.zeros(total * SPF + SR, dtype=np.float64)
sheet = []
for c in L["audio_cues"]:
    x, sr = sf.read(P(c["file"]), dtype="float64", always_2d=False)
    assert sr == SR, (c["id"], sr)
    if x.ndim > 1:
        x = x.mean(axis=1)
    if c["seg_frames"]:
        a, b = c["seg_frames"]
        x = x[a * SPF: b * SPF]
    g = 10 ** ((c["gain_db"] or 0.0) / 20)
    s0 = c["abs"] * SPF
    mix[s0: s0 + len(x)] += x * g
    sheet.append(dict(id=c["id"], shot=c["shot"], kind=c["kind"], abs_frame=c["abs"], start_s=round(c["abs"] / FPS, 3),
                      dur_s=round(len(x) / SR, 3), gain_db=c["gain_db"], file=c["file"], seg_frames=c["seg_frames"]))
mix = mix[: total * SPF]
peak = float(np.max(np.abs(mix)))
peak_db = 20 * np.log10(max(peak, 1e-9))
norm = 1.0
if peak_db > -1.0:  # never clip the reference
    norm = 10 ** ((-1.0 - peak_db) / 20)
    mix *= norm
os.makedirs(P("out/ep01/act4/animatic"), exist_ok=True)
out = P("out/ep01/act4/animatic/act4-dialogue-premix-v2.wav")
sf.write(out, mix.astype(np.float32), SR, subtype="PCM_24")
json.dump(dict(file="out/ep01/act4/animatic/act4-dialogue-premix-v2.wav", sample_rate=SR, frames=total, seconds=total / FPS,
               peak_dbfs=round(20 * np.log10(max(float(np.max(np.abs(mix))), 1e-9)), 2), normalised_by_db=round(20 * np.log10(norm), 2),
               cues=sheet), open(P("out/ep01/act4/animatic/act4-dialogue-premix-v2.cues.json"), "w"), indent=1)
print("wrote", out, f"{total / FPS:.3f} s", len(sheet), "cues", f"peak {peak_db:.2f} dBFS", f"norm {20 * np.log10(norm):.2f} dB")
