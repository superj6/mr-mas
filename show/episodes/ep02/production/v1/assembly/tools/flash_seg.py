#!/usr/bin/env python3
"""flash_seg.py - Ep2 v1 (a copy of Ep1's assembly tool, locked): the house flash measure (Ep2's copy of flashcheck.py,
imported) on any MP4, streamed frame by frame (160 x 90 area decode) so a long segment never sits in memory (Ep1's first
whole-film check held about 10 GB and was killed). Limit: 3 flashes in any 1 s, red included (LEARNINGS P15).
  audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py <file.mp4> [...]   -> one JSON line per file"""
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
import importlib.util
import json
import os
import subprocess
import sys

import numpy as np

ROOT = REPO
FFD = f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
_spec = importlib.util.spec_from_file_location("flashcheck", f"{ROOT}/studio/src/episodes/ep02/pixel/tools/flashcheck.py")
FC = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(FC)


def measure(path):
    W, H = 160, 90
    p = subprocess.Popen([f"{FFD}/ffmpeg", "-v", "error", "-i", path, "-map", "0:v", "-vf", f"scale={W}:{H}:flags=area", "-f", "image2pipe",
                          "-c:v", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, env={**os.environ, "LD_LIBRARY_PATH": FFD})
    Lb, Rb, mean = [], [], []
    while True:
        buf = p.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float64) / 255.0
        L = FC.lin(rgb) @ np.array([0.2126, 0.7152, 0.0722])
        Lb.append(FC.blocks(L[None])[0])
        s = rgb.sum(axis=2) + 1e-6
        Rb.append(FC.blocks(np.where(rgb[..., 0] / s >= 0.8, (rgb[..., 0] - rgb[..., 1] - rgb[..., 2]) * 320, 0.0)[None])[0])
        mean.append(L.mean())
    p.wait()
    ev = FC.frame_events(np.array(Lb), 0.10, 0.80)
    evr = FC.frame_events(np.array(Rb), 20.0, None)
    fl, at = FC.max_flashes(ev)
    flr, atr = FC.max_flashes(evr)
    dm = np.abs(np.diff(np.array(mean)))
    return {"file": os.path.relpath(path, ROOT), "frames": len(mean), "max_flashes_in_1s": fl, "at_frame": at, "red": flr,
            "transitions": len(ev), "largest_mean_luminance_step": [round(float(dm.max()), 3), int(dm.argmax()) + 1] if len(dm) else None,
            "limit": 3, "pass": fl <= 3 and flr <= 3}


if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(json.dumps(measure(f)), flush=True)
