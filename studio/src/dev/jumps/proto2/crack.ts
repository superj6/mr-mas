// RETIRED (fix pass, 2026-09-25): the first and second builds' fracture. However it was routed, one long jagged line
// across the skyline read as a price chart. Kept for the record only; nothing in the build imports it. The build uses
// seam.ts (variant B, ships) and glass.ts (variant A, kept as a still). See style-jumps §5.2.
// MR. MAS — style jump prototype 2 · THE CRACK (style-jumps §3.3 "Crack" / "Seal"; §5.2 "New").
// A deterministic fracture on the native grid: whole-pixel segments, no flat run longer than 6 px (X3: a crack that
// lies flat reads as a flatline).
//
// Polish pass (critic: "the shape is a chart"). One long jagged line across the frame reads as a price chart however
// it is routed, and it is drawn like one. So the crack is a FRACTURE now: it nucleates on the wall between the door and
// the rack and branches three ways at once, like a break under stress:
//   - the MAIN arm runs left over the door's head, drops down the window's right trim and runs THROUGH the buildings
//     (never floating in the open sky above them: a line over a skyline reads as a line chart over a bar chart), under
//     the Orb, and passes BEHIND his head (its tip is hidden by his figure: never aimed at his temple or a face)
//   - arm B runs right and a little down to the frame's edge over the rack
//   - arm C (short) runs up the wall and dies in the plaster, well short of the top edge
// Nothing branches off the top of the picture (a branch from the top edge reads as a bolt from the sky).
// It opens widest at the nucleus, ON THE WALL (x ~340-400): sky seen inside a wall proves the picture is a surface.
// Second widest where it drops into the buildings: the same city continues, soft, behind the pixel city. Narrow across
// the open sky, where a wide bright seam read as lightning.
//
// The gap is the crack OPENING: the pixel surface parts along it. Each face keeps the crack's own jagged edge, so the
// gap is the path extruded ACROSS its local run (vertically where it runs flat, horizontally where it runs steep),
// whole pixels wide, tapering to 1 px at the tips. Everything here is whole pixels: the pixel side of the seam steps;
// only the far side is continuous. It never cuts through his figure or the Orb (both stand in front of the surface).
import {hash} from '../../../shared/pixel/px';
import {DPLATE} from '../../../shared/pixel/rooms/darkroom-plate';
import {T} from './timing';

export interface CrackPx { x: number; y: number; /** 0..1 along its branch */ u: number; /** the local run is steep */ steep: boolean }
/** a side arm from the nucleus: grows from p0 to p1; `w` = its root width relative to the main arm's widest */
export interface Arm { px: CrackPx[]; w: number; p0: number; p1: number }
export interface Crack {
  /** the main arm, from the nucleus to the tip behind his head (growth order) */
  main: CrackPx[];
  arms: Arm[];
  /** every side-arm pixel (for the checks) */
  fork: CrackPx[];
  nucleus: [number, number];
}

const NW = 480;
export const NUCLEUS: [number, number] = [382, 40];

/** Bresenham between two integer points, appended (without repeating the start) */
const seg = (out: Array<[number, number]>, x0: number, y0: number, x1: number, y1: number) => {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
    out.push([x, y]);
  }
};

/**
 * A jagged run from a to b: short whole-pixel segments with a random lean, never more than 6 px flat, pulled toward
 * the target so it always arrives. `steep` = the run is mostly vertical (the fork).
 */
const jag = (out: Array<[number, number]>, a: [number, number], b: [number, number], seed: number, steep = false) => {
  let [x, y] = a;
  let k = 0;
  while ((steep ? Math.abs(b[1] - y) : Math.abs(b[0] - x)) > 0 && k < 400) {
    const r1 = hash(k, 1, seed), r2 = hash(k, 2, seed), r3 = hash(k, 3, seed);
    if (!steep) {
      const left = Math.abs(b[0] - x);
      let dx = Math.min(left, 2 + Math.floor(r1 * 5)); // 2..6 px along
      if (dx === 0) break;
      const want = ((b[1] - y) / left) * dx; // the slope that arrives
      // a kink every segment: the lean alternates with a random bite, so no run lies flat
      let dy = Math.round(want + (r2 - 0.5) * 5 + (k % 2 ? 1 : -1) * (r3 < 0.55 ? 1 : 0));
      if (dy === 0 && dx > 3) dy = r3 < 0.5 ? 1 : -1;
      if (left - dx < 2) { dx = left; dy = b[1] - y; }
      const nx = x - dx * Math.sign(x - b[0] || 1), ny = y + dy;
      seg(out, x, y, nx, ny);
      x = nx; y = ny;
    } else {
      const left = Math.abs(b[1] - y);
      let dy = Math.min(left, 2 + Math.floor(r1 * 4));
      if (dy === 0) break;
      const want = ((b[0] - x) / left) * dy;
      let dx = Math.round(want + (r2 - 0.5) * 4);
      if (left - dy < 2) { dy = left; dx = b[0] - x; }
      const ny = y - dy * Math.sign(y - b[1] || 1), nx = x + dx;
      seg(out, x, y, nx, ny);
      x = nx; y = ny;
    }
    k++;
  }
};

/**
 * A fracture's walk from a to b: short straight runs (3-9 px) whose bearing swings 25-60 degrees off the line to the
 * target, alternating sides, so the path is angular like a break in plaster or glass (a trend line with noise is what
 * read as a chart). Pulled home so it always arrives.
 */
const fracture = (out: Array<[number, number]>, a: [number, number], b: [number, number], seed: number) => {
  let [x, y] = a;
  let side = hash(seed, 1, 7) < 0.5 ? 1 : -1;
  for (let k = 0; k < 200; k++) {
    const dx = b[0] - x, dy = b[1] - y, dist = Math.hypot(dx, dy);
    if (dist < 1) break;
    const r1 = hash(k, 1, seed), r2 = hash(k, 2, seed);
    const len = Math.min(dist, 3 + Math.floor(r1 * 7));
    // swing off the target bearing; less as it closes in, so it lands
    const swing = (25 + r2 * 35) * (Math.PI / 180) * Math.min(1, dist / 18) * side;
    if (hash(k, 3, seed) < 0.8) side = -side;
    const th = Math.atan2(dy, dx) + swing;
    let nx = Math.round(x + Math.cos(th) * len), ny = Math.round(y + Math.sin(th) * len);
    if (dist <= len + 1) { nx = b[0]; ny = b[1]; }
    if (nx === x && ny === y) { nx = b[0]; ny = b[1]; }
    seg(out, x, y, nx, ny);
    x = nx; y = ny;
  }
};

/** dedupe, kill flat runs > 6 px (a one-pixel kink in the middle), then tag each pixel's local run as steep or not */
const finish = (pts: Array<[number, number]>, taken?: Set<number>): CrackPx[] => {
  const seen = new Set<number>();
  const xy = pts.filter(([x, y]) => { const k = y * NW + x; if (seen.has(k) || (taken && taken.has(k))) return false; seen.add(k); return true; });
  for (let pass = 0; pass < 8; pass++) {
    let changed = false;
    for (let s = 0; s < xy.length; ) {
      let e = s;
      while (e + 1 < xy.length && xy[e + 1][1] === xy[s][1]) e++;
      if (e - s + 1 > 6) {
        const dir = hash(s, 9, 555) < 0.5 ? -1 : 1;
        for (let i = s + 3; i <= e - 3; i++) xy[i] = [xy[i][0], xy[i][1] + dir];
        changed = true;
      }
      s = e + 1;
    }
    if (!changed) break;
  }
  return xy.map(([x, y], i) => {
    const a = xy[Math.max(0, i - 3)], b = xy[Math.min(xy.length - 1, i + 3)];
    return {x, y, u: i / Math.max(1, xy.length - 1), steep: Math.abs(b[1] - a[1]) > Math.abs(b[0] - a[0]) * 1.2};
  });
};
const route = (W: Array<[number, number]>, seed: number) => {
  const pts: Array<[number, number]> = [W[0]];
  for (let i = 0; i + 1 < W.length; i++) fracture(pts, pts[pts.length - 1], W[i + 1], seed + i * 17);
  return pts;
};
void jag;

/** Build the crack for a head mask (the union of his head drawings: the tip ends hidden behind his head). */
export const buildCrack = (head: Uint8Array): Crack => {
  // the tip: behind the back of his skull at ear level. It lies inside his silhouette, so the line goes behind him.
  const tipY = 70;
  let hx0 = NW, hx1 = 0;
  for (let x = 0; x < NW; x++) if (head[tipY * NW + x]) { hx0 = Math.min(hx0, x); hx1 = Math.max(hx1, x); }
  const tip: [number, number] = [Math.round(hx1 - (hx1 - hx0) * 0.4), tipY];
  const win = DPLATE.win;
  const N = NUCLEUS;
  // the main arm: left over the door's head, a steep drop down the window's right trim, then THROUGH the buildings
  // (never floating in the open sky above them, where a line over a skyline reads as a line chart over a bar chart),
  // under the Orb, and behind him
  const main = finish(route([N, [350, 46], [win.x1 + 5, 54], [win.x1 - 3, 72], [268, 82], [238, 94], [210, 95], [182, 88], [hx1 + 6, 74], tip], 101));
  const taken = new Set(main.map((q) => q.y * NW + q.x));
  // arm B: right and a little DOWN, over the rack, to the frame's edge (a right end higher than the left made the whole
  // break read as a rising line)
  const armB = finish(route([N, [414, 58], [446, 64], [479, 80]], 301), taken);
  armB.forEach((q) => taken.add(q.y * NW + q.x));
  // arm C (short): up the wall; it dies in the plaster above the door, well short of the frame's top edge
  const armC = finish(route([N, [372, 26], [377, 15]], 401), taken);
  const arms: Arm[] = [
    {px: armB, w: 0.7, p0: T.crack, p1: T.crack + 9},
    {px: armC, w: 0.45, p0: T.crack + 2, p1: T.crack + 8},
  ];
  return {main, arms, fork: [...armB, ...armC], nucleus: N};
};

// ------------------------------------------------------------------ growth (p30-49)
/** how many pixels of the main arm exist at clip frame p: a fast run for 12 frames, then a creep behind his head */
export const mainGrown = (c: Crack, p: number) => {
  const L = c.main.length;
  if (p < T.crack) return 0;
  if (p >= T.tipEnd) return L;
  const creep = 26;
  const k = p - T.crack; // 0..18
  if (k < 12) {
    // eased out a touch: the fracture is fastest where it starts
    const t = (k + 1) / 12;
    return Math.round((L - creep) * (1 - Math.pow(1 - t, 1.35)));
  }
  const t = (k - 11) / (T.tipEnd - T.crack - 11);
  return Math.round(L - creep + creep * (1 - Math.pow(1 - t, 1.6)));
};
/** how many pixels of a side arm exist at frame p */
export const armGrown = (a: Arm, p: number) => {
  if (p < a.p0) return 0;
  const t = Math.min(1, (p - a.p0 + 1) / (a.p1 - a.p0 + 1));
  return Math.round(a.px.length * (1 - Math.pow(1 - t, 1.4)));
};
/** the tip of the main arm at frame p */
export const tipAt = (c: Crack, p: number): [number, number] => {
  const n = mainGrown(c, p);
  const q = c.main[Math.max(0, Math.min(c.main.length - 1, n - 1))];
  return [q.x, q.y];
};

// ------------------------------------------------------------------ the opening
/**
 * The local gap width along the main arm for a given widest width W: widest at the nucleus on the wall, a second
 * chamber where it drops into the buildings, narrow across the open sky, 1 px at the tip. A little irregular.
 */
export const CHAMBERS = {wall: {x: NUCLEUS[0] - 14, w: 36, k: 1}, city: {x: 252, y: 88, r: 16, k: 0.75}};
const mainProfile = (c: Crack, i: number) => {
  const q = c.main[i];
  const A = CHAMBERS.wall, B = CHAMBERS.city;
  let s = Math.max(A.k * Math.exp(-(((q.x - A.x) / A.w) ** 2)), B.k * Math.exp(-((Math.hypot(q.x - B.x, q.y - B.y) / B.r) ** 2)));
  s *= Math.min(1, (q.x - c.main[c.main.length - 1].x) / 34); // to 1 px at the tip
  const a = i / 14, i0 = Math.floor(a), fr = a - i0, sm = fr * fr * (3 - 2 * fr);
  const nz = hash(i0, 5, 61) * (1 - sm) + hash(i0 + 1, 5, 61) * sm;
  return Math.max(0, Math.min(1, s * (0.6 + 0.7 * nz)));
};
const armProfile = (u: number, w: number) => w * Math.pow(1 - u, 0.9) + 0.04;

/** the gap mask (native, rows 0..202) for widest width w: 255 = the far side shows through. `occ` = his figure and
 *  the Orb, which stand in front of the surface: the gap never cuts them. */
export const gapMask = (c: Crack, w: number, p: number, occ?: Uint8Array): Uint8Array => {
  const m = new Uint8Array(NW * 270);
  if (w <= 0) return m;
  const put = (x: number, y: number) => { if (x >= 0 && y >= 0 && x < NW && y < 203 && !(occ && occ[y * NW + x])) m[y * NW + x] = 255; };
  const wOf = (s: number) => Math.max(1, Math.round(1 + (w - 1) * s));
  const extrude = (q: CrackPx, lw: number) => {
    const a = Math.floor((lw - 1) / 2), b = lw - 1 - a;
    for (let d = -a; d <= b; d++) (q.steep ? put(q.x + d, q.y) : put(q.x, q.y + d));
  };
  const nMain = mainGrown(c, p);
  for (let i = 0; i < nMain; i++) {
    const q = c.main[i];
    const lw = w <= 1 ? 1 : wOf(mainProfile(c, i));
    extrude(q, lw);
    // chips: a face's broken edge loses a short run of pixels here and there (whole pixels, a notch never a drip)
    if (lw >= 4 && hash(i >> 2, 7, 313) < 0.2 && (i & 3) !== 3) {
      const a = Math.floor((lw - 1) / 2);
      q.steep ? put(q.x - a - 1, q.y) : put(q.x, q.y - a - 1);
    }
  }
  for (const arm of c.arms) {
    const n = armGrown(arm, p);
    for (let i = 0; i < n; i++) extrude(arm.px[i], w <= 1 ? 1 : wOf(armProfile(arm.px[i].u, arm.w)));
  }
  return m;
};

/**
 * The scar: what the seal leaves, a 1 px pixel line ONLY where the surface was breached widest (the wall chamber and
 * the arms' roots). The thin run through the city heals clean. (Polish pass: a hairline spanning the frame kept the
 * chart pun on screen for the rest of the scene; a short jagged mark on the wall reads as damage.)
 */
export const scarPixels = (c: Crack): CrackPx[] => [
  ...c.main.filter((_, i) => mainProfile(c, i) >= 0.42),
  ...c.arms.flatMap((a) => a.px.filter((q) => q.u < 0.55)),
];

/** every pixel of the crack grown by frame p */
export const pathPixels = (c: Crack, p: number): CrackPx[] => [...c.main.slice(0, mainGrown(c, p)), ...c.arms.flatMap((a) => a.px.slice(0, armGrown(a, p)))];

/** The frames on which the main arm's growing tip turns a corner (a y-reversal), with the corner's x: where the few
 *  dry micro-cracks sit in the sound (one per corner, not one per frame). */
export const kinkTimes = (c: Crack): Array<{p: number; x: number}> => {
  const idx: number[] = [];
  let dir = 0;
  for (let i = 4; i < c.main.length; i++) {
    const dy = c.main[i].y - c.main[i - 4].y;
    const d = dy > 1 ? 1 : dy < -1 ? -1 : 0;
    if (d !== 0 && dir !== 0 && d !== dir && (idx.length === 0 || i - idx[idx.length - 1] > 12)) idx.push(i - 2);
    if (d !== 0) dir = d;
  }
  const out: Array<{p: number; x: number}> = [];
  for (const i of idx) {
    let p = T.crack;
    while (p < T.tipEnd && mainGrown(c, p) <= i) p++;
    if (!out.length || p > out[out.length - 1].p) out.push({p, x: c.main[i].x});
  }
  return out;
};
