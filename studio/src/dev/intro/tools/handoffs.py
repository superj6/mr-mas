#!/usr/bin/env python3
"""MR. MAS - intro-ep1: handoff continuity stills (python3 + Pillow).

    python3 studio/src/dev/intro/tools/handoffs.py <seq dir> <raw mdinner1 dir> [out dir]

<seq dir>: a 1080p PNG sequence of intro-ep1 (element-NNN.png). <raw mdinner1 dir>: frames 340-359 of the review
composition intro-raw-mdinner1 (mdinner1 over its whole authored span), for the 345-359 overlap proof.
For every cut it writes the cut frame and its neighbours at 1080p (<name>_fNNN.png), one labelled strip at native
480x270 per cut (<name>_strip.png), a 4x zoom of the match cut (glint -> flame), the 345-359 pixel diff table and
the 719 -> 0 loop strip.
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
import os, sys
from PIL import Image, ImageChops, ImageDraw, ImageFont

SEQ, RAW1 = sys.argv[1], sys.argv[2]
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(REPO, 'out/season/intro/picture/handoffs')
os.makedirs(OUT, exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 12)
P = lambda d, f: os.path.join(d, f'element-{f:03d}.png')
nat = lambda p: Image.open(p).convert('RGB').crop((1, 1, 1920, 1080)).resize((480, 270), Image.NEAREST)

CUTS = [  # name, cut frame (first frame of the incoming moment), neighbours
    ('01_mcoldopen-meras_f120', 120, [117, 118, 119, 120, 121, 122]),
    ('02_meras-mdinner1_f225', 225, [222, 223, 224, 225, 226, 227]),
    ('03_mdinner1-mdinner2_f345', 345, [342, 343, 344, 345, 346, 347]),
    ('04_mdinner2-mrollcall_f480', 480, [477, 478, 479, 480, 481, 482]),
    ('05_mrollcall-mfinale_f540', 540, [536, 537, 538, 539, 540, 541]),
    ('06_loop_f719-f0', 0, [716, 717, 718, 719, 0, 1]),
]

def strip(name, frames, cut, extra=None):
    tiles = [(f'f{f:03d}' + ('  CUT' if f == cut else ''), nat(P(SEQ, f))) for f in frames]
    if extra: tiles += extra
    W = len(tiles) * 482 + 2
    s = Image.new('RGB', (W, 270 + 18), (30, 30, 36))
    d = ImageDraw.Draw(s)
    for k, (lab, im) in enumerate(tiles):
        x = 2 + k * 482
        d.text((x + 2, 2), lab, fill=(255, 110, 90) if 'CUT' in lab else (255, 225, 120), font=font)
        s.paste(im, (x, 18))
    s.save(os.path.join(OUT, f'{name}_strip.png'), optimize=True)

for name, cut, frames in CUTS:
    for f in frames:
        Image.open(P(SEQ, f)).save(os.path.join(OUT, f'{name}_f{f:03d}.png'), optimize=True)
    strip(name, frames, cut)

# the match cut, 4x zoom around the glint / flame core (native 84, 95 -> 1080p 338, 382)
cx, cy, hw, hh, z = 338, 382, 96, 72, 3
tiles = []
for f in [222, 223, 224, 225, 226]:
    im = Image.open(P(SEQ, f)).convert('RGB').crop((cx - hw, cy - hh, cx + hw, cy + hh))
    im = im.resize((im.width * z, im.height * z), Image.NEAREST)
    d = ImageDraw.Draw(im)
    X, Y = hw * z, hh * z
    for a, b, c, e in [(X - 30, Y, X - 10, Y), (X + 10, Y, X + 30, Y), (X, Y - 30, X, Y - 10), (X, Y + 10, X, Y + 30)]:
        d.line((a, b, c, e), fill=(0, 255, 0), width=2)
    d.text((6, 4), f'f{f}  (crosshair = native 84,95)', fill=(255, 255, 0), font=font)
    tiles.append(im)
s = Image.new('RGB', (sum(t.width for t in tiles) + 4 * len(tiles), tiles[0].height), (60, 60, 60))
x = 0
for t in tiles:
    s.paste(t, (x, 0)); x += t.width + 4
s.save(os.path.join(OUT, '02_meras-mdinner1_f225_matchcut-zoom.png'), optimize=True)

# the overlap proof: mdinner2 (in the intro) vs mdinner1 (raw), 345-359
lines = ['frame  intro(mdinner2) vs mdinner1-raw']
for f in range(345, 360):
    a, b = Image.open(P(SEQ, f)).convert('RGB'), Image.open(P(RAW1, f)).convert('RGB')
    bb = ImageChops.difference(a, b).getbbox()
    lines.append(f'f{f}   ' + ('identical (0 px)' if bb is None else f'DIFFERS bbox {bb}'))
open(os.path.join(OUT, '03_mdinner1-mdinner2_overlap-diff.txt'), 'w').write('\n'.join(lines) + '\n')
strip('03_mdinner1-mdinner2_overlap-raw', [344], 345, [(f'mdinner1 raw f{f}', nat(P(RAW1, f))) for f in (345, 352, 359)] + [(f'intro f{f}', nat(P(SEQ, f))) for f in (345, 352, 359)])
print('\n'.join(lines))
print('wrote', len(os.listdir(OUT)), 'files to', OUT)
