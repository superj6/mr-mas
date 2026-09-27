"""OUTRO C · the designed sound + the temp mix (LOOKDEV ONLY).

Reads (read-only): the temp score from track.py (<SC>/music/lookdev-outro-c-ep1-underscore.wav) and three beds from
the show's SFX library (audio/sfx/wav: room_drone, room_tone, neon_buzz). Everything else is synthesized here.
Writes: out/lookdev/outro/c/outro-c-{music,sfx,mix}.wav (48 kHz, 24-bit, 9.000 s = the 216-frame mock-up),
<SC>/mix.wav (for the mux) and out/lookdev/outro/c/qa/sound.json (the cue list + measured levels).

Frame map: composition f = 24 + o (o = outro frame). The file's t = f / 24. (Fourth pass: one plate, two light steps.)

  f0-23    the stand-in (the dark room)      room_drone (F1+C2), hard cut on the downbeat
  o0       cut to the lobby                  room_tone (night air, distant HVAC) + the lit sign's tube hum (neon_buzz, F2)
  o84      the hand comes down               a sleeve rustle
  o93      it grips last night's 5           a fingertip tap on the card
  o101     the 5 lifts off its hooks         two hook ticks (tonight's 6 is behind it: no sound, the score's C is the 36)
  o113     the hand goes                     a sleeve rustle
  o116     the 5 lands in the box            a card thup, a bounce, a rattle among the spare zeros (panned right)
  o120     the after-hours timer (3.1)       a contactor ka-chunk somewhere in the stone lobby; the air steps down
  o121-122 the flicker (one held step)       the contactor's kick: the hum dips for 2 frames, the ballast ticks out and back
  o130/135 the moth bumps the lit box        two tiny taps on the plastic (it's a moth: that's what they do)
  o150-151 the timer's second step (3.3)     the ballast ticks, a second, farther contactor, and THE HUM STOPS: the lobby's
                                             air is all that's left (it steps down again)
  o165     the moth lands                    nothing (it lands in the chord's ring)
  o176-190 the dip                           the chord and the air run out to digital zero by o190; o190-191 silent black

Run: audio/.venv-theme/bin/python studio/src/dev/outro/c/audio/mix.py <SC>
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

import pyloudnorm as pyln

ROOT = '/home/jgon/project/art/mrmas'
SFX = f'{ROOT}/audio/sfx/wav'
OUT = f'{ROOT}/out/lookdev/outro/c'
SR = 48000
FPS = 24
PRE = 24
OUT_F = 192                             # the outro: 3 bars at 96 BPM + the ring-out (fourth pass; was 180)
TOTAL_F = PRE + OUT_F
N = TOTAL_F * SR // FPS                 # 9.000 s
FADE = (176, 190)                       # the sound's run-out (outro frames), zero from o190 (the picture's dip: o184-190)
TRIM = int(0.25 * SR)                   # the score's pickup: its first 0.25 s is before the mock-up's f0
rng = np.random.default_rng(20231227)


def at(o):
    """sample index of outro frame o"""
    return int(round((PRE + o) * SR / FPS))


def db(x):
    return 10 ** (x / 20)


def load(name):
    x, sr = sf.read(f'{SFX}/{name}.wav', always_2d=True)
    assert sr == SR, (name, sr)
    return x.T.astype(np.float64)


def tile(x, n):
    reps = int(np.ceil(n / x.shape[1]))
    return np.tile(x, (1, reps))[:, :n]


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def lp(x, hi, order=2):
    return sosfilt(butter(order, hi, 'lowpass', fs=SR, output='sos'), x)


def env_exp(n, tau_s):
    return np.exp(-np.arange(n) / (tau_s * SR))


def pan2(m, p):
    """mono -> stereo, constant-power pan p in [-1, 1]"""
    a = (p + 1) * np.pi / 4
    return np.vstack([m * np.cos(a), m * np.sin(a)])


def place(bus, x, i0):
    i1 = min(bus.shape[1], i0 + x.shape[1])
    if i1 > i0:
        bus[:, i0:i1] += x[:, : i1 - i0]


def ramp(n, i0, i1, g0, g1):
    """a gain curve: g0 before i0, linear to g1 at i1, g1 after"""
    g = np.full(n, float(g0))
    i0, i1 = max(0, i0), min(n, i1)
    if i1 > i0:
        g[i0:i1] = np.linspace(g0, g1, i1 - i0)
    g[i1:] = g1
    return g


# ------------------------------------------------------------------ synthesized one-shots
def tick(freqs, dur=0.012, tau=0.0025, noise=0.5, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) for f in freqs) / max(1, len(freqs))
    y = y + noise * bp(rng.standard_normal(n), 2500, 9000)
    return gain * y * env_exp(n, tau)


def hook_ticks():
    """the plate lifting off its two hooks: two tiny metal ticks, 24 ms apart"""
    y = np.zeros(int(0.08 * SR))
    for k, (d, g) in enumerate([(0.0, 1.0), (0.024, 0.7)]):
        s = tick([3150 + 240 * k, 4720 - 180 * k], gain=g)
        i = int(d * SR)
        y[i:i + len(s)] += s
    return y


def card_drop():
    """the 0 landing in the cardboard box among the spare zeros: a thup, one bounce, a rattle"""
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for d, g, tau in [(0.0, 1.0, 0.018), (0.058, 0.45, 0.012)]:
        i = int(d * SR)
        m = n - i
        thup = lp(rng.standard_normal(m), 900) * env_exp(m, tau) * 1.6
        knock = np.sin(2 * np.pi * 180 * t[:m]) * env_exp(m, tau * 0.9) * 0.5
        y[i:] += g * (thup + knock)
    for d, g in [(0.02, 0.3), (0.075, 0.22), (0.11, 0.16), (0.16, 0.08)]:          # plates knocking plates
        s = bp(rng.standard_normal(int(0.02 * SR)), 1200, 4200) * env_exp(int(0.02 * SR), 0.003) * g
        i = int(d * SR)
        y[i:i + len(s)] += s
    return y


def rustle(dur=0.22):
    """a coverall sleeve moving: soft band-limited noise under a slow hump"""
    n = int(dur * SR)
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    grain = 1 + 0.6 * np.sign(rng.standard_normal(n)) * (rng.uniform(size=n) < 0.02)
    return bp(rng.standard_normal(n), 500, 3800) * e * grain * 0.6


def moth_tap():
    """a moth bumping lit plastic: a 3 ms tap with a small resonance"""
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 3000, 9000) * env_exp(n, 0.0009) +
            np.sin(2 * np.pi * 2250 * t) * env_exp(n, 0.004) * 0.35)


def ballast_tick():
    n = int(0.02 * SR)
    return bp(rng.standard_normal(n), 900, 5000) * env_exp(n, 0.0016)


def contactor():
    """the after-hours timer throwing a contactor somewhere in the building: a click, a ka-chunk, a stone-room tail"""
    n = int(1.3 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    s = bp(rng.standard_normal(int(0.012 * SR)), 1000, 3600) * env_exp(int(0.012 * SR), 0.002) * 0.6
    y[:len(s)] += s
    i = int(0.034 * SR)
    m = n - i
    y[i:] += (np.sin(2 * np.pi * 87.31 * t[:m]) * env_exp(m, 0.05) * 0.9 +       # F2, the building's own hum pitch
              lp(rng.standard_normal(m), 700) * env_exp(m, 0.02) * 1.2)
    ir_n = int(0.9 * SR)
    ir = lp(rng.standard_normal(ir_n), 2400) * env_exp(ir_n, 0.22)
    ir /= np.sqrt((ir ** 2).sum())
    wet = fftconvolve(y, ir)[:n]
    y = lp(y, 5000) * 0.55 + wet * 0.8                                              # distant: mostly room
    return y


def main(sc):
    os.makedirs(f'{OUT}/qa', exist_ok=True)
    cues = []

    # ---------------------------------------------------------------- the score (trim the pickup's first 0.25 s)
    mus, sr = sf.read(f'{sc}/music/lookdev-outro-c-ep1-underscore.wav', always_2d=True)
    assert sr == SR
    mus = mus.T[:, TRIM:TRIM + N]
    if mus.shape[1] < N:
        mus = np.pad(mus, ((0, 0), (0, N - mus.shape[1])))
    g_out = ramp(N, at(FADE[0]), at(FADE[1]), 1.0, 0.0)
    mus = mus * g_out

    # ---------------------------------------------------------------- beds
    bus = np.zeros((2, N))
    cut = at(0)
    drone = tile(load('room_drone'), cut) * db(-12)
    drone[:, -int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))
    drone[:, :int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    place(bus, drone, 0)
    cues.append(dict(f=0, o=None, sfx='room_drone (library)', db=-12, what='the stand-in: the dark room'))

    L = N - cut
    air = tile(load('room_tone'), L) * db(-20)
    air *= ramp(L, at(120) - cut, at(120) - cut + int(0.45 * SR), 1.0, db(-1.5))   # the after-hours HVAC steps down
    air *= ramp(L, at(151) - cut, at(151) - cut + int(0.6 * SR), 1.0, db(-2.0))    # and again when the sign goes
    hum = tile(np.roll(load('neon_buzz'), -int(0.4 * SR), axis=1), L) * db(-17)
    # the flicker: o121-122 at the half step (the contactor's kick); the ballast ticks out and back
    fl = np.ones(L)
    i0, i1 = at(121) - cut, at(123) - cut
    k = int(0.003 * SR)
    fl[i0:i1] = 0.3
    fl[i0 - k:i0] = np.linspace(1, 0.3, k)
    fl[i1:i1 + k] = np.linspace(0.3, 1, k)
    # the timer's second step: the half step at o150, then the tube is out at o151 (a 25 ms release: no click)
    j0, j1 = at(150) - cut, at(151) - cut
    fl[j0:j1] = np.minimum(fl[j0:j1], 0.35)
    r = int(0.025 * SR)
    fl[j1:j1 + r] = np.linspace(0.35, 0.0, r)
    fl[j1 + r:] = 0.0
    hum *= fl
    for x in (air, hum):
        x[:, :int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    place(bus, air + hum, cut)
    cues += [dict(f=PRE, o=0, sfx='room_tone (library)', db=-20, what='the lobby at night; -1.5 dB after o120'),
             dict(f=PRE, o=0, sfx='neon_buzz (library)', db=-17, what="the lit sign's tube hum (F2); dips at o121-122; stops at o151")]

    # ---------------------------------------------------------------- one-shots
    def shot(o, y, p, g_db, name, what):
        place(bus, pan2(y, p) * db(g_db), at(o))
        cues.append(dict(f=PRE + o, o=o, sfx=name, db=g_db, pan=p, what=what))

    shot(84, rustle(0.26), 0.18, -24, 'rustle (synth)', 'the sleeve comes into frame')
    shot(93, moth_tap(), 0.2, -26, 'tap (synth)', "the fingertips on last night's plate")
    shot(101, hook_ticks(), 0.2, -12, 'hook_ticks (synth)', 'the 5 comes off its hooks (the 6 is behind it)')
    shot(113, rustle(0.3), 0.3, -25, 'rustle (synth)', 'the hand withdraws')
    shot(116, card_drop(), 0.62, -7, 'card_drop (synth)', 'the 5 lands in the box of spare zeros')
    shot(120, contactor(), -0.35, -12, 'contactor (synth)', 'the after-hours timer: the house light steps down (3.1)')
    shot(121, ballast_tick(), 0.0, -18, 'ballast_tick (synth)', "the flicker: out (the contactor's kick)")
    shot(123, ballast_tick(), 0.0, -21, 'ballast_tick (synth)', 'the flicker: back')
    shot(130, moth_tap(), 0.1, -22, 'moth_tap (synth)', "the moth bumps the light box's top edge")
    shot(135, moth_tap(), 0.05, -25, 'moth_tap (synth)', 'and again, further along')
    shot(150, ballast_tick(), 0.0, -19, 'ballast_tick (synth)', "the timer's second step: the tube's half step")
    shot(151, contactor(), 0.45, -17, 'contactor (synth)', 'the second contactor, farther off: the sign is out, the hum stops (3.3)')

    sfx = bus * g_out

    # ---------------------------------------------------------------- the mix
    mix = mus + sfx
    meter = pyln.Meter(SR)
    lufs_mus = meter.integrated_loudness(mus.T)
    lufs_mix = meter.integrated_loudness(mix.T)

    def tp(x):
        up = np.vstack([np.interp(np.arange(x.shape[1] * 4) / 4, np.arange(x.shape[1]), ch) for ch in x])
        return 20 * np.log10(max(1e-12, np.abs(up).max()))

    peak = tp(mix)
    if peak > -1.0:
        g = db(-1.0 - peak)
        mix *= g
        peak = tp(mix)
    mix[:, -1] = 0.0
    # write
    sf.write(f'{OUT}/outro-c-music.wav', mus.T, SR, subtype='PCM_24')
    sf.write(f'{OUT}/outro-c-sfx.wav', sfx.T, SR, subtype='PCM_24')
    sf.write(f'{OUT}/outro-c-mix.wav', mix.T, SR, subtype='PCM_24')
    sf.write(f'{sc}/mix.wav', mix.T, SR, subtype='PCM_24')
    tail = mix[:, at(FADE[1]):]                                                     # o190-191: silent black
    rep = dict(
        length_s=N / SR, frames=TOTAL_F, fps=FPS,
        lufs_music=round(lufs_mus, 2), lufs_mix=round(lufs_mix, 2), true_peak_mix_dbtp=round(peak, 2),
        last_frames_peak_dbfs=round(20 * np.log10(max(1e-12, np.abs(tail).max())), 1),
        score='track.py (OST engine, read-only): knee whole once in bar 2 (felt + chip 8va), button chord F-C-G on 3.1, '
              'ringing to the dip; zero from o190',
        cues=cues)
    with open(f'{OUT}/qa/sound.json', 'w') as fh:
        json.dump(rep, fh, indent=1)
    print(json.dumps({k: v for k, v in rep.items() if k != 'cues'}))


if __name__ == '__main__':
    main(sys.argv[1])
