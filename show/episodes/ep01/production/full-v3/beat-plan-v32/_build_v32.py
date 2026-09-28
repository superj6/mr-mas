#!/usr/bin/env python3
"""The v3.2 beat plans (the `v32-agency` pass, script draft 8), built from a spec
against the v3.1 LOCK (show/reel/ep01-v31/ep01-v31-<seg>.json).

    python3 show/episodes/ep01/production/full-v3/beat-plan-v32/_build_v32.py           # validate + runtime + V.O. + takes
    python3 show/episodes/ep01/production/full-v3/beat-plan-v32/_build_v32.py --write   # (re)write the six JSON files

It only reads the v3.1 timelines and the v3.1 plans (for each kept beat's music string);
it writes only beat-plan-v32/<seg>.json. To change a plan, edit SPEC below and re-run;
don't hand-edit the JSON.

Checks (the run fails loudly on any of them):
  * every v3.1 beat appears exactly once (keep, cut, merge, or keep with "moved");
  * every dropped, retimed or moved-out line exists in its beat;
  * every moved-in line was moved out of the beat it names;
  * every new line's "after" is start±S or a line present in the same beat;
  * new beat and line ids are unique.

est_s is a planning length from the lock's measured beat lengths, the line timings on
file and word counts (about 2.4 words/s for Mas, 2.8-3.2 for the others); never a
measurement. The next lock sets the frames.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, *[".."] * 6))
LOCK = os.path.join(ROOT, "show/reel/ep01-v31/ep01-v31-{seg}.json")
V31PLAN = os.path.join(HERE, "..", "beat-plan-v31", "{seg}.json")
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]

ABOUT = (
    "v32-agency beat plan (PLAN §2 format, plus the v3.1 plans' additive fields), written against the "
    "v3.1 LOCK's beat and line ids (show/reel/ep01-v31/ep01-v31-<seg>.json). Every v3.1 beat appears once "
    "(keep, cut, merge, or keep with \"moved\"), plus the new beats, listed in their v3.2 order. "
    "est_s is a planning length (the lock's measured lengths, line timings on file, word counts), never a "
    "measurement. Kept lines are keep true/false; kept V.O. carries \"vo\": true; new lines carry "
    "v32-<seg>-NNNN ids with who/text/after/gap_s/delivery/take; \"at\" on a kept line retimes it "
    "(start+S | after:<line id>+S); moved lines carry moved_from / moves_to. There are no new V.O. lines: "
    "the inner voice is pruned from 28 lines to 11 (SHOWRUNNER-NOTES note 0; draft 8.1 per show/bible/calibration.md §5), all on existing takes. "
    "Fix codes: A0 = note 0 (the lead drives the plot); A1-A4 = the brief's direction for Acts One to Four; "
    "P = the V.O. prune (a thought that could be an action becomes the action; forced or writerly lines go); "
    "N1 = the newcomer's \"I couldn't tell what Mas wants\"; R = runtime. The v3.1 rules stand: subtitles "
    "without quotation marks or print ellipses on spoken real lines; every call grid names its speaking tile; "
    "no band prompt. Draft 8.1 adds calibration codes C3/C5/C9 and the v3.1 audit's AUD codes (../audit-v31.md). The script is show/episodes/ep01/script.md (draft 8.1); the notes are "
    "../script-v32-notes.md; the agency map is ../agency-v32.md; the builder is _build_v32.py."
)

# ---------------------------------------------------------------------------------------------
# The spec. CHANGES[seg][beat] overrides a kept beat; NEW[seg] adds beats after an anchor;
# a CHANGES entry with "moved_after" relocates a kept beat. Unlisted beats are kept unchanged.
# ---------------------------------------------------------------------------------------------

P_WHY = "P (note 0): pruned; "

CHANGES = {
    "coldopen": {},
    # ------------------------------------------------------------------ ACT ONE
    "act1": {
        "5.02": {
            "est_s": 6.5,
            "drop": {"v3-vo-01": P_WHY + "the three wants arrive in their own lines within 30 s; the list read as the writer's summary"},
            "caption": "The bullpen after hours, held: Gerg at his green laptop, Rima at LAUNCH: LOW-KEY (underlined twice), Alyi's reflection in the conference-room glass, Mas at the end desk with his glass, his laptop closed beside the button, the cursor parked on it. No voice over the wide: room tone, then Gerg.",
            "fix": ["P"],
            "why": "The arrival stays (6.5 s of room, sound first); the voice-over that listed everyone's want goes, because the next 30 s play each want as a line.",
        },
        "5.03": {
            "est_s": 11.0,
            "drop": {"e1-a1-5-01": "A1 / N1: replaced by its first sentence (v32-a1-0001). \"I'm shipping it.\" made the launch Gerg's (the v3 newcomer: \"he lets his co-founder Gerg ship\")"},
            "add": [{
                "id": "v32-a1-0001", "who": "gerg", "text": "Okay, the build's green.",
                "after": "start-0.5", "gap_s": 0.0,
                "delivery": "typing; already done with his part (the J-cut stays: 0.5 s under the wide)",
                "tag": "", "take": "cut from e1-a1-5-01 (its first sentence, 0.00-1.15 s)",
                "note": "[INVENTED] Gerg still hasn't waited to be asked (it's all built); the button is left for Mas",
            }],
            "caption": "Mas and Gerg, desk to desk, the dark laptop and the button in the foreground. \"Okay, the build's green.\" / \"We said low-key, Gerg. I underlined it. Twice.\" / she'll go for three. (V.O.) / \"It's a research preview, Rima…\"",
            "fix": ["A1", "N1"],
            "why": "The launch becomes his call. Gerg has built and staged it (the man who never waits to be asked), but he never says he's shipping it: the button is Mas's (\"Your button.\", 5.07) and Rima says so (\"Mas, it's your call.\", 5.04). The prediction stays: his reads are right, which is why the budget read hurts.",
        },
        "5.04": {
            "why": "unchanged. v3-vo-03 stays (one of the twelve): \"she's right. it will break.\" makes the click a choice made knowing, against Rima's caution and Alyi's; aloud, \"it's a preview.\"",
            "fix": ["A1"],
        },
        "v3-5.06b": {
            "est_s": 2.5,
            "drop": {"v3-vo-04": P_WHY + "the reaction stays, the gloss goes; Alyi's count at 5.09 says who he is to Mas"},
            "caption": "Alyi in the glass, held two beats, still watching the button. The Build thins to Rhodes alone.",
            "fix": ["P"],
            "why": "Alyi's reaction to \"…still a preview.\" (his question unanswered) is the beat; it no longer needs a voice-over to hold it.",
        },
        "5.08": {
            "caption": "His finger on the button, no hover: his call, over Rima's caution, Alyi's question and a question nobody answered. Click, the 1993 OK's click. Nothing happens.",
            "fix": ["A1"],
            "why": "Unchanged in picture; named as the act's first choice. (The staging never ties the click to the board question: no look at Rima, guardrails §6.)",
        },
        "6.01": {
            "drop": {"v3-vo-06": P_WHY + "the thought becomes the action: he announces the million himself (6.06)"},
            "fix": ["P"],
            "why": "The set-piece's bars are unchanged; the voice-over goes.",
        },
        "6.06": {
            "est_s": 4.6,
            "caption": "Far down, the odometer punches into bedrock and stops; its last wheel settles, legible: 1,000,000. His post pops over it in its own UI, his avatar and name, as it goes up: \"CHATGTP launched on wednesday. today it crossed 1 million users!\"",
            "onscreen": {
                "replace": {"DEC 5, 2022 (rail)": "DEC 4, 2022 (rail)"},
                "add": ["MAS (post): \"CHATGTP launched on wednesday. today it crossed 1 million users!\" [P · DEC 4, 2022, 11:35 PM PT · facts W1; the name swap only]"],
            },
            "art": "his post card over the million (kits/post-card.ts, new text: masMillion; the card's time DEC 4 · 11:35 PM)",
            "sounds": "his post's send pop, on F, on the wheel's last click",
            "fix": ["A1", "P"],
            "why": "\"let's see if anyone notices.\" is paid by his own announcement, not a voice-over: the want, acted, in his own public words. The rail moves to DEC 4 (his post is 11:35 PM PT on Dec 4; Gerg's, facts #4, followed at 12:32 AM on Dec 5: both are the million).",
        },
        "7.02": {
            "jcut": [],
            "caption": "The tear falls through the open tile onto a red-hot GPU. Tssss: steam in three held puffs, and the steam gets its extra second. Under the last puff his hand finds the phone on the desk.",
            "sounds": "the steam; the phone lifted off the desk (the siren's J-cut moves to v32-7.03's end)",
            "fix": ["A1"],
            "why": "The sting keeps its length (M §4 #13); it now hands to his call instead of the rival's siren.",
        },
        "8.01": {
            "caption": "The phone he just hung up, lit red: ELGOOG · CODE RED. His thumb opens it; the app zooms to full-bleed.",
            "why": "Unchanged length; the alert lands on the phone from the call.",
        },
        "9.01": {
            "caption": "The lobby, the blank wall sign, the TV dark. Mas walks in from frame left with his glass. Through the glass doors comes the answer to his call: a novelty check, enormous, jammed in the revolving door under the gold letters: MACROSOFT · \"multiyear, multibillion dollar\" · $ MULTIBILLION.",
            "fix": ["A1"],
            "why": "Unchanged in picture; the check now answers a call we saw him make.",
        },
        "9.04": {
            "caption": "FULL FREEZE: TASYA / THE LANDLORD · RUNS MACROSOFT. Tasya already in the lobby, eleven keys at his belt. Mas keeps moving in the freeze: he walks to the jammed door and pockets the pen clipped to the check, the pen Tasya said he'd bring. eleven keys. he's here for the twelfth. (V.O.)",
            "why": "The prediction stays (one of the twelve: a read of Tasya that the twelfth key pays at 9.10). The pen he pockets is now the one promised on the phone; it writes PLEASE (12.04) and carves the third mark (S2.01).",
            "fix": ["A1"],
        },
        "9.09": {
            "est_s": 20.7,
            "drop": {"v3-vo-09": P_WHY + "\"it does.\": he looks down at what he's standing on, and asks the price"},
            "retime": {"e1-a1-9-05": "after:e1-a1-9-04+1.7"},
            "fix": ["P"],
            "why": "The hold after \"That collar suits you.\" stays his (he looks down at the check); \"and the rent?\" comes 1.2 s sooner.",
        },
        "11.03": {
            "est_s": 9.2,
            "drop": {"v3-vo-10": P_WHY + "Mario is introduced by his own memo, his plate and the intro's roll call"},
            "retime": {"e1-a1-11-01": "start+1.5"},
            "caption": "The split. RIGHT: the lighthouse; CLOD in the spotlight; MARIO, finger raised, drafting on a scroll; his plate. He dictates. LEFT: the bullpen demo, Gerg photographing the napkin, Mas at his end desk by the beige button.",
            "fix": ["P"],
            "why": "The right pane still opens first and holds clean; Mario's memo is the introduction.",
        },
        "11.04": {
            "caption": "RIGHT: \"You're absolutely right!\" CLOD launches; Mario looks up at the split line: the same day. \"Addendum.\" LEFT: Mas's finger on his beige button, no hover: click (launch night's click); on the click the napkin swaps into a working website, and the bullpen cheers in two held frames.",
            "art": "the LEFT pane gains 5.08's insert (his finger, the button) scaled into the pane before the napkin-to-website swap",
            "sounds": "5.08's click, on the downbeat before \"Addendum.\"",
            "fix": ["A1"],
            "why": "GTP-4 goes out on his click: the same button as launch night. It's his launch, and nothing says he picked the day (both labs launched on Mar 14, facts #11).",
        },
    },
    # ------------------------------------------------------------------ ACT TWO
    "act2": {
        "13.01": {
            "est_s": 4.6,
            "drop": {"v31-vo-01": P_WHY + "Radnus's silent rehearsal stays in the picture (his lips move from the first frame) and pays when he leans across at 13.09"},
            "caption": "A formal meeting room, portraits, a long table; at its head the A and I blocks and SIRRAH with her pointer and her CZAR? sticky note. MAS is already in the seat nearest the teacher, his glass set down square; RADNUS, MARIO and TASYA are still settling into theirs along the row. Radnus's lips move, silently: a sentence rehearsed.",
            "fix": ["P", "A2"],
            "why": "A 4.6 s arrival (the chapter change's 3.5 s of room and the mantel clock), then Sirrah. The one small move here is his seat: he got to the chair nearest the teacher first (\"scheme small\": where to sit in the photo), and the photo he ends up owning (13.07, 13.14) starts from it.",
        },
        "13.09": {
            "est_s": 14.6,
            "drop": {"v3-vo-12": P_WHY + "\"he's not wrong.\": his answer, the knife, is the read"},
            "retime": {"e1-a2-13-12": "after:e1-a2-13-11+0.9"},
            "fix": ["P"],
            "why": "\"how's the dancing?\" comes on the beat after Radnus's worry: a move, not a comment.",
        },
        "13.11": {
            "est_s": 4.3,
            "drop": {"v3-vo-13": P_WHY + "the action carries it: three heads turn and his doesn't"},
            "retime": {"e1-a2-13-14": "start+2.0"},
            "caption": "The door in the back wall opens. NEDIB strides in, aviators up, the pen held like a baton. Three heads in the row turn round to him, each at its own speed. Mas's doesn't: his eyes stay where they were, the one-pixel smile. \"Folks, I just want to say one thing.\"",
            "fix": ["P"],
            "why": "Where he looks is his choice, and the picture shows it; the flash (13.12) catches the three turned heads.",
        },
        "14.01": {
            "est_s": 6.0,
            "drop": {"v31-vo-02": P_WHY + "the orientation moves into the picture: the tag held to read, and his replay"},
            "caption": "Over Mas's shoulder at the dark bullpen window, his phone where the print was (the match cut). His feed opens on CLASS PHOTO #1, hearts under it, and scrolls to a clip of an invented anchor whose mouth lands a beat after the words, under the app's own tag ⚠ ALTERED AUDIO, held large enough to read. His thumb drags the clip back and plays it again: late again. Beyond the glass, the dark building, its one lit window.",
            "art": "his thumb scrubbing the clip back (two drawings); the tag drawn at a readable size",
            "fix": ["P"],
            "why": "He checks it like a man who builds these; the lit window reposts it (14.03-14.04); the chairman's \"That voice was not mine.\" names the idea on the next scene's first line. (v3.1's bay fixes stand: the match cut, the generic anchor, the real line.)",
        },
        "15.10": {
            "est_s": 3.7,
            "drop": {"e1-a2-15-10": "A2: he proposes the agency himself now, so \"There's talk of a new agency\" goes; its last sentence moves to 15.11 (v32-a2-0002)"},
            "move_in": [{"id": "e1-a2-15-15", "from": "15.14", "at": "start+0.4",
                         "note": "the same take; it now asks for his ask, and he gives it"}],
            "caption": "The dais leans in. One microphone's red light comes on, and Mas's eyeline goes to it. \"Is there anything you'd like this committee to do?\"",
            "fix": ["A2"],
            "why": "The committee asks for his ask; the next beat is his answer.",
        },
        "15.15": {
            "moved_after": "15.10",
            "est_s": 7.6,
            "frame": "OTS → HIGH · his line over his shoulder onto the dais (15.07's setup), then the witness table from above",
            "add": [{
                "id": "v32-a2-0001", "who": "mas",
                "text": "…i would form a new agency that licenses any effort above a certain scale of capabilities…",
                "after": "start+0.3", "gap_s": 0.0,
                "delivery": "unhurried, plain, a lunch order; a man who has brought his own answer. Read as one finished sentence ending on \"capabilities\"",
                "tag": "", "take": "new",
                "note": "[P · MAY 16, 2023 · the Senate transcript (facts W2: \"Number one, I would form a new agency that licenses any effort above a certain scale of capabilities and can take that license away…\"); the subtitle drops the marks]",
            }],
            "caption": "His answer begins over his shoulder; on \"licenses\" the cut to the table from above: his hand slides a single sheet toward the dais, off the table's right-hand edge, the sheet from his desk in March, finished: PLEASE REGULATE ME, his signature already on it. Sucram is faster: he stamps it mid-slide, CALLED IT. (BEFORE LAUNCH.)",
            "art": "reuse 15.07's OTS and 15.15's HIGH; his hand's slide on the word",
            "fix": ["A2"],
            "why": "His ask is his move, in the record's words, handed over as he says it. The next question (would you run it?) follows from it. The sheet stands for the ask and quotes nothing (facts #61).",
        },
        "15.16": {
            "moved_after": "15.15",
            "jcut": [],
            "caption": "Match on action: the sheet comes in from frame left into the clone's waiting hand. The senators lean in at once, delighted: every one of them wants to sign it.",
            "fix": ["A2"],
            "why": "The room loves his ask, and one of them asks the next question because of it (15.11). The tour's J-cut moves to 15.14.",
        },
        "15.11": {
            "est_s": 8.4,
            "add": [{
                "id": "v32-a2-0002", "who": "senator", "text": "Would you come and run it?",
                "after": "start+0.3", "gap_s": 0.0,
                "delivery": "at the lit microphone, delighted, as if the sheet had been a job application",
                "tag": "O.S.", "take": "cut from e1-a2-15-10 (its last sentence, 5.39-6.85 s)",
                "note": "[INVENTED paraphrase of the record: Kennedy's \"Would you be qualified… to administer those rules?\" (facts W2)]",
            }],
            "retime": {"e1-a2-15-11": "after:v32-a2-0002+0.6"},
            "fix": ["A2"],
            "why": "Asked because he proposed it: \"i love my current job.\" now answers his own proposal, in the record's order (facts W2).",
        },
        "15.14": {
            "est_s": 6.3,
            "move_out": {"e1-a2-15-15": "15.10"},
            "jcut": [{"sound": "the tour's first stamp's thunk, under the hold after \"…i have no equity in nopeai.\" (moved from 15.16)", "lead_s": 0.5}],
            "caption": "MAS and SUCRAM. \"That proves nothing. Partially.\" / \"…i have no equity in nopeai.\" MM-20 back on a new phrase; a held beat on the two of them; the tour's stamp thunks in under it.",
            "fix": ["A2"],
            "why": "The scene ends on his own last word, the record's; the ask was handed over earlier, where it belongs.",
        },
        "16.01": {
            "caption": "MATCH on the thunk: the tour poster, MAS MANALT: THE REGULATE-ME TOUR, its cities. LONDON's strip: \"…cease operating…\" and EU gets CANCELLED; his post \"…no plans to leave\" and UN-CANCELLED lands over it. The last date slot: his own hand comes into frame with a rubber stamp and stamps it, ADDED DUE TO POPULAR DEMAND. The frame holds on his one-pixel smile to the bar's end.",
            "art": "his hand and a rubber stamp entering the poster GFX (one drawing in, one stamp, one out)",
            "fix": ["A2"],
            "why": "The tour is his play: he threatens, walks it back (both his own public words) and adds the dates himself.",
        },
    },
    # ------------------------------------------------------------------ ACT THREE
    "act3": {
        "v31-18.00b": {
            "est_s": 5.0,
            "drop": {"v31-vo-03": P_WHY + "the thirteenth key and Kram's OPEN SOURCE hoodie pay the count and \"it'll be open source.\" on sight"},
            "fix": ["P"],
            "why": "The Atem payoff stays whole in the picture.",
        },
        "18.02": {
            "est_s": 3.2,
            "drop": {"v31-vo-04": P_WHY + "the label says whose it is and what it does (PROOF YOU'RE HUMAN · CO-FOUNDER); the next beats show it doing it"},
            "fix": ["P"],
            "why": "Held to read the label, then the lid.",
        },
        "18.06": {
            "est_s": 5.7,
            "drop": {"e1-a3-18-04": P_WHY + "\"i made it for everyone else.\" (v3-vo-14): the tokens and the verdict make the irony; his act is the invitation"},
            "retime": {"e1-a3-18-03": "start+2.2"},
            "fix": ["P"],
            "why": "The Orb drifts to his shoulder; \"you can stay.\": he keeps his own witness.",
        },
        "v31-19.03": {
            "est_s": 10.4,
            "drop": {"v31-vo-05": P_WHY + "his hand, already up before the room's, says it; he lowers it himself"},
            "fix": ["P"],
            "why": "The runner stays whole (a v3.1 restoration); it ends on his hand coming down.",
        },
        "20.06": {
            "est_s": 12.5,
            "drop": {"v3-vo-15": P_WHY + "the keys running on under the call plant 2 AM, where they stop"},
            "fix": ["P"],
            "why": "The call ends on \"When it compiles.\" and his keys; 1.5 s of hold.",
        },
        "21.05": {
            "lcut": [{"sound": "the deepfake's clapping, carried into v32-21.06 (it becomes DevDay's applause there)"}],
            "why": "Unchanged picture; the clap now carries into the room, where he switches the monitor off.",
        },
        "22.01": {
            "est_s": 10.8,
            "frame": "WIDE → MCU · DevDay, live: the stage, the hall's applause (no monitor, no bezel)",
            "add": [{
                "id": "v32-a3-0001", "who": "mas", "text": "and today, you can build your own chatgtp.",
                "after": "start+2.0", "gap_s": 0.0,
                "delivery": "keynote-polite and pleased, the lowercase register at hall size; a gift, not a pitch",
                "tag": "stage", "take": "new (the stage chain: a hall's reverb)",
                "note": "[INVENTED · a plain paraphrase of the GPTs launch at DevDay, Nov 6, 2023 (facts #43; research mid §2): custom versions of the chatbot anyone can build]",
            }],
            "retime": {"e1-a3-22-01": "after:v32-a3-0001+1.2"},
            "device": {"e1-a3-22-01": "monitor → stage (a hall's reverb; the take stands)",
                       "e1-a3-22-02": "monitor → stage (the take stands)"},
            "caption": "Live: Mas on the DevDay stage, the applause carried over the cut. Behind him the launch-night odometer clunks up through the stage floor and settles, legible: 100,000,000 / WEEK. \"and today, you can build your own chatgtp.\" Tasya walks on beside him, laughing, arms open; behind him the Sydney bubble bobs on its egg-timer chain. \"so, how's the partnership going?\" / \"We love you guys.\"",
            "onscreen": {"drop": ["the 1 s home two-shot at the head (he isn't home now)", "the zAI rafters egg (there's no bezel)"]},
            "art": "the DevDay stage full-frame without the monitor's bezel (the existing POV plate, re-framed); Mas speaking on stage (the existing pose)",
            "fix": ["A3", "A0"],
            "why": "DevDay is his move, not his broadcast: he's on the stage, launching the thing that lets anyone build their own, at 100 million a week, with the landlord hugging him in words. It raises the stakes; nothing in the episode links it to the board's decision (no board member watches it).",
        },
        "22.02": {
            "caption": "That night, home: the desk from above. His phone lights with a generic app prompt, How did the keynote go?, and the strip [super] [enthusiastic] [thrilled]. His thumb hovers: the one hover in the episode. thrilled is too much. enthusiastic is a lot. (V.O.) He taps the first.",
            "why": "The V.O. stays (one of the twelve: the episode's one line where the effort shows); the desk from above says he's home again.",
        },
    },
    # ------------------------------------------------------------------ ACT FOUR
    "act4": {
        "S1.12": {
            "est_s": 3.8,
            "jcut": [],
            "caption": "Over his shoulder onto the laptop. \"super.\" No score under the line; the suite's air holds it. In the laptop the four tiles are still frozen on his one bar of Wi-Fi. He picks up his phone.",
            "why": "The hold after \"super.\" stays (2.6 s); the fall to night moves to v32-S1.13, after his first move.",
            "fix": ["A4"],
        },
        "S4.09": {
            "caption": "INT. NOPEAI BOARDROOM — SUNDAY. The phones in a row, face up, still buzzing: STAFF · STAFF · INVESTORS · INVESTORS. On the wall screen, the lobby camera and the ticker. At reception, a small familiar figure in a GUEST lanyard, as if he's been there a while. On \"here\" he walks out.",
            "onscreen": {"drop": ["his post in the CCTV tile's corner (\"first and last time i ever wear one of these\"): it moves to his side, v32-S5.00, where he posts it"]},
            "fix": ["A4"],
            "why": "Told twice now: small on their camera here; his own move, and his post, on his side.",
        },
        "S4.15": {
            "jcut": [{"sound": "under Mada's held note, the lobby camera's CCTV hum (not the dark room's drone): the door into his side", "lead_s": 1.0}],
            "why": "Unchanged picture; the J-cut now leads into the lobby camera.",
        },
        "S5.02": {
            "caption": "The home shot: the glass on the dark-room desk, its water line flat, and the GUEST lanyard he put on in the lobby, laid square beside it. The room, held.",
            "why": "Unchanged picture; the lanyard now has the afternoon behind it.",
        },
        "S5.09": {
            "why": "Unchanged. v3-vo-21 stays (one of the twelve): his read of Gerg works again after the budget, while he makes the call.",
        },
        "S5.09b": {
            "est_s": 6.1,
            "drop": {"v3-vo-23": P_WHY + "Gerg waiting for his word pays Alyi's \"Gerg has never waited to be asked.\" (S3.05) on its own; the thought narrated the picture (and doubled Alyi's line, the newcomer's note)"},
            "retime": {"v31-a4-0011": "after:a5-29-18+1.0"},
            "fix": ["P", "A4"],
            "why": "\"So. Do I tell everyone to pack?\" A beat, the look held. \"keep building.\": his decision, on the look.",
        },
        "S5.11": {
            "est_s": 18.3,
            "caption": "The slate door steps up out of the shadow, Tasya's sign taped to it. \"Everyone is welcome.\" / \"everyone.\" / \"…a desk for every one of them.\" The crack of desks. \"and the rent?\" / \"Due on the first.\" Under the door a slate-blue badge slides into the light, MACROSOFT, and skids to a stop against his chair leg. Without getting up he picks it up, looks at it, and sets it on the desk beside the GUEST lanyard, square. He doesn't put it on.",
            "art": "kits/macrosoft-badge.ts sliding under the door and across the floor; Mas reaching down for it (a pose); the two badges side by side on the desk (they are S7.01's)",
            "sounds": "the badge's slide on the floor; a soft tick against the chair leg; the badge set down on the wood",
            "fix": ["A4"],
            "why": "He considers the offer with his hands: he takes the badge and doesn't wear it. It fits the record (by his own later post he had decided to join Macrosoft on Sunday evening, facts W5, held, not quoted), and \"leave it open.\" keeps both badges on the desk. S7.01's two badges now have an origin.",
        },
        "S7.01": {
            "why": "Unchanged. The two badges on his desk are the ones from the dark room (the lobby's GUEST, the door's MACROSOFT); his three hearts are his real act.",
        },
    },
    # ------------------------------------------------------------------ TAG
    "tag": {
        "32.03": {
            "est_s": 2.6,
            "drop": {"v3-vo-24": P_WHY + "\"it looks calmer than me.\": the cover and his face wear the same expression, and the Orb's slower verdict (32.04) makes the joke"},
            "fix": ["P"],
            "why": "He holds the cover up by his face; the Orb does the rest.",
        },
    },
}

NEW = {
    "coldopen": [],
    "act1": [
        {
            "id": "v32-7.03", "after": "7.02", "est_s": 7.2,
            "frame": "MCU · Mas at his end desk, the phone at his ear; the open tile's red glow under him",
            "set": "bullpen", "room": "bullpen", "chars": ["mas", "tasya"],
            "lines": [
                {"id": "v32-a1-0002", "who": "tasya", "text": "Mas.", "after": "start+1.5", "gap_s": 0.0,
                 "delivery": "warm, unhurried, as if he'd been expecting the call; one filtered ring before it",
                 "tag": "phone", "take": "new", "note": "[INVENTED]"},
                {"id": "v32-a1-0003", "who": "mas", "text": "it's the bill.", "after": "v32-a1-0002", "gap_s": 0.6,
                 "delivery": "plain; the same words he gave Rima, now a request",
                 "tag": "", "take": "reuse e1-a1-7-02 (the same line, the same take: what he told Rima he now tells the landlord)",
                 "note": "[INVENTED]"},
                {"id": "v32-a1-0004", "who": "tasya", "text": "I'll bring a pen.", "after": "v32-a1-0003", "gap_s": 0.5,
                 "delivery": "delighted, a host accepting an invitation",
                 "tag": "phone", "take": "new",
                 "note": "[INVENTED] the pen clipped to the check (9.04), the one Mas pockets and writes PLEASE with (12.04)"},
            ],
            "caption": "Later that night. Mas at his desk, the tile's red glow under him, the phone at his ear; on its lit screen by his cheek, the contact reads TASYA over a key-ring avatar. One filtered ring. \"Mas.\" / \"it's the bill.\" / \"I'll bring a pen.\" He lowers the phone; before it reaches the desk it lights red, and a siren whines through its small speaker.",
            "onscreen": {"add": ["TASYA (the phone's contact name, over a key-ring avatar)"]},
            "jcut": [{"sound": "the siren through the phone's small speaker (sc 8's J-cut, moved here from 7.02)", "lead_s": 0.8}],
            "music": "THE HEAT · the swing's bass pedal and the shimmer hold under the call; Tasya's Rhodes gives one soft chord on \"pen\" (his colour arriving before he does); the siren takes over",
            "art": "a new pose: Mas with the phone at his ear at his desk, lit red from below; the phone's contact screen (TASYA, a key-ring avatar); the phone lighting red as he lowers it (8.01's alert)",
            "sounds": "one ring through a phone filter; the hang-up tick; the siren's J-cut",
            "fix": ["A1", "A0", "N1"],
            "why": "Cause and effect: the bill is his problem, and he's the one who calls the landlord about it. The check that jams in the lobby door (9.01) is Tasya's answer, and the pen clipped to it is the one he promised. No terms, no figures, no motive: the investment is the record (facts #6); the call is a small invented action and reads as cartoon (the key-ring avatar, the pen).",
        },
    ],
    "act2": [],
    "act3": [
        {
            "id": "v32-21.06", "after": "21.05", "est_s": 2.0,
            "frame": "2S·SCR · Mas and the Orb, the monitor at frame right",
            "set": "darkroom", "room": "dark", "chars": ["mas"],
            "lines": [],
            "caption": "The deepfake is still clapping on the monitor. Mas reaches over and switches the monitor off. The glass goes black, and the clapping doesn't stop: it grows, and it's a hall's applause.",
            "lcut": [{"sound": "the clapping, swelling into DevDay's applause under the cut to the stage (22.01)"}],
            "music": "ACT THREE · the Water Line holds its note under the switch; the hall's applause takes the cut",
            "art": "his hand on the monitor's switch; the monitor going dark in one step (the room as it is)",
            "sounds": "the monitor's click-off; the clapping growing through the black glass into a hall",
            "fix": ["A3", "A0"],
            "why": "The act's turn, made visible: he stops watching. The next shot is him on a stage.",
        },
        {
            "id": "v32-22.04", "after": "22.03", "est_s": 5.0,
            "frame": "OTS · over Mas onto the monitor: the sign-up page; the rack beside him",
            "set": "darkroom", "room": "dark", "chars": ["mas"],
            "lines": [],
            "caption": "A week later. Over Mas's shoulder onto the monitor: the sign-up page, its counter spinning to a blur. Beside him the rack's LEDs step green, amber, red (launch night's heat, one step a beat). He types; his post goes up in its own UI: \"we are pausing new CHATGTP Plus sign-ups for a bit :(\". On the page, SIGN UP greys to NOTIFY ME. The Orb looks from the rack to him.",
            "onscreen": {"add": [
                "RAIL: NOV 14, 2023",
                "the sign-up page's counter (a blur, never a figure)",
                "SIGN UP → NOTIFY ME (the page's own button)",
                "MAS (post): \"we are pausing new CHATGTP Plus sign-ups for a bit :(\" [P · NOV 14, 2023, 7:10 PM PT · facts W3; its first sentence; the name swap only]",
            ]},
            "music": "ACT THREE · the Water Line thins to its pedal under the counter's chip notes; THE CLOCK's first step is the next bar (23.01)",
            "art": "the sign-up page UI (a counter blur; SIGN UP greying to NOTIFY ME); the rack's LEDs stepping green → amber → red (reuse the launch-night rack steps, 6.09); his post card (kits/post-card.ts, new text: masPause)",
            "sounds": "the counter's whirr (the odometer's chip notes on F, faster); the rack's fans up a step; his post's send pop; the button's grey-out tick",
            "fix": ["A3", "A0"],
            "why": "The stakes of his launch, and his next move: more people want in than his servers can hold (launch night's heat, back), and he's the one who shuts the door. A choice with a cost, in his own public words. The reminder arrives on the next bar; nothing links the two.",
        },
    ],
    "act4": [
        {
            "id": "v32-S1.13", "after": "S1.12", "est_s": 5.0,
            "frame": "ECU · his phone in his hand, the suite's afternoon light",
            "set": "office", "room": "suite", "chars": ["mas"],
            "lines": [],
            "caption": "His thumb types, unhurried. The post goes up in its own UI: \"i loved my time at nopeai. … will have more to say about what's next later. 🫡\" Then the room falls away in held palette steps to night (moved from S1.12).",
            "onscreen": {"add": ["MAS (post): \"i loved my time at nopeai. … will have more to say about what's next later. 🫡\" [P · NOV 17, 2023, 1:46 PM PT · facts W4; the middle sentences trimmed with a print ellipsis; the card's time 1:46 PM]"]},
            "jcut": [{"sound": "the dark room's drone, under the last palette step (moved from S1.12)", "lead_s": 0.6}],
            "music": "none: the suite's air; the drone comes up under the fall to night",
            "art": "his phone in the suite's daylight (kits/phone-*), the post card (kits/post-card.ts, new text: masLovedMyTime, timestamp NOV 17 · 1:46 PM); the palette-step fall to night, moved from S1.12",
            "sounds": "his thumb on the glass; his post's send pop",
            "fix": ["A4", "A0"],
            "why": "His first move after the blow, public and on the record: an hour and forty-six minutes after noon he writes it himself, and it ends on what's next. No inner voice (mas-inner-voice §5); no suggestion strip: these are his words.",
        },
        {
            "id": "v32-S5.00", "after": "S4.15", "est_s": 8.0,
            "frame": "CCTV → MCU · the lobby camera's frame, then down into colour at his shoulder",
            "set": "lobby", "room": "lobby", "chars": ["mas"],
            "lines": [],
            "caption": "The lobby camera's frame from the boardroom's wall screen fills the screen, grainy, its chrome NOPEAI HQ · LOBBY · NOV 19 and a clock, 1:03 PM: the small figure at reception. The picture steps down out of the camera, one palette step a beat, into full colour at floor level at his shoulder: MAS at the reception desk. A receptionist's hand (no face) slides a lanyard across the stone: GUEST. He puts it on himself. He lifts his phone at arm's length and takes the photo: a click, one white flash step. His post goes up in its own UI: \"first and last time i ever wear one of these\". He looks up, once, at the camera in the corner, the one-pixel smile.",
            "onscreen": {"add": [
                "NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM (the camera's own chrome, as in S4.09)",
                "GUEST (the lanyard: Radnus's design from Act One, 8.05)",
                "MAS (post): \"first and last time i ever wear one of these\" [P · NOV 19, 2023, 1:03 PM PT · L13; moved here from S4.09]",
            ]},
            "jcut": [
                {"sound": "the CCTV hum, under Mada's held note (S4.15)", "lead_s": 1.0},
                {"sound": "the dark room's drone, under his look up (into S5.02)", "lead_s": 0.8},
            ],
            "music": "none: the CCTV hum, then the lobby's room by day as the grade lifts; one felt note on his look up",
            "art": "S4.09's CCTV plate full frame, stepping out of its grade (grain off, colour up) in palette steps; the reception desk at floor level by day (rooms/lobby.ts, the S8 lobby); a receptionist's hand sliding the lanyard; Mas putting the lanyard on (a new pose); the selfie (arm out, the phone; one white flash step); the corner camera (a small prop, the one whose frame we saw)",
            "sounds": "the CCTV hum; the lobby by day; the lanyard's clip; the phone's shutter; his post's send pop",
            "fix": ["A4", "A0"],
            "why": "Told twice, like noon: the board watched a small figure in a guest badge; this is the same minute from inside it, and it's his move. He walks into his own company as a guest, puts the badge on himself and posts it. The talks that follow are theirs (S4.09: \"we're no closer\"); his side shows only what he did in public. His exit is the one their camera saw; the cut goes to 2 AM.",
        },
    ],
    "tag": [],
}


# ---------------------------------------------------------------------------------------------
# DRAFT 8.1 (2026-09-28): the calibration ledger (show/bible/calibration.md) and the v3.1 audit
# (../audit-v31.md), as an overlay on draft 8's spec above. Semantics, per beat:
#   drop / retime / onscreen.replace merge; add / onscreen.add / onscreen.drop / fix extend;
#   undrop restores a line draft 8 dropped; reset returns a beat to v3.1 (no draft 8 change);
#   any other key replaces draft 8's value; why81 is appended to the beat's why.
# NEW_OV edits draft 8's new beats (lines_replace swaps a new line by id); NEW81 adds beats.
# Fix codes added: C3 / C5 / C9 = calibration §3 (plates), §5 (the voice), §9 (agency);
# AUD #n = the audit's ranked fix n; AUD B.2 #n / B.3 = its out-of-the-blue and carried lists.
# ---------------------------------------------------------------------------------------------

def _plate(old, new):
    return {"replace": {old: new}}


OV = {
    "act1": {
        "5.03": {"onscreen": _plate("GERG MOCKBRAN", "GERG MOCKBRAN · CO-FOUNDER"), "fix": ["C3"],
                 "why81": "The first-appearance plate gets its one relation word (calibration §3)."},
        "5.04": {"onscreen": _plate("RIMA TAMURI", "RIMA TAMURI · CTO"), "fix": ["C3"],
                 "why81": "Plate: RIMA TAMURI · CTO (calibration §3)."},
        "5.05": {"onscreen": _plate("ALYI", "ALYI · CO-FOUNDER"), "fix": ["C3"],
                 "why": "unchanged in picture. Plate: ALYI · CO-FOUNDER (calibration §3; v4.2's reads found it worked)."},
        "9.04": {"est_s": 3.8,
                 "drop": {"v3-vo-08": "8.1 (AUD #7; the lead): the key count is a code a newcomer can't read at that size; the ring is shown large instead (v32-9.10k)"},
                 "caption": "FULL FREEZE: TASYA / THE LANDLORD · RUNS MACROSOFT. Tasya already in the lobby, the key ring at his belt. Mas keeps moving in the freeze: he walks to the jammed door and pockets the pen clipped to the check, the pen Tasya said he'd bring.",
                 "fix": ["AUD #7"],
                 "why": "The card is his first on-screen appearance and carries the relation (THE LANDLORD). The pen he pockets is the one promised on the phone; it writes PLEASE (12.04) and carves the third mark (S2.01)."},
        "9.09": {"sounds": "on \"That collar suits you.\", the key ring clinks once against the new collar",
                 "shot_note": "the key ring's clink against the collar, in picture: the collar reads as the landlord's (AUD B.2 #9)",
                 "fix": ["AUD B.2 #9"]},
        "9.10": {"est_s": 11.1,
                 "drop": {"e1-a1-9-09": "8.1 (AUD #5): an \"as you know\" line, Gerg telling Tasya his own product; rewritten as something Gerg wants (v32-a1-0005)"},
                 "add": [{"id": "v32-a1-0005", "who": "gerg", "text": "Elgoog's going to hear about this from a search box.",
                          "after": "start+2.6", "gap_s": 0.0,
                          "delivery": "delighted, eyes on the TV: his work, beating the rival in its own game",
                          "tag": "", "take": "new", "note": "[INVENTED] the new GNIB ran on the lab's model (facts #8)"}],
                 "retime": {"e1-a1-9-10": "after:v32-a1-0005+0.6"},
                 "onscreen": {"drop": ["RAIL: FEB 7, 2023"]},
                 "caption": "The same lobby, weeks on; the check scuffed grey on the floor. Mas at the desk with his glass; Gerg on the check's edge with his laptop. On the TV: GNIB's launch, a search box with a chat bubble inside it. \"Elgoog's going to hear about this from a search box.\" Tasya, delighted: \"Oh, yes. …I want people to know that we made them dance…\" Gerg grins at it (a listener who reacts: AUD #12).",
                 "fix": ["AUD #5", "AUD #12"],
                 "why": "The arrival (the time jump) moves to the key-ring insert before it; the talk is now two people wanting something from the TV."},
        "v31-10.03": {"est_s": 3.4,
                      "drop": {"v31-a1-0006": "8.1 (AUD A.2 #4): the turn limit explained to a chatbot; its first sentence stays (v32-a1-0006) and the timer's face carries the rule"},
                      "add": [{"id": "v32-a1-0006", "who": "tasya", "text": "House rules, Sydney.",
                               "after": "start+1.2", "gap_s": 0.0, "delivery": "warmly, to her, and for Mas",
                               "tag": "", "take": "cut from v31-a1-0006 (its first sentence)", "note": "[INVENTED] the Feb 17, 2023 five-turn cap (facts #9)"}],
                      "onscreen": {"add": ["5 QUESTIONS (the egg timer's own face)"]},
                      "fix": ["AUD A.2 #4"]},
        "8.03": {"onscreen": _plate("RADNUS · POLITELY ON FIRE", "RADNUS · RUNS ELGOOG · POLITELY ON FIRE"), "fix": ["C3"],
                 "why": "unchanged in picture. The gag plate gains its relation (calibration §3)."},
        "11.03": {"onscreen": _plate("MARIO", "MARIO · EX-NOPEAI"), "fix": ["C3"],
                  "why81": "Plate: MARIO · EX-NOPEAI, the one relation his cut V.O. carried (calibration §3; AUD A.1 'convert')."},
        "12.02": {"est_s": 7.8,
                  "retime": {"e1-a1-12-01": "start-0.5", "e1-a1-12-03": "after:v32-a1-0007+0.5"},
                  "jcut": [{"line": "e1-a1-12-01", "lead_s": 0.5, "note": "AUD #11: Nole's \"Great sign.\" leads the place change, under the letter becoming a clipboard"}],
                  "drop": {"e1-a1-12-02": "8.1 (AUD #5): an \"as you know\" line, the letter explained to one of its signers"},
                  "add": [{"id": "v32-a1-0007", "who": "oigneb", "text": "You signed it. Now put the iron down.",
                           "after": "e1-a1-12-01", "gap_s": 0.6,
                           "delivery": "gentle, precise, the PAUSE sign held higher; he wants the soldering iron put down",
                           "tag": "", "take": "new", "note": "[INVENTED] the letter's ask (six months) is on the clipboard"}],
                  "onscreen": {"add": ["6 MONTHS (the clipboard letter's own line, under PAUSE GIANT AI EXPERIMENTS) [V · facts #13]"],
                               "replace": {"NOLE · BUILDING HIS OWN": "NOLE · EARLY FUNDER · BUILDING HIS OWN"}},
                  "fix": ["AUD #5", "AUD #11", "C3"],
                  "why": "Nole's line pulls us into the room; Oigneb wants something from him (the iron down), and the six months sit on the clipboard."},
    },
    "act2": {
        "13.02": {"shot_note": "Mario's finger goes up on \"trained\": the catchphrase becomes the room's problem (AUD A.2 #4)", "fix": ["AUD A.2 #4"]},
        "13.10": {"frame": "MCU · Radnus's face and the flame on his collar together, growing one size",
                  "shot_note": "not an ECU: framed alone, the flame read as a burning note (AUD B.2 #8)", "fix": ["AUD B.2 #8"]},
        "14.03": {"est_s": 2.4,
                  "caption": "The building, its lit window: a silhouette with a phone (no face); the same clip plays on its screen; the silhouette nods on the audio's beat. In the same shot, its thumb presses the repost arrow under the ⚠ ALTERED AUDIO tag: click, ✓ REPOSTED.",
                  "fix": ["AUD B.2 #12"],
                  "why": "14.04 folds in: the lit-window stranger stays at 4.8 s with the hailstone and doesn't grow (AUD B.2 #12: keep it ≤ about 4 s)."},
        "14.04": {"action": "merge", "into": "14.03", "est_s": 0.0, "fix": ["AUD B.2 #12"],
                  "why": "The repost click folds into 14.03's shot."},
        "15.02": {"onscreen": _plate("LAHTNEMULB", "LAHTNEMULB · CHAIRMAN"), "fix": ["C3"]},
        "16.01": {"caption": "MATCH on the thunk: the tour poster, MAS MANALT: THE REGULATE-ME TOUR, its cities. LONDON's strip: \"…cease operating…\" and EU gets CANCELLED. His thumb comes into the corner of frame on his phone and posts \"…no plans to leave\" [H]; UN-CANCELLED lands over the stamp. The last date slot: his own hand stamps it, ADDED DUE TO POPULAR DEMAND. The frame holds on his one-pixel smile to the bar's end.",
                  "art": "his thumb on a phone entering the poster GFX's corner for the post; his hand and a rubber stamp for the last slot",
                  "fix": ["AUD B.3"]},
        "17.12": {"shot_note": "AUD #8: it read as a man floating in a tank (a head and a ring in the glass). Draw the reflection on the water's surface: his face only, broken by the crack, no body and no ring. Fallback: cut 17.12 and end the act on the sky's crack and his look down (17.11), −4.5 s.",
                  "fix": ["AUD #8"]},
    },
    "act3": {
        "v31-18.00": {"shot_note": "frame the two faint marks in the wood close enough to read as tally marks (AUD B.2 #4); the carve pays them in Act Four", "fix": ["AUD B.2 #4"]},
        "v31-18.00b": {"onscreen": {"replace": {"KRAM": "KRAM · RUNS ATEM"}},
                       "shot_note": "the thirteenth key, Atem blue, is hung large enough to read (it pays v32-9.10k's twelfth; AUD #7)",
                       "fix": ["C3", "AUD #7"]},
        "18.06": {"est_s": 7.2, "undrop": ["e1-a3-18-04"],
                  "retime": {"e1-a3-18-03": "after:e1-a3-18-04+1.0"},
                  "fix": ["C5"],
                  "why": "8.1 (calibration §5; the audit keeps it): \"i made it for everyone else.\" is restored. It's a line only the voice can do: he exempts himself from his own device a beat after its scan saw tokens. Then \"you can stay.\": he keeps his own witness."},
        "v31-19.03": {"caption": "One held room frame: Mas's two fingers, his pinky, the forum's tiled hands. REMUHCS: \"Every single person raised their hand.\" NOLE: \"It's important for us to have a referee.\" At the desk his hand is already up. He lowers it himself and turns straight to his keyboard: he is one hand among hundreds.",
                      "fix": ["AUD #2"],
                      "why81": "The Tidder post now comes out of this (AUD #2): one hand among hundreds, he turns to the keys. No reason is stated."},
        "20.01": {"caption": "Straight from the forum's raised hands: over Mas's shoulder onto a reply box on TIDDER. He types, in source casing: \"Agi has been achieved internally\"",
                  "fix": ["AUD #2"], "why": "The post follows the room (AUD #2); the show still plays no reason for it."},
        "20.02": {"action": "cut", "est_s": 0.0, "fix": ["AUD #2", "AUD B.2 #1"],
                  "why": "The LEDs stopping was an omen that never paid off (AUD B.2 #1); the Orb's long look at him (20.04) keeps the hint."},
        "20.06": {"caption": "Back on the two-shot, Gerg's tile small in the corner; on the monitor the counter keeps climbing, faster. \"Okay. That's patched.\" / \"how's the build?\" / \"Still running. I don't go to bed till it's green.\" / \"go to sleep, gerg.\" / \"When it compiles.\" His keys run on."},
        "v31-20.07": {"est_s": 4.0,
                      "drop": {"v31-vo-06": "8.1 (calibration §3, §5; AUD A.1 'convert'): a caption; the byline plate NELEH · NOPEAI BOARD carries it"},
                      "onscreen": {"replace": {"NELEH": "NELEH · NOPEAI BOARD"}},
                      "fix": ["C3", "C5"],
                      "why": "The board's seed is now in the world (her plate); he reads, says nothing, and the Orb reads him. His doing anything about the paper would sit at a contested moment (facts #36), so he doesn't."},
        "v31-20.08": {"caption": "Mas and the Orb, the paper soft on the monitor. He reads on; the Orb reads him. He closes the paper, and the monitor's next tab is the president's order, live.",
                      "fix": ["AUD B.2 #13"], "why": "A bridge by his hand into the order (AUD B.2 #13)."},
        "23.02": {"shot_note": "each hover shows its attendee's small avatar beside the name: Alyi's reflection, Neleh with the glowing page, Mada's face under his spinner, a black square. Mada gets a face before the blow (AUD B.2 #7)",
                  "fix": ["AUD B.2 #7"]},
    },
    "act4": {
        "S3.02": {"est_s": 1.6,
                  "drop": {"a5-27-06": "8.1 (AUD #6): the read-it-aloud device, used twice; Terb keeps his (he's in a room with people), Neleh's excuse goes"},
                  "caption": "Her desk from above: her pen ticks 1. NOON · VIDEO CALL and runs down what the fold hid: 2. BLOG POST · 3. INTERIM CEO · 4. ______, and stops on the blank.",
                  "fix": ["AUD #6"]},
        "S3.03": {"est_s": 9.0,
                  "drop": {"a5-27-07": "8.1 (AUD #6): the post types itself on screen in the source's words, and she reads it with her lips, silent"},
                  "retime": {"a5-27-08": "start+6.8"},
                  "caption": "Her laptop: the NopeAI blog in its own UI; the post types itself in the source's words, held to read: \"…he was not consistently candid in his communications with the board… The board no longer has confidence in his ability to continue leading NopeAI.\" Her lips move as she reads it. \"Any objections?\" Nobody answers. She clicks Post, on a tick.",
                  "onscreen": {"add": ["the post's text, typing in its own UI: \"…he was not consistently candid in his communications with the board… The board no longer has confidence in his ability to continue leading NopeAI.\" [V · NOV 17, 2023 · L8]"]},
                  "fix": ["AUD #6"],
                  "why": "The board's only public reason stays on screen, whole and verbatim; it's read, not recited."},
        "S3.04": {"est_s": 10.9,
                  "drop": {"a5-27-09": "8.1 (AUD #5): an \"as you know\" line (thanking Rima for what she agreed to); her tile's label carries the fact",
                           "a5-27-12": "8.1 (AUD #5): folded into Neleh's new line"},
                  "add": [{"id": "v32-a4-0001", "who": "neleh", "text": "Step three. Rima, the staff will come to you now.",
                           "after": "start+1.1", "gap_s": 0.0,
                           "delivery": "efficient, a little kind: she wants Rima ready, and on the post",
                           "tag": "call", "take": "new", "note": "[INVENTED] procedure only; no reason"}],
                  "retime": {"a5-27-13": "after:v32-a4-0001+0.5"},
                  "onscreen": {"add": ["RIMA TAMURI · INTERIM CEO (her tile's own label)"]},
                  "fix": ["AUD #5"],
                  "why": "Neleh wants something from Rima (ready, and on message); the tile's label says what Rima now is."},
        "S3.06": {"est_s": 2.6, "retime": {"a5-27-18": "start-0.6"},
                  "jcut": [{"line": "a5-27-18", "lead_s": 0.6, "note": "AUD #11: \"Is this a coup?\" leads the place change, over Neleh's brow"}],
                  "fix": ["AUD #11"]},
        "S4.02": {"shot_note": "on \"That is the company telling us.\" Alyi's reflection turns to the row of phones, their caller IDs beside him (AUD B.2 #6: the referent)",
                  "fix": ["AUD B.2 #6"]},
        "S4.08": {"onscreen": _plate("ADELINA", "ADELINA · CO-FOUNDER"),
                  "caption": "Act One's split, both calls in one held shot. LEFT: the speakerphone, Neleh and Mada leaning in. RIGHT: the lighthouse; a phone with a small throne attached; Mario picks up, finger rising. The offer; \"Eleven pages…\"; ADELINA takes the phone: \"In plain English: no.\" Click. HOLD on the dial tone; under it, the lobby's room by day comes up (the J-cut into v32-S5.00).",
                  "fix": ["C3"]},
        "S4.09": {"est_s": 11.3,
                  "drop": {"v31-a4-0004": "8.1 (AUD #5): the phones and the ticker show it; she said what we see"},
                  "retime": {"v31-a4-0005": "start+1.2"},
                  "caption": "INT. NOPEAI BOARDROOM — SUNDAY. The phones in a row, still buzzing: STAFF · STAFF · INVESTORS · INVESTORS. On the wall screen, the lobby camera and the ticker: the small figure we just left, in his GUEST lanyard. \"We've talked all day about him coming back, and we're no closer.\" / \"They gave him a guest badge.\" / \"It's the correct badge. He doesn't work here.\" On \"here\" he walks out.",
                  "fix": ["AUD #5", "AUD #3"],
                  "why": "Cause, then effect (AUD #3): his walk-in comes first (v32-S5.00), and their talk follows from it, played on the phones."},
        "S4.15": {"reset": True},
        "S5.03": {"shot_note": "the heart counter on the phone reads with him, 406 → 407 → 406, so the count is readable (AUD A.1)", "fix": ["AUD A.1"]},
        "S5.11": {"est_s": 15.6, "retime": {"a5-29-20": "start-0.8"},
                  "jcut": [{"line": "a5-29-20", "lead_s": 0.8, "note": "AUD #11: \"Don't get up, Mas.\" leads the cut, under Gerg's tile"}],
                  "fix": ["AUD #11"]},
        "S8.08": {"est_s": 5.8, "retime": {"a5-31-04": "start-1.0"},
                  "jcut": [{"line": "a5-31-04", "lead_s": 1.0, "note": "AUD #11: the memo's first words lead the cut, over the vault"}],
                  "fix": ["AUD #11"]},
    },
    "tag": {
        "v31-32.01d": {"drop": {"v31-vo-07": "8.1 (calibration §5; the lead): a caption; the stutter into stills carries the joke"},
                       "fix": ["C5"], "why": "Unchanged picture and length (the Runway insert's 233 frames); no voice-over over the stills."},
        "32.03": {"est_s": 3.8, "undrop": ["v3-vo-24"], "fix": ["C5"],
                  "why": "8.1 (calibration §5; the audit keeps it): \"it looks calmer than me.\" is restored. The picture shows the cover and his face alike; only the voice can say which one he thinks is performing. The coda line."},
    },
}

NEW_OV = {
    "v32-7.03": {
        "est_s": 9.0,
        "lines_replace": {"v32-a1-0003": {
            "id": "v32-a1-0003", "who": "mas", "text": "it's the bill. we're going to need more servers.",
            "after": "v32-a1-0002", "gap_s": 0.6,
            "delivery": "plain, a full ask (calibration §9: full sentences when he asks); the first three words the same as to Rima",
            "tag": "", "take": "new (8.1: a full sentence replaces the reuse of e1-a1-7-02)", "note": "[INVENTED]"}},
        "onscreen": {"add": ["TASYA · MACROSOFT (the phone's contact name, over a key-ring avatar; replaces TASYA)"]},
        "caption": "Later that night. Mas at his desk, the tile's red glow under him, the phone at his ear; on its lit screen by his cheek, the contact reads TASYA · MACROSOFT over a key-ring avatar. One filtered ring. \"Mas.\" / \"it's the bill. we're going to need more servers.\" / \"I'll bring a pen.\" He lowers the phone; before it reaches the desk it lights red, and a siren whines through its small speaker.",
        "fix": ["C9", "C3"],
    },
    "v32-S5.00": {
        "after": "S4.08",
        "est_s": 8.0,
        "frame": "MCU → CCTV · at his shoulder in the lobby by day, then out into their camera's frame",
        "caption": "Sunday, 1:03 PM. Full colour at floor level, at his shoulder: MAS at the reception desk. A receptionist's hand (no face) slides a lanyard across the stone: GUEST. He puts it on himself. He lifts his phone at arm's length and takes the photo: a click, one white flash step. His post goes up in its own UI: \"first and last time i ever wear one of these\". He looks up, once, at the camera in the corner, the one-pixel smile; and the picture steps back out into that camera's frame, grainy, NOPEAI HQ · LOBBY · NOV 19, on the boardroom's wall screen (S4.09).",
        "onscreen": {"add": ["RAIL: NOV 19, 2023 · ~1 PM PT"]},
        "jcut": [{"sound": "the lobby's room by day (the revolving door's sweep), under S4.08's dial tone", "lead_s": 0.8}],
        "lcut": [{"sound": "the CCTV hum, carried into S4.09 as the picture steps into the camera's grade"}],
        "music": "none: the lobby's room; one felt note on his look up; PROCEDURE resumes under S4.09",
        "fix": ["A4", "A0", "AUD #3"],
        "why": "His move first, their reaction second (AUD #3; calibration's chain test): he walks into his own company as a guest and posts it, and the next scene is the board watching that small figure and talking all day about him coming back. It's told twice in one cut: his side, then their camera. It also breaks the 3:37 away from him into two stretches. His side of the act still opens at 2 AM on the count.",
    },
}

NEW81 = {
    "act1": [
        {
            "id": "v32-9.10k", "after": "9.09", "est_s": 1.6,
            "frame": "ECU · Tasya's key ring at his belt, large for the first time",
            "set": "lobby", "room": "lobby", "chars": ["tasya"], "lines": [],
            "caption": "Weeks on. The key ring at Tasya's belt, big in frame: eleven keys, and a twelfth, new, in NopeAI beige, stamped NOPEAI. It jangles as he turns toward the TV.",
            "onscreen": {"add": ["RAIL: FEB 7, 2023", "NOPEAI (stamped on the twelfth key)"]},
            "music": "LOBBY · the caper's new phrase comes in on the jangle",
            "art": "the key ring at insert scale (the kit's ring, redrawn large): eleven keys and a beige twelfth stamped NOPEAI",
            "sounds": "the ring's jangle, on the offbeat",
            "fix": ["AUD #7"],
            "why": "The key count, readable without a voice (AUD #7): the landlord now carries a key to NopeAI. It tells the time jump, pays the collar, and sets up the thirteenth key (Act Three) and the jangles in Act Four.",
        },
    ],
}


def _apply_81():
    for seg, beats in OV.items():
        ch = CHANGES.setdefault(seg, {})
        for bid, o in beats.items():
            if o.get("reset"):
                ch.pop(bid, None)
                continue
            c = ch.setdefault(bid, {})
            for k, v in o.items():
                if k == "undrop":
                    for lid in v:
                        c.get("drop", {}).pop(lid, None)
                elif k in ("drop", "retime"):
                    c.setdefault(k, {}).update(v)
                elif k == "add":
                    c.setdefault("add", []).extend(v)
                elif k == "fix":
                    c["fix"] = list(dict.fromkeys(c.get("fix", []) + v))
                elif k == "onscreen":
                    os_ = c.setdefault("onscreen", {})
                    for kk, vv in v.items():
                        if kk == "replace":
                            os_.setdefault("replace", {}).update(vv)
                        else:
                            os_.setdefault(kk, []).extend(vv)
                elif k == "why81":
                    c["why"] = (c.get("why", "unchanged") + " Draft 8.1: " + v).strip()
                else:
                    c[k] = v
    new_by_id = {n["id"]: n for seg in NEW for n in NEW[seg]}
    for nid, o in NEW_OV.items():
        n = new_by_id[nid]
        for k, v in o.items():
            if k == "lines_replace":
                n["lines"] = [v.get(l["id"], l) for l in n["lines"]]
            elif k == "onscreen":
                os_ = n.setdefault("onscreen", {})
                for kk, vv in v.items():
                    os_.setdefault(kk, []).extend(vv)
            elif k == "fix":
                n["fix"] = list(dict.fromkeys(n.get("fix", []) + v))
            else:
                n[k] = v
    for seg, beats in NEW81.items():
        NEW[seg].extend(beats)


_apply_81()


# ---------------------------------------------------------------------------------------------
# The builder
# ---------------------------------------------------------------------------------------------

def fail(msg):
    print("SPEC ERROR:", msg)
    sys.exit(1)


def load(seg):
    with open(LOCK.format(seg=seg)) as f:
        tl = json.load(f)
    v31 = {}
    p = V31PLAN.format(seg=seg)
    if os.path.exists(p):
        with open(p) as f:
            v31 = {b["id"]: b for b in json.load(f)["beats"]}
    return tl, v31


def is_vo(line):
    return line.get("tag") == "V.O."


def default_music(b, v31):
    if b["id"] in v31 and v31[b["id"]].get("music"):
        m = v31[b["id"]]["music"]
        return m if m.endswith("unchanged") else m
    for c in b.get("cues", []):
        if c.startswith("music"):
            return c
    return ""


def build(seg):
    tl, v31 = load(seg)
    beats = tl["beats"]
    by_id = {b["id"]: b for b in beats}
    ch = CHANGES[seg]
    new = NEW[seg]
    for bid in ch:
        if bid not in by_id:
            fail(f"{seg}: CHANGES names {bid}, not in the v3.1 lock")

    # ---- order
    order = [b["id"] for b in beats if "moved_after" not in ch.get(b["id"], {})]
    inserts = [(c["moved_after"], bid, "moved") for bid, c in ch.items() if "moved_after" in c]
    inserts += [(n["after"], n["id"], "new") for n in new]
    pending = list(inserts)
    guard = 0
    while pending:
        guard += 1
        if guard > 100:
            fail(f"{seg}: unresolvable anchors {pending}")
        anchor, bid, kind = pending.pop(0)
        if anchor in order:
            order.insert(order.index(anchor) + 1, bid)
        else:
            pending.append((anchor, bid, kind))
    if len(order) != len(set(order)):
        fail(f"{seg}: duplicate ids in order")
    for b in beats:
        if order.count(b["id"]) != 1:
            fail(f"{seg}: v3.1 beat {b['id']} appears {order.count(b['id'])} times")

    # ---- moved lines bookkeeping
    moved_out = {}
    for bid, c in ch.items():
        for lid, to in c.get("move_out", {}).items():
            moved_out[(bid, lid)] = to
    for bid, c in ch.items():
        for m in c.get("move_in", []):
            if moved_out.get((m["from"], m["id"])) != bid:
                fail(f"{seg}: {m['id']} moved into {bid} but not moved out of {m['from']}")

    new_ids = {n["id"] for n in new}
    out = []
    for bid in order:
        if bid in new_ids:
            n = next(x for x in new if x["id"] == bid)
            entry = {"id": n["id"], "action": "new", "after": n["after"], "est_s": n["est_s"]}
            for k in ("frame", "set", "room", "chars"):
                entry[k] = n[k]
            present = set()
            lines = []
            for l in n["lines"]:
                lines.append(dict({"id": l["id"], "new": True}, **{k: v for k, v in l.items() if k != "id"}))
                present.add(l["id"])
            for l in n["lines"]:
                a = l["after"]
                if not re.match(r"^start[+-][0-9.]+$", a) and a not in present:
                    fail(f"{seg}: {l['id']} after {a}: not in {bid}")
            entry["lines"] = lines
            for k in ("caption", "onscreen", "jcut", "lcut", "music", "art", "sounds", "fix", "why"):
                if k in n:
                    entry[k] = n[k]
            out.append(entry)
            continue

        b = by_id[bid]
        c = ch.get(bid, {})
        entry = {"id": bid, "action": c.get("action", "keep")}
        entry["est_s"] = round(c.get("est_s", b["reelDur"]), 3)
        if "moved_after" in c:
            entry["moved"] = {"from": f"after {order[order.index(bid) - 1] if False else _prev_in_lock(beats, bid)} (v3.1)",
                              "to": f"after {c['moved_after']}"}
        if "frame" in c:
            entry["frame"] = c["frame"]
        entry["music"] = c.get("music", default_music(b, v31))
        if "into" in c:
            entry["into"] = c["into"]
        for k in ("caption", "onscreen", "jcut", "lcut", "art", "sounds", "shot_note", "device"):
            if k in c:
                entry[k] = c[k]
        entry["fix"] = c.get("fix", [])
        entry["why"] = c.get("why", "unchanged")
        entry["src_s"] = round(b["reelDur"], 3)
        entry["src_frame"] = b.get("frame", "")

        tl_ids = [l["id"] for l in b.get("lines", [])]
        for lid in list(c.get("drop", {})) + list(c.get("retime", {})) + list(c.get("move_out", {})):
            if lid not in tl_ids:
                fail(f"{seg}: {bid} names line {lid}, not in the beat")
        lines = []
        present = set()
        for l in b.get("lines", []):
            lid = l["id"]
            if lid in c.get("drop", {}):
                lines.append({"id": lid, "keep": False, "who": l["who"], "text": l["text"],
                              **({"vo": True} if is_vo(l) else {}), "why": c["drop"][lid]})
            elif lid in c.get("move_out", {}):
                lines.append({"id": lid, "keep": False, "who": l["who"], "text": l["text"],
                              "moves_to": c["move_out"][lid], "why": f"moves to {c['move_out'][lid]}"})
            else:
                e = {"id": lid, "keep": True}
                if is_vo(l):
                    e["vo"] = True
                if lid in c.get("retime", {}):
                    e["at"] = c["retime"][lid]
                lines.append(e)
                present.add(lid)
        for m in c.get("move_in", []):
            src = next(l for l in by_id[m["from"]]["lines"] if l["id"] == m["id"])
            lines.append({"id": m["id"], "moved_from": m["from"], "who": src["who"], "text": src["text"],
                          "at": m["at"], "note": m.get("note", "")})
            present.add(m["id"])
        for l in c.get("add", []):
            present.add(l["id"])
        for l in c.get("add", []):
            a = l["after"]
            if not re.match(r"^start[+-][0-9.]+$", a) and a not in present:
                fail(f"{seg}: {l['id']} after {a}: not in {bid}")
            lines.append(dict({"id": l["id"], "new": True}, **{k: v for k, v in l.items() if k != "id"}))
        for lid, at in c.get("retime", {}).items():
            m = re.match(r"^after:(.+)\+[0-9.]+$", at)
            if m and m.group(1) not in present:
                fail(f"{seg}: {bid} retimes {lid} after {m.group(1)}, not present")
        entry["lines"] = lines
        out.append(entry)

    src_total = round(sum(b["reelDur"] for b in beats), 2)
    est_total = round(sum(e["est_s"] for e in out if e["action"] in ("keep", "new")), 2)
    plan = {
        "segment": seg,
        "source": f"show/reel/ep01-v31/ep01-v31-{seg}.json",
        "_about": ABOUT,
        "story_s": {"source": src_total, "estimate": est_total},
        "beats": out,
    }
    return plan, tl


def _prev_in_lock(beats, bid):
    ids = [b["id"] for b in beats]
    i = ids.index(bid)
    return ids[i - 1] if i else "(start)"


def fmt(s):
    m, sec = divmod(s, 60)
    return f"{int(m)}:{sec:04.1f}"


def main():
    write = "--write" in sys.argv
    all_ids = set()
    totals = []
    vo_kept = []
    vo_cut = []
    takes = []
    for seg in SEGS:
        plan, tl = build(seg)
        for e in plan["beats"]:
            if e["action"] == "new":
                if e["id"] in all_ids:
                    fail(f"duplicate beat id {e['id']}")
                all_ids.add(e["id"])
            for l in e.get("lines", []):
                if l.get("new"):
                    if l["id"] in all_ids:
                        fail(f"duplicate line id {l['id']}")
                    all_ids.add(l["id"])
                    takes.append((seg, l["id"], l["who"], l["text"], l.get("take", "")))
        # V.O. roster, in order
        tlb = {b["id"]: b for b in tl["beats"]}
        for e in plan["beats"]:
            for l in e.get("lines", []):
                if l.get("vo"):
                    src = next(x for x in tlb[e["id"]]["lines"] if x["id"] == l["id"])
                    (vo_kept if l.get("keep") else vo_cut).append((seg, e["id"], l["id"], src["text"]))
        totals.append((seg, plan["story_s"]["source"], plan["story_s"]["estimate"]))
        if write:
            p = os.path.join(HERE, f"{seg}.json")
            with open(p, "w") as f:
                json.dump(plan, f, indent=1, ensure_ascii=False)
                f.write("\n")
    print("== runtime (story; v3.1 lock -> v3.2 estimate)")
    s0 = s1 = 0
    for seg, a, b in totals:
        s0 += a
        s1 += b
        print(f"  {seg:<9} {fmt(a):>7} -> {fmt(b):>7}  ({b - a:+.1f} s)")
    print(f"  {'story':<9} {fmt(s0):>7} -> {fmt(s1):>7}  ({s1 - s0:+.1f} s)")
    words = sum(len(t.split()) for *_, t in vo_kept)
    print(f"== V.O. kept: {len(vo_kept)} lines, {words} words")
    for seg, bid, lid, t in vo_kept:
        print(f"  {seg:<6} {bid:<10} {lid:<12} {t}")
    print(f"== V.O. cut: {len(vo_cut)}")
    for seg, bid, lid, t in vo_cut:
        print(f"  {seg:<6} {bid:<10} {lid:<12} {t}")
    print(f"== new or changed lines (takes): {len(takes)}")
    for seg, lid, who, t, tk in takes:
        print(f"  {seg:<6} {lid:<12} {who:<8} {t:<70} | {tk}")
    print("written" if write else "(dry run; --write to write the JSON)")


if __name__ == "__main__":
    main()
