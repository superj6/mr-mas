/**
 * COLLAGE — a small line-engraving generator for props, bodies and the room plates.
 * (Heads use the shared ToneSvg 'engrave' renderer on the tonal rigs; this one is for our own parts,
 * because it can bend its lines around a form: cylinders, bulbs, drapery, perspective.)
 *
 * A "family" is a set of parallel burin lines: line k lives at v = k * pitch, sampled along u, mapped to
 * the page by `map(u, v)`. Each sample reads `tone(x, y)` (0 = black .. 1 = paper) and the line WIDTH
 * swells with darkness; where the width drops under `minW` the line breaks, so highlights dissolve into
 * tapering line ends like a real plate. A second family cross-hatches only the deep shadows.
 * Output: one SVG path (filled swell polygons) per call.
 */
import {P2, hash} from './core';

export type ToneFn = (x: number, y: number) => number;
export interface Family {
  /** Map from (u along the line, v across lines) to page coords. Default: straight lines at `angle`. */
  map?: (u: number, v: number) => P2;
  /** Straight-line families: angle in degrees (0 = horizontal lines). */
  angle?: number;
  /** v range covered (default: derived from bbox for straight lines). */
  v0?: number;
  v1?: number;
  u0?: number;
  u1?: number;
  /** Only draw where tone < this (e.g. 0.45 for a cross-hatch family). */
  below?: number;
  /** Width multiplier for this family. */
  weight?: number;
  /** Phase offset in pitches (0..1), to interleave families. */
  phase?: number;
}
export interface HatchOpts {
  bbox: [number, number, number, number]; // x0 y0 x1 y1
  tone: ToneFn;
  pitch: number;
  families: Family[];
  /** Max line width as a fraction of the pitch (default 0.92). */
  maxW?: number;
  /** Width response exponent (>1 = lighter mid-tones). */
  gamma?: number;
  /** Minimum drawn width in units (lines break below this). */
  minW?: number;
  /** Sample step along lines in units (default pitch * 0.55). */
  step?: number;
  /** Hand wobble amplitude in units (default pitch * 0.06). */
  wobble?: number;
  seed?: number;
}

const fx = (v: number) => v.toFixed(1);

const swell = (pts: P2[], ws: number[]): string => {
  const n = pts.length;
  if (n < 2) return '';
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    // taper the run ends to a burin point
    const endK = i === 0 || i === n - 1 ? 0.35 : 1;
    const w = (ws[i] * endK) / 2;
    top.push(`${fx(x + nx * w)} ${fx(y + ny * w)}`);
    bot.push(`${fx(x - nx * w)} ${fx(y - ny * w)}`);
  }
  return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
};

export const hatch = (o: HatchOpts): string => {
  const {bbox, tone, pitch, families, maxW = 0.92, gamma = 1.1, seed = 1} = o;
  const minW = o.minW ?? pitch * 0.09;
  const step = o.step ?? pitch * 0.55;
  const wob = o.wobble ?? pitch * 0.06;
  const [x0, y0, x1, y1] = bbox;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const R = Math.hypot(x1 - x0, y1 - y0) / 2 + pitch * 2;
  const out: string[] = [];
  families.forEach((fam, fi) => {
    let map = fam.map;
    let v0 = fam.v0;
    let v1 = fam.v1;
    let u0 = fam.u0;
    let u1 = fam.u1;
    if (!map) {
      const a = ((fam.angle ?? 0) * Math.PI) / 180;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      map = (u, v) => [cx + dx * u - dy * v, cy + dy * u + dx * v];
      v0 = v0 ?? -R;
      v1 = v1 ?? R;
      u0 = u0 ?? -R;
      u1 = u1 ?? R;
    }
    const wk = fam.weight ?? 1;
    const ph = (fam.phase ?? 0) * pitch;
    const below = fam.below ?? 2;
    let k = 0;
    for (let v = (v0 as number) + ph; v <= (v1 as number); v += pitch, k++) {
      let pts: P2[] = [];
      let ws: number[] = [];
      const flush = () => {
        if (pts.length > 1) out.push(swell(pts, ws));
        pts = [];
        ws = [];
      };
      const wph = hash(seed, fi, k) * 6.28;
      for (let u = u0 as number; u <= (u1 as number); u += step) {
        const vv = v + Math.sin(u * 0.021 + wph) * wob + Math.sin(u * 0.067 + wph * 2) * wob * 0.5;
        const [x, y] = map(u, vv);
        if (x < x0 - pitch || x > x1 + pitch || y < y0 - pitch || y > y1 + pitch) {
          flush();
          continue;
        }
        const t = tone(x, y);
        if (t >= below) {
          flush();
          continue;
        }
        const dark = below < 2 ? Math.min(1, (below - t) / below) : 1 - t;
        const w = Math.pow(Math.max(0, dark), gamma) * pitch * maxW * wk;
        if (w < minW) {
          flush();
          continue;
        }
        pts.push([x, y]);
        ws.push(w);
      }
      flush();
    }
  });
  return out.join('');
};

/** Straight + cross-hatch default families. */
export const hatch2 = (angle: number, crossAt = 0.42, crossAngle = angle + 62): Family[] => [
  {angle},
  {angle: crossAngle, below: crossAt, weight: 0.85, phase: 0.5},
];

/** Families that wrap around a vertical cylinder/bulb of radius r centred at cx (lines follow the curvature). */
export const cylinderFamily = (cx: number, top: number, bottom: number, r: number, bulge = 0.18): Family => ({
  // lines run vertically, bowed outward a little at mid-height to read round
  map: (u, v) => {
    const s = Math.max(-1, Math.min(1, v / r));
    const x = cx + r * Math.sin((s * Math.PI) / 2);
    const t = (u - top) / (bottom - top);
    return [x + (x - cx) * bulge * Math.sin(t * Math.PI), u];
  },
  u0: top,
  u1: bottom,
  v0: -r,
  v1: r,
});

/** Concentric rings (for dials, bulbs, glows). */
export const ringFamily = (cx: number, cy: number, r0: number, r1: number, sy = 1): Family => ({
  map: (u, v) => [cx + Math.cos(u / Math.max(4, v)) * v, cy + Math.sin(u / Math.max(4, v)) * v * sy],
  u0: 0,
  u1: Math.PI * 2 * r1,
  v0: r0,
  v1: r1,
});
