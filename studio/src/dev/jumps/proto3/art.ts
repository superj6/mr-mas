// MR. MAS — style jump prototype C · J6 · THE RING (Ep12 Button #17), the PIXEL side. Prototype builder 3.
// Brief: show/bible/style-jumps.md §5.3. Owned files: src/dev/jumps/proto3/**, src/styleframes/jumps/proto3.frame.tsx.
//
// [ECU], straight down into his glass on the dark-room desk, under the monitor's cyan key (the monitor is off frame,
// upper left). One scene description, two media:
//   * pixel (this file): 480 x 270 native, master palette only, dither only in falloff, 4x nearest-neighbour
//   * continuous (ring.ts): the same water re-rendered at 1920 x 1080 native from the SAME level/geometry functions,
//     so the jump reads as the same moment in another medium, never as a filter.
// Everything here is pure (no DOM): the Remotion component and the Node preview both call it.
import {Buf, bayer, hash, clamp, rect} from '../../../shared/pixel/px';
import {PAL, stepColor, toLinear} from '../../../shared/pixel/palette';
import {MatBuf, MATS, resolve} from '../../../shared/pixel/light';
import {ROOM_W, ROOM_H, vignette} from '../../../shared/pixel/rooms/kit-b';

// ------------------------------------------------------------------ geometry (native px; the glass centre is a pixel corner)
// Polish pass (critic): the glass read as a camera lens (a thick glowing rim around opaque dark water) and filled the
// frame. Now it is a tumbler on the desk: a 100 px water disc with desk around it for context, a 2 px rim with ONE
// highlight arc on the monitor side, and clear water: the desk's grain and the glass's thick base seen through it,
// refracted and a touch magnified. The ring then shows itself by what it bends, not by its own highlight.
export const G = {
  cx: 240,
  cy: 100,
  /** the rim's outer edge (2 px of rim top), its inner edge, and the water (inside the meniscus row) */
  Ro: 55,
  Ri: 53,
  Rw: 50,
  /** the glass base's edge seen through the water, as a fraction of Rw */
  base: 0.8,
};
/** unit vector from the glass toward the monitor (the key), in frame coords (x right, y down) */
export const KEY: [number, number] = (() => {
  const x = -0.74, y = -0.67, l = Math.hypot(x, y);
  return [x / l, y / l] as [number, number];
})();
/** the glass's shadow is thrown away from the key: its far disc centre, relative to the glass centre */
const SHADOW: [number, number] = [36, 31];
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// ------------------------------------------------------------------ the desk, as ONE function for both media
// The pixel plate resolves it on the integer lattice (light.ts `resolve`, material 'wood'); the continuous render
// reads the same levels between lattice points and interpolates the same ramps in linear light.
export const grainV = (x: number, y: number) => y + 1.4 * Math.sin(x / 83 + y / 41) + 0.7 * Math.sin(x / 23 + y / 9);
const KNOTS: Array<[number, number, number]> = [[96, 168, 12], [418, 40, 9]];
/** the wood's material level at lattice coords (x, y) (continuous: flat-sawn bands, knots, the late-wood lines) */
export const woodLvl = (x: number, y: number) => {
  let v = grainV(x, y);
  for (const [kx, ky, kr] of KNOTS) {
    const d = Math.hypot((x - kx) / (kr * 2.6), (y - ky) / kr);
    if (d < 1.8) v += (1.8 - d) * 5.5 * Math.sign(y - ky || 1);
  }
  const band = Math.floor(v / 5);
  const inB = v - band * 5;
  let lvl = (hash(band, 3, 11) - 0.5) * 0.6 + 0.4;
  if (inB < 1 && hash(band, 5, 13) < 0.6) lvl -= 0.9;
  return lvl;
};
const AMB = (x: number, y: number) => 1.7 - Math.max(0, (y - 150) / 80) - Math.max(0, (x - 380) / 160);
/** the monitor's pool across the desk, from beyond the top-left corner */
const CYAN = (x: number, y: number) => clamp(1.06 - Math.hypot((x + 70) / 620, (y + 50) / 330), 0, 1) * 0.95;

// ------------------------------------------------------------------ what you see THROUGH the water
/** The water magnifies a touch; the glass's thick base magnifies more (a lens), so the grain jumps at its edge. */
export const MAG_WATER = 1.05, MAG_BASE = 1.14;
/** One step of light lost to the water and the glass (both media darken the view by the same amount). */
const DIM = 0.6;
/**
 * The view through the water at native point (x, y) (continuous coords, pixel centres at +0.5) as the two light
 * levels of the wood ramps [night, cyan]: the desk under the glass (no shadow: the key comes through the glass),
 * magnified, one step down, with the base's edge (a lit arc on the far side, a dark line on the near side).
 */
export const waterLevels = (x: number, y: number): [number, number] => {
  const dx = x - G.cx, dy = y - G.cy, rr = Math.hypot(dx, dy), r = rr / G.Rw;
  const m = r < G.base ? MAG_BASE : MAG_WATER;
  const ix = G.cx + dx / m - 0.5, iy = G.cy + dy / m - 0.5; // back on the plate's integer lattice
  const lvl = woodLvl(ix, iy) - DIM;
  let nL = AMB(ix, iy) + lvl, cL = CYAN(ix, iy) * 7 + lvl;
  const far = -(dx * KEY[0] + dy * KEY[1]) / Math.max(1e-6, rr); // +1 on the side away from the key
  // the monitor's light through the water: it lands on the far half of the bottom, and the glass focuses a soft
  // crescent of it inside the far wall (so a ring crossing the lower half has lit grain to bend)
  const farR = far * r;
  const cr = Math.hypot((dx / G.Rw) + 0.2 * KEY[0], (dy / G.Rw) + 0.2 * KEY[1]);
  const cfar = -(((dx / G.Rw) + 0.2 * KEY[0]) * KEY[0] + ((dy / G.Rw) + 0.2 * KEY[1]) * KEY[1]) / Math.max(1e-6, cr);
  cL += 1.3 * smooth(-0.3, 0.9, farR) + 1.1 * Math.exp(-(((cr - 0.64) / 0.13) ** 2)) * smooth(0.35, 0.95, cfar);
  // the base's edge: a lit arc on the far side, a dark line on the near side
  const e = Math.exp(-(((r - G.base) * G.Rw) ** 2) / 0.8);
  const edge = e * (1.5 * smooth(0.1, 0.85, far) - 0.9 * smooth(0.1, 0.85, -far));
  nL += edge; cL += edge;
  return [nL, cL];
};
/** quantize the two levels as `resolve` does (dominant light wins, a dithered bias at hue borders) */
export const levelsToPixel = (nL: number, cL: number, x: number, y: number) => {
  const bz = bayer(x, y) - 0.5;
  let r = MATS.wood.night, v = nL;
  if (cL + bz * 0.8 > v) { r = MATS.wood.cyan; v = cL; }
  return r[clamp(Math.floor(v + bz * 0.4 + 0.5), 0, 7)];
};
const WOOD_N = MATS.wood.night.map(toLinear), WOOD_C = MATS.wood.cyan.map(toLinear);
const rampLin = (R: number[][], v: number, out: number[]) => {
  const t = clamp(v, 0, R.length - 1), i = Math.min(R.length - 2, Math.floor(t)), f = t - i;
  for (let c = 0; c < 3; c++) out[c] = R[i][c] * (1 - f) + R[i + 1][c] * f;
};
const _a = [0, 0, 0], _b = [0, 0, 0];
/** the same two levels, continuous: both ramps interpolated in linear light, blended across the hue border */
export const levelsToLin = (nL: number, cL: number, out: number[]) => {
  rampLin(WOOD_N, nL, _a);
  rampLin(WOOD_C, cL, _b);
  const w = smooth(-0.4, 0.4, cL - nL);
  for (let c = 0; c < 3; c++) out[c] = _a[c] * (1 - w) + _b[c] * w;
};

// ------------------------------------------------------------------ the monitor's reflection on the water
// The screen stands off frame upper left, facing him. Seen straight down, its image lies in the upper-left of the
// disc, its top edge toward the centre (so its type is flipped top-to-bottom), wider at the outer edge, cut by the
// rim. One line of type shape (`define "win."`, flipped, not meant to be read) and the cursor on the line after it.
export const REFL = {
  /** quad corners relative to the glass centre: outer-left, outer-right, inner-right, inner-left (the outer edge lies
   *  beyond the rim, so the rim cuts it: it reads as a reflection, never as a label) */
  quad: [[-50, -50], [22, -54], [16, -10], [-40, -7]] as Array<[number, number]>,
  /** the type line (the screen's reply), flipped: its first mark's top-left, relative */
  text: {x: -33, y: -21},
  /** the cursor, on the screen's next line = above the type here (flipped): a 3 x 5 block */
  cursor: {x: -33, y: -28, w: 3, h: 5},
};
/** signed distance-ish coverage of the reflection quad: > 0 inside (native px from the nearest edge) */
export const quadInside = (x: number, y: number) => {
  const q = REFL.quad;
  let m = Infinity;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = q[i], [bx, by] = q[(i + 1) % 4];
    const ex = bx - ax, ey = by - ay, l = Math.hypot(ex, ey);
    // inward normal for a clockwise quad (screen coords, y down): (-ey, ex)
    const d = ((x - G.cx - ax) * -ey + (y - G.cy - ay) * ex) / l;
    m = Math.min(m, d);
  }
  return m;
};
/** Brightness of the screen in the reflection, 0..1 (brighter toward its middle and its lower edge = the screen top) */
export const screenGlow = (x: number, y: number) => {
  const u = x - G.cx + 12, v = y - G.cy + 30;
  return clamp(1 - Math.hypot(u / 34, v / 18), 0, 1);
};
// The type as a mask: TYPE SHAPE, not letters (the brief: "not meant to be read"). `define "win."` as lowercase
// silhouettes: x-height 2 px, ascenders 3 px, the quotes and the full stop as single marks; then flipped top-to-bottom
// (the reflection), so the ascenders hang down. Built once.
const SHAPE: Record<string, string[]> = {
  // columns, left to right: 'a' = ascender (rows 0-4), 'x' = x-height stem (rows 2-4), 'o' = bowl side (rows 2, 4),
  // 'm' = arch top (row 2), 't' = top mark (rows 0-1), 'b' = bottom mark (row 4), 'c' = crossbar (row 2), '.' = gap
  d: ['x', 'o', 'a'], e: ['x', 'o', 'm'], f: ['c', 'a', 'm'], i: ['x'], n: ['x', 'm', 'x'], w: ['x', 'b', 'x', 'b', 'x'],
  '"': ['t', '.', 't'], '.': ['b'],
};
export const TYPE = (() => {
  const str = 'define "win."';
  const cols: string[] = [];
  for (const ch of str) {
    if (ch === ' ') { cols.push('.', '.'); continue; }
    cols.push(...(SHAPE[ch] ?? ['x']), '.');
  }
  const w = cols.length, h = 5;
  const m = new Uint8Array(w * h);
  const on = (i: number, j: number) => { m[(h - 1 - j) * w + i] = 1; }; // flipped top-to-bottom
  cols.forEach((c, i) => {
    if (c === 'a') for (let j = 0; j < 5; j++) on(i, j);
    else if (c === 'x') for (let j = 2; j < 5; j++) on(i, j);
    else if (c === 'o') { on(i, 2); on(i, 4); }
    else if (c === 'm') on(i, 2);
    else if (c === 'c') on(i, 2);
    else if (c === 't') { on(i, 0); on(i, 1); }
    else if (c === 'b') on(i, 4);
  });
  return {w, h, m, x: REFL.text.x, y: REFL.text.y};
})();
/** is the type on at native pixel (x, y)? */
export const typeAt = (x: number, y: number) => {
  const i = x - (G.cx + TYPE.x), j = y - (G.cy + TYPE.y);
  return i >= 0 && j >= 0 && i < TYPE.w && j < TYPE.h && TYPE.m[j * TYPE.w + i] === 1;
};
/** The glass's lit far wall reflected in the water just inside the meniscus, 0..1 (strongest on the far side). */
export const wallGlow = (x: number, y: number) => {
  const px = x - G.cx, py = y - G.cy, d = Math.hypot(px, py);
  const far = -(px * KEY[0] + py * KEY[1]) / Math.max(1e-6, d);
  return Math.exp(-(G.Rw - d) / 2.2) * smooth(-0.1, 0.8, far) * (d < G.Rw + 0.5 ? 1 : 0);
};
/** the cursor blinks on the beat (15 frames on, 15 off) and never stops: the monitor keeps time through the jump */
export const cursorOn = (f: number) => Math.floor(f / 15) % 2 === 0;
export const cursorAt = (x: number, y: number) => {
  const c = REFL.cursor;
  const i = x - (G.cx + c.x), j = y - (G.cy + c.y);
  return i >= 0 && j >= 0 && i < c.w && j < c.h;
};

// ------------------------------------------------------------------ the desk (top-down), same grain as rooms-b's desk close
const inShadow = (x: number, y: number) => {
  // a capsule from the glass's foot to the far disc: the glass throws it away from the key
  const px = x + 0.5 - G.cx, py = y + 0.5 - G.cy;
  const [sx, sy] = SHADOW;
  const t = clamp((px * sx + py * sy) / (sx * sx + sy * sy), 0, 1);
  const d = Math.hypot(px - sx * t, py - sy * t);
  return G.Ro - 1.5 - d; // > 0 inside
};

let PLATE: Buf | null = null;
/** The desk, the glass's shadow, the rim and inner wall, the meniscus row; the rail band below (empty). */
export const plate = (): Buf => {
  if (PLATE) return PLATE;
  const b = new Buf(480, 270, PAL.N0);
  const mb = new MatBuf(ROOM_W, ROOM_H);
  // flat-sawn grain, long and horizontal (rooms-b drawDarkDesk's grain function, so the desk is one desk)
  for (let y = 0; y < ROOM_H; y++)
    for (let x = 0; x < ROOM_W; x++) {
      mb.mat('wood', woodLvl(x, y))(x, y);
      // the glass's shadow blocks the key
      const s = inShadow(x, y);
      if (s > 0 || s + (bayer(x, y) - 0.5) * 1.6 > 0) mb.gain(0.12, 1)(x, y);
    }
  resolve(mb, {amb: AMB, cyan: CYAN, warm: () => 0, dither: 0.4}, b, 0);
  // (no caustic arc in the shadow any more: at the old size it read as a swoosh logo)
  vignette(b, 1, 0.64, 0.7, ROOM_H, ROOM_H);
  // the glass, straight down: the rim's top (2 px, dim glass, ONE highlight arc toward the monitor), the inner wall
  // (2 px, dark on the near side, lit on the far side), the meniscus row (quiet: never a second bright ring)
  for (let y = G.cy - G.Ro - 2; y < G.cy + G.Ro + 2; y++)
    for (let x = G.cx - G.Ro - 2; x < G.cx + G.Ro + 2; x++) {
      const px = x + 0.5 - G.cx, py = y + 0.5 - G.cy;
      const d = Math.hypot(px, py);
      if (d >= G.Ro || d < G.Rw) continue;
      const facing = (px * KEY[0] + py * KEY[1]) / d; // +1 toward the key
      const bz = (bayer(x, y) - 0.5) * 0.25;
      let c: number;
      if (d >= G.Ri) {
        const outer = d - G.Ri >= 1;
        if (facing + bz > 0.8) c = outer ? PAL.C9 : PAL.C7;
        else if (facing + bz > 0.55) c = outer ? PAL.C6 : PAL.C4;
        else if (-facing + bz > 0.5) c = outer ? PAL.C2 : PAL.C3; // the far side: light coming through the glass
        else c = outer ? PAL.C1 : PAL.C2;
      } else if (d >= G.Rw + 1) {
        const t = -facing * 0.5 + 0.5 + bz;
        c = t > 0.8 ? PAL.C3 : t > 0.55 ? PAL.C2 : t > 0.3 ? PAL.C1 : PAL.C0;
      } else {
        c = -facing > 0.35 ? PAL.C4 : -facing > -0.35 ? PAL.C2 : PAL.C1;
      }
      b.set(x, y, c);
    }
  // the rail band: pixel UI, never part of a jump (empty here: Ep12's rail is the rail builder's)
  rect(0, ROOM_H, 480, 270 - ROOM_H, b.ink(PAL.N0));
  rect(0, ROOM_H, 480, 1, b.ink(PAL.N2));
  PLATE = b;
  return b;
};

/** native pixels that belong to the water (inside the meniscus row) */
export const inWater = (x: number, y: number) => Math.hypot(x + 0.5 - G.cx, y + 0.5 - G.cy) < G.Rw;

/** The water, pixel: the desk seen through it (waterLevels, quantized as the plate is), the lit far wall's band by the
 *  meniscus, then the monitor's reflection on top. */
export const pixelWaterAt = (x: number, y: number, f: number) => {
  const X = x + 0.5, Y = y + 0.5;
  const qi = quadInside(X, Y);
  if (qi > 0) {
    // a dark screen with bright type: the reflection is dim teal, the reply and the cursor are its brightest marks
    if (cursorOn(f) && cursorAt(x, y)) return PAL.C7;
    if (typeAt(x, y)) return PAL.C7;
    if (qi < 1) return PAL.C2; // the screen's edge
    const g = screenGlow(X, Y) + (bayer(x, y) - 0.5) * 0.2;
    return g > 0.62 ? PAL.C4 : g > 0.2 ? PAL.C3 : PAL.C2;
  }
  const w = wallGlow(X, Y);
  if (w + (bayer(x, y) - 0.5) * 0.3 > 0.62) return w > 0.8 ? PAL.C4 : PAL.C3;
  const [nL, cL] = waterLevels(X, Y);
  return levelsToPixel(nL, cL, x, y);
};

/** The whole pixel frame at frame f (the water is flat: this is also the snap-back frame). */
export const pixelFrame = (f: number): Buf => {
  const b = plate().clone();
  for (let y = G.cy - G.Rw - 1; y <= G.cy + G.Rw; y++)
    for (let x = G.cx - G.Rw - 1; x <= G.cx + G.Rw; x++) if (inWater(x, y)) b.set(x, y, pixelWaterAt(x, y, f));
  return b;
};
void stepColor;
