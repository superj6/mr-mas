// MR. MAS — outro A: the Ep1 stinger, in the dark room (Ep1's "Senate moth in the dark room"). A real moth comes to
// the light of his monitor while the session pane is up, loses it when the window closes, and when the cursor comes
// on it goes to the one light left and settles on the glass beside it, folding its wings.
// It never lands on text: the terms line lives in the band, which is gone by then, and the cursor is 3 px away.
// Scale: the room's monitor is 180 px for ~60 cm, so a big moth (~4 cm) is ~13 px across: 13 x 8 in flight, 15 x 10
// touching down, 13 x 10 settled (52 x 40 px at 1080p). It settles the way moths sit on a lit window at night, wings
// half folded but still showing their shape and spots (a folded delta beside the cursor read as a glyph).
// Flight on 2s along a whole-pixel path, 3 wingbeat drawings.
// Light: in the pane's glow it is pale (paper rim); in the dark it is dusty mauve with the window's cool rim on its
// right, and when the cursor is on, the cursor's cyan catches its near (left) edge, so it blinks with the cursor.
import {Buf} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {O, beatOn} from './timeline';

// b body/fur, W wing, w wing shade, d wing edge (dark), h rim, a antenna, e eye, s wing spot
type MothPal = Record<string, number>;
const LIT: MothPal = {b: PAL.B3, W: PAL.P0, w: PAL.X2, d: PAL.X1, h: PAL.P1, a: PAL.B2, e: PAL.N0, s: PAL.B2};
const DARK: MothPal = {b: PAL.B3, W: PAL.X3, w: PAL.X2, d: PAL.X1, h: PAL.N6, a: PAL.B2, e: PAL.N0, s: PAL.B2};

// ---- flight, dorsal, 13 wide
const OPEN = [
  '..a.......a..',
  '...a.....a...',
  'hWWw..b..wWWh',
  'hWWWw.b.wWWWh',
  '.WWWWwbwWWWW.',
  '..wWWWbWWWw..',
  '...wwdbdww...',
  '.....dbd.....',
];
const MID = [
  '....a...a....',
  '.....a.a.....',
  '......b......',
  'hhWWWwbwWWWhh',
  '.dWWWWbWWWWd.',
  '..dwWWbWWwd..',
  '....wwbww....',
  '......b......',
];
const DOWN = [
  '....a...a....',
  '.....a.a.....',
  '......b......',
  '...wwwbwww...',
  '.wWWWWbWWWWw.',
  'hWWWwwbwwWWWh',
  '.hWWd.b.dWWh.',
  '..hd..b..dh..',
];
// ---- landed on the glass (dorsal, head up)
/** the touch-down: wings still open, 15 wide */
const TOUCH = [
  '....a.....a....',
  '.....a...a.....',
  '......ebe......',
  '.dddd.bbb.dddd.',
  'dWWWWdWbWdWWWWd',
  'dWWsWWWbWWWsWWd',
  '.dWWWWwbwWWWWd.',
  '..dWWwwbwwWWd..',
  '...ddwdbdwdd...',
  '......dbd......',
];
/** folding, 13 wide */
const SETTLE = [
  '...a.....a...',
  '....a...a....',
  '.....ebe.....',
  '..dddbbbddd..',
  '.dWWWWbWWWWd.',
  'dWWsWWbWWsWWd',
  'dWWWWwbwWWWWd',
  '.dWWwwbwwWWd.',
  '..ddwwbwwdd..',
  '....dd.dd....',
];
/** the antenna twitch on the settled drawing (one drawing, 2 frames): the right antenna flicks out a pixel */
const TWITCH = ['...a......a..', '....a....a...', ...SETTLE.slice(2)];

/** where it settles: the landed drawings' centre column and bottom row (room frame coords); the cursor is
 *  x 96-99, y 76-83, so every landed drawing keeps >= 1 px of glass between its wing tip and the cursor */
export const REST_AT = {cx: 108, bottom: 82};

/** flight path keys: [outro frame, centre x, centre y] (room frame coords). The window closes into the cursor
 *  (o237-239), so the moth loses the pane's light and finds the cursor's in the same second. */
const PATH: Array<[number, number, number]> = [
  [O.mothIn, 70, -3], [O.mothIn + 4, 92, 18], [O.mothIn + 8, 128, 48], [O.mothIn + 10, 150, 64], // to the lit pane
  [O.mothIn + 12, 172, 58], [O.mothIn + 15, 160, 70], [O.mothIn + 18, 178, 64], // bumping at the glass
  [O.close + 1, 164, 72], // the window closes under it
  [O.cursorOn, 176, 84], [O.cursorOn + 2, 150, 80], [O.cursorOn + 4, 132, 71], [O.cursorOn + 6, 120, 73], // to the cursor
  [O.mothLand - 2, 112, 76], [O.mothLand, REST_AT.cx, REST_AT.bottom - 4],
];

/** the moth's centre at outro frame o (on 2s), or null before it enters */
export const mothPos = (o: number): [number, number] | null => {
  if (o < O.mothIn) return null;
  if (o >= O.mothLand) return [REST_AT.cx, REST_AT.bottom - 4];
  const k = o - ((o - O.mothIn) % 2);
  let i = 0;
  while (i < PATH.length - 2 && PATH[i + 1][0] <= k) i++;
  const [f0, x0, y0] = PATH[i], [f1, x1, y1] = PATH[i + 1];
  const t = Math.min(1, (k - f0) / Math.max(1, f1 - f0));
  const bob = [0, -2, -1, 1][((k - O.mothIn) / 2) % 4];
  return [Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t) + bob];
};

const stamp = (b: Buf, rows: string[], x: number, y: number, pal: MothPal, cyanRim: boolean, fade = 0) =>
  rows.forEach((r, j) => {
    let n = 0; // opaque body/wing pixels so far in this row, from the left (the side facing the cursor)
    for (let i = 0; i < r.length; i++) {
      const ch = r[i];
      let c = pal[ch];
      if (c === undefined) continue;
      const solid = ch !== 'e' && ch !== 'a';
      const rim = cyanRim && solid && n < 2;
      if (rim) c = n === 0 ? PAL.C5 : PAL.C3;
      else if (fade) c = fade === 1 ? stepColor(c, -1) : fade === 2 ? PAL.N2 : PAL.N1; // the room going down: only the cursor's rim stays lit
      if (solid) n++;
      b.set(x + i, y + j, c);
    }
  });

/**
 * Draw the moth at outro frame o in the ROOM. `dark` = the window has closed (the pane's glow is gone). The cursor's
 * rim light is on when the cursor is and the moth is within 24 px of it.
 */
export const drawMoth = (b: Buf, o: number, dark: boolean, cursorVisible: boolean, fade = 0) => {
  const p = mothPos(o);
  if (!p) return;
  const pal = dark ? DARK : LIT;
  const near = cursorVisible && Math.abs(p[0] - 98) < 24 && Math.abs(p[1] - 80) < 20;
  if (o >= O.mothLand) {
    const k = o - O.mothLand;
    // touch-down (wings open, o250-252) -> one antenna twitch (o254-255) -> settled; in the last blink's light it
    // flicks its wings open once (o257-258): motion is what makes 13 px read as a moth at phone size
    const rows = k < 3 || k === 7 || k === 8 ? TOUCH : k === 4 || k === 5 ? TWITCH : SETTLE;
    stamp(b, rows, REST_AT.cx - (rows[0].length >> 1), REST_AT.bottom - rows.length + 1, pal, near, fade);
    return;
  }
  const beat = ((o - ((o - O.mothIn) % 2) - O.mothIn) / 2) % 3;
  const rows = beat === 0 ? OPEN : beat === 1 ? MID : DOWN;
  stamp(b, rows, p[0] - 6, p[1] - 4, pal, near);
};

/** is the cursor lit at outro frame o (from its first on-phase at O.cursorOn to the last blink's end) */
export const cursorVisible = (o: number) => o >= O.cursorOn && o <= O.lastBlink + 7 && beatOn(o);
