// MR. MAS — mcoldopen: small painting helpers (stepped light, emissive cities, image utilities).
// Light is always a stepped palette choice with an ordered-dither seam, never a blend.
import {Buf, bayer, hash, rect} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import type {Img} from '../../shared/pixel/figure';

/** Stepped elliptical light pool: rings = [[radius 0..1, colour], ...] from outer to inner. */
export const ringPool = (
  b: Buf, cx: number, cy: number, rx: number, ry: number, rings: Array<[number, number]>,
  test: (x: number, y: number) => boolean = () => true, seam = 0.35,
) => {
  const x0 = Math.floor(cx - rx), x1 = Math.ceil(cx + rx), y0 = Math.floor(cy - ry), y1 = Math.ceil(cy + ry);
  for (let y = Math.max(0, y0); y <= Math.min(b.h - 1, y1); y++)
    for (let x = Math.max(0, x0); x <= Math.min(b.w - 1, x1); x++) {
      if (!test(x, y)) continue;
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      let c = -1;
      for (let k = 0; k < rings.length; k++) {
        const [r, col] = rings[k];
        const next = k + 1 < rings.length ? rings[k + 1][0] : 0;
        const band = (r - next) * seam;
        if (d < r - band || (d < r && bayer(x, y) < (r - d) / band)) c = col;
      }
      if (c >= 0) b.set(x, y, c);
    }
};

/** Box light: distance to a rectangle drives the rings (a monitor as an area light). */
export const boxPool = (
  b: Buf, bx: number, by: number, bw: number, bh: number, reach: [number, number], rings: Array<[number, number]>,
  test: (x: number, y: number) => boolean = () => true, bias: (x: number, y: number) => number = () => 1, seam = 0.4,
) => {
  for (let y = 0; y < b.h; y++)
    for (let x = 0; x < b.w; x++) {
      if (!test(x, y)) continue;
      const dx = Math.max(bx - x, 0, x - (bx + bw)), dy = Math.max(by - y, 0, y - (by + bh));
      const d = Math.hypot(dx / reach[0], dy / reach[1]) / bias(x, y);
      let c = -1;
      for (let k = 0; k < rings.length; k++) {
        const [r, col] = rings[k];
        const next = k + 1 < rings.length ? rings[k + 1][0] : 0;
        const band = (r - next) * seam;
        if (d < r - band || (d < r && bayer(x, y) < (r - d) / band)) c = col;
      }
      if (c >= 0) b.set(x, y, c);
    }
};

/** Deterministic lit windows inside a building face. */
export const litWindows = (b: Buf, x: number, y: number, w: number, h: number, seed: number, f: number, o: {px?: number; py?: number; density?: number; warm?: number} = {}) => {
  const px = o.px ?? 3, py = o.py ?? 3, den = o.density ?? 0.18;
  for (let j = y + 2; j < y + h - 1; j += py)
    for (let i = x + 1; i < x + w - 1; i += px) {
      const hh = hash(i, j, seed);
      if (hh > den) continue;
      // a rare window changes state every ~2 s (the city is alive, never twinkling)
      if (hash(i, j, seed + 1 + Math.floor((f + i * 7) / 48)) < 0.06) continue;
      const k = hash(j, i, seed + 3);
      b.set(i, j, k < (o.warm ?? 0.55) ? (k < 0.18 ? PAL.W6 : PAL.W4) : k < 0.85 ? PAL.C4 : PAL.P0);
    }
};

// ------------------------------------------------------------------ images
export const newImg = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});

/** Extend an image downward by n rows, continuing its last row and stepping it darker with depth. */
export const extendDown = (img: Img, n: number, steps: Array<[number, number]> = [[14, -1], [34, -2]]): Img => {
  const out = newImg(img.w, img.h + n);
  out.c.set(img.c);
  const last = img.h - 1;
  for (let j = 0; j < n; j++) {
    let k = 0;
    for (const [at, s] of steps) if (j >= at) k = s;
    for (let i = 0; i < img.w; i++) {
      const v = img.c[last * img.w + i];
      if (v < 0) continue;
      out.c[(img.h + j) * img.w + i] = k ? stepColor(v, k) : v;
    }
  }
  return out;
};

/** Row shear of the top of an image: rows above `seams[k][0]` shift by seams[k][1] px (a 1-2px head tilt). */
export const shearTop = (img: Img, seams: Array<[number, number]>): Img => {
  const out = newImg(img.w, img.h);
  for (let y = 0; y < img.h; y++) {
    let d = 0;
    for (const [row, s] of seams) if (y < row) d = s;
    for (let x = 0; x < img.w; x++) {
      const sx = x - d;
      out.c[y * img.w + x] = sx >= 0 && sx < img.w ? img.c[y * img.w + sx] : -1;
    }
  }
  return out;
};

/** Fill a rect only where the pixel currently equals `under` (paint behind already-drawn things). */
export const rectUnder = (b: Buf, x: number, y: number, w: number, h: number, col: number, under: number) =>
  rect(x, y, w, h, (px, py) => { if (b.get(px, py) === under) b.set(px, py, col); });

/** Cinematic edge falloff: one palette rung darker toward the corners, with a dithered seam. */
export const vignette = (b: Buf, strength = 1, rx = 0.62, ry = 0.66) => {
  for (let y = 0; y < b.h; y++)
    for (let x = 0; x < b.w; x++) {
      const d = Math.hypot((x + 0.5 - b.w / 2) / (b.w * rx), (y + 0.5 - b.h / 2) / (b.h * ry));
      const t = (d - 0.78) / 0.3 + (bayer(x, y) - 0.5) * 0.5;
      if (t > 0) b.c[y * b.w + x] = stepColor(b.c[y * b.w + x], t > 1.2 && strength > 1 ? -2 : -1);
    }
};
