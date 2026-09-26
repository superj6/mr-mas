// MR. MAS — style jump prototype 2 · THE FAR SIDE, fix pass (style-jumps §5.2 "The far side").
// What is behind the sky: the same night, one tier up, and far deeper than the painted one. A continuous-tone star
// field with real depth: three star populations at different depths (faint dust of stars, a middle field, a few near
// bright ones with a soft bloom), a band of the galaxy crossing on a diagonal with star clouds and dark dust lanes, and
// a slow differential drift once it has opened (near stars move a little faster than far ones: the first smooth motion
// in the frame, and the thing that says "volume, not a texture").
//
// The pixel sky it replaces is a near-flat N2 with no stars; this is its one readable element at phone size: "there
// are far more stars behind the sky than in it". No moon (a moon in the gap was a different sky, and its halo glowed),
// no city (the seam is in the sky, above the rooftops), no real-world image, no colour a viewer would call an aurora.
//
// Exposure: inside the opening only, the far side may exceed the one-stop limit (fix-pass brief); it never lights Mas.
// The field's floor sits at the pixel sky's level; the band and the stars carry the difference (measured by
// tools/grade.ts). Authored at 1920 x 1080 native, never upscaled. Deterministic: hash seeds only.
import {hash} from '../../../shared/pixel/px';
import {TEAR, tearLine} from './tear';

// ------------------------------------------------------------------ colour (linear light)
const lin = (v: number) => Math.pow(v / 255, 2.2);
const hexLin = (h: string): [number, number, number] => {
  const n = parseInt(h.replace('#', ''), 16);
  return [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255)];
};
export const toByte = (v: number) => Math.max(0, Math.min(255, Math.round(255 * Math.pow(Math.max(0, v), 1 / 2.2))));

// ------------------------------------------------------------------ noise
const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number, s: number, oct = 5) => {
  let v = 0, amp = 0.5, f = 1, n = 0;
  for (let o = 0; o < oct; o++) { v += amp * vnoise(x * f, y * f, s + o * 31); n += amp; amp *= 0.5; f *= 2.03; }
  return v / n;
};

// ------------------------------------------------------------------ the knobs
/**
 * The far side's look. `floor` is the field's base colour (about the pixel sky's own level, a little deeper and
 * bluer); `band` the galaxy's glow; `dust` its dark lanes; `gain` the overall exposure; the band's centre line passes
 * through (bx, by) at `angle` (radians, screen space) with half-width `bw` (1080 px).
 */
export const DEEP = {
  gain: 1.0,
  floorTop: hexLin('#02030d'),
  floorBot: hexLin('#040716'),
  band: hexLin('#5d6fb4'),
  bandCore: hexLin('#8f93c4'),
  dust: 0.85,
  bandGain: 0.04,
  /** final polish: the band no longer crosses the opening. In the seam build it crossed only the lower pane, so the
   *  strip "changed look" at the transom; inside the tear its glow and its dense dust read as grey smoke at phone size.
   *  The tear shows a black, deeper night with sharp points only (the band stays for the retired variants' stills) */
  bx: 1120, by: 212, angle: -0.5, bw: 78,
  /** the region the star list covers (1080 px): the window's sky with margin, for either variant */
  rx0: 380, rx1: 1260, ry0: 0, ry1: 420,
  stars: 9000,
};

// ------------------------------------------------------------------ the band
/** signed distance across the band (1080 px) and the distance along it */
const bandCoords = (X: number, Y: number) => {
  const ca = Math.cos(DEEP.angle), sa = Math.sin(DEEP.angle);
  const dx = X - DEEP.bx, dy = Y - DEEP.by;
  return {across: -dx * sa + dy * ca, along: dx * ca + dy * sa};
};
/** the band's density at (X, Y): 0..~1.3, with star clouds (brighter knots) and dust (dark lanes) */
export const bandAt = (X: number, Y: number) => {
  const {across, along} = bandCoords(X, Y);
  // the band's profile wanders a little along its length
  const wob = (fbm(along / 260 + 3.3, 1.7, 21, 3) - 0.5) * 60;
  const t = (across - wob) / DEEP.bw;
  const prof = Math.exp(-t * t * 1.6);
  // star clouds: soft knots along the band
  const clouds = 0.55 + 0.9 * Math.pow(fbm(along / 70 + 11.1, across / 55 + 2.2, 23, 5), 1.6);
  // dust: long lanes roughly along the band, dark and sharp-edged on one side
  const dn = fbm(along / 150 + 7.7, across / 22 + 4.4, 29, 5);
  const lane = Math.max(0, Math.min(1, (dn - 0.5) / 0.14));
  const dust = 1 - DEEP.dust * lane * lane * (3 - 2 * lane) * Math.exp(-t * t * 0.7);
  return {glow: prof * clouds * dust, prof, dust};
};

// ------------------------------------------------------------------ the field (no stars)
/** the far side's diffuse light at 1080 (X, Y), linear RGB into out[o..o+2] */
export const deepAt = (X: number, Y: number, out: Float32Array, o: number) => {
  const t = Math.max(0, Math.min(1, Y / 300));
  let r = DEEP.floorTop[0] + (DEEP.floorBot[0] - DEEP.floorTop[0]) * t;
  let g = DEEP.floorTop[1] + (DEEP.floorBot[1] - DEEP.floorTop[1]) * t;
  let b = DEEP.floorTop[2] + (DEEP.floorBot[2] - DEEP.floorTop[2]) * t;
  const {glow, prof} = bandAt(X, Y);
  // the core is warmer and denser, the edges cool
  const core = Math.min(1, prof * prof * 1.2);
  const cr = DEEP.band[0] + (DEEP.bandCore[0] - DEEP.band[0]) * core;
  const cg = DEEP.band[1] + (DEEP.bandCore[1] - DEEP.band[1]) * core;
  const cb = DEEP.band[2] + (DEEP.bandCore[2] - DEEP.band[2]) * core;
  // unresolved stars: a fine grain of light inside the band (the band is made of stars, not gas)
  const grainy = 0.6 + 0.8 * Math.pow(hash(Math.floor(X), Math.floor(Y), 811), 2);
  const k = glow * DEEP.bandGain * grainy;
  r += cr * k; g += cg * k; b += cb * k;
  out[o] = r * DEEP.gain; out[o + 1] = g * DEEP.gain; out[o + 2] = b * DEEP.gain;
};

// ------------------------------------------------------------------ the stars
interface StarList { d: Float32Array; n: number }
let STARS: StarList | null = null;
/**
 * The star list: x, y, brightness, size, tint, depth (0 far .. 1 near). Three populations:
 *   dust    ~80%: faint, sub-pixel points, denser inside the band
 *   field   ~18%: clear points
 *   near     ~2%: bright, with a small soft bloom (never spikes: spikes are a lens effect)
 */
const buildStars = (): StarList => {
  const W = DEEP.rx1 - DEEP.rx0, H = DEEP.ry1 - DEEP.ry0;
  const n = DEEP.stars;
  const d = new Float32Array((n + HERO.length) * 6);
  let k = 0;
  for (let i = 0; k < n && i < n * 4; i++) {
    const X = DEEP.rx0 + hash(i, 1, 9001) * W, Y = DEEP.ry0 + hash(i, 2, 9001) * H;
    const u = hash(i, 3, 9001);
    const pop = u < 0.82 ? 0 : u < 0.992 ? 1 : 2;
    // the dust population follows the band: rejection-sample against its profile
    if (pop === 0) {
      const {prof, dust} = bandAt(X, Y);
      const keep = 0.28 + 0.72 * prof * dust;
      if (hash(i, 4, 9001) > keep) continue;
    }
    const v = hash(i, 5, 9001);
    // a power law in brightness (many faint, few bright), per population
    const b = pop === 0 ? 0.018 + 0.06 * v : pop === 1 ? Math.min(1.1, 0.06 * Math.pow(Math.max(0.02, v), -0.8)) : 0.8 + 1.2 * v * v;
    const size = pop === 0 ? 0.42 : pop === 1 ? 0.5 + 0.12 * Math.min(1, b) : 0.68 + 0.2 * v;
    const depth = pop === 0 ? 0.1 * v : pop === 1 ? 0.3 + 0.3 * v : 0.8 + 0.2 * v;
    d.set([X, Y, b, size, hash(i, 6, 9001), depth], k * 6);
    k++;
  }
  // the hero stars: a few bright near stars placed where the openings fall (the seam's column, X 1100-1140; the
  // glass's shards around X 1074, Y 110), so that at phone size the opening carries points of light. Authored, not
  // scattered: the far side is designed for this shot.
  // (final polish) the tear's heroes sit on native block centres and do not drift (depth -1), so each lands in ONE
  // phone pixel as a clear point of light for the whole hold; the dust and the field still drift differentially
  // around them (the volume read at 1:1). The retired variants' heroes are unchanged
  for (const [X, Y, b, far] of HERO) if (k < n + HERO.length) { d.set([X, Y, b, far ? 1.0 : 0.85, hash(X, Y, 5), far ? -1 : 0.95], k * 6); k++; }
  return {d, n: k};
};
/** the tear's hero stars: placed along its V (fraction down from the window head, place across its width, brightness),
 *  a little right of the line, since the near stars drift left through the hold */
const TEAR_HERO: Array<[number, number, number]> = [
  [0.04, -0.32, 4.5], [0.1, 0.42, 2.2], [0.17, -0.02, 3.2], [0.31, 0.36, 2.4], [0.43, -0.3, 1.6], [0.6, 0.12, 1.9],
  [0.79, -0.1, 1.2],
];
const tearHero = (): Array<[number, number, number, number]> => TEAR_HERO.map(([f, u, b]) => {
  const y = TEAR.y0 + f * (TEAR.tip - TEAR.y0);
  const w = TEAR.wMax * Math.pow((TEAR.tip - y) / (TEAR.tip - TEAR.y0), TEAR.bow);
  const c = (tearLine(Math.round(y)) + 0.5) * 4;
  return [Math.floor((c + u * w * 1.6) / 4) * 4 + 2, Math.floor(y) * 4 + 2, b, 1];
});
export const HERO: Array<[number, number, number, number?]> = [
  // the seam's column (X 1100-1143): upper pane Y 40-175, lower pane Y 184-271 (retired variant B, kept as a still)
  [1113.4, 66.2, 3.0], [1129.1, 104.7, 1.6], [1108.6, 141.3, 2.2], [1136.7, 158.8, 1.2], [1122.3, 51.5, 1.0],
  [1118.2, 212.5, 2.6], [1106.3, 249.6, 1.4], [1137.6, 88.9, 1.3], [1127.8, 231.1, 1.8], [1134.2, 196.4, 1.1],
  // the glass's shards (around X 1074, Y 110)
  [1052.6, 86.1, 1.5], [1101.2, 123.4, 1.2], [1046.3, 140.2, 0.9], [1089.8, 79.4, 0.8],
  // the tear (C, ships)
  ...tearHero(),
];
export const deepStars = () => (STARS ??= buildStars());

/**
 * Differential drift (1080 px) of a star at `depth` at clip frame p: nothing until `t0` (so the first frame of the
 * opening lines up with the one before), then near stars drift ~0.35 px a frame and the far dust ~0.08.
 */
export const DRIFT = {t0: 60, far: 0.08, near: 0.35, dy: -0.12};
const driftOf = (depth: number, p: number): [number, number] => {
  if (depth < 0) return [0, 0];
  const t = Math.max(0, p - DRIFT.t0);
  const v = DRIFT.far + (DRIFT.near - DRIFT.far) * depth;
  return [-t * v, t * v * DRIFT.dy];
};

/** add the stars into a linear RGB buffer covering the 1080 rect [bx, by, bw, bh] */
export const deepStarsInto = (buf: Float32Array, bx: number, by: number, bw: number, bh: number, p: number) => {
  const {d, n} = deepStars();
  for (let i = 0; i < n; i++) {
    const [ox, oy] = driftOf(d[i * 6 + 5], p);
    const X = d[i * 6] + ox, Y = d[i * 6 + 1] + oy, b0 = d[i * 6 + 2], sig = d[i * 6 + 3], tint = d[i * 6 + 4];
    const reach = b0 > 0.9 ? 7 : 2;
    if (X < bx - reach || X > bx + bw + reach || Y < by - reach || Y > by + bh + reach) continue;
    // scintillation on 1s, small (a twinkle, never a sparkle)
    const tw = 0.85 + 0.15 * hash(i, p, 77);
    const k = b0 * tw * DEEP.gain;
    const cr = tint < 0.15 ? 1.0 : tint > 0.8 ? 0.78 : 0.9, cg = tint < 0.15 ? 0.9 : 0.92, cb = tint < 0.15 ? 0.78 : 1.0;
    for (let y = Math.floor(Y - reach); y <= Math.ceil(Y + reach); y++) for (let x = Math.floor(X - reach); x <= Math.ceil(X + reach); x++) {
      if (x < bx || y < by || x >= bx + bw || y >= by + bh) continue;
      const r2 = (x + 0.5 - X) ** 2 + (y + 0.5 - Y) ** 2;
      let g = Math.exp(-r2 / (2 * sig * sig));
      if (b0 > 0.9) g += 0.035 * Math.exp(-Math.sqrt(r2) / 1.9); // the near stars' soft bloom
      g *= k;
      if (g < 1e-4) continue;
      const o = ((y - by) * bw + (x - bx)) * 3;
      buf[o] += cr * g; buf[o + 1] += cg * g; buf[o + 2] += cb * g;
    }
  }
};

/** film grain for the far side (display space, luma only, on 1s): the soft style's fine grain */
export const deepGrain = (X: number, Y: number, p: number) => (hash(X >> 1, Y >> 1, 3000 + p) - 0.5) * 2 * 1.4;
