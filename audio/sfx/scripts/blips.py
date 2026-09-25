"""Character voice blips for pixel dialogue boxes (adventure-game text babble).

Each character has a blip voice in three flavors:
  chip   - the 8-bit voice described in the brief (sine / square / clicks / breath / wood / brass synth)
  band   - the same voice played by a real instrument (felt piano, trumpet, claves, flute, marimba, trombone)
  hybrid - band voice with the chip voice tucked underneath (default)

Pitches come from F minor. Letters map to pitches deterministically (same letter -> same pitch), with a
cadence on the last blip (falls on '.', lifts on '?'/'!'). Lines are text-synced: blips land on the frame each
character is revealed, using the exact reveal rule in studio/src/dev/pixeladv/scene.ts:
    shownChars(f) = floor((f - t0) * cps)   ->   char k appears at frame t0 + ceil((k + 1) / cps)
For the native (non-scene) lines we also add punctuation holds, and export per-character reveal frames to JSON.
"""
from __future__ import annotations

import json
import math
import os

import numpy as np

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant

BLIP_DIR = os.path.join(ROOT, "blips")
MANIFEST_EXTRA: dict = {}

VOICES = {
    "mas": dict(
        name="MAS", pitches=["F3", "Ab3", "C4", "Eb3"], final_fall="F3", final_rise="C4", policy="syllable", every=1,
        cps=0.75, desc="soft low rounded sine, slow (blips on syllables only)", gain_db=0,
        band="felt upright piano"),
    "nole": dict(
        name="NOLE", pitches=["F5", "Ab5", "C6", "Bb5", "Eb6"], final_fall="F5", final_rise="F6", policy="every", every=2,
        cps=1.25, desc="bright, fast, slightly overdriven square", gain_db=0, band="staccato trumpet"),
    "gerg": dict(
        name="GERG", pitches=["C7", "Eb7", "F7", "Bb6"], final_fall="C7", final_rise="F7", policy="every", every=1,
        cps=1.0, desc="rapid clicky ticks (a fast keyboard talking)", gain_db=0, band="claves / wood clicks"),
    "alyi": dict(
        name="ALYI", pitches=["Ab4", "C5", "Db5", "F5", "Eb5"], final_fall="Db5", final_rise="F5", policy="every", every=3,
        cps=0.5, desc="breathy, reverberant, drifting (Db = the mystic's ache)", gain_db=0, band="breathy flute in a hall"),
    "mario": dict(
        name="MARIO", pitches=["C5", "Eb5", "F5", "G5", "Ab5"], final_fall="C5", final_rise="G5", policy="every", every=2,
        cps=0.8, desc="woody, nervous (timing and pitch jitter, little stutters)", gain_db=0, band="marimba"),
    "rumpt": dict(
        name="RUMPT", pitches=["Bb2", "C3", "Db3", "F3", "Eb3"], final_fall="Bb2", final_rise="F3", policy="every", every=2,
        cps=0.9, desc="brassy, loud, stressed word-starts", gain_db=2, band="trombone blats"),
}

LINES = {
    "nole": dict(text="I came up with the name!", t0=54, scene=True),
    "mas": dict(text="super.", t0=99, scene=True),
    "gerg": dict(text="Shipped it. Sleep is deprecated.", t0=0, scene=False),
    "alyi": dict(text="Can you feel it? The AGI.", t0=0, scene=False),
    "mario": dict(text="I have... some concerns.", t0=0, scene=False),
    "rumpt": dict(text="Tremendous. Nobody has ever seen AI like it.", t0=0, scene=False),
}


# ---------------------------------------------------------------------------- blip synthesis
def _chip_blip(voice: str, note, accent: float, seed: int) -> np.ndarray:
    f = hz(note) if not isinstance(note, float) else note
    r = rng(seed)
    if voice == "mas":
        dur = 0.11
        n = n_of(dur)
        t = np.arange(n) / SR
        fr = f * 2 ** (-0.25 / 12 * t / dur)
        ph = np.cumsum(fr) / SR
        y = np.sin(2 * math.pi * ph) + 0.12 * np.sin(4 * math.pi * ph)
        e = np.interp(t, [0, 0.008, dur], [0, 1, 0]) ** 1.2
        return lowpass(y * e, 1800) * 0.8
    if voice == "nole":
        dur = 0.05
        y = I.chip_note(f * 2 ** (r.uniform(-8, 8) / 1200), dur, "pulse", 0.25, levels=[1, 0.85, 0.6], sweep=(1, 0.012))
        return softclip(y * 1.8, 1.6) * 0.5
    if voice == "gerg":
        tick = I.chip_noise(0.012, 30000, True, levels=[1, 0.3], seed=int(seed) % 97 + 1) * 0.6
        tone = I.chip_note(f, 0.018, "pulse", 0.125, levels=[0.8, 0.3]) * 0.35
        return mix(tick, tone)[:, 0]
    if voice == "alyi":
        dur = 0.2
        n = n_of(dur)
        t = np.arange(n) / SR
        tri = I.chip_note(f, dur, "tri", levels=list(np.interp(np.arange(12), [0, 2, 11], [0.3, 1, 0])))
        breath = bandpass(I.chip_noise(dur, 6000, False, levels=[0.5] * 12, seed=seed % 50 + 3), f * 1.5, f * 4, 2)
        e = np.interp(t, [0, 0.03, dur], [0, 1, 0])
        return (tri * 0.5 + breath * e * 0.9) * 0.8
    if voice == "mario":
        dur = 0.06
        n = n_of(dur)
        t = np.arange(n) / SR
        fr = f * 2 ** (r.uniform(-25, 25) / 1200) * 2 ** (1.5 / 12 * np.exp(-t / 0.008))
        y = nes_triangle(fr, n) * env_exp(n, 0.02, 0.001)
        k = I.chip_noise(0.008, 16000, True, levels=[1, 0.2], seed=seed % 60 + 2) * 0.25
        return mix(y * 0.7, k)[:, 0]
    if voice == "rumpt":
        dur = 0.09
        n = n_of(dur)
        t = np.arange(n) / SR
        fr = f * 2 ** (-(1 - np.clip(t / 0.02, 0, 1)) / 12)
        a = pulse(fr * 2 ** (6 / 1200), n, 0.5) + pulse(fr * 2 ** (-6 / 1200), n, 0.25)
        y = sum(resonator(a, fc, q) * g for fc, q, g in ((650, 3, 1.0), (1250, 4, 0.7), (2500, 5, 0.35)))
        y = softclip(y * 2.2, 1.8)
        e = np.interp(t, [0, 0.006, dur - 0.02, dur], [0, 1, 0.8, 0])
        return y * e * 0.6 * (1 + 0.3 * accent)
    raise KeyError(voice)


def _band_blip(voice: str, note, accent: float, seed: int) -> np.ndarray:
    r = rng(seed)
    if voice == "mas":
        y = I.piano(note, 0.32, dyn=1, felt=True, release=0.15)
        return mono(y) * 1.4
    if voice == "nole":
        y = I.tpt_stac(note, 0.14)
        return mono(fade(y, 0, 0.05)) * 0.9
    if voice == "gerg":
        src = ["VSCO 1 Percussion/varWood/claves_mp.wav", "VSCO 1 Percussion/varWood/wood_click_mp.wav",
               "VSCO 1 Percussion/drums/snare/drum1/snare1_click.wav"][seed % 3]
        x = I.load(src)[:n_of(0.05)]
        ratio = hz(note) / hz("C7") * r.uniform(0.97, 1.03)
        y = varispeed(x, 0.85 + 0.3 * ratio)
        return mono(fade(y, 0, 0.01)) * 0.8
    if voice == "alyi":
        y = I.flute_stac(note, 0.26)
        return mono(fade(y, 0.01, 0.1)) * 1.1
    if voice == "mario":
        m = midi(note) + r.uniform(-0.2, 0.2)
        y = I.marimba(m, 0.22)
        return mono(fade(y, 0, 0.08))
    if voice == "rumpt":
        y = I.tbn_short(note, 0.26, loud=True)
        return mono(fade(y, 0, 0.07)) * (1 + 0.3 * accent)
    raise KeyError(voice)


def blip(voice: str, flavor: str, note, accent: float = 0.0, seed: int = 0) -> np.ndarray:
    if flavor == "chip":
        return _chip_blip(voice, note, accent, seed)
    if flavor == "band":
        return _band_blip(voice, note, accent, seed)
    b = _band_blip(voice, note, accent, seed)
    c = _chip_blip(voice, note, accent, seed)
    n = max(len(b), len(c))
    return pad_to(b, n) + pad_to(c, n) * (0.45 if voice != "gerg" else 0.6)


SPACE_FX = {"mas": ("room", 0.12), "nole": ("room", 0.1), "gerg": ("booth", 0.1), "alyi": ("hall", 0.32),
            "mario": ("room", 0.12), "rumpt": ("studio", 0.15)}


# ---------------------------------------------------------------------------- text sync
VOWELS = set("aeiouyAEIOUY")


def reveal_frames(text: str, cps: float, t0: int, scene: bool) -> list[int]:
    """Frame at which each character appears (absolute frames)."""
    out = []
    if scene:
        for k in range(len(text)):
            out.append(t0 + math.ceil((k + 1) / cps - 1e-9))
        return out
    f = float(t0)
    for k, ch in enumerate(text):
        f += 1 / cps
        out.append(int(math.ceil(f - 1e-9)))
        if ch in ",;:":
            f += 4
        elif ch in ".!?":
            nxt = text[k + 1] if k + 1 < len(text) else " "
            f += 2 if nxt == "." else 8
    return out


def blip_plan(voice: str, text: str, frames: list[int]):
    """Which characters fire a blip, on which pitch (every-Nth-letter policy + sentence cadences)."""
    v = VOICES[voice]
    pitches = v["pitches"]
    plan = []
    count = 0
    prev_alpha = False
    for i, ch in enumerate(text):
        if not ch.isalnum():
            prev_alpha = False
            continue
        word_start = not prev_alpha
        fire = (count % v["every"] == 0) or (word_start and voice == "rumpt")
        count += 1
        prev_alpha = True
        if not fire:
            continue
        idx = (ord(ch.lower()) * 7 + (3 if ch.isupper() else 0)) % len(pitches)
        accent = 1.0 if (ch.isupper() or (word_start and voice == "rumpt")) else 0.0
        plan.append(dict(i=i, ch=ch, frame=frames[i], note=pitches[idx], accent=accent))
    # cadence: the last blip of each sentence falls ('.') or lifts ('!' / '?')
    ends = [i for i, c in enumerate(text) if c in ".!?"] or [len(text)]
    for e in ends:
        inside = [p for p in plan if p["i"] < e and not any(e2 < e and p["i"] < e2 for e2 in ends)]
        if inside:
            mark = text[e] if e < len(text) else "."
            inside[-1]["note"] = v["final_rise"] if mark in "!?" else v["final_fall"]
    return plan


def mas_syllables(text, frames):
    """MAS blips on syllable onsets: word start and each consonant that precedes a new vowel group."""
    out = []
    word = ""
    for i, ch in enumerate(text):
        if ch.isalpha():
            prev = text[i - 1] if i > 0 else " "
            nxt = text[i + 1] if i + 1 < len(text) else " "
            onset = (not prev.isalpha()) or (ch not in VOWELS and nxt in VOWELS and prev in VOWELS)
            if onset:
                out.append(i)
    return out


def render_line(voice: str, flavor: str, text: str, t0: int, scene: bool, cps: float | None = None, key: str | None = None):
    v = VOICES[voice]
    cps = cps or v["cps"]
    frames = reveal_frames(text, cps, t0, scene)
    if v["policy"] == "syllable":
        idxs = mas_syllables(text, frames)
        plan = []
        for k, i in enumerate(idxs):
            note = v["pitches"][(ord(text[i].lower()) * 7) % len(v["pitches"])]
            plan.append(dict(i=i, ch=text[i], frame=frames[i], note=note, accent=0.0))
        if plan:
            plan[0]["note"] = "C4"
            plan[-1]["note"] = v["final_fall"] if text.rstrip()[-1:] == "." else v["final_rise"]
    else:
        plan = blip_plan(voice, text, frames)
    r = rng(sum(map(ord, voice + text)))
    end_f = frames[-1] + 18
    n = n_of((end_f - t0) / FPS + 1.5)
    out = np.zeros(n)
    for k, p in enumerate(plan):
        tt = (p["frame"] - t0) / FPS
        if voice == "mario":
            tt += r.uniform(-0.012, 0.018)
        b = blip(voice, flavor, p["note"], p["accent"], seed=1000 + k)
        g = db(3 * p["accent"]) * r.uniform(0.85, 1.0)
        s = n_of(max(0.0, tt))
        m = min(len(b), n - s)
        out[s:s + m] += b[:m] * g
        if voice == "mario" and r.random() < 0.22:  # nervous stutter
            s2 = s + n_of(2 / FPS)
            b2 = blip(voice, flavor, p["note"], 0, seed=2000 + k) * 0.55
            m2 = min(len(b2), n - s2)
            if m2 > 0:
                out[s2:s2 + m2] += b2[:m2]
        p["t"] = round(tt, 4)
    y = stereo(out)
    kind, wet = SPACE_FX[voice]
    if flavor == "chip" and voice not in ("alyi",):
        wet *= 0.7
    y = reverb(y, kind, wet)
    if voice == "rumpt":
        y = compress(y, -20, 3, 3, 60, 4)
    timing = dict(voice=voice, name=v["name"], text=text, cps=cps, t0=t0, sceneSynced=scene,
                  revealRule="scene.ts shownChars: floor((f - t0) * cps)" if scene else
                  "linear cps with punctuation holds (+4 frames , ; :  +8 frames . ! ?)",
                  chars=[dict(i=i, ch=ch, frame=frames[i], rel=frames[i] - t0) for i, ch in enumerate(text)],
                  blips=[dict(i=p["i"], ch=p["ch"], frame=p["frame"], rel=p["frame"] - t0, t=p["t"], note=p["note"],
                              accent=p["accent"]) for p in plan],
                  lastRevealFrame=frames[-1])
    return trim_tail(y, -70, 0.05), timing


_TIMINGS: dict = {}


def _line_fn(voice, flavor, key=None, cps=None, scene=None):
    def fn():
        L = LINES[voice]
        sc = L["scene"] if scene is None else scene
        y, timing = render_line(voice, flavor, L["text"], L["t0"], sc, cps)
        _TIMINGS[key or voice] = timing
        return y
    return fn


for voice, L in LINES.items():
    v = VOICES[voice]
    where = (f"pixeladv scene: place at f{L['t0']} (text reveal cps {v['cps']}/frame, synced to scene.ts)"
             if L["scene"] else "any pixel dialogue box; timing JSON gives per-character reveal frames")
    for flavor in ("hybrid", "chip", "band"):
        vid = f"voice_{voice}_line" + ("" if flavor == "hybrid" else f"--{flavor}")
        label = {"hybrid": f"{v['band']} + 8-bit voice", "chip": "8-bit voice: " + v["desc"], "band": v["band"]}[flavor]
        variant(vid, _line_fn(voice, flavor), cat="voice", flavor=flavor,
                variant_of=None if flavor == "hybrid" else f"voice_{voice}_line",
                desc=f"{v['name']} dialogue babble, '{L['text']}' ({label}). Text-synced; see blips/timing_{voice}.json.",
                use=where, frames=[L["t0"]] if L["scene"] else [], mix_db=-8, norm="momentary", target=-16)


variant("voice_mas_line_slow", _line_fn("mas", "hybrid", key="mas_slow", cps=0.3, scene=False), cat="voice",
        desc="MAS 'super.' at his own slow pace (0.3 chars/frame, felt piano + sine): suggested retime for the scene - two unhurried syllables.",
        use="Suggestion: set the Mas line cps to 0.3 in pixeladv (t0 f99); timing in blips/timing_mas_slow.json.",
        frames=[99], mix_db=-8, norm="momentary", target=-16)


# ---------------------------------------------------------------------------- blip kits (for live babble in-engine)
def render_kits(write_mp3_too=True):
    kits, recs = {}, []
    for voice, v in VOICES.items():
        kits[voice] = {"name": v["name"], "voice": v["desc"], "bandInstrument": v["band"], "cpsPerFrame": v["cps"],
                       "policy": v["policy"], "blipEvery": v["every"], "finalFall": v["final_fall"],
                       "finalRise": v["final_rise"], "flavors": {}}
        notes = list(dict.fromkeys(v["pitches"] + [v["final_fall"], v["final_rise"]]))
        for flavor in ("hybrid", "chip", "band"):
            files = {}
            for k, nt in enumerate(notes):
                b = stereo(blip(voice, flavor, nt, 0.0, seed=3000 + k))
                kind, wet = SPACE_FX[voice]
                b = reverb(b, kind, wet * (0.7 if flavor == "chip" and voice != "alyi" else 1))
                b = trim_tail(highpass(b, 18, 2), -70, 0.03)
                y, _ = normalize(b, -16, -1.0, "momentary")
                p = os.path.join(BLIP_DIR, "kits", voice, flavor, f"{voice}_{flavor}_{nt}.wav")
                write_wav(p, y)
                if write_mp3_too:
                    write_mp3(p, p[:-4] + ".mp3", 192)
                files[nt] = os.path.relpath(p, ROOT)
                recs.append(dict(
                    id=f"blip_{voice}_{flavor}_{nt}", file=os.path.relpath(p, ROOT),
                    preview=os.path.relpath(p[:-4] + ".mp3", ROOT) if write_mp3_too else None,
                    description=f"{v['name']} voice blip ({flavor}: {v['band'] if flavor == 'band' else v['desc'] if flavor == 'chip' else v['band'] + ' + 8-bit'}) on {nt}.",
                    pitch=nt, duration=round(len(y) / SR, 3), durationFrames=round(len(y) / SR * FPS, 1),
                    useAt=f"Live dialogue babble for {v['name']}: fire on reveal of every {v['every']} letter(s)"
                          + (" (syllable onsets)" if v["policy"] == "syllable" else "")
                          + f"; cps {v['cps']}/frame; last blip -> {v['final_fall']} on '.', {v['final_rise']} on '!'/'?'.",
                    category="voice-kit", flavor=flavor, variantOf=None if flavor == "hybrid" else f"blip_{voice}_hybrid_{nt}",
                    loop=False, frames=[], anchor="start", levels=measure(y), mixDb=-8))
            kits[voice]["flavors"][flavor] = files
    MANIFEST_EXTRA["blipKits"] = kits
    return recs


def write_timings():
    os.makedirs(BLIP_DIR, exist_ok=True)
    for voice, tm in _TIMINGS.items():
        with open(os.path.join(BLIP_DIR, f"timing_{voice}.json"), "w") as fh:
            json.dump(tm, fh, indent=1, ensure_ascii=False)
    MANIFEST_EXTRA["voiceLines"] = {v: {"text": t["text"], "t0": t["t0"], "cps": t["cps"], "sceneSynced": t["sceneSynced"],
                                        "timing": f"blips/timing_{v}.json", "blipCount": len(t["blips"])}
                                    for v, t in _TIMINGS.items()}
