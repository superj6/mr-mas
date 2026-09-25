// MR. MAS — meras: a tiny 1-bit figure renderer for the 1993 close shot.
// Parts are integer-grid shapes with a MATERIAL and a VOLUME (ellipsoid or cylinder) that supplies a normal.
// Light is one direction (the computer screen). The lit value is quantised to the material's pattern
// ladder, so shading comes out as clean bands of MacPaint patterns, then a 1px ink contour is drawn and
// hand-placed stamps (eyes, mouth, ear, cowlick) go on top. Nothing is scaled or rotated.
import {Buf, poly, ellipse, rect} from '../../shared/pixel/px';
import {INK, PAPER, LV, Pat} from './bit';

export type Vol =
  | {k: 'ell'; cx: number; cy: number; rx: number; ry: number; rz?: number}
  | {k: 'cyl'; cx: number; rx: number; bulge?: number}
  | {k: 'flat'; nx: number; ny: number; nz: number};

export type Shape = {k: 'poly'; pts: number[]} | {k: 'ell'; cx: number; cy: number; rx: number; ry: number} | {k: 'rect'; x: number; y: number; w: number; h: number};
export const S = {
  poly: (...pts: number[]): Shape => ({k: 'poly', pts}),
  ell: (cx: number, cy: number, rx: number, ry: number): Shape => ({k: 'ell', cx, cy, rx, ry}),
  rect: (x: number, y: number, w: number, h: number): Shape => ({k: 'rect', x, y, w, h}),
};

export interface BitPart {
  mat: string;
  shapes: Shape[];
  vol: Vol;
  /** tone offset (-1..1) for this part */
  bias?: number;
  /** cut this shape out of what is already drawn (transparent) */
  erase?: boolean;
}

/** A material maps a light value 0..1 to a ladder level via ascending thresholds. */
export interface BitMat {
  /** [threshold, level]: first entry whose threshold <= value wins (sorted high -> low) */
  steps: Array<[number, number]>;
  /** optional texture overlay: returns 'ink' | 'paper' | null per pixel (local coords) */
  tex?: (x: number, y: number, v: number) => 'ink' | 'paper' | null;
  /** draw the contour on this material's silhouette edge */
  contour?: boolean;
}

export interface BitFig {
  w: number; h: number;
  parts: BitPart[];
  light: [number, number, number];
  mats: Record<string, BitMat>;
  /** stamps drawn after shading+contour. legend: '#' ink, 'o' paper, 'x' erase(transparent) */
  stamps?: Array<{x: number; y: number; rows: string[]}>;
}

/** Rendered 1-bit image: -1 transparent, else INK / PAPER. Also the material id per pixel. */
export interface BitImg { w: number; h: number; c: Int32Array; }

const norm = (v: [number, number, number]): [number, number, number] => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

const volNormal = (v: Vol, x: number, y: number): [number, number, number] => {
  if (v.k === 'flat') return norm([v.nx, v.ny, v.nz]);
  if (v.k === 'cyl') {
    const u = Math.max(-0.98, Math.min(0.98, (x - v.cx) / v.rx));
    return norm([u, -(v.bulge ?? 0), Math.sqrt(1 - u * u)]);
  }
  const u = (x - v.cx) / v.rx, w = (y - v.cy) / v.ry;
  const d = Math.min(0.98, u * u + w * w);
  const z = Math.sqrt(1 - d) * (v.rz ?? 1);
  return norm([u, w, z]);
};

const raster = (s: Shape, plot: (x: number, y: number) => void) => {
  if (s.k === 'poly') poly(s.pts, plot);
  else if (s.k === 'ell') ellipse(s.cx, s.cy, s.rx, s.ry, plot);
  else rect(s.x, s.y, s.w, s.h, plot);
};

/**
 * Render the figure. Returns colours in LOCAL coordinates; patterns are resolved in SCREEN space when
 * blitted (so textures stay locked to the screen like the real thing) — hence we store level + material.
 */
export interface BitFigImg { w: number; h: number; lvl: Int8Array; mat: Int16Array; tex: Int8Array; }

export const renderBitFig = (f: BitFig): BitFigImg => {
  const N = f.w * f.h;
  const lvl = new Int8Array(N).fill(-1);
  const mat = new Int16Array(N).fill(-1);
  const tex = new Int8Array(N).fill(0); // 1 ink, 2 paper forced by texture/stamp/contour
  const matNames = Object.keys(f.mats);
  const L = norm(f.light);
  for (const part of f.parts) {
    const mi = matNames.indexOf(part.mat);
    const m = f.mats[part.mat];
    for (const s of part.shapes)
      raster(s, (x, y) => {
        if (x < 0 || y < 0 || x >= f.w || y >= f.h) return;
        const i = y * f.w + x;
        if (part.erase) { lvl[i] = -1; mat[i] = -1; tex[i] = 0; return; }
        const n = volNormal(part.vol, x + 0.5, y + 0.5);
        let v = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) + (part.bias ?? 0);
        v = Math.max(0, Math.min(1, v));
        let level = m.steps[m.steps.length - 1][1];
        for (const [t, l] of m.steps) if (v >= t) { level = l; break; }
        lvl[i] = level; mat[i] = mi; tex[i] = 0;
        if (m.tex) { const t = m.tex(x, y, v); tex[i] = t === 'ink' ? 1 : t === 'paper' ? 2 : 0; }
      });
  }
  // contour: ink on silhouette pixels (4-neighbour touches transparent), for materials that want it
  const src = lvl.slice();
  const op = (x: number, y: number) => x >= 0 && y >= 0 && x < f.w && y < f.h && src[y * f.w + x] >= 0;
  for (let y = 0; y < f.h; y++)
    for (let x = 0; x < f.w; x++) {
      const i = y * f.w + x;
      if (src[i] < 0) continue;
      const m = f.mats[matNames[mat[i]]];
      if (m.contour === false) continue;
      if (!op(x - 1, y) || !op(x + 1, y) || !op(x, y - 1) || !op(x, y + 1)) tex[i] = 1;
    }
  for (const st of f.stamps ?? [])
    st.rows.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) {
        const ch = r[i];
        if (ch === ' ' || ch === '.') continue;
        const x = st.x + i, y = st.y + j;
        if (x < 0 || y < 0 || x >= f.w || y >= f.h) continue;
        const k = y * f.w + x;
        if (ch === 'x') { lvl[k] = -1; mat[k] = -1; tex[k] = 0; continue; }
        if (lvl[k] < 0) { lvl[k] = 8; mat[k] = 0; }
        tex[k] = ch === '#' ? 1 : ch === 'o' ? 2 : tex[k];
        if (ch === ':') { tex[k] = 0; lvl[k] = 4; }
        if (ch === ';') { tex[k] = 0; lvl[k] = 5; }
        if (ch === '%') { tex[k] = 0; lvl[k] = 3; }
      }
    });
  return {w: f.w, h: f.h, lvl, mat, tex};
};

/** Blit with patterns resolved in screen space. `mask` receives 255 where the figure is opaque. */
export const blitBitFig = (b: Buf, img: BitFigImg, x: number, y: number, opts: {mask?: Uint8Array; clip?: (x: number, y: number) => boolean; halo?: boolean} = {}) => {
  if (opts.halo) {
    // early-Mac sprite halo: a 1px paper keyline where the figure meets the ground
    const op = (i: number, j: number) => i >= 0 && j >= 0 && i < img.w && j < img.h && img.lvl[j * img.w + i] >= 0;
    for (let j = -1; j <= img.h; j++)
      for (let i = -1; i <= img.w; i++) {
        if (op(i, j)) continue;
        if (!(op(i - 1, j) || op(i + 1, j) || op(i, j - 1) || op(i, j + 1))) continue;
        const X = x + i, Y = y + j;
        if (X < 0 || Y < 0 || X >= b.w || Y >= b.h) continue;
        if (opts.clip && !opts.clip(X, Y)) continue;
        b.c[Y * b.w + X] = PAPER;
        if (opts.mask) opts.mask[Y * b.w + X] = 255;
      }
  }
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const k = j * img.w + i;
      const l = img.lvl[k];
      if (l < 0) continue;
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= b.w || Y >= b.h) continue;
      if (opts.clip && !opts.clip(X, Y)) continue;
      const t = img.tex[k];
      const inkPx = t === 1 ? true : t === 2 ? false : (LV[l] as Pat)(X, Y);
      b.c[Y * b.w + X] = inkPx ? INK : PAPER;
      if (opts.mask) opts.mask[Y * b.w + X] = 255;
    }
};
