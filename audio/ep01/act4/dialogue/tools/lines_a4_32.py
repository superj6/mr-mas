"""lines_a4_32.py - Ep1 Act Four dialogue at DRAFT 3.2 (the tightening pass), 2026-09-25.

Source: script.md Act Four draft 3.2 and production/act4/tighten-changes.md (§1 the line changes, §2 every voiced line with
its target span and cue, §3 pace, trims and gaps, §4 overlaps and cut-offs, §5 shots). It is built on the draft 3.1 list
(lines_a4.LINES), whose words, tags and 3.1 delivery notes carry over. record_32.py reads LINES_32.

Every voiced line is re-taken for pace (tighten-changes §1.4): same words, same tag. New fields for 3.2:
  target    the §2 target: the audible span (trimmed) the picture was timed to; a take lands within +-10%
  aim       what the speed solver aims at (target, except MAS on camera and the V.O.; see PACE_AIM)
  cue       the 3.2 shot and the beat inside it where the line starts (§2 / §5)
  cutoff    the line is cut off: ('tail', continuation) = read on into a continuation and cut hard before it;
            ('inside', word, n_phonemes) = cut inside the word after n phonemes. Either way: no tail, no fade
  overlap   ('prev_end', s) = starts s seconds before the previous line's audible end;
            ('in_word', word, s) = starts s seconds into that word of the previous line;
            ('at_phoneme', word, i) = starts at phoneme i of that word of the previous line
  gap       a placement the script or §3/§4 fixes (seconds from the previous line's audible end), else the lock's
            default (<= 0.3 s inside an exchange)
  sync      word frames the picture needs logged (e.g. the stamp on 'gets', the door on 'asked')
"""
from lines_a4 import LINES as LINES_31, NEUTRAL, SILENT as SILENT_31

MASTER_MADA_32 = "mada-good-question"   # one master read for both of MADA's lines (a canned answer)
LAPTOP_FROM = "a4-26-01"

_B31 = {l["id"]: l for l in LINES_31}

# ------------------------------------------------------------------------------------------------ pace plan
# tighten-changes §3 (the 3.2 starting speed per pack) and the dialogue director's pace targets. `aim` is the audible span
# the speed solver aims at, as a multiple of the §2 target. MAS on camera sits on the slow side of the tolerance
# (measured, never sluggish; one-word lines stay at their target, <= 0.65 s); everyone else aims at the target.
SPEED_32 = {"mas-manalt": 0.97, "mas-manalt-vo": 0.87, "alyi": 0.92, "neleh": 1.05, "mada": 1.0, "rima-tamuri": 1.0,
            "tasya": 0.98, "mario": 1.05, "adelina": 1.05, "ttemme": 1.08, "gerg-mockbran": 1.2, "terb": 1.1,
            "tiled-employee": 1.05}
PACE_AIM = {"mas-manalt": 1.08}          # multiword MAS lines: +8% of the target (cap +10%)
# V.O. span / his on-camera read of the same words. Ruling 7 states two numbers: x1.05-1.10 of his new on-camera read AND
# 130-140 wpm (the director's brief: ~135-145). At the new on-camera pace (his 3+ word lines run ~155-180 wpm), x1.05-1.10
# lands the V.O. at 155-170 wpm, above both bands; so the V.O. is paced to the band (x1.15-1.32, aim x1.28) inside the slots
# its clearances leave. The x1.08 reads are kept as alternates (takes/<id>-x108/) for the POV owner's sign-off.
VO_RATIO = (1.15, 1.32)
VO_RATIO_AIM = 1.28
VO_RATIO_RULING7 = (1.05, 1.10)
VO_SPEED_FLOOR = 0.66
TOL = 0.10                               # a re-take lands within +-10% of its §2 target

# V.O. slots (tighten-changes §4 clearances on the §5 board): the longest audible span that keeps them without moving a cut
VO_SLOT = {
    "a4-26a-vo1": (2.50, "26A.01 is 6 beats; the line starts on beat 2 and must end >= 1 beat before the cut: 6 - 1 - 1 = 4 beats"),
    "a4-29-vo2": (1.875, "29.04 is 1 bar from its beat 1; it must end >= 1 beat before 'mostly.' on 29.05's beat 1: 3 beats"),
    "a4-29-vo3": (2.50, "from 29.16's beat 1; TASYA starts on beat 6 and must come >= 1 beat after it: 4 beats"),
}

# ------------------------------------------------------------------------------------------------ take recipes
# Kokoro-82M's timing and melody are deterministic for a given text, pack and speed (the seed only moves vocoder noise:
# the test takes of one line came back with identical spans and median F0), so a take varies what a director would vary:
# the context before the line (a carrier, cut away), a tail that keeps the final open, a pace variant (speed: the take is
# aimed at aim / factor) and the internal stops (say). Seeds still differ, for the record.
N = NEUTRAL
_T3 = [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "carrier": "Okay."}]
_T4 = _T3 + [{"seed": 4, "speed": 0.95}]
_VO_TAKES_32 = [{"seed": 1}, {"seed": 2, "carrier": "So."}, {"seed": 3, "carrier": "Mm."}, {"seed": 4, "carrier": "Anyway."},
                {"seed": 6, "tail": ", really."}, {"seed": 5, "speed": 0.96}]
TAKES_32 = {
    "a4-25-10": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "say": "Nine seats.{0.25} Three left this year.{0.30} Four of us vote."},
                 {"seed": 4, "carrier": "Okay."}],
    "a4-25-12": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "tail_override": "precisely nothing."}, {"seed": 4, "carrier": "Okay."}],
    "a4-25-13": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "tail_override": "part of it."}, {"seed": 4, "carrier": "Okay."}],
    "a4-26-01": [{"seed": 5, "carrier": "Well."}, {"seed": 1}, {"seed": 6, "carrier": "Okay."}, {"seed": 7, "carrier": "Okay.", "speed": 0.95},
                 {"seed": 9, "carrier": "Sure."}, {"seed": 10, "carrier": "Mm. Okay."}, {"seed": 3, "carrier": "That's fine."}],
    "a4-26a-vo1": _VO_TAKES_32, "a4-29-vo2": _VO_TAKES_32, "a4-29-vo3": _VO_TAKES_32,
    "a4-27-04": [{"seed": 1, "carrier": N}, {"seed": 2}, {"seed": 3, "carrier": "Okay."}, {"seed": 4, "carrier": "So."}, {"seed": 5, "speed": 0.95}],
    "a4-27-23": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "carrier": "We'll share more soon."}, {"seed": 4, "carrier": "Okay."}],
    "a4-27-24": [{"seed": 1}, {"seed": 2, "carrier": "We'll share more soon."}, {"seed": 3, "carrier": N}, {"seed": 4, "say": "More.{0.10} Soon."}],
    "a4-27-05": [{"seed": 4, "carrier": "Okay."}, {"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "speed": 0.95},
                 {"seed": 5, "carrier": "Sorry."}, {"seed": 6, "carrier": "Wait."}, {"seed": 7, "say": "Is this a coup??"},
                 {"seed": 8, "carrier": "Um.", "speed": 0.95}, {"seed": 9, "tsm": 1.10}, {"seed": 10, "tsm": 1.10, "carrier": "Sorry."},
                 {"seed": 11, "tsm": 1.10, "say": "Is this a coup??"}],
    "a4-27-06": _T4, "a4-27-08": _T4, "a4-27-09": _T4, "a4-27-12": _T4, "a4-27-13": _T4, "a4-30-01": _T4,
    "a4-27-10": [{"seed": 3}, {"seed": 2, "carrier": "Step four will reveal itself."}, {"seed": 4, "carrier": N}, {"seed": 1, "carrier": "Okay."}],
    "a4-27-14": [{"seed": 3}, {"seed": 1, "carrier": N}, {"seed": 4, "tail_override": "but first, the charter."}, {"seed": 2, "speed": 0.95}],
    "a4-27-15": [{"seed": 1}, {"seed": 2, "say": "In plain English:{0.20} no."}, {"seed": 3, "carrier": N}, {"seed": 4, "carrier": "Okay."}],
    "a4-27-16": [{"seed": 1}, {"seed": 3, "say": "Hi.{0.12} Yes.{0.12} We're very worried.{0.14} How much?"}, {"seed": 2, "carrier": N},
                 {"seed": 4, "speed": 0.95}],
    "a4-27-19": [{"seed": 2}, {"seed": 4, "carrier": "Chat. I'm the CEO now."}, {"seed": 3, "say": "Chat...{0.22} for how long?"},
                 {"seed": 1, "carrier": N}, {"seed": 5, "speed": 1.08}, {"seed": 6, "speed": 1.08, "carrier": "Chat. I'm the CEO now."},
                 {"seed": 7, "say": "Chat...{0.25} for how long??"}, {"seed": 8, "carrier": "Wait."}],
    "a4-27-20": [{"seed": 9, "tail": ", everyone."}, {"seed": 10, "tail": ", everyone.", "speed": 0.95}, {"seed": 1},
                 {"seed": 2, "carrier": N}, {"seed": 5, "tail": ", everyone.", "carrier": "Okay."}],
    "a4-27-21": [{"seed": 3}, {"seed": 4, "carrier": N}, {"seed": 1, "carrier": "Okay."}, {"seed": 2, "carrier": "The company is calling us."}],
    "a4-29-03": [{"seed": 4, "carrier": "It was a joke."}, {"seed": 1, "carrier": "the badge was a joke."},
                 {"seed": 2, "carrier": "the badge was a joke.", "speed": 0.95}, {"seed": 6}, {"seed": 8, "carrier": "Hm."},
                 {"seed": 10, "carrier": "Well."}, {"seed": 11, "tsm": 1.10, "carrier": "It was a joke."},
                 {"seed": 12, "tsm": 1.10, "carrier": "the badge was a joke."}, {"seed": 13, "tail": ". I guess."}],
    "a4-29-04": [{"seed": 2}, {"seed": 1, "carrier": N}, {"seed": 3, "say": "One sec.{0.10} Compiling"}, {"seed": 4, "carrier": "Okay."}],
    "a4-29-05": _T4, "a4-29-06": _T4,
    "a4-29-08": [{"seed": 3}, {"seed": 1, "carrier": N}, {"seed": 2, "speed": 0.95}, {"seed": 4, "carrier": "Okay."}],
    "a4-30-02": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 4, "tail": ", everyone."}, {"seed": 3, "speed": 0.95}],
    "a4-30-03": [{"seed": 1}, {"seed": 1, "carrier": N}, {"seed": 2, "carrier": "Oh."}, {"seed": 4, "carrier": "Oh. Okay."},
                 {"seed": 5, "carrier": "Well."}],
    "a4-30-04": [{"seed": 2}, {"seed": 1, "carrier": N}, {"seed": 3, "carrier": "Oh."}, {"seed": 4, "speed": 0.95}],
    "a4-30-06": [{"seed": 1, "carrier": "Which room is on fire?"}, {"seed": 2}, {"seed": 3, "carrier": N}],
    "a4-30-07": [{"seed": 5, "carrier": "Right."}, {"seed": 1}, {"seed": 3, "carrier": "Ah."}, {"seed": 4, "carrier": "Okay."}],
    "a4-30-09": [{"seed": 6, "carrier": "Mm."}, {"seed": 1}, {"seed": 2, "speed": 0.95}, {"seed": 3, "carrier": "Hm."},
                 {"seed": 7, "carrier": "Hm.", "speed": 0.95}, {"seed": 8, "carrier": "Okay."}],
    "a4-30-12": [{"seed": 3, "carrier": "I see."}, {"seed": 4, "carrier": "Mm."}, {"seed": 12, "carrier": "Okay."},
                 {"seed": 13, "carrier": "Fine."}, {"seed": 14, "tail": ". Fine."}, {"seed": 15, "tail": ". I see."},
                 {"seed": 16, "tsm": 1.10, "carrier": "I see."}, {"seed": 17, "tsm": 1.10, "carrier": "Okay."},
                 {"seed": 18, "tsm": 1.10, "tail": ". Fine."}, {"seed": 19, "tsm": 1.10}],
    "a4-31-01": [{"seed": 1}, {"seed": 2, "carrier": "Okay."}, {"seed": 3, "speed": 0.95}, {"seed": 4, "carrier": "Huh."}],
    "a4-31-02": [{"seed": 1}, {"seed": 2, "carrier": N}, {"seed": 3, "carrier": "Oh."}, {"seed": 4, "speed": 0.95}],
    "a4-31-03": [{"seed": 4}, {"seed": 1, "say": "i love and respect [Alyi](/ˈælji/)...{0.28} i harbor zero ill will towards him."},
                 {"seed": 2, "carrier": N}, {"seed": 3, "speed": 0.95}],
}
MASTER_TAKES_32 = [{"seed": 7, "carrier": "Hm."}, {"seed": 1}, {"seed": 6, "carrier": "Mm."}, {"seed": 5, "carrier": "Right."},
                   {"seed": 3, "carrier": "Hm.", "speed": 0.95}, {"seed": 2, "carrier": N}]
_VO_PICK_32 = {"range_max": 8.0, "final": "fall", "gentle": True, "fall_floor": -5.0, "lane": True, "understated": 0.12}
_MAS1 = {"range_max": 9.0, "final": "fall", "gentle": True, "lane": True}   # the one-word Mas lines

# ------------------------------------------------------------------------------------------------ 3.2 shots (§5)
SHOT = {
    "25.02": "25.02 [GFX·section/detail] THE DIAGRAM, voiced: the section, cutting in to detail on the key ring and the equity box",
    "26.09": "26.09 [OTS] over his silhouette onto the laptop: \"super.\"; the feed freezes",
    "26A.01": "26A.01 [ECU] the desk: mark 3 carved (his thumb comes to rest on the new mark)",
    "27.01": "27.01 [SCR] their call, bezel in frame; \"super.\" from the laptop speaker",
    "27.05": "27.05 [MCU] RIMA in her spotlight",
    "27.05b": "27.05b [SCR·2-up] the call's two-up: NELEH",
    "27.05c": "27.05c [MCU] RIMA; her plate",
    "27.07": "27.07 [W] the all-hands (one hand up in the crowd)",
    "27.08": "27.08 [MCU·door] ALYI, frameless in the doorway, the jamb cutting him in half",
    "27.13b": "27.13b [MCU] NELEH at the blueprint: bylaws",
    "27.14": "27.14 [OTS] over NELEH's silhouette onto the dark glass (ALYI a reflection): step four / When?",
    "27.16": "27.16 [MCU] NELEH, looking down at the fallen phone",
    "27.17": "27.17 [2S] NELEH and MADA, ALYI's reflection in the window between them",
    "27.22a": "27.22a [MCU] MARIO: thoughts—",
    "27.22b": "27.22b [W] the lighthouse's one wide: ADELINA takes the phone; no; the throne falls",
    "27.23": "27.23 [MCU] MARIO on the second phone",
    "27.27": "27.27 [LOW·desk] TTEMME behind the big hourglass",
    "27.29": "27.29 [MCU·door] TASYA in the new slate-blue door",
    "27.30": "27.30 [HIGH] the blueprint's ? on step 4 (NELEH O.S.)",
    "29.04": "29.04 [ECU·Orb] the iris on the GUEST lanyard",
    "29.05": "29.05 [MCU] MAS, frameless, to the Orb; rack to the Orb",
    "29.11a": "29.11a [POV·tile] Gerg's tile on his monitor: compiling—",
    "29.11b": "29.11b [MCU] MAS facing his monitor; the cut lands on his line",
    "29.12": "29.12 [POV·tile] Gerg's tile, half the frame",
    "29.16": "29.16 [2S] the back wall: the slate-blue door's first held step on 'asked'; TASYA O.S. behind it",
    "29.17": "29.17 [MCU] MAS, left, at once, not turning; rack to the door",
    "29.24": "29.24 [POV·half] the avalanche: NELEH's tile as it goes",
    "30.01": "30.01 [P2] BOX (the act's one deliberate box): MAS left at his end desk; ALYI right in the doorway",
    "30.03": "30.03 [W] the landlord: the bullpen remaps on the line",
    "30.06": "30.06 [MCU·PF] MAS looks down",
    "30.06b": "30.06b [HIGH] his eyeline: the slate floor from above (TASYA O.S.)",
    "30.11a": "30.11a [MCU] TERB, extinguisher like a briefcase",
    "30.11b": "30.11b [W] the room looks around at the fires",
    "30.12": "30.12 [2S] the calm-off: MAS and MADA across the table (TERB O.S.)",
    "30.13": "30.13 [OTS] over Mas's silhouette onto MADA",
    "30.14": "30.14 [MCU] MAS, near-front, eyes toward Mada (1 beat late)",
    "30.23": "30.23 [ECU] his hands and the glass (off his face)",
    "31.02": "31.02 [MCU-2] the 50/50: GERG and MAS; rack to the vault",
    "31.03": "31.03 [MCU] MAS at his desk: the memo",
}


def L32(id_, speaker, text, say, target, shot, beat, status, **kw):
    kw.pop("takes", None)
    b = _B31.get(id_, {})
    d = {"id": id_, "scene": kw.pop("scene", id_.split("-")[1].upper()), "speaker": speaker, "text": text, "say": say,
         "target": target, "shot_id": shot, "shot": SHOT[shot], "cue": f"{shot}, beat {beat}", "status": status,
         "tag": kw.pop("tag", b.get("tag")), "mode": kw.pop("mode", b.get("mode", "on-mic")),
         "delivery": kw.pop("delivery"), "takes": TAKES_32.get(id_, _T3), "pick": kw.pop("pick", {"lane": True})}
    if b.get("voice"):
        d["voice"] = b["voice"]
    d.update(kw)
    return d


LINES_32 = [
    # ============================================================ 25 THE PLAN (blueprint; NELEH voices the charter)
    L32("a4-25-10", "neleh", "Nine seats. Three left this year. Four of us vote.",
        "Nine seats.{0.28} Three left this year.{0.28} Four of us vote.", 3.30, "25.02", 2, "new",
        kind="dialogue", cam="blueprint", pov="his", tag="[INVENTED] (the board describing its own public structure; "
        "'Three left this year' leans on the [V/K] row of three 2023 departures)",
        delivery="(blueprint, precise) One read, a charter read, not a list. 'Three' lands on DIRE's first step, 'Four' on "
                 "the circle. Level statements that land on the last noun; each full stop 0.28 s (inside the 0.3 s rule), so the read spans the diagram.",
        pick={"final": "fall", "lane": True}, sync=["Three", "Four"]),
    L32("a4-25-11", "neleh", "This board controls the company.", "This board controls the company.", 1.70, "25.02", 8, "new",
        kind="dialogue", cam="blueprint", pov="his", tag="[INVENTED] (the board's public structure)",
        delivery="(blueprint) Precise and level; 'controls' on the arrow's draw.", pick={"final": "fall", "lane": True},
        sync=["controls"]),
    L32("a4-25-12", "neleh", "The investor gets—", "The investor gets", 0.80, "25.02", 11, "new",
        kind="dialogue", cam="blueprint", pov="his", tag="[INVENTED] (the investor's zero board votes, public structure)",
        delivery="(blueprint; cut off) A hard stop on 'gets', no tail: the VOTES: 0 stamp lands on the cut. Read on into a "
                 "continuation ('...gets paid') so 'gets' keeps a mid-sentence contour, and cut at the closure before it.",
        cutoff=("tail", "paid in full."), pick={"lane": True}, sync=["gets"]),
    L32("a4-25-13", "neleh", "And the CEO owns—", "And the CEO owns", 0.90, "25.02", 13.5, "new",
        kind="dialogue", cam="blueprint", pov="his", tag="[INVENTED] (his own public testimony of zero equity is the unsaid end)",
        delivery="(blueprint; cut off) A hard stop on 'owns'; MADA cuts in. Read on into a continuation and cut before it.",
        cutoff=("tail", "precisely nothing."), pick={"lane": True}),
    L32("a4-25-02", "mada", "Good question.", "Good question.", 0.85, "25.02", 14.6, "retake-pace",
        kind="dialogue", cam="blueprint", pov="his", master=MASTER_MADA_32,
        delivery="(blueprint; overlapping) Starts ~4 f before 'owns—' ends. The same flat, courteous non-answer: level "
                 "through 'Good', a small settle on 'question'. One master read for both of his lines.",
        overlap=("prev_end", 4 / 24)),

    # ============================================================ 26 THE FALLING TILE
    L32("a4-26-01", "mas-manalt", "super.", "super.", 0.60, "26.09", 1.2, "retake-pace",
        kind="dialogue", cam="offface", pov="his",
        delivery="(over his silhouette onto the freezing feed, on the [OTS]'s first beat) His tile is gone; his mic isn't. "
                 "Pleasant, lunch-order even, a complete sentence; level final, never lifts, no smile audible. No music under it.",
        pick=dict(_MAS1), key=True),

    # ============================================================ 26A THAT NIGHT
    L32("a4-26a-vo1", "mas-manalt", "i don't keep score.", "i don't keep score.", 1.50, "26A.01", 2, "retake-pace",
        scene="26A", kind="vo", cam="none", pov="his",
        delivery="(V.O., on the carve shot's beat 2, over the tally he has just carved) A plain self-description, told, not "
                 "performed: level, settling on 'score' without weight. Close and soft, a touch slower than his scenes "
                 "(x1.05-1.10 of his on-camera read of the same words). No irony, no defence.",
        pick=_VO_PICK_32, key=True,
        fallback={"text": "i don't keep things.", "say": "i don't keep things.", "takes": _VO_TAKES_32,
                  "why": "guardrails fallback (script ruling 3 / pov-changes §7 ruling 2), if 'score' reads as a grudge against "
                         "the board; re-taken at the same pace (tighten-changes §2 row 7). Default: score"}),

    # ============================================================ 27 PASS ONE: THE BOARD'S SIDE
    L32("a4-27-00", "mas-manalt", "super.", "super.", 0.60, "27.01", 1.1, "rederive",
        kind="dialogue", cam="speaker", pov="board", mode="speaker", derive={"from": LAPTOP_FROM, "chain": "laptop"},
        delivery="(through their laptop speaker; no portrait) No new read: the new a4-26-01 take, heard from the board's "
                 "side through the same laptop_speaker chain, -22 LUFS. Nobody looks up."),
    L32("a4-27-04", "rima-tamuri", "We'll share more soon.", "We'll share more soon.", 1.10, "27.05", 1.5, "retake-pace",
        kind="dialogue", cam="on", pov="board", end="smile",
        delivery="(pleasant) The non-answer, delivered as good news. Pleasant, unhurried in tone, not in length; soft final.",
        pick={"range_max": 10.0, "final": "fall", "lane": True}, key=True),
    L32("a4-27-23", "neleh", "Share what?", "Share what?", 0.55, "27.05b", 0.7, "new",
        kind="dialogue", cam="monitor", pov="board", tag="[INVENTED]", chain_extra="call",
        delivery="(on the call, in the two-up; overlapping) On 'soon', ~6 f before RIMA's line ends; the cut into the two-up "
                 "lands on it. Literal, polite; the question barely lifts. A light call filter (thinner than the laptop "
                 "chain), delivered 2 LU under RIMA (-18 LUFS); the dry read is in clean/.",
        pick={"lane": True}, overlap=("prev_end", 6 / 24)),
    L32("a4-27-24", "rima-tamuri", "More. Soon.", "More.{0.12} Soon.", 0.90, "27.05c", 1.3, "new",
        kind="dialogue", cam="on", pov="board", tag="[INVENTED] catchphrase (the non-answer, repeated)", end="smile",
        delivery="(pleasant, exactly the same) Exactly the read of a4-27-04's last two words; the stop between them <= 0.15 s. "
                 "Candidates: the two words lifted from the delivered a4-27-04 take with a 0.12 s stop between them "
                 "(literally the same read), and fresh reads scored on how closely their melody matches those two words.",
        pick={"final": "fall", "lane": True, "match": "a4-27-04:more,soon"}, splice_from="a4-27-04", key=True),
    L32("a4-27-05", "tiled-employee", "Is this a coup?", "Is this a coup?", 0.90, "27.07", 1.8, "retake-pace",
        kind="dialogue", cam="crowd", pov="board",
        delivery="(one hand up in the crowd; the all-hands [W]) Earnest, direct, a little unsure. Lifts on 'coup?'.",
        pick={"final": "rise", "lane": True}),
    L32("a4-27-06", "alyi", "\"You can call it this way\"", "You can call it this way.", 2.10, "27.08", 1.3, "retake-pace",
        kind="dialogue", cam="on", pov="board",
        delivery="(frameless in the doorway, the jamb cutting him in half) Grave, serene; the weight lives in pitch and "
                 "falling finals, not in length. Stress lands on 'way' and lets go. A real quote spoken in the scene.",
        pick={"final": "fall", "lane": True}),
    L32("a4-27-08", "neleh", "The bylaws allow it. Footnote three.", "The bylaws allow it.{0.22} Footnote three.", 2.00,
        "27.13b", 1.3, "retake-pace", kind="dialogue", cam="on", pov="board",
        delivery="(at the blueprint, marker in hand; on the first buzz) Precise; a clean full stop (0.22 s), then the "
                 "citation, landing on 'three'.", pick={"final": "fall", "lane": True}),
    L32("a4-27-09", "alyi", "Step four will reveal itself.", "Step four will reveal itself.", 2.10, "27.14", 1.6, "changed",
        kind="dialogue", cam="reflection", pov="board",
        delivery="(reflection in the dark glass; on the second buzz) CHANGED from 'Step four… will reveal itself.': no pause "
                 "after 'four'. Serene certainty; the line lets go on 'itself'.",
        pick={"final": "fall", "lane": True}),
    L32("a4-27-10", "neleh", "When?", "When?", 0.45, "27.14", 4.7, "retake-pace",
        kind="dialogue", cam="offface", pov="board",
        delivery="(overlapping; over her silhouette, the cut to the table lands on it) On 'itself', ~4 f before ALYI's line "
                 "ends. One word, exact; a small, reasonable lift.",
        pick={"lane": True}, overlap=("prev_end", 4 / 24)),
    L32("a4-27-12", "neleh", "The company is calling us.", "The company is calling us.", 1.30, "27.16", 1.3, "retake-pace",
        kind="dialogue", cam="on", pov="board",
        delivery="(looking down at the fallen phone) Dry, level and factual: a correction, not alarm.",
        pick={"final": "fall", "lane": True}),
    L32("a4-27-13", "alyi", "That is the company telling us.", "That is the company telling us.", 2.20, "27.17", 1.2,
        "retake-pace", kind="dialogue", cam="reflection", pov="board",
        delivery="(reflection, between them in the window) Unbothered; the koan closes the loop, stress on 'telling'. Tight "
                 "on NELEH's 'us' (<= 3 f).", pick={"final": "fall", "lane": True}, gap=0.10),
    L32("a4-27-14", "mario", "I've written up some thoughts—", "I've written up some thoughts", 1.60, "27.22a", 1.4, "changed",
        kind="dialogue", cam="on", pov="board",
        delivery="(looking at the throne, finger rising) CHANGED: now cut off by ADELINA. Earnest, a little proud of the "
                 "document; cut on 'thoughts', no tail (read on into '...because' and cut at its closure).",
        cutoff=("tail", "because the charter says so."),
        pick={"lane": True}),
    L32("a4-27-15", "adelina", "In plain English: no.", "In plain English:{0.25} no.", 1.30, "27.22b", 0.9, "retake-pace",
        kind="dialogue", cam="on", pov="board",
        delivery="(overlapping; into the phone, taking it out of his hand) Starts ~3 f into MARIO's 'thoughts'; the cut "
                 "into the wide lands on it. Brisk, warm, final: a beat at the colon (0.25 s), 'no.' short, kind and final.",
        pick={"final": "fall", "last_word_dur": (0.16, 0.40), "lane": True}, overlap=("in_word", "thoughts", 3 / 24), key=True),
    L32("a4-27-16", "mario", "Hi. Yes. We're very worried. How much?",
        "Hi.{0.14} Yes.{0.14} We're very worried.{0.16} How much?", 2.20, "27.23", 1.2, "retake-pace",
        kind="dialogue", cam="on", pov="board",
        delivery="(on the second phone's first ring, <= 4 f after the click) Eager and fast: the four stops are the joke, "
                 "each short (<= 0.2 s); the worry is a formality on the way to the number.",
        pick={"lane": True}, key=True),
    L32("a4-27-19", "ttemme", "Chat… for how long?", "Chat...{0.28} for how long?", 1.30, "27.27", 1.5, "retake-pace",
        kind="dialogue", cam="on", pov="board",
        delivery="(watching the sand) The thought dawns mid-line; the '…' <= 0.3 s. An honest small lift on 'long?'.",
        pick={"final": "rise", "lane": True}, key=True),
    L32("a4-27-20", "tasya", "\"a new advanced AI research team\"", "A new advanced AI research team.", 2.10, "27.29", 1.3,
        "retake-pace", kind="dialogue", cam="on", pov="board", end="smile",
        delivery="(post, read aloud with pleasure; in the new slate-blue door, key ring jangling) Warm, delighted; a smile after. "
                 "Tail-carrier takes keep 'team' free of creak.",
        pick={"lane": True}),
    L32("a4-27-21", "neleh", "Step four?", "Step four?", 0.65, "27.30", 1.4, "restaged",
        kind="dialogue", cam="os", pov="board",
        delivery="(O.S., over the blueprint insert; restaged and re-taken) The callback: a small, patient lift. Nobody answers.",
        pick={"final": "rise", "lane": True}),

    # ============================================================ 29 PASS TWO: HIS SIDE
    L32("a4-29-vo2", "mas-manalt", "the badge was a joke.", "the badge was a joke.", 1.60, "29.04", 1, "retake-pace",
        kind="vo", cam="none", pov="his",
        delivery="(V.O.; the Orb is already on the lanyard and never hears it) Understated, told: 'a joke' said like 'a "
                 "detail'. Level final; no smile in the voice, no wink.",
        pick=_VO_PICK_32, key=True),
    L32("a4-29-03", "mas-manalt", "mostly.", "mostly.", 0.65, "29.05", 1, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(aloud, to the Orb, on the [MCU]'s downbeat) The one true word; it answers the Orb's look, not the V.O. "
                 "A shade under the V.O. before it; level or gently falling. No wink.",
        pick=dict(_MAS1, below="a4-29-vo2"), key=True),
    L32("a4-29-04", "gerg-mockbran", "One sec. Compiling—", "One sec.{0.14} Compiling", 0.90, "29.11a", 1.3, "changed",
        kind="dialogue", cam="monitor", pov="his",
        delivery="(on the monitor, typing) CHANGED: now cut off by MAS on 'Compil-'. Cheerful, mid-thought; the stop after "
                 "'sec' is short. Cut inside 'Compiling' after 'Compil', no tail; his keys continue under MAS.",
        cutoff=("inside", "Compiling", 6), pick={"lane": True}),
    L32("a4-29-05", "mas-manalt", "what are you building?", "what are you building?", 1.40, "29.11b", 0.8, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(overlapping, on 'Compil-'; the cut to him lands on it) Mild curiosity at the lunch-order pace. No alarm.",
        pick={"range_max": 10.0, "lane": True}, overlap=("prev_end", 4 / 24)),
    L32("a4-29-06", "gerg-mockbran", "The company. Again. Just in case.", "The company.{0.10} Again.{0.10} Just in case.",
        1.70, "29.12", 1.1, "retake-pace", kind="dialogue", cam="monitor", pov="his",
        delivery="(on the cut to his tile) Sunny, literal: a commit-log cheer, three fragments with quick stops.",
        pick={"lane": True}),
    L32("a4-29-vo3", "mas-manalt", "gerg never waits to be asked.", "[gerg](/ɡˈɜɹɡ/) never waits to be asked.", 2.00,
        "29.16", 1, "retake-pace", kind="vo", cam="none", pov="his",
        delivery="(V.O., out of the quiet beat; D8, a straight line) Warm and plain, generous about Gerg; even to the end, "
                 "'asked' soft and complete (it carries the door's first held step: its frame is logged). Hard G in 'gerg'.",
        pick=_VO_PICK_32, key=True, sync=["asked"]),
    L32("a4-29-07", "tasya", "Everyone is welcome.", "Everyone is welcome.", 1.20, "29.16", 6, "retake-pace",
        kind="dialogue", cam="os", pov="his", end="smile",
        delivery="(O.S., from behind the slate-blue door; >= 1 beat after the V.O., no music under either) Warm, gentle, "
                 "smiling. Its tail runs over the cut. Recorded dry: the mix puts it behind the door.",
        pick={"final": "fall", "lane": True}, gap=0.625),
    L32("a4-29-08", "mas-manalt", "leave it open.", "leave it open.", 1.00, "29.17", 1, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(overlapping, at once on 'welcome', not turning) A quiet decision, even and falling. No weight on it.",
        pick={"range_max": 10.0, "final": "fall", "gentle": True, "lane": True}, overlap=("prev_end", 4 / 24), key=True),
    L32("a4-29-09", "neleh", "Has anyone read the char—", "Has anyone read the charter?", 1.20, "29.24", 1.5, "retake-pace",
        kind="dialogue", cam="monitor", pov="his",
        delivery="(as her tile goes) Mid-question, polite to the end; cut off hard inside 'char-' (the tile's exit cuts it).",
        cutoff=("inside", "charter", 3), pick={"lane": True}),

    # ============================================================ 30 THE RETURN
    L32("a4-30-01", "alyi", "\"I deeply regret my participation in the board's actions.\"",
        "I deeply regret{0.12} my participation in the board's actions.", 3.80, "30.01", 1.4, "retake-pace",
        kind="dialogue", cam="on", pov="his", side="right",
        delivery="(post, read from the doorway, in the act's one deliberate box) Sincere, played straight; the weight in pitch, "
                 "not length. The violin stops on the first heart, after the line.",
        pick={"final": "fall", "lane": True}),
    L32("a4-30-02", "tasya", "\"We are below them, above them, around them.\"",
        "We are below them,{0.16} above them,{0.16} around them.", 2.90, "30.03", 2, "retake-pace",
        kind="dialogue", cam="on", pov="his", end="smile",
        delivery="(hands clasped, delighted, in the middle of the floor) Three even parallel phrases; 'below', 'above' and "
                 "'around' each start a palette remap step (their frames are logged).",
        pick={"lane": True},
        sync=["below", "above", "around"]),
    L32("a4-30-03", "mas-manalt", "hi.", "hi.", 0.45, "30.06", 1.4, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(looking down at the floor, which is Tasya) Mild and friendly.",
        pick=dict(_MAS1), key=True),
    L32("a4-30-04", "tasya", "Hello.", "Hello.", 0.60, "30.06b", 0.9, "retake-pace",
        kind="dialogue", cam="os", pov="his", end="smile",
        delivery="(O.S., from the floor, warmly; overlapping) On the tail of 'hi.' (<= 2 f); the cut to the floor lands on it. "
                 "Warm and pleased; a smile after.",
        pick={"lane": True}, overlap=("prev_end", 1 / 24), key=True),
    L32("a4-30-05", "terb", "Which room is on fire?", "Which room is on fire?", 1.20, "30.11a", 1.2, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(extinguisher like a briefcase) Brisk and procedural, as if asking which room the meeting's in.",
        pick={"lane": True}),
    L32("a4-30-06", "terb", "…Ah.", "Ah.", 0.40, "30.11b", 2, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(the room looks around at the fires) The realisation: short, flat, a little falling. The '…' is picture "
                 "time (~1 beat), not the read.",
        pick={"final": "fall"}, key=True),
    L32("a4-30-07", "terb", "Terms?", "Terms?", 0.50, "30.12", 1.8, "retake-pace",
        kind="dialogue", cam="os", pov="his",
        delivery="(O.S., over the calm-off) Brisk, procedural; a quick lift.",
        pick={"final": "rise"}, key=True),
    L32("a4-30-08", "mada", "Good question.", "Good question.", 0.85, "30.13", 1.2, "retake-pace",
        kind="dialogue", cam="on", pov="his", master=MASTER_MADA_32, key=True,
        delivery="(over Mas's silhouette onto MADA) On the tail of 'Terms?' (<= 3 f), tight, not overlapped. The same "
                 "canned answer, perfectly level (the master read).", gap=0.10),
    L32("a4-30-09", "mas-manalt", "good question.", "good question.", 0.90, "30.14", 2, "retake-pace",
        kind="dialogue", cam="on", pov="his", key=True,
        delivery="(one beat late) The echo: Mada's melody, in Mas's lane, just as level. Exactly 1 beat after MADA's line "
                 "ends: the late beat is the joke, so don't close it. Then the long hold (2 beats).",
        pick={"range_max": 10.0, "final": "fall", "gentle": True, "lane": True, "match": MASTER_MADA_32}, gap=0.625),
    L32("a4-30-12", "mas-manalt", "okay.", "okay.", 0.60, "30.23", 1.8, "retake-pace",
        kind="dialogue", cam="offface", pov="his",
        delivery="(off his face, over his hands and the glass; no lip-sync) Settled, level-to-falling; the act resolves.",
        pick=dict(_MAS1), key=True),

    # ============================================================ 31 BACK WALL
    L32("a4-31-01", "gerg-mockbran", "What's in there?", "What's in there?", 0.70, "31.02", 1.8, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(stops mid-typing at the vault) Cheerful, literal curiosity.",
        pick={"lane": True}),
    L32("a4-31-02", "mas-manalt", "it's a preview.", "it's a preview.", 1.00, "31.02", 3, "retake-pace",
        kind="dialogue", cam="on", pov="his",
        delivery="(not looking, already past) Tight on Gerg (<= 4 f). Pleasant and flat; the vault hums under it.",
        pick={"range_max": 10.0, "final": "fall", "gentle": True, "lane": True}, gap=0.15, key=True),
    L32("a4-31-03", "mas-manalt", "\"i love and respect alyi… i harbor zero ill will towards him.\"",
        "i love and respect [Alyi](/ˈælji/)...{0.33} i harbor zero ill will towards him.", 4.30, "31.03", 1.8, "retake-pace",
        kind="dialogue", cam="on", pov="his", mode="memo-read",
        delivery="(reads his memo aloud) Sincere, even; unhurried but not slow. The '…' is 0.4 s (the one exception to the "
                 "0.3 s rule). 'Alyi' = AL-yee.",
        pick={"final": "fall", "gentle": True, "lane": True}),
]

# ------------------------------------------------------------------------------------------------ order, posts, removals
# 3.2 script order (voiced lines and the unvoiced post pop-ups between them).
ORDER_32 = [
    "a4-25-10", "a4-25-11", "a4-25-12", "a4-25-13", "a4-25-02",
    "a4-26-01",
    "a4-26a-vo1",
    "a4-27-00", "a4-27-04", "a4-27-23", "a4-27-24", "a4-27-01", "a4-27-05", "a4-27-06", "a4-26a-01", "a4-27-07",
    "a4-27-08", "a4-27-09", "a4-27-10", "a4-27-12", "a4-27-13", "a4-27-14", "a4-27-15", "a4-27-16", "a4-27-17",
    "a4-27-19", "a4-27-20", "a4-27-21",
    "a4-29-01", "a4-29-vo2", "a4-29-03", "a4-29-04", "a4-29-05", "a4-29-06", "a4-29-vo3", "a4-29-07", "a4-29-08", "a4-29-09",
    "a4-30-01", "a4-30-02", "a4-30-03", "a4-30-04", "a4-30-05", "a4-30-06", "a4-30-07", "a4-30-08", "a4-30-09",
    "a4-30-10", "a4-30-11", "a4-30-12",
    "a4-31-01", "a4-31-02", "a4-31-03",
]

# The seven unvoiced post pop-ups: not re-recorded (their scratch reads stay in optional/); restaged on the 3.2 board with
# the hold = the shot they ride (§5). a4-26a-01 moves from 26A to sc 27 (shot 27.10, on NELEH's phone).
POSTS_32 = {
    "a4-27-01": ("27", "27.06 [SCR] the board's call: 'Gerg has left'; keycaps", 4, "unchanged",
                 "rides 27.06 (1 bar): the 'has left' toast, then the post; keycaps pop"),
    "a4-26a-01": ("27", "27.10 [SCR] the 9:32 post on NELEH's phone", 8, "moved",
                  "MOVED from 26A to sc 27 (tighten-changes §1.3): on NELEH's phone, 2 bars"),
    "a4-27-07": ("27", "27.12 [SCR] Nov 18: the hearts; the eulogy post", 8, "unchanged",
                 "rides 27.12 (2 bars) with the hearts"),
    "a4-27-17": ("27", "27.24 [SCR] Nov 19: the security tile; the badge post", 6, "unchanged",
                 "rides 27.24 (1 bar + 2 beats), upside-down in the security tile's corner"),
    "a4-29-01": ("29", "29.02 [ECU] the hearts, eight on the beat", 8, "unchanged",
                 "the same words the whole time, eight copies, one per beat: 2 bars"),
    "a4-30-10": ("30", "30.16 [POV] Gerg's return post", 5, "unchanged", "rides 30.16 (1 bar + 1 beat), then MAS reads it (30.17)"),
    "a4-30-11": ("30", "30.18 [HIGH] the hourglass; TTEMME's post; the shatter", 8, "unchanged",
                 "rides 30.18 (2 bars); the hourglass shatters on the post's last beat"),
}

REMOVED_32 = [
    ("a4-25-01", "NELEH (blueprint)", "Step four.", "THE PLAN no longer shows step 4 (the no-spoiler fold); MADA's 'Good question.' now cuts off 'And the CEO owns—'"),
    ("a4-26a-vo2", "MAS (V.O.)", "the meeting ended early.", "D4 cut: with THE PLAN shorter it would share D2's 4-bar phrase"),
    ("a4-29-vo1", "MAS (V.O.)", "i put the phone down.", "D5 and MAS'S VERSION cut; the hearts play straight (D5 debuts in Ep2 or Ep3)"),
    ("a4-27-02", "RIMA", "I'll hold it together.", "R6: a stated trope"),
    ("a4-27-03", "NELEH", "For how long?", "replaced by 'Share what?' (a4-27-23)"),
    ("a4-27-11", "ALYI (reflection)", "The company will tell us.", "R2: the committee races the phones; a third question-and-answer in a row"),
    ("a4-27-18", "TTEMME", "Chat. I'm the CEO now.", "it said his card aloud; the spotlight and his stream's name bar carry it"),
    ("a4-27-22", "MADA", "Good question. (end of pass one)", "pattern 8: twice an episode at most; her '?' and his spinner end the pass unanswered"),
]

SILENT_32 = [s for s in SILENT_31 if s[1] != "CARD"] + [
    ("28", "CARD", "WHAT THEY DIDN'T KNOW: MM-09x sting on the downbeat, no voice"),
    ("27", "MADA (end of pass one)", "27.31 [MCU]: he doesn't answer 'Step four?'; the spinner keeps turning (a4-27-22 is cut)"),
]

BY_ID_32 = {l["id"]: l for l in LINES_32}
