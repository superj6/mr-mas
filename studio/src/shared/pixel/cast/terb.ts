// MR. MAS — cast: TERB, "The Fire Marshal of Imploding Boards" (Ep1 act 4; new file, owned by the act-4 artist).
// Calm, capable, faintly bored by catastrophe. Tall, crisp white shirtsleeves, a navy tie; a RED FIRE
// EXTINGUISHER carried like a briefcase; a FIRE MARSHAL'S HELMET that appears only when he enters a burning
// boardroom (helmet: true/false on every drawing, so it can pop on at the door and never before).
// The helmet (redesigned 2026-09-25, medium-tier pass): an unmistakable TRADITIONAL FIREFIGHTER'S HELMET, never a
// cap: black, a tall ribbed crown, a brim short at the brow and long and low at the back, a yellow reflective band,
// a tall cream front shield on a brass holder. No red on the helmet at any scale (the red is the extinguisher's).
// The extinguisher's PIN carries its tamper tag, readable at insert scale: DO NOT REMOVE (Mas pockets it, sc 30).
//   terbPortrait / drawTerbPortrait  portrait (112x136): 6 mouths, 3 lids, eye dart, brows level / ah / flat;
//                                    helmet on/off; the extinguisher's head in the corner; lit by the room's fires
//   terbBust / drawTerbTile          video-call tile (helmet off, an office); drawTerbMini
//   terbRoom / drawTerbRoom          room sprite, ~88 tall, 3/4 facing screen-right: walk (4 drawings), stand
//                                    carrying, spray (with drawSpray), stamp, hand over the term sheet, seated
//   drawExtinguisherInsert           insert: the valve head, the handle, the pin ring and its tag (pin in/out)
//   drawPinTag                       the pin + tag alone (in Mas's fingers, the tag readable)
//   drawTermSheet                    the never-singed term sheet (room + insert scale)
import {Buf, rect, bayer, hash} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, shiftPrim, blitTo, lightPool} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip, bustY} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ============================================================ the pin and its tamper tag (insert scale)
/** The pull pin (a steel ring + shaft) with its yellow tamper tag on a thin seal wire. (x, y) = ring top-left. */
export const drawPinTag = (b: Buf, x: number, y: number, o: {clip?: Clip; noShaft?: boolean} = {}) => {
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  // ring (9 x 9) and shaft
  const RING = ['..ooooo..', '.oGGGGGo.', 'oG.....go', 'oG.....go', 'oG.....go', 'oG.....go', 'og.....go', '.ogggggo.', '..ooooo..'];
  RING.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i] === 'o' ? PAL.N0 : r[i] === 'G' ? PAL.G6 : r[i] === 'g' ? PAL.G4 : undefined; if (c !== undefined) put(x + i, y + j, c); } });
  if (!o.noShaft) for (let i = 0; i < 16; i++) { put(x + 9 + i, y + 3, PAL.G5); put(x + 9 + i, y + 4, PAL.G3); put(x + 9 + i, y + 5, PAL.N0); }
  // the seal wire loops down to the tag
  for (let j = 0; j < 6; j++) put(x + 4 + (j & 1), y + 9 + j, PAL.G5);
  // the tag: yellow card, a punched hole, two lines of type
  const tx = x - 14, ty = y + 15, tw = 44, th = 23;
  for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) {
    const edge = i === 0 || j === 0 || i === tw - 1 || j === th - 1;
    put(tx + i, ty + j, edge ? PAL.W5 : j < 2 ? PAL.W8 : PAL.W7);
  }
  put(tx + 18, ty + 1, PAL.N0); put(tx + 19, ty + 1, PAL.N0);
  const tb = new Buf(tw, th, 0xff00ff);
  text(tb, 'DO NOT', Math.round((tw - textWidth('DO NOT')) / 2), 3, PAL.N0);
  text(tb, 'REMOVE', Math.round((tw - textWidth('REMOVE')) / 2), 13, PAL.N0);
  for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) if (tb.get(i, j) === PAL.N0) put(tx + i, ty + j, PAL.R1);
};
export const PIN_TAG_W = 44, PIN_TAG_H = 38;

/**
 * The extinguisher at insert scale: the red cylinder's shoulder, the steel valve, the fixed carry handle and the
 * squeeze lever above it (both black, pivoting on the valve), the gauge, the hose; with pin = true the pull pin
 * runs through the valve between the lever and the handle, its ring out to the left and the tag hanging below.
 * (x, y) = top-left of a 72 x 64 box.
 */
export const drawExtinguisherInsert = (b0: Buf, x: number, y: number, o: {pin: boolean; clip?: Clip}) => {
  const clip = o.clip ?? (() => true);
  const b = clipped(b0, clip);
  const R = [PAL.R0, PAL.R1, PAL.R2, PAL.R3];
  // cylinder shoulder, lit from the left
  for (let j = 38; j < 64; j++) for (let i = 6; i < 50; i++) {
    const d = Math.hypot((i - 28) / 22, Math.max(0, 48 - j) / 10);
    if (d > 1) continue;
    const u = (i - 6) / 44;
    b.set(x + i, y + j, d > 0.94 ? PAL.N0 : u < 0.12 ? R[1] : u < 0.34 ? R[3] : u < 0.72 ? R[2] : u < 0.9 ? R[1] : R[0]);
  }
  for (let i = 14; i < 20; i++) b.set(x + i, y + 42, PAL.W8);
  // neck collar and the valve body (steel)
  rect(x + 21, y + 33, 14, 6, b.ink(PAL.G4)); rect(x + 21, y + 33, 14, 1, b.ink(PAL.G6)); rect(x + 33, y + 34, 2, 5, b.ink(PAL.G2));
  rect(x + 24, y + 15, 9, 18, b.ink(PAL.G4)); rect(x + 24, y + 15, 2, 18, b.ink(PAL.G6)); rect(x + 31, y + 15, 2, 18, b.ink(PAL.G2));
  rect(x + 23, y + 14, 11, 2, b.ink(PAL.N0));
  // the lever (upper), pivoting on the valve's top, rising a little to the right; the carry handle (lower).
  // Black plastic reads as dark grey with a lit top edge and a black underside (it sits on a dark room).
  for (let i = 0; i < 34; i++) { const yy = y + 13 - Math.floor(i / 9); rect(x + 28 + i, yy, 1, 4, b.ink(PAL.G1)); b.set(x + 28 + i, yy, PAL.G3); b.set(x + 28 + i, yy + 3, PAL.N0); }
  for (let i = 0; i < 32; i++) { rect(x + 30 + i, y + 24, 1, 4, b.ink(PAL.G1)); b.set(x + 30 + i, y + 24, PAL.G3); b.set(x + 30 + i, y + 27, PAL.N0); }
  rect(x + 61, y + 24, 1, 4, b.ink(PAL.N0)); rect(x + 61, y + 9, 1, 4, b.ink(PAL.N0));
  b.set(x + 29, y + 16, PAL.P2); b.set(x + 29, y + 17, PAL.G6);
  // the gauge on the collar's face
  for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (i * i + j * j <= 5) b.set(x + 28 + i, y + 36 + j, i * i + j * j > 2 ? PAL.N0 : PAL.P2);
  b.set(x + 28, y + 35, PAL.L2);
  // the hose: out of the valve's right side, down along the cylinder in whole-pixel steps
  for (let k = 0; k < 10; k++) { rect(x + 33 + k, y + 30, 1, 4, b.ink(PAL.G1)); b.set(x + 33 + k, y + 30, PAL.G2); }
  for (let k = 0; k < 34; k++) { const hx = x + 43 + Math.round(Math.sin(k / 10) * 6); rect(hx, y + 30 + k, 4, 1, b.ink(PAL.G1)); b.set(hx, y + 30 + k, PAL.G2); b.set(hx + 3, y + 30 + k, PAL.N0); }
  if (o.pin) {
    // the pull pin: shaft through the valve between lever and handle, ring out to the left, the tag below
    for (let i = 0; i < 13; i++) { b.set(x + 22 + i, y + 20, PAL.G6); b.set(x + 22 + i, y + 21, PAL.G4); b.set(x + 22 + i, y + 22, PAL.N0); }
    drawPinTag(b0, x + 14, y + 16, {clip, noShaft: true});
  } else {
    // the empty pin hole through the valve
    b.set(x + 27, y + 21, PAL.N0); b.set(x + 28, y + 21, PAL.N0);
  }
};

/** The term sheet: 'room' 6x8, 'lg' 34x44 with a stamp box. Never singed. */
export const drawTermSheet = (b: Buf, x: number, y: number, o: {size?: 'room' | 'lg'; stamped?: boolean; clip?: Clip} = {}) => {
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  if ((o.size ?? 'room') === 'room') {
    for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) put(x + i, y + j, i === 5 || j === 7 ? PAL.P1 : j % 2 === 1 && i > 0 && i < 4 ? PAL.P0 : PAL.P2);
    if (o.stamped) { put(x + 3, y + 5, PAL.R2); put(x + 4, y + 5, PAL.R2); put(x + 3, y + 6, PAL.R2); }
    return;
  }
  const W = 34, H = 44;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) put(x + i, y + j, i === W - 1 || j === H - 1 ? PAL.P1 : PAL.P2);
  const tb = new Buf(W, 12, 0xff00ff);
  text(tb, 'TERMS', Math.round((W - textWidth('TERMS')) / 2), 2, PAL.N1);
  for (let j = 0; j < 12; j++) for (let i = 0; i < W; i++) if (tb.get(i, j) === PAL.N1) put(x + i, y + j, PAL.N1);
  for (let r = 0; r < 6; r++) for (let i = 4; i < W - 4 - (r % 3) * 5; i++) put(x + i, y + 14 + r * 4, PAL.P0);
  if (o.stamped) {
    for (let i = 0; i < 18; i++) { put(x + 12 + i, y + 34, PAL.R2); put(x + 12 + i, y + 41, PAL.R2); }
    for (let j = 34; j < 42; j++) { put(x + 12, y + j, PAL.R2); put(x + 29, y + j, PAL.R2); }
    const sb = new Buf(18, 8, 0xff00ff);
    text(sb, 'OK', 5, 0, PAL.R2);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 18; i++) if (sb.get(i, j) === PAL.R2 && hash(i, j, 4) < 0.85) put(x + 12 + i, y + 35 + j, PAL.R2);
  }
};

// ============================================================ conversation portrait (112 x 136)
export const TERB_PW = 112;
export const TERB_PH = 136;
export type TerbBrow = 'level' | 'ah' | 'flat';
export interface TerbPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  brow: TerbBrow;
  helmet: boolean;
}
export const TERB_PORTRAIT_DEFAULT: TerbPortraitState = {mouth: 'rest', lid: 0, look: -1, brow: 'level', helmet: true};

const portraitFig = (s: TerbPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 74 ? jaw : 0) : v)));
  const parts: Part[] = [
    // crisp white shirt: broad shoulders, a collar standing around the neck; the tie
    {group: 'torso', mat: 'shirt', tone: 2, prims: [P.poly(0, 144, 3, 116, 12, 104, 28, 98, 44, 95, 70, 95, 88, 99, 102, 106, 110, 116, 112, 144)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(49, 78, 49, 98, 58, 101, 67, 97, 67, 74)]},
    {group: 'collarL', mat: 'shirt', tone: 3, prims: [P.poly(44, 95, 50, 92, 56, 101, 52, 108, 42, 100)]},
    {group: 'collarR', mat: 'shirt', tone: 3, prims: [P.poly(68, 92, 74, 95, 72, 101, 62, 108, 60, 101)]},
    {group: 'tie', mat: 'tie', tone: 2, prims: [P.poly(54, 101, 62, 101, 61, 106, 64, 136, 57, 140, 52, 136, 55, 106)]},
    // head: a long, clean-cut face, strong jaw, 3/4 toward camera-left
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 44, 23, 25),
      J(43, 25, 38, 32, 36, 40, 36, 47, 35, 52, 36, 58, 36, 64, 38, 71, 40, 77, 43, 83, 49, 86, 56, 86, 63, 82, 70, 76, 74, 67, 77, 56, 79, 45, 77, 32, 70, 23, 58, 19, 48, 20),
    ]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(72, 49, 76, 46, 80, 48, 81, 56, 78, 64, 73, 65, 71, 59)]},
    // short neat hair (under the helmet only the sides and the nape show)
    {group: 'hair', mat: 'hair', tone: 2, prims: s.helmet
      ? [P.poly(70, 34, 78, 32, 84, 38, 85, 50, 82, 60, 79, 54, 77, 44, 72, 40)]
      : [P.poly(36, 40, 35, 30, 39, 22, 47, 16, 57, 13, 69, 14, 78, 19, 84, 28, 86, 42, 84, 54, 80, 50, 77, 40, 71, 34, 63, 31, 54, 32, 46, 30, 41, 33, 38, 38)]},
  ];
  if (s.helmet) parts.push(
    // THE FIREFIGHTER'S HELMET (redesigned 2026-09-25: it must never read as a cap). A traditional black helmet:
    // a TALL ribbed crown, a brim all the way round that is short over the brow and sweeps long and low behind
    // (the "duckbill" tail over the nape), a yellow REFLECTIVE BAND round the crown's base, and a tall cream
    // FRONT SHIELD standing up off the brow on a brass holder, higher than the crown. No red anywhere on it.
    // brim: the far (back) tail drawn first, then the near lip under the band
    {group: 'hbrim', mat: 'helmet', tone: 1, prims: [P.poly(20, 40, 24, 37, 34, 34, 50, 32, 66, 32, 82, 34, 95, 39, 104, 47, 110, 57, 112, 70, 99, 70, 92, 61, 85, 53, 78, 47, 64, 42, 48, 42, 34, 43, 26, 44, 21, 43)]},
    {group: 'hcrown', mat: 'helmet', tone: 2, prims: [P.poly(35, 37, 35, 26, 38, 16, 45, 8, 55, 3, 66, 2, 76, 5, 84, 12, 88, 22, 89, 33, 88, 39, 64, 37, 46, 37)]},
    {group: 'hband', mat: 'band', tone: 3, prims: [P.poly(35, 32, 46, 31, 64, 31, 80, 32, 89, 33, 89, 38, 80, 37, 64, 36, 46, 36, 35, 37)]},
    {group: 'hshield', mat: 'shield', tone: 3, prims: [P.poly(35, 39, 32, 27, 32, 14, 35, 6, 41, 1, 47, 1, 52, 6, 54, 14, 54, 27, 51, 39)]},
    {group: 'hholder', mat: 'brass', tone: 3, prims: [P.poly(38, 3, 41, -1, 47, -1, 50, 3, 46, 5, 42, 5)]},
  );
  const adjust: Adjust[] = [
    // ---- face: the fires' warm key from camera-left (low), the window's cool back-rim
    plane('skin', 4, P.poly(40, 36, 47, 34, 55, 35, 50, 38, 44, 39, 39, 41), P.poly(44, 47, 46, 47, 43, 58, 41, 60), J(37, 52, 39, 51, 40, 58, 37, 60), J(42, 80, 47, 79, 49, 84, 44, 85)),
    plane('skin', 5, P.line(42, 58, 42, 59), P.line(38, 54, 38, 57)),
    plane('skin', 2, J(62, 33, 68, 36, 70, 44, 70, 56, 70, 66, 66, 75, 60, 81, 56, 83, 60, 73, 63, 62, 63, 50, 61, 40)),
    toMat('skin', 'skinD', 2, J(68, 36, 74, 38, 77, 46, 76, 56, 74, 66, 70, 75, 63, 82, 57, 86, 56, 83, 60, 81, 66, 75, 70, 66, 70, 56, 70, 44)),
    // strong jaw: the plane under the cheekbone, the jaw's lower edge
    plane('skin', 2, J(46, 64, 58, 62, 62, 66, 56, 70)),
    toMat('skin', 'skinD', 2, J(42, 82, 50, 86, 58, 86, 66, 80, 72, 72, 70, 80, 62, 87, 52, 89, 44, 86)),
    plane('skin', 2, P.poly(38, 44, 44, 44, 44, 46, 38, 47), P.poly(49, 44, 62, 43, 64, 46, 50, 47)),
    plane('skin', 2, P.poly(46, 47, 48, 47, 49, 58, 46, 62, 44, 61)),
    toMat('skin', 'skinD', 3, J(48, 54, 52, 56, 52, 61, 47, 63)),
    toMat('skin', 'skinD', 2, J(39, 62, 47, 62, 46, 64, 40, 64)),
    plane('skin', 2, J(40, 75, 50, 75, 49, 77, 41, 77)),
    plane('neck', 0, J(51, 84, 56, 87, 64, 83, 70, 77, 69, 86, 60, 90, 51, 89)),
    toMat('skinD', 'skinD', 1, J(74, 51, 77, 50, 78, 56, 76, 60)),
    // ---- shirt: crisp. The lit shoulder (fires, camera-left), a hard crease down the sleeve, the placket
    plane('shirt', 4, P.poly(5, 116, 12, 105, 26, 99, 38, 97, 30, 104, 18, 112, 9, 124)),
    plane('shirt', 5, P.line(8, 114, 16, 106), P.line(17, 105, 26, 100)),
    plane('shirt', 1, P.poly(84, 100, 100, 107, 108, 118, 110, 144, 96, 144, 90, 120)),
    plane('shirt', 1, P.line(30, 108, 26, 144), P.line(86, 106, 92, 144)),
    plane('shirt', 3, P.line(46, 112, 46, 144)),
    plane('tie', 3, P.poly(55, 101, 58, 101, 57, 106, 56, 130, 54, 134, 55, 106)),
    plane('tie', 1, P.poly(60, 106, 61, 106, 63, 134, 60, 138)),
  ];
  if (s.helmet) adjust.push(
    // crown: glossy black. The fire (camera-left) puts a long warm sheen down its front shoulder; the RIBS (combs)
    // run front to back as lit/dark line pairs; the far side turns into the dark
    plane('helmet', 3, P.poly(55, 5, 64, 3, 58, 8, 53, 16, 50, 28, 48, 28, 50, 15)),
    plane('helmet', 4, P.line(56, 6, 51, 17), P.line(51, 18, 50, 27)),
    plane('helmet', 3, P.line(66, 3, 67, 30), P.line(75, 6, 78, 31), P.line(82, 12, 85, 31)),
    plane('helmet', 1, P.line(67, 3, 68, 30), P.line(76, 6, 79, 31), P.line(83, 12, 86, 31)),
    plane('helmet', 1, P.poly(84, 14, 88, 22, 89, 32, 86, 32, 85, 22)),
    // brim: the long back tail reads as a solid black leaf: its top face catches the room (N4) with a lit edge,
    // its underside and the front brim's underside stay dark; the front lip has a thin lit edge
    plane('helmet', 1, P.poly(26, 41, 34, 40, 48, 39, 64, 39, 80, 41, 84, 43, 64, 41, 48, 41, 34, 42)),
    plane('helmet', 3, P.poly(86, 38, 96, 42, 104, 49, 110, 58, 112, 68, 106, 68, 102, 58, 96, 50, 89, 44, 84, 41)),
    plane('helmet', 4, P.line(89, 39, 97, 43), P.line(98, 44, 105, 52), P.line(24, 38, 33, 35)),
    plane('helmet', 1, P.poly(80, 46, 87, 52, 94, 60, 100, 70, 96, 70, 90, 62, 84, 54, 78, 48)),
    // the reflective band: bright, with a hot line along its top and the far side a rung down
    plane('band', 4, P.poly(36, 32, 46, 31, 58, 31, 58, 33, 46, 33, 36, 34)),
    plane('band', 5, P.line(37, 32, 52, 31)),
    plane('band', 2, P.poly(78, 32, 89, 33, 89, 38, 78, 37)),
    // the shield: a raised border (brass), a cream field, lit on the fire side, the number boss
    plane('shield', 2, P.poly(50, 6, 54, 14, 54, 27, 51, 38, 49, 38, 52, 27, 52, 14, 49, 7)),
    plane('shield', 4, P.poly(34, 26, 34, 14, 36, 8, 38, 9, 36, 15, 36, 26)),
    plane('brass', 4, P.line(40, 1, 46, 0)),
  );
  const L = s.lid;
  const near = L === 2
    ? ['..............', '..............', '..............', '..LLLLLLLLLLL.', '...kkkkkkkkk..']
    : L === 1
      ? ['..............', '...LLLLLLLL...', '.LLLLLLLLLLLL.', 'LwwwiIIIiwww..', '..kkkkkkkkk...']
      : ['...LLLLLLL....', '.LLLLLLLLLLL..', 'LwwiIIIgiwww..', '.wwiIIIIiww...', '..kkkkkkkk....'];
  const far = L === 2 ? ['.......', '.......', '.......', 'LLLLLL.', '.kkkk..'] : L === 1 ? ['.......', '.LLLL..', 'LLLLLL.', 'wiIIw..', '.kkk...'] : ['..LLL..', 'LLLLLL.', 'wiIgw..', 'wiIIw..', '.kkk...'];
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  const B = s.brow;
  const nb = B === 'ah' ? -2 : B === 'flat' ? 1 : 0;
  const nearBrow = B === 'ah' ? ['...bbbbbbbb...', '.bbb......bbb.', 'b.............'] : ['..............', '..bbbbbbbbbbbb', 'bbbb..........'];
  const farBrow = B === 'ah' ? ['..bbb', 'bb...'] : ['.bbbb', 'bb...'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['..............', 'mmmmmmmmmmmm..', '..llllllll....'],
    smile: ['...........m..', 'mmmmmmmmmmm...', '..llllllll....'],
    A: ['..............', 'mmmmmmmmmmmm..', 'mtTTTTTTTTm...', 'mddddddddm....', '.mdggggdm.....', '..mmmmmm......', '...llll.......'],
    E: ['..............', 'mmmmmmmmmmmmm.', 'mtTTTTTTTTTm..', '.mddddddddm...', '..mmmmmmmm....', '...lllll......'],
    O: ['..............', '...mmmmmm.....', '..mddddddm....', '..mddddddm....', '...mmmmmm.....', '....llll......'],
    M: ['..............', 'mmmmmmmmmmmm..', '.MMMMMMMMMM...', '..llllllll....'],
  };
  const stamps: Stamp[] = [
    {x: 49, y: 40 + nb, rows: nearBrow, pal: {b: PAL.B1}},
    {x: 36, y: 41 + (B === 'ah' ? -1 : 0), rows: farBrow, pal: {b: PAL.B1}},
    {x: 49, y: 44, rows: dart(near, s.look * 2), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 37, y: 44, rows: dart(far, s.look), pal: {L: PAL.N0, w: PAL.S4, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 42, y: 61, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 39, y: 70, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.S1, l: PAL.S3, t: PAL.S4, T: PAL.P1, d: PAL.N0, g: PAL.S2}},
    // collar button + tie knot's dimple
    {x: 57, y: 102, rows: ['kk'], pal: {k: PAL.N1}},
  ];
  // the shield's face: an inset brass keyline and one black numeral (a generic company number, no department)
  if (s.helmet) stamps.push(
    {x: 36, y: 9, rows: [
      '...bbbbbbbb...',
      '..b........b..',
      '.b..........b.',
      '.b....kk....b.',
      '.b...kkk....b.',
      '.b..kkkk....b.',
      '.b....kk....b.',
      '.b....kk....b.',
      '.b....kk....b.',
      '.b....kk....b.',
      '.b....kk....b.',
      '.b....kk....b.',
      '.b..kkkkkk..b.',
      '.b..........b.',
      '..b........b..',
      '...b......b...',
      '....bbbbbb....',
    ], pal: {b: PAL.W5, k: PAL.N0}},
  );
  return {w: TERB_PW, h: TERB_PH, parts, adjust, stamps};
};
const PRIG: LightRig = {
  key: [-0.85, -0.2], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'collarL', 'collarR', 'band', 'brass'],
  back: [1, -0.25], backBand: 1,
  backRamp: {skin: PAL.X2, skinD: PAL.X1, hair: PAL.N5, shirt: PAL.N6, helmet: PAL.N6, band: PAL.W6, tie: PAL.N6},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.W8],
    skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
    shirt: [PAL.N3, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.W8],
    tie: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
    // the helmet is BLACK (night ramp, a warm fire sheen on its lit rungs); the band reflective yellow; the shield cream
    helmet: [PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.N6, PAL.W5],
    band: [PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9],
    shield: [PAL.N0, PAL.D3, PAL.P0, PAL.P1, PAL.P2, PAL.W9],
    brass: [PAL.D1, PAL.D3, PAL.W4, PAL.W6, PAL.W7, PAL.W8],
  },
};
export const terbPortrait = memo((s: TerbPortraitState) => renderFigure(portraitFig(s), PRIG));

/** The boardroom behind him, dark; the fires out of frame camera-left warm the wall; a little smoke up top. */
const bgFire = (b0: Buf, x: number, y: number, w: number, h: number, clip: Clip, f: number) => {
  const b = clipped(b0, clip);
  const fl = [0, 1, 0, 2, 1, 0][Math.floor(f / 3) % 6];
  lightPool(b, x, y, w, h, -8 - fl, h * 0.7, w * 0.9, h * 0.8, PAL.N1, [[1, PAL.W0], [0.72, PAL.W1], [0.46, PAL.W2]]);
  // wood panelling: vertical seams
  for (let i = 10; i < w; i += 22) for (let j = 0; j < h; j++) if (b0.get(x + i, y + j) !== PAL.W2) b.set(x + i, y + j, PAL.N0);
  // smoke under the ceiling: a stepped, dithered band that drifts one pixel per 4 frames
  for (let j = 0; j < 16; j++) for (let i = 0; i < w; i++) {
    const n = hash(Math.floor((i + f / 4) / 5), Math.floor(j / 4), 23);
    if (bayer(x + i, y + j) < (1 - j / 16) * 0.55 * (0.6 + n)) b.set(x + i, y + j, j < 6 ? PAL.G1 : PAL.G0);
  }
};
export interface TerbDrawOpts { f?: number; w?: number; h?: number; ox?: number; }
export const drawTerbPortrait = (b: Buf, x: number, y: number, s: TerbPortraitState, o: TerbDrawOpts = {}) => {
  const w = o.w ?? TERB_PW, h = o.h ?? TERB_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgFire(b, x, y, w, h, clip, o.f ?? 0);
  blitTo(b, terbPortrait(s), x - ox, y, {clip});
  // the extinguisher's head rising into the corner, bottom right (he carries it at his side)
  const ex = x - ox + 84, ey = y + 116;
  const put = (X: number, Y: number, c: number) => { if (clip(X, Y)) b.set(X, Y, c); };
  for (let j = 8; j < 30; j++) for (let i = 0; i < 18; i++) { const d = Math.hypot((i - 9) / 9, Math.max(0, 12 - j) / 5); if (d <= 1) put(ex + i, ey + j, i < 3 ? PAL.R3 : i < 11 ? PAL.R2 : i < 15 ? PAL.R1 : PAL.R0); }
  for (let j = 3; j < 8; j++) for (let i = 5; i < 13; i++) put(ex + i, ey + j, j === 3 ? PAL.G6 : PAL.G4);
  for (let i = 2; i < 20; i++) { put(ex + i, ey, PAL.N1); put(ex + i, ey + 1, PAL.N1); }
  put(ex + 8, ey + 2, PAL.G6); put(ex + 9, ey + 2, PAL.W7);
};

// ============================================================ video-call tile (webcam bust, helmet off)
export const TERB_BUST_W = 72, TERB_BUST_H = 80;
export interface TerbBustState { mouth: Viseme; lid: 0 | 1 | 2; helmet: boolean; }
const bustFig = (s: TerbBustState): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'shirt', tone: 2, prims: [P.poly(0, 80, 3, 64, 12, 56, 24, 52, 36, 51, 48, 52, 60, 56, 69, 64, 72, 80)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(30, 40, 30, 54, 36, 57, 42, 54, 42, 40)]},
    {group: 'colL', mat: 'shirt', tone: 3, prims: [P.poly(27, 52, 31, 50, 36, 56, 33, 60, 26, 55)]},
    {group: 'colR', mat: 'shirt', tone: 3, prims: [P.poly(45, 52, 41, 50, 36, 56, 39, 60, 46, 55)]},
    {group: 'tie', mat: 'tie', tone: 2, prims: [P.poly(34, 56, 38, 56, 37, 59, 39, 80, 33, 80, 35, 59)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(22, 20, 23, 12, 28, 8, 36, 7, 44, 8, 49, 12, 50, 20, 50, 32, 48, 40, 43, 46, 36, 48, 29, 46, 24, 40, 22, 32)]},
    {group: 'ears', mat: 'skin', tone: 2, prims: [P.ell(21.5, 27, 2.5, 4), P.ell(50.5, 27, 2.5, 4)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: s.helmet ? [P.poly(21, 22, 22, 16, 24, 20)] : [P.poly(21, 22, 21, 12, 26, 6, 33, 3, 40, 3, 47, 6, 51, 12, 51, 22, 49, 16, 44, 12, 36, 12, 28, 12, 23, 16)]},
  ];
  if (s.helmet) parts.push(
    // the firefighter's helmet seen from the front (webcam): a wide brim drooping at both sides, the tall crown,
    // the yellow band, the cream shield standing up in the middle
    {group: 'hbrim', mat: 'helmet', tone: 1, prims: [P.poly(8, 21, 12, 17, 22, 14, 36, 13, 50, 14, 60, 17, 64, 21, 58, 20, 50, 18, 36, 17, 22, 18, 14, 20)]},
    {group: 'hcrown', mat: 'helmet', tone: 2, prims: [P.poly(21, 15, 21, 8, 25, 3, 31, 1, 41, 1, 47, 3, 51, 8, 51, 15)]},
    {group: 'hband', mat: 'band', tone: 3, prims: [P.poly(21, 12, 51, 12, 51, 15, 21, 15)]},
    {group: 'hshield', mat: 'shield', tone: 3, prims: [P.poly(31, 16, 30, 6, 32, 1, 36, 0, 40, 1, 42, 6, 41, 16)]},
  );
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(25, 16, 31, 13, 39, 13, 45, 16, 39, 17, 31, 17), P.poly(35, 25, 37, 25, 37, 34, 35, 34)),
    plane('skin', 2, P.poly(47, 20, 50, 20, 49, 32, 46, 39, 45, 30), P.poly(28, 42, 36, 46, 44, 42, 40, 47, 32, 47)),
    plane('skin', 2, P.poly(37, 27, 39, 28, 39, 34, 37, 34)),
    plane('neck', 0, P.poly(30, 43, 36, 48, 42, 43, 42, 49, 36, 52, 30, 49)),
    plane('shirt', 4, P.line(3, 64, 12, 57), P.line(12, 56, 22, 53)),
    plane('shirt', 1, P.poly(60, 57, 68, 65, 70, 80, 62, 80, 60, 68)),
    plane('helmet', 4, P.line(23, 8, 27, 4)),
    plane('band', 5, P.line(22, 12, 29, 12)),
    plane('shield', 4, P.line(31, 6, 31, 14)),
  ];
  const eye = s.lid === 2 ? ['.....', '.....', 'LLLLL'] : s.lid === 1 ? ['.....', 'LLLLL', 'wIgw.'] : ['.LLL.', 'LwIgw', '.kkk.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.......', 'mmmmmmm', '.lllll.'], smile: ['......m', 'mmmmmm.', '.lllll.'],
    A: ['mmmmmmm', 'mTTTTTm', 'mdddddm', '.mdddm.', '..lll..'], E: ['mmmmmmm', 'mTTTTTm', '.mdddm.', '..lll..'],
    O: ['..mmm..', '.mdddm.', '.mdddm.', '..mmm..'], M: ['.......', 'mmmmmmm', '.MMMMM.', '.lllll.'],
  };
  const stamps: Stamp[] = [
    {x: 26, y: 21, rows: ['bbbbb...bbbbb'], pal: {b: PAL.B1}},
    {x: 27, y: 23, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 40, y: 23, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 35, y: 34, rows: ['o.o'], pal: {o: PAL.S1}},
    {x: 33, y: 39, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.S1, l: PAL.S3, T: PAL.P1, d: PAL.N0}},

  ];
  if (s.helmet) stamps.push({x: 35, y: 5, rows: ['.k.', 'kk.', '.k.', '.k.', 'kkk'], pal: {k: PAL.N0}});
  return {w: TERB_BUST_W, h: TERB_BUST_H, parts, adjust, stamps};
};
export const terbBust = memo((s: TerbBustState) => renderFigure(bustFig(s), {...PRIG, key: [-0.5, -0.8]}));
export const drawTerbTile = (b0: Buf, x: number, y: number, w: number, h: number, s: TerbBustState) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  // a clean corner office: a pale wall, a window strip, a framed diploma-ish rectangle
  lightPool(b, x, y, w, h, w * 0.3, h * 0.2, w, h, PAL.N3, [[1, PAL.N4], [0.6, PAL.N5]]);
  rect(x + w - 34, y, 34, h, b.ink(PAL.N2));
  for (let j = 0; j < h; j += 6) rect(x + w - 34, y + j, 34, 1, b.ink(PAL.N3));
  rect(x + 10, y + 12, 18, 14, b.ink(PAL.N1)); rect(x + 11, y + 13, 16, 12, b.ink(PAL.P1));
  blitImg(b0, terbBust(s), x + Math.round(w / 2 - TERB_BUST_W / 2), bustY(y, h, TERB_BUST_H), {clip});
};
export const drawTerbMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N4)); rect(x + w - 8, y, 8, h, b.ink(PAL.N2));
  const cx = x + Math.floor(w / 2);
  rect(cx - 9, y + h - 5, 18, 5, b.ink(PAL.G6)); rect(cx - 1, y + h - 5, 2, 5, b.ink(PAL.N3));
  rect(cx - 4, y + 4, 8, 11, b.ink(PAL.S4));
  rect(cx - 4, y + 3, 8, 2, b.ink(PAL.B2));
  b.set(cx - 2, y + 8, PAL.N0); b.set(cx + 1, y + 8, PAL.N0);
  rect(cx - 1, y + 12, 3, 1, b.ink(PAL.S1));
};

// ============================================================ room sprite (~88 tall, 3/4 facing screen-right)
// Legs: 'stand' | walk 'w0'..'w3' (contact, passing, contact, passing: the door-bang entrance at 4 drawings on 3s)
// Arms: 'carry' the extinguisher at his side like a briefcase; 'spray' raised, the horn aimed forward-down
// (drawSpray for the jet); 'stamp' the far hand stamps the table; 'hand' the near arm hands over the term sheet;
// 'none' both arms down (the extinguisher set on the floor by the caller).
export const TERB_W = 48;
export const TERB_H = 92;
export const TERB_FOOT: [number, number] = [22, 90];
export type TerbLegs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3' | 'seat';
export type TerbArm = 'carry' | 'spray' | 'stamp' | 'hand' | 'none';
export type TerbLight = 'room' | 'fire' | 'sil';
export interface TerbRoomPose { legs: TerbLegs; arm: TerbArm; helmet: boolean; mouth: 'rest' | 'open'; blink: boolean; light: TerbLight; pin: boolean; }
export const TERB_ROOM_DEFAULT: TerbRoomPose = {legs: 'stand', arm: 'carry', helmet: true, mouth: 'rest', blink: false, light: 'fire', pin: true};
/** the walk as it plays: 4 drawings on 3s, whole-pixel stride 3 px per drawing (12 px per cycle) */
export const terbWalkAt = (f: number): TerbLegs => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];
/** the extinguisher horn's tip for the spray pose (local, unflipped) */
export const TERB_HORN: [number, number] = [44, 50];

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGSETS: Record<TerbLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: L(25, 25.4, 68, 25.6, 84), f: L(19, 19, 68, 18.6, 84), bob: 0},
  w0: {n: L(25, 29, 67, 32, 83), f: L(19, 16, 68, 12, 83), bob: 1},
  w1: {n: L(25, 25.6, 68, 25, 84), f: L(19, 21, 66, 22, 79), bob: 0},
  w2: {n: L(25, 21, 68, 17, 83), f: L(19, 24, 67, 27, 83), bob: 1},
  w3: {n: L(25, 26, 66, 27, 79), f: L(19, 19, 68, 19, 84), bob: 0},
  // seated: the upper body drops 12 px onto the chair; thighs level at the seat, shins down to the floor
  seat: {n: L(25, 37, 63, 38, 84), f: L(19, 33, 63, 34, 84), bob: 12},
};
const THEAD = [
  '....oohhhhhoo....',
  '..ohhHHHIIIHhho..',
  '.ohHHHIIJJIIHho..',
  '.hHHIIIIIHHHHho..',
  'ohHHIIHHHhh344o..',
  'ohHHHHhh23444444o',
  'oHHHh2233bb44bbo.',
  'oHHh22334e444eo..',
  'oHHh2234444444o5.',
  '.oH12233444444445',
  '.o122233444444o..',
  '..o12233344444o..',
  '..o1122mmm4444o..',
  '...o1223344444o..',
  '....o12233344o...',
  '.....oo12223o....',
  '.......o122o.....',
  '.......o112o.....',
];
// the firefighter's helmet at room scale (he faces screen-right): the tall black crown with a sheen, the yellow
// reflective band, the brim short over the brow and sweeping long and low behind (left), the cream front shield
// standing up at the front, the brim's lip 2 px proud of the brow. Drawn at (head x - 5, head y - 2): the crown's
// top row sits on the canvas's first row at every bob (it used to clip on the bob-0 drawings).
const HELMET = [
  '..........kkkkkk....sss..',
  '........kkHHhhhhkk.sSSSs.',
  '.......kHHhhhhhhhhksSSSs.',
  '......kHHhhhhhhhhhhsSSSs.',
  '......kHhhhhhhhhhhhsSSSs.',
  '......kYYYYYYYYYYYYsSSSs.',
  '......kyyyyyyyyyyyyssss..',
  '...kkBBBBBBBBBBBBBBBBBBBk',
  '..kBbbd...............dk.',
  '.kBbbd...................',
  'kBbbd....................',
  'kbbd.....................',
  'kbd......................',
  'kd.......................',
];
const troomFig = (p: TerbRoomPose): FigureDef => {
  const Lg = LEGSETS[p.legs];
  const bob = Lg.bob;
  const up = (parts: Part[]) => parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, bob))}));
  const leg = (l: Leg, near: boolean): Part[] => {
    const g = near ? 'legN' : 'legF';
    const foot = P.poly(l.ax - 2.6, l.ay, l.ax + 2.8, l.ay, l.ax + 7, l.ay + 3.6, l.ax + 7, l.ay + 6, l.ax - 3, l.ay + 6);
    return [
      {group: g, mat: 'pants', prims: [seg(l.hip, 50 + (p.legs === 'seat' ? bob : 0), 7.6, l.kx, l.ky, 6), seg(l.kx, l.ky, 5.8, l.ax, l.ay + 1, 4.8), P.ell(l.kx, l.ky, 2.9, 2.7)]},
      {group: g + 's', mat: 'shoe', prims: [foot]},
    ];
  };
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part[] => [
    {group: g, mat: 'shirt', prims: [P.ell(sx, sy, 3.8, 4), seg(sx, sy, 6.8, ex, ey, 5.8), seg(ex, ey, 5.4, hx, hy, 4.4), P.ell(ex, ey, 2.8, 2.8)]},
  ];
  const ARM: Record<TerbArm, {n: number[]; f: number[]}> = {
    carry: {n: [29, 38, 30, 48], f: [17, 38, 17, 47]},
    spray: {n: [33, 37, 38, 42], f: [22, 38, 33, 45]},
    stamp: {n: [29, 38, 30, 48], f: [22, 39, 34, 46]},
    hand: {n: [34, 36, 41, 36], f: [17, 38, 17, 47]},
    none: {n: [29, 38, 29.4, 48], f: [17, 38, 17, 47]},
  };
  const A = ARM[p.arm];
  const parts: Part[] = [
    ...leg(Lg.f, false),
    ...up(sl('armF', 17, 27, A.f[0], A.f[1], A.f[2], A.f[3])),
    ...leg(Lg.n, true),
    ...up([
      // the shirt: broad, tucked in; belt; the tie down the front
      {group: 'torso', mat: 'shirt', prims: [P.poly(16, 23, 23, 21, 29, 22, 33, 27, 33, 38, 32, 46, 32, 51, 14, 51, 14, 44, 13, 36, 13, 27)]},
      {group: 'belt', mat: 'pants', prims: [P.rect(14, 49, 18, 3)]},
      {group: 'neck', mat: 'skin', prims: [P.poly(21, 17, 26, 17, 26, 22, 21, 22)]},
      {group: 'tie', mat: 'tie', prims: [P.poly(24, 22, 26, 22, 27, 36, 25, 38, 23, 36)]},
    ]),
    ...up(sl('armN', 29, 27, A.n[0], A.n[1], A.n[2], A.n[3])),
  ];
  const rows = THEAD.slice();
  if (p.blink) rows[7] = 'oHHh22334b444bo..';
  if (p.mouth === 'open') { rows[12] = '..o1122mMm4444o..'; rows[13] = '...o122MM3444o...'; }
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1 + bob, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [
    {x: 13, y: bob + 2, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    }},
  ];
  if (p.helmet) stamps.push({x: 8, y: bob, rows: HELMET, pal: {k: ['helmet', 0], h: ['helmet', 2], H: ['helmet', 4], B: ['helmet', 4], b: ['helmet', 3], d: ['helmet', 1], Y: ['band', 4], y: ['band', 3], s: ['shield', 3], S: ['shield', 4]}});
  // the extinguisher: carried like a briefcase in the far hand at his side, or raised to spray
  const EXT = ['.kkk..', 'kGGGk.', '.oRo..', 'oRRRo.', 'oRRRRo', 'oRRRRo', 'oRRRRo', 'oRRRro', 'oRRRro', 'oRRRro', 'oRRrro', 'oRRrro', 'oRRrro', '.oooo.'];
  const extPal = {k: ['ext', 0], G: ['ext', 5], o: ['ext', 1], R: ['ext', 3], r: ['ext', 2], p: ['ext', 5]} as Stamp['pal'];
  if (p.arm === 'carry' || p.arm === 'hand') {
    stamps.push({x: Math.round(A.f[2]) - 3, y: Math.round(A.f[3]) + bob, rows: EXT, pal: extPal});
    if (p.pin) stamps.push({x: Math.round(A.f[2]) + 1, y: Math.round(A.f[3]) + bob, rows: ['p', 'y'], pal: {p: ['ext', 5], y: ['tag', 0]}});
  }
  if (p.arm === 'spray') {
    // held across the body: the cylinder in the far hand, the hose to the horn in the near hand
    stamps.push({x: 29, y: 44 + bob, rows: EXT, pal: extPal});
    stamps.push({x: 34, y: 43 + bob, rows: ['.kk.......', 'k..kkk....', '......kkK.', '........KK'], pal: {k: ['ext', 0], K: ['ext', 4]}});
  }
  if (p.arm === 'hand') stamps.push({x: 41, y: 31 + bob, rows: ['PPPPPp', 'PpppPp', 'PPPPPp', 'PpppPp', 'PPPPPp', 'PPPPPp', 'pppppp'], pal: {P: ['paper', 2], p: ['paper', 1]}});
  if (p.arm === 'stamp') stamps.push({x: 32, y: 40 + bob, rows: ['.kk.', '.kk.', 'kkkk', 'rrrr'], pal: {k: ['dark', 0], r: ['ext', 3]}});
  stamps.push(hand(A.f[2], A.f[3]), hand(A.n[2], A.n[3]));
  return {
    w: TERB_W, h: TERB_H, parts,
    adjust: [
      // shirt crease + placket; sleeves' crisp fold; trousers darker toward the floor
      {prims: [P.line(21, 26, 21, 50)], tone: 3, onlyMat: 'shirt'},
      {prims: [P.rect(0, 70, TERB_W, 22)], add: -1, onlyMat: 'pants'},
    ],
    stamps,
  };
};
const RLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
  shirt: [PAL.N3, PAL.G4, PAL.G5, PAL.G6, PAL.P2, PAL.P2],
  tie: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3],
  helmet: [PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.N6, PAL.W5],
  band: [PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9],
  shield: [PAL.N0, PAL.D3, PAL.P0, PAL.P1, PAL.P2, PAL.W9],
  ext: [PAL.N1, PAL.R0, PAL.R1, PAL.R2, PAL.G1, PAL.G6],
  tag: [PAL.W7, PAL.W7, PAL.W7, PAL.W7, PAL.W7, PAL.W7],
  paper: [PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.P2, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const RFIRE = {...RLIT, shirt: [PAL.N3, PAL.G4, PAL.G5, PAL.W6, PAL.W8, PAL.W9], skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.W8], ext: [PAL.N1, PAL.R0, PAL.R2, PAL.R3, PAL.G1, PAL.W8]};
const RSIL: Record<string, number[]> = Object.fromEntries(Object.keys(RLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
RSIL.helmet = [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1];
const troomRig = (light: TerbLight): LightRig => ({
  key: light === 'fire' ? [-0.8, 0.3] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: light === 'fire' ? [1, -0.3] : [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.W6, hair: PAL.W6, shirt: PAL.W6, pants: PAL.W4, shoe: PAL.W3, tie: PAL.W4, helmet: PAL.W6} : {skin: PAL.X2, hair: PAL.N5, shirt: PAL.N7, pants: PAL.N4, shoe: PAL.N3, tie: PAL.N5, helmet: PAL.N6},
  ramps: light === 'room' ? RLIT : light === 'fire' ? RFIRE : RSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 52 ? 1 : Math.max(0.3, 1 - (y - 52) / 36)),
});
export const terbRoom = memo((p: TerbRoomPose) => renderFigure(troomFig(p), troomRig(p.light)));
/** Draw with the feet on (footX, footY). flip = face screen-left. */
export const drawTerbRoom = (b: Buf, footX: number, footY: number, p: TerbRoomPose, opts: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const fx = opts.flip ? TERB_W - 1 - TERB_FOOT[0] : TERB_FOOT[0];
  blitImg(b, terbRoom(p), footX - fx, footY - TERB_FOOT[1], {flip: opts.flip, map: opts.map, mask: opts.mask});
};
/**
 * The jet from the horn (frame coords of the tip, facing +1 right / -1 left): a cone of whole-pixel puffs that
 * lengthens over 4 frames and then holds, boiling on 2s. Powder white/grey; it only works because the pin is out.
 */
export const drawSpray = (b: Buf, tipX: number, tipY: number, dir: 1 | -1, k: number, o: {len?: number; drop?: number} = {}) => {
  const len = Math.min(o.len ?? 40, 6 + k * 9);
  const drop = o.drop ?? 0.35;
  const g = Math.floor(k / 2);
  for (let i = 0; i < len; i++) {
    const spread = 1 + i * 0.28;
    const cy = tipY + i * drop;
    for (let j = -Math.ceil(spread); j <= Math.ceil(spread); j++) {
      const n = hash(i * 3 + g * 7, j + 20, 61);
      const edge = Math.abs(j) / spread;
      if (edge > 1 || n < edge * 0.9) continue;
      const c = i < 4 ? PAL.P2 : edge < 0.4 && n > 0.4 ? PAL.P2 : n > 0.5 ? PAL.P1 : PAL.G5;
      b.set(tipX + dir * i, Math.round(cy + j), c);
    }
  }
};
