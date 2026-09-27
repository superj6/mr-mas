// MR. MAS — cast: MAS's COLLAR STACK as an overlay for his existing drawings (gags G05, world/props.md "The collars").
// New file (v3-art-a, 2026-09-27); cast/mas.ts, mas-medium.ts and mas-stand.ts are not edited. Mas's present-day
// drawings have a plain hoodie neck; the stack (two popped polo collars in 2008, a third by the cold open, one more per
// round later) is drawn here, over whichever drawing a shot uses, at that drawing's own neck. Design only, never text.
//   Inside out: 1 coral, 2 green (the 2008 pair, the same colours as masStage), 3 cream. A new collar surfaces OUTSIDE
//   the last, so the newest reads first. `pop` (frames since the newest surfaced): frames 0-1 it stands 1 px proud (the
//   1-px hop), then settles; before `pop` 0 it isn't there (pass collars n-1 instead).
//   drawCollarsPortrait(b, x, y, n, {head, light, pop})   over masPortrait (112 x 136) drawn with its top-left at (x, y)
//   drawCollarsMedium(b, x, y, n, {light, pop, flip})     over drawMasMedium drawn at (x, y) (84 x 110)
//   drawCollarsStand(b, footX, footY, n, {flip})          over drawMasStand at its foot anchor (room scale: 1 px each)
// Colours are light-state ramps (warm, monitor, room) so they sit in the drawing's light, not on it.
import {Buf} from '../px';
import {PAL} from '../palette';
import {MAS_STAND_FOOT, MAS_STAND_W} from './mas-stand';

export type CollarLight = 'warm' | 'monitor' | 'room';
// [shadow, mid, lit] per collar, per light
const COLS: Record<CollarLight, Array<[number, number, number]>> = {
  warm: [[PAL.R1, PAL.R2, PAL.R3], [PAL.L1, PAL.L2, PAL.L3], [PAL.P0, PAL.P1, PAL.P2]],
  room: [[PAL.R1, PAL.R2, PAL.R3], [PAL.L0, PAL.L1, PAL.L2], [PAL.P0, PAL.P1, PAL.P2]],
  monitor: [[PAL.R0, PAL.R1, PAL.K2], [PAL.L0, PAL.L1, PAL.C4], [PAL.N6, PAL.P0, PAL.K4]],
};

/** One collar band hugging the neck: a 2 px band, `h` tall, its tip leaning one pixel outward at the top. */
const band = (b: Buf, x: number, yTop: number, yBot: number, side: -1 | 1, col: [number, number, number], lit: -1 | 1) => {
  for (let y = yTop; y <= yBot; y++) {
    const lean = y === yTop ? side : 0;
    // the lit edge faces the key: the outer column on the lit side, the inner on the shadow side
    const outer = side === lit ? col[2] : col[0];
    b.set(x + lean, y, y === yTop ? col[2] : col[1]);
    b.set(x + side + lean, y, y === yTop ? col[1] : outer);
  }
};

/** a popped collar's point at portrait scale: it stands up beside the neck and flares outward at its tip (4 x 10),
 *  authored for the neck's LEFT side (mirrored for the right); rows: tip, flare, body, the fold into the hoodie */
const POINT = ['L...', 'LL..', 'LMM.', 'eMMM', '.MMM', '.MMM', '.eMM', '..MM', '..MS', '..SS'];
const point = (b: Buf, x: number, y: number, side: -1 | 1, col: [number, number, number]) => {
  POINT.forEach((row, j) => { for (let i = 0; i < 4; i++) { const ch = row[side < 0 ? i : 3 - i]; if (ch === '.') continue; const c = ch === 'L' ? col[2] : ch === 'M' ? col[1] : ch === 'S' ? col[0] : col[0]; b.set(x + i, y + j, c); } });
};
/** The portrait's two heads share the neck: skin x 51..63 (the front head) / 52..62 (the 3/4 head), the hoodie's
 *  neckline at y ~90 (left) and ~92 (right). Each collar is a pair of popped points standing up either side of the neck,
 *  each one outside the last and a pixel lower (the newest outermost); `pop` 0-1 lifts the newest 1 px. */
export const drawCollarsPortrait = (b: Buf, x: number, y: number, n: number, o: {head?: '34' | 'front'; light?: CollarLight; pop?: number} = {}) => {
  if (n <= 0) return;
  const cols = COLS[o.light ?? 'warm'];
  const front = (o.head ?? '34') === 'front';
  const nl = front ? 51 : 52, nr = front ? 63 : 62;
  // draw the outermost first so the inner ones stand in front of it at the neck
  for (let i = Math.min(3, n) - 1; i >= 0; i--) {
    const hop = i === n - 1 && o.pop !== undefined && o.pop < 2 ? 1 : 0;
    const top = y + 81 + i - hop;
    point(b, x + nl - 4 - i * 3, top, -1, cols[i]);
    point(b, x + nr + 1 + i * 3, top + 1, 1, cols[i]);
  }
};

/** mas-medium's neck: skin x 44..51, the neckline at y ~47 (left) / ~51 (right) (unflipped, local coords). */
export const drawCollarsMedium = (b: Buf, x: number, y: number, n: number, o: {light?: CollarLight; pop?: number; flip?: boolean} = {}) => {
  if (n <= 0) return;
  const cols = COLS[o.light ?? 'warm'];
  const X = (lx: number) => (o.flip ? x + 83 - lx : x + lx);
  for (let i = 0; i < Math.min(3, n); i++) {
    const hop = i === n - 1 && o.pop !== undefined && o.pop < 2 ? 1 : 0;
    const top = y + 43 + i - hop;
    const L = o.flip ? 1 : -1;
    band(b, X(43 - i), top, y + 47, (L as -1 | 1), cols[i], -1);
    band(b, X(52 + i), top + 1, y + 50, (-L as -1 | 1), cols[i], -1);
  }
};

/** mas-stand's neck (room scale): skin x 18..22, y 14..17. One pixel per collar, each side. */
export const drawCollarsStand = (b: Buf, footX: number, footY: number, n: number, o: {flip?: boolean; light?: CollarLight} = {}) => {
  if (n <= 0) return;
  const cols = COLS[o.light ?? 'room'];
  const fx = o.flip ? MAS_STAND_W - 1 - MAS_STAND_FOOT[0] : MAS_STAND_FOOT[0];
  const x0 = footX - fx, y0 = footY - MAS_STAND_FOOT[1];
  const X = (lx: number) => (o.flip ? x0 + MAS_STAND_W - 1 - lx : x0 + lx);
  for (let i = 0; i < Math.min(3, n); i++) {
    b.set(X(17 - i), y0 + 15 + (i ? 1 : 0), cols[i][2]); b.set(X(17 - i), y0 + 16 + (i ? 1 : 0), cols[i][1]);
    b.set(X(23 + i), y0 + 16 + (i ? 1 : 0), cols[i][1]);
  }
};
