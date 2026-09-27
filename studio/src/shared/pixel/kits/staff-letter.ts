// MR. MAS — shared kit: THE STAFF LETTER ON HIS MONITOR (UI-LETTER-V5; Ep1 Act Four v5 art pass; new file, owned by the
// v5 art pass). S5.06 [POV], the 25 s read: his monitor with a strip of its bezel and, past it, the dark room's window,
// which greys by one palette step while the counter rolls (the hours pass: the count isn't all at 2 AM). On the screen:
// ONE page, the header STAFF LETTER · TO THE BOARD, the three quoted lines each appearing as Gerg reads it (in the
// letter's words, from the lock), the SIGNED list with ALYI (REPORTED) below the fold, and a slow whole-pixel scroll
// (1 px per 2 frames, up to LETTER_SCROLL_MAX: v4 capped it at 40). In the screen's right column: the SIGNED counter
// (the avalanche odometer, 505 -> 650 -> 700 -> 745 / 770 with its clunk), GERG's small lip-synced tile (he is on the
// call, reading to Mas), and ALYI's call thumbnail with the vote icon still flipped from noon.
//   drawStaffLetter(b, st)   into the 480 x 203 room area
//     st.k          frames into the shot                 st.f      act frame (typing, keycaps)
//     st.quotes     [k1, k2, k3]: when each quoted line lands (lock: the texts' starts)
//     st.count      the counter value now (drive it with odoRoll + LETTER_STOPS, or pass the lock's steps)
//     st.clunk      the odometer's kick frame (true on the stop)
//     st.scroll     px scrolled (0..LETTER_SCROLL_MAX)   st.alyi   ALYI's line lit (the stop)
//     st.gerg       {mouth, head, typing}                st.window 0 (night) .. 1 (one step greyer)
import {Buf, rect, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {pt, pw, pwrap} from './uitype';
import {odometer} from './avalanche';
import {drawAlyiTileFit} from '../cast/alyi-v5';
import {drawGergMediumTile, GergMHead} from '../cast/gerg-medium';
import type {Viseme} from '../cast/talk';

export const LETTER_QUOTES = [
  '“…unable to work for or with people that lack competence, judgment and care for our mission and employees.”',
  '“…unless all current board members resign…”',
  '“…positions for all NopeAI employees…”',
];
const SCR = {x: 18, y: 8, w: 380, h: 186};
const PAGE = {x: SCR.x + 8, w: 262};
const PAGE_H = 360;
export const LETTER_SCROLL_MAX = PAGE_H - (SCR.h - 8);

export interface StaffLetterState {
  k: number;
  f: number;
  quotes?: [number, number, number];
  count: number;
  clunk?: boolean;
  scroll?: number;
  alyi?: boolean;
  gerg?: {mouth?: Viseme; head?: GergMHead; typing?: boolean};
  window?: number;
}
/** the page as one tall buffer (the scroll reads a window of it) */
/** page rows (page coords) of each quote's first line and of ALYI's line: scroll = row - reading line (about 60) */
export const letterLayout = () => { const st = {k: -1, f: 0, count: 0} as StaffLetterState; const L = {quoteY: [] as number[], alyiY: 0}; pageBuf(st, L); return L; };
const pageBuf = (st: StaffLetterState, L?: {quoteY: number[]; alyiY: number}) => {
  const p = new Buf(PAGE.w, PAGE_H, PAL.N1);
  // the letter's own body text, greeked, with the quoted lines set in it as they're read
  const q = st.quotes ?? [0, 0, 0];
  const slots = [28, 92, 132];
  const quoteY: number[] = [];
  let y = 28;
  for (let i = 0; i < 3; i++) {
    // greek lines above each quote (the rest of the letter)
    const gl = i === 0 ? 1 : 2;
    for (let j = 0; j < gl; j++) { rect(10, y + 2, 180 + ((i * 37 + j * 53) % 60), 4, p.ink(PAL.N3)); y += 10; }
    quoteY.push(y);
    L?.quoteY.push(y);
    const lines = pwrap(LETTER_QUOTES[i], PAGE.w - 20);
    if (st.k >= q[i]) {
      rect(8, y - 2, PAGE.w - 16, lines.length * 10 + 3, p.ink(PAL.N2));
      rect(8, y - 2, 2, lines.length * 10 + 3, p.ink(i === 1 ? PAL.W5 : PAL.C5));
      lines.forEach((l, j) => pt(p, l, 13, y + j * 10, i === 1 ? PAL.W7 : PAL.P1));
    } else lines.forEach((l, j) => rect(13, y + 2 + j * 10, Math.min(PAGE.w - 30, pw(l)), 4, p.ink(PAL.N3)));
    y += lines.length * 10 + 8;
  }
  void slots;
  rect(10, y, PAGE.w - 20, 1, p.ink(PAL.N4)); y += 6;
  pt(p, 'SIGNED', 10, y, PAL.N6); y += 14;
  // the names: greeked bars, with ALYI (REPORTED) the 14th, well below the fold until the scroll brings it up
  for (let i = 0; i < 20; i++) {
    const yy = y + i * 11;
    if (yy > PAGE_H - 10) break;
    if (i === 13) {
      if (L) L.alyiY = yy;
      rect(6, yy - 2, PAGE.w - 12, 11, p.ink(st.alyi ? PAL.W3 : PAL.N2));
      if (st.alyi) rect(6, yy - 2, 2, 11, p.ink(PAL.W7));
      pt(p, 'ALYI (REPORTED)', 12, yy, st.alyi ? PAL.W8 : PAL.P0);
      continue;
    }
    rect(12, yy + 1, 30 + Math.floor(hash(i, 1, 31) * 50), 5, p.ink(PAL.G2));
    rect(120 + Math.floor(hash(i, 2, 31) * 20), yy + 1, 40 + Math.floor(hash(i, 3, 31) * 60), 5, p.ink(PAL.G1));
  }
  return p;
};
const roomAround = (b: Buf, win: number) => {
  // the dark room around the monitor: its wall, and the window past the bezel at the right (night -> a step greyer)
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.25 ? PAL.N1 : PAL.N0);
  const wx = 412, wy = 0, ww = 68, wh = 132;
  const step = win >= 1 ? 1 : 0;
  for (let y = wy; y < wy + wh; y++) for (let x = wx; x < wx + ww; x++) {
    let c = y < 70 ? (bayer(x, y) < 0.4 ? PAL.N3 : PAL.N2) : (bayer(x, y) < 0.5 ? PAL.N2 : PAL.N1);
    // a few far windows of the city, static
    if (y > 80 && hash(x >> 1, y >> 1, 7) < 0.05) c = PAL.W4;
    b.set(x, y, stepColor(c, step));
  }
  rect(wx - 3, wy, 3, wh + 3, b.ink(PAL.N0)); rect(wx, wy + wh, ww, 3, b.ink(PAL.N0)); rect(wx + 32, wy, 2, wh, b.ink(PAL.N0));
};
export const drawStaffLetter = (b: Buf, st: StaffLetterState) => {
  roomAround(b, st.window ?? 0);
  // the monitor: a strip of its bezel on every side (dark plastic, the power LED)
  rect(SCR.x - 8, SCR.y - 6, SCR.w + 16, SCR.h + 14, b.ink(PAL.G0));
  rect(SCR.x - 8, SCR.y - 6, SCR.w + 16, 1, b.ink(PAL.G2));
  rect(SCR.x - 1, SCR.y - 1, SCR.w + 2, SCR.h + 2, b.ink(PAL.N0));
  b.set(SCR.x + SCR.w + 4, SCR.y + SCR.h + 4, PAL.L3);
  rect(SCR.x, SCR.y, SCR.w, SCR.h, b.ink(PAL.N0));
  for (let y = SCR.y; y < SCR.y + SCR.h; y += 3) rect(SCR.x, y, SCR.w, 1, b.ink(PAL.N1));
  // the page, scrolled
  const p = pageBuf(st);
  const sc = Math.max(0, Math.min(LETTER_SCROLL_MAX, Math.round(st.scroll ?? 0)));
  for (let y = 0; y < SCR.h - 8; y++) for (let x = 0; x < PAGE.w; x++) b.set(PAGE.x + x, SCR.y + 4 + y, p.get(x, y + sc));
  rect(PAGE.x - 1, SCR.y + 3, PAGE.w + 2, 1, b.ink(PAL.N4));
  // the header stays put (the document's own title bar): STAFF LETTER · TO THE BOARD
  rect(PAGE.x, SCR.y + 4, PAGE.w, 18, b.ink(PAL.N1));
  pt(b, 'STAFF LETTER · TO THE BOARD', PAGE.x + 10, SCR.y + 8, PAL.P2);
  rect(PAGE.x + 10, SCR.y + 19, PAGE.w - 20, 1, b.ink(PAL.N4));
  // the scrollbar (the page's position: a whole-pixel thumb)
  const tb = Math.round(((SCR.h - 8) * (SCR.h - 8)) / PAGE_H), ty = SCR.y + 4 + Math.round((sc / Math.max(1, LETTER_SCROLL_MAX)) * (SCR.h - 8 - tb));
  rect(PAGE.x + PAGE.w + 2, SCR.y + 4, 3, SCR.h - 8, b.ink(PAL.N2)); rect(PAGE.x + PAGE.w + 2, ty, 3, tb, b.ink(PAL.N6));
  // the right column: the counter, Gerg's tile (on the call, reading), Alyi's thumbnail
  const cx = PAGE.x + PAGE.w + 12;
  odometer(b, cx + 5, SCR.y + 18, st.count, {digits: 3, label: 'SIGNED', suffix: st.count >= 745 ? '/ 770' : '', kick: st.clunk});
  const gx = cx, gy = SCR.y + 44, gw = SCR.x + SCR.w - 4 - cx, gh = 60;
  rect(gx - 1, gy - 1, gw + 2, gh + 2, b.ink(st.gerg?.mouth && st.gerg.mouth !== 'rest' ? PAL.L3 : PAL.N3));
  drawGergMediumTile(b, gx, gy, gw, gh, {head: st.gerg?.head ?? 'talk', mouth: st.gerg?.mouth ?? 'rest', lid: 1}, {f: st.f, typing: st.gerg?.typing ?? false});
  rect(gx, gy + gh - 11, pw('GERG') + 6, 11, b.ink(PAL.N0)); pt(b, 'GERG', gx + 3, gy + gh - 9, PAL.P1);
  const ax = cx, ay = gy + gh + 8, aw = gw, ah = 44;
  rect(ax - 1, ay - 1, aw + 2, ah + 2, b.ink(st.alyi ? PAL.W5 : PAL.N3));
  drawAlyiTileFit(b, ax, ay, aw, ah, {mouth: 'rest', eyes: 'open', t: 0}); // r3: his face framed in the thumbnail's glass
  rect(ax + aw - 13, ay + 2, 11, 10, b.ink(PAL.R2)); pt(b, '✓', ax + aw - 11, ay + 3, PAL.P2);
  rect(ax, ay + ah - 11, pw('ALYI') + 6, 11, b.ink(PAL.N0)); pt(b, 'ALYI', ax + 3, ay + ah - 9, st.alyi ? PAL.W7 : PAL.P1);
};
