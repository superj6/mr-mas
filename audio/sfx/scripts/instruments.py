"""Sampled instruments (VSCO 2 CE, CC0) + GeneralUser GS presets + 8-bit primitives.

Sample pitch map: VSCO names use an octave offset for some families (C3 = middle C convention).
`_table()` resolves each file's true pitch by checking the name (+0 / +12) against YIN and an
FFT peak, and caches it to sample_pitch.json so repitching is exact.
"""
from __future__ import annotations

import functools
import glob
import json
import math
import os
import re

import numpy as np

from dsp import (SR, VSCO, ROOT, hz, midi, load, varispeed, pitch_detect, mono, stereo, n_of, pad_to,
                 fade, lowpass, highpass, bandpass, sf_notes, env_exp, env_t60, pulse, nes_triangle,
                 lfsr_noise, chip_env, quantize_pitch_60hz, curve, db, rng, trim_silence, shelf,
                 biquad_peak, sine, triangle)

CACHE = os.path.join(ROOT, "scripts", "sample_pitch.json")

FAMILIES = {
    "piano":   "Keys/Upright Piano/Player_dyn{d}_rr1_*.wav",
    "upright1": "Keys/Upright Nr1/UR1_*_RR1.wav",
    "pizz":    "Strings/Solo Contrabass/Pizz/*_v1_rr1.wav",
    "harp":    "Strings/Harp/*.wav",
    "marimba": "Percussion/Marimba/*.wav",
    "glock":   "Percussion/Glock/*.wav",
    "xylo":    "Percussion/Xylo/*.wav",
    "harmon":  "Brass/Trumpet/harmonM-sus/*_v1_rr1.wav",
    "harmon_f": "Brass/Trumpet/harmonM-sus/*_v3_rr1.wav",
    "tpt_stac": "Brass/Trumpet/stac/*_v2_rr1.wav",
    "tbn_short": "Brass/OldTrombone/Short/*_v2_1.wav",
    "tbn_short_f": "Brass/OldTrombone/Short/*_v3_1.wav",
    "tbn_fall": "Brass/OldTrombone/Fall/*.wav",
    "flute_stac": "Woodwinds/Flute/stac/*.wav",
    "flute_sus": "Woodwinds/Flute/susNV/*.wav",
    "clar_stac": "Woodwinds/Clarinet/stac/*.wav",
    "timpani": "Percussion/Timpani/Timpani*_Hit_v3_rr1_Sum.wav",
    "timpani_soft": "Percussion/Timpani/Timpani*_Hit_v1_rr1_Sum.wav",
}




def _name_midi(path: str):
    b = os.path.basename(path)
    m = re.search(r"Player_dyn\d_rr1_(\d{3})", b)
    if m:
        return 21 + 2 * int(m.group(1)), True  # MappingChart.txt: index n -> key 21 + 2n
    m = re.search(r"_([A-G]#?)(-?\d)(?:_|\.)", b)
    if not m:
        return None, False
    return midi(m.group(1) + m.group(2)), False


def _fft_peak(x, lo=40, hi=5000, s=0.03, w=0.5):
    x = mono(x)[n_of(s):n_of(s + w)]
    if len(x) < 512:
        x = mono(x)
    N = 1 << 18
    X = np.abs(np.fft.rfft(x * np.hanning(len(x)), N))
    f = np.fft.rfftfreq(N, 1 / SR)
    m = (f > lo) & (f < hi)
    return float(f[m][np.argmax(X[m])])


def _cents(a, b):
    return 1200 * math.log2(a / b)


OCTAVE_OFFSET = {  # sounding pitch = name + offset (VSCO naming conventions, verified by ear-analysis)
    "upright1": 0, "pizz": 12, "harp": 0, "marimba": 12, "glock": 12, "xylo": 12,
    "harmon": 12, "harmon_f": 12, "tpt_stac": 12, "tbn_short": 12, "tbn_short_f": 12, "tbn_fall": 12,
    "flute_stac": 0, "flute_sus": 0, "clar_stac": 0,
}


def _pc_cents(f, nominal):
    c = 1200 * math.log2(f / nominal)
    return ((c + 600) % 1200) - 600


@functools.lru_cache(maxsize=1)
def _table() -> dict:
    if os.path.exists(CACHE):
        with open(CACHE) as fh:
            return json.load(fh)
    tab = {}
    for fam, pat in FAMILIES.items():
        pats = [pat.format(d=d) for d in (1, 2, 3)] if "{d}" in pat else [pat]
        for p in pats:
            for f in sorted(glob.glob(os.path.join(VSCO, p))):
                rel = os.path.relpath(f, VSCO)
                x = load(rel)
                if fam.startswith("timpani"):
                    tab[rel] = {"fam": fam, "hz": _fft_peak(x, 70, 260, 0.05, 0.6), "src": "fft-principal"}
                    continue
                nm, exact = _name_midi(f)
                if nm is None:
                    continue
                if exact:
                    tab[rel] = {"fam": fam, "hz": hz(nm), "midi": nm, "src": "mapping"}
                    continue
                nm += OCTAVE_OFFSET[fam]
                nominal = hz(nm)
                cands = [_fft_peak(x)]
                try:
                    cands.append(pitch_detect(x, 30, 4000, start=0.05, win=0.3))
                except Exception:
                    pass
                devs = sorted((abs(_pc_cents(c, nominal)), _pc_cents(c, nominal)) for c in cands if c > 0)
                cents = devs[0][1] if devs and devs[0][0] < 30 else 0.0
                tab[rel] = {"fam": fam, "hz": nominal * 2 ** (cents / 1200), "midi": nm,
                            "cents": round(cents, 1), "src": f"name{OCTAVE_OFFSET[fam]:+d}"}
    with open(CACHE, "w") as fh:
        json.dump(tab, fh, indent=1)
    return tab


def pick(fam: str, target_midi: float, prefer: str | None = None):
    tab = _table()
    best = None
    for rel, v in tab.items():
        if v["fam"] != fam:
            continue
        if prefer and prefer not in rel:
            continue
        m = 69 + 12 * math.log2(v["hz"] / 440)
        d = abs(m - target_midi)
        # prefer repitching down slightly (less chipmunk) by weighting up-shifts more
        d = d if m >= target_midi else d * 1.15
        d += abs(v.get("cents") or 0) / 60.0  # distrust samples whose tuning had to be corrected a lot
        if best is None or d < best[0]:
            best = (d, rel, v["hz"])
    if best is None:
        raise KeyError(f"no samples for {fam} {prefer}")
    return best[1], best[2]


def sampled(fam: str, note, dur: float | None = None, prefer: str | None = None, release: float = 0.08,
            gain_db: float = 0.0) -> np.ndarray:
    m = midi(note) if isinstance(note, str) else float(note)
    rel, f_src = pick(fam, m, prefer)
    x = load(rel)
    y = varispeed(x, hz(m) / f_src)
    if dur is not None:
        y = pad_to(y, n_of(dur))
        y = fade(y, 0.0, release)
    return y * db(gain_db)


# ---------------------------------------------------------------------------- named instruments
def piano(note, dur=2.0, dyn=2, felt=False, release=0.25):
    y = sampled("piano", note, dur, prefer=f"dyn{dyn}_", release=release)
    if felt:
        y = lowpass(y, 2400, 2)
        y = shelf(y, 250, 2.0, high=False)
        y = fade(y, 0.004, 0)
    return y


def upright1(note, dur=2.0, dyn="mf", release=0.2):
    return sampled("upright1", note, dur, prefer=f"_{dyn}_", release=release)


def pizz(note, dur=1.2):
    return sampled("pizz", note, dur, release=0.15)


def harp(note, dur=1.5):
    return sampled("harp", note, dur, release=0.2)


def marimba(note, dur=0.8):
    return sampled("marimba", note, dur, release=0.1)


def glock(note, dur=1.5):
    return sampled("glock", note, dur, release=0.3)


def xylo(note, dur=0.6):
    return sampled("xylo", note, dur, release=0.1)


def harmon(note, dur=0.5, loud=False, release=0.08):
    return sampled("harmon_f" if loud else "harmon", note, dur, release=release)


def tpt_stac(note, dur=0.5):
    return sampled("tpt_stac", note, dur, release=0.08)


def tbn_short(note, dur=0.6, loud=False):
    return sampled("tbn_short_f" if loud else "tbn_short", note, dur, release=0.08)


def flute_stac(note, dur=0.4):
    return sampled("flute_stac", note, dur, prefer="_v1_rr1", release=0.08)


def clar_stac(note, dur=0.4):
    return sampled("clar_stac", note, dur, release=0.06)


def timpani(note, dur=2.0, soft=False):
    return sampled("timpani_soft" if soft else "timpani", note, dur, release=0.3)


# GeneralUser GS (bank 0 program numbers)
GU = {"celesta": 8, "glock": 9, "musicbox": 10, "vibes": 11, "marimba": 12, "tubular": 14,
      "epiano": 4, "harp": 46, "muted_tpt": 59, "brass": 61, "jazzgtr": 26, "acbass": 32}


def gu(inst: str, notes, dur: float, vel: int = 90, length: float | None = None) -> np.ndarray:
    """notes: list of (t, note) or (t, note, vel) or (t, note, vel, len)."""
    ev = []
    for n in notes:
        t0, nt = n[0], n[1]
        v = n[2] if len(n) > 2 else vel
        ln = n[3] if len(n) > 3 else (length if length else dur - t0 - 0.05)
        m = midi(nt) if isinstance(nt, str) else int(nt)
        ev.append((t0, m, int(v), ln))
    return sf_notes(GU[inst], ev, dur)


def brush_kit(hits, dur):
    """GM brush kit (bank 128 preset 40). hits: [(t, gm_note, vel)] — 38 snare, 40 swirl, 42 hat."""
    return sf_notes(40, [(t, n, v, 0.2) for t, n, v in hits], dur, bank=128, drums=True)


# ---------------------------------------------------------------------------- 8-bit voice
def chip_note(note, dur: float, wave: str = "pulse", duty: float = 0.25, levels=None, vib: float = 0.0,
              vib_rate: float = 6.0, sweep: tuple | None = None, naive: bool = False, detune_c: float = 0.0):
    """One 8-bit note. levels: per-60Hz-frame volumes (0..1). sweep: (semitones, seconds) glide into note."""
    n = n_of(dur)
    f0 = hz(note) if not isinstance(note, float) else note
    f0 *= 2 ** (detune_c / 1200)
    fr = np.full(n, f0)
    if sweep:
        st, sd = sweep
        k = min(n, n_of(sd))
        fr[:k] = f0 * 2 ** (np.linspace(st, 0, k) / 12)
    if vib:
        t = np.arange(n) / SR
        fr = fr * 2 ** (vib / 1200 * np.sin(2 * math.pi * vib_rate * t) * np.clip(t / 0.15, 0, 1))
    fr = quantize_pitch_60hz(fr)
    alias_safe = f0 >= 500  # naive (aliasing) edges only in the low register, where they read as 'era' not grit
    if wave == "pulse":
        y = pulse(fr, n, duty, naive=naive and not alias_safe)
    elif wave == "tri":
        y = nes_triangle(fr, n)
    elif wave == "square1bit":
        y = pulse(fr, n, 0.5, naive=not alias_safe)
    else:
        raise ValueError(wave)
    if levels is None:
        frames = max(1, int(dur * 60))
        levels = np.linspace(1, 0.25, frames)
    e = chip_env(n, levels)
    y = y * e
    return fade(y, 0.001, 0.004)


def chip_levels(frames: int, start: float = 1.0, decay_per_frame: float = 1 / 15, floor: float = 0.0):
    return [max(floor, start - i * decay_per_frame) for i in range(frames)]


def chip_noise(dur: float, clock: float = 12000, short: bool = False, levels=None, seed=1):
    n = n_of(dur)
    y = lfsr_noise(n, clock, short, seed)
    if levels is None:
        levels = chip_levels(max(1, int(dur * 60)), 1.0, 1 / 8)
    return y * chip_env(n, levels) * 0.6


def chip_polish(x, lp=11000, bits=None):
    """Tasteful 8-bit: band-limit and a touch of DAC softness (no harsh aliasing)."""
    y = lowpass(x, lp, 2)
    y = highpass(y, 40, 1)
    return y
