// MR. MAS — kit: GERG'S LAPTOP SCREEN, over his shoulder (draft 7: v31-10.04 in the lobby, 11.01 in the bullpen). New
// file (v3-art-a, v3.1 round, 2026-09-27). The two-shots see his lid's back (rooms/lobby-deal.ts LOBBY_LID, the match
// cut's frame position); what is ON the screen needs its own angle: over his right shoulder, looking down at the
// laptop. The screen, the deck and the shut lid sit in exactly the same place in frame in both rooms (GERG_LAPTOP), so
// this POV can carry the match cut too: the lid shuts on the chat window in the lobby (February) and opens on the
// message-board thread in the bullpen (March). The shot pass picks which half of the match rides the POV.
//   drawGergLaptopPOV(b, f, st)   st.place 'lobby' (on his knees on the check's edge: his jeans, the scuffed check and
//                                 the stone floor beyond) · 'bullpen' (on the demo desk's grey laminate); st.lid 0 open ·
//                                 1 half down (the screen tipped away, its glow on the keys) · 2 shut (the lid's back);
//                                 st.screen 'chat' (ChatGTP's window, the two-dot face big in it, NopeAI's own
//                                 colours; st.chat: the plain chat-window layout instead) ·
//                                 'thread' (the Atem thread) · 'dark'; st.chat / st.thread their states; st.hands
//   drawAtemThread(b, x, y, w, h, st)   the message-board thread at any size: a generic board (no real site's layout,
//                                 marks or colours), one post: `anon` · `03/03/23`, its picture, replies arriving
//   drawAtemCrate(b, x, y)        the post's picture (200 x 104): a plywood crate stencilled ATEM · MODEL WEIGHTS ·
//                                 RESEARCHERS ONLY, tipped on its side, its lid off, files spilling out across the floor
//   GERG_LAPTOP, ATEM_THREAD      the frame geometry; the words
import {Buf, rect, line, poly, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {pt, pw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {drawChatWindow, ChatWindowState} from './chat-window';
import {drawChatBubble, CHAT_BUBBLE} from '../cast/chatgtp';

const RH = 203;
export const GERG_LAPTOP = {screen: {x: 104, y: 18, w: 272, h: 148}, deck: {top: 176, x0: 84, x1: 396}, shut: {x0: 70, x1: 410, y0: 150, y1: 186}};
export const ATEM_THREAD = {stencil: ['ATEM', 'MODEL WEIGHTS', 'RESEARCHERS ONLY'], ts: '03/03/23', poster: 'anon'};

// ------------------------------------------------------------------ the crate (the post's picture)
/** a file icon lying on the floor: a page with a folded corner and a coloured tab */
const fileIcon = (b: Buf, x: number, y: number, tab: number, tilt: 0 | 1) => {
  const w = 7, h = 9;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = x + i + (tilt ? Math.floor(j / 4) : 0), Y = y + j;
    if (i >= w - 2 && j < 2) { if (i === w - 2 && j === 1) b.set(X, Y, PAL.P0); continue; }
    b.set(X, Y, i === 0 || j === h - 1 ? PAL.P0 : PAL.P2);
  }
  rect(x + 1, y + 1, 3, 2, b.ink(tab));
  for (let j = 4; j < 8; j += 2) b.set(x + 2 + (tilt ? Math.floor(j / 4) : 0), y + j, PAL.G5), b.set(x + 3 + (tilt ? Math.floor(j / 4) : 0), y + j, PAL.G5);
};
export const drawAtemCrate = (b: Buf, x: number, y: number) => {
  const W = 200, H = 104;
  // the photo: a storeroom's dim wall, the concrete floor from y + 60 (a flash photo: brighter in the middle)
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const d = Math.hypot((i - W * 0.45) / (W * 0.6), (j - H * 0.5) / (H * 0.7));
    const floor = j >= 60;
    const c = floor ? (bayer(i, j) < 0.5 - d * 0.3 ? PAL.G3 : PAL.G2) : bayer(i, j) < 0.55 - d * 0.35 ? PAL.N4 : PAL.N3;
    b.set(x + i, y + j, c);
  }
  rect(x, y + 60, W, 1, b.ink(PAL.G1));
  // the crate on its side: the stencilled face (122 x 54), the top plane going back, the open end at the right
  const cx = x + 18, cy = y + 14, cw = 122, ch = 57;
  // the top plane (depth 10, receding up-right)
  poly([cx, cy, cx + cw, cy, cx + cw + 10, cy - 9, cx + 10, cy - 9], b.ink(PAL.P0));
  for (let i = 0; i < cw; i += 20) line(cx + i, cy, cx + i + 10, cy - 9, b.ink(PAL.G4));
  rect(cx + 10, cy - 9, cw, 1, b.ink(PAL.P1));
  // the open end: the dark inside, the far inner edge lit, files still inside
  poly([cx + cw, cy, cx + cw + 10, cy - 9, cx + cw + 10, cy + ch - 9, cx + cw, cy + ch], b.ink(PAL.N1));
  line(cx + cw + 10, cy - 9, cx + cw + 10, cy + ch - 9, b.ink(PAL.P0));
  // the face: three plywood planks, their seams, the corner battens and nails
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    const plank = Math.floor(j / 19), jj = j % 19;
    // the ply's grain: thin broken lines along the plank (1 px), a few knots
    const grain = (jj === 6 || jj === 12) && hash(i >> 2, plank * 7 + jj, 91) < 0.35;
    const knot = hash(i >> 1, plank * 13 + (jj >> 1), 95) < 0.012;
    b.set(cx + i, cy + j, jj === 18 ? PAL.P0 : jj === 0 ? PAL.P2 : grain || knot ? PAL.P0 : PAL.P1);
  }
  for (const bx of [cx, cx + cw - 6]) { rect(bx, cy, 6, ch, b.ink(PAL.P0)); rect(bx + (bx === cx ? 0 : 5), cy, 1, ch, b.ink(PAL.G3)); for (const ny of [cy + 3, cy + ch - 4]) { b.set(bx + 2, ny, PAL.G2); b.set(bx + 3, ny, PAL.G2); } }
  rect(cx, cy + ch, cw, 2, b.ink(PAL.N1));
  // the stencil (black spray): ATEM in the display face with the stencil's bridges, the two lines under it
  const [s1, s2, s3] = ATEM_THREAD.stencil;
  const tx = cx + Math.round((cw - bigTextWidth(s1)) / 2);
  bigText(b, s1, tx, cy + 2, PAL.N1);
  for (let i = 0; i < bigTextWidth(s1); i++) if (b.get(tx + i, cy + 9) === PAL.N1) b.set(tx + i, cy + 9, PAL.P1); // the bridges
  text(b, s2, cx + Math.round((cw - textWidth(s2)) / 2), cy + 21, PAL.N1);
  text(b, s3, cx + Math.round((cw - textWidth(s3)) / 2), cy + 29, PAL.N1);
  // the spray's overspray: a few specks round the letters
  for (let k = 0; k < 10; k++) b.set(cx + 10 + Math.floor(hash(k, 3, 96) * (cw - 20)), cy + 2 + Math.floor(hash(k, 4, 96) * 34), PAL.G3);
  // its lid, off, lying on the floor in front (a plank panel, flat, seen at an angle)
  poly([x + 6, y + 88, x + 70, y + 84, x + 80, y + 96, x + 14, y + 101], b.ink(PAL.P0));
  line(x + 6, y + 88, x + 70, y + 84, b.ink(PAL.P1)); line(x + 10, y + 94, x + 75, y + 90, b.ink(PAL.G4));
  // the files, spilling out of the open end across the floor (a fan, densest at the mouth)
  const tabs = [PAL.C4, PAL.W6, PAL.L2, PAL.R2, PAL.F4];
  for (let k = 0; k < 16; k++) {
    const t = k / 15;
    const fx = cx + cw + 2 + Math.round(t * 48 + hash(k, 1, 92) * 10), fy = cy + ch - 18 + Math.round(t * 22 + hash(k, 2, 92) * 12);
    fileIcon(b, Math.min(x + W - 9, fx), Math.min(y + H - 10, fy), tabs[k % tabs.length], (k % 2) as 0 | 1);
  }
  for (let k = 0; k < 3; k++) fileIcon(b, cx + cw + 1, cy + 6 + k * 11, tabs[(k + 2) % 5], 0);
  // the frame's edge
  rect(x, y, W, 1, b.ink(PAL.N0)); rect(x, y + H - 1, W, 1, b.ink(PAL.N0)); rect(x, y, 1, H, b.ink(PAL.N0)); rect(x + W - 1, y, 1, H, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ the thread
export interface AtemThreadState {
  /** replies shown under the post (the thread growing: 0..4) */
  replies?: number;
  /** px scrolled (whole pixels) */
  scroll?: number;
}
export const drawAtemThread = (b: Buf, x: number, y: number, w: number, h: number, st: AtemThreadState = {}) => {
  const tmp = new Buf(w, h + 200, PAL.G6);
  // the board's own header strip: three window dots, BOARD in micro caps, a search slot
  rect(0, 0, w, 11, tmp.ink(PAL.G3)); rect(0, 11, w, 1, tmp.ink(PAL.G2));
  for (let i = 0; i < 3; i++) { tmp.set(4 + i * 5, 5, PAL.G5); tmp.set(5 + i * 5, 5, PAL.G5); }
  tiny(tmp, 'BOARD', 22, 3, PAL.P2);
  rect(w - 60, 3, 54, 5, tmp.ink(PAL.G5));
  // the post: its header (a grey avatar square, anon, the date), the subject line as a bar, the picture
  const px0 = 8;
  let yy = 18;
  rect(px0, yy, 9, 9, tmp.ink(PAL.G4)); rect(px0 + 3, yy + 2, 3, 3, tmp.ink(PAL.G5));
  pt(tmp, ATEM_THREAD.poster, px0 + 13, yy + 1, PAL.G2);
  pt(tmp, ATEM_THREAD.ts, px0 + 13 + pw(ATEM_THREAD.poster) + 8, yy + 1, PAL.N2);
  yy += 13;
  rect(px0, yy, Math.min(150, w - 20), 3, tmp.ink(PAL.G4));
  yy += 7;
  drawAtemCrate(tmp, px0, yy);
  yy += 104 + 6;
  // the replies (grey bars: nobody's words; the picture is the post)
  for (let r = 0; r < (st.replies ?? 3); r++) {
    rect(px0 + 12, yy, 7, 7, tmp.ink(PAL.G5)); rect(px0 + 24, yy + 1, 40 + Math.floor(hash(r, 1, 93) * 60), 2, tmp.ink(PAL.G4)); rect(px0 + 24, yy + 5, 20 + Math.floor(hash(r, 2, 93) * 50), 2, tmp.ink(PAL.G5));
    yy += 12;
  }
  const sc = st.scroll ?? 0;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, tmp.get(i, Math.min(tmp.h - 1, j + (j >= 12 ? sc : 0))));
  void tinyWidth;
};

// ------------------------------------------------------------------ the POV
export interface GergLaptopState {
  place?: 'lobby' | 'bullpen';
  lid?: 0 | 1 | 2;
  screen?: 'chat' | 'thread' | 'dark';
  chat?: ChatWindowState;
  thread?: AtemThreadState;
  /** his hands on the keys (off when the lid comes down) */
  hands?: boolean;
  f?: number;
}
const surround = (b: Buf, place: 'lobby' | 'bullpen') => {
  if (place === 'bullpen') {
    // the demo desk's grey laminate from above, its front edge near the bottom, a mug at the far left
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 240) / 300, (y - 90) / 200); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.6 ? PAL.G4 : PAL.G3); }
    rect(0, 0, 480, 6, b.ink(PAL.G2));
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) if (Math.hypot(i - 5.5, j - 5.5) < 6) b.set(28 + i, 30 + j, Math.hypot(i - 5.5, j - 5.5) > 4.5 ? PAL.P1 : PAL.D2);
    return;
  }
  // the lobby from above: the stone floor's tiles, the scuffed check under his feet (paper, a footprint), his knees
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x % 40 === 0 || y % 40 === 12) ? PAL.G1 : bayer(x, y) < 0.3 ? PAL.G3 : PAL.G2);
  // the check, weeks on: scuffed grey paper (P0), the dirt of the traffic in dither
  poly([0, 60, 200, 30, 480, 44, 480, 203, 0, 203], b.ink(PAL.P0));
  for (let y = 30; y < RH; y++) for (let x = 0; x < 480; x++) if (b.get(x, y) === PAL.P0 && bayer(x, y) < 0.16 && hash(x >> 4, y >> 4, 94) < 0.35) b.set(x, y, PAL.G4);
  // a footprint and a printed line of the check (MULTIBILLION's tail, too big to read at this range)
  // a shoe print, and the check's big printed line (its tail, too near to read)
  for (const [fx, fy] of [[36, 68], [58, 80]] as Array<[number, number]>) { rect(fx, fy, 6, 9, b.ink(PAL.G3)); rect(fx + 1, fy + 11, 4, 4, b.ink(PAL.G3)); }
  rect(20, 112, 62, 4, b.ink(PAL.N3)); rect(412, 66, 48, 4, b.ink(PAL.N3));
  // his knees under the laptop (dark denim, lit green at their tops)
  for (const [kx, kw] of [[70, 120], [300, 130]] as Array<[number, number]>) for (let y = 150; y < RH; y++) for (let x = kx; x < kx + kw; x++) { const d = Math.hypot((x - kx - kw / 2) / (kw / 2), (y - 150) / 70); if (d < 1) b.set(x, y, y < 156 ? PAL.F4 : bayer(x, y) < 0.3 ? PAL.F3 : PAL.F2); }
};
/** his hands on the deck (from behind: the backs of two hands and the cuffs of his hoodie), typing drawing k */
const hands = (b: Buf, k: number) => {
  for (const [hx, flip] of [[176, false], [262, true]] as Array<[number, boolean]>) {
    const dy = (k + (flip ? 1 : 0)) % 2;
    for (let j = 0; j < 12; j++) for (let i = 0; i < 26; i++) { const d = Math.hypot((i - 13) / 13, (j - 6) / 6.5); if (d < 1) b.set(hx + i, 184 + j + dy, d > 0.85 ? PAL.S2 : j < 4 ? PAL.S5 : PAL.S4); }
    for (let q = 0; q < 4; q++) rect(hx + 4 + q * 5, 182 + dy + (q === 0 || q === 3 ? 1 : 0), 3, 3, b.ink(PAL.S4));
    for (let y = 194 + dy; y < RH; y++) rect(hx + 2, y, 22, 1, b.ink(y === 194 + dy ? PAL.L2 : PAL.G1)); // the cuffs, the screen's green on their edge
  }
};
export const drawGergLaptopPOV = (b: Buf, f: number, st: GergLaptopState = {}) => {
  const place = st.place ?? 'lobby', lid = st.lid ?? 0;
  surround(b, place);
  const S = GERG_LAPTOP.screen, D = GERG_LAPTOP.deck;
  if (lid === 2) {
    // shut: the lid's back lying flat over the deck (the same slab in both rooms), a sheen, no glow
    const Z = GERG_LAPTOP.shut;
    for (let y = Z.y0; y < Z.y1; y++) { const t = (y - Z.y0) / (Z.y1 - Z.y0); const inset = Math.round((1 - t) * 10); for (let x = Z.x0 + inset; x < Z.x1 - inset; x++) b.set(x, y, y === Z.y0 ? PAL.G5 : x === Z.x0 + inset || x === Z.x1 - inset - 1 ? PAL.G3 : (x + y * 2) % 97 < 2 ? PAL.G4 : PAL.G2); }
    rect(Z.x0, Z.y1, Z.x1 - Z.x0, 3, b.ink(PAL.N1));
    rect(Math.round((Z.x0 + Z.x1) / 2) - 10, Z.y0 + 14, 20, 1, b.ink(PAL.G3)); // one seam, no sticker
    return;
  }
  // the deck in perspective under the screen (the keyboard rows), its light from the screen
  poly([D.x0, D.top, D.x1, D.top, D.x1 + 30, RH, D.x0 - 30, RH], b.ink(PAL.G1));
  for (let r = 0; r < 4; r++) { const y = D.top + 4 + r * 6; for (let x = D.x0 - r * 6 + 8; x < D.x1 + r * 6 - 8; x += 9) rect(x, y, 7, 4, b.ink(lid === 0 ? PAL.G2 : PAL.N3)); }
  if (lid === 1) {
    // half down: from up here we see the lid's BACK coming over (foreshortened, taller than shut), and the screen's
    // green leaking out from under its front edge onto the keys
    const Z = GERG_LAPTOP.shut, y0 = 104, y1 = D.top - 2;
    for (let y = y0; y < y1; y++) { const t = (y - y0) / (y1 - y0); const inset = Math.round((1 - t) * 18); for (let x = Z.x0 + 6 + inset; x < Z.x1 - 6 - inset; x++) b.set(x, y, y === y0 ? PAL.G5 : x === Z.x0 + 6 + inset || x === Z.x1 - 7 - inset ? PAL.G3 : (x + y * 2) % 97 < 2 ? PAL.G4 : PAL.G2); }
    for (let y = y1; y < y1 + 6; y++) for (let x = D.x0 + 4; x < D.x1 - 4; x++) if (bayer(x, y) < 0.7 - (y - y1) * 0.12) b.set(x, y, y === y1 ? PAL.L3 : PAL.L2);
    return;
  }
  // open: the bezel, the screen and what's on it
  rect(S.x - 6, S.y - 6, S.w + 12, S.h + 14, b.ink(PAL.N0)); rect(S.x - 5, S.y - 5, S.w + 10, 1, b.ink(PAL.G2));
  const scr = st.screen ?? 'chat';
  if (scr === 'dark') rect(S.x, S.y, S.w, S.h, b.ink(PAL.N1));
  else if (scr === 'thread') drawAtemThread(b, S.x, S.y, S.w, S.h, st.thread);
  else if (st.chat) drawChatWindow(b, S.x, S.y, S.w, S.h, {f, bubble: 'lit', spin: true, banner: false, ...st.chat});
  else {
    // the window with the face big in it (ChatGTP's own ECU drawing): the same two-dot face Sydney wears
    rect(S.x, S.y, S.w, S.h, b.ink(PAL.N1));
    rect(S.x, S.y, S.w, 11, b.ink(PAL.N3)); rect(S.x, S.y + 11, S.w, 1, b.ink(PAL.N0));
    for (const i of [4, 9, 14]) { b.set(S.x + i, S.y + 5, PAL.G4); b.set(S.x + i + 1, S.y + 5, PAL.G4); }
    text(b, 'CHATGTP', S.x + Math.round((S.w - textWidth('CHATGTP')) / 2), S.y + 2, PAL.P1);
    drawChatBubble(b, S.x + Math.round((S.w - CHAT_BUBBLE.ecu.w) / 2), S.y + 20, {size: 'ecu', state: 'lit', f});
  }
  // the screen's light on the deck's front edge and the hinge
  for (let x = D.x0; x < D.x1; x++) b.set(x, D.top, scr === 'dark' ? PAL.G2 : PAL.L2);
  if (st.hands ?? true) hands(b, Math.floor(f / 4));
  void line; void stepColor;
};
