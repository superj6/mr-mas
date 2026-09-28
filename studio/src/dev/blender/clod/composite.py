# MR. MAS: CLOD look-dev, the in-episode composite: the clay insert laid into the clean pixel plate of Ep1 11.04.
# Runs on Blender's bundled Python (numpy + OpenImageIO; nothing to install):
#   PY=~/Downloads/blender-4.5.3-linux-x64/4.5/python/bin/python3.11
#   $PY studio/src/dev/blender/clod/composite.py --real <dir> --plate <dir> --pane <dir> --out <dir> --from 7256 --to 7534
# Inputs: the episode renderer's native frames (n<frame>-<shot>.png, 480x270 at 2x) as the episode draws them (--real)
# and with the pixel CLOD removed (--plate, plate-build.mjs --plate); the insert's clay-<frame>.png, shadow-<frame>.png
# and pane-log.json (pane_insert.py). Frames before the launch light and after the shot are the episode's own.
# The rules it keeps (style-range §4.6, 1.A): the people stay pixel; the clay is laid in at output resolution; its shadow
# lands on the pixel plinth stepped on the native 4x4 grid in two rungs, so the contact belongs to the pane.
import os
import sys
import glob
import json
import numpy as np
import OpenImageIO as oiio


def args():
    a = sys.argv[1:]
    d = {'real': '', 'plate': '', 'pane': '', 'out': '', 'from': '7256', 'to': '7534', 'stills': '', 'gain': '0.88,0.78,0.74',
         'gamma': '1.0', 'shadow': '0.62'}
    for i in range(0, len(a) - 1, 2):
        d[a[i].lstrip('-')] = a[i + 1]
    return d


def read(path, unassoc=True):
    cfg = oiio.ImageSpec()
    if unassoc:
        cfg.attribute('oiio:UnassociatedAlpha', 1)
    buf = oiio.ImageBuf(path, 0, 0, cfg)
    arr = buf.get_pixels(oiio.FLOAT)
    if arr is None or buf.has_error:
        raise RuntimeError(f'cannot read {path}: {buf.geterror()}')
    return np.asarray(arr, np.float32)


def write(path, arr):
    arr = np.clip(arr, 0, 1)
    h, w, c = arr.shape
    buf = oiio.ImageBuf(oiio.ImageSpec(w, h, c, oiio.UINT8))
    buf.set_pixels(oiio.ROI(0, w, 0, h, 0, 1, 0, c), (arr * 255 + 0.5).astype(np.uint8))
    buf.write(path)


def native(dirp, f):
    m = glob.glob(os.path.join(dirp, f'n{f:05d}-*.png'))
    if not m:
        raise FileNotFoundError(f'no native frame {f} in {dirp}')
    a = read(m[0])[..., :3]                       # 960x540 (the 480x270 frame at 2x)
    return a.repeat(2, 0).repeat(2, 1)             # -> 1920x1080, integer nearest, as the picture is drawn


def grid_step(alpha, levels):
    """average on the native 4x4 grid, then snap to palette-like rungs"""
    h, w = alpha.shape
    g = alpha.reshape(h // 4, 4, w // 4, 4).mean(axis=(1, 3))
    q = np.zeros_like(g)
    for thr, val in levels:
        q = np.where(g >= thr, val, q)
    return q.repeat(4, 0).repeat(4, 1)


def main():
    A = args()
    meta = json.load(open(os.path.join(A['pane'], 'pane-log.json')))
    x0, y0, x1, y1 = meta['crop']
    s0, k_on, k_end = meta['shot_start'], meta['k_on'], meta['k_end']
    gain = np.array([float(x) for x in A['gain'].split(',')], np.float32)
    gamma = float(A['gamma'])
    shadow_strength = float(A['shadow'])
    night = np.array([0x0d, 0x10, 0x20], np.float32) / 255.0   # PAL.N2: the pane's shadows go toward the night rungs
    os.makedirs(A['out'], exist_ok=True)
    stills = [int(x) for x in A['stills'].split(',') if x]
    n = 0
    for f in range(int(A['from']), int(A['to'])):
        k = f - s0
        if k_on <= k < k_end:
            base = native(A['plate'], f)
            kd = k_on + ((k - k_on) // 2) * 2               # on 2s from the launch
            clay = read(os.path.join(A['pane'], f'clay-{s0 + kd}.png'))
            shad = read(os.path.join(A['pane'], f'shadow-{s0 + kd}.png'))
            # the shadow: its alpha over the whole frame, stepped on the grid, pulled toward the night rungs
            sa = np.zeros(base.shape[:2], np.float32)
            sa[y0:y1, x0:x1] = shad[..., 3] * (1 - shad[..., :3].mean(axis=2) * 0.0)
            q = grid_step(sa, [(0.10, 0.34), (0.32, 0.62)]) * shadow_strength
            base = base * (1 - q[..., None]) + night * q[..., None] * 0.6
            # the clay: graded to sit within a stop of the pixel light, laid in over the plate
            rgb = np.clip(clay[..., :3] * gain, 0, 1) ** gamma
            a = clay[..., 3:4]
            reg = base[y0:y1, x0:x1]
            base[y0:y1, x0:x1] = rgb * a + reg * (1 - a)
        else:
            base = native(A['real'], f)
        write(os.path.join(A['out'], f'c{n:05d}.png'), base)
        if f in stills:
            write(os.path.join(A['out'], f'still-{f}.png'), base)
        n += 1
    print(f'wrote {n} frames to {A["out"]}')


if __name__ == '__main__':
    main()
