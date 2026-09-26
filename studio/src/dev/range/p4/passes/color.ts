// MR. MAS · range passes (prototype 4): palette math shared by every pass.
// Every pass writes master-palette colours only. These helpers pick the nearest master colour in OKLab, average a
// block of pixels in linear light and snap the result back, and walk colours toward a target look (lift, cap,
// desaturate) without ever leaving the palette. Pure: no DOM, no Math.random.
import {ALL_COLORS, toLinear, linToOklab, oklab, fromLinear} from '../../../../shared/pixel/palette';

type Lab = [number, number, number];
const LAB: Array<[number, Lab]> = ALL_COLORS.map((c) => [c, oklab(c)]);

/** nearest master colour to an OKLab triple (optionally from a pool of master colours) */
export const nearestLab = (L: number, a: number, b: number, pool?: Array<[number, Lab]>): number => {
  const src = pool ?? LAB;
  let best = src[0][0], bd = Infinity;
  for (const [c, [l2, a2, b2]] of src) {
    const d = (L - l2) * (L - l2) * 1.0 + (a - a2) * (a - a2) + (b - b2) * (b - b2);
    if (d < bd) { bd = d; best = c; }
  }
  return best;
};
export const poolOf = (cols: number[]): Array<[number, Lab]> => cols.map((c) => [c, oklab(c)]);

const avgCache = new Map<number, number>();
/** average colours in linear light, snap to the master palette (cached on a 6-bit-per-channel key) */
export const averageSnap = (cols: ArrayLike<number>, n = cols.length): number => {
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < n; i++) { const [lr, lg, lb] = toLinearCached(cols[i]); r += lr; g += lg; b += lb; }
  r /= n; g /= n; b /= n;
  const qr = q6(r), qg = q6(g), qb = q6(b);
  const key = (qr << 12) | (qg << 6) | qb;
  const hit = avgCache.get(key);
  if (hit !== undefined) return hit;
  // the snap is computed from the QUANTISED average, so the result is a pure function of the cache key: the same
  // pixels give the same colour whatever order frames are rendered in (Remotion's workers vs the Node preview)
  const [L, A, B] = linToOklab(dq6(qr), dq6(qg), dq6(qb));
  const c = nearestLab(L, A, B);
  avgCache.set(key, c);
  return c;
};
const q6 = (v: number) => Math.max(0, Math.min(63, Math.round(Math.sqrt(Math.max(0, v)) * 63)));
const dq6 = (q: number) => (q / 63) * (q / 63);
const linCache = new Map<number, [number, number, number]>();
export const toLinearCached = (c: number): [number, number, number] => {
  let v = linCache.get(c);
  if (!v) { v = toLinear(c); linCache.set(c, v); }
  return v;
};
export const labCached = (() => {
  const m = new Map<number, Lab>();
  return (c: number): Lab => { let v = m.get(c); if (!v) { v = oklab(c); m.set(c, v); } return v; };
})();

/**
 * A colour grade expressed as a per-colour lookup into the master palette: lightness through a curve, chroma scaled,
 * hue optionally pulled toward a tint. Built once per grade (74 entries), applied as a table.
 */
export interface Grade { lo: number; hi: number; gamma?: number; chroma: number; tint?: [number, number]; tintAmt?: number; pool?: number[] }
export const buildGrade = (g: Grade): Map<number, number> => {
  const pool = g.pool ? poolOf(g.pool) : undefined;
  const out = new Map<number, number>();
  for (const c of ALL_COLORS) {
    const [L, a, b] = oklab(c);
    const t = Math.pow(Math.max(0, Math.min(1, L)), g.gamma ?? 1);
    const L2 = g.lo + (g.hi - g.lo) * t;
    let a2 = a * g.chroma, b2 = b * g.chroma;
    if (g.tint && g.tintAmt) { a2 += (g.tint[0] - a2) * g.tintAmt; b2 += (g.tint[1] - b2) * g.tintAmt; }
    out.set(c, nearestLab(L2, a2, b2, pool));
  }
  return out;
};
export const applyGrade = (buf: {w: number; h: number; c: Uint32Array}, grade: Map<number, number>, x0 = 0, y0 = 0, w = buf.w, h = buf.h) => {
  for (let y = Math.max(0, y0); y < Math.min(buf.h, y0 + h); y++)
    for (let x = Math.max(0, x0); x < Math.min(buf.w, x0 + w); x++) {
      const i = y * buf.w + x;
      const v = grade.get(buf.c[i]);
      if (v !== undefined) buf.c[i] = v;
    }
};
export {fromLinear};
