#!/usr/bin/env python3
"""Prototype 2 · contact sheets and review crops (PIL only; the bundled ffmpeg has no tile filter).

  sheet.py grid <out.png> <cols> <cell_w> <label?> <img...>       tile images (area-downscaled), optional frame labels
  sheet.py sheet <out.png> <title> <subtitle> <img:label ...>      the deliverable sheet: 4 x N, labelled, on N0
"""
import sys
from PIL import Image, ImageDraw, ImageFont

BG = (4, 5, 10)
INK = (127, 230, 222)
DIM = (111, 130, 184)


def font(size):
    for path in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf'):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def grid(out, cols, cw, label, paths):
    cols, cw = int(cols), int(cw)
    ch = cw * 9 // 16
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cw, rows * (ch + (18 if label else 0))), BG)
    d = ImageDraw.Draw(sheet)
    f = font(13)
    for i, p in enumerate(paths):
        im = Image.open(p).convert('RGB').resize((cw, ch), Image.BOX)
        x, y = (i % cols) * cw, (i // cols) * (ch + (18 if label else 0))
        sheet.paste(im, (x, y))
        if label:
            d.text((x + 4, y + ch + 2), p.split('/')[-1].rsplit('.', 1)[0], fill=INK, font=f)
    sheet.save(out)


def deliver(out, title, sub, items):
    cols, cw = 4, 460
    ch = cw * 9 // 16
    pad, lab = 12, 34
    rows = (len(items) + cols - 1) // cols
    W = cols * cw + (cols + 1) * pad
    H = 96 + rows * (ch + lab + pad) + pad
    sheet = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(sheet)
    d.text((pad, 14), title, fill=INK, font=font(24))
    d.text((pad, 50), sub, fill=DIM, font=font(15))
    f = font(14)
    for i, it in enumerate(items):
        p, text = it.split(':', 1)
        im = Image.open(p).convert('RGB').resize((cw, ch), Image.BOX)
        x = pad + (i % cols) * (cw + pad)
        y = 96 + (i // cols) * (ch + lab + pad)
        sheet.paste(im, (x, y))
        d.text((x, y + ch + 6), text, fill=DIM, font=f)
    sheet.save(out)


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'grid':
        grid(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5] == '1', sys.argv[6:])
    elif mode == 'sheet':
        deliver(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5:])
