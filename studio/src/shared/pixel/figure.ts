// MR. MAS — shared pixel engine: pixel "rig" figures. (Promoted from src/dev/pixeladv/core/figure.ts.)
// A figure is a stack of parts (integer-grid shapes) grouped into body parts. Each group is shaded in
// hand-set bands from its own silhouette: a key band toward the light, a shadow band away from it,
// a 1px rim on the lit edge and an optional back-rim from a second light. Faces and details are then
// hand-pixelled string stamps on top. Everything stays on the native grid — no scaling, no rotation.
import {Buf, ellipse, line, poly, rect} from './px';

export type Prim =
  | {k: 'poly'; pts: number[]}
  | {k: 'ell'; cx: number; cy: number; rx: number; ry: number}
  | {k: 'rect'; x: number; y: number; w: number; h: number}
  | {k: 'line'; x0: number; y0: number; x1: number; y1: number}
  | {k: 'map'; x: number; y: number; rows: string[]};

export const P = {
  poly: (...pts: number[]): Prim => ({k: 'poly', pts}),
  ell: (cx: number, cy: number, rx: number, ry: number): Prim => ({k: 'ell', cx, cy, rx, ry}),
  rect: (x: number, y: number, w: number, h: number): Prim => ({k: 'rect', x, y, w, h}),
  line: (x0: number, y0: number, x1: number, y1: number): Prim => ({k: 'line', x0, y0, x1, y1}),
  map: (x: number, y: number, rows: string | string[]): Prim => ({k: 'map', x, y, rows: Array.isArray(rows) ? rows : rows.split('\n').filter((r) => r.length)}),
};

export interface Part { group: string; mat: string; prims: Prim[]; erase?: boolean; tone?: number; }
/** Tone overrides applied after banding. tone = absolute ramp index, add = relative shift. */
export interface Adjust { prims: Prim[]; tone?: number; add?: number; mat?: string; onlyMat?: string; }
export type StampPal = Record<string, number | [string, number]>;
export interface Stamp { x: number; y: number; rows: string[]; pal: StampPal; }

export interface FigureDef { w: number; h: number; parts: Part[]; adjust?: Adjust[]; stamps?: Stamp[]; }

export interface LightRig {
  /** direction TOWARD the key light (screen coords) */
  key: [number, number];
  keyBand: number;
  shadowBand: number;
  /** 1px hot rim on the lit edge */
  rim?: boolean;
  /** shadow-side edge uses tone 0 (reads as an outline) */
  outline?: boolean;
  /** second light (back/rim) direction and colour per material, or null */
  back?: [number, number] | null;
  backRamp?: Record<string, number>;
  backBand?: number;
  /** per-material ramps [outline, shadow, mid, light, bright, rim] */
  ramps: Record<string, number[]>;
  /** apply rim/outline after tone adjustments (portrait mode: planes are painted, edges are automatic) */
  edgesOnTop?: boolean;
  /** materials that never receive automatic rim/outline (collars, insets) */
  noEdge?: string[];
  /** 0..1 key-light strength per local pixel (falloff); thins the key band and dithers the rim out */
  keyGain?: (x: number, y: number) => number;
  /** 0..1 back-light strength per local pixel */
  backGain?: (x: number, y: number) => number;
  /** per-group band overrides */
  groupBands?: Record<string, {key?: number; shadow?: number}>;
}

const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export interface Img { w: number; h: number; c: Int32Array; } // -1 = transparent

const raster = (p: Prim, plot: (x: number, y: number) => void) => {
  switch (p.k) {
    case 'poly': return poly(p.pts, plot);
    case 'ell': return ellipse(p.cx, p.cy, p.rx, p.ry, plot);
    case 'rect': return rect(p.x, p.y, p.w, p.h, plot);
    case 'line': return line(p.x0, p.y0, p.x1, p.y1, plot);
    case 'map': return p.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.' && r[i] !== ' ') plot(p.x + i, p.y + j); });
  }
};

export const renderFigure = (fig: FigureDef, rig: LightRig): Img => {
  const {w, h} = fig;
  const N = w * h;
  const matOf = new Array<string | null>(N).fill(null);
  const baseTone = new Int8Array(N).fill(2);
  const grpOf = new Array<string | null>(N).fill(null);
  const groups = new Map<string, Uint8Array>();
  for (const part of fig.parts) {
    let gm = groups.get(part.group);
    if (!gm) { gm = new Uint8Array(N); groups.set(part.group, gm); }
    const g = gm;
    for (const pr of part.prims)
      raster(pr, (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const i = y * w + x;
        if (part.erase) { matOf[i] = null; grpOf[i] = null; g[i] = 0; return; }
        g[i] = 1; matOf[i] = part.mat; grpOf[i] = part.group; baseTone[i] = part.tone ?? 2;
      });
  }
  const inG = (g: Uint8Array, x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && g[y * w + x] === 1;
  const march = (g: Uint8Array, x: number, y: number, d: [number, number], max: number) => {
    for (let k = 1; k <= max; k++) if (!inG(g, x + Math.round(d[0] * k), y + Math.round(d[1] * k))) return k;
    return max + 1;
  };
  const tone = new Int8Array(N).fill(-1);
  const backHit = new Uint8Array(N);
  const edge = new Int8Array(N).fill(-1);
  const nk: [number, number] = [-rig.key[0], -rig.key[1]];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const gname = grpOf[i];
      if (!gname) continue;
      const g = groups.get(gname)!;
      const gb = rig.groupBands?.[gname] ?? {};
      const kg = rig.keyGain ? rig.keyGain(x, y) : 1;
      const bzz = BAY[(y & 3) * 4 + (x & 3)];
      const kb = Math.round((gb.key ?? rig.keyBand) * kg), sb = gb.shadow ?? rig.shadowBand;
      const dL = march(g, x, y, rig.key, kb + 1);
      const dS = march(g, x, y, nk, sb + 1);
      let t = baseTone[i];
      if (kb > 0 || sb > 0) {
        if (dS <= sb) t = 1;
        if (rig.outline && dS === 1) t = 0;
        if (dL <= kb) t = 3;
        if (dL <= Math.max(1, Math.floor(kb / 3))) t = 4;
        if (rig.rim && dL === 1) t = kg > 0.6 ? 5 : kg > 0.3 ? Math.max(t, 3) : t;
      }
      tone[i] = t;
      if (rig.edgesOnTop) {
        if (rig.outline && dS === 1) edge[i] = 0;
        if (rig.rim && dL === 1) edge[i] = 5;
      }
      if (rig.back) {
        const dB = march(g, x, y, rig.back, rig.backBand ?? 1);
        const bg = rig.backGain ? rig.backGain(x, y) : 1;
        if (dB <= (rig.backBand ?? 1) && t < 4 && bg > 0.45 + bzz * 0.0) backHit[i] = 1;
      }
    }
  for (const a of fig.adjust ?? [])
    for (const pr of a.prims)
      raster(pr, (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const i = y * w + x;
        if (tone[i] < 0) return;
        if (a.onlyMat && matOf[i] !== a.onlyMat) return;
        if (a.mat) matOf[i] = a.mat;
        if (a.tone !== undefined) tone[i] = a.tone;
        if (a.add !== undefined) tone[i] = Math.max(0, Math.min(5, tone[i] + a.add));
        backHit[i] = a.tone !== undefined && a.tone <= 1 && !rig.edgesOnTop ? 0 : backHit[i];
      });
  if (rig.edgesOnTop) for (let i = 0; i < N; i++) if (edge[i] >= 0 && tone[i] >= 0 && !(rig.noEdge && rig.noEdge.includes(matOf[i] ?? ''))) { tone[i] = edge[i]; if (edge[i] === 5) backHit[i] = 0; }
  const c = new Int32Array(N).fill(-1);
  for (let i = 0; i < N; i++) {
    const m = matOf[i];
    if (!m || tone[i] < 0) continue;
    const r = rig.ramps[m];
    if (!r) continue;
    c[i] = backHit[i] && rig.backRamp?.[m] !== undefined ? rig.backRamp[m] : r[tone[i]];
  }
  for (const s of fig.stamps ?? [])
    s.rows.forEach((row, j) => {
      for (let k = 0; k < row.length; k++) {
        const ch = row[k];
        if (ch === '.' || ch === ' ') continue;
        const v = s.pal[ch];
        if (v === undefined) continue;
        const x = s.x + k, y = s.y + j;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const col = typeof v === 'number' ? v : rig.ramps[v[0]]?.[v[1]];
        if (col === undefined) continue;
        c[y * w + x] = col;
      }
    });
  return {w, h, c};
};

export const blitImg = (b: Buf, img: Img, x: number, y: number, opts: {flip?: boolean; clip?: (x: number, y: number) => boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (opts.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const px = x + i, py = y + j;
      if (opts.clip && !opts.clip(px, py)) continue;
      b.set(px, py, opts.map ? opts.map(v) : v);
      // shared-engine addition: record coverage (e.g. a Mask's .a array) — used for "freeze all but Mas"
      if (opts.mask && px >= 0 && py >= 0 && px < b.w && py < b.h) opts.mask[py * b.w + px] = 255;
    }
};

export const imgOpaque = (img: Img, i: number, j: number) => i >= 0 && j >= 0 && i < img.w && j < img.h && img.c[j * img.w + i] >= 0;
