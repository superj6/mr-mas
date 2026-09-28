# MR. MAS: the final CLOD insert's preview sheets (dev only), from the episode renderer's own pictures (picstills:
# p<frame>-<shot>.png, 1920 x 1080). Blender's bundled Python (numpy + OpenImageIO).
#   $PY preview_sheet.py --stills <dir> --pick f1,f2,... --out sheet.png          8 frames, 2 x 4 at 960 x 540 (box)
#   $PY preview_sheet.py --before <png> --after <png> --out pair.png             the same crop of two pictures, 2x
import os
import sys
import glob
import numpy as np
from composite import read, write

a = sys.argv[1:]
A = {a[i].lstrip('-'): a[i + 1] for i in range(0, len(a) - 1, 2)}
gap = 0.08
if 'pick' in A:
    tiles = []
    for f in [int(x) for x in A['pick'].split(',')]:
        im = read(glob.glob(os.path.join(A['stills'], f'p{f:05d}-*.png'))[0])[..., :3]
        tiles.append(im.reshape(540, 2, 960, 2, 3).mean(axis=(1, 3)))
    rows = [np.concatenate([tiles[i], np.full((540, 8, 3), gap, np.float32), tiles[i + 1]], 1) for i in range(0, len(tiles), 2)]
    sheet = rows[0]
    for r in rows[1:]:
        sheet = np.concatenate([sheet, np.full((8, r.shape[1], 3), gap, np.float32), r], 0)
    write(A['out'], sheet)
else:
    # the pane round CLOD (x 1140-1420, y 440-760) and his face (x 1200-1360, y 470-590), both pictures side by side
    def crops(p):
        im = read(p)[..., :3]
        return im[440:760, 1140:1420].repeat(2, 0).repeat(2, 1), im[470:590, 1200:1360].repeat(4, 0).repeat(4, 1)
    (b1, b2), (a1, a2) = crops(A['before']), crops(A['after'])
    sep = lambda h: np.full((h, 16, 3), gap, np.float32)  # noqa: E731
    top = np.concatenate([b1, sep(640), a1], 1)
    bot = np.concatenate([b2, sep(480), a2], 1)
    w = max(top.shape[1], bot.shape[1])
    pad = lambda im: np.pad(im, ((0, 0), (0, w - im.shape[1]), (0, 0)), constant_values=gap)  # noqa: E731
    write(A['out'], np.concatenate([pad(top), np.full((16, w, 3), gap, np.float32), pad(bot)], 0))
print('wrote', A['out'])
