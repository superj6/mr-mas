// MR. MAS — outro E: Ep1's stinger, the Senate moth. It arrives while the window collapses into its last line of
// light, loses the light, and goes to the only light left: the terms line. It settles beside the line's FINAL
// PERIOD, facing it, the antennae a V either side of the dot, its body and wings to the right of the line, never
// on a word (the brief).
//
// POLISH PASS (after the cold read, which took the old 14x9 moth for "a tiny fly", "a dead pixel or a stray
// pointer"): it is now a moth first. 17x21 native pixels (about 2.5 letters high, 68x84 at 1080p), broad dusty
// forewings with a dark spot, mauve hindwings, a fuzzy striped body and long antennae, flapping fast on 1s (spread,
// half, up, half) the way a moth flutters, not on 2s like a butterfly. It is drawn head-up and turned head-left in
// code, so the three drawings stay symmetrical. It enters as the window collapses (no black wait) and loops inward
// of the frame edge (x 400-490, inside title-safe) so it reads as a flight, not a speck at the border.
import {Buf, hash} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {EV} from './timeline';
import {PERIOD} from './window';

// W forewing light (leading edge), w forewing, d wing mark, h hindwing, H hindwing light, b body, B body light,
// f thorax fuzz, a antenna
const PALM: Record<string, number> = {W: PAL.P1, w: PAL.P0, d: PAL.B3, h: PAL.X2, H: PAL.X3, b: PAL.B3, B: PAL.B4, f: PAL.P0, a: PAL.P0};

// head-up drawings, 21 wide x 17 tall; row 0 = the antenna tips, col 10 = the body's axis
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
/** turn a head-up drawing head-left (90 degrees counter-clockwise): up-row j -> x j, up-col c -> y (20 - c) */
const rotLeft = (rows: string[]) => {
  const w = rows[0].length;
  return Array.from({length: w}, (_, i) => rows.map((r) => r[w - 1 - i]).join(''));
};
const REST = rotLeft(REST_UP), HALF = rotLeft(HALF_UP), UP = rotLeft(UP_UP);
/** the anchor: the thorax centre (x 7 = up-row 7) on the body's axis (y 10) */
const AX = 7, AY = 10;

const blitD = (b: Buf, d: string[], x: number, y: number) => {
  d.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = PALM[r[i]]; if (c !== undefined) b.set(x - AX + i, y - AY + j, c); } });
};

// ------------------------------------------------------------------ the flight: waypoints (outro frames), Catmull-Rom,
// plus a moth's erratic 1-2 px jitter, all rounded to whole pixels. It comes in from frame-right at the height of
// the collapsing line of light (y 80), stalls as the light goes out, then drops in two loose swings to the line's end.
/** the landed anchor: the antenna tips (x 0) one pixel right of the period, the body on the period's row */
export const LAND: [number, number] = [PERIOD[0] + 1 + AX, PERIOD[1]];
const WAY: Array<[number, number, number]> = [
  [EV.moth.enter - 4, 506, 74],
  [EV.moth.enter, 486, 80],          // o152: in from frame-right at the height of the collapsing line (y 80)
  [EV.moth.enter + 4, 454, 88],
  [EV.moth.enter + 8, 424, 110],     // the dot goes out (o156): it stalls, loses the light
  [EV.moth.enter + 13, 442, 142],    // two loose swings down toward the only light left
  [EV.moth.enter + 18, 410, 174],
  [EV.moth.enter + 22, 428, 206],
  [EV.moth.enter + 25, LAND[0] + 6, LAND[1] - 7],
  [EV.moth.land, LAND[0], LAND[1]],  // o180 = 4.1: lands, in silence
  [EV.moth.land + 6, LAND[0], LAND[1]],
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
/** the moth's x at outro frame o (tools/mix.py pans the flutter with it) */
export const mothX = (o: number) => (o >= EV.moth.land ? LAND[0] : pathAt(o)[0]);

/** the flap on 1s: spread, half, up, half (a moth's fast flutter) */
const FLAP = [REST, HALF, UP, HALF];
/** the settle after the landing (o180-187): a half-open, a pause, one last half-open, then still from EV.moth.folded */
const SETTLE = [HALF, HALF, REST, REST, REST, REST, HALF, REST];

/** the moth at outro frame o (nothing before it enters) */
export const drawMoth = (b: Buf, o: number) => {
  if (o < EV.moth.enter) return;
  if (o >= EV.moth.land) {
    const k = o - EV.moth.land;
    blitD(b, o >= EV.moth.folded ? REST : SETTLE[k] ?? REST, LAND[0], LAND[1]);
    return;
  }
  const [fx, fy] = pathAt(o);
  const near = EV.moth.land - o; // the last frames brake: no jitter, a slower flap
  const jit = near > 5 ? 1.6 : 0;
  const jx = Math.round((hash(o, 7, 3) - 0.5) * 2 * jit), jy = Math.round((hash(o, 9, 5) - 0.5) * 2 * jit);
  const d = near <= 3 ? (near <= 1 ? REST : HALF) : FLAP[(o - EV.moth.enter) % 4];
  blitD(b, d, Math.round(fx) + jx, Math.round(fy) + jy);
};

/** for the stills: the landed moth */
export const drawMothLanded = (b: Buf) => blitD(b, REST, LAND[0], LAND[1]);
/** the landed moth's bounding box (the verify pass checks it never touches a terms or pointer glyph) */
export const MOTH_BOX = {x0: LAND[0] - AX, y0: LAND[1] - AY, x1: LAND[0] - AX + REST[0].length - 1, y1: LAND[1] - AY + REST.length - 1};
