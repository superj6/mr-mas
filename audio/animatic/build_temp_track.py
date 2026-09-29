"""MR. MAS intro: animatic TEMP TRACK (rough placeholder, clarity over polish).

Grid: 24 fps, 96 BPM, 15 frames/beat, 60 frames/bar, 12 bars, 720 frames = 30.000 s.
Output: 48 kHz stereo, exactly 1,440,000 samples.

Sources: studio/INTRO_PIXEL_BRIEF.md, show/intro/SCRIPT.md, show/intro/shot-table.md,
         audio/sfx/intro/sfx_intro_cues.json (frame cross-check).
Library files used: sfx/wav/collar_pop_Ab4.wav, collar_pop_C5.wav, bell_ding_F6.wav,
                    vocals/vo/mas_coldopen_michael.wav (cold-open VO, placed at f24).
Everything else is synthesized here.

Run: audio/.venv/bin/python build_temp_track.py
"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
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
import json, os, subprocess
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
import pedalboard as pb

SR = 48000
FPS = 24
FPB = 15                      # frames per beat
N_FRAMES = 720
N = N_FRAMES * SR // FPS      # 1,440,000 samples = 30.000 s
SPF = SR // FPS               # 2000 samples per frame

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(REPO, 'audio')
SFX = os.path.join(AUDIO, 'sfx', 'wav')
VO = os.path.join(AUDIO, 'vocals', 'vo', 'mas_coldopen_michael.wav')
FFDIR = os.path.join(REPO, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')

# v2.1: no "music fired" mute; bar 9 is the roll call (8 stabs)

rng = np.random.default_rng(1993)
mix = np.zeros((N, 2))
events = []


def f2s(f):
    return f / FPS


def db(x):
    return 10 ** (x / 20)


def place(sig, frame, gain_db=0.0, pan=0.0):
    """Add mono or stereo signal starting at a frame; pan -1..1 for mono."""
    s0 = int(round(frame * SPF))
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * np.sqrt(2), sig * r * np.sqrt(2)], 1)
    n = min(len(sig), N - s0)
    if n > 0:
        mix[s0:s0 + n] += sig[:n] * db(gain_db)


def log(frame, label, kind, source, end=None):
    e = dict(frame=frame, sec=round(f2s(frame), 4), label=label, kind=kind, source=source)
    if end is not None:
        e['endFrame'] = end; e['endSec'] = round(f2s(end + 1), 4)
    events.append(e)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)


def load(path):
    x, sr = sf.read(path, always_2d=True)
    assert sr == SR, (path, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, 1)
    return x[:, :2]


# ---------------------------------------------------------------- synth voices
def click(accent):
    t = t_axis(0.05 if accent else 0.03)
    f = 2400.0 if accent else 1600.0
    env = np.exp(-t / (0.012 if accent else 0.006))
    return np.sin(2 * np.pi * f * t) * env


def felt_piano(freq, dur=1.4):
    """Soft felt-piano-ish note: few inharmonic partials, rounded hammer, dark top."""
    t = t_axis(dur)
    B = 0.0004
    y = np.zeros_like(t)
    for k, a in enumerate([1.0, 0.35, 0.12, 0.05, 0.02], start=1):
        fk = freq * k * np.sqrt(1 + B * k * k)
        y += a * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-t * (2.2 + 1.6 * k))
    atk = np.clip(t / 0.006, 0, 1)
    thump = lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.008) * 0.25   # felt hammer
    y = (y * atk + thump)
    y = lp(y, 3200)
    return y / np.abs(y).max()


def drop_1993():
    """1-bit 'drop': square wave diving F4 -> F2 plus a sub thud. Reads as the era cut."""
    t = t_axis(0.55)
    f = 349.23 * (87.31 / 349.23) ** np.clip(t / 0.35, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sq = np.sign(np.sin(ph)) * np.exp(-t / 0.22) * 0.5
    sub_f = 70 * (38 / 70) ** np.clip(t / 0.25, 0, 1)
    sub = np.sin(2 * np.pi * np.cumsum(sub_f) / SR) * np.exp(-t / 0.18)
    y = lp(sq, 5000) + sub
    return y / np.abs(y).max()


def noise_sweep(frames=12):
    """Rising band-passed noise sweep, 300 Hz -> 9 kHz, exactly `frames` long, hard stop."""
    n = frames * SPF
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # sweep by chunked band-pass, filter state carried across chunks
    out = np.zeros(n)
    hop = 480
    z = np.zeros((2, 2))
    for i in range(0, n, hop):
        fc = 300 * (9000 / 300) ** (i / n)
        sos = butter(2, [fc * 0.7, min(fc * 1.4, SR / 2 - 100)], 'band', fs=SR, output='sos')
        out[i:i + hop], z = sosfilt(sos, x[i:i + hop], zi=z)
    env = np.clip(t / (n / SR), 0, 1) ** 1.5 * 0.9 + 0.1
    fade = np.ones(n); fade[-96:] = np.linspace(1, 0, 96)
    y = out * env * fade
    return y / np.abs(y).max()


def card_thump():
    """Short low thump for the name-card freezes: sine 110->45 Hz, ~0.25 s."""
    t = t_axis(0.3)
    f = 45 + 65 * np.exp(-t / 0.03)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    y += lp(rng.standard_normal(len(t)), 1200) * np.exp(-t / 0.004) * 0.3
    y[-240:] *= np.linspace(1, 0, 240)
    return y / np.abs(y).max()


def slam():
    """f510 slam: broadband crack + low body + short room smear. Distinct from the thumps."""
    t = t_axis(0.7)
    crack = hp(rng.standard_normal(len(t)), 400) * np.exp(-t / 0.035)
    body_f = 55 + 90 * np.exp(-t / 0.02)
    body = np.sin(2 * np.pi * np.cumsum(body_f) / SR) * np.exp(-t / 0.16) * 1.3
    smear = lp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.18) * 0.25
    y = crack * 0.8 + body + smear
    y[-480:] *= np.linspace(1, 0, 480)
    L = y; R = np.concatenate([np.zeros(24), y[:-24]])      # tiny width
    s = np.stack([L, R], 1)
    return s / np.abs(s).max()


def title_chord(dur=3.1):
    """Big low F-C open-fifth chord, no third: F1 C2 F2 C3 F3 C4, detuned saws, dark filter."""
    t = t_axis(dur)
    notes = [43.65, 65.41, 87.31, 130.81, 174.61, 261.63]
    amps = [1.0, 0.8, 0.8, 0.6, 0.45, 0.3]
    out = np.zeros((len(t), 2))
    for fq, a in zip(notes, amps):
        for ch, det in ((0, -0.004), (1, 0.004)):
            ph = (fq * (1 + det) * t + rng.uniform()) % 1.0
            saw = 2 * ph - 1
            out[:, ch] += a * saw
    for ch in range(2):
        out[:, ch] = lp(out[:, ch], 1400, 4)
    # low boom under it
    boom = np.sin(2 * np.pi * np.cumsum(43.65 + 40 * np.exp(-t / 0.04)) / SR) * np.exp(-t / 0.5)
    out += boom[:, None] * 1.2
    env = np.clip(t / 0.004, 0, 1) * np.exp(-t / 0.9)
    # fully released before the bell at f705 (3.125 s after f630)
    rel = np.clip((dur - t) / 0.4, 0, 1)
    out *= (env * rel)[:, None]
    return out / np.abs(out).max()


# ---------------------------------------------------------------- 1. beat clicks
for beat in range(N_FRAMES // FPB):          # 48 beats
    f = beat * FPB
    acc = (f % 60 == 0)
    place(click(acc), f, -14 if acc else -22)
log(0, 'Beat clicks: 48 beats every 15 f (accent on bar downbeats f0, f60 ... f660)', 'click', 'synth')

# ---------------------------------------------------------------- 2. cold-open felt piano F5
for f in (0, 15, 30, 45):
    place(felt_piano(698.46), f, -9, pan=-0.1)
    log(f, 'Cold open: felt-piano F5', 'note', 'synth')

# ---------------------------------------------------------------- 3. VO
if os.path.exists(VO):
    place(load(VO), 24, -2.0)
    log(24, 'VO: Mas, "near the singularity; unclear which side." (take: michael; '
            '"near" f25, pause f58-71, "unclear" f72, "side" f86-94)', 'vo',
        os.path.relpath(VO, AUDIO))

# ---------------------------------------------------------------- 4. 1993 drop
place(drop_1993(), 120, -5)
log(120, '1993 drop: cut to 1-bit (square dive F4 to F2 + sub)', 'hit', 'synth')

# ---------------------------------------------------------------- 5. render-front sweep f168-179
place(noise_sweep(12), 168, -9)
log(168, 'Render-front sweep: rising noise, 1-bit to early-web palette', 'sweep', 'synth', end=179)

# ---------------------------------------------------------------- 6. collar pops
place(load(os.path.join(SFX, 'collar_pop_Ab4.wav')), 180, -3, )
log(180, 'Collar pop 1 (Ab4)', 'hit', 'sfx/wav/collar_pop_Ab4.wav')
place(load(os.path.join(SFX, 'collar_pop_C5.wav')), 187, -3)
log(187, 'Collar pop 2 (C5)', 'hit', 'sfx/wav/collar_pop_C5.wav')

# ---------------------------------------------------------------- 7. name-card thumps
for f, who in ((240, 'GERG MOCKBRAN / ORG CHART: HIM.'), (300, 'ALYI / FEELS THE AGI.'),
               (360, 'MARIO / HAS CONCERNS. HAS GPUS.'), (420, 'NOLE / NAMED IT.')):
    place(card_thump(), f, -3)
    log(f, 'Name-card freeze thump: ' + who, 'hit', 'synth')

# ---------------------------------------------------------------- 8. roll call f480-539 (brief v2.1)
# 8 portrait flashes on eighth notes playing the knee motif F F F F G Ab C F:
# brass-ish saw stab doubled by a chip square (temp placeholder for the real score).
ROLL = [(480, 349.23, 'TASYA'), (487, 349.23, 'RADNUS'), (495, 349.23, 'KRAM'), (502, 349.23, 'NESNEJ'),
        (510, 392.00, 'RIMA TAMURI'), (517, 415.30, 'THE WHALE'), (525, 523.25, 'RUMPT (silhouette)'),
        (532, 698.46, 'cursor (GLYPH)')]


def roll_stab(freq, dur=0.26):
    t = np.arange(int(dur * SR)) / SR
    saw = 2 * ((t * freq) % 1.0) - 1
    saw2 = 2 * ((t * freq * 1.004) % 1.0) - 1
    sq = np.sign(np.sin(2 * np.pi * freq * 2 * t)) * 0.35
    env = np.clip(t / 0.006, 0, 1) * np.exp(-t / 0.11)
    sos = butter(2, min(0.45 * SR, freq * 6) / (SR / 2), 'low', output='sos')
    brass = sosfilt(sos, (saw + saw2) * 0.5)
    out = (brass * 0.8 + sq * np.exp(-t / 0.06)) * env
    return out / np.abs(out).max()


for i, (f, hz, who) in enumerate(ROLL):
    place(roll_stab(hz), f, -6 + (i >= 4) * 1.5, pan=(-0.25 if i % 2 else 0.25))
    log(f, f'Roll call flash {i + 1}: {who} (stab {"FFFFGAbCF"[0] if i < 4 else ["G", "Ab", "C", "F8va"][i - 4]})', 'hit', 'synth')

# ---------------------------------------------------------------- 9. title hit f630
place(title_chord(), 630, -4)
log(630, 'Title hit: MR. MAS, big low F-C chord, no third (F1 C2 F2 C3 F3 C4)', 'hit', 'synth')

# ---------------------------------------------------------------- 10. bell F6 f705
place(load(os.path.join(SFX, 'bell_ding_F6.wav')), 705, -3)
log(705, 'Bell ding F6 (post notification, Orb iris glyph)', 'hit', 'sfx/wav/bell_ding_F6.wav')

# ---------------------------------------------------------------- master
pk = np.abs(mix).max()
mix *= db(-3.0) / pk
board = pb.Pedalboard([pb.Limiter(threshold_db=-1.5, release_ms=80)])
mix = board(mix.T.astype(np.float32), SR).T.astype(np.float64)
mix = np.clip(mix, -db(-1.0), db(-1.0))

# 10 ms fade at the very end so the 30.000 s cut does not click
mix[-480:] *= np.linspace(1, 0, 480)[:, None]

assert mix.shape == (N, 2)
wav = os.path.join(HERE, 'temp-track.wav')
mp3 = os.path.join(HERE, 'temp-track.mp3')
sf.write(wav, mix.astype(np.float32), SR, subtype='PCM_24')

env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
subprocess.run([os.path.join(FFDIR, 'ffmpeg'), '-y', '-hide_banner', '-loglevel', 'error',
                '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3], check=True, env=env)

events.sort(key=lambda e: (e['frame'], e['kind']))
with open(os.path.join(HERE, 'temp-track_events.json'), 'w') as fh:
    json.dump(dict(fps=FPS, bpm=96, framesPerBeat=FPB, frames=N_FRAMES, sampleRate=SR,
                   samples=N, durationSec=N / SR, rollCall=[r[0] for r in ROLL],
                   events=events), fh, indent=1)
print('wrote', wav, mp3)
for e in events:
    print(f"f{e['frame']:>3}  {e['sec']:7.3f}s  {e['label']}")
