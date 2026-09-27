"""Ep1 Act Four v5: the sounds the v5 spotting needs that the board did not have (2026-09-27).

Two jobs:
  1. Replace every TEMP-SYNTH stand-in that studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py synthesised inline
     (buzz, clack, tick, scribble, jangle, thunk, whir, tones, dialtone, ring, ting, truck, air, squeak, pin, step, stress,
     sand, spray, click) and its synthesised room beds, with real board entries (masters, previews, manifest rows).
  2. Add the v5 sounds: the call UI on both sides, the speakerphone and the two lighthouse phones, the folder, the slate
     door and its key, the door bang, the revolving door, the avalanche's tiles, the hearts, the Q* vault's hum, the crowd.

House rules kept (OST-BIBLE §0, §6.8; LICENSES.md):
  * Everything pitched sits in F minor. No A natural anywhere (the third is reserved for Ep12), so the dial tone is an
    open fifth F4 + C5, not the real 350 + 440 Hz pair (which is an F-major third).
  * The four speakerphone keys are tuned to Step Four's line, F4 Eb4 Db4 C4 (the OST bible's request 1 to the SFX owner).
  * Generic UI only: no real app's or OS's sound, no meme sounds, no voices (the crowd is shaped noise, no words).
  * Loops (loop=True) are sample-seamless: periodic noise, events wrapped round the seam, filters run circularly.

Spotting: show/episodes/ep01/production/act4/sfx-v5.json, written by audio/ep01/act4/sfx-v5/spot_v5.py.
Build:   cd audio/sfx/scripts && ../../.venv/bin/python build.py --only <ids> --no-qa   (see audio/ep01/act4/sfx-v5/README.md)
"""
from __future__ import annotations

import math

import numpy as np

from dsp import *  # noqa: F401,F403
from fx import *   # noqa: F401,F403
import instruments as I
from registry import sfx, variant
import sounds_1

CAT = "act4"
LOOP20 = 8 * 4 * BEAT          # 20.0 s = 8 bars at 96: the bed loops


# ============================================================================ helpers
def _tone(f, dur, partials=((1, 1.0),), att=0.004, tau=0.25, seed=0):
    n = n_of(dur)
    t = np.arange(n) / SR
    r = rng(seed)
    y = sum(a * np.sin(2 * math.pi * f * k * t + r.uniform(0, 6.28)) for k, a in partials)
    return y * np.minimum(1, t / att) * np.exp(-t / tau)


def _bell(note, dur=0.9, t60=0.6, seed=0, bright=9000):
    f0 = hz(note) if isinstance(note, str) else note
    return modal_hit(f0, [1.0, 2.0, 3.0, 4.2], [t60, t60 * 0.5, t60 * 0.3, t60 * 0.2], [1.0, 0.25, 0.12, 0.05],
                     dur=dur, bright=bright, seed=seed)


def _mallet(note, dur=0.7, seed=0):
    f0 = hz(note) if isinstance(note, str) else note
    return modal_hit(f0, BAR, [0.45, 0.12, 0.05, 0.03], [1.0, 0.35, 0.12, 0.05], dur=dur, bright=6000, seed=seed)


def _speaker(x, lo=320, hi=3600, drive=1.4):
    """A small device speaker: band-limited, a little driven."""
    y = bandpass(x, lo, hi, 2)
    y = biquad_peak(y, 1100, 3.0, 1.2)
    return softclip(y * drive, 1.5) / drive


def _friction(dur, lo, hi, rate=40.0, jitter=0.7, seed=0, color="white"):
    """Stick-slip friction: band-limited noise gated by an irregular grain train."""
    n = n_of(dur)
    r = rng(seed)
    x = bandpass(noise(n, color, seed), lo, hi, 2)
    g = np.zeros(n)
    t = 0.0
    while t < dur:
        m = n_of(r.uniform(0.004, 0.02))
        s = n_of(t)
        e = min(n, s + m)
        g[s:e] += np.hanning(m)[:e - s] * r.uniform(1 - jitter, 1)
        t += r.exponential(1 / rate)
    return x * lowpass(g, 400, 1)


def _env(n, pts):
    return np.interp(np.arange(n) / SR, [p[0] for p in pts], [p[1] for p in pts])


def _penv(n, rate, seed, floor=0.0, power=1.0):
    """Periodic (loop-safe) random envelope, smooth at about `rate` Hz, 0..1."""
    r = rng(seed)
    K = max(4, int(round(rate * n / SR)))
    v = r.random(K)
    x = np.arange(n) * K / n
    i0 = np.floor(x).astype(int) % K
    f = x - np.floor(x)
    e = v[i0] * (1 - f) + v[(i0 + 1) % K] * f
    E = np.fft.rfft(e)
    F = np.fft.rfftfreq(n, 1 / SR)
    E *= np.exp(-(F / max(rate, 1e-3)) ** 2)
    e = np.fft.irfft(E, n)
    e = (e - e.min()) / (e.max() - e.min() + 1e-12)
    return floor + (1 - floor) * e ** power


def _pplace(out, x, t, gain_db=0.0):
    """Place with wrap-around (loops)."""
    n = len(out)
    x = stereo(x) * db(gain_db)
    o = n_of(t) % n
    k = min(len(x), n - o)
    out[o:o + k] += x[:k]
    if len(x) > k:
        rest = x[k:]
        out[:len(rest)] += rest[:n]


def _pevents(n, rate, maker, seed, gain_db=(-6, 0), pan_w=0.7):
    r = rng(seed)
    out = np.zeros((n, 2))
    t = r.uniform(0, 1 / rate)
    k = 0
    while t < n / SR:
        _pplace(out, pan(stereo(maker(k)), r.uniform(-pan_w, pan_w)), t, r.uniform(*gain_db))
        t += r.exponential(1 / rate)
        k += 1
    return out


def _murmur(n, talkers, seed, lo=180, hi=2600, syl=(2.8, 5.0), phrase=(0.08, 0.25), distance_lp=None):
    """Voices without words, loop-safe: speech-band periodic noise with per-talker formants, syllables and phrases."""
    r = rng(seed)
    out = np.zeros((n, 2))
    for k in range(talkers):
        w = loop_noise(n, lo * r.uniform(0.85, 1.15), hi * r.uniform(0.8, 1.1), -2.5, seed=seed * 31 + k)
        f1, f2 = r.uniform(380, 750), r.uniform(1100, 2100)
        w = circular(lambda z: biquad_peak(biquad_peak(z, f1, 8, 2.5), f2, 6, 3.0), w)
        env = _penv(n, r.uniform(*syl), seed * 97 + k, 0.0, 1.6) * _penv(n, r.uniform(*phrase), seed * 89 + k, 0.0, 0.7)
        v = w * env * r.uniform(0.5, 1.0)
        out += pan(v, r.uniform(-0.85, 0.85))
    if distance_lp:
        out = circular(lambda z: lowpass(z, distance_lp, 2), out)
    return out / (np.sqrt(np.mean(out ** 2)) + 1e-12) * 0.1


def _hvac(n, seed, bright=1100, level=1.0):
    a = loop_noise(n, 30, bright, -4.0, seed=seed)
    b = loop_noise(n, 30, bright, -4.0, seed=seed + 1)
    hv, _ = loop_tone(n, hz("Bb1"), n / SR)           # 58.3 Hz blower (in key)
    y = np.stack([a + 0.015 * hv, b + 0.015 * hv], axis=1)
    return y * level * (1 + 0.05 * loop_lfo(n, 3))[:, None]


def _city(n, seed, lp=420, level=1.0):
    """Traffic wash far below, through glass: periodic low noise, slowly breathing."""
    a = loop_noise(n, 25, lp, -5.5, seed=seed) * _penv(n, 0.15, seed + 5, 0.45)
    b = loop_noise(n, 25, lp, -5.5, seed=seed + 2) * _penv(n, 0.15, seed + 6, 0.45)
    return np.stack([a, b], axis=1) * level


def _key(seed, soft=1.0):
    return sounds_1._key(seed, soft)


def _norm_peak(x, pk=0.9):
    return x / (np.abs(x).max() + 1e-12) * pk


# ============================================================================ call UI (generic; never a real app's)
@sfx("call_connect", "Video call connects (their side): a soft two-note rise on the knee's fourth, C5 -> F5, glass-sine bell with a tiny click.",
     pitch="C5 -> F5", use="Act Four v5 S3.00a (his tile connects, 'connect' mark).", cat=CAT, mix_db=-16)
def call_connect():
    a = _bell("C5", 0.9, 0.35, 601) * 0.5
    b = _bell("F5", 1.0, 0.45, 602) * 0.55
    tick = click((3100, 5200), 0.004, 0.03, 0.3, seed=603) * 0.12
    return reverb(mix(tick, a, (b, 0.09)), "room", 0.12)


variant("call_connect--chip", lambda: reverb(mix(
    I.chip_note("C5", 0.06, "pulse", 0.125, levels=[0.8, 0.6, 0.4, 0.2]) * 0.3,
    (I.chip_note("F5", 0.12, "pulse", 0.125, levels=I.chip_levels(7, 0.8, 0.11)) * 0.3, 0.07)), "room", 0.08),
    desc="Call connects, his side (1-bit-era): 12.5% pulse C5 -> F5.", pitch="C5 -> F5",
    use="Act Four v5 S1.07 (his laptop's grid connects, 'card' mark).", cat=CAT, flavor="chip",
    variant_of="call_connect", mix_db=-18)


@sfx("call_join_chime", "Someone joins the call: a quick F-minor arpeggio F5 Ab5 C6 on a soft mallet with a sine-bell top.",
     pitch="F5 Ab5 C6", use="Act Four v5 S3.04 (Rima's join; the spotlight finds her).", cat=CAT, mix_db=-14)
def call_join_chime():
    parts = []
    for i, nt in enumerate(("F5", "Ab5", "C6")):
        m = mix(_mallet(nt, 0.8, 610 + i) * 0.45, _bell(nt, 0.9, 0.5, 620 + i) * 0.25)
        parts.append((pan(m, -0.15 + 0.15 * i), i * 0.075))
    return reverb(mix(*parts), "room", 0.15)


@sfx("call_leave", "Someone leaves the call: a soft falling fourth C6 -> F5 (the join's mirror), muted mallet.",
     pitch="C6 -> F5", use="Act Four v5 S6.03 / S6.04 / S6.06 ('... left the call' notices), their UI on his monitor.",
     cat=CAT, mix_db=-18)
def call_leave():
    a = _mallet("C6", 0.5, 630) * 0.4
    b = _mallet("F5", 0.7, 631) * 0.45
    return reverb(lowpass(mix(a, (b, 0.08)), 5000, 2), "room", 0.1)


variant("call_leave--chip", lambda: mix(
    I.chip_note("C6", 0.05, "pulse", 0.25, levels=[0.7, 0.5, 0.3]) * 0.25,
    (I.chip_note("F5", 0.1, "pulse", 0.25, levels=I.chip_levels(6, 0.7, 0.12)) * 0.25, 0.06)),
    desc="Leaves the call, 8-bit: pulse C6 -> F5.", pitch="C6 -> F5", use="Alt for the avalanche's notices.",
    cat=CAT, flavor="chip", variant_of="call_leave", mix_db=-20)


@sfx("call_ring", "Incoming video call, twice: a soft repeating F5-C6-F5 mallet figure, generic, tuned.",
     pitch="F5 C6", use="Act Four v5 S5.09 (Gerg's tile rings in the monitor's corner, 'ring' mark).", cat=CAT, mix_db=-16)
def call_ring():
    parts = []
    for rep in range(2):
        for i, nt in enumerate(("F5", "C6", "F5")):
            m = mix(_mallet(nt, 0.4, 640 + rep * 3 + i) * 0.4, _bell(nt, 0.4, 0.2, 650 + i) * 0.15)
            parts.append((m, rep * 0.8 + i * 0.1))
    return reverb(mix(*parts), "room", 0.1)[:n_of(1.9)]


@sfx("ui_mute_blip", "A mic chip greys out: tiny falling sine blip Eb5 -> C5.",
     pitch="Eb5 -> C5", use="Act Four v5 S3.01 ('grey' mark: the audio chip's microphone greys).", cat=CAT, mix_db=-22)
def ui_mute_blip():
    n = n_of(0.14)
    t = np.arange(n) / SR
    f = np.interp(t, [0, 0.05, 0.14], [hz("Eb5"), hz("C5"), hz("C5")])
    y = sine(f, n=n) * np.minimum(1, t / 0.003) * np.exp(-t / 0.05)
    return fade(y * 0.5, 0, 0.02)


@sfx("ui_shake", "A dialog shakes, refused: four tiny plastic window ticks, alternating sides, in 0.2 s.",
     use="Act Four v5 S8.03 (after the bonk).", cat=CAT, mix_db=-22)
def ui_shake():
    parts = [(pan(click((2600 + 200 * i, 4200), 0.006, 0.04, 0.3, seed=660 + i) * 0.35, (-0.5, 0.5)[i % 2]), i * 0.05)
             for i in range(4)]
    return mix(*parts, n=n_of(0.3))


@sfx("ui_toast_pop", "A small toast pops (the Orb's 'rewinding...'): a soft pop and a C6 glint.",
     pitch="C6", use="Act Four v5 S2.05 ('toast' mark).", cat=CAT, mix_db=-20)
def ui_toast_pop():
    p = thump(900, 400, 0.08, 0.004, 0.015) * 0.4
    g = _bell("C6", 0.5, 0.2, 670) * 0.15
    return reverb(mix(p, (g, 0.01)), "room", 0.1)


# ============================================================================ speakerphone and phones
def _dial_key(note, seed):
    f0 = hz(note)
    press = click((2100, 3900), 0.006, 0.05, 0.4, seed=seed) * 0.3
    tone = _tone(f0, 0.26, ((1, 1.0), (3, 0.22)), att=0.004, tau=10.0, seed=seed)
    tone = fade(tone, 0, 0.02)
    return mix(press, _speaker(tone * 0.45))


for _i, _nt in enumerate(("F4", "Eb4", "Db4", "C4")):
    variant(f"speakerphone_key_{_nt}", (lambda nt=_nt, i=_i: reverb(_dial_key(nt, 680 + i), "room", 0.08)),
            desc=f"Speakerphone key {_i + 1}/4, tuned to {_nt}: plastic key press and a small-speaker tone (fundamental + twelfth). "
                 "The four are Step Four's line F4 Eb4 Db4 C4.",
            pitch=_nt, use="Act Four v5 S4.07 (she dials: 'tone1'..'tone4').", cat=CAT, mix_db=-18)


@sfx("speakerphone_ringback", "The ring carrying across the line, through a speakerphone: an open fifth F4 + C5, one 1 s ring.",
     pitch="F4 + C5 (no third)", use="Act Four v5 S4.08 left pane (the 'ring' mark).", cat=CAT, mix_db=-20)
def speakerphone_ringback():
    n = n_of(1.25)
    t = np.arange(n) / SR
    y = (np.sin(2 * math.pi * hz("F4") * t) + 0.8 * np.sin(2 * math.pi * hz("C5") * t)) * _env(n, [(0, 0), (0.02, 1), (1.0, 1), (1.06, 0), (1.25, 0)])
    return reverb(_speaker(y * 0.3), "room", 0.1)


@sfx("dial_tone_speaker", "A dial tone on a speakerphone, tuned to the open fifth F4 + C5 (the real 350 + 440 Hz pair is an F-major third). Seamless loop.",
     pitch="F4 + C5 (no third)", use="Act Four v5 S4.08 left pane, after Adelina's click ('tone' mark) to the shot's end.",
     cat=CAT, loop=True, mix_db=-24, norm="integrated")
def dial_tone_speaker():
    L = 4 * BEAT
    n = n_of(L)
    a, _ = loop_tone(n, hz("F4"), L)
    b, _ = loop_tone(n, hz("C5"), L, 0.3)
    y = (a + 0.8 * b) * 0.3
    y = circular(lambda z: _speaker(z), y)
    hiss = loop_noise(n, 400, 5000, -2, seed=690) * 0.01
    return np.stack([y + hiss, y + loop_noise(n, 400, 5000, -2, seed=691) * 0.01], axis=1)


def _desk_ring(notes, bursts, seed, on=0.4, off=0.2):
    f1, f2 = hz(notes[0]), hz(notes[1])
    dur = bursts * (on + off)
    n = n_of(dur)
    t = np.arange(n) / SR
    sel = (np.sin(2 * math.pi * 16 * t) > 0)
    f = np.where(sel, f1, f2)
    w = pulse(f, n, 0.5) * 0.5 + sine(f, n=n) * 0.5
    gate = ((t % (on + off)) < on).astype(float)
    gate = lowpass(gate, 200, 1)
    y = bandpass(w * gate, 700, 5200, 2)
    return reverb(y * 0.3, "room", 0.12)


@sfx("desk_phone_ring", "An office desk phone ringing, generic electronic warble between Ab5 and C6, two bursts.",
     pitch="Ab5 / C6 warble", use="Act Four v5 S4.08 right pane (the lighthouse phone: 'ring', 'ringB').", cat=CAT, mix_db=-18)
def desk_phone_ring():
    return _desk_ring(("Ab5", "C6"), 2, 700)


variant("desk_phone_ring--b", lambda: _desk_ring(("Db6", "F6"), 1, 701, 0.45, 0.15),
        desc="The second desk phone (NOZAMA calling): a brighter Db6 / F6 warble, one burst.", pitch="Db6 / F6 warble",
        use="Act Four v5 S4.08 ('ring2').", cat=CAT, variant_of="desk_phone_ring", mix_db=-18)


@sfx("handset_pickup", "A handset lifted off its cradle: plastic lift, hook-switch tick, a cord rattle.",
     use="Act Four v5 S4.08 (Mario picks up; Mario grabs the second phone).", cat=CAT, mix_db=-18)
def handset_pickup():
    hook = click((1900, 3300, 5100), 0.01, 0.05, 0.3, seed=710) * 0.35
    lift = modal_hit(420, PLASTIC, 0.04, dur=0.12, seed=711) * 0.3
    cord = _friction(0.25, 900, 4500, 60, seed=712) * 0.25
    return reverb(mix(lift, (hook, 0.02), (cord, 0.05)), "room", 0.12)


@sfx("handset_hangup", "*Click.* A handset put down hard in its cradle: hook-switch snap and a plastic body knock.",
     use="Act Four v5 S4.08 (Adelina hangs up: 'click' mark).", cat=CAT, mix_db=-12)
def handset_hangup():
    snap = click((2300, 3700, 5600), 0.008, 0.06, 0.4, seed=720) * 0.6
    body = modal_hit(360, PLASTIC, 0.06, dur=0.25, seed=721) * 0.55
    th = thump(240, hz("Db3"), 0.2, 0.006, 0.03) * 0.5
    return reverb(mix(body, th, (snap, 0.004)), "room", 0.14)


@sfx("throne_topple", "A tiny gilt throne falls off a handset: three small wooden clatters and a gilt ting (C7).",
     pitch="C7 ting", use="Act Four v5 S4.08 (just after the hang-up click).", cat=CAT, mix_db=-20)
def throne_topple():
    parts = []
    for i, (t0, f0) in enumerate(((0.0, 820), (0.09, 690), (0.16, 760))):
        parts.append((modal_hit(f0, WOOD, 0.05, dur=0.15, seed=730 + i) * (0.5 - 0.1 * i), t0))
    parts.append((_bell("C7", 0.5, 0.25, 735) * 0.07, 0.01))
    return reverb(mix(*parts), "room", 0.12)


@sfx("speakerphone_pull", "A conference speakerphone pulled across a table: a plastic body sliding on laminate, the cable dragging behind.",
     use="Act Four v5 S4.07 ('pull' mark).", cat=CAT, mix_db=-16)
def speakerphone_pull():
    dur = 0.7
    n = n_of(dur)
    s = _friction(0.55, 250, 2600, 70, seed=740, color="pink") * _env(n_of(0.55), [(0, 0), (0.05, 1), (0.45, 0.7), (0.55, 0)])
    cable = _friction(0.5, 1200, 6000, 90, seed=741) * 0.2
    stop = modal_hit(300, PLASTIC, 0.05, dur=0.2, seed=742) * 0.3
    return reverb(mix(s * 0.8, (cable, 0.08), (stop, 0.52), n=n), "room", 0.12)


def _phone_buzz(dur, f_motor, seed, surface="wood", step=False):
    n = n_of(dur)
    t = np.arange(n) / SR
    r = rng(seed)
    motor = np.sin(2 * math.pi * f_motor * t) * 0.6 + np.sin(2 * math.pi * 2 * f_motor * t) * 0.3   # no odd partials to sideband onto A
    am = 0.65 + 0.35 * np.sin(2 * math.pi * f_motor / 4 * t)      # sidebands at 3/4 and 5/4 of the motor: Ab2, F3 for Db3
    rattle = bandpass(noise(n, "white", seed), 1500, 6000, 2) * (np.sin(2 * math.pi * f_motor * t) > 0.6) * 0.35
    body_f = 190 if surface == "wood" else 320
    y = lowpass(motor * am, 2400, 2) + rattle
    y = resonator(y, body_f, 3) * 0.8 + y * 0.35
    y = y * _env(n, [(0, 0), (0.012, 1), (dur - 0.04, 1), (dur, 0)])
    out = stereo(y * 0.4)
    if step:
        hop = mix(_friction(0.07, 600, 4000, 120, seed=seed + 5) * 0.35,
                  (modal_hit(r.uniform(260, 340), PLASTIC, 0.04, dur=0.12, seed=seed + 6) * 0.3, 0.06))
        out = mix(out, (hop, dur - 0.06))
    return reverb(out, "room", 0.1)


@sfx("phone_buzz_desk", "A phone buzzing once on a wooden desk: vibration motor, wood body, a light rattle.",
     use="Act Four v5 S1.11 (the buzz that brings the room back after D6).", cat=CAT, mix_db=-12)
def phone_buzz_desk():
    return _phone_buzz(0.55, hz("Db3"), 750, "wood")


for _i, _fm in enumerate((hz("Db3"), hz("Db3") * 1.007, hz("Db3") * 0.994, hz("Db3") * 1.012)):   # motors on Db3: every harmonic in key
    variant(f"phone_buzz_step_{_i + 1}", (lambda fm=_fm, i=_i: _phone_buzz(0.45, fm, 760 + i, "table", step=True)),
            desc=f"A phone buzzing on the boardroom table and taking one held step toward the edge (RR {_i + 1}/4): "
                 "motor buzz on a hard table, then a short scrape-hop.",
            use="Act Four v5 S4.02 / S4.04 / S4.06 (the four phones: STAFF, STAFF, INVESTORS, STAFF).", cat=CAT, mix_db=-14)


@sfx("phone_clack_floor", "A phone going off a table's edge: a tip-scrape, a short fall, a plastic-and-glass *clack* on the floor and a small bounce.",
     use="Act Four v5 S4.06 ('clack' mark) and the phones that follow, one per beat.", cat=CAT, mix_db=-12,
     anchor="hit", sync=0.16)
def phone_clack_floor():
    tip = _friction(0.08, 800, 4000, 100, seed=780) * 0.25
    clack = mix(modal_hit(1450, PLASTIC, 0.03, dur=0.2, seed=781) * 0.5,
                click((2900, 4600, 6900), 0.01, 0.08, 0.35, seed=782) * 0.45,
                thump(260, hz("Db3"), 0.2, 0.005, 0.025) * 0.45)
    bounce = mix(modal_hit(1500, PLASTIC, 0.02, dur=0.12, seed=783) * 0.18,
                 click((3000, 5000), 0.006, 0.04, 0.3, seed=784) * 0.12)
    return reverb(mix(tip, (clack, 0.16), (bounce, 0.31)), "room", 0.16)


# ============================================================================ pens, paper, blueprint
def _pen_tick(seed):
    tip = click((3800, 6100, 8300), 0.004, 0.04, 0.5, seed=seed) * 0.45
    paper = noise_burst(0.05, 1200, 6500, 0.01, seed=seed + 1) * 0.35
    pad = thump(420, 260, 0.05, 0.004, 0.01) * 0.2
    return reverb(mix(tip, paper, pad), "booth", 0.1)


for _i in range(3):
    variant(f"pen_tick_{_i + 1}", (lambda i=_i: _pen_tick(800 + 3 * i)),
            desc=f"A pen ticking a line on a pad (RR {_i + 1}/3): a nib click and a paper touch.",
            use="Act Four v5 S3.02 ('tick1'), S3.04 (step 2, off picture), S3.04b ('tick'), S3.03 (the Post on a tick).",
            cat=CAT, mix_db=-16)


def _scribble(dur, seed, lo=1300, hi=7000, rate=7.5, smooth=False):
    n = n_of(dur)
    t = np.arange(n) / SR
    x = _friction(dur, lo, hi, 180 if not smooth else 300, 0.5, seed)
    strokes = 0.45 + 0.55 * np.abs(np.sin(2 * math.pi * rate * t / 2 + rng(seed).uniform(0, 3)))
    if smooth:
        strokes = 0.7 + 0.3 * strokes
    return fade(x * strokes, 0.015, 0.05)


@sfx("pen_scribble_short", "A short pen stroke on paper (0.35 s).", use="Act Four v5: blueprint marks, the '?' step, the check's lines.",
     cat=CAT, mix_db=-18)
def pen_scribble_short():
    return reverb(_scribble(0.35, 810), "booth", 0.1)


@sfx("pen_run", "A pen running down a list, touching each line (1.8 s; trim to fit).",
     use="Act Four v5 S3.02 ('run0' -> 'run1': the pen runs down what the fold hid).", cat=CAT, mix_db=-20)
def pen_run():
    return reverb(_scribble(1.8, 811, rate=5.0), "booth", 0.1)


@sfx("drafting_ink_stroke", "A drafting pen drawing a long line on vellum (1.3 s; trim to fit): smooth, lower friction.",
     use="Act Four v5 S1.03 (the ring round the four, the box, the arrow).", cat=CAT, mix_db=-20)
def drafting_ink_stroke():
    return reverb(_scribble(1.3, 812, 900, 5200, rate=3.0, smooth=True), "booth", 0.08)


@sfx("marker_uncap", "A marker uncapped: a small plastic pop.", use="Act Four v5 S4.14 (before the '?').", cat=CAT, mix_db=-20)
def marker_uncap():
    pop = thump(1400, 700, 0.06, 0.003, 0.01) * 0.35
    snap = click((3300, 5200), 0.005, 0.04, 0.4, seed=820) * 0.3
    return reverb(mix(snap, (pop, 0.012)), "booth", 0.12)


@sfx("marker_write_q", "A marker writing one '?' on paper: a curved squeaky stroke and a dot.",
     use="Act Four v5 S4.14 ('q' mark).", cat=CAT, mix_db=-16)
def marker_write_q():
    dur = 0.62
    n1 = n_of(0.42)
    t = np.arange(n1) / SR
    base = _friction(0.42, 700, 5200, 260, 0.4, seed=830, color="pink")
    sq = sine(np.interp(t, [0, 0.2, 0.42], [1250, 1700, 1400]), n=n1) * 0.12 * _penv(n1, 18, 831, 0.0, 2.0)
    stroke = fade((base + sq) * _env(n1, [(0, 0), (0.03, 1), (0.36, 0.8), (0.42, 0)]), 0, 0.02)
    dot = _friction(0.05, 900, 5000, 300, seed=832) * 0.8
    return reverb(mix(stroke, (dot, 0.53), n=n_of(dur)), "booth", 0.1)


def _carve(seed):
    r = rng(seed)
    gouge = _friction(0.22, 700, 5200, 140, 0.6, seed) * _env(n_of(0.22), [(0, 0), (0.02, 1), (0.18, 0.7), (0.22, 0)])
    wood = modal_hit(r.uniform(260, 330), WOOD, [0.07, 0.04, 0.03, 0.02, 0.015], dur=0.22, bright=3000, seed=seed + 1) * 0.3
    return reverb(mix(gouge * 0.8, wood), "booth", 0.1)


for _i in range(4):
    variant(f"pen_carve_{_i + 1}", (lambda i=_i: _carve(840 + 2 * i)),
            desc=f"A steel pen clip carving a mark into a wooden desk, one stroke (RR {_i + 1}/4): a gouge scrape over the wood's body.",
            use="Act Four v5 S2.01 (the third mark, one stroke a beat).", cat=CAT, mix_db=-16)


@sfx("shavings_brush", "The side of a hand brushing wood shavings off a desk: a soft sweep and a few tiny particles.",
     use="Act Four v5 S2.01 ('brush' mark).", cat=CAT, mix_db=-20)
def shavings_brush():
    n = n_of(0.45)
    sweep = bandpass(noise(n, "pink", 850), 500, 6000, 2) * _env(n, [(0, 0), (0.08, 1), (0.3, 0.6), (0.45, 0)])
    parts = crackle(0.45, 60, 2500, 9000, seed=851) * 0.25
    return reverb(decorrelate(sweep * 0.6 + parts, 3), "booth", 0.1)


@sfx("paper_tear", "A sheet tearing along a line: a fast fibrous rip.", use="Act Four v5 S1.05 ('tear' mark: the blueprint tears into the suite).",
     cat=CAT, mix_db=-12)
def paper_tear():
    dur = 0.55
    n = n_of(dur)
    rip = crackle(dur, 900, 900, 7500, seed=860) * _env(n, [(0, 0), (0.03, 1), (0.35, 0.8), (0.5, 0.2), (dur, 0)])
    fib = bandpass(noise(n, "white", 861), 2000, 9000, 2) * _env(n, [(0, 0), (0.02, 0.4), (0.4, 0.3), (dur, 0)])
    return reverb(pan_curve(rip * 0.9 + fib * 0.5, np.linspace(-0.3, 0.4, n)), "room", 0.12)


@sfx("paper_curl", "A paper corner curling up: a soft crinkle.", use="Act Four v5 S1.05 ('curl' mark).", cat=CAT, mix_db=-18)
def paper_curl():
    n = n_of(0.5)
    c = crackle(0.5, 150, 1800, 8000, seed=865) * _env(n, [(0, 0), (0.1, 1), (0.4, 0.5), (0.5, 0)])
    return reverb(decorrelate(c, 4), "booth", 0.1)


@sfx("folder_slide", "A card folder slid across a table: card on wood, and a soft stop.",
     use="Act Four v5 S4.10b ('slide' mark).", cat=CAT, mix_db=-16)
def folder_slide():
    dur = 0.65
    n1 = n_of(0.5)
    s = _friction(0.5, 300, 3200, 140, 0.4, seed=870, color="pink") * _env(n1, [(0, 0), (0.04, 1), (0.4, 0.6), (0.5, 0)])
    stop = thump(220, hz("Db3"), 0.12, 0.004, 0.02) * 0.2
    return reverb(mix(s * 0.8, (stop, 0.48), n=n_of(dur)), "room", 0.12)


@sfx("folder_seal_break", "A paper seal broken: a short sticker peel and a snap.", use="Act Four v5 S4.10b ('seal' mark).", cat=CAT, mix_db=-16)
def folder_seal_break():
    n = n_of(0.22)
    peel = crackle(0.22, 600, 1500, 8000, seed=875) * _env(n, [(0, 0), (0.02, 1), (0.18, 0.6), (0.22, 0)])
    snap = click((2400, 4100, 6600), 0.006, 0.05, 0.5, seed=876) * 0.4
    return reverb(mix(peel * 0.6, (snap, 0.17)), "booth", 0.1)


def _flap(seed, close=False):
    air = whoosh(0.18, 300 if close else 600, 1400 if close else 400, 0.9, 0.6, seed=seed) * 0.4
    slap = mix(noise_burst(0.05, 400, 3500, 0.008, seed=seed + 1) * 0.5, thump(260, hz("F3"), 0.08, 0.004, 0.015) * 0.25)
    return reverb(mix(air, (slap, 0.15 if close else 0.12)), "booth", 0.1)


variant("folder_open", lambda: _flap(880), desc="A card folder cover flipped open: a small air puff and a card slap.",
        use="Act Four v5 S4.10b ('open' mark).", cat=CAT, mix_db=-18)
variant("folder_close", lambda: _flap(885, close=True), desc="A card folder closed: a push of air and a firmer card slap.",
        use="Act Four v5 S4.10b ('close' mark: 'Okay.').", cat=CAT, mix_db=-16)


def _chair_walk(seed):
    r = rng(seed)
    parts = [(modal_hit(r.uniform(700, 900), WOOD, 0.03, dur=0.08, seed=seed + i) * r.uniform(0.3, 0.5), i * 0.07 + r.uniform(0, 0.01))
             for i in range(4)]
    return reverb(lowpass(mix(*parts), 5000, 2), "booth", 0.1)


for _i in range(3):
    variant(f"chair_walkoff_{_i + 1}", (lambda i=_i: _chair_walk(890 + 5 * i)),
            desc=f"A small drawn chair walking off the sheet (RR {_i + 1}/3): four tiny wooden leg-taps.",
            use="Act Four v5 S1.03 ('three': the three walk off, one a beat, on the waltz's F F F).", cat=CAT, mix_db=-20)


# ============================================================================ keys and doors
def _jangle(seed, dur=0.6, hits=9, spread=0.35):
    r = rng(seed)
    parts = []
    for i in range(hits):
        f0 = r.uniform(2200, 5600)
        k = modal_hit(f0, STEEL, r.uniform(0.08, 0.25), dur=0.35, bright=11000, seed=seed + i) * r.uniform(0.15, 0.4)
        parts.append((pan(k, r.uniform(-0.4, 0.4)), r.gamma(1.6, spread / 5)))
    ring = modal_hit(r.uniform(1300, 1700), STEEL, 0.35, dur=0.5, seed=seed + 50) * 0.12
    return reverb(mix(*parts, (ring, 0.01), n=n_of(dur)), "room", 0.14)


for _i in range(3):
    variant(f"key_ring_jangle_{_i + 1}", (lambda i=_i: _jangle(900 + 60 * i)),
            desc=f"A ring of keys jangling once (RR {_i + 1}/3): several small steel keys and the ring.",
            use="Act Four v5: S1.04 (the investor's key ring), S4.13 and S4.13e (Tasya's key ring, on the offbeats).",
            cat=CAT, mix_db=-16)


@sfx("key_ring_drop", "A ring of keys dropped onto a vinyl folding-chair seat: a jangle into a soft thud.",
     use="Act Four v5 S8.10 ('keys' mark).", cat=CAT, mix_db=-14)
def key_ring_drop():
    j = _jangle(1100, 0.7, 12, 0.25)
    th = thump(180, hz("Bb2"), 0.25, 0.005, 0.05) * 0.5
    return mix(j, (stereo(th), 0.0))


@sfx("door_key_turn", "A key into a lock and turned: pin clicks going in, a spring click, the bolt drawing back.",
     use="Act Four v5 S5.11 ('key' mark: the key turns in the slate door).", cat=CAT, mix_db=-14, anchor="hit", sync=0.34)
def door_key_turn():
    ins = mix(*[(click((3000 + 400 * i, 5200), 0.006, 0.04, 0.3, seed=1110 + i) * 0.18, 0.03 * i) for i in range(4)])
    scrape = _friction(0.14, 2000, 7000, 150, seed=1115) * 0.15
    spring = click((1800, 2900, 4400), 0.012, 0.07, 0.3, seed=1116) * 0.4
    bolt = mix(modal_hit(hz("F3"), STEEL, 0.12, dur=0.3, seed=1117) * 0.35, thump(180, hz("Bb2"), 0.2, 0.005, 0.03) * 0.4)
    return reverb(mix(ins, scrape, (spring, 0.26), (bolt, 0.34)), "room", 0.15)


def _slab_step(seed, note="F2"):
    r = rng(seed)
    body = thump(hz(note) * 1.8, hz(note), 0.5, 0.02, 0.1) * 0.6
    grit = _friction(0.18, 500, 4500, 160, 0.6, seed) * 0.18 * 1.0
    knock = modal_hit(hz(note) * 2, WOOD, [0.12, 0.08, 0.05, 0.03, 0.02], dur=0.3, bright=2500, seed=seed + 1) * 0.3
    return reverb(mix(grit, (body, 0.02), (knock, 0.02)), "room", 0.18)


for _i, _nt in enumerate(("F2", "Ab2", "C3", "F2")):
    variant(f"slate_door_step_{_i + 1}", (lambda i=_i, nt=_nt: _slab_step(1120 + 3 * i, nt)),
            desc=f"The slate door taking one held step up out of the shadow (RR {_i + 1}/4, tuned {_nt}): a soft slab thump over grit.",
            pitch=_nt, use="Act Four v5 S4.12 ('door' mark, the door appears) and S5.11 ('door1'..'door4').", cat=CAT, mix_db=-16)


@sfx("door_open_crack", "A door unlatched and opened a crack: latch click, a short low hinge creak (Bb3 -> C4; it never passes A), and the air of the room beyond.",
     pitch="Bb3 -> C4 creak", use="Act Four v5 S4.12 ('open'), S5.11 ('crack', 'open' on 'desk').", cat=CAT, mix_db=-16)
def door_open_crack():
    dur = 1.0
    latch = click((1500, 2600, 4000), 0.012, 0.08, 0.3, seed=1130) * 0.45
    n = n_of(0.45)
    t = np.arange(n) / SR
    f = np.interp(t, [0, 0.45], [hz("Bb3"), hz("C4")])
    creak = (pulse(f, n, 0.2) * 0.3 + sine(f * 2, n=n) * 0.2) * _penv(n, 30, 1131, 0.2, 1.5)
    creak = bandpass(creak, 250, 3000, 2) * _env(n, [(0, 0), (0.05, 1), (0.4, 0.6), (0.45, 0)]) * 0.35
    air = whoosh(0.8, 300, 900, 0.7, 0.5, seed=1132) * 0.25
    return reverb(mix(latch, (creak, 0.06), (air, 0.1), n=n_of(dur)), "room", 0.2)


@sfx("door_bang_open", "A door banged open against the wall: handle thwack, a heavy wood slam, the frame and glass rattling.",
     use="Act Four v5 S7.06 ('bang' mark: Terb comes in).", cat=CAT, mix_db=-8, anchor="hit", sync=0.03)
def door_bang_open():
    r = rng(1140)
    air = whoosh(0.05, 400, 1500, 0.8, 0.9, seed=1141) * 0.3
    slam = mix(thump(140, hz("C2"), 0.8, 0.02, 0.16) * 0.9, modal_hit(170, WOOD, [0.3, 0.2, 0.12, 0.08, 0.05], dur=0.8, bright=3000, seed=1142) * 0.6,
               noise_burst(0.12, 200, 4000, 0.02, seed=1143) * 0.5)
    handle = modal_hit(hz("F4"), STEEL, 0.2, dur=0.4, seed=1144) * 0.2
    rattle = [(pan(modal_hit(r.uniform(1800, 4200), GLASS, 0.15, dur=0.3, seed=1150 + i) * r.uniform(0.05, 0.12), r.uniform(-0.6, 0.6)),
               0.03 + r.uniform(0.02, 0.25)) for i in range(8)]
    return reverb(mix(air, (slam, 0.03), (handle, 0.03), *rattle), "room", 0.25)[:n_of(1.4)]


@sfx("revolving_door", "A revolving door turning: rubber sweeps thumping four times a turn, moving air, the bearing's low rumble.",
     use="Act Four v5 S4.09 ('walk': he walks out through it on the lobby camera; play it through the CCTV filter).", cat=CAT, mix_db=-18)
def revolving_door():
    dur = 3.2
    n = n_of(dur)
    t = np.arange(n) / SR
    air = bandpass(noise(n, "pink", 1160), 200, 2200, 2) * (0.5 + 0.5 * np.sin(2 * math.pi * 1.3 * t) ** 2) * 0.35
    rumble = lowpass(noise(n, "brown", 1161), 180, 2) * 0.4
    parts = [(mix(thump(160, hz("Bb2"), 0.12, 0.005, 0.02) * 0.4, noise_burst(0.08, 600, 3000, 0.012, seed=1162 + i) * 0.3), 0.25 + i * 0.38)
             for i in range(7)]
    y = mix(decorrelate(air + rumble, 5), *parts, n=n)
    return reverb(y * _env(n, [(0, 0), (0.2, 1), (2.6, 0.8), (dur, 0)])[:, None], "room", 0.2)


def _step(seed, hard=True):
    r = rng(seed)
    if hard:
        heel = mix(click((r.uniform(1500, 2100), r.uniform(3000, 3800), 5600), 0.01, 0.06, 0.4, seed=seed) * 0.5,
                   thump(r.uniform(130, 160), hz("G2"), 0.12, 0.004, 0.02) * 0.5)
        toe = click((2400, 4200), 0.006, 0.04, 0.3, seed=seed + 1) * 0.18
        return reverb(mix(heel, (toe, 0.07)), "room", 0.16)
    thud = thump(r.uniform(110, 140), hz("F2"), 0.14, 0.006, 0.03) * 0.45
    swish = bandpass(noise(n_of(0.12), "pink", seed), 800, 4000, 2) * _env(n_of(0.12), [(0, 0), (0.03, 1), (0.12, 0)]) * 0.2
    return reverb(mix(swish, (thud, 0.02)), "room", 0.1)


for _i in range(4):
    variant(f"footstep_hard_{_i + 1}", (lambda i=_i: _step(1170 + 3 * i, True)),
            desc=f"A shoe on a polished stone floor (RR {_i + 1}/4): heel click, body, toe.",
            use="Act Four v5 S4.09 (his steps on the lobby camera, through the CCTV filter).", cat=CAT, mix_db=-20)
    variant(f"footstep_soft_{_i + 1}", (lambda i=_i: _step(1190 + 3 * i, False)),
            desc=f"A shoe on office carpet (RR {_i + 1}/4): a soft thud and a fabric swish.",
            use="Act Four v5 S3.07 (Alyi steps back), S8.07 (Gerg walks out), S7.06 (Terb).", cat=CAT, mix_db=-22)


# ============================================================================ glass, the suite, palette steps
def _ting(seed, note):
    r = rng(seed)
    f0 = hz(note)
    parts = [(modal_hit(f0 * r.uniform(0.997, 1.003), GLASS, r.uniform(0.2, 0.45), dur=0.6, bright=12000, seed=seed + i) * r.uniform(0.3, 0.7),
              i * r.uniform(0.012, 0.03)) for i in range(r.integers(3, 6))]
    return reverb(mix(*parts), "room", 0.15)


for _i, _nt in enumerate(("C7", "Eb7", "F7", "Ab6")):
    variant(f"glass_shiver_{_i + 1}", (lambda i=_i, nt=_nt: _ting(1200 + 7 * i, nt)),
            desc=f"A glass shivering as a heavy truck passes (RR {_i + 1}/4, rings on {_nt}): a few quick tings.",
            pitch=_nt, use="Act Four v5 S1.01 (every glass in the suite shivers, except his).", cat=CAT, mix_db=-24)


@sfx("glass_nudge", "A glass nudged a pixel across a wooden desk: a tiny base scrape and a tap.",
     use="Act Four v5 S1.02 ('nudge').", cat=CAT, mix_db=-20)
def glass_nudge():
    sc = _friction(0.05, 1500, 6000, 200, seed=1230) * 0.3
    tap = modal_hit(1150, GLASS, 0.06, dur=0.12, seed=1231) * 0.25
    return reverb(mix(sc, (tap, 0.045)), "booth", 0.1)


@sfx("glass_set_stone", "A glass set down on a stone counter: a dull glass knock on stone, then the same small nudge.",
     use="Act Four v5 S8.05 ('set', then glass_nudge on 'nudge').", cat=CAT, mix_db=-18)
def glass_set_stone():
    knock = modal_hit(980, GLASS, 0.1, dur=0.3, seed=1235) * 0.4
    stone = click((2100, 3500, 5200), 0.008, 0.05, 0.4, seed=1236) * 0.35
    body = thump(300, hz("G3"), 0.1, 0.004, 0.015) * 0.3
    return reverb(mix(stone, knock, body), "room", 0.12)


@sfx("crane_truck_pass", "A crane truck grinding past far below a high window: diesel firing on C1, gear grind, a hydraulic whine on C, all through glass.",
     pitch="C1 firing, C4 whine (faint)", use="Act Four v5 S1.01 (the establishing wide).", cat=CAT, mix_db=-16)
def crane_truck_pass():
    dur = 3.8
    n = n_of(dur)
    t = np.arange(n) / SR
    fire = hz("C1") * (1 + 0.012 * np.sin(2 * math.pi * 0.3 * t))      # firing on C1 (32.7 Hz), so the harmonics sit in key
    diesel = pulse(fire, n, 0.15) * 0.4 + sine(fire * 2, n=n) * 0.2
    diesel = lowpass(diesel * (0.7 + 0.3 * rng(1240).random(n)), 420, 2)
    grind = bandpass(noise(n, "brown", 1241), 120, 900, 2) * 0.6
    whine = sine(hz("C4") * (1 + 0.004 * np.sin(2 * math.pi * 0.7 * t)), n=n) * 0.03
    y = (diesel + grind + whine) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    y = lowpass(y, 700, 2)
    return reverb(pan_curve(y, np.linspace(-0.6, 0.6, n)), "hall", 0.1)


def _palette_step(note, seed):
    whump = thump(hz(note) * 1.5, hz(note), 0.5, 0.02, 0.14) * 0.6
    tick = I.chip_note(midi(note) + 36, 0.03, "pulse", 0.125, levels=[0.5, 0.25]) * 0.05
    air = bandpass(noise(n_of(0.35), "pink", seed), 200, 1500, 2) * _env(n_of(0.35), [(0, 0), (0.03, 1), (0.35, 0)]) * 0.12
    return reverb(mix(whump, tick, air), "room", 0.12)


for _nt in ("F", "Ab", "C"):
    variant(f"palette_step_{_nt}", (lambda nt=_nt: _palette_step(nt + ("2" if nt != "C" else "3"), 1250 + len(nt))),
            desc=f"A palette step (a whole room changes colour by one step): a soft low whump on {_nt} with a faint 1-bit tick.",
            pitch=_nt, use="Act Four v5: S1.12 ('fall', the room falls away), S4.12 ('slate'), S7.02b ('below', 'above', 'around').",
            cat=CAT, mix_db=-20)


@sfx("whip_air", "A whip pan's air: a quick right-to-left rush (0.35 s).", use="Act Four v5 S2.05 (the whip into pass one).",
     cat=CAT, mix_db=-16)
def whip_air():
    w = whoosh(0.35, 700, 3000, 1.2, 0.55, seed=1260)
    n = len(w)
    return pan_curve(w, np.linspace(0.8, -0.8, n)) * 0.8


# ============================================================================ boardroom props
@sfx("spotlight_swing", "A theatre spotlight swinging on its yoke: a pivot squeak, the heavy lamp's clunk as it lands, a little tungsten hum on F.",
     pitch="F2 hum", use="Act Four v5 S3.04 (the spotlight finds Rima), S4.10 ('swing': off Rima, onto Ttemme).",
     cat=CAT, mix_db=-16, anchor="hit", sync=0.55)
def spotlight_swing():
    dur = 1.3
    n1 = n_of(0.5)
    t = np.arange(n1) / SR
    f = np.interp(t, [0, 0.5], [900, 1250])
    squeak = sine(f, n=n1) * _penv(n1, 25, 1270, 0.1, 2.0) * 0.08 + _friction(0.5, 1500, 5000, 80, seed=1271) * 0.1
    clunk = mix(modal_hit(hz("F3"), STEEL, 0.2, dur=0.4, seed=1272) * 0.4, thump(200, hz("Bb2"), 0.3, 0.006, 0.05) * 0.5)
    n2 = n_of(0.8)
    hum = sine(hz("F2"), n=n2) * 0.05 * _env(n2, [(0, 0), (0.1, 1), (0.8, 0)])
    return reverb(mix(squeak, (clunk, 0.55), (hum, 0.5), n=n_of(dur)), "room", 0.18)


@sfx("slot_whir", "The server rack's slot delivering a check: a small motor whir on F, paper rollers, the check dropping flat.",
     pitch="F4 motor", use="Act Four v5 S5.08 ('slide' -> 'flat').", cat=CAT, mix_db=-14)
def slot_whir():
    dur = 1.1
    n1 = n_of(0.8)
    t = np.arange(n1) / SR
    f = hz("F4") * np.minimum(1, 0.6 + t / 0.2 * 0.4)
    motor = (sine(f, n=n1) * 0.25 + sine(f / 2, n=n1) * 0.07 + sine(f * 1.5, n=n1) * 0.04) * _env(n1, [(0, 0), (0.05, 1), (0.7, 1), (0.8, 0)])
    rollers = _friction(0.7, 700, 4500, 120, seed=1281) * 0.25
    drop = mix(noise_burst(0.08, 500, 4000, 0.012, seed=1282) * 0.4, thump(240, hz("Eb3"), 0.1, 0.004, 0.015) * 0.3)
    return reverb(mix(lowpass(motor, 3000, 2), (rollers, 0.05), (drop, 0.8), n=n_of(dur)), "room", 0.12)


@sfx("hourglass_flip", "An hourglass lifted, turned over and set down on wood: a glass tick, the sand shifting, a glass-on-wood knock (C).",
     pitch="C glass", use="Act Four v5 S4.11 ('flip': three held drawings).", cat=CAT, mix_db=-14, anchor="hit", sync=0.3)
def hourglass_flip():
    lift = modal_hit(2600, GLASS, 0.08, dur=0.15, seed=1290) * 0.15
    shift = bandpass(noise(n_of(0.25), "white", 1291), 3000, 11000, 2) * _env(n_of(0.25), [(0, 0), (0.05, 1), (0.25, 0)]) * 0.2
    knock = mix(modal_hit(hz("C5"), GLASS, 0.12, dur=0.3, seed=1292) * 0.25,
                modal_hit(hz("C3") * 2, WOOD, [0.1, 0.06, 0.04, 0.03, 0.02], dur=0.3, seed=1293) * 0.35,
                thump(260, hz("F3"), 0.12, 0.004, 0.02) * 0.3)
    return reverb(mix(lift, (shift, 0.05), (knock, 0.3)), "room", 0.14)


@sfx("sand_trickle", "Fine sand running through an hourglass's neck: a quiet grainy stream. Seamless loop.",
     use="Act Four v5 S4.11 (after the flip), S7.13 (to the last grain).", cat=CAT, loop=True, mix_db=-30, norm="integrated")
def sand_trickle():
    L = 4 * BEAT
    n = n_of(L)
    a = loop_noise(n, 2500, 12000, -1.5, seed=1300) * (0.6 + 0.4 * _penv(n, 30, 1301))
    b = loop_noise(n, 2500, 12000, -1.5, seed=1302) * (0.6 + 0.4 * _penv(n, 30, 1303))
    return np.stack([a, b], axis=1) * 0.5


@sfx("sand_last_grain", "The last grain: three tiny grains ticking onto glass, then nothing.",
     use="Act Four v5 S7.13 ('grain').", cat=CAT, mix_db=-22)
def sand_last_grain():
    parts = [(modal_hit(r_, GLASS, 0.04, dur=0.08, seed=1305 + i) * 0.2, t0)
             for i, (t0, r_) in enumerate(((0.0, 5200), (0.09, 4800), (0.2, 5600)))]
    return reverb(mix(*parts), "booth", 0.12)


@sfx("sand_fall", "Sand that held its shape for a beat collapses: a grainy downward rush that settles.",
     use="Act Four v5 S7.13 ('fall', after the shatter).", cat=CAT, mix_db=-16)
def sand_fall():
    dur = 1.2
    n = n_of(dur)
    t = np.arange(n) / SR
    x = noise(n, "white", 1310)
    fc = np.interp(t, [0, dur], [7000, 2500])
    y = sweep_filter(x, fc, 0.9, "band") * _env(n, [(0, 0), (0.06, 1), (0.5, 0.6), (dur, 0)])
    return reverb(decorrelate(y * 0.8, 6), "room", 0.12)


def _strain(seed, f0):
    r = rng(seed)
    n = n_of(0.35)
    t = np.arange(n) / SR
    cr = sine(f0 * (1 + 0.02 * np.sin(2 * math.pi * 11 * t)), n=n) * _penv(n, 40, seed, 0.0, 2.5) * 0.07
    tinks = mix(*[(modal_hit(f0 * r.uniform(1.3, 1.8), GLASS, 0.05, dur=0.1, seed=seed + i) * 0.15, r.uniform(0.02, 0.3)) for i in range(3)],
                n=n)
    return reverb(mix(cr, tinks), "room", 0.12)


for _i, _f in enumerate((5400, 4700, 5100)):
    variant(f"glass_strain_{_i + 1}", (lambda i=_i, f=_f: _strain(1320 + 5 * i, f)),
            desc=f"Glass under strain (RR {_i + 1}/3): a thin creak and a couple of micro-tinks.",
            use="Act Four v5 S7.13 (between the last grain and the shatter).", cat=CAT, mix_db=-22)


@sfx("extinguisher_pin", "A fire extinguisher's pin pulled: the ring clinks, the pin slides out of the handle.",
     use="Act Four v5 S7.06 ('pin': Mas pulls it, through the freeze).", cat=CAT, mix_db=-12)
def extinguisher_pin():
    clink = modal_hit(3400, STEEL, 0.12, dur=0.3, seed=1330) * 0.35
    slide = _friction(0.14, 2500, 8000, 160, seed=1331) * 0.25
    tick = click((3900, 6200), 0.006, 0.04, 0.3, seed=1332) * 0.25
    return reverb(mix(clink, (slide, 0.04), (tick, 0.18)), "room", 0.12)


def _spray(dur, seed):
    n = n_of(dur)
    t = np.arange(n) / SR
    valve = click((1500, 2800), 0.01, 0.05, 0.3, seed=seed) * 0.3
    turb = 0.75 + 0.25 * _penv(n, 9, seed + 1)
    hiss = bandpass(noise(n, "white", seed + 2), 1500, 11000, 2) * turb * _env(n, [(0, 0), (0.02, 1), (dur * 0.7, 0.8), (dur, 0)])
    body = bandpass(noise(n, "pink", seed + 3), 300, 1500, 2) * 0.3 * _env(n, [(0, 0), (0.03, 1), (dur, 0)])
    return reverb(mix(valve, decorrelate(hiss * 0.6 + body, 8)), "room", 0.15)


variant("extinguisher_spray", lambda: _spray(1.3, 1340),
        desc="A fire extinguisher's short burst: valve click, a pressurised hiss with turbulence, tapering.",
        use="Act Four v5 S7.07 ('spray' .. 'sprayEnd', between Terb's sentences).", cat=CAT, mix_db=-16)
variant("extinguisher_spray_long", lambda: _spray(2.4, 1345),
        desc="A fire extinguisher's longer burst (2.4 s).", use="Alt, for a longer spray.", cat=CAT, mix_db=-16)


@sfx("chair_unfold", "A steel folding chair unfolding itself: hinge squeak, the legs swinging, two snap-lock clacks, the seat dropping.",
     use="Act Four v5 S8.10 ('unfold').", cat=CAT, mix_db=-14)
def chair_unfold():
    sq = _friction(0.2, 1200, 4500, 90, seed=1350) * 0.2
    swing = whoosh(0.25, 400, 1200, 0.9, 0.6, seed=1351) * 0.2
    clacks = [(mix(modal_hit(hz("F4") * (1 + 0.05 * i), STEEL, 0.12, dur=0.25, seed=1352 + i) * 0.35,
                   click((2600, 4300), 0.006, 0.04, 0.4, seed=1355 + i) * 0.35), 0.3 + 0.16 * i) for i in range(2)]
    seat = mix(thump(170, hz("Bb2"), 0.25, 0.006, 0.05) * 0.5, modal_hit(hz("C4"), STEEL, 0.2, dur=0.3, seed=1358) * 0.15)
    return reverb(mix(sq, (swing, 0.1), *clacks, (seat, 0.72)), "room", 0.16)


def _screw(seed):
    n = n_of(0.34)
    t = np.arange(n) / SR
    grind = _friction(0.34, 700, 3500, 90, 0.5, seed) * 0.4
    sq = sine(900 + 150 * np.sin(2 * math.pi * 7 * t), n=n) * _penv(n, 20, seed + 1, 0.0, 3) * 0.05
    ticks = mix(*[(click((2400, 3900), 0.004, 0.03, 0.3, seed=seed + 2 + i) * 0.15, 0.08 + 0.1 * i) for i in range(3)], n=n)
    return reverb(mix(grind + sq, ticks), "booth", 0.12)


for _i in range(4):
    variant(f"screw_turn_{_i + 1}", (lambda i=_i: _screw(1360 + 5 * i)),
            desc=f"A screwdriver backing a screw out of a chair back (RR {_i + 1}/4): a grinding creak and small ratchet ticks.",
            use="Act Four v5 S8.09 ('s1'..'s4': four screws on four of his words).", cat=CAT, mix_db=-18)


@sfx("nameplate_off", "A small metal nameplate lifted off: a tiny scrape and a clink.",
     use="Act Four v5 S8.09 (after the fourth screw).", cat=CAT, mix_db=-18)
def nameplate_off():
    sc = _friction(0.08, 2000, 7000, 150, seed=1380) * 0.2
    cl = modal_hit(2900, STEEL, 0.1, dur=0.25, seed=1381) * 0.3
    return reverb(mix(sc, (cl, 0.07)), "booth", 0.12)


# ============================================================================ the avalanche, the hearts
TILE_NOTES = ("F3", "Ab3", "C4", "Eb4")


_TILE_CACHE: dict = {}


def _tile_dry(note, seed, chip=0.06):
    key = (note, seed, chip)
    if key not in _TILE_CACHE:
        f0 = hz(note)
        thock = modal_hit(f0, WOOD, [0.12, 0.08, 0.05, 0.03, 0.02], dur=0.3, bright=3500, seed=seed) * 0.5
        body = thump(f0 * 1.6, f0 * 0.5, 0.25, 0.008, 0.04) * 0.45
        tick = I.chip_note(midi(note) + 24, 0.04, "pulse", 0.25, levels=[0.6, 0.3, 0.1]) * chip
        _TILE_CACHE[key] = mix(body, thock, tick)
    return _TILE_CACHE[key]


def _tile(note, seed, chip=0.06):
    return reverb(_tile_dry(note, seed, chip), "room", 0.12)


for _i, _nt in enumerate(TILE_NOTES):
    variant(f"tile_land_{_i + 1}", (lambda i=_i, nt=_nt: _tile(nt, 1400 + i)),
            desc=f"A call tile landing in the stack with a held *thock* (RR {_i + 1}/4, tuned {_nt}): hollow wood body, a low push, a faint 1-bit tick.",
            pitch=_nt, use="Act Four v5 S6.01 (one tile, then ten), S6.02.", cat=CAT, mix_db=-12)


@sfx("tile_land_ten", "Ten tiles landing, accelerating (1.3 s): the stack's second wave.",
     pitch="F minor thocks", use="Act Four v5 S6.01 (after the first tile).", cat=CAT, mix_db=-14)
def tile_land_ten():
    out = np.zeros((n_of(1.6), 2))
    r = rng(1410)
    t = 0.0
    for i in range(10):
        place(out, pan(_tile_dry(TILE_NOTES[i % 4], 1411 + i, 0.03), r.uniform(-0.6, 0.6)), t, r.uniform(-4, 0))
        t += 0.15 * (0.86 ** i)
    return reverb(out, "room", 0.12)[:n_of(1.8)]


@sfx("tile_land_hundreds", "Hundreds of tiles stacking (2.6 s): a dense rolling pile of thocks that swells and settles.",
     pitch="F minor thocks", use="Act Four v5 S6.01 (the flood), under the band.", cat=CAT, mix_db=-16)
def tile_land_hundreds():
    dur = 2.6
    out = np.zeros((n_of(dur + 0.4), 2))
    r = rng(1420)
    t = 0.0
    k = 0
    while t < dur:
        u = t / dur
        rate = 18 + 60 * math.sin(math.pi * min(u, 1)) ** 0.8
        g = -10 + 6 * math.sin(math.pi * u) + r.uniform(-4, 0)
        place(out, pan(_tile_dry(TILE_NOTES[r.integers(4)], 1421 + k % 12, 0.0), r.uniform(-0.85, 0.85)), t, g)
        t += r.exponential(1 / rate)
        k += 1
    return fade(reverb(out, "room", 0.14)[:len(out)], 0, 0.3)


@sfx("tile_shove", "A tile shoved off the grid: a strained creak (it resists one beat), then a slide and a drop off the edge.",
     use="Act Four v5 S6.03 (Alyi's tile), S6.04 (Neleh's, shorter: trim).", cat=CAT, mix_db=-14)
def tile_shove():
    n1 = n_of(0.6)
    t = np.arange(n1) / SR
    creak = (pulse(np.interp(t, [0, 0.6], [hz("F3"), hz("Gb3")]), n1, 0.2) * 0.2) * _penv(n1, 25, 1430, 0.2, 1.5)
    creak = bandpass(creak, 200, 2500, 2) * _env(n1, [(0, 0), (0.1, 1), (0.6, 0.6)]) * 0.5
    slide = _friction(0.4, 400, 3500, 150, seed=1431) * 0.35
    drop = whoosh(0.4, 1200, 300, 1.0, 0.3, seed=1432) * 0.4
    return reverb(mix(creak, (slide, 0.6), (drop, 0.9)), "room", 0.14)


@sfx("footnote_sparks", "Footnote numbers scattering like sparks: a quick spray of tiny paper flicks and high tuned glints (F minor, below the GLYPH band).",
     pitch="F5-Eb6 glints", use="Act Four v5 S6.04 (Neleh's tile follows).", cat=CAT, mix_db=-18)
def footnote_sparks():
    g = grains(0.8, [hz(x) for x in ("F5", "Ab5", "C6", "Eb6")], 28, (0.01, 0.03),
               density_curve=[(0, 1), (0.2, 0.8), (0.8, 0.1)], seed=1440) * 0.25
    fl = crackle(0.8, 90, 2500, 9000, seed=1441, decay=0.3) * 0.3
    return reverb(mix(g, decorrelate(fl, 9)), "room", 0.18)


for _i, (_a, _b) in enumerate((("F5", "C6"), ("Ab5", "Eb6"), ("C6", "F6"))):
    variant(f"heart_rise_{_i + 1}", (lambda i=_i, a=_a, b=_b: reverb(mix(
        I.gu("celesta", [(0.0, a, 62), (0.11, b, 70)], 1.1, length=0.5) * 2.4,
        whoosh(0.8, 500, 1600, 0.8, 0.5, seed=1450 + i) * 0.06), "room", 0.2)),
            desc=f"One heart rising and crossing the gap (RR {_i + 1}/3): a soft celesta two-note rise {_a} -> {_b} and a breath of air.",
            pitch=f"{_a} -> {_b}", use="Act Four v5 S7.01 ('heart1'..'heart3': Mas's three hearts, at the post's pace).",
            cat=CAT, mix_db=-16)


def _heart_tap(seed, note):
    tap = click((2800, 4700), 0.004, 0.03, 0.4, seed=seed) * 0.3
    pop = _bell(note, 0.25, 0.08, seed + 1) * 0.12
    return reverb(mix(tap, (pop, 0.008)), "booth", 0.1)


for _i, _nt in enumerate(("C6", "Eb6", "F6")):
    variant(f"heart_tap_{_i + 1}", (lambda i=_i, nt=_nt: _heart_tap(1460 + 3 * i, nt)),
            desc=f"A thumb hearting a post on a phone (RR {_i + 1}/3): a screen tap and a tiny {_nt} glint. *Tick.*",
            pitch=_nt, use="Act Four v5 S5.03 ('tap1'..'tap5', on the beat).", cat=CAT, mix_db=-18)


@sfx("counter_roll", "A signature counter's digit wheels rolling on to the next number: a short ratchet run that settles.",
     use="Act Four v5 S5.06 ('c650', 'c700'; the lock at 745 is odometer_ratchet).", cat=CAT, mix_db=-20)
def counter_roll():
    out = np.zeros((n_of(0.45), 2))
    r = rng(1470)
    t = 0.0
    k = 0
    while t < 0.32:
        c = click(((3100, 3900, 2700)[k % 3] * r.uniform(0.97, 1.03), 5200), 0.005, 0.04, 0.35, seed=1471 + k) * 0.25
        place(out, c, t, -3 * (t / 0.32))
        t += 0.018 + 0.03 * (t / 0.32) ** 2
        k += 1
    return reverb(out, "booth", 0.1)


@sfx("mouse_scroll", "A notched mouse wheel scrolling a page: fourteen soft notches over 1.4 s (trim to fit).",
     use="Act Four v5 S5.06 ('scroll' -> 'alyi').", cat=CAT, mix_db=-22)
def mouse_scroll():
    out = np.zeros((n_of(1.5), 2))
    for i in range(14):
        place(out, click((2200, 3600), 0.004, 0.03, 0.4, seed=1480 + i) * 0.3, i * 0.1 * (1 + 0.1 * math.sin(i)))
    return reverb(out, "booth", 0.08)


@sfx("cloth_rustle", "A jacket smoothed with one hand: a soft fabric rustle.",
     use="Act Four v5 S3.04 ('smooth': Rima smooths her jacket), S3.06 (a hand up).", cat=CAT, mix_db=-22)
def cloth_rustle():
    n = n_of(0.45)
    x = bandpass(noise(n, "pink", 1490), 700, 6000, 2) * _penv(n, 14, 1491, 0.2) * _env(n, [(0, 0), (0.06, 1), (0.35, 0.6), (0.45, 0)])
    return reverb(decorrelate(x * 0.6, 10), "booth", 0.1)


def _typing_loop():
    L = 4 * 4 * BEAT / 2                     # 5.0 s
    n = n_of(L)
    out = np.zeros((n, 2))
    r = rng(1500)
    t = 0.0
    i = 0
    while t < L:
        k = _key(1510 + i % 40, soft=1.0)
        _pplace(out, pan(k, r.uniform(-0.15, 0.15)), t, r.uniform(-4, 0) - (3 if r.random() < 0.15 else 0))
        burst = r.random() < 0.12
        t += r.uniform(0.25, 0.45) if burst else r.uniform(0.055, 0.1)
        i += 1
    return wrap_tail(reverb(out, "room", 0.06), n)


@sfx("typing_fast_loop", "Fast, sunny typing (Gerg at 2 AM): quick bursts on a soft keyboard, a thought's pause now and then. Seamless 5 s loop.",
     use="Act Four v5 S5.09 -> S5.09-back ('glance': the keys stop after 'case'), S5.09b ('type'), S5.11 (his small tile). "
         "Play it through the monitor's small-speaker filter.", cat=CAT, loop=True, mix_db=-18, norm="integrated")
def typing_fast_loop():
    return _typing_loop()


@sfx("orb_chime_F", "The Orb's chime: one small pure glass bell on F5 with a faint twelfth (C7) in its partials. A single strike, no chord and no swell, "
     "so it never evokes a computer's startup chime (OST-BIBLE §2.4); an octave under the post-notification ding.",
     pitch="F5 (C7 partial)", use="Act Four v5 S5.06 ('chime': the scroll stops on ALYI, in the gap before 'Alyi signed it.').",
     cat=CAT, mix_db=-18)
def orb_chime_F():
    b = modal_hit(hz("F5"), [1.0, 2.0, 3.0, 4.0], [1.1, 0.5, 0.35, 0.2], [1.0, 0.18, 0.12, 0.04], dur=1.4, bright=8000, seed=1590)
    tick = click((4200, 6300), 0.004, 0.02, 0.2, seed=1591) * 0.05
    return reverb(mix(tick, b * 0.5), "room", 0.2)


# ============================================================================ the Q* vault
@sfx("vault_hum_F", "The Q* vault humming at the score's root: a steel box's F2 electrical hum with F3 and C4 resonances breathing, "
     "and, very rarely, one GLYPH token glint (G6 / Db7 / F7) — the diegetic GLYPH. No third. Seamless 4-bar loop.",
     pitch="F2 hum, F3 + C4 body; G6/Db7/F7 glints", use="Act Four v5 S8.06 -> the act's end (and into the tag): the coda's pedal.",
     cat=CAT, loop=True, mix_db=-20, norm="integrated")
def vault_hum_F():
    L = 4 * 4 * BEAT                          # 10.0 s
    n = n_of(L)
    hum = np.zeros(n)
    for k, a in [(1, 0.55), (2, 0.3), (3, 0.14), (4, 0.06), (6, 0.03)]:
        h, _ = loop_tone(n, hz("F2") * k, L, 0.11 * k)
        hum += a * h
    f3, _ = loop_tone(n, hz("F3"), L, 0.2)
    c4, _ = loop_tone(n, hz("C4"), L, 0.5)
    body = 0.12 * f3 * (1 + 0.35 * loop_lfo(n, 2)) + 0.07 * c4 * (1 + 0.4 * loop_lfo(n, 3, 0.3))
    y = (hum * (1 + 0.04 * loop_lfo(n, 5)) + body) * 0.6
    out = np.stack([y + loop_noise(n, 60, 900, -3, seed=1600) * 0.03, y * 0.96 + loop_noise(n, 60, 900, -3, seed=1601) * 0.03], axis=1)
    for t0, nt in ((2.35, "G6"), (7.9, "Db7")):
        g = modal_hit(hz(nt), GLASS, 0.5, dur=0.9, seed=int(t0 * 10)) * 0.012
        _pplace(out, pan(g, 0.3 if nt == "G6" else -0.3), t0)
    return out


# ============================================================================ the crowd
@sfx("crowd_hush", "An all-hands crowd hushing (2.2 s): the murmur falling away, one quiet 'shh', feet and chairs settling. No words.",
     use="Act Four v5 S3.06 (before the employee's question).", cat=CAT, mix_db=-14)
def crowd_hush():
    dur = 2.2
    n = n_of(dur)
    m = _murmur(n_of(4.0), 16, 1700)[:n] * _env(n, [(0, 1), (0.5, 0.8), (1.3, 0.2), (dur, 0.03)])[:, None] * 6
    sh = bandpass(noise(n_of(0.45), "white", 1701), 2500, 7000, 2) * _env(n_of(0.45), [(0, 0), (0.1, 1), (0.45, 0)]) * 0.12
    shuffles = [(pan(bandpass(noise(n_of(0.2), "pink", 1710 + i), 300, 3000, 2) * np.hanning(n_of(0.2)) * 0.12,
                     (i - 2) * 0.3), 0.6 + 0.25 * i) for i in range(5)]
    return reverb(mix(m, (pan(sh, 0.2), 0.7), *shuffles, n=n), "room", 0.2)


@sfx("crowd_stir", "An all-hands crowd stirring (2.6 s): the murmur coming back up, shifting feet, a chair scraping. No words.",
     use="Act Four v5 S3.07 (after Alyi steps back, into the match cut).", cat=CAT, mix_db=-16)
def crowd_stir():
    dur = 2.6
    n = n_of(dur)
    m = _murmur(n_of(4.0), 16, 1720)[:n] * _env(n, [(0, 0.05), (0.6, 0.35), (2.0, 0.9), (dur, 0.8)])[:, None] * 6
    scrape = _friction(0.35, 300, 2400, 90, seed=1721) * 0.12
    shuffles = [(pan(bandpass(noise(n_of(0.2), "pink", 1730 + i), 300, 3000, 2) * np.hanning(n_of(0.2)) * 0.1,
                     (i - 2) * 0.35), 0.3 + 0.3 * i) for i in range(5)]
    return fade(reverb(mix(m, (pan(scrape, -0.4), 0.9), *shuffles, n=n), "room", 0.2)[:n], 0, 0.3)


# ============================================================================ room beds (20 s loops, 8 bars at 96)
@sfx("bed_suite", "Room bed, the Las Vegas suite at noon: hotel HVAC, the Strip far below through glass (traffic wash, a far horn now and then). Seamless 20 s loop.",
     use="Act Four v5 S1 (the suite), outside D6.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_suite():
    n = n_of(LOOP20)
    y = _hvac(n, 1800, 1000) * 0.9 + _city(n, 1805, 380, 0.9)

    def horn(k):
        d = 0.4
        m = n_of(d)
        t = np.arange(m) / SR
        f1 = hz("Ab4") * (1 + 0.004 * k)
        x = (pulse(f1, m, 0.5) + pulse(hz("C5"), m, 0.5)) * 0.12
        return lowpass(highpass(x, 250), 1300) * _env(m, [(0, 0), (0.02, 1), (d - 0.05, 1), (d, 0)])
    y = y + _pevents(n, 0.06, horn, 1810, (-30, -24))
    return y


@sfx("bed_tpool", "Room bed, TPOOL's frosted-glass office (EARLY-WEB16): HVAC and voices muffled behind glass, reduced to 6 bits. Seamless 20 s loop.",
     use="Act Four v5 S2.03 (F1.2, between the render fronts).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_tpool():
    n = n_of(LOOP20)
    y = _hvac(n, 1820, 1400) * 0.6 + _murmur(n, 5, 1825, 250, 1400, distance_lp=650) * 7
    q = 2 ** 5
    y = y / (np.abs(y).max() + 1e-9)
    return np.round(y * q) / q * 0.6


@sfx("bed_office_day", "Room bed, Neleh's office by day: HVAC, a far keyboard, a distant murmur down the hall, the laptop's small speaker hiss. Seamless 20 s loop.",
     use="Act Four v5 S3.00a -> S3.04b (never quieter than the dark room).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_office_day():
    n = n_of(LOOP20)
    y = _hvac(n, 1830, 1000) + _murmur(n, 4, 1835, 250, 1800, distance_lp=1100) * 1.0
    keys = _pevents(n, 1.0, lambda k: lowpass(_key(1840 + k % 20), 3000), 1836, (-26, -18))
    spk = np.stack([loop_noise(n, 400, 6000, -1, seed=1837), loop_noise(n, 400, 6000, -1, seed=1838)], axis=1) * 0.012
    return y + keys + spk


@sfx("bed_office_evening", "Room bed, Neleh's office in the evening: quieter HVAC, the city through the window, the desk lamp's faint hum on F. Seamless 20 s loop.",
     pitch="F2 lamp hum (faint)", use="Act Four v5 S3.05.", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_office_evening():
    n = n_of(LOOP20)
    lamp, _ = loop_tone(n, hz("F2"), LOOP20)
    lamp2, _ = loop_tone(n, hz("F3"), LOOP20, 0.3)
    y = _hvac(n, 1850, 750) * 0.9 + _city(n, 1855, 300, 0.7)
    return y + np.stack([lamp * 0.01 + lamp2 * 0.004] * 2, axis=1)


@sfx("bed_allhands", "Room bed, the all-hands crowd in the bullpen: a room of people waiting (murmur, no words), feet, a chair now and then. Seamless 20 s loop.",
     use="Act Four v5 S3.06 -> S3.07 (ridden down for the question and the answer).", cat="room", loop=True, mix_db=-26, norm="integrated")
def bed_allhands():
    n = n_of(LOOP20)
    m = _murmur(n, 18, 1860, 200, 3000) * 8

    def shuffle(k):
        m_ = n_of(0.25)
        return bandpass(noise(m_, "pink", 1870 + k), 250, 3000, 2) * np.hanning(m_) * 0.3
    return m + _hvac(n, 1865, 1000) * 0.3 + _pevents(n, 0.8, shuffle, 1866, (-14, -6))


@sfx("bed_boardroom_night", "Room bed, the boardroom at night: HVAC, the city at night through a glass wall, the building settling. Seamless 20 s loop.",
     use="Act Four v5 S4.01 -> S4.07, S4.10 -> S4.15 (Saturday and Sunday nights).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_boardroom_night():
    n = n_of(LOOP20)
    return _hvac(n, 1880, 800) + _city(n, 1885, 260, 0.9)


@sfx("bed_boardroom_day", "Room bed, the boardroom by day: HVAC, a brighter city through the glass, the office faint beyond the door. Seamless 20 s loop.",
     use="Act Four v5 S4.09 (Sunday by day, under the lobby camera).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_boardroom_day():
    n = n_of(LOOP20)
    return _hvac(n, 1890, 1000) + _city(n, 1895, 500, 1.0) + _murmur(n, 3, 1896, 250, 1600, distance_lp=900) * 1.2


@sfx("bed_lighthouse", "Room bed, the rival lab's lighthouse at night: wind round the tower, surf below, the lamp's motor turning. Seamless 20 s loop.",
     use="Act Four v5 S4.08, the split's right pane.", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_lighthouse():
    n = n_of(LOOP20)
    gust = (0.55 + 0.45 * _penv(n, 0.2, 1900)) * (0.8 + 0.2 * loop_lfo(n, 3))
    wind = np.stack([loop_noise(n, 250, 1500, -3, seed=1901), loop_noise(n, 250, 1500, -3, seed=1902)], axis=1) * gust[:, None]
    surf_env = (0.35 + 0.65 * (0.5 + 0.5 * loop_lfo(n, 3)) ** 3)
    surf = np.stack([loop_noise(n, 30, 700, -4, seed=1903), loop_noise(n, 30, 700, -4, seed=1904)], axis=1) * surf_env[:, None]
    m1, _ = loop_tone(n, hz("Bb1"), LOOP20)
    m2, _ = loop_tone(n, hz("F2"), LOOP20, 0.4)
    motor = (m1 * 0.03 + m2 * 0.015) * (1 + 0.2 * loop_lfo(n, 5))
    return wind * 0.8 + surf * 0.9 + np.stack([motor, motor], axis=1)


@sfx("bed_cctv", "Room bed, a lobby security camera heard through a wall screen: a mains hum on Bb1, big-lobby air, far footfalls, all through a small TV speaker. Seamless 20 s loop.",
     pitch="Bb1 mains hum", use="Act Four v5 S4.09 (the lobby camera on the boardroom's screen).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_cctv():
    n = n_of(LOOP20)
    hum = sum(loop_tone(n, hz("Bb1") * k, LOOP20, 0.1 * k)[0] / k for k in (1, 2, 3, 5)) * 0.05
    lobby = np.stack([loop_noise(n, 60, 2500, -3.5, seed=1911), loop_noise(n, 60, 2500, -3.5, seed=1912)], axis=1) * 0.5
    steps = _pevents(n, 0.5, lambda k: lowpass(_step(1920 + k % 8, True), 2500), 1913, (-18, -10))
    y = lobby + steps + np.stack([hum, hum], axis=1)
    y = circular(lambda z: bandpass(z, 180, 3800, 2), y)
    return y


@sfx("bed_bullpen_packing", "Room bed, the bullpen on Monday: a low murmur, packing rustle, box flaps, a tape gun, keyboards. Seamless 20 s loop.",
     use="Act Four v5 S7.01 -> S7.03 (everyone has a coat on).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_bullpen_packing():
    n = n_of(LOOP20)
    m = _murmur(n, 6, 1930, 250, 2000, distance_lp=1500) * 3

    def rustle(k):
        d = 0.3 + 0.4 * ((k * 37) % 10) / 10
        m_ = n_of(d)
        return bandpass(noise(m_, "pink", 1940 + k), 800, 6000, 2) * np.sin(np.linspace(0, math.pi, m_)) ** 1.5 * 0.35

    def tape(k):
        d = 0.6 + 0.3 * ((k * 13) % 10) / 10
        m_ = n_of(d)
        t = np.arange(m_) / SR
        return bandpass(noise(m_, "white", 1960 + k), 1500, 7000, 2) * (0.7 + 0.3 * np.sin(2 * math.pi * 37 * t)) * np.sin(np.linspace(0, math.pi, m_)) * 0.3

    keys = _pevents(n, 0.8, lambda k: lowpass(_key(1970 + k % 20), 3200), 1934, (-26, -18))
    return _hvac(n, 1935, 1000) * 0.8 + m + _pevents(n, 0.7, rustle, 1936, (-16, -8)) + _pevents(n, 0.12, tape, 1937, (-20, -14)) + keys


@sfx("bed_bullpen_unpack", "Room bed, the bullpen on Nov 29: calmer, coats off, boxes being unpacked, a keyboard or two, a quiet murmur (the memo reads over it). Seamless 20 s loop.",
     use="Act Four v5 S8.06 -> the act's end (the coda, the vault included).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_bullpen_unpack():
    n = n_of(LOOP20)
    m = _murmur(n, 4, 1980, 250, 1800, distance_lp=1200) * 1.8

    def rustle(k):
        m_ = n_of(0.35)
        return bandpass(noise(m_, "pink", 1990 + k), 800, 5000, 2) * np.hanning(m_) * 0.25
    keys = _pevents(n, 0.6, lambda k: lowpass(_key(2000 + k % 20), 3000), 1984, (-28, -20))
    return _hvac(n, 1985, 1000) * 0.9 + m + _pevents(n, 0.35, rustle, 1986, (-20, -12)) + keys


@sfx("bed_fires", "Room bed, the boardroom on Tuesday night with small cartoon fires: the night room, a warm low flame roar, lively crackle. Seamless 20 s loop.",
     use="Act Four v5 S7.05 -> S7.13.", cat="room", loop=True, mix_db=-28, norm="integrated")
def bed_fires():
    n = n_of(LOOP20)
    roar = np.stack([loop_noise(n, 60, 500, -3, seed=2010), loop_noise(n, 60, 500, -3, seed=2011)], axis=1) * \
        (0.7 + 0.3 * _penv(n, 1.5, 2012))[:, None] * 0.6
    cr = np.zeros((n, 2))
    for ch, seed in ((0, 2013), (1, 2014)):
        c = crackle(LOOP20 + 0.2, 45, 1200, 7000, seed=seed)
        cr[:, ch] = wrap_tail(c, n)
    cr = cr * (0.6 + 0.4 * _penv(n, 0.7, 2015))[:, None] * 1.4
    pops = _pevents(n, 0.9, lambda k: click((1500 + 90 * (k % 7), 3100), 0.01, 0.05, 0.5, seed=2020 + k) * 0.5, 2016, (-18, -8))
    return _hvac(n, 2017, 800) * 0.6 + roar + cr + pops


@sfx("bed_lobby_night", "Room bed, the NopeAI lobby at night: big dark air, far HVAC, the sign's neon buzzing on F. Seamless 20 s loop.",
     pitch="F2 neon", use="Act Four v5 S8.01 -> S8.05 (pre-lapped under the hourglass's shatter).", cat="room", loop=True, mix_db=-30, norm="integrated")
def bed_lobby_night():
    n = n_of(LOOP20)
    neon = np.zeros(n)                              # the sign's buzz on F2, without the 5th/10th partials (A natural)
    for k, a in [(1, 0.5), (2, 0.5), (3, 0.3), (4, 0.3), (6, 0.12), (8, 0.08), (12, 0.04)]:
        h, _ = loop_tone(n, hz("F2") * k, LOOP20, 0.07 * k)
        neon += a * h
    neon = circular(lambda z: bandpass(z, 120, 6000, 1), neon) * (1 + 0.08 * loop_lfo(n, 7)) * 0.12
    air = np.stack([loop_noise(n, 25, 400, -5, seed=2031), loop_noise(n, 25, 400, -5, seed=2032)], axis=1) * 0.9
    return air + _hvac(n, 2033, 600) * 0.5 + np.stack([neon, neon * 0.95], axis=1)
