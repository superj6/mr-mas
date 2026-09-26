#!/usr/bin/env python3
"""Prototype 2 · checks on the ENCODED mp4 (PIL + numpy): the seams where the 3D starts and ends, at full size and at
480 x 270 (area-downscaled, the phone-size read).  encheck.py <framesDir> <pairs...>   (pairs as a:b, frame numbers)"""
import sys
import numpy as np
from PIL import Image
d = sys.argv[1]
for pr in sys.argv[2:]:
    a, b = (int(v) for v in pr.split(':'))
    A = np.asarray(Image.open(f'{d}/f{a}.png').convert('RGB')).astype(np.int16)
    B = np.asarray(Image.open(f'{d}/f{b}.png').convert('RGB')).astype(np.int16)
    for lab, X, Y in [('1080', A, B), ('480x270', np.asarray(Image.fromarray(A.astype(np.uint8)).resize((480, 270), Image.BOX)).astype(np.int16), np.asarray(Image.fromarray(B.astype(np.uint8)).resize((480, 270), Image.BOX)).astype(np.int16))]:
        # the room rows (above the band's rows: the band moves on its own)
        rows = X.shape[0] * 203 // 270
        dd = np.abs(X[:rows] - Y[:rows])
        print(f'p{a} vs p{b} [{lab}] room rows: mean |d| {dd.mean() / 255:.4f}, max {dd.max()} levels, px > 8 levels: {(dd.max(axis=2) > 8).sum()}')
