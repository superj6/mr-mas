#!/usr/bin/env python3
"""Prototype 2 · THE CLIFF · the temp sound (style-range §7.2 sound column). Run with the OST venv:

    audio/.venv-theme/bin/python cue.py <audioRoot> <out.wav> <scratchDir>

MUSIC (the OST engine, audio/ost/engine, imported read-only; nothing is written under audio/): the Ep11 dread
palette at the house 96 BPM, played straight (the machine): a low felt-piano ostinato on the F pedal with the Ache
(Db, G) under a chip lead. p60: the chip lead's timbre steps toward acoustic (the same phrase, high and soft on the
grand: piano harmonics). p240: the cue suspends on one held chord (strings + one struck piano chord; no riser, no
crescendo, matched to the level before it) through the crest and the plunge; p315 its bass is re-struck once, low,
where the fall lands. p330 the ostinato resumes with the room; p345 the chip lead returns in its own timbre.
UI: p30 one soft click (the lit cursor's `Look at lanyard`; the only thing that sets the move off). p345 the Orb's
one servo step to his face, soft.
ROOM: the server hum and the rack's tick on straight eighths (panned to the rack). p60 the hum gives way to full-band
air ~10 dB under the cue (a stand-in built from decorrelated noise: the library has no recorded room air yet); the
tick picks up a growing reverb tail as the room gains depth, recedes on the push, and is gone inside the screen. The
air deepens through the fall (darker, a little fuller; never a whoosh). p315 (the landing) the hum and tick return
dry, in phase.
No dialogue, no cloned voice, no whoosh, no riser.
"""
import os
import sys

import numpy as np
import soundfile as sf

AUDIO = os.path.abspath(sys.argv[1])
OUT = sys.argv[2]
SCR = sys.argv[3]
sys.path.insert(0, os.path.join(AUDIO, 'ost'))
from engine import *  # noqa: E402,F401,F403
from engine.render import render_score  # noqa: E402

FPS, N = 24, 360
SR_ = 48000
LEN = int(round(N / FPS * SR_))
at = lambda p: int(round(p / FPS * SR_))  # noqa: E731
dbg = lambda d: 10 ** (d / 20)  # noqa: E731


# ------------------------------------------------------------------ music (the engine)
def music():
    g = Grid(bpm=96, meter='4/4', bars=7, swing=0.0)
    a = Arr(g)
    T = palette()
    T['felt'].gain_db = -1
    T['grand'].gain_db = -6
    T['lead'].gain_db = -8
    # the ostinato: eighths, the F pedal and the Ache, straight and locked (the machine plays it)
    cell = ['F2', 'C3', 'Db3', 'C3', 'F2', 'C3', 'G2', 'C3']
    for bar in range(1, 5):
        for k, pch in enumerate(cell):
            a.n('felt', pch, (bar, 1 + k * 0.5), '1/8', 0.36 + (0.06 if k in (0, 4) else 0.0), lock=True)
    for k, pch in enumerate(cell[4:]):  # p330 (bar 6, beat 3): it resumes with the room
        a.n('felt', pch, (6, 3 + k * 0.5), '1/8', 0.36 + (0.06 if k == 0 else 0.0), lock=True)
    for k, pch in enumerate(cell):
        a.n('felt', pch, (7, 1 + k * 0.5), '1/8', 0.34, lock=True)
    # the lead: one phrase. Bar 1 on the chip; bars 2-4 the same line, high and soft on the grand (piano harmonics)
    phrase = [('F5', (1, 1), '2b'), ('G5', (1, 3), '1b'), ('Ab5', (1, 4), '1b'),
              ('G5', (2, 1), '3b'), ('F5', (2, 4), '1b'),
              ('Db5', (3, 1), '2b'), ('C5', (3, 3), '2b'),
              ('Ab5', (4, 1), '2b'), ('G5', (4, 3), '2b')]
    for pch, pos, dur in phrase:
        if pos[0] == 1:
            a.n('lead', pch, pos, dur, 0.4, lock=True, duty=0.25, rel=0.08)
        else:
            a.n('grand', nm(pch) + 12, pos, dur, 0.3, lock=True)
    # p240 (bar 5): the held chord, through the edge and the fall; released on p330 (bar 6, beat 3)
    art.sus(a, 'vc', ['F2', 'C3'], (5, 1), '6b', vel=0.3)
    art.sus(a, 'vla', ['Ab3'], (5, 1), '6b', vel=0.27)
    art.sus(a, 'vln2', ['Db4'], (5, 1), '6b', vel=0.25)
    art.sus(a, 'vln1', ['G4'], (5, 1), '6b', vel=0.23)
    a.ch('felt', ['F2', 'C3', 'Ab3', 'Db4', 'G4'], (5, 1), '6b', 0.14, lock=True)  # struck softly: the strings carry the entry
    a.n('felt', 'F1', (6, 2), '2b', 0.4, lock=True)  # p315: the landing, the chord's bass once, low
    # p345 (bar 6, beat 4): the chip lead, in its own timbre
    a.n('lead', 'F5', (6, 4), '1b', 0.4, lock=True, duty=0.25, rel=0.08)
    a.n('lead', 'G5', (7, 1), '2b', 0.36, lock=True, duty=0.25, rel=0.2)
    sc = Score('p2-cliff', g, T, a.notes, meta=dict(id='p2-cliff', title='P2 temp', tone='dread, straight'))
    stems = render_score(sc, workers=4, verbose=False)
    mix = sum(stems.values())
    n = min(mix.shape[1], LEN)
    out = np.zeros((2, LEN), dtype=np.float32)
    out[:, :n] = mix[:, :n]
    return out, stems


# ------------------------------------------------------------------ the room
def read(path):
    x, sr = sf.read(path, always_2d=True, dtype='float32')
    assert sr == SR_, (path, sr)
    x = x.T
    return np.vstack([x[0], x[-1]])


def pan(x):
    return np.cos((x + 1) * np.pi / 4), np.sin((x + 1) * np.pi / 4)


def room():
    out = np.zeros((2, LEN), dtype=np.float32)
    hum = read(os.path.join(AUDIO, 'intro/sfx/src/server_hum_tuned.wav'))
    tick = read(os.path.join(AUDIO, 'intro/sfx/src/x_cut_tick.wav'))
    idx = np.arange(LEN)
    on = (idx < at(60)) | (idx >= at(315))
    ramp = np.ones(LEN, dtype=np.float32)
    for edge in (at(60), at(315)):  # 2 ms declick on the hard swaps
        for k in range(96):
            if edge - 96 + k >= 0:
                ramp[edge - 96 + k] = min(ramp[edge - 96 + k], (95 - k) / 96 if edge == at(60) else 1)
            if edge + k < LEN:
                ramp[edge + k] = min(ramp[edge + k], k / 96 if edge == at(315) else 1)
    h = hum[:, idx % hum.shape[1]] * on * ramp * dbg(-17)  # its own clock: it returns in phase
    out += h
    # the tick: straight eighths (7.5 f) on the grid it never stops counting; its tail grows as the room deepens
    rng = np.random.default_rng(11)
    gl, gr = pan(0.75)
    for k in range(int(N / 7.5) + 1):
        p = k * 7.5
        if 175 <= p < 315:
            continue
        g = dbg(-24) * (1.0 if k % 2 == 0 else 0.7)
        if 135 <= p < 175:
            g *= dbg(-(p - 135) / 40 * 12)  # the push leaves it behind
        s = tick[:, :].copy() * g
        if 60 <= p < 175:
            depth = min(1.0, (p - 60) / 60)
            dec = 0.15 + 1.35 * depth
            n_ir = int(dec * 2.2 * SR_)
            t = np.arange(n_ir) / SR_
            ir = rng.standard_normal((2, n_ir)).astype(np.float32) * np.exp(-t / (dec / 6.9))
            ir[:, :int(0.012 * SR_)] = 0
            wet = np.vstack([np.convolve(s[0], ir[0])[: n_ir], np.convolve(s[1], ir[1])[: n_ir]]) * 0.08 * depth
            dry = np.zeros_like(wet)
            dry[:, : s.shape[1]] = s * (1 - 0.35 * depth)
            s = dry + wet
        i0 = at(p)
        n = min(s.shape[1], LEN - i0)
        out[0, i0:i0 + n] += s[0, :n] * gl * 1.4
        out[1, i0:i0 + n] += s[1, :n] * gr * 1.4
    return out


def air(level_ref):
    """full-band air (the stand-in): decorrelated pink-ish noise, wide; it deepens through the fall."""
    rng = np.random.default_rng(7)
    n0, n1 = at(60), at(315)
    n = n1 - n0
    w = rng.standard_normal((2, n)).astype(np.float32)
    # pink-ish: a gentle -3 dB/oct tilt in the spectrum, band 30 Hz .. 14 kHz
    f = np.fft.rfftfreq(n, 1 / SR_)
    tilt = np.where(f > 0, 1 / np.sqrt(np.maximum(f, 1.0) / 100.0), 0.0)
    band = (f > 30) & (f < 14000)
    W = np.fft.rfft(w, axis=1) * (tilt * band)[None]
    base = np.fft.irfft(W, n=n, axis=1).astype(np.float32)
    # the deep version (for the fall): lows up, highs down
    deep_s = np.where(f > 0, 1 / (1 + (f / 1800.0) ** 2) * (1 + 1.2 * np.exp(-f / 120.0)), 0.0)
    deep = np.fft.irfft(W * deep_s[None], n=n, axis=1).astype(np.float32)
    base /= np.sqrt(np.mean(base ** 2)) + 1e-9
    deep /= np.sqrt(np.mean(deep ** 2)) + 1e-9
    t = (np.arange(n) + n0) / SR_ * FPS
    mixk = np.clip((t - 240) / 74, 0, 1)  # p240 -> 314 the air deepens
    x = base * (1 - mixk) + deep * mixk * 1.12
    g = level_ref * dbg(-10)
    ramp = np.ones(n, dtype=np.float32)
    ramp[:96] = np.arange(96) / 96
    ramp[-96:] = np.arange(96)[::-1] / 96
    out = np.zeros((2, LEN), dtype=np.float32)
    out[:, n0:n1] = x * g * ramp
    return out


def ui():
    """the lit cursor's click (p30) and the Orb's servo step (p345): soft, dry, placed on their frames"""
    out = np.zeros((2, LEN), dtype=np.float32)
    sfx = os.path.join(AUDIO, 'sfx', 'wav')
    for name, p, g, pn in [('dialog_ok_click--chip.wav', 30, -30, -0.55), ('orb_servo.wav', 345, -34, 0.1)]:
        x = read(os.path.join(sfx, name)) * dbg(g)
        gl, gr = pan(pn)
        i0 = at(p)
        n = min(x.shape[1], LEN - i0)
        out[0, i0:i0 + n] += x[0, :n] * gl * 1.4
        out[1, i0:i0 + n] += x[1, :n] * gr * 1.4
    return out


if __name__ == '__main__':
    mus, stems = music()
    rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-12)  # noqa: E731
    # the held chord enters at the level of the phrase before it (no step up: no crescendo, no riser)
    pre, held = rms(mus[:, at(180):at(240)]), rms(mus[:, at(244):at(300)])
    k = np.ones(LEN, dtype=np.float32)
    if held > pre:
        g = pre / held
        k[at(240):at(330)] = g
        for i in range(960):  # 20 ms on each side so nothing clicks
            k[at(240) - 960 + i] = 1 + (g - 1) * i / 960
            if at(330) + i < LEN:
                k[at(330) + i] = g + (1 - g) * i / 960
    mus = mus * k[None]
    ref = rms(mus[:, at(60):at(240)])
    mix = mus + room() + air(ref) + ui()
    peak = float(np.max(np.abs(mix)))
    target = 0.1  # ~ -20 dBFS RMS, a temp underscore level
    gain = min(target / rms(mix), dbg(-1.0) / peak)
    mix *= gain
    sf.write(OUT, mix.T, SR_, subtype='PCM_24')
    # a quick report: level per stretch (a hole would show here)
    for a0, a1, lab in [(0, 60, 'room + cue'), (60, 175, 'reveal + push'), (175, 240, 'nest'), (240, 286, 'plot + crest'), (286, 315, 'plunge'), (315, 360, 'room back')]:
        seg = mix[:, at(a0):at(a1)]
        print(f'{lab:16s} p{a0:3d}-{a1:3d}  rms {20 * np.log10(rms(seg)):6.1f} dBFS')
    print('peak', 20 * np.log10(np.max(np.abs(mix))), 'gain', 20 * np.log10(gain))
