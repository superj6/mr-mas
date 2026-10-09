// MR. MAS — Ep2 v1 · act3: SC 14's drawings, THE OPEN FLOOR (MAY 15-17, 2024; UI LIT: the episode's one adventure-game
// scene and its one dialogue tree). The shots pass, 2026-10-09. The room is the art pass's spread (art/sets/floor.ts
// openFloor: Ep1's bullpen re-dressed, ordinary desks, tiled staff, Alyi's door on a centre pin with Ep1's note on its
// frame, the humming chair, DOT on her ladder); the band is act3/sets/band.ts (every frame of sc 14 is `full`). This file
// stages the people and the beats in it:
//   spread(b, f, st)      [W] the spread with Mas walking the back aisle (the find-the-man game: he is one of dozens),
//                         the polished heatsink he looks into (a sculpture of fins on a plinth by the glass wall), the
//                         note falling from the frame into his pocket, Bukaj arriving and sitting in the humming chair,
//                         Ekiel walking out with his box, one domino lying at Mas's shoe; his speech typed over his head
//   finsMCU(b, f, st)     [MCU] 14.03-14.04: his own face in the polished fins (mirrored, banded, cooled; never Alyi's),
//                         and low in frame his phone in his hand with its suggestion strip: his thumb taps the greyed
//                         `come back` (bonk), then `can we talk?`; his reflection mouths it back, no voice
//   chair2S(b, f, st)     [2S] 14.07-14.08: Mas (his portrait in the floor's daylight, facing right) and BUKAJ seated in
//                         the humming chair (art/cast/bukaj, his hand flat on its armrest), the floor soft behind them
//   dominoHigh(b, f, st)  [HIGH] 14.10: the carpet from above; Ekiel's hand sets his thread's first post down as one
//                         domino in its own UI, his shoes walk off; it tips back and lands face up against Mas's shoe
//   corridor(b, f, st)    [W] 14.11: down the corridor, Ekiel's empty desk and the safety team's own door, its plate
//                         SUPERALIGNMENT / SAFETY TEAM; DOT at it from behind with her screwdriver
//   plateECU / boxECU     [ECU] 14.11: her orange-cuffed hand backs out the four screws (art/cast/dot dotHandsECU); the
//                         plate dropped face up into the MISC box, MAY 17
// No image of Alyi in any surface (FC). The note is never defined: no insert, no tag, never his colour.
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import {openFloor, FLOOR} from '../../art/sets/floor';
import {BULLPEN} from '../../../../../shared/pixel/rooms/bullpen';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs, Mas2Arm} from '../../art/cast/mas2';
import {bukajBust, drawBukajRoom} from '../../art/cast/bukaj';
import {drawEkielRoom} from '../../art/cast/ekiel';
import {dotHandsECU, drawDotBack} from '../../art/cast/dot';
import {drawEp2Post} from '../../art/props/ui';
import {placeHand, drawHand, sleeve, holdPhone, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, TR, glow, isSkin, putBustSoft, dimRoom, speech, reframe, mirror} from './common';

const B = BULLPEN;
/** the back aisle (feet line) where Mas, Bukaj and Ekiel walk; the heatsink; the door (the art's); the note */
export const SP = {aisle: 160, ekiel: 164, sink: {x0: 196, x1: 238, y0: 100, y1: 152}, masAtSink: 172, masAtDoor: 262, door: B.door, note: FLOOR.note, chair: FLOOR.chair};

// ================================================================== the heatsink (a polished sculpture of fins)
/** a polished heatsink on a plinth against the glass wall: vertical fins, mirror-bright; at room scale his face is a
 *  warm smudge in it when he stands at it (st.face) */
const heatsink = (b: Buf, f: number, face: boolean) => {
  const H = SP.sink;
  fill(b, H.x0 - 4, H.y1, H.x1 - H.x0 + 8, 8, PAL.G2); fill(b, H.x0 - 4, H.y1, H.x1 - H.x0 + 8, 1, PAL.G4);
  for (let x = H.x0; x < H.x1; x++) for (let y = H.y0; y < H.y1; y++) {
    const fin = (x - H.x0) % 4;
    const sheen = Math.abs((x - H.x0) - (y - H.y0) * 0.5 - 6) < 3 || Math.abs((x - H.x0) - (y - H.y0) * 0.5 - 26) < 2;
    b.set(x, y, fin === 0 ? PAL.G2 : fin === 3 ? PAL.G4 : sheen ? PAL.P2 : y < H.y0 + 3 ? PAL.G6 : PAL.G5);
  }
  fill(b, H.x0 - 2, H.y0 - 3, H.x1 - H.x0 + 4, 3, PAL.G3); fill(b, H.x0 - 2, H.y0 - 3, H.x1 - H.x0 + 4, 1, PAL.G6);
  // his face in the polish: a warm smudge banded by the fins
  if (face) for (let j = 0; j < 9; j++) for (let i = 0; i < 7; i++) { const x = H.x0 + 8 + i, y = H.y0 + 14 + j; if ((x - H.x0) % 4 && Math.hypot((i - 3) / 3.5, (j - 4) / 4.5) < 1) b.set(x, y, j < 3 ? PAL.B2 : PAL.S4); }
  void f;
};

// ================================================================== the spread with its cast
export interface SpreadSt {
  mas?: {x: number; legs?: Mas2Legs; arm?: Mas2Arm; flip?: boolean; mouth?: 'rest' | 'open'} | null;
  /** his speech over his head: the line, the frame its typing started (it types at 1.5 glyphs a frame) */
  say?: {text: string; k: number} | null;
  note?: 'on' | 'gone' | {fall: number};
  pivot?: 0 | 1 | 2 | 3;
  dot?: 'ladder' | 'point';
  bukaj?: {x: number; state: 'carry' | 'seated'; legs?: number; mouth?: 'rest' | 'open'} | null;
  ekiel?: {x: number; legs: number} | null;
  domino?: boolean;
  hum?: number;
  shake?: number;
}
export const spread = (b: Buf, f: number, st: SpreadSt) => {
  const back = (bb: Buf) => {
    heatsink(bb, f, !!st.mas && Math.abs(st.mas.x - SP.masAtSink) < 4);
    if (st.bukaj) {
      if (st.bukaj.state === 'seated') drawBukajRoom(bb, st.bukaj.x, SP.chair.y + 16, {state: 'seated', mouth: st.bukaj.mouth ?? 'rest'}, {flip: true});
      else drawBukajRoom(bb, st.bukaj.x, SP.aisle, {state: 'carry'}, {flip: true});
    }
    if (st.domino && st.mas) { const dx = st.mas.x + (st.mas.flip ? 12 : -14); fill(bb, dx - 8, SP.aisle - 2, 16, 3, PAL.P2); fill(bb, dx - 8, SP.aisle - 2, 16, 1, PAL.W9); fill(bb, dx - 7, SP.aisle + 1, 16, 1, PAL.G2); fill(bb, dx - 5, SP.aisle - 1, 8, 1, PAL.N3); }
    if (st.mas) drawMasStand2(bb, st.mas.x, SP.aisle, {legs: st.mas.legs ?? 'stand', arm: st.mas.arm ?? 'down', mouth: st.mas.mouth ?? 'rest'}, {flip: st.mas.flip});
    if (st.ekiel) drawEkielRoom(bb, st.ekiel.x, SP.ekiel, {state: 'carry', legs: (['w0', 'w1', 'w2', 'w3'] as const)[st.ekiel.legs & 3]}, {flip: true});
    // the note falling from the frame (a yellowed slip, tumbling in held steps, into his pocket)
    if (st.note && typeof st.note === 'object') {
      const t = clamp(st.note.fall, 0, 1), N = SP.note, mx = st.mas ? st.mas.x + 6 : 266;
      const x = Math.round(N.x + (mx - N.x) * t + Math.sin(t * 9) * 6), y = Math.round(N.y + (124 - N.y) * t);
      const tilt = Math.floor(t * 9) % 3 - 1;
      for (let j = 0; j < 7; j++) for (let i = 0; i < 11; i++) bb.set(x + i + Math.round((j * tilt) / 3), y + j, j === 0 ? PAL.W9 : (i + j) % 6 === 0 ? PAL.W6 : PAL.W8);
    }
  };
  openFloor(b, f, {note: st.note === undefined || st.note === 'on' ? 'on' : 'gone', pivot: st.pivot ?? 0, dot: st.dot === 'point' ? 'point' : 'ladder', domino: null, hum: true}, {back});
  // the door turning on its pin: the opening behind it is Alyi's office in the evening (its violet wall, the window's
  // dusk glow, the edge of the desk with no chair), drawn over the art's opening so it reads as a room, not a door
  if (st.pivot) {
    const D = SP.door, x0 = D.x0 + 2, x1 = D.x1 - 2, y0 = D.y0, y1 = B.floorY, cx = (D.x0 + D.x1) >> 1;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) b.set(x, y, y > y1 - 18 ? PAL.D2 : y < y0 + 40 && x > x0 + 16 ? (bayer(x, y) < 0.5 ? PAL.U4 : PAL.U3) : PAL.U2);
    fill(b, x0 + 2, y1 - 30, 20, 3, PAL.D4); fill(b, x0 + 4, y1 - 27, 2, 12, PAL.D1);
    const w = [32, 22, 12, 3][st.pivot];
    fill(b, cx - (w >> 1), y0, w, y1 - y0, PAL.D3); fill(b, cx - (w >> 1), y0, 1, y1 - y0, PAL.D4); fill(b, cx + (w >> 1) - 1, y0, 1, y1 - y0, PAL.D1);
  }
  // the chair's hum swelling: its tiny lines a rung brighter and wider (st.hum 0..2)
  if (st.hum) { const cx = SP.chair.x, cy = SP.chair.y; const p = Math.floor(f / 3) % 2; for (let k = 0; k < 4; k++) for (let s = -1; s <= 1; s += 2) { const x = s < 0 ? cx - 5 - p - st.hum * 2 : cx + 23 + p + st.hum * 2; b.set(x, cy - 32 + k * 6, PAL.C6); b.set(x + s, cy - 31 + k * 6, PAL.C5); } }
  if (st.shake) reframe(b, st.shake, 0);
  if (st.say && st.mas) speech(b, st.say.text, st.mas.x + 2, SP.aisle - 84, 0, {k0: -st.say.k, rate: 1.5, col: PAL.C7});
};
/** a speech's typing frame helper: how far into its typing at shot frame k (it starts at k0) */
export const sayAt = (text: string, k: number, k0: number, k1: number) => (k >= k0 && k < k1 ? {text, k: k - k0} : null);

// ================================================================== 14.03-14.04: his face in the fins; the strip
const finFace = new Map<string, Buf>();
/** the fins close: polished steel in vertical bands; in them his own face (his approved portrait mirrored, banded by
 *  the fins' gaps, cooled toward the steel); the reflection's mouth from st.mouth (it mouths, it never speaks) */
const finsLayer = (mouth: MasPortraitState['mouth']): Buf => {
  const hit = finFace.get(mouth); if (hit) return hit;
  const b = new Buf(W, RH, PAL.G4);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const fin = x % 9;
    const band = (y + Math.floor(x / 9) * 7) % 40;
    b.set(x, y, fin === 0 ? PAL.G2 : fin === 1 ? PAL.G3 : fin === 8 ? PAL.G6 : band < 2 ? PAL.G6 : PAL.G5);
  }
  const face = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', mouth, look: 0});
  const ox = 184, oy = 6;
  for (let y = 0; y < face.h; y++) for (let x = 0; x < face.w; x++) {
    const v = face.c[y * face.w + (face.w - 1 - x)]; if (v < 0) continue;
    const X = ox + x, Y = oy + y;
    if (Y >= RH) continue;
    const fin = X % 9;
    if (fin === 0) continue; // the gaps between the fins break him into bands
    const L = lightness(v);
    // the reflection takes the steel's cool ramp with its own values (a face in metal, not a face on a screen)
    const c = L > 0.62 ? PAL.P2 : L > 0.5 ? PAL.G6 : L > 0.36 ? PAL.G5 : L > 0.24 ? PAL.G4 : L > 0.14 ? PAL.G3 : PAL.G2;
    b.set(X, Y, fin === 1 || fin === 8 ? stepColor(c, fin === 8 ? 1 : -1) : c);
  }
  finFace.set(mouth, b);
  return b;
};
const HOOD_SL = [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5];
const HOOD_CUFF = [PAL.N0, PAL.G1, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.G5];
export const STRIP = ['> where are you going?', '> can we talk?', '> come back'];
/** st.tap: the chip his thumb is on (null none), st.down (pressing), st.bonk (the greyed chip shaking: frames since) */
export const finsMCU = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; tap?: 0 | 1 | 2 | null; down?: boolean; bonk?: number; lit?: 0 | 1 | 2 | null}) => {
  b.c.set(finsLayer(st.mouth ?? 'rest').c.subarray(0, W * RH));
  // his phone low in frame (its top third; the frame cuts it), the suggestion strip on its screen, his hand round it
  const P = {x: 70, y: 150, w: 340, h: 120};
  const scr = (bb: Buf) => {
    fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.N0); fill(bb, P.x - 4, P.y - 4, P.w + 8, 1, PAL.G3);
    fill(bb, P.x, P.y, P.w, P.h, PAL.N1);
    let x = P.x + 8;
    STRIP.forEach((c, i) => {
      const w = pw(c) + 10, grey = i === 2, on = st.lit === i || (st.tap === i && st.down);
      const shake = grey && st.bonk !== undefined && st.bonk >= 0 && st.bonk < 8 ? ((st.bonk >> 1) % 2 ? 2 : -2) : 0;
      fill(bb, x + shake, P.y + 14, w, 18, on && !grey ? PAL.C3 : grey ? PAL.N2 : PAL.N3); fill(bb, x + shake, P.y + 14, w, 1, grey ? PAL.N4 : PAL.C5);
      pt(bb, c, x + 5 + shake, P.y + 19, grey ? PAL.N5 : PAL.P2);
      if (grey) fill(bb, x + 13 + shake, P.y + 22, pw(c) - 9, 1, PAL.N5);
      x += w + 6;
    });
  };
  // the thumb on its chip (the cup grip's thumb, the hand behind the phone's lower edge, out of frame)
  const chipX = (i: number) => { let x = P.x + 8; for (let q = 0; q < i; q++) x += pw(STRIP[q]) + 16; return x + Math.round((pw(STRIP[i]) + 10) / 2); };
  if (st.tap === null || st.tap === undefined) { scr(b); return; }
  const tip: [number, number] = [chipX(st.tap), P.y + 22 + (st.down ? 2 : -4)];
  const h = placeHand(POSES.point([-0.2, -0.95, -0.2], [0.1, 0.2, 0.97], 'R'), {s: 4.2, at: tip, anchor: 'thumb', light: 'lobby', cuffRamp: HOOD_CUFF});
  scr(b);
  void h;
  // (the thumb from below: a rounded tip and its pad over the chip, the hand below the frame)
  const tx = tip[0], ty = tip[1];
  for (let y = ty; y < RH; y++) for (let x = tx - 9; x <= tx + 9; x++) {
    const w = 7 + Math.min(4, (y - ty) * 0.25), d = Math.abs(x - tx - (y - ty) * 0.12);
    if (d > w) continue;
    const top = y - ty < 6 && Math.hypot(x - tx, (y - ty - 6) * 1.2) > 7.5;
    if (top) continue;
    const nail = y - ty < 9 && Math.abs(x - tx) < 4 && y - ty > 1;
    b.set(x, y, d > w - 1 ? PAL.S2 : nail ? (y - ty < 3 ? PAL.P1 : PAL.S6) : x < tx - 2 ? PAL.S4 : PAL.S5);
  }
  void f;
};

// ================================================================== 14.07-14.08: Mas and Bukaj at the chair
let SOFT2S: Buf | null = null;
const floorSoft = (): Buf => {
  if (SOFT2S) return SOFT2S;
  const t = new Buf(W, 270, PAL.N0);
  openFloor(t, 0, {note: 'gone', pivot: 0, dot: 'ladder', hum: false});
  // reframed on the door and the chair (the room moved left so the door sits centre-left), soft two rungs
  reframe(t, -40, 10);
  dimRoom(t, 2);
  SOFT2S = t;
  return t;
};
const masFloorImg = new Map<string, ReturnType<typeof masPortrait>>();
const masFloor = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = masFloorImg.get(key); if (hit) return hit;
  const im = faceLightImg(masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...s}), 1, {key: [1, -0.3]});
  masFloorImg.set(key, im);
  return im;
};
export const chair2S = (b: Buf, f: number, st: {mas?: MasPortraitState['mouth']; bukaj?: Parameters<typeof bukajBust>[0]; hum?: number}) => {
  b.c.set(floorSoft().c.subarray(0, W * RH));
  // the humming chair's high back behind Bukaj (charcoal mesh, its frame), its hum lines either side
  const cx = 330;
  fill(b, cx - 44, 18, 96, 150, PAL.G1); fill(b, cx - 44, 18, 96, 2, PAL.G3); fill(b, cx - 44, 18, 2, 150, PAL.G2); fill(b, cx + 50, 18, 2, 150, PAL.N1);
  for (let y = 24; y < 168; y += 4) for (let x = cx - 40; x < cx + 48; x += 4) b.set(x + ((y >> 2) & 1) * 2, y, PAL.G2);
  const hum = st.hum ?? 1, p = Math.floor(f / 3) % 2;
  for (let k = 0; k < 5; k++) for (const s of [-1, 1]) { const x = s < 0 ? cx - 52 - p - hum * 2 : cx + 58 + p + hum * 2; fill(b, x, 30 + k * 26, 1, 6, PAL.C5); fill(b, x + s * 2, 33 + k * 26, 1, 4, PAL.C4); }
  // the armrest his hand lies on (chrome, humming), under him
  fill(b, 268, 166, 70, 7, PAL.G4); fill(b, 268, 166, 70, 1, PAL.G6); fill(b, 268, 172, 70, 1, PAL.G2); fill(b, 330, 173, 6, 30, PAL.G2);
  putBustSoft(b, bukajBust({arm: 'armrest', expr: 'smile', mouth: 'rest', ...st.bukaj}), 276, 34, RH);
  putBustSoft(b, masFloor({mouth: st.mas ?? 'rest', look: 1}), 46, 28, RH, true);
};

// ================================================================== 14.10: the domino
const carpet = (b: Buf) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const tile = ((x >> 5) + (y >> 5)) & 1;
    const n = hash(x >> 1, y >> 1, 3);
    b.set(x, y, n < 0.12 ? PAL.G1 : n > 0.9 ? PAL.G3 : tile ? PAL.G2 : stepColor(PAL.G2, 0));
  }
  for (let x = 0; x < W; x += 64) fill(b, x, 0, 1, RH, PAL.G1);
  for (let y = 0; y < RH; y += 64) fill(b, 0, y, W, 1, PAL.G1);
};
/** [HIGH] the carpet from above. st.set (0..1: his hand lowering the domino onto its end), st.shoes (0..1: his feet
 *  walking off the top), st.fall (0 standing .. 3 flat), st.slide (px it has slid toward Mas's shoe at the top) */
export const dominoHigh = (b: Buf, f: number, st: {set?: number; shoes?: number; fall?: number; slide?: number}) => {
  carpet(b);
  // Mas's sneaker at the top of frame (his foot beyond the domino, seen from above): the jeans' hem, the grey canvas
  // upper with its laces, the white toe cap pointing down at the domino, the sole's white rim
  const shoe = (x: number, y: number) => {
    for (let j = 0; j < 58; j++) for (let i = 0; i < 44; i++) {
      const u = (i - 22) / 22, v = (j - 22) / 36, d = Math.hypot(u, v);
      if (d >= 1) continue;
      const rim = d > 0.9, toe = j > 40;
      b.set(x + i, y + j, rim ? PAL.P1 : toe ? (d > 0.75 ? PAL.P1 : PAL.P2) : (i + j) % 9 === 0 ? PAL.G3 : u < -0.3 ? PAL.G3 : PAL.G4);
    }
    for (let r = 0; r < 4; r++) { fill(b, x + 15, y + 4 + r * 7, 14, 2, PAL.P2); fill(b, x + 15, y + 6 + r * 7, 14, 1, PAL.G5); }
    fill(b, x + 4, y - 6, 36, 10, PAL.N3); fill(b, x + 4, y + 3, 36, 1, PAL.N5); fill(b, x + 4, y - 6, 2, 10, PAL.N2);
  };
  shoe(218, -4);
  const fall = st.fall ?? 0, slide = st.slide ?? 0;
  // the domino: a thick cream tile carrying his post in its own UI; standing (its top edge seen from above, its face
  // toward us), then tipping back (its face turning up to the lens), then flat (its edge's thickness at its foot)
  const x0 = 140, faceH = [150, 154, 158, 160][Math.min(3, Math.round(fall))], faceW = 200;
  const yTop = 58 - Math.round(fall * 6) - slide, yFoot = yTop + faceH;
  const card = new Buf(faceW, 160, TR);
  fill(card, 0, 0, faceW, 160, PAL.P2);
  drawEp2Post(card, 6, 8, 'ekiel', {size: 'phone', w: faceW - 12});
  // a domino's face: the post in its upper half, the divider, three pips below (it is a domino)
  fill(card, 6, 110, faceW - 12, 2, PAL.N2);
  for (const [px, py] of [[40, 124], [100, 134], [160, 144]]) for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) { const d = Math.hypot(i, j); if (d < 5) card.set(px + i, py + j, d < 2 && i < 0 && j < 0 ? PAL.N4 : PAL.N1); }
  // its shadow on the carpet (standing: cast forward; flat: tight under it)
  for (let j = 0; j < 14; j++) for (let i = 0; i < faceW; i++) { const X = x0 + i + 4, Y = yFoot + j - (fall >= 3 ? 10 : 0); if (Y < RH && bayer(X, Y) < (fall >= 3 ? 0.6 : 0.5 - j * 0.03)) b.set(X, Y, stepColor(b.get(X, Y), -1)); }
  if (fall < 3) { fill(b, x0, yTop - 8 + fall * 2, faceW, 8 - fall * 2, PAL.P1); fill(b, x0, yTop - 8 + fall * 2, faceW, 1, PAL.W9); }
  for (let j = 0; j < faceH; j++) { const sj = Math.min(159, Math.floor((j * 160) / faceH)); for (let i = 0; i < faceW; i++) { const v = card.c[sj * faceW + i]; if (v !== TR && yTop + j >= 0 && yTop + j < RH) b.set(x0 + i, yTop + j, v); } }
  fill(b, x0 + faceW - 2, yTop, 2, faceH, PAL.P0);
  if (fall >= 3) { fill(b, x0, yFoot, faceW, 6, PAL.P1); fill(b, x0, yFoot + 5, faceW, 1, PAL.P0); }
  // Ekiel's hand setting it down: his fingers on its right edge from the right (his navy cuff), the domino lowered the
  // last few pixels onto its end; then gone
  const set = st.set ?? 1;
  if (set < 1) {
    const at: [number, number] = [x0 + faceW + 2, yTop + 54];
    const h = placeHand(POSES.grip([-0.95, 0.15, 0.1], [0.05, -0.2, 0.98], 'R', 0.45), {s: 5.2, at, anchor: 'middle', light: 'lobby', cuffRamp: [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.N3, PAL.N5]});
    sleeve(b, h.cuffEnd, [W + 60, h.cuffEnd[1] + 50], 14, 18, [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5]);
    drawHand(b, h.hand, h.x, h.y);
  }
  const sh = st.shoes;
  if (sh !== undefined && sh < 1) {
    const sx = 380 + Math.round(sh * 40), sy = 150 - Math.round(sh * 200);
    for (const [dx, dy] of [[0, (Math.floor(sh * 12) % 2) * 14], [26, ((Math.floor(sh * 12) + 1) % 2) * 14]]) {
      const x = sx + dx, y = sy + dy;
      for (let j = 0; j < 30; j++) for (let i = 0; i < 18; i++) { const d = Math.hypot((i - 9) / 9, (j - 12) / 16); if (d < 1) b.set(x + i, y + j, d > 0.85 ? PAL.N0 : j < 8 ? PAL.D3 : PAL.D2); }
      fill(b, x + 3, y + 26, 12, 14, PAL.F2); fill(b, x + 3, y + 26, 1, 14, PAL.F3);
    }
  }
  void f;
};

// ================================================================== 14.11: the corridor, the plate, the box
/** [W] down the corridor (one-point): grey walls, the ceiling lights receding, Ekiel's empty desk on the left (its
 *  chair pushed in, the MISC box on it), and at the end the safety team's own door with its plate; DOT at the door from
 *  behind (her orange cuff and screwdriver up at the plate) */
export const corridor = (b: Buf, f: number, st: {dot?: boolean} = {}) => {
  const vx = 240, vy = 96;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const dx = (x - vx) / 240, dy = (y - vy) / 107;
    const wall = Math.abs(dx) > Math.abs(dy) * 1.25;
    const ceil = !wall && dy < 0, floor = !wall && dy > 0;
    const depth = wall ? Math.abs(dx) : Math.abs(dy);
    const ring = Math.floor(Math.log(Math.max(0.05, depth)) * 6) & 1;
    b.set(x, y, wall ? (ring ? PAL.G3 : PAL.G4) : ceil ? (ring ? PAL.G2 : PAL.G3) : floor ? (ring ? PAL.G1 : PAL.G2) : PAL.G2);
  }
  // the ceiling lights receding (bright bars on the centre line)
  for (const t of [0.85, 0.55, 0.35, 0.22]) { const y = Math.round(vy - 107 * t), w = Math.round(60 * t); fill(b, vx - w, y, w * 2, Math.max(1, Math.round(4 * t)), PAL.P2); }
  // the end wall and the team's door with its plate (legible at 1080p: 7 px type on a steel plate)
  fill(b, vx - 54, vy - 62, 108, 124, PAL.G4);
  const dx0 = vx - 24, dy0 = vy - 56;
  fill(b, dx0 - 3, dy0 - 3, 54, 121, PAL.D1); fill(b, dx0, dy0, 48, 118, PAL.D4); fill(b, dx0, dy0, 48, 2, PAL.W3); fill(b, dx0 + 40, dy0 + 60, 3, 8, PAL.G6);
  const plW = Math.max(pw('SUPERALIGNMENT'), pw('SAFETY TEAM')) + 10;
  fill(b, vx - plW / 2, dy0 + 12, plW, 26, PAL.G5); fill(b, vx - plW / 2, dy0 + 12, plW, 1, PAL.G6); fill(b, vx - plW / 2, dy0 + 37, plW, 1, PAL.G3);
  pt(b, 'SUPERALIGNMENT', vx - Math.round(pw('SUPERALIGNMENT') / 2), dy0 + 15, PAL.N1); pt(b, 'SAFETY TEAM', vx - Math.round(pw('SAFETY TEAM') / 2), dy0 + 26, PAL.N2);
  // Ekiel's empty desk, left, in front of the side wall: its top, its legs, the chair pushed in, the MISC box on it
  fill(b, 62, 128, 110, 6, PAL.G5); fill(b, 62, 128, 110, 1, PAL.G6); fill(b, 66, 134, 4, 50, PAL.G2); fill(b, 166, 134, 4, 40, PAL.G2);
  fill(b, 92, 112, 34, 16, PAL.D3); fill(b, 92, 112, 34, 2, PAL.D4); fill(b, 98, 116, 20, 7, PAL.P2); tiny(b, 'MISC', 100, 117, PAL.N1);
  fill(b, 130, 110, 6, 30, PAL.N2); fill(b, 124, 138, 20, 4, PAL.N2);
  // DOT from behind at the door, her arm up at the plate's screw with the screwdriver (orange cuff)
  if (st.dot !== false) drawDotBack(b, vx + 34, vy + 62);
  void f;
};
export const plateECU = (b: Buf, k: number, screws: number) => dotHandsECU(b, k, screws);
/** [ECU] the MISC box (a plain archive box, its lid off) on Ekiel's empty desk, its label MISC · MAY 17 in marker;
 *  the plate dropped in face up (SUPERALIGNMENT / SAFETY TEAM legible), its four screws beside it. st.drop 0..2 (the
 *  plate falling in, then settled) */
export const boxECU = (b: Buf, f: number, st: {drop?: number}) => {
  vramp(b, 0, 0, 480, RH, [PAL.G3, PAL.G4, PAL.G3]);
  for (let x = 0; x < 480; x += 3) if (hash(x, 1, 5) < 0.3) fill(b, x, 150, 2, 53, PAL.G2);
  // the box from above-front: its inside, then (behind the front face) the plate, then the front face and its label
  fill(b, 100, 26, 280, 100, PAL.D2); fill(b, 100, 26, 280, 3, PAL.D4); fill(b, 106, 32, 268, 92, PAL.D1);
  const d = st.drop ?? 2;
  const py = [6, 30, 44][d], tilt = [4, 2, 0][d];
  const t1 = 'SUPERALIGNMENT', t2 = 'SAFETY TEAM', plW = Math.max(bpw(t1), bpw(t2)) + 24;
  const px = 240 - plW / 2;
  for (let j = 0; j < 62; j++) for (let i = 0; i < plW; i++) { const X = Math.round(px + i), Y = py + j + Math.round((i - plW / 2) * tilt / 60); if (Y < 126) b.set(X, Y, j === 0 ? PAL.G6 : j === 61 || i === plW - 1 ? PAL.G3 : PAL.G5); }
  const ty = py + Math.round(-plW / 2 * tilt / 60);
  bpt(b, t1, 240 - Math.round(bpw(t1) / 2), ty + 12, PAL.N1); bpt(b, t2, 240 - Math.round(bpw(t2) / 2), ty + 34, PAL.N2);
  for (const [hx, hy] of [[px + 8, ty + 6], [px + plW - 10, ty + 6], [px + 8, ty + 54], [px + plW - 10, ty + 54]]) { b.set(Math.round(hx), hy, PAL.N0); b.set(Math.round(hx) + 1, hy, PAL.N0); }
  if (d >= 2) for (let q = 0; q < 4; q++) { const sx = 330 + (q % 2) * 12, sy = 96 + Math.floor(q / 2) * 12; ellipse(sx, sy, 3, 3, b.ink(PAL.G6)); line(sx - 2, sy, sx + 2, sy, b.ink(PAL.G3)); fill(b, sx + 3, sy - 1, 7, 2, PAL.G4); }
  // the front face (it hides the plate's lower edge), the label in marker
  fill(b, 90, 120, 300, 80, PAL.D3); fill(b, 90, 120, 300, 3, PAL.D4); fill(b, 90, 196, 300, 4, PAL.D2);
  fill(b, 200, 132, 140, 52, PAL.P2); fill(b, 200, 132, 140, 1, PAL.W9); fill(b, 339, 132, 1, 52, PAL.P0);
  bpt(b, 'MISC', 270 - Math.round(bpw('MISC') / 2), 140, PAL.N1); bpt(b, 'MAY 17', 270 - Math.round(bpw('MAY 17') / 2), 162, PAL.N1);
  void f;
};
void rect; void poly; void glow; void isSkin; void tiny; void tinyWidth; void holdPhone; void mirror; void roomWalkAt; void TR;
