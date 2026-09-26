// MR. MAS - style-range Prototype 1: a small pixel FORM shader for the foreground figure.
// Each part is a silhouette on the native grid. The silhouette is "inflated" (height from its distance to the edge),
// its normal is lit by the table's one lamp, and the result is quantized to the part's hand-ordered ramp in HARD bands
// (no dither on figures: PIXEL_GUIDE §2 rule 6). It gives a backlit figure the rim a lamp in front of him would give,
// following any silhouette, without a single smooth gradient. Hand-placed stamps go on top.
import {Buf, ellipse, poly, rect} from '../../../../shared/pixel/px';
import type {Img} from '../../../../shared/pixel/figure';

export type Shape = {k: 'poly'; pts: number[]} | {k: 'ell'; cx: number; cy: number; rx: number; ry: number} | {k: 'rect'; x: number; y: number; w: number; h: number};
export interface FormPart {
  shapes: Shape[];
  /** ramp: [outline, deep, shadow, mid, lit, hot] (6 master colours) */
  ramp: number[];
  /** inflation radius in native px (bigger = flatter) */
  R: number;
  /** band thresholds on n.L for tones 1..5 (defaults suit a backlit figure) */
  bands?: [number, number, number, number];
  /** draw a 1 px outline where the part meets the outside (or a part behind it) */
  outline?: boolean;
  /** suppress the outline on these sides (e.g. where the part runs off the frame) */
  noOutlineBelow?: number;
  /** add to the tone index inside these shapes (hand accents: creases, clumps) */
  accents?: Array<{shapes: Shape[]; add: number}>;
}

const raster = (s: Shape, w: number, h: number, m: Uint8Array) => {
  const plot = (x: number, y: number) => { if (x >= 0 && y >= 0 && x < w && y < h) m[y * w + x] = 1; };
  if (s.k === 'poly') poly(s.pts, plot);
  else if (s.k === 'ell') ellipse(s.cx, s.cy, s.rx, s.ry, plot);
  else rect(s.x, s.y, s.w, s.h, plot);
};

/** chamfer distance to the outside (3-4 metric / 3), capped */
const distance = (m: Uint8Array, w: number, h: number, cap: number) => {
  const INF = 1e9;
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = m[i] ? INF : 0;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[y * w + x]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x;
    if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
  }
  for (let i = 0; i < w * h; i++) d[i] = Math.min(cap, d[i] / 3);
  return d;
};

/**
 * Render a stack of parts (back to front) lit by direction L = [x, y, z] (screen x right, y down, z toward the
 * camera; a lamp in front of a figure seen from behind has z < 0).
 */
export const renderForm = (w: number, h: number, parts: FormPart[], L: [number, number, number]): Img => {
  const ll = Math.hypot(L[0], L[1], L[2]);
  const lx = L[0] / ll, ly = L[1] / ll, lz = L[2] / ll;
  const c = new Int32Array(w * h).fill(-1);
  const owner = new Int16Array(w * h).fill(-1);
  parts.forEach((pt, pi) => {
    const m = new Uint8Array(w * h);
    for (const s of pt.shapes) raster(s, w, h, m);
    const R = pt.R;
    const d = distance(m, w, h, R);
    const hgt = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) { const t = d[i] / R; hgt[i] = m[i] ? R * Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))) : 0; }
    // two box passes: chamfer steps would otherwise put a noisy seam on long gentle edges
    for (let pass = 0; pass < 2; pass++) {
      const tmp = new Float32Array(hgt);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!m[i]) continue;
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const X = x + dx, Y = y + dy;
          if (X < 0 || Y < 0 || X >= w || Y >= h) { n++; continue; }
          s += tmp[Y * w + X]; n++;
        }
        hgt[i] = s / n;
      }
    }
    const H = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : hgt[y * w + x]);
    const acc = new Int8Array(w * h);
    for (const a of pt.accents ?? []) {
      const am = new Uint8Array(w * h);
      for (const s of a.shapes) raster(s, w, h, am);
      for (let i = 0; i < w * h; i++) if (am[i]) acc[i] += a.add;
    }
    const [b1, b2, b3, b4] = pt.bands ?? [-0.35, 0.05, 0.42, 0.72];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!m[i]) continue;
      const gx = (H(x + 1, y) - H(x - 1, y)) / 2, gy = (H(x, y + 1) - H(x, y - 1)) / 2;
      const nl = Math.hypot(gx, gy, 1);
      const nx = -gx / nl, ny = -gy / nl, nz = 1 / nl;
      const v = nx * lx + ny * ly + nz * lz;
      let t = v < b1 ? 1 : v < b2 ? 2 : v < b3 ? 3 : v < b4 ? 4 : 5;
      t = Math.max(1, Math.min(5, t + acc[i]));
      const edge = pt.outline !== false && (!m[i - 1] || !m[i + 1] || !m[i - w] || !m[i + w]) && (pt.noOutlineBelow === undefined || y < pt.noOutlineBelow);
      c[i] = edge && t < 4 ? pt.ramp[0] : pt.ramp[t];
      owner[i] = pi;
    }
  });
  return {w, h, c};
};

/** stamp hand-placed pixels over an image: rows of chars, pal maps a char to a colour */
export const stampImg = (img: Img, x: number, y: number, rows: string[], pal: Record<string, number>) => {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const v = pal[r[i]];
      if (v === undefined) continue;
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= img.w || Y >= img.h) continue;
      img.c[Y * img.w + X] = v;
    }
  });
};

export const blitForm = (b: Buf, img: Img, x: number, y: number) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + i];
    if (v >= 0) b.set(x + i, y + j, v);
  }
};
