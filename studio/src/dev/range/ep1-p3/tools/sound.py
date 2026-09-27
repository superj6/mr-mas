"""MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): the SOUND PASS, rebuilt from the v5 reel.

Run with the OST venv (numpy, scipy, soundfile and the OST engine), from studio/:
  ../audio/.venv-theme/bin/python src/dev/range/ep1-p3/tools/sound.py <out.wav> <scratch dir>

Everything upstream is read-only:
  1. The v5 builder's own bed.py (the snapshot that made mix.wav, audio/reel/ep01-act4-v5/history/v5a-1508/bed.py, with
     its own ep01-act4-v5.json; the live bed.py only if the snapshot is gone) is re-run IN THIS PROCESS, cut before its MASTER
     section (so it writes nothing), with two bookkeeping patches that do not change a sample: the bullpen bed's three
     components (HVAC, murmur, keyboard taps) are kept apart, and the bullpen run's level and envelope are kept. Its
     buses (dialogue, music, rooms, SFX) are sliced at the clip's window: p0 = reel 412.0 s, 437 frames (18.208 s).
     So the three v5 takes, the M7a render at its v5 offsets (-2.8 dB, thinned and ducked under talk exactly as the v5
     mix), and the v5 bullpen and boardroom beds are the v5 reel's own samples.
  2. Added (the brief's sound for 1.D):
       - a Rhodes chord on each of the three words, on the stressed syllable where the vector drawing lands
         (p250 "below" Abmaj9, p273 "above" Cmaj9, p296 "around" Emaj9: the render's own pad chords at those
         moments; the render's pad changes land 9-12 frames early, and it has no Rhodes until the bloom at p309);
         rendered with the OST engine's GeneralUser Rhodes (TEMP), its calibration cache redirected to scratch;
       - a sparse packing rustle in the bullpen (cardboard flaps, a tape pull) before the change (synthesised: the SFX
         library has no cardboard);
       - the room changes medium: from p296 the murmur and the key taps thin in three held steps (p296, p300, p304) to
         nothing, and the HVAC hands over in the same steps to a clean, airless corporate hush (steady filtered noise,
         no modulation, no events);
       - his key ring jangles once from inside the wall at p312 (synthesised: muffled, boxed, low);
       - "Hello." (a5-30-07) is placed a little low and close (a +3 dB low shelf at 180 Hz, -2 dB above 6 kHz), from
         under him.
  3. The master: the v5 master's own peak limiter (0.89 ceiling). QA: loudness and levels against the v5 mix's slice
     of the same window (read from audio/reel/ep01-act4-v5/mix.wav, read-only), written to <scratch>/sound-qa.json.
Nothing here has been listened to. Every number is measured.
"""
import json
import os
import shutil
import sys
import time

import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
ROOT = os.path.dirname(STUDIO)
OST = os.path.join(ROOT, 'audio', 'ost')
BED_LIVE = os.path.join(ROOT, 'audio', 'reel', 'ep01-act4-v5', 'bed.py')
# The clip is cut from the v5 reel as rendered (out/reel/ep01-act4-v5.mp4; mix.wav 15:08). The reel's own pass later
# snapshotted that build at history/v5a-1508/ (bed.py 15:07 + its ep01-act4-v5.json) and began a new revision IN PLACE
# (bed.py and the json edited 22:10-22:27). So the snapshot is the bed that made mix.wav: read it, with its own json,
# and keep the live path as __file__ so the bed's ROOT/OST/SFX paths resolve. The rebuild check below proves the match.
BED_SNAP = os.path.join(ROOT, 'audio', 'reel', 'ep01-act4-v5', 'history', 'v5a-1508')
BED = os.path.join(BED_SNAP, 'bed.py') if os.path.exists(os.path.join(BED_SNAP, 'bed.py')) else BED_LIVE
V5MIX = os.path.join(ROOT, 'audio', 'reel', 'ep01-act4-v5', 'mix.wav')
OUT = sys.argv[1]
SCR = sys.argv[2]
os.makedirs(SCR, exist_ok=True)
SR, FPS = 48000, 24
CLIP_F = 437
P0 = 412.0                      # reel seconds at p0 (the reel's S7.02)
N = int(round(CLIP_F / FPS * SR))
I0 = int(round(P0 * SR))
t0 = time.time()


def fs(p):
    return int(round(p / FPS * SR))


def db(x):
    return 10.0 ** (np.asarray(x) / 20.0)


def rms_db(x):
    return float(20 * np.log10(np.sqrt(np.mean(np.asarray(x, np.float64) ** 2)) + 1e-12))


# ------------------------------------------------------------------ 1. the v5 bed, re-run read-only (no writes)
src = open(BED).read()
src = src.split('# ------------------------------------------------------------------ MASTER')[0]
if BED != BED_LIVE:
    _R = "REEL = os.path.join(ROOT, 'show/reel/ep01-act4-v5.json')"
    assert src.count(_R) == 1, 'snapshot bed: REEL line not found'
    src = src.replace(_R, f"REEL = {os.path.join(BED_SNAP, 'ep01-act4-v5.json')!r}")
OLD_BP = "        return hvac(n, 1000) * 0.8 + lpf(murmur(n, 5), 1500) * 0.45 + events(n, 0.9, key, -14)"
NEW_BP = ("        _h = hvac(n, 1000) * 0.8\n        _m = lpf(murmur(n, 5), 1500) * 0.45\n        _e = events(n, 0.9, key, -14)\n"
          "        _STASH.setdefault('bp', []).append((_h, _m, _e))\n        return _h + _m + _e")
OLD_SC = "    x *= db(ROOM_RMS + (1.0 if r in ('fires', 'allhands') else 0.0) + (3.0 if r == 'allhands' else 0.0)) / (np.sqrt(np.mean(x ** 2)) + 1e-12)"
NEW_SC = ("    _sc = db(ROOM_RMS + (1.0 if r in ('fires', 'allhands') else 0.0) + (3.0 if r == 'allhands' else 0.0)) / (np.sqrt(np.mean(x ** 2)) + 1e-12)\n"
          "    x *= _sc")
OLD_ADD = "    add(rooms, x * g[:, None], S(a))\n    ROOM_LOG.append"
NEW_ADD = "    add(rooms, x * g[:, None], S(a))\n    if r == 'bullpen': _STASH.setdefault('bp_place', []).append((a, float(_sc), g.copy(), n))\n    ROOM_LOG.append"
for old, new in [(OLD_BP, NEW_BP), (OLD_SC, NEW_SC), (OLD_ADD, NEW_ADD)]:
    assert src.count(old) == 1, old[:70]
    src = src.replace(old, new)
src = src.replace("OUT_WAV = os.path.join(HERE, 'mix.wav')", f"OUT_WAV = {os.path.join(SCR, 'unused-mix.wav')!r}")
src = src.replace("OUT_QA = os.path.join(HERE, 'qa.json')", f"OUT_QA = {os.path.join(SCR, 'unused-qa.json')!r}")
ns = {'__file__': BED_LIVE, '__name__': 'bed_v5_readonly', '_STASH': {}}
exec(compile(src, BED, 'exec'), ns)
print(f'v5 bed re-run ({os.path.relpath(BED, ROOT)}): {time.time() - t0:.1f} s')


def win(bus):
    return bus[I0:I0 + N].astype(np.float64).copy()


dlg, music, rooms, sfx = (win(ns[k]) for k in ('dlg', 'music', 'rooms', 'sfx'))
LID = ns['LID']
# the bullpen run that covers the window: its components as placed on the reel (hpf, level, envelope)
hpf35 = lambda x: ns['hpf'](x.astype(np.float32), 35)   # noqa: E731
bp = None
for (h, m, e), (a, sc, g, n) in zip(ns['_STASH']['bp'], ns['_STASH']['bp_place']):
    s0 = int(ns['S'](a))
    if s0 <= I0 < s0 + n:
        comps = []
        for comp in (h, m, e):
            y = np.zeros((N, 2))
            x = hpf35(comp) * sc * g[:, None]
            lo, hi = I0 - s0, min(n, I0 - s0 + N)
            y[:hi - lo] = x[lo:hi]
            comps.append(y)
        bp = dict(hvac=comps[0], murmur=comps[1], keys=comps[2], env=np.interp(np.arange(N), np.arange(hi - lo), g[lo:hi], right=0.0))
        break
assert bp is not None, 'no bullpen run covers the window'

rng = np.random.default_rng(1120)


def lpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def hpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'high', fs=SR, output='sos'), x, axis=0)


def bpf(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


# ------------------------------------------------------------------ 2a. the Rhodes chords (OST engine, read-only)
sys.path.insert(0, OST)
import engine.sampler as _smp  # noqa: E402
_cache = os.path.join(SCR, 'ost-cache')
os.makedirs(_cache, exist_ok=True)
if os.path.exists(os.path.join(OST, 'cache', 'calib.json')) and not os.path.exists(os.path.join(_cache, 'calib.json')):
    shutil.copy(os.path.join(OST, 'cache', 'calib.json'), os.path.join(_cache, 'calib.json'))
_smp.CACHE = _cache
from engine import Grid, Arr, palette, Score, render_score  # noqa: E402

AB = ['G3', 'Bb3', 'C4', 'Eb4']      # the render's own voicings (e01-act4-v4 s7s8_the_return.py)
CM = ['G3', 'B3', 'D4', 'E4']
EM = ['G#3', 'B3', 'D#4', 'F#4']
CHORDS = [(250, AB, 0.44, 'below'), (273, CM, 0.42, 'above'), (296, EM, 0.46, 'around')]
g = Grid(bpm=96, meter='4/4', length_s=CLIP_F / FPS + 2, swing=0.0)
T = palette()
a = Arr(g)
for i, (p, ch, v, _w) in enumerate(CHORDS):
    nxt = CHORDS[i + 1][0] if i + 1 < len(CHORDS) else 330
    a.ch('rhodes', ch, p / FPS, (nxt - p) / FPS + 0.25, v, roll=0.006, lock=True)
T['rhodes'].pedal = [(0.0, False)]
sc = Score('ep1-p3-rhodes', g, T, a.notes, tail_s=2.0, meta=dict(id='ep1-p3-rhodes', title='E1-P3 temp: three Rhodes chords'))
stems = render_score(sc, verbose=False)
rh = np.zeros((N, 2))
for k, v in stems.items():
    v = np.asarray(v, np.float64)
    if v.ndim == 1:
        v = np.stack([v, v])
    n_ = min(N, v.shape[1])
    rh[:n_] += v[:, :n_].T
# under the voice: the loudest chord's attack peaks 13 dB under the dialogue's peak in the window (high-passed at 140 Hz)
dpk = np.max(np.abs(dlg))
rh = hpf(rh, 140, 2)
rh *= (dpk * db(-13.0)) / (np.max(np.abs(rh)) + 1e-12)
print(f'rhodes rendered: {time.time() - t0:.1f} s')

# ------------------------------------------------------------------ 2b. the room changes medium
def held_steps(points, ramp_ms=15):
    """a gain curve in HELD steps: [(frame, gain)], each step ramped over a few ms (no clicks, no fades)"""
    y = np.full(N, points[0][1])
    r = int(SR * ramp_ms / 1000)
    for (p, v), (p_prev, v_prev) in zip(points[1:], points[:-1]):
        i = fs(p)
        y[i:] = v
        y[i:i + r] = np.linspace(v_prev, v, min(r, N - i))
    return y


MURMUR_G = held_steps([(0, 1.0), (296, 0.5), (300, 0.2), (304, 0.0)])
HVAC_G = held_steps([(0, 1.0), (296, 0.7), (300, 0.4), (304, 0.12)])
HUSH_G = held_steps([(0, 0.0), (296, 0.4), (300, 0.72), (304, 1.0)])
# the corporate hush: steady, band-limited, airless (no modulation, no events), a touch under the HVAC it replaces
w = rng.standard_normal((N + SR, 2))
hush = bpf(w, 90, 1400, 2)[SR:]
hush = lpf(hush, 900, 1)
hush *= db(rms_db((bp['hvac'] + bp['murmur'] + bp['keys'])[fs(120):fs(290)]) - 4.0) / (np.sqrt(np.mean(hush ** 2)) + 1e-12)
hush *= bp['env'][:, None]
room_new = rooms - bp['murmur'] * (1 - MURMUR_G)[:, None] - bp['keys'] * (1 - MURMUR_G)[:, None] \
    - bp['hvac'] * (1 - HVAC_G)[:, None] + hush * HUSH_G[:, None]


# packing rustle (bullpen, before the change): cardboard flap thumps + crinkles, one tape pull
def flap(dur=0.16, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = bpf(rng.standard_normal(n), 220 * bright, 2400 * bright, 2) * np.exp(-t / (dur * 0.35))
    x[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return x / (np.max(np.abs(x)) + 1e-9)


def tape_pull(dur=0.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * (0.5 + 0.5 * (np.sin(2 * np.pi * 38 * t) > 0))
    x = bpf(x, 900, 5200, 2) * np.sin(np.pi * t / dur) ** 0.6
    return x / (np.max(np.abs(x)) + 1e-9)


rustle = np.zeros((N, 2))
# only in the gaps between lines (before Mas's question, between the two turns, inside Tasya's pauses)
for p, kind, gain, pan in [(12, 'flap', -34, -0.5), (30, 'flap', -37, -0.45), (114, 'tape', -39, 0.55), (154, 'flap', -38, 0.3),
                           (233, 'flap', -40, -0.2)]:
    x = flap(bright=rng.uniform(0.8, 1.2)) if kind == 'flap' else tape_pull()
    x = x * db(gain)
    i = fs(p)
    n_ = min(len(x), N - i)
    rustle[i:i + n_, 0] += x[:n_] * (1 - max(0, pan))
    rustle[i:i + n_, 1] += x[:n_] * (1 + min(0, pan))
rustle *= MURMUR_G[:, None]


# the key ring, once, from inside the wall (p312): metal clinks with inharmonic partials, then boxed and muffled
def keyring():
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(9):
        at = int((0.012 + k * 0.034 + rng.uniform(-0.01, 0.012)) * SR)
        f0 = rng.uniform(2400, 5200)
        m = int(0.25 * SR)
        tt = np.arange(m) / SR
        tone = sum(np.sin(2 * np.pi * f0 * r * tt + rng.uniform(0, 6)) * gg for r, gg in [(1, 1), (2.76, 0.5), (5.4, 0.25)])
        tone *= np.exp(-tt / rng.uniform(0.03, 0.07)) * rng.uniform(0.5, 1.0) * (0.85 ** k)
        x[at:at + m] += tone[:max(0, min(m, n - at))]
    x += bpf(rng.standard_normal(n), 3000, 9000) * np.exp(-t / 0.08) * 0.15
    # inside the wall: a low-pass, a small boxy resonance, a short dense reflection tail
    x = lpf(x, 1700, 2)
    b, a_ = signal.iirpeak(420, 4, fs=SR)
    x = x + 0.6 * signal.lfilter(b, a_, x)
    tail = np.zeros(int(0.12 * SR))
    for d in rng.integers(int(0.004 * SR), int(0.11 * SR), 24):
        tail[d] += rng.uniform(-0.35, 0.35)
    x = np.convolve(x, np.concatenate([[1.0], tail]))[:n + len(tail)]
    return x / (np.max(np.abs(x)) + 1e-9)


kr = keyring() * db(-30)
key_sfx = np.zeros((N, 2))
i = fs(312)
key_sfx[i:i + len(kr), 0] += kr[:N - i] * 0.8
key_sfx[i:i + len(kr), 1] += kr[:N - i] * 0.95

# "Hello." from under him: low and close (swap the placed take for its treated copy)
hl = LID['a5-30-07']
x, sr_ = sf.read(os.path.join(ROOT, hl['audio']), dtype='float64', always_2d=True)
x = x.mean(1)
s_on = int(round((hl['on'] - hl['in']) * SR)) - I0
raw = np.zeros(N)
raw[max(0, s_on):min(N, s_on + len(x))] = x[max(0, -s_on):max(0, -s_on) + min(N, s_on + len(x)) - max(0, s_on)]


def shelf(x, f, gain_db, kind):
    A = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f / SR
    al = np.sin(w0) / 2 * np.sqrt(2)
    cw = np.cos(w0)
    if kind == 'low':
        b = [A * ((A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al)]
        a_ = [(A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al]
    else:
        b = [A * ((A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al)]
        a_ = [(A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al]
    return signal.lfilter(np.array(b) / a_[0], np.array(a_) / a_[0], x)


treated = shelf(shelf(raw, 180, 3.0, 'low'), 6000, -2.0, 'high')
treated *= np.sqrt(np.mean(raw ** 2)) / (np.sqrt(np.mean(treated ** 2)) + 1e-12)
dlg_new = dlg + np.column_stack([treated - raw, treated - raw]) * 0.7071

# ------------------------------------------------------------------ 3. the master (the v5 master's limiter)
mix = dlg_new + music + rh + room_new + sfx + rustle + key_sfx
env = np.max(np.abs(mix), axis=1)
k_ = int(0.005 * SR)
pk = signal.convolve(np.maximum.reduce([np.roll(env, s) for s in range(0, k_, 48)]), np.ones(k_) / k_, 'same')
lim = np.minimum(1.0, 0.89 / (pk + 1e-9))
mix *= lim[:, None]
mix[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
mix[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))[:, None]
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')

# ------------------------------------------------------------------ QA (measured, not heard)
try:
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    LU = lambda x: round(float(meter.integrated_loudness(np.asarray(x, np.float64))), 1)   # noqa: E731
except Exception:  # noqa: BLE001
    LU = lambda x: None   # noqa: E731
ref, _ = sf.read(V5MIX, start=I0, stop=I0 + N, dtype='float64', always_2d=True)


def seg(x, p0, p1):
    return x[fs(p0):fs(p1)]


qa = dict(
    built=time.strftime('%Y-%m-%d %H:%M:%S'), out=OUT, seconds=round(N / SR, 3), window_reel_s=[P0, round(P0 + N / SR, 3)],
    loudness_lufs=dict(mix=LU(mix), v5_mix_slice=LU(ref), dialogue=LU(dlg_new), music=LU(music), rooms_new=LU(room_new), rooms_v5=LU(rooms)),
    peak_dbfs=round(20 * np.log10(np.max(np.abs(mix)) + 1e-12), 2), limiter_ms=int(np.sum(lim < 0.999) / SR * 1000),
    v5_rebuild_check_dbfs=dict(note='our rebuilt v5 buses summed vs the v5 mix slice (the v5 master applied no limiting here)',
                               residual_rms=round(rms_db((dlg + music + rooms + sfx) - ref), 1), ref_rms=round(rms_db(ref), 1)),
    rooms_rms_dbfs=dict(before_p290=round(rms_db(seg(room_new, 130, 290)), 1), after_p306=round(rms_db(seg(room_new, 306, 380)), 1),
                        v5_after_p306=round(rms_db(seg(rooms, 306, 380)), 1), murmur_removed_after_p304=True),
    rhodes=[dict(word=w, frame=p, peak_dbfs=round(20 * np.log10(np.max(np.abs(seg(rh, p, p + 12))) + 1e-12), 1)) for p, _c, _v, w in CHORDS],
    dialogue_peak_dbfs=round(20 * np.log10(dpk + 1e-12), 1),
    music_rms_under_line_dbfs=round(rms_db(seg(music, 128, 307)), 1),
    keyring=dict(frame=312, peak_dbfs=round(20 * np.log10(np.max(np.abs(key_sfx)) + 1e-12), 1)),
    rustle_peak_dbfs=round(20 * np.log10(np.max(np.abs(rustle)) + 1e-12), 1),
    hello=dict(take='a5-30-07', frame=round((hl['on'] - P0) * FPS, 1), shelf='+3 dB @180 Hz, -2 dB @6 kHz, level-matched'),
    render_s=round(time.time() - t0, 1),
)
json.dump(qa, open(os.path.join(SCR, 'sound-qa.json'), 'w'), indent=1)
print(json.dumps(qa, indent=1))
