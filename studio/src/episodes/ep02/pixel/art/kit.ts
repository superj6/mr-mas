// MR. MAS — Ep2 v1 art kit (the art lead's pass, 2026-10-08). Small drawing helpers every Ep2 set, prop and character
// file shares. New, additive, Ep2-only: nothing here edits a shared module or an Ep1 file. Where a helper is Ep1's
// (the T3 cut-paper tier, the staff recolour, the capsule arms and gripping hands), it is COPIED here from Ep1's locked
// art (episodes/ep01/pixel/act1/art/v35.ts, act3/art/party.ts) because those files keep it private.
//
//   paper / paperSprite / grain / post3     the T3 cut-paper memory tier (Ep1's, copied): flat layers with a one-rung
//                                            drop shadow, figures flattened to three tones with a cut edge
//   glossBloom / glossSpec                   the T4 glossy tier (F2.2): bloom one rung round the brightest pixels,
//                                            specular points; never toward photoreal
//   candleLight                              the séance's candle-lit grade: every pixel walks to the warm or night ramp
//                                            by its distance from the flames (a palette operation, no blend)
//   recolour / STAFF_LOOKS                   the staff: Ep1's rigs recoloured into other people (nobody named, nobody
//                                            real); room scale, no faces anyone would know
//   capsule / armTo / grip / happyEyes       Ep1's party arms (shoulder -> elbow -> wrist) and a gripping hand
//   fill / dith / vramp / pool / frame       rectangles, ordered-dither fills, stepped gradients, light pools, bezels
//   sp / spr                                 a string-map stamp straight into a buffer (hand-pixelled art)
//   put / under                              composite a TR-keyed buffer; the room area clip
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp, TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf, FAMILIES} from '../../../../shared/pixel/palette';
import type {Img} from '../../../../shared/pixel/figure';
import {blitImg} from '../../../../shared/pixel/figure';
export {pt, pw, pwrap, bpt, bpw, bpwrap, plain} from '../../../ep01/act4/animatic/lay';
export {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
export {micro, microWidth} from '../../../../shared/pixel/cast/bosses';

export const RH = 203;
export const TR = TRANSPARENT;
export type Rect = {x: number; y: number; w: number; h: number};
export type Plot = (x: number, y: number) => void;

// ------------------------------------------------------------------ basics
export const fill = (b: Buf, x: number, y: number, w: number, h: number, c: number) => rect(x, y, w, h, b.ink(c));
/** ordered-dither coverage `a` (0..1) of colour c over a rect */
export const dith = (b: Buf, x: number, y: number, w: number, h: number, a: number, c: number) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (bayer(i, j) < a) b.set(i, j, c);
};
/** a stepped vertical gradient through a ramp (top -> bottom), a narrow dither seam at each band edge */
export const vramp = (b: Buf, x: number, y: number, w: number, h: number, ramp: number[], seam = 0.35) => {
  const n = ramp.length;
  for (let j = 0; j < h; j++) {
    const t = (j / Math.max(1, h - 1)) * (n - 1);
    const k = Math.floor(t), fr = t - k;
    for (let i = 0; i < w; i++) {
      const c = fr > 1 - seam && bayer(x + i, y + j) < (fr - (1 - seam)) / seam ? ramp[Math.min(n - 1, k + 1)] : ramp[k];
      b.set(x + i, y + j, c);
    }
  }
};
/** a stepped horizontal gradient (left -> right) */
export const hramp = (b: Buf, x: number, y: number, w: number, h: number, ramp: number[], seam = 0.35) => {
  const n = ramp.length;
  for (let i = 0; i < w; i++) {
    const t = (i / Math.max(1, w - 1)) * (n - 1);
    const k = Math.floor(t), fr = t - k;
    for (let j = 0; j < h; j++) b.set(x + i, y + j, fr > 1 - seam && bayer(x + i, y + j) < (fr - (1 - seam)) / seam ? ramp[Math.min(n - 1, k + 1)] : ramp[k]);
  }
};
/** a stepped light pool: pixels inside the ellipse walk `k` rungs up their own family, more toward the centre */
export const pool = (b: Buf, cx: number, cy: number, rx: number, ry: number, k = 1, o: {clip?: Rect; strength?: number} = {}) => {
  const s = o.strength ?? 0.6;
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    if (o.clip && (x < o.clip.x || y < o.clip.y || x >= o.clip.x + o.clip.w || y >= o.clip.y + o.clip.h)) continue;
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    if (d >= 1) continue;
    const a = (1 - d) * s;
    const steps = bayer(x, y) < a ? (a > 0.55 && k > 1 ? k : 1) : 0;
    if (steps) b.set(x, y, stepColor(b.get(x, y), steps));
  }
};
/** darken (k < 0) or lighten a rect by palette steps */
export const stepRect = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) b.set(i, j, stepColor(b.get(i, j), k));
};
/** a bevelled bezel (screen / frame): outer dark, a lit top-left edge, an inner lip */
export const bezel = (b: Buf, x: number, y: number, w: number, h: number, o: {face?: number; hi?: number; lo?: number; lip?: number; t?: number} = {}) => {
  const face = o.face ?? PAL.N1, hi = o.hi ?? PAL.N4, lo = o.lo ?? PAL.N0, t = o.t ?? 3;
  fill(b, x, y, w, h, face);
  fill(b, x, y, w, 1, hi); fill(b, x, y, 1, h, hi);
  fill(b, x, y + h - 1, w, 1, lo); fill(b, x + w - 1, y, 1, h, lo);
  if (o.lip !== undefined) { fill(b, x + t - 1, y + t - 1, w - 2 * t + 2, 1, o.lip); fill(b, x + t - 1, y + t - 1, 1, h - 2 * t + 2, o.lip); }
  return {x: x + t, y: y + t, w: w - 2 * t, h: h - 2 * t};
};
/** a string-map stamp into a buffer: pal maps characters to colours; '.' and ' ' are transparent */
export const sp = (b: Buf, x: number, y: number, rows: string[], pal: Record<string, number>, o: {flip?: boolean; clip?: Rect} = {}) => {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[o.flip ? r.length - 1 - i : i];
      if (ch === '.' || ch === ' ') continue;
      const c = pal[ch];
      if (c === undefined) continue;
      const X = x + i, Y = y + j;
      if (o.clip && (X < o.clip.x || Y < o.clip.y || X >= o.clip.x + o.clip.w || Y >= o.clip.y + o.clip.h)) continue;
      b.set(X, Y, c);
    }
  });
};
/** copy every non-TR pixel of src (drawn at its own origin) into b at (x, y), clipped to `clip` if given */
export const put = (b: Buf, src: Buf, x = 0, y = 0, clip?: Rect, map?: (c: number, x: number, y: number) => number) => {
  for (let j = 0; j < src.h; j++) for (let i = 0; i < src.w; i++) {
    const v = src.c[j * src.w + i];
    if (v === TR) continue;
    const X = x + i, Y = y + j;
    if (clip && (X < clip.x || Y < clip.y || X >= clip.x + clip.w || Y >= clip.y + clip.h)) continue;
    b.set(X, Y, map ? map(v, X, Y) : v);
  }
};
/** a fresh transparent layer the size of the frame */
export const layer = (w = 480, h = 270) => new Buf(w, h, TR);
/** draw into a temporary layer and composite with a per-pixel map (a grade on one element only) */
export const graded = (b: Buf, draw: (t: Buf) => void, map: (c: number, x: number, y: number) => number, clip?: Rect) => {
  const t = layer(b.w, b.h);
  draw(t);
  put(b, t, 0, 0, clip, map);
};
export const blit = (b: Buf, img: Img, x: number, y: number, o: {flip?: boolean; clip?: (x: number, y: number) => boolean; map?: (c: number) => number} = {}) => blitImg(b, img, x, y, o);
/** a clip predicate for a rect */
export const clipR = (r: Rect) => (x: number, y: number) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
/** a line with a width of 2 (a cable, a rope) */
export const thick = (x0: number, y0: number, x1: number, y1: number, p: Plot) => { line(x0, y0, x1, y1, p); line(x0 + 1, y0, x1 + 1, y1, p); };

// ------------------------------------------------------------------ the T3 cut-paper tier (Ep1's, copied)
/** cut-paper: a layer drawn flat, then laid on the page with a one-rung shadow down and right (the paper's thickness) */
export const paper = (b: Buf, draw: (t: Buf) => void, sh = 1) => {
  const W = b.w, H = Math.min(b.h, RH);
  const t = new Buf(W, b.h, TR);
  draw(t);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (t.c[y * W + x] === TR) continue;
    for (let s = 1; s <= sh; s++) { const X = x + s, Y = y + s; if (X < W && Y < H && t.c[Y * W + X] === TR) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  }
  for (let i = 0; i < W * H; i++) if (t.c[i] !== TR) b.c[i] = t.c[i];
};
/** a sprite's ramps flattened to three tones (shadow, mid, light) */
export const post3 = (c: number) => {
  const fm = familyOf(c); if (!fm) return c;
  const [fam, i] = fm, R = FAMILIES[fam], n = R.length;
  const lv = i < n * 0.36 ? Math.max(0, Math.round(n * 0.15)) : i < n * 0.7 ? Math.round(n * 0.5) : Math.min(n - 1, Math.round(n * 0.78));
  return R[Math.min(n - 1, lv)];
};
/** a sprite as a cut-paper figure: three tones, a cut edge a rung up on its top and left (or a coloured rim on one side) */
export const paperSprite = (b: Buf, draw: (t: Buf) => void, o: {rim?: number; side?: -1 | 1; keepSkin?: boolean} = {}) => {
  const W = b.w, H = Math.min(b.h, RH);
  const t = new Buf(W, b.h, TR);
  draw(t);
  for (let i = 0; i < W * H; i++) if (t.c[i] !== TR) { const fm = familyOf(t.c[i]); if (!(o.keepSkin && fm && fm[0] === 'S')) t.c[i] = post3(t.c[i]); }
  const cut = new Buf(W, b.h, TR);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = t.c[y * W + x]; if (v === TR) continue;
    const up = y === 0 || t.c[(y - 1) * W + x] === TR, left = x === 0 || t.c[y * W + x - 1] === TR, right = x === W - 1 || t.c[y * W + x + 1] === TR;
    if (o.rim !== undefined && ((o.side ?? -1) < 0 ? left : right)) cut.c[y * W + x] = o.rim;
    else if (up || left) cut.c[y * W + x] = stepColor(v, 1);
  }
  paper(b, (p) => { for (let i = 0; i < W * H; i++) if (t.c[i] !== TR) p.c[i] = cut.c[i] !== TR ? cut.c[i] : t.c[i]; });
};
/** the paper's grain over a region (static: it's the page, not the light) */
export const grain = (b: Buf, x0 = 0, y0 = 0, x1 = 480, y1 = RH, skip?: (x: number, y: number) => boolean) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (skip && skip(x, y)) continue;
    const h = hash(x, y, 97);
    if (h < 0.035) b.set(x, y, stepColor(b.get(x, y), 1)); else if (h > 0.975) b.set(x, y, stepColor(b.get(x, y), -1));
  }
};

// ------------------------------------------------------------------ the T4 glossy tier (F2.2)
/** bloom: every pixel next to one at or above `thr` lightness walks one rung up (a glow one pixel wide, no blend) */
export const glossBloom = (b: Buf, x0 = 0, y0 = 0, x1 = 480, y1 = RH, thr = 0.72, reach = 2) => {
  const src = b.clone();
  const hot = (x: number, y: number) => x >= 0 && y >= 0 && x < b.w && y < b.h && lightness(src.c[y * b.w + x]) >= thr;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (hot(x, y)) continue;
    let near = 0;
    for (let d = 1; d <= reach && !near; d++) if (hot(x - d, y) || hot(x + d, y) || hot(x, y - d) || hot(x, y + d)) near = d;
    if (near === 1 || (near === 2 && bayer(x, y) < 0.5)) b.set(x, y, stepColor(src.c[y * b.w + x], 1));
  }
};
/** specular points: a 1-px hot highlight where a lit edge turns (the gloss of glass and lacquer) */
export const glossSpec = (b: Buf, pts: Array<[number, number]>, col = PAL.W9) => { for (const [x, y] of pts) { b.set(x, y, col); b.set(x + 1, y, stepColor(col, -2)); } };

// ------------------------------------------------------------------ the candle-lit grade (sc 4)
export interface Flame { x: number; y: number; r: number; on?: boolean }
/** Re-light a drawn room by candles: lightness is kept as the pixel's tone, the hue walks to the warm ramp near a
 *  flame and to the night ramp away from all of them. `amb` is the darkness floor (0..1). Skin keeps its family
 *  (warmed one rung) so faces stay faces. */
export const candleLight = (b: Buf, flames: Flame[], o: {x0?: number; y0?: number; x1?: number; y1?: number; amb?: number; keep?: (x: number, y: number) => boolean} = {}) => {
  const W = [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7, PAL.W8];
  const N = [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.U1, PAL.U2];
  const x0 = o.x0 ?? 0, y0 = o.y0 ?? 0, x1 = o.x1 ?? 480, y1 = o.y1 ?? RH, amb = o.amb ?? 0.18;
  const lit = flames.filter((f) => f.on !== false);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (o.keep && o.keep(x, y)) continue;
    const c = b.get(x, y);
    let L = 0;
    for (const fl of lit) { const d = Math.hypot(x - fl.x, (y - fl.y) * 1.15) / fl.r; if (d < 1) L = Math.max(L, (1 - d) * (1 - d)); }
    const l = lightness(c);
    const fm = familyOf(c);
    const bz = bayer(x, y) - 0.5;
    if (fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X')) {
      // skin: stays skin, lit or dropped by the flame's reach
      const k = L > 0.35 ? 1 : L > 0.12 ? 0 : L > 0.04 ? -1 : -2;
      b.set(x, y, stepColor(fm[0] === 'S' ? c : [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5][Math.min(4, fm[1])], k));
      continue;
    }
    // the warm ramp wins by an ordered dither in proportion to the flame's reach (a soft edge, never a hard ring)
    const warmWins = L > 0.02 && bayer(x, y) < Math.min(1, L * 9);
    if (warmWins) { const v = clamp(l * 1.25 * (amb + 0.25 + L * 1.5), 0, 1); b.set(x, y, W[clamp(Math.round(v * (W.length - 1) + bz * 0.6), 0, W.length - 1)]); }
    else b.set(x, y, N[clamp(Math.round(l * (N.length - 1) * (0.75 + amb) + bz * 0.6), 0, N.length - 1)]);
  }
};

// ------------------------------------------------------------------ the staff (Ep1's recolour, copied)
export type Look = {hood: string; hair: string; skin: 0 | 1 | 2};
/** a ramp swap by family: the hoodie/jacket (G) to another family, the hair (B) darker or lighter, the skin (S) to one
 *  of three ramps (never a face anyone would know: room scale, no names) */
export const recolour = (look: Look) => (c: number) => {
  const fm = familyOf(c); if (!fm) return c;
  const [fam, i] = fm;
  if (fam === 'G') { const R: Record<string, number[]> = {F: [PAL.F0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5, PAL.F6], U: [PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4, PAL.U5, PAL.U5], D: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.D4, PAL.D4], L: [PAL.L0, PAL.L0, PAL.L1, PAL.L1, PAL.L2, PAL.L2, PAL.L3], G: [PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6], C: [PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5, PAL.C6], R: [PAL.R0, PAL.R0, PAL.R1, PAL.R1, PAL.R2, PAL.R2, PAL.R3], W: [PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7]}; return (R[look.hood] ?? R.G)[Math.min(6, i)]; }
  if (fam === 'B') return look.hair === 'dark' ? [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3][Math.min(4, i)] : look.hair === 'light' ? [PAL.B2, PAL.B3, PAL.B4, PAL.W4, PAL.W5][Math.min(4, i)] : look.hair === 'grey' ? [PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6][Math.min(4, i)] : c;
  if (fam === 'S' && look.skin !== 1) { const R = look.skin === 2 ? [PAL.D0, PAL.D1, PAL.D2, PAL.B3, PAL.B4, PAL.S3, PAL.S3] : [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.S6]; return R[Math.min(6, i)]; }
  return c;
};
/** a fixed roster of staff looks (cycled by index): no two neighbours alike */
export const STAFF_LOOKS: Look[] = [
  {hood: 'F', hair: 'dark', skin: 2}, {hood: 'U', hair: 'dark', skin: 0}, {hood: 'D', hair: 'light', skin: 0}, {hood: 'L', hair: 'light', skin: 1},
  {hood: 'G', hair: 'dark', skin: 1}, {hood: 'C', hair: 'grey', skin: 0}, {hood: 'R', hair: 'dark', skin: 2}, {hood: 'W', hair: 'brown', skin: 1},
  {hood: 'F', hair: 'light', skin: 0}, {hood: 'U', hair: 'brown', skin: 2},
];

// ------------------------------------------------------------------ arms and hands (Ep1's party, copied)
/** a sleeve ramp: shadow, mid, lit, and the rim on the lit edge */
export type Sleeve = [number, number, number, number];
export const HOODIE: Sleeve = [PAL.G1, PAL.G2, PAL.G3, PAL.W4];
/** a limb segment as a capsule, shaded from a key up and to the left: its lit side a rung up, its far side a rung down,
 *  a rim on the lit edge */
export const capsule = (b: Buf, x0: number, y0: number, x1: number, y1: number, r: number, sl: Sleeve, key: [number, number] = [-0.55, -0.83]) => {
  const dx = x1 - x0, dy = y1 - y0, L2 = Math.max(1, dx * dx + dy * dy);
  for (let y = Math.floor(Math.min(y0, y1) - r - 1); y <= Math.max(y0, y1) + r + 1; y++) for (let x = Math.floor(Math.min(x0, x1) - r - 1); x <= Math.max(x0, x1) + r + 1; x++) {
    if (y < 0 || y >= b.h || x < 0 || x >= b.w) continue;
    const t = clamp(((x - x0) * dx + (y - y0) * dy) / L2, 0, 1), cx = x0 + dx * t, cy = y0 + dy * t, d = Math.hypot(x - cx, y - cy);
    if (d > r) continue;
    const nx = (x - cx) / Math.max(0.5, d), ny = (y - cy) / Math.max(0.5, d), lit = key[0] * nx + key[1] * ny;
    b.set(x, y, d > r - 1 && lit > 0.35 ? sl[3] : lit > 0.3 ? sl[2] : lit < -0.35 ? sl[0] : sl[1]);
  }
};
/** an arm from the shoulder to the elbow to the wrist, the cuff a rung up near the wrist */
export const armTo = (b: Buf, sh: [number, number], el: [number, number], wr: [number, number], sl: Sleeve, r0 = 7, r1 = 6) => {
  capsule(b, sh[0], sh[1], el[0], el[1], r0, sl);
  capsule(b, el[0], el[1], wr[0], wr[1], r1, sl);
  const t = 0.82, cx = el[0] + (wr[0] - el[0]) * t, cy = el[1] + (wr[1] - el[1]) * t;
  capsule(b, cx, cy, wr[0], wr[1], r1, [sl[1], sl[2], stepColor(sl[2], 1), sl[3]]);
};
/** skin ramps for hands: [crease, shadow, mid, lit, bright] */
export const HANDSKIN: Record<0 | 1 | 2, number[]> = {0: [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], 1: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5], 2: [PAL.D1, PAL.D2, PAL.B3, PAL.B4, PAL.S3]};
/** a hand gripping something (x..x+w wide, from row y): the fingers wrapped across its front in four rows, their
 *  creases, the knuckles lit; the thumb over the top on the wrist's side (side -1: the wrist is to the left) */
export const grip = (b: Buf, x: number, y: number, w: number, side: -1 | 1, sk: number[] = HANDSKIN[0]) => {
  for (let q = 0; q < 4; q++) {
    const yy = y + q * 3, x0 = x - 1 + (q === 3 ? 1 : 0), x1 = x + w + (q === 3 ? -1 : 1);
    for (let xx = x0; xx <= x1; xx++) { b.set(xx, yy, sk[3]); b.set(xx, yy + 1, sk[2]); b.set(xx, yy + 2, sk[0]); }
    b.set(side < 0 ? x1 : x0, yy + 1, sk[1]);
  }
  const tx = side < 0 ? x - 3 : x + w - 1;
  for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) if (Math.hypot((i - 2) / 2.6, (j - 3.5) / 4.2) < 1) b.set(tx + i, y - 4 + j, j < 2 ? sk[3] : sk[2]);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 7; i++) b.set(side < 0 ? x - 7 + i : x + w + 1 + i, y + j, i === (side < 0 ? 0 : 6) ? sk[0] : j < 2 ? sk[3] : sk[2]);
};
/** a small room-scale hand (3 x 3 + thumb) at (x, y) */
export const handS = (b: Buf, x: number, y: number, sk: number[] = HANDSKIN[0]) => { fill(b, x, y, 3, 3, sk[2]); b.set(x, y, sk[3]); b.set(x + 1, y, sk[3]); b.set(x + 2, y + 2, sk[1]); };

// ------------------------------------------------------------------ misc
/** deterministic pick */
export const pick = <T,>(a: T[], i: number, s = 0): T => a[Math.floor(hash(i, s, 31) * a.length) % a.length];
/** hold a value on n-frame steps (the show's held drawings) */
export const holdN = (f: number, n: number) => Math.floor(f / n);
/** the room's floor shadow under a figure's feet (an ellipse a rung down) */
export const footShadow = (b: Buf, x: number, y: number, w = 12) => { for (let i = -w; i <= w; i++) for (let j = -1; j <= 1; j++) if (Math.abs(i) / w + Math.abs(j) / 1.5 < 1 && bayer(x + i, y + j) < 0.7) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), -1)); };
export {rect, line, poly, ellipse, bayer, hash, clamp, PAL, stepColor, lightness, familyOf, Buf};
