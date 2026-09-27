// MR. MAS — shared kit: TTEMME'S 72-HOUR HOURGLASS AT INSERT SCALE (PROP-HOURGLASS-INSERT; Ep1 Act Four v5 art pass;
// new file, owned by the v5 art pass). v4 blew the small prop up 2x for S4.11 and S7.13 (marked a stand-in). This is
// the same hourglass DRAWN at insert size (kits/props.ts `hourglass` is the room-scale one and stays as it is):
// turned walnut caps with a bead, four turned posts (two in front), the two bulbs with their neck, sand grains in
// whole pixels, the specular streaks of the boardroom's cyan light on the glass.
//   drawHourglassXL(b, x, y, o)   (x, y) = top-left of its 60 x 98 box (upright, 'front' view); o:
//     moved       grains through (0 = just flipped, all on top; HGX_GRAINS = run out; HGX_GRAINS - 1 = the last grain)
//     running     the 1 px thread from the neck, a grain travelling down it one pixel per `beat` frames (script:
//                 "one pixel per beat")
//     view        'front' (S4.11, desk level, low) | 'high' (S7.13, the table seen from above: the top cap's face
//                 shows as an ellipse, the body foreshortened a step; its own drawing, never a squash)
//     pose        'upright' | 'side' (the flip's middle drawing: lying on its side, sand slumped low) | 'lift'
//     hand        Ttemme's hand on the top cap for the flip drawings (his hoodie's plum sleeve)
//     shatter     frames since the glass broke: shards fly on whole-pixel arcs (12 f), the sand HOLDS the bulbs'
//                 shape for a beat (15 f), then slumps in three held drawings into a heap on the base
//   hgxFlip(k)    S4.11's flip as three held drawings from k 0: lift (4 f), side (6 f), set down flipped (+1 px bump)
//   HGX           the box and the anchors (the neck's centre, the base line) for the shot's framing
// Light: the key is the table's cyan LED bar from below-left ('front') or the overhead (warm-neutral, 'high'); no
// dither on the prop (flat rungs), whole pixels only.
import {Buf, rect, hash, clamp} from '../px';
import {PAL} from '../palette';

export const HGX = {w: 60, h: 98, cap: 8, glassTop: 8, glassH: 82, maxHalf: 21, post: 3, neckY: 49};
const WOOD = [PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4];
const SAND = [PAL.W3, PAL.W4, PAL.W6, PAL.W7, PAL.W8];
const GLASS = [PAL.N5, PAL.C3, PAL.C5, PAL.C7, PAL.C9];

/** interior half-width of the glass at row j (0 = top): two rounded bulbs meeting at a 1 px neck */
const half = (j: number, glassH = HGX.glassH) => {
  const mid = (glassH - 1) / 2;
  const u = Math.abs(j - mid) / mid;
  if (u < 0.04) return 0;
  const s = Math.sin(Math.min(1, (u - 0.04) / 0.86) * Math.PI * 0.6) * (u > 0.92 ? 0.8 : 1);
  return Math.max(1, Math.round(HGX.maxHalf * s));
};
const cellCache = new Map<number, {top: Array<[number, number]>; bot: Array<[number, number]>}>();
const cells = (glassH: number) => {
  let v = cellCache.get(glassH);
  if (v) return v;
  const mid = Math.floor((glassH - 1) / 2);
  const top: Array<[number, number]> = [], bot: Array<[number, number]> = [];
  for (let j = 0; j < glassH; j++) {
    const hw = half(j, glassH) - 1;
    if (hw < 0) continue;
    for (let i = -hw; i <= hw; i++) (j < mid ? top : j > mid + 1 ? bot : null)?.push([i, j]);
  }
  top.sort((a, b) => (b[1] - a[1]) || (Math.abs(a[0]) - Math.abs(b[0])));
  bot.sort((a, b) => (b[1] - Math.abs(b[0]) * 0.5) - (a[1] - Math.abs(a[0]) * 0.5) || Math.abs(a[0]) - Math.abs(b[0]));
  v = {top, bot};
  cellCache.set(glassH, v);
  return v;
};
/** the grains it holds: 72% of the top bulb */
export const HGX_GRAINS = Math.floor(cells(HGX.glassH).top.length * 0.72);

export interface HourglassXLOpts {
  moved?: number;
  running?: boolean;
  f?: number;
  /** frames per pixel of the travelling grain (a beat = 15) */
  beat?: number;
  view?: 'front' | 'high';
  pose?: 'upright' | 'side' | 'lift';
  hand?: boolean;
  shatter?: number;
}
const sandAt = (i: number, j: number, k: number, n: number, surfRows: number) => {
  if (k >= n - surfRows) return SAND[3]; // the lit surface
  if (i > HGX.maxHalf * 0.45) return SAND[0];
  if (i > 2) return SAND[1];
  if (i < -HGX.maxHalf * 0.5 && (j & 1)) return SAND[3];
  return (hash(i, j, 41) < 0.08 ? SAND[3] : SAND[2]);
};
/** a turned wooden cap: a slab with a bead and its shadow; 'high' adds the top face as an ellipse */
const cap = (b: Buf, x: number, y: number, w: number, h: number, top: boolean, high: boolean) => {
  rect(x, y, w, h, b.ink(WOOD[2]));
  rect(x, y + (top ? h - 2 : 0), w, 2, b.ink(WOOD[1]));
  rect(x + 2, y + Math.floor(h / 2) - 1, w - 4, 1, b.ink(WOOD[3])); // the bead's catch
  rect(x + 2, y + Math.floor(h / 2), w - 4, 1, b.ink(WOOD[0]));
  rect(x, y, 1, h, b.ink(WOOD[3])); rect(x + w - 1, y, 1, h, b.ink(WOOD[0]));
  b.set(x + 3, y + 1, WOOD[4]); b.set(x + 4, y + 1, WOOD[4]); b.set(x + 5, y + 1, WOOD[3]);
  if (high && top) {
    // the top face seen from above: an ellipse over the cap, lit; the grain as two darker arcs
    const cx = x + w / 2, cy = y, rx = w / 2, ry = 5;
    for (let j = -ry; j <= 0; j++) for (let i = -rx; i <= rx; i++) {
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) > 1) continue;
      const X = Math.round(cx + i - 0.5), Y = cy + j;
      b.set(X, Y, (i * i) / (rx * rx) + (j * j) / (ry * ry) > 0.8 ? WOOD[4] : Math.abs(j + 2) < 1 && Math.abs(i) < rx * 0.6 ? WOOD[2] : WOOD[3]);
    }
  }
};
/** the flip's middle drawing: on its side (L = the box's height across, T = its width tall), sand slumped low */
const side = (b: Buf, x: number, y: number) => {
  const L = HGX.h, T = HGX.w;
  const ox = x + Math.floor((HGX.w - L) / 2), oy = y + Math.floor((HGX.h - T) / 2);
  const cy = oy + Math.floor(T / 2);
  for (const py of [oy + 3, oy + T - 3 - HGX.post]) { rect(ox + HGX.cap, py, L - 2 * HGX.cap, HGX.post, b.ink(WOOD[1])); rect(ox + HGX.cap, py, L - 2 * HGX.cap, 1, b.ink(WOOD[3])); }
  for (let i = 0; i < HGX.glassH; i++) {
    const hw = half(i), X = ox + HGX.glassTop + i;
    for (let j = Math.max(0, hw - 1 - Math.round(hw * 0.5)); j <= hw - 1; j++) b.set(X, cy + j, j === hw - 1 ? SAND[0] : j < hw - Math.round(hw * 0.4) ? SAND[3] : SAND[2]);
    b.set(X, cy - hw, GLASS[3]); b.set(X, cy + hw, GLASS[1]);
    if (hw > 6 && i % 3 === 0) b.set(X, cy - hw + 2, GLASS[4]);
  }
  for (const cxp of [ox, ox + L - HGX.cap]) { rect(cxp, oy, HGX.cap, T, b.ink(WOOD[2])); rect(cxp, oy, 1, T, b.ink(WOOD[3])); rect(cxp + HGX.cap - 1, oy, 1, T, b.ink(WOOD[0])); rect(cxp + 3, oy + 2, 1, T - 4, b.ink(WOOD[3])); }
};
/** his hand over the top cap, from above and behind: the sleeve coming in on a slant from the top right, the back of
 *  the hand over the cap, four fingers curled down over its front edge (each its own knuckle), the thumb round the
 *  near side. (x, y) = the hourglass box's top-left (the cap's top row) */
const hand = (b: Buf, x: number, y: number) => {
  const cx = x + Math.floor(HGX.w / 2);
  // the sleeve: a slanted plum cuff up and out of frame to the right (3 rungs, the lit edge toward the key)
  for (let j = 0; j < 34; j++) {
    const x0 = cx - 4 + Math.round(j * 0.55), w = 22;
    for (let i = 0; i < w; i++) b.set(x0 + i, y - 8 - j, i < 2 ? PAL.U3 : i > w - 3 ? PAL.U1 : PAL.U2);
  }
  for (let i = 0; i < 24; i++) { b.set(cx - 5 + i, y - 8, PAL.U1); b.set(cx - 5 + i, y - 9, PAL.U3); } // the cuff's edge
  // the back of the hand: a rounded slab over the cap
  for (let j = 0; j < 8; j++) for (let i = -14 + (j < 2 ? 2 - j : 0); i <= 12 - (j < 2 ? 2 - j : 0); i++) b.set(cx + i, y - 8 + j, j === 0 ? PAL.S5 : i < -9 ? PAL.S4 : i > 8 ? PAL.S2 : PAL.S3);
  // four fingers curled over the cap's front edge: each 5 wide, its knuckle lit, the tip in shadow under the bead
  for (let k = 0; k < 4; k++) {
    const fx = cx - 14 + k * 6 + (k > 1 ? 1 : 0);
    for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) b.set(fx + i, y + j, j === 0 ? PAL.S4 : j > 4 ? PAL.S2 : i === 4 ? PAL.S2 : PAL.S3);
    b.set(fx + 1, y, PAL.S5); b.set(fx + 2, y, PAL.S5);
  }
  // the thumb round the near (left) side of the cap
  for (let j = 0; j < 9; j++) for (let i = 0; i < 4; i++) b.set(x - 2 + i, y - 2 + j, i === 0 ? PAL.S2 : j === 0 ? PAL.S5 : PAL.S3);
};
/** S4.11's flip as held drawings, k = frames since his hand takes it */
export const hgxFlip = (k: number): {pose: 'upright' | 'side' | 'lift'; flipped: boolean; dy: number; hand: boolean} => {
  if (k < 0) return {pose: 'upright', flipped: false, dy: 0, hand: false};
  if (k < 4) return {pose: 'lift', flipped: false, dy: -4, hand: true};
  if (k < 10) return {pose: 'side', flipped: false, dy: -8, hand: true};
  if (k < 13) return {pose: 'upright', flipped: true, dy: -2, hand: true};
  if (k < 14) return {pose: 'upright', flipped: true, dy: 1, hand: true};
  if (k < 18) return {pose: 'upright', flipped: true, dy: 0, hand: true};
  return {pose: 'upright', flipped: true, dy: 0, hand: false};
};

export const drawHourglassXL = (b: Buf, x: number, y: number, o: HourglassXLOpts = {}) => {
  if (o.pose === 'side') { side(b, x, y); if (o.hand) hand(b, x + 20, y + Math.floor((HGX.h - HGX.w) / 2) + 2); return; }
  const high = o.view === 'high';
  // 'high': the body is foreshortened by redrawing the bulbs on a shorter column (its own drawing, not a squash)
  const glassH = high ? 74 : HGX.glassH;
  const H = glassH + 2 * HGX.cap;
  const N = HGX_GRAINS;
  const C = cells(glassH);
  const Nc = Math.min(N, C.top.length, C.bot.length);
  const moved = clamp(Math.round(o.moved ?? 0), 0, Nc);
  const cx = x + Math.floor(HGX.w / 2), gy = y + HGX.cap;
  const sh = o.shatter;
  // the posts behind the glass (the far two), then in front (the near two, drawn after the glass)
  const posts = (front: boolean) => {
    for (const px of front ? [x + 4, x + HGX.w - 4 - HGX.post] : [x + 9, x + HGX.w - 9 - HGX.post]) {
      for (let j = y + HGX.cap; j < y + H - HGX.cap; j++) {
        const bead = (j - y) % 14 === 7;
        rect(px - (bead ? 1 : 0), j, HGX.post + (bead ? 2 : 0), 1, b.ink(front ? (bead ? WOOD[3] : WOOD[2]) : WOOD[0]));
        if (front) b.set(px, j, WOOD[3]);
      }
    }
  };
  posts(false);
  // the sand (or the heap)
  const topN = Nc - moved;
  const slump = sh === undefined ? 0 : sh < 15 ? 0 : Math.min(3, Math.floor((sh - 15) / 6) + 1);
  const surfRows = 30;
  if (slump === 0) {
    for (let k = 0; k < topN; k++) { const [i, j] = C.top[k]; b.set(cx + i, gy + j, sandAt(i, j, k, topN, surfRows)); }
    for (let k = 0; k < moved; k++) { const [i, j] = C.bot[k]; b.set(cx + i, gy + j, sandAt(i, j, k, moved, surfRows)); }
  } else {
    // the glass is gone; the sand gives up the bulbs' shape in three held drawings, the same grains each time
    const s = slump === 1 ? 0.9 : slump === 2 ? 1.4 : 2.4;
    const B = Math.max(2, Math.round(Math.sqrt(Nc * s)) - 1);
    let left = Nc;
    const base = y + H - HGX.cap;
    for (let j = 0; left > 0 && j < 90; j++) {
      const hw = Math.max(3, Math.round(B - j * s)), row = Math.min(left, hw * 2 + 1), x0 = cx - Math.floor(row / 2);
      for (let i = 0; i < row; i++) { const u = (i - row / 2) / Math.max(1, row / 2); b.set(x0 + i, base - 1 - j, j === 0 ? SAND[0] : u > 0.4 ? SAND[1] : u < -0.4 ? SAND[3] : SAND[2]); }
      left -= row;
    }
  }
  // the thread and its travelling grain: one pixel per beat
  const mid = Math.floor((glassH - 1) / 2);
  if (o.running && moved < Nc && topN > 0 && sh === undefined) {
    const botTop = moved > 0 ? C.bot[Math.max(0, moved - 1)][1] : glassH - 1;
    for (let j = mid; j < botTop; j++) b.set(cx, gy + j, SAND[2]);
    const beat = o.beat ?? 15;
    const gj = mid + (Math.floor((o.f ?? 0) / beat) % Math.max(1, botTop - mid));
    b.set(cx, gy + gj, SAND[4]);
  }
  if (moved === Nc - 1 && sh === undefined) b.set(cx, gy + mid, SAND[4]); // the last grain, on the neck
  // the glass: its outline (lit left by the cyan bar, dark right), two specular streaks, the neck's collar
  if (sh === undefined) {
    for (let j = 0; j < glassH; j++) {
      const hw = half(j, glassH);
      b.set(cx - hw, gy + j, GLASS[2]); b.set(cx + hw, gy + j, GLASS[0]);
      if (hw >= 8) {
        const inTop = j > 4 && j < mid - 6, inBot = j > mid + 6 && j < glassH - 5;
        if (inTop || inBot) { b.set(cx - hw + 3, gy + j, j % 6 === 0 ? GLASS[4] : GLASS[3]); if (hw >= 14 && j % 2 === 0) b.set(cx + hw - 4, gy + j, GLASS[1]); }
      }
    }
    rect(cx - 2, gy + mid - 1, 5, 3, b.ink(GLASS[1])); b.set(cx - 2, gy + mid - 1, GLASS[3]);
  } else if (sh < 12) {
    // the shards: every outline pixel on its own whole-pixel arc; frame 0 = the cracks
    for (let j = 0; j < glassH; j++) for (const sd of [-1, 1]) {
      const hw = half(j, glassH), x0 = cx + sd * hw, y0 = gy + j;
      if (sh === 0) { b.set(x0, y0, GLASS[3]); if (hash(j, sd, 5) < 0.3) b.set(x0 - sd, y0, GLASS[3]); continue; }
      if (hash(j, sd, 6) < 0.4) continue;
      const vx = sd * (1 + hash(j, sd, 7) * 3.5), vy = -1.2 - hash(sd, j, 8) * 2.2;
      const px = Math.round(x0 + vx * sh), py = Math.round(y0 + vy * sh + 0.4 * sh * sh);
      b.set(px, py, sh < 5 ? GLASS[3] : GLASS[1]);
      if (sh < 4 && hash(j, sd, 9) < 0.5) b.set(px + sd, py, GLASS[2]);
    }
  }
  posts(true);
  cap(b, x, y, HGX.w, HGX.cap, true, high);
  cap(b, x, y + H - HGX.cap, HGX.w, HGX.cap, false, false);
  if (o.hand || o.pose === 'lift') hand(b, x, y);
};
