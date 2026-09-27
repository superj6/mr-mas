"""MR. MAS - style-range prototype E1-P3 (1.D): the contact sheet, from frames pulled from the ENCODED ep1-p3.mp4.
  ../audio/.venv-mix/bin/python src/dev/range/ep1-p3/tools/sheet.py <out.png> <frames dir> [blind]
Each tile is labelled with its frame and what the brief says happens there. With `blind`, the tiles carry nothing but
their order (for the cold reader, who must not be told what a section means). Frame files are named fNNN.png.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

OUT, DIR = sys.argv[1], sys.argv[2]
BLIND = len(sys.argv) > 3 and sys.argv[3] == 'blind'
NOTES = {
    0: 'S7.02 [W] the bullpen walkout, pixel', 60: 'Mas asks (a5-30-05); the crowd breathes', 119: 'last frame of the wide',
    120: 'CUT: S7.02b [MCU] Tasya, closer camera', 160: '"Oh, we\'d be fine."', 230: '"...all the capability"',
    246: '"below": the floor starts under him', 249: 'the floor spreads out (chord p250)', 252: 'the floor reaches the window',
    256: 'the vector floor, pixel room', 269: '"above": the ceiling starts over him', 272: 'the ceiling spreads (chord p273)',
    276: 'the vector ceiling lands', 292: '"around": the ring enters', 296: 'the ring closes (chord p296)',
    300: 'the ring passes the staff', 304: 'the ring passes Tasya: his rim', 308: 'the ring lands on Mas: the island',
    318: 'hold: the landlord\'s room', 326: 'CUT: S7.03 [MCU] Mas, own camera', 354: '"Hello." from the floor',
    388: 'his brow is up: last frame', 389: 'CUT: S7.05 Mada, pixel', 400: 'the rail types; the fires light the room',
    436: 'last frame',
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
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']:
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            continue
    return ImageFont.load_default()


if BLIND:
    d.text((10, 10), 'MR. MAS  PROTOTYPE', fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), 'frames in order, from the encoded mp4', fill=(120, 150, 160), font=font(14))
else:
    d.text((10, 10), 'MR. MAS  STYLE-RANGE E1-P3  BELOW, ABOVE, AROUND (1.D)  EP1 SC 30', fill=(230, 214, 180), font=font(20, True))
    d.text((10, 38), '437 f @ 24 fps, v5 takes | pixel p0-245 | slate + vector steps p246-308 | vector room, pixel Mas/Tasya to p388 | pixel p389-436 | frames from the encoded mp4',
           fill=(120, 150, 160), font=font(13))
for i, f in enumerate(files):
    p = int(f[1:4])
    im = Image.open(os.path.join(DIR, f)).convert('RGB').resize((tw, th), Image.LANCZOS)
    x = 8 + (i % cols) * (tw + 8)
    y = head + (i // cols) * (th + lab + 8)
    sheet.paste(im, (x, y))
    if BLIND:
        d.text((x + 2, y + th + 6), f'{i + 1:02d}', fill=(150, 150, 165), font=font(15, True))
        continue
    sec = 'PIXEL' if p < 246 or p >= 389 else 'CHANGE' if p < 309 else 'VECTOR'
    col = {'PIXEL': (63, 202, 203), 'CHANGE': (255, 201, 142), 'VECTOR': (164, 175, 198)}[sec]
    d.text((x + 2, y + th + 4), f'p{p:03d} {sec}', fill=col, font=font(13, True))
    note = NOTES.get(p, '')
    d.text((x + 2, y + th + 18), note[:52], fill=(170, 170, 180), font=font(10))
sheet.save(OUT, optimize=True)
print('wrote', OUT, sheet.size)
