// SATIRE (latex-puppet) structure — geometry + timing helpers. Owned by the `satire` builder.
import {noise2D} from '@remotion/noise';

export type XY = [number, number];
export type Mapper = (x: number, y: number) => XY;

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Catmull-Rom spline through points -> cubic bezier path (closed by default). */
export const blob = (pts: XY[], closed = true, k = 1 / 6): string => {
  const n = pts.length;
  if (n < 2) return '';
  const get = (i: number) => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const f = (v: number) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])} `;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += `C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])} `;
  }
  return closed ? d + 'Z' : d;
};

/** Points on an ellipse (for mapping through a projection before splining). */
export const ellPts = (cx: number, cy: number, rx: number, ry: number, n = 12, rot = 0): XY[] => {
  const out: XY[] = [];
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    out.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return out;
};

export const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

/** Map points through f, then spline. */
export const sb = (pts: XY[], f: Mapper, closed = true) => blob(pts.map(([x, y]) => f(x, y)), closed);

/** Ellipsoid depth (0 outside). */
export const ellZ = (x: number, y: number, cx: number, cy: number, a: number, b: number, c: number) => {
  const u = (x - cx) / a;
  const v = (y - cy) / b;
  const r = 1 - u * u - v * v;
  return r > 0 ? c * Math.sqrt(r) : 0;
};
export const gauss = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
  Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2) / 2);

export interface ProjView {
  yaw: number; // radians, + = face turns to screen-right
  pitch: number; // radians, + = face tilts up
}
/** Rotate a sculpt-space point with depth z by yaw/pitch (orthographic). */
export const rot3 = (x: number, y: number, z: number, v: ProjView): XY => {
  const cy = Math.cos(v.yaw);
  const sy = Math.sin(v.yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(v.pitch);
  const sp = Math.sin(v.pitch);
  const y2 = y * cp - z1 * sp;
  return [x1, y2];
};

/** Keyframe interpolation: [[frame, value], ...] with optional per-segment ease. */
export const kf = (t: number, keys: [number, number][], ease: (x: number) => number = smooth): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (t <= f1) return lerp(v0, v1, ease((t - f0) / (f1 - f0)));
  }
  return keys[keys.length - 1][1];
};
/** Linear keyframes (puppet jaw flaps are linear and snappy). */
export const kfl = (t: number, keys: [number, number][]) => kf(t, keys, (x) => x);

/** Damped spring response to an impulse at t0 (0 before). */
export const ring = (t: number, t0: number, freq = 0.45, damp = 0.12) => {
  const d = t - t0;
  if (d < 0) return 0;
  return Math.sin(d * freq) * Math.exp(-d * damp);
};

/** Deterministic smooth wobble. */
export const wob = (seed: string, t: number, speed = 0.05, amp = 1) => noise2D(seed, t * speed, 0) * amp;

/** Colour mix of two hex colours. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(t))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
};

/** Force clockwise (screen space, y down) winding so multi-subpath silhouettes union under nonzero fill. */
export const cw = (pts: XY[]): XY[] => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a >= 0 ? pts : [...pts].reverse();
};
