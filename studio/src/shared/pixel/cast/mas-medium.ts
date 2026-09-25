// MR. MAS — cast: MAS at MEDIUM / TWO-SHOT scale (Ep1 act 4 draft 3.1; new file, owned by the act-4 medium-tier artist).
// pov-and-framing §4.1 `[M]`/`[2S]`: waist-up, head ≈ 36 px (2x his 18-px room head), Mas in the left third, 3/4.
// The head is the APPROVED PORTRAIT's geometry (cast/mas.ts masPortrait + its near-front head), re-rasterized at half
// size (medium-kit scaleParts: vector geometry, never a scaled sprite), with every face feature hand-placed at this
// size: the six mouths (A E O M rest smile), three lids (he doesn't blink on screen: lids are for 'down' and cuts),
// the one-catchlight eye dart, the brow lift. The one-pixel smile stays ONE pixel (rule 10).
//   heads (3 drawings)  '34' toward the monitor (camera-left; the default) · 'down' at the desk (phone, tally, the
//                       lanyard: lids lowered, the face tipped a pixel) · 'front' the near-front head (to the lens, to the
//                       Orb, to whoever he answers)
//   arms (4 + 'down')   'rest' both forearms on the desk · 'phone' his camera-left hand flat on the phone ·
//                       'tally' his camera-right hand at rest, the thumb on mark 3 (MAS_M_HAND.tally = the thumb tip)
//                       · 'clasp' hands together on the table (the calm-off) · 'down' hands in his lap (under the edge)
//   lights              'monitor' the dark room (cyan key camera-left, the Orb's cool rim) · 'board' the boardroom
//                       (the pendant's cyan key, the fires' warm rim) · 'warm' tungsten (lobby / hall)
// Authored facing camera-left (toward the monitor). flip = facing camera-right (the calm-off: he faces MADA across the
// table); the key light flips with the drawing.
// DRAW ORDER: masMediumBack -> the plate's desk/table top over rows >= MAS_M_DESK -> masMediumFront (forearms, hands).
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {memo, shiftPrim} from './kit';
import {Viseme} from './talk';
import {scaleParts, scaleAdjust, dartRows, rigPoint, handParts, sleeveParts, HandSpec, V2} from './medium-kit';

export const MAS_MW = 84;
export const MAS_MH = 110;
/** local row of the desk / table top's FAR edge: the plate paints its top over the BACK image from here down */
export const MAS_M_DESK = 84;
/** portrait -> medium: half size, offset */
const K = 0.5, OX = 18, OY = 2;

export type MasMHead = '34' | 'down' | 'front';
export type MasMArm = 'rest' | 'phone' | 'tally' | 'clasp' | 'down';
export type MasMLight = 'monitor' | 'board' | 'warm';
export interface MasMediumState {
  head: MasMHead;
  mouth: Viseme;
  lid: 0 | 1 | 2;
  /** eye dart: -1 camera-left (the monitor), 0 centre, 1 camera-right (the Orb / the other person when unflipped) */
  look: -1 | 0 | 1;
  brow: 0 | 1;
  arm: MasMArm;
  light: MasMLight;
}
export const MAS_MEDIUM_DEFAULT: MasMediumState = {head: '34', mouth: 'rest', lid: 0, look: -1, brow: 0, arm: 'rest', light: 'monitor'};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the portrait's geometry (portrait space, 112x136)
// copied verbatim from cast/mas.ts (masPortraitFig and frontHead); the jaw drop and the lower-face compression are
// the portrait's own. Only PARTS and ADJUST planes are reused: the stamps are redrawn at medium size below.
const geo34 = (jaw: number) => {
  const q = (y: number) => (y > 56 ? Math.round((56 + (y - 56) * 0.86) * 2) / 2 : y);
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? q(v) + (v >= 71 ? jaw : 0) : v)));
  const parts: Part[] = [
    // hood bunched behind the neck (his back is camera-right), then the hoodie shoulders
    {group: 'hood', mat: 'hood', tone: 1, prims: [P.poly(58, 96, 62, 86, 74, 80, 90, 83, 100, 92, 104, 106, 90, 104, 74, 99)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(4, 144, 6, 116, 14, 104, 28, 97, 42, 94, 70, 94, 88, 98, 102, 108, 108, 144)]},
    // slender neck
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(52, 76, 52, 97, 60, 100, 69, 96, 68, 70)]},
    // the hood's rolled edge around the neck; dark inside only behind the neck
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: [P.poly(60, 93, 66, 90, 76, 91, 80, 95, 72, 97, 64, 96)]},
    {group: 'roll', mat: 'hood', tone: 2, prims: [P.poly(34, 99, 42, 93, 50, 95, 58, 97, 66, 96, 74, 94, 81, 95, 78, 100, 68, 103, 56, 104, 44, 103)]},
    // head: cranium + face (3/4 front, facing camera-left)
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 47, 24, 25),
      J(42, 26, 37, 33, 35, 40, 35, 47, 34, 52, 35, 58, 36, 64, 38, 71, 40, 77, 43, 82, 48, 85, 55, 84, 63, 80, 70, 74, 74, 66, 76, 56, 78, 46, 76, 34, 70, 26, 58, 22, 48, 22),
    ]},
    // hair: short sides, a little length on top pushed forward; the COWLICK springs off the front hairline
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(36, 41, 34, 32, 37, 24, 45, 17, 57, 13, 70, 15, 80, 22, 85, 32, 86, 46, 84, 60, 80, 70, 76, 62, 75, 52, 72, 46, 70, 38, 66, 34, 63, 32, 60, 34, 57, 31, 53, 33, 49, 31, 45, 34, 41, 33, 38, 37),
      P.poly(55, 29, 53, 21, 49, 15, 43, 12, 37, 13, 33, 17, 37, 17, 41, 18, 44, 22, 46, 29),
    ]},
    // ear sits over the hair at the side
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(72, 50, 76, 47, 80, 49, 81, 57, 78, 65, 73, 66, 71, 60)]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: strands swept forward (crown -> fringe), cyan catch on the front of the crown and cowlick
    plane('hair', 1, P.line(72, 19, 60, 31), P.line(64, 16, 53, 30), P.line(78, 26, 67, 35), P.line(82, 34, 74, 46), P.line(56, 15, 47, 29), P.line(83, 44, 79, 58)),
    plane('hair', 3, P.poly(35, 32, 38, 25, 44, 20, 40, 27, 37, 34), P.poly(35, 16, 39, 13, 45, 13, 50, 16, 44, 15, 39, 15), P.line(58, 14, 66, 15)),
    plane('hair', 4, P.line(35, 30, 38, 25), P.line(36, 15, 40, 13), P.line(41, 13, 44, 13)),
    plane('hair', 0, P.poly(70, 38, 72, 46, 75, 52, 72, 48), P.line(45, 19, 49, 26), P.line(80, 62, 80, 69), P.line(38, 18, 42, 19)),
    // ---- face: front planes lit by the monitor (tone 3 base), highlights (4), the terminator (mauve, 2)
    plane('skin', 2, J(62, 33, 68, 36, 70, 44, 70, 56, 70, 66, 66, 74, 60, 79, 56, 80, 60, 72, 63, 62, 63, 50, 61, 40)),
    toMat('skin', 'skinD', 2, J(68, 36, 74, 38, 77, 46, 76, 56, 74, 66, 70, 74, 63, 80, 57, 83, 56, 80, 60, 79, 66, 74, 70, 66, 70, 56, 70, 44)),
    plane('skin', 4, P.poly(40, 35, 46, 34, 54, 35, 50, 38, 44, 39, 38, 40), P.poly(44, 45, 46, 45, 43, 56, 41, 58), J(36, 50, 38, 49, 39, 56, 36, 58), J(42, 78, 47, 77, 49, 81, 44, 82)),
    plane('skin', 5, P.line(42, 57, 42, 58), P.line(44, 36, 48, 35)),
    // eye sockets, nose shadow side + cast shadow, under-nose, under-lip
    plane('skin', 2, P.poly(38, 44, 44, 44, 44, 46, 38, 47), P.poly(49, 44, 62, 43, 64, 46, 50, 47)),
    plane('skin', 2, P.poly(46, 47, 48, 47, 49, 57, 46, 61, 44, 60)),
    toMat('skin', 'skinD', 3, J(48, 53, 52, 55, 52, 60, 47, 62)),
    toMat('skin', 'skinD', 2, J(39, 61, 47, 61, 46, 63, 40, 63)),
    plane('skin', 2, J(40, 74, 50, 74, 49, 76, 41, 76)),
    // under the jaw on the neck: deepest shadow; neck front catches a little
    plane('neck', 0, J(52, 83, 56, 84, 64, 80, 70, 76, 69, 84, 60, 88, 52, 87)),
    plane('neck', 2, P.poly(52, 88, 54, 88, 54, 97, 52, 96)),
    plane('skin', 4, J(51, 53, 56, 52, 58, 55, 53, 57)),
    // ear: inner bowl
    toMat('skinD', 'skinD', 1, J(74, 52, 77, 51, 78, 57, 76, 61)),
    toMat('skinD', 'skinD', 4, J(72, 51, 74, 49, 73, 60, 72, 58)),
    // ---- hoodie: the rolled hood edge, lit chest plane toward the monitor, drawstrings, folds
    plane('hood', 3, P.poly(35, 99, 42, 94, 50, 96, 44, 98, 38, 101)),
    plane('hood', 1, P.poly(44, 102, 56, 103, 68, 102, 78, 99, 76, 101, 66, 104, 54, 105)),
    plane('hood', 3, P.poly(7, 118, 14, 106, 26, 99, 36, 97, 30, 103, 20, 110, 12, 122)),
    plane('hood', 4, P.poly(7, 115, 14, 105, 24, 99, 16, 107, 10, 118)),
    plane('hood', 3, P.poly(22, 116, 32, 106, 40, 104, 30, 116, 24, 128)),
    plane('hood', 1, P.line(62, 106, 71, 144), P.line(84, 104, 98, 144), P.poly(88, 106, 102, 112, 107, 144, 97, 144)),
    plane('hood', 4, P.line(47, 104, 45, 119), P.line(57, 105, 58, 117)),
    plane('hood', 5, P.rect(45, 119, 1, 2), P.rect(58, 117, 1, 2)),
    plane('hood', 0, P.line(48, 105, 46, 119), P.line(58, 105, 59, 116)),
  ];
  return {parts, adjust, q, J};
};
const geoFront = (jaw: number) => {
  const q = (y: number) => (y > 56 ? Math.round((56 + (y - 56) * 0.86) * 2) / 2 : y);
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? q(v) + (v >= 71 ? jaw : 0) : v)));
  const parts: Part[] = [
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(51, 82, 51, 97, 57, 99, 64, 96, 64, 80)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(58, 45, 24, 24),
      J(41, 28, 37, 37, 36, 47, 37, 57, 39, 65, 42, 72, 46, 78, 51, 83, 57, 85, 64, 83, 70, 78, 74, 71, 77, 63, 79, 54, 80, 45, 79, 35, 74, 27, 58, 21),
    ]},
    // hair: short sides, length on top pushed forward; the COWLICK springs off the front hairline toward camera-left
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(35, 46, 34, 35, 37, 26, 44, 18, 54, 14, 65, 14, 75, 18, 82, 26, 84, 36, 83, 47, 80, 53, 79, 44, 77, 37, 72, 32, 66, 31, 60, 32, 55, 31, 50, 33, 45, 32, 40, 36, 37, 46),
      P.poly(51, 32, 49, 24, 45, 18, 39, 14, 33, 15, 30, 19, 34, 18, 38, 19, 42, 23, 45, 31),
    ]},
    // ears: the far one (camera-right) shows; the near one is a sliver behind the cheek
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(78, 50, 82, 47, 85, 50, 85, 58, 82, 65, 78, 64, 78, 57), J(35, 51, 37, 49, 38, 52, 38, 60, 36, 62, 35, 57)]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: strands swept forward off the crown, a cyan catch on the lit (camera-left) crown and the cowlick
    plane('hair', 1, P.line(66, 16, 58, 30), P.line(74, 20, 66, 31), P.line(80, 28, 75, 37), P.line(58, 15, 51, 29), P.line(82, 38, 80, 50)),
    plane('hair', 3, P.poly(36, 33, 39, 26, 45, 20, 41, 28, 38, 35), P.poly(31, 18, 35, 15, 40, 15, 45, 18, 39, 17, 34, 17), P.line(55, 15, 62, 15)),
    plane('hair', 4, P.line(36, 31, 39, 26), P.line(32, 17, 35, 15), P.line(36, 15, 39, 15)),
    plane('hair', 0, P.poly(77, 38, 79, 45, 80, 51, 78, 47), P.line(46, 20, 49, 27), P.line(83, 44, 82, 50)),
    // ---- face planes: the far cheek turns off the monitor (2), its edge deeper (skinD 2)
    plane('skin', 2, J(69, 33, 74, 37, 77, 46, 77, 57, 75, 66, 71, 74, 65, 80, 60, 83, 63, 75, 67, 66, 69, 56, 69, 44)),
    toMat('skin', 'skinD', 2, J(74, 34, 79, 40, 80, 50, 78, 62, 74, 72, 67, 80, 60, 84, 65, 80, 71, 74, 75, 66, 77, 57, 77, 46)),
    // highlights: lit forehead, the near cheekbone, the nose ridge, the chin
    plane('skin', 4, P.poly(40, 36, 48, 33, 57, 34, 51, 37, 43, 39, 39, 41), J(38, 56, 42, 54, 44, 61, 40, 65), P.poly(53, 47, 55, 47, 54, 58, 52, 59), J(51, 80, 57, 79, 59, 83, 53, 84)),
    plane('skin', 5, P.line(52, 56, 52, 57), P.line(44, 35, 49, 34)),
    // eye sockets under the brows
    plane('skin', 2, P.poly(40, 45, 51, 44, 52, 47, 40, 48), P.poly(61, 44, 73, 44, 74, 47, 61, 47)),
    // nose: the shadow side is camera-right, its cast shadow falls right and down; under-nose, under-lip
    plane('skin', 2, P.poly(56, 47, 58, 47, 60, 57, 59, 61, 56, 61)),
    toMat('skin', 'skinD', 3, J(58, 58, 62, 59, 62, 63, 57, 64)),
    toMat('skin', 'skinD', 2, J(50, 62, 58, 62, 57, 64, 51, 64)),
    plane('skin', 2, J(51, 74, 61, 74, 60, 76, 52, 76)),
    // under the jaw: deepest; the neck's lit strip is camera-left
    plane('neck', 0, J(47, 81, 52, 85, 58, 86, 65, 84, 69, 79, 67, 88, 58, 91, 48, 88)),
    plane('neck', 2, P.poly(51, 90, 52, 90, 52, 97, 51, 96)),
    // ears: the far ear's bowl
    toMat('skinD', 'skinD', 1, J(80, 52, 83, 52, 83, 58, 81, 61)),
    toMat('skinD', 'skinD', 4, J(78, 51, 80, 50, 79, 60, 78, 58)),
  ];
  return {parts, adjust};
};

// ------------------------------------------------------------------ compose the portrait geometry, then re-rasterize
const HD = 3, BD = -4; // the portrait's own compose: head 3px lower, shoulders 4px higher (a shorter neck)
const BODY = new Set(['hood', 'torso', 'collar', 'roll', 'neck']);
const mv = (pr: Prim, dy: number) => shiftPrim(pr, 0, dy);
const portraitGeo = (head: MasMHead, jaw: number): {parts: Part[]; adjust: Adjust[]} => {
  const g = geo34(jaw);
  const isBodyAdj = (a: Adjust) => a.onlyMat === 'hood';
  if (head === 'front') {
    const fh = geoFront(jaw);
    const D = 2;
    const parts = [
      ...g.parts.filter((pt) => !['head', 'hair', 'ear', 'neck'].includes(pt.group)).map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, BD))})),
      ...fh.parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, pt.group === 'neck' ? 0 : D + HD))})),
    ];
    const adjust = [
      ...g.adjust.filter(isBodyAdj).map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, BD))})),
      ...fh.adjust.map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, D + HD))})),
    ];
    return {parts, adjust};
  }
  // '34' and 'down' share the 3/4 drawing; 'down' tips the face a pixel toward the desk (below) and shows more crown
  return {
    parts: g.parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, BODY.has(pt.group) ? (pt.group === 'neck' ? 0 : BD) : HD))})),
    adjust: g.adjust.map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, isBodyAdj(a) ? BD : HD))})),
  };
};

// ------------------------------------------------------------------ the medium-native body below the portrait crop
// The portrait's torso ends at local row ~72; the hoodie continues to the waist (under the desk). Upper arms hang from
// the shoulders to the elbows on the desk top's far edge; forearms + hands are the FRONT layer.
const bodyParts = (arm: MasMArm): Part[] => {
  void arm;
  // the torso carries the upper arms in its silhouette (as the portrait's does): shoulders to the desk line
  return [{group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(24, 64, 68, 64, 71, 72, 73, 84, 75, 96, 72, 110, 24, 110, 21, 96, 22, 86, 23, 72)]}];
};
const bodyAdjust = (): Adjust[] => [
  // the hoodie below the crop: the arms' inside creases run down from the shoulders to the elbows; the chest between
  // them turns off the key a rung; the camera-left arm's lit face (the monitor); the far arm in shade
  plane('hood', 0, P.line(32, 66, 30, 86), P.line(64, 66, 66, 86)),
  plane('hood', 3, P.poly(23, 68, 27, 64, 30, 66, 28, 86, 23, 86)),
  plane('hood', 4, P.line(23, 70, 23, 84)),
  plane('hood', 1, P.poly(66, 66, 72, 68, 74, 86, 67, 86)),
  plane('hood', 1, P.line(40, 70, 41, 94), P.line(56, 70, 55, 94)),
  // the kangaroo pocket's seam just above the desk
  plane('hood', 0, P.line(38, 88, 58, 88)),
];

// ------------------------------------------------------------------ forearms + hands (the FRONT layer)
// The forearms lie on the desk top (seen from a little above), elbows just in front of its far edge, and come
// forward and in; the hands are medium-kit handParts (palm + fingers one silhouette, the thumb its own), lit by the
// same rig as the face, so the rim is always on the key side.
const ELBOW = {L: [24, 87] as V2, R: [70, 87] as V2};
interface ArmPose { L?: {elbow: V2; wrist: V2; hand: HandSpec}; R?: {elbow: V2; wrist: V2; hand: HandSpec} }
const ARMS: Record<Exclude<MasMArm, 'down'>, ArmPose> = {
  // both forearms on the desk, hands flat, fingers forward and in
  rest: {
    L: {elbow: ELBOW.L, wrist: [32, 96], hand: {at: [32, 96], dir: [0.5, 1], thumb: -1, len: 11, width: 9, curl: 0.3}},
    R: {elbow: ELBOW.R, wrist: [62, 96], hand: {at: [62, 96], dir: [-0.5, 1], thumb: 1, len: 11, width: 9, curl: 0.3}},
  },
  // his camera-left hand flat on the phone (DPLATE.phone), fingers over its far end; the other at rest, out past
  // the tally (all three marks stay clear: sc 29 holds them in frame)
  phone: {
    L: {elbow: [22, 87], wrist: [21, 97], hand: {at: [21, 97], dir: [0.12, 1], thumb: -1, len: 11, width: 9, curl: 0.25, thumbOut: 0.2}},
    R: {elbow: [72, 87], wrist: [71, 97], hand: {at: [71, 97], dir: [-0.3, 1], thumb: 1, len: 11, width: 9, curl: 0.3}},
  },
  // the camera-right hand at rest beside the tally, the thumb laid along mark 3 (MAS_M_HAND.tally.R = its tip); the
  // other hand drawn back to the desk's left, well clear of marks 1 and 2 (he never touches them, pov §3.7)
  tally: {
    L: {elbow: [22, 87], wrist: [19, 97], hand: {at: [19, 97], dir: [0.18, 1], thumb: -1, len: 11, width: 9, curl: 0.3, thumbOut: 0.2}},
    R: {elbow: [71, 87], wrist: [68, 97], hand: {at: [68, 97], dir: [-0.12, 1], thumb: 1, len: 11, width: 9, curl: 0.3, thumbOut: 0.3, thumbLen: 7}},
  },
  // hands together on the table, one over the other, knuckles up (the calm-off)
  clasp: {
    L: {elbow: [25, 87], wrist: [37, 96], hand: {at: [37, 96], dir: [1, 0.3], thumb: -1, len: 11, width: 9, curl: 0.4, noThumb: true}},
    R: {elbow: [69, 87], wrist: [57, 96], hand: {at: [57, 96], dir: [-1, 0.3], thumb: 1, len: 11, width: 9, curl: 0.4, thumbOut: 0.1}},
  },
};
const armBuild = (arm: MasMArm) => {
  const parts: Part[] = [], adjust: Adjust[] = [];
  const out: {L?: {tip: V2; thumbTip: V2}; R?: {tip: V2; thumbTip: V2}} = {};
  if (arm === 'down') return {parts, adjust, out};
  const A = ARMS[arm];
  for (const side of ['L', 'R'] as const) {
    const s = A[side];
    if (!s) continue;
    const sv = sleeveParts('fore' + side, s.elbow, s.wrist, {w0: 9.5, w1: 7.6});
    const hd = handParts('hand' + side, s.hand, 'hand');
    parts.push(...sv.parts, ...hd.parts); adjust.push(...sv.adjust, ...hd.adjust);
    out[side] = {tip: hd.tip, thumbTip: hd.thumbTip};
  }
  return {parts, adjust, out};
};
const r2 = (p: V2): [number, number] => [Math.round(p[0]), Math.round(p[1])];
/** hand anchors (local): the hand's middle fingertip, or for 'tally' R the thumb tip resting on mark 3 */
export const MAS_M_HAND: Record<'rest' | 'phone' | 'tally' | 'clasp', {L?: [number, number]; R?: [number, number]}> = (() => {
  const o: Record<string, {L?: [number, number]; R?: [number, number]}> = {};
  for (const k of ['rest', 'phone', 'tally', 'clasp'] as const) {
    const b = armBuild(k).out;
    o[k] = {L: b.L ? r2(k === 'phone' ? b.L.tip : b.L.tip) : undefined, R: b.R ? r2(k === 'tally' ? b.R.thumbTip : b.R.tip) : undefined};
  }
  return o as Record<'rest' | 'phone' | 'tally' | 'clasp', {L?: [number, number]; R?: [number, number]}>;
})();

// ------------------------------------------------------------------ the face, hand-placed at medium size
// palette keys: L lid (N0) · w white · I pupil · g catchlight · b brow · o nostril / crease · mouth m M l T d
const EYES_34: Record<0 | 1 | 2, {near: string[]; far: string[]}> = {
  0: {near: ['.LLLL.', 'wiIgw.', '..kk..'], far: ['LL.', 'iI.']},
  1: {near: ['......', 'LLLLL.'], far: ['...', 'LL.']},
  2: {near: ['......', '.LLLL.'], far: ['...', '.L.']},
};
const MOUTHS_34: Record<Viseme, string[]> = {
  rest: ['......', 'mmmmm.', '.lll..'],
  smile: ['....m.', 'mmmm..', '.lll..'],
  A: ['......', 'mmmmm.', 'mTTTm.', '.mdm..', '..l...'],
  E: ['......', 'mmmmmm', 'mTTTm.', '.mmm..'],
  O: ['......', '.mmm..', 'mddm..', '.mm...'],
  M: ['......', 'mmmmm.', '.MMM..', '.lll..'],
};
const EYES_FRONT: Record<0 | 1 | 2, {l: string[]; r: string[]}> = {
  0: {l: ['.LLLL.', 'wgIw..'], r: ['.LLLL.', '.wgIw.']},
  1: {l: ['......', 'LLLLL.'], r: ['......', '.LLLLL']},
  2: {l: ['......', '.LLLL.'], r: ['......', '.LLLL.']},
};
const MOUTHS_FRONT: Record<Viseme, string[]> = {
  rest: ['......', 'mmmmm.', '.lll..'],
  smile: ['....m.', 'mmmm..', '.lll..'],
  A: ['......', 'mmmmm.', 'mTTTm.', '.mdm..', '..l...'],
  E: ['......', 'mmmmmm', 'mTTTm.', '.mmm..'],
  O: ['......', '.mmm..', '.mddm.', '..mm..'],
  M: ['......', 'mmmmm.', '.MMM..', '.lll..'],
};
const faceStamps = (s: MasMediumState, jaw: number): Stamp[] => {
  const warm = s.light === 'warm';
  const eyePal = {L: PAL.N0, w: warm ? PAL.S4 : PAL.K1, i: PAL.B3, I: PAL.N0, g: warm ? PAL.W8 : PAL.C8, k: warm ? PAL.S2 : PAL.X1};
  const mPal = {m: PAL.S0, M: PAL.X0, l: warm ? PAL.S2 : PAL.X2, T: warm ? PAL.S5 : PAL.K3, d: PAL.N0};
  const bPal = {b: PAL.B1};
  const br = s.brow ? -1 : 0;
  if (s.head === 'front') {
    const e = EYES_FRONT[s.lid];
    return [
      {x: 37, y: 24 + br, rows: ['.bbbb', 'b....'], pal: bPal},
      {x: 48, y: 24 + br, rows: ['bbbb.', '....b'], pal: bPal},
      {x: 37, y: 26, rows: dartRows(e.l, s.look), pal: eyePal},
      {x: 48, y: 26, rows: dartRows(e.r, s.look), pal: eyePal},
      {x: 44, y: 34, rows: ['o.o'], pal: {o: PAL.S0}},
      {x: 42, y: 37 + (s.mouth === 'A' ? 0 : 0), rows: MOUTHS_FRONT[s.mouth], pal: mPal},
    ];
  }
  const down = s.head === 'down';
  const dy = down ? 1 : 0;
  const e = EYES_34[down ? (s.lid === 2 ? 2 : 1) : s.lid];
  const out: Stamp[] = [
    {x: 42, y: 23 + br + dy, rows: ['.bbbbbb', 'bb.....'], pal: bPal},
    {x: 35, y: 24 + br + dy, rows: ['bbb'], pal: bPal},
    {x: 42, y: 25 + dy, rows: dartRows(e.near, down ? 0 : s.look), pal: eyePal},
    {x: 36, y: 25 + dy, rows: dartRows(e.far, down ? 0 : s.look), pal: eyePal},
    {x: 38, y: 33 + dy, rows: ['.o', 'o.'], pal: {o: PAL.S0}},
    {x: 37, y: 36 + dy, rows: MOUTHS_34[s.mouth], pal: mPal},
  ];
  // looking down: a lash line under each lowered lid (the eyes are on the desk)
  if (down && s.lid < 2) out.push({x: 42, y: 27, rows: ['.kkk.'], pal: {k: PAL.X0}});
  void jaw;
  return out;
};

// ------------------------------------------------------------------ lights
const RAMPS_MON: Record<string, number[]> = {
  skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  neck: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
  skinD: [PAL.S0, PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2],
  hand: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K3],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K2, PAL.C6],
  hood: [PAL.N1, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C6],
  hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
};
const RAMPS_WARM: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
  hand: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S5],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
  hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
};
const rigFor = (light: MasMLight): LightRig => ({
  key: light === 'warm' ? [-0.9, -0.4] : [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['hoodIn', 'neck'],
  back: [1, -0.1], backBand: 1,
  backRamp: light === 'board'
    ? {skin: PAL.S3, skinD: PAL.S2, hand: PAL.S3, hair: PAL.W3, hood: PAL.W3} // the fires behind him: a warm kiss down his back edge
    : light === 'warm' ? {skin: PAL.K2, skinD: PAL.K1, hair: PAL.C2, hood: PAL.C2} : {skin: PAL.K1, skinD: PAL.K1, hair: PAL.C2, hood: PAL.C2},
  ramps: light === 'warm' ? RAMPS_WARM : RAMPS_MON,
});

// ------------------------------------------------------------------ the rig
/** his slight frame: the portrait's shoulders read broad on a waist-up figure, so the body narrows about the neck */
const SQ = 0.86, SQX = 48;
const squeeze = (p: Prim): Prim => {
  const f = (x: number) => SQX + (x - SQX) * SQ;
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => (i % 2 ? v : f(v)))};
    case 'ell': return {...p, cx: f(p.cx), rx: p.rx * SQ};
    case 'rect': return {...p, x: Math.round(f(p.x)), w: Math.max(1, Math.round(p.w * SQ))};
    case 'line': return {...p, x0: Math.round(f(p.x0)), x1: Math.round(f(p.x1))};
    default: return p;
  }
};
const backFig = (s: MasMediumState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const g = portraitGeo(s.head, jaw);
  const dyDown = s.head === 'down' ? 1 : 0;
  // scaled portrait: the body groups go first (drawn under the head), the medium-native torso + arms join them
  const sp = scaleParts(g.parts, K, OX, OY).map((pt) => (BODY.has(pt.group) && pt.group !== 'neck' ? {...pt, prims: pt.prims.map(squeeze)} : pt));
  const bodyFirst = sp.filter((pt) => BODY.has(pt.group) && pt.group !== 'neck');
  const rest = sp.filter((pt) => !(BODY.has(pt.group) && pt.group !== 'neck')).map((pt) => (dyDown && pt.group !== 'neck' ? {...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, 0))} : pt));
  const parts: Part[] = [...bodyParts(s.arm).slice(0, 1), ...bodyFirst, ...bodyParts(s.arm).slice(1), ...rest];
  const adjust = [...scaleAdjust(g.adjust, K, OX, OY, true).map((a) => (a.onlyMat === 'hood' ? {...a, prims: a.prims.map(squeeze)} : a)), ...bodyAdjust()];
  return {w: MAS_MW, h: MAS_MH, parts, adjust, stamps: faceStamps(s, jaw)};
};
const frontFig = (s: MasMediumState): FigureDef => {
  const a = armBuild(s.arm);
  return {w: MAS_MW, h: MAS_MH, parts: a.parts, adjust: a.adjust};
};

export const masMediumBack = memo((s: MasMediumState): Img => renderFigure(backFig(s), rigFor(s.light)));
export const masMediumFront = memo((s: MasMediumState): Img => renderFigure(frontFig(s), rigFor(s.light)));

/**
 * Draw Mas at medium scale with his top-left at (x, y): the back image, then `desk` (the plate paints its desk / table
 * top from frame row y + MAS_M_DESK down, over his lower body), then the forearms and hands.
 */
export const drawMasMedium = (b: Buf, x: number, y: number, s: MasMediumState, o: {flip?: boolean; desk?: (b: Buf) => void; map?: (c: number, x: number, y: number) => number; mask?: Uint8Array} = {}) => {
  const put = (img: Img) => {
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (o.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      b.set(X, Y, o.map ? o.map(v, X, Y) : v);
      if (o.mask && X >= 0 && Y >= 0 && X < b.w && Y < b.h) o.mask[Y * b.w + X] = 255;
    }
  };
  put(masMediumBack(s));
  o.desk?.(b);
  put(masMediumFront(s));
};
/** frame coords of a hand anchor for a rig drawn at (x, y) */
export const masMediumHand = (x: number, y: number, arm: keyof typeof MAS_M_HAND, side: 'L' | 'R', flip = false): [number, number] | null => {
  const p = MAS_M_HAND[arm][side];
  return p ? rigPoint({w: MAS_MW}, x, y, p, flip) : null;
};
/** frame coords of his face (the eye line), for eyelines and the Orb's look up to his face */
export const MAS_M_FACE: [number, number] = [42, 27];
