#!/usr/bin/env python3
"""Ep1 ACT TWO (sc 13-17): the TEMP SOUND STEM for the stick reel, built from the timeline JSON.

  audio/.venv-casting/bin/python audio/reel/ep01-act2-v2/act2_bed.py
      reads  show/reel/ep01-full/ep01-act2-v2.json (ACT2_JSON=... to override)
      writes audio/reel/ep01-act2-v2/act2-bed.wav (48 kHz / 24-bit stereo, git-ignored) + act2-bed-qa.json

Written by the Act Two fixer pass (ep1s-act2fix, 2026-09-27) on the model of audio/reel/ep01-act3-v2/act3_bed.py.
Why a stem: the episode mixer (studio/src/reel/tools/mixer.mjs) lays the recorded takes and one temp bed per
sequence, but no per-beat SFX. The v2 audit (show/episodes/ep01/production/stick/audit-v2.md, package F2) found Act
Two's written sound turns silent in the reel: the anchor's murmur that IS sc 14's device (#25), the gallery's gasp and
the moth on the wallet (#29), KA-CHING and the bell that end the act (#32). And MM-19's Fountain Pen loop played
from the first frame, 50 s before its owner walks in, restarting under Radnus's barb (#22). So this stem carries the
room, the music and the SFX for the whole act, and the manifest plays it as the chapter's one bed:
  {"chapter": "act2", "beat": "13.01", "cue": "MM-19", "src": "audio/reel/ep01-act2-v2/act2-bed.wav",
   "lufs": null, "loop": "none", "xfade": 0.05, "label": "Act Two temp stem (room + temp score + SFX)"}
(the 0.05 s xfade is audit #21's seam fix: Act Two's sound starts on its first frame). The mixer still lays the 39
takes over it and ducks it under them (-10 dB), which stands in for the script's "thins under the lines".

Layers (every level is a measurement target; nothing was heard):
  room    per beat, from the timeline's `room` field, cut with the picture (0.12 s crossfades):
            whitehouse    the SFX board's bed_boardroom_day (HVAC, a city through glass) at -44 LUFS, plus a mantel
                          clock (a made wooden tick-tock at 1 Hz, peak -44 dBFS)
            bullpen-night server_hum through glass (low-passed 900 Hz) at -46 LUFS
            bay           water on pilings (made: low-passed noise with slow lapping swells) + far traffic, -42 LUFS
            senate        room_tone at -41 LUFS + the gallery that never quite settles (a made low murmur, -49 LUFS)
            rooftop       wind (made: low-passed noise with slow gusts) at -40 LUFS; it cuts with the black
            black, none   nothing (the poster run is score only)
  score   temp stand-ins, placed by beat (the script's MUSIC lines):
            sc 13  MM-19's podium palette has no render, so a B-flat chamber pad (Bbmaj9 / Ebmaj9, 96 bpm, with
                   soft pizzicato pulses) at -28 LUFS from the first frame; at Nedib's door (13.11) the Fountain Pen
                   loop (mm19-renamed-it-fountainpen-loop.wav, bar 1) takes over at -26 LUFS, and rings out over
                   3 s on the photo (13.14)
            sc 14  no score
            sc 15  MM-20 temp pad (Dbmaj9#11 / Gm7b5, 66 bpm, 2 bars a chord) at -26 LUFS from 15.01; stops dead
                   on the wallet (15.12, 20 ms); back on a new phrase (Gm7b5 first) at 15.14; into sc 16
            sc 16  MM-03 temp pad (Abmaj9 / Db69#11, 100 bpm, 1 bar a chord) at -26 LUFS; its knee stabs are the
                   beat's synth:stab sounds, one on every stamp
            sc 17  MM-03 rings out into a held Abmaj9 pad at -30 LUFS (1.5 s crossfade), MM-05's loop render from
                   the register (17.03) at -26 LUFS, stopped dead at phrase 4 (17.11)
  murmur  sc 14's anchor: a made "too smooth" voice with no words (formant synthesis on random vowels, a perfectly
          regular pitch, no jitter), through a phone's small speaker, from 14.01 until the clone's first word over
          the black, where it stops (60 ms): the script's "so the real line that follows starts clean". It is no
          one's voice and no Kokoro voice; the anchor is invented and unvoiced in the cast. -34 LUFS.
  sfx     each beat's `sounds` (build_timeline.py SPEC): SFX-board files (audio/sfx/wav) at a peak level, and the
          synth:<kind> sounds made below (the plink, copied from the cold open's stem so it is "the exact sound";
          the gasp; the moth; the knee stab; the register's roll; the bell, rung with KA-CHING and left to decay
          through phrase 4 to the black, "CUT TO BLACK on the bell's last partial")
"""
from __future__ import annotations

import json
import os

import numpy as np
import pyloudnorm
import soundfile as sf
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
TL = os.environ.get('ACT2_JSON') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-act2-v2.json')
OUT = os.environ.get('ACT2_BED_OUT') or os.path.join(HERE, 'act2-bed.wav')
QA_OUT = os.path.join(os.path.dirname(OUT), 'act2-bed-qa.json')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
MM19 = os.path.join(ROOT, 'audio/ost/tracks/mm19-renamed-it/render/mm19-renamed-it-fountainpen-loop.wav')
MM05 = os.path.join(ROOT, 'audio/ost/tracks/mm05-the-more-you-buy/render/mm05-the-more-you-buy-loop.wav')
SR = 48000
FPS = 24
rng = np.random.default_rng(1305)
meter = pyloudnorm.Meter(SR)


# ------------------------------------------------------------------ helpers (act3_bed.py's, plus hp)
def db(x):
    return 10 ** (x / 20)


def load(p):
    x, sr = sf.read(p, always_2d=True, dtype='float64')
    assert sr == SR, (p, sr)
    return x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)


def lufs(x):
    return meter.integrated_loudness(x) if len(x) > SR * 0.4 else -70.0


def to_lufs(x, target):
    return x * db(target - lufs(x))


def to_peak(x, target):
    p = np.abs(x).max()
    return x * (db(target) / p) if p > 0 else x


def st(x, w=1.0):
    """mono -> stereo; w < 1 leaves a little width (the right channel a touch lower)"""
    return np.stack([x, x * w], 1) if x.ndim == 1 else x


def add(bus, x, t):
    i = int(round(t * SR))
    if i >= len(bus):
        return
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(bus), i + len(x))
    bus[i:j] += x[: j - i]


def tile(x, n):
    return np.concatenate([x] * (n // len(x) + 1))[:n]


def fade(x, fin=0.0, fout=0.0):
    x = x.copy()
    if fin > 0:
        k = min(len(x), int(fin * SR))
        x[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None] if x.ndim == 2 else np.sin(np.linspace(0, np.pi / 2, k)) ** 2
    if fout > 0:
        k = min(len(x), int(fout * SR))
        x[-k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None] if x.ndim == 2 else np.cos(np.linspace(0, np.pi / 2, k)) ** 2
    return x


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'high', fs=SR, output='sos'), x, axis=0)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def smooth_noise(n, rate_hz, lo=0.0, hi=1.0):
    """a slow random control curve (values in lo..hi), `rate_hz` new points a second, cosine-interpolated"""
    k = max(2, int(n / SR * rate_hz) + 2)
    pts = rng.uniform(lo, hi, k)
    x = np.linspace(0, k - 1, n)
    i = np.floor(x).astype(int).clip(0, k - 2)
    f = (1 - np.cos(np.pi * (x - i))) / 2
    return pts[i] * (1 - f) + pts[i + 1] * f


# ------------------------------------------------------------------ the temp pads (mixer.mjs's synthPad, in numpy)
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def hz(name):
    import re
    m = re.match(r'^([A-G])(b|#)?(-?\d)$', name)
    midi = 12 * (int(m.group(3)) + 1) + NOTE[m.group(1)] + (-1 if m.group(2) == 'b' else 1 if m.group(2) == '#' else 0)
    return 440 * 2 ** ((midi - 69) / 12)


CHORDS = {  # mixer.mjs's table (reelbed.py's F-minor world), plus MM-19's B-flat major chamber stand-ins
    'Fm9': ['F2', 'Ab3', 'C4', 'Eb4', 'G4'], 'Dbmaj9#11': ['Db2', 'F3', 'G3', 'C4', 'Eb4'],
    'Abmaj9': ['Ab1', 'G3', 'Bb3', 'C4', 'Eb4'], 'Gm7b5': ['G1', 'F3', 'Bb3', 'C4', 'Db4'],
    'Db69#11': ['Db2', 'F3', 'Bb3', 'Eb4', 'G4'],
    'Bbmaj9': ['Bb1', 'D3', 'F3', 'A3', 'C4'], 'Ebmaj9': ['Eb2', 'G3', 'Bb3', 'D4', 'F4'],
}


def wave(ph):
    return np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)


def pad(chords, bpm, bars_per_chord, seconds, seed=1):
    """a soft sustained pad, as mixer.mjs synthPad: each chord swells in (<= 1.2 s) and overlaps the next (<= 1.5 s),
    each voice doubled +-3 cents, a slow 0.13 Hz breathing, the voices spread a little in stereo"""
    r = np.random.default_rng(seed)
    n = int(np.ceil(seconds * SR))
    out = np.zeros((n, 2))
    ln = bars_per_chord * 4 * 60 / bpm
    att, ovl = min(1.2, ln / 3), min(1.5, ln / 2)
    k = 0
    while k * ln < seconds:
        notes = CHORDS[chords[k % len(chords)]]
        t0, t1 = k * ln, min(seconds, k * ln + ln + ovl)
        s0, s1 = int(t0 * SR), min(n, int(t1 * SR))
        t = np.arange(s1 - s0) / SR
        env = np.minimum(np.minimum(1, t / att), (t1 - t0 - t) / ovl).clip(0, 1)
        env *= 0.9 + 0.1 * np.sin(2 * np.pi * 0.13 * (s0 / SR + t))
        for vi, nm in enumerate(notes):
            amp = (0.32 if vi == 0 else 0.16) * 0.5
            pan = 0.5 if vi == 0 else 0.2 + 0.6 * ((vi - 1) / 3)
            for d in (1.0017, 0.9983):
                v = wave(2 * np.pi * hz(nm) * d * t + r.uniform(0, 2 * np.pi)) * env
                out[s0:s1, 0] += v * amp * (1 - pan)
                out[s0:s1, 1] += v * amp * pan
        k += 1
    return out


def pizz_pulses(chords, bpm, bars_per_chord, seconds):
    """the chamber stand-in's pulse: a soft plucked root on beats 1 and 3, the fifth on beat 3 an octave up"""
    n = int(np.ceil(seconds * SR))
    out = np.zeros((n, 2))
    beat = 60 / bpm
    ln = bars_per_chord * 4 * beat
    m = int(0.6 * SR)
    tt = np.arange(m) / SR
    b = 0
    while b * beat < seconds:
        root = hz(CHORDS[chords[int(b * beat // ln) % len(chords)]][0]) * 2
        if b % 4 in (0, 2):
            f0 = root if b % 4 == 0 else root * 1.5
            x = (np.sin(2 * np.pi * f0 * tt) + 0.3 * np.sin(4 * np.pi * f0 * tt)) * np.exp(-tt / 0.16) * np.minimum(1, tt / 0.004)
            add(out, st(x * (0.5 if b % 4 == 0 else 0.35), 0.9), b * beat)
        b += 1
    return out


def stab(chord='Abmaj9'):
    """MM-03's knee stab (temp): the chord hit short and bright, 5 ms attack, 0.22 s decay"""
    m = int(0.7 * SR)
    t = np.arange(m) / SR
    x = np.zeros(m)
    for vi, nm in enumerate(CHORDS[chord]):
        f0 = hz(nm) * (2 if vi == 0 else 1)
        x += (np.sin(2 * np.pi * f0 * t) + 0.35 * np.sin(4 * np.pi * f0 * t) + 0.12 * np.sin(6 * np.pi * f0 * t)) * (0.6 if vi == 0 else 0.4)
    x *= np.minimum(1, t / 0.005) * np.exp(-t / 0.22)
    return st(x, 0.92)


# ------------------------------------------------------------------ the anchor's murmur (sc 14)
VOWELS = [(800, 1200, 2500), (500, 1850, 2600), (320, 2250, 2900), (520, 950, 2450), (370, 850, 2350), (650, 1600, 2550)]


def murmur(seconds):
    """a too-smooth woman's voice with no words: additive harmonics shaped by moving vowel formants, 4.3 syllables a
    second, phrases of 1.4-2.6 s with a gentle fall and 0.2-0.35 s breaths between them, and NO jitter or shimmer
    (its smoothness is the tell). Through a phone's small speaker (350-3400 Hz) and then low-passed at 1.9 kHz, so no
    word could be made out even if there were one."""
    n = int(seconds * SR)
    ctrl = 200                                  # control points a second
    nc = int(seconds * ctrl) + 2
    f0c = np.zeros(nc)
    ampc = np.zeros(nc)
    fc = np.zeros((nc, 3))
    t = 0.0
    while t < seconds:
        plen = rng.uniform(1.4, 2.6)
        i0, i1 = int(t * ctrl), min(nc, int((t + plen) * ctrl))
        u = np.linspace(0, 1, i1 - i0)
        f0c[i0:i1] = 205 - 30 * u + 12 * np.sin(np.pi * u)          # a smooth fall across the phrase
        syl = 1 / 4.3
        k = i0
        v = VOWELS[rng.integers(len(VOWELS))]
        while k < i1:
            kn = min(i1, k + int(syl * ctrl * rng.uniform(0.8, 1.2)))
            nv = VOWELS[rng.integers(len(VOWELS))]
            w = np.linspace(0, 1, kn - k)[:, None]
            fc[k:kn] = np.array(v) * (1 - w) + np.array(nv) * w       # glide vowel to vowel
            a = np.ones(kn - k)
            dip = min(len(a), max(1, int(0.045 * ctrl)))
            a[:dip] = np.linspace(0.25, 1, dip)                        # the consonant's dip at each syllable's start
            ampc[k:kn] = a
            v, k = nv, kn
        t += plen + rng.uniform(0.2, 0.35)
    f0c[f0c == 0] = 190
    ts = np.arange(n) / SR
    tc = np.arange(nc) / ctrl
    f0 = np.interp(ts, tc, f0c)
    amp = lp(np.interp(ts, tc, ampc), 30, 2)
    F = [np.interp(ts, tc, fc[:, j]) for j in range(3)]
    ph = 2 * np.pi * np.cumsum(f0) / SR
    y = np.zeros(n)
    for h in range(1, 19):
        fh = h * f0
        g = sum(np.exp(-0.5 * ((fh - F[j]) / (70 + 30 * j)) ** 2) * (1.0, 0.7, 0.3)[j] for j in range(3))
        g = (0.08 + g) / h ** 0.8 * (fh < 3600)
        y += g * np.sin(h * ph)
    y *= amp
    y = lp(bp(y, 350, 3400, 2), 1900, 2)
    return st(y, 0.97)


# ------------------------------------------------------------------ made sounds (synth:<kind>)
def synth(kind, dur):
    if kind == 'plink':                   # the cold open's plink, the same recipe (coldopen_bed.py synth('plink'))
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        tick = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in
                   [(2950, 1.0, 0.060), (4430, 0.55, 0.035), (6120, 0.35, 0.020), (1475, 0.25, 0.045)])
        tick *= np.clip(t / 0.0008, 0, 1)
        plop = load(os.path.join(SFXD, 'plop_water.wav'))
        out = st(tick, 0.97)
        out[int(0.012 * SR): int(0.012 * SR) + len(plop)] += plop[: n - int(0.012 * SR)] * db(-9)
        return out
    if kind == 'gasp':                    # the gallery gasps as one held drawing: 40 short inhales inside 0.12 s
        n = int(0.6 * SR)
        out = np.zeros(n)
        for t0 in rng.uniform(0, 0.12, 40):
            m = int(rng.uniform(0.22, 0.34) * SR)
            tt = np.arange(m) / SR
            e = np.minimum(1, tt / 0.07) * np.exp(-np.maximum(0, tt - 0.07) / 0.06)
            x = bp(rng.standard_normal(m), rng.uniform(700, 1100), rng.uniform(2600, 4200), 2) * e * rng.uniform(0.5, 1)
            i = int(t0 * SR)
            out[i: i + m] += x[: n - i]
        return st(out, 0.95)
    if kind == 'moth':                    # a tiny moth in three drawings: three soft wing flutters, then it lands
        out = np.zeros(int(1.2 * SR))
        for k, t0 in enumerate((0.0, 0.33, 0.66)):
            m = int(0.22 * SR)
            tt = np.arange(m) / SR
            wing = (np.sin(2 * np.pi * 24 * tt) > 0).astype(float)
            x = bp(rng.standard_normal(m), 1500, 6000, 2) * lp(wing, 200, 2) * np.sin(np.pi * tt / tt[-1]) * (1 - 0.2 * k)
            i = int(t0 * SR)
            out[i: i + m] += x
        return st(out, 0.9)
    if kind == 'stab':
        return stab()
    if kind == 'roll':                    # the brass register rolling in on its own: casters on a roof, a rumble, a stop
        d = dur or 1.3
        n = int(d * SR)
        t = np.arange(n) / SR
        rum = lp(rng.standard_normal(n), 180, 2) * (1 + 0.5 * np.sin(2 * np.pi * 9 * t))
        clat = bp(rng.standard_normal(n), 1500, 4500, 2) * 0.15 * ((np.sin(2 * np.pi * 6.5 * t) > 0.8).astype(float))
        e = np.minimum(1, t / 0.25) * np.minimum(1, (d - t) / 0.08).clip(0, 1)
        return st((rum + clat) * e, 0.95)
    if kind == 'bell':                    # the register's bell, rung with KA-CHING, left to decay to the black
        d = dur or 12.0
        n = int(d * SR)
        t = np.arange(n) / SR
        f = 1396.9                                         # F6, the SFX board's bell_ding_F6 pitch
        parts = [(0.5, 0.5, 4.2), (1.0, 1.0, 3.2), (1.19, 0.35, 1.6), (1.5, 0.3, 2.0), (2.0, 0.28, 1.4),
                 (2.52, 0.14, 0.9), (3.0, 0.1, 0.7)]    # (ratio, amp, decay tau s): the hum outlasts the strike
        x = sum(a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6.28)) * np.exp(-t / tau) for r, a, tau in parts)
        x *= np.minimum(1, t / 0.002)
        return st(x, 0.96)
    raise KeyError(kind)


def sound(name, dur):
    if name.startswith('synth:'):
        return synth(name[6:], dur)
    x = load(os.path.join(SFXD, name + '.wav'))
    if dur:
        x = fade(x[: int(dur * SR)], 0.0, 0.05)
    return x


# ------------------------------------------------------------------ room kinds
def room_kind(kind, seconds):
    n = int(seconds * SR) + 1
    if kind == 'whitehouse':
        x = to_lufs(tile(load(os.path.join(SFXD, 'bed_boardroom_day.wav')), n), -44)
        tick = np.zeros((n, 2))
        m = int(0.03 * SR)
        tt = np.arange(m) / SR
        for k in range(int(seconds)):
            f0 = 2300 if k % 2 == 0 else 1900                    # tick, tock
            c = bp(rng.standard_normal(m), f0 * 0.7, f0 * 1.4, 2) * np.exp(-tt / 0.006)
            add(tick, st(c, 0.9), k + 0.37)
        return x + to_peak(tick, -44)
    if kind == 'bullpen-night':
        return to_lufs(lp(tile(load(os.path.join(SFXD, 'server_hum.wav')), n), 900, 2), -46)
    if kind == 'bay':
        lap = lp(rng.standard_normal(n), 420, 2) * smooth_noise(n, 1.3, 0.15, 1.0)
        wash = bp(rng.standard_normal(n), 900, 3500, 2) * smooth_noise(n, 0.9, 0.0, 0.35) ** 2
        traffic = lp(rng.standard_normal(n), 140, 2) * 0.6
        return to_lufs(np.stack([lap + wash + traffic, lp(rng.standard_normal(n), 420, 2) * smooth_noise(n, 1.3, 0.15, 1.0)
                                  + wash * 0.8 + traffic], 1), -42)
    if kind == 'senate':
        air = to_lufs(tile(load(os.path.join(SFXD, 'room_tone.wav')), n), -41)
        gal = bp(rng.standard_normal(n), 250, 1600, 2) * smooth_noise(n, 3.0, 0.3, 1.0) * smooth_noise(n, 0.2, 0.5, 1.0)
        return air + to_lufs(st(gal, 0.93), -49)
    if kind == 'rooftop':
        g = smooth_noise(n, 0.25, 0.35, 1.0)
        w = lp(rng.standard_normal(n), 520, 2) * g + bp(rng.standard_normal(n), 800, 2400, 2) * g ** 3 * 0.25
        w2 = lp(rng.standard_normal(n), 520, 2) * g + bp(rng.standard_normal(n), 800, 2400, 2) * g ** 3 * 0.25
        return to_lufs(np.stack([w, w2], 1), -40)
    return None                           # black, none


def main():
    doc = json.load(open(TL))
    beats = doc['beats']
    starts, acc, prev = {}, 0.0, 0
    for b in beats:                        # the reel's own frame layout (schema.ts timeEpisode, head 0)
        acc += b['reelDur']
        end = max(prev + 1, round(acc * FPS))
        starts[b['id']] = (prev / FPS, end / FPS)
        prev = end
    total = prev / FPS
    N = int((total + 1.0) * SR)
    S = lambda bid: starts[bid][0]
    E = lambda bid: starts[bid][1]
    qa = {'timeline': os.path.relpath(TL, ROOT), 'act_seconds': round(total, 3), 'stem_seconds': round(N / SR, 3),
          'layers': [], 'sfx': []}
    bus = np.zeros((N, 2))

    # ---- room: contiguous runs of one kind, cut with the picture (0.12 s crossfades)
    runs = []
    for b in beats:
        k = b.get('room') or 'none'
        s0, s1 = starts[b['id']]
        if runs and runs[-1][0] == k:
            runs[-1][2] = s1
        else:
            runs.append([k, s0, s1])
    for k, s0, s1 in runs:
        x = room_kind(k, s1 - s0 + 0.12)
        if x is None:
            continue
        x = fade(x[: int((s1 - s0 + 0.12) * SR)], 0.12 if s0 > 0 else 0.03, 0.12)
        add(bus, x, s0 - (0.06 if s0 > 0 else 0))
        qa['layers'].append({'layer': 'room', 'kind': k, 'from': round(s0, 3), 'to': round(s1, 3)})

    # ---- score
    music = np.zeros((N, 2))
    parts = []

    def place(x, t0, target, what, fin=0.02, fout=0.02):
        x = fade(x, fin, fout)
        body = x[int(fin * SR): len(x) - int(fout * SR)] if len(x) > SR else x
        x = x * db(target - lufs(body))
        add(music, x, t0)
        parts.append({'what': what, 'from': round(t0, 3), 'to': round(t0 + len(x) / SR, 3), 'lufs': target})

    # sc 13: the chamber stand-in to the door, then the Fountain Pen from bar 1, ringing out on the photo
    t_door, t_photo, t_14 = S('13.11'), S('13.14'), S('14.01')
    ch13 = ['Bbmaj9', 'Ebmaj9']
    d = t_door + 0.3
    x = pad(ch13, 96, 2, d, seed=13) + pizz_pulses(ch13, 96, 2, d) * 0.6
    place(x, 0.0, -28, "MM-19 podium palette (temp: a B-flat chamber pad + pizz pulses, 96 bpm; no render)", 0.05, 0.3)
    fp = load(MM19)
    ring_end = min(t_14 - 0.1, t_photo + 3.4)
    fp = fp[: int((ring_end - (t_door - 0.15)) * SR)]
    place(fp, t_door - 0.15, -26, "MM-19 the Fountain Pen (loop A, bar 1 on Nedib's door; rings out on the photo)",
          0.3, ring_end - t_photo - 0.3)

    # sc 15: MM-20 temp pad, the wallet's dead stop, back on a new phrase
    t15, t_wallet, t_back, t16 = S('15.01'), S('15.12'), S('15.14'), S('16.01')
    place(pad(['Dbmaj9#11', 'Gm7b5'], 66, 2, t_wallet - t15, seed=15), t15, -26,
          'MM-20 Under Oath (temp pad: Dbmaj9#11 / Gm7b5, 66 bpm), stops dead on the wallet', 0.3, 0.02)
    place(pad(['Gm7b5', 'Dbmaj9#11'], 66, 2, t16 - t_back + 0.2, seed=16), t_back, -26,
          'MM-20 back on a new phrase (temp pad: Gm7b5 first)', 0.05, 0.2)

    # sc 16-17: MM-03 run, its held pad, MM-05 from the register, the score out at phrase 4
    t17, t_reg, t_out = S('17.01'), S('17.03'), S('17.11')
    place(pad(['Abmaj9', 'Db69#11'], 100, 1, t17 - t16 + 0.75, seed=3), t16, -26,
          'MM-03 The Regulate-Me Tour (temp pad: Abmaj9 / Db69#11, 100 bpm); knee stabs = the beat sounds', 0.1, 1.5)
    place(pad(['Abmaj9'], 60, 8, t_reg - t17 + 0.75 + 0.15, seed=31), t17 - 0.75, -30,
          'MM-03 rings out into a held Abmaj9 pad (temp)', 1.5, 0.3)
    mm05 = tile(load(MM05), int((t_out - t_reg + 0.15) * SR))
    place(mm05, t_reg - 0.15, -26, "MM-05 The More You Buy (loop render), stopped dead at phrase 4", 0.3, 0.02)
    io = int(t_out * SR)
    music[io:] *= 0                                      # the act's second deliberate stop: nothing after phrase 4
    bus += music
    qa['layers'].append({'layer': 'score', 'parts': parts})

    # ---- sc 14's murmur: from 14.01 to the clone's first word over the black
    b1406 = next(b for b in beats if b['id'] == '14.06')
    clone = next(l for l in b1406['lines'] if l['id'] == 'e1-a2-15-01')
    t_on = S('14.06') + clone['t']
    t0 = S('14.01') + 0.2
    mm = murmur(t_on - t0 + 0.05)
    mm = fade(mm, 0.25, 0.06)
    lev = np.ones(len(mm))                               # a touch nearer on his phone (14.01), then the far window
    k1 = int((S('14.02') - t0) * SR)
    lev[k1:] = db(-2)
    lev = lp(lev, 8, 1)
    mm = to_lufs(mm, -34) * lev[:, None]
    add(bus, mm, t0)
    qa['layers'].append({'layer': 'murmur', 'what': "the anchor's too-smooth murmur (made: formant voice, no words, phone "
                         "band, low-passed 1.9 kHz)", 'lufs': -34, 'from': round(t0, 3), 'stops_at_clone_onset': round(t_on, 3)})

    # ---- sfx
    for b in beats:
        s0, s1 = starts[b['id']]
        for s in b.get('sounds', []):
            dur = s.get('dur')
            if s['name'] == 'synth:bell':
                dur = total + 0.5 - (s0 + s['at'])       # rings to the black's end, and a little past
            x = sound(s['name'], dur)
            x = to_peak(x, s['gain'])
            add(bus, x, s0 + s['at'])
            qa['sfx'].append({'beat': b['id'], 'name': s['name'], 'at_act': round(s0 + s['at'], 3), 'peak_dbfs': s['gain'],
                              'len_s': round(len(x) / SR, 3)})

    # ---- the end: the stem stops with the act (its last 0.3 s past the black fade to nothing)
    ie = int(total * SR)
    k = int(0.3 * SR)
    bus[ie: ie + k] *= np.linspace(1, 0, k)[:, None]
    bus[ie + k:] = 0

    # checks
    peak = float(np.abs(bus).max())
    if peak > db(-3):
        bus *= db(-3) / peak
        qa['trimmed_to_peak_dbfs'] = -3
    body = bus[: ie]
    win = int(0.5 * SR)
    silent = [round(i / SR, 2) for i in range(0, len(body) - win, win // 2) if np.abs(body[i: i + win]).max() < db(-70)]
    seg = {}
    for name, a, b2 in (('sc13', 0, S('14.01')), ('sc14', S('14.01'), S('15.01')), ('sc15', S('15.01'), S('16.01')),
                        ('sc16', S('16.01'), S('17.01')), ('sc17', S('17.01'), total), ('phrase4', S('17.11'), total)):
        seg[name] = round(lufs(bus[int(a * SR): int(b2 * SR)]), 2)
    qa.update({'lufs_integrated': round(lufs(body), 2), 'lufs_by_scene': seg,
               'peak_dbfs': round(20 * np.log10(np.abs(bus).max()), 2), 'digital_silences_0.5s': silent})
    sf.write(OUT, bus, SR, subtype='PCM_24')
    with open(QA_OUT, 'w') as fh:
        json.dump(qa, fh, indent=1)
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {N / SR:.2f} s, {qa["lufs_integrated"]} LUFS, peak {qa["peak_dbfs"]} dBFS, '
          f'{len(qa["sfx"])} sfx, by scene {seg}, silences {silent}')


if __name__ == '__main__':
    main()
