"""scratch_vo.py - EDITOR's scratch reads of the six draft-3 MAS (V.O.) lines, for the Act Four animatic only.

Draft 3 (the POV pass, script.md 2026-09-25 12:53) added six V.O. lines after the dialogue pass recorded draft 2.
The dialogue stage owns the real takes (Writer's notes, "Re-record list (Act Four)"). Until those land, the
animatic needs something at the right length in the right voice, so this renders scratch reads with the SAME
cast voice and chain as the dialogue stage (cast_a4.RETURNING['mas-manalt'], CASTING.md pick, dry), a touch
slower per the V.O. style guide (pov-and-framing 5.1: 110-125 wpm against his 125-135 in scenes).

Nothing here writes into audio/ep01/act4/dialogue/: the dialogue tools are imported read-only.

Run:  HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/scratch_vo.py
Writes: out/ep01/act4/animatic/scratch-vo/<id>.wav (48 kHz/24-bit, -16 LUFS, dry) + scratch_vo.json
"""
from __future__ import annotations

import json
import os
import shutil
import sys

DLG = "/home/jgon/project/art/mrmas/audio/ep01/act4/dialogue/tools"
sys.path.insert(0, DLG)

import a4lib as L  # noqa: E402
import cast_a4 as CA  # noqa: E402
import record as R  # noqa: E402  (score_take / record_takes only; main() is not run)

REPO = "/home/jgon/project/art/mrmas"
OUT = os.path.join(REPO, "out/ep01/act4/animatic/scratch-vo")

VO = [
    ("a4-26-vo1", "26", "the meeting ended early.", "the meeting{0.10} ended early."),
    ("a4-26a-vo1", "26A", "i'm not a sentimental person.", "i'm not a sentimental person."),
    ("a4-26a-vo2", "26A", "the weekend was mostly logistics.", "the weekend was mostly logistics."),
    ("a4-29-vo1", "29", "i kept quiet.", "i kept quiet."),
    ("a4-29-vo2", "29", "the hearts were sincere.", "the hearts{0.12} were sincere."),
    ("a4-29-vo3", "29", "gerg never waits to be asked.", "[gerg](/ɡˈɜɹɡ/) never waits to be asked."),
]
TAKES = [{"seed": 1}, {"seed": 2, "speed": 0.95}, {"seed": 3, "speed": 0.92}, {"seed": 4, "carrier": "Right. Okay."}]
PICK = {"final": "fall", "gentle": True, "lane": True, "range_max": 10.0}
# per-line overrides. a4-26a-vo1 must fit 26A.01's second bar and clear the 9:32 post by a bar (timing.md 3.2):
# voiced span <= 2.39 s (still inside the 110-125 wpm V.O. band for five words).
OVERRIDE = {
    "a4-26a-vo1": {"takes": [{"seed": 5}, {"seed": 6, "speed": 1.04}, {"seed": 7, "speed": 1.08}, {"seed": 8, "speed": 1.04, "carrier": "Right. Okay."},
                             {"seed": 1, "speed": 1.06}, {"seed": 2, "speed": 1.1}],
                   "pick": {**PICK, "dur": (2.0, 2.39)}},
}


def main():
    only = set(sys.argv[1:])
    os.makedirs(OUT, exist_ok=True)
    jp = os.path.join(OUT, "scratch_vo.json")
    old = {r["id"]: r for r in json.load(open(jp))} if (only and os.path.exists(jp)) else {}
    v = dict(CA.RETURNING["mas-manalt"])
    v["wpm"] = (110, 125)  # the V.O. band (pov-and-framing 5.1)
    rows = []
    for lid, sc, text, say in VO:
        if only and lid not in only:
            rows.append(old[lid])
            continue
        ln = {"id": lid, "say": say, "text": text}
        keep = os.path.join(OUT, "takes", lid)
        ov = OVERRIDE.get(lid, {})
        best, results = R.record_takes(ln, v, ov.get("takes", TAKES), ov.get("pick", PICK), {}, keep)
        m, y, toks = best[0], best[1], best[2]
        wav = os.path.join(OUT, lid + ".wav")
        L.write(y, wav, None)
        rows.append({
            "id": lid, "scene": sc, "speaker": "MAS MANALT", "mode": "vo", "text": text, "tag": "[INVENTED · VO]",
            "file": os.path.relpath(wav, REPO), "duration_s": m["duration_s"], "frames_24": m["frames_24"],
            "voiced_span_s": m["voiced_span_s"], "take": m["take"], "takes_tried": len(results),
            "words": L.word_track(toks),
            "qa": {k: m.get(k) for k in ("lufs_i", "true_peak_dbtp", "median_f0_hz", "f0_range_st", "final_move_st", "asr", "cer")},
            "status": "SCRATCH (editor) · re-record by the dialogue stage per the draft-3 re-record list",
            "voice": "am_michael (Kokoro-82M stock) · a-michael-close · dry · V.O. pace 110-125 wpm",
        })
        shutil.rmtree(keep, ignore_errors=True)
    json.dump(rows, open(jp, "w"), indent=1, ensure_ascii=False)
    for r in rows:
        print(r["id"], r["duration_s"], r["frames_24"], r["qa"]["asr"], r["qa"]["final_move_st"])


if __name__ == "__main__":
    main()
