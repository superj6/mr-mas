#!/usr/bin/env python3
"""Contact sheet of a clip: every Nth frame (or --n evenly spaced frames), labelled, for review.

  sheet.py CLIP.mp4 OUT.png [--n 12] [--cols 4] [--width 480]
Also prints the clip's size, fps, frame count and a per-frame mean-change trace (to spot stutters and pops).
"""
from __future__ import annotations

import sys

import av
import numpy as np
from PIL import Image, ImageDraw


def main() -> None:
    src, out = sys.argv[1], sys.argv[2]
    arg = lambda k, d: type(d)(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
    n, cols, width = arg("--n", 12), arg("--cols", 4), arg("--width", 480)
    c = av.open(src)
    st = c.streams.video[0]
    frames = [f.to_ndarray(format="rgb24") for f in c.decode(video=0)]
    h, w = frames[0].shape[:2]
    fps = float(st.average_rate)
    diffs = [float(np.abs(frames[i].astype(np.int16) - frames[i - 1]).mean()) for i in range(1, len(frames))]
    print(f"{src}: {w}x{h} {fps:.3f} fps {len(frames)} frames; audio streams {len(c.streams.audio)}")
    print("mean change per frame: min %.2f median %.2f max %.2f (at %d)" % (min(diffs), float(np.median(diffs)), max(diffs), 1 + int(np.argmax(diffs))))
    idx = np.linspace(0, len(frames) - 1, n).round().astype(int)
    th = int(width * h / w)
    rows = (n + cols - 1) // cols
    sheet = Image.new("RGB", (cols * width, rows * (th + 18)), (16, 16, 20))
    d = ImageDraw.Draw(sheet)
    for k, i in enumerate(idx):
        im = Image.fromarray(frames[i]).resize((width, th), Image.LANCZOS)
        x, y = (k % cols) * width, (k // cols) * (th + 18)
        sheet.paste(im, (x, y))
        d.text((x + 4, y + th + 3), f"f{i:03d}  {i / fps:.2f}s", fill=(220, 220, 220))
    sheet.save(out)
    print(out)


if __name__ == "__main__":
    main()
