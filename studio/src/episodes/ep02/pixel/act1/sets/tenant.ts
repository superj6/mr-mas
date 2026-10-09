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
import {tasyaRoomPortrait} from '../../../../../shared/pixel/cast/tasya-phone';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {drawTasyaMedium, TASYA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/tasya-medium';
import type {TasyaMediumState} from '../../../../../shared/pixel/cast/tasya-medium';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawDark2S} from '../../../../../shared/pixel/rooms/twoshots';
import {blitImg} from '../../../../../shared/pixel/figure';
import {humanistBust, drawHumanistRoom} from '../../art/cast/humanist';
import type {HumanistBust} from '../../art/cast/humanist';
import {seatedStaff, staffChair} from '../../art/cast/civic2';
import {SECTION_H, FLOORS} from '../../art/sets/cutaway';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
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
export interface BasementSt { hum?: Partial<HumanistBust>; tasya?: Partial<TasyaMediumState>; phone?: 'loud' | 'down'; up?: boolean; key?: boolean }
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
  const hy = st.up ? 56 : 60;
  putBustCut(b, humanistBust({mouth: 'rest', expr: 'worry', arm: 'box', ...st.hum}), 70, hy, RH);
  // the key Tasya gave him, in his hand at his chest (his near hand up from below the frame, the brass key in it)
  if (st.key) {
    const kx = 92, ky = hy + 112;
    fill(b, kx + 4, ky - 14, 3, 10, PAL.W5); fill(b, kx + 4, ky - 14, 1, 10, PAL.W7); fill(b, kx + 7, ky - 11, 2, 2, PAL.W5); fill(b, kx + 7, ky - 7, 2, 2, PAL.W5);
    ellipse(kx + 5, ky - 18, 4, 4, b.ink(PAL.W5)); b.set(kx + 5, ky - 18, PAL.D2); b.set(kx + 3, ky - 20, PAL.W8);
    fill(b, kx, ky - 6, 12, 9, PAL.S4); fill(b, kx, ky - 6, 12, 1, PAL.S5); for (let i = 1; i < 12; i += 3) b.set(kx + i, ky - 5, PAL.S3); fill(b, kx + 11, ky - 5, 1, 8, PAL.S3);
    fill(b, kx - 1, ky + 3, 14, RH - ky - 3, PAL.N3); fill(b, kx - 1, ky + 3, 14, 1, PAL.N5);
  }
  drawTasyaMedium(b, 350, 92, {...TASYA_MEDIUM_DEFAULT, arm: 'ring', ...st.tasya}, {flip: true});
  // (the 'ring' arm's far hand is a stamp whose arm is hidden behind his coat: it floated as a skin dot on the coat;
  // his far hand is in his pocket, the coat over it)
  { const fx = 350 + 84 - 1 - 64, fy = 92 + 100; for (let y = fy - 4; y <= fy + 4; y++) for (let x = fx - 4; x <= fx + 4; x++) { if (isSkin(b.get(x, y))) b.set(x, y, b.get(fx + 6, fy - 8)); } }
  // the phone face up on a box between them (its waveform; turned down: one bar)
  fill(b, 196, 168, 88, 35, PAL.D3); fill(b, 196, 168, 88, 2, PAL.D4); fill(b, 232, 168, 10, 35, PAL.D2); fill(b, 204, 182, 70, 8, PAL.P0);
  const px = 210, py = 158;
  for (let j = 0; j < 12; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh, py + j, 44, 1, j === 0 || j === 11 ? PAL.N1 : PAL.N0); }
  for (let j = 2; j < 10; j++) { const sh = Math.round((12 - j) * 0.5); fill(b, px + sh + 3, py + j, 38, 1, PAL.C2); }
  fill(b, px + 4, py + 12, 44, 2, PAL.D1);
  const bars = st.phone === 'loud' ? 7 : 1;
  for (let i = 0; i < bars; i++) { const h = 1 + ((i * 7 + Math.floor(f / 3)) % 5); fill(b, px + 12 + i * 4, py + 9 - h, 2, h, PAL.C7); }
};
// ================================================================== 7.03 Tasya's welcome, closer
/** [MCU] TASYA in the doorway, closer (his approved portrait in the room's warm skin, tasya-phone's tasyaRoomPortrait):
 *  the stair's warm light behind him, the basement's concrete at the left; the bare bulb overhead keys his face from
 *  the upper left (a step up on the planes toward it, a rim), so "warm, unhurried; the welcome is the lease" plays on
 *  a face we can read; lip-synced, a pleasant smile between the words */
export const tasyaMCU = (b: Buf, f: number, st: {mouth: Viseme; lid?: 0 | 1 | 2}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const door = x >= 168;
    b.set(x, y, door ? (x < 174 ? PAL.W1 : bayer(x, y) < 0.12 + (x - 174) / 1200 ? PAL.W4 : PAL.W3) : (bayer(x, y) < 0.25 ? PAL.G2 : PAL.G1));
  }
  // the bulb's cord at the top left (the light's source)
  line(96, 0, 96, 10, b.ink(PAL.N2)); ellipse(96, 13, 2, 3, b.ink(PAL.W8)); b.set(95, 12, PAL.W9);
  const img = tasyaRoomPortrait({mouth: st.mouth, lid: st.lid ?? 0, brow: 'warm', arms: 'clasp', jangle: 0});
  const X = 200, Y = 40;
  putBustCut(b, img, X, Y, RH, TASYA_FACES_LEFT ? false : true);
  // the key from the bulb (upper left): a step up on the skin toward it, a warm rim on its edge; the doorway's light a
  // rim on the far edge of him
  const snap = new Int32Array(b.c);
  const sk = (x: number, y: number) => isSkin(snap[y * W + x]);
  for (let y = Y; y < RH; y++) for (let x = X; x < X + 112; x++) {
    const c = snap[y * W + x];
    if (!isSkin(c)) continue;
    // the whole face a step up from the bulb, its planes toward it (left, top) two
    b.set(x, y, !sk(x - 1, y) || !sk(x, y - 1) || !sk(x - 3, y) ? stepColor(c, 2) : stepColor(c, 1));
    if (!sk(x + 1, y) && x > X + 50) b.set(x, y, PAL.W6);
  }
  void f;
};
/** which way the approved portrait faces (it is authored facing screen-left, toward Mas in Ep1's lobby) */
const TASYA_FACES_LEFT = true;

// ================================================================== 7.05 the ring: the handover (shared kits/key-ring-insert and
// art/sets/cutaway keyECU, copied: the middle key is a separate drawing so a hand can take it)
type KeyCol = [number, number, number, number];
const METALS: KeyCol[] = [[PAL.W3, PAL.W5, PAL.W6, PAL.W8], [PAL.G3, PAL.G4, PAL.G5, PAL.G6], [PAL.W2, PAL.W4, PAL.W5, PAL.W7], [PAL.G2, PAL.G3, PAL.G4, PAL.G6]];
/** one key along a direction (the kit's): a bow with its hole, a toothed blade */
const key = (b: Buf, ax: number, ay: number, deg: number, col: KeyCol, len: number, bowR: number, seed: number) => {
  const a = (deg * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux;
  const R = len + bowR * 2 + 4;
  for (let y = Math.round(ay - R); y <= Math.round(ay + R); y++) for (let x = Math.round(ax - R); x <= Math.round(ax + R); x++) {
    const dx = x - ax, dy = y - ay, s = dx * ux + dy * uy, q = dx * vx + dy * vy;
    let inside = false, lit = false, edge = false;
    const bs = s - bowR - 1, round = seed % 3 !== 1;
    const dBow = round ? Math.hypot(bs, q) / bowR : Math.max(Math.abs(bs), Math.abs(q)) / bowR;
    if (dBow <= 1) { const hole = Math.hypot(bs + bowR * 0.45, q) < 1.6; if (!hole) { inside = true; edge = dBow > 0.8; lit = q < -bowR * 0.2; } }
    const t = s - bowR * 2;
    if (!inside && t >= 0 && t <= len) {
      const tooth = Math.floor(t / 3 + hash(seed, Math.floor(t / 3), 71) * 2) % 2 === 0 && t > 3 && t < len - 2;
      const w0 = -2, w1 = tooth ? 3 : 1;
      if (q >= w0 && q <= w1 && !(t > len - 2 && q > 0)) { inside = true; lit = q < -1; edge = q === w1 || t > len - 1; }
    }
    if (!inside || y < 0 || y >= RH) continue;
    b.set(x, y, edge ? col[0] : lit ? col[2] : col[1]);
  }
  b.set(Math.round(ax + ux * (bowR * 0.6) - vx * bowR * 0.5), Math.round(ay + uy * (bowR * 0.6) - vy * bowR * 0.5), col[3]);
};
const RING = {cx: 240, cy: 62, r: 50, n: 11, mid: 5};
/** the middle key's own drawing (it hangs straight down at the front): its ring point, colour, blade and bow */
const midKey = (jangle: 0 | 1) => {
  const i = RING.mid, th = 12 + (i / (RING.n - 1)) * 156 + (i % 2 ? (jangle ? 4 : 0) : -(jangle ? 4 : 0)), a = (th * Math.PI) / 180;
  return {ax: RING.cx + Math.cos(a) * RING.r, ay: RING.cy + Math.sin(a) * RING.r, deg: 90 + (th - 90) * 0.55, col: METALS[(i * 7 + 3) % 4], len: 30 + Math.round(hash(i, 1, 72) * 12), bowR: 8 + Math.round(hash(i, 2, 72) * 2), seed: i + 1};
};
/** his belt and the ring, its keys round the lower arc; `taken`: the middle key isn't on it */
const ringECU = (b: Buf, f: number, taken: boolean) => {
  const jangle = (Math.floor(f / 4) % 2) as 0 | 1, sw = jangle ? 4 : 0;
  const {cx, cy, r, n} = RING;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = x / 480; b.set(x, y, bayer(x, y) < 0.45 - d * 0.3 ? PAL.N4 : (x + y * 3) % 23 === 0 ? PAL.N2 : PAL.N3); }
  for (let y = 0; y < RH; y++) { const l = 70 - Math.round(y * 0.08), r0 = 404 + Math.round(y * 0.1); for (let x = 0; x < l; x++) b.set(x, y, x > l - 3 ? PAL.N7 : bayer(x, y) < 0.4 ? PAL.N5 : PAL.N4); for (let x = r0; x < 480; x++) b.set(x, y, x < r0 + 2 ? PAL.N2 : bayer(x, y) < 0.25 ? PAL.N4 : PAL.N3); }
  fill(b, 0, 14, 480, 14, PAL.N1); fill(b, 0, 14, 480, 1, PAL.N3); fill(b, 0, 27, 480, 1, PAL.N0);
  for (let x = 0; x < 480; x += 7) b.set(x, 21, PAL.N2);
  // (the art's Ep2 belt: a belt loop where the shared insert's buckle read as a stray bracket)
  fill(b, 92, 12, 30, 2, PAL.N3); fill(b, 92, 14, 30, 13, PAL.N1); fill(b, 92, 14, 30, 1, PAL.N3); fill(b, 92, 27, 30, 1, PAL.N0); fill(b, 92, 28, 30, 3, PAL.N3); for (let x = 92; x < 122; x++) if (x % 7 === 0) b.set(x, 21, PAL.N2);
  for (let y = 10; y < 31; y++) { b.set(150, y, PAL.N0); fill(b, 151, y, 5, 1, y < 12 || y > 28 ? PAL.N3 : PAL.N2); b.set(156, y, PAL.N0); }
  fill(b, cx - 5, 10, 10, 22, PAL.W4); fill(b, cx - 5, 10, 10, 1, PAL.W7); fill(b, cx - 1, 30, 3, 4, PAL.W3);
  const back = (lx: number, ly: number) => { const d = Math.hypot(lx, ly); return d >= r - 2.5 && d <= r + 2.5; };
  for (let y = -r - 3; y <= r + 3; y++) for (let x = -r - 3; x <= r + 3; x++) if (back(x, y) && y < 0) { const d = Math.hypot(x, y); b.set(cx + x, cy + y, d > r + 1.5 || d < r - 1.5 ? PAL.W3 : -x - y > r * 0.6 ? PAL.W7 : PAL.W5); }
  for (let i = 0; i < n; i++) {
    if (taken && i === RING.mid) continue;
    const t = i / (n - 1), th = 12 + t * 156 + (i % 2 ? sw : -sw), a = (th * Math.PI) / 180;
    key(b, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 90 + (th - 90) * 0.55, METALS[(i * 7 + 3) % 4], 30 + Math.round(hash(i, 1, 72) * 12), 8 + Math.round(hash(i, 2, 72) * 2), i + 1);
  }
  for (let y = -r - 3; y <= r + 3; y++) for (let x = -r - 3; x <= r + 3; x++) if (back(x, y) && y >= 0) { const d = Math.hypot(x, y); b.set(cx + x, cy + y, d > r + 1.5 || d < r - 1.5 ? PAL.W3 : x < -r * 0.5 ? PAL.W6 : PAL.W5); }
  b.set(cx - Math.round(r * 0.7), cy + Math.round(r * 0.7) - 1, PAL.W8);
  // LE CHIEN's small key: a round bow stamped with a paw print (a broad pad and four toes splayed round it, close: a
  // paw, never two eyes and a mouth), its short blade
  const px = 306, py = 124;
  fill(b, px - 1, py - 8, 3, 6, PAL.G4);
  ellipse(px, py + 7, 10, 10, b.ink(PAL.G5)); ellipse(px, py + 7, 9, 9, b.ink(PAL.G6));
  const PAW = ['...tt.tt...', '..ttt.ttt..', 't.ttt.ttt.t', 'tt.tt.tt.tt', 'tt.......tt', '....ppp....', '..ppppppp..', '.ppppppppp.', '.ppppppppp.', '..ppp.ppp..'];
  PAW.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') b.set(px - 5 + i, py + 1 + j, PAL.N2); });
  fill(b, px - 1, py + 18, 3, 16, PAL.G5); fill(b, px + 2, py + 24, 2, 2, PAL.G5); fill(b, px + 2, py + 29, 2, 2, PAL.G5);
};
/** the spare grown into the gap, its bow a tag stamped MAR 19 (the rail, stamped): `g` 0..4 (held steps: the tag
 *  half, the tag whole, the blade half, the blade whole) */
const spare = (b: Buf, g: number) => {
  if (g <= 0) return;
  const bw = pw('MAR 19') + 8, x0 = 241 - (bw >> 1);
  fill(b, 239, 110, 4, 10, PAL.W5); fill(b, 239, 110, 1, 10, PAL.W7);
  const th = g >= 2 ? 22 : 11;
  fill(b, x0, 118, bw, th, PAL.W6); fill(b, x0, 118, bw, 2, PAL.W8); fill(b, x0, 118 + th - 1, bw, 1, PAL.W4);
  if (g >= 2) pt(b, 'MAR 19', 245 - (bw >> 1), 125, PAL.N1);
  if (g >= 3) { const L = g >= 4 ? 50 : 24; fill(b, 237, 140, 8, L, PAL.W5); fill(b, 237, 140, 2, L, PAL.W6); if (g >= 4) for (let t = 0; t < 4; t++) fill(b, 245, 150 + t * 9, 6, 4, PAL.W5); }
};
export interface KeysSt {
  /** the handover: 0 the ring whole; 1 his fingers on the key; 2..3 the twist (held steps); 4.. carried off toward the
   *  Humanist (frame left), `carry` 0..1; 5 gone (the gap) */
  take: 0 | 1 | 2 | 3 | 4 | 5;
  carry?: number;
  /** the spare growing into the gap: 0..4 */
  grow: number;
  env: 0 | 1 | 2;
}
/** [ECU] 7.05: Tasya's fingers come in, pinch the middle key, twist it off the ring in two held steps and carry it out
 *  of frame left (toward the Humanist), the gap, then the spare grows in, stamped MAR 19; LE CHIEN's paw-print key;
 *  THE TRUSTBUSTER's INQUIRY envelope bonks off the ring */
export const keys = (b: Buf, f: number, st: KeysSt) => {
  const jangle = (Math.floor(f / 4) % 2) as 0 | 1;
  ringECU(b, f, st.take >= 2);
  spare(b, st.grow);
  if (st.take >= 1 && st.take <= 4) {
    const k = midKey(jangle);
    const tw = st.take >= 3 ? 26 : st.take >= 2 ? 14 : 0;
    const c = st.take === 4 ? clamp(st.carry ?? 0, 0, 1) : 0;
    // carried up and away to the left, toward the Humanist (out of the frame's top left)
    const ox = -Math.round(c * 170), oy = -Math.round(c * 190) + (st.take >= 2 ? 6 : 0);
    const deg = k.deg + tw;
    const a = (deg * Math.PI) / 180;
    const bx = k.ax + ox, by = k.ay + oy;
    if (st.take >= 2) key(b, bx, by, deg, k.col, k.len, k.bowR, k.seed);
    // his hand, at the ring's scale (a hand is longer than a key), down from his elbow off the frame's top right; its
    // thumb and forefinger pinch the key's bow; the forearm on the wrist's own line up to the elbow (never a bar)
    const bowC: [number, number] = [Math.round(bx + Math.cos(a) * (k.bowR + 1)), Math.round(by + Math.sin(a) * (k.bowR + 1))];
    const E: [number, number] = [520, -170];
    const dx0 = bowC[0] - E[0], dy0 = bowC[1] - E[1], dL = Math.hypot(dx0, dy0) || 1;
    const rot = (tw * Math.PI) / 360, fx = dx0 / dL, fy = dy0 / dL;
    const fwd: [number, number, number] = [(fx * Math.cos(rot) - fy * Math.sin(rot)) * 0.92, (fx * Math.sin(rot) + fy * Math.cos(rot)) * 0.92, -0.3];
    const h = placeHand(POSES.pinch(fwd, [0.2, -0.3, 0.93], 'R'), {s: 6.2, at: [bowC[0] + 2, bowC[1] - 1], anchor: 'index', light: 'lobby', key: [-0.4, -0.6, 0.7], cuffRamp: [PAL.N0, PAL.G3, PAL.G4, PAL.G5, PAL.P1, PAL.P1, PAL.P2]});
    // his shirt's cuff at the wrist (the hand's own), then the navy blazer sleeve up to the elbow, widening
    const ax = h.cuffEnd[0] - h.wrist[0], ay = h.cuffEnd[1] - h.wrist[1], aL = Math.hypot(ax, ay) || 1, ux = ax / aL, uy = ay / aL;
    sleeve(b, h.cuffEnd, [h.cuffEnd[0] + ux * 340, h.cuffEnd[1] + uy * 340], 20, 30, [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N6]);
    drawHand(b, h.hand, h.x, h.y);
  }
  if (st.env) { const ex = st.env === 1 ? 380 : 330, ey = st.env === 1 ? 40 : 70; fill(b, ex, ey, 70, 40, PAL.P2); line(ex, ey, ex + 35, ey + 22, b.ink(PAL.P0)); line(ex + 70, ey, ex + 35, ey + 22, b.ink(PAL.P0)); pt(b, 'INQUIRY', ex + 12, ey + 28, PAL.R2); }
};
/** [MCU] Mas at his monitor in the dark room (Ep1's drawDark2S), still; the room a rung down (his monitor stepped down
 *  when the basement's lights came on); his face kept */
export const masDark = (b: Buf, f: number) => {
  drawDark2S(b, f, {mas: {head: '34', mouth: 'rest', lid: 0, look: -1, brow: 0, arm: 'rest', light: 'monitor'}});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = b.get(x, y); if (!isSkin(c)) b.set(x, y, stepColor(c, -1)); }
};
void stepColor;
