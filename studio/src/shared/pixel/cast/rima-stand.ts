// MR. MAS — cast: RIMA TAMURI, STANDING / WALKING room sprite. New file (v3-art-a, 2026-09-27); cast/rima-speak.ts and
// cast/rollcall.ts are not edited. Her existing art is the roll-call flash, the speaking portrait and the call tile;
// Ep1 Act One needs her on her feet in the bullpen: at the whiteboard with her back to the room (writing LAUNCH:
// LOW-KEY, underlining it a third time, capping the marker), crossing to Mas's desk, arms folded at his shoulder,
// leaning in to peer at the laptop and down the hole in the floor.
// "The Unflappable Founder": poised, the structured jacket that is always perfect (grey, light lapels, over a black
// top), long brown hair with the centre part, dark trousers. Same scale as the lineup (78 px; Mas 78, Tasya 80).
// Authored 3/4 facing screen-RIGHT (flip for left). Never "understudy" framing (guardrails §6).
//   rimaStand / drawRimaStand(b, footX, footY, pose, {flip, map, mask, clip})
//   pose.body: stand · write (her back 3/4 to us, the near arm up at the board with the marker) · underline (the arm
//              out level, drawing the line) · cap (capping the marker at her chest, still facing the board) ·
//              fold (arms folded, facing right) · lean (bent forward from the hips, hands on a desk edge) ·
//              peer (bent further, looking straight down: the hole in the floor) · w0..w3 (the walk, 4 drawings on 3s)
//   pose.head: face (3/4 right) · back (the back of her head: hair only) · down (looking down)
//   pose.light: room (the bullpen's night: tungsten from the hall behind, a cool key) · board (lit from the board
//               she faces: her back in shadow) · sil
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const RIMA_STAND_W = 48;
export const RIMA_STAND_H = 82;
export const RIMA_STAND_FOOT: [number, number] = [20, 80];
export type RimaBody = 'stand' | 'write' | 'underline' | 'cap' | 'fold' | 'lean' | 'peer' | 'w0' | 'w1' | 'w2' | 'w3';
export type RimaHead = 'face' | 'back' | 'down';
export type RimaLight = 'room' | 'board' | 'sil';
export interface RimaStandPose { body: RimaBody; head: RimaHead; mouth: 'rest' | 'open'; blink: boolean; light: RimaLight; }
export const RIMA_STAND_DEFAULT: RimaStandPose = {body: 'stand', head: 'face', mouth: 'rest', blink: false, light: 'room'};
export const rimaWalkAt = (f: number): RimaBody => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];
/** where the marker's tip is in 'write' / 'underline' (local, unflipped): put the ink on the board here */
export const RIMA_MARKER: Record<'write' | 'underline', [number, number]> = {write: [37, 14], underline: [42, 26]};

// the head: 3/4 right, the long hair falling past her shoulders, the centre part (16 x 26: the hair is long)
const HEAD_FACE = [
  '.....hhhhhh.....',
  '...hhHHHhHHhh...',
  '..hHHHHhhHHHHh..',
  '.hHHHhs34444Hh..',
  '.hHHh234444444h.',
  'hHHHh23e44e44h..',
  'hHHh2234444444..',
  'hHHh2233444444o.',
  'hHHh1223344444h.',
  'hHHhh122mmm44h..',
  'hHHHhh1223344h..',
  'hHHHHhh11223hh..',
  'hHHHHHhh1122hH..',
  '.hHHHHHh.11.hHh.',
  '.hHHHHHh.....hh.',
  '..hHHHHh........',
  '..hHHHh.........',
  '...hHHh.........',
];
const HEAD_BACK = [
  '.....hhhhhh.....',
  '...hhHHJJHHhh...',
  '..hHHHJHHJHHHh..',
  '.hHHHJHHHHJHHHh.',
  '.hHHJHHHhHHJHHh.',
  'hHHHJHHHhHHHJHh.',
  'hHHJHHHHhHHHJHh.',
  'hHHJHHHhhHHHHJh.',
  'hHHJHHHhHhHHHJh.',
  'hHHHHHhHHhHHHHh.',
  'hHHHHHhHHHhHHHh.',
  'hHHHHhHHHHhHHHh.',
  'hHHHHhHHHHHhHHh.',
  '.hHHHHHHHHHHHh..',
  '.hHHHHHHHHHHHh..',
  '..hHHHHHHHHHh...',
  '...hHHHHHHHh....',
  '....hhhhhhh.....',
];
const HEAD_DOWN = [
  '................',
  '.....hhhhhh.....',
  '...hhHHHhHHhh...',
  '..hHHHHhhHHHHh..',
  '.hHHHhHHHHHHHh..',
  '.hHHh2hs344444h.',
  'hHHHh2234444444.',
  'hHHh2234e44e44o.',
  'hHHh1223444444h.',
  'hHHhh12233mm4h..',
  'hHHHhh112233hh..',
  'hHHHHhh1122hH...',
  'hHHHHHhh11hHh...',
  '.hHHHHHh...hh...',
  '.hHHHHHh........',
  '..hHHHHh........',
  '..hHHHh.........',
  '...hHHh.........',
];

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGS: Record<string, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: L(22, 22.4, 61, 22.6, 75), f: L(17, 16.8, 61, 16.4, 75), bob: 0},
  w0: {n: L(22, 25.6, 60, 28.6, 74), f: L(17, 14, 61, 10.6, 74), bob: 1},
  w1: {n: L(22, 22.6, 61, 22, 75), f: L(17, 18.4, 59, 19.4, 71), bob: 0},
  w2: {n: L(22, 18.8, 61, 15.4, 74), f: L(17, 20.6, 60, 23.4, 74), bob: 1},
  w3: {n: L(22, 23, 59, 24, 71), f: L(17, 16.8, 61, 16.6, 75), bob: 0},
};

const fig = (p: RimaStandPose): FigureDef => {
  const walk = /^w\d$/.test(p.body);
  const lg = LEGS[walk ? p.body : 'stand'];
  const bob = lg.bob;
  // the bend: 'lean' and 'peer' fold her forward from the hips (the torso and head shift right and down)
  // (a shear about the hips at y 47: every point above them moves right and a little down, more the higher it is)
  const bend = p.body === 'lean' ? 1 : p.body === 'peer' ? 2 : 0;
  const sh = [0, 0.2, 0.42][bend];
  let curY = 0;
  const Y = (y: number) => { curY = y; return y + bob + Math.round(Math.max(0, 47 - y) * sh * sh * 0.9); };
  const T = (x: number, y?: number) => x + Math.max(0, 47 - (y ?? curY)) * sh;
  const leg = (l: Leg, near: boolean): Part[] => {
    const g = near ? 'legN' : 'legF';
    return [
      {group: g, mat: 'trousers', prims: [seg(l.hip, 47, 7, l.kx, l.ky, 5.4), seg(l.kx, l.ky, 5.2, l.ax, l.ay + 1, 4.4), P.ell(l.kx, l.ky, 2.6, 2.4)]},
      {group: g + 's', mat: 'shoe', prims: [P.poly(l.ax - 2.4, l.ay, l.ax + 2.4, l.ay, l.ax + 6, l.ay + 3, l.ax + 6, l.ay + 5, l.ax - 2.6, l.ay + 5)]},
    ];
  };
  const sleeve = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'jacket', prims: [P.ell(sx, sy, 3.4, 3.6), seg(sx, sy, 6, ex, ey, 5.2), seg(ex, ey, 5, hx, hy, 4.2), P.ell(ex, ey, 2.6, 2.6)]});
  // arm targets per body: [far elbow, far hand, near elbow, near hand] (local, before the bend shift)
  const ARMS: Record<string, number[]> = {
    stand: [14, 34, 14.6, 43, 26, 34, 26.4, 43],
    write: [14, 34, 15, 42, 32, 20, 36, 14],
    underline: [14, 34, 15, 42, 33, 28, 41, 26],
    cap: [14, 32, 20, 30, 27, 32, 22, 30],
    fold: [16, 36, 25, 35, 26, 36, 17, 36],
    lean: [16, 38, 22, 46, 28, 38, 32, 46],
    peer: [16, 38, 22, 46, 28, 38, 32, 46],
  };
  const swing = p.body === 'w0' ? -2 : p.body === 'w2' ? 2 : 0;
  const a = walk ? [14 - swing * 0.5, 34, 14.4 - swing, 43, 26 + swing * 0.5, 34, 26.4 + swing, 43] : ARMS[p.body];
  const parts: Part[] = [
    ...leg(lg.f, false),
    // the far arm, behind the torso
    sleeve('armF', T(15, 23), Y(23), T(a[0], a[1]), Y(a[1]), T(a[2], a[3]), Y(a[3])),
    ...leg(lg.n, true),
    // the jacket: structured shoulders, nipped at the waist, the hem over the hips; the black top at the neck
    {group: 'torso', mat: 'jacket', prims: [P.poly(T(12, 20), Y(20), T(18, 18), Y(18), T(25, 18), Y(18), T(29, 21), Y(21), T(29, 29), Y(29), T(27, 36), Y(36), T(28, 48), Y(48), T(12, 48), Y(48), T(13, 36), Y(36), T(11, 29), Y(29), T(11, 22), Y(22))]},
    {group: 'top', mat: 'top', prims: [P.poly(T(18, 18), Y(18), T(24, 18), Y(18), T(22, 25), Y(25), T(20, 25), Y(25))]},
    {group: 'neck', mat: 'skin', prims: [P.poly(T(18, 15), Y(15), T(23, 15), Y(15), T(23, 19), Y(19), T(18, 19), Y(19))]},
  ];
  parts.push(sleeve('armN', T(26, 23), Y(23), T(a[4], a[5]), Y(a[5]), T(a[6], a[7]), Y(a[7])));
  const back = p.head === 'back';
  const rows = (back ? HEAD_BACK : p.head === 'down' ? HEAD_DOWN : HEAD_FACE).slice();
  if (!back && p.blink) rows[p.head === 'down' ? 7 : 5] = rows[p.head === 'down' ? 7 : 5].replace(/e/g, 'b');
  if (!back && p.mouth === 'open') rows[p.head === 'down' ? 9 : 9] = rows[9].replace('mmm', 'mMm');
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [];
  // the lapels (light) over the jacket's front, when we see her front
  if (!back) stamps.push({x: T(17, 18), y: Y(18), rows: ['L.....L', 'LL...LL', '.L...L.', '.LL.LL.', '..L.L..'], pal: {L: ['lapel', 3]}});
  stamps.push({x: Math.round(T(11, 4)), y: Y(bend ? 1 : 0), rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5], s: ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], J: ['hair', 3], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  }});
  if (p.body === 'fold') stamps.push({x: Math.round(T(16, 33)), y: Y(33), rows: ['.3443.', '344443', '.2332.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else if (p.body === 'cap') stamps.push({x: Math.round(T(19, 27)), y: Y(27), rows: ['..kk..', '.3kk4.', '34kk43', '.3223.'], pal: {k: ['marker', 2], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else {
    stamps.push(hand(T(a[2], a[3]), Y(a[3])));
    stamps.push(hand(T(a[6], a[7]), Y(a[7])));
    if (p.body === 'write' || p.body === 'underline') {
      const [mx, my] = RIMA_MARKER[p.body];
      stamps.push({x: Math.round(T(mx, my)) - 2, y: Y(my) - 1, rows: p.body === 'write' ? ['.kr', 'kk.', 'k..'] : ['kkr', '...'], pal: {k: ['marker', 2], r: ['marker', 4]}});
    }
  }
  return {w: RIMA_STAND_W, h: RIMA_STAND_H, parts, adjust: [{prims: [P.rect(0, 64, RIMA_STAND_W, 18)], add: -1, onlyMat: 'trousers'}], stamps};
};
const RLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  jacket: [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  lapel: [PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2],
  top: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  trousers: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G3, PAL.G4],
  marker: [PAL.N0, PAL.N1, PAL.G6, PAL.P2, PAL.R2, PAL.R3],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const RSIL: Record<string, number[]> = Object.fromEntries(Object.keys(RLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const rig = (light: RimaLight): LightRig => ({
  key: light === 'board' ? [0.95, -0.3] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.15], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.W6, hair: PAL.W6, jacket: PAL.W6, trousers: PAL.W5, shoe: PAL.W4}
    : {skin: PAL.S5, hair: PAL.W3, jacket: PAL.W3, lapel: PAL.G6, trousers: PAL.W1, shoe: PAL.W2},
  ramps: light === 'sil' ? RSIL : RLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  noEdge: ['marker', 'lapel'],
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 32)),
});
export const rimaStand = memo((p: RimaStandPose) => renderFigure(fig(p), rig(p.light)));
export const drawRimaStand = (b: Buf, footX: number, footY: number, p: RimaStandPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? RIMA_STAND_W - 1 - RIMA_STAND_FOOT[0] : RIMA_STAND_FOOT[0];
  blitImg(b, rimaStand(p), footX - fx, footY - RIMA_STAND_FOOT[1], {flip: o.flip, map: o.map, mask: o.mask, clip: o.clip});
};
/** the marker tip in frame coords for a sprite drawn at (footX, footY) */
export const rimaMarkerAt = (footX: number, footY: number, body: 'write' | 'underline', flip = false): [number, number] => {
  const [mx, my] = RIMA_MARKER[body];
  const lx = flip ? RIMA_STAND_W - 1 - mx : mx;
  const fx = flip ? RIMA_STAND_W - 1 - RIMA_STAND_FOOT[0] : RIMA_STAND_FOOT[0];
  return [footX - fx + lx, footY - RIMA_STAND_FOOT[1] + my];
};
