// MR. MAS — kit: the SENATE HEARING props (Ep1 sc 15; new file, owned by the `v3-art-b` pass).
//   drawMic(b, x, y, o)          a hearing microphone on its gooseneck with the small red light (lit when that senator
//                                speaks): room scale ('room') or bust scale ('bust')
//   stampMark(b, x, y, s, k, o)  SUCRAM's stamp mark `CALLED IT. (BEFORE LAUNCH.)` / `(BEFORE SUCRAM.)` in red ink:
//                                a double-ruled box, the ink broken where the rubber missed (k = the ink's seed), at 1x
//                                or 2x (the display face)
//   drawWalletECU(b, f, st)      [ECU] (15.12) the wallet opened in his hands: one card, `HEALTH INSURANCE`; the moth
//                                (three held drawings) flying out; `moth` 0 inside · 1..3 out · 'pad' landed on the pad
//   drawMoth(b, x, y, k)         the moth alone (it lands on Sucram's stamp pad, and dodges the stamp)
//   drawSheetHigh(b, f, st)      [HIGH] (15.15) the witness table from above: the sheet `PLEASE REGULATE ME`, signed, sliding
//                                right in held steps; Sucram's stamp coming down on it mid-slide; the stamp pad, the glass
//   drawSheetBack(b, f, st)      [ECU] (15.17) the back of the sheet held up: `CALLED IT. (BEFORE SUCRAM.)` in the same red
//   drawStampPad(b, x, y)        the stamp pad (a tin, the purple-red pad)
import {Buf, rect, line, ellipse, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {tiny, tinyWidth} from '../rooms/kit-b';

// ------------------------------------------------------------------ the microphone
export const drawMic = (b: Buf, x: number, y: number, o: {lit?: boolean; scale?: 'room' | 'bust'; dir?: -1 | 1} = {}) => {
  const d = o.dir ?? -1;
  if ((o.scale ?? 'room') === 'room') {
    // base on the bench, a gooseneck curving toward the seat, the head, the LED on the base
    rect(x - 3, y, 7, 2, b.ink(PAL.N1)); rect(x - 3, y, 7, 1, b.ink(PAL.G3));
    line(x, y - 1, x, y - 6, b.ink(PAL.N1)); line(x, y - 6, x + 3 * d, y - 10, b.ink(PAL.N1));
    rect(x + 3 * d - 1, y - 12, 3, 3, b.ink(PAL.N0)); b.set(x + 3 * d - 1, y - 12, PAL.G3);
    b.set(x + 2, y, o.lit ? PAL.R3 : PAL.R0);
    if (o.lit) { b.set(x + 2, y - 1, PAL.R2); b.set(x + 3, y, PAL.R2); }
    return;
  }
  rect(x - 8, y, 18, 5, b.ink(PAL.N1)); rect(x - 8, y, 18, 1, b.ink(PAL.G4));
  for (let j = 0; j < 22; j++) { const X = x + Math.round(d * (j > 12 ? (j - 12) * 0.9 : 0)); b.set(X, y - j, PAL.N1); b.set(X + 1, y - j, PAL.G2); }
  const hx = x + d * 9, hy = y - 30;
  for (let j = 0; j < 9; j++) for (let i = 0; i < 6; i++) b.set(hx + i - 3, hy + j, i === 0 || j === 0 ? PAL.G3 : (i + j) % 2 ? PAL.N1 : PAL.N0);
  rect(x + 5, y + 1, 3, 2, b.ink(o.lit ? PAL.R3 : PAL.R0));
  if (o.lit) { b.set(x + 4, y + 1, PAL.R2); b.set(x + 8, y + 1, PAL.R2); b.set(x + 6, y, PAL.S6); }
};

// ------------------------------------------------------------------ the stamp mark
/**
 * SUCRAM's stamp: `CALLED IT.` over `(BEFORE LAUNCH.)` (or any second line) in red, a double-ruled box; the ink misses
 * in a few places (a real rubber stamp, the seed `k` picks where). scale 1 = the 7 px face; 2 = the display face.
 */
export const stampMark = (b: Buf, x: number, y: number, second: string, k = 7, o: {scale?: 1 | 2; col?: number; tilt?: number} = {}) => {
  const sc = o.scale ?? 1, col = o.col ?? PAL.R2;
  const tmp = new Buf(420, 90, 0);
  const l1 = 'CALLED IT.';
  const w1 = sc === 2 ? bigTextWidth(l1) : textWidth(l1), w2 = sc === 2 ? bigTextWidth(second) : textWidth(second);
  const W = Math.max(w1, w2) + 12 * sc, H = sc === 2 ? 46 : 26;
  const put = (s: string, w: number, yy: number) => (sc === 2 ? bigText(tmp, s, Math.round((W - w) / 2), yy, 1) : text(tmp, s, Math.round((W - w) / 2), yy, 1));
  put(l1, w1, sc === 2 ? 5 : 4);
  put(second, w2, sc === 2 ? 25 : 14);
  for (let i = 0; i < W; i++) { tmp.set(i, 0, 1); tmp.set(i, H - 1, 1); if (sc === 2) { tmp.set(i, 2, 1); tmp.set(i, H - 3, 1); } }
  for (let j = 0; j < H; j++) { tmp.set(0, j, 1); tmp.set(W - 1, j, 1); if (sc === 2) { tmp.set(2, j, 1); tmp.set(W - 3, j, 1); } }
  const tilt = o.tilt ?? 0;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    if (!tmp.get(i, j)) continue;
    if (hash(i >> 1, j >> 1, k) < 0.04) continue; // where the rubber missed (rarely: the words must read)
    b.set(x + i, y + j + Math.round((i * tilt) / 40), hash(i, j, k + 1) < 0.2 ? stepColor(col, -1) : col);
  }
  return {w: W, h: H};
};

// ------------------------------------------------------------------ the moth
const MOTH = [
  ['.a...a.', 'aWa.aWa', 'aWWbWWa', '.aWbWa.', '..aba..'],   // wings up
  ['aa...aa', 'aWWbWWa', '.aWbWa.', '..aba..', '.......'],   // wings level
  ['.......', 'aa.b.aa', 'aWWbWWa', '.aaWaa.', '..aba..'],   // wings down
];
export const drawMoth = (b: Buf, x: number, y: number, k: number, big = false) => {
  const m = MOTH[((k % 3) + 3) % 3];
  const pal: Record<string, number> = {a: PAL.P0, W: PAL.P1, b: PAL.D1};
  const s = big ? 2 : 1;
  m.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) rect(x + i * s, y + j * s, s, s, b.ink(c)); } });
};

// ------------------------------------------------------------------ the stamp pad
export const drawStampPad = (b: Buf, x: number, y: number, s = 1) => {
  const W = 26 * s, H = 14 * s;
  rect(x, y, W, H, b.ink(PAL.G2)); rect(x, y, W, 1, b.ink(PAL.G5)); rect(x, y + H - 1, W, 1, b.ink(PAL.N0));
  rect(x + 2 * s, y + 2 * s, W - 4 * s, H - 4 * s, b.ink(PAL.U2));
  for (let j = 2 * s; j < H - 2 * s; j++) for (let i = 2 * s; i < W - 2 * s; i++) if (bayer(x + i, y + j) < 0.25) b.set(x + i, y + j, PAL.U3);
};

// ------------------------------------------------------------------ the wallet (15.12)
export interface WalletState {
  /** 0 closed in the hand · 1 opening · 2 open */
  open: 0 | 1 | 2;
  /** the moth: 0 inside (hidden) · 1, 2, 3 its three drawings climbing out and away · -1 gone */
  moth: number;
}
export const drawWalletECU = (b: Buf, f: number, st: WalletState) => {
  // the witness table's green baize, close; his hoodie cuffs at the bottom corners
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.3 ? PAL.L1 : PAL.L0);
  for (let y = 0; y < 30; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), y < 20 ? -1 : 0));
  // the wallet: worn brown leather, a stitched edge; open it shows two pockets and ONE card
  const cx = 240, cy = 104;
  const w = st.open === 2 ? 230 : st.open === 1 ? 170 : 118, h = 96;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = Math.round(x0 + i), Y = Math.round(y0 + j);
    const e = Math.min(i, j, w - 1 - i, h - 1 - j);
    const seam = st.open === 2 && Math.abs(i - w / 2) < 1;
    b.set(X, Y, e < 1 ? PAL.D0 : e < 3 ? PAL.D3 : e === 4 && (i + j) % 3 === 0 ? PAL.W3 : seam ? PAL.D0 : i < w * 0.3 ? PAL.D4 : PAL.D3);
  }
  if (st.open === 2) {
    // the left pocket: empty (a slot, its shadow); the right: the one card, legible
    rect(x0 + 14, y0 + 16, w / 2 - 26, 8, b.ink(PAL.D1)); rect(x0 + 14, y0 + 16, w / 2 - 26, 1, b.ink(PAL.D0));
    rect(x0 + 14, y0 + 34, w / 2 - 26, 8, b.ink(PAL.D1));
    const kx = cx + 12, ky = y0 + 14, kw = w / 2 - 26, kh = 56;
    rect(kx, ky, kw, kh, b.ink(PAL.P2)); rect(kx, ky, kw, 10, b.ink(PAL.C4)); rect(kx, ky + kh - 1, kw, 1, b.ink(PAL.P0)); rect(kx + kw - 1, ky, 1, kh, b.ink(PAL.P0));
    tiny(b, 'MEMBER', kx + 4, ky + 3, PAL.P2);
    const t1 = 'HEALTH', t2 = 'INSURANCE';
    text(b, t1, kx + Math.round((kw - textWidth(t1)) / 2), ky + 18, PAL.N2);
    text(b, t2, kx + Math.round((kw - textWidth(t2)) / 2), ky + 29, PAL.N2);
    for (let i = 0; i < kw - 16; i++) if (i % 4 !== 3) b.set(kx + 8 + i, ky + 45, PAL.G4);
    // the pocket's lip across the card's foot
    rect(cx + 6, ky + kh - 10, kw + 12, 12, b.ink(PAL.D3)); rect(cx + 6, ky + kh - 10, kw + 12, 1, b.ink(PAL.D4));
  }
  // his fingers on the wallet's two edges (lit from the left)
  for (const [hx, flipX] of [[x0 - 22, 1], [x0 + w - 4, -1]] as Array<[number, number]>) {
    for (let j = 0; j < 70; j++) for (let i = 0; i < 30; i++) {
      const u = flipX > 0 ? i : 29 - i;
      if (Math.hypot((u - 20) / 16, (j - 44) / 30) < 1) b.set(Math.round(hx + i), cy - 10 + j, u > 22 ? PAL.S5 : u > 10 ? PAL.S4 : PAL.S3);
    }
    for (let j = 0; j < 60; j++) for (let i = 0; i < 44; i++) b.set(Math.round(hx - (flipX > 0 ? 20 : -6) + i), cy + 50 + j, i < 12 ? PAL.G3 : PAL.G2);
  }
  // the moth: out of the fold, three drawings climbing to the right (toward Sucram's pad, off frame)
  if (st.moth >= 1) {
    const path: Array<[number, number]> = [[cx - 6, y0 + 20], [cx + 40, y0 - 14], [cx + 110, y0 - 34]];
    const [mx, my] = path[Math.min(2, st.moth - 1)];
    drawMoth(b, mx, my, st.moth + Math.floor(f / 2), true);
  }
};

// ------------------------------------------------------------------ the sheet, from above (15.15)
export interface SheetHighState {
  /** the slide: 0 at his hand · 1..3 held positions toward the dais · 4 gone off the right edge */
  slide: 0 | 1 | 2 | 3 | 4;
  /** Sucram's stamp: 'up' (raised over it) · 'down' (on it) · 'done' (lifted, the mark on the sheet) · null */
  stamp: 'up' | 'down' | 'done' | null;
}
export const SHEET_W = 96, SHEET_H = 124;
/** the sheet itself, face up: PLEASE REGULATE ME in friendly type, his signature already on it */
export const drawRegulateSheet = (b: Buf, x: number, y: number, o: {mark?: boolean; k?: number} = {}) => {
  rect(x + 3, y + 3, SHEET_W, SHEET_H, b.ink(PAL.N0));
  rect(x, y, SHEET_W, SHEET_H, b.ink(PAL.P2)); rect(x, y, SHEET_W, 1, b.ink(PAL.W9)); rect(x + SHEET_W - 1, y, 1, SHEET_H, b.ink(PAL.P1)); rect(x, y + SHEET_H - 1, SHEET_W, 1, b.ink(PAL.P0));
  // friendly type: the words centred in the top third, a sunny rounded rule under them
  const l1 = 'PLEASE', l2 = 'REGULATE', l3 = 'ME';
  text(b, l1, x + Math.round((SHEET_W - textWidth(l1)) / 2), y + 12, PAL.N3);
  text(b, l2, x + Math.round((SHEET_W - textWidth(l2)) / 2), y + 23, PAL.N3);
  text(b, l3, x + Math.round((SHEET_W - textWidth(l3)) / 2), y + 34, PAL.N3);
  for (let i = 18; i < SHEET_W - 18; i++) b.set(x + i, y + 46, PAL.W6);
  // body lines (unreadable) and the signature line with his signature on it
  for (let k = 0; k < 5; k++) for (let i = 10; i < SHEET_W - 10 - (k === 4 ? 30 : 0); i++) if ((i + k * 3) % 9 !== 0) b.set(x + i, y + 56 + k * 7, PAL.G5);
  for (let i = 12; i < 60; i++) b.set(x + i, y + SHEET_H - 16, PAL.G4);
  const sig: Array<[number, number]> = [[14, -2], [17, -6], [20, -1], [24, -5], [27, -3], [31, -7], [34, -2], [38, -4], [42, -1], [47, -3]];
  for (let i = 0; i + 1 < sig.length; i++) line(x + sig[i][0], y + SHEET_H - 18 + sig[i][1], x + sig[i + 1][0], y + SHEET_H - 18 + sig[i + 1][1], b.ink(PAL.N4));
  tiny(b, 'mas', x + 64, y + SHEET_H - 22, PAL.G4);
  if (o.mark) stampMark(b, x + 2, y + 70, '(BEFORE LAUNCH.)', o.k ?? 11, {tilt: -3});
};
export const drawSheetHigh = (b: Buf, f: number, st: SheetHighState) => {
  // the witness table's baize from above, the table's edge at the bottom; his glass, the stamp pad, Sucram's binder
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, y > 186 ? (y === 187 ? PAL.D4 : PAL.D2) : bayer(x, y) < 0.3 ? PAL.L1 : PAL.L0);
  // his glass (a flat water line even from above: a ring, a flat disc)
  ellipse(60, 40, 13, 13, b.ink(PAL.C2)); ellipse(60, 40, 11, 11, b.ink(PAL.C4)); ellipse(60, 40, 9, 9, b.ink(PAL.C5)); b.set(55, 35, PAL.C9); b.set(56, 35, PAL.C8);
  rect(330, 12, 90, 60, b.ink(PAL.N2)); rect(330, 12, 90, 2, b.ink(PAL.N4)); rect(332, 16, 4, 52, b.ink(PAL.G4)); // the binder
  drawStampPad(b, 380, 118, 2);
  // the sheet sliding right (held positions), leaving frame right
  const xs = [96, 170, 250, 340, 520];
  const sx = xs[st.slide], sy = 44;
  drawRegulateSheet(b, sx, sy, {mark: st.stamp === 'done' || st.stamp === 'down'});
  // his fingertips still on it at slide 0 (a hoodie sleeve in from the left)
  if (st.slide === 0) {
    for (let j = 0; j < 40; j++) for (let i = 0; i < 90; i++) if (Math.hypot((i - 50) / 46, (j - 20) / 18) < 1) b.set(i + 10, sy + 70 + j, i < 60 ? PAL.G3 : PAL.G2);
    for (let j = 0; j < 16; j++) for (let i = 0; i < 20; i++) if (Math.hypot((i - 10) / 10, (j - 8) / 8) < 1) b.set(sx - 8 + i, sy + 80 + j, i < 8 ? PAL.S5 : PAL.S4);
  }
  // SUCRAM's stamp from the top-right: seen from above, the block on the sheet's lower half (the title stays clear),
  // the turned knob on top of it, his hand round the knob, his tweed sleeve out of frame top-right
  if (st.stamp === 'up' || st.stamp === 'down') {
    const down = st.stamp === 'down';
    const bx = sx + 18, by = sy + 66 - (down ? 0 : 10);
    if (!down) for (let j = 0; j < 22; j++) for (let i = 0; i < 64; i++) b.set(bx + i + 6, by + j + 12, stepColor(b.get(bx + i + 6, by + j + 12), -1)); // its shadow
    rect(bx, by, 60, 26, b.ink(PAL.D3)); rect(bx, by, 60, 2, b.ink(PAL.D4)); rect(bx, by + 24, 60, 2, b.ink(PAL.D1)); rect(bx, by, 2, 26, b.ink(PAL.W4));
    const kx = bx + 30, ky = by + 13;
    ellipse(kx, ky, 11, 9, b.ink(PAL.D1)); ellipse(kx - 1, ky - 1, 8, 6, b.ink(PAL.D4)); b.set(kx - 4, ky - 4, PAL.W5); b.set(kx - 3, ky - 4, PAL.W5);
    // the hand over the knob and the sleeve up to the top-right corner
    // his tweed sleeve: one filled band from the knob up to the frame's top-right corner, a lit edge, a herringbone
    const inBand = (x: number, y: number) => { const u = (x - kx) * 0.74 - (y - ky) * 0.68, v = (x - kx) * 0.68 + (y - ky) * 0.74; return u > 4 && v > -15 && v < 15; };
    for (let y = 0; y < ky + 12; y++) for (let x = kx - 20; x < 480; x++) if (inBand(x, y)) { const v = (x - kx) * 0.68 + (y - ky) * 0.74; b.set(x, y, v < -11 ? PAL.D4 : v > 11 ? PAL.D1 : (x + y) % 4 === 0 ? PAL.D3 : PAL.D2); }
    for (let j = 0; j < 22; j++) for (let i = 0; i < 30; i++) if (Math.hypot((i - 15) / 15, (j - 11) / 11) < 1) b.set(kx + i - 6, ky - 16 + j, i < 10 ? PAL.S5 : i < 22 ? PAL.S4 : PAL.S3);
  }
};

// ------------------------------------------------------------------ the back of the sheet, held up (15.17)
export const drawSheetBack = (b: Buf, f: number, st: {k?: number} = {}) => {
  // the dais wood behind, soft; the sheet big, held up by two senators' hands at its top corners
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x >> 5) % 2 ? PAL.D2 : PAL.D1);
  const X = 110, Y = 14, W = 260, H = 176;
  rect(X + 4, Y + 4, W, H, b.ink(PAL.N0));
  rect(X, Y, W, H, b.ink(PAL.P1)); rect(X, Y, W, 2, b.ink(PAL.P2)); rect(X, Y + H - 2, W, 2, b.ink(PAL.P0));
  // the front's type shows through faintly, mirrored and grey (paper), never legible
  for (let k = 0; k < 7; k++) for (let i = 30; i < W - 30; i++) if (hash(i, k, 5) < 0.55) b.set(X + i, Y + 80 + k * 10, PAL.P0);
  const m = stampMark(new Buf(1, 1, 0), 0, 0, '(BEFORE SUCRAM.)', st.k ?? 23, {scale: 2});
  stampMark(b, X + Math.round((W - m.w) / 2), Y + 30, '(BEFORE SUCRAM.)', st.k ?? 23, {scale: 2, tilt: 2});
  // the hands at the corners
  for (const hx of [X - 18, X + W - 14]) for (let j = 0; j < 34; j++) for (let i = 0; i < 32; i++) if (Math.hypot((i - 16) / 16, (j - 17) / 17) < 1) b.set(hx + i, Y - 8 + j, i < 12 ? PAL.S5 : i < 22 ? PAL.S4 : PAL.S3);
  void f;
};
void tinyWidth;
