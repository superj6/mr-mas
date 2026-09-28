#!/usr/bin/env python3
"""Act Four S7.13: the first frame for Ttemme's stream-cam hourglass. Our edit of the image model's still.

The image model (gen4_image, h1) wouldn't empty the upper bulb. The lock says "the last grain runs out", and the pixel
hourglass before the insert has run out. So this edit (code, no model) runs the sand out:
- the upper bulb's sand is replaced by what empty glass shows there: each sand row takes one of the bulb's empty rows
  above it, squeezed to that row's glass width (the glass's own glints are kept);
- the falling thread of grains through the neck is painted out (a per-row interpolation across its columns).

  hg_still.py IN.png OUT.png [--neck 360]
"""
from __future__ import annotations

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

SRC_ROWS = (205, 245)   # the upper bulb's empty rows, above the sand


def main() -> None:
    src, out = sys.argv[1], sys.argv[2]
    neck = int(sys.argv[sys.argv.index("--neck") + 1]) if "--neck" in sys.argv else 360
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
    H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1)
    sat = (mx - a.min(-1)) / (mx + 1e-6)
    sand = (r > 0.55) & (sat > 0.55) & (g > 0.25) & (b < 0.3)
    # the upper bulb's sand: rows 240 .. neck, inside the glass (between the posts)
    box = np.zeros_like(sand)
    box[240:neck, 560:735] = True
    # every row from the sand's surface to the neck: the whole span between its outermost sand pixels (the sand fills
    # the glass there, so the span is the glass's interior), lit or shadowed
    loose = (r - b > 0.25) & (r > 0.3) & (sat > 0.45) & box
    top = next(y for y in range(240, neck) if (sand[y] & box[y]).sum() > 40)
    up = np.zeros_like(sand)
    for y in range(top - 3, neck):
        cols = np.nonzero(loose[y])[0]
        if len(cols) > 2:
            up[y, cols[0] - 2:cols[-1] + 3] = True
    up &= box
    # the fill: what the empty glass shows there. Each sand row takes an empty row of the same bulb (the rows just above
    # the sand, 205-245), squeezed into that row's own glass width: the refracted wall narrows with the bulb, as it does
    # in the lower bulb. The glass's own glints in the sand rows (white or cyan pixels) are kept.
    ys, xs = np.nonzero(up)
    fill = a.copy()
    rows = sorted(set(ys.tolist()))
    y_top = rows[0]
    xl0, xr0 = np.nonzero(up[y_top])[0][[0, -1]]
    for y in rows:
        cols = np.nonzero(up[y])[0]
        xl, xr = cols[0], cols[-1]
        ysrc = int(round(SRC_ROWS[0] + (y - y_top) / max(1, rows[-1] - y_top) * (SRC_ROWS[1] - SRC_ROWS[0])))
        u = (cols - xl) / max(1, xr - xl)
        xsrc = np.clip(np.round(xl0 + u * (xr0 - xl0)).astype(int), 0, W - 1)
        fill[y, cols] = a[ysrc, xsrc]
    rim = ((mx > 0.8) & (sat < 0.3)) | ((b > 0.6) & (g > 0.6) & (r < 0.5))   # white or cyan glints, never the sand
    up = up & ~ndimage.binary_dilation(rim, iterations=1)
    soft = ndimage.gaussian_filter(up.astype(np.float32), 1.5)[..., None]
    img = a * (1 - soft) + fill * soft
    # the thread: orange pixels in the centre columns from the upper bulb down to the heap
    thread = np.zeros_like(sand)
    band = (slice(250, 488), slice(628, 664))
    t = (img[band][..., 0] > 0.45) & (img[band][..., 0] - img[band][..., 2] > 0.25)
    thread[band] = ndimage.binary_dilation(t, iterations=2)
    for y in range(250, 488):
        cols = np.nonzero(thread[y])[0]
        if not len(cols):
            continue
        x0, x1 = cols.min() - 2, cols.max() + 2
        L, R = img[y, x0], img[y, x1]
        for x in range(x0 + 1, x1):
            u = (x - x0) / (x1 - x0)
            img[y, x] = L * (1 - u) + R * u
    Image.fromarray((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)).save(out)
    print(out, "sand px replaced", int(up.sum()), "thread px", int(thread.sum()))


if __name__ == "__main__":
    main()
