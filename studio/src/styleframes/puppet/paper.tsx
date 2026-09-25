import React, {createContext, useContext} from 'react';

/**
 * PUPPET structure — cut-paper primitives.
 * Every visible thing is a <Piece>: a hand-cut card shape with its own fibre texture (a userSpace
 * pattern, so the grain travels with the card when the piece moves/rotates), a faint cut-edge,
 * and a soft drop shadow onto whatever card lies beneath it. Shadows are offset in WORLD space
 * (the key light), so a rotated forearm still throws its shadow the right way.
 */

// ---------------------------------------------------------------- deterministic noise
export const hash = (n: number): number => {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};
export const rnd = (seed: number) => {
  let i = 0;
  return () => hash(seed * 7919 + i++ * 104729 + 17);
};
/** Signed jitter in [-amp, amp] for (id, exposure). */
export const jit = (id: number, exp: number, amp: number) => (hash(id * 9973 + exp * 131 + 5) - 0.5) * 2 * amp;

// ---------------------------------------------------------------- timing helpers
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeO = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeI = (t: number) => t * t * t;
/** Piecewise keys [[t, v], ...] with per-segment easing. */
export const keys = (t: number, k: [number, number][], ease: (x: number) => number = easeIO): number => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, v0] = k[i];
    const [t1, v1] = k[i + 1];
    if (t <= t1) return lerp(v0, v1, ease(clamp((t - t0) / (t1 - t0))));
  }
  return k[k.length - 1][1];
};
/** Damped spring response to an impulse at t0 (returns 0 before). */
export const ring = (t: number, t0: number, amp: number, freq = 0.55, damp = 0.13) => {
  if (t < t0) return 0;
  const x = t - t0;
  return amp * Math.exp(-damp * x) * Math.sin(freq * x);
};
/** Quantize a frame to an exposure grid ("on twos" = 2). */
export const on = (f: number, n: number) => Math.floor(f / n) * n;

// ---------------------------------------------------------------- hand-cut paths
export type Pt = [number, number] | [number, number, number];
const f1 = (n: number) => Math.round(n * 10) / 10;
/**
 * Closed Catmull-Rom outline through points, with a tiny deterministic wobble (scissor hand).
 * A third value of 1 marks a knife corner (sharp).
 */
export const cut = (pts: Pt[], o: {seed?: number; jit?: number; closed?: boolean; t?: number} = {}): string => {
  const {seed = 1, jit: j = 0.7, closed = true, t = 1} = o;
  const r = rnd(seed);
  const P = pts.map((p) => [p[0] + (r() - 0.5) * 2 * j, p[1] + (r() - 0.5) * 2 * j, p[2] ?? 0]);
  const n = P.length;
  const g = (i: number) => (closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f1(P[0][0])} ${f1(P[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const k1 = p1[2] ? 0 : t / 6;
    const k2 = p2[2] ? 0 : t / 6;
    const c1x = p1[0] + (p2[0] - p0[0]) * k1, c1y = p1[1] + (p2[1] - p0[1]) * k1;
    const c2x = p2[0] - (p3[0] - p1[0]) * k2, c2y = p2[1] - (p3[1] - p1[1]) * k2;
    d += ` C ${f1(c1x)} ${f1(c1y)} ${f1(c2x)} ${f1(c2y)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
};
/** Knife-cut polygon (all corners sharp) with wobble. */
export const poly = (pts: [number, number][], seed = 1, j = 0.6) => cut(pts.map((p) => [p[0], p[1], 1] as Pt), {seed, jit: j});
/** Slightly irregular hand-cut rectangle. */
export const rect = (x: number, y: number, w: number, h: number, seed = 1, j = 0.8) =>
  poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed, j);
/** Hand-cut ellipse. */
export const oval = (cx: number, cy: number, rx: number, ry: number, seed = 1, n = 10, j = 0.5): string => {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return cut(pts, {seed, jit: j});
};
/** Torn edge: jagged radial blob. */
export const torn = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 34, rough = 0.16): string => {
  const r = rnd(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.12;
    const k = 1 + (r() - 0.5) * 2 * rough + (i % 3 === 0 ? rough * 0.8 : 0);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return poly(pts, seed + 3, 0.4);
};

/** A torn hole: low-frequency lobes + fine jagged fibre edge. */
export const tornHole = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 72): string => {
  const r = rnd(seed);
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const low = 0.09 * Math.sin(a * 2 + ph[0]) + 0.07 * Math.sin(a * 3 + ph[1]) + 0.05 * Math.sin(a * 5 + ph[2]);
    const jag = (i % 2 ? 1 : -1) * (0.012 + r() * 0.035) + (r() > 0.9 ? 0.07 : 0);
    const k = 1 + low + jag;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return poly(pts, seed + 3, 0.3);
};

// ---------------------------------------------------------------- light / rotation context
export interface Light {
  /** World-space shadow offset per unit depth (points away from the key light). */
  dx: number;
  dy: number;
  /** Shadow opacity. */
  op: number;
  /** form-shading strength 0..1 */
  form?: number;
}
export const LightCtx = createContext<Light>({dx: 3.2, dy: 3.6, op: 0.5, form: 1});
export const RotCtx = createContext(0);
/**
 * Paper STOCK: the sparing style switch. Same puppets, same rig, re-cut from a different paper:
 * 'paper' (the show), 'engrave' (banknote stock for money flashbacks), 'bit' (punch-card / 1-bit for AI & 1993 moments).
 */
export type StockMode = 'paper' | 'engrave' | 'bit';
export const StockCtx = createContext<StockMode>('paper');
const lumOf = (c: string): number => {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  return Math.pow(0.2126 * r + 0.7152 * g + 0.0722 * b, 0.8);
};

export type Stock = 'card' | 'dark' | 'kraft' | 'soft' | 'none';

export interface PieceProps {
  d: string;
  fill: string;
  /** Height of this card above the card beneath it (shadow length/softness). 0 = glued flat. */
  z?: number;
  tex?: Stock;
  /** Cut-edge highlight opacity. */
  edge?: number;
  op?: number;
  transform?: string;
  /** Extra overlay path fill (e.g., gradient) drawn inside the piece. */
  shade?: string;
  rule?: 'evenodd' | 'nonzero';
}

export const Piece: React.FC<PieceProps> = ({d, fill: fill0, z = 1, tex: tex0 = 'card', edge = 0.16, op = 1, transform, shade, rule = 'nonzero'}) => {
  const rot = useContext(RotCtx);
  const L = useContext(LightCtx);
  const stock = useContext(StockCtx);
  let fill = fill0;
  let tex = tex0;
  if (stock !== 'paper') {
    const lvl = Math.max(0, Math.min(4, Math.round(lumOf(fill0) * 5 - 0.4)));
    fill = `url(#pz-${stock}-${lvl})`;
    tex = stock === 'engrave' ? 'card' : 'none';
  }
  const a = (-rot * Math.PI) / 180;
  const wx = L.dx * z, wy = L.dy * z;
  const lx = wx * Math.cos(a) - wy * Math.sin(a);
  const ly = wx * Math.sin(a) + wy * Math.cos(a);
  const b = z <= 0 ? 0 : z < 0.8 ? 1 : z < 1.6 ? 2 : z < 3 ? 3 : 4;
  // direction TO the light = opposite of the shadow offset, in local space
  const la = Math.atan2(-ly, -lx);
  const bucket = (((Math.round((la / (Math.PI * 2)) * 16) % 16) + 16) % 16);
  const form = (L.form ?? 1) > 0 && z > 0.25 && tex !== 'none';
  return (
    <g opacity={op} transform={transform}>
      {b > 0 && L.op > 0 ? (
        <path d={d} fillRule={rule} fill="#04050a" opacity={L.op * Math.min(1, 0.55 + z * 0.2)} transform={`translate(${f1(lx)} ${f1(ly)})`} filter={`url(#pz-b${b})`} />
      ) : null}
      <path d={d} fillRule={rule} fill={fill} />
      {tex !== 'none' ? <path d={d} fillRule={rule} fill={`url(#pz-t-${tex})`} /> : null}
      {form ? <path d={d} fillRule={rule} fill={`url(#pz-sh-${bucket})`} opacity={L.form ?? 1} /> : null}
      {shade ? <path d={d} fillRule={rule} fill={shade} /> : null}
      {stock === 'engrave' ? (
        <path d={d} fillRule={rule} fill="none" stroke="#1f3a2c" strokeOpacity={0.85} strokeWidth={0.9} />
      ) : stock === 'bit' ? (
        <path d={d} fillRule={rule} fill="none" stroke="#8dffb0" strokeOpacity={0.9} strokeWidth={1.2} strokeDasharray="2.4 1.6" />
      ) : edge > 0 ? (
        <path d={d} fill="none" stroke={form ? `url(#pz-eg-${bucket})` : '#fff8e8'} strokeOpacity={form ? Math.min(1, edge * 4) : edge} strokeWidth={1.1} />
      ) : null}
    </g>
  );
};

/** Split-pin brad head. */
export const Brad: React.FC<{x?: number; y?: number; r?: number; tone?: 'brass' | 'steel' | 'black'}> = ({x = 0, y = 0, r = 4.2, tone = 'brass'}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 1.05} cx={1.1} cy={1.4} fill="#000" opacity={0.55} filter="url(#pz-b1)" />
    <circle r={r} fill={`url(#pz-${tone})`} />
    <circle r={r} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={0.7} />
    <ellipse cx={-r * 0.32} cy={-r * 0.38} rx={r * 0.34} ry={r * 0.2} fill="#fffbe6" opacity={0.75} />
  </g>
);

/** A pivot: children are in joint-local space (pivot at 0,0). Brad drawn on top. */
export const Joint: React.FC<{x: number; y: number; a?: number; brad?: boolean | number; tone?: 'brass' | 'steel' | 'black'; children?: React.ReactNode}> = ({x, y, a = 0, brad = false, tone = 'brass', children}) => {
  const rot = useContext(RotCtx);
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${Math.round(a * 100) / 100})`}>
      <RotCtx.Provider value={rot + a}>{children}</RotCtx.Provider>
      {brad ? <Brad r={typeof brad === 'number' ? brad : 4.2} tone={tone} /> : null}
    </g>
  );
};

/** Thread (real cotton line) with a soft shadow. */
export const Thread: React.FC<{d: string; color?: string; w?: number; op?: number}> = ({d, color = '#e9e2d0', w = 1.3, op = 0.9}) => (
  <g>
    <path d={d} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={w * 1.6} transform="translate(2 2.5)" filter="url(#pz-b1)" />
    <path d={d} fill="none" stroke={color} strokeOpacity={op} strokeWidth={w} strokeLinecap="round" />
  </g>
);

// ---------------------------------------------------------------- shared defs (render once per document)
export const PaperDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      {[1, 2, 3, 4].map((i) => (
        <filter key={i} id={`pz-b${i}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={[0, 1.1, 2.2, 3.6, 6][i]} />
        </filter>
      ))}
      {/* fine fibre grain for light card: mottle + sparse flecks + tiny specks */}
      <filter id="pz-grain-f" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={11} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 0 0.06  -1.0 0 0 0 0.42" result="dk" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.92  0.8 0 0 0 -0.47" result="lt" />
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={4} stitchTiles="stitch" result="m" />
        <feColorMatrix in="m" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  -0.55 0 0 0 0.3" result="mt" />
        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={1} seed={14} stitchTiles="stitch" result="fb" />
        <feColorMatrix in="fb" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  -5 0 0 0 1.45" result="fl" />
        <feMerge>
          <feMergeNode in="mt" />
          <feMergeNode in="dk" />
          <feMergeNode in="lt" />
          <feMergeNode in="fl" />
        </feMerge>
      </filter>
      {/* fibres visible on dark card (black tee, night paper): lighter hairs */}
      <filter id="pz-dark-f" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.12 0.5" numOctaves={2} seed={21} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.86  0 0 0 0 0.9  0.9 0 0 0 -0.58" result="lt" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={5} stitchTiles="stitch" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.85  0.7 0 0 0 -0.39" result="gl" />
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={3} seed={6} stitchTiles="stitch" result="m" />
        <feColorMatrix in="m" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.72  0 0 0 0 0.8  0.25 0 0 0 -0.1" result="mt" />
        <feMerge>
          <feMergeNode in="mt" />
          <feMergeNode in="gl" />
          <feMergeNode in="lt" />
        </feMerge>
      </filter>
      {/* kraft / board: long fibres + flecks */}
      <filter id="pz-kraft-f" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.25 0.03" numOctaves={3} seed={8} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.06  0 0 0 0 0.03  -1.1 0 0 0 0.52" result="dk" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={9} stitchTiles="stitch" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0.9 0 0 0 -0.54" result="lt" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0 0.02  -1.2 0 0 0 0.46" result="fk" />
        <feMerge>
          <feMergeNode in="dk" />
          <feMergeNode in="fk" />
          <feMergeNode in="lt" />
        </feMerge>
      </filter>
      {/* soft mottled watercolour card */}
      <filter id="pz-soft-f" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={4} seed={31} stitchTiles="stitch" result="m" />
        <feColorMatrix in="m" type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0 0.08  -0.8 0 0 0 0.44" result="mt" />
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={32} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  -0.9 0 0 0 0.38" result="dk" />
        <feMerge>
          <feMergeNode in="mt" />
          <feMergeNode in="dk" />
        </feMerge>
      </filter>
      <pattern id="pz-t-card" patternUnits="userSpaceOnUse" width={384} height={384}>
        <rect width={384} height={384} filter="url(#pz-grain-f)" />
      </pattern>
      <pattern id="pz-t-dark" patternUnits="userSpaceOnUse" width={384} height={384}>
        <rect width={384} height={384} filter="url(#pz-dark-f)" />
      </pattern>
      <pattern id="pz-t-kraft" patternUnits="userSpaceOnUse" width={384} height={384}>
        <rect width={384} height={384} filter="url(#pz-kraft-f)" />
      </pattern>
      <pattern id="pz-t-soft" patternUnits="userSpaceOnUse" width={512} height={512}>
        <rect width={512} height={512} filter="url(#pz-soft-f)" />
      </pattern>
      {/* per-piece form shading: each card catches the key light a little unevenly */}
      {Array.from({length: 16}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const c = Math.cos(a) * 0.5, sn = Math.sin(a) * 0.5;
        return (
          <linearGradient key={i} id={`pz-sh-${i}`} x1={0.5 + c} y1={0.5 + sn} x2={0.5 - c} y2={0.5 - sn}>
            <stop offset="0" stopColor="#fffdf4" stopOpacity={0.13} />
            <stop offset="0.45" stopColor="#fffdf4" stopOpacity={0} />
            <stop offset="0.6" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.3} />
          </linearGradient>
        );
      })}
      {Array.from({length: 16}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const c = Math.cos(a) * 0.5, sn = Math.sin(a) * 0.5;
        return (
          <linearGradient key={i} id={`pz-eg-${i}`} x1={0.5 + c} y1={0.5 + sn} x2={0.5 - c} y2={0.5 - sn}>
            <stop offset="0" stopColor="#fffbea" stopOpacity={0.75} />
            <stop offset="0.35" stopColor="#fffbea" stopOpacity={0.12} />
            <stop offset="0.6" stopColor="#fffbea" stopOpacity={0} />
          </linearGradient>
        );
      })}
      {/* banknote engraving stock: 5 tone levels of line hatching (ink on cream), lines travel with the card */}
      {[0, 1, 2, 3, 4].map((l) => {
        const gap = [3.2, 3.6, 4.2, 5.2, 7][l];
        const w = [1.9, 1.5, 1.15, 0.8, 0.45][l];
        return (
          <pattern key={l} id={`pz-engrave-${l}`} patternUnits="userSpaceOnUse" width={gap} height={gap} patternTransform="rotate(32)">
            <rect width={gap} height={gap} fill="#efe7cf" />
            <rect width={gap} height={w} fill="#1f3a2c" />
            {l <= 1 ? <rect width={w * 0.8} height={gap} fill="#1f3a2c" opacity={l === 0 ? 0.9 : 0.5} /> : null}
          </pattern>
        );
      })}
      {/* punch-card / 1-bit stock: ordered-dither phosphor pixels */}
      {[0, 1, 2, 3, 4].map((l) => {
        const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
        const th = [1, 4, 7, 11, 16][l];
        return (
          <pattern key={l} id={`pz-bit-${l}`} patternUnits="userSpaceOnUse" width={16} height={16}>
            <rect width={16} height={16} fill="#07120a" />
            {bayer.map((b, i) => (b < th ? <rect key={i} x={(i % 4) * 4} y={Math.floor(i / 4) * 4} width={3.4} height={3.4} fill="#8dffb0" /> : null))}
          </pattern>
        );
      })}
      {/* brad metals */}
      <radialGradient id="pz-brass" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#fff1b8" />
        <stop offset="0.35" stopColor="#d2ad5c" />
        <stop offset="0.8" stopColor="#7c5a22" />
        <stop offset="1" stopColor="#4a3412" />
      </radialGradient>
      <radialGradient id="pz-steel" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.35" stopColor="#b9c0c8" />
        <stop offset="0.85" stopColor="#5b6168" />
        <stop offset="1" stopColor="#30343a" />
      </radialGradient>
      <radialGradient id="pz-black" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#8a8f99" />
        <stop offset="0.35" stopColor="#2a2d33" />
        <stop offset="1" stopColor="#0a0b0d" />
      </radialGradient>
      {/* silhouette for shadows cast on the back wall */}
      <filter id="pz-sil" x="-20%" y="-20%" width="140%" height="140%">
        <feFlood floodColor="#02030a" result="c" />
        <feComposite in="c" in2="SourceAlpha" operator="in" result="s" />
        <feGaussianBlur in="s" stdDeviation="3" />
      </filter>
      {/* torn fibre edge */}
      <filter id="pz-fray" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={3} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={9} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/**
 * Rim light filter factory: a thin sliver of coloured light on the edges that face the light.
 * (dx,dy) = direction TO the light in the group's local space, in px.
 */
export const RimFilter: React.FC<{id: string; dx: number; dy: number; color: string; op?: number; blur?: number}> = ({id, dx, dy, color, op = 0.9, blur = 0.7}) => (
  <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
    {/* only the opaque card counts (soft drop shadows are excluded), so the rim is a crisp kiss on the silhouette */}
    <feComponentTransfer in="SourceAlpha" result="solid">
      <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 1" />
    </feComponentTransfer>
    <feOffset in="solid" dx={-dx} dy={-dy} result="o" />
    <feComposite in="solid" in2="o" operator="out" result="sl" />
    <feGaussianBlur in="sl" stdDeviation={blur} result="sb" />
    <feFlood floodColor={color} floodOpacity={op} />
    <feComposite in2="sb" operator="in" result="rim" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="rim" />
    </feMerge>
  </filter>
);
