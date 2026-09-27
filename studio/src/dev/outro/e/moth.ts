// MR. MAS — outro E: Ep1's stinger, the Senate moth. It arrives with the click, flies at the collapsing window's
// light, loses it, and goes to the only light left: the terms line. It settles BESIDE the line's FINAL PERIOD (a
// 3-px gap), never on a word (the brief).
//
// POLISH PASS (after the first cold read, which took the old 14x9 moth for "a tiny fly"): a moth first, 21x17
// native, dusty forewings with a dark spot, mauve hindwings, a fuzzy striped body and long antennae, flapping on 1s.
//
// POLISH PASS 2 (after the second cold read: "a roughly 10 px smudge on a full stop", "only stops moving at about
// 8.9 s", "about 0.4 s of true stillness"):
//   - UPRIGHT. It is drawn head-up throughout, the way a moth sits on a lit screen or a window, wings flat and
//     symmetrical: that icon-like silhouette reads as a moth at 480x270, where the old head-left pose, antennae
//     round the dot, read as a smudge on the full stop. It lands with a 3-px gap after the period: beside it.
//   - Hindwings and body one rung brighter, so the whole wing shape reads on black, not only the paper forewings.
//   - ONE PATH, no wandering: in from frame-right with the click, toward the light, a stall as the light goes out
//     (o157), then straight down to the period, braking; it lands on 3.4 (o165), 0.625 s sooner than before.
//   - NO SETTLE: the landing drawing is the last one. Nothing moves from o165 to the end (o195): 1.29 s of stillness.
import {Buf, hash} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {EV} from './timeline';
import {PERIOD} from './window';

// W forewing light (leading edge), w forewing, d wing mark, h hindwing, H hindwing light, b body, B body light,
// f thorax fuzz, a antenna
const PALM: Record<string, number> = {W: PAL.P1, w: PAL.P0, d: PAL.B3, h: PAL.X3, H: PAL.P0, b: PAL.B4, B: PAL.P0, f: PAL.P1, a: PAL.P0};

// head-up drawings, 21 wide x 17 tall; row 0 = the antenna tips, col 10 = the body's axis
const REST = [
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
const HALF = [
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
const UP = [
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
/** the anchor: the body's axis (x 10), the wings' middle row (y 8) */
const AX = 10, AY = 8;

const blitD = (b: Buf, d: string[], x: number, y: number) => {
  d.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = PALM[r[i]]; if (c !== undefined) b.set(x - AX + i, y - AY + j, c); } });
};

// ------------------------------------------------------------------ the flight: waypoints (outro frames), Catmull-Rom,
// a 1-px moth jitter while it chases the light, then none; all rounded to whole pixels.
/** the landed anchor: the left wingtip (col 0) 4 px right of the period (a 3-px gap), the wings' middle on the
 *  terms line's middle row */
export const LAND: [number, number] = [PERIOD[0] + 4 + AX, PERIOD[1] - 5];
const WAY: Array<[number, number, number]> = [
  [EV.moth.enter - 4, 526, 102],
  [EV.moth.enter, 494, 110],           // o150 (the click): just off frame-right, at the height of the window's centre
  [EV.moth.enter + 3, 432, 117],       // at the collapsing line's right end
  [EV.moth.lightOut, 394, 124],        // o157: the light is gone; it stalls
  [EV.moth.lightOut + 3, 408, 168],    // then straight down toward the only light left
  [EV.moth.land - 3, 434, 214],
  [EV.moth.land - 1, 446, 233],        // braking
  [EV.moth.land, LAND[0], LAND[1]],    // o165 = 3.4: lands
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

/** the moth at outro frame o (nothing before it enters; from the landing on, one still drawing) */
export const drawMoth = (b: Buf, o: number) => {
  if (o < EV.moth.enter) return;
  if (o >= EV.moth.land) { blitD(b, REST, LAND[0], LAND[1]); return; }
  const [fx, fy] = pathAt(o);
  const near = EV.moth.land - o;
  const jit = o <= EV.moth.lightOut ? 1.2 : 0;             // erratic while it chases the light, direct after
  const jx = Math.round((hash(o, 7, 3) - 0.5) * 2 * jit), jy = Math.round((hash(o, 9, 5) - 0.5) * 2 * jit);
  const d = near <= 2 ? HALF : FLAP[(o - EV.moth.enter) % 4];
  blitD(b, d, Math.round(fx) + jx, Math.round(fy) + jy);
};

/** for the stills: the landed moth */
export const drawMothLanded = (b: Buf) => blitD(b, REST, LAND[0], LAND[1]);
/** the landed moth's bounding box (the verify pass checks it never touches a terms or pointer glyph) */
export const MOTH_BOX = {x0: LAND[0] - AX, y0: LAND[1] - AY, x1: LAND[0] - AX + REST[0].length - 1, y1: LAND[1] - AY + REST.length - 1};
