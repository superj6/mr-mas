"""SUPERSEDED by lock_v2.py (draft 3.1, board 2). Kept because board_v2.py reads the shots-locked.json it writes; do not use its
data.ts (the v1 animatic was replaced by the v2 files next to it).

lock.py - THE EDITOR's timing lock for Ep1 Act Four (sc 24-31, incl. 26A, 28), script draft 3 (the POV pass).

Inputs (read-only):
  show/episodes/ep01/script.md                      draft 3 of Act Four (2026-09-25 12:53): the authority
  show/episodes/ep01/production/act4/shots.json     board 1 (draft 2): framing / room / asset data carried by d2 id
  audio/ep01/act4/dialogue/lines.json               the recorded lines (43 voiced + 7 pop-up posts)
  out/ep01/act4/animatic/scratch-vo/scratch_vo.json the editor's scratch reads of draft 3's six V.O. lines

Outputs:
  show/episodes/ep01/production/act4/shots-locked.json
  studio/src/episodes/ep01/act4/animatic/data.ts   (generated: the same timing for the Remotion animatic)
  out/ep01/act4/animatic/lock-report.md            (generated tables pasted into timing.md)

Rules (timing.md section 2 explains each):
  * 24 fps, 96 BPM: 15 f a beat, 60 f a bar. Act frame 0 = episode 12:31:00. Every cut lands on a beat.
  * Bar-counted set pieces keep the script's bar counts (sc 24, 25, 26, 26A, 28, the tile avalanche, the landlord,
    HIS VERSION, the quiet beat, the long hold, name cards, quote cards).
  * Dialogue shots are sized from the recorded files: lead-in + line(s) + gaps + script HOLDs + tail, then rounded UP
    to the next beat. A punchline gets a full beat after it (tail 15 f) before the cut.
  * Pop-up posts (unvoiced) hold for the guardrail read time (0.25 s + 0.05 s/char) + 1 beat to settle.
  * V.O. starts on a beat and ends >= 1 beat before a cut, a spoken line or a must-read rail item (pov 5.1, 5.2).
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
from collections import OrderedDict

P = lambda *a: os.path.join(REPO, *a)  # noqa: E731

FPS, BEAT, BAR = 24, 15, 60
EP_IN = (12 * 60 + 31) * FPS  # 12:31:00 in episode frames
P_LEAD, GAP, TAIL, PUNCH = 4, 8, 8, 15

D2 = json.load(open(P("show/episodes/ep01/production/act4/shots.json")))
D2S = {s["id"]: s for s in D2["shots"]}
LINES = {x["id"]: x for x in json.load(open(P("audio/ep01/act4/dialogue/lines.json")))}
for x in json.load(open(P("out/ep01/act4/animatic/scratch-vo/scratch_vo.json"))):
    x["voiced_in_cut"] = True
    x["scratch"] = True
    x["mp3"] = None
    LINES[x["id"]] = x


def tc(f):
    """episode timecode mm:ss:ff for act frame f"""
    e = EP_IN + f
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def ceil_beat(n):
    return int(math.ceil(n / BEAT) * BEAT)


def read_frames(s):
    """guardrails 7: must-read text >= 0.25 s + 0.05 s per character"""
    return int(math.ceil((0.25 + 0.05 * len(s)) * FPS))


def post_hold(s):
    return ceil_beat(read_frames(s)) + BEAT


def dur(lid):
    return LINES[lid]["frames_24"]


def ln(lid, at=None, gap=None, seg=None, who=None, kind=None, text=None):
    """a line cue inside a shot: at = absolute offset in the shot, else gap after the previous line (or lead)."""
    return {"id": lid, "at": at, "gap": gap, "seg": seg, "who": who, "kind": kind, "text": text}


def post(lid, at, hold=None, text=None):
    return {"id": lid, "at": at, "hold": hold, "text": text}


SHOTS = []


def S(sid, sc, tag, what, frames=None, lines=(), posts=(), lead=None, tail=None, hold=0, punch=False, min_frames=0,
      rail=None, rail_at=0, text=(), d2=None, room=None, chars=None, framing=None, assets_new=(), notes=(), drop=None,
      bars=None):
    SHOTS.append(dict(id=sid, sc=sc, tag=tag, what=what, frames=frames, lines=list(lines), posts=list(posts), lead=lead,
                      tail=tail, hold=hold, punch=punch, min_frames=min_frames, rail=rail, rail_at=rail_at,
                      text=list(text), d2=d2, room=room, chars=chars, framing=framing, assets_new=list(assets_new),
                      notes=list(notes), drop=drop, bars=bars))


# ============================================================ SC 24 · INT. LAS VEGAS HOTEL SUITE — DAY · 2 bars
S("24.01", "24", "[W]", "The act's establishing wide. The crane truck grinds along the closed street circuit; every glass in the suite shivers in turn (flute, tumbler, ice bucket, vase). Mas at the desk, laptop and glass, the Orb at his shoulder. His glass does not shiver.",
  frames=BAR, rail="NOV 17, 2023 · ~NOON PT · LAS VEGAS", d2="24.01", room="vegas-suite · wide · day")
S("24.01a", "24", "[M]", "MAS at the desk, left third, lit from below by the laptop: BOARD · VIDEO CALL · JOIN.",
  frames=2 * BEAT, room="vegas-suite · medium plate (NEW)", assets_new=["cast.mas.medium", "room.vegas-suite.medium"])
S("24.02", "24", "[ECU]", "His hand: two fingers nudge the glass one pixel true, back onto its spot; the hand settles on the trackpad; the laptop's pointer sits on JOIN. Before he clicks, the frame flash-prints to blueprint (last beat).",
  frames=2 * BEAT, d2="24.02", room="vegas-suite · laptop insert", assets_new=["kit.ecu-hands (nudge)"],
  notes=["The lit cursor is the player's and stays dark all act; this is his laptop's pointer.", "24.02 print vs trace is a showrunner call (kits-fx.md 1); the animatic shows the print."])

# ============================================================ SC 25 · THE PLAN [BLUEPRINT] · 18 bars (3 · 7 · 5 · 3)
S("25.01", "25", "[GFX]", "THE WORD: the grid draws itself; the stamp HOW TO FIRE A CEO WHO OWNS NOTHING.", frames=3 * BAR, d2="25.01", bars="3 (THE WORD)")
S("25.02", "25", "[GFX]", "THE DIAGRAM 1: nine chair outlines; the waltz; DIRE, NOVIHS, DRUH stand and walk off; LEFT EARLIER IN 2023; the four voters circled: THESE FOUR VOTE.", frames=4 * BAR, d2="25.02", bars="4 of 7 (THE DIAGRAM)")
S("25.03", "25", "[GFX]", "THE DIAGRAM 2: the plan view; NOPEAI · THE NONPROFIT → CONTROLS → THE COMPANY (CAPPED PROFIT); the duty banner; MACROSOFT key ring outside the fence; CEO · EQUITY: 0 (HIS TESTIMONY); the moth.", frames=3 * BAR, d2="25.03", bars="3 of 7 (THE DIAGRAM)")
S("25.04", "25", "[GFX]", "THE PLAN 1: four blueprint figures walk the numbered path; 1-3 ticked in stride; they stop at 4.", frames=3 * BAR, d2="25.04", bars="3 of 5 (THE PLAN)")
S("25.05", "25", "[GFX]", "THE PLAN 2: closer on the figures at the blank line (redrawn 2x). NELEH: Step four. MADA: Good question.", frames=2 * BAR,
  lines=[ln("a4-25-01", at=10), ln("a4-25-02", at=50)], d2="25.05", bars="2 of 5 (THE PLAN)",
  notes=["Line cues sit on the blueprint kit's callout type-on frames (kits plan.ts 25.05: k10 and k50)."])
S("25.06", "25", "[GFX]", "THE BREAK 1: the chalk stroke starts to fill the blank, squeaks and snaps.", frames=BAR, d2="25.06", bars="1 of 3 (THE BREAK)")
S("25.07", "25", "[GFX]", "THE BREAK 2: the corner curls, Vegas neon bleeds through; the sheet tears along step 4, back into the suite.", frames=BAR, d2="25.07", bars="2 of 3 (THE BREAK)")
S("25.08", "25", "[ECU]", "His hand on the trackpad, the pointer still on JOIN. He clicks (beat 3).", frames=BAR, d2="25.08", bars="3 of 3 (THE BREAK)",
  room="vegas-suite · laptop insert", assets_new=["kit.ecu-hands (trackpad)"],
  notes=["Movement 2 rule: after THE PLAN's tear the first shot is his face or his hands: this [ECU] is it."])

# ============================================================ SC 26 · THE FALLING TILE · 22 bars (4 · 4 · 4 · 4 · card 2 · 4)
S("26.01", "26", "[POV]", "His laptop, full-bleed. The five-tile grid connects (MAS with neon behind him; ALYI a reflection in a doorway's glass; NELEH, paper glowing, footnotes orbiting; MADA arms folded, spinner; THE QUIET VOTE · camera off). Four vote icons already flipped. Egg: hotel Wi-Fi one bar of four.",
  frames=BAR, d2="26.01", bars="P1 bar 1")
S("26.02", "26", "CARD", "CARD NELEH / READ THE CHARTER. LITERALLY. · FOOTNOTES: ∞, riding the live grid (1-beat 2-tone freeze; Mas's tile stays in colour).",
  frames=BAR, d2="26.02", bars="P1 bar 2", text=["NELEH", "READ THE CHARTER. LITERALLY.", "FOOTNOTES: ∞"])
S("26.02a", "26", "[PF]", "MAS, left, lit from below by the laptop. The suite steps down behind him until only the neon rim is left. He reads the icons, one pupil step per tile. HOLD 1 BEAT.",
  frames=BAR, bars="P1 bar 3", room="vegas-suite (held, stepped down)", assets_new=["kit.pupil-steps (portrait eye darts x4)"])
S("26.03", "26", "[POV]", "Alyi's mouth moves, but no sound reaches Mas's tile. The dialogue box above Alyi's tile types … and stops.",
  frames=BAR, d2="26.03", bars="P1 bar 4")
S("26.04", "26", "[POV]", "Over Mas's tile the 1993 dialog pops up in full colour, plain frame, no icons: OK · Cancel. Cancel is NOT greyed out. Under it the suite goes on (fan, Strip, truck).",
  frames=BAR, d2="26.04", bars="P2 bar 1")
S("26.04a", "26", "[ECU]", "The eyes strip (480x64, letterboxed). His pupils move one pixel toward the dialog. Nothing else on him moves.",
  frames=BAR, bars="P2 bar 2", assets_new=["kit.ecu-eyes (Mas eyes strip, 5 pupil positions)"])
S("26.04b", "26", "[POV]", "An arrow pointer steps in from the board's tiles, whole pixels, one tile at a time.", frames=BAR, bars="P2 bar 3")
S("26.04c", "26", "[POV]", "It clicks Cancel on the downbeat. Click. SOUND: DROP-OUT [D6] on the click: fan, Strip and truck stop together. Digital silence (no tone, no breath). It works.",
  frames=BAR, bars="P2 bar 4", drop="start")
S("26.05", "26", "[POV]", "Mas's tile drops out of the grid (four drawings, straight down) and comes apart into tokens [GLYPH dissolve, 20 f, use 2 of 2]; the four tiles slide together. Silent.",
  frames=BAR, d2="26.05", bars="P3 bar 1")
S("26.05a", "26", "[CU]", "MAS, full frame (1st of the episode's 2 close-ups): the neon rim, the laptop's cyan, the one-pixel smile. Nothing changes. V.O. inside the drop-out; RAIL +1 FIRING one beat after the line ends.",
  frames=2 * BAR, bars="P3 bars 2-3", lines=[ln("a4-26-vo1", at=15, kind="vo")], rail="+1 FIRING", rail_at="vo+1beat",
  assets_new=["cast.mas.cu (cyan)"])
S("26.06", "26", "[ECU]", "His hand and his phone (one shot running into phrase 4). The phone buzzes and the room's sound comes back with it. The suggested-replies strip lights: [super] [super] [super]; the call's mic icon still lit just above. (P4 bar 1) his thumb hovers one beat between the strip and the mic, then taps the middle super.",
  frames=2 * BAR, bars="P3 bar 4 + P4 bar 1", d2="26.06", drop="end", room="vegas-suite · desk insert",
  text=["[super] [super] [super]"], assets_new=["kit.ecu-hands (thumb hover, tap)", "kit.post-ui (suggested-replies strip)"])
S("26.07", "26", "[P]", "MAS, left: super. His tile is gone; his mic isn't. Mix: no music under the line.",
  frames=BAR, bars="P4 bar 2", lines=[ln("a4-26-01", at=8)], d2="26.07", room="vegas-suite (held) behind the window")
S("26.08", "26", "[POV]", "The grid as his screen shows it: a listener's hold on four held reactions. Neleh's footnotes stop orbiting; Mada's spinner stops (hold everything, video noise included).",
  frames=BAR, bars="P4 bar 3", d2="26.08")
S("26.09", "26", "[W]", "The suite, the first wide since sc 24. The crane truck passes. Every glass shivers. His doesn't.", frames=BAR, bars="P4 bar 4", d2="26.09", room="vegas-suite · wide · day")
S("26.10", "26", "[GFX]", "FULL-SCREEN QUOTE CARD, the board's blog post. No V.O., no device, no Mas tell, no music within a bar.",
  frames=2 * BAR, bars="card 2", d2="26.10", text=['"…not consistently candid in his communications with the board…"', "— THE NOPEAI BOARD · BLOG POST · NOV 17, 2023"])
S("26.11", "26", "[POV]", "F1.2 in: Mas's greyed tile, still falling in the corner of the screen, becomes the start of a render front.", frames=BAR, bars="P5 bar 1", d2="26.11")
S("26.12", "26", "[W]", "F1.2 · 2005–08 · TPOOL [EARLY-WEB16]: the render front sweeps the frame to sixteen colours with GIF-era dither. A frosted-glass boardroom door, two shadows behind it leaning together. No sound, no whisper, no POV rim.",
  frames=2 * BAR + BEAT, bars="P5 bars 2-3 + 1 beat", d2="26.12", rail="2005–08 · TPOOL · (REPORTED)", room="tpool-door · corridor (EARLYWEB16)")
S("26.13", "26", "[ECU]", "Close on the frosted bands; the front sweeps back to BASE; the dither settles into wood grain, and the grain becomes 26A's desk.", frames=3 * BEAT, bars="P5 last 3 beats", d2="26.13", room="tpool-door · close")

# ============================================================ SC 26A · MAS'S DARK ROOM — THAT NIGHT · 8 bars
S("26A.01", "26A", "[ECU]", "The desk under the cyan key: the two faint old marks. With the steel clip of the pen from the MACROSOFT check he carves a third mark (bar 1, meter: the tally G01); brushes the shavings away, then his thumb runs once along all three (bar 2). V.O. from bar 2.",
  frames=2 * BAR + BEAT, bars="2 bars + 1 beat", d2="26A.01", rail="NOV 17, 2023 · THAT NIGHT",
  lines=[ln("a4-26a-vo1", at=BAR, kind="vo")], room="darkroom · desk close", assets_new=["kit.ecu-hands (carve, brush, thumb along the marks)"])
S("26A.02", "26A", "[2S]", "Mas and the Orb in the cyan cone. The Orb watches the hand, not the face (the buffer before the real post).",
  frames=3 * BEAT, d2="26A.02", room="darkroom · medium plate (NEW)", assets_new=["cast.mas.medium", "cast.orb.medium"])
S("26A.03", "26A", "[POV]", "His phone, full-bleed. He types in source casing; the post's own UI stamps it 9:32 PM PT.",
  frames=2 * BAR, d2="26A.03", posts=[post("a4-26a-01", at=0, hold=2 * BAR)], text=["9:32 PM PT"], assets_new=["kit.post-ui (phone composer)"],
  notes=["Read check: 88 chars needs 112 f; it types in 1 beat and is on screen 120 f."])
S("26A.04", "26A", "[ECU]", "The Senate wallet, open on the desk, one card: HEALTH INSURANCE. A moth flies out.", frames=BAR, d2="26A.04", text=["HEALTH INSURANCE"], assets_new=["prop.wallet"])
S("26A.05", "26A", "[PF]", "MAS, left. The room steps down behind him until only the cyan key and the rack's LEDs are left. V.O. (D4, the door into the exit).",
  frames=BAR + 2 * BEAT, lines=[ln("a4-26a-vo2", at=0, kind="vo")], room="darkroom (held, stepped down)")
S("26A.06", "26A", "[P]", "THE ORB, right. Its iris lifts from the desk to his face. Toast: rewinding… RAIL (1 beat after the toast): NOV 17 · EARLIER · THE BOARD'S SIDE. EXIT.",
  frames=2 * BEAT, rail="NOV 17 · EARLIER · THE BOARD'S SIDE", rail_at=BEAT, text=["rewinding…"], assets_new=["cast.orb.portrait (NEW: the Orb in the right window)"])

# ============================================================ SC 27 · PASS ONE: THE BOARD'S SIDE (the exit) · from the recordings
S("27.01", "27", "[SCR]", "The board's call grid on a laptop, bezel in frame. Noon. Four tiles; the gap has closed. The live-caption strip types in the software's lowercase: mas manalt: super. Nobody looks at it: NELEH turns a page, MADA's spinner keeps turning, ALYI's reflection looks at his doorway, THE QUIET VOTE stays black.",
  frames=BAR + 2 * BEAT, text=["mas manalt: super."], d2="27.01", assets_new=["kit.call-grid (bezel / [SCR] chrome, caption strip)"],
  notes=["The caption beat is draft 3's (+2 beats). Mas's one non-post appearance inside the exit (ruling 1: keep)."])
S("27.01a", "27", "[SCR]", "A system toast: GERG MOCKBRAN has left. Then his post arrives, green-lit from below.",
  posts=[post("a4-27-01", at=2 * BEAT)], text=["GERG MOCKBRAN has left."], d2="27.01")
S("27.02", "27", "[SCR]", "A second toast: BUKAJ has left. (toast text only). Keycaps pop out of the bottom of the frame like popcorn and rain across the grid.",
  frames=BAR, text=["BUKAJ has left."], d2="27.02")
S("27.03", "27", "[P]", "RIMA TAMURI, right, under a hard circular spotlight (it snaps on in 3 held drawings): jacket perfect, smoothing it.",
  frames=2 * BEAT, d2="27.03", room="board grid (held) behind the window")
S("27.04", "27", "CARD", "CARD RIMA TAMURI / CEO (WEEKEND EDITION) · HEARTS SENT: 0 (1-beat freeze, then it rides the live window).",
  frames=BAR, d2="27.04", text=["RIMA TAMURI", "CEO (WEEKEND EDITION)", "HEARTS SENT: 0"])
S("27.05", "27", "[P]", "RIMA, right: I'll hold it together.", lines=[ln("a4-27-02")], lead=P_LEAD, d2="27.05")
S("27.05a", "27", "[P]", "NELEH, right: For how long?", lines=[ln("a4-27-03")], lead=P_LEAD, d2="27.05")
S("27.05b", "27", "[P]", "RIMA, right (pleasant): We'll share more soon.", lines=[ln("a4-27-04")], lead=P_LEAD, punch=True, d2="27.05")
S("27.06", "27", "[M]", "INT. NOPEAI BULLPEN — ALL-HANDS. Over the heads of the tiled employees (rows of one held drawing), ALYI in a doorway, half cut off by its frame. One tiled hand goes up (2 drawings): Is this a coup?",
  lines=[ln("a4-27-05", at=BEAT)], d2="27.06", room="bullpen · all-hands (door open) · medium (NEW)", assets_new=["room.bullpen.medium (all-hands)"])
S("27.07", "27", "[P]", "ALYI, right, the door frame cutting his window in half: \"You can call it this way\"", lines=[ln("a4-27-06")], lead=P_LEAD, punch=True, d2="27.07")
S("27.08", "27", "[M]", "Alyi steps back out of frame (2 drawings); the doorway is empty. (Draft 3 cuts the second tiled hand.)", frames=2 * BEAT, d2="27.08")
S("27.09", "27", "[SCR]", "The board's grid. A heart in the corner of Neleh's tile. Then ten. Then hundreds of red hearts, each its own held sprite, pour down until the tiles are buried.",
  frames=2 * BAR, rail="NOV 18", d2="27.09")
S("27.10", "27", "[SCR]", "Exactly one heart is blue. It drifts down slowly, last of all, lands on the only thing still sticking out (Mada's spinner) and spins with it, blue, for one beat. Mas's post scrolls across the hearts as a notification.",
  posts=[post("a4-27-07", at=BEAT)], min_frames=2 * BAR + BEAT, d2="27.10")
S("27.11", "27", "[2S]", "INT. NOPEAI BOARDROOM — NIGHT. The committee after the vote: NELEH standing with a marker and MADA seated, spinner turning, the PLAN blueprint between them, step 4 blank. ALYI a reflection in the dark window; a laptop on a chair shows the black tile. Every phone on the table buzzes at once. (Egg: the speed-dial wheel in the Valley.)",
  frames=BAR, d2="27.11", room="boardroom · night · medium (NEW)", assets_new=["room.boardroom.medium", "cast.neleh.medium", "cast.mada.medium"])
S("27.12", "27", "[P]", "NELEH, right: The bylaws allow it. Footnote three.", lines=[ln("a4-27-08")], lead=P_LEAD, d2="27.12")
S("27.12a", "27", "[P]", "ALYI (reflection), right: Step four… will reveal itself. (His pauses are the joke: leave them.)", lines=[ln("a4-27-09")], lead=P_LEAD, d2="27.12")
S("27.12b", "27", "[P]", "NELEH, right: When?", lines=[ln("a4-27-10")], lead=P_LEAD, d2="27.12")
S("27.12c", "27", "[P]", "ALYI (reflection), right: The company will tell us.", lines=[ln("a4-27-11")], lead=P_LEAD, d2="27.12")
S("27.13", "27", "[2S]", "Every phone on the table buzzes again, harder. The phones walk themselves toward the edge, one held step each.", frames=BAR, d2="27.13")
S("27.14", "27", "[P]", "NELEH, right: The company is calling us.", lines=[ln("a4-27-12")], lead=P_LEAD, d2="27.14")
S("27.14a", "27", "[P]", "ALYI (reflection), right: That is the company telling us.", lines=[ln("a4-27-13")], lead=P_LEAD, punch=True, d2="27.14")
S("27.14b", "27", "[2S]", "In the window Alyi's reflection flickers, there and not there, for two frames, then steadies. The black tile on the laptop doesn't move.", frames=2 * BEAT, d2="27.15")
S("27.15", "27", "[PF]", "NELEH, right, the boardroom stepped down behind her. She looks at the blank line. HOLD 1 BEAT. It isn't a joke (her real face).", frames=3 * BEAT,
  room="boardroom (held, stepped down)")
S("27.16", "27", "[ECU]", "A prop insert: her hand and the marker. She uncaps it and writes one small word on the blank line, with a question mark. We can't read it.", frames=BAR, d2="27.16", room="boardroom · table insert (blueprint)")
S("27.17", "27", "[W]", "The whole table. The conference speakerphone dials out on its own: four tones, one per seat. CUT on the first ring.", frames=BAR, d2="27.17", room="boardroom · night · wide")
S("27.18", "27", "[M]", "INT. MISANTHROPIC LIGHTHOUSE — NIGHT (the home room, opened close). MARIO at his desk: brick-red, the lamp turning, paper everywhere. A phone rings; a small throne is stuck to its handset. He looks at the throne; his finger rises: I've written up some thoughts.",
  lines=[ln("a4-27-14", at=2 * BEAT)], rail="(REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER", d2="27.18",
  room="lighthouse · night · medium (NEW)", assets_new=["room.lighthouse.medium", "cast.mario.medium"])
S("27.20", "27", "[P2]", "MARIO (left) and ADELINA (right). She takes the phone out of his hand, brisk and warm.", frames=2 * BEAT, d2="27.20")
S("27.21", "27", "CARD", "CARD ADELINA / IN PLAIN ENGLISH: · TRANSLATES DOOM INTO REVENUE (1-beat freeze, rides the live lighthouse).", frames=BAR, d2="27.21",
  text=["ADELINA", "IN PLAIN ENGLISH:", "TRANSLATES DOOM INTO REVENUE"])
S("27.22", "27", "[P2]", "ADELINA (into the phone): In plain English: no.", lines=[ln("a4-27-15")], lead=P_LEAD, punch=True, d2="27.22")
S("27.23", "27", "[M]", "Click. The throne falls off the handset.", frames=2 * BEAT, d2="27.23")
S("27.24", "27", "[M]", "The second phone rings. Through the window above him two rent meters spin: NOZAMA · UP TO $4B, ELGOOG · UP TO $2B. Mario answers this one immediately.",
  frames=BAR, d2="27.24", text=["NOZAMA · UP TO $4B", "ELGOOG · UP TO $2B"])
S("27.25", "27", "[P2]", "MARIO (left, Adelina listening): Hi. Yes. We're very worried. How much?", lines=[ln("a4-27-16")], lead=P_LEAD, punch=True, d2="27.25")
S("27.26", "27", "[SCR]", "INT. NOPEAI LOBBY — DAY on a security-camera tile, bezel and all: grainy, high in a corner, too far to read a face. A familiar figure walks in wearing a GUEST lanyard. His post sits upside-down in the tile's corner.",
  posts=[post("a4-27-17", at=2 * BEAT)], min_frames=2 * BAR, rail="NOV 19", d2="27.26", room="lobby · security cam (drawLobbyCam)")
S("27.27", "27", "[W]", "INT. NOPEAI BOARDROOM — NIGHT. The four board members around the table. The spotlight swings off Rima's empty chair onto TTEMME (hoodie, headset mic, hourglass). His nameplate: a sticky note CEO (TEMP).",
  frames=BAR, rail="NOV 19 · NIGHT", d2="27.27", text=["CEO (TEMP)"], room="boardroom · Nov 19 · wide")
S("27.28", "27", "CARD", "CARD TTEMME / CEO (72 HOURS). · TIME LEFT: 72:00:00", frames=BAR, d2="27.28", text=["TTEMME", "CEO (72 HOURS).", "TIME LEFT: 72:00:00"])
S("27.29", "27", "[P]", "TTEMME, right; the livestream chat overlay spams F up the side of his window (egg): Chat. I'm the CEO now.", lines=[ln("a4-27-18")], lead=P_LEAD, d2="27.29")
S("27.30", "27", "[M]", "He sets the hourglass on the table and flips it (3 drawn states). Sand begins to fall, one pixel per beat.", frames=3 * BEAT, d2="27.30")
S("27.31", "27", "[P]", "TTEMME, right (watching the sand): Chat… for how long?", lines=[ln("a4-27-19")], lead=P_LEAD, punch=True, d2="27.31")
S("27.32", "27", "[2S]", "NELEH and MADA, the boardroom wall behind them. The wall steps one palette step to MACROSOFT slate. A door appears that wasn't there, and opens (one state a beat).",
  frames=BAR + BEAT, rail="NOV 19 · 11:53 PM PT", d2="27.32")
S("27.33", "27", "[P]", "TASYA, right, in the doorway: key ring jangling, warm as ever, holding up a small sign, an arrow pointing OUT. (post, read aloud with pleasure)",
  lines=[ln("a4-27-20", kind="post-read")], lead=6, d2="27.33")
S("27.34", "27", "[M]", "Behind him, through the door: a desk for every employee, already labelled.", frames=3 * BEAT, d2="27.34", room="boardroom · Tasya's door insert")
S("27.35", "27", "[2S]", "NELEH and MADA look down at the blueprint. Step 4 is still blank (her tiny word is illegible).", frames=2 * BEAT, d2="27.35")
S("27.36", "27", "[2S]", "NELEH: Step four? MADA: Good question.", lines=[ln("a4-27-21"), ln("a4-27-22", gap=GAP)], lead=3, punch=True, d2="27.36",
  notes=["Punch: a full beat after Mada's line, then the act-out sting on the downbeat."])

# ============================================================ SC 28 · CARD · 1 bar + 1 beat
S("28.01", "28", "[GFX]", "MUSIC: sting on the downbeat. Black, cream type, centred: WHAT THEY DIDN'T KNOW (the door back; no side label follows).",
  frames=BAR + BEAT, d2="28.01", text=["WHAT THEY DIDN'T KNOW"])

# ============================================================ SC 29 · PASS TWO: HIS SIDE
S("29.00", "29", "[ECU]", "The home shot: the glass on the dark-room desk, its water line one flat row of pixels.", frames=2 * BEAT,
  rail="NOV 20, 2023 · ~2:06 AM PT", room="darkroom · desk close (glass)")
S("29.01", "29", "[2S]", "Mas at the desk, the Orb at his shoulder, the GUEST lanyard beside the glass, three marks in the wood. In the monitor's corner, small: the board's four-tile grid.",
  frames=BAR, lines=[ln("a4-29-vo1", at=0, kind="vo")], d2="29.01", room="darkroom · medium (NEW)")
S("29.01a", "29", "[HIS VERSION]", "The cyan 6-px rim and a soft score bed. The phone lies face-down on the desk under his hand, calm. The hand has six fingers. HARD CUT on the downbeat; the rim and the bed go.",
  frames=BAR, assets_new=["kit.his-version (rim + six-fingered hand)"])
S("29.02", "29", "[POV]", "His feed, full-bleed. A post from RIMA.", frames=BAR, posts=[post("a4-29-01", at=0, hold=BAR)], d2="29.02",
  notes=["Rima's post stays on the feed through 29.03 (the same words repeat), so its read runs 60 + 105 f."])
S("29.03", "29", "[ECU]", "His thumb on the feed (five fingers again) taps a heart. Tick. The same post comes again from another avatar, word for word. Tick. Eight identical posts stack up, one per beat; he hearts every one on the beat.",
  frames=7 * BEAT, d2="29.03", assets_new=["kit.ecu-hands (heart tap)"])
S("29.04", "29", "[2S]", "On the eighth beat: the Orb's iris has followed every tap.", frames=BEAT, d2="29.04")
S("29.05", "29", "[POV]", "A counter on the monitor rolls like launch night's odometer: 505 · 650 · 700 · 745 / 770. At 745 it stops with a clunk we recognise.",
  frames=BAR + BEAT, rail="THE LETTER", d2="29.05", text=["505 · 650 · 700 · 745 / 770"])
S("29.06", "29", "[GFX]", "FULL-SCREEN QUOTE CARD (3 bars): the employee letter.", frames=3 * BAR, d2="29.06",
  text=['"…unable to work for or with people that lack competence, judgment and care for our mission and employees"', "— THE EMPLOYEES' LETTER TO THE NOPEAI BOARD · NOV 20, 2023"])
S("29.07", "29", "[POV]", "The letter's signature list, scrolling. It stops for 2 beats on one name: ALYI (REPORTED).", frames=BAR, d2="29.07", text=["ALYI (REPORTED)"])
S("29.07a", "29", "[P]", "THE ORB, right. Its iris goes to the name, then to Alyi's thumbnail in the monitor's corner, then back to the name. Chime. (No V.O., no Mas tell on (REPORTED) material.)",
  frames=BAR, d2="29.07")
S("29.08", "29", "[2S]", "DELIVERY. The server rack's slot whirs and ejects a giant check, tray-first, across the desk between them.", frames=BAR, d2="29.08")
S("29.09", "29", "[ECU]", "The check, front: EVIRHT · TENDER OFFER @ ~$86B VALUATION; stamped across the middle in red (beat 3): VOID IF CEO MISSING. Once its text has read, the V.O.",
  lines=[ln("a4-29-vo2", at=BAR, kind="vo")], d2="29.09", rail="THE LETTER · ~$86B RECONSTRUCTED",
  text=["EVIRHT · TENDER OFFER @ ~$86B VALUATION", "VOID IF CEO MISSING"], assets_new=["prop.check-evirht"],
  notes=["V.O. D3 over the check insert (the picture catches it); the check's text reads first (53 f), the V.O. starts on bar 2."])
S("29.10", "29", "[P]", "THE ORB looks at the check. HOLD 1 BEAT.", frames=2 * BEAT, d2="29.10")
S("29.10a", "29", "[2S]", "Mas, aloud, to the Orb, the one true word: mostly. HOLD 1 BEAT.", lines=[ln("a4-29-03")], lead=6, hold=BEAT, d2="29.10")
S("29.11", "29", "[POV]", "A video tile opens on the monitor (3 held steps), big enough to act in: GERG, laptop open, typing, the green glow under his chin: One sec. Compiling.",
  lines=[ln("a4-29-04", at=8)], d2="29.11")
S("29.11a", "29", "[P]", "MAS, left: what are you building?", lines=[ln("a4-29-05")], lead=P_LEAD, d2="29.11")
S("29.11b", "29", "[POV]", "Gerg's tile: The company. Again. Just in case.", lines=[ln("a4-29-06")], lead=3, d2="29.11")
S("29.11c", "29", "[POV]", "Gerg's tile fills the frame at medium scale. He glances up into his camera, at Mas, for one beat. It isn't a joke (his real face). He goes back to typing.",
  frames=2 * BEAT, assets_new=["cast.gerg.medium-tile (glance up)"], notes=["Script says (1 beat) for the glance; the shot is 2 beats (the glance held 1 beat + the drop back to typing). Editor's +1 beat."])
S("29.12q", "29", "[PF]", "QUIET BEAT · 4 beats. MAS, left. The room falls away until only the monitor's green and his cyan are left. He watches Gerg type. Keycaps click. No line, no music.",
  frames=4 * BEAT, room="darkroom (fallen away: green + cyan only)")
S("29.12", "29", "[2S]", "The two-shot holds the whole back wall. V.O. (D8). Under the line's last word a slate-blue door steps up out of the shadow, three held steps, a key already in its lock. TASYA's voice from the other side (the release, within a bar):",
  lines=[ln("a4-29-vo3", at=0, kind="vo"), ln("a4-29-07", gap="beat+", kind="os")], d2="29.12", room="darkroom · back wall · medium (NEW)")
S("29.13a", "29", "[P]", "His read, eyeline 1: Mas looks at the door.", frames=BEAT, d2="29.13")
S("29.13b", "29", "[POV]", "Eyeline 2: Gerg's tile, typing.", frames=BEAT, d2="29.13")
S("29.13c", "29", "[POV]", "Eyeline 3: the feed, where the hearts are still coming.", frames=BEAT, d2="29.13")
S("29.13", "29", "[P]", "MAS, left: leave it open. (The act's last V.O. came before this; from here the tiles fall his way.)", lines=[ln("a4-29-08")], lead=P_LEAD, punch=True, d2="29.13")
S("29.14", "29", "[POV]", "THE TILE AVALANCHE, PHRASE 1: the board's grid fills the monitor. At the top edge one employee tile appears, small, a face in a square. Then another. Then hundreds fall, each a held drawing, stacking and pushing.",
  frames=4 * BAR, bars="S3 phrase 1", d2="29.14")
S("29.15", "29", "[POV]", "PHRASE 2, bars 1-2: the stack presses on the board's row. ALYI's tile is shoved sideways; for the one beat it resists it fills half the frame; then it slides off the edge.", frames=2 * BAR, bars="S3 phrase 2a", d2="29.15")
S("29.16", "29", "[POV]", "PHRASE 2, bars 3-4: NELEH's tile follows, her footnotes scattering like sparks. She's gone.", frames=2 * BAR, bars="S3 phrase 2b",
  lines=[ln("a4-29-09", at=20)], d2="29.16")
S("29.17", "29", "[POV]", "PHRASE 3, bars 1-3: THE QUIET VOTE's black tile is pushed out without a sound. The tiles keep coming. The whole screen is faces, 745 of them, with one gap left in the bottom row.", frames=3 * BAR, bars="S3 phrase 3a", d2="29.17")
S("29.17a", "29", "[PF]", "PHRASE 3, bar 4: MAS, left, lit by 745 small faces, watching the one gap.", frames=BAR, bars="S3 phrase 3b", room="darkroom (held, lit by the wall of faces)",
  notes=["The S3's cut to a face (movement 4: at least every 8 bars)."])
S("29.18", "29", "[POV]", "PHRASE 4, bars 1-2: in the gap is MADA's tile, arms folded, spinner turning, wedged in. Every tile presses. He does not move. The frame holds on him, half-frame, for 2 beats (his real face).", frames=2 * BAR, bars="S3 phrase 4a", d2="29.18")
S("29.19", "29", "CARD", "CARD MADA / LAST FIRER STANDING · ANSWERS GIVEN: 0 (no line: the stat is the joke).", frames=BAR, bars="S3 phrase 4b", d2="29.19", text=["MADA", "LAST FIRER STANDING", "ANSWERS GIVEN: 0"])
S("29.20", "29", "[POV]", "Hold. 745 faces press; the spinner turns; nothing happens. The phrase ends.", frames=BAR, bars="S3 phrase 4c", d2="29.20")

# ============================================================ SC 30 · THE RETURN (no V.O.)
S("30.01", "30", "[M]", "INT. NOPEAI BULLPEN — BACK WALL — DAY. The conference-room door, open a crack; in the gap, cut off by the frame as always, ALYI. MUSIC: one sad violin, played straight. (post, read from the doorway)",
  lines=[ln("a4-30-01", at=BEAT, kind="post-read")], rail="NOV 20, 2023", d2="30.01", room="bullpen · back wall · door crack · medium (NEW)")
S("30.02", "30", "[ECU]", "Mas's thumb on his phone: three hearts, one per beat, on the beat [V].", frames=BAR, d2="30.03", assets_new=["kit.ecu-hands (three taps)"])
S("30.03", "30", "[P]", "ALYI, right. The three red hearts float up and hang in the doorway. He looks at them. He doesn't step out. HOLD 2 BEATS on the violin (his real face). Then the yellowed note IOU: 20% COMPUTE flutters in a draught nobody else feels.",
  frames=6 * BEAT, d2="30.03", text=["IOU: 20% COMPUTE"])
S("30.04", "30", "[W]", "INT. NOPEAI BULLPEN — CONTINUOUS. Every desk has a packed box, everyone has a coat on. TASYA stands in the middle of the floor, hands clasped, delighted.", frames=3 * BEAT, d2="30.04", room="bullpen · walkout")
S("30.05", "30", "[W]+[P]", "THE LANDLORD (S2, bar 1-2): Tasya's window opens over the room, right. On below, the floor steps to MACROSOFT slate in three held palette steps, spreading from his feet.",
  frames=2 * BAR, bars="S2 bars 1-2", lines=[ln("a4-30-02", at=20, seg=(0, 33), kind="post-read", text="\"We are below them,")], d2="30.05", rail="NOV 20, 2023 · RECONSTRUCTED")
S("30.06", "30", "[W]+[P]", "THE LANDLORD (bars 3-4): on above, the ceiling does the same.", frames=2 * BAR, bars="S2 bars 3-4",
  lines=[ln("a4-30-02", at=20, seg=(35, 60), kind="post-read", text="above them,")], d2="30.06")
S("30.07", "30", "[W]+[P]", "THE LANDLORD (bars 5-6): on around, the walls follow. His window closes. The whole bullpen is Tasya-blue; every employee is standing on him. His key ring jangles once, inside the wall.",
  frames=2 * BAR, bars="S2 bars 5-6", lines=[ln("a4-30-02", at=20, seg=(63, 88), kind="post-read", text="around them.\"")], d2="30.07")
S("30.08", "30", "[PF]", "THE LANDLORD (bars 7-8): MAS, left, at his desk, looking down at the floor. The floor is Tasya. MAS: hi. TASYA (O.S., from the floor, warmly): Hello.",
  frames=2 * BAR, bars="S2 bars 7-8", lines=[ln("a4-30-03", at=20), ln("a4-30-04", gap=BEAT + 3, kind="os")], d2="30.08", room="bullpen (all slate, held, stepped down)")
S("30.09", "30", "[M]", "INT. NOPEAI BOARDROOM — NIGHT. MADA, seated, perfectly still, in the only chair that isn't burning; small cartoon fires on the table, a chair and a nameplate; nobody has mentioned them. The door bangs open (beat 4): TERB, crisp shirtsleeves, a red extinguisher held like a briefcase, and a fire marshal's helmet that appears only now.",
  frames=6 * BEAT, rail="NOV 21, 2023 · ~10 PM PT", d2="30.09", room="boardroom · fires · medium (NEW)")
S("30.11", "30", "CARD", "CARD (FULL FREEZE) TERB / CHAIRS BOARDS ON FIRE · EXTINGUISHERS: 1. [M] Mas, in colour through the freeze, walks past and pulls the pin from Terb's extinguisher.",
  frames=BAR + 2 * BEAT, d2="30.11", text=["TERB", "CHAIRS BOARDS ON FIRE", "EXTINGUISHERS: 1"])
S("30.12", "30", "[ECU]", "The pin in his fingers, its tamper tag readable: DO NOT REMOVE. He pockets it (business 2 of 2). The freeze releases on the cut.", frames=2 * BEAT, d2="30.12", text=["DO NOT REMOVE"])
S("30.13", "30", "[P]", "TERB, right: Which room is on fire?", lines=[ln("a4-30-05")], lead=P_LEAD, d2="30.13")
S("30.13a", "30", "[M]", "TERB. Behind him everyone looks around, as if seeing the fires for the first time: …Ah.", lines=[ln("a4-30-06", at=BEAT)], punch=True, d2="30.13")
S("30.14", "30", "[2S]", "The calm-off: MAS, left, and MADA, right, across the table. Neither moves. The chaos happens behind them: Terb sprays the chair fire (the extinguisher works, the pin is out); keycaps bounce off the table; a key ring jangles in the wall. TERB (O.S.): Terms?",
  lines=[ln("a4-30-07", at=3 * BEAT, kind="os")], d2="30.14", room="boardroom · calm-off · medium (NEW)")
S("30.15", "30", "[P]", "MADA, right. HOLD 1 BEAT. Good question.", lines=[ln("a4-30-08", at=BEAT + P_LEAD)], d2="30.15")
S("30.16", "30", "[P]", "MAS, left. HOLD 1 BEAT. (one beat late) good question.", lines=[ln("a4-30-09", at=BEAT + P_LEAD)], punch=True, d2="30.16")
S("30.17", "30", "[2S]", "HOLD 1 BAR (the episode's one long hold): two still men in one frame. Mada's spinner stops. He nods once.", frames=BAR, d2="30.17")
S("30.18", "30", "[2S]", "Terb's hand comes into frame, stamps a term sheet without looking and hands it to both of them at the same time.", frames=BAR, d2="30.18")
S("30.19", "30", "[W]", "The boardroom's one wide: the new board takes its seats, one held drawing each: TERB; a mute man behind a nameplate THE OTHER YRRAL; MADA, whose chair never moved.",
  frames=BAR, d2="30.19", text=["THE OTHER YRRAL"], room="boardroom · new board · wide")
S("30.20", "30", "[POV]", "Mas's phone lights green; keycaps pop out of the bottom of the frame. Gerg's post.", posts=[post("a4-30-10", at=0)], d2="30.20", assets_new=["kit.post-ui (phone, green)"])
S("30.21", "30", "[M]", "On the table the last grain runs out of TTEMME's hourglass. His post. The hourglass shatters, only the glass; the sand holds the shape for one beat, then falls.",
  posts=[post("a4-30-11", at=BEAT)], d2="30.21", room="boardroom · table insert (prop)")
S("30.22", "30", "[W]", "INT. NOPEAI LOBBY — NIGHT. Mas walks in without a lanyard, his glass in his hand. The wall sign lights up: DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0.",
  frames=BAR, d2="30.22", text=["DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0"], room="lobby · night")
S("30.23", "30", "[ECU]", "A maintenance hand sets a small box on the floor under the sign. The box is full of spare 0 plates.", frames=3 * BEAT, d2="30.23", room="lobby · floor insert")
S("30.24", "30", "[W]", "Over the lobby, for 2 bars, the 1993 dialog pops up once more, full colour: OK · Cancel. Cancel greys out one dither step at a time. Off-screen, the stranger's pointer clicks it. Bonk.",
  frames=2 * BAR, d2="30.24")
S("30.25", "30", "[CU]", "MAS, full frame: the firing's drawing, lit now by the lobby's tungsten (2nd and last close-up): okay.", lines=[ln("a4-30-12", at=BEAT)], punch=True, d2="30.25",
  assets_new=["cast.mas.cu (tungsten)"])
S("30.26", "30", "[ECU]", "His hand sets the glass down on the reception desk and nudges it one pixel true (the sc 24 ritual's bookend).", frames=BEAT,
  assets_new=["kit.ecu-hands (glass set-down + nudge)"])

# ============================================================ SC 31 · INT. NOPEAI BULLPEN — BACK WALL — DAY
S("31.01", "31", "[M]", "A squat steel vault stencilled Q* under the tungsten spill from the hall. It hums at the score's root note, F. One yellow sticky note on the door.",
  frames=BAR + 3 * BEAT, rail='NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"', d2="31.01", room="bullpen · back wall · vault · medium (NEW)")
S("31.02", "31", "[2S]", "Mas walks past it without looking, the Orb at his shoulder; the Orb looks. Gerg walks past the other way, typing, and stops: What's in there?",
  lines=[ln("a4-31-01", at=2 * BEAT)], d2="31.02")
S("31.03", "31", "[P]", "MAS, left (not looking): it's a preview. The vault hums on the line.", lines=[ln("a4-31-02")], lead=P_LEAD, punch=True, d2="31.03")
S("31.04", "31", "[M]", "Gerg reads the sticky note (DO NOT OPEN. DO NOT EXPLAIN.), nods, and keeps walking.", frames=BAR, d2="31.04", text=["DO NOT OPEN. DO NOT EXPLAIN."])
S("31.06", "31", "[P]", "MAS, left, at his desk, reads his memo aloud, unhurried (voiced on camera, never V.O.; the memo page is never inserted).",
  lines=[ln("a4-31-03", at=8, kind="memo")], rail="NOV 29, 2023", d2="31.06")
S("31.07", "31", "[ECU]", "A prop insert: the boardroom. A maintenance worker's screwdriver takes the ALYI nameplate off the back of his board chair: four screws, four beats, one held drawing each. The plate comes off.",
  frames=BAR + 2 * BEAT, d2="31.07", text=["ALYI"], room="boardroom · chair-back insert")
S("31.08", "31", "[M]", "Back in the bullpen, the conference-room door behind Mas is shut, with its nameplate still on.", frames=3 * BEAT, d2="31.08")
S("31.09", "31", "[W]", "The scene's one wide: by the window a MACROSOFT-blue folding chair unfolds itself. Its seat reads OBSERVER (NON-VOTING). It stays empty. From above, Tasya's key ring drops onto the seat. Jangle. The chair is on his floor anyway.",
  frames=2 * BAR, d2="31.09", text=["OBSERVER (NON-VOTING)"], room="bullpen · back wall · wide", assets_new=["prop.observer-chair"])

# explicit room / plate for re-framed shots (board 1's room label no longer fits the draft-3 framing)
ROOM_FIX = {
    "26.03": "the board call (his laptop, full-bleed)", "26.04": "the board call (his laptop, full-bleed)",
    "26.04a": "Mas's eyes strip (480x64, letterboxed)", "26.04b": "the board call (his laptop, full-bleed)",
    "26.04c": "the board call (his laptop, full-bleed)", "26.05": "the board call · G5 → G4",
    "26.05a": "Mas CU over the suite's neon (cyan key)", "26.08": "the board call · G4 (frozen)",
    "26.11": "the board call · G4, the greyed plate falling", "26A.06": "darkroom (held) behind the window",
    "27.01": "the board's call grid on a laptop, bezel in frame", "27.01a": "the board's call grid (bezel)",
    "27.02": "the board's call grid (bezel)", "27.09": "the board's call grid (bezel) · G5 with Rima",
    "27.10": "the board's call grid (bezel) · buried in hearts", "27.05": "board grid (held) behind the window",
    "27.05a": "board grid (held) behind the window", "27.05b": "board grid (held) behind the window",
    "27.07": "bullpen all-hands (held) behind the window", "27.08": "bullpen · all-hands (door open) · medium (NEW)",
    "27.12": "boardroom (held) behind the window", "27.12a": "boardroom (held) behind the window",
    "27.12b": "boardroom (held) behind the window", "27.12c": "boardroom (held) behind the window",
    "27.13": "boardroom · night · medium (NEW)", "27.14": "boardroom (held) behind the window",
    "27.14a": "boardroom (held) behind the window", "27.14b": "boardroom · night · medium (NEW)",
    "27.20": "lighthouse (held) behind both windows", "27.22": "lighthouse (held) behind both windows",
    "27.23": "lighthouse · medium (NEW): the handset", "27.24": "lighthouse · night · medium (NEW)",
    "27.25": "lighthouse (held) behind both windows", "27.29": "boardroom · Nov 19 (held) behind the window",
    "27.30": "boardroom · table insert (prop spot)", "27.31": "boardroom · Nov 19 (held) behind the window",
    "27.32": "boardroom · 11:53 PM (slate) · medium (NEW)", "27.33": "boardroom · slate (held) behind the window",
    "27.35": "boardroom · slate · medium (NEW)", "27.36": "boardroom · slate · medium (NEW)",
    "29.02": "his feed (monitor, full-bleed)", "29.03": "his thumb on the feed (insert)", "29.04": "darkroom · medium (NEW)",
    "29.05": "the monitor, full-bleed: the counter", "29.07": "the monitor, full-bleed: the signature list",
    "29.07a": "darkroom (held) behind the window", "29.08": "darkroom · medium (NEW): the rack tray",
    "29.10": "darkroom (held) behind the window", "29.10a": "darkroom · medium (NEW)",
    "29.11": "the monitor, full-bleed: Gerg's video tile", "29.11a": "darkroom (held) behind the window",
    "29.11b": "the monitor, full-bleed: Gerg's video tile", "29.11c": "Gerg's tile at medium scale (full-bleed)",
    "29.13a": "darkroom (held) behind the window", "29.13b": "the monitor, full-bleed: Gerg's tile",
    "29.13c": "the monitor, full-bleed: the feed", "29.13": "darkroom (held, the blue door ajar) behind the window",
    "29.14": "the monitor, full-bleed: the board's grid", "29.15": "the monitor, full-bleed: the stack presses",
    "29.16": "the monitor, full-bleed: the stack presses", "29.17": "the monitor, full-bleed: faces",
    "29.18": "the monitor, full-bleed: the gap", "29.20": "the monitor, full-bleed: the gap",
    "30.02": "his phone (insert): three heart taps", "30.03": "bullpen · back wall · door crack (held) behind the window",
    "30.05": "bullpen · walkout → landlord step 1 (Tasya's window right)", "30.06": "bullpen · landlord step 2 (Tasya's window right)",
    "30.07": "bullpen · landlord step 3 (window closes)", "30.13": "boardroom · fires (held) behind the window",
    "30.13a": "boardroom · fires · medium (NEW)", "30.15": "boardroom · fires (held) behind the window",
    "30.16": "boardroom · fires (held) behind the window", "30.17": "boardroom · calm-off · medium (NEW)",
    "30.18": "boardroom · calm-off · medium (NEW)", "30.20": "his phone, full-bleed (green)",
    "30.24": "lobby · night · wide + the 1993 dialog", "30.25": "Mas CU (tungsten, lobby)", "30.26": "lobby · reception desk insert (glass)",
    "31.02": "bullpen · back wall · medium (NEW)", "31.03": "bullpen (held) behind the window",
    "31.04": "bullpen · back wall · medium (NEW): the vault's sticky note", "31.06": "bullpen · Mas's end desk (held) behind the window",
    "31.08": "bullpen · back wall · medium (NEW): the door, nameplate on",
}
for _s in SHOTS:
    if _s["id"] in ROOM_FIX:
        _s["room"] = ROOM_FIX[_s["id"]]

# the 12 production chunks (chunks.md): first and last shot of each
CHUNKS = [
    ("C01", "24.01", "25.08", "Vegas suite + THE PLAN (the blueprint kit on its real clock), the click"),
    ("C02", "26.01", "26.09", "THE FALLING TILE, phrases 1-4: the call, Cancel works, the drop, the CU, super., the listener's hold (W0 calibration)"),
    ("C03", "26.10", "26A.06", "The quote card, F1.2 (TPOOL, early-web), THAT NIGHT in the dark room, the rewind (W0 calibration)"),
    ("C04", "27.01", "27.10", "Pass one I: the board's grid (caption, toasts), Rima, the all-hands, the hearts"),
    ("C05", "27.11", "27.25", "Pass one II: the committee volley in the boardroom, cut on the ring to the lighthouse throne call"),
    ("C06", "27.26", "28.01", "Pass one III: the security cam, TTEMME, Tasya's door, Step four? / Good question., WHAT THEY DIDN'T KNOW"),
    ("C07", "29.00", "29.10a", "Pass two I: the home shot, i kept quiet., HIS VERSION, eight hearts, the letter, the check, mostly."),
    ("C08", "29.11", "29.13", "Pass two II: Gerg's tile, the quiet beat, gerg never waits to be asked., the blue door, leave it open."),
    ("C09", "29.14", "29.20", "THE TILE AVALANCHE (S3, 16 bars) on the falling-stack kit"),
    ("C10", "30.01", "30.08", "Alyi's regret in the doorway, the walkout, THE LANDLORD (S2), hi. / Hello."),
    ("C11", "30.09", "30.21", "The fires, Terb's full freeze and the pin, the calm-off and the long hold, the new board, the posts, the hourglass"),
    ("C12", "30.22", "31.09", "The lobby sign and the box of zeros, Cancel greys out, okay., Q*, the memo, the nameplate, the observer chair"),
]

# proposed trims (NOT applied): (id, shot(s), delta frames, what, sign-off, comedy cost)
TRIMS = [
    ("W1", ["29.03"], -2 * BEAT, "hearts 8 → 6 (the ECU 7 beats → 5; the 2S stays on the last beat)", "writer (pre-listed #1)", "low"),
    ("W2", ["27.01"], -BEAT, "the caption hold 2 → 1 beat", "writer (pre-listed #2)", "low"),
    ("W3", ["30.03"], -BEAT, "Alyi's hold folded into the hearts' 3 beats", "writer (pre-listed #3)", "low-medium (his real face)"),
    ("W4", ["27.02"], -BEAT, "BUKAJ's toast cut (the keycaps rain stays, 3 beats)", "writer (pre-listed #4)", "low"),
    ("E1", ["27.14b"], -2 * BEAT, "fold the reflection flicker into 27.14a's last word (drawAlyiWindow flicker 'gone', 2 f) and let 27.15's fallaway carry the still black tile", "writer + board", "low"),
    ("E2", ["27.08"], -2 * BEAT, "cut Alyi's exit from the doorway; the all-hands ends on his [P] and hard-cuts to NOV 18", "writer", "low"),
    ("E3", ["29.07a"], -BEAT, "the Orb's triple look in 3 beats, not 4 (name, thumbnail, name; chime on the 3rd)", "editor + board", "low"),
    ("E4", ["30.09"], -BEAT, "the door bangs on beat 3, not 4", "editor", "low"),
    ("E5", ["31.01"], -BEAT, "vault 7 beats → 6; the Q* rail keeps reading into 31.02 (it persists across the cut)", "editor", "low"),
    ("E6", ["30.20"], -BEAT, "Gerg's post held 5 beats (its 71 f read + 4 f), not 6", "editor", "low"),
    ("E7", ["27.10"], -BEAT, "the eulogy post 1 beat earlier over the pour; the blue heart lands 1 beat sooner", "editor + kits", "low"),
    ("E8", ["31.06", "31.07"], -6 * BEAT, "the memo's second half (after the 0.6 s ellipsis) plays over the nameplate insert (board 1's layout): an L-cut of an on-camera line", "WRITER RULING (the script says voiced on camera, never V.O.)", "medium: guardrail question"),
    ("R1", ["27.07", "27.12a", "27.12c", "27.14a", "30.01"], -4 * BEAT, "ALYI re-takes at the top of his band (115 wpm, pauses kept): each line ~0.4 s shorter, one beat each after rounding", "dialogue stage", "low (his pauses are the joke: keep them)"),
]

# draft 3's printed scene clocks (script headings), act frames
PRINTED = OrderedDict([("24", ("12:31", "12:36")), ("25", ("12:36", "13:21")), ("26", ("13:21", "14:16")), ("26A", ("14:16", "14:36")),
                       ("27", ("14:36", "16:27")), ("28", ("16:27", "16:30")), ("29", ("16:30", "18:06")), ("30", ("18:06", "19:31")),
                       ("31", ("19:31", "19:58"))])


def mmss(s):
    m, x = s.split(":")
    return (int(m) * 60 + int(x)) * FPS - EP_IN


FRAMING = {"[W]": "ROOM-WIDE", "[M]": "MEDIUM", "[2S]": "TWO-SHOT", "[P]": "PORTRAIT", "[P2]": "TWO-PORTRAIT", "[PF]": "PORTRAIT-FALLAWAY",
           "[CU]": "CLOSE-UP", "[ECU]": "INSERT", "[POV]": "UI-FULL-BLEED", "[SCR]": "UI-BEZEL", "[GFX]": "GFX", "CARD": "CARD",
           "[HIS VERSION]": "HIS-VERSION", "[W]+[P]": "ROOM-WIDE + PORTRAIT"}
FACE = {"[M]", "[2S]", "[P]", "[P2]", "[PF]", "[CU]", "[ECU]", "[HIS VERSION]"}
SPEAKER = {"NELEH": "NELEH", "MADA": "MADA", "MAS MANALT": "MAS", "RIMA TAMURI": "RIMA", "TILED EMPLOYEE": "TILED EMPLOYEE", "ALYI": "ALYI",
           "MARIO": "MARIO", "ADELINA": "ADELINA", "TTEMME": "TTEMME", "TASYA": "TASYA", "GERG MOCKBRAN": "GERG", "TERB": "TERB"}


def place(s):
    """size one shot and place its line cues (offsets inside the shot)."""
    cues, t = [], None
    lead = s["lead"] if s["lead"] is not None else P_LEAD
    for c in s["lines"]:
        L = LINES[c["id"]]
        n = (c["seg"][1] - c["seg"][0]) if c["seg"] else L["frames_24"]
        if c["at"] is not None:
            at = c["at"]
        elif t is None:
            at = lead
        elif c["gap"] == "beat+":  # the next beat at least one beat after the previous line ends (V.O. clearance)
            at = int(math.ceil((t + BEAT) / BEAT) * BEAT)
        else:
            at = t + (c["gap"] if c["gap"] is not None else GAP)
        cues.append({**c, "start": at, "end": at + n, "frames": n})
        t = at + n
    pcs = []
    for p in s["posts"]:
        L = LINES[p["id"]]
        txt = L["text"].strip('"')
        hold = p["hold"] or post_hold(txt)
        pcs.append({"id": p["id"], "start": p["at"], "end": p["at"] + hold, "text": txt, "tag": L["tag"], "read_min": read_frames(txt)})
    if s["frames"] is not None:
        frames = s["frames"]
    else:
        ends = [0, s["min_frames"]]
        if cues:
            tail = s["tail"] if s["tail"] is not None else (PUNCH if s["punch"] else TAIL)
            if cues[-1]["kind"] == "vo":
                tail = max(tail, BEAT)  # pov 5.1: V.O. ends at least 1 beat before a cut
            ends.append(cues[-1]["end"] + s["hold"] + tail)
        ends += [p["end"] for p in pcs]
        frames = ceil_beat(max(ends))
    for c in cues:
        assert c["end"] <= frames, (s["id"], c)
    return frames, cues, pcs


def main():
    t = 0
    out, rail, prev_rail = [], None, None
    audio, subs, warn = [], [], []
    for s in SHOTS:
        frames, cues, pcs = place(s)
        st, en = t, t + frames
        assert st % BEAT == 0 and frames % BEAT == 0, s["id"]
        d2 = D2S.get(s["d2"]) if s["d2"] else None
        # rail
        rail_ev = None
        if s["rail"]:
            at = s["rail_at"]
            if at == "vo+1beat":
                vo = next(c for c in cues if c["kind"] == "vo")
                at = int(math.ceil((vo["end"] + BEAT) / BEAT) * BEAT)
            rail_ev = {"text": s["rail"], "at": at, "abs": st + at, "read_min": read_frames(s["rail"])}
            rail = s["rail"]
        shown_rail = rail if s["tag"] not in ("[GFX]",) else None
        line_rows = []
        for c in cues:
            L = LINES[c["id"]]
            spk = SPEAKER.get(L["speaker"], L["speaker"])
            text = c["text"] or L["text"]
            row = {"id": c["id"], "speaker": spk, "text": text, "kind": c["kind"] or ("vo" if L.get("mode") == "vo" else "line"),
                   "start": st + c["start"], "end": st + c["end"], "in_shot": [c["start"], c["end"]],
                   "tc_in": tc(st + c["start"]), "file": L["file"], "seg_frames": list(c["seg"]) if c["seg"] else None,
                   "scratch": bool(L.get("scratch")), "tag": L.get("tag"), "mouth": [] if L.get("scratch") else L.get("mouth", []),
                   "words": L.get("words", [])}
            line_rows.append(row)
            audio.append({"id": c["id"], "shot": s["id"], "file": L["file"], "at": st + c["start"],
                          "seg": [c["seg"][0], c["seg"][1]] if c["seg"] else None, "frames": c["frames"], "scratch": bool(L.get("scratch"))})
            subs.append({"start": st + c["start"], "end": st + c["end"], "speaker": spk, "text": text, "kind": row["kind"]})
        # V.O. clearance checks (pov 5.1: ends >= 1 beat before a cut or a spoken line; starts on a beat)
        for c in cues:
            if c["kind"] == "vo":
                if c["start"] % BEAT:
                    warn.append(f"{s['id']}: V.O. {c['id']} starts off the beat ({c['start']})")
                nxt = [d["start"] for d in cues if d["start"] > c["start"]]
                lim = min([frames] + nxt)
                if lim - c["end"] < BEAT:
                    warn.append(f"{s['id']}: V.O. {c['id']} ends {lim - c['end']} f before the next cut/line (< 1 beat)")
                if rail_ev and abs(rail_ev["at"] - c["start"]) < BEAT:
                    warn.append(f"{s['id']}: V.O. {c['id']} within a beat of the rail item")
        row = OrderedDict([
            ("id", s["id"]), ("scene", s["sc"]), ("chunk", None), ("tag", s["tag"]), ("framing", s["framing"] or FRAMING[s["tag"]]),
            ("start_frame", st), ("end_frame", en), ("frames", frames), ("dur_s", round(frames / FPS, 3)),
            ("beats", frames // BEAT), ("grid", f"{frames // BAR} bar{'s' if frames // BAR != 1 else ''} + {(frames % BAR) // BEAT} beat{'s' if (frames % BAR) // BEAT != 1 else ''}" if frames % BAR else f"{frames // BAR} bar{'s' if frames // BAR != 1 else ''}"),
            ("tc_in", tc(st)), ("tc_out", tc(en)), ("what", s["what"]), ("bars", s["bars"]),
            ("room", s["room"] or (d2["room"] if d2 else None)),
            ("d2_id", s["d2"]), ("d2_frames", d2["frames"] if d2 else None),
            ("lines", line_rows), ("posts", [{**p, "start": st + p["start"], "end": st + p["end"]} for p in pcs]),
            ("rail_change", rail_ev), ("rail_shown", shown_rail),
            ("text", s["text"]), ("drop_out", s["drop"]),
            ("face_or_hands", s["tag"] in FACE), ("punch_tail", s["punch"]),
            ("assets", (d2["assets"] if d2 else [])), ("assets_new_d3", s["assets_new"]),
            ("notes", s["notes"]),
        ])
        out.append(row)
        t = en
    total = t
    # scene sums vs the printed clock
    scenes = OrderedDict()
    for r in out:
        sc = scenes.setdefault(r["scene"], {"start": r["start_frame"], "end": r["end_frame"], "shots": 0})
        sc["end"] = r["end_frame"]
        sc["shots"] += 1
    for k, v in scenes.items():
        a, b = PRINTED[k]
        v.update({"printed": f"{a}–{b}", "printed_frames": mmss(b) - mmss(a), "frames": v["end"] - v["start"],
                  "tc_in": tc(v["start"]), "tc_out": tc(v["end"])})
        v["delta_frames"] = v["frames"] - v["printed_frames"]
    # chunks
    order = [r["id"] for r in out]
    chunks = []
    for cid, a, b, what in CHUNKS:
        ia, ib = order.index(a), order.index(b)
        rows = out[ia:ib + 1]
        for r in rows:
            r["chunk"] = cid
        chunks.append(OrderedDict([("id", cid), ("first", a), ("last", b), ("shots", [r["id"] for r in rows]), ("n_shots", len(rows)),
                                   ("start_frame", rows[0]["start_frame"]), ("end_frame", rows[-1]["end_frame"]),
                                   ("frames", rows[-1]["end_frame"] - rows[0]["start_frame"]),
                                   ("dur_s", round((rows[-1]["end_frame"] - rows[0]["start_frame"]) / FPS, 2)),
                                   ("tc_in", rows[0]["tc_in"]), ("tc_out", rows[-1]["tc_out"]), ("what", what),
                                   ("lines", [l["id"] for r in rows for l in r["lines"]]),
                                   ("assets", sorted({a["id"] for r in rows for a in r["assets"]})),
                                   ("assets_new_d3", sorted({a for r in rows for a in r["assets_new_d3"]}))]))
    assert all(r["chunk"] for r in out)
    # the POV ledger (pov-and-framing 4.2 / 8.3): shot size per cut
    def share(pred):
        n = sum(r["frames"] for r in out if pred(r))
        return {"frames": n, "pct": round(100 * n / total, 1)}
    ledger = OrderedDict([
        ("faces_and_hands", share(lambda r: r["tag"] in FACE)),
        ("faces_hands_plus_name_cards", share(lambda r: r["tag"] in FACE or r["tag"] == "CARD")),
        ("W", share(lambda r: r["tag"] in ("[W]", "[W]+[P]"))),
        ("POV_SCR", share(lambda r: r["tag"] in ("[POV]", "[SCR]"))),
        ("GFX", share(lambda r: r["tag"] == "[GFX]")),
        ("name_cards", share(lambda r: r["tag"] == "CARD")),
        ("CU", share(lambda r: r["tag"] == "[CU]")),
        ("ECU", share(lambda r: r["tag"] == "[ECU]")),
        ("M_2S", share(lambda r: r["tag"] in ("[M]", "[2S]"))),
        ("portrait_family", share(lambda r: r["tag"] in ("[P]", "[P2]", "[PF]"))),
        ("exit_pass_one", share(lambda r: r["scene"] == "27")),
    ])
    no_plan = total - sum(r["frames"] for r in out if r["scene"] == "25")
    ledger["faces_and_hands_without_THE_PLAN"] = {"frames": ledger["faces_and_hands"]["frames"], "pct": round(100 * ledger["faces_and_hands"]["frames"] / no_plan, 1)}
    ledger["vo_lines"] = sum(1 for r in out for l in r["lines"] if l["kind"] == "vo")
    ledger["vo_seconds"] = round(sum(l["end"] - l["start"] for r in out for l in r["lines"] if l["kind"] == "vo") / FPS, 2)
    ledger["cuts"] = len(out) - 1
    ledger["avg_shot_s"] = round(total / len(out) / FPS, 2)
    # trims
    trims, run = [], total
    for tid, ids, d, what, who, cost in TRIMS:
        run += d
        trims.append(OrderedDict([("id", tid), ("shots", ids), ("delta_frames", d), ("delta_s", round(d / FPS, 2)), ("what", what),
                                  ("sign_off", who), ("comedy_cost", cost), ("act_after_frames", run), ("act_after", f"{run // (60 * FPS)}:{(run // FPS) % 60:02d}.{round((run % FPS) / FPS * 100):02d}")]))
    band_hi, band_lo, printed = (7 * 60 + 34) * FPS, (6 * 60 + 54) * FPS, (7 * 60 + 27) * FPS
    summary = OrderedDict([
        ("act_frames", total), ("act_seconds", round(total / FPS, 3)), ("act_length", f"{total // (60 * FPS)}:{(total // FPS) % 60:02d}.{round((total % FPS) / FPS * 100):02d}"),
        ("episode_in", tc(0)), ("episode_out", tc(total)),
        ("printed_draft3", {"frames": printed, "length": "7:27", "clock": "12:31–19:58"}),
        ("nominal_target", {"length": "7:14 ± 0:20", "band_frames": [band_lo, band_hi]}),
        ("over_printed_draft3", {"frames": total - printed, "s": round((total - printed) / FPS, 2)}),
        ("over_band_top", {"frames": total - band_hi, "s": round((total - band_hi) / FPS, 2)}),
        ("in_band", band_lo <= total <= band_hi),
        ("dialogue_voiced_s", round(sum(l["end"] - l["start"] for r in out for l in r["lines"]) / FPS, 2)),
    ])
    locked = OrderedDict([
        ("meta", OrderedDict([
            ("show", "MR. MAS"), ("episode", "ep01 · research_preview"), ("act", "ACT FOUR · THE BLIP, TOLD TWICE"),
            ("scenes", "24–31 (incl. 26A, 28)"), ("source", "show/episodes/ep01/script.md, Act Four draft 3 (the POV pass), 2026-09-25"),
            ("board", "production/act4/shots.json board 1 (draft 2) carried by d2_id; re-boarded to draft 3 by THE EDITOR at layout level"),
            ("dialogue", "audio/ep01/act4/dialogue/lines.json (recorded, draft 2 lines) + out/ep01/act4/animatic/scratch-vo (the six draft-3 V.O. lines, EDITOR SCRATCH)"),
            ("owner", "THE EDITOR (timing lock + act animatic)"), ("status", "LOCK v1: timed to the recordings; content as scripted (no trims applied); see trims"),
            ("fps", FPS), ("bpm", 96), ("frames_per_beat", BEAT), ("frames_per_bar", BAR),
            ("frame0", "act frame 0 = episode 12:31:00; tc = episode mm:ss:ff at 24 fps; end_frame is exclusive"),
            ("rules", {"lead_portrait": P_LEAD, "gap": GAP, "tail": TAIL, "punch_tail": PUNCH, "round": "every shot rounds UP to a whole beat; every cut is on the act's beat grid",
                       "posts": "unvoiced pop-ups hold ceil_beat(0.25 s + 0.05 s/char) + 1 beat", "vo": "starts on a beat; ends >= 1 beat before a cut or spoken line"}),
            ("generator", "studio/src/episodes/ep01/act4/animatic/tools/lock.py (re-run after any re-record; do not hand-edit)"),
        ])),
        ("summary", summary), ("scenes", scenes), ("shots", out), ("chunks", chunks), ("ledger", ledger), ("trims", trims),
        ("audio_cues", audio), ("subtitles", subs), ("warnings", warn),
    ])
    json.dump(locked, open(P("show/episodes/ep01/production/act4/shots-locked.json"), "w"), indent=1, ensure_ascii=False)
    # the TS data module for the animatic
    ts_shots = [{"id": r["id"], "sc": r["scene"], "chunk": r["chunk"], "tag": r["tag"], "s": r["start_frame"], "e": r["end_frame"],
                 "what": r["what"], "room": r["room"] or "", "rail": r["rail_shown"],
                 "railAt": (r["rail_change"]["at"] if r["rail_change"] else None),
                 "lines": [{"id": l["id"], "who": l["speaker"], "text": l["text"], "kind": l["kind"], "s": l["in_shot"][0], "e": l["in_shot"][1],
                            "mouth": [[m["f"], m["shape"]] for m in l["mouth"]] if not l["seg_frames"] else [[m["f"] - l["seg_frames"][0], m["shape"]] for m in l["mouth"] if l["seg_frames"][0] <= m["f"] < l["seg_frames"][1]]}
                           for l in r["lines"]],
                 "posts": [{"id": p["id"], "text": p["text"], "s": p["start"] - r["start_frame"], "e": p["end"] - r["start_frame"]} for p in r["posts"]]}
                for r in out]
    body = json.dumps(ts_shots, ensure_ascii=False, indent=None, separators=(",", ":"))
    open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data-v1.ts"), "w").write(
        "// GENERATED by tools/lock.py from shots-locked.json (THE EDITOR's timing lock). Do not hand-edit: re-run lock.py.\n"
        "export interface LineCue { id: string; who: string; text: string; kind: string; s: number; e: number; mouth: Array<[number, string]>; }\n"
        "export interface PostCue { id: string; text: string; s: number; e: number; }\n"
        "export interface ShotCue { id: string; sc: string; chunk: string; tag: string; s: number; e: number; what: string; room: string; rail: string | null; railAt: number | null; lines: LineCue[]; posts: PostCue[]; }\n"
        f"export const ACT_FRAMES = {total};\n"
        f"export const SHOTS: ShotCue[] = {body};\n")
    print("total", total, total / FPS, tc(total), summary["act_length"])
    for k, v in scenes.items():
        print(f"{k:4s} {v['tc_in']}–{v['tc_out']} {v['frames']:5d} f  printed {v['printed']} {v['printed_frames']:5d}  delta {v['delta_frames']:+5d} f ({v['delta_frames'] / FPS:+.2f} s)  shots {v['shots']}")
    for c in chunks:
        print(c["id"], c["first"], c["last"], c["start_frame"], c["end_frame"], c["dur_s"], c["n_shots"])
    print(json.dumps(ledger))
    for t_ in trims:
        print(t_["id"], t_["delta_frames"], t_["act_after"])
    for w in warn:
        print("WARN", w)


if __name__ == "__main__":
    main()
