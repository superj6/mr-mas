#!/usr/bin/env python3
"""scene_cut.py - Ep2 v1 (new): ONE SCENE as a file to watch, with its sound, cut from what the act is made of: the
scene's own picture from the per-scene cache (studio/src/episodes/ep02/pixel/tools/render.ts `scenes`: its index names
the file and the scene's act frames) and the same samples of the act's final mix (out/ep02/v1/mix/<seg>-mix.wav,
frames x 2000), muxed with no picture re-encode (-c:v copy, libfdk_aac). Nothing is rendered or mixed here.

  audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/scene_cut.py <seg> <scene> [<scene> ...]
  audio/.venv-casting/bin/python .../scene_cut.py <seg> --all              every scene of the act
      [--mix out/ep02/v1/mix-kokoro/<seg>-mix.wav]  another mix; [--pad S]  S seconds of the act either side (the picture
      then comes from out/ep02/v1/picture/<seg>.mp4, cut on keyframes, so the pad is approximate; the sound is exact)
  -> out/ep02/v1/review/scenes/<seg>-sc-<slug>.mp4 (git-ignored)
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

import soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))
FFD = os.path.join(ROOT, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
ENV = {**os.environ, 'LD_LIBRARY_PATH': FFD}
SR, SPF = 48000, 2000


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument('seg')
    ap.add_argument('scenes', nargs='*')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--mix', default=None)
    ap.add_argument('--pad', type=float, default=0.0)
    a = ap.parse_args(argv)
    idx_p = os.path.join(ROOT, f'out/ep02/v1/scenes/{a.seg}/index.json')
    if not os.path.exists(idx_p):
        raise SystemExit(f'no {os.path.relpath(idx_p, ROOT)}: render the act\'s scenes first (render.ts scenes)')
    idx = json.load(open(idx_p))
    mix = os.path.abspath(a.mix) if a.mix else os.path.join(ROOT, f'out/ep02/v1/mix/{a.seg}-mix.wav')
    if not os.path.exists(mix):
        raise SystemExit(f'no mix at {os.path.relpath(mix, ROOT)} (audio/reel/ep02-v1/mix_episode.py {a.seg})')
    info = sf.info(mix)
    if info.frames != idx['frames'] * SPF:
        raise SystemExit(f'the mix is {info.frames} samples, the act {idx["frames"]} frames: they are not the same cut')
    want = [s['id'] for s in idx['scenes']] if a.all else a.scenes
    outd = os.path.join(ROOT, 'out/ep02/v1/review/scenes')
    os.makedirs(outd, exist_ok=True)
    for sid in want:
        sc = next((s for s in idx['scenes'] if s['id'] == sid), None)
        if sc is None:
            raise SystemExit(f'no scene {sid} in {a.seg} (scenes: {" ".join(s["id"] for s in idx["scenes"])})')
        pad = int(round(a.pad * 24))
        f0, f1 = max(0, sc['s'] - pad), min(idx['frames'], sc['e'] + pad)
        y, _ = sf.read(mix, start=f0 * SPF, stop=f1 * SPF, dtype='float32', always_2d=True)
        wav = os.path.join(outd, f'.{a.seg}-{sc["slug"]}.wav')
        sf.write(wav, y, SR, subtype='PCM_24')
        out = os.path.join(outd, f'{a.seg}-sc-{sc["slug"]}.mp4')
        if pad:
            pic = ['-ss', f'{f0 / 24:.6f}', '-t', f'{(f1 - f0) / 24:.6f}', '-i', os.path.join(ROOT, f'out/ep02/v1/picture/{a.seg}.mp4')]
        else:
            pic = ['-i', os.path.join(ROOT, sc['file'])]
        subprocess.run([f'{FFD}/ffmpeg', '-v', 'error', '-y', *pic, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                        '-c:a', 'libfdk_aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', out], check=True, env=ENV)
        os.remove(wav)
        print(f'{a.seg} scene {sid}: act frames {f0}-{f1} ({(f1 - f0) / 24:.2f} s) -> {os.path.relpath(out, ROOT)}')


if __name__ == '__main__':
    main(sys.argv[1:])
