// MR. MAS — style jump prototype 2 · J3 "THE SKY OPENS": the frame composer (fix pass). One pure function per clip
// frame, used by BOTH the Remotion composition (styleframes/jumps/proto2.frame.tsx) and the Node tools, so the two are
// pixel-identical.
//
//   1. the pixel frame at native 480 x 270 (plate + Orb + Mas), exactly as approved
//   2. the break, on the sky plane only (skyplane.ts): VARIANT 'tear' (C, ships), 'seam' (B) or 'glass' (A), the
//      last two kept as stills. Its pixel side (lips, lit crack lines, the scar, the Orb's rim) is whole pixels
//   3. the rail (UI: it never jumps)
//   4. presented 4x nearest-neighbour
//   5. SEAM / GLASS only: the cooling, a smooth, unquantized cool cast from the opening across the window, the wall
//      and the Orb, masked off Mas's figure and his glass. The TEAR drops it (a blind cold read never saw it, and a
//      soft cast over pixel surfaces is the filter look): its light is one whole rung on the Orb's rim (tear.ts)
//   6. the far side (deep.ts) at 1080 native inside the opening, whose matte is the native grid. GLASS: each shard sees
//      it through its own offset and gain, with fine 1080 shard edges between open shards
//
// The first build's fracture (crack.ts, sky.ts) is retired: it read as a price chart. The seam (seam.ts) is retired
// too: at phone size it sat on a tower's roof and read as a lit spire. See style-jumps §5.2.
import {DPLATE, DPLATE_LOOK} from '../../../shared/pixel/rooms/darkroom-plate';
import * as OM from '../../../shared/pixel/cast/orb-medium';
import {T, seamWidth, glassOpen} from './timing';
import {NW, NH, RH, drawRoom, drawRail} from './plate';
import {deepAt, deepStarsInto, deepGrain, toByte} from './deep';
import {seamMask, seamLips, seamScar, seamLookAt} from './seam';
import {glassMask, glassLines, glassScar, glassLookAt, cellAt, shardView} from './glass';
import {tearMask, tearLips, tearScar, tearLookAt, tearOrbRim} from './tear';

export const OUT_W = 1920, OUT_H = 1080, S = 4;
export const SW = 1920, SH = RH * S;

export type Variant = 'tear' | 'seam' | 'glass';
/** the build's choice (the Remotion composition renders this one) */
export let VARIANT: Variant = 'tear';
export const setVariant = (v: Variant) => { VARIANT = v; };

/** the Orb's look: the monitor with him, then (T.orb) one servo step to the break, with the house in-between frame */
const orbLook = (p: number, v: Variant): [number, number] => {
  const a = DPLATE_LOOK.grid;
  const [tx, ty] = v === 'tear' ? tearLookAt : v === 'seam' ? seamLookAt : glassLookAt;
  const b = OM.orbLook(DPLATE.orb[0], DPLATE.orb[1], tx, ty, 22);
  if (p < T.orb) return a;
  if (p === T.orb) return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return b;
};

/** his figure plus the Orb's disc (with its bob): what stands in front of the sky */
const occluders = (mas: Uint8Array, p: number) => {
  const o = mas.slice();
  const [ox, oy0] = DPLATE.orb, oy = oy0 + OM.orbBob(p), r = OM.ORB_MR + 1;
  for (let y = oy - r; y <= oy + r; y++) for (let x = ox - r; x <= ox + r; x++) if (Math.hypot(x + 0.5 - ox, y + 0.5 - oy) <= r) o[y * NW + x] = 255;
  return o;
};

// ------------------------------------------------------------------ the cooling (native field, then smooth at 1080)
const boxBlur = (a: Float32Array, w: number, h: number, r: number) => {
  const t = new Float32Array(a.length);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) { let acc = 0; for (let x = -r; x <= r; x++) acc += a[y * w + Math.max(0, Math.min(w - 1, x))]; for (let x = 0; x < w; x++) { t[y * w + x] = acc / (2 * r + 1); acc += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let acc = 0; for (let y = -r; y <= r; y++) acc += t[Math.max(0, Math.min(h - 1, y)) * w + x]; for (let y = 0; y < h; y++) { a[y * w + x] = acc / (2 * r + 1); acc += t[Math.min(h - 1, y + r + 1) * w + x] - t[Math.max(0, y - r) * w + x]; } }
  }
};
/**
 * The cooling (not a light: a cool cast). Everything the opening can see takes a smooth, unquantized cool grade, the
 * first continuous tone on the room's own surfaces; Mas's figure and his glass keep their exact pixel colours.
 *   near/broad: the field's two radii (native px) and gains; cool: the grade it pulls toward, at most `max`
 */
export const COOL = {rNear: 4, rBroad: 26, near: 1.2, broad: 14, max: 0.5, cool: {mul: [0.74, 0.9, 1.18], add: [1, 3, 10]}};
const coolField = (gap: Uint8Array, amt: number): Float32Array => {
  const src = new Float32Array(NW * RH);
  for (let i = 0; i < NW * RH; i++) if (gap[i]) src[i] = 1;
  const near = src.slice(), broad = src.slice();
  boxBlur(near, NW, RH, COOL.rNear);
  boxBlur(broad, NW, RH, COOL.rBroad);
  const L = new Float32Array(NW * RH);
  for (let i = 0; i < NW * RH; i++) L[i] = COOL.max * (1 - Math.exp(-(near[i] * COOL.near + broad[i] * COOL.broad))) * amt;
  return L;
};

// ------------------------------------------------------------------ compose
export interface Composed { rgba: Uint8ClampedArray; gapPx: number; /** native, 255 = the opening */ gap: Uint8Array }

export const compose = (p: number, target?: Uint8ClampedArray, variant: Variant = VARIANT): Composed => {
  const rgba = target ?? new Uint8ClampedArray(OUT_W * OUT_H * 4);
  const {fb, mas, glass} = drawRoom(p, orbLook(p, variant));
  const occ = occluders(mas, p);
  // ---- the break's pixel side
  let gap: Uint8Array;
  if (variant === 'tear') {
    gap = tearMask(p, occ);
    tearLips(fb, p, gap, occ);
    if (p >= T.scar) tearScar(fb, occ);
    const [ox, oy0] = DPLATE.orb;
    tearOrbRim(fb, p, ox, oy0 + OM.orbBob(p), OM.ORB_MR);
  } else if (variant === 'seam') {
    gap = seamMask(p, occ);
    seamLips(fb, p, gap, occ);
    if (p >= T.scar) seamScar(fb, occ);
  } else {
    gap = glassMask(p, occ);
    glassLines(fb, p, gap, occ);
    if (p >= T.scar) glassScar(fb, occ);
  }
  drawRail(fb);
  // ---- 4x nearest
  for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
    const v = fb.c[y * NW + x];
    const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
    for (let j = 0; j < S; j++) {
      let o = ((y * S + j) * OUT_W + x * S) * 4;
      for (let i = 0; i < S; i++, o += 4) { rgba[o] = r; rgba[o + 1] = g; rgba[o + 2] = b; rgba[o + 3] = 255; }
    }
  }
  let gapPx = 0, bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
  for (let y = 0; y < RH; y++) for (let x = 0; x < NW; x++) if (gap[y * NW + x]) { gapPx++; bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y); }
  if (!gapPx) return {rgba, gapPx, gap};
  // ---- the cooling (once it has opened)
  if (variant !== 'tear' && p >= T.open && p < T.scar) {
    const amt = variant === 'seam' ? Math.pow(Math.min(1, seamWidth(p) / 8), 0.85) : Math.min(1, gapPx / 900);
    const L = coolField(gap, amt);
    const [mr, mg, mb] = COOL.cool.mul, [ar, ag, ab] = COOL.cool.add;
    for (let Y = 0; Y < SH; Y++) {
      const ny = (Y + 0.5) / S - 0.5;
      const y0 = Math.max(0, Math.min(RH - 1, Math.floor(ny))), y1 = Math.min(RH - 1, y0 + 1), fy = Math.max(0, Math.min(1, ny - y0));
      const row = Y >> 2;
      for (let X = 0; X < SW; X++) {
        const col = X >> 2, ni = row * NW + col;
        if (mas[ni] || glass[ni] || gap[ni]) continue;
        const nx = (X + 0.5) / S - 0.5;
        const x0 = Math.max(0, Math.min(NW - 1, Math.floor(nx))), x1 = Math.min(NW - 1, x0 + 1), fx = Math.max(0, Math.min(1, nx - x0));
        const k = (L[y0 * NW + x0] * (1 - fx) + L[y0 * NW + x1] * fx) * (1 - fy) + (L[y1 * NW + x0] * (1 - fx) + L[y1 * NW + x1] * fx) * fy;
        if (k < 0.002) continue;
        const o = (Y * OUT_W + X) * 4;
        rgba[o] = rgba[o] + (rgba[o] * mr + ar - rgba[o]) * k;
        rgba[o + 1] = rgba[o + 1] + (rgba[o + 1] * mg + ag - rgba[o + 1]) * k;
        rgba[o + 2] = rgba[o + 2] + (rgba[o + 2] * mb + ab - rgba[o + 2]) * k;
      }
    }
  }
  // ---- the far side, inside the opening (the matte is the native grid)
  const M = 16; // margin for the shards' offsets
  const BX = bx0 * S - M, BY = by0 * S - M, BW = (bx1 - bx0 + 1) * S + 2 * M, BH = (by1 - by0 + 1) * S + 2 * M;
  const stars = new Float32Array(BW * BH * 3);
  deepStarsInto(stars, BX, BY, BW, BH, p);
  const px = new Float32Array(3);
  // GLASS: the shard each 1080 px sees through (-1 = not open), for the edges
  const cell = variant === 'glass' ? new Int16Array(BW * BH).fill(-1) : null;
  const nOpen = glassOpen(p);
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
    if (!gap[y * NW + x]) continue;
    const own = variant === 'glass' ? cellAt(x + 0.5, y + 0.5) : null;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const X = x * S + i, Y = y * S + j;
      let dx = 0, dy = 0, gain = 1;
      if (own && cell) {
        // inside the open zone the shards meet at 1080; at its outer edge the native pixel's own shard holds
        let c = cellAt((X + 0.5) / S, (Y + 0.5) / S);
        if (c[1] > nOpen) c = own;
        const v = shardView(c[0], c[1]);
        dx = v.dx; dy = v.dy; gain = v.gain;
        cell[(Y - BY) * BW + (X - BX)] = c[0] * 8 + c[1];
      }
      const sx = X - dx, sy = Y - dy;
      deepAt(sx + 0.5, sy + 0.5, px, 0);
      const so = ((Math.max(BY, Math.min(BY + BH - 1, sy)) - BY) * BW + (Math.max(BX, Math.min(BX + BW - 1, sx)) - BX)) * 3;
      const gr = deepGrain(X, Y, p);
      const o = (Y * OUT_W + X) * 4;
      rgba[o] = toByte((px[0] + stars[so]) * gain) + gr;
      rgba[o + 1] = toByte((px[1] + stars[so + 1]) * gain) + gr;
      rgba[o + 2] = toByte((px[2] + stars[so + 2]) * gain) + gr;
    }
  }
  // GLASS: the shard edges, fine at 1080: a lit edge on one side, its shadow on the other
  if (cell) {
    for (let Y = BY; Y < BY + BH - 1; Y++) for (let X = BX; X < BX + BW - 1; X++) {
      const c = cell[(Y - BY) * BW + (X - BX)];
      if (c < 0) continue;
      const cr = cell[(Y - BY) * BW + (X - BX) + 1], cd = cell[(Y - BY + 1) * BW + (X - BX)];
      if ((cr >= 0 && cr !== c) || (cd >= 0 && cd !== c)) {
        const o = (Y * OUT_W + X) * 4;
        rgba[o] = Math.min(255, rgba[o] * 0.4 + 70); rgba[o + 1] = Math.min(255, rgba[o + 1] * 0.4 + 80); rgba[o + 2] = Math.min(255, rgba[o + 2] * 0.4 + 104);
        const q = cr >= 0 && cr !== c ? o + 4 : o + OUT_W * 4;
        rgba[q] *= 0.45; rgba[q + 1] *= 0.45; rgba[q + 2] *= 0.5;
      }
    }
  }
  return {rgba, gapPx, gap};
};
