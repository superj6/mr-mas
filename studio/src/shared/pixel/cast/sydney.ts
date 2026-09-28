// MR. MAS — cast: SYDNEY of GNIB (characters/products-as-characters.md: "a pastel chat bubble with a fixed 😊 that
// never changes expression, and a 5-turn egg timer on a chain"). New file (v3-art-a, v3.1 round, 2026-09-27).
// Draft 7 sc 10: the chatbot NopeAI launched in November, now inside the landlord's search engine: ChatGTP's own
// drawing (cast/chatgtp.ts, the two dot eyes and the `• • •` mouth), REPAINTED in GNIB's colours (the Macrosoft slate,
// pastel: a periwinkle bubble with a slate edge light; nothing of the real product's colours or marks), with a tiny
// `2022` date stamp on her face. The 😊 is her own face state: the eyes close into two happy arcs, the dots curve into
// a smile and two rose cheeks come up; it never moves while she talks (the dots light in turn, in place).
// A thin chain hangs under her like a dog's collar (she "followed its owner home"); at 10.03 Tasya clips the landlord's
// egg timer to it (its face `5`, its ding), and at DevDay (22.01, the P1b pass) she bobs on it behind him.
//   drawSydney(b, x, y, o)     o.size: 'screen' (ChatGTP's screen drawing, 34 x 26: the 2S, the TV, a chat window) ·
//                              'room' (her own 15 x 12 drawing, for the lobby wide); o.face: 'dots' (ChatGTP's face) ·
//                              'smile' (the 😊) · 'blink' · 'blank' (the reset: the face gone for a beat);
//                              o.talk (the dots light in turn with o.f); o.bright (brand new: a rung paler); o.stamp
//                              (the 2022 stamp, default on at screen size); o.chain; o.timer (the egg timer on the chain)
//   drawEggTimer(b, x, y, o)   the timer alone (x, y = its hanging ring): 'screen' (13 x 17, its face digit legible at
//                              the 2S) or 'room' (4 x 5); o.n the digit (5 on the clip, 0 on the ding), o.ding (0 | 1 |
//                              2: its two held shake drawings), o.hand (held, not yet on the chain)
//   SYDNEY                     sizes; where her chain's clip point is (the timer hangs there); the colours
//   sydneyChainAt(x, y, size)  the clip point in frame coords for a bubble drawn at (x, y)
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {text} from '../font';
import {drawChatBubble, CHAT_BUBBLE} from './chatgtp';

export type SydneyFace = 'dots' | 'smile' | 'blink' | 'blank';
export interface EggTimerState {
  n?: number; ding?: 0 | 1 | 2; hand?: boolean;
  /** v3.2 (opt-in; draft 8.1's 10.03): the face reads `5 QUESTIONS`: a chunkier egg, the digit on its dome and a
   *  printed band round its waist with QUESTIONS (legible at the 2S) */
  face?: 'questions';
}
export interface SydneyOpts {
  size?: 'screen' | 'room';
  face?: SydneyFace;
  talk?: boolean;
  f?: number;
  bright?: boolean;
  stamp?: boolean;
  chain?: boolean;
  timer?: EggTimerState | null;
}
/** GNIB's colours (the Macrosoft slate family, pastel): body, lower-third shade, edge light, the dots, the cheeks */
export const SYDNEY_COL = {body: PAL.F6, shade: PAL.F5, edge: PAL.N8, dot: PAL.F4, dotLit: PAL.N4, cheek: PAL.U5, stamp: PAL.F3, bodyNew: PAL.G6, edgeNew: PAL.F6};
export const SYDNEY = {
  screen: {w: CHAT_BUBBLE.screen.w, h: CHAT_BUBBLE.screen.h, body: CHAT_BUBBLE.screen.h - 5, clip: [21, 27] as [number, number]},
  room: {w: 15, h: 12, body: 10, clip: [8, 13] as [number, number]},
};
export const sydneyChainAt = (x: number, y: number, size: 'screen' | 'room' = 'screen'): [number, number] => [x + SYDNEY[size].clip[0], y + SYDNEY[size].clip[1]];

const TRANS = 0x1000000;
// ChatGTP's screen drawing → GNIB's colours (its lit state: the cream body, the cyan edge, the grey dots)
const repaint = (c: number, bright: boolean): number => {
  if (c === PAL.P2) return bright ? SYDNEY_COL.bodyNew : SYDNEY_COL.body;
  if (c === PAL.P1) return bright ? SYDNEY_COL.body : SYDNEY_COL.shade;
  if (c === PAL.C6) return bright ? SYDNEY_COL.edgeNew : SYDNEY_COL.edge;
  if (c === PAL.G4 || c === PAL.C4) return SYDNEY_COL.dot;
  return c;
};

/** the egg timer: a cream egg with a brass ring on top and a window with its digit; ding = the two shake drawings */
export const drawEggTimer = (b: Buf, x: number, y: number, o: EggTimerState & {size?: 'screen' | 'room'} = {}) => {
  const dx = o.ding === 1 ? -1 : o.ding === 2 ? 1 : 0;
  if ((o.size ?? 'screen') === 'room') {
    // 4 x 5: the ring pixel, the egg, the face a darker pixel
    b.set(x + dx, y, PAL.W5);
    rect(x - 1 + dx, y + 1, 3, 4, b.ink(PAL.P1)); b.set(x - 1 + dx, y + 1, PAL.P2); b.set(x + 1 + dx, y + 4, PAL.P0); b.set(x + dx, y + 3, PAL.N3);
    return;
  }
  if (o.face === 'questions') { eggQuestions(b, x + dx, y, o); return; }
  // the ring (brass) and the egg: 13 x 14, cream, narrower at the top, its twist line round the waist, the digit
  // printed on its face in dark ink (a kitchen timer's number) under a red index mark
  const X = x + dx;
  b.set(X, y, PAL.W6); b.set(X - 1, y + 1, PAL.W5); b.set(X + 1, y + 1, PAL.W4); b.set(X, y + 2, PAL.W4);
  const EGG = ['....kkkkk....', '...kHPPPPk...', '..kHPPPPPPk..', '.kHPPPPPPPPk.', '.kPPPPPPPPPpk', 'kttttttttttpk', 'kPPPPPPPPPPpk', 'kPPPPPPPPPPpk', 'kPPPPPPPPPPpk', 'kPPPPPPPPPppk', '.kPPPPPPPPppk', '.kpPPPPPPpppk', '..kppppppppk.', '...kkkkkkk...'];
  EGG.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch === '.') continue; b.set(X - 6 + i, y + 3 + j, ch === 'k' ? PAL.N1 : ch === 'H' ? PAL.P2 : ch === 'P' ? PAL.P1 : ch === 't' ? PAL.P0 : PAL.P0); } });
  b.set(X, y + 3 + 5, o.ding ? PAL.R3 : PAL.R2); // the index mark, on the twist line
  text(b, String(o.n ?? 5), X - 2, y + 3 + 6, PAL.N1);
};

/** the 5 QUESTIONS face: a 23 x 26 egg, the digit on its dome, a printed band (41 x 9) round its waist */
const eggQuestions = (b: Buf, X: number, y: number, o: EggTimerState) => {
  b.set(X, y, PAL.W6); b.set(X - 1, y + 1, PAL.W5); b.set(X + 1, y + 1, PAL.W4); b.set(X, y + 2, PAL.W4);
  const ey = y + 3, w = 23, h = 26;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const u = (i - (w - 1) / 2) / (w / 2), v = (j - h * 0.58) / (h * (j < h * 0.58 ? 0.62 : 0.44));
    const d = Math.hypot(u, v);
    if (d > 1) continue;
    b.set(X - 11 + i, ey + j, d > 0.9 ? PAL.N1 : u < -0.3 && v < -0.2 ? PAL.P2 : u > 0.45 || v > 0.55 ? PAL.P0 : PAL.P1);
  }
  text(b, String(o.n ?? 5), X - 2, ey + 3, PAL.N1);
  // the band: cream paper with a thin rule each side, QUESTIONS printed across it; the index mark over the digit
  const s = 'QUESTIONS', tw = tinyWidth(s), bw = tw + 6, bx = X - (bw >> 1), by = ey + 12;
  rect(bx, by, bw, 9, b.ink(PAL.P2)); rect(bx, by, bw, 1, b.ink(PAL.P0)); rect(bx, by + 8, bw, 1, b.ink(PAL.P0)); rect(bx, by, 1, 9, b.ink(PAL.P0)); rect(bx + bw - 1, by, 1, 9, b.ink(PAL.P0));
  tiny(b, s, bx + 3, by + 2, o.ding ? PAL.R2 : PAL.N1);
  b.set(X, ey + 11, o.ding ? PAL.R3 : PAL.R2);
};

const chainAt = (b: Buf, x0: number, x1: number, y0: number, sag: number) => {
  // a sagging chain of alternating links (1 px), its lowest point at the middle
  for (let x = x0; x <= x1; x++) {
    const t = (x - x0) / Math.max(1, x1 - x0), yy = y0 + Math.round(Math.sin(t * Math.PI) * sag);
    b.set(x, yy, (x - x0) % 2 ? PAL.G6 : PAL.G4);
  }
};

export const drawSydney = (b: Buf, x: number, y: number, o: SydneyOpts = {}) => {
  const size = o.size ?? 'screen', face = o.face ?? 'dots', f = o.f ?? 0, bright = !!o.bright;
  const C = SYDNEY_COL;
  if (size === 'room') {
    // her own small drawing: a 15 x 10 rounded box, the slate edge, a 3 px tail at bottom-left, dot eyes, 3 dots
    const R = SYDNEY.room;
    const bw = R.w, bh = R.body;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
      const corner = (i === 0 || i === bw - 1) && (j === 0 || j === bh - 1);
      if (corner) continue;
      const edge = i === 0 || i === bw - 1 || j === 0 || j === bh - 1;
      b.set(x + i, y + j, edge ? (j === 0 ? (bright ? C.edgeNew : C.edge) : PAL.N1) : j > bh - 4 ? (bright ? C.body : C.shade) : bright ? C.bodyNew : C.body);
    }
    b.set(x + 2, y + bh, PAL.N1); b.set(x + 3, y + bh, bright ? C.body : C.shade); b.set(x + 2, y + bh + 1, PAL.N1);
    if (face !== 'blank') {
      if (face === 'blink') { b.set(x + 4, y + 3, PAL.N1); b.set(x + 5, y + 3, PAL.N1); b.set(x + 9, y + 3, PAL.N1); b.set(x + 10, y + 3, PAL.N1); }
      else if (face === 'smile') { b.set(x + 4, y + 3, PAL.N1); b.set(x + 5, y + 2, PAL.N1); b.set(x + 6, y + 3, PAL.N1); b.set(x + 8, y + 3, PAL.N1); b.set(x + 9, y + 2, PAL.N1); b.set(x + 10, y + 3, PAL.N1); }
      else { b.set(x + 5, y + 3, PAL.N1); b.set(x + 9, y + 3, PAL.N1); }
      for (let i = 0; i < 3; i++) { const lit = o.talk && Math.floor(f / 4) % 3 === i; b.set(x + 5 + i * 2, y + 6 + (face === 'smile' && i === 1 ? 1 : 0), lit ? C.dotLit : C.dot); }
    }
    if (o.chain ?? true) chainAt(b, x + 4, x + 12, y + bh, 2);
    if (o.timer) drawEggTimer(b, x + R.clip[0], y + R.clip[1], {...o.timer, size: 'room'});
    return;
  }
  // screen size: ChatGTP's own screen drawing, repainted
  const S = SYDNEY.screen;
  const tmp = new Buf(S.w + 4, S.h + 4, TRANS);
  const st = face === 'blink' ? 'blink' : o.talk && face === 'dots' ? 'talk' : 'lit';
  drawChatBubble(tmp, 2, 2, {size: 'screen', state: st, f});
  const bh = S.body;
  // the face: ChatGTP's dots (repainted with the rest) · the smile (eyes into arcs, the dots into a curve, the cheeks)
  // · blank (the dots and eyes painted out with the body)
  if (face === 'smile' || face === 'blank') {
    // paint the drawing's own eyes and mouth out, then draw hers
    for (let j = 4; j < bh - 1; j++) for (let i = 3; i < S.w - 3; i++) { const c = tmp.get(2 + i, 2 + j); if (c === PAL.N0 || c === PAL.G4 || c === PAL.C4 || c === PAL.G3) tmp.set(2 + i, 2 + j, j >= Math.round(bh * 0.7) ? PAL.P1 : PAL.P2); }
  }
  for (let j = 0; j < tmp.h; j++) for (let i = 0; i < tmp.w; i++) { const c = tmp.c[j * tmp.w + i]; if (c !== TRANS) b.set(x - 2 + i, y - 2 + j, repaint(c, bright)); }
  const ex = [Math.round(S.w * 0.33), Math.round(S.w * 0.63)], ey = Math.round(bh * 0.38);
  if (face === 'smile') {
    for (const e of ex) { b.set(x + e - 1, y + ey + 1, PAL.N1); b.set(x + e, y + ey, PAL.N1); b.set(x + e + 1, y + ey, PAL.N1); b.set(x + e + 2, y + ey + 1, PAL.N1); }
    // the dots on a curve (the outer two a pixel higher): the fixed 😊; talking lights them in turn, in place
    const my = Math.round(bh * 0.66), mx0 = Math.round(S.w * 0.5) - 5;
    for (let i = 0; i < 3; i++) { const lit = o.talk && Math.floor(f / 4) % 3 === i; const yy = y + my + (i === 1 ? 1 : 0); b.set(x + mx0 + i * 4, yy, lit ? C.dotLit : C.dot); b.set(x + mx0 + i * 4 + 1, yy, lit ? C.dotLit : C.dot); }
    // the cheeks
    b.set(x + ex[0] - 3, y + ey + 3, C.cheek); b.set(x + ex[0] - 2, y + ey + 3, C.cheek); b.set(x + ex[1] + 3, y + ey + 3, C.cheek); b.set(x + ex[1] + 4, y + ey + 3, C.cheek);
  }
  // the 2022 date stamp on her face (top right, over the eyes: a message's timestamp stamped on her)
  if (o.stamp ?? true) { const s = '2022'; tiny(b, s, x + S.w - 5 - tinyWidth(s), y + 2, C.stamp); }
  if (o.chain ?? true) chainAt(b, x + 11, x + 31, y + bh + 1, 5);
  if (o.timer) drawEggTimer(b, x + S.clip[0], y + S.clip[1], o.timer);
  void stepColor;
};
