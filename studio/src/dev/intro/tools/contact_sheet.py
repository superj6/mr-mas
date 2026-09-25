#!/usr/bin/env python3
"""MR. MAS - intro-ep1: the 48 beat stills and their contact sheet (python3 + Pillow).

    python3 studio/src/dev/intro/tools/contact_sheet.py <png sequence dir> [out dir]

<png sequence dir> is a 1080p Remotion render of intro-ep1 (`--sequence --image-format=png`, files element-NNN.png).
Writes <out>/beat-NN_bar.beat_fFFF.png (48 files: one per beat, f0, f15 ... f705) and
<out>/_contact-sheet_intro-ep1-beats.png: 8 columns = 2 bars per row, each still at native 480x270 (a 1/4 nearest
downscale of the 4x frame, so it is the exact pixel art), labelled with frame, bar.beat and the moment on screen.
"""
import os, shutil, sys
from PIL import Image, ImageDraw, ImageFont

SEQ = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else '/home/jgon/project/art/mrmas/out/intro/picture/beats'
EDL = [('mcoldopen', 0, 119), ('meras', 120, 224), ('mdinner1', 225, 344), ('mdinner2', 345, 479), ('mrollcall', 480, 539), ('mfinale', 540, 719)]
moment = lambda f: next(m for m, a, b in EDL if a <= f <= b)
HANDOFFS = {120, 225, 345, 480, 540}

os.makedirs(OUT, exist_ok=True)
for fn in os.listdir(OUT):
    if fn.startswith('beat-') and fn.endswith('.png'):
        os.remove(os.path.join(OUT, fn))
beats = []
for n in range(48):
    f = n * 15
    bar, bt = n // 4 + 1, n % 4 + 1
    dst = os.path.join(OUT, f'beat-{n + 1:02d}_{bar}.{bt}_f{f:03d}.png')
    shutil.copyfile(os.path.join(SEQ, f'element-{f:03d}.png'), dst)
    beats.append((n + 1, bar, bt, f, dst))

COLS, TW, TH, LAB, PAD = 8, 480, 270, 18, 4
rows = (len(beats) + COLS - 1) // COLS
HEAD = 34
W = COLS * (TW + PAD) + PAD + 8  # +8: a gutter between the two bars of a row
H = HEAD + rows * (TH + LAB + PAD) + PAD
sheet = Image.new('RGB', (W, H), (24, 24, 30))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 13)
    big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 18)
except OSError:
    font = big = ImageFont.load_default()
d.text((PAD + 2, 8), 'MR. MAS  intro-ep1  (720 f, 24 fps, 96 BPM)  one still per beat, 2 bars per row, native 480x270  ·  red label = first beat of a new moment (handoff)', fill=(235, 225, 190), font=big)
for k, (n, bar, bt, f, path) in enumerate(beats):
    im = Image.open(path).convert('RGB').crop((1, 1, 1920, 1080)).resize((TW, TH), Image.NEAREST)
    c, r = k % COLS, k // COLS
    x = PAD + c * (TW + PAD) + (8 if c >= 4 else 0)
    y = HEAD + r * (TH + LAB + PAD)
    col = (255, 110, 90) if f in HANDOFFS or f == 0 else (255, 225, 120)
    d.text((x + 2, y + 1), f'f{f:03d}  {bar}.{bt}  {moment(f)}', fill=col, font=font)
    sheet.paste(im, (x, y + LAB))
dst = os.path.join(OUT, '_contact-sheet_intro-ep1-beats.png')
sheet.save(dst, optimize=True)
print(f'{len(beats)} beat stills -> {OUT}; contact sheet {sheet.size} -> {dst}')
