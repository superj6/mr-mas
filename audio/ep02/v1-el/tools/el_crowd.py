#!/usr/bin/env python3
"""el_crowd.py - Ep2 v1: THE CROWD's chant (e2-a3-0010, "FEEL THE AGI! FEEL THE AGI!", F2.2, 15.06), layered from ten
library reads (cast.md §3.10; cast-el.json roles.crowd.layered). No characters are sent: each of the ten reads is the
casting pass's audition take, cached under seed_of('e2-a3-0010', voice id) at 0.40 / 0.20 / 1.0 and the text as sent
("Feel the A.G.I.! Feel the A.G.I.!", say_lines), re-dressed here through el_render.render_take (48 kHz / 24-bit, -16 LUFS,
dry) into audio/ep02/v1-el/ep02-v1/act3/crowd/.

THE LAYERING (the brief: "building from one voice to all ... each on its own seed and offset (40-180 ms), ducked under
Alyi's lead; warm and giddy, never a hymn or a rally"):
  * each read is cut into its two phrases at the middle of the pause between them (its own word timings), 15 ms in and
    60 ms out, so the room chants on one shared pulse: phrase 1 at the head, phrase 2 one median phrase-gap later;
  * every voice enters late by its own offset, 40-180 ms (deterministic: from its seed), so the attack smears like a room;
  * it builds: phrase 1 is four voices (two women, two men: Lori leads at 0 dB, then -3, -5, -6 dB), phrase 2 all ten
    (0 to -2 dB). Nothing else is done to it: no pitch, no doubling, no drive, no reverb (the room is the mix's);
  * the composite is levelled to -19 LUFS, 3 LU under the house dialogue level, so it sits under Alyi's lead and under
    his "You're not chanting." when the mix lays them together (a choice, [J]; the mix can move it).
Writes act3/wav/e2-a3-0010__crowd-layered.wav and adds its row (special 'crowd') to act3/lines-A.json.

  audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_crowd.py
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import types

sys.dont_write_bytecode = True
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402
import el_render as R  # noqa: E402

REPO = ellib.REPO
LID, SEG = "e2-a3-0010", "act3"
BP = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
OUT = os.path.join(REPO, "audio/ep02/v1-el/ep02-v1", SEG)
LAYERS = os.path.join(OUT, "crowd")
PHRASE1 = [("A", 0.0), ("F", -3.0), ("C", -5.0), ("H", -6.0)]   # Lori leads; Chris, Kristen, Joe Inglewood join
TARGET = -19.0
FI, FO = 0.015, 0.06


def jload(p):
    with open(p) as f:
        return json.load(f)


def offset_of(seed, k):
    """a deterministic offset in 40-180 ms (the lead of phrase 1 enters on the pulse)"""
    h = int(hashlib.sha1(f"{seed}|{k}".encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    return 0.04 + 0.14 * h


def fades(x, sr=E.SR):
    a, b = int(FI * sr), int(FO * sr)
    x = x.copy()
    x[:a] *= np.linspace(0, 1, a)
    x[-b:] *= np.linspace(1, 0, b)
    return x


def main():
    cast = R.Cast()
    role = cast.roles["crowd"]
    cands = {c["cand"]: c for c in role["candidates"]}
    row = next(r for r in R.read_rows(os.path.join(BP, f"{SEG}.json")) if r["id"] == LID)
    for sub in ("wav", "wav-device", "log"):
        os.makedirs(os.path.join(LAYERS, sub), exist_ok=True)
    man = R.load_manifest(LAYERS)
    args = types.SimpleNamespace(dry_run=False, redress=False, budget_left=0, reuse=[], target_lufs=-16.0, vo_lufs=None)
    layers = {}
    sent = 0
    for k in role["layered"]:
        c = dict(cands[k])
        rec, n = R.render_take(row, "crowd", c, role, cast, LAYERS, man, args, print)
        sent += n
        y, _ = sf.read(os.path.join(REPO, rec["file"]), dtype="float32")
        W = rec["words"]
        if len(W) != 6:
            raise SystemExit(f"{rec['take']}: {len(W)} words aligned, want 6")
        cut = (W[2]["t1"] + W[3]["t0"]) / 2
        p1 = y[int((W[0]["t0"] - 0.06) * E.SR): int(cut * E.SR)]
        p2 = y[int((W[3]["t0"] - 0.06) * E.SR): int(min(len(y) / E.SR, W[5]["t1"] + 0.25) * E.SR)]
        layers[k] = dict(rec=rec, c=c, p1=fades(p1), p2=fades(p2), gap=W[3]["t0"] - W[0]["t0"], words=W)
    R.save_manifest(LAYERS, man)
    if sent:
        raise SystemExit(f"the crowd sent {sent} characters: its reads should all be cached")
    gap = float(np.median([L["gap"] for L in layers.values()]))
    t1 = 0.35 + 0.06                                     # handle, then the pre-roll each phrase carries
    t2 = t1 + gap
    n = int((t2 + max(len(L["p2"]) for L in layers.values()) / E.SR + 0.5 + 0.35) * E.SR)
    mix = np.zeros(n, np.float64)
    plan = []
    p1 = dict(PHRASE1)
    for k, L in layers.items():
        seed = L["rec"]["seed"]
        for ph, t0, seg in (("1", t1, L["p1"]), ("2", t2, L["p2"])):
            if ph == "1" and k not in p1:
                continue
            g = p1[k] if ph == "1" else -2.0 * (int(hashlib.sha1(f"{seed}|g".encode()).hexdigest()[:4], 16) / 0xFFFF)
            off = 0.0 if (ph == "1" and k == PHRASE1[0][0]) else offset_of(seed, ph)
            i0 = int((t0 - 0.06 + off) * E.SR)
            mix[i0:i0 + len(seg)] += seg * 10 ** (g / 20)
            plan.append(dict(cand=k, voice=L["c"]["voice_name"], phrase=ph, offset_ms=round(off * 1000), gain_db=round(g, 1)))
    mix = mix.astype(np.float32)
    mix = E.normalise(mix, TARGET)
    mix = mix + E.tone(len(mix), 20260910)
    take = f"{LID}__crowd-layered"
    outp = os.path.join(OUT, "wav", take + ".wav")
    E.write24(outp, mix)
    m = E.measure(mix, row["text"])
    asr_txt, _ = E.asr(mix)
    lead = layers[PHRASE1[0][0]]["words"]
    lead2 = layers[PHRASE1[0][0]]["words"]
    words = [dict(w=lead[i]["w"], t0=round(t1 + lead[i]["t0"] - lead[0]["t0"], 3), t1=round(t1 + lead[i]["t1"] - lead[0]["t0"], 3))
             for i in range(3)]
    words += [dict(w=lead2[i]["w"], t0=round(t2 + lead2[i]["t0"] - lead2[3]["t0"], 3), t1=round(t2 + lead2[i]["t1"] - lead2[3]["t0"], 3))
              for i in range(3, 6)]
    names = set(cast.d.get("names", []))
    new = {
        "id": LID, "kind": "dialogue", "scene": row.get("beat"), "speaker": "THE CROWD", "speaker_slug": "crowd",
        "text": row["text"], "spoken_as": layers["A"]["rec"]["sent"], "tag": row["tag"], "delivery": row.get("delivery"),
        "on_camera": "on", "mode": "on-mic", "device": None, "file": os.path.relpath(outp, REPO), "file_device": None,
        "mp3": None, "duration_s": round(len(mix) / E.SR, 3), "frames_24": int(round(len(mix) / E.SR * 24)),
        "voiced_span_s": m["span_s"],
        "pace": {"audible_in_s": m["audible_in_s"], "audible_out_s": m["audible_out_s"],
                 "measured": {k: m[k] for k in ("span_s", "wpm", "syllables", "articulation_sps", "pauses_s")},
                 "longest_internal_gap_s": m["longest_internal_gap_s"], "words": m["words"], "wpm": m["wpm"],
                 "speed": 1.0, "tsm": 1.0},
        "words": words,
        "qa": dict(asr=asr_txt, cer=E.cer(row["text"], asr_txt), word_recall_nonames=E.word_recall(row["text"], asr_txt, names),
                   lufs_i=round(E.lufs(mix), 2), target_lufs=TARGET, true_peak_dbtp=round(E.true_peak_db(mix), 2),
                   clipped_samples=int((np.abs(mix) >= 0.999).sum()), digital_black_runs=E.zero_runs(mix),
                   median_f0_hz=m["median_f0_hz"], f0_range_st=m["f0_range_st"], speech_head_s=m["speech_head_s"],
                   speech_tail_s=m["speech_tail_s"], raw_tail_cut=False,
                   layers={k: dict(asr=L["rec"]["qa"]["asr"], recall=L["rec"]["qa"]["word_recall_nonames"],
                                   tail_cut=L["rec"]["qa"]["raw_tail_cut"], f0=L["rec"]["qa"]["median_f0_hz"])
                           for k, L in layers.items()}),
        "voice": "ten ElevenLabs library voices, layered (cast.md §3.10): " + " · ".join(L["c"]["voice_name"].split(" - ")[0] for L in layers.values()),
        "voiceId": None, "model": "ElevenLabs eleven_multilingual_v2 (REST API, text-to-speech with timestamps)",
        "el": {"cand": "layered", "role": "crowd", "layers": [dict(cand=k, voice_id=L["c"]["voice_id"], voice_name=L["c"]["voice_name"],
                                                                     seed=L["rec"]["seed"], request_key=L["rec"]["key"],
                                                                     file=L["rec"]["file"]) for k, L in layers.items()],
               "settings": layers["A"]["rec"]["settings"], "chars_sent": 0, "layout": plan,
               "phrase_gap_s": round(gap, 3)},
        "status": "el", "take": "el-layered", "special": "crowd",
        "processing": ["ten cached reads, each dressed as an EL take (-16 LUFS, dry)",
                       "each cut into its two phrases at the middle of its own pause, 15 ms in / 60 ms out",
                       "phrase 1: four voices (0, -3, -5, -6 dB); phrase 2: all ten (0 to -2 dB); each voice late by its own "
                       "40-180 ms (the lead of phrase 1 on the pulse); phrase 2 one median phrase-gap after phrase 1",
                       f"summed, {TARGET:g} LUFS integrated, true peak <= -1.5 dBTP; room tone -62 dBFS; DRY"],
        "kokoro_ref": {},
    }
    p = os.path.join(OUT, "lines-A.json")
    order = [ln["id"] for b in jload(os.path.join(BP, f"{SEG}.json"))["beats"] for ln in b.get("lines") or []]
    L_ = [x for x in jload(p) if x["id"] != LID] + [new]
    L_.sort(key=lambda x: order.index(x["id"]) if x["id"] in order else 10 ** 6)
    ellib.jdump(L_, p)
    print(f"{LID} crowd: {len(layers)} layers, {new['duration_s']:.2f} s, span {m['span_s']:.2f} s, lufs {new['qa']['lufs_i']}, "
          f"asr {asr_txt!r}; {os.path.relpath(p, REPO)}: {len(L_)} rows")


if __name__ == "__main__":
    main()
