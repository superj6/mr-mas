// MR. MAS — cast: GERG MOCKBRAN, extra room-sprite poses (v3-art-a, 2026-09-27). New file; cast/gerg-stand.ts is not
// edited. This holds a COPY of gerg-stand.ts's rig (its head drawings, ramps and proportions: the fig isn't exported,
// the precedent is act 4's terb-sheet.ts); keep the two in step if Gerg's standing drawing changes. Same design:
// short dark hair, the navy tee, the laptop always open in the crook of his arm, his screen's green on his chin.
//   drawGergPose(b, footX, footY, pose, {flip})   3/4 facing screen-right (flip for left)
//   pose.body: tug (sc 9: leaning back, the near hand pinching the check's corner, still holding the laptop) ·
//              sit (sc 9 weeks on: sitting on the check's edge, the laptop open on his knees, typing) ·
//              sitShut (the same, the lid closed: sc 9's last beat, the first half of the match cut; its lid is at
//              GERG_LID.sitShut) · armsUp (sc 6: both arms up, the counter's run: the laptop left on the desk)
//   GERG_LID     where his laptop's lid is in the sit poses (local, unflipped): the match cut lines up on it
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const GERG_POSE_W = 50, GERG_POSE_H = 80;
export const GERG_POSE_FOOT: [number, number] = [20, 78];
export type GergBody = 'tug' | 'sit' | 'sitShut' | 'armsUp';
export interface GergPoseState { body: GergBody; type: 0 | 1 | 2; look: 'screen' | 'up'; mouth: 'rest' | 'open' }
export const GERG_POSE_DEFAULT: GergPoseState = {body: 'sit', type: 0, look: 'screen', mouth: 'rest'};
/** the laptop lid's top edge in the sit poses (local, unflipped): [x0, y, x1] */
export const GERG_LID = {sit: [30, 41, 34] as [number, number, number], sitShut: [24, 51, 38] as [number, number, number]};

// gerg-stand.ts's head drawings (a copy)
const HEAD_DOWN = [
  '....ohhhhhhoo...', '..ohHHHIIHHhho..', '.ohHHIIIIHHHhho.', '.hHHHHHHHHHh4o..', 'ohHHHhhh23444o..', 'ohHHh2233444444.', 'oHHh22334bb4bbo.', 'oHh223344e44eo..',
  '.oh2233444444o5.', '.o12233444444o..', '..o12233g444o...', '..o122mmmgg4o...', '...o12233ggo....', '....oo1122o.....', '......o12o......',
];
const HEAD_UP = [
  '....ohhhhhhoo...', '..ohHHHIIHHhho..', '.ohHHIIIIHHHhho.', '.hHHHHHHHHHh4o..', 'ohHHHhhh23444o..', 'ohHHh223bb4bb44.', 'oHHh2233e44e44o.', 'oHh223344444444.',
  '.oh22334444444o5', '.o122334444444o.', '..o12233444444o.', '..o122mmmm444o..', '...o12233g4o....', '....oo112gg.....', '......o12o......',
];
const fig = (p: GergPoseState): FigureDef => {
  const sitting = p.body === 'sit' || p.body === 'sitShut';
  // sitting: everything above the hips drops 14 px (his seat is the check on the floor, knee-high)
  const dy = sitting ? 14 : 0;
  const lean = p.body === 'tug' ? 1 : 0;
  const T = (x: number, y: number) => x - (p.body === 'tug' ? Math.max(0, 44 - y) * 0.12 : 0);
  const Y = (y: number) => y + dy;
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'tee', prims: [P.ell(T(sx, sy), Y(sy), 3.4, 3.6), seg(T(sx, sy), Y(sy), 6, T(ex, ey), Y(ey), 5.2), seg(T(ex, ey), Y(ey), 4.6, T(hx, hy), Y(hy), 4), P.ell(T(ex, ey), Y(ey), 2.6, 2.6)]});
  const parts: Part[] = [];
  const leg = (g: string, pts: number[]) => {
    const [hx, hy, kx, ky, ax, ay] = pts;
    parts.push({group: g, mat: 'jeans', prims: [seg(hx, hy, 7, kx, ky, 5.6), seg(kx, ky, 5.4, ax, ay + 1, 4.6), P.ell(kx, ky, 2.7, 2.5)]});
    parts.push({group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.6, ay, ax + 2.6, ay, ax + 6.4, ay + 3, ax + 6.4, ay + 5, ax - 3, ay + 5)]});
  };
  if (sitting) { leg('legF', [16, 58, 28, 60, 29, 73]); leg('legN', [22, 58, 33, 59, 34, 73]); }
  else if (p.body === 'tug') { leg('legF', [16.5, 44, 12, 59, 8, 73]); leg('legN', [22, 44, 25, 58, 29, 73]); }
  else { leg('legF', [16.5, 44, 16.4, 59, 16, 73]); leg('legN', [22, 44, 22.4, 59, 22.6, 73]); }
  // the far arm: cradling the laptop (tug), on the laptop's lid (sit), or up
  if (p.body === 'armsUp') parts.push(sl('armF', 15, 22, 11, 12, 13, 2));
  else if (sitting) parts.push(sl('armF', 15, 22, 17, 32, 28, 38));
  else parts.push(sl('armF', 15, 22, 16, 31, 28, 35));
  parts.push({group: 'torso', mat: 'tee', prims: [P.poly(T(13, 19), Y(19), T(19, 17), Y(17), T(25, 18), Y(18), T(28, 22), Y(22), T(28, 30), Y(30), T(27, 38), Y(38), T(28, 45), Y(45), T(12, 45), Y(45), T(12, 38), Y(38), T(11, 30), Y(30), T(11, 23), Y(23))]});
  parts.push({group: 'neck', mat: 'skin', prims: [P.poly(T(18, 13), Y(13), T(23, 13), Y(13), T(23, 18), Y(18), T(18, 18), Y(18))]});
  // the near arm: pinching the check's corner forward-low (tug), typing (sit), up (armsUp)
  const near = p.body === 'tug' ? [30, 32, 40, 38] : p.body === 'armsUp' ? [30, 12, 29, 2] : sitting ? [28, 32, [31, 32, 31][p.type], [36, 35, 35][p.type]] : [29, 30, 31, 33];
  parts.push(sl('armN', 25, 22, near[0], near[1], near[2], near[3]));
  // the laptop: cradled open at his chest (tug) · open on his knees (sit: the lid up, its back toward us) · closed
  if (p.body === 'tug') { parts.push({group: 'base', mat: 'lap', prims: [P.poly(T(22, 34), Y(34), T(37, 33), Y(33), T(38, 35), Y(35), T(23, 36), Y(36))]}); parts.push({group: 'lid', mat: 'lap', prims: [P.poly(T(35, 22), Y(22), T(37, 22), Y(22), T(38, 34), Y(34), T(36, 34), Y(34))]}); }
  if (p.body === 'sit') { parts.push({group: 'base', mat: 'lap', prims: [P.poly(24, 53, 38, 52, 39, 54, 25, 55)]}); parts.push({group: 'lid', mat: 'lap', prims: [P.poly(30, 41, 34, 41, 38, 53, 34, 53)]}); }
  if (p.body === 'sitShut') parts.push({group: 'base', mat: 'lap', prims: [P.poly(24, 51, 38, 51, 39, 54, 25, 54)]});
  const rows = (p.look === 'up' || p.body === 'armsUp' ? HEAD_UP : HEAD_DOWN).slice();
  if (p.mouth === 'open' || p.body === 'armsUp') rows[11] = rows[11].replace('mmm', 'mMm');
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [{x: Math.round(T(11, 6)), y: dy, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0], g: ['glow', 0],
  }}];
  stamps.push(hand(T(near[2], near[3]), Y(near[3])));
  if (p.body === 'armsUp') stamps.push(hand(T(13, 2), Y(2)));
  else if (sitting) stamps.push(hand(28, 38 + dy));
  else stamps.push(hand(T(28, 35), Y(35)));
  // the screen's green on the lid's inner edge and his chin (open laptops only)
  if (p.body === 'sit') stamps.push({x: 33, y: 42, rows: ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'], pal: {g: ['glow', 0]}});
  if (p.body === 'tug') stamps.push({x: Math.round(T(34, 23)), y: 23, rows: ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'], pal: {g: ['glow', 0]}});
  void lean;
  return {w: GERG_POSE_W, h: GERG_POSE_H, parts, adjust: [{prims: [P.rect(0, 60, GERG_POSE_W, 20)], add: -1, onlyMat: 'jeans'}], stamps};
};
const GLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
  tee: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  jeans: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  shoe: [PAL.N0, PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5],
  lap: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  glow: [PAL.L3, PAL.L3, PAL.L3, PAL.L3, PAL.L3, PAL.L3],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const rig: LightRig = {
  key: [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: {skin: PAL.W4, hair: PAL.W3, tee: PAL.W3, jeans: PAL.N4, shoe: PAL.N3, lap: PAL.G4},
  ramps: GLIT, noEdge: ['glow'],
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
};
export const gergPose = memo((p: GergPoseState) => renderFigure(fig(p), rig));
export const drawGergPose = (b: Buf, footX: number, footY: number, p: Partial<GergPoseState>, o: {flip?: boolean; map?: (c: number) => number} = {}) => {
  const fx = o.flip ? GERG_POSE_W - 1 - GERG_POSE_FOOT[0] : GERG_POSE_FOOT[0];
  blitImg(b, gergPose({...GERG_POSE_DEFAULT, ...p}), footX - fx, footY - GERG_POSE_FOOT[1], {flip: o.flip, map: o.map});
};
