// MR. MAS — outro C: THE MOTH (Ep1's stinger). Second pass, after the cold read ("at 480x270 it doesn't read: its
// landing looks like a stray cursor or a compression speck on the period").
//
// It is now proposal E's moth, drawing for drawing (copied from studio/src/dev/outro/e/moth.ts after E's own cold-read
// pass, so the five proposals can converge on ONE moth; nothing in E was edited): 21 x 17 native head-up, dusty
// forewings with a dark spot, mauve hindwings, a striped body and long antennae, a fast flutter on 1s (spread, half,
// up, half). C's old moth (THE PLAN's blueprint linework in cyan, 6 x 4 perched) is retired: cyan on black beside a
// line of text is exactly what a text cursor looks like.
//
// What is C's own:
//   - the flight: it comes in from frame-right as the house light steps down (o120), goes to the one light left,
//     bumps the TOP of the light box twice (it never crosses the plate well: the count stays clear), gives up, and
//     drops down the wall right of the board to the band, landing beside the terms line's final period at o150 (3.3)
//   - it faces its way of travel (head-left drawings, mirrored when it flies right); it lands head-left, facing the
//     period, antennae a V either side of the dot, never on a word (the check: tools/preview.ts)
//   - BACKLIT: whenever most of it is over the lit face, it's drawn as a silhouette (a moth against a lamp)
import {Buf, hash} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {PERIOD} from './band';

// W forewing light (leading edge), w forewing, d wing mark, h hindwing, H hindwing light, b body, B body light,
// f thorax fuzz, a antenna
const LIT: Record<string, number> = {W: PAL.P1, w: PAL.P0, d: PAL.B3, h: PAL.X2, H: PAL.X3, b: PAL.B3, B: PAL.B4, f: PAL.P0, a: PAL.P0};
/** against the lit face: the same drawing as a silhouette, its edges catching a little light */
const BACKLIT: Record<string, number> = {W: PAL.X2, w: PAL.X1, d: PAL.B1, h: PAL.B2, H: PAL.X1, b: PAL.B1, B: PAL.B2, f: PAL.X1, a: PAL.B2};

// head-up drawings, 21 wide x 17 tall (outro E's, verbatim); row 0 = the antenna tips, col 10 = the body's axis
const REST_UP = [
  '.....a.........a.....',
  '......a.......a......',
  '.......a.....a.......',
  '........a...a........',
  '.........bBb.........',
  '...WWWW..fBf..WWWW...',
  'WWWwwwwWWBBBWWwwwwWWW',
  '.WwwwwwwwBfBwwwwwwwW.',
  '..wwwdwwwBBBwwwdwww..',
  '...wwddwwbBbwwddww...',
  '....wwwwwbBbwwwww....',
  '..hhhwwwhbbbhwwwhhh..',
  '.hHHhhwhhbBbhhwhhHHh.',
  '.hhhhhhhhbbbhhhhhhhh.',
  '..hhhhhhhbBbhhhhhhh..',
  '...hhhhh.bbb.hhhhh...',
  '.....hh...b...hh.....',
];
const HALF_UP = [
  '.....................',
  '......a.......a......',
  '.......a.....a.......',
  '........a...a........',
  '.........bBb.........',
  '.....WWW.fBf.WWW.....',
  '...WWwwwWBBBWwwwWW...',
  '....WwwwwBfBwwwwW....',
  '....wwdwwBBBwwdww....',
  '.....wddwbBbwddw.....',
  '.....wwwwbBbwwww.....',
  '....hhwwhbbbhwwhh....',
  '....hHhhhbBbhhhHh....',
  '....hhhhhbbbhhhhh....',
  '.....hhhhbBbhhhh.....',
  '......hh.bbb.hh......',
  '..........b..........',
];
const UP_UP = [
  '.....................',
  '.......a.....a.......',
  '........a...a........',
  '.........a.a.........',
  '.........bBb.........',
  '........WfBfW........',
  '.......WWBBBWW.......',
  '.......WwBfBwW.......',
  '.......wwBBBww.......',
  '.......wwbBbww.......',
  '........wbBbw........',
  '........hbbbh........',
  '.......hhbBbhh.......',
  '.......hhbbbhh.......',
  '........hbBbh........',
  '.........bbb.........',
  '..........b..........',
];
/** head-up -> head-left (90 degrees counter-clockwise): up-row j -> x j, up-col c -> y (20 - c) */
const rotLeft = (rows: string[]) => {
  const w = rows[0].length;
  return Array.from({length: w}, (_, i) => rows.map((r) => r[w - 1 - i]).join(''));
};
const mirror = (rows: string[]) => rows.map((r) => [...r].reverse().join(''));
const L = {REST: rotLeft(REST_UP), HALF: rotLeft(HALF_UP), UP: rotLeft(UP_UP)};
const R = {REST: mirror(L.REST), HALF: mirror(L.HALF), UP: mirror(L.UP)};
/** the anchor: the thorax centre (x 7 of 17 head-left; x 9 mirrored) on the body's axis (y 10 of 21) */
const AX = 7, AY = 10, W = L.REST[0].length;

/** the landed anchor: the antenna tips (x 0) one pixel right of the period, the body on the period's row */
export const LAND: [number, number] = [PERIOD[0] + 1 + AX, PERIOD[1]];
export const MOTH_IN = 118, MOTH_LAND = 150, MOTH_STILL = 158;

// ------------------------------------------------------------------ the flight: waypoints (outro frames, the anchor),
// Catmull-Rom, a moth's 1-2 px jitter, whole pixels. The light box is x 174-305, y 20-75; the plate well (the count)
// x 244-301, y 31-62; the board x 58-421, y 81-174; the band from y 203.
const WAY: Array<[number, number, number]> = [
  [MOTH_IN - 4, 512, 10],
  [MOTH_IN, 492, 12],             // o118: in from frame-right, high (the house light is about to go)
  [MOTH_IN + 5, 420, 12],
  [MOTH_IN + 9, 336, 8],
  [MOTH_IN + 12, 286, 12],        // o130: bump 1, on the light box's top edge (its hindwings brush the frame)
  [MOTH_IN + 14, 300, 2],         // rebound
  [MOTH_IN + 17, 256, 11],        // o135: bump 2, further along the top
  [MOTH_IN + 20, 292, 0],         // gives up: up and away to the right
  [MOTH_IN + 23, 350, 18],
  [MOTH_IN + 26, 436, 70],        // down the wall right of the board
  [MOTH_IN + 29, 458, 150],
  [MOTH_LAND - 2, LAND[0] + 6, LAND[1] - 8],
  [MOTH_LAND, LAND[0], LAND[1]],  // o150 = 3.3: lands
  [MOTH_LAND + 6, LAND[0], LAND[1]],
];
const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
const pathAt = (o: number): [number, number] => {
  let i = 0;
  while (i < WAY.length - 2 && o > WAY[i + 1][0]) i++;
  const a = WAY[Math.max(0, i - 1)], p = WAY[i], q = WAY[i + 1], z = WAY[Math.min(WAY.length - 1, i + 2)];
  const t = Math.max(0, Math.min(1, (o - p[0]) / (q[0] - p[0])));
  return [cr(a[1], p[1], q[1], z[1], t), cr(a[2], p[2], q[2], z[2], t)];
};
/** the moth's x at outro frame o (the mix pans its taps with it) */
export const mothX = (o: number) => (o >= MOTH_LAND ? LAND[0] : pathAt(o)[0]);

const FLAP: Array<keyof typeof L> = ['REST', 'HALF', 'UP', 'HALF'];
/** the settle after the landing (o150-157): a half-open, a pause, one last half-open, then still from MOTH_STILL */
const SETTLE: Array<keyof typeof L> = ['HALF', 'HALF', 'REST', 'REST', 'REST', 'REST', 'HALF', 'REST'];

export interface MothPose { d: string[]; x: number; y: number; ax: number; backlit: boolean; }
/** the lit face of the light box (set.ts FACE), for the backlit test */
const FACE = {x0: 176, y0: 22, x1: 303, y1: 73};

/** the moth's pose at outro frame o, or null (before it enters). Pure: the stills, the checks and the renderer share it. */
export const mothPose = (o: number): MothPose | null => {
  if (o < MOTH_IN) return null;
  if (o >= MOTH_LAND) {
    const k = o - MOTH_LAND;
    return {d: L[o >= MOTH_STILL ? 'REST' : SETTLE[k] ?? 'REST'], x: LAND[0], y: LAND[1], ax: AX, backlit: false};
  }
  const [fx, fy] = pathAt(o);
  const [px] = pathAt(o - 1);
  const right = fx - px > 0.5;                    // faces its way of travel
  const near = MOTH_LAND - o;                      // the last frames brake: no jitter, a slower flap
  const jit = near > 5 ? 1.6 : 0;
  const jx = Math.round((hash(o, 7, 3) - 0.5) * 2 * jit), jy = Math.round((hash(o, 9, 5) - 0.5) * 2 * jit);
  const k: keyof typeof L = near <= 3 ? (near <= 1 ? 'REST' : 'HALF') : FLAP[(o - MOTH_IN) % 4];
  const d = (right ? R : L)[k];
  const x = Math.round(fx) + jx, y = Math.round(fy) + jy, ax = right ? W - 1 - AX : AX;
  // backlit when more than half its pixels are over the lit face
  let on = 0, all = 0;
  d.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') { all++; const X = x - ax + i, Y = y - AY + j; if (X >= FACE.x0 && X <= FACE.x1 && Y >= FACE.y0 && Y <= FACE.y1) on++; } });
  return {d, x, y, ax, backlit: on * 2 > all};
};

/** every pixel the moth covers at frame o: [x, y, colour] */
export const mothPixels = (o: number): Array<[number, number, number]> => {
  const p = mothPose(o);
  if (!p) return [];
  const pal = p.backlit ? BACKLIT : LIT;
  const out: Array<[number, number, number]> = [];
  p.d.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) out.push([p.x - p.ax + i, p.y - AY + j, c]); } });
  return out;
};
export const drawMoth = (b: Buf, o: number) => { for (const [x, y, c] of mothPixels(o)) b.set(x, y, c); };
/** for the stills: the landed moth, folded */
export const drawMothLanded = (b: Buf) => { for (const [x, y, c] of mothPixels(MOTH_STILL)) b.set(x, y, c); };
