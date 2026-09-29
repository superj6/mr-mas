"""Listening previews for the intro SFX spot (not deliverables). Writes audio/intro-sfx/preview/*.mp3.

  preview_V1+VO+SFX.mp3          V1 score (-1.5 dB, SCRIPT 9.6) + Mas VO scratch (am_michael, faded to end by f91) + SFX stem
  preview_V1+VO+SFX+BLIP.mp3     the same with the BLIP bus
  preview_V1+VO+SFX+EXTRAS.mp3   the same with the opt-in extras layer (script-cut items), for the A/B
  preview_SFX-solo.mp3           the SFX stem alone, +12 dB so it can be judged on its own
Judge SFX sync here; the balance of record is audio/intro-mix/ (VO -4 dB and the music rides live there).
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

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(REPO, 'audio')
sys.path.insert(0, os.path.join(AUDIO, "sfx", "scripts"))
from dsp import db, lufs_integrated, true_peak_db, write_mp3  # noqa: E402

SR, N, SPF = 48000, 1_440_000, 2000
OUT = os.path.join(HERE, "preview")
TMP = os.path.join(OUT, "_tmp.wav")


def rd(p):
    x, sr = sf.read(p, always_2d=True)
    assert sr == SR, p
    x = x[:, :2] if x.shape[1] > 1 else np.repeat(x, 2, axis=1)
    y = np.zeros((N, 2))
    y[:min(N, len(x))] = x[:N]
    return y


def main():
    os.makedirs(OUT, exist_ok=True)
    music = rd(os.path.join(AUDIO, "theme", "theme-V1-chipchamber.wav")) * db(-1.5)
    vo = rd(os.path.join(AUDIO, "vocals", "vo", "placed", "mas_coldopen_michael_at-f0.wav")) * db(-4.0)
    a, b = 89 * SPF, 92 * SPF                       # scratch fit: the take is faded to end by f91
    vo[a:b] *= np.linspace(1, 0, b - a)[:, None]
    vo[b:] = 0
    sfx = rd(os.path.join(HERE, "intro-sfx_stem.wav"))
    ext = rd(os.path.join(HERE, "intro-sfx_extras.wav"))
    blip = rd(os.path.join(HERE, "intro-blip_stem.wav"))
    mixes = {
        "preview_V1+VO+SFX": music + vo + sfx,
        "preview_V1+VO+SFX+BLIP": music + vo + sfx + blip,
        "preview_V1+VO+SFX+EXTRAS": music + vo + sfx + ext,
    }
    for name, x in mixes.items():
        g = -14.0 - lufs_integrated(x)
        g = min(g, -1.0 - true_peak_db(x))
        sf.write(TMP, np.clip(x * db(g), -1, 1).astype(np.float32), SR, subtype="PCM_24")
        write_mp3(TMP, os.path.join(OUT, name + ".mp3"), 256)
        print(name, "gain", round(g, 2))
    sf.write(TMP, np.clip(sfx * db(12), -1, 1).astype(np.float32), SR, subtype="PCM_24")
    write_mp3(TMP, os.path.join(OUT, "preview_SFX-solo.mp3"), 256)
    os.remove(TMP)


if __name__ == "__main__":
    main()
