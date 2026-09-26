"""MR. MAS - style-jump prototype 1 (J1 "CANCELLED"): the temp sound pass, to the brief (style-jumps.md §3.4, §5.1).

Picture leaves the grid; sound leaves the chip. J1 sits inside D6, so the jump SUBTRACTS: nothing plays inside it.

  p  0-59   (0.000-2.500 s)  the room under the arrow: the laptop fan (room_tone), the Strip through the glass
                             (neon_buzz, far), the crane truck idling twelve floors down (TEMP: synthesized rumble,
                             no library asset yet), and the score -- LEVERAGE, low (E01-S26 underscore, bar 7, the
                             2.5 s before its own composed hard stop on 8.1)
  p 60      (2.500 s)        THE CLICK (dialog_ok_click, as the script names it). D6: everything stops with it
  p 61-143  (2.5-6.0 s)      digital zero. No sting, no whoosh, no stamp on the perforation (bible §3.4 / §5.1
                             "Must not"), no tone, no breath. The CU plays in the same silence, as locked.

Run with the audio mix venv (numpy + soundfile):
  ../audio/.venv-mix/bin/python src/dev/jumps/proto1/tools/sound.py <out.wav>
"""
import os
import sys

import numpy as np
import soundfile as sf

SR = 48000
FPS = 24
CLIP_F = 144
CLICK_F = 60
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))  # the project root
SFX = os.path.join(ROOT, 'audio', 'sfx', 'wav')
SCORE = os.path.join(ROOT, 'audio', 'ost', 'tracks', 'e01-s26-the-falling-tile', 'render',
                     'e01-s26-the-falling-tile-underscore.wav')
SCORE_AT = 15.0  # bar 7.1 of the cue; its composed hard stop (8.1 = the click) lands at 17.5 = clip 2.5 s

N = int(CLIP_F / FPS * SR)
CLICK = int(CLICK_F / FPS * SR)


def db(g):
    return 10 ** (g / 20)


def load(path):
    x, sr = sf.read(path, always_2d=True)
    assert sr == SR, (path, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x[:, :2]


def loop_to(x, n):
    reps = int(np.ceil(n / len(x)))
    return np.tile(x, (reps, 1))[:n]


def truck_rumble(n, seed=26):
    """TEMP: a diesel idling far below (brown noise, low-passed, with a slow firing pulse). Deterministic."""
    rng = np.random.default_rng(seed)
    w = rng.standard_normal(n + SR)
    brown = np.cumsum(w)
    brown -= np.convolve(brown, np.ones(4801) / 4801, mode='same')  # remove drift (high-pass ~10 Hz)
    # one-pole low-pass at ~110 Hz, twice
    a = np.exp(-2 * np.pi * 110 / SR)
    y = brown
    for _ in range(2):
        out = np.empty_like(y)
        acc = 0.0
        for i in range(0, len(y), 4096):  # vectorised per block via lfilter-like recursion is overkill here
            seg = y[i:i + 4096]
            o = np.empty_like(seg)
            for j, v in enumerate(seg):
                acc = (1 - a) * v + a * acc
                o[j] = acc
            out[i:i + 4096] = o
        y = out
    y = y[SR:SR + n]
    t = np.arange(n) / SR
    pulse = 0.72 + 0.28 * np.sin(2 * np.pi * 13.5 * t) ** 2  # idle firing, ~800 rpm
    y = y * pulse
    y /= np.sqrt(np.mean(y ** 2)) + 1e-12
    st = np.stack([y, np.roll(y, 37)], axis=1)  # a touch of width
    return st


def main(out):
    mix = np.zeros((N, 2))
    pre = CLICK  # everything in the room stops on the click
    fade = int(0.002 * SR)  # 2 ms: a hard stop without a DC click

    score = load(SCORE)[int(SCORE_AT * SR):int(SCORE_AT * SR) + N]
    score = np.pad(score, ((0, N - len(score)), (0, 0)))
    mix[:pre] += score[:pre] * db(-6)  # LEVERAGE, low

    mix[:pre] += loop_to(load(os.path.join(SFX, 'room_tone.wav')), pre) * db(-22)  # the laptop fan / the suite's air
    mix[:pre] += loop_to(load(os.path.join(SFX, 'neon_buzz.wav')), pre) * db(-28)  # the Strip, through the glass
    mix[:pre] += truck_rumble(pre) * db(-38)  # the crane truck below (TEMP)

    # 0.5 s fade-in at the head so the clip doesn't open on a cut into the bed
    head = int(0.5 * SR)
    mix[:head] *= np.linspace(0, 1, head)[:, None]
    mix[pre - fade:pre] *= np.linspace(1, 0, fade)[:, None]
    mix[pre:] = 0.0

    click = load(os.path.join(SFX, 'dialog_ok_click.wav')) * db(-8)
    end = min(N, CLICK + len(click))
    mix[CLICK:end] += click[:end - CLICK]

    # D6: digital zero after the click's own tail
    mix[end:] = 0.0
    peak = np.abs(mix).max()
    if peak > db(-1):
        mix *= db(-1) / peak
    sf.write(out, mix.astype(np.float32), SR, subtype='PCM_24')
    print(f'wrote {out}: {N / SR:.3f} s, peak {20 * np.log10(np.abs(mix).max() + 1e-12):.1f} dBFS, '
          f'silence from {end / SR:.3f} s')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'proto1-sound.wav')
