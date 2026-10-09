// MR. MAS — Ep2 v1 · act2: helpers every Act Two scene shares (the shots pass, 2026-10-09). A copy of act1/sets/common.ts
// (a layer composite, a whole-room reframe, a room a rung down, held steps and glides, the warm-lamp map for the cool-lit
// Ep1 rigs) plus act1/sets/figures.ts backHead (the OTS foreground), copied so the two acts never share a cache key.
// A change here re-renders every Act Two scene.
import {Buf, clamp, bayer, hash} from '../../../../../shared/pixel/px';
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
/** a person from behind, very close (an OTS foreground): the back of the skull and its hair (strands sweeping up to
 *  the crown's whorl), the ear and a sliver of cheek on the side he looks toward, the nape, the collar (Mas's hood
 *  rolled round his neck; Nole's black tee) and the shoulders' slope out of frame; lit by the candles on `side`, a warm
 *  rim along that edge; drawn a rung soft (out of focus) */
export interface BackHead { hair: number[]; skin: number[]; top: number[]; collar: 'hood' | 'tee'; side: -1 | 1; rim: number; scale?: number; cheek?: number; /** act2: false = no ear (a head turned square away) */ ear?: boolean }
export const backHead = (b: Buf, cx: number, cy: number, o: BackHead) => {
  const s = o.scale ?? 1, rx = 31 * s, ry = 38 * s;
  const side = o.side;
  // the shoulders and the collar (behind the neck): flat ramps (the lit side, the mid, the far side's shadow), the rim
  // on the lit edge; no dither (it read as a mesh at 1080p)
  const sy = cy + ry * 0.95;
  for (let y = Math.floor(sy); y < RH; y++) for (let x = Math.floor(cx - 150 * s); x < cx + 150 * s; x++) {
    const t = clamp((y - sy) / (46 * s), 0, 1);
    const half = 34 * s + Math.sqrt(t) * 104 * s;
    const dx = x - cx;
    if (Math.abs(dx) > half) continue;
    const edge = Math.abs(dx) > half - 2 && Math.sign(dx) === side;
    const lit = dx * side > half * 0.7, deep = dx * side < -half * 0.45;
    b.set(x, y, edge ? o.rim : lit ? o.top[2] : deep ? o.top[0] : o.top[1]);
  }
  // the collar, walked in the frame's own pixels (a scaled shape stepped in its own units left holes: a checker)
  if (o.collar === 'hood') {
    const hy = sy - 6 * s;
    for (let Y = Math.floor(hy - 13 * s); Y <= Math.ceil(hy + 13 * s); Y++) for (let X = Math.floor(cx - 46 * s); X <= Math.ceil(cx + 46 * s); X++) {
      const i = (X - cx) / s, j = (Y - hy) / s;
      if (Math.hypot(i / 46, j / 13) >= 1 || Y >= RH || Y < 0) continue;
      b.set(X, Y, j < -5 ? o.top[2] : i * side > 22 ? o.top[2] : o.top[1]);
    }
  } else for (let X = Math.floor(cx - 30 * s); X <= Math.ceil(cx + 30 * s); X++) { const Y = Math.round(sy - 2 * s + Math.abs(X - cx) * 0.12); if (Y < RH) { b.set(X, Y, o.top[2]); b.set(X, Y + 1, o.top[1]); } }
  // the neck and nape (skin), narrower than the skull
  for (let y = Math.floor(cy + ry * 0.55); y < sy; y++) for (let x = Math.floor(cx - 18 * s); x < cx + 18 * s; x++) if (y < RH) b.set(x, y, (x - cx) * side > 6 * s ? o.skin[2] : o.skin[1]);
  // the skull: hair over all of it but the nape; strands curve up from the nape toward the crown's whorl (upper,
  // toward the far side); the lit edge toward `side`
  const wx = cx - side * 6 * s, wy = cy - ry * 0.55;
  for (let y = Math.floor(cy - ry); y < cy + ry; y++) for (let x = Math.floor(cx - rx); x < cx + rx; x++) {
    if (y < 0 || y >= RH) continue;
    const u = (x - cx) / rx, v = (y - cy) / ry;
    const d = Math.hypot(u, v * (v > 0 ? 1.12 : 1));
    if (d >= 1) continue;
    const hairline = cy + ry * (0.62 - Math.abs(u) * 0.25);
    if (y > hairline) { b.set(x, y, u * side > 0.3 ? o.skin[2] : o.skin[1]); continue; }
    const strand = ((x + Math.floor(y * 0.6) * side) % 5 === 0) && hash(x >> 2, y >> 1, 5) < 0.6;
    void wx; void wy;
    const lit = u * side + -v * 0.35 > 0.5;
    const c = d > 0.93 && u * side > 0.2 ? o.rim : lit ? (strand ? o.hair[3] : o.hair[2]) : u * side < -0.4 ? (strand ? o.hair[1] : o.hair[0]) : strand ? o.hair[2] : o.hair[1];
    b.set(x, y, c);
  }
  // the ear on the side he looks toward, and the cheek's edge beyond it (the turn): solid skin ramps in the frame's own
  // pixels, a one-step rim on the cheek (never the candle's orange on skin)
  const ex = cx + side * (rx - 4 * s), ey = cy + 2 * s;
  if (o.ear !== false) for (let Y = Math.floor(ey - 10 * s); Y <= Math.ceil(ey + 10 * s); Y++) for (let X = Math.floor(ex - 5 * s); X <= Math.ceil(ex + 5 * s); X++) {
    const i = (X - ex) / s, j = (Y - ey) / s;
    if (Math.hypot(i / 4.5, j / 9.5) >= 1 || Y < 0 || Y >= RH) continue;
    b.set(X, Y, i * side > 1.5 ? o.skin[3] : j > 4 ? o.skin[1] : o.skin[2]);
  }
  const ch = o.cheek ?? 0;
  if (ch > 0) {
    // the cheek: a crescent hugging the skull's outline beyond the ear (widest at the cheekbone, closing at the temple
    // and at the jaw), so it reads as the face turning, never a stick beside the head
    const y0 = ey - 8 * s, y1 = ey + 24 * s, wMax = ch * s;
    for (let Y = Math.floor(y0); Y <= Math.ceil(y1); Y++) {
      if (Y < 0 || Y >= RH) continue;
      const v = (Y - cy) / ry, k = v * (v > 0 ? 1.12 : 1);
      const xe = cx + side * rx * Math.sqrt(Math.max(0, 1 - Math.min(1, k * k))) - side;
      const t = (Y - y0) / (y1 - y0), w = Math.round(wMax * Math.sin(Math.PI * Math.min(1, Math.max(0, t))));
      for (let q = 1; q <= w; q++) { const X = Math.round(xe + side * q); b.set(X, Y, q === w ? o.skin[3] : o.skin[2]); }
    }
  }
};

/** a portrait whose last rows are its window's dark frame line (rima-speak: row 135 is N0): rows from `from` on are
 *  replaced by row `from - 1`, so putBustCut's run-on continues the jacket instead of a black slab */
export const bustRunOn = <T extends {w: number; h: number; c: Int32Array}>(im: T, from: number): T => {
  const c = im.c.slice();
  for (let y = from; y < im.h; y++) for (let x = 0; x < im.w; x++) c[y * im.w + x] = im.c[(from - 1) * im.w + x];
  return {...im, c};
};

/** Rima's room sprite (Ep1 cast/rima-stand, imported read-only) with its jaw lifted a rung: at room scale its lower
 *  face's shadow (S2) met her hair and read as a beard at 1080p; the rows under her mouth go S2 -> S3 (S3 -> S4 at the
 *  chin), so her face reads as a face framed by long hair */
import {rimaStand, RIMA_STAND_W, RIMA_STAND_FOOT} from '../../../../../shared/pixel/cast/rima-stand';
import type {RimaStandPose} from '../../../../../shared/pixel/cast/rima-stand';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
const RIMA_FIX = new Map<string, Img>();
export const rimaRoomImg = (p: RimaStandPose): Img => {
  const key = JSON.stringify(p);
  const hit = RIMA_FIX.get(key); if (hit) return hit;
  const im = rimaStand(p), c = im.c.slice();
  if (p.head === 'face') {
    // find the face's top row (the first row with skin) so a bob or a lean moves the patch with it
    let top = -1;
    for (let y = 0; y < 24 && top < 0; y++) for (let x = 0; x < im.w; x++) { const v = c[y * im.w + x]; if (v >= 0 && isSkin(v)) { top = y; break; } }
    if (top >= 0) for (let y = top + 6; y <= top + 10; y++) for (let x = 0; x < im.w; x++) {
      const i = y * im.w + x, v = c[i];
      if (v === PAL.S2) c[i] = PAL.S3; else if (v === PAL.S3 && y >= top + 8) c[i] = PAL.S4;
    }
  }
  const out = {...im, c};
  RIMA_FIX.set(key, out);
  return out;
};
export const drawRima = (b: Buf, footX: number, footY: number, p: RimaStandPose, o: {flip?: boolean; map?: (c: number) => number} = {}) => {
  const fx = o.flip ? RIMA_STAND_W - 1 - RIMA_STAND_FOOT[0] : RIMA_STAND_FOOT[0];
  blitImg(b, rimaRoomImg(p), footX - fx, footY - RIMA_STAND_FOOT[1], {flip: o.flip, map: o.map});
};

/** a bust's skin speckle smoothed (act1's XEL fix, as a wrapper: the art file is untouched): a skin pixel unlike all
 *  but one or two of its eight neighbours takes the tone most of them share; two passes. The engineer's sculpted head
 *  carried ambient-occlusion grain on its near cheek that read as stubble or a smudge at 1080p */
const SMOOTH = new WeakMap<object, Img>();
export const smoothSkin = <T extends Img>(im: T): T => {
  const hit = SMOOTH.get(im); if (hit) return hit as T;
  let c = im.c.slice();
  for (let pass = 0; pass < 2; pass++) {
    const n = c.slice();
    for (let y = 1; y < im.h - 1; y++) for (let x = 1; x < im.w - 1; x++) {
      const v = c[y * im.w + x]; if (v < 0 || !isSkin(v)) continue;
      const cnt = new Map<number, number>(); let same = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { if (!i && !j) continue; const u = c[(y + j) * im.w + x + i]; if (u === v) same++; if (u >= 0 && isSkin(u)) cnt.set(u, (cnt.get(u) ?? 0) + 1); }
      if (same > 2) continue;
      let best = v, bn = 0; for (const [u, k] of cnt) if (k > bn) { bn = k; best = u; }
      if (bn >= 5) n[y * im.w + x] = best;
    }
    c = n;
  }
  const out = {...im, c};
  SMOOTH.set(im, out);
  return out;
};
