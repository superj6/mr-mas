/** Small geometry + timing helpers for the comic structure. Deterministic only. */
export type Pt = readonly [number, number] | readonly [number, number, number];
const f = (v: number) => (Math.round(v * 10) / 10).toString();

/** Smooth path through points (Catmull-Rom -> cubic). A 3rd value of 1 marks a hard corner. */
export const sp = (pts: Pt[], closed = true): string => {
  const n = pts.length;
  const at = (i: number): Pt => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = p1[2] ? [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
};
/** Straight polygon / polyline. */
export const pl = (pts: Pt[], closed = true) => 'M ' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ') + (closed ? ' Z' : '');
export const ell = (cx: number, cy: number, rx: number, ry: number) => `M ${f(cx - rx)} ${f(cy)} a ${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a ${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
export const rc = (x: number, y: number, w: number, h: number) => `M ${f(x)} ${f(y)} H ${f(x + w)} V ${f(y + h)} H ${f(x)} Z`;
export const quad = (a: Pt, b: Pt, c: Pt, d: Pt) => pl([a, b, c, d]);

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
export const smooth = (t: number) => {
  const u = clamp(t);
  return u * u * (3 - 2 * u);
};
export const easeOut = (t: number, p = 3) => 1 - Math.pow(1 - clamp(t), p);
export const easeIn = (t: number, p = 3) => Math.pow(clamp(t), p);
export const easeInOut = (t: number) => {
  const u = clamp(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
export const backOut = (t: number, s = 1.9) => {
  const u = clamp(t) - 1;
  return 1 + (s + 1) * u * u * u + s * u * u;
};
/** Damped spring response 0 -> 1 (overshoots). */
export const spring = (t: number, freq = 2.2, damp = 5) => {
  if (t <= 0) return 0;
  return 1 - Math.exp(-damp * t) * Math.cos(freq * Math.PI * 2 * t);
};
/** Window: 0 before a, ramps to 1 over [a, a+r], holds, ramps down over [b-r, b]. */
export const win = (x: number, a: number, b: number, r: number) => clamp(Math.min((x - a) / r, (b - x) / r));

export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Smooth 1D value noise in [-1, 1]. */
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const t = x - i;
  const a = hash(i + seed * 101) * 2 - 1;
  const b = hash(i + 1 + seed * 101) * 2 - 1;
  const u = t * t * (3 - 2 * t);
  return a + (b - a) * u;
};
/** Held-drawing time: quantize a frame to 'twos' / 'threes' (animation on 2s). */
export const onN = (frame: number, n = 2) => Math.floor(frame / n) * n;
