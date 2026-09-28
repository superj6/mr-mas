# MR. MAS: CLOD look-dev, a review sheet of the in-episode mock-up at the show's native size (480 x 270 each), the
# size the style-range blind test reads it at. Blender's bundled Python (numpy + OpenImageIO).
#   $PY sheet.py --comp <dir of c%05d.png> --out sheet.png --from <first frame> --pick f1,f2,...  (8 frames, 4 x 2)
import os
import sys
import numpy as np
from composite import read, write

a = sys.argv[1:]
A = {a[i].lstrip('-'): a[i + 1] for i in range(0, len(a) - 1, 2)}
first = int(A['from'])
picks = [int(x) for x in A['pick'].split(',')][:8]
tiles = []
for f in picks:
    im = read(os.path.join(A['comp'], f'c{f - first:05d}.png'))[..., :3]
    tiles.append(im.reshape(270, 4, 480, 4, 3).mean(axis=(1, 3)))     # box-filtered to the native grid
sheet = np.zeros((540, 1920, 3), np.float32)
for i, t in enumerate(tiles):
    sheet[(i // 4) * 270:(i // 4 + 1) * 270, (i % 4) * 480:(i % 4 + 1) * 480] = t
write(A['out'], sheet)
print('wrote', A['out'])
