// MR. MAS — cast: GERG MOCKBRAN, STANDING / WALKING room sprite (Ep1 act 4; new file, owned by the act-4 character
// artist; cast/gerg.ts is not edited). sc 31: "Gerg walks past the other way, typing, and stops." He carries the
// laptop open in the crook of his far arm and types with the near hand as he walks; the screen's glow is on his
// chin. Same design as gerg.ts: short dark hair, navy tee, total focus.
//   gergStand / drawGergStand  3/4 facing screen-right (flip for left). legs: stand | w0..w3. type: 0 | 1 | 2
//                              (the typing hand's three drawings, gerg.ts gergTypeAt rhythm). look: 'screen' | 'up'
//                              (he stops and reads the sticky note)
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const GERG_STAND_W = 44;
export const GERG_STAND_H = 80;
export const GERG_STAND_FOOT: [number, number] = [20, 78];
export type GergStandLegs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3';
export interface GergStandPose { legs: GergStandLegs; type: 0 | 1 | 2; look: 'screen' | 'up'; mouth: 'rest' | 'open'; light: 'room' | 'sil'; }
export const GERG_STAND_DEFAULT: GergStandPose = {legs: 'stand', type: 0, look: 'screen', mouth: 'rest', light: 'room'};
export const gergWalkAt = (f: number): GergStandLegs => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGSETS: Record<GergStandLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: L(22, 22.4, 59, 22.6, 73), f: L(16.5, 16.4, 59, 16, 73), bob: 0},
  w0: {n: L(22, 25, 58, 27.6, 72), f: L(16.5, 14.2, 59, 11, 72), bob: 1},
  w1: {n: L(22, 22.6, 59, 22, 73), f: L(16.5, 18, 57, 19, 69), bob: 0},
  w2: {n: L(22, 19.2, 59, 16, 72), f: L(16.5, 20, 58, 22.8, 72), bob: 1},
  w3: {n: L(22, 23, 57, 24, 69), f: L(16.5, 16.6, 59, 16.4, 73), bob: 0},
};
// head tipped down toward the screen ('screen') or level ('up')
const HEAD_DOWN = [
  '....ohhhhhhoo...',
  '..ohHHHIIHHhho..',
  '.ohHHIIIIHHHhho.',
  '.hHHHHHHHHHh4o..',
  'ohHHHhhh23444o..',
  'ohHHh2233444444.',
  'oHHh22334bb4bbo.',
  'oHh223344e44eo..',
  '.oh2233444444o5.',
  '.o12233444444o..',
  '..o12233g444o...',
  '..o122mmmgg4o...',
  '...o12233ggo....',
  '....oo1122o.....',
  '......o12o......',
];
const HEAD_UP = [
  '....ohhhhhhoo...',
  '..ohHHHIIHHhho..',
  '.ohHHIIIIHHHhho.',
  '.hHHHHHHHHHh4o..',
  'ohHHHhhh23444o..',
  'ohHHh223bb4bb44.',
  'oHHh2233e44e44o.',
  'oHh223344444444.',
  '.oh22334444444o5',
  '.o122334444444o.',
  '..o12233444444o.',
  '..o122mmmm444o..',
  '...o12233g4o....',
  '....oo112gg.....',
  '......o12o......',
];
const fig = (p: GergStandPose): FigureDef => {
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
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'tee', prims: [P.ell(sx, B(sy), 3.4, 3.6), seg(sx, B(sy), 6, ex, B(ey), 5.2), seg(ex, B(ey), 4.6, hx, B(hy), 4), P.ell(ex, B(ey), 2.6, 2.6)]});
  const tx = [31, 32, 31][p.type], ty = [33, 32, 32][p.type];
  const parts: Part[] = [
    ...leg(Lg.f, false),
    // far arm cradles the laptop under its base, forearm forward
    sl('armF', 15, 22, 16, 31, 28, 35),
    ...leg(Lg.n, true),
    {group: 'torso', mat: 'tee', prims: [P.poly(13, B(19), 19, B(17), 25, B(18), 28, B(22), 28, B(30), 27, B(38), 28, B(45), 12, B(45), 12, B(38), 11, B(30), 11, B(23))]},
    {group: 'neck', mat: 'skin', prims: [P.poly(18, B(13), 23, B(13), 23, B(18), 18, B(18))]},
    sl('armN', 25, 22, 29, 30, tx, ty),
    // the laptop, open: the base level at his chest, the lid rising at its far end, screen toward him (we see the
    // lid's back); drawn after the near arm so the keyboard sits under his typing hand
    {group: 'base', mat: 'lap', prims: [P.poly(22, B(34), 37, B(33), 38, B(35), 23, B(36))]},
    {group: 'lid', mat: 'lap', prims: [P.poly(35, B(22), 37, B(22), 38, B(34), 36, B(34))]},
  ];
  const rows = (p.look === 'up' ? HEAD_UP : HEAD_DOWN).slice();
  if (p.mouth === 'open') { const r = p.look === 'up' ? 11 : 11; rows[r] = rows[r].replace('mmm', 'mMm'); }
  const stamps: Stamp[] = [
    {x: 11, y: bob, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0], g: ['glow', 0],
    }},
    // the typing hand (3 drawings) and the cradling hand under the base
    {x: tx - 1, y: B(ty) - 1, rows: p.type === 1 ? ['.3.', '344', '233'] : ['34.', '344', '.23'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}},
    {x: 27, y: B(35), rows: ['344', '.23'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}},
    // the screen's glow: its inner edge, and a spill on the tee's front toward it
    {x: 34, y: B(23), rows: ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'], pal: {g: ['glow', 0]}},
    {x: 27, y: B(25), rows: ['g.', '.g', 'g.'], pal: {g: ['glowD', 0]}},
  ];
  return {w: GERG_STAND_W, h: GERG_STAND_H, parts, adjust: [{prims: [P.rect(0, 60, GERG_STAND_W, 20)], add: -1, onlyMat: 'jeans'}], stamps};
};
const GLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
  tee: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  jeans: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  shoe: [PAL.N0, PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5],
  lap: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  glow: [PAL.L3, PAL.L3, PAL.L3, PAL.L3, PAL.L3, PAL.L3],
  glowD: [PAL.L1, PAL.L1, PAL.L1, PAL.L1, PAL.L1, PAL.L1],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const GSIL: Record<string, number[]> = Object.fromEntries(Object.keys(GLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
GSIL.glow = GLIT.glow; GSIL.glowD = GLIT.glowD;
const rig = (light: 'room' | 'sil'): LightRig => ({
  key: [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.W5, hair: PAL.W5, tee: PAL.W5, jeans: PAL.W4, shoe: PAL.W3, lap: PAL.W4} : {skin: PAL.W4, hair: PAL.W3, tee: PAL.W3, jeans: PAL.N4, shoe: PAL.N3, lap: PAL.G4},
  ramps: light === 'room' ? GLIT : GSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
});
export const gergStand = memo((p: GergStandPose) => renderFigure(fig(p), rig(p.light)));
export const drawGergStand = (b: Buf, footX: number, footY: number, p: GergStandPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const fx = o.flip ? GERG_STAND_W - 1 - GERG_STAND_FOOT[0] : GERG_STAND_FOOT[0];
  blitImg(b, gergStand(p), footX - fx, footY - GERG_STAND_FOOT[1], {flip: o.flip, map: o.map, mask: o.mask});
};
