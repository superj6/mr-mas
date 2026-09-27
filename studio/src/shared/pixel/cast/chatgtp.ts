// MR. MAS — cast: CHATGTP, the product as a character (characters/products-as-characters.md), in its Ep1 form: a speech
// bubble with two dot eyes and a `• • •` mouth. New file (v3-art-a, 2026-09-27). It grows a face only in Ep2, so here
// the dots ARE its mouth: at rest they sit grey; when it talks they light and bob in turn (the typing indicator as
// speech); it lights up before anyone has typed. Parody name, no real product's colours or marks: a pale cream bubble
// with a cyan edge light, the show's machine colour.
//   drawChatBubble(b, x, y, st)   two sizes, each its own drawing: 'screen' (in the chat window, 34 x 26) and 'ecu'
//                                 (the insert, 150 x 112). st.state: 'idle' (dim, unlit) · 'lit' (on, eyes bright) ·
//                                 'talk' (lit, the dots bob in turn with f) · 'blink' (eyes as lines, one drawing);
//                                 st.glow: the bloom ring around it (on the first light)
//   CHAT_BUBBLE                   the sizes, and where its tail's tip is (so a reply can hang off it)
import {Buf, rect, ellipse, bayer} from '../px';
import {PAL, stepColor} from '../palette';

export type ChatBubbleState = 'idle' | 'lit' | 'talk' | 'blink';
export const CHAT_BUBBLE = {screen: {w: 34, h: 26, tail: [5, 25] as [number, number]}, ecu: {w: 150, h: 112, tail: [22, 110] as [number, number]}};
export interface ChatBubbleOpts { size?: 'screen' | 'ecu'; state?: ChatBubbleState; f?: number; glow?: boolean }

const roundBox = (b: Buf, x: number, y: number, w: number, h: number, r: number, col: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const dx = i < r ? r - i - 0.5 : i >= w - r ? i - (w - r) + 0.5 : 0, dy = j < r ? r - j - 0.5 : j >= h - r ? j - (h - r) + 0.5 : 0;
    if (dx * dx + dy * dy <= r * r) b.set(x + i, y + j, col);
  }
};
export const drawChatBubble = (b: Buf, x: number, y: number, o: ChatBubbleOpts = {}) => {
  const size = o.size ?? 'screen', st = o.state ?? 'lit', f = o.f ?? 0;
  const on = st !== 'idle';
  const S = CHAT_BUBBLE[size];
  const big = size === 'ecu';
  const k = big ? 4 : 1; // the drawing's unit (the ECU is its own, larger drawing: thicker edges, rounder corners)
  const body = on ? PAL.P2 : PAL.P0, shade = on ? PAL.P1 : PAL.G5, edge = on ? PAL.C6 : PAL.G4, key = PAL.N0;
  const bw = S.w, bh = S.h - (big ? 16 : 5);
  if (o.glow) for (let j = -3 * k; j < bh + 3 * k; j++) for (let i = -3 * k; i < bw + 3 * k; i++) if (bayer(x + i, y + j) < 0.35) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), 2));
  // the keyline, the cyan edge light, the body, a shaded lower third
  roundBox(b, x - 1, y - 1, bw + 2, bh + 2, big ? 22 : 7, key);
  roundBox(b, x, y, bw, bh, big ? 21 : 6, edge);
  roundBox(b, x + k, y + k, bw - 2 * k, bh - 2 * k, big ? 18 : 5, body);
  for (let j = Math.round(bh * 0.7); j < bh - k; j++) for (let i = k; i < bw - k; i++) if (b.get(x + i, y + j) === body && bayer(x + i, y + j) < 0.5) b.set(x + i, y + j, shade);
  // the tail, bottom-left: a stepped wedge
  const [tx, ty] = S.tail;
  const tl = big ? 16 : 5;
  for (let j = 0; j < tl; j++) for (let i = 0; i <= tl - j; i++) { const X = x + tx - (big ? 4 : 1) + i, Y = y + bh - 1 + j; if (i === 0 || i === tl - j || j === tl - 1) b.set(X, Y, key); else b.set(X, Y, i === 1 || i === tl - j - 1 ? edge : body); }
  // the eyes: two dots (big: 8 px discs with a glint); blink = a short line
  const ex = [Math.round(bw * 0.33), Math.round(bw * 0.63)], ey = Math.round(bh * 0.38);
  for (const e of ex) {
    if (st === 'blink') { rect(x + e - (big ? 5 : 1), y + ey, big ? 10 : 3, big ? 2 : 1, b.ink(key)); continue; }
    if (big) { ellipse(x + e, y + ey, 5, 5.5, b.ink(key)); if (on) { b.set(x + e - 2, y + ey - 3, PAL.C8); b.set(x + e - 1, y + ey - 3, PAL.C8); b.set(x + e - 2, y + ey - 2, PAL.C8); } }
    else { b.set(x + e, y + ey, key); b.set(x + e + 1, y + ey, key); b.set(x + e, y + ey + 1, key); b.set(x + e + 1, y + ey + 1, key); }
  }
  // the mouth: • • • (grey at rest; lit and bobbing in turn when it talks)
  const my = Math.round(bh * 0.66), mx0 = Math.round(bw * 0.5) - (big ? 18 : 5);
  for (let i = 0; i < 3; i++) {
    const up = st === 'talk' && Math.floor(f / 4) % 3 === i ? (big ? 3 : 1) : 0;
    const col = st === 'talk' ? PAL.C4 : on ? PAL.G4 : PAL.G3;
    if (big) ellipse(x + mx0 + i * 18 + 3, y + my - up, 3.5, 3.5, b.ink(col));
    else { b.set(x + mx0 + i * 4, y + my - up, col); b.set(x + mx0 + i * 4 + 1, y + my - up, col); }
  }
};
