// MR. MAS — cast: RADNUS (runs ELGOOG), room sprite. New file (v3-art-a, 2026-09-27); cast/rollcall.ts (his roll-call
// flash) and cast/bosses.ts (his rooftop boss) are not edited. Ep1 sc 8 (the code red, on Mas's phone) and sc 9 (the
// lobby TV: the tap-dance and the telescope).
// characters/radnus.md: slim, calm, hands folded; a soft navy sweater over an open light collar; the serene half-smile
// that never changes, even when he is (very slightly) on fire. His roll-call colours (the brown skin ramp, the dark
// hair, the navy sweater, the pale collar). Props: a small fire extinguisher in ELGOOG's skewed primaries (red body, a
// yellow band, a green label, a blue nozzle: deliberately off-brand), the small flame on his sleeve that he pats out
// without looking and that relights (a 4-frame loop), his phone (a chat bubble blinking on it), two GUEST lanyards.
// Caricature by silhouette and one prop, never a portrait likeness. Authored 3/4 facing screen-LEFT (toward the
// founders at the hole); flip for right.
//   radnus / drawRadnus(b, footX, footY, pose, {flip, map, mask})
//   pose.arm: fold (hands folded at the waist) · ext (the extinguisher held at his side, nozzle down) · pat (the far
//             hand pats the flame on his near sleeve, the extinguisher still held) · phone (the phone held up to them,
//             the bubble on it) · lanyards (arm out, two lanyards hanging from his hand) · tap0 | tap1 (the TV's
//             tap-dance: two held drawings, the extinguisher held politely aside, a heel up)
//   pose.fire: the sleeve flame's drawing, 0..3 (the loop: small, tall, flicker, out) or null (no flame)
//   radnusFlameAt(f)   the loop's drawing for a frame: burning 3 drawings on 2s, patted out for 2 frames, relit
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const RADNUS_W = 52;
export const RADNUS_H = 84;
export const RADNUS_FOOT: [number, number] = [26, 82];
export type RadnusArm = 'fold' | 'ext' | 'pat' | 'phone' | 'lanyards' | 'tap0' | 'tap1';
export type RadnusLight = 'room' | 'red' | 'tv';
export interface RadnusPose { arm: RadnusArm; fire: 0 | 1 | 2 | 3 | null; blink: boolean; mouth: 'smile' | 'open'; light: RadnusLight }
export const RADNUS_DEFAULT: RadnusPose = {arm: 'ext', fire: 0, blink: false, mouth: 'smile', light: 'room'};
/** the flame's loop: burning (0, 1, 2 on 2s), patted out (3) for 2 frames, relit; one cycle = 8 frames */
export const radnusFlameAt = (f: number): 0 | 1 | 2 | 3 => ([0, 0, 1, 1, 2, 2, 3, 3] as const)[((f % 8) + 8) % 8];

// the head: 3/4 to screen-left, neat short dark hair, the serene closed half-smile (16 x 17)
const HEAD = [
  '.....hhhhhh.....',
  '...hhHHHHHHhh...',
  '..hHHHHHHHHHHh..',
  '..hHHHhhhHHHHh..',
  '.o44443hhHHHHh..',
  'o444444332hHHh..',
  '.e4e44443322hh..',
  '.444444433322o..',
  '5444444433322o..',
  'o44444443332oo..',
  '.4444444333221..',
  '.o4mmmm4332211..',
  '..o44444332211..',
  '...o44433221o...',
  '....o3322211o...',
  '.....oo1111o....',
  '.......o21o.....',
];
const fig = (p: RadnusPose): FigureDef => {
  const tap = p.arm === 'tap0' || p.arm === 'tap1';
  const bob = p.arm === 'tap1' ? 1 : 0;
  const B = (v: number) => v + bob;
  type Leg = [number, number, number, number, number];
  // [hip x, knee x, knee y, ankle x, ankle y]
  const LN: Leg = p.arm === 'tap0' ? [22, 20, 61, 17, 73] : [22, 22, 62, 22, 76];
  const LF: Leg = p.arm === 'tap1' ? [30, 32, 60, 35, 71] : [30, 30.4, 62, 30.8, 76];
  const leg = (l: Leg, near: boolean, heelUp: boolean): Part[] => {
    const [hip, kx, ky, ax, ay] = l;
    const g = near ? 'legN' : 'legF';
    return [
      {group: g, mat: 'trousers', prims: [seg(hip, B(48), 7.4, kx, B(ky), 5.8), seg(kx, B(ky), 5.6, ax, B(ay) + 1, 4.8), P.ell(kx, B(ky), 2.8, 2.6)]},
      {group: g + 's', mat: 'shoe', prims: [heelUp ? P.poly(ax + 2, B(ay), ax - 2, B(ay), ax - 7, B(ay) + 4, ax - 6, B(ay) + 6, ax + 2, B(ay) + 4) : P.poly(ax + 2.6, B(ay), ax - 2.6, B(ay), ax - 6.6, B(ay) + 3, ax - 6.6, B(ay) + 5, ax + 3, B(ay) + 5)]},
    ];
  };
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'sweater', prims: [P.ell(sx, B(sy), 3.6, 3.8), seg(sx, B(sy), 6.6, ex, B(ey), 5.6), seg(ex, B(ey), 5.4, hx, B(hy), 4.6), P.ell(ex, B(ey), 2.8, 2.8)]});
  // arms: [far elbow, far hand, near elbow, near hand]. The far arm is screen-right (behind), the near one screen-left
  const A: Record<RadnusArm, number[]> = {
    fold: [32, 36, 26, 40, 20, 36, 26, 40],
    ext: [33, 35, 32, 44, 19, 35, 19, 45],
    pat: [30, 32, 22, 38, 19, 35, 19, 45],
    phone: [33, 35, 32, 44, 17, 30, 12, 22],
    lanyards: [33, 35, 32, 44, 14, 30, 6, 30],
    tap0: [35, 32, 42, 28, 17, 34, 12, 38],
    tap1: [35, 32, 42, 28, 17, 34, 12, 38],
  };
  const a = A[p.arm];
  const parts: Part[] = [
    ...leg(LF, false, p.arm === 'tap1'),
    sl('armF', 32, 23, a[0], a[1], a[2], a[3]),
    ...leg(LN, true, p.arm === 'tap0'),
    // the sweater: slim, soft shoulders, the hem at the hip
    {group: 'torso', mat: 'sweater', prims: [P.poly(17, B(21), 22, B(19), 30, B(19), 35, B(22), 35, B(31), 33, B(39), 34, B(49), 18, B(49), 19, B(39), 17, B(31), 16, B(24))]},
    {group: 'collar', mat: 'shirt', prims: [P.poly(21, B(18), 26, B(20), 31, B(18), 30, B(22), 26, B(25), 22, B(22))]},
    {group: 'neck', mat: 'skin', prims: [P.poly(23, B(15), 29, B(15), 29, B(19), 23, B(19))]},
  ];
  parts.push(sl('armN', 20, 23, a[4], a[5], a[6], a[7]));
  const rows = HEAD.slice();
  if (p.blink) rows[6] = '.b4b44443322hh..';
  if (p.mouth === 'open') rows[11] = '.o4mMMm4332211..';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(B(y)) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [{x: 17, y: bob, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  }}];
  if (p.arm === 'fold') stamps.push({x: 22, y: B(38), rows: ['.3443.', '344443', '.2332.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else { stamps.push(hand(a[2], a[3])); stamps.push(hand(a[6], a[7])); }
  // the extinguisher (held in the near hand, or aside in the tap-dance): red body, yellow band, green label, blue nozzle
  const ext = (x: number, y: number): Stamp => ({x, y: B(y), rows: [
    '..nnn..', '.n..n..', '.kkk...', 'kRRRRk.', 'kRyyRk.', 'kRRRRk.', 'kRggRk.', 'kRggRk.', 'kRRRRk.', 'kRRRRk.', 'kRRRrk.', '.kkkk..'],
    pal: {n: ['nozzle', 3], k: ['dark', 0], R: ['ext', 3], r: ['ext', 2], y: ['band', 3], g: ['label', 3]}});
  if (p.arm === 'ext' || p.arm === 'pat') stamps.push(ext(Math.round(a[6]) - 3, Math.round(a[7]) - 2));
  if (tap) stamps.push(ext(Math.round(a[6]) - 5, Math.round(a[7]) - 4));
  if (p.arm === 'phone') stamps.push({x: Math.round(a[6]) - 3, y: B(Math.round(a[7])) - 9, rows: ['kkkkk', 'kPPPk', 'kP.Pk', 'kPPPk', 'kP.Pk', 'kPPPk', 'kkkkk'], pal: {k: ['dark', 0], P: ['bubble', 3]}});
  if (p.arm === 'lanyards') stamps.push({x: Math.round(a[6]) - 2, y: B(Math.round(a[7])) + 1, rows: ['r.r..', 'r.r..', 'r..r.', 'r..r.', 'ww.ww', 'ww.ww', 'ww.ww'], pal: {r: ['strap', 3], w: ['card', 3]}});
  // the flame on his near sleeve (the forearm, just below the elbow): 4 drawings
  if (p.fire !== null && p.fire !== 3 && !tap) {
    const F = [['.Y.', 'YOY', 'ORO'], ['..Y', '.YO', 'YOY', 'ORO'], ['Y..', 'OY.', 'YOY', 'ORO']][p.fire];
    const fx = Math.round((a[4] + a[6]) / 2) - 1, fy = Math.round((a[5] + a[7]) / 2) - F.length;
    stamps.push({x: fx, y: B(fy), rows: F, pal: {Y: ['flame', 5], O: ['flame', 4], R: ['flame', 3]}});
  }
  if (p.fire === 3 && !tap) { const fx = Math.round((a[4] + a[6]) / 2), fy = Math.round((a[5] + a[7]) / 2) - 2; stamps.push({x: fx, y: B(fy), rows: ['s', '.', 's'], pal: {s: ['smoke', 3]}}); }
  return {w: RADNUS_W, h: RADNUS_H, parts, adjust: [{prims: [P.rect(0, 64, RADNUS_W, 20)], add: -1, onlyMat: 'trousers'}, {prims: [P.line(26, 25, 26, 48)], tone: 1, onlyMat: 'sweater'}], stamps};
};
const RLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.N7],
  sweater: [PAL.N0, PAL.N2, PAL.N4, PAL.N5, PAL.N6, PAL.N8],
  shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  trousers: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  ext: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.W6],
  band: [PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9],
  label: [PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3, PAL.L3],
  nozzle: [PAL.N1, PAL.N4, PAL.N6, PAL.N8, PAL.G6, PAL.G6],
  flame: [PAL.R0, PAL.R1, PAL.R2, PAL.W5, PAL.W7, PAL.W9],
  smoke: [PAL.G3, PAL.G3, PAL.G4, PAL.G5, PAL.G5, PAL.G5],
  bubble: [PAL.N1, PAL.C4, PAL.C6, PAL.P2, PAL.P2, PAL.P2],
  strap: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.R3],
  card: [PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.P2, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
// under the siren's sweep: the red gel on every lit rung (his smile stays legible: skin keeps its planes)
const RRED: Record<string, number[]> = {...RLIT, sweater: [PAL.N0, PAL.R0, PAL.N4, PAL.R1, PAL.R2, PAL.R3], shirt: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.W6], skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.R3, PAL.W5]};
const rig = (light: RadnusLight): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1,
  backRamp: {skin: PAL.S3, hair: PAL.N5, sweater: PAL.N6, trousers: PAL.G3, shoe: PAL.D3},
  ramps: light === 'red' ? RRED : RLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  noEdge: ['ext', 'band', 'label', 'nozzle', 'flame', 'smoke', 'bubble', 'strap', 'card', 'shirt'],
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.3, 1 - (y - 48) / 34)),
});
export const radnus = memo((p: RadnusPose) => renderFigure(fig(p), rig(p.light)));
export const drawRadnus = (b: Buf, footX: number, footY: number, p: RadnusPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const fx = o.flip ? RADNUS_W - 1 - RADNUS_FOOT[0] : RADNUS_FOOT[0];
  blitImg(b, radnus(p), footX - fx, footY - RADNUS_FOOT[1], {flip: o.flip, map: o.map, mask: o.mask});
};
