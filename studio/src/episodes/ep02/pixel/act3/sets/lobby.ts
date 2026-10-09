// MR. MAS — Ep2 v1 · act3: SC 13's drawings, LEAVE THEM UP (MAY 15, 2024, the NopeAI lobby by day). The shots pass,
// 2026-10-09. The room is the art pass's master (art/sets/lobby2 drawLobby2: February's flyers curling on the rack
// pillars, the complaint a side table with coffee cups, the corner TV's presser, the DAYS SINCE boards at 176 and 76)
// and the cold open's continuity (the same signs, beanbags, desk); this file adds what the shots need:
//   stafferBust(who, st)   the two STAFFERS (nobody named, nobody real): A a woman with a bun and a mustard cardigan, B a
//                          man with curly hair and a dusty blue hoodie (art/cast/civic2 makeBust3, sculpted heads)
//   pillarMedium(b, f, st) [OTS-W] 13.01-13.02: over Mas's shoulder (the back of his head, act3/sets/backhead) onto the
//                          two staffers at their rack pillar, close: February's flyers on it, curling; A peels a curled
//                          corner (her hand at it), B smooths the tape back down on his (his hand flat on it); A turns
//                          to Mas with the corner still in her fingers (st.turnA)
//   masMCU13(b, f, st)     [MCU] 13.02's answer: Mas (his approved portrait, the lobby's daylight) facing the staffers
//   floorECU(b, f, st)     [ECU] 13.03: the fallen flyer on the lobby's stone floor by the runner; his hand picks it up
//   tapeMCU(b, f, st)      [MCU] 13.03: Mas at his pillar, both hands up, taping it back, upside down
//   flyerPillarECU(b, f)   [ECU] 13.03's beat: his flyer on the pillar, upside down (the art's flyer ECU, nobody in its photo)
//   presser(b, f, st)      [SCR] 13.04-13.05: the Senate presser (art/props/ui presserFull's pieces, re-staged: the
//                          lectern carried to the FLOOR door, face on, then sideways, still stuck; the reporter's
//                          question O.S.; an aide's hand slaps on the tenth FORUM sticker)
//   tvPush(b, f, st)       [SCR] 13.04's head: the lobby TV framed in the foreground, the presser on it at half size
//   lobbyWide(b, f, st)    [W] 13.06: the master by day, Mas walking off frame-right past the staffers at their pillar;
//                          the adventure band lighting as he crosses (sc 14's band, act3/sets/floor adventureBand)
// Nothing here gives a reason for Alyi's leaving: the flyers' photos are doorways with nobody in them.
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {drawSenator} from '../../../../../shared/pixel/cast/civic-extras';
import {drawLobby2, drawFlyer, LOBBY2} from '../../art/sets/lobby2';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs} from '../../art/cast/mas2';
import {makeBust3, makeRoom} from '../../art/cast/civic2';
import type {BustState, BustSpec3, RoomFigSpec, Viseme, RoomLegs} from '../../art/cast/civic2';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, TR, glow, isSkin, putBustSoft, dimRoom, mirror} from './common';
import {drawBackHead} from './backhead';
import {adventureBand} from './band';

// ================================================================== the staffers
const MUSTARD = [PAL.N0, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7];
const CREAMT = [PAL.N1, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9];
const DUSTY = [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5];
const GREYT = [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6];
// A: a round soft face, high cheeks, a small chin, a bun on top, lashes; deep skin; a mustard cardigan over a cream tee
const specA: BustSpec3 = {
  head: {yaw: 20, at: [57, 57], scale: 1.0, cranium: [19, 23, 22], cheekW: 16, cheekY: 7, jawW: 12.5, jawY: 17, jawH: 9, chinY: 31, chinW: 5, chinZ: 11, chinH: 4.5, cheekbone: 0.9, full: 0.9, brow: 0.5,
    nose: {tipY: 12, proj: 5.4, wing: 4.2, bridge: 1.5, tip: 3, hook: -0.3}, mouthY: 21, lips: 1.7, eyeX: 8.5, neck: {r: 7.4}, hair: {style: 'bun', thick: 2.6, line: -17},
    skin: SKIN.deep, hairRamp: HAIR.dark, back: {skin: PAL.S2, hair: PAL.B2}},
  face: {eye: 'lash', eyeW: 8, eyeH: 2, brow: 'soft', browCol: PAL.B0, mouthW: 9, lip: {line: PAL.S1, lower: PAL.U3}},
  torso: {kind: 'blazerShell'},
  ramps: {skin: SKIN.deep, hair: HAIR.dark, suit: MUSTARD, shirt: CREAMT},
  backRamp: {skin: PAL.S2, hair: PAL.B2, suit: PAL.W5},
};
// B: a long face, a straight nose, curly hair, light skin; a dusty blue hoodie over a grey tee
const specB: BustSpec3 = {
  head: {yaw: 18, at: [57, 56], scale: 1.03, cranium: [20, 24, 23], cheekW: 16, jawW: 15, jawY: 19, chinY: 33, chinW: 6.5, chinZ: 12, cheekbone: 0.6, full: 0.5, brow: 1.4,
    nose: {tipY: 13.5, proj: 6.5, wing: 4, bridge: 1.8}, mouthY: 23, eyeX: 8.5, neck: {r: 9.5, throat: true}, hair: {style: 'curly', thick: 4, line: -15},
    skin: SKIN.light, hairRamp: HAIR.brown, back: {skin: PAL.S3, hair: PAL.B3}},
  face: {eye: 'almond', eyeW: 8, eyeH: 2, brow: 'straight', browCol: PAL.B1, mouthW: 10, age: 1},
  torso: {kind: 'jacket'},
  ramps: {skin: SKIN.light, hair: HAIR.brown, suit: DUSTY, shirt: GREYT},
  backRamp: {skin: PAL.S3, hair: PAL.B3, suit: PAL.F4},
};
const bustA = makeBust3<BustState>(specA), bustB = makeBust3<BustState>(specB);
export const stafferBust = (who: 'A' | 'B', s: Partial<BustState> = {}) => (who === 'A' ? bustA : bustB)({mouth: 'rest', expr: 'neutral', ...s});
// their room figures (13.06's wide): the same people at room scale
const roomA = makeRoom({kind: 'blazer', legMat: 'trou', ramps: {skin: SKIN.deep, hair: HAIR.dark, suit: MUSTARD, shirt: CREAMT, trou: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]}, backRamp: {skin: PAL.S2, suit: PAL.W5}} as RoomFigSpec);
const roomB = makeRoom({kind: 'jacket', legMat: 'jeans', ramps: {skin: SKIN.light, hair: HAIR.brown, suit: DUSTY, shirt: GREYT, jeans: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5]}, backRamp: {skin: PAL.S3, suit: PAL.F4}} as RoomFigSpec);
export const drawStafferRoom = (b: Buf, who: 'A' | 'B', footX: number, footY: number, o: {flip?: boolean; mouth?: 'rest' | 'open'; arm?: 'down' | 'up' | 'reach'; legs?: RoomLegs} = {}) => {
  const r = who === 'A' ? roomA : roomB;
  r.draw(b, footX, footY, {arm: o.arm ?? 'down', legs: o.legs ?? 'stand', head: who === 'A' ? {hair: 'bun', woman: true, mouth: o.mouth ?? 'rest'} : {hair: 'curly', mouth: o.mouth ?? 'rest'}}, {flip: o.flip});
};

// ================================================================== the medium at the pillar (13.01-13.02)
/** the lobby behind them, out of focus, in its own materials by day: the stone in soft courses, the warm daylight from
 *  the doors (screen-right), the reception desk's NOPE AI neon a soft cyan bar low in the distance, the far pillar's LEDs
 *  as bokeh, the beanbag rows' colours soft at the foot */
const softBlock = (b: Buf, x0: number, y0: number, x1: number, y1: number, core: number, edge: number, reach = 6) => {
  for (let y = y0 - reach; y < y1 + reach; y++) for (let x = x0 - reach; x < x1 + reach; x++) {
    if (x < 0 || y < 0 || x >= W || y >= RH) continue;
    const dx = Math.max(x0 - x, 0, x - x1 + 1), dy = Math.max(y0 - y, 0, y - y1 + 1), d = Math.hypot(dx, dy) / reach;
    if (d >= 1) continue;
    if (d === 0 || bayer(x, y) > d * 1.1) b.set(x, y, d < 0.45 ? core : edge);
  }
};
const bokeh = (b: Buf, cx: number, cy: number, r: number, c: number, halo: number) => {
  for (let y = cy - r - 2; y <= cy + r + 2; y++) for (let x = cx - r - 2; x <= cx + r + 2; x++) { const d = Math.hypot(x - cx, y - cy); if (d <= r) b.set(x, y, c); else if (d <= r + 2 && bayer(x, y) < 0.45) b.set(x, y, halo); }
};
let MED_BG: Buf | null = null;
const mediumBackdrop = (): Buf => {
  if (MED_BG) return MED_BG;
  const b = new Buf(W, RH, PAL.G2);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = y / RH + (bayer(x, y) - 0.5) * 0.14;
    const course = ((y + 4) % 26) < 2 && bayer(x, y) < 0.5;
    const day = x > 330 ? (x - 330) / 150 : 0;
    b.set(x, y, t > 0.8 ? PAL.G1 : t > 0.7 ? (bayer(x, y) < 0.5 ? PAL.G1 : PAL.G2) : course ? PAL.G1 : day > 0.6 && bayer(x, y) < day - 0.4 ? PAL.G4 : day > 0.2 && bayer(x, y) < day ? PAL.G3 : PAL.G2);
  }
  // the DAYS SINCE board far behind A (its beige panel, the red plate: soft blocks, no letters)
  softBlock(b, 18, 20, 120, 70, PAL.P1, PAL.G4, 8);
  softBlock(b, 92, 28, 116, 58, PAL.R2, PAL.P1, 5);
  // the reception desk's neon, a soft cyan bar low behind the pillar; the desk's dark front under it
  softBlock(b, 150, 150, 330, 176, PAL.N2, PAL.G1, 6);
  softBlock(b, 176, 156, 304, 164, PAL.C6, PAL.C3, 5);
  // the far pillar (right) and its LEDs as bokeh; the wall screen's dark slab beyond it
  softBlock(b, 400, 6, 470, 140, PAL.N2, PAL.G2, 8);
  softBlock(b, 430, 20, 446, 140, PAL.N1, PAL.N2, 4);
  for (let k = 0; k < 6; k++) bokeh(b, 436 + (k % 2) * 6, 30 + k * 18, 2 + (k % 3 === 0 ? 1 : 0), k % 3 === 1 ? PAL.L3 : PAL.C6, PAL.C3);
  // the beanbags' colours at the foot (soft lumps)
  for (let k = 0; k < 6; k++) softBlock(b, 300 + k * 30, 186, 316 + k * 30, 210, [PAL.C2, PAL.R1, PAL.F3, PAL.L1, PAL.U2, PAL.D3][k], PAL.G1, 6);
  MED_BG = b;
  return b;
};
/** the rack pillar close: its dark steel face, a lit edge toward the doors (screen-right), its LED columns (round
 *  2-px lights blinking on their own clocks), a stone base, cut by the frame's top */
export const PILLAR = {x0: 206, x1: 274};
const pillarClose = (b: Buf, f: number, x0 = PILLAR.x0, x1 = PILLAR.x1) => {
  fill(b, x0, 0, x1 - x0, RH, PAL.N2);
  fill(b, x0, 0, 2, RH, PAL.G2); fill(b, x1 - 3, 0, 3, RH, PAL.G4); fill(b, x1 - 1, 0, 1, RH, PAL.G5);
  for (let y = 3; y < RH; y += 7) {
    fill(b, x0 + 4, y, x1 - x0 - 9, 1, PAL.N1);
    for (let q = 0; q < 4; q++) {
      const lx = x0 + 8 + q * 11, on = hash(lx, y, Math.floor((f + lx * 7 + y * 3) / (6 + ((lx + y) % 7))));
      const c = on < 0.42 ? PAL.C6 : on < 0.5 ? PAL.L3 : on < 0.55 ? PAL.W6 : PAL.N3;
      fill(b, lx, y + 2, 2, 2, c); if (c !== PAL.N3) b.set(lx, y + 2, stepColor(c, 1));
    }
  }
};
/** a flyer at the pillar's scale (scale 4: 48 x 64), a corner peeled (`peel` 0..2: the lower-left corner curled off
 *  the steel toward the camera, its underside showing, its shadow on the steel) */
const flyerOnPillar = (b: Buf, x: number, y: number, o: {peel?: number; upside?: boolean} = {}) => {
  drawFlyer(b, x, y, {curl: true, scale: 4, upside: o.upside});
  const p = o.peel ?? 0;
  if (p > 0) {
    const n = 8 + p * 5, Y0 = y + 63;
    for (let j = 0; j < n; j++) for (let i = 0; i < n - j; i++) b.set(x + i, Y0 - j, stepColor(PAL.N2, j > n - 4 ? 0 : -1));
    for (let j = 0; j < n; j++) for (let i = 0; i <= j; i++) b.set(x + i - 1 - p * 2, Y0 - n + j + 2, i === 0 || j === n - 1 ? PAL.P0 : PAL.P1);
  }
};
const HOOD_SLEEVE = [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5];
const MUSTARD_SLEEVE = [PAL.N0, PAL.W3, PAL.W4, PAL.W5, PAL.W7];
const DUSTY_SLEEVE = [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F5];
const cuff7 = (r: number[]) => [r[0], r[1], r[1], r[2], r[3], r[3], r[4]];
export interface PillarSt { turnA?: boolean; aMouth?: Viseme; bMouth?: Viseme; aLook?: -1 | 0 | 1; bLook?: -1 | 0 | 1; peel?: number; smooth?: number; aExpr?: BustState['expr']; bExpr?: BustState['expr'] }
export const pillarMedium = (b: Buf, f: number, st: PillarSt = {}) => {
  b.c.set(mediumBackdrop().c.subarray(0, W * RH));
  pillarClose(b, f);
  // February's flyers on it: A's (upper), B's (lower), a third half out of frame at the top
  flyerOnPillar(b, 216, -44, {});
  flyerOnPillar(b, 214, 30, {peel: st.peel ?? 1});
  flyerOnPillar(b, 218, 112, {});
  // B (screen-right of the pillar, facing it: screen-left), his left hand flat on the lower flyer's taped corner,
  // smoothing it down (st.smooth: the hand's small slide, two drawings)
  const bx = 284, by = 26;
  putBustSoft(b, stafferBust('B', {mouth: st.bMouth ?? 'rest', expr: st.bExpr ?? 'neutral', look: st.bLook ?? -1}), bx, by, RH);
  {
    const sm = st.smooth ?? 0;
    const sh: [number, number] = [bx + 26, by + 112], el: [number, number] = [bx + 6, by + 150];
    const at: [number, number] = [258 + (sm & 1), 160 - (sm & 1)];
    const h = placeHand(POSES.open([-0.55, -0.8, 0.1], [-0.15, 0.1, 0.98], 'L'), {s: 2.4, at, anchor: 'middle', light: 'lobby', cuffRamp: cuff7(DUSTY_SLEEVE)});
    sleeve(b, el, sh, 9, 11, DUSTY_SLEEVE);
    sleeve(b, h.cuffEnd, el, 7, 9, DUSTY_SLEEVE);
    drawHand(b, h.hand, h.x, h.y);
  }
  // A (screen-left of the pillar): facing it (flipped), her right hand at her flyer's curled corner, peeling it; or
  // turned to Mas (unflipped: screen-left), the corner still in her fingers, her hand lowered to her chest
  const ax = 96, ay = 18;
  if (!st.turnA) {
    putBustSoft(b, stafferBust('A', {mouth: st.aMouth ?? 'rest', expr: st.aExpr ?? 'neutral', look: st.aLook ?? 0}), ax, ay, RH, true);
    const sh: [number, number] = [ax + 84, ay + 114], el: [number, number] = [ax + 112, ay + 128];
    const at: [number, number] = [213 - (st.peel ?? 1) * 2, 84];
    const h = placeHand(POSES.pinch([0.35, -0.9, 0.2], [0.2, 0.1, 0.97], 'R'), {s: 2.4, at, anchor: 'index', light: 'lobby', skinMap: (c) => stepColor(c, -1), cuffRamp: cuff7(MUSTARD_SLEEVE)});
    sleeve(b, el, sh, 9, 11, MUSTARD_SLEEVE);
    sleeve(b, h.cuffEnd, el, 7, 9, MUSTARD_SLEEVE);
    drawHand(b, h.hand, h.x, h.y, {map: (c) => (isSkin(c) ? stepColor(c, -1) : c)});
  } else {
    putBustSoft(b, stafferBust('A', {mouth: st.aMouth ?? 'rest', expr: st.aExpr ?? 'worry', look: st.aLook ?? -1}), ax - 4, ay, RH, false);
    // the peeled flyer's corner (its curl stays lifted on the pillar); her hand at her chest, a thumb and finger still
    // pinching air where the corner was (she let it go as she turned)
    const at: [number, number] = [ax + 54, ay + 150];
    const h = placeHand(POSES.pinch([0.5, -0.85, 0.1], [0.1, 0.2, 0.97], 'R'), {s: 2.4, at, anchor: 'index', light: 'lobby', skinMap: (c) => stepColor(c, -1), cuffRamp: cuff7(MUSTARD_SLEEVE)});
    sleeve(b, h.cuffEnd, [ax + 30, ay + 200], 7, 10, MUSTARD_SLEEVE);
    drawHand(b, h.hand, h.x, h.y, {map: (c) => (isSkin(c) ? stepColor(c, -1) : c)});
  }
  // MAS: the back of his head and his hood's shoulder, close in the left foreground, turned a step toward them
  drawBackHead(b, -52, 40, {scale: 1.6, turn: 1, light: 'house', level: 1, flip: true, hair: 'mas'});
};

// ================================================================== 13.02's answer: Mas in the lobby by day
let MCU_BG: Buf | null = null;
const mcuBackdrop = (): Buf => {
  if (MCU_BG) return MCU_BG;
  const b = new Buf(W, RH, PAL.G2);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = y / RH + (bayer(x, y) - 0.5) * 0.14, course = ((y + 10) % 26) < 2 && bayer(x, y) < 0.5;
    b.set(x, y, t > 0.82 ? PAL.G1 : course ? PAL.G1 : x < 120 && bayer(x, y) < (120 - x) / 200 ? PAL.G3 : PAL.G2);
  }
  // behind him: the pillar he taped at (soft, its LEDs as bokeh), the rose window's jewels far up, a soft cyan neon
  softBlock(b, 330, -10, 380, RH + 10, PAL.N2, PAL.G1, 7);
  for (let k = 0; k < 8; k++) bokeh(b, 344 + (k % 2) * 10, 10 + k * 24, 2, k % 3 === 1 ? PAL.L3 : PAL.C6, PAL.C3);
  for (let k = 0; k < 7; k++) bokeh(b, 430 + (k % 3) * 12 - 10, 14 + Math.floor(k / 3) * 12, 3, [PAL.C6, PAL.W6, PAL.R2, PAL.L2, PAL.C7, PAL.U3, PAL.W7][k], PAL.G3);
  softBlock(b, 400, 168, 480, 184, PAL.C5, PAL.C2, 5);
  MCU_BG = b;
  return b;
};
const masDay = new Map<string, ReturnType<typeof masPortrait>>();
/** his approved portrait in the lobby's daylight (the 'warm' rig), keyed one step from the doors' light (camera-right
 *  when he faces the staffers) */
export const masDayImg = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = masDay.get(key); if (hit) return hit;
  const im = faceLightImg(masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...s}), 1, {key: [-1, -0.3]});
  masDay.set(key, im);
  return im;
};
export const masMCU13 = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; look?: -1 | 0 | 1} = {}) => {
  b.c.set(mcuBackdrop().c.subarray(0, W * RH));
  // facing the staffers (screen-right): the portrait mirrored
  putBustSoft(b, masDayImg({mouth: st.mouth ?? 'rest', look: st.look ?? -1}), 118, 26, RH, true);
  void f;
};

// ================================================================== 13.03: the fallen flyer, taped back upside down
/** the flyer at frame scale (a copy of art/sets/lobby2-art flyerECU's sheet, with nobody in its photo, as the cold
 *  open's 1.13 has it: a dark corridor, a door frame, the door half open on a lit room): the headline, the photo, two
 *  caption bars, tape on its corners (`tape`: which corners still carry it), its lower-right corner curling */
const FLW = 150, FLH = 196;
const bigFlyer = (o: {tape?: boolean} = {}): Buf => {
  const F = new Buf(FLW, FLH, TR);
  fill(F, 0, 0, FLW, FLH, PAL.P2); fill(F, FLW - 2, 0, 2, FLH, PAL.P1); fill(F, 0, FLH - 2, FLW, 2, PAL.P1);
  const h1 = 'WHERE IS', h2 = 'ALYI?';
  bpt(F, h1, Math.round((FLW - bpw(h1)) / 2), 10, PAL.N1); bpt(F, h2, Math.round((FLW - bpw(h2)) / 2), 30, PAL.N1);
  const px = 12, py = 54, pwd = FLW - 24, ph = 100;
  fill(F, px, py, pwd, ph, PAL.G2); fill(F, px, py, pwd, 2, PAL.G1);
  fill(F, px + 34, py + 10, 60, ph - 10, PAL.N1);
  fill(F, px + 40, py + 14, 48, ph - 14, PAL.W4); fill(F, px + 60, py + 14, 28, ph - 14, PAL.W6);
  for (let y = py + 18; y < py + ph; y += 9) fill(F, px + 62, y, 24, 1, PAL.W7);
  fill(F, px + 34, py + 10, 10, ph - 10, PAL.D2); fill(F, px + 42, py + 10, 2, ph - 10, PAL.D3);
  poly([px + 44, py + 14, px + 56, py + 18, px + 56, py + ph - 2, px + 44, py + ph], (x, y) => F.set(x, y, PAL.D1));
  fill(F, px + 88, py + 14, 8, ph - 14, PAL.D2);
  for (let r = 0; r < 2; r++) fill(F, 16, py + ph + 8 + r * 8, FLW - 40 - r * 30, 3, PAL.G5);
  if (o.tape !== false) for (const [tx, ty] of [[0, 0], [FLW - 16, 0], [0, FLH - 12], [FLW - 16, FLH - 12]]) for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) F.set(tx + i, ty + j, (i + j) % 5 ? PAL.G6 : PAL.P1);
  const cl = 26;
  for (let i = 0; i < cl; i++) for (let j = 0; j <= i; j++) F.set(FLW - 1 - j, FLH - cl + i, TR);
  for (let i = 0; i < cl; i++) for (let j = 0; j < cl - i; j++) { if (j >= cl - i - 3) F.set(FLW - cl + i, FLH - cl + j, PAL.P0); else if (i + j > cl - 2) F.set(FLW - cl + i, FLH - cl + j, PAL.P1); }
  return F;
};
const FLYER_CACHE = new Map<string, Buf>();
const flyerSheet = (tape: boolean) => { const k = String(tape); let F = FLYER_CACHE.get(k); if (!F) { F = bigFlyer({tape}); FLYER_CACHE.set(k, F); } return F; };
/** lay the sheet at (x0, y0), `upside` = rotated 180 degrees, `sy` squashes it vertically (lying on a floor seen from
 *  above at an angle), its shadow first */
const laySheet = (b: Buf, F: Buf, x0: number, y0: number, o: {upside?: boolean; sy?: number; shadow?: number} = {}) => {
  const sy = o.sy ?? 1, H = Math.round(FLH * sy);
  const at = (i: number, j: number) => { const jj = Math.min(FLH - 1, Math.floor(j / sy)); return F.c[(o.upside ? FLH - 1 - jj : jj) * FLW + (o.upside ? FLW - 1 - i : i)]; };
  const sh = o.shadow ?? 3;
  for (let j = 0; j < H; j++) for (let i = 0; i < FLW; i++) if (at(i, j) !== TR) { const X = x0 + i + sh, Y = y0 + j + sh; if (Y >= 0 && Y < RH) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  for (let j = 0; j < H; j++) for (let i = 0; i < FLW; i++) { const v = at(i, j); if (v !== TR && y0 + j >= 0 && y0 + j < RH) b.set(x0 + i, y0 + j, v); }
};
let FLOOR_BG: Buf | null = null;
/** the lobby floor from above, close: big stone tiles (their joints, a sheen), the red runner's edge along the top */
const floorClose = (): Buf => {
  if (FLOOR_BG) return FLOOR_BG;
  const b = new Buf(W, RH, PAL.G2);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const joint = (x + 30) % 150 < 2 || (y + 40) % 150 < 2;
    const vein = Math.abs(Math.sin((x * 0.05 + y * 0.11)) * 30 - ((x + y) % 60) + 30) < 0.8 && hash(x >> 3, y >> 3, 5) < 0.5;
    b.set(x, y, joint ? PAL.G1 : vein ? PAL.G3 : bayer(x, y) < 0.08 ? PAL.G3 : PAL.G2);
  }
  for (let y = 0; y < 26; y++) for (let x = 0; x < W; x++) b.set(x, y, y > 22 ? PAL.R0 : bayer(x, y) < 0.18 ? PAL.R2 : PAL.R1);
  FLOOR_BG = b;
  return b;
};
/** [ECU, from above] 13.03: the fallen flyer settling on the stone floor by the runner (st.drop 0..3: its last
 *  flutters, tilting, then flat), his hand coming down from the top (st.hand) to pinch its top corner and lift it out
 *  of frame (st.lift 0..1) */
export const floorECU = (b: Buf, f: number, st: {drop?: number; lift?: number; hand?: number}) => {
  b.c.set(floorClose().c.subarray(0, W * RH));
  const lift = clamp(st.lift ?? 0, 0, 1), drop = st.drop ?? 3;
  const x0 = 170 + (3 - drop) * 10, y0 = 14 - (3 - drop) * 40 - Math.round(lift * 220);
  const sy = drop >= 3 ? 0.92 : [0.5, 0.7, 0.84][drop];
  laySheet(b, flyerSheet(false), x0, y0 + Math.round((1 - sy) * 60), {sy, shadow: drop >= 3 && lift < 0.05 ? 3 : 8 + (3 - drop) * 4});
  if ((st.hand ?? 0) > 0) {
    const at: [number, number] = [x0 + 126, y0 + 6];
    const h = placeHand(POSES.pinch([-0.45, 0.85, 0.2], [0.25, -0.35, 0.9], 'R'), {s: 4.6, at, anchor: 'index', light: 'lobby', cuffRamp: cuff7(HOOD_SLEEVE)});
    const cx = h.cuffEnd[0], cy = h.cuffEnd[1];
    sleeve(b, [cx, cy], [cx + 70, cy - 170], 13, 17, HOOD_SLEEVE);
    drawHand(b, h.hand, h.x, h.y);
  }
  void f;
};
/** [MCU] 13.03: Mas at his pillar, side on and close to it: his portrait facing screen-right, the pillar beside him
 *  with the flyer pressed to it upside down by his near hand (his arm bent from the shoulder, the elbow low), his thumb
 *  running the tape along its top edge (st.press 0..2); the staffers soft far behind him, not correcting him */
export const tapeMCU = (b: Buf, f: number, st: {press?: number; raise?: number}) => {
  b.c.set(mcuBackdrop().c.subarray(0, W * RH));
  pillarClose(b, f, 236, 304);
  const r = clamp(st.raise ?? 1, 0, 1), press = st.press ?? 0;
  const fx = 246, fy = 84 + Math.round((1 - r) * 40);
  drawFlyer(b, fx, fy, {scale: 4, upside: true, curl: false, tape: press >= 2});
  // the tape: a strip pulled along its top edge as his thumb runs it (press 1: half, 2: across)
  if (press >= 1) { const tw = press >= 2 ? 52 : 26; fill(b, fx - 2, fy - 2, tw, 4, PAL.G6); fill(b, fx - 2, fy - 2, tw, 1, PAL.P1); }
  putBustSoft(b, masDayImg({mouth: 'rest', look: 1}), 84, 26, RH, true);
  // his near arm: from the shoulder down to the elbow (low, by his side), then up to the hand flat on the flyer, its
  // thumb on the tape (the sleeve at his own scale: a forearm about as wide as his neck)
  const sh: [number, number] = [176, 146], el: [number, number] = [206, 196];
  const at: [number, number] = [fx + 14 + press * 14, fy + 6];
  const h = placeHand(POSES.open([0.97, -0.2, 0.05], [0.05, -0.1, 0.99], 'L'), {s: 3.1, at, anchor: 'middle', light: 'lobby', cuffRamp: cuff7(HOOD_SLEEVE)});
  sleeve(b, el, sh, 15, 17, HOOD_SLEEVE);
  sleeve(b, h.cuffEnd, el, 10, 14, HOOD_SLEEVE);
  drawHand(b, h.hand, h.x, h.y);
};
/** [ECU] 13.03's beat: his flyer on the pillar, upside down, close (the steel and its LED rows round it) */
export const flyerPillarECU = (b: Buf, f: number) => {
  fill(b, 0, 0, W, RH, PAL.N2);
  for (let y = 6; y < RH; y += 12) { fill(b, 0, y, W, 1, PAL.N1); for (let x = 20; x < W; x += 40) { const on = hash(x, y, Math.floor((f + x) / 9)) < 0.6; fill(b, x, y + 4, 3, 3, on ? ((x + y) % 3 ? PAL.C6 : PAL.L3) : PAL.N3); } }
  fill(b, 0, 0, 6, RH, PAL.G2); fill(b, W - 8, 0, 8, RH, PAL.G4);
  laySheet(b, flyerSheet(true), 165, 4, {upside: true, shadow: 3});
};

// ================================================================== 13.04-13.05: the presser
/** the press room at full frame (art/props/ui presserFull's pieces, re-staged so the bit reads): the drape, the FLOOR
 *  door at the right; REMUHCS and three bipartisan colleagues; the bill-shaped lectern ROADMAP · $32B/YR with its nine
 *  FORUM stickers, carried by two aides to the door: st.lx its x, st.turn 0 face on (84 wide, too wide for the door) ·
 *  1 turning · 2 sideways (still too deep), st.tenth the aide's tenth sticker, st.slap 0 none · 1 the hand coming · 2 on
 *  it; the presser's own lower third and REMUHCS's plate */
export interface PresserSt { lx?: number; turn?: 0 | 1 | 2; tenth?: boolean; slap?: 0 | 1 | 2; bump?: number; plate?: boolean; mouth?: 'rest' | 'open' }
export const presser = (b: Buf, f: number, st: PresserSt = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.F1, PAL.F2, PAL.F2]);
  for (let x = 0; x < 480; x += 12) fill(b, x, 0, 3, 150, PAL.F1);
  fill(b, 0, 150, 480, 53, PAL.D2); fill(b, 0, 150, 480, 1, PAL.D3);
  // the FLOOR door: tall, wood, the sign over it, its frame a narrow opening (the lectern can't pass)
  // (a narrow door: 34 px clear, the lectern 84 wide face on and 40 deep sideways)
  const DX = 404, DW = 34;
  fill(b, DX - 5, 66, DW + 10, 86, PAL.D1); fill(b, DX, 70, DW, 82, PAL.D3); fill(b, DX, 70, DW, 2, PAL.D4); fill(b, DX + DW - 2, 70, 2, 82, PAL.D2);
  fill(b, DX + DW - 8, 108, 3, 8, PAL.W5);
  const sw0 = bpw('FLOOR') + 12, sx0 = DX + (DW >> 1) - (sw0 >> 1);
  fill(b, sx0, 40, sw0, 22, PAL.D2); fill(b, sx0, 40, sw0, 1, PAL.D4); bpt(b, 'FLOOR', sx0 + 6, 44, PAL.W7);
  // the senators: REMUHCS (plated) centre-left, three colleagues, all facing the room
  drawSenator(b, 60, 168, 1, 'sit'); drawSenator(b, 104, 168, 2, 'sit'); drawSenator(b, 228, 168, 0, 'sit');
  drawSenator(b, 160, 170, 0, 'up', {mouth: st.mouth ?? 'rest'});
  // the lectern (a bill-shaped document on legs)
  const turn = st.turn ?? 0, bump = st.bump ?? 0;
  const lw = turn === 2 ? 40 : turn === 1 ? 60 : 84, lx = (st.lx ?? 262) + bump;
  fill(b, lx + 2, 176, lw, 3, PAL.D1);
  fill(b, lx, 104, lw, 72, PAL.P2); fill(b, lx, 104, lw, 3, PAL.W9); fill(b, lx + lw - 2, 104, 2, 72, PAL.P0); fill(b, lx, 104, 2, 72, PAL.P1);
  if (turn === 0) { pt(b, 'ROADMAP', lx + 6, 110, PAL.N1); pt(b, '$32B/YR', lx + 6, 121, PAL.R2); }
  const n = st.tenth ? 10 : 9, sw = tinyWidth('FORUM') + 3;
  for (let k = 0; k < n; k++) {
    if (turn === 0) {
      const tenth = k === 9;
      const sx = tenth ? lx + 50 : lx + 4 + (k % 3) * (sw + 2), sy = tenth ? 120 : 134 + Math.floor(k / 3) * 11;
      fill(b, sx, sy, sw, 9, tenth ? PAL.W7 : PAL.C5); fill(b, sx, sy, sw, 1, tenth ? PAL.W8 : PAL.C6); tiny(b, 'FORUM', sx + 2, sy + 2, PAL.N1);
    } else {
      // edge-on: the stickers' edges a row of coloured slivers down its front
      fill(b, lx + 2 + (k % 2) * 8, 112 + Math.floor(k / 2) * 11, turn === 1 ? 6 : 4, 7, k === 9 ? PAL.W7 : PAL.C5);
    }
  }
  // the two aides at its ends, leaning in (one each side), facing the door
  drawSenator(b, lx - 12, 182, 1, 'lean', {flip: true}); drawSenator(b, lx + lw + 12, 182, 2, 'lean');
  // the aide's hand slapping on the tenth: an open hand from below-left onto the sticker's spot
  if (st.slap) {
    const at: [number, number] = [lx + 56, st.slap === 2 ? 124 : 112];
    const h = placeHand(POSES.open([0.4, -0.9, 0.05], [0.1, 0.25, 0.96], 'R'), {s: 1.9, at, anchor: 'middle', light: 'lobby', cuffRamp: [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.N3, PAL.N5]});
    sleeve(b, h.cuffEnd, [h.cuffEnd[0] - 40, h.cuffEnd[1] + 70], 5, 6, [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5]);
    drawHand(b, h.hand, h.x, h.y);
    if (st.slap === 2) for (const [dx, dy] of [[-8, -4], [-10, 2], [26, -4], [28, 2]]) b.set(at[0] + dx, at[1] + dy, PAL.P2);
  }
  // the broadcast's lower third: his plate above the headline bar (held while it's on screen)
  if (st.plate !== false) { fill(b, 0, 166, pw('REMUHCS · MAJORITY LEADER') + 18, 14, PAL.P2); fill(b, 0, 166, 4, 14, PAL.R2); pt(b, 'REMUHCS · MAJORITY LEADER', 10, 170, PAL.N1); }
  fill(b, 0, 182, 480, 21, PAL.N0); fill(b, 0, 182, 6, 21, PAL.R2); pt(b, 'BIPARTISAN SENATE AI ROADMAP', 12, 189, PAL.P2);
  void f;
};
/** 13.04's head: the lobby's corner TV framed close in the foreground (its black bezel and wall bracket), the presser
 *  on it at half size (every other pixel), the lobby soft beyond it */
export const tvPush = (b: Buf, f: number, st: PresserSt = {}) => {
  b.c.set(mediumBackdrop().c.subarray(0, W * RH));
  dimRoom(b, 1);
  const full = new Buf(480, 270, PAL.N0);
  presser(full, f, st);
  const X = 116, Y = 44, w = 240, h = 102;
  fill(b, X - 10, Y - 8, w + 20, h + 16, PAL.N0); fill(b, X - 10, Y - 8, w + 20, 1, PAL.G2); fill(b, X - 10, Y - 8, 1, h + 16, PAL.G1);
  fill(b, X + w / 2 - 6, Y + h + 8, 12, 30, PAL.G1); fill(b, X + w / 2 - 6, Y + h + 8, 2, 30, PAL.G2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.set(X + x, Y + y, full.get(x * 2, y * 2));
  // the glass's sheen across its upper corner
  for (let i = 0; i < 40; i++) for (let j = 0; j < 3; j++) { const x = X + 140 + i, y = Y + 4 + Math.round(i * 0.5) + j; if (bayer(x, y) < 0.3) b.set(x, y, stepColor(b.get(x, y), 1)); }
};

// ================================================================== 13.06: the master, Mas walking off
/** the master by day as sc 13 has it (the art's sc-13 state); `mas`: his foot point and walk drawing (null = gone);
 *  the staffers at their pillar (the screen-right one), their heads turning after him; `band` 0..3: the adventure band
 *  lighting in held steps in the band rows (the layout returns full) */
export const lobbyWide = (b: Buf, f: number, st: {mas?: {x: number; y: number; legs: Mas2Legs} | null; look?: boolean; band?: number}) => {
  drawLobby2(b, {f, time: 'day', sign1: '176', sign2: '76', flyers: 'curl', upside: true, complaint: 'table', cups: true, tv: 'presser', beanbags: true}, {
    floor: (bb) => {
      // the staffers at the near pillar (318-336): A at its left, B at its right
      drawStafferRoom(bb, 'A', 318, 168, {flip: !st.look});
      drawStafferRoom(bb, 'B', 346, 168, {flip: true});
    },
    front: (bb) => { if (st.mas) drawMasStand2(bb, st.mas.x, st.mas.y, {legs: st.mas.legs, arm: 'down'}); },
  });
  // the band: the show's own band, then the adventure band lighting (the threshold)
  fill(b, 0, RH, 480, 270 - RH, PAL.N0); fill(b, 0, RH, 480, 1, PAL.N3);
  const n = st.band ?? 0;
  if (n > 0) adventureBand(b, {dim: (3 - Math.min(3, n)) * 2});
};
void rect; void line; void ellipse; void poly; void familyOf; void glow; void bpt; void tiny; void mirror; void LOBBY2;
