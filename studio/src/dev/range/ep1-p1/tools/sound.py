"""MR. MAS - range E1-P1 (1.A, CLOD under its launch light): the TEMP SOUND PASS, 27.5 s (660 f) at 48 kHz stereo.

Run with the OST venv (the engine and its sample libraries are imported read-only; its calibration cache is copied
to scratch and redirected there, so nothing under audio/ is written):
  ../audio/.venv-theme/bin/python src/dev/range/ep1-p1/tools/sound.py <out.wav> <scratch dir>

96 BPM, 4/4, a bar = 60 f = 2.5 s. The split is heard as a split: the left pane (the bullpen, the chip) sits left of
centre, the right pane (the lighthouse, the quartet, CLOD) right of centre; the dialogue only leans (+-0.2).
  MM-04 (TEMP; no render of it exists yet): Gerg's BUILD on the chip against Mario's ADDENDUM on a string quartet,
    trading bars (bar 1 chip, 2 quartet, 3 chip, 4 quartet), ducked under the memo.
  round 5: the lighthouse's lamp is held (its gear's 3-frame tick is gone); the filament's buzz swells under the
        ramp (p240-247); Mario's startle is a dry rustle; Gerg's typing stops while he glances at the site.
  p240  bar 5: the can's CLUNK on the downbeat (no switch, no click); the wheel's whirr starts in the pool and runs
        to the cut; one felted-upright phrase doubles the quartet under the bow; a dry clay PRESS on the down key
        (p248). No pizzicato "ad cue".
  bar 6: the quartet's held chord under "Addendum." (p322); the bullpen claps at the site (p345).
  bars 7-8: thinned to the quartet's held chord under the post (the post's click, p365); the Addendum's tail climbs a
        step as Mario adds a line; the wheel's whirr low.
  bars 9-10: both back up (the Build and the Addendum at once) as the scroll unrolls across the split (paper, the
        roll's bumps), lands on Gerg's desk (p540); the shutter (p555); the site's two drawings (the Build's tag).
  p600  the cut to sc 12: MM-04 stops with the scene; MM-17 (TEMP) comes in low: a walking bass, brushes and
        Nole's LAUNCH rip on a harmon trumpet that falls off one note short; the bullpen's night bed.
Voices: the stock-pack temp takes (tools/voice.py): MARIO (am_liam, the casting pick), CLOD (af_sky x0.6 + am_echo x0.4,
a temp pack, logged in the README). Rooms: the lighthouse's brick on a short send; CLOD's voice closer and drier.
"""
import json
import os
import shutil
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))
OST = os.path.join(ROOT, 'audio', 'ost')
SFX = os.path.join(ROOT, 'audio', 'sfx', 'wav')
OUT = sys.argv[1]
SCR = sys.argv[2]
VO = os.path.join(SCR, 'vo')

sys.path.insert(0, OST)
import engine.sampler as _smp  # noqa: E402
_cache = os.path.join(SCR, 'ost-cache')
os.makedirs(_cache, exist_ok=True)
if os.path.exists(os.path.join(OST, 'cache', 'calib.json')) and not os.path.exists(os.path.join(_cache, 'calib.json')):
    shutil.copy(os.path.join(OST, 'cache', 'calib.json'), os.path.join(_cache, 'calib.json'))
_smp.CACHE = _cache
from engine import *  # noqa: E402,F401,F403

SR = 48000
FPS = 24
FRAMES = 660
N = int(FRAMES / FPS * SR)
SHIFT = 60
B = lambda p: p + SHIFT  # noqa: E731  the brief's frame -> this clip's
f2s = lambda p: p / FPS  # noqa: E731
fs = lambda p: int(round(p / FPS * SR))  # noqa: E731
db = lambda v: 10 ** (v / 20)  # noqa: E731
rng = np.random.default_rng(1101)

T_SLAM, T_PRESS, T_CUT = B(180), B(188), B(540)
MUSIC_DB = float(os.environ.get('E1P1_MUSIC_DB', '6'))
LINES = {'mario-memo': 6, 'clod-right': B(184), 'mario-addendum': B(262)}


def band(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], btype='band', fs=SR, output='sos'), x)


def lowp(x, fc, o=2):
    return sosfilt(butter(o, fc, btype='low', fs=SR, output='sos'), x)


def highp(x, fc, o=2):
    return sosfilt(butter(o, fc, btype='high', fs=SR, output='sos'), x)


def put(buf, x, at, gain, pan=0.0):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))]) * np.sqrt(2)
    n = min(x.shape[1], buf.shape[1] - at)
    if n > 0 and at >= 0:
        buf[:, at:at + n] += gain * x[:, :n]


def load(name):
    x, sr = sf.read(os.path.join(SFX, name), always_2d=True)
    assert sr == SR, (name, sr)
    return x.T[:2] if x.shape[1] >= 2 else np.repeat(x.T, 2, axis=0)


def env_lin(points, n=N):
    xs = np.array([fs(p) for p, _ in points], float)
    ys = np.array([v for _, v in points], float)
    return np.interp(np.arange(n), xs, ys)


# ------------------------------------------------------------------ the music (TEMP MM-04, TEMP MM-17)
def mm04():
    g = Grid(bpm=96, meter='4/4', bars=11, swing=0.0)
    T = palette()
    T['lead'].gain_db = -4
    T['tri'].gain_db = -3
    a = Arr(g)
    build = 'F4/16 F4/16 G4/16 Ab4/16 C5/16 Ab4/16 G4/16 F4/16 F4/16 F4/16 G4/16 Ab4/16 C5/16 Eb5/16 C5/16 Ab4/16'
    chip = dict(duty=0.25, rel=0.05, sus=0.5, dec=0.08, lock=True)
    # bars 1, 3: the chip (left pane), light under the memo; a triangle bass on the beats
    for bar, vel in ((1, 0.3), (3, 0.3)):
        a.line('lead', build, (bar, 1), vel=vel, gate=0.7, **chip)
        for bt, p in ((1, 'F2'), (2, 'F2'), (3, 'Ab2'), (4, 'C3')):
            a.n('tri', p, (bar, bt), '1/8', 0.4, lock=True)
        a.n('xylo', 'C6', (bar, 1), '1/8', 0.18, lock=True)
    # bars 2, 4: the Addendum on the quartet (right pane): the solo violin leads, viola and cello hold Bb minor
    a.line('svln', 'Bb3/4 C4/4 Db4/4 F4/4', (2, 1), vel=0.42, art='sus', lock=True)
    a.ch('vla', ['Db4', 'F4'], (2, 1), '4b', 0.24, art='sus', lock=True)
    a.ch('vc', ['Bb2'], (2, 1), '4b', 0.3, art='sus', lock=True)
    a.line('svln', 'Eb4/4. Db4/8 C4/4 Bb3/4', (4, 1), vel=0.42, art='sus', lock=True)
    a.ch('vla', ['Gb3', 'Db4'], (4, 1), '4b', 0.24, art='sus', lock=True)
    a.ch('vc', ['Eb2', 'Bb2'], (4, 1), '4b', 0.3, art='sus', lock=True)
    # bar 5: THE LAUNCH: the Addendum again, a felted upright doubling it an octave up (the brand's sound, under the bow)
    a.line('svln', 'Bb3/4 C4/4 Db4/4 F4/4', (5, 1), vel=0.46, art='sus', lock=True)
    a.line('felt', 'Bb4/4 C5/4 Db5/4 F5/4', (5, 1), vel=0.3, lock=True)
    a.ch('felt', ['Bb2', 'F3', 'Db4'], (5, 1), '2b', 0.22, roll=0.02, lock=True)
    a.ch('vla', ['Db4', 'F4'], (5, 1), '4b', 0.26, art='sus', lock=True)
    a.ch('vc', ['Bb2', 'F3'], (5, 1), '4b', 0.32, art='sus', lock=True)
    # bar 6: the quartet's held chord under "Addendum." (Bbm9), the chip answers late in the bar (the site, the claps)
    for inst, ps, v in (('vln1', ['C5'], 0.2), ('vla', ['Db4', 'F4'], 0.24), ('vc', ['Bb2'], 0.3)):
        a.ch(inst, ps, (6, 1), '4b', v, art='sus', lock=True)
    a.line('lead', 'C5/16 Ab4/16 G4/16 F4/16 C5/8 F5/8', (6, 3), vel=0.28, gate=0.7, **chip)
    # bars 7-8: thinned to the held chord under the post (Gbmaj7 -> Fsus4 -> F), the Addendum's tail climbing a step
    for inst, ps, v in (('vla', ['Db4', 'F4'], 0.2), ('vc', ['Gb2', 'Db3'], 0.24)):
        a.ch(inst, ps, (7, 1), '4b', v, art='sus', lock=True)
    for inst, ps, v in (('vla', ['C4', 'F4'], 0.2), ('vc', ['F2', 'C3'], 0.24)):
        a.ch(inst, ps, (8, 1), '4b', v, art='sus', lock=True)
    a.line('svln', 'r/2 C4/8 Db4/8 r/4', (7, 1), vel=0.3, art='sus', lock=True)
    a.line('svln', 'r/4 Db4/8 Eb4/8 r/2', (8, 1), vel=0.3, art='sus', lock=True)
    # bars 9-10: both at once: the Build on the chip, the Addendum on the quartet, the bass walking up to the landing
    for bar in (9, 10):
        a.line('lead', build, (bar, 1), vel=0.3, gate=0.7, **chip)
        for bt, p in ((1, 'F2'), (2, 'Ab2'), (3, 'Bb2'), (4, 'C3')):
            a.n('tri', p, (bar, bt), '1/8', 0.42, lock=True)
    a.line('svln', 'Bb3/4 C4/4 Db4/4 F4/4', (9, 1), vel=0.46, art='sus', lock=True)
    a.line('svln', 'Eb4/4. Db4/8 C4/4 Db4/8 Eb4/8', (10, 1), vel=0.46, art='sus', lock=True)
    a.ch('vla', ['Db4', 'F4'], (9, 1), '4b', 0.26, art='sus', lock=True)
    a.ch('vc', ['Bb2'], (9, 1), '4b', 0.3, art='sus', lock=True)
    a.ch('vla', ['Eb4', 'Gb4'], (10, 1), '4b', 0.26, art='sus', lock=True)
    a.ch('vc', ['Cb3'], (10, 1), '4b', 0.3, art='sus', lock=True)
    # the site's two drawings: the Build's tag (C5 F5) on the chip, twice (bar 5 beat 3 and bar 10 beat 2)
    a.line('lead', 'C5/8 F5/8', f2s(B(210)), vel=0.3, gate=0.7, **chip)
    a.line('lead', 'C5/8 F5/8', f2s(B(505)), vel=0.32, gate=0.7, **chip)
    sc = Score('e1p1-mm04', g, T, a.notes, mutes=[(f2s(T_CUT), f2s(FRAMES))], mute_fade_ms=20.0, tail_s=0.5,
               meta=dict(id='e1p1-mm04', title='E1-P1 temp: MM-04 Lighthouse'))
    return render_score(sc, verbose=False)


def mm17():
    g = Grid(bpm=96, meter='4/4', bars=11, swing=1.0)
    T = palette()
    T['brush'].gain_db = 8
    a = Arr(g)
    prog = progression(g, [(11, 'Fm9')])
    walking_bass(a, 'ubass', prog, bars=(11, 12), layer='cb_pizz', vel=0.55, seed=4)
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...x.
    ''', bars=(11, 12))
    # Nole's LAUNCH: a rip toward Ab5 that falls off one note short (harmon trumpet, low)
    a.line('harmon', 'C4/16 F4/16 Bb4/16 Eb5/16', (11, 2), vel=0.34, lock=True)
    a.n('harmon', 'Db5', (11, 2.75), '1/4', 0.22, lock=True)
    a.ch('felt', ['Ab3', 'Eb4', 'G4'], (11, 1), '2b', 0.18, roll=0.01, lock=True)
    sc = Score('e1p1-mm17', g, T, a.notes, tail_s=0.3, meta=dict(id='e1p1-mm17', title='E1-P1 temp: MM-17 low'))
    return render_score(sc, verbose=False)


def mixdown(stems):
    out = np.zeros((2, N))
    for v in stems.values():
        v = np.asarray(v)
        if v.ndim == 1:
            v = np.stack([v, v])
        n = min(N, v.shape[1])
        out[:, :n] += v[:, :n]
    return out


# ------------------------------------------------------------------ the rooms and the foley (TEMP, synthesised, seeded)
def room_tone(seed, lo, hi, n=N):
    x = np.random.default_rng(seed).standard_normal(n)
    x = band(x, lo, hi)
    return x / (np.sqrt(np.mean(x ** 2)) + 1e-9)


def clunk():
    """the can coming on: a heavy housing 'chunk' (a low body thump + the steel lamp housing ringing once)"""
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 74 * t) * np.exp(-t / 0.05) + 0.5 * np.sin(2 * np.pi * 131 * t) * np.exp(-t / 0.035)
    hit = band(rng.standard_normal(n), 300, 2400) * np.exp(-t / 0.012)
    ring = (np.sin(2 * np.pi * 1180 * t) * 0.35 + np.sin(2 * np.pi * 1730 * t) * 0.22 + np.sin(2 * np.pi * 2610 * t) * 0.12) * np.exp(-t / 0.09)
    x = body * 0.9 + hit * 0.8 + ring * 0.28
    return x / np.max(np.abs(x))


def clay_press(seed=3):
    """a close, dry clay press: a soft squash (low-mid noise, a slow attack) with two tiny crackles of skin on clay"""
    r = np.random.default_rng(seed)
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    e = (1 - np.exp(-t / 0.018)) * np.exp(-t / 0.07)
    x = band(r.standard_normal(n), 160, 1400) * e
    for c in (0.012, 0.041):
        k = int(c * SR)
        x[k:k + 90] += band(r.standard_normal(90), 2000, 6000) * np.hanning(90) * 0.35
    x = lowp(x, 3200)
    return x / np.max(np.abs(x))


def filament():
    """a tungsten can coming up: a 100 Hz mains buzz with its odd harmonics, swelling over the ramp (0.33 s) and
    settling to a low hum that dies away inside a second"""
    n = int(1.1 * SR)
    t = np.arange(n) / SR
    buzz = sum(np.sin(2 * np.pi * 100 * k * t + k * 0.7) / k for k in (1, 3, 5, 7, 9))
    env = np.clip(t / 0.33, 0, 1) ** 1.5 * np.where(t < 0.33, 1.0, np.exp(-(t - 0.33) / 0.28) * 0.7 + 0.3 * np.exp(-(t - 0.33) / 0.08))
    x = lowp(buzz * env, 1800)
    return x / np.max(np.abs(x))


def rustle(seed):
    """a short dry cloth-and-paper rustle (a startle): two overlapping bursts of band noise"""
    r = np.random.default_rng(seed)
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    e = (1 - np.exp(-t / 0.01)) * np.exp(-t / 0.07) + 0.5 * np.exp(-np.maximum(0, t - 0.09) / 0.05) * (t > 0.09)
    x = band(r.standard_normal(n), 900, 5200) * e
    return x / np.max(np.abs(x))


def whirr(n):
    """the potter's wheel turning in its chest: a small bearing hum (90 Hz + harmonics) and a felt-on-clay rush,
    modulated once a turn (1.5 turns a second, as the picture's wheel)"""
    t = np.arange(n) / SR
    hum = sum(np.sin(2 * np.pi * 90 * k * t + k) / k for k in (1, 2, 3, 5))
    rush = band(np.random.default_rng(8).standard_normal(n), 380, 1100)
    rush /= np.sqrt(np.mean(rush ** 2)) + 1e-9
    mod = 0.75 + 0.25 * np.sin(2 * np.pi * 1.5 * t)
    return (hum * 0.18 + rush * 0.22) * mod


def claps(n_people, dur, seed):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    x = np.zeros(n)
    for p in range(n_people):
        period = 0.19 + r.random() * 0.08
        tt = r.random() * 0.1
        bright = 900 + r.random() * 900
        while tt < dur - 0.05:
            k = int(tt * SR)
            L = int(0.03 * SR)
            c = band(r.standard_normal(L), bright, bright * 2.6) * np.exp(-np.arange(L) / (0.006 * SR))
            x[k:k + L] += c[: n - k] * (0.6 + 0.4 * r.random())
            tt += period * (0.9 + 0.2 * r.random())
    x *= np.minimum(1, np.linspace(0, 6, n)) * np.minimum(1, np.linspace(4, 0, n))
    return x / (np.max(np.abs(x)) + 1e-9)


def paper_run(dur, seed):
    """the scroll unrolling along a floor: a soft paper hiss with the roll's small bumps on 2s"""
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    x = band(r.standard_normal(n), 1500, 7000) * 0.35
    x *= 0.7 + 0.3 * np.abs(np.sin(np.arange(n) / SR * np.pi * 6))
    for k in range(0, n, int(SR / 12)):
        L = int(0.012 * SR)
        x[k:k + L] += band(r.standard_normal(L), 200, 900)[: n - k] * np.hanning(L)[: n - k] * 0.8
    return x / np.max(np.abs(x))


def reverb(x, secs=0.45, seed=5, lo=180, hi=5200):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    ir = band(r.standard_normal(n), lo, hi) * np.exp(-np.arange(n) / (secs * SR / 5))
    ir /= np.sqrt(np.sum(ir ** 2))
    return fftconvolve(x, ir)[: len(x)]


def voice(name):
    y, sr = sf.read(os.path.join(VO, f'{name}.wav'))
    assert sr == SR
    return y


def main():
    music04 = mixdown(mm04())
    music17 = mixdown(mm17())
    # ---- the dialogue (dry takes), with the rooms on sends
    dia = np.zeros((2, N))
    dia_env = np.zeros(N)
    for name, at in LINES.items():
        y = voice(name)
        a = fs(at)
        pan = 0.2 if name.startswith('mario') else 0.16
        wet = reverb(y, 0.42, 5) * (db(-17) if name.startswith('mario') else db(-24))
        put(dia, y, a, db(0), pan)
        put(dia, wet, a, 1.0, pan + 0.1)
        e = np.abs(y)
        k = int(0.05 * SR)
        e = np.convolve(e, np.ones(k) / k, mode='same')
        dia_env[a:a + len(e)] = np.maximum(dia_env[a:a + len(e)], e[: max(0, N - a)])
    # the music ducks under a line (-7 dB, 80 ms attack, 350 ms release), never stops
    duck = np.clip(dia_env / (np.max(dia_env) * 0.25 + 1e-9), 0, 1)
    att, rel = np.exp(-1 / (0.08 * SR)), np.exp(-1 / (0.35 * SR))
    d = np.zeros(N)
    cur = 0.0
    for i in range(N):
        cur = duck[i] + (cur - duck[i]) * (att if duck[i] > cur else rel)
        d[i] = cur
    music = music04 * (1 - d * (1 - db(-7))) + music17 * db(-9)
    # ---- the beds: the bullpen (left) and the lighthouse (right) until the cut; the bullpen at night after it
    bed = np.zeros((2, N))
    bp = room_tone(11, 70, 900) * 0.5 + room_tone(12, 1800, 4000) * 0.08
    lh = room_tone(21, 50, 500) * 0.55 + highp(room_tone(22, 200, 2000), 400) * 0.06
    g_day = env_lin([(0, 1), (T_CUT - 1, 1), (T_CUT, 0), (FRAMES, 0)])
    put(bed, bp * g_day, 0, db(-38), pan=-0.55)
    put(bed, lh * g_day, 0, db(-37), pan=0.55)
    # (round 5: the lighthouse's lamp is held still in this scene, so its gear's 3-frame tick is gone: it was a
    # metronome under the whole right pane)
    # Gerg types on 1s (the house typing loop, low, left), except while he holds things up
    typ = load('typing_soft.wav')
    typ_g = env_lin([(0, 1), (40, 1), (42, 0), (72, 0), (74, 1), (B(216), 1), (B(217), 0), (B(238), 0), (B(239), 1), (B(489), 1), (B(490), 0), (B(503), 0), (B(504), 1), (B(511), 1), (B(512), 0), (B(525), 0), (B(526), 1), (T_CUT - 1, 1), (T_CUT, 0), (FRAMES, 0)])  # round 5: he stops to glance at the site twice
    reps = int(np.ceil(N / typ.shape[1]))
    typl = np.tile(typ, (1, reps))[:, :N]
    bed += typl * typ_g * db(-33) * np.array([[1.2], [0.5]])
    # the night bed for sc 12 (air, the far city, one monitor's whine)
    night = room_tone(31, 60, 700) * 0.5 + np.sin(2 * np.pi * 15734 / 2 * np.arange(N) / SR) * 0.01
    put(bed, night * env_lin([(0, 0), (T_CUT, 0), (T_CUT + 1, 1), (FRAMES, 1)]), 0, db(-36))
    rt = load('room_tone.wav')
    rt = np.tile(rt, (1, int(np.ceil((N - fs(T_CUT)) / rt.shape[1]))))[:, : N - fs(T_CUT)]
    put(bed, rt, fs(T_CUT), db(-30))
    # ---- the foley
    fx = np.zeros((2, N))
    put(fx, load('camera_shutter.wav'), fs(60), db(-20), pan=-0.5)
    put(fx, load('camera_shutter.wav'), fs(B(495)), db(-20), pan=-0.55)
    # THE CLUNK on the downbeat, and the clay's first press on the bow's down key
    put(fx, clunk(), fs(T_SLAM), db(-9), pan=0.25)
    # the filament's mains buzz under the strike (round 6: the light strikes full; the buzz swells and settles), and
    # Mario's startle (his hop back, his sleeve and the scroll's roll: a dry rustle, right)
    put(fx, filament(), fs(T_SLAM), db(-31), pan=0.25)
    put(fx, rustle(5), fs(T_SLAM + 1), db(-30), pan=0.5)
    put(fx, clay_press(3), fs(T_PRESS), db(-19), pan=0.3)
    put(fx, clay_press(4) * 0.6, fs(B(204)), db(-24), pan=0.3)  # the rise, a softer handling of the clay
    # the wheel's whirr in the pool, from the slam to the cut (lower under the post)
    wn = fs(T_CUT) - fs(T_SLAM)
    wg = env_lin([(0, 0), (3, 1), (B(300) - T_SLAM, 1), (B(310) - T_SLAM, 0.5), (B(410) - T_SLAM, 0.5), (B(420) - T_SLAM, 1), (T_CUT - T_SLAM - 1, 1), (T_CUT - T_SLAM, 0)], n=wn)
    put(fx, whirr(wn) * wg, fs(T_SLAM), db(-36), pan=0.3)
    # the bullpen claps at the site (p345) and harder at the post (p420)
    put(fx, claps(3, 1.4, 7), fs(B(285)), db(-27), pan=-0.5)
    put(fx, claps(5, 2.1, 9), fs(B(360)), db(-24), pan=-0.55)
    # his post pops (the house post click)
    put(fx, load('post_click.wav'), fs(B(305)), db(-24), pan=-0.45)
    # Mario's pen on the scroll while he adds a line; round 6: and (quieter, under his memo) while he writes the memo
    for p in list(range(96, 128, 5)) + list(range(166, T_SLAM - 2, 5)):
        L = int(0.03 * SR)
        put(fx, band(rng.standard_normal(L), 2500, 7000) * np.hanning(L), fs(p), db(-45 + 4 * rng.random()), pan=0.45)
    for p in range(B(330), B(390), 5):
        L = int(0.03 * SR)
        put(fx, band(rng.standard_normal(L), 2500, 7000) * np.hanning(L), fs(p), db(-40 + 4 * rng.random()), pan=0.45)
    # the second scroll: unrolling (p480-540) right to left across the split, its landing on Gerg's desk
    pr = paper_run(f2s(B(480) - B(420)), 12)
    panr = np.linspace(0.45, -0.45, len(pr))
    put(fx, np.stack([pr * np.sqrt(0.5 * (1 - panr)), pr * np.sqrt(0.5 * (1 + panr))]) * np.sqrt(2), fs(B(420)), db(-30))
    put(fx, load('paper_flutter.wav'), fs(B(478)), db(-28), pan=-0.4)
    # ---- the mix
    stem_bars = lambda x: [round(20 * np.log10(np.sqrt(np.mean(x[:, fs(b * 60):fs(b * 60 + 60)] ** 2)) + 1e-12), 1) for b in range(11)]
    print('music bars', stem_bars(music), '\ndia bars', stem_bars(dia), '\nbed bars', stem_bars(bed), '\nfx bars', stem_bars(fx))
    mix = music * db(MUSIC_DB) + dia * db(-1) + bed + fx
    mix[:, :fs(2)] *= np.linspace(0, 1, fs(2))
    mix[:, -fs(4):] *= np.linspace(1, 0, fs(4))
    try:
        import pyloudnorm as pyln
        L = pyln.Meter(SR).integrated_loudness(mix.T)
        mix *= db(-16.0 - L)
    except Exception:
        mix /= np.max(np.abs(mix)) * 1.3
    # a look-ahead limiter at -1.5 dBFS
    thr = db(-1.5)
    look = int(0.0015 * SR)
    from scipy.ndimage import minimum_filter1d
    need = minimum_filter1d(np.minimum(1.0, thr / np.maximum(np.max(np.abs(mix), axis=0), 1e-9)), size=2 * look + 1)
    gg = np.empty_like(need)
    rel2 = np.exp(-1.0 / (0.06 * SR))
    cur = 1.0
    for i in range(len(need)):
        cur = need[i] if need[i] < cur else need[i] + (cur - need[i]) * rel2
        gg[i] = cur
    mix = mix * gg
    pk = np.max(np.abs(mix))
    if pk > db(-1.3):
        mix *= db(-1.3) / pk
    sf.write(OUT, mix.T.astype(np.float32), SR, subtype='PCM_24')
    # ---- measurements (no ears): loudness, peak, the quietest 100 ms window, level per bar
    rep = {}
    try:
        import pyloudnorm as pyln
        rep['lufs'] = round(pyln.Meter(SR).integrated_loudness(mix.T), 2)
    except Exception:
        pass
    rep['peak_dbfs'] = round(20 * np.log10(np.max(np.abs(mix)) + 1e-12), 2)
    w = int(0.1 * SR)
    rms = np.sqrt(np.convolve(np.mean(mix ** 2, axis=0), np.ones(w) / w, mode='valid'))
    rep['quietest_100ms_dbfs'] = round(20 * np.log10(np.min(rms[fs(3):-fs(5)]) + 1e-12), 1)
    rep['bars_dbfs'] = [round(20 * np.log10(np.sqrt(np.mean(mix[:, fs(b * 60):fs(b * 60 + 60)] ** 2)) + 1e-12), 1) for b in range(11)]
    json.dump(rep, open(os.path.join(SCR, 'sound-measure.json'), 'w'), indent=1)
    print('wrote', OUT, rep)


if __name__ == '__main__':
    main()
