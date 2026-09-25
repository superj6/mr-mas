"""2015 founding dinner (T3): shutter, freeze hits, keycaps, flame, klaxon, vault, paper, rocket, landing, stamp, neon."""
from __future__ import annotations

import math

import numpy as np
from scipy import signal

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant


# ---------------------------------------------------------------------------- camera shutter (freeze card)
@sfx("camera_shutter", "Freeze-card camera shutter: mirror slap, two curtain ticks, mirror return with a tiny bounce. Mechanical, expensive-sounding.",
     use="Card freezes f240 / f300 / f360 / f420 (layer with freeze_hit_*).", frames=[240, 300, 360, 420],
     cat="dinner", mix_db=-6)
def camera_shutter():
    dur = 0.45
    y = mix(
        click((1850, 3350, 5900, 8700), 0.028, 0.3, 0.3, seed=201) * 0.8,
        thump(hz("C4"), hz("F3"), 0.3, 0.006, 0.03) * 0.45,
        (click((4200, 6900, 9800), 0.006, 0.1, 0.5, seed=202) * 0.45, 0.024),
        (click((4600, 7300, 10400), 0.005, 0.1, 0.5, seed=203) * 0.40, 0.047),
        (click((1650, 3050, 5400, 8100), 0.022, 0.3, 0.3, seed=204) * 0.6, 0.095),
        (thump(hz("C4"), hz("F3"), 0.2, 0.006, 0.025) * 0.3, 0.095),
        (click((2600, 4700), 0.006, 0.05, 0.2, seed=205) * 0.15, 0.112),
        (click((2800, 5000), 0.005, 0.05, 0.2, seed=206) * 0.08, 0.121),
        n=n_of(dur))
    return reverb(y, "room", 0.12)


# ---------------------------------------------------------------------------- freeze-card hit layer
ROOTS = {"F": "F", "Db": "Db", "Bb": "Bb", "C": "C"}


def freeze_hit(root: str, seed: int):
    dur = 2.4
    n = n_of(dur)
    sub_note = midi(root + "1") if root in ("F", "Bb") else midi(root + "2")
    if root == "Bb":
        sub_note = midi("Bb1")
    crack = noise_burst(0.2, 1800, 12000, 0.012, seed=seed) * 0.9
    crunch = I.chip_noise(0.05, 18000, levels=[1.0, 0.6, 0.3]) * 0.25
    sub = thump(hz(sub_note) * 2.0, hz(sub_note), 1.2, 0.035, 0.35) * 1.0
    ice_f = hz(midi(root + "6"))
    ice = mix(pan(modal_hit(ice_f, GLASS, 1.8, dur=2.0, seed=seed + 1, detune=0.003) * 0.35, -0.35),
              pan(modal_hit(ice_f * 1.5, GLASS, 1.4, dur=2.0, seed=seed + 2, detune=0.003) * 0.22, 0.4),
              pan(modal_hit(ice_f * 2, GLASS, 1.0, dur=2.0, seed=seed + 3) * 0.12, 0.1))
    frz = freeze_texture(ice, 1.8, 0.05, 160, seed=seed + 4, region=(0.02, 0.12)) * 0.9
    frz = mono(frz)
    frz = decorrelate(frz * np.interp(np.arange(len(frz)) / SR, [0, 0.1, 1.8], [0, 1, 0]), seed)
    y = mix(decorrelate(crack, seed + 5), crunch, sub, ice, (frz, 0.03), n=n)
    return fade(reverb(y, "hall", 0.18, hp=300), 0, 0.6)[:n]


def freeze_hit_chip(root: str, seed: int):
    r = root + "4"
    n5 = midi(r) + 7
    parts = [I.chip_noise(0.35, 11000, levels=I.chip_levels(21, 1.0, 1 / 21)) * 0.5,
             I.chip_note(midi(root + "2"), 0.3, "tri", levels=I.chip_levels(18, 1, 1 / 18), sweep=(12, 0.05)) * 0.8]
    for i, m in enumerate([midi(r) + 12, n5 + 12, midi(r) + 24]):
        parts.append((I.chip_note(m, 0.18, "pulse", 0.25, levels=I.chip_levels(11, 0.8, 0.07)) * 0.22, i * 3 / 60))
    y = mix(*parts)
    delay = mix(y, (y * 0.35, 0.125), (y * 0.12, 0.25))
    return reverb(I.chip_polish(delay), "room", 0.1)


for root, fr, seed in (("F", 240, 211), ("Db", 300, 221), ("Bb", 360, 231), ("C", 420, 241)):
    variant(f"freeze_hit_{root}", lambda root=root, seed=seed: freeze_hit(root, seed), cat="dinner",
            desc=f"Freeze-card hit layer on {root}: glass crack + 8-bit crunch, tuned sub drop, 'time stops' frozen ice shimmer ({root} and fifth).",
            pitch=f"{root} (sub + {root}6 ice)", use=f"f{fr} card freeze (sweetens the music's {root} hit).",
            frames=[fr], mix_db=-6)
    variant(f"freeze_hit_{root}--chip", lambda root=root, seed=seed: freeze_hit_chip(root, seed), cat="dinner",
            desc=f"Freeze hit {root}, 8-bit: LFSR crash, triangle drop, pulse root-5th-octave flash with echo.",
            pitch=root, use=f"f{fr} (alt).", frames=[fr], flavor="chip", variant_of=f"freeze_hit_{root}", mix_db=-8)


# ---------------------------------------------------------------------------- Gerg: keycaps
def _keycap_pop(seed, note_hz):
    r = rng(seed)
    dur = 0.12
    snap = click((note_hz * 2.9, note_hz * 4.3, note_hz * 6.1), 0.008, dur, 0.4, seed=seed) * 0.7
    pok = modal_hit(note_hz, PLASTIC, 0.03, dur=dur, bright=7000, seed=seed + 1) * 0.6
    return fade(mix(snap, pok) * r.uniform(0.5, 1.0), 0, 0.02)


@sfx("keycap_popcorn", "Gerg's keycaps popping like popcorn: plastic snaps with hollow tuned 'poks' (F minor, high), accelerating then thinning.",
     pitch="F minor pentatonic poks (F5-C7)", use="f225-239 (Gerg types so fast the keycaps pop) and into the f240 freeze.",
     frames=[225], cat="dinner", mix_db=-10)
def keycap_popcorn():
    dur = 1.4
    n = n_of(dur)
    r = rng(251)
    notes = [hz(x) for x in ("F5", "Ab5", "Bb5", "C6", "Eb6", "F6", "Ab6", "C7")]
    out = np.zeros((n, 2))
    t = 0.0
    i = 0
    while t < 1.2:
        rate = 6 + 34 * math.sin(math.pi * min(1, t / 1.2)) ** 1.5
        t += r.exponential(1 / rate)
        p = _keycap_pop(300 + i, notes[r.integers(len(notes))])
        place(out, pan(p, r.uniform(-0.8, 0.8)), t, r.uniform(-8, 0))
        i += 1
    return reverb(out, "room", 0.15)


@sfx("keyboard_roll", "Mechanical-keyboard snare roll: clicky switches in 32nds accelerating to 64ths, crescendo; the file END lands on the downbeat.",
     use="f225-239, ending on the f240 GERG freeze (anchor = end).", frames=[240], cat="dinner", mix_db=-8, anchor="end")
def keyboard_roll():
    dur = BEAT
    n = n_of(dur)
    out = np.zeros((n, 2))
    r = rng(261)
    t = 0.0
    k = 0
    while t < dur - 0.012:
        step = (BEAT / 8) if t < dur * 0.5 else (BEAT / 16)
        g = -14 + 14 * (t / dur)
        jack = click((3900 * r.uniform(0.95, 1.05), 5800, 8200), 0.006, 0.08, 0.5, seed=400 + k) * 0.5
        body = modal_hit(r.uniform(700, 900), PLASTIC, 0.025, dur=0.08, seed=500 + k) * 0.5
        th = thump(300, 180, 0.08, 0.004, 0.012) * 0.4
        place(out, pan(mix(jack, body, th), r.uniform(-0.3, 0.3)), t + r.normal(0, 0.002), g)
        t += step
        k += 1
    return fade(reverb(out, "room", 0.12)[:n], 0.0, 0.003)


# ---------------------------------------------------------------------------- Alyi: flame
@sfx("flame_whoomph", "Effigy ignition: a warm 'whoomph' (pressure swell + rising band), rolling flame body and sparse crackle.",
     use="f285 (paperclip-robot effigy ignites in the server cathedral).", frames=[285], cat="dinner", mix_db=-8)
def flame_whoomph():
    dur = 2.4
    n = n_of(dur)
    t = np.arange(n) / SR
    x = noise(n, "pink", 271)
    fc = np.interp(t, [0, 0.12, 0.35, 1.0, dur], [160, 700, 450, 320, 280])
    whoo = sweep_filter(x, fc, 1.1, "band") * np.interp(t, [0, 0.07, 0.3, 0.9, dur], [0, 1, 0.55, 0.25, 0.0])
    press = sine(np.interp(t, [0, 0.3], [45, 70]), n=n) * np.interp(t, [0, 0.06, 0.4], [0, 1, 0]) * 0.6
    turb = lowpass(noise(n, "brown", 272), 900, 2)
    am = 1 + 0.6 * lowpass(noise(n, "white", 273), 14, 1) * 30
    body = turb * np.clip(am, 0.1, 3) * np.interp(t, [0, 0.1, 0.4, dur], [0, 0.35, 0.3, 0.05])
    crk = crackle(dur, 40, 1200, 6500, seed=274, decay=1.0) * 0.6
    y = mix(decorrelate(whoo, 1), press, decorrelate(body, 2), decorrelate(crk, 3))
    return fade(reverb(y, "hall", 0.18), 0, 0.5)[:n_of(2.6)]


# ---------------------------------------------------------------------------- Mario's vault: klaxon, steam, chime
KLAX = ("Bb4", "F4")


def _horn(note, dur, seed):
    n = n_of(dur)
    t = np.arange(n) / SR
    f = hz(note) * (1 + 0.012 * np.exp(-t / 0.03))
    x = saw(f, n) * 0.6 + pulse(f, n, 0.3) * 0.4
    y = sum(resonator(x, fc, q) * g for fc, q, g in ((820, 5, 1.0), (1650, 6, 0.6), (2650, 7, 0.35)))
    y = softclip(y * 1.6, 1.3)
    y = lowpass(y, 5200, 2)          # keep it a horn, not a buzzer
    y = y * (1 + 0.08 * np.sin(2 * math.pi * 31 * t))
    e = np.interp(t, [0, 0.015, 0.06, dur - 0.006, dur], [0, 1, 0.85, 0.8, 0])
    relay = click((1300, 2600, 4100), 0.01, 0.05, 0.3, seed=seed) * 0.3
    return mix(y * e, relay)


def klaxon_pattern(tones, flavor):
    step = BEAT / 2
    parts = []
    for i, nt in enumerate(tones):
        if flavor == "hybrid":
            s = mix(_horn(nt, step, 280 + i) * 0.7, I.harmon(nt, step, release=0.02) * 0.45)
        elif flavor == "chip":
            s = I.chip_note(nt, step, "pulse", 0.25, levels=[1.0] * int(step * 60 - 1) + [0.3], vib=18, vib_rate=11) * 0.5
        else:  # band: two harmon trumpets + a trombone an octave down, with a harmon 'wah'
            a = I.harmon(nt, step, release=0.02)
            b = I.harmon(nt, step, release=0.02)
            b = np.concatenate([np.zeros((n_of(0.008), 2)), b])[:len(a)]
            tb = I.tbn_short(midi(nt) - 12, step)
            s = mix(pan(a, -0.3), pan(b * 0.8, 0.3), tb * 0.5)
            nn = len(s)
            wah = 1400 + 900 * np.sin(np.linspace(0, math.pi, nn))
            s = mix(s * 0.5, stereo(sweep_filter(mono(s), wah, 2.0, "band")) * 0.9)
        parts.append((s, i * step))
    return mix(*parts, n=n_of(step * len(tones)))


@sfx("klaxon", "Vault klaxon, two tones on eighths (Bb4 -> F4), cut dead at the end: electromechanical horn blended with harmon-muted trumpet. Tasteful, tuned to the Bbm hit.",
     pitch="Bb4 / F4", use="f345-359, cut dead at f360 (MARIO hit). File is exactly 1 beat.", frames=[345], cat="dinner",
     mix_db=-10)
def klaxon():
    y = klaxon_pattern(KLAX, "hybrid")
    return reverb(y, "room", 0.12, tail=0.0)[:n_of(BEAT)]


variant("klaxon--chip", lambda: reverb(I.chip_polish(klaxon_pattern(KLAX, "chip")), "room", 0.1, tail=0.0)[:n_of(BEAT)],
        desc="Klaxon, 8-bit: two-tone 25% pulse with fast vibrato; cut dead.", pitch="Bb4 / F4",
        use="f345-359 (alt).", frames=[345], cat="dinner", flavor="chip", variant_of="klaxon", mix_db=-12)
variant("klaxon--band", lambda: reverb(klaxon_pattern(KLAX, "band"), "room", 0.14, tail=0.0)[:n_of(BEAT)],
        desc="Klaxon, big-band: harmon trumpets + trombone playing the two-tone with a wah; cut dead.",
        pitch="Bb4 / F4", use="f345-359 (alt, jazzier).", frames=[345], cat="dinner", flavor="band",
        variant_of="klaxon", mix_db=-10)
variant("klaxon_loop", lambda: wrap_tail(reverb(klaxon_pattern(KLAX * 4, "hybrid"), "room", 0.12), n_of(4 * BEAT)),
        desc="Klaxon one-bar loop (8 eighths) for longer alarms; loops on the bar.", pitch="Bb4 / F4",
        use="Show: any vault/alarm scene (96 BPM grid).", cat="dinner", loop=True, mix_db=-14, norm="integrated")


@sfx("steam_hiss", "Vault steam vent: pressurized hiss burst that settles, faint pipe whistle on F7.",
     pitch="F7 whistle (faint)", use="f345 (blast door opens: steam).", frames=[345], cat="dinner", mix_db=-12)
def steam_hiss():
    dur = 1.4
    n = n_of(dur)
    t = np.arange(n) / SR
    h = bandpass(noise(n, "white", 291), 1800, 12000, 2)
    e = np.interp(t, [0, 0.02, 0.3, dur], [0, 1, 0.5, 0]) ** 1.3
    wh = sine(hz("F7") * (1 + 0.004 * np.sin(2 * math.pi * 5 * t)), n=n) * 0.02 * e
    return fade(reverb(decorrelate(h * e + wh, 7), "room", 0.15), 0, 0.2)


@sfx("vault_chime_triple", "Safety HUD triple chime (three checkmarks): small glass-bell F6 Ab6 C7 in 32nds.",
     pitch="F6 Ab6 C7", use="f345-359 (RED-TEAMED ✓✓✓).", frames=[347], cat="dinner", mix_db=-12)
def vault_chime_triple():
    parts = []
    for i, nt in enumerate(("F6", "Ab6", "C7")):
        b = modal_hit(hz(nt), SMALLBELL, [1.2, 0.5, 0.4, 0.25, 0.2, 0.15, 0.1], dur=1.4, bright=9000, seed=300 + i)
        parts.append((pan(b * 0.4, -0.3 + 0.3 * i), i * BEAT / 8))
    return reverb(mix(*parts), "room", 0.2)


# ---------------------------------------------------------------------------- paper
@sfx("paper_flutter", "A single sheet fluttering out of the vault: irregular paper flaps, crinkle, airy travel L->R.",
     use="f345-359 ('DRAFT - DO NOT PUBLISH' sheet flutters out); any paper float.", frames=[350], cat="dinner", mix_db=-10)
def paper_flutter():
    dur = 1.3
    n = n_of(dur)
    r = rng(311)
    out = np.zeros(n)
    t = 0.0
    while t < dur - 0.1:
        L = r.uniform(0.008, 0.04)
        m = n_of(L)
        lo = r.uniform(600, 1800)
        seg = bandpass(noise(m + 64, "white", int(t * 1000)), lo, lo * r.uniform(3, 6), 2)[64:] * np.hanning(m)
        if r.random() < 0.35:
            seg = seg + lowpass(noise(m, "pink", int(t * 999)), 450, 2) * np.hanning(m) * 1.5
        s = n_of(t)
        out[s:s + m] += seg * r.uniform(0.3, 1.0)
        t += r.uniform(0.05, 0.12)
    crk = crackle(dur, 30, 3500, 10000, seed=312) * 0.3
    air = whoosh(dur, 400, 1400, 0.8, 0.4, seed=313) * 0.3
    y = out + crk + air
    tt = np.arange(n) / SR
    y *= np.interp(tt, [0, 0.05, dur * 0.7, dur], [0, 1, 0.7, 0])
    return reverb(pan_curve(y, np.interp(tt, [0, dur], [-0.5, 0.6])), "room", 0.15)


@sfx("paper_whip", "Paper-scroll whip-past wipe (4 frames): a fast taut paper swish.",
     use="f401-404 (scroll whips past lens as a paper wipe).", frames=[401], cat="dinner", mix_db=-10)
def paper_whip():
    w = whoosh(0.3, 900, 6000, 1.4, 0.45, seed=321, color="white")
    fl = crackle(0.3, 180, 1500, 8000, seed=322) * np.hanning(n_of(0.3)) * 0.5
    y = pan_curve(w + fl, np.linspace(-0.9, 0.9, n_of(0.3)))
    return reverb(y, "room", 0.1)


# ---------------------------------------------------------------------------- Nole: ceiling, rocket, landing, stamp
@sfx("ceiling_burst", "Ceiling tiles burst: crack, tile crunch, debris raining onto the table, dust. Keeps its low end short so the f420 hit owns the boom.",
     use="f405 (SPACEZ booster bursts through the ceiling).", frames=[405], cat="dinner", mix_db=-6)
def ceiling_burst():
    dur = 1.6
    n = n_of(dur)
    r = rng(331)
    crack = decorrelate(noise_burst(0.4, 300, 9000, 0.03, seed=332), 1) * 0.9
    boom = thump(hz("C3"), hz("C2"), 0.5, 0.02, 0.08) * 0.6
    crunch = grains(0.12, [900, 1300, 2100, 3100], 60, (0.002, 0.008), seed=333) * 0.6
    deb = np.zeros((n, 2))
    for i in range(70):
        t0 = 0.08 + r.gamma(2.0, 0.12)
        if t0 > dur - 0.2:
            continue
        f0 = r.uniform(350, 2600)
        h = modal_hit(f0, WOOD if r.random() < 0.6 else PLASTIC, r.uniform(0.02, 0.06), dur=0.12, seed=600 + i)
        place(deb, pan(h * r.uniform(0.1, 0.5), r.uniform(-0.9, 0.9)), t0)
    dust = decorrelate(highpass(noise(n, "pink", 334), 1200, 2) * env_exp(n, 0.5) * 0.15, 3)
    y = mix(crack, boom, decorrelate(mono(crunch), 4), deb, dust, n=n)
    return reverb(y, "room", 0.18)[:n_of(1.9)]


def _rocket(dur, seed, fade_in=0.08, cut=True):
    n = n_of(dur)
    t = np.arange(n) / SR
    rumble = lowpass(noise(n, "brown", seed), 160, 2) * 1.2
    subf = np.interp(t, [0, dur], [34, 44])
    sub = sine(subf, n=n) * 0.35
    roar_src = noise(n, "pink", seed + 1)
    fc = np.interp(t, [0, dur], [1600, 700])
    roar = sweep_filter(roar_src, fc, 0.6, "band") * 1.2
    spikes = np.clip(lowpass(noise(n, "white", seed + 2), 60, 1) * 25, 0, None)
    crackle_am = 0.6 + np.minimum(spikes, 2.5)
    roar *= crackle_am
    hiss = highpass(noise(n, "white", seed + 3), 4500, 2) * 0.25
    y = softclip(rumble + sub + roar + hiss, 1.4)
    grow = np.interp(t, [0, fade_in, dur], [0, 0.6, 1.0]) if cut else np.interp(t, [0, fade_in, dur * 0.7, dur], [0, 0.8, 1, 0])
    return decorrelate(y * grow, seed)


@sfx("rocket_roar", "Booster descent roar, exactly 1 beat, growing and cut dead on the last sample so the f420 hit carries the boom.",
     use="f405-419 (ends at f419; the boom folds into the f420 NOLE hit).", frames=[405], cat="dinner", mix_db=-6)
def rocket_roar():
    y = _rocket(BEAT, 341)
    return fade(y, 0.0, 0.004)


variant("rocket_roar_long", lambda: fade(_rocket(3.2, 351, 0.6, cut=False), 0, 0.3),
        desc="Long rocket roar (3.2 s) with swell and release for show use (SPACEZ launches/landings).",
        use="Show: any booster shot.", cat="dinner", mix_db=-10)


@sfx("landing_thunk", "Booster touchdown on the tablecloth: heavy thunk tuned to C, hydraulic leg 'chunk', glassware and cutlery rattle, bread-basket crunch.",
     pitch="C2 body / C3 table", use="f420 (landing legs hit the table; NOLE freeze on C major).", frames=[420], cat="dinner", mix_db=-6)
def landing_thunk():
    dur = 1.4
    r = rng(361)
    body = thump(hz("C3") * 1.6, hz("C2"), 0.9, 0.03, 0.22)
    table = modal_hit(hz("C3"), WOOD, [0.25, 0.15, 0.1, 0.06, 0.04], dur=0.8, bright=4000, seed=362) * 0.6
    hyd = noise_burst(0.3, 900, 4500, 0.05, seed=363) * 0.4
    clank = modal_hit(hz("C4") * 1.02, STEEL, 0.25, dur=0.6, seed=364) * 0.25
    rattle = []
    for i in range(10):
        f0 = r.uniform(2500, 5200)
        rattle.append((pan(modal_hit(f0, GLASS, 0.3, dur=0.4, seed=370 + i) * r.uniform(0.04, 0.12), r.uniform(-0.8, 0.8)),
                       r.uniform(0.03, 0.4)))
    for i in range(6):
        rattle.append((pan(click((r.uniform(3000, 6000), 7800), 0.01, 0.05, 0.2, seed=390 + i) * 0.08,
                           r.uniform(-0.7, 0.7)), r.uniform(0.02, 0.3)))
    crunch = decorrelate(mono(grains(0.15, [700, 1100, 1700, 2600], 50, (0.002, 0.01), seed=365)), 2) * 0.5
    y = mix(body, table, hyd, (clank, 0.005), *rattle, (crunch, 0.01))
    return reverb(y, "room", 0.2)[:n_of(dur)]


def _stamp_slap(seed=401):
    slap = noise_burst(0.08, 300, 3500, 0.006, seed=seed) * 0.9
    paper = noise_burst(0.12, 1500, 7000, 0.02, seed=seed + 1) * 0.3
    knock = modal_hit(hz("C3"), WOOD, [0.18, 0.1, 0.06, 0.04, 0.03], dur=0.6, bright=3500, seed=seed + 2) * 0.7
    body = thump(hz("C3") * 1.5, hz("C2"), 0.6, 0.012, 0.12) * 0.8
    return mix(slap, paper, knock, body)


@sfx("rubber_stamp_C", "Rubber stamp tuned to C: rubber-on-paper slap, wooden-handle knock on C3, C2 body, a soft timpani C under it.",
     pitch="C (C2/C3)", use="f435 ('SUED OVER IT.' stamp slams over Nole's card).", frames=[435], cat="dinner", mix_db=-6)
def rubber_stamp_C():
    y = mix(_stamp_slap(), I.timpani("C2", 1.2, soft=True) * 0.35)
    return reverb(y, "room", 0.15)


variant("rubber_stamp_C--chip", lambda: reverb(mix(
    I.chip_noise(0.06, 9000, levels=[1, .6, .3, .1]) * 0.5,
    I.chip_note("C2", 0.3, "tri", levels=I.chip_levels(18, 1, 1 / 18), sweep=(12, 0.04)) * 0.8,
    I.chip_note("C4", 0.08, "pulse", 0.5, levels=[1, .7, .4, .2, .1]) * 0.2), "room", 0.12),
    desc="Rubber stamp C, 8-bit: LFSR slap + triangle C2 drop + pulse C4 tick.", pitch="C",
    use="f435 (alt).", frames=[435], cat="dinner", flavor="chip", variant_of="rubber_stamp_C", mix_db=-8)
variant("rubber_stamp_C--band", lambda: reverb(mix(
    _stamp_slap() * 0.8, I.timpani("C2", 1.5) * 0.7, I.upright1("C2", 0.9, "f", 0.2) * 0.5,
    I.upright1("C3", 0.9, "f", 0.2) * 0.35), "hall", 0.12),
    desc="Rubber stamp C, orchestral: stamp slap + timpani C2 + low upright-piano C octave.", pitch="C",
    use="f435 (alt, heavier).", frames=[435], cat="dinner", flavor="band", variant_of="rubber_stamp_C", mix_db=-6)


# ---------------------------------------------------------------------------- neon
def _neon_buzz(n, loop_s, seed, level=1.0):
    y = np.zeros(n)
    for k, a in [(1, 0.5), (2, 0.5), (3, 0.3), (4, 0.3), (5, 0.18), (6, 0.12), (8, 0.08), (10, 0.05), (12, 0.04)]:
        h, _ = loop_tone(n, hz("F2") * k, loop_s, 0.07 * k)
        y += a * h
    y = softclip(y * 0.8, 2.5)
    y = circular(lambda z: bandpass(z, 120, 6000, 1), y)
    fl = 1 + 0.08 * loop_lfo(n, 7) + 0.04 * loop_lfo(n, 13, 0.3)
    return y * fl * level


@sfx("neon_buzz", "Neon sign buzz tuned to F (87.3 Hz transformer + harmonics), faint ionization crackle. Seamless 3-s-ish loop.",
     pitch="F2 buzz", use="f465-474 (OPEN AI neon, then NOPE AI); the sign stays lit into f480.", frames=[465], cat="dinner",
     loop=True, mix_db=-18, norm="integrated")
def neon_buzz():
    L = 4 * 4 * BEAT / 4 * 1.2  # 3.0 s
    n = n_of(L)
    b = _neon_buzz(n, L, 411)
    hiss = loop_noise(n, 3000, 12000, -2, seed=412) * 0.05
    return np.stack([b + hiss, b * 0.95 + loop_noise(n, 3000, 12000, -2, seed=413) * 0.05], axis=1) * 0.6


@sfx("neon_ignite", "Neon tube striking on: starter ticks, two stuttering flickers, then the buzz catches with a small glass ring (F6).",
     pitch="F2 buzz, F6 ring", use="f474 ('AI' lights, stays lit).", frames=[474], cat="dinner", mix_db=-12)
def neon_ignite():
    dur = 1.2
    n = n_of(dur)
    t = np.arange(n) / SR
    b = _neon_buzz(n, dur, 421)
    gate = np.zeros(n)
    for a, e in ((0.04, 0.07), (0.13, 0.15), (0.22, dur)):
        gate[(t >= a) & (t < e)] = 1
    gate = lowpass(gate, 300, 1)
    y = b * gate * np.interp(t, [0, 0.22, 0.4, dur], [1, 1, 0.8, 0.6])
    ticks = mix(*[(click((2400, 4100, 6300), 0.006, 0.04, 0.4, seed=430 + i) * 0.3, t0)
                  for i, t0 in enumerate((0.0, 0.035, 0.125, 0.215))])
    ring = modal_hit(hz("F6"), GLASS, 0.9, dur=1.0, seed=425) * 0.08
    out = mix(stereo(y * 0.6), ticks, (ring, 0.22), n=n)
    return fade(reverb(out, "room", 0.12)[:n], 0, 0.3)


@sfx("letter_clunk", "Heavy sign letter slotting home: steel clunk tuned near F3, glass-tube tick, bracket rattle.",
     pitch="F3 steel", use="f473 (Mas slides the neon N to the front: OPEN -> NOPE). Clunk transient at +0.18 s (place file at f468.7).",
     frames=[473], cat="dinner", mix_db=-8, anchor="hit", sync=0.18)
def letter_clunk():
    dur = 0.9
    steel = modal_hit(hz("F3"), STEEL, 0.35, dur=0.8, bright=5000, seed=441) * 0.6
    th = thump(hz("F3"), hz("F2"), 0.4, 0.008, 0.06) * 0.7
    slide = whoosh(0.18, 1500, 3500, 1.4, 0.8, seed=442, color="white") * 0.2
    tube = modal_hit(hz("C7"), GLASS, 0.25, dur=0.4, seed=443) * 0.08
    rat = mix(*[(click((1800 + 300 * i, 3700), 0.015, 0.06, 0.2, seed=450 + i) * 0.1, 0.03 + 0.02 * i) for i in range(4)])
    y = mix(slide, (steel, 0.18), (th, 0.18), (tube, 0.19), (rat, 0.18))
    return reverb(y, "room", 0.15)[:n_of(dur + 0.2)]
