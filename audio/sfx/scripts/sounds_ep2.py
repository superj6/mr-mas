"""Ep2 v1 (ep1.1_her.wav): the sounds and room beds the Ep2 lock names that the board did not have (the sound pass,
2026-10-10). manifest.md §7 (room tone) and §8 (SFX), show/episodes/ep02/production/v1/.

House rules kept (OST-BIBLE §0; LICENSES.md; LEARNINGS S1, S6, W24):
  * Everything pitched sits in F minor (F G Ab Bb C Db Eb). No A natural anywhere (the third is reserved for Ep12): car
    horns are open fifths or fourths, never a real horn's major third; the hum of a light is on F.
  * Generic UI only: no real app's, OS's or phone's sound; no meme sounds; nothing corny (the cow's moo is a low ghostly
    drone, not a cartoon; the laughs are a house's, not a sitcom's).
  * No voices: every crowd (laughs, cheers, the chant's room, applause, coughs) is synthesized from shaped noise and a
    glottal pulse through vowel formants. No recording of any person, no TTS, no cloning. (The ENGINEER's laugh is a take
    in his own library voice, made by the takes route, not here.)
  * Loops (loop=True) are sample-seamless: periodic noise, events wrapped round the seam, filters run circularly.
  * The score asked for (cue sheets' sfx_requests): hand_truck_step on C, paper_stack_fall's low end left to F,
    ceiling_knock off A, ui_drop_snap dry and off A, stream_end_tone on F or C, thunder_tuned_F on F, pin_grey_tick a step
    lower each (Ab5 G5 F5 Eb5 the score's notes, so the ticks sit a step under: G5 F5 Eb5 Db5... kept off A), string_taut
    untuned or Eb/Bb, blimp_inflate_step between the pad's moves (no pitch of its own), the screws dry.

Build: audio/.venv-theme/bin/python audio/sfx/scripts/build_ep2.py (writes audio/sfx/wav/<id>.wav, new files only, and
audio/sfx/manifest-ep2.json; never touches the Ep1 board's files or manifest.json).
"""
from __future__ import annotations

import math

import numpy as np

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant
import sounds_4 as S4

CAT = "ep2"
LOOP20 = 8 * 4 * BEAT          # 20.0 s = 8 bars at 96: the beds loop
EIGHTH = BEAT / 2

_bell, _mallet, _speaker, _friction = S4._bell, S4._mallet, S4._speaker, S4._friction
_env, _penv, _pplace, _pevents, _murmur, _hvac, _city = S4._env, S4._penv, S4._pplace, S4._pevents, S4._murmur, S4._hvac, S4._city


# ============================================================================ helpers
def _n(x):
    return x / (np.abs(x).max() + 1e-12)


def _tone(f, dur, partials=((1, 1.0),), att=0.004, tau=0.25, seed=0):
    n = n_of(dur)
    t = np.arange(n) / SR
    r = rng(seed)
    y = sum(a * np.sin(2 * math.pi * f * k * t + r.uniform(0, 6.28)) for k, a in partials)
    return y * np.minimum(1, t / att) * np.exp(-t / tau)


def _chip(note, dur, duty=0.25, lv=None, vib=0.0):
    return I.chip_note(note, dur, "pulse", duty, levels=lv or I.chip_levels(max(2, int(dur * 60)), 0.8, 0.09), vib=vib)


def _glide(f0, f1, dur, att=0.004, tau=None, wave="sine"):
    n = n_of(dur)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    y = sine(f, n=n) if wave == "sine" else triangle(f, n)
    e = np.minimum(1, t / att) * (np.exp(-t / tau) if tau else _env(n, [(0, 1), (dur * 0.7, 0.8), (dur, 0)]))
    return y * e


def _tap(f0, seed, body=PLASTIC, t60=0.03, bright=9000, dur=0.12):
    return modal_hit(f0, body, t60, dur=dur, bright=bright, seed=seed)


def _thud(f0, f1, dur=0.3, drop=0.02, tau=0.06):
    return thump(f0, f1, dur, drop, tau)


def _rattle(dur, seed, lo=1800, hi=6500, rate=60, body=STEEL, decay=None):
    """a loose object rattling: many tiny metal/glass taps, thinning out"""
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    t = 0.0
    k = 0
    while t < dur - 0.03:
        a = math.exp(-t / decay) if decay else 1.0
        h = modal_hit(r.uniform(lo, hi), body, r.uniform(0.01, 0.05), dur=0.08, bright=12000, seed=seed + k) * a * r.uniform(0.3, 1.0)
        place(out, pan(h, r.uniform(-0.4, 0.4)), t)
        t += r.exponential(1 / rate)
        k += 1
    return out


def _paper(dur, seed, lo=1500, hi=8000, rate=40, smooth=0.5):
    """paper movement: crinkle grains over a soft swish"""
    n = n_of(dur)
    sw = bandpass(noise(n, "pink", seed), 700, 6000, 2) * smooth * 0.4
    cr = crackle(dur, rate * 10, lo, hi, seed=seed + 1) * 0.6
    return sw + cr


def _air(dur, lo, hi, seed, shape=((0, 0), (0.3, 1), (1, 0))):
    n = n_of(dur)
    x = bandpass(noise(n, "pink", seed), lo, hi, 2)
    return x * _env(n, [(p[0] * dur, p[1]) for p in shape])


def _small_speaker(x, lo=500, hi=4500):
    return _speaker(x, lo, hi, 1.3)


def _tvize(x):
    """a TV across a room (its own small speaker), for sounds that live on a screen"""
    y = bandpass(mono(stereo(x)), 220, 6000, 2)
    y = biquad_peak(y, 2500, 2.0, 0.9)
    return reverb(y, "room", 0.12)


def _vowel_src(f0, n, seed, breath=0.12, jitter=0.012):
    r = rng(seed)
    if np.isscalar(f0):
        f0 = np.full(n, float(f0))
    jit = 1 + jitter * lowpass(r.standard_normal(n), 25, 1) * 4
    src = saw(f0 * jit, n) * 0.6 + noise(n, "white", seed + 3) * breath
    return lowpass(src, 5500, 1)


FORM = {  # vowel formants (Hz, Q, gain): an adult 'ah', 'eh', 'oo'; *1.15 for a higher voice
    "a": ((760, 6, 1.0), (1250, 8, 0.6), (2650, 10, 0.25)),
    "e": ((520, 6, 1.0), (1850, 9, 0.55), (2600, 10, 0.3)),
    "o": ((430, 6, 1.0), (850, 7, 0.5), (2500, 10, 0.12)),
}


def _formant(src, vowel, scale=1.0):
    return sum(resonator(src, f * scale, q) * g for f, q, g in FORM[vowel])


def _laugh_voice(dur, f0, seed, hi=False, rate=5.0, vowel="a"):
    """one person laughing (no words, nobody's laugh): breathy 'ha' syllables, falling in pitch and force"""
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros(n)
    t = r.uniform(0, 0.05)
    k = 0
    sc = 1.15 if hi else 1.0
    while t < dur - 0.12:
        u = t / dur
        fs = f0 * (1.25 - 0.4 * u) * r.uniform(0.96, 1.04)
        sl = r.uniform(0.07, 0.11)
        m = n_of(sl + 0.04)
        src = _vowel_src(fs, m, seed + k * 7, 0.18)
        v = _formant(src, vowel, sc * r.uniform(0.95, 1.05))
        tt = np.arange(m) / SR
        e = np.minimum(1, tt / 0.012) * np.exp(-tt / (sl * 0.55))
        h = bandpass(noise(n_of(0.035), "white", seed + k), 900, 4000, 2) * np.hanning(n_of(0.035)) * 0.5
        s = n_of(t)
        a = (1 - 0.6 * u) * r.uniform(0.7, 1.0)
        e2 = min(n, s + len(h))
        out[s:e2] += h[:e2 - s] * a * 0.3
        s2 = s + n_of(0.02)
        e3 = min(n, s2 + m)
        if s2 < n:
            out[s2:e3] += (v * e)[:e3 - s2] * a
        t += 1 / (rate * r.uniform(0.85, 1.2) * (1 - 0.25 * u))
        k += 1
    return out


def _crowd_laugh(dur, people, seed, swell=0.25, tail=0.6, dist_lp=6500, room="hall", wet=0.22):
    """a house laughing: `people` voices, most starting together, a few late, the tail thinning"""
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    for p in range(people):
        hi = r.random() < 0.5
        f0 = r.uniform(190, 290) if hi else r.uniform(100, 160)
        start = r.gamma(1.5, swell / 3)
        ln = min(dur - start, r.uniform(0.5, 1.0) * (dur - start) * (1 - tail * r.random() * 0.6))
        if ln < 0.3:
            continue
        v = _laugh_voice(ln, f0, seed * 13 + p, hi, r.uniform(4.2, 6.0), "a" if r.random() < 0.7 else "e")
        v = v * r.uniform(0.35, 1.0)
        place(out, pan(v, r.uniform(-0.9, 0.9)), start)
    out = lowpass(out, dist_lp, 2)
    out = _n(out) * 0.8
    e = _env(n, [(0, 1), (dur * 0.55, 0.85), (dur, 0)])
    return reverb(out * e[:, None], room, wet)


def _clap(seed, f=None):
    r = rng(seed)
    f = f or r.uniform(900, 2300)
    b = noise_burst(0.03, 500, 7000, r.uniform(0.006, 0.012), seed=seed)
    return resonator(b, f, 2.0) * 0.7 + b * 0.5


def _applause(dur, clappers, seed, env=None, rate=(3.6, 5.5), dist_lp=8000):
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    for c in range(clappers):
        f = r.uniform(900, 2300)
        rt = r.uniform(*rate)
        t = r.uniform(0, 0.4)
        stop = dur * r.uniform(0.55, 1.0)
        p = r.uniform(-0.9, 0.9)
        g = r.uniform(0.3, 1.0)
        k = 0
        while t < stop:
            place(out, pan(_clap(seed * 31 + c * 101 + k % 7, f) * g, p), t)
            t += 1 / rt * r.uniform(0.9, 1.1)
            k += 1
    out = lowpass(out, dist_lp, 2)
    if env:
        out *= _env(n, env)[:, None]
    return _n(out) * 0.8


def _cheer_voice(dur, f0, seed, hi=False):
    """one 'yeah!' / 'woo!' with no word in it: a held vowel, its pitch rising then falling"""
    r = rng(seed)
    n = n_of(dur)
    t = np.arange(n) / SR
    fc = f0 * np.interp(t, [0, dur * 0.25, dur * 0.7, dur], [0.9, 1.35, 1.25, 0.85]) * (1 + 0.012 * np.sin(2 * math.pi * 5.5 * t))
    src = _vowel_src(fc, n, seed, 0.25)
    vow = r.choice(["e", "o", "a"])
    v = _formant(src, vow, (1.15 if hi else 1.0) * r.uniform(0.95, 1.05))
    return v * _env(n, [(0, 0), (0.06, 1), (dur * 0.6, 0.8), (dur, 0)])


def _cough(seed):
    r = rng(seed)
    a = bandpass(noise(n_of(0.12), "white", seed), 300, 2500, 2) * _env(n_of(0.12), [(0, 0), (0.01, 1), (0.12, 0)])
    a = resonator(a, r.uniform(500, 800), 3) * 0.8 + a * 0.4
    b = bandpass(noise(n_of(0.18), "white", seed + 1), 250, 1800, 2) * _env(n_of(0.18), [(0, 0), (0.02, 0.6), (0.18, 0)])
    return mix(a, (b * 0.6, 0.16))


def _drops(dur, rate, seed, lo=2500, hi=7500, t60=(0.004, 0.02), loop=False):
    """rain drops: many tiny decaying ticks (loop-safe when loop=True)"""
    n = n_of(dur)
    r = rng(seed)
    out = np.zeros((n, 2))
    cnt = int(rate * dur)
    for i in range(cnt):
        f = r.uniform(lo, hi)
        m = n_of(0.03)
        tt = np.arange(m) / SR
        d = np.sin(2 * math.pi * f * tt * (1 + 0.6 * tt / 0.03)) * np.exp(-tt / r.uniform(*t60)) * r.uniform(0.2, 1.0)
        s = r.integers(0, n)
        p = r.uniform(-1, 1)
        a = (p + 1) * math.pi / 4
        idx = (s + np.arange(m)) % n if loop else np.arange(s, min(n, s + m))
        out[idx, 0] += d[:len(idx)] * math.cos(a)
        out[idx, 1] += d[:len(idx)] * math.sin(a)
    return out


def _engine(n, f0, seed, loop=False, rough=0.3):
    """an idling or running engine: a low pulsed harmonic hum with roughness"""
    t = np.arange(n) / SR
    r = rng(seed)
    if loop:
        f0 = round(f0 * n / SR) / (n / SR)
    y = sum(a * np.sin(2 * math.pi * f0 * k * t + r.uniform(0, 6)) for k, a in ((1, 1.0), (2, 0.6), (3, 0.35), (4, 0.2), (6, 0.1)))
    if loop:
        rn = loop_noise(n, 40, 400, -4, seed=seed)
    else:
        rn = bandpass(noise(n, "brown", seed), 40, 400, 2)
    return y * 0.4 + rn * rough


# ============================================================================ cold open, sc 1
def _mammoth_step(seed, bezel=False):
    body = mix(thump(hz("F2") * 1.6, hz("F1"), 0.7, 0.03, 0.18) * 0.9,
               bandpass(noise(n_of(0.35), "brown", seed), 60, 500, 2) * _env(n_of(0.35), [(0, 0), (0.02, 1), (0.35, 0)]) * 0.6)
    fur = _air(0.25, 400, 2500, seed + 1, ((0, 0), (0.2, 1), (1, 0))) * 0.15
    tick = _chip("F6", 0.05, 0.125, [0.5, 0.25]) * 0.05
    parts = [body, (fur, 0.0), (tick, 0.01)]
    if bezel:
        crack = mix(click((2300, 3900, 6100), 0.02, 0.15, 0.5, seed=seed + 5) * 0.5,
                    _rattle(0.35, seed + 6, 2500, 7000, 45, PLASTIC, 0.1) * 0.25)
        parts.append((crack, 0.0))
    return reverb(mix(*parts), "room", 0.18)


@sfx("mammoth_step_pixel", "The pixel mammoth's footfall on the lobby carpet: soft and heavy, a padded low thump on F with fur brushing and a faint 1-bit tick (it's a drawing).",
     pitch="F1 / F2", use="Ep2 coldopen 1.03 (its two steps onto the carpet).", cat=CAT, mix_db=-16)
def mammoth_step_pixel():
    return _mammoth_step(2001)


@sfx("mammoth_step_bezel", "The mammoth's first step, through the screen: the same padded thump with the wall screen's plastic bezel cracking and a few bits ticking off it.",
     pitch="F1 / F2", use="Ep2 coldopen 1.02 (on 'sentence', the foot breaks the bezel); the stems swap it in for that beat's mammoth_step_pixel.",
     cat=CAT, mix_db=-14)
def mammoth_step_bezel():
    return _mammoth_step(2011, bezel=True)


@sfx("palette_drip", "The lobby chair melting like candle wax, in three palette steps: three soft wet drips falling F4, Eb4, Db4, each with a low whump.",
     pitch="F4 Eb4 Db4", use="Ep2 coldopen 1.04 (the chair sags and melts).", cat=CAT, mix_db=-18)
def palette_drip():
    parts = []
    for i, nt in enumerate(("F4", "Eb4", "Db4")):
        f = hz(nt)
        drip = _glide(f * 1.5, f, 0.18, 0.002, 0.06) * 0.35
        wh = thump(hz(nt) / 4 * 1.4, hz(nt) / 4, 0.4, 0.02, 0.1) * 0.4
        parts.append((mix(drip, wh), i * 0.45))
    return reverb(mix(*parts), "room", 0.15)


def _hand_truck_step(seed, dist):
    """THUD: a loaded hand truck taking a stone step, on C (the score's pedal), farther = lower-passed and smaller"""
    hit = mix(thump(hz("C2") * 1.8, hz("C2"), 0.6, 0.02, 0.14) * 0.9, thump(hz("C1") * 1.5, hz("C1"), 0.6, 0.03, 0.2) * 0.6,
              bandpass(noise(n_of(0.2), "brown", seed), 80, 900, 2) * _env(n_of(0.2), [(0, 0), (0.005, 1), (0.2, 0)]) * 0.5)
    clank = _rattle(0.3, seed + 3, 900, 3500, 40, STEEL, 0.08) * 0.25
    y = mix(hit, (clank, 0.01))
    if dist == "far":
        y = lowpass(y, 380, 2)
        return reverb(y, "hall", 0.15)
    if dist == "mid":
        y = lowpass(y, 1200, 2)
        return reverb(y, "hall", 0.18)
    return reverb(y, "room", 0.2)


@sfx("hand_truck_step", "THUD, outside: a hand truck loaded with a complaint takes a stone step beyond the lobby doors; tuned to C (the score's bass pedal), heard through walls.",
     pitch="C1 / C2", use="Ep2 coldopen 1.06 (THUD 1, outside).", cat=CAT, mix_db=-16)
def hand_truck_step():
    return _hand_truck_step(2020, "far")


@sfx("hand_truck_step_mid", "THUD 2, closer: the hand truck's step nearer the doors, on C, less muffled.",
     pitch="C1 / C2", use="Ep2 coldopen 1.07 (swapped in for the second hand_truck_step).", cat=CAT, mix_db=-14)
def hand_truck_step_mid():
    return _hand_truck_step(2023, "mid")


@sfx("hand_truck_step_near", "THUD 3: the hand truck takes the top step at the doors, full and close, on C, with the load's metal rattling.",
     pitch="C1 / C2", use="Ep2 coldopen 1.09 (swapped in for the third hand_truck_step).", cat=CAT, mix_db=-12)
def hand_truck_step_near():
    return _hand_truck_step(2026, "near")


@sfx("door_glass_rattle", "The lobby's glass doors rattling in their frames after a thud outside: glass and metal buzzing, settling.",
     use="Ep2 coldopen 1.06.", cat=CAT, mix_db=-20)
def door_glass_rattle():
    r = _rattle(0.7, 2030, 2200, 6500, 70, GLASS, 0.18)
    buzz = bandpass(noise(n_of(0.7), "white", 2031), 300, 1800, 2) * _penv(n_of(0.7), 30, 2032, 0, 2) * _env(n_of(0.7), [(0, 1), (0.7, 0)]) * 0.3
    return reverb(mix(r * 0.6, buzz), "room", 0.15)


@sfx("cup_jump", "A staffer's coffee cup jumping on a counter: a ceramic clack, a second smaller one, the coffee sloshing.",
     use="Ep2 coldopen 1.07 (THUD 2).", cat=CAT, mix_db=-20)
def cup_jump():
    a = _tap(1900, 2040, GLASS, 0.06, 11000, 0.2) * 0.5
    b = _tap(1950, 2041, GLASS, 0.04, 11000, 0.15) * 0.3
    slosh = bandpass(noise(n_of(0.3), "pink", 2042), 300, 2500, 2) * _penv(n_of(0.3), 18, 2043, 0, 1.5) * _env(n_of(0.3), [(0, 0), (0.04, 1), (0.3, 0)]) * 0.35
    return reverb(mix(a, (b, 0.11), (slosh, 0.03)), "room", 0.14)


@sfx("ladder_sway_creak", "An aluminium stepladder swaying: a metal flex creak and a rivet squeak (Bb4-C5, never on A).",
     use="Ep2 coldopen 1.07 (the ladder sways; DOT holds on).", cat=CAT, mix_db=-20)
def ladder_sway_creak():
    n = n_of(0.8)
    t = np.arange(n) / SR
    f = np.interp(t, [0, 0.4, 0.8], [hz("Bb4"), hz("C5"), hz("Bb4")])
    sq = sine(f, n=n) * _penv(n, 22, 2050, 0, 2.5) * 0.12
    flex = _friction(0.8, 400, 3000, 50, seed=2051) * 0.35
    return reverb(mix(sq + flex) * _env(n, [(0, 0), (0.05, 1), (0.6, 0.6), (0.8, 0)])[:, None], "room", 0.15)


@sfx("hand_truck_roll", "The hand truck rolling down the lobby's axis to his feet: two small wheels on stone, the tall load wobbling, slowing to a stop.",
     use="Ep2 coldopen 1.09.", cat=CAT, mix_db=-16)
def hand_truck_roll():
    dur = 2.2
    n = n_of(dur)
    t = np.arange(n) / SR
    speed = np.interp(t, [0, 0.3, 1.6, 2.1, dur], [0.3, 1.0, 0.8, 0.0, 0.0])
    rum = bandpass(noise(n, "brown", 2060), 60, 700, 2) * speed
    seams = np.zeros(n)
    k = 0
    tt = 0.15
    while tt < 2.0:
        i = n_of(tt)
        seams[i:i + 40] += 1.0 if i < n else 0.0
        tt += 0.32 / max(0.3, float(np.interp(tt, t, speed)))
        k += 1
    clk = lowpass(seams, 900, 2) * 2
    wob = _rattle(dur, 2061, 700, 2500, 8, PLASTIC) * speed[:, None] * 0.12
    stop = thump(160, hz("C2"), 0.25, 0.01, 0.05) * 0.3
    y = mix(stereo(rum * 0.8 + clk * 0.3) + wob, (stop, 2.05))
    return reverb(pan_curve(y, np.linspace(0.4, -0.1, len(y))) * 1.4, "room", 0.16)


@sfx("paper_stack_fall", "The complaint tipping off the hand truck onto the floor: the last THUD, a person-tall stack of paper landing flat, a slap and a papery settle; its low end left to the score's F.",
     use="Ep2 coldopen 1.11 (the knee's note 1 lands on it).", cat=CAT, mix_db=-12)
def paper_stack_fall():
    slap = mix(bandpass(noise(n_of(0.25), "white", 2070), 200, 6000, 2) * _env(n_of(0.25), [(0, 0), (0.003, 1), (0.25, 0)]),
               thump(320, 180, 0.3, 0.01, 0.05) * 0.6)
    tip = _air(0.25, 500, 3000, 2071, ((0, 0), (0.7, 1), (1, 0.2))) * 0.2
    settle = _paper(0.9, 2072, 1800, 8000, 18, 0.4) * _env(n_of(0.9), [(0, 1), (0.9, 0)]) * 0.25
    y = mix(tip, (slap, 0.22), (settle, 0.26))
    return reverb(highpass(y, 140, 2), "room", 0.2)


@sfx("plate_hang", "A metal number plate hung on a sign's hooks: two small clinks and a settle.",
     use="Ep2 coldopen 1.06 (100 goes up), 1.12 (the second sign).", cat=CAT, mix_db=-18)
def plate_hang():
    a = _tap(2600, 2080, STEEL, 0.12, 12000, 0.4) * 0.45
    b = _tap(3150, 2081, STEEL, 0.08, 12000, 0.3) * 0.3
    sw = _rattle(0.3, 2082, 2000, 5000, 25, STEEL, 0.1) * 0.15
    return reverb(mix(a, (b, 0.09), (sw, 0.12)), "room", 0.15)


# ============================================================================ act one, sc 4 (the séance)
@sfx("candle_crackle", "Candle wicks on a dark boardroom table: tiny crackles and the soft flutter of several flames (2.6 s).",
     use="Ep2 act1 4.01 (bed detail at the séance's head).", cat=CAT, mix_db=-24)
def candle_crackle():
    dur = 2.6
    n = n_of(dur)
    cr = crackle(dur, 22, 1500, 6500, seed=2100) * 0.5
    fl = bandpass(noise(n, "pink", 2101), 80, 700, 2) * _penv(n, 6, 2102, 0.3, 1.5) * 0.4
    return fade(reverb(mix(cr, fl), "room", 0.1)[:n], 0.3, 0.4)


@sfx("candle_flare", "Every candle on the table flaring one step at once: a soft breathy 'whff' of several flames.",
     use="Ep2 act1 4.02 (on the Publish click), 4.17 (Nole's phone on the table).", cat=CAT, mix_db=-18)
def candle_flare():
    w = whoosh(0.5, 200, 900, 0.9, 0.25, seed=2110) * 0.6
    cr = crackle(0.5, 40, 2000, 6000, seed=2111, decay=0.2) * 0.25
    return reverb(mix(w, cr), "room", 0.14)


def _planchette(dur, seed):
    n = n_of(dur)
    s = _friction(dur, 300, 2800, 70, 0.6, seed, "pink") * _env(n, [(0, 0), (0.06, 1), (dur - 0.12, 0.7), (dur, 0)])
    felt = bandpass(noise(n, "brown", seed + 1), 80, 600, 2) * _env(n, [(0, 0), (0.08, 1), (dur, 0)]) * 0.3
    return reverb(mix(s * 0.7 + felt), "room", 0.12)


@sfx("planchette_glide", "The brass-rimmed planchette gliding by itself across the board: wood on wood on felt feet, a slow slide that settles.",
     use="Ep2 act1 4.02, 4.03, 4.11, 4.19.", cat=CAT, mix_db=-18)
def planchette_glide():
    return _planchette(0.75, 2120)


@sfx("planchette_letter_tick", "The planchette stopping on a letter: a small dry wooden tick.",
     use="Ep2 act1 4.10 (O · P · E · N, one per letter).", cat=CAT, mix_db=-20)
def planchette_letter_tick():
    return reverb(mix(_tap(1350, 2130, WOOD, 0.03, 8000, 0.1) * 0.6, _friction(0.06, 800, 4000, 120, seed=2131) * 0.15), "booth", 0.1)


@sfx("inbox_chime_low", "A generic two-note inbox chime (C5 -> F5), pitched down two octaves: a slow, dark C3 -> F3 bell with the slowed-tape grain of the drop.",
     pitch="C3 -> F3", use="Ep2 act1 4.03 (the planchette slides to >>>).", cat=CAT, mix_db=-16)
def inbox_chime_low():
    a = _bell("C5", 0.9, 0.5, 2140) * 0.5
    b = _bell("F5", 1.0, 0.6, 2141) * 0.55
    hi = mix(a, (b, 0.12))
    lo = varispeed(mono(hi), 0.25)
    lo = lowpass(lo, 2500, 2)
    return reverb(stereo(lo) * 0.9, "hall", 0.25)


@sfx("ceiling_knock", "KNOCK from the ceiling: a knuckle on a ceiling panel above the boardroom, a hollow knock with the tiles rattling in their grid (tuned off A: Db).",
     pitch="Db3", use="Ep2 act1 4.06 (three knocks, each louder: the lock's gains).", cat=CAT, mix_db=-14)
def ceiling_knock():
    k = mix(_tap(hz("Db3"), 2150, WOOD, 0.08, 4000, 0.3) * 0.7, thump(hz("Db3") * 1.5, hz("Db2"), 0.3, 0.01, 0.05) * 0.5)
    rt = _rattle(0.3, 2151, 1200, 3500, 40, PLASTIC, 0.08) * 0.15
    return reverb(lowpass(mix(k, (rt, 0.01)), 3500, 2), "room", 0.2)


@sfx("cable_drop", "A steel cable paying out fast: a descending zip through a pulley as Nole drops through the hole.",
     use="Ep2 act1 4.07.", cat=CAT, mix_db=-16)
def cable_drop():
    dur = 0.7
    n = n_of(dur)
    t = np.arange(n) / SR
    f = np.interp(t, [0, dur], [1900, 700])
    whine = sine(f, n=n) * 0.08 * _env(n, [(0, 0), (0.05, 1), (0.6, 1), (0.7, 0)])
    zip_ = _friction(dur, 1500, 6000, 260, 0.4, 2160) * 0.5 * _env(n, [(0, 0), (0.04, 1), (0.6, 0.8), (0.7, 0)])
    clunk = _tap(900, 2161, STEEL, 0.06, 9000, 0.2) * 0.3
    return reverb(mix(whine + zip_, (clunk, 0.62)), "room", 0.14)


@sfx("cow_moo_reverb", "The chevron cow's moo, as a ghost: a low, short, breathy drone gliding F2 -> Db2 through an 'oo' formant, in a large dark reverb. No cartoon, no real cow.",
     pitch="F2 -> Db2", use="Ep2 act1 4.13.", cat=CAT, mix_db=-16)
def cow_moo_reverb():
    dur = 1.3
    n = n_of(dur)
    t = np.arange(n) / SR
    f0 = np.interp(t, [0, 0.25, dur], [hz("F2") * 0.97, hz("F2"), hz("Db2")])
    src = _vowel_src(f0, n, 2170, 0.2, 0.02)
    v = _formant(src, "o", 0.9) * _env(n, [(0, 0), (0.12, 1), (0.9, 0.8), (dur, 0)])
    v = lowpass(v, 1500, 2)
    return reverb(stereo(_n(v)) * 0.7, "cathedral", 0.45, 0.8)


@sfx("lamp_click", "A desk lamp's push switch: a firm plastic click and the bulb's faint hum on F coming up (or dropping out).",
     pitch="F (hum)", use="Ep2 act1 4.15 (Nole's post lamp), act4 20.02 and 20.04 (on and off).", cat=CAT, mix_db=-16)
def lamp_click():
    c = mix(click((2100, 3600, 5400), 0.012, 0.08, 0.4, seed=2180) * 0.6, _tap(700, 2181, PLASTIC, 0.03, 6000, 0.1) * 0.35)
    n = n_of(0.5)
    hum = (sine(hz("F2"), n=n) * 0.6 + sine(hz("F3"), n=n) * 0.3) * _env(n, [(0, 0), (0.05, 1), (0.5, 0)]) * 0.03
    return reverb(mix(c, (hum, 0.01)), "room", 0.12)


@sfx("go_stone_click", "A slate Go stone placed on a wooden board: one hard, bright, dry click with the board's short wooden ring.",
     use="Ep2 act1 4.19 (the Go figure starts the beat after it).", cat=CAT, mix_db=-12)
def go_stone_click():
    c = mix(click((3300, 5200, 7600), 0.008, 0.06, 0.25, seed=2190) * 0.7, _tap(hz("C5") * 0.98, 2191, WOOD, 0.05, 10000, 0.15) * 0.45)
    return reverb(c, "booth", 0.08)


@sfx("arena_blip_soft", "The arena match on the one monitor nobody paused: tiny 8-bit game blips through a monitor's small speaker, soft.",
     pitch="F5 C6 Eb5", use="Ep2 act1 4.31 (F2.3, under the hatch's draught).", cat=CAT, flavor="chip", mix_db=-22)
def arena_blip_soft():
    parts = [(_chip(nt, 0.07, 0.125, [0.6, 0.4, 0.2]) * 0.3, t0) for t0, nt in ((0.0, "F5"), (0.18, "C6"), (0.45, "Eb5"), (0.62, "F5"))]
    parts.append((lfsr_noise(n_of(0.08), 9000, True, 7) * _env(n_of(0.08), [(0, 0.4), (0.08, 0)]) * 0.1, 0.3))
    return reverb(stereo(_small_speaker(mono(mix(*parts)))), "room", 0.12)


@sfx("ladder_climb", "Nole climbing a metal ladder to the ceiling hatch: four shoe-on-rung steps, quick, a little rung ring.",
     use="Ep2 act1 4.30 (F2.3).", cat=CAT, mix_db=-16)
def ladder_climb():
    parts = []
    for i in range(4):
        st_ = mix(_tap(1150 + 70 * i, 2200 + i, STEEL, 0.06, 7000, 0.2) * 0.4, thump(220, 140, 0.15, 0.005, 0.03) * 0.5)
        parts.append((pan(st_, 0.2 - 0.1 * i), i * 0.32))
    return reverb(mix(*parts), "room", 0.16)


@sfx("hatch_slide_shut", "A ceiling hatch sliding shut over the climber: a wooden panel on runners, then a firm thunk into its frame.",
     use="Ep2 act1 4.30 (F2.3).", cat=CAT, mix_db=-14)
def hatch_slide_shut():
    sl = _friction(0.45, 300, 2500, 90, 0.5, 2210, "pink") * _env(n_of(0.45), [(0, 0), (0.05, 1), (0.45, 0.5)]) * 0.5
    th = mix(thump(240, hz("Db2"), 0.35, 0.008, 0.05) * 0.7, _tap(520, 2211, WOOD, 0.06, 5000, 0.2) * 0.4)
    return reverb(mix(sl, (th, 0.44)), "room", 0.2)


@sfx("match_strike", "A match struck and catching: a scratch, the head's flare, a tiny crackle.",
     use="Ep2 act1 4.33 (Nole relights the candle).", cat=CAT, mix_db=-16)
def match_strike():
    sc = _friction(0.1, 2000, 8000, 300, 0.4, 2220) * 0.6
    fl = whoosh(0.35, 400, 2500, 1.0, 0.15, seed=2221) * 0.6
    cr = crackle(0.4, 50, 2500, 7000, seed=2222, decay=0.2) * 0.2
    return reverb(mix(sc, (fl, 0.08), (cr, 0.1)), "booth", 0.1)


@sfx("candle_snuff", "The candle nearest Nole going out by itself: a soft 'fft', the wick's tiny hiss, a thread of smoke.",
     use="Ep2 act1 4.27.", cat=CAT, mix_db=-18)
def candle_snuff():
    p = _air(0.25, 300, 2000, 2230, ((0, 0), (0.1, 1), (1, 0))) * 0.6
    hs = bandpass(noise(n_of(0.6), "white", 2231), 3000, 8000, 2) * _env(n_of(0.6), [(0, 0), (0.05, 0.4), (0.6, 0)]) * 0.12
    return reverb(mix(p, (hs, 0.1)), "room", 0.12)


@sfx("candle_blow", "Mas blowing out the last candle: one soft breath across a flame and the flame's gutter; the last chord rings free from it.",
     use="Ep2 act1 4.36.", cat=CAT, mix_db=-16)
def candle_blow():
    b = _air(0.55, 250, 3500, 2240, ((0, 0), (0.15, 1), (0.6, 0.5), (1, 0))) * 0.7
    gut = bandpass(noise(n_of(0.3), "pink", 2241), 80, 500, 2) * _penv(n_of(0.3), 25, 2242, 0, 1.5) * 0.3
    return reverb(mix(b, (gut, 0.15)), "room", 0.12)


@sfx("glass_sip", "A crystal glass lifted, a small sip, set back: a light rim 'tink' and the water moving. No mouth noise to speak of.",
     use="Ep2 act1 4.30 (F2.3's sip), 4.34 (the same sip, six years on).", cat=CAT, mix_db=-20)
def glass_sip():
    t1 = _tap(hz("F6"), 2250, GLASS, 0.25, 12000, 0.6) * 0.25
    liq = bandpass(noise(n_of(0.35), "pink", 2251), 400, 2500, 2) * _penv(n_of(0.35), 14, 2252, 0, 2) * _env(n_of(0.35), [(0, 0), (0.1, 1), (0.35, 0)]) * 0.3
    return reverb(mix(t1, (liq, 0.12)), "room", 0.14)


# ============================================================================ act one, 4A, 4B, 6, 7
@sfx("nameplate_click", "A boardroom nameplate pushed into its slot on the table: a short slide and a crisp plastic-and-metal click.",
     use="Ep2 act1 4A.04 (his, then the three new directors', one by one).", cat=CAT, mix_db=-16)
def nameplate_click():
    sl = _friction(0.08, 1200, 5000, 150, 0.5, 2300) * 0.3
    c = mix(click((2600, 4300, 6400), 0.01, 0.07, 0.35, seed=2301) * 0.6, _tap(1700, 2302, STEEL, 0.04, 9000, 0.12) * 0.3)
    return reverb(mix(sl, (c, 0.07)), "room", 0.12)


@sfx("mic_grow_step", "XEL's microphone hopping one size: a soft tuned thunk on F with a 1-bit rising blip, like a pixel scaling up.",
     pitch="F2 / F5", use="Ep2 act1 6.02, 6.04, 6.06, 6.08 (one size per hop; the lock's gains grow).", cat=CAT, mix_db=-16)
def mic_grow_step():
    th = thump(hz("F3"), hz("F2"), 0.35, 0.02, 0.08) * 0.6
    bl = mix(_chip("F5", 0.04, 0.25, [0.6, 0.3]) * 0.12, (_chip("C6", 0.05, 0.25, [0.5, 0.25]) * 0.1, 0.035))
    pad = bandpass(noise(n_of(0.12), "pink", 2310), 150, 900, 2) * _env(n_of(0.12), [(0, 0), (0.01, 1), (0.12, 0)]) * 0.15
    return reverb(mix(th, bl, pad), "booth", 0.1)


@sfx("chapter_tick", "The podcast player's chapter counter ticking to its next number: a small soft UI tick with a tiny C6 glint.",
     pitch="C6", use="Ep2 act1 6.02 -> 6.09 (CH. 2 to CH. 6 OF 6).", cat=CAT, mix_db=-20)
def chapter_tick():
    c = click((3000, 4800), 0.006, 0.05, 0.3, seed=2320) * 0.4
    g = _bell("C6", 0.25, 0.12, 2321) * 0.12
    return reverb(mix(c, (g, 0.004)), "booth", 0.08)


@sfx("chair_creak", "A padded studio chair taking someone's weight shift: a short leather-and-spring creak.",
     use="Ep2 act1 6.08 (Mas leans around the mic), act4 20.12 (he stands).", cat=CAT, mix_db=-18)
def chair_creak():
    n = n_of(0.45)
    t = np.arange(n) / SR
    sq = sine(np.interp(t, [0, 0.45], [hz("Eb4"), hz("Db4")]), n=n) * _penv(n, 35, 2330, 0, 2.5) * 0.06
    lt = _friction(0.45, 300, 2500, 60, 0.6, 2331, "pink") * 0.35
    spr = _tap(380, 2332, STEEL, 0.12, 3000, 0.3) * 0.08
    return reverb(mix(sq + lt, (spr, 0.05)) * _env(len(mix(sq + lt, (spr, 0.05))), [(0, 0), (0.03, 1), (0.45, 0)])[:, None], "booth", 0.12)


@sfx("rec_light_off", "The studio's REC light going out: a small relay click and a faint lamp buzz on F stopping.",
     use="Ep2 act1 6.09.", cat=CAT, mix_db=-20)
def rec_light_off():
    n = n_of(0.3)
    buzz = (sine(hz("F3"), n=n) + 0.4 * sine(hz("F4"), n=n)) * 0.03 * _env(n, [(0, 1), (0.25, 1), (0.3, 0)])
    c = click((2200, 3700), 0.008, 0.05, 0.4, seed=2340) * 0.5
    return reverb(mix(buzz, (c, 0.28)), "booth", 0.08)


@sfx("curtain_draw", "A heavy stage curtain parting: velvet sweeping along a rail, the rings rattling, quick and full (1.1 s).",
     use="Ep2 act1 6.11 (the curtain parts and the building splits open).", cat=CAT, mix_db=-14)
def curtain_draw():
    dur = 1.1
    n = n_of(dur)
    sw = bandpass(noise(n, "pink", 2350), 200, 4500, 2) * _env(n, [(0, 0), (0.15, 1), (0.8, 0.8), (dur, 0)]) * 0.6
    rings = _rattle(dur, 2351, 2500, 6000, 35, STEEL, 0.5) * 0.18
    y = mix(stereo(sw) + rings)
    return reverb(pan_curve(y, np.linspace(-0.3, 0.3, len(y))) * 1.4, "room", 0.2)


@sfx("dollhouse_slide", "The cathedral splitting open like a dollhouse: two halves of a building sliding apart in whole-pixel steps, a low stone grind in held steps (2.4 s).",
     use="Ep2 act1 7.01 (from the shot's first frame).", cat=CAT, mix_db=-14)
def dollhouse_slide():
    dur = 2.4
    n = n_of(dur)
    t = np.arange(n) / SR
    step = (np.floor(t * 12) % 2 == 0).astype(float)          # whole-pixel steps: moving on 2s
    step = lowpass(step, 60, 1)
    gr = bandpass(noise(n, "brown", 2360), 50, 900, 2) * (0.35 + 0.65 * step)
    grit = _friction(dur, 900, 4000, 40, 0.6, 2361) * 0.15
    ticks = mix(*[(_chip("F3", 0.03, 0.5, [0.4, 0.2]) * 0.04, i / 6) for i in range(int(dur * 6))], n=n)
    y = mix(stereo(gr * 0.8 + grit) + ticks)
    y *= _env(n, [(0, 0), (0.1, 1), (2.0, 0.9), (dur, 0)])[:, None]
    return reverb(y, "hall", 0.2)


@sfx("light_bank_click", "A floor's bank of lights clicking on: a big breaker clunk and the tubes' tick and hum starting on F.",
     pitch="F (hum)", use="Ep2 act1 7.01 (floor by floor, four of them).", cat=CAT, mix_db=-18)
def light_bank_click():
    cl = mix(_tap(600, 2370, STEEL, 0.06, 6000, 0.2) * 0.5, thump(200, hz("F2"), 0.2, 0.006, 0.03) * 0.4)
    ticks = mix(*[(click((3500, 6000), 0.003, 0.02, 0.5, seed=2371 + i) * 0.12, 0.05 + 0.04 * i) for i in range(3)])
    n = n_of(0.6)
    hum = (sine(hz("F2"), n=n) + 0.5 * sine(hz("F3"), n=n) + 0.2 * sine(hz("C4"), n=n)) * _env(n, [(0, 0), (0.1, 1), (0.6, 0)]) * 0.03
    return reverb(mix(cl, ticks, (hum, 0.05)), "hall", 0.15)


@sfx("box_set", "A cardboard box of papers set down on a basement floor: a soft heavy thud and the cardboard flexing.",
     use="Ep2 act1 7.02 (THE HUMANIST's boxes).", cat=CAT, mix_db=-16)
def box_set():
    th = mix(thump(170, 95, 0.3, 0.01, 0.05) * 0.7, bandpass(noise(n_of(0.15), "pink", 2380), 200, 2500, 2) * _env(n_of(0.15), [(0, 0), (0.004, 1), (0.15, 0)]) * 0.5)
    flex = _friction(0.2, 500, 3000, 50, 0.6, 2381) * 0.15
    return reverb(mix(th, (flex, 0.04)), "room", 0.16)


# ============================================================================ act two, sc 8-12
@sfx("ui_swipe", "A notification swiped away unopened: a soft airy swipe to one side and a tiny settle tick.",
     use="Ep2 act2 8.01.", cat=CAT, mix_db=-20)
def ui_swipe():
    w = whoosh(0.22, 2500, 900, 1.2, 0.35, seed=2400) * 0.5
    w = pan_curve(w, np.linspace(-0.2, 0.7, len(w)))
    tk = click((3300, 5000), 0.004, 0.03, 0.3, seed=2401) * 0.12
    return mix(w, (tk, 0.2))


@sfx("ui_drop_snap", "A calendar block dragged onto MON 13 and snapping in: a crisp magnetic snap (3-6 kHz) with one dry tuned tick on G5 (off A, and off the score's C4 downbeat it lands on).",
     pitch="G5", use="Ep2 act2 8.04 (lands on the Water Line's settle downbeat).", cat=CAT, mix_db=-16)
def ui_drop_snap():
    sn = mix(click((3400, 4900, 6600), 0.006, 0.05, 0.45, seed=2410) * 0.6, thump(500, 300, 0.08, 0.004, 0.015) * 0.2)
    tk = _tone(hz("G5"), 0.16, ((1, 1.0), (2, 0.25)), 0.002, 0.045, 2411) * 0.18
    return mix(sn, (tk, 0.004))


@sfx("invite_drop", "An invite dropping into his calendar under the Monday square: a soft card drop and a small F5 glint.",
     pitch="F5", use="Ep2 act2 8.07.", cat=CAT, mix_db=-18)
def invite_drop():
    d = mix(_air(0.15, 800, 3500, 2420, ((0, 0), (0.7, 1), (1, 0))) * 0.25, (thump(600, 350, 0.08, 0.004, 0.015) * 0.3, 0.13))
    g = _bell("F5", 0.4, 0.2, 2421) * 0.14
    return reverb(mix(d, (g, 0.14)), "room", 0.08)


@sfx("ui_chirp_bright", "A bright UI chirp for 'yes!!': two quick rising chip notes C6 -> F6 over a soft pop.",
     pitch="C6 -> F6", use="Ep2 act2 9.02 (the monitor answers before he's asked).", cat=CAT, flavor="chip", mix_db=-16)
def ui_chirp_bright():
    a = _chip("C6", 0.05, 0.25, [0.8, 0.6, 0.3]) * 0.3
    b = _chip("F6", 0.09, 0.25, I.chip_levels(6, 0.8, 0.12)) * 0.3
    p = thump(900, 500, 0.06, 0.003, 0.012) * 0.25
    return reverb(mix(p, (a, 0.005), (b, 0.06)), "room", 0.08)


def _steps_down(notes, step, seed, level=0.2):
    """a fall in whole F-minor steps (a chip's 'glide': never sliding through A)"""
    return mix(*[(_chip(nt, step * 1.1, 0.25, [0.6, 0.45, 0.3]) * level * (1 - 0.08 * i), i * step) for i, nt in enumerate(notes)])


@sfx("tag_drop", "The transcript's [laughter] tag dropping off the bottom of the screen: a tiny chip fall in steps F5 Eb5 C5 and a soft tick where it lands.",
     pitch="F5 Eb5 C5", use="Ep2 act2 9.03.", cat=CAT, flavor="chip", mix_db=-20)
def tag_drop():
    g = _steps_down(("F5", "Eb5", "C5"), 0.07, 2430)
    tk = click((2500, 4000), 0.004, 0.03, 0.3, seed=2431) * 0.15
    return reverb(mix(g, (tk, 0.21)), "room", 0.08)


@sfx("panel_unfold_step", "The VOICE panel unfolding past the monitor's bezel, square by square: three small card-unfold clicks, quick.",
     use="Ep2 act2 9.06.", cat=CAT, mix_db=-18)
def panel_unfold_step():
    parts = [(mix(_air(0.08, 900, 4000, 2440 + i, ((0, 0), (0.5, 1), (1, 0))) * 0.2,
                  (click((2400 + 300 * i, 4000), 0.006, 0.04, 0.3, seed=2445 + i) * 0.3, 0.06)), i * 0.13) for i in range(3)]
    return reverb(mix(*parts), "room", 0.08)


@sfx("tiny_laugh_back", "The blueprint's drawn mouth laughing back: three tiny bouncing chip notes F5 Ab5 F5, quiet and dry (a drawing's laugh, not a voice).",
     pitch="F5 Ab5 F5", use="Ep2 act2 10.03 (on 'laugh back').", cat=CAT, flavor="chip", mix_db=-20)
def tiny_laugh_back():
    parts = [(_chip(nt, 0.06, 0.125, [0.6, 0.4, 0.2]) * 0.25, t0) for t0, nt in ((0.0, "F5"), (0.1, "Ab5"), (0.2, "F5"))]
    return mix(*parts)


@sfx("tiny_crowd_patter", "A tiny drawn crowd flooding into the blueprint: a pitter-patter of many tiny feet on paper (1.4 s).",
     use="Ep2 act2 10.05 (step 3 lands on 'free').", cat=CAT, mix_db=-20)
def tiny_crowd_patter():
    dur = 1.4
    r = rng(2450)
    n = n_of(dur)
    out = np.zeros((n, 2))
    for i in range(70):
        t0 = r.uniform(0, dur - 0.05) * (0.3 + 0.7 * r.random())
        tk = _tap(r.uniform(1800, 3200), 2451 + i, WOOD, 0.01, 9000, 0.03) * r.uniform(0.2, 0.6)
        place(out, pan(tk, r.uniform(-0.8, 0.8)), t0)
    out *= _env(n, [(0, 0.3), (0.3, 1), (1.0, 0.8), (dur, 0)])[:, None]
    return reverb(out, "room", 0.1)


@sfx("crowd_laugh_s", "A demo house laughing a little: about twenty people, a short warm laugh that dies fast (2.0 s). No words, no voice of anyone.",
     use="Ep2 act2 11.08 (the last laugh).", cat=CAT, mix_db=-16)
def crowd_laugh_s():
    return _crowd_laugh(2.0, 22, 2460, 0.2, 0.7)


@sfx("crowd_laugh_m", "A demo house laughing: about forty people, a real laugh that rolls and settles (2.8 s).",
     use="Ep2 act2 11.04, 11.07.", cat=CAT, mix_db=-14)
def crowd_laugh_m():
    return _crowd_laugh(2.8, 40, 2470, 0.25, 0.5)


@sfx("crowd_laugh_l", "A demo house's big laugh: about seventy people, a full laugh with a second wave and a few claps (3.2 s).",
     use="Ep2 act2 11.05 (the harmonising).", cat=CAT, mix_db=-12)
def crowd_laugh_l():
    a = _crowd_laugh(3.2, 70, 2480, 0.3, 0.35)
    cl = _applause(1.6, 10, 2481, [(0, 0), (0.2, 1), (1.6, 0)], (4.0, 5.5), 6500) * 0.18
    return mix(a, (reverb(cl, "hall", 0.2), 0.5))


@sfx("clicker_click", "A presentation clicker's button under Rima's thumb: one small, firm plastic click.",
     use="Ep2 act2 11.06 (the next slide, exactly on the running order).", cat=CAT, mix_db=-20)
def clicker_click():
    return reverb(mix(click((2800, 4600, 6900), 0.006, 0.05, 0.3, seed=2490) * 0.5, _tap(1100, 2491, PLASTIC, 0.02, 7000, 0.06) * 0.3), "room", 0.1)


@sfx("stream_end_tone", "The livestream ending: LIVE -> ENDED, a soft two-note fall C5 -> F4 on a sine bell, no sting.",
     pitch="C5 -> F4", use="Ep2 act2 11.10 (the pad's Fm11 has landed under it).", cat=CAT, mix_db=-18)
def stream_end_tone():
    a = _bell("C5", 0.6, 0.35, 2500) * 0.4
    b = _bell("F4", 1.0, 0.6, 2501) * 0.45
    return reverb(mix(a, (b, 0.16)), "hall", 0.18)


@sfx("house_lights_up", "The house lights coming up a step: a big contactor clunk somewhere above the house and the lamps' hum swelling on F (1.6 s).",
     pitch="F (hum)", use="Ep2 act2 11.10 (a step), 12.01 (full).", cat=CAT, mix_db=-16)
def house_lights_up():
    cl = mix(_tap(420, 2510, STEEL, 0.1, 5000, 0.3) * 0.5, thump(160, hz("F2"), 0.3, 0.008, 0.05) * 0.4)
    n = n_of(1.6)
    hum = sum(a * sine(hz(nt), n=n) for nt, a in (("F2", 1.0), ("F3", 0.5), ("C4", 0.25), ("F4", 0.12)))
    hum = hum * _env(n, [(0, 0), (0.5, 1), (1.2, 0.8), (1.6, 0)]) * 0.04
    return reverb(mix(cl, (hum, 0.03)), "hall", 0.22)


def _phone_wave(dur, count, seed, lp=4000):
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    for i in range(count):
        t0 = (i / count) * dur * 0.6 + r.uniform(0, 0.15)
        b = mono(S4._phone_buzz(r.uniform(0.25, 0.45), hz("Db3") * r.uniform(0.98, 1.03), seed + i, "table"))
        p = -0.9 + 1.8 * i / max(1, count - 1)
        place(out, pan(b * r.uniform(0.3, 0.8), p), t0)
    return reverb(lowpass(out, lp, 2), "hall", 0.18)


@sfx("phone_wave_buzz", "Phones buzzing across a house (or a lawn): a wave of vibrate motors going off one after another, left to right (1.6 s).",
     use="Ep2 act2 11.13 (the press row), act4 19.08 (across the lawn).", cat=CAT, mix_db=-16)
def phone_wave_buzz():
    return _phone_wave(1.6, 14, 2520)


@sfx("blimp_inflate_step", "The 'her' blimp swelling one size: a rubbery stretch and a soft push of air (no pitch of its own: the pad moves between them).",
     use="Ep2 act2 11.13 (four held sizes).", cat=CAT, mix_db=-16)
def blimp_inflate_step():
    air = _air(0.6, 200, 1800, 2530, ((0, 0), (0.4, 1), (1, 0))) * 0.5
    n = n_of(0.35)
    t = np.arange(n) / SR
    rub = _friction(0.35, 500, 2500, 80, 0.6, 2531, "pink") * _env(n, [(0, 0), (0.1, 1), (0.35, 0)]) * 0.35
    wob = thump(140, 90, 0.3, 0.03, 0.08) * 0.25
    return reverb(mix(air, (rub, 0.2), (wob, 0.35)), "hall", 0.15)


@sfx("headset_unclip", "A headset mic unclipped from a collar: a small plastic clip snap and a cable brushing fabric.",
     use="Ep2 act2 11.15 (the engineer, off mic).", cat=CAT, mix_db=-18)
def headset_unclip():
    c = click((2700, 4400), 0.006, 0.04, 0.4, seed=2540) * 0.4
    cb = _friction(0.3, 900, 4500, 60, 0.6, 2541) * 0.2
    return reverb(mix(c, (cb, 0.05)), "room", 0.1)


@sfx("ui_minimise", "A window minimised: a soft downward swish into the dock and a tiny tick.",
     use="Ep2 act2 12.05 (he minimises the news).", cat=CAT, mix_db=-20)
def ui_minimise():
    w = whoosh(0.2, 2200, 700, 1.1, 0.4, seed=2550) * 0.4
    tk = click((2800, 4400), 0.004, 0.03, 0.3, seed=2551) * 0.12
    return mix(w, (tk, 0.19))


@sfx("thumb_scroll", "A thumb scrolling once on a phone: skin on glass, a soft swipe with two faint haptic ticks.",
     use="Ep2 act2 12.06, act3 15.02.", cat=CAT, mix_db=-20)
def thumb_scroll():
    sw = _air(0.22, 1500, 6000, 2560, ((0, 0), (0.3, 1), (1, 0))) * 0.3
    tk = mix(*[(click((180, 360), 0.01, 0.03, 0.1, seed=2561 + i) * 0.15, 0.05 + 0.08 * i) for i in range(2)])
    return mix(sw, tk)


def _phone_key(seed):
    """a thumb on a phone's glass: a crisp fingernail-and-glass tick (3-6 kHz, where a cue rarely sits), the glass's
    small body and the haptic motor's tiny thud"""
    r = rng(seed)
    tick = click((r.uniform(3300, 3900), r.uniform(4800, 5600), 6900), 0.004, 0.03, 0.35, seed=seed + 7) * 0.45
    tap = mix(_tap(r.uniform(900, 1200), seed, GLASS, 0.008, 6000, 0.05) * 0.3, thump(260, 170, 0.04, 0.003, 0.008) * 0.2)
    hap = sine(r.uniform(160, 200), n=n_of(0.025)) * _env(n_of(0.025), [(0, 0), (0.003, 1), (0.025, 0)]) * 0.1
    return mix(tick, tap, hap)


for _i in range(6):
    variant(f"phone_key_tap_{_i + 1}", (lambda i=_i: _phone_key(2570 + 3 * i)),
            desc=f"A thumb typing one key on a phone's glass keyboard (RR {_i + 1}/6): a soft fingertip tap and a faint haptic tick. "
                 "The stems use it for the lock's keyboard taps where the picture types on a phone.",
            use="Ep2: every typing beat is on a phone (4.15, 11.11, 12.07, 15.05, 17.10, 19.07).", cat=CAT, mix_db=-22)


def _phone_type(dur, rate, seed, pause=True):
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    t = 0.0
    k = 0
    while t < dur - 0.06:
        place(out, _phone_key(seed + k), t, r.uniform(-4, 0))
        t += 1 / rate * r.uniform(0.6, 1.5) + (0.18 if pause and r.random() < 0.12 else 0.0)
        k += 1
    return out


@sfx("phone_type_burst", "A short run of phone typing (0.6 s): five or six thumb taps at a post's pace.",
     use="Ep2 act4 19.07 (he finishes his post on the lawn; swapped in for the lock's typing_soft).", cat=CAT, mix_db=-20)
def phone_type_burst():
    return _phone_type(0.6, 9.0, 2590)


@sfx("phone_type_furious", "Furious phone typing (1.2 s): fast thumbs, no pauses.",
     use="Ep2 act1 4.15 (Nole types furiously; swapped in for the lock's key_tap_soft_01).", cat=CAT, mix_db=-18)
def phone_type_furious():
    return _phone_type(1.2, 14.0, 2600, pause=False)


# ============================================================================ act three, sc 13-17
@sfx("tape_pull", "Clear tape pulled off a roll and pressed down: the tape's screech, a tear, two pats.",
     use="Ep2 act3 13.03 (he tapes the flyer back, upside down).", cat=CAT, mix_db=-16)
def tape_pull():
    n = n_of(0.35)
    t = np.arange(n) / SR
    scr = (bandpass(noise(n, "white", 2700), 1200, 6000, 2) * (0.6 + 0.4 * np.sin(2 * math.pi * 55 * t))) * _env(n, [(0, 0), (0.02, 1), (0.33, 0.8), (0.35, 0)]) * 0.5
    tear = crackle(0.06, 900, 2000, 8000, seed=2701) * 0.4
    pats = mix(*[(thump(400, 250, 0.06, 0.003, 0.01) * 0.25, 0.55 + 0.12 * i) for i in range(2)])
    return reverb(mix(scr, (tear, 0.36), pats), "room", 0.12)


@sfx("blip_text_neutral", "A lower third typing on: a soft, level chip tick per character (no pitch contour, no trombone), 1.4 s.",
     pitch="C5 (level)", use="Ep2 act3 13.04 (the presser's lower third), tag 23.06 (the candidate's words on his).", cat=CAT, flavor="chip", mix_db=-20)
def blip_text_neutral():
    dur = 1.4
    parts = [(_chip("C5", 0.025, 0.25, [0.5, 0.3]) * 0.18, i / 18) for i in range(int(dur * 18))]
    return mix(*parts)


@sfx("lectern_bump", "The ROADMAP lectern bumping a door frame, on the lobby TV: a hollow wooden knock through a TV's speaker.",
     use="Ep2 act3 13.04 (two bumps).", cat=CAT, mix_db=-18)
def lectern_bump():
    b = mix(_tap(330, 2710, WOOD, 0.08, 5000, 0.3) * 0.6, thump(180, 110, 0.25, 0.008, 0.05) * 0.5)
    return _tvize(b)


@sfx("sticker_slap_tv", "An aide slapping a FORUM sticker on the lectern, on the TV: a small vinyl slap through a TV's speaker.",
     use="Ep2 act3 13.05 (the tenth sticker).", cat=CAT, mix_db=-18)
def sticker_slap_tv():
    s = mix(noise_burst(0.06, 800, 6000, 0.008, seed=2720) * 0.6, thump(450, 250, 0.06, 0.003, 0.01) * 0.3)
    return _tvize(s)


def _band_arp(notes, seed):
    parts = [(_chip(nt, 0.07, 0.25, [0.6, 0.45, 0.3, 0.15]) * 0.22, i * 0.055) for i, nt in enumerate(notes)]
    return reverb(mix(*parts), "room", 0.08)


@sfx("ui_band_on", "The adventure band lighting up: a short soft 1-bit arpeggio up, F4 C5 F5.",
     pitch="F4 C5 F5", use="Ep2 act3 13.06 (he crosses the threshold), act4 22.03.", cat=CAT, flavor="chip", mix_db=-18)
def ui_band_on():
    return _band_arp(("F4", "C5", "F5"), 2730)


@sfx("ui_band_off", "The adventure band going out: the same arpeggio down, F5 C5 F4, softer.",
     pitch="F5 C5 F4", use="Ep2 act4 22.03.", cat=CAT, flavor="chip", mix_db=-20)
def ui_band_off():
    return _band_arp(("F5", "C5", "F4"), 2731) * 0.8


@sfx("ui_verb_select", "A point-and-click verb chosen in the adventure band: a soft chip blip on C5 and a tiny cursorless click.",
     pitch="C5", use="Ep2 act3 14.02, 14.03, 14.12 (Look at, Talk to, Pivot).", cat=CAT, flavor="chip", mix_db=-18)
def ui_verb_select():
    b = _chip("C5", 0.06, 0.25, [0.6, 0.4, 0.2]) * 0.22
    c = click((2600, 4100), 0.004, 0.03, 0.3, seed=2740) * 0.12
    return mix(c, (b, 0.005))


@sfx("domino_set", "A single domino set upright on the office floor: a small, careful tap of plastic on carpet tile.",
     use="Ep2 act3 14.10 (Ekiel sets his thread down).", cat=CAT, mix_db=-18)
def domino_set():
    return reverb(mix(_tap(1600, 2750, PLASTIC, 0.02, 8000, 0.06) * 0.5, thump(320, 200, 0.06, 0.003, 0.01) * 0.25), "room", 0.1)


@sfx("domino_topple_run", "The one domino toppling over and skittering across the floor until it stops against a shoe: a clack, a short slide and two small bumps, then a soft stop.",
     use="Ep2 act3 14.10.", cat=CAT, mix_db=-16)
def domino_topple_run():
    tp = _tap(1400, 2760, PLASTIC, 0.03, 8000, 0.1) * 0.6
    sl = _friction(0.6, 900, 4500, 120, 0.5, 2761) * _env(n_of(0.6), [(0, 0.8), (0.5, 0.4), (0.6, 0)]) * 0.3
    bumps = mix(*[(_tap(1500 + 120 * i, 2762 + i, PLASTIC, 0.02, 8000, 0.06) * (0.3 - 0.08 * i), 0.15 + 0.18 * i) for i in range(2)])
    stop = thump(260, 180, 0.08, 0.004, 0.012) * 0.2
    return reverb(mix(tp, (sl, 0.04), bumps, (stop, 0.66)), "room", 0.12)


@sfx("plate_drop_box", "A small metal door plate dropped into a cardboard box marked MISC: a clink on other junk and the box's hollow thud.",
     use="Ep2 act3 14.11.", cat=CAT, mix_db=-16)
def plate_drop_box():
    cl = mix(_tap(2300, 2770, STEEL, 0.1, 11000, 0.3) * 0.4, _rattle(0.25, 2771, 1800, 5000, 30, STEEL, 0.06) * 0.2)
    bx = thump(190, 120, 0.25, 0.008, 0.04) * 0.5
    return reverb(mix(cl, bx), "room", 0.14)


@sfx("door_pivot_creak", "Alyi's door turning on its centre pin: a latch clack (keep the attack: THE CLOCK stops on it), then a long low pivot creak, Bb3 to C4, never through A.",
     pitch="Bb3 -> C4", use="Ep2 act3 14.12.", cat=CAT, mix_db=-14)
def door_pivot_creak():
    dur = 1.5
    n = n_of(dur)
    t = np.arange(n) / SR
    latch = mix(click((1900, 3400, 5200), 0.012, 0.08, 0.4, seed=2780) * 0.6, thump(300, 180, 0.12, 0.004, 0.02) * 0.4)
    f = np.interp(t, [0, 0.5, 1.2, dur], [hz("Bb3"), hz("Bb3") * 1.03, hz("C4"), hz("C4")])
    cr = (sine(f, n=n) + 0.5 * sine(2 * f, n=n)) * _penv(n, 30, 2781, 0.15, 2.0) * 0.07
    fr = _friction(dur, 400, 2500, 45, 0.6, 2782) * 0.2
    body = (cr + fr) * _env(n, [(0, 0), (0.1, 1), (1.2, 0.8), (dur, 0)])
    return reverb(mix(latch, (body, 0.08)), "room", 0.2)


@sfx("app_splash_2006", "TPOOL's splash, a tiny period chime from a 2006 phone app: four bright polyphonic-ringtone notes F5 C6 Eb6 F6 on a cheap FM tone, through a phone's speaker.",
     pitch="F5 C6 Eb6 F6", use="Ep2 act3 15.04 (its splash still plays: WHERE U AT?).", cat=CAT, mix_db=-18)
def app_splash_2006():
    parts = []
    for i, nt in enumerate(("F5", "C6", "Eb6", "F6")):
        f = hz(nt)
        m = n_of(0.16 if i < 3 else 0.35)
        t = np.arange(m) / SR
        y = np.sin(2 * math.pi * f * t + 1.8 * np.sin(2 * math.pi * f * 2 * t) * np.exp(-t / 0.08)) * np.exp(-t / (0.08 if i < 3 else 0.2))
        parts.append((y * 0.3, i * 0.12))
    return reverb(stereo(_small_speaker(mono(mix(*parts)), 600, 5000)), "room", 0.08)


@sfx("hourglass_cursor_2008", "A 2008 hourglass spinning while an old app loads: a soft repeating tick-tock (1.2 s), nothing real, nothing branded.",
     use="Ep2 act3 15.04.", cat=CAT, mix_db=-22)
def hourglass_cursor_2008():
    parts = [(click(((2900, 4500) if i % 2 == 0 else (2400, 3900)), 0.004, 0.03, 0.3, seed=2800 + i) * 0.2, i * 0.15) for i in range(8)]
    return _small_speaker(mono(mix(*parts)), 900, 6000)


@sfx("pin_ping", "The one live pin on TPOOL's old map: a soft tuned ping on F6 and its ripple turning warm (C6 under it).",
     pitch="F6 / C6", use="Ep2 act3 15.05 (ALYI CHECKED IN · DEC 2022).", cat=CAT, mix_db=-18)
def pin_ping():
    a = _bell("F6", 0.8, 0.45, 2810) * 0.3
    b = _bell("C6", 1.0, 0.6, 2811) * 0.15
    rip = grains(0.8, [hz("F6"), hz("C7"), hz("Ab6")], 10, (0.02, 0.05), [(0, 0), (0.1, 1), (0.8, 0)], seed=2812) * 0.05
    return reverb(mix(a, (b, 0.06), (rip, 0.08)), "hall", 0.2)


@sfx("check_in_blip", "TPOOL checking in on Alyi's phone: a tiny two-note period blip C6 -> F6 through a phone's speaker.",
     pitch="C6 -> F6", use="Ep2 act3 15.08 (F2.2: he checks in, types feel the agi).", cat=CAT, mix_db=-18)
def check_in_blip():
    a = _tone(hz("C6"), 0.09, ((1, 1.0), (2, 0.2)), 0.002, 0.05, 2820) * 0.3
    b = _tone(hz("F6"), 0.16, ((1, 1.0), (2, 0.2)), 0.002, 0.08, 2821) * 0.3
    return stereo(_small_speaker(mono(mix(a, (b, 0.08))), 700, 5500))


@sfx("torch_light", "Alyi's torch catching: a breathy whoosh into a small steady flame roar (1.0 s).",
     use="Ep2 act3 15.13 (F2.2b, the offsite).", cat=CAT, mix_db=-16)
def torch_light():
    w = whoosh(0.6, 250, 1400, 0.9, 0.35, seed=2830) * 0.6
    n = n_of(1.0)
    roar = bandpass(noise(n, "brown", 2831), 80, 800, 2) * _penv(n, 9, 2832, 0.5, 1) * _env(n, [(0, 0), (0.3, 1), (1.0, 0.6)]) * 0.5
    return reverb(mix(w, (roar, 0.1)), "room", 0.1)


@sfx("fire_crackle", "The effigy burning: a low rolling flame and lively crackle, outdoors (3.2 s).",
     use="Ep2 act3 15.15.", cat=CAT, mix_db=-16)
def fire_crackle():
    dur = 3.2
    n = n_of(dur)
    roar = bandpass(noise(n, "brown", 2840), 50, 600, 2) * _penv(n, 7, 2841, 0.5, 1) * 0.7
    cr = crackle(dur, 30, 1200, 7000, seed=2842) * 0.6 + crackle(dur, 8, 600, 3000, seed=2843) * 0.4
    return fade(reverb(mix(roar, cr), "room", 0.06)[:n], 0.05, 0.6)


@sfx("door_close_soft", "An office door swinging shut on an empty room: a soft hinge swish and a gentle latch click.",
     use="Ep2 act3 15.18 (it holds a second).", cat=CAT, mix_db=-18)
def door_close_soft():
    sw = _air(0.45, 150, 1200, 2850, ((0, 0), (0.6, 1), (1, 0))) * 0.35
    lt = mix(click((1800, 3100, 4700), 0.01, 0.06, 0.3, seed=2851) * 0.45, thump(240, 150, 0.12, 0.004, 0.02) * 0.35)
    return reverb(mix(sw, (lt, 0.42)), "room", 0.18)


@sfx("receipt_printer", "A thermal receipt printer chattering non-stop: fast stepper ticks and the paper feeding out (4.6 s, steady).",
     use="Ep2 act3 17.01 (the exit agreement pouring out of NopeAI's doors; J 1.0 s under sc 15's out).", cat=CAT, mix_db=-16)
def receipt_printer():
    dur = 4.6
    n = n_of(dur)
    t = np.arange(n) / SR
    steps = np.zeros(n)
    tt = 0.0
    while tt < dur:
        i = n_of(tt)
        seg_ = steps[i:i + 30]
        seg_ += np.hanning(30)[:len(seg_)]
        tt += 1 / 180.0
    st_ = bandpass(steps, 1500, 6000, 2) * 2
    motor = sine(hz("F4") * 2, n=n) * 0.03 + bandpass(noise(n, "white", 2860), 800, 3000, 2) * 0.12
    feed = _friction(dur, 2000, 7000, 90, 0.5, 2861) * 0.18
    pulse_ = 0.75 + 0.25 * np.sin(2 * math.pi * 3.2 * t)
    y = (st_ * 0.5 + motor + feed) * pulse_
    return fade(reverb(stereo(y), "room", 0.1)[:n], 0.04, 0.3)


@sfx("receipt_unroll_loop", "Receipt paper unrolling under traffic: a continuous soft paper scroll with flutter (6.8 s).",
     use="Ep2 act3 17.02 (across five lanes), 17.11 (still unrolling under his shoes).", cat=CAT, mix_db=-18)
def receipt_unroll_loop():
    dur = 6.8
    n = n_of(dur)
    sc = _friction(dur, 1200, 6500, 60, 0.6, 2870) * 0.4
    fl = bandpass(noise(n, "pink", 2871), 400, 3000, 2) * _penv(n, 4, 2872, 0.3, 1.2) * 0.3
    return fade(stereo(sc + fl), 0.2, 0.5)


@sfx("pen_chain_rattle", "A pen on a bank chain rising out of the receipt (or drawn back into it): a small bead chain sliding and rattling.",
     use="Ep2 act3 17.04 (it offers itself), 17.06 (it withdraws).", cat=CAT, mix_db=-18)
def pen_chain_rattle():
    return reverb(_rattle(0.6, 2880, 3000, 7500, 90, STEEL, 0.3) * 0.5, "room", 0.1)


def _horn(notes, dur, seed, far=False):
    n = n_of(dur)
    t = np.arange(n) / SR
    y = sum(pulse(hz(nt) * (1 + 0.003 * i), n, 0.45) * (1.0 if i == 0 else 0.8) for i, nt in enumerate(notes))
    y = highpass(lowpass(y, 2400, 2), 250, 2)
    y = biquad_peak(y, 900, 4, 1.5) * _env(n, [(0, 0), (0.015, 1), (dur - 0.04, 1), (dur, 0)]) * 0.25
    if far:
        y = lowpass(y, 1400, 2)
    return reverb(stereo(y), "hall", 0.12 if not far else 0.25)


variant("car_honk_1", lambda: _horn(("F4", "C5"), 0.45, 2890), desc="A car horn, one honk: an open fifth F4 + C5 (never a real horn's major third).",
        pitch="F4 + C5", use="Ep2 act3 17.02 (traffic stops on the receipt), 17.16 (the car behind him).", cat=CAT, mix_db=-16)
variant("car_honk_2", lambda: _horn(("Eb4", "Bb4"), 0.3, 2891), desc="A car horn, a short tap: Eb4 + Bb4 (a fifth). One trim of the post per honk.",
        pitch="Eb4 + Bb4", use="Ep2 act3 17.15.", cat=CAT, mix_db=-16)
variant("car_honk_3", lambda: _horn(("G4", "C5"), 0.28, 2892), desc="A car horn, a short tap: G4 + C5 (a fourth).",
        pitch="G4 + C5", use="Ep2 act3 17.15.", cat=CAT, mix_db=-16)
variant("car_honk_4", lambda: _horn(("F4", "Bb4"), 0.5, 2893), desc="A car horn, a longer honk: F4 + Bb4 (a fourth).",
        pitch="F4 + Bb4", use="Ep2 act3 17.15.", cat=CAT, mix_db=-16)
variant("car_honk_5", lambda: mix(_horn(("Eb4", "Bb4"), 0.2, 2894), (_horn(("Eb4", "Bb4"), 0.35, 2895), 0.3)),
        desc="A car horn, a double honk: Eb4 + Bb4 twice, the second longer.", pitch="Eb4 + Bb4", use="Ep2 act3 17.15.", cat=CAT, mix_db=-16)


@sfx("car_window_down", "A car's power window going down: a small electric motor whine on Db and the glass sliding into the door (0.9 s).",
     pitch="Db5 (motor)", use="Ep2 act3 17.05 (the DRIVER leans out).", cat=CAT, mix_db=-18)
def car_window_down():
    dur = 0.9
    n = n_of(dur)
    t = np.arange(n) / SR
    m = sine(hz("Db5") * np.interp(t, [0, 0.1, dur], [0.9, 1.0, 1.02]), n=n) * 0.05 + bandpass(noise(n, "white", 2900), 600, 3000, 2) * 0.12
    gl = _friction(dur, 1200, 5000, 50, 0.6, 2901) * 0.15
    stop = thump(300, 200, 0.1, 0.004, 0.02) * 0.25
    return reverb(mix((m + gl) * _env(n, [(0, 0), (0.05, 1), (0.85, 1), (dur, 0)]), (stop, 0.86)), "room", 0.1)


@sfx("key_delete_run", "Holding delete on a phone's keyboard: a fast run of soft haptic ticks as a draft unwrites itself (0.9 s).",
     use="Ep2 act3 17.10 (typed, deleted, typed).", cat=CAT, mix_db=-20)
def key_delete_run():
    parts = [(_phone_key(2910 + i) * (1.0 - 0.03 * i), i * 0.055) for i in range(16)]
    return mix(*parts)


@sfx("thunder_tuned_F", "A storm cloud's thunder over the bay, tuned: a crack and a long rolling rumble on F (F1/F2), 3.4 s.",
     pitch="F1 / F2", use="Ep2 act3 17.17 (the rain pad carries F4 there).", cat=CAT, mix_db=-12)
def thunder_tuned_F():
    dur = 3.4
    n = n_of(dur)
    t = np.arange(n) / SR
    crack = bandpass(noise(n_of(0.3), "white", 2920), 500, 6000, 2) * _env(n_of(0.3), [(0, 0), (0.005, 1), (0.3, 0)]) * 0.5
    rum = bandpass(noise(n, "brown", 2921), 25, 300, 2) * _penv(n, 3, 2922, 0.3, 1.2)
    tone = (sine(hz("F1"), n=n) * 0.5 + sine(hz("F2"), n=n) * 0.35 + sine(hz("C2"), n=n) * 0.15) * _penv(n, 2, 2923, 0.4, 1)
    body = (rum * 0.8 + tone * 0.35) * _env(n, [(0, 0), (0.15, 1), (1.5, 0.7), (dur, 0)])
    return reverb(mix(crack, body), "hall", 0.2)


@sfx("ink_run_drip", "Rain running the receipt's ink: water drops on paper and a thin trickle (1.6 s).",
     use="Ep2 act3 17.18.", cat=CAT, mix_db=-18)
def ink_run_drip():
    dur = 1.6
    dr = _drops(dur, 30, 2930, 1200, 4000, (0.006, 0.02)) * 0.6
    tr = bandpass(noise(n_of(dur), "pink", 2931), 900, 4500, 2) * _penv(n_of(dur), 12, 2932, 0.2, 1.5) * 0.2
    return fade(mix(dr, tr), 0.1, 0.3)


@sfx("umbrella_rain", "Rain on an umbrella, close over his head: dense drops on taut fabric, a low drum and a hiss. Seamless 4 s loop.",
     use="Ep2 act3 17.18 (close), and in the bridge_rain room.", cat=CAT, loop=True, mix_db=-20, norm="integrated")
def umbrella_rain():
    L = 4 * 4 * BEAT / 2
    n = n_of(L)
    fab = _drops(L, 260, 2940, 280, 900, (0.008, 0.03), loop=True) * 0.8
    sp = _drops(L, 500, 2941, 2500, 7000, (0.002, 0.008), loop=True) * 0.25
    hiss = np.stack([loop_noise(n, 2000, 9000, -2, seed=2942), loop_noise(n, 2000, 9000, -2, seed=2943)], axis=1) * 0.04
    return fab + sp + hiss


@sfx("umbrella_pop", "An umbrella snapping open, far off on dry land: a small 'fwump' of fabric and a spring click, distant.",
     use="Ep2 act3 17.18 (the Forecaster).", cat=CAT, mix_db=-22)
def umbrella_pop():
    f = mix(_air(0.25, 200, 1800, 2950, ((0, 0), (0.6, 1), (1, 0))) * 0.5, (click((1800, 3000), 0.01, 0.05, 0.3, seed=2951) * 0.3, 0.2))
    return reverb(lowpass(f, 2500, 2), "hall", 0.3)


@sfx("ui_pause_tap", "His thumb tapping Pause on VOICE 5: a soft glass tap, a low two-step chip fall C5 -> F4, the slot greying.",
     pitch="C5 -> F4", use="Ep2 act3 17.19.", cat=CAT, mix_db=-16)
def ui_pause_tap():
    tp = _phone_key(2960) * 1.2
    a = _chip("C5", 0.07, 0.25, [0.6, 0.4, 0.2]) * 0.2
    b = _chip("F4", 0.12, 0.25, I.chip_levels(8, 0.6, 0.08)) * 0.2
    return reverb(mix(tp, (a, 0.03), (b, 0.1)), "room", 0.08)


@sfx("blimp_lights_off", "One of the blimp's running lights clicking off: a small relay click and a faint electric tink, a little lower each time.",
     use="Ep2 act3 17.21 (one by one; the DREAD is the score's, on the fourth).", cat=CAT, mix_db=-18)
def blimp_lights_off():
    c = click((2000, 3400), 0.008, 0.05, 0.4, seed=2970) * 0.4
    tk = _bell("Db6", 0.25, 0.1, 2971) * 0.08
    return reverb(mix(c, (tk, 0.003)), "hall", 0.18)


# ============================================================================ act four, sc 18-22
@sfx("beacon_motor", "The lighthouse beacon's motor turning: a geared hum on F with the lens's slow rotating swish. Seamless 5 s loop (8 beats).",
     pitch="F2", use="Ep2 act4 18.01 (5.8 s), and the lighthouse room's motor layer.", cat=CAT, loop=True, mix_db=-24, norm="integrated")
def beacon_motor():
    L = 8 * BEAT
    n = n_of(L)
    hum = 0
    for k, a in ((1, 0.6), (2, 0.35), (3, 0.15), (4, 0.1)):
        h, _ = loop_tone(n, hz("F2") * k, L, 0.1 * k)
        hum = hum + a * h
    gear = np.stack([loop_noise(n, 300, 2500, -3, seed=2980), loop_noise(n, 300, 2500, -3, seed=2981)], axis=1) * 0.05
    rot = 0.6 + 0.4 * loop_lfo(n, 2)
    sw = np.stack([loop_noise(n, 200, 1500, -4, seed=2982), loop_noise(n, 200, 1500, -4, seed=2983)], axis=1) * 0.08 * rot[:, None]
    return stereo(hum * 0.15 * (1 + 0.05 * loop_lfo(n, 8))) + gear + sw


@sfx("tv_click_off", "The boardroom TV clicked off: a remote's button, the panel's power relay and its speaker's small pop.",
     use="Ep2 act4 18.06 (TERB clicks the TV off).", cat=CAT, mix_db=-18)
def tv_click_off():
    rm = click((2600, 4100), 0.004, 0.03, 0.3, seed=2990) * 0.25
    rl = mix(click((1500, 2600), 0.01, 0.05, 0.4, seed=2991) * 0.4, thump(300, 120, 0.08, 0.003, 0.015) * 0.3)
    return reverb(mix(rm, (rl, 0.12)), "room", 0.14)


@sfx("lanyard_drop", "A SAFETY COMMITTEE lanyard settling over a neck: a soft fabric strap and its plastic badge tapping a shirt front.",
     use="Ep2 act4 18.07 (both panes, one beat: Ekiel's and Mas's).", cat=CAT, mix_db=-18)
def lanyard_drop():
    st_ = _air(0.18, 600, 3500, 3000, ((0, 0), (0.5, 1), (1, 0))) * 0.25
    bd = mix(_tap(1300, 3001, PLASTIC, 0.02, 7000, 0.06) * 0.4, thump(300, 180, 0.06, 0.003, 0.01) * 0.2)
    return reverb(mix(st_, (bd, 0.14)), "room", 0.08)


@sfx("scroll_unroll_fall", "A scroll dropping down the lighthouse's stairwell: paper unrolling fast as it falls, bumping the rail twice, a far soft landing (2.2 s).",
     use="Ep2 act4 18.13 (the brief document).", cat=CAT, mix_db=-16)
def scroll_unroll_fall():
    dur = 2.2
    n = n_of(dur)
    un = _friction(1.6, 1000, 6000, 160, 0.4, 3010) * _env(n_of(1.6), [(0, 0), (0.05, 1), (1.6, 0.5)]) * 0.5
    fl = whoosh(1.6, 1500, 500, 1.0, 0.4, seed=3011) * 0.25
    b1 = _tap(800, 3012, WOOD, 0.04, 6000, 0.12) * 0.25
    b2 = _tap(700, 3013, WOOD, 0.04, 6000, 0.12) * 0.18
    land = lowpass(thump(250, 150, 0.2, 0.006, 0.03), 1500, 2) * 0.2
    return reverb(mix(un, (fl, 0.0), (b1, 0.5), (b2, 1.1), (land, 1.85), n=n), "hall", 0.3)


@sfx("glint_tick", "The beacon's glint crossing a CLOD box: a soft high tuned glass tick.",
     pitch="C7", use="Ep2 act4 18.13 (box by box).", cat=CAT, mix_db=-22)
def glint_tick():
    return reverb(_bell("C7", 0.4, 0.15, 3020) * 0.2, "hall", 0.15)


def _drafts_step(seed):
    """a shoe on a stair of bound drafts: the paper's crunch under the sole and a soft heel"""
    r = rng(seed)
    cr = crackle(0.18, 900, 1500, 7500, seed=seed, decay=0.06) * 0.6
    fl = bandpass(noise(n_of(0.12), "pink", seed + 1), 600, 4000, 2) * _env(n_of(0.12), [(0, 0), (0.01, 1), (0.12, 0)]) * 0.3
    th = thump(r.uniform(150, 180), 110, 0.15, 0.006, 0.03) * 0.35
    return reverb(mix(th, cr, fl), "hall", 0.12)


for _i in range(2):
    variant(f"footstep_drafts_{_i + 1}", (lambda i=_i: _drafts_step(3035 + 5 * i)),
            desc=f"A step on the lighthouse's stair of bound drafts (RR {_i + 1}/2): paper crunching under the sole, a soft heel.",
            use="Ep2 act4 18.01 (Ekiel climbs; swapped in for the lock's footstep_soft_1/2: 'on bound drafts').", cat=CAT, mix_db=-18)


@sfx("phone_turn_over", "A phone turned face down (or face up) on a table: a short glass-and-plastic slide and a soft set-down.",
     use="Ep2 act4 18.15, 20.10.", cat=CAT, mix_db=-18)
def phone_turn_over():
    sl = _friction(0.12, 800, 4500, 120, 0.5, 3030) * 0.3
    st_ = mix(_tap(1250, 3031, GLASS, 0.02, 8000, 0.06) * 0.35, thump(320, 200, 0.06, 0.003, 0.012) * 0.3)
    return reverb(mix(sl, (st_, 0.11)), "room", 0.1)


@sfx("calc_tape_spool", "A calculator tape unspooling behind HARAS as she walks: a light paper ribbon unrolling and fluttering (2.8 s).",
     use="Ep2 act4 19.03.", cat=CAT, mix_db=-18)
def calc_tape_spool():
    dur = 2.8
    n = n_of(dur)
    sp = _friction(dur, 1500, 7000, 70, 0.6, 3040) * 0.3 * _env(n, [(0, 0), (0.1, 1), (2.4, 1), (dur, 0)])
    fl = bandpass(noise(n, "pink", 3041), 600, 3500, 2) * _penv(n, 6, 3042, 0.2, 1.5) * 0.15
    return reverb(stereo(sp + fl), "room", 0.1)


def _cheer(dur, people, seed, applause=40, whistles=3, env=None, lp=7000):
    r = rng(seed)
    n = n_of(dur)
    out = np.zeros((n, 2))
    for p in range(people):
        hi = r.random() < 0.5
        f0 = r.uniform(200, 330) if hi else r.uniform(110, 180)
        st0 = r.gamma(1.4, 0.08)
        t = st0
        while t < dur * r.uniform(0.5, 0.95):
            ln = r.uniform(0.5, 1.2)
            if t + ln > dur:
                break
            v = _cheer_voice(ln, f0 * r.uniform(0.95, 1.08), seed * 7 + p * 31 + int(t * 10), hi) * r.uniform(0.3, 1.0)
            place(out, pan(v, r.uniform(-0.9, 0.9)), t)
            t += ln + r.uniform(0.1, 0.6)
    out = _n(out) * 0.6
    ap = _applause(dur, applause, seed + 1, None, (4.5, 7.0), lp) * 0.6
    ws = np.zeros((n, 2))
    for w in range(whistles):
        m = n_of(r.uniform(0.4, 0.8))
        t = np.arange(m) / SR
        f = r.uniform(2100, 2900) * np.interp(t, [0, 0.15, t[-1]], [0.85, 1.0, 1.05])
        place(ws, pan(sine(f, n=m) * _env(m, [(0, 0), (0.03, 1), (t[-1], 0)]) * 0.05, r.uniform(-0.8, 0.8)), r.uniform(0.2, dur * 0.6))
    y = lowpass(out + ap + ws, lp, 2)
    if env:
        y *= _env(n, env)[:, None]
    return y


@sfx("stream_announce_roar", "The keynote stream's own crowd roaring at the announcement, low on the lobby's wall screen: a far stadium cheer through a screen's speakers (2.4 s).",
     use="Ep2 act4 19.04 (the cheer's cause, under her question).", cat=CAT, mix_db=-18)
def stream_announce_roar():
    c = _cheer(2.4, 40, 3050, 60, 2, [(0, 0), (0.25, 1), (1.6, 0.8), (2.4, 0)], 6000)
    y = bandpass(mono(c), 250, 6500, 2)
    return reverb(stereo(biquad_peak(y, 2500, 2.0, 0.9)), "room", 0.15)


@sfx("crowd_cheer", "The lobby erupting: a hundred staff on beanbags cheering, clapping, a whistle or two, running on (4.6 s). No words, nobody's voice.",
     use="Ep2 act4 19.04 (on her 'profit', talking over it; it runs on across the cut into 19.05).", cat=CAT, mix_db=-12)
def crowd_cheer():
    c = _cheer(4.6, 36, 3060, 50, 3, [(0, 0), (0.12, 1), (3.0, 0.85), (4.6, 0)], 8000)
    return reverb(c, "hall", 0.18)


@sfx("confetti_pop", "A desk confetti cannon going off: a hollow cardboard pop and a shower of paper confetti fluttering down (1.6 s).",
     use="Ep2 act4 19.05.", cat=CAT, mix_db=-14)
def confetti_pop():
    pop = mix(thump(500, 160, 0.15, 0.004, 0.03) * 0.6, noise_burst(0.08, 400, 5000, 0.015, seed=3070) * 0.5)
    sh = crackle(1.4, 90, 2500, 9000, seed=3071, decay=0.6) * 0.3
    return reverb(mix(pop, (sh, 0.08)), "room", 0.15)


@sfx("lobby_laugh_s", "The lobby laughing at Mas on the big screen: a small room of colleagues, a quick warm laugh (1.8 s).",
     use="Ep2 act4 19.06.", cat=CAT, mix_db=-16)
def lobby_laugh_s():
    return _crowd_laugh(1.8, 18, 3080, 0.2, 0.6, 7000, "room", 0.2)


@sfx("chat_ping_run", "The stream's chat lighting up with his post: a run of soft chat pings climbing (C6 Eb6 F6 ...), far, on the giant screen (1.3 s).",
     pitch="C6 Eb6 F6", use="Ep2 act4 19.08.", cat=CAT, mix_db=-18)
def chat_ping_run():
    notes = ["C6", "Eb6", "F6", "C6", "F6", "Eb6", "F6", "C7", "F6", "Eb6"]
    parts = [(_bell(nt, 0.2, 0.08, 3090 + i) * 0.12, i * 0.12 + 0.02 * (i % 3)) for i, nt in enumerate(notes)]
    return reverb(lowpass(mix(*parts), 6000, 2), "hall", 0.25)


@sfx("clicker_catch", "Young Mas catching the clicker THE SLEEVE tosses him: a small plastic slap into a palm.",
     use="Ep2 act4 19.13 (F2.1, 2008).", cat=CAT, mix_db=-16)
def clicker_catch():
    s = mix(noise_burst(0.05, 300, 4000, 0.01, seed=3100) * 0.5, _tap(900, 3101, PLASTIC, 0.02, 6000, 0.06) * 0.3)
    return reverb(s, "room", 0.12)


def _camcorder(x, seed):
    """a 2008 camcorder's own audio: a small mic's band, its auto-gain pumping, hiss, a tape-motor whine on F"""
    y = bandpass(mono(stereo(x)), 180, 7000, 2)
    n = len(y)
    agc = 1 / (0.4 + lowpass(np.abs(y), 3, 1) * 3)
    y = y * np.clip(agc / (np.max(agc) + 1e-9), 0.2, 1.0)
    hiss = bandpass(noise(n, "white", seed), 3000, 9000, 2) * 0.02
    whine = sine(hz("F6"), n=n) * 0.003
    return stereo(_n(y) * 0.7 + hiss + whine)


@sfx("vhs_applause", "The tiled 2008 crowd applauding, heard through the camcorder: a hall's applause through a small mic with auto-gain and hiss (2.6 s).",
     use="Ep2 act4 19.13 (F2.1).", cat=CAT, mix_db=-16)
def vhs_applause():
    ap = _applause(2.6, 60, 3110, [(0, 0), (0.15, 1), (1.8, 0.9), (2.6, 0)], (4.5, 6.5), 7000)
    return _camcorder(reverb(ap, "hall", 0.3), 3111)


for _i, _nt in enumerate(("G5", "F5", "Eb5", "Db5")):
    variant("pin_grey_tick" if _i == 0 else f"pin_grey_tick_{_i + 1}",
            (lambda nt=_nt, i=_i: reverb(mix(click((2600, 4000), 0.004, 0.03, 0.3, seed=3120 + i) * 0.15,
                                                 (_tone(hz(nt), 0.2, ((1, 1.0), (3, 0.1)), 0.002, 0.06, 3125 + i) * 0.18, 0.003)), "room", 0.1)),
            desc=f"A TPOOL pin greying out on the 2008 screen: a soft tick on {_nt} ({_i + 1}/4, each a step lower; the score puts its own chip note on each, a step above).",
            pitch=_nt, use="Ep2 act4 19.14 (one by one; the stems lay 1, 2, 3, 4 in order).", cat=CAT, mix_db=-20)


def _big_lock(seed):
    r = rng(seed)
    rat = mix(*[(click((1300 + 100 * i, 2500), 0.01, 0.05, 0.4, seed=seed + i) * 0.3, 0.06 * i) for i in range(5)])
    bolt = mix(_tap(380, seed + 10, STEEL, 0.12, 5000, 0.4) * 0.5, thump(220, hz("C2"), 0.3, 0.008, 0.05) * 0.5)
    return reverb(mix(rat, (bolt, 0.32)), "hall", 0.18)


@sfx("lock_big_turn", "A key as tall as a man turning a garden gate's lock: a heavy ratchet of wards and the bolt's deep clunk.",
     use="Ep2 act4 19.16 (MIT KOOC opens it), 19.19 (it locks behind CHATGTP).", cat=CAT, mix_db=-14)
def lock_big_turn():
    return _big_lock(3130)


def _gate(seed, shut):
    dur = 1.6
    n = n_of(dur)
    t = np.arange(n) / SR
    f = np.interp(t, [0, 0.6, 1.2, dur], [hz("Eb4"), hz("F4"), hz("Eb4"), hz("Db4")])
    cr = (sine(f, n=n) + 0.4 * sine(2 * f, n=n)) * _penv(n, 25, seed, 0.1, 2.0) * 0.06 + _friction(dur, 500, 3000, 40, 0.6, seed + 1) * 0.15
    cr *= _env(n, [(0, 0), (0.1, 1), (1.2 if shut else 1.4, 0.7), (dur, 0)])
    parts = [cr]
    if shut:
        clang = mix(_tap(520, seed + 2, STEEL, 0.4, 7000, 1.0) * 0.5, thump(200, hz("C2"), 0.3, 0.006, 0.05) * 0.4)
        parts.append((clang, 1.25))
    return reverb(mix(*parts), "hall", 0.2)


@sfx("gate_iron_swing", "An iron garden gate swinging open: a slow hinge creak, Eb4-F4 (never A).",
     pitch="Eb4 - F4", use="Ep2 act4 19.16.", cat=CAT, mix_db=-16)
def gate_iron_swing():
    return _gate(3140, False)


@sfx("gate_iron_shut", "The iron gate swinging shut: the hinge creak and the gate's clang into its latch.",
     pitch="Eb4 - F4 / C2", use="Ep2 act4 19.19 (swapped in for the lock's second gate_iron_swing).", cat=CAT, mix_db=-14)
def gate_iron_shut():
    return _gate(3145, True)


@sfx("velvet_rope", "A velvet rope's brass hook unclipped from its post and the rope swinging: a small brass clink and a soft swish.",
     use="Ep2 act4 19.16 (CHATGTP walked through on a velvet rope).", cat=CAT, mix_db=-18)
def velvet_rope():
    cl = _tap(2900, 3150, STEEL, 0.15, 12000, 0.4) * 0.35
    sw = _air(0.4, 300, 2000, 3151, ((0, 0), (0.4, 1), (1, 0))) * 0.25
    return reverb(mix(cl, (sw, 0.05)), "room", 0.14)


@sfx("flower_nod", "A phone-shaped flower nodding: a tiny leaf rustle and a soft wooden tick.",
     use="Ep2 act4 19.17.", cat=CAT, mix_db=-22)
def flower_nod():
    rs = crackle(0.2, 120, 2500, 8000, seed=3160, decay=0.08) * 0.3
    tk = _tap(1900, 3161, WOOD, 0.015, 9000, 0.05) * 0.15
    return reverb(mix(rs, (tk, 0.05)), "room", 0.08)


@sfx("chip_blip_bubble", "CHATGTP's speech bubble popping up over a flower: one soft chip blip, F5 -> C6, no voice.",
     pitch="F5 -> C6", use="Ep2 act4 19.17.", cat=CAT, flavor="chip", mix_db=-18)
def chip_blip_bubble():
    a = _chip("F5", 0.04, 0.25, [0.6, 0.4]) * 0.22
    b = _chip("C6", 0.07, 0.25, [0.6, 0.45, 0.25, 0.1]) * 0.22
    return reverb(mix(a, (b, 0.04)), "room", 0.08)


@sfx("phone_into_pocket", "A phone slid into a jacket pocket: a short fabric slide and a soft settle.",
     use="Ep2 act4 19.20.", cat=CAT, mix_db=-20)
def phone_into_pocket():
    sl = _friction(0.3, 400, 3500, 70, 0.6, 3170, "pink") * _env(n_of(0.3), [(0, 0), (0.05, 1), (0.3, 0)]) * 0.4
    return reverb(mix(sl, (thump(220, 150, 0.08, 0.003, 0.015) * 0.15, 0.25)), "room", 0.08)


@sfx("cage_door_shut", "A small birdcage door snapped shut: wire bars ringing briefly and the latch catching.",
     use="Ep2 act4 20.03 (Nole's phone goes in the cage).", cat=CAT, mix_db=-16)
def cage_door_shut():
    bars = mix(*[(_tap(r_f, 3180 + i, STEEL, 0.25, 12000, 0.6) * 0.18, 0.004 * i) for i, r_f in enumerate((2100, 2650, 3150, 3800))])
    lt = click((2200, 3600), 0.01, 0.05, 0.4, seed=3185) * 0.35
    return reverb(mix(bars, (lt, 0.03)), "room", 0.14)


@sfx("padlock_snap", "A padlock snapped shut: a hard dry steel click (the 808 drops out there).",
     use="Ep2 act4 20.03.", cat=CAT, mix_db=-14)
def padlock_snap():
    return reverb(mix(click((2400, 3900, 6100), 0.014, 0.08, 0.35, seed=3190) * 0.7, _tap(1600, 3191, STEEL, 0.05, 9000, 0.15) * 0.35), "booth", 0.06)


@sfx("phone_buzz_muffled", "A phone buzzing inside a small steel cage, replies stacking up: three buzzes rattling the wire bars, muffled (2.5 s).",
     pitch="Db3 (motor)", use="Ep2 act4 20.04.", cat=CAT, mix_db=-16)
def phone_buzz_muffled():
    parts = []
    for i, t0 in enumerate((0.0, 0.75, 1.5)):
        b = S4._phone_buzz(0.55, hz("Db3") * (1 + 0.004 * i), 3200 + i, "table")
        rt = _rattle(0.5, 3205 + i, 2200, 4500, 70, STEEL) * 0.15
        parts.append((mix(lowpass(b, 1800, 2), rt), t0))
    return mix(*parts)


@sfx("tape_peel", "Old tape peeled off a pillar: a slow sticky crackle and the paper lifting.",
     use="Ep2 act4 20.05 (his upside-down flyer off the pillar).", cat=CAT, mix_db=-18)
def tape_peel():
    n = n_of(0.45)
    pk = crackle(0.45, 700, 1500, 8000, seed=3210) * _env(n, [(0, 0), (0.03, 1), (0.4, 0.6), (0.45, 0)]) * 0.5
    pp = _air(0.2, 800, 4000, 3211, ((0, 0), (0.5, 1), (1, 0))) * 0.15
    return reverb(mix(pk, (pp, 0.3)), "room", 0.1)


@sfx("docket_tab_flick", "The complaint's docket tab flicked by the draught: one small stiff-paper flick.",
     use="Ep2 act4 20.08.", cat=CAT, mix_db=-20)
def docket_tab_flick():
    return reverb(mix(noise_burst(0.04, 1500, 8000, 0.006, seed=3220) * 0.5, _tap(1800, 3221, WOOD, 0.01, 9000, 0.03) * 0.2), "room", 0.08)


@sfx("rope_drop", "A rope dropping from above and its hook catching the complaint: a falling rope's whip and a metal hook's clack on paper.",
     use="Ep2 act4 20.09.", cat=CAT, mix_db=-16)
def rope_drop():
    w = whoosh(0.4, 600, 2500, 1.0, 0.7, seed=3230) * 0.4
    hk = mix(_tap(1700, 3231, STEEL, 0.06, 9000, 0.2) * 0.35, noise_burst(0.05, 500, 4000, 0.01, seed=3232) * 0.25)
    return reverb(mix(w, (hk, 0.37)), "room", 0.14)


@sfx("rope_haul", "The complaint hauled up out of frame: a pulley's squeaking turns (Eb5, never A), the rope creaking, the stack's air rushing (2.2 s).",
     pitch="Eb5", use="Ep2 act4 20.09.", cat=CAT, mix_db=-14)
def rope_haul():
    dur = 2.2
    n = n_of(dur)
    t = np.arange(n) / SR
    sq = sine(hz("Eb5") * (1 + 0.01 * np.sin(2 * math.pi * 3 * t)), n=n) * (np.abs(np.sin(2 * math.pi * 2.2 * t)) ** 6) * 0.05
    cr = _friction(dur, 400, 2500, 40, 0.6, 3240) * 0.25
    up = whoosh(dur, 300, 1400, 0.9, 0.5, seed=3241) * 0.25
    return reverb(mix(stereo(sq + cr), up) * _env(n, [(0, 0), (0.1, 1), (1.8, 0.8), (dur, 0)])[:, None], "hall", 0.18)


@sfx("sticky_flutter", "A sticky note fluttering down onto the clean rectangle on the carpet: tiny paper flaps and a whisper of a landing.",
     use="Ep2 act4 20.09.", cat=CAT, mix_db=-22)
def sticky_flutter():
    dur = 1.0
    n = n_of(dur)
    fl = bandpass(noise(n, "pink", 3250), 1500, 7000, 2) * (np.abs(np.sin(2 * math.pi * 5 * np.arange(n) / SR)) ** 3) * _env(n, [(0, 0), (0.1, 1), (0.85, 0.6), (dur, 0)]) * 0.35
    return reverb(stereo(fl), "room", 0.1)


@sfx("pin_knock", "The link card landing on TPOOL's old check-in pin and knocking it loose: a small UI thock and the pin's wobble.",
     use="Ep2 act4 20.11.", cat=CAT, mix_db=-18)
def pin_knock():
    th = mix(_tap(1050, 3260, PLASTIC, 0.03, 7000, 0.1) * 0.5, thump(380, 240, 0.08, 0.004, 0.015) * 0.3)
    wob = mix(*[(_tap(1500, 3261 + i, PLASTIC, 0.01, 8000, 0.04) * (0.15 - 0.04 * i), 0.09 + 0.07 * i) for i in range(3)])
    return reverb(mix(th, wob), "room", 0.1)


@sfx("pin_fall", "The pin tipping off the map and falling: a soft fall in steps F6 Eb6 C6 Bb5 Ab5 F5 on a sine bell, with a little air, no landing.",
     pitch="F6 -> F5 (in steps)", use="Ep2 act4 20.13 (hard cut to white as it falls), 22.01 (it falls into the white).", cat=CAT, mix_db=-18)
def pin_fall():
    g = mix(*[(_bell(nt, 0.35, 0.12, 3270 + i) * (0.16 - 0.015 * i), i * 0.13) for i, nt in enumerate(("F6", "Eb6", "C6", "Bb5", "Ab5", "F5"))])
    a = _air(0.9, 1500, 6000, 3277, ((0, 0), (0.6, 1), (1, 0))) * 0.08
    return reverb(mix(g, a), "hall", 0.25)


def _gravel(seed):
    r = rng(seed)
    n = n_of(0.3)
    cr = np.zeros(n)
    for i in range(int(r.integers(25, 45))):
        s = int(r.integers(0, n_of(0.12)))
        m = n_of(r.uniform(0.002, 0.008))
        cr[s:s + m] += r.uniform(-1, 1) * np.hanning(m)[:max(0, min(m, n - s))]
    cr = bandpass(cr, 1200, 7000, 2) * 0.8
    th = thump(140, 90, 0.15, 0.006, 0.03) * 0.3
    return reverb(mix(cr, th), "room", 0.06)


for _i in range(3):
    variant("footstep_gravel" if _i == 0 else f"footstep_gravel_{_i + 1}", (lambda i=_i: _gravel(3280 + 7 * i)),
            desc=f"A shoe on loose gravel (RR {_i + 1}/3): a crunch of small stones and a soft heel.",
            use="Ep2 act4 22.02 (he walks up), 22.09 (he walks away); the stems cycle 1, 2, 3.", cat=CAT, mix_db=-20)


@sfx("flyer_into_slot", "The folded flyer pushed into the cube's mail slot: paper sliding against a brush seal.",
     use="Ep2 act4 22.04.", cat=CAT, mix_db=-18)
def flyer_into_slot():
    s = _friction(0.5, 900, 6000, 90, 0.5, 3300) * _env(n_of(0.5), [(0, 0), (0.08, 1), (0.45, 0.7), (0.5, 0)]) * 0.4
    br = crackle(0.4, 300, 3000, 9000, seed=3301) * 0.12
    return reverb(mix(s, (br, 0.05)), "room", 0.08)


@sfx("mail_flap_lift", "The mail slot's flap lifting on its hinge as the flyer pushes it: a small metal hinge squeak (C6) and the flap's rattle.",
     pitch="C6", use="Ep2 act4 22.04.", cat=CAT, mix_db=-18)
def mail_flap_lift():
    n = n_of(0.3)
    sq = sine(hz("C6") * np.interp(np.arange(n) / SR, [0, 0.3], [0.98, 1.0]), n=n) * _penv(n, 30, 3310, 0.1, 2.5) * 0.05
    rt = _tap(1900, 3311, STEEL, 0.05, 9000, 0.15) * 0.2
    return reverb(mix(sq, (rt, 0.25)), "room", 0.1)


@sfx("mail_flap_spring_shut", "THE DESIGNED STOP: the mail flap swinging shut on its spring, a hard dry metal clack and the spring's short damped buzz. It plays in room tone only.",
     use="Ep2 act4 22.06.", cat=CAT, mix_db=-12)
def mail_flap_spring_shut():
    cl = mix(click((1900, 3300, 5200), 0.012, 0.09, 0.35, seed=3320) * 0.7, _tap(1350, 3321, STEEL, 0.07, 9000, 0.25) * 0.4,
             thump(260, 160, 0.1, 0.004, 0.02) * 0.3)
    n = n_of(0.35)
    t = np.arange(n) / SR
    spr = sine(hz("Bb4") * (1 + 0.02 * np.exp(-t / 0.05)), n=n) * np.exp(-t / 0.07) * 0.06
    return reverb(mix(cl, (spr, 0.01)), "booth", 0.08)


@sfx("paper_drop_floor", "The flyer landing on the floor inside, unseen: a soft paper settle heard through a door, low-passed.",
     use="Ep2 act4 22.05.", cat=CAT, mix_db=-22)
def paper_drop_floor():
    p = mix(_air(0.2, 600, 3000, 3330, ((0, 0), (0.7, 1), (1, 0))) * 0.3, (thump(300, 200, 0.06, 0.003, 0.012) * 0.2, 0.18))
    return reverb(lowpass(p, 1800, 2), "room", 0.2)


@sfx("lab_room_tone", "The lab's warm room tone through the slot's gap: quiet HVAC, a far keyboard, a server's soft hum, warm and close. Seamless 5 s loop.",
     use="Ep2 act4 22.05 (one beat, through the gap).", cat=CAT, loop=True, mix_db=-26, norm="integrated")
def lab_room_tone():
    L = 8 * BEAT
    n = n_of(L)
    y = _hvac(n, 3340, 900, 1.0)
    h, _ = loop_tone(n, hz("F2"), L)
    keys = _pevents(n, 2.0, lambda k: lowpass(S4._key(3345 + k % 10), 2500), 3346, (-28, -22))
    return y + stereo(h * 0.01) + keys


@sfx("page_turn", "A thick complaint's page turned: a stiff paper flip and the page landing.",
     use="Ep2 tag 23.02 (three pages: !!, !, a full stop).", cat=CAT, mix_db=-18)
def page_turn():
    fl = whoosh(0.3, 900, 2500, 1.0, 0.5, seed=3350) * 0.35
    cr = crackle(0.25, 200, 2000, 8000, seed=3351, decay=0.1) * 0.25
    ld = thump(350, 220, 0.06, 0.003, 0.012) * 0.2
    return reverb(mix(fl, (cr, 0.02), (ld, 0.27)), "room", 0.08)


@sfx("balloon_pump", "A hand pump pushing air into a speech-bubble balloon: one stroke, the pump's 'fsh' and the rubber stretching.",
     use="Ep2 tag 23.07 (FEAR plays under them).", cat=CAT, mix_db=-18)
def balloon_pump():
    ps = _air(0.4, 700, 4500, 3360, ((0, 0), (0.3, 1), (0.8, 0.6), (1, 0))) * 0.4
    st_ = _friction(0.25, 500, 2500, 70, 0.6, 3361, "pink") * 0.15
    return reverb(mix(ps, (st_, 0.15)), "room", 0.08)


@sfx("knot_tie", "The balloon's neck knotted and tied to the podium: a rubber squeak and a small snap.",
     use="Ep2 tag 23.07.", cat=CAT, mix_db=-18)
def knot_tie():
    n = n_of(0.3)
    t = np.arange(n) / SR
    sq = sine(np.interp(t, [0, 0.3], [hz("C5"), hz("Eb5")]), n=n) * _penv(n, 40, 3370, 0, 3) * 0.05
    sn = click((1800, 3000), 0.008, 0.05, 0.5, seed=3371) * 0.3
    return reverb(mix(sq + _friction(0.3, 600, 3000, 90, 0.5, 3372) * 0.1, (sn, 0.3)), "room", 0.08)


@sfx("string_taut", "The balloon's string going taut, as if someone on the far side had taken hold of it: a quick creak of string and one low tuned twang on Eb3 (never A).",
     pitch="Eb3", use="Ep2 tag 23.08.", cat=CAT, mix_db=-14)
def string_taut():
    pull = _friction(0.12, 800, 4000, 150, 0.5, 3380) * 0.25
    tw = I.harp("Eb3", 1.2) * 0.4 if hasattr(I, "harp") else _tone(hz("Eb3"), 1.2, ((1, 1.0), (2, 0.3), (3, 0.1)), 0.002, 0.4, 3381) * 0.3
    return reverb(mix(pull, (tw, 0.08)), "room", 0.12)


# ============================================================================ the room beds (20 s loops, 8 bars at 96)
def _bed(fn):
    return fn


def _ticks_eighths(n, seed, note="F6", level=0.004):
    """LED votives ticking on eighths (loop-safe: 64 eighths in 20 s)"""
    out = np.zeros((n, 2))
    r = rng(seed)
    k = int(round(n / SR / EIGHTH))
    for i in range(k):
        tk = _tone(hz(note) * r.uniform(0.999, 1.001), 0.03, ((1, 1.0),), 0.001, 0.008, seed + i) * level * (1.0 if i % 2 == 0 else 0.6)
        _pplace(out, pan(tk, r.uniform(-0.5, 0.5)), i * EIGHTH)
    return out


@sfx("bed_lobby_day", "Room bed, the NopeAI lobby by day: the rack pillars' hum on F, big-lobby air, staff on beanbags (a low murmur, a laptop or two), the LED votives ticking faintly on eighths. Seamless 20 s loop.",
     use="Ep2 coldopen sc 1, act3 sc 13.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_lobby_day():
    n = n_of(LOOP20)
    y = _hvac(n, 3400, 1300) * 0.8
    hum = 0
    for k, a in ((1, 0.5), (2, 0.3), (3, 0.12)):
        h, _ = loop_tone(n, hz("F2") * k, LOOP20, 0.17 * k)
        hum = hum + a * h
    mur = _murmur(n, 6, 3405, 200, 2000, distance_lp=1400) * 1.2
    keys = _pevents(n, 1.5, lambda k: lowpass(S4._key(3410 + k % 20), 3000), 3406, (-30, -22))
    return y + stereo(hum * 0.025) + mur + keys + _ticks_eighths(n, 3407)


@sfx("bed_lobby_watchparty", "Room bed, the lobby's watch party: a hundred staff half-listening on beanbags, a lively murmur, beanbag rustles, a laugh here and there, the racks' hum under it. Seamless 20 s loop.",
     use="Ep2 act4 sc 19 (the watch party).", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_lobby_watchparty():
    n = n_of(LOOP20)
    mur = _murmur(n, 24, 3420, 180, 2600, (3.0, 5.2), (0.1, 0.3), distance_lp=2600) * 2.2
    rus = _pevents(n, 2.5, lambda k: bandpass(noise(n_of(0.3), "pink", 3421 + k), 300, 3000, 2) * np.hanning(n_of(0.3)) * 0.05, 3422, (-12, -4))
    laugh = _pevents(n, 0.15, lambda k: _laugh_voice(0.8, 180 + 20 * (k % 5), 3430 + k, k % 2 == 0) * 0.05, 3423, (-14, -8))
    h, _ = loop_tone(n, hz("F2"), LOOP20)
    return mur + rus + laugh + stereo(h * 0.015) + _hvac(n, 3424, 1100) * 0.5


@sfx("bed_lobby_cheer", "Room bed, the lobby still cheering during Gerg's call: the watch party on its feet, cheers coming in waves, clapping, a whoop, the beanbags. Seamless 20 s loop.",
     use="Ep2 act4 19.09-19.10 (under Gerg's shots of the crosscut call: crosscut.py, the stems' CROSS_ROOM).", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_lobby_cheer():
    n = n_of(LOOP20)
    mur = _murmur(n, 26, 3450, 200, 2800, (3.5, 5.5), (0.15, 0.4), distance_lp=3000) * 2.4
    out = np.zeros((n, 2))
    for i, t0 in enumerate((0.4, 5.6, 11.2, 15.9)):
        c = _cheer(3.6, 18, 3451 + i, 20, 1, [(0, 0), (0.25, 1), (2.6, 0.7), (3.6, 0)], 7500) * 0.5
        _pplace(out, c, t0)
    claps = np.zeros((n, 2))
    _pplace(claps, _applause(LOOP20, 14, 3459, None, (4.5, 6.5), 7500) * 0.25, 0.0)
    return mur + out + claps


@sfx("bed_lobby_morning", "Room bed, the lobby the morning after (Jun 11): quiet big-lobby air, a broom sweeping confetti, a far coffee machine, tape peeling somewhere, a few voices far off. Seamless 20 s loop.",
     use="Ep2 act4 20.05-20.09.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_lobby_morning():
    n = n_of(LOOP20)
    y = _hvac(n, 3440, 1200) * 0.8
    broom = _pevents(n, 0.9, lambda k: bandpass(noise(n_of(0.35), "pink", 3441 + k), 1200, 7000, 2) * _env(n_of(0.35), [(0, 0), (0.1, 1), (0.35, 0)]) * 0.12, 3442, (-14, -8), 0.5)
    coffee = _pevents(n, 0.08, lambda k: lowpass(bandpass(noise(n_of(2.5), "brown", 3443 + k), 100, 1200, 2), 900) * _env(n_of(2.5), [(0, 0), (0.3, 1), (2.2, 1), (2.5, 0)]) * 0.15, 3444, (-16, -12), 0.9)
    tape = _pevents(n, 0.12, lambda k: crackle(0.4, 500, 1500, 7000, seed=3445 + k) * 0.08, 3446, (-20, -14))
    mur = _murmur(n, 3, 3447, 200, 1800, distance_lp=900) * 0.8
    h, _ = loop_tone(n, hz("F2"), LOOP20)
    return y + broom + coffee + tape + mur + stereo(h * 0.012)


@sfx("bed_seance_candles", "Room bed detail, the séance: many candle flames fluttering and ticking on the boardroom table, laid over the boardroom's night bed. Seamless 20 s loop.",
     use="Ep2 act1 sc 4 (the séance), with bed_boardroom_night under it.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_seance_candles():
    n = n_of(LOOP20)
    fl = np.stack([loop_noise(n, 60, 600, -4, seed=3460), loop_noise(n, 60, 600, -4, seed=3461)], axis=1) * _penv(n, 3, 3462, 0.4, 1.5)[:, None] * 0.6
    cr = _pevents(n, 6.0, lambda k: crackle(0.03, 2000, 1800, 6500, seed=3463 + k % 40) * 0.6, 3464, (-14, -4), 0.6)
    return fl + cr


@sfx("bed_podcast_studio", "Room bed, XEL's padded studio: dead acoustics, a low quiet HVAC, the gear's faint hum on F, a chair creaking now and then. Never true silence. Seamless 20 s loop.",
     use="Ep2 act1 sc 6 (no score here: the padded room tone is the joke).", cat="room", loop=True, mix_db=-32, norm="integrated")
def bed_podcast_studio():
    n = n_of(LOOP20)
    y = circular(lambda z: lowpass(z, 700, 2), _hvac(n, 3480, 900))
    h, _ = loop_tone(n, hz("F2"), LOOP20)
    cr = _pevents(n, 0.18, lambda k: _friction(0.35, 300, 2000, 50, 0.6, 3481 + k, "pink") * _env(n_of(0.35), [(0, 0), (0.05, 1), (0.35, 0)]) * 0.08, 3482, (-16, -10), 0.4)
    return y + stereo(h * 0.008) + cr


@sfx("bed_basement", "Room bed, the cathedral's basement: lower and closer, a boiler's rumble, pipes ticking, the racks above heard through the slab. Seamless 20 s loop.",
     use="Ep2 act1 sc 7 (the basement).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_basement():
    n = n_of(LOOP20)
    rum = np.stack([loop_noise(n, 25, 260, -5, seed=3500), loop_noise(n, 25, 260, -5, seed=3501)], axis=1) * 1.2
    h, _ = loop_tone(n, hz("F1"), LOOP20)
    h2, _ = loop_tone(n, hz("C2"), LOOP20, 0.3)
    pipes = _pevents(n, 0.4, lambda k: _tap(700 + 60 * (k % 5), 3502 + k, STEEL, 0.08, 4000, 0.25) * 0.05, 3503, (-18, -10))
    racks = circular(lambda z: lowpass(z, 500, 2), _hvac(n, 3504, 900)) * 0.4
    return rum + stereo(h * 0.04 + h2 * 0.02) + pipes + racks


@sfx("bed_wings", "Room bed, the demo stage's wings in work light: the work lights' hum on F, cable hum, road cases and a dolly far off, the house murmuring through the masking. Seamless 20 s loop.",
     use="Ep2 act2 sc 9, 11.03, 11.11-11.12.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_wings():
    n = n_of(LOOP20)
    y = _hvac(n, 3520, 1000) * 0.7
    hum = 0
    for k, a in ((1, 0.5), (2, 0.25), (3, 0.1)):
        h, _ = loop_tone(n, hz("F2") * k, LOOP20, 0.21 * k)
        hum = hum + a * h
    house = circular(lambda z: lowpass(z, 700, 2), _murmur(n, 14, 3521, 180, 2000)) * 1.0
    cases = _pevents(n, 0.35, lambda k: mix(_tap(450 + 40 * (k % 6), 3522 + k, WOOD, 0.08, 4000, 0.3) * 0.15,
                                              (click((1800, 3000), 0.01, 0.05, 0.4, seed=3530 + k) * 0.06, 0.05)), 3523, (-16, -8))
    return y + stereo(hum * 0.02) + house + cases


@sfx("bed_demo_house", "Room bed, the demo house during the keynote: a full, attentive house (seats creaking, a murmur held low, a cough now and then), big-hall air handling. Seamless 20 s loop.",
     use="Ep2 act2 sc 11 (the house).", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_demo_house():
    n = n_of(LOOP20)
    air = circular(lambda z: lowpass(z, 1100, 2), _hvac(n, 3540, 1400)) * 1.0
    mur = circular(lambda z: lowpass(z, 1500, 2), _murmur(n, 30, 3541, 180, 2200, (2.5, 4.0), (0.05, 0.15))) * 0.8
    seats = _pevents(n, 1.2, lambda k: _friction(0.3, 300, 2000, 50, 0.6, 3542 + k % 30, "pink") * np.hanning(n_of(0.3)) * 0.06, 3543, (-18, -10), 0.9)
    cough = _pevents(n, 0.1, lambda k: _cough(3550 + k) * 0.12, 3544, (-16, -10), 0.9)
    return circular(lambda z: z, air + mur + seats + cough)


@sfx("bed_demo_house_empty", "Room bed, the demo house emptying under full house lights: the lamps' hum on F, the air handling, seats tipping up, a few far voices leaving. Seamless 20 s loop.",
     use="Ep2 act2 12.01-12.03 (ROOM_OVERRIDE in the stems).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_demo_house_empty():
    n = n_of(LOOP20)
    air = circular(lambda z: lowpass(z, 1100, 2), _hvac(n, 3560, 1400)) * 1.0
    hum = 0
    for k, a in ((1, 0.5), (2, 0.3), (3, 0.15), (4, 0.08)):
        h, _ = loop_tone(n, hz("F2") * k, LOOP20, 0.13 * k)
        hum = hum + a * h
    seats = _pevents(n, 0.5, lambda k: mix(_tap(380, 3561 + k, WOOD, 0.06, 3000, 0.2) * 0.1, thump(200, 130, 0.12, 0.004, 0.02) * 0.06), 3562, (-16, -8), 0.9)
    mur = circular(lambda z: lowpass(z, 900, 2), _murmur(n, 4, 3563, 200, 1800)) * 0.5
    return air + stereo(hum * 0.03) + seats + mur


@sfx("bed_stairwell", "Room bed, the office stairwell at night: concrete and steel, a quiet fan, a far door, everything with a hard stair echo. Seamless 20 s loop.",
     use="Ep2 act3 15.19.", cat="room", loop=True, mix_db=-32, norm="integrated")
def bed_stairwell():
    n = n_of(LOOP20)
    y = circular(lambda z: lowpass(z, 900, 2), _hvac(n, 3580, 800)) * 0.7
    door = _pevents(n, 0.1, lambda k: lowpass(thump(200, 120, 0.3, 0.006, 0.05), 900) * 0.15, 3581, (-14, -10), 0.6)
    ir = make_ir("hall")
    wet = np.stack([np.real(np.fft.ifft(np.fft.fft(y[:, c] + door[:, c]) * np.fft.fft(ir[:, c], n))) for c in range(2)], axis=1)
    return y + door + wet * 0.35


@sfx("bed_party_crowd", "Room bed, the Dec 2022 holiday party (F2.2): a warm, lively room, a bright murmur, glasses clinking, laughs coming and going, the racks humming along in the corner. Seamless 20 s loop.",
     use="Ep2 act3 15.06-15.11 (the party).", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_party_crowd():
    n = n_of(LOOP20)
    mur = _murmur(n, 28, 3600, 200, 3000, (3.5, 5.5), (0.15, 0.35), distance_lp=3200) * 2.4
    clink = _pevents(n, 1.2, lambda k: _tap(hz(("F6", "C7", "Eb6", "Ab6", "G6")[k % 5]), 3601 + k, GLASS, 0.3, 12000, 0.6) * 0.06, 3602, (-18, -8))
    laugh = _pevents(n, 0.4, lambda k: _laugh_voice(0.9, 170 + 25 * (k % 6), 3610 + k, k % 2 == 1) * 0.06, 3603, (-12, -6))
    h, _ = loop_tone(n, hz("F2"), LOOP20)
    return mur + clink + laugh + stereo(h * 0.01)


@sfx("bed_fire_night", "Room bed, the Dec 2023 offsite at night, outdoors: a bonfire's low roll and crackle, wind in the trees, cold open air. Seamless 20 s loop.",
     use="Ep2 act3 15.13, 15.15 (F2.2b).", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_fire_night():
    n = n_of(LOOP20)
    roar = np.stack([loop_noise(n, 40, 500, -4, seed=3620), loop_noise(n, 40, 500, -4, seed=3621)], axis=1) * _penv(n, 5, 3622, 0.5, 1)[:, None] * 0.8
    cr = _pevents(n, 12, lambda k: crackle(0.04, 1500, 1500, 7000, seed=3623 + k % 50) * 0.5, 3624, (-14, -2), 0.5)
    wind = np.stack([loop_noise(n, 250, 3000, -3, seed=3625), loop_noise(n, 250, 3000, -3, seed=3626)], axis=1) * _penv(n, 0.3, 3627, 0.2, 1.5)[:, None] * 0.3
    leaves = _pevents(n, 4, lambda k: crackle(0.25, 400, 3000, 9000, seed=3628 + k % 30) * 0.15, 3629, (-18, -10))
    return roar + cr + wind + leaves


def _traffic(n, seed, density, speed=1.0, stalled=False, loop=True):
    """cars passing right to left over the bridge deck (loop-safe), tyres and engines, or a stalled line idling"""
    r = rng(seed)
    out = np.zeros((n, 2))
    if stalled:
        for i in range(6):
            e = _engine(n, r.uniform(26, 34), seed + i, loop=True, rough=0.4) * r.uniform(0.3, 0.7)
            e = circular(lambda z: lowpass(z, 260, 2), e)
            out += pan(e, r.uniform(-0.8, 0.8))
        return out * 0.5
    t = 0.0
    k = 0
    while t < n / SR:
        d = r.uniform(1.6, 3.0) / speed
        m = n_of(d)
        tt = np.arange(m) / SR
        tyre = bandpass(noise(m, "pink", seed + k), 200, 3500, 2)
        eng = _engine(m, r.uniform(28, 45), seed + 100 + k, rough=0.2)
        env = np.exp(-((tt - d / 2) / (d / 4.5)) ** 2)
        car = (tyre * 0.6 + eng * 0.25) * env * r.uniform(0.4, 1.0)
        p = np.linspace(0.9, -0.9, m)
        y = pan_curve(car, p)
        _pplace(out, y, t)
        t += r.exponential(1 / density)
        k += 1
    return out


@sfx("bed_bridge_traffic", "Room bed, the Bay Bridge in the evening rush: traffic passing right to left over the deck, tyre roar and engines, wind off the water, the deck's expansion joints thumping. Seamless 20 s loop.",
     use="Ep2 act3 17.01-17.02 (and moving again on May 20, with the rain).", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_bridge_traffic():
    n = n_of(LOOP20)
    tr = _traffic(n, 3640, 2.2)
    wind = np.stack([loop_noise(n, 60, 900, -4, seed=3641), loop_noise(n, 60, 900, -4, seed=3642)], axis=1) * _penv(n, 0.25, 3643, 0.3, 1.2)[:, None] * 0.4
    joints = _pevents(n, 1.5, lambda k: lowpass(thump(120, 70, 0.2, 0.006, 0.04), 400) * 0.15, 3644, (-12, -6), 0.8)
    return tr + wind + joints


@sfx("bed_bridge_stalled", "Room bed, the Bay Bridge stalled on the receipt: a line of idling engines, a fan or a radio far off in a car, wind off the water. Seamless 20 s loop.",
     use="Ep2 act3 17.03-17.16 (ROOM_OVERRIDE in the stems: traffic has stopped on the receipt).", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_bridge_stalled():
    n = n_of(LOOP20)
    idle = _traffic(n, 3660, 0, stalled=True)
    wind = np.stack([loop_noise(n, 60, 1100, -4, seed=3661), loop_noise(n, 60, 1100, -4, seed=3662)], axis=1) * _penv(n, 0.25, 3663, 0.3, 1.2)[:, None] * 0.45
    water = np.stack([loop_noise(n, 300, 2500, -3, seed=3664), loop_noise(n, 300, 2500, -3, seed=3665)], axis=1) * _penv(n, 0.6, 3666, 0.5, 1)[:, None] * 0.08
    return idle + wind + water


@sfx("bed_bridge_night", "Room bed, the bridge at night: sparse traffic, the deck's lights humming, wind, and a foghorn far off on F (open fifth, one long call). Seamless 20 s loop.",
     pitch="F2 + C3 foghorn", use="Ep2 act3 17.14 (one 2 s hold).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_bridge_night():
    n = n_of(LOOP20)
    tr = _traffic(n, 3680, 0.35) * 0.7
    wind = np.stack([loop_noise(n, 60, 900, -4, seed=3681), loop_noise(n, 60, 900, -4, seed=3682)], axis=1) * 0.35
    m = n_of(2.4)
    tt = np.arange(m) / SR
    fh = (saw(hz("F2"), m) + 0.7 * saw(hz("C3"), m)) * _env(m, [(0, 0), (0.3, 1), (2.0, 1), (2.4, 0)])
    fh = lowpass(fh, 500, 2) * 0.12
    horn = np.zeros((n, 2))
    _pplace(horn, reverb(fh, "hall", 0.5), 0.6)
    _pplace(horn, reverb(fh, "hall", 0.5), 10.6)
    return tr + wind + horn


@sfx("bed_rain", "Room bed, rain on the bridge: steady rain on the deck and the water, drops on an umbrella close overhead. Seamless 20 s loop.",
     use="Ep2 act3 17.17-17.21 (with the moving traffic under it).", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_rain():
    n = n_of(LOOP20)
    wash = np.stack([loop_noise(n, 400, 9000, -1.5, seed=3700), loop_noise(n, 400, 9000, -1.5, seed=3701)], axis=1) * 0.35
    drops = _drops(LOOP20, 180, 3702, 2000, 7000, (0.002, 0.01), loop=True) * 0.4
    umb = _drops(LOOP20, 120, 3703, 280, 900, (0.008, 0.03), loop=True) * 0.6
    return wash + drops + umb


@sfx("bed_campus_outdoor", "Room bed, ELPPA's campus at the keynote: an outdoor crowd on a lawn, a big PA far off carrying the stage (a voice-shaped murmur, no words), open air and a breeze. Seamless 20 s loop.",
     use="Ep2 act4 19.07-19.10, 19.15; the left pane of 20.01-20.04.", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_campus_outdoor():
    n = n_of(LOOP20)
    crowd = _murmur(n, 30, 3720, 200, 2600, distance_lp=2200) * 1.8
    pa = circular(lambda z: lowpass(highpass(z, 250, 2), 2000, 2), _murmur(n, 1, 3721, 150, 2500, (4.0, 5.0), (0.2, 0.4))) * 1.4
    pa = circular(lambda z: z, pa)
    slap = np.roll(pa, n_of(0.18), axis=0) * 0.5 + np.roll(pa, n_of(0.41), axis=0) * 0.3
    breeze = np.stack([loop_noise(n, 80, 1200, -4, seed=3722), loop_noise(n, 80, 1200, -4, seed=3723)], axis=1) * _penv(n, 0.3, 3724, 0.3, 1.2)[:, None] * 0.3
    return crowd + (pa + slap) * 0.5 + breeze


@sfx("bed_camcorder_2008", "Room bed, F2.1 (2008, this company's stage): the camcorder's own audio, a hall of a few hundred people heard through a small mic, auto-gain breathing, tape hiss and a motor whine on F. Seamless 20 s loop.",
     use="Ep2 act4 19.11-19.14 (F2.1, EARLY-WEB16).", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_camcorder_2008():
    n = n_of(LOOP20)
    hall = circular(lambda z: bandpass(z, 200, 6000, 2), _murmur(n, 20, 3740, 200, 2500) * 1.5 + _hvac(n, 3741, 1500) * 0.5)
    hiss = np.stack([loop_noise(n, 3000, 9000, -1, seed=3742), loop_noise(n, 3000, 9000, -1, seed=3743)], axis=1) * 0.025
    w, _ = loop_tone(n, hz("F6"), LOOP20)
    agc = 0.75 + 0.25 * _penv(n, 1.5, 3744, 0, 1)
    return hall * agc[:, None] + hiss + stereo(w * 0.002)


@sfx("bed_garden", "Room bed, the walled garden: still air, small birds kept small, a fountain far off. Seamless 20 s loop.",
     use="Ep2 act4 19.16-19.20.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_garden():
    n = n_of(LOOP20)
    air = np.stack([loop_noise(n, 100, 2000, -4, seed=3760), loop_noise(n, 100, 2000, -4, seed=3761)], axis=1) * 0.2

    def bird(k):
        r = rng(3762 + k)
        m = n_of(r.uniform(0.08, 0.2))
        t = np.arange(m) / SR
        f0 = r.uniform(3000, 5200)
        f = f0 * (1 + 0.15 * np.sin(2 * math.pi * r.uniform(15, 30) * t))
        y = sine(f, n=m) * np.hanning(m) * 0.05
        if r.random() < 0.6:
            y = np.concatenate([y, np.zeros(n_of(0.06)), y * 0.7])
        return y
    birds = _pevents(n, 1.0, bird, 3763, (-16, -6), 0.9)
    fount = np.stack([loop_noise(n, 800, 6000, -2, seed=3764), loop_noise(n, 800, 6000, -2, seed=3765)], axis=1) * _penv(n, 8, 3766, 0.6, 1)[:, None] * 0.06
    return air + birds + circular(lambda z: lowpass(z, 3500, 2), fount)


@sfx("bed_zai_warehouse", "Room bed, the zAI lobby: high, cold and industrial, a big empty warehouse's air handling roaring softly, metal ticking as it cools, a long reverb. Seamless 20 s loop.",
     use="Ep2 act4 20.01-20.04 (the right pane).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_zai_warehouse():
    n = n_of(LOOP20)
    roar = np.stack([loop_noise(n, 40, 1500, -3.5, seed=3780), loop_noise(n, 40, 1500, -3.5, seed=3781)], axis=1) * 0.5
    h, _ = loop_tone(n, hz("Bb1"), LOOP20)
    ticks = _pevents(n, 0.6, lambda k: _tap(2500 + 300 * (k % 4), 3782 + k, STEEL, 0.1, 10000, 0.3) * 0.04, 3783, (-14, -6))
    ir = make_ir("cathedral")
    src = ticks + roar * 0.2
    wet = np.stack([np.real(np.fft.ifft(np.fft.fft(src[:, c]) * np.fft.fft(ir[:, c], n))) for c in range(2)], axis=1)
    return roar + stereo(h * 0.02) + ticks + wet * 0.4


@sfx("bed_empty_lot_wind", "Room bed, ISS's empty white lot: a faint high wind over open ground and nothing else. Seamless 20 s loop.",
     use="Ep2 act4 sc 22 (white, room tone only).", cat="room", loop=True, mix_db=-32, norm="integrated")
def bed_empty_lot_wind():
    n = n_of(LOOP20)
    hi = np.stack([loop_noise(n, 1500, 7000, -2, seed=3800), loop_noise(n, 1500, 7000, -2, seed=3801)], axis=1) * _penv(n, 0.2, 3802, 0.3, 1.3)[:, None] * 0.3
    lo = np.stack([loop_noise(n, 60, 600, -4, seed=3803), loop_noise(n, 60, 600, -4, seed=3804)], axis=1) * 0.2
    whistle, _ = loop_tone(n, hz("F6"), LOOP20)
    return hi + lo + stereo(whistle * 0.002 * _penv(n, 0.2, 3805, 0, 2))
