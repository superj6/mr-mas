"""Ep2's outro: the designed sound and the mix (a copy of Ep1's outro B mix, studio/src/dev/outro/b/audio/mix.py, read,
never edited; no moth, a second page).

Reads (read-only): the score (track.py -> $SC/music/e02-14-end-credits-album.wav), the vocal pad's flat line (vocal.py ->
$SC/music/vocal-pad.wav) and the intro's own Orb sounds in audio/intro/sfx/src (the servo on C6, the scan "shhk" tuned to
F/C, the toast chime C7), so the outro's Orb sounds exactly like the intro's and Ep1's outro. Synthesizes here, as Ep1's:
the scan's sustained sweep under each cone (25 frames), the GLYPH grains inside it, a faint tick per toast chip.
  page 1 (Ep1's plain week): o9 header tick; o15 servo; o30-54 the scan; o60, o75 chip ticks; o120 the chime; o150 the
         servo, softer (the glance back to its toast)
  page 2 (Ep2): o186 the cast header's tick; o190-214 the second scan (shhk, sweep, grains); o240, o255 the tools ticks
One owner per sound (OST-BIBLE rule 11): the SFX own the servo, the scans, the grains and the chime; the score leaves them
room (1.3-1.4 and 4.1-4.3 have no score onset, nor 3.1).

The music bus is the score plus the vocal pad, the pad set so its flat line (2.1-2.2&) reads as loud as the leap that
answers it (2.3-2.4&) plus 1 LU. Page 1 (o0-o180) is set to Ep1's outro over the same frames (-15.29 LUFS), so the credits and
the verdict play at Ep1's level; the cast page is a quieter bed under reading. If a true peak would pass the picture
masters' ceiling (-3 dBTP, OST-BIBLE rule 14), the OST engine's own look-ahead limiter takes only those peaks down.
Writes out/ep02/v1/outro/outro-b-ep2.wav (the name the manifest plays at -1 dB), outro-b-ep2-{music,sfx}.wav (the stems,
the same static gain) and $SC/mix-report.json. All WAVs under out/ are git-ignored.

  audio/.venv-theme/bin/python studio/src/episodes/ep02/outro/audio/mix.py "$SC"
"""
import os  # noqa: E402
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json  # noqa: E402

import numpy as np  # noqa: E402
import pyloudnorm as pyln  # noqa: E402
import soundfile as sf  # noqa: E402
from scipy.signal import butter, lfilter, resample_poly, sosfilt  # noqa: E402

sys.dont_write_bytecode = True
ROOT = REPO
SC = sys.argv[1]
OUT = os.path.join(ROOT, 'out/ep02/v1/outro')
NAME = 'outro-b-ep2'
os.makedirs(OUT, exist_ok=True)
SR = 48000
FPS = 24
OUT_F = 345                                   # the cut on 6.4 (timeline.ts OUT_F)
N_FRAMES = OUT_F + 15                         # + 15 frames of black while the fifth releases = 360
N = N_FRAMES * SR // FPS                      # 15.000 s exactly
TP_CEIL = -3.0
SRC = os.path.join(ROOT, 'audio/intro/sfx/src')
rng = np.random.default_rng(1216)


def fr(f):
    return int(round(f * SR / FPS))


def load(path):
    x, sr = sf.read(path, always_2d=True, dtype='float64')
    assert sr == SR, (path, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.T.copy()


def db(v):
    return 10 ** (v / 20)


def pan2(mono, p):
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)])


def place(bus, x, frame, gain_db=0.0, pan=None, peak_db=None):
    if peak_db is not None:
        x = x * (db(peak_db) / (np.max(np.abs(x)) + 1e-12))
    if pan is not None:
        x = pan2(x.mean(axis=0) * np.sqrt(2), pan)
    x = x * db(gain_db)
    s = fr(frame)
    e = min(bus.shape[1], s + x.shape[1])
    bus[:, s:e] += x[:, :e - s]


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


def resonator(x, f, q):
    w = 2 * np.pi * f / SR
    r = np.exp(-w / (2 * q))
    return lfilter([1 - r], [1, -2 * r * np.cos(w), r * r], x)


EVENTS = []
sfx = np.zeros((2, N))


def ev(name, frame, **kw):
    EVENTS.append(dict(sound=name, outro_frame=frame, sec=round(frame / FPS, 3), **kw))


servo = load(os.path.join(SRC, 'orb_servo_C6.wav'))
shhk = load(os.path.join(SRC, 'orb_scan_sweep_FC.wav'))


def scan(f0, label):
    """Ep1's scan: the shhk on the cone's opening, the F/C-tuned sustained sweep under the 25-frame cone, the GLYPH
    grains (G6 / Db7 / F7) one per 2 frames while the tokens resolve"""
    place(sfx, shhk, f0, gain_db=-16.0, pan=0.45)
    L = fr(25)
    t = np.arange(L) / SR
    noise = rng.standard_normal(L)
    body = sum(resonator(noise, f, 18) * g for f, g in ((698.46, 0.5), (1046.5, 0.8), (1396.9, 1.0), (2093.0, 0.7), (2793.8, 0.35)))
    body = bp(body, 500, 5000)
    env = np.clip(t / 0.06, 0, 1) * np.clip((t[-1] - t) / 0.12, 0, 1) * (0.55 + 0.45 * np.sin(np.pi * t / t[-1]))
    place(sfx, pan2(body * env, np.linspace(0.5, -0.1, L)), f0, peak_db=-20.0)
    for k, f in enumerate(range(f0 + 1, f0 + 23, 2)):
        p = [1567.98, 2217.46, 2793.83][k % 3]
        gl = int(0.035 * SR)
        tt = np.arange(gl) / SR
        grain = np.sin(2 * np.pi * p * tt) * np.exp(-tt / 0.008) + 0.3 * rng.standard_normal(gl) * np.exp(-tt / 0.002)
        place(sfx, np.stack([grain, grain]), f, peak_db=-31.0 + (k % 2) * -3, pan=0.3 - 0.06 * k)
    ev(f'{label}: orb_scan_sweep_FC (intro-sfx) + sweep bed + grains (synth)', f0, until=f0 + 25)


def tick(f, pk):
    tl = int(0.012 * SR)
    tt = np.arange(tl) / SR
    t_ = bp(rng.standard_normal(tl), 2500, 9000) * np.exp(-tt / 0.0025)
    place(sfx, np.stack([t_, t_]), f, peak_db=pk, pan=-0.55)


# ---------------------------------------------------------------- page 1: Ep1's plain week
place(sfx, servo, 15, gain_db=-18.0, pan=0.55)
ev('orb_servo_C6 (intro-sfx): the iris to the lens', 15)
scan(30, 'the scan')
for f, pk in ((9, -37.0), (60, -40.0), (75, -40.0)):
    tick(f, pk)
ev('toast ticks (synth): the header (o9), the credit chips (2.1, 2.2)', 9, until=76)
chime = load(os.path.join(SRC, 'blip_orb_toast_C7.wav'))
place(sfx, chime, 120, gain_db=-11.0, pan=0.45)
ev('blip_orb_toast_C7 (intro-sfx): the verdict, the lens lights', 120)
place(sfx, servo, 150, gain_db=-21.0, pan=0.55)
ev('orb_servo_C6 (intro-sfx), softer: the glance back to its toast (3.3)', 150)
# ---------------------------------------------------------------- page 2: the cast
tick(186, -37.0)
ev('toast tick (synth): the cast page\'s header posts', 186)
scan(190, 'the second scan (the cast)')
for f in (240, 255):
    tick(f, -40.0)
ev('toast ticks (synth): the tools chips (5.1, 5.2)', 240, until=256)

# ---------------------------------------------------------------- the music: the score + the vocal pad
mus = load(os.path.join(SC, 'music', 'e02-14-end-credits-album.wav'))
pad = load(os.path.join(SC, 'music', 'vocal-pad.wav'))
music = np.zeros((2, N))
m = mus[:, :N]
music[:, :m.shape[1]] = m
meter = pyln.Meter(SR)


def lu(x, a, b):
    return float(meter.integrated_loudness(x[:, int(a * SR):int(b * SR)].T))


vp = json.load(open(os.path.join(SC, 'music', 'vocal-pad.json')))
flat = (vp['onsets_s'][0], vp['stop_s'])
leap = (vp['stop_s'] + 0.035, vp['stop_s'] + 0.035 + 1.25)
# the pad's gain: the flat line with the pad (and the felt, bass and brushes under it) 1 LU over the leap that answers
# it: the voice carries the knee's first half, then stops
PAD_OVER_LEAP = 1.0
pad_gain = lu(music, *leap) - lu(pad, *flat) - 3.0
for _ in range(8):
    err = lu(music, *leap) + PAD_OVER_LEAP - lu(music + pad[:, :N] * db(pad_gain), *flat)
    if abs(err) < 0.05:
        break
    pad_gain += err
music += pad[:, :N] * db(pad_gain)
fade = int(0.5 * SR)
music[:, -fade:] *= np.linspace(1, 0, fade) ** 2
sfx[:, -fade:] *= np.linspace(1, 0, fade) ** 2
mix = music + sfx


def true_peak_db(x):
    return 20 * np.log10(np.max(np.abs(resample_poly(x, 4, 1, axis=1))) + 1e-12)


def bar_loudness(x, fa, fb):
    seg = x[:, fr(fa):fr(fb)].T
    w, hop = int(0.4 * SR), int(0.1 * SR)
    mom = max(meter.integrated_loudness(seg[j:j + w]) for j in range(0, len(seg) - w, hop))
    return dict(integrated=round(float(meter.integrated_loudness(seg)), 1), momentary_max=round(float(mom), 1))


def limit(x, ceil_db):
    sys.path.insert(0, os.path.join(ROOT, 'audio/ost'))
    from engine.mix import limiter_gain
    pad_ = int(0.05 * SR)
    xp = np.pad(x, ((0, 0), (pad_, pad_)))
    g = limiter_gain(xp, ceil_db)[pad_:pad_ + x.shape[1]]
    return x * g[None], float(20 * np.log10(g.min()))


# the level: page 1 (o0-o180, Ep1's plain week) is set to Ep1's own outro over the same frames (-15.29 LUFS, measured
# on out/ep01/outro/outro-b-v3.wav), so the credits and the verdict sit exactly where Ep1's did; the cast page is a
# quieter bed under reading, and the whole file's integrated level is reported beside it (Ep1's file: -16.02)
P1 = (0.0, 7.5)
TARGET_P1 = -15.29
raw_lufs = float(meter.integrated_loudness(mix.T))
gain = TARGET_P1 - lu(mix, *P1)
limited_db = 0.0
for _ in range(4):
    y = mix * db(gain)
    tp = true_peak_db(y)
    if tp > TP_CEIL:
        y, limited_db = limit(y, TP_CEIL - 0.15)
    err = TARGET_P1 - lu(y, *P1)
    if abs(err) < 0.05:
        break
    gain += err
mix = y
music_out = music * db(gain)
sfx_out = sfx * db(gain)
rep = dict(
    frames=N_FRAMES, seconds=N / SR, sample_rate=SR,
    music_file='<scratch>/music/e02-14-end-credits-album.wav (track.py)', vocal_pad='<scratch>/music/vocal-pad.wav (vocal.py)',
    vocal_pad_gain_db=round(pad_gain, 2), vocal_pad_vs_leap_lu=dict(flat_line=round(lu(music_out, *flat), 2), leap=round(lu(music_out, *leap), 2)),
    raw_lufs=round(raw_lufs, 2), gain_db=round(gain, 2), limiter_max_reduction_db=round(limited_db, 2),
    target=dict(page1_o0_180_lufs=TARGET_P1, measured_page1=round(lu(mix, *P1), 2), source='Ep1 outro-b-v3.wav o0-180'),
    page2_o180_345_lufs=round(lu(mix, 7.5, 14.375), 2), true_peak_ceiling_dbtp=TP_CEIL,
    mix_lufs=round(float(meter.integrated_loudness(mix.T)), 2), mix_true_peak_dbtp=round(true_peak_db(mix), 2),
    bars_mix_lufs={f'bar {k + 1}': bar_loudness(mix, 60 * k, min(OUT_F, 60 * (k + 1))) for k in range(6)},
    mix_shortterm_p95=round(float(np.percentile([meter.integrated_loudness(mix[:, j:j + fr(72)].T) for j in range(0, N - fr(72) + 1, fr(12))], 95)), 1),
    mix_momentary_max=round(float(max(meter.integrated_loudness(mix[:, j:j + int(0.4 * SR)].T) for j in range(0, N - int(0.4 * SR), int(0.1 * SR)))), 1),
    tail_rms_dbfs_last_100ms=round(float(20 * np.log10(np.sqrt(np.mean(mix[:, -int(0.1 * SR):] ** 2)) + 1e-12)), 1),
    sfx_true_peak_dbtp=round(true_peak_db(sfx_out), 2),
    events=EVENTS,
)
for name, x in (('-music', music_out), ('-sfx', sfx_out), ('', mix)):
    sf.write(os.path.join(OUT, f'{NAME}{name}.wav'), x.T.astype(np.float32), SR, subtype='PCM_24')
json.dump(rep, open(os.path.join(SC, 'mix-report.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in rep.items() if k != 'events'}, indent=1))
