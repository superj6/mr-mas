"""lock_v5.py - the timing lock v5 for Ep1 Act Four (script draft 5.1, the conversation pass): INF-LOCK5.

The v5 pixel animatic is cut to the APPROVED stick timeline, shot for shot and line for line, so it plays against the
stick reel's own mix (audio/reel/ep01-act4-v5/mix.wav) without a re-mix. This tool does not re-time anything: it reads
the stick timeline's frames, lines and in-world text as they are, adds what the pixel layouts need on the same clock
(mouth tracks, word frames, story marks, who shows a mouth), checks it, and writes it out.

Inputs (read-only):
  show/reel/ep01-act4-v5.json                        the approved stick timeline (84 beats; audio/reel/ep01-act4-v5/
                                                     build_timeline.py wrote it): beat lengths, lines (t, dur, in,
                                                     words), in-world text (onscreen), sound spots, names
  audio/ep01/act4/dialogue/lines-v5.json             the v5 takes: mouth tracks (visemes on the file's clock), file
                                                     lengths, speaker, mode, on_camera
  show/episodes/ep01/production/act4/shots-locked-v4.json   the v4 lock: v4 marks for the reused layouts, whips, badges
  audio/reel/ep01-act4-v5/mix.wav                    the stick mix (length check only: 72 f title card + the act)
Outputs (generated; re-run after any change to the inputs; never hand-edit):
  show/episodes/ep01/production/act4/shots-locked-v5.json   the lock: shots, lines, mouths, texts, rails, marks, checks
  studio/src/episodes/ep01/act4/animatic/data-v5.ts          the same for the v5 layouts (shots5.ts) and the host (frame5.ts)

The clock (timing-v5.md §1):
  * Act frame 0 = the stick reel's first beat = episode 12:31:00 (EP_IN). The stick reel and its mix.wav carry a 3 s
    title card first (72 frames), so mix.wav's frame 72 is act frame 0 (MIX.offsetFrames).
  * Beats start where bed.py and the reel put them: the cumulative beat lengths, rounded to frames.
  * A shot is a beat. A continuation beat that follows its own shot directly (S7.06-cont) merges into it; one that
    returns after a cutaway (S7.07-cont, S5.09-back) is its own shot on the same setup.
  * A line starts on the frame in which its first sound is heard (floor of the speech onset: beat start + t) and ends
    after the frame of its last sound (onset + dur). Mouth changes and word starts use the same rule. Every line also
    appears, with negative or late frames, in each later shot it runs into (`carry`), so a layout can move a mouth
    across a cut.
  * Marks (the click, the stamp, the key turn...) are resolved here from the stick's own sound spots and text times,
    the takes' words, or v4's marks re-scaled onto the v5 length, so the picture lands on the sounds in the mix.
Run:  python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py   (prints the checks; exits 1 on a failed check)
Then: audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/lock_v5_mixcheck.py
      MEASURES every take's placement in mix.wav against this lock's frames (cross-correlation; exits 1 if any line's
      first sound falls in a different frame). The layouts that read this lock: animatic/shots5.ts (INF-SHOTS5).
Record: show/episodes/ep01/production/act4/timing-v5.md.
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

import json
import math
import os
import re
import statistics
import sys
import wave
from collections import OrderedDict

P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
PROD = P("show/episodes/ep01/production/act4")
REEL_JSON = P("show/reel/ep01-act4-v5.json")
TAKES_JSON = P("audio/ep01/act4/dialogue/lines-v5.json")
V4_LOCK = os.path.join(PROD, "shots-locked-v4.json")
MIX_WAV = P("audio/reel/ep01-act4-v5/mix.wav")
OUT_JSON = os.path.join(PROD, "shots-locked-v5.json")
OUT_TS = P("studio/src/episodes/ep01/act4/animatic/data-v5.ts")
FPS = 24
EP_IN_S = 12 * 60 + 31
EP_IN = EP_IN_S * FPS
TITLE_FRAMES = 72  # the stick reel's 3 s title card (bed.py TITLE_FRAMES): mix.wav frame 72 = act frame 0
EPS = 1e-6

REEL = json.load(open(REEL_JSON))
TAKES = OrderedDict((x["id"], x) for x in json.load(open(TAKES_JSON)))
V4 = json.load(open(V4_LOCK))
V4SH = {s["id"]: s for s in V4["shots"]}

WHO = {"mas": "MAS", "neleh": "NELEH", "alyi": "ALYI", "mada": "MADA", "gerg": "GERG", "rima": "RIMA", "employee": "EMPLOYEE",
       "mario": "MARIO", "adelina": "ADELINA", "ttemme": "TTEMME", "tasya": "TASYA", "terb": "TERB"}
SIDE = {"HIS SIDE": "MAS", "THE BOARD'S SIDE": "BOARD"}
TAKE_SLUG = {"mas-manalt": "mas", "gerg-mockbran": "gerg", "rima-tamuri": "rima", "tiled-employee": "employee"}


def fr(sec: float) -> int:
    """the frame in which a moment (act seconds) falls"""
    return int(math.floor(sec * FPS + EPS))


def tc(f: int) -> str:
    e = EP_IN + f
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def length(frames: int) -> str:
    s = frames / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9']", "", w.lower())


# ====================================================================================== THE PER-SHOT PLAN
# verdict (art-needs-v5 §3: R reuse, C change, N new) · v4 = the v4 layout it re-uses or re-dresses · marks = the story
# marks, as anchors (offsets are FRAMES):
#   ('f', n)                    n frames into the shot
#   ('snd', name, n, off)       the n-th stick sound spot of that name in the shot (1-based)
#   ('txt', substr, at|until, off)   an in-world text item's start or end
#   ('on'|'end', line, off)     a line's first / last sound
#   ('w'|'we', line, word, off) a word's start / end ('word#2' = its 2nd occurrence)
#   ('speak', who, at|end, off) a silent speaking highlight (the stick's `speak`)
#   ('beat', beat_id, off)      a merged beat's first frame      ('mark', name, off)  another mark
#   ('len', off)                the shot's end + off
# Marks not given here, on a shot that re-uses a v4 layout, are v4's own marks scaled to the v5 length (logged).
# face = who shows a mouth in this framing (art-needs §1.2: the framing decides, not the take's lip_sync flag):
#   'lip' a drawn mouth track (busts, tiles, mediums, reflections) · 'room' room scale (open / rest) · none = no mouth
PLAN: dict[str, dict] = {
    # ---------------------------------------------------------------- S1 · NOON, LAS VEGAS
    "S1.01": dict(verdict="R", v4="S1.01"),
    "S1.02": dict(verdict="C", v4="S1.02", marks=dict(nudge=("f", 10), out1=("f", 24), out2=("f", 32), glow=("f", 44), print=("f", 52))),
    "S1.03": dict(verdict="C", v4="S1.03", marks=dict(
        stamp=("snd", "rubber_stamp_C", 1, 0), nine=("on", "a5-25-01", 0), three=("w", "a5-25-01", "stepped", 0),
        plates=("w", "a5-25-02", "mas", 0), four=("w", "a5-25-02", "four", 0), us=("w", "a5-25-02", "us", 0),
        box=("txt", "NOPEAI · THE NONPROFIT", "at", 0), arrow=("w", "a5-25-03", "controls", 0), tilt=("mark", "arrow", 2),
        company=("we", "a5-25-03", "company", 0))),
    "S1.04": dict(verdict="C", v4="S1.04", marks=dict(
        jangle=("on", "a5-25-04", 0), votes=("snd", "rubber_stamp_C", 1, 0), tipCeo=("w", "a5-25-05", "ceo", 0),
        equity=("snd", "rubber_stamp_C", 2, 0), moth=("end", "a5-25-06", 4))),
    "S1.05": dict(verdict="C", v4="S1.05", marks=dict(tear=("snd", "paper_whip", 1, 0), curl=("mark", "tear", -15), setdown=("f", 0), join=("f", 12))),
    "S1.06": dict(verdict="R", v4="S1.06", marks=dict(click=("snd", "dialog_ok_click", 1, 0))),
    "S1.07": dict(verdict="C", v4="S1.07", marks=dict(
        card=("txt", "NELEH / READ THE CHARTER", "at", 0), cardEnd=("txt", "NELEH / READ THE CHARTER", "until", 0),
        speak=("speak", "alyi", "at", 0), speakEnd=("speak", "alyi", "end", 0), dialog=("txt", "UI: MAS MANALT", "at", 0))),
    "S1.08": dict(verdict="R", v4="S1.08"),
    "S1.09": dict(verdict="R", v4="S1.09", marks=dict(step1=("f", 19), step2=("f", 38), click=("snd", "dialog_ok_click", 1, 0))),
    "S1.10": dict(verdict="R", v4="S1.10"),
    "S1.11": dict(verdict="R", v4="S1.11", marks=dict(buzz=("snd", "BUZZ", 1, 0))),
    "S1.12": dict(verdict="R", v4="S1.12", marks=dict(fall=("len", -24)), face={"MAS": None}),
    # ---------------------------------------------------------------- S2 · THAT NIGHT
    "S2.01": dict(verdict="R", v4="S2.01", marks=dict(brush=("f", 62))),
    "S2.02": dict(verdict="R", v4="S2.02"),
    "S2.03": dict(verdict="R", v4="S2.03"),
    "S2.04": dict(verdict="R", v4="S2.04"),
    "S2.05": dict(verdict="R", v4="S2.05", whip="out", badge="flip-on-whip"),
    # ---------------------------------------------------------------- S3 · FRIDAY, THE BOARD'S SIDE
    "S3.00a": dict(verdict="N", v4=None, whip="in", marks=dict(connect=("snd", "bell_ding_F6", 1, 0), clock=("txt", "12:00", "at", 0),
                                                         lean=("on", "a5-27-03", -6)),
                   face={"ALYI": "lip", "NELEH": "lip"}),  # NELEH: her own tile on the call, top-left (a4p5-lock)
    "S3.01": dict(verdict="C", v4="S3.01", marks=dict(removed=("f", 1), superOn=("on", "a5-27-05", 0), superEnd=("end", "a5-27-05", 0),
                                                      grey=("end", "a5-27-05", 12)), face={"MAS": None}),
    "S3.02": dict(verdict="R", v4="S3.02", marks=dict(tick1=("snd", "key_tap_space", 1, 0), run0=("txt", "2. BLOG POST", "at", 0),
                                                      run1=("txt", "4. ___", "at", 6)), face={"NELEH": None}),
    "S3.03": dict(verdict="C", v4="S3.03", marks=dict(post=("snd", "post_click", 1, 0), point=("mark", "post", -24)), face={"NELEH": None}),
    "S3.04": dict(verdict="N", v4=None, marks=dict(join=("snd", "bell_ding_F6", 1, 0), smooth=("on", "a5-27-10", -18)),
                  face={"RIMA": "lip", "ALYI": "lip", "NELEH": "lip"}),  # NELEH: her own tile on the call (a4p5-lock)
    "S3.04b": dict(verdict="N", v4=None, marks=dict(tick=("snd", "key_tap_space", 1, 0)), face={"NELEH": "lip", "RIMA": None}),
    "S3.06": dict(verdict="C", v4="S3.06", marks=dict(stand=("f", 0), hand=("f", 0), handDown=("end", "a5-27-18", 5)),
                  face={"EMPLOYEE": "room"}),  # her webcam tile faces us, risen and ringed: a tile-scale mouth (a4p5-lipsync)
    "S3.07": dict(verdict="C", v4="S3.07", marks=dict(look=("we", "a5-27-19", "way", 2), lookBack=("w", "a5-27-19", "i", -3),
                                                      step=("end", "a5-27-19", 10)), face={"ALYI": "lip"}),
    "S3.05": dict(verdict="C", v4="S3.05", marks=dict(keys=("snd", "keycap_popcorn", 1, 0), post=("txt", "POST: GERG", "at", 0)),
                  face={"ALYI": "lip", "NELEH": "lip"}),
    # ---------------------------------------------------------------- S4 · THE WEEKEND, THE BOARDROOM
    "S4.01": dict(verdict="C", v4="S4.01", marks=dict(bury=("f", 28), blue=("f", 103), post=("txt", "POST: MAS", "at", 0))),
    "S4.02": dict(verdict="C", v4="S4.02", marks=dict(buzz=("snd", "BUZZ", 1, 0), buzz2=("snd", "BUZZ", 2, 0)), face={"NELEH": "room"}),
    "S4.04": dict(verdict="C", v4="S4.04", marks=dict(buzz=("snd", "BUZZ", 1, 0)), face={"ALYI": "lip", "NELEH": None}),
    "S4.06": dict(verdict="R", v4="S4.06", marks=dict(flicker=("len", -7), clack=("snd", "landing_thunk", 1, 0)), face={"NELEH": "lip", "ALYI": "lip"}),
    "S4.07": dict(verdict="C", v4="S4.07", marks=dict(pull=("end", "a5-27-29", 2), tone1=("snd", "DTMF", 1, 0), tone2=("snd", "DTMF", 2, 0),
                                                      tone3=("snd", "DTMF", 3, 0), tone4=("snd", "DTMF", 4, 0)), face={"NELEH": "lip"}),
    "S4.08": dict(verdict="C", v4="S4.08", marks=dict(
        ring=("snd", "RING", 1, 0), ringB=("snd", "RING", 2, 0), raise_=("w", "a5-27-31", "hypothetically", 0),
        adelina=("on", "a5-27-32", -14), click=("snd", "dialog_ok_click", 1, 0), tone=("snd", "DIALTONE", 1, 0),
        ring2=("snd", "RING", 3, 0), grab=("on", "a5-27-33", -12), handover=("end", "a5-27-33", 2)),
        face={"NELEH": "room", "MARIO": "room", "ADELINA": "room"}),
    "S4.09": dict(verdict="C", v4="S4.09", marks=dict(turn=("w", "a5-27-37", "here", 0), walk=("mark", "turn", 6), post=("txt", "POST: MAS", "at", 0)),
                  face={"ALYI": "lip", "NELEH": None}),
    "S4.10": dict(verdict="C", v4="S4.10", marks=dict(swing=("f", 0))),
    "S4.10b": dict(verdict="N", v4=None, marks=dict(slide=("end", "a5-27-41", 2), up=("mark", "slide", 20), seal=("mark", "up", 8),
                                                    open=("mark", "up", 14), close=("on", "a5-27-42", -20)), face={"NELEH": "lip", "TTEMME": "lip"}),
    "S4.11": dict(verdict="C", v4="S4.11", marks=dict(flip=("f", 2)), face={"TTEMME": "lip"}),
    "S4.12": dict(verdict="R", v4="S4.12", marks=dict(door=("snd", "landing_thunk", 1, 0))),
    "S4.13": dict(verdict="C", v4="S4.13", marks=dict(jangle=("snd", "JANGLE", 1, 0), read=("on", "a5-27-45", -12)), face={"TASYA": "lip"}),
    "S4.13c": dict(verdict="N", v4=None, marks=dict(nod=("w", "a5-27-45", "ttemme", 0)), face={"TASYA": "room"}),
    "S4.13d": dict(verdict="N", v4=None, marks=dict(names=("w", "a5-27-45", "mas", 0), look=("mark", "names", 12)), face={"TASYA": None}),
    "S4.13e": dict(verdict="R", v4="S4.13", marks=dict(sign=("txt", "MAS · GERG →", "at", 0), jangle=("snd", "JANGLE", 1, 0))),
    "S4.14": dict(verdict="R", v4="S4.14", marks=dict(q=("txt", "4.  ?", "at", 0)), face={"NELEH": None}),
    "S4.15": dict(verdict="R", v4="S4.15"),
    # ---------------------------------------------------------------- CARD
    "S5.01": dict(verdict="R", v4="S5.01", badge="none"),
    # ---------------------------------------------------------------- S5 · HIS SIDE, 2 AM
    "S5.02": dict(verdict="R", v4="S5.02"),
    "S5.03": dict(verdict="C", v4="S5.03", marks=dict(tap1=("snd", "key_tap_soft_01", 1, 0), tap2=("snd", "key_tap_soft_02", 1, 0),
                                                      tap3=("snd", "key_tap_soft_03", 1, 0), tap4=("snd", "key_tap_soft_04", 1, 0),
                                                      tap5=("snd", "key_tap_soft_05", 1, 0), flood=("txt", "×2", "at", 0))),
    "S5.04": dict(verdict="C", v4="S5.04", marks=dict(lanyard=("f", 11), turn=("on", "a5-29-01", -6)), face={"MAS": "lip"}),
    "S5.05": dict(verdict="R", v4="S5.05", face={"MAS": "lip"}),
    "S5.09": dict(verdict="C", v4="S5.09", marks=dict(ring=("snd", "RING", 1, 0), click=("snd", "dialog_ok_click", 1, 0), glance=("len", 99)),
                  face={"GERG": "lip", "MAS": None}),
    "S5.06": dict(verdict="C", v4="S5.06", marks=dict(
        q1=("txt", "“…unable", "at", 0), q2=("txt", "“…unless", "at", 0), q3=("txt", "“…positions", "at", 0),
        c650=("txt", "SIGNED 650", "at", 0), c700=("txt", "SIGNED 700", "at", 0), clunk=("snd", "odometer_ratchet", 1, 0),
        scroll=("on", "a5-29-11", 0), alyi=("txt", "ALYI", "at", 0), chime=("snd", "bell_ding_F6", 1, 0)),
        face={"GERG": "lip", "MAS": None}),
    "S5.07b": dict(verdict="N", v4="S5.10", face={"MAS": "lip", "GERG": None}),
    "S5.08": dict(verdict="R", v4="S5.08", marks=dict(slide=("snd", "SLOT", 1, 0), flat=("f", 8), stamp=("snd", "rubber_stamp_C", 1, 0)), face={"GERG": None}),
    "S5.09-back": dict(verdict="R", v4="S5.09", marks=dict(glance=("we", "a5-29-17", "case", 4)), face={"GERG": "lip", "MAS": None}),
    "S5.09b": dict(verdict="C", v4="S5.09b", marks=dict(look=("f", 0), type=("end", "a5-29-19", 8)), face={"GERG": "lip", "MAS": None}),
    "S5.11": dict(verdict="C", v4="S5.11", marks=dict(
        door1=("snd", "landing_thunk", 1, 0), door2=("snd", "landing_thunk", 2, 0), door3=("snd", "landing_thunk", 3, 0),
        door4=("mark", "door3", 7), key=("snd", "key_tap_space", 1, 0), crack=("mark", "key", 20), open=("w", "a5-29-22", "desk", 0)),
        face={"MAS": "lip", "TASYA": None}),
    "S5.12": dict(verdict="C", v4="S5.12", marks=dict(rack=("end", "a5-29-23", 1)), face={"MAS": "lip"}),
    # ---------------------------------------------------------------- S6 · THE AVALANCHE
    "S6.01": dict(verdict="R", v4="S6.01"),
    "S6.02": dict(verdict="R", v4="S6.02"),
    "S6.03": dict(verdict="R", v4="S6.03"),
    "S6.04": dict(verdict="R", v4="S6.04", face={"NELEH": "lip"}),
    "S6.06": dict(verdict="R", v4="S6.06", marks=dict(qv=("f", 0), wedge=("f", 30), label=("snd", "freeze_hit_F", 1, 0))),
    # ---------------------------------------------------------------- S7 · THE RETURN
    "S7.01": dict(verdict="C", v4="S7.01", marks=dict(
        post=("txt", "POST: ALYI", "at", 0), postEnd=("txt", "POST: ALYI", "until", 0),
        heart1=("snd", "key_tap_soft_02", 1, 0), heart2=("snd", "key_tap_soft_04", 1, 0), heart3=("snd", "key_tap_soft_06", 1, 0),
        up=("mark", "heart3", 4), iou=("txt", "IOU: 20% COMPUTE", "at", 0)), face={"ALYI": "lip", "MAS": "lip"}),
    "S7.02": dict(verdict="C", v4="S7.02", face={"MAS": "room"}),
    "S7.02b": dict(verdict="C", v4="S7.02b", marks=dict(below=("w", "a5-30-06", "below", 0), above=("w", "a5-30-06", "above", 0),
                                                        around=("w", "a5-30-06", "around", 0)), face={"TASYA": "lip"}),
    "S7.03": dict(verdict="R", v4="S7.03", face={"TASYA": None}),
    "S7.05": dict(verdict="R", v4="S7.05"),
    "S7.06": dict(verdict="R", v4="S7.06", marks=dict(bang=("snd", "landing_thunk", 1, 0), helmet=("f", 3), freeze=("snd", "freeze_hit_F", 1, 0),
                                                      pin=("f", 45), unfreeze=("beat", "S7.06-cont", 0), look=("end", "a5-30-08", 5)),
                  face={"TERB": "room"}),
    "S7.07": dict(verdict="C", v4="S7.07", marks=dict(spray=("we", "a5-30-10", "surprised", 3), sprayEnd=("w", "a5-30-10", "we", -3)),
                  face={"TERB": "room"}),
    "S7.07b": dict(verdict="N", v4=None, marks=dict(nod=("w", "a5-30-10", "other", 0)), face={"TERB": None}),
    "S7.07-cont": dict(verdict="C", v4="S7.07", marks=dict(look=("w", "a5-30-12", "he", -5), stop=("end", "a5-30-15", 0)),
                       face={"MAS": "lip", "TERB": "room", "MADA": "lip"}),  # MADA: his face is in the 2S for "Good question." (v4 lip-synced it; a4p5-lipsync)
    "S7.08": dict(verdict="R", v4="S7.08", face={"MAS": "lip"}),
    "S7.09": dict(verdict="C", v4="S7.09", marks=dict(stamp=("snd", "rubber_stamp_C", 1, 0), stop=("mark", "stamp", -14), nod=("mark", "stamp", -9),
                                                      hand=("mark", "stamp", 16), phone=("snd", "keycap_popcorn", 1, 0), post=("txt", "POST: GERG", "at", 0))),
    "S7.13": dict(verdict="C", v4="S7.13", marks=dict(grain=("f", 7), post=("txt", "POST: TTEMME", "at", 0), postEnd=("txt", "POST: TTEMME", "until", 0),
                                                      shatter=("snd", "hourglass_shatter", 1, 0)), face={"TTEMME": None}),
    # ---------------------------------------------------------------- S8 · THE LOBBY, AND AFTER
    "S8.01": dict(verdict="C", v4="S8.01", marks=dict(ignite=("snd", "neon_ignite", 1, 0))),
    "S8.03": dict(verdict="R", v4="S8.03", marks=dict(dialog=("f", 5), grey1=("f", 15), grey2=("f", 30), click=("snd", "alert_bonk", 1, 0))),
    "S8.04": dict(verdict="R", v4="S8.04"),
    "S8.05": dict(verdict="R", v4="S8.05", marks=dict(set=("f", 4), nudge=("f", 10)), face={"MAS": None}),
    "S8.06": dict(verdict="R", v4="S8.06"),
    "S8.07": dict(verdict="C", v4="S8.07", marks=dict(rack=("end", "a5-31-03", 2), walk=("mark", "rack", 20)), face={"GERG": "lip", "MAS": None}),
    "S8.08": dict(verdict="N", v4=None, marks=dict(drift=("f", 0)), face={"MAS": "room"}),
    "S8.09": dict(verdict="R", v4="S8.09", marks=dict(s1=("snd", "key_tap_soft_01", 1, -4), s2=("snd", "key_tap_soft_03", 1, -4),
                                                      s3=("snd", "key_tap_soft_05", 1, -4), s4=("snd", "key_tap_soft_06", 1, -4)), face={"MAS": None}),
    "S8.09b": dict(verdict="N", v4=None),
    "S8.10": dict(verdict="R", v4="S8.10", marks=dict(unfold=("f", 0), keys=("snd", "bell_ding_F6", 1, -8))),
}
# v4 layouts that look lines up by their v4 ids: the v5 line (or post) that plays the same part (shots5.ts v4() renames)
V4_IDS = {
    "a4-25-12": "a5-25-04", "a4-25-02": "a5-25-06", "a4-27-00": "a5-27-05", "a4-27-01b": "a5-27-P1", "a4-27-07": "a5-27-P2",
    "a4-27-15": "a5-27-32", "a4-27-17": "a5-27-P3", "a4-29-03": "a5-29-02", "a4-29-08": "a5-29-23", "a4-29-09": "a5-29-24",
    "a4-30-01": "a5-30-P1", "a4-30-02": "a5-30-06", "a4-30-10": "a5-30-P2", "a4-30-11": "a5-30-P3", "a4-31-02": "a5-31-02",
}
# the silent posts (edit-plan-v5 §7 ids), found by the stick's in-world text in their shot
POST_IDS = {"S3.05": "a5-27-P1", "S4.01": "a5-27-P2", "S4.09": "a5-27-P3", "S5.03": "a5-29-P1", "S7.01": "a5-30-P1", "S7.09": "a5-30-P2", "S7.13": "a5-30-P3"}
# in-world text kinds (the v4 layouts find their plate / toast / label by kind); the rest are 'label'
TEXT_KIND = [
    (r"^RAIL: ", "rail"), (r"^POST: ", "post"), (r"^UI: ", "ui"),
    (r"^You've been removed from the meeting\.$|left the call$|was removed from the meeting\.$|^rewinding", "toast"),
    (r"^RIMA TAMURI · |^MARIO · |^ADELINA · |^TTEMME · RAN|^TASYA · THE LANDLORD|^YRRAL \(NOT THAT", "plate"),
    (r"^NELEH / READ|^FOOTNOTES:|^TERB / THE NEW CHAIR|^EXTINGUISHERS:|^WHAT THEY DIDN'T KNOW", "card"),
    (r"^HOW TO FIRE A CEO$|^VOTES: 0$|^EQUITY: 0|^VOID IF CEO MISSING$", "stamp"),
    (r"^MAS · GERG →$|^MAS / GERG / →$|^DAYS SINCE SOMEONE", "sign"),
    (r"^\d+:\d\d$", "clock"),
]
# a shot's size class and move for the margin (frame4's CLS_NAME keys), from the stick's framing
CLS = [(r"^WIDE|^SPLIT", "W"), (r"^TWO-SHOT|^MEDIUM", "M"), (r"^OTS", "OTS"), (r"^SINGLE · MCU", "MCU"), (r"^SINGLE · CU", "CU"),
       (r"^SINGLE · ECU|^INSERT|^OVERHEAD|^LOW|^SINGLE · the Orb", "ECU"), (r"^SCREEN", "SW"), (r"^POV", "SC"),
       (r"^GFX · detail", "GD"), (r"^GFX", "GS"), (r"^CARD|^FLASH", "GFX"), (r"^BOX", "BOX")]

problems: list[str] = []
decisions: list[str] = []
checks: list[dict] = []


def check(name: str, ok: bool, detail: str):
    checks.append(dict(check=name, ok=bool(ok), detail=detail))
    if not ok:
        problems.append(f"CHECK FAILED: {name}: {detail}")


# ====================================================================================== 1. beats -> frames
beats = REEL["beats"]
starts = []
acc, prev = 0.0, 0
for b in beats:
    acc += b["reelDur"]
    end = max(prev + 1, int(round(acc * FPS)))
    starts.append((prev, end))
    prev = end
ACT = prev
BEAT_AT = {b["id"]: i for i, b in enumerate(beats)}
worst = max(abs((b["realStart"] - EP_IN_S) * FPS - s0) for b, (s0, _e) in zip(beats, starts))
check("beat starts agree with realStart", worst <= 0.5, f"largest difference {worst:.3f} f (realStart carries 3 decimals)")
check("beat lengths are whole frames", all(abs(b["reelDur"] * FPS - round(b["reelDur"] * FPS)) < 0.02 for b in beats),
      "every reelDur x 24 is an integer (to 0.02 f)")
check("act length = the stick's act_seconds", ACT == round(REEL["_source"]["act_seconds"] * FPS), f"{ACT} f vs act_seconds {REEL['_source']['act_seconds']} s")

# ====================================================================================== 2. shots (a cont beat right after its shot merges)
shots: list[OrderedDict] = []
for i, b in enumerate(beats):
    s0, e0 = starts[i]
    sid = b.get("shotId", b["id"])
    if b.get("cont") and shots and shots[-1]["setup"] == sid:
        sh = shots[-1]
        sh["beats"].append(b["id"])
        sh["e"] = e0
        sh["_beats"].append((b, s0, e0))
        continue
    shots.append(OrderedDict(id=b["id"], setup=sid, beats=[b["id"]], s=s0, e=e0, _beats=[(b, s0, e0)]))
SH = {s["id"]: s for s in shots}
check("every shot has a plan entry", all(s["id"] in PLAN for s in shots), f"missing: {[s['id'] for s in shots if s['id'] not in PLAN]}")
check("no plan entry without a shot", all(k in SH for k in PLAN), f"extra: {[k for k in PLAN if k not in SH]}")

# ====================================================================================== 3. lines (voiced), on the stick's frames
LINES: dict[str, OrderedDict] = {}
for sh in shots:
    for (b, s0, e0) in sh["_beats"]:
        for l in b["lines"]:
            R = TAKES.get(l["id"])
            if R is None:
                problems.append(f"{sh['id']}: {l['id']} is not in lines-v5.json")
                continue
            on_s = s0 / FPS + l["t"]
            end_s = on_s + l["dur"]
            file_s = on_s - l["in"]
            on_f = fr(on_s)
            e_f = int(math.floor(end_s * FPS - EPS)) + 1
            # words: the stick's word list is [w, t0, t1] on the speech onset's clock (t - in)
            words = [[w[0], fr(on_s + w[1]) - on_f, fr(on_s + w[2]) - on_f] for w in l.get("words", [])]
            # mouth: the take's visemes on the file's clock -> frames from this line's first sound; nothing after its last
            mouth: list[list] = []
            for m in R.get("mouth", []):
                f_rel = fr(file_s + m["t"]) - on_f
                if f_rel >= e_f - on_f:
                    break
                f_rel = max(0, f_rel)
                if mouth and mouth[-1][0] == f_rel:
                    mouth[-1][1] = m["shape"]
                elif not mouth or mouth[-1][1] != m["shape"]:
                    mouth.append([f_rel, m["shape"]])
            if mouth and mouth[0][0] != 0:
                mouth.insert(0, [0, "rest"])
            if mouth and mouth[-1][1] != "rest":
                mouth.append([e_f - on_f, "rest"])
            who = WHO.get(l["who"], l["who"].upper())
            if who != WHO.get(TAKE_SLUG.get(R["speaker_slug"], R["speaker_slug"]), R["speaker"]):
                problems.append(f"{l['id']}: the stick's speaker {l['who']} vs the take's {R['speaker']}")
            LINES[l["id"]] = OrderedDict(
                id=l["id"], shot=sh["id"], beat=b["id"], kind=R["kind"], mode=R["mode"], who=who, text=l["text"], tag=l.get("tag", ""),
                on_s=round(on_s, 4), end_s=round(end_s, 4), file_s=round(file_s, 4), abs_in=on_f, abs_out=e_f,
                file_in=fr(file_s), file_out=fr(file_s) + int(R["frames_24"]), file=R["file"], stick_t=l["t"], stick_in=l["in"],
                cut=bool(l.get("cut")), on_camera=R.get("on_camera"), take_lip_sync=bool(R.get("lip_sync")),
                os=R.get("on_camera") == "os" or R["mode"] == "speaker", via=R.get("device"), words=words, mouth=mouth,
            )

# ====================================================================================== 4. posts and in-world text, rails
RAILS: list[OrderedDict] = []
POSTS: dict[str, OrderedDict] = {}


def text_kind(t: str) -> str:
    for rx, k in TEXT_KIND:
        if re.search(rx, t):
            return k
    return "label"


def floor_f(t: str) -> int:
    return int(math.ceil((0.25 + 0.05 * len(t)) * FPS))


for sh in shots:
    sh["texts"] = []
    for (b, s0, e0) in sh["_beats"]:
        for o in b.get("onscreen") or []:
            t = o["text"]
            a = s0 + fr(o["at"])
            u = s0 + fr(o["until"]) if o.get("until") is not None else sh["e"]
            kind = text_kind(t)
            if sh["id"] == "S5.03" and t.startswith("RIMA: "):
                kind = "post"
                t = "POST: " + t
            if kind == "rail":
                RAILS.append(OrderedDict(text=t[len("RAIL: "):], s=a, e=u, shot=sh["id"], floor_f=floor_f(t[6:])))
                continue
            if kind == "post":
                m = re.match(r"^POST: ([A-Z]+): “?(.*?)”?$", t)
                pid = POST_IDS.get(sh["id"])
                if not m or not pid:
                    problems.append(f"{sh['id']}: a post I can't parse or name: {t!r}")
                    continue
                POSTS[pid] = OrderedDict(id=pid, shot=sh["id"], beat=b["id"], kind="post", mode="post", who=m.group(1), text=m.group(2), tag="",
                                         abs_in=a, abs_out=u, words=[], mouth=[], os=False, via=None, cut=False, on_camera="post", take_lip_sync=False)
                continue
            sh["texts"].append(OrderedDict(kind=kind, text=t[4:] if kind == "ui" else t, abs_in=a, abs_out=u, floor_f=floor_f(t), must=kind not in ("clock",)))
    for x in sh["texts"]:
        if x["must"] and x["abs_out"] - x["abs_in"] < x["floor_f"]:
            decisions.append(f"{sh['id']}: {x['kind']} {x['text'][:32]!r} is up {x['abs_out'] - x['abs_in']} f, under its read floor {x['floor_f']} f (the approved stick timing; kept)")
check("every silent post found", set(POSTS) == set(POST_IDS.values()), f"{sorted(POSTS)}")
for r in RAILS:
    if r["e"] - r["s"] < r["floor_f"]:
        decisions.append(f"rail {r['text'][:28]!r} is up {r['e'] - r['s']} f, under its read floor {r['floor_f']} f (the stick's; kept)")

# ====================================================================================== 5. marks
v4_scaled_log: list[str] = []


def word_frame(lid: str, word: str, which: int) -> int:
    L = LINES[lid]
    m = re.match(r"^(.*?)(?:#(\d+))?$", word)
    want, nth = norm(m.group(1)), int(m.group(2) or 1)
    hits = [w for w in L["words"] if norm(w[0]) == want]
    if len(hits) < nth:
        hits = [w for w in L["words"] if norm(w[0]).startswith(want)]
    if len(hits) < nth:
        raise KeyError(f"{lid}: no word {word!r} in {[w[0] for w in L['words']]}")
    return L["abs_in"] + hits[nth - 1][which]


def resolve(sh: OrderedDict, a, marks: dict) -> int:
    """an anchor -> an act frame"""
    kind = a[0]
    if kind == "f":
        return sh["s"] + a[1]
    if kind == "len":
        return sh["e"] + a[1]
    if kind == "mark":
        return marks[a[1]] + a[2]
    if kind == "beat":
        _, bid, off = a
        return starts[BEAT_AT[bid]][0] + off
    if kind == "snd":
        _, name, n, off = a
        hits = []
        for (b, s0, _e) in sh["_beats"]:
            hits += [s0 + fr(x["at"]) for x in (b.get("sounds") or []) if x["name"] == name]
        if len(hits) < n:
            raise KeyError(f"{sh['id']}: no sound {name!r} #{n}")
        return hits[n - 1] + off
    if kind == "txt":
        _, sub, which, off = a
        for (b, s0, _e) in sh["_beats"]:
            for o in b.get("onscreen") or []:
                if sub in o["text"]:
                    v = o["at"] if which == "at" else o["until"]
                    return (s0 + fr(v) if v is not None else sh["e"]) + off
        raise KeyError(f"{sh['id']}: no text {sub!r}")
    if kind == "speak":
        _, who, which, off = a
        for (b, s0, _e) in sh["_beats"]:
            for x in b.get("speak") or []:
                if x["id"] == who:
                    return s0 + fr(x["at"] + (x["dur"] if which == "end" else 0)) + off
        raise KeyError(f"{sh['id']}: no speak {who!r}")
    if kind in ("on", "end"):
        _, lid, off = a
        L = LINES[lid]
        return (L["abs_in"] if kind == "on" else L["abs_out"]) + off
    if kind in ("w", "we"):
        _, lid, word, off = a
        return word_frame(lid, word, 1 if kind == "w" else 2) + off
    raise ValueError(a)


for sh in shots:
    pl = PLAN[sh["id"]]
    n = sh["e"] - sh["s"]
    marks: dict[str, int] = {}
    src: dict[str, str] = {}
    v4 = V4SH.get(pl.get("v4") or "")
    # v4's own marks, re-scaled onto this shot's length (for the reused layouts); explicit anchors replace them below
    if v4:
        n4 = v4["frames"]
        for name, m4 in v4["marks"].items():
            v = sh["s"] + (m4 if n == n4 else int(round(m4 * n / n4)))
            marks[name] = v
            src[name] = "v4" if n == n4 else f"v4 {m4}/{n4} scaled"
    for name, a in (pl.get("marks") or {}).items():
        key = name.rstrip("_")
        try:
            marks[key] = resolve(sh, a, marks)
            src[key] = " ".join(str(x) for x in a)
        except (KeyError, IndexError) as ex:
            problems.append(f"{sh['id']}: mark {key}: {ex}")
    for name in list(marks):
        if not (sh["s"] - 400 <= marks[name] <= sh["e"] + 400):
            problems.append(f"{sh['id']}: mark {name} at act f {marks[name]} is far outside the shot")
        if src[name].startswith("v4 ") and "scaled" in src[name]:
            v4_scaled_log.append(f"{sh['id']}.{name}: {src[name]} -> {marks[name] - sh['s']}")
    sh["marks_abs"] = marks
    sh["mark_src"] = src

# ====================================================================================== 6. lines per shot (own + carried in), faces
DEFAULT_FACE = {}  # a speaker not named in a shot's face table shows no mouth
for sh in shots:
    pl = PLAN[sh["id"]]
    face = pl.get("face") or {}
    rows = []
    for L in list(LINES.values()) + list(POSTS.values()):
        own = L["shot"] == sh["id"]
        carried = (not own) and L["kind"] != "post" and L["abs_in"] < sh["s"] < L["abs_out"]
        if not (own or carried):
            continue
        f = face.get(L["who"], None) if L["kind"] != "post" else None
        rows.append(OrderedDict(
            id=L["id"], kind=L["kind"], mode=L["mode"], who=L["who"], text=L["text"], s=L["abs_in"] - sh["s"], e=L["abs_out"] - sh["s"],
            fs=(L["file_in"] - sh["s"]) if L["kind"] != "post" else None, fe=(L["file_out"] - sh["s"]) if L["kind"] != "post" else None,
            os=L["os"], via=L["via"], face=f, lip=f == "lip", carry=carried, cut=L["cut"], mouth=L["mouth"], words=L["words"],
        ))
    rows.sort(key=lambda r: r["s"])
    sh["lines"] = rows
    for who in face:
        if face[who] and not any(r["who"] == who and r["kind"] != "post" for r in rows):
            decisions.append(f"{sh['id']}: the face table names {who}, who has no line in the shot")

# ====================================================================================== 7. sequences, D6, sound marks
SEQS = []
cur = None
for sh in shots:
    b0 = sh["_beats"][0][0]
    q = b0.get("seq")
    if q and q.get("id"):
        cur = OrderedDict(id=q["id"], side=q.get("side", ""), place=q.get("place", ""), time=q.get("time", ""), s=sh["s"], e=sh["e"], shots=[])
        SEQS.append(cur)
    cur["shots"].append(sh["id"])
    cur["e"] = sh["e"]
    sh["seq"] = cur["id"]
V4SEQ = {q["id"]: q for q in V4["sequences"]}
SEQ_TITLE = {"CARD": ("CARD", "WHAT THEY DIDN'T KNOW")}
for q in SEQS:
    if q["id"] in V4SEQ:
        q["chapter"], q["title"] = V4SEQ[q["id"]]["chapter"], V4SEQ[q["id"]]["title"]
    else:
        q["chapter"], q["title"] = SEQ_TITLE.get(q["id"], (q["id"], q["place"]))
    cues = []
    for sid in q["shots"]:
        for (b, _s0, _e) in SH[sid]["_beats"]:
            cues += [c for c in (b.get("cues") or []) if c not in cues]
    q["cue"] = " · ".join(cues)
    q["frames"] = q["e"] - q["s"]
    q["tc_in"], q["tc_out"] = tc(q["s"]), tc(q["e"])

click = SH["S1.09"]["marks_abs"]["click"]
buzz = SH["S1.11"]["marks_abs"]["buzz"]
D6 = [click, buzz]
check("D6 about 3.7 s (edit-plan-v5 §4)", 3.3 <= (buzz - click) / FPS <= 4.1, f"click f {click} -> buzz f {buzz} = {(buzz - click) / FPS:.2f} s")
SOUND_MARKS = [
    dict(kind="stop", n=1, name="D6: the Cancel click's digital silence", s=click, e=buzz, shot="S1.09"),
    dict(kind="stop", n=2, name="dead stop on MADA's label", s=SH["S6.06"]["marks_abs"]["label"], e=None, shot="S6.06"),
    dict(kind="stop", n=3, name='dead stop after "of what?"', s=LINES["a5-30-15"]["abs_out"], e=LINES["a5-30-16"]["abs_in"], shot="S7.07-cont"),
    dict(kind="ringout", n=1, name="Gerg's look (the Build stops, the pedal holds)", s=SH["S5.09b"]["s"], e=None, shot="S5.09b"),
]

# ====================================================================================== 8. the subtitles (the review band), named as the stick names them
named: dict[str, int] = {cid: -1 for cid, c in REEL["cast"].items() if c.get("known")}
for sh in shots:
    for (b, s0, _e) in sh["_beats"]:
        for nm in b.get("names") or []:
            f0 = s0 + fr(nm["at"])
            if nm["id"] not in named or named[nm["id"]] > f0:
                named[nm["id"]] = f0
SLUG = {v: k for k, v in WHO.items()}


def shown_as(who: str, f: int) -> str:
    cid = SLUG.get(who, who.lower())
    c = REEL["cast"].get(cid, {})
    at = named.get(cid)
    return (c.get("name") or who) if at is not None and at <= f else (c.get("role") or "VOICE")


SUBS = []
allrows = sorted(list(LINES.values()) + list(POSTS.values()), key=lambda l: l["abs_in"])
for l in allrows:
    SUBS.append(OrderedDict(s=l["abs_in"], e=l["abs_out"], hold_to=l["abs_out"] + (12 if l["kind"] != "post" else 0), who=l["who"],
                            shown=shown_as(l["who"], l["abs_in"]), text=l["text"], kind=l["kind"], mode=l["mode"], id=l["id"], os=l["os"]))
for a, b in zip(SUBS, SUBS[1:]):
    a["hold_to"] = min(a["hold_to"], max(a["e"], b["s"]))

# ====================================================================================== 9. the checks against the stick timeline
# (a) every shot's frame count = the sum of its beats' frames, and the act = the stick
check("shot frames = their beats' frames", all(sh["e"] - sh["s"] == sum(e0 - s0 for (_b, s0, e0) in sh["_beats"]) for sh in shots),
      f"{len(shots)} shots from {len(beats)} beats")
check("shots tile the act with no gap", all(a["e"] == b["s"] for a, b in zip(shots, shots[1:])) and shots[0]["s"] == 0 and shots[-1]["e"] == ACT,
      f"0 -> {ACT}")
# (b) every line starts on the frame of its first sound, re-derived independently from the stick's realStart (seconds)
#     realStart carries 3 decimals, so the beat's start is its nearest frame; the line's onset is that + t
bad, raw = [], []
for b in beats:
    for l in b["lines"]:
        b0 = round((b["realStart"] - EP_IN_S) * FPS)
        want = fr(b0 / FPS + l["t"])
        got = LINES[l["id"]]["abs_in"]
        if want != got:
            bad.append((l["id"], got, want))
        if fr((b["realStart"] - EP_IN_S) + l["t"]) != got:
            raw.append(l["id"])
check("every line starts on the stick's frame", not bad,
      f"{sum(len(b['lines']) for b in beats)} lines, re-derived from realStart + t; differ: {bad} (unrounded realStart moves {raw} by 0.008 f across a frame line)")
# (c) the stick reel's word strip shows a word on the first frame AT or AFTER it (Reel.tsx: f >= start); the lock's
#     start is the frame the sound falls IN: the same frame, or one earlier when the onset is mid-frame
reel_first = {lid: math.ceil(L["on_s"] * FPS - EPS) for lid, L in LINES.items()}
d = [reel_first[lid] - L["abs_in"] for lid, L in LINES.items()]
check("the lock vs the stick reel's own line frames", all(x in (0, 1) for x in d),
      f"same frame: {d.count(0)}; 1 f earlier (the onset falls inside the frame): {d.count(1)}; other: {len([x for x in d if x not in (0, 1)])}")
# (d) the takes: every line has a take whose speech fits its file, and a mouth track where the take has one
check("all 101 takes placed", len(LINES) == 101 and set(LINES) == set(TAKES), f"{len(LINES)} placed; missing {sorted(set(TAKES) - set(LINES))}")
fit = [lid for lid, L in LINES.items() if not (L["file_in"] <= L["abs_in"] and L["abs_out"] <= L["file_out"] + 1)]
check("every line's speech lies inside its take file", not fit, f"outside: {fit}")
nomouth = [lid for lid, L in LINES.items() if not L["mouth"] and TAKES[lid].get("mouth")]
check("mouth tracks carried over", not nomouth, f"{sum(1 for L in LINES.values() if L['mouth'])} lines with a mouth track; lost: {nomouth}")
# (d2) every line a framing shows a mouth for (face) has a mouth track to draw (else a layout would have to flap)
faced = [f"{sh['id']}:{r['id']}" for sh in shots for r in sh["lines"] if r["face"] and r["kind"] != "post" and not r["mouth"]]
check("every on-camera mouth has a track", not faced, f"{sum(1 for sh in shots for r in sh['lines'] if r['face'])} faced rows; without a track: {faced}")
# (e) the mix: 72 title frames + the act
try:
    with wave.open(MIX_WAV) as w:
        mix_frames = w.getnframes() / w.getframerate() * FPS
    check("mix.wav = the title card + the act", abs(mix_frames - (TITLE_FRAMES + ACT)) < 0.5, f"mix.wav {mix_frames:.2f} f = {TITLE_FRAMES} + {ACT}")
except FileNotFoundError:
    mix_frames = None
    problems.append("mix.wav not found (git-ignored audio): the length check was skipped")
# (f) marks inside their shots (a mark past the end is legal only as 'never in this shot', e.g. S5.09's glance)
out_of = [f"{sh['id']}.{k}={v - sh['s']}" for sh in shots for k, v in sh["marks_abs"].items() if not (sh["s"] <= v <= sh["e"]) and k not in ("glance",)]
if out_of:
    decisions.append(f"marks outside their shot (v4 marks the v5 layout doesn't read, or anchors on carried lines): {out_of}")
# (g) the mix's source: the stick JSON the mix was built from has the same beat and line timing as the approved one
HIST = P("audio/reel/ep01-act4-v5/history/v5a-1508/ep01-act4-v5.json")
if os.path.exists(HIST):
    H = {b["id"]: b for b in json.load(open(HIST))["beats"]}
    diffs = [b["id"] for b in beats if b["id"] not in H or H[b["id"]]["reelDur"] != b["reelDur"]
             or [(l["id"], l["t"], l["dur"], l["in"]) for l in H[b["id"]]["lines"]] != [(l["id"], l["t"], l["dur"], l["in"]) for l in b["lines"]]]
    sfx = [b["id"] for b in beats if b["id"] in H and (H[b["id"]].get("sounds") or []) != (b.get("sounds") or [])]
    check("mix.wav's source timeline (15:00) has the approved beat and line timing", not diffs, f"differ: {diffs}; sound spots added since: {sfx}")

# ====================================================================================== 10. stats
lens = [(sh["e"] - sh["s"]) / FPS for sh in shots]
voiced = sorted(LINES.values(), key=lambda l: l["abs_in"])
crossing = [f"{l['id']} ({l['shot']} -> {', '.join(s['id'] for s in shots if l['abs_in'] < s['s'] < l['abs_out'])})" for l in voiced if l["abs_out"] > SH[l["shot"]]["e"]]
stats = OrderedDict(
    shots=len(shots), beats=len(beats), act_frames=ACT, act_seconds=round(ACT / FPS, 3), act_length=length(ACT), episode_in=tc(0), episode_out=tc(ACT),
    verdicts={v: sum(1 for s in shots if PLAN[s["id"]]["verdict"] == v) for v in "RCN"},
    verdict_seconds={v: round(sum((s["e"] - s["s"]) / FPS for s in shots if PLAN[s["id"]]["verdict"] == v), 2) for v in "RCN"},
    mean_s=round(statistics.mean(lens), 3), median_s=round(statistics.median(lens), 3), min_s=round(min(lens), 3), max_s=round(max(lens), 3),
    lines=len(LINES), posts=len(POSTS), lines_with_mouth=sum(1 for l in LINES.values() if l["mouth"]),
    on_camera_mouths=sorted({f"{s['id']}:{r['who']}:{r['face']}" for s in shots for r in s["lines"] if r["face"]}),
    lines_crossing_a_cut=crossing, D6_frames=D6, D6_seconds=round((D6[1] - D6[0]) / FPS, 3),
    mix=dict(path="audio/reel/ep01-act4-v5/mix.wav", offset_frames=TITLE_FRAMES, frames=mix_frames),
)

# ====================================================================================== 11. write
for sh in shots:
    pl = PLAN[sh["id"]]
    b0 = sh["_beats"][0][0]
    frame = b0.get("frame", "")
    cls = next((c for rx, c in CLS if re.search(rx, frame)), "M")
    sounds = []
    for (b, s0, _e) in sh["_beats"]:
        sounds += [f"{x['name']} @{s0 + fr(x['at']) - sh['s']}" for x in (b.get("sounds") or [])]
    v4 = V4SH.get(pl.get("v4") or "")
    sh.update(OrderedDict(
        verdict=pl["verdict"], v4=pl.get("v4"), side=SIDE.get(b0.get("side"), "MAS"), side_label=b0.get("side") or "HIS SIDE",
        badge=pl.get("badge"), whip=pl.get("whip"), frame=frame, cls=cls, move="hold" if "held" in frame or cls in ("M", "OTS") else "cut",
        does=" / ".join(b.get("caption", "") for (b, _s, _e) in sh["_beats"]), chars=sorted({c["id"] for (b, _s, _e) in sh["_beats"] for c in b.get("chars", [])}),
        cues=[c for (b, _s, _e) in sh["_beats"] for c in (b.get("cues") or [])], sounds=sounds,
        v4_frames=v4["frames"] if v4 else None,
    ))
lock = OrderedDict(
    meta=OrderedDict(
        show="MR. MAS", episode="ep01", act="ACT FOUR · THE BLIP, TOLD TWICE", script="draft 5.1 (the conversation pass)",
        timeline="show/reel/ep01-act4-v5.json (the approved stick timeline)", takes="audio/ep01/act4/dialogue/lines-v5.json",
        lock="timing lock v5 (INF-LOCK5)", generator="studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py", fps=FPS,
        rules=["the picture is cut to the approved stick timeline: its beats are the shots, its lines are the lines, nothing re-timed",
               "a continuation beat that follows its own shot directly merges into it (S7.06-cont)",
               "a line starts on the frame in which its first sound falls (beat start + t), ends after the frame of its last sound",
               "mouths and words on the same rule; a line appears in every later shot it runs into (carry)",
               "marks come from the stick's own sound spots and text, the takes' words, or v4's marks scaled to the v5 length",
               "the framing decides who shows a mouth (face), not the take's lip_sync flag (art-needs-v5 §1.2)",
               "mix.wav (the stick mix) is the temp track: its frame 72 is act frame 0"],
        note="Nothing here was watched or heard. The numbers are measured from the files; whether the picture reads needs a person."),
    summary=stats, checks=checks, sequences=SEQS,
    shots=[OrderedDict((k, v) for k, v in sh.items() if not k.startswith("_") and k not in ("marks_abs", "mark_src"))
           | OrderedDict(marks={k: v - sh["s"] for k, v in sh["marks_abs"].items()}, mark_src=sh["mark_src"],
                         texts=[OrderedDict(kind=x["kind"], text=x["text"], s=x["abs_in"] - sh["s"], e=x["abs_out"] - sh["s"], must=x["must"]) for x in sh["texts"]])
           for sh in shots],
    lines=list(LINES.values()), posts=list(POSTS.values()), rails=RAILS, sound_marks=SOUND_MARKS, subs=SUBS,
    v4_ids=V4_IDS, v4_marks_scaled=v4_scaled_log, decisions=decisions, problems=problems,
)
for s in lock["shots"]:
    s["tc_in"], s["tc_out"], s["frames"] = tc(s["s"]), tc(s["e"]), s["e"] - s["s"]
json.dump(lock, open(OUT_JSON, "w"), indent=1, ensure_ascii=False)

# ------------------------------------------------------------------------------------------------ data-v5.ts
ts_shots = []
for sh in shots:
    ts_shots.append(OrderedDict(
        id=sh["id"], setup=sh["setup"], beats=sh["beats"], seq=sh["seq"], side=sh["side"], badge=sh["badge"], whip=sh["whip"], tag=sh["frame"],
        cls=sh["cls"], framing=sh["frame"], move=sh["move"], s=sh["s"], e=sh["e"], plan=sh["e"] - sh["s"], v4=sh["v4"], verdict=sh["verdict"],
        does=sh["does"], sound=" · ".join(sh["sounds"]), chars=sh["chars"],
        lines=[OrderedDict((k, r[k]) for k in ("id", "kind", "mode", "who", "text", "s", "e", "fs", "fe", "os", "via", "face", "lip", "carry", "cut", "mouth", "words")) for r in sh["lines"]],
        texts=[OrderedDict(kind=x["kind"], text=x["text"], s=x["abs_in"] - sh["s"], e=x["abs_out"] - sh["s"], must=x["must"]) for x in sh["texts"]],
        marks={k: v - sh["s"] for k, v in sh["marks_abs"].items()},
    ))
J = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))  # noqa: E731
ts = [
    "// GENERATED by tools/lock_v5.py from the approved stick timeline (show/reel/ep01-act4-v5.json) + the v5 takes",
    "// (audio/ep01/act4/dialogue/lines-v5.json): the timing lock v5 (INF-LOCK5). Do not hand-edit: re-run lock_v5.py.",
    "// Frames are act frames (0 = episode 12:31:00). Shot-relative: lines[].s/e (first sound / after the last), fs/fe (the",
    "// take file), texts[].s/e, marks. mouth = [[frame from s, viseme]], words = [[word, f0, f1]] from s. carry = a line that",
    "// started in an earlier shot and runs into this one. face = who shows a mouth in this framing ('lip' | 'room' | null).",
    "/* eslint-disable */",
    "export type SideV5 = 'MAS' | 'BOARD';",
    "export interface LineV5 { id: string; kind: 'dialogue' | 'vo' | 'post'; mode: string; who: string; text: string; s: number; e: number; fs: number | null; fe: number | null; os: boolean; via: string | null; face: 'lip' | 'room' | null; lip: boolean; carry: boolean; cut: boolean; mouth: Array<[number, string]>; words: Array<[string, number, number]>; }",
    "export interface TextV5 { kind: string; text: string; s: number; e: number; must: boolean; }",
    "export interface ShotV5 { id: string; setup: string; beats: string[]; seq: string; side: SideV5; badge: string | null; whip: string | null; tag: string; cls: string; framing: string; move: string; s: number; e: number; plan: number; v4: string | null; verdict: 'R' | 'C' | 'N'; does: string; sound: string; chars: string[]; lines: LineV5[]; texts: TextV5[]; marks: Record<string, number>; }",
    "export interface RailV5 { text: string; s: number; e: number; shot: string; }",
    "export interface SeqV5 { id: string; chapter: string; title: string; place: string; time: string; s: number; e: number; cue: string; }",
    "export interface SubV5 { s: number; e: number; hold_to: number; who: string; shown: string; text: string; kind: string; mode: string; id: string; os: boolean; }",
    "export interface SoundMarkV5 { kind: string; n: number; name: string; s: number; e: number | null; shot: string; }",
    f"export const ACT_FRAMES = {ACT};",
    f"export const EP_IN_FRAMES = {EP_IN};",
    f"export const PLAN_FRAMES = {ACT};",
    f"/** the temp track: the stick reel's mix; its frame {TITLE_FRAMES} is act frame 0 (a 3 s title card comes first) */",
    f"export const MIX = {J(dict(path='audio/reel/ep01-act4-v5/mix.wav', offsetFrames=TITLE_FRAMES, frames=TITLE_FRAMES + ACT))};",
    f"export const D6: [number, number] = [{D6[0]}, {D6[1]}];",
    "export const SOUND_MARKS: SoundMarkV5[] = " + J(SOUND_MARKS) + ";",
    "export const SEQS: SeqV5[] = " + J([dict(id=q["id"], chapter=q["chapter"], title=q["title"], place=q["place"], time=q["time"], s=q["s"], e=q["e"], cue=q["cue"]) for q in SEQS]) + ";",
    "export const RAILS: RailV5[] = " + J([dict(text=r["text"], s=r["s"], e=r["e"], shot=r["shot"]) for r in RAILS]) + ";",
    "export const SUBS: SubV5[] = " + J(SUBS) + ";",
    "/** v4 layouts that look a line up by its v4 id: the v5 line or post that plays that part (shots5.ts v4() renames) */",
    "export const V4_IDS: Record<string, string> = " + J(V4_IDS) + ";",
    "export const SHOTS: ShotV5[] = " + J(ts_shots) + ";",
    "",
]
open(OUT_TS, "w").write("\n".join(ts))

# ------------------------------------------------------------------------------------------------ report
print(f"lock v5: {len(shots)} shots from {len(beats)} beats, {ACT} f = {length(ACT)}, {tc(0)} -> {tc(ACT)}")
print(f"  R {stats['verdicts']['R']} ({stats['verdict_seconds']['R']} s) · C {stats['verdicts']['C']} ({stats['verdict_seconds']['C']} s) · N {stats['verdicts']['N']} ({stats['verdict_seconds']['N']} s)")
print(f"  lines {stats['lines']} (+{stats['posts']} posts), with mouth tracks {stats['lines_with_mouth']}; on-camera mouths {len(stats['on_camera_mouths'])}")
print(f"  D6 {D6} = {stats['D6_seconds']} s; lines across a cut: {len(crossing)}")
for c in checks:
    print(f"  [{'ok' if c['ok'] else 'FAIL'}] {c['check']}: {c['detail']}")
print(f"decisions ({len(decisions)}):")
for d_ in decisions:
    print("  ", d_)
print(f"v4 marks scaled onto v5 lengths ({len(v4_scaled_log)}): " + "; ".join(v4_scaled_log))
print("problems:", problems or "none")
print(f"wrote {os.path.relpath(OUT_JSON, REPO)} and {os.path.relpath(OUT_TS, REPO)}")
sys.exit(1 if any(not c["ok"] for c in checks) else 0)
