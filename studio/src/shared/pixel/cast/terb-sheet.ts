// MR. MAS — cast: TERB READING THE SHEET at room scale (CAST-TERB-SHEET; Ep1 Act Four v5 art pass; new file, owned by
// the v5 art pass). S7.07 (+ its continuation) and S7.09, THE CALM-OFF held through the terms (31 s): Terb in depth at
// the head of the table between Mas and Mada, "a single sheet in his hand", reading it once "so nobody's surprised",
// looking to Mada, spraying the chair fire between sentences (the pin is out, so it works), talking with rest/open
// mouths. terb.ts's room rig has no sheet arm and isn't exported, so its room figure (troomFig, LEGSETS, THEAD,
// HELMET, the ramps and the rig) is COPIED here verbatim from cast/terb.ts (2026-09-26), with two new arms and a
// reading state; the original is untouched and v4 still draws with it.
//   arms  'sheet'       the near hand holds the sheet up at his chest, the far hand carries the extinguisher
//         'sheetSpray'  both hands on the extinguisher (spraying), the sheet tucked under the near arm
//         + every terb.ts arm ('carry' 'spray' 'stamp' 'hand' 'none')
//   read  true = his eyes lowered to the sheet (the lids' drawing); false = looking up, toward Mada (he faces
//         screen-right unflipped: in drawCalmOff2S Mada is right)
//   drawTerbSheetRoom(b, footX, footY, pose, {flip, map})   feet on (footX, footY), as drawTerbRoom
//   TERB_SHEET_HORN   the horn tip in 'sheetSpray' (local, unflipped) for drawSpray
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, shiftPrim} from './kit';
import {TERB_W, TERB_H, TERB_FOOT, TerbLegs, TerbLight, TERB_HORN} from './terb';

export type TerbSheetArm = 'carry' | 'spray' | 'stamp' | 'hand' | 'none' | 'sheet' | 'sheetSpray';
export interface TerbSheetPose { legs: TerbLegs; arm: TerbSheetArm; helmet: boolean; mouth: 'rest' | 'open'; blink: boolean; read: boolean; light: TerbLight; pin: boolean; }
export const TERB_SHEET_DEFAULT: TerbSheetPose = {legs: 'stand', arm: 'sheet', helmet: true, mouth: 'rest', blink: false, read: true, light: 'fire', pin: false};
export const TERB_SHEET_HORN = TERB_HORN;

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
const troomFig = (p: TerbSheetPose): FigureDef => {
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
  const ARM: Record<TerbSheetArm, {n: number[]; f: number[]}> = {
    // v5 (the calm-off's reading): the near hand holds the single sheet up at his chest, the far hand carries the
    // extinguisher at his side; 'sheetSpray' sprays with both hands, the sheet tucked under the near arm
    sheet: {n: [31, 40, 34, 34], f: [17, 38, 17, 47]},
    sheetSpray: {n: [33, 37, 38, 42], f: [22, 38, 33, 45]},
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
  if (p.blink || p.read) rows[7] = 'oHHh22334b444bo..';
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
  if (p.arm === 'carry' || p.arm === 'hand' || p.arm === 'sheet') {
    stamps.push({x: Math.round(A.f[2]) - 3, y: Math.round(A.f[3]) + bob, rows: EXT, pal: extPal});
    if (p.pin) stamps.push({x: Math.round(A.f[2]) + 1, y: Math.round(A.f[3]) + bob, rows: ['p', 'y'], pal: {p: ['ext', 5], y: ['tag', 0]}});
  }
  if (p.arm === 'spray' || p.arm === 'sheetSpray') {
    // held across the body: the cylinder in the far hand, the hose to the horn in the near hand
    stamps.push({x: 29, y: 44 + bob, rows: EXT, pal: extPal});
    stamps.push({x: 34, y: 43 + bob, rows: ['.kk.......', 'k..kkk....', '......kkK.', '........KK'], pal: {k: ['ext', 0], K: ['ext', 4]}});
  }
  // v5: the sheet. Held up at the chest in the near hand (he reads down to it), or tucked under the near arm
  if (p.arm === 'sheet') stamps.push({x: 31, y: 26 + bob, rows: ['PPPPPPp', 'PpppPPp', 'PPPPPPp', 'PpppPpp', 'PPPPPPp', 'PpppPPp', 'PPPPPPp', 'ppppppp'], pal: {P: ['paper', 2], p: ['paper', 1]}});
  if (p.arm === 'sheetSpray') stamps.push({x: 26, y: 30 + bob, rows: ['PPPPp', 'PPPPp', 'ppppp'], pal: {P: ['paper', 2], p: ['paper', 1]}});
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
export const terbSheetRoom = memo((p: TerbSheetPose) => renderFigure(troomFig(p), troomRig(p.light)));
/** Draw with the feet on (footX, footY). flip = face screen-left. */
export const drawTerbSheetRoom = (b: Buf, footX: number, footY: number, p: TerbSheetPose, opts: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const fx = opts.flip ? TERB_W - 1 - TERB_FOOT[0] : TERB_FOOT[0];
  blitImg(b, terbSheetRoom(p), footX - fx, footY - TERB_FOOT[1], {flip: opts.flip, map: opts.map, mask: opts.mask});
};
