// MR. MAS — Ep2 v1 · act1: helpers every Act One scene's drawings share (the shots pass, 2026-10-09). Small, pure,
// whole-pixel: a layer composite, a whole-room reframe (a new setup from a drawn room), a room a rung down (depth),
// held steps and held glides (the show's animation rate), the plate a first appearance gets, and the warm-lamp map for
// the cool-lit Ep1 rigs. A change here re-renders every Act One scene (the per-scene cache hashes this file with each).
import {Buf, clamp} from '../../../../../shared/pixel/px';
import {stepColor, familyOf, PAL} from '../../../../../shared/pixel/palette';

export const RH = 203;
export const W = 480;
/** a layer's transparent key (art/kit TR) */
export const TR = 0x1000000;
/** composite a TR-keyed layer over b (offset dx, dy) */
export const compose = (b: Buf, t: Buf, dx = 0, dy = 0) => {
  for (let y = 0; y < Math.min(t.h, RH); y++) for (let x = 0; x < t.w; x++) { const c = t.c[y * t.w + x]; if (c !== TR) b.set(x + dx, y + dy, c); }
};
/** the room reframed: everything already drawn moves (dx, dy) whole pixels; the strip it uncovers repeats the edge */
export const reframe = (b: Buf, dx: number, dy: number) => {
  if (!dx && !dy) return;
  const src = b.c.slice(0, W * RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.c[y * W + x] = src[clamp(y - dy, 0, RH - 1) * W + clamp(x - dx, 0, W - 1)];
};
/** the room area a rung (or k rungs) down: a background behind a foreground figure */
export const dimRoom = (b: Buf, k = 1, y0 = 0, y1 = RH) => { for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) b.c[y * W + x] = stepColor(b.c[y * W + x], -k); };
/** held steps: how many of `at` (ascending frames) have been reached */
export const stepOf = (k: number, at: number[]) => { let n = 0; for (const a of at) if (k >= a) n++; return n; };
/** a whole-pixel value moving from a to b between k0 and k1, held on `every` frames (ease-out when `ease`) */
export const glide = (k: number, k0: number, k1: number, a: number, b: number, every = 2, ease = false) => {
  const kk = clamp(k - (((k - k0) % every) + every) % every, k0, k1);
  let u = clamp((kk - k0) / Math.max(1, k1 - k0), 0, 1);
  if (ease) u = 1 - (1 - u) * (1 - u);
  return Math.round(a + (b - a) * u);
};
/** a string typed on at `rate` characters a frame from k0 */
export const typed = (s: string, k: number, k0 = 0, rate = 1) => s.slice(0, Math.max(0, Math.floor((k - k0) * rate)));
/** the cool (monitor / cyan) rungs of an Ep1 rig walked to warm ones (a candle, a lamp, the morning): skin under cyan
 *  to skin, the cyan rim to tungsten (kits/face-light's toWarmLamp, extended to the X rungs' fourth step) */
const WARM: Record<number, number> = {
  [PAL.K0]: PAL.S1, [PAL.K1]: PAL.S2, [PAL.K2]: PAL.S3, [PAL.K3]: PAL.S4, [PAL.K4]: PAL.S5, [PAL.K5]: PAL.S6,
  [PAL.X0]: PAL.S1, [PAL.X1]: PAL.S2, [PAL.X2]: PAL.S3, [PAL.X3]: PAL.S4,
  [PAL.C1]: PAL.W1, [PAL.C2]: PAL.W2, [PAL.C3]: PAL.W3, [PAL.C4]: PAL.W4, [PAL.C5]: PAL.W5, [PAL.C6]: PAL.W6, [PAL.C7]: PAL.W7, [PAL.C8]: PAL.W8, [PAL.C9]: PAL.W9,
};
export const warm = (c: number) => WARM[c] ?? c;
/** skin? (the S, K and X families) */
export const isSkin = (c: number) => { const fm = familyOf(c); return !!fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X'); };
/** a soft disc of light (an ordered-dither pool): pixels inside walk up `k` rungs, fading by distance */
export const glow = (b: Buf, cx: number, cy: number, rx: number, ry: number, k = 1, keep?: (x: number, y: number) => boolean) => {
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = Math.max(0, Math.floor(cy - ry)); y < Math.min(RH, Math.ceil(cy + ry)); y++) for (let x = Math.max(0, Math.floor(cx - rx)); x < Math.min(W, Math.ceil(cx + rx)); x++) {
    if (keep && keep(x, y)) continue;
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    if (d >= 1) continue;
    const t = (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
    const n = Math.floor((1 - d) * k + t);
    if (n > 0) b.set(x, y, stepColor(b.get(x, y), n));
  }
};
/** viseme -> a portrait's numbered mouths (Nole's: 0 rest, 1 teeth, 2 open, 3 round, 4 the smirk) */
export const noleMouth = (v: string): 0 | 1 | 2 | 3 | 4 => (v === 'A' ? 2 : v === 'E' ? 1 : v === 'O' ? 3 : v === 'smile' ? 4 : 0);
/** viseme -> a room figure's three mouths (0 shut, 1 small, 2 wide) */
export const room3 = (v: string): 0 | 1 | 2 => (v === 'A' || v === 'O' ? 2 : v === 'E' ? 1 : 0);
