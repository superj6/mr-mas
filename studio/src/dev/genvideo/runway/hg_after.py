#!/usr/bin/env python3
"""Act Four S7.13: the last keyframe for the hourglass take (the aftermath), built in code from our first frame.

The image model wouldn't draw the frame without its glass (h3 kept the bulbs). So this builds it, with the camera
exactly locked (the same pixels as the first frame outside the hourglass):
- the two glass bulbs are removed (a hand-measured half-width profile around the centre line) and what was behind them
  is filled in: the wall and the LED strip from the same rows further right, the base's top face from its left edge;
- the back post, seen through the glass before, is drawn solid (the front-right post's texture, narrower, a stop down);
- the sand lies in a low heap on the base where the lower bulb was (its own texture, lit from the left);
- the front posts are restored over it;
- the shards on the desk are take 1's own (h2 f070: the pixels that are new, bright and colourless against the first
  frame, outside the base), so they fell where the model threw them.

  hg_after.py FIRST.png TAKE1.mp4 OUT.png [--shards-from 70]
"""
from __future__ import annotations

import sys

import av
import numpy as np
from PIL import Image
from scipy import ndimage

CX = 645
# (row, half-width) of the glass, read off the first frame at 2x (both bulbs and the neck)
PROFILE = [(146, 0), (150, 55), (165, 80), (185, 89), (215, 89), (250, 83), (275, 69), (295, 51), (320, 31), (340, 15),
           (355, 9), (370, 15), (390, 41), (410, 73), (440, 86), (480, 88), (520, 87), (545, 83), (560, 71), (572, 52), (580, 0)]
MARGIN = 10
WALL_DX = 300


def main() -> None:
    first, take1, out = sys.argv[1], sys.argv[2], sys.argv[3]
    sf = int(sys.argv[sys.argv.index("--shards-from") + 1]) if "--shards-from" in sys.argv else 70
    a = np.asarray(Image.open(first).convert("RGB")).astype(np.float32) / 255
    H, W = a.shape[:2]
    orig = a.copy()
    img = a.copy()
    ys = np.arange(H)
    hw = np.interp(ys, [p[0] for p in PROFILE], [p[1] for p in PROFILE], left=0, right=0)
    xx = np.arange(W)[None, :]
    glass = (np.abs(xx - CX) <= hw[:, None] + MARGIN) & (hw[:, None] > 0)
    # what was behind the glass
    gy, gx = np.nonzero(glass)
    src = np.where(gy < 548, np.clip(gx + WALL_DX, 0, W - 1), 470 + (gx % 34))
    # the wall is lit unevenly: match each row of the borrowed strip to the wall seen right beside the hourglass
    near = np.concatenate([orig[:, 470:500], orig[:, 792:830]], 1).mean(1)          # (H, 3)
    far = orig[:, 480 + WALL_DX:880 + WALL_DX].mean(1)
    gain = ndimage.uniform_filter1d(near, 25, axis=0) / np.maximum(ndimage.uniform_filter1d(far, 25, axis=0), 1e-3)
    gain[548:] = 1.0
    img[gy, gx] = orig[gy, src] * gain[gy]
    # the back post, solid now: the front-right post (x 732-782) squeezed to 34 px at x 668-702, a stop down
    for y in range(138, 572):
        seg = orig[y, 732:783]
        img[y, 668:702] = np.asarray(Image.fromarray((seg[None] * 255).astype(np.uint8)).resize((34, 1), Image.BILINEAR))[0].astype(np.float32) / 255 * 0.62
    # the heap: the lower bulb's sand, spread low on the base
    sand = orig[492:556, 588:702].reshape(-1, 3)
    mxs = sand.max(-1)
    sand = sand[(mxs > 0.45) & (sand[:, 0] - sand[:, 2] > 0.3)]
    rng = np.random.default_rng(1121)
    base_y, peak, half = 582, 40, 120
    prof = lambda x: peak * np.exp(-((x - CX) / half * 1.9) ** 2)
    heap = np.zeros((H, W), bool)
    for x in range(CX - half, CX + half + 1):
        h = prof(x)
        if h < 1.5:
            continue
        slope = (prof(x + 1) - prof(x - 1)) / 2          # > 0 on the left flank (it faces the key light)
        top = int(round(base_y - h))
        for y in range(top, base_y + 1):
            c = sand[rng.integers(len(sand))]
            light = 0.92 + 0.9 * slope - 0.28 * ((y - top) / max(1.0, h)) ** 2
            img[y, x] = c * np.clip(light, 0.5, 1.25)
            heap[y, x] = True
    # soften the heap's pixels into each other (sand, not confetti)
    blur = np.stack([ndimage.gaussian_filter(img[..., c], 0.8) for c in range(3)], -1)
    img[heap] = blur[heap]
    # the front posts over everything
    for x0, x1 in ((503, 559), (731, 787)):
        img[128:592, x0:x1] = orig[128:592, x0:x1]
    # take 1's shards on the desk
    with av.open(take1) as c:
        for i, fr in enumerate(c.decode(video=0)):
            if i == sf:
                t = fr.to_ndarray(format="rgb24").astype(np.float32) / 255
                break
    d = np.abs(t - orig).max(-1)
    tmx = t.max(-1)
    tsat = (tmx - t.min(-1)) / (tmx + 1e-6)
    yy = ys[:, None]
    on_base = (((xx - 646) / 180.0) ** 2 + ((yy - 600) / 48.0) ** 2) < 1
    shard = (d > 0.15) & (tmx > 0.5) & (tsat < 0.4) & (yy > 540) & ~on_base & ~glass
    shard = ndimage.binary_opening(shard, iterations=1)
    shard = ndimage.binary_dilation(shard, iterations=1)
    img[shard] = t[shard]
    Image.fromarray((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)).save(out)
    print(out, "glass px", int(glass.sum()), "heap px", int(heap.sum()), "shard px", int(shard.sum()))


if __name__ == "__main__":
    main()
