/**
 * Procedural guilloché (security-printing) geometry: rosettes, woven border bands, spirograph stars.
 * Everything returns SVG path data, stroked at ~0.6-0.9 px for the banknote look.
 */
const f = (n: number) => n.toFixed(2);
const TAU = Math.PI * 2;

const closed = (pts: [number, number][]) => 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ') + ' Z';

/**
 * Lace ring: m phase-shifted copies of r(θ) = rMid + amp·sin(nθ + φ) (+ optional second harmonic),
 * which weave into the classic interlaced band.
 */
export const laceRing = (cx: number, cy: number, rMid: number, amp: number, n: number, m: number, opt: {amp2?: number; n2?: number; steps?: number; rot?: number} = {}) => {
  const {amp2 = 0, n2 = n * 2, steps = 900, rot = 0} = opt;
  const out: string[] = [];
  for (let k = 0; k < m; k++) {
    const phi = (k / m) * TAU;
    const pts: [number, number][] = [];
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * TAU;
      const r = rMid + amp * Math.sin(n * t + phi) + amp2 * Math.sin(n2 * t - phi * 2);
      pts.push([cx + Math.cos(t + rot) * r, cy + Math.sin(t + rot) * r]);
    }
    out.push(closed(pts));
  }
  return out.join(' ');
};

/** Spirograph (hypotrochoid) star: R fixed circle, r rolling circle, d pen offset. */
export const hypotrochoid = (cx: number, cy: number, R: number, r: number, d: number, turns: number, steps = 2400, scale = 1) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU * turns;
    const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    pts.push([cx + x * scale, cy + y * scale]);
  }
  return 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
};

/** Epitrochoid "petal" rosette (outer flower of a banknote medallion). */
export const epitrochoid = (cx: number, cy: number, R: number, r: number, d: number, turns: number, steps = 2400, scale = 1) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU * turns;
    const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
    const y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
    pts.push([cx + x * scale, cy + y * scale]);
  }
  return 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
};

/** Woven band along a straight segment (horizontal if vertical=false). m sine phases, wavelength lam. */
export const wovenBand = (a0: number, a1: number, c: number, half: number, lam: number, m: number, vertical = false, step = 1.5) => {
  const out: string[] = [];
  for (let k = 0; k < m; k++) {
    const phi = (k / m) * TAU;
    const pts: string[] = [];
    for (let s = a0; s <= a1; s += step) {
      const o = c + half * Math.sin((TAU * s) / lam + phi) * (0.75 + 0.25 * Math.cos((TAU * s) / (lam * 4)));
      pts.push(vertical ? `${f(o)} ${f(s)}` : `${f(s)} ${f(o)}`);
    }
    out.push('M ' + pts.join(' L '));
  }
  return out.join(' ');
};

/** A small "rope": two counter-phase sines. */
export const rope = (a0: number, a1: number, c: number, half: number, lam: number, vertical = false) => wovenBand(a0, a1, c, half, lam, 2, vertical, 1.2);
