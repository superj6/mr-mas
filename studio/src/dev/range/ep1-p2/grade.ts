// MR. MAS · range E1-P2: the film's grade, on the CPU. The product film sits on a monitor in a dark room, so it can't
// out-glow the monitor: exposure comes down a little, then a soft knee on the brightest channel rolls every highlight
// under a hard ceiling (no channel above 80%; the cap sits 10 levels under it for the encode's overshoot). The knee
// works on max(R,G,B) and scales all three channels by the same ratio, so the hue AND the saturation are kept: the
// earlier luminance shoulder pulled the yellow's red channel toward grey and turned the vinyl mustard. Below the knee
// the picture is untouched. The screen's black sits a hair above black, the film's own lens vignette darkens its
// corners, a fine grain is fixed per take frame, and a half-LSB ordered dither keeps the sweep from banding.
export const WHITE = 0.80;                      // the ceiling, in display (sRGB) terms
export const GRADE = {gain: 0.82, knee: 0.62, black: 0.0035, vignette: 0.26, cool: 0.015, grain: 3.2};

const s2l = new Float32Array(256);
for (let i = 0; i < 256; i++) { const v = i / 255; s2l[i] = v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
const l2s = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const CEIL = s2l[Math.round(WHITE * 255) - 10]; // linear ceiling (a margin under 80 % for the encode, see below)
const CAP8 = Math.round(WHITE * 255) - 10;     // 194
const Q = 4096, QMAX = 2.0;
const ENC = new Float32Array(Q + 1);           // linear -> sRGB*255 (pre-dither)
for (let i = 0; i <= Q; i++) ENC[i] = l2s(Math.min(1, (i / Q) * QMAX)) * 255;
const enc = (v: number) => ENC[Math.min(Q, Math.max(0, Math.round((v / QMAX) * Q)))];
/** the knee: linear in, linear out; untouched below KNEE, then an exponential roll-off whose asymptote is the ceiling */
const KNEE = GRADE.knee * CEIL;
const knee = (m: number) => (m <= KNEE ? m : KNEE + (CEIL - KNEE) * (1 - Math.exp(-(m - KNEE) / (CEIL - KNEE))));
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** a fast integer hash -> [0, 1) (the grain's per-pixel noise; one field per take frame) */
const hash01 = (x: number, y: number, s: number) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/** grade an RGBA buffer in place (w x h); the vignette is centred on the buffer (the film's own frame).
 *  `seed` is the take frame: the film's grain is one fixed field per frame of the take, so it is alive while the film
 *  plays on 1s and freezes with every hold of the ramp (a still is a still, grain and all). */
export const gradeRGBA = (d: Uint8ClampedArray, w: number, h: number, seed = 0) => {
  const cx = (w - 1) / 2, cy = (h - 1) / 2, rn = 1 / (cx * cx + cy * cy);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r2 = ((x - cx) * (x - cx) + (y - cy) * (y - cy)) * rn;
      const vig = 1 - GRADE.vignette * r2 * r2 * 1.6 - GRADE.vignette * 0.3 * r2;
      const e = vig * GRADE.gain;
      let r = s2l[d[i]] * e * (1 - GRADE.cool), g = s2l[d[i + 1]] * e, b = s2l[d[i + 2]] * e * (1 + GRADE.cool);
      const m = Math.max(r, g, b);
      const k = m > 1e-6 ? knee(m) / m : 1;
      const lift = 1 - GRADE.black / CEIL;
      r = GRADE.black + r * k * lift; g = GRADE.black + g * k * lift; b = GRADE.black + b * k * lift;
      const dz = (B4[(y & 3) * 4 + (x & 3)] + 0.5) / 16 - 0.5;
      // the grain: fine, luminance only, strongest in the mids (a photographic film, not sensor noise in the blacks)
      const er = enc(r), eg = enc(g), eb = enc(b);
      const v = (0.2126 * er + 0.7152 * eg + 0.0722 * eb) / 255;
      const gr = (hash01(x, y, seed + 1) + hash01(x + 7919, y, seed + 1) - 1) * GRADE.grain * 4 * v * (1 - v);
      // the hard cap sits 10 levels under the 80 % ceiling: the 4:2:0 encode overshoots saturated edges (the bill's red
      // channel against the grey sweep) by up to ~14 levels, and the ceiling is judged on the encoded file
      d[i] = Math.min(CAP8, er + dz + gr); d[i + 1] = Math.min(CAP8, eg + dz + gr); d[i + 2] = Math.min(CAP8, eb + dz + gr);
    }
};
