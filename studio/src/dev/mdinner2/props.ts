// MR. MAS — mdinner2: table dressing that must MOVE in this span (mdinner1's set draws it still).
// Drawn to mdinner1's exact designs (set.ts drawGlass / drawCandle rows), plus the new drawings:
//   the wine sloshing (3 drawings + drops, held), the candle laid flat by the downdraft, then out,
//   Mas's water line (dead flat, always), place cards (the name cards, shrunk), the crushed effigy.
import {Buf, rect, PAL} from '../../shared/pixel';
import {micro, microWidth} from '../../shared/pixel/cast/bosses';

const stamp = (b: Buf, x: number, y: number, rows: string[], pal: Record<string, number>) =>
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });

// mdinner1's stemmed glass (6x10) with the wine surface redrawn per slosh drawing.
// 0 calm (identical to mdinner1), 1 tipped left + a drop, 2 tipped right + drops, 3 the splash crown (freeze)
const GLASS: Record<number, string[]> = {
  0: ['g....h', 'o....o', 'o....o', 'oRRRro', '.oRro.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'],
  1: ['g....h', 'o....o', 'or...o', 'oRRr.o', '.oRro.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'],
  2: ['g....h', 'o....o', 'o...ro', 'o.rRRo', '.oRro.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'],
  3: ['g.r..h', 'or..ro', 'o.rr.o', 'oRRRro', '.oRro.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'],
};
const DROPS: Record<number, Array<[number, number]>> = {1: [[-1, -3], [-2, -5]], 2: [[6, -2], [7, -4], [5, -6]], 3: [[1, -4], [4, -5], [2, -7], [-1, -2]]};
/** (x, y) = the foot (same anchor as mdinner1's drawGlass) */
export const drawGlassSlosh = (b: Buf, x: number, y: number, k: number) => {
  const pal: Record<string, number> = {o: PAL.N5, g: PAL.W7, h: PAL.N6, R: PAL.R1, r: PAL.R2};
  stamp(b, x - 3, y - 9, GLASS[k] ?? GLASS[0], pal);
  for (const [i, j] of DROPS[k] ?? []) b.set(x - 3 + i, y - 9 + j, j < -4 ? PAL.R1 : PAL.R2);
};

/** Mas's water: mdinner1's empty glass + a water line that never moves. (x, y) = foot. */
export const drawWaterLine = (b: Buf, x: number, y: number) => {
  rect(x - 2, y - 7, 4, 1, b.ink(PAL.P1));
  rect(x - 2, y - 6, 4, 2, b.ink(PAL.X3));
  b.set(x - 1, y - 5, PAL.P0);
};

/**
 * A taper laid flat by the downdraft (the stick and taper are mdinner1's drawCandle drawing; the flame is new).
 * state 1 = flat, streaming away from the booster (dir -1 = to the left); state 2 = snuffed, a thread of smoke.
 */
export const drawCandleBlown = (b: Buf, x: number, y: number, w: number, state: 1 | 2, dir: -1 | 1) => {
  rect(x - 1, y - 10, 3, 9, b.ink(PAL.P1));
  b.set(x - 1, y - 10, PAL.P2); rect(x - 1, y - 9, 1, 8, b.ink(PAL.P2));
  rect(x + 1, y - 9, 1, 8, b.ink(PAL.P0));
  rect(x - 2, y - 2, 5, 1, b.ink(PAL.W5));
  rect(x - 1, y - 1, 3, 1, b.ink(PAL.W3));
  rect(x - 3, y, 7, 1, b.ink(PAL.W4));
  b.set(x - 2, y, PAL.W6);
  if (state === 2) {
    // snuffed: the wick glows once, a thread of smoke leans away
    b.set(x, y - 11, PAL.W3);
    for (let j = 0; j < 5; j++) b.set(x + dir * Math.floor(j / 2), y - 12 - j, j < 2 ? PAL.N6 : PAL.N5);
    return;
  }
  const k = Math.floor(w / 2) % 2;
  const fl = [['.yYWW', 'ooyy.'], ['yYWWo', '.oyy.']][k];
  const fp: Record<string, number> = {W: PAL.W7, Y: PAL.W9, y: PAL.W5, o: PAL.W4};
  fl.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = fp[r[i]]; if (c !== undefined) b.set(x + dir * (1 + i), y - 12 + j, c); } });
};

/** the knocked-over candle (the one the booster lands beside): taper lying on the cloth, out */
export const drawCandleFallen = (b: Buf, x: number, y: number) => {
  rect(x - 3, y, 7, 1, b.ink(PAL.W4));
  rect(x + 2, y - 2, 9, 2, b.ink(PAL.P1));
  rect(x + 2, y - 2, 9, 1, b.ink(PAL.P2));
  b.set(x + 11, y - 2, PAL.N4); b.set(x + 12, y - 3, PAL.N5);
};

/** tent place card on the cloth (a name card, shrunk): one or two lines of micro type. (x, y) = bottom centre */
export const drawPlaceCard = (b: Buf, x: number, y: number, lines: string[], accent: number, hop = 0) => {
  const w = Math.max(...lines.map(microWidth)) + 6, h = lines.length * 6 + 3;
  const X = x - Math.floor(w / 2), Y = y - h - hop;
  rect(X, Y, w, h, b.ink(PAL.P2));
  rect(X, Y, w, 1, b.ink(accent));
  rect(X, Y + h - 1, w, 1, b.ink(PAL.P0));
  rect(X + w, Y + 1, 1, h - 1, b.ink(PAL.X2));
  lines.forEach((ln, i) => micro(b, ln, x - Math.floor(microWidth(ln) / 2), Y + 2 + i * 6, i === 0 ? PAL.N1 : PAL.N6));
};

/** the paperclip effigy, flattened under a landing pad: a bent wire in the cloth, and soot */
export const drawEffigyCrushed = (b: Buf, x: number, y: number) => {
  const rows = ['..k..kk....k', 'kgGgggGggggk', '.kkk..kk.kk.'];
  stamp(b, x - 6, y - 2, rows, {g: PAL.G4, G: PAL.G6, k: PAL.N2});
};
