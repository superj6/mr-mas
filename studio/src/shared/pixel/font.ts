// MR. MAS — shared pixel engine: hand-pixelled 7px bitmap font (cap height 7, x-height 5, 2px descenders).
// Glyph rows 0..6 sit on the baseline; rows 7..8 are descenders.
import {Buf} from './px';

const G: Record<string, string> = {
  A: '.###.|#...#|#...#|#####|#...#|#...#|#...#',
  B: '####.|#...#|#...#|####.|#...#|#...#|####.',
  C: '.###.|#...#|#....|#....|#....|#...#|.###.',
  D: '####.|#...#|#...#|#...#|#...#|#...#|####.',
  E: '#####|#....|#....|####.|#....|#....|#####',
  F: '#####|#....|#....|####.|#....|#....|#....',
  G: '.###.|#...#|#....|#.###|#...#|#...#|.####',
  H: '#...#|#...#|#...#|#####|#...#|#...#|#...#',
  I: '###|.#.|.#.|.#.|.#.|.#.|###',
  J: '..###|...#.|...#.|...#.|#..#.|#..#.|.##..',
  K: '#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#',
  L: '#....|#....|#....|#....|#....|#....|#####',
  M: '#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#',
  N: '#...#|##..#|#.#.#|#..##|#...#|#...#|#...#',
  O: '.###.|#...#|#...#|#...#|#...#|#...#|.###.',
  P: '####.|#...#|#...#|####.|#....|#....|#....',
  Q: '.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#',
  R: '####.|#...#|#...#|####.|#.#..|#..#.|#...#',
  S: '.###.|#...#|#....|.###.|....#|#...#|.###.',
  T: '#####|..#..|..#..|..#..|..#..|..#..|..#..',
  U: '#...#|#...#|#...#|#...#|#...#|#...#|.###.',
  V: '#...#|#...#|#...#|#...#|.#.#.|.#.#.|..#..',
  W: '#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#',
  X: '#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
  Y: '#...#|#...#|.#.#.|..#..|..#..|..#..|..#..',
  Z: '#####|....#|...#.|..#..|.#...|#....|#####',
  a: '....|....|.##.|...#|.###|#..#|.###',
  b: '#...|#...|###.|#..#|#..#|#..#|###.',
  c: '...|...|.##|#..|#..|#..|.##',
  d: '...#|...#|.###|#..#|#..#|#..#|.###',
  e: '....|....|.##.|#..#|####|#...|.###',
  f: '..#|.#.|###|.#.|.#.|.#.|.#.',
  g: '....|....|.###|#..#|#..#|.###|...#|...#|.##.',
  h: '#...|#...|###.|#..#|#..#|#..#|#..#',
  i: '#|.|#|#|#|#|#',
  j: '..#|...|..#|..#|..#|..#|..#|..#|##.',
  k: '#...|#...|#..#|#.#.|##..|#.#.|#..#',
  l: '##|.#|.#|.#|.#|.#|.#',
  m: '.....|.....|##.#.|#.#.#|#.#.#|#.#.#|#.#.#',
  n: '....|....|###.|#..#|#..#|#..#|#..#',
  o: '....|....|.##.|#..#|#..#|#..#|.##.',
  p: '....|....|###.|#..#|#..#|###.|#...|#...|#...',
  q: '....|....|.###|#..#|#..#|.###|...#|...#|...#',
  r: '...|...|#.#|##.|#..|#..|#..',
  s: '....|....|.###|#...|.##.|...#|###.',
  t: '.#.|.#.|###|.#.|.#.|.#.|..#',
  u: '....|....|#..#|#..#|#..#|#..#|.###',
  v: '.....|.....|#...#|#...#|.#.#.|.#.#.|..#..',
  w: '.....|.....|#...#|#...#|#.#.#|#.#.#|.#.#.',
  x: '....|....|#..#|#..#|.##.|#..#|#..#',
  y: '....|....|#..#|#..#|#..#|.###|...#|...#|.##.',
  z: '....|....|####|...#|.##.|#...|####',
  '0': '.###.|#...#|#..##|#.#.#|##..#|#...#|.###.',
  '1': '.#.|##.|.#.|.#.|.#.|.#.|###',
  '2': '.###.|#...#|....#|..##.|.#...|#....|#####',
  '3': '####.|....#|....#|.###.|....#|....#|####.',
  '4': '...#.|..##.|.#.#.|#..#.|#####|...#.|...#.',
  '5': '#####|#....|####.|....#|....#|#...#|.###.',
  '6': '.###.|#....|#....|####.|#...#|#...#|.###.',
  '7': '#####|....#|...#.|..#..|..#..|..#..|..#..',
  '8': '.###.|#...#|#...#|.###.|#...#|#...#|.###.',
  '9': '.###.|#...#|#...#|.####|....#|....#|.###.',
  '!': '#|#|#|#|#|.|#',
  '?': '.###.|#...#|....#|...#.|..#..|.....|..#..',
  '.': '.|.|.|.|.|.|#',
  ',': '.|.|.|.|.|.|#|#',
  ':': '.|.|#|.|.|.|#',
  "'": '#|#|.|.|.|.|.',
  '"': '#.#|#.#|...|...|...|...|...',
  '-': '....|....|....|####|....|....|....',
  '/': '....#|...#.|...#.|..#..|.#...|.#...|#....',
  '(': '.#|#.|#.|#.|#.|#.|.#',
  ')': '#.|.#|.#|.#|.#|.#|#.',
  '>': '#...|.#..|..#.|...#|..#.|.#..|#...',
  '_': '.....|.....|.....|.....|.....|.....|#####',
  '*': '.....|#.#.#|.###.|#####|.###.|#.#.#|.....',
  '+': '.....|..#..|..#..|#####|..#..|..#..|.....',
  '=': '....|....|####|....|####|....|....',
  ';': '.|.|#|.|.|.|#|#',
  // additions (shared engine): money and the middle dot (fine print: "PRODUCTS: 0 · BUNKER: YES", "$133M")
  '$': '..#..|.####|#.#..|.###.|..#.#|####.|..#..',
  '·': '...|...|...|.#.|...|...|...',
  '✓': '......#|.....##|#...##.|##.##..|.###...|..#....|.......',
};

type Glyph = {w: number; rows: string[]};
const GLYPHS: Record<string, Glyph> = {};
for (const [k, v] of Object.entries(G)) {
  const rows = v.split('|');
  GLYPHS[k] = {w: rows[0].length, rows};
}

export const SPACE = 3;
export const TRACK = 1;
export const LINE_H = 11;

export const textWidth = (s: string) => {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? SPACE : (GLYPHS[ch]?.w ?? 4)) + TRACK;
  return Math.max(0, w - TRACK);
};

/** Draw text with its top at y (caps occupy y..y+6). Optional 1px drop shadow / outline colour. */
export const text = (b: Buf, s: string, x: number, y: number, col: number, opts: {shadow?: number; outline?: number} = {}) => {
  const draw = (ox: number, oy: number, c: number) => {
    let cx = x + ox;
    for (const ch of s) {
      if (ch === ' ') { cx += SPACE + TRACK; continue; }
      const g = GLYPHS[ch];
      if (!g) { cx += 4 + TRACK; continue; }
      g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + oy + j, c); });
      cx += g.w + TRACK;
    }
  };
  if (opts.outline !== undefined) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) draw(dx, dy, opts.outline);
  if (opts.shadow !== undefined) draw(1, 1, opts.shadow);
  draw(0, 0, col);
};

/** Greedy word wrap to a pixel width. */
export const wrap = (s: string, maxW: number) => {
  const words = s.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
};

// ---------- additions (shared engine): 2x display face ----------
// The 7px face upscaled with Scale2x/EPX: diagonals come out stepped-smooth (a hand-drawn-looking 14px
// display face, not a blocky 2x), stems are 2px. Used for name cards and title plates.
const S2: Record<string, Glyph> = {};
const scale2x = (g: Glyph): Glyph => {
  const h = g.rows.length, w = g.w;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? false : g.rows[y][x] === '#');
  const out: string[][] = Array.from({length: h * 2}, () => Array(w * 2).fill('.'));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const P0 = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      const e0 = C === A && C !== D && A !== B ? A : P0;
      const e1 = A === B && A !== C && B !== D ? B : P0;
      const e2 = D === C && D !== B && C !== A ? C : P0;
      const e3 = B === D && B !== A && D !== C ? D : P0;
      out[y * 2][x * 2] = e0 ? '#' : '.'; out[y * 2][x * 2 + 1] = e1 ? '#' : '.';
      out[y * 2 + 1][x * 2] = e2 ? '#' : '.'; out[y * 2 + 1][x * 2 + 1] = e3 ? '#' : '.';
    }
  return {w: w * 2, rows: out.map((r) => r.join(''))};
};
const big = (ch: string) => {
  let g = S2[ch];
  if (!g && GLYPHS[ch]) { g = scale2x(GLYPHS[ch]); S2[ch] = g; }
  return g;
};
export const BIG_SPACE = 6;
export const BIG_TRACK = 2;
/** Cap height of the display face (caps occupy y..y+13). */
export const BIG_CAP = 14;
export const bigTextWidth = (s: string) => {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? BIG_SPACE : (big(ch)?.w ?? 8)) + BIG_TRACK;
  return Math.max(0, w - BIG_TRACK);
};
/** Display text (14px caps). `shadow` = 1px drop shadow colour (drawn at +1,+1 then +2,+2 for depth when `deep`). */
export const bigText = (b: Buf, s: string, x: number, y: number, col: number, opts: {shadow?: number; deep?: boolean; outline?: number} = {}) => {
  const draw = (ox: number, oy: number, c: number) => {
    let cx = x + ox;
    for (const ch of s) {
      if (ch === ' ') { cx += BIG_SPACE + BIG_TRACK; continue; }
      const g = big(ch);
      if (!g) { cx += 8 + BIG_TRACK; continue; }
      g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + oy + j, c); });
      cx += g.w + BIG_TRACK;
    }
  };
  if (opts.outline !== undefined) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) draw(dx, dy, opts.outline);
  if (opts.shadow !== undefined) { if (opts.deep) draw(2, 2, opts.shadow); draw(1, 1, opts.shadow); }
  draw(0, 0, col);
};
