// MR. MAS — cast: RIMA at the whiteboard, her BACK to us, at the MEDIUM panorama's scale (twice her room sprite).
// New file (v3-art-a, v3.1 round, 2026-09-27). Draft 7's 5.07 (the board seed): in the two-shot of Mas and Gerg,
// behind Gerg, Rima underlines LOW-KEY a third time, caps the marker, and asks the room, without turning round, "Did
// anyone tell the rest of the board?" So she stands at the board in the 2S (rooms/bullpen-launch.ts drawLaunch2S
// st.rima), seen from behind: the long brown hair, the structured grey jacket, her right arm doing the work.
// Her room sprite's materials and light rig (cast/rima-stand.ts), new geometry at this size (never a scaled sprite).
//   rimaBoard / drawRimaBoard(b, x, y, pose)   112 x 150, top-left (x, y); pose.body:
//     write (her right hand up at the board, the marker on it) · underline (the arm out level: the line) · cap0 (the
//     marker held up by her right shoulder, her left hand bringing the cap to it) · cap1 (capped: the cap on, her left
//     hand dropping) · lower (the capped marker at her side)
//   rimaBoardTip(pose)   where the marker's tip is (local), so a layout can put the ink under it; RIMA_BOARD_LINE0
//                        where the underline starts (her anchor: she stays put, her arm does the line)
import {Buf} from '../px';
import {FigureDef, P, Part, Img, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';
import {rimaStandRig} from './rima-stand';

export const RIMA_BOARD_W = 112, RIMA_BOARD_H = 150;
export type RimaBoardBody = 'write' | 'underline' | 'cap0' | 'cap1' | 'lower';
export interface RimaBoardPose {
  body: RimaBoardBody;
  /** underline: how far along the line her hand has drawn (0 the line's start, by her shoulder · 1 its end, arm out) */
  reach?: number;
}
// arm targets per body: [elbow x, y, hand x, y] for the right (frame-right) and the left arm
const armsFor = (p: RimaBoardPose): {r: number[]; l: number[]} => {
  const u = Math.max(0, Math.min(1, p.reach ?? 1));
  switch (p.body) {
    case 'write': return {r: [80, 44, 84, 26], l: [26, 74, 28, 96]};
    case 'underline': return {r: [76 + Math.round(u * 12), 60 - Math.round(u * 4), 70 + Math.round(u * 42), 54], l: [26, 74, 28, 96]};
    case 'cap0': return {r: [82, 62, 82, 42], l: [64, 70, 76, 50]};
    case 'cap1': return {r: [82, 62, 82, 46], l: [30, 76, 32, 98]};
    default: return {r: [76, 78, 76, 100], l: [26, 76, 28, 98]};
  }
};
/** the marker's tip (local) for a pose; for the cap poses, its capped end */
export const rimaBoardTip = (p: RimaBoardPose): [number, number] => {
  const A = armsFor(p);
  if (p.body === 'write') return [86, 22];
  if (p.body === 'underline') return [A.r[2] + 4, 53];
  if (p.body === 'cap0') return [84, 32];
  if (p.body === 'cap1') return [84, 36];
  return [76, 108];
};
/** where her underline starts (the tip at reach 0, local): a layout anchors her here */
export const RIMA_BOARD_LINE0: [number, number] = [74, 53];
const fig = (p: RimaBoardPose): FigureDef => {
  const A = armsFor(p);
  const sleeve = (g: string, sx: number, sy: number, a: number[]): Part => ({group: g, mat: 'jacket', prims: [P.ell(sx, sy, 7, 7), seg(sx, sy, 12, a[0], a[1], 10), seg(a[0], a[1], 10, a[2], a[3], 8), P.ell(a[0], a[1], 5, 5)]});
  const parts: Part[] = [];
  // the left arm first when it crosses in front of her (cap0: behind her body from our side, its hand past her right
  // shoulder), else after the torso
  const lFront = p.body !== 'cap0';
  if (!lFront) parts.push(sleeve('armF', 30, 50, A.l));
  // the jacket from behind: structured shoulders, nipped at the waist, the hem over her hips; the centre seam
  parts.push({group: 'torso', mat: 'jacket', prims: [P.poly(24, 52, 36, 42, 60, 42, 72, 52, 72, 66, 67, 84, 70, 108, 26, 108, 29, 84, 24, 66)]});
  if (lFront) parts.push(sleeve('armF', 30, 50, A.l));
  parts.push(sleeve('armN', 66, 50, A.r));
  // the hair from behind: the crown and the long fall past her shoulders (the centre part is on the far side)
  parts.push({group: 'hair', mat: 'hair', prims: [P.ell(48, 20, 13, 15), P.poly(35, 20, 61, 20, 64, 58, 59, 66, 37, 66, 32, 58)]});
  // the hands (skin) and the marker (white barrel, the red felt tip, the red cap)
  const hand = (x: number, y: number): Part => ({group: 'hand', mat: 'skin', prims: [P.ell(x, y, 4, 4.5)]});
  parts.push(hand(A.r[2], A.r[3]));
  const adjust: FigureDef['adjust'] = [
    {prims: [P.line(48, 44, 48, 108)], tone: 1, onlyMat: 'jacket'},
    {prims: [P.poly(24, 52, 36, 42, 44, 42, 34, 60, 28, 108, 26, 108, 29, 84, 24, 66)], add: 1, onlyMat: 'jacket'},
    {prims: [P.line(40, 24, 44, 60), P.line(54, 22, 56, 60)], tone: 3, onlyMat: 'hair'},
  ];
  const mk = (x0: number, y0: number, x1: number, y1: number, capped: boolean): Part[] => [
    {group: 'marker', mat: 'marker', tone: 3, prims: [seg(x0, y0, 2.4, x1, y1, 2.4)]},
    {group: 'markerTip', mat: 'marker', tone: capped ? 4 : 5, prims: [P.ell(x1, y1, capped ? 1.8 : 1.2, capped ? 2.6 : 1.2)]},
  ];
  const [tx, ty] = rimaBoardTip(p);
  const hx = A.r[2], hy = A.r[3];
  if (p.body === 'write' || p.body === 'underline') parts.push(...mk(hx - (tx - hx) * 0.4, hy - (ty - hy) * 0.4, tx, ty, false));
  else if (p.body === 'cap0') { parts.push(...mk(hx, hy + 6, tx, ty, false)); parts.push({group: 'cap', mat: 'marker', tone: 4, prims: [P.ell(A.l[2], A.l[3] - 4, 2, 3)]}); }
  else parts.push(...mk(hx, hy + 6, tx, ty, true));
  parts.push(hand(A.l[2], A.l[3]));
  return {w: RIMA_BOARD_W, h: RIMA_BOARD_H, parts, adjust};
};
export const rimaBoard = memo((p: RimaBoardPose): Img => renderFigure(fig({body: p.body, reach: p.body === 'underline' ? Math.round((p.reach ?? 1) * 12) / 12 : undefined}), rimaStandRig('board')));
export const drawRimaBoard = (b: Buf, x: number, y: number, p: RimaBoardPose, o: {map?: (c: number) => number} = {}) => blitImg(b, rimaBoard(p), x, y, {map: o.map});
