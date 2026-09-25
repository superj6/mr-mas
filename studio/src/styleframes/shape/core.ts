// GRAPHIC-SHAPE CINEMA ("shape") — core tokens + helpers. Owned by the `shape` builder.
import {Easing, interpolate} from 'remotion';
import {noise2D} from '@remotion/noise';

/** Picture area: 2.39:1 scope inside 1920x1080 (letterbox bars hold the subtitles). */
export const W = 1920;
export const PH = 804; // picture height
export const BAR = (1080 - PH) / 2; // 138

/**
 * Colour script. Every fill is a LIGHT colour, not a local colour: left of frame = monitor cyan,
 * right of frame = rocket red. Each hue family has 3-4 hard values (0 = unlit .. 3 = hot).
 * `v` is the value used when a sequence switches to a 1-bit / engraving treatment.
 */
export const C = {
  void: '#06070d',
  night0: '#0a0d1b',
  night1: '#111630',
  night2: '#19203f',
  night3: '#232c52',
  // monitor light
  cy0: '#0e2f3f',
  cy1: '#17606f',
  cy2: '#3fc4cf',
  cy3: '#aef6ef',
  cyHot: '#e6fffb',
  // rocket light
  rd0: '#2e0d17',
  rd1: '#7c1a1e',
  rd2: '#e2401f',
  rd3: '#ff7a3a',
  rdHot: '#ffc27a',
  // mas
  masSkinShadow: '#2b2440',
  masSkinMid: '#5a6883',
  masSkinLit: '#b1d6cc',
  masSkinLid: '#86aeb0',
  masSkinHot: '#d4fbf2',
  masHair: '#120f1c',
  masHairLit: '#2b5f6b',
  masHood: '#2a3048',
  masHoodDeep: '#1a1e33',
  masHoodLit: '#6aa9b3',
  masEye: '#d8fbf5',
  masIris: '#23384a',
  // nole
  noleTee: '#08070c',
  noleTeeMid: '#17111a',
  noleSkinShadow: '#2a1520',
  noleSkinMid: '#6a2a2c',
  noleSkinLit: '#ff8a5c',
  noleHair: '#0c080c',
  noleHairLit: '#8a2a1f',
  phone: '#0b0a10',
  phoneGlow: '#f4fbff',
  cream: '#f1e5cc',
  creamDim: '#b9ad97',
} as const;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = (a: number, b: number, t: number) => a + (b - a) * clamp(t);

/** Characters animate on twos; the camera animates on ones. */
export const on2 = (f: number) => f - (((f % 2) + 2) % 2);
export const on3 = (f: number) => f - (((f % 3) + 3) % 3);

const EIO = Easing.bezier(0.45, 0, 0.2, 1);
const EOUT = Easing.bezier(0.1, 0.7, 0.2, 1);
const EIN = Easing.bezier(0.6, 0, 0.9, 0.4);

/** Keyframed value: [frame, value][] with an easing per segment. */
export const keys = (f: number, k: [number, number][], ease: 'io' | 'out' | 'in' | 'lin' = 'io') => {
  const e = ease === 'io' ? EIO : ease === 'out' ? EOUT : ease === 'in' ? EIN : (t: number) => t;
  return interpolate(
    f,
    k.map((x) => x[0]),
    k.map((x) => x[1]),
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e},
  );
};

/** Snappy pose-to-pose: hold `a` until `t0`, snap to `b` over `dur` frames, overshoot by `over`, settle. */
export const snap = (f: number, t0: number, a: number, b: number, dur = 3, over = 0.12) => {
  if (f <= t0) return a;
  const t = (f - t0) / dur;
  let v: number;
  if (t < 1) v = (1 - Math.pow(1 - t, 3)) * (1 + over);
  else if (t < 2.5) {
    const u = (t - 1) / 1.5;
    v = 1 + over * (1 - u * u * (3 - 2 * u));
  } else v = 1;
  return a + (b - a) * v;
};

/** Damped spring impulse at t0 (for shakes / follow-through). */
export const spring1 = (f: number, t0: number, amp: number, freq = 0.9, damp = 0.22) => {
  if (f < t0) return 0;
  const t = f - t0;
  return amp * Math.sin(t * freq) * Math.exp(-t * damp);
};

/** Deterministic noise in -1..1. */
export const nz = (seed: string, x: number, y = 0) => noise2D(seed, x, y);

/** Camera shake after an impact (deterministic). */
export const shake = (f: number, t0: number, amp: number, decay = 0.28) => {
  if (f < t0) return {x: 0, y: 0, r: 0};
  const t = f - t0;
  const k = amp * Math.exp(-t * decay);
  return {x: nz('shx', t * 0.9) * k, y: nz('shy', t * 0.9) * k * 0.7, r: nz('shr', t * 0.7) * k * 0.02};
};

// ---------------- path helpers ----------------
export const P = (pts: [number, number][], close = true) =>
  'M ' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ') + (close ? ' Z' : '');

export const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

export const rr = (x: number, y: number, w: number, h: number, r = 0) => {
  r = Math.min(r, w / 2, h / 2);
  return r > 0
    ? `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`
    : `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
};

/** Smooth closed blob through points (Catmull-Rom -> cubic Bézier). */
export const blob = (pts: [number, number][], tension = 1) => {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
};

/** Open smooth curve (Catmull-Rom) through points. */
export const curve = (pts: [number, number][], tension = 1) => {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Tapered limb: a soft capsule from a (width wa) to b (width wb). */
export const limb = (ax: number, ay: number, bx: number, by: number, wa: number, wb: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const ra = wa / 2;
  const rb = wb / 2;
  return [
    `M ${ax + nx * ra} ${ay + ny * ra}`,
    `L ${bx + nx * rb} ${by + ny * rb}`,
    `A ${rb} ${rb} 0 0 0 ${bx - nx * rb} ${by - ny * rb}`,
    `L ${ax - nx * ra} ${ay - ny * ra}`,
    `A ${ra} ${ra} 0 0 0 ${ax + nx * ra} ${ay + ny * ra}`,
    'Z',
  ].join(' ');
};

export const rot = (x: number, y: number, deg: number, cx = 0, cy = 0): [number, number] => {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
