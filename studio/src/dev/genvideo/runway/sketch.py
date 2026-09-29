#!/usr/bin/env python3
"""A pencil line drawing of our own duck, for the image-to-video variation's first frame (and the film's
"drawn by nothing" line reveal).

Built from E1-P2's Cycles still (out/lookdev/range/ep1/ep1-p2-inputs/cycles-f000.png, our Blender duck in profile): the
duck is segmented by colour, its silhouette, bill and eye are traced as contours (contourpy, via matplotlib), and
each contour is drawn as two slightly different graphite passes on off-white paper. A hand-placed wing curve is
added. No model, no hand, no text.

  sketch.py OUT.png [--order OUT-order.npy] [--src IMG|CLIP.mp4 --frame N] [--keep-pos] [--facing left|right]
Default: the Cycles still, recentred and scaled to 0.74 (variation 2's first frame). With --src a clip and --frame N,
it traces that frame of a generated clip in place (--keep-pos), so a keyframe request can morph the lines into the
very object they trace (variation 3's first frame). --facing mirrors the hand-placed wing curve.
--order also writes, for every inked pixel, the fraction (0..1) of the drawing at which it is laid down, so the
compositor can reveal the lines stroke by stroke.
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import contourpy

ROOT = Path(__file__).resolve().parents[5]
SRC = ROOT / "out/lookdev/range/ep1/ep1-p2-inputs/cycles-f000.png"


def hsv(a: np.ndarray):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = d / (mx + 1e-6)
    return h, s, mx


def contours(mask: np.ndarray, min_len: int = 40):
    f = ndimage.gaussian_filter(mask.astype(float), 4.0)
    gen = contourpy.contour_generator(z=f)
    out = []
    for line in gen.lines(0.5):
        if len(line) >= min_len:
            out.append(line)  # contourpy gives (x, y)
    return out


def resample(line: np.ndarray, step: float = 3.0) -> np.ndarray:
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(line, axis=0).T))]
    n = max(4, int(d[-1] / step))
    t = np.linspace(0, d[-1], n)
    return np.c_[np.interp(t, d, line[:, 0]), np.interp(t, d, line[:, 1])]


def main() -> None:
    out = Path(sys.argv[1])
    order_out = Path(sys.argv[sys.argv.index("--order") + 1]) if "--order" in sys.argv else None
    opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    src = Path(opt("--src", str(SRC)))
    if src.suffix == ".mp4":
        import av
        want = int(opt("--frame", "0"))
        with av.open(str(src)) as c:
            for i, fr in enumerate(c.decode(video=0)):
                if i == want:
                    img = fr.to_image()
                    break
    else:
        img = Image.open(src)
    a = np.asarray(img.convert("RGB")).astype(np.float32) / 255
    keep_pos = "--keep-pos" in sys.argv
    facing = opt("--facing", "left")
    H, W = a.shape[:2]
    h, s, v = hsv(a)
    duck = (s > 0.22) & (v > 0.2)                  # the grey sweep is s < 0.1; glossy highlights keep s > 0.25
    duck = ndimage.binary_opening(duck, iterations=2)
    lab, n = ndimage.label(duck)
    sizes = ndimage.sum(duck, lab, range(1, n + 1))
    duck = lab == (1 + int(np.argmax(sizes)))
    # cut the floor reflection: the base narrows to the contact, then the reflection widens again
    cnt = ndimage.uniform_filter1d(duck.sum(1).astype(float), 5)
    wmax = int(np.argmax(cnt))
    contact = next(y for y in range(wmax, H - 3) if cnt[y + 3] > cnt[y] + 1 or cnt[y] == 0)
    duck[contact + 1:] = False
    duck = ndimage.binary_closing(duck, iterations=18)
    duck = ndimage.binary_fill_holes(duck)
    bill = duck & (h < 28) & (s > 0.5)
    bill = ndimage.binary_closing(ndimage.binary_opening(bill, iterations=2), iterations=4)
    lab, n = ndimage.label(bill)
    if n:
        bill = lab == (1 + int(np.argmax(ndimage.sum(bill, lab, range(1, n + 1)))))
    ys, xs = np.nonzero(duck)
    bx0, bx1, by0, by1 = xs.min(), xs.max(), ys.min(), ys.max()
    bw, bh = bx1 - bx0, by1 - by0
    # the eye: the largest near-black blob inside the silhouette
    eye = duck & (v < 0.16)
    eye = ndimage.binary_opening(eye, iterations=2)
    lab, n = ndimage.label(eye)
    if n:
        eye = lab == (1 + int(np.argmax(ndimage.sum(eye, lab, range(1, n + 1)))))
    edt_in = ndimage.distance_transform_edt(duck)

    strokes = []  # (points, weight)
    for c in contours(duck):
        strokes.append((resample(c), 1.0))
    # the bill: only the part of its outline inside the silhouette (its base against the head, and the mouth line)
    for c in contours(bill):
        c = resample(c)
        inside = edt_in[np.clip(c[:, 1].astype(int), 0, H - 1), np.clip(c[:, 0].astype(int), 0, W - 1)] > 5
        runs = np.split(np.arange(len(c)), np.nonzero(np.diff(inside.astype(int)))[0] + 1)
        for r in runs:
            if inside[r[0]] and len(r) > 8:
                strokes.append((c[r], 0.85))
    def bez(p0, p1, p2, n=80):
        t = np.linspace(0, 1, n)[:, None]
        return (1 - t) ** 2 * np.array(p0) + 2 * (1 - t) * t * np.array(p1) + t ** 2 * np.array(p2)
    # the mouth: a short line along the bill, where the Cycles bill's two halves meet
    bys, bxs = np.nonzero(bill)
    if len(bxs):
        my = float(np.median(bys))
        strokes.append((bez((bxs.min() + 10, my), ((bxs.min() + bxs.max()) / 2, my + 3), (bxs.max() - 4, my - 1), 40), 0.6))
    # the wing, hand-placed over the body's side (the Cycles still's wing relief); mirrored for a duck facing right
    fx = (lambda u: bx0 + u * bw) if facing == "left" else (lambda u: bx1 - u * bw)
    strokes.append((bez((fx(0.36), by0 + 0.60 * bh), (fx(0.55), by0 + 0.93 * bh), (fx(0.86), by0 + 0.66 * bh)), 0.7))
    strokes.append((bez((fx(0.47), by0 + 0.63 * bh), (fx(0.64), by0 + 0.60 * bh), (fx(0.84), by0 + 0.645 * bh)), 0.45))
    # a soft ground line under the foot
    strokes.append((bez((bx0 + 0.02 * bw, by1 + 8), (bx0 + 0.5 * bw, by1 + 14), (bx1 + 0.06 * bw, by1 + 6)), 0.3))
    # the eye: a filled dot (its outline, then filled below)
    eye_c = ndimage.center_of_mass(eye) if eye.any() else (by0 + bh * 0.15, bx0 + bw * 0.25)
    eye_r = max(7.0, (eye.sum() / np.pi) ** 0.5 * 0.8) if eye.any() else 9.0
    # centre the drawing: the duck's bbox centred at (W/2, H/2 + 10), scaled to 0.74 (it has to sit inside a 2.36:1 crop)
    k = 1.0 if keep_pos else 0.74
    cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2
    tx, ty = (cx, cy) if keep_pos else (W / 2, H / 2 + 10)
    strokes = [((pts - [cx, cy]) * k + [tx, ty], wt) for pts, wt in strokes]
    eye_xy = ((eye_c[1] - cx) * k + tx, (eye_c[0] - cy) * k + ty)
    eye_r *= k

    # paper: off-white, faint tooth, a soft falloff
    rng = np.random.default_rng(1206)
    yy, xx = np.mgrid[0:H, 0:W]
    tooth = ndimage.gaussian_filter(rng.normal(0, 1, (H, W)), 0.8)
    fall = 1 - 0.07 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    paper = (0.935 + 0.012 * tooth) * fall
    base = np.stack([paper * 1.0, paper * 0.992, paper * 0.972], -1)

    ink = Image.new("L", (W, H), 0)
    order = np.full((H, W), np.inf, dtype=np.float32)
    total = sum(len(p) for p, _ in strokes)
    done = 0
    for p, wt in strokes:
        for pas in range(2):
            layer = Image.new("L", (W, H), 0)
            d = ImageDraw.Draw(layer)
            j = rng.normal(0, 0.9 + pas * 0.6, p.shape)
            j = ndimage.gaussian_filter1d(j, 6, axis=0)
            q = p + j + (pas * np.array([0.8, -0.6]))
            width = 4 if pas == 0 else 2
            val = int(255 * wt * (0.85 if pas == 0 else 0.45))
            d.line([tuple(x) for x in q], fill=val, width=width, joint="curve")
            la = np.asarray(layer)
            ink = Image.fromarray(np.maximum(np.asarray(ink), la))
            if pas == 0:
                # the order each pixel is laid down: its nearest point along this stroke
                idx = np.nonzero(la)
                if len(idx[0]):
                    pts = q
                    # nearest stroke point per inked pixel (chunked)
                    py, px = idx
                    best = np.empty(len(py), dtype=np.float32)
                    for k0 in range(0, len(py), 4096):
                        dy = py[k0:k0 + 4096, None] - pts[None, :, 1]
                        dx = px[k0:k0 + 4096, None] - pts[None, :, 0]
                        best[k0:k0 + 4096] = np.argmin(dx * dx + dy * dy, axis=1)
                    fr = (done + best) / total
                    order[py, px] = np.minimum(order[py, px], fr)
        done += len(p)
    de = ImageDraw.Draw(ink)
    ex, ey = eye_xy
    de.ellipse([ex - eye_r, ey - eye_r * 1.15, ex + eye_r, ey + eye_r * 1.15], fill=200)
    de.ellipse([ex - eye_r * 0.2, ey - eye_r * 0.75, ex + eye_r * 0.25, ey - eye_r * 0.3], fill=40)
    order[int(ey - eye_r * 1.3):int(ey + eye_r * 1.3), int(ex - eye_r * 1.2):int(ex + eye_r * 1.2)] = 0.97
    inkf = np.asarray(ink.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
    grain = 0.75 + 0.25 * (rng.random((H, W)) > 0.35)
    inkf = inkf * grain
    graphite = np.array([0.22, 0.225, 0.24])
    img = base * (1 - inkf[..., None]) + graphite * inkf[..., None]
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(out)
    if order_out:
        o = ndimage.grey_dilation(np.where(np.isfinite(order), order, 2.0), size=1)
        # spread each inked pixel's order into its soft edge and the second pass
        filled = np.where(np.isfinite(order), order, np.inf)
        dist, (iy, ix) = ndimage.distance_transform_edt(~np.isfinite(filled), return_indices=True)
        near = filled[iy, ix]
        near[dist > 6] = 2.0
        np.save(order_out, near.astype(np.float32))
        del o
    print(out, W, H, "strokes", len(strokes))


if __name__ == "__main__":
    main()
