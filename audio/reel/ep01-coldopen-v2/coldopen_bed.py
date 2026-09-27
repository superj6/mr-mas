#!/usr/bin/env python3
"""Ep1 COLD OPEN (sc 1-4): the TEMP SOUND STEM for the stick reel, built from the timeline JSON.

  audio/.venv-casting/bin/python audio/reel/ep01-coldopen-v2/coldopen_bed.py
      reads  show/reel/ep01-full/ep01-coldopen-v2.json (CO_JSON=... to override)
      writes audio/reel/ep01-coldopen-v2/coldopen-bed.wav (48 kHz / 24-bit stereo, git-ignored) + coldopen-bed-qa.json

Why a stem (the same reason as the tag's, audio/reel/ep01-tag-v2/tag_bed.py): the episode mixer
(studio/src/reel/tools/mixer.mjs) lays the recorded takes and one temp bed per sequence, but no per-beat SFX. The
cold open's sound carries its structure: the hall with no music, the plink inside the real sentence, the freeze's
dry F4, the phone's buzz, the rewind, the 1-bit chips. So this stem is the cold open's single bed in the manifest
(`"src": "audio/reel/ep01-coldopen-v2/coldopen-bed.wav", "lufs": null, "loop": "none"`), and the mixer lays the three
takes over it and ducks it under them (-10 dB, from 0.25 s before a line; gaps under 2.5 s stay ducked).

Layers (every level is a measurement target; nothing was heard):
  hall     sc 1: the SFX board's room_tone (HVAC) at -38 LUFS + a made crowd murmur ("a few hundred people being
           polite") at -41 LUFS. At the freeze it cuts (8 ms) to a low filtered hum (the room tone band-passed
           120-700 Hz, -39 LUFS; 2026-09-27, it was < 220 Hz at -46 and a laptop speaker couldn't play it):
           "never to silence". The hum runs through sc 2 and 3.01, then steps down with the rewind.
  banquet  sc 1: made applause from across the street (many claps through a window: low-passed 2.4 kHz) at
           -29 LUFS, so -39 under the talk once the mixer ducks it. After "forward" it swells +6 dB over 1.2 s and is
           cut mid-rise by the freeze (the ovation freezes mid-rise).
  rewind   3.02: the hall and banquet before the freeze, reversed like tape, in four held steps of level and
           brightness that match the picture's four light steps, to nothing at white. 2026-09-27: its speed follows
           the Orb's year counter (3.02's '2022' item): 2x, a drag to 0.35x (a groan) while 2022 holds, then a lurch
           from 3x to 5x through the slip.
  music    2.01: MM-14 "Freeze F4" (temp: the SFX board's piano_fired_F4, "one dry upright-piano F4"), left to
           ring. 3.01 on: MM-06's underscore from 0.0 s (movement I, the 1993 chip line) at -26 LUFS, fading in over
           0.3 s under the F4's decay; it runs to the end of 4.02 and the intro's hard cut stops it.
  sfx      the beats' `sounds`: SFX-board files (audio/sfx/wav) at a peak level, and four made here: the plink (a
           glass tick over the board's water plop), the slosh, the phone's buzz on a table, and the toast's blink
           through a 1-bit quantiser (glyph_blink@1bit).
  The plink sits inside Mas's take, so the mixer ducks it -10 dB with the rest of the stem: its -4 dBFS peak here is
  set to land near -14 dBFS after the duck, above the room and under the voice.
"""
from __future__ import annotations

import json
import os

import numpy as np
import pyloudnorm
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
TL = os.environ.get('CO_JSON') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-coldopen-v2.json')
OUT = os.environ.get('CO_BED_OUT') or os.path.join(HERE, 'coldopen-bed.wav')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
MM06 = os.path.join(ROOT, 'audio/ost/tracks/mm06-beeper-1993-sample-chip-2008/render/'
                          'mm06-beeper-1993-sample-chip-2008-underscore.wav')
SR = 48000
FPS = 24
HUM_BAND = (120, 700)          # the freeze's hum: low mids a laptop speaker can play (2026-09-27; v2 was < 220 Hz)
HUM_LUFS = -39                 # v2: -46. The hall before the freeze is about -28 LUFS, so the drop stays ~11 LU
CATCH_SPEED = 0.35             # the rewind's speed while the counter holds 2022 (a drag: 1.5 octaves under the hall)
SLIP_SPEED = (3.0, 5.0)        # then it lurches on, speeding up to the white
rng = np.random.default_rng(1116)
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


def st(x, w=1.0):
    return np.stack([x, x * w], 1)


# ------------------------------------------------------------------ made sounds
def murmur(n):
    """a polite crowd far off: band-limited noise, slowly and irregularly modulated, a touch wider than mono"""
    out = []
    for ch in range(2):
        x = bp(rng.standard_normal(n), 220, 1800, 2)
        m = lp(rng.standard_normal(n), 3.0, 2)
        m = 1 + 0.6 * m / (np.abs(m).max() + 1e-9)
        out.append(x * m)
    return np.stack(out, 1)


def applause(n):
    """many clappers across the street, heard through a window: random claps, each a short noise burst"""
    k = int(0.03 * SR)
    t = np.arange(k) / SR
    kernels = [bp(rng.standard_normal(k), f * 0.6, f * 1.6, 2) * np.exp(-t / d)
               for f, d in [(900, 0.006), (1300, 0.005), (1800, 0.004), (1100, 0.007)]]
    out = []
    for ch in range(2):
        y = np.zeros(n)
        for kern in kernels:
            imp = np.zeros(n)
            rate = 160 * 4.2 / len(kernels)           # 160 clappers at ~4.2 claps a second, split over 4 timbres
            cnt = rng.poisson(rate * n / SR)
            imp[rng.integers(0, n, cnt)] = rng.uniform(0.3, 1.0, cnt)
            y += fftconvolve(imp, kern)[:n]
        y = lp(y, 2400, 4)                            # through the window glass
        out.append(y)
    return np.stack(out, 1)


def synth(name):
    if name == 'plink':                               # a hailstone into a glass of water: a glass tick over a plop
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        tick = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in
                   [(2950, 1.0, 0.060), (4430, 0.55, 0.035), (6120, 0.35, 0.020), (1475, 0.25, 0.045)])
        tick *= np.clip(t / 0.0008, 0, 1)
        plop = load(os.path.join(SFXD, 'plop_water.wav'))
        out = st(tick, 0.97)
        out[int(0.012 * SR): int(0.012 * SR) + len(plop)] += plop[: n - int(0.012 * SR)] * db(-9)
        return out
    if name == 'slosh':                               # the host's glass slops over its rim
        n = int(0.34 * SR)
        t = np.arange(n) / SR
        e = np.clip(t / 0.04, 0, 1) * np.exp(-np.maximum(0, t - 0.04) / 0.09)
        x = bp(rng.standard_normal(n), 350, 2600, 2) * e
        return st(x, 0.9)
    if name == 'buzz':                                # a phone buzzing face-up on a table: two pulses
        n = int(0.95 * SR)
        t = np.arange(n) / SR
        f = 172.0
        tone = np.sign(np.sin(2 * np.pi * f * t)) * 0.6 + np.sin(2 * np.pi * 2 * f * t) * 0.3
        rattle = 1 + 0.35 * np.sign(np.sin(2 * np.pi * 31 * t))
        gate = ((t < 0.38) | ((t > 0.52) & (t < 0.90))).astype(float)
        gate = lp(gate, 60, 2)
        x = lp(tone * rattle, 1500, 2) * gate
        return st(x, 0.95)
    raise KeyError(name)


def one_bit(x):
    """a sound heard through a 1-bit speaker: the sign of the wave, riding the original's envelope"""
    env = lp(np.abs(x), 80, 2)
    return np.sign(x) * np.maximum(env, 0) * 1.2


def main():
    doc = json.load(open(TL))
    beats = doc['beats']
    starts, t = {}, 0.0
    for b in beats:
        starts[b['id']] = t
        t += round(b['reelDur'] * FPS) / FPS
    end = t
    total = end + 0.5
    N = int(total * SR)
    B = {b['id']: b for b in beats}
    t_freeze = starts['2.01']
    t_mm06 = starts['3.01']
    t_rw0, t_rw1 = starts['3.02'], starts['3.02'] + B['3.02']['reelDur']
    ans = next(l for l in B['1.02']['lines'])
    t_forward = starts['1.02'] + ans['t'] + ans['dur']
    qa = {'timeline': os.path.relpath(TL, ROOT), 'seconds': round(total, 3), 'cold_open_seconds': round(end, 3),
          'layers': [], 'sfx': []}
    tt = np.arange(N) / SR

    # hall (sc 1) and the freeze's hum
    room = tile(to_lufs(load(os.path.join(SFXD, 'room_tone.wav')), -38), N)
    mur = to_lufs(murmur(N), -41)
    hall = fade((room + mur)[: int(t_freeze * SR)], 0.05, 0.008)   # cut (8 ms) on the freeze frame
    bus_hall = np.zeros((N, 2))
    bus_hall[: len(hall)] += hall
    # 2026-09-27: the hum is the HVAC band-passed 120-700 Hz at HUM_LUFS. v2 low-passed it at 220 Hz at -46 LUFS,
    # where the room tone's energy sits at 40-45 Hz: a laptop speaker can't play that, so after the F4 decayed the
    # invite read was ~3 s of silence on a small speaker (the assembler's holes 0:18.9-0:21.3). Still a ~11 LU drop.
    hum = to_lufs(bp(tile(load(os.path.join(SFXD, 'room_tone.wav')), N), HUM_BAND[0], HUM_BAND[1], 3), HUM_LUFS)
    hum_g = ((tt >= t_freeze) & (tt < t_rw0)).astype(float)
    steps = [0.0, -4.0, -9.0, -16.0]                  # the rewind's four held steps (level)
    qd = (t_rw1 - t_rw0) / 4
    for k, g in enumerate(steps):
        sel = (tt >= t_rw0 + k * qd) & (tt < t_rw0 + (k + 1) * qd)
        hum_g[sel] = db(g)
    hum_g = lp(hum_g, 40, 1)
    bus_hall += hum * hum_g[:, None]
    qa['layers'].append({'layer': 'hall', 'src': 'audio/sfx/wav/room_tone.wav + made murmur', 'lufs': [-38, -41],
                         'from': 0.0, 'to': round(t_freeze, 3)})
    qa['layers'].append({'layer': 'hum (the freeze)', 'src': f'room_tone band-passed {HUM_BAND[0]}-{HUM_BAND[1]} Hz',
                         'lufs': HUM_LUFS, 'from': round(t_freeze, 3), 'to': round(t_rw1, 3), 'steps_db': steps})

    # the banquet's applause, swelling after "forward", cut by the freeze
    ap_n = int((t_freeze + 0.01) * SR)
    ap = to_lufs(applause(ap_n), -29)
    ta = np.arange(ap_n) / SR
    swell = 1 + (db(6) - 1) * np.clip((ta - (t_forward + 0.1)) / 1.2, 0, 1)
    ap = fade(ap * swell[:, None], 0.05, 0.008)
    bus_ban = np.zeros((N, 2))
    add(bus_ban, ap, 0.0)
    qa['layers'].append({'layer': 'banquet applause (made)', 'lufs': -29, 'swell_db': 6,
                         'swell_from': round(t_forward + 0.1, 3), 'cut_at_freeze': round(t_freeze, 3)})

    # the rewind: the hall and banquet before the freeze, reversed, like tape, in four held steps of level and
    # brightness. 2026-09-27: its speed follows the Orb's year counter (the '2022' item in 3.02's onscreen): 2x until
    # the catch, a drag to CATCH_SPEED (a pitch-down groan) while 2022 holds, then a lurch that speeds up through the
    # slip (SLIP_SPEED). The speed is smoothed like a reel with inertia, so it never clicks.
    y22 = next((o for o in B['3.02'].get('onscreen', []) if o['text'] == '2022'), None)
    c0 = y22['at'] if y22 else None
    c1 = (y22['until'] if y22['until'] is not None else B['3.02']['reelDur']) if y22 else None
    n_rw = int((t_rw1 - t_rw0) * SR)
    tr = np.arange(n_rw) / SR
    if y22:
        speed = np.where(tr < c0, 2.0, np.where(tr < c1, CATCH_SPEED,
                         SLIP_SPEED[0] + (SLIP_SPEED[1] - SLIP_SPEED[0]) * (tr - c1) / max(1e-6, tr[-1] - c1)))
    else:
        speed = np.full(n_rw, 2.0)
    speed = lp(np.concatenate([np.full(SR, speed[0]), speed]), 7.0, 2)[SR:]   # inertia (~0.1 s)
    phase = np.concatenate([[0.0], np.cumsum(speed)[:-1]])
    need = phase[-1] / SR + 0.2
    pre = (bus_hall + bus_ban)[max(0, int((t_freeze - need) * SR)): int(t_freeze * SR)][::-1]
    rw = np.stack([np.interp(phase, np.arange(len(pre)), pre[:, c]) for c in range(2)], 1)
    out = np.zeros_like(rw)
    for k, (g, cut) in enumerate(zip(steps, [9000, 4500, 2200, 1000])):
        a, b = int(k * qd * SR), int((k + 1) * qd * SR)
        out[a:b] = lp(rw, cut, 2)[a:b] * db(g - 4)
    out = fade(out, 0.03, 0.25)
    bus_rw = np.zeros((N, 2))
    add(bus_rw, out, t_rw0)
    qa['layers'].append({'layer': 'rewind', 'src': f'the hall + banquet, last {need:.1f} s before the freeze, reversed',
                         'from': round(t_rw0, 3), 'to': round(t_rw1, 3), 'steps_db': [s - 4 for s in steps],
                         'lowpass_hz': [9000, 4500, 2200, 1000],
                         'speed': {'before_catch': 2.0, 'catch': CATCH_SPEED, 'slip': SLIP_SPEED,
                                   'catch_s_in_3.02': [c0, c1]}})

    # music: MM-06 under the F4's decay (the F4 itself is a beat sound, below)
    mm = load(MM06)
    g06 = -26 - lufs(mm[: 12 * SR])
    seg = mm[: int((total - t_mm06) * SR)] * db(g06)
    seg = fade(seg, 0.3, 0.0)
    bus_mus = np.zeros((N, 2))
    add(bus_mus, seg, t_mm06)
    qa['layers'].append({'layer': 'MM-06 underscore (movement I)', 'src': os.path.relpath(MM06, ROOT), 'file_in': 0.0,
                         'from': round(t_mm06, 3), 'lufs_first_12s': -26, 'gain_db': round(g06, 2)})

    # SFX
    bus_sfx = np.zeros((N, 2))
    for b in beats:
        for s in b.get('sounds', []):
            at = starts[b['id']] + s['at']
            name = s['name']
            if name.startswith('synth:'):
                x = synth(name[6:])
            elif name.endswith('@1bit'):
                x = one_bit(load(os.path.join(SFXD, name[:-5] + '.wav')))
            else:
                x = load(os.path.join(SFXD, name + '.wav'))
            x = to_peak(x, s['gain'])
            add(bus_sfx, x, at)
            qa['sfx'].append({'beat': b['id'], 'name': name, 'at': round(at, 3), 'peak_dbfs': s['gain']})

    mix = bus_hall + bus_ban + bus_rw + bus_mus + bus_sfx
    mix = fade(mix, 0.0, 0.3)
    pk = np.abs(mix).max()
    if pk > db(-1.0):
        mix *= db(-1.0) / pk
        qa['trim_db'] = round(20 * np.log10(db(-1.0) / pk), 2)
    sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')

    def win(x, t0, t1):
        return round(lufs(x[int(t0 * SR): int(t1 * SR)]), 1)

    qa['measured'] = {
        'lufs_whole': round(lufs(mix), 2), 'peak_dbfs': round(20 * np.log10(np.abs(mix).max()), 2),
        'lufs_sc1_before_duck': win(mix, 0, t_freeze), 'lufs_swell_last_1s': win(mix, t_freeze - 1.0, t_freeze),
        'lufs_sc2': win(mix, t_freeze, starts['3.01']), 'lufs_sc3': win(mix, starts['3.01'], starts['4.01']),
        'lufs_sc4': win(mix, starts['4.01'], end),
        'note': 'un-ducked stem levels; the mixer ducks the stem -10 dB under the takes',
    }
    with open(OUT.replace('.wav', '-qa.json'), 'w') as fh:
        json.dump(qa, fh, indent=1)
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {total:.2f} s; freeze at {t_freeze:.3f} s; MM-06 from {t_mm06:.3f} s; "
          f"{len(qa['sfx'])} sfx; {json.dumps(qa['measured'])}")


if __name__ == '__main__':
    main()
