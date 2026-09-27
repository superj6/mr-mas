// MR. MAS — kit: THE GREY LADY's front page (Ep1 sc 33; new file, owned by the `v3-art-b` pass). naming.md: THE GREY LADY
// for The New York Times. Her character file: no real masthead or Gothic logo, a generic blackletter-free nameplate; the
// script: a plain serif masthead, never blackletter, over a front page's columns, so she reads as a newspaper before a
// word is read. Across the front, the only text under the masthead, a clerk's stamp, held to read:
// `COMPLAINT · THE GREY LADY v. MACROSOFT & NOPEAI · COPYRIGHT · FILED DEC 27, 2023` (the defendants in the caption's order).
//   drawFrontPageHigh(b, f, st)   [HIGH] (33.02) the paper on his desk from above: the masthead in a hand-pixelled plain
//                                 serif, a rule, six columns of greeked type with two photo blocks, the stamp across the
//                                 front in three lines; `settle` 0 | 1 | 2 (the page settling twice under the hold: 1 px)
//   drawPaperPlate(b, x, y, st)   the paper at the dark room's two-shot scale (33.01): 'fall' k (it drops flat from above
//                                 frame in 3 held steps) · 'down' (flat on the desk, the thud's dust); from the front the
//                                 folded paper is a thin slab with the masthead's row on its top face
//   serif(b, s, x, y, col)        the masthead's serif caps (12 px): T H E G R Y L A D and a space
import {Buf, rect, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {pt, pw} from './uitype';

const RH = 203;
// ------------------------------------------------------------------ the serif caps (12 px tall, hairline serifs)
const SERIF: Record<string, string[]> = {
  T: ['##########', '#...##...#', '....##....', '....##....', '....##....', '....##....', '....##....', '....##....', '....##....', '....##....', '...####...', '..######..'],
  H: ['####..####', '.##....##.', '.##....##.', '.##....##.', '.##....##.', '.########.', '.##....##.', '.##....##.', '.##....##.', '.##....##.', '.##....##.', '####..####'],
  E: ['#########.', '.##....##.', '.##.....#.', '.##.......', '.##...#...', '.######...', '.##...#...', '.##.......', '.##.....#.', '.##....##.', '.##...###.', '#########.'],
  G: ['..######..', '.##....##.', '##......#.', '##........', '##........', '##........', '##...#####', '##.....##.', '##.....##.', '.##....##.', '.##...###.', '..#####.#.'],
  R: ['########..', '.##....##.', '.##.....##', '.##.....##', '.##....##.', '.#######..', '.##..##...', '.##...##..', '.##...##..', '.##....##.', '.##....##.', '####...###'],
  Y: ['####..####', '.##....##.', '..##..##..', '..##..##..', '...####...', '....##....', '....##....', '....##....', '....##....', '....##....', '...####...', '..######..'],
  L: ['####......', '.##.......', '.##.......', '.##.......', '.##.......', '.##.......', '.##.......', '.##.......', '.##.....#.', '.##....##.', '.##...###.', '#########.'],
  A: ['....##....', '...####...', '...####...', '..##..##..', '..##..##..', '..##..##..', '.##....##.', '.########.', '.##....##.', '##......##', '##......##', '###....###'],
  D: ['#######...', '.##...##..', '.##....##.', '.##.....##', '.##.....##', '.##.....##', '.##.....##', '.##.....##', '.##.....##', '.##....##.', '.##...##..', '#######...'],
};
export const serifWidth = (s: string) => { let w = 0; for (const ch of s) w += ch === ' ' ? 7 : 12; return w - 2; };
export const serif = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    if (ch === ' ') { cx += 7; continue; }
    const g = SERIF[ch];
    if (g) g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + j, col); });
    cx += 12;
  }
};
export const GREY_LADY_STAMP = ['COMPLAINT', 'THE GREY LADY v. MACROSOFT & NOPEAI', 'COPYRIGHT · FILED DEC 27, 2023'];
export const drawFrontPageHigh = (b: Buf, f: number, st: {settle?: 0 | 1 | 2} = {}) => {
  // the dark desk round the paper's edges (the monitor's cyan on the wood), the paper nearly filling the frame
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.3 ? PAL.D2 : PAL.D1);
  const dy = st.settle === 1 ? 1 : 0;
  const X = 56, Y = 4 + dy, W = 368, H = 206;
  rect(X + 4, Y + 4, W, H, b.ink(PAL.N0));
  for (let y = Y; y < Math.min(RH, Y + H); y++) for (let x = X; x < X + W; x++) b.set(x, y, bayer(x, y) < 0.08 ? PAL.P1 : PAL.P2);
  rect(X, Y, W, 1, b.ink(PAL.W9));
  // the masthead: plain serif, centred; the date line and its two rules
  const m = 'THE GREY LADY';
  serif(b, m, X + Math.round((W - serifWidth(m)) / 2), Y + 8, PAL.N1);
  rect(X + 10, Y + 25, W - 20, 1, b.ink(PAL.N2)); rect(X + 10, Y + 34, W - 20, 1, b.ink(PAL.N2));
  pt(b, 'WEDNESDAY, DECEMBER 27, 2023', X + 12, Y + 27, PAL.N3);
  const price = 'LATE EDITION';
  pt(b, price, X + W - 12 - pw(price), Y + 27, PAL.N3);
  // six columns of greeked type, two photo blocks, a headline bar (greeked: no words under the masthead but the stamp)
  const colW = Math.floor((W - 24) / 6);
  for (let c = 0; c < 6; c++) {
    const cx = X + 12 + c * colW;
    for (let y = Y + 40; y < Y + H - 6; y += 4) {
      if ((c === 0 || c === 1) && y < Y + 58) { if (y < Y + 52) rect(cx, y, colW * 2 - 6, 3, b.ink(PAL.N3)); continue; }
      if (c === 4 && y > Y + 44 && y < Y + 100) { if (y === Y + 44 + 4) rect(cx, Y + 46, colW * 2 - 6, 52, b.ink(PAL.G4)); continue; }
      if (c === 5 && y > Y + 44 && y < Y + 100) continue;
      const w = colW - 6 - (hash(c, y, 4) < 0.2 ? Math.floor(hash(c, y, 5) * 12) : 0);
      for (let i = 0; i < w; i++) if (hash(cx + i >> 1, y, 6) < 0.8) b.set(cx + i, y, PAL.G4);
    }
    if (c > 0) rect(cx - 3, Y + 40, 1, H - 46, b.ink(PAL.P0));
  }
  for (let j = 0; j < 48; j++) for (let i = 0; i < colW * 2 - 8; i++) if (bayer(i, j) < 0.4) b.set(X + 12 + 4 * colW + 1 + i, Y + 48 + j, PAL.G2);
  // the clerk's stamp across the front: a double-ruled box in dark blue-black ink, three lines, a little crooked
  const lines = GREY_LADY_STAMP;
  const sw = Math.max(...lines.map((l) => pw(l))) + 26, sh = 12 + lines.length * 12 + 4;
  const sx = X + Math.round((W - sw) / 2), sy = Y + 86;
  // the stamp's ground: the page's type knocked back under it (a clerk's stamp over the columns)
  for (let j = -2; j < sh + 2; j++) for (let i = -2; i < sw + 2; i++) b.set(sx + i, sy + j, bayer(sx + i, sy + j) < 0.1 ? PAL.P1 : PAL.P2);
  const ink = PAL.N3;
  const tmp = new Buf(sw, sh, 0);
  for (let i = 0; i < sw; i++) { tmp.set(i, 0, 1); tmp.set(i, 2, 1); tmp.set(i, sh - 1, 1); tmp.set(i, sh - 3, 1); }
  for (let j = 0; j < sh; j++) { tmp.set(0, j, 1); tmp.set(2, j, 1); tmp.set(sw - 1, j, 1); tmp.set(sw - 3, j, 1); }
  lines.forEach((l, i) => { const lx = Math.round((sw - pw(l)) / 2); pt(tmp, l, lx, 8 + i * 12, 1); pt(tmp, l, lx + 1, 8 + i * 12, 1); }); // bold: a clerk's rubber stamp
  const onRule = (i: number, j: number) => j <= 2 || j >= sh - 3 || i <= 2 || i >= sw - 3;
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) if (tmp.get(i, j) && (!onRule(i, j) || hash(i >> 1, j >> 1, 17) > 0.12)) b.set(sx + i, sy + j + Math.round(-i / 90), ink);
  void f; void text; void textWidth; void stepColor;
};
/** the paper at the two-shot's scale: falling flat from above frame ('fall', k 0..2) or down on the desk ('down') */
export const drawPaperPlate = (b: Buf, x: number, deskY: number, st: {phase: 'fall' | 'down'; k?: number}) => {
  const w = 74, top = 5;
  const y = st.phase === 'fall' ? [-30, 20, deskY - 18][Math.min(2, st.k ?? 0)] : deskY - 4;
  // the folded paper: its top face (the masthead's row, columns as grey hatching), its front edge, a shadow
  if (st.phase === 'down') for (let i = 0; i < w + 6; i++) { b.set(x + i + 2, y + top + 2, PAL.N0); b.set(x + i + 3, y + top + 3, PAL.N0); }
  for (let j = 0; j < top; j++) for (let i = 0; i < w; i++) b.set(x + i + j, y + j, j === 0 ? PAL.P2 : (i + j) % 3 === 0 ? PAL.G5 : PAL.P1);
  rect(x + 2, y + 1, 30, 1, b.ink(PAL.N2));
  rect(x + top, y + top, w, 2, b.ink(PAL.P0)); rect(x + top, y + top + 2, w, 1, b.ink(PAL.G3));
  // the thud's dust: a few short lines out from under its edges, one drawing
  if (st.phase === 'down' && (st.k ?? 0) < 4) for (const [dx, dy] of [[-6, 4], [-10, 2], [w + 8, 4], [w + 12, 2]] as Array<[number, number]>) rect(x + dx, y + top + dy, 3, 1, b.ink(PAL.C3));
};
