# MR. MAS — Ep2 v1 · act4 · sc 22: the ISS plate's brass, re-toned in 2D (the cleanup pass, 2026-10-11).
# The episode review: the brass plate on the cube is dark-gold letters on gold, so ISS barely reads at 1080p (22.02,
# 22.07). A Blender re-render is out of this pass's scope, so the plate is re-toned on the 3D stills themselves: inside
# the plate's own pixels (its connected brass region, found in each still; the mail slot's brass is left as it was), the
# face is walked up to polished brass and the engraving down to a dark burnt bronze, keeping the render's own shading
# (the bevel's light and shadow ride on the new face as a ratio) and its anti-aliasing (each pixel's brassiness weights
# the change). Nothing is drawn over the plate and nothing moves: its size and its perspective are the 3D's.
# Reads the art pass's and the insert pass's plates; writes <name>-brass.png beside the insert pass's plates (git-ignored),
# which act4/tools/iss22-insert.ts takes for the plates named here. Run (light, a few seconds):
#   audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/act4/tools/iss_brass.py
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), *[".."] * 7))
INS = os.path.join(ROOT, "out/ep02/v1/inserts/iss/plates")
ART = os.path.join(ROOT, "out/ep02/v1/art/iss/plates")
# every still the plate is in (22.01's tilt from the frame it enters, its close; 22.02-22.03; 22.07; 22.08; 22.09)
NAMES = ["plate", "wide", "mcu", "knock"] + [f"tilt_{i:02d}" for i in range(14, 28)]
# where to look for the plate in each still (x0, y0, x1, y1; frame px): the slot's brass and the lot's dry grass are
# outside it. The tilt's stills: the plate's column, any height (the tilt carries it up the frame). (22.09's `away`
# holds the cube too far off for its plate to be more than a few pixels; it is left as rendered.)
WIN = {"plate": (330, 100, 710, 265), "wide": (1290, 350, 1372, 388), "knock": (900, 324, 980, 360),
       "mcu": (888, 360, 948, 448)}
TILT_WIN = (1290, 300, 1385, 812)
FACE = np.array([218.0, 182.0, 104.0])     # polished brass, lit
CUT = np.array([52.0, 36.0, 16.0])         # the engraving's burnt bronze


def src_of(name):
    for d in (INS, ART):
        p = os.path.join(d, f"{name}.png")
        if os.path.exists(p):
            return p
    raise SystemExit(f"no plate {name}")


def retone(a, win):
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    x0, y0, x1, y1 = win
    inwin = np.zeros(R.shape, bool)
    inwin[y0:y1, x0:x1] = True
    # brassiness: warm (the grey wall, the sky and the lot are not); soft at its edge for the AA. In 22.07's grazing
    # light the face is a pale warm beige, so the bar is low, and the window keeps the wall out
    warm = np.clip(((R - B) - 8.0) / 26.0, 0, 1) * (R >= G) * (G >= B) * inwin
    core = warm > 0.5
    lab, n = ndimage.label(ndimage.binary_closing(core, iterations=2))
    if n == 0:
        return a, None
    sizes = ndimage.sum(core, lab, range(1, n + 1))
    pid = int(np.argmax(sizes)) + 1
    region = ndimage.binary_dilation(lab == pid, iterations=2) & inwin
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    m = region & core
    ym = np.percentile(Y[m], 70)                 # the face (the engraving is the darker part)
    yl = np.percentile(Y[m], 3)                  # the deepest engraving
    t = np.clip((Y - yl) / max(1.0, (ym * 0.93 - yl)), 0, 1)[..., None]
    shade = np.clip(Y / ym, 0.55, 1.2)[..., None]
    face = np.clip(FACE * shade, 0, 255)
    new = CUT * (1 - t) + face * t
    w = (warm * region)[..., None]
    out = a * (1 - w) + new * w
    ys, xs_ = np.nonzero(region)
    return out, (int(xs_.min()), int(ys.min()), int(xs_.max()), int(ys.max()))


def main():
    for name in NAMES:
        p = src_of(name)
        a = np.asarray(Image.open(p).convert("RGB")).astype(np.float64)
        out, box = retone(a, WIN.get(name, TILT_WIN))
        dst = os.path.join(INS, f"{name}-brass.png")
        Image.fromarray(np.clip(np.round(out), 0, 255).astype(np.uint8)).save(dst)
        print(f"{name}: {os.path.relpath(p, ROOT)} -> {os.path.relpath(dst, ROOT)}  plate {box}")


if __name__ == "__main__":
    sys.exit(main())
