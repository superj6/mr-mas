"""MR. MAS - range E1-P1: the contact sheet (frames pulled from the ENCODED ep1-p1.mp4).
  ../audio/.venv-mix/bin/python src/dev/range/ep1-p1/tools/sheet.py <out.png> <frames dir> [blind]
Each tile carries its frame and what the brief says happens there; `blind` tiles carry only their order (for the cold
reader, who must not be told what a section means). Tiles are 384 px wide; frames of 480 px (the phone-size check)
are tiled at their own size.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

OUT, DIR = sys.argv[1], sys.argv[2]
BLIND = len(sys.argv) > 3 and sys.argv[3] == 'blind'
NOTES = {
    0: 'phrase 1: the split, all pixel', 60: 'Gerg snaps the napkin', 110: 'Mario writes the memo; CLOD unlit', 150: '"...same day as them." (finger)',
    179: 'CLOD pixel (night rungs)', 200: 'back at the page, absorbed', 238: 'last pixel frames', 239: 'p239: the pixel CLOD',
    240: 'p240 THE STRIKE: clay in the flash', 242: 'exposure settling; Mario hops back', 244: '"You\'re..." antic; SAFETY dips',
    246: 'full light; the bow', 248: 'the press (down key)', 250: 'Mario startled, held', 256: 'rising',
    268: '"...right!" squaring to the lens', 276: 'the hold: facing us, breathing', 290: 'CLOD 1 · SAME DAY (held)',
    300: 'Mario looks up; CLOD follows', 312: 'CLOD looks at the split', 330: '"Addendum.", head cocked', 354: 'a blink (replacement lids)',
    380: 'his post; Mario reads it', 400: 'CLOD nods along', 424: 'Mario writes his line', 452: 'Mario adds a line; hold',
    480: 'the second scroll unrolls', 500: 'CLOD follows the paper', 520: 'behind the plinth, across the floor', 540: 'lands on Gerg\'s desk',
    560: 'the site (memo)', 585: 'the empty spindle', 590: 'CLOD turns back, grins', 599: 'last clay frame',
    600: 'CUT: sc 12 [OTS], night', 610: 'PAUSE GIANT AI EXPERIMENTS', 659: 'MAR 22, 2023 (end)',
}
files = sorted(f for f in os.listdir(DIR) if f.endswith('.png'))
first = Image.open(os.path.join(DIR, files[0]))
small = first.width <= 480
cols = 5 if not small else 6
tw = 384 if not small else 480
th = tw * 9 // 16
lab = 30
head = 64
rows = (len(files) + cols - 1) // cols
W, H = cols * tw + (cols + 1) * 8, head + rows * (th + lab + 8) + 8
sheet = Image.new('RGB', (W, H), (8, 8, 12))
d = ImageDraw.Draw(sheet)


def font(sz, bold=False):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']:
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            continue
    return ImageFont.load_default()


if BLIND:
    d.text((10, 10), 'MR. MAS  PROTOTYPE E1-P1', fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), 'frames in order, from the encoded mp4', fill=(120, 150, 160), font=font(14))
else:
    d.text((10, 10), 'MR. MAS  STYLE-RANGE E1-P1  CLOD UNDER ITS LAUNCH LIGHT (1.A)  EP1 SC 11 -> 12' + ('  (480x270 CHECK)' if small else ''), fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), '660 f @ 24 fps, 96 BPM (opens a bar early: the memo runs 206 f)  |  pixel p0-239  |  clay CLOD p240-599 (the strike p240-245)  |  sc 12 p600-659  |  round 6, from the encoded mp4', fill=(120, 150, 160), font=font(14))
for i, f in enumerate(files):
    fr = int(f[1:4])
    im = Image.open(os.path.join(DIR, f)).convert('RGB').resize((tw, th), Image.LANCZOS if not small else Image.NEAREST)
    x = 8 + (i % cols) * (tw + 8)
    y = head + (i // cols) * (th + lab + 8)
    sheet.paste(im, (x, y))
    if BLIND:
        d.text((x, y + th + 6), f'{i + 1:02d}', fill=(200, 200, 210), font=font(15, True))
    else:
        d.text((x, y + th + 6), f'p{fr:03d}  {NOTES.get(fr, "")}', fill=(200, 200, 210), font=font(14))
sheet.save(OUT)
print('wrote', OUT, sheet.size)
