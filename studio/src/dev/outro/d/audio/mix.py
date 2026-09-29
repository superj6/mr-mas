"""OUTRO D -- the lookdev mix: the temp music (track.py's album master) + the designed SFX, to exactly 12.250 s
(the 294-frame composition: 24 stand-in frames + o0-o269). LOOKDEV ONLY. Reads audio/ read-only; writes only to
out/lookdev/outro/d/ and the scratch folder.

  music   <scratch>/music/lookdev-outro-d-ep1-album.wav, first 0.25 s trimmed (the file's 2-beat pickup is 1.25 s)
  SFX (every sound has one owner: the music owns every pitch, the SFX own the interface and the moth)
    o30                    the title pops: audio/sfx/wav/tower_pop.wav (unpitched), -9 dB, centre
    o60 o90                the flat plates pop: tower_pop, -10 dB, left of centre (where they are)
    o105 o120 o135         the leap plates: audio/intro-sfx/src/tower_pop_rr.wav, -10 dB, panned up the curve
    o150                   the post box (and the title's one upgrade beside it): tower_pop_rr, -8 dB
    (d5: no folds: the human credits stay on the flat line to the out, so the two reversed pops are gone)
    o153-179               the moth's wings (synthesised: band-passed noise, 20 Hz wingbeat), about -40 dBFS RMS,
                           panned right (it comes in from the right, after the post box's light is up); two tiny
                           twitches at rest, o206 and o227
    o252-269               the server hum (audio/intro-sfx/src/server_hum_tuned.wav) under the lone caret, -30 dB,
                           as at the intro's f0
  loudness: the music is mastered at -16 LUFS by the engine; the mix is checked for <= -1 dBTP.

Run (repo root):  audio/.venv-theme/bin/python -B studio/src/dev/outro/d/audio/mix.py --scratch <scratch>
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
import argparse
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

sys.path.insert(0, os.path.join(REPO, 'audio/ost'))
from engine.mix import lufs, true_peak   # noqa: E402  (read-only import)

ROOT = REPO
OUT = f'{ROOT}/out/lookdev/outro/d'
SR = 48000
FPS = 24
PRE = 24
TOTAL = 294
N = TOTAL * SR // FPS          # 588000 samples = 12.250 s


def at(o):
    """outro frame -> sample index in the mix (comp frame = PRE + o)"""
    return int(round((PRE + o) * SR / FPS))


def load(p):
    x, sr = sf.read(p, always_2d=True, dtype='float32')
    assert sr == SR, (p, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x


def place(mix, x, i, gain_db=0.0, pan=0.0):
    g = 10 ** (gain_db / 20)
    lg, rg = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    n = min(len(x), len(mix) - i)
    if n <= 0:
        return
    mix[i:i + n, 0] += x[:n, 0] * g * lg
    mix[i:i + n, 1] += x[:n, 1] * g * rg


def wings(frames, seed):
    """a moth's wingbeat: soft band-passed noise, amplitude-modulated at ~20 Hz, 1/3 shaped; mono -> stereo"""
    rng = np.random.default_rng(seed)
    n = int(frames * SR / FPS)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    sos = butter(2, [1800, 5200], btype='band', fs=SR, output='sos')
    b = sosfilt(sos, noise)
    am = 0.5 * (1 + np.sin(2 * np.pi * 20.0 * t)) ** 2
    env = np.minimum(1, t / 0.06) * np.minimum(1, (t[-1] - t) / 0.12)
    y = b * am * env
    y /= np.abs(y).max() + 1e-9
    return np.stack([y, y], axis=1).astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--scratch', required=True)
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    mus = load(f'{a.scratch}/music/lookdev-outro-d-ep1-album.wav')
    mus = mus[int(0.25 * SR):]
    music = np.zeros((N, 2), np.float32)
    music[:min(N, len(mus))] = mus[:N]
    sfx = np.zeros((N, 2), np.float32)
    pop = load(f'{ROOT}/audio/sfx/wav/tower_pop.wav')
    pop_rr = load(f'{ROOT}/audio/intro-sfx/src/tower_pop_rr.wav')
    cues = []
    place(sfx, pop, at(30), -9, pan=0.0)
    cues.append(dict(o=30, sfx='tower_pop (the title)', db=-9))
    for o, pan in [(60, -0.55), (90, -0.2)]:
        place(sfx, pop, at(o), -10, pan=pan)
        cues.append(dict(o=o, sfx='tower_pop', db=-10))
    for k, o in enumerate([105, 120, 135]):
        place(sfx, pop_rr, at(o), -10, pan=-0.1 + 0.06 * k)
        cues.append(dict(o=o, sfx='tower_pop_rr', db=-10))
    place(sfx, pop_rr, at(150), -8, pan=0.2)
    cues.append(dict(o=150, sfx='tower_pop_rr (the post box)', db=-8))
    place(sfx, wings(27, 1), at(153), -22, pan=0.6)
    place(sfx, wings(3, 2), at(206), -26, pan=0.3)
    place(sfx, wings(3, 3), at(227), -26, pan=0.3)
    cues += [dict(o=153, sfx='moth wings (synth), in from the right', db=-22), dict(o=206, sfx='moth twitch', db=-26),
             dict(o=227, sfx='moth twitch', db=-26)]
    hum = load(f'{ROOT}/audio/intro-sfx/src/server_hum_tuned.wav')
    seg = hum[:N - at(252)].copy()
    ramp = np.minimum(1, np.arange(len(seg)) / (0.25 * SR))[:, None]
    tail = np.minimum(1, (len(seg) - np.arange(len(seg))) / (0.2 * SR))[:, None]
    place(sfx, (seg * ramp * tail).astype(np.float32), at(252), -30)
    cues.append(dict(o=252, sfx='server_hum_tuned (under the lone caret)', db=-30))
    mix = music + sfx
    tp = 20 * np.log10(true_peak(mix.T) + 1e-12)          # engine.mix.true_peak: linear, 4x oversampled
    if tp > -1.0:
        mix *= 10 ** ((-1.0 - tp) / 20)
        tp = -1.0
    out = f'{OUT}/outro-d-ep1-mix.wav'
    sf.write(out, mix, SR, subtype='PCM_24')
    sf.write(f'{OUT}/outro-d-ep1-music.wav', music, SR, subtype='PCM_24')
    rep = dict(file=os.path.relpath(out, ROOT), seconds=len(mix) / SR, music_lufs=round(float(lufs(music.T)), 2),
               mix_lufs=round(float(lufs(mix.T)), 2), mix_true_peak_dbtp=round(float(tp), 2), sfx=cues)
    json.dump(rep, open(f'{a.scratch}/mix-report.json', 'w'), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == '__main__':
    main()
