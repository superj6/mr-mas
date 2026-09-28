"""The v3.4 spec (script draft 8.3: Mas the planner, the mastermind by foresight; PLAN §7 and SHOWRUNNER-NOTES 000),
as deltas on the v3.3 LOCK (show/reel/ep01-v33/ep01-v33-<seg>.json). Imported by _build_v34.py; edit here and re-run.

Fix codes: A = the planner voice (PLAN §7 A; note 000), MM = the mastermind layer (the showrunner's update), B = one
deepfake (PLAN §7 B), C = the duck, cut (the showrunner's update), G = guardrails §2a rule 3 (the balance consequence of B).
New V.O. lengths come from the recorded takes (audio/ep01/v34/<seg>/lines.json) when they exist: vo_len(id, fallback).
"""
import json
import os

_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))


def vo_len(vid, fallback):
    """the audible length of a recorded v3.4 V.O. take (audible_out - audible_in), or the fallback estimate"""
    for seg in ("act1", "act2", "act3", "act4", "tag"):
        p = os.path.join(_ROOT, "audio/ep01/v34", seg, "lines.json")
        if os.path.exists(p):
            for r in json.load(open(p)):
                if r["id"] == vid:
                    return round(r["pace"]["audible_out_s"] - r["pace"]["audible_in_s"], 2)
    return fallback


VO_TAKES = {  # restored inner-voice takes on file
    "v3-vo-10": ("audio/ep01/v3/act1/wav/v3-vo-10.wav", "audio/ep01/v3/act1/lines-v3.json"),
}

# The eleven new V.O. lines: id -> (segment, beat, text, spoken_as, delivery, kind)
G = "[gerg](/ɡˈɜɹɡ/)"
NEW_VO = {
    # draft 8.3 after the "nothing on the nose" note: small, practical thoughts that read as ordinary the first time and
    # as foresight on a rewatch; no "plan" words, no thesis (mas-inner-voice §8, with the on-the-nose check)
    "v34-vo-01": ("act1", "5.04", "she's right. it will break. it goes out tonight anyway.",
                  "she's right.{0.35} it will break.{0.4} it goes out tonight anyway.",
                  "level, certain, to himself: the decision, not a speech", "gap + decision (ship first, unsaid)"),
    "v34-vo-02": ("act1", "7.01", "mostly the bill. we can't buy that many servers. someone can.",
                  "mostly the bill.{0.4} we can't buy that many servers.{0.4} someone can.",
                  "the gap, then the arithmetic; \"someone can.\" lighter, already reaching for the phone", "gap + a practical thought (the landlord, unnamed)"),
    "v34-vo-04": ("act2", "13.13", "mine's half written.",
                  "mine's half written.",
                  "dry, almost private, as Nedib says \"put it in writing\"", "a practical thought (the ask in his pocket, paid at the Senate)"),
    "v34-vo-05": ("act3", "18.02", "my other company. for when it gets harder to tell.",
                  "my other company.{0.5} for when it gets harder to tell.",
                  "reading his own label; plain", "a practical thought (proof of personhood, unsaid)"),
    "v34-vo-06": ("act3", "22.01", "a year ago, forty users and a nice thread.",
                  "a year ago,{0.2} forty users and a nice thread.",
                  "on his own stage under the applause; quiet, remembering Gerg's forecast exactly", "a memory that reads as foresight on a rewatch"),
    "v34-vo-07": ("act4", "S1.02", "gerg's not on it. probably the budget. good. i'll ask for more compute.",
                  f"{G}'s not on it.{{0.3}} probably the budget.{{0.3}} good.{{0.3}} i'll ask for more compute.",
                  "planning right into it: brisk, pleased, the pointer beside JOIN", "the one wrong read"),
    "v34-vo-09": ("act4", "S5.09", "gerg walked out for me.",
                  f"{G} walked out for me.",
                  "as he clicks GERG; warm, flat", "a read (paid by \"gerg comes back too.\")"),
    "v34-vo-11": ("act4", "S8.04", "they had four votes. i had the landlord. the money. gerg.",
                  "they had four votes.{0.45} i had the landlord.{0.3} the money.{0.3} [gerg](/ɡˈɜɹɡ/).",
                  "on the firing's drawing, now with a voice: a count, quiet and exact, not a boast", "the return's tally (what he'd put in place, stated as a count)"),
}


def vo(vid, after, gap, note=""):
    seg, bid, text, say, delivery, kind = NEW_VO[vid]
    return {"id": vid, "who": "mas", "vo": True, "tag": "V.O.", "text": text, "after": after, "gap_s": gap,
            "delivery": delivery, "kind": kind, "take": "new (V.O.: am_michael · a-michael-close · vo-close, audio/ep01/v34)",
            "note": note or "[INVENTED · V.O. · draft 8.3, the planner voice]"}


L = vo_len
CHANGES = {
    "coldopen": {},
    # ------------------------------------------------------------------ ACT ONE
    "act1": {
        "5.03": {"est_s": 9.72,
                 "drop": {"v3-vo-02": "A: a prediction of the next five seconds (note 000); the third underline plays unannounced"},
                 "retime": {"e1-a1-5-03": "after:e1-a1-5-02+0.5"}, "fix": ["A"],
                 "why": "The prediction goes; Gerg answers Rima on the beat."},
        "5.04": {"est_s": round(28.96 + L("v34-vo-01", 4.6) - 3.17 + 0.3, 2),
                 "drop": {"v3-vo-03": "A: replaced by v34-vo-01 (\"i don't know which part yet\" becomes the plan)"},
                 "add": [vo("v34-vo-01", "e1-a1-5-06", 0.5)],
                 "retime": {"e1-a1-5-07": "after:v34-vo-01+0.8"}, "fix": ["A", "MM"],
                 "why": "She's right, and it goes out tonight anyway: the decision, unexplained. Aloud, \"it's a preview.\""},
        "7.01": {"est_s": round(7.22 + L("v34-vo-02", 4.4) - 1.11, 2),
                 "drop": {"v3-vo-07": "A: replaced by v34-vo-02 (\"mostly the bill.\" stays as its first words)"},
                 "add": [vo("v34-vo-02", "e1-a1-7-02", 0.4)], "fix": ["A", "MM"],
                 "why": "The gap, then a practical thought: someone can buy that many servers. The call to the landlord (v32-7.03) follows from it."},
        "11.03": {"est_s": 13.59,
                  "restore": [{"id": "v3-vo-10", "who": "mas", "vo": True, "tag": "V.O.",
                               "text": "mario used to sit where gerg sits. he left to build a careful one.",
                               "after": "start+0.8", "gap_s": 0.0, "kind": "read (the rival)",
                               "note": "A: restored at the showrunner's ask (note 000), the v3 take unchanged"}],
                  "retime": {"e1-a1-11-01": "after:v3-vo-10+0.5"},
                  "onscreen": {"replace": {"MARIO · EX-NOPEAI": "MARIO"}}, "fix": ["A"],
                  "why": "The showrunner liked it: who Mario is to him, in his voice. The plate goes back to his name alone (the line carries the relation)."},
    },
    # ------------------------------------------------------------------ ACT TWO
    "act2": {
        "13.13": {"est_s": round(5.98 + 0.4 + L("v34-vo-04", 1.4) + 0.5 - (4.57 - 3.57), 2),
                  "add": [vo("v34-vo-04", "v31-a2-0001", 0.4, "[INVENTED · V.O. · an invented beat at a real meeting, never the hearing: the half-written PLEASE sheet in his pocket (12.06), finished and handed over at the Senate (15.15)]")],
                  "retime": {"v31-a2-0002": "after:v34-vo-04+0.5"}, "fix": ["A", "MM"],
                  "why": "Nedib wants promises in writing; his is already half written. On a rewatch, the Senate is where he finishes it. It replaces \"he's not wrong.\"."},
        "13.02": {"est_s": 1.6,
                  "drop": {"e1-a2-13-01": "G: with both deepfake halves of the balance pair cut (B), this invented line was the episode's one remaining invented roast of one party's official (guardrails §2a rule 3). See script-v34-notes §3.2"},
                  "caption": "SIRRAH, the pointer landing on each block, A, then I; the card follows.", "fix": ["G"],
                  "why": "Her card, her blocks and her class photo stay; the invented catchphrase goes, for balance."},
        "13.09": {"est_s": 14.67,
                  "drop": {"v3-vo-12": "A: a reaction line; the plan line moves to 13.01 (PLAN §7: it replaces \"he's not wrong.\")"},
                  "retime": {"e1-a2-13-12": "after:e1-a2-13-11+0.9"}, "fix": ["A"]},
        "13.12": {"onscreen": {"drop": ["DEEPFAKES OF ME: SEEN 0"]}, "fix": ["B"],
                  "why": "Nedib's card loses the stat that set up the cut deepfake."},
        "14.01": {"est_s": 4.0,
                  "caption": "The match cut: the print in his hand becomes his phone at the dark bullpen window, his glass on the sill. His feed opens on CLASS PHOTO #1, hearts under it: his face, everywhere. Beyond the glass, the cold open's skyline, the one lit window. The phone's glow on his face; then black, and a smooth voice over it (14.06).",
                  "onscreen": {"drop": ["RAIL: MAY 12, 2023", "NEWS CLIP · ⚠ ALTERED AUDIO"]}, "fix": ["B"],
                  "why": "B: the altered anchor clip and its repost go (one deepfake in the episode, the Senate's). The bridge stays: the photo on his phone that night, then the voice over black."},
        "14.03": {"action": "cut", "est_s": 0.0, "fix": ["B"], "why": "B: the repost of the altered clip."},
        "14.05": {"action": "cut", "est_s": 0.0, "fix": ["B"], "why": "B: the hailstone that answered the repost; the lit window stays in 14.01's background."},
    },
    # ------------------------------------------------------------------ ACT THREE
    "act3": {
        "18.02": {"est_s": round(max(3.2, 0.4 + L("v34-vo-05", 4.4) + 0.5), 2),
                  "add": [vo("v34-vo-05", "start+0.4", 0.0)], "fix": ["A", "MM"],
                  "why": "What CO-FOUNDER is for, hinted (the v3.2 newcomer: never explained): the label says PROOF YOU'RE HUMAN; he thinks of later."},
        "18.06": {"est_s": 5.7,
                  "drop": {"e1-a3-18-04": "A: replaced by the plan at 18.02 (PLAN §7)"},
                  "retime": {"e1-a3-18-03": "start+2.2"}, "fix": ["A"]},
        "21.02": {"est_s": 8.3,
                  "drop": {"e1-a3-21-02": "B: the deepfake Nedib goes; the order's one line stays because it pays his rules-room plan"},
                  "caption": "The signing desk on the monitor: NEDIB with his fountain pen over an order that runs off both ends of a very big desk. \"Here's the deal, folks. This order says if you build the big ones, you test them, and you show us the results.\"",
                  "fix": ["B"], "why": "The rules he wanted to be in the room for, written down."},
        "21.03": {"action": "cut", "est_s": 0.0, "fix": ["B"], "why": "B: \"When the hell did I say that?\" and the second NEDIB."},
        "21.04": {"action": "cut", "est_s": 0.0, "fix": ["B"], "why": "B: \"which one's real?\" and the Orb's verdict on the two NEDIBs."},
        "21.05": {"caption": "NEDIB signs, in ink, and the room on the monitor applauds. The applause carries into the dark room.",
                  "fix": ["B"]},
        "v32-21.06": {"caption": "Mas and the Orb, the order's applause on the monitor. He reaches over and switches it off. The glass goes black, and the applause doesn't stop: it grows into a hall's.",
                      "fix": ["B"]},
        "22.01": {"est_s": round(10.9 + (1.8 + L("v34-vo-06", 3.0) + 0.6) - 2.0, 2),
                  "add": [vo("v34-vo-06", "start+1.8", 0.0)],
                  "retime": {"v32-a3-0001": "after:v34-vo-06+0.6"}, "fix": ["A", "MM"],
                  "why": "Gerg's launch-night forecast, remembered exactly, under the applause for a hundred million a week. On a rewatch he never meant forty users. Then he tells the hall they can build their own."},
    },
    # ------------------------------------------------------------------ ACT FOUR
    "act4": {
        "S1.02": {"est_s": round(max(7.0, 1.2 + L("v34-vo-07", 5.2) + 1.0), 2),
                  "drop": {"v3-vo-18": "A: replaced by v34-vo-07 (the wrong read, now a plan that walks into it)"},
                  "add": [vo("v34-vo-07", "start+1.2", 0.0)], "fix": ["A"],
                  "why": "He's directing events right up to the call: he reads it as the budget and plans to ask for more. From the click to \"super.\", silence."},
        "S5.09": {"est_s": round(14.87 + L("v34-vo-09", 4.0) - 2.24, 2),
                  "drop": {"v3-vo-21": "A: a prediction of Gerg's next line (note 000)"},
                  "add": [vo("v34-vo-09", "start+0.3", 0.0)],
                  "retime": {"a5-29-03": "after:v34-vo-09+0.5"}, "fix": ["A"],
                  "why": "Who Gerg is to him, as he calls him; \"gerg comes back too.\" pays it on Tuesday. Nothing about the staff or the letter."},
        "S8.04": {"est_s": round(0.4 + L("v34-vo-11", 5.4) + 0.8, 2),
                  "add": [vo("v34-vo-11", "start+0.4", 0.0, "[INVENTED · V.O. · the mastermind's payoff: foresight and arrangement, never a secret act; nothing about the staff letter or the firing's reasons]")],
                  "fix": ["MM"],
                  "why": "The firing's drawing again, and this time we hear him, counting: their four votes against what he'd put in place (the landlord he called, the money, Gerg). Then \"okay.\" No staff, no letter, no reason for the firing."},
    },
    # ------------------------------------------------------------------ TAG
    "tag": {
        "32.01": {"est_s": 3.2,
                  "caption": "Mas and the Orb at the desk, three marks in the wood now. The monitor behind them is dark.",
                  "onscreen": {"drop": ["RAIL: DEC 6, 2023"]}, "fix": ["C"],
                  "why": "C: the duck is cut; the tag arrives on the room."},
        "v31-32.01d": {"action": "cut", "est_s": 0.0, "fix": ["C"],
                       "why": "C (the showrunner): the Elgoog demo film, the Runway insert and \"What the quack!\" are cut."},
        "32.02": {"onscreen": {"add": ["RAIL: DEC 6, 2023"]}, "fix": ["C"], "why": "The rail moves onto the cover's delivery."},
        "32.04": {"shot_note": "C: the monitor behind is dark: no demo, no frozen duck.", "fix": ["C"]},
        "33.01": {"shot_note": "C: the monitor behind is dark: no frozen duck.", "fix": ["C"]},
    },
}

NEW = {s: [] for s in ("coldopen", "act1", "act2", "act3", "act4", "tag")}
