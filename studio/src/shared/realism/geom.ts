// Realism kit — geometry helpers (builder key: realism). Pure functions, deterministic.
// Points are [x, y] or [x, y, k] where k scales the spline tension at that point (0 = sharp corner, 1 = default).

export type P = [number, number] | [number, number, number];

const tk = (p: P) => (p.length > 2 ? (p[2] as number) : 1);
const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** Catmull-Rom spline through points, as an SVG path (cubic Béziers). */
export function spline(pts: P[], closed = true, tension = 1): string {
  const n = pts.length;
  if (n < 2) return '';
  const get = (i: number): P => {
    if (closed) return pts[(i + n) % n];
    return pts[Math.max(0, Math.min(n - 1, i))];
  };
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const k1 = (tk(p1) * tension) / 6, k2 = (tk(p2) * tension) / 6;
    const c1x = p1[0] + (p2[0] - p0[0]) * k1, c1y = p1[1] + (p2[1] - p0[1]) * k1;
    const c2x = p2[0] - (p3[0] - p1[0]) * k2, c2y = p2[1] - (p3[1] - p1[1]) * k2;
    d += `C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  if (closed) d += 'Z';
  return d;
}

/** Sample the Catmull-Rom spline into a polyline (n samples per segment). */
export function sample(pts: P[], closed = false, per = 12, tension = 1): [number, number][] {
  const n = pts.length;
  const get = (i: number): P => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const out: [number, number][] = [];
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const k1 = (tk(p1) * tension) / 6, k2 = (tk(p2) * tension) / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k1, p1[1] + (p2[1] - p0[1]) * k1];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k2, p2[1] - (p3[1] - p1[1]) * k2];
    for (let j = 0; j < per; j++) {
      const t = j / per, u = 1 - t;
      const x = u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0];
      const y = u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1];
      out.push([x, y]);
    }
  }
  if (!closed) out.push([pts[n - 1][0], pts[n - 1][1]]);
  return out;
}

/** Polyline to path. */
export function poly(pts: [number, number][], closed = true): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join('') + (closed ? 'Z' : '');
}

/**
 * Tapered stroke outline along a spline: width profile w(t) = w0..w1 with a sine swell.
 * `w` = max width, `a`/`b` = start/end width fractions, `bias` shifts the swell peak (0.5 centre).
 */
export function taper(pts: P[], w: number, a = 0.05, b = 0.05, bias = 0.5, per = 10): string {
  const s = sample(pts, false, per);
  const n = s.length;
  if (n < 2) return '';
  const L: [number, number][] = [], R: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const pa = s[Math.max(0, i - 1)], pb = s[Math.min(n - 1, i + 1)];
    let dx = pb[0] - pa[0], dy = pb[1] - pa[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    // swell: 0 at ends -> 1 at bias
    const tt = t < bias ? (t / bias) * 0.5 : 0.5 + ((t - bias) / (1 - bias)) * 0.5;
    const sw = Math.sin(Math.PI * tt);
    const base = t < bias ? a + (1 - a) * sw : b + (1 - b) * sw;
    const hw = (w * Math.max(base, 0)) / 2;
    L.push([s[i][0] - dy * hw, s[i][1] + dx * hw]);
    R.push([s[i][0] + dy * hw, s[i][1] - dx * hw]);
  }
  return poly([...L, ...R.reverse()], true);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Blend two equal-length point lists. */
export function mix(A: P[], B: P[], t: number): P[] {
  return A.map((p, i) => {
    const q = B[i] ?? p;
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), tk(p)] as P;
  });
}
/** Translate / scale point lists. */
export const tr = (A: P[], dx: number, dy: number, s = 1): P[] => A.map((p) => [p[0] * s + dx, p[1] * s + dy, tk(p)] as P);

/** Seeded PRNG (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ease helpers. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
/** 0..1 ramp between frames a..b (clamped). */
export const ramp = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
