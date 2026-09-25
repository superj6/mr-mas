"""reel.py - a dialogue-only listening reel of Act Four (a 'radio play' for the director's ear pass).

Draft 3.1. NOT picture timing: lines play in script order with the script's written holds where it prints them
(HOLD 1 BEAT = 0.625 s, HOLD 1 BAR = 2.5 s at 96 BPM), 0.35 s between lines in a scene, and 1.25 s
between scenes. Post pop-ups are not in it (house rule: unvoiced). The V.O. plays at its delivered level (2 LU under
dialogue) and the laptop-speaker "super." at its (6 LU under), so the reel previews the relative levels. Writes act4-dialogue-reel.mp3 and
reel_cues.json ([{id, start_s, end_s}]) next to lines.json.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import soundfile as sf

import a4lib as L

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
GAP, SCENE_GAP = 0.35, 1.25
HOLD_BEFORE = {  # seconds of silence before a line, where draft 3.1 prints a hold or a business beat (compressed picture time)
    "a4-26a-vo2": 1.5,       # the 9:32 post (unvoiced) and the wallet insert
    "a4-27-00": 1.25 + L.BEAT,  # scene change, then HOLD 1 BEAT on the call going on (NELEH turns a page)
    "a4-27-02": 2.0,         # nobody looks up; the has-left toasts, Gerg's post, keycaps; RIMA's card
    "a4-27-19": 1.5,         # the hourglass-flip insert
    "a4-29-vo2": 2.5,        # MAS'S VERSION (1 bar, piano cut mid-phrase), the true [ECU], eight hearts, the Orb onto the lanyard
    "a4-29-03": L.BEAT + 0.3,  # [P] THE ORB, HOLD 1 BEAT
    "a4-29-04": 2.5,         # HOLD 1 BEAT, THE LETTER (counter, card, list, chime), the check: compressed to a bar
    "a4-29-vo3": 4 * L.BEAT,  # the quiet beat, 4 beats (keycaps)
    "a4-29-07": L.BEAT,      # at least 1 beat after the V.O. ends
    "a4-29-08": 0.2,         # at once on 'Everyone is welcome.'
    "a4-30-06": L.BEAT,      # everyone looks around
    "a4-30-08": L.BEAT,      # [P] MADA, right. HOLD 1 BEAT
    "a4-30-09": L.BEAT,      # [P] MAS, left. HOLD 1 BEAT (one beat late)
    "a4-30-12": 2.5 + 1.0 + 2 * L.BEAT,  # HOLD 1 BAR, Gerg's post, the hourglass, the lobby, the Bonk, the silent [CU] 2 beats
}


def main():
    lines = [e for e in json.load(open(os.path.join(ROOT, "lines.json"))) if e["voiced_in_cut"]]
    parts, cues, t, prev_scene = [], [], 0.0, None
    for e in lines:
        gap = 0.0 if prev_scene is None else (SCENE_GAP if e["scene"] != prev_scene else GAP)
        gap = max(gap, HOLD_BEFORE.get(e["id"], 0.0))
        if gap:
            parts.append(np.zeros(int(gap * L.SR), np.float32))
            t += gap
        y, sr = sf.read(os.path.join(REPO, e["file"]), dtype="float32")
        parts.append(y)
        cues.append({"id": e["id"], "scene": e["scene"], "speaker": e["speaker"], "kind": e.get("kind"),
                     "start_s": round(t, 3), "end_s": round(t + len(y) / sr, 3)})
        t += len(y) / sr
        prev_scene = e["scene"]
    reel = np.concatenate(parts)
    L.V.write_wav_mp3(reel, None, os.path.join(ROOT, "act4-dialogue-reel.mp3"))
    json.dump({"note": "listening order only, not picture timing", "duration_s": round(t, 2), "cues": cues},
              open(os.path.join(ROOT, "reel_cues.json"), "w"), indent=1)
    print(f"reel {t:.1f} s, {len(cues)} lines")


if __name__ == "__main__":
    main()
