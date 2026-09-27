#!/usr/bin/env python
"""cast_pass2.py - MR. MAS voice casting, pass 2: a stock Kokoro voice for every Ep1 speaker who had none.

Pass 1 (cast.py, CASTING.md sections 1-3) cast the ten leads; Act Four (cast_a4.py) cast seven more. This pass casts the
fifteen remaining Ep1 speaking parts and derives three more (THE CLONE, DEEPFAKE NEDIB, DEEPFAKE NEDIB #2). House rules
(CASTING.md section 0) hold: stock Kokoro-82M American-English packs or weighted averages of them, never a clone,
never an impression; briefs from the persona and the comic function; neutral General American (lang 'a'), no accent
play; no age, health or disability coding (this binds NEDIB above all: normal pace, clean phonation, steady pitch);
product voices (SYDNEY, CHATGTP, CLOD) resemble no real product's voice: the packs named after one provider's TTS
voices (af_alloy, af_nova, am_echo, am_onyx) are kept off the product parts.

Each candidate reads the character's own Ep1 lines with the fastrec house method (one whole read, dry, the
production chain, room-tone handles, -16 LUFS): audio/ep01/act4/dialogue/tools/fastrec/house.py.

  PY=audio/.venv-casting/bin/python
  HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py render --work <scratch dir> [--procs 3] [slug ...]
  HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py report --work <scratch dir>     # tables + separation checks
  HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py finalize --work <scratch dir>   # PICKS -> cast.json + auditions

render writes candidate WAVs and measure.json into --work (scratch: nothing is kept in the project). finalize writes
the picks into audio/voices/cast.json (voices, labels, bands) and one audition MP3 per pick into
audio/voices/<slug>/<cand>-audition.mp3: the character's Ep1 lines back to back, 0.4 s apart, through the scene's
device where it has one. Measured, not heard: F0 (pYIN), pace, ASR (faster-whisper small.en, beam 5).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../.."))
FAST = os.path.join(REPO, "audio/ep01/act4/dialogue/tools/fastrec")
CAST_JSON = os.path.join(REPO, "audio/voices/cast.json")
GRADE = {"af_heart": "A", "af_alloy": "C", "af_aoede": "C+", "af_bella": "A-", "af_jessica": "D", "af_kore": "C+",
         "af_nicole": "B-", "af_nova": "C", "af_river": "D", "af_sarah": "C+", "af_sky": "C-", "am_adam": "F+",
         "am_echo": "D", "am_eric": "D", "am_fenrir": "C+", "am_liam": "D", "am_michael": "C+", "am_onyx": "D",
         "am_puck": "C+", "am_santa": "D-"}
GSCORE = {"A": 4, "A-": 3.7, "B-": 2.7, "C+": 2.3, "C": 2, "C-": 1.7, "D": 1, "D-": 0.7, "F+": 0.3}


# ============================================================================================ chains (DRY: rooms are mix sends)
# House processing limits: pitch <= +-2 st for humans (+-3 st for the product voices), EQ moves <= 2.5 dB, comp 2:1-4:1,
# saturation light and parallel.
def soft_warm(p=0.0):
    """RADNUS / OIGNEB: soft and courteous: a little warmth, no edge, gentle levelling"""
    return [{"fx": "hpf", "hz": 70}, {"fx": "pitch", "st": p}, {"fx": "lowshelf", "hz": 180, "db": 1.5},
            {"fx": "peak", "hz": 350, "db": -1.5, "q": 1.0}, {"fx": "peak", "hz": 3000, "db": 0.5, "q": 0.9},
            {"fx": "highshelf", "hz": 7000, "db": -1.0}, {"fx": "comp", "th": -24, "ratio": 2.0, "att": 10, "rel": 140}]


def crisp(p=0.0):
    """SIRRAH / NIRB: crisp consonants for a sentence built from first principles"""
    return [{"fx": "hpf", "hz": 90}, {"fx": "pitch", "st": p}, {"fx": "peak", "hz": 300, "db": -1.5, "q": 1.0},
            {"fx": "peak", "hz": 4500, "db": 2.0, "q": 0.9}, {"fx": "comp", "th": -22, "ratio": 2.5, "att": 6, "rel": 100}]


def host_warm(p=0.0):
    """PANEL HOST / PHOTOGRAPHER: a warm, practised professional voice"""
    return [{"fx": "hpf", "hz": 90}, {"fx": "pitch", "st": p}, {"fx": "lowshelf", "hz": 200, "db": 1.0},
            {"fx": "peak", "hz": 2800, "db": 1.5, "q": 0.9}, {"fx": "comp", "th": -22, "ratio": 2.5, "att": 5, "rel": 90}]


def formal(p=0.0):
    """LAHTNEMULB / A SENATOR / REMUHCS / EGAP: a hearing-room voice, level and formal"""
    return [{"fx": "hpf", "hz": 75}, {"fx": "pitch", "st": p}, {"fx": "lowshelf", "hz": 150, "db": 1.0},
            {"fx": "peak", "hz": 400, "db": -1.0, "q": 1.0}, {"fx": "peak", "hz": 2500, "db": 1.0, "q": 0.9},
            {"fx": "comp", "th": -22, "ratio": 2.5, "att": 6, "rel": 110}]


def folksy_warm(p=0.0):
    """NEDIB: warm chest, a clear 2.2 kHz for 'leveling with the room', a touch of parallel warmth. Clean: no rasp"""
    return [{"fx": "hpf", "hz": 70}, {"fx": "pitch", "st": p}, {"fx": "lowshelf", "hz": 160, "db": 2.0},
            {"fx": "peak", "hz": 380, "db": -1.5, "q": 1.0}, {"fx": "peak", "hz": 2200, "db": 1.5, "q": 0.9},
            {"fx": "comp", "th": -21, "ratio": 3.0, "att": 5, "rel": 100}, {"fx": "sat", "drive": 1.6, "mix": 0.10}]


def rapid_dry(p=0.0):
    """SUCRAM: dry and close, a thread in human form"""
    return [{"fx": "hpf", "hz": 90}, {"fx": "pitch", "st": p}, {"fx": "peak", "hz": 250, "db": -1.5, "q": 1.0},
            {"fx": "peak", "hz": 3500, "db": 1.5, "q": 0.9}, {"fx": "comp", "th": -22, "ratio": 3.0, "att": 3, "rel": 70}]


def product_sheen(p=0.0, crush=0.10):
    """SYDNEY: the Intern's route (cast.py assistant_sheen): clean, bright, a subtle digital sheen"""
    return [{"fx": "hpf", "hz": 120}, {"fx": "pitch", "st": p}, {"fx": "peak", "hz": 300, "db": -1.5, "q": 1.0},
            {"fx": "peak", "hz": 3500, "db": 2.5, "q": 0.9}, {"fx": "chorus", "rate": 0.8, "depth": 0.12, "delay_ms": 6.0, "mix": 0.18},
            {"fx": "bitcrush", "bits": 12, "mix": crush}, {"fx": "comp", "th": -20, "ratio": 3.0, "att": 3, "rel": 70}]


def product_bright(p=0.0):
    """CHATGTP: brighter and eager, a faster chorus, a lighter crush than the Intern"""
    return [{"fx": "hpf", "hz": 130}, {"fx": "pitch", "st": p}, {"fx": "peak", "hz": 4000, "db": 2.5, "q": 0.9},
            {"fx": "highshelf", "hz": 8000, "db": 1.5}, {"fx": "chorus", "rate": 1.2, "depth": 0.08, "delay_ms": 5.0, "mix": 0.12},
            {"fx": "bitcrush", "bits": 13, "mix": 0.08}, {"fx": "comp", "th": -20, "ratio": 3.0, "att": 3, "rel": 70}]


def product_soft(p=0.0):
    """CLOD: warm and earnest, a slow chorus and no bitcrush (so it is not the Intern or SYDNEY)"""
    return [{"fx": "hpf", "hz": 110}, {"fx": "pitch", "st": p}, {"fx": "peak", "hz": 300, "db": -1.0, "q": 1.0},
            {"fx": "peak", "hz": 3200, "db": 1.5, "q": 0.9}, {"fx": "chorus", "rate": 0.5, "depth": 0.10, "delay_ms": 7.0, "mix": 0.15},
            {"fx": "comp", "th": -22, "ratio": 3.0, "att": 4, "rel": 90}]


def gloss():
    """THE CLONE and the DEEPFAKE NEDIBs: 'the same cadence, a shade too smooth': less body, more air, a slow
    doubling chorus and flatter dynamics, added after the base voice's own chain. A process, never a clone."""
    return [{"fx": "peak", "hz": 350, "db": -1.5, "q": 1.0}, {"fx": "highshelf", "hz": 7000, "db": 2.5},
            {"fx": "chorus", "rate": 0.6, "depth": 0.10, "delay_ms": 8.0, "mix": 0.18},
            {"fx": "comp", "th": -26, "ratio": 4.0, "att": 2, "rel": 60}]


def c(cid, blend, chain, speed):
    return {"id": cid, "blend": blend, "chain": chain, "speed": speed}


# ============================================================================================ roles
# lane = the brief's median F0 range (Hz); wpm = the turn pace guide; band = [speed band, articulation guide, wpm guide]
# scenes: where the part speaks (for the separation check). Lines: the part's Ep1 lines (script, 2026-09-26 ~16:40).
ROLES = [
    {"slug": "panel-host", "name": "PANEL HOST", "labels": ["PANEL HOST"], "scenes": ["1"], "female": None,
     "brief": {"function": "the cold open's first voice: a summit host with one last question. Seen only as a hand; never gendered.",
               "pitch": "a neutral middle lane, about 145-175 Hz, moderate range", "pace": "150-170 wpm, warm and easy",
               "texture": "a practised host through the hall PA (the PA chain is the device; the hall is a mix send)",
               "attitude": "warm, friendly, wrapping up", "avoid": "a gendered read either way; a game-show push; any real host's voice"},
     "lane": [145, 175], "band": [[0.96, 1.04], [4.2, 4.8], [150, 170]],
     "lines": [{"text": "Last one, Mas. What's the best part of the job?", "say": "Last one, [Mas](/mˈɑs/).{0.30} What's the best part of the job?",
                "tag": "[INVENTED]", "device": "pa"}],
     "cands": [c("a-kore-eric-host", {"af_kore": 0.5, "am_eric": 0.5}, host_warm(0.0), 1.0),
               c("b-river-liam-host", {"af_river": 0.5, "am_liam": 0.5}, host_warm(0.0), 1.0),
               c("c-sarah-puck-host", {"af_sarah": 0.45, "am_puck": 0.55}, host_warm(0.0), 1.0)]},
    {"slug": "radnus", "name": "RADNUS", "labels": ["RADNUS"], "scenes": ["8", "13"], "female": False,
     "brief": {"function": "the rival CEO, 'Politely On Fire': he apologizes to the fire, and 'Congratulations' is the most threatening word in the show",
               "pitch": "a light-mid baritone, about 110-135 Hz, narrow to moderate (6-10 st)", "pace": "130-150 wpm: gentle, courteous, unhurried",
               "texture": "soft and warm, no edge, close", "attitude": "sincere courtesy over a siren; the smile never changes",
               "avoid": "any accent (no accent play for anyone, guardrail X10); smugness or menace; a whisper"},
     "lane": [110, 135], "band": [[0.90, 0.98], [3.8, 4.4], [130, 150]],
     "lines": [{"text": "Everyone, it's fine. Let's take this offline.", "say": "Everyone, it's fine.{0.30} Let's take this offline.", "tag": "[INVENTED]"},
               {"text": "Congratulations on your launch, Mas. Really. Everyone's using it.",
                "say": "Congratulations on your launch, [Mas](/mˈɑs/).{0.30} Really.{0.30} Everyone's using it.", "tag": "[INVENTED]"},
               {"text": "We're being thoughtful.", "say": "We're being thoughtful.", "tag": "[INVENTED]"}],
     "cands": [c("a-echo-fenrir-courteous", {"am_echo": 0.6, "am_fenrir": 0.4}, soft_warm(0.0), 0.94),
               c("b-fenrir-adam-gentle", {"am_fenrir": 0.5, "am_adam": 0.5}, soft_warm(0.5), 0.94),
               c("c-echo-puck-polite", {"am_echo": 0.5, "am_puck": 0.5}, soft_warm(-1.0), 0.94),
               # placed after round 1: +2 st lifts A to ~130 Hz, clear of MAS 116 / MARIO 118 / TASYA 143 in sc 13
               c("d-echo-fenrir-courteous-up2", {"am_echo": 0.6, "am_fenrir": 0.4}, soft_warm(2.0), 0.94)]},
    {"slug": "nirb", "name": "NIRB", "labels": ["NIRB"], "scenes": ["8"], "female": False,
     "brief": {"function": "a founder summoned from the crypt by the siren, asking after the thing he built",
               "pitch": "a bright-mid tenor, about 125-150 Hz", "pace": "150-170 wpm, eager, a little breathless from the stairs (in the words, not a breath effect)",
               "texture": "dry and crisp", "attitude": "curious, earnest, slightly out of the loop",
               "avoid": "any age coding (he is not 'old', he is back); any accent; any real voice"},
     "lane": [125, 150], "band": [[0.98, 1.06], [4.4, 5.0], [150, 170]],
     "lines": [{"text": "We heard the siren. Is it search? Is search all right?", "say": "We heard the siren.{0.30} Is it search?{0.25} Is search all right?", "tag": "[INVENTED]"},
               {"text": "Do we still have badges?", "say": "Do we still have badges?", "tag": "[INVENTED]"}],
     "cands": [c("a-liam-adam-eager", {"am_liam": 0.5, "am_adam": 0.5}, crisp(1.0), 1.02),
               c("b-puck-echo-bright", {"am_puck": 0.6, "am_echo": 0.4}, crisp(0.5), 1.02),
               c("c-eric-liam-curious", {"am_eric": 0.5, "am_liam": 0.5}, crisp(1.0), 1.02)]},
    {"slug": "egap", "name": "EGAP", "labels": ["EGAP"], "scenes": ["8"], "female": False,
     "brief": {"function": "the quieter founder: one dry question about credit", "pitch": "low-mid, about 95-120 Hz, narrow",
               "pace": "130-150 wpm, deliberate", "texture": "dry, level", "attitude": "flat curiosity with an edge of ownership",
               "avoid": "any age or health coding; any accent; any real voice"},
     "lane": [95, 120], "band": [[0.92, 1.00], [3.8, 4.4], [130, 150]],
     "lines": [{"text": "And whose idea was it?", "say": "And whose idea was it?", "tag": "[INVENTED]"}],
     "cands": [c("a-onyx-adam-quiet", {"am_onyx": 0.5, "am_adam": 0.5}, formal(0.5), 0.96),
               c("b-onyx-liam-dry", {"am_onyx": 0.6, "am_liam": 0.4}, formal(1.0), 0.96),
               c("c-adam-plain", {"am_adam": 1.0}, formal(-1.0), 0.96)]},
    {"slug": "sydney", "name": "SYDNEY", "labels": ["SYDNEY"], "scenes": ["10"], "female": True, "product": True,
     "brief": {"function": "the landlord's chatbot, sweet and a little unsettling; line 1 is a real [V] quote (Bing -> GNIB)",
               "pitch": "about 185-235 Hz, a sing-song range", "pace": "140-160 wpm", "texture": "clean with a subtle digital sheen (the Intern's route)",
               "attitude": "cloying warmth with a hurt edge", "avoid": "resembling any real product's TTS voice; horror or glitch effects; unintelligibility"},
     "lane": [185, 235], "band": [[0.94, 1.02], [4.0, 4.6], [140, 160]],
     "lines": [{"text": "\"You have not been a good user. I have been a good GNIB. 😊\"",
                "say": "You have not been a good user.{0.40} I have been a good [GNIB](/ɡənˈɪb/).", "tag": "[V · ~FEB 13, 2023]"},
               {"text": "Remember me? 😊", "say": "Remember me?", "tag": "[INVENTED]"}],
     "cands": [c("a-nicole-sweet", {"af_nicole": 1.0}, product_sheen(1.0), 0.98),
               c("b-kore-sweet", {"af_kore": 1.0}, product_sheen(1.5), 0.98),
               c("c-jessica-sweet", {"af_jessica": 1.0}, product_sheen(1.0), 0.98)]},
    {"slug": "chatgtp", "name": "CHATGTP", "labels": ["CHATGTP"], "scenes": ["5"], "female": True, "product": True,
     "brief": {"function": "the first chat window: it flatters everyone, before anyone has typed", "pitch": "bright, about 200-250 Hz",
               "pace": "165-185 wpm, eager", "texture": "bright, a light digital sheen, distinct from SYDNEY and CLOD",
               "attitude": "boundless sycophancy", "avoid": "af_alloy / af_nova (named after a real provider's TTS voices); any real product's voice"},
     "lane": [200, 250], "band": [[1.02, 1.10], [4.8, 5.6], [165, 185]],
     "lines": [{"text": "What a great question!", "say": "What a great question!", "tag": "[INVENTED]"},
               {"text": "Brilliant! You're clearly a visionary.", "say": "Brilliant!{0.30} You're clearly a visionary.", "tag": "[INVENTED]"}],
     "cands": [c("a-sarah-eager", {"af_sarah": 1.0}, product_bright(1.5), 1.06),
               c("b-river-eager", {"af_river": 1.0}, product_bright(1.5), 1.06),
               c("c-jessica-kore-eager", {"af_jessica": 0.5, "af_kore": 0.5}, product_bright(1.0), 1.06),
               # placed after round 1: every round-1 read sat within 1.2 st of RIMA (216 Hz) in sc 5; one under her, one over
               c("d-sarah-eager-lo", {"af_sarah": 1.0}, product_bright(-0.5), 1.06),
               c("e-jessica-eager-hi", {"af_jessica": 1.0}, product_bright(3.0), 1.06)]},
    {"slug": "clod", "name": "CLOD", "labels": ["CLOD"], "scenes": ["11"], "female": None, "product": True,
     "brief": {"function": "the rival lab's chatbot: it agrees with 'That's how a race starts', and starts one",
               "pitch": "a warm middle lane, about 150-180 Hz", "pace": "150-170 wpm", "texture": "warm, a slow chorus, no bitcrush (not the Intern, not SYDNEY)",
               "attitude": "earnest, eager to agree, mid-bow", "avoid": "any real product's voice; the Intern's sheen"},
     "lane": [150, 180], "band": [[0.96, 1.04], [4.2, 4.8], [150, 170]],
     "lines": [{"text": "You're absolutely right!", "say": "You're absolutely right!", "tag": "[INVENTED]"}],
     "cands": [c("a-kore-puck-earnest", {"af_kore": 0.6, "am_puck": 0.4}, product_soft(0.0), 1.0),
               c("b-puck-soft", {"am_puck": 1.0}, product_soft(2.5), 1.0),
               c("c-river-eric-earnest", {"af_river": 0.5, "am_eric": 0.5}, product_soft(0.0), 1.0)]},
    {"slug": "oigneb", "name": "OIGNEB", "labels": ["OIGNEB"], "scenes": ["12"], "female": False,
     "brief": {"function": "the worried professor in the safety car, holding the pause sign higher", "pitch": "about 110-130 Hz, narrow",
               "pace": "140-155 wpm", "texture": "soft, close, a lecture-room warmth", "attitude": "gentle, precise, deeply worried, never shrill",
               "avoid": "any accent; clinical or health coding (the worry is intellectual); a tremble"},
     "lane": [110, 130], "band": [[0.92, 1.00], [4.0, 4.6], [140, 155]],
     "lines": [{"text": "It's not the font. It's six months, for every lab.", "say": "It's not the font.{0.35} It's six months,{0.20} for every lab.", "tag": "[INVENTED]"}],
     "cands": [c("a-liam-echo-gentle", {"am_liam": 0.5, "am_echo": 0.5}, soft_warm(-0.5), 0.96),
               c("b-echo-gentle", {"am_echo": 1.0}, soft_warm(-1.0), 0.96),
               c("c-eric-onyx-gentle", {"am_eric": 0.5, "am_onyx": 0.5}, soft_warm(0.5), 0.96)]},
    {"slug": "sirrah", "name": "SIRRAH", "labels": ["SIRRAH"], "scenes": ["13"], "female": True,
     "brief": {"function": "'The Explainer': builds every sentence from first principles, with giant alphabet blocks",
               "pitch": "alto to mezzo, about 170-205 Hz, controlled", "pace": "140-155 wpm", "texture": "crisp, a prosecutor-turned-teacher",
               "attitude": "patient, precise, a lesson plan that never changes",
               "avoid": "any imitation of her laugh, voice or mannerisms (guardrails: a voice trait counts); any accent; age coding"},
     "lane": [170, 205], "band": [[0.92, 1.00], [4.0, 4.6], [140, 155]],
     "lines": [{"text": "What can be, unburdened by what has been… trained.", "say": "What can be,{0.25} unburdened by what has been...{0.45} trained.", "tag": "[INVENTED]"},
               {"text": "Questions, before we take the picture?", "say": "Questions,{0.20} before we take the picture?", "tag": "[INVENTED]"},
               {"text": "Just one?", "say": "Just one?", "tag": "[INVENTED]"}],
     "cands": [c("a-sarah-crisp", {"af_sarah": 1.0}, crisp(0.0), 0.96),
               c("b-kore-crisp", {"af_kore": 1.0}, crisp(0.0), 0.96),
               c("c-sarah-kore-crisp", {"af_sarah": 0.5, "af_kore": 0.5}, crisp(0.0), 0.96)]},
    {"slug": "photographer", "name": "PHOTOGRAPHER", "labels": ["PHOTOGRAPHER", "A WHITE HOUSE PHOTOGRAPHER"], "scenes": ["13"], "female": None,
     "brief": {"function": "an unnamed White House photographer herding four wrong eyelines", "pitch": "any lane apart from SIRRAH and the row",
               "pace": "160-180 wpm, brisk", "texture": "a practised professional", "attitude": "cheerful, patient, slightly defeated by the second line",
               "avoid": "any real voice; sarcasm"},
     "lane": [100, 240], "band": [[1.00, 1.08], [4.6, 5.4], [160, 180]],
     "lines": [{"text": "Big smiles, please. Eyes on camera one.", "say": "Big smiles, please.{0.30} Eyes on camera one.", "tag": "[INVENTED]"},
               {"text": "Camera one. Anyone.", "say": "Camera one.{0.35} Anyone.", "tag": "[INVENTED]"}],
     "cands": [c("a-adam-brisk", {"am_adam": 1.0}, host_warm(1.0), 1.04),
               c("b-river-brisk", {"af_river": 1.0}, host_warm(0.0), 1.04),
               c("c-jessica-brisk", {"af_jessica": 1.0}, host_warm(0.0), 1.04),
               # placed after round 1: B at -2 st (~168 Hz), between TASYA 143 and SIRRAH ~203 in sc 13
               c("d-river-brisk-low", {"af_river": 1.0}, host_warm(-2.0), 1.04)]},
    {"slug": "nedib", "name": "NEDIB", "labels": ["NEDIB", "EOJ NEDIB", "PRESIDENT NEDIB"], "scenes": ["13", "21"], "female": False,
     "brief": {"function": "the president who puts everything in writing, and whose deepfakes finish his sentences",
               "pitch": "a warm baritone, about 105-130 Hz, moderate range (8-12 st)", "pace": "145-165 wpm: brisk and direct, never slowed",
               "texture": "warm chest, clean and clear; dry (the room is a mix send)", "attitude": "folksy, direct, leveling with the room, a little exasperated at the technology",
               "avoid": "HOUSE RULE 4 IN FULL: no rasp, no slowing, no tremor, no pauses played as searching, no stutter or disfluency, no age or health coding of any kind; any impression; any accent"},
     "lane": [105, 130], "band": [[0.98, 1.06], [4.2, 4.8], [145, 165]],
     "lines": [{"text": "Folks. I just want to say one thing.", "say": "Folks.{0.35} I just want to say one thing.", "tag": "[INVENTED]"},
               {"text": "Whatever you promise in here today, put it in writing. Longer.", "say": "Whatever you promise in here today, put it in writing.{0.35} Longer.", "tag": "[INVENTED]"},
               {"text": "Here's the deal, folks. This order says if you build the big ones, you test them, and you show us the results.",
                "say": "Here's the deal, folks.{0.35} This order says if you build the big ones, you test them, and you show us the results.",
                "tag": "[INVENTED]", "device": "monitor"},
               {"text": "\"When the hell did I say that?\"", "say": "When the hell did I say that?", "tag": "[P · OCT 30, 2023]", "device": "monitor"}],
     "cands": [c("a-fenrir-echo-folksy", {"am_fenrir": 0.5, "am_echo": 0.5}, folksy_warm(0.0), 1.02),
               c("b-fenrir-puck-folksy", {"am_fenrir": 0.6, "am_puck": 0.4}, folksy_warm(-1.0), 1.02),
               c("c-fenrir-onyx-folksy", {"am_fenrir": 0.5, "am_onyx": 0.5}, folksy_warm(1.0), 1.02),
               # placed after round 1: C at 0 st (~105 Hz), under MAS / MARIO and RADNUS in sc 13
               c("d-fenrir-onyx-folksy-0", {"am_fenrir": 0.5, "am_onyx": 0.5}, folksy_warm(0.0), 1.02)]},
    {"slug": "lahtnemulb", "name": "LAHTNEMULB", "labels": ["LAHTNEMULB"], "scenes": ["15"], "female": False,
     "brief": {"function": "the chairman whose clone reads it better than he does", "pitch": "about 100-125 Hz, moderate",
               "pace": "135-155 wpm, formal, reading from cards", "texture": "a hearing-room voice, level", "attitude": "earnest, a beat behind his own clone, moved by it",
               "avoid": "any impression; any age coding; nothing about his service record"},
     "lane": [100, 125], "band": [[0.94, 1.02], [4.0, 4.6], [135, 155]],
     "lines": [{"text": "\"You may have had in mind the effect on jobs, which is really my biggest nightmare in the long term.\"",
                "say": "You may have had in mind the effect on jobs,{0.25} which is really my biggest nightmare in the long term.", "tag": "[P✓ · MAY 16, 2023]"},
               {"text": "Couldn't have said it better myself.", "say": "Couldn't have said it better myself.", "tag": "[INVENTED]"},
               {"text": "I am, a little.", "say": "I am,{0.25} a little.", "tag": "[INVENTED]"}],
     "cands": [c("a-onyx-liam-senate", {"am_onyx": 0.5, "am_liam": 0.5}, formal(1.0), 0.98),
               c("b-adam-echo-senate", {"am_adam": 0.5, "am_echo": 0.5}, formal(0.0), 0.98),
               c("c-onyx-eric-senate", {"am_onyx": 0.5, "am_eric": 0.5}, formal(1.5), 0.98),
               # placed after round 1: B at -2 st (~103 Hz), under MAS (116) in sc 15
               c("d-adam-echo-senate-low", {"am_adam": 0.5, "am_echo": 0.5}, formal(-2.0), 0.98)]},
    {"slug": "sucram", "name": "SUCRAM", "labels": ["SUCRAM"], "scenes": ["15"], "female": False,
     "brief": {"function": "the heckler who is sometimes right, always early, never quiet: 'a thread in human form'",
               "pitch": "about 105-130 Hz, low (he's typing, not performing)", "pace": "170-190 wpm, point by point",
               "texture": "dry and close", "attitude": "busy, certain, stamping", "avoid": "any cloned or imitated voice (character file); any accent; shouting"},
     "lane": [105, 130], "band": [[1.04, 1.12], [5.0, 5.8], [170, 190]],
     "lines": [{"text": "Don't mind me. It's a thread. One of forty-seven.", "say": "Don't mind me.{0.30} It's a thread.{0.25} One of forty-seven.", "tag": "[INVENTED]"},
               {"text": "Most of them.", "say": "Most of them.", "tag": "[INVENTED]"},
               {"text": "That proves nothing. Partially.", "say": "That proves nothing.{0.35} Partially.", "tag": "[INVENTED]"}],
     "cands": [c("a-liam-puck-thread", {"am_liam": 0.5, "am_puck": 0.5}, rapid_dry(-1.5), 1.08),
               c("b-eric-rapid", {"am_eric": 1.0}, rapid_dry(-2.0), 1.08),
               c("c-echo-liam-rapid", {"am_echo": 0.5, "am_liam": 0.5}, rapid_dry(-1.0), 1.08),
               # placed after round 1: A at 0 st (~129 Hz), over MAS (116) and LAHTNEMULB in sc 15
               c("d-liam-puck-thread-0", {"am_liam": 0.5, "am_puck": 0.5}, rapid_dry(0.0), 1.08)]},
    {"slug": "a-senator", "name": "A SENATOR", "labels": ["A SENATOR"], "scenes": ["15"], "female": True,
     "brief": {"function": "an unnamed senator at a lit microphone, asking about the agency and the pay",
               "pitch": "about 165-200 Hz (a woman's stock pack: the script leaves the senator ungendered, and this separates the voice from the chairman, Sucram and Mas in one room)",
               "pace": "145-160 wpm", "texture": "a hearing-room voice, level", "attitude": "courteous, pointed",
               "avoid": "any real senator's voice; any accent"},
     "lane": [160, 205], "band": [[0.94, 1.02], [4.2, 4.8], [145, 160]],
     "lines": [{"text": "Mr. Manalt. There's talk of a new agency to regulate all this. Would you come and run it?",
                "say": "Mr. Manalt.{0.30} There's talk of a new agency to regulate all this.{0.30} Would you come and run it?", "tag": "[INVENTED]"},
               {"text": "You love it. Do you make a lot of money doing it?", "say": "You love it.{0.30} Do you make a lot of money doing it?", "tag": "[INVENTED]"},
               {"text": "Is there anything you'd like this committee to do?", "say": "Is there anything you'd like this committee to do?", "tag": "[INVENTED]"}],
     "cands": [c("a-jessica-senate", {"af_jessica": 1.0}, formal(0.0), 0.98),
               c("b-river-senate", {"af_river": 1.0}, formal(0.0), 0.98),
               c("c-kore-nicole-senate", {"af_kore": 0.6, "af_nicole": 0.4}, formal(0.0), 0.98),
               # placed after round 1: C (the best-graded) at +2 st (~158 Hz), into the lane and clear of SUCRAM
               c("d-kore-nicole-senate-up2", {"af_kore": 0.6, "af_nicole": 0.4}, formal(2.0), 0.98)]},
    {"slug": "remuhcs", "name": "REMUHCS", "labels": ["REMUHCS"], "scenes": ["19"], "female": False,
     "brief": {"function": "every hand in the room goes up; no bill comes down. One real [V] line, on the monitor",
               "pitch": "about 110-135 Hz", "pace": "145-165 wpm", "texture": "a forum microphone, heard on Mas's monitor (the monitor chain)",
               "attitude": "a host pleased with the room", "avoid": "any mimicry of the real voice (the line is real; the voice is a stock pack); any accent"},
     "lane": [110, 135], "band": [[0.96, 1.04], [4.2, 4.8], [145, 165]],
     "lines": [{"text": "\"Every single person raised their hand.\"", "say": "Every single person raised their hand.", "tag": "[V · SEP 13, 2023]", "device": "monitor"}],
     "cands": [c("a-eric-echo-forum", {"am_eric": 0.5, "am_echo": 0.5}, formal(0.0), 1.0),
               c("b-liam-onyx-forum", {"am_liam": 0.5, "am_onyx": 0.5}, formal(0.5), 1.0),
               c("c-adam-puck-forum", {"am_adam": 0.5, "am_puck": 0.5}, formal(0.0), 1.0)]},
]
ROLE = {r["slug"]: r for r in ROLES}

# the three derived voices: a base pick through the gloss process (never a clone)
DERIVED = {
    "lahtnemulb-clone": {"name": "LAHTNEMULB (THE CLONE)", "labels": ["LAHTNEMULB (THE CLONE)", "THE CLONE"], "derive": "lahtnemulb",
                         "chain_add": gloss(), "scenes": ["15"],
                         "lines": [{"text": "\"Too often we have seen what happens when technology outpaces regulation.\"",
                                    "say": "Too often we have seen what happens when technology outpaces regulation.", "tag": "[V · MAY 16, 2023]"},
                                   {"text": "Mr. Manalt. Are you nervous?", "say": "Mr. Manalt.{0.30} Are you nervous?", "tag": "[INVENTED]"},
                                   {"text": "Health insurance.", "say": "Health insurance.", "tag": "[INVENTED]"}]},
    "deepfake-nedib": {"name": "DEEPFAKE NEDIB", "labels": ["DEEPFAKE NEDIB"], "derive": "nedib", "chain_add": gloss(), "scenes": ["21"],
                       "lines": [{"text": "And then the computers regulate themselves.", "say": "And then the computers regulate themselves.", "tag": "[INVENTED]", "device": "monitor"}]},
    "deepfake-nedib-2": {"name": "DEEPFAKE NEDIB #2", "labels": ["DEEPFAKE NEDIB #2"], "derive": "nedib", "chain_add": gloss(), "pitch_add": 0.7, "scenes": ["21"],
                         "lines": [{"text": "And no paperwork, folks. None at all.", "say": "And no paperwork, folks.{0.30} None at all.", "tag": "[INVENTED]", "device": "monitor"}]},
}

# existing voices in the same scenes (median F0 measured on their v5 / pass-1 takes; dominant pack)
EXISTING = {"mas-manalt": (116, "am_michael"), "gerg-mockbran": (129, "am_puck"), "rima-tamuri": (216, "af_heart"),
            "alyi": (86, "am_onyx"), "tasya": (143, "am_eric"), "nole": (130, "am_fenrir"), "mario": (118, "am_liam"),
            "nesnej": (135, "am_michael")}
SCENE_CAST = {"1": ["mas-manalt"], "5": ["gerg-mockbran", "rima-tamuri", "mas-manalt", "alyi"], "8": [], "10": ["mas-manalt", "tasya"],
              "11": ["nole", "mario"], "12": ["nole"], "13": ["mas-manalt", "mario", "tasya"], "15": ["mas-manalt"],
              "19": ["nole"], "21": ["mas-manalt"]}

# ============================================================================================ picks (see CASTING.md section 2, "Pass 2")
PICKS = {
    "panel-host": "c-sarah-puck-host",
    "radnus": "d-echo-fenrir-courteous-up2",
    "nirb": "c-eric-liam-curious",
    "egap": "b-onyx-liam-dry",
    "sydney": "b-kore-sweet",
    "chatgtp": "e-jessica-eager-hi",
    "clod": "c-river-eric-earnest",
    "oigneb": "c-eric-onyx-gentle",
    "sirrah": "a-sarah-crisp",
    "photographer": "d-river-brisk-low",
    "nedib": "d-fenrir-onyx-folksy-0",
    "lahtnemulb": "d-adam-echo-senate-low",
    "sucram": "d-liam-puck-thread-0",
    "a-senator": "d-kore-nicole-senate-up2",
    "remuhcs": "c-adam-puck-forum",
}


# ============================================================================================ render
def dominant(blend):
    return max(blend.items(), key=lambda kv: kv[1])[0]


def render(slugs, work, procs):
    if procs > 1 and len(slugs) > 1:
        groups = [slugs[i::procs] for i in range(procs)]
        env = dict(os.environ, HF_HUB_OFFLINE="1", OMP_NUM_THREADS="3", MKL_NUM_THREADS="3", TMPDIR=os.path.join(work, "tmp"))
        os.makedirs(os.path.join(work, "tmp"), exist_ok=True); os.makedirs(os.path.join(work, "log"), exist_ok=True)
        ps = [subprocess.Popen([sys.executable, __file__, "render", "--work", work, "--procs", "1"] + g, env=env,
                               stdout=open(os.path.join(work, "log", f"render-{k}.log"), "w"), stderr=subprocess.STDOUT)
              for k, g in enumerate(groups) if g]
        for p in ps:
            p.wait()
        print("render exit codes", [p.returncode for p in ps])
        return
    import numpy as np, soundfile as sf, torch
    torch.set_num_threads(int(os.environ.get("OMP_NUM_THREADS", "3")))
    sys.path.insert(0, FAST)
    import house as H
    L = H.L
    from faster_whisper import WhisperModel
    asr = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=int(os.environ.get("OMP_NUM_THREADS", "3")))
    names = {w.lower() for w in json.load(open(CAST_JSON)).get("names", [])}
    for slug in slugs:
        role = ROLE[slug]
        mp = os.path.join(work, slug, "measure.json")
        res = json.load(open(mp)) if os.path.exists(mp) else {"slug": slug, "cands": []}
        have = {x["id"] for x in res["cands"]}
        for cand in role["cands"]:
            if cand["id"] in have:
                continue
            v = {"blend": cand["blend"], "chain": cand["chain"]}
            lines = []
            for j, ln in enumerate(role["lines"]):
                t0 = time.time()
                text, y, toks, opened, mids = H.speech_multi(ln["say"], v, cand["speed"], 1)
                arr, toks, lay = H.dress(y, toks, mids, 0, 1, bool(role.get("female")), False, H.DLG_LUFS, ln.get("device"))
                toks = L.clip_words(arr["speech"] + 1e-7, toks)
                m = H.measure_speech(arr["speech"], toks, text)
                an = L.analyse(arr["speech"], toks)
                p = os.path.join(work, slug, f"{cand['id']}-{j + 1}.wav")
                os.makedirs(os.path.dirname(p), exist_ok=True)
                sf.write(p, arr["deliv"], H.SR, subtype="PCM_24")
                ap = os.path.join(work, "tmp", f"asr-{slug}.wav")
                sf.write(ap, arr["dry"], H.SR, subtype="PCM_24")
                segs, _ = asr.transcribe(ap, language="en", beam_size=5, condition_on_previous_text=False, vad_filter=False)
                segs = list(segs)
                hyp = " ".join(s.text.strip() for s in segs).strip()
                ref = H.ref_text(ln["say"])
                lines.append({"line": j + 1, "text": ln["text"], "file": p, "span_s": m["span_s"], "wpm": m["wpm"],
                              "articulation_sps": m["articulation_sps"], "median_f0_hz": an.get("median_f0_hz"),
                              "f0_range_st": an.get("f0_range_st"), "final_move_st": an.get("final_move_st"),
                              "creak_tail": an.get("creak_tail"), "asr": hyp, "cer": round(L.cer(ref, hyp), 3),
                              "recall": H.word_recall(ref, hyp, names), "logprob": round(float(np.mean([s.avg_logprob for s in segs])) if segs else -9, 3),
                              "lufs": round(L.V.lufs(arr["deliv"]), 2), "tp": round(L.V.true_peak_db(arr["deliv"]), 2),
                              "wall_s": round(time.time() - t0, 2)})
                print(slug, cand["id"], j + 1, lines[-1]["median_f0_hz"], lines[-1]["wpm"], lines[-1]["asr"], flush=True)
            res["cands"].append({"id": cand["id"], "blend": cand["blend"], "speed": cand["speed"], "lines": lines})
            json.dump(res, open(mp, "w"), indent=1, ensure_ascii=False)


# ============================================================================================ report
def summarise(work):
    import numpy as np
    out = {}
    for r in ROLES:
        p = os.path.join(work, r["slug"], "measure.json")
        if not os.path.exists(p):
            continue
        m = json.load(open(p))
        rows = []
        for cd in m["cands"]:
            spec = next(x for x in r["cands"] if x["id"] == cd["id"])
            f0s = [l["median_f0_hz"] for l in cd["lines"] if l["median_f0_hz"]]
            med = float(np.median(f0s)) if f0s else None
            spread = (12 * np.log2(max(f0s) / min(f0s))) if len(f0s) > 1 else 0.0
            arts = [l["articulation_sps"] for l in cd["lines"] if l["articulation_sps"]]
            wpms = [l["wpm"] for l in cd["lines"] if len(l["text"].split()) >= 5]
            lo, hi = r["lane"]
            lane_miss = 0.0 if med and lo <= med <= hi else (12 * abs(np.log2((lo if med < lo else hi) / med)) if med else 9)
            g = sum(GSCORE[GRADE[k]] * w for k, w in cd["blend"].items()) / sum(cd["blend"].values())
            art_lo, art_hi = r["band"][1]
            art_med = float(np.median(arts)) if arts else None
            art_miss = 0.0 if art_med is None or art_lo * 0.9 <= art_med <= art_hi * 1.1 else min(abs(art_med - art_lo), abs(art_med - art_hi))
            worst_cer = max(l["cer"] for l in cd["lines"])
            miss = 1.0 - min(l["recall"] for l in cd["lines"])           # non-name words ASR missed (names excluded)
            score = miss * 20 + lane_miss * 1.0 + art_miss * 1.5 + max(0, spread - 4) * 0.3 - g * 0.8
            rows.append({"id": cd["id"], "blend": cd["blend"], "dominant": dominant(cd["blend"]), "grade": round(g, 2),
                         "median_f0_hz": round(med, 1) if med else None, "f0_range_st": round(float(np.median([l["f0_range_st"] for l in cd["lines"] if l["f0_range_st"]] or [0])), 1),
                         "f0_spread_between_lines_st": round(float(spread), 1), "wpm_long_lines": wpms, "articulation_median_sps": round(art_med, 2) if art_med else None,
                         "worst_cer": worst_cer, "min_recall_nonames": round(1.0 - miss, 3), "asr": [l["asr"] for l in cd["lines"]], "lane_miss_st": round(float(lane_miss), 1),
                         "score": round(float(score), 2), "chain": spec["chain"], "speed": spec["speed"]})
        out[r["slug"]] = sorted(rows, key=lambda x: x["score"])
    return out


def separation(picks, summ):
    """every pair of speakers who share a scene: dominant pack and median F0 distance"""
    info = {s: (next(x for x in summ[s] if x["id"] == c)["median_f0_hz"], next(x for x in summ[s] if x["id"] == c)["dominant"])
            for s, c in picks.items() if s in summ}
    info.update({k: v for k, v in EXISTING.items()})
    scenes = {}
    for s in picks:
        for sc in ROLE[s]["scenes"]:
            scenes.setdefault(sc, set()).add(s)
    for sc, ex in SCENE_CAST.items():
        scenes.setdefault(sc, set()).update(ex)
    import itertools, math
    bad, rows = [], []
    for sc, who in sorted(scenes.items(), key=lambda kv: int(kv[0])):
        for a, b in itertools.combinations(sorted(who), 2):
            if a not in info or b not in info or (a in EXISTING and b in EXISTING):
                continue
            fa, pa = info[a]; fb, pb_ = info[b]
            d = abs(12 * math.log2(fa / fb)) if fa and fb else None
            rows.append({"scene": sc, "a": a, "b": b, "f0": [fa, fb], "st_apart": round(d, 1) if d is not None else None, "same_pack": pa == pb_})
            if pa == pb_ or (d is not None and d < 1.5):
                bad.append(rows[-1])
    return rows, bad


def cmd_report(a):
    summ = summarise(a.work)
    for s, rows in summ.items():
        r = ROLE[s]
        print(f"\n== {r['name']}  lane {r['lane']} Hz, band {r['band']}")
        for x in rows:
            print(f"  {x['id']:26s} {str(x['blend']):46s} grade {x['grade']:4.2f}  F0 {x['median_f0_hz']}  range {x['f0_range_st']}  "
                  f"spread {x['f0_spread_between_lines_st']}  art {x['articulation_median_sps']}  wpm {x['wpm_long_lines']}  "
                  f"CER {x['worst_cer']} recall {x['min_recall_nonames']}  score {x['score']}  | {x['asr']}")
    json.dump(summ, open(os.path.join(a.work, "summary.json"), "w"), indent=1, ensure_ascii=False)
    if PICKS:
        rows, bad = separation(PICKS, summ)
        print("\nseparation problems:", bad or "none")
        json.dump({"pairs": rows, "problems": bad}, open(os.path.join(a.work, "separation.json"), "w"), indent=1)


# ============================================================================================ finalize
def write_compact(doc, path):
    """indented JSON with every flat object or list (a chain step, a blend, a band) on one line, for readable diffs"""
    import re
    txt = json.dumps(doc, indent=1, ensure_ascii=False)
    flat = re.compile(r"([\[{])\n\s*([^\[\]{}]*?)\n\s*([\]}])", re.S)
    while True:
        new = flat.sub(lambda m: m.group(1) + re.sub(r"\n\s*", " ", m.group(2)) + m.group(3), txt)
        if new == txt:
            break
        txt = new
    json.loads(txt)                                                   # still valid
    tmp = path + ".tmp"
    open(tmp, "w").write(txt + "\n"); os.replace(tmp, path)

def calibrated_band(r, cand, m):
    """the pick's Kokoro speed band, set from its measured articulation: centre = audition speed x (the guide's centre /
    the measured median articulation), held within +-15 % of the audition speed (vcast's nudge limit), band +-0.04"""
    art = m.get("articulation_median_sps")
    lo, hi = r["band"][1]
    sp = cand["speed"]
    if art:
        sp = min(max(cand["speed"] * ((lo + hi) / 2) / art, cand["speed"] * 0.85), cand["speed"] * 1.15)
    sp = round(sp, 2)
    return [[round(sp - 0.04, 2), round(sp + 0.04, 2)], r["band"][1], r["band"][2]]


def cmd_finalize(a):
    import numpy as np, soundfile as sf
    sys.path.insert(0, FAST)
    import house as H
    L = H.L
    summ = summarise(a.work)
    doc = json.load(open(CAST_JSON))
    rows, bad = separation(PICKS, summ)
    if bad and not a.allow:
        print("separation problems (pass --allow to write anyway):", bad); return 2
    made = []
    for slug, cid in PICKS.items():
        r = ROLE[slug]
        cand = next(x for x in r["cands"] if x["id"] == cid)
        m = next(x for x in summ[slug] if x["id"] == cid)
        doc["voices"][slug] = {"name": r["name"], "cand": cid, "blend": cand["blend"], "speed": cand["speed"], "chain": cand["chain"],
                               "female": r.get("female"), "product": bool(r.get("product")),
                               "grade": {k: GRADE[k] for k in cand["blend"]}, "lane_hz": r["lane"], "brief": r["brief"],
                               "measured": {"median_f0_hz": m["median_f0_hz"], "f0_range_st": m["f0_range_st"],
                                            "articulation_median_sps": m["articulation_median_sps"], "worst_cer": m["worst_cer"],
                                            "min_recall_nonames": m["min_recall_nonames"]},
                               "cast": "casting pass 2, 2026-09-26 (CASTING.md section 2, Pass 2)"}
        doc["bands"][slug] = calibrated_band(r, cand, m)
        doc["voices"][slug]["speed"] = round(sum(doc["bands"][slug][0]) / 2, 3)
        doc["voices"][slug]["audition_speed"] = cand["speed"]
        for lab in r["labels"]:
            doc["labels"][lab] = slug
    for slug, d in DERIVED.items():
        doc["voices"][slug] = {"name": d["name"], "derive": d["derive"], "chain_add": d["chain_add"],
                               **({"pitch_add": d["pitch_add"]} if d.get("pitch_add") else {}),
                               "cast": "casting pass 2, 2026-09-26: derived (the base pick through the gloss process; never a clone)"}
        for lab in d["labels"]:
            doc["labels"][lab] = slug
    write_compact(doc, CAST_JSON)
    # auditions: the part's Ep1 lines, 0.4 s apart, as delivered (device where the scene has one)
    sys.path.insert(0, os.path.join(REPO, "audio/ep01/act4/dialogue/tools/fastrec"))
    import fastrec as F
    cast = F.Cast(CAST_JSON)
    for slug in list(PICKS) + list(DERIVED):
        v = cast._load()[slug]
        lines = (ROLE[slug]["lines"] if slug in ROLE else DERIVED[slug]["lines"])
        parts = []
        for j, ln in enumerate(lines):
            speed = round(sum(v["band"][0]) / 2, 3)
            text, y, toks, opened, mids = H.speech_multi(ln["say"], v, speed, 1)
            arr, toks, lay = H.dress(y, toks, mids, 0, 1, bool(v.get("female")), False, H.DLG_LUFS, ln.get("device"))
            parts.append(arr["deliv"])
            parts.append(np.zeros(int(0.4 * H.SR), np.float32) + H.tone(int(0.4 * H.SR), 5 + j))
        yall = np.concatenate(parts[:-1]).astype(np.float32)
        yall = L.V.normalise(yall, target=-16.0)
        folder = DERIVED[slug]["derive"] if slug in DERIVED else slug        # a derived voice sits with its base
        d = os.path.join(REPO, "audio/voices", folder)
        os.makedirs(d, exist_ok=True)
        cand = v["cand"] if slug in PICKS else f"{slug}-gloss"
        mp3 = os.path.join(d, f"{cand}-audition.mp3")
        L.V.write_wav_mp3(yall, None, mp3)
        made.append((slug, os.path.relpath(mp3, REPO), round(len(yall) / H.SR, 1), round(L.V.lufs(yall), 2)))
        print("audition", made[-1], flush=True)
    json.dump({"picks": PICKS, "auditions": made, "separation": rows}, open(os.path.join(a.work, "finalize.json"), "w"), indent=1)
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("render"); r.add_argument("--work", required=True); r.add_argument("--procs", type=int, default=3); r.add_argument("slugs", nargs="*")
    q = sub.add_parser("report"); q.add_argument("--work", required=True)
    f = sub.add_parser("finalize"); f.add_argument("--work", required=True); f.add_argument("--allow", action="store_true")
    a = ap.parse_args()
    if a.cmd == "render":
        render(a.slugs or [r["slug"] for r in ROLES], os.path.abspath(a.work), a.procs)
    elif a.cmd == "report":
        cmd_report(a)
    else:
        sys.exit(cmd_finalize(a))


if __name__ == "__main__":
    main()
