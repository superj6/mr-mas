#!/usr/bin/env python3
"""el_audition.py - Ep2 v1: audition every NEW role of cast.md §3 in ElevenLabs and pick each voice by measurement.
A copy of Ep1's method (audio/ep01/v3-el/tools/el_audition.py, locked; voices-el.md §AA, §AC2) with Ep2's tables:
the roles, their shortlists (cast.md §3), their lanes and the voices they share a scene with.

Nobody listens here. Each candidate reads one or two of the role's real lines from the Ep2 beat plans through the Ep2 EL
route (el_render.render_take: the episode's own seed per line and voice, the role's settings, the text as sent, dressed as
the episode's takes at -16 LUFS, dry), so the picked voice's audition takes ARE its film takes: the takes pass finds them
in the cache and sends nothing for them. Then every take is measured:
  * ASR (faster-whisper small.en) against the text: word recall (names excepted, apostrophe-blind) and CER;
  * F0 (the house's YIN f0_fast): the lane, and semitones from every voice that shares the role's scenes (Ep1's own takes
    of the carried voices, MARIO as his Kokoro takes, the other new roles' candidates);
  * timbre: the 2-5 kHz presence, the spectral centroid and the distance between mean MFCCs (c1-c19, 0-8 kHz);
  * pace: the audible span against the beat plan's planning length, and words a minute against the role's planned rate;
  * loudness and noise floor on the RAW ElevenLabs audio (before the dressing): integrated LUFS, true peak, the floor
    (median RMS of the frames 35 dB or more under the loudest), and speech-to-floor; the dressed take's LUFS and peak;
  * p(en) (faster-whisper small, language ID; under 0.985 fails the accent screen), clipped tails, the final contour,
    and the cepstral peak prominence (a breathiness proxy: lower = breathier).

  screen  the shortlist against the library (free listing): still listed, American, no price, Ep1's red flags, the role's
          "Never" words, resemblance words, ethnicity labels; not on file in cast-el.json, not on two shortlists. A failing
          candidate is replaced from Ep1's screened pool (audio/ep01/v3-el/casting/), nearest the lane, and logged
  render  the role's audition lines for each candidate at speed 1.0 (API: costs characters; --max-credits stops first)
  round2  Ep1 §AA2: a role's top two again at a speed fitted to the plan (ratio / 0.95, 0.80-1.00), on the same seeds
  measure every take (local): ASR and language ID once per packed clip / per voice (the encoder pass is the cost), F0,
          pace, raw loudness and floor, CPP, final contour
  scene   the neighbours (free: Ep1's takes) and every candidate's timbre features; semitones and distances
  pick    the ranking per role (penalties, then the brief's measurable qualities), joint where new roles share a scene
          (the four slots with Maya; Staffer 2 with the reporter; the Forecaster with the Driver); the crowd's passes
  cast    write the picks into audio/ep02/cast-el.json (roles, labels, say_lines), keeping every other key
  report  the tables for cast.md, from the index
  credits the characters and credits billed (the manifests' cost headers) and the subscription's counter

Outputs: audio/ep02/v1-el/auditions/index.json (every measure, the ranking, the credits) and the takes
audio/ep02/v1-el/auditions/<role>/wav/<line>__<role>-<cand>.wav (git-ignored). No lines*.json is written under auditions/,
so neither the base lock nor the beat-plan builder ever reads an audition as a take.

  PY=audio/.venv-casting/bin/python; T=audio/ep02/v1-el/tools/el_audition.py
  $PY $T screen                                                   # free listing calls only
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --max-credits 3800 [--roles selbeep,xel]
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T measure
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T scene
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T pick
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T round2 --roles humanist,bukaj,ekiel,forecaster
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T measure --roles humanist,bukaj,ekiel,forecaster
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T pick
  $PY $T cast && $PY $T report && $PY $T credits
The record of the pass (2026-10-09): show/episodes/ep02/production/v1/cast.md §3 and §8.

Library voices only, called by voice_id: no cloning, no voice design, no reference audio of anyone, no "sounds like", no
laugh or accent asked for, no voice chosen to resemble a real person (guardrails §5-§6, LEARNINGS S6). The key is read
inside ellib.py from .env, never printed.
"""
from __future__ import annotations

import argparse
import glob
import itertools
import json
import math
import os
import re
import sys
import time

sys.dont_write_bytecode = True               # never write a __pycache__ into Ep1's locked tools folder on import
import numpy as np  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402
import el_render as R  # noqa: E402

REPO = ellib.REPO
EP1_TOOLS = os.path.join(REPO, "audio/ep01/v3-el/tools")
AUD = os.path.join(REPO, "audio/ep02/v1-el/auditions")
INDEX = os.path.join(AUD, "index.json")
PREV = os.path.join(REPO, "audio/ep02/v1-el/cache/audition-previews")
PLAN = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
EP1_TAKES = os.path.join(REPO, "audio/ep01/v3-el/ep01-v35")
CREDITS_PER_CHAR = 0.54                     # Ep1's measured rate on eleven_multilingual_v2 (571 calls: 11,573 / 21,516)


def S(stab, style, speed=1.0):
    return dict(stability=stab, similarity_boost=0.75, style=style, use_speaker_boost=True, speed=speed)


RESEMBLE = ["sound-alike", "soundalike", "parody", "impression", "celebrity", "famous"]
# the roles of cast.md §3: who (the beat plan's speaker id), the audition lines (ids in the beat plans), lane (Hz), planned
# rate (wpm: _spec.py RATE), the voices that share the scenes with the semitones each needs, the settings (similarity 0.75
# and speaker boost throughout, eleven_multilingual_v2, speed 1.0: the episode's pace is measured, not imposed), the
# shortlist, the role's "Never" words for the screen, and the gender for a replacement
ROLES = {
    "selbeep": dict(
        name="SELBEEP", scenes="sc 1", lines=["e2-co-0003", "e2-co-0005"], lane=(120, 150), rate=185, gender="male",
        nb={"gerg": 1.5}, timbre_alt=["gerg"], settings=S(0.40, 0.15),
        never=["trailer", "impression", "carnival", "barker"],
        brief="a proud showman presenting to a room; bright, pleased with himself; never a carnival barker",
        cands=["z3FNMrCvtM1IHj84qvbr", "S9GPGBaMND8XWwwzxQXp", "Qziuou6kCJ2R3w53L2Zs", "PSqRw3ln34TxQZrTS6Wt"]),
    "xel": dict(
        name="XEL", scenes="sc 6", lines=["e2-a1-0036", "e2-a1-0038"], lane=(95, 130), rate=165, gender="male",
        nb={"mas": 1.5}, settings=S(0.55, 0.05),
        never=["russian", "monotone", "podcaster", "impression"],
        brief="a calm, earnest interviewer who asks long questions; warm, careful, curious; clearly unlike the real host "
              "(no deep monotone, no slowness)",
        cands=["tMvyQtpCVQ0DkixuYm6J", "qCwgiN0GsIAYwAJ1nYvZ", "6sWNMlBf4TdebygSxQGj", "GzE4TcXfh9rYCU9gVgPp"]),
    "humanist": dict(
        name="THE HUMANIST", scenes="sc 7", lines=["e2-a1-0048", "e2-a1-0050"], lane=(110, 135), rate=175, gender="male",
        nb={"tasya": 1.5}, settings=S(0.50, 0.05),
        never=["british", "english accent", "london", "impression"],
        against=["command", "authorit", "bold", "powerful", "energetic", "intense", "strong"],
        brief="soft, polite, a little caught out; neutral American accent",
        cands=["sR8sxaLJeFSh308Gi6HS", "3TStB8f3X3To0Uj5R7RK", "GhkQkxbimoIykF4iGYqh", "WGINef1wh4Hi6O62bfO8"]),
    "engineer": dict(
        name="THE DEMO ENGINEER", scenes="sc 9, 11", lines=["e2-a2-0003", "e2-a2-0038"], lane=(125, 160), rate=190,
        gender="male", nb={"chatgtp": 2.0, "rima": 1.5, "gerg": 1.5}, timbre_alt=["gerg"], settings=S(0.40, 0.15),
        never=["impression"],
        brief="presenter-bright, nervous under it; the two lines after the stream off mic, lower and closer",
        cands=["qHR09fcvu6SoDtFzqFvm", "s3TPKV1kjDlVtZbl4Ksh", "TMxtmWOrUT1sk26Pe4aA", "3sfGn775ryaDXhFWHwBg"]),
    "voice1": dict(
        name="VOICE 1", scenes="sc 9", lines=["e2-a2-0012"], lane=(85, 110), rate=None, gender="male", slot=True,
        settings=S(0.55, 0.0), never=["assistant", "impression"], brief="'Hi.' level, low",
        cands=["2Dn9vl2stwtaHkhE8iIb", "B6vvITCUlHjDGhWvQQmI", "hIru3zkEJ3dBYHTbMy2V"]),
    "voice2": dict(
        name="VOICE 2", scenes="sc 9", lines=["e2-a2-0013"], lane=(140, 155), rate=None, gender="male", slot=True,
        settings=S(0.45, 0.20), never=["impression"], brief="'Hi!' bright",
        cands=["q0IMILNRPxOgtBTS4taI", "EOVAuWqgSZN2Oel78Psj", "f5HLTX707KIM4SzJYzSz"]),
    "voice3": dict(
        name="VOICE 3", scenes="sc 9", lines=["e2-a2-0014"], lane=(110, 160), rate=None, gender="neutral", slot=True,
        settings=S(0.50, 0.05), never=["impression"], brief="'hi?' a question, neutral",
        cands=["ugwPvux61IszIA7kBQza", "wDfT0ggsNp2Lh21D10SV", "JjFExtCYfBGn1nn478bh"]),
    "voice4": dict(
        name="VOICE 4", scenes="sc 9", lines=["e2-a2-0015"], lane=(200, 215), rate=None, gender="female", slot=True,
        settings=S(0.60, 0.0), never=["breathy", "breathiness", "sultry", "seductive", "sexy", "husky"],
        say={"e2-a2-0015": "Hi..."},           # the house drops a trailing print ellipsis; here the trail is the read
        brief="'Hi...' soft and trailing, never breathy or sultry",
        cands=["9GiYR5zXBWwc0khQNQA8", "nf4MCGNSdM0hxM95ZBQR", "9q9xpGHwmkXdA4JI72IU"]),
    "staffer2": dict(
        name="STAFFER 2", scenes="sc 13", lines=["e2-a3-0002"], lane=None, rate=185, gender="female",
        nb={"staffer": 2.0, "reporter": 1.5}, settings=S(0.50, 0.0), never=["impression"],
        brief="a second plain staff read, smoothing tape on a pillar; never mocked",
        cands=["uG1JFy6xppqckhHCs2KG", "Awx8TeMHHpDzbm42nIB6", "yj30vwTGJxSHezdAGsv9", "09AoN6tYyW3VSTQqCo7C"]),
    "reporter": dict(
        name="THE TV REPORTER", scenes="sc 13", lines=["e2-a3-0005"], lane=None, rate=185, gender="female",
        nb={"staffer": 1.5, "staffer2": 1.5}, settings=S(0.50, 0.05), never=["impression"],
        brief="a press-conference question off a TV; generic, unnamed",
        cands=["kdnRe2koJdOK4Ovxn2DI", "5Bd4WV6UTiSunxizNai6", "CaJGGnGTRWSly2yoC75U"]),
    "bukaj": dict(
        name="BUKAJ", scenes="sc 14", lines=["e2-a3-0006", "e2-a3-0007"], lane=(110, 135), rate=160, gender="male",
        nb={"mas": 1.5}, settings=S(0.60, 0.0), never=["impression"],
        brief="soft, exact, warm; a scientist who'd like a week before anyone asks for a schedule",
        cands=["Dgd9MUMSyPeTgbbDIZ0t", "a6sKd2pET9A8uwzfI5Yr", "edRtkKm7qEwZ8pH9ggtf", "8z82LG47qQ2qjeeQB8lk"]),
    "ekiel": dict(
        name="EKIEL", scenes="F2.2 (sc 15), sc 18", lines=["e2-a3-0014", "e2-a4-0010"], lane=(110, 140), rate=160,
        gender="male", nb={"mario": 1.5, "alyi": 2.0}, settings=S(0.60, 0.0),
        never=["german", "impression"],
        brief="quiet, dry, squinting; says the hard thing plainly; neutral accent; never sarcastic",
        cands=["USXpAZuBZ22GqtSpuKoQ", "UQoLnPXvf18gaKpLzfb8", "Smxkoz0xiOoHo5WcSskf", "QzclONYwRWvec152I3wf"]),
    "forecaster": dict(
        name="THE FORECASTER", scenes="sc 17", lines=["e2-a3-0018", "e2-a3-0020"], lane=(110, 140), rate=175,
        gender="male", nb={"mas": 1.5, "driver": 1.5}, settings=S(0.50, 0.05), never=["impression", "smug"],
        brief="conversational, precise, kind; talks in medians; refuses without needing a number (no smugness, no martyrdom)",
        cands=["7EzWGsX10sAS4c9m9cPf", "BvZBJROETmG9wGXEdSqX", "ZoiZ8fuDWInAcwPXaVeq", "sfJopaWaOtauCD3HKX6Q"]),
    "driver": dict(
        name="THE DRIVER", scenes="sc 17", lines=["e2-a3-0017", "e2-a3-0022"], lane=None, rate=190, gender="male",
        nb={"forecaster": 1.5, "mas": 1.5}, settings=S(0.45, 0.10), never=["impression", "angry"],
        brief="an everyday voice through a car window, impatient but not angry",
        cands=["pwMBn0SsmN1220Aorv15", "J9NvviOEdVm6E7Hwdpdj", "TWUKKXAylkYxxlPe4gx0", "hP72SDESIJq2YuAblBqz"]),
    "haras": dict(
        name="HARAS", scenes="sc 19", lines=["e2-a4-0017", "e2-a4-0022"], lane=(165, 200), rate=185, gender="female",
        nb={"gerg": 1.5}, settings=S(0.50, 0.05),
        never=["irish", "northern irish", "british", "impression"],
        brief="pleasant, precise, brisk; neutral accent, never the real CFO's",
        cands=["KLdWtAstZMPBbfqaBs59", "Hh0rE70WfnSFN80K8uJC", "jemqINv7N9LKUclcLQnU", "Qin2NRfiKVQMJLxnoZaY"]),
    "crowd": dict(
        name="THE CROWD", scenes="F2.2 (sc 15)", lines=["e2-a3-0010"], lane=None, rate=None, gender=None, crowd=True,
        nb={"alyi": 0.0}, settings=S(0.40, 0.20), never=["hymn", "rally", "shout", "scream", "impression"],
        say={"e2-a3-0010": "Feel the A.G.I.! Feel the A.G.I.!"},
        brief="a holiday-party room joining Alyi's chant, warm and giddy, never a hymn or a rally: 8-12 layered reads",
        cands=["gScUm0AQVZBQ1uUp8KvE", "hxPRa8HUuKYsm1kiWDEi", "UpphzPau5vxibPYV2NeV", "tgfcQY9SGvn3GfmnNWIi",
               "scOwDtmlUjD3prqpp97I", "e5LtAIHV5cnnDfMmCZYr", "TuRE87hoehQxHAhbCMR2", "TbMNBJ27fH2U0VgpSNko",
               "dfeOmy6Uay63tNhyO99j", "3liN8q8YoeB9Hk6AboKe", "OHbs18UsFunlwffsTLNn", "fIGaHjfrR8KmMy0vGEVJ"]),
}
SLOTS = ["voice1", "voice2", "voice3", "voice4"]
JOINT = [("staffer2", "reporter"), ("forecaster", "driver")]
# the carried voices (cast.md §2), as Ep1's final film plays them: their EL v3.5 takes (dry: no tag, or O.S.), MARIO his
# Kokoro takes. A carried voice keeps Ep1's id and settings in Ep2, so its Ep1 takes stand for it.
NEIGHBOURS = {"gerg": ("gerg-mockbran", "Marcus"), "mas": ("mas-manalt", "Jeremy, spoken"), "tasya": ("tasya", "Tyler Kurk"),
              "rima": ("rima-tamuri", "Mia"), "chatgtp": ("chatgtp", "Maya"), "staffer": ("tiled-employee", "Avery"),
              "alyi": ("alyi", "Louis"), "mario": ("mario", "Kokoro am_liam")}
ETHNIC = re.compile(r"\b(white|black|brown|asian|latino|latina|hispanic|arab|jewish|indian|caucasian)\s+"
                    r"(man|woman|male|female|guy|girl|boy|american|voice|person)\b", re.I)
LIKE_RESEMBLE = re.compile(r"\b(sounds?|sounding|voice[sd]?|much|just)\s+like\b|\blike\s+(a\s+|the\s+)?(famous|celebrit|"
                           r"well-known|movie|film|tv|real\b)|\b\w+-like\b", re.I)
INTL = re.compile(r"\binternational\b|\benglish voice\b|\bnon-american\b|\bmid-?atlantic\b", re.I)
LIKE_NAME = re.compile(r"\blike\s+(?!(?:TikToks?|YouTube|Instagram|Reels|Shorts|IVR|AI)\b)[A-Z][a-z]+")   # 'like <Name>'



def jload(p):
    with open(p) as f:
        return json.load(f)


def jdump(o, p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + ".tmp", "w") as f:
        json.dump(o, f, indent=1, ensure_ascii=False)
        f.write("\n")
    os.replace(p + ".tmp", p)


def index():
    return jload(INDEX) if os.path.exists(INDEX) else dict(roles={})


def st(a, b):
    return 12 * math.log2(a / b)


def ep1_module(name):
    """an Ep1 tool module, imported read-only (no bytecode written)"""
    if EP1_TOOLS not in sys.path:
        sys.path.append(EP1_TOOLS)
    return __import__(name)


def plan_rows():
    """every beat-plan line by id: (row as el_render reads it, segment, scene, planning length)"""
    out = {}
    for p in sorted(glob.glob(os.path.join(PLAN, "*.json"))):
        seg = os.path.basename(p)[:-5]
        d = jload(p)
        for b in d.get("beats", []):
            for ln in b.get("lines") or []:
                out[ln["id"]] = dict(seg=seg, scene=b.get("scene"), beat=b.get("id"), len_s=ln.get("len_s"),
                                     delivery=ln.get("delivery"), who=ln.get("who"), text=ln.get("text"), tag=ln.get("tag") or "")
        for r in R.read_rows(p):
            if r["id"] in out:
                out[r["id"]]["row"] = r
    return out


# ============================================================================================ screen
def library_record(vid, name):
    """the library's own record (free listing search by name; the voice_id must match)"""
    for q in (name, name.split(" - ")[0].split(" – ")[0].strip()):
        try:
            r = ellib.get("/v1/shared-voices", page_size=100, search=q)
        except RuntimeError as ex:
            print("  listing error", type(ex).__name__)
            continue
        for v in r.get("voices", []):
            if v["voice_id"] == vid:
                return v
    return None


def screen_one(vid, spec, used, others):
    sl = ep1_module("cast_el")
    pool = pool_records()
    rec = pool.get(vid) or {}
    lib = library_record(vid, rec.get("name") or vid)
    v = dict(rec, **(lib or {}))
    txt = f"{v.get('name') or ''} || {v.get('description') or ''}"
    flags = []
    if lib is None:
        flags.append("not found in the shared library listing")
    flags += sl.red_flags(v)
    low = txt.lower()
    flags += [f"never:{w}" for w in spec["never"] + RESEMBLE if w in low]
    if ETHNIC.search(txt):
        flags.append("ethnicity:" + ETHNIC.search(txt).group(0))
    if INTL.search(txt):
        flags.append("accent:" + INTL.search(txt).group(0))
    m = LIKE_RESEMBLE.search(txt) or LIKE_NAME.search(txt)
    if m:
        flags.append("resemblance:" + m.group(0))
    like_ctx = [txt[max(0, x.start() - 30): x.end() + 30] for x in re.finditer(r"\blike\b", txt, re.I)]
    if vid in used:
        flags.append("on file in cast-el.json")
    if vid in others:
        flags.append("on another shortlist: " + others[vid])
    if (spec.get("gender") in ("male", "female") and v.get("gender") in ("male", "female") and spec["gender"] != v["gender"]
            and not spec.get("slot")):
        flags.append(f"gender:{v.get('gender')}")
    meas = (jload(os.path.join(REPO, "audio/ep01/v3-el/casting/measure.json")).get(vid) or {})
    return dict(voice_id=vid, name=v.get("name"), category=v.get("category"), gender=v.get("gender"), age=v.get("age"),
                accent=v.get("accent"), descriptive=v.get("descriptive"), use_case=v.get("use_case"),
                description=v.get("description"), rate=v.get("rate"), free_users_allowed=v.get("free_users_allowed"),
                usage_1y=v.get("usage_character_count_1y"), preview_url=v.get("preview_url"),
                preview_f0=meas.get("f0_med_hz"), preview_f0_range=meas.get("f0_range_st"), preview_wpm=meas.get("wpm"),
                listed=lib is not None, flags=flags, like_contexts=like_ctx, passed=not flags)


_POOL = None


def pool_records():
    global _POOL
    if _POOL is None:
        sl = jload(os.path.join(REPO, "audio/ep01/v3-el/casting/shortlist.json"))
        _POOL = {}
        for role, vs in sl["roles"].items():
            for v in vs:
                _POOL.setdefault(v["voice_id"], dict(v, ep1_role=role))
    return _POOL


def cmd_screen(a):
    cast = jload(R.CAST)
    used = {c["voice_id"] for r in cast["roles"].values() for c in r.get("candidates", [])}
    ix = index()
    out, log = {}, []
    allc = {}
    for role, spec in ROLES.items():
        for vid in spec["cands"]:
            allc.setdefault(vid, role)
    meas = jload(os.path.join(REPO, "audio/ep01/v3-el/casting/measure.json"))
    for role, spec in ROLES.items():
        if a.roles and role not in a.roles:
            continue
        others = {v: r for v, r in allc.items() if r != role}
        rows = []
        for vid in list(spec["cands"]):
            s = screen_one(vid, spec, used, others)
            rows.append(s)
            print(f"{role:10s} {('PASS' if s['passed'] else 'FAIL'):4s} {str(s['name'])[:44]:44s} f0 {s['preview_f0']} "
                  f"{s['flags'] or ''} {'like: ' + ' | '.join(s['like_contexts']) if s['like_contexts'] else ''}")
            if not s["passed"]:
                # a replacement from Ep1's screened pool: same gender, preview inside the lane (or nearest), not on file,
                # on no shortlist, passing this role's screen
                lane = spec.get("lane") or (s["preview_f0"] * 0.9, s["preview_f0"] * 1.1)
                mid = math.sqrt(lane[0] * lane[1])
                pool = [(abs(st(meas[v]["f0_med_hz"], mid)), v) for v, r in pool_records().items()
                        if v not in allc and v not in used and v in meas and meas[v].get("f0_med_hz")
                        and (not spec.get("gender") or spec["gender"] == "neutral" or gender_of(r) == spec["gender"])]
                kws = brief_words(spec)
                pool = [(d, v) for d, v in pool if not REGISTER_OUT.search((pool_records()[v].get("name") or "") + " "
                                                                         + (pool_records()[v].get("description") or ""))
                        and any(re.search(r"\b" + w + r"\b", (pool_records()[v].get("description") or "").lower())
                                for w in kws)
                        and lane[0] * 2 ** (-1 / 12) <= meas[v]["f0_med_hz"] <= lane[1] * 2 ** (1 / 12)]
                replaced = False
                for _, v in sorted(pool):
                    r2 = screen_one(v, spec, used, others)
                    if r2["passed"]:
                        r2["replaces"] = vid
                        rows.append(r2)
                        spec["cands"][spec["cands"].index(vid)] = v
                        allc[v] = role
                        log.append(dict(role=role, failed=s["name"], failed_id=vid, flags=s["flags"], replacement=r2["name"],
                                        replacement_id=v, preview_f0=r2["preview_f0"],
                                        why=f"nearest preview to the lane's middle ({mid:.0f} Hz) in Ep1's screened pool, "
                                            f"with the brief's words, that passes this role's screen"))
                        print(f"{'':10s} -> replaced by {r2['name']} ({v}, preview {r2['preview_f0']} Hz)")
                        replaced = True
                        break
                if not replaced and spec.get("lane"):
                    got = replace_from_library(spec, used, set(others) | set(allc))
                    if got:
                        _, v2, lv, f0, rng, k = got
                        r2 = screen_one(v2, spec, used, others)
                        r2.update(preview_f0=f0, preview_f0_range=rng, source="live library listing (Ep1's saved pool had "
                                  "no voice in reach with the brief's words)")
                        if r2["passed"]:
                            r2["replaces"] = vid
                            rows.append(r2)
                            spec["cands"][spec["cands"].index(vid)] = v2
                            allc[v2] = role
                            log.append(dict(role=role, failed=s["name"], failed_id=vid, flags=s["flags"],
                                            replacement=r2["name"], replacement_id=v2, preview_f0=f0, brief_score=k,
                                            why="Ep1's saved pool (the top voices per Ep1 role) had no passing voice in the "
                                                "lane with the brief's words outside a ruled-out register; from the live "
                                                "library (free listing, the pool's filters): in the lane, the best brief "
                                                "score (its words, less the words against it), then nearest the lane's middle"))
                            print(f"{'':10s} -> replaced by {r2['name']} ({v2}, preview {f0} Hz)")
        out[role] = rows
    prev = ix.get("screen") or {}
    if a.roles:                                   # a partial screen: keep the other roles' rows and replacements
        out = dict(prev.get("roles") or {}, **out)
        log = [x for x in prev.get("replacements") or [] if x["role"] not in a.roles] + log
    ix["screen"] = dict(at=time.strftime("%Y-%m-%dT%H:%M:%S"), rule=(
        "Each candidate's library record (the free listing, searched by name; the voice_id must match): still listed, "
        "Ep1's red flags (cast_el.py: a real person, a celebrity, an impression, an accent, an age or health register, a "
        "price, a category, a locale), the role's own 'Never' words, sound-alike / soundalike / parody / impression / "
        "celebrity / famous, an ethnicity label (Ep1 §AC2 passed over voices described by ethnicity), 'like' used as a "
        "resemblance ('sounds like', 'like <Name>', '<word>-like'; every other 'like' is listed with its context), not "
        "on file in cast-el.json, and on no other shortlist."), roles=out, replacements=log)
    ix["final_cands"] = dict(ix.get("final_cands") or {}, **{r: ROLES[r]["cands"] for r in ROLES if not a.roles or r in a.roles})
    jdump(ix, INDEX)
    print("replacements:", json.dumps(log, indent=1))


REGISTER_OUT = re.compile(r"sport|commentat|coach|trainer|\bdj\b|radio|preach|announc|trailer|narrat|audiobook|podcast|"
                          r"deep|baritone|bass|energetic|hype|bold|villain|character", re.I)


GENERIC = {"gentle", "calm", "kind", "friendly", "warm", "sincere"}


def brief_words(spec):
    return [w for w in re.findall(r"[a-z]+", spec["brief"].lower()) if len(w) >= 4 and w not in
            ("never", "with", "into", "someone", "else", "basement", "boxes", "moving", "little", "caught", "accent",
             "neutral", "american")] + sorted(GENERIC)


def replace_from_library(spec, used, others, n_pages=3):
    """a replacement from the live library (free listing, the pool's own filters: English, American, the role's gender,
    young or middle-aged, conversational), screened like the shortlist, ranked by the brief's own words (registers the
    brief rules out - sports, coaching, radio, narration, deep, energetic - are passed over, as Ep1 §AC2 did), then the
    preview's pitch (public CDN, free) nearest the lane's middle"""
    pool = {}
    for age in ("young", "middle_aged"):
        for page in range(n_pages):
            r = ellib.get("/v1/shared-voices", page_size=100, page=page, language="en", accent="american",
                          gender=spec["gender"], age=age, use_cases="conversational", sort="usage_character_count_1y")
            for v in r.get("voices", []):
                pool.setdefault(v["voice_id"], v)
            if not r.get("has_more"):
                break
    kws = brief_words(spec)
    sl = ep1_module("cast_el")
    ranked = []
    for vid, v in pool.items():
        txt = f"{v.get('name') or ''} || {v.get('description') or ''}"
        if (vid in used or vid in others or sl.red_flags(v) or REGISTER_OUT.search(txt) or ETHNIC.search(txt)
                or LIKE_RESEMBLE.search(txt) or LIKE_NAME.search(txt) or INTL.search(txt)
                or any(w in txt.lower() for w in spec["never"] + RESEMBLE)):
            continue
        own = set(kws) - GENERIC
        k = sum(2 if w in own else 1 for w in set(kws) if re.search(r"\b" + w + r"\b", txt.lower())) \
            - 1.5 * sum(1 for w in spec.get("against", []) if re.search(r"\b" + w, txt.lower()))
        ranked.append((-k, -(v.get("usage_character_count_1y") or 0), vid, v))
    ranked.sort(key=lambda x: x[:2])
    lane = spec["lane"]
    mid = math.sqrt(lane[0] * lane[1])
    os.makedirs(PREV, exist_ok=True)
    best = []
    for k, _, vid, v in ranked[:12]:
        pth = os.path.join(PREV, vid + ".mp3")
        if not os.path.exists(pth):
            try:
                ellib.download(v["preview_url"], pth)
            except Exception as ex:  # noqa: BLE001
                print("  no preview", v["name"], type(ex).__name__)
                continue
        f0, rng = E.f0_fast(E.decode(open(pth, "rb").read()))
        if not f0:
            continue
        inl = lane[0] <= f0 <= lane[1]
        best.append(((not inl, k, abs(st(f0, mid))), vid, v, f0, rng, -k))
        print(f"  library: {v['name'][:44]:44s} preview {f0} Hz, brief words {-k}, in lane {inl}")
    best.sort(key=lambda x: x[0])
    return best[0] if best else None


def gender_of(r):
    t = (r.get("description") or "").lower() + " " + (r.get("name") or "").lower()
    if re.search(r"\b(female|woman|she|her|girl)\b", t):
        return "female"
    if re.search(r"\b(male|man|he|his|guy|boy)\b", t):
        return "male"
    role = r.get("ep1_role") or ""
    fem = {"rima-tamuri", "neleh", "chatgtp", "adelina", "tiled-employee", "sydney", "sirrah", "a-senator", "photographer"}
    return "female" if role in fem else "male"


def cands_of(role, ix):
    return (ix.get("final_cands") or {}).get(role) or ROLES[role]["cands"]


def cand_name(vid, ix):
    for rows in ((ix.get("screen") or {}).get("roles") or {}).values():
        for r in rows:
            if r["voice_id"] == vid and r.get("name"):
                return r["name"]
    return (pool_records().get(vid) or {}).get("name") or vid


# ============================================================================================ render
class A:
    """the arguments render_take reads"""
    dry_run = False
    redress = False
    reuse = None
    budget_left = None
    target_lufs = -16.0
    vo_lufs = None


def cast_for_audition(role):
    cast = R.Cast()
    spec = ROLES[role]
    cast.roles[role] = dict(name=spec["name"], brief=spec["brief"], candidates=[])
    cast.d.setdefault("say_lines", {}).update(spec.get("say") or {})
    return cast


def cmd_render(a):
    # the recogniser runs in `measure`, once per voice over its takes joined: its 30 s encoder pass is the whole cost,
    # and on a shared, loaded machine a pass per take was minutes (2026-10-08: about 7 min a take at nice 15)
    E.asr = lambda y: ("", [])
    ix = index()
    rows = plan_rows()
    ix.setdefault("credits", dict(calls=[], chars_sent=0, credits_billed=0))
    spent_cr = sum(float(c.get("cost_header") or c["chars"] * CREDITS_PER_CHAR)
                   for p in glob.glob(os.path.join(AUD, "*/manifest.json")) for c in jload(p).get("calls", []))
    if "subscription_before" not in ix:
        ix["subscription_before"] = dict(ellib.subscription(), checked_at=time.strftime("%Y-%m-%dT%H:%M:%S"))
    for role, spec in ROLES.items():
        if a.roles and role not in a.roles:
            continue
        cast = cast_for_audition(role)
        out = os.path.join(AUD, role)
        for sub in ("wav", "wav-device"):
            os.makedirs(os.path.join(out, sub), exist_ok=True)
        man = R.load_manifest(out)
        rr = ix["roles"].setdefault(role, dict(candidates=[]))
        have = {c["voice_id"]: c for c in rr["candidates"]}
        letters = "ABCDEFGHIJKL"
        for k, vid in enumerate(cands_of(role, ix)):
            if a.only and vid not in a.only:
                continue
            c = dict(cand=letters[k], voice_id=vid, voice_name=cand_name(vid, ix), settings=dict(spec["settings"]),
                     model="eleven_multilingual_v2", source="shared Voice Library (a professional or high-quality voice of "
                                                            "its owner), used by voice_id")
            ent = have.get(vid) or dict(cand=c["cand"], voice_id=vid, name=c["voice_name"], settings=c["settings"], takes=[])
            for lid in spec["lines"]:
                row = rows[lid]["row"]
                sent = R.text_to_send(row, cast, role, voice_id=vid)
                key = R.request_key(vid, c["model"], c["settings"], sent, R.seed_of(lid, vid), cast.d.get("output_format"))
                cached = os.path.exists(os.path.join(REPO, cast.d["cache_dir"], key + ".mp3"))
                est = 0 if cached else len(sent) * CREDITS_PER_CHAR
                if spent_cr + est > a.max_credits:
                    jdump(ix, INDEX)
                    raise SystemExit(f"budget: {role}/{c['voice_name']} {lid} would pass {a.max_credits} credits "
                                     f"(spent {spent_cr:.0f})")
                n0 = len(man["calls"])
                rec, n = R.render_take(row, role, c, {}, cast, out, man, A, lambda s: print(s, flush=True))
                for call in man["calls"][n0:]:
                    spent_cr += float(call.get("cost_header") or call["chars"] * CREDITS_PER_CHAR)
                R.save_manifest(out, man)
                t = dict(line=lid, text=row["text"], sent=rec["sent"], tag=row["tag"], file=rec["file"],
                         file_device=rec.get("file_device"), seed=rec["seed"], key=rec["key"], chars=len(rec["sent"]),
                         planned_s=rows[lid]["len_s"], seg=rows[lid]["seg"], scene=rows[lid]["scene"],
                         delivery=rows[lid]["delivery"], measured=rec["measured"], qa=rec["qa"], raw=rec["raw"],
                         offset_s=rec["offset_s"])
                ent["takes"] = [x for x in ent["takes"] if x["line"] != lid] + [t]
                print(f"{role:10s} {c['cand']} {c['voice_name'][:36]:36s} {lid} span {rec['measured']['span_s']:.2f}s "
                      f"(plan {rows[lid]['len_s']}) f0 {rec['qa']['median_f0_hz']}", flush=True)
            if vid not in have:
                rr["candidates"].append(ent)
                have[vid] = ent
            jdump(ix, INDEX)
    jdump(ix, INDEX)
    print(f"credits so far: {spent_cr:.0f} billed (from the manifests' cost headers)")


def cmd_round2(a):
    """Ep1 §AA2's round 2: the role's top two (the current ranking) read again at a speed fitted to the plan's pace, on the
    episode's seeds: speed = the round-1 length/plan ratio / 0.95, to 0.05, within 0.80-1.00 (Ep1 cast down to 0.78); a
    voice already inside the band at 1.0 keeps its round 1. These are the takes the film would play."""
    E.asr = lambda y: ("", [])                    # the recogniser runs in `measure`
    ix = index()
    rows = plan_rows()
    spent_cr = sum(float(c.get("cost_header") or c["chars"] * CREDITS_PER_CHAR)
                   for p in glob.glob(os.path.join(AUD, "*/manifest.json")) for c in jload(p).get("calls", []))
    for role in a.roles:
        spec = ROLES[role]
        rk = ix["rankings"][role][: a.top]
        rr = ix["roles"][role]
        cast = cast_for_audition(role)
        out = os.path.join(AUD, role)
        man = R.load_manifest(out)
        for r in rk:
            ratio = r["span_vs_plan"]
            speed = min(1.0, max(0.80, round(ratio / 0.95 / 0.05) * 0.05))
            if ratio >= 1 / 1.15 or speed >= 0.975:          # already inside the band at speed 1.0
                print(f"{role}: {r['name']} at {ratio:.2f} of the plan: round 1 stands (speed 1.0)")
                continue
            c0 = next(c for c in rr["candidates"] if c["voice_id"] == r["voice_id"])
            c = dict(cand=c0["cand"] + "2", voice_id=c0["voice_id"], voice_name=c0["name"],
                     settings=dict(spec["settings"], speed=round(speed, 2)), model="eleven_multilingual_v2",
                     source=c0.get("source"))
            ent = dict(cand=c["cand"], voice_id=c["voice_id"], name=c0["name"], settings=c["settings"], round=2,
                       fitted_from=dict(span_vs_plan=ratio, rule="speed = ratio / 0.95, to 0.05, within 0.80-1.00"), takes=[])
            for lid in spec["lines"]:
                row = rows[lid]["row"]
                sent = R.text_to_send(row, cast, role, voice_id=c["voice_id"])
                if spent_cr + len(sent) * CREDITS_PER_CHAR > a.max_credits:
                    raise SystemExit(f"budget: {role} round 2 would pass {a.max_credits} (spent {spent_cr:.0f})")
                n0 = len(man["calls"])
                rec, n = R.render_take(row, role, c, {}, cast, out, man, A, lambda s_: print(s_, flush=True))
                for call in man["calls"][n0:]:
                    spent_cr += float(call.get("cost_header") or call["chars"] * CREDITS_PER_CHAR)
                R.save_manifest(out, man)
                ent["takes"].append(dict(line=lid, text=row["text"], sent=rec["sent"], tag=row["tag"], file=rec["file"],
                                         file_device=rec.get("file_device"), seed=rec["seed"], key=rec["key"],
                                         chars=len(rec["sent"]), planned_s=rows[lid]["len_s"], seg=rows[lid]["seg"],
                                         scene=rows[lid]["scene"], delivery=rows[lid]["delivery"], measured=rec["measured"],
                                         qa=rec["qa"], raw=rec["raw"], offset_s=rec["offset_s"]))
                print(f"{role:10s} {c['cand']} {c0['name'][:30]:30s} {lid} speed {speed:.2f} span {rec['measured']['span_s']:.2f}s "
                      f"(plan {rows[lid]['len_s']})", flush=True)
            rr["round2"] = [e for e in rr.get("round2", []) if e["voice_id"] != c["voice_id"]] + [ent]
            jdump(ix, INDEX)
    print(f"credits so far: {spent_cr:.0f}")


# ============================================================================================ measure
_ML = None


def ml():
    global _ML
    if _ML is None:
        from faster_whisper import WhisperModel
        _ML = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
    return _ML


def p_en(y48):
    from scipy.signal import resample_poly
    y16 = resample_poly(np.asarray(y48, dtype=np.float64), 1, 3).astype(np.float32)
    _, info = ml().transcribe(y16, language=None, beam_size=1, condition_on_previous_text=False, vad_filter=False)
    # the language ID is made eagerly on the first 30 s (one encoder pass); the transcript generator is never consumed
    return round(float(dict(info.all_language_probs or []).get("en", 0.0)), 4)


def load(path):
    import soundfile as sf
    p = os.path.join(REPO, path)
    if p.endswith(".mp3"):
        return E.decode(open(p, "rb").read())
    y, sr = sf.read(p, dtype="float32", always_2d=True)
    y = y.mean(axis=1)
    if sr != E.SR:
        from scipy.signal import resample_poly
        g = math.gcd(E.SR, sr)
        y = resample_poly(y.astype(np.float64), E.SR // g, sr // g).astype(np.float32)
    return y


def raw_floor(y):
    """the raw take's noise floor: the 5th percentile of its 20 ms frames' RMS (dBFS; the raw files have almost no silent
    head or tail, so a percentile reads the gaps between words), and speech-to-floor: the median of the frames within
    20 dB of the loudest, minus that floor. The house bed sits about 45 dB under the dialogue (-62 dBFS under -16 LUFS),
    so a floor less than 45 dB under the speech is louder than the bed it will sit on"""
    n = int(0.02 * E.SR)
    m = len(y) // n
    r = 20 * np.log10(np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1)) + 1e-7)
    floor = float(np.percentile(r, 5))
    speech = float(np.median(r[r >= r.max() - 20]))
    return dict(floor_p5_dbfs=round(floor, 1), speech_to_floor_db=round(speech - floor, 1))


def raw_levels(y):
    """the raw ElevenLabs audio: integrated LUFS, true peak, the noise floor (median RMS in dBFS of the 20 ms frames 35 dB
    or more under the loudest frame; digital silence counts as -120) and speech-to-floor (the median of the frames within
    20 dB of the loudest, minus the floor)"""
    n = int(0.02 * E.SR)
    m = len(y) // n
    fr = y[: m * n].reshape(m, n)
    r = 20 * np.log10(np.sqrt(np.mean(fr ** 2, axis=1)) + 1e-6)
    top = r.max()
    quiet = r[r <= top - 35]
    floor = float(np.median(quiet)) if len(quiet) else float(r.min())
    speech = float(np.median(r[r >= top - 20]))
    return dict(lufs=round(E.lufs(y), 2), true_peak_dbtp=round(E.true_peak_db(y), 2), floor_dbfs=round(max(floor, -120.0), 1),
                speech_to_floor_db=round(speech - max(floor, -120.0), 1), quiet_frames=int(len(quiet)),
                plr_db=round(E.true_peak_db(y) - E.lufs(y), 1))


def cpp(y48):
    """cepstral peak prominence (dB), the median over loud frames: a breathiness proxy (lower = breathier). 40 ms frames,
    10 ms hop at 16 kHz; the power cepstrum's peak in 60-330 Hz quefrency over its regression line (1 ms up)"""
    from scipy.signal import resample_poly
    y = resample_poly(np.asarray(y48, dtype=np.float64), 1, 3)
    sr, n, h, nf = 16000, 640, 160, 2048
    win = np.hanning(n)
    fr = [y[i: i + n] * win for i in range(0, len(y) - n, h)]
    if not fr:
        return None
    fr = np.array(fr)
    rms = 20 * np.log10(np.sqrt(np.mean(fr ** 2, axis=1)) + 1e-9)
    fr = fr[rms > rms.max() - 25]
    q = np.arange(nf // 2) / sr
    lo, hi = int(sr / 330), int(sr / 60)
    reg = (q >= 0.001) & (q <= q[hi])
    vals = []
    for f in fr:
        spec = np.log(np.abs(np.fft.rfft(f, nf)) ** 2 + 1e-12)
        cep = 10 * np.log10(np.abs(np.fft.irfft(spec)[: nf // 2]) ** 2 + 1e-12)
        k = lo + int(np.argmax(cep[lo:hi]))
        b, c0 = np.polyfit(q[reg], cep[reg], 1)
        vals.append(cep[k] - (b * q[k] + c0))
    return round(float(np.median(vals)), 2) if vals else None


def final_contour(y):
    """the last 0.25 s of loud voiced speech against the take's median, in semitones (a question rises; a statement falls)"""
    import librosa
    from scipy.signal import resample_poly
    y16 = resample_poly(np.asarray(y, dtype=np.float64), 1, 3)
    f0 = librosa.yin(y16, fmin=55, fmax=420, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][: len(f0)]
    f0 = f0[: len(rms)]
    idx = np.where(20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12) > -28)[0]
    if len(idx) < 10:
        return None
    med = np.median(f0[idx])
    ok = idx[np.abs(12 * np.log2(f0[idx] / med)) <= 9]
    tail = ok[ok >= ok[-1] - 25]
    return round(float(12 * np.log2(np.median(f0[tail]) / med)), 2)


LETTERS = re.compile(r"\b([A-Za-z])(?:[\s.\-]+([A-Za-z])\b)(?:[\s.\-]+([A-Za-z])\b)?(?:[\s.\-]+([A-Za-z])\b)?\.?")


def join_letters(t):
    """a spelled acronym as one word on both sides ('A .G .I.', 'A-G-I', 'A. G. I.' -> 'AGI'), so the recogniser's
    spelling of letters isn't counted as lost words"""
    return LETTERS.sub(lambda m: "".join(g for g in m.groups() if g).upper(), t or "")


SPELLINGS = [(re.compile(r"\balright\b", re.I), "all right"), (re.compile(r"\bokay\b", re.I), "OK")]


def recall_noapos(text, asr, names):
    """word recall, names excepted, blind to apostrophes, spelled letters joined, and a spelling the recogniser chooses
    ('alright' / 'all right') counted as the same words"""
    text, asr = join_letters(text), join_letters(asr)
    for rx, rep in SPELLINGS:
        text, asr = rx.sub(rep, text), rx.sub(rep, asr or "")
    return E.word_recall(text.replace("'", "").replace("’", ""), (asr or "").replace("'", ""), {n.replace("'", "") for n in names})


GAP_S = 1.5


def packed(takes, key="file"):
    """a voice's takes joined into one clip (each take's audible part with 0.15 s either side, 1.5 s of silence between)
    -> (clip, [(take, t0, t1)]) in clip time"""
    parts, wins, t = [], [], 0.0
    for x in takes:
        y = load(x[key])
        m = x["measured"]
        a0 = max(0, int((m["audible_in_s"] - 0.15) * E.SR))
        a1 = min(len(y), int((m["audible_out_s"] + 0.15) * E.SR))
        seg = y[a0:a1]
        wins.append((x, t, t + len(seg) / E.SR))
        parts += [seg, np.zeros(int(GAP_S * E.SR), np.float32)]
        t += len(seg) / E.SR + GAP_S
    return np.concatenate(parts), wins


def asr_split(clip, wins):
    """one recogniser pass (the house's: faster-whisper small.en, beam 5, word timestamps) over a joined clip; each word
    goes to the take whose window holds its midpoint (a word in a gap goes to the nearer take)"""
    _, ws = E.asr(clip)
    out = {id(x): [] for x, _, _ in wins}
    for w, w0, w1 in ws:
        mid = (w0 + w1) / 2
        x = min(wins, key=lambda r: 0 if r[1] <= mid <= r[2] else min(abs(mid - r[1]), abs(mid - r[2])))[0]
        out[id(x)].append(w)
    return {k: " ".join(v).strip() for k, v in out.items()}


def units_to_windows(units, cap=28.0):
    """pack recogniser units (a voice's takes) into clips of at most `cap` seconds: never two units with the same key in
    one clip (a role's voices share a key, the four slots' 'hi's share one), so no window hears a line twice"""
    wins = []
    for u in sorted(units, key=lambda u: -u["dur"]):
        for w in wins:
            if w["dur"] + u["dur"] <= cap and u["key"] not in w["keys"]:
                w["units"].append(u)
                w["dur"] += u["dur"]
                w["keys"].add(u["key"])
                break
        else:
            wins.append(dict(units=[u], dur=u["dur"], keys={u["key"]}))
    return wins


def take_dur(t):
    return t["measured"]["audible_out_s"] - t["measured"]["audible_in_s"] + 0.3 + GAP_S


def cmd_measure(a):
    """every take, locally. The recogniser's 30 s encoder pass is the cost, so its clips are packed: each voice's takes
    joined, and voices of DIFFERENT roles packed together up to 28 s (the four slots count as one role), so no window
    hears the same line twice; each word goes back to its take by time. The language ID runs once per voice on
    its own takes joined (p(en) per voice; Ep1 measured it per take); one-syllable slot reads get no accent measure.
    The reporter's TV copy is recognised as its own unit."""
    ix = index()
    names = set(n.lower() for n in jload(R.CAST).get("names", []))
    cdir = os.path.join(REPO, "audio/ep02/v1-el/cache")
    units = []
    for role, rr in ix["roles"].items():
        if a.roles and role not in a.roles:
            continue
        spec = ROLES[role]
        cands = [c for c in rr["candidates"] + rr.get("round2", []) if a.force or any(not t.get("m") for t in c["takes"])]
        if not cands:
            continue
        key = "slot" if spec.get("slot") else role
        for c in cands:
            units.append(dict(role=role, key=key, cands=[c], takes=c["takes"], dur=sum(take_dur(t) for t in c["takes"]),
                              dev=False))
            for t in c["takes"]:
                if t.get("file_device"):
                    units.append(dict(role=role, key=key, cands=[c], takes=[t], dur=take_dur(t), dev=True))
    wins = units_to_windows(units)
    print(f"measure: {len(units)} units in {len(wins)} recogniser clips", flush=True)
    asr_of, tv_of = {}, {}
    for w in wins:
        items = [(u, dict(t, file=t["file_device"]) if u["dev"] else t, t) for u in w["units"] for t in u["takes"]]
        clip, tw = packed([x for _, x, _ in items])
        got = asr_split(clip, tw)
        for (u, x, t), (xx, _, _) in zip(items, tw):
            (tv_of if u["dev"] else asr_of)[id(t)] = got[id(xx)]
        print(f"  clip {w['dur']:.1f} s: {sorted(w['keys'])}", flush=True)
        for u in [u for u in w["units"] if not u["dev"]]:
            spec = ROLES[u["role"]]
            for c in u["cands"]:
                r1 = next((x for x in ix["roles"][u["role"]]["candidates"] if x["voice_id"] == c["voice_id"]
                           and x is not c and x["takes"] and x["takes"][0].get("m")), None)
                pe = None if spec.get("slot") else (r1["takes"][0]["m"]["p_en"] if r1 else p_en(packed(c["takes"])[0]))
                for t in c["takes"]:
                    y = load(t["file"])
                    raw = E.decode(open(os.path.join(cdir, t["key"] + ".mp3"), "rb").read())
                    m, q, plan = t["measured"], t["qa"], t.get("planned_s")
                    asr_txt = asr_of[id(t)]
                    tv = None
                    if t.get("file_device"):
                        tv = dict(asr=None, recall=None)          # filled when its own unit's clip is recognised
                    t["m"] = dict(
                        span_s=m["span_s"], wpm=m["wpm"], sps=m["articulation_sps"], pauses_s=m["pauses_s"],
                        planned_s=plan, span_vs_plan=round(m["span_s"] / plan, 3) if plan else None,
                        f0=q["median_f0_hz"], f0_range_st=q["f0_range_st"], final_st=final_contour(y),
                        asr=asr_txt, recall=recall_noapos(t["text"], asr_txt, names),
                        cer=E.cer(t["text"], asr_txt), tail_cut=q["raw_tail_cut"], p_en=pe,
                        p_en_scope=None if pe is None else "the voice's takes joined",
                        cpp_db=cpp(y), raw=dict(raw_levels(raw), **raw_floor(raw)),
                        dressed=dict(lufs=q["lufs_i"], true_peak_dbtp=q["true_peak_dbtp"]), device=tv)
                    print(f"{u['role']:10s} {c['cand']} {c['name'][:30]:30s} {t['line']} f0 {q['median_f0_hz']} "
                          f"rng {q['f0_range_st']} wpm {m['wpm']} span/plan {t['m']['span_vs_plan']} rec {t['m']['recall']:.2f} "
                          f"p_en {pe} cpp {t['m']['cpp_db']} s2f {t['m']['raw']['speech_to_floor_db']} fin {t['m']['final_st']} "
                          f"asr {asr_txt!r}", flush=True)
        jdump(ix, INDEX)
    for u in units:                                       # the TV copies (their clips may come before or after their takes)
        if u["dev"]:
            for t in u["takes"]:
                if t.get("m") and id(t) in tv_of:
                    t["m"]["device"] = dict(asr=tv_of[id(t)], recall=recall_noapos(t["text"], tv_of[id(t)], names))
    jdump(ix, INDEX)


# ============================================================================================ scene
def feats(path):
    """median F0, spectral centroid, 2-5 kHz presence and mean MFCCs (c1-c19, 0-8 kHz) of the take's audible part"""
    import librosa
    y = load(path)
    d = E.rms_db(y, 0.01)
    idx = np.where(d > -40)[0]
    y = y[int(idx[0] * 0.01 * E.SR): int((idx[-1] + 1) * 0.01 * E.SR)]
    med, _ = E.f0_fast(y)
    y16 = librosa.resample(y, orig_sr=E.SR, target_sr=16000)
    Sp = np.abs(librosa.stft(y16, n_fft=512, hop_length=160)) ** 2
    fr = librosa.fft_frequencies(sr=16000, n_fft=512)
    e = Sp.sum(axis=0)
    act = e > e.max() * 10 ** (-3.5)
    Sa = Sp[:, act]
    mf = librosa.feature.mfcc(y=y16, sr=16000, n_mfcc=20, n_fft=512, hop_length=160, fmax=8000)[:, act]
    return dict(f0=med, cen=float((fr[:, None] * Sa).sum() / Sa.sum()),
                pres=10 * math.log10(Sa[(fr >= 2000) & (fr < 5000)].sum() / Sa[(fr >= 100) & (fr < 2000)].sum()),
                mfcc=mf[1:].mean(axis=1).tolist(), n=int(act.sum()))


def agg(fs):
    f0s = [f["f0"] for f in fs if f["f0"]]
    w = np.array([f["n"] for f in fs], dtype=float)
    return dict(f0=float(np.exp(np.mean(np.log(f0s)))) if f0s else None, cen=float(np.average([f["cen"] for f in fs], weights=w)),
                pres=float(np.average([f["pres"] for f in fs], weights=w)),
                mfcc=np.average(np.array([f["mfcc"] for f in fs]), axis=0, weights=w).tolist(), takes=len(fs))


def neighbour_files(key, limit=24):
    role, _ = NEIGHBOURS[key]
    out = []
    for p in sorted(glob.glob(os.path.join(EP1_TAKES, "*/lines-A.json"))):
        for r in jload(p):
            el = r.get("el") or {}
            slug = el.get("role") or r.get("speaker_slug")
            if slug != role or (r.get("tag") or "") not in ("", "O.S."):
                continue
            if role == "mario" and r.get("engine") != "kokoro":
                continue
            if os.path.exists(os.path.join(REPO, r["file"])):
                out.append(r["file"])
    out = sorted(set(out))
    if len(out) > limit:                        # an even spread over the episode
        out = [out[int(i * len(out) / limit)] for i in range(limit)]
    return out


def cmd_scene(a):
    ix = index()
    nb = {}
    for k in NEIGHBOURS:
        files = neighbour_files(k)
        fs = [feats(p) for p in files]
        g = agg(fs)
        # the voice's own spread: the mean-MFCC distance between two halves of its takes (odd / even), the yardstick for
        # "a clearly different timbre"
        selfd = None
        if len(fs) > 3:
            h0, h1 = agg(fs[0::2]), agg(fs[1::2])
            selfd = float(np.linalg.norm(np.array(h0["mfcc"]) - np.array(h1["mfcc"])))
        nb[k] = dict(voice=NEIGHBOURS[k][1], role=NEIGHBOURS[k][0], f0_geo=round(g["f0"], 1), centroid_hz=round(g["cen"]),
                     presence_db=round(g["pres"], 2), mfcc=[round(x, 3) for x in g["mfcc"]], takes=len(files),
                     self_mfcc_dist=round(selfd, 1) if selfd else None, files=files)
        print(f"neighbour {k:8s} {NEIGHBOURS[k][1]:16s} f0 {g['f0']:.1f} cen {g['cen']:.0f} pres {g['pres']:.2f} "
              f"takes {len(files)} self-dist {nb[k]['self_mfcc_dist']}", flush=True)
    ix["neighbours"] = nb
    for role, rr in ix["roles"].items():
        for c in rr["candidates"]:
            fs = [feats(t["file"]) for t in c["takes"]]
            g = agg(fs)
            c["feats"] = dict(f0_geo=round(g["f0"], 1) if g["f0"] else None, centroid_hz=round(g["cen"]),
                              presence_db=round(g["pres"], 2), mfcc=[round(x, 3) for x in g["mfcc"]])
    # the self-distance of a new voice: its two takes against each other (roles with two lines)
    jdump(ix, INDEX)
    print("scene features written")


# ============================================================================================ pick
def dist(m1, m2):
    return round(float(np.linalg.norm(np.array(m1) - np.array(m2))), 1)


def voice_stats(c):
    t = [x["m"] for x in c["takes"]]
    tp = [x["m"] for x in c.get("pace_takes") or c["takes"]]
    f0s = [x["f0"] for x in t if x["f0"]]
    f0 = float(np.exp(np.mean(np.log(f0s)))) if f0s else None
    return dict(f0=f0, recall=min(x["recall"] for x in t), tail_cuts=sum(1 for x in t if x["tail_cut"]),
                p_en=float(np.mean([x["p_en"] for x in t if x["p_en"] is not None])) if any(x["p_en"] is not None for x in t) else None, f0_range=float(np.median([x["f0_range_st"] for x in t if x["f0_range_st"] is not None] or [0])),
                span_vs_plan=float(np.exp(np.mean(np.log([x["span_vs_plan"] for x in tp if x["span_vs_plan"]])))) if any(x["span_vs_plan"] for x in tp) else None,
                wpm=float(np.median([x["wpm"] for x in tp if x["wpm"]])), cpp=float(np.median([x["cpp_db"] for x in t if x["cpp_db"] is not None])),
                floor=max(x["raw"]["floor_p5_dbfs"] for x in t), s2f=min(x["raw"]["speech_to_floor_db"] for x in t),
                raw_lufs=float(np.mean([x["raw"]["lufs"] for x in t])), final=[x["final_st"] for x in t])


def penalties(role, c, ix, partner=None):
    """the score of one voice for one role, lower is better (each term in points):
    lane: semitones outside the lane (median F0 over the takes, geometric);
    separation: per scene neighbour, semitones short of the gap the role needs (cast.md); where cast.md allows 'or a
      clearly different timbre', a gap short in pitch costs nothing if the mean-MFCC distance is at least 1.5x the
      neighbour's own take-to-take spread (its self-distance) - otherwise half points;
    accent: p(en) under 0.985, 1 point per 0.01 (mean over the takes);
    clean: 2 per clipped tail and 2 per take with ASR recall under 0.9;
    noise: 1 point per 5 dB the raw speech-to-floor ratio (raw_floor) falls under 45 dB, the house bed's depth under the
      dialogue (-62 dBFS under -16 LUFS), on the voice's worse take;
    pace: 1 point per 10 % the audible length falls outside +/-15 % of the beat plan's planning length (geometric mean
      over the takes; speed is a setting, so this is a lighter term: a pick outside it gets a fitted speed)."""
    spec = ROLES[role]
    s = voice_stats(c)
    pen = {}
    if spec.get("lane") and s["f0"]:
        lo, hi = spec["lane"]
        pen["lane"] = 0.0 if lo <= s["f0"] <= hi else abs(st(s["f0"], lo if s["f0"] < lo else hi))
    sep, detail = 0.0, {}
    for n, need in (spec.get("nb") or {}).items():
        if need <= 0:
            continue
        if n in ix["neighbours"]:
            nf, nm, selfd = ix["neighbours"][n]["f0_geo"], ix["neighbours"][n]["mfcc"], ix["neighbours"][n]["self_mfcc_dist"]
        elif partner and n in partner:
            pc = partner[n]
            nf, nm, selfd = pc["feats"]["f0_geo"], pc["feats"]["mfcc"], None
        else:
            continue
        gap = st(s["f0"], nf)
        d = dist(c["feats"]["mfcc"], nm)
        short = max(0.0, need - abs(gap))
        if short and n in (spec.get("timbre_alt") or []) and selfd:
            short = 0.0 if d >= 1.5 * selfd else short / 2
        sep += short
        detail[n] = dict(st=round(gap, 2), need=need, mfcc_dist=d, short=round(short, 2))
    pen["separation"] = sep
    pen["accent"] = max(0.0, (0.985 - s["p_en"]) * 100) if s["p_en"] is not None else 0.0
    per = len(spec["lines"]) / len(c["takes"])          # a voice heard in two rounds isn't counted twice (Ep1)
    pen["clean"] = per * (2.0 * s["tail_cuts"] + 2.0 * sum(1 for x in c["takes"] if x["m"]["recall"] < 0.9))
    pen["noise"] = max(0.0, (45.0 - s["s2f"]) / 5.0)
    if s["span_vs_plan"] and not spec.get("slot") and not spec.get("crowd"):
        r = s["span_vs_plan"]
        pen["pace"] = max(0.0, abs(math.log(r)) - math.log(1.15)) / math.log(1.10)
    return round(sum(pen.values()), 2), {k: round(v, 2) for k, v in pen.items()}, detail, s


def brief_points(role, c, s):
    """the brief's measurable qualities, a tie-break (lower is better), each 1 point:
    selbeep: a showman's range (F0 range under 8 st) / a trailer voice (F0 under 100 Hz);
    xel: a monotone (F0 range under 6 st) / slow (under 150 wpm);
    humanist, bukaj: bright, not soft (2-5 kHz presence over -14 dB);
    engineer: the off-mic line not lower than the presenter line (its F0 at or above the on-stage take's);
    ekiel: sarcasm's wide swings (F0 range over 9 st);
    forecaster: outside 155-195 wpm (conversational); driver: under 175 wpm (impatient); haras: under 170 wpm (brisk);
    reporter: a question that lands flat (final under +1 st) or a TV copy the recogniser misreads (recall under 0.9);
    voice3: a question that doesn't rise (final under +2 st); voice4 and every slot: CPP under 9 dB (breathy);
    every role: CPP under 9 dB (breathy) and a recall under 1.0 on any take."""
    p, why = 0, []
    t = {x["line"]: x["m"] for x in c["takes"]}
    if role == "selbeep":
        if s["f0_range"] < 8: p, why = p + 1, why + ["narrow range"]
        if s["f0"] < 100: p, why = p + 1, why + ["trailer register"]
    if role == "xel":
        if s["f0_range"] < 6: p, why = p + 1, why + ["monotone"]
        if s["wpm"] < 150: p, why = p + 1, why + ["slow"]
    if role in ("humanist", "bukaj") and c["feats"]["presence_db"] > -14:
        p, why = p + 1, why + ["bright, not soft"]
    if role == "engineer":
        on, off = t.get("e2-a2-0003"), t.get("e2-a2-0038")
        if on and off and on["f0"] and off["f0"] and off["f0"] >= on["f0"]:
            p, why = p + 1, why + ["off-mic line not lower"]
    if role == "ekiel" and s["f0_range"] > 9:
        p, why = p + 1, why + ["wide swings"]
    if role == "forecaster" and not (155 <= s["wpm"] <= 195):
        p, why = p + 1, why + ["not conversational pace"]
    if role == "driver" and s["wpm"] < 175:
        p, why = p + 1, why + ["not impatient"]
    if role == "haras" and s["wpm"] < 170:
        p, why = p + 1, why + ["not brisk"]
    if role == "reporter":
        m = t.get("e2-a3-0005")
        if m and (m["final_st"] is None or m["final_st"] < 1.0):
            p, why = p + 1, why + ["question lands flat"]
        if m and m.get("device") and m["device"]["recall"] < 0.9:
            p, why = p + 1, why + ["TV copy misheard"]
    if role == "voice3":
        m = t.get("e2-a2-0014")
        if m and (m.get("rise_st") is None or m["rise_st"] < 2.0):
            p, why = p + 1, why + ["no rise"]
    if s["cpp"] is not None and s["cpp"] < 9.0:
        p, why = p + 1, why + ["breathy (CPP)"]
    if any(x["m"]["recall"] < 1.0 for x in c["takes"]):
        p, why = p + 1, why + ["ASR not verbatim"]
    return p, why


def merged(role, ix):
    """each voice over all its takes (round 1 and round 2); its pace from the round the film would use (round 2 when
    there is one), with that round's speed"""
    r2 = {e["voice_id"]: e for e in ix["roles"][role].get("round2", [])}
    out = []
    for c in ix["roles"][role]["candidates"]:
        e = r2.get(c["voice_id"])
        out.append(dict(c, takes=c["takes"] + (e["takes"] if e else []), pace_takes=e["takes"] if e else c["takes"],
                        speed=(e or c)["settings"]["speed"], round2=bool(e)))
    return out


def rank_role(role, ix, partner=None):
    rows = []
    for c in merged(role, ix):
        sc, pen, det, s = penalties(role, c, ix, partner)
        bp, bwhy = brief_points(role, c, s)
        rows.append(dict(cand=c["cand"], voice_id=c["voice_id"], name=c["name"], score=sc, penalties=pen, vs=det,
                         brief_points=bp, brief_notes=bwhy, f0=round(s["f0"], 1) if s["f0"] else None,
                         f0_range_st=round(s["f0_range"], 1), wpm=round(s["wpm"], 1),
                         span_vs_plan=round(s["span_vs_plan"], 3) if s["span_vs_plan"] else None,
                         p_en=round(s["p_en"], 4) if s["p_en"] is not None else None, recall_min=round(s["recall"], 2), tail_cuts=s["tail_cuts"],
                         cpp_db=round(s["cpp"], 2) if s["cpp"] is not None else None, raw_floor_dbfs=s["floor"],
                         speech_to_floor_db=s["s2f"], raw_lufs=round(s["raw_lufs"], 1),
                         presence_db=c["feats"]["presence_db"], centroid_hz=c["feats"]["centroid_hz"], final_st=s["final"],
                         speed=c["speed"], round2=c["round2"], n_takes=len(c["takes"])))
    # timbre tie-break: the larger of the smaller mean-MFCC distances to the scene's voices
    for r in rows:
        r["min_mfcc_dist"] = min([v["mfcc_dist"] for v in r["vs"].values()] or [0.0])
    rows.sort(key=lambda r: (r["score"], r["brief_points"], -r["min_mfcc_dist"]))
    return rows


def f0_pyin(path):
    """a second pitch measure for one-syllable reads, where the house YIN can jump an octave on 0.3 s: pYIN (60-500 Hz,
    16 kHz, 64 ms frames) over the voiced frames -> (median Hz, voiced share)"""
    import librosa
    from scipy.signal import resample_poly
    y = load(path)
    d = E.rms_db(y, 0.01)
    idx = np.where(d > -40)[0]
    y = y[int(idx[0] * 0.01 * E.SR): int((idx[-1] + 1) * 0.01 * E.SR)]
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0, vf, vp = librosa.pyin(y16, fmin=60, fmax=500, sr=16000, frame_length=1024, hop_length=160)
    v = f0[vf & ~np.isnan(f0)]
    return (round(float(np.median(v)), 1) if len(v) else None), round(float(np.mean(vf)), 2)


def f0_in_range(path, prior):
    """one word's pitch inside its voice's own range: YIN (16 kHz, 10 ms hop) searched only within prior/1.8 .. prior*1.8
    (the voice's library preview median), over the frames within 20 dB of the loudest -> (median Hz, the rise across the
    word in st: the last third of those frames against the first third, n frames)"""
    import librosa
    from scipy.signal import resample_poly
    y = load(path)
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0 = librosa.yin(y16, fmin=max(50.0, prior / 1.8), fmax=min(600.0, prior * 1.8), sr=16000, frame_length=800,
                     hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=800, hop_length=160)[0][: len(f0)]
    f0 = f0[: len(rms)]
    idx = np.where(20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12) > -20)[0]
    if len(idx) < 6:
        return None, None, int(len(idx))
    v = f0[idx]
    k = max(2, len(v) // 3)
    return round(float(np.median(v)), 1), round(float(12 * np.log2(np.median(v[-k:]) / np.median(v[:k]))), 2), int(len(v))


def slot_f0(ix):
    """each one-word slot read's pitch. The house YIN jumps octaves on 0.3-0.5 s (Brad read 290 Hz against a 143 Hz
    preview) and pYIN finds no voiced frames on several, so the take's 'f0' is YIN searched inside the voice's own range
    (its library preview +/-1.8x: the same voice, a prior, not a target), and 'rise_st' is the pitch across the word"""
    for r in SLOTS:
        for c in ix["roles"].get(r, {}).get("candidates", []):
            prior = library_of(c["voice_id"], ix).get("preview_f0")
            for t in c["takes"]:
                m = t["m"]
                if "f0_yin" not in m:
                    m["f0_yin"] = m["f0"]
                    m["f0_pyin"], m["voiced_share"] = f0_pyin(t["file"])
                m["f0_preview"] = prior
                if prior and "f0_in_range" not in m:
                    m["f0_in_range"], m["rise_st"], m["f0_frames"] = f0_in_range(t["file"], prior)
                if m.get("f0_in_range"):
                    m["f0"] = m["f0_in_range"]
                    m["f0_note"] = "YIN inside the voice's own range (preview x/÷1.8)"
            c["feats"]["f0_geo"] = c["takes"][0]["m"]["f0"]


def floors(ix):
    cdir = os.path.join(REPO, "audio/ep02/v1-el/cache")
    for rr in ix["roles"].values():
        for c in rr["candidates"]:
            for t in c["takes"]:
                if "floor_p5_dbfs" not in t["m"]["raw"]:
                    t["m"]["raw"].update(raw_floor(E.decode(open(os.path.join(cdir, t["key"] + ".mp3"), "rb").read())))


def rescore(ix):
    """recall again from the stored transcripts, with the current rule (spelled letters joined; apostrophe-blind)"""
    names = set(n.lower() for n in jload(R.CAST).get("names", []))
    for rr in ix["roles"].values():
        for c in rr["candidates"] + rr.get("round2", []):
            for t in c["takes"]:
                if t.get("m"):
                    t["m"]["recall"] = recall_noapos(t["text"], t["m"]["asr"], names)
                    if t["m"].get("device") and t["m"]["device"].get("asr") is not None:
                        t["m"]["device"]["recall"] = recall_noapos(t["text"], t["m"]["device"]["asr"], names)


def cmd_pick(a):
    ix = index()
    rescore(ix)
    slot_f0(ix)
    floors(ix)
    picks = {}
    by = lambda role: {c["voice_id"]: c for c in ix["roles"][role]["candidates"]}
    # the four product voices: every combination, one per slot; the four plus Maya (VOICE 5) sorted by pitch must be
    # at least 2 st apart, neighbour to neighbour (cast.md §3.5). Among the combinations with the fewest points (lane,
    # accent, clean takes, the slot's brief), the one whose smallest neighbour gap (pitch, then 2-5 kHz presence) is largest
    if all(r in ix["roles"] for r in SLOTS):
        maya = ix["neighbours"]["chatgtp"]
        ranks = {r: {x["voice_id"]: x for x in rank_role(r, ix)} for r in SLOTS}
        best = None
        for combo in itertools.product(*[ix["roles"][r]["candidates"] for r in SLOTS]):
            pts = sum(ranks[r][c["voice_id"]]["score"] + ranks[r][c["voice_id"]]["brief_points"] for r, c in zip(SLOTS, combo))
            f = sorted([(ranks[r][c["voice_id"]]["f0"], c["feats"]["presence_db"], r) for r, c in zip(SLOTS, combo)]
                       + [(maya["f0_geo"], maya["presence_db"], "voice5")])
            gaps = [st(f[i + 1][0], f[i][0]) for i in range(len(f) - 1)]
            short = sum(max(0.0, 2.0 - g) for g in gaps)
            pres = min(abs(f[i + 1][1] - f[i][1]) for i in range(len(f) - 1))
            key = (round(pts + short, 2), -round(min(gaps), 2), -pres)
            if best is None or key < best[0]:
                best = (key, combo, gaps, f)
        key, combo, gaps, f = best
        for r, c in zip(SLOTS, combo):
            picks[r] = dict(ranks[r][c["voice_id"]], rule="joint: the slots and Maya at least 2 st apart, neighbour to neighbour")
        ix["slots_joint"] = dict(order=[x[2] for x in f], f0=[round(x[0], 1) for x in f], gaps_st=[round(g, 2) for g in gaps],
                                 points=key[0], min_gap_st=-key[1])
        print("slots:", ix["slots_joint"])
    for r1, r2 in JOINT:
        if r1 not in ix["roles"] or r2 not in ix["roles"]:
            continue
        best = None
        for c1 in ix["roles"][r1]["candidates"]:
            for c2 in ix["roles"][r2]["candidates"]:
                a1 = next(x for x in rank_role(r1, ix, {r2: c2}) if x["voice_id"] == c1["voice_id"])
                a2 = next(x for x in rank_role(r2, ix, {r1: c1}) if x["voice_id"] == c2["voice_id"])
                key = (a1["score"] + a2["score"], a1["brief_points"] + a2["brief_points"],
                       -abs(st(c1["feats"]["f0_geo"], c2["feats"]["f0_geo"])))
                if best is None or key < best[0]:
                    best = (key, a1, a2)
        picks[r1] = dict(best[1], rule=f"joint with {r2}")
        picks[r2] = dict(best[2], rule=f"joint with {r1}")
    rankings = {}
    for role in ix["roles"]:
        partner = None
        for r1, r2 in JOINT:
            if role == r1 and r2 in picks:
                partner = {r2: by(r2)[picks[r2]["voice_id"]]}
            if role == r2 and r1 in picks:
                partner = {r1: by(r1)[picks[r1]["voice_id"]]}
        rk = rank_role(role, ix, partner)
        rankings[role] = rk
        if ROLES[role].get("crowd"):
            ok = [r for r in rk if r["penalties"]["clean"] == 0 and (r["p_en"] or 0) >= 0.95]
            picks[role] = dict(layered=[dict(voice_id=r["voice_id"], name=r["name"], f0=r["f0"]) for r in ok],
                               rule="every voice that reads the chant clean (ASR recall >= 0.9 with spelled letters joined, "
                                    "no clipped tail) and p(en) >= 0.95: Ep1's 0.985 bar was set on sentences, and on two "
                                    "seconds of a spelled acronym all twelve read 0.966-0.990, so for the chant it is a "
                                    "gate at 0.95 and otherwise reported; 8-12 layered")
        elif role not in picks:
            picks[role] = dict(rk[0], rule="the lowest score, then the brief's points, then timbre")
    ix["rankings"] = rankings
    ix["picks"] = picks
    ix["ranking_rule"] = penalties.__doc__.strip() + "\nTie-breaks: " + brief_points.__doc__.strip()
    jdump(ix, INDEX)
    for role, rk in rankings.items():
        print(f"== {role}")
        for r in rk:
            mark = "*" if picks.get(role, {}).get("voice_id") == r["voice_id"] else " "
            print(f" {mark}{r['cand']} {r['name'][:34]:34s} score {r['score']:5.2f} {r['penalties']} brief {r['brief_points']} "
                  f"{r['brief_notes']} f0 {r['f0']} wpm {r['wpm']} span/plan {r['span_vs_plan']} p_en {r['p_en']} "
                  f"rec {r['recall_min']} cpp {r['cpp_db']} s2f {r['speech_to_floor_db']} | "
                  + " ".join(f"{n}:{v['st']:+.1f}st/d{v['mfcc_dist']}" for n, v in r["vs"].items()))


def cmd_credits(a):
    """the characters and credits actually billed, from every audition manifest's paid calls (el_render records each
    call's character-cost header), and the subscription's counter before and after (other passes may share it)"""
    ix = index()
    calls = []
    for p in sorted(glob.glob(os.path.join(AUD, "*/manifest.json"))):
        for c in jload(p).get("calls", []):
            calls.append(dict(role=os.path.basename(os.path.dirname(p)), take=c["take"], chars=c["chars"],
                              cost=float(c.get("cost_header") or 0), request_id=c.get("request_id"), at=c.get("at")))
    ix["credits"] = dict(calls=calls, n_calls=len(calls), chars_sent=sum(c["chars"] for c in calls),
                         credits_billed=round(sum(c["cost"] for c in calls), 1),
                         by_role={r: round(sum(c["cost"] for c in calls if c["role"] == r), 1) for r in sorted({c["role"] for c in calls})})
    ix["subscription_after"] = dict(ellib.subscription(), checked_at=time.strftime("%Y-%m-%dT%H:%M:%S"))
    jdump(ix, INDEX)
    cr = ix["credits"]
    print(cr["by_role"])
    print(f"calls {cr['n_calls']}, chars {cr['chars_sent']}, billed {cr['credits_billed']}; subscription "
          f"{ix['subscription_before']['character_count']} -> {ix['subscription_after']['character_count']}")


# ============================================================================================ cast + report
def library_of(vid, ix):
    for rows in ((ix.get("screen") or {}).get("roles") or {}).values():
        for r in rows:
            if r["voice_id"] == vid:
                return r
    return {}


def cand_entry(role, c, rk, ix, letter, picked):
    lib = library_of(c["voice_id"], ix)
    r = next(x for x in ix["rankings"][role] if x["voice_id"] == c["voice_id"])
    e = dict(cand=letter, voice_id=c["voice_id"], voice_name=c["name"],
             source=f"shared Voice Library ({lib.get('category')} voice of its owner), used by voice_id",
             library_category=lib.get("category"),
             library_labels=dict(gender=lib.get("gender"), age=lib.get("age"), accent=lib.get("accent"),
                                 descriptive=lib.get("descriptive"), use_case=lib.get("use_case")),
             library_description=(lib.get("description") or "")[:300], model="eleven_multilingual_v2",
             settings=dict(c["settings"]),
             measured_preview=dict(median_f0_hz=lib.get("preview_f0"), f0_range_st=lib.get("preview_f0_range"),
                                   note="the library preview MP3 (its own text); a screen only"),
             measured_audition=dict(rank=rk, score=r["score"], penalties=r["penalties"], brief_points=r["brief_points"],
                                    brief_notes=r["brief_notes"], median_f0_hz=r["f0"], f0_range_st=r["f0_range_st"],
                                    wpm=r["wpm"], span_vs_plan=r["span_vs_plan"], p_en=r["p_en"], recall_min=r["recall_min"],
                                    tail_cuts=r["tail_cuts"], cpp_db=r["cpp_db"], raw_floor_dbfs=r["raw_floor_dbfs"],
                                    speech_to_floor_db=r["speech_to_floor_db"], presence_db=r["presence_db"],
                                    vs={n: dict(st=v["st"], mfcc_dist=v["mfcc_dist"]) for n, v in r["vs"].items()},
                                    takes={t["line"]: dict(file=t["file"], key=t["key"], seed=t["seed"], sent=t["sent"],
                                                           span_s=t["m"]["span_s"], planned_s=t["m"]["planned_s"],
                                                           asr=t["m"]["asr"]) for t in c["takes"]},
                                    audition_letter=c["cand"]))
    r2 = next((x for x in ix["roles"][role].get("round2", []) if x["voice_id"] == c["voice_id"]), None)
    if r2:
        e["settings"] = dict(r2["settings"])
        e["measured_audition"]["round2"] = dict(
            speed=r2["settings"]["speed"], fitted_from=r2.get("fitted_from"),
            takes={t["line"]: dict(file=t["file"], key=t["key"], seed=t["seed"], sent=t["sent"], span_s=t["m"]["span_s"],
                                   planned_s=t["m"]["planned_s"], wpm=t["m"]["wpm"], f0=t["m"]["f0"], asr=t["m"]["asr"])
                   for t in r2["takes"]},
            note="the takes the film would play: the episode's seeds at this speed (cached; the takes pass sends nothing)")
    if picked and ix["picks"][role].get("why"):
        e["why"] = ix["picks"][role]["why"]
    return e


def cmd_cast(a):
    """write the picks into audio/ep02/cast-el.json: one role per new speaker id (the beat plans' 'who'), candidate A the
    pick and the others in rank order (each with its audition), labels, and the per-line readings the auditions sent
    (say_lines). Every other key of the file is kept as it is."""
    ix = index()
    cast = jload(R.CAST)
    for role, spec in ROLES.items():
        if role not in ix.get("picks", {}):
            continue
        pk = ix["picks"][role]
        rk = [x["voice_id"] for x in ix["rankings"][role]]
        byv = {c["voice_id"]: c for c in ix["roles"][role]["candidates"]}
        if spec.get("crowd"):
            order = [x["voice_id"] for x in pk["layered"]] + [v for v in rk if v not in {x["voice_id"] for x in pk["layered"]}]
        else:
            order = [pk["voice_id"]] + [v for v in rk if v != pk["voice_id"]]
        letters = "ABCDEFGHIJKL"
        cands = [cand_entry(role, byv[v], rk.index(v) + 1, ix, letters[i], i == 0) for i, v in enumerate(order)]
        ent = dict(name=spec["name"], brief=spec["brief"], lane_hz=list(spec["lane"]) if spec.get("lane") else None,
                   pace_wpm=f"{spec['rate']} (the beat plan's planning rate)" if spec.get("rate") else None,
                   scenes=spec["scenes"], candidates=cands,
                   cast_ep2=dict(at=time.strftime("%Y-%m-%d"), audition="audio/ep02/v1-el/auditions/index.json",
                                 lines=spec["lines"], neighbours=spec.get("nb"),
                                 method="cast.md §6 and voices-el §AA: the role's real lines from the beat plans, the "
                                        "episode's seeds, dressed at -16 LUFS; picked by measurement; nobody listened"))
        if spec.get("crowd"):
            ent["layered"] = [c["cand"] for c in cands if c["voice_id"] in {x["voice_id"] for x in pk["layered"]}]
            ent["layered_note"] = ("the chant (e2-a3-0010) is 8-12 layered reads: every candidate in 'layered', each its own "
                                   "seed (seed_of(line, voice)) and an offset of 40-180 ms, ducked under Alyi's lead. "
                                   "el_render.py renders only candidate A per set: the crowd needs the voice pass's layering "
                                   "step, which finds each listed voice's audition read in the cache (nothing sent)")
        cast["roles"][role] = ent
        for lab in {spec["name"], spec["name"].replace("THE ", ""), role}:
            cast["labels"][lab] = role
        for lid, say in (spec.get("say") or {}).items():
            cast.setdefault("say_lines", {})[lid] = say
    cast["say_lines_note"] = (cast.get("say_lines_note") or "") + (
        " Ep2 (the casting pass, 2026-10-08): e2-a2-0015 VOICE 4 'Hi...' (the trail is the read; the house would drop a "
        "trailing print ellipsis); e2-a3-0010 the CROWD 'Feel the A.G.I.! Feel the A.G.I.!' (cast.md §5: sentence case, "
        "the letters).") if "Ep2 (the casting pass" not in (cast.get("say_lines_note") or "") else cast["say_lines_note"]
    jdump(cast, R.CAST)
    print("wrote", os.path.relpath(R.CAST, REPO), [r for r in ROLES if r in ix.get("picks", {})])


def cmd_report(a):
    """the ranking tables for cast.md, from the index"""
    ix = index()
    nb = ix["neighbours"]
    for role, rk in ix["rankings"].items():
        spec = ROLES[role]
        pk = ix["picks"][role]
        picked = {x["voice_id"] for x in pk.get("layered", [])} or {pk.get("voice_id")}
        cols = list(spec.get("nb") or {})
        print(f"\n#### {role}\n")
        head = ["Rank", "Voice", "Score", "F0 (Hz)"] + [f"vs {n}" for n in cols if n in nb or n in ROLES] + [
            "speed", "wpm", "length / plan", "ASR", "p(en)", "floor / S:F", "CPP", "penalties, brief"]
        print("| " + " | ".join(head) + " |")
        print("|" + "---|" * len(head))
        for i, r in enumerate(rk):
            v = [str(i + 1), ("**" + r["name"] + "**") if r["voice_id"] in picked else r["name"], f"{r['score']:.2f}",
                 f"{r['f0']}"]
            for n in cols:
                if n in r["vs"]:
                    v.append(f"{r['vs'][n]['st']:+.1f} st / {r['vs'][n]['mfcc_dist']:.0f}")
                elif n in nb or n in ROLES:
                    v.append("—")
            v += [f"{r['speed']:g}", f"{r['wpm']:.0f}", f"{r['span_vs_plan']:.2f}" if r["span_vs_plan"] else "—",
                  "verbatim" if r["recall_min"] >= 1.0 else f"{r['recall_min']:.2f}", f"{r['p_en']:.3f}" if r["p_en"] is not None else "—",
                  f"{r['raw_floor_dbfs']:.0f} / {r['speech_to_floor_db']:.0f} dB", f"{r['cpp_db']}",
                  ", ".join(f"{k} {x:g}" for k, x in r["penalties"].items() if x) + ("; " if r["brief_notes"] else "")
                  + ", ".join(r["brief_notes"])]
            print("| " + " | ".join(v) + " |")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    for n in ("screen", "render", "round2", "measure", "scene", "pick", "credits", "cast", "report"):
        x = sp.add_parser(n)
        x.add_argument("--roles", type=lambda s: [r for r in s.split(",") if r], default=None)
        if n == "render":
            x.add_argument("--max-credits", type=float, default=3800.0)
            x.add_argument("--only", type=lambda s: [r for r in s.split(",") if r], default=None)
        if n == "round2":
            x.add_argument("--top", type=int, default=2)
            x.add_argument("--max-credits", type=float, default=3800.0)
        if n == "measure":
            x.add_argument("--force", action="store_true")
    a = ap.parse_args()
    dict(screen=cmd_screen, render=cmd_render, round2=cmd_round2, measure=cmd_measure, scene=cmd_scene, pick=cmd_pick, credits=cmd_credits,
         cast=cmd_cast, report=cmd_report)[a.cmd](a)


if __name__ == "__main__":
    main()
