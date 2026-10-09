// MR. MAS — Ep2 v1 art: SET-13, ALYI'S OFFICE (sc 15: 2024, evening, empty: a desk with no chair; F2.2's 2023, at night,
// his chair and his screen) and the STAIRWELL outside it, plus TPOOL on a 2024 phone (§3: the splash WHERE U AT?, LAST
// UPDATED 2012, `welcome back, mas`, a 2008 hourglass, the map with every pin LAST SEEN: 2012 but one: ALYI CHECKED IN
// · DEC 2022 · "feel the agi", its ripple turning warm). Nothing in the room is a reason for anything.
//   alyiOffice(b, f, st)      [W] st {when: '2024' (evening, empty, a desk with no chair, Mas on its edge drawn by the
//                             cast) | '2023' (night, his chair, his screen lit), door: 0 open .. 2 shut (it swings shut
//                             on the empty room)}
//   screen2023(b, f, st)      [2S] F2.2 15.10-15.11: Alyi at his screen at night, the screen's edge cropping him (his
//                             frame rule), EKIEL beside him squinting at it; the post on it in its own UI:
//                             INTRODUCING SUPERALIGNMENT · ALYI, EKIEL and its sentence (st.ekiel, st.alyi moods)
//   publishECU(b, f, st)      [ECU] 15.12 / 15.14: his finger over / on the bare Publish button (no cursor, no hover)
//   stairwell(b, f, st)       [W] -> [ECU] 15.19: a plain stairwell, Mas small on the stairs (the cast), his phone
//                             buzzing; st.push: the reporter's `request for comment`, its thumbnail a strip of receipt
//   tpoolPhone(b, f, st)      [ECU] / [POV] 15.04-15.05, 20.11: TPOOL in EARLY-WEB16 colours inside a 2024 phone:
//                             st.screen 'icon' | 'splash' | 'welcome' | 'typed' | 'map' | 'knocked' (the link card lands
//                             on the pin and knocks it off) | 'fallen', st.k (typing / the ripple's step)
//   threadPhone(b, f)         [ECU] 15.02: the thread collapsed to dates and first lines: NOV 20, 2023 · ♥ ♥ ♥ · MAY 14,
//                             2024
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith, grip, HANDSKIN, sp} from '../kit';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {alyiWarm} from '../cast/alyi2';
import {ekielBust} from '../cast/ekiel';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawMasStand2} from '../cast/mas2';
import {placeHand, drawHand, sleeve, POSES} from '../cast/hands2';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ the office
export const OFFICE = {desk: {x0: 150, x1: 330, top: 128}, door: {x0: 400, x1: 444, y0: 50}, win: {x0: 20, x1: 130, y0: 30, y1: 120}};
export const alyiOffice = (b: Buf, f: number, st: {when?: '2024' | '2023'; door?: 0 | 1 | 2} = {}) => {
  const night = st.when === '2023';
  // walls (evening: warm low sun through the window; 2023 night: dark, the screen's cyan)
  vramp(b, 0, 0, 480, 150, night ? [PAL.N0, PAL.N1, PAL.N1] : [PAL.U1, PAL.U2, PAL.D2]);
  fill(b, 0, 150, 480, RH - 150, night ? PAL.N1 : PAL.D1); fill(b, 0, 150, 480, 1, night ? PAL.N2 : PAL.D3);
  // the window: an evening sky (2024) / the city at night (2023)
  const W = OFFICE.win;
  fill(b, W.x0 - 3, W.y0 - 3, W.x1 - W.x0 + 6, W.y1 - W.y0 + 6, PAL.N0);
  if (night) { vramp(b, W.x0, W.y0, W.x1 - W.x0, W.y1 - W.y0, [PAL.N1, PAL.N2, PAL.U0]); for (let k = 0; k < 40; k++) b.set(W.x0 + Math.floor(hash(k, 1, 6) * (W.x1 - W.x0)), W.y0 + 40 + Math.floor(hash(k, 2, 6) * 40), PAL.W5); }
  else { vramp(b, W.x0, W.y0, W.x1 - W.x0, W.y1 - W.y0, [PAL.U2, PAL.U3, PAL.U4, PAL.W4]); for (const [bx, top, bw] of [[20, 90, 20], [42, 76, 18], [62, 96, 26], [90, 84, 20], [112, 92, 18]] as Array<[number, number, number]>) fill(b, bx, top, bw, W.y1 - top, PAL.U1); }
  fill(b, (W.x0 + W.x1) >> 1, W.y0, 2, W.y1 - W.y0, PAL.N0);
  // the evening light's patch on the floor and the desk
  if (!night) for (let y = 150; y < RH; y++) for (let x = 0; x < 300; x++) { const u = x - (y - 150) * 1.6; if (u > 10 && u < 120 && bayer(x, y) < 0.4) b.set(x, y, stepColor(b.get(x, y), 2)); }
  // the desk: 2024 bare (no chair); 2023 his screen lit and his chair
  const D = OFFICE.desk;
  fill(b, D.x0, D.top, D.x1 - D.x0, 4, night ? PAL.N3 : PAL.D4); fill(b, D.x0, D.top, D.x1 - D.x0, 1, night ? PAL.C3 : PAL.W4);
  fill(b, D.x0 + 4, D.top + 4, 3, 150 - D.top - 4, PAL.N1); fill(b, D.x1 - 7, D.top + 4, 3, 150 - D.top - 4, PAL.N1);
  if (night) {
    fill(b, 220, 92, 64, 36, PAL.N0); fill(b, 222, 94, 60, 32, PAL.C3); fill(b, 248, 128, 8, 3, PAL.N0);
    fill(b, 300, 112, 20, 30, PAL.N2); fill(b, 296, 140, 28, 4, PAL.N2); fill(b, 308, 144, 3, 6, PAL.G3);
    for (let y = 92; y < 150; y++) for (let x = 150; x < 350; x++) { const d = Math.hypot((x - 252) / 110, (y - 110) / 50); if (d < 1 && bayer(x, y) < (1 - d) * 0.45) b.set(x, y, stepColor(b.get(x, y), 1)); }
  } else {
    // the chair's absence: four faint wheel marks in the carpet where it stood
    for (const [mx, my] of [[234, 166], [254, 168], [244, 172], [262, 165]]) { b.set(mx, my, PAL.D2); b.set(mx + 1, my, PAL.D2); }
  }
  // the door (right): open, then swinging shut on the empty room
  const Dr = OFFICE.door, open = st.door ?? 0;
  fill(b, Dr.x0 - 2, Dr.y0 - 2, Dr.x1 - Dr.x0 + 4, 150 - Dr.y0 + 2, PAL.D1);
  const leafW = [8, 24, Dr.x1 - Dr.x0][open];
  fill(b, Dr.x0, Dr.y0, Dr.x1 - Dr.x0, 150 - Dr.y0, night ? PAL.N2 : PAL.W2);
  fill(b, Dr.x1 - leafW, Dr.y0, leafW, 150 - Dr.y0, PAL.D3); fill(b, Dr.x1 - leafW, Dr.y0, 1, 150 - Dr.y0, PAL.D4);
  if (open === 2) fill(b, Dr.x0 + 6, 100, 3, 6, PAL.G5);
};
export const screen2023 = (b: Buf, f: number, st: {alyiMouth?: 'rest' | 'O' | 'E'; ekielMouth?: 'rest' | 'E' | 'A'} = {}) => {
  // night. The screen is close at frame LEFT, in their eyeline: both of them face it (camera-left), its cyan the key on
  // the sides of their faces turned to it, their own skin in the shadow (P8: two people at a screen). Alyi is nearest
  // it, its bezel cropping his near shoulder (his frame rule); Ekiel behind his shoulder, squinting at the post.
  vramp(b, 0, 0, 480, RH, [PAL.N0, PAL.N1, PAL.N1]);
  // the screen's light falling across the room from the left
  for (let y = 0; y < RH; y++) for (let x = 150; x < 480; x++) if (bayer(x, y) < Math.max(0, 0.5 - (x - 150) / 520)) b.set(x, y, stepColor(b.get(x, y), 1));
  putBustCut(b, ekielBust({mouth: st.ekielMouth ?? 'rest', expr: 'squint', lanyard: 'none', light: 'screen'}), 300, 50, RH);
  putBustCut(b, alyiWarm({mood: 'focus', mouth: st.alyiMouth ?? 'rest', arm: 'none', light: 'screen'}), 166, 58, RH);
  // the screen (close, left), its post in its own UI, the bezel's right edge over his near shoulder
  fill(b, 0, 8, 186, 195, PAL.N0); fill(b, 4, 14, 176, 189, PAL.N2); fill(b, 183, 8, 3, 195, PAL.N3);
  fill(b, 10, 22, 164, 22, PAL.C1); pt(b, 'INTRODUCING', 14, 24, PAL.P2); pt(b, 'SUPERALIGNMENT', 14, 33, PAL.C8);
  pt(b, 'ALYI, EKIEL', 14, 50, PAL.N7);
  const s = 'Currently, we don\'t have a solution for steering or controlling a potentially superintelligent AI, and preventing it from going rogue.';
  pwrap(s, 156).forEach((l, i) => pt(b, l, 14, 66 + i * 11, PAL.P1));
  fill(b, 14, 176, pw('Publish') + 12, 16, PAL.C3); pt(b, 'Publish', 20, 180, PAL.P2);
};
/** [ECU] 15.12 / 15.14: the bare Publish button (no hover, no cursor) and his hand from the right, the index out and
 *  down, its tip hovering a few pixels above the button (15.12) or on it (15.14); a real hand (Ep1's insert-hands
 *  grammar: knuckles, nails, the thumb tucked, the wrist into the sweater's cuff and sleeve) */
export const publishECU = (b: Buf, f: number, st: {press?: boolean; who?: 'alyi' | 'mas'} = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.N1, PAL.N2, PAL.N2]);
  // the screen's own light: the page around the button, its grey text rows
  fill(b, 40, 20, 400, 160, PAL.N3); for (let r = 0; r < 4; r++) fill(b, 60, 32 + r * 10, 300 - r * 40, 3, PAL.N5);
  fill(b, 120, 96, 220, 60, st.press ? PAL.C2 : PAL.C3); fill(b, 120, 96, 220, 2, st.press ? PAL.C3 : PAL.C5); fill(b, 120, 154, 220, 2, PAL.C1);
  bpt(b, 'Publish', 230 - Math.round(bpw('Publish') / 2), 118, PAL.P2);
  const mas = st.who === 'mas';
  const SL = mas ? [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.C4] : [PAL.N0, PAL.X0, PAL.X0, PAL.X1, PAL.X2, PAL.X2, PAL.W5];
  const tip: [number, number] = st.press ? [214, 112] : [214, 84];
  const h = placeHand(POSES.point([-0.78, 0.5, -0.38], [0.25, -0.6, 0.76]), {s: 6.4, at: tip, light: mas ? 'dark' : 'lobby', cuffRamp: SL, key: [-0.4, -0.6, 0.7]});
  // the sleeve from the cuff out of frame right
  const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], L = Math.hypot(dx, dy) || 1;
  sleeve(b, [cx, cy], [cx + (dx / L) * 220, cy + (dy / L) * 220], 19, 22, [SL[0], SL[1], SL[3], SL[4], SL[6]]);
  // its shadow on the screen (offset down-left), then the hand
  if (!st.press) for (let j = 0; j < h.hand.img.h; j++) for (let i = 0; i < h.hand.img.w; i++) if (h.hand.img.c[j * h.hand.img.w + i] >= 0) { const X = h.x + i - 4, Y = h.y + j + 9; if (Y > 96 && Y < 154 && X > 120 && X < 340 && bayer(X, Y) < 0.5) b.set(X, Y, stepColor(b.get(X, Y), -1)); }
  drawHand(b, h.hand, h.x, h.y);
};
export const stairwell = (b: Buf, f: number, st: {push?: boolean} = {}, cast?: (b: Buf) => void) => {
  // a plain stairwell: concrete flights zig-zagging down, a handrail, the exit light's green, evening through a slit window
  vramp(b, 0, 0, 480, RH, [PAL.G1, PAL.G2, PAL.G2]);
  for (let k = 0; k < 14; k++) { const x = 60 + k * 18, y = 40 + k * 10; fill(b, x, y, 18, 10, PAL.G3); fill(b, x, y, 18, 1, PAL.G5); fill(b, x, y + 10, 18, RH, PAL.G2); }
  // the far wall's handrail at a person's waist (about 38 px over the treads), its posts down to every other step
  for (let k = 0; k < 14; k++) { const x = 60 + k * 18; line(x, 2 + k * 10, x + 18, 12 + k * 10, b.ink(PAL.G6)); if (k % 2 === 0) line(x + 9, 7 + k * 10, x + 9, 40 + k * 10, b.ink(PAL.G4)); }
  fill(b, 30, 20, 8, 70, PAL.U3); fill(b, 420, 20, 24, 8, PAL.L2); fill(b, 422, 22, 20, 4, PAL.L3);
  cast?.(b);
  if (st.push) {
    // the reporter's push on his phone, its thumbnail a strip of receipt paper (no outlet, no headline words)
    fill(b, 300, 140, 170, 40, PAL.N0); fill(b, 302, 142, 166, 36, PAL.N3); fill(b, 302, 142, 166, 1, PAL.C5);
    fill(b, 308, 148, 10, 24, PAL.P2); for (let j = 0; j < 24; j += 4) fill(b, 309, 149 + j, 7, 1, PAL.G4);
    pt(b, 'request for comment', 326, 156, PAL.P2);
  }
};

// ------------------------------------------------------------------ TPOOL on a 2024 phone
/** a 2024 phone's screen with an EARLY-WEB16-coloured app in it (the app's own old colours inside a modern bezel) */
export const tpoolPhone = (b: Buf, f: number, st: {screen: 'icon' | 'splash' | 'welcome' | 'typed' | 'map' | 'knocked' | 'fallen'; k?: number; hand?: boolean}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.N1 : PAL.N0);
  const P = {x: 150, y: 6, w: 180, h: 197};
  fill(b, P.x - 4, P.y - 4, P.w + 8, P.h + 8, PAL.G1); fill(b, P.x - 4, P.y - 4, P.w + 8, 1, PAL.G3); fill(b, P.x, P.y, P.w, P.h, PAL.N0);
  const S = {x: P.x + 4, y: P.y + 10, w: P.w - 8, h: P.h - 14};
  const k = st.k ?? 99;
  if (st.screen === 'icon') {
    // the home screen: every modern icon, and a tiny old one at the end: TPOOL (orange, a pin)
    fill(b, S.x, S.y, S.w, S.h, PAL.N2);
    // (eighteen modern icons, then the tiny old one in the next empty slot, its name and year under it, inside the
    // screen: it no longer sits on top of another app's tile)
    for (let i = 0; i < 18; i++) { const ix = S.x + 10 + (i % 4) * 42, iy = S.y + 8 + Math.floor(i / 4) * 34; fill(b, ix, iy, 26, 26, [PAL.C4, PAL.R2, PAL.L2, PAL.W5, PAL.U4, PAL.F4, PAL.G5][i % 7]); fill(b, ix, iy, 26, 1, PAL.P1); }
    const tx = S.x + 10 + 2 * 42, ty = S.y + 8 + 4 * 34;
    fill(b, tx + 6, ty + 2, 14, 14, PAL.W5); fill(b, tx + 6, ty + 2, 14, 1, PAL.W7); fill(b, tx + 11, ty + 5, 4, 5, PAL.R2); b.set(tx + 13, ty + 11, PAL.R2);
    tiny(b, 'TPOOL', tx + 13 - (tinyWidth('TPOOL') >> 1), ty + 19, PAL.P1); tiny(b, '2012', tx + 13 - (tinyWidth('2012') >> 1), ty + 26, PAL.N7);
  } else if (st.screen === 'splash' || st.screen === 'welcome' || st.screen === 'typed') {
    // the app's own 2008 look: orange header, a blue link colour, an hourglass spinning in 2008's grey
    fill(b, S.x, S.y, S.w, S.h, PAL.P2); fill(b, S.x, S.y, S.w, 22, PAL.W5); bpt(b, 'TPOOL', S.x + 8, S.y + 4, PAL.P2);
    tiny(b, 'LAST UPDATED 2012', S.x + S.w - tinyWidth('LAST UPDATED 2012') - 4, S.y + S.h - 8, PAL.G4);
    if (st.screen === 'splash') bpt(b, 'WHERE U AT?', S.x + S.w / 2 - Math.round(bpw('WHERE U AT?') / 2), S.y + 80, PAL.I0);
    if (st.screen !== 'splash') pt(b, 'welcome back, mas', S.x + 12, S.y + 34, PAL.I0);
    if (st.screen === 'welcome') {
      // the 2008 hourglass (black-and-white, two triangles, sand running)
      const hx = S.x + S.w / 2 - 6, hy = S.y + 70;
      fill(b, hx, hy, 13, 2, PAL.N1); fill(b, hx, hy + 22, 13, 2, PAL.N1);
      for (let j = 0; j < 10; j++) { const w = 11 - j; fill(b, hx + 1 + Math.floor(j / 2), hy + 2 + j, w - Math.floor(j / 2), 1, j < 5 - (Math.floor(f / 6) % 3) ? PAL.W6 : PAL.P2); fill(b, hx + 1 + Math.floor((9 - j) / 2), hy + 12 + j, w - Math.floor((9 - j) / 2) + (j % 2), 1, j > 7 - (Math.floor(f / 6) % 3) ? PAL.W6 : PAL.P2); }
      line(hx, hy + 2, hx + 6, hy + 12, b.ink(PAL.N1)); line(hx + 12, hy + 2, hx + 6, hy + 12, b.ink(PAL.N1)); line(hx, hy + 22, hx + 6, hy + 12, b.ink(PAL.N1)); line(hx + 12, hy + 22, hx + 6, hy + 12, b.ink(PAL.N1));
    }
    if (st.screen === 'typed') { fill(b, S.x + 10, S.y + 60, S.w - 20, 18, PAL.P1); fill(b, S.x + 10, S.y + 60, S.w - 20, 1, PAL.G4); const s = 'where u at?'.slice(0, k); pt(b, s, S.x + 14, S.y + 65, PAL.N1); if (Math.floor(f / 8) % 2) fill(b, S.x + 15 + pw(s), S.y + 64, 1, 9, PAL.N1); }
  } else {
    // the map: 2008 tiles (green blocks, beige streets, blue water), pins LAST SEEN: 2012, and one checked in
    fill(b, S.x, S.y, S.w, S.h, PAL.L2);
    for (let i = 0; i < S.w; i += 22) fill(b, S.x + i, S.y, 3, S.h, PAL.P1); for (let j = 0; j < S.h; j += 26) fill(b, S.x, S.y + j, S.w, 3, PAL.P1);
    fill(b, S.x, S.y + S.h - 40, 60, 40, PAL.C5);
    const pins: Array<[number, number]> = [[30, 40], [100, 30], [140, 90], [60, 120], [120, 150], [20, 80]];
    pins.forEach(([px, py]) => { fill(b, S.x + px, S.y + py, 5, 6, PAL.G4); b.set(S.x + px + 2, S.y + py + 6, PAL.G4); });
    tiny(b, 'LAST SEEN: 2012', S.x + 4, S.y + 4, PAL.N2);
    const [ax, ay] = [S.x + 84, S.y + 70];
    if (st.screen === 'map') {
      // its ripple, warming (the string lights' amber), then the label
      const r = (k % 30) / 2;
      for (let a = 0; a < 40; a++) { const t = (a / 40) * Math.PI * 2; b.set(Math.round(ax + 2 + Math.cos(t) * (4 + r)), Math.round(ay + 3 + Math.sin(t) * (4 + r) * 0.7), r > 8 ? PAL.W7 : PAL.W5); }
      fill(b, ax, ay, 6, 7, PAL.R2); b.set(ax + 2, ay + 7, PAL.R2);
      fill(b, S.x + 4, S.y + S.h - 30, S.w - 8, 24, PAL.P2); tiny(b, 'ALYI CHECKED IN · DEC 2022', S.x + 6, S.y + S.h - 28, PAL.N1); pt(b, '"feel the agi"', S.x + 6, S.y + S.h - 20, PAL.I0);
    } else if (st.screen === 'knocked') {
      // the Jun 19 link card landing on the pin and knocking it loose
      fill(b, S.x + 50, S.y + 50, 100, 34, PAL.N2); fill(b, S.x + 50, S.y + 50, 100, 1, PAL.C5); bpt(b, 'ISS', S.x + 56, S.y + 54, PAL.P2);
      fill(b, ax + 18, ay + 22, 6, 7, PAL.R2);
    }
  }
  // the app's own era: its screen in EARLY-WEB16 (16 web colours, the GIF-era dither), inside the 2024 bezel
  if (st.screen !== 'icon') applyPalette(b, 'EARLYWEB16', {rect: [S.x, S.y, S.w, S.h]});
  if (st.hand) { grip(b, P.x + P.w - 8, P.y + 140, 12, -1, HANDSKIN[0]); }
};
export const threadPhone = (b: Buf, f: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0);
  const P = {x: 140, y: 6, w: 200, h: 197};
  fill(b, P.x - 4, P.y - 4, P.w + 8, P.h + 8, PAL.G1); fill(b, P.x, P.y, P.w, P.h, PAL.N2);
  // two posts collapsed to their dates and first lines (not must-read text): Alyi's regret post with three hearts
  // (his), and Alyi's May 14 post below it in the same thread
  const card = (y: number, date: string, hearts: boolean) => { fill(b, P.x + 8, y, P.w - 16, 56, PAL.N3); fill(b, P.x + 8, y, P.w - 16, 1, PAL.N5); fill(b, P.x + 14, y + 6, 14, 14, PAL.X1); pt(b, 'Alyi', P.x + 34, y + 8, PAL.P2); pt(b, date, P.x + P.w - 20 - pw(date), y + 8, PAL.N7); for (let r = 0; r < 2; r++) fill(b, P.x + 34, y + 24 + r * 9, 120 - r * 40, 3, PAL.N6); if (hearts) for (let h = 0; h < 3; h++) sp(b, P.x + 34 + h * 9, y + 43, ['.#.#.', '#####', '#####', '.###.', '..#..'], {'#': PAL.R3}); };
  card(P.y + 16, 'NOV 20, 2023', true);
  fill(b, P.x + 20, P.y + 74, 2, 30, PAL.N5);
  card(P.y + 106, 'MAY 14, 2024', false);
};

export const ART: ArtAsset[] = [
  {
    id: 'set13-alyioffice', manifest: 'SET-13 · Alyi\'s office (2024 evening, empty; 2023 night) and the stairwell', kind: 'set', name: 'Alyi\'s office: empty in May 2024; his screen in 2023; the stairwell',
    file: 'sets/alyioffice.ts', exports: 'alyiOffice, OFFICE, screen2023, publishECU, stairwell', scenes: '15 (and F2.2)',
    note: 'the desk with no chair (wheel marks where it stood); 2023: his screen crops him, Ekiel squints at the post; the bare Publish (no cursor); the stairwell push',
    stills: [
      {label: '[W] 15.01: the empty office in the evening: a desk with no chair, the door open; Mas sits on the desk\'s edge (cast)', draw: (b) => { alyiOffice(b, 0, {when: '2024'}); drawMasSeated(b, 196, OFFICE.desk.top, {...MAS_SEATED_DEFAULT, arm: 'phone', head: 'down', light: 'room'}); }},
      {label: '[2S] F2.2 15.10-15.11: 2023, night: Ekiel squinting, Alyi at his screen ("Someone should."), the screen\'s edge cropping him, the post and its Publish', draw: (b) => screen2023(b, 0, {alyiMouth: 'O'})},
      {label: '[ECU] 15.12 his finger above the bare Publish (no hover)', draw: (b) => publishECU(b, 0, {press: false, who: 'alyi'})},
      {label: '[W] 15.19 the stairwell, the request for comment push', draw: (b) => stairwell(b, 0, {push: true}, (bb) => drawMasStand2(bb, 177, 100, {arm: 'phone', bow: true, legs: 'stand'}))},
    ],
  },
  {
    id: 'prop-tpool', manifest: '§3 TPOOL on a 2024 phone · the thread', kind: 'prop', name: 'TPOOL (his first company\'s app, LAST UPDATED 2012) and the thread',
    file: 'sets/alyioffice.ts', exports: 'tpoolPhone, threadPhone', scenes: '15, 20, 22',
    note: 'EARLY-WEB colours inside a modern bezel; WHERE U AT?, welcome back, mas, the 2008 hourglass; the one warm pin; the link card knocks it loose',
    stills: [
      {label: '[ECU] 15.02 the thread collapsed to its dates and first lines', draw: (b) => threadPhone(b, 0)},
      {label: '[ECU] 15.04 the tiny old icon at the end of his home screen: TPOOL · 2012', draw: (b) => tpoolPhone(b, 0, {screen: 'icon'})},
      {label: '[ECU] the splash: WHERE U AT? · LAST UPDATED 2012', draw: (b) => tpoolPhone(b, 0, {screen: 'splash'})},
      {label: 'welcome back, mas (the 2008 hourglass)', draw: (b) => tpoolPhone(b, 0, {screen: 'welcome'})},
      {label: 'typed: where u at?', draw: (b) => tpoolPhone(b, 0, {screen: 'typed', k: 11})},
      {label: 'the map: every pin LAST SEEN: 2012 but one, ALYI CHECKED IN · DEC 2022 · "feel the agi", its ripple warming', draw: (b) => tpoolPhone(b, 20, {screen: 'map', k: 20})},
    ],
  },
];
void rect; void ellipse; void clamp; void TR; void dith;
