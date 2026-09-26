// RETIRED (fix pass, 2026-09-25): the first and second builds' far side (the moonlit night graded within a stop,
// with city bokeh). Too quiet at phone size. Kept for the record only; the build uses deep.ts. See style-jumps §5.2.
// MR. MAS — style jump prototype 2 · THE FAR SIDE: the continuous layer behind the pixel surface (style-jumps §5.2
// "The continuous layer"). The same night as the window, one tier up: a deep blue-violet gradient with haze, a moon
// and its halo, moonlit cloud, fine stars that twinkle on 1s, and the SAME skyline (the plate's own towers, rebuilt
// from darkroom-plate's hash so the far side lines up with the pixel window) as soft bokeh. Authored at 1920 x 1080
// native, never upscaled from 480 x 270 (§3.7). Graded to the night N family and the tonal `soft` style's shade,
// bounce and grain (tonal/styles.ts TONE_STYLES.soft), so it reads as the same world in another medium.
//
// Continuous tone is reserved for M1 (and J6's grade): nothing here is ever used for a gag, and Mas never appears in it.
// Deterministic: hash seeds only; no Math.random, no Date. Pure (runs in Node for previews and in the browser).
import {hash} from '../../../shared/pixel/px';
import {DPLATE} from '../../../shared/pixel/rooms/darkroom-plate';
import {TONE_STYLES} from '../../../shared/tonal/styles';

export const SW = 1920, SH = 812; // the room area at 1080 (native rows 0..202, 4x)
const SOFT = TONE_STYLES.soft;

// ------------------------------------------------------------------ colour helpers (linear light)
const lin = (v: number) => Math.pow(v / 255, 2.2);
const hexLin = (h: string): [number, number, number] => {
  const n = parseInt(h.replace('#', ''), 16);
  return [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255)];
};
export const toByte = (v: number) => Math.max(0, Math.min(255, Math.round(255 * Math.pow(Math.max(0, v), 1 / 2.2))));

// ------------------------------------------------------------------ the gradient (Y in 1080 px)
const STOPS: Array<[number, [number, number, number]]> = [
  [0, hexLin('#070a1f')],
  [110, hexLin('#0d1437')],
  [240, hexLin('#18214f')],
  [330, hexLin('#232a5c')],
  [420, hexLin('#2c2a5a')],
  [520, hexLin('#221f47')],
  [812, hexLin('#141329')],
];
const grad = (Y: number): [number, number, number] => {
  let i = 0;
  while (i < STOPS.length - 2 && Y > STOPS[i + 1][0]) i++;
  const [y0, a] = STOPS[i], [y1, b] = STOPS[i + 1];
  let t = Math.max(0, Math.min(1, (Y - y0) / (y1 - y0)));
  t = t * t * (3 - 2 * t);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
};

// ------------------------------------------------------------------ value noise / fbm
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

// ------------------------------------------------------------------ the moon
// Polish pass: the moon is OFF the top of the frame now. The pixel window has no moon, so a moon in the gap was a
// different sky (and its halo made the seam glow like lightning). Only its broad light is left, silvering the cloud.
export const MOON = {x: 934, y: -420, r: 26};
/**
 * The far side's exposure (linear gain). Graded to within about one stop of the pixel sky it replaces (measured over
 * the window: tools/grade.ts), so FIDELITY carries the difference, not brightness: a bright seam read as lightning.
 */
export const FAR_EXPOSE = 0.36;
const MOON_COL = hexLin('#e6edff');
const HALO_COL = hexLin('#8fa2e6');
const HALO_FAR = hexLin(SOFT.bounce ?? '#5B6FA6');
/** the halo's light at (X, Y) (0..~1), also used to light the clouds and the room's spill colour */
export const haloAt = (X: number, Y: number, mx = MOON.x, my = MOON.y) => {
  const d = Math.hypot(X - mx, Y - my);
  const e = Math.max(0, d - MOON.r);
  return 0.9 * Math.exp(-e / 26) + 0.34 * Math.exp(-e / 120) + 0.08 * Math.exp(-d / 520);
};

// ------------------------------------------------------------------ precomputed layers (half resolution, soft)
const HW = 1200, HH = 406; // half-res maps, wide enough for the drift
interface Layers { cloud: Float32Array; city: Float32Array; cityA: Float32Array; stars: Float32Array }
let LAYERS: Layers | null = null;

/** box blur (3 passes ~ gaussian) of a single-channel map, in place */
const blur1 = (a: Float32Array, w: number, h: number, r: number) => {
  const tmp = new Float32Array(a.length);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[y * w + Math.max(0, Math.min(w - 1, x))];
      for (let x = 0; x < w; x++) {
        tmp[y * w + x] = acc / (2 * r + 1);
        acc += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += tmp[Math.max(0, Math.min(h - 1, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1);
        acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
      }
    }
  }
};

/**
 * The skyline, rebuilt from darkroom-plate's cityLights hashes (same towers, same lit windows) in native coords, and
 * continued past the window's edges behind the wall (the whole room is a surface over this).
 */
const skyline = () => {
  const win = DPLATE.win;
  const W0 = win.x0, WH = win.y1 - win.y0;
  const towers: Array<{x0: number; x1: number; top: number; near: boolean}> = [];
  const lights: Array<{x: number; y: number; warm: number; near: boolean}> = [];
  // far towers (the plate's loop, then continued both ways with a different seed)
  const far = (x: number, k: number, s: number) => {
    const w = 7 + Math.floor(hash(k, 1 + s) * 10);
    const top = win.y0 + Math.round(WH * (0.42 + hash(k, 2 + s) * 0.3));
    towers.push({x0: x, x1: x + w, top, near: false});
    for (let j = top + 3; j < win.y1 - 1; j += 3) for (let i = x + 1; i < x + w - 1; i += 2) if (hash(i, j, x) < 0.07) lights.push({x: i, y: j, warm: hash(j, i, 3) < 0.6 ? 1 : 0, near: false});
    return w + 1 + Math.floor(hash(k, 3 + s) * 3);
  };
  for (let x = W0, k = 0; x < win.x1; k++) x += far(x, k, 0);
  for (let x = win.x1 + 1, k = 0; x < 520; k++) x += far(x, k + 50, 40);
  for (let x = W0 - 1, k = 0; x > -40; k++) { const w = 7 + Math.floor(hash(k, 91) * 10); x -= w + 1; far(x, k + 90, 80); }
  const near = (x: number, k: number, s: number) => {
    const w = 12 + Math.floor(hash(k, 11 + s) * 16);
    const top = win.y0 + Math.round(WH * (0.7 + hash(k, 12 + s) * 0.2));
    towers.push({x0: x, x1: x + w, top, near: true});
    for (let j = top + 2; j < win.y1 - 1; j += 2) for (let i = x + 2; i < x + w - 1; i += 2) if (hash(i, j, x + 7) < 0.1) lights.push({x: i, y: j, warm: hash(j, i, 5) < 0.55 ? 1 : 0, near: true});
    return w + Math.floor(hash(k, 13 + s) * 4);
  };
  for (let x = W0, k = 0; x < win.x1; k++) x += near(x, k, 0);
  for (let x = win.x1 + 1, k = 0; x < 520; k++) x += near(x, k + 50, 40);
  for (let x = W0 - 1, k = 0; x > -40; k++) { const w = 12 + Math.floor(hash(k, 111) * 16); x -= w; near(x, k + 90, 80); }
  // the spire (the cathedral-to-be), as the plate has it
  const spx = W0 + 150, spy = win.y0 + Math.round(WH * 0.34);
  return {towers, lights, spire: {x: spx, y: spy}};
};

const buildLayers = (): Layers => {
  // --- cloud density (half res; drifts): long moonlit bands, thin, high in the sky
  const cloud = new Float32Array(HW * HH);
  for (let y = 0; y < HH; y++) for (let x = 0; x < HW; x++) {
    const X = x * 2, Y = y * 2;
    // two decks: long thin bands high up (they cross the moon), a softer bank lower down
    const n1 = fbm(X / 300 + 3.1, Y / 46, 7);
    const n2 = fbm(X / 520 + 9.7, Y / 120, 8);
    const hi = Math.exp(-Math.pow((Y - 110) / 95, 2));
    const lo = Math.exp(-Math.pow((Y - 300) / 90, 2));
    const s1 = Math.max(0, Math.min(1, (n1 - 0.47) / 0.22)), s2 = Math.max(0, Math.min(1, (n2 - 0.5) / 0.25));
    const c = Math.min(1, s1 * s1 * (3 - 2 * s1) * hi * 0.95 + s2 * s2 * (3 - 2 * s2) * lo * 0.7);
    cloud[y * HW + x] = c;
  }
  blur1(cloud, HW, HH, 2);
  // --- the city (half res; drifts): silhouettes with haze, lit windows as soft bokeh
  const cityA = new Float32Array(HW * HH); // tower coverage 0..1 (far towers hazier)
  const city = new Float32Array(HW * HH * 3); // bokeh light (linear, additive)
  const {towers, lights, spire} = skyline();
  const H2 = 2; // native -> half-res factor (4x / 2)
  for (const t of towers) {
    for (let y = t.top * H2; y < HH; y++) for (let x = Math.max(0, t.x0 * H2); x < Math.min(HW, t.x1 * H2); x++) {
      const v = t.near ? 1 : 0.72;
      cityA[y * HW + x] = Math.max(cityA[y * HW + x], v);
    }
  }
  // (the spire is left out of the far side: it would drift off its pixel twin and read as a smudge in the gap)
  void spire;
  blur1(cityA, HW, HH, 1);
  const WARM = hexLin('#e2a26e'), COOL = hexLin('#78c3cf');
  for (const l of lights) {
    const cx = l.x * H2 + 1, cy = l.y * H2 + 1;
    const r = l.near ? 2.6 : 1.8; // half-res px (5.2 / 3.6 at 1080): out of focus
    const k = (l.near ? 0.3 : 0.18) * (0.5 + 0.5 * hash(l.x, l.y, 9));
    const col = l.warm ? WARM : COOL;
    for (let y = Math.floor(cy - r - 2); y <= Math.ceil(cy + r + 2); y++) for (let x = Math.floor(cx - r - 2); x <= Math.ceil(cx + r + 2); x++) {
      if (x < 0 || y < 0 || x >= HW || y >= HH) continue;
      const d = Math.hypot(x - cx, y - cy);
      const disc = Math.max(0, Math.min(1, r + 0.7 - d)) * (0.75 + 0.25 * Math.min(1, d / r)); // a bokeh disc, a touch brighter at the rim
      const o = (y * HW + x) * 3;
      city[o] += col[0] * k * disc; city[o + 1] += col[1] * k * disc; city[o + 2] += col[2] * k * disc;
    }
  }
  // --- stars (full res list packed as x, y, b, tint)
  const NS = 900;
  const stars = new Float32Array(NS * 4);
  for (let i = 0; i < NS; i++) {
    const X = hash(i, 1, 404) * (SW + 200) - 20;
    const Y = Math.pow(hash(i, 2, 404), 1.35) * 420;
    const b = 0.1 + 1.6 * Math.pow(hash(i, 3, 404), 5);
    stars.set([X, Y, b, hash(i, 4, 404)], i * 4);
  }
  return {cloud, city, cityA, stars};
};
export const layers = () => (LAYERS ??= buildLayers());

const bil = (a: Float32Array, w: number, h: number, x: number, y: number, ch = 1, c = 0) => {
  x = Math.max(0, Math.min(w - 1.001, x)); y = Math.max(0, Math.min(h - 1.001, y));
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const i00 = (yi * w + xi) * ch + c, i10 = i00 + ch, i01 = i00 + w * ch, i11 = i01 + ch;
  return (a[i00] * (1 - fx) + a[i10] * fx) * (1 - fy) + (a[i01] * (1 - fx) + a[i11] * fx) * fy;
};

// ------------------------------------------------------------------ drift (the first smooth motion in the frame)
/** per-layer drift in 1080 px at clip frame p (0 before the crack): far things move least */
export const drift = (p: number) => {
  // still until the pour (so the far side lines up with the window when it opens), then 0.3 native px a frame for
  // the nearest layer, less for the far ones
  const t = Math.max(0, p - 60);
  return {stars: t * 0.25, moon: t * 0.25, cloud: t * 0.7, city: t * 1.2};
};

const CLOUD_DARK = hexLin('#0d1230');
const CLOUD_LIT = hexLin('#9aa9e0');
const CITY_SIL = hexLin('#0a0c1d');
const CITY_HAZE = hexLin('#1c1f45');
const SHADE = hexLin(SOFT.shade ?? '#241E46');

/**
 * Sample the far side at 1080 px (X, Y) for clip frame p, WITHOUT stars and grain (see starsInto / grain).
 * Returns linear RGB.
 */
export const skyAt = (X: number, Y: number, p: number, out: Float32Array, o: number) => {
  const L = layers();
  const d = drift(p);
  let [r, g, b] = grad(Y);
  // a whisper of the soft style's shade in the lower sky (cool violet ambient, never black)
  const sh = Math.max(0, Math.min(1, (Y - 300) / 400)) * 0.25;
  r += (SHADE[0] - r) * sh; g += (SHADE[1] - g) * sh; b += (SHADE[2] - b) * sh;
  // moon halo (additive light)
  const mx = MOON.x - d.moon, my = MOON.y;
  const h = haloAt(X, Y, mx, my);
  r += HALO_COL[0] * h * 0.55 + HALO_FAR[0] * h * 0.12;
  g += HALO_COL[1] * h * 0.55 + HALO_FAR[1] * h * 0.12;
  b += HALO_COL[2] * h * 0.55 + HALO_FAR[2] * h * 0.12;
  // the disc: limb-darkened, faint maria, a soft 1.5 px edge
  const dm = Math.hypot(X - mx, Y - my);
  if (dm < MOON.r + 2) {
    const e = Math.max(0, Math.min(1, (MOON.r + 0.75 - dm) / 1.5));
    const nz = Math.sqrt(Math.max(0, 1 - Math.pow(dm / MOON.r, 2)));
    const mar = 0.82 + 0.18 * fbm((X - mx) / 9 + 40, (Y - my) / 9 + 40, 12, 3);
    const k = e * (0.5 + 0.45 * nz) * mar * 0.95;
    r += (MOON_COL[0] - r) * Math.min(1, k); g += (MOON_COL[1] - g) * Math.min(1, k); b += (MOON_COL[2] - b) * Math.min(1, k);
  }
  // cloud: dark where the moon isn't, silver where it is; drifts at 0.3 native px a frame
  const c = bil(L.cloud, HW, HH, (X + d.cloud) / 2, Y / 2);
  if (c > 0.001) {
    const lit = Math.min(1, h * 2.2);
    const cr = CLOUD_DARK[0] + (CLOUD_LIT[0] - CLOUD_DARK[0]) * lit, cg = CLOUD_DARK[1] + (CLOUD_LIT[1] - CLOUD_DARK[1]) * lit, cb = CLOUD_DARK[2] + (CLOUD_LIT[2] - CLOUD_DARK[2]) * lit;
    const a = c * 0.8;
    r += (cr - r) * a; g += (cg - g) * a; b += (cb - b) * a;
  }
  // the city: hazy silhouettes, then the lit windows as bokeh
  const cx = (X + d.city) / 2, cy = Y / 2;
  const ca = bil(L.cityA, HW, HH, cx, cy);
  if (ca > 0.001) {
    const haze = 1 - ca; // far towers (0.72) sit in more haze
    const sr = CITY_SIL[0] + (CITY_HAZE[0] - CITY_SIL[0]) * haze * 2, sg = CITY_SIL[1] + (CITY_HAZE[1] - CITY_SIL[1]) * haze * 2, sb = CITY_SIL[2] + (CITY_HAZE[2] - CITY_SIL[2]) * haze * 2;
    const a = Math.min(1, ca * 1.15);
    r += (sr - r) * a; g += (sg - g) * a; b += (sb - b) * a;
    r += bil(L.city, HW, HH, cx, cy, 3, 0); g += bil(L.city, HW, HH, cx, cy, 3, 1); b += bil(L.city, HW, HH, cx, cy, 3, 2);
  }
  out[o] = r * FAR_EXPOSE; out[o + 1] = g * FAR_EXPOSE; out[o + 2] = b * FAR_EXPOSE;
  return c;
};

/**
 * Add the stars (fine points, twinkling on 1s, hidden by cloud and the city) into a linear RGB buffer covering the
 * 1080 rect [bx, by, bw, bh]. `cover(X, Y)` returns the cloud/city cover there (0..1).
 */
export const starsInto = (buf: Float32Array, bx: number, by: number, bw: number, bh: number, p: number, cover: (X: number, Y: number) => number) => {
  const L = layers();
  const d = drift(p);
  const NS = L.stars.length / 4;
  for (let i = 0; i < NS; i++) {
    const X = L.stars[i * 4] - d.stars, Y = L.stars[i * 4 + 1], b0 = L.stars[i * 4 + 2], tint = L.stars[i * 4 + 3];
    if (X < bx - 2 || X > bx + bw + 2 || Y < by - 2 || Y > by + bh + 2) continue;
    const tw = 0.8 + 0.2 * hash(i, p, 77); // on 1s, a scintillation, never a sparkle
    const occl = 1 - Math.min(1, cover(X, Y) * 1.3);
    const moonGlare = Math.min(1, haloAt(X, Y, MOON.x - d.moon, MOON.y) * 1.4);
    const k = b0 * tw * occl * (1 - moonGlare) * 1.7 * Math.sqrt(FAR_EXPOSE); // points keep more than the field: the stars are the fidelity
    if (k < 0.004) continue;
    const cr = tint < 0.2 ? 1.0 : tint > 0.85 ? 0.8 : 0.92, cg = 0.93, cb = tint < 0.2 ? 0.82 : 1.0;
    const sig = 0.55 + 0.35 * b0;
    for (let y = Math.floor(Y - 2); y <= Math.ceil(Y + 2); y++) for (let x = Math.floor(X - 2); x <= Math.ceil(X + 2); x++) {
      if (x < bx || y < by || x >= bx + bw || y >= by + bh) continue;
      const g = Math.exp(-((x + 0.5 - X) ** 2 + (y + 0.5 - Y) ** 2) / (2 * sig * sig)) * k;
      const o = ((y - by) * bw + (x - bx)) * 3;
      buf[o] += cr * g; buf[o + 1] += cg * g; buf[o + 2] += cb * g;
    }
  }
};

/** film grain for the far side: soft style amount, on 1s, luma only (in display space) */
export const grain = (X: number, Y: number, p: number) => (hash(X >> 1, Y >> 1, 3000 + p) - 0.5) * 2 * (SOFT.grain * 255) * 0.3;

/** the cloud + city cover at (X, Y), for star occlusion */
export const coverAt = (X: number, Y: number, p: number) => {
  const L = layers();
  const d = drift(p);
  return Math.max(bil(L.cloud, HW, HH, (X + d.cloud) / 2, Y / 2), bil(L.cityA, HW, HH, (X + d.city) / 2, Y / 2));
};
