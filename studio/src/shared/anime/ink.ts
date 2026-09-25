/**
 * ANIME INK KIT
 * Authoring primitive = a list of points. The same list builds both a smooth fill (Catmull-Rom -> cubic
 * Bezier) and a tapered, variable-weight ink line (a filled polygon whose width follows a pressure
 * profile, "iri-nuki" in/out taper like a real pen stroke). A point with a 3rd element (e.g. [x, y, 1])
 * is a sharp corner (hair tips, chin, lash flick).
 */
export type Pt = readonly [number, number] | readonly [number, number, number];
export type V2 = [number, number];
type Seg = [V2, V2, V2, V2];

const r1 = (n: number) => Math.round(n * 10) / 10;
const isCorner = (p: Pt) => p.length > 2 && !!p[2];

export const bez = (pts: readonly Pt[], closed = false, k = 1): Seg[] => {
  const n = pts.length;
  const get = (i: number): Pt => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const out: Seg[] = [];
  const count = closed ? n : n - 1;
  for (let i = 0; i < count; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const k1 = isCorner(p1) ? 0 : k;
    const k2 = isCorner(p2) ? 0 : k;
    out.push([
      [p1[0], p1[1]],
      [p1[0] + ((p2[0] - p0[0]) / 6) * k1, p1[1] + ((p2[1] - p0[1]) / 6) * k1],
      [p2[0] - ((p3[0] - p1[0]) / 6) * k2, p2[1] - ((p3[1] - p1[1]) / 6) * k2],
      [p2[0], p2[1]],
    ]);
  }
  return out;
};

/** Smooth SVG path through points (closed by default). */
export const curve = (pts: readonly Pt[], closed = true): string => {
  const s = bez(pts, closed);
  if (!s.length) return '';
  let d = `M${r1(s[0][0][0])} ${r1(s[0][0][1])}`;
  for (const [, c1, c2, p] of s) d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p[0])} ${r1(p[1])}`;
  return closed ? d + 'Z' : d;
};

const cubic = (s: Seg, t: number): V2 => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * s[0][0] + b * s[1][0] + c * s[2][0] + d * s[3][0], a * s[0][1] + b * s[1][1] + c * s[2][1] + d * s[3][1]];
};

export const sample = (pts: readonly Pt[], closed = false, per = 12): V2[] => {
  const segs = bez(pts, closed);
  const out: V2[] = [];
  segs.forEach((s, i) => {
    for (let j = i === 0 ? 0 : 1; j <= per; j++) out.push(cubic(s, j / per));
  });
  return out;
};

export interface InkOpts {
  /** Fraction of the length used for the taper-in / taper-out. */
  a?: number;
  b?: number;
  /** Width at the very tips as a fraction of w. */
  tip?: number;
  /** Pressure multipliers spread evenly along the stroke (linear interpolation). */
  press?: number[];
}

const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return Math.sin((c * Math.PI) / 2);
};

const pressAt = (press: number[] | undefined, u: number) => {
  if (!press || press.length === 0) return 1;
  if (press.length === 1) return press[0];
  const f = u * (press.length - 1);
  const i = Math.min(press.length - 2, Math.floor(f));
  const t = f - i;
  return press[i] * (1 - t) + press[i + 1] * t;
};

/** Tapered ink stroke along the smooth curve through pts. Returns a filled-polygon path. */
export const ink = (pts: readonly Pt[], w: number, o: InkOpts = {}): string => {
  const {a = 0.28, b = 0.34, tip = 0.08, press} = o;
  if (pts.length < 2 || w <= 0) return '';
  const S = sample(pts, false, 12);
  const n = S.length;
  const L = [0];
  for (let i = 1; i < n; i++) L.push(L[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const tot = L[n - 1] || 1;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i < n; i++) {
    const u = L[i] / tot;
    const pA = S[Math.max(0, i - 1)];
    const pB = S[Math.min(n - 1, i + 1)];
    let tx = pB[0] - pA[0];
    let ty = pB[1] - pA[1];
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    const tin = a > 0 ? tip + (1 - tip) * ease(u / a) : 1;
    const tout = b > 0 ? tip + (1 - tip) * ease((1 - u) / b) : 1;
    const hw = (w * Math.min(tin, tout) * pressAt(press, u)) / 2;
    left.push(`${r1(S[i][0] - ty * hw)} ${r1(S[i][1] + tx * hw)}`);
    right.push(`${r1(S[i][0] + ty * hw)} ${r1(S[i][1] - tx * hw)}`);
  }
  return `M${left.join('L')}L${right.reverse().join('L')}Z`;
};

/** Sub-range of a point list (inclusive). */
export const sub = (pts: readonly Pt[], i0: number, i1: number): Pt[] => {
  if (i1 >= i0) return pts.slice(i0, i1 + 1) as Pt[];
  return [...pts.slice(i0), ...pts.slice(0, i1 + 1)] as Pt[];
};

/** Split a closed loop into open chains at its corner points (for per-lock hair lines). */
export const chains = (pts: readonly Pt[]): Pt[][] => {
  const idx = pts.map((p, i) => (isCorner(p) ? i : -1)).filter((i) => i >= 0);
  if (idx.length === 0) return [[...pts, pts[0]]];
  const out: Pt[][] = [];
  for (let j = 0; j < idx.length; j++) out.push(sub(pts, idx[j], idx[(j + 1) % idx.length]));
  return out;
};

export const lerpPts = (A: readonly Pt[], B: readonly Pt[], t: number): Pt[] =>
  A.map((p, i) => {
    const q = B[i] ?? p;
    const x = p[0] + (q[0] - p[0]) * t;
    const y = p[1] + (q[1] - p[1]) * t;
    return (isCorner(p) ? [x, y, 1] : [x, y]) as Pt;
  });

export const shift = (pts: readonly Pt[], dx: number, dy: number): Pt[] =>
  pts.map((p) => (isCorner(p) ? [p[0] + dx, p[1] + dy, 1] : [p[0] + dx, p[1] + dy]) as Pt);

/**
 * Hair spring: corner points (lock tips) move by the full offset, their neighbours by `notch`,
 * everything else stays pinned to the scalp.
 */
export const swayTips = (pts: readonly Pt[], dx: number, dy: number, notch = 0.35): Pt[] =>
  pts.map((p, i) => {
    const n = pts.length;
    const c = isCorner(p);
    const nb = isCorner(pts[(i + 1) % n]) || isCorner(pts[(i - 1 + n) % n]);
    const w = c ? 1 : nb ? notch : 0;
    return (c ? [p[0] + dx * w, p[1] + dy * w, 1] : [p[0] + dx * w, p[1] + dy * w]) as Pt;
  });

/** Bend a lock around its root: displacement grows with distance from root (0 at root, 1 at reach). */
export const bend = (pts: readonly Pt[], root: V2, dx: number, dy: number, reach: number): Pt[] =>
  pts.map((p) => {
    const w = Math.pow(Math.min(1, Math.hypot(p[0] - root[0], p[1] - root[1]) / reach), 1.6);
    return (isCorner(p) ? [p[0] + dx * w, p[1] + dy * w, 1] : [p[0] + dx * w, p[1] + dy * w]) as Pt;
  });

export const ell = (cx: number, cy: number, rx: number, ry: number, rot = 0): string => {
  if (!rot) return `M${r1(cx - rx)} ${r1(cy)}a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(rx * 2)} 0a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(-rx * 2)} 0Z`;
  const c = Math.cos((rot * Math.PI) / 180);
  const s = Math.sin((rot * Math.PI) / 180);
  return `M${r1(cx - rx * c)} ${r1(cy - rx * s)}a${r1(rx)} ${r1(ry)} ${rot} 1 0 ${r1(rx * 2 * c)} ${r1(rx * 2 * s)}a${r1(rx)} ${r1(ry)} ${rot} 1 0 ${r1(-rx * 2 * c)} ${r1(-rx * 2 * s)}Z`;
};

/** Rotate a local vector by -deg (world offset -> local offset inside a rotated group). */
export const unrotate = (dx: number, dy: number, deg: number): V2 => {
  const a = (-deg * Math.PI) / 180;
  return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];
};

/** Deterministic PRNG (mulberry32). */
export const prng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
