"""The v3.3 spec (script draft 8.2, the polish round, PLAN §6), as deltas on the v3.2 LOCK
(show/reel/ep01-v32/ep01-v32-<seg>.json). Imported by _build_v33.py; edit here and re-run.

Fix codes are PLAN §6's item numbers (V1-V3, S1-S5, P1-P19). Anything else is unchanged from the v3.2 lock.
"""

VO_TAKES = {  # restored inner-voice takes (V1, V2): the v3 takes on file
    "v3-vo-09": ("audio/ep01/v3/act1/wav/v3-vo-09.wav", "audio/ep01/v3/act1/lines-v3.json"),
    "v3-vo-12": ("audio/ep01/v3/act2/wav/v3-vo-12.wav", "audio/ep01/v3/act2/lines-v3.json"),
}

CHANGES = {
    "coldopen": {},
    # ------------------------------------------------------------------ ACT ONE
    "act1": {
        "5.07": {
            "est_s": 9.9,
            "shot_note": "P1: under Gerg's \"It's a research preview.\" cut in to Mas's MCU (reuse the 5.11 MCU drawing, without the chat's glow): his face, not answering, held about 1 s past the line before 5.08's click. No look at Rima (guardrails §6: the click is never tied to the question).",
            "fix": ["P1"],
            "why": "The board question gets a beat of its own: his face, not answering (the v3.2 newcomer only found it in the subtitles).",
        },
        "6.06": {
            "est_s": 3.6,
            "caption": "Far down, the odometer punches into bedrock and its last wheel lands: 1,000,000. Then only his thumb on send and the post's first line, as a preview: \"CHATGTP launched on wednesday. today it crossed…\"",
            "onscreen": {"replace": {"MAS (post): \"CHATGTP launched on wednesday. today it crossed 1 million users!\"":
                                     "MAS (post, preview; his thumb on send): \"CHATGTP launched on wednesday. today it crossed…\" [P · W1]"}},
            "fix": ["P2"],
            "why": "The wheel says the number; the post is his act, not a second caption of it. The 1 s hold on the digits goes.",
        },
        "7.01": {
            "shot_note": "P3: one tear glint at his eye, readable in this shot (one bright pixel held from Rima's \"Is that a tear?\" to the cut).",
            "fix": ["P3"],
        },
        "8.03": {
            "onscreen": {"replace": {"RADNUS · RUNS ELGOOG · POLITELY ON FIRE": "RADNUS · RUNS ELGOOG"}},
            "fix": ["P14"],
            "why": "A two-part plate; the flame on his sleeve shows the rest.",
        },
        "9.08": {
            "shot_note": "P4: the Macrosoft collar surfaces here for the first time. Check every Act One shot before 9.08 (5.01-9.07): no Macrosoft collar on him, only his own two. The cold open (Nov 2023) keeps it.",
            "fix": ["P4"],
        },
        "9.09": {
            "est_s": 21.5,
            "restore": [{
                "id": "v3-vo-09", "who": "mas", "vo": True, "text": "it does.",
                "after": "e1-a1-9-04", "gap_s": 0.5, "kind": "gap",
                "note": "V1: the v3 take, unchanged. Only the voice can admit the vanity while he stands on the check; the collar has just arrived (P4)",
            }],
            "retime": {"e1-a1-9-05": "after:v3-vo-09+1.2"},
            "caption": "MAS on the check, TASYA at frame right, the door behind. On \"That collar suits you.\" Tasya's hand settles the new collar on him (the key ring clinks against it once). it does. (V.O.) He looks down at what he's standing on. \"and the rent?\" … \"Everyone is welcome. Rent is due on the first.\"",
            "shot_note": "P4: Tasya's hand settles the collar on the line; the collar arrives in this moment, and it's the landlord's.",
            "fix": ["V1", "P4"],
            "why": "The collar arrives on the landlord's line and his hand, so the vanity has something to be about.",
        },
        "12.02": {
            "onscreen": {"replace": {"NOLE · EARLY FUNDER · BUILDING HIS OWN": "NOLE · BUILDING HIS OWN"}},
            "fix": ["P14"],
            "why": "A two-part plate (EARLY FUNDER is lore).",
        },
    },
    # ------------------------------------------------------------------ ACT TWO
    "act2": {
        "13.09": {
            "est_s": 16.2,
            "restore": [{
                "id": "v3-vo-12", "who": "mas", "vo": True, "text": "he's not wrong.",
                "after": "e1-a2-13-11", "gap_s": 0.4, "kind": "gap",
                "note": "V2: the v3 take, unchanged. An invented beat; the thought concedes, then the speech is the knife (calibration §5's preferred kind). It ends Act Two's silence",
            }],
            "retime": {"e1-a2-13-12": "after:v3-vo-12+0.9"},
            "fix": ["V2"],
            "why": "The thought, then \"how's the dancing?\": the gap between them is the scene.",
        },
        "14.01": {
            "shot_note": "P6 (judged, see script-v33-notes §3): the clip stays a fake of a generic news anchor (facts #18: the May 12 repost was an altered anchor clip; the anchor is never a real person), and it is NOT redrawn as the senator. Make it unmistakably an anchor at a news desk (a blank lower-third bar, a desk), so nobody expects the senator's face; the chairman's \"That voice was not mine.\" then names his own fake.",
            "fix": ["P6 (alt)"],
        },
        "17.10": {
            "est_s": 3.0,
            "shot_note": "P7: the hand is MARIO's, unambiguously: his fleece cuff, the footnote still wet on the sheet under it, the scroll in his pocket at the frame's edge. Mas's hand stays half out beside it, empty. Held half a second longer.",
            "fix": ["P7"],
            "why": "The careful one's pen becomes a chip order: Misanthropic's roast (fairness rule 7), and Mas's empty hand beside it.",
        },
        "17.11": {
            "frame": "WIDE · the table under the sky; the chip-maker's line climbs off the top of the frame (phrase 4)",
            "caption": "PHRASE 4: the bell decays. The register's window figure lifts off as a line, the chip-maker's price, and climbs across the blue sky in whole-pixel steps and off the top of the frame (the intro's curve). Everyone looks up: Nesnej, then Mario, who writes something down, then Mas, last. Hold on the empty sky where the line left.",
            "fix": ["P8"],
            "why": "Act Two's out is the price of the race leaving the frame, an image the film already owns; the glass is gone.",
        },
        "17.12": {"action": "cut", "est_s": 0.0, "fix": ["P8"],
                  "why": "P8: the act-out glass read as a head floating in a tank (audit-v31 #8, audit-v32 #7). Cut."},
        "17.13": {
            "jcut": [{"sound": "the rack's fans and LED ticks under the black (Act Three's arrival)", "lead_s": 0.6}],
            "fix": ["P8"],
            "why": "The black carries the bell's last partial, then Act Three's room leads in.",
        },
    },
    # ------------------------------------------------------------------ ACT THREE
    "act3": {
        "v31-18.00": {
            "est_s": 3.8,
            "move_in": [{"id": "v31-a3-0001", "from": "v31-18.00b", "at": "start+1.4",
                         "note": "P5: from the monitor in the background, soft"}],
            "caption": "The home room, from behind the rack: the desk, the LEDs, the cyan key, the glass. At frame right, large enough to read, the monitor plays softly: the landlord's lobby, TASYA hanging a thirteenth key on his ring (Atem blue, beside the beige twelfth), KRAM in a dry OPEN SOURCE hoodie. \"Everyone is welcome.\" from the monitor.",
            "onscreen": {"add": ["MACROSOFT WELCOMES ATEM (the monitor's own caption)", "KRAM · RUNS ATEM (plate, two parts)", "OPEN SOURCE (his hoodie)"]},
            "fix": ["P5"],
            "why": "The Atem beat lives in the background of his room, not as its own POV; the key ring stays legible and the landlord's line stays.",
        },
        "v31-18.00b": {"action": "merge", "into": "v31-18.00", "est_s": 0.0,
                       "move_out": {"v31-a3-0001": "v31-18.00"}, "fix": ["P5"],
                       "why": "P5: folded into v31-18.00's background; the JUL 18 chip goes (the Coinworld rail follows)."},
        "18.01": {
            "caption": "Back on the room, the landlord's lobby still playing softly on the monitor behind. The rack's drive slot whirs and slides out a box like a tray: COINWORLD.",
            "fix": ["P5"],
        },
        "v31-19.02": {"action": "cut", "est_s": 0.0, "fix": ["S1"],
                      "why": "S1: the VP's two letters were TV with no stake for him."},
        "v31-19.03": {
            "est_s": 7.7,
            "retime": {"e1-a3-19-01": "start+1.6"},
            "caption": "One held room frame, the monitor large at frame right: the forum room, tiled seated figures, hands down. REMUHCS: \"Every single person raised their hand.\" Every hand goes up at once; Nole's highest. \"It's important for us to have a referee.\" BILLS: 0. At the desk his own hand is already up. He lowers it and turns to his keyboard.",
            "onscreen": {"drop": ["JUL 21 · PINKY PROMISE · SIGNED: 7 AI COMPANIES"]},
            "fix": ["S1"],
            "why": "Only the forum stays: the hands, his own hand raised at home, then his keys.",
        },
        "20.01": {
            "est_s": 4.4,
            "caption": "Over his shoulder onto the monitor: a TIDDER thread, its title the crowd's speculation (invented, in the parody UI), held to read; then his reply typed into it, in source casing: \"Agi has been achieved internally\".",
            "onscreen": {"add": ["TIDDER · t/singularity · \"is it already here? anyone actually know?\" (the thread's title) [INVENTED crowd text in a parody UI; no source is claimed]"]},
            "fix": ["S1", "P9"],
            "why": "The post answers a thread: a forum speculating about the thing he builds, and he replies (facts #34: a comment, then the edit calling it a meme). No reason is played.",
        },
        "v31-20.07": {
            "fix": ["V3"],
            "why": "V3: no voice here (mas-inner-voice §5: another person's real act that bears on him gets the held face, not a thought).",
        },
        "v31-20.08": {
            "est_s": 2.4,
            "frame": "MCU · Mas reading page 30, the monitor's light on his face",
            "caption": "His face, reading page 30, held about 2 s: the room's hum, no voice, nothing on it changes. Then he switches tabs; the paper's tab stays in his tab strip, DECODING INTENTIONS.",
            "shot_note": "P10: the held face; the tab strip keeps the paper's tab from here to the act-out.",
            "fix": ["P10", "V3"],
            "why": "He takes it in, visibly and silently; the paper stays open on his screen.",
        },
        "v32-22.04": {
            "est_s": 4.5,
            "shot_note": "P11: NOTIFY ME stays; the post collapses to its first words once it's up. The tab strip still shows DECODING INTENTIONS.",
            "fix": ["P11"],
        },
        "23.02": {
            "frame": "SCR · his monitor: his own NOTIFY ME page, the paper's tab in the strip, and the reminder over them",
            "caption": "On the monitor, over his own NOTIFY ME page, with the DECODING INTENTIONS tab still in the strip, the reminder pops up: Board sync · Fri 12:00, the four avatars; the Orb's iris steps along them and stops on the black square.",
            "fix": ["P10"],
            "why": "The door he shut is where the invite arrives, beside the paper he left open (audit-v32 #9).",
        },
    },
    # ------------------------------------------------------------------ ACT FOUR
    "act4": {
        "S4.02": {
            "shot_note": "P12: a slow push in during Neleh's second speech, reaching her MCU by \"what happens on Monday\"; on Alyi's \"That is the company telling us.\" the row of phones lights up in frame. No frame held unchanged for more than 8 s.",
            "fix": ["P12"],
        },
        "v32-S5.00": {
            "onscreen": {"drop": ["RAIL: NOV 19, 2023 · ~1 PM PT"]},
            "fix": ["P13"],
            "why": "Dated once: the camera's own plate (NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM) stays.",
        },
        "S4.10": {
            "onscreen": {"add": ["RIMA TAMURI · CTO (her tile's label, stepping back from INTERIM CEO as the spotlight leaves it)"]},
            "fix": ["S2"],
            "why": "S2, picture only: there is no clean reported reason for replacing Rima (script-v33-notes §3). The picture says what happened to her (back to CTO) and nobody says why, which the blank page pays.",
        },
        "S4.10b": {
            "est_s": 15.2,
            "drop": {"a5-27-42": "S2: \"Okay.\" read as satisfied and undercut the running gag; he turns the page over instead, and its back is blank (P15)"},
            "caption": "NELEH and TTEMME across the table. \"we'd like you to serve as interim CEO.\" / \"You already have an interim CEO.\" / \"We'd like a different one.\" / \"Fine. But before I say yes, I need to know why you fired him.\" Neleh slides the sealed folder across; he breaks the seal with it turned away from us and reads behind its cover. Then he turns the page over toward us: its back is blank. He holds Neleh's eye a beat, and reaches for the hourglass.",
            "shot_note": "P15: we see only the blank back of the page, never its front (X9: the folder stays sealed on our side).",
            "fix": ["S2", "P15"],
            "why": "The running gag holds: he got a page, and all we get is its blank back.",
        },
        "S5.03": {
            "shot_note": "P16: the heart counter on his screen reads with the voice, word for word: 406 on \"four hundred and six\", 407 on \"four hundred and seven\", back to 406.",
            "fix": ["P16"],
        },
        "S7.02": {
            "drop": {"v3-a4-0002": "S4: the line moves to the EMPLOYEE who asked \"Is this a coup?\" (v33-a4-0001)"},
            "add": [{
                "id": "v33-a4-0001", "who": "employee",
                "text": "Everyone's packed. Whatever happens to this place, Mas, don't worry about us.",
                "after": "start+1.4", "gap_s": 0.0,
                "delivery": "plain and warm, box in her arms, to Mas at his desk; a statement, not a plea",
                "tag": "", "take": "new (the tiled employee's voice, ref a5-27-18)",
                "note": "[INVENTED] the staff's reported threat to follow him (facts #51, L3); it says nothing about who organized anything",
            }],
            "caption": "The bullpen: every desk has a packed box, everyone has a coat on. Among the boxes, the EMPLOYEE who asked \"Is this a coup?\", box in her arms, facing Mas at his end desk, her mouth lit: visibly the one speaking. \"Everyone's packed. Whatever happens to this place, Mas, don't worry about us.\" On the wall monitor behind her, a TV plays softly.",
            "shot_note": "P17: she is the one moving and speaking; Tasya isn't on the floor.",
            "fix": ["S4", "P17"],
            "why": "The staff's line is said by staff, someone we've met, where we can see her.",
        },
        "S7.02b": {
            "est_s": 4.8,
            "frame": "WIDE · the bullpen with its wall TV in frame: Tasya's interview clip at a podcast mic",
            "drop": {"v3-a4-0003": "S5: recited face to face; replaced by its last sentence, cut and put through the TV's small speaker (v33-a4-0002)"},
            "add": [{
                "id": "v33-a4-0002", "who": "tasya",
                "text": "…We are below them, above them, around them.",
                "after": "start+0.5", "gap_s": 0.0,
                "delivery": "the interview's own read, through the bullpen TV's small speaker",
                "tag": "tv", "take": "cut from v3-a4-0003 (its last sentence, words 10-17), then the tv chain",
                "note": "[V · facts L19: \"below them, above them, around them\" confirmed; the \"IP rights\" sentence, on HOLD in L19, is no longer used. The podcast episode was released Nov 21 (L19); the scene carries no date card, and the clip carries no dated chyron]",
            }],
            "caption": "The bullpen's wall TV, in frame over the packing staff: TASYA in an interview, a podcast mic in front of him. \"…We are below them, above them, around them.\" On below, the floor under the staff steps to Macrosoft slate; on above, the ceiling; on around, the walls. The staff keep packing.",
            "fix": ["S5", "P17"],
            "why": "The last real quote spoken face to face becomes a clip, in its own medium, and the room still turns into the landlord.",
        },
        "S7.03": {
            "est_s": 2.2,
            "drop": {"v31-a4-0014": "S3: \"Down here.\" didn't parse (the v3.2 newcomer)"},
            "fix": ["S3"],
            "why": "His look down at the slate floor, held; the invite follows.",
        },
    },
    # ------------------------------------------------------------------ TAG
    "tag": {
        "32.03": {
            "est_s": 4.8,
            "fix": ["P19"],
            "why": "P19 (mood-analysis-v32 #5): the cover beat holds about 1 s longer, so the tag breathes once.",
        },
    },
}

NEW = {s: [] for s in ("coldopen", "act1", "act2", "act3", "act4", "tag")}
