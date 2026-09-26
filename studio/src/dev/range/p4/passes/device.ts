// MR. MAS · range passes: the DEVICE treatments (style-range §2.2 THE DEVICE). Each one re-treats our own pixel frame
// the way that device would, in the engine's own terms: on the native 480x270 grid, snapped to the master palette.
//   broadcastSafe   P3 BROADCAST: flat institutional grade (lifted blacks, capped whites, low chroma)
//   softChroma      P5 STREAM: 4:2:0-style chroma, shared across 2x2 blocks while luma stays per pixel
//   macroblockDrift P5 STREAM: on a fast move, a few 8x8 blocks still carry the previous frame, offset along the move
//   miniature       any bezel: the device's picture area-averaged down to a small screen in the room
//   fisheye         P21 IRIS: a barrel lens that bends the grid correctly (inverse-mapped, nearest, whole pixels)
//   irisBlades      P21 IRIS: the Orb's six aperture blades, opening in held steps
// No blur anywhere: softness is always stepped resolution or chroma sharing.
import {Buf, clamp} from '../../../../shared/pixel/px';
import {PAL, PAL_NAMES, lightness} from '../../../../shared/pixel/palette';
import {averageSnap, buildGrade, labCached, nearestLab, applyGrade} from './color';

// ------------------------------------------------------------------ P3 BROADCAST: the institution's webcast grade
let BSAFE: Map<number, number> | null = null;
/**
 * broadcast-safe: blacks lift to about N3/G1, whites cap near G5/P1, chroma to ~45%: the flat, even webcast look.
 * The target pool leaves out the skin and dusk ramps, so desaturated wood lands on wood and greys, never on mauve.
 */
export const broadcastSafe = (b: Buf, x0 = 0, y0 = 0, w = b.w, h = b.h) => {
  if (!BSAFE) BSAFE = buildGrade({lo: 0.2, hi: 0.78, gamma: 0.9, chroma: 0.45, tint: [0.0, -0.006], tintAmt: 0.2,
    pool: PAL_NAMES.filter((n) => !'SKXU'.includes(n[0])).map((n) => PAL[n])});
  applyGrade(b, BSAFE, x0, y0, w, h);
};

// ------------------------------------------------------------------ P5 STREAM: shared chroma
/**
 * Chroma shared across 2x2 blocks: each pixel keeps its own OKLab lightness, takes the block's average a/b, and is
 * snapped back to the palette. Edges between saturated colours bleed by one pixel (the stream's soft colour);
 * greys and text stay crisp because their chroma is already near zero.
 */
export const softChroma = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  const cache = new Map<string, number>();
  for (let by = y0; by < y0 + h; by += 2)
    for (let bx = x0; bx < x0 + w; bx += 2) {
      let A = 0, B = 0, n = 0;
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const x = bx + i, y = by + j;
        if (x >= x0 + w || y >= y0 + h) continue;
        const [, a, bb] = labCached(b.c[y * b.w + x]); A += a; B += bb; n++;
      }
      A /= n; B /= n;
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const x = bx + i, y = by + j;
        if (x >= x0 + w || y >= y0 + h) continue;
        const c = b.c[y * b.w + x];
        const [L, a, bb] = labCached(c);
        // only move pixels whose chroma differs noticeably from the block's (keeps flat fills untouched)
        if (Math.abs(a - A) + Math.abs(bb - B) < 0.03) continue;
        const qa = Math.round(A * 200), qb = Math.round(B * 200);
        const k = `${c}|${qa}|${qb}`;
        let v = cache.get(k);
        // computed from the rounded block chroma (a pure function of the key: order-independent)
        if (v === undefined) { v = nearestLab(L, (a + qa / 200) / 2, (bb + qb / 200) / 2); cache.set(k, v); }
        b.c[y * b.w + x] = v;
      }
    }
};

// ------------------------------------------------------------------ P5 STREAM: one macroblock drift on a fast move
/**
 * Copy a handful of 8x8 blocks from the previous picture into this one, displaced by (dx, dy): the encoder's stale
 * motion vectors on a fast move. `pick` chooses the blocks (deterministic), only inside the moving region.
 */
export const macroblockDrift = (b: Buf, prev: Buf, x0: number, y0: number, w: number, h: number, dx: number, dy: number, pick: (bx: number, by: number) => boolean) => {
  for (let by = y0; by + 8 <= y0 + h; by += 8)
    for (let bx = x0; bx + 8 <= x0 + w; bx += 8) {
      if (!pick(bx, by)) continue;
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        const sx = clamp(bx + i - dx, x0, x0 + w - 1), sy = clamp(by + j - dy, y0, y0 + h - 1);
        b.c[(by + j) * b.w + bx + i] = prev.c[sy * prev.w + sx];
      }
    }
};

// ------------------------------------------------------------------ bezel size: the device's picture, small
/**
 * Area-average src[sx..sx+sw, sy..sy+sh] down into dst's rect (dx, dy, dw, dh), each destination pixel the linear
 * average of its source footprint, snapped to the palette. `gain` k>0 steps the result up k rungs (a lit screen).
 */
export const miniature = (src: Buf, sx: number, sy: number, sw: number, sh: number, dst: Buf, dx: number, dy: number, dw: number, dh: number) => {
  const tmp: number[] = [];
  for (let j = 0; j < dh; j++)
    for (let i = 0; i < dw; i++) {
      const x0 = sx + Math.floor((i * sw) / dw), x1 = sx + Math.max(Math.floor(((i + 1) * sw) / dw), Math.floor((i * sw) / dw) + 1);
      const y0 = sy + Math.floor((j * sh) / dh), y1 = sy + Math.max(Math.floor(((j + 1) * sh) / dh), Math.floor((j * sh) / dh) + 1);
      tmp.length = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) tmp.push(src.get(x, y));
      dst.set(dx + i, dy + j, averageSnap(tmp));
    }
};

// ------------------------------------------------------------------ P21 IRIS: the lens
/**
 * Barrel fisheye: for each destination pixel inside the circle (cx, cy, R), sample the source at the radius the lens
 * maps it from (r_src = r * (1 + k * (r/R)^2) normalised so the edge sees `fov` times the circle). Nearest sampling on
 * the native grid: straight lines bow in whole-pixel steps, which is what "bends the grid correctly" means here.
 * Returns nothing; writes only inside the circle.
 */
export const fisheye = (src: Buf, dst: Buf, cx: number, cy: number, R: number, o: {k?: number; scx?: number; scy?: number; zoom?: number} = {}) => {
  const k = o.k ?? 0.55, zoom = o.zoom ?? 1, scx = o.scx ?? cx, scy = o.scy ?? cy;
  for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++)
    for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++) {
      const ux = (x + 0.5 - cx) / R, uy = (y + 0.5 - cy) / R;
      const r2 = ux * ux + uy * uy;
      if (r2 > 1) continue;
      const s = (1 + k * r2) / zoom;
      const sx = Math.floor(scx + ux * s * R), sy = Math.floor(scy + uy * s * R);
      dst.set(x, y, src.get(clamp(sx, 0, src.w - 1), clamp(sy, 0, src.h - 1)));
    }
};

/**
 * The Orb's aperture seen from inside: n curved blades around (cx, cy). `open` 0 = shut (only the seams show) to 1
 * = fully retracted (radius >= rMax). Each blade is the region between two offset spirals, shaded by its own index so
 * the overlaps read; the aperture opening is the polygon the blade edges leave. Returns the aperture radius.
 */
export const irisBlades = (b: Buf, cx: number, cy: number, open: number, rMax: number, o: {n?: number; rot?: number; x0?: number; y0?: number; w?: number; h?: number} = {}) => {
  const n = o.n ?? 6, rot = o.rot ?? 0;
  const ap = open * rMax; // aperture "radius" (apothem of the n-gon)
  const X0 = o.x0 ?? 0, Y0 = o.y0 ?? 0, W = o.w ?? b.w, H = o.h ?? b.h;
  const tones = [PAL.G1, PAL.N3, PAL.G2, PAL.N4, PAL.G1, PAL.N3];
  for (let y = Y0; y < Y0 + H; y++)
    for (let x = X0; x < X0 + W; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const r = Math.hypot(dx, dy);
      let a = Math.atan2(dy, dx) - rot - open * 0.9;
      // polygon apothem test: inside the aperture if the distance along the nearest edge normal < ap
      const seg = (Math.PI * 2) / n;
      const aa = ((a % seg) + seg) % seg - seg / 2;
      const apo = r * Math.cos(aa);
      if (apo < ap) continue;
      // which blade: the blades are swept (spiral) so the index shifts with radius
      const sweep = a + (r - ap) / (rMax * 0.9);
      const idx = ((Math.floor(sweep / seg) % n) + n) % n;
      const edge = (((sweep / seg) % 1) + 1) % 1;
      let c = tones[idx];
      if (edge < 0.035) c = PAL.N0; // the blade's leading edge: a dark seam
      else if (edge < 0.07) c = PAL.G4; // its bevel catching the key
      else if (apo < ap + 2) c = PAL.G5; // the aperture lip
      else if (apo < ap + 3) c = PAL.N0;
      b.set(x, y, c);
    }
  return ap;
};

/** one-rung lift inside a diagonal band crossing a disc: the lens glass catching the key once (a specular sweep) */
export const specularSweep = (b: Buf, cx: number, cy: number, R: number, t: number, width = 10, k = 1) => {
  if (t < 0 || t > 1) return;
  const pos = -R * 1.3 + t * R * 2.6;
  for (let y = Math.floor(cy - R); y <= cy + R; y++)
    for (let x = Math.floor(cx - R); x <= cx + R; x++) {
      const ux = x + 0.5 - cx, uy = y + 0.5 - cy;
      if (ux * ux + uy * uy > R * R) continue;
      const d = (ux + uy * 0.6) - pos;
      if (Math.abs(d) < width / 2) b.set(x, y, stepAny(b.get(x, y), Math.abs(d) < width / 5 ? k + 1 : k));
    }
};

import {stepColor} from '../../../../shared/pixel/palette';
export const stepAny = (c: number, k: number) => stepColor(c, k);

/** the lightness of a master colour (handy for keys) */
export const L = (c: number) => lightness(c);
