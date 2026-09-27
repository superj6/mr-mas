"""MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the TEMP sound pass, for both cuts.

  ../audio/.venv-theme/bin/python src/dev/range/ep1-p2/tools/sound.py <A|B> <out.wav> <scratch dir>

The monitor runs with its sound OFF (the brief): nothing here belongs to the film. What plays is the dark room:
  BED    the dark room's bed, the v5 reel's own recipe (audio/reel/ep01-act4-v5/bed.py 'dark': room_drone, a low-passed
         room_tone, a high-passed server_hum) at about -39 dBFS RMS, plus the rack's LED ticks, tiny and irregular.
  MUSIC  MM-12 "december" as a TEMP (no MM-12 render exists): the DARK ROOM felt line (solo felted upright, OST-BIBLE
         P01) over sc 31's F pedal, 96 BPM, F minor, rootless voicings, no third at any landing. It keeps playing
         through the ramp and the break (the ramp is picture only). Under the strip and the caption it holds a chord
         and lets the line rest (the Orb's doubt has no sound: no tick). Into the [2S] it walks on, and it does NOT
         cadence: two notes lift into the slot's whir and ring, so the tag carries on into the delivery.
  SFX    the rack's slot starting to whir (A p240, B p192): a small motor and the magazine's feed, synthesised here.
The engine is imported read-only; its calibration cache is copied to scratch and redirected there, so nothing under
audio/ is written. Nothing here has been listened to: levels are measured and printed.
"""
import os
import shutil
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))
OST = os.path.join(ROOT, 'audio', 'ost')
SFX = os.path.join(ROOT, 'audio', 'sfx', 'wav')
VER = sys.argv[1] if len(sys.argv) > 1 else 'A'
OUT = sys.argv[2] if len(sys.argv) > 2 else f'/tmp/ep1-p2-{VER}.wav'
SCR = sys.argv[3] if len(sys.argv) > 3 else os.path.dirname(os.path.abspath(OUT))

sys.path.insert(0, OST)
import engine.sampler as _smp  # noqa: E402
_cache = os.path.join(SCR, 'ost-cache')
os.makedirs(_cache, exist_ok=True)
if os.path.exists(os.path.join(OST, 'cache', 'calib.json')) and not os.path.exists(os.path.join(_cache, 'calib.json')):
    shutil.copy(os.path.join(OST, 'cache', 'calib.json'), os.path.join(_cache, 'calib.json'))
_smp.CACHE = _cache
from engine import *  # noqa: E402,F401,F403

SR, FPS = 48000, 24
LEN = {'A': 264, 'B': 216}[VER]
N = int(LEN / FPS * SR)
T = dict(A=dict(strip=120, eye=128, cap=132, two=192, iris=204, whir=240),
         B=dict(strip=72, eye=80, cap=84, two=144, iris=156, whir=192))[VER]
rng = np.random.default_rng(12)


def s(p):
    return p / FPS


def S(p):
    return int(round(p / FPS * SR))


def db(x):
    return 10 ** (x / 20)


def lpf(x, hz, o=2):
    return sosfilt(butter(o, hz, 'low', fs=SR, output='sos'), x, axis=0)


def hpf(x, hz, o=2):
    return sosfilt(butter(o, hz, 'high', fs=SR, output='sos'), x, axis=0)


def bpf(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def load(name):
    x, sr = sf.read(os.path.join(SFX, name + '.wav'), always_2d=True)
    assert sr == SR, (name, sr)
    return (x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)).astype(np.float64)


def loop(name, n):
    x = load(name)
    reps = int(np.ceil(n / len(x))) + 2
    y = np.vstack([x] * reps)
    o = int(rng.integers(0, len(x)))
    return y[o:o + n]


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


# ------------------------------------------------------------------ MM-12 (TEMP): the felt line
def music():
    g = Grid(bpm=96, meter='4/4', bars=6, swing=1.0)
    P = palette()
    a = Arr(g)
    # sc 31's F pedal, carried in (the open fifth: no third under it)
    a.ch('felt', ['F2', 'C3'], 0.0, s(T['two']) + 0.3, 0.30, lock=True)
    # the line over the film: calm, on the beat, a man watching a rival's ad at 2 a.m.
    line = [('Ab4', 0, 22), ('G4', 15, 14), ('F4', 30, 28), ('C5', 60, 26), ('Bb4', 90, 12), ('Ab4', 102, 16)]
    if VER == 'B':
        line = [('Ab4', 0, 22), ('G4', 15, 14), ('F4', 30, 26), ('C5', 56, 16)]
    for pitch, p, d in line:
        a.n('felt', pitch, s(p), s(d) + 0.25, 0.44)
    a.ch('felt', ['Ab3', 'C4', 'Eb4', 'G4'], s(0), s(58), 0.22, roll=0.02)          # Fm9, rootless
    if VER == 'A':
        a.ch('felt', ['F3', 'Ab3', 'C4'], s(60), s(58), 0.22, roll=0.02)             # Dbmaj7 (rootless)
    # the strip and the caption: the line rests; one held chord (Dbmaj7#11 colour), soft
    a.ch('felt', ['F3', 'C4', 'G4'], s(T['strip']), s(T['two'] - T['strip']) + 0.4, 0.2, roll=0.03, lock=True)
    # ...and while the caption holds, the line thinks: two soft notes, so the room never drops to a hole
    a.n('felt', 'Ab4', s(T['cap'] + 18), s(20), 0.3)
    a.n('felt', 'G4', s(T['cap'] + 40), s(22), 0.28)
    a.ch('felt', ['Db4', 'F4'], s(T['cap'] + 40), s(T['two'] - T['cap'] - 40) + 0.3, 0.17, roll=0.02)
    # the [2S]: the pedal re-struck, the line walks on and lifts into the whir, open (no cadence, no third)
    a.ch('felt', ['F2', 'C3'], s(T['two']), s(LEN - T['two']) + 1.0, 0.26, lock=True)
    a.n('felt', 'Eb4', s(T['iris'] + 6), s(14), 0.36)
    a.n('felt', 'F4', s(T['whir'] - 8), s(LEN - T['whir'] + 8) + 1.5, 0.38)
    a.n('felt', 'C5', s(T['whir'] + 4), s(LEN - T['whir']) + 1.5, 0.30)
    a.notes = groove(a.notes, g, 'laidback', insts=['felt'], amount=0.4)
    sc = Score('ep1-p2-mm12-temp', g, P, a.notes, tail_s=1.0, meta=dict(id='ep1-p2-mm12-temp', title='MM-12 december (TEMP for E1-P2)'))
    stems = render_score(sc, verbose=False)
    out = np.zeros((N, 2))
    for v in stems.values():
        v = np.asarray(v)
        if v.ndim == 1:
            v = np.stack([v, v])
        n = min(N, v.shape[1])
        out[:n] += v[:, :n].T
    return out


# ------------------------------------------------------------------ the dark room
def bed():
    x = loop('room_drone', N) * 0.8 + lpf(loop('room_tone', N), 1200) * 0.45 + hpf(loop('server_hum', N), 300) * 0.25
    x = hpf(x, 35)
    return x * db(-39.0) / (np.sqrt(np.mean(x ** 2)) + 1e-12)


def led_ticks():
    """the rack's LEDs: a tiny relay tick on some of the eighth changes (a light, irregular pattern, never a beat)"""
    y = np.zeros((N, 2))
    L = int(0.004 * SR)
    t = np.arange(L) / SR
    for k in range(int(LEN * 2 / 15) + 1):
        if hash((k * 7919) % 101) % 3:
            continue
        i = S(k * 7.5)
        if i + L >= N:
            break
        e = np.sin(2 * np.pi * (3100 + 400 * rng.random()) * t) * np.exp(-t / 0.0008)
        p = 0.55 + 0.2 * rng.random()          # the rack is at frame right
        y[i:i + L, 0] += e * (1 - p)
        y[i:i + L, 1] += e * p
    return y * db(-50.0)


def whir():
    """the slot: a small motor spinning up, the feed's rollers, the magazine's edge starting through"""
    # v5: the motor starts 0.25 s before the LED's first blink, so its spin-up (about 0.3 s to be heard) is audible ON
    # the blink rather than after it (v4's whir was measured audible ~0.3 s late)
    i0 = S(T['whir']) - S(0.25 * 24)
    n = N - i0
    if n <= 0:
        return np.zeros((N, 2))
    t = np.arange(n) / SR
    up = np.clip(t / 0.35, 0, 1) ** 1.5
    f0 = 95 + 35 * np.clip(t / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f0) / SR
    motor = sum(np.sin(ph * k) / k for k in (1, 2, 3, 4, 6)) * 0.5
    feed = bpf(rng.standard_normal(n), 900, 4200) * (0.55 + 0.45 * np.sin(2 * np.pi * 43 * t)) * np.clip((t - 0.5) / 0.3, 0, 1)
    x = (lpf(motor, 1400) * 0.8 + feed * 0.35) * up
    x = x / (np.max(np.abs(x)) + 1e-9)
    y = np.zeros((N, 2))
    y[i0:, 0] = x * 0.35
    y[i0:, 1] = x * 0.75                       # the rack is at the right of the [2S]
    return y * db(-22.0)


def main():
    mus = music()
    m_on = mus[np.abs(mus).max(axis=1) > 1e-4]
    mus *= db(-26.0) / (np.sqrt(np.mean(m_on ** 2)) + 1e-12) if len(m_on) else 1.0
    b, ticks, w = bed(), led_ticks(), whir()
    mix = b + ticks + w + mus
    pk = np.max(np.abs(mix))
    if pk > db(-1.0):
        mix *= db(-1.0) / pk
    k = S(0.01)
    mix[:k] *= np.linspace(0, 1, k)[:, None]
    k = S(0.02)
    mix[-k:] *= np.linspace(1, 0, k)[:, None]
    sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
    try:
        import pyloudnorm as pyln
        lu = round(float(pyln.Meter(SR).integrated_loudness(mix)), 1)
    except Exception:
        lu = None
    print(f'wrote {OUT}  {LEN / FPS:.2f} s  peak {20 * np.log10(np.max(np.abs(mix)) + 1e-12):.1f} dBFS  LUFS {lu}  '
          f'bed {rms_db(b):.1f}  music(on) {rms_db(m_on) if len(m_on) else -99:.1f}->-26  whir peak {20 * np.log10(np.max(np.abs(w)) + 1e-12):.1f}')


if __name__ == '__main__':
    main()
