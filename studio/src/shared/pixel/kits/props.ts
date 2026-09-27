// MR. MAS — shared kit: ACT FOUR PROPS (show-wide; first used in Ep1 sc 26A-30, several recur).
//
//   hourglass    TTEMME's 72-hour hourglass: FLIP (3 drawings, no rotation), RUN (sand moves one pixel per call:
//                "one pixel per beat"), SHATTER (only the glass; the sand holds the hourglass's shape for one beat,
//                then slumps). Two sizes: 'L' (portraits, inserts, 23 x 37) and 'S' (room wides, 11 x 17).
//   lobbySign    the NopeAI lobby's 'DAYS SINCE SOMEONE TRIED TO FIRE MAS' light box: dark and blank, lighting up
//                in held steps (<= 2 flashes), hung digit plates; zeroBox = the box of spare '0' plates.
//   tally        desk tally marks carved in wood: old and faint (the two we couldn't quite read), and a new one
//                carved clean by a pen's steel clip, whole px at a time, with curled shavings; any wood surface
//                (the groove is a family step of whatever is under it, so it lights like the desk). Room-scale too.
//   pen          the MACROSOFT check pen (slate, a steel clip), drawn at the carving angle.
//   fire         cartoon fires in 3 sizes, 3-drawing loops on 4s, a warm glow on the surface under them, and the
//                put-out sequence (the flame steps down through the smaller drawings to a smoke puff).
//   spray        the extinguisher's puff (it works because the pin is out).
//   pinTag       the extinguisher pin with its tamper tag, readable: DO NOT REMOVE.
//   guestBadge   the GUEST lanyard: the insert (readable), the worn chip (room sprites) and the coiled desk prop.
import {Buf, rect, line, ellipse, hash, clamp, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../font';
import {micro, microWidth} from '../cast/bosses';

// ================================================================== the hourglass
export type HGSize = 'L' | 'S';
interface HGGeo { w: number; h: number; cap: number; glassTop: number; glassH: number; neck: number; maxHalf: number; post: number; }
const HG: Record<HGSize, HGGeo> = {
  L: {w: 23, h: 37, cap: 3, glassTop: 3, glassH: 31, neck: 15, maxHalf: 8, post: 2},
  S: {w: 11, h: 17, cap: 2, glassTop: 2, glassH: 13, neck: 6, maxHalf: 4, post: 1},
};
/** half-width of the glass interior at glass row j (0 = top), for a size */
const bulbHalf = (g: HGGeo, j: number) => {
  const mid = (g.glassH - 1) / 2;
  const u = Math.abs(j - mid) / mid; // 0 at the neck, 1 at the caps
  if (u < 0.08) return 0; // the neck: 1 px
  // a rounded bulb: widest at ~70% from the neck, then tucking in toward the cap
  const s = Math.sin(Math.min(1, (u - 0.08) / 0.8) * Math.PI * 0.62) * (u > 0.9 ? 0.85 : 1);
  return Math.max(1, Math.round(g.maxHalf * s));
};
/** interior cells of each bulb, ordered the way sand fills them (from the bottom up, centre out) */
const cellsCache = new Map<HGSize, {top: Array<[number, number]>; bot: Array<[number, number]>}>();
const bulbCells = (size: HGSize) => {
  let v = cellsCache.get(size);
  if (v) return v;
  const g = HG[size];
  const mid = Math.floor((g.glassH - 1) / 2);
  const top: Array<[number, number]> = [], bot: Array<[number, number]> = [];
  for (let j = 0; j < g.glassH; j++) {
    const hw = bulbHalf(g, j) - 1;
    if (hw < 0) continue;
    for (let i = -hw; i <= hw; i++) (j < mid ? top : j > mid + 1 ? bot : null)?.push([i, j]);
  }
  // top bulb: sand sits at its bottom (next to the neck) -> fill from the neck up; drains from the top surface,
  // with a funnel: the centre column drains first
  top.sort((a, b) => (b[1] - a[1]) || (Math.abs(a[0]) - Math.abs(b[0])));
  // bottom bulb: a mound: fill from the bottom up, centre columns lead by a row
  bot.sort((a, b) => (b[1] - Math.abs(b[0]) * 0.45) - (a[1] - Math.abs(a[0]) * 0.45) || Math.abs(a[0]) - Math.abs(b[0]));
  v = {top, bot};
  cellsCache.set(size, v);
  return v;
};
/** How many sand grains the hourglass holds (fill level: 70% of the top bulb). */
export const hourglassGrains = (size: HGSize = 'L') => Math.floor(bulbCells(size).top.length * 0.7);

export interface HourglassOpts {
  size?: HGSize;
  /** grains that have run through (0 = all on top, just flipped; hourglassGrains() = all run out) */
  moved?: number;
  /** the stream is running (a 1 px thread from the neck with a travelling grain) */
  running?: boolean;
  f?: number;
  /** 'upright' | 'side' (the flip's middle drawing, lying on its side, sand slumped to the low side) */
  pose?: 'upright' | 'side';
  /** frames since the glass shattered (undefined = intact) */
  shatter?: number;
  /** colours */
  wood?: number[]; sand?: number[]; glass?: number[];
}
const WOOD = [PAL.D1, PAL.D3, PAL.D4, PAL.W4];
const SAND = [PAL.W4, PAL.W6, PAL.W7, PAL.W8];
const GLASS = [PAL.N5, PAL.C4, PAL.C7, PAL.C9];
/**
 * TTEMME's hourglass at (x, y) = top-left of its box (L 23 x 37, S 11 x 17). Upright front view: wooden caps and
 * two posts, the glass bulbs (outline, a specular streak), the sand.
 */
export const hourglass = (b: Buf, x: number, y: number, o: HourglassOpts = {}) => {
  const size = o.size ?? 'L', g = HG[size];
  const wood = o.wood ?? WOOD, sand = o.sand ?? SAND, glass = o.glass ?? GLASS;
  const N = hourglassGrains(size);
  const moved = clamp(Math.round(o.moved ?? 0), 0, N);
  if (o.pose === 'side') return hourglassSide(b, x, y, size, wood, sand, glass);
  const cx = x + Math.floor(g.w / 2), gy = y + g.glassTop;
  const cells = bulbCells(size);
  const sh = o.shatter;
  // posts (behind the glass)
  rect(x + 1, y + g.cap, g.post, g.h - 2 * g.cap, b.ink(wood[0]));
  rect(x + g.w - 1 - g.post, y + g.cap, g.post, g.h - 2 * g.cap, b.ink(wood[0]));
  if (size === 'L') { rect(x + 1, y + g.cap, 1, g.h - 2 * g.cap, b.ink(wood[1])); }
  // sand
  const topN = N - moved;
  const slump = sh === undefined ? 0 : sh < 15 ? 0 : Math.min(3, Math.floor((sh - 15) / 3) + 1);
  if (slump === 0) {
    for (let k = 0; k < topN; k++) { const [i, j] = cells.top[k]; b.set(cx + i, gy + j, sandShade(sand, i, j, cells.top, k, topN)); }
    for (let k = 0; k < moved; k++) { const [i, j] = cells.bot[k]; b.set(cx + i, gy + j, sandShade(sand, i, j, cells.bot, k, moved)); }
  } else {
    // the glass is gone and the sand gives up holding the shape: 3 drawings, sagging into a heap on the base
    heap(b, cx, y + g.h - g.cap, N, slump, size, sand);
  }
  // the running thread
  if (o.running && moved < N && topN > 0 && sh === undefined) {
    const mid = Math.floor((g.glassH - 1) / 2);
    const botTop = moved > 0 ? cells.bot[Math.max(0, moved - 1)][1] : g.glassH - 1;
    for (let j = mid; j < botTop; j++) b.set(cx, gy + j, sand[1]);
    const f = o.f ?? 0;
    const gj = mid + ((f >> 1) % Math.max(1, botTop - mid));
    b.set(cx, gy + gj, sand[3]);
  }
  // the glass: outline + a streak (gone once shattered)
  if (sh === undefined) {
    for (let j = 0; j < g.glassH; j++) {
      const hw = bulbHalf(g, j);
      b.set(cx - hw, gy + j, glass[1]); b.set(cx + hw, gy + j, glass[0]);
      if (hw >= 3 && j % 1 === 0 && ((j > 2 && j < g.glassH / 2 - 3) || (j > g.glassH / 2 + 3 && j < g.glassH - 3))) b.set(cx - hw + 1 + (size === 'L' ? 1 : 0), gy + j, j % 5 === 0 ? glass[3] : glass[2]);
    }
  } else shards(b, cx, gy, g, sh, glass);
  // caps (front)
  for (const cy of [y, y + g.h - g.cap]) {
    rect(x, cy, g.w, g.cap, b.ink(wood[1]));
    rect(x, cy, g.w, 1, b.ink(wood[2]));
    rect(x + 1, cy + g.cap - 1, g.w - 2, 1, b.ink(wood[0]));
    if (size === 'L') { b.set(x + 2, cy, wood[3]); b.set(x + 3, cy, wood[3]); }
  }
};
const sandShade = (sand: number[], i: number, j: number, cells: Array<[number, number]>, k: number, n: number) => {
  // the surface row (last filled) is lit; the right side is in shadow
  const surf = k >= n - Math.max(1, Math.round(n * 0.12));
  if (surf) return sand[2];
  return i > 1 ? sand[0] : i < -1 && (j & 1) ? sand[2] : sand[1];
};
const heap = (b: Buf, cx: number, baseY: number, n: number, stage: number, size: HGSize, sand: number[]) => {
  // stage 1: the bulb's shape sags; 2: a mound; 3: a wide low heap. Every drawing holds the same n grains: a
  // stepped triangle of slope s (px of half-width lost per row), the last row partial and centred (never a spike).
  const s = stage === 1 ? 0.6 : stage === 2 ? 1 : 2.2;
  const B = Math.max(2, Math.round(Math.sqrt(n * s)) - 1);
  let left = n;
  for (let j = 0; left > 0 && j < 60; j++) {
    const hw = Math.max(1, Math.round(B - j * s));
    const row = Math.min(left, hw * 2 + 1);
    const x0 = cx - Math.floor(row / 2);
    for (let i = 0; i < row; i++) {
      const u = (i - row / 2) / Math.max(1, row / 2);
      b.set(x0 + i, baseY - 1 - j, j === 0 ? sand[0] : u > 0.45 ? sand[0] : u < -0.35 ? sand[2] : sand[1]);
    }
    left -= row;
  }
  void size;
};
const shards = (b: Buf, cx: number, gy: number, g: HGGeo, k: number, glass: number[]) => {
  if (k >= 14) return;
  // every glass-outline pixel flies out on its own whole-px arc; at k = 0 the cracks show (<= 80% white)
  for (let j = 0; j < g.glassH; j++)
    for (const side of [-1, 1]) {
      const hw = bulbHalf(g, j);
      const x0 = cx + side * hw, y0 = gy + j;
      if (k === 0) { b.set(x0, y0, glass[2]); if (hash(j, side, 5) < 0.3) b.set(x0 - side, y0, glass[2]); continue; }
      if (hash(j, side, 6) < 0.35) continue;
      const vx = side * (1 + hash(j, side, 7) * 3), vy = -1.5 - hash(side, j, 8) * 2;
      const t = Math.floor(k / 1);
      const px = Math.round(x0 + vx * t), py = Math.round(y0 + vy * t + 0.35 * t * t);
      b.set(px, py, k < 5 ? glass[2] : glass[1]);
      if (k < 4 && hash(j, side, 9) < 0.5) b.set(px + side, py, glass[1]);
    }
};
const hourglassSide = (b: Buf, x: number, y: number, size: HGSize, wood: number[], sand: number[], glass: number[]) => {
  // the flip's middle drawing: the hourglass lying on its side (caps vertical), sand slumped along the low side.
  // Drawn at its own angle (never rotated from the upright drawing). Centred in the same box.
  const g = HG[size];
  const L = g.h, T = g.w; // it is now L wide, T tall, centred on the upright box
  const ox = x + Math.floor((g.w - L) / 2), oy = y + Math.floor((g.h - T) / 2);
  const cy = oy + Math.floor(T / 2);
  rect(ox + g.cap, oy + 1, L - 2 * g.cap, g.post, b.ink(wood[0]));
  rect(ox + g.cap, oy + T - 1 - g.post, L - 2 * g.cap, g.post, b.ink(wood[0]));
  for (let i = 0; i < g.glassH; i++) {
    const hw = bulbHalf(g, i);
    const X = ox + g.glassTop + i;
    // slumped sand along the bottom of both bulbs (the low side), 40% of the half-height
    for (let j = Math.max(0, hw - 1 - Math.round(hw * 0.55)); j <= hw - 1; j++) b.set(X, cy + j, j === hw - 1 ? sand[0] : sand[1]);
    b.set(X, cy - hw, glass[2]); b.set(X, cy + hw, glass[1]);
  }
  for (const cxp of [ox, ox + L - g.cap]) { rect(cxp, oy, g.cap, T, b.ink(wood[1])); rect(cxp, oy, 1, T, b.ink(wood[2])); }
};
/** The flip, as held drawings: k = frames since the hand starts it. Returns the pose + a hop (y offset). */
export const hourglassFlip = (k: number): {pose: 'upright' | 'side'; flipped: boolean; dy: number} => {
  if (k < 0) return {pose: 'upright', flipped: false, dy: 0};
  if (k < 3) return {pose: 'upright', flipped: false, dy: -3}; // lifted
  if (k < 7) return {pose: 'side', flipped: false, dy: -6};
  if (k < 9) return {pose: 'upright', flipped: true, dy: -3};
  if (k < 10) return {pose: 'upright', flipped: true, dy: 1}; // set down (a 1 px bump)
  return {pose: 'upright', flipped: true, dy: 0};
};

// ================================================================== the lobby sign
export interface SignOpts {
  /** the hung number (null = blank, the check-scene state). */
  days?: number | null;
  /** lighting: 0 off, 1 dim (the tube catching), 2 off again, 3 full. Use signLight(k) */
  lit?: 0 | 1 | 2 | 3;
}
export const SIGN_W = 132, SIGN_H = 46;
/** Light-up steps for a fluorescent light box (k = frames since the switch): off, dim, off, FULL (2 flashes). */
export const signLight = (k: number): 0 | 1 | 2 | 3 => (k < 0 ? 0 : k < 3 ? 1 : k < 5 ? 2 : 3);
/** A number plate: hung on two hooks, 16 x 22, a 14 px digit. (x, y) = top-left. */
export const digitPlate = (b: Buf, x: number, y: number, d: string, lit = true) => {
  const face = lit ? PAL.P2 : PAL.G2, ink = lit ? PAL.N1 : PAL.G1;
  rect(x, y, 16, 22, b.ink(PAL.N0));
  rect(x + 1, y + 1, 14, 20, b.ink(face));
  rect(x + 1, y + 20, 14, 1, b.ink(lit ? PAL.P0 : PAL.G1));
  b.set(x + 4, y + 2, PAL.G4); b.set(x + 11, y + 2, PAL.G4); // the hook holes
  bigText(b, d, x + Math.round((16 - bigTextWidth(d)) / 2), y + 5, ink);
};
/**
 * The light box 'DAYS SINCE SOMEONE TRIED TO FIRE MAS:' with its hung plates, 132 x 46. (x, y) = top-left.
 * Off: a dark panel, the lettering only a faint relief. Lit: the face glows paper-white, red header band.
 */
export const lobbySign = (b: Buf, x: number, y: number, o: SignOpts = {}) => {
  const lit = o.lit ?? 3;
  const on = lit === 3, dim = lit === 1;
  const face = on ? PAL.P2 : dim ? PAL.P0 : PAL.G1, ink = on ? PAL.N1 : dim ? PAL.G2 : PAL.G2;
  const band = on ? PAL.R2 : dim ? PAL.R1 : PAL.G0;
  // the frame and its wall shadow
  rect(x + 2, y + 2, SIGN_W, SIGN_H, b.ink(PAL.N0));
  rect(x, y, SIGN_W, SIGN_H, b.ink(PAL.G0));
  rect(x + 1, y + 1, SIGN_W - 2, SIGN_H - 2, b.ink(face));
  rect(x + 1, y + 1, SIGN_W - 2, 11, b.ink(band));
  const hdr = 'DAYS SINCE';
  text(b, hdr, x + 6, y + 3, on ? PAL.P2 : dim ? PAL.P0 : PAL.G1);
  text(b, 'SOMEONE TRIED', x + 6, y + 16, ink);
  text(b, 'TO FIRE MAS:', x + 6, y + 27, ink);
  // the plate well: a recessed box on the right with two hooks per plate
  const ds = o.days === null || o.days === undefined ? '' : String(o.days);
  const n = Math.max(1, ds.length);
  const wx = x + SIGN_W - 8 - n * 18, wy = y + 15;
  rect(wx - 2, wy - 2, n * 18 + 2, 26, b.ink(on ? PAL.P1 : PAL.G0));
  for (let i = 0; i < n; i++) {
    const px = wx + i * 18;
    b.set(px + 4, wy, PAL.G4); b.set(px + 11, wy, PAL.G4);
    if (ds) digitPlate(b, px, wy, ds[i], on || dim);
  }
  // the tube behind the face shows as a soft band when lit (a light box, not a screen)
  if (on) for (let i = x + 2; i < x + SIGN_W - 2; i++) if (bayer(i, y + SIGN_H - 3) < 0.5) b.set(i, y + SIGN_H - 3, PAL.P1);
};
/** The box of spare '0' plates (a maintenance hand sets it under the sign): an open carton, plates standing in it. */
export const zeroBox = (b: Buf, x: number, y: number) => {
  // plates first (behind the front flap), staggered
  for (let i = 0; i < 5; i++) {
    const px = x + 3 + i * 5, py = y - 10 + (i % 2) * 2;
    rect(px, py, 10, 14, b.ink(PAL.N0)); rect(px + 1, py + 1, 8, 12, b.ink(i === 4 ? PAL.P2 : PAL.P1));
    text(b, '0', px + 3, py + 3, PAL.N1);
  }
  // the carton: front face, a darker inside lip, one flap folded out, a marker '0' on the side
  rect(x, y, 34, 14, b.ink(PAL.D3));
  rect(x, y, 34, 1, b.ink(PAL.D4));
  rect(x, y + 13, 34, 1, b.ink(PAL.D1));
  rect(x - 5, y - 2, 6, 3, b.ink(PAL.D4)); rect(x - 5, y + 1, 6, 1, b.ink(PAL.D2));
  micro(b, '0 0 0', x + 9, y + 5, PAL.N1);
};

// ================================================================== tally marks (carved in wood)
/** A wood surface with long grain (for the ECU and the F1.2 dither-to-grain handoff). ramp dark -> light. */
export const woodGrain = (b: Buf, x: number, y: number, w: number, h: number, seed = 1, ramp: number[] = [PAL.D1, PAL.D2, PAL.D3, PAL.D4]) => {
  // long flowing grain: thin dark lines on a flat mid-tone (never plank stripes), a rare pale fleck; the grain swells
  // around one hidden knot (no drawn rings: at 4x they read as an object)
  const kx = x + Math.floor(hash(1, 2, seed) * w), ky = y + Math.floor(hash(2, 1, seed) * h);
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const X = x + i, Y = y + j;
      const dk = Math.hypot((X - kx) / 2.6, Y - ky);
      const flow = Y + 5 * Math.sin(X * 0.012 + seed) + 2 * Math.sin(X * 0.047 + Y * 0.02 + seed * 3) + (dk < 18 ? (18 - dk) * 0.35 * Math.sign(Y - ky || 1) : 0);
      const u = (flow / 5.1 + hash(0, Math.floor(flow / 5.1), seed) * 0.4) % 1;
      let k = 1;
      if (u < 0.1) k = 0;
      else if (u > 0.55 && u < 0.6 && hash(X >> 3, Math.floor(flow), seed + 2) < 0.5) k = 2;
      b.set(X, Y, ramp[k]);
    }
};
export interface TallyMark {
  /** top of the groove (surface px) */
  x: number; y: number;
  len: number;
  /** 'old' = shallow, faint, grime in it; 'new' = crisp */
  age: 'old' | 'new';
  /** 0..1 carve progress (new marks); old marks are always complete */
  carve?: number;
  /** a slight slant, px of x drift over the length (drawn as a stepped line) */
  lean?: number;
}
/**
 * Carve tally marks into whatever surface is already in `b` (ECU scale: marks 20-40 px long, 2 px wide). The groove is
 * two family steps darker, its lit lip one step lighter (so it lights like the desk it's in). A new mark grows in
 * whole-px steps from the top and throws curled shavings. Returns the carving tip [x, y] of the last new mark.
 */
export const tally = (b: Buf, marks: TallyMark[], o: {lit?: 'left' | 'right'; shavings?: 'curl' | 'pile'} = {}): [number, number] | null => {
  const pile = o.shavings === 'pile';
  const litDir = o.lit === 'left' ? -1 : 1;
  let tip: [number, number] | null = null;
  for (const m of marks) {
    const done = m.age === 'old' ? m.len : Math.round(m.len * clamp(m.carve ?? 1, 0, 1));
    const lean = m.lean ?? 0;
    for (let j = 0; j < done; j++) {
      const X = m.x + Math.round((lean * j) / Math.max(1, m.len)), Y = m.y + j;
      // taper: the ends of a carved groove are shallower
      const end = j < 2 || j > m.len - 3;
      if (m.age === 'old') {
        b.set(X, Y, stepColor(b.get(X, Y), end ? -1 : -2));
        if (!end && hash(X, Y, 4) < 0.5) b.set(X + 1, Y, stepColor(b.get(X + 1, Y), -1));
        if (hash(X, Y, 5) < 0.25) b.set(X - litDir, Y, stepColor(b.get(X - litDir, Y), 1));
      } else {
        // a clean V: the dark core, the shadowed wall, and the lit wall catching the light (2 rungs up: fresh wood)
        const lx = X + (litDir > 0 ? 2 : -1), sx2 = X + (litDir > 0 ? -1 : 2);
        b.set(X, Y, stepColor(stepColor(stepColor(b.get(X, Y), -2), end ? 0 : -1), -1));
        b.set(X + 1, Y, stepColor(b.get(X + 1, Y), -2));
        b.set(lx, Y, stepColor(stepColor(b.get(lx, Y), 1), end ? 0 : 1));
        if (!end) b.set(sx2, Y, stepColor(b.get(sx2, Y), -1));
      }
    }
    if (m.age === 'new' && done > 0 && (m.carve ?? 1) < 1) {
      const X = m.x + Math.round((lean * done) / Math.max(1, m.len)), Y = m.y + done;
      tip = [X, Y];
      // shavings at the tip: 'curl' (default, 26A.01) = one 1 px curl of wood only once the groove is nearly done;
      // 'pile' = light curls, 3-4 px each, one more every 5 px carved
      if (!pile && (m.carve ?? 1) >= 0.7) { const c2 = stepColor(stepColor(b.get(X + 2, Y - 1), 2), 1); b.set(X + 2, Y - 1, c2); b.set(X + 3, Y - 2, c2); }
      if (pile) for (let s = 0; s < Math.min(4, Math.floor(done / 5) + 1); s++) {
        const sx = X + 2 + (s % 2) * 3, sy = Y - 1 - s * 2;
        const c = stepColor(stepColor(b.get(sx, sy), 2), 1);
        b.set(sx, sy, c); b.set(sx + 1, sy - 1, c); b.set(sx + 2, sy, c);
      }
    }
    if (m.age === 'new' && (m.carve ?? 1) >= 1) {
      // done: the curl stays beside its end ('pile': a few loose shavings)
      const bits: ReadonlyArray<readonly [number, number]> = pile ? [[3, m.len - 2], [4, m.len - 5], [-2, m.len + 1]] : [[3, m.len - 1], [4, m.len - 2]];
      for (const [dx, dy] of bits) b.set(m.x + dx, m.y + dy, stepColor(stepColor(b.get(m.x + dx, m.y + dy), 2), 1));
    }
  }
  return tip;
};
/** Room-scale tally (a desk top in a wide): n marks, 1 px x 4 px, 2 px apart; the newest one brighter. */
export const tallyRoom = (b: Buf, x: number, y: number, n: number, o: {fresh?: boolean} = {}) => {
  for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) {
    const X = x + i * 3, Y = y + j;
    b.set(X, Y, stepColor(b.get(X, Y), i === n - 1 && o.fresh ? -2 : -1));
    if (i === n - 1 && o.fresh && j === 0) b.set(X + 1, Y, stepColor(b.get(X + 1, Y), 1));
  }
};

/** The MACROSOFT check pen, at the carving angle (clip down, toward the wood). (x, y) = the clip's tip. */
export const pen = (b: Buf, x: number, y: number) => {
  // body: a slate barrel (5 px, lit along its top) running up-right from the tip, a steel band, the clip along its
  // underside ending in the curl that does the carving. Drawn at this angle (never rotated).
  const body = [PAL.N3, PAL.N4, PAL.N6, PAL.N7, PAL.N8];
  for (let k = 0; k < 44; k++) {
    const bx = x + 4 + k, by = y - 4 - Math.floor(k * 0.6);
    for (let t = 0; t < 5; t++) b.set(bx, by - t, k > 28 && k < 32 ? (t > 2 ? PAL.G6 : PAL.G4) : body[t]);
    if (k === 43) for (let t = 0; t < 5; t++) b.set(bx + 1, by - t + 1, PAL.N2);
  }
  // the steel clip: a 2 px strip from the band down to the tip, a glint every few px, the curled end in the wood
  for (let k = 0; k < 28; k++) {
    const cx = x + 3 + k, cy = y - 1 - Math.floor(k * 0.6);
    b.set(cx, cy, k % 7 === 3 ? PAL.C9 : PAL.G6); b.set(cx, cy + 1, PAL.G3);
  }
  b.set(x + 2, y, PAL.G6); b.set(x + 1, y + 1, PAL.C8); b.set(x + 1, y, PAL.G4); b.set(x, y + 1, PAL.G5);
};

// ================================================================== cartoon fires
export type FireSize = 'S' | 'M' | 'L';
const FIRE_DIM: Record<FireSize, [number, number]> = {S: [9, 13], M: [13, 19], L: [19, 27]};
const fireCache = new Map<string, Int8Array>();
/**
 * Flame drawing k (0..2): a round-bottomed body plus three pointed tongues whose heights and tips swap per drawing,
 * then layered by distance from the edge (1 = the red lick outline, 2 = orange, 3+ = yellow, deep = white-hot core).
 * Returns per-pixel layer (0 = empty) for a w x h box, bottom row = the base.
 */
const flameLayers = (size: FireSize, k: number): Int8Array => {
  const key = size + k;
  const hit = fireCache.get(key);
  if (hit) return hit;
  const [w, h] = FIRE_DIM[size];
  const inside = new Uint8Array(w * h);
  const r = w * 0.44, bcx = (w - 1) / 2, bcy = h - 1 - r * 0.85;
  const TIPS = [[0.62, 1.0, 0.7], [0.74, 0.86, 0.9], [0.55, 0.96, 0.8]][k];
  const SWAY = [[-1, 0, 1], [0, 1, 1], [-1, -1, 0]][k];
  const tongues = [0.27, 0.5, 0.73].map((c, i) => ({c: c * (w - 1), bw: w * (i === 1 ? 0.26 : 0.17), tip: h * TIPS[i], sw: SWAY[i] * (size === 'S' ? 1 : 2)}));
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const y = h - 1 - j; // height above the base
      let on = Math.hypot((i - bcx) / r, (j - bcy) / (r * 0.95)) <= 1 && j >= bcy - r * 0.2 ? true : false;
      if (j > bcy && Math.abs(i - bcx) <= w * 0.42 - (j > h - 2 ? 1 : 0)) on = true;
      for (const t of tongues) {
        const base = h - 1 - bcy; // tongues rise from the body's middle
        if (y < base * 0.6 || y > t.tip) continue;
        const u = (y - base * 0.6) / Math.max(1, t.tip - base * 0.6);
        const cx = t.c + t.sw * u * u;
        if (Math.abs(i - cx) <= t.bw * (1 - u) + 0.35) on = true;
      }
      inside[j * w + i] = on ? 1 : 0;
    }
  // distance to the outside (4-neighbour chamfer, 2 passes)
  const d = new Int8Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) d[j * w + i] = inside[j * w + i] ? 99 : 0;
  const at = (i: number, j: number) => (i < 0 || i >= w || j < 0 ? 0 : j >= h ? 99 : d[j * w + i]);
  for (let p = 0; p < 2; p++) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (d[j * w + i]) d[j * w + i] = Math.min(d[j * w + i], at(i - 1, j) + 1, at(i, j - 1) + 1);
    for (let j = h - 1; j >= 0; j--) for (let i = w - 1; i >= 0; i--) if (d[j * w + i]) d[j * w + i] = Math.min(d[j * w + i], at(i + 1, j) + 1, at(i, j + 1) + 1);
  }
  fireCache.set(key, d);
  return d;
};
/**
 * A cartoon fire standing on (x, y) = base centre. 3 drawings looped on 4s (A B C), f drives it; `seed` offsets the
 * loop so fires in one room don't pulse together. A red lick outline, orange body, yellow core, a white-hot heart on
 * M/L (W8, never a flash). `glow` steps the surface under it one rung warmer (background only).
 */
export const fire = (b: Buf, x: number, y: number, size: FireSize, f: number, o: {seed?: number; glow?: boolean} = {}) => {
  const seed = o.seed ?? 0;
  const k = (Math.floor(f / 4) + seed) % 3;
  const [w, h] = FIRE_DIM[size];
  const L = flameLayers(size, k);
  const x0 = x - Math.floor(w / 2), y0 = y - h;
  if (o.glow) {
    const rr = w * 1.3;
    for (let j = -4; j <= 2; j++) for (let i = -Math.ceil(rr); i <= Math.ceil(rr); i++) {
      const dd = Math.hypot(i / rr, j / 4);
      if (dd < 1 && bayer(x + i, y + j) < (1 - dd) * 0.85) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), 1));
    }
  }
  const deep = size === 'S' ? 4 : size === 'M' ? 5 : 6;
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const dv = L[j * w + i];
      if (!dv) continue;
      const low = j > h * 0.45;
      const c = dv === 1 ? (j < h * 0.35 ? PAL.R2 : PAL.R3) : dv === 2 ? PAL.W5 : dv >= deep && low ? PAL.W8 : dv >= 3 ? PAL.W7 : PAL.W6;
      b.set(x0 + i, y0 + j, dv === 3 && !low ? PAL.W6 : c);
    }
  // a spark flicks off a tongue on the middle drawing
  if (k === 1) b.set(x + (seed % 2 ? 2 : -2), y0 - 2, PAL.W7);
};
/** Putting a fire out: k = frames since the spray hits. L -> M -> S -> ember -> smoke puff, held on 3s. */
export const fireOut = (b: Buf, x: number, y: number, from: FireSize, f: number, k: number) => {
  const seq: Array<FireSize | 'ember' | 'smoke' | null> = from === 'L' ? ['L', 'M', 'S', 'ember', 'smoke', 'smoke'] : from === 'M' ? ['M', 'S', 'ember', 'smoke', 'smoke'] : ['S', 'ember', 'smoke', 'smoke'];
  const st = k < 0 ? from : seq[Math.floor(k / 3)] ?? null;
  if (!st) return;
  if (st === 'ember') { b.set(x, y - 1, PAL.W6); b.set(x - 1, y - 1, PAL.R2); b.set(x + 1, y - 1, PAL.W4); return; }
  if (st === 'smoke') {
    const s = Math.floor(k / 3) - seq.indexOf('smoke');
    for (let i = 0; i < 9; i++) { const px = x - 3 + (i % 3) * 3 + (s % 2), py = y - 4 - Math.floor(i / 3) * 3 - s * 3; if (hash(i, s, 3) < 0.7) { b.set(px, py, PAL.G4); b.set(px + 1, py, PAL.G3); } }
    return;
  }
  fire(b, x, y, st, f);
};

/** The extinguisher's spray: a white cone of puffs from (x, y) toward dir, growing for 6 frames, then held. */
export const spray = (b: Buf, x: number, y: number, dir: 1 | -1, k: number, len = 46) => {
  if (k < 0) return;
  const reach = Math.min(len, 8 + k * 7);
  for (let d = 0; d < reach; d++) {
    const half = 1 + d * 0.28;
    for (let j = -Math.ceil(half); j <= Math.ceil(half); j++) {
      const px = x + dir * d, py = y + j + Math.round(d * 0.12);
      const edge = Math.abs(j) > half - 1;
      if (bayer(px + k, py) < (edge ? 0.3 : 0.7) * (1 - d / (len * 1.3))) b.set(px, py, d < 6 ? PAL.P2 : edge ? PAL.G5 : PAL.P1);
    }
  }
};

/** The extinguisher pin and its tamper tag, readable: DO NOT REMOVE. (x, y) = the ring's top-left. Insert scale. */
export const pinTag = (b: Buf, x: number, y: number) => {
  // the ring (2 px steel), the pin shaft, a tie of plastic to the tag
  ellipse(x + 5, y + 5, 5, 5, b.ink(PAL.G5)); ellipse(x + 5, y + 5, 3, 3, b.ink(PAL.N0));
  b.set(x + 2, y + 2, PAL.C9); b.set(x + 3, y + 1, PAL.G6);
  rect(x + 10, y + 5, 16, 2, b.ink(PAL.G5)); rect(x + 10, y + 5, 16, 1, b.ink(PAL.G6));
  line(x + 24, y + 7, x + 28, y + 14, b.ink(PAL.R2));
  // the tag: a yellow card, a punched hole, red lettering in two lines (7 px, must-read)
  const tx = x + 20, ty = y + 14, tw = 50, th = 23;
  rect(tx + 1, ty + 1, tw, th, b.ink(PAL.N0));
  rect(tx, ty, tw, th, b.ink(PAL.W7));
  rect(tx, ty, tw, 1, b.ink(PAL.W8)); rect(tx, ty + th - 1, tw, 1, b.ink(PAL.W5));
  ellipse(tx + 8, ty + 3, 1.5, 1.5, b.ink(PAL.N0));
  text(b, 'DO NOT', tx + Math.round((tw - textWidth('DO NOT')) / 2), ty + 4, PAL.R1);
  text(b, 'REMOVE', tx + Math.round((tw - textWidth('REMOVE')) / 2), ty + 13, PAL.R1);
};

// ================================================================== the GUEST lanyard
/**
 * The GUEST badge + lanyard (the design Radnus hands the founders at 3:20; the same one Mas wears Nov 19 and frames
 * in the tag). A plain white card, a red header band, GUEST in 14 px ink, a blank photo square, a barcode strip;
 * a flat red strap with a steel clip. Nothing on it is a real brand.
 *   'insert'  readable: the card 64 x 42 with ~30 px of strap above it (x, y = the card's top-left)
 *   'desk'    the coiled prop lying beside a glass (room/medium scale, ~44 x 14; micro lettering)
 */
export const guestBadge = (b: Buf, x: number, y: number, scale: 'insert' | 'desk' = 'insert', o: {strap?: boolean} = {}) => {
  const strap = [PAL.R1, PAL.R2, PAL.R3];
  if (scale === 'desk') {
    // the strap lies in a loose coil (a stepped oval), the card flat at its end, GUEST in micro caps
    for (let a = 0; a < 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const px = Math.round(x + 10 + Math.cos(t) * 10), py = Math.round(y + 7 + Math.sin(t) * 4);
      b.set(px, py, Math.sin(t) < 0 ? strap[1] : strap[0]); b.set(px, py + 1, strap[0]);
    }
    // (Act Four v5 art pass, a4p5: the card was 15 px for a 19 px word, so its clip covered the G and the T ran off
    // the card: it read "UES". The card is now the word's width + 4, the clip sits on the strap left of it. Only the
    // stills sheets draw 'desk'; no v4 shot does.)
    const cw = microWidth('GUEST') + 4, cx0 = x + 20;
    rect(cx0 + 1, y + 3, cw, 10, b.ink(PAL.N0));
    rect(cx0, y + 2, cw, 10, b.ink(PAL.P1));
    rect(cx0, y + 2, cw, 2, b.ink(PAL.R2));
    micro(b, 'GUEST', cx0 + 2, y + 5, PAL.N1);
    rect(cx0 - 3, y + 6, 3, 2, b.ink(PAL.G5)); b.set(cx0 - 3, y + 6, PAL.G6);
    return;
  }
  const W = 64, Hh = 42;
  if (o.strap !== false) {
    // the strap: two flat bands rising to the clip, stepped 3 px ribbons with a lit edge
    for (let k = 0; k < 24; k++) {
      const lx = x + 22 - Math.floor(k * 0.45), rx = x + W - 25 + Math.floor(k * 0.45), yy = y - 8 - k;
      rect(lx, yy, 3, 1, b.ink(strap[1])); b.set(lx, yy, strap[2]);
      rect(rx, yy, 3, 1, b.ink(strap[0])); b.set(rx + 2, yy, strap[1]);
    }
    line(x + 23, y - 8, x + W / 2 - 3, y - 6, b.ink(strap[1]));
    line(x + W - 24, y - 8, x + W / 2 + 2, y - 6, b.ink(strap[0]));
    // the clip + the ring
    rect(x + W / 2 - 4, y - 7, 8, 4, b.ink(PAL.G4)); rect(x + W / 2 - 4, y - 7, 8, 1, b.ink(PAL.G6));
    b.set(x + W / 2 - 3, y - 6, PAL.C9);
    rect(x + W / 2 - 1, y - 3, 2, 5, b.ink(PAL.G5));
  }
  // the card: a slot punch, a red band, GUEST (14 px ink), a rule, a blank photo square and a barcode
  rect(x + 1, y + 1, W, Hh, b.ink(PAL.N0));
  rect(x, y, W, Hh, b.ink(PAL.P2));
  rect(x + W - 1, y, 1, Hh, b.ink(PAL.P1)); rect(x, y + Hh - 1, W, 1, b.ink(PAL.P0));
  rect(x + W / 2 - 6, y + 2, 12, 2, b.ink(PAL.N1));
  rect(x, y + 5, W, 7, b.ink(PAL.R2));
  rect(x, y + 5, W, 1, b.ink(PAL.R3));
  bigText(b, 'GUEST', x + Math.round((W - bigTextWidth('GUEST')) / 2), y + 15, PAL.N1);
  rect(x + 4, y + 15 + BIG_CAP + 2, W - 8, 1, b.ink(PAL.P0));
  rect(x + 4, y + 33, 7, 6, b.ink(PAL.P1)); rect(x + 6, y + 34, 3, 2, b.ink(PAL.P0)); rect(x + 5, y + 36, 5, 3, b.ink(PAL.P0));
  for (let i = 0; i < 44; i++) if (hash(i, 0, 77) < 0.62) rect(x + 15 + i, y + 33, 1, 6, b.ink(PAL.N2));
};
/** The badge worn at room scale (a 74-78 px figure): a 1 px strap V from neck to chest and a 3 x 4 card. */
export const guestWorn = (b: Buf, neckL: [number, number], neckR: [number, number], card: [number, number]) => {
  line(neckL[0], neckL[1], card[0] + 1, card[1], b.ink(PAL.R2));
  line(neckR[0], neckR[1], card[0] + 1, card[1], b.ink(PAL.R1));
  rect(card[0], card[1], 3, 4, b.ink(PAL.P2));
  rect(card[0], card[1], 3, 1, b.ink(PAL.R2));
};
