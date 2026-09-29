#!/usr/bin/env python3
"""range/p3: contact sheet and review frames pulled from the ENCODED mp4 (never from the renderer's own PNGs).

  python3 sheet.py sheet  <p3.mp4> <out.png>                 # the p3-sheet: 16 beats of the clip, labelled
  python3 sheet.py frames <p3.mp4> <outdir> f1 f2 ...        # full-size frames + 480x270 downscales for review
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
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

FF = os.path.join(REPO, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
ENV = dict(os.environ, LD_LIBRARY_PATH=FF)


def grab(mp4, f, out):
    # input-seek lands on the first frame whose pts >= the seek time: aim just under frame f
    subprocess.run([f'{FF}/ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{max(0.0, (f - 0.1) / 24):.4f}', '-i', mp4, '-frames:v', '1', out], check=True, env=ENV)


BEATS = [
    (10, 'pixel [W], band on'), (38, 'the band slides away'), (56, 'render front: the model\'s copy'), (82, 'the room parts in depth'),
    (100, 'the glide; the rims gather'), (119, 'in his chair: cyan, 2015'), (128, 'the table resolves'), (138, 'the guests assemble'),
    (166, 'the candles\' light lands on them'), (200, 'contact: all four'), (262, 'the bars; one chord'), (285, 'cut: his reflection, empty plate'),
    (304, 'the reflection comes apart'), (318, 'into the monitor'), (338, 'the front re-renders the [W]'), (354, 'band back; on Mas'),
]


def sheet(mp4, out):
    tmp = out + '.tmp.png'
    w, h, cols = 480, 270, 4
    rows = (len(BEATS) + cols - 1) // cols
    S = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * (h + 26) + 8 + 40), (16, 17, 22))
    d = ImageDraw.Draw(S)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
        big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    except OSError:
        font = big = ImageFont.load_default()
    d.text((10, 10), 'MR. MAS · range P3 (polish) · 12.A THE RECONSTRUCTION (near-photoreal objects, pixel people) · frames from the encoded p3.mp4', fill=(220, 222, 230), font=big)
    for i, (f, label) in enumerate(BEATS):
        grab(mp4, f, tmp)
        im = Image.open(tmp).convert('RGB').resize((w, h), Image.LANCZOS)
        x, y = 8 + (i % cols) * (w + 8), 40 + (i // cols) * (h + 26)
        S.paste(im, (x, y))
        d.text((x + 2, y + h + 5), f'p{f:03d}  {label}', fill=(200, 202, 210), font=font)
    os.remove(tmp)
    S.save(out)
    print('wrote', out)


def frames(mp4, outdir, fs):
    os.makedirs(outdir, exist_ok=True)
    for f in fs:
        p = os.path.join(outdir, f'enc{f:03d}.png')
        grab(mp4, f, p)
        Image.open(p).convert('RGB').resize((480, 270), Image.LANCZOS).save(os.path.join(outdir, f'enc{f:03d}-small.png'))
    print('wrote', len(fs), 'frames to', outdir)


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3])
    else:
        frames(sys.argv[2], sys.argv[3], [int(v) for v in sys.argv[4:]])
