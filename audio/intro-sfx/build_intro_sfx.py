"""MR. MAS -- Ep1 opening titles (30.000 s, f0-719 @ 24 fps, 96 BPM): the SFX spot and stems.

Sound editor's build. Source of truth: show/intro/SCRIPT.md v2.1 (AUDIO column, section 9.3 SFX alignment).
Library: audio/sfx/manifest.json (hybrid/chip/band). Anything the library lacks, or that the script asks to be
retuned, gated or high/low-passed, is rendered here into src/ and the spotting list points at that file.

Outputs (all in audio/intro-sfx/):
  intro-sfx_stem.wav        THE SFX STEM (sfx-main bus): script-exact spot, 48 kHz / 24-bit / stereo / 1,440,000 samples
  intro-sfx_extras.wav      opt-in layer: production-list items the script v2.1 CUTS, plus editor suggestions (muted by default)
  intro-blip_stem.wav       BLIP bus (card blips + Orb toast chime), separate from sfx-main per SCRIPT 9.6
  spotting.json / spotting.md   frame-accurate spotting list (EDL for Remotion <Audio>)
  qa.json                   automated checks (length, silences, cut-deads, levels against the V1 score)
  preview/*.mp3             listening previews (V1 music + VO scratch + SFX), not deliverables
  src/*.wav                 processed / synthesized one-shots referenced by the spotting list

Picture sync: frames come from the script's contract (SCRIPT 9.4: "Its frame numbers are the contract"). If
out/season/intro/picture/intro-events.json exists, matching keys override the script frames and every delta is logged in
picture-sync.json. Re-run:  audio/.venv/bin/python audio/intro-sfx/build_intro_sfx.py
"""
from __future__ import annotations

import hashlib
import json
import math
import os
import sys

import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.dirname(HERE)
PROJ = os.path.dirname(AUDIO)
sys.path.insert(0, os.path.join(AUDIO, "sfx", "scripts"))
from dsp import (SR, FPS, n_of, db, fade, lowpass, highpass, bandpass, biquad_peak, resonator, pulse,  # noqa: E402
                 triangle, lfsr_noise, noise, chip_env, varispeed, bitcrush, modal, pan_curve, mono, stereo,
                 lufs_integrated, true_peak_db, write_mp3)

SFXLIB = os.path.join(AUDIO, "sfx")
SRC = os.path.join(HERE, "src")
PREV = os.path.join(HERE, "preview")
EVENTS_JSON = os.path.join(PROJ, "out/season/intro/picture/intro-events.json")
TOTAL_F = 720
SPF = SR // FPS                     # 2000 samples per frame
N = TOTAL_F * SPF                   # 1,440,000 samples = 30.000 s
TRIM = -4.0                         # bus trim vs manifest mixDb (music sits ~-15.5 LUFS before VO/SFX, SCRIPT 9.6)
BLIP_DB = dict(gerg=-11.0, mario=-9.0, echo_rel=-6.0, nole=-11.0)   # was -14/-14/-10 rel/-15 (sound review P2 #5)
# key taps: peak dBFS under the VO's words / outside them. Were -30/-27; down 4 dB with the VO (the mix now takes
# the VO -4 dB, sound review P1 #1), so the taps keep their measured relation to the voice (SII 0.93+ per word).
TAP_UNDER, TAP_OUT = -34.0, -31.0
ITEM_PK = -18.0                     # item_take pickups (was -26: 21-28 LU under the music, sound review P3 #11)

MAN = {r["id"]: r for r in json.load(open(os.path.join(SFXLIB, "manifest.json")))}


def fr2s(f: float) -> float:
    return f / FPS


# =====================================================================================================================
# FRAME TABLE: every sync point, from SCRIPT.md v2.1 (section in the comment). Keys double as picture-event names.
# =====================================================================================================================
F = {
    # 3.2 cold open (BASE; SFX hybrid, post click --chip as written)
    "coldopen.in": 0, "coldopen.room_cut": 90, "coldopen.insert_cut": 112, "coldopen.out": 120,
    "orb.iris_turn": 97, "orb.scan": 100, "orb.scan_end": 105, "post.click": 112, "paper.white_peak": 119,
    # 3.3 1993 (1-BIT; --chip)
    "y1993.drop": 120, "dialog.cancel": 150, "dialog.ok": 165, "renderfront.fire": 168,
    # 3.4 2008-2015 (EARLY-WEB16; --chip) then BASE from f225
    "collar.pop1": 180, "collar.pop2": 190, "collar.repop": 205, "crown.flutter": 205, "crown.land": 220,
    "woodrose.matchcut": 225, "gerg.keys_roll_end": 240,
    # 3.5 THE WOODROSE (hybrid; latch --chip; klaxon --chip)
    "gerg.freeze": 240, "gerg.keycap_pocket": 278, "alyi.thaw_room": 285, "alyi.effigy_ignite": 290,
    "alyi.freeze": 300, "alyi.world_resumes": 340, "alyi.card_close": 340, "gerg.world_resumes": 285,
    "mario.vault": 345, "mario.tick1": 348, "mario.tick2": 351, "mario.tick3": 354, "mario.freeze": 360,
    "mario.scroll_unroll": 378, "mario.scroll_unroll_end": 389, "mario.scroll_take": 392, "nole.rumble": 403,
    "nole.ceiling_burst": 405, "nole.tiles": 409, "nole.touchdown": 420, "nole.freeze": 420, "nole.stamp": 435,
    "nole.n_unhook": 456, "nole.n_clunk": 464,
    # 3.6 the founding
    "founding.buzz": 465, "founding.relight": 465, "rollcall.cut1": 480,
    # 3.7 roll call: cuts floor(480 + 7.5 n)
    "rollcall.cut2": 487, "rollcall.cut3": 495, "rollcall.cut4": 502, "rollcall.cut5": 510, "rollcall.cut6": 517,
    "rollcall.cut7": 525, "rollcall.cut8": 532, "skyline.cut": 540,
    # 3.8 skyline (BASE)
    "pop.macrosoft": 540, "pop.elgoog": 555, "pop.atem": 570, "pop.invidia": 585, "pop.misanthropic": 600,
    "pop.zai": 600, "pop.peekdeep": 615, "skyline.roofline": 622,
    # 3.9-3.10 title and bookend
    "title.slam": 630, "bookend.cut": 690, "orb.toast": 692, "bookend.ding": 705, "orb.iris_glyph": 705,
    "loop.end": 720,
    # thaws / picture-only sync points (script values = the script's thaw frames)
    "mario.world_resumes": 405, "nole.world_resumes": 465, "book.post": 705, "meras.whip": 220,
    "mario.fire_back": 386, "nole.fire_snuff": 410,
}

# the typed line (3.2): reveal frame per character, typing leads the VO by 6 (phrase 1) / 8 (phrase 2) frames.
# "near the singularity;" types over f18-49 ; "unclear which side." over f64-83 (VO: near f24, singularity ends
# f55-57; unclear f72, which f81, side f86-91). Picture's per-character frames override these if published.
L1 = "near the singularity;"
L1_KEYS = [18, 19, 21, 22, 24, 25, 26, 27, 28, 29, 31, 33, 34, 36, 38, 40, 42, 43, 45, 47, 49]
L2 = "unclear which side."
L2_KEYS = [64, 65, 66, 67, 68, 69, 70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]
VO_WORDS = [(24, 57), (72, 91)]     # frames where Mas is speaking (key taps <= -30 dBFS under words)
SCRIPT_F = dict(F)

# ---------------------------------------------------------------------------------------------------------------------
# PICTURE PROFILE: the frames the picture actually carries today, read from the moments' code (studio/src/dev/m*/
# timeline.ts + scene.ts, as mounted by studio/src/intro/edl.ts at 07:38). Where the picture differs from the script,
# the SFX follows the picture (the sound choices stay the script's) and the delta is reported. intro-events.json, when
# it appears, overrides both.
# ---------------------------------------------------------------------------------------------------------------------
PICTURE_CODE = {
    "collar.pop2": (187, "meras/timeline.ts T.pop2"), "collar.repop": (202, "meras T.repop"),
    "crown.flutter": (204, "meras T.crownGo (path on twos 204-216)"), "crown.land": (217, "meras T.crownLand"),
    "gerg.keycap_pocket": (254, "mdinner1/scene.ts masAt: 'pocket' drawing 254-256"),
    "alyi.effigy_ignite": (296, "mdinner1/scene.ts IGNITE"),
    "mario.tick2": (352, "mdinner2 T.tick2 / vaultAt"), "mario.tick3": (356, "mdinner2 T.tick3 / vaultAt"),
    "mario.scroll_unroll": (375, "mdinner2 T.marioLive: the essay unrolls from 375 (whip 384-389)"),
    "mario.scroll_take": (390, "mdinner2 T.grab"),
    "nole.n_unhook": (467, "mdinner2 T.nLift"), "nole.n_clunk": (473, "mdinner2 T.nClunk"),
    "founding.relight": (474, "mdinner2 T.aiOn (AI relights with flicker 474-476); the sign is lit from 465"),
    "alyi.world_resumes": (315, "mdinner1 FREEZE_A.t1 (the world, and the fire, run again from 315)"),
    "gerg.world_resumes": (255, "mdinner1 FREEZE_G.t1 (Gerg types again from 255)"),
    "mario.world_resumes": (375, "mdinner2 FREEZE_M.t1"), "nole.world_resumes": (450, "mdinner2 FREEZE_N.t1"),
    "founding.buzz": (450, "mdinner2: the OPEN sign is lit in the live room from the f450 unfreeze"),
}
PICTURE_KEYS = dict(
    L1=([24, 25, 27, 28, 30, 31, 32, 34, 36, 37, 39, 40, 41, 43, 44, 46, 47, 49, 50, 52, 55], "mcoldopen L1_KEYS"),
    L2=([71, 72, 74, 75, 76, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 93], "mcoldopen L2_KEYS"),
    brk=(70, "mcoldopen L2_BREAK (shift+enter)"),
    keycaps=([226, 228, 231, 232, 234, 236, 238, 240, 257, 259, 261, 263, 265, 267, 269, 271, 273, 275, 277, 279, 281,
              283, 285, 287, 290, 291, 293, 295, 297, 300, 316, 319, 320, 322, 324, 327, 329, 331, 332, 334, 336, 339],
             "shared/pixel/cast/gerg.ts gergKeycaps via mdinner1 worldClock (launch frames)"),
)
# the cold open's shots (mcoldopen SHOTS) for the room-tone perspective: (from, gain dB)
PICTURE_HUM = [(0, -2.0), (14, -2.0), (15, -1.5), (29, -1.5), (30, 0.0), (44, 0.0), (45, 2.0), (59, 2.0), (60, 0.0),
               (98, 0.0), (99, 2.0), (104, 2.0), (105, 0.0), (117, 0.0)]
SCRIPT_HUM = [(0, 0.0), (89, 0.0), (90, 2.0), (111, 2.0), (112, 0.0)]
PROFILE = dict(name="picture", keys1=L1_KEYS, keys2=L2_KEYS, brk=None, hum=SCRIPT_HUM, flutter=(8, 15),
               unroll=12, minddeep=False, keycaps=None, toast=True)
# the picture's own per-keystroke tables (mcoldopen exports them; intro-events.json carries only first/last)
MCOLDOPEN_TL = os.path.join(PROJ, "studio", "src", "dev", "mcoldopen", "timeline.ts")


MDINNER1_SC = os.path.join(PROJ, "studio", "src", "dev", "mdinner1", "scene.ts")


def read_ts_const(path, name):
    """`export const NAME = <int>` from a studio source file (None if absent)."""
    import re
    try:
        m = re.search(r"export const %s\s*=\s*(\d+)\b" % name, open(path).read())
    except OSError:
        return None
    return int(m.group(1)) if m else None


def read_picture_keys():
    """L1_KEYS / L2_KEYS / L2_BREAK straight from studio/src/dev/mcoldopen/timeline.ts (None if unreadable)."""
    import re
    try:
        src = open(MCOLDOPEN_TL).read()
    except OSError:
        return None
    out = {}
    for name in ("L1_KEYS", "L2_KEYS"):
        m = re.search(r"export const %s\s*=\s*\[([\d,\s]+)\]" % name, src)
        if not m:
            return None
        out[name] = [int(x) for x in m.group(1).replace(" ", "").split(",") if x.strip()]
    m = re.search(r"export const L2_BREAK\s*=\s*(\d+)", src)
    out["L2_BREAK"] = int(m.group(1)) if m else None
    if len(out["L1_KEYS"]) != len(L1) or len(out["L2_KEYS"]) != len(L2):
        return None
    return out


def set_profile(name):
    """'script' = SCRIPT.md v2.1 contract frames; 'picture' = the frames the picture carries today."""
    F.clear()
    F.update(SCRIPT_F)
    PROFILE.update(name=name, keys1=L1_KEYS, keys2=L2_KEYS, brk=None, hum=SCRIPT_HUM, flutter=(8, 15), unroll=12,
                   minddeep=False, keycaps=None, toast=True, keysrc="script tables")
    if name == "picture":
        for k, (v, _) in PICTURE_CODE.items():
            F[k] = v
        PROFILE.update(keys1=PICTURE_KEYS["L1"][0], keys2=PICTURE_KEYS["L2"][0], brk=PICTURE_KEYS["brk"][0],
                       hum=PICTURE_HUM, flutter=(7, 13), unroll=15, minddeep=True, keycaps=PICTURE_KEYS["keycaps"][0],
                       toast=False, keysrc="build_intro_sfx.py PICTURE_KEYS (07:38 snapshot)")
        pk = read_picture_keys()
        if pk:
            PROFILE.update(keys1=pk["L1_KEYS"], keys2=pk["L2_KEYS"], brk=pk["L2_BREAK"],
                           keysrc=os.path.relpath(MCOLDOPEN_TL, PROJ))


# =====================================================================================================================
# helpers
# =====================================================================================================================
def lib(sid: str) -> np.ndarray:
    x, sr = sf.read(os.path.join(SFXLIB, MAN[sid]["file"]), always_2d=True)
    assert sr == SR, sid
    return x.astype(np.float64)[:, :2] if x.shape[1] >= 2 else np.repeat(x, 2, axis=1)


def libfile(rel: str) -> np.ndarray:
    x, sr = sf.read(os.path.join(SFXLIB, rel), always_2d=True)
    assert sr == SR
    return x.astype(np.float64)[:, :2] if x.shape[1] >= 2 else np.repeat(x, 2, axis=1)


def notch(x, f, q=25.0, passes=2):
    b, a = signal.iirnotch(f, q, SR)
    for _ in range(passes):
        x = signal.lfilter(b, a, x, axis=0)
    return x


def gate(x, dur, fout=0.02):
    y = x[:n_of(dur)].copy()
    return fade(y, 0.0, fout)


def peak_db(x) -> float:
    return float(20 * np.log10(max(np.abs(x).max(), 1e-12)))


def norm_peak(x, target_db=-1.0):
    return x * db(target_db - peak_db(x))


def hz(name: str) -> float:
    names = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "Ab": 8, "A": 9,
             "Bb": 10, "B": 11}
    p, o = (name[:2], name[2:]) if name[:2] in names else (name[:1], name[1:])
    midi = 12 * (int(o) + 1) + names[p]
    return 440.0 * 2 ** ((midi - 69) / 12)


def env_ad(n, a, d, curve=5.0):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), np.exp(-curve * (t - a) / max(d, 1e-6)))
    return e


def bend_resample(x, cents_start, glide_s):
    """Time-varying playback-rate bend: starts `cents_start` off and glides to 0 over glide_s (for a small up-bend)."""
    m = x
    n = len(m)
    t = np.arange(n) / SR
    c = np.where(t < glide_s, cents_start * (1 - t / glide_s), 0.0)
    rate = 2 ** (c / 1200)
    pos = np.cumsum(rate) - rate[0]
    pos = pos[pos < n - 1]
    out = np.stack([np.interp(pos, np.arange(n), m[:, ch]) for ch in range(m.shape[1])], axis=1)
    return out


# =====================================================================================================================
# SOURCES: library files with the script's processing, and the few sounds the library lacks (synthesized, tuned)
# Each builder returns stereo float64 at 48 kHz. Built once, saved to src/<name>.wav, referenced by the spot list.
# =====================================================================================================================
def s_server_hum():
    # F2 hum bed; notch the A (5th/10th partials of F2) so the room carries no major third under the open fifth
    x = lib("server_hum")
    for f in (436.6, 873.2, 1309.9):
        x = notch(x, f, 18)
    return x


def s_orb_servo_C6():
    # 'a tuned chip whirr on C6' (SFX 9.3: orb_servo -> C6). The hybrid servo's motor sits on C5/C6 partials:
    # played at 2x it cruises on C6 and its cruise lasts exactly the 3 iris drawings (f97-99). A 12.5% pulse
    # whirr on C6 (60 Hz stepped glide from Bb5) on top gives the chip identity; end-stop tick at f100.
    mech = varispeed(lib("orb_servo"), 2.0)
    mech = notch(mech, 2 * 2616.0, 20)          # its 5th partial (E) -- keep the servo on C/G only
    n = n_of(0.16)
    t = np.arange(n) / SR
    f0 = np.where(t < 0.035, hz("Bb5") * (hz("C6") / hz("Bb5")) ** (t / 0.035), hz("C6"))
    f0 = f0[(np.arange(n) // (SR // 60)) * (SR // 60)]
    chip = pulse(f0, n, duty=0.125) * chip_env(n, [.35, .7, .9, 1, .95, .9, .8, .55, .25, .1, 0])
    chip *= 0.8 + 0.2 * np.sign(np.sin(2 * math.pi * 45 * t))       # motor chop: the whirr
    chip = lowpass(chip, 8000, 2) * 0.33
    tick = np.zeros(n)
    k = n_of(0.125)
    tk = lfsr_noise(n_of(0.006), 18000, short=True, seed=7) * np.exp(-np.arange(n_of(0.006)) / (SR * 0.0015))
    tick[k:k + len(tk)] = tk * 0.35
    y = np.zeros((max(len(mech), n), 2))
    y[:len(mech)] += mech * 0.5
    y[:n] += stereo(chip + highpass(tick, 2500))
    return fade(y[:n_of(0.2)], 0.001, 0.04)


def s_orb_scan_FC():
    # 'shhk' retuned to F/C (it measured ~1621 Hz, between G6 and Ab6): cut the 1.6-1.73 kHz cluster, ring
    # resonators on F5 C6 F6 C7 F7 C8 through the same noise; a filtered 5-frame sweep (f100-104), no sting.
    x = mono(lib("orb_scan_sweep"))
    x = biquad_peak(x, 1655, -14, 2.2)
    x = biquad_peak(x, 470, -6, 1.2)            # the chromatic 300-630 Hz cluster
    ring = sum(resonator(x, hz(p), 22) * g for p, g in
               (("F5", .6), ("C6", .8), ("F6", 1.0), ("C7", .9), ("F7", .7), ("C8", .4)))
    y = 0.45 * x + 2.2 * ring
    y = gate(y, fr2s(5) + 0.06, 0.07)                        # 5 frames + a 1.5-frame tail
    p = np.linspace(0.45, -0.3, len(y))                     # from the Orb (frame-right) out across the room
    return pan_curve(y, p) * math.sqrt(2)


def s_latch(note):
    # the freeze latch: freeze_hit_{F,Db,Bb,C}--chip gated to ~0.12 s (SFX 9.3); hybrid freeze_hit + shutter are cut
    return gate(lib(f"freeze_hit_{note}--chip"), 0.12, 0.025)


def s_flame_lp():
    x = lib("flame_whoomph")
    return lowpass(lowpass(x, 2000, 2), 2000, 2)             # low-passed at 2 kHz (placement: -4 dB, cut f300)


def s_neon_ignite_noring():
    # ring removed (it was F6 and would pre-empt the F6 at f480), and the buzz's A / B partials notched
    x = lib("neon_ignite")
    for f, q in ((1396.9, 12), (2793.8, 12), (4190.7, 10), (436.6, 18), (873.2, 18), (960.6, 18), (1309.9, 18)):
        x = notch(x, f, q)
    return x


def s_neon_buzz_tuned():
    x = lib("neon_buzz")
    for f in (436.6, 873.2, 960.6, 1135.0, 1309.9):
        x = notch(x, f, 18)
    return x


def s_chime_chip(note):
    # one HUD check chime, chip: 25% pulse + triangle an octave down, 60 Hz stepped decay, ~0.13 s
    n = n_of(0.14)
    f = hz(note)
    y = pulse(f, n, 0.25) * 0.55 + triangle(f / 2, n) * 0.18
    y *= chip_env(n, [1, .8, .62, .48, .36, .27, .2, .14, .09, 0])
    y = lowpass(y, 9000, 2)
    return stereo(fade(y, 0.001, 0.02))


def s_item_take(kind):
    """A quiet pickup (SCRIPT 3.5a/3.5c/3.5d): foley, not a BLIP. One per object."""
    r = np.random.default_rng({"keycap": 11, "scroll": 12, "n": 13}[kind])
    if kind == "keycap":           # plastic keycap tapped into a hoodie pocket
        n = n_of(0.2)
        tick = modal([2890, 4710, 6840], [0.03, 0.02, 0.012], [1, .5, .3], 0.2, seed=3) * 0.5
        cloth = bandpass(noise(n, "pink", 21), 900, 5200, 2) * env_ad(n, 0.012, 0.07)
        pocket = lowpass(noise(n, "pink", 22), 900, 2) * np.roll(env_ad(n, 0.02, 0.05), n_of(0.06))
        y = tick + cloth * 0.9 + pocket * 0.7
    elif kind == "scroll":         # paper tail pinched and lifted
        n = n_of(0.22)
        y = bandpass(noise(n, "white", 31), 1800, 8000, 2) * env_ad(n, 0.004, 0.05) * 0.6
        for t0 in r.uniform(0.0, 0.16, 7):
            k = n_of(t0)
            m = n_of(0.006)
            y[k:k + m] += bandpass(r.standard_normal(m), 2500, 9000, 1)[:len(y[k:k + m])] * r.uniform(.2, .5)
        y += bandpass(noise(n, "pink", 33), 500, 3000, 2) * env_ad(n, 0.05, 0.06) * 0.5
    else:                          # the neon N lifted off its bracket: small steel tink on C6, glass-tube tick
        n = n_of(0.24)
        tink = modal([hz("C6"), hz("C6") * 2.41, hz("C6") * 3.93], [0.14, 0.07, 0.04], [1, .45, .25], 0.24, seed=5)
        tink *= env_ad(n, 0.001, 0.3, 1.0)
        tube = modal([5230, 7410], [0.02, 0.012], [1, .6], 0.24, seed=6) * 0.35
        rattle = np.zeros(n)
        for t0, g in ((0.035, .35), (0.062, .2)):
            k = n_of(t0)
            m = n_of(0.004)
            rattle[k:k + m] += highpass(r.standard_normal(m), 3000, 1) * g
        y = tink * 0.6 + tube + rattle
    y = fade(highpass(y, 180, 2), 0.001, 0.03)
    return stereo(norm_peak(y, -1.0))


def s_paper_unroll(nf=12):
    # f378-389: the WORD COUNT bar becomes a paper scroll, 8 px per frame along the table, toward frame-right
    n = n_of(fr2s(nf) + 0.08)
    t = np.arange(n) / SR
    base = bandpass(noise(n, "pink", 41), 700, 7000, 2)
    flap = 0.75 + 0.25 * (0.5 + 0.5 * np.cos(2 * math.pi * 24 * t))       # one paper 'turn' per frame
    r = np.random.default_rng(42)
    crink = np.zeros(n)
    for t0 in np.sort(r.uniform(0, fr2s(nf), int(26 * nf / 12))):
        k = n_of(t0)
        m = n_of(0.004)
        crink[k:k + m] += highpass(r.standard_normal(m), 3000, 1)[:len(crink[k:k + m])] * r.uniform(.1, .35)
    env = np.clip(t / 0.03, 0, 1) * np.where(t < fr2s(nf - 1), 1.0, np.exp(-(t - fr2s(nf - 1)) / 0.03))
    y = (base * flap + crink) * env
    stop = n_of(fr2s(nf - 1))                                 # the free end stops at Mas's feet (f389)
    y[stop:stop + n_of(0.03)] += bandpass(noise(n_of(0.03), "pink", 43), 300, 2500, 2) * env_ad(n_of(0.03), .002, .015) * 1.2
    y = fade(y, 0.0, 0.05)
    p = np.linspace(0.45, -0.2, n)                           # from the vault (frame-right) to Mas's hands
    return pan_curve(norm_peak(y, -1.0), p) * math.sqrt(2)


def s_rumble():
    # f403: a low rumble overhead begins; grows into the ceiling burst, cut dead at the f420 freeze
    n = n_of(fr2s(17))
    y = lowpass(highpass(noise(n, "brown", 51), 28, 2), 120, 4)
    t = np.arange(n) / SR
    y *= np.clip(t / fr2s(6), 0, 1) ** 1.5 * (0.85 + 0.15 * np.sin(2 * math.pi * 7 * t))
    y += bandpass(noise(n, "pink", 52), 150, 600, 2) * np.clip(t / fr2s(8), 0, 1) * 0.25   # plaster creak
    return stereo(norm_peak(y, -1.0))


def s_tile_clatter():
    # the ceiling tiles hop on their own curves and hit the table/furniture (f409-418), each on its own pan
    total = n_of(fr2s(11))
    out = np.zeros((total, 2))
    r = np.random.default_rng(61)
    for i, (fr, p, g) in enumerate(((0, .3, 1.0), (2, 0.0, .8), (4, .4, .9), (7, .15, .7), (9, .35, .55))):
        n = n_of(0.09)
        fs = np.array([2100, 3380, 5200, 7050]) * r.uniform(0.9, 1.1)
        y = modal(fs, [0.05, 0.035, 0.025, 0.018], [1, .7, .5, .3], 0.09, seed=70 + i)
        y += highpass(r.standard_normal(n), 2500, 1) * env_ad(n, 0.0005, 0.004) * 0.6
        y = fade(y, 0.0005, 0.02) * g
        k = n_of(fr2s(fr))
        m = min(n, total - k)
        out[k:k + m] += pan_curve(y[:m], np.full(m, p)) * math.sqrt(2)
    return norm_peak(out, -1.0)


def s_landing_thunk():
    x = highpass(highpass(lib("landing_thunk"), 150, 2), 150, 2)      # high-passed at 150 Hz (SCRIPT 3.5d)
    return gate(x, 0.26, 0.07)                                        # the freeze stops the rattle


def s_crown_flutter(flicks=8, nf=15):
    # 2014, --chip: the paper crown hops down its Flash-era dotted path on twos (f205-219): 8 LFSR flicks
    total = n_of(fr2s(nf))
    out = np.zeros(total)
    for i in range(flicks):
        n = n_of(0.022)
        y = lfsr_noise(n, 9000 + 1600 * (i % 3), short=(i % 2 == 1), seed=80 + i)
        y = bandpass(y, 1400, 6500, 2) * chip_env(n, [1, .6, .3, 0], rate=120) * (0.9 - 0.05 * i)
        k = n_of(fr2s(2 * i))
        out[k:k + n] += y[:min(n, total - k)]
    p = np.linspace(0.55, 0.0, total)                        # LUAP (frame-right) -> Mas on the throne
    return pan_curve(norm_peak(out, -1.0), p) * math.sqrt(2)


def s_crown_land():
    n = n_of(0.07)
    y = lfsr_noise(n, 12000, short=False, seed=90) * chip_env(n, [1, .5, .2, 0], rate=120)
    y = bandpass(y, 900, 6000, 2) + lowpass(lfsr_noise(n, 3000, seed=91), 700, 2) * env_ad(n, .001, .02) * 0.6
    return stereo(norm_peak(fade(y, 0.0005, 0.02), -1.0))


def s_keycap_run(launches, start):
    """Picture only: Gerg's keycaps keep popping after the world resumes (launch frames from the picture). One small
    plastic snap + a hollow F-minor-pentatonic 'pok' per launch, panned with Gerg as the camera trucks away."""
    pent = [hz(n) for n in ("F6", "Ab6", "Bb6", "C7", "Eb7", "F7")]
    r = np.random.default_rng(151)
    total = n_of(fr2s(max(launches) - start + 4))
    out = np.zeros((total, 2))
    for i, f in enumerate(launches):
        n = n_of(0.06)
        pok = modal([pent[r.integers(len(pent))] * r.uniform(0.995, 1.005)], [0.035], [1.0], 0.06, seed=160 + i)
        snap = highpass(r.standard_normal(n), 3500, 2) * env_ad(n, 0.0004, 0.003)
        y = fade(pok * 0.45 + snap * 0.5, 0.0005, 0.02) * db(r.uniform(-4, 0))
        pan = -0.2 if f < 285 else (-0.2 - 0.45 * min(1.0, (f - 285) / 13.0))
        k = n_of(fr2s(f - start))
        m = min(n, total - k)
        out[k:k + m] += pan_curve(y[:m], np.full(m, pan)) * math.sqrt(2)
    return norm_peak(out, -1.0)


def s_fire_live(nf, p0, p1, fin_f=2, fout_f=8):
    """Picture only: the effigy fire burning in the live room (flame_whoomph's body, low-passed)."""
    x = s_flame_lp()
    y = mono(x[n_of(0.9):n_of(0.9) + n_of(fr2s(nf))])
    y = fade(y, fr2s(fin_f), fr2s(fout_f))
    return pan_curve(y, np.linspace(p0, p1, len(y))) * math.sqrt(2)


def s_siren_hp():
    x = highpass(highpass(lib("siren_whoop_F--chip"), 1200, 2), 1200, 2)   # clear of the trumpet's held C5
    return gate(x, fr2s(8), 0.06)                                         # one 8-frame whoop


def s_drip_clack_chip():
    # the library has only the hybrid; the --chip flavour the script asks for: decimated / 5-bit drip_clack
    x = lib("drip_clack")
    y = np.stack([bitcrush(x[:, c], 5, 4) for c in range(2)], axis=1)
    y = lowpass(y, 9000, 2)
    return norm_peak(fade(y, 0.0, 0.03), -1.0)


def s_plop_chip():
    # plop_water --chip, UNPITCHED (SCRIPT 9.3): noise 'blup' with a falling band, two droplet ticks
    n = n_of(0.28)
    t = np.arange(n) / SR
    fc = 2200 * np.exp(-t / 0.025) + 480
    y = np.zeros(n)
    src = lfsr_noise(n, 16000, seed=95)
    from dsp import sweep_filter
    y += sweep_filter(src, fc, q=2.0, kind="band") * env_ad(n, 0.002, 0.05)
    for t0, g in ((0.09, .35), (0.15, .22)):
        k = n_of(t0)
        m = n_of(0.012)
        y[k:k + m] += bandpass(lfsr_noise(m, 14000, short=True, seed=int(t0 * 1000)), 2500, 6000, 2) * env_ad(m, .0005, .004) * g
    y = bitcrush(y / max(np.abs(y).max(), 1e-9), 6, 3)
    return stereo(norm_peak(fade(lowpass(y, 8000, 2), 0.0005, 0.03), -1.0))


def s_pop_budget():
    # PEEKDEEP pops on a budget: the first transient of tower_pop only (no overshoot ticks, no dust), a bit far
    return lowpass(gate(lib("tower_pop"), 0.07, 0.03), 6000, 2)


def s_pop_rr():
    return varispeed(lib("tower_pop"), 0.94)            # round-robin for the second of the double pop


# ---- extras (opt-in stem) -------------------------------------------------------------------------------------------
def x_glyph_cone():
    x = highpass(highpass(lib("glyph_shimmer"), 2000, 2), 2000, 2)        # no sub pressure, no swell: grains only
    y = x[n_of(0.55):n_of(0.55) + n_of(fr2s(5) + 0.05)]
    y = fade(y, 0.004, 0.05)
    return pan_curve(mono(y), np.linspace(0.45, -0.3, len(y))) * math.sqrt(2)


def x_glyph_cursor():
    # the cursor window (f532-539): grains only on the cursor's on-frames (f532-535, f538-539)
    x = highpass(lib("glyph_shimmer"), 3000, 2)
    total = n_of(fr2s(8))
    out = np.zeros((total, 2))
    for f0, nf, off in ((0, 4, 1.1), (6, 2, 1.5)):
        seg = fade(x[n_of(off):n_of(off) + n_of(fr2s(nf))], 0.003, 0.012)
        k = n_of(fr2s(f0))
        out[k:k + len(seg)] += seg[:total - k]
    return out


def x_glyph_iris():
    return highpass(lib("glyph_blink"), 1500, 2)


def x_render_front():
    x = lib("render_front_sweep")
    y = np.stack([bitcrush(x[:, c], 6, 3) for c in range(2)], axis=1)
    y = gate(lowpass(y, 7000, 2), fr2s(12), 0.08)
    return pan_curve(mono(y), np.linspace(-0.6, 0.6, len(y))) * math.sqrt(2)


def x_whip_air():
    # the picture's whip pans into the dinner (meras f220-224, mdinner1 f225-229): a soft air pass, no 'whoosh' sweetener
    n = n_of(fr2s(10) + 0.05)
    t = np.arange(n) / SR
    from dsp import sweep_filter
    fc = 500 + 2200 * np.sin(np.pi * np.clip(t / fr2s(10), 0, 1)) ** 2
    y = sweep_filter(noise(n, "pink", 171), fc, q=0.9, kind="band")
    y *= np.sin(np.pi * np.clip(t / fr2s(10), 0, 1)) ** 1.5
    return pan_curve(norm_peak(fade(y, 0.01, 0.05), -1.0), np.linspace(0.4, -0.4, n)) * math.sqrt(2)


def x_candle():
    # the crown glint becomes a candle flame (f225): a soft wick 'fwup' and one crackle, no whoosh
    n = n_of(0.45)
    y = bandpass(noise(n, "pink", 101), 180, 1400, 2) * env_ad(n, 0.035, 0.16, 4.0)
    k = n_of(0.12)
    m = n_of(0.006)
    y[k:k + m] += highpass(np.random.default_rng(102).standard_normal(m), 2500, 1) * 0.25
    return stereo(norm_peak(fade(y, 0.002, 0.08), -1.0))


def x_flame_thaw(nf=16):
    x = s_flame_lp()
    y = x[n_of(0.9):n_of(0.9) + n_of(fr2s(nf))]
    return fade(y, fr2s(2), fr2s(9))


def x_gerg_typing():
    # a quiet run of Gerg's keys (every 1-2 frames, round robin) for the picture's live room f255-292
    total = n_of(fr2s(38))
    out = np.zeros((total, 2))
    r = np.random.default_rng(141)
    t = 0.0
    i = 0
    while t < fr2s(36):
        x = lib(f"key_tap_soft_{(i % 6) + 1:02d}") * db(r.uniform(-4, 0))
        k = n_of(t)
        m = min(len(x), total - k)
        out[k:k + m] += x[:m]
        t += fr2s(r.choice([1, 1, 2])) + r.uniform(-0.004, 0.004)
        i += 1
    return highpass(out, 400, 2)


def x_cut_tick():
    n = n_of(0.012)
    r = np.random.default_rng(111)
    y = highpass(r.standard_normal(n), 5000, 2) * env_ad(n, 0.0003, 0.0018)
    return stereo(norm_peak(fade(y, 0.0, 0.004), -1.0))


def x_roofline():
    # f622-627 the line races along the roofs L->R; f628-629 up the spire; out at f630 (the title owns f630)
    n = n_of(fr2s(8))
    t = np.arange(n) / SR
    from dsp import sweep_filter
    fc = np.where(t < fr2s(6), 3000 + 2500 * t / fr2s(6), 5500 + 3500 * (t - fr2s(6)) / fr2s(2))
    y = sweep_filter(noise(n, "white", 121), fc, q=3.0, kind="band")
    y *= np.clip(t / 0.02, 0, 1) * (0.7 + 0.3 * t / t[-1])
    y = fade(y, 0.0, 0.015)
    p = np.where(t < fr2s(6), -0.7 + 0.9 * t / fr2s(6), 0.2)
    return pan_curve(norm_peak(y, -1.0), p) * math.sqrt(2)


def x_title_layer():
    # a chrome transient for the wordmark slam: F6 / C7 / F7 partials (no third), high-passed (the music owns the sub)
    n = n_of(0.7)
    y = modal([hz("F6"), hz("C7"), hz("F7"), hz("C8")], [0.5, 0.35, 0.25, 0.15], [1, .7, .45, .2], 0.7, seed=131)
    y += highpass(noise(n, "white", 132), 3000, 2) * env_ad(n, 0.0005, 0.012) * 1.5
    y = highpass(y, 400, 2) * env_ad(n, 0.0008, 0.35, 3.0)
    return stereo(norm_peak(fade(y, 0.0, 0.1), -1.0))


def x_bookend_hum():
    return s_server_hum()


# ---- blips (separate BLIP bus) --------------------------------------------------------------------------------------
def b_kit(rel, ratio=1.0):
    x = libfile(rel)
    return varispeed(x, ratio) if ratio != 1.0 else x


def b_nole_bend():
    return bend_resample(libfile("blips/kits/nole/chip/nole_chip_Eb6.wav"), -70, 0.045)


def b_mario_echo(rel, ratio=1.0):
    return lowpass(b_kit(rel, ratio), 3000, 2)


def b_orb_toast():
    # the Orb's toast chime (f692): a single C7, 80 ms. The Orb never speaks.
    n = n_of(0.08)
    f = hz("C7")
    y = np.sin(2 * math.pi * f * np.arange(n) / SR) * 0.8 + pulse(f, n, 0.125) * 0.08
    y *= env_ad(n, 0.003, 0.03, 2.5)
    return stereo(norm_peak(fade(y, 0.002, 0.02), -1.0))


# =====================================================================================================================
# THE SPOT
# gain: applied dB (manifest mixDb + TRIM + adj) or peak=<target dBFS>; pan: -1..1 (balance for stereo sources)
# anchor: 'start' (file start on the frame), 'end' (file end on the frame), or ('hit', seconds into the file)
# cut: frame at which the sound stops dead (exclusive), fout: fade (s) ending at the cut
# =====================================================================================================================
def mx(sid, adj=0.0):
    return MAN[sid]["mixDb"] + TRIM + adj


def build_spot():
    E = []

    def ev(eid, key, src, *, layer="main", gain=None, peak=None, pan=0.0, anchor="start", cut=None, fin=0.0,
           fout=0.0, auto=None, note="", ref="", lib_id=None, frame=None, head=None):
        E.append(dict(id=eid, key=key, frame=F[key] if frame is None else frame, src=src, layer=layer, gain=gain,
                      peak=peak, pan=pan, anchor=anchor, cut=cut, fin=fin, fout=fout, auto=auto, note=note, ref=ref,
                      lib=lib_id, head=head))

    # ---------------- 3.2 COLD OPEN (f0-119) ----------------
    ev("co.room_tone", "coldopen.in", ("server_hum_tuned", s_server_hum), gain=-26.0, fin=fr2s(6),
       cut=F["coldopen.out"], fout=fr2s(3), lib_id="server_hum",
       auto=PROFILE["hum"],
       note="Room tone: server_hum bed (F2 hum, F3/C4 fans; A partials notched), 'in at -30 dB' = peaks ~-30.6 dBFS. "
            "Perspective follows the shots (+2 dB in the wide/room shots, -2 dB in the macro inserts). Music owns the "
            "drone (room_drone is cut). Out on the "
            "white, dead at the f120 cut.", ref="3.2 f0-14; 9.3")
    rr = 0
    if PROFILE["brk"] is not None:
        E.append(dict(id="co.key.L2.break", key=None, frame=PROFILE["brk"], src=("lib", "key_tap_space"), layer="main",
                      gain=None, peak=TAP_OUT - 0.5, pan=0.0, anchor="start", cut=None, fin=0.0, fout=0.0, auto=None,
                      lib="key_tap_space", ref="picture only (mcoldopen L2_BREAK)",
                      note="shift+enter to line 2 (heavier key: the space-bar thock). Picture only; the script's line "
                           "has no break."))
    for keys, text, lead in ((PROFILE["keys1"], L1, 6), (PROFILE["keys2"], L2, 8)):
        for i, (f, ch) in enumerate(zip(keys, text)):
            under = any(a <= f <= b for a, b in VO_WORDS)
            if ch == " ":
                sid = "key_tap_space"
            else:
                sid = f"key_tap_soft_{(rr % 6) + 1:02d}"
                rr += 1
            vary = [0.0, -1.0, -0.5, -1.5, -0.3, -1.2][i % 6] + (0.8 if ch in ";." else 0.0)
            pk = (TAP_UNDER if under else TAP_OUT) + min(0.0, vary)
            E.append(dict(id=f"co.key.{'L1' if lead == 6 else 'L2'}.{i:02d}", key=None, frame=f, src=("lib", sid),
                          layer="main", gain=None, peak=pk, pan=round(0.04 * math.sin(i * 1.7), 3), anchor="start",
                          cut=None, fin=0.0, fout=0.0, auto=None, lib=sid, ref="3.2 f24-57/f72-89; 9.3",
                          note=f"key '{ch}' ({'space' if ch == ' ' else 'char'}), reveal frame; "
                               f"{'under VO: peak %.0f dBFS or lower' % TAP_UNDER if under else 'outside words'}"))
    ev("co.orb_servo", "orb.iris_turn", ("orb_servo_C6", s_orb_servo_C6), gain=mx("orb_servo", -4), pan=0.5,
       lib_id="orb_servo", note="Orb iris servo, a tuned chip whirr on C6: hybrid servo at 2x (motor on C6, cruise = "
       "the 3 iris drawings f97-99) + 12.5% pulse whirr; end-stop tick lands f100.", ref="3.2 f90-104; 9.3")
    ev("co.orb_scan", "orb.scan", ("orb_scan_sweep_FC", s_orb_scan_FC), gain=mx("orb_scan_sweep", -4), pan=0.0,
       lib_id="orb_scan_sweep", note=f"Scan 'shhk' on the cone (f{F['orb.scan']}; SCRIPT f100): a filtered ~5-frame "
       "noise sweep retuned to F/C (1.6-1.7 kHz cluster cut, F/C resonators), from the Orb out across the room. Gone "
       "with the cone. No glyph_shimmer, no sting.", ref="3.2 f90-104; 9.3")
    ev("co.revswell_120", "y1993.drop", ("lib", "reverse_swell_1beat"), gain=mx("reverse_swell_1beat", -1),
       anchor="end", lib_id="reverse_swell_1beat",
       note="reverse_swell_1beat end-anchored at f120 (runs f105-119, peaks f119). The SFX owns this swell "
            "([SCORE] cut the music revswell at f105).", ref="3.2 f105-111; 9.3")
    ev("co.post_click", "post.click", ("lib", "post_click--chip"), gain=mx("post_click--chip", 0), pan=-0.1,
       lib_id="post_click--chip", note="post_click--chip on the [Post] click (button inverts 1 frame).",
       ref="3.2 f112-119")

    # ---------------- 3.3 1993 (--chip) ----------------
    ev("y93.bonk", "dialog.cancel", ("lib", "alert_bonk--chip"), gain=mx("alert_bonk--chip", 3), pan=-0.25,
       lib_id="alert_bonk--chip", note="Bonk: alert_bonk--chip, E4 dropping to E3, ~60 ms, dry. E against the F "
       "pedal. Cancel does nothing. The SFX owns it ([SCORE] delete the square-bass B2 at f150).", ref="3.3 f150-164")
    ev("y93.ok_click", "dialog.ok", ("lib", "dialog_ok_click--chip"), gain=mx("dialog_ok_click--chip", 2), pan=0.0,
       lib_id="dialog_ok_click--chip", note="OK click, 1-bit (OK inverts 1 frame).", ref="3.3 f165-167")

    # ---------------- 3.4 2008-2014 (--chip) ----------------
    ev("y08.collar1", "collar.pop1", ("lib", "collar_pop_Ab4--chip"), gain=mx("collar_pop_Ab4--chip", 1),
       pan=0.35, lib_id="collar_pop_Ab4--chip", note="collar pop A-flat4 on the hook's swung F.", ref="3.4 f180-194")
    ev("y08.collar2", "collar.pop2", ("lib", "collar_pop_C5--chip"), gain=mx("collar_pop_C5--chip", 1), pan=0.35,
       lib_id="collar_pop_C5--chip", note="collar pop C5 (SCRIPT 9.3: f190, 'retime from f187').", ref="3.4 f180-194")
    ev("y14.collar_repop", "collar.repop", ("lib", "collar_pop_F5--chip"), gain=mx("collar_pop_F5--chip", 1),
       pan=0.0, lib_id="collar_pop_F5--chip", note="collar re-pop F5 out of the hoodie (SCRIPT 9.3: f205, 'retime "
       "from f202'): the three pops spell A-flat-C-F.", ref="3.4 f195-224")
    ev("y14.crown_flutter", "crown.flutter", (f"crown_flutter_chip_{PROFILE['flutter'][0]}", lambda a=PROFILE["flutter"]: s_crown_flutter(*a)),
       peak=-33.0,
       note=f"Paper crown flutter, --chip: {PROFILE['flutter'][0]} LFSR flicks on twos down the dotted path "
            f"(f{F['crown.flutter']}-{F['crown.flutter'] + 2 * (PROFILE['flutter'][0] - 1)}), panned LUAP -> Mas.", ref="3.4 f195-224")
    ev("y14.crown_land", "crown.land", ("crown_land_tick_chip", s_crown_land), peak=-24.0,
       note="Soft landing tick as the crown lands on Mas's head (unpitched). No crowd 'ohh'.", ref="3.4 f195-224")

    # ---------------- 3.4 last row / 3.5 THE WOODROSE (hybrid) ----------------
    pop_l = [f for f in (PROFILE["keycaps"] or []) if F["woodrose.matchcut"] <= f < F["gerg.freeze"]]
    if pop_l:
        # SUP P3 #14: the library loop's pops didn't match the picture (first pop +125 ms); one pop per launch now
        ev("d15.keycap_popcorn", "woodrose.matchcut", ("keycap_popcorn_launches", lambda L=tuple(pop_l): s_keycap_run(
           list(L), L[0])), peak=-20.0, frame=pop_l[0], cut=F["gerg.freeze"], fout=0.012,
           note=f"Gerg's keycaps popping like popcorn: one plastic snap + hollow F-minor 'pok' per picture launch "
                f"({len(pop_l)} launches, f{pop_l[0]}-{pop_l[-1]}, per intro-events.json), frame-left of centre. Cut "
                "dead at f240: the keycaps freeze mid-air.", ref="3.4 f225-239")
    else:
        ev("d15.keycap_popcorn", "woodrose.matchcut", ("lib", "keycap_popcorn"), gain=mx("keycap_popcorn", -1),
           pan=-0.2, cut=F["gerg.freeze"], fout=0.012, lib_id="keycap_popcorn",
           note="Gerg's keycaps popping like popcorn (Gerg near side, frame-left of centre). Cut dead at f240: the "
                "keycaps freeze mid-air.", ref="3.4 f225-239")
    ev("d15.keyboard_roll", "gerg.keys_roll_end", ("lib", "keyboard_roll"), gain=mx("keyboard_roll", 0), pan=-0.2,
       anchor="end", lib_id="keyboard_roll", note="keyboard_roll, straight 32nds accelerating, end-anchored on f240 "
       "(runs f225-239). The keyboard is the roll ([SCORE] cut the brush roll + revswell at f228). No tape_spinup.",
       ref="3.4 f225-239")
    if PROFILE["keycaps"]:
        live = [f for f in PROFILE["keycaps"] if F["gerg.world_resumes"] <= f < F["alyi.freeze"]
                or F["alyi.world_resumes"] <= f < F["alyi.world_resumes"] + 30]
        if live:
            ev("x.gerg.keycaps_live", "gerg.world_resumes", ("keycap_run_live", lambda L=tuple(live): s_keycap_run(
               list(L), L[0])), layer="extras", peak=-28.0, frame=live[0],
               note=f"Picture-driven: Gerg's keycaps keep popping once the picture's world resumes ({len(live)} launches, "
                    f"f{live[0]}-{live[-1]}, per intro-events.json), a tiny snap + F-minor 'pok' each, following Gerg "
                    "as the camera trucks left; none in the ALYI freeze. SCRIPT keeps Gerg frozen to f285 (no sound). "
                    "MOVED TO EXTRAS: measured 29.5 dB under the music in its band (sound review P3 #11).",
               ref="picture (script 3.5a has Gerg frozen)")
    ev("d.gerg.latch", "gerg.freeze", ("latch_F", lambda: s_latch("F")), gain=mx("freeze_hit_F--chip", 0),
       lib_id="freeze_hit_F--chip", note="Freeze latch on Fm11 hit: freeze_hit_F--chip gated ~0.12 s.",
       ref="3.5a f240-244")
    ev("d.gerg.item_take", "gerg.keycap_pocket", ("item_take_keycap", lambda: s_item_take("keycap")), peak=ITEM_PK,
       pan=0.3, note="item_take: the CTRL keycap pocketed into the hoodie (quiet foley pickup, not a BLIP).",
       ref="3.5a f270-284")
    ev("d.alyi.flame", "alyi.effigy_ignite", ("flame_whoomph_lp2k", s_flame_lp), gain=mx("flame_whoomph", -4),
       pan=0.1, cut=F["alyi.freeze"], fout=0.015, lib_id="flame_whoomph",
       note="Effigy ignition: flame_whoomph low-passed at 2 kHz, -4 dB, under the whisper. "
            "SCRIPT f290. Cut dead at the f300 freeze: the frozen fire makes no sound.", ref="3.5b f285-299; 9.3")
    if PROFILE["name"] == "picture":
        # sound review P3 #11 / edit P1 #18: inaudible (26 / 23 dB under the music in band) and, once the ALYI
        # freeze holds to f340, the marshmallow is toasted on a frozen, silent fire. Kept opt-in on extras only.
        ev("x.alyi.fire_live", "alyi.world_resumes", ("fire_live_36f", lambda: s_fire_live(36, 0.1, -0.6)),
           layer="extras", gain=mx("flame_whoomph", -10),
           note=f"Picture-driven: the effigy fire burns live when the world resumes (f{F['alyi.world_resumes']}). "
                "SCRIPT has it frozen and silent to f339. MOVED TO EXTRAS (inaudible; sound review P3 #11).",
           ref="picture (script 3.5b f328-339 silent)")
        ev("x.alyi.fire_live2", "mario.fire_back", ("fire_live_24f", lambda: s_fire_live(24, 0.05, 0.05, 3, 1)),
           layer="extras", gain=mx("flame_whoomph", -12), cut=F["nole.fire_snuff"], fout=0.02,
           note="Picture-driven: the fire back in frame beside Mas until the booster's downdraft snuffs it (f410). "
                "MOVED TO EXTRAS (inaudible; sound review P3 #11).", ref="picture (mdinner2 fireOut 410)")
    ev("d.alyi.latch", "alyi.freeze", ("latch_Db", lambda: s_latch("Db")), gain=mx("freeze_hit_Db--chip", 0),
       lib_id="freeze_hit_Db--chip", note="Freeze latch on Dbmaj9(#11): freeze_hit_Db--chip gated.",
       ref="3.5b f300-314")
    ev("d.mario.klaxon", "mario.vault", ("lib", "klaxon--chip"), gain=mx("klaxon--chip", 6), pan=0.45,
       lib_id="klaxon--chip", note="klaxon--chip, two-tone B-flat4/F4 on straight eighths, f345-359 (no Harmon "
       "layer); the file ends dead on f360. +6 dB (sound review P1 #3: it was 16 dB under the music in its band, so "
       "the dead klaxon at f360 had nothing to cut; the mix also rides the strings -3 dB over f344-360).",
       ref="3.5c f345-359")
    ev("d.mario.steam", "mario.vault", ("lib", "steam_hiss"), gain=mx("steam_hiss", 0), pan=0.5,
       cut=F["mario.freeze"], fout=0.01, lib_id="steam_hiss",
       note="Steam hiss from the vault vents; cut dead at the f360 freeze with the klaxon.", ref="3.5c f345-359")
    for k, note in (("mario.tick1", "F6"), ("mario.tick2", "G6"), ("mario.tick3", "Ab6")):
        ev(f"d.mario.chime_{note}", k, (f"check_chime_chip_{note}", lambda n=note: s_chime_chip(n)), peak=-19.0,
           pan=0.5, note=f"HUD check chime, chip {note} (RED-TEAMED check {k[-1]} of 3: the knee, climbing). "
           "Three one-shots replace vault_chime_triple; paper_flutter is cut. +6 dB with the klaxon (sound review P1 #3).",
           ref="3.5c f345-359; 9.3")
    ev("d.mario.latch", "mario.freeze", ("latch_Bb", lambda: s_latch("Bb")), gain=mx("freeze_hit_Bb--chip", 0),
       lib_id="freeze_hit_Bb--chip", note="Freeze latch on Bbm9: freeze_hit_Bb--chip gated. The klaxon is dead: "
       "the only reaction.", ref="3.5c f360-377")
    ev("d.mario.unroll", "mario.scroll_unroll", (f"paper_unroll_{PROFILE['unroll']}f", lambda nf=PROFILE["unroll"]: s_paper_unroll(nf)),
       peak=-22.0,
       note=f"Paper-unroll swish f{F['mario.scroll_unroll']}-{F['mario.scroll_unroll'] + PROFILE['unroll'] - 1} (8 px "
            "per frame, toward frame-right; the free end stops at Mas's feet on the last frame).", ref="3.5c f378-389; 9.3")
    ev("d.mario.item_take", "mario.scroll_take", ("item_take_scroll", lambda: s_item_take("scroll")), peak=ITEM_PK,
       pan=-0.25, note="item_take: Mas picks up the scroll's tail (paper pinch).", ref="3.5c f390-402")
    ev("d.nole.rumble", "nole.rumble", ("rumble_overhead", s_rumble), peak=-29.0, pan=0.1,
       cut=F["nole.touchdown"], fout=0.004, note="A low rumble begins overhead (f403); grows under the burst and "
       "roar, cut dead at f420. No paper_whip.", ref="3.5c f403-404")
    ev("d.nole.ceiling_burst", "nole.ceiling_burst", ("lib", "ceiling_burst"), gain=mx("ceiling_burst", 0),
       pan=0.1, cut=F["nole.touchdown"], fout=0.01, lib_id="ceiling_burst",
       note="ceiling_burst at f405 (crack, tile crunch, debris); stops dead at the f420 freeze.", ref="3.5d f405-419")
    rip = F["nole.touchdown"] - 6          # the trumpet rip runs f414-419 (brass accent #5), up into the f420 hit
    ev("d.nole.rocket_roar", "nole.ceiling_burst", ("lib", "rocket_roar"), gain=mx("rocket_roar", 0), pan=-0.15,
       lib_id="rocket_roar", auto=[(0, 0.0), (rip - 2, 0.0), (rip - 1, -3.0), (TOTAL_F, -3.0)],
       note="rocket_roar f405-419, exactly 1 beat, cut dead on its last sample so its boom folds into the f420 hit. "
            f"Ridden -3 dB from f{rip - 1} under the trumpet rip (sound review P1 #4: the rip was buried under the "
            "roar and the ceiling burst).", ref="3.5d f405-419")
    ev("d.nole.tiles", "nole.tiles", ("tile_clatter", s_tile_clatter), peak=-29.0, cut=F["nole.touchdown"],
       fout=0.004, note="Tile clatter: 5 ceramic tiles land on their own curves (f409, 411, 413, 416, 418). "
       "No chorus of sloshing glasses.", ref="3.5d f405-419")
    ev("d.nole.landing", "nole.touchdown", ("landing_thunk_hp150", s_landing_thunk), gain=mx("landing_thunk", 0),
       pan=0.1, lib_id="landing_thunk", note="landing_thunk high-passed at 150 Hz; its rattle is stopped by the "
       "freeze (gated 0.26 s).", ref="3.5d f420-434")
    ev("d.nole.latch", "nole.freeze", ("latch_C", lambda: s_latch("C")), gain=mx("freeze_hit_C--chip", 0),
       lib_id="freeze_hit_C--chip", note="Freeze latch on C7(#9b13), the biggest hit: freeze_hit_C--chip gated.",
       ref="3.5d f420-434")
    ev("d.nole.stamp", "nole.stamp", ("lib", "rubber_stamp_C"), gain=mx("rubber_stamp_C", 0), pan=-0.4,
       lib_id="rubber_stamp_C", note="SUED OVER IT. stamp at k15 (slap, C3 wood knock, C2 body, soft timpani C2); "
       "Nole's card upper left.", ref="3.5d f435-449")
    ev("d.nole.item_take", "nole.n_unhook", ("item_take_neon_N", lambda: s_item_take("n")), peak=ITEM_PK, pan=-0.2,
       cut=F["rollcall.cut1"], fout=0.01,
       note="item_take: Mas unhooks the N from the end of OPEN (steel tink on C6, tube tick).", ref="3.5d f456-464")
    ev("d.nole.letter_clunk", "nole.n_clunk", ("lib", "letter_clunk"), gain=mx("letter_clunk", 2), pan=-0.35,
       anchor=("hit", MAN["letter_clunk"].get("syncOffset", 0.18)), lib_id="letter_clunk",
       cut=F["rollcall.cut1"], fout=0.012,
       note=f"letter_clunk (F3 steel) hit-synced on f{F['nole.n_clunk']}: the N clunks in at the front of the word "
            "(SCRIPT: f464, inside the freeze; 'retime from f466/f473').", ref="3.5d f456-464")
    ev("d.found.neon_ignite", "founding.relight", ("neon_ignite_noring", s_neon_ignite_noring),
       gain=mx("neon_ignite", 2), pan=-0.25, cut=F["rollcall.cut1"], fout=0.0,
       lib_id="neon_ignite", note=f"neon_ignite on the relight (f{F['founding.relight']}), its F6 ring REMOVED (would pre-empt the F6 at f480); A/B "
       "partials notched. Cut dead at f480.", ref="3.6 f465-479; 9.3")
    ev("d.found.neon_buzz", "founding.buzz", ("neon_buzz_tuned", s_neon_buzz_tuned), gain=mx("neon_buzz", 0),
       pan=-0.25, fin=fr2s(6), cut=F["rollcall.cut1"], fout=0.0, lib_id="neon_buzz",
       note="neon_buzz f465-479 (F2 transformer; A partials notched), eased in under the ignite's flickers, CUT DEAD "
            "on the f480 cut (sample-exact).", ref="3.6 f465-479")

    # ---------------- 3.7 ROLL CALL: no SFX except the swell into f540 ----------------
    ev("rc.revswell_540", "skyline.cut", ("lib", "reverse_swell_1beat"), gain=mx("reverse_swell_1beat", -2),
       anchor="end", lib_id="reverse_swell_1beat", head=F["rollcall.cut8"],
       note=f"reverse_swell_1beat end-anchored at f540, heard only from the cursor flash (f{F['rollcall.cut8']}-539, "
            "under stab 8): its head inside the RUMPT flash is dropped, so f480-531 has no SFX by rule (sound review "
            "P3 #12; it measured -46 LUFS there). The only roll-call SFX.", ref="3.7 f532-539; 9.3")

    # ---------------- 3.8 SKYLINE (BASE) ----------------
    SWEET = (" MUTED IN THE LOCK (moved to extras): sound review P3 #11, a gag sound on every tower pop mickey-mouses the plucks the music already owns")
    ev("sky.pop_macrosoft", "pop.macrosoft", ("lib", "tower_pop"), gain=mx("tower_pop", 1.5), pan=0.35,
       lib_id="tower_pop", note="tower_pop (unpitched) MACROSOFT, f540-542. The music owns the plucks.",
       ref="3.8 f540-554")
    ev("sky.pop_elgoog", "pop.elgoog", ("lib", "tower_pop"), gain=mx("tower_pop", 0.5), pan=-0.5,
       lib_id="tower_pop", note="tower_pop ELGOOG (with the MINDDEEP annex).", ref="3.8 f555-569")
    if PROFILE["minddeep"]:
        ev("sky.pop_minddeep", "pop.elgoog", ("tower_pop_rr", s_pop_rr), gain=mx("tower_pop", -6), pan=-0.45,
           frame=F["pop.elgoog"] + 1, lib_id="tower_pop", ref="picture only (mfinale TOWERS minddeep pop = elgoog+1)",
           note="the MINDDEEP annex pops one frame after ELGOOG in the picture: a small flam (-6 dB).")
    ev("x.sky.siren", "pop.elgoog", ("siren_whoop_F_chip_hp1k2_8f", s_siren_hp), gain=mx("siren_whoop_F--chip", 0),
       layer="extras", pan=-0.5, lib_id="siren_whoop_F--chip", note="siren_whoop_F--chip high-passed at 1.2 kHz, one "
       "8-frame whoop (f555-562), clear of the trumpet's held C5." + SWEET + ".", ref="3.8 f555-569; 9.3")
    ev("sky.pop_atem", "pop.atem", ("lib", "tower_pop"), gain=mx("tower_pop", 0.5), pan=-0.35, lib_id="tower_pop",
       note="tower_pop ATEM.", ref="3.8 f570-584")
    ev("x.sky.drip", "pop.atem", ("drip_clack_chip", s_drip_clack_chip), gain=mx("drip_clack", -4), pan=-0.35,
       layer="extras", lib_id="drip_clack", note="drip_clack --chip (derived: 5-bit/decimated), -4 dB: the fresh AI "
       "letters clack and drip (F4)." + SWEET + ".", ref="3.8 f570-584; 9.3")
    ev("sky.pop_invidia", "pop.invidia", ("lib", "tower_pop"), gain=mx("tower_pop", 0.5), pan=0.4,
       lib_id="tower_pop", note="tower_pop INVIDIA.", ref="3.8 f585-599")
    ev("x.sky.ka_ching", "pop.invidia", ("lib", "ka_ching--chip"), gain=mx("ka_ching--chip", -4), pan=0.4,
       layer="extras", lib_id="ka_ching--chip", note="ka_ching--chip, -4 dB (synthesized, tuned to F6)." + SWEET +
       "; a cash register is close to the guardrails' no-meme-sounds rule, and on the Harmon fall-off at f585 it "
       "risks a 'wah-wah + ka-ching' punchline (tone review).", ref="3.8 f585-599; 9.3")
    ev("sky.pop_misanthropic", "pop.misanthropic", ("lib", "tower_pop"), gain=mx("tower_pop", 0), pan=-0.15,
       lib_id="tower_pop", note="double-pop 1/2: MISANTHROPIC (one side of NopeAI).", ref="3.8 f600-614")
    ev("sky.pop_zai", "pop.zai", ("tower_pop_rr", s_pop_rr), gain=mx("tower_pop", 0), pan=-0.3,
       lib_id="tower_pop", note="double-pop 2/2: zAI (the other side), round-robin at 0.94x.", ref="3.8 f600-614")
    ev("sky.pop_peekdeep", "pop.peekdeep", ("tower_pop_budget", s_pop_budget), gain=mx("tower_pop", -1.5), pan=0.55,
       lib_id="tower_pop", note="PEEKDEEP pops on a budget: first transient only, no overshoot ticks, no dust, a "
       "little distant (across the water).", ref="3.8 f615-621")
    ev("x.sky.plop", "pop.peekdeep", ("plop_water_chip_unpitched", s_plop_chip), gain=mx("plop_water", -4),
       layer="extras", pan=0.55, lib_id="plop_water", note="plop_water --chip, UNPITCHED (derived), -4 dB: the "
       "whale's moat." + SWEET + ".", ref="3.8 f615-621; 9.3")

    # ---------------- 3.9 TITLE: no SFX (music + PAD own f630) ----------------
    # ---------------- 3.10 BOOKEND ----------------
    if PROFILE["name"] == "picture":
        ev("book.post_click", "book.post", ("lib", "post_click--chip"), gain=mx("post_click--chip", -6), pan=-0.25,
           lib_id="post_click--chip", note="Picture-driven: Mas clicks Post again on the last beat (the cold-open "
           "click drawing) under the ding: the f112 click, 6 dB down, so the loop rhymes.", ref="picture f705")
    ev("book.ding", "bookend.ding", ("lib", "bell_ding_F6"), gain=mx("bell_ding_F6", 0), pan=-0.25,
       cut=F["loop.end"], fout=0.35, lib_id="bell_ding_F6",
       note="DING: bell_ding_F6 (chip bell with celesta), the post has gone out. The SFX owns the ding ([SCORE] "
            "remove it from title()). Faded over the last 0.35 s, silent at 30.000 s: the loop point.",
       ref="3.10 f705-711; 9.3")

    # ================= EXTRAS: requested by the production list but CUT by SCRIPT v2.1 (opt-in, muted) ==========
    X = "extras"
    ev("x.glyph_cone", "orb.scan", ("x_glyph_shimmer_cone", x_glyph_cone), layer=X, peak=-34.0,
       note="GLYPH shimmer inside the scan cone f100-104 (grains only, HPF 2 kHz, no swell). SCRIPT 3.2/9.3 CUT "
            "this ('No glyph_shimmer').", ref="CUT 3.2 f90-104; 9.3")
    ev("x.render_front", "renderfront.fire", ("x_render_front_chip", x_render_front), layer=X, peak=-30.0,
       note="Render-front sweep f168-179, bit-crushed to the era, L->R with the front. SCRIPT 3.3/9.3 CUT this ('A "
            "style switch gets no sound of its own').", ref="CUT 3.3 f168-179; 9.3")
    if PROFILE["name"] == "picture":
        ev("x.whip_air", "meras.whip", ("x_whip_air", x_whip_air), layer=X, peak=-33.0,
           note="The picture's two whip pans into the dinner (f220-224, f225-229): a soft air pass under the match "
                "cut. The production list asked for a whoosh into the dinner; SCRIPT has a locked match cut and no "
                "whoosh.", ref="picture f220-229; not scripted")
    ev("x.candle", "woodrose.matchcut", ("x_candle_wick", x_candle), layer=X, peak=-32.0,
       note="Candle wick 'fwup' as the crown glint becomes the flame (no whoosh). Not in SCRIPT (tape_spinup and "
            "the f228 revswell are cut; the keyboard owns f225-239).", ref="not scripted 3.4 f225")
    for i in range(8):
        cx = 16 + 48 * i + 56
        ev(f"x.rc_tick{i + 1}", f"rollcall.cut{i + 1}", ("x_cut_tick", x_cut_tick), layer=X, peak=-42.0,
           pan=0.0 if PROFILE["name"] == "picture" else round((cx / 480) * 2 - 1, 2) * 0.8,
           note=f"Roll-call cut tick {i + 1}/8 (very subtle, under stab {i + 1}); panned to window {i + 1}. SCRIPT "
                "3.7/9.3: 'The roll call (f480-539) has no SFX except the reverse swell'.", ref="CUT 3.7; 9.3")
    ev("x.glyph_cursor", "rollcall.cut8", ("x_glyph_cursor_window", x_glyph_cursor), layer=X, peak=-38.0, pan=0.0,
       note="GLYPH grains on the cursor window's on-frames (f532-535, f538-539). CUT by SCRIPT 3.7 (no SFX).",
       ref="CUT 3.7 f532-539")
    ev("x.roofline", "skyline.roofline", ("x_roofline_ignite", x_roofline), layer=X, peak=-33.0,
       cut=F["title.slam"], fout=0.004, note="Roofline ignite f622-629: a thin electric line L->R, up the spire, "
       "out at f630. SCRIPT 3.8: 'No new SFX'.", ref="CUT 3.8 f622-629")
    ev("x.title_layer", "title.slam", ("x_title_chrome_hit", x_title_layer), layer=X, peak=-26.0,
       note="Title-hit layer: chrome transient on F6/C7/F7 (no third), HPF 400 Hz so the music keeps the C2->F1 sub "
            "drop. Not in SCRIPT 3.9 (music + PAD own f630).", ref="not scripted 3.9 f630")
    ev("x.glyph_iris", "orb.iris_glyph", ("x_glyph_blink_iris", x_glyph_iris), layer=X, peak=-36.0, pan=0.5,
       anchor=("hit", MAN["glyph_blink"].get("syncOffset", 0.25)),
       note="GLYPH blink in the Orb's iris f705-706 (glyph_blink, hit-synced, HPF 1.5 kHz). SCRIPT 9.3 removes "
            "glyph_blink (f705).", ref="CUT 3.10; 9.3")
    ev("x.bookend_room", "bookend.cut", ("server_hum_tuned", s_server_hum), layer=X, gain=-28.0, fin=0.25,
       cut=F["loop.end"], fout=0.35, lib_id="server_hum",
       note="Editor's suggestion: the room tone under the reverse angle so the loop f719->f0 is seamless. SCRIPT "
            "3.10 lists no SFX here.", ref="not scripted 3.10 f690-719")

    # ================= BLIP BUS (SCRIPT 3.5 BLIP rows; 9.6 'blip' bus) =================================================
    B = "blip"
    for f, note, word in ((246, "C7", "ORG"), (248, "Eb7", "CHART:"), (251, "F7", "HIM.")):
        ev(f"blip.gerg.{word.strip(':.')}", "gerg.freeze", (f"blip_gerg_chip_{note}",
           lambda n=note: b_kit(f"blips/kits/gerg/chip/gerg_chip_{n}.wav")), layer=B, gain=BLIP_DB["gerg"], pan=-0.35,
           frame=f, note=f"GERG blip '{word}' on {note} (Fm11 tone), clicky tick.", ref="3.5a f245-269")
    mario = ((366, "C5", "HAS", "C5", 1.0), (368, "Db5", "CONCERNS.", "C5", 2 ** (1 / 12)),
             (373, "F5", "HAS", "F5", 1.0), (375, "Ab5", "GPUS.", "Ab5", 1.0))
    for f, note, word, base, ratio in mario:
        rel = f"blips/kits/mario/hybrid/mario_hybrid_{base}.wav"
        ev(f"blip.mario.{f}", "mario.freeze", (f"blip_mario_hybrid_{note}", lambda r=rel, q=ratio: b_kit(r, q)),
           layer=B, gain=BLIP_DB["mario"], pan=-0.35, frame=f, note=f"MARIO blip '{word}' on {note} (Bbm9 tone), soft marimba"
           + (" (C5 kit note raised a semitone)" if ratio != 1.0 else ""), ref="3.5c f360-377")
        ev(f"blip.mario.{f}.echo", "mario.freeze", (f"blip_mario_hybrid_{note}_echo",
           lambda r=rel, q=ratio: b_mario_echo(r, q)), layer=B, gain=BLIP_DB["mario"] + BLIP_DB["echo_rel"], pan=-0.42,
           frame=f + 4, note=f"the smaller echo blip 4 frames later: a sub-concern ({BLIP_DB['echo_rel']:+.0f} dB under its "
           "blip, low-passed at 3 kHz).", ref="3.5c f360-377")
    ev("blip.nole.NAMED", "nole.freeze", ("blip_nole_chip_C6", lambda: b_kit("blips/kits/nole/chip/nole_chip_C6.wav")),
       layer=B, gain=BLIP_DB["nole"], pan=-0.4, frame=426, note="NOLE blip 'NAMED' on C6, overdriven square.",
       ref="3.5d f420-434")
    ev("blip.nole.IT", "nole.freeze", ("blip_nole_chip_Eb6_bend", b_nole_bend), layer=B, gain=BLIP_DB["nole"], pan=-0.4,
       frame=429, note="NOLE blip 'IT.' with a small up-bend into E-flat6 (never F5).", ref="3.5d f420-434")
    if PROFILE["toast"]:     # only when the picture shows the toast (a toast riding the f705 ding needs none)
        ev("blip.orb.toast", "orb.toast", ("blip_orb_toast_C7", b_orb_toast), layer=B, peak=-24.0, pan=0.5,
           note=f"BLIP ORB: the toast chime on the \"verified: human\" toast (f{F['orb.toast']}), a single C7, 80 ms. "
                "The Orb never speaks.", ref="3.10 f690-704")
    return E


# =====================================================================================================================
# picture sync
# =====================================================================================================================
def parse_picture_events(d):
    """intro-events.json (integrator's schema: events[] of {f, end?, type, moment, what, src, script?}) -> key: frame.
    Returns (frames, lists) where lists holds per-keystroke / per-launch frame lists when the file carries them."""
    import re
    ev = d.get("events", [])
    out, lists = {}, {}

    def find(pred):
        return [e for e in ev if pred(e)]

    def first(pred, field="f"):
        m = find(pred)
        return None if not m else m[0].get(field, m[0]["f"])

    T, W = (lambda e, t: e.get("type") == t), (lambda e, w: w.lower() in e.get("what", "").lower())
    mo = lambda e, m: e.get("moment") == m  # noqa: E731
    out["orb.iris_turn"] = first(lambda e: T(e, "orb") and mo(e, "mcoldopen"))
    out["orb.scan"] = first(lambda e: T(e, "scan-cone"))
    out["post.click"] = first(lambda e: T(e, "ui") and mo(e, "mcoldopen") and W(e, "post"))
    out["dialog.cancel"] = first(lambda e: T(e, "ui") and W(e, "cancel") and W(e, "click"))
    out["dialog.ok"] = first(lambda e: T(e, "ui") and W(e, "clicks ok"))
    out["renderfront.fire"] = first(lambda e: T(e, "render-front"))
    pops = [e["f"] for e in find(lambda e: T(e, "collar-pop"))]
    for k, f in zip(("collar.pop1", "collar.pop2", "collar.repop"), pops):
        out[k] = f
    out["crown.flutter"] = first(lambda e: T(e, "prop") and W(e, "crown hops"))
    out["crown.land"] = first(lambda e: T(e, "prop") and W(e, "crown lands"))
    out["woodrose.matchcut"] = d.get("handoffs", {}).get("meras->mdinner1")
    for who, fk, uk in (("GERG", "gerg.freeze", "gerg.world_resumes"), ("ALYI", "alyi.freeze", "alyi.world_resumes"),
                        ("MARIO", "mario.freeze", "mario.world_resumes"), ("NOLE", "nole.freeze", "nole.world_resumes")):
        out[fk] = first(lambda e: T(e, "freeze") and W(e, who + " FREEZE"))
        out[uk] = first(lambda e: T(e, "unfreeze") and W(e, who + " unfreeze"))
    g = find(lambda e: T(e, "gag") and W(e, "keycap") and W(e, "pockets"))
    if g:
        m = re.search(r"pockets it (\d+)", g[0]["what"])
        out["gerg.keycap_pocket"] = int(m.group(1)) if m else g[0]["f"]
    out["alyi.effigy_ignite"] = first(lambda e: T(e, "prop") and W(e, "effigy ignites"))
    out["mario.vault"] = first(lambda e: T(e, "set") and W(e, "vault"))
    for i in (1, 2, 3):
        out[f"mario.tick{i}"] = first(lambda e: T(e, "hud") and W(e, f"tick {i}"))
    out["mario.scroll_unroll"] = first(lambda e: T(e, "prop") and W(e, "scroll"))
    sc = find(lambda e: T(e, "prop") and W(e, "scroll"))
    if sc and sc[0].get("end") is not None:
        lists["unroll"] = int(sc[0]["end"]) - int(sc[0]["f"]) + 1
    # the Orb toast (SCRIPT 3.10: "verified: human" at f692) -- the chime plays only if the picture shows it
    out["orb.toast"] = first(lambda e: mo(e, "mfinale") and (W(e, "verified: human") or T(e, "toast")))
    out["mario.scroll_take"] = first(lambda e: T(e, "gag") and W(e, "scroll's tail"))
    out["nole.ceiling_burst"] = first(lambda e: T(e, "booster") and W(e, "ceiling bursts"))
    out["nole.touchdown"] = first(lambda e: T(e, "booster-touchdown"))
    out["nole.stamp"] = first(lambda e: T(e, "stamp"))
    out["nole.n_unhook"] = first(lambda e: T(e, "n-move"))
    out["nole.n_clunk"] = first(lambda e: T(e, "n-move"), "end")
    out["founding.relight"] = first(lambda e: T(e, "neon"))
    for n in range(8):
        out[f"rollcall.cut{n + 1}"] = first(lambda e: mo(e, "mrollcall") and W(e, f"flash {n + 1} ("))
    out["skyline.cut"] = d.get("handoffs", {}).get("mrollcall->mfinale")
    for t, name in (("macrosoft", "MACROSOFT"), ("elgoog", "ELGOOG"), ("atem", "ATEM"), ("invidia", "INVIDIA"),
                    ("misanthropic", "MISANTHROPIC"), ("zai", "zAI"), ("peekdeep", "PEEKDEEP")):
        out[f"pop.{t}"] = first(lambda e: T(e, "tower-pop") and name in e.get("what", ""))
    out["skyline.roofline"] = first(lambda e: T(e, "roofline-ignite"))
    out["title.slam"] = first(lambda e: T(e, "title-slam"))
    out["bookend.cut"] = first(lambda e: T(e, "cut") and mo(e, "mfinale") and e["f"] >= 680)
    out["bookend.ding"] = first(lambda e: T(e, "ding"))
    out["book.post"] = first(lambda e: T(e, "ding") and W(e, "post"))
    out["orb.iris_glyph"] = first(lambda e: T(e, "iris"))
    k = find(lambda e: T(e, "keycap-pop") and W(e, "launch frames"))
    if k:
        m = re.search(r"Launch frames:\s*([\d,\s]+)", k[0]["what"])
        if m:
            lists["keycaps"] = [int(x) for x in m.group(1).replace(" ", "").split(",") if x]
    shots = []
    for e in ev:
        m = re.match(r"shot (\w+):", e.get("what", "")) if mo(e, "mcoldopen") and e.get("type") in ("shot", "cut") else None
        if m:
            shots.append((int(e["f"]), int(e.get("end", e["f"])), m.group(1)))
    if shots:
        lists["shots"] = sorted(shots)
    tt = find(lambda e: T(e, "text-type") and mo(e, "mcoldopen"))
    lists["typing"] = [(e["f"], e.get("end", e["f"]), e["what"]) for e in tt]
    return {k: v for k, v in out.items() if v is not None}, lists


def apply_picture_F():
    """Before the spot is built: override the profile's frames with intro-events.json, logging every delta."""
    report = dict(eventsJson=os.path.relpath(EVENTS_JSON, PROJ), present=os.path.exists(EVENTS_JSON), matched=[],
                  unmatched=[], deltas=[], typingCheck=[], keycapLaunches=None)
    if not report["present"]:
        return report
    raw = open(EVENTS_JSON, "rb").read()
    d = json.loads(raw)
    report["version"] = d.get("version")
    report["eventsMd5"] = hashlib.md5(raw).hexdigest()
    frames, lists = parse_picture_events(d)
    report["pictureFrames"] = {k: int(v) for k, v in sorted(frames.items())}
    for key in F:
        if key not in frames:
            report["unmatched"].append(key)
            continue
        report["matched"].append(key)
        if int(frames[key]) != F[key]:
            report["deltas"].append(dict(key=key, profile=F[key], picture=int(frames[key]),
                                         script=SCRIPT_F.get(key)))
            F[key] = int(frames[key])
    if "keycaps" in lists:
        PROFILE["keycaps"] = lists["keycaps"]
        report["keycapLaunches"] = lists["keycaps"]
    if "shots" in lists:
        # the room tone's perspective follows the cold open's shots (+2 dB in the wide/room shots, -2 / -1.5 dB
        # in the macro inserts), stepped on each cut
        pg = dict(macro9=-2.0, macro3=-1.5, medium=0.0, wide=2.0, white=0.0)
        hum = []
        for f0, f1, sid in lists["shots"]:
            hum += [(f0, pg.get(sid, 0.0)), (f1, pg.get(sid, 0.0))]
        PROFILE["hum"] = hum
        report["roomTonePerspective"] = hum
    # frames events.ts copies by hand from scene code: trust the code that renders, log any disagreement
    for key, path, sym in (("alyi.effigy_ignite", MDINNER1_SC, "IGNITE"),):
        v = read_ts_const(path, sym)
        if v is not None and v != F.get(key):
            report.setdefault("codeOverrides", []).append(dict(key=key, eventsJson=F.get(key), code=v,
                                                               source=f"{os.path.relpath(path, PROJ)} {sym}"))
            F[key] = v
    if "unroll" in lists and 6 <= lists["unroll"] <= 24:
        PROFILE["unroll"] = lists["unroll"]
    PROFILE["toast"] = "orb.toast" in frames
    # keys the picture file doesn't carry, derived from the ones it does
    derived = {
        # the neon hums only in the live room: from the NOLE unfreeze (SCRIPT: 465, with the relight)
        "founding.buzz": F["nole.world_resumes"],
    }
    for k, v in derived.items():
        if F.get(k) != v:
            report["deltas"].append(dict(key=k, profile=F.get(k), picture=v, script=SCRIPT_F.get(k), derived=True))
            F[k] = v
    # the crown flutter runs from the hop to the landing, one flick per drawing on twos
    nf = max(4, F["crown.land"] - F["crown.flutter"])
    PROFILE["flutter"] = ((nf + 1) // 2, nf)
    report["derived"] = dict(unroll=PROFILE["unroll"], flutter=PROFILE["flutter"], toast=PROFILE["toast"],
                             keySource=PROFILE.get("keysrc"))
    # typing: the file gives each phrase's first/last keystroke; check them against the per-key table in use
    k1, k2, brk = PROFILE["keys1"], PROFILE["keys2"], PROFILE["brk"]
    for f0, f1, what in lists.get("typing", []):
        if "near the" in what:
            report["typingCheck"].append(dict(phrase="L1", picture=[f0, f1], table=[k1[0], k1[-1]],
                                              ok=[f0, f1] == [k1[0], k1[-1]]))
        elif "unclear" in what:
            report["typingCheck"].append(dict(phrase="L2", picture=[f0, f1], table=[k2[0], k2[-1]],
                                              ok=[f0, f1] == [k2[0], k2[-1]]))
        elif "shift+enter" in what:
            report["typingCheck"].append(dict(phrase="break", picture=[f0], table=[brk], ok=f0 == brk))
    return report


# =====================================================================================================================
# render
# =====================================================================================================================
_cache = {}


def get_src(src):
    kind, b = src
    if kind == "lib":
        return lib(b), os.path.relpath(os.path.join(SFXLIB, MAN[b]["file"]), AUDIO)
    name = kind
    if name not in _cache:
        x = stereo(b())
        path = os.path.join(SRC, f"{name}.wav")
        os.makedirs(SRC, exist_ok=True)
        sf.write(path, np.clip(x, -1, 1).astype(np.float32), SR, subtype="PCM_24")
        _cache[name] = (x, os.path.relpath(path, AUDIO))
    return _cache[name]


def balance(x, p):
    a = (p + 1) * math.pi / 4
    return np.stack([x[:, 0] * math.cos(a), x[:, 1] * math.sin(a)], axis=1) * math.sqrt(2)


def render(E):
    buses = {"main": np.zeros((N, 2)), "extras": np.zeros((N, 2)), "blip": np.zeros((N, 2))}
    rows = []
    for e in sorted(E, key=lambda e: (e["frame"], e["id"])):
        x, rel = get_src(e["src"])
        x = x.copy()
        sync = e["frame"] * SPF
        if e["anchor"] == "start":
            start = sync
        elif e["anchor"] == "end":
            start = sync - len(x)
        else:
            start = sync - int(round(e["anchor"][1] * SR))
        # drop everything before the head frame (short fade in), e.g. the swell's head inside the RUMPT flash
        if e.get("head") is not None and e["head"] * SPF > start:
            k = e["head"] * SPF - start
            x = x.copy()
            x[:k] = 0.0
            r = min(n_of(0.012), len(x) - k)
            x[k:k + r] *= np.linspace(0.0, 1.0, r)[:, None]
        # stop dead at the cut (exclusive frame), fade ending on the cut
        trim_end = None
        if e["cut"] is not None:
            keep = e["cut"] * SPF - start
            if keep < len(x):
                x = x[:max(0, keep)]
                trim_end = keep / SR
        end = start + len(x)
        if end > N:                                  # never past 30.000 s
            x = x[:N - start]
            trim_end = (N - start) / SR
        x = fade(x, e["fin"], e["fout"])
        if e["auto"]:
            fr = np.array([a for a, _ in e["auto"]], float) * SPF - start
            g = np.array([b for _, b in e["auto"]], float)
            env = db(np.interp(np.arange(len(x)), fr, g))
            x = x * env[:, None]
        if e["peak"] is not None:
            gain = e["peak"] - peak_db(x)
        else:
            gain = e["gain"]
        y = balance(x, e["pan"]) * db(gain)
        o = start
        if o < 0:
            y = y[-o:]
            o = 0
        buses[e["layer"]][o:o + len(y)] += y
        pk = peak_db(y) if len(y) else -120.0
        rows.append(dict(
            id=e["id"], layer=e["layer"], frame=e["frame"], time=round(e["frame"] / FPS, 4),
            timecode=f"{e['frame'] // FPS:02d}:{e['frame'] % FPS:02d}", file=rel, libraryId=e["lib"],
            gain=round(gain, 2), pan=e["pan"], anchor=e["anchor"] if isinstance(e["anchor"], str) else "hit",
            hitOffsetSec=None if isinstance(e["anchor"], str) else e["anchor"][1],
            startSample=int(start), startSec=round(start / SR, 5), startFrame=round(start / SPF, 3),
            endFrame=round((start + len(x)) / SPF, 3), headFrame=e.get("head"), cutFrame=e["cut"], trimEndSec=None if trim_end is None else round(trim_end, 5),
            fadeInSec=e["fin"], fadeOutSec=e["fout"], automation=e["auto"], peakDbfs=round(pk, 1),
            note=e["note"], script=e["ref"], pictureKey=e["key"]))
    return buses, rows


def write24(path, x):
    assert x.shape == (N, 2), x.shape
    sf.write(path, np.clip(x, -1, 1).astype(np.float32), SR, subtype="PCM_24")


# =====================================================================================================================
# QA
# =====================================================================================================================
def seg(x, f0, f1):
    return x[f0 * SPF:f1 * SPF]


def rms_db(x):
    return float(10 * np.log10(max((x ** 2).mean(), 1e-20)))


def qa(buses, rows, music):
    main = buses["main"]
    out = {}
    out["length"] = dict(samples=len(main), seconds=len(main) / SR, ok=len(main) == N)
    out["peakDbfs"] = {k: round(peak_db(v), 2) for k, v in buses.items()}
    out["truePeakDb"] = {k: round(true_peak_db(v), 2) for k, v in buses.items()}
    out["lufsIntegrated"] = {k: round(lufs_integrated(v), 1) for k, v in buses.items()}
    c8 = F["rollcall.cut8"]
    out[f"rollcall_f480_{c8 - 1}_main_silent"] = dict(peak=round(peak_db(seg(main, 480, c8)), 1),
                                                     ok=peak_db(seg(main, 480, c8)) < -90)
    s480 = main[480 * SPF:480 * SPF + 200]
    out["neon_cut_dead_f480"] = dict(peak_first_4ms_after=round(peak_db(s480), 1), ok=peak_db(s480) < -90)
    out["loop_end_silent"] = dict(peak_last_10ms=round(peak_db(main[-480:]), 1), ok=peak_db(main[-480:]) < -60)
    out["loop_start_quiet"] = dict(peak_first_10ms=round(peak_db(main[:480]), 1))
    for f in (300, 360, 420):
        s = main[f * SPF + n_of(0.13):f * SPF + n_of(0.30)]
        out[f"freeze_f{f}_room_stopped"] = dict(rms_130_300ms=round(rms_db(s), 1))
    out["title_f630_689_main_silent"] = dict(peak=round(peak_db(seg(main, 630, 705)), 1),
                                            ok=peak_db(seg(main, 630, 705)) < -90)
    # SFX vs music (V1, -1.5 dB as SCRIPT 9.6) per event, 250 ms from the sync frame
    if music is not None:
        m = music * db(-1.5)
        lv = []
        for r in rows:
            if r["layer"] != "main" or r["id"].startswith("co.key"):
                continue
            a = max(0, int(r["startSample"]))
            b = min(N, a + n_of(0.25))
            if r["anchor"] == "end":
                a, b = max(0, r["frame"] * SPF - n_of(0.25)), r["frame"] * SPF
            s_sfx = main[a:b]
            s_mus = m[a:b]
            lv.append(dict(id=r["id"], frame=r["frame"], sfxRmsDb=round(rms_db(s_sfx), 1),
                           musicRmsDb=round(rms_db(s_mus), 1), sfxMinusMusic=round(rms_db(s_sfx) - rms_db(s_mus), 1)))
        out["levels_vs_V1"] = lv
        taps = [r for r in rows if r["id"].startswith("co.key")]
        out["key_taps"] = dict(count=len(taps), maxPeakUnderVO=max(r["peakDbfs"] for r in taps
                               if any(a <= r["frame"] <= b for a, b in VO_WORDS)),
                               maxPeak=max(r["peakDbfs"] for r in taps))
    return out


# =====================================================================================================================
def bb(f):
    bar, rem = divmod(f, 60)
    beat, off = divmod(rem, 15)
    return f"{bar + 1}.{beat + 1}" + (f"+{off}" if off else "")


def md_table(rows, layer, with_script=False):
    head = "| # | frame | time (s) | bar.beat |" + (" script f |" if with_script else "") + \
        " sound (file) | gain dB | pan | notes |"
    L = [head, "|" + "---|" * (head.count("|") - 1)]
    k = 0
    for r in rows:
        if r["layer"] != layer:
            continue
        k += 1
        f = r["frame"]
        extra = ""
        if r["anchor"] == "end":
            extra = f" *END-anchored: runs f{r['startFrame']:g}-{f - 1}.*"
        elif r["anchor"] == "hit":
            extra = f" *Hit-synced: file starts f{r['startFrame']:.2f}.*"
        if r["cutFrame"] is not None and r["trimEndSec"] is not None:
            extra += f" *Stops dead at f{r['cutFrame']}.*"
        sc = ""
        if with_script:
            sfr, d = r.get("scriptFrame"), r.get("pictureDelta")
            sc = " - |" if sfr is None else (f" {sfr} |" if not d else f" **{sfr}** ({d:+d}) |")
        L.append(f"| {k} | {f} | {r['time']:.3f} | {bb(f)} |{sc} `{os.path.basename(r['file'])}` | {r['gain']:+.1f} | "
                 f"{r['pan']:+.2f} | {r['note']}{extra} |")
    return "\n".join(L)


def md_keys_compact(rows):
    """the 40-odd key taps in one line each phrase (the full per-key rows are in spotting.json)"""
    out = []
    for tag in ("L1", "L2"):
        ks = [r for r in rows if r["id"].startswith(f"co.key.{tag}.") and r["id"] != "co.key.L2.break"]
        out.append(f"- **{tag}** ({len(ks)} taps): " + ", ".join(f"f{r['frame']}" for r in ks))
    return "\n".join(out)


def picture_vs_script(rows, sync):
    """Bullets: every main/blip cue whose picture frame differs from the SCRIPT v2.1 frame, then the key deltas."""
    L = []
    for r in rows:
        d = r.get("pictureDelta")
        if d and r["layer"] in ("main", "blip") and not r["id"].startswith("co.key."):
            L.append(f"- `{r['id']}`: f{r['frame']} (script f{r['scriptFrame']}, {d:+d})")
    k1, k2 = [r["frame"] for r in rows if r["id"].startswith("co.key.L1.")], \
        [r["frame"] for r in rows if r["id"].startswith("co.key.L2.") and r["id"] != "co.key.L2.break"]
    if k1 and k2:
        L.append(f"- typing: f{k1[0]}-{k1[-1]} / f{k2[0]}-{k2[-1]} (script f18-49 / f64-83)")
    for t in sync.get("typingCheck", []):
        if not t["ok"]:
            L.append(f"- **typing check:** the events file says {t['phrase']} {t['picture']}, the timeline {t['table']}")
    if not sync.get("present"):
        L.append("- (intro-events.json not present at build time)")
    return "\n".join(L) if L else "- none: every cue sits on its script frame."


def write_md(rows, srows, sync, report):
    main_rows = [r for r in rows if not (r["id"].startswith("co.key.") and r["id"] != "co.key.L2.break")]
    n_main = sum(1 for r in rows if r["layer"] == "main")
    n_keys = sum(1 for r in rows if r["id"].startswith("co.key."))
    deltas = [r for r in rows if r.get("pictureDelta")]
    lv = {d["id"]: d for d in report.get("levels_vs_V1", [])}
    txt = MD_TEMPLATE.format(
        n_main=n_main, n_keys=n_keys, n_other=n_main - n_keys,
        n_extras=sum(1 for r in rows if r["layer"] == "extras"), n_blip=sum(1 for r in rows if r["layer"] == "blip"),
        n_script=sum(1 for r in srows if r["layer"] == "main"),
        lufs=report["lufsIntegrated"]["main"], peak=report["peakDbfs"]["main"], tp=report["truePeakDb"]["main"],
        events_json=(f"**present** ({len(sync['matched'])} sync keys matched, {len(sync['deltas'])} moved; see "
                     "`picture-sync.json`). The main stem is cued to it." if sync["present"] else
        "**not present yet** at build time; frames are read from the moment code (below). Re-run the build when it "
        "appears: it re-syncs automatically and logs every delta in `picture-sync.json`."),
        n_deltas=len(deltas), keys=md_keys_compact(rows),
        main=md_table(main_rows, "main", with_script=True), extras=md_table(rows, "extras"),
        blip=md_table(rows, "blip"),
        taps="measured: {} dBFS max under the VO, {} dBFS max overall".format(
            report.get("key_taps", {}).get("maxPeakUnderVO"), report.get("key_taps", {}).get("maxPeak")),
        unfreezes=", ".join(f"{w} f{F[k]}" for w, k in (("GERG", "gerg.world_resumes"), ("ALYI", "alyi.world_resumes"),
                                                       ("MARIO", "mario.world_resumes"),
                                                       ("NOLE", "nole.world_resumes"))),
        rc_silent=next((f"{k[9:].replace('_main_silent', '')}: peak {v['peak']} dBFS" for k, v in report.items()
                        if k.startswith("rollcall_f480_")), "n/a"),
        keysrc=PROFILE.get("keysrc"),
        picture_vs_script=picture_vs_script(rows, sync),
    )
    open(os.path.join(HERE, "spotting.md"), "w").write(txt)


MD_TEMPLATE = open(os.path.join(HERE, "spotting.template.md")).read() if os.path.exists(
    os.path.join(HERE, "spotting.template.md")) else "{main}"


def run_profile(name, events_json=True):
    set_profile(name)
    sync = apply_picture_F() if events_json else dict(present=False, matched=[], unmatched=[], deltas=[])
    E = build_spot()
    buses, rows = render(E)
    for k, v in buses.items():
        assert peak_db(v) < -0.5, (name, k, peak_db(v))
    return E, buses, rows, sync


def main():
    # ---- the script-contract spot (alt), then the picture spot (primary); cache per profile (sources differ)
    _cache.clear()
    _, sbuses, srows, _ = run_profile("script", events_json=False)
    alt = os.path.join(HERE, "alt")
    os.makedirs(alt, exist_ok=True)
    write24(os.path.join(alt, "intro-sfx_stem_script-v2.1-frames.wav"), sbuses["main"])
    sframe = {r["id"]: r["frame"] for r in srows}
    json.dump(dict(profile="script", note="SCRIPT.md v2.1 contract frames (use when the picture conforms)",
                   events=srows), open(os.path.join(alt, "spotting_script-v2.1-frames.json"), "w"), indent=1)

    _cache.clear()
    E, buses, rows, sync = run_profile("picture")
    for r in rows:
        sf_ = sframe.get(r["id"])
        r["scriptFrame"] = sf_
        r["pictureDelta"] = None if sf_ is None else r["frame"] - sf_
    write24(os.path.join(HERE, "intro-sfx_stem.wav"), buses["main"])
    write24(os.path.join(HERE, "intro-sfx_extras.wav"), buses["extras"])
    write24(os.path.join(HERE, "intro-blip_stem.wav"), buses["blip"])

    music = None
    mp = os.path.join(AUDIO, "theme", "theme-V1-chipchamber.wav")
    if os.path.exists(mp):
        music, sr = sf.read(mp, always_2d=True)
        music = music[:N]
    report = qa(buses, rows, music)
    report["scriptProfile"] = dict(peakDbfs=round(peak_db(sbuses["main"]), 2),
                                   lufsIntegrated=round(lufs_integrated(sbuses["main"]), 1),
                                   events=sum(1 for r in srows if r["layer"] == "main"))
    report["pictureSync"] = sync
    json.dump(report, open(os.path.join(HERE, "qa.json"), "w"), indent=1)
    sync["pictureCodeOverrides"] = {k: dict(script=SCRIPT_F[k], picture=v, source=src)
                                    for k, (v, src) in PICTURE_CODE.items()}
    sync["pictureCodeTyping"] = {k: dict(picture=v, source=src) for k, (v, src) in PICTURE_KEYS.items()}
    json.dump(sync, open(os.path.join(HERE, "picture-sync.json"), "w"), indent=1)

    counts = {k: sum(1 for r in rows if r["layer"] == k) for k in buses}
    spot = dict(
        title="MR. MAS - Ep1 opening titles - SFX spotting list",
        source="show/intro/SCRIPT.md v2.1 (AUDIO column, 9.3); audio/sfx/manifest.json",
        profile="picture: frames as the picture carries them (moment code / intro-events.json); scriptFrame = the "
                "SCRIPT v2.1 contract frame; alt/ has the script-frame stem",
        fps=FPS, frames=TOTAL_F, bpm=96, framesPerBeat=15, sampleRate=SR, samplesPerFrame=SPF,
        durationSec=30.0, pathsRelativeTo="audio/", busTrimDb=TRIM,
        stems={"main": "intro-sfx/intro-sfx_stem.wav", "extras": "intro-sfx/intro-sfx_extras.wav",
               "blip": "intro-sfx/intro-blip_stem.wav",
               "main_scriptFrames": "intro-sfx/alt/intro-sfx_stem_script-v2.1-frames.wav"},
        conventions=dict(frame="sync frame (global intro frame)", time="frame / 24 (s)",
                         gain="dB applied to the file (after its baked processing)", pan="-1 L .. +1 R, constant power",
                         anchor="start: file start on the frame; end: file end on the frame; hit: file's hitOffsetSec on the frame",
                         cutFrame="the sound stops dead at the start of this frame (fadeOutSec ends on it)"),
        counts=counts, pictureSync=dict(present=sync["present"], deltas=sync["deltas"]),
        events=rows)
    json.dump(spot, open(os.path.join(HERE, "spotting.json"), "w"), indent=1)
    write_md(rows, srows, sync, report)
    print(json.dumps(dict(counts=counts, peak=report["peakDbfs"], lufs=report["lufsIntegrated"],
                          script=report["scriptProfile"], picture=sync["present"], deltas=sync["deltas"]), indent=1))


if __name__ == "__main__":
    main()
