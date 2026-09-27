#!/usr/bin/env python3
"""Ep1 ACT ONE (sc 5-12): the TEMP SOUND STEM for the stick reel, built from the timeline JSON.

  audio/.venv-casting/bin/python audio/reel/ep01-act1-v2/act1_bed.py
      reads  show/reel/ep01-full/ep01-act1-v2.json (ACT1_JSON=... to override)
      writes audio/reel/ep01-act1-v2/act1-bed.wav (48 kHz / 24-bit stereo, git-ignored) + act1-bed-qa.json
      (ACT1_BED_OUT=... redirects the WAV; the QA JSON goes beside it)

Why (the Act One fix pass, 2026-09-27; audit-v2.md package F1): the episode mixer (studio/src/reel/tools/mixer.mjs)
lays the takes and one temp bed per sequence, but no per-beat SFX. In ep01-full-v2 every sound turn the script writes
for Act One was silent (the squeak, the click, the ratchet and clunk, the tsss, the siren's J-cut, the revolving door,
the pop, the key ring, Sydney's tick, the THUD, the pen), and four cues stopped on sounds that weren't there, so the
music just dropped out to bare room (the showrunner's "random pauses of silence"). This stem carries the room, the
music and the SFX in the pattern of Act Three's act3_bed.py, and the manifest plays it as the chapter's one bed:
  {"chapter": "act1", "beat": "5.01", "cue": "MM-16 / LEVERAGE / MM-04 / MM-17 / MM-14",
   "src": "audio/reel/ep01-act1-v2/act1-bed.wav", "lufs": null, "loop": "none", "in": 0, "xfade": 0.3, ...}
The mixer still lays the takes over it and ducks it under them (-10 dB).

Layers (every level is a measurement target; nothing was heard):
  room    the bullpen (server_hum -37 LUFS + one buzzing tube, neon_buzz -49), louder and duller in the basement beats
          (the drill's shaft, the hole); the NopeAI lobby (room_tone -37 + far steps); the standing desk in the dark
          (room_tone -41). It cuts with the picture at the black (12.07). ROOM_UNDUCK_DB lifts the room layer under
          speech so that, after the mixer's -10 dB duck, it dips only ~3 dB instead of sinking to near-silence between
          lines (audit #3, #14): 8 dB, so the room dips ~2 dB under a line. SET IT TO 0 when the reel owner lands audit package F3 (a per-bed duck).
  music   the temp cues that were the manifest's beds, now inside the stem:
          MM-16 temp pad (Fm11 / Bbm9, 96 bpm) from the counter's first tick to the phone lock, ringing out;
          LEVERAGE = mm08-leverage-bed-loop.wav (MM-08's seamless 4-bar loop, 96 bpm) from the check's arrival,
            stopped dead on the pop (the pop is now there), back on the key ring through sc 10, falling away under
            Sydney's tick;
          MM-04 temp pad (Fm11 / Eb9sus4, 88 bpm) for the duel, thinned under Mas's post;
          MM-17 temp pad (Bbm9 / C7#9b13, 72 bpm) from the push, cut dead by the THUD (the THUD is now there);
          MM-14 THREAT temp: a felt-piano Fm(b6) sting on the pen's lift, ringing over the black.
          The pads are a numpy port of mixer.mjs synthPad (same chord table, same envelope rule).
  tick    Sydney's egg timer, on LEVERAGE's beat grid (96 bpm), from the clip (10.03) through the pre-beat to the
          duel's downbeat (11.03), where MM-04 lands (audit #18).
  siren   Elgoog's siren through the phone's small speaker: faint under the tear's last puff (the J-cut, 7.02), up with
          the alert and the lift (8.01-8.02), under the founders (8.03-8.05), out on the lock (8.06) (audit #10).
  sfx     each beat's `sounds` (build_timeline.py SOUNDS): SFX-board files (audio/sfx/wav) at a peak level, or the
          synth:<kind> sounds made below.
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
TL = os.environ.get('ACT1_JSON') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-act1-v2.json')
OUT = os.environ.get('ACT1_BED_OUT') or os.path.join(HERE, 'act1-bed.wav')
QA_OUT = os.path.join(os.path.dirname(os.path.abspath(OUT)), 'act1-bed-qa.json')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
LEVERAGE = os.path.join(ROOT, 'audio/ost/tracks/mm08-the-falling-tile/render/variants/mm08-leverage-bed-loop.wav')
FELT = os.path.join(SFXD, 'piano_fired_F4--felt.wav')
SR = 48000
FPS = 24
BEAT96 = 60 / 96               # LEVERAGE's beat (and the drill's grid)
ROOM_UNDUCK_DB = 8.0           # see the docstring: 0 once the mixer has a per-bed duck (audit F3)
MIX_DUCK_PRE, MIX_DUCK_HOLD = 0.25, 2.5     # episode.ts defaults, mirrored for the room's un-duck envelope
rng = np.random.default_rng(1105)
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


def phone(x):
    """a phone's small speaker: 500 Hz - 3.4 kHz"""
    return bp(x, 500, 3400, 2)


def gain_env(n, points):
    """a gain curve (dB) through (seconds, dB) points, linear in dB"""
    t = np.arange(n) / SR
    ts, gs = zip(*points)
    return db(np.interp(t, ts, gs))[:, None]


# ------------------------------------------------------------------ the pads (a numpy port of mixer.mjs synthPad)
CHORDS = {
    'Fm9': ['F2', 'Ab3', 'C4', 'Eb4', 'G4'], 'Fm11': ['F2', 'Ab3', 'Bb3', 'Eb4', 'G4'],
    'Bbm9': ['Bb1', 'Ab3', 'C4', 'Db4', 'F4'], 'C7#9b13': ['C2', 'E3', 'Bb3', 'Eb4', 'Ab4'],
    'Eb9sus4': ['Eb2', 'Ab3', 'Bb3', 'Db4', 'F4'],
}
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def hz(name):
    acc = {'b': -1, '#': 1}.get(name[1], 0) if len(name) > 2 else 0
    octv = int(name[-1])
    midi = 12 * (octv + 1) + NOTE[name[0]] + acc
    return 440 * 2 ** ((midi - 69) / 12)


def pad(chords, bpm, bars_per_chord, seconds):
    """each chord swells in (up to 1.2 s) and overlaps the next by up to 1.5 s; sine + soft 2nd/3rd partials, each
    voice doubled +-3 cents, a slow 0.13 Hz breathing, the voices spread a little in stereo (mixer.mjs synthPad)"""
    n = int(seconds * SR)
    out = np.zeros((n, 2))
    ln = bars_per_chord * 4 * 60 / bpm
    att, ovl = min(1.2, ln / 3), min(1.5, ln / 2)
    k = 0
    while k * ln < seconds:
        notes = CHORDS[chords[k % len(chords)]]
        t0, t1 = k * ln, min(seconds, k * ln + ln + ovl)
        s0, s1 = int(t0 * SR), min(n, int(t1 * SR))
        t = np.arange(s1 - s0) / SR
        env = np.minimum.reduce([np.ones_like(t), t / att, (t1 - t0 - t) / ovl]) * \
            (0.9 + 0.1 * np.sin(2 * np.pi * 0.13 * (s0 / SR + t)))
        for vi, nm in enumerate(notes):
            amp = (0.32 if vi == 0 else 0.16) * 0.5
            pan = 0.5 if vi == 0 else 0.2 + 0.6 * ((vi - 1) / 3)
            for d in (1.0017, 0.9983):
                w = 2 * np.pi * hz(nm) * d * t + rng.uniform(0, 2 * np.pi)
                v = (np.sin(w) + 0.22 * np.sin(2 * w) + 0.06 * np.sin(3 * w)) * env * amp
                out[s0:s1, 0] += v * (1 - pan)
                out[s0:s1, 1] += v * pan
        k += 1
    return out


def chip(f0, dur, duty=0.25):
    """one chip note: a pulse wave with a fast decay (never an even beep, never a held tone)"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = (f0 * t) % 1.0
    x = np.where(ph < duty, 1.0, -1.0) * np.exp(-t / (dur / 3)) * np.minimum(1, t / 0.002)
    return lp(x, 6000)


def clap(n_len=0.12, lo=700, hi=2600):
    n = int(n_len * SR)
    return bp(rng.standard_normal(n), lo, hi, 2) * env_exp(n, 0.018)


# ------------------------------------------------------------------ made sounds (synth:<kind>)
F_MINOR = [698.46, 830.61, 1046.5, 1244.5, 1396.9, 1661.2]        # F5 Ab5 C6 Eb6 F6 Ab6


def synth(kind, dur):
    if kind in ('keys', 'keys_soft'):          # Gerg's keys: the soft typing phrase, in bursts with thought-gaps
        k = load(os.path.join(SFXD, 'typing_soft.wav'))
        d = dur or 2.0
        out = np.zeros((int(d * SR), 2))
        t = 0.0
        while t < d:
            burst = rng.uniform(0.5, 1.4)
            a = int(rng.uniform(0, max(1, len(k) / SR - burst)) * SR)
            seg = fade(k[a: a + int(burst * SR)], 0.01, 0.05)
            add(out, seg * rng.uniform(0.7, 1.0), t)
            t += burst + rng.uniform(0.15, 0.6)
        return fade(out, 0.02, 0.1)
    if kind == 'steps_far':                   # footsteps going off down a hall: hard floor, each farther
        out = np.zeros((int((dur or 1.4) * SR + SR), 2))
        for j in range(4):
            s = load(os.path.join(SFXD, f'footstep_hard_{j % 4 + 1}.wav'))
            add(out, lp(s, 3000 - 500 * j) * db(-4 * j), j * 0.42)
        return out
    if kind in ('steps_stone', 'steps_phone'):  # footsteps on stone at a walking pace (the phone: through its speaker)
        d = dur or 2.0
        out = np.zeros((int(d * SR + SR), 2))
        t, j = 0.0, 0
        while t < d:
            s = load(os.path.join(SFXD, f'footstep_hard_{j % 4 + 1}.wav'))
            add(out, s * rng.uniform(0.75, 1.0), t)
            t += rng.uniform(0.46, 0.56); j += 1
        return phone(out) if kind == 'steps_phone' else out
    if kind in ('ratchet', 'ratchet_fast'):   # the odometer: chip notes on F, varied rhythm and pitch, plus a click
        d = dur or 2.0
        fast = kind == 'ratchet_fast'
        out = np.zeros((int(d * SR + 0.3 * SR), 2))
        t = 0.0
        while t < d:
            f0 = F_MINOR[rng.integers(0, 4 if not fast else 6)] * (2 if fast else 1) / 2
            c = chip(f0, rng.uniform(0.03, 0.07), rng.choice([0.125, 0.25, 0.5])) * rng.uniform(0.5, 1.0)
            click = bp(rng.standard_normal(240), 1500, 6000) * env_exp(240, 0.002) * 0.6
            add(out, st(c), t)
            add(out, st(click), t)
            t += rng.uniform(0.06, 0.13) if fast else rng.choice([0.11, 0.15, 0.19, 0.23, 0.31])
        return fade(out[: int(d * SR)], 0.02, 0.08)
    if kind == 'thud':                        # a heavy page / an odometer landing: a low body, a slap, a short tail
        n = int(1.2 * SR)
        t = np.arange(n) / SR
        body = np.sin(2 * np.pi * (58 - 14 * np.minimum(1, t / 0.25)) * t) * np.exp(-t / 0.22)
        slap = lp(rng.standard_normal(n), 2500) * np.exp(-t / 0.018) * 0.8
        rattle = bp(rng.standard_normal(n), 900, 4000) * np.exp(-t / 0.09) * 0.12
        return st(body + slap + rattle)
    if kind == 'taps':                        # thumbs on a phone's composer
        d = dur or 2.0
        out = np.zeros((int(d * SR + SR), 2))
        t = 0.0
        while t < d:
            s = load(os.path.join(SFXD, f'key_tap_soft_0{rng.integers(1, 7)}.wav'))
            add(out, repitch(s, 1.5) * rng.uniform(0.5, 0.9), t)
            t += rng.uniform(0.09, 0.22)
        return out
    if kind == 'murmur':                      # a TV's own audio, down to a murmur (act3_bed.py's)
        d = dur or 1.8
        n = int(d * SR)
        am = np.interp(np.arange(n), np.linspace(0, n, int(d * 5) + 2), rng.uniform(0.2, 1.0, int(d * 5) + 2))
        return fade(st(bp(rng.standard_normal(n), 250, 1800) * am), 0.15, 0.3)
    if kind == 'tapdance':                    # tap shoes, small, through the lobby TV's speaker
        d = dur or 2.0
        out = np.zeros(int(d * SR + SR))
        t = 0.0
        while t < d:
            n = int(0.05 * SR)
            x = bp(rng.standard_normal(n), 1800, 6000) * env_exp(n, 0.006)
            i = int(t * SR)
            out[i: i + n] += x * rng.uniform(0.5, 1.0)
            t += rng.choice([0.14, 0.14, 0.28, 0.21])
        return st(bp(out[: int(d * SR)], 400, 4000))
    if kind == 'crate':                       # a wooden crate tipping over, its contents clattering out
        n = int(1.4 * SR)
        t = np.arange(n) / SR
        knock = lp(rng.standard_normal(n), 900) * np.exp(-t / 0.05) * 1.2
        out = st(knock)
        for t0 in np.sort(rng.uniform(0.08, 0.9, 16)):
            m = int(0.06 * SR)
            c = bp(rng.standard_normal(m), 1200, 5000) * env_exp(m, 0.01) * rng.uniform(0.2, 0.6)
            add(out, st(c), t0)
        return out
    if kind == 'cheer':                       # the bullpen cheering (a dozen people): claps and a vowel-ish swell
        d = dur or 1.5
        n = int(d * SR)
        out = np.zeros(n + SR)
        for t0 in rng.uniform(0, d, int(14 * d)):
            c = clap(0.1, 800, 3000) * rng.uniform(0.5, 1.0)
            i = int(t0 * SR)
            out[i: i + len(c)] += c
        t = np.arange(n) / SR
        voice = bp(rng.standard_normal(n), 400, 1400) * np.sin(np.pi * np.minimum(1, t / d)) * 0.35
        out[:n] += voice
        return fade(st(out[:n]), 0.05, 0.4)
    if kind == 'flutter':                     # a long scroll unrolling (paper_flutter, run on)
        f = load(os.path.join(SFXD, 'paper_flutter.wav'))
        n = int((dur or 3.0) * SR)
        out = np.zeros((n + len(f), 2))
        t0 = 0.0
        while t0 < (dur or 3.0):
            add(out, fade(f, 0.05, 0.2) * rng.uniform(0.7, 1.0), t0)
            t0 += 0.7
        return fade(out[:n], 0.05, 0.05)
    if kind == 'crackle':                     # solder sparks (act3_bed.py's crackle)
        d = dur or 0.8
        n = int(d * SR)
        x = np.zeros(n)
        for t0 in rng.uniform(0, d, int(d * 60)):
            i = int(t0 * SR)
            c = rng.standard_normal(90) * np.exp(-np.arange(90) / 20)
            x[i: i + 90] += c[: n - i] * rng.uniform(0.3, 1)
        return fade(st(bp(x, 1200, 7000)), 0.02, 0.1)
    if kind == 'pen':                         # a pen writing on one sheet: short scratchy strokes
        d = dur or 2.0
        out = np.zeros((int(d * SR + SR), 2))
        t = 0.0
        while t < d:
            ln = rng.uniform(0.12, 0.3)
            m = int(ln * SR)
            tt = np.arange(m) / SR
            x = bp(rng.standard_normal(m), 2500, 9000) * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(9, 16) * tt))
            add(out, fade(st(x), 0.01, 0.03), t)
            t += ln + rng.uniform(0.03, 0.12)
        return out[: int(d * SR)]
    raise KeyError(kind)


PEAK_ALIGN = {}


def sound(name, dur, align=None):
    if name.startswith('synth:'):
        return synth(name[6:], dur), 0.0
    x = load(os.path.join(SFXD, name + '.wav'))
    if dur:
        x = fade(x[: int(dur * SR)], 0.0, 0.05)
    off = 0.0
    if align == 'peak':                       # lay the file so its loudest sample lands on `at`
        off = float(np.argmax(np.abs(x).max(axis=1))) / SR
    return x, off


ROOM_SFX = {'synth:keys', 'synth:steps_far'}   # sounds that are part of the room (un-ducked with it)


def main():
    doc = json.load(open(TL))
    beats = doc['beats']
    B, acc, prev = {}, 0.0, 0
    for b in beats:                        # the reel's own frame layout (schema.ts timeEpisode, head 0)
        acc += b['reelDur']
        end = max(prev + 1, round(acc * FPS))
        B[b['id']] = (prev / FPS, end / FPS)
        prev = end
    total = prev / FPS
    N = int((total + 0.05) * SR)
    s = lambda k: B[k][0]                  # beat start
    e = lambda k: B[k][1]                  # beat end
    speech = []
    for b in beats:
        for l in b.get('lines', []):
            speech.append((s(b['id']) + l['t'], s(b['id']) + l['t'] + l['dur']))
    speech.sort()

    def line_end(lid):
        for b in beats:
            for l in b.get('lines', []):
                if l['id'] == lid:
                    return s(b['id']) + l['t'] + l['dur']
        raise KeyError(lid)

    qa = {'timeline': os.path.relpath(TL, ROOT), 'act_seconds': round(total, 3), 'stem_seconds': round(N / SR, 3),
          'room_unduck_db': ROOM_UNDUCK_DB, 'layers': [], 'sfx': []}
    room = np.zeros((N, 2))
    music = np.zeros((N, 2))
    fx = np.zeros((N, 2))
    t_black = s('12.07')

    # ---------------------------------------------------------------- room
    hum = load(os.path.join(SFXD, 'server_hum.wav'))
    tube = load(os.path.join(SFXD, 'neon_buzz.wav'))
    tone = load(os.path.join(SFXD, 'room_tone.wav'))

    def lay_room(src, a, b, target, fin=0.5, fout=0.5, filt=None, name=''):
        x = tile(src, int((b - a) * SR))
        if filt:
            x = filt(x)
        x = fade(to_lufs(x, target), fin, fout)
        add(room, x, a)
        qa['layers'].append({'layer': 'room', 'what': name, 'lufs': target, 'from': round(a, 3), 'to': round(b, 3)})

    t_lock = s('8.06') + 0.9
    lay_room(hum, 0.0, t_lock + 1.2, -37, 0.25, 1.2, name='bullpen: server_hum (sc 5-8)')
    lay_room(tube, 0.0, t_lock + 1.2, -49, 0.25, 1.2, name='bullpen: one buzzing tube (neon_buzz)')
    for k in ('6.05', '6.06', '6.09', '7.02'):            # the shaft and the server room: louder, duller
        lay_room(hum, s(k), e(k), -35, 0.15, 0.25, filt=lambda x: lp(x, 900), name=f'the basement under the hole ({k})')
    lay_room(tone, s('9.01') - 1.0, s('11.01') + 0.6, -37, 1.0, 0.6, name='the NopeAI lobby: room_tone (sc 9-10)')
    t = s('9.01') + 1.5                                     # far steps across the lobby's stone, now and then
    while t < s('11.01') - 1.0:
        st_ = load(os.path.join(SFXD, f'footstep_hard_{rng.integers(1, 5)}.wav'))
        add(room, lp(st_, 2200) * db(-38 - rng.uniform(0, 5)), t)
        t += rng.uniform(1.8, 4.5)
    lay_room(hum, s('11.01') - 0.6, s('12.02'), -37, 0.6, 0.3, name='bullpen: server_hum (sc 11, 12.01)')
    lay_room(tube, s('11.01') - 0.6, s('12.02'), -49, 0.6, 0.3, name='bullpen: the tube')
    lay_room(tone, s('12.02') - 0.2, s('12.04'), -41, 0.2, 0.05, filt=lambda x: lp(x, 1500),
             name='a standing desk in the dark (12.02-12.03)')
    lay_room(hum, s('12.04'), t_black, -37, 0.02, 0.02, name='bullpen: server_hum (12.04-12.06), cut at the black')
    lay_room(tube, s('12.04'), t_black, -49, 0.02, 0.02, name='bullpen: the tube')

    # ---------------------------------------------------------------- music
    def lay_music(x, a, target, name, **kw):
        g = db(target - lufs(x))
        add(music, x * g, a)
        qa['layers'].append({'layer': 'music', 'what': name, 'lufs': target, 'from': round(a, 3),
                             'to': round(a + len(x) / SR, 3), **kw})

    # MM-16 temp pad: in on the counter's first tick, through the drill, the bill and the phone; rings out on the lock
    a16 = s('5.12') + 0.5
    b16 = t_lock
    p16 = pad(['Fm11', 'Bbm9'], 96, 2, b16 - a16 + 2.2)
    rel = lambda k: s(k) - a16
    p16 *= gain_env(len(p16), [(0, 0), (rel('6.04'), 0), (rel('6.04') + 0.3, -4), (e('6.04') - a16, -4),
                              (e('6.04') - a16 + 0.3, 0), (rel('6.07'), 0), (rel('6.07') + 0.3, -4),
                              (e('6.07') - a16, -4), (rel('6.09'), -2), (e('6.09') - a16, -6), (rel('7.01'), -3),
                              (rel('8.01'), -3), (rel('8.01') + 0.5, 1.5), (b16 - a16, 1.5), (b16 - a16 + 0.01, 1.5)])
    p16 = fade(p16, 0.3, 2.2)
    lay_music(p16, a16, -26, 'MM-16 Odometer temp pad (Fm11 / Bbm9, 96 bpm)',
              note='thins -4 dB under the two posts, settles lower under the heat shimmer, +1.5 dB in the siren; rings out 2.2 s on the lock')

    # LEVERAGE, the check's arrival -> the pop (stopped dead: the pop is laid on the same sample)
    lev = load(LEVERAGE)
    a_lev, t_pop = s('9.02') + 0.3, s('9.08')
    x = tile(lev, int((t_pop - a_lev) * SR))
    x = fade(x, 0.3, 0.0)
    x[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))[:, None]
    lay_music(x, a_lev, -26, 'LEVERAGE (mm08-leverage-bed-loop.wav, the seamless 4-bar loop)', stops_dead_on_pop=round(t_pop, 3))
    # LEVERAGE back on the key ring's jangle (a new phrase), through sc 10; thins under his quote; falls away under the tick
    t_jangle = line_end('e1-a1-9-08') + 0.25
    a2, b2 = t_jangle, s('11.01') + 0.3
    x = tile(lev, int((b2 - a2) * SR))
    q0, q1 = s('9.10'), s('9.11')
    x *= gain_env(len(x), [(0, 0), (q0 - a2 + 3.0, 0), (q0 - a2 + 3.5, -4), (q1 - a2, -4), (q1 - a2 + 0.3, 0),
                           (s('10.04') - a2, 0), (b2 - a2, -3)])
    x = fade(x, 0.02, b2 - s('10.04') + 0.3)
    lay_music(x, a2, -26, 'LEVERAGE back on the key ring (new phrase, through sc 10)', thins_under_quote=True,
              falls_away_from=round(s('10.04'), 3))

    # MM-04 temp pad: the duel, from its downbeat (11.03) to the push; thins under Mas's post (11.05)
    a4, b4 = s('11.03'), s('12.01') + 0.4
    p4 = pad(['Fm11', 'Eb9sus4'], 88, 2, b4 - a4 + 0.8)
    p4 *= gain_env(len(p4), [(0, 0), (s('11.05') - a4, 0), (s('11.05') - a4 + 0.4, -5), (s('11.06') - a4, -5),
                             (s('11.06') - a4 + 0.4, 0)])
    p4 = fade(p4, 0.05, 0.8)
    lay_music(p4, a4, -26, 'MM-04 Lighthouse temp pad (Fm11 / Eb9sus4, 88 bpm)', thins_under_post=True)

    # MM-17 temp pad: from the push; the THUD cuts it dead
    a17, t_thud = s('12.01'), s('12.03')
    p17 = pad(['Bbm9', 'C7#9b13'], 72, 2, t_thud - a17 + 0.4)[: int((t_thud - a17) * SR)]
    p17 = fade(p17, 0.8, 0.0)
    p17[-int(0.015 * SR):] *= np.linspace(1, 0, int(0.015 * SR))[:, None]
    lay_music(p17, a17, -27, 'MM-17 temp pad (Bbm9 / C7#9b13, 72 bpm)', cut_dead_by_thud=round(t_thud, 3))

    # MM-14 THREAT temp: a felt Fm(b6) sting on the pen's lift, ringing over the black
    t_lift = s('12.06') + 1.6
    felt = load(FELT)
    sting = np.zeros((int(3.5 * SR), 2))
    for semi, g in ((-24, 1.0), (-17, 0.7), (-9, 0.6), (-4, 0.45)):   # F2 C3 Ab3 Db4
        add(sting, repitch(felt, 2 ** (semi / 12))[: int(3.5 * SR)] * g, 0.0)
    rem = N / SR - t_lift
    sting = fade(sting[: int(rem * SR)], 0.004, max(0.3, rem - 0.6))
    lay_music(sting, t_lift, -26, 'MM-14 THREAT temp: felt Fm(b6) sting (F2 C3 Ab3 Db4) on the pen\'s lift',
              rings_over_black_from=round(t_black, 3))

    # ---------------------------------------------------------------- tick (Sydney's egg timer, LEVERAGE's grid)
    tick_n = int(0.02 * SR)
    tt = np.arange(tick_n) / SR
    tick = st(bp(rng.standard_normal(tick_n), 2000, 7000) * np.exp(-tt / 0.003) +
              np.sin(2 * np.pi * 2900 * tt) * np.exp(-tt / 0.004) * 0.5)
    tick = to_peak(tick, -26)
    a_t, b_t = s('10.03') + 0.9, s('11.03')
    t = a2 + np.ceil((a_t - a2) / BEAT96) * BEAT96        # on LEVERAGE's beat (the loop was restarted on the jangle)
    n_ticks = 0
    while t < b_t - 0.05:
        add(fx, tick * (1.0 if n_ticks % 2 == 0 else 0.72), t)
        t += BEAT96
        n_ticks += 1
    qa['layers'].append({'layer': 'tick', 'what': "Sydney's egg timer: a 20 ms tick, peak -26 dBFS, every 0.625 s on LEVERAGE's grid",
                         'from': round(a_t, 3), 'to': round(b_t, 3), 'ticks': n_ticks})

    # ---------------------------------------------------------------- siren through the phone's small speaker
    wh = load(os.path.join(SFXD, 'siren_whoop_F.wav'))
    a_s = s('7.02') + 2.1
    n_s = int((t_lock - a_s) * SR)
    x = np.zeros((n_s + len(wh), 2))
    t = 0.0
    while t * SR < n_s:
        add(x, fade(wh, 0.05, 0.3), t)
        t += len(wh) / SR * 0.8
    x = phone(x[:n_s])
    x = to_peak(x, -24)
    rs = lambda k: s(k) - a_s
    x *= gain_env(n_s, [(0, -14), (rs('8.01'), -8), (rs('8.02'), -4), (rs('8.02') + 1.5, 0), (rs('8.03'), -5),
                        (rs('8.06'), -6), (n_s / SR, -8)])
    x = fade(x, 0.8, 0.03)
    add(fx, x, a_s)
    qa['layers'].append({'layer': 'siren', 'what': 'siren_whoop_F through a phone band (500-3400 Hz), peak -24 dBFS at the lift',
                         'from': round(a_s, 3), 'to': round(t_lock, 3)})

    # ---------------------------------------------------------------- sfx
    for b in beats:
        s0 = s(b['id'])
        for sd in b.get('sounds', []):
            x, off = sound(sd['name'], sd.get('dur'), sd.get('align'))
            x = to_peak(x, sd['gain'])
            add(room if sd['name'] in ROOM_SFX else fx, x, s0 + sd['at'] - off)
            qa['sfx'].append({'beat': b['id'], 'name': sd['name'], 'at_act': round(s0 + sd['at'] - off, 3),
                              'peak_dbfs': sd['gain'], 'len_s': round(len(x) / SR, 3)})

    # ---------------------------------------------------------------- the room's un-duck (the mixer's duck, mirrored)
    spans = []
    for a, b in speech:
        sp = [a - MIX_DUCK_PRE, b + 0.1]
        if spans and sp[0] - spans[-1][1] < MIX_DUCK_HOLD:
            spans[-1][1] = max(spans[-1][1], sp[1])
        else:
            spans.append(sp)
    u = np.zeros(N)
    tN = np.arange(N) / SR
    for a, b in spans:
        i0, i1 = max(0, int((a - 0.2) * SR)), min(N, int((b + 0.6) * SR))
        seg = tN[i0:i1]
        w = np.clip(np.where(seg < a, (seg - (a - 0.2)) / 0.2, np.where(seg > b, 1 - (seg - b) / 0.6, 1.0)), 0, 1)
        u[i0:i1] = np.maximum(u[i0:i1], w)
    room *= db(ROOM_UNDUCK_DB * u)[:, None]
    qa['layers'].append({'layer': 'room un-duck', 'db': ROOM_UNDUCK_DB, 'spans': len(spans),
                         'note': "mirrors mixer.mjs bedControl (duckPre 0.25, hold 2.5, 0.2 s in, 0.6 s out); room layer only"})

    bus = room + music + fx
    bus[int(t_black * SR):] -= room[int(t_black * SR):]      # (the room is already 0 there; kept explicit)

    # ---------------------------------------------------------------- checks
    peak = float(np.abs(bus).max())
    if peak > db(-3):
        bus *= db(-3) / peak
        qa['trimmed_to_peak_dbfs'] = -3
    body = bus[: int(total * SR)]
    win = int(0.5 * SR)
    silent = [round(i / SR, 2) for i in range(0, len(body) - win, win // 2) if np.abs(body[i: i + win]).max() < db(-70)]
    qa.update({'lufs_integrated': round(lufs(body), 2), 'peak_dbfs': round(20 * np.log10(np.abs(bus).max()), 2),
               'digital_silences_0.5s': silent,
               'layer_lufs': {'room (after un-duck)': round(lufs(room[: int(total * SR)]), 2),
                              'music': round(lufs(music[: int(total * SR)]), 2), 'sfx': round(lufs(fx[: int(total * SR)]), 2)}})
    sf.write(OUT, bus, SR, subtype='PCM_24')
    with open(QA_OUT, 'w') as fh:
        json.dump(qa, fh, indent=1)
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {N / SR:.2f} s, {qa["lufs_integrated"]} LUFS, peak {qa["peak_dbfs"]} dBFS, '
          f'{len(qa["sfx"])} sfx, silences {silent}')


if __name__ == '__main__':
    main()
