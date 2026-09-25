// MR. MAS — shared kit: THE FALLING STACK (the heart avalanche + the tile avalanche) and the counters.
//
// "Scale by repetition": every falling thing is ONE held drawing (a heart sprite, a face tile) dropped on whole
// pixels; hundreds of them make the spectacle. Two deterministic planners, both precomputed once (memoise the plan,
// then any frame is O(n)):
//
//   planGridStack  puzzle-piece tiles into slots (the tile avalanche, sc 29): fills bottom-up with a ragged front,
//                  never lands a tile before the one under it, respects reserved rects (the board's tiles) and can
//                  open a reserve later (the tile that was shoved off gets filled). Stacking pushes: each landing
//                  kicks the tile under it 1 px (a held drawing, not a squash).
//   planPile       free-falling hearts into a staggered lattice (the heart avalanche, sc 27): they pour, pile, bury.
//                  Exactly one blue heart can be scheduled last: it drifts down slowly and lands on a target.
//
// Also: shove (a board tile pressed, resisting one beat, sliding off the edge), scatter (footnotes flying off like
// sparks), odometer (the launch-night drums, rolling 505 . 650 . 700 . 745 / 770 and stopping with a clunk), heart
// sprites (drawHeart, salvaged from the cut intro slot) and a reactions counter chip.
import {Buf, rect, hash, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {micro} from '../cast/bosses';

// ================================================================== hearts (salvage: callart.ts)
const HEARTS: string[][] = [
  ['#'],
  ['#.#', '###', '.#.'],
  ['##.##', '#####', '#####', '.###.', '..#..'],
  ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  ['.###.###.', '#########', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'],
  ['..###.###..', '.#########.', '###########', '###########', '###########', '.#########.', '..#######..', '...#####...', '....###....', '.....#.....'],
];
export const HEART_W = [1, 3, 5, 7, 9, 11];
export const HEART_H = HEARTS.map((m) => m.length);
/** Heart ramps: [shadow, body, light, spec]. RED for everyone; BLUE for exactly one. */
export const RED = [PAL.R1, PAL.R2, PAL.R3, PAL.W8];
export const BLUE = [PAL.C3, PAL.C5, PAL.C7, PAL.C9];
/** size 0..5 (1 px star .. 11 px heart), lit from the top-left. (x, y) = top-left. */
export const drawHeart = (b: Buf, x: number, y: number, size: number, ramp: number[] = RED) => {
  const m = HEARTS[clamp(size, 0, 5)];
  const H = m.length, Wd = m[0].length;
  for (let j = 0; j < H; j++)
    for (let i = 0; i < Wd; i++) {
      if (m[j][i] !== '#') continue;
      let c = ramp[1];
      if (size >= 2) {
        const u = i / (Wd - 1), v = j / (H - 1);
        const edgeR = i === Wd - 1 || m[j][i + 1] !== '#', edgeB = j === H - 1 || m[j + 1][i] !== '#';
        if (u + v > 1.15 || (edgeR && u > 0.5) || (edgeB && v > 0.5)) c = ramp[0];
        if (size >= 3 && u < 0.4 && v < 0.4 && u + v < 0.5 && u + v > 0.12) c = ramp[2];
        if (size >= 3 && Math.abs(u - 0.22) < 0.1 && Math.abs(v - 0.2) < 0.12) c = ramp[3];
      } else if (size === 1 && j === 0) c = ramp[2];
      b.set(x + i, y + j, c);
    }
};

// ================================================================== fall timing (shared)
/** Whole-pixel fall: accelerates at `g` px/frame^2 to `vmax`, positions updated on 2s (a held fall, not a slide). */
const fallDist = (t: number, g: number, vmax: number) => {
  const ta = vmax / g;
  return t <= ta ? 0.5 * g * t * t : 0.5 * g * ta * ta + vmax * (t - ta);
};
const fallTime = (d: number, g: number, vmax: number) => {
  const ta = vmax / g, da = 0.5 * g * ta * ta;
  return d <= da ? Math.sqrt((2 * d) / g) : ta + (d - da) / vmax;
};

// ================================================================== the tile avalanche (grid slots)
export interface Reserve {
  /** slot rect (cols / rows, inclusive-exclusive) */
  c: number; r: number; w: number; h: number;
  /** when its slots may be filled (a shoved-off tile's hole). Default never */
  openAt?: number;
}
export interface GridStackOpts {
  /** top-left of the slot grid (screen px) */
  x0: number; y0: number;
  cols: number; rows: number;
  /** slot pitch [w, h] (tile = pitch - 1 px seam) */
  pitch: [number, number];
  reserve?: Reserve[];
  /** how many tiles fall (default: every free slot) */
  count?: number;
  /** first tile's spawn frame */
  t0: number;
  /**
   * spawn schedule: the frame offset of the i-th tile after t0. Default: 1 tile, a beat, another, then an
   * accelerating pour ("one ... then another ... then hundreds")
   */
  spawnAt?: (i: number) => number;
  /** fall physics (px/frame^2, px/frame). Default 0.9, 14 */
  g?: number; vmax?: number;
  /** ragged front: how uneven the column heights run (in rows). Default 1.6 */
  rag?: number;
  seed?: number;
}
export interface GridItem { i: number; c: number; r: number; x: number; y: number; spawn: number; land: number; seed: number; }

/** The default avalanche schedule: t0 one tile, +15 another, +30 a third, then a pour ramping to ~6 per frame. */
export const avalancheSchedule = (i: number) => (i === 0 ? 0 : i === 1 ? 15 : i === 2 ? 26 : 30 + Math.pow(i - 3, 0.62) * 2.6);

export const planGridStack = (o: GridStackOpts): GridItem[] => {
  const g = o.g ?? 0.9, vmax = o.vmax ?? 14, rag = o.rag ?? 1.6, seed = o.seed ?? 5;
  const [pw, ph] = o.pitch;
  const openAt = new Float64Array(o.cols * o.rows); // 0 = free now, Infinity = never, t = from t
  for (const rv of o.reserve ?? []) for (let r = rv.r; r < rv.r + rv.h; r++) for (let c = rv.c; c < rv.c + rv.w; c++) if (r >= 0 && c >= 0 && r < o.rows && c < o.cols) openAt[r * o.cols + c] = rv.openAt ?? Infinity;
  // a slot above an opening-later reserve waits for it too (nothing hangs in the air)
  for (let c = 0; c < o.cols; c++) {
    let wait = 0;
    for (let r = o.rows - 1; r >= 0; r--) {
      const v = openAt[r * o.cols + c];
      if (v > 0 && v < Infinity) wait = Math.max(wait, v);
      else if (v === 0 && wait > 0) openAt[r * o.cols + c] = wait;
      if (v === Infinity) wait = 0;
    }
  }
  // a ragged but continuous front: neighbouring columns differ by at most ~1 row (smoothed noise), so the stack
  // rises like a pile, not in towers
  const raw = Array.from({length: o.cols}, (_, c) => hash(c, 1, seed));
  const colNoise = raw.map((_, c) => ((raw[Math.max(0, c - 1)] + raw[c] * 2 + raw[Math.min(o.cols - 1, c + 1)]) / 4) * rag);
  const slots: Array<{c: number; r: number; key: number; open: number}> = [];
  for (let r = 0; r < o.rows; r++)
    for (let c = 0; c < o.cols; c++) {
      const op = openAt[r * o.cols + c];
      if (op === Infinity) continue;
      slots.push({c, r, open: op, key: (o.rows - 1 - r) + colNoise[c] + hash(c, r, seed + 3) * 0.9});
    }
  // slots that open later go after everything that is free at their open time
  slots.sort((a, b) => (a.open - b.open) || (a.key - b.key));
  const n = Math.min(o.count ?? slots.length, slots.length);
  const spawnAt = o.spawnAt ?? avalancheSchedule;
  const landOf = new Float64Array(o.cols * o.rows).fill(-1);
  const out: GridItem[] = [];
  for (let i = 0; i < n; i++) {
    const s = slots[i];
    const x = o.x0 + s.c * pw, y = o.y0 + s.r * ph;
    let spawn = Math.max(o.t0 + Math.round(spawnAt(i)), s.open);
    const dist = y + ph; // from just above the top edge
    let land = spawn + Math.ceil(fallTime(dist, g, vmax));
    const below = s.r + 1 < o.rows ? landOf[(s.r + 1) * o.cols + s.c] : -1;
    if (below >= 0 && land <= below) { land = below + 1 + (i % 2); spawn = land - Math.ceil(fallTime(dist, g, vmax)); }
    landOf[s.r * o.cols + s.c] = land;
    out.push({i, c: s.c, r: s.r, x, y, spawn, land, seed: Math.floor(hash(s.c, s.r, seed + 9) * 1e6)});
  }
  return out;
};
/** A tile's y at frame f (whole px on 2s; null before it spawns). After landing: y, plus a 1 px kick when the
 *  tile above lands on it (pass `kickedAt`). */
export const gridItemY = (it: GridItem, f: number, ph: number, g = 0.9, vmax = 14): number | null => {
  if (f < it.spawn) return null;
  if (f >= it.land) return it.y;
  const t = Math.floor((f - it.spawn) / 2) * 2;
  return Math.min(it.y, Math.round(-ph + fallDist(t, g, vmax)));
};
/** Index the plan by slot, for landing kicks (the stack pushes). */
export const slotIndex = (plan: GridItem[], cols: number) => {
  const m = new Map<number, GridItem>();
  for (const it of plan) m.set(it.r * cols + it.c, it);
  return m;
};
/** How many tiles have landed by frame f (drive the counter from the stack itself). */
export const landedBy = (plan: GridItem[], f: number) => { let n = 0; for (const it of plan) if (f >= it.land) n++; return n; };

/**
 * Draw the stack. `paint(b, x, y, it)` draws one tile at its current position (usually employeeFace in a
 * (pitch - 1)-px square). Landed tiles dip 1 px on the frame the tile above lands on them (the push).
 */
export const drawGridStack = (b: Buf, plan: GridItem[], f: number, o: GridStackOpts, paint: (b: Buf, x: number, y: number, it: GridItem) => void, press?: {c: number; r: number; w: number; h: number; t0: number}) => {
  const [, ph] = o.pitch;
  // the press (29.18): tiles touching a rect (in slots) nudge 1 px toward it for 2 frames on every beat from t0
  const pressAt = (it: GridItem): [number, number] => {
    if (!press || f < press.t0 || (f - press.t0) % 15 > 1) return [0, 0];
    const {c, r, w, h} = press;
    const adjX = it.c === c - 1 || it.c === c + w, adjY = it.r === r - 1 || it.r === r + h;
    const inX = it.c >= c && it.c < c + w, inY = it.r >= r && it.r < r + h;
    if (adjX && (inY || adjY)) return [it.c < c ? 1 : -1, adjY ? (it.r < r ? 1 : -1) : 0];
    if (adjY && inX) return [0, it.r < r ? 1 : -1];
    return [0, 0];
  };
  const idx = slotIndex(plan, o.cols);
  for (const it of plan) {
    const y = gridItemY(it, f, ph, o.g, o.vmax);
    if (y === null || y < -ph) continue;
    let kick = 0;
    if (f >= it.land) {
      const above = idx.get((it.r - 1) * o.cols + it.c);
      if (above && f === above.land) kick = 1;
      if (f === it.land) kick = 1; // its own landing frame: 1 px low, then settles
    }
    const [px, py] = f >= it.land ? pressAt(it) : [0, 0];
    paint(b, it.x + px, y + kick + py, it);
  }
};

// ================================================================== the heart pile (heightmap)
export interface PileOpts {
  /** span the hearts pour across (screen px) */
  x0: number; x1: number;
  /** floor height per screen column (the pile rests on it). Default: 270 everywhere */
  floor?: (x: number) => number;
  /** don't let the pile rise above this y (a heart that would rest higher is dropped). Default 0 */
  ceiling?: number;
  count: number;
  t0: number;
  /** spawn offset of the i-th heart. Default: 1, then 10, then hundreds */
  spawnAt?: (i: number) => number;
  /** size weights for sizes 2..5 (5 = 11 px). Default [0.04, 0.16, 0.4, 0.4] */
  sizes?: number[];
  /** lattice pitch [w, h]. Default [7, 5] */
  pitch?: [number, number];
  /** how ragged the rising surface runs (rows). Default 5 */
  rag?: number;
  /** the one blue heart: it falls LAST, slowly, onto (x, y) = its rest top-left */
  blue?: {x: number; y: number; after?: number};
  g?: number; vmax?: number;
  seed?: number;
}
export interface PileHeart { i: number; x: number; y: number; size: number; spawn: number; land: number; blue: boolean; /** start height above the frame (px), so the pour never falls in rows */ y0?: number; /** blue heart: the x it drifts in from */ fromX?: number; }
/** The default heart schedule: one heart, then ten, then hundreds (spawn offsets in frames). */
export const heartSchedule = (i: number) => (i === 0 ? 0 : i <= 10 ? 15 + i * 2 : 40 + Math.pow(i - 10, 0.58) * 2.2);
export const planPile = (o: PileOpts): PileHeart[] => {
  // A staggered lattice of heart slots (pitch 8 x 6, odd rows offset half a pitch, each heart jittered and sized at
  // random) filled bottom-up with a smoothed ragged front, like the tile avalanche: the heap rises evenly, hearts
  // nest into each other, nothing ever branches or hangs. A slot never lands before the slots it rests on.
  const g = o.g ?? 0.7, vmax = o.vmax ?? 11, seed = o.seed ?? 17, ceil = o.ceiling ?? 0;
  const [pw, ph] = o.pitch ?? [7, 5];
  const floorAt = o.floor ?? (() => 270);
  const sw = o.sizes ?? [0.04, 0.16, 0.4, 0.4];
  const spawnAt = o.spawnAt ?? heartSchedule;
  const rag = o.rag ?? 5;
  const cols = Math.ceil((o.x1 - o.x0) / pw) + 1;
  const raw = Array.from({length: cols}, (_, c) => hash(c, 11, seed));
  const sm = raw.map((_, c) => (raw[Math.max(0, c - 2)] + raw[Math.max(0, c - 1)] * 2 + raw[c] * 3 + raw[Math.min(cols - 1, c + 1)] * 2 + raw[Math.min(cols - 1, c + 2)]) / 9);
  type Slot = {c: number; r: number; x: number; y: number; size: number; key: number};
  const slots: Slot[] = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < 200; r++) {
      const cx = o.x0 + c * pw + (r & 1 ? pw >> 1 : 0) + Math.round((hash(c, r, seed + 1) - 0.5) * 3);
      const fl = floorAt(clamp(cx, 0, 479));
      const rr = hash(c, r, seed + 2);
      let acc = 0, size = 5;
      for (let k = 0; k < sw.length; k++) { acc += sw[k]; if (rr < acc) { size = k + 2; break; } }
      const w = HEART_W[size], hh = HEART_H[size];
      const bottom = fl - r * ph + Math.round((hash(r, c, seed + 3) - 0.5) * 2);
      const y = bottom - hh;
      if (y < ceil) break;
      // a lumpy heap: smoothed noise plus two slow swells across the frame
      const swell = (Math.sin(c * 0.11 + seed) + Math.sin(c * 0.047 + seed * 2.3)) * rag * 0.45;
      slots.push({c, r, x: clamp(cx - (w >> 1), o.x0, o.x1 - w), y, size, key: r + sm[c] * rag + swell + hash(c, r, seed + 4) * 0.9});
    }
  slots.sort((a, b) => a.key - b.key);
  const n = Math.min(o.count, slots.length);
  const landAt = new Map<number, number>();
  const out: PileHeart[] = [];
  for (let i = 0; i < n; i++) {
    const s = slots[i];
    let spawn = o.t0 + Math.round(spawnAt(i));
    const y0 = Math.floor(hash(s.c, s.r, seed + 5) * 90);
    const dist = s.y + HEART_H[s.size] + y0;
    let land = spawn + Math.ceil(fallTime(dist, g, vmax));
    // it rests on the slot below (same column) and its staggered neighbours
    const under = [s.c * 1000 + s.r - 1, (s.c + (s.r & 1 ? 1 : -1)) * 1000 + s.r - 1];
    for (const u of under) { const l = landAt.get(u); if (l !== undefined && land <= l) land = l + 1; }
    spawn = land - Math.ceil(fallTime(dist, g, vmax));
    landAt.set(s.c * 1000 + s.r, land);
    out.push({i, x: s.x, y: s.y, size: s.size, spawn, land, blue: false, y0});
  }
  if (o.blue) return withBlueHeart(out, o.blue.x, o.blue.y, o.blue.after);
  return out;
};
/** The blue heart takes this long to drift down (slowly, last of all). */
export const BLUE_FALL = 96;
/**
 * Add the ONE blue heart to a finished plan: it spawns `after` frames after the last red heart lands and drifts
 * down to (x, y) = its rest top-left (e.g. on top of MADA's spinner, the only thing still sticking out).
 */
export const withBlueHeart = (plan: PileHeart[], x: number, y: number, after = 20, fromX?: number): PileHeart[] => {
  const last = plan.reduce((a, h) => Math.max(a, h.land), 0);
  const spawn = last + after;
  return [...plan.filter((h) => !h.blue), {i: plan.length, x, y, size: 4, spawn, land: spawn + BLUE_FALL, blue: true, fromX}];
};
/**
 * The reaction burst: a heart pops into a tile's corner, then ten more around it (one per frame, a 1 px hop each),
 * the "one ... then ten" beat before the pour. (x, y) = the corner the reactions grow from (bottom-right anchor).
 */
export const reactionBurst = (b: Buf, x: number, y: number, k: number, n = 11, seed = 3) => {
  if (k < 0) return;
  for (let i = 0; i < n; i++) {
    const at = i === 0 ? 0 : 15 + (i - 1) * 2;
    if (k < at) break;
    const size = i === 0 ? 4 : 2 + Math.floor(hash(i, 1, seed) * 3);
    const px = x - HEART_W[size] - (i === 0 ? 0 : Math.floor(hash(i, 2, seed) * 30));
    const py = y - HEART_H[size] - (i === 0 ? 0 : Math.floor(hash(i, 3, seed) * 22)) - (k === at ? 1 : 0);
    drawHeart(b, px, py, size, RED);
  }
};
/** A pile heart's position at frame f (null before spawn). The blue heart drifts: 1 px per 2-3 frames, swaying. */
export const pileHeartAt = (h: PileHeart, f: number, g = 0.7, vmax = 11): [number, number] | null => {
  if (f < h.spawn) return null;
  if (f >= h.land) return [h.x, h.y];
  if (h.blue) {
    const t = (f - h.spawn) / BLUE_FALL;
    const e = 1 - Math.pow(1 - t, 1.6);
    const y = Math.round(-12 + (h.y + 12) * e);
    const sway = Math.round(Math.sin(Math.floor((f - h.spawn) / 4) * 0.7) * 4 * (1 - t));
    // it can drift in from another x (27.10's egg: it drops from above RIMA's tile)
    const dx = h.fromX === undefined ? 0 : Math.round((h.fromX - h.x) * (1 - e));
    return [h.x + sway + dx, y];
  }
  const t = Math.floor((f - h.spawn) / 2) * 2;
  return [h.x, Math.min(h.y, Math.round(-HEART_H[h.size] - (h.y0 ?? 0) + fallDist(t, g, vmax)))];
};
/** Draw the pile (smallest first so near hearts sit on top); the blue heart last. */
/** Draw the pile. `blue: 'skip'` leaves the blue heart to the scene (e.g. when it rides MADA's spinner). */
export const drawPile = (b: Buf, plan: PileHeart[], f: number, o: {g?: number; vmax?: number; blueOverride?: [number, number] | null; blue?: 'plan' | 'skip'} = {}) => {
  let blue: PileHeart | null = null;
  for (const h of plan) {
    if (h.blue) { blue = h; continue; }
    const p = pileHeartAt(h, f, o.g, o.vmax);
    if (!p) continue;
    drawHeart(b, p[0], p[1] + (f === h.land ? 1 : 0), h.size, RED);
  }
  if (blue && o.blue !== 'skip') {
    const p = o.blueOverride ?? pileHeartAt(blue, f, o.g, o.vmax);
    if (p) drawHeart(b, p[0], p[1], blue.size, BLUE);
  }
};
/** The pile's surface (topmost heart pixel) at column x by frame f: for things that ride the pile. */
export const pileTopAt = (plan: PileHeart[], x: number, f: number, floor = 270) => {
  let top = floor;
  for (const h of plan) {
    if (h.blue || f < h.land) continue;
    if (x >= h.x && x < h.x + HEART_W[h.size]) top = Math.min(top, h.y);
  }
  return top;
};
/** Covered: true once the pile has buried the point (x, y). */
export const pileCovers = (plan: PileHeart[], x: number, y: number, f: number) => pileTopAt(plan, x, f) <= y;

/**
 * Hearts that float UP toward someone, one per beat, and hang there (30.03: three red hearts rise to Alyi's doorway).
 * (x, y) = where they hang (the first one's top-left); they rise from `rise` px below in 3 held steps each.
 */
export const floatHearts = (b: Buf, x: number, y: number, k: number, n = 3, o: {rise?: number; beat?: number; size?: number; gap?: number} = {}) => {
  const rise = o.rise ?? 36, beat = o.beat ?? 15, size = o.size ?? 3, gap = o.gap ?? 10;
  for (let i = 0; i < n; i++) {
    const kk = k - i * beat;
    if (kk < 0) continue;
    const dy = kk < 3 ? rise : kk < 6 ? Math.round(rise * 0.45) : kk < 9 ? 3 : Math.floor(kk / 12) % 2; // settle, then a 1 px bob on 12s
    drawHeart(b, x + i * gap, y + dy + (i % 2), size, RED);
  }
};

// ================================================================== pushing and scattering
/**
 * A board tile under pressure: the stack reaches it (t0) and nudges it 2 px, it RESISTS for one beat (15 frames,
 * a 1 px shudder on 3s), then slides off the edge in accelerating whole-px steps on 2s. Returns the x offset
 * (multiply by dir). `dist` caps the slide (e.g. to the frame edge + tile width).
 */
export const shove = (f: number, t0: number, dist = 400): number => {
  if (f < t0) return 0;
  const k = f - t0;
  if (k < 2) return 1;
  if (k < 17) return 2 + (Math.floor(k / 3) % 2 === 0 ? 0 : 1);
  const s = Math.floor((k - 17) / 2);
  const seq = [4, 8, 14, 22, 34, 50, 72, 100, 136, 180, 232, 292, 360, 440];
  return Math.min(dist, seq[Math.min(seq.length - 1, s)]);
};

/**
 * Sparks: n small things (footnote numbers, keycaps, glints) thrown from (x, y) at k = 0, whole-px ballistic arcs,
 * cooling a rung every 4 frames and gone by `life`. digits = draw 3x5 footnote numerals instead of dots.
 */
export const scatter = (b: Buf, x: number, y: number, k: number, o: {n?: number; seed?: number; digits?: boolean; col?: number; life?: number; spread?: number} = {}) => {
  const n = o.n ?? 9, seed = o.seed ?? 3, life = o.life ?? 22, col0 = o.col ?? PAL.W8;
  if (k < 0 || k >= life) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (hash(i, 1, seed) - 0.5) * Math.PI * (o.spread ?? 1.3);
    const v = 2 + hash(i, 2, seed) * 3.5;
    const t = Math.floor(k / 2) * 2;
    const px = Math.round(x + Math.cos(a) * v * t), py = Math.round(y + Math.sin(a) * v * t + 0.18 * t * t);
    const c = stepColor(col0, -Math.floor(k / 4));
    if (o.digits) micro(b, String(1 + (i % 3)), px, py, c);
    else { b.set(px, py, c); if (k < 6) b.set(px + 1, py, c); }
  }
};

// ================================================================== the counters
export interface OdoOpts {
  /** number of drums. Default 3 */
  digits?: number;
  /** a label over the drums (e.g. 'THE LETTER'). Default none */
  label?: string;
  /** a fixed suffix after the drums (e.g. '/ 770') */
  suffix?: string;
  /** 1 px down on the clunk frame */
  kick?: boolean;
  /** drum face / digit ink. Default the launch-night P1 / N1 */
  face?: number; ink?: number;
  /** thousands separators like the launch odometer. Default false */
  commas?: boolean;
}
/**
 * The mechanical odometer (the launch-night drums: paper faces, ink digits, shaded top and bottom rows). `value` may
 * be fractional: each drum shows its digit rolling in from above by whole pixels. (x, y) = top-left of the drums.
 * Returns the drawn width.
 */
export const odometer = (b: Buf, x: number, y0: number, value: number, o: OdoOpts = {}) => {
  const digits = o.digits ?? 3, dw = 9, gap = 2, comma = 3;
  const face = o.face ?? PAL.P1, ink = o.ink ?? PAL.N1;
  const y = y0 + (o.kick ? 1 : 0);
  const commas = o.commas ? Math.floor((digits - 1) / 3) : 0;
  const wTot = digits * dw + (digits - 1) * gap + commas * comma;
  const sufW = o.suffix ? textWidth(o.suffix) + 6 : 0;
  rect(x - 5, y - (o.label ? 13 : 5), wTot + 10 + sufW, (o.label ? 13 : 5) + 18, b.ink(PAL.N0));
  rect(x - 5, y - (o.label ? 13 : 5), wTot + 10 + sufW, 1, b.ink(PAL.C5));
  if (o.label) text(b, o.label, x, y - 10, PAL.N6);
  let cx = x;
  for (let i = 0; i < digits; i++) {
    const place = Math.pow(10, digits - 1 - i);
    const pos = (value / place) % 10;
    // only the lowest drum rolls continuously; higher drums flip in the last 10% of their lower neighbour's turn
    const low = (value % place) / place;
    const d0 = Math.floor(pos);
    const fr = i === digits - 1 ? pos - d0 : low > 0.9 ? (low - 0.9) * 10 : 0;
    const off = Math.round(fr * 11);
    rect(cx, y, dw, 13, b.ink(face));
    const strip = new Buf(dw, 24, face);
    text(strip, String((d0 + 1) % 10), 2, 1, ink);
    text(strip, String(d0 % 10), 2, 14, ink);
    for (let j = 0; j < 13; j++) for (let ii = 0; ii < dw; ii++) if (strip.get(ii, j + 11 - off) === ink) b.set(cx + ii, y + j, ink);
    for (let ii = 0; ii < dw; ii++) { b.set(cx + ii, y, PAL.P0); b.set(cx + ii, y + 12, PAL.P0); b.set(cx + ii, y + 1, stepColor(b.get(cx + ii, y + 1), -1)); b.set(cx + ii, y + 11, stepColor(b.get(cx + ii, y + 11), -1)); }
    cx += dw + gap;
    if (o.commas && (digits - 1 - i) % 3 === 0 && i < digits - 1) { b.set(cx, y + 11, face); b.set(cx, y + 12, face); cx += comma; }
  }
  if (o.suffix) text(b, o.suffix, cx + 3, y + 3, PAL.P1);
  return wTot + sufW;
};
/**
 * A scripted roll: stops = [[frame, value], ...]. Between stops the drums roll (eased, fast in the middle); on a
 * stop frame they land exactly. Returns {value, clunk} (clunk = the arrival frame of a stop: kick + the SFX cue).
 */
export const odoRoll = (f: number, stops: Array<[number, number]>): {value: number; clunk: boolean} => {
  if (f <= stops[0][0]) return {value: stops[0][1], clunk: f === stops[0][0]};
  for (let i = 1; i < stops.length; i++) {
    const [ta, va] = stops[i - 1], [tb, vb] = stops[i];
    if (f < tb) {
      const t = (f - ta) / (tb - ta);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return {value: va + (vb - va) * e, clunk: false};
    }
    if (f === tb) return {value: vb, clunk: true};
  }
  return {value: stops[stops.length - 1][1], clunk: false};
};
/** The Ep1 letter counter: 505 . 650 . 700 . 745 (of 770), one stop per bar from t0 (override the spacing). */
export const LETTER_STOPS = (t0: number, every = 30): Array<[number, number]> => [[t0, 0], [t0 + every, 505], [t0 + every * 2, 650], [t0 + every * 3, 700], [t0 + every * 4 + 10, 745]];

/** The reactions counter chip: a small heart and a number (UI; draw it in the call chrome). */
export const heartCounter = (b: Buf, x: number, y: number, n: number | string, blue = false) => {
  const s = String(n);
  const w = textWidth(s) + 16;
  rect(x, y, w, 11, b.ink(PAL.N0));
  drawHeart(b, x + 3, y + 3, 2, blue ? BLUE : RED);
  text(b, s, x + 11, y + 2, PAL.P1);
  return w;
};
