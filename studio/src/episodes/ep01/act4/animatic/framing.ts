// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v3: the framing kit (owned by THE EDITOR).
// The v3 shot templates (bible pov-and-framing §4.7, framing-v3.md §2), built on the helpers the framing designer
// prototyped in studio/src/dev/framing-v3/templates.ts (copied here, not imported: that file is a dev tool). Every one
// works on EXISTING art; nothing is scaled except a screen's own pixels (the 2x macro), and every move is whole-pixel:
//   soft / softMask     the rack-focus and fallaway layer: a region steps down k rungs along its own ramps (hard steps)
//   bust                the frameless close-up: a portrait composed straight into the frame, the torso extended to the
//                       frame's edge and falling off to shadow in hard bands (never a dither on a figure)
//   vignette            negative fill behind a bust (background only, so a dither is allowed there)
//   shoulder            the OTS foreground: the listener's portrait as a silhouette with a 1 px rim on the key side
//   mcu                 [MCU] = the room (held, soft 2) + vignette + the bust, left or right third, eyes on the upper third
//   macro2x             the screen macro: an integer 2x nearest crop of a screen's own pixels
//   whipSmear           the whip streak (row runs + highlight smear) for the 2-frame whip out / in
//   rackStep            the rack's 3 held steps (2 f each)
//   imgOf               any draw-into-a-buffer portrait as an Img (for the ones that only have a draw* entry)
import {Buf, rect, clamp, bayer, hash} from '../../../../shared/pixel/px';
import {PAL, stepColor, lum} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Img} from '../../../../shared/pixel/figure';
import {silhouette, flipImg} from '../../../../shared/pixel/sprite';
import {RH} from './lay';

export const W = 480;

// ------------------------------------------------------------------ soft focus / fallaway
/** step the room area down k rungs, skipping pixels where keep[] is set (keep is 480 x 270) */
export const soft = (b: Buf, k: number, keep?: Uint8Array) => {
  if (k <= 0) return;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { if (keep && keep[y * W + x]) continue; b.c[y * W + x] = stepColor(b.c[y * W + x], -k); }
};
/** step ONLY the masked pixels down k rungs */
export const softMask = (b: Buf, k: number, mask: Uint8Array) => {
  if (k <= 0) return;
  for (let i = 0; i < W * RH; i++) if (mask[i]) b.c[i] = stepColor(b.c[i], -k);
};
/** a rectangle kept sharp (a must-read record item: meters, signs) */
export const keepRect = (keep: Uint8Array, x: number, y: number, w: number, h: number) => {
  for (let j = Math.max(0, y); j < Math.min(RH, y + h); j++) for (let i = Math.max(0, x); i < Math.min(W, x + w); i++) keep[j * W + i] = 1;
};

// ------------------------------------------------------------------ the frameless bust
const BUSTS = new WeakMap<Img, Map<string, Img>>();
/** a portrait composed straight into the frame: the bottom row repeats down (the torso continues) and the shoulders
 *  fall off to shadow in hard bands toward the old crop lines. Cached per (img, extend). */
export const bust = (img: Img, extend = 48, side = 34): Img => {
  let m = BUSTS.get(img);
  if (!m) { m = new Map(); BUSTS.set(img, m); }
  const key = `${extend}:${side}`;
  const hit = m.get(key);
  if (hit) return hit;
  const Wd = img.w, H = img.h + extend, c = new Int32Array(Wd * H).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < Wd; x++) {
    const sy = Math.min(y, img.h - 1);
    let v = img.c[sy * Wd + x];
    if (v < 0) continue;
    if (y >= 88) {
      const sd = side + (y >= img.h ? Math.round((y - img.h) * 0.7) : 0);
      const dx = Math.min(x, Wd - 1 - x);
      const kSide = dx < sd / 4 ? 6 : dx < sd / 2 ? 3 : dx < (3 * sd) / 4 ? 2 : dx < sd ? 1 : 0;
      const kBot = y >= img.h + 30 ? 5 : y >= img.h + 18 ? 3 : y >= img.h + 6 ? 2 : y >= img.h - 12 ? 1 : 0;
      const k = Math.max(kSide * (y >= 96 ? 1 : 0), kBot);
      if (k) v = stepColor(v, -k);
    }
    c[y * Wd + x] = v;
  }
  const out = {w: Wd, h: H, c};
  m.set(key, out);
  return out;
};
/** negative fill: the room behind a bust steps down around the body's lower half (background only) */
export const vignette = (b: Buf, cx: number, k = 2) => {
  for (let y = 100; y < RH; y++) for (let x = 0; x < W; x++) {
    const d = Math.abs(x - cx) / 140 - (y - 100) / 160;
    if (d < 0.9 && bayer(x, y) < (0.9 - d) * 1.4) b.c[y * W + x] = stepColor(b.c[y * W + x], -k);
  }
};
/** the over-the-shoulder foreground: a silhouette one rung off black, a 1 px rim on the key side (silhouettes may flip) */
export const shoulder = (img: Img, extend: number, rim: number, rimSide: -1 | 1, flip = false): Img => {
  const src = flip ? flipImg(img) : img;
  const bs = bust(src, extend, 0);
  const sil = silhouette(bs, PAL.N0);
  const out = {w: sil.w, h: sil.h, c: new Int32Array(sil.c)};
  for (let y = 0; y < sil.h; y++) for (let x = 0; x < sil.w; x++) {
    if (sil.c[y * sil.w + x] < 0) continue;
    const nx = x + rimSide;
    if (nx < 0 || nx >= sil.w || sil.c[y * sil.w + nx] < 0) out.c[y * sil.w + x] = y < 70 ? rim : stepColor(rim, -2);
  }
  return out;
};

// ------------------------------------------------------------------ [MCU]: room (soft) + negative fill + the bust
export interface McuOpts {
  /** 'L' = Mas's left third (bust x ~100); 'R' = the right third (x ~262) */
  third: 'L' | 'R';
  /** how far the room steps down behind the face (2 = the default soft) */
  softK?: number;
  /** the portrait top (eyes on the upper third): 20-26 */
  y?: number;
  dx?: number;
  extend?: number;
  /** the face itself steps down k (a rack pulled off it, or a fallaway that reaches it); 0 = sharp */
  faceK?: number;
  keep?: Uint8Array;
  vignetteK?: number;
  flip?: boolean;
}
export const MCU_X = {L: 100, R: 262};
/** the bust's pixels are written into `mask` (480 x 270) when given (for a rack between it and the room) */
export const drawBust = (b: Buf, img: Img, o: McuOpts, mask?: Uint8Array) => {
  const src = o.flip ? flipImg(img) : img;
  const bs = bust(src, o.extend ?? 48);
  const x = MCU_X[o.third] + (o.dx ?? 0), y = o.y ?? 22;
  const k = o.faceK ?? 0;
  for (let j = 0; j < bs.h; j++) {
    const Y = y + j;
    if (Y < 0 || Y >= RH) continue;
    for (let i = 0; i < bs.w; i++) {
      const v = bs.c[j * bs.w + i];
      if (v < 0) continue;
      const X = x + i;
      if (X < 0 || X >= W) continue;
      b.c[Y * W + X] = k ? stepColor(v, -k) : v;
      if (mask) mask[Y * W + X] = 1;
    }
  }
};
/** the room layer for an MCU: drawn once per key into the held cache by the caller; here the soft + negative fill */
export const mcuRoom = (b: Buf, o: McuOpts) => {
  soft(b, o.softK ?? 2, o.keep);
  vignette(b, MCU_X[o.third] + 56, o.vignetteK ?? 2);
};

// ------------------------------------------------------------------ the screen macro (integer 2x of a screen's pixels)
/** dst room area = 2x nearest of src around (cx, cy), clamped so the crop stays inside src's room area */
export const macro2x = (dst: Buf, src: Buf, cx: number, cy: number) => {
  const x0 = clamp(Math.round(cx - W / 4), 0, W - W / 2), y0 = clamp(Math.round(cy - RH / 4), 0, RH - Math.ceil(RH / 2));
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) dst.c[y * W + x] = src.c[(y0 + (y >> 1)) * src.w + x0 + (x >> 1)];
};

// ------------------------------------------------------------------ the whip (2 frames out, 2 in)
/** the whip streak on the room area: rows held in runs + highlights smeared back along the move */
export const whipSmear = (fb: Buf, dx: number) => {
  const run = clamp(Math.round(Math.abs(dx) * 0.12), 2, 18);
  const src = fb.c.slice(0, W * RH);
  for (let y = 0; y < RH; y++) {
    const off = Math.floor(hash(0, y, 7) * run);
    for (let x = 0; x < W; x++) { const sx = clamp(Math.floor((x + off) / run) * run - off, 0, W - 1); fb.c[y * W + x] = src[y * W + sx]; }
  }
  const s2 = fb.c.slice(0, W * RH);
  const dir = dx < 0 ? -1 : 1, n0 = clamp(Math.round(Math.abs(dx) * 0.45), 0, 26);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const c = s2[y * W + x];
    if (lum(c) < 0.5) continue;
    const n = n0 - ((bayer(x, y) * 5) | 0);
    for (let q = 1; q <= n; q++) { const xx = x - dir * q; if (xx < 0 || xx >= W) break; const col = stepColor(c, -Math.floor(q / 6)); if (lum(col) > lum(fb.c[y * W + xx])) fb.c[y * W + xx] = col; }
  }
};
/** the whip frame: shot A leaving by dxA, shot B arriving from dxB (whole pixels), then the streak */
export const whipFrame = (out: Buf, a: Buf, b: Buf, dxA: number, dxB: number, dir: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const sa = x - dxA, sb = x - dxB;
    let c = PAL.N0;
    if (sb >= 0 && sb < W) c = b.c[y * W + sb];
    else if (sa >= 0 && sa < W) c = a.c[y * W + sa];
    out.c[y * W + x] = c;
  }
  whipSmear(out, dir * 240);
};

// ------------------------------------------------------------------ moves
/** the rack: before k0 = step 0; k0..k0+5 = three held steps of 2 f; after = step 3 */
export const rackStep = (k: number, k0: number) => (k < k0 ? 0 : k >= k0 + 6 ? 3 : 1 + Math.floor((k - k0) / 2));
/** [A, B] soft rungs per rack step: A (the first subject) goes soft, B (the second) comes sharp */
export const RACK: Array<[number, number]> = [[0, 2], [1, 1], [2, 1], [2, 0]];
/** the drift: 1 px per `per` f, <= max px */
export const drift = (k: number, per = 8, max = 16) => Math.min(max, Math.floor(k / per));
/** shift the room area horizontally by whole pixels (edge pixels repeat) */
export const shiftRoom = (b: Buf, dx: number, dy = 0) => {
  if (!dx && !dy) return;
  const src = b.c.slice(0, W * RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const sx = clamp(x - dx, 0, W - 1), sy = clamp(y - dy, 0, RH - 1);
    b.c[y * W + x] = src[sy * W + sx];
  }
};

// ------------------------------------------------------------------ helpers
/** paint a portrait that only has a draw*(b, x, y, state) entry into an Img (transparent where `key` stays) */
export const imgOf = (w: number, h: number, paint: (b: Buf) => void, key = 0x1000001): Img => {
  const t = new Buf(w, h, key);
  paint(t);
  const c = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) c[i] = t.c[i] === key ? -1 : t.c[i];
  return {w, h, c};
};
/** a hard circular spotlight on black (Rima's world): the pool one ramp step up, the edge a clean ordered seam */
export const spotlight = (b: Buf, cx: number, cy: number, r: number) => {
  rect(0, 0, W, RH, b.ink(PAL.N0));
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot((x - cx) / r, (y - cy) / (r * 1.35));
    if (d < 0.8) b.c[y * W + x] = PAL.N2; else if (d < 1) b.c[y * W + x] = bayer(x, y) < (1 - d) * 5 ? PAL.N2 : PAL.N1;
    else if (d < 1.25 && bayer(x, y) < (1.25 - d) * 2) b.c[y * W + x] = PAL.N1;
  }
};
/** a doorway in front of a frameless figure (the jamb and the leaf as full-height foreground shapes) */
export const doorFrame = (b: Buf, x: number, w: number, o: {leaf?: 'left' | 'right'; leafW?: number; light?: number} = {}) => {
  const jamb = PAL.D2, edge = PAL.D4, leaf = PAL.N1;
  if (o.leaf === 'left') { const lw = o.leafW ?? x; rect(x - lw, 0, lw, RH, b.ink(leaf)); rect(x - lw, 0, 2, RH, b.ink(PAL.D1)); rect(x - 2, 0, 2, RH, b.ink(PAL.N0)); }
  rect(x, 0, 8, RH, b.ink(jamb)); rect(x + 7, 0, 1, RH, b.ink(edge));
  rect(x + w - 8, 0, 8, RH, b.ink(jamb)); rect(x + w - 8, 0, 1, RH, b.ink(edge));
  rect(x, 0, w, 6, b.ink(jamb)); rect(x, 6, w, 1, b.ink(edge));
  if (o.leaf === 'right') { const lw = o.leafW ?? W - x - w; rect(x + w, 0, lw, RH, b.ink(leaf)); rect(x + w, 0, 2, RH, b.ink(PAL.N0)); rect(x + w + lw - 2, 0, 2, RH, b.ink(PAL.D1)); }
  if (o.light !== undefined) for (let y = 7; y < RH; y++) b.set(x + 8, y, o.light);
};
/** a show plate riding a shot (the v3 replacement for the RIMA / TTEMME cards): name · line, lower third, typed on */
export const platePx = (b: Buf, x: number, y: number, name: string, line: string, k: number, accent: number,
  pt: (b: Buf, s: string, x: number, y: number, c: number, o?: {shadow?: number}) => void, pw: (s: string) => number) => {
  if (k < 0) return;
  const w = Math.max(pw(name), pw(line)) + 16;
  const open = Math.min(1, (k + 1) / 3);
  const hh = Math.max(2, Math.round(26 * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0));
  rect(x, y, w, hh, b.ink(PAL.N1));
  rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
  pt(b, line.slice(0, Math.max(0, (k - 5) * 3)), x + 8, y + 15, PAL.P1);
};
