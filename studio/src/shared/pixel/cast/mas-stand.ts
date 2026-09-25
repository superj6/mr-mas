// MR. MAS — cast: MAS MANALT, present-day STANDING / WALKING room sprite (Ep1 act 4; new file, owned by the act-4
// character artist; cast/mas.ts is not edited). mas.ts has him at the desk, in portrait, at 8, at 23 and at 29;
// act 4 also needs him on his feet: walking past Terb and pulling the pin (sc 30, in colour through the freeze),
// walking into the lobby without a lanyard (sc 30), past the vault (sc 31), and the GUEST lanyard on the
// security-camera tile (sc 27). Same design as the desk sprite: the grey hoodie, the forward cowlick, calm level
// eyes. The locked lineup height: 78 px (castrivals v2).
//   masStand / drawMasStand  3/4 facing screen-right (flip for left). legs: stand | w0..w3 (walk, 4 drawings on
//                            3s, 3 px per drawing). arm: down | reach (the near hand forward at pin height) |
//                            pocket (the near hand in the hoodie pocket: pocketing the pin). guest: the lanyard.
//   masWalkAt                the walk as it plays
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const MAS_STAND_W = 44;
export const MAS_STAND_H = 80;
export const MAS_STAND_FOOT: [number, number] = [20, 78];
export type MasStandLegs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3';
export type MasStandArm = 'down' | 'reach' | 'pocket';
export type MasStandLight = 'room' | 'monitor' | 'sil';
export interface MasStandPose { legs: MasStandLegs; arm: MasStandArm; mouth: 'rest' | 'open' | 'smile'; blink: boolean; guest: boolean; light: MasStandLight; }
export const MAS_STAND_DEFAULT: MasStandPose = {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'};
export const masWalkAt = (f: number): MasStandLegs => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];
/** where the near hand is in 'reach' (local, unflipped): the pin's height on a carried extinguisher */
export const MAS_REACH_HAND: [number, number] = [36, 41];

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGSETS: Record<MasStandLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: L(22, 22.4, 59, 22.6, 73), f: L(16.5, 16.4, 59, 16, 73), bob: 0},
  w0: {n: L(22, 25.6, 58, 28.6, 72), f: L(16.5, 13.8, 59, 10.4, 72), bob: 1},
  w1: {n: L(22, 22.6, 59, 22, 73), f: L(16.5, 18.2, 57, 19.2, 69), bob: 0},
  w2: {n: L(22, 18.8, 59, 15.4, 72), f: L(16.5, 20.4, 58, 23.2, 72), bob: 1},
  w3: {n: L(22, 23, 57, 24, 69), f: L(16.5, 16.6, 59, 16.4, 73), bob: 0},
};
const HEAD = [
  '.........JI.....',
  '.....hHHIJI.....',
  '...hHHHIIIHh....',
  '..hHHIIIHHHHh...',
  '.hHHIIHHHHHh4o..',
  '.hHHHHHhh23444o.',
  'hHHHHhh22bb4b4o.',
  'hHHHh2233e44eo..',
  'hHHh22334444444.',
  '.hHh2233444444o5',
  '.hh122334444444o',
  '..h12233444444o.',
  '..o122mmmm444o..',
  '...o1223344o....',
  '....o112233o....',
  '.....oo1122o....',
  '.......o12o.....',
];
const fig = (p: MasStandPose): FigureDef => {
  const Lg = LEGSETS[p.legs];
  const bob = Lg.bob;
  const B = (v: number) => v + bob;
  const leg = (l: Leg, near: boolean): Part[] => {
    const g = near ? 'legN' : 'legF';
    const foot = P.poly(l.ax - 2.6, l.ay, l.ax + 2.6, l.ay, l.ax + 6.4, l.ay + 3, l.ax + 6.4, l.ay + 5, l.ax - 3, l.ay + 5);
    return [
      {group: g, mat: 'jeans', prims: [seg(l.hip, 44, 7, l.kx, l.ky, 5.6), seg(l.kx, l.ky, 5.4, l.ax, l.ay + 1, 4.6), P.ell(l.kx, l.ky, 2.7, 2.5)]},
      {group: g + 's', mat: 'shoe', prims: [foot]},
    ];
  };
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'hood', prims: [P.ell(sx, B(sy), 3.8, 4), seg(sx, B(sy), 7, ex, B(ey), 6.2), seg(ex, B(ey), 6, hx, B(hy), 5.2), P.ell(ex, B(ey), 3, 3)]});
  // arm swing on the walk: the far arm swings opposite the far leg
  const swing = p.legs === 'w0' ? -2 : p.legs === 'w2' ? 2 : 0;
  const far = [14 - swing * 0.5, 32, 14.4 - swing, 41];
  const near = p.arm === 'reach' ? [29, 31, MAS_REACH_HAND[0], MAS_REACH_HAND[1]] : p.arm === 'pocket' ? [27, 33, 23, 38] : [26 + swing * 0.5, 32, 26.4 + swing, 41];
  const parts: Part[] = [
    ...leg(Lg.f, false),
    sl('armF', 15, 22, far[0], far[1], far[2], far[3]),
    ...leg(Lg.n, true),
    // the hoodie: soft shoulders, the hood bunched behind the neck, the kangaroo pocket, the hem over the hips
    {group: 'torso', mat: 'hood', prims: [P.poly(13, B(19), 19, B(17), 25, B(18), 28, B(22), 29, B(30), 28, B(38), 29, B(46), 11, B(46), 11, B(38), 10, B(30), 10, B(23))]},
    {group: 'hoodlump', mat: 'hood', prims: [P.poly(9, B(16), 15, B(14), 18, B(18), 12, B(21))]},
    {group: 'neck', mat: 'skin', prims: [P.poly(18, B(14), 23, B(14), 23, B(18), 18, B(18))]},
    sl('armN', 25, 22, near[0], near[1], near[2], near[3]),
  ];
  const rows = HEAD.slice();
  if (p.blink) rows[7] = 'hHHHh2233b44bo..';
  if (p.mouth === 'open') { rows[12] = '..o122mMMm444o..'; rows[13] = '...o122MM44o....'; }
  if (p.mouth === 'smile') rows[12] = '..o122mmmm4m4o..';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(B(y)) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [
    {x: 11, y: bob, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    }},
    // drawstrings and the pocket seam
    {x: 19, y: B(19), rows: ['d.d', 'd.d', 'd.d', '..d'], pal: {d: ['hood', 5]}},
    {x: 14, y: B(36), rows: ['kkkkkkkkkkk', 'k.........k'], pal: {k: ['hood', 1]}},
    hand(far[2], far[3]),
  ];
  if (p.arm !== 'pocket') stamps.push(hand(near[2], near[3]));
  // the GUEST lanyard: a cord from the neck to a small white card on his chest (unreadable at room scale, on
  // purpose: the security-camera tile's insert can read it)
  if (p.guest) stamps.push({x: 18, y: B(18), rows: ['c...c', '.c.c.', '..c..', '.ppp.', '.pqp.', '.ppp.'], pal: {c: ['cord', 0], p: ['card', 0], q: ['card', 1]}});
  return {w: MAS_STAND_W, h: MAS_STAND_H, parts, adjust: [{prims: [P.rect(0, 60, MAS_STAND_W, 20)], add: -1, onlyMat: 'jeans'}], stamps};
};
const MLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  jeans: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  shoe: [PAL.N1, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.P2],
  cord: [PAL.C4, PAL.C4, PAL.C4, PAL.C4, PAL.C4, PAL.C4],
  card: [PAL.P2, PAL.N3, PAL.P2, PAL.P2, PAL.P2, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
// the desk sprite's monitor light: cyan on the lit side
const MMON: Record<string, number[]> = {...MLIT, skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4], hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.C3, PAL.C6], hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5]};
const MSIL: Record<string, number[]> = Object.fromEntries(Object.keys(MLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const rig = (light: MasStandLight): LightRig => ({
  key: light === 'monitor' ? [-0.9, -0.35] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: light === 'monitor' ? [1, -0.1] : [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, hood: PAL.C6, jeans: PAL.C5, shoe: PAL.C4} : {skin: PAL.K1, hair: PAL.C2, hood: PAL.C2, jeans: PAL.N4, shoe: PAL.G3},
  ramps: light === 'room' ? MLIT : light === 'monitor' ? MMON : MSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
});
export const masStand = memo((p: MasStandPose) => renderFigure(fig(p), rig(p.light)));
export const drawMasStand = (b: Buf, footX: number, footY: number, p: MasStandPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? MAS_STAND_W - 1 - MAS_STAND_FOOT[0] : MAS_STAND_FOOT[0];
  blitImg(b, masStand(p), footX - fx, footY - MAS_STAND_FOOT[1], {flip: o.flip, map: o.map, mask: o.mask, clip: o.clip});
};
