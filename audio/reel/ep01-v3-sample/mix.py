#!/usr/bin/env python3
"""Ep1 stick v3 SAMPLE: the full mix (takes + rooms + SFX + the temp score), on the sample's own clock.

  audio/.venv-casting/bin/python audio/reel/ep01-v3-sample/mix.py
      reads  show/reel/trials/ep01-v3-sample.json (build_timeline.py) and music/music.wav (the composer's stem;
             without it the mix is built with no score and says so)
      writes audio/reel/ep01-v3-sample/mix.wav (48 kHz / 24-bit stereo, git-ignored) + mix-qa.json

The sample manifest (show/reel/trials/ep01-v3-sample.manifest.json) plays this file as the chapter's own sound.

Layers:
  DIALOGUE  every take at beatStart + t - in, dual mono. Lines tagged monitor / laptop / call get a small-speaker
            band. The V.O. is dry and close, at dialogue level (pov-and-framing §5.1).
  ROOMS     one bed per beat `room`. A new room LEADS the cut: it fades in over the last 0.6 s of the outgoing
            shot and the old room fades out over 0.4 s after it (v3-plan §2.1, "sound leads"). Slates are silent.
  SFX       the beats' `sounds`, with act1_bed.py's players (files and synth:<kind>); Act Four's named sounds map
            to board files (BUZZ, RING, SLOT).
  SILENCE   the Cancel click -> the phone buzz (S1.09 +2.4 s -> S1.11 +0.3 s): rooms out, room tone only.
  MUSIC     music/music.wav, ducked 10 dB under speech (pre 0.25 s, attack 0.2 s, release 0.6 s, held across
            gaps under 2.5 s: the episode mixer's duck). Rooms dip 2 dB under speech.
  MASTER    -16 LUFS integrated, peaks held under -1 dBFS.
Nothing here has been listened to; mix-qa.json lists what was measured.
"""
import importlib.util
import json
import os

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
spec = importlib.util.spec_from_file_location('act1bed', os.path.join(ROOT, 'audio/reel/ep01-act1-v2/act1_bed.py'))
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)  # helpers only: its main() runs under __main__

SR, FPS = 48000, 24
TL = json.load(open(os.path.join(ROOT, 'show/reel/trials/ep01-v3-sample.json')))
MUSIC = os.path.join(HERE, 'music/music.wav')
OUT = os.path.join(HERE, 'mix.wav')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
NAMED = {'BUZZ': 'phone_buzz_desk', 'RING': 'call_ring', 'SLOT': 'slot_whir'}
SMALL = {'monitor', 'laptop', 'call'}
LEAD, TRAIL = 0.6, 0.4

beats = TL['beats']
starts, acc, prev = [], 0.0, 0
for b in beats:
    acc += b['reelDur']
    end = max(prev + 1, round(acc * FPS))
    starts.append((prev / FPS, end / FPS))
    prev = end
TOTAL = prev / FPS
N = int(round(TOTAL * SR))
BI = {b['id']: i for i, b in enumerate(beats)}
s = lambda bid: starts[BI[bid]][0]
qa = {'length_s': round(TOTAL, 3), 'layers': [], 'sfx': 0, 'lines': 0}

dlg, room, fx, mus = (np.zeros((N, 2)) for _ in range(4))
speech = []

# ------------------------------------------------------------------ dialogue
for i, b in enumerate(beats):
    for l in b.get('lines', []):
        if not l.get('audio'):
            continue
        x, sr = sf.read(os.path.join(ROOT, l['audio']), always_2d=True, dtype='float64')
        x = x[:, :1]
        if l.get('tag') in SMALL:
            x = A.bp(x[:, 0], 300, 4200)[:, None] * 1.6
        x = np.repeat(x, 2, axis=1) * A.db(-3)
        on = starts[i][0] + l['t']
        A.add(dlg, x, on - l.get('in', 0))
        speech.append((on, on + l['dur']))
        qa['lines'] += 1

# ------------------------------------------------------------------ rooms (sound leads the cut)
def room_bed(kind, n):
    def loop(name, target, filt=None):
        x = A.load(os.path.join(SFXD, name))
        if filt:
            x = filt(x)
        x = A.to_lufs(x, target)
        reps = int(np.ceil(n / len(x))) + 1
        return np.concatenate([x] * reps)[:n]
    if kind == 'bullpen':
        return loop('server_hum.wav', -37) + loop('neon_buzz.wav', -49)
    if kind == 'basement':
        return loop('server_hum.wav', -33, lambda x: A.lp(x, 900))
    if kind == 'suite':
        return loop('bed_suite.wav', -38)
    if kind in ('dark', 'darkroom'):
        return loop('server_hum.wav', -42, lambda x: A.lp(x, 1400)) + loop('room_tone.wav', -46)
    if kind == 'tpool':
        return loop('bed_tpool.wav', -40)
    return np.zeros((n, 2))


runs = []
for i, b in enumerate(beats):
    k = b.get('room') or ('void' if b.get('set') == 'void' and b.get('kind') == 'card' else b.get('set', 'void'))
    if b.get('kind') == 'card':
        k = 'void'
    if runs and runs[-1][0] == k:
        runs[-1][2] = starts[i][1]
    else:
        runs.append([k, starts[i][0], starts[i][1]])
for j, (k, a, e) in enumerate(runs):
    if k == 'void':
        continue
    lead = LEAD if j > 0 and runs[j - 1][0] != 'void' else 0.3
    trail = TRAIL if j + 1 < len(runs) and runs[j + 1][0] != 'void' else 0.3
    a0, e0 = max(0.0, a - lead), min(TOTAL, e + trail)
    x = room_bed(k, int((e0 - a0) * SR))
    x = A.fade(x, lead, trail)
    A.add(room, x, a0)
    qa['layers'].append({'room': k, 'from': round(a0, 2), 'to': round(e0, 2)})

# race weekend: a far practice-lap whine under the suite's first shot (answers "why Vegas?" in sound)
t0 = s('S1.01') + 0.8
n = int(3.6 * SR)
tt = np.arange(n) / SR
f = 210 - 60 * (tt / 3.6)                     # doppler fall
ph = 2 * np.pi * np.cumsum(f) / SR
whine = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)) * np.sin(np.pi * tt / 3.6) ** 2
whine = A.bp(whine, 150, 2500)
A.add(room, A.st(A.to_peak(A.st(whine), -40)[:, 0]), t0)

# ------------------------------------------------------------------ sfx
for i, b in enumerate(beats):
    for sd in b.get('sounds', []):
        name = NAMED.get(sd['name'], sd['name'])
        try:
            x, off = A.sound(name, sd.get('dur'), sd.get('align'))
        except Exception as e:  # a named sound with no file: skip it, and say so
            qa.setdefault('sfx_missing', []).append(f"{b['id']}:{sd['name']} ({e.__class__.__name__})")
            continue
        x = A.to_peak(x, sd['gain'])
        A.add(fx, x, starts[i][0] + sd['at'] - off)
        qa['sfx'] += 1

# ------------------------------------------------------------------ the one silence: Cancel click -> the buzz
sil_a, sil_b = s('S1.09') + 2.4, s('S1.11') + 0.3
g = np.ones(N)
ia, ib = int(sil_a * SR), int(sil_b * SR)
g[ia:ib] = 0.0
ramp = int(0.03 * SR)
g[ib:ib + ramp] = np.linspace(0, 1, ramp)
room *= g[:, None]
tone = A.to_lufs(A.load(os.path.join(SFXD, 'room_tone.wav')), -50)
tone = np.concatenate([tone] * (int((sil_b - sil_a) * SR) // len(tone) + 2))[: ib - ia]
A.add(room, tone, sil_a)
qa['layers'].append({'silence': [round(sil_a, 2), round(sil_b, 2)], 'what': 'rooms out, room tone at -50 LUFS'})

# ------------------------------------------------------------------ music, ducked under speech
if os.path.exists(MUSIC):
    m, sr = sf.read(MUSIC, always_2d=True, dtype='float64')
    assert sr == SR
    A.add(mus, m[:N], 0.0)
    qa['layers'].append({'music': os.path.relpath(MUSIC, ROOT), 'len_s': round(len(m) / SR, 3)})
else:
    qa['layers'].append({'music': 'MISSING: built without a score'})

speech.sort()
merged = []
for a, e in speech:
    if merged and a - merged[-1][1] < 2.5:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([a, e])
duck = np.zeros(N)
for a, e in merged:
    i0, i1 = int((a - 0.25) * SR), int((e + 0.0) * SR)
    duck[max(0, i0):min(N, i1)] = 1.0
# attack 0.2 s / release 0.6 s smoothing, at a 10 ms block rate, then interpolated to samples
BL = 480
blocks = duck[: (N // BL) * BL].reshape(-1, BL).max(axis=1)
att, rel = np.exp(-1 / (0.2 * 100 / 3)), np.exp(-1 / (0.6 * 100 / 3))
smb = np.zeros(len(blocks))
v = 0.0
for i, tgt in enumerate(blocks):
    v = tgt + (v - tgt) * (att if tgt > v else rel)
    smb[i] = v
sm = np.interp(np.arange(N), np.arange(len(smb)) * BL + BL / 2, smb)
# duck depth by section: launch night's warm bed only dips 6 dB so its warmth survives the talk (composer's note);
# 2 AM dips 8 dB; Vegas keeps the episode mixer's 10 dB
depth = np.full(N, 10.0)
depth[: int(s('B.00') * SR)] = 6.0
depth[int(s('C.00') * SR):] = 8.0
mus *= A.db(-depth * sm)[:, None]
room *= A.db(-2 * sm)[:, None]

# ------------------------------------------------------------------ master
mix = dlg + room + fx + mus
mix = A.to_lufs(mix, -16.0)
pk = np.abs(mix).max()
if pk > A.db(-1.0):  # a gentle soft-clip above -3 dBFS keeps the rare transient under -1 dBFS
    th = A.db(-3.0)
    over = np.abs(mix) > th
    mix[over] = np.sign(mix[over]) * (th + (A.db(-1.0) - th) * np.tanh((np.abs(mix[over]) - th) / (A.db(-1.0) - th)))
qa['lufs_integrated'] = round(A.lufs(mix), 2)
qa['peak_dbfs'] = round(20 * np.log10(np.abs(mix).max() + 1e-12), 2)
for name, bus in (('dialogue', dlg), ('rooms', room), ('sfx', fx), ('music', mus)):
    qa['layers'].append({'bus': name, 'lufs_pre_master': round(A.lufs(bus), 2) if np.abs(bus).max() > 0 else None})
sf.write(OUT, mix, SR, subtype='PCM_24')
json.dump(qa, open(os.path.join(HERE, 'mix-qa.json'), 'w'), indent=1)
print(f"wrote {os.path.relpath(OUT, ROOT)}: {TOTAL:.2f} s, {qa['lufs_integrated']} LUFS, peak {qa['peak_dbfs']} dBFS, "
      f"{qa['lines']} lines, {qa['sfx']} sfx, missing sfx: {qa.get('sfx_missing', [])}")
