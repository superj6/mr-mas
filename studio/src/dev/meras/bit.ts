// MR. MAS — meras: native 1-BIT painting for 1993 (authored in patterns, not thresholded).
// Two colours only (the engine's ONEBIT ink/paper). Every fill is a screen-aligned 8x8 MacPaint-style
// pattern, so textures are stable frame to frame and read as the era, not as noise.
import {Buf, Plot, rect, poly, ellipse, line} from '../../shared/pixel/px';

export const INK = 0x0e0e10;
export const PAPER = 0xe9e6da;

/** A pattern answers "is this pixel ink?" in screen space. */
export type Pat = (x: number, y: number) => boolean;
const rows = (r: string[]): Pat => (x, y) => {
  const row = r[((y % r.length) + r.length) % r.length];
  return row[((x % row.length) + row.length) % row.length] === '#';
};

/** Value ladder, darkest first: index = how much light (0 = ink ... 8 = paper). */
export const LV: Pat[] = [
  () => true, // 0 ink
  rows(['########', '###.####', '########', '#######.']), // 1  ~94% ink
  rows(['###.###.', '########', '.###.###', '########']), // 2  ~88%
  rows(['#.#.#.#.', '########', '.#.#.#.#', '########']), // 3  75%
  rows(['#.#.#.#.', '.#.#.#.#']), // 4  50%
  rows(['#...#...', '..#...#.', '#...#...', '..#...#.'].map((r, i) => (i % 2 ? r : r))), // 5 ~25%
  rows(['#...#...', '........', '..#...#.', '........']), // 6  12%
  rows(['#.......', '........', '....#...', '........']), // 7  6%
  () => false, // 8 paper
];
// fix level 5 to a true 25% (two per 4x2)
LV[5] = rows(['#...#...', '..#...#.']);

export const PATS = {
  ink: LV[0], paper: LV[8],
  /** horizontal rule every n rows */
  hl: (n: number, phase = 0): Pat => (_x, y) => (((y + phase) % n) + n) % n === 0,
  vl: (n: number, phase = 0): Pat => (x) => (((x + phase) % n) + n) % n === 0,
  /** diagonal "\" lines every n */
  diag: (n: number): Pat => (x, y) => (((x - y) % n) + n) % n === 0,
  /** wood grain: long horizontal dashes */
  grain: rows(['#######.....####', '................', '...####.......##', '................']),
  brick: rows(['########', '#.......', '#.......', '#.......', '########', '....#...', '....#...', '....#...']),
  /** pinstripe wallpaper: sparse vertical dots */
  pin: rows(['#.......', '........', '#.......', '........', '........', '........', '#.......', '........']),
};

/** Plot that paints a pattern. */
export const pp = (b: Buf, pat: Pat): Plot => (x, y) => b.set(x, y, pat(x, y) ? INK : PAPER);
/** Plot that paints only the INK of a pattern (paper stays whatever is underneath). */
export const inkOnly = (b: Buf, pat: Pat): Plot => (x, y) => { if (pat(x, y)) b.set(x, y, INK); };
/** Plot that paints only the PAPER of a pattern. */
export const paperOnly = (b: Buf, pat: Pat): Plot => (x, y) => { if (!pat(x, y)) b.set(x, y, PAPER); };

export const fillRect = (b: Buf, x: number, y: number, w: number, h: number, pat: Pat) => rect(x, y, w, h, pp(b, pat));
export const fillPoly = (b: Buf, pts: number[], pat: Pat) => poly(pts, pp(b, pat));
export const fillEll = (b: Buf, cx: number, cy: number, rx: number, ry: number, pat: Pat) => ellipse(cx, cy, rx, ry, pp(b, pat));
export const inkLine = (b: Buf, x0: number, y0: number, x1: number, y1: number) => line(x0, y0, x1, y1, b.ink(INK));
export const paperLine = (b: Buf, x0: number, y0: number, x1: number, y1: number) => line(x0, y0, x1, y1, b.ink(PAPER));

/**
 * Stepped light pool: level = f(distance) quantised to the ladder, resolved with each level's own pattern.
 * `lv(d)` maps normalised distance (0 centre .. 1 edge) to a ladder index. `clip` limits the region.
 */
export const pool = (b: Buf, x0: number, y0: number, w: number, h: number, cx: number, cy: number, rx: number, ry: number, lv: (d: number) => number, clip?: (x: number, y: number) => boolean) => {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      if (clip && !clip(x, y)) continue;
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      const k = Math.max(0, Math.min(8, Math.round(lv(d))));
      b.set(x, y, LV[k](x, y) ? INK : PAPER);
    }
};

/** String-map painter: legend char -> pattern (or 'ink' / 'paper'); ' ' and '.'-less chars not in legend are skipped. */
export type BitLegend = Record<string, Pat>;
export const BL: BitLegend = {
  '#': LV[0], '%': LV[3], ':': LV[4], ';': LV[5], ',': LV[6], "'": LV[7], o: LV[8],
};
export const paintBits = (b: Buf, x: number, y: number, map: readonly string[], legend: BitLegend = BL, flip = false, mask?: Uint8Array) => {
  map.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[flip ? r.length - 1 - i : i];
      const pat = legend[ch];
      if (!pat) continue;
      const X = x + i, Y = y + j;
      b.set(X, Y, pat(X, Y) ? INK : PAPER);
      if (mask && X >= 0 && Y >= 0 && X < b.w && Y < b.h) mask[Y * b.w + X] = 255;
    }
  });
};

/** Greyed-out (System 7 "disabled"): paper pixels survive only on a 50% checker. */
export const greyOut = (b: Buf, x0: number, y0: number, w: number, h: number, keep?: (x: number, y: number) => boolean) => {
  for (let y = Math.max(0, y0); y < Math.min(b.h, y0 + h); y++)
    for (let x = Math.max(0, x0); x < Math.min(b.w, x0 + w); x++) {
      if (keep && keep(x, y)) continue;
      const i = y * b.w + x;
      if (b.c[i] === PAPER && ((x + y) & 1)) b.c[i] = INK;
    }
};

/** Invert a rect (pressed buttons, selection). */
export const invertRect = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) b.set(x, y, b.get(x, y) === PAPER ? INK : PAPER);
};
