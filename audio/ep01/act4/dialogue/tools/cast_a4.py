"""cast_a4.py - voices for Ep1 Act Four (DRY production chains).

Returning cast = the CASTING.md (pass 1) picks, same stock pack, speed and EQ/comp, with every room
(reverb/slap) removed: production dialogue is delivered dry and the mix adds rooms on sends.
New cast (not in CASTING.md) = auditioned here from stock Kokoro-82M American-English packs
(lang 'a'), with briefs written from each character file's persona and comic function, never from
the real person's voice. No accent, age, health or disability coding; no mimicry.
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, "/home/jgon/project/art/mrmas/audio/voices/tools")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cast as C  # casting-pass chains (read-only)
from a4lib import dry


# ----------------------------------------------------------------------------- new dry chains

def precise(pitch=0.0):
    """NELEH: clean, even, articulate: a little low-mid taken out, a crisp consonant band (footnotes)."""
    return [
        {"fx": "hpf", "hz": 90},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 300, "db": -1.5, "q": 1.0},
        {"fx": "peak", "hz": 4500, "db": 1.5, "q": 0.9},
        {"fx": "comp", "th": -22, "ratio": 2.5, "att": 6, "rel": 100},
    ]


def operator_warm(pitch=0.0):
    """ADELINA: warm and brisk, a COO's patience: warmth up, boxiness down, top gently rounded."""
    return [
        {"fx": "hpf", "hz": 80},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 200, "db": 1.5},
        {"fx": "peak", "hz": 450, "db": -1.0, "q": 1.0},
        {"fx": "peak", "hz": 2500, "db": 1.0, "q": 0.9},
        {"fx": "highshelf", "hz": 8000, "db": -1.0},
        {"fx": "comp", "th": -22, "ratio": 2.5, "att": 6, "rel": 110},
    ]


def grey(pitch=0.0):
    """MADA: 'muted grey' poker face: no chest warmth, presence pulled back, dynamics held flat."""
    return [
        {"fx": "hpf", "hz": 110},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 180, "db": -1.5},
        {"fx": "peak", "hz": 3000, "db": -1.5, "q": 0.9},
        {"fx": "highshelf", "hz": 7000, "db": -1.5},
        {"fx": "comp", "th": -24, "ratio": 3.0, "att": 5, "rel": 120},
    ]


def crisp_brisk(pitch=0.0):
    """TERB: tall and procedural: a little chest, a clean low-mid, a crisp 2 kHz edge, fast comp."""
    return [
        {"fx": "hpf", "hz": 80},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 150, "db": 1.5, "q": 0.9},
        {"fx": "peak", "hz": 500, "db": -1.5, "q": 1.0},
        {"fx": "peak", "hz": 2000, "db": 2.0, "q": 0.9},
        {"fx": "comp", "th": -21, "ratio": 3.0, "att": 3, "rel": 70},
    ]


def warm_smile(pitch=0.0):
    """TASYA: warm, soft-spoken, gently amused: warm low shelf, a small air lift (the smile), soft comp."""
    return [
        {"fx": "hpf", "hz": 70},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 180, "db": 2.0},
        {"fx": "peak", "hz": 350, "db": -1.5, "q": 1.0},
        {"fx": "highshelf", "hz": 6000, "db": 1.5},
        {"fx": "comp", "th": -24, "ratio": 2.0, "att": 12, "rel": 150},
    ]


def headset(pitch=0.0):
    """TTEMME: a streamer's headset mic: bass rolled off, a forward 2.8 kHz presence, quick comp."""
    return [
        {"fx": "hpf", "hz": 150},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 300, "db": -2.0, "q": 1.0},
        {"fx": "peak", "hz": 2800, "db": 2.5, "q": 0.9},
        {"fx": "highshelf", "hz": 9000, "db": -1.0},
        {"fx": "comp", "th": -20, "ratio": 3.5, "att": 3, "rel": 60},
    ]


def plain(pitch=0.0):
    """TILED EMPLOYEE: a plain, clean voice from the crowd."""
    return [
        {"fx": "hpf", "hz": 100},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 3000, "db": 1.0, "q": 0.9},
        {"fx": "comp", "th": -22, "ratio": 2.0, "att": 8, "rel": 110},
    ]


# ----------------------------------------------------------------------------- returning cast (CASTING.md picks, dry)

RETURNING = {
    "mas-manalt": {"name": "MAS MANALT", "cand": "a-michael-close", "blend": {"am_michael": 1}, "speed": 0.82,
                   "chain": dry(C.close_mic(0.0)), "wpm": (120, 140), "lane_hz": (105, 125)},
    "gerg-mockbran": {"name": "GERG MOCKBRAN", "cand": "a-puck-quick", "blend": {"am_puck": 1}, "speed": 1.15,
                      "chain": dry(C.bright_dry(1.5)), "wpm": (185, 205), "lane_hz": (125, 160)},
    "alyi": {"name": "ALYI", "cand": "a-onyx-cathedral", "blend": {"am_onyx": 1}, "speed": 0.8,
             "chain": dry(C.cathedral(0.0)), "wpm": (95, 115), "lane_hz": (78, 105),
             "mix_note": "his casting hall is now a mix send: room 0.8, damp 0.6, 12% wet, 35 ms pre-delay, send HPF 200 Hz"},
    "mario": {"name": "MARIO", "cand": "a-liam-earnest", "blend": {"am_liam": 1}, "speed": 0.95,
              "chain": dry(C.lecture(0.0)), "wpm": (145, 160), "lane_hz": (115, 150)},
    "rima-tamuri": {"name": "RIMA TAMURI", "cand": "a-heart-composed", "blend": {"af_heart": 1}, "speed": 0.9,
                    "chain": dry(C.broadcast(0.0)), "wpm": (135, 150), "lane_hz": (170, 230)},
}

# ----------------------------------------------------------------------------- new cast: briefs + audition candidates

NEW = {
    "neleh": {
        "name": "NELEH", "wpm": (150, 165), "lane_hz": (165, 200),
        "brief": {
            "function": "Cassandra with citations: the one board member who read the charter literally. Principled, never a villain.",
            "pitch": "a cool mezzo, median ~165-200 Hz, even (7-11 st per line), kept ~3 st under RIMA (~220 Hz on her Act Four lines) so the two never blur in the sc 27 exchange",
            "pace": "150-165 wpm, precise and efficient; a clean full stop before the footnote",
            "texture": "clean and articulate, crisp consonants (a footnote band at 4.5 kHz), dry",
            "attitude": "polite, exact, patient; she is asking the correct question in the wrong room",
            "cadence": "even statements that land on the last noun; questions lift only a little (she already knows the answer)",
            "avoid": "any accent or national-origin colour; villainy, sneer or scolding; breathiness",
        },
        "cands": [
            {"id": "a-kore-precise", "blend": {"af_kore": 1}, "speed": 0.95, "chain": precise(0.5), "grade": "C+"},
            {"id": "b-sarah-precise", "blend": {"af_sarah": 1}, "speed": 0.95, "chain": precise(-1.5), "grade": "C+"},
            {"id": "c-aoede-precise", "blend": {"af_aoede": 1}, "speed": 0.95, "chain": precise(-2.0), "grade": "C+"},
        ],
    },
    "mada": {
        "name": "MADA", "wpm": None, "lane_hz": (112, 126),
        "brief": {
            "function": "the poker face: runs a Q&A empire and never gives an answer. 'Good question.' is all he says.",
            "pitch": "a neutral mid-baritone, median ~115-130 Hz (about 2 st above MAS's own 'good question.' so the calm-off reads as two men), narrow (<= 9 st)",
            "pace": "unhurried; the two words take ~0.8-1.0 s. Pauses stand in for sentences",
            "texture": "muted grey: no chest warmth, presence pulled back, dynamics held flat (3:1)",
            "attitude": "courteous non-answer; not smug, not robotic, not sinister",
            "cadence": "level through 'Good', a small settle on 'question'; identical every time (it is a canned answer)",
            "avoid": "a synthetic/robot sheen (he is human); a sneer; any imitation",
        },
        "cands": [
            {"id": "a-echo-grey", "blend": {"am_echo": 1}, "speed": 0.9, "chain": grey(1.5), "grade": "D"},
            {"id": "b-adam-grey", "blend": {"am_adam": 1}, "speed": 0.9, "chain": grey(1.5), "grade": "F+"},
            {"id": "c-echo-eric-grey", "blend": {"am_echo": 0.6, "am_eric": 0.4}, "speed": 0.9, "chain": grey(0.0), "grade": "D/D blend"},
        ],
    },
    "terb": {
        "name": "TERB", "wpm": (165, 185), "lane_hz": (95, 115),
        "brief": {
            "function": "the fire marshal of imploding boards: calm, capable, faintly bored by catastrophe.",
            "pitch": "a tall baritone, median ~95-115 Hz, moderate range (8-12 st)",
            "pace": "brisk, 165-185 wpm; procedural questions, no drama",
            "texture": "crisp and clean: a little chest, a clean low-mid, a 2 kHz edge",
            "attitude": "reassuring and practical; he has done this before",
            "cadence": "short procedural questions with a quick lift; the realisation '...Ah.' falls flat and short",
            "avoid": "heroics, barking, a drill-sergeant read; any imitation",
        },
        "cands": [
            {"id": "a-fenrir-brisk", "blend": {"am_fenrir": 1}, "speed": 1.02, "chain": crisp_brisk(-2.0), "grade": "C+"},
            {"id": "b-echo-brisk", "blend": {"am_echo": 1}, "speed": 1.02, "chain": crisp_brisk(0.0), "grade": "D"},
            {"id": "c-fenrir-onyx-brisk", "blend": {"am_fenrir": 0.6, "am_onyx": 0.4}, "speed": 1.02, "chain": crisp_brisk(0.0), "grade": "C+/D blend"},
        ],
    },
    "tasya": {
        "name": "TASYA", "wpm": (125, 140), "lane_hz": (130, 150),
        "brief": {
            "function": "the zen landlord: he never fights, he owns the building the fight is in. Serenity is leverage; only Mas is calmer.",
            "pitch": "a warm light baritone-tenor, median ~130-150 Hz (a clear lane above MAS and below GERG's bright 135 is impossible, so separation comes from pace and warmth: he is half GERG's speed), gentle range (7-11 st)",
            "pace": "125-140 wpm, measured, business words said like mindfulness mantras",
            "texture": "warm, soft-onset, smiling (a small air lift), no edge",
            "attitude": "warm, gently amused, delighted; generous and three moves ahead",
            "cadence": "parallel phrases with even spacing ('below them, above them, around them'), each landing softly",
            "avoid": "ANY accent or accent colour (explicit guardrail); 'sipping tea'; smugness; any imitation of the real voice",
        },
        "cands": [
            {"id": "a-fenrir-eric-warm", "blend": {"am_fenrir": 0.5, "am_eric": 0.5}, "speed": 0.9, "chain": warm_smile(0.0), "grade": "C+/D blend"},
            {"id": "b-eric-warm", "blend": {"am_eric": 1}, "speed": 0.88, "chain": warm_smile(-1.5), "grade": "D"},
            {"id": "c-santa-fenrir-warm", "blend": {"am_santa": 0.4, "am_fenrir": 0.6}, "speed": 0.9, "chain": warm_smile(0.0), "grade": "D-/C+ blend"},
        ],
    },
    "ttemme": {
        "name": "TTEMME", "wpm": (155, 175), "lane_hz": (122, 160),
        "brief": {
            "function": "the 72-hour CEO: a livestream co-founder who ran the company for a weekend and talks to 'chat' the whole time.",
            "pitch": "a light mid register, median ~122-160 Hz, lively (10-16 st); away from TASYA by timbre (not the eric pack) and from MADA by +2 st and the headset",
            "pace": "155-175 wpm, casual streamer patter; the second 'Chat...' slows as he watches the sand",
            "texture": "a headset mic: bass rolled off, forward presence, quick compression; dry",
            "attitude": "affable, a little bemused, sincere (his exit 'deeply pleased' is played straight)",
            "cadence": "addresses chat first, then the news; a small honest question lift at the end",
            "avoid": "gamer-bro caricature, shouting, sarcasm; any imitation",
        },
        "cands": [
            {"id": "a-eric-headset", "blend": {"am_eric": 1}, "speed": 1.0, "chain": headset(-1.0), "grade": "D"},
            {"id": "b-santa-headset", "blend": {"am_santa": 1}, "speed": 1.0, "chain": headset(0.0), "grade": "D-"},
            {"id": "c-echo-eric-headset", "blend": {"am_echo": 0.4, "am_eric": 0.6}, "speed": 1.0, "chain": headset(1.0), "grade": "D/D blend"},
            # round 2 (added after round 1 showed every eric-based TTEMME sits within 10-17 MFCC units of TASYA)
            {"id": "d-fenrir-headset", "blend": {"am_fenrir": 1}, "speed": 1.0, "chain": headset(2.0), "grade": "C+"},  # auditioned at 0 st, placed +2 st
            {"id": "e-liam-headset", "blend": {"am_liam": 1}, "speed": 1.0, "chain": headset(1.5), "grade": "D"},
        ],
    },
    "adelina": {
        "name": "ADELINA", "wpm": (150, 165), "lane_hz": (175, 215),
        "brief": {
            "function": "the adult in the other room: translates Mario's 40,000 words into three bullets and a revenue chart.",
            "pitch": "a warm mezzo, median ~175-215 Hz, moderate range",
            "pace": "brisk but unhurried, 150-165 wpm; the colon in 'In plain English:' is a real beat (~0.35 s)",
            "texture": "warm, close and dry; a phone-call brightness is left to the mix",
            "attitude": "brisk and warm; kind finality. No is a complete sentence",
            "cadence": "set-up phrase level, beat, the verdict falls short and clean",
            "avoid": "sibling or family framing (guardrail); coldness; sarcasm; any imitation",
        },
        "cands": [
            {"id": "a-bella-warm", "blend": {"af_bella": 1}, "speed": 0.95, "chain": operator_warm(-1.0), "grade": "A-"},
            {"id": "b-aoede-warm", "blend": {"af_aoede": 1}, "speed": 0.95, "chain": operator_warm(0.0), "grade": "C+"},
            {"id": "c-nova-warm", "blend": {"af_nova": 1}, "speed": 0.95, "chain": operator_warm(1.5), "grade": "C"},
        ],
    },
    "tiled-employee": {
        "name": "TILED EMPLOYEE", "wpm": None, "lane_hz": (135, 175),
        "brief": {
            "function": "one hand up in the all-hands crowd; asks the question everyone is thinking.",
            "pitch": "a plain lower-mid female voice, ~135-175 Hz: 3+ st under NELEH (two lines earlier) and 5+ st under RIMA (the line before), well above ALYI's answer",
            "pace": "natural, ~150-170 wpm",
            "texture": "plain and clean; the crowd/room is a mix send",
            "attitude": "earnest, direct, a little unsure; not comic-nervous",
            "cadence": "a real question lift on 'coup'",
            "avoid": "mockery of staff; any accent",
        },
        "cands": [
            {"id": "a-nova-plain", "blend": {"af_nova": 1}, "speed": 0.95, "chain": plain(-1.5), "grade": "C"},  # auditioned at 0 st, placed -1.5 st (3+ st off NELEH)
            {"id": "b-alloy-plain", "blend": {"af_alloy": 1}, "speed": 0.95, "chain": plain(1.5), "grade": "C"},
            {"id": "c-river-plain", "blend": {"af_river": 1}, "speed": 0.95, "chain": plain(0.0), "grade": "D"},
        ],
    },
}


# ----------------------------------------------------------------------------- draft 3.1: MAS (V.O.) and the laptop speaker

def vo_close(pitch=0.0):
    """MAS (V.O.): the same performer as on camera (a-michael-close), told closer and softer (pov-and-framing §5.1:
    close-miked, dry, no room, a touch slower). Against his on-camera close_mic chain: a little more proximity
    (low shelf +2.5 vs +2 dB), the 3.2 kHz presence lift taken out and dipped (-1 vs +1 dB: less projection, nothing
    'performed'), a softer top (-2.5 vs -1.5 dB), and slower, gentler levelling (2.5:1 at -26 dB, 15/160 ms) so the
    line sits even and close. No pitch change: it is his voice, not a second character. Every move is inside the
    house EQ limit (<= 2.5 dB). Delivered 2 LU under dialogue (see VO_LUFS)."""
    return [
        {"fx": "hpf", "hz": 60},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 150, "db": 2.5},
        {"fx": "peak", "hz": 320, "db": -2.0, "q": 1.0},
        {"fx": "peak", "hz": 3200, "db": -1.0, "q": 0.8},
        {"fx": "highshelf", "hz": 7500, "db": -2.5},
        {"fx": "comp", "th": -26, "ratio": 2.5, "att": 15, "rel": 160},
    ]


def laptop_speaker():
    """His voice heard through the board's laptop speaker (sc 27, a4-27-00; pov-changes §1.1, §5.1 'Laptop-speaker
    filter'): a small driver in a thin chassis. Steep band-limit (HPF 330 Hz and LPF 5.4 kHz, each doubled for a
    24 dB/oct slope), the chassis box resonance (+4 dB @ 950 Hz), a small upper-mid honk (+2 dB @ 2.8 kHz), a little
    driver distortion (parallel tanh, 25%) and the laptop's own DSP levelling (3:1). The level is set after the
    chain: quieter than the room (LAPTOP_LUFS)."""
    return [
        {"fx": "hpf", "hz": 330}, {"fx": "hpf", "hz": 330},
        {"fx": "lpf", "hz": 5400}, {"fx": "lpf", "hz": 5400},
        {"fx": "peak", "hz": 950, "db": 4.0, "q": 1.1},
        {"fx": "peak", "hz": 2800, "db": 2.0, "q": 1.4},
        {"fx": "sat", "drive": 1.8, "mix": 0.25},
        {"fx": "comp", "th": -24, "ratio": 3.0, "att": 4, "rel": 80},
    ]


DIALOGUE_LUFS = -16.0
VO_LUFS = -18.0       # 'slightly lower level': 2 LU under on-camera dialogue (the bible's "sits at dialogue level" is a mix call; +2 dB restores it)
LAPTOP_LUFS = -22.0   # 'quieter than the room': 6 LU under dialogue; the clean copy stays at -16

RETURNING["mas-manalt-vo"] = {
    "name": "MAS MANALT", "cand": "a-michael-close · V.O. (vo-close)", "blend": {"am_michael": 1}, "speed": 0.76,
    "chain": vo_close(0.0), "wpm": (110, 125), "lane_hz": (105, 125), "short_boost": False, "lufs": VO_LUFS,
    "desc": "the on-camera Mas (am_michael, a-michael-close), closer and softer: intimate close mic, dry, no room, "
            "110-125 wpm (a touch under his scenes), level or gently falling finals, 2 LU under dialogue; told, never performed",
}


# ----------------------------------------------------------------------------- picks (from auditions/auditions.json; reasons in dialogue.md)
# pitch placements applied after auditions: NELEH aoede -1 -> -2 st (3 st under RIMA), MADA adam 0 -> +1.5 st (above MAS),
# TTEMME fenrir 0 -> +2 st (off MADA), TILED EMPLOYEE nova 0 -> -1.5 st (off NELEH)
NEW_PICKS = {
    "neleh": "c-aoede-precise",
    "mada": "b-adam-grey",
    "terb": "b-echo-brisk",
    "tasya": "b-eric-warm",
    "ttemme": "d-fenrir-headset",
    "adelina": "a-bella-warm",
    "tiled-employee": "a-nova-plain",
}
