"""MR. MAS - style-range Prototype 1: the contact sheet (frames pulled from the ENCODED p1.mp4).
  ../audio/.venv-mix/bin/python src/dev/range/p1/tools/sheet.py <out.png> <frames dir> [blind]
Each tile is labelled with its frame and what the brief says happens there. With `blind`, the tiles carry nothing but
their order (for the cold reader, who must not be told what a section means).
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

OUT, DIR = sys.argv[1], sys.argv[2]
BLIND = len(sys.argv) > 3 and sys.argv[3] == 'blind'
NOTES = {
    0: 'pixel [MS], band on', 30: 'hotspot: nole', 60: 'hotspot: mario', 86: 'the Intern: nothing lights',
    97: 'the band slides away', 110: 'the card, held up in the lamp', 118: 'the card comes down',
    120: 'CUT on the snap: the key drawing', 136: 'the pupils step (p135)', 150: '[OTS] his glass stays pixel',
    180: 'tell: the ladle', 195: 'tell: the napkin', 210: 'tell: the register', 225: 'tell: the phone',
    260: 'the push', 300: 'landing with mass', 322: 'rest: over its head, nothing', 350: 'the caret holds; into it',
    359: 'last anime frame: the caret', 360: 'CUT: J4 placeholder opens out of it', 366: 'the machine pulls out',
    376: 'four tells rise; its face is empty', 395: 'its caret over Mas: nothing', 406: 'back in the room',
    416: 'the band slides home', 438: 'look at mas: nothing sets', 460: 'hold', 468: 'black',
}
files = sorted(f for f in os.listdir(DIR) if f.endswith('.png'))
cols, tw = 5, 384
th = tw * 9 // 16
lab = 30
head = 64
rows = (len(files) + cols - 1) // cols
W, H = cols * tw + (cols + 1) * 8, head + rows * (th + lab + 8) + 8
sheet = Image.new('RGB', (W, H), (8, 8, 12))
d = ImageDraw.Draw(sheet)


def font(sz, bold=False):
    for p in ['/home/jgon/project/art/mrmas/studio/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff',
              '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']:
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            continue
    return ImageFont.load_default()


if BLIND:
    d.text((10, 10), 'MR. MAS  PROTOTYPE 1', fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), 'frames in order, from the encoded mp4', fill=(120, 150, 160), font=font(14))
else:
    d.text((10, 10), 'MR. MAS  STYLE-RANGE PROTOTYPE 1  THE READ (10.C) + J4 PLACEHOLDER  EP10 #19', fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), '480 f @ 24 fps, 96 BPM  |  pixel p0-119  |  HD cel p120-359  |  GLYPH p360-405  |  pixel p406-479  |  frames from the encoded mp4', fill=(120, 150, 160), font=font(14))
for i, f in enumerate(files):
    p = int(f[1:4])
    im = Image.open(os.path.join(DIR, f)).convert('RGB').resize((tw, th), Image.LANCZOS)
    x = 8 + (i % cols) * (tw + 8)
    y = head + (i // cols) * (th + lab + 8)
    sheet.paste(im, (x, y))
    if BLIND:
        d.text((x + 2, y + th + 6), f'{i + 1:02d}', fill=(150, 150, 165), font=font(15, True))
        continue
    sec = 'PIXEL' if p < 120 or p >= 406 else 'CEL' if p < 360 else 'GLYPH'
    col = {'PIXEL': (63, 202, 203), 'CEL': (255, 201, 142), 'GLYPH': (127, 230, 222)}[sec]
    d.text((x + 2, y + th + 6), f'p{p:03d}', fill=col, font=font(15, True))
    d.text((x + 58, y + th + 7), NOTES.get(p, ''), fill=(170, 170, 185), font=font(13))
sheet.save(OUT)
print('wrote', OUT)
