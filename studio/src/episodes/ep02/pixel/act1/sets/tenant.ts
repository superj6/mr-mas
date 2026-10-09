// MR. MAS — Ep2 v1 · act1 · sc 7 A TENANT (MAR 19, 2024; the cathedral, cut away floor by floor): the drawings (the
// shots pass, 2026-10-09). The set is the art pass's (art/sets/cutaway.ts, SET-06: the dollhouse section 430 rows tall,
// the plinth BELOW · ABOVE · AROUND, the basement's sealed DEFLECTION (LICENSED) boxes, the odometer egg in the
// bedrock; art/cast/humanist.ts), imported; its section is COPIED here so its floors light from the TOP DOWN as the
// camera follows his recorded voice down to the basement (the art's lit them bottom-up), and the halves slide apart as
// the curtain parted. Ep1's rigs (Tasya, Mas at his dark-room desk with the Orb) are imported read-only.
//   section7(b, f, st)   [W] the 203-row window on the section: st {split 0..1, lit: floors lit top-down 0..4 (the
//                        last is the basement), pan 0..SECTION_H-203, dim: Mas's monitor a rung down}
//   basement(b, f, st)   [2S] THE HUMANIST by his boxes (screen-left, his bust: lip-synced) and TASYA in the doorway
//                        (screen-right, Ep1's medium rig: lip-synced), his phone face up on a box between them
//   keys(b, f, st)       [ECU] the key ring (art keyECU): the key twisted off, the new one grown back stamped MAR 19,
//                        LE CHIEN's paw-print key, THE TRUSTBUSTER's INQUIRY envelope bonking off it
//   masDark(b, f, st)    [MCU] Mas at his monitor four floors up (Ep1 rooms/twoshots drawDark2S: his medium rig, the
//                        Orb, his tally), the room a rung down since the basement's lights came on
import {Buf, ellipse, line, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawTasyaRoom} from '../../../../../shared/pixel/cast/tasya-speak';
import {drawTasyaMedium, TASYA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/tasya-medium';
import type {TasyaMediumState} from '../../../../../shared/pixel/cast/tasya-medium';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawDark2S} from '../../../../../shared/pixel/rooms/twoshots';
import {blitImg} from '../../../../../shared/pixel/figure';
import {humanistBust, drawHumanistRoom} from '../../art/cast/humanist';
import type {HumanistBust} from '../../art/cast/humanist';
import {seatedStaff, staffChair} from '../../art/cast/civic2';
import {keyECU, SECTION_H, FLOORS} from '../../art/sets/cutaway';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp, dith} from '../../art/kit';
import {RH, W, isSkin} from './common';

export {SECTION_H};
const CACHE = new Map<string, Buf>();
/** the section (art cutaway's, copied): floors 1..3 NopeAI's, the plinth, the basement, the bedrock; `lit` lights
 *  them from the top down (1 = floor 1 .. 3 = floor 3, 4 = the basement too); the dark room (floor 0) always on */
const section = (f: number, lit: number, dim: boolean): Buf => {
  const key = `${Math.floor(f / 6) % 8}:${lit}:${dim}`;
  const hit = CACHE.get(key); if (hit) return hit;
  const S = new Buf(480, SECTION_H, PAL.N0);
  for (let y = 0; y < SECTION_H; y++) for (let x = 0; x < 480; x++) S.set(x, y, y < 300 ? (hash(x, y, 2) < 0.004 ? PAL.N6 : PAL.N1) : PAL.N0);
  const x0 = 60, x1 = 420;
  for (let y = 4; y < 300; y++) { fill(S, x0 - 6, y, 6, 1, PAL.G2); fill(S, x1, y, 6, 1, PAL.G2); }
  for (let i = 0; i < 60; i++) { fill(S, 240 - i * 3 - 3, 12 - Math.floor(i / 8), 6, 2, PAL.G2); fill(S, 240 + i * 3 - 3, 12 - Math.floor(i / 8), 6, 2, PAL.G2); }
  FLOORS.slice(0, 4).forEach(([fy0, fy1], k) => {
    const on = k === 0 || k <= lit;
    for (let y = fy0; y < fy1; y++) for (let x = x0; x < x1; x++) S.set(x, y, !on ? PAL.N1 : k === 0 ? (bayer(x, y) < 0.15 ? PAL.C1 : PAL.N2) : (y > fy1 - 6 ? PAL.G3 : bayer(x, y) < 0.1 ? PAL.G5 : PAL.P0));
    fill(S, x0 - 6, fy1, x1 - x0 + 12, 4, PAL.G2); fill(S, x0 - 6, fy1, x1 - x0 + 12, 1, PAL.G4);
    if (k > 0) {
      for (let d = 0; d < 7; d++) { const dx = x0 + 18 + d * 50; fill(S, dx, fy1 - 16, 34, 3, on ? PAL.D3 : PAL.N2); fill(S, dx + 8, fy1 - 24, 14, 8, on ? PAL.N2 : PAL.N1); if (on) fill(S, dx + 9, fy1 - 23, 12, 6, PAL.C4); }
      fill(S, x1 - 22, fy0 + 6, 16, fy1 - fy0 - 10, on ? PAL.N2 : PAL.N1); if (on) for (let r = 0; r < 8; r++) S.set(x1 - 10, fy0 + 10 + r * 5, (r + Math.floor(f / 6)) % 3 ? PAL.C6 : PAL.L3);
      if (on) for (let d = 0; d < 5; d++) { staffChair(S, x0 + 40 + d * 66, fy1 - 36); blitImg(S, seatedStaff({seed: k * 7 + d, pose: 'type'}), x0 + 40 + d * 66, fy1 - 36); }
    } else {
      // the dark room: his desk, his monitor (a rung down once the basement's lights are on), the Orb, Mas
      fill(S, 200, 80, 120, 3, PAL.D2); fill(S, 250, 54, 46, 26, PAL.N0); fill(S, 252, 56, 42, 22, dim ? PAL.C2 : PAL.C4);
      ellipse(330, 46, 6, 6, S.ink(PAL.G4)); S.set(328, 44, PAL.G6);
      drawMasSeated(S, 230, 80, {...MAS_SEATED_DEFAULT, arm: 'lap', light: 'monitor', collars: 3});
    }
  });
  {
    const [py0, py1] = FLOORS[4];
    fill(S, 20, py0, 440, py1 - py0, PAL.N4); fill(S, 20, py0, 440, 2, PAL.N6); fill(S, 20, py1 - 2, 440, 2, PAL.N2);
    const t = 'MACROSOFT'; bpt(S, t, 240 - Math.round(bpw(t) / 2), py0 + 1, PAL.P1);
    // its motto under the name, in the plate's own face (larger than the art's tiny type, so it reads at its read time)
    const u = 'BELOW · ABOVE · AROUND'; fill(S, 240 - Math.round(pw(u) / 2) - 4, py1 - 10, pw(u) + 8, 9, PAL.N3); pt(S, u, 240 - Math.round(pw(u) / 2), py1 - 9, PAL.P2);
  }
  {
    const [by0, by1] = FLOORS[5];
    const on = lit >= 4;
    for (let y = by0; y < by1; y++) for (let x = 40; x < 440; x++) S.set(x, y, !on ? PAL.N1 : y > by1 - 8 ? PAL.G2 : bayer(x, y) < 0.12 ? PAL.G3 : PAL.G4);
    fill(S, 30, by0, 10, by1 - by0, PAL.G1); fill(S, 440, by0, 10, by1 - by0, PAL.G1); fill(S, 30, by1, 420, 4, PAL.G1);
    if (on) { line(240, by0, 240, by0 + 10, S.ink(PAL.N2)); ellipse(240, by0 + 13, 2, 3, S.ink(PAL.W8)); }
    for (let k = 0; k < 6; k++) { const bx = 56 + (k % 3) * 26, byy = by1 - 8 - 18 * (1 + Math.floor(k / 3)); fill(S, bx, byy, 24, 18, on ? PAL.D3 : PAL.N2); fill(S, bx, byy, 24, 1, on ? PAL.D4 : PAL.N3); fill(S, bx + 10, byy, 4, 18, on ? PAL.D2 : PAL.N1); fill(S, bx + 3, byy + 6, 18, 5, on ? PAL.P0 : PAL.N3); }
    fill(S, 380, by0 + 14, 30, by1 - by0 - 22, on ? PAL.W4 : PAL.N2);
    if (on) { drawTasyaRoom(S, 396, by1 - 8, {arm: 'keys0', mouth: 'smile', blink: false, light: 'room'}, {flip: true}); drawHumanistRoom(S, 150, by1 - 8, {arm: 'carry'}); }
  }
  {
    const [ry0] = FLOORS[6];
    for (let y = ry0; y < SECTION_H; y++) for (let x = 0; x < 480; x++) S.set(x, y, hash(Math.floor(x / 6), Math.floor(y / 4), 8) < 0.3 ? PAL.D1 : PAL.D0);
    fill(S, 300, ry0 + 10, 30, 12, PAL.N1); fill(S, 302, ry0 + 12, 26, 8, PAL.P1); for (let d = 0; d < 4; d++) fill(S, 304 + d * 6, ry0 + 13, 4, 6, PAL.N1);
  }
  CACHE.set(key, S); if (CACHE.size > 24) CACHE.delete(CACHE.keys().next().value as string);
  return S;
};
export interface Section7 { split: number; lit: number; pan: number; dim?: boolean }
/** [W] the window on the section; the near facade's two halves slide apart from the centre (split 0 shut .. 1 open) */
export const section7 = (b: Buf, f: number, st: Section7) => {
  const S = section(f, st.lit, !!st.dim);
  const pan = clamp(Math.round(st.pan), 0, SECTION_H - RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, S.c[(y + pan) * 480 + x]);
  const gap = Math.round(clamp(st.split, 0, 1) * 252);
  if (gap < 252) for (let y = 0; y < RH; y++) {
    const sy = y + pan; if (sy >= 300) continue;
    // the facade's halves (dark stone, their coursing, a lit cut edge where they part)
    for (let x = 0; x < 240 - gap; x++) b.set(x, y, x === 239 - gap ? PAL.G4 : (x + gap + sy) % 23 === 0 ? PAL.G1 : PAL.G2);
    for (let x = 240 + gap; x < 480; x++) b.set(x, y, x === 240 + gap ? PAL.G4 : (x - gap + sy) % 23 === 0 ? PAL.G1 : PAL.G2);
  }
};

// ================================================================== the basement two-shot
export interface BasementSt { hum?: Partial<HumanistBust>; tasya?: Partial<TasyaMediumState>; phone?: 'loud' | 'down'; up?: boolean }
/** [2S] the Humanist by his boxes (screen-left), Tasya in the doorway (screen-right), the phone face up on a box between
 *  them playing yesterday's interview (one bar once he's turned it down); `up`: the Humanist looks up (the floors above) */
export const basement = (b: Buf, f: number, st: BasementSt = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.G2, PAL.G3, PAL.G3, PAL.G2]);
  for (let k = 0; k < 6; k++) {
    const bx = 10 + (k % 3) * 52, by = 130 - 36 * Math.floor(k / 3);
    fill(b, bx, by, 48, 36, PAL.D3); fill(b, bx, by, 48, 2, PAL.D4); fill(b, bx + 20, by, 8, 36, PAL.D2);
    const lw = tinyWidth('DEFLECTION') + 4; fill(b, bx + 24 - (lw >> 1), by + 12, lw, 9, PAL.P0); tiny(b, 'DEFLECTION', bx + 26 - (lw >> 1), by + 14, PAL.G4);
  }
  fill(b, 330, 10, 120, 193, PAL.W4); fill(b, 330, 10, 4, 193, PAL.W2); dith(b, 334, 10, 116, 193, 0.2, PAL.W5);
  // the bare bulb over them, its cord
  line(240, 0, 240, 22, b.ink(PAL.N2)); ellipse(240, 26, 3, 4, b.ink(PAL.W8)); b.set(239, 25, PAL.W9);
  putBustCut(b, humanistBust({mouth: 'rest', expr: 'worry', arm: 'box', ...st.hum}), 70, st.up ? 56 : 60, RH);
  drawTasyaMedium(b, 350, 92, {...TASYA_MEDIUM_DEFAULT, arm: 'ring', ...st.tasya}, {flip: true});
  // the phone face up on a box between them (its waveform; turned down: one bar)
  fill(b, 196, 168, 88, 35, PAL.D3); fill(b, 196, 168, 88, 2, PAL.D4); fill(b, 232, 168, 10, 35, PAL.D2); fill(b, 204, 182, 70, 8, PAL.P0);
  const px = 210, py = 158;
  for (let j = 0; j < 12; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh, py + j, 44, 1, j === 0 || j === 11 ? PAL.N1 : PAL.N0); }
  for (let j = 2; j < 10; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh + 3, py + j, 38, 1, PAL.C2); }
  fill(b, px + 4, py + 12, 44, 2, PAL.D1);
  const bars = st.phone === 'loud' ? 7 : 1;
  for (let i = 0; i < bars; i++) { const h = 1 + ((i * 7 + Math.floor(f / 3)) % 5); fill(b, px + 12 + i * 4, py + 9 - h, 2, h, PAL.C7); }
};
/** [ECU] the ring: art keyECU (grown: the MAR 19 key; env 0 none, 1 sailing in, 2 the bonk) */
export const keys = (b: Buf, f: number, st: {grown: boolean; env: 0 | 1 | 2}) => keyECU(b, f, st);
/** [MCU] Mas at his monitor in the dark room (Ep1's drawDark2S), still; the room a rung down (his monitor stepped down
 *  when the basement's lights came on); his face kept */
export const masDark = (b: Buf, f: number) => {
  drawDark2S(b, f, {mas: {head: '34', mouth: 'rest', lid: 0, look: -1, brow: 0, arm: 'rest', light: 'monitor'}});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = b.get(x, y); if (!isSkin(c)) b.set(x, y, stepColor(c, -1)); }
};
void stepColor;
