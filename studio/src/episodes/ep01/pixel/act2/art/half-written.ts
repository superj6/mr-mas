// MR. MAS — Ep1 Act Two art (the `v3-shots-act2-act3` pass, v3.4; new, additive, namespaced to Act Two): 13.13's insert
// for "mine's half written." (V.O., script draft 8.3). [ECU] his hand resting on the front pocket of his hoodie at the
// White House table, a folded sheet tucked in it, its top panel up out of the pocket: his own ask from Act One's desk,
// PLEASE and, on the line under it, REG, in the same hand-set pen strokes (kits/please-sheet's glyphs, redrawn here at 2x),
// the fold hiding the rest. The warm room light from the left. No face (the V.O.'s lips stay still by construction).
//   drawHalfWrittenECU(b, f, st)   st.press 0 | 1: his thumb presses the page a pixel further into the pocket (one
//                                  held drawing), the page with it
// v3.5 (script draft 8.4; opt-in, nothing changes when the options are off): the same insert serves sc 26 and sc 27's
// match. st.lift (px): he draws the page up out of the pocket, his hand with it, so REG and the dash after it (st.dash)
// show; st.surface 'baize': the same page and the same resting hand at the same place in frame, but flat on the witness
// table's green baize (no pocket: the folded-under panel shows below the crease). drawRestingHand is that hand alone
// (the wallet and the 2019 marker take the same hand: v35.ts).
//   penWord(b, word, x, y, k, clip)   his pen letters (P L E A S R G), exported for the 2019 whiteboard
import {Buf, rect, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {PLEASE_INK} from '../../../../../shared/pixel/kits/please-sheet';

const RH = 203;
// the pen glyphs (9 x 13, 1 px strokes, hand-uneven): the same drawings as kits/please-sheet.ts
const G: Record<string, string[]> = {
  P: ['.######..', '.#.....#.', '.#......#', '.#......#', '.#.....#.', '.######..', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '##.......'],
  L: ['.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.....#.', '.#######.'],
  E: ['.#######.', '.#.......', '.#.......', '.#.......', '.#.......', '.######..', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.#.......', '.########'],
  A: ['....#....', '...#.#...', '...#.#...', '..#...#..', '..#...#..', '..#...#..', '.#.....#.', '.#######.', '.#.....#.', '#.......#', '#.......#', '#.......#', '#.......#'],
  S: ['..#####..', '.#.....#.', '#........', '#........', '.#.......', '..###....', '.....##..', '.......#.', '........#', '........#', '#......#.', '.#....#..', '..####...'],
  R: ['.######..', '.#.....#.', '.#......#', '.#......#', '.#.....#.', '.######..', '.#...#...', '.#....#..', '.#....#..', '.#.....#.', '.#.....#.', '.#......#', '##......#'],
  G: ['...####..', '..#....#.', '.#.......', '#........', '#........', '#........', '#....###.', '#.......#', '#.......#', '.#......#', '.#.....#.', '..#...#..', '...###...'],
};
/** a word in the pen glyphs at scale `k`, clipped to `clip` (the page's visible panel); a pixel of hand wobble per letter */
export const penWord = (b: Buf, word: string, x: number, y: number, k: number, clip: (X: number, Y: number) => boolean) => {
  let cx = x;
  [...word].forEach((ch, i) => {
    const g = G[ch]; const wob = hash(i, word.length, 41) < 0.5 ? 0 : 1;
    g.forEach((row, j) => { for (let q = 0; q < row.length; q++) if (row[q] === '#') for (let a = 0; a < k; a++) for (let c = 0; c < k; c++) { const X = cx + q * k + a, Y = y + wob + j * k + c; if (clip(X, Y)) b.set(X, Y, PLEASE_INK); } });
    cx += 10 * k + (i % 2);
  });
};

/** his hand resting, relaxed, as in the pocket insert: the back of the hand from the cuff at frame right, four fingers
 *  of different lengths lying left, their tips curling a little down; `hy` = the fingers' root row (116 in the insert);
 *  `dx` shifts it sideways. The warm light on their tops, the undersides in shade, the knuckles' creases */
export const drawRestingHand = (b: Buf, hy: number, dx = 0, o: {cuff?: number[]} = {}) => {
  const capsule = (x0: number, y0: number, x1: number, y1: number, w0: number, w1: number) => {
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    for (let t = -w0; t <= L + w1; t += 0.5) for (let q = -w0; q <= w0; q += 0.5) {
      const tt = Math.max(0, Math.min(L, t)), w = w0 + (w1 - w0) * (tt / L);
      const beyond = t < 0 ? -t : t > L ? t - L : 0;
      if (Math.hypot(beyond, q) > w) continue;
      const X = Math.round(x0 + dx + ux * t - uy * q), Y = Math.round(y0 + uy * t + ux * q);
      const v = q / w; // -1 the lit top edge .. 1 the shaded underside
      b.set(X, Y, Math.hypot(beyond, q) > w - 0.9 ? PAL.S1 : v < -0.55 ? PAL.S5 : v < 0.35 ? PAL.S4 : PAL.S3);
    }
  };
  // the back of the hand (under the fingers' roots), wide and flat, the tendons' faint lines
  for (let y = hy - 12; y < hy + 44; y++) for (let x = 326; x < 420; x++) {
    const e = Math.hypot((x - 380) / 52, (y - hy - 14) / 26); if (e > 1) continue;
    b.set(x + dx, y, e > 0.93 ? PAL.S1 : y < hy - 2 ? PAL.S5 : (x - 330) % 17 === 0 && y > hy + 2 ? PAL.S3 : PAL.S4);
  }
  // four fingers (index on top, the little finger lowest and shortest), from the knuckles leftward, tips turned down
  const F: Array<[number, number, number, number]> = [[344, hy - 6, 262, hy + 2], [340, hy + 6, 252, hy + 14], [342, hy + 18, 260, hy + 26], [346, hy + 30, 282, hy + 36]];
  F.forEach(([x0, y0, x1, y1], n) => { capsule(x0, y0, x1, y1, 6, 5); capsule(x1, y1, x1 - 7, y1 + 5, 5, 4); b.set(x0 + dx - 18 - n * 2, y0 + (y1 - y0) * 0.2, PAL.S2); b.set(x0 + dx - 19 - n * 2, y0 + (y1 - y0) * 0.2 + 1, PAL.S2); });
  // the nails at the tips (their pale tops), the thumb tucked under, the cuff
  F.forEach(([, , x1, y1]) => { rect(x1 + dx - 9, y1 + 1, 4, 3, b.ink(PAL.S6)); });
  capsule(360, hy + 42, 318, hy + 46, 6, 5);
  const [c0, c1, c2] = o.cuff ?? [PAL.G5, PAL.G2, PAL.G3];
  for (let y = hy - 22; y < hy + 62; y++) for (let x = 412; x < 480; x++) b.set(x + dx, y, x < 418 ? c0 : (x + y) % 3 === 0 ? c1 : c2);
};

export interface HalfWrittenState {
  press?: 0 | 1;
  /** v3.5: px the page (and his hand) are drawn up out of the pocket */
  lift?: number;
  /** v3.5: the pen's dash after REG (the sentence stops there) */
  dash?: boolean;
  /** v3.5: 'baize' = the same page and hand flat on the witness table (sc 27's match) */
  surface?: 'hoodie' | 'baize';
}
export const drawHalfWrittenECU = (b: Buf, f: number, st: HalfWrittenState = {}) => {
  const baize = st.surface === 'baize';
  const lift = st.lift ?? 0;
  if (baize) {
    // the witness table's green baize, close (as the wallet's ECU), the far side a rung darker
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 18 ? (bayer(x, y) < 0.3 ? PAL.L0 : PAL.N1) : bayer(x, y) < 0.3 ? PAL.L1 : PAL.L0);
  } else {
    // the hoodie's front, close: soft grey jersey, lit warm from the left, a fold running down from the chest
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const t = x / 480 + Math.sin(y / 40 + x / 90) * 0.05;
      let c = t < 0.28 ? PAL.G4 : t < 0.62 ? PAL.G3 : t < 0.88 ? PAL.G2 : PAL.G1;
      if (bayer(x, y) < 0.12) c = c === PAL.G4 ? PAL.G5 : c;
      const fold = Math.abs(x - (300 + Math.sin(y / 30) * 6)) < 2;
      b.set(x, y, fold ? PAL.G1 : c);
    }
  }
  // the kangaroo pocket's opening: a hem band with its stitching, the dark slit under it
  const py = 132;
  const hem = (x: number) => py + Math.round(Math.sin(x / 70) * 2);
  if (!baize) for (let x = 40; x < 470; x++) {
    const yy = hem(x);
    rect(x, yy - 6, 1, 6, b.ink(x < 150 ? PAL.G5 : PAL.G4));
    if (x % 5 < 2) b.set(x, yy - 3, PAL.G2); // the stitching
    rect(x, yy, 1, 3, b.ink(PAL.N0)); b.set(x, yy + 3, PAL.G1);
  }
  // the folded sheet: its top panel, tilted, the fold's crease and shadow across the words' foot (in the pocket, clipped
  // at its hem; on the table, whole, the folded-under panel below the crease)
  const d = (st.press ? 1 : 0) - lift;
  const px0 = 150, px1 = 330, top = 38 + d, crease = 118 + d;
  const foot = (X: number) => (baize ? crease + 34 + Math.round((X - px0) * 0.06) : hem(X) - 6);
  const inPage = (X: number, Y: number) => { const sk = Math.round((X - px0) * 0.06); return X >= px0 && X < px1 && Y >= top + sk && Y < foot(X); };
  for (let y = 0; y < RH; y++) for (let x = px0 - 2; x < px1 + 3; x++) {
    if (!inPage(x, y)) { if (inPage(x - 3, y - 3) && !inPage(x, y)) b.set(x, y, baize ? PAL.N1 : PAL.G1); continue; } // its shadow
    const edge = !inPage(x - 1, y) || !inPage(x + 1, y) || !inPage(x, y - 1) || (baize && !inPage(x, y + 1));
    const c = edge ? PAL.P0 : y > crease ? (y === crease + 1 ? PAL.G6 : PAL.P1) : bayer(x, y) < 0.1 ? PAL.P1 : PAL.P2;
    b.set(x, y, c);
  }
  // his ask in his own hand: PLEASE, and REG on the line under it (and the dash), the crease cutting the second line's foot
  const clip = (X: number, Y: number) => inPage(X, Y) && Y < crease;
  penWord(b, 'PLEASE', px0 + 14, top + 12, 2, clip);
  penWord(b, 'REG', px0 + 14, top + 50, 2, clip);
  if (st.dash) for (let i = 0; i < 16; i++) { const X = px0 + 82 + i, Y = top + 64 + (i > 10 ? 1 : 0); if (clip(X, Y)) { b.set(X, Y, PLEASE_INK); if (clip(X, Y + 1)) b.set(X, Y + 1, PLEASE_INK); } }
  drawRestingHand(b, py - 16 + d);
  void f;
};
