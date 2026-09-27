#!/usr/bin/env python3
"""Ep1 ACT THREE (sc 18-23): the TEMP SOUND STEM for the stick reel, built from the timeline JSON.

  audio/.venv-casting/bin/python audio/reel/ep01-act3-v2/act3_bed.py
      reads  show/reel/ep01-full/ep01-act3-v2.json (ACT3_JSON=... to override)
      writes audio/reel/ep01-act3-v2/act3-bed.wav (48 kHz / 24-bit stereo, git-ignored) + act3-bed-qa.json

Why a stem (the same reason as the tag's audio/reel/ep01-tag-v2/tag_bed.py): the episode mixer
(studio/src/reel/tools/mixer.mjs) lays the takes and one temp bed per sequence, but no per-beat SFX. Act Three is
the act where sound carries the picture: 24 s of the monitor run have no voice, the call is motivated by a ring,
the post by the LEDs stopping, the act-out by a clock that stops dead and a pre-lap under black. So this stem
carries the room, the music and the SFX, and the manifest plays it as the chapter's one bed:
  {"chapter": "act3", "beat": "18.01", "cue": "MM-01", "src": "audio/reel/ep01-act3-v2/act3-bed.wav",
   "lufs": null, "loop": "none", "label": "Act Three temp stem (room + MM-01 + THE CLOCK temp + SFX)"}
The mixer still lays the 21 takes over it and ducks it under them (-10 dB), which stands in for the script's
"it thins to one instrument under the V.O. and under every real line".

Layers (every level is a measurement target; nothing was heard):
  room   server_hum (the rack's fans) at -40 LUFS, 18.01 -> the cut to black at 23.04 (the room cuts with the picture)
  leds   the rack's LEDs ticking in straight eighths on MM-01's grid (96 bpm), very soft; OUT from 20.02 (he posts,
         "the LEDs' tick drops out of the bed") to 20.06 (back on the two-shot, "the LEDs resume"); out at 23.04
  music  MM-01 WATER LINE, its underscore render, entering at (23.01's start mod one bar) so its bar lines land on 23.01
         (bar 1 of THE CLOCK): bars 1-26, then the cue's loop (bars 3-26) once, then bars 3.. up to 23.01. -26 LUFS
         (at 153.67 s: enters at 1.167 s; the last part is bars 3-9, ending on bar 10's downbeat = 23.01)
  clock  THE CLOCK (MM-14's step figure, no render yet): a temp step figure on the felt piano, one step a beat for
         bars 1-3 of sc 23, stopped dead on bar 4's downbeat (23.04, the cut to black). -26 LUFS
  sfx    each beat's `sounds` (build_timeline.py SOUNDS): SFX-board files (audio/sfx/wav) at a peak level, and the
         synth:<kind> sounds made below (the slot whir, the chime, the ring, the keys, the claps and applause, the
         scroll, the glass; the crane's diesel grind and the glass tings under the black only when build_timeline.py's
         PRELAP is True: held out since the clarity pass, 2026-09-27, until Act Four's premix carries the crane, audit #37)
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
TL = os.environ.get('ACT3_JSON') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-act3-v2.json')
OUT = os.environ.get('ACT3_BED_OUT') or os.path.join(HERE, 'act3-bed.wav')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
MM01 = os.path.join(ROOT, 'audio/ost/tracks/mm01-water-line/render/mm01-water-line-underscore.wav')
FELT = os.path.join(SFXD, 'piano_fired_F4--felt.wav')
SR = 48000
FPS = 24
BAR = 2.5                     # MM-01: 96 bpm, 4/4
BEAT = BAR / 4
MUSIC_IN = 0.5                # act time of MM-01's 0.0; main() resets it to 23.01's start mod one bar, so the bar lines
                              # land on 23.01 whatever the act's length (0.5 s at 148.0 s; 1.167 s at 153.67 s, 57 bars)
LOOP = (5.0, 65.0)            # the cue's loop, bars 3-26 (mm01-water-line.cue.json description)
rng = np.random.default_rng(1810)
meter = pyloudnorm.Meter(SR)


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


def st(x):
    return np.stack([x, x], 1) if x.ndim == 1 else x


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
        x[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    if fout > 0:
        k = min(len(x), int(fout * SR))
        x[-k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    return x


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def repitch(x, ratio):
    n = int(len(x) / ratio)
    src = np.arange(n) * ratio
    return np.stack([np.interp(src, np.arange(len(x)), x[:, c]) for c in range(x.shape[1])], axis=1)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def clap(n_len=0.12, lo=700, hi=2600):
    n = int(n_len * SR)
    return bp(rng.standard_normal(n), lo, hi, 2) * env_exp(n, 0.018)


def crowd(dur, rate, lo, hi):
    """a crowd of claps: `rate` claps a second, spread at random"""
    n = int(dur * SR)
    out = np.zeros(n + int(0.2 * SR))
    for t in rng.uniform(0, dur, int(rate * dur)):
        c = clap(0.1, lo, hi) * rng.uniform(0.5, 1.0)
        i = int(t * SR)
        out[i: i + len(c)] += c
    return out[:n]


# ------------------------------------------------------------------ made sounds (synth:<kind>)
def synth(kind, dur):
    if kind == 'slot_whir':               # the rack's drive slot: a small motor, the tray sliding, its stop
        n = int(1.25 * SR)
        t = np.arange(n) / SR
        f = 95 + 30 * np.minimum(1, t / 0.15)
        motor = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.25
        slide = bp(rng.standard_normal(n), 400, 2400) * 0.35
        e = np.minimum(1, t / 0.08) * np.minimum(1, (1.25 - t) / 0.1)
        x = st(lp(motor, 900) * e + slide * e)
        k = load(os.path.join(SFXD, 'key_tap_space.wav'))
        out = np.zeros((n + len(k), 2))
        out[:n] += x
        out[n - 800: n - 800 + len(k)] += k * 1.5
        return out
    if kind == 'chime':                   # a soft two-note chip chime on F (F5, then C6); never a startup chord
        out = np.zeros((int(1.2 * SR), 2))
        for f0, t0 in ((698.46, 0.0), (1046.5, 0.16)):
            n = int(0.9 * SR)
            t = np.arange(n) / SR
            sq = np.sign(np.sin(2 * np.pi * f0 * t)) * 0.5 + np.sin(2 * np.pi * f0 * t) * 0.5
            x = lp(sq, 3500) * np.exp(-t / 0.22) * np.minimum(1, t / 0.004)
            add(out, st(x), t0)
        return out
    if kind == 'murmur':                  # an audience or a man mid-sentence, down to a murmur on a monitor
        d = dur or 1.8
        n = int(d * SR)
        am = np.interp(np.arange(n), np.linspace(0, n, int(d * 5) + 2), rng.uniform(0.2, 1.0, int(d * 5) + 2))
        x = bp(rng.standard_normal(n), 250, 1800) * am
        return fade(st(x), 0.15, 0.3)
    if kind == 'copy':                    # THE COPY (MM-13) on chip: the answer, then the failed copy a hair flat
        p = load(os.path.join(SFXD, 'tower_pluck_1_F4--chip.wav'))
        out = np.zeros((int(len(p) * 1.2 + 0.4 * SR), 2))
        add(out, p, 0.0)
        add(out, repitch(p, 0.94) * 0.7, 0.21)
        return out
    if kind == 'ring':                    # a phone ringing on a desk: a two-tone trill in bursts
        d = dur or 1.0
        n = int(d * SR)
        t = np.arange(n) / SR
        trill = np.where(np.sin(2 * np.pi * 18 * t) > 0, 1400.0, 1750.0)
        x = np.sin(2 * np.pi * np.cumsum(trill) / SR)
        gate = ((t % 0.6) < 0.4).astype(float)
        gate = np.convolve(gate, np.ones(240) / 240, mode='same')
        return fade(st(bp(x * gate, 600, 4000)), 0.01, 0.05)
    if kind == 'keys':                    # his keys (typed, not voiced)
        k = load(os.path.join(SFXD, 'typing_soft.wav'))
        return fade(tile(k, int((dur or 2.0) * SR)), 0.02, 0.1)
    if kind == 'call_keys':               # Gerg's keys down the line: typing through the call's band
        k = load(os.path.join(SFXD, 'typing_soft.wav'))
        x = bp(tile(k, int((dur or 5.0) * SR)), 350, 3400, 2)
        return fade(x, 0.1, 0.4)
    if kind == 'crackle':                 # a small framed lightning bolt crackling in the monitor's corner
        d = dur or 0.8
        n = int(d * SR)
        x = np.zeros(n)
        for t0 in rng.uniform(0, d, int(d * 60)):
            i = int(t0 * SR)
            c = rng.standard_normal(90) * np.exp(-np.arange(90) / 20)
            x[i: i + 90] += c[: n - i] * rng.uniform(0.3, 1)
        buzz = np.sign(np.sin(2 * np.pi * 120 * np.arange(n) / SR)) * 0.05
        return fade(st(bp(x, 1200, 7000) + lp(buzz, 600)), 0.02, 0.1)
    if kind == 'claps':                   # the two copies clapping, small, through the monitor's speaker
        d = dur or 4.0
        n = int(d * SR)
        x = np.zeros(n + SR)
        for who in range(2):
            t0 = 0.05 * who
            while t0 < d:
                c = clap(0.1, 900, 3000) * rng.uniform(0.7, 1.0)
                i = int(t0 * SR)
                x[i: i + len(c)] += c
                t0 += rng.uniform(0.40, 0.48)
        return fade(st(bp(x[:n], 500, 4000)), 0.02, 0.35)
    if kind == 'applause':                # DevDay's crowd, carried over the cut from the copies' clap
        d = dur or 3.0
        return fade(st(crowd(d, 90, 600, 3200)), 0.08, 1.0)
    if kind == 'flutter':                 # the order's scroll pouring out and running on across the floor
        f = load(os.path.join(SFXD, 'paper_flutter.wav'))
        n = int((dur or 3.0) * SR)
        out = np.zeros((n + len(f), 2))
        t0 = 0.0
        while t0 < (dur or 3.0):
            add(out, fade(f, 0.05, 0.2) * rng.uniform(0.7, 1.0), t0)
            t0 += 0.7
        return fade(out[:n], 0.05, 0.03)        # it stops when the glass lands
    if kind == 'glass_set':               # the glass set down on the scroll: a knock and a short glass ring
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        knock = lp(rng.standard_normal(n), 700) * np.exp(-t / 0.02) * 1.5
        ring = (np.sin(2 * np.pi * 2630 * t) + 0.6 * np.sin(2 * np.pi * 3950 * t)) * np.exp(-t / 0.12) * 0.25
        return st(knock + ring)
    if kind == 'crane':                   # Las Vegas pre-lap: a crane truck's diesel grind, fading up under black
        d = dur or 1.5
        n = int((d + 1.0) * SR)             # runs on into the stem's tail
        t = np.arange(n) / SR
        fire = (np.sin(2 * np.pi * 23 * t) > 0.6).astype(float)
        eng = lp(fire * rng.standard_normal(n) * 0.8 + np.sin(2 * np.pi * 46 * t) * 0.4, 300, 2)
        whine = np.sin(2 * np.pi * (410 + 20 * np.sin(2 * np.pi * 0.7 * t)) * t) * 0.05
        return fade(st(eng + whine), 0.5, 0.3)
    if kind == 'tings':                   # a dozen small glass tings (the suite's glasses shivering)
        n = int(1.2 * SR)
        x = np.zeros(n)
        for t0 in np.sort(rng.uniform(0, 0.7, 12)):
            f0 = rng.uniform(2800, 5200)
            m = int(0.25 * SR)
            tt = np.arange(m) / SR
            g = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt / 0.07) * rng.uniform(0.4, 1.0)
            i = int(t0 * SR)
            x[i: i + m] += g[: n - i]
        return st(x)
    raise KeyError(kind)


def sound(name, dur):
    if name.startswith('synth:'):
        return synth(name[6:], dur)
    x = load(os.path.join(SFXD, name + '.wav'))
    if dur:
        x = fade(x[: int(dur * SR)], 0.0, 0.05)
    return x


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
    t_post, t_resume = starts['20.02'][0], starts['20.06'][0]
    t_clock, t_black = starts['23.01'][0], starts['23.04'][0]
    global MUSIC_IN
    MUSIC_IN = round(t_clock % BAR, 6)     # (ep1s-act3fix) was a constant 0.5, right only while 23.01 sat at 138.0 s
    qa = {'timeline': os.path.relpath(TL, ROOT), 'act_seconds': round(total, 3), 'stem_seconds': round(N / SR, 3),
          'layers': [], 'sfx': []}

    # room: the fans, cut with the picture at the black
    room = to_lufs(load(os.path.join(SFXD, 'server_hum.wav')), -40)
    room = fade(tile(room, int(t_black * SR)), 0.4, 0.02)
    bus = np.zeros((N, 2))
    add(bus, room, 0.0)
    qa['layers'].append({'layer': 'room', 'src': 'audio/sfx/wav/server_hum.wav', 'lufs': -40, 'from': 0.0, 'to': round(t_black, 3)})

    # leds: straight eighths on the music's grid, out from the post to the cut back after the edit, out at the black
    tick_n = int(0.012 * SR)
    tt = np.arange(tick_n) / SR
    tick = st(np.sin(2 * np.pi * 3300 * tt) * np.exp(-tt / 0.002)) * db(-44)
    n_ticks = 0
    t = MUSIC_IN
    while t < t_black - 0.01:
        if not (t_post <= t < t_resume):
            add(bus, tick * (1.0 if int(round((t - MUSIC_IN) / (BEAT / 2))) % 2 == 0 else 0.7), t)
            n_ticks += 1
        t += BEAT / 2
    qa['layers'].append({'layer': 'leds', 'what': 'a 12 ms 3.3 kHz tick, peak -44 dBFS, straight eighths at 96 bpm',
                         'out': [round(t_post, 3), round(t_resume, 3)], 'ticks': n_ticks})

    # music: MM-01 underscore, bars 1-26, the loop (bars 3-26), then bars 3-7; ends on 23.01 = its bar 8 downbeat
    mm = load(MM01)
    parts, at, cur = [], MUSIC_IN, 0.0
    plan = [(0.0, LOOP[1]), (LOOP[0], LOOP[1])]
    for a, b in plan:
        parts.append((at, a, b)); at += b - a
    rest = t_clock - at
    parts.append((at, LOOP[0], LOOP[0] + rest))
    music = np.zeros((N, 2))
    for k, (t0, a, b) in enumerate(parts):
        seg = mm[int(a * SR): int(b * SR)]
        seg = fade(seg, 0.01 if k else 0.3, 0.01)
        if k + 1 < len(parts):             # the pass's own tail (the material after b, up to 1 s) rings out under the jump
            tail = fade(mm[int(b * SR): int((b + 1.0) * SR)], 0.0, 1.0)
            add(music, tail, t0 + (b - a))
        add(music, seg, t0)
    music[int(t_clock * SR):] *= 0
    i0, i1 = int(MUSIC_IN * SR), int(t_clock * SR)
    music[i1 - int(0.15 * SR): i1] *= (np.cos(np.linspace(0, np.pi / 2, int(0.15 * SR))) ** 2)[:, None]
    g = db(-26 - lufs(music[i0:i1]))
    bus += music * g
    qa['layers'].append({'layer': 'music', 'cue': 'MM-01 Water Line', 'src': os.path.relpath(MM01, ROOT), 'lufs': -26,
                         'parts': [{'at': round(p[0], 3), 'file_from': p[1], 'file_to': round(p[2], 3)} for p in parts],
                         'ends': round(t_clock, 3), 'note': 'bar lines land on 23.01 (bar 1 of THE CLOCK)'})

    # THE CLOCK (temp): one step a beat on the felt, bars 1-3 of sc 23, stopped dead on bar 4's downbeat (the black)
    felt = load(FELT)
    steps = [-12, -10, -9, -7, -5, -7, -9, -10, -12, -10, -9, -7]      # semitones from F4: F3 G3 Ab3 Bb3 C4 ...
    clock = np.zeros((N, 2))
    for k, s in enumerate(steps):
        t0 = t_clock + k * BEAT
        if t0 >= t_black - 0.01:
            break
        note = repitch(felt, 2 ** (s / 12))[: int(1.2 * SR)]
        add(clock, fade(note, 0.003, 0.25) * (1.0 if k % 4 == 0 else 0.8), t0)
        tk = load(os.path.join(SFXD, 'key_tap_soft_03.wav'))
        add(clock, lp(tk, 2500) * 0.6, t0)
    ib = int(t_black * SR)
    clock[ib - int(0.008 * SR): ib] *= np.linspace(1, 0, int(0.008 * SR))[:, None]
    clock[ib:] = 0
    clock = clock * db(-26 - lufs(clock[int(t_clock * SR): ib]))
    bus += clock
    qa['layers'].append({'layer': 'clock', 'cue': 'MM-14 THE CLOCK (temp: a felt step figure; MM-14 not rendered)',
                         'lufs': -26, 'from': round(t_clock, 3), 'stops_dead': round(t_black, 3), 'steps': len(steps)})

    # sfx
    for b in beats:
        s0, s1 = starts[b['id']]
        for s in b.get('sounds', []):
            x = sound(s['name'], s.get('dur'))
            x = to_peak(x, s['gain'])
            add(bus, x, s0 + s['at'])
            qa['sfx'].append({'beat': b['id'], 'name': s['name'], 'at_act': round(s0 + s['at'], 3), 'peak_dbfs': s['gain'],
                              'len_s': round(len(x) / SR, 3)})

    # checks
    peak = float(np.abs(bus).max())
    if peak > db(-3):
        bus *= db(-3) / peak
        qa['trimmed_to_peak_dbfs'] = -3
    body = bus[: int(total * SR)]
    win = int(0.5 * SR)
    silent = [round(i / SR, 2) for i in range(0, len(body) - win, win // 2) if np.abs(body[i: i + win]).max() < db(-70)]
    qa.update({'lufs_integrated': round(lufs(body), 2), 'peak_dbfs': round(20 * np.log10(np.abs(bus).max()), 2),
               'digital_silences_0.5s': silent})
    sf.write(OUT, bus, SR, subtype='PCM_24')
    with open(os.path.join(HERE, 'act3-bed-qa.json'), 'w') as fh:
        json.dump(qa, fh, indent=1)
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {N / SR:.2f} s, {qa["lufs_integrated"]} LUFS, peak {qa["peak_dbfs"]} dBFS, '
          f'{len(qa["sfx"])} sfx, silences {silent}')


if __name__ == '__main__':
    main()
