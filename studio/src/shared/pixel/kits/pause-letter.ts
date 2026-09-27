// MR. MAS — kit: THE PAUSE LETTER (Ep1 sc 12, the act-out's first beat). New file (v3-art-a, 2026-09-27).
// 12.01: over Mas's shoulder at his desk at night, his monitor lights with a letter's header, PAUSE GIANT AI
// EXPERIMENTS (the public letter, [V]); the screen pushes to full-bleed, and the letter becomes a clipboard gliding in
// on its own onto a standing desk in the dark; the fine print on the clip: PAUSES RECEIVED: 0. The letter is a generic
// web page (no real site's layout): the header in the display face, a line of body, a signature list.
//   drawLetterPage(b, x, y, w, h, st)     the page at any size (the monitor's screen, or full-bleed)
//   drawLetterOTS(b, f, st)               [OTS] 12.01 over his shoulder: the bullpen at night (the launch room's medium
//                                         panorama), his monitor with the page; st.push 1..3: the screen's rect grows to
//                                         full-bleed (held steps; the page seen 1:1 through it: no scaling)
//   drawClipboard(b, x, y, st)            the letter as a clipboard: its board, the clip and its fine print, the sheet
//                                         (the header, the signature lines; st.signed: Nole's flourish on the next one)
//   LETTER                                its words
import {Buf, rect, line, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {pt, pw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {launchBackM, otsShoulder} from '../rooms/bullpen-launch';

export const LETTER = {header: ['PAUSE GIANT AI', 'EXPERIMENTS'], kind: 'an open letter', received: 'PAUSES RECEIVED: 0', names: ['OIGNEB', 'SUCRAM', 'NOLE']};
const RH = 203;
/** the page: white, the header in two lines of the display face, one body line, then signature rows (a name in tiny
 *  caps and a scribble), the three names the scene needs among many unnamed ones */
export const drawLetterPage = (b: Buf, x: number, y: number, w: number, h: number, st: {scroll?: number} = {}) => {
  rect(x, y, w, h, b.ink(PAL.P2));
  rect(x, y, w, 9, b.ink(PAL.G5)); for (let i = 0; i < 3; i++) rect(x + 4 + i * 5, y + 3, 3, 3, b.ink(PAL.G6));
  const big = w >= 200;
  let yy = y + 16 - (st.scroll ?? 0);
  if (big) {
    for (const l of LETTER.header) { bigText(b, l, x + Math.round((w - bigTextWidth(l)) / 2), yy, PAL.N1); yy += 17; }
    pt(b, LETTER.kind, x + Math.round((w - pw(LETTER.kind)) / 2), yy + 2, PAL.G3); yy += 16;
  } else {
    for (const l of LETTER.header) { text(b, l, x + Math.round((w - textWidth(l)) / 2), yy, PAL.N1); yy += 9; }
    yy += 4;
  }
  // the signature list: rows of tiny names and scribbles (most unnamed: grey blocks)
  const rows = Math.floor((y + h - 4 - yy) / (big ? 9 : 6));
  for (let r = 0; r < rows; r++) {
    const ry = yy + r * (big ? 9 : 6);
    if (ry < y + 10) continue;
    const name = big && r < 9 ? (r === 2 ? LETTER.names[0] : r === 5 ? LETTER.names[1] : r === 7 ? LETTER.names[2] : '') : '';
    const cx = x + 10 + (r % 2) * Math.round(w / 2);
    if (name) tiny(b, name, cx, ry, PAL.N2);
    else rect(cx, ry + 1, 12 + Math.floor(hash(r, 1, 3) * 16), big ? 3 : 2, b.ink(PAL.G5));
    // a scribble beside it
    for (let i = 0; i < (big ? 22 : 12); i++) b.set(cx + (big ? 34 : 18) + i, ry + (big ? 2 : 1) - Math.round(Math.sin(i * 0.7 + r) * (big ? 2 : 1)), PAL.I0);
  }
};

export interface LetterOTSState {
  /** frames since the monitor lit (the header types on its first line, 2 chars a frame) */
  k?: number;
  /** the push: 0 his monitor in the room · 1..2 the screen's rect growing (held) · 3 full-bleed */
  push?: number;
}
export const drawLetterOTS = (b: Buf, f: number, st: LetterOTSState = {}) => {
  launchBackM(b, 250, {soft: 2, alyi: 'gone', underlines: 3});
  // his monitor on his desk (he works at a monitor at night here, not the laptop): the bezel, the page, its light
  const sx = 170, sy = 30, sw = 226, sh = 136;
  const lit = (st.k ?? 20) > 0;
  for (let y = sy - 20; y < RH; y++) for (let x = sx - 30; x < sx + sw + 30; x++) { const d = Math.max(Math.abs(x - sx - sw / 2) - sw / 2, sy - y, 0) / 30; if (lit && d < 1 && bayer(x, y) < (1 - d) * 0.35) b.set(x, y, stepColor(b.get(x, y), 1)); }
  rect(sx - 6, sy - 6, sw + 12, sh + 12, b.ink(PAL.N0)); rect(sx - 5, sy - 5, sw + 10, 1, b.ink(PAL.G2));
  rect(sx + sw / 2 - 10, sy + sh + 6, 20, 16, b.ink(PAL.N1)); rect(sx + sw / 2 - 30, sy + sh + 20, 60, 4, b.ink(PAL.N1));
  if (lit) drawLetterPage(b, sx, sy, sw, sh);
  else rect(sx, sy, sw, sh, b.ink(PAL.N1));
  // the push: the page's rect grows to the frame (the page is laid out full-bleed and seen through the growing rect)
  const z = st.push ?? 0;
  if (z > 0) {
    const t = [0, 0.4, 0.75, 1][Math.min(3, z)];
    const x0 = Math.round(sx * (1 - t)), y0 = Math.round(sy * (1 - t)), x1 = Math.round((sx + sw) * (1 - t) + 480 * t), y1 = Math.round((sy + sh) * (1 - t) + RH * t);
    drawLetterPage(b, x0, y0, x1 - x0, y1 - y0);
  }
  if (z < 3) otsShoulder(b, -40, 70, PAL.P0, {flip: true});
};

export interface ClipboardState {
  /** Nole's signature: 0 none · 1 the flourish half-drawn · 2 signed */
  signed?: number;
  /** the board's light: 'dark' (in the dark, the lamp's pool on it) · 'screen' (as a page) */
  small?: boolean;
}
/** the clipboard, 64 x 84 (or small: 26 x 34 for a room-scale desk); the fine print on the clip, legible at 64 */
export const drawClipboard = (b: Buf, x: number, y: number, st: ClipboardState = {}) => {
  if (st.small) {
    rect(x, y, 26, 34, b.ink(PAL.D2)); rect(x, y, 26, 1, b.ink(PAL.D4)); rect(x + 2, y + 4, 22, 28, b.ink(PAL.P1));
    rect(x + 8, y - 1, 10, 4, b.ink(PAL.G4)); rect(x + 4, y + 7, 18, 2, b.ink(PAL.N2)); for (let r = 0; r < 6; r++) rect(x + 5, y + 12 + r * 3, 10 + (r % 3) * 3, 1, b.ink(PAL.G4));
    if ((st.signed ?? 0) >= 1) for (let i = 0; i < 12; i++) b.set(x + 6 + i, y + 29 - Math.round(Math.sin(i * 0.8) * 1.5), PAL.R2);
    return;
  }
  const w = 64, h = 84;
  rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.D2)); rect(x, y, w, 1, b.ink(PAL.D4)); rect(x, y, 1, h, b.ink(PAL.D3));
  rect(x + 4, y + 10, w - 8, h - 14, b.ink(PAL.P2));
  // the sheet: the header, a rule, the signature rows
  tiny(b, 'PAUSE GIANT', x + Math.round((w - tinyWidth('PAUSE GIANT')) / 2), y + 15, PAL.N1);
  tiny(b, 'AI EXPERIMENTS', x + Math.round((w - tinyWidth('AI EXPERIMENTS')) / 2), y + 22, PAL.N1);
  rect(x + 8, y + 35, w - 16, 1, b.ink(PAL.G4));
  for (let r = 0; r < 7; r++) { const ry = y + 40 + r * 5; rect(x + 8, ry, 16 + (r * 5) % 10, 2, b.ink(PAL.G5)); for (let i = 0; i < 14; i++) b.set(x + 30 + i, ry + 1 - Math.round(Math.sin(i * 0.8 + r) * 1), PAL.I0); }
  // Nole's flourish on the next free line (his left hand: a big red loop)
  const sg = st.signed ?? 0;
  if (sg) { const n = sg === 1 ? 14 : 34; for (let i = 0; i < n; i++) { const t = i / 34; b.set(x + 10 + Math.round(t * 44), y + 76 - Math.round(Math.sin(t * Math.PI * 3) * 3 + (t > 0.8 ? (t - 0.8) * 20 : 0)), PAL.R2); } }
  // the clip, steel, and its fine print (legible at this size): PAUSES RECEIVED: 0
  rect(x + 14, y - 3, 36, 12, b.ink(PAL.G2)); rect(x + 14, y - 3, 36, 1, b.ink(PAL.G5)); rect(x + 22, y - 6, 20, 4, b.ink(PAL.G3));
  tiny(b, 'PAUSES', x + 16, y - 1, PAL.P1);
  tiny(b, 'RECEIVED:0', x + 16, y + 4, PAL.P1);
  void line;
};
