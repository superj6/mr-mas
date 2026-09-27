#!/usr/bin/env python3
"""Ep1 TAG (sc 32-33): the TEMP SOUND STEM for the stick reel, built from the timeline JSON.

  audio/.venv-casting/bin/python audio/reel/ep01-tag-v2/tag_bed.py
      reads  show/reel/ep01-full/ep01-tag-v2.json (TAG_JSON=... to override)
      writes audio/reel/ep01-tag-v2/tag-bed.wav (48 kHz / 24-bit stereo, git-ignored) + tag-bed-qa.json

Why a stem: the episode mixer (studio/src/reel/tools/mixer.mjs) lays takes and one temp bed per sequence, but no
per-beat SFX. The tag's sound IS its structure (the script: "one cue, and one stop (the thud)"; the button chord;
the hook "on a sound"), so this stem carries it and the manifest plays it as the tag's single bed
(`"src": "audio/reel/ep01-tag-v2/tag-bed.wav", "lufs": null, "loop": "none"`). The mixer still lays the two takes
over it and ducks it under them (-10 dB), which is what "it thins under ..." wants anyway.

Layers (every level is a measurement target, nothing was heard):
  room   server_hum (the rack's fans, tuned to F) at -40 LUFS under the whole tag; it keeps going after the thud
         ("the rack and the fans hold") and under the black
  felt   MM-12 december has no render, so the temp is MM-01 WATER LINE's piano stem (the felt; Mas's DARK ROOM line,
         which MM-12 may quote per its cue sheet), placed so the file's 25.0 s (the downbeat after the A section's
         ending bar) falls exactly on the THUD, where it stops dead (8 ms). -27 LUFS, dipped 3 dB under the cover
         (32.02-32.03: the script's "thins under the magazine's real line")
  pedal  (r3) the Q* vault's F hum (vault_hum_F), picked up from Act Four's last frame at -31 LUFS from the first
         sample, held until the felt enters, then faded out under it over 3 s (the script: MM-12 "picks up sc 31's
         F pedal from the vault"; the flow audit's #38, the near-black join)
  sfx    the beats' `sounds`: SFX-board files (audio/sfx/wav) and four made here: drawer_open, drawer_shut, the THUD
         (a newspaper dropped flat: a low body, a paper slap, the desk's small things hopping), and the button chord
  button the chord with no third (felt F3 C4 F4 C5, the SFX board's felt F4 re-pitched) on the downbeat after
         "noted.", and the vault's own F hum (vault_hum_F; r2 used room_drone, F1 + C2) swelling in under it as its
         root; it rings on
         under the black and out through the next bed's crossfade
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
TL = os.environ.get('TAG_JSON') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-tag-v2.json')
OUT = os.environ.get('TAG_BED_OUT') or os.path.join(HERE, 'tag-bed.wav')
SFXD = os.path.join(ROOT, 'audio/sfx/wav')
FELT = os.path.join(ROOT, 'audio/ost/tracks/mm01-water-line/render/stems/mm01-water-line-piano.flac')
FELT_STOP_AT = 25.0          # MM-01: bar 11 downbeat (the A ending bar is bar 10, 22.5-25.0 s; cue.json markers)
SR = 48000
FPS = 24
LOOPS = {'server_hum', 'room_drone', 'vault_hum_F'}
# r3 (tag-fix pass, 2026-09-27): the pedal the tag picks up from Act Four. Act Four's S8.06 lays vault_hum_F "to the
# act's last frame; the tag picks it up" (audio/ep01/act4/sfx-v5/spot_v5.py), but r2's stem opened on a 0.6 s room
# fade with the felt 0.83 s in, so the join dipped to about -54 to -62 dBFS for 0.5 s (audit-v2 #38). Level: Act
# Four's mix.wav, 6-2 s before its end, measures -33.3 dBFS RMS in the 80-95 Hz band (the hum's F2), where the loop
# file measures -17.6: about -16 dB on a -14 LUFS file, so -31 LUFS here (1 dB under the match: that band also holds
# MM-11's F). It holds at level from the first sample until the felt enters, then fades out under the felt.
PEDAL_LUFS = -31
PEDAL_FADE = 3.0             # s, equal-power, from the felt's entry
rng = np.random.default_rng(1207)
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
    j = min(len(bus), i + len(x))
    if i < 0:
        x, i = x[-i:], 0
    bus[i:j] += x[: j - i]


def tile(x, n):
    return np.concatenate([x] * (n // len(x) + 1))[:n]


def fade(x, fin=0.0, fout=0.0):
    x = x.copy()
    if fin > 0:
        k = int(fin * SR)
        x[:k] *= np.sin(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    if fout > 0:
        k = int(fout * SR)
        x[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    return x


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def repitch(x, ratio):
    """speed change by `ratio` (a pitch shift for a temp chord; the length changes with it)"""
    n = int(len(x) / ratio)
    src = np.arange(n) * ratio
    return np.stack([np.interp(src, np.arange(len(x)), x[:, c]) for c in range(2)], axis=1)


# ------------------------------------------------------------------ made sounds
def synth(name):
    if name == 'drawer_open':           # a wooden drawer on its runners, then its stop
        n = int(0.42 * SR)
        e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
        x = bp(rng.standard_normal(n), 180, 1400) * e * 0.5
        x = np.stack([x, x * 0.9], 1)
        k = load(os.path.join(SFXD, 'key_tap_soft_02.wav'))
        out = np.zeros((n + len(k), 2))
        out[:n] += x
        out[n - 600: n - 600 + len(k)] += lp(k, 900) * 0.7
        return out
    if name == 'drawer_shut':           # the push and the knock
        n = int(0.22 * SR)
        e = np.linspace(0, 1, n) ** 2
        x = bp(rng.standard_normal(n), 200, 1200) * e * 0.35
        k = load(os.path.join(SFXD, 'felt_key_mech_01.wav'))
        out = np.zeros((n + len(k), 2))
        out[:n] += np.stack([x, x], 1)
        out[n: n + len(k)] += lp(k, 1200) * 1.4
        return out
    if name == 'thud':                  # a folded newspaper dropped flat on a desk from above frame
        n = int(0.9 * SR)
        t = np.arange(n) / SR
        f = 58 + 70 * np.exp(-t / 0.018)                     # the body: a short drop in pitch, then F1-ish weight
        body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.085)
        slap = bp(rng.standard_normal(n), 300, 3200, 3) * np.exp(-t / 0.022) * 1.4
        rustle = bp(rng.standard_normal(n), 2000, 7000) * np.exp(-np.maximum(0, t - 0.01) / 0.07) * 0.25
        x = body * 1.0 + slap + rustle
        out = np.stack([x, x * 0.96], 1)
        for i, (fn, dt, g) in enumerate([('key_tap_soft_04.wav', 0.045, 0.35), ('key_tap_soft_06.wav', 0.07, 0.3),
                                         ('key_tap_space.wav', 0.095, 0.25)]):   # the phone, the keys, the Orb hop
            k = load(os.path.join(SFXD, fn)) * g
            i0 = int(dt * SR)
            out[i0: i0 + len(k)] += k[: n - i0]
        return out
    if name == 'button_chord':          # the chord with no third: F3 C4 F4 C5 on the felt, a hair of spread
        f4 = load(os.path.join(SFXD, 'piano_fired_F4--felt.wav'))
        parts = [(0.5, 0.000, 1.0, -0.25), (2 ** (-5 / 12), 0.008, 0.8, 0.1), (1.0, 0.012, 0.75, 0.2), (2 ** (7 / 12), 0.018, 0.5, 0.35)]
        n = int(max(len(f4) / r for r, *_ in parts) + 0.05 * SR)
        out = np.zeros((n, 2))
        for r, dt, g, pan in parts:
            x = repitch(f4, r) * g
            x[:, 0] *= 1 - max(0, pan)
            x[:, 1] *= 1 + min(0, pan)
            i0 = int(dt * SR)
            out[i0: i0 + len(x)] += x[: n - i0]
        return out
    raise KeyError(name)


def main():
    doc = json.load(open(TL))
    beats = doc['beats']
    starts, t = {}, 0.0
    for b in beats:
        starts[b['id']] = t
        t += round(b['reelDur'] * FPS) / FPS
    tag = [b for b in beats if b['act'] == 'TAG']
    tag_end = starts[tag[-1]['id']] + tag[-1]['reelDur']
    total = tag_end + 1.0                      # material past the tag's end, for the outro bed's crossfade
    N = int(total * SR)
    qa = {'timeline': os.path.relpath(TL, ROOT), 'seconds': round(total, 3), 'tag_seconds': round(tag_end, 3), 'layers': [], 'sfx': []}

    # the THUD's time (the felt stops on it)
    thud = next(s for b in beats for s in b.get('sounds', []) if s['name'] == 'synth:thud')
    thud_b = next(b for b in beats if any(s['name'] == 'synth:thud' for s in b.get('sounds', [])))
    t_thud = starts[thud_b['id']] + thud['at']

    # room
    room = to_lufs(load(os.path.join(SFXD, 'server_hum.wav')), -40)
    room = fade(tile(room, N), 0.01, 0.0)      # r3: at level from the first sample (r2 faded in over 0.6 s)
    # when the music stops, the fans are suddenly the loudest thing in the room: +4 dB from the thud (50 ms ramp),
    # so the 6-7 s between the thud and "noted." hold a room, not a near-silence
    tt = np.arange(N) / SR
    room = room * (1 + (db(4) - 1) * np.clip((tt - t_thud) / 0.05, 0, 1))[:, None]
    bus_room = room
    qa['layers'].append({'layer': 'room', 'src': 'audio/sfx/wav/server_hum.wav', 'lufs': -40, 'lift_after_thud_db': 4,
                         'from': 0.0, 'to': round(total, 3)})

    # felt (MM-12 temp: MM-01's piano stem), the file's 25.0 s on the thud, stopped dead there
    felt_src = load(FELT)
    f_start = t_thud - FELT_STOP_AT            # tag time of the stem's 0.0
    a = max(0.0, -f_start)                     # file offset if the tag is shorter than the lead
    seg = felt_src[int(a * SR): int(FELT_STOP_AT * SR)]
    seg = to_lufs(seg, -27)
    seg = fade(seg, 0.04, 0.008)
    # the dip under the cover (32.02 start -> 32.03 end), 0.3 s ramps
    d0, d1 = starts['32.02'] - max(0.0, f_start), starts['32.03'] + beats[[b['id'] for b in beats].index('32.03')]['reelDur'] - max(0.0, f_start)
    tt = np.arange(len(seg)) / SR
    g = np.ones(len(seg))
    ramp = np.clip((tt - d0) / 0.3, 0, 1) * np.clip((d1 - tt) / 0.3 + 1, 0, 1)
    g *= 1 - (1 - db(-3)) * np.clip(ramp, 0, 1)
    seg = seg * g[:, None]
    bus_felt = np.zeros((N, 2))
    add(bus_felt, seg, max(0.0, f_start))

    # r3: the vault's F pedal, carried over the cut from Act Four and handed to the felt line
    p_hold = max(0.0, f_start)
    p_len = p_hold + PEDAL_FADE
    pedal = to_lufs(load(os.path.join(SFXD, 'vault_hum_F.wav')), PEDAL_LUFS)
    pedal = tile(pedal, int(p_len * SR))
    pedal = fade(pedal, 0.01, 0.0)
    k = int(PEDAL_FADE * SR)
    pedal[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None]      # equal-power out (the felt comes up under it)
    bus_felt[: len(pedal)] += pedal
    qa['layers'].append({'layer': 'pedal (the vault hum, from Act Four)', 'src': 'audio/sfx/wav/vault_hum_F.wav',
                         'lufs': PEDAL_LUFS, 'from': 0.0, 'hold_to': round(p_hold, 3), 'out_by': round(p_len, 3)})
    qa['layers'].append({'layer': 'felt (MM-12 temp)', 'src': os.path.relpath(FELT, ROOT), 'file_in': round(a, 3),
                         'from': round(max(0.0, f_start), 3), 'stop_on_thud': round(t_thud, 3), 'lufs': -27,
                         'dip_db': -3, 'dip': [round(max(0.0, f_start) + d0, 3), round(max(0.0, f_start) + d1, 3)]})

    # SFX and the button
    bus_sfx = np.zeros((N, 2))
    for b in beats:
        for s in b.get('sounds', []):
            at = starts[b['id']] + s['at']
            name = s['name']
            if name.startswith('synth:'):
                x = synth(name[6:])
            else:
                x = load(os.path.join(SFXD, name + '.wav'))
            if name in LOOPS:                  # a loop: level by LUFS, run to the end, swell in over 0.8 s
                x = fade(tile(to_lufs(x, s['gain']), N - int(at * SR)), 0.8, 0.0)
                kind = 'loop (LUFS)'
            else:
                x = to_peak(x, s['gain'])
                kind = 'one-shot (peak dBFS)'
            add(bus_sfx, x, at)
            qa['sfx'].append({'beat': b['id'], 'name': name, 'at': round(at, 3), 'gain': s['gain'], 'kind': kind})

    mix = bus_room + bus_felt + bus_sfx
    # nothing of the old line may survive the thud: the felt bus is already cut there; the fade to the next bed is
    # the mixer's (the outro bed's crossfade); keep a 0.3 s fade on the stem's own last material
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
        'lufs_sc32': win(mix, 0, starts['33.01']), 'lufs_thud_to_noted': win(mix, t_thud + 0.3, starts['33.04']),
        'lufs_button_to_end': win(mix, starts['33.04'], tag_end),
        'felt_after_thud_peak_dbfs': round(20 * np.log10(max(1e-9, np.abs(bus_felt[int((t_thud + 0.01) * SR):]).max())), 1),
        # r3: the head of the stem (the Act Four join): RMS of the first 50 ms and the first 0.5 s, LUFS of 0-2 s
        'rms_first_50ms_dbfs': round(20 * np.log10(np.sqrt((mix[: int(0.05 * SR)] ** 2).mean()) + 1e-12), 1),
        'rms_first_500ms_dbfs': round(20 * np.log10(np.sqrt((mix[: int(0.5 * SR)] ** 2).mean()) + 1e-12), 1),
        'lufs_0_2s': win(mix, 0, 2.0),
    }
    with open(OUT.replace('.wav', '-qa.json'), 'w') as fh:
        json.dump(qa, fh, indent=1)
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {total:.2f} s; thud at {t_thud:.3f} s; felt from {max(0.0, f_start):.3f} s "
          f"(file {a:.3f} s); {len(qa['sfx'])} sfx; {json.dumps(qa['measured'])}")


if __name__ == '__main__':
    main()
