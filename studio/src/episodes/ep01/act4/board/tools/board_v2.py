"""board_v2.py - the STORYBOARD's board 2 for Ep1 Act Four (sc 24-31, incl. 26A, 28), script DRAFT 3.1.

Inputs (read-only):
  show/episodes/ep01/script.md                              Act Four draft 3.1 (the authority; the draft 2 appendix is ignored)
  show/episodes/ep01/production/act4/pov-changes.md         the 3 -> 3.1 changelog (cuts / adds / reframes; rulings at their DEFAULTS)
  show/episodes/ep01/production/act4/shots.json             board 1 (draft 2): content carried by v1 id
  show/episodes/ep01/production/act4/shots-locked.json      THE EDITOR's draft-3 lock (crosswalk ids only; its frames are not reused blindly)
  audio/ep01/act4/dialogue/lines.json                       the recorded lines (frames_24, words)
  out/ep01/act4/animatic/scratch-vo/scratch_vo.json         the editor's scratch V.O. reads (words for "asked", lengths)

Outputs:
  show/episodes/ep01/production/act4/shots-v2.json          the machine-readable board (the JSON wins if the two disagree)
  show/episodes/ep01/production/act4/shotlist-v2.md         the readable board

Sizing (the same house rules THE EDITOR's lock.py uses, so a re-lock moves little):
  * 24 fps, 96 BPM: 15 f a beat, 60 f a bar. Act frame 0 = episode 12:31:00. Every cut lands on a beat.
  * Bar-counted and beat-counted shots keep the script's count (draft 3.1 prints most of them).
  * Dialogue shots without a printed length: lead 4 f + line(s) (recorded frames_24) + gaps 8 f + HOLDs + tail 8 f
    (a punchline 15 f), rounded UP to the beat. Posts: ceil_beat(0.25 s + 0.05 s/char) + 1 beat.
  * V.O.: starts on a beat, ends >= 1 beat before a cut / a spoken line; new reads are ESTIMATED until recorded.
Re-run after any re-record or ruling:  python3 studio/src/episodes/ep01/act4/board/tools/board_v2.py
"""
from __future__ import annotations

import copy
import re
import json
import math
import os
from collections import OrderedDict

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
PROD = P("show/episodes/ep01/production/act4")

FPS, BEAT, BAR = 24, 15, 60
EP_IN = (12 * 60 + 31) * FPS
P_LEAD, GAP, TAIL, PUNCH = 4, 8, 8, 15

V1 = json.load(open(os.path.join(PROD, "shots.json")))
V1S = {s["id"]: s for s in V1["shots"]}
V1A = {a["id"]: a for a in V1["assets"]}
LOCK = json.load(open(os.path.join(PROD, "shots-locked.json")))
LOCKS = {s["id"]: s for s in LOCK["shots"]}
REC = {x["id"]: x for x in json.load(open(P("audio/ep01/act4/dialogue/lines.json")))}
SCR = {x["id"]: x for x in json.load(open(P("out/ep01/act4/animatic/scratch-vo/scratch_vo.json")))}

# ============================================================================================ the line catalogue (3.1)
SPK = {"MAS MANALT": "MAS", "RIMA TAMURI": "RIMA", "GERG MOCKBRAN": "GERG"}
LINES = OrderedDict()
for lid, x in REC.items():
    if lid == "a4-29-02":
        continue  # retired: draft 2's on-mic "the hearts were sincere." (pov-changes 1.1)
    LINES[lid] = dict(id=lid, scene=x["scene"], speaker=SPK.get(x["speaker"], x["speaker"]), text=x["text"], tag=x["tag"], mode=x["mode"],
                      voiced=bool(x.get("voiced_in_cut")), frames=x["frames_24"], file=x.get("file"), status="RECORDED", words=x.get("words", []))
LINES["a4-29-03"]["status"] = "RECORDED · RE-TAKE RECOMMENDED (it now answers the Orb's look at the lanyard, after a 1-beat hold)"
LINES["a4-30-12"]["status"] = "RECORDED · same take, now OFF his face over the hands (no lip-sync)"
# derived: "super." through the board's laptop speaker (no new read)
LINES["a4-27-00"] = dict(id="a4-27-00", scene="27", speaker="MAS", text="super.", tag="[INVENTED] (the a4-26-01 take, heard on their call)",
                         mode="speaker-filter", voiced=True, frames=REC["a4-26-01"]["frames_24"], file=REC["a4-26-01"]["file"],
                         status="DERIVED · NEW PROCESS: a4-26-01 through a small laptop-speaker filter (band-limited, boxy, under the room); no new read",
                         words=REC["a4-26-01"].get("words", []))


def _vo(lid, sc, text, device, caught, frames, status, file=None, words=None, alt=None):
    LINES[lid] = dict(id=lid, scene=sc, speaker="MAS (V.O.)", text=text, tag=f"[INVENTED · VO · {device}]", mode="vo", voiced=True,
                      frames=frames, file=file, status=status, words=words or [], device=device, caught_by=caught, alt=alt)


# new reads are estimated from the editor's scratch pace (≈ 115 wpm; 4-5 syllables ≈ 44-54 f)
_vo("a4-26a-vo1", "26A", "i don't keep score.", "D2", "the Orb's iris counts the tally, 1, 2, 3, and stops on his thumb (26A.02); the tag's drawer pays it off",
    46, "NEW READ (est. 46 f) · record the guardrails fallback 'i don't keep things.' as an alt take", alt="i don't keep things.")
_vo("a4-26a-vo2", "26A", "the meeting ended early.", "D4", "the Orb's rewinding… (26A.06), then the exit's first shot: the board's call going on (27.01)",
    SCR["a4-26-vo1"]["frames_24"], "SCRATCH (the editor's a4-26-vo1 take of these words moves here; re-read optional)",
    file=SCR["a4-26-vo1"]["file"], words=SCR["a4-26-vo1"]["words"])
_vo("a4-29-vo1", "29", "i put the phone down.", "D5", "MAS'S VERSION (29.01a) shows it too still; the hard cut to the same frame (29.03) shows the phone face-up and his thumb hearting",
    54, "NEW READ (est. 54 f)")
_vo("a4-29-vo2", "29", "the badge was a joke.", "D3", "the Orb is already on the lanyard (29.04, 29.10); he answers its look aloud: 'mostly.' (29.10a)",
    54, "NEW READ (est. 54 f) · retire draft 2's on-mic a4-29-02")
_vo("a4-29-vo3", "29", "gerg never waits to be asked.", "D8", "not caught: released by Tasya's door stepping up on 'asked' (29.12)",
    SCR["a4-29-vo3"]["frames_24"], "SCRATCH (the editor's take; same words, no re-read)", file=SCR["a4-29-vo3"]["file"], words=SCR["a4-29-vo3"]["words"])

RETIRED_LINES = [
    dict(id="a4-26-vo1", text="the meeting ended early. (in sc 26)", why="no V.O. in sc 26 (the drop-out and the candor card play clean); the words move to 26A as a4-26a-vo2"),
    dict(id="a4-29-02", text="the hearts were sincere.", why="claims a feeling about the employees' real act; replaced by 'the badge was a joke.' (a4-29-vo2)"),
    dict(id="caption", text="mas manalt: super. (the call's caption line)", why="an invented line in real-transcript UI; replaced by his voice through their speaker (a4-27-00)"),
]

# ============================================================================================ vocab
SIZE_OF_TAG = {"[W]": "WIDE", "[M]": "MEDIUM", "[2S]": "TWO-SHOT", "[P]": "PORTRAIT", "[P2]": "PORTRAIT", "[PF]": "FALLAWAY",
               "[CU]": "CLOSE-UP", "[POV]": "UI-TILE-GRID", "[SCR]": "UI-TILE-GRID"}
LEGACY = {"WIDE": "ROOM-WIDE", "MEDIUM": "MEDIUM", "TWO-SHOT": "TWO-SHOT", "PORTRAIT": "PORTRAIT", "FALLAWAY": "PORTRAIT-FALLAWAY",
          "CLOSE-UP": "CLOSE-UP", "INSERT-HANDS": "INSERT", "INSERT-PROP": "INSERT", "UI-TILE-GRID": "UI-TILE-GRID",
          "BLUEPRINT": "BLUEPRINT", "CARD": "CARD"}
FACE_SIZES = {"MEDIUM", "TWO-SHOT", "PORTRAIT", "FALLAWAY", "CLOSE-UP", "INSERT-HANDS"}

# ============================================================================================ shot spec
SHOTS = []


def L(lid, at=None, gap=None, seg=None):
    return {"id": lid, "at": at, "gap": gap, "seg": seg}


def PO(lid, at, hold=None):
    return {"id": lid, "at": at, "hold": hold}


def T(s, kind, must=True, tag=""):
    d = {"text": s, "kind": kind, "must_read": must}
    if tag:
        d["tag"] = tag
    return d


def S(sid, sc, tag, size, frames=None, base=None, change="CARRY", why="", v1=None, lock=None, lines=(), posts=(), lead=None, tail=None,
      hold=0, punch=False, min_frames=0, rail=None, rail_at=0, rides=None, face_frames=None, hand=False, q=False, drop=None, beats=None,
      side=None, **kw):
    b = copy.deepcopy(V1S[base]) if base else {}
    d = dict(id=sid, scene=sc, tag=tag, shotSize=size, frames_spec=frames, change=change, change_note=why,
             v1_id=v1 if v1 is not None else ([base] if base else []), lock_id=lock if lock is not None else ([sid] if sid in LOCKS else []),
             cues=list(lines), post_cues=list(posts), lead=lead, tail=tail, hold=hold, punch=punch, min_frames=min_frames,
             rail=rail, rail_at=rail_at, rides=rides, face_frames_spec=face_frames, hand_in_frame=hand, quiet_beat=q, drop_out=drop,
             script_len=beats, side=side)
    for k in ("room", "characters", "action", "text", "style", "switches", "sfx", "music", "gags", "notes", "events", "prod_mode"):
        d[k] = kw.pop(k) if k in kw else copy.deepcopy(b.get(k, [] if k in ("characters", "action", "text", "switches", "sfx", "gags", "notes") else None))
    d["style"] = d["style"] or "[BASE]"
    d["music"] = d["music"] or ""
    d["events"] = d["events"] if d["events"] is not None else 1
    d["prod_mode"] = d["prod_mode"] or ("I" if size in ("PORTRAIT", "FALLAWAY", "TWO-SHOT", "MEDIUM", "WIDE", "CLOSE-UP") else "M")
    d["assets"] = kw.pop("assets") if "assets" in kw else [a["id"] for a in b.get("assets", [])]
    d["framing_note"] = kw.pop("fnote", "")
    d["board_notes"] = kw.pop("bnotes", [])
    assert not kw, (sid, kw)
    SHOTS.append(d)


CUTS = []  # shots removed (v1 or draft-3 lock), with the reason


def CUT(ids, why, where="", src="v1"):
    CUTS.append(dict(ids=ids, src=src, why=why, where=where))


# ============================================================================================================ SC 24
S("24.01", "24", "[W]", "WIDE", 60, base="24.01", beats="1 bar", rail="NOV 17, 2023 · ~NOON PT · LAS VEGAS", rail_at=0,
  characters=["MAS: room sprite seated at the desk (left third, 3/4 front), laptop open, his glass beside it; eyes level, tiny closed smile",
              "THE ORB: at his shoulder, room scale (8-10 px sphere, iris on the laptop)"],
  why="+ the Orb at his shoulder (3.1 prints it). The act's one establishing wide.",
  assets=["room.vegas-suite", "cast.mas.desk", "cast.orb.room"])
S("24.02", "24", "[ECU]", "INSERT-HANDS", 30, base="24.02", change="REORDER", beats="2 beats",
  why="The nudge now comes BEFORE the call (it was the [ECU] after the [M]); the laptop's JOIN no longer reads in sc 24 (its first read is the tear, 25.08).",
  lock=["24.02"], room="vegas-suite · desk insert (drawDeskInsert: his glass at the right, the laptop's corner)",
  characters=["MAS: hand only (cast.mas.hand.nudge, one drawing whose last frame is the nudge)"],
  action=["His hand and his glass. Two fingers nudge it one pixel true, back onto a spot it never left (beat 1; the glass moves 1 px, its water line stays flat).",
          "The hand lifts off the glass and settles on the trackpad at the frame's left edge (beat 2). No laptop text in frame."],
  text=[], switches=[], sfx=["NEW glass_set_down (the nudge: one dry tick, very soft)", "room_tone"], music="Leave air: the nudge is the joke.",
  gags=["G02: he straightens a glass that didn't move (every other glass shivered in 24.01)."],
  notes=["His ritual, not a tell at a real event: nothing on the record is near it."], events=2, prod_mode="M",
  assets=["room.vegas-suite", "cast.mas.hand.nudge"])
S("24.03", "24", "[PF]", "FALLAWAY", 30, change="REFRAME", beats="2 beats", v1=[], lock=["24.01a"],
  why="Draft 3's [M] (Mas lit from below, JOIN on the laptop) becomes a [PF]: no Vegas medium plate, no Mas medium rig, no face relight.",
  room="vegas-suite (held behind the window, stepped down: suitePortraitBg)",
  characters=["MAS (left window, x12 y24): reading his screen, 3/4, eyes level; the one-pixel smile. The FACE IS NOT RELIT."],
  action=["Beat 1: MAS, left, reading his screen. The suite behind his window steps down (resolve() with the key near zero, or one family step: <= 2 beats) until the laptop's glow is the only light left in the room.",
          "Beat 2: the WHOLE-FRAME FLASH-PRINT to blueprint rides this shot's last beat (f15-29): a palette remap, no redraw. Hard cut on the downbeat into 25.01."],
  style="[BASE] → [BLUEPRINT] on the last beat", switches=["f15-29: {type:'palette', to: BLUEPRINT_PRINT} (whole frame): 'the frame turns to blueprint' (kits-fx: print, not trace, pending the showrunner call)"],
  sfx=["NEW blueprint_print (a soft paper-thump on the beat)", "room_tone (stepping down with the light)"], music="A stab on beat 2; THE PLAN motif enters on the cut.",
  notes=["Lighting note steps the ROOM down; the portrait is never relit unless W0 rules Mas's portrait a resolve() material (ruling 7 default: room only)."],
  events=3, prod_mode="I", assets=["cast.mas.portrait", "room.vegas-suite", "kit.portrait-layout", "kit.fallaway", "kit.blueprint"])

# ============================================================================================================ SC 25
for i, n in enumerate(["25.01", "25.02", "25.03", "25.04", "25.05", "25.06", "25.07"]):
    S(n, "25", "[GFX]", "BLUEPRINT", V1S[n]["frames"], base=n, beats=V1S[n]["grid"], lines=[L(x) for x in V1S[n]["lines"]] and [L("a4-25-01", at=10), L("a4-25-02", at=50)] if n == "25.05" else [],
      why="Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock)." if n != "25.07" else "Unchanged; the tear parts onto the laptop insert of 25.08 (kits-fx).",
      assets=["kit.blueprint"])
S("25.08", "25", "[ECU]", "INSERT-HANDS", 60, base="25.08", change="CHANGED", beats="1 bar",
  why="JOIN's first read: his hand on the trackpad; the laptop beside it reads BOARD · VIDEO CALL · JOIN, the pointer on JOIN. He clicks.",
  room="vegas-suite · laptop insert (drawLaptopInsert screen:'join'), his hand on the trackpad below the screen",
  characters=["MAS: hand only on the trackpad (cast.mas.hand.click: rest -> press, 1 frame, 1 px)"],
  action=["The tear's halves part onto the laptop, BASE again: `BOARD · VIDEO CALL · JOIN`, the pointer on JOIN (his laptop's pointer, not the lit cursor).",
          "His hand rests on the trackpad (beats 1-2). Beat 3: he clicks (the hand's press drawing + JOIN's pressed drawing, 1 frame, 1 px). Cut on the downbeat into the call."],
  text=[T("BOARD · VIDEO CALL · JOIN", "ui")],
  notes=["Movement 2 rule: after THE PLAN's tear the first shot is his hands: this [ECU] is it.",
         "The lit cursor is the player's and stays dark all act (pov-and-framing §1.6)."],
  events=3, assets=["room.vegas-suite", "cast.mas.hand.click", "kit.blueprint"])

# ============================================================================================================ SC 26 · 21 bars
S("26.01", "26", "[POV]", "UI-TILE-GRID", 60, base="26.01", change="RETIME", beats="P1 bar 1",
  why="3 bars -> 1 bar (draft 3's phrase grid). The Wi-Fi egg is now the freeze-framer's proof that his feed froze.",
  action=["Downbeat: his laptop, full-bleed. The five-tile grid connects (MAS with Vegas neon behind him; ALYI a reflection in a doorway's glass; NELEH, a paper glowing, footnotes orbiting; MADA arms folded, perfectly still, spinner turning; THE QUIET VOTE · camera off).",
          "Beat 2: Mas's tile opens in 3 held steps. As it connects, the four small vote icons on the board's tiles are ALREADY flipped (F18).",
          "Egg (zero read load, the tell for freeze-framers): in the screen's corner the hotel Wi-Fi shows one bar of four."],
  gags=["The votes were flipped before he arrived (F18).", "THE QUIET VOTE: camera off.", "Egg: 1 bar of Wi-Fi (why his feed will freeze in 26.08)."],
  events=7, assets=["kit.call-grid", "cast.calltile", "cast.mas.tile", "cast.alyi.portrait", "cast.neleh.tile", "cast.mada.tile", "cast.quietvote"])
S("26.02", "26", "CARD", "CARD", 60, base="26.02", rides="UI-TILE-GRID", beats="P1 bar 2", why="Unchanged (rides the live grid; logs as the [POV] it rides).",
  assets=["kit.cards", "cast.neleh.portrait"])
S("26.02a", "26", "[PF]", "FALLAWAY", 60, change="CHANGED", beats="P1 bar 3", v1=[],
  why="Lighting note on the ROOM: the suite steps down until only the Strip's neon and the laptop's glow are left. No face relight (was 'lit from below').",
  room="vegas-suite (held behind the window, stepped down to the Strip's neon + the laptop glow)",
  characters=["MAS (left): reads the icons, one pupil step per tile (4 eye darts, 1 px each, on the beat); nothing else moves"],
  action=["Beats 1-3: he reads the four flipped icons, one pupil step per tile.", "Beat 4: HOLD 1 BEAT."],
  sfx=["room_tone (the suite: fan, the Strip, the truck far below)"], music="Phrase 1 closes under him.",
  notes=["Tells are only drawn at [PF] or closer (§4.3 rule 1)."], events=5, prod_mode="I",
  assets=["cast.mas.portrait", "room.vegas-suite", "kit.portrait-layout", "kit.fallaway"])
S("26.03", "26", "[POV]", "UI-TILE-GRID", 60, base="26.03", change="RETIME", beats="P1 bar 4", why="90 f -> 1 bar (phrase grid).",
  room="the board call (his laptop, full-bleed)", music="Phrase 1 ends on the dots.")
S("26.04", "26", "[POV]", "UI-TILE-GRID", 60, base="26.04", change="CHANGED", beats="P2 bar 1",
  why="Only the dialog now (the arrow's walk and the click are their own bars, 26.04b/c).",
  room="the board call (his laptop, full-bleed)",
  action=["Over Mas's tile a dialog pops up (3 held steps): drawn exactly like the 1993 one but in full colour, the same plain single-rule frame, no icons: `OK` · `Cancel`. Cancel is NOT greyed out.",
          "Under it the suite goes on: the laptop fan, the Strip, the truck somewhere below."],
  sfx=["NEW dialog_pop_chip (three uneven square-wave notes on F, never a held tone, never an OS alert: X3)", "room_tone (fan, Strip, truck)"],
  music="Phrase 2 begins.", events=3)
S("26.04a", "26", "[ECU]", "INSERT-HANDS", 60, change="NEW", beats="P2 bar 2", v1=[], why="Draft 3's eyes strip (the hands/eyes ECU kit).",
  room="Mas's eyes strip (480x64, letterboxed; the room area above and below is black)", fnote="eyes strip (the ECU kit's eyes; counts as faces+hands)",
  characters=["MAS: the eyes strip only; pupils at position 0, then ONE pixel toward the dialog (position -1) on beat 3"],
  action=["The eyes strip, letterboxed. Beats 1-2: still. Beat 3: his pupils move one pixel toward the dialog. Nothing else on him moves."],
  sfx=["room_tone"], music="Held.", notes=["He doesn't blink (§3.6)."], events=2, prod_mode="M", assets=["cast.mas.eyes"])
S("26.04b", "26", "[POV]", "UI-TILE-GRID", 60, change="NEW", beats="P2 bar 3", v1=["26.04"], lock=["26.04b"],
  why="Split from board 1's 26.04: the arrow's walk gets its own bar.",
  room="the board call (his laptop, full-bleed)",
  action=["An arrow pointer steps in from the board's tiles, in whole pixels, one tile at a time (one held position per beat: NELEH's tile, MADA's, ALYI's, the dialog's edge).",
          "THE UNLIT ARROW: it belongs to whoever is trying to fire him, never to him and never to the player (the same arrow returns in 30.24)."],
  sfx=["room_tone (the suite goes on)"], events=4, prod_mode="M", assets=["kit.call-grid", "kit.dialog-1993"])
S("26.04c", "26", "[POV]", "UI-TILE-GRID", 60, change="NEW", beats="P2 bar 4", v1=["26.04"], lock=["26.04c"],
  why="Split from board 1's 26.04: the arrow reaches Cancel; the click lands on the NEXT downbeat (26.05 f0), so the drop-out runs exactly 2½ bars to the buzz.",
  room="the board call (his laptop, full-bleed)",
  action=["The arrow crosses into the dialog and settles on Cancel (beats 1-2), holds on it (beats 3-4). The world goes on underneath.",
          "The CLICK is on the downbeat that ends this bar: Cancel's pressed drawing is 26.05's first 2 frames."],
  sfx=["room_tone (the suite goes on, to the last frame)"], music="Phrase 2 resolves on the click (26.05 f0).", events=2, prod_mode="M",
  assets=["kit.call-grid", "kit.dialog-1993"])
S("26.05", "26", "[POV]", "UI-TILE-GRID", 60, base="26.05", change="RETIME", beats="P3 bar 1", drop="start",
  why="4 bars -> 1 bar; the rail moved to the [CU]. SOUND: DROP-OUT [D6] starts on this shot's first frame (the click).",
  room="the board call · G5 → G4",
  action=["f0-1: *Click.* Cancel's pressed drawing. DROP-OUT [D6]: the fan, the Strip and the truck stop together; digital silence (no tone, no breath, no heartbeat: X3).",
          "f2: the dialog is gone. Mas's tile drops out of the grid like a puzzle piece: four drawings, straight down, a whole-pixel fall (f2 / 6 / 10 / 14), greying (CALL_GREY on the tile only). As it falls it comes apart into tokens: GLYPH dissolve, 20 frames (use 2 of 2).",
          "Beats 3-4: the four remaining tiles slide together to close the gap, in held whole-pixel steps (the G4 grid of pass one). Silent."],
  text=[], sfx=["dialog_ok_click (REUSE, retuned) on f0", "glyph_dissolve (REUSE)", "(then SILENCE: the drop-out)"],
  music="Out on the click. The drop-out is the laugh.", events=6, prod_mode="S-rep",
  assets=["kit.call-grid", "cast.mas.tile", "kit.dialog-1993"])
S("26.05a", "26", "[CU]", "CLOSE-UP", 90, change="RETIME", beats="P3 bars 2-3½ (1½ bars)", v1=[], lock=["26.05a"],
  why="2 bars -> 1½ bars and SILENT: the V.O. is cut from sc 26. A 2-beat deadpan, then `+1 FIRING` types on on beat 3 and holds to the cut.",
  rail="+1 FIRING", rail_at=30, room="Mas CU over the Strip's neon (drawMasCU backdrop 'strip')",
  characters=["MAS: full frame, the FIRST of the episode's two close-ups; ONE drawing (three-quarter, the one-pixel smile, no mouths). Nothing on it changes."],
  action=["Beats 1-2: HOLD 2 BEATS in the silence (the house deadpan).",
          "Beat 3 (f30): still in the silence, the rail types on `+1 FIRING` (meter: the firing tally). It holds with the face to the cut (4 beats)."],
  text=[T("+1 FIRING", "rail", tag="meter: the firing tally")], sfx=["(silence: the drop-out continues)"], music="None.",
  notes=["No V.O. here: sc 26 carries the candor card, so no caught device (§2.4); the drop-out plays clean (§5.5).",
         "The episode's one long hold stays the calm-off (30.17): this face holds only the 2-beat deadpan before the rail lands."],
  events=2, prod_mode="I", assets=["cast.mas.cu", "room.vegas-suite", "kit.cards"])
S("26.06", "26", "[ECU]", "INSERT-HANDS", 150, base="26.06", change="REFRAME", beats="P3 last 1½ bars + P4 bar 1 (2½ bars)", drop="end",
  why="The phone ON THE DESK framed with the laptop's corner, the call's mic icon lit; the buzz brings the room back (2 beats earlier than draft 3); the thumb taps at once: the HOVER IS CUT.",
  room="vegas-suite · desk insert (drawDeskInsert {phoneLit, mic:true}: the phone face-up, the laptop's corner at the left with the lit mic)",
  characters=["MAS: hand only (cast.mas.hand.tap-strip): at rest beside the phone, then the thumb on the middle super"],
  action=["f0 (P3 bar 2½): the phone BUZZES and the room's sound comes back with it (the drop-out ends here: 150 f after the click). The suggested-replies strip lights: `[super] [super] [super]`. In the laptop's corner the call's microphone icon is still lit.",
          "f90 (P4 downbeat): his thumb taps the middle super AT ONCE, with no hover (G04: he always takes the offer). The strip's middle chip presses (1 frame, 1 px).",
          "To the cut: his tile is gone; his microphone isn't. The icon in the laptop's corner stays lit (the slip belongs to the interface: nobody muted him)."],
  text=[T("[super] [super] [super]", "ui")], sfx=["NEW phone_buzz (f0)", "room_tone (back on the buzz: fan, Strip)", "NEW phone_wake", "NEW text_tick (the tap)"],
  music="Phrase 4 enters on the tap, thin.", gags=["The suggested-replies runner (G04): all three say super.", "The lit mic is the interface's fault (§3.7)."],
  notes=["No hover (pov-changes §4): he takes the strip's offer at once."], events=4, prod_mode="M",
  assets=["room.vegas-suite", "cast.mas.hand.tap-strip", "prop.phone", "kit.post-ui"])
S("26.07", "26", "[P]", "PORTRAIT", 60, base="26.07", beats="P4 bar 2", lines=[L("a4-26-01", at=8)], why="Unchanged. No music under the line.",
  room="vegas-suite (held) behind the window")
S("26.08", "26", "[POV]", "UI-TILE-GRID", 60, base="26.08", change="CHANGED", beats="P4 bar 3",
  why="Board it to read as FOUR STUNNED PEOPLE on first viewing: hold the whole grid still, video noise included (it's his feed that froze; pass one shows nobody looked up).",
  room="the board call · G4 (frozen)",
  action=["The grid as HIS screen shows it: a listener's hold on four held faces. Neleh's footnotes stop mid-orbit. Mada's spinner stops. The black tile does nothing.",
          "Everything in the frame holds, the video noise included (the 1-bar Wi-Fi is still in the corner)."],
  gags=["They all heard 'super.' (his read; 27.01 is the truth)."])
S("26.09", "26", "[W]", "WIDE", 60, base="26.09", beats="P4 bar 4", why="Unchanged: the first wide since sc 24.")
S("26.10", "26", "[GFX]", "CARD", 120, base="26.10", beats="card 2", why="Unchanged. No V.O., no device, no Mas tell, no music within a bar.")
S("26.11", "26", "[POV]", "UI-TILE-GRID", 30, base="26.11", change="RETIME", beats="P5 beats 1-2",
  why="F1.2 is 3 bars (6 s of flashback + 1.5 s of render front): the front in takes 2 beats.",
  room="the board call · G4, the greyed plate falling in the corner",
  action=["Back on the G4 grid. In the bottom-left corner the greyed, emptied plate of Mas's tile is still falling (4 px per held step).",
          "f6: it becomes the leading edge of a render front that sweeps the frame from that corner to sixteen colours with GIF-era dither (front 18 f)."],
  switches=["f6-29: {type:'front', from:'BASE', to:'EARLYWEB16', t0: 6, frames: 18, dir: from the plate}"])
S("26.12", "26", "[W]", "WIDE", 120, base="26.12", change="RETIME", beats="P5 bars 1½-3½ (2 bars)", rail="2005–08 · TPOOL · (REPORTED)", rail_at=0,
  why="2 bars + 1 beat -> 2 bars (F1.2 4 -> 3 bars).",
  action=["F1.2 · 2005–08 · TPOOL [EARLY-WEB16]. A frosted-glass boardroom door with two shadows behind it, leaning together. No sound, no whisper, and NO POV RIM: (REPORTED) material belongs to the show, never to his account.",
          "The shadows change drawing once (bar 2)."],
  notes=["Flashback budget: F1.2 ≈ 6.5 s in EARLY-WEB16 (26.11 f6 → 26.13 f18) of the episode's ≤ 20 s."])
S("26.13", "26", "[ECU]", "INSERT-PROP", 30, base="26.13", change="RETIME", beats="P5 last 2 beats",
  why="3 beats -> 2 beats. A prop close (no hand): not a face or a hand.",
  switches=["{type:'front', from:'EARLYWEB16', to:'BASE', t0: 0, frames: 18}; the 'to' frame is 26A.01's first frame"])

# ============================================================================================================ SC 26A · 8 bars
S("26A.01", "26A", "[ECU]", "INSERT-HANDS", 135, base="26A.01", change="CHANGED", beats="2 bars + 1 beat",
  rail="NOV 17, 2023 · THAT NIGHT", rail_at=0, lines=[L("a4-26a-vo1", at=60)],
  why="Bar 2 now ends with his thumb at rest on mark 3 ONLY (marks 1 and 2 are (REPORTED) and never touched). V.O. D2 'i don't keep score.' on bar 2.",
  room="darkroom · desk close (drawDarkDesk {tally 2 → 3, carve 0 → 1}; the cyan key)",
  characters=["MAS: hand only. Bar 1: the carve with the pen's steel clip (cast.mas.hand.carve). Bar 2: the brush, then the thumb at rest on mark 3 (cast.mas.hand.thumb-mark3, one drawing moved in whole pixels)"],
  action=["Bar 1: the desk under the cyan key, close: the two faint marks, the old ones we couldn't quite read. With the steel clip of the pen he pocketed from the MACROSOFT check he carves a third mark beside them, clean: 4 growth drawings on the beat, shavings curling (meter: the tally, G01).",
          "Bar 2: he brushes the shavings away with the side of his hand (2 drawings, beats 1-2), and his thumb comes to rest on the new mark, and only the new mark (beat 3; held). Marks 1 and 2 are never touched.",
          "V.O. D2 on bar 2's downbeat (a full bar clear of F1.2's (REPORTED) rail). Its text types at x 12, baseline y 198: frame the desk so y 182-203 is the desk's dark near edge, never the cyan key.",
          "Beat 9 (the extra beat): hold on the thumb at rest."],
  sfx=["NEW tally_carve (4 dry scratches, one per beat)", "(bar 2) a soft brush of shavings"],
  music="A low held tone (one instrument) under the V.O.; nothing swells.",
  gags=["Meter: the firing tally, mark 3 (G01). The pocketed pen pays off.", "'i don't keep score.' over the tally he just carved (D2)."],
  notes=["Guardrail: his hand never touches marks 1 and 2 (the TPOOL ousters, (REPORTED)), in any episode.",
         "Ruling 2 default: 'score'. Under the fallback 'i don't keep things.' the 26A.02 iris steps to the pocketed pen instead; lengths unchanged."],
  events=8, assets=["room.darkroom", "cast.mas.hand.carve", "cast.mas.hand.thumb-mark3", "prop.pen", "prop.tally", "kit.vo-line"])
S("26A.02", "26A", "[2S]", "TWO-SHOT", 45, base="26A.02", change="CHANGED", beats="3 beats",
  why="The Orb COUNTS: its iris steps along the tally, mark 1 → 2 → 3, one per beat, and stops on his thumb. (Board 1 framed this as a room-plate crop; it is now a true [2S] on the medium rigs.)",
  room="darkroom · desk medium plate (NEW: the cyan cone, the rack's LEDs, the desk edge)",
  characters=["MAS (left third, 3/4, medium rig arm 'tally'): his thumb on mark 3; face still", "THE ORB (right, medium: a sphere and an iris): iris to mark 1 (beat 1), mark 2 (beat 2), mark 3 (beat 3), stopping on his thumb"],
  action=["Mas and the Orb in the cyan cone. His thumb stays on mark 3.",
          "The Orb's iris steps along the tally, one mark per beat, 1, 2, 3, and stops on his thumb. The Orb is counting. (Its look is the only thing that ever touches marks 1 and 2.)"],
  sfx=["orb_servo ×3 (REUSE, tiny)", "server_hum (REUSE)"], music="The held tone ends.",
  notes=["The buffer before the real post (26A.03).", "Ruling 2 fallback: the iris goes to the pocketed pen instead; same length."],
  events=4, prod_mode="I", assets=["room.darkroom.medium", "cast.mas.medium", "cast.orb.medium", "prop.tally"])
S("26A.03", "26A", "[POV]", "UI-TILE-GRID", 120, base="26A.03", change="RETIME", beats="2 bars", posts=[PO("a4-26a-01", at=7, hold=113)],
  why="165 f -> 2 bars (3.1). The typing is a burst; the post lands complete at f7 and holds 113 f (its read, exactly).",
  room="his phone, full-bleed (the post composer)",
  action=["His phone, full-bleed. He types in source casing (a burst of typing_soft, f0-6), and the post lands complete in its own UI (f7), which stamps it `9:32 PM PT`. Held to the cut (113 f, its read)."],
  lines=[])
S("26A.04", "26A", "[ECU]", "INSERT-PROP", 60, base="26A.04", change="RETIME", beats="1 bar",
  why="1 beat -> 1 bar (3.1). A prop insert without a hand: not a face or a hand.",
  action=["The Senate wallet, open on the desk, with its one card: `HEALTH INSURANCE`. A moth flies out (3 drawings on 2s, beats 2-3). Hold."],
  text=[T("HEALTH INSURANCE", "prop", must=True)])
S("26A.05", "26A", "[PF]", "FALLAWAY", 90, change="CHANGED", beats="1½ bars", v1=[], lock=["26A.05"], lines=[L("a4-26a-vo2", at=15)],
  why="V.O. D4 now 'the meeting ended early.' (the door into the exit). Framing note: the V.O. band y 182-203 sits on hoodie shadow.",
  room="darkroom (held behind the window, stepped down to the cyan key and the rack's LEDs)",
  characters=["MAS (left window): 3/4, still; framed so the hoodie's shadow fills y 182-203 under the window"],
  action=["Beat 1: MAS, left. The room steps down behind him until only the cyan key and the rack's LEDs are left.",
          "Beat 2 (f15): V.O. D4. Its text types at x 12, baseline y 198, on the hoodie's shadow (never on the cyan key). Hold to the cut."],
  sfx=["server_hum (REUSE, low)"], music="One instrument or none.",
  notes=["D4: the exit's first shot catches it (27.01: the call going on without him); the Orb's rewinding… answers his face, not the line."],
  events=2, prod_mode="I", assets=["cast.mas.portrait", "room.darkroom", "kit.portrait-layout", "kit.fallaway", "kit.vo-line"])
S("26A.06", "26A", "[P]", "PORTRAIT", 30, change="NEW", beats="½ bar", v1=[], lock=["26A.06"], rail="NOV 17 · EARLIER · THE BOARD'S SIDE", rail_at=15,
  why="(Draft 3's shot, never boarded.) The Orb reads him, not the line; the rail names the side 1 beat after the toast. EXIT.",
  room="darkroom (held) behind the window", characters=["THE ORB (right window): iris lifts from the desk to his face (2 held drawings)"],
  action=["Beat 1: THE ORB, right. Its iris lifts from the desk to his face. Toast: `rewinding…`.",
          "Beat 2 (f15): RAIL: `NOV 17 · EARLIER · THE BOARD'S SIDE` types on; it carries into 27.01. EXIT."],
  text=[T("rewinding…", "toast"), T("NOV 17 · EARLIER · THE BOARD'S SIDE", "rail", tag="the exit's side label")],
  sfx=["orb_servo (REUSE)", "NEW toast_pop (soft)", "NEW rewind_chirp (a short reversed chip gliss; the Orb's)"],
  notes=["The Orb never reacts to the V.O.: it looks at his face.", "`…` is not in the engine font: the post-ui/rail kit hand-pixels it (kits-fx §2)."],
  events=3, prod_mode="I", assets=["cast.orb.portrait", "room.darkroom", "kit.portrait-layout", "kit.cards"])

# ============================================================================================================ SC 27 · PASS ONE: THE BOARD'S SIDE
S("27.01", "27", "[SCR]", "UI-TILE-GRID", 90, change="CHANGED", beats="1 bar + 2 beats", v1=[], lock=["27.01"], lines=[L("a4-27-00", at=19)],
  why="The caption is GONE: HOLD 1 BEAT on the call going on (NELEH turns a page), then his voice through their laptop speaker; the dialogue box types `super.` with NO portrait; nobody looks up.",
  room="the board's call grid on a laptop, bezel in frame (the world's view) · G4",
  characters=["NELEH tile: turns a page (2 drawings, beat 1), then reads on", "MADA tile: spinner keeps turning", "ALYI tile: his reflection looks at his own doorway", "THE QUIET VOTE: black"],
  action=["Noon. Four tiles; the gap where his tile was has already closed. The call goes on. HOLD 1 BEAT on it going on: NELEH turns a page.",
          "f15: out of the laptop's small speaker, tinny, comes his voice. The dialogue box (top centre, NO portrait window, no name plate) types `super.` at his rate.",
          "Nobody looks up. MADA's spinner keeps turning. ALYI's reflection looks at his own doorway. THE QUIET VOTE's tile stays black. The left portrait window stays EMPTY."],
  text=[T("super.", "dialogue-box")], sfx=["call room tone (continues under the line)", "a4-27-00 (a4-26-01 through the laptop-speaker filter)"],
  music="Pass one's pulse enters AFTER the line: brisk, procedural.",
  gags=["'super.' heard from the other side: nobody looks up. (The board's pass is the true one: on his side his feed froze on one bar of Wi-Fi.)"],
  notes=["This is the catch for 'the meeting ended early.' (it ended early for him).", "Pass one: no V.O., no devices, no Mas portrait window; he appears as posts, the security tile and this voice (§6.2)."],
  events=4, prod_mode="M", assets=["kit.call-grid", "cast.neleh.tile", "cast.mada.tile", "cast.alyi.portrait", "cast.quietvote", "kit.dialogue-box-noportrait", "mix.laptop-speaker"])
S("27.01a", "27", "[SCR]", "UI-TILE-GRID", base="27.01", change="CARRY", beats=None, posts=[PO("a4-27-01", at=30)], lock=["27.01a"],
  why="Board 1's 27.01 (the toast and Gerg's post), unchanged.", lines=[],
  text=[T("GERG MOCKBRAN has left.", "toast"), T("…I quit.", "post", tag="[V · NOV 17, 2023] re-fetch casing")],
  room="the board's call grid (bezel)")
S("27.02", "27", "[SCR]", "UI-TILE-GRID", 60, base="27.02", why="Unchanged.", room="the board's call grid (bezel)")
S("27.03", "27", "[P]", "PORTRAIT", 30, base="27.03", change="REFRAME", beats="2 beats",
  why="Board 1's tile in Mas's old slot becomes RIMA's right-hand [P] under a hard circular spotlight (3.1: everyone speaks from the right).",
  room="board grid (held) behind the window", characters=["RIMA (right window): under a hard circular spotlight (it snaps on in 3 held drawings), jacket perfect, smoothing it (2 drawings)"],
  action=["RIMA TAMURI, right, under a hard circular spotlight: jacket perfect, smoothing it. The left window stays empty."],
  prod_mode="I", assets=["cast.rima.portrait", "kit.portrait-layout", "kit.call-grid"])
S("27.04", "27", "CARD", "CARD", 60, base="27.04", rides="PORTRAIT", change="CHANGED", why="The card now rides RIMA's live right-hand window (board 1: the live grid); logs as the [P] it rides.",
  room="RIMA name card over her live window (the grid held behind it)", action=["1-beat freeze print (2-tone; Mas is not in frame), then the card rides her live window for the rest of the bar."])
S("27.05", "27", "[P]", "PORTRAIT", base="27.05", change="SPLIT", lines=[L("a4-27-02")], lead=P_LEAD, lock=["27.05"],
  why="Board 1's two-portrait volley becomes single right-hand windows (3.1: the left window stays empty in pass one).",
  room="board grid (held) behind the window", characters=["RIMA (right): pleasant, composed; spotlight on her"], action=["RIMA, right: 'I'll hold it together.'"],
  assets=["cast.rima.portrait", "kit.portrait-layout"], events=2)
S("27.05a", "27", "[P]", "PORTRAIT", base="27.05", change="SPLIT", lines=[L("a4-27-03")], lead=P_LEAD, lock=["27.05a"],
  why="Split from board 1's 27.05.", room="board grid (held) behind the window", characters=["NELEH (right): brows 'query'; footnotes orbit"],
  action=["NELEH, right: 'For how long?'"], gags=["'For how long?' is echoed later by TTEMME ('Chat… for how long?')."],
  assets=["cast.neleh.portrait", "kit.portrait-layout"], events=2)
S("27.05b", "27", "[P]", "PORTRAIT", base="27.05", change="SPLIT", lines=[L("a4-27-04")], lead=P_LEAD, punch=True, lock=["27.05b"],
  why="Split from board 1's 27.05.", room="board grid (held) behind the window", characters=["RIMA (right): pleasant; smile on 'soon.'; on her last word the spotlight drifts off her in 3 held positions"],
  action=["RIMA, right (pleasant): 'We'll share more soon.'"], gags=[], assets=["cast.rima.portrait", "kit.portrait-layout"], events=3)
S("27.05c", "27", "[P]", "PORTRAIT", 15, change="NEW", beats="1 beat", v1=[], lock=[],
  why="NEW (3.1): NELEH listening, brow `query`, after 'We'll share more soon.' (the listener; her real face builds here).",
  room="board grid (held) behind the window", characters=["NELEH (right): listening, one brow up (brow 'query', the existing portrait)"],
  action=["NELEH, right, listening, one brow up. 1 beat."], sfx=["call room tone"], events=1, prod_mode="I",
  assets=["cast.neleh.portrait", "kit.portrait-layout"])
S("27.06", "27", "[W]", "WIDE", base="27.06", change="RETAG", lines=[L("a4-27-05", at=15)], lock=["27.06"],
  why="Draft 3's [M] over the tiled heads is a [W]: a tighter plate of the bullpen, the SAME drawing (drawBullpen 'allhands').",
  room="bullpen · all-hands (door open) · a tighter [W] plate (same drawing)", fnote="a tighter plate of a room is [W] (pov-changes: tags)",
  assets=["room.bullpen", "cast.alyi.door"])
S("27.07", "27", "[P]", "PORTRAIT", base="27.07", change="CHANGED", lines=[L("a4-27-06")], lead=P_LEAD, punch=True,
  why="ALYI now speaks from the RIGHT window (board 1 proposed the board on the left).",
  characters=["ALYI (right): portrait with a door jamb drawn over the window's inner third (he is always cut by a frame); eyes open, slow; mouth on the viseme set"],
  room="bullpen all-hands (held) behind the window")
S("27.07a", "27", "[W]", "WIDE", 15, change="NEW", beats="1 beat", v1=["27.08"], lock=[],
  why="NEW (3.1): in the crowd, the one hand is still up (the same all-hands plate, handsUp).",
  room="bullpen · all-hands (the same tighter [W] plate)", characters=["TILED EMPLOYEES: held; the one hand still up"],
  action=["In the crowd, the one hand is still up. 1 beat."], sfx=["room_tone (crowd hush)"], gags=["The hand is still up."], events=1, prod_mode="I",
  assets=["room.bullpen"])
S("27.08", "27", "[P]", "PORTRAIT", 60, change="REFRAME", beats="1 bar", v1=["27.08"], lock=["27.08"],
  why="Draft 3's [M] exit becomes a [P]: ALYI steps back out of his own door-cut window in whole-pixel steps; the window holds empty 1 beat, then closes (no Alyi medium rig).",
  room="bullpen all-hands (held) behind the window", characters=["ALYI (right window): steps back out of his window, 4 px per held step on 2s, until the door frame has all of him"],
  action=["Beats 1-2: ALYI steps back out of his own window, one whole-pixel step at a time, until the door frame has all of him.",
          "Beat 3: the window holds EMPTY for 1 beat.", "Beat 4: the window closes in 3 held steps."],
  sfx=["(a single chair creak somewhere in the crowd)"], gags=["He leaves his own close-up."], events=4, prod_mode="I",
  assets=["cast.alyi.portrait", "cast.alyi.window-exit", "kit.portrait-layout"])
S("27.09", "27", "[SCR]", "UI-TILE-GRID", 120, base="27.09", rail="NOV 18", rail_at=0, why="Unchanged (prod mode S-rep: the falling-stack kit is built).", room="the board's call grid (bezel) · G5 with Rima", prod_mode="S-rep")
S("27.10", "27", "[SCR]", "UI-TILE-GRID", base="27.10", posts=[PO("a4-27-07", at=15)], min_frames=2 * BAR + BEAT, lines=[],
  why="Unchanged (Mas's post as a notification band across the hearts; S-rep: the kit is built).", room="the board's call grid (bezel) · buried in hearts", prod_mode="S-rep")
S("27.11", "27", "[2S]", "TWO-SHOT", 60, base="27.11", change="REFRAME", beats="1 bar",
  why="The committee as a [2S] on the medium rigs (NELEH, MADA) over the boardroom-table medium plate (board 1: a room wide).",
  room="boardroom · table medium plate (NEW; night, the committee after the vote)",
  characters=["NELEH (medium rig, standing, marker in hand)", "MADA (medium rig, seated, arms folded, spinner turning)",
              "ALYI: a reflection in the dark window behind them (alyiReflection)", "THE QUIET VOTE: a laptop on a chair, black tile"],
  action=["INT. NOPEAI BOARDROOM — NIGHT. The committee after the vote: NELEH, standing with a marker, and MADA, seated, spinner turning, the blueprint from THE PLAN spread on the table between them, step 4 still a blank line.",
          "ALYI a reflection in the dark window; a laptop on a chair shows the black tile. Beat 3: every phone on the table buzzes at once (2 drawings, 1 px)."],
  assets=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium", "cast.alyi.portrait", "cast.quietvote", "kit.blueprint"])
for sid, lid, who, lk, pun, ch in [("27.12", "a4-27-08", "NELEH (right): precise, brows level", "27.12", False, "SPLIT"),
                                    ("27.12a", "a4-27-09", "ALYI (right, the REFLECTION portrait: stepped −2, a mullion across him): slow; his pauses are the joke", "27.12a", False, "SPLIT"),
                                    ("27.12b", "a4-27-10", "NELEH (right): brows 'query'", "27.12b", False, "SPLIT"),
                                    ("27.12c", "a4-27-11", "ALYI (right, reflection): slow", "27.12c", False, "SPLIT")]:
    S(sid, "27", "[P]", "PORTRAIT", base="27.12", change=ch, lines=[L(lid)], lead=P_LEAD, punch=pun, lock=[lk],
      why="Board 1's two-portrait volley as single right-hand windows, cut on each line.", room="boardroom (held) behind the window",
      characters=[who], action=[f"{who.split(' (')[0]}, right: '{LINES[lid]['text']}'"], gags=["'Footnote three.' (her catchphrase)."] if sid == "27.12" else [],
      assets=["cast.neleh.portrait" if "NELEH" in who else "cast.alyi.portrait", "kit.portrait-layout"], events=2)
S("27.12d", "27", "[P]", "PORTRAIT", 15, change="NEW", beats="1 beat", v1=[], lock=[],
  why="NEW (3.1): NELEH listening, brow `query`, after ALYI's 'The company will tell us.'",
  room="boardroom (held) behind the window", characters=["NELEH (right): listening, one brow up (brow 'query')"],
  action=["NELEH, right, listening, one brow up. 1 beat."], sfx=["(the room's hush)"], events=1, prod_mode="I", assets=["cast.neleh.portrait", "kit.portrait-layout"])
S("27.13", "27", "[2S]", "TWO-SHOT", 60, base="27.13", change="REFRAME", beats="1 bar", why="The phones walk in the [2S] (board 1: a room wide).",
  room="boardroom · table medium plate", characters=["NELEH and MADA (medium rigs), still"],
  assets=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium"])
S("27.14", "27", "[P]", "PORTRAIT", base="27.14", change="SPLIT", lines=[L("a4-27-12")], lead=P_LEAD, why="Split: NELEH, right.",
  room="boardroom (held) behind the window", characters=["NELEH (right)"], action=["NELEH, right: 'The company is calling us.'"], notes=[],
  assets=["cast.neleh.portrait", "kit.portrait-layout"], events=2)
S("27.14a", "27", "[P]", "PORTRAIT", base="27.14", change="SPLIT", lines=[L("a4-27-13")], lead=P_LEAD, punch=True, why="Split: ALYI (reflection), right.",
  room="boardroom (held) behind the window", characters=["ALYI (right, reflection)"], action=["ALYI (reflection), right: 'That is the company telling us.'"],
  notes=[], assets=["cast.alyi.portrait", "kit.portrait-layout"], events=2)
S("27.14b", "27", "[2S]", "TWO-SHOT", 30, change="REFRAME", beats="2 beats", v1=["27.14", "27.15"], lock=["27.14b"],
  why="The reflection's flicker and the still black tile in the [2S] (board 1: end of 27.14 + the laptop insert 27.15).",
  room="boardroom · table medium plate", characters=["NELEH and MADA (medium rigs)", "ALYI (reflection in the window): there / not there for 2 frames, then steady"],
  action=["In the window, Alyi's reflection flickers, there and not there, for two frames (drawAlyiWindow flicker 'gone'), and then steadies. The black tile on the laptop doesn't move."],
  gags=["The stillest actor in the episode (THE QUIET VOTE)."], events=2, prod_mode="I",
  assets=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium", "cast.alyi.portrait", "cast.quietvote"])
S("27.15", "27", "[PF]", "FALLAWAY", 45, change="NEW", beats="3 beats", v1=[], lock=["27.15"],
  why="(Draft 3's shot, never boarded.) NELEH's real face: the boardroom stepped down behind her; she looks at the blank line; HOLD 1 BEAT. It isn't a joke.",
  room="boardroom (held behind the window, stepped down)", characters=["NELEH (right window): looks DOWN at the blank line (her eye dart), then holds"],
  action=["NELEH, right, the boardroom stepped down behind her. She looks at the blank line (beats 1-2). HOLD 1 BEAT. It isn't a joke (her real face)."],
  sfx=["(room tone only)"], music="Nothing.", events=2, prod_mode="I", assets=["cast.neleh.portrait", "kit.portrait-layout", "kit.fallaway"])
S("27.16", "27", "[ECU]", "INSERT-PROP", 60, base="27.16", change="CHANGED", hand=True, beats="1 bar",
  why="She writes `?` ONLY (no illegible word). The blueprint prop's step 4 carries `?` from here on.",
  room="boardroom · table insert (drawTableInsert focus 'blueprint', the `?`-only state)", characters=["NELEH: her hand with the marker (a prop insert: a hand and an object)"],
  action=["She uncaps the marker (2 drawings, beat 1) and writes one mark on the blank line: `?` (3 drawings, beats 2-3). Hold 1 beat."],
  text=[T("?", "prop", must=False)], sfx=["NEW marker_uncap", "NEW marker_squeak (short)"],
  notes=["The `?` stays on the sheet: 27.35's 'blank but for her question mark'."], events=3,
  assets=["room.boardroom", "cast.neleh.hand-marker", "kit.blueprint"])
S("27.17", "27", "[W]", "WIDE", 60, base="27.17", why="Unchanged: the boardroom's one wide in this block. CUT on the first ring.", room="boardroom · night · wide",
  assets=["room.boardroom", "cast.neleh.room", "cast.mada.room", "cast.quietvote", "cast.alyi.portrait"])
S("27.18", "27", "[ECU]", "INSERT-PROP", 45, base="27.18", change="REFRAME", beats="3 beats", rail="(REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER", rail_at=0,
  why="The lighthouse opens CLOSE (a home room): a prop insert of the phone ringing on a paper-buried desk, the small throne on its handset (board 1: a room wide).",
  room="lighthouse · desk insert (NEW plate: paper-buried desk top) + drawThroneHandset 'lg' on its cradle",
  characters=[], action=["f0 (the cut on the first ring): a phone rings on a desk buried in paper; attached to its handset, somehow, is a small throne (the handset hops 2 drawings per ring).",
                         "The rail types on at f0 and persists into 27.19."],
  text=[T("(REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER", "rail", tag="[V as reported]")],
  sfx=["NEW phone_ring_chip (starts on the cut)", "NEW lamp_hum (lighthouse)"], events=3, prod_mode="M",
  assets=["room.lighthouse.desk-insert", "prop.throne-handset"])
S("27.19", "27", "[P]", "PORTRAIT", base="27.19", change="CHANGED", lines=[L("a4-27-14", at=30)],
  why="MARIO's [P] (existing portrait, marioMouth) now carries the look at the throne and the finger rise (draft 3's [M] business).",
  room="lighthouse (held) behind the window: brick-red, the lamp turning in the window behind him",
  characters=["MARIO (right): looks at the throne (beat 1), his finger rises (finger 0 → 1 → 2 on 2s, beat 2), earnest"],
  action=["MARIO, right. He looks at the throne. His finger rises. f30: 'I've written up some thoughts.'"],
  assets=["cast.mario.portrait", "room.lighthouse", "kit.portrait-layout"], events=4)
S("27.20", "27", "[P2]", "PORTRAIT", 30, base="27.20", change="REFRAME", beats="2 beats",
  why="MARIO and ADELINA as a [P2], she on the RIGHT (script). She takes the phone out of his hand.",
  room="lighthouse (held) behind both windows", characters=["MARIO (left window, silent): the phone leaves his hand", "ADELINA (right window): takes it, brisk and warm (phone to her ear, throne on)"],
  action=["Both windows up. The phone leaves Mario's window at its inner edge; it arrives at Adelina's ear in hers (adelinaPortrait phone:'ear', throne:true)."],
  notes=["BOARD QUERY (default: as scripted): the only pass-one frame with a left window in use, and Mario is silent in it. Everyone still SPEAKS from the right."],
  events=2, prod_mode="I", assets=["cast.mario.portrait", "cast.adelina.portrait", "kit.portrait-layout", "room.lighthouse"])
S("27.21", "27", "CARD", "CARD", 60, base="27.21", rides="PORTRAIT", why="Unchanged; rides the live [P2] (logs as the portrait it rides).")
S("27.22", "27", "[P2]", "PORTRAIT", base="27.22", change="REFRAME", lines=[L("a4-27-15")], lead=P_LEAD, punch=True, why="Board 1's single [P] is the scripted [P2]: ADELINA right (speaking), MARIO left (silent).",
  room="lighthouse (held) behind both windows", assets=["cast.adelina.portrait", "cast.mario.portrait", "kit.portrait-layout"])
S("27.23", "27", "[ECU]", "INSERT-PROP", 30, base="27.23", change="REFRAME", beats="2 beats",
  why="Draft 3's [M] click is a prop insert (drawThroneHandset throne:false) on the same desk-insert plate.",
  room="lighthouse · desk insert (the handset back in its cradle)", assets=["room.lighthouse.desk-insert", "prop.throne-handset"])
S("27.24", "27", "[P]", "PORTRAIT", base="27.24", change="REFRAME", lines=[L("a4-27-16", at=30)], punch=True, v1=["27.24", "27.25"], lock=["27.24", "27.25"],
  why="The second phone gets MARIO's own [P]: the lighthouse window in the room behind his portrait window, the two rent meters spinning there, legible (board 1: a room wide + a [P]).",
  room="lighthouse (held) behind the window; the rent meters spin in the lighthouse window, OUTSIDE the right window's footprint",
  characters=["MARIO (right): answers the second phone immediately (phone to ear), finger half-raised, worried and quick"],
  action=["f0: the second phone on the desk rings. Behind his window, through the lighthouse window, two rent meters spin (drum counters, 3 drawings): `NOZAMA · UP TO $4B` and `ELGOOG · UP TO $2B`.",
          "f20: Mario answers this one immediately. f30: 'Hi. Yes. We're very worried. How much?' (no breath between 'worried' and 'How much?')."],
  text=[T("NOZAMA · UP TO $4B", "prop", tag="[V · SEP 25, 2023]"), T("ELGOOG · UP TO $2B", "prop", tag="[V · OCT 27, 2023]")],
  sfx=["NEW phone_ring_chip (a different pitch)", "NEW meter_whir", "voice: mario"],
  gags=["Misanthropic roast (camp 2): warns of race dynamics while banking the rent.", "Fairness floor: Mario roasted."],
  notes=["CHECK (rooms-b): the meters must sit clear of the right window (x 356-468, y 24-160) to read behind his [P].", "7:00 proof cut: this shot (script §8)."],
  events=5, assets=["cast.mario.portrait", "room.lighthouse", "prop.rent-meters", "kit.portrait-layout"])
S("27.26", "27", "[SCR]", "UI-TILE-GRID", base="27.26", posts=[PO("a4-27-17", at=30, hold=90)], min_frames=2 * BAR, rail="NOV 19", rail_at=0, lines=[],
  why="Unchanged (Mas as public record: a small figure on a security-camera tile).", room="lobby · security cam (drawLobbyCam, no clock)")
S("27.27", "27", "[W]", "WIDE", 60, base="27.27", change="RETIME", beats="1 bar", rail="NOV 19 · NIGHT", rail_at=0, why="45 f -> 1 bar (3.1 prints it).",
  room="boardroom · Nov 19 · wide")
S("27.28", "27", "CARD", "CARD", 60, base="27.28", rides="WIDE", why="Unchanged; rides the live [W] (logs as WIDE).")
S("27.29", "27", "[P]", "PORTRAIT", base="27.29", lines=[L("a4-27-18")], lead=P_LEAD, why="Carried.", room="boardroom · Nov 19 (held) behind the window")
S("27.30", "27", "[ECU]", "INSERT-PROP", 45, base="27.30", change="REFRAME", beats="3 beats",
  why="Draft 3's [M] flip is a prop insert (drawHourglass lg, hourglassFlipAt) on the boardroom table insert (focus 'prop'). No hand drawn: not a face or a hand.",
  room="boardroom · table insert (TABLE_INSERT.prop)")
S("27.31", "27", "[P]", "PORTRAIT", base="27.31", lines=[L("a4-27-19")], lead=P_LEAD, punch=True, why="Carried.", room="boardroom · Nov 19 (held) behind the window")
S("27.32", "27", "[2S]", "TWO-SHOT", 75, base="27.32", change="REFRAME", beats="1 bar + 1 beat", rail="NOV 19 · 11:53 PM PT", rail_at=0,
  why="NELEH and MADA in the [2S], the wall behind them (board 1: a room wide).",
  room="boardroom · table medium plate, the slate wall + TASYA's door behind them",
  characters=["NELEH and MADA (medium rigs), turning to the wall", "TASYA: appears in the new door (the room sprite at medium distance, arm 'sign')"],
  action=["The boardroom wall behind them changes colour by one palette step, to MACROSOFT slate blue (wall mask remap). A door appears in it that wasn't there before (tasyaDoor 1 → 2), and opens (3 → 4), one state a beat. TASYA stands in it."],
  assets=["room.boardroom.medium", "room.boardroom", "cast.neleh.medium", "cast.mada.medium", "cast.tasya.room", "prop.arrow-sign"])
S("27.33", "27", "[P]", "PORTRAIT", base="27.33", lines=[L("a4-27-20")], lead=6, why="Carried (the post read aloud with pleasure).", room="boardroom · slate (held) behind the window")
S("27.35", "27", "[2S]", "TWO-SHOT", 30, base="27.35", change="CHANGED", beats="2 beats",
  why="Tasya's real line lands straight on this [2S] (the desks insert is cut). Step 4 is blank BUT FOR HER QUESTION MARK.",
  room="boardroom · table medium plate", characters=["NELEH and MADA (medium rigs): look down at the blueprint"],
  action=["NELEH and MADA look down at the blueprint. Step 4 is blank but for her question mark."],
  notes=["Every real line lands on a listening face within 1 beat (§4.3 rule 5): the [2S] is it."], events=2, prod_mode="I",
  assets=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium", "kit.blueprint"])
S("27.36", "27", "[2S]", "TWO-SHOT", base="27.36", change="REFRAME", lines=[L("a4-27-21", at=3), L("a4-27-22", gap=GAP)], punch=True,
  why="The button as a [2S] on the medium rigs (board 1: two portraits).", room="boardroom · table medium plate",
  characters=["NELEH (medium rig, left of frame): brows 'query'", "MADA (medium rig, right): the smallest pause before his answer"],
  action=["NELEH: 'Step four?' MADA: 'Good question.'"],
  notes=["Punch: a full beat after Mada's line, then the act-out sting on the downbeat."], prod_mode="I",
  assets=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium"])
# ============================================================================================================ SC 28
S("28.01", "28", "[GFX]", "CARD", 75, base="28.01", beats="1 bar + 1 beat", side="MAS", why="No picture change. The door back: pass two's rail names his side.",
  notes=["Internal act-out (T). In a told-twice both passes carry a side label: 29.00's rail ends `· HIS SIDE`."])

# ============================================================================================================ SC 29 · PASS TWO: HIS SIDE
S("29.00", "29", "[ECU]", "INSERT-PROP", 30, change="NEW", beats="2 beats", v1=[], lock=["29.00"], rail="NOV 20, 2023 · ~2:06 AM PT · HIS SIDE", rail_at=0,
  why="(Draft 3's shot, never boarded.) THE HOME SHOT: the glass on the dark-room desk. The rail names HIS SIDE (board call: it types on over the home shot, so the [2S]'s V.O. has the frame to itself).",
  room="darkroom · desk close (drawDarkDesk {tally:3, glass:true, lanyard:true})",
  action=["The glass on the dark-room desk, its water line one flat row of pixels. Nothing moves.",
          "f0: the rail types on `NOV 20, 2023 · ~2:06 AM PT · HIS SIDE` (36 glyphs, 50 f to read: it finishes reading at 29.01 f20) and persists."],
  text=[T("NOV 20, 2023 · ~2:06 AM PT · HIS SIDE", "rail", tag="[V][ID] zone to confirm · the side label")],
  sfx=["room_tone (the dark room)", "server_hum (REUSE)"], music="Pass two's pulse: the same figure as pass one, from the other side (warmer, slower).",
  gags=["We come back through the glass (§6.3)."],
  notes=["Logged as a prop insert (no hand): the ECU kit's glass, not counted as a face or a hand (strict §4.2 logging).",
         "BOARD CALL vs the script: 3.1 prints the rail after the home shot; boarded ON it (f0) so the rail and the V.O. are not two must-reads at once (§5.2)."],
  events=1, prod_mode="M", assets=["room.darkroom", "prop.guest-lanyard", "prop.tally", "kit.cards"])
S("29.01", "29", "[2S]", "TWO-SHOT", 90, base="29.01", change="CHANGED", beats="1 bar + 2 beats (script: 1 bar)", lines=[L("a4-29-vo1", at=15)],
  why="+ the lanyard laid SQUARE beside the glass, and his hand rests on his phone. V.O. D5 'i put the phone down.'. +2 beats vs the script: the new read (est. 54 f) must end a beat before the hard cut (§5.1).",
  room="darkroom · desk medium plate (the cyan cone, the rack's LEDs; the board's four-tile grid small in the monitor's corner)",
  characters=["MAS (left third, 3/4, medium rig arm 'phone': his hand resting on the phone, face-down)", "THE ORB (medium): at his shoulder, iris on the phone"],
  action=["Mas at the desk, the Orb at his shoulder, the GUEST lanyard laid square beside the glass, three marks in the wood. His hand rests on his phone. In the monitor's corner, small, is the board's four-tile grid (the one we just watched from the other side).",
          "f15: V.O. D5. Its text types at x 12, baseline y 198, on the desk's dark near edge / his hoodie. It ends ≥ 1 beat before the cut."],
  text=[], sfx=["room_tone", "server_hum (REUSE)"], music="Pass two's pulse thins to one instrument under the V.O.",
  notes=["If the recorded read is ≤ 42 f, this shot returns to the script's 1 bar with the V.O. at f0 (the editor's call)."], events=2, prod_mode="I",
  assets=["room.darkroom.medium", "cast.mas.medium", "cast.orb.medium", "prop.guest-lanyard", "prop.tally", "cast.calltile", "kit.vo-line"])
S("29.01a", "29", "[ECU]", "INSERT-HANDS", 60, change="CHANGED", beats="1 bar", v1=[], lock=["29.01a"],
  why="[MAS'S VERSION]: a MATCHING FRAME of 29.03 (same size, same hand); the phone FACE-DOWN; NOTHING else in the frame moves (hold the rack's LEDs and the Orb's iris at the frame's edge); the keynote-reel piano; NO RIM; six fingers as an optional egg. HARD CUT on the downbeat.",
  room="darkroom · desk close (drawDarkDesk {phone:'down'}), the SAME framing as 29.03", fnote="[MAS'S VERSION] (D5): a script tag, never an on-screen label",
  characters=["MAS: hand only, resting on the face-down phone, calm: cast.mas.hand.six (six fingers; a five-finger copy exists for the G2 A/B)"],
  action=["His hand on the phone, the phone face-down on the desk. Nothing in the frame moves: not the rack's LEDs at the frame's edge, not the Orb's iris (the stillness flag freezes every other layer for the bar).",
          "Under it, a soft keynote-reel piano (an original cue; his brand). Egg for freeze-framers: the hand has six fingers. Nothing depends on counting them.",
          "HARD CUT on the downbeat; the piano stops mid-phrase."],
  switches=["kit.mas-version: stillness flag (every non-hand layer frozen at f0 for the bar); NO present-day rim; no palette switch"],
  sfx=["(room tone held too: the stillness is total)"], music="NEW keynote_reel_piano (1 bar, original, no borrowed melody), killed mid-phrase by the hard cut.",
  gags=["Too still to be true.", "Egg: six fingers (A/B at G2; ruling 3 default: keep as an egg)."],
  notes=["The correction must read on the matching-frame cut alone, without counting fingers (pov-changes §4).",
         "Ruling 3 fallback: if THE OUTSIDER marks '?', D5 is cut from the pilot: this shot and the V.O. go (−1 bar + the line), and 29.03 follows 29.01 directly."],
  events=2, prod_mode="M", assets=["room.darkroom", "cast.mas.hand.six", "kit.mas-version", "score.keynote-piano"])
S("29.03", "29", "[ECU]", "INSERT-HANDS", 120, base="29.03", change="REFRAME", beats="2 bars", posts=[PO("a4-29-01", at=0, hold=120)], v1=["29.02", "29.03"],
  why="The SAME FRAME as MAS'S VERSION, five fingers: the phone face-up and still on the desk, Rima's post legible on its screen the whole time (the full-bleed Rima [POV] is CUT into it). First Tick on the cut's downbeat; 8 identical posts, 8 taps on the beat. (Never 8 → 6: the writer.)",
  room="darkroom · desk close (drawDarkDesk + phone FACE-UP with a feed painter), the same framing as 29.01a",
  characters=["MAS: hand only (cast.mas.hand.heart-tap): five fingers, his thumb on the face-up phone"],
  action=["f0 (the cut's downbeat): his thumb taps a heart. *Tick.* On the phone's screen, a post from RIMA (avatar + name legible).",
          "The same post comes again from another avatar, word for word. *Tick.* Again. *Tick.* Eight identical posts stack up the feed, one per beat, the same words on the screen the whole time, and he hearts every one ON the beat, like a man playing a rhythm game he has already beaten."],
  text=[T("NopeAI is nothing without its people", "post", tag="[V · NOV 20, 2023, ~2:06 AM PT]"), T("RIMA TAMURI", "ui")],
  sfx=["NEW heart_tick ×8 (on the beat; the first on f0)"], music="The ticks ARE the rhythm; the score locks to them.",
  gags=["The rhythm game.", "'i put the phone down.': it is down. Face-up."],
  notes=["The reposting avatars are generic; handles are illegible glyph noise (private individuals).", "Rima's post needs 50 f; it is on screen 120 f."],
  events=10, prod_mode="M", assets=["room.darkroom", "cast.mas.hand.heart-tap", "prop.phone", "kit.post-ui"])
S("29.04", "29", "[2S]", "TWO-SHOT", 60, base="29.04", change="CHANGED", beats="1 bar",
  why="1 bar (was 2 beats): the iris follows the taps; on beat 3 it STEPS OFF THE PHONE ONTO THE GUEST LANYARD and holds. This bar is the clearance after the real post.",
  room="darkroom · desk medium plate", characters=["MAS (medium rig, arm 'phone'): still", "THE ORB (medium): iris on the phone (beats 1-2), then on the GUEST lanyard (beat 3), held"],
  action=["The Orb's iris has followed every tap. On the bar's third beat it steps off the phone and onto the `GUEST` lanyard beside the glass, and stays there."],
  sfx=["orb_servo (REUSE, one step)"], music="Out.", notes=["The Orb is on the lanyard BEFORE the V.O. (D3: it never hears the line)."],
  events=2, prod_mode="I", assets=["room.darkroom.medium", "cast.mas.medium", "cast.orb.medium", "prop.guest-lanyard"])
S("29.10", "29", "[P]", "PORTRAIT", change="REORDER", v1=["29.10"], lock=["29.10"], lines=[L("a4-29-vo2", at=0)], hold=BEAT, tail=0,
  why="The Orb's [P] now HOLDS ON THE LANYARD (it looked at the check) and comes BEFORE the letter. V.O. D3 'the badge was a joke.' plays over it, a bar clear of Rima's post; HOLD 1 BEAT after the line.",
  room="darkroom (held) behind the window; the left of frame is the dark room (the V.O. band on shadow)",
  characters=["THE ORB (right window): iris on the lanyard, held (it does not react to the line)"],
  action=["f0: THE ORB, right, still on the lanyard. V.O. D3 (text at x 12, baseline y 198, on the dark room's shadow).", "After the line: HOLD 1 BEAT."],
  text=[], sfx=["server_hum (low)"], music="Nothing.",
  gags=["The Orb is already looking at what his account just shrank."],
  notes=["§4.3 rule 5 does not bite: 'mostly.' is invented, and the V.O. is never heard in the world."], events=1, prod_mode="I",
  assets=["cast.orb.portrait", "room.darkroom", "kit.portrait-layout", "kit.vo-line"])
S("29.10a", "29", "[2S]", "TWO-SHOT", change="REORDER", v1=["29.10"], lock=["29.10a"], lines=[L("a4-29-03", at=6)], hold=BEAT,
  why="'mostly.' + HOLD 1 BEAT now comes BEFORE the letter (answers the Orb's look at the lanyard). Cut on the next downbeat to RAIL: THE LETTER.",
  room="darkroom · desk medium plate", characters=["MAS (medium rig, head 'front' toward the Orb): the one true word", "THE ORB (medium): on the lanyard"],
  action=["Mas, aloud, to the Orb: 'mostly.' HOLD 1 BEAT. Cut on the next downbeat."], sfx=["voice: mas-manalt (re-take recommended)"],
  gags=["The one true word (to the Orb)."], events=2, prod_mode="I",
  assets=["room.darkroom.medium", "cast.mas.medium", "cast.orb.medium", "prop.guest-lanyard"])
S("29.05", "29", "[POV]", "UI-TILE-GRID", 75, base="29.05", change="REORDER", beats="1 bar + 1 beat", rail="THE LETTER", rail_at=0,
  why="The letter now comes AFTER 'mostly.'.", room="the monitor, full-bleed: the counter")
S("29.06", "29", "[GFX]", "CARD", 180, base="29.06", change="REORDER", beats="3 bars", why="Moved with the letter.")
S("29.07", "29", "[POV]", "UI-TILE-GRID", 60, base="29.07", change="REFRAME", beats="1 bar",
  why="The signature list full-bleed on the monitor (board 1: a medium room crop with the Orb in it); the Orb's look is its own [P] (29.07a).",
  room="the monitor, full-bleed: the signature list", characters=[],
  action=["The letter's signature list, scrolling (whole-pixel). It stops for 2 beats on one name: `ALYI (REPORTED)`."],
  sfx=["NEW text_tick (the scroll)"], gags=[], events=3, prod_mode="M", assets=["kit.post-ui", "cast.calltile"])
S("29.07a", "29", "[P]", "PORTRAIT", 60, change="NEW", beats="1 bar", v1=["29.07"], lock=["29.07a"],
  why="(Draft 3's shot, never boarded.) The Orb's beat: iris to the name, to Alyi's thumbnail in the monitor's corner, back to the name. Chime.",
  room="darkroom (held) behind the window", characters=["THE ORB (right window): iris to the name, to Alyi's mini tile, back (3 held drawings, a servo each)"],
  action=["THE ORB, right. Its iris goes to the name, then to Alyi's thumbnail in the monitor's corner, then back to the name. *Chime.*"],
  sfx=["orb_servo ×3 (REUSE)", "the Orb's two-note chip chime on F (sc 18's)"], gags=["The Orb's double-take (no blink)."],
  notes=["No V.O. and no Mas tell on (REPORTED) material: this beat is the Orb's."], events=3, prod_mode="I",
  assets=["cast.orb.portrait", "room.darkroom", "kit.portrait-layout"])
S("29.08", "29", "[2S]", "TWO-SHOT", 90, base="29.08", change="CHANGED", beats="1 bar + 2 beats (script: 1 bar)", v1=["29.08", "29.09"],
  why="The check lands as PURE RECORD, followed directly by Gerg's tile (no V.O., no Mas look near it). Its front reads in the [2S] (the separate front insert is gone): +2 beats vs the script for the text's read time.",
  room="darkroom · desk medium plate (the rack's tray slot)", characters=["MAS and THE ORB (medium rigs): still; neither looks at it"],
  action=["DELIVERY. The server rack's slot whirs and ejects a giant check, tray-first, across the desk between them (4 held positions on 2s, landing by f24), front up at [2S] scale: `EVIRHT · TENDER OFFER @ ~$86B VALUATION`.",
          "Beat 4 (f45): stamped across the middle in red: `VOID IF CEO MISSING` (lands kicked 1 px). Hold to the cut. (Eggs on the back, zero read load, as board 1.)"],
  text=[T("EVIRHT · TENDER OFFER @ ~$86B VALUATION", "prop", tag="[V/K] re-verify before lock"), T("VOID IF CEO MISSING", "stamp", tag="[INVENTED] prop"),
        T("SUPERHOST. RETURNS KEYS IN 5 DAYS. · ADMIT ONE · NOPEAI LP · 2019", "prop", must=False, tag="eggs")],
  sfx=["NEW rack_tray_whir", "paper_whip (REUSE)", "rubber_stamp_C (REUSE)"], gags=["The money chorus: the check that only clears with him."],
  notes=["Pure record: nothing of his (no line, no look, no hand) within a bar of it (pov-changes §4). It is also the buffer after ALYI (REPORTED).",
         "The check's front must be legible at [2S] scale (≈ 190 px of 5-px type): prop.check-evirht is drawn for this size."],
  events=4, prod_mode="I", assets=["room.darkroom.medium", "cast.mas.medium", "cast.orb.medium", "prop.check-evirht"])
S("29.11", "29", "[POV]", "UI-TILE-GRID", base="29.11", change="REFRAME", lines=[L("a4-29-04", at=8)], face_frames="all", lock=["29.11"],
  why="Gerg's video tile full-bleed on the monitor, big enough to act in (board 1: the right window in video-tile chrome). A tile ≥ half the frame counts as a face.",
  room="the monitor, full-bleed: Gerg's video tile", characters=["GERG (video tile, ≥ half frame): laptop open, typing, the green glow under his chin"],
  action=["A video tile opens on the monitor (3 held steps), big enough to act in: GERG, laptop open, typing. He is on the monitor, not in the room: 'One sec. Compiling.'"],
  assets=["cast.gerg.portrait", "cast.calltile"], events=3)
S("29.11a", "29", "[P]", "PORTRAIT", base="29.11", change="SPLIT", lines=[L("a4-29-05")], lead=P_LEAD, lock=["29.11a"],
  why="Split: MAS, left.", room="darkroom (held) behind the window", characters=["MAS (left)"], action=["MAS, left: 'what are you building?'"],
  assets=["cast.mas.portrait", "kit.portrait-layout"], events=2)
S("29.11b", "29", "[POV]", "UI-TILE-GRID", base="29.11", change="SPLIT", lines=[L("a4-29-06")], lead=3, face_frames="all", lock=["29.11b"],
  why="Split: Gerg's tile.", room="the monitor, full-bleed: Gerg's video tile", characters=["GERG (video tile): typing"],
  action=["Gerg's tile: 'The company. Again. Just in case.'"], assets=["cast.gerg.portrait", "cast.calltile"], events=2)
S("29.12q", "29", "[PF]", "FALLAWAY", 30, change="CHANGED", beats="QUIET BEAT 1 of 3 · 2 beats", v1=[], lock=["29.12q"], q=True,
  why="The quiet beat is now an EXCHANGED LOOK (PF 2 · glance 1 · PF 1 = 4 beats, −1 beat overall): he watches.",
  room="darkroom (fallen away: the monitor's green + his cyan only)", characters=["MAS (left): watches Gerg type (eyes on the monitor)"],
  action=["QUIET BEAT (4 beats). MAS, left. The room falls away until only the monitor's green and his cyan are left. He watches Gerg type. Keycaps click."],
  sfx=["typing_soft (REUSE: Gerg's keycaps through the monitor)", "room_tone"], music="None (no line, no gag, no sting).",
  notes=["Logged q. Released by a laugh within 1 bar: Tasya's door on 'asked' (29.12)."], events=1, prod_mode="I",
  assets=["cast.mas.portrait", "room.darkroom", "kit.portrait-layout", "kit.fallaway"])
S("29.11c", "29", "[POV]", "UI-TILE-GRID", 15, change="REORDER", beats="QUIET BEAT 2 of 3 · 1 beat", v1=[], lock=["29.11c"], q=True, face_frames="all",
  why="Gerg's glance moves INSIDE the quiet beat: his tile fills the frame at medium tile scale; he glances up into his camera, at Mas (his real face).",
  room="Gerg's tile at medium tile scale (full-bleed)", characters=["GERG (medium tile, fills the frame): glances up into his camera (expression swap), 1 beat"],
  action=["Gerg's tile fills the frame at medium tile scale. He glances up into his camera, at Mas. (His real face.)"],
  sfx=["(the typing stops for the beat)"], events=1, prod_mode="M", assets=["cast.gerg.medium-tile", "cast.calltile"])
S("29.12r", "29", "[PF]", "FALLAWAY", 15, change="NEW", beats="QUIET BEAT 3 of 3 · 1 beat", v1=[], lock=[], q=True,
  why="NEW (3.1): MAS, left, LOOKING BACK; on the monitor behind his window, Gerg is typing again.",
  room="darkroom (fallen away) behind the window; the monitor (with Gerg's tile, typing) visible beyond it",
  characters=["MAS (left): looking back (eyes to camera-right, the monitor)"],
  action=["MAS, left, looking back. On the monitor behind his window, Gerg is typing again."], sfx=["typing_soft (resumes)"], events=1, prod_mode="I",
  assets=["cast.mas.portrait", "room.darkroom", "kit.portrait-layout", "kit.fallaway", "cast.gerg.portrait"])
S("29.12", "29", "[2S]", "TWO-SHOT", base="29.12", change="REFRAME", lines=[L("a4-29-vo3", at=0), L("a4-29-07", at=90)], tail=8,
  why="Board 1's dark-room wide is a [2S] that holds the whole back wall (so no wide is needed). Out of the quiet beat: V.O. D8. RETIME: the door's FIRST held step lands on 'asked' (three held steps); Tasya ≥ 1 beat after the line; no music under either.",
  room="darkroom · desk medium plate framed to hold the back wall (drawDarkRoom blueDoor 1 → 3, key in the lock)",
  characters=["MAS and THE ORB (medium rigs): still", "the slate-blue door: steps up out of the shadow, 3 held steps, a key already in its lock"],
  action=["f0: V.O. D8 (text at x 12, baseline y 198, on the desk's shadow).",
          "f53 (on 'asked'): a slate-blue door takes its FIRST held step up out of the shadow in the back wall; steps 2 and 3 at f68 and f83. A key is already in its lock. It's the door the board watched open at 11:53, now in his wall.",
          "f90 (≥ 1 beat after the line): TASYA's voice comes warmly from the other side: 'Everyone is welcome.' Cut at once on its end."],
  sfx=["NEW door_appear ×3 (wall_step on each held step)", "voice: tasya (O.S., through a door)"], music="None under either line.",
  gags=["The landlord's door is in every room; it steps up on 'asked' (the laugh that releases the quiet beat)."],
  notes=["X1: nobody enters Mas's room. The door stays shut; the key stays in the lock.", "D8 plants 'to be asked' for Ep12; its payoff shot is 30.20a."],
  events=5, prod_mode="I", assets=["room.darkroom.medium", "room.darkroom", "cast.mas.medium", "cast.orb.medium", "kit.vo-line"])
S("29.13", "29", "[P]", "PORTRAIT", base="29.13", change="RETIME", lines=[L("a4-29-08")], lead=P_LEAD, punch=True, lock=["29.13"], gags=["Arc step: 'leave it open.'"],
  why="'leave it open.' AT ONCE on 'Everyone is welcome.' (the three eyelines are CUT: at a real event his surface stays blank).",
  room="darkroom (held, the blue door behind) behind the window", characters=["MAS (left): level; no eye darts"],
  action=["MAS, left, at once: 'leave it open.'"], sfx=["voice: mas-manalt"],
  notes=["No eyelines before it (pov-changes §4). From here the tiles fall his way, and he has stopped narrating."], events=2)
for sid, fr, bt, why, ff in [("29.14", 240, "S3 phrase 1", "Unchanged.", None), ("29.15", 120, "S3 phrase 2a", "Unchanged; ALYI's tile fills half the frame for the 1 beat it resists (logged as a face for that beat).", 15),
                              ("29.16", 120, "S3 phrase 2b", "Unchanged.", None), ("29.17", 180, "S3 phrase 3a", "4 bars -> 3 bars: the phrase's last bar is the [PF] 29.17a.", None)]:
    S(sid, "29", "[POV]", "UI-TILE-GRID", fr, base=sid, change="CARRY" if sid != "29.17" else "RETIME", beats=bt, why=why, face_frames=ff,
      notes=["S3: 16 bars on the falling-stack kit, full-bleed on his monitor: we watch it with him."] if sid == "29.14" else V1S[sid]["notes"],
      lines=[L("a4-29-09", at=20)] if sid == "29.16" else [], room=V1S[sid]["room"].replace("the board grid", "the monitor, full-bleed: the board grid"))
S("29.17a", "29", "[PF]", "FALLAWAY", 60, change="CHANGED", beats="S3 phrase 3b (bar 4)", v1=[], lock=["29.17a"],
  why="(Draft 3's shot, never boarded.) The S3's cut to a face; lighting note on the ROOM: it steps down until the monitor's 745 faces are its only light (no face relight).",
  room="darkroom (held behind the window, stepped down to the wall of faces)", characters=["MAS (left): watching the one gap"],
  action=["MAS, left, the room stepped down until the 745 small faces on the monitor are its only light, watching the one gap."],
  sfx=["NEW tile_clack (thinning)"], notes=["Movement 4: the S3 cuts to a face at least every 8 bars (this one, and 29.15's half-frame beat)."],
  events=1, prod_mode="I", assets=["cast.mas.portrait", "room.darkroom", "kit.portrait-layout", "kit.fallaway"])
S("29.18", "29", "[POV]", "UI-TILE-GRID", 120, base="29.18", change="RETIME", beats="S3 phrase 4a (2 bars)", face_frames=15,
  why="MADA is held half-frame for 1 BEAT (was 2): the press runs a beat longer; the card lands on the next downbeat (the phrase stays 4 bars).",
  action=["PHRASE 4, bars 1-2. In the gap is MADA's tile: arms folded, spinner turning, wedged in. Every tile around him presses (1-px nudges toward him on each beat). He does not move.",
          "Bar 2, beat 4 (f105): the frame holds on him, HALF-FRAME, for 1 beat (his real face; the first time Mas has watched someone else be as still as he is)."],
  room="the monitor, full-bleed: the gap")
S("29.19", "29", "CARD", "CARD", 60, base="29.19", rides="UI-TILE-GRID", beats="S3 phrase 4b", why="Lands on the next downbeat after the 1-beat hold. No line: the stat is the joke.")
S("29.20", "29", "[POV]", "UI-TILE-GRID", 60, base="29.20", beats="S3 phrase 4c", why="Unchanged.", room="the monitor, full-bleed: the gap")

# ============================================================================================================ SC 30 · THE RETURN
S("30.01", "30", "[P2]", "PORTRAIT", 240, change="REFRAME", beats="4 bars", v1=["30.01", "30.02", "30.03"], lock=["30.01", "30.02", "30.03"],
  rail="NOV 20, 2023", rail_at=0, lines=[L("a4-30-01", at=15)],
  why="ONE [P2]: MAS left at his end desk; ALYI right, the door frame cutting his window. The [M] and the thumb-hearting [ECU] are CUT (−6 beats vs draft 3). Three hearts rise out of Mas's window OFF the beat; the violin stops dead on the first. HOLD 2 BEATS in room tone (ruling 6 default).",
  room="bullpen · back wall (held) behind both windows (drawBullpen door 'crack', iou:true)",
  characters=["MAS (left window, x12 y24): at his end desk; his face does not change", "ALYI (right window): in the gap of the conference-room door, the frame cutting his window; reads his post; then looks UP at the hearts (expression swap)"],
  action=["f0: both windows up. The first frame in the act that holds Mas and the man who fired him. MUSIC: one sad violin, played straight, UNDER THE POST ONLY.",
          "f15: ALYI reads his post from the doorway (a small post pop-up in source casing beside his window).",
          "f144 / f156 / f171 (at the post's own pace, OFF the grid, uneven): three red hearts rise out of Mas's window [V: he replied with three hearts]. The violin stops dead on the first (f144). They cross the gap and hang at the edge of Alyi's window (by ~f188). Mas's face doesn't change.",
          "f190: Alyi looks up at them (expression swap). He doesn't step out. HOLD 2 BEATS, room tone only (f190-219; his real face).",
          "f220: the yellowed note taped to the door frame at his shoulder flutters: `IOU: 20% COMPUTE` (2 drawings). Cut at f240."],
  text=[T("NOV 20, 2023", "rail"), T("I deeply regret my participation in the board's actions.", "post", must=False, tag="[V · NOV 20, 2023] (read aloud)"),
        T("IOU: 20% COMPUTE", "prop", must=False, tag="egg · [V] Jul 5, 2023 pledge")],
  sfx=["voice: alyi (post, read from the doorway; hall on a send)", "heart_gliss ×3 (REUSE: at the hearts' own pace, OFF the grid)", "room_tone (the 2-beat hold)", "paper_flutter (REUSE)"],
  music="Violin under the post only; hard stop on the first heart.",
  gags=["Three hearts [V], his face unchanged.", "Egg: the IOU (flutters off in Ep2)."],
  notes=["His real act is never staged as a tell: the hearts rise at their own pace, never on the beat (§3.7).",
         "Ruling 6: if the MADA card misses its laugh at the read, the hold drops to 1 beat (−15 f)."],
  events=8, prod_mode="I", assets=["cast.mas.portrait", "cast.alyi.portrait", "cast.alyi.swap-up", "room.bullpen", "kit.portrait-layout", "kit.falling-stack", "kit.post-ui", "score.violin"])
S("30.04", "30", "[W]", "WIDE", 45, base="30.04", beats="3 beats", why="Unchanged.")
for sid, seg, txt, ff in [("30.05", (0, 33), '"We are below them,', 33), ("30.06", (35, 60), "above them,", 25), ("30.07", (63, 88), 'around them."', 25)]:
    S(sid, "30", "[W]", "WIDE", 120, base=sid, beats="S2 2 bars", rail="NOV 20, 2023 · RECONSTRUCTED" if sid == "30.05" else None, rail_at=0,
      lines=[dict(L("a4-30-02", at=20, seg=seg), text=txt)], face_frames=ff,
      why="Unchanged (S2 remap). TASYA's window open, right: logged [P] only while his line types (§4.2).", fnote="[W] with TASYA's [P] window open (right)",
      room=V1S[sid]["room"] + " · TASYA's window right")
S("30.08", "30", "[PF]", "FALLAWAY", 120, base="30.08", change="RETAG", beats="S2 bars 7-8", lines=[L("a4-30-03", at=20), L("a4-30-04", at=56)],
  why="Board 1's [P] is the [PF] 3.1 prints: the all-slate bullpen stepped down behind him; the 'looking down' expression swap.",
  room="bullpen (all slate, held, stepped down) behind the window", characters=["MAS (left): looks DOWN at the floor (cast.mas.swap-down); then 'hi.'"],
  assets=["cast.mas.portrait", "cast.mas.swap-down", "room.bullpen", "kit.portrait-layout", "kit.fallaway"])
S("30.09", "30", "[M]", "MEDIUM", 45, base="30.09", change="REFRAME", beats="3 beats", rail="NOV 21, 2023 · ~10 PM PT", rail_at=0,
  why="MADA's [M] (Mada rig, boardroom-table medium plate): perfectly still in the only chair that isn't burning; nobody has mentioned the fires.",
  room="boardroom · table medium plate (fires)", characters=["MADA (medium rig, seated, arms folded, spinner turning, perfectly still)"],
  action=["INT. NOPEAI BOARDROOM — NIGHT. MADA, seated, perfectly still, in the only chair that isn't burning. Around him small cartoon fires are already burning: one on the table, one on a chair, one on a nameplate (3-drawing loops on 2s). Nobody has mentioned them."],
  assets=["room.boardroom.medium", "cast.mada.medium", "prop.fires"])
S("30.10", "30", "[W]", "WIDE", 45, base="30.10", change="CHANGED", beats="3 beats",
  why="The boardroom's ONE wide: the door bangs open and TERB walks in (terbWalkAt), his helmet popping on at the door (no Terb rig).",
  room="boardroom · fires · wide", action=["The door bangs open (SHAKE_DOOR on the room layer, never the UI; hallway flash ≤ 1 frame). TERB walks in (terbWalkAt, 4 drawings), the red extinguisher held like a briefcase. At the door, a fire marshal's helmet pops on (1 drawing)."],
  assets=["room.boardroom", "cast.terb.room", "prop.extinguisher", "cast.mada.room", "prop.fires"])
S("30.11", "30", "CARD", "CARD", 90, base="30.11", rides="WIDE", beats="1 bar + 2 beats", change="CHANGED",
  why="The [W] HOLDS under the full freeze: Mas walks past in colour (drawMasStand arm 'reach') and pulls the pin (pin:true → false). Logs as the [W] it rides.",
  characters=["TERB: card portrait", "MAS: room sprite in colour through the freeze (masWalkAt, then arm 'reach', then 'pocket')"],
  assets=["kit.cards", "cast.terb.portrait", "cast.mas.stand", "room.boardroom", "prop.extinguisher"])
S("30.12", "30", "[ECU]", "INSERT-HANDS", 30, base="30.12", beats="2 beats", why="Unchanged (drawPinTag; business 2 of 2). The freeze releases on the cut.",
  characters=["MAS: his fingers with the pin (terb.ts drawExtinguisherInsert / drawPinTag)"], assets=["cast.mas.hand.pin", "prop.extinguisher"])
S("30.13", "30", "[P]", "PORTRAIT", base="30.13", change="REFRAME", lines=[L("a4-30-05"), L("a4-30-06", at=75)], punch=True, v1=["30.13"], lock=["30.13", "30.13a"],
  why="'…Ah.' is in TERB's [P] (draft 3's [M] is gone): behind his window, in the room, everyone looks around at room scale. One window held through both lines.",
  room="boardroom (live, fires) behind the window",
  characters=["TERB (right): helmet on; eyes L / R on the look-around; brows up on '…Ah.'", "the room behind the window: every sprite turns its head (one head-turn drawing each, f60)"],
  action=["TERB, right: 'Which room is on fire?'", "f60: behind his window, everyone in the room looks around, as if seeing the fires for the first time.", "f75: '…Ah.'"],
  assets=["cast.terb.portrait", "room.boardroom", "kit.portrait-layout", "prop.fires"])
S("30.14", "30", "[2S]", "TWO-SHOT", base="30.14", change="REFRAME", lines=[L("a4-30-07", at=45)], tail=8,
  why="THE CALM-OFF as a [2S] (medium rigs Mas + Mada over the boardroom-table plate): all the chaos happens BEHIND them. W0 calibration trio.",
  room="boardroom · table medium plate (calm-off framing: Mas left, Mada right, across the table)",
  characters=["MAS (medium rig, flip: facing camera-right toward Mada, arm 'clasp'): still", "MADA (medium rig): still, spinner turning",
              "TERB (room sprite, behind them): sprays the chair fire (spray + 3-drawing cone)"],
  action=["MAS, left, and MADA, right, across the table. Neither moves.",
          "Behind them: Terb sprays the chair fire and the extinguisher works (because the pin is out). Keycaps bounce off the table. Somewhere inside the wall, a key ring jangles.",
          "f45: TERB (O.S.): 'Terms?'"],
  assets=["room.boardroom.medium", "cast.mas.medium", "cast.mada.medium", "cast.terb.room", "prop.extinguisher", "prop.fires", "cast.gerg.keycaps"])
S("30.15", "30", "[P]", "PORTRAIT", base="30.15", lines=[L("a4-30-08", at=BEAT + P_LEAD)], why="Carried (HOLD 1 BEAT, then the canned answer).")
S("30.16", "30", "[P]", "PORTRAIT", base="30.16", lines=[L("a4-30-09", at=BEAT + P_LEAD)], punch=True, why="Carried (HOLD 1 BEAT; one beat late).")
S("30.17", "30", "[2S]", "TWO-SHOT", 120, base="30.17", change="REFRAME", beats="2 bars (the long hold 1 bar + the stamp 1 bar)", v1=["30.17", "30.18"], lock=["30.17", "30.18"],
  why="The episode's ONE LONG HOLD in the [2S] (two still men in one frame), and the stamp in the same frame (board 1: two portraits + a room wide).",
  room="boardroom · table medium plate (calm-off framing)", characters=["MAS and MADA (medium rigs): still; Mada's spinner stops (bar 1, beat 3), he nods once (1-px dip)", "TERB: his hand only, into frame (bar 2)"],
  action=["Bar 1: HOLD 1 BAR (the episode's one long hold): two still men in one frame. Mada's spinner stops. He nods once.",
          "Bar 2: Terb's hand comes into frame, stamps a term sheet without looking (2 drawings) and hands it to both of them at the same time (1 drawing: two hands take it)."],
  sfx=["(fires crackle, very low)", "rubber_stamp_C (REUSE, bar 2)", "paper_flutter (REUSE)"], music="Nothing.",
  gags=["The calm-off lands."], events=5, prod_mode="I",
  assets=["room.boardroom.medium", "cast.mas.medium", "cast.mada.medium", "cast.terb.room", "prop.term-sheet"])
S("30.20", "30", "[POV]", "UI-TILE-GRID", base="30.20", change="REFRAME", posts=[PO("a4-30-10", at=0)], lines=[],
  why="Mas's PHONE lights green, full-bleed (board 1: Gerg's laptop on the table).", room="his phone, full-bleed (green)",
  action=["Mas's phone lights green, and keycaps pop out of the bottom of the frame. Gerg's post (held ≥ 71 f)."],
  assets=["prop.phone", "kit.post-ui", "cast.gerg.keycaps"])
S("30.20a", "30", "[PF]", "FALLAWAY", 15, change="NEW", beats="1 beat", v1=[], lock=[],
  why="NEW (3.1): MAS, left, reading Gerg's post; his face doesn't change (the payoff shot of the D8 plant: Gerg came back without being asked).",
  room="boardroom (held behind the window, stepped down)", characters=["MAS (left): reading; face unchanged"],
  action=["MAS, left, reading it. His face doesn't change. 1 beat."], sfx=["(room tone; fires low)"], events=1, prod_mode="I",
  assets=["cast.mas.portrait", "room.boardroom", "kit.portrait-layout", "kit.fallaway"])
S("30.21", "30", "[ECU]", "INSERT-PROP", base="30.21", change="RETAG", posts=[PO("a4-30-11", at=15)], lines=[],
  why="The last grain as a prop insert (drawHourglass lg, sand:1 → 0; the shatter) on the table insert.", room="boardroom · table insert (TABLE_INSERT.prop)")
S("30.22", "30", "[W]", "WIDE", 60, base="30.22", change="CHANGED", beats="1 bar",
  why="The sign lights up; Mas is ALREADY at the reception desk, no lanyard, glass in hand. The 4-drawing walk-in goes.",
  characters=["MAS: room sprite standing at the reception desk (drawMasStand, no lanyard), his glass in his hand"],
  action=["INT. NOPEAI LOBBY — NIGHT. The wall sign that was blank in the check scene lights up (neon ignite, 3 held steps).", "Mas is already at the reception desk, without a lanyard, his glass in his hand."],
  sfx=["neon_ignite (REUSE)", "neon_buzz (REUSE)"], events=3, assets=["room.lobby", "cast.mas.stand", "prop.lobby-sign"])
S("30.23", "30", "[ECU]", "INSERT-PROP", 45, base="30.23", change="RETAG", hand=True, beats="3 beats", why="Untagged in draft 3: a prop insert (the maintenance hand and the box of zeros; board 1's 30.23).",
  room="lobby · floor insert (drawSignFloorInsert)", assets=["prop.zero-box", "cast.hands.worker", "room.lobby"])
S("30.24", "30", "[W]", "WIDE", 60, base="30.24", change="RETIME", beats="1 bar",
  why="2 bars -> 1 bar: Cancel greys over three held beats; THE UNLIT ARROW FROM SC 26 steps in ON SCREEN and clicks on beat 4: Bonk.",
  action=["Over the lobby, the 1993 dialog pops up once more, in full colour: `OK` · `Cancel`.",
          "Beats 1-3: Cancel greys out one dither step per beat (3 held steps).",
          "Beat 4: the arrow pointer from the call (the one that clicked Cancel at noon) steps in on screen and clicks it. *Bonk.*"],
  sfx=["NEW dialog_pop_chip", "alert_bonk (REUSE, on beat 4)"], gags=["Cancel greys out again: the 1993 dialog closes its loop."],
  assets=["kit.dialog-1993", "kit.call-grid", "room.lobby"])
S("30.25", "30", "[CU]", "CLOSE-UP", 30, change="REFRAME", beats="2 beats", v1=["30.25"], lock=["30.25"],
  why="SILENT: the same drawing as 26.05a, the lobby's tungsten BEHIND him (the light change lives in the backdrop unless W0 rules materials). 'okay.' moves to the hands.",
  room="Mas CU over the lobby (drawMasCU backdrop 'lobby')", characters=["MAS: full frame, the episode's second and last close-up; the same drawing as sc 26; nothing changes"],
  action=["MAS, full frame: the firing's drawing, silent like the first, with the lobby's tungsten behind him instead of the Strip's neon. 2 beats (the house deadpan)."],
  sfx=["room_tone (lobby)"], music="None.",
  notes=["Ruling 4 default: 2 [CU]s per episode. If G1 caps it at one, this becomes sc 26 phrase 1's [PF] framing, the light behind him cyan → tungsten; don't mix sizes."],
  events=1, prod_mode="I", assets=["cast.mas.cu", "room.lobby"])
S("30.26", "30", "[ECU]", "INSERT-HANDS", change="RETIME", beats="2 beats (script) → boarded 3 (the punch tail)", v1=[], lock=["30.26"], lines=[L("a4-30-12", at=4)], punch=True,
  why="2 beats (was 1), with 'okay.' OVER THE HANDS: he sets the glass down on the reception desk and nudges it one pixel true (the sc 24 ritual's bookend). The recorded line + the house punch tail need a 3rd beat.",
  room="lobby · reception desk insert (NEW small plate: the desk top under tungsten)", characters=["MAS: hand only (cast.mas.hand.nudge: the set-down, whose last frame is the nudge)"],
  action=["f0-3: his hand sets the glass down on the reception desk.", "f4: 'okay.' (off his face, over the hands; no lip-sync).", "f26: two fingers nudge it one pixel true. Hold to the cut."],
  sfx=["NEW glass_set_down", "voice: mas-manalt ('okay.', the same take)"], music="Act resolution (a small button after the line).",
  gags=["G02 bookend: he straightens a glass that didn't move."], events=2, prod_mode="M",
  assets=["room.lobby.reception-insert", "cast.mas.hand.nudge"])

# ============================================================================================================ SC 31
S("31.01", "31", "[ECU]", "INSERT-PROP", 90, base="31.01", change="REFRAME", beats="1 bar + 2 beats",
  rail='NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"', rail_at=0,
  why="The vault as a PROP INSERT (new insert-scale drawing): `DO NOT OPEN. DO NOT EXPLAIN.` legible. The walk moves to the [W] 31.02.",
  room="bullpen · back wall · the Q* vault at insert scale (NEW), under the tungsten spill from the hall", characters=[],
  action=["A squat steel vault stencilled `Q*` under the tungsten spill from the hall. It hums at the score's root note, F. One yellow sticky note is stuck on its door: `DO NOT OPEN. DO NOT EXPLAIN.`",
          "The rail types on at f0 and keeps reading into 31.02 (it persists)."],
  text=[T('NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"', "rail", tag="[V as reported]"), T("Q*", "prop"),
        T("DO NOT OPEN. DO NOT EXPLAIN.", "prop", tag="[INVENTED] egg")],
  sfx=["NEW vault_hum_F (sustained, at the score's root)"], events=2, prod_mode="M", assets=["prop.q-vault"])
S("31.02", "31", "[W]", "WIDE", 60, base="31.01", change="REFRAME", beats="1 bar", v1=["31.01", "31.02"], lock=["31.02"],
  why="The walk in ONE [W] with the room walkers (masWalkAt; drawGergStand type → look 'up'); no rig walks.",
  room="bullpen · back wall · wide (the vault at the vaultQ mark, room scale)",
  characters=["MAS: walks past the vault L→R without looking (masWalkAt, 4 drawings on 2s)", "THE ORB: at his shoulder (room scale); it LOOKS at the vault (iris turns)",
              "GERG: walks past the other way, typing (drawGergStand type 0-2), and stops (look 'up')"],
  action=["The back wall. Mas walks past the vault without looking, the Orb at his shoulder. The Orb looks.", "Gerg walks past the other way, typing, and stops."],
  text=[], sfx=["NEW footsteps_soft ×2", "typing_soft (REUSE)", "vault_hum_F"], music="The hum IS the music here.", gags=[], notes=["The vault beat's one wide."],
  events=5, prod_mode="I", assets=["room.bullpen", "prop.q-vault", "cast.mas.stand", "cast.orb.room", "cast.gerg.walk"])
S("31.03", "31", "[P2]", "PORTRAIT", base="31.03", change="REFRAME", lines=[L("a4-31-01"), L("a4-31-02", gap=GAP)], min_frames=120, v1=["31.03", "31.04", "31.05"], lock=["31.03", "31.04"],
  why="The exchange in a [P2] (MAS left, GERG right: gerg-speak portrait). Gerg's exit happens IN his window (looks over at the note, nods, the window closes); the separate note insert and walk-on are gone.",
  room="bullpen (held) behind both windows", characters=["MAS (left): NOT looking (level stare, away from the vault)", "GERG (right, gerg-speak portrait): laptop open; looks over at the sticky note, nods, walks on"],
  action=["GERG: 'What's in there?' MAS (not looking): 'it's a preview.' The vault hums on the line.",
          "After the punch: in his window, Gerg looks over at the sticky note (beat), reads it, nods (1-px dip), and his window closes (3 held steps) as he walks on. The hum is sound only."],
  sfx=["voice: gerg-mockbran, mas-manalt", "vault_hum_F swells 1 dB under 'preview.'"], gags=["'it's a preview.' (the research-preview echo)."],
  events=5, prod_mode="I", assets=["cast.mas.portrait", "cast.gerg.portrait", "kit.portrait-layout", "room.bullpen"])
S("31.06", "31", "[P]", "PORTRAIT", base="31.06", change="RETIME", lines=[L("a4-31-03", at=8)], rail="NOV 29, 2023", rail_at=0,
  action=["He reads the whole memo aloud, unhurried, on camera (voiced only; the memo page is never inserted); the 0.6 s pause at the ellipsis stays."],
  sfx=["voice: mas-manalt (memo-read, whole)"],
  why="The WHOLE memo on camera (board 1 laid its second half over the nameplate insert) (voiced, never V.O.; the page is never inserted). His own real line lands on the prop consequence (31.07).")
S("31.07", "31", "[ECU]", "INSERT-PROP", 90, base="31.07", change="CHANGED", hand=True, beats="1 bar + 2 beats", lines=[], notes=["F2: he left the board that day and stays at the company: the plate comes off the CHAIR; the office door keeps its plate (31.08)."],
  why="Carried as a prop insert (a worker's hand + the chair back): four screws, four beats; the plate comes off. The memo no longer plays over it.",
  action=["The boardroom. A maintenance worker's screwdriver takes the `ALYI` nameplate off the back of his board chair: four screws, four beats, one held drawing each. Beat 5: the plate comes off. Hold 1 beat."],
  sfx=["NEW screw_squeak ×4", "NEW plate_off_tick"], room="boardroom · back of ALYI's board chair (drawChairBackInsert)")
S("31.08", "31", "[ECU]", "INSERT-PROP", 45, base="31.08", change="REFRAME", beats="3 beats",
  why="Draft 3's [M] is a prop insert (new insert-scale drawing): the shut conference-room door and its nameplate.",
  room="bullpen · the conference-room door at insert scale (NEW): shut, the ALYI plate on", characters=[],
  action=["Back in the bullpen, the conference-room door, shut, with its nameplate still on. Hold."], events=1, prod_mode="M", assets=["prop.door-nameplate"])
S("31.09", "31", "[W]", "WIDE", 120, base="31.09", change="RETAG", beats="2 bars",
  why="Board 1's close on the window corner is a TIGHTER PLATE OF THE ROOM, so it logs [W] (the memo beat's one wide) and keeps the seat text legible.",
  room="bullpen · the window corner (a tighter [W] plate: the chair large enough for its seat text)", fnote="a tighter plate of a room is [W]",
  assets=["room.bullpen", "prop.observer-chair"])

# ------------------------------------------------ what 3.1 cuts (pov-changes §3: 9 shots from draft 3) + what board 2 folds from board 1
CUT(["27.34"], "the desks insert (a desk for every employee, already labelled): −3 beats; Tasya's real line lands straight on the [2S] 27.35", "sc 27", src="3.1 cut (board 1 + draft 3)")
CUT(["29.02"], "Rima's full-bleed [POV] post (−1 bar): folded into the true [ECU] 29.03, legible on the face-up phone", "sc 29", src="3.1 cut (board 1 + draft 3)")
CUT(["29.13a", "29.13b", "29.13c"], "the three eyelines before 'leave it open.' (−3 beats): visible calculation at a real event", "sc 29", src="3.1 cut (draft 3)")
CUT(["30.01 [M]", "30.02 [ECU]"], "the doorway [M] and the thumb-hearting [ECU] (−6 beats): the hearts rise out of his window in the [P2] 30.01", "sc 30", src="3.1 cut (draft 3)")
CUT(["30.19"], "the new-board wide (TERB, THE OTHER YRRAL and MADA take their seats; chair_sit ×3): −1 bar", "sc 30", src="3.1 cut (board 1 + draft 3)")
CUT(["31.04 [M]"], "Gerg-leaves: he looks at the note, nods and his window closes inside the [P2] 31.03; the hum is sound only", "sc 31", src="3.1 cut (draft 3)")
CUT(["27.15"], "board 1's laptop-on-the-chair insert: the still black tile plays in the [2S] 27.14b", "sc 27", src="board-1 fold")
CUT(["29.09"], "board 1's check-front insert (and draft 3's V.O. over it): the front reads in the delivery [2S] 29.08; the V.O. moved to the lanyard", "sc 29", src="board-1 fold")
CUT(["31.04", "31.05"], "board 1's sticky-note insert and Gerg's walk-on wide: the note reads in the vault insert 31.01, the exit plays in the [P2] 31.03", "sc 31", src="board-1 fold")
CUT(["30.22 walk-in"], "Mas's 4-drawing lobby walk-in (he is already at the reception desk)", "sc 30", src="3.1 action cut")

# ============================================================================================================ scenes (draft 3.1 printed clocks, act frames)
PRINTED = OrderedDict([
    ("24", ("12:31", "12:36", 0, 120, "2 bars")), ("25", ("12:36", "13:21", 120, 1200, "18 bars: 3 · 7 · 5 · 3")),
    ("26", ("13:21", "14:13.5", 1200, 2460, "21 bars: 4 · 4 · 4 · 4 · card 2 · 3")), ("26A", ("14:13.5", "14:33.5", 2460, 2940, "8 bars")),
    ("27", ("14:33.5", "16:24.5", 2940, 5604, "≈ 44½ bars")), ("28", ("16:24.5", "16:27.6", 5604, 5678, "1 bar + 1 beat")),
    ("29", ("16:27.6", "17:59.9", 5678, 7894, "pre-avalanche ≈ 52 s + the 16-bar avalanche")), ("30", ("17:59.9", "19:16.8", 7894, 9739, "≈ 77 s")),
    ("31", ("19:16.8", "19:43.8", 9739, 10387, "≈ 27 s")),
])
SC_META = {
    "24": ("INT. LAS VEGAS HOTEL SUITE — DAY", "[BASE] → [BLUEPRINT] on the last beat", "I"),
    "25": ("THE PLAN", "[BLUEPRINT]", "P"),
    "26": ("SAME — THE FALLING TILE", "[BASE] (+[GLYPH] 20 f, [EARLY-WEB16] F1.2)", "S2"),
    "26A": ("INT. MAS'S DARK ROOM — THAT NIGHT", "[BASE]", "I"),
    "27": ("THE FIVE DAYS, PASS ONE: THE BOARD'S SIDE", "[BASE]", "I (the exit; the absent-Mas variant; portrait volley)"),
    "28": ("CARD · INTERNAL ACT-OUT", "[BASE]", "—"),
    "29": ("THE FIVE DAYS, PASS TWO: HIS SIDE", "[BASE]", "I + S3"),
    "30": ("THE RETURN", "[BASE] (+[2-TONE FREEZE] full, TERB)", "I + S2"),
    "31": ("INT. NOPEAI BULLPEN — BACK WALL — DAY", "[BASE]", "M/I"),
}
SIDE_OF = {sc: ("BOARD" if sc == "27" else "MAS") for sc in SC_META}
SIDE_NOTE = {"24": "his POV", "25": "the show's voice (THE PLAN), inside his POV block; no V.O., no device, no Mas tell",
             "26": "his POV (the FALLING TILE: his feed)", "26A": "his POV (the door into the exit)",
             "27": "EXIT · THE BOARD'S SIDE (rail: NOV 17 · EARLIER · THE BOARD'S SIDE): no V.O., no Mas portrait window",
             "28": "the door back (WHAT THEY DIDN'T KNOW)", "29": "PASS TWO · HIS SIDE (rail: … · HIS SIDE)", "30": "his POV; no V.O. in the return",
             "31": "his POV"}

# chunks: (id, first, last, title, depends_on)
CHUNKS = [
    ("C01", "24.01", "25.08", "The suite + THE PLAN (on its real clock) + the click",
     "kit.blueprint (EXISTS: kits-plan runs sc 25 on its 1080-f clock), room.vegas-suite (EXISTS). NEW first: cast.mas.hand.nudge, cast.mas.hand.click. The flash-print is a palette remap (BLUEPRINT_PRINT)."),
    ("C02", "26.01", "26.09", "THE FALLING TILE, phrases 1-4: the call, Cancel works, the drop-out, the silent [CU], super., the frozen feed (W0 calibration)",
     "kit.call-grid + kit.dialog-1993 (EXISTS). NEW first: cast.mas.cu, cast.mas.eyes (both in progress: cast/mas-cu.ts), cast.mas.hand.tap-strip, kit.post-ui (the strip). W0: log [PF], [CU], [ECU] and the drop-out apart from the salvaged grid."),
    ("C03", "26.10", "26A.06", "The candor card, F1.2 (TPOOL), THAT NIGHT: mark 3, 'i don't keep score.', the Orb counts, the 9:32 post, 'the meeting ended early.', rewinding… (W0 calibration)",
     "room.tpool-door + room.darkroom (EXISTS). NEW first: room.darkroom.medium, cast.mas.medium (in progress: cast/mas-medium.ts), cast.orb.medium + cast.orb.portrait (port dev/mcoldopen/orb.ts), cast.mas.hand.carve + .thumb-mark3, prop.wallet, kit.post-ui (composer), kit.vo-line; V.O. a4-26a-vo1 NEW READ."),
    ("C04", "27.01", "27.10", "Pass one I: 'super.' on their speaker, the toasts, RIMA, the listener, the all-hands, Alyi leaves his window, the hearts",
     "kit.call-grid, kit.falling-stack (EXISTS), room.bullpen allhands (EXISTS), cast.rima/neleh/alyi portraits (EXISTS). NEW: kit.post-ui (toasts, posts, the notification band), kit.cards (the generic 1-beat freeze print), mix.laptop-speaker; engine dialogueBox tail 'none' (REUSE)."),
    ("C05", "27.11", "27.17", "Pass one II: the committee in the boardroom (the [2S] tier + the volley), the listener, NELEH's real face, the `?`, the speakerphone",
     "room.boardroom (EXISTS). NEW first: room.boardroom.medium, cast.neleh.medium, cast.mada.medium, cast.neleh.hand-marker; CHANGED room.boardroom table insert (`?`-only state)."),
    ("C06", "27.18", "28.01", "Pass one III: the lighthouse throne call (prop inserts + portraits), the security-cam badge, TTEMME and the hourglass, Tasya's door, 'Step four?' / 'Good question.', WHAT THEY DIDN'T KNOW",
     "room.lighthouse, room.lobby cam, prop.throne-handset, prop.rent-meters, cast.ttemme, cast.tasya, prop.hourglass (EXISTS); the boardroom medium tier from C05. NEW: room.lighthouse.desk-insert; kit.post-ui (the upside-down post); kit.cards (the act-out card). CHECK the meters clear of the right window."),
    ("C07", "29.00", "29.08", "Pass two I: the home shot (HIS SIDE), 'i put the phone down.', MAS'S VERSION, eight hearts, the Orb on the lanyard, 'the badge was a joke.', 'mostly.', the letter, the check",
     "the dark-room medium tier from C03. NEW first: kit.mas-version (matching frame + stillness flag), cast.mas.hand.six + .heart-tap, room.darkroom phone:'up', prop.check-evirht (legible at [2S] scale), score.keynote-piano; V.O. a4-29-vo1 / -vo2 NEW READS; the a4-29-03 re-take."),
    ("C08", "29.11", "29.13", "Pass two II: Gerg's tile, the quiet beat (an exchanged look), 'gerg never waits to be asked.', the door on 'asked', 'leave it open.'",
     "cast.gerg portrait / tile (EXISTS), room.darkroom blueDoor (EXISTS) in the medium framing (C03). NEW: cast.gerg.medium-tile (the glance swap)."),
    ("C09", "29.14", "29.20", "THE TILE AVALANCHE (S3, 16 bars) + the MADA card",
     "kit.falling-stack (EXISTS: avalanche.ts lands 745/770, the shoves, the sparks). Kit-driven repetition (S-rep), so it books as one chunk; if the grid-stack plan is re-cut, split at 29.17a."),
    ("C10", "30.01", "30.08", "The return I: the doorway [P2] with Alyi (three hearts off the beat), the walkout, THE LANDLORD BECOMES THE ROOM (S2), 'hi.' / 'Hello.'",
     "room.bullpen + bullpenLandlord (EXISTS). NEW: cast.alyi.swap-up, cast.mas.swap-down, score.violin (under the post only)."),
    ("C11", "30.09", "30.21", "The return II: the fires, Terb's full freeze and the pin, 'Which room is on fire?' / '…Ah.', the calm-off [2S] and the long hold, Gerg's post and Mas's face, the last grain (W0 calibration: the calm-off)",
     "the boardroom medium tier (C05) + cast.mas.medium (C03); cast.terb, prop.extinguisher, prop.hourglass, prop.fires (EXISTS); kit.cards (the full freeze with Mas live). W0 calibration trio: the calm-off [2S] (30.14-30.17)."),
    ("C12", "30.22", "31.09", "The return III + sc 31: the lobby sign and the box of zeros, Cancel greys, the silent [CU], 'okay.' over the hands, Q*, the memo, the nameplate, the shut door, the observer chair",
     "cast.mas.cu (C02), cast.mas.hand.nudge (C01). NEW: room.lobby.reception-insert, prop.q-vault, prop.door-nameplate, prop.observer-chair, cast.hands.worker."),
]

# ============================================================================================================ the asset registry (board 2)
SHARED = "studio/src/shared/pixel"
A = OrderedDict()


def AS(aid, kind, owner, status, file="", fn="", needs="", note="", source=""):
    A[aid] = dict(id=aid, kind=kind, owner=owner, status=status, file=file, fn=fn, needs=needs, note=note, source=source)


# rooms
AS("room.vegas-suite", "room", "rooms-a", "EXISTS", f"{SHARED}/rooms/vegas-suite.ts",
   "drawSuite · suiteLayers · glassShiver · drawLaptopInsert({screen:'join'|'gone', cursor, pressed, mic}) · drawDeskInsert({phoneLit, mic}) · suitePortraitBg · suiteTileBg",
   "No new plate for board 2: the nudge (24.02) plays on drawDeskInsert (his glass at the right), the click (25.08) on drawLaptopInsert 'join', both [PF]s on suitePortraitBg stepped down, the strip tap (26.06) on drawDeskInsert {mic:true}.",
   "pov-changes §5.1 lists 'laptop corner and mic icon at insert scale' as NEW: drawDeskInsert already frames the phone with the laptop's corner and the lit mic (rooms-a suite-desk-insert.png).")
AS("room.darkroom", "room", "rooms-b", "CHANGED", f"{SHARED}/rooms/darkroom.ts",
   "drawDarkRoom({tally, carve, lanyard, boardGrid, clock, blueDoor 1-4, blueDoorAjar}) · drawDarkDesk({tally 2|3, carve, glass, phone:'down'|'none', lanyard}) · drawRackLeds",
   "ADD drawDarkDesk phone:'up' (face-up, a screen rect the feed painter fills) in the SAME framing as phone:'down', so 29.01a and 29.03 are a matching frame. Everything else exists.")
AS("room.darkroom.medium", "room-plate", "rooms-b", "NEW", f"{SHARED}/rooms/darkroom-medium.ts (proposed)", "",
   "The dark-room desk MEDIUM plate: the cyan cone, the rack's LEDs, the desk edge, the monitor (the board grid small in its corner), the back wall with the blue door's slot (29.12). Mas in the left third (§4.3 rule 8); frame y 182-203 on shadow for the V.O.",
   "Salvage source: dev/mcoldopen/medium.ts (the intro's medium two-shot, MED layout; it puts Mas right of the monitor, so restage).", "dev/mcoldopen/medium.ts")
AS("room.bullpen", "room", "rooms-b", "EXISTS", f"{SHARED}/rooms/bullpen.ts",
   "drawBullpen({variant day|allhands|walkout, door shut|crack|open, nameplate, iou, handsUp, crowd}) · bullpenLandlord · DOOR_CRACK / DOOR_OPENING · drawGlassReflection · marks vaultQ, observerChair",
   "27.06 / 27.07a use the allhands plate as a tighter [W] (the same drawing); 30.01 the door 'crack' behind the [P2].")
AS("room.boardroom", "room", "rooms-a", "CHANGED", f"{SHARED}/rooms/boardroom.ts",
   "drawBoardroom (Nov 17 plan · Nov 19 spot · slate + tasyaDoor 0-4 · FIRES_SC30) · drawTableInsert({focus 'blueprint'|'prop'|'laptop', word 0-3}) · drawChairBackInsert · drawLaptopChairInsert",
   "ADD a `?`-ONLY step 4 (drawTableInsert word 3 draws the scribble + `?`; 3.1 wants only `?`), in the table insert and on the table in every later boardroom frame.")
AS("room.boardroom.medium", "room-plate", "rooms-a", "NEW", f"{SHARED}/rooms/boardroom-medium.ts (proposed)", "",
   "The boardroom TABLE medium plate: the table edge with the blueprint, the dark window behind (Alyi's reflection slot), the slate-wall + Tasya's-door state, the fires state, and the calm-off framing (Mas left, Mada right across the table).")
AS("room.lighthouse", "room", "rooms-b", "CHECK", f"{SHARED}/rooms/lighthouse.ts",
   "drawLighthouse({phone1, throne 'on'|'fallen'|'none', meters}) · drawRentMeter · drawDeskPhone · handsetImg / throneImg · lampTurn",
   "CHECK: the two rent meters must sit clear of the right portrait window (x 356-468, y 24-160) so they read behind Mario's [P] (27.24).")
AS("room.lighthouse.desk-insert", "room-plate", "rooms-b", "NEW", f"{SHARED}/rooms/lighthouse-desk.ts (proposed)", "",
   "Insert-scale desk top buried in paper, with the ringing phone on its cradle (27.18) and after the click (27.23). The handset + throne (adelina.ts drawThroneHandset 'lg', 30x30) sits on it.")
AS("room.lobby", "room", "rooms-a", "EXISTS", f"{SHARED}/rooms/lobby.ts",
   "drawLobby (day / night, the sign blank → lit, the reception front layer) · drawLobbyCam · drawLobbyCamWide · drawSignFloorInsert", "")
AS("room.lobby.reception-insert", "room-plate", "rooms-a", "NEW", "", "", "A small insert-scale plate: the reception desk top under the lobby's tungsten, for the glass set-down + nudge (30.26).")
AS("room.tpool-door", "room", "rooms-a", "EXISTS", f"{SHARED}/rooms/tpool-door.ts", "drawTpoolDoor · drawTpoolClose (authored BASE, survives EARLYWEB16)", "")
# cast · Mas
AS("cast.mas.portrait", "portrait", "cast", "REUSE", f"{SHARED}/cast/mas.ts", "masPortrait (mouths A E O M rest smile, lids, look)", "")
AS("cast.mas.swap-down", "expression", "cast", "NEW", "", "", "Mas's portrait looking DOWN at the floor (30.08 'hi.'). An expression swap in a new file; no edit to mas.ts.")
AS("cast.mas.desk", "room-sprite", "cast", "REUSE", f"{SHARED}/cast/mas.ts", "masDesk", "")
AS("cast.mas.stand", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/mas-stand.ts", "drawMasStand({legs, arm 'down'|'reach'|'pocket', guest}) · masWalkAt · MAS_REACH_HAND", "")
AS("cast.mas.cu", "close-up", "cast", "NEW", f"{SHARED}/cast/mas-cu.ts", "masCU · drawMasCU({backdrop 'strip'|'lobby'})",
   "ONE drawing: three-quarter, the one-pixel smile, NO mouths (both uses silent); the backdrop carries the light (the Strip's neon; the lobby's tungsten).",
   "A parallel stage started this file at board time: verify before W0.")
AS("cast.mas.eyes", "insert", "cast", "NEW", f"{SHARED}/cast/mas-cu.ts", "drawEyesStrip(y0, pos -2..2)", "The eyes strip, 480x64 letterboxed, 5 pupil positions (26.04a).",
   "A parallel stage started this file at board time (the function was a stub).")
AS("cast.mas.medium", "medium-rig", "cast", "NEW", f"{SHARED}/cast/mas-medium.ts", "drawMasMedium · masMediumBack / masMediumFront · MAS_M_HAND (heads 34/down/front; arms rest/phone/tally/clasp/down; lights monitor/board/warm)",
   "Waist-up, head ≈ 36 px, left third; 3 heads, 4 arm poses, the six mouths; flip for the calm-off (facing Mada).", "A parallel stage started this file at board time.")
for hid, sh, need in [("click", "25.08", "hand on the trackpad: rest → press (1 frame, 1 px)"),
                      ("nudge", "24.02, 30.26", "the nudge and the set-down: ONE drawing whose last frame is the nudge (two fingers, the glass 1 px true)"),
                      ("tap-strip", "26.06", "the thumb on the phone's suggested-replies strip beside the laptop's corner; the tap at once (NO hover drawing)"),
                      ("carve", "26A.01", "the carve with the pen's steel clip, 4 growth steps (with prop.tally)"),
                      ("thumb-mark3", "26A.01", "the brush (side of the hand, 2 drawings), then the thumb at rest on mark 3 ONLY (one drawing moved in whole pixels)"),
                      ("heart-tap", "29.03", "five fingers, the thumb tapping the face-up phone lying on the desk (8 taps); the matching frame of .six"),
                      ("six", "29.01a", "the same hand resting on the face-down phone with SIX fingers, plus a five-finger copy for the G2 A/B")]:
    AS(f"cast.mas.hand.{hid}", "insert-hand", "cast", "NEW", "", "", need, f"ECU kit hand ({sh})")
AS("cast.mas.hand.pin", "insert-hand", "cast", "CHECK", f"{SHARED}/cast/terb.ts", "drawExtinguisherInsert · drawPinTag", "The pin in his fingers, DO NOT REMOVE legible (30.12).",
   "pov-changes: 'the pin is built'. CHECK that Mas's fingers are in the drawing.")
# cast · the Orb
AS("cast.orb.room", "room-sprite", "cast", "SALVAGE", f"{SHARED}/cast/orb.ts (port)", "drawOrb · orbLookAt · orbBob", "Room scale at his shoulder (24.01, 31.02: it looks at the vault).", "", "dev/mcoldopen/orb.ts")
AS("cast.orb.medium", "medium-rig", "cast", "NEW", "", "", "The Orb at [2S] scale (a sphere and an iris). IRIS TARGETS: tally marks 1, 2, 3 and his thumb (26A.02), the phone and the GUEST lanyard (29.04), his face.",
   "CHECK: Com says the iris positions exist; confirm them at [2S] scale. Source: dev/mcoldopen/orb.ts.", "dev/mcoldopen/orb.ts")
AS("cast.orb.portrait", "portrait", "cast", "NEW", "", "", "The Orb in the RIGHT window: iris desk → his face (26A.06), held on the lanyard (29.10), name → thumbnail → name + chime (29.07a).")
# cast · the others
AS("cast.alyi.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/alyi-speak.ts (+ alyi.ts)", "alyiSpeakPortrait · alyiReflection · drawAlyiWindow (flicker 'there'|'gone') · drawAlyiTile", "")
AS("cast.alyi.swap-up", "expression", "cast", "NEW", "", "", "ALYI looks UP at the hearts (30.01 [P2]; board 1's 30.03 already asked for it). An expression swap.")
AS("cast.alyi.door", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/alyi-speak.ts", "drawAlyiStand (clip to DOOR_OPENING)", "27.06 all-hands doorway.")
AS("cast.alyi.window-exit", "compositor", "cast", "CHANGED", "", "portraitWindow + the door-jamb clip", "His door-cut portrait slides out of its window in whole-pixel steps; the window holds empty 1 beat, then closes (3 held steps). No new drawing (27.08).")
AS("cast.neleh.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/neleh.ts", "nelehPortrait (brows 'level'|'query'|'worry', footnotes)", "The two listeners (27.05c, 27.12d) REUSE brow 'query'.")
AS("cast.neleh.tile", "tile", "cast", "EXISTS", f"{SHARED}/cast/neleh.ts", "drawNelehTile · drawNelehMini · tileOrbit", "")
AS("cast.neleh.room", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/neleh.ts", "drawNelehRoom (arm paper|marker|write0|write1)", "The boardroom wides (27.17, 27.27).")
AS("cast.neleh.medium", "medium-rig", "cast", "NEW", "", "", "NELEH waist-up, standing with the marker (27.11-27.36): 3 heads, 4 arm poses, mouths; no legs.")
AS("cast.neleh.hand-marker", "insert-hand", "cast", "NEW", "", "", "Her hand + the marker at insert scale: uncap (2), write `?` (3) (27.16). A prop insert (a hand and an object), never her eyes.")
AS("cast.mada.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/mada.ts", "madaPortrait · drawSpinner", "")
AS("cast.mada.tile", "tile", "cast", "EXISTS", f"{SHARED}/cast/mada.ts", "drawMadaTile (any size: wedged, blue-heart spinner, half-frame 29.18) · madaTileSpinner", "")
AS("cast.mada.room", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/mada.ts", "drawMadaSeated · drawMadaChair (bolted)", "The boardroom wides (27.17, 27.27, 30.10).")
AS("cast.mada.medium", "medium-rig", "cast", "NEW", "", "", "MADA waist-up, seated, arms folded, spinner (27.11-27.36, 30.09, the calm-off 30.14-30.17): the nod; lids for the slow blink.")
AS("cast.gerg.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/gerg-speak.ts (+ gerg.ts)", "gergSpeakPortrait · drawGergTile (typing) · gergGlow", "")
AS("cast.gerg.medium-tile", "expression", "cast", "NEW", "", "", "Gerg's tile at MEDIUM tile scale, the glance up into his camera (29.11c). An expression swap on the tile.")
AS("cast.gerg.walk", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/gerg-stand.ts", "drawGergStand({legs, type 0-2, look 'screen'|'up'}) · gergWalkAt", "31.02.")
AS("cast.gerg.keycaps", "fx", "cast", "REUSE", f"{SHARED}/cast/gerg.ts", "gergKeycaps", "")
AS("cast.rima.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/rima-speak.ts", "rimaSpeakPortrait (the hard spotlight, the jacket smooth)", "")
AS("cast.ttemme.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/ttemme.ts", "ttemmePortrait · drawChatOverlay", "")
AS("cast.ttemme.room", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/ttemme.ts", "ttemmeRoom", "")
AS("cast.tasya.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/tasya-speak.ts", "tasyaSpeakPortrait", "")
AS("cast.tasya.room", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/tasya-speak.ts", "drawTasyaRoom (arm 'sign'|'keys0'|'keys1'|'clasp')", "")
AS("cast.terb.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/terb.ts", "terbPortrait (helmet on/off, brows 'ah')", "")
AS("cast.terb.room", "room-sprite", "cast", "EXISTS", f"{SHARED}/cast/terb.ts", "drawTerbRoom · terbWalkAt (helmet pops on at the door) · arms carry/spray/stamp/hand", "")
AS("cast.mario.portrait", "portrait", "cast", "REUSE", f"{SHARED}/cast/mario.ts (+ talk.ts marioMouth)", "drawMarioPortrait (finger 0-2) · marioMouth", "")
AS("cast.adelina.portrait", "portrait", "cast", "EXISTS", f"{SHARED}/cast/adelina.ts", "adelinaPortrait (phone 'ear', throne on/off)", "")
AS("cast.quietvote", "tile", "cast", "EXISTS", f"{SHARED}/cast/the-quiet-vote.ts", "drawQuietVoteTile · drawQuietVoteLaptop · drawQuietVoteMini", "")
AS("cast.calltile", "kit", "cast", "EXISTS", f"{SHARED}/cast/calltile.ts", "tileFrame · micIcon · miniFrame · voteFlipAt", "")
AS("cast.mas.tile", "tile", "cast", "SALVAGE", "", "masTileImg (still in dev/mfinale/callart)", "Mas's call tile (Vegas, day); the cast's callgrid view composes the salvage (no FIRED., the clock blanked).", "", "dev/mfinale/callart.ts")
AS("cast.hands.worker", "insert-hand", "cast", "NEW", "", "", "Maintenance hands only (a private individual): the screwdriver on 4 screws + the plate off (31.07); setting down the box of zeros (30.23).")
# kits · engine
AS("kit.blueprint", "kit", "kits", "EXISTS", f"{SHARED}/kits/blueprint.ts", "bp* · BLUEPRINT_PRINT · curlAt / tearAt (kits-plan runs sc 25 on its real clock)", "")
AS("kit.call-grid", "kit", "kits", "EXISTS", f"{SHARED}/kits/callgrid.ts", "gridLayout · drawTile · tileDrop · plateFallY · slideTiles · pointerAt / drawPointer · micChip · spotlight · cctv · callToast · typedDots", "")
AS("kit.dialog-1993", "kit", "kits", "EXISTS", f"{SHARED}/kits/callgrid.ts", "callDialog (full colour; Cancel enabled or greying one step at a time) · dialogButton", "30.24 is 1 bar now: three held greys + the on-screen arrow's click on beat 4 (timing only).")
AS("kit.falling-stack", "kit", "kits", "EXISTS", f"{SHARED}/kits/avalanche.ts", "planPile / drawPile · withBlueHeart · planGridStack / drawGridStack · shove · scatter · floatHearts · odometer", "")
AS("kit.post-ui", "kit", "kits", "NEW", "", "(callToast exists in callgrid.ts)",
   "Post pop-ups in source casing with their own UI stamp (9:32 PM PT), the feed of eight identical posts (29.03), the suggested-replies strip [super]×3 (26.06), the phone composer (26A.03), Gerg's green-lit post, the upside-down post (27.26), the notification band (27.10), the signature list (29.07), the `…` glyph.")
AS("kit.cards", "kit", "kits", "NEW", "", "(engine ui.ts nameCard + the cast's card portraits exist: card-0…5.png)",
   "To build: the generic 1-beat 2-tone freeze print (freeze.ts covers only 4 founders), TERB's full freeze with Mas live, the two dated quote cards, the act-out card, the rail band + type-on (the side labels `THE BOARD'S SIDE` / `HIS SIDE`), the `∞` glyph.")
AS("kit.portrait-layout", "kit", "kits", "REUSE", f"{SHARED}/ui.ts", "portraitWindow · dialogueBox", "Mas window x12 y24, the other x356 y24 (112x136).")
AS("kit.dialogue-box-noportrait", "kit", "kits", "REUSE", f"{SHARED}/ui.ts", "dialogueBox(tail 'none'), top centre", "`super.` through their speaker (27.01): no portrait window, no name plate; types at Mas's rate.",
   "pov-changes lists a NEW state; the engine's box already takes tail 'none'.")
AS("kit.fallaway", "engine", "engine", "CHECK", f"{SHARED}/light.ts", "resolve() with the key near zero (or one family step, ≤ 2 beats)",
   "The [PF] method. W0 art-director ruling needed for holds > 2 beats (26.02a 4, 26A.05 6, 27.15 3, 29.17a 4, 30.08 8 beats). Default relight ruling: the ROOM only.")
AS("kit.vo-line", "engine", "engine", "NEW", "", "", "The V.O. line: x 12, baseline y 198, 1-px N0 shadow, his cyan one ramp step down, 0.5 ch/f; never over the dialogue box; staggered ≥ 1 beat from a toast or a rail item.")
AS("kit.mas-version", "engine", "engine", "NEW", "", "", "MAS'S VERSION helper: a matching-frame variant of the next shot's drawing + a STILLNESS flag (freezes every other layer for the bar). No present-day rim, no palette switch.")
# props
AS("prop.pen", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts", "pen", "")
AS("prop.tally", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts + rooms/darkroom.ts", "tally (growth, shavings curl/pile) · drawDarkDesk({tally, carve})",
   "The states exist (two faint · the third growing with shavings · three). The thumb-on-mark-3 is cast.mas.hand.thumb-mark3.", "pov-changes §5.1 lists 'tally states' as NEW: built by the prep.")
AS("prop.guest-lanyard", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts", "guestBadge · guestWorn (+ darkroom lanyard, mas-stand guest)", "CHECK 'laid square beside the glass' reads in the medium plate (29.01).")
AS("prop.wallet", "prop", "kits", "NEW", "", "", "The Senate wallet open on the desk, one card HEALTH INSURANCE, a moth (3 drawings) (26A.04).")
AS("prop.phone", "prop", "kits", "CHANGED", "", "drawDeskInsert (face-up, lit) · drawDarkDesk phone 'down'",
   "NEW: face-up on the dark desk with a feed (29.03, via room.darkroom). The full-bleed phone screens (26A.03, 30.20) are kit.post-ui.")
AS("prop.odometer", "prop", "kits", "EXISTS", f"{SHARED}/kits/avalanche.ts", "odometer · odoRoll · LETTER_STOPS", "")
AS("prop.check-evirht", "prop", "kits", "NEW", "", "", "The EVIRHT check, drawn for [2S] scale: front `EVIRHT · TENDER OFFER @ ~$86B VALUATION` legible, the red stamp `VOID IF CEO MISSING`, the eggs on the back; the tray-first eject (4 positions).")
AS("prop.hourglass", "prop", "kits", "EXISTS", f"{SHARED}/cast/ttemme.ts + kits/props.ts", "drawHourglass lg · hourglassFlipAt · hourglassBeats · shatter; props.ts hourglass L", "On the boardroom table insert (TABLE_INSERT.prop).")
AS("prop.extinguisher", "prop", "cast", "EXISTS", f"{SHARED}/cast/terb.ts", "drawExtinguisherInsert · drawPinTag · drawSpray", "")
AS("prop.term-sheet", "prop", "cast", "EXISTS", f"{SHARED}/cast/terb.ts", "drawTermSheet", "")
AS("prop.throne-handset", "prop", "cast", "EXISTS", f"{SHARED}/cast/adelina.ts + rooms/lighthouse.ts", "drawThroneHandset({size 'lg'|'room', throne}) · handsetImg / throneImg", "")
AS("prop.rent-meters", "prop", "rooms-b", "EXISTS", f"{SHARED}/rooms/lighthouse.ts", "drawRentMeter", "")
AS("prop.arrow-sign", "prop", "cast", "EXISTS", f"{SHARED}/cast/tasya-speak.ts", "drawTasyaRoom arm 'sign'", "")
AS("prop.fires", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts + rooms/setkit.ts", "fire · fireOut · drawFire · FIRES_SC30", "")
AS("prop.zero-box", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts + rooms/lobby.ts", "zeroBox · drawSignFloorInsert", "")
AS("prop.lobby-sign", "prop", "kits", "EXISTS", f"{SHARED}/kits/props.ts", "lobbySign · signLight · digitPlate", "")
AS("prop.nameplate-alyi", "prop", "rooms-a", "EXISTS", f"{SHARED}/rooms/boardroom.ts", "drawChairBackInsert (4 screw states + plate off)", "")
AS("prop.q-vault", "prop", "rooms-b", "NEW", "", "(bullpen.ts has only the vaultQ mark)", "The Q* vault at INSERT scale with the sticky note `DO NOT OPEN. DO NOT EXPLAIN.` legible (31.01), and at room scale on the vaultQ mark (31.02).")
AS("prop.door-nameplate", "prop", "rooms-b", "NEW", "", "", "The conference-room door, shut, its ALYI plate on, at insert scale (31.08).")
AS("prop.observer-chair", "prop", "rooms-b", "NEW", "", "(bullpen.ts has only the observerChair mark)",
   "The window corner as a tighter [W] plate: the MACROSOFT-blue folding chair unfolds (4 drawings), `OBSERVER (NON-VOTING)` legible on the seat back, the key ring drops (3) (31.09).")
# sound
AS("score.keynote-piano", "score", "score", "NEW", "", "", "MAS'S VERSION's bed: a soft keynote-reel piano, 1 bar, ORIGINAL (no real track, no borrowed melody), killed mid-phrase by the hard cut (29.01a).")
AS("score.violin", "score", "score", "CHANGED", "", "", "One sad violin, played straight, UNDER ALYI'S POST ONLY; a hard stop on the first heart (30.01). The 2-beat hold is room tone.")
AS("mix.laptop-speaker", "mix", "dialogue/mix", "NEW", "", "", "a4-26-01 through a small laptop-speaker filter (band-limited, boxy, quieter than the room) = a4-27-00 (27.01). No new read.")

NO_LONGER = [
    ("prop.labelled-desks", "EXISTS but unused", "boardroom.ts tasyaDoor 4 / drawTasyaDoorInsert: the desks insert is cut"),
    ("prop.gerg-laptop", "EXISTS but unused", "drawTableInsert focus 'laptop': 30.20 is now Mas's phone, full-bleed"),
    ("cast.other-yrral", "never built: not needed", "the new-board wide is cut (THE OTHER YRRAL no longer appears in Ep1)"),
    ("cast.mario.room / cast.adelina.room", "unused in Act Four", "the lighthouse plays in prop inserts and portraits"),
    ("cast.mas.hands (board 1's generic id)", "replaced", "by the seven per-drawing ids cast.mas.hand.*"),
    ("cast.hands.neleh", "renamed", "cast.neleh.hand-marker (writes `?` only)"),
    ("Mas [CU] front view, mouths, half-lid", "not needed for Ep1", "both close-ups are silent: one drawing"),
    ("the hover drawing (tap ±1 px)", "not needed", "no hover on the firing call"),
    ("the thumb along all three marks", "not needed", "it becomes the thumb at rest on mark 3"),
    ("the thumb-hearting insert for Alyi", "not needed", "the hearts rise out of his window in the [P2]"),
    ("the call's live-caption line", "not needed", "his voice through their speaker instead"),
    ("Mas's lobby walk-in (4 drawings)", "not needed", "he is already at the reception desk (masWalkAt is still used in 31.02)"),
    ("medium rigs: Terb, Alyi, Mario, TTEMME, Tasya, Rima", "not needed in Act Four", "only principals in home rooms get [M]"),
    ("medium plates: the Vegas suite, the bullpen back wall, the lighthouse desk", "not needed", "2 plates remain: the dark-room desk and the boardroom table"),
    ("the present-day cyan 6-px rim; 'the soft score bed'", "not needed", "MAS'S VERSION has no rim; the keynote piano replaces the bed"),
]

# ============================================================================================================ compute
def ceil_beat(n):
    return int(math.ceil(n / BEAT) * BEAT)


def read_frames(s):
    return int(math.ceil((0.25 + 0.05 * len(s)) * FPS))


def tc(f):
    e = EP_IN + f
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def mmss(f):
    s = f / FPS
    return f"{int(s // 60)}:{s % 60:05.2f}"


def grid(fr):
    bars, rem = divmod(fr, BAR)
    beats, fx = divmod(rem, BEAT)
    parts = []
    if bars:
        parts.append(f"{bars} bar" + ("s" if bars > 1 else ""))
    if beats:
        parts.append(f"{beats} beat" + ("s" if beats > 1 else ""))
    if fx:
        parts.append(f"{fx} f")
    return " + ".join(parts) or "0"


def post_text(lid):
    return LINES[lid]["text"].strip('"')


def place(s):
    cues, t = [], None
    lead = s["lead"] if s["lead"] is not None else P_LEAD
    for c in s["cues"]:
        Ld = LINES[c["id"]]
        n = (c["seg"][1] - c["seg"][0]) if c.get("seg") else Ld["frames"]
        if c["at"] is not None:
            at = c["at"]
        elif t is None:
            at = lead
        else:
            at = t + (c["gap"] if c["gap"] is not None else GAP)
        cues.append(dict(id=c["id"], start=at, end=at + n, frames=n, seg=c.get("seg"), text=c.get("text")))
        t = at + n
    pcs = []
    for p in s["post_cues"]:
        txt = post_text(p["id"])
        hold = p["hold"] or (ceil_beat(read_frames(txt)) + BEAT)
        pcs.append(dict(id=p["id"], start=p["at"], end=p["at"] + hold, text=txt, read_min=read_frames(txt)))
    if s["frames_spec"] is not None:
        frames = s["frames_spec"]
    else:
        ends = [0, s["min_frames"]]
        if cues:
            tail = s["tail"] if s["tail"] is not None else (PUNCH if s["punch"] else TAIL)
            if LINES[cues[-1]["id"]]["mode"] == "vo" and s["hold"] < BEAT:
                tail = max(tail, BEAT)
            ends.append(cues[-1]["end"] + s["hold"] + tail)
        ends += [p["end"] for p in pcs]
        frames = ceil_beat(max(ends))
    return frames, cues, pcs


out = []
t = 0
rail = None
problems = []
for s in SHOTS:
    frames, cues, pcs = place(s)
    assert frames % BEAT == 0, (s["id"], frames)
    for c in cues:
        if c["end"] > frames:
            problems.append(f"{s['id']}: line {c['id']} ends at {c['end']} > shot {frames}")
    for p in pcs:
        if p["end"] > frames:
            problems.append(f"{s['id']}: post {p['id']} ends at {p['end']} > shot {frames}")
    hidden = s["shotSize"] in ("BLUEPRINT",) or (s["shotSize"] == "CARD" and not s["rides"])
    rail_ev = None
    if s["rail"]:
        rail_ev = dict(text=s["rail"], at=s["rail_at"], abs=t + s["rail_at"], read_min=read_frames(s["rail"]))
        rail = s["rail"]
    r = OrderedDict()
    r["id"] = s["id"]
    r["scene"] = s["scene"]
    r["chunk"] = None
    r["side"] = s["side"] or SIDE_OF[s["scene"]]
    r["start_frame"], r["end_frame"], r["frames"] = t, t + frames, frames
    r["dur_s"] = round(frames / FPS, 3)
    r["grid"] = grid(frames)
    r["script_len"] = s["script_len"]
    r["tc_in"], r["tc_out"] = tc(t), tc(t + frames)
    r["tag"] = s["tag"]
    r["shotSize"] = s["shotSize"]
    r["framing"] = LEGACY[s["shotSize"]] if s["tag"] != "[P2]" else "TWO-PORTRAIT"
    r["framing_note"] = s["framing_note"]
    r["change"] = s["change"]
    r["change_note"] = s["change_note"]
    r["v1_id"] = s["v1_id"]
    r["v1_frames"] = sum(V1S[x]["frames"] for x in s["v1_id"] if x in V1S) if s["v1_id"] else None
    r["lock_id"] = s["lock_id"]
    for k in ("room", "characters", "action"):
        r[k] = s[k]
    r["lines"] = [c["id"] for c in cues] + [p["id"] for p in pcs]
    r["dialogue"] = []
    r["vo"] = []
    for c in cues:
        Ld = LINES[c["id"]]
        row = OrderedDict(id=c["id"], speaker=Ld["speaker"], text=c["text"] or Ld["text"], tag=Ld["tag"], mode=Ld["mode"], voiced=Ld["voiced"],
                          frames=c["frames"], at=c["start"], end=c["end"], abs_in=t + c["start"], tc_in=tc(t + c["start"]), status=Ld["status"], file=Ld["file"])
        if c["seg"]:
            row["seg_frames"] = list(c["seg"])
            row["status"] = Ld["status"] + f" · phrase clip f{c['seg'][0]}-{c['seg'][1]} of the whole take"
        if Ld["mode"] == "vo":
            r["vo"].append(OrderedDict(id=c["id"], text=Ld["text"], device=Ld["device"], tag=Ld["tag"], at=c["start"], end=c["end"], frames=c["frames"],
                                       abs_in=t + c["start"], tc_in=tc(t + c["start"]), status=Ld["status"], file=Ld["file"], caught_by=Ld["caught_by"],
                                       alt=Ld.get("alt"), on_screen="x 12, baseline y 198, 1-px N0 shadow, cyan one step down, 0.5 ch/f"))
        else:
            r["dialogue"].append(row)
    for p in pcs:
        Ld = LINES[p["id"]]
        r["dialogue"].append(OrderedDict(id=p["id"], speaker=Ld["speaker"], text=Ld["text"], tag=Ld["tag"], mode=Ld["mode"], voiced=False, frames=None,
                                         at=p["start"], end=p["end"], abs_in=t + p["start"], tc_in=tc(t + p["start"]), status="POST (unvoiced pop-up)", file=None,
                                         hold=p["end"] - p["start"], read_min=p["read_min"]))
    r["text"] = s["text"]
    if s["rail"] and not any(x.get("kind") == "rail" and x["text"] == s["rail"] for x in r["text"]):
        r["text"] = r["text"] + [T(s["rail"], "rail")]
    r["rail_change"] = rail_ev
    r["rail_shown"] = None if hidden else rail
    r["rail_changes_here"] = bool(rail_ev)
    r["style"] = s["style"]
    r["switches"] = s["switches"]
    r["drop_out"] = s["drop_out"]
    r["quiet_beat"] = s["quiet_beat"]
    r["sfx"], r["music"], r["gags"] = s["sfx"], s["music"], s["gags"]
    r["notes"] = s["notes"]
    r["events"] = s["events"]
    r["prod_mode"] = s["prod_mode"]
    r["assets"] = [OrderedDict(id=a, status=A[a]["status"] if a in A else "??", owner=A[a]["owner"] if a in A else "??") for a in s["assets"]]
    for a in s["assets"]:
        if a not in A:
            problems.append(f"{s['id']}: unknown asset {a}")
    # logging (pov-and-framing §4.2 + pov-changes §6)
    size = s["shotSize"]
    logged = s["rides"] if (size == "CARD" and s["rides"]) else size
    ff = s["face_frames_spec"]
    hand = s["hand_in_frame"]
    if logged in FACE_SIZES:
        face = frames
    elif logged == "INSERT-PROP" and hand:
        face = frames
    elif ff == "all":
        face = frames
    elif isinstance(ff, int):
        face = ff
    else:
        face = 0
    r["hand_in_frame"] = hand
    r["logged_as"] = logged
    r["rides"] = s["rides"]
    r["face_frames"] = face
    r["faces_hands"] = face > 0
    out.append(r)
    t += frames
TOTAL = t
IDX = {r["id"]: i for i, r in enumerate(out)}
SH = {r["id"]: r for r in out}

# ---- scenes
scenes = OrderedDict()
for sc, (a, b, pa, pb, bars) in PRINTED.items():
    rows = [r for r in out if r["scene"] == sc]
    st, en = rows[0]["start_frame"], rows[-1]["end_frame"]
    scenes[sc] = OrderedDict(id=sc, title=SC_META[sc][0], style=SC_META[sc][1], mode=SC_META[sc][2], side=SIDE_OF[sc], side_note=SIDE_NOTE[sc],
                             printed_clock=f"{a}–{b}", printed_frames=pb - pa, printed_bars=bars, start_frame=st, end_frame=en, frames=en - st,
                             tc_in=tc(st), tc_out=tc(en), delta_frames=(en - st) - (pb - pa), delta_s=round(((en - st) - (pb - pa)) / FPS, 2),
                             shots=[r["id"] for r in rows], n_shots=len(rows))

# ---- chunks
chunks = []
RATES = V1["conventions"]["mode_rates_agent_min_per_s"]
for cid, a0, a1, title, deps in CHUNKS:
    rows = out[IDX[a0]: IDX[a1] + 1]
    for r in rows:
        r["chunk"] = cid
    fr = sum(r["frames"] for r in rows)
    ev = sum(r["events"] for r in rows)
    dlg = sum(r["frames"] for r in rows if any(d["voiced"] for d in r["dialogue"]) or r["vo"])
    by_mode = OrderedDict()
    for r in rows:
        by_mode[r["prod_mode"]] = by_mode.get(r["prod_mode"], 0) + r["frames"]
    snew = by_mode.get("S-new", 0)
    kit_sp = by_mode.get("S-rep", 0) + by_mode.get("P", 0) + by_mode.get("F", 0)
    mode_min = sum(RATES.get(m, 2.0) * f / FPS for m, f in by_mode.items())
    new_assets = sorted({a["id"] for r in rows for a in r["assets"] if a["status"] in ("NEW", "CHANGED", "SALVAGE", "CHECK")})
    chunks.append(OrderedDict(id=cid, shots=f"{a0}–{a1}", first=a0, last=a1, n_shots=len(rows), start_frame=rows[0]["start_frame"], end_frame=rows[-1]["end_frame"],
                              frames=fr, seconds=round(fr / FPS, 2), tc_in=rows[0]["tc_in"], tc_out=rows[-1]["tc_out"], title=title, depends_on=deps,
                              assets_to_build_first=new_assets, lines=[l for r in rows for l in r["lines"]],
                              visual_events=ev, dialogue_shot_seconds=round(dlg / FPS, 1), setpiece_new_art_seconds=round(snew / FPS, 1),
                              kit_setpiece_seconds=round(kit_sp / FPS, 1), by_prod_mode_seconds={m: round(f / FPS, 1) for m, f in by_mode.items()},
                              est_agent_min_mode_rates=round(mode_min), est_agent_min_rule_of_thumb=round(0.4 * fr / FPS + 3.5 * ev),
                              fits_rule=bool(snew / FPS <= 10 and fr / FPS <= 60)))
for r in out:
    assert r["chunk"], r["id"]

# ---- rails: spans + read checks
reads = []
spans, cur, cst, cspan = [], None, None, 0
for r in out:
    if r["rail_change"]:
        if cur:
            spans.append((cur, cst, cspan))
        cur, cst, cspan = r["rail_change"]["text"], r["id"], r["frames"] - r["rail_change"]["at"]
    elif r["rail_shown"] and cur:
        cspan += r["frames"]
if cur:
    spans.append((cur, cst, cspan))
for txt, st, span in spans:
    need = read_frames(txt)
    reads.append(OrderedDict(shot=st, kind="rail", text=txt, need_frames=need, have_frames=span, ok=span >= need))
for r in out:
    for x in r["text"]:
        if not x.get("must_read") or x["kind"] == "rail":
            continue
        need = read_frames(x["text"])
        have = r["frames"]
        if x["kind"] in ("post",):
            hit = [d for d in r["dialogue"] if d.get("hold") and post_text(d["id"]) == x["text"].strip('"')]
            if hit:
                have = hit[0]["hold"]
        reads.append(OrderedDict(shot=r["id"], kind=x["kind"], text=x["text"], need_frames=need, have_frames=have, ok=have >= need))
    for d in r["dialogue"]:
        if d.get("hold") and not any(x["text"].strip('"') == post_text(d["id"]) for x in r["text"]):
            reads.append(OrderedDict(shot=r["id"], kind="post", text=post_text(d["id"]), need_frames=d["read_min"], have_frames=d["hold"], ok=d["hold"] >= d["read_min"]))
read_fails = [x for x in reads if not x["ok"]]

# ---- V.O. checks (pov-and-framing §5.1, §5.2, §5.5)
events_rec = []  # (start, end, what)
for r in out:
    for d in r["dialogue"]:
        if d["tag"].startswith("[V"):
            events_rec.append((d["abs_in"], r["start_frame"] + d["end"], f"real {'post' if not d['voiced'] else 'line'} {d['id']} ({r['id']})"))
    if r["shotSize"] == "CARD" and (r["rides"] or any(x["kind"] == "quote-card" for x in r["text"])):
        events_rec.append((r["start_frame"], r["end_frame"], f"{'name card' if r['rides'] else 'dated quote card'} {r['id']}"))
    for x in r["text"]:
        if "(REPORTED)" in x["text"] and x["kind"] != "rail":
            events_rec.append((r["start_frame"], r["end_frame"], f"(REPORTED) item {r['id']}"))
for txt, st, span in spans:
    if "(REPORTED)" in txt:
        a = SH[st]["start_frame"] + SH[st]["rail_change"]["at"]
        events_rec.append((a, a + span, f"(REPORTED) rail from {st}"))
vo_checks = []
for r in out:
    for v in r["vo"]:
        a, b = r["start_frame"] + v["at"], r["start_frame"] + v["end"]
        issues = []
        if v["at"] % BEAT:
            issues.append("starts off the beat")
        nxt = [r["start_frame"] + d["at"] for d in r["dialogue"] if d["at"] > v["at"]]
        lim = min([r["end_frame"]] + nxt)
        if lim - b < BEAT:
            issues.append(f"ends {lim - b} f before the next cut/line (< 1 beat)")
        for (ea, eb, what) in events_rec:
            gap = max(ea - b, a - eb)
            if gap < BAR:
                issues.append(f"within 1 bar of {what} (gap {gap} f)")
        for rr in out:
            if rr["rail_change"]:
                ra = rr["rail_change"]["abs"]
                if a - BEAT < ra < b + BEAT:
                    issues.append(f"a rail item types on at {ra} (V.O. {a}-{b}): stagger ≥ 1 beat")
                if rr["rail_change"]["abs"] < a < ra + rr["rail_change"]["read_min"]:
                    issues.append(f"starts {a - ra} f into the rail's {rr['rail_change']['read_min']} f read ({rr['id']})")
        vo_checks.append(OrderedDict(id=v["id"], shot=r["id"], abs_in=a, abs_out=b, tc_in=tc(a), text=v["text"], device=v["device"], status=v["status"],
                                     issues=issues, ok=not [i for i in issues if not i.startswith("starts ") or "off the beat" in i]))
dropout = [r for r in out if r["drop_out"]]
d6 = (dropout[1]["start_frame"] - dropout[0]["start_frame"]) if len(dropout) == 2 else None

# ---- shares (pov-and-framing §4.2; logging rules §4.2 / pov-changes §6)
cat = OrderedDict(W=0, FACES_HANDS=0, POV_SCR=0, GFX=0, PROP_INSERT=0)
sub = OrderedDict(M_2S=0, PORTRAIT_FAMILY=0, CU=0, ECU=0, TILE_FACES=0, NAME_CARDS_ON_FACES=0)
for r in out:
    fr, face, lg = r["frames"], r["face_frames"], r["logged_as"]
    rest = fr - face
    cat["FACES_HANDS"] += face
    if lg in ("MEDIUM", "TWO-SHOT"):
        sub["M_2S"] += face
    elif lg in ("PORTRAIT", "FALLAWAY"):
        sub["PORTRAIT_FAMILY"] += face
        if r["shotSize"] == "CARD":
            sub["NAME_CARDS_ON_FACES"] += face
    elif lg == "CLOSE-UP":
        sub["CU"] += face
    elif lg in ("INSERT-HANDS", "INSERT-PROP"):
        sub["ECU"] += face
    elif lg == "UI-TILE-GRID":
        sub["TILE_FACES"] += face
    elif lg == "WIDE":
        sub["PORTRAIT_FAMILY"] += face  # a [W] with a window typing logs as [P]
    if rest:
        if lg == "WIDE":
            cat["W"] += rest
        elif lg == "UI-TILE-GRID":
            cat["POV_SCR"] += rest
        elif lg in ("BLUEPRINT", "CARD"):
            cat["GFX"] += rest
        elif lg == "INSERT-PROP":
            cat["PROP_INSERT"] += rest
        else:
            raise AssertionError(r["id"])
pct = lambda n, d=TOTAL: round(100 * n / d, 1)  # noqa: E731
TARGETS = OrderedDict(
    W=("10–15%", "AMBER 15–20%, RED > 20%", lambda p: "GREEN" if p <= 15 else ("AMBER" if p <= 20 else "RED")),
    FACES_HANDS=("≥ 55%", "AMBER 45–55%, RED < 45%", lambda p: "GREEN" if p >= 55 else ("AMBER" if p >= 45 else "RED")),
    POV_SCR=("12–18%", "—", lambda p: "IN" if 12 <= p <= 18 else ("HIGH" if p > 18 else "LOW")),
    GFX=("8–10%", "—", lambda p: "IN" if 8 <= p <= 10 else ("HIGH" if p > 10 else "LOW")),
    PROP_INSERT=("—", "prop inserts without a hand are neither a face nor a hand (pov-changes §6)", lambda p: "—"),
)
SUBT = OrderedDict(M_2S=("15–20%", lambda p: "IN" if 15 <= p <= 20 else ("LOW" if p < 15 else "HIGH")),
                   PORTRAIT_FAMILY=("30–35%", lambda p: "IN" if 30 <= p <= 35 else ("LOW" if p < 30 else "HIGH")),
                   CU=("≤ 2%", lambda p: "IN" if p <= 2 else "HIGH"), ECU=("6–9%", lambda p: "IN" if 6 <= p <= 9 else ("LOW" if p < 6 else "HIGH")),
                   TILE_FACES=("—", lambda p: "—"), NAME_CARDS_ON_FACES=("—", lambda p: "—"))
shares = OrderedDict()
for k, n in cat.items():
    p = pct(n)
    shares[k] = OrderedDict(frames=n, seconds=round(n / FPS, 1), pct=p, target=TARGETS[k][0], bands=TARGETS[k][1], verdict=TARGETS[k][2](p))
subshares = OrderedDict()
for k, n in sub.items():
    p = pct(n)
    subshares[k] = OrderedDict(frames=n, seconds=round(n / FPS, 1), pct=p, target=SUBT[k][0], verdict=SUBT[k][1](p))
no_plan = TOTAL - scenes["25"]["frames"]
alt = OrderedDict(
    faces_hands_without_THE_PLAN=pct(cat["FACES_HANDS"], no_plan),
    W_without_THE_PLAN=pct(cat["W"], no_plan),
    faces_hands_if_the_glass_and_prop_inserts_counted=pct(cat["FACES_HANDS"] + cat["PROP_INSERT"]),
    faces_hands_without_tile_faces=pct(cat["FACES_HANDS"] - sub["TILE_FACES"]),
)
scene_shares = OrderedDict()
for sc, v in scenes.items():
    rows = [r for r in out if r["scene"] == sc]
    fr = sum(r["frames"] for r in rows)
    fh = sum(r["face_frames"] for r in rows)
    w = sum(r["frames"] - r["face_frames"] for r in rows if r["logged_as"] == "WIDE")
    scene_shares[sc] = OrderedDict(frames=fr, faces_hands_pct=pct(fh, fr), W_pct=pct(w, fr))
# the I-mode rule (faces ≥ 65 %, [W] ≤ 10 %) on the played scenes; sc 29 pre-avalanche measured apart
pre = [r for r in out if r["scene"] == "29" and IDX[r["id"]] < IDX["29.14"]]
pf = sum(r["frames"] for r in pre)
scene_shares["29 (pre-avalanche)"] = OrderedDict(frames=pf, faces_hands_pct=pct(sum(r["face_frames"] for r in pre), pf),
                                                 W_pct=pct(sum(r["frames"] - r["face_frames"] for r in pre if r["logged_as"] == "WIDE"), pf))
# face every 8 bars in set pieces (movement 4): the longest face-free run
runs, cur_run, cur_from = [], 0, None
for r in out:
    if r["face_frames"]:
        if cur_run:
            runs.append((cur_run, cur_from, prev))
        cur_run, cur_from = 0, None
    else:
        if not cur_run:
            cur_from = r["id"]
        cur_run += r["frames"]
        prev = r["id"]
if cur_run:
    runs.append((cur_run, cur_from, prev))
runs.sort(reverse=True)
longest_faceless = [OrderedDict(frames=n, bars=round(n / BAR, 2), first=a, last=b) for n, a, b in runs[:5]]

# ---- change summary
counts = OrderedDict()
for r in out:
    counts[r["change"]] = counts.get(r["change"], 0) + 1
v1_used = {x for r in out for x in r["v1_id"]}
v1_unused = [s["id"] for s in V1["shots"] if s["id"] not in v1_used]
shotsize_count = OrderedDict()
for r in out:
    shotsize_count[r["shotSize"]] = shotsize_count.get(r["shotSize"], 0) + 1
events_total = sum(r["events"] for r in out)

# ---- assets: used_in + file presence
for a in A.values():
    a["used_in"] = [r["id"] for r in out if any(x["id"] == a["id"] for x in r["assets"])]
    f = a["file"].split(" ")[0] if a["file"] else ""
    a["file_present"] = bool(f) and os.path.exists(P(f))
unused_assets = [a["id"] for a in A.values() if not a["used_in"]]
status_count = OrderedDict()
for a in A.values():
    status_count[a["status"]] = status_count.get(a["status"], 0) + 1

# ---- lines coverage
staged = {l for r in out for l in r["lines"]}
missing_lines = [l for l in LINES if l not in staged]

# ---- totals
by_mode = OrderedDict()
for r in out:
    by_mode[r["prod_mode"]] = by_mode.get(r["prod_mode"], 0) + r["frames"]
printed_total = 10387
band = ((6 * 60 + 54) * FPS, (7 * 60 + 34) * FPS)
totals = OrderedDict(
    shots=len(out), frames=TOTAL, seconds=round(TOTAL / FPS, 3), length=mmss(TOTAL), episode_in=tc(0), episode_out=tc(TOTAL),
    printed_draft31=OrderedDict(frames=printed_total, length="7:12.8", clock="12:31–19:43.8"),
    over_printed=OrderedDict(frames=TOTAL - printed_total, s=round((TOTAL - printed_total) / FPS, 2)),
    band=OrderedDict(length="7:14 ± 0:20 (6:54–7:34)", frames=list(band), in_band=band[0] <= TOTAL <= band[1], headroom_s=round((band[1] - TOTAL) / FPS, 2)),
    board1=OrderedDict(shots=len(V1["shots"]), frames=V1["meta"]["frames"], events=V1["totals"]["visual_events"]),
    lock_draft3=OrderedDict(shots=len(LOCK["shots"]), frames=LOCK["summary"]["act_frames"]),
    visual_events=events_total, visual_events_delta_vs_board1=events_total - V1["totals"]["visual_events"],
    by_shotSize=shotsize_count, by_change=counts, by_prod_mode_seconds={m: round(f / FPS, 1) for m, f in by_mode.items()},
    est_agent_min_mode_rates=round(sum(RATES.get(m, 2.0) * f / FPS for m, f in by_mode.items())),
    est_agent_min_rule_of_thumb=round(0.4 * TOTAL / FPS + 3.5 * events_total),
    dialogue_voiced_s=round(sum(d["frames"] for r in out for d in r["dialogue"] if d["voiced"]) / FPS, 2),
    vo_lines=sum(len(r["vo"]) for r in out), vo_s=round(sum(v["frames"] for r in out for v in r["vo"]) / FPS, 2),
    drop_out_frames=d6, quiet_beat_shots=[r["id"] for r in out if r["quiet_beat"]],
)
offgrid = [r["id"] for r in out if r["start_frame"] % BEAT]
if offgrid:
    problems.append("cuts off the beat grid: " + ", ".join(offgrid))
if missing_lines:
    problems.append("lines not staged: " + ", ".join(missing_lines))

# ============================================================================================================ flags, rulings, sound
RULINGS = [
    ("1", "'super.' as his voice through their speaker, in the dialogue box with no portrait", "As written", "27.01 (a4-27-00: the a4-26-01 take through a laptop-speaker filter; engine dialogueBox tail 'none')"),
    ("2", "'i don't keep score.' or the fallback 'i don't keep things.'", "Score", "26A.01; under the fallback, 26A.02's iris steps to the pocketed pen instead (same length)"),
    ("3", "The six fingers in MAS'S VERSION (A/B at G2)", "Kept as an egg", "29.01a (cast.mas.hand.six + a five-finger copy); if THE OUTSIDER marks '?', cut 29.01a and the V.O. (−1 bar + the line)"),
    ("4", "G1's [CU] cap", "2 per episode", "26.05a + 30.25 (one drawing); the fallback is sc 26 phrase 1's [PF] framing relit behind him"),
    ("5", "Act Four at AMBER for faces and hands", "Accept", f"measured {shares['FACES_HANDS']['pct']}% (the changelog projected 47–48%)"),
    ("6", "Alyi's doorway hold", "2 beats (1 if the MADA card misses)", "30.01 f190-219"),
    ("7", "The relight ruling", "Room only", "every [PF] and both [CU]s: the room steps down; no face is relit"),
]
BOARD_CALLS = [
    ("29.00", "The HIS SIDE rail types on over the home shot (f0), not after it, so the [2S]'s V.O. is the only must-read in its frame (§5.2). Its 50 f read ends at 29.01 f20; the V.O. starts at f15 (start-to-start stagger 3 beats)."),
    ("29.01", "1 bar → 1 bar + 2 beats: the new read (est. 54 f) must end ≥ 1 beat before MAS'S VERSION's hard cut. If the recorded read is ≤ 42 f, it returns to 1 bar with the V.O. at f0."),
    ("29.08", "1 bar → 1 bar + 2 beats, and the separate check-front insert is gone: the check's front reads in the [2S] (≈ 2.2 s + the stamp). prop.check-evirht must be drawn legible at [2S] scale."),
    ("29.10", "V.O. D3 plays over the Orb's [P] (on the lanyard), exactly 1 bar after Rima's last post; HOLD 1 BEAT after the line; then 'mostly.' in the [2S]."),
    ("30.26", "2 beats → 3 beats: 'okay.' (22 f) + the house punch tail."),
    ("26.04c/26.05", "The arrow settles on Cancel in 26.04c; the CLICK is 26.05's first frame, so the D6 drop-out runs exactly 2½ bars (150 f) to the phone's buzz (26.06 f0), as the changelog asks."),
    ("27.20-27.22", "The script's [P2] puts MARIO (silent) in the LEFT window, the only pass-one frame with the left window in use. Everyone still speaks from the right. Default: as scripted; alternative: Adelina's [P] alone with the phone leaving frame."),
    ("27.24", "The second phone, the rent meters and 'Hi. Yes…' are ONE [P] of Mario (two consecutive Mario [P]s would jump-cut)."),
    ("30.13", "'Which room is on fire?' and '…Ah.' are one held TERB window; the room behind it turns at f60."),
    ("30.17", "The long hold (bar 1) and the stamp (bar 2) are one [2S] (the same frame)."),
    ("31.09", "Board 1's close on the observer chair is a tighter plate of the bullpen, so it logs [W] (3.1 prints [W]) and the seat text stays legible."),
    ("29.00 (logging)", "The home shot (the glass) is logged a prop insert with no hand (strict §4.2): not a face or a hand. Counted, faces + hands would rise by 30 f."),
]
FLAGS = [
    ("length", "note", f"The act boards to {mmss(TOTAL)} ({TOTAL} f) against the printed 7:12.8: +{round((TOTAL - printed_total) / FPS, 1)} s, all from recorded dialogue, new-read estimates and read time (sc 27 +{scenes['27']['delta_s']} s, sc 29 +{scenes['29']['delta_s']} s, sc 30 +{scenes['30']['delta_s']} s, sc 31 +{scenes['31']['delta_s']} s). It is INSIDE the 6:54–7:34 band with {totals['band']['headroom_s']} s to spare, which is the writer's synthetic-voice allowance case. If the slate reads long, the writer's order: BUKAJ's toast (27.02, −0.6 s), the pass-one hold 1 → 0 beats (27.01, −0.6 s), Mario's second phone (27.24, −5 s). Never hearts 8 → 6."),
    ("events", "warn", f"Visual events {events_total} vs board 1's {V1['totals']['visual_events']} (+{events_total - V1['totals']['visual_events']}), above the changelog's +15–20 projection: Ep1 ≈ 1,{400 + events_total - V1['totals']['visual_events']} against the ≈ 1,300 cap. The close tier adds drawings (hands, eyes, the Orb's iris steps, the [PF] step-downs). Offsets already taken: the new-board wide, the lobby walk-in, the desks, the eyelines, the hover."),
    ("engine", "resolved", "THE PLAN's #7FDBFF / #0B1E3F: the blueprint kit ships its own palette set (kits-fx). Board 1's BLOCKER is closed."),
    ("engine", "open", "The rail band (y 203-269): bullpen stops at y 203, the boardroom paints to y 236. Rule opaque band or dimmed overlay (board 1 recommended the overlay). The side labels ride it."),
    ("engine", "note", "Glyphs the engine font lacks: `∞` (NELEH's card), `…` (rewinding…, the posts), `~` (the rail, the check). The kits draw their own; the post-ui / cards kits must too."),
    ("engine", "note", "freeze.ts covers only gerg / alyi / mario / nole: the six Blip cards need the generic print (kit.cards), Mas masked live; TERB's is a FULL freeze with Mas walking in colour."),
    ("engine", "W0", "W0 calibration trio: sc 26 (C02), 26A (C03) and the calm-off [2S] 30.14-30.17 (C11). Log [PF], [CU], [ECU], [M]/[2S] and the drop-out apart from the salvaged grid."),
    ("engine", "W0", "[PF] method for holds > 2 beats (26.02a, 26A.05, 27.15, 29.17a, 30.08): resolve() with the key near zero vs a family step (PIXEL_GUIDE: family steps never for long holds). Art-director ruling."),
    ("cast", "parallel", "At board time a parallel stage had started cast/mas-cu.ts (masCU, drawMasCU, drawEyesStrip stub), cast/mas-medium.ts (drawMasMedium) and cast/medium-kit.ts. The asset list marks them NEW with the file present; verify before the chunks that need them (C02, C03)."),
    ("cast", "CHECK", "The Orb's iris targets at [2S] scale (tally marks 1, 2, 3, his thumb, the phone, the lanyard, his face) and the Orb's promotion from dev/mcoldopen/orb.ts to a shared cast file."),
    ("rooms", "CHECK", "Lighthouse: the rent meters must sit clear of the right window (x 356-468, y 24-160) to read behind Mario's [P] (27.24)."),
    ("dialogue", "record", "New reads: a4-26a-vo1 'i don't keep score.' (+ the alt 'i don't keep things.'), a4-29-vo1 'i put the phone down.', a4-29-vo2 'the badge was a joke.'. Re-take: a4-29-03 'mostly.'. Process: a4-27-00 (laptop-speaker filter on a4-26-01). Scratch in the cut: a4-26a-vo2 and a4-29-vo3 (the editor's). Retire: a4-26-vo1 (sc 26), a4-29-02."),
    ("facts", "lock", "[V/K] on screen with RECONSTRUCTED until settled: 'We are below them, above them, around them.' (30.05-30.07), `~$86B` (29.08), `LEFT EARLIER IN 2023` (25.02). Re-fetch casing: Gerg's '…I quit.' (27.01a) and 'Returning to NopeAI…' (30.20). `ALYI (REPORTED)` needs a facts row (29.07). Time zones (PT) in 24.01, 26A.03, 27.32, 29.00, 30.09."),
    ("guardrails", "rule", "Mas never touches tally marks 1 and 2 (26A.01: the thumb rests on mark 3 only; the Orb's look is the only thing that touches 1 and 2)."),
    ("guardrails", "rule", "No hover on the firing call (26.06); no eyelines before 'leave it open.' (29.13); the three hearts to Alyi rise OFF the beat, his face unchanged (30.01)."),
    ("guardrails", "rule", "The check lands as pure record (29.08): nothing of his (line, look, hand) within a bar of it; Gerg's tile follows directly."),
    ("guardrails", "rule", "Pass one (sc 27): no V.O., no devices, no Mas portrait window; everyone speaks from the right. He appears as posts, the security tile and his voice on their call."),
    ("guardrails", "rule", "MAS'S VERSION has no rim and no on-screen label: the correction reads on the matching-frame cut alone."),
    ("guardrails", "rule", "Private individuals: the employee tiles, the reposting avatars and the letter's signatures are generic and unidentifiable; the maintenance workers are hands only. No clock or timestamp on the security tile or the call UI. No F1 / race marks in Las Vegas."),
    ("guardrails", "rule", "X1: nobody enters the dark room: Gerg is a video tile; Tasya's door appears with the key in the lock and stays shut."),
    ("guardrails", "rule", "Photosensitivity: nothing new flashes. The heart pour (27.09-27.10) and the door bang (30.10, hallway flash ≤ 1 frame) go through the luminance and red-flash audit."),
    ("continuity", "ask", "TERB's full freeze runs 2 bars here (30.11 1½ bars + the pin insert 30.12), as board 1: director to confirm."),
    ("continuity", "ask", "27.26: Mas's post sits UPSIDE-DOWN in the security tile (read-load risk). Fallback: upright 2 beats, then the drawn upside-down version."),
    ("continuity", "resolved", "Board 1's asks closed by 3.1: NELEH writes `?` only (no illegible word); the board's left window stays empty (not 'the BOARD holds the left window'); the legend line 'a medium is a tighter authored plate' is dropped."),
]
sfx_new, sfx_reuse = set(), set()
for r in out:
    for x in r["sfx"]:
        for m in re.finditer(r"NEW ([A-Za-z_0-9]+)", x):
            sfx_new.add(m.group(1))
        m = re.match(r"([A-Za-z_0-9]+) \(REUSE", x)
        if m:
            sfx_reuse.add(m.group(1))
SOUND = OrderedDict(new=sorted(sfx_new), reuse=sorted(sfx_reuse), score_and_mix=[
    "D6 DROP-OUT: 26.05 f0 (the click) → 26.06 f0 (the buzz), 150 f = 2½ bars; the silent [CU] and the silent rail inside it; NO V.O.",
    "score.keynote-piano (29.01a): original, 1 bar, killed mid-phrase by the hard cut; the first heart Tick on 29.03's downbeat.",
    "score.violin (30.01): under Alyi's post only; a dead stop on the first heart; the 2-beat hold is room tone.",
    "Hearts to Alyi: three heart_gliss notes at the post's own pace, OFF the grid (f144, f156, f171).",
    "The quiet beat (29.12q · 29.11c · 29.12r): keycaps only, no music; no music under the V.O. D8 or Tasya's line.",
    "mix.laptop-speaker: a4-27-00 on the board's call (27.01), the call's room tone under it; nobody reacts.",
    "30.24: Cancel greys over three held beats; alert_bonk on beat 4 as the on-screen arrow clicks.",
])

# ============================================================================================================ emit JSON
CONV = OrderedDict(
    shotSizes=OrderedDict([
        ("WIDE", "[W] the room wide: 480x203 + the rail band, adults 70-90 px. Also any TIGHTER PLATE OF A ROOM (pov-changes: tags). A new room ≤ 1 bar; the physical gag; the set-piece scale."),
        ("MEDIUM", "[M] a principal's waist-up RIG and nothing else (head ≈ 32-40 px, Mas in the left third). Medium rigs: Mas, the Orb, NELEH, MADA (+ GERG as a medium tile)."),
        ("TWO-SHOT", "[2S] two figures at medium scale under one key light (the Orb at this scale is a sphere and an iris). Medium plates: the dark-room desk, the boardroom table."),
        ("PORTRAIT", "[P] / [P2] the approved 112x136 windows over the held room: MAS LEFT (x12 y24), the other RIGHT (x356 y24). In pass one everyone speaks from the right."),
        ("FALLAWAY", "[PF] a portrait window with the room's key stepped down behind it (resolve() with the key near zero, or one family step ≤ 2 beats). The room steps down; the face is never relit."),
        ("CLOSE-UP", "[CU] Mas full frame, head ≈ 140 px: ONE silent drawing, two uses (26.05a, 30.25); the backdrop carries the light."),
        ("INSERT-HANDS", "[ECU] Mas's hands/eyes kit: his hands, the eyes strip (480x64), MAS'S VERSION's matching frame. Counts as faces+hands."),
        ("INSERT-PROP", "[ECU] a prop insert: an object, with or without someone's hand (hand_in_frame). Counts as faces+hands ONLY with a hand in frame."),
        ("UI-TILE-GRID", "[POV] his screen full-bleed / [SCR] a screen with its bezel (the world's view): grids, feeds, the monitor, the security tile. A video tile that fills ≥ half the frame counts as a face (face_frames)."),
        ("BLUEPRINT", "[GFX] THE PLAN: full 480x270, no rail."),
        ("CARD", "[GFX] full-screen dated quote cards and the act-out card; NAME CARDS ride a live shot and log as the shot they ride (rides)."),
    ]),
    tag_to_shotSize=OrderedDict([("[W]", "WIDE"), ("[M]", "MEDIUM"), ("[2S]", "TWO-SHOT"), ("[P]", "PORTRAIT"), ("[P2]", "PORTRAIT (two windows)"), ("[PF]", "FALLAWAY"),
                                 ("[CU]", "CLOSE-UP"), ("[ECU] (Mas's hands / eyes / his version)", "INSERT-HANDS"), ("[ECU] (a prop insert)", "INSERT-PROP"),
                                 ("[POV] / [SCR]", "UI-TILE-GRID"), ("[GFX] THE PLAN", "BLUEPRINT"), ("[GFX] cards / CARD", "CARD")]),
    side="Told-twice side labels: BOARD = pass one (sc 27, the exit; rail `NOV 17 · EARLIER · THE BOARD'S SIDE`); MAS = everything else (his POV; pass two's rail ends `· HIS SIDE`). side_note says which part.",
    vo="Each shot's `vo` lists its MAS (V.O.) lines: id, text, device, at/end (shot frames), status (NEW READ est. / SCRATCH / RECORDED), what catches it. V.O. text: x 12, baseline y 198, 1-px N0 shadow, cyan one step down, 0.5 ch/f.",
    change=OrderedDict(CARRY="unchanged from board 1 (content carried by v1_id; the length may differ where the recorded lines set it: compare v1_frames)", CHANGED="same framing, different action or text", REFRAME="same beat, a different size or framing",
                       RETAG="the same drawing under the correct tag", RETIME="a new length", REORDER="moved", SPLIT="board 1's multi-line shot cut per line (single windows)",
                       NEW="a shot board 1 never had (3.1 adds, or draft 3's never-boarded shots)"),
    logging=["A [W] with a portrait window open logs as [P] only while a line is typing in it (face_frames).", "A name card logs as the shot it rides (rides).",
             "A prop insert without a hand isn't a face or a hand.", "[M] and [2S] are logged apart from [PF], [CU] and [ECU].",
             "A video tile counts as a face only when it fills ≥ half the frame (Gerg's tile; the half-frame beats in the avalanche)."],
    holds=V1["conventions"]["holds"], grid="Every cut on the act's beat grid (act frame 0 = 12:31:00). Scenes 24-26A sit exactly on 3.1's printed clock; from sc 27 the recorded lines set the length and the grid is kept.",
    rail="RAIL text types on when it changes and persists across cuts until replaced; hidden on BLUEPRINT and full-screen cards. [V/K] items carry RECONSTRUCTED until upgraded.",
    posts="Posts are unvoiced pop-ups in source casing (hold ceil_beat(0.25 s + 0.05 s/char) + 1 beat), except the read-aloud ones (TASYA 27.33, ALYI 30.01) and the voiced memo (31.06).",
    switches="BASE is the show. Tagged switches only: [BLUEPRINT] flash-print on 24.03's last beat → 25.07; [GLYPH] 20 f in 26.05 (use 2 of 2); [EARLY-WEB16] 26.11 f6 → 26.13 (F1.2); [2-TONE FREEZE] on the six Blip cards (Mas never freezes). MAS'S VERSION is a stillness flag, not a switch.",
    asset_status=OrderedDict(EXISTS="built by the Act Four prep (file + function named)", REUSE="a show / engine asset from before the prep", SALVAGE="port from a dev slot (never edit the original)",
                             CHANGED="exists; needs a new option or state (additive, in a new file where it's someone else's module)", CHECK="exists; confirm at the board's scale",
                             NEW="to build"),
    owners=V1["conventions"]["owners"], prod_modes=V1["conventions"]["prod_modes"], mode_rates_agent_min_per_s=RATES,
)
meta = OrderedDict(
    show="MR. MAS", episode="ep01 · research_preview", act="ACT FOUR · THE BLIP, TOLD TWICE", scenes="24–31 (incl. 26A, 28)",
    source="show/episodes/ep01/script.md Act Four DRAFT 3.1 (the POV pass, after its table read) + production/act4/pov-changes.md (rulings at their defaults), 2026-09-25",
    board="board 2 (v2). Content carried from board 1 (shots.json, draft 2) by v1_id; draft-3 lock ids (shots-locked.json) in lock_id for THE EDITOR's re-lock",
    owner="storyboard artist / 1st AD", status="board 2 · sized to the RECORDED lines (lines.json) with the lock's house rules; the three new V.O. reads are estimates",
    frames=TOTAL, seconds=round(TOTAL / FPS, 3), fps=FPS, bpm=96, frames_per_beat=BEAT, frames_per_bar=BAR,
    canvas="480x270 native, 4x nearest to 1920x1080; room area y 0-202, RAIL band y 203-269; V.O. band y 182-203",
    timecode="episode clock mm:ss:ff at 24 fps; start_frame / end_frame are act-relative (0 = 12:31:00); end is exclusive",
    generator="studio/src/episodes/ep01/act4/board/tools/board_v2.py (re-run after a re-record or a ruling; don't hand-edit the outputs)",
    line_ids="audio/ep01/act4/dialogue/lines.json ids (a4-<scene>-<nn>) + the 3.1 V.O. ids (a4-26a-vo1/2, a4-29-vo1/2/3) + a4-27-00 (derived)",
)
lines_out = []
for lid, Ld in LINES.items():
    where = [r["id"] for r in out if lid in r["lines"]]
    lines_out.append(OrderedDict(id=lid, scene=Ld["scene"], speaker=Ld["speaker"], text=Ld["text"], tag=Ld["tag"], mode=Ld["mode"], voiced=Ld["voiced"],
                                 frames=Ld["frames"] if Ld["voiced"] else None, status=Ld["status"], file=Ld["file"], shots=where))
crosswalk = []
for s in V1["shots"]:
    v2 = [r["id"] for r in out if s["id"] in r["v1_id"]]
    crosswalk.append(OrderedDict(v1=s["id"], v1_framing=s["framing"], v1_frames=s["frames"], v2=v2, v2_shotSize=sorted({SH[x]["shotSize"] for x in v2}),
                                 fate="CUT" if not v2 else ("CARRY" if len(v2) == 1 and SH[v2[0]]["change"] == "CARRY" else "CHANGED")))
doc = OrderedDict(
    meta=meta, conventions=CONV, totals=totals, scenes=list(scenes.values()), shots=out, lines=lines_out, retired_lines=RETIRED_LINES,
    vo=vo_checks, cuts=CUTS, crosswalk_v1=crosswalk,
    shares=OrderedDict(categories=shares, sub=subshares, variants=alt, by_scene=scene_shares, longest_faceless_runs=longest_faceless,
                       note="Time-weighted over the act's boarded frames. Categories sum to 100%. Targets: pov-and-framing §4.2 (story-wide); Act Four is ruled AMBER by default (ruling 5)."),
    chunks=chunks, assets=list(A.values()), assets_no_longer_needed=[OrderedDict(asset=a, status=b, why=c) for a, b, c in NO_LONGER],
    read_checks=reads, rulings_used=[OrderedDict(n=a, ruling=b, default=c, where=d) for a, b, c, d in RULINGS],
    board_calls=[OrderedDict(shot=a, call=b) for a, b in BOARD_CALLS], flags=[OrderedDict(area=a, level=b, text=c) for a, b, c in FLAGS],
    sound=SOUND, problems=problems,
)
json.dump(doc, open(os.path.join(PROD, "shots-v2.json"), "w"), indent=1, ensure_ascii=False)

# ============================================================================================================ emit Markdown
def esc(x):
    return str(x).replace("|", "\\|")


def js(xs, sep=" "):
    return sep.join(xs)


M = []
w = M.append
cut_n = sum(len(c["ids"]) for c in CUTS if c["src"] in ("v1", "draft-3 lock"))
w("# MR. MAS · Ep1 · Act Four · THE BLIP, TOLD TWICE — shot list v2 (draft 3.1)")
w("")
w(f"*Storyboard / 1st AD · board 2 · from [script.md](../../script.md#act-four--the-blip-told-twice) Act Four **draft 3.1** and [pov-changes.md](pov-changes.md) (every open ruling at its default), 2026-09-25. "
  f"Machine-readable twin: [shots-v2.json](shots-v2.json) (the JSON wins if the two ever disagree). Generator: `{meta['generator']}`. Board 1 ([shotlist.md](shotlist.md), draft 2) is superseded.*")
w("")
w("## Read this first")
w("")
w(f"- **Length.** {TOTAL} f = **{mmss(TOTAL)}** · episode {tc(0)}–{tc(TOTAL)} · **{len(out)} shots** · 12 chunks. The printed draft-3.1 clock is 7:12.8 (10,387 f); the board runs **+{totals['over_printed']['s']} s** because it is sized to the **recorded** lines (the lock's house rules) and to read time. That is **inside the 7:14 ± 0:20 band** (6:54–7:34) with {totals['band']['headroom_s']} s to spare: the writer's synthetic-voice allowance case. Scenes 24–26A sit exactly on the printed clock.")
w(f"- **Against board 1** ({len(V1['shots'])} shots, 7:14 of draft 2): {counts.get('CARRY', 0)} shots carried unchanged, {sum(v for k, v in counts.items() if k not in ('CARRY', 'NEW'))} carried with a change (reframe / retag / retime / reorder / split / changed), {counts.get('NEW', 0)} new; 4 board-1 shots cut outright (27.34, 29.02, 29.09, 30.19) and the draft-3 shots 3.1 cuts are gone (the eyelines, the doorway [M], the thumb insert, Gerg-leaves). Full crosswalk below.")
w(f"- **Shot-size shares vs the bible** (§4.2): faces + hands **{shares['FACES_HANDS']['pct']}%** (AMBER; ruling 5 accepts it; {alt['faces_hands_without_THE_PLAN']}% without THE PLAN) · wides **{shares['W']['pct']}%** (GREEN, target 10–15%) · [POV] + [SCR] {shares['POV_SCR']['pct']}% · [GFX] {shares['GFX']['pct']}% · prop inserts with no hand {shares['PROP_INSERT']['pct']}%. Inside faces + hands: [M] + [2S] {subshares['M_2S']['pct']}% (LOW vs 15–20%), the portrait family {subshares['PORTRAIT_FAMILY']['pct']}% (vs 30–35%), [CU] {subshares['CU']['pct']}%, [ECU] {subshares['ECU']['pct']}%.")
w(f"- **V.O.** {totals['vo_lines']} lines, {totals['vo_s']} s; every one starts on a beat, ends ≥ 1 beat before a cut or line, and sits ≥ 1 bar from the record. **Three are new reads** (sized by estimate): `a4-26a-vo1`, `a4-29-vo1`, `a4-29-vo2`. No V.O. in sc 26, pass one or the return.")
w(f"- **Assets.** {status_count.get('EXISTS', 0)} exist (built by the prep), {status_count.get('REUSE', 0)} reuse, {status_count.get('CHANGED', 0)} need a new option, {status_count.get('CHECK', 0)} need a check, {status_count.get('SALVAGE', 0)} salvage, **{status_count.get('NEW', 0)} new** (the close tier: Mas's [CU] + eyes, 7 hand drawings, 4 medium rigs + the Orb's, 2 medium plates, 3 expression swaps, the post-ui and cards kits, 5 insert-scale props / plates, 2 engine helpers, the piano). Parallel stages had started `cast/mas-cu.ts` and `cast/mas-medium.ts` while this board was drawn.")
w("- **Board calls** a reviewer should look at first: 29.00 (the HIS SIDE rail on the home shot), 29.01 / 29.08 / 30.26 (+2, +2, +1 beats for read time), 27.20 (Mario in the left window), 26.04c→26.05 (the click on the cut: D6 = exactly 2½ bars). All in [Board calls](#board-calls-rulings-and-flags).")
w("")
w("## How to read this")
w("")
w("| shotSize | Tag | Meaning |")
w("|---|---|---|")
for k, v in CONV["shotSizes"].items():
    tag = {"WIDE": "`[W]`", "MEDIUM": "`[M]`", "TWO-SHOT": "`[2S]`", "PORTRAIT": "`[P]` `[P2]`", "FALLAWAY": "`[PF]`", "CLOSE-UP": "`[CU]`", "INSERT-HANDS": "`[ECU]`",
           "INSERT-PROP": "`[ECU]` (prop)", "UI-TILE-GRID": "`[POV]` `[SCR]`", "BLUEPRINT": "`[GFX]`", "CARD": "`[GFX]` / CARD"}[k]
    w(f"| **{k}** | {tag} | {esc(re.sub(r'^(\[[A-Z0-9]+\]( / \[[A-Z0-9]+\])? )', '', v))} |")
w("")
w("- **side** (told-twice labels): **BOARD** = pass one, sc 27 (the exit; its rail names the side); **MAS** = everything else, his POV (pass two's rail ends `· HIS SIDE`).")
w("- **vo**: the shot's `MAS (V.O.)` lines with device, frames and status. **Change** codes: " + " · ".join(f"**{k}** {v}" for k, v in CONV["change"].items()) + ".")
w("- **Logging** (pov-and-framing §4.2, pov-changes §6): " + " ".join(CONV["logging"]))
w("- **Sizing.** Printed bar / beat counts are kept. Dialogue shots without a printed length: lead 4 f + the recorded line(s) + gaps 8 f + HOLDs + tail 8 f (a punchline 15 f), rounded up to the beat. Posts hold their read time + 1 beat. " + CONV["grid"])
w("- **Mas stays in the left third, three-quarter, at every size; the other character on the right.** Lighting notes step the ROOM down; no face is relit (ruling 7).")
w("- " + CONV["switches"])
w("- Dropped from board 1's legend: \"a 'medium' is a tighter authored plate of the same room\" (a tighter plate is `[W]`; `[M]` is a principal's rig) and \"the BOARD holds the left window\" in pass one.")
w("")
w("## The act at a glance")
w("")
w("| Sc | Heading | Side | Printed 3.1 | Boarded | Frames (printed) | Δ | Shots |")
w("|---|---|---|---|---|---|---|---|")
for sc, v in scenes.items():
    w(f"| {sc} | {esc(v['title'])} | {v['side']} | {v['printed_clock']} ({esc(v['printed_bars'])}) | {v['tc_in']}–{v['tc_out']} | {v['frames']} ({v['printed_frames']}) | {v['delta_frames']:+d} f ({v['delta_s']:+.2f} s) | {v['shots'][0]}–{v['shots'][-1]} ({v['n_shots']}) |")
w(f"| **Act** | | | 12:31–19:43.8 (7:12.8) | {tc(0)}–{tc(TOTAL)} | **{TOTAL}** (10387) | **{TOTAL - printed_total:+d} f ({(TOTAL - printed_total) / FPS:+.2f} s)** | **{len(out)}** |")
w("")
w("**Shot mix:** " + " · ".join(f"{k} {v}" for k, v in shotsize_count.items()) + f". **Visual events** ≈ {events_total} (board 1: {V1['totals']['visual_events']}).")
w("")
w("## Shot-size shares vs the bible")
w("")
w("Time-weighted over the act's 139 cuts, logged by the §4.2 rules (a name card as the shot it rides; a `[W]` with a window typing a line as `[P]` for those frames; a video tile as a face only when it fills half the frame; a prop insert only with a hand).")
w("")
w("| Tier | Frames | Seconds | Share | Bible target | Verdict |")
w("|---|---|---|---|---|---|")
names = {"W": "`[W]` wides", "FACES_HANDS": "**Faces + hands** (`[M]` `[2S]` `[P]` `[P2]` `[PF]` `[CU]` `[ECU]`)", "POV_SCR": "`[POV]` + `[SCR]`", "GFX": "`[GFX]` (THE PLAN, quote cards, the act-out card)",
         "PROP_INSERT": "Prop inserts with no hand"}
for k, v in shares.items():
    w(f"| {names[k]} | {v['frames']} | {v['seconds']} | **{v['pct']}%** | {v['target']} ({esc(v['bands'])}) | {v['verdict']} |")
w("")
w("| Inside faces + hands | Frames | Seconds | Share of the act | Target | |")
w("|---|---|---|---|---|---|")
subn = {"M_2S": "`[M]` + `[2S]`", "PORTRAIT_FAMILY": "Portrait family `[P]` `[P2]` `[PF]` (+ name cards riding them, + a `[W]` window while it types)", "CU": "`[CU]`",
        "ECU": "`[ECU]` hands, eyes, prop inserts with a hand", "TILE_FACES": "Video tiles ≥ half frame (Gerg; the avalanche's half-frame beats)", "NAME_CARDS_ON_FACES": "(of which: name cards riding a face)"}
for k, v in subshares.items():
    w(f"| {subn[k]} | {v['frames']} | {v['seconds']} | {v['pct']}% | {v['target']} | {v['verdict']} |")
w("")
w(f"- **Variants:** faces + hands without THE PLAN **{alt['faces_hands_without_THE_PLAN']}%** (wides {alt['W_without_THE_PLAN']}%); if the glass home shot and the no-hand prop inserts were counted, {alt['faces_hands_if_the_glass_and_prop_inserts_counted']}%; without the video-tile faces, {alt['faces_hands_without_tile_faces']}%.")
w(f"- **Against the changelog's projection** (faces + hands ≈ 47–48%, `[W]` ≈ 13%, `[POV]` + `[SCR]` ≈ 23%, `[GFX]` ≈ 13%): the board measures {shares['FACES_HANDS']['pct']}% / {shares['W']['pct']}% / {shares['POV_SCR']['pct']}% / {shares['GFX']['pct']}%. The gain is the recorded dialogue: portrait shots grew with the real line lengths. Still **AMBER** (45–55%): ruling 5 accepts it; the other acts must run ≈ 58–60% faces for the episode to reach 55%.")
w(f"- **`[M]` + `[2S]` is LOW ({subshares['M_2S']['pct']}%)** by design: 3.1 keeps mediums to principals in home rooms (5 rigs, 2 plates). Moving more beats into the tier would mean rigs the changelog just cut.")
w("- **By scene** (the I-mode rule asks faces ≥ 65% and `[W]` ≤ 10% of played scenes; set-pieces may run `[W]` 50–70% with a face every 8 bars):")
w("")
w("| Sc | Frames | Faces + hands | `[W]` |")
w("|---|---|---|---|")
for sc, v in scene_shares.items():
    w(f"| {sc} | {v['frames']} | {v['faces_hands_pct']}% | {v['W_pct']}% |")
w("")
w("  Pass one (27: " + f"{scene_shares['27']['faces_hands_pct']}%) and pass two before the avalanche ({scene_shares['29 (pre-avalanche)']['faces_hands_pct']}%) clear 65%. 26A ({scene_shares['26A']['faces_hands_pct']}%) is held down by the 9:32 post and the wallet (both record, no hand). Sc 30's wides are the landlord set-piece; sc 31's are the vault walk and the observer chair (each the beat's one wide).")
w("- **Longest runs without a face:** " + "; ".join(f"{x['first']}–{x['last']} {x['bars']} bars" for x in longest_faceless) + ". Only THE PLAN (17 bars, the show's voice by design) exceeds the 8-bar set-piece rule.")
w("")
w("## What changed from board 1")
w("")
w("| Change | Shots |")
w("|---|---|")
for k, v in counts.items():
    w(f"| {k} | {v}: " + ", ".join(r["id"] for r in out if r["change"] == k) + " |")
w("")
w("**Cut** (board 1 and draft-3 shots that 3.1 removes or folds):")
w("")
for c in CUTS:
    w(f"- `{', '.join(c['ids'])}` ({c['src']}): {c['why']}.")
w("")
w("<details><summary>Crosswalk: every board-1 shot → board 2</summary>")
w("")
w("| v1 | v1 framing | v1 f | → v2 | v2 shotSize | fate |")
w("|---|---|---|---|---|---|")
for c in crosswalk:
    w(f"| {c['v1']} | {c['v1_framing']} | {c['v1_frames']} | {', '.join(c['v2']) or '—'} | {', '.join(c['v2_shotSize']) or '—'} | {c['fate']} |")
w("")
w("</details>")
w("")
w("---")
w("")
cur_sc = None
for r in out:
    if r["scene"] != cur_sc:
        cur_sc = r["scene"]
        v = scenes[cur_sc]
        w(f"## {cur_sc}. {v['title']} · {v['style']} · {v['mode']} · side {v['side']} · {v['tc_in']}–{v['tc_out']} · {v['frames']} f (printed {v['printed_clock']}, {v['printed_bars']})")
        w("")
        w(f"*{v['side_note']}.*" + (" *" + esc(V1S[v['shots'][0]]['room'] if False else "") + "*" if False else ""))
        w("")
    hdr = f"### {r['id']} · {r['shotSize']} `{r['tag']}` · {r['frames']} f ({r['grid']}) · {r['tc_in']}–{r['tc_out']} · {r['side']} · {r['chunk']} · {r['change']}"
    w(hdr)
    w("")
    if r["change_note"]:
        w(f"- **Change:** {r['change_note']}" + (f" *(script: {r['script_len']})*" if r['script_len'] and 'script' not in str(r['script_len']) else (f" *({r['script_len']})*" if r['script_len'] else "")))
    w(f"- **Room / view:** {r['room'] or '—'}" + (f" · *{r['framing_note']}*" if r["framing_note"] else ""))
    if r["characters"]:
        w(f"- **Characters:** {js(r['characters'], ' · ')}")
    if r["action"]:
        w(f"- **Action:** {js(r['action'])}")
    for d in r["dialogue"]:
        if d["voiced"]:
            w(f"- **Line** `{d['id']}` {d['speaker']}: \"{d['text'].strip(chr(34))}\" {d['tag']} · f{d['at']}–{d['end']} ({d['frames']} f) · {d['status']}")
        else:
            w(f"- **Post** `{d['id']}` {d['speaker']}: \"{d['text'].strip(chr(34))}\" {d['tag']} · f{d['at']}–{d['end']} (held {d['hold']} f, needs {d['read_min']})")
    for v in r["vo"]:
        w(f"- **V.O.** `{v['id']}` MAS (V.O.) `{v['tag']}`: *{v['text']}* · f{v['at']}–{v['end']} ({v['frames']} f) · {v['status']} · caught by: {v['caught_by']}")
    if r["rail_change"]:
        w(f"- **Rail:** `{r['rail_change']['text']}` types on at f{r['rail_change']['at']} (read ≥ {r['rail_change']['read_min']} f; it persists)")
    elif r["rail_shown"] is None:
        w("- **Rail:** hidden")
    oth = [x for x in r["text"] if x["kind"] != "rail"]
    if oth:
        w("- **On screen:** " + " · ".join(f"{x['kind']} `{x['text']}`" + (f" {x['tag']}" if x.get('tag') else "") + ("" if x.get("must_read") else " (not must-read)") for x in oth))
    if r["switches"]:
        w(f"- **Switch:** {js(['`' + x + '`' for x in r['switches']], ' · ')}")
    snd = []
    if r["sfx"]:
        snd.append("SFX " + ", ".join(r["sfx"]))
    if r["music"]:
        snd.append("MUSIC " + r["music"])
    if r["drop_out"]:
        snd.append(f"DROP-OUT [D6] {r['drop_out'].upper()}")
    if snd:
        w(f"- **Sound:** {' · '.join(snd)}")
    if r["gags"]:
        w(f"- **Gags / eggs:** {js(r['gags'])}")
    if r["assets"]:
        w("- **Assets:** " + " · ".join(f"{a['status']} `{a['id']}` ({a['owner']})" for a in r["assets"]))
    lg = r["logged_as"]
    lgt = f"faces + hands {r['face_frames']} of {r['frames']} f" if r["face_frames"] else "not a face or a hand"
    w(f"- **Logged as:** {lg}{' (rides it)' if r['rides'] else ''} · {lgt}{' · quiet beat (q)' if r['quiet_beat'] else ''} · {r['prod_mode']} · {r['events']} events")
    if r["notes"]:
        w(f"- **Notes:** {js(r['notes'])}")
    cw = []
    if r["v1_id"]:
        cw.append("v1 " + ", ".join(r["v1_id"]))
    if r["lock_id"]:
        cw.append("draft-3 lock " + ", ".join(r["lock_id"]))
    w(f"- **Crosswalk:** {' · '.join(cw) or 'new'}")
    w("")
w("---")
w("")
w("## V.O. (draft 3.1: five lines, all [INVENTED], lowercase)")
w("")
w("| Id | Shot | Tc | Line | Device | Frames | Status | Checks |")
w("|---|---|---|---|---|---|---|---|")
for v in vo_checks:
    L_ = LINES[v["id"]]
    w(f"| `{v['id']}` | {v['shot']} | {v['tc_in']} | *{v['text']}* | {v['device']} | {L_['frames']} | {esc(v['status'])} | {'✓ ' if v['ok'] else '✗ '}{esc('; '.join(v['issues']) or 'clean')} |")
w("")
w("- Rules held: starts on a beat; ends ≥ 1 beat before a cut or a spoken line; ≥ 1 bar from any real line, dated quote card, name card, freeze or `(REPORTED)` item; never over the dialogue box; its text band (y 182–203) framed on shadow. None in sc 26 (the candor card's scene and the drop-out), none in pass one, none after 'gerg never waits to be asked.'.")
w("- The Orb never reacts to a V.O. line: it is on the lanyard before D3 (29.04), and it reads his face before `rewinding…` (26A.06).")
w("- **Retired:** " + "; ".join(f"`{x['id']}` {x['text']} ({x['why']})" for x in RETIRED_LINES) + ".")
w("")
w("## Dialogue index")
w("")
w("| Id | Sc | Speaker | Line | Mode | Frames | Status | Shots |")
w("|---|---|---|---|---|---|---|---|")
for Ld in lines_out:
    w(f"| `{Ld['id']}` | {Ld['scene']} | {Ld['speaker']} | {esc(Ld['text'])} | {Ld['mode']} | {Ld['frames'] if Ld['frames'] else 'post'} | {esc(Ld['status'])} | {', '.join(Ld['shots'])} |")
w("")
w("## ASSET LIST")
w("")
w("Status: " + " · ".join(f"**{k}** {v}" for k, v in CONV["asset_status"].items()) + ". `file ✓` = the file existed when the board was generated.")
w("")
w("| Status | Count |")
w("|---|---|")
for k in ("NEW", "CHANGED", "CHECK", "SALVAGE", "EXISTS", "REUSE"):
    w(f"| {k} | {status_count.get(k, 0)} |")
w("")
ORDER = ["NEW", "CHANGED", "CHECK", "SALVAGE", "EXISTS", "REUSE"]
for owner in ["rooms-a", "rooms-b", "cast", "kits", "engine", "score", "dialogue/mix"]:
    rows = [a for a in A.values() if a["owner"] == owner]
    if not rows:
        continue
    rows.sort(key=lambda a: (ORDER.index(a["status"]), a["id"]))
    w(f"### {owner}")
    w("")
    w("| Status | Asset | File · function | Needs | Used in |")
    w("|---|---|---|---|---|")
    for a in rows:
        f = (a["file"] + (" ✓" if a["file_present"] else "")) if a["file"] else "—"
        fn = f" · {a['fn']}" if a["fn"] else ""
        nd = a["needs"] + (f" *{a['note']}*" if a["note"] else "") + (f" (source: {a['source']})" if a["source"] else "")
        w(f"| **{a['status']}** | `{a['id']}` | {esc(f + fn)} | {esc(nd)} | {', '.join(a['used_in'])} |")
    w("")
w("**No longer needed** (against board 1 and draft 3's handoff list):")
w("")
for a, b, c in NO_LONGER:
    w(f"- `{a}` ({b}): {c}.")
w("")
w("**Net against the changelog (§5.3):** medium rigs 5 (Mas, the Orb, NELEH, MADA, GERG as a medium tile) · medium plates 2 (the dark-room desk, the boardroom table) · Mas `[CU]` 1 drawing · new Mas hand drawings 6 + the six-finger variant (the pin exists) · new insert-scale props / plates: the vault, the shut door, the lighthouse desk, the reception desk top (the laptop corner with its mic already exists: `drawDeskInsert`) · the tally states already exist (`props.ts tally`, `drawDarkDesk`) · relights 0 on faces.")
w("")
w("## PRODUCTION CHUNKS")
w("")
w("12 chunks. The rule: a chunk is ≤ 10 s of NEW-ART set-piece or ≤ 45–60 s of dialogue. Every set-piece in the act now runs on a built kit (the blueprint, the call grid, the falling stack, the landlord remap, the F1.2 door), so new-art set-piece time is 0 s everywhere; the kit-driven seconds are listed apart. Estimates: the board-1 mode rates (agent-min per s) and the rule of thumb (0.4 min/s + 3.5 min/event).")
w("")
w("| Chunk | Shots | Tc | s | Dialogue s | Kit set-piece s | New-art s | Events | Est. (modes / thumb) | Fits |")
w("|---|---|---|---|---|---|---|---|---|---|")
for c in chunks:
    w(f"| **{c['id']}** | {c['shots']} ({c['n_shots']}) | {c['tc_in']}–{c['tc_out']} | {c['seconds']} | {c['dialogue_shot_seconds']} | {c['kit_setpiece_seconds']} | {c['setpiece_new_art_seconds']} | {c['visual_events']} | {c['est_agent_min_mode_rates']} / {c['est_agent_min_rule_of_thumb']} min | {'✓' if c['fits_rule'] else '✗'} |")
w(f"| **Act** | {len(out)} | {tc(0)}–{tc(TOTAL)} | {round(TOTAL / FPS, 1)} | | | 0 | {events_total} | {totals['est_agent_min_mode_rates']} / {totals['est_agent_min_rule_of_thumb']} min | |")
w("")
for c in chunks:
    w(f"- **{c['id']} · {c['title']}.** Depends on: {c['depends_on']}")
    w(f"  Build / confirm first: {', '.join('`' + x + '`' for x in c['assets_to_build_first']) or '—'}.")
w("")
w("**Dependency order.** C01 and C09 can start now (their kits exist; C01 waits only on two hand drawings). C02 and C03 are the W0 calibration and wait on the close tier (the `[CU]`, the eyes, the hands, the dark-room medium plate, Mas's and the Orb's rigs). C04–C06 wait on kit.post-ui and kit.cards; C05 on the boardroom medium tier (NELEH, MADA, the table plate), which C06, C11 reuse. C07–C08 reuse C03's dark-room tier and add MAS'S VERSION, the check and the Gerg glance. C10 needs two expression swaps. C11 is the third W0 calibration piece (the calm-off). C12 needs the four insert-scale props.")
w("")
w("## Read checks")
w("")
w(f"{len(reads)} must-read items checked at 0.25 s + 0.05 s per character (rails over the frames they persist; posts over their hold). **{len(read_fails)} fail.**")
w("")
w("| Shot | Kind | Text | Needs | Has | |")
w("|---|---|---|---|---|---|")
for x in reads:
    w(f"| {x['shot']} | {x['kind']} | {esc(x['text'])} | {x['need_frames']} | {x['have_frames']} | {'✓' if x['ok'] else '✗'} |")
w("")
w("## Board calls, rulings and flags")
w("")
w("**Open rulings, boarded at their defaults** (pov-changes §7):")
w("")
w("| # | Ruling | Default used | Where |")
w("|---|---|---|---|")
for a, b, c, d in RULINGS:
    w(f"| {a} | {esc(b)} | **{esc(c)}** | {esc(d)} |")
w("")
w("**Board calls** (places this board departs from, or interprets, the printed script):")
w("")
for a, b in BOARD_CALLS:
    w(f"- **{a}.** {b}")
w("")
w("**Flags:**")
w("")
for a, b, c in FLAGS:
    w(f"- **{a} · {b}.** {c}")
w("")
w("## Sound")
w("")
w("- **New SFX:** " + ", ".join(f"`{x}`" for x in SOUND["new"]) + ".")
w("- **Reuse:** " + ", ".join(f"`{x}`" for x in SOUND["reuse"]) + ".")
for x in SOUND["score_and_mix"]:
    w(f"- {x}")
w("")
open(os.path.join(PROD, "shotlist-v2.md"), "w").write("\n".join(M) + "\n")
print(f"board 2: {len(out)} shots · {TOTAL} f = {mmss(TOTAL)} · faces+hands {shares['FACES_HANDS']['pct']}% · W {shares['W']['pct']}% · reads failing {len(read_fails)} · problems {problems}")
