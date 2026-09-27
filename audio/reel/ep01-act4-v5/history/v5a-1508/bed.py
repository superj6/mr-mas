#!/usr/bin/env python
"""Ep1 Act Four v5 STICK-FIGURE DIALOGUE REEL: the temp bed and the mix.

  audio/.venv-mix/bin/python audio/reel/ep01-act4-v5/bed.py            -> audio/reel/ep01-act4-v5/mix.wav (+ qa.json)

Reads show/reel/ep01-act4-v5.json (the reel's own clock: the 3 s title card, then every beat, with the frame
rounding of studio/src/reel/schema.ts timeEpisode) and lays:

  DIALOGUE  every line's v5 take at beatStart + t - in, dual mono at -3 dB (so a -16 LUFS take stays -16 LUFS).
  MUSIC     one continuous temp performance per sequence, cut from existing OST renders (read-only):
            the batch-1 cues (mm07 / mm08 / mm09 underscores) and the v4 re-renders (e01-act4-v4 S5/S6, S7/S8),
            each section looped on its own material with 1 s equal-power crossfades, sequences crossfaded.
            Under talk it THINS (blends to a 500 Hz low-passed copy: pedal and bass stay, melody goes) and DUCKS
            -10 dB (pre-duck 0.25 s, 0.2 s attack, 0.6 s release, held across gaps under 2.5 s). Under silent
            posts it thins halfway and dips 3 dB. Stops: the Cancel click (the one silence, over room tone), the
            dead stop on MADA's label, the dead stop after "of what?".
  ROOMS     one bed per location (the beats' `room`), about -39 dBFS RMS, 1 s crossfades at changes.
  SFX       the beats' `sounds` (SFX board files, a few synthesised: buzz, ring, DTMF, dial tone, slot).
  SILENCE   Cancel click -> phone buzz: music, rooms and SFX out; room tone only, about -47 dBFS.

Nothing here has been listened to. Every level is measured, and qa.json says what was measured.
"""
from __future__ import annotations

import json
import os
import sys
import time

import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
REEL = os.path.join(ROOT, 'show/reel/ep01-act4-v5.json')
OUT_WAV = os.path.join(HERE, 'mix.wav')
OUT_QA = os.path.join(HERE, 'qa.json')
SR, FPS = 48000, 24
SPF = SR // FPS
TITLE_FRAMES = 72
OST = os.path.join(ROOT, 'audio/ost/tracks')
SRC = {
    'mm07': f'{OST}/mm07-how-to-fire-a-ceo/render/mm07-how-to-fire-a-ceo-underscore.wav',
    'mm08': f'{OST}/mm08-the-falling-tile/render/mm08-the-falling-tile-underscore.wav',
    'mm09': f'{OST}/mm09-the-boards-side/render/mm09-the-boards-side-underscore.wav',
    'v4s56': f'{OST}/e01-act4-v4/render/e01-act4-v4-s5s6-his-side-745-underscore.wav',
    'v4s78': f'{OST}/e01-act4-v4/render/e01-act4-v4-s7s8-the-return-underscore.wav',
}
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
MUSIC_RMS = -24.0        # un-ducked music, dBFS RMS of each segment's playing parts
ROOM_RMS = -39.0
DUCK_DB, POST_DB = -10.0, -3.0
rng = np.random.default_rng(5)


def db(x):
    return 10.0 ** (np.asarray(x) / 20.0)


def load(p):
    x, sr = sf.read(p, dtype='float32', always_2d=True)
    assert sr == SR, (p, sr)
    return x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)


# ------------------------------------------------------------------ the reel's clock (schema.ts timeEpisode)
R = json.load(open(REEL))
BEATS = R['beats']
starts, acc, prev = [], 0.0, TITLE_FRAMES
for b in BEATS:
    acc += b['reelDur']
    end = max(prev + 1, TITLE_FRAMES + round(acc * FPS))
    starts.append((prev, end))
    prev = end
TOTAL_F = prev
N = TOTAL_F * SPF
BI = {b['id']: i for i, b in enumerate(BEATS)}


def B(bid, off=0.0):
    """a beat's start on the reel clock, in seconds"""
    return starts[BI[bid]][0] / FPS + off


def E(bid, off=0.0):
    return starts[BI[bid]][1] / FPS + off


LINES = []
for i, b in enumerate(BEATS):
    s0 = starts[i][0] / FPS
    for l in b.get('lines', []):
        LINES.append(dict(l, on=s0 + l['t'], end=s0 + l['t'] + l['dur'], beat=b['id']))
LINES.sort(key=lambda l: l['on'])
LID = {l['id']: l for l in LINES}


def ON(lid, off=0.0):
    return LID[lid]['on'] + off


def END(lid, off=0.0):
    return LID[lid]['end'] + off


def S(t):
    return int(round(t * SR))


def add(bus, x, s0):
    s0 = int(s0)
    a, b_ = max(0, s0), min(len(bus), s0 + len(x))
    if b_ > a:
        bus[a:b_] += x[a - s0:b_ - s0]


def lpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def hpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'high', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def bpf(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def smooth_env(target, att, rel):
    """one-pole attack/release follower on a 0..1 control at a 100 Hz control rate, returned at audio rate"""
    k = SR // 100
    c = target[::k]
    out = np.zeros_like(c)
    aa, rr = np.exp(-1 / (att * 100)), np.exp(-1 / (rel * 100))
    v = 0.0
    for i, x in enumerate(c):
        v = aa * v + (1 - aa) * x if x > v else rr * v + (1 - rr) * x
        out[i] = v
    return np.interp(np.arange(len(target)) / k, np.arange(len(out)), out).astype(np.float32)


# ------------------------------------------------------------------ DIALOGUE
dlg = np.zeros((N, 2), np.float32)
place_log = []
for l in LINES:
    x, sr = sf.read(os.path.join(ROOT, l['audio']), dtype='float32', always_2d=True)
    assert sr == SR
    x = x[:, 0] if x.shape[1] == 1 else x.mean(1)
    s0 = S(l['on'] - l['in'])
    add(dlg, np.column_stack([x, x]) * 0.7071, s0)
    place_log.append(dict(id=l['id'], file_start=round(s0 / SR, 3), speech_on=round(l['on'], 3), speech_end=round(l['end'], 3)))

# the speech mask (audible spans), held across gaps under 2.5 s, pre-duck 0.25 s
spans = sorted((l['on'] - 0.25, l['end'] + 0.15) for l in LINES)
merged = []
for a, b_ in spans:
    if merged and a - merged[-1][1] < 2.5:
        merged[-1][1] = max(merged[-1][1], b_)
    else:
        merged.append([a, b_])
tgt = np.zeros(N, np.float32)
for a, b_ in merged:
    tgt[max(0, S(a)):min(N, S(b_))] = 1.0
speech_env = smooth_env(tgt, 0.2, 0.6)

# silent posts: thin halfway, -3 dB
ptgt = np.zeros(N, np.float32)
for i, b in enumerate(BEATS):
    s0, e0 = starts[i][0] / FPS, starts[i][1] / FPS
    for o in b.get('onscreen', []):
        if o['text'].startswith('POST:'):
            a = s0 + o['at']
            u = s0 + o['until'] if o.get('until') is not None else e0
            ptgt[S(a):S(u)] = 1.0
post_env = smooth_env(ptgt, 0.3, 0.8)


# ------------------------------------------------------------------ MUSIC
XF = 1.0
CACHE = {}


def src(k):
    if k not in CACHE:
        CACHE[k] = load(SRC[k])
    return CACHE[k]


def silence_after(k, t, thr=-60.0):
    x = src(k).mean(1)
    n = SR // 50
    i = S(t)
    while i + n < len(x):
        if 20 * np.log10(np.sqrt(np.mean(x[i:i + n] ** 2)) + 1e-9) < thr:
            return i / SR
        i += n // 2
    return len(x) / SR


def render_part(k, sin, dur, loop):
    """`dur` seconds of source k from `sin`; past the loop's end [a, b] it goes back to a, the new pass fading in
    over the last XF seconds of the old one (both inside the loop's own material, so a rest just after b never
    leaks into the join). With no loop it plays to the end of the file."""
    x = src(k)
    n = S(dur)
    out = np.zeros((n, 2), np.float32)
    xf = S(XF)
    pos, w, first = S(sin), 0, True
    while w < n:
        end_ = S(loop[1]) if loop and pos < S(loop[1]) else len(x)
        take = min(n - w, end_ - pos)
        if take <= 0:
            break
        chunk = x[pos:pos + take].copy()
        if not first:
            k_ = min(xf, len(chunk))
            chunk[:k_] *= np.sin(0.5 * np.pi * np.linspace(0, 1, k_))[:, None]
        more = loop is not None and w + take < n
        if more:
            k_ = min(xf, len(chunk))
            chunk[-k_:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, k_))[:, None]
        out[w:w + take] += chunk
        if not more:
            break
        w += take - min(xf, take)
        pos, first = S(loop[0]), False
    return out


def segment(name, k, t0, t1, parts, gain=0.0, fin=0.3, fout=0.3, align_end=None, ride=None, stop='fade'):
    """parts: [(t_start, src_in, loop)]; align_end: the source second that lands on t1 (the last part is placed so)"""
    n = S(t1 - t0)
    out = np.zeros((n, 2), np.float32)
    xf = S(XF)
    for j, (ta, sin, loop) in enumerate(parts):
        tb = parts[j + 1][0] if j + 1 < len(parts) else t1
        last = j + 1 == len(parts)
        extra = 0 if last else XF
        if last and align_end is not None:
            sin = align_end - (t1 - ta)
        d = tb - ta + extra
        y = render_part(k, max(0.0, sin), d, loop)
        if sin < 0:  # the aligned source starts before the file: pad the head
            y = np.vstack([np.zeros((S(-sin), 2), np.float32), y])[:S(d)]
        if j > 0:
            y[:xf] *= np.sin(0.5 * np.pi * np.linspace(0, 1, xf))[:, None]
        if not last:
            y[-xf:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, xf))[:, None]
        add(out, y, S(ta - t0))
    # level the segment
    e = np.sqrt(np.mean(out.astype(np.float64) ** 2, axis=1))
    live = e[e > 10 ** (-50 / 20)]
    rms = 20 * np.log10(np.sqrt(np.mean(live ** 2)) + 1e-12) if len(live) else -99
    out *= db(MUSIC_RMS - rms + gain)
    g = np.ones(n, np.float32)
    fi = S(fin)
    fo = S(fout if stop == 'fade' else 0.02)
    if fi:
        g[:fi] = np.sin(0.5 * np.pi * np.linspace(0, 1, fi))
    if fo:
        g[n - fo:] = np.minimum(g[n - fo:], np.cos(0.5 * np.pi * np.linspace(0, 1, fo)))
    if ride:
        tt = t0 + np.arange(n) / SR
        g *= db(np.interp(tt, [p[0] for p in ride], [p[1] for p in ride])).astype(np.float32)
    out *= g[:, None]
    MUSIC_LOG.append(dict(name=name, src=os.path.relpath(SRC[k], ROOT), t0=round(t0, 3), t1=round(t1, 3),
                          parts=[(round(p[0], 3), round(p[1], 3), p[2]) for p in parts], stop=stop,
                          source_rms_dbfs=round(float(rms), 1), gain_db=round(float(MUSIC_RMS - rms + gain), 1)))
    return out, t0


MUSIC_LOG = []
music = np.zeros((N, 2), np.float32)
CLICK = B('S1.09', 2.4)                        # the Cancel click
BUZZ = B('S1.11', 0.3)                         # the phone buzz: the room comes back
TS07 = silence_after('mm07', 45.0)             # MM-07's tape-stop reaches zero
STOP10 = silence_after('v4s56', 46.0, -50.0)   # the avalanche's dead stop in the v4 S6 render
SEGS = [
    ('M1 THE PLAN (MM-07 BLUEPRINT)', 'mm07', B('S1.01'), B('S1.06', 1.25),
     [(B('S1.01'), 0.0, None), (B('S1.02', 1.0), 6.25, None), (B('S1.02', 14.0), 20.75, (22.5, 37.5)),
      (B('S1.06', 1.25) - 3.2, None, None)], dict(align_end=TS07, fin=0.4, stop='hard')),
    ('M2 THE CALL (MM-08 LEVERAGE low)', 'mm08', B('S1.07'), CLICK, [(B('S1.07'), None, None)],
     dict(align_end=17.5, fin=0.4, stop='hard')),
    ('M3 THAT NIGHT (MM-08 26A felt)', 'mm08', B('S2.01'), E('S2.05'),
     [(B('S2.01'), 22.5, (22.5, 28.5)), (E('S2.05') - 4.0, None, None)], dict(align_end=42.5, fin=0.1, fout=0.3, gain=2.0)),
    ('M4 PASS ONE (MM-09 PROCEDURE a-h, 09x)', 'mm09', B('S3.00a'), E('S5.01', 1.5),
     [(B('S3.00a'), 13.75, (15.0, 25.0)), (B('S4.01'), 30.0, None), (B('S4.02'), 40.0, (40.0, 62.5)),
      (B('S4.08'), 65.0, (65.0, 80.0)), (B('S4.09'), 84.5, (85.0, 95.0)), (B('S4.12'), 95.0, (95.0, 100.0)),
      (B('S4.14'), 105.0, (105.0, 110.0)),
      (B('S5.01'), 110.0, None)],
     dict(fin=0.2, fout=1.5, ride=[(B('S3.06') - 0.5, 0), (B('S3.06'), -4), (E('S3.07'), -4), (E('S3.07') + 0.5, 0),
                                  (END('a5-27-29', 0.3), 0), (END('a5-27-29', 0.5), -12), (B('S4.08', -0.1), -12),
                                  (B('S4.08', 0.4), 0)])),
    ('M5 2 AM (v4 S5 render: the dark-room pedal + pulse)', 'v4s56', B('S5.02', -0.5), B('S6.01', 0.3),
     [(B('S5.02', -0.5), 0.0, (2.0, 27.5)), (B('S5.09b'), 27.83, (27.9, 29.6)), (B('S5.11'), 29.67, (29.8, 34.4))],
     dict(fin=1.0, fout=0.8)),
    ('M6 THE AVALANCHE (v4 S6 render: SET-PIECE SWING)', 'v4s56', B('S6.01', -0.3), B('S6.06', 4.3),
     [(B('S6.01', -0.3), None, None)], dict(align_end=STOP10, fin=0.6, stop='hard', gain=3.0)),
    ('M7a THE RETURN (v4 S7 render: violin, the floor, LEVERAGE)', 'v4s78', B('S7.01', 0.6), END('a5-30-15', 0.15),
     [(B('S7.01', 0.6), 0.0, (1.0, 6.2)), (B('S7.02', -0.5), 6.33, (6.5, 14.3)), (B('S7.05'), 14.42, (15.0, 23.5))],
     dict(fin=0.8, stop='hard', ride=[(B('S7.01', 7.0), 0), (E('S7.01', -0.5), -9), (B('S7.02', -0.5), -3),
                                      (B('S7.02', 0.5), 0)])),
    ('M7b THE RETURN (v4 S7/S8 render: C pedal, the sign, the flat line, the felt settle)', 'v4s78', B('S7.09', 2.2),
     B('S8.08', 1.0),
     [(B('S7.09', 2.2), 29.17, (29.3, 40.5)), (B('S8.01'), 40.67, None), (B('S8.03'), 43.17, None),
      (B('S8.04'), 46.58, None), (B('S8.05'), 50.96, (55.0, 69.5))], dict(fin=0.2, fout=2.0)),
]
for name, k, t0, t1, parts, kw in SEGS:
    parts = [(p[0], p[1] if p[1] is not None else 0.0, p[2]) for p in parts]
    y, a = segment(name, k, t0, t1, parts, **kw)
    add(music, y, S(a))

# the coda: the vault's F hum (diegetic, the pedal) from the vault to the end
t0h, t1h = B('S8.06'), TOTAL_F / FPS
nh = S(t1h - t0h)
tt = np.arange(nh) / SR
hum = (np.sin(2 * np.pi * 87.307 * tt) * 0.55 + np.sin(2 * np.pi * 174.61 * tt) * 0.3 + np.sin(2 * np.pi * 261.63 * tt) * 0.08
       ) * (1 + 0.04 * np.sin(2 * np.pi * 0.3 * tt))
hum = np.column_stack([hum, hum * 0.97]).astype(np.float32)
hum *= db(-32.0) / (np.sqrt(np.mean(hum ** 2)) + 1e-12)
gh = np.ones(nh, np.float32)
gh[:S(1.0)] = np.linspace(0, 1, S(1.0))
gh[-S(2.0):] = np.linspace(1, 0, S(2.0))
add(music, hum * gh[:, None], S(t0h))
MUSIC_LOG.append(dict(name='M8 CODA: the vault F hum (synth, diegetic pedal)', t0=round(t0h, 3), t1=round(t1h, 3)))

# thin + duck (the TPOOL flashback thins to its pedal as well: (REPORTED) material carries no motif)
thin_t = np.maximum(speech_env, 0.5 * post_env)
fl = np.zeros(N, np.float32)
fl[S(B('S2.03')):S(E('S2.03'))] = 1.0
thin_t = np.maximum(thin_t, smooth_env(fl, 0.2, 0.5))
music_thin = lpf(music, 500)
music = music * (1 - thin_t)[:, None] + music_thin * thin_t[:, None]
music *= db(DUCK_DB * speech_env + POST_DB * post_env * (1 - speech_env))[:, None].astype(np.float32)


# ------------------------------------------------------------------ ROOMS
def loop_file(name, n):
    x = load(os.path.join(SFXD, name + '.wav'))
    reps = int(np.ceil(n / len(x))) + 2
    y = np.vstack([x] * reps)
    o = int(rng.integers(0, len(x)))
    return y[o:o + n].copy()


def pink(n):
    out = np.zeros((n, 2), np.float32)
    for c in range(2):
        W_ = np.fft.rfft(rng.standard_normal(n))
        f = np.fft.rfftfreq(n, 1 / SR)
        W_[1:] /= np.sqrt(f[1:])
        W_[0] = 0
        y = np.fft.irfft(W_, n)
        out[:, c] = y / (np.std(y) + 1e-12)
    return out


def events(n, rate, fn, gdb):
    y = np.zeros((n, 2), np.float32)
    t_ = 0.0
    while True:
        t_ += rng.exponential(1 / rate)
        i = S(t_)
        if i >= n:
            break
        e = fn()
        p = rng.uniform(-0.7, 0.7)
        add(y, np.column_stack([e * (1 - max(0, p)), e * (1 + min(0, p))]) * db(gdb + rng.uniform(-4, 2)), i)
    return y


def murmur(n, talkers=6):
    y = np.zeros((n, 2), np.float32)
    t_ = np.arange(n) / SR
    for _ in range(talkers):
        w = bpf(rng.standard_normal(n).astype(np.float32), 250 * rng.uniform(0.8, 1.2), 2000 * rng.uniform(0.7, 1.1))
        syl = np.clip(np.sin(2 * np.pi * rng.uniform(2.5, 5.5) * t_ + rng.uniform(0, 6)) * 0.7 + 0.1, 0, 1) ** 1.5
        phr = np.clip(np.sin(2 * np.pi * rng.uniform(0.08, 0.2) * t_ + rng.uniform(0, 6)) + 0.4, 0, 1)
        v = (w * syl * phr).astype(np.float32)
        p = rng.uniform(-0.8, 0.8)
        y += np.column_stack([v * (1 - max(0, p)), v * (1 + min(0, p))])
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-12)


def crackle():
    k = int(rng.integers(80, 400))
    return (rng.uniform(-1, 1) * np.exp(-np.arange(k) / rng.uniform(15, 60))).astype(np.float32)


def key():
    x = load(os.path.join(SFXD, f'key_tap_soft_0{int(rng.integers(1, 7))}.wav'))[:, 0]
    return lpf(x, 3500)


def hvac(n, bright=900):
    return lpf(loop_file('room_tone', n), bright) * 0.9 + lpf(pink(n), 500) * 0.25


def bed_of(kind, n):
    if kind == 'suite':
        return hvac(n) + lpf(pink(n), 160) * 0.6
    if kind == 'dark':
        return loop_file('room_drone', n) * 0.8 + lpf(loop_file('room_tone', n), 1200) * 0.45 + hpf(loop_file('server_hum', n), 300) * 0.25
    if kind == 'tpool':
        return hvac(n, 1500) * 0.7 + lpf(murmur(n, 5), 650) * 0.8
    if kind == 'office':
        return hvac(n, 1000) + events(n, 1.1, key, -12) + lpf(murmur(n, 4), 1200) * 0.35
    if kind == 'office_night':
        return hvac(n, 700) + lpf(pink(n), 150) * 0.35
    if kind == 'allhands':
        return murmur(n, 14) + hvac(n) * 0.3
    if kind == 'boardroom':
        return hvac(n, 800) + lpf(pink(n), 130) * 0.55
    if kind == 'split':
        left = hvac(n, 800) + lpf(pink(n), 130) * 0.55
        tt_ = np.arange(n) / SR
        right = bpf(pink(n), 250, 1600) * np.clip(0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt_), 0.2, 1.2)[:, None] + \
            lpf(pink(n), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * tt_ / 7.0) ** 2)[:, None]
        return np.column_stack([left[:, 0] * 1.2 + right[:, 0] * 0.3, left[:, 1] * 0.3 + right[:, 1] * 1.2])
    if kind == 'cctv':
        tt_ = np.arange(n) / SR
        h = sum(np.sin(2 * np.pi * 60 * k_ * tt_) / k_ for k_ in (1, 2, 3, 5)) * 0.2
        return bpf(np.column_stack([h, h]).astype(np.float32) + lpf(pink(n), 400) * 0.6, 150, 3500) + hvac(n, 800) * 0.6
    if kind == 'bullpen':
        return hvac(n, 1000) * 0.8 + lpf(murmur(n, 5), 1500) * 0.45 + events(n, 0.9, key, -14)
    if kind == 'fires':
        return hvac(n, 800) * 0.7 + events(n, 38.0, crackle, -14) + lpf(pink(n), 250) * 0.3
    if kind == 'lobby':
        return loop_file('neon_buzz', n) * 0.55 + lpf(pink(n), 220) * 0.6 + lpf(loop_file('room_tone', n), 600) * 0.4
    if kind == 'coda':
        return hvac(n, 1000) * 0.8 + lpf(murmur(n, 4), 1400) * 0.3 + events(n, 0.5, key, -16)
    return hvac(n)


rooms = np.zeros((N, 2), np.float32)
ROOM_LOG = []
runs = []
for i, b in enumerate(BEATS):
    r = b.get('room') or 'suite'
    if runs and runs[-1][0] == r:
        runs[-1][2] = starts[i][1]
    else:
        runs.append([r, starts[i][0], starts[i][1]])
runs[0][1] = TITLE_FRAMES - 16                      # the suite fades in under the title card's last 0.67 s
RX = 0.5
for j, (r, fa, fb) in enumerate(runs):
    a = fa / FPS - (RX if j else 0)
    b_ = fb / FPS + (RX if j + 1 < len(runs) else 0)
    n = S(b_ - a)
    x = hpf(bed_of(r, n).astype(np.float32), 35)
    x *= db(ROOM_RMS + (1.0 if r in ('fires', 'allhands') else 0.0) + (3.0 if r == 'allhands' else 0.0)) / (np.sqrt(np.mean(x ** 2)) + 1e-12)
    g = np.ones(n, np.float32)
    k_ = S(2 * RX) if j else S(0.6)
    g[:k_] = np.sin(0.5 * np.pi * np.linspace(0, 1, k_))
    if j + 1 < len(runs):
        g[-S(2 * RX):] = np.cos(0.5 * np.pi * np.linspace(0, 1, S(2 * RX)))
    else:
        g[-S(2.0):] = np.linspace(1, 0, S(2.0))
    if r == 'allhands':                           # the crowd hushes for the question and stays hushed
        tt_ = a + np.arange(n) / SR
        g *= db(np.interp(tt_, [B('S3.06', 0.3), B('S3.06', 0.9)], [0, -8])).astype(np.float32)
    add(rooms, x * g[:, None], S(a))
    ROOM_LOG.append(dict(room=r, t0=round(a, 3), t1=round(b_, 3), rms_dbfs=ROOM_RMS))


# ------------------------------------------------------------------ SFX
def synth(name, dur=None):
    if name == 'BUZZ':
        tt_ = np.arange(S(0.5)) / SR
        x = np.sign(np.sin(2 * np.pi * 150 * tt_)) * (np.sin(2 * np.pi * 28 * tt_) > 0) * np.minimum(1, (0.5 - tt_) / 0.05)
        return lpf(x.astype(np.float32), 900)
    if name == 'RING':
        tt_ = np.arange(S(1.0)) / SR
        x = (np.sin(2 * np.pi * 440 * tt_) + np.sin(2 * np.pi * 480 * tt_)) * 0.5 * np.minimum(1, (1.0 - tt_) / 0.05)
        return bpf(x.astype(np.float32), 300, 3400)
    if name == 'DTMF':
        tt_ = np.arange(S(0.18)) / SR
        f1, f2 = rng.choice([697, 770, 852, 941]), rng.choice([1209, 1336, 1477])
        return ((np.sin(2 * np.pi * f1 * tt_) + np.sin(2 * np.pi * f2 * tt_)) * 0.5).astype(np.float32)
    if name == 'DIALTONE':
        tt_ = np.arange(S(1.6)) / SR
        x = (np.sin(2 * np.pi * 350 * tt_) + np.sin(2 * np.pi * 440 * tt_)) * 0.5 * np.minimum(1, (1.6 - tt_) / 0.2)
        return bpf(x.astype(np.float32), 300, 3400)
    if name == 'SLOT':
        n = S(1.0)
        tt_ = np.arange(n) / SR
        return (bpf(rng.standard_normal(n).astype(np.float32), 800, 5000) * (0.6 + 0.4 * np.sin(2 * np.pi * 43 * tt_)) * np.sin(np.pi * tt_ / 1.0)).astype(np.float32)
    return None


sfx = np.zeros((N, 2), np.float32)
SFX_LOG = []
for i, b in enumerate(BEATS):
    s0 = starts[i][0] / FPS
    for snd in b.get('sounds', []):
        x = synth(snd['name'])
        if x is None:
            x = load(os.path.join(SFXD, snd['name'] + '.wav'))
        else:
            x = np.column_stack([x, x])
        pk = np.max(np.abs(x)) + 1e-9
        x = x * (db(snd['gain']) / pk)
        at = s0 + snd['at']
        add(sfx, x.astype(np.float32), S(at))
        on_word = [l['id'] for l in LINES if l['on'] - 0.05 < at < l['end'] + 0.05]
        SFX_LOG.append(dict(beat=b['id'], name=snd['name'], at=round(at, 3), peak_dbfs=snd['gain'], during_line=on_word))

# ------------------------------------------------------------------ THE SILENCE after the Cancel click
a, b_ = S(CLICK), S(BUZZ)
for bus in (music, rooms, sfx):
    fade = np.ones(N, np.float32)
    fade[a:b_] = 0.0
    k_ = S(0.012)
    fade[a - k_:a] = np.linspace(1, 0, k_)
    if bus is not sfx:
        fade[b_:b_ + S(0.08)] = np.linspace(0, 1, S(0.08))
    if bus is sfx:
        fade[a - k_:a] = 1.0                        # the click itself lands, then nothing
        fade[a:a + S(0.06)] = np.linspace(1, 0, S(0.06))
    bus *= fade[:, None]
rt = lpf(loop_file('room_tone', b_ - a), 800)
rt *= db(-47.0) / (np.sqrt(np.mean(rt ** 2)) + 1e-12)
rt[:S(0.1)] *= np.linspace(0, 1, S(0.1))[:, None]
add(rooms, rt, a)

# ------------------------------------------------------------------ MASTER
mix = dlg + music + rooms + sfx
env = np.max(np.abs(mix), axis=1)
k_ = S(0.005)
pk = signal.convolve(np.maximum.reduce([np.roll(env, s) for s in range(0, k_, 48)]), np.ones(k_) / k_, 'same')
lim = np.minimum(1.0, 0.89 / (pk + 1e-9)).astype(np.float32)
lim_events = int(np.sum(lim < 0.999) / SR * 1000)
mix *= lim[:, None]
mix[:S(0.01)] *= np.linspace(0, 1, S(0.01))[:, None]
mix[-S(0.03):] *= np.linspace(1, 0, S(0.03))[:, None]
sf.write(OUT_WAV, mix, SR, subtype='PCM_24')

# ------------------------------------------------------------------ QA
try:
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    LU = lambda x: round(float(meter.integrated_loudness(x.astype(np.float64))), 1)
except Exception:
    LU = lambda x: None


def win_db(x, w=0.05):
    m = np.max(np.abs(x), axis=1) if x.ndim > 1 else np.abs(x)
    n = S(w)
    k = len(m) // n
    r = np.sqrt(np.mean((x[:k * n].reshape(k, n, -1) ** 2), axis=1)).max(axis=1)
    return 20 * np.log10(r + 1e-9)


wd = win_db(mix)
holes, run = [], 0
for i, v in enumerate(wd):
    if v < -42:
        run += 1
    else:
        if run * 0.05 >= 0.3:
            holes.append((round((i - run) * 0.05, 2), round(run * 0.05, 2)))
        run = 0
if run * 0.05 >= 0.3:
    holes.append((round((len(wd) - run) * 0.05, 2), round(run * 0.05, 2)))
md = win_db(music)
on = md > -55
mruns, cur = [], None
for i, v in enumerate(on):
    if v and cur is None:
        cur = i
    if not v and cur is not None:
        mruns.append((round(cur * 0.05, 2), round((i - cur) * 0.05, 2)))
        cur = None
if cur is not None:
    mruns.append((round(cur * 0.05, 2), round((len(on) - cur) * 0.05, 2)))
merged_runs = []
for a_, d_ in mruns:
    if merged_runs and a_ - (merged_runs[-1][0] + merged_runs[-1][1]) < 0.3:
        merged_runs[-1][1] = round(a_ + d_ - merged_runs[-1][0], 2)
    else:
        merged_runs.append([a_, d_])
sp_mask = tgt > 0.5
qa = dict(
    built=time.strftime('%Y-%m-%d %H:%M:%S'), reel=os.path.relpath(REEL, ROOT), wav=os.path.relpath(OUT_WAV, ROOT),
    frames=TOTAL_F, samples=N, seconds=round(N / SR, 3),
    loudness_lufs=dict(mix=LU(mix), dialogue=LU(dlg), music=LU(music), rooms=LU(rooms)),
    music_under_speech_dbfs_rms=round(float(20 * np.log10(np.sqrt(np.mean(music[sp_mask] ** 2)) + 1e-9)), 1),
    music_between_speech_dbfs_rms=round(float(20 * np.log10(np.sqrt(np.mean(music[~sp_mask] ** 2)) + 1e-9)), 1),
    peak_dbfs=round(float(20 * np.log10(np.max(np.abs(mix)) + 1e-9)), 2), limiter_ms=lim_events,
    silence_after_cancel=dict(click=round(CLICK, 3), buzz=round(BUZZ, 3), seconds=round(BUZZ - CLICK, 3),
                              level='room tone only, about -47 dBFS RMS (the script asks for digital silence here)'),
    holes_under_42dBFS_0p3s=holes, music_runs_raw=mruns, music_runs=merged_runs, music=MUSIC_LOG, rooms=ROOM_LOG, sfx=SFX_LOG,
    placements=place_log,
)
json.dump(qa, open(OUT_QA, 'w'), indent=1)
print(f"wrote {OUT_WAV} ({N / SR:.2f} s, {TOTAL_F} frames): mix {qa['loudness_lufs']}, peak {qa['peak_dbfs']} dBFS, "
      f"{len(holes)} holes, {len(mruns)} music runs, limiter {lim_events} ms")
