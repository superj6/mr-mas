"""OUTRO E · the lookdev mix: the temp music (tools/track.py) + the designed sound, cut to the mock-up's frames.
LOOKDEV ONLY. Reads the OST render (scratch) and the shared SFX library (read-only); writes only to out/lookdev/outro/e/.
POLISH PASS: 3-bar outro, the click on 3.3 (o150).
POLISH PASS 2: Ep1's moth in with the click (o150), landed on 3.4 (o165), then a still frame to o195 (4.2).
Writes two mixes: the Ep1 mock-up (220 frames, with the moth) and a plain week (204 frames, no moth, faded by o179).

  m0-23    the stand-in (1.0 s): the music's button tail + `server_hum` (the Ep1 button ends "CUT TO BLACK on the
           hum"), cut with a 40 ms fade on the cut to the file (the file is not in the room)
  o0-149   the music alone (the knee whole, the button chord, the settle, the bass re-strike). The pointer's travel
           is silent: a mouse move has no sound, and the score owns this bar
  o150     `post_click` (SFX owns the click; the music's felt F5 + chip glint land with it)
  o150-164 Ep1: the moth, a designed wing flutter (band-passed noise, 12 soft strokes a second, panned with its
           flight from frame-right to the period). It stops dead on the landing (o165 = 3.4)
  o165     one tiny wing settle (the landing), then nothing but the F5's decay under the still frame, out on o195

Run (repo root), after track.py:
  audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/mix.py <scratch>/music out/lookdev/outro/e
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
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

sys.path.insert(0, os.path.join(REPO, 'audio/ost'))
from engine.mix import lufs, true_peak   # noqa: E402

SR = 48000
FPS = 24
PRE = 24                    # frames of stand-in before o0 (timeline.ts PRE)
TOTAL = 220                 # timeline.ts TOTAL (the Ep1 mock-up)
TOTAL_PLAIN = 204           # timeline.ts TOTAL_PLAIN (a week with no stinger)
CLICK = 150                 # timeline.ts EV.click (3.3)
PLAIN_END = 179             # timeline.ts OUTRO - 1
TRIM_S = 0.25               # track.py TRIM_S: the file's first 0.25 s are dropped (1.0 s of stand-in remain)
SFX = os.path.join(REPO, 'audio/sfx/wav')

# the moth's flight, outro frames -> native x (moth.ts WAY, for the pan only; LAND x = 448)
MOTH_ENTER, MOTH_LAND = 150, 165
MOTH_X = [(146, 526), (150, 494), (153, 432), (157, 394), (160, 408), (162, 434), (164, 446), (165, 448)]
LAND_X = 448
SETTLES = (MOTH_LAND,)      # one soft settle on the landing; nothing after it


def fr(o):
    """sample index of outro frame o (o0 = the cut to the file)"""
    return int(round((o + PRE) / FPS * SR))


def db(x):
    return 10 ** (x / 20)


def tp_db(x):
    """true peak in dBTP (the engine's true_peak() returns a linear value)"""
    return float(20 * np.log10(true_peak(x) + 1e-12))


def place(bus, x, at, gain_db=0.0):
    n = min(len(x), len(bus) - at)
    if n > 0:
        bus[at:at + n] += x[:n] * db(gain_db)


def moth_flutter(rng):
    """soft wing beats: band-passed noise, one beat per 2-frame drawing (12 Hz), panned with the flight"""
    n0, n1 = fr(MOTH_ENTER), fr(MOTH_LAND)
    n = n1 - n0
    noise = rng.standard_normal(n)
    sos = butter(2, [260, 2200], btype='band', fs=SR, output='sos')
    body = sosfilt(sos, noise)
    t = np.arange(n) / SR
    beat = 0.5 - 0.5 * np.cos(2 * np.pi * 12.0 * t)            # 12 Hz: a stroke per drawing
    beat = beat ** 3                                           # short, papery strokes
    jitter = 1.0 + 0.35 * np.interp(t, np.linspace(0, t[-1], 24), rng.uniform(-1, 1, 24))
    env = np.minimum(1.0, t / 0.25) * np.minimum(1.0, (t[-1] - t) / 0.12)   # in over 0.25 s, gone by the landing
    x = body * beat * jitter * env
    # pan: x = 480 -> hard right, 240 -> centre (equal power)
    frames = np.arange(n) / SR * FPS + MOTH_ENTER
    px = np.interp(frames, [p[0] for p in MOTH_X], [p[1] for p in MOTH_X])
    pan = np.clip((px - 240) / 240, -1, 1)                     # 0 centre .. 1 right
    th = (pan + 1) * np.pi / 4
    st = np.stack([x * np.cos(th), x * np.sin(th)], axis=1)
    return st / (np.abs(st).max() + 1e-12), n0


def settle_ticks(rng):
    """one tiny wing settle on the landing (polish pass 2: the moth is still from o165)"""
    out = []
    sos = butter(2, [400, 2600], btype='band', fs=SR, output='sos')
    for o in SETTLES:
        n = int(0.07 * SR)
        x = sosfilt(sos, rng.standard_normal(n)) * np.exp(-np.arange(n) / (0.018 * SR))
        x = x / (np.abs(x).max() + 1e-12)
        pan = (LAND_X - 240) / 240
        th = (pan + 1) * np.pi / 4
        out.append((np.stack([x * np.cos(th), x * np.sin(th)], axis=1), fr(o)))
    return out


def build_mix(music_full, n_total, sting, rng):
    """the music cut to n_total samples + the designed sound; `sting` adds Ep1's moth, else the plain-week fade"""
    music = np.pad(music_full, ((0, max(0, n_total - len(music_full))), (0, 0)))[:n_total].copy()
    if not sting:
        # a plain week: the F5 fades from o167 to zero by the end of o179 (the outro's last frame)
        a, b = fr(PLAIN_END - 12), n_total
        music[a:b] *= np.linspace(1, 0, b - a)[:, None] ** 1.5
    k = int(0.030 * SR)                                        # 30 ms fade at the very end
    music[-k:] *= np.linspace(1, 0, k)[:, None]

    sfx = np.zeros((n_total, 2))
    # the stand-in's hum, cut with the picture
    hum, _ = sf.read(os.path.join(SFX, 'server_hum.wav'), always_2d=True)
    h = hum[:fr(0)].copy()
    f_in, f_out = int(0.12 * SR), int(0.04 * SR)
    h[:f_in] *= np.linspace(0, 1, f_in)[:, None]
    h[-f_out:] *= np.linspace(1, 0, f_out)[:, None]
    place(sfx, h, 0, -24.0)
    # the click, on 3.3
    click, _ = sf.read(os.path.join(SFX, 'post_click.wav'), always_2d=True)
    place(sfx, click, fr(CLICK), -4.0)
    if sting:
        # the moth: audible on a laptop (the cold read measured the old one at -48 dBFS and "nobody will hear" it),
        # still soft: it sits about 12 dB under the knee's loudness
        fl, at = moth_flutter(rng)
        place(sfx, fl, at, -13.0)
        for x, at in settle_ticks(rng):
            place(sfx, x, at, -20.0)
    return music, music + sfx


def main(music_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    music_full, sr = sf.read(os.path.join(music_dir, 'lookdev-outro-e-ep1-album.wav'), always_2d=True)
    assert sr == SR, sr
    music_full = music_full[int(round(TRIM_S * SR)):]
    base = 'outro-e-ep1'
    for name, frames, sting in ((base, TOTAL, True), ('outro-e-plain', TOTAL_PLAIN, False)):
        rng = np.random.default_rng(1227)
        music, mix = build_mix(music_full, int(round(frames / FPS * SR)), sting, rng)
        tp = tp_db(mix)
        if tp > -1.0:
            mix *= db(-1.0 - tp)
        if sting:
            sf.write(os.path.join(out_dir, f'{name}-music-temp.wav'), music.astype(np.float32), SR, subtype='PCM_24')
        sf.write(os.path.join(out_dir, f'{name}-mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
        w = lambda o0, o1: mix[fr(o0):fr(o1)]   # noqa: E731
        rms = lambda x: round(float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)), 1)   # noqa: E731
        rep = dict(
            name=name, seconds=round(len(mix) / SR, 4), frames=round(len(mix) / SR * FPS, 3),
            music_lufs=round(float(lufs(music)), 2), mix_lufs=round(float(lufs(mix)), 2),
            mix_true_peak_dbtp=round(tp_db(mix), 2),
            rms_dbfs_file_o0_149=rms(w(0, 150)), rms_dbfs_after_click=rms(w(CLICK, frames - PRE)),
            tail_dbfs_last_100ms=round(float(20 * np.log10(np.abs(mix[-int(0.1 * SR):]).max() + 1e-12)), 1),
        )
        if sting:
            rep['rms_dbfs_moth_flight_o150_164'] = rms(w(MOTH_ENTER, MOTH_LAND))
            rep['rms_dbfs_landed_o165_195'] = rms(w(MOTH_LAND, frames - PRE))
            rep['rms_dbfs_still_o170_195'] = rms(w(MOTH_LAND + 5, frames - PRE))
        print(rep)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
