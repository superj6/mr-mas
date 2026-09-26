// MR. MAS — style jump prototype C · J6 · THE RING: the CONTINUOUS side. Prototype builder 3.
// Brief: show/bible/style-jumps.md §5.3 (M2, "his composure is the grid"). Code only, never generated.
//
// One damped circular wave (a single crest + trough: one ring, never a train) as a height field. Its leading edge IS
// the front between the media: native pixels whose centres the front has passed are handed from the pixel engine to
// this renderer (the matte is stepped on the 480 x 270 grid, so the seam belongs to the pixel world); inside, the
// water is rendered at 1920 x 1080 native: refraction of the bottom, the monitor's reflection bending with the surface
// normals, the key's shading on the slopes, a 180-degree shutter. Deterministic (hash grain, no Math.random, no Date).
import {clamp, hash} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {textLines} from '../../../shared/tonal/env/strokeFont';
import {G, KEY, waterLevels, levelsToLin, quadInside, screenGlow, TYPE, REFL, cursorOn, inWater, wallGlow} from './art';

// ------------------------------------------------------------------ the clip's clock (prototype frames p)
/** pre p0-29 · jump p30-89 (one bar at 96 BPM) · after p90-119 */
export const CLIP = {frames: 120, jumpIn: 30, rim: 65, settle: 81, snap: 90};

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// the front: from the centre (no drop, no cause) to the rim at p65 at CONSTANT speed, then on into the wall (virtual).
// (Polish pass: the old exponential ease-out is how a UI touch ripple moves; real water rings travel at the wave's own
// speed. The slowing is the amplitude's damping, not the front's.)
const TAU0 = 29.5;
const VMIN = G.Rw / (CLIP.rim - TAU0); // ~1.4 native px a frame
/** radius of the ring's leading edge in native px at (fractional) frame p */
export const front = (p: number) => VMIN * Math.max(0, p - TAU0);
/** the packet's width (native px): it broadens a little as it travels */
const sigma = (F: number) => 1.0 + 0.014 * Math.min(F, G.Rw);
/**
 * The ring's profile in u = (rho - front) / sigma: ONE narrow crest just inside the front and a shallow, wider trough
 * behind it (so no flank behind the trough is steep enough to glint: one ring, never two lines).
 */
// (Polish pass: a narrower packet. The old one spanned ~15 px behind the front, so a young ring was all packet: a dome
// that pulled the screen's reflection into an inverted image, a lens. Now the middle is calm as soon as it opens.)
const U_CREST = -1.8, U_TROUGH = -3.9, W_TROUGH = 1.25, D_TROUGH = 0.4;
const prof = (u: number, dt = D_TROUGH) => {
  if (u < -7.5 || u > 3) return 0;
  const a = u - U_CREST, b = (u - U_TROUGH) / W_TROUGH;
  return Math.exp(-0.5 * a * a) - dt * Math.exp(-0.5 * b * b);
};
const dprof = (u: number, dt = D_TROUGH) => {
  if (u < -7.5 || u > 3) return 0;
  const a = u - U_CREST, b = (u - U_TROUGH) / W_TROUGH;
  return -a * Math.exp(-0.5 * a * a) + (dt / W_TROUGH) * b * Math.exp(-0.5 * b * b);
};
/** the trough only deepens once the ring has travelled (a small ring with a dark middle reads as a drop's dimple) */
const troughAt = (F: number) => D_TROUGH * smooth(8, 26, F);
/** peak |dprof/du| (the crest's flanks), so `amp` stays a peak slope */
const DPEAK = Math.exp(-0.5);
/** peak slope of the incident ring (dimensionless): grows from nothing, spreads, damps, settles to zero */
const incAmp = (p: number, k: Knobs) => {
  const F = front(p);
  const rise = smooth(2, 24, F); // no impact at the centre: it opens out of nothing
  const spread = 1 / Math.sqrt(0.35 + Math.min(F, G.Rw) / G.Rw);
  const damp = Math.exp(-0.012 * Math.max(0, p - CLIP.jumpIn));
  const settle = 1 - smooth(CLIP.settle - 3, CLIP.settle + 4, p); // still from p85: four frames of calm, real water
  return k.amp * rise * spread * damp * settle;
};

export interface Knobs {
  /** incident peak slope */
  amp: number;
  /** the return ring's share of the incident amplitude (the brief: about 30%) */
  ret: number;
  /** reflection / refraction displacement per unit slope, native px */
  kRefl: number;
  kRefr: number;
  /** slope shading (key) and height shading (crest light, trough shade) */
  kShade: number;
  kHeight: number;
  /** the key's glint on the crest: strength and lobe sharpness */
  kGlint: number;
  glintPow: number;
}
// Polish pass: the ring is shown by what it BENDS (the grain, the base, the screen's reflection and its type), not by
// its own highlight: kHeight 0.6 -> 0.15, kShade 0.35 -> 0.1, kRefl 10 -> 14; the glint only where a crest faces the
// monitor. On dark water a ring is invisible except where it crosses something to bend.
export const KNOBS: Knobs = {amp: 0.36, ret: 0.4, kRefl: 14, kRefr: 3.5, kShade: 0.1, kHeight: 0.15, kGlint: 0.12, glintPow: 3};

/**
 * Radial slope dh/drho (dimensionless) and the crest's relative height (1 = the fresh crest) at radius rho (native
 * px), frame p. The wall reflects the ring in phase (method of images) at k.ret of its amplitude: the return ring.
 */
export const surface = (rho: number, p: number, k: Knobs = KNOBS): [number, number] => {
  if (p < CLIP.jumpIn - 0.5 || p >= CLIP.snap) return [0, 0];
  const F = front(p), sg = sigma(F), A = incAmp(p, k);
  if (A <= 0) return [0, 0];
  const rel = A / k.amp;
  const u = (rho - F) / sg, dt = troughAt(F);
  let s = (A / DPEAK) * dprof(u, dt), h = rel * prof(u, dt);
  const ui = (2 * G.Rw - rho - F) / sg;
  if (ui > -7.5 && ui < 3) {
    s -= k.ret * (A / DPEAK) * dprof(ui, dt);
    h += k.ret * rel * prof(ui, dt);
  }
  return [s, h];
};

/** is native pixel (x, y) continuous at frame p? The matte: stepped on the native grid, the front's edge. */
export const matteOn = (x: number, y: number, p: number) => {
  if (p < CLIP.jumpIn || p >= CLIP.snap || !inWater(x, y)) return false;
  return Math.hypot(x + 0.5 - G.cx, y + 0.5 - G.cy) < front(p);
};

// ------------------------------------------------------------------ colour (linear light)
const toLin = (c: number) => {
  const f = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return [f((c >> 16) & 255), f((c >> 8) & 255), f(c & 255)];
};
const LUT = (() => {
  const t = new Uint8Array(4097);
  for (let i = 0; i <= 4096; i++) { const v = i / 4096; t[i] = Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)); }
  return t;
})();
const toS = (v: number) => (v <= 0 ? 0 : v >= 1 ? 255 : LUT[(v * 4096) | 0]);
const C2 = toLin(PAL.C2), C3 = toLin(PAL.C3), C4 = toLin(PAL.C4), C7 = toLin(PAL.C7);
// the soft tonal grade (tonal/styles.ts 'soft'): spot #5FE3F2 for the key's light, shade #241E46 for its absence
const SPOT = toLin(0x5fe3f2), SHADE = toLin(0x241e46), GLINT = toLin(0x8ff0f0);

// ------------------------------------------------------------------ the continuous plates, authored at 1080 (never upscaled)
const S = 4; // 1080 px per native px
const PADN = 8; // native margin around the disc for displaced lookups
const BX0 = (G.cx - G.Rw - PADN) * S, BY0 = (G.cy - G.Rw - PADN) * S;
const BW = (2 * (G.Rw + PADN)) * S, BH = BW;
interface Plates { under: Float32Array; refl: Float32Array; bloom: Float32Array; }
let PLATES: Plates | null = null;
// The type, continuous: the grid could only hold type SHAPES; the real water resolves the same line as real
// letterforms (the tonal env's monoline stroke font), flipped like the pixel line and fitted to its width, so nothing
// shifts at the seam. The fidelity reveals detail the grid couldn't carry; it adds no content.
const STROKE_SEGS = (() => {
  const str = "define ''win.''";
  const size = 2.9;
  const [probe, w0] = textLines(str, 0, 0, size, 0);
  void probe;
  const tracking = (TYPE.w - 1 - w0) / (size * (str.length - 1));
  const [lines] = textLines(str, 0, 0, size, tracking);
  const segs: number[] = [];
  const ox = G.cx + TYPE.x + 0.5, base = G.cy + TYPE.y + 0.35;
  for (const st of lines)
    for (let i = 0; i + 1 < st.length || (st.length === 1 && i === 0); i++) {
      const [x0, y0] = st[i], [x1, y1] = st[Math.min(i + 1, st.length - 1)];
      segs.push(ox + x0, base - y0, ox + x1, base - y1); // flipped: the letters hang down from the baseline
    }
  return new Float32Array(segs);
})();
const TYPE_BOX = (() => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < STROKE_SEGS.length; i += 2) { x0 = Math.min(x0, STROKE_SEGS[i]); x1 = Math.max(x1, STROKE_SEGS[i]); y0 = Math.min(y0, STROKE_SEGS[i + 1]); y1 = Math.max(y1, STROKE_SEGS[i + 1]); }
  return [x0 - 1, y0 - 1, x1 + 1, y1 + 1];
})();
const STROKE_R = 0.3; // half the stroke weight, native px (2.4 px at 1080)
const typeCov = (xn: number, yn: number) => {
  if (xn < TYPE_BOX[0] || yn < TYPE_BOX[1] || xn > TYPE_BOX[2] || yn > TYPE_BOX[3]) return 0;
  let best = Infinity;
  for (let i = 0; i < STROKE_SEGS.length; i += 4) {
    const ax = STROKE_SEGS[i], ay = STROKE_SEGS[i + 1], bx = STROKE_SEGS[i + 2], by = STROKE_SEGS[i + 3];
    const ex = bx - ax, ey = by - ay, l2 = ex * ex + ey * ey;
    const t = l2 > 0 ? clamp(((xn - ax) * ex + (yn - ay) * ey) / l2, 0, 1) : 0;
    best = Math.min(best, Math.hypot(xn - ax - ex * t, yn - ay - ey * t));
  }
  return smooth(STROKE_R + 0.14, STROKE_R - 0.14, best);
};
/** separable box blur, `passes` times (3 passes ~ a gaussian) */
const blur = (src: Float32Array, w: number, h: number, r: number, passes = 3) => {
  const a = Float32Array.from(src), b = new Float32Array(w * h), n = 2 * r + 1;
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[row + clamp(x, 0, w - 1)];
      for (let x = 0; x < w; x++) { b[row + x] = acc / n; acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)]; }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[clamp(y, 0, h - 1) * w + x];
      for (let y = 0; y < h; y++) { a[y * w + x] = acc / n; acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]; }
    }
  }
  return a;
};
const plates = (): Plates => {
  if (PLATES) return PLATES;
  const under = new Float32Array(BW * BH * 3), refl = new Float32Array(BW * BH * 4), clip = new Float32Array(BW * BH);
  const col = [0, 0, 0];
  for (let j = 0; j < BH; j++)
    for (let i = 0; i < BW; i++) {
      const xn = (BX0 + i + 0.5) / S, yn = (BY0 + j + 0.5) / S;
      const o = j * BW + i;
      const [nL, cL] = waterLevels(xn, yn); // the desk through the water: the same levels the pixel side quantizes
      levelsToLin(nL, cL, col);
      under[o * 3] = col[0]; under[o * 3 + 1] = col[1]; under[o * 3 + 2] = col[2];
      // the reflection: its edge anti-aliased at 1080, the glow of the screen continuous, the type soft
      const qi = quadInside(xn, yn);
      const a = smooth(-0.3, 0.3, qi);
      if (a > 0) {
        const gl = screenGlow(xn, yn);
        const e = smooth(0.1, 1.4, qi);
        const t = typeCov(xn, yn) * 0.95;
        for (let c = 0; c < 3; c++) {
          const body = gl > 0.4 ? C3[c] + (C4[c] - C3[c]) * smooth(0.4, 0.85, gl) : C2[c] + (C3[c] - C2[c]) * smooth(0.05, 0.4, gl);
          let v = C2[c] + (body - C2[c]) * e;
          v = v + (C7[c] - v) * t;
          refl[o * 4 + c] = v * a;
        }
        refl[o * 4 + 3] = a;
      }
      // the lit far wall in the water (the pixel render's 1-2 px band by the meniscus), as a soft band of light
      const w = wallGlow(xn, yn);
      const wa = smooth(0.3, 0.8, w) * (1 - a);
      if (wa > 0) {
        const t = smooth(0.62, 0.95, w);
        for (let c = 0; c < 3; c++) refl[o * 4 + c] += (C3[c] + (C4[c] - C3[c]) * t) * wa;
        refl[o * 4 + 3] += wa;
      }
      const inDisc = Math.hypot(xn - G.cx, yn - G.cy) < G.Rw;
      clip[o] = inDisc ? a : 0;
    }
  const bloom = blur(clip, BW, BH, 9, 3);
  // the bottom is seen through the water, a depth below the surface the reflection lies on: a touch out of focus
  const soft = new Float32Array(BW * BH);
  for (let c = 0; c < 3; c++) {
    for (let o = 0; o < BW * BH; o++) soft[o] = under[o * 3 + c];
    const bb = blur(soft, BW, BH, 1, 1); // just a touch: the grain must survive, it is what the ring bends
    for (let o = 0; o < BW * BH; o++) under[o * 3 + c] = bb[o];
  }
  PLATES = {under, refl, bloom};
  return PLATES;
};
const sample = (tex: Float32Array, n: number, X: number, Y: number, out: number[]) => {
  // bilinear, in 1080 coords (pixel centres at +0.5)
  const fx = clamp(X - BX0 - 0.5, 0, BW - 1.001), fy = clamp(Y - BY0 - 0.5, 0, BH - 1.001);
  const x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0;
  const o00 = (y0 * BW + x0) * n, o10 = o00 + n, o01 = o00 + BW * n, o11 = o01 + n;
  for (let c = 0; c < n; c++) out[c] = (tex[o00 + c] * (1 - ax) + tex[o10 + c] * ax) * (1 - ay) + (tex[o01 + c] * (1 - ax) + tex[o11 + c] * ax) * ay;
};

// the key, as a 3D direction (toward the monitor: up-left and up out of the desk)
const dir3 = (elevDeg: number) => {
  const e = (elevDeg * Math.PI) / 180;
  return [KEY[0] * Math.cos(e), KEY[1] * Math.cos(e), Math.sin(e)];
};
const L3 = dir3(38);
/** the monitor as seen in the water: a crest that tilts ~0.3 toward it throws its light straight up into the lens */
const LG = dir3(56);

/**
 * Paint the continuous water into `rgba` (1920 x 1080 RGBA) for frame p, only where the matte is on.
 * Three sub-frames across a 180-degree shutter; hashed grain; the cursor keeps its beat in the reflection.
 */
export const paintContinuous = (rgba: Uint8ClampedArray, p: number, k: Knobs = KNOBS) => {
  if (p < CLIP.jumpIn || p >= CLIP.snap) return;
  const P = plates();
  const u = [0, 0, 0], r = [0, 0, 0, 0], bl = [0];
  const cur = cursorOn(p);
  const SUB = [-0.16, 0, 0.16]; // a 120-degree shutter: a trace of blur on the fast opening, none once it slows
  const acc = [0, 0, 0];
  for (let Y = BY0; Y < BY0 + BH; Y++) {
    const yn = (Y + 0.5) / S;
    for (let X = BX0; X < BX0 + BW; X++) {
      const xn = (X + 0.5) / S;
      if (!matteOn(Math.floor(X / S), Math.floor(Y / S), p)) continue;
      const dx = xn - G.cx, dy = yn - G.cy, rho = Math.hypot(dx, dy);
      const rx = rho > 1e-6 ? dx / rho : 0, ry = rho > 1e-6 ? dy / rho : 0;
      acc[0] = acc[1] = acc[2] = 0;
      for (const sub of SUB) {
        const [s, h] = surface(rho, p + sub, k);
        // what you see through it (refracted) and on it (the monitor, reflected: displaced twice as hard)
        sample(P.under, 3, X + rx * s * k.kRefr * S, Y + ry * s * k.kRefr * S, u);
        const RX = X + rx * s * k.kRefl * S, RY = Y + ry * s * k.kRefl * S;
        sample(P.refl, 4, RX, RY, r);
        sample(P.bloom, 1, RX, RY, bl);
        let a = r[3];
        let cr = r[0], cg = r[1], cb = r[2];
        if (cur) {
          // the cursor in the reflection (a 2 x 3 block, anti-aliased, riding the same displacement)
          const cxn = RX / S, cyn = RY / S;
          const c0x = G.cx + REFL.cursor.x, c0y = G.cy + REFL.cursor.y;
          const cov = smooth(-0.3, 0.3, Math.min(cxn - c0x, c0x + REFL.cursor.w - cxn)) * smooth(-0.3, 0.3, Math.min(cyn - c0y, c0y + REFL.cursor.h - cyn)) * a;
          cr += (C7[0] * a - cr) * cov; cg += (C7[1] * a - cg) * cov; cb += (C7[2] * a - cb) * cov;
        }
        // the key on the slopes (subtle), the crest catching the room's cyan (a thin line, strongest facing the key),
        // the trough a thin shade, and the monitor's own glint where a crest tilts straight at it
        const nx = -s * rx, ny = -s * ry, nl = Math.hypot(nx, ny, 1);
        const ndl = (nx * L3[0] + ny * L3[1] + L3[2]) / nl - L3[2];
        const fk = 0.5 + 0.5 * (rx * KEY[0] + ry * KEY[1]);
        const face = 0.18 + 0.82 * fk * fk;
        const crest = Math.max(0, h) * face, trough = Math.max(0, -h) * 0.6;
        const nz = 1 / nl, rX = 2 * nz * (nx / nl), rY = 2 * nz * (ny / nl), rZ = 2 * nz * nz - 1;
        const gd = rX * LG[0] + rY * LG[1] + rZ * LG[2];
        // the glint only where the crest faces the monitor
        const glint = gd > LG[2] ? Math.pow((gd - LG[2]) / (1 - LG[2]), k.glintPow) * k.kGlint * smooth(0.55, 0.95, fk) : 0;
        const bloomA = bl[0] * 0.06 * (1 - a); // the screen's light in the water: faint (it must not read as a lens)
        const mul = (1 + Math.max(-0.6, ndl * k.kShade)) * (1 - 0.55 * trough * k.kHeight * 2);
        for (let c = 0; c < 3; c++) {
          let v = u[c] * (1 - a) + (c === 0 ? cr : c === 1 ? cg : cb);
          v += SPOT[c] * bloomA * 0.5;
          v *= mul;
          if (trough > 0) v += (SHADE[c] * 0.03 - v) * Math.min(1, trough * k.kHeight);
          v += SPOT[c] * crest * crest * k.kHeight * 0.05 + GLINT[c] * glint;
          acc[c] += v;
        }
      }
      const o = (Y * 1920 + X) * 4;
      const n = (hash(X, Y, 911 + p) - 0.5) * 3.2; // grain, in 8-bit steps
      rgba[o] = clamp(toS(acc[0] / SUB.length) + n, 0, 255);
      rgba[o + 1] = clamp(toS(acc[1] / SUB.length) + n, 0, 255);
      rgba[o + 2] = clamp(toS(acc[2] / SUB.length) + n, 0, 255);
      rgba[o + 3] = 255;
    }
  }
};
