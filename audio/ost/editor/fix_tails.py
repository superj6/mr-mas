"""Music editor's tail fixes (2026-09-25): two masters ended on a still-ringing note chopped by the engine's
30 ms end fade (the render buffer ran out before the felt had decayed).  Fix: a raised-cosine fade of >= 1 beat
into the file end (OST-BIBLE s6.6 item 3: a fade only into silence, >= 1 beat).  Applied identically to the
album master, the underscore master and every stem, so the stems still sum to the underscore master.
The originals are kept in render/_pre-editor/.  MP3s are re-encoded with the engine's ffmpeg settings.

    ../../.venv-theme/bin/python fix_tails.py
"""
import json
import os
import shutil
import subprocess
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.dirname(HERE)
FFDIR = '/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu'
SR = 48000

FIXES = [
    # (track folder, cue id, fade start s, why)
    ('mm11-the-return', 'mm11-the-return', 81.375,
     'the felt F4 (after "okay.") was still ringing at -30 dBFS (album) when the file ended; the 30 ms end fade '
     'chopped it. Now a 1.0 s raised-cosine fade 81.375 -> 82.375 s (album, underscore, every stem). On picture '
     'the editor still L-cuts it at the sc 31 change.'),
    ('mm01-water-line', 'mm01-water-line-05s', 5.0,
     'the 5 s cut-down ended on the pedalled open fifth held flat at -28 dBFS and chopped at 6.2 s by the 30 ms '
     'end fade. Now a 1.2 s raised-cosine fade 5.0 -> 6.2 s (album and underscore; the cut-downs carry no stems).'),
]


def mp3(wav, out, kbps=192):
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    subprocess.run([f'{FFDIR}/ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a',
                    f'{kbps}k', out], check=True, env=env)


def fade_file(p, t0, bak):
    info = sf.info(p)
    x, sr = sf.read(p, dtype='float64', always_2d=True)
    assert sr == SR
    n = len(x)
    i0 = int(round(t0 * SR))
    if i0 >= n:
        return None
    os.makedirs(bak, exist_ok=True)
    b = os.path.join(bak, os.path.basename(p))
    if not os.path.exists(b):
        shutil.copy2(p, b)
    else:                                   # re-running: always start from the original
        x, _ = sf.read(b, dtype='float64', always_2d=True)
    k = n - i0
    g = 0.5 * (1 + np.cos(np.pi * np.arange(k) / (k - 1)))
    x[i0:] *= g[:, None]
    x[-1] = 0.0
    sf.write(p, x, SR, subtype=info.subtype, format=info.format)
    return x


def main():
    for folder, cid, t0, why in FIXES:
        rdir = os.path.join(OST, 'tracks', folder, 'render')
        bak = os.path.join(rdir, '_pre-editor')
        cue_p = os.path.join(rdir, f'{cid}.cue.json')
        cue = json.load(open(cue_p))
        F = cue['files']
        base = os.path.join(OST, 'tracks', folder)
        done = []
        for role in ('album', 'underscore'):
            p = os.path.join(base, F[f'{role}_wav'])
            fade_file(p, t0, bak)
            if F.get(f'{role}_mp3'):
                mp3(p, os.path.join(base, F[f'{role}_mp3']))
            done.append(os.path.basename(p))
        stems = F.get('stems') or {}
        acc = None
        for fam, rel in stems.items():
            p = os.path.join(base, rel)
            x = fade_file(p, t0, os.path.join(bak, 'stems'))
            acc = x if acc is None else acc + x
            done.append(os.path.basename(p))
        if acc is not None:
            u, _ = sf.read(os.path.join(base, F['underscore_wav']), dtype='float64', always_2d=True)
            r = acc - u
            res = 20 * np.log10(np.sqrt((r ** 2).mean()) / np.sqrt((u ** 2).mean()) + 1e-15)
            print(f'{cid}: stems vs underscore residual {res:.1f} dB re master')
        cue.setdefault('editor', []).append(dict(date='2026-09-25', fix='end fade', fade_from_s=t0, files=done,
                                                 originals='render/_pre-editor/', why=why))
        with open(cue_p, 'w') as fh:
            json.dump(cue, fh, indent=1)
        print(f'{cid}: faded from {t0} s -> {len(done)} files; originals in {os.path.relpath(bak, OST)}')


if __name__ == '__main__':
    sys.exit(main())
