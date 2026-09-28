// MR. MAS — kit: `PLEASE`, Mas's own ask (Ep1 sc 12, the act-out). New file (v3-art-a, 2026-09-27).
// The script: a hard cut, led by the pen's scratch (draft 6: the EMIT page and its thud are cut, C4), to his own desk
// from above: he is already writing on a single sheet with the MACROSOFT pen from the check, and has been; one word,
// its last letter still being drawn: PLEASE. The shot must show his hand and the pen on the sheet, never the word alone
// (the newcomer read took a word on its own for typing on a screen). Then the [ECU]: PLEASE and blank paper under it;
// the pen finishes the last letter and lifts (THREAT, once, on the lift).
// The word is HANDWRITTEN: hand-set pen strokes (1 px, ink blue, a little uneven), never the typeset face.
//   drawPleaseHigh(b, f, st)   [HIGH] st.n letters written (0..6), st.part 0..1 of the letter being drawn, st.shake
//   drawPleaseECU(b, f, st)    [ECU] st.lift 0 (the pen on the last stroke) · 1 lifting · 2 lifted clear
//   PLEASE_INK                 the ink colour
// v3.1 opt-ins (draft 7; the v3 defaults are unchanged): drawPleaseHigh st.desk 'v31' (EMIT and the printed letter
// beside the sheet), st.waterStill; drawPleaseECU st.reg / st.regPart (the sheet reads PLEASE / REG, the pen lifting
// mid-word). Glyphs R and G added (hand-set, as the others).
import {Buf, rect, line, ellipse, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {drawLetterPage} from './pause-letter';
import {drawEmitSpread} from './emit-oped';

export const PLEASE_INK = PAL.I0;
const RH = 203;
// pen glyphs, 9 x 13 (1 px strokes, hand-uneven): P L E A S E
const GLYPH: Record<string, string[]> = {
  P: ['.######..', '.#.....#.', '.#......#', '.#......#', '.#.....#.', '.######..', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '##.......'],
  L: ['.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.....#.', '.#######.'],
  E: ['.#######.', '.#.......', '.#.......', '.#.......', '.#.......', '.######..', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.########'],
  A: ['....#....', '...#.#...', '...#.#...', '..#...#..', '..#...#..', '..#...#..', '.#.....#.', '.#######.', '.#.....#.', '#.......#', '#.......#', '#.......#', '#.......#'],
  S: ['..#####..', '.#.....#.', '#........', '#........', '.#.......', '..###....', '.....##..', '.......#.', '........#', '........#', '#......#.', '.#....#..', '..####...'],
  // v3.1 (12.06, draft 7: the line below begins REG and the pen lifts mid-word)
  R: ['.######..', '.#.....#.', '.#......#', '.#......#', '.#.....#.', '.######..', '.#...#...', '.#....#..', '.#....#..', '.#.....#.', '.#.....#.', '.#......#', '##......#'],
  G: ['...####..', '..#....#.', '.#.......', '#........', '#........', '#........', '#....###.', '#.......#', '#.......#', '.#......#', '.#.....#.', '..#...#..', '...###...'],
};
const WORD = 'PLEASE';
/** stroke order for a partial letter: draw the glyph's ink pixels in reading order down its rows, the first `part` */
const drawWord = (b: Buf, x: number, y: number, n: number, part: number, k = 1, jitter = true, word = WORD) => {
  let cx = x;
  for (let i = 0; i < Math.min(word.length, n + (part > 0 ? 1 : 0)); i++) {
    const g = GLYPH[word[i]];
    const pts: Array<[number, number]> = [];
    g.forEach((row, j) => [...row].forEach((c, ii) => { if (c === '#') pts.push([ii, j]); }));
    const upto = i < n ? pts.length : Math.round(pts.length * part);
    const dy = jitter ? Math.round((hash(i, 1, 41) - 0.5) * 2) : 0;
    for (let q = 0; q < upto; q++) { const [ii, j] = pts[q]; for (let a = 0; a < k; a++) for (let c2 = 0; c2 < k; c2++) b.set(cx + ii * k + a, y + (j + dy) * k + c2, PLEASE_INK); }
    cx += (g[0].length + 2) * k;
  }
  return cx;
};
const wordW = (k = 1, word = WORD) => word.split('').reduce((w, ch) => w + (GLYPH[ch][0].length + 2) * k, -2 * k);

/** the MACROSOFT pen (slate barrel, a chrome clip and tip), from its tip at (tx, ty) back up-right along the grip */
const pen = (b: Buf, tx: number, ty: number, len = 46) => {
  for (let t = 0; t < len; t++) {
    const x = tx + Math.round(t * 0.72), y = ty - Math.round(t * 0.7);
    const c = t < 3 ? PAL.G6 : t < 6 ? PAL.G4 : t > len - 4 ? PAL.G5 : PAL.N5;
    b.set(x, y, c); b.set(x + 1, y, t < 6 ? PAL.G3 : PAL.N4); b.set(x, y - 1, t >= 6 && t < len - 4 ? PAL.N6 : c);
  }
  for (let t = 22; t < 36; t++) b.set(tx + Math.round(t * 0.72) - 1, ty - Math.round(t * 0.7) - 1, PAL.G6); // its clip
};
/** his writing hand from above: the back of the hand angled toward the tip, four knuckles, the thumb and the index
 *  pinching the pen a finger's length above the paper, the hoodie cuff at the wrist; his other hand flat on the sheet */
const HAND_W = [
  '..........oo44oo........',
  '........oo455544oo......',
  '......oo45555555544o....',
  '....oo4555554555555o....',
  '...o455554445554555o....',
  '..o45555555555555554o...',
  '.o455555555555555554o...',
  '.o455555555555555543o...',
  'o4555555555555555433o...',
  'o455555555555555433o....',
  'o44555555555554433o.....',
  '.o4445555555443333o.....',
  '..oo44444443333oo.......',
  '....oooo3333oo..........',
];
const HAND_FLAT = [
  '..oo..oo..oo..oo....',
  '.o44oo44oo44oo44o...',
  '.o44o.o44o44o.44o...',
  '.o44o.o44o44o.44o...',
  '.o445544554455444oo.',
  'o44555555555555544o.',
  'o45555555555555554o.',
  'o45555555555555554o.',
  'o44555555555555543o.',
  '.o444555555555443o..',
  '..oo444444444433o...',
  '....oooooooooooo....',
];
const HP: Record<string, number> = {o: PAL.S1, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
const stampRows = (b: Buf, rows: string[], x: number, y: number) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = HP[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
const hands = (b: Buf, tx: number, ty: number, flatX: number, flatY: number) => {
  // the writing hand's sleeve (from the bottom-right corner up to the wrist) and its cuff
  for (let y = ty + 8; y < RH; y++) { const t = (y - ty - 8) / (RH - ty - 8); const x0 = tx + 22 + Math.round(t * 50), w = 28 + Math.round(t * 12); for (let x = x0; x < x0 + w; x++) b.set(x, y, x === x0 ? PAL.G4 : x > x0 + w - 5 ? PAL.G1 : PAL.G2); }
  // the back of the hand: an oval angled toward the tip, a knuckle ridge (a rung up), the far edge in shadow
  for (let j = -16; j < 14; j++) for (let i = -2; i < 40; i++) {
    const u = i - 20, v = j + u * 0.35;
    const d = Math.hypot(u / 19, v / 11);
    if (d > 1) continue;
    const X = tx + 8 + i, Y = ty - 2 + j;
    b.set(X, Y, d > 0.9 ? PAL.S1 : v < -5 ? PAL.S5 : v > 5 ? PAL.S3 : PAL.S4);
  }
  for (let k = 0; k < 4; k++) { const kx = tx + 12 + k * 6, ky = ty - 12 + Math.round(k * 2.1); rect(kx, ky, 4, 2, b.ink(PAL.S5)); b.set(kx, ky + 2, PAL.S3); }
  rect(tx + 26, ty + 8, 24, 5, b.ink(PAL.G3)); rect(tx + 26, ty + 8, 24, 1, b.ink(PAL.G5));
  // the thumb and index pinching the pen above the tip
  for (let j = 0; j < 7; j++) for (let i = 0; i < 10; i++) if (Math.hypot((i - 5) / 5, (j - 3) / 3.5) < 1) b.set(tx + 2 + i, ty - 4 + j, j < 2 ? PAL.S5 : PAL.S4);
  b.set(tx + 1, ty - 2, PAL.S1); b.set(tx + 1, ty - 1, PAL.S1);
  // the other hand flat on the sheet at its left edge: a palm and four fingers up the page, its sleeve
  for (let y = flatY + 14; y < RH; y++) { const t = (y - flatY - 14) / (RH - flatY - 14); const x0 = flatX - 2 - Math.round(t * 44), w = 30 + Math.round(t * 10); for (let x = x0; x < x0 + w; x++) b.set(x, y, x === x0 + w - 1 ? PAL.G4 : x < x0 + 4 ? PAL.G1 : PAL.G2); }
  rect(flatX - 1, flatY + 12, 30, 4, b.ink(PAL.G3));
  for (let j = 0; j < 16; j++) for (let i = 0; i < 30; i++) if (Math.hypot((i - 15) / 15, (j - 8) / 8) < 1) b.set(flatX + i, flatY - 2 + j, j < 4 ? PAL.S5 : i > 24 ? PAL.S3 : PAL.S4);
  for (let k = 0; k < 4; k++) { const fx = flatX + 3 + k * 7; for (let j = 0; j < 12; j++) for (let i = 0; i < 5; i++) if (Math.hypot((i - 2) / 2.6, (j - 6) / 6.5) < 1) b.set(fx + i, flatY - 13 + j + (k === 0 ? 4 : k === 3 ? 2 : 0), i === 0 ? PAL.S3 : j < 3 ? PAL.S5 : PAL.S4); }
};

export interface PleaseHighState {
  n?: number; part?: number; shake?: [number, number];
  /** v3.1 (opt-in, 12.04 in draft 7): the magazine (EMIT, open at the op-ed) and the printed pause letter under it lie
   *  beside the sheet on the desk's right, where the laptop's corner was: he writes between the two asks */
  desk?: 'v31';
  /** v3.1: his glass's water line stays put while the desk shakes (v31-12.03's thud carried into the cut) */
  waterStill?: boolean;
}
export const drawPleaseHigh = (b: Buf, f: number, st: PleaseHighState = {}) => {
  const [sx, sy] = st.shake ?? [0, 0];
  // his desk at night from above: the grey laminate, the lamp's cool pool; the laptop's corner, his glass, the button
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 260) / 280, (y - 60) / 200); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.7 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.G1 : PAL.G2); }
  if (st.desk === 'v31') {
    // out of the lamp's pool (a rung down), so PLEASE and his hand keep the eye
    const t = new Buf(480, RH, PAL.G2);
    drawLetterPage(t, 352, 6, 150, 124, {print: true});
    drawEmitSpread(t, 372, 58);
    for (let y = 0; y < RH; y++) for (let x = 350; x < 480; x++) { const c = t.get(x, y); if (c !== PAL.G2) b.set(x + sx, y + sy, stepColor(c, -1)); }
  } else { rect(380 + sx, 0, 100, 44, b.ink(PAL.N1)); rect(380 + sx, 44, 100, 2, b.ink(PAL.G3)); rect(384 + sx, 4, 92, 36, b.ink(PAL.N0)); }
  const wy0 = st.waterStill ? 36 : 36 + sy, wx0 = st.waterStill ? 60 : 60 + sx;
  ellipse(60 + sx, 40 + sy, 13, 13, b.ink(PAL.G5)); ellipse(60 + sx, 40 + sy, 11, 11, b.ink(PAL.C5)); for (let i = -7; i <= 7; i++) b.set(wx0 + i, wy0, PAL.C8);
  rect(22 + sx, 90 + sy, 26, 14, b.ink(PAL.P0)); rect(22 + sx, 90 + sy, 26, 1, b.ink(PAL.P2)); ellipse(32 + sx, 96 + sy, 3, 3, b.ink(PAL.P2));
  // the sheet, a little askew from square (a hand-placed page), its shadow
  const px = 120 + sx, py = 26 + sy, pw0 = 220, ph = 170;
  rect(px + 3, py + 3, pw0, ph, b.ink(PAL.G1));
  rect(px, py, pw0, ph, b.ink(PAL.P2)); rect(px, py, pw0, 1, b.ink(PAL.P2)); rect(px + pw0 - 1, py, 1, ph, b.ink(PAL.P1));
  const n = st.n ?? 5, part = st.part ?? 0.6;
  const wx = px + 40, wy = py + 42;
  const end = drawWord(b, wx, wy, n, part, 2);
  // the pen's tip where the stroke is, the hand gripping it, the other hand flat at the sheet's left
  const tipX = Math.min(end, wx + wordW(2)) - 4, tipY = wy + 20;
  pen(b, tipX, tipY);
  hands(b, tipX + 4, tipY - 10, px + 8, py + 110);
};

export interface PleaseEcuState {
  lift?: 0 | 1 | 2;
  /** v3.1 (opt-in, 12.06 in draft 7): the second line, REG: letters written (0..3) and the part of the one being
   *  drawn; the layout moves PLEASE up to make room, and the pen works (and lifts) on REG, not on PLEASE's last E */
  reg?: number;
  regPart?: number;
}
/** [ECU] the sheet: PLEASE and blank paper under it (the rest arrives by May); the pen finishes and lifts */
export const drawPleaseECU = (b: Buf, f: number, st: PleaseEcuState = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.04 ? PAL.P1 : PAL.P2);
  // the lamp's cool fall-off at the page's bottom
  for (let y = 150; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < (y - 150) / 90) b.set(x, y, PAL.P1);
  const k = 5;
  const two = st.reg !== undefined;
  const x = Math.round((480 - wordW(k)) / 2), y = two ? 12 : 30;
  drawWord(b, x, y, 6, 0, k, false);
  const lift = st.lift ?? 0;
  let tipX = x + wordW(k) - 6 * k + 2 * k, tipY = y + 12 * k + (lift === 0 ? 0 : lift === 1 ? -8 : -26);
  if (two) {
    // REG on the line below, from PLEASE's left margin, a hand's slant (a pixel lower per letter): the pen on its
    // last stroke, then lifting mid-word
    const ry = y + 13 * k + 14, n = st.reg ?? 3, part = st.regPart ?? 0;
    const end = drawWord(b, x + 4, ry, n, part, k, false, 'REG');
    tipX = Math.min(end, x + 4 + wordW(k, 'REG')) - 2 * k; tipY = ry + 12 * k + (lift === 0 ? 0 : lift === 1 ? -8 : -26);
  }
  // the pen's shadow on the paper, then the pen (the tip off the paper once it lifts)
  for (let t = 0; t < 120; t++) { const X = tipX + 6 + Math.round(t * 0.72), Y = tipY + 10 + (lift ? 8 : 0) - Math.round(t * 0.7); if (Y > 0 && bayer(X, Y) < 0.6) for (let w = 0; w < 5; w++) b.set(X + w, Y, stepColor(b.get(X + w, Y), -1)); }
  for (let t = 0; t < 120; t++) { const X = tipX + Math.round(t * 0.72), Y = tipY - Math.round(t * 0.7); const c = t < 5 ? PAL.G6 : t < 12 ? PAL.G4 : PAL.N5; for (let w = 0; w < 4; w++) b.set(X + w, Y, w === 0 ? PAL.N6 : w === 3 ? PAL.N3 : c); }
  void line; void hash;
};
