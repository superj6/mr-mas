"""OUTRO B · the designed sound and the mix for the mock-up (lookdev; OUTRO-PROPOSALS §3).

Reads (read-only): the temp score rendered by track.py into $SC/music, and the intro's own Orb sounds in
audio/intro-sfx/src (the servo on C6, the scan "shhk" retuned to F/C, the toast chime C7, the tuned server hum), so the
outro's Orb sounds exactly like the intro's. Synthesizes here: the scan's sustained sweep under the cone (the intro's
cone lasts 5 frames; this one lasts 25), the GLYPH grains inside it, a faint tick per toast chip, and Ep1's moth (bars
3-4 since pass 5): its wingbeats (panned with its flight, louder as it nears the lamp), its bump on the Orb's lens glass
(a clear tuned tink on 3.4, the stinger's one audible gag sound), the Orb's flinch (two aperture ticks), its landing
tick and wing fold, the Orb's beam on it (the intro's scan shhk, soft) and a wing twitch. No switch-off at the cut: the
picture cuts, the fifth releases. Writes: out/lookdev/outro/b/outro-b-{music,sfx,mix}.wav and $SC/mix-report.json
(with the loudness of each bar, so the payoff can be checked against the knee).

  audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/mix.py "$SC"

Frames are FILE frames of the mock-up (24 fps): the 24-frame stand-in, then the outro at f24 = o0 (Ep1: 240 outro
frames, the cut at o240), then 18 frames of black. One owner per sound (OST-BIBLE rule 11): the SFX own the servo, the
scan, the grains, the chime and the moth; the score leaves them room (bar 1.3-1.4 has no music, 3.1 and 3.4 have no
score onset).
"""
import json
import os
import sys

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.signal import butter, lfilter, resample_poly, sosfilt

ROOT = '/home/jgon/project/art/mrmas'
SC = sys.argv[1]
OUT = os.path.join(ROOT, 'out/lookdev/outro/b')
os.makedirs(OUT, exist_ok=True)
SR = 48000
FPS = 24
PRE = 24
OUT_F = 240                                   # Ep1's outro: 3 bars + the stinger bar (a plain week is 180)
N_FRAMES = PRE + OUT_F + 18                   # 24 stand-in + 240 outro + 18 black (the release) = 282
N = N_FRAMES * SR // FPS                      # 11.75 s exactly
SRC = os.path.join(ROOT, 'audio/intro-sfx/src')
rng = np.random.default_rng(1215)


def fr(f):
    return int(round(f * SR / FPS))


def o(of):                                     # outro frame -> file frame
    return of + PRE


def load(path):
    x, sr = sf.read(path, always_2d=True, dtype='float64')
    assert sr == SR, (path, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.T.copy()


def db(v):
    return 10 ** (v / 20)


def pan2(mono, p):
    """constant-power pan, p -1 (left) .. 1 (right); p may be an array"""
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)])


def place(bus, x, frame, gain_db=0.0, pan=None, peak_db=None):
    """add stereo x at a file frame; peak_db normalises its peak first; pan re-pans a mono sum"""
    if peak_db is not None:
        x = x * (db(peak_db) / (np.max(np.abs(x)) + 1e-12))
    if pan is not None:
        x = pan2(x.mean(axis=0) * np.sqrt(2), pan)
    x = x * db(gain_db)
    s = fr(frame)
    e = min(bus.shape[1], s + x.shape[1])
    bus[:, s:e] += x[:, :e - s]


def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return sosfilt(sos, x)


def resonator(x, f, q):
    w = 2 * np.pi * f / SR
    r = np.exp(-w / (2 * q))
    b = [1 - r]
    a = [1, -2 * r * np.cos(w), r * r]
    return lfilter(b, a, x)


EVENTS = []
sfx = np.zeros((2, N))


def ev(name, frame, **kw):
    EVENTS.append(dict(sound=name, file_frame=frame, outro_frame=frame - PRE, sec=round(frame / FPS, 3), **kw))


# ---------------------------------------------------------------- f0-23: the stand-in's room (the button's tail)
hum = load(os.path.join(SRC, 'server_hum_tuned.wav'))[:, :fr(PRE)]
hum[:, -int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))    # stops dead on the cut (4 ms de-click)
place(sfx, hum, 0, gain_db=-26.0)
ev('server_hum_tuned (intro-sfx)', 0, until=PRE, note='the stand-in room; dead on the cut to black')

# ---------------------------------------------------------------- o15: the iris swivels to the lens
servo = load(os.path.join(SRC, 'orb_servo_C6.wav'))
place(sfx, servo, o(15), gain_db=-18.0, pan=0.55)
ev('orb_servo_C6 (intro-sfx)', o(15), pan=0.55, note='the intro f97 servo, the same file')

# ---------------------------------------------------------------- o30-54: the scan
shhk = load(os.path.join(SRC, 'orb_scan_sweep_FC.wav'))
place(sfx, shhk, o(30), gain_db=-16.0, pan=0.45)
ev('orb_scan_sweep_FC (intro-sfx)', o(30), pan=0.45, note='the cone opens')
# the sustained sweep: F/C-tuned noise that brightens as the cone sweeps down the toast, then closes (25 frames)
L = fr(25)
t = np.arange(L) / SR
noise = rng.standard_normal(L)
body = sum(resonator(noise, f, 18) * g for f, g in ((698.46, 0.5), (1046.5, 0.8), (1396.9, 1.0), (2093.0, 0.7), (2793.8, 0.35)))
body = bp(body, 500, 5000)
env = np.clip(t / 0.06, 0, 1) * np.clip((t[-1] - t) / 0.12, 0, 1) * (0.55 + 0.45 * np.sin(np.pi * t / t[-1]))
sweep = pan2(body * env, np.linspace(0.5, -0.1, L))
place(sfx, sweep, o(30), peak_db=-20.0)
ev('scan sweep bed (synth, F/C resonators)', o(30), until=o(55), note='under the whole cone; pans from the Orb leftward')
# the GLYPH grains inside the cone: tiny tuned ticks on G6 / Db7 / F7 (the SFX's GLYPH pitches), one per 2 frames
for k, f in enumerate(range(31, 53, 2)):
    p = [1567.98, 2217.46, 2793.83][k % 3]
    gl = int(0.035 * SR)
    tt = np.arange(gl) / SR
    grain = np.sin(2 * np.pi * p * tt) * np.exp(-tt / 0.008) + 0.3 * rng.standard_normal(gl) * np.exp(-tt / 0.002)
    place(sfx, np.stack([grain, grain]), o(f), peak_db=-31.0 + (k % 2) * -3, pan=0.3 - 0.06 * k)
ev('glyph grains (synth, G6/Db7/F7)', o(31), until=o(53), note='one per 2 frames while the tokens resolve')

# ---------------------------------------------------------------- the toast: the header posts at o9, the two credit
# chips land at o60 and o75 (2.1, 2.2). A faint unpitched UI tick each, left (where the toast is); the knee is the pop.
for k, (f, pk) in enumerate([(9, -37.0), (60, -40.0), (75, -40.0)]):
    tl = int(0.012 * SR)
    tt = np.arange(tl) / SR
    tick = bp(rng.standard_normal(tl), 2500, 9000) * np.exp(-tt / 0.0025)
    place(sfx, np.stack([tick, tick]), o(f), peak_db=pk, pan=-0.55)
ev('toast ticks (synth)', o(9), until=o(76), note='3 faint ticks, left: the header post (o9), the chips on 2.1 and 2.2')

# ---------------------------------------------------------------- o120: the Orb's chime on the verdict
chime = load(os.path.join(SRC, 'blip_orb_toast_C7.wav'))
place(sfx, chime, o(120), gain_db=-11.0, pan=0.45)
ev('blip_orb_toast_C7 (intro-sfx)', o(120), pan=0.45, note='the intro f692 chime, as the verdict lights the lens; the score verdict is one beat later')

# ---------------------------------------------------------------- Ep1's moth, bars 3-4 (scene.ts MOTH_WAY). Quiet, papery
# wingbeats (~22 a second) from o130, panned with its flight and nearest as it loops the lamp; o165 (3.4) the bump on
# the lens glass: a clear tuned tink (C8 with a G7 partial, the F/C world), the one gag sound, so it is audible; the
# Orb's flinch (aperture shut o166, open o171) and the servo as the iris swivels down after it (o171); o195 (4.2) the
# landing tick, o197-201 the wings folding; o210 (4.3) the Orb's beam on it (the intro's scan shhk, soft) + an aperture
# tick; o222 a wing twitch.
f0, f1 = o(130), o(195)
L = fr(f1 - f0)
t = np.arange(L) / SR
beat_hz = 22.0
flap = np.clip(np.sin(2 * np.pi * beat_hz * t + 0.3 * np.sin(2 * np.pi * 3.1 * t)), 0, None) ** 3
air = bp(rng.standard_normal(L), 250, 2600) * flap
air += 0.35 * bp(rng.standard_normal(L), 2600, 6000) * flap ** 2
way = [(130, 472, -12), (134, 462, 14), (138, 450, 38), (142, 436, 60), (145, 414, 72), (148, 398, 84), (151, 396, 104),
       (154, 408, 118), (157, 428, 120), (160, 442, 106), (163, 434, 88), (165, 421, 97), (167, 428, 108), (169, 438, 118),
       (171, 448, 130), (175, 458, 148), (179, 453, 164), (183, 463, 178), (187, 458, 194), (191, 452, 208), (195, 447, 224)]
wt = [(a - 130) / FPS for a, _, _ in way]
px = np.interp(t, wt, [x for _, x, _ in way])
py = np.interp(t, wt, [y for _, _, y in way])
near = np.clip(1.15 - np.hypot(px - 420, py - 96) / 160, 0.35, 1.0)     # louder at the lamp (the Orb's centre)
env = np.clip(t / 0.1, 0, 1) * np.clip((t[-1] - t) / 0.08, 0, 1) * near
place(sfx, pan2(air * env, (px - 240) / 240 * 0.8), f0, peak_db=-21.0)
ev('moth wingbeats (synth)', f0, until=f1, note='panned with the flight path, nearest at the lamp')
# the bump on the lens: a tuned glass tink (C8 + G7), where the Orb is, with a tiny second bounce
tl = int(0.25 * SR)
tt = np.arange(tl) / SR
exc = rng.standard_normal(tl) * np.exp(-tt / 0.0012)
glass = resonator(exc, 4186.0, 90) + 0.5 * resonator(exc, 3136.0, 70) + 0.25 * bp(rng.standard_normal(tl), 3000, 9000) * np.exp(-tt / 0.002)
glass *= np.exp(-tt / 0.07)
place(sfx, np.stack([glass, glass]), o(165), peak_db=-22.0, pan=0.62)
place(sfx, np.stack([glass, glass]), o(165) + 2.2, peak_db=-33.0, pan=0.64)
ev('moth bumps the lens (synth, glass tink C8 + G7, + a bounce)', o(165), pan=0.62)
# the Orb's flinch: the aperture snaps shut (o166) and opens (o171): the smallest mechanical ticks (no pitch)
for f, pk in ((166, -30.0), (171, -34.0)):
    tl = int(0.015 * SR)
    tt = np.arange(tl) / SR
    ap = bp(rng.standard_normal(tl), 3500, 10000) * np.exp(-tt / 0.0018)
    place(sfx, np.stack([ap, ap]), o(f), peak_db=pk, pan=0.55)
ev('aperture ticks (synth): the flinch', o(166), until=o(171), pan=0.55)
# o171: the iris swivels down after the moth: the servo, softer
place(sfx, servo, o(171), gain_db=-19.0, pan=0.55)
ev('orb_servo_C6 (intro-sfx), softer', o(171), pan=0.55, note='the iris swivels down after the moth')
# o195: the landing tick; o197-201 the wings folding (two papery flicks)
tl = int(0.02 * SR)
tt = np.arange(tl) / SR
tap = bp(rng.standard_normal(tl), 1800, 7000) * np.exp(-tt / 0.003)
place(sfx, np.stack([tap, tap]), o(195), peak_db=-30.0, pan=0.72)
ev('moth landing tick (synth)', o(195), pan=0.72)
for f, pk in ((197, -34.0), (200, -36.0)):
    Lt = fr(2)
    tt = np.arange(Lt) / SR
    fl = bp(rng.standard_normal(Lt), 400, 3200) * np.sin(np.pi * tt / tt[-1]) ** 2
    place(sfx, np.stack([fl, fl]), o(f), peak_db=pk, pan=0.72)
ev('moth wing fold (synth)', o(197), until=o(201), pan=0.72)
# o210 (4.3): the Orb's beam goes on the moth: the intro's scan shhk, soft, + the aperture narrowing
place(sfx, shhk, o(210), gain_db=-24.0, pan=0.6)
tl = int(0.015 * SR)
tt = np.arange(tl) / SR
ap = bp(rng.standard_normal(tl), 3500, 10000) * np.exp(-tt / 0.0018)
place(sfx, np.stack([ap, ap]), o(210), peak_db=-36.0, pan=0.55)
ev('orb_scan_sweep_FC (intro-sfx), soft + aperture tick', o(210), pan=0.6, note='the beam on the moth')
# o222: a wing twitch under the light
Lt = fr(2)
tt = np.arange(Lt) / SR
tw = bp(rng.standard_normal(Lt), 250, 2600) * np.clip(np.sin(2 * np.pi * 22 * tt), 0, None) ** 3 * np.sin(np.pi * tt / tt[-1])
place(sfx, np.stack([tw, tw]), o(222), peak_db=-31.0, pan=0.72)
ev('moth wing twitch (synth)', o(222), pan=0.72)

# ---------------------------------------------------------------- the score, placed at o0
mus = load(os.path.join(SC, 'music', 'outro-b-temp-album.wav'))
music = np.zeros((2, N))
s = fr(PRE)
m = mus[:, :N - s]
music[:, s:s + m.shape[1]] = m
fade = int(0.5 * SR)                                    # the file ends 0.75 s after the cut: the release fades out
music[:, -fade:] *= np.linspace(1, 0, fade) ** 2
sfx[:, -fade:] *= np.linspace(1, 0, fade) ** 2

mix = music + sfx


def true_peak_db(x):
    up = resample_poly(x, 4, 1, axis=1)
    return 20 * np.log10(np.max(np.abs(up)) + 1e-12)


meter = pyln.Meter(SR)


def bar_loudness(x, fa, fb):
    seg = x[:, fr(fa):fr(fb)].T
    w, hop = int(0.4 * SR), int(0.1 * SR)
    mom = max(meter.integrated_loudness(seg[j:j + w]) for j in range(0, len(seg) - w, hop))
    return dict(integrated=round(float(meter.integrated_loudness(seg)), 1), momentary_max=round(float(mom), 1))


raw_tp = true_peak_db(mix)
trim = min(0.0, -3.0 - raw_tp)                          # picture masters peak <= -3 dBTP (OST-BIBLE rule 14)
mix *= db(trim)
music_out = music * db(trim)
sfx_out = sfx * db(trim)
rep = dict(
    frames=N_FRAMES, seconds=N / SR, sample_rate=SR,
    music_file=os.path.join(SC, 'music', 'outro-b-temp-album.wav'), music_offset_s=PRE / FPS,
    trim_db=round(trim, 2),
    mix_lufs=round(meter.integrated_loudness(mix.T), 2), mix_true_peak_dbtp=round(true_peak_db(mix), 2),
    music_lufs_in_mix=round(meter.integrated_loudness(music_out.T), 2),
    music_lufs_outro_only=round(meter.integrated_loudness(music_out[:, fr(PRE):fr(PRE + OUT_F)].T), 2),
    mix_lufs_outro_only=round(meter.integrated_loudness(mix[:, fr(PRE):fr(PRE + OUT_F)].T), 2),
    # each bar of the outro: integrated and max momentary (400 ms) loudness of the mix, so the payoff (bar 3: the
    # verdict, the lamp, the moth at the lens) can be checked against the knee (bar 2)
    bars_mix_lufs={f'bar {k + 1}': bar_loudness(mix, PRE + 60 * k, PRE + 60 * (k + 1)) for k in range(OUT_F // 60)},
    tail_rms_dbfs_last_100ms=round(float(20 * np.log10(np.sqrt(np.mean(mix[:, -int(0.1 * SR):] ** 2)) + 1e-12)), 1),
    sfx_true_peak_dbtp=round(true_peak_db(sfx_out), 2),
    events=EVENTS,
)
for name, x in (('music', music_out), ('sfx', sfx_out), ('mix', mix)):
    sf.write(os.path.join(OUT, f'outro-b-{name}.wav'), x.T.astype(np.float32), SR, subtype='PCM_24')
json.dump(rep, open(os.path.join(SC, 'mix-report.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in rep.items() if k != 'events'}, indent=1))
