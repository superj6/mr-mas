/**
 * Tiny geometry kit for the ENV tonal models: a pinhole camera (so hard-surface props get honest
 * perspective + parallax when the camera moves), path builders and model composition helpers.
 * World units are centimetres, y down, z into the scene. Screen = 1920x1080 frame units.
 */
import type {ToneModel, TP} from '../types';

/**
 * Env planes. `soft` (edge softness, local units) is also a shared TP field. `bg` marks BACKDROP planes
 * (walls, light falloff, desk top + pools): the pixel tier paints those as a smooth underlay that the
 * pixel renderer ordered-dithers to its palette (dithered glow instead of outlined posterized rings).
 * `readTone`: tone used by VALUE-sampling renderers (glyph / dither / stipple) where colour renderers separate
 * two dark planes by hue alone (e.g. warm city light in the blinds vs the navy wall).
 */
export type EnvTP = TP & {soft?: number; bg?: boolean; readTone?: 0 | 1 | 2 | 3 | 4};

/** Signed area (screen coords, y down): > 0 = clockwise on screen. */
export const area2 = (pts: V2[]) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  }
  return a / 2;
};


export type V2 = [number, number];
export type V3 = [number, number, number];

export interface Cam {
  f: number;
  cx: number;
  cy: number;
  pos: V3;
}

/** Eye-level camera: horizon at y=520 (Mas's eye line), ~35mm-ish lens. */
export const makeCam = (dx = 0, dy = 0, zoom = 1): Cam => ({f: 1500 * zoom, cx: 960, cy: 520, pos: [dx, dy, 0]});

export const project = (cam: Cam, p: V3): V2 => {
  const x = p[0] - cam.pos[0];
  const y = p[1] - cam.pos[1];
  const z = Math.max(1, p[2] - cam.pos[2]);
  return [cam.cx + (cam.f * x) / z, cam.cy + (cam.f * y) / z];
};

/** Rotate a local point about Y by `yaw` degrees, then offset by `o`. */
export const place = (p: V3, yaw: number, o: V3): V3 => {
  const a = (yaw * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [o[0] + p[0] * c + p[2] * s, o[1] + p[1], o[2] - p[0] * s + p[2] * c];
};

const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

export const poly = (pts: V2[]) => 'M ' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z';
export const polyline = (pts: V2[]) => 'M ' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ');

/** Closed Catmull-Rom spline through points -> cubic bezier path (organic light pools, cables). */
export const smooth = (pts: V2[], closed = true, k = 1): string => {
  const n = pts.length;
  const P = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    const c1: V2 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
    const c2: V2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
    d += ` C ${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
};

export const circle = (cx: number, cy: number, r: number) => `M ${f1(cx - r)} ${f1(cy)} a ${f1(r)} ${f1(r)} 0 1 0 ${f1(r * 2)} 0 a ${f1(r)} ${f1(r)} 0 1 0 ${f1(-r * 2)} 0 Z`;
export const ell = (cx: number, cy: number, rx: number, ry: number) => `M ${f1(cx - rx)} ${f1(cy)} a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(rx * 2)} 0 a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-rx * 2)} 0 Z`;
export const rectP = (x: number, y: number, w: number, h: number) => `M ${f1(x)} ${f1(y)} H ${f1(x + w)} V ${f1(y + h)} H ${f1(x)} Z`;

/** Sample points on an ellipse (for projecting round things lying on a plane). */
export const ringPts = (n: number, fn: (a: number) => V2 | V3, a0 = 0, a1 = Math.PI * 2) => {
  const out: (V2 | V3)[] = [];
  for (let i = 0; i <= n; i++) out.push(fn(a0 + ((a1 - a0) * i) / n));
  return out;
};

/** Rounded rectangle outline sampled as local 2D points (x,y), for projecting panels. */
export const roundRectPts = (w: number, h: number, r: number, seg = 5): V2[] => {
  const pts: V2[] = [];
  const cs: [number, number, number][] = [
    [w / 2 - r, -h / 2 + r, -Math.PI / 2],
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
  ];
  cs.forEach(([cx, cy, a0]) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (Math.PI / 2) * (i / seg);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  });
  return pts;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp2 = (a: V2, b: V2, t: number): V2 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Deterministic hash -> 0..1 (for LED patterns etc., never Math.random). */
export const hash01 = (n: number) => {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// ---------------- model composition ----------------

/** Prefix every path's transform (e.g. place a local-unit model into the 1920x1080 set). */
export const transformModel = (m: ToneModel, t: string): ToneModel => ({
  ...m,
  paths: m.paths.map((p) => ({...p, transform: p.transform ? `${t} ${p.transform}` : t})),
});

/** Concatenate models back-to-front. Hue keys are namespaced so rigs can't collide. */
export const mergeModels = (box: [number, number, number, number], ...ms: {model: ToneModel; ns: string}[]): ToneModel => {
  const paths: TP[] = [];
  const hues: Record<string, string> = {};
  ms.forEach(({model, ns}) => {
    Object.entries(model.hues).forEach(([k, v]) => (hues[`${ns}.${k}`] = v));
    model.paths.forEach((p) => paths.push({...p, hue: p.hue.startsWith('#') ? p.hue : `${ns}.${p.hue}`}));
  });
  return {paths, hues, box};
};

// ---------------- stroke -> fill (so line work obeys tone in every renderer; noir/engrave ink real lines) ----------------
const cwPoly = (pts: V2[]) => (area2(pts) < 0 ? pts.slice().reverse() : pts);

/** Filled outline of polylines of width w: segment quads + round joins/caps (all wound the same way). */
export const strokeFill = (lines: V2[][], w: number): string => {
  const h = w / 2;
  const parts: string[] = [];
  const disc = (c: V2) => poly(cwPoly(Array.from({length: 8}, (_, i) => [c[0] + Math.cos((i / 8) * Math.PI * 2) * h, c[1] + Math.sin((i / 8) * Math.PI * 2) * h] as V2)));
  lines.forEach((L) => {
    if (L.length === 1) {
      parts.push(disc(L[0]));
      return;
    }
    for (let i = 0; i < L.length - 1; i++) {
      const a = L[i];
      const b = L[i + 1];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy);
      if (l < 1e-6) continue;
      const nx = (-dy / l) * h;
      const ny = (dx / l) * h;
      parts.push(poly(cwPoly([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]])));
    }
    L.forEach((c, i) => {
      if (i === 0 || i === L.length - 1) return parts.push(disc(c));
      const p0 = L[i - 1];
      const p2 = L[i + 1];
      const a1 = Math.atan2(c[1] - p0[1], c[0] - p0[0]);
      const a2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
      let da = Math.abs(a2 - a1);
      if (da > Math.PI) da = Math.PI * 2 - da;
      if (da > 0.35) parts.push(disc(c));
    });
  });
  return parts.join(' ');
};

/** Filled ring (annulus) of centre radius r and width w. */
export const ringFill = (cx: number, cy: number, r: number, w: number, n = 28) => {
  const o = cwPoly(Array.from({length: n}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * (r + w / 2), cy + Math.sin((i / n) * Math.PI * 2) * (r + w / 2)] as V2));
  const inn = cwPoly(Array.from({length: n}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * (r - w / 2), cy + Math.sin((i / n) * Math.PI * 2) * (r - w / 2)] as V2)).reverse();
  return `${poly(o)} ${poly(inn)}`;
};

/** Filled outline of a closed polygon border (outer offset minus inner offset, approximated by scaling). */
export const loopFill = (pts: V2[], w: number) => strokeFill([[...pts, pts[0]]], w);
