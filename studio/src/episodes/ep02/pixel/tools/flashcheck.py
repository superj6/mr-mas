#!/usr/bin/env python3
"""flashcheck.py - MR. MAS Ep1 v3 pixel shots (the v3-shots-coldopen-tag pass): a photosensitivity measurement of a
rendered picture, in the spirit of the WCAG 2.x / Harding "general flash" and "red flash" thresholds. It is a measurement
tool, not a certified analyser (PEAT or Harding FPA would be the legal check before broadcast).

Method (per frame of the MP4, decoded by the studio's bundled ffmpeg to 160 x 90 RGB):
  - relative luminance per pixel (sRGB -> linear, Rec.709 weights), averaged in a 16 x 9 grid of blocks;
  - per block, the luminance series is split into monotonic runs; a run is a TRANSITION when it changes by >= 0.10 and
    its darker end is < 0.80 (the WCAG rule), stamped at the frame it completes;
  - a frame-level transition is counted when blocks covering >= 25 % of the frame complete a transition in the same
    direction within 2 frames of each other (the "25 % of the screen" area rule);
  - a FLASH is a pair of opposing frame-level transitions; the result is the most flashes inside any 24-frame (1 s)
    window (the limit is 3);
  - red: the same count on the saturated-red measure (R / (R + G + B) >= 0.8, change of (R - G - B) * 320 >= 20).
Also printed: the largest single-frame change of the mean luminance, and the frames of every transition.

  audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/flashcheck.py out/ep02/v1/picture/coldopen.mp4
"""
from __future__ import annotations
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

import io
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

FFDIR = f"{REPO}/studio/node_modules/@remotion/compositor-linux-x64-gnu"
W, H, GX, GY = 160, 90, 16, 9


def frames(path: str) -> np.ndarray:
    env = {**os.environ, "LD_LIBRARY_PATH": FFDIR}
    # the bundled ffmpeg has no rawvideo muxer: a PNG pipe, split on the PNG signature
    raw = subprocess.run([f"{FFDIR}/ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}:flags=area", "-f", "image2pipe", "-c:v", "png", "-pix_fmt", "rgb24", "-"],
                         check=True, capture_output=True, env=env).stdout
    sig = b"\x89PNG\r\n\x1a\n"
    parts = [sig + x for x in raw.split(sig)[1:]]
    return np.stack([np.asarray(Image.open(io.BytesIO(x)).convert("RGB")) for x in parts]).astype(np.float64) / 255.0


def lin(c: np.ndarray) -> np.ndarray:
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def blocks(v: np.ndarray) -> np.ndarray:
    n = v.shape[0]
    return v.reshape(n, GY, H // GY, GX, W // GX).mean(axis=(2, 4)).reshape(n, GY * GX)


def transitions(series: np.ndarray, thresh: float, dark_max: float | None) -> list[tuple[int, int]]:
    """[(end frame, +1/-1)] for one block's series"""
    out, n = [], len(series)
    i = 0
    while i < n - 1:
        j = i
        d = np.sign(series[i + 1] - series[i])
        if d == 0:
            i += 1
            continue
        last = i
        while j + 1 < n and np.sign(series[j + 1] - series[j]) in (d, 0):
            j += 1
            if series[j] != series[j - 1]:
                last = j
        a, b = series[i], series[j]
        if abs(b - a) >= thresh and (dark_max is None or min(a, b) < dark_max):
            out.append((last, int(d)))
        i = j
    return out


def frame_events(B: np.ndarray, thresh: float, dark_max: float | None, area: float = 0.25, slop: int = 2) -> list[tuple[int, int]]:
    n, nb = B.shape
    hits = np.zeros((n, 2))
    for k in range(nb):
        for f, d in transitions(B[:, k], thresh, dark_max):
            hits[f, 0 if d > 0 else 1] += 1
    ev = []
    for f in range(n):
        for c, d in ((0, 1), (1, -1)):
            w = hits[max(0, f - slop): f + slop + 1, c].sum()
            if hits[f, c] and w / nb >= area and not (ev and ev[-1][1] == d and f - ev[-1][0] <= slop):
                ev.append((f, d))
    return ev


def max_flashes(ev: list[tuple[int, int]], win: int = 24) -> tuple[int, int]:
    best, at = 0, -1
    for i, (f0, _) in enumerate(ev):
        inside = [e for e in ev[i:] if e[0] < f0 + win]
        flips = sum(1 for a, b in zip(inside, inside[1:]) if a[1] != b[1])
        fl = (flips + 1) // 2
        if fl > best:
            best, at = fl, f0
    return best, at


def main(path: str) -> None:
    rgb = frames(path)
    L = lin(rgb) @ np.array([0.2126, 0.7152, 0.0722])
    B = blocks(L)
    ev = frame_events(B, 0.10, 0.80)
    s = rgb.sum(axis=3) + 1e-6
    red = np.where(rgb[..., 0] / s >= 0.8, (rgb[..., 0] - rgb[..., 1] - rgb[..., 2]) * 320, 0.0)
    R = blocks(red)
    evr = frame_events(R, 20.0, None)
    fl, at = max_flashes(ev)
    flr, atr = max_flashes(evr)
    mean = L.mean(axis=(1, 2))
    dm = np.abs(np.diff(mean))
    rep = {"file": os.path.relpath(path, REPO), "frames": int(L.shape[0]),
           "general": {"max_flashes_in_1s": fl, "window_start_frame": at, "transitions": ev},
           "red": {"max_flashes_in_1s": flr, "window_start_frame": atr, "transitions": evr},
           "largest_mean_luminance_step": {"delta": round(float(dm.max()), 3), "frame": int(dm.argmax()) + 1},
           "limit": 3, "pass": fl <= 3 and flr <= 3}
    print(json.dumps(rep))


if __name__ == "__main__":
    main(sys.argv[1])
