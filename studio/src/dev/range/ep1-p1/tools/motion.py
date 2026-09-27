"""E1-P1: measure the clay's timing from the ENCODED mp4 (no eyes needed for these):
  on 2s (odd frames repeat the even ones inside the clay), the boil's size drawing to drawing, repeated drawings in the
  hold, the entry step p239 -> p240, the brightest pixel under the light.
  ../audio/.venv-mix/bin/python src/dev/range/ep1-p1/tools/motion.py <dir of t000.png.. (the cel tile, cropped)> <a hold cel png>
"""
import json
import os
import sys

import numpy as np
from PIL import Image

D, CEL = sys.argv[1], sys.argv[2]
fr = sorted(f for f in os.listdir(D) if f.endswith('.png'))
a = np.stack([np.array(Image.open(os.path.join(D, f)).convert('RGB')) for f in fr]).astype(np.int16)
cel = np.array(Image.open(CEL).convert('L')).astype(float)[:, 400:800] / 255
m = cel > 0.5
d = lambda i, j: float(np.abs(a[i] - a[j])[m].mean())  # noqa: E731
rep = {}
odd = [d(f, f - 1) for f in range(241, 600, 2)]
even = [d(f, f - 1) for f in range(242, 600, 2)]
rep['on2s_odd_mean'] = round(float(np.mean(odd)), 3)
rep['on2s_odd_max'] = round(float(max(odd)), 3)
rep['new_drawing_mean'] = round(float(np.mean(even)), 3)
hold = [d(f, f - 2) for f in range(280, 600, 2)]
rep['hold_boil_mean'] = round(float(np.mean(hold)), 2)
rep['hold_boil_min'] = round(float(min(hold)), 2)
rep['hold_boil_max'] = round(float(max(hold)), 2)
hf = list(range(276, 600, 2))
rep['hold_identical_pairs'] = sum(1 for i in range(len(hf)) for j in range(i + 1, len(hf)) if d(hf[i], hf[j]) < 0.35)
rep['hold_pairs'] = len(hf) * (len(hf) - 1) // 2
rep['tile_change_p238_p239'] = round(float(np.abs(a[239] - a[238]).mean()), 2)
rep['tile_change_p239_p240'] = round(float(np.abs(a[240] - a[239]).mean()), 2)
lum = lambda x: 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]  # noqa: E731
rep['max_luma_clay_p240_599'] = int(max(lum(a[f])[m].max() for f in range(240, 600, 6)))
rep['clay_mean_luma_hold'] = round(float(np.mean([lum(a[f])[m].mean() for f in range(280, 600, 20)])), 1)
print(json.dumps(rep, indent=1))
