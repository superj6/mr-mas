"""board_v4.py - THE EDITOR's board v4 for Ep1 Act Four (script draft 4.0, the flow pass).

Writes show/episodes/ep01/production/act4/shots-v4.json from production/act4/edit-plan-v4.md §3 (the shot plan),
§5.6 (dialogue spacing) and §4 (the text changes), with the v4.1 finishing pass (§10: after the newcomer read, the
insider read and the flow audit). One record per shot (79 in v4.1; 82 in v4.0), in 8 sequences. v4.1 keeps the v4.0
shot IDs so the notes still point at the right shots: S4.05, S5.07, S6.05, S7.04 and S7.12 are gone, S5.09b and S7.02b
are new. v4.2 (the closing pass, 2026-09-26, after a fresh newcomer read and insider read of v4.1; edit-plan-v4.md §11):
S3.08 and S5.10 are cut (77 shots), S8.07 and S8.10 hold longer, Tasya's plate holds under his sign, the Mario plate
loses "(EX-NOPEAI)", and the noon cursor's tag says what Alyi is to Mas.

Every length here is the plan's planned length (seconds): a starting point for the lock, never a gate. The lock
(lock_v4.py) sets frames from the takes and the read floors, and grows a shot only where its content needs it.

Cue anchors, all in seconds inside the shot:
  L(id, at=s)                    a line placed at s
  L(id, after=id, gap=s)         a reply spaced by a gap (flow-and-continuity §4: quick 0.2-0.5, loaded 0.6-1.2)
  L(id, after=id, ov=frames)     a scripted overlap (lines.json overlap_prev_frames)
  T(kind, text, at=s)            text that must be read (rail, plate, card, post, label, stamp, sign, caption)
  marks={name: s | ('word', line, word, off) | ('end', line, off) | ('text', i, off)}   story points the layout uses
  start=('line', id, lead)       a cut on the turn: the shot starts `lead` s before that (chained) line
Run:  python3 studio/src/episodes/ep01/act4/animatic/tools/board_v4.py
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
import os

OUT = os.path.join(REPO, "show/episodes/ep01/production/act4/shots-v4.json")

SEQS = [
    dict(id="S1", chapter="HIS SIDE · the blow", title="NOON, LAS VEGAS: THE PLAN AND THE CALL", place="the Vegas suite, Nov 17 at noon; THE PLAN and the call inside his laptop",
         question="What does this board want with him?", turn="Cancel; \"You've been removed from the meeting.\"; \"super.\"", v3="A 0:00-0:35.1 (20 shots)", plan_s=41.4,
         cue="MM-07 (felt bar -> WORD -> the waltz -> PLAN -> BREAK, tape-stop to zero on JOIN) then MM-08 LEVERAGE, one take from the connect to Cancel; stop 1 = D6",
         bed="the suite (HVAC, the Strip, the truck) ~-38 dBFS; ~-40 under THE PLAN"),
    dict(id="S2", chapter="HIS SIDE · the blow", title="THAT NIGHT: THE THIRD MARK", place="his dark room, that night",
         question="Has this happened before? How does he take it?", turn="the Orb counts three marks, then rewinds", v3="A 0:35.1-0:47.0 (4 shots)", plan_s=13.25,
         cue="MM-08 26A: the felt's open fifth on the first stroke (the re-entry after D6); pedal only under TPOOL; the Rewind lands on S3's downbeat",
         bed="the dark room -38..-40, pre-lapped 1 s under S1.12; TPOOL frosted office -40 crossfaded on the fronts"),
    dict(id="S3", chapter="THE BOARD'S SIDE · blind", title="FRIDAY, THE BOARD'S SIDE: STEPS ONE TO THREE", place="Neleh's desk, Nov 17 noon into night; one bridged trip to the all-hands",
         question="They've done it. Can they run it?", turn="steps 1-3 done, Gerg gone, \"coup\" owned; by night Mas answers in public", v3="A 0:47.0-1:14.9 (13 shots)", plan_s=31.25,
         cue="MM-09 a (NOON) -> a's night bars, one performance with S4; no stop; thins under the posts and the real lines",
         bed="Neleh's office -40 (day and night); the all-hands crowd -36"),
    dict(id="S4", chapter="THE BOARD'S SIDE · blind", title="THE WEEKEND, THE BOARDROOM: STEP FOUR", place="the boardroom, Nov 18 night to Nov 19 at 11:53 PM",
         question="What's step four?", turn="Macrosoft's door opens with Mas's name on the sign; Mada has no answer", v3="A 1:14.9-1:57.1 (23 shots)", plan_s=49.0,
         cue="MM-09 b -> c -> d (LIGHTHOUSE, both calls) -> e -> f -> g -> h: the pizzicato slows and hangs on one held note under \"Step four?\" and Mada",
         bed="the boardroom -38..-40; the split: boardroom air left, lighthouse wind right; the lobby camera's hum -40"),
    dict(id="S5", chapter="HIS SIDE · what they didn't know", title="HIS SIDE, 2 AM: WHAT THEY DIDN'T KNOW", place="his dark room, Nov 20 at about 2 AM",
         question="Does he have anything left?", turn="every card: the staff, Alyi, the money, Gerg, the open door", v3="A 1:57.1-2:41.8 (19 shots)", plan_s=44.5,
         cue="09x REVERSAL on the card -> its F4 rings into MM-10 a (the DARK ROOM pedal); the Build first with Gerg's tile; stop 2 on Gerg's glance",
         bed="the dark room -38..-40"),
    dict(id="S6", chapter="HIS SIDE · what they didn't know", title="THE AVALANCHE", place="his monitor, showing the board's call from his side",
         question="How does the board fall?", turn="only Mada is left", v3="A 2:41.8-3:01.8 (13 shots)", plan_s=15.5,
         cue="MM-10 b re-rendered to the avalanche's length, each phrase whole; dead stop on MADA's label (stop 3)", bed="the dark room"),
    dict(id="S7", chapter="HIS SIDE · what they didn't know", title="THE RETURN: MONDAY AT HQ, TUESDAY IN THE BOARDROOM", place="NopeAI HQ: the bullpen Mon Nov 20, then the boardroom Tue Nov 21 ~10 PM",
         question="Will they take him back, and on whose terms?", turn="\"Good question.\"; the terms say CEO; Gerg is back; the clock runs out", v3="A 3:01.8-3:41.3 (17 shots)", plan_s=43.5,
         cue="the STRAIGHT violin (holds and decays under the hearts) -> Tasya's Rhodes pad on \"below\" -> MM-11 c1 fades in under S7.05 (the bang inside it) -> out on \"Terms?\" (stop 4) -> c2's C pedal under the stamp -> the Build",
         bed="the bullpen by day -38..-40; the boardroom with fires, crackle ~-36"),
    dict(id="S8", chapter="HIS SIDE · the lobby and after", title="THE LOBBY, AND AFTER", place="the lobby that night, then the bullpen's back wall, Nov 22 to Nov 29",
         question="Is he safe now? What did it cost?", turn="\"okay.\"; Alyi's plate comes off; Macrosoft gets a chair with no vote", v3="A 3:41.3-4:08.9 (10 shots)", plan_s=29.5,
         cue="VICTORY LAP: brass stab on the sign -> chip note -> the 1993 flat line as one tenuto -> bonk (SFX) -> neon buzz quiet -> \"okay.\" -> felt cadence onto the vault's F hum -> into the tag",
         bed="the lobby at night -40, pre-lapped under the shatter; the bullpen by day -40 under the coda"),
]

SHOTS: list[dict] = []


def L(lid, at=None, after=None, gap=None, ov=None, os_=False, via=None, note=""):
    return {k: v for k, v in dict(id=lid, at=at, after=after, gap=gap, ov=ov, os=os_, via=via, note=note).items() if v not in (None, "", False) or k == "id"}


def T(kind, text, at, must=True, hold=None, carry=False, after=None, note=""):
    d = dict(kind=kind, text=text, at=at, must=must)
    if hold is not None:
        d["hold"] = hold
    if carry:
        d["carry"] = True
    if after is not None:
        d["after"] = after
    if note:
        d["note"] = note
    return d


def R(text, at=0.0, hold=None, carry=True, note=""):
    return T("rail", text, at, True, hold, carry, note=note)


# where the board departs from the edit plan's length: {shot: (the plan's s, why)}. The v4.1 FINISHING PASS
# (2026-09-26, after the newcomer read, the insider read and the flow audit of v4) is logged here shot by shot; the
# reasons are in edit-plan-v4.md §10.
DEPART = {
    "S1.04": (5.25, "v4.1: the frame held 2.4 s after EQUITY: 0 (insider: drag). It now holds 1 s after the stamp; (HE TOLD THE SENATE) is a sub-label, not a read gate"),
    "S1.07": (6.0, "v4.1: the speaker-view pin on ALYI is cut (the newcomer read it as a cut that blows up and shrinks); the call is one grid, the card, the dialog"),
    "S1.09": (3.75, "v4.1: the call's own notice 'You've been removed from the meeting.' types after the tile drops and holds for its read (it replaces +1 FIRING); D6 stays about 3.7 s"),
    "S1.10": (2.25, "v4.1: no rail (+1 FIRING is cut: it spent the tally joke 6 s early); one silent beat of the face"),
    "S2.03": (3.5, "v4.1: the rail now says what TPOOL was (two staff revolts), so it needs its read: the flashback holds 4 s"),
    "S3.02": (4.25, "v4.1: no second tick (the post itself is step 2); the pen runs down to the blank and the cut goes to the post"),
    "S3.03": (3.75, "v4.1: held 3.25 s, under the quote's full read floor: the load is 'not consistently candid', read in about 1.2 s (the insider asked for 2 s)"),
    # v4.2: S3.08 (the all-hands wide after Alyi's answer) and S5.10 (Mas's silent look back) are cut: the fresh insider
    # read marked both as air, and the newcomer marked S3.08 as a jagged 1.2 s wide; edit-plan-v4.md §11
    "S3.09": (5.5, "v4.1: no re-stamp: the pen taps the empty EQUITY box the audience saw stamped; the post holds for its read"),
    "S4.10": (2.25, "v4.1: the plate gains what he is (EX-STREAMING CEO), so it lands earlier and holds its read"),
    "S4.13": (4.5, "v4.1: the plate says why Macrosoft is the landlord (NOPEAI RUNS ON ITS SERVERS); the sign and the line follow it"),
    "S5.01": (2.5, "v4.1: halved (insider: 2 s of black announcing a twist)"),
    "S5.06": (10.25, "v4.1: the letter is one quote, the count, the demand, then ALYI scrolled up from below the fold and held (insider: 11 s of scrolling; audit: the reveal showed from the first frame)"),
    "S5.08": (3.0, "v4.1: the check slides in (the wide that ejected it, S5.07, is cut: the check was shown twice)"),
    "S5.09": (6.5, "v4.1: the shot ends on the glance; the glance itself is its own cut-in (S5.09b)"),
    "S5.11": (4.75, "v4.1: the V.O. 'gerg never waits to be asked.' is cut (it told what the scene before had shown); the door steps up from the cut"),
    "S6.06": (4.5, "v4.1: S6.05 and S6.06 are one shot (the cut between them never showed); the grid, the QUIET VOTE out, then MADA's own tile"),
    "S7.02": (5.75, "v4.1: the establishing wide only; Tasya's line moves to his own MCU (S7.02b) so the speaker is findable"),
    "S7.03": (1.25, "v4.1: 'hi.' and TASYA's O.S. 'Hello.' in one held MCU (S7.04's floor overhead is cut: it read as abstract tiles)"),
    "S7.09": (3.25, "v4.1: the hold before the terms card tightened"),
    "S7.13": (5.5, "v4.1: the hourglass drawn at insert scale; trimmed to the post's read"),
    "S8.06": (3.5, "v4.1: the rail is the date only; the REPORTED line moves after 'it's a preview.' (S8.07)"),
    "S8.07": (3.75, "v4.1: holds for the REPORTED rail after 'it's a preview.' (the answer comes after the question, not before); v4.2: +0.5 s (the fresh newcomer read had the rail fully typed for about 2 s at the end of a scene)"),
    "S8.10": (3.0, "v4.2: the act's last image holds a second longer (the fresh newcomer read: the observer chair was gone before it landed)"),
    "S8.08": (5.25, "v4.1: the memo plays across the cut: 'i harbor zero ill will towards him.' is heard over the plate coming off (S8.09)"),
    "S8.09": (2.5, "v4.1: the four screws land on the memo's words; the plate's clean outline holds 0.75 s"),
}


def SH(sid, seq, side, tag, cls, framing, move, ln, v3, does, build="", change="", lines=(), texts=(), marks=None, start=None,
       tail=None, fixed=False, style="[BASE]", sound="", badge=None, whip=None):
    plan, why = DEPART.get(sid, (ln, "v4.1: a new shot (edit-plan-v4 §10)" if sid.endswith("b") else ""))
    SHOTS.append(dict(id=sid, seq=seq, side=side, tag=tag, size_class=cls, framing=framing, move=move, plan_s=plan, board_s=ln, departure=why, from_v3=list(v3),
                      does=does, build=build, change=change, lines=list(lines), texts=list(texts), marks=marks or {},
                      start=start, tail=tail, fixed=fixed, style=style, sound=sound, badge=badge, whip=whip))


B = "BOARD"
M = "MAS"

# =============================================================================== S1 · NOON, LAS VEGAS
SH("S1.01", "S1", M, "[W]", "W", "W", "drift", 3.0, ["24.01"],
   "Where, when and who. The crane truck grinds past and every glass shivers except his. The rail types, holds and clears.",
   "rooms-a drawSuite (truck, shiver) + desk sprite + Orb; whole-pixel drift toward the desk, 12 px at 1 px / 6 f", "lengthened (2.5); still -> drift",
   texts=[R("NOV 17, 2023 · ~NOON PT · LAS VEGAS", 0.0)])
SH("S1.02", "S1", M, "[ECU]", "ECU", "ECU-HANDS", "still", 1.75, ["24.02"],
   "The nudge, one pixel true. His hand goes to the trackpad; the laptop's glow floods the frame and turns to blueprint. The bookend image, and the bridge.",
   "inserts-mas drawNudgeInsert (suite) + BLUEPRINT_PRINT from the glow", "lengthened (1.25) so the bridge registers",
   marks=dict(nudge=0.33, out1=0.83, out2=1.08, glow=1.2, print=1.42), style="[BASE] -> [BLUEPRINT]")
SH("S1.03", "S1", M, "[GFX·sheet]", "GS", "BP-SHEET", "tilt", 9.0, ["25.01", "25.02", "25.02b"],
   "THE PLAN as one tall sheet at the section's scale. HOW TO FIRE A CEO stamps over the drawn chair row (v4.1: the board's how-to, not the act's thesis). \"Three left this year.\" three walk off, one a beat. \"Four of us vote.\" the ring draws round four, who take the invite icons; MAS / CEO and GERG / CO-FOUNDER sit outside it. NOPEAI · THE NONPROFIT draws round the six. \"This board controls the company.\" A 60 px tilt follows the arrow down into NOPEAI · THE COMPANY (CAPPED PROFIT), the CEO box at its right wall, the fence and key ring outside.",
   "plan4.ts: one 480 x 330 sheet redrawn at the section's scale (bpChair row, two-line plates, bpRing, bpBox, bpArrow, bpStamp big); the tilt = bpComposite oy 0 -> 60 at 1 px/f",
   "3 shots -> 1; the blank grid is gone", style="[BLUEPRINT]",
   lines=[L("a4-25-10b", at=1.5), L("a4-25-11", after="a4-25-10b", gap=0.55)],
   texts=[T("stamp", "HOW TO FIRE A CEO", 0.3), T("label", "MAS / CEO · GERG / CO-FOUNDER", 1.2, must=False),
          T("label", "NOPEAI · THE NONPROFIT", ("end", "a4-25-10b", 0.35)), T("label", "NOPEAI · THE COMPANY", ("end", "a4-25-11", 0.55))],
   marks=dict(stamp=0.3, three=("word", "a4-25-10b", "Three", 0.0), four=("word", "a4-25-10b", "Four", 0.0), box=("end", "a4-25-10b", 0.1),
              arrow=("word", "a4-25-11", "controls", 0.0), tilt=("start", "a4-25-11", 0.55), company=("end", "a4-25-11", 0.3)))
SH("S1.04", "S1", M, "[GFX·detail 2x]", "GD", "BP-DETAIL", "still", 4.0, ["25.02c", "25.02d"],
   "One held 2x frame: the CEO box just inside the company's wall, the fence and key ring just outside. The key ring jangles. \"The investor gets-\" VOTES: 0 slams on \"gets\"; MACROSOFT · ~$10B IN (REPORTED) reads. \"And the CEO owns-\" / MADA \"Good question.\" EQUITY: 0 stamps beside the empty box, (HE TOLD THE SENATE) under it; the moth flies out. The two zeros hold side by side for a beat.",
   "plan4.ts: the same sheet, one fixed integer 2x crop (240 x 135 sheet px), lettering at 1x on top", "2 shots -> 1; the zeros in one picture replace the slide", style="[BLUEPRINT]",
   lines=[L("a4-25-12", at=0.55), L("a4-25-13", after="a4-25-12", gap=0.55), L("a4-25-02", after="a4-25-13", ov=4)],
   texts=[T("label", "MACROSOFT · ~$10B IN (REPORTED)", 0.0), T("stamp", "VOTES: 0", ("word", "a4-25-12", "gets", 0.17)),
          T("stamp", "EQUITY: 0", ("word", "a4-25-02", "question", 0.0)), T("label", "(HE TOLD THE SENATE)", ("word", "a4-25-02", "question", 0.12), must=False)],
   marks=dict(jangle=0.1, votes=("word", "a4-25-12", "gets", 0.17), equity=("word", "a4-25-02", "question", 0.0), moth=("end", "a4-25-02", 0.2)))
SH("S1.05", "S1", M, "[GFX·sheet]", "GS", "BP-SHEET", "still", 3.5, ["25.03", "25.04"],
   "Cut back out to the path. The four icon figures walk onto 1. NOON · VIDEO CALL and stop; the path runs on under the fold. The corner curls, the neon bleeds through, the sheet tears back into the suite.",
   "plan25v3 drawPath + curlAt / tearAt over drawClickInsert", "2 -> 1", style="[BLUEPRINT] -> [BASE]",
   texts=[T("label", "1. NOON · VIDEO CALL", 0.9)], marks=dict(curl=2.2, tear=2.85))
SH("S1.06", "S1", M, "[ECU]", "ECU", "ECU-HANDS", "still", 1.5, ["25.05"],
   "His hand; the laptop shows BOARD · VIDEO CALL · JOIN. He clicks on the downbeat; the tape-stop reaches zero on the click.",
   "inserts-mas drawClickInsert, the click re-timed", "lengthened (1.25)", marks=dict(click=0.62))
SH("S1.07", "S1", M, "[POV]", "SW", "SCREEN", "still", 4.75, ["26.01", "26.02", "26.03"],
   "His laptop as one locked screen. The five tiles connect; four vote icons already flipped; the Wi-Fi egg shows one bar. NELEH's card rides the grid. Nobody speaks. The dialog pops up over Mas's tile on the beat: MAS MANALT · OK · Cancel. (v4.1: the speaker-view pin on ALYI is cut.)",
   "callgrid on one clock: G5 + nameCard -> G5 + callDialog", "3 shots -> 1; v4.1: the in-app pin is cut",
   texts=[T("card", "NELEH · READ THE CHARTER. LITERALLY. · FOOTNOTES: ∞", 0.6),
          T("dialog", "MAS MANALT · OK · Cancel", ("mark", "dialog", 0.1), carry=True, note="read on through S1.08 and S1.09, the same screen")],
   marks=dict(card=0.6, dialog=3.5))
SH("S1.08", "S1", M, "[ECU]", "ECU", "ECU-EYES", "still", 1.25, ["26.04"],
   "The eyes strip. His pupils move one pixel toward the dialog. Nothing else on him moves.",
   "mas-cu drawEyesStrip", "lengthened (0.62) so it registers", marks=dict(look=0.5))
SH("S1.09", "S1", M, "[POV]", "SW", "SCREEN", "still", 4.35, ["26.05", "26.06", "26.06b"],
   "The same screen. A cursor with a big ALYI name tag (v4.2: a second line, CO-FOUNDER) steps out of Alyi's tile onto Cancel, one step a beat; Cancel lights in his colour under it, and he clicks on the downbeat. D6: digital silence. His tile drops out and comes apart into tokens; the four tiles slide together without him, and the call's own notice types over them: You've been removed from the meeting.",
   "callgrid + dialog + drawPointer with a collaborator tag (ALYI, his accent colour, the big type) + 26.06b's drop and the G5 -> G4 slide + a call toast", "3 -> 1; the 2x macro is cut; v4.1: the in-world notice replaces +1 FIRING",
   texts=[T("tag", "ALYI · CO-FOUNDER", 0.0, must=False, note="v4.2: the tag's second line says what he is to Mas at the click"), T("toast", "You've been removed from the meeting.", ("mark", "click", 0.33))],
   marks=dict(step1=0.62, step2=1.25, click=1.88), sound="D6 from the click (stop 1)")
SH("S1.10", "S1", M, "[CU]", "CU", "CU", "still", 1.25, ["26.07"],
   "Mas, one silent drawing. Quiet beat 1. The still face is the joke.",
   "mas-cu drawMasCU (strip)", "v4.1: no rail; one beat")
SH("S1.11", "S1", M, "[ECU]", "ECU", "ECU-HANDS", "still", 1.9, ["26.08"],
   "The phone and the laptop's corner. The buzz brings the room back. [super] [super] [super]; the tap comes at once; the mic icon is still lit.",
   "inserts-mas drawStripTapInsert", "as v3", texts=[T("label", "[super] [super] [super]", 0.1)], sound="the buzz ends D6")
SH("S1.12", "S1", M, "[OTS]", "OTS", "OTS", "fallaway", 2.25, ["26.09"],
   "Over his shoulder onto the laptop. \"super.\" The four tiles freeze on the word, held long enough to see (S3 answers it). Then the room falls away in held steps to night.",
   "shoulder(masPortrait) over drawLaptopInsert; the screen = G4 frozen on the word; fallaway() over the last 20 f", "lengthened (1.38); the step-down is the bridge",
   lines=[L("a4-26-01", at=0.25)], marks=dict(fall=("end", "a4-26-01", 0.25)))

# =============================================================================== S2 · THAT NIGHT
SH("S2.01", "S2", M, "[ECU]", "ECU", "ECU-HANDS", "drift", 4.0, ["26A.01"],
   "The dark desk under the cyan key. The pen's clip (the pen from the Macrosoft check) carves the third mark, one stroke a beat. MAS (V.O.) \"i don't keep score.\" from the second beat. He brushes away the shavings; his thumb rests on the new mark.",
   "inserts-mas drawCarveInsert -> drawBrushInsert + drift 1 px / 8 f", "lengthened (3.75); the rail restored in short form",
   lines=[L("a4-26a-vo1", at=1.25)], texts=[R("NOV 17 · NIGHT", 0.0, hold=1.2, carry=False)], marks=dict(brush=2.5))
SH("S2.02", "S2", M, "[ECU·top]", "ECU", "ECU-HANDS", "still", 1.75, ["26A.02"],
   "The three marks from above, big: S2.01's desk after the brush. The Orb's cyan eye-light is a spot on the wood; it steps onto mark 1 (the old, faint one).",
   "inserts-mas drawBrushInsert (its last step) + the Orb's eye-light as a cyan spot stepping mark to mark", "v4.1: the count is drawn at insert scale (the 2S made the marks a few pixels)",
   marks=dict(mark1=0.6))
SH("S2.03", "S2", M, "[F1.2 · EARLY-WEB16]", "W", "W", "front", 4.0, ["26.10"],
   "The render front sweeps out of the lit mark: the frosted boardroom door, two shadows leaning together; then the front sweeps back into the desk. The rail types while the front sweeps in and clears before it sweeps back. Marks 1 and 2 are the two TPOOL revolts.",
   "renderFront (the marks ECU) -> EARLYWEB16 onto rooms-a drawTpoolDoor (leaning shadows), and back onto the marks", "moved from between S1 and S2 into the Orb's count; v4.1: the rail says what happened",
   texts=[R("TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS · (REPORTED)", 0.1, hold=3.15, carry=False)], marks=dict(front_in=0.0, lean=1.4, front_out=3.3),
   style="[BASE] -> [EARLY-WEB16] -> [BASE]")
SH("S2.04", "S2", M, "[ECU·top]", "ECU", "ECU-HANDS", "still", 1.5, ["26A.02"],
   "As S2.02. The light steps to mark 2, then 3, and his thumb comes down on the new one.", "the marks ECU + the eye-light (marks 2, 3) + his thumb", "the bracket's return",
   marks=dict(mark2=0.0, mark3=0.55, thumb=1.1))
SH("S2.05", "S2", M, "[ECU·Orb]", "ECU", "ECU-ORB", "whip-out", 2.5, ["26A.03"],
   "The iris lifts from his thumb to his face. The toast rewinding..., then a whip right to left. The badge flips on the whip's frame.",
   "orb-medium drawOrb (iris) + orbStep + toast; 2-frame whip-out", "as v3", texts=[T("toast", "rewinding…", 1.0)],
   marks=dict(lift=0.33, toast=1.0), whip="out", badge="flip-on-whip")

# =============================================================================== S3 · FRIDAY, THE BOARD'S SIDE
SH("S3.01", "S3", B, "[SCR]", "SW", "SCREEN", "whip-in", 3.0, ["27.01"],
   "Neleh's laptop, bezel in frame. His \"super.\" comes out of the laptop speaker, and the call's caption types it. Nobody looks up: footnotes orbit, the spinner turns, Alyi looks at his own doorway.",
   "callgrid G4 in the [SCR] bezel + the call's live caption (in-world, no typed box); 2-frame whip-in", "lengthened (2.5)",
   lines=[L("a4-27-00", at=0.55, via="speaker")], texts=[T("caption", "super.", ("line", "a4-27-00", 0.0), must=False)], whip="in")
SH("S3.02", "S3", B, "[HIGH]", "ECU", "HIGH-TABLE", "still", 3.4, ["27.02", "27.03"],
   "Neleh's desk from above: the laptop's edge with the call running, the charter, THE PLAN unfolded. 1. NOON · VIDEO CALL ticks. Her pen runs down what the fold hid, 2. BLOG POST · 3. INTERIM CEO · 4. ______, and stops on the blank. (v4.1: no second tick: the post is step 2.)",
   "drawTableInsert (blueprint) + the steps list + the laptop edge (the call at 1:2 in a bezel) + the charter; her pen hand = clickHand stand-in", "2 -> 1",
   texts=[T("label", "1. NOON · VIDEO CALL ✓", 0.2), T("label", "2. BLOG POST · 3. INTERIM CEO · 4. ______", 1.0)],
   marks=dict(tick1=0.4, run0=1.0, run1=2.6))
SH("S3.03", "S3", B, "[SCR]", "SC", "SCREEN", "still", 3.25, ["27.04"],
   "Her laptop, full frame: the NopeAI blog in its own UI. \"...not consistently candid in his communications with the board...\" · NOV 17, 2023. The same words, now in-world.",
   "a blog page in the laptop bezel (quote in the page's own type)", "card -> the laptop; lengthened (3.25)",
   texts=[T("post", "\"…not consistently candid in his communications with the board…\"", 0.15, must=False, note="v4.1: 3.25 s, under the full floor; the load is 'not consistently candid'")])
SH("S3.04", "S3", B, "[MCU]", "MCU", "MCU-F", "still", 4.5, ["27.05", "27.05b", "27.05c"],
   "RIMA, right third, under the hard spotlight in the boardroom's CEO chair, its high back in frame, a closed laptop in front of her. One setup for the exchange. A pencil tick off picture (step 3) on the cut. The plate RIMA TAMURI · HIS CTO · CEO (WEEKEND EDITION) lands as she starts. \"We'll share more soon.\" / NELEH (O.S., through the call) \"Share what?\" / \"More. Soon.\"",
   "rimaSpeakPortrait frameless in spotlight() + the boardroom CEO chair's high back behind her + a drawn laptop lid + platePx", "3 setups in 2 registers -> 1; v4.1: the plate says what she is to him, and lands first",
   lines=[L("a4-27-04", at=0.4), L("a4-27-23", after="a4-27-04", ov=6, os_=True, via="call"), L("a4-27-24", after="a4-27-23", gap=0.6)],
   texts=[T("plate", "RIMA TAMURI · HIS CTO · CEO (WEEKEND EDITION)", ("line", "a4-27-04", 0.1))], sound="pencil tick (step 3) on the cut")
SH("S3.05", "S3", B, "[SCR]", "SW", "SCREEN", "still", 3.0, ["27.06"],
   "Her laptop: the call. Gerg's post arrives as the call's notification: GERG MOCKBRAN · \"...based on today's news, i quit.\" Keycaps pop and rain across the grid. Nothing on the blueprint ticks: he wasn't on the plan.",
   "callgrid G4 [SCR] + a notification (post-ui stand-in) + keycapRain", "toast + post -> one item",
   lines=[L("a4-27-01b", at=0.35)], texts=[T("post", "GERG MOCKBRAN · \"…based on today's news, i quit.\"", 0.35)], marks=dict(keys=1.4))
SH("S3.06", "S3", B, "[W]", "W", "W", "match", 2.75, ["27.07"],
   "A match cut from Alyi's doorway tile to the real doorway: the all-hands from the back of the crowd, the tiled employees, Alyi half cut off in the doorway's screen position. TILED EMPLOYEE (hand up) \"Is this a coup?\"",
   "rooms-b bullpen all-hands (hand up) + drawAlyiStand clipped to the doorway; framed so the door sits where his tile's doorway was", "lengthened (1.54): a new place",
   lines=[L("a4-27-05", at=1.35)], marks=dict(hand=0.9))
SH("S3.07", "S3", B, "[MCU·door]", "MCU", "MCU-FRAME", "still", 2.75, ["27.08"],
   "ALYI, right third, the jamb cutting him. Plate ALYI · HIS CO-FOUNDER, CHIEF SCIENTIST. (a beat) \"You can call it this way\"",
   "alyiSpeakPortrait frameless + doorFrame over the all-hands soft + platePx", "v4.1: his plate (what he is to Mas: the flip has to hurt)",
   lines=[L("a4-27-06", after="a4-27-05", gap=0.8)], texts=[T("plate", "ALYI · HIS CO-FOUNDER, CHIEF SCIENTIST", 0.2)], start=("line", "a4-27-06", 0.38))
SH("S3.09", "S3", B, "[HIGH]", "ECU", "HIGH-TABLE", "still", 4.5, ["27.10", "27.11"],
   "Neleh's desk at night, the lamp on. No rail: the lamp and the post's own 9:32 PM PT say night. Her phone face-up beside the blueprint with his post: \"...the nopeai board should go after me for the full value of my shares\" · 9:32 PM PT. Her pen taps the CEO box's empty EQUITY field. Nothing is stamped: the audience remembers the zero.",
   "drawTableInsert (blueprint) + lamp pool + the CEO box and its empty EQUITY field + the phone + pen hand stand-in", "2 -> 1; v4.1: no re-stamp",
   lines=[L("a4-26a-01b", at=0.3)], texts=[T("post", "\"…the nopeai board should go after me for the full value of my shares\"", 0.3)],
   marks=dict(tap=("text", 0, 0.25)))

# =============================================================================== S4 · THE WEEKEND, THE BOARDROOM
SH("S4.01", "S4", B, "[SCR]", "SW", "SCREEN", "still", 4.75, ["27.12", "27.12b"],
   "The boardroom's wall screen, bezel in frame: the board's call. A heart in the corner of Neleh's tile, then ten, then hundreds, burying the grid. His post scrolls across and holds: \"...sorta like reading your own eulogy while you're still alive\". The one blue heart lands last on Mada's spinner.",
   "avalanche planPile / drawPile on the board's grid in the [SCR] bezel (a clock re-timed so the blue heart lands last) + postChip", "the macro is cut; lengthened (4.25)",
   lines=[L("a4-27-07", at=1.15)], texts=[R("NOV 18", 0.1), T("post", "\"…sorta like reading your own eulogy while you're still alive\"", 1.15)],
   marks=dict(bury=1.15, blue=4.3))
SH("S4.02", "S4", B, "[W]", "W", "W", "still", 3.0, ["27.13", "27.20"],
   "The boardroom at night, held; a cut from the screen. The same buried call on the wall screen, small. Four phones buzz and step toward the table's edge, caller IDs lit: STAFF, STAFF, INVESTORS, STAFF. The blueprint on the table (1-3 ticked, 4 blank). The laptop on a chair shows the black tile. The CEO chair at the head, Rima's, is empty. NELEH stands with a marker, MADA sits, ALYI is a reflection in the window.",
   "rooms-a boardroom wide (phones lit, buzzing, blueprint, laptop, speakerphone) + a wall screen with the hearts + caller-ID labels", "lengthened (0.62): the establishing shot",
   texts=[T("label", "STAFF · STAFF · INVESTORS · STAFF", 0.4)], marks=dict(buzz=0.4))
SH("S4.03", "S4", B, "[MCU]", "MCU", "MCU-F", "still", 2.75, ["27.13b"],
   "NELEH, right third. \"The bylaws allow it. Footnote three.\" The phones ringing under it are what \"it\" answers.",
   "nelehPortrait frameless over the boardroom plate soft 2 (right third, facing left: the board's-side rule)", "-",
   lines=[L("a4-27-08", at=0.3)])
SH("S4.04", "S4", B, "[OTS]", "OTS", "OTS", "still", 3.0, ["27.14"],
   "Over Neleh onto the dark window: Alyi's reflection. \"Step four will reveal itself.\" / NELEH (overlapping) \"When?\" A buzz; one phone's corner hangs over the edge.",
   "boardroom plate + alyiReflection, mirrored so Neleh's shoulder sits right and she looks screen-left", "-",
   lines=[L("a4-27-09", after="a4-27-08", gap=0.45), L("a4-27-10", after="a4-27-09", ov=4)], start=("line", "a4-27-09", 0.2), marks=dict(buzz=("end", "a4-27-10", 0.1)))
SH("S4.06", "S4", B, "[2S]", "M", "2S", "still", 4.75, ["27.15", "27.16", "27.17"],
   "NELEH looking down, MADA, and ALYI's reflection between them. A phone clacks off the table out of frame (v4.1: S4.05's phone insert is cut: the phones were shown twice). \"The company is calling us.\" / ALYI \"That is the company telling us.\" The reflection flickers for two frames.",
   "twoshots drawBoard2S (Neleh looking down; the reflection speaks; its 2-frame flicker); the plates NELEH and MADA", "2 -> 1; lengthened (4.25); v4.1: Mada's plate is his own",
   lines=[L("a4-27-12", at=0.35), L("a4-27-13", after="a4-27-12", gap=0.5)], marks=dict(flicker=("end", "a4-27-13", 0.15)))
SH("S4.07", "S4", B, "[MCU·PF]", "MCU", "MCU-F", "fallaway", 1.5, ["27.18"],
   "NELEH at the blank line, the room stepping down. Her one real moment of doubt. The speakerphone's first dial tone pre-laps under its last frames.",
   "nelehPortrait (right third) over the boardroom, soft stepping 2 -> 4", "lengthened (0.62)", sound="dial tone pre-lap under the last 0.3 s")
SH("S4.08", "S4", B, "[SPLIT]", "M", "SPLIT", "still", 8.5, ["27.20", "27.21", "27.22a", "27.22b", "27.23"],
   "Act One's meanwhile split, both calls in one shot. LEFT: the boardroom speakerphone, Neleh and Mada leaning in. RIGHT: the lighthouse, Mario at a desk buried in paper, the two meters behind him. The four dial tones; the ring carries across; a small throne sits on Mario's handset. The plate lands over the ring: MARIO · THE RIVAL LAB · (REPORTED) OFFERED MAS'S JOB. \"I've written up some thoughts-\" / ADELINA takes the phone: \"In plain English: no.\" (the punchline, now the offer is known). Click. The throne falls; the left pane hears a dial tone. The second phone rings, its caller ID NOZAMA; Mario grabs it: \"Hi. Yes. We're very worried. How much?\" Behind him the meters are already full.",
   "two 240 x 203 panes: the boardroom plate around the speakerphone | lighthouseRoom (Mario, Adelina, throne, meters); a 3-line plate; the caller ID", "5 shots in 2 places -> 1; v4.1: the offer is on the plate before the 'no' (it was a rail after it)",
   lines=[L("a4-27-14", at=2.75), L("a4-27-15", after="a4-27-14", ov=7), L("a4-27-16", after="a4-27-15", gap=1.3)],
   texts=[T("plate", "MARIO · THE RIVAL LAB · (REPORTED) OFFERED MAS'S JOB", 1.0, hold=3.1, note="v4.2: '(EX-NOPEAI)' cut (both reads: too much to read before the 'no')"),
          T("label", "NOZAMA", ("end", "a4-27-15", 0.55), must=False, note="the second phone's caller ID"),
          T("label", "NOZAMA · UP TO $4B · ELGOOG · UP TO $2B", ("end", "a4-27-15", 1.0), must=False)],
   marks=dict(tones=0.0, ring=1.0, click=("end", "a4-27-15", 0.05), ring2=("end", "a4-27-15", 0.55), grab=("line", "a4-27-16", -0.2)),
   sound="the pizzicato out for the four dial tones (a designed rest)")
SH("S4.09", "S4", B, "[SCR]", "SC", "SCREEN", "still", 3.75, ["27.24"],
   "The lobby camera on the boardroom's screen. The chrome reads NOPEAI HQ · LOBBY. A familiar figure walks in; the camera's tracking box reads GUEST. His post, the right way up: \"first and last time i ever wear one of these\".",
   "rooms-a drawLobbyCam (label NOPEAI HQ · LOBBY) + mas-stand walk with the lanyard + a CCTV tracking box + his post (not flipped)", "-",
   lines=[L("a4-27-17", at=0.75)], texts=[R("NOV 19 · RETURN TALKS AT HQ", 0.1), T("label", "GUEST", 0.5), T("post", "\"first and last time i ever wear one of these\"", 0.75)])
SH("S4.10", "S4", B, "[W]", "W", "W", "still", 2.6, ["27.25"],
   "The boardroom. The spotlight swings off the empty CEO chair (Rima's, from S3.04) onto TTEMME: hoodie, headset, hourglass, a blank sticky note for a nameplate. Plate TTEMME · INTERIM CEO #2 · EX-STREAMING CEO. (The talks failed: the board's answer is someone else.)",
   "rooms-a boardroom wide (the spot in 3 held positions, a blank sticky) + ttemme room sprite + platePx", "plate changed; the sticky note's text cut; v4.1: the plate says what he is",
   texts=[T("plate", "TTEMME · INTERIM CEO #2 · EX-STREAMING CEO", 0.3)], marks=dict(swing=0.0))
SH("S4.11", "S4", B, "[LOW·desk]", "MCU", "DESK-LOW", "still", 2.5, ["27.26", "27.27"],
   "The hourglass big in the foreground. He flips it (three held drawings) and the sand starts. His stream's chat panel (LIVE, usernames) spams F. \"Chat... for how long?\"",
   "ttemmePortrait + a stream chat panel (LIVE, usernames, F) + the hourglass (2x stand-in) flipped in 3 held drawings (whole 90-degree turns of the same drawing)", "2 -> 1; v4.1: the chat reads as a stream's chat",
   lines=[L("a4-27-19", at=0.75)], marks=dict(flip=0.0))
SH("S4.12", "S4", B, "[2S]", "M", "2S", "still", 2.5, ["27.28"],
   "NELEH and MADA. The rail types at once and clears inside the shot. The wall steps to slate, and a door appears in it and opens.",
   "twoshots drawBoard2S: slate, the door's held steps", "-", texts=[R("NOV 19 · 11:53 PM PT", 0.0, hold=1.3, carry=False, note="it types and clears before the door opens (script 4.0)")],
   marks=dict(slate=0.1, door=0.65, open=1.3))
SH("S4.13", "S4", B, "[MCU·door]", "MCU", "MCU-FRAME", "still", 5.3, ["27.29"],
   "TASYA in the new doorway, slate light behind him, key ring jangling. The plate TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS lands first and holds (v4.2: it stays up under the sign and clears as he reads). Then he holds up a small sign, arrow pointing out, lettered MAS · GERG ->, and reads his post with pleasure: \"a new advanced AI research team\".",
   "tasyaSpeakPortrait + doorFrame over the slate boardroom + a 3-line plate + a flat sign card (pt)", "lengthened (2.5): the plate, then the sign and the line, in order; v4.1: the plate says why he is the landlord",
   lines=[L("a4-27-20", at=3.0)], texts=[T("plate", "TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS", 0.1, hold=4.3, note="v4.2: held under the sign (the fresh newcomer read had it fully typed for under 2 s)"), T("sign", "MAS · GERG →", 2.75)], marks=dict(sign=2.75))
SH("S4.14", "S4", B, "[HIGH]", "ECU", "HIGH-TABLE", "still", 1.75, ["27.19", "27.30"],
   "The blueprint: 1-3 ticked, 4 blank. NELEH (O.S.) \"Step four?\", and her marker writes ? on step 4 as she asks it.",
   "drawTableInsert (blueprint, 1-3 ticked) + her ? in three strokes + the pen hand stand-in", "2 -> 1",
   lines=[L("a4-27-21", after="a4-27-20", gap=0.8, os_=True)], start=("line", "a4-27-21", 0.35), marks=dict(q=("line", "a4-27-21", 0.0)))
SH("S4.15", "S4", B, "[MCU]", "MCU", "MCU-F", "still", 2.0, ["27.31"],
   "MADA, spinner turning. He doesn't answer. The pizzicato slows and hangs on one held note. Pass one ends on his face.",
   "madaPortrait frameless + the spinner over the boardroom soft", "lengthened (1.25)", sound="the pizzicato's held note (a pedal, not a stop)")

# =============================================================================== S5 · HIS SIDE, 2 AM
SH("S5.01", "S5", M, "[GFX]", "GFX", "GFX", "still", 1.5, ["28.01"],
   "Black, with cream type: WHAT THEY DIDN'T KNOW. The chapter door.", "kit.cards (stand-in) act card", "(2.5)",
   texts=[T("card", "WHAT THEY DIDN'T KNOW", 0.0)], badge="none", sound="09x REVERSAL on the card's downbeat")
SH("S5.02", "S5", M, "[ECU]", "ECU", "ECU-PROP", "still", 2.5, ["29.01"],
   "The dark desk from above: the glass, its water line flat, and the GUEST lanyard laid square beside it. The badge reads HIS SIDE.",
   "rooms-b drawDarkDesk (glass, lanyard)", "lengthened (1.88); the lanyard joins the home shot",
   texts=[R("NOV 20, 2023 · ~2:06 AM PT", 0.1)])
SH("S5.03", "S5", M, "[ECU]", "ECU", "ECU-HANDS", "still", 4.0, ["29.02"],
   "His phone and thumb. RIMA TAMURI's post first, name and avatar legible: \"NopeAI is nothing without its people\". He hearts it on the downbeat. The same words again from another avatar, then two, four, a flood; he hearts every one on the beat.",
   "inserts-mas drawPhone29Timeline (Rima's post first)", "(5.0); the stack becomes a flood",
   lines=[L("a4-29-01", at=0.1)], texts=[T("post", "RIMA TAMURI · \"NopeAI is nothing without its people\"", 0.1)])
SH("S5.04", "S5", M, "[2S]", "M", "2S", "still", 3.0, ["29.03", "29.04"],
   "Mas and the Orb, the lanyard in frame on the desk. The iris steps off the phone onto the lanyard. MAS (V.O.) \"the badge was a joke.\"",
   "twoshots drawDark2S + orbToLanyard", "2 -> 1; the ECU Orb is cut", lines=[L("a4-29-vo2", at=0.85)], marks=dict(lanyard=0.45))
SH("S5.05", "S5", M, "[MCU]", "MCU", "MCU-F", "rack", 2.25, ["29.05"],
   "MAS, left third, turned toward the Orb. (a beat) \"mostly.\" Rack to the Orb, which doesn't look away.",
   "masPortrait frameless + the Orb soft; RACK after the line", "-", lines=[L("a4-29-03", after="a4-29-vo2", gap=0.85)], start=("line", "a4-29-03", 0.62),
   marks=dict(rack=("end", "a4-29-03", 0.1)))
SH("S5.06", "S5", M, "[POV]", "SC", "SCREEN", "scroll", 7.75, ["29.06", "29.07", "29.08", "29.09"],
   "His monitor: the staff letter as one page, with a whole-pixel scroll. The header: STAFF LETTER · TO THE BOARD. One quote, with the counter rolling beside it in the page's corner, SIGNED 505 · 650 · 700 · 745 / 770, stopping with the launch-night clunk. Then the demand. The page scrolls up the signatures and a name comes up from below the fold: ALYI (REPORTED), highlighted, beside his call thumbnail, whose vote icon is still flipped from noon. It holds. On the stop, the Orb's chime and servo, off picture.",
   "one tall page (pt lettering) + odoRoll in its corner + the signature list + drawAlyiTile mini, scrolled with whole px (<= 40 px)", "4 shots in 3 registers -> 1; v4.1: one quote, ALYI below the fold until the scroll, and held",
   texts=[T("label", "STAFF LETTER · TO THE BOARD", 0.2, must=False), T("post", "\"…people that lack competence, judgment and care…\"", 0.7),
          T("label", "SIGNED 745 / 770", ("mark", "clunk", 0.0), must=False), T("post", "\"…unless all current board members resign…\"", ("text", 1, 0.0)),
          T("label", "ALYI (REPORTED)", ("mark", "alyi", 0.0))],
   marks=dict(header=0.2, insult=0.7, count0=0.9, clunk=3.3, scroll=5.3, alyi=6.0), sound="the counter's ratchet + clunk; the Orb's chime + servo on the ALYI stop (off picture)")
SH("S5.08", "S5", M, "[ECU·insert]", "ECU", "ECU-PROP", "still", 3.25, ["29.10"],
   "DELIVERY: the check slides down out of the rack's slot into frame and lies flat: PAY TO: NOPEAI STAFF · ~$86B VALUATION · EVIRHT · memo STAFF SHARE SALE, and VOID IF CEO MISSING stamped beside the figure. Why the staff care, in the check's own words.",
   "a flat check insert (paper, guilloche border, pt lettering) at insert scale, sliding in on held steps", "new insert; v4.1: S5.07's wide is cut, the check arrives here",
   texts=[T("label", "PAY TO: NOPEAI STAFF", 0.35), T("stamp", "VOID IF CEO MISSING", 1.15), T("label", "~$86B VALUATION · EVIRHT · MEMO: STAFF SHARE SALE", 0.35, must=False)],
   marks=dict(slide=0.0, flat=0.33, stamp=1.15))
SH("S5.09", "S5", M, "[OTS]", "OTS", "OTS", "still", 5.0, ["29.11a", "29.11b", "29.12"],
   "Over Mas's shoulder onto the monitor, Gerg's tile large. GERG \"One sec. Compiling-\" / MAS (overlapping) \"what are you building?\" / GERG \"The company. Again. Just in case.\" He stops typing; the cut comes on his look up.",
   "gerg-medium POV tile (lip-sync) + shoulder(masPortrait) in front", "4 shots -> 1; v4.1: the glance is its own cut-in",
   lines=[L("a4-29-04", at=0.35), L("a4-29-05", after="a4-29-04", ov=4), L("a4-29-06", after="a4-29-05", gap=0.35)],
   marks=dict(glance=("end", "a4-29-06", 0.3)), sound="the Build and the keys stop on the glance; the pedal holds (v4.1: a ring-out, not a dead stop)")
SH("S5.09b", "S5", M, "[POV]", "SC", "SCREEN", "still", 1.75, ["29.14"],
   "The cut-in: Gerg's tile fills his monitor. He looks up into his camera, at Mas, and holds. Then his eyes drop and he starts typing again, and the keys' return motivates the cut.",
   "gerg-medium drawGergMediumPOV full-bleed (head up, then typing)", "v4.1: new (the audit: the glance was a few pixels in the OTS)",
   marks=dict(look=0.0, type=1.2))
SH("S5.11", "S5", M, "[2S]", "M", "2S", "still", 2.6, ["29.16"],
   "The dark room's back wall. The slate door steps up out of the shadow in three held steps, a key already in its lock, and Tasya's sign from the boardroom taped to it: MAS / GERG / ->. TASYA (O.S.) \"Everyone is welcome.\" (v4.1: the V.O. 'gerg never waits to be asked.' is cut.)",
   "twoshots drawDark2S; the slate door's held steps from the mark; v4.2: Tasya's sign on the door (whose door, and for whom, before the line widens it)", "v4.1: no V.O.; v4.2: the sign on the door",
   lines=[L("a4-29-07", at=1.5, os_=True)], texts=[T("sign", "MAS / GERG / → (taped to the door)", 0.75, must=False, note="v4.2: Tasya's sign from S4.13, on the door")],
   marks=dict(door=0.25))
SH("S5.12", "S5", M, "[MCU]", "MCU", "MCU-F", "rack", 2.5, ["29.17"],
   "MAS, not turning, the slate door soft behind him, Tasya's sign on it. (overlapping) \"leave it open.\" Rack to the door.",
   "masPortrait frameless + the slate door soft; RACK after the line", "-",
   lines=[L("a4-29-08", after="a4-29-07", ov=4)], start=("line", "a4-29-08", 0.2), marks=dict(rack=("end", "a4-29-08", 0.1)))

# =============================================================================== S6 · THE AVALANCHE
SH("S6.01", "S6", M, "[POV]", "SW", "SCREEN", "still", 4.5, ["29.18", "29.19", "29.22", "29.25", "29.26"],
   "His monitor full-bleed, locked. The board's grid. One employee tile appears at the top edge, then ten, then hundreds, stacking on one continuous clock. The letter's 745 / 770 sits static in the corner.",
   "avalanche planGridStack / drawGridStack sampled on ONE clock across the sequence", "5 -> 1", texts=[T("label", "745 / 770", 0.0, must=False)])
SH("S6.02", "S6", M, "[MCU·PF]", "MCU", "MCU-F", "still", 1.5, ["29.21", "29.28"],
   "MAS, left, watching. Each landing steps the room's light, never his face.", "masPortrait over the dark room soft", "2 -> 1")
SH("S6.03", "S6", M, "[POV·half]", "SC", "SCREEN", "still", 1.9, ["29.23"],
   "ALYI's tile, grown from his grid place (the grid tile is gone), shoved sideways; it resists one beat, then slides off. The call's notice: ALYI left the call.", "drawAlyiTile half-frame over the stack (same clock); his grid tile blanked; a call toast", "v4.1: no doubled face; the notice says he is gone",
   texts=[T("toast", "ALYI left the call", 1.42, must=False, note="drawn by the layout at S6 u=178 (shots4 LEFT_AT)")])
SH("S6.04", "S6", M, "[POV·half]", "SC", "SCREEN", "still", 1.9, ["29.24"],
   "NELEH's tile (her grid tile blanked), footnotes scattering. \"Has anyone read the char-\" Gone. The notice stacks: NELEH left the call.", "drawNelehTile half-frame + scatter over the stack; a call toast", "v4.1: no doubled face; the notice",
   lines=[L("a4-29-09", at=0.3)], texts=[T("toast", "NELEH left the call", 1.71, must=False, note="S6 u=231 (shots4 LEFT_AT)")])
SH("S6.06", "S6", M, "[POV]", "SW", "SCREEN", "still", 5.75, ["29.25", "29.29", "29.30"],
   "The grid. THE QUIET VOTE's black tile is pushed out without a sound (the call's notice stacks: THE QUIET VOTE left the call). Then MADA, wedged in the last gap: his own grid tile grows to half the frame. Every tile presses, and he doesn't move. A beat's hold, then on the downbeat his label flips: MADA · LAST FIRER STANDING. The band stops dead (stop 3), and the label holds.",
   "the stack on the same clock + the black tile shoved off -> drawMadaTile grown from his grid tile's place (the grid tile is gone, not doubled); the label flip in 3 held steps", "v4.1: S6.05 + S6.06 -> 1; ANSWERS GIVEN: 0 is cut (it explained 'Good question.' 28 s early)",
   texts=[T("toast", "THE QUIET VOTE left the call", 0.92, must=False, note="S6 u=258 (shots4 LEFT_AT)"), T("label", "MADA · LAST FIRER STANDING", ("mark", "label", 0.1))],
   marks=dict(qv=0.0, wedge=1.25, label=3.1667), sound="stop 3 on the label")

# =============================================================================== S7 · THE RETURN
SH("S7.01", "S7", M, "[P2 BOX]", "BOX", "BOX", "still", 6.0, ["30.01"],
   "The act's one deliberate box: MAS in his window at his end desk, the GUEST lanyard lying on the desk in front of him, not worn; ALYI in the gap of the conference-room door. ALYI (post) \"I deeply regret my participation in the board's actions.\" Three hearts rise from Mas's window, cross the gap and hang at Alyi's edge. The IOU: 20% COMPUTE note flutters.",
   "twoshots drawDoorwayP2 re-timed + the lanyard sprite on his desk + postCard", "(6.25)",
   lines=[L("a4-30-01", at=0.35)], texts=[R("NOV 20 · NOPEAI HQ", 0.1), T("post", "ALYI · \"I deeply regret my participation in the board's actions.\"", 0.35)],
   marks=dict(heart1=("end", "a4-30-01", 0.05), heart2=("end", "a4-30-01", 0.55), heart3=("end", "a4-30-01", 1.05), up=("end", "a4-30-01", 1.4), iou=("end", "a4-30-01", 1.6)),
   sound="the violin holds its note on the first heart and decays")
SH("S7.02", "S7", M, "[W]", "W", "W", "still", 2.5, ["30.03"],
   "The bullpen, one still wide: where. Coats on, a packed box on every desk. MAS small at his end desk (left). TASYA mid-floor, waiting.",
   "rooms-b bullpen walkout (no steps yet)", "(6.25); v4.1: the establishing wide only",
   sound="Tasya's pad pre-laps under the violin's decay")
SH("S7.02b", "S7", M, "[MCU]", "MCU", "MCU-F", "still", 3.5, ["30.03"],
   "TASYA, right third, in the bullpen, the packed floor soft behind him. \"We are below them, above them, around them.\" Behind him the floor, the ceiling and the walls step to slate on the three words.",
   "tasyaSpeakPortrait over the bullpen walkout soft 2; the landlord steps in the soft room on the words", "v4.1: new (the audit: nobody could find the speaker in the wide)",
   lines=[L("a4-30-02", at=0.35)], sound="the pad takes a chord on each of \"below / above / around\"")
SH("S7.03", "S7", M, "[MCU·PF]", "MCU", "MCU-F", "still", 2.25, ["30.06", "30.06b"],
   "MAS, eyes down, the all-slate bullpen soft. \"hi.\" / TASYA (O.S., overlapping) \"Hello.\" A beat.",
   "swaps-act4 masLookDown over the slate bullpen soft", "lengthened (0.92); v4.1: holds 'Hello.' too (S7.04 is cut)",
   lines=[L("a4-30-03", at=0.6), L("a4-30-04", after="a4-30-03", ov=1, os_=True)])
SH("S7.05", "S7", M, "[M]", "M", "M", "still", 2.0, ["30.07"],
   "MADA among small fires, perfectly still.", "twoshots drawMadaM (fires)", "-", texts=[R("NOV 21, 2023 · ~10 PM PT", 0.1)],
   sound="the fires' crackle pre-laps under the rail; c1 fades in under the shot")
SH("S7.06", "S7", M, "[W]", "W", "W", "still", 7.0, ["30.08", "30.09", "30.11a", "30.11b"],
   "The boardroom, one held wide. The door bangs open: TERB, the extinguisher, the helmet popping on. CARD (FULL FREEZE): TERB / CHAIRS BOARDS ON FIRE · EXTINGUISHERS: 1. Mas walks through the freeze in colour and pulls the pin. The room unfreezes. TERB \"Which room is on fire?\" Everyone looks around. \"...Ah.\"",
   "rooms-a boardroom wide (fires): door + terb walk -> 2-tone freeze + mas-stand walk/reach/pocket + nameCard -> unfreeze + look-around", "4 shots -> 1",
   lines=[L("a4-30-05", at=4.2), L("a4-30-06", after="a4-30-05", gap=0.9)],
   texts=[T("card", "TERB · THE NEW CHAIR · EXTINGUISHERS: 1", ("mark", "freeze", 0.05), note="v4.1: CHAIRS BOARDS ON FIRE told the 'Which room is on fire?' joke before he asks")],
   marks=dict(bang=0.2, helmet=0.95, freeze=1.3, pin=3.1, unfreeze=4.0, look=("end", "a4-30-05", 0.05)))
SH("S7.07", "S7", M, "[2S]", "M", "2S", "still", 2.75, ["30.12", "30.13"],
   "THE CALM-OFF: MAS left, MADA right, Terb spraying behind them. TERB (O.S.) \"Terms?\" The cue drops out (stop 4). (a beat) MADA \"Good question.\", in the same frame.",
   "twoshots drawCalmOff2S (Mada's mouth from the take)", "2 -> 1",
   lines=[L("a4-30-07", at=0.3, os_=True), L("a4-30-08", after="a4-30-07", gap=0.5)], sound="stop 4 on \"Terms?\"")
SH("S7.08", "S7", M, "[MCU]", "MCU", "MCU-F", "still", 1.75, ["30.14"],
   "MAS. One beat late: \"good question.\"", "masPortrait frameless, warm, the fires soft", "-",
   lines=[L("a4-30-09", after="a4-30-08", gap=0.625)], start=("line", "a4-30-09", 0.33))
SH("S7.09", "S7", M, "[2S]", "M", "2S", "still", 2.5, ["30.15"],
   "The same two-shot. HOLD 2 beats while the chaos runs. Mada's spinner stops; he nods once. Terb's hand stamps a term sheet and hands it to both.",
   "twoshots drawCalmOff2S: spinner stops, the nod, the stamp, the hand-over", "lengthened (2.42)",
   marks=dict(stop=0.5, nod=0.7, stamp=1.1, hand=1.75), sound="c2's low C pedal enters under the stamp")
SH("S7.10", "S7", M, "[ECU·insert]", "ECU", "ECU-PROP", "still", 2.0, ["30.15"],
   "The term sheet: TERMS · 1. CEO: MAS MANALT, the rest folded under, THE PLAN's fold again.",
   "a flat paper card (pt) + the blueprint kit's fold in paper colours", "new insert", texts=[T("label", "TERMS · 1. CEO: MAS MANALT", 0.1)])
SH("S7.11", "S7", M, "[POV]", "SC", "SCREEN", "still", 3.25, ["30.16"],
   "His phone in his hand, lit green, keycaps popping off the screen. GERG (post) \"Returning to NopeAI & getting back to coding tonight.\"",
   "a drawn phone (bezel, notch, his thumb) + the post + keycaps", "lengthened (3.0); v4.1: it reads as a phone", lines=[L("a4-30-10", at=0.35)],
   texts=[T("post", "\"Returning to NopeAI & getting back to coding tonight.\"", 0.35)], sound="the Build restarts on the keycaps")
SH("S7.13", "S7", M, "[HIGH]", "ECU", "HIGH-TABLE", "still", 4.6, ["30.18"],
   "The boardroom table, the hourglass at insert scale (a third of the frame). The last grain runs out. TTEMME (post) \"I am deeply pleased by this result, after ~72 very intense hours of work.\" On the post's last beat the glass shatters, and the sand holds the hourglass's shape for a beat, then falls.",
   "drawTableInsert (prop) + kits props hourglass (shatter) at 2x + postCard", "(5.0); v4.1: the hourglass drawn big; trimmed to the read",
   lines=[L("a4-30-11", at=0.2)], texts=[T("post", "\"I am deeply pleased by this result, after ~72 very intense hours of work.\"", 0.2)],
   marks=dict(grain=0.3, shatter=("text", 0, -0.45), fall=("text", 0, 0.15)), sound="the Build's one rest on the sand's held beat")

# =============================================================================== S8 · THE LOBBY, AND AFTER
SH("S8.01", "S8", M, "[LOW]", "W", "LOW-ROOM", "still", 2.75, ["30.19"],
   "The lobby at night. The sign lights up: DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0. MAS at the reception desk, no lanyard, glass in hand.",
   "rooms-a lobby (sign ignites) cropped low", "-", texts=[T("sign", "DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0", 0.45)], marks=dict(ignite=0.25))
SH("S8.02", "S8", M, "[ECU]", "ECU", "ECU-PROP", "still", 1.5, ["30.20"],
   "A maintenance hand (drawn) sets a small box of spare 0 plates under the sign.", "rooms-a drawSignFloorInsert + a drawn gloved hand", "the stand-in is drawn")
SH("S8.03", "S8", M, "[OTS-W]", "OTS", "OTS", "still", 3.0, ["30.21"],
   "Over Mas's shoulder onto the lobby. The dialog pops up: OK · Cancel. Cancel greys out a dither step a beat. The noon arrow's design steps in, its name tag empty, and clicks it: bonk, and the dialog shakes, refused. (One try, as the script: the plan's second try is dropped.)",
   "the lobby night + callDialog (Cancel greying) + drawPointer with an empty tag + shakeAt on the dialog + shoulder(masPortrait)", "+ the shake; the tag is emptied; one try (script 4.0)",
   texts=[T("dialog", "OK · Cancel", 0.2, must=False)], marks=dict(dialog=0.2, grey1=0.62, grey2=1.25, click=1.9))
SH("S8.04", "S8", M, "[CU]", "CU", "CU", "still", 1.75, ["30.22"], "MAS, the lobby's tungsten behind him. Silent, like the first.", "mas-cu drawMasCU (lobby)", "lengthened (1.25)")
SH("S8.05", "S8", M, "[ECU]", "ECU", "ECU-HANDS", "still", 2.5, ["30.23"],
   "His hand sets the glass down on the reception desk's own top (pale stone with a brass edge, under the lobby's tungsten), and nudges it one pixel true. \"okay.\"",
   "inserts-mas drawNudgeInsert (lobby) with the desk recoloured to stone + a brass edge", "the surface places it in the lobby",
   lines=[L("a4-30-12", at=0.85)], marks=dict(set=0.17, nudge=0.4))
SH("S8.06", "S8", M, "[ECU]", "ECU", "ECU-PROP", "still", 2.75, ["31.01"],
   "The vault, stencilled Q*, humming on F.", "inserts-props drawVaultInsert", "(4.38): the static seconds are cut; v4.1: the rail is the date only",
   texts=[R("NOV 22, 2023", 0.2)])
SH("S8.07", "S8", M, "[MCU-2]", "MCU", "MCU-2", "rack", 6.4, ["31.02"],
   "MAS left, already past it; the Orb looking at it; GERG right; the sticky note DO NOT OPEN. DO NOT EXPLAIN. \"What's in there?\" / \"it's a preview.\" Rack to the vault; Gerg reads the note and walks out.",
   "masPortrait + gergGlow frameless over the bullpen soft; a drawn vault door (room scale) + the Orb; RACK to the note", "-",
   lines=[L("a4-31-01", at=0.4), L("a4-31-02", after="a4-31-01", gap=0.3)], texts=[T("label", "DO NOT OPEN. DO NOT EXPLAIN.", ("mark", "rack", 0.1), must=False),
          R("(REPORTED) STAFF HAD WARNED THE BOARD ABOUT Q*", ("end", "a4-31-02", 0.5), carry=False, note="v4.1: after the question and the deflection, not before")],
   marks=dict(rack=("end", "a4-31-02", 0.1)))
SH("S8.08", "S8", M, "[MCU]", "MCU", "MCU-F", "still", 2.6, ["31.03"],
   "MAS at his desk. He reads his memo aloud: \"i love and respect alyi...\" and the cut comes on the breath; \"i harbor zero ill will towards him.\" plays on over S8.09.",
   "masPortrait frameless, warm, over the bullpen soft", "v4.1: the line runs across the cut", lines=[L("a4-31-03", at=0.35)], texts=[R("NOV 29, 2023", 0.1)], tail=-2.5)
SH("S8.09", "S8", M, "[ECU]", "ECU", "ECU-PROP", "still", 3.1, ["31.04"],
   "The boardroom chair back, scorched by sc 30's fire. Over it, MAS (memo, continuing) \"...i harbor zero ill will towards him.\" A screwdriver (drawn hand) takes off the ALYI nameplate: four screws on four of his words. The plate comes away; its clean, unfaded outline stays.",
   "rooms-a drawChairBackInsert + scorch + a drawn hand and screwdriver; the plate's unfaded ghost", "the scorch places it in the boardroom; v4.1: the screws land on the memo's words",
   marks=dict(s1=("word", "a4-31-03", "harbor", 0.0), s2=("word", "a4-31-03", "zero", 0.0), s3=("word", "a4-31-03", "will", 0.0), s4=("word", "a4-31-03", "him", 0.0)))
SH("S8.10", "S8", M, "[W]", "W", "W", "still", 4.0, ["31.05"],
   "The bullpen's window corner. A Macrosoft-blue folding chair unfolds: MACROSOFT · OBSERVER (NON-VOTING). Tasya's key ring drops onto the seat: jangle.",
   "rooms-b bullpen (window corner) + a drawn folding chair (4 drawings) + the key ring", "lengthened (2.5): the chair's owner, in the picture",
   texts=[T("label", "MACROSOFT · OBSERVER (NON-VOTING)", 0.75)], marks=dict(unfold=0.0, keys=2.0))

# the four deliberate music stops and the designed rests (edit-plan-v4 §5.2), by story point, for the lock and the sound pass
SOUND_MARKS = [
    dict(kind="stop", n=1, name="D6: the Cancel click", shot="S1.09", mark="click", until=("shot", "S1.11", 0.0), note="digital silence on every bus; the act's only one; the phone's buzz brings the suite back"),
    dict(kind="rest", name="Gerg's glance (v4.1: a ring-out, not a dead stop)", shot="S5.09", mark="glance", until=("mark", "S5.09b", "type"), note="the Build and his keys stop together; the dark-room pedal holds; the keys return first (S5.09b 'type')"),
    dict(kind="stop", n=3, name="MADA's label", shot="S6.06", mark="label", note="the band stops dead; dark-room air under the label's hold"),
    dict(kind="stop", n=4, name="\"Terms?\"", shot="S7.07", mark=("line", "a4-30-07"), note="the long hold plays in the room; c2's C pedal under the stamp (S7.09 'stamp')"),
    dict(kind="rest", name="the four dial tones at the split's opening", shot="S4.08", mark="tones", until=("mark", "S4.08", "ring"), note="pizzicato out; boardroom air + the tones"),
    dict(kind="hang", name="the pizzicato's held note", shot="S4.14", mark=("line", "a4-27-21"), until=("shot_end", "S4.15"), note="a pedal, not silence"),
    dict(kind="decay", name="the violin's held, decaying note under the three hearts", shot="S7.01", mark="heart1", note="not a stop"),
    dict(kind="rest", name="the sand's held beat", shot="S7.13", mark="shatter", until=("mark", "S7.13", "fall"), note="the Build rests one beat (the C pedal holds)"),
    dict(kind="rest", name="the lobby CU before \"okay.\"", shot="S8.04", mark=0.0, until=("line", "a4-30-12"), note="the lobby's neon buzz on F"),
]

board = dict(
    meta=dict(show="MR. MAS", episode="ep01", act="ACT FOUR · THE BLIP, TOLD TWICE", script="draft 4.0 (the flow pass)",
              source="show/episodes/ep01/production/act4/edit-plan-v4.md §3 (shots), §4 (text), §5.6 (dialogue spacing), §5.2 (stops)",
              board="board v4.1 (the finishing pass, edit-plan-v4 §10)", owner="THE EDITOR (picture pass v4)", generator="studio/src/episodes/ep01/act4/animatic/tools/board_v4.py",
              note="Planned lengths are starting points (flow-and-continuity: guidelines, not gates). lock_v4.py sets the frames."),
    sequences=SEQS, shots=SHOTS, sound_marks=SOUND_MARKS,
)
if __name__ == "__main__":
    json.dump(board, open(OUT, "w"), indent=1, ensure_ascii=False)
    print("wrote", OUT, len(SHOTS), "shots", round(sum(s["plan_s"] for s in SHOTS), 2), "s in the plan,", round(sum(s["board_s"] for s in SHOTS), 2), "s on the board")
    for q in SEQS:
        ss = [s for s in SHOTS if s["seq"] == q["id"]]
        print(q["id"], len(ss), round(sum(s["board_s"] for s in ss), 2), "(plan", q["plan_s"], ")")
