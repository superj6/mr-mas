// MR. MAS — Ep2 v1 art: SET-06, THE CATHEDRAL, CUT AWAY (sc 7). A dollhouse cross-section drawn TALLER THAN THE FRAME
// (480 x 430): the dark room at the top (Mas at his monitor), NopeAI's floors, the foundation, MACROSOFT's plinth
// `BELOW · ABOVE · AROUND`, the basement (the Humanist's sealed DEFLECTION (LICENSED) boxes, their labels faded; Tasya in
// the doorway, his phone face up on a box), and the bedrock with Ep1's odometer still wedged in it (the egg). The two
// halves slide apart in whole-pixel steps; the lights click on floor by floor; the camera pans whole pixels up the
// section to Mas, whose monitor has stepped down a rung.
//   cutaway(b, f, st)         the 203-row window: st {split: 0..28 (px each half has slid out), lit: 0..6 (floors lit,
//                             from the basement up), pan: 0..SECTION_H-203 (the window's top row in the section), dim:
//                             Mas's monitor a rung down}
//   basement2S(b, f, st)      [2S] the Humanist by his boxes (screen-left) and Tasya in the doorway (screen-right):
//                             st {hum: HumanistBust, tasya: TasyaMediumState, phone: 'loud' | 'down' (turned down)}
//   keyECU(b, f, st)          [ECU] 7.05: the key twisted off the ring, the new one grown back stamped MAR 19 (the
//                             rail), LE CHIEN's paw-print key; the INQUIRY envelope bonking off it (st.env 0..2)
//   SECTION_H, FLOORS         the section's height and each floor's band (for the pan's stops)
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawKeyRingECU} from '../../../../../shared/pixel/kits/key-ring-insert';
import {drawTasyaMedium, TASYA_MEDIUM_DEFAULT, TasyaMediumState} from '../../../../../shared/pixel/cast/tasya-medium';
import {drawTasyaRoom} from '../../../../../shared/pixel/cast/tasya-speak';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith} from '../kit';
import {humanistBust, drawHumanistRoom, HumanistBust} from '../cast/humanist';
import {seatedStaff, staffChair} from '../cast/civic2';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {ArtAsset} from '../asset';

export const SECTION_H = 430;
/** the floors' bands (y0, y1 in the section), top to bottom: 0 = the dark room, 1..3 NopeAI's floors, 4 the plinth, 5
 *  the basement, 6 the bedrock */
export const FLOORS: Array<[number, number]> = [[16, 92], [96, 152], [156, 212], [216, 272], [276, 300], [304, 384], [388, 430]];
const sectionCache = new Map<string, Buf>();
const section = (f: number, lit: number, dim: boolean): Buf => {
  const key = `${Math.floor(f / 6) % 8}:${lit}:${dim}`;
  const hit = sectionCache.get(key); if (hit) return hit;
  const S = new Buf(480, SECTION_H, PAL.N0);
  // the night sky behind the building (a few stars), the cathedral's roofline at the top
  for (let y = 0; y < SECTION_H; y++) for (let x = 0; x < 480; x++) S.set(x, y, y < 300 ? (hash(x, y, 2) < 0.004 ? PAL.N6 : PAL.N1) : PAL.N0);
  // the cut walls (stone): the section's outline, a gothic gable at the top
  const x0 = 60, x1 = 420;
  for (let y = 4; y < 300; y++) { fill(S, x0 - 6, y, 6, 1, PAL.G2); fill(S, x1, y, 6, 1, PAL.G2); }
  for (let i = 0; i < 60; i++) { fill(S, 240 - i * 3 - 3, 12 - Math.floor(i / 8), 6, 2, PAL.G2); fill(S, 240 + i * 3 - 3, 12 - Math.floor(i / 8), 6, 2, PAL.G2); }
  FLOORS.slice(0, 4).forEach(([fy0, fy1], k) => {
    const on = 6 - k <= lit || k === 0;
    // the room's interior: lit (warm office white / the dark room's cyan) or dark
    for (let y = fy0; y < fy1; y++) for (let x = x0; x < x1; x++) S.set(x, y, !on ? PAL.N1 : k === 0 ? (bayer(x, y) < 0.15 ? PAL.C1 : PAL.N2) : (y > fy1 - 6 ? PAL.G3 : bayer(x, y) < 0.1 ? PAL.G5 : PAL.P0));
    fill(S, x0 - 6, fy1, x1 - x0 + 12, 4, PAL.G2); fill(S, x0 - 6, fy1, x1 - x0 + 12, 1, PAL.G4);
    if (k > 0) {
      // NopeAI's floors: desks in rows and tiny staff, a rack at one end
      for (let d = 0; d < 7; d++) { const dx = x0 + 18 + d * 50; fill(S, dx, fy1 - 16, 34, 3, on ? PAL.D3 : PAL.N2); fill(S, dx + 8, fy1 - 24, 14, 8, on ? PAL.N2 : PAL.N1); if (on) fill(S, dx + 9, fy1 - 23, 12, 6, PAL.C4); }
      fill(S, x1 - 22, fy0 + 6, 16, fy1 - fy0 - 10, on ? PAL.N2 : PAL.N1); if (on) for (let r = 0; r < 8; r++) S.set(x1 - 10, fy0 + 10 + r * 5, (r + Math.floor(f / 6)) % 3 ? PAL.C6 : PAL.L3);
      if (on) for (let d = 0; d < 5; d++) { staffChair(S, x0 + 40 + d * 66, fy1 - 36); blitImg(S, seatedStaff({seed: k * 7 + d, pose: 'type'}), x0 + 40 + d * 66, fy1 - 36); }
    } else {
      // the dark room: his desk, his monitor (stepped down a rung when the basement lights come on), the Orb
      fill(S, 200, 80, 120, 3, PAL.D2); fill(S, 250, 54, 46, 26, PAL.N0); fill(S, 252, 56, 42, 22, dim ? PAL.C2 : PAL.C4);
      ellipse(330, 46, 6, 6, S.ink(PAL.G4)); S.set(328, 44, PAL.G6);
      drawMasSeated(S, 230, 80, {...MAS_SEATED_DEFAULT, arm: 'lap', light: 'monitor', collars: 3});
    }
  });
  // the foundation and MACROSOFT's plinth: BELOW · ABOVE · AROUND
  {
    const [py0, py1] = FLOORS[4];
    fill(S, 20, py0, 440, py1 - py0, PAL.N4); fill(S, 20, py0, 440, 2, PAL.N6); fill(S, 20, py1 - 2, 440, 2, PAL.N2);
    const t = 'MACROSOFT'; bpt(S, t, 240 - Math.round(bpw(t) / 2), py0 + 1, PAL.P1);
    const u = 'BELOW · ABOVE · AROUND'; tiny(S, u, 240 - Math.round(tinyWidth(u) / 2), py1 - 9, PAL.N8);
  }
  // the basement: concrete, a bare bulb, the boxes stacked by the left wall, the doorway on the right
  {
    const [by0, by1] = FLOORS[5];
    const on = lit >= 1;
    for (let y = by0; y < by1; y++) for (let x = 40; x < 440; x++) S.set(x, y, !on ? PAL.N1 : y > by1 - 8 ? PAL.G2 : bayer(x, y) < 0.12 ? PAL.G3 : PAL.G4);
    fill(S, 30, by0, 10, by1 - by0, PAL.G1); fill(S, 440, by0, 10, by1 - by0, PAL.G1); fill(S, 30, by1, 420, 4, PAL.G1);
    if (on) { line(240, by0, 240, by0 + 10, S.ink(PAL.N2)); ellipse(240, by0 + 13, 2, 3, S.ink(PAL.W8)); }
    // the DEFLECTION (LICENSED) boxes: sealed, taped, their labels faded
    for (let k = 0; k < 6; k++) { const bx = 56 + (k % 3) * 26, byy = by1 - 8 - 18 * (1 + Math.floor(k / 3)); fill(S, bx, byy, 24, 18, PAL.D3); fill(S, bx, byy, 24, 1, PAL.D4); fill(S, bx + 10, byy, 4, 18, PAL.D2); fill(S, bx + 3, byy + 6, 18, 5, PAL.P0); }
    // the doorway (right), Tasya in it, the Humanist with his boxes
    fill(S, 380, by0 + 14, 30, by1 - by0 - 22, on ? PAL.W4 : PAL.N2);
    if (on) { drawTasyaRoom(S, 396, by1 - 8, {arm: 'keys0', mouth: 'smile', blink: false, light: 'room'}, {flip: true}); drawHumanistRoom(S, 150, by1 - 8, {arm: 'carry'}); }
  }
  // the bedrock, and Ep1's odometer still wedged in it (the egg)
  {
    const [ry0] = FLOORS[6];
    for (let y = ry0; y < SECTION_H; y++) for (let x = 0; x < 480; x++) S.set(x, y, hash(Math.floor(x / 6), Math.floor(y / 4), 8) < 0.3 ? PAL.D1 : PAL.D0);
    fill(S, 300, ry0 + 10, 30, 12, PAL.N1); fill(S, 302, ry0 + 12, 26, 8, PAL.P1); for (let d = 0; d < 4; d++) fill(S, 304 + d * 6, ry0 + 13, 4, 6, PAL.N1);
  }
  sectionCache.set(key, S); if (sectionCache.size > 24) sectionCache.delete(sectionCache.keys().next().value as string);
  return S;
};
export interface CutawaySt { split?: number; lit?: number; pan?: number; dim?: boolean }
export const cutaway = (b: Buf, f: number, st: CutawaySt = {}) => {
  const s = {split: 28, lit: 6, pan: 0, dim: false, ...st};
  const S = section(f, s.lit, s.dim);
  const pan = clamp(Math.round(s.pan), 0, SECTION_H - RH);
  fill(b, 0, 0, 480, RH, PAL.N0);
  // the two halves slide apart from the centre line (the near facade's two halves, drawn as dark stone slabs)
  const gap = Math.round(s.split);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, S.c[(y + pan) * 480 + x]);
  if (gap < 28) {
    const cover = 28 - gap;
    for (let y = 0; y < RH; y++) { const sy = y + pan; if (sy >= 300) continue; for (let x = 0; x < 240 - gap * 9; x++) b.set(x, y, (x + gap * 9 + sy) % 23 === 0 ? PAL.G1 : PAL.G2); for (let x = 240 + gap * 9; x < 480; x++) b.set(x, y, (x + sy) % 23 === 0 ? PAL.G1 : PAL.G2); }
    void cover;
  }
};
export const basement2S = (b: Buf, f: number, st: {hum?: Partial<HumanistBust>; tasya?: Partial<TasyaMediumState>; phone?: 'loud' | 'down'} = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.G2, PAL.G3, PAL.G3, PAL.G2]);
  // the bare bulb's pool, the boxes behind the Humanist, the doorway's warm light behind Tasya
  for (let k = 0; k < 6; k++) { const bx = 10 + (k % 3) * 52, by = 130 - 36 * Math.floor(k / 3); fill(b, bx, by, 48, 36, PAL.D3); fill(b, bx, by, 48, 2, PAL.D4); fill(b, bx + 20, by, 8, 36, PAL.D2); const lw = tinyWidth('DEFLECTION') + 4; fill(b, bx + 24 - (lw >> 1), by + 12, lw, 9, PAL.P0); tiny(b, 'DEFLECTION', bx + 26 - (lw >> 1), by + 14, PAL.G4); }
  fill(b, 330, 10, 120, 193, PAL.W4); fill(b, 330, 10, 4, 193, PAL.W2); dith(b, 334, 10, 116, 193, 0.2, PAL.W5);
  putBustCut(b, humanistBust({mouth: 'rest', expr: 'worry', arm: 'box', ...st.hum}), 70, 60, RH);
  drawTasyaMedium(b, 350, 92, {...TASYA_MEDIUM_DEFAULT, arm: 'ring', ...st.tasya}, {flip: true});
  // Tasya's phone, face up on a box in the foreground (between them), playing yesterday's interview: a phone you can
  // read as a phone (its bezel, its lit screen in perspective on the box's top, the waveform; turned down: one bar)
  fill(b, 196, 168, 88, 35, PAL.D3); fill(b, 196, 168, 88, 2, PAL.D4); fill(b, 232, 168, 10, 35, PAL.D2); fill(b, 204, 182, 70, 8, PAL.P0);
  const px = 210, py = 158;
  for (let j = 0; j < 12; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh, py + j, 44, 1, j === 0 || j === 11 ? PAL.N1 : PAL.N0); }
  for (let j = 2; j < 10; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh + 3, py + j, 38, 1, PAL.C2); }
  fill(b, px + 4, py + 12, 44, 2, PAL.D1);
  const bars = st.phone === 'down' ? 1 : 7;
  for (let i = 0; i < bars; i++) { const h = 1 + ((i * 7 + Math.floor(f / 3)) % 5); fill(b, px + 12 + i * 4, py + 9 - h, 2, h, PAL.C7); }
};
export const keyECU = (b: Buf, f: number, st: {grown?: boolean; env?: 0 | 1 | 2} = {}) => {
  drawKeyRingECU(b, f, {keys: 11, beige: false, jangle: (Math.floor(f / 4) % 2) as 0 | 1});
  // (Ep2's copy: the shared insert's buckle sat off to one side of his belt and read as a stray bracket; the belt runs
  // on through there, a belt loop over it instead)
  fill(b, 92, 12, 30, 2, PAL.N3); fill(b, 92, 14, 30, 13, PAL.N1); fill(b, 92, 14, 30, 1, PAL.N3); fill(b, 92, 27, 30, 1, PAL.N0); fill(b, 92, 28, 30, 3, PAL.N3); for (let x = 92; x < 122; x++) if (x % 7 === 0) b.set(x, 21, PAL.N2);
  for (let y = 10; y < 31; y++) { b.set(150, y, PAL.N0); fill(b, 151, y, 5, 1, y < 12 || y > 28 ? PAL.N3 : PAL.N2); b.set(156, y, PAL.N0); }
  // the new key grown back into the gap, stamped MAR 19 on its bow (the rail, stamped)
  if (st.grown) { const bw = pw('MAR 19') + 8; fill(b, 241 - (bw >> 1), 118, bw, 22, PAL.W6); fill(b, 241 - (bw >> 1), 118, bw, 2, PAL.W8); fill(b, 237, 140, 8, 50, PAL.W5); for (let t = 0; t < 4; t++) fill(b, 245, 150 + t * 9, 6, 4, PAL.W5); pt(b, 'MAR 19', 245 - (bw >> 1), 125, PAL.N1); }
  // LE CHIEN's tiny paw-print key
  const px = 300, py = 130;
  fill(b, px, py, 12, 12, PAL.G5); fill(b, px + 5, py + 12, 3, 22, PAL.G5);
  for (const [dx, dy] of [[2, 2], [7, 1], [9, 5], [1, 6]]) b.set(px + dx, py + dy, PAL.N1); fill(b, px + 4, py + 6, 4, 3, PAL.N1);
  // the INQUIRY envelope sailing in and bonking off the ring
  if (st.env) { const ex = st.env === 1 ? 380 : 330, ey = st.env === 1 ? 40 : 70; fill(b, ex, ey, 70, 40, PAL.P2); line(ex, ey, ex + 35, ey + 22, b.ink(PAL.P0)); line(ex + 70, ey, ex + 35, ey + 22, b.ink(PAL.P0)); pt(b, 'INQUIRY', ex + 12, ey + 28, PAL.R2); }
};

export const ART: ArtAsset[] = [{
  id: 'set06-cutaway', manifest: 'SET-06 · the cathedral, cut away', kind: 'set', name: 'The cathedral as a dollhouse cross-section (430 rows tall; the frame pans it)',
  file: 'sets/cutaway.ts', exports: 'cutaway, basement2S, keyECU, SECTION_H, FLOORS', scenes: '7',
  note: 'the halves slide apart; floors light one by one; MACROSOFT\'s plinth BELOW · ABOVE · AROUND; the basement\'s sealed boxes; the odometer egg in the bedrock',
  stills: [
    {label: '[W] 7.01: the section opened, the lights on, the window low (the plinth, the basement: Tasya in the doorway, the Humanist with his boxes)', draw: (b) => cutaway(b, 0, {pan: 227, lit: 6})},
    {label: '[W] 7.07: the whole-pixel pan up to the top: Mas at his monitor (a rung down), NopeAI\'s floors under him', draw: (b) => cutaway(b, 0, {pan: 0, lit: 6, dim: true})},
    {label: '[2S] 7.02 the Humanist with his box (caught out) and Tasya in the doorway, his phone face up', draw: (b) => basement2S(b, 0)},
    {label: '[ECU] 7.05 the key grown back, MAR 19, the paw-print key', draw: (b) => keyECU(b, 0, {grown: true, env: 2})},
  ],
}];
void rect; void stepColor; void TR; void pw;
