// MR. MAS — Ep1 Act Two art, v3.5b (SHOWRUNNER-NOTES 00000A): the racks, after "AI CHIPS · QTY: MORE" (v35-30A.01-.02):
// wordless, the staff racking the new INVIDIA boards. New, additive, namespaced to Act Two; the `p-act1` picture pass,
// 2026-09-28. The staff are anonymous (hands, silhouettes); INVIDIA is the show's parody chip maker, in plain letters.
//   crateSlip(b, f)          [INSERT] 30A.01's open: the packing slip on an INVIDIA crate, where 17.10's purchase order was
//                            (the same rect and rows: the match)
//   boardOut(b, f, t)        [INSERT] 30A.01 after the tear: two hands draw a board out of its torn sleeve (t 0..1)
//   chassis(b, f, st)        [M] 30A.02: two boards slid home into a chassis and latched
//   aisle(b, f, lit)         [W] 30A.02's end: the cold aisle, two staff at the rack, the LED column climbing off the top
//                            where 17.11's price line climbs (x 466: the match out)
import {Buf, rect, bayer, hash, clamp, ellipse} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {pt, pw} from '../../kit';
import {tiny, tinyWidth} from '../../../../../shared/pixel/rooms/kit-b';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';

const RH = 203;
const TR = 0x1000000;
const SK = [PAL.D1, PAL.D2, PAL.B3, PAL.B4, PAL.S3];

// ------------------------------------------------------------------ 30A.01
/** the crate's lid: pine boards, their seams and nail heads, INVIDIA stencilled, the slip taped where the order was */
export const crateSlip = (b: Buf, f: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const plank = Math.floor(y / 34), seam = y % 34 === 0;
    const grain = Math.sin(x / (17 + plank * 3) + plank * 2 + y * 0.05) > 0.8;
    b.set(x, y, seam ? PAL.D1 : grain ? PAL.D3 : bayer(x, y) < 0.3 ? PAL.D4 : PAL.D3);
  }
  for (let p = 0; p < 6; p++) for (const nx of [12, 466]) { const y = p * 34 + 17; rect(nx, y, 2, 2, b.ink(PAL.G2)); }
  // the stencil: INVIDIA large at the left, and the THIS SIDE UP arrows (generic freight marks)
  const t = new Buf(60, 10, TR); pt(t, 'INVIDIA', 0, 0, PAL.N1);
  for (let j = 0; j < 10; j++) for (let i = 0; i < 60; i++) if (t.c[j * 60 + i] !== TR && (j % 3 !== 1 || i % 5 !== 2)) rect(10 + i * 2, 150 + j * 2, 2, 2, b.ink(PAL.N1));
  for (const ax of [372, 400]) { rect(ax + 4, 150, 3, 22, b.ink(PAL.N1)); for (let i = 0; i < 7; i++) rect(ax + 5 - i, 150 + i, 1 + i * 2, 1, b.ink(PAL.N1)); }
  // the slip: the order's rect and rows, re-set as a packing slip (the match)
  const X = 150, Y = 18, W = 190, H = 150;
  rect(X + 4, Y + 4, W, H, b.ink(PAL.D1));
  rect(X, Y, W, H, b.ink(PAL.P2)); rect(X, Y + H - 1, W, 1, b.ink(PAL.P0)); rect(X + W - 1, Y, 1, H, b.ink(PAL.P0));
  rect(X, Y, W, 24, b.ink(PAL.L1));
  const h1 = 'PACKING SLIP';
  bigText(b, h1, X + Math.round((W - bigTextWidth(h1)) / 2), Y + 5, PAL.P2);
  tiny(b, 'INVIDIA', X + W - 8 - tinyWidth('INVIDIA'), Y + 30, PAL.G3);
  pt(b, 'ITEM:', X + 12, Y + 46, PAL.N3); bigText(b, 'AI CHIPS', X + 50, Y + 42, PAL.N1);
  pt(b, 'QTY:', X + 12, Y + 72, PAL.N3); bigText(b, 'MORE', X + 50, Y + 68, PAL.N1);
  for (let k = 0; k < 3; k++) for (let i = 12; i < W - 12; i++) if (i % 5 !== 4) b.set(X + i, Y + 98 + k * 10, PAL.G5);
  rect(X + 12, Y + 128, 70, 1, b.ink(PAL.G4)); tiny(b, 'SHIPPED', X + 12, Y + 131, PAL.G4);
  // the tape across its corners
  for (const [tx, ty] of [[X - 10, Y - 4], [X + W - 22, Y - 4], [X - 10, Y + H - 8], [X + W - 22, Y + H - 8]] as Array<[number, number]>) for (let j = 0; j < 10; j++) for (let i = 0; i < 32; i++) if (bayer(tx + i, ty + j) < 0.6) b.set(tx + i, ty + j, stepColor(b.get(tx + i, ty + j), 1));
  void f; void hash;
};
/** a board: the shroud (black, two fans), INVIDIA raised on it, the green board's edge and its gold fingers */
const board = (b: Buf, x: number, y: number, w: number, h: number, f: number) => {
  rect(x, y, w, h, b.ink(PAL.N1)); rect(x, y, w, 2, b.ink(PAL.G2)); rect(x, y + h - 6, w, 6, b.ink(PAL.L1)); rect(x, y + h - 6, w, 1, b.ink(PAL.L2));
  for (let i = 8; i < w - 8; i += 5) rect(x + i, y + h - 3, 3, 3, b.ink(PAL.W6));
  const r = Math.floor((h - 12) / 2) - 2;
  for (const fx of [x + Math.round(w * 0.27), x + Math.round(w * 0.73)]) {
    ellipse(fx, y + 2 + r + 2, r, r, b.ink(PAL.N0)); ellipse(fx, y + 2 + r + 2, r - 2, r - 2, b.ink(PAL.N2));
    for (let a = 0; a < 7; a++) { const an = a / 7 * Math.PI * 2 + Math.floor(f / 3) * 0; for (let t = 3; t < r - 2; t++) b.set(fx + Math.round(Math.cos(an) * t), y + 4 + r + Math.round(Math.sin(an) * t), PAL.G1); }
    ellipse(fx, y + 4 + r, 3, 3, b.ink(PAL.G3));
  }
  const s = 'INVIDIA', lx = x + Math.round((w - pw(s)) / 2);
  rect(lx - 4, y + 3, pw(s) + 8, 10, b.ink(PAL.N0)); pt(b, s, lx, y + 5, PAL.G3); pt(b, s, lx, y + 4, PAL.G6);
};
/** [INSERT] after the tear: the silver sleeve lying across the frame, torn open at its right end, and two hands drawing
 *  the board out of it (t 0..1, held steps); the crate's pine under it */
export const boardOut = (b: Buf, f: number, t: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (y % 40 === 0) ? PAL.D1 : bayer(x, y) < 0.3 ? PAL.D4 : PAL.D3);
  // the sleeve: an anti-static bag's grey sheen, its crinkles; its right end torn (jagged)
  const sx0 = 20, sx1 = 250, sy0 = 60, sy1 = 150;
  for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1 + Math.round(hash(y >> 2, 1, 61) * 8); x++) { const crink = Math.sin(x / 9 + y / 13) > 0.7; b.set(x, y, crink ? PAL.G6 : bayer(x, y) < 0.4 ? PAL.G5 : PAL.G4); }
  for (let y = sy0; y < sy1; y++) b.set(sx1 + Math.round(hash(y >> 2, 1, 61) * 8), y, PAL.G3);
  // the board coming out of it, rightward
  const dx = Math.round(clamp(t, 0, 1) * 170);
  const bw = 220, bx = sx1 - bw + 20 + dx;
  const tmp = new Buf(480, RH, TR);
  board(tmp, bx, sy0 + 12, bw, 66, f);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = tmp.c[y * 480 + x]; if (v !== TR && x >= sx1 - 4) b.set(x, y, v); }
  // two hands on its bracket end (anonymous), their sleeves to the frame's right edge
  const hx = bx + bw - 6;
  for (const [hy, flip] of [[sy0 + 6, 0], [sy0 + 66, 1]] as Array<[number, number]>) {
    for (let j = 0; j < 14; j++) for (let i = 0; i < 20; i++) if (Math.hypot((i - 10) / 10, (j - 7) / 7) < 1) b.set(hx + i, hy + j, i < 3 ? SK[1] : j < 3 ? SK[4] : SK[3]);
    for (let x = hx + 18; x < 480; x++) for (let j = 1; j < 13; j++) b.set(x, hy + j + (flip ? 1 : 0), j === 1 ? PAL.F4 : PAL.F2);
  }
};

// ------------------------------------------------------------------ 30A.02
export interface ChassisSt { in1: number; in2: number; latch1: boolean; latch2: boolean }
/** [M] a server chassis close: its bays in rows, two empty ones, the boards sliding home (in 0 out .. 1 home) and the
 *  latches snapping down; an anonymous hand on each board as it goes in */
export const chassis = (b: Buf, f: number, st: ChassisSt) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.N2 : PAL.N1);
  const bays = [28, 70, 112, 154];
  bays.forEach((y, i) => {
    rect(40, y, 400, 34, b.ink(PAL.N0)); rect(40, y, 400, 1, b.ink(PAL.G2)); rect(40, y + 33, 400, 1, b.ink(PAL.G1));
    if (i === 0 || i === 3) { board(b, 44, y + 2, 392, 30, f); rect(436, y + 4, 4, 26, b.ink(PAL.G4)); }
  });
  const slide = (y: number, t: number, latch: boolean) => {
    const dx = Math.round((1 - clamp(t, 0, 1)) * 240);
    board(b, 44 + dx, y + 2, 392, 30, f);
    rect(40, y, 4, 34, b.ink(PAL.G2));
    // the latch at the bay's right end: out at an angle, then down flush
    if (latch) rect(436, y + 4, 4, 26, b.ink(PAL.G5)); else for (let j = 0; j < 20; j++) rect(438 + Math.round(j * 0.6), y + 4 + j, 3, 1, b.ink(PAL.G5));
    // a hand on the board's end while it goes in
    if (t < 1 && !latch) { const hx = 44 + dx + 392 - 8; for (let j = 0; j < 16; j++) for (let i = 0; i < 18; i++) if (Math.hypot((i - 9) / 9, (j - 8) / 8) < 1 && hx + i < 480) b.set(hx + i, y + 9 + j, i < 3 ? SK[1] : SK[3]); for (let x = hx + 16; x < 480; x++) for (let j = 2; j < 14; j++) b.set(x, y + 10 + j, j === 2 ? PAL.U3 : PAL.U1); }
  };
  slide(70, st.in1, st.latch1);
  slide(112, st.in2, st.latch2);
  // the chassis' own status LEDs down its left edge (steady, dim)
  bays.forEach((y) => { b.set(46, y + 16, PAL.L2); });
  // the bays' flanks: the rack rails either side
  rect(20, 0, 16, RH, b.ink(PAL.G1)); rect(444, 0, 16, RH, b.ink(PAL.G1));
  for (let y = 4; y < RH; y += 8) { rect(26, y, 4, 3, b.ink(PAL.N0)); rect(450, y, 4, 3, b.ink(PAL.N0)); }
};
/** the LED column's x: where 17.11's price line climbs off the top (rooms/rooftop CHIP_PATH's steep end) */
export const LED_X = 466;
/** [W] the cold aisle: the racks either side in perspective, the floor's tiles, the cool light; two staff at the right
 *  rack (dark silhouettes, anonymous); the LED column on the rack's face climbing to `lit` (y, rising) */
export const aisle = (b: Buf, f: number, lit: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c = y < 150 ? (bayer(x, y) < 0.25 ? PAL.F2 : PAL.F1) : ((x + (y - 150) * 3) % 40 < 2 || (y - 150) % 12 === 0) ? PAL.F2 : PAL.F3;
    // the racks: the left wall and the right wall, receding to the aisle's end
    const lw = 150 - Math.round((y < 150 ? 0 : 0)), vp = 240;
    if (x < 140 - Math.max(0, y - 150) * 0.8 && y < 190) c = (x % 18 === 0) ? PAL.N0 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1;
    if (x > 380 && y < 196) c = (x % 22 === 0) ? PAL.N0 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1;
    void lw; void vp;
    b.set(x, y, c);
  }
  // the racks' own LEDs (steady, small), rows of them
  for (let y = 10; y < 186; y += 9) { for (let x = 6; x < 130; x += 18) if (hash(x, y, 71) < 0.5) b.set(x + 4, y, PAL.C4); for (let x = 386; x < 476; x += 22) if (hash(x, y, 72) < 0.5 && x + 6 !== LED_X) b.set(x + 6, y, PAL.C4); }
  // the far end: a door's light
  rect(226, 60, 28, 90, b.ink(PAL.F4)); rect(230, 64, 20, 86, b.ink(PAL.F5));
  // two staff at the right rack, dark against the aisle's light (the room sprite as a silhouette, recoloured)
  for (const [x, flip] of [[330, false], [360, true]] as Array<[number, boolean]>) drawMasStand(b, x, 194, {...MAS_STAND_DEFAULT, light: 'sil'}, {flip, map: (c) => stepColor(c, -2)});
  // the column: a 2 px white core in a cyan glow (17.11's line's own drawing), from the rack's foot up to `lit`
  for (let y = Math.max(0, lit); y < 190; y++) { b.set(LED_X - 1, y, PAL.C6); b.set(LED_X + 2, y, PAL.C5); b.set(LED_X, y, PAL.W9); b.set(LED_X + 1, y, PAL.W9); }
  if (lit > 0 && lit < 190) { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 3; dx++) b.set(LED_X + dx, lit + dy, Math.abs(dx) + Math.abs(dy) < 3 ? PAL.W9 : PAL.C7); }
};
