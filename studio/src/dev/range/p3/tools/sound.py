#!/usr/bin/env python3
"""MR. MAS - range/p3 (Prototype 3, 12.A THE RECONSTRUCTION's table): the TEMP sound, 15.000 s at 48 kHz.

Written to picture (24 fps, 96 BPM: beat 15 f, bar 60 f). The score uses the OST engine (audio/ost/engine,
imported read-only; nothing is written under audio/); the beds and the machine's clicks are synthesised here.
No dialogue, no voice of anyone: the room's murmur is filtered noise shaped into syllable-rate bursts (walla).

  p0-29     the Ep12 dinner bed (room tone, murmur, cutlery) under the finale cue: chip lead + felt + bass
  p30-44    the band slides away: the bed thins, the monitor tone rises one step, the lead steps toward acoustic
  p45-65    the render front: a soft raster sweep that travels right to left with the beam
  p66-119   the glide: sparse clicks as the room cools to points; the cue in piano/strings
  p120-209  the room resolves like the picture: the clicks converge into a full-band 2015 dining room ~10 dB under;
            a fine granular settle as the guests assemble (p128-146)
  p263      ONE piano chord for the whole set of stat bars
  p270-306  the window: the cue thins to a pedal; the 2015 room goes on under it (the cursor makes no sound)
  p296-326  the collapse: the people come apart (the granular settle in reverse), everything drains into the monitor's
            tone; the cue dips but never drops out
  p330-343  the render front again, right to left; the dinner bed comes back up in phase under it and the cue lands
            the phrase in its own timbre (chip lead)

  ../../../../../audio/.venv-theme/bin/python src/dev/range/p3/tools/sound.py <out.wav>
"""
import os
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'audio', 'ost'))
from engine import *  # noqa: E402,F401,F403
from engine.core import SR, lp, hp, bp  # noqa: E402

DUR = 15.0
N = int(DUR * SR)
fr = lambda f: int(round(f / 24 * SR))  # noqa: E731
rng = np.random.default_rng(1203)


def env(points, n=N):
    """piecewise-linear gain over frames: [(frame, gain), ...]"""
    xs = np.array([fr(p[0]) for p in points], dtype=float)
    ys = np.array([p[1] for p in points], dtype=float)
    return np.interp(np.arange(n), xs, ys)


def dbg(d):
    return 10 ** (d / 20)


# ------------------------------------------------------------------ the score (OST engine)
def score():
    g = Grid(bpm=96, meter='4/4', bars=7, swing=1.0)
    a = Arr(g)
    T = palette()
    T['felt'].gain_db = -1
    # bar 1: the finale cue in the show's own timbre; at the door (beat 3) the phrase passes to the felt + strings
    a.ch('felt', voice('Fm(add9)', 'drop2', around='C4'), (1, 1), '4b', 0.33, roll=0.012)
    a.n('ubass', 'F2', (1, 1), '2b', 0.42)
    a.n('ubass', 'C3', (1, 3), '1b', 0.34)
    a.line('lead', 'F5/4 F5/4', (1, 1), vel=0.36, duty=0.25, rel=0.08)
    a.line('felt', 'F5/4 G5/8 F5/8', (1, 3), vel=0.42, swing=True)
    a.n('vln1', 'F5', (1, 3), '2b', 0.26, art='sus')
    # bar 2: the machine plays straight; the phrase lands on the felt, strings under (Dbmaj7)
    a.line('felt', 'C5/4 F5/2.', (2, 1), vel=0.4)
    a.ch('vla', ['Ab3', 'C4', 'F4'], (2, 1), '4b', 0.24, art='sus')
    a.ch('vc', ['Db3'], (2, 1), '4b', 0.24, art='sus')
    # bars 3-4: the room resolves: a quiet felt line over Bbm9 -> C7sus(b9), strings sustained
    a.ch('vla', ['Db4', 'F4', 'Ab4'], (3, 1), '4b', 0.26, art='sus')
    a.ch('vc', ['Bb2', 'F3'], (3, 1), '4b', 0.26, art='sus')
    a.line('felt', 'Ab4/4 G4/4 F4/4 C5/4', (3, 1), vel=0.3)
    a.ch('vla', ['Bb3', 'Eb4', 'Gb4'], (4, 1), '4b', 0.26, art='sus')
    a.ch('vc', ['C3', 'G3'], (4, 1), '4b', 0.26, art='sus')
    a.line('felt', 'Bb4/2 G4/2', (4, 1), vel=0.28)
    # bar 5: strings hold Fm; ONE piano chord as the last bar fills (p263 = bar 5, beat 2 + 8 frames)
    a.ch('vla', ['Ab3', 'C4', 'F4'], (5, 1), '2b', 0.24, art='sus')
    a.ch('vc', ['F2', 'C3'], (5, 1), '2b', 0.26, art='sus')
    a.ch('felt', ['F2', 'C3', 'Ab3', 'Eb4', 'G4', 'C5'], (5, 1 + 23 / 15), '3b', 0.46, roll=0.018)
    # bar 5 beat 3 -> bar 6 beat 2: the window: the cue thins to a pedal (F and C, no third)
    a.ch('vc', ['F2'], (5, 3), '6b', 0.3, art='sus')
    a.ch('vla', ['C4'], (5, 3), '6b', 0.2, art='sus')
    # bar 6 beat 3 (p330): the dinner bed returns in phase; the cue in its own timbre lands the phrase
    a.line('lead', 'C5/4 F5/2', (6, 3), vel=0.34, duty=0.125, rel=0.2)
    a.ch('felt', ['F3', 'C4', 'F4'], (6, 3), '2b', 0.3, roll=0.01)
    a.n('ubass', 'F2', (6, 3), '2b', 0.36)
    sc = Score('p3-temp', g, T, a.notes, meta=dict(id='p3-temp'))
    stems = render_score(sc, verbose=False)
    mix = np.zeros((2, N))
    for fam, x in stems.items():
        n = min(N, x.shape[1])
        mix[:, :n] += x[:, :n]
    return mix


# ------------------------------------------------------------------ beds (synthesised)
def pink(n):
    w = rng.standard_normal(n)
    f = np.fft.rfft(w)
    k = np.arange(len(f)); k[0] = 1
    return np.fft.irfft(f / np.sqrt(k), n)


def murmur(n, voices=10, bright=1.0, seed=0):
    """wordless walla: formant-band noise gated at syllable rate, voices panned across the room"""
    r = np.random.default_rng(seed)
    out = np.zeros((2, n))
    t = np.arange(n) / SR
    for v in range(voices):
        src = r.standard_normal(n)
        f1, f2 = r.uniform(380, 700), r.uniform(1100, 1900) * bright
        x = bp(src, f1 * 0.8, f1 * 1.25) * 0.8 + bp(src, f2 * 0.85, f2 * 1.2) * 0.45
        # syllables: 3-6 Hz bursts inside phrases of a few seconds, with pauses
        syl = np.clip(np.sin(2 * np.pi * r.uniform(3, 6) * t + r.uniform(0, 6)), 0, None) ** 1.5
        phrase = np.clip(np.sin(2 * np.pi * r.uniform(0.12, 0.3) * t + r.uniform(0, 6)) + 0.35, 0, 1)
        x = x * syl * phrase
        p = r.uniform(-0.8, 0.8)
        out[0] += x * np.sqrt((1 - p) / 2); out[1] += x * np.sqrt((1 + p) / 2)
    return out / voices


def ting(f0, dur, amp, kind='glass'):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == 'glass':
        parts = [(1.0, 1.0, 1.2), (2.76, 0.5, 2.2), (5.4, 0.25, 4.0), (8.9, 0.12, 6.0)]
    else:  # cutlery: short, bright, a noise transient
        parts = [(1.0, 0.8, 18.0), (2.2, 0.6, 25.0), (3.9, 0.4, 35.0), (6.1, 0.2, 45.0)]
    y = np.zeros(n)
    for m, a, d in parts:
        y += a * np.sin(2 * np.pi * f0 * m * t + rng.uniform(0, 6)) * np.exp(-t * d / dur * (1 if kind == 'glass' else 0.1))
    if kind != 'glass':
        tr = rng.standard_normal(min(n, int(0.004 * SR))) * np.linspace(1, 0, min(n, int(0.004 * SR)))
        y[:len(tr)] += hp(tr, 2500) * 0.6
    return y * amp


def events(n, rate, t0, t1, fn, pan=0.9):
    out = np.zeros((2, n))
    t = t0
    while True:
        t += rng.exponential(1 / rate)
        if t >= t1:
            break
        y = fn()
        s = int(t * SR)
        e = min(n, s + len(y))
        if e <= s:
            continue
        p = rng.uniform(-pan, pan)
        out[0, s:e] += y[:e - s] * np.sqrt((1 - p) / 2); out[1, s:e] += y[:e - s] * np.sqrt((1 + p) / 2)
    return out


def room_tone():
    p = os.path.join(ROOT, 'audio', 'sfx', 'wav', 'room_tone.wav')
    x, sr = sf.read(p, always_2d=True)
    x = x.T
    reps = int(np.ceil(N / x.shape[1]))
    y = np.tile(x, reps)[:, :N]
    return y if y.shape[0] == 2 else np.vstack([y, y])


def build(out):
    cue = score()
    # the present-day dinner bed: one continuous signal, ducked while the model's room plays (so it returns in phase)
    bed = murmur(N, 9, 0.9, 11) * 0.5 + room_tone() * dbg(-18)
    bed += events(N, 1.6, 0, DUR, lambda: ting(rng.uniform(2600, 4200), 0.22, 0.05, 'cut'))
    bed += events(N, 0.5, 0, DUR, lambda: ting(rng.uniform(1900, 2800), 1.0, 0.03, 'glass'))
    bed = lp(bed, 5200)
    bed *= env([(0, dbg(-4)), (29, dbg(-4)), (44, dbg(-16)), (58, 0.0), (326, 0.0), (332, dbg(-16)), (344, dbg(-4)), (360, dbg(-4))])
    # the machine's clicks: sparse, thickening with the bloom wave, then tonal as the objects condense
    clicks = np.zeros((2, N))
    for f0, f1, rate, amp in [(66, 80, 8, 0.035), (80, 100, 18, 0.04), (100, 122, 12, 0.035)]:
        clicks += events(N, rate, f0 / 24, f1 / 24, lambda a=amp: hp(rng.standard_normal(int(0.0025 * SR)) * np.hanning(int(0.0025 * SR)), 3000) * a)
    clicks += events(N, 14, 96 / 24, 124 / 24, lambda: ting(rng.uniform(3000, 5200), 0.12, 0.03, 'glass'))
    # the render fronts: filtered noise whose band and pan travel right to left with the beam (p45-65, p330-343)
    def sweep(f0, f1, amp):
        n0, n1 = fr(f0), fr(f1)
        L = n1 - n0
        src = rng.standard_normal(L)
        t = np.linspace(0, 1, L)
        e = np.sin(np.pi * t) ** 1.5
        # a narrow band that slides down in pitch as the beam crosses the room, and a pan from right to left
        y = np.zeros(L)
        for k in range(8):
            a, b = int(k * L / 8), int((k + 1) * L / 8)
            fc = 6200 - 3400 * (k + 0.5) / 8
            y[a:b] = bp(src, fc * 0.8, fc * 1.25)[a:b]
        y *= e * amp
        pan = 0.8 - 1.6 * t
        out = np.zeros((2, N))
        out[0, n0:n1] = y * np.sqrt((1 - pan) / 2); out[1, n0:n1] = y * np.sqrt((1 + pan) / 2)
        return out
    clicks += sweep(45, 66, 0.07) + sweep(330, 344, 0.06)
    # the guests assemble (points landing: a fine granular settle) and, at the end, come apart (the same, reversed)
    def grains(f0, f1, rate0, rate1, amp):
        out = np.zeros((2, N)); t = f0 / 24
        while t < f1 / 24:
            u = (t * 24 - f0) / max(1, f1 - f0)
            t += rng.exponential(1 / (rate0 + (rate1 - rate0) * u))
            g = hp(rng.standard_normal(int(0.004 * SR)) * np.hanning(int(0.004 * SR)), 5000) * amp * np.sin(np.pi * min(1, u))
            s0 = int(t * SR); e0 = min(N, s0 + len(g))
            if e0 <= s0: continue
            p = rng.uniform(-0.7, 0.7)
            out[0, s0:e0] += g[:e0 - s0] * np.sqrt((1 - p) / 2); out[1, s0:e0] += g[:e0 - s0] * np.sqrt((1 + p) / 2)
        return out
    clicks += grains(126, 148, 60, 20, 0.03) + grains(296, 318, 20, 70, 0.03)
    # the 2015 dining room, fuller and wider ("recorded"), ~10 dB under the cue; it goes on under the window
    room15 = murmur(N, 16, 1.15, 23) * 0.62
    room15 += events(N, 2.6, 5.0, DUR, lambda: ting(rng.uniform(2400, 4600), 0.25, 0.06, 'cut'))
    room15 += events(N, 1.1, 5.2, DUR, lambda: ting(rng.uniform(1700, 3100), 1.4, 0.045, 'glass'))
    # a short early-reflection room on it (it was a room)
    for dly, g in [(0.013, 0.35), (0.029, 0.25), (0.047, 0.18), (0.071, 0.12)]:
        d = int(dly * SR)
        room15[:, d:] += room15[:, :-d] * g * np.array([[0.9], [1.0]])
    room15 *= env([(0, 0), (112, 0), (140, dbg(-12)), (210, dbg(-12)), (270, dbg(-15)), (298, dbg(-15)), (316, dbg(-24)), (328, dbg(-40)), (334, 0), (360, 0)])
    # the monitor's tone: F5, up one step (G5) at the door; low under the render; the room drains into it
    t = np.arange(N) / SR
    fmon = np.where(t < fr(30) / SR, 698.46, 783.99)
    fmon = np.where(t >= fr(330) / SR, 698.46, fmon)
    ph = 2 * np.pi * np.cumsum(fmon) / SR
    mon = (np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph))
    mon *= env([(0, dbg(-40)), (29, dbg(-40)), (31, dbg(-34)), (44, dbg(-33)), (60, dbg(-38)), (304, dbg(-40)), (318, dbg(-31)), (327, dbg(-25)), (334, dbg(-36)), (346, dbg(-44)), (360, dbg(-44))])
    mon = np.vstack([mon, mon])
    # the cue: full in bar 1, thinning after the door, a pedal at the window, gone into the tone, back at p330
    cue *= env([(0, 1.0), (30, 1.0), (45, 0.9), (262, 0.9), (270, 0.8), (298, 0.6), (318, 0.36), (327, 0.3), (333, 0.85), (340, 1.0), (360, 1.0)])
    mix = cue * dbg(-3) + bed + clicks + room15 + mon
    # a gentle bus: soft clip, then peak to -1 dBFS
    mix = np.tanh(mix * 1.2) / 1.2
    pk = np.max(np.abs(mix))
    mix *= dbg(-1.0) / max(pk, 1e-9)
    # the last 10 ms fade (the clip ends mid-phrase on the reel)
    k = int(0.01 * SR)
    mix[:, -k:] *= np.linspace(1, 0, k)
    sf.write(out, mix.T, SR, subtype='PCM_24')
    print('wrote', out, mix.shape, 'peak', 20 * np.log10(np.max(np.abs(mix))))


if __name__ == '__main__':
    build(sys.argv[1])
