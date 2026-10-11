// MR. MAS — Ep2 v1 · act3: SC 15's present-day drawings, WHERE U AT? (MAY 17, 2024; Alyi's office in the evening, then
// a stairwell). The shots pass, 2026-10-09. The room is the art pass's (art/sets/alyioffice: the desk with no chair,
// the wheel marks where it stood, the evening window); TPOOL and the thread are its props (tpoolPhone, threadPhone);
// this file stages them:
//   officeWide(b, f, st)   [W] 15.01 / 15.18: the empty office, ALYI'S DOOR from inside (the same door 14.12 pivoted:
//                          a centre pin, st.door 0 shut .. 3 edge-on), the desk with no chair (officeDesk: a working
//                          desk with depth, a monitor and a lamp; five caster dents where the chair stood), Mas on the
//                          desk's edge (Ep1's seated rig) or getting up and walking out (st.mas), the room empty after
//                          the door shuts
//   phoneInHand(b, f, ...) [ECU] 15.02 / 15.04 / 15.05 / 15.17: his phone in his hand in the evening (art/cast/hands2
//                          wrap grip), its screen any painter: the thread, TPOOL's icon, splash, welcome, typed, map;
//                          the Orb beside it scanning the 2008 hourglass and its toast `verified: 2008`; his thumb on
//                          the pin
//   masEvening(b, f, st)   [MCU] 15.03: Mas on the desk's edge, his approved portrait in the evening's warm light from
//                          the window, a face light one step; the office soft behind him
//   stairs(b, f, st)       [W] 15.19: the stairwell, Mas walking down; his phone out on the buzz (pushECU: the reporter's
//                          `request for comment`, its thumbnail a strip of receipt paper, no outlet, no headline)
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {drawOrb} from '../../../../../shared/pixel/cast/orb-medium';
import {drawToast} from '../../../../../shared/pixel/kits/orb-toast';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import {alyiOffice, OFFICE, stairwell} from '../../art/sets/alyioffice';
import {applyPalette} from '../../../../../shared/pixel/palettes';
// (the push is drawn here with its subject line: requestPushRe, a copy of the art's requestPush)
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs, Mas2Arm} from '../../art/cast/mas2';
import {skinDown} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, TR, glow, isSkin, putBustSoft, cupThumb, keyBalloon, dimRoom} from './common';

// ================================================================== the office, wide
/** Alyi's door from inside the office: the same door, on its centre pin (14.12's), turning shut: st 0 shut (face on),
 *  1..2 turning (narrower, its edge showing), 3 edge-on (the corridor's light past it) */
const pivotDoorIn = (b: Buf, step: number) => {
  const D = OFFICE.door, cx = (D.x0 + D.x1) >> 1, h = 150 - D.y0;
  fill(b, D.x0 - 3, D.y0 - 3, D.x1 - D.x0 + 6, h + 3, PAL.D1);
  // the opening: the open floor's daylight beyond (a pale grey, the far desks)
  fill(b, D.x0, D.y0, D.x1 - D.x0, h, PAL.G4); for (let y = D.y0 + 60; y < 150; y += 6) fill(b, D.x0, y, D.x1 - D.x0, 1, PAL.G3);
  const w = [D.x1 - D.x0, 30, 16, 4][step];
  fill(b, cx - (w >> 1), D.y0, w, h, PAL.D3); fill(b, cx - (w >> 1), D.y0, 1, h, PAL.D4); fill(b, cx + (w >> 1) - 2, D.y0, 2, h, PAL.D2);
  if (step === 0) { fill(b, D.x0 + 6, 98, 3, 6, PAL.G5); fill(b, D.x0 + 4, D.y0 + 10, D.x1 - D.x0 - 8, 1, PAL.D2); }
  fill(b, cx, 148, 1, 2, PAL.G5);
};
/** the desk with no chair (the review: the art's thin top on two legs read as a waiting-room bench, and its wheel marks
 *  were two-pixel dots): a working desk with depth: its top seen a little from above (the window's light along its back
 *  edge), the front edge, a drawer pedestal at the left, the recessed modesty panel over the knee-hole where his chair
 *  went, an end panel at the right; on it a monitor, off (the window's dusk a sliver on its glass), and a desk lamp;
 *  in the carpet in front of the knee-hole, the five caster dents of the chair that isn't there */
const officeDesk = (b: Buf) => {
  const D = OFFICE.desk, t = D.top;
  // the floor under it (the art's thin legs painted out)
  for (let y = t; y < 150; y++) for (let x = D.x0; x < D.x1; x++) b.set(x, y, PAL.D2);
  // the top: its surface receding to the back edge (lit by the window at the left), the front edge's lit lip
  for (let y = t - 6; y < t; y++) for (let x = D.x0 + 3; x < D.x1 - 3; x++) b.set(x, y, y === t - 6 ? PAL.D2 : x < 220 && bayer(x, y) < 0.35 ? PAL.W3 : PAL.D3);
  fill(b, D.x0, t, D.x1 - D.x0, 5, PAL.D4); fill(b, D.x0, t, D.x1 - D.x0, 1, PAL.W4); fill(b, D.x0, t + 4, D.x1 - D.x0, 1, PAL.D2);
  // the pedestal (left: three drawers), the recessed modesty panel (the knee-hole), the end panel (right)
  fill(b, D.x0 + 2, t + 5, 50, 150 - t - 5, PAL.D3); fill(b, D.x0 + 2, t + 5, 1, 150 - t - 5, PAL.D4);
  for (let q = 0; q < 3; q++) { const y = t + 5 + q * 6; fill(b, D.x0 + 2, y, 50, 1, PAL.D1); fill(b, D.x0 + 22, y + 3, 10, 1, PAL.G4); }
  fill(b, D.x0 + 52, t + 5, D.x1 - D.x0 - 64, 10, PAL.D1); fill(b, D.x0 + 52, t + 15, D.x1 - D.x0 - 64, 150 - t - 15, PAL.N1);
  fill(b, D.x1 - 12, t + 5, 10, 150 - t - 5, PAL.D3); fill(b, D.x1 - 12, t + 5, 1, 150 - t - 5, PAL.D4);
  // the monitor (off) at the back left, on its stand; the lamp at the back right, its shade over the top
  fill(b, 170, t - 34, 46, 28, PAL.N0); fill(b, 172, t - 32, 42, 24, PAL.N1); for (let i = 0; i < 10; i++) b.set(176 + i, t - 30 + i, PAL.U2);
  fill(b, 190, t - 6, 6, 2, PAL.N1); fill(b, 184, t - 4, 18, 2, PAL.N2);
  fill(b, 312, t - 4, 12, 3, PAL.N2); line(318, t - 4, 310, t - 24, b.ink(PAL.G3)); line(310, t - 24, 300, t - 18, b.ink(PAL.G3));
  fill(b, 294, t - 20, 10, 5, PAL.D3); fill(b, 294, t - 20, 10, 1, PAL.D4); fill(b, 296, t - 15, 6, 1, PAL.W3);
  // the caster dents: a five-point star in the carpet (a chair's base), each a dark pit with the crushed pile a rung up
  // round its far side
  for (const [mx, my] of [[244, 160], [228, 164], [262, 164], [234, 172], [256, 172]] as Array<[number, number]>) {
    fill(b, mx - 2, my, 5, 2, PAL.D0); b.set(mx - 3, my + 1, PAL.D0); b.set(mx + 3, my + 1, PAL.D0);
    fill(b, mx - 2, my - 1, 5, 1, PAL.D3); b.set(mx - 3, my, PAL.D3); b.set(mx + 3, my, PAL.D3);
  }
};
export const officeWide = (b: Buf, f: number, st: {door?: 0 | 1 | 2 | 3; mas?: {seated: true} | {x: number; legs: Mas2Legs; arm?: Mas2Arm; flip?: boolean} | null}) => {
  alyiOffice(b, f, {when: '2024', door: 2});
  officeDesk(b);
  pivotDoorIn(b, st.door ?? 0);
  const m = st.mas;
  if (m && 'seated' in m) drawMasSeated(b, 262, OFFICE.desk.top, {...MAS_SEATED_DEFAULT, arm: 'phone', head: 'down', light: 'room'});
  else if (m) drawMasStand2(b, m.x, 166, {legs: m.legs, arm: m.arm ?? 'down', light: 'room'}, {flip: m.flip});
};

// ================================================================== his phone in his hand (the evening)
let EVE_BG: Buf | null = null;
/** behind the phone: the office out of focus in the evening (the purple wall, the window's warm glow at the left, the
 *  desk's edge low across the frame) */
const eveningBack = (): Buf => {
  if (EVE_BG) return EVE_BG;
  const b = new Buf(W, RH, PAL.U1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = y / RH + (bayer(x, y) - 0.5) * 0.12;
    const win = x < 150 && y < 130 ? (150 - x) / 150 * (130 - y) / 130 : 0;
    b.set(x, y, t > 0.78 ? PAL.D1 : t > 0.72 ? PAL.D2 : win > 0.35 && bayer(x, y) < win ? PAL.U4 : win > 0.12 && bayer(x, y) < win * 2 ? PAL.U3 : PAL.U2);
  }
  EVE_BG = b;
  return b;
};
const HOOD_SL = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.U4];
const HOOD_CUFF = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.U4];
/** the phone rect of the ECUs (a 2024 phone's proportions; the frame crops its foot) */
export const PH = {x: 160, y: 8, w: 150, h: 300};
/** the phone in his right hand, held from below (common cupThumb: the fingers behind it, the thumb on the glass), its
 *  screen painted by `paint` into a w x h buffer; the thumb rests low on the glass at `thumb` (0..1 across the screen's
 *  visible foot) or goes to a frame point (`tip`); the screen's light on the room round it */
export const phoneInHand = (b: Buf, f: number, paint: (scr: Buf) => void, o: {thumb?: number; tip?: [number, number]; P?: {x: number; y: number; w: number; h: number}; bg?: (b: Buf) => void} = {}) => {
  if (o.bg) o.bg(b); else b.c.set(eveningBack().c.subarray(0, W * RH));
  const P = o.P ?? PH;
  const scr = new Buf(P.w, P.h, PAL.N0);
  paint(scr);
  glow(b, P.x + P.w / 2, 90, 200, 140, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h);
  const tip: [number, number] = o.tip ?? [P.x + P.w - 18 - Math.round((o.thumb ?? 0) * 60), 196];
  return cupThumb(b, P, tip, {cuffRamp: HOOD_CUFF, sleeveRamp: HOOD_SL, sleeveTo: [560, 330], widthCm: 7.4, skinMap: (c) => stepColor(c, -1), drawPhone: (bb) => {
    fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); fill(bb, P.x - 5, P.y - 5, 1, P.h + 10, PAL.G3);
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) { const Y = P.y + y; if (Y >= 0 && Y < RH) bb.set(P.x + x, Y, scr.get(x, y)); }
  }});
};
/** a 2024 phone's status bar (no real platform's marks): the time, three dots */
const statusBar = (scr: Buf, col = PAL.N8) => { tiny(scr, '7:31', 8, 4, col); for (let q = 0; q < 3; q++) fill(scr, scr.w - 22 + q * 5, 5, 3, 3, col); };
/** THE THREAD (15.02; art/sets/alyioffice threadPhone at the phone's own proportions). The fixes pass (2026-10-10): it
 *  showed Alyi's Nov 20, 2023 regret post with Mas's three hearts above his May 14 post, and V.O. 7 counted the days
 *  between them: the firing's clock (the lobby's DAYS SINCE 176 echoed it), so the episode review's newcomer reached for
 *  November as the reason he left. Now nothing older than May 14: Alyi's post, its date and its first words (After almost
 *  a decade…, his own, already read in 12.06), and under it Mas's reply collapsed to grey bars. No hearts. */
export const threadScreen = (scr: Buf, scroll = 0) => {
  fill(scr, 0, 0, scr.w, scr.h, PAL.N2); statusBar(scr);
  fill(scr, 0, 16, scr.w, 20, PAL.N1); fill(scr, 0, 36, scr.w, 1, PAL.N4); pt(scr, 'thread', Math.round(scr.w / 2 - pw('thread') / 2), 22, PAL.P1);
  const y0 = 46 - scroll;
  // Alyi's post: avatar, name, date, the first words (legible), one grey bar for the rest
  fill(scr, 6, y0, scr.w - 12, 66, PAL.N3); fill(scr, 6, y0, scr.w - 12, 1, PAL.N5);
  fill(scr, 12, y0 + 6, 14, 14, PAL.X1); fill(scr, 14, y0 + 8, 10, 10, PAL.S3); fill(scr, 14, y0 + 8, 10, 3, PAL.B1);
  pt(scr, 'Alyi', 30, y0 + 6, PAL.P2); pt(scr, 'MAY 14, 2024', 30, y0 + 16, PAL.N8);
  pt(scr, 'After almost a', 12, y0 + 30, PAL.P1); pt(scr, 'decade…', 12, y0 + 40, PAL.P1);
  fill(scr, 12, y0 + 54, scr.w - 44, 3, PAL.N6);
  // the thread's line down to his reply, collapsed
  fill(scr, 20, y0 + 68, 2, 18, PAL.N5);
  const r0 = y0 + 88;
  fill(scr, 6, r0, scr.w - 12, 42, PAL.N3); fill(scr, 6, r0, scr.w - 12, 1, PAL.N5);
  fill(scr, 12, r0 + 6, 14, 14, PAL.G1); fill(scr, 14, r0 + 9, 10, 9, PAL.S3); fill(scr, 14, r0 + 8, 10, 3, PAL.B2);
  pt(scr, 'masa', 30, r0 + 8, PAL.N8);
  for (let r = 0; r < 2; r++) fill(scr, 12, r0 + 26 + r * 7, scr.w - 30 - r * 40, 3, PAL.N6);
};
/** TPOOL, his first company's app, in its own 2008 colours inside the 2024 phone (the app's rect remapped to
 *  EARLY-WEB16): 'icon' (the home screen: every modern icon, and at the end a tiny old one, TPOOL · 2012) · 'splash'
 *  (WHERE U AT?) · 'welcome' (welcome back, mas; the 2008 hourglass spinning) · 'typed' (the field, `where u at?` typed
 *  to k glyphs, the phone's keyboard below) · 'map' (2008 tiles, every pin LAST SEEN: 2012, and one ALYI CHECKED IN ·
 *  DEC 2022 · "feel the agi"; k = the ripple's frame, `warm` 0..1 its colour, `label` the card) */
export const PIN = {x: 80, y: 92};
/** the home screen scrolled to the tiny old icon (its tile centre, screen px, at that scroll) */
export const ICON_SCROLL = 104, ICON_AT: [number, number] = [12 + 2 * 34 + 12, 22 + 5 * 40 - 104 + 11];
export const TP_KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
export const TP_KBY = 150;
export const tpKeyXY = (ch: string): [number, number] => { const c = ch.toLowerCase(); for (let r = 0; r < 3; r++) { const q = TP_KEYS[r].indexOf(c); if (q >= 0) return [6 + q * 14 + r * 7 + 6, TP_KBY + 6 + r * 22 + 9]; } return [75, TP_KBY + 6 + 3 * 22 + 7]; };
export const tpoolScreen = (scr: Buf, screen: 'icon' | 'splash' | 'welcome' | 'typed' | 'map', o: {k?: number; f?: number; warm?: number; label?: boolean; tap?: number; scroll?: number} = {}) => {
  const k = o.k ?? 99, f = o.f ?? 0;
  fill(scr, 0, 0, scr.w, scr.h, PAL.N2); statusBar(scr);
  if (screen === 'icon') {
    const C = [PAL.C4, PAL.R2, PAL.L2, PAL.W5, PAL.U4, PAL.F4, PAL.G5], sc = o.scroll ?? 0;
    for (let i = 0; i < 22; i++) { const ix = 12 + (i % 4) * 34, iy = 22 + Math.floor(i / 4) * 40 - sc; if (iy < 14 || iy > scr.h) continue; fill(scr, ix, iy, 24, 24, C[i % 7]); fill(scr, ix, iy, 24, 1, PAL.P1); fill(scr, ix + 3, iy + 28, 18, 2, PAL.N5); }
    fill(scr, 0, 0, scr.w, 16, PAL.N2); statusBar(scr);
    // the tiny old one in the last row's next slot: smaller than the rest, its own 2008 orange, a pin; TPOOL · 2012
    const tx = 12 + 2 * 34, ty = 22 + 5 * 40 - sc;
    fill(scr, tx + 5, ty + 4, 14, 14, PAL.W5); fill(scr, tx + 5, ty + 4, 14, 1, PAL.W7); fill(scr, tx + 10, ty + 7, 4, 5, PAL.R2); scr.set(tx + 12, ty + 13, PAL.R2);
    tiny(scr, 'TPOOL', tx + 12 - (tinyWidth('TPOOL') >> 1), ty + 21, PAL.P1); tiny(scr, '2012', tx + 12 - (tinyWidth('2012') >> 1), ty + 28, PAL.N7);
    if ((o.tap ?? -1) >= 0) fill(scr, tx + 3, ty + 2, 18, 18, PAL.N7);
    return;
  }
  // the app (2008): an orange header, a pale page, a blue link colour; LAST UPDATED 2012 at its foot
  const A = {x: 0, y: 16, w: scr.w, h: screen === 'typed' ? TP_KBY - 16 : scr.h - 16};
  fill(scr, A.x, A.y, A.w, A.h, PAL.P2); fill(scr, A.x, A.y, A.w, 22, PAL.W5); bpt(scr, 'TPOOL', 8, A.y + 4, PAL.P2);
  if (screen !== 'map') tiny(scr, 'LAST UPDATED 2012', A.w - tinyWidth('LAST UPDATED 2012') - 4, A.y + A.h - 8, PAL.G4);
  if (screen === 'splash') { bpt(scr, 'WHERE', Math.round(A.w / 2 - bpw('WHERE') / 2), A.y + 92, PAL.I0); bpt(scr, 'U AT?', Math.round(A.w / 2 - bpw('U AT?') / 2), A.y + 112, PAL.I0); }
  if (screen === 'welcome' || screen === 'typed') pt(scr, 'welcome back, mas', 10, A.y + 32, PAL.I0);
  if (screen === 'welcome') {
    // the 2008 hourglass (black-and-white): the sand runs down in held steps, then it flips (the sand back on top), always
    // upright on screen (the fixes pass: its sideways drawing mid-turn read as an odd 'H' bar)
    const hx = Math.round(A.w / 2) - 7, hy = A.y + 80, ph = Math.floor(f / 6) % 4;
    {
      fill(scr, hx, hy, 15, 2, PAL.N1); fill(scr, hx, hy + 24, 15, 2, PAL.N1);
      for (let j = 0; j < 11; j++) { const inset = Math.floor(j * 0.6); fill(scr, hx + 1 + inset, hy + 2 + j, 13 - inset * 2, 1, j < 5 - ph ? PAL.W6 : PAL.P2); fill(scr, hx + 1 + Math.floor((10 - j) * 0.6), hy + 13 + j, 13 - Math.floor((10 - j) * 0.6) * 2, 1, j > 8 - ph ? PAL.W6 : PAL.P2); }
      for (let j = 0; j < 11; j++) { scr.set(hx + Math.floor(j * 0.6), hy + 2 + j, PAL.N1); scr.set(hx + 14 - Math.floor(j * 0.6), hy + 2 + j, PAL.N1); scr.set(hx + Math.floor((10 - j) * 0.6), hy + 13 + j, PAL.N1); scr.set(hx + 14 - Math.floor((10 - j) * 0.6), hy + 13 + j, PAL.N1); }
      scr.set(hx + 7, hy + 13, PAL.W6);
    }
  }
  if (screen === 'typed') {
    fill(scr, 8, A.y + 50, A.w - 16, 18, PAL.P1); fill(scr, 8, A.y + 50, A.w - 16, 1, PAL.G4);
    const s = 'where u at?'.slice(0, Math.max(0, k));
    pt(scr, s, 12, A.y + 55, PAL.N1); if (Math.floor(f / 8) % 2 === 0) fill(scr, 13 + pw(s), A.y + 54, 1, 9, PAL.N1);
    fill(scr, A.w - 34, A.y + 72, 26, 12, PAL.W5); tiny(scr, 'GO', A.w - 27, A.y + 75, PAL.P2);
  }
  if (screen === 'map') {
    // 2008 tiles: green blocks, beige streets, blue water
    fill(scr, 0, A.y + 22, A.w, A.h - 22, PAL.L2);
    for (let i = 4; i < A.w; i += 24) fill(scr, i, A.y + 22, 4, A.h - 22, PAL.P1);
    for (let j = A.y + 30; j < scr.h; j += 28) fill(scr, 0, j, A.w, 4, PAL.P1);
    fill(scr, 0, scr.h - 70, 54, 70, PAL.C5);
    tiny(scr, 'LAST SEEN: 2012', 4, A.y + 26, PAL.N1);
    // every other pin, stale: a dozen grey markers (dark-rimmed, so they hold against the 2008 tiles), each tagged 2012
    // (the review: only Alyi's pin was drawn, the stale ones lost in the tiles' grey)
    // (the fixes pass: the grid pulled inside the glass, clear of the bezel, the check-in card's band and his thumb, so no
    // tag is clipped)
    const pins: Array<[number, number]> = [[26, 64], [62, 60], [88, 66], [118, 58], [124, 92], [32, 96], [104, 116], [26, 120], [56, 114], [34, 176], [76, 178], [102, 172]];
    pins.forEach(([px, py]) => {
      fill(scr, px - 3, py - 9, 7, 7, PAL.N1); fill(scr, px - 2, py - 8, 5, 5, PAL.G3); scr.set(px - 1, py - 7, PAL.G5);
      scr.set(px - 1, py - 2, PAL.N1); scr.set(px, py - 2, PAL.N1); scr.set(px + 1, py - 2, PAL.N1); scr.set(px, py - 1, PAL.N1);
      const tw = tinyWidth('2012') + 2; fill(scr, px - (tw >> 1), py + 1, tw, 7, PAL.P2); tiny(scr, '2012', px - (tw >> 1) + 1, py + 2, PAL.N1);
    });
    // the one checked in: its ripple turning warm (o.warm), the pin pulsing
    const r = (k % 30) / 2, warm = o.warm ?? 0;
    for (let a = 0; a < 48; a++) { const t = (a / 48) * Math.PI * 2; scr.set(Math.round(PIN.x + Math.cos(t) * (5 + r)), Math.round(PIN.y + Math.sin(t) * (5 + r) * 0.8), warm > 0.5 ? PAL.W7 : r > 8 ? PAL.W5 : PAL.R2); }
    const pulse = Math.floor(k / 6) % 2;
    fill(scr, PIN.x - 3 - pulse, PIN.y - 8 - pulse, 7 + pulse * 2, 7 + pulse * 2, PAL.R2); fill(scr, PIN.x - 1, PIN.y - 6, 3, 3, PAL.P2); scr.set(PIN.x, PIN.y, PAL.R2);
    // the check-in card: its quote on one line (the fixes pass: it wrapped 'feel / the agi')
    if (o.label) { const ly = 128; fill(scr, 4, ly, A.w - 8, 34, PAL.P2); fill(scr, 4, ly, A.w - 8, 1, PAL.W5); pt(scr, 'ALYI CHECKED IN', 8, ly + 3, PAL.N1); pt(scr, 'DEC 2022', 8, ly + 13, PAL.N1); pt(scr, '"feel the agi"', 8, ly + 23, PAL.I0); }
  }
  applyPalette(scr, 'EARLYWEB16', {rect: [A.x, A.y, A.w, A.h]});
  if (screen === 'typed') {
    // the phone's own keyboard (2024, not the app's): grey keys; the pressed key lit
    fill(scr, 0, TP_KBY, scr.w, scr.h - TP_KBY, PAL.N2);
    const typedN = Math.max(0, k), ch = typedN > 0 && typedN <= 11 ? 'where u at?'[typedN - 1] : '';
    TP_KEYS.forEach((row, r) => { for (let q = 0; q < row.length; q++) { const kx = 6 + q * 14 + r * 7, ky = TP_KBY + 6 + r * 22, on = row[q] === ch; fill(scr, kx, ky, 12, 18, on ? PAL.N7 : PAL.N4); fill(scr, kx, ky + 17, 12, 1, PAL.N1); tiny(scr, row[q].toUpperCase(), kx + 4, ky + 6, on ? PAL.P2 : PAL.N8); } });
    fill(scr, 34, TP_KBY + 6 + 66, scr.w - 68, 14, ch === ' ' ? PAL.N7 : PAL.N4);
  }
};
/** the Orb beside the phone, scanning the hourglass in held steps (its fan), then its toast `verified: 2008` */
export const orbScan = (b: Buf, f: number, st: {scan: number; toast: number}) => {
  const ox = 392, oy = 70;
  drawOrb(b, ox, oy, 24, {look: [-0.95, 0.15], aperture: st.scan > 0 ? 0.85 : 0.5, scanning: st.scan > 0, monitor: -1});
  if (st.scan > 0) for (let i = 0; i < 120; i++) { const x = ox - 26 - i, y0 = oy + Math.round(i * 0.2 * ((st.scan % 3) - 1) * 0.5) - Math.round(i * 0.22), y1 = oy + Math.round(i * 0.22) + 10; if (i % 3 === (st.scan & 1)) { b.set(x, y0, PAL.C5); b.set(x, y1, PAL.C5); } }
  if (st.toast >= 0) drawToast(b, ox + 30, oy - 40, 'verified: 2008', st.toast, {anchor: 'right', f});
};

// ================================================================== 15.03: his face in the evening
let MCU_BG: Buf | null = null;
const officeSoft = (): Buf => {
  if (MCU_BG) return MCU_BG;
  const t = new Buf(W, 270, PAL.N0);
  alyiOffice(t, 0, {when: '2024', door: 2});
  pivotDoorIn(t, 0);
  // the room reframed on the door side (he faces the window, off frame left), soft two rungs
  const out = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) out.set(x, y, stepColor(t.get(Math.min(479, Math.round(x * 0.7 + 150)), Math.min(202, Math.round(y * 0.8 + 20))), -2));
  MCU_BG = out;
  return out;
};
const EVE = new Map<string, ReturnType<typeof masPortrait>>();
/** his portrait in the evening: the warm rig, keyed a step from the window (camera-left), the window's dusk pink on
 *  his rim */
export const masEveImg = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = EVE.get(key); if (hit) return hit;
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: -1, ...s});
  const RIM: Record<number, number> = {[PAL.W5]: PAL.U4, [PAL.W6]: PAL.U5, [PAL.W8]: PAL.W7};
  const c = im.c.slice(); for (let i = 0; i < c.length; i++) { const v = c[i]; if (v >= 0 && RIM[v] !== undefined) c[i] = RIM[v]; }
  const out = faceLightImg({...im, c}, 1, {key: [-1, -0.25]});
  EVE.set(key, out);
  return out;
};
export const masEvening = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; lid?: 0 | 1 | 2; look?: -1 | 0 | 1} = {}) => {
  b.c.set(officeSoft().c.subarray(0, W * RH));
  putBustSoft(b, masEveImg({mouth: st.mouth ?? 'rest', lid: st.lid ?? 0, look: st.look ?? -1}), 150, 30, RH);
  void f;
};

// ================================================================== 15.19: the stairwell and the push
export const stairs = (b: Buf, f: number, st: {x: number; step: number; legs: Mas2Legs; phone?: boolean}) => {
  stairwell(b, f, {push: false}, (bb) => {
    // the treads go down to the right one step per 18 px across, 10 px down
    const y = 40 + Math.round((st.x - 60) / 18) * 10 + 10;
    drawMasStand2(bb, st.x, y, {legs: st.legs, arm: st.phone ? 'phone' : 'down', bow: !!st.phone, light: 'room'});
  });
};
/** the reporter's push with its subject line (the fixes pass, 2026-10-10: the art's requestPush, copied, plus
 *  `re: exit agreements`, so the receipt at NopeAI's doors has its cause on screen first; no outlet, no headline words) */
const requestPushRe = (b: Buf, x: number, y: number, w = 170) => {
  fill(b, x - 1, y - 1, w + 2, 42, PAL.N0); fill(b, x, y, w, 40, PAL.N3); fill(b, x, y, w, 1, PAL.C5);
  fill(b, x + 6, y + 5, 10, 30, PAL.P2); for (let j = 0; j < 30; j += 4) fill(b, x + 7, y + 6 + j, 7, 1, PAL.G4);
  pt(b, 'request for comment', x + 24, y + 8, PAL.P2);
  pt(b, 're: exit agreements', x + 24, y + 22, PAL.N8);
};
/** [ECU] the push on his phone as he walks (the wrap grip), the stair's grey behind */
export const pushECU = (b: Buf, f: number, st: {k: number}) => {
  phoneInHand(b, f, (scr) => {
    vramp(scr, 0, 0, scr.w, scr.h, [PAL.N1, PAL.N2, PAL.N1]);
    // the lock screen: the time, then the push dropping in (2 held steps)
    pt(scr, '7:42', Math.round(scr.w / 2 - pw('7:42') / 2), 30, PAL.N8);
    const y = st.k < 2 ? 56 : st.k < 4 ? 62 : 66;
    if (st.k >= 0) requestPushRe(scr, 4, y, scr.w - 8);
  }, {bg: (bb) => { vramp(bb, 0, 0, W, RH, [PAL.G1, PAL.G2, PAL.G2]); for (let k = 0; k < 10; k++) { fill(bb, k * 54 - 20, 120 + k * 9, 54, 9, PAL.G3); fill(bb, k * 54 - 20, 120 + k * 9, 54, 1, PAL.G5); } }});
};
void skinDown; void rect; void line; void ellipse; void hash; void clamp; void lightness; void tiny; void tinyWidth; void TR; void isSkin; void cupThumb; void keyBalloon; void dimRoom; void roomWalkAt;

// ================================================================== 15.05: he types the app's own question
/** the phone held from below (the cup grip), TPOOL's field and the phone's keyboard; his thumb posed on the key of the
 *  letter it types (common cupThumb, as Act Two's), the key's preview above it */
export const PT = {x: 166, y: -40, w: 150, h: 300};
export const typeECU = (b: Buf, f: number, st: {typed: number}) => {
  b.c.set(eveningBack().c.subarray(0, W * RH));
  const P = PT, scr = new Buf(P.w, P.h, PAL.N0);
  const n = clamp(st.typed, 0, 11), ch = n > 0 && n <= 11 ? 'where u at?'[n - 1] : '';
  tpoolScreen(scr, 'typed', {k: n, f});
  const kxy = n >= 1 && n <= 11 ? tpKeyXY(ch) : tpKeyXY('a');
  if (n >= 1 && n <= 11 && /[a-z]/i.test(ch)) keyBalloon(scr, kxy, ch, 12, 18);
  glow(b, P.x + P.w / 2, 90, 200, 140, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h);
  const tip: [number, number] = [P.x + kxy[0] + 2, P.y + kxy[1] + 4];
  cupThumb(b, P, tip, {cuffRamp: HOOD_CUFF, sleeveRamp: HOOD_SL, sleeveTo: [560, 330], widthCm: 7.4, skinMap: (c) => stepColor(c, -1), drawPhone: (bb) => {
    fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); fill(bb, P.x - 5, P.y - 5, 1, P.h + 10, PAL.G3);
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) { const Y = P.y + y; if (Y >= 0 && Y < RH) bb.set(P.x + x, Y, scr.get(x, y)); }
  }});
};
