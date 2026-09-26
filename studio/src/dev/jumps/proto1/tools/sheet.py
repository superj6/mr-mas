"""Contact sheet for style-jump prototype 1: the four key stills (top) and the transition frames (bottom).
   python3 sheet.py <out-dir> <tmp-dir>   (PIL only)"""
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageFont

out, tmp = sys.argv[1], sys.argv[2]
keys = sorted(glob.glob(os.path.join(out, 'proto1-key-*.png')))
trans = sorted(glob.glob(os.path.join(tmp, 't-p*.png')), key=lambda p: int(os.path.basename(p)[3:-4]))
KW, KH = 960, 540
TW, TH = 480, 270
cols = 4
rows_t = (len(trans) + cols - 1) // cols
sheet = Image.new('RGB', (KW * 2 + 30, KH * 2 + 30 + rows_t * (TH + 30) + 40), (8, 10, 20))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 18)
except OSError:
    font = ImageFont.load_default()
d.text((10, 8), 'MR. MAS · STYLE JUMP PROTO 1 · J1 "CANCELLED" (Ep1 sc 26) · key stills, then the in / out frames', fill=(200, 200, 190), font=font)
for i, p in enumerate(keys):
    im = Image.open(p).convert('RGB').resize((KW, KH), Image.LANCZOS)
    x, y = 10 + (i % 2) * (KW + 10), 36 + (i // 2) * (KH + 10)
    sheet.paste(im, (x, y))
    d.text((x + 8, y + 6), os.path.basename(p)[:-4], fill=(240, 220, 120), font=font)
y0 = 36 + 2 * (KH + 10) + 10
for i, p in enumerate(trans):
    im = Image.open(p).convert('RGB').resize((TW, TH), Image.LANCZOS)
    x, y = 10 + (i % cols) * (TW + 10), y0 + (i // cols) * (TH + 30)
    sheet.paste(im, (x, y))
    d.text((x, y + TH + 4), os.path.basename(p)[2:-4], fill=(200, 200, 190), font=font)
sheet.save(os.path.join(out, 'proto1-sheet.png'))
print('sheet', os.path.join(out, 'proto1-sheet.png'))
