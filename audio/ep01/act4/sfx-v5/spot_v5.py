"""spot_v5.py - the Ep1 Act Four v5 SOUND-EFFECTS SPOTTING: every effect and room bed, to the v5 lock's frames.

Reads   show/episodes/ep01/production/act4/shots-locked-v5.json   the timing lock (24 fps; marks, lines, words)
        audio/sfx/manifest.json                                    the SFX board (every file named here must exist)
Writes  show/episodes/ep01/production/act4/sfx-v5.json            the cue sheet (effects + beds, frames and gains)

Frames are ACT frames at 24 fps (frame 0 = the act's first frame = episode 12:31:00:00, as in the lock). Every frame is
computed from the lock (a shot start, a story mark or a word), never typed, so a re-lock that moves the picture moves
the effects: re-run this script after any change to shots-locked-v5.json.

Sources, in order of authority: the lock's story marks (the pixel preview animates on them); the script's `## ACT
FOUR` (draft 5.1) SOUND calls and stage directions; edit-plan-v5 §4-§5; art-needs-v5; the v4 spotting
(studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py), whose TEMP-SYNTH stand-ins are all replaced here by board
files (audio/sfx/scripts/sounds_4.py).

Run (light, about a second):
  cd /home/jgon/project/art/mrmas && audio/.venv/bin/python audio/ep01/act4/sfx-v5/spot_v5.py
"""
import datetime
import hashlib
import json
import os
from collections import OrderedDict

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
LOCK_PATH = P("show/episodes/ep01/production/act4/shots-locked-v5.json")
OUT = P("show/episodes/ep01/production/act4/sfx-v5.json")
LOCK = json.load(open(LOCK_PATH))
FPS = LOCK["meta"]["fps"]
assert FPS == 24
TOTAL = LOCK["summary"]["act_frames"]
SH = OrderedDict((s["id"], s) for s in LOCK["shots"])
LN = {l["id"]: l for l in LOCK["lines"]}
MAN = {e["id"]: e for e in json.load(open(P("audio/sfx/manifest.json")))}
NEW_BOARD = set()                                   # ids that sounds_4.py added (category act4, or its room beds)
for e in MAN.values():
    if e.get("category") == "act4" or (e["id"].startswith("bed_") and e.get("category") == "room"):
        NEW_BOARD.add(e["id"])
D6 = next(m for m in LOCK["sound_marks"] if m["kind"] == "stop" and m["n"] == 1)
D6_S, D6_E = D6["s"], D6["e"]


# ------------------------------------------------------------------------------------------------ lock helpers
def A(sid, k=0):
    return SH[sid]["s"] + k


def E(sid):
    return SH[sid]["e"]


def Mk(sid, mark, k=0):
    return SH[sid]["s"] + SH[sid]["marks"][mark] + k


def W(lid, word, k=0):
    l = LN[lid]
    for w, f0, _f1 in l["words"]:
        if w.lower().strip(".,?!—-…\"'“”").startswith(word):
            return l["abs_in"] + f0 + k
    raise KeyError((lid, word))


def LI(lid, k=0):
    return LN[lid]["abs_in"] + k


def LO(lid, k=0):
    return LN[lid]["abs_out"] + k


def shot_at(f):
    for s in LOCK["shots"]:
        if s["s"] <= f < s["e"]:
            return s["id"]
    return LOCK["shots"][-1]["id"] if f >= TOTAL else LOCK["shots"][0]["id"]


def seq_at(f):
    for q in LOCK["sequences"]:
        if q["s"] <= f < q["e"]:
            return q["id"]
    return LOCK["sequences"][-1]["id"]


def tc(f):
    e = (12 * 60 + 31) * FPS + int(round(f))
    return f"{e // (FPS * 3600):02d}:{(e // (FPS * 60)) % 60:02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


# word spans (act frames) for the on-words check
WORDS = []
for l in LOCK["lines"]:
    for w, f0, f1 in l["words"]:
        WORDS.append((l["abs_in"] + f0, l["abs_in"] + f1, l["id"], w))
WORDS.sort()


def words_in(a, b, margin=1):
    return [(lid, w) for (s, e, lid, w) in WORDS if s - margin < b and e + margin > a]


# ------------------------------------------------------------------------------------------------ the cue list
CUES = []
DEVICE = {  # the small-speaker chains the mixer applies (the renderer's simple versions: render_v5.py FILTERS)
    "laptop": "Neleh's laptop speaker: band-pass 250 Hz - 7 kHz, a little early reflection of her office",
    "monitor": "Mas's monitor speaker: band-pass 200 Hz - 6 kHz (Gerg's keys and the call's tones on it)",
    "cctv": "the boardroom wall screen playing the lobby camera: band-pass 180 Hz - 3.8 kHz, mono",
}


def cue(frame, sound, gain_db, label, *, pan=0.0, sync_s=None, end_anchor=False, trim_s=None, start_s=0.0, fade_in_s=0.0,
        fade_out_s=None, rev=False, loop_until=None, loop_offset_s=0.0, device=None, source="script", replaces=None,
        clear_of_words=False, max_shift_f=12, group=None, optional=False, ride=None, note=None):
    """frame: the story frame the sound belongs to (its transient for a hit, its start otherwise, its END if end_anchor)."""
    if sound not in MAN:
        raise KeyError(f"not on the SFX board: {sound}")
    CUES.append(dict(frame=int(round(frame)), sound=sound, gain_db=float(gain_db), label=label, pan=pan, sync_s=sync_s,
                     end_anchor=end_anchor, trim_s=trim_s, start_s=start_s, fade_in_s=fade_in_s, fade_out_s=fade_out_s,
                     rev=rev, loop_until=loop_until, loop_offset_s=loop_offset_s, device=device, source=source,
                     replaces=replaces, clear_of_words=clear_of_words, max_shift_f=max_shift_f, group=group,
                     optional=optional, ride=ride, note=note))


RR = lambda base, i, n: f"{base}_{(i % n) + 1}"  # noqa: E731

# ================================================================ S1 · NOON, LAS VEGAS: the suite, THE PLAN, the call
cue(A("S1.01"), "crane_truck_pass", -16, "the crane truck grinds past far below on the closed street circuit",
    source="script SOUND (sc 24)", replaces="TEMP-SYNTH:truck",
    note="If the Act Three owner takes the tone guide's §4 handoff, pre-lap it under sc 23's black (move it earlier; nothing here changes).")
for i, (k, p, what) in enumerate(((16, -0.6, "a flute on the minibar"), (24, 0.55, "a tumbler"), (31, -0.25, "the ice bucket"),
                                   (39, 0.75, "a vase"))):
    cue(A("S1.01", k), f"glass_shiver_{(1, 2, 4, 3)[i]}", -24 - (i % 2), f"every glass shivers as it passes: {what} (his does not: nothing at centre)",
        pan=p, source="script", replaces="TEMP-SYNTH:ting")
cue(Mk("S1.02", "nudge"), "glass_nudge", -20, "two fingers nudge his glass one pixel true", source="script", replaces="v4 key_tap_soft_03")
cue(Mk("S1.02", "print"), "palette_step_C", -22, "the laptop's glow floods the frame and turns to blueprint", source="script",
    replaces="TEMP-SYNTH:thunk")
cue(Mk("S1.03", "stamp"), "rubber_stamp_C", -8, "HOW TO FIRE A CEO: the stamp", source="lock mark (stick)")
for i in range(3):
    cue(Mk("S1.03", "three", 15 * i), f"chair_walkoff_{i + 1}", -22, f"three chairs walk off, one a beat ({i + 1}/3)", pan=(-0.4, 0.0, 0.4)[i],
        source="lock mark 'three' (word 'stepped')", replaces="TEMP-SYNTH:tick",
        note="The plan puts the walk-offs in the 0.8 s after 'year' on the waltz's F F F; the lock (what the picture animates) puts them on 'stepped'. If the picture moves, these follow the mark.")
cue(Mk("S1.03", "four"), "drafting_ink_stroke", -20, "the ring draws round the four", trim_s=0.75, fade_out_s=0.08,
    source="lock mark", replaces="TEMP-SYNTH:scribble")
cue(Mk("S1.03", "box"), "drafting_ink_stroke", -22, "a box draws round NOPEAI · THE NONPROFIT", trim_s=0.5, fade_out_s=0.06,
    start_s=0.3, source="lock mark", replaces="TEMP-SYNTH:scribble")
cue(Mk("S1.03", "arrow"), "drafting_ink_stroke", -20, "the arrow's long stroke down to the company", trim_s=1.2, fade_out_s=0.15,
    source="lock mark", replaces="TEMP-SYNTH:scribble")
cue(Mk("S1.04", "jangle", -2), "key_ring_jangle_1", -20, "the investor's key ring jangles, hopeful", pan=-0.3, source="lock mark",
    replaces="TEMP-SYNTH:jangle")
cue(Mk("S1.04", "votes"), "rubber_stamp_C", -7, "VOTES: 0", source="lock mark (stick)")
cue(Mk("S1.04", "equity"), "rubber_stamp_C", -8, "EQUITY: 0 (HE TOLD THE SENATE), on 'question'", source="lock mark (stick)")
cue(Mk("S1.04", "moth"), "paper_flutter", -20, "the moth flies out of the CEO box", trim_s=0.8, fade_out_s=0.2, source="script")
cue(Mk("S1.05", "setdown"), "pen_tick_3", -22, "her figure puts its pointer down", source="script", replaces="TEMP-SYNTH:tick")
cue(Mk("S1.05", "join"), "chair_walkoff_2", -24, "the four step onto 1. NOON · VIDEO CALL", source="script", replaces="TEMP-SYNTH:tick x4")
cue(Mk("S1.05", "curl"), "paper_curl", -16, "the fold's corner curls up; Vegas neon bleeds through", source="lock mark", replaces="v4 paper_flutter")
cue(Mk("S1.05", "tear"), "paper_tear", -10, "the blueprint tears along step 1's line, back into the suite", source="lock mark",
    replaces="v4/stick paper_whip")
cue(Mk("S1.06", "click"), "dialog_ok_click", -8, "JOIN: the trackpad click (the waltz's tape-stop reaches zero on it)", source="lock mark (stick)")
cue(A("S1.07", 1), "call_connect--chip", -18, "his laptop's call connects (his side, 1-bit era)", source="script", replaces="v4 bell_ding_F6--chip")
cue(Mk("S1.07", "dialog"), "dialog_ok_click--chip", -16, "the dialog pops up over his tile, on the beat", source="lock mark")
for k, lab in ((0, "the ALYI / CO-FOUNDER arrow appears"), (19, "the arrow steps (one whole-pixel step a beat)"),
               (38, "the arrow steps onto Cancel; Cancel lights")):
    cue(A("S1.09", k), "key_tap_soft_05", -27 if k == 0 else -26, lab, source="lock marks step1/step2")
cue(Mk("S1.09", "click"), "dialog_ok_click", -4, "CANCEL: the click. D6 starts on it; only this transient survives the mute",
    source="lock mark / script SOUND: DROP-OUT",
    note="D6 = act f %d-%d: every bus muted (music, SFX, rooms, reverb returns), 0.25 s of this click's own transient only. No glyph_dissolve inside D6 (OST-BIBLE §6.8 request 4)." % (D6_S, D6_E))
cue(Mk("S1.11", "buzz"), "phone_buzz_desk", -10, "the phone buzzes on the desk, and the room's sound comes back with it (D6 ends)",
    source="lock mark / script", replaces="TEMP-SYNTH:buzz")
cue(Mk("S1.11", "buzz", 16), "heart_tap_1", -22, "his thumb taps the middle [super] at once", source="script", replaces="v4 key_tap_soft_02")
for i, (k, nm, g) in enumerate(((0, "palette_step_C", -26), (8, "palette_step_Ab", -27), (16, "palette_step_F", -28))):
    cue(Mk("S1.12", "fall", k), nm, g, f"the room falls away to night in held palette steps ({i + 1}/3)", source="script",
        replaces="TEMP-SYNTH:thunk")

# ================================================================ S2 · THAT NIGHT: the third mark
for i in range(4):
    cue(A("S2.01", 6 + 15 * i), f"pen_carve_{i + 1}", -17, f"the pen's steel clip carves the third mark, one stroke a beat ({i + 1}/4)",
        source="script", replaces="TEMP-SYNTH:scribble")
cue(Mk("S2.01", "brush"), "shavings_brush", -22, "he brushes the shavings away with the side of his hand", source="script",
    replaces="TEMP-SYNTH:scribble")
cue(Mk("S2.02", "mark1"), "orb_servo", -16, "the Orb's eye-light steps onto mark 1", source="lock mark")
cue(Mk("S2.03", "front_in"), "render_front_sweep", -12, "F1.2: the render front sweeps out of mark 1 (EARLY-WEB16)", source="script SOUND")
cue(A("S2.04"), "render_front_sweep", -15, "the front sweeps back into the wood (the first 1.0 s of the sweep, reversed; its end lands on the cut)",
    end_anchor=True, rev=True, trim_s=1.0, source="stick (render_front_sweep @S2.04)")
cue(Mk("S2.04", "mark2"), "orb_servo", -17, "the light steps to mark 2", source="lock mark")
cue(Mk("S2.04", "mark3"), "orb_servo", -16, "mark 3", source="lock mark")
cue(Mk("S2.04", "thumb"), "orb_servo", -19, "and stops on his thumb", source="lock mark")
cue(Mk("S2.05", "lift"), "orb_servo", -14, "the iris lifts from his thumb to his face", source="lock mark")
cue(Mk("S2.05", "toast"), "ui_toast_pop", -20, "toast: rewinding…", source="script")
cue(A("S3.00a"), "tape_spinup", -15, "the Rewind: tape_spinup reversed, its end on the whip's cut", end_anchor=True, rev=True,
    source="script SOUND", optional=True,
    note="The script calls it; OST-BIBLE §1.3 D4 makes the Rewind a retrograde in the score and 'not a reverse swell'. Keep it only if the score's Rewind leaves room; it is marked optional.")
cue(A("S3.00a"), "whip_air", -14, "the WHIP, right to left, into pass one (its peak on the cut)", sync_s=0.19, source="script",
    replaces="TEMP-SYNTH:air")

# ================================================================ S3 · FRIDAY, THE BOARD'S SIDE
cue(Mk("S3.00a", "connect"), "call_connect", -16, "the fifth tile connects: MAS, small, one bar of Wi-Fi", device="laptop",
    source="lock mark (stick bell_ding_F6)")
cue(Mk("S3.01", "removed"), "call_leave", -20, "his tile simply goes; the four close the gap", device="laptop", source="script")
cue(Mk("S3.01", "grey"), "ui_mute_blip", -24, "the audio chip's microphone greys out", device="laptop", source="script")
cue(Mk("S3.02", "tick1"), "pen_tick_1", -14, "her pen ticks 1. NOON · VIDEO CALL ✓", source="lock mark (stick)", replaces="TEMP-SYNTH:tick")
cue(Mk("S3.02", "run0"), "pen_run", -20, "the pen runs down what the fold hid, and stops on the blank",
    trim_s=round((Mk("S3.02", "run1") - Mk("S3.02", "run0") + 8) / FPS, 2), fade_out_s=0.1, source="lock marks run0/run1",
    replaces="TEMP-SYNTH:scribble")
cue(Mk("S3.03", "post"), "post_click", -12, "she clicks Post, on a tick", source="lock mark (stick)")
cue(A("S3.04"), "pen_tick_2", -16, "pen tick, off picture: step 2", source="script", replaces="TEMP-SYNTH:tick")
cue(Mk("S3.04", "join"), "call_join_chime", -14, "a join chime: Rima's tile", device="laptop", source="lock mark (stick bell_ding_F6)")
cue(Mk("S3.04", "join", 6), "spotlight_swing", -22, "a hard circular spotlight finds the fifth slot, lit like a stage", sync_s=0.55,
    device="laptop", source="script")
cue(Mk("S3.04", "smooth"), "cloth_rustle", -24, "jacket perfect; she smooths it anyway", device="laptop", source="script")
cue(Mk("S3.04b", "tick"), "pen_tick_3", -16, "pen tick: step 3", source="lock mark (stick)", replaces="TEMP-SYNTH:tick")
cue(A("S3.06", -6), "crowd_hush", -14, "the crowd hushes (the employee is already standing, hand up); pre-laps the match cut by 6 f",
    source="script", replaces="TEMP-SYNTH crowd bed ride")
cue(Mk("S3.07", "step"), "footstep_soft_1", -24, "Alyi steps back out of the doorway", source="lock mark", replaces="(new)")
cue(Mk("S3.07", "step", 9), "footstep_soft_2", -27, "… and the doorway is empty", source="lock mark")
cue(Mk("S3.07", "step", -4), "crowd_stir", -16, "the crowd stirs after Alyi, into the match cut", source="script SOUND (the all-hands stirs after Alyi)")
cue(Mk("S3.05", "post"), "bell_ding_F6", -18, "Gerg's post arrives as the call's own notification", device="laptop", source="script")
cue(Mk("S3.05", "keys"), "keycap_popcorn", -11, "keycaps pop out of the frame like popcorn and rain across the grid", source="script SOUND")

# ================================================================ S4 · THE WEEKEND, THE BOARDROOM
cue(A("S4.01", 7), "heart_gliss", -13, "hundreds of red hearts pour down over the call, stacking", source="script SOUND (heart_gliss, stacking)")
cue(Mk("S4.01", "post"), "bell_ding_F6--chip", -22, "his post scrolls across the hearts (the call's notification)", source="script",
    note="No sound on the one blue heart: it is texture, never a cause, and nobody notices it (script 5.1).")
PH = [(-0.5, "STAFF"), (-0.15, "STAFF"), (0.2, "INVESTORS"), (0.5, "STAFF")]
for i, (p, who) in enumerate(PH):
    cue(Mk("S4.02", "buzz", 4 * i), f"phone_buzz_step_{i + 1}", -14, f"four phones buzz and each takes one held step toward the edge ({who})",
        pan=p, source="lock mark (stick BUZZ)", replaces="TEMP-SYNTH:buzz", clear_of_words=True, group="S4.02 buzz 1")
for i, j in enumerate((2, 0)):
    cue(Mk("S4.02", "buzz2", 4 * i), f"phone_buzz_step_{j + 1}", -15, "Buzz. Step. (between her two turns)", pan=PH[j][0],
        source="lock mark (stick BUZZ)", replaces="TEMP-SYNTH:buzz", clear_of_words=True, group="S4.02 buzz 2")
cue(Mk("S4.04", "buzz"), "phone_buzz_step_4", -14, "Buzz. Step. One phone's corner hangs over the edge", pan=0.35,
    source="lock mark (stick BUZZ)", replaces="TEMP-SYNTH:buzz", clear_of_words=True, max_shift_f=24)
cue(Mk("S4.06", "clack", -7), "phone_buzz_step_3", -15, "Buzz. (the first phone walks itself off the edge)", pan=0.4,
    source="script", replaces="TEMP-SYNTH:buzz", clear_of_words=True)
cue(Mk("S4.06", "clack"), "phone_clack_floor", -11, "out of frame, the first phone goes off the table's edge: *clack*", pan=0.45,
    sync_s=0.16, source="lock mark / script", replaces="TEMP-SYNTH:clack (stick landing_thunk)", clear_of_words=True)
for i, (p, g) in enumerate(((0.3, -15), (-0.25, -16), (0.55, -17))):
    cue(LO("a5-27-28", 3 + 15 * i), "phone_clack_floor", g, f"from here the rest of the phones go over the edge, one per beat ({i + 2}/4)",
        pan=p, sync_s=0.16, source="script", replaces="TEMP-SYNTH:clack", clear_of_words=True)
cue(Mk("S4.07", "pull"), "speakerphone_pull", -16, "she pulls the speakerphone across the table to her", source="lock mark / script")
for i, nt in enumerate(("F4", "Eb4", "Db4", "C4")):
    cue(Mk("S4.07", f"tone{i + 1}"), f"speakerphone_key_{nt}", -16, f"she dials: four tones, one per seat ({nt}: Step Four's line)",
        source="lock mark (stick DTMF) / OST-BIBLE §6.8 request 1", replaces="TEMP-SYNTH:tones")
cue(Mk("S4.08", "ring"), "speakerphone_ringback", -21, "left pane: the ring carries across the line", pan=-0.55, source="script",
    replaces="TEMP-SYNTH:ring")
cue(Mk("S4.08", "ringB"), "speakerphone_ringback", -22, "left pane: the second ring", pan=-0.55, source="lock mark (stick RING 2)")
cue(Mk("S4.08", "ring"), "desk_phone_ring", -17, "right pane: a phone rings on a desk buried in paper (two rings)", pan=0.55,
    source="lock marks ring/ringB (stick RING)", replaces="TEMP-SYNTH:ring")
cue(Mk("S4.08", "ringB", 16), "handset_pickup", -18, "Mario looks at the throne on the handset, and picks up", pan=0.55, source="script",
    clear_of_words=True)
cue(Mk("S4.08", "click"), "handset_hangup", -12, "*Click.* Adelina hangs up", pan=0.5, source="lock mark / script", replaces="v4 dialog_ok_click")
cue(Mk("S4.08", "click", 3), "throne_topple", -20, "the throne falls off the handset", pan=0.55, source="script", replaces="TEMP-SYNTH:thunk")
cue(Mk("S4.08", "tone"), "dial_tone_speaker", -30, "left pane: Neleh and Mada are listening to a dial tone (open fifth F4 + C5)",
    pan=-0.6, loop_until=E("S4.08"), fade_in_s=0.05, fade_out_s=0.12, source="lock mark (stick DIALTONE) / script",
    replaces="TEMP-SYNTH:dialtone (350 + 440 Hz, an F-major third)")
cue(Mk("S4.08", "ring2"), "desk_phone_ring--b", -17, "right pane: the second phone rings, caller ID NOZAMA", pan=0.6,
    source="lock mark (stick RING 3)", replaces="TEMP-SYNTH:ring")
cue(Mk("S4.08", "grab"), "handset_pickup", -20, "Adelina picks it up and hands it to him without looking", pan=0.55,
    source="lock mark", replaces="TEMP-SYNTH:clack", clear_of_words=True)
for i in range(5):
    cue(Mk("S4.09", "walk", 7 * i), f"footstep_hard_{i % 4 + 1}", -28 - 0.5 * i, "on the lobby camera he walks out, toward the revolving door",
        pan=0.1 + 0.1 * i, device="cctv", source="lock mark 'walk'", replaces="TEMP-SYNTH:step")
cue(Mk("S4.09", "walk", 14), "revolving_door", -24, "the revolving door takes him, and keeps turning (cut with the shot)", device="cctv",
    loop_until=E("S4.09"), fade_out_s=0.15, source="script / art-needs ROOM-LOBBY-CCTV-DESK")
cue(Mk("S4.10", "swing", 13), "spotlight_swing", -16, "the spotlight swings off Rima's tile, across the room, onto the CEO chair",
    sync_s=0.55, source="lock mark 'swing'", replaces="v4 letter_clunk")
cue(Mk("S4.10b", "slide"), "folder_slide", -16, "Neleh slides a sealed folder across the table", source="lock mark")
cue(Mk("S4.10b", "seal"), "folder_seal_break", -18, "he breaks the seal, the folder turned away from us", source="lock mark")
cue(Mk("S4.10b", "open"), "folder_open", -20, "and reads behind its cover (the clockwork ticking is the score's)", source="lock mark")
cue(Mk("S4.10b", "close"), "folder_close", -16, "he closes it: 'Okay.'", source="lock mark")
cue(Mk("S4.11", "flip", 8), "hourglass_flip", -14, "he flips the hourglass (three held drawings); its knock on the table lands on the third", source="lock mark",
    replaces="TEMP-SYNTH:thunk")
cue(Mk("S4.11", "flip", 10), "sand_trickle", -30, "the sand starts to fall (one tick per grain is the score's)", loop_until=E("S4.11"),
    fade_in_s=0.25, fade_out_s=0.1, source="script", replaces="TEMP-SYNTH:sand")
cue(Mk("S4.12", "slate"), "palette_step_F", -20, "the wall steps to MACROSOFT slate blue", source="script", replaces="TEMP-SYNTH:thunk")
cue(Mk("S4.12", "door"), "slate_door_step_1", -17, "a door that wasn't there appears in the wall (held step 1)", source="lock mark (stick landing_thunk)",
    replaces="TEMP-SYNTH:thunk")
cue(Mk("S4.12", "door", 7), "slate_door_step_2", -18, "(held step 2)", source="stick landing_thunk @28", replaces="TEMP-SYNTH:thunk")
cue(A("S4.12", 36), "door_open_crack", -16, "… and opens", source="script / stick", replaces="TEMP-SYNTH:thunk")
cue(Mk("S4.13", "jangle"), "key_ring_jangle_2", -18, "Tasya in the new doorway, the blueprint's key ring jangling", pan=0.15,
    source="lock mark (stick JANGLE)", replaces="TEMP-SYNTH:jangle",
    note="The score leaves Tasya's offbeats to the jangle (OST-BIBLE §2.15). Only two jangles, here and at the sign: his statement is a real line and plays dry.")
cue(Mk("S4.13e", "sign"), "folder_open", -24, "Tasya holds up a small sign to the room", source="lock mark")
cue(Mk("S4.13e", "jangle"), "key_ring_jangle_3", -16, "the key ring jangles once, on the offbeat", pan=0.15, source="lock mark / script",
    replaces="TEMP-SYNTH:jangle")
cue(Mk("S4.14", "q", -12), "marker_uncap", -22, "her marker comes into frame", source="script", replaces="v4 key_tap_soft_06")
cue(Mk("S4.14", "q"), "marker_write_q", -18, "on the question, the marker writes one mark on step 4: ?", source="lock mark / script",
    replaces="TEMP-SYNTH:squeak")

# ================================================================ S5 · HIS SIDE, 2 AM
for i in range(5):
    cue(Mk("S5.03", f"tap{i + 1}"), f"heart_tap_{i % 3 + 1}", -18, f"he hearts every one on the beat. *Tick.* ({i + 1}/5)",
        source="lock marks (stick key taps) / script", replaces="v4 post_click")
cue(Mk("S5.04", "lanyard"), "orb_servo", -14, "the Orb's iris steps off the phone onto the lanyard", source="lock mark / script SOUND")
cue(Mk("S5.09", "ring"), "call_ring", -16, "in the monitor's corner a video tile rings: GERG", device="monitor", source="lock mark (stick RING)",
    replaces="TEMP-SYNTH:ring")
cue(Mk("S5.09", "click"), "dialog_ok_click", -14, "Mas clicks it", source="lock mark (stick)")
cue(Mk("S5.09", "click", 1), "call_connect", -22, "the tile opens big enough to act in", device="monitor", source="script")
cue(Mk("S5.09", "click", 8), "typing_fast_loop", -22, "Gerg typing, 2 AM, through the monitor's small speaker (he doesn't look up)",
    loop_until=E("S5.09"), fade_in_s=0.1, fade_out_s=0.25, device="monitor", source="script", replaces="v4 key_tap_soft run")
cue(Mk("S5.06", "c650"), "counter_roll", -25, "the signature counter rolls on: SIGNED 650", device="monitor", source="lock mark",
    replaces="TEMP-SYNTH:tick")
cue(Mk("S5.06", "c700"), "counter_roll", -25, "SIGNED 700", device="monitor", source="lock mark", replaces="TEMP-SYNTH:tick")
cue(Mk("S5.06", "clunk"), "odometer_ratchet", -9, "it stops at 745 with the clunk we recognise from launch night", sync_s=0.52,
    source="script SOUND (odometer_ratchet)", note="The file's lock clack is at +0.52 s; it lands on the 745.")
cue(Mk("S5.06", "scroll"), "mouse_scroll", -24, "Scroll to the bottom: the page scrolls",
    trim_s=round((Mk("S5.06", "alyi") - Mk("S5.06", "scroll")) / FPS, 2), fade_out_s=0.05, source="lock marks scroll/alyi",
    replaces="TEMP-SYNTH:tick run")
cue(Mk("S5.06", "alyi"), "orb_servo", -19, "the scroll stops on ALYI; the Orb (off picture) turns to it", source="lock mark")
cue(Mk("S5.06", "chime"), "orb_chime_F", -18, "the Orb's chime, in the gap before 'Alyi signed it.'", source="edit-plan-v5 §7 (a5-29-11)",
    replaces="stick bell_ding_F6 / v4 vault_chime_triple")
cue(Mk("S5.08", "flat"), "slot_whir", -13, "the server rack's slot whirs and a check slides down into frame, and lies flat",
    sync_s=0.8, start_s=0.45, source="lock marks slide/flat (stick SLOT)", replaces="TEMP-SYNTH:whir",
    note="The file's first 0.45 s is skipped so the whir starts on the cut, not over Mas's held beat in S5.07b.")
cue(Mk("S5.08", "stamp"), "rubber_stamp_C", -10, "VOID IF CEO MISSING (after Gerg's last word)", source="lock mark (stick)")
cue(A("S5.09-back"), "typing_fast_loop", -21, "back on the monitor: Gerg, still typing, sunny; his keys stop after 'case'",
    loop_until=Mk("S5.09-back", "glance"), loop_offset_s=2.1, fade_in_s=0.05, fade_out_s=0.03, device="monitor",
    source="lock mark 'glance' / script", replaces="v4 key_tap_soft run")
cue(Mk("S5.09b", "type"), "key_tap_soft_03", -18, "Gerg types again: on the first key we cut", device="monitor", source="lock mark / script")
cue(A("S5.11"), "typing_fast_loop", -32, "Gerg's small tile, typing on the monitor behind the two-shot", loop_until=E("S5.11"),
    loop_offset_s=3.3, fade_in_s=0.3, fade_out_s=0.5, device="monitor", source="script")
for i in range(4):
    cue(Mk("S5.11", f"door{i + 1}"), f"slate_door_step_{i + 1}", (-17, -18, -18, -22)[i],
        f"a slate-blue door takes a held step up out of the shadow ({i + 1}/4)", pan=0.2, source="lock marks door1..door4 (stick landing_thunk)",
        replaces="TEMP-SYNTH:thunk")
cue(Mk("S5.11", "key"), "door_key_turn", -14, "a key turns in its lock: the lead-in to Tasya's voice", sync_s=0.34, pan=0.2,
    source="lock mark (stick key_tap_space) / script", replaces="(new)")
cue(Mk("S5.11", "open"), "door_open_crack", -16, "on 'desk', the door opens a crack onto the labelled desks", pan=0.2,
    source="lock mark 'open' / script")

# ================================================================ S6 · THE AVALANCHE (the full band plays over all of it)
cue(A("S6.01", 19), "tile_land_1", -10, "one employee tile lands at the top edge: *thock*", source="script SOUND / stick landing_thunk @19",
    replaces="v4 key_tap_space")
cue(A("S6.01", 31), "tile_land_ten", -13, "then ten", source="script / stick @31-67", replaces="v4 key_tap_space x10")
cue(A("S6.01", 55), "tile_land_hundreds", -15, "then hundreds, stacking like puzzle pieces", source="script", replaces="v4 key_tap_space x22")
cue(A("S6.02", 3), "tile_land_3", -17, "each landing steps the room's light", pan=-0.3, source="script")
cue(A("S6.02", 18), "tile_land_2", -18, "(another)", pan=0.3, source="script")
cue(A("S6.03", 4), "tile_shove", -13, "Alyi's tile grows, resists one beat, and is shoved off the edge", source="script")
cue(A("S6.03", 29), "call_leave", -20, "ALYI left the call", device="monitor", source="lock text", replaces="v4 post_click--chip")
cue(A("S6.04", 2), "tile_shove", -15, "Neleh's tile follows", trim_s=1.0, fade_out_s=0.2, source="script")
cue(A("S6.04", 6), "footnote_sparks", -18, "her footnotes scatter like sparks", source="script", replaces="v4 paper_flutter")
cue(A("S6.04", 33), "call_leave", -20, "NELEH left the call", device="monitor", source="lock text / stick @32")
cue(Mk("S6.06", "label"), "post_click--chip", -20, "MADA · LAST FIRER STANDING: the tile's label flips (the band stops dead on it)",
    source="lock mark (stick freeze_hit_F)", replaces="stick freeze_hit_F",
    note="The script (4.1) makes this label call UI, 'so nothing freezes and TERB's card keeps its distance': no freeze hit here. "
         "THE QUIET VOTE's tile goes 'without a sound' (S6.06 f0): nothing is spotted there, by design.")

# ================================================================ S7 · THE RETURN
for i in range(3):
    cue(Mk("S7.01", f"heart{i + 1}"), f"heart_rise_{i + 1}", (-16, -17, -17)[i],
        f"a red heart rises out of Mas's window and crosses the gap ({i + 1}/3)", pan=(-0.35, -0.05, 0.25)[i],
        source="lock marks heart1..3 / script", replaces="v4 heart_gliss (trimmed)")
cue(Mk("S7.01", "iou"), "paper_flutter", -22, "the IOU note flutters", trim_s=0.6, fade_out_s=0.2, source="lock text")
for w, nm in (("below", "palette_step_F"), ("above", "palette_step_Ab"), ("around", "palette_step_C")):
    cue(Mk("S7.02b", w), nm, -26, f"the {'floor' if w == 'below' else 'ceiling' if w == 'above' else 'walls'} turn slate, on '{w}'",
        source="script", replaces="TEMP-SYNTH:thunk", optional=True,
        note="The score (MM-11) plays chords on 'below / above / around'; these steps are optional, very soft, for the mixer's ear.")
cue(Mk("S7.06", "bang"), "door_bang_open", -6, "the door bangs open: TERB, an extinguisher held like a briefcase", sync_s=0.03,
    source="lock mark (stick landing_thunk) / script", replaces="TEMP-SYNTH:thunk + air")
cue(Mk("S7.06", "helmet"), "tower_pop", -16, "the fire marshal's helmet appears only now", source="lock mark")
cue(Mk("S7.06", "freeze"), "freeze_hit_F", -8, "FULL FREEZE: TERB / THE NEW CHAIR · EXTINGUISHERS: 1", source="lock mark (stick)")
for i, k in enumerate((14, 24, 34)):
    cue(Mk("S7.06", "freeze", k), f"footstep_soft_{i + 2}", -26, "Mas, in colour through the freeze, walks past", source="script")
cue(Mk("S7.06", "pin"), "extinguisher_pin", -12, "he pulls the pin from Terb's extinguisher and pockets it", source="lock mark / script",
    replaces="TEMP-SYNTH:pin")
cue(Mk("S7.06", "unfreeze"), "whip_air", -24, "the room unfreezes", source="lock mark", replaces="TEMP-SYNTH:air")
cue(Mk("S7.07", "spray", -2), "extinguisher_spray", -19, "Terb sprays the chair fire between sentences (a short burst)", trim_s=0.3,
    fade_out_s=0.1, source="lock marks spray/sprayEnd", replaces="v4 steam_hiss + TEMP-SYNTH:spray",
    note="The gap between his sentences is 5 f; a longer spray would cover the record's words.")
cue(Mk("S7.09", "stamp"), "rubber_stamp_C", -9, "Terb stamps the sheet without looking", source="lock mark (stick)")
cue(Mk("S7.09", "hand"), "paper_flutter", -22, "and hands it to both of them at the same time", trim_s=0.45, fade_out_s=0.15, source="lock mark")
cue(Mk("S7.09", "phone", -2), "phone_buzz_desk", -20, "Mas's phone lights green on the table", source="script", replaces="v4 post_click")
cue(Mk("S7.09", "phone"), "keycap_popcorn", -12, "keycaps pop out of the bottom of the frame: Gerg's post", source="lock mark (stick)")
cue(A("S7.13"), "sand_trickle", -30, "the last of the sand running", loop_until=Mk("S7.13", "grain"), fade_in_s=0.1, fade_out_s=0.05,
    source="script", replaces="TEMP-SYNTH:scribble")
cue(Mk("S7.13", "grain"), "sand_last_grain", -20, "the last grain runs out of Ttemme's hourglass", source="lock mark / script")
for i, k in enumerate((-80, -58)):
    cue(Mk("S7.13", "shatter", k), f"glass_strain_{i + 1}", -24 + 2 * i, "the glass takes the strain", source="v4", replaces="TEMP-SYNTH:stress",
        clear_of_words=True)
cue(Mk("S7.13", "shatter"), "hourglass_shatter", -8, "the hourglass shatters, only the glass", source="lock mark / script SOUND")
cue(Mk("S7.13", "fall"), "sand_fall", -16, "the sand holds the hourglass's shape for a beat, then falls", source="lock mark / script",
    replaces="TEMP-SYNTH:sand")

# ================================================================ S8 · THE LOBBY, AND AFTER
cue(Mk("S8.01", "ignite"), "neon_ignite", -10, "the lobby sign lights up over us (on the score's brass stab)", source="lock mark (stick)")
cue(Mk("S8.03", "dialog"), "dialog_ok_click--chip", -18, "the 1993 dialog pops up once more", source="lock mark")
cue(Mk("S8.03", "click", -12), "key_tap_soft_05", -26, "an arrow with an empty name tag steps onto the greyed Cancel", source="script")
cue(Mk("S8.03", "click"), "alert_bonk", -6, "it clicks; the button doesn't go down. *Bonk.*", source="lock mark / script SOUND")
cue(Mk("S8.03", "click", 3), "ui_shake", -20, "the dialog shakes, refused", source="script", replaces="TEMP-SYNTH:clack")
cue(Mk("S8.05", "set"), "glass_set_stone", -16, "his hand sets the glass down on the reception desk's stone top", source="lock mark",
    replaces="v4 key_tap_space")
cue(Mk("S8.05", "nudge"), "glass_nudge", -20, "and nudges it one pixel true", source="lock mark", replaces="v4 key_tap_soft_03")
for i in range(4):
    cue(Mk("S8.07", "walk", 9 * i), f"footstep_soft_{i + 1}", -24 - 2 * i, "Gerg reads the sticky note, nods, and walks out of frame",
        pan=0.4 + 0.15 * i, source="lock mark 'walk' / script")
for i in range(4):
    cue(Mk("S8.09", f"s{i + 1}"), f"screw_turn_{i + 1}", -20, f"a screwdriver backs out the ALYI plate's screws, one on each of four of his words ({i + 1}/4)",
        source="lock marks s1..s4 (stick key taps)", replaces="TEMP-SYNTH:squeak")
cue(E("S8.09", ) - 10, "nameplate_off", -18, "the plate comes off; its clean outline stays", source="script", replaces="v4 letter_clunk")
cue(Mk("S8.10", "unfold"), "chair_unfold", -14, "a MACROSOFT-blue folding chair unfolds itself by the window", source="lock mark / script",
    replaces="TEMP-SYNTH:clack x5")
cue(Mk("S8.10", "keys"), "key_ring_drop", -14, "from somewhere above, Tasya's key ring drops onto the seat. *Jangle.*", source="lock mark / script",
    replaces="TEMP-SYNTH:jangle")
cue(A("S8.06", -6), "vault_hum_F", -22, "the Q* vault hums at the score's root, F (diegetic GLYPH): the coda's pedal, into the tag",
    loop_until=TOTAL, fade_in_s=0.5, source="script / edit-plan-v5 §4 (the vault's F hum as the pedal)",
    ride=[[A("S8.06", -6), 0.0], [A("S8.08"), 0.0], [A("S8.08", 12), -5.0], [TOTAL, -5.0]],
    replaces="v4 server_hum", note="Ducked 5 dB under the memo (a record line: the hum alone, no motif). It runs to the act's last frame; the tag picks it up.")

# ------------------------------------------------------------------------------------------------ the room beds
BEDS = []


def bed(kind, a, b, target, fin=12, fout=12, label="", layers=None, pan=0.0, ride=None, offset_s=0.0, source="script SOUND", replaces=None):
    """A room bed from act frame a to b at `target` dBFS RMS (the bed alone, per channel), equal-power fades in frames."""
    layers = layers or [dict(sound=f"bed_{kind}", gain_db=0.0)]
    for L in layers:
        if L["sound"] not in MAN:
            raise KeyError(L["sound"])
    BEDS.append(dict(kind=kind, in_frame=int(a), out_frame=int(b), target_dbfs_rms=target, fade_in_f=fin, fade_out_f=fout,
                     label=label, layers=layers, pan=pan, ride=ride, offset_s=offset_s, source=source, replaces=replaces))


DARK = [dict(sound="room_drone", gain_db=0.0), dict(sound="room_tone", gain_db=-7.0, lowpass_hz=1200),
        dict(sound="server_hum", gain_db=-12.0, highpass_hz=300)]
CLICK, BUZZ = D6_S, D6_E
bed("suite", 0, CLICK, -38.0, 0, 0, "the suite: hotel HVAC, the Strip far below; 1 dB down under THE PLAN; CUT on the Cancel click (D6)",
    ride=[[0, 0.0], [A("S1.03") - 6, 0.0], [A("S1.03") + 6, -1.0], [A("S1.06") - 6, -1.0], [A("S1.06") + 6, 0.0], [CLICK, 0.0]],
    replaces="TEMP-SYNTH suite (traffic, horns)")
bed("suite", BUZZ, A("S2.01", 6), -38.0, 0, 30, "the suite comes back on the buzz; it falls away with the picture", offset_s=7.3,
    replaces="TEMP-SYNTH suite")
bed("dark", Mk("S1.12", "fall", -14), A("S2.03", 6), -39.0, 24, 12, "the dark room: the drone (F1 + C2), the air, the rack's fans (pre-lapped under the fall-away)",
    layers=DARK, source="script SOUND (sc 26A)")
bed("tpool", A("S2.03", -6), Mk("S2.03", "front_out", 12), -36.5, 12, 12, "F1.2: TPOOL's frosted office (EARLY-WEB16), crossfaded on the fronts",
    source="script SOUND", replaces="TEMP-SYNTH tpool")
bed("dark", Mk("S2.03", "front_out", -6), A("S3.00a", 12), -39.0, 12, 12, "the dark room again; its tail rings 0.5 s under the whip",
    layers=DARK, offset_s=3.1)
bed("office_day", A("S3.00a", -2), A("S3.06", 3), -38.5, 6, 6, "Neleh's office by day, the call's small speaker in it (never quieter than the dark room)",
    replaces="TEMP-SYNTH office")
bed("allhands", A("S3.06", -6), A("S3.05", 6), -35.0, 6, 12, "the all-hands crowd: hushed for the question and the answer, stirring after Alyi",
    ride=[[A("S3.06", -6), -1.0], [A("S3.06", 16), -4.5], [Mk("S3.07", "step", -6), -4.5], [Mk("S3.07", "step", 20), -2.0],
          [A("S3.05", 6), -2.0]], replaces="TEMP-SYNTH allhands murmur")
bed("office_evening", A("S3.05", -6), A("S4.01", 6), -39.0, 12, 6, "Neleh's desk that evening: quieter HVAC, the city, the lamp",
    replaces="TEMP-SYNTH office night")
bed("boardroom_night", A("S4.01", -6), A("S4.08", 4), -38.0, 6, 4, "the boardroom, Saturday night: HVAC, the city through glass",
    replaces="TEMP-SYNTH boardroom")
bed("boardroom_night", A("S4.08", -4), A("S4.09", 4), -40.0, 4, 4, "the split, left pane: the boardroom's air", pan=-0.55, offset_s=5.0,
    replaces="TEMP-SYNTH boardroom")
bed("lighthouse", A("S4.08", -4), A("S4.09", 4), -39.5, 4, 4, "the split, right pane: wind round the lighthouse, surf, the lamp's motor",
    pan=0.55, replaces="TEMP-SYNTH lighthouse")
bed("cctv", A("S4.09", -4), A("S4.10", 4), -40.0, 4, 4, "the lobby camera on the boardroom's wall screen: CCTV hum, big-lobby air",
    replaces="TEMP-SYNTH cctv")
bed("boardroom_day", A("S4.09", -4), A("S4.10", 4), -42.0, 4, 4, "the boardroom by day around the screen (Sunday; it darkens into night at the cut)",
    source="script SOUND (day into night on Sunday)")
bed("boardroom_night", A("S4.10", -4), A("S5.02"), -38.0, 4, 36, "the boardroom, Sunday night; it fades across the card",
    offset_s=11.0, replaces="TEMP-SYNTH boardroom")
bed("dark", A("S5.01", 12), A("S7.01", 6), -39.0, 30, 12, "the dark room, 2 AM (his monitor's world in S6 plays inside it)",
    layers=DARK, offset_s=6.0, source="script SOUND (sc 29)")
bed("bullpen_packing", A("S7.01", -6), A("S7.05", -4), -38.0, 12, 8, "the bullpen on Monday: murmur, packing rustle, tape, keyboards",
    source="script SOUND (sc 30)", replaces="TEMP-SYNTH bullpen")
bed("fires", A("S7.05", -12), A("S8.01"), -36.5, 12, 18, "the boardroom on Tuesday night with its small fires: the crackle pre-laps under the rail",
    source="script SOUND", replaces="TEMP-SYNTH fires")
bed("lobby_night", Mk("S7.13", "shatter", 6), A("S8.06", 6), -39.0, 12, 12, "the lobby at night: the sign's neon on F, big dark air (pre-lapped under the shatter's tail)",
    source="script (the lobby's neon buzz pre-laps under the shatter's tail)", replaces="v4 lobby composite")
bed("bullpen_unpack", A("S8.06", -6), TOTAL, -38.5, 12, 0, "the bullpen by day, Nov 22 -> 29, under the whole coda (the vault included); the memo reads over it",
    source="script SOUND (sc 31)", replaces="TEMP-SYNTH bullpen")

# ------------------------------------------------------------------------------------------------ resolve: placement, words, D6
SR = 48000


def resolve():
    out = []
    groups = {}
    for i, c in enumerate(CUES):
        m = MAN[c["sound"]]
        dur = m["duration"] - (c["start_s"] or 0)
        if c["trim_s"]:
            dur = min(dur, c["trim_s"])
        if c["loop_until"] is not None:
            dur = (c["loop_until"] - c["frame"]) / FPS
        sync = c["sync_s"]
        if sync is None and m.get("anchor") == "hit":
            sync = m.get("syncOffset") or 0.0
        if c["end_anchor"]:
            place = c["frame"] - dur * FPS
        else:                                       # sync is a time in the FILE; start_s skips into it
            place = c["frame"] - max(0.0, (sync or 0.0) - (c["start_s"] or 0.0)) * FPS
        c.update(place_frame=round(place, 2), dur_s=round(dur, 3), hit_s=round(max(0.0, (sync or 0.0) - (c["start_s"] or 0.0)), 3))
        if c["group"]:
            groups.setdefault(c["group"], []).append(c)
        out.append(c)
    # between-the-lines cues: shift (as a group) to the nearest clear window, within max_shift_f
    done = set()
    for c in out:
        if not c["clear_of_words"]:
            continue
        key = c["group"] or id(c)
        if key in done:
            continue
        done.add(key)
        members = groups.get(c["group"], [c])
        a = min(x["place_frame"] for x in members)
        b = max(x["place_frame"] + (min(x["dur_s"], 0.55) if x["sound"].startswith("phone_buzz") else min(x["dur_s"], 0.35)) * FPS
                for x in members)
        best = None
        for s in sorted(range(-c["max_shift_f"], c["max_shift_f"] + 1), key=abs):
            if not words_in(a + s, b + s, margin=1) and not (D6_S <= a + s < D6_E):
                best = s
                break
        for x in members:
            x["shift_f"] = best if best is not None else 0
            x["clear_of_words_ok"] = best is not None
            if best:
                x["frame"] += best
                x["place_frame"] = round(x["place_frame"] + best, 2)
    rows = []
    for i, c in enumerate(sorted(out, key=lambda c: (c["place_frame"], c["frame"]))):
        hit_a = c["frame"] if not c["end_anchor"] else c["place_frame"]
        span_b = c["place_frame"] + c["dur_s"] * FPS
        hw = words_in(hit_a, hit_a + 8)
        rows.append(OrderedDict(
            id=f"FX{i + 1:03d}", frame=c["frame"], tc=tc(c["frame"]), place_frame=c["place_frame"], shot=shot_at(c["frame"]),
            seq=seq_at(c["frame"]), sound=c["sound"], file="audio/sfx/" + MAN[c["sound"]]["file"], gain_db=c["gain_db"],
            pan=c["pan"], start_s=c["start_s"] or 0.0, dur_s=c["dur_s"], trim_s=c["trim_s"], fade_in_s=c["fade_in_s"] or 0.0,
            fade_out_s=c["fade_out_s"] if c["fade_out_s"] is not None else (0.03 if c["trim_s"] or c["loop_until"] else 0.0),
            reverse=c["rev"], loop=bool(c["loop_until"] is not None), loop_until_frame=c["loop_until"],
            loop_offset_s=c["loop_offset_s"], hit_s=c["hit_s"], end_anchor=c["end_anchor"], device=c["device"],
            ride=c["ride"], label=c["label"], source=c["source"], replaces=c["replaces"],
            board_new=c["sound"] in NEW_BOARD, optional=c["optional"],
            on_words=[f"{lid}:{w}" for lid, w in hw], in_d6=bool(D6_S <= hit_a < D6_E and not (c["sound"] == "dialog_ok_click" and c["frame"] == D6_S)),
            shift_f=c.get("shift_f"), clear_of_words_ok=c.get("clear_of_words_ok"), note=c["note"], span_end_frame=round(span_b, 1)))
    return rows


ROWS = resolve()
bad_d6 = [r["id"] for r in ROWS if r["in_d6"]]
assert not bad_d6, f"cues inside D6: {bad_d6}"
BED_ROWS = []
for i, b in enumerate(sorted(BEDS, key=lambda b: b["in_frame"])):
    BED_ROWS.append(OrderedDict(id=f"BED{i + 1:02d}", kind=b["kind"], in_frame=b["in_frame"], out_frame=b["out_frame"],
                                tc_in=tc(b["in_frame"]), tc_out=tc(b["out_frame"]), fade_in_f=b["fade_in_f"], fade_out_f=b["fade_out_f"],
                                target_dbfs_rms=b["target_dbfs_rms"], pan=b["pan"], offset_s=b["offset_s"], ride=b["ride"],
                                layers=[dict(L, file="audio/sfx/" + MAN[L["sound"]]["file"], board_new=L["sound"] in NEW_BOARD) for L in b["layers"]],
                                label=b["label"], source=b["source"], replaces=b["replaces"]))
    if b["in_frame"] < D6_E and b["out_frame"] > D6_S:
        raise AssertionError(f"bed {b['kind']} crosses D6")

# ------------------------------------------------------------------------------------------------ write
h = hashlib.sha1(open(LOCK_PATH, "rb").read()).hexdigest()[:12]
sheet = OrderedDict(
    meta=OrderedDict(
        show="MR. MAS", episode="ep01", act="ACT FOUR · THE BLIP, TOLD TWICE", version="sfx v5.0 (the v5 spotting)",
        made=datetime.date.today().isoformat(), by="the SFX editor pass (a4fin-sfx), 2026-09-27",
        lock=os.path.relpath(LOCK_PATH, REPO), lock_sha1=h, lock_mtime=datetime.datetime.fromtimestamp(os.path.getmtime(LOCK_PATH)).isoformat(timespec="seconds"),
        timeline=LOCK["meta"]["timeline"], script=LOCK["meta"]["script"], generator="audio/ep01/act4/sfx-v5/spot_v5.py",
        renderer="audio/ep01/act4/sfx-v5/render_v5.py", library="audio/sfx/manifest.json (+ audio/sfx/scripts/sounds_4.py for the v5 additions)",
        fps=FPS, sample_rate=SR, act_frames=TOTAL, episode_in="12:31:00:00",
        honesty="Nothing here was heard. Levels and placements are measured and reasoned, not auditioned; the mixer's ear decides."),
    conventions=OrderedDict(
        frame="act frame at 24 fps; 0 = the act's first frame (episode 12:31:00:00). 'frame' is the story frame the sound belongs to "
              "(its transient for a hit); 'place_frame' is where the file's first sample (after start_s) goes: frame - hit_s*24, or frame - dur for end_anchor.",
        gain_db="applied to the board's master (each master is normalised to -14 LUFS, short ones by momentary max, TP <= -1 dBTP). "
                "Reference level: the v5 takes measure -16 LUFS (mono), laid at unity on both channels as mix_v4.py does; the mix is loudness-normalised after the sum.",
        beds="each bed is levelled so the bed alone reads target_dbfs_rms (RMS per channel over the loop) before its ride and fades; equal-power fades in frames; "
             "layers are summed first (gain_db, optional low/high-pass) and the sum is levelled. Bursty synthetic beds read 1-2 dB under RMS in 50 ms windows (flow bible v4 note).",
        pan="-1 left .. +1 right, a balance as in mix_v4.py: the near channel stays at unity, the far one is scaled by 1 - |pan|",
        trim_s="play only this many seconds of the file (after start_s), with fade_out_s",
        reverse="the (trimmed) segment is reversed before placing",
        loop="loop the file (sample-seamless masters) from loop_offset_s until loop_until_frame, then fade_out_s",
        device=DEVICE,
        on_words="words of a take within the cue's first 8 frames (the hit), for the mixer's attention; clear_of_words cues were shifted to a gap (shift_f)",
        d6=f"act f {D6_S}-{D6_E} (the Cancel click to the phone's buzz): every bus muted; only the click's own first 0.25 s survives. No bed crosses it.",
        optional="spotted but off by default: the mixer decides by ear"),
    stops=LOCK["sound_marks"],
    cues=ROWS,
    beds=BED_ROWS,
)
sheet["summary"] = OrderedDict(
    cues=len(ROWS), optional=sum(r["optional"] for r in ROWS), beds=len(BED_ROWS),
    board_new_sounds_used=sorted({r["sound"] for r in ROWS if r["board_new"]} | {L["sound"] for b in BED_ROWS for L in b["layers"] if L["board_new"]}),
    existing_sounds_used=sorted({r["sound"] for r in ROWS if not r["board_new"]} | {L["sound"] for b in BED_ROWS for L in b["layers"] if not L["board_new"]}),
    temp_synth_remaining=0,
    cues_on_words=[r["id"] for r in ROWS if r["on_words"]],
    cues_shifted_off_words=[(r["id"], r["shift_f"]) for r in ROWS if r["shift_f"]],
    clear_of_words_failed=[r["id"] for r in ROWS if r["clear_of_words_ok"] is False],
    per_sequence={q["id"]: sum(1 for r in ROWS if r["seq"] == q["id"]) for q in LOCK["sequences"]},
)
json.dump(sheet, open(OUT, "w"), indent=1, ensure_ascii=False)
print(f"{len(ROWS)} cues ({sheet['summary']['optional']} optional), {len(BED_ROWS)} beds -> {os.path.relpath(OUT, REPO)}")
print("per sequence:", sheet["summary"]["per_sequence"])
print("on words:", len(sheet["summary"]["cues_on_words"]), "· shifted:", sheet["summary"]["cues_shifted_off_words"],
      "· clear-of-words failed:", sheet["summary"]["clear_of_words_failed"])
