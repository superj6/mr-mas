/**
 * COLLAGE structure (builder key: collage) — shared math + timing helpers. Deterministic only.
 */
export const W = 1920;
export const H = 1080;

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t: number, p = 3) => 1 - Math.pow(1 - clamp(t), p);
export const easeIn = (t: number, p = 3) => Math.pow(clamp(t), p);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Overshoot ease. */
export const easeBack = (t: number, s = 1.7) => {
  const x = clamp(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};
/** Damped spring response to a step at t=0 (t in frames), 0 -> 1 with overshoot. */
export const spring = (t: number, freq = 0.22, damp = 0.18) => {
  if (t <= 0) return 0;
  return 1 - Math.exp(-damp * t) * Math.cos(freq * t * Math.PI);
};
/** Decaying oscillation kick (0 at rest), for jolts. */
export const kick = (t: number, freq = 0.5, damp = 0.28) => (t < 0 ? 0 : Math.exp(-damp * t) * Math.sin(freq * t * Math.PI));

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const hash = (a: number, b = 0, c = 0) => {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
export const strHash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Piecewise-linear keyframes [[frame, value], ...] with optional per-segment easing. */
export type Key = [number, number] | [number, number, (t: number) => number];
export const keys = (f: number, k: Key[]): number => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i][0]) {
      const [f0, v0] = k[i - 1];
      const [f1, v1, e] = k[i];
      const t = (f - f0) / (f1 - f0 || 1);
      return v0 + (v1 - v0) * (e ? e(t) : t);
    }
  }
  return k[k.length - 1][1];
};
/** Step (held) keys: value of the last key at or before f. */
export const hold = <T,>(f: number, k: [number, T][]): T => {
  let v = k[0][1];
  for (const [kf, kv] of k) if (f >= kf) v = kv;
  return v;
};

/** Shoot on twos: quantize a frame to even frames (cut-out animation is shot on 2s). */
export const on2 = (f: number) => Math.floor(f / 2) * 2;
export const on3 = (f: number) => Math.floor(f / 3) * 3;

/**
 * "Rostrum boil": every cut-out is re-laid under the camera between exposures, so each piece shifts by a
 * hair on every other frame. Returns a tiny [dx, dy, rot] for a piece id.
 */
export const boil = (id: string, f: number, amt = 1): [number, number, number] => {
  const s = strHash(id);
  const k = Math.floor(f / 2);
  return [(hash(s, k, 1) - 0.5) * 1.1 * amt, (hash(s, k, 2) - 0.5) * 1.1 * amt, (hash(s, k, 3) - 0.5) * 0.22 * amt];
};

/**
 * Engraving line pitch in LOCAL units for a piece drawn at `pxPerUnit` screen px per unit.
 * The line count adapts to the output raster (window.devicePixelRatio = Remotion --scale), like a
 * printer's line screen: lines never drop under ~MIN_DEV device px, so the half-res MP4 stays moire-free.
 */
const MIN_DEV = 4.9;
export const dpr = () => (typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1);
export const pitchFor = (pxPerUnit: number, basePx = 5.2) => Math.max(basePx, MIN_DEV / dpr()) / pxPerUnit;

export type P2 = [number, number];
export const f2 = (v: number) => (Math.round(v * 100) / 100).toString();
export const polyD = (pts: P2[], close = true) => 'M ' + pts.map(([x, y]) => `${f2(x)} ${f2(y)}`).join(' L ') + (close ? ' Z' : '');
/** Smooth closed path through points (Catmull-Rom -> cubic). 3rd value 1 = hard corner. */
export const smoothD = (pts: (P2 | [number, number, number])[], closed = true): string => {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f2(pts[0][0])} ${f2(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = (p1 as number[])[2] ? [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = (p2 as number[])[2] ? [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
};
export const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${f2(cx - rx)} ${f2(cy)} a ${f2(rx)} ${f2(ry)} 0 1 0 ${f2(rx * 2)} 0 a ${f2(rx)} ${f2(ry)} 0 1 0 ${f2(-rx * 2)} 0 Z`;
export const rectD = (x: number, y: number, w: number, h: number) => `M ${f2(x)} ${f2(y)} H ${f2(x + w)} V ${f2(y + h)} H ${f2(x)} Z`;
