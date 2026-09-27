// MR. MAS — kit: THE FIRST CHAT WINDOW on Mas's laptop (Ep1 Act One sc 5) and its [ECU]. New file (v3-art-a,
// 2026-09-27). A generic chat UI (guardrails §5: no real app's layout, colours, marks or sounds): a dark window, a thin
// title strip with the product's parody name, Rima's banner (the one nobody reads), the CHATGTP bubble character on the
// left (cast/chatgtp.ts), its replies in plain cards, the user's lowercase line in the input row, and the product plate
// under the bubble: `CHATGTP · USERS: 0` (kept in v3 as the product plate), whose counter is the odometer's plate size
// (kits/odometer.ts) and ticks 1 · 2 · 7 · 104 · 1,389… before it detaches and grows (sc 6).
//   drawChatWindow(b, x, y, w, h, st)   any size (the OTS's screen is ~300 x 150); st below
//   drawChatECU(b, f, st)               [ECU] the bubble filling the frame, its plate and counter ticking (5.12)
//   CHAT_BANNER                         the banner's words (a stand-in: the facts owner confirms the warning's wording)
import {Buf, rect, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {pt, pw, pwrap} from './uitype';
import {drawChatBubble, ChatBubbleState, CHAT_BUBBLE} from '../cast/chatgtp';
import {drawOdometer, odometerSize} from './odometer';

export const CHAT_BANNER = 'research preview · it can make things up';
export interface ChatLine { who: 'bot' | 'user'; text: string; /** chars shown (typing); undefined = whole */ n?: number }
export interface ChatWindowState {
  f?: number;
  /** the bubble's state (idle before it lights; lit; talk while a reply lands) */
  bubble?: ChatBubbleState;
  /** the counter on the product plate; spin: the wheels blurring (the ECU's last beat) */
  users?: number;
  spin?: boolean;
  /** the conversation so far (newest last) */
  lines?: ChatLine[];
  /** the input row's text (what he is typing), and whether the caret shows */
  input?: string;
  caret?: boolean;
  banner?: boolean;
}
const TRANS = 0x1000000;
export const drawChatWindow = (b: Buf, x: number, y: number, w: number, h: number, st: ChatWindowState = {}) => {
  const f = st.f ?? 0;
  // the window: a dark body, a title strip, the banner under it
  rect(x, y, w, h, b.ink(PAL.N1));
  rect(x, y, w, 11, b.ink(PAL.N3)); rect(x, y + 11, w, 1, b.ink(PAL.N0));
  for (const [i, c] of [[4, PAL.G4], [9, PAL.G4], [14, PAL.G4]] as Array<[number, number]>) { b.set(x + i, y + 5, c); b.set(x + i + 1, y + 5, c); }
  text(b, 'CHATGTP', x + Math.round((w - textWidth('CHATGTP')) / 2), y + 2, PAL.P1);
  let top = y + 12;
  if (st.banner !== false) {
    rect(x, top, w, 9, b.ink(PAL.W2)); rect(x, top + 9, w, 1, b.ink(PAL.N0));
    const s = CHAT_BANNER.length * 6 > w - 8 ? 'research preview' : CHAT_BANNER;
    pt(b, s, x + 4, top + 1, PAL.W6);
    top += 10;
  }
  // the bubble character and its plate on the left
  const bx = x + 8, by = top + 8;
  drawChatBubble(b, bx, by, {size: 'screen', state: st.bubble ?? 'lit', f});
  const plate = 'CHATGTP · USERS:';
  const py = by + CHAT_BUBBLE.screen.h + 4;
  pt(b, plate, bx - 2, py + 3, PAL.G5);
  drawOdometer(b, bx - 2 + pw(plate) + 3, py, {size: 'plate', value: st.users ?? 0, digits: 5, spin: st.spin ? 1 : 0, f});
  // the conversation, in cards to the right of the bubble (bot: cream; user: his lowercase, dim, right-aligned)
  const cx = bx + CHAT_BUBBLE.screen.w + 10, cw = x + w - 6 - cx;
  let yy = top + 6;
  for (const ln of st.lines ?? []) {
    const shown = ln.n === undefined ? ln.text : ln.text.slice(0, ln.n);
    const rows = pwrap(shown || ' ', cw - 10);
    const hh = rows.length * 10 + 6;
    if (ln.who === 'bot') { rect(cx, yy, cw, hh, b.ink(PAL.P1)); rect(cx, yy, cw, 1, b.ink(PAL.P2)); rows.forEach((r, i) => pt(b, r, cx + 5, yy + 3 + i * 10, PAL.N1)); }
    else { const ww = Math.min(cw, Math.max(...rows.map(pw)) + 12); rect(cx + cw - ww, yy, ww, hh, b.ink(PAL.N3)); rows.forEach((r, i) => pt(b, r, cx + cw - ww + 6, yy + 3 + i * 10, PAL.P1)); }
    yy += hh + 4;
  }
  // the input row at the bottom: his typing, the caret on a held blink
  const iy = y + h - 16;
  rect(x + 4, iy, w - 8, 12, b.ink(PAL.N2)); rect(x + 4, iy, w - 8, 1, b.ink(PAL.N3));
  if (st.input) pt(b, st.input, x + 9, iy + 3, PAL.P2);
  if (st.caret && Math.floor(f / 12) % 2 === 0) rect(x + 9 + (st.input ? pw(st.input) + 1 : 0), iy + 2, 1, 8, b.ink(PAL.C6));
  void TRANS; void bayer; void stepColor; void odometerSize;
};

export interface ChatEcuState {
  f?: number; bubble?: ChatBubbleState; users?: number; spin?: boolean; glow?: boolean; roll?: number;
  /** 6.01: the counter detaches from the plate and grows in held drawings (0 on the plate · 1 lifted out, the insert's
   *  size · 2 the wide's size · 3 the desk-sized machine filling the lower frame), spinning from 1 */
  grow?: 0 | 1 | 2 | 3;
}
/** [ECU] (5.12) the bubble in close-up on the dark window, its plate and counter under it: a second user, a hundred,
 *  the 0 ticking over (roll), then the digits blur (spin) */
export const drawChatECU = (b: Buf, f: number, st: ChatEcuState = {}) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.15 ? PAL.N2 : PAL.N1);
  // the window's scanline texture (a screen at this range): every other row a rung darker
  for (let y = 0; y < 203; y += 2) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  drawChatBubble(b, 100, 22, {size: 'ecu', state: st.bubble ?? 'lit', f, glow: st.glow});
  const plate = 'CHATGTP · USERS:';
  pt(b, plate, 100, 152, PAL.G5);
  const g = st.grow ?? 0;
  const px = 100 + pw(plate) + 6;
  if (g === 0) { drawOdometer(b, px, 142, {size: 'ecu', value: st.users ?? 0, digits: 5, spin: st.spin ? 1 : 0, roll: st.roll ? [st.roll] : undefined, f}); return; }
  // it has left the plate: the slot is empty (a dark socket), and the counter grows over the window in held drawings
  rect(px, 142, odometerSize('ecu', 5).w, 28, b.ink(PAL.N0));
  if (g === 1) drawOdometer(b, px - 10, 118, {size: 'ecu', value: 12408, digits: 7, spin: 1, f});
  if (g === 2) drawOdometer(b, px - 40, 100, {size: 'wide', value: 88190, digits: 7, spin: 1, f});
  if (g === 3) { const {w} = odometerSize('desk', 7); drawOdometer(b, 240 - (w >> 1), 132, {size: 'desk', value: 301775, digits: 7, spin: 1, f, shake: [f % 4 < 2 ? 0 : 1, 0]}); }
};
