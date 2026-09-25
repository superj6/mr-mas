"""Cold open (T0), GLYPH, render front, 1993 (1-bit), tape, 2008-14 (early web)."""
from __future__ import annotations

import math

import numpy as np
from scipy import signal

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant

FM_GRAIN = [hz(n) for n in ("F5", "C6", "Db6", "G6", "Ab6", "C7", "Db7", "F7")]


# ============================================================================ T0: the dark room
@sfx("room_drone", "Dark-room sub drone: F1 + C2 open fifth (no third), slow breathing, faint air. Seamless 4-bar loop.",
     pitch="F1+C2 (open fifth)", use="Cold open f0-119 (fade in from f0); returns f690-719 and fades out by f719.",
     frames=[0, 690], cat="room", loop=True, mix_db=-10, norm="integrated")
def room_drone():
    L = 4 * 4 * BEAT            # 10.0 s = 4 bars
    n = n_of(L)
    f1, _ = loop_tone(n, hz("F1"), L)
    f1b, _ = loop_tone(n, hz("F1") + 0.1, L, 0.3)          # 0.1 Hz beat = one slow swell per 10 s
    c2, _ = loop_tone(n, hz("C2"), L, 0.1)
    f2, _ = loop_tone(n, hz("F2"), L, 0.6)
    c3, _ = loop_tone(n, hz("C3"), L, 0.2)
    breath = 1 + 0.12 * loop_lfo(n, 1) + 0.05 * loop_lfo(n, 3, 0.2)
    tone = (0.55 * f1 + 0.35 * f1b + 0.42 * c2 * (1 + 0.1 * loop_lfo(n, 2, 0.5)) + 0.10 * f2 +
            0.035 * c3 * (0.6 + 0.4 * loop_lfo(n, 1, 0.75)))
    tone *= breath
    # low "room pressure" noise, loop-safe
    air_lo = loop_noise(n, 30, 220, -6, seed=11) * 0.10 * (1 + 0.3 * loop_lfo(n, 2, 0.1))
    air_hi = loop_noise(n, 400, 3000, -4.5, seed=12) * 0.012 * (1 + 0.5 * loop_lfo(n, 1, 0.4))
    L_ = tone + air_lo + air_hi
    R_ = tone + loop_noise(n, 30, 220, -6, seed=13) * 0.10 * (1 + 0.3 * loop_lfo(n, 2, 0.6)) + \
        loop_noise(n, 400, 3000, -4.5, seed=14) * 0.012
    return np.stack([L_, R_], axis=1)


@sfx("server_hum", "Server hum bed tuned to F (87.3 Hz electrical + F3/C4 fan tones), rack fans, rare drive ticks. Seamless loop.",
     pitch="F2 hum, F3/C4 fan tones", use="Cold open f0-119 under the drone; any server-room scene.",
     frames=[0], cat="room", loop=True, mix_db=-20, norm="integrated")
def server_hum():
    L = 4 * 4 * BEAT
    n = n_of(L)
    out = np.zeros((n, 2))
    hum = np.zeros(n)
    for k, a in [(1, 0.5), (2, 0.28), (3, 0.16), (4, 0.07), (5, 0.05), (7, 0.02)]:
        h, _ = loop_tone(n, hz("F2") * k, L, 0.13 * k)
        hum += a * h
    hum *= 0.45 * (1 + 0.04 * loop_lfo(n, 5))
    fan1, _ = loop_tone(n, hz("F3"), L, 0.2)
    fan2, _ = loop_tone(n, hz("C4") + 0.1, L, 0.7)
    fans = (0.05 * fan1 * (1 + 0.3 * loop_lfo(n, 7)) + 0.035 * fan2 * (1 + 0.3 * loop_lfo(n, 3, 0.4)))
    whine, _ = loop_tone(n, hz("C7"), L)
    whine *= 0.0035 * (1 + 0.5 * loop_lfo(n, 2))
    for ch, seed in ((0, 21), (1, 22)):
        air = loop_noise(n, 80, 9000, -3.5, seed=seed)
        air = air * 0.22 * (1 + 0.08 * loop_lfo(n, 11, ch * 0.3))       # fan turbulence
        body = loop_noise(n, 90, 700, -2, seed=seed + 10) * 0.18
        out[:, ch] = hum * (1.0 if ch == 0 else 0.92) + fans + whine + air + body
    # a few quiet drive/relay ticks (placed away from the loop seam)
    r = rng(5)
    for t0 in (1.37, 3.9, 4.05, 7.21, 8.6):
        c = click((2100 * r.uniform(0.9, 1.1), 3900, 6100), 0.006, 0.03, seed=int(t0 * 100)) * 0.03
        place(out, pan(c, r.uniform(-0.6, 0.6)), t0)
    return out * 0.8


@sfx("room_tone", "Neutral dark-room tone (soft air, distant HVAC). Seamless loop; the unmuted bus under 'FIRED.'",
     use="Slot 9.2 f495-509 (music muted); any quiet interior.", frames=[495], cat="room", loop=True, mix_db=-24,
     norm="integrated")
def room_tone():
    L = 2 * 4 * BEAT
    n = n_of(L)
    a = loop_noise(n, 25, 1800, -4.0, seed=31) * 0.6
    b = loop_noise(n, 25, 1800, -4.0, seed=32) * 0.6
    hv, _ = loop_tone(n, 58.3, L)
    return np.stack([a + 0.02 * hv, b + 0.02 * hv], axis=1)


# ---------------------------------------------------------------------------- keyboard
def _key(seed: int, soft: float = 1.0, space: bool = False):
    r = rng(seed)
    dur = 0.16
    n = n_of(dur)
    f0 = r.uniform(780, 920) * (0.72 if space else 1.0)
    body = modal_hit(f0, PLASTIC, 0.035, dur=dur, bright=6000, seed=seed, detune=0.03) * 0.55
    thock = thump(r.uniform(260, 320) * (0.8 if space else 1), r.uniform(150, 190), dur, 0.01, 0.018) * 0.8
    contact = noise_burst(dur, 2500, 9000, 0.0012, seed=seed) * 0.35
    down = lowpass(body + thock + contact, 7000 * soft + 2000, 2)
    up_t = r.uniform(0.055, 0.085)
    up = modal_hit(f0 * 1.35, PLASTIC, 0.02, dur=dur, bright=8000, seed=seed + 1) * 0.16
    up = np.concatenate([np.zeros(n_of(up_t)), up])[:n]
    y = down + up
    if space:
        y += modal_hit(1900, STEEL, 0.03, dur=dur, seed=seed + 2) * 0.05  # stabilizer wire
    return fade(y, 0, 0.02)


for i in range(6):
    variant(f"key_tap_soft_{i + 1:02d}", (lambda i=i: reverb(pan(_key(100 + i), 0.0), "booth", 0.12)),
            desc=f"Soft felt-damped keyboard key (round-robin {i + 1}/6): muted thock, gentle upstroke.",
            use="Mas typing (cold open f0-111; pixel scenes). Trigger per keystroke; randomize RR.",
            cat="ui", flavor="hybrid", mix_db=-18)
variant("key_tap_space", lambda: reverb(_key(160, space=True), "booth", 0.12),
        desc="Soft space bar: lower thock with a faint stabilizer wire.", use="Word breaks while typing.",
        cat="ui", mix_db=-18)


@sfx("typing_soft", "Soft typing phrase (~4 s): the Ep1 post 'near the singularity; unclear which side.' typed in human bursts.",
     use="Cold open, under VO (duck -6 dB); pixel room scenes (Mas typing).", frames=[24], cat="ui", mix_db=-16)
def typing_soft():
    text = "near the singularity; unclear which side."
    r = rng(77)
    t = 0.0
    out = np.zeros((n_of(4.6), 2))
    for i, ch in enumerate(text):
        k = _key(200 + i, soft=0.8, space=(ch == " "))
        g = r.uniform(-3, 0) - (2 if ch == " " else 0)
        place(out, pan(k, r.uniform(-0.18, 0.18)), t, g)
        # human rhythm: fast inside words, a beat on spaces/punctuation
        t += r.uniform(0.07, 0.11) if ch not in " ;." else r.uniform(0.14, 0.22)
        if ch == ";":
            t += 0.25
    return reverb(out, "room", 0.08)


def _felt_mech(seed):
    r = rng(seed)
    dur = 0.35
    bed = modal_hit(r.uniform(140, 170), WOOD, [0.08, 0.05, 0.03, 0.02, 0.015], dur=dur, bright=1800, seed=seed) * 0.6
    felt = lowpass(noise_burst(dur, 150, 1400, 0.018, 0.002, seed=seed + 1), 1200) * 0.5
    damper = np.concatenate([np.zeros(n_of(r.uniform(0.16, 0.22))),
                             lowpass(noise_burst(0.1, 200, 2000, 0.02, 0.01, seed=seed + 2), 1500) * 0.18])
    return fade(mix(bed, felt, damper, n=n_of(dur)), 0, 0.05)


for i in range(3):
    variant(f"felt_key_mech_{i + 1:02d}", (lambda i=i: reverb(_felt_mech(170 + i), "room", 0.1)), cat="room",
            desc=f"Felt-piano key mechanics (RR {i + 1}/3): key-bed thud, felt hammer 'whump', soft damper return. Layer under the music's felt piano notes for intimacy.",
            use="Cold open felt piano F5 at f0/f15/f30/f45 (layer at -18 dB); any close-miked piano moment.",
            frames=[0, 15, 30, 45], mix_db=-20)


# ---------------------------------------------------------------------------- post click
def _mouse_click(seed=3, bright=1.0):
    dur = 0.2
    press = click((2050, 3350, 5200, 7700), 0.010, dur, 0.3, seed=seed) * 0.9
    body = thump(420, 180, dur, 0.004, 0.012) * 0.35
    release = click((2400, 3900, 6100), 0.007, dur, 0.4, seed=seed + 1) * 0.45
    release = np.concatenate([np.zeros(n_of(0.072)), release])[:n_of(dur)]
    y = press + body + release
    return lowpass(y, 9000 + 5000 * bright, 2)


@sfx("post_click", "The Post click: crisp two-stage mouse click with a barely-there F6 'sent' glint (8-bit tick underneath).",
     pitch="F6 glint", use="Cold open f112 (Mas clicks Post); any UI confirm.", frames=[112], cat="ui", mix_db=-8)
def post_click():
    y = _mouse_click()
    n = len(y)
    glint = sine(hz("F6"), n=n) * env_exp(n, 0.035, 0.001) * 0.10
    glint += sine(hz("C7"), n=n) * env_exp(n, 0.02, 0.001) * 0.04
    chip = I.chip_note("F6", 0.05, "pulse", 0.125, levels=[0.6, 0.35, 0.15]) * 0.05
    y = mix(y, glint, chip)
    return reverb(y, "room", 0.1)


variant("post_click--chip", lambda: reverb(mix(
    I.chip_noise(0.02, 24000, levels=[1.0, 0.3]) * 0.5,
    I.chip_note("F6", 0.07, "pulse", 0.5, levels=[1.0, 0.6, 0.3, 0.1], naive=True) * 0.35,
    (I.chip_note("C7", 0.05, "pulse", 0.25, levels=[0.7, 0.3, 0.1]) * 0.25, 0.034)), "booth", 0.1),
    desc="Post click, 8-bit flavor: LFSR tick + 1-bit F6/C7 blip.", pitch="F6-C7", use="Cold open f112 (alt).",
    frames=[112], cat="ui", flavor="chip", variant_of="post_click", mix_db=-10)


# ---------------------------------------------------------------------------- orb
@sfx("orb_servo", "Orb iris servo: precise micro-motor accelerate/cruise/stop, gear buzz, soft end-stop tick and iris blades.",
     pitch="motor cruises on C5/F5 harmonics", use="Cold open f97 (Orb's iris swivels to lens); any Orb movement.",
     frames=[97], cat="orb", mix_db=-10)
def orb_servo():
    dur = 0.55
    n = n_of(dur)
    t = np.arange(n) / SR
    move = 0.28
    spd = np.interp(t, [0, 0.05, 0.2, move, move + 0.01, dur], [0, 1, 1, 0.25, 0, 0])
    spd = lowpass(spd, 40, 1)
    f = hz("C5") * (0.55 + 0.45 * spd)
    ph = np.cumsum(f) / SR
    motor = (np.sin(2 * math.pi * ph) * 0.5 + 0.25 * np.sin(4 * math.pi * ph) +
             0.18 * np.sin(2 * math.pi * 3 * ph) + 0.08 * np.sin(2 * math.pi * 5 * ph))
    gear = pulse(f * 4, n, 0.2) * 0.25
    gear = bandpass(gear, 1200, 6000, 2)
    whir = bandpass(noise(n, "white", 41), 2500, 9000, 2) * 0.25
    y = (motor * 0.5 + gear + whir) * np.clip(spd, 0, 1) ** 0.8
    y = lowpass(y, 11000, 2)
    stop = modal_hit(3100, STEEL, 0.03, dur=0.12, seed=42) * 0.35
    blades = noise_burst(0.12, 5000, 14000, 0.012, seed=43) * 0.25
    out = mix(pan_curve(y, np.linspace(-0.15, 0.15, n)), (pan(stop, 0.1), move), (pan(blades, 0.12), move + 0.004))
    return reverb(out, "room", 0.12)


@sfx("orb_scan_sweep", "Orb scan 'shhk': bright tuned (F) noise fan sweeping L->R with token glitter; a 5-frame glimpse of a vast cathedral tail.",
     pitch="comb-tuned to F", use="Cold open f100 (scan fan sweeps; 5-frame GLYPH cathedral reveal f99-104).",
     frames=[100], cat="orb", mix_db=-8)
def orb_scan_sweep():
    dur = 1.6
    n = n_of(dur)
    t = np.arange(n) / SR
    sw = 0.21
    x = noise(n, "white", 51)
    fc = np.interp(t, [0, sw * 0.5, sw, dur], [1800, 7500, 11000, 11000])
    y = sweep_filter(x, fc, 1.6, "band")
    e = np.interp(t, [0, 0.012, sw * 0.8, sw + 0.06, dur], [0, 1, 0.8, 0.0, 0.0])
    y = y * e
    y = 0.6 * y + 0.4 * comb(y, hz("F4"), 0.82)
    low = whoosh(0.35, 300, 900, 1.0, 0.45, seed=52) * 0.35
    glitter = grains(sw + 0.05, FM_GRAIN[2:], 40, (0.006, 0.02), seed=53) * 0.12
    front = pan_curve(y, np.interp(t, [0, sw], [-0.85, 0.85]))
    dry = mix(front, low, glitter)
    wet = reverb(dry, "cathedral", 0.55, dry=0.0, hp=400)
    return mix(dry, (wet, 0, -9), n=n)


# ============================================================================ GLYPH (dark foreshadowing)
@sfx("glyph_shimmer", "GLYPH shimmer: the world turning to tokens. Sparse tuned grain cloud (F minor with a Db/G ache), frozen partials, sub pressure, pre-verb swell. Subtle, eerie.",
     pitch="F5-F7 grains (F C Db G Ab)", use="Any GLYPH switch (Orb-scan cathedral f99-104 layer; iris f705ish; foreshadow beats).",
     frames=[99], cat="glyph", mix_db=-14)
def glyph_shimmer():
    dur = 2.4
    n = n_of(dur)
    cloud = grains(2.0, FM_GRAIN, 320, (0.015, 0.05), [(0, 0.2), (0.6, 1.0), (1.2, 0.8), (2.0, 0.05)], seed=61)
    ticks = grains(2.0, [hz("F6"), hz("C7")], 36, (0.004, 0.008), [(0, 0.1), (0.8, 1), (2.0, 0.1)], seed=62,
                   wave="pulse") * 0.25
    t = np.arange(n) / SR
    pad = np.zeros(n)
    for nt, a in (("F4", 0.35), ("C5", 0.3), ("F5", 0.22), ("Db6", 0.06)):
        f = hz(nt)
        pad += a * (np.sin(2 * math.pi * f * 0.9985 * t) + np.sin(2 * math.pi * f * 1.0015 * t)) * 0.5
    pad *= np.interp(t, [0, 0.7, 1.4, dur], [0, 1, 0.6, 0]) ** 2
    pad = lowpass(pad, 3000, 2)
    sub = sine(hz("F1"), n=n) * np.interp(t, [0, 0.8, dur], [0, 1, 0]) ** 2 * 0.25
    body = mix(cloud, ticks, pad * 0.25, sub)
    pre = reverb(body[::-1], "hall", 0.8, dry=0.0)[:n][::-1] * 0.5
    out = mix(body, pre, n=n)
    out = reverb(out, "plate", 0.3)
    return fade(out[:n_of(2.8)], 0.05, 0.4)


@sfx("glyph_blink", "Two-frame GLYPH blink: a tiny pre-verbed token sparkle for the Orb iris showing the skyline in tokens.",
     pitch="F6/C7", use="Title: iris shows the skyline in GLYPH for 2 frames on the last beat (~f705). Sparkle at +0.25 s (pre-verb before it).",
     frames=[705], cat="glyph", mix_db=-18, anchor="hit", sync=0.25)
def glyph_blink():
    burst = grains(0.09, FM_GRAIN[3:], 22, (0.006, 0.02), seed=64)
    burst += grains(0.09, [hz("F7")], 6, (0.003, 0.006), seed=65, wave="pulse") * 0.3
    pre = reverb(burst[::-1], "hall", 0.9, dry=0.0)[::-1][-n_of(0.25):] * 0.5
    body = reverb(burst, "plate", 0.35)[:n_of(0.7)]
    return fade(mix(pre, (body, 0.25)), 0.02, 0.2)


@sfx("glyph_dissolve", "GLYPH dissolve/blow-away: a tile crumbles into tuned tokens that scatter outward and rise, carried off by a soft gust.",
     pitch="F minor grains rising", use="Slot 9.2 ~f500 (Mas's call tile dissolves into tokens and blows away).",
     frames=[500], cat="glyph", mix_db=-12)
def glyph_dissolve():
    dur = 1.6
    n = n_of(dur)
    r = rng(71)
    out = np.zeros((n, 2))
    notes = [hz(x) for x in ("F5", "Ab5", "C6", "Db6", "F6", "G6", "Ab6", "C7")]
    for i in range(260):
        t0 = 1.1 * r.random() ** 1.6
        m = n_of(r.uniform(0.02, 0.07))
        f = notes[r.integers(len(notes))] * (1 + 0.6 * t0)
        tt = np.arange(m) / SR
        fr = f * 2 ** ((4 * tt / (m / SR)) / 12)
        g = np.sin(2 * math.pi * np.cumsum(fr) / SR) * np.hanning(m) * (1 - t0 / 1.3) * r.uniform(0.3, 1)
        spread = min(1, 0.15 + t0 * 1.2)
        p = r.uniform(-spread, spread)
        place(out, pan(lowpass(g, 12000 - 6000 * t0, 1), p), t0)
    crumble = I.chip_noise(0.12, 9000, True, levels=[1, .8, .6, .4, .3, .2, .1]) * 0.12
    gust = whoosh(1.4, 500, 2600, 0.9, 0.35, seed=72) * 0.35
    gust = pan_curve(gust, np.linspace(-0.3, 0.8, len(gust)))
    y = mix(out * 0.5, pan(crumble, 0), (gust, 0.05))
    return fade(reverb(y, "hall", 0.3)[:n_of(2.2)], 0.003, 0.5)


# ============================================================================ render front (fidelity upgrade)
@sfx("render_front_sweep", "Render-front sweep (palette upgrade): a glowing scanline glides F4->F6 while the audio itself upgrades from 1-bit to clean, ending on a glassy settle.",
     pitch="F4 -> F6, settles on F6/C7", use="f168-179 (1-bit -> 240p front); any palette upgrade (1-bit -> early-web -> base).",
     frames=[168], cat="render", mix_db=-8)
def render_front_sweep():
    dur = 0.5
    n = n_of(dur)
    t = np.arange(n) / SR
    f = hz("F4") * 2 ** (2 * (t / dur) ** 1.4)
    duty = np.interp(t, [0, dur], [0.5, 0.5])
    sq = pulse(f, n, duty, naive=True)
    sn = np.sin(2 * math.pi * np.cumsum(f) / SR)
    morph = np.clip(t / (dur * 0.85), 0, 1)
    tone = sq * (1 - morph) + (0.8 * sn + 0.2 * np.sin(4 * math.pi * np.cumsum(f) / SR)) * morph
    bits = np.interp(t, [0, dur * 0.25, dur * 0.55, dur * 0.8], [1, 3, 6, 16])
    hold = np.interp(t, [0, dur * 0.3, dur * 0.7], [12, 5, 1])
    tone = time_varying_crush(tone, bits * np.ones(n), hold * np.ones(n))
    tone = lowpass(tone, 12000, 2) * np.interp(t, [0, 0.02, dur * 0.9, dur], [0, 0.5, 0.6, 0])
    raster = bandpass(noise(n, "white", 81), 2000, 9000, 2) * (0.5 + 0.5 * np.sign(np.sin(2 * math.pi * np.interp(t, [0, dur], [60, 900]) * t)))
    raster *= np.interp(t, [0, 0.03, dur * 0.85, dur], [0, 0.25, 0.3, 0])
    settle = modal_hit(hz("F6"), GLASS, 0.9, dur=1.2, seed=82) * 0.25
    settle += modal_hit(hz("C7"), GLASS, 0.6, dur=1.2, seed=83) * 0.12
    y = mix(pan_curve(tone + raster, np.linspace(-0.7, 0.7, n)), (pan(settle, 0.6), dur - 0.03))
    return reverb(y, "plate", 0.18)


@sfx("shockwave_bloom", "Radial shockwave re-skin into glass and bloom: air blast, low whump and a tuned glass shimmer (F/C, no third).",
     pitch="F/C glass", use="Slot 9.1 f480 (CHATGTP button: set re-renders in glass and bloom).", frames=[480], cat="render", mix_db=-8)
def shockwave_bloom():
    dur = 2.5
    n = n_of(dur)
    blast = whoosh(0.9, 3000, 300, 0.8, 0.06, seed=91) * 0.8
    whump = thump(90, hz("F1"), 1.0, 0.05, 0.25) * 0.8
    glass = mix(*[(pan(modal_hit(hz(nt), GLASS, 1.6, dur=2.2, seed=92 + i, detune=0.002) * a, p), dt)
                  for i, (nt, a, p, dt) in enumerate([("F6", 0.3, -0.5, 0.02), ("C7", 0.22, 0.5, 0.05),
                                                      ("F7", 0.12, -0.2, 0.09), ("C6", 0.18, 0.3, 0.0)])])
    sparkle = grains(1.2, [hz(x) for x in ("C7", "F7", "G7", "C8")], 70, (0.004, 0.012),
                     [(0, 1), (1.2, 0)], seed=96) * 0.15
    y = mix(decorrelate(blast), whump, (glass, 0.0), (sparkle, 0.05), n=n)
    return fade(reverb(y, "hall", 0.25), 0, 0.5)[:n]


# ---------------------------------------------------------------------------- reverse swells / whooshes
def _rev_swell(dur, seed=0, bright=1.0):
    crash = I.load("Percussion/cymbal-crash1_mp_rr1.wav")
    sw = reverse_swell_of(crash, dur)
    air = whoosh(dur, 300, 7000 * bright, 0.7, 0.97, seed=seed)
    y = mix(sw * 0.7, decorrelate(air * 0.5, seed))
    n = len(y)
    return fade(y[:n_of(dur)], 0.02, 0.003)


variant("reverse_swell_1beat", lambda: _rev_swell(BEAT, 101), cat="transition",
        desc="Reverse cymbal + air swell, exactly 1 beat (15 frames); the FILE END is the hit.",
        use="End on f120 (drop; place at f105) and f540 (place at f525). Anchor = end.",
        frames=[120, 540], mix_db=-10, anchor="end")
variant("reverse_swell_2beat", lambda: _rev_swell(2 * BEAT, 102), cat="transition",
        desc="Reverse cymbal + air swell, 2 beats (30 frames); file end = hit.",
        use="Into any card hit (e.g. end on f240) or the title slam f630.", frames=[240, 630], mix_db=-10, anchor="end")


@sfx("whoosh_pullback", "Reverse whoosh for the pull-back into the monitor: air rushing inward, pitched shimmer tail (F).",
     pitch="F shimmer", use="Title f690 (dolly-out into Mas's monitor).", frames=[690], cat="transition", mix_db=-10)
def whoosh_pullback():
    dur = 0.75
    w = whoosh(dur, 6000, 250, 1.0, 0.25, seed=111)
    w = decorrelate(w, 5)
    sh = grains(0.5, [hz("F6"), hz("C7"), hz("F7")], 30, (0.01, 0.03), [(0, 1), (0.5, 0)], seed=112) * 0.12
    return fade(reverb(mix(w, sh), "hall", 0.2), 0.005, 0.3)


# ============================================================================ 1993: 1-bit dialog
def _bonk_wood():
    y = modal_hit(hz("E3"), WOOD, [0.22, 0.12, 0.07, 0.04, 0.03], dur=0.5, bright=5000, seed=121) * 0.8
    y += thump(hz("E3") * 1.8, hz("E3"), 0.5, 0.01, 0.07) * 0.5
    return y


def _bonk_chip(naive=True):
    a = I.chip_note("E4", 0.05, "square1bit", levels=[1, 1, 0.8])
    b = I.chip_note("E3", 0.14, "square1bit", levels=[1, 0.8, 0.6, 0.45, 0.3, 0.2, 0.1, 0.05])
    return mix(a, (b, 0.045))


@sfx("alert_bonk", "1993 alert 'bonk' (Cancel is disabled): a hollow wooden knock on E - the wrong note against F minor - with a 1-bit square shadow.",
     pitch="E3 (leading-tone clash vs F)", use="f150 (stranger clicks greyed-out Cancel); any 'not allowed' beat.",
     frames=[150], cat="1993", mix_db=-8)
def alert_bonk():
    y = mix(_bonk_wood(), (_bonk_chip() * 0.18, 0.0))
    return reverb(lowpass(y, 9000), "room", 0.12)


variant("alert_bonk--chip", lambda: reverb(I.chip_polish(_bonk_chip()), "booth", 0.1),
        desc="1993 bonk, pure 1-bit: square E4 -> E3 drop, stepped 60 Hz envelope.", pitch="E4->E3",
        use="f150 (alt, more era-literal).", frames=[150], cat="1993", flavor="chip", variant_of="alert_bonk", mix_db=-12)
variant("alert_bonk--band", lambda: reverb(mix(
    I.piano("E2", 0.45, dyn=2, release=0.12) * 0.8, I.piano("F2", 0.45, dyn=2, release=0.12) * 0.7,
    _bonk_wood() * 0.5, (I.tbn_short("E2", 0.4) * 0.4, 0.004)), "room", 0.15),
    desc="1993 bonk, band flavor: low upright-piano minor-second smear (E2+F2) + wood knock + a muted trombone blat.",
    pitch="E2+F2 cluster", use="f150 (alt, jazzier).", frames=[150], cat="1993", flavor="band",
    variant_of="alert_bonk", mix_db=-8)


@sfx("dialog_ok_click", "Dialog OK click: tight 1-bit-era button press, clean mechanical click with a single 1-bit tick.",
     use="f165 (kid clicks OK; music beeper plays C here).", frames=[165], cat="1993", mix_db=-10)
def dialog_ok_click():
    y = _mouse_click(seed=131, bright=0.5)
    tick = I.chip_note("C7", 0.02, "square1bit", levels=[0.8, 0.3]) * 0.12
    return reverb(mix(y, tick), "booth", 0.1)


variant("dialog_ok_click--chip", lambda: reverb(mix(
    I.chip_noise(0.015, 30000, levels=[1, 0.2]) * 0.5, I.chip_note("C6", 0.03, "square1bit", levels=[1, 0.4]) * 0.2),
    "booth", 0.08), desc="OK click, 1-bit: LFSR tick + one square cycle burst.", use="f165 (alt).",
    frames=[165], cat="1993", flavor="chip", variant_of="dialog_ok_click", mix_db=-12)


# ============================================================================ tape
def _clunk(seed=141):
    latch = modal_hit(1250, STEEL, 0.05, dur=0.3, seed=seed) * 0.5
    body = thump(hz("F3"), hz("F2"), 0.3, 0.01, 0.05) * 0.7
    spring = modal_hit(2900, STEEL[:5], 0.12, dur=0.3, seed=seed + 1) * 0.08
    plastic = modal_hit(700, PLASTIC, 0.03, dur=0.3, seed=seed + 2) * 0.4
    return mix(latch, body, spring, plastic)


@sfx("tape_start", "Cassette start: play-key clunk, pinch-roller tick, motor whirr coming up to speed, hiss blooming in.",
     pitch="motor lands on F3", use="f168-179 (tape-start whirr as 1-bit hands off to camcorder era).",
     frames=[168], cat="tape", mix_db=-10)
def tape_start():
    dur = 0.9
    n = n_of(dur)
    t = np.arange(n) / SR
    spd = np.clip((t - 0.06) / 0.35, 0, 1) ** 0.6
    f = hz("F3") * np.maximum(spd, 0.02)
    ph = np.cumsum(f) / SR
    motor = (np.sin(2 * math.pi * ph) + 0.4 * np.sin(4 * math.pi * ph) + 0.2 * np.sin(6 * math.pi * ph)) * 0.12
    motor *= np.clip(spd * 3, 0, 1) * np.interp(t, [0, 0.5, dur], [1, 0.6, 0.35])
    chatter = bandpass(noise(n, "white", 142), 800, 4000, 2) * (0.5 + 0.5 * np.sin(2 * math.pi * f * 0.5 * t)) * 0.08 * spd
    hiss = highpass(noise(n, "pink", 143), 3500, 2) * 0.25 * np.clip((t - 0.1) / 0.4, 0, 1)
    roller = click((1800, 3200), 0.01, 0.06, seed=144) * 0.2
    y = mix(_clunk(), (motor + chatter, 0), (roller, 0.07), hiss, n=n)
    return fade(reverb(y, "room", 0.1)[:n], 0, 0.15)


@sfx("tape_spinup", "Tape spin-up texture (1 beat): capstan and motor accelerate from a crawl to speed, flutter settling; companion to the music's pitch ramp.",
     pitch="rises to F3/F4", use="f225-239 (tape spins up to speed into the 2015 dinner).", frames=[225], cat="tape", mix_db=-12)
def tape_spinup():
    dur = BEAT
    n = n_of(dur)
    t = np.arange(n) / SR
    spd = 0.08 + 0.92 * (t / dur) ** 1.8
    flutter = 1 + 0.03 * (1 - t / dur) * np.sin(2 * math.pi * 7 * t)
    f = hz("F3") * spd * flutter
    ph = np.cumsum(f) / SR
    tone = (np.sin(2 * math.pi * ph) * 0.5 + 0.3 * np.sin(4 * math.pi * ph) + 0.15 * np.sin(2 * math.pi * 4 * ph))
    tone = lowpass(tone, 5000, 2) * 0.25
    hiss = highpass(noise(n, "pink", 151), 2500, 2) * (0.1 + 0.25 * spd)
    wobble = bandpass(noise(n, "white", 152), 300, 2000, 2) * 0.1 * (1 - t / dur)
    y = stereo(tone + hiss + wobble)
    return fade(y, 0.01, 0.01)


# ============================================================================ 2008-14: collar pops
def _cloth_snap(seed):
    flick = whoosh(0.05, 700, 4000, 1.0, 0.7, seed=seed, color="white") * 0.5
    snap = noise_burst(0.06, 1500, 9000, 0.004, seed=seed + 1) * 0.9
    return mix(flick, (snap, 0.035))


def _pop_tone(note, dur=0.35):
    f = hz(note)
    n = n_of(dur)
    t = np.arange(n) / SR
    fr = f * 2 ** (7 / 12 * np.exp(-t / 0.006))
    return np.sin(2 * math.pi * np.cumsum(fr) / SR) * env_exp(n, 0.07, 0.0008)


def collar_pop(note, seed):
    body = I.marimba(note, 0.45) * 0.55
    y = mix(_cloth_snap(seed), (_pop_tone(note) * 0.35, 0.035), (body, 0.035),
            (I.chip_note(midi(note) + 12, 0.035, "pulse", 0.125, levels=[0.7, 0.3]) * 0.06, 0.035))
    return reverb(y, "room", 0.12)


def collar_pop_chip(note, seed):
    return reverb(mix(I.chip_noise(0.03, 20000, levels=[1, 0.5]) * 0.4,
                      (I.chip_note(note, 0.12, "pulse", 0.25, levels=[1, .7, .45, .25, .1], sweep=(5, 0.03)) * 0.4, 0.02)),
                  "booth", 0.1)


def collar_pop_band(note, seed):
    stab = I.harmon(note, 0.28, release=0.1) * 0.9
    return reverb(mix(_cloth_snap(seed) * 0.9, (stab, 0.03)), "room", 0.15)


for note, fr, seed in (("Ab4", [180], 161), ("C5", [187], 162), ("F5", [202], 163)):
    nm = note.replace("b", "b")
    variant(f"collar_pop_{nm}", lambda note=note, seed=seed: collar_pop(note, seed), cat="2008",
            desc=f"Tuned collar pop on {note}: cloth flick-snap + a marimba 'pop' and a whisper of pulse wave.",
            pitch=note, use=f"f{fr[0]} (popped polo collars; D♭maj7 → Fm colour tones).", frames=fr, mix_db=-8)
    variant(f"collar_pop_{nm}--chip", lambda note=note, seed=seed: collar_pop_chip(note, seed), cat="2008",
            desc=f"Collar pop {note}, 8-bit: LFSR snap + pulse blip with a pitch flick.", pitch=note,
            use=f"f{fr[0]} (alt).", frames=fr, flavor="chip", variant_of=f"collar_pop_{nm}", mix_db=-10)
    variant(f"collar_pop_{nm}--band", lambda note=note, seed=seed: collar_pop_band(note, seed), cat="2008",
            desc=f"Collar pop {note}, big-band: cloth snap + a harmon-muted trumpet stab.", pitch=note,
            use=f"f{fr[0]} (alt, jazzier).", frames=fr, flavor="band", variant_of=f"collar_pop_{nm}", mix_db=-8)
