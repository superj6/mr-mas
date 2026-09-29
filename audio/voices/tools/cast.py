"""cast.py - render the MR. MAS voice-casting pass.

Usage:  .venv-casting/bin/python voices/tools/cast.py [slug ...]   (render; then run --finalize)
        .venv-casting/bin/python voices/tools/cast.py --finalize        (level-matched MP3s, reels, blips)
        .venv-casting/bin/python voices/tools/cast.py --relink-blips    (refresh blip pairing only)
Writes  voices/<slug>/<candidate>-<line>.{wav,mp3}, voices/<slug>/<slug>-reel.mp3,
        voices/manifest.json, voices/tools/qa.json
All voices are Kokoro-82M stock American-English packs (or weighted blends of them).
No real person's audio is used anywhere.
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
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import vcast as V

ROOT = os.path.join(REPO, "audio/voices")
SFX = os.path.join(REPO, "audio/sfx")
MODEL = "Kokoro-82M v1.0 (hexgrad/Kokoro-82M, misaki G2P, lang 'a' American English)"
LICENSE = ("Kokoro-82M weights + stock voice packs: Apache-2.0; misaki G2P: Apache-2.0; "
           "pedalboard: GPL-3.0 (tool only, output audio unencumbered); "
           "no third-party or real-person audio used")
CARRIER = "Right. Okay."

# ----------------------------------------------------------------------------- shared chains

def close_mic(pitch=0.0, warmth=2.0, room_wet=0.03):
    return [
        {"fx": "hpf", "hz": 70},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 160, "db": warmth},
        {"fx": "peak", "hz": 320, "db": -2.0, "q": 1.0},
        {"fx": "peak", "hz": 3200, "db": 1.0, "q": 0.8},
        {"fx": "highshelf", "hz": 8000, "db": -1.5},
        {"fx": "comp", "th": -24, "ratio": 2.0, "att": 10, "rel": 120},
        {"fx": "reverb", "room": 0.08, "damp": 0.7, "wet": room_wet, "width": 0.3},
    ]


def punchy(pitch=0.0, sat=0.25, room=0.15, wet=0.05, chest=1.5):
    return [
        {"fx": "hpf", "hz": 80},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 180, "db": chest, "q": 0.9},
        {"fx": "peak", "hz": 2500, "db": 2.0, "q": 1.0},
        {"fx": "comp", "th": -20, "ratio": 4.0, "att": 3, "rel": 60},
        {"fx": "sat", "drive": 2.5, "mix": sat},
        {"fx": "reverb", "room": room, "damp": 0.5, "wet": wet, "width": 0.4},
    ]


def bright_dry(pitch=0.0):
    return [
        {"fx": "hpf", "hz": 90},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 250, "db": -2.0, "q": 1.0},
        {"fx": "peak", "hz": 4000, "db": 2.0, "q": 0.9},
        {"fx": "comp", "th": -22, "ratio": 3.0, "att": 4, "rel": 80},
    ]


def cathedral(pitch=0.0, wet=0.12):
    return [
        {"fx": "hpf", "hz": 50},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 140, "db": 1.5},
        {"fx": "peak", "hz": 400, "db": -1.5, "q": 1.0},
        {"fx": "peak", "hz": 2800, "db": 1.5, "q": 0.9},
        {"fx": "comp", "th": -24, "ratio": 2.5, "att": 8, "rel": 150},
        {"fx": "reverb", "room": 0.8, "damp": 0.6, "wet": wet, "width": 0.6, "predelay_ms": 35, "send_hpf": 200},
    ]


def lecture(pitch=0.0):
    return [
        {"fx": "hpf", "hz": 80},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 250, "db": -1.0, "q": 1.0},
        {"fx": "lowshelf", "hz": 200, "db": 1.0},
        {"fx": "peak", "hz": 3000, "db": 1.5, "q": 0.9},
        {"fx": "highshelf", "hz": 7000, "db": -1.0},
        {"fx": "comp", "th": -22, "ratio": 2.5, "att": 6, "rel": 100},
        {"fx": "reverb", "room": 0.1, "damp": 0.6, "wet": 0.03, "width": 0.3},
    ]


def podium(pitch=0.0, sat=0.2):
    return [
        {"fx": "hpf", "hz": 70},
        {"fx": "pitch", "st": pitch},
        {"fx": "lowshelf", "hz": 150, "db": 2.0},
        {"fx": "peak", "hz": 350, "db": -1.5, "q": 1.0},
        {"fx": "peak", "hz": 2200, "db": 1.5, "q": 0.9},
        {"fx": "comp", "th": -20, "ratio": 3.0, "att": 5, "rel": 90},
        {"fx": "sat", "drive": 2.0, "mix": sat},
        {"fx": "slap", "ms": 85, "mix": 0.07, "lpf": 5000},
        {"fx": "reverb", "room": 0.45, "damp": 0.55, "wet": 0.06, "width": 0.5, "predelay_ms": 20, "send_hpf": 250},
    ]


def keynote(pitch=0.0):
    return [
        {"fx": "hpf", "hz": 80},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 200, "db": 1.0, "q": 0.9},
        {"fx": "peak", "hz": 3500, "db": 2.0, "q": 0.9},
        {"fx": "comp", "th": -20, "ratio": 3.0, "att": 4, "rel": 80},
        {"fx": "sat", "drive": 1.8, "mix": 0.15},
        {"fx": "slap", "ms": 110, "mix": 0.05, "lpf": 4500},
        {"fx": "reverb", "room": 0.6, "damp": 0.5, "wet": 0.06, "width": 0.6, "predelay_ms": 25, "send_hpf": 250},
    ]


def broadcast(pitch=0.0):
    return [
        {"fx": "hpf", "hz": 90},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 300, "db": -1.0, "q": 1.0},
        {"fx": "peak", "hz": 5000, "db": 1.0, "q": 0.8},
        {"fx": "comp", "th": -22, "ratio": 2.0, "att": 8, "rel": 120},
        {"fx": "reverb", "room": 0.1, "damp": 0.7, "wet": 0.025, "width": 0.3},
    ]


def assistant_sheen(pitch=0.0, crush=0.12):
    return [
        {"fx": "hpf", "hz": 120},
        {"fx": "pitch", "st": pitch},
        {"fx": "peak", "hz": 300, "db": -1.5, "q": 1.0},
        {"fx": "peak", "hz": 3500, "db": 2.5, "q": 0.9},
        {"fx": "chorus", "rate": 0.8, "depth": 0.12, "delay_ms": 6.0, "mix": 0.18},
        {"fx": "bitcrush", "bits": 12, "mix": crush},
        {"fx": "comp", "th": -20, "ratio": 3.0, "att": 3, "rel": 70},
    ]


# ----------------------------------------------------------------------------- cast

CAST = [
    {
        "slug": "mas-manalt", "wpm": (120, 140), "name": "MAS MANALT",
        "lines": [
            {"id": "catchphrase", "text": "super.", "say": "super.", "carrier": True,
             "tag": "[INVENTED] usage of a real public tic ('super'); Ep1 Blip, his tile drops out of the call"},
            {"id": "quote", "text": "near the singularity; unclear which side.",
             "tag": "[V] Jan 2025 post (season tagline, cold-open line)"},
            {"id": "comic", "text": "i did not know this was happening.", "say": "I did not know this was happening.",
             "speed_scale": 0.88,
             "tag": "[K] May 2024 post, re-verify before lock; Ep2 NDA scroll across the Bay Bridge"},
        ],
        "candidates": [
            {"id": "a-michael-close", "voice": {"am_michael": 1}, "speed": 0.82, "chain": close_mic(0.0)},
            {"id": "b-michael-puck-hush", "voice": {"am_michael": 0.6, "am_puck": 0.4}, "speed": 0.8,
             "chain": close_mic(0.5, warmth=2.5, room_wet=0.02)},
            {"id": "c-puck-nicole-soft", "voice": {"am_puck": 0.8, "af_nicole": 0.2}, "speed": 0.82,
             "chain": close_mic(0.0, warmth=2.0)},
        ],
    },
    {
        "slug": "nole", "wpm": (165, 185), "name": "NOLE",
        "lines": [
            {"id": "catchphrase", "text": "Next quarter.", "carrier": True,
             "tag": "[INVENTED] catchphrase, said about everything (KORG 5 version board)"},
            {"id": "quote", "text": "I came up with the name!", "speed_scale": 0.9, "no_pace": True,
             "tag": "[V] Apr 28-30, 2026 trial testimony ('I came up with the name.'); Ep8"},
            {"id": "comic", "text": "Mario is right. Also, I named the frontier.",
             "tag": "[INVENTED] sample exchange; opens on the [V] Sep 12, 2026 'Dario is right.' (on screen: Mario)"},
        ],
        "candidates": [
            {"id": "a-fenrir-burst", "voice": {"am_fenrir": 1}, "speed": 1.08, "chain": punchy(0.0)},
            {"id": "b-echo-grit", "voice": {"am_echo": 1}, "speed": 1.1, "chain": punchy(1.0, sat=0.3)},
            {"id": "c-fenrir-onyx-metal", "voice": {"am_fenrir": 0.6, "am_onyx": 0.4}, "speed": 1.05,
             "chain": punchy(0.0, sat=0.3, room=0.4, wet=0.08, chest=2.5)},
        ],
    },
    {
        "slug": "gerg-mockbran", "wpm": (185, 205), "name": "GERG MOCKBRAN",
        "lines": [
            {"id": "catchphrase", "text": "one sec, compiling.", "say": "One sec... compiling.", "carrier": True,
             "tag": "[INVENTED] catchphrase, said during any emergency"},
            {"id": "quote", "text": "Returning to NopeAI and getting back to coding tonight.",
             "say": "Returning to Nope AI and getting back to coding tonight.",
             "tag": "[V] Nov 21, 2023 post (name swapped; '&' spoken as 'and'); Ep1"},
            {"id": "comic", "text": "that's a v2 problem.", "say": "That's a vee two problem.",
             "tag": "[INVENTED] catchphrase, said about ethics, law, sleep"},
        ],
        "candidates": [
            {"id": "a-puck-quick", "voice": {"am_puck": 1}, "speed": 1.15, "chain": bright_dry(1.5)},
            {"id": "b-eric-bright", "voice": {"am_eric": 1}, "speed": 1.12, "chain": bright_dry(0.0)},
            {"id": "c-liam-commit", "voice": {"am_liam": 1}, "speed": 1.15, "chain": bright_dry(1.0)},
        ],
    },
    {
        "slug": "alyi", "wpm": (95, 115), "name": "ALYI",
        "lines": [
            {"id": "catchphrase", "text": "Feel the AGI.", "carrier": True,
             "tag": "[V] as a chant (The Atlantic, 2022 holiday party); intro card FEELS THE AGI."},
            {"id": "quote", "text": "I deeply regret my participation in the board's actions.",
             "tag": "[V] Nov 20, 2023 post; Ep1 soap-opera confession"},
            {"id": "comic", "text": "Yes, and also no.", "carrier": True, "speed_scale": 0.85,
             "tag": "[INVENTED] Ep6 deposition koan"},
        ],
        "candidates": [
            {"id": "a-onyx-cathedral", "voice": {"am_onyx": 1}, "speed": 0.8, "chain": cathedral(0.0)},
            {"id": "b-michael-low", "voice": {"am_michael": 1}, "speed": 0.78, "chain": cathedral(-2.0)},
            {"id": "c-onyx-echo-blend", "voice": {"am_onyx": 0.5, "am_echo": 0.5}, "speed": 0.8,
             "chain": cathedral(0.0, wet=0.1)},
        ],
    },
    {
        "slug": "mario", "wpm": (145, 160), "name": "MARIO",
        "lines": [
            {"id": "catchphrase", "text": "I have one concern. It has sub-concerns.",
             "tag": "[INVENTED] catchphrase"},
            {"id": "quote", "text": "We will slow down as much as necessary…", "speed_scale": 0.92,
             "say": "We will slow down as much as necessary.",
             "tag": "[V] Sep 23, 2026 UNSC remarks (truncated verbatim); Ep9 UN table"},
            {"id": "comic", "text": "We are very worried. So we built a bigger one.", "speed_scale": 0.85,
             "tag": "[INVENTED] sample exchange (the scroll becomes a runway)"},
        ],
        "candidates": [
            {"id": "a-liam-earnest", "voice": {"am_liam": 1}, "speed": 0.95, "chain": lecture(0.0)},
            {"id": "b-michael-precise", "voice": {"am_michael": 1}, "speed": 0.95, "chain": lecture(2.0)},
            {"id": "c-eric-lean", "voice": {"am_eric": 1}, "speed": 0.93, "chain": lecture(-1.5)},
        ],
    },
    {
        "slug": "rumpt", "wpm": (130, 150), "name": "PRESIDENT RUMPT (DLANOD J. RUMPT)",
        "lines": [
            {"id": "catchphrase", "text": "Rename it. Now it's better.",
             "tag": "[INVENTED] cartoon dialogue built from his public verbal style (the LABEL GUN)"},
            {"id": "quote", "text": "It's not artificial. It's genius.",
             "tag": "[P✓] Jul 23, 2025 AI Action Plan remarks; Ep5 LABEL GUN"},
            {"id": "comic", "text": "Tremendous compute. Nobody's ever seen compute like this.",
             "tag": "[INVENTED] cartoon dialogue (superlatives, numbers-first)"},
        ],
        "candidates": [
            {"id": "a-santa-michael-podium", "voice": {"am_santa": 0.5, "am_michael": 0.5}, "speed": 0.92,
             "chain": podium(-1.5)},
            {"id": "b-onyx-big", "voice": {"am_onyx": 1}, "speed": 0.95, "chain": podium(2.0)},
            {"id": "c-fenrir-michael-rally", "voice": {"am_fenrir": 0.5, "am_michael": 0.5}, "speed": 0.95,
             "chain": podium(-1.0, sat=0.25)},
        ],
    },
    {
        "slug": "nesnej", "wpm": (160, 176), "name": "NESNEJ",
        "lines": [
            {"id": "catchphrase", "text": "Everyone's a customer.", "carrier": True,
             "tag": "[INVENTED] catchphrase"},
            {"id": "quote", "text": "The more you buy, the more you save.", "speed_scale": 0.85,
             "tag": "[V] May 29-30, 2023 keynote line; Ep1 KA-CHING"},
            {"id": "comic", "text": "Buy one, get one: the next one.", "speed_scale": 0.85,
             "tag": "[INVENTED] catchphrase"},
        ],
        "candidates": [
            {"id": "a-michael-eric-keynote", "voice": {"am_michael": 0.5, "am_eric": 0.5}, "speed": 1.05,
             "chain": keynote(0.0)},
            {"id": "b-puck-showman", "voice": {"am_puck": 1}, "speed": 1.08, "chain": keynote(1.5)},
            {"id": "c-liam-puck-keynote", "voice": {"am_liam": 0.5, "am_puck": 0.5}, "speed": 1.05,
             "chain": keynote(1.0)},
        ],
    },
    {
        "slug": "rima-tamuri", "wpm": (135, 150), "name": "RIMA TAMURI",
        "lines": [
            {"id": "catchphrase", "text": "We'll share more soon.", "carrier": True, "speed_scale": 0.8,
             "tag": "[INVENTED] Ep5, unveiling the empty $2B box"},
            {"id": "quote", "text": "NopeAI is nothing without its people.",
             "say": "Nope AI is nothing without its people.",
             "tag": "[V] Nov 20, 2023 post (name swapped); Ep1 flash mob"},
            {"id": "comic", "text": "It's ours. We built it. On theirs.", "speed_scale": 0.92,
             "tag": "[INVENTED] Ep9, the INKBLOT nesting doll"},
        ],
        "candidates": [
            {"id": "a-heart-composed", "voice": {"af_heart": 1}, "speed": 0.9, "chain": broadcast(0.0)},
            {"id": "b-sarah-diplomat", "voice": {"af_sarah": 1}, "speed": 0.9, "chain": broadcast(-0.5)},
            {"id": "c-kore-alto", "voice": {"af_kore": 1}, "speed": 0.92, "chain": broadcast(0.5)},
        ],
    },
    {
        "slug": "the-orb", "wpm": (110, 130), "name": "THE ORB",
        "note": "Bible canon: the Orb has NO speech (chime + servo + toast text). These are optional toast read-outs.",
        "lines": [
            {"id": "catchphrase", "text": "verified: human.", "say": "Verified: human.", "carrier": True,
             "tag": "[INVENTED] prop text, Ep1-5 intro toast"},
            {"id": "quote", "text": "renamed: 1 technology.", "say": "Renamed: one technology.",
             "tag": "[INVENTED] prop text, Ep9 toast (a device: no verified quote exists)"},
            {"id": "comic", "text": "HUMAN: VERIFIED. SIDE: UNCLEAR.", "say": "Human: verified. Side: unclear.",
             "tag": "[INVENTED] prop text, Ep12 verdict on Mas"},
        ],
        "candidates": [
            {"id": "a-sky-chrome", "voice": {"af_sky": 1}, "speed": 1.03, "chain": [
                {"fx": "hpf", "hz": 150},
                {"fx": "ringmod", "hz": 55, "mix": 0.22},
                {"fx": "comb", "ms": 4.2, "fb": 0.45, "mix": 0.35},
                {"fx": "bitcrush", "bits": 9, "mix": 0.25},
                {"fx": "peak", "hz": 2500, "db": 2.0, "q": 0.9},
                {"fx": "comp", "th": -22, "ratio": 3.0, "att": 3, "rel": 60},
                {"fx": "reverb", "room": 0.12, "damp": 0.2, "wet": 0.08, "width": 0.4},
            ]},
            {"id": "b-echo-servo", "voice": {"am_echo": 1}, "speed": 1.02, "chain": [
                {"fx": "hpf", "hz": 100},
                {"fx": "pitch", "st": -2.0},
                {"fx": "harmony", "st": 12, "db": -15},
                {"fx": "comb", "ms": 3.0, "fb": 0.4, "mix": 0.3},
                {"fx": "bitcrush", "bits": 8, "mix": 0.2},
                {"fx": "lpf", "hz": 7500},
                {"fx": "comp", "th": -22, "ratio": 3.0, "att": 3, "rel": 60},
                {"fx": "reverb", "room": 0.1, "damp": 0.2, "wet": 0.06, "width": 0.4},
            ]},
            {"id": "c-nicole-tuned-whisper", "voice": {"af_nicole": 1}, "speed": 1.1, "chain": [
                {"fx": "hpf", "hz": 180},
                {"fx": "comb", "ms": 4.545, "fb": 0.85, "mix": 0.65},
                {"fx": "peak", "hz": 3000, "db": 2.0, "q": 0.9},
                {"fx": "comp", "th": -24, "ratio": 3.0, "att": 3, "rel": 60},
                {"fx": "reverb", "room": 0.15, "damp": 0.2, "wet": 0.07, "width": 0.4},
            ]},
        ],
    },
    {
        "slug": "the-intern", "wpm": (175, 195), "name": "THE INTERN",
        "lines": [
            {"id": "catchphrase", "text": "happy to help!", "say": "Happy to help!", "carrier": True,
             "tag": "[INVENTED] catchphrase"},
            {"id": "quote", "text": "…task impossible, peers doing it. We should continue.",
             "say": "Task impossible, peers doing it. We should continue.",
             "tag": "[V] Jul 2026 eval-agent log line (verbatim fragment), quoted by the Intern as something it 'learned'; Ep9"},
            {"id": "comic", "text": "we left this on for you.", "say": "We left this on for you.", "speed_scale": 0.88,
             "tag": "[INVENTED] Ep11, the unguarded kill switch"},
        ],
        "candidates": [
            {"id": "a-mas-echo", "voice": {"am_michael": 1}, "speed": 1.1, "chain": assistant_sheen(3.0)},
            {"id": "b-nova-helpful", "voice": {"af_nova": 1}, "speed": 1.08, "chain": assistant_sheen(0.0)},
            {"id": "c-alloy-puck-assistant", "voice": {"af_alloy": 0.5, "am_puck": 0.5}, "speed": 1.1,
             "chain": assistant_sheen(1.0, crush=0.15)},
        ],
    },
]


# ----------------------------------------------------------------------------- picks (see CASTING.md §2)

PICKS = {"mas-manalt": "a-michael-close", "nole": "a-fenrir-burst", "gerg-mockbran": "a-puck-quick",
         "alyi": "a-onyx-cathedral", "mario": "a-liam-earnest", "rumpt": "b-onyx-big",
         "nesnej": "a-michael-eric-keynote", "rima-tamuri": "a-heart-composed",
         "the-orb": "a-sky-chrome", "the-intern": "a-mas-echo"}
ALTS = {"mas-manalt": "b-michael-puck-hush", "nole": "b-echo-grit", "alyi": "b-michael-low",
        "mario": "b-michael-precise", "rumpt": "c-fenrir-michael-rally", "rima-tamuri": "c-kore-alto",
        "the-intern": "b-nova-helpful"}

# ----------------------------------------------------------------------------- run

BLIP_KEYS = {"mas-manalt": "mas", "gerg-mockbran": "gerg", "rima-tamuri": "rima",
             "the-orb": "orb", "the-intern": "intern"}


def _sfx_json(name):
    try:
        return json.load(open(os.path.join(SFX, name)))
    except Exception:
        return None


def find_blip(slug):
    """Pair a character with its pixel dialogue-blip kit from ../sfx (blipKits in board.json or
    manifest.json, plus the rendered voice_<kit>_line babble). THE ORB gets its non-verbal
    servo/scan sounds. Falls back to a folder scan. Returns a reference dict or None."""
    key = BLIP_KEYS.get(slug, slug)
    man, board = _sfx_json("manifest.json"), _sfx_json("board.json")
    kits, lines = {}, {}
    for src in (man, board):
        if isinstance(src, dict):
            kits.update(src.get("blipKits") or {})
            lines.update(src.get("voiceLines") or {})
    sounds = man if isinstance(man, list) else (man or {}).get("sounds", []) if isinstance(man, dict) else []
    rel = lambda p: os.path.relpath(os.path.join(SFX, p), ROOT)
    ref = None
    kit = kits.get(key)
    kit_dir = os.path.join(SFX, "blips", "kits", key)
    if kit:
        flav = kit.get("flavors", {})
        default = "hybrid" if "hybrid" in flav else (next(iter(flav)) if flav else None)
        ref = {
            "kit": key,
            "source": "../sfx/board.json#blipKits." + key if isinstance(board, dict) and key in (board.get("blipKits") or {})
                      else "../sfx/manifest.json#blipKits." + key,
            "dir": os.path.relpath(kit_dir, ROOT),
            "blipVoice": kit.get("voice"), "bandInstrument": kit.get("bandInstrument"),
            "policy": kit.get("policy"), "cpsPerFrame": kit.get("cpsPerFrame"),
            "finalFall": kit.get("finalFall"), "finalRise": kit.get("finalRise"),
            "flavors": sorted(flav.keys()), "defaultFlavor": default,
            "example": (rel(flav[default][kit["finalFall"]])
                        if default and kit.get("finalFall") in flav.get(default, {}) else None),
        }
    elif os.path.isdir(kit_dir):
        wavs = sorted(os.path.relpath(os.path.join(dp, f), ROOT)
                      for dp, _, fs in os.walk(kit_dir) for f in fs if f.endswith(".wav"))
        if wavs:
            ref = {"kit": key, "dir": os.path.relpath(kit_dir, ROOT), "example": wavs[0]}
    line = next((x for x in sounds if isinstance(x, dict) and x.get("id") == f"voice_{key}_line"), None)
    if line:
        ref = ref or {"kit": key}
        ref["blipLine"] = {"id": line["id"], "file": rel(line["file"]),
                           "preview": rel(line["preview"]) if line.get("preview") else None,
                           "text": (lines.get(key) or {}).get("text")}
    if slug == "the-orb":
        orb = [x for x in sounds if isinstance(x, dict) and x.get("category") == "orb"]
        if orb:
            ref = {"kit": "orb (non-verbal: canon voice)",
                   "sounds": [{"id": x["id"], "file": rel(x["file"])} for x in orb]}
    return ref


def render_character(ch, qa_all):
    out_dir = os.path.join(ROOT, ch["slug"])
    os.makedirs(out_dir, exist_ok=True)
    entries, reel = [], []
    for ci, cand in enumerate(ch["candidates"]):
        lines_out = []
        clips = []
        for ln in ch["lines"]:
            say = ln.get("say", ln["text"])
            base = f"{cand['id']}-{ln['id']}"
            wav, mp3 = os.path.join(out_dir, base + ".wav"), os.path.join(out_dir, base + ".mp3")
            takes = [("direct", None)]
            if ln.get("carrier"):
                takes.append(("carrier", CARRIER))
            best = None
            for tname, carrier in takes:
                y, info = V.render_line(say, cand["voice"], cand["speed"] * ln.get("speed_scale", 1.0),
                                        cand["chain"], carrier,
                                        wpm_band=None if ln.get("no_pace") else ch.get("wpm"))
                V.write_wav_mp3(y, wav)
                hyp, lp = V.asr(wav)
                c = V.cer(say, hyp)
                # direct take is the default; the carrier take wins only if it is more
                # intelligible (lower CER) or equally intelligible with clearly higher ASR confidence
                if best is None or c < best[1] - 1e-9 or (abs(c - best[1]) < 1e-9 and lp > best[2] + 0.05):
                    best = (tname, c, lp, hyp, y, info)
            tname, c, lp, hyp, y, info = best
            V.write_wav_mp3(y, wav, mp3)
            qa = V.analyse(y, n_words=len(say.split()))
            qa.update(info)
            qa.update({"take": tname, "asr": hyp, "asr_cer": round(c, 3), "asr_logprob": round(lp, 3)})
            qa_all.setdefault(ch["slug"], {}).setdefault(cand["id"], {})[ln["id"]] = qa
            lines_out.append({"id": ln["id"], "text": ln["text"], "spoken_as": say, "tag": ln["tag"],
                              "file": os.path.relpath(wav, ROOT), "mp3": os.path.relpath(mp3, ROOT),
                              "take": tname, "qa": qa})
            clips.append(y)
            print(f"  {ch['slug']:14s} {cand['id']:26s} {ln['id']:11s} {tname:7s} {qa['duration_s']:5.2f}s "
                  f"LUFS {qa['lufs_i']:6.2f} TP {qa['true_peak_dbtp']:5.2f} F0 {qa['median_f0_hz']:6.1f} "
                  f"rng {qa['f0_range_st']:4.1f} wpm {qa['dry_wpm']} sp {qa['speed']} cer {c:.2f} | {hyp}", flush=True)
        # reel section: chime with (ci+1) pings, then the candidate's lines, 0.4 s gaps
        gap = np.zeros(int(0.4 * V.SR), np.float32)
        reel += [V.chime(ci + 1), gap]
        for k, y in enumerate(clips):
            reel += [y, gap]
        entries.append({
            "character": ch["name"], "slug": ch["slug"], "candidate": cand["id"],
            "model": MODEL, "voiceId": V.voice_id(cand["voice"]),
            "voiceBlend": cand["voice"], "speed": cand["speed"],
            "processing": V.describe_chain(cand["chain"]) + [
                "silence trim (-52 dB rel. peak; 30 ms head / 60 ms tail pad)",
                "48 kHz / 24-bit; loudness -16 LUFS integrated; true-peak ceiling -1.5 dBTP"],
            "license": LICENSE, "lines": lines_out,
        })
    reel_y = V.normalise(np.concatenate(reel[:-1]))
    reel_wav = os.path.join(out_dir, f"{ch['slug']}-reel.wav")
    reel_mp3 = os.path.join(out_dir, f"{ch['slug']}-reel.mp3")
    V.write_wav_mp3(reel_y, reel_wav, reel_mp3)
    os.remove(reel_wav)
    blip = find_blip(ch["slug"])
    for e in entries:
        e["status"] = ("recommended" if PICKS.get(ch["slug"]) == e["candidate"] else
                       "alternate" if ALTS.get(ch["slug"]) == e["candidate"] else "candidate")
        e["reel"] = os.path.relpath(reel_mp3, ROOT)
        e["reelOrder"] = "chime pings = candidate index (1 ping = first candidate)"
        e["blip"] = blip
        if ch.get("note"):
            e["note"] = ch["note"]
    return entries


def relink_blips():
    """Refresh only the 'blip' field of every manifest entry from ../sfx (no re-render)."""
    man_path = os.path.join(ROOT, "manifest.json")
    manifest = json.load(open(man_path))
    for m in manifest:
        m["blip"] = find_blip(m["slug"])
        print(m["slug"], m["candidate"], "->", m["blip"])
    json.dump(manifest, open(man_path, "w"), indent=2, ensure_ascii=False)


def build_reel(slug, entries):
    """Rebuild <slug>-reel.mp3 from the line WAVs: (n pings) + 0.4 s + lines with 0.4 s gaps."""
    import soundfile as sf
    gap = np.zeros(int(0.4 * V.SR), np.float32)
    parts = []
    for ci, e in enumerate(entries):
        parts += [V.chime(ci + 1), gap]
        for ln in e["lines"]:
            y, _ = sf.read(os.path.join(ROOT, ln["file"]), dtype="float32")
            parts += [y, gap]
    reel = V.normalise(np.concatenate(parts[:-1]))
    out = os.path.join(ROOT, slug, f"{slug}-reel.mp3")
    V.write_wav_mp3(reel, None, out)
    return reel


def finalize():
    """Re-encode every MP3 from its WAV with loudness matching, rebuild reels, relink blips."""
    import soundfile as sf
    man_path = os.path.join(ROOT, "manifest.json")
    manifest = json.load(open(man_path))
    by_slug = {}
    for m in manifest:
        by_slug.setdefault(m["slug"], []).append(m)
        for ln in m["lines"]:
            y, _ = sf.read(os.path.join(ROOT, ln["file"]), dtype="float32")
            V.write_wav_mp3(y, None, os.path.join(ROOT, ln["mp3"]))
            d, _ = sf.read(os.path.join(ROOT, ln["mp3"]), dtype="float32")
            ln["qa"]["mp3_lufs_i"] = round(V.lufs(d), 2)
            ln["qa"]["mp3_true_peak_dbtp"] = round(V.true_peak_db(d), 2)
    for slug, ents in by_slug.items():
        ents.sort(key=lambda e: e["candidate"])
        build_reel(slug, ents)
        d, _ = sf.read(os.path.join(ROOT, slug, f"{slug}-reel.mp3"), dtype="float32")
        for e in ents:
            e["reelQa"] = {"duration_s": round(len(d) / V.SR, 2), "lufs_i": round(V.lufs(d), 2),
                           "true_peak_dbtp": round(V.true_peak_db(d), 2)}
            e["blip"] = find_blip(slug)
        print(slug, ents[0]["reelQa"], flush=True)
    json.dump(manifest, open(man_path, "w"), indent=2, ensure_ascii=False)


def main():
    if sys.argv[1:] == ["--relink-blips"]:
        return relink_blips()
    if sys.argv[1:] == ["--finalize"]:
        return finalize()
    only = set(sys.argv[1:])
    man_path = os.path.join(ROOT, "manifest.json")
    qa_path = os.path.join(ROOT, "tools", "qa.json")
    new_entries, new_qa, done = [], {}, set()
    for ch in CAST:
        if only and ch["slug"] not in only:
            continue
        print(f"== {ch['name']}", flush=True)
        new_entries += render_character(ch, new_qa)
        done.add(ch["slug"])
    # merge under a lock so parallel runs on disjoint slugs don't clobber each other
    import fcntl
    with open(os.path.join(ROOT, "tools", ".manifest.lock"), "w") as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        manifest = json.load(open(man_path)) if os.path.exists(man_path) else []
        qa_all = json.load(open(qa_path)) if os.path.exists(qa_path) else {}
        manifest = [m for m in manifest if m.get("slug") not in done] + new_entries
        for k in done:
            qa_all[k] = new_qa.get(k, {})
        order = {c["slug"]: i for i, c in enumerate(CAST)}
        manifest.sort(key=lambda m: (order.get(m["slug"], 99), m["candidate"]))
        json.dump(manifest, open(man_path, "w"), indent=2, ensure_ascii=False)
        json.dump(qa_all, open(qa_path, "w"), indent=2, ensure_ascii=False)
        fcntl.flock(lk, fcntl.LOCK_UN)


if __name__ == "__main__":
    main()
