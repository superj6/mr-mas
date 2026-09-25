"""Episode slot (T4), skyline and title: odometer, fired piano, hourglass, hearts gliss, tower plucks, siren, ka-ching, ding."""
from __future__ import annotations

import math

import numpy as np

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant


# ============================================================================ slot
@sfx("odometer_ratchet", "Odometer slamming past 1,000,000: digit wheels ratchet up to a blur, then lock with a hard clack and a tiny counter bell (C7).",
     pitch="C7 counter bell", use="Slot 9.1 f480-494 (odometer slams past 1,000,000); lock clack at +0.52 s (~f492).",
     frames=[480], cat="slot", mix_db=-8)
def odometer_ratchet():
    dur = 1.3
    n = n_of(dur)
    r = rng(501)
    out = np.zeros((n, 2))
    t, k = 0.0, 0
    lock = 0.52
    while t < lock - 0.012:
        u = t / lock
        rate = 14 + 70 * math.sin(math.pi * min(u, 0.999) * 0.92) ** 1.2
        f0 = (3300, 4150, 2750)[k % 3] * r.uniform(0.97, 1.03)
        c = mix(click((f0, f0 * 1.52, f0 * 2.2), 0.005, 0.05, 0.35, seed=700 + k) * 0.5,
                modal_hit(f0 * 0.28, PLASTIC, 0.012, dur=0.05, seed=800 + k) * 0.35)
        place(out, pan(c, 0.3 * math.sin(k)), t, -6 + 4 * u)
        t += 1 / rate
        k += 1
    rat = I.load("Percussion/Ratchet1-Fast_v1_rr1_Sum.wav")[:n_of(lock)]
    rat = fade(rat, 0.05, 0.05) * 0.25
    slam = mix(click((1500, 2700, 4300, 6100), 0.03, 0.3, 0.4, seed=551) * 0.9, thump(hz("F3"), hz("F2"), 0.3, 0.006, 0.05) * 0.6)
    bell = modal_hit(hz("C7"), SMALLBELL, [0.9, 0.4, 0.3, 0.2, 0.15, 0.1, 0.08], dur=1.0, seed=552) * 0.12
    y = mix(out, rat, (slam, lock), (pan(bell, 0.4), lock + 0.01), n=n)
    return reverb(y, "room", 0.12)[:n]


@sfx("piano_fired_F4", "'The music is fired': one dry upright-piano F4, mezzo, no reverb - alone over room tone.",
     pitch="F4", use="Slot 9.2 f495 (every stem muted; this note + room_tone play on the unmuted bus).", frames=[495],
     cat="slot", mix_db=-6)
def piano_fired_F4():
    return I.piano("F4", 3.2, dyn=2, release=0.6)


variant("piano_fired_F4--felt", lambda: I.piano("F4", 3.2, dyn=1, felt=True, release=0.6),
        desc="Fired note, felt version: soft F4 with a felt-damped, darker tone (matches the T0 felt piano).",
        pitch="F4", use="Slot 9.2 f495 (alt).", frames=[495], cat="slot", flavor="band",
        variant_of="piano_fired_F4", mix_db=-6)


@sfx("hourglass_shatter", "Tiny hourglass shattering: bright glass crack and shards, a trickle of sand.",
     use="Slot 9.3 ~f518 (badge flips GUEST -> CEO; hourglass shatters).", frames=[518], cat="slot", mix_db=-12)
def hourglass_shatter():
    dur = 1.0
    n = n_of(dur)
    r = rng(561)
    crack = noise_burst(0.15, 2500, 14000, 0.006, seed=562) * 0.8
    out = np.zeros((n, 2))
    for i in range(40):
        t0 = r.gamma(1.5, 0.05)
        if t0 > 0.6:
            continue
        s = modal_hit(r.uniform(2800, 7500), GLASS, r.uniform(0.05, 0.25), dur=0.3, seed=900 + i)
        place(out, pan(s * r.uniform(0.05, 0.3), r.uniform(-0.8, 0.8)), t0)
    sand = highpass(noise(n, "white", 563), 3000, 2) * np.interp(np.arange(n) / SR, [0, 0.05, 0.3, 0.8], [0, 0.12, 0.08, 0])
    y = mix(decorrelate(crack, 1), out, decorrelate(sand, 2), n=n)
    return reverb(y, "room", 0.15)[:n_of(1.2)]


# ---------------------------------------------------------------------------- hearts: celesta/glock gliss
PENTA = ["F", "Ab", "Bb", "C", "Eb"]


def _gliss_notes(lo=4, hi=7):
    notes = [f"{p}{o}" for o in range(lo, hi) for p in PENTA] + [f"F{hi}"]
    return notes  # 16 notes: one per frame from f525 to f540


def heart_gliss(flavor: str):
    notes = _gliss_notes()
    step = FRAME
    dur = step * (len(notes) - 1) + 2.4
    n = n_of(dur)
    parts = []
    if flavor in ("hybrid", "band"):
        harp_ = [(I.harp(midi(nt) - 12, 1.2) * (0.35 + 0.02 * i), i * step) for i, nt in enumerate(notes)]
        parts += harp_
    if flavor == "hybrid":
        cel = I.gu("celesta", [(i * step, nt, 70 + 3 * i) for i, nt in enumerate(notes)], dur, length=0.5)
        parts.append((cel * 3.0, 0))
        top = [(I.glock(nt, 1.2) * 0.25, i * step) for i, nt in enumerate(notes) if midi(nt) >= midi("C6")]
        parts += top
        parts += [(I.chip_note(midi(nt) + 12, 0.05, "pulse", 0.125, levels=[0.6, 0.3, 0.1]) * 0.05, i * step)
                  for i, nt in enumerate(notes)]
    if flavor == "band":
        vib = I.gu("vibes", [(i * step, nt, 60 + 3 * i) for i, nt in enumerate(notes)], dur, length=0.8)
        parts.append((vib * 2.5, 0))
    if flavor == "chip":
        for i, nt in enumerate(notes):
            s = I.chip_note(nt, 0.12, "pulse", 0.25 if i % 2 else 0.125, levels=I.chip_levels(7, 0.8, 0.1))
            parts += [(s * 0.3, i * step), (s * 0.12, i * step + BEAT / 4), (s * 0.05, i * step + BEAT / 2)]
        parts.append((I.chip_note("F3", 0.6, "tri", levels=I.chip_levels(36, 1, 1 / 40)) * 0.3, 15 * step))
    body = mix(*parts, n=n)
    swell = _shimmer_swell(15 * step)
    y = mix(body, (swell, 0), n=n)
    kind = "hall" if flavor != "chip" else "room"
    return fade(reverb(y, kind, 0.3 if flavor != "chip" else 0.12)[:n], 0, 0.8)


def _shimmer_swell(dur):
    crash = I.load("VSCO 1 Percussion/varMetal/Cymbals/susp/susp_hit_softmall_p.wav")
    sw = reverse_swell_of(crash, dur) * 0.35
    return lowpass(sw, 12000)


variant("heart_gliss", lambda: heart_gliss("hybrid"), cat="slot",
        desc="Heart-avalanche glissando: celesta + glockenspiel up F minor pentatonic, one note per frame F4->F7 (lands on f540), harp underneath, a ghost of pulse wave, soft reverse-cymbal swell.",
        pitch="F4 -> F7 (F Ab Bb C Eb)", use="Slot 9.4 f525-540 (hearts carry the camera up into the dusk sky).",
        frames=[525], mix_db=-8)
variant("heart_gliss--chip", lambda: heart_gliss("chip"), cat="slot", flavor="chip", variant_of="heart_gliss",
        desc="Hearts gliss, 8-bit: alternating 12.5/25% pulse arpeggio with triple echo, triangle F3 landing.",
        pitch="F4 -> F7", use="f525-540 (alt).", frames=[525], mix_db=-10)
variant("heart_gliss--band", lambda: heart_gliss("band"), cat="slot", flavor="band", variant_of="heart_gliss",
        desc="Hearts gliss, jazz: harp + vibraphone up the pentatonic, reverse-cymbal swell.",
        pitch="F4 -> F7", use="f525-540 (alt, warmer).", frames=[525], mix_db=-8)


# ============================================================================ skyline: tower plucks (the knee)
KNEE = [("F4", 540), ("F4", 555), ("F4", 570), ("F4", 585), ("G4", 600), ("Ab4", 615), ("C5", 622)]


def _pop_air(seed):
    return mix(noise_burst(0.05, 1500, 8000, 0.004, seed=seed) * 0.25, thump(hz("F3"), hz("F2"), 0.1, 0.005, 0.02) * 0.25)


def tower_pluck(note, idx, flavor):
    r = rng(1000 + idx)
    vel = [0.8, 0.84, 0.88, 0.92, 1.0, 1.05, 1.12][idx]
    det = [0, 3, -2, 2, 0, 0, 0][idx]
    m = midi(note) + det / 100
    if flavor == "hybrid":
        y = mix(I.harp(m, 1.4) * 0.8, I.pizz(m - 24, 1.2) * 0.55,
                (I.chip_note(midi(note) + 12, 0.06, "pulse", (0.25, 0.125)[idx % 2], levels=[0.7, 0.45, 0.25, 0.1]) * 0.07, 0.0),
                _pop_air(1100 + idx))
    elif flavor == "chip":
        y = mix(I.chip_note(note, 0.3, "pulse", 0.5 if idx < 4 else 0.25, levels=I.chip_levels(18, 1.0, 1 / 16)) * 0.35,
                I.chip_note(midi(note) - 12, 0.25, "tri", levels=I.chip_levels(15, 1.0, 1 / 15)) * 0.35,
                I.chip_noise(0.02, 20000, levels=[0.6, 0.2]) * 0.2)
        y = mix(y, (y * 0.25, BEAT / 4))
    else:  # band
        vib = I.gu("vibes", [(0, int(round(m)), 85)], 1.6, length=0.6)
        y = mix(I.pizz(m - 24, 1.2) * 0.9, vib * 3.0, _pop_air(1200 + idx) * 0.6)
    y = y * vel
    return reverb(y, "room" if flavor == "chip" else "studio", 0.15)


for idx, (note, fr) in enumerate(KNEE):
    nid = f"tower_pluck_{idx + 1}_{note}"
    variant(nid, lambda note=note, idx=idx: tower_pluck(note, idx, "hybrid"), cat="skyline",
            desc=f"Knee pluck {idx + 1}/7 ({note}): harp + upright-bass pizz two octaves down, soft pop air, a whisper of pulse wave. Repeated Fs are distinct round-robins with a slight crescendo.",
            pitch=note, use=f"Skyline tower pop f{fr}.", frames=[fr], mix_db=-6)
    variant(nid + "--chip", lambda note=note, idx=idx: tower_pluck(note, idx, "chip"), cat="skyline", flavor="chip",
            variant_of=nid, desc=f"Knee pluck {idx + 1}/7 ({note}), 8-bit: pulse + triangle sub + LFSR tick, dotted echo.",
            pitch=note, use=f"f{fr} (alt).", frames=[fr], mix_db=-8)
    variant(nid + "--band", lambda note=note, idx=idx: tower_pluck(note, idx, "band"), cat="skyline", flavor="band",
            variant_of=nid, desc=f"Knee pluck {idx + 1}/7 ({note}), jazz: upright-bass pizz + vibraphone.",
            pitch=note, use=f"f{fr} (alt, jazzier).", frames=[fr], mix_db=-6)


@sfx("tower_pop", "Tower sprite pop-up (unpitched): quick airy pop, 2-frame spring overshoot ticks, a puff of dust. Pairs with any pluck.",
     use="Skyline pops f540/555/570/585/600/615/622 (with tower_pluck_*).", frames=[540, 555, 570, 585, 600, 615, 622],
     cat="skyline", mix_db=-12)
def tower_pop():
    pop = mix(noise_burst(0.06, 400, 5000, 0.006, seed=1301) * 0.7, thump(hz("F3"), hz("F2"), 0.15, 0.006, 0.03) * 0.6)
    tick1 = modal_hit(1500, WOOD, 0.02, dur=0.06, seed=1302) * 0.12
    tick2 = modal_hit(1700, WOOD, 0.02, dur=0.06, seed=1303) * 0.07
    dust = decorrelate(bandpass(noise(n_of(0.5), "pink", 1304), 800, 5000, 2) * env_exp(n_of(0.5), 0.12, 0.01) * 0.2, 3)
    y = mix(pop, (tick1, 2 * FRAME), (tick2, 3 * FRAME), (dust, 0.01))
    return reverb(y, "room", 0.12)


# ---------------------------------------------------------------------------- ELGOOG siren whoop
def siren(flavor):
    dur = 0.9
    n = n_of(dur)
    t = np.arange(n) / SR
    lo, top, end = hz("C4"), hz("F5"), hz("C5")
    f = np.where(t < 0.3, lo * (top / lo) ** (1 - (1 - t / 0.3) ** 2),
                 np.where(t < 0.48, top, top * (end / top) ** np.clip((t - 0.48) / 0.4, 0, 1)))
    env = np.interp(t, [0, 0.03, 0.5, dur], [0, 1, 0.9, 0.0])
    if flavor == "chip":
        fq = quantize_pitch_60hz(f)
        y = pulse(fq, n, 0.5) * 0.4 * env
        return mix(stereo(I.chip_polish(y)), (stereo(I.chip_polish(y)) * 0.3, BEAT / 4))
    if flavor == "band":
        rate = np.interp(t, [0, 0.14, dur], [2 ** (-7 / 12), 1.0, 1.0])
        tb = varispeed_curve(I.tbn_short("F3", 1.0, loud=True), rate)
        tp = varispeed_curve(I.harmon("F5", 1.0, loud=True, release=0.3), np.interp(t, [0, 0.2, dur], [2 ** (-5 / 12), 1, 1]))
        fall = np.interp(t, [0, 0.5, dur], [1, 1, 2 ** (-3 / 12)])
        tp = varispeed_curve(tp, fall[:len(tp)]) if len(tp) > 10 else tp
        y = mix(tb * 0.6, (tp * 0.8, 0.02), n=n)
        return fade(y, 0.005, 0.25)
    ph = np.cumsum(f) / SR
    x = np.sin(2 * math.pi * ph) * 0.6 + triangle(f, n) * 0.4 + 0.1 * np.sin(6 * math.pi * ph)
    horn = sum(resonator(x, fc, q) * g for fc, q, g in ((750, 2.5, 1.0), (1500, 3, 0.5), (2600, 4, 0.25)))
    horn = softclip(horn * 1.5 + x * 0.3, 1.3) * env
    beacon = 1 - 0.35 * (0.5 + 0.5 * np.cos(2 * math.pi * 2.0 * t))
    chip = pulse(quantize_pitch_60hz(f), n, 0.25) * env * 0.06
    y = pan_curve(horn * beacon + chip, 0.35 * np.sin(2 * math.pi * 2.0 * t))
    return y


variant("siren_whoop_F", lambda: reverb(siren("hybrid"), "hall", 0.12), cat="skyline",
        desc="CODE RED siren whoop tuned to F: rises C4 -> F5, holds, sags to C5; horn-speaker colour, 2 rev/s beacon rotation, faint pulse-wave twin.",
        pitch="C4 -> F5 -> C5", use="f555 (ELGOOG/MINDDEEP CODE RED siren).", frames=[555], mix_db=-10)
variant("siren_whoop_F--chip", lambda: reverb(siren("chip"), "room", 0.1), cat="skyline", flavor="chip",
        variant_of="siren_whoop_F", desc="Siren whoop, 8-bit: 60 Hz-stepped pulse sweep to F5 with an echo.",
        pitch="C4 -> F5", use="f555 (alt).", frames=[555], mix_db=-12)
variant("siren_whoop_F--band", lambda: reverb(siren("band"), "hall", 0.15), cat="skyline", flavor="band",
        variant_of="siren_whoop_F", desc="Siren whoop, big-band: trombone rip up to F3 with a harmon trumpet doit to F5 that sags.",
        pitch="-> F3 / F5", use="f555 (alt, jazzier).", frames=[555], mix_db=-10)


# ---------------------------------------------------------------------------- INVIDIA ka-ching
def _ka(seed=1401):
    return mix(click((1500, 2800, 4300), 0.012, 0.1, 0.3, seed=seed) * 0.6,
               (click((1900, 3300, 5200), 0.01, 0.1, 0.3, seed=seed + 1) * 0.5, 0.034),
               thump(hz("C4"), hz("C3"), 0.1, 0.005, 0.02) * 0.4)


def ka_ching(flavor):
    if flavor == "chip":
        c = I.chip_note("C6", 2 / 60, "pulse", 0.5, levels=[1, 0.8])
        f = I.chip_note("F6", 0.5, "pulse", 0.25, levels=I.chip_levels(30, 0.9, 0.03))
        y = mix(I.chip_noise(0.03, 22000, levels=[1, .5]) * 0.4, (c * 0.3, 0.03), (f * 0.3, 0.03 + 2 / 60))
        return reverb(mix(y, (y * 0.3, BEAT / 4), (y * 0.1, BEAT / 2)), "room", 0.1)
    if flavor == "band":
        rim = I.load("VSCO 1 Percussion/drums/snare/drum1/snare1_rimshot_mf.wav")[:n_of(0.3)] * 0.5
        vib = I.gu("vibes", [(0.0, "F6", 100), (0.0, "C7", 90)], 2.0, length=1.2)
        tri = I.load("Percussion/Triangle6-Hit_v1_rr1_Sum.wav") * 0.3
        return reverb(mix(fade(rim, 0, 0.1), (vib * 2.5, 0.05), (tri, 0.05)), "studio", 0.15)
    ching = mix(pan(modal_hit(hz("F6"), SMALLBELL, [1.6, 0.8, 0.5, 0.35, 0.25, 0.2, 0.15], dur=1.8, seed=1411) * 0.4, -0.2),
                pan(modal_hit(hz("C7"), SMALLBELL, [1.2, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1], dur=1.8, seed=1412) * 0.28, 0.25))
    tri = highpass(I.load("Percussion/Triangle6-Hit_v1_rr1_Sum.wav"), 3000) * 0.25
    coins = grains(0.25, [5200, 6100, 7300, 8800], 14, (0.004, 0.015), seed=1413) * 0.25
    y = mix(_ka(), (ching, 0.055), (tri, 0.055), (coins, 0.06))
    return reverb(y, "studio", 0.15)


variant("ka_ching", lambda: ka_ching("hybrid"), cat="skyline",
        desc="Tasteful ka-ching: two-stage drawer latch, then a small tuned bell pair (F6 + C7, no third), triangle shimmer and a few coin glints.",
        pitch="F6 + C7", use="f585 (INVIDIA: GPUs tossed to every roof). 'ching' at +0.055 s.", frames=[585], mix_db=-10)
variant("ka_ching--chip", lambda: ka_ching("chip"), cat="skyline", flavor="chip", variant_of="ka_ching",
        desc="Ka-ching, 8-bit: LFSR latch, pulse C6 -> F6 with dotted echo.", pitch="C6 -> F6", use="f585 (alt).",
        frames=[585], mix_db=-12)
variant("ka_ching--band", lambda: ka_ching("band"), cat="skyline", flavor="band", variant_of="ka_ching",
        desc="Ka-ching, jazz: rimshot + vibraphone F6/C7 dyad + triangle.", pitch="F6 + C7", use="f585 (alt).",
        frames=[585], mix_db=-10)


# ---------------------------------------------------------------------------- PEEKDEEP plop, ATEM drip/clack
@sfx("plop_water", "Small water plop tuned to Ab5 (bubble chirp) with a splash and two trailing droplets.",
     pitch="Ab5 chirp", use="f615 (PEEKDEEP: whale water tower / moat, with pluck Ab).", frames=[615], cat="skyline", mix_db=-12)
def plop_water():
    def chirp(f_end, dur, a):
        n = n_of(dur)
        t = np.arange(n) / SR
        f = f_end * (0.62 + 0.38 * (1 - np.exp(-t / 0.012)))
        return np.sin(2 * math.pi * np.cumsum(f) / SR) * env_exp(n, 0.035, 0.001) * a
    splash = noise_burst(0.1, 500, 4000, 0.015, seed=1501) * 0.25
    y = mix(chirp(hz("Ab5"), 0.2, 0.6), splash, (chirp(hz("C6"), 0.12, 0.2), 0.09), (chirp(hz("F6"), 0.1, 0.12), 0.16))
    return reverb(y, "room", 0.2)


@sfx("drip_clack", "Fresh paint letters: a plastic sign-letter clack then a slow, wet paint drip plop (F4).",
     pitch="F4 drip", use="f570 (ATEM: 'AI' letters drip over METAVERSE). Clack on the frame, drip +0.2 s.", frames=[570],
     cat="skyline", mix_db=-12)
def drip_clack():
    clack = mix(modal_hit(1450, PLASTIC, 0.03, dur=0.12, seed=1601) * 0.7, click((2600, 4300), 0.008, 0.06, 0.4, seed=1602) * 0.4)
    n = n_of(0.3)
    t = np.arange(n) / SR
    f = hz("F4") * (0.8 + 0.2 * (1 - np.exp(-t / 0.01)))
    drip = lowpass(np.sin(2 * math.pi * np.cumsum(f) / SR) * env_exp(n, 0.06, 0.004), 2500) * 0.4
    wet = noise_burst(0.15, 300, 2500, 0.02, seed=1603) * 0.15
    return reverb(mix(clack, (drip, 0.2), (wet, 0.2)), "room", 0.15)


# ============================================================================ title: the ding
def bell_ding(flavor):
    if flavor == "chip":
        s = I.chip_note("F6", 0.35, "pulse", 0.125, levels=I.chip_levels(21, 0.9, 0.04))
        t = I.chip_note("F6", 0.35, "tri", levels=I.chip_levels(21, 0.8, 0.035))
        y = mix(s * 0.3, t * 0.3)
        return reverb(mix(y, (y * 0.35, BEAT / 4), (y * 0.15, BEAT / 2), (y * 0.06, 3 * BEAT / 4)), "room", 0.12)
    if flavor == "band":
        vib = I.gu("vibes", [(0, "F6", 100)], 3.0, length=2.0) * 2.5
        pno = I.piano("F6", 2.5, dyn=1, release=0.8) * 0.5
        tri = highpass(I.load("Percussion/Triangle6-Hit_v1_rr1_Sum.wav"), 2500) * 0.15
        return reverb(mix(vib, pno, tri), "hall", 0.15)
    bell = modal_hit(hz("F6"), SMALLBELL, [2.8, 1.2, 0.8, 0.5, 0.35, 0.25, 0.15],
                     amps=[1.0, 0.25, 0.3, 0.12, 0.1, 0.05, 0.03], dur=3.0, bright=10000, seed=1701)
    gl = I.glock("F6", 2.5)
    cel = I.gu("celesta", [(0, "F6", 90)], 2.5, length=1.5)
    tri = I.chip_note("F6", 0.06, "tri", levels=[0.7, 0.5, 0.3, 0.1]) * 0.05
    y = mix(bell * 0.45, gl * 0.35, cel * 1.2, tri)
    return reverb(y, "hall", 0.14)


variant("bell_ding_F6", lambda: bell_ding("hybrid"), cat="title",
        desc="Post-notification ding, F6: a small struck bell (no third in its partials) + glockenspiel + celesta, a hair of NES triangle.",
        pitch="F6", use="f705 (post notification; loop point).", frames=[705], mix_db=-8)
variant("bell_ding_F6--chip", lambda: bell_ding("chip"), cat="title", flavor="chip", variant_of="bell_ding_F6",
        desc="Ding F6, 8-bit: 12.5% pulse + triangle with a dotted 3-tap echo.", pitch="F6", use="f705 (alt).",
        frames=[705], mix_db=-10)
variant("bell_ding_F6--band", lambda: bell_ding("band"), cat="title", flavor="band", variant_of="bell_ding_F6",
        desc="Ding F6, jazz: vibraphone + soft upright-piano F6 + triangle.", pitch="F6", use="f705 (alt, warmer).",
        frames=[705], mix_db=-8)
