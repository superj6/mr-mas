#!/usr/bin/env python3
"""el_mario.py - Ep2 v1: MARIO's six lines (sc 18) on Kokoro, his Ep1 voice: am_liam (Kokoro-82M stock), the
a-liam-earnest preset (audio/voices/cast.json -> cast_a4.RETURNING), through Ep1's fastrec recorder
(audio/ep01/act4/dialogue/tools/fastrec/fastrec.py), RUN, never edited, with no bytecode written under Ep1's paths. The
showrunner kept this voice ("i actually liked dario's kokoro voice more"; cast.md §2), so nothing is sent to ElevenLabs.

  * speed 0.95, Ep1 v3.5's MARIO read ("Point two…", audio/ep01/v35/act1); one whole read a line; fastrec's house
    format, which is the EL takes' format: 48 kHz / 24-bit mono, -16 LUFS, -1.5 dBTP, dry, 0.35 s room-tone handles;
  * "Ekiel" in its own IPA, /ˈɛkil/ ("EH-keel", cast.md §5), as Ep1's Kokoro respellings were;
  * "We agree. I underlined 'inherently.'": a 0.3 s beat before 'inherently.' (the plan: "a small beat before
    'inherently.', the word the joke turns on"), as two whole reads 0.3 s apart (fastrec's {s0.3}): the first try,
    a pause opened inside the one read ({0.3}), cut the 'd' of 'underlined' (heard 'underline');
  * the EL room's match (voices-el §AB3: +1.5 dB at 350 Hz, -1.5 dB at 2.2 kHz, -0.5 dB) is the mix's
    (mix_episode.py KOKORO_IN_EL_EQ), so the takes stay as fastrec prints them.
Writes the Kokoro round (cast.md §6 step 4): audio/ep02/v1/act4/{mario-in.json, lines-v1.json, wav/, rows/, qa/, log/},
and adds each line's row to audio/ep02/v1-el/ep02-v1/act4/lines-A.json as a Kokoro row ('engine': 'kokoro', as el_render's
kokoro_row writes one), so the EL takes list is complete.

  audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_mario.py [--force]
"""
from __future__ import annotations

import json
import os
import subprocess
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402

REPO = ellib.REPO
SEG = "act4"
BP = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
KOK = os.path.join(REPO, "audio/ep02/v1", SEG)
OUT = os.path.join(REPO, "audio/ep02/v1-el/ep02-v1", SEG)
FASTREC = os.path.join(REPO, "audio/ep01/act4/dialogue/tools/fastrec/fastrec.py")
PY = os.path.join(REPO, "audio/.venv-casting/bin/python")
SPEED = 0.95
SAY = {   # what Kokoro reads (fastrec markup); the lines keep the script's text
    "e2-a4-0009": "Come in, [Ekiel](/ˈɛkil/), sit down. I read your thread. Twice. I've made some notes.",
    "e2-a4-0012": "We agree. I underlined{s0.3} inherently.",   # {0.3} (a pause opened inside the read) cut the
                                                                    # 'd': heard 'underline', forced margin -33 (takes-qa.md)
}


def jload(p):
    with open(p) as f:
        return json.load(f)


def main():
    rows, order = [], []
    for b in jload(os.path.join(BP, f"{SEG}.json"))["beats"]:
        for ln in b.get("lines") or []:
            order.append(ln["id"])
            if ln["who"] != "mario":
                continue
            rows.append({"id": ln["id"], "scene": b["id"], "speaker": "MARIO", "speaker_slug": "mario", "text": ln["text"],
                         "spoken_as": SAY.get(ln["id"], ln["text"]),
                         "delivery": ln.get("delivery"), "tag": ln.get("note") or "", "mode": "on-mic", "on_camera": "on",
                         "kind": "dialogue", "side": "none", "shot": b["id"], "status": "fast", "speed": SPEED,
                         "est_s": ln.get("len_s")})
    os.makedirs(KOK, exist_ok=True)
    inp = os.path.join(KOK, "mario-in.json")
    ellib.jdump(rows, inp)
    env = dict(os.environ, HF_HUB_OFFLINE="1", OMP_NUM_THREADS="3", PYTHONDONTWRITEBYTECODE="1")
    cmd = [PY, FASTREC, "record", "--lines", inp, "--out", KOK, "--lines-out", os.path.join(KOK, "lines-v1.json"),
           "--workers", "1", "--threads", "3"]
    if "--force" in sys.argv:
        cmd += ["--force", "all"]
    subprocess.run(cmd, check=True, env=env, cwd=REPO)
    got = {r["id"]: r for r in jload(os.path.join(KOK, "lines-v1.json"))}
    plan = {ln["id"]: (b, ln) for b in jload(os.path.join(BP, f"{SEG}.json"))["beats"] for ln in b.get("lines") or []}
    new = []
    for r in rows:
        k = dict(got[r["id"]])
        b, ln = plan[r["id"]]
        k.update(speaker_slug="mario", tag=ln.get("tag") or "", scene=b["id"], kind="dialogue", engine="kokoro", el=None,
                 status="kokoro (cast)", take="kokoro", special="kokoro", file_device=k.get("file_device"),
                 kokoro_ref={"file": k["file"], "voice": k.get("voice"), "note": "MARIO is cast on Kokoro (cast-el.json "
                             "roles.mario.engine): this row is his Kokoro take, audio/ep02/v1/act4/lines-v1.json"})
        new.append(k)
    p = os.path.join(OUT, "lines-A.json")
    L = [x for x in jload(p) if x["id"] not in {r["id"] for r in new}] + new
    L.sort(key=lambda x: order.index(x["id"]) if x["id"] in order else 10 ** 6)
    ellib.jdump(L, p)
    for k in new:
        q = k.get("qa") or {}
        print(f"{k['id']} mario kokoro {k['duration_s']:.2f} s, lufs {q.get('lufs_i')}, asr {q.get('asr')!r}")
    print(f"{os.path.relpath(p, REPO)}: {len(L)} rows")


if __name__ == "__main__":
    main()
