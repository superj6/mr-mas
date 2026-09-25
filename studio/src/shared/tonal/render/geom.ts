/**
 * Geometry helpers for the tonal renderers (owned by the `render` builder).
 * Pure math, no DOM: flatten SVG path data into polygons, parse the small transform subset the
 * rigs use (translate/rotate/scale), bounding boxes, point-in-polygon, and the plane analysis
 * that decides which planes are silhouettes ("base") and which are interior shading.
 */
import {parsePath, reduceInstructions, ReducedInstruction} from '@remotion/paths';
import type {ToneModel, TP} from '../types';

export type M6 = [number, number, number, number, number, number];
export type Pt = [number, number];
export type BB = [number, number, number, number]; // x1 y1 x2 y2

export const mul6 = (m: M6, n: M6): M6 => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];

/** Same semantics as SVG: each op post-multiplies. Supports translate / rotate(a [cx cy]) / scale. */
export const parseTransform6 = (t?: string): M6 => {
  let m: M6 = [1, 0, 0, 1, 0, 0];
  if (!t) return m;
  const re = /(rotate|translate|scale)\(([^)]+)\)/g;
  let r: RegExpExecArray | null;
  while ((r = re.exec(t))) {
    const a = r[2].trim().split(/[ ,]+/).map(Number);
    if (r[1] === 'translate') m = mul6(m, [1, 0, 0, 1, a[0], a[1] ?? 0]);
    else if (r[1] === 'scale') m = mul6(m, [a[0], 0, 0, a[1] ?? a[0], 0, 0]);
    else {
      const rad = (a[0] * Math.PI) / 180;
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      if (a.length === 3) {
        m = mul6(m, [1, 0, 0, 1, a[1], a[2]]);
        m = mul6(m, [c, s, -s, c, 0, 0]);
        m = mul6(m, [1, 0, 0, 1, -a[1], -a[2]]);
      } else m = mul6(m, [c, s, -s, c, 0, 0]);
    }
  }
  return m;
};

export const inv6 = (m: M6): M6 => {
  const det = m[0] * m[3] - m[1] * m[2] || 1e-12;
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
};
export const m6str = (m: M6) => `matrix(${m.map((v) => +v.toFixed(6)).join(' ')})`;
/** AABB of a box after applying m. */
export const mapBB = (m: M6, b: BB): BB => {
  const pts = [apply(m, b[0], b[1]), apply(m, b[2], b[1]), apply(m, b[0], b[3]), apply(m, b[2], b[3])];
  return [Math.min(...pts.map((q) => q[0])), Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[1]))];
};

export const apply = (m: M6, x: number, y: number): Pt => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const cache = new Map<string, Pt[][]>();

/** Flatten path data (+ optional transform) into polylines, one per subpath. Cached. */
export const flatten = (d: string, transform?: string, steps = 10): Pt[][] => {
  const key = (transform ?? '') + '|' + d;
  const hit = cache.get(key);
  if (hit) return hit;
  const m = parseTransform6(transform);
  const out: Pt[][] = [];
  let cur: Pt[] = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let ins: ReducedInstruction[];
  try {
    ins = reduceInstructions(parsePath(d));
  } catch {
    ins = [];
  }
  for (const i of ins) {
    if (i.type === 'M') {
      if (cur.length) out.push(cur);
      cur = [apply(m, i.x, i.y)];
      x = sx = i.x;
      y = sy = i.y;
    } else if (i.type === 'L') {
      cur.push(apply(m, i.x, i.y));
      x = i.x;
      y = i.y;
    } else if (i.type === 'C') {
      for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        const u = 1 - t;
        const px = u * u * u * x + 3 * u * u * t * i.cp1x + 3 * u * t * t * i.cp2x + t * t * t * i.x;
        const py = u * u * u * y + 3 * u * u * t * i.cp1y + 3 * u * t * t * i.cp2y + t * t * t * i.y;
        cur.push(apply(m, px, py));
      }
      x = i.x;
      y = i.y;
    } else if (i.type === 'Z') {
      x = sx;
      y = sy;
    }
  }
  if (cur.length) out.push(cur);
  if (cache.size > 4000) cache.clear();
  cache.set(key, out);
  return out;
};

export const bboxOf = (polys: Pt[][], pad = 0): BB => {
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const poly of polys)
    for (const [x, y] of poly) {
      if (x < x1) x1 = x;
      if (y < y1) y1 = y;
      if (x > x2) x2 = x;
      if (y > y2) y2 = y;
    }
  if (!isFinite(x1)) return [0, 0, 0, 0];
  return [x1 - pad, y1 - pad, x2 + pad, y2 + pad];
};

export const inPoly = (poly: Pt[], x: number, y: number): boolean => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi) inside = !inside;
  }
  return inside;
};

const distSeg = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy || 1e-9;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  const qx = ax + t * dx - px;
  const qy = ay + t * dy - py;
  return Math.sqrt(qx * qx + qy * qy);
};

export const nearPoly = (poly: Pt[], x: number, y: number, tol: number): boolean => {
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (distSeg(x, y, poly[j][0], poly[j][1], poly[i][0], poly[i][1]) <= tol) return true;
  }
  return false;
};

// ------------------------------------------------------------------------------------------------
// Plane analysis
// ------------------------------------------------------------------------------------------------
export interface PlaneInfo {
  i: number;
  p: TP;
  polys: Pt[][];
  bb: BB;
  minDim: number;
  /** Silhouette of its hue group (crisp edge, defines the clip for later interior planes). */
  base: boolean;
  /** Hue group key. */
  group: string;
  /** For interior planes: indices of the silhouettes (same group) it is clipped to. */
  clip: number[];
  /** Stable key of that clip set, e.g. "skin#1". */
  clipKey: string;
}

const memo = new WeakMap<ToneModel, PlaneInfo[]>();

/**
 * Classify planes. A plane is INTERIOR (soft shading inside a silhouette) when it has the same hue as
 * earlier silhouettes, a different tone than that group's first plane (or is a light plane), and
 * >= 85% of its outline lies inside those silhouettes. Everything else is a new silhouette.
 * `p.base` overrides the heuristic.
 */
export const analyze = (model: ToneModel): PlaneInfo[] => {
  const hit = memo.get(model);
  if (hit) return hit;
  const groups = new Map<string, {firstTone: number; sils: number[]}>();
  const infos: PlaneInfo[] = [];
  model.paths.forEach((p, i) => {
    const polys = flatten(p.d, p.transform);
    const bb = bboxOf(polys, p.line ? p.line / 2 : 0);
    const info: PlaneInfo = {i, p, polys, bb, minDim: Math.max(1, Math.min(bb[2] - bb[0], bb[3] - bb[1])), base: false, group: p.hue, clip: [], clipKey: ''};
    infos.push(info);
    if (p.line) return;
    const g = groups.get(p.hue);
    let base: boolean;
    if (p.base !== undefined) base = p.base || !g;
    else if (!g) base = true;
    else if (p.tone === g.firstTone && !p.light) base = true;
    else {
      // containment test on outline samples
      const pts: Pt[] = [];
      for (const poly of polys) {
        const step = Math.max(1, Math.floor(poly.length / 24));
        for (let k = 0; k < poly.length; k += step) pts.push(poly[k]);
      }
      const silPolys = g.sils.flatMap((s) => infos[s].polys);
      const tol = 3;
      let inside = 0;
      for (const [x, y] of pts) {
        if (silPolys.some((sp) => inPoly(sp, x, y) || nearPoly(sp, x, y, tol))) inside++;
      }
      base = inside / Math.max(1, pts.length) < 0.85;
    }
    if (base) {
      if (!g) groups.set(p.hue, {firstTone: p.tone, sils: [i]});
      else g.sils.push(i);
      info.base = true;
    } else {
      const gg = groups.get(p.hue)!;
      info.clip = [...gg.sils];
      info.clipKey = `${p.hue}#${gg.sils.length}`;
    }
  });
  memo.set(model, infos);
  return infos;
};

/** Union bbox of every plane in the model (local units). */
export const modelBBox = (model: ToneModel): BB => {
  const inf = analyze(model);
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const f of inf) {
    x1 = Math.min(x1, f.bb[0]);
    y1 = Math.min(y1, f.bb[1]);
    x2 = Math.max(x2, f.bb[2]);
    y2 = Math.max(y2, f.bb[3]);
  }
  return [x1, y1, x2, y2];
};
