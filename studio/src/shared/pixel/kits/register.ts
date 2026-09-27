// MR. MAS — kit: NESNEJ's REGISTER and the money beats of the rooftop (Ep1 sc 17; new file, owned by the `v3-art-b` pass).
// The register is his signature prop (show/characters/nesnej.md): a brass cash register that appears beside him from
// nowhere. KA-CHING. Here it rolls in on its own on four small casters. Every size is its own drawing.
//   drawRegisterRoom(b, x, footY, st)   room scale (≈ 44 x 40 on its casters): the brass body, the flag window on top, the
//                                       key rows, the crank; `roll` the casters' 2 drawings; `flags` raised = the sale
//   drawRegisterBust(b, x, y, st)       at bust scale (≈ 132 x 104): for the OTS behind Mario (17.06), in front of NESNEJ
//   drawKeyECU(b, f, st)                [ECU] (17.07) the key rows close, his finger coming down on ONE key (the big one)
//   drawRegisterWindow(b, f, st)        [INSERT] (17.09) the flag window: `INVIDIA` on its brass plate, the figure
//                                       `$1,000,000,000,000` popped up on the flags, `(INTRADAY)` on the tab below
//   drawLedgerPlate(b)                  (17.08) the flash-print's plate, drawn in the show's colours: P2 runs it through the
//                                       LEDGER palette set (engine palettes.ts); ledgerPrint(b) does both
//   drawPurchaseOrder(b, f, st)         [INSERT] (17.10) the signing pen in Mario's hand is now a purchase order:
//                                       `PURCHASE ORDER` · `AI CHIPS · QTY: MORE`
import {Buf, rect, line, ellipse, hash, bayer} from '../px';
import {PAL} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {pt, pw} from './uitype';
import {applyPalette, PALETTES} from '../palettes';

const RH = 203;
const BRASS = {k: PAL.W1, d: PAL.W3, m: PAL.W4, l: PAL.W6, h: PAL.W7, H: PAL.W8, x: PAL.W9};

// ------------------------------------------------------------------ room scale
export const REG_ROOM = {w: 44, h: 42};
export const drawRegisterRoom = (b: Buf, x: number, footY: number, st: {roll?: number; flags?: boolean} = {}) => {
  const y = footY - REG_ROOM.h;
  // the casters (two drawings on the roll), the base plinth
  const r = (st.roll ?? 0) % 2;
  for (const cx of [x + 5, x + 17, x + 29, x + 39]) { b.set(cx, footY - 1, PAL.N0); b.set(cx + 1, footY - 1, r ? PAL.G3 : PAL.N1); b.set(cx, footY - 2, PAL.G2); }
  rect(x, footY - 6, 44, 4, b.ink(BRASS.d)); rect(x, footY - 6, 44, 1, BRASS.l !== undefined ? b.ink(BRASS.l) : b.ink(BRASS.l));
  // the body: a stepped brass box, the embossed front panel, the cash drawer's lip
  for (let j = 0; j < 26; j++) for (let i = 2; i < 42; i++) {
    const X = x + i, Y = y + 10 + j;
    const e = i === 2 ? BRASS.h : i === 41 ? BRASS.k : j === 0 ? BRASS.H : BRASS.l;
    b.set(X, Y, (i + j) % 7 === 0 && j > 3 && j < 20 ? BRASS.m : e);
  }
  rect(x + 4, y + 30, 36, 2, b.ink(BRASS.d)); rect(x + 4, y + 30, 36, 1, b.ink(BRASS.H));
  // the key rows (round dark keys with pale tops, sloping back) on the upper front
  for (let row = 0; row < 3; row++) for (let k = 0; k < 7; k++) { const kx = x + 6 + k * 5, ky = y + 13 + row * 5; b.set(kx, ky, PAL.P2); b.set(kx + 1, ky, PAL.P1); b.set(kx, ky + 1, PAL.N1); b.set(kx + 1, ky + 1, PAL.N1); }
  // the flag window's housing on top, the flags (raised on a sale), the crank at the side
  rect(x + 8, y + 2, 28, 8, b.ink(BRASS.m)); rect(x + 8, y + 2, 28, 1, b.ink(BRASS.x)); rect(x + 10, y + 4, 24, 4, b.ink(PAL.N1));
  if (st.flags) for (let k = 0; k < 6; k++) { rect(x + 11 + k * 4, y + (k % 2 ? 1 : 0), 3, 4, b.ink(PAL.P2)); b.set(x + 12 + k * 4, y + 2 + (k % 2 ? 1 : 0), PAL.N1); }
  line(x + 42, y + 20, x + 46, y + 18, b.ink(BRASS.d)); b.set(x + 47, y + 17, PAL.N0); b.set(x + 47, y + 18, BRASS.l);
  // its shadow on the deck
  for (let i = 0; i < 46; i++) b.set(x + i + 2, footY, PAL.G3);
};

// ------------------------------------------------------------------ bust scale (the OTS)
export const REG_BUST = {w: 132, h: 104};
/** keys' positions at bust scale (local): row r, key k -> [x, y]; the big CHING key is at the front right */
const bustKey = (r: number, k: number): [number, number] => [18 + k * 14 + r * 3, 46 + r * 12];
export const drawRegisterBust = (b: Buf, x: number, y: number, st: {press?: boolean; flags?: boolean; glint?: number} = {}) => {
  const {w, h} = REG_BUST;
  // the body: brass with an embossed scroll panel, lit from the left (the sun), a dark edge on the right
  for (let j = 30; j < h; j++) for (let i = 0; i < w; i++) {
    const u = i / w;
    let c = u < 0.08 ? BRASS.H : u < 0.45 ? BRASS.h : u < 0.85 ? BRASS.l : BRASS.m;
    if (j > h - 18) c = u < 0.1 ? BRASS.l : BRASS.m; // the drawer
    if (j === h - 18) c = BRASS.d;
    if (j === 30) c = BRASS.x;
    if (i === 0) c = BRASS.x; if (i === w - 1) c = BRASS.k;
    b.set(x + i, y + j, c);
  }
  // the embossed scroll on the drawer front, the drawer's keyhole
  for (let i = 12; i < w - 12; i++) { const yy = y + h - 10 + Math.round(Math.sin(i / 6) * 3); b.set(x + i, yy, BRASS.d); b.set(x + i, yy - 1, BRASS.H); }
  rect(x + w / 2 - 1, y + h - 13, 3, 5, b.ink(PAL.N0));
  // the key rows: three rows of round keys (dark rims, cream tops with numbers too small to read), the big key
  for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) {
    const [kx, ky] = bustKey(r, k);
    ellipse(x + kx, y + ky, 5, 4, b.ink(PAL.N0)); ellipse(x + kx, y + ky - 1, 4, 3, b.ink(PAL.P1)); b.set(x + kx - 2, y + ky - 2, PAL.P2);
    rect(x + kx - 1, y + ky - 1, 2, 1, b.ink(PAL.G4));
  }
  const bx = x + w - 20, by = y + 70, down = st.press ? 2 : 0;
  ellipse(bx, by + down, 9, 7, b.ink(PAL.N0)); ellipse(bx, by - 1 + down, 8, 6, b.ink(PAL.R2)); ellipse(bx - 2, by - 3 + down, 3, 2, b.ink(PAL.R3));
  // the top: the flag window's housing with its crest (a plain sunburst, no brand), the window and its flags
  for (let j = 0; j < 30; j++) for (let i = 18; i < w - 18; i++) {
    const top = j < 6 && Math.abs(i - w / 2) > 40 - j * 3;
    if (top) continue;
    b.set(x + i, y + j, j < 2 ? BRASS.x : i < 26 ? BRASS.H : BRASS.l);
  }
  for (let k = 0; k < 9; k++) line(x + w / 2, y + 4, x + w / 2 + (k - 4) * 6, y - 4, b.ink(BRASS.h));
  rect(x + 26, y + 12, w - 52, 14, b.ink(PAL.N1)); rect(x + 26, y + 12, w - 52, 1, b.ink(PAL.N0));
  if (st.flags) for (let k = 0; k < 8; k++) { const fx = x + 30 + k * 9, fy = y + 6 + (k % 2); rect(fx, fy, 7, 10, b.ink(PAL.P2)); rect(fx, fy, 7, 1, b.ink(PAL.W9)); text(b, k === 0 ? '$' : '0', fx + 1, fy + 2, PAL.N2); }
  // the crank at the side
  line(x + w - 1, y + 50, x + w + 10, y + 44, b.ink(BRASS.d)); ellipse(x + w + 11, y + 43, 3, 3, b.ink(PAL.N1));
  // a hot glint that walks along the top edge (2 held positions)
  const g = st.glint ?? 0; rect(x + 30 + (g % 2) * 40, y + 30, 6, 1, b.ink(PAL.W9));
};
export const REG_BIGKEY: [number, number] = [REG_BUST.w - 20, 70];

// ------------------------------------------------------------------ the key, close (17.07)
export const drawKeyECU = (b: Buf, f: number, st: {press: 0 | 1 | 2}) => {
  // the brass slope with the key rows receding up the frame; the big red key front and centre
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 40 ? (bayer(x, y) < 0.5 ? BRASS.m : BRASS.d) : (x + y) % 23 === 0 ? BRASS.m : x < 90 ? BRASS.H : BRASS.l);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 8; k++) {
    const kx = 30 + k * 58 + r * 14, ky = 18 + r * 30, rx = 20 - r * 3, ry = 11 - r * 2;
    ellipse(kx, ky + 4, rx + 2, ry + 2, b.ink(PAL.N0)); ellipse(kx, ky, rx, ry, b.ink(PAL.P1)); ellipse(kx - 3, ky - 3, rx - 8, ry - 5, b.ink(PAL.P2));
    const d = String((r * 8 + k) % 10);
    text(b, d, kx - 2, ky - 3, PAL.N3);
  }
  const down = st.press === 2 ? 6 : st.press === 1 ? 3 : 0;
  const cx = 300, cy = 150;
  ellipse(cx, cy + 12, 58, 26, b.ink(PAL.N0));
  ellipse(cx, cy + down, 54, 24, b.ink(PAL.R1)); ellipse(cx, cy - 2 + down, 50, 21, b.ink(PAL.R2)); ellipse(cx - 12, cy - 8 + down, 22, 8, b.ink(PAL.R3));
  // his fingertip coming down on it (lit by the sun, a clean pale nail)
  const fy = [40, 92, 104][st.press] ?? 40;
  const inF = (x: number, y: number) => Math.hypot((x - cx - 10) / 30, (y - fy) / 40) < 1 || (y < fy && x > cx - 14 && x < cx + 40);
  for (let y = 0; y < RH; y++) for (let x = cx - 40; x < cx + 60; x++) {
    if (!inF(x, y)) continue;
    const e = !inF(x - 1, y), e2 = !inF(x + 1, y);
    b.set(x, y, e ? PAL.S6 : e2 ? PAL.S1 : x < cx ? PAL.S5 : x < cx + 24 ? PAL.S4 : PAL.S3);
  }
  for (let y = fy + 10; y < fy + 34; y++) for (let x = cx - 2; x < cx + 22; x++) if (inF(x, y) && Math.hypot((x - cx - 10) / 12, (y - fy - 22) / 12) < 1) b.set(x, y, y < fy + 14 ? PAL.P2 : PAL.P1);
  // the leather cuff of his jacket at the top
  for (let y = 0; y < Math.max(0, fy - 50); y++) for (let x = cx - 20; x < cx + 50; x++) b.set(x, y, x < cx - 12 ? PAL.G5 : PAL.N1);
  void f;
};

// ------------------------------------------------------------------ the window (17.09)
export const drawRegisterWindow = (b: Buf, f: number, st: {pop?: number}) => {
  // the brass housing close: the crest above, the window across the frame, the flags popped up in a row
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 30 ? (bayer(x, y) < 0.3 ? BRASS.h : BRASS.l) : y > 150 ? BRASS.m : (x + (y >> 1)) % 31 === 0 ? BRASS.m : BRASS.l);
  // the maker's plate above the window: INVIDIA in raised letters
  const pl = 'INVIDIA', pw2 = bigTextWidth(pl) + 24;
  rect(240 - pw2 / 2, 18, pw2, 26, b.ink(BRASS.d)); rect(240 - pw2 / 2 + 2, 20, pw2 - 4, 22, b.ink(PAL.N1));
  bigText(b, pl, 240 - bigTextWidth(pl) / 2, 24, PAL.L3, {shadow: PAL.N0});
  // the window: a dark slot, the white flags (each one digit or comma, a black numeral), popped in held steps
  rect(20, 56, 440, 70, b.ink(PAL.N0)); rect(22, 58, 436, 66, b.ink(PAL.N1));
  const s = '$1,000,000,000,000';
  const n = Math.min(s.length, Math.floor(st.pop ?? 99));
  const cw = 22;
  const x0 = 240 - (s.length * cw) / 2;
  for (let i = 0; i < n; i++) {
    const fx = Math.round(x0 + i * cw), fy = 64 + (i % 2 ? 2 : 0);
    rect(fx, fy, cw - 3, 50, b.ink(PAL.P2)); rect(fx, fy, cw - 3, 2, b.ink(PAL.W9)); rect(fx + cw - 4, fy, 1, 50, b.ink(PAL.P0));
    if (s[i] === ',') { rect(fx + 7, fy + 28, 4, 4, b.ink(PAL.N1)); rect(fx + 9, fy + 32, 2, 3, b.ink(PAL.N1)); rect(fx + 7, fy + 34, 2, 2, b.ink(PAL.N1)); }
    else bigText(b, s[i], fx + Math.round((cw - 3 - bigTextWidth(s[i])) / 2), fy + 18, PAL.N1);
  }
  // the tab under the window
  const tab = '(INTRADAY)';
  rect(240 - (textWidth(tab) + 12) / 2, 134, textWidth(tab) + 12, 13, b.ink(PAL.P1));
  text(b, tab, 240 - textWidth(tab) / 2, 137, PAL.N2);
  void f;
};

// ------------------------------------------------------------------ the LEDGER plate (17.08)
/** a ledger page's line screen with the figure ruled in; P2 prints it through PALETTES.LEDGER (or call ledgerPrint) */
export const drawLedgerPlate = (b: Buf) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y % 6 === 0 ? PAL.L1 : x === 60 || x === 420 ? PAL.R2 : PAL.P2);
  const l1 = 'INVIDIA', l2 = '$1,000,000,000,000', l3 = '(INTRADAY)';
  bigText(b, l1, 240 - bigTextWidth(l1) / 2, 44, PAL.N1);
  bigText(b, l2, 240 - bigTextWidth(l2) / 2, 84, PAL.N0, {deep: true, shadow: PAL.L2});
  text(b, l3, 240 - textWidth(l3) / 2, 122, PAL.N2);
  rect(120, 110, 240, 1, b.ink(PAL.N2)); rect(120, 112, 240, 1, b.ink(PAL.N2));
};
export const ledgerPrint = (b: Buf) => { drawLedgerPlate(b); applyPalette(b, PALETTES.LEDGER, {rect: [0, 0, 480, RH]}); };

// ------------------------------------------------------------------ the purchase order (17.10)
export const drawPurchaseOrder = (b: Buf, f: number, st: {k?: number} = {}) => {
  // the table's white cloth close, the sheet's corner beyond; Mario's hand holding the order up where the pen was
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.15 ? PAL.P1 : PAL.P2);
  rect(300, 150, 180, 53, b.ink(PAL.G6)); // the statement sheet's corner
  // the order: a stiff form, a bold header, two rows, a box, his fingers at its foot
  const X = 150, Y = 18, W = 190, H = 150;
  rect(X + 4, Y + 4, W, H, b.ink(PAL.G5));
  rect(X, Y, W, H, b.ink(PAL.P2)); rect(X, Y, W, 1, b.ink(PAL.W9)); rect(X, Y + H - 1, W, 1, b.ink(PAL.P0)); rect(X + W - 1, Y, 1, H, b.ink(PAL.P0));
  rect(X, Y, W, 24, b.ink(PAL.L1));
  const h1 = 'PURCHASE ORDER';
  bigText(b, h1, X + Math.round((W - bigTextWidth(h1)) / 2), Y + 5, PAL.P2);
  tiny(b, 'NO. 0000001', X + W - 8 - tinyWidth('NO. 0000001'), Y + 30, PAL.G3);
  pt(b, 'ITEM:', X + 12, Y + 46, PAL.N3); bigText(b, 'AI CHIPS', X + 50, Y + 42, PAL.N1);
  pt(b, 'QTY:', X + 12, Y + 72, PAL.N3); bigText(b, 'MORE', X + 50, Y + 68, PAL.N1);
  for (let k = 0; k < 3; k++) for (let i = 12; i < W - 12; i++) if (i % 5 !== 4) b.set(X + i, Y + 98 + k * 10, PAL.G5);
  rect(X + 12, Y + 128, 70, 1, b.ink(PAL.G4)); tiny(b, 'APPROVED', X + 12, Y + 131, PAL.G4);
  // Mario's hand: four fingers over the order's front at its foot (the thumb behind), the fleece cuff below
  const hy = Y + H - 26;
  for (let k = 0; k < 4; k++) {
    const fx = X + 6 + k * 13, fy = hy + (k === 0 ? 4 : k === 3 ? 3 : 0);
    for (let j = 0; j < 30; j++) for (let i = 0; i < 12; i++) {
      if (Math.hypot((i - 5.5) / 6, (Math.min(j, 6) - 6) / 6) > 1 && j < 6) continue;
      b.set(fx + i, fy + j, i === 0 ? PAL.S6 : i === 11 ? PAL.S1 : j < 4 ? PAL.S5 : i < 6 ? PAL.S4 : PAL.S3);
    }
    rect(fx + 3, fy + 1, 5, 2, b.ink(PAL.P1)); // the nails
  }
  for (let y = hy + 28; y < RH; y++) for (let x = X - 10; x < X + 66; x++) b.set(x, y, x < X ? PAL.F4 : x > X + 58 ? PAL.F1 : PAL.F2);
  void f; void st; void pw; void hash;
};
