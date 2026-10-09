// MR. MAS — Ep2 v1 art: XEL (the long-form podcast host; manifest §2.2; sc 6). characters/the-podcast-circuit.md:
// "hosts are drawn by studio and prop, never by face or body: XEL as a dark suit and tie"; no appearance jokes. A calm,
// earnest interviewer: a plain dark suit, a white shirt, a plain dark tie, short dark hair, an attentive face. Nothing
// here is a likeness (no traced features; the parody is the studio, the mic and the questions).
//   xelBust(s)                    112 x 136, faces camera-left (he sits screen-right). s: {mouth, expr, lean}
//                                 expr: neutral (listening), focus (the long question), smile (warm), worry (curious)
//   drawXelSeated(b, sx, sy, pose)  the seated figure for the locked two-shot, its seat anchor on the chair (faces screen-LEFT: he is
//                                 screen-right). x, y = his foot point (the seat line is y - 32). pose {mouth, lean: 0 | 1
//                                 | 2 (toward the mic, off the record), hands: 'knees' | 'clasp'}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {SKIN, HAIR, SUIT, SHIRT_WHITE} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust3, BustState, BustSpec3, Expr, Viseme, roomHead, ROOM_HEAD_PAL} from './civic2';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../../../../../shared/pixel/figure';
import {memo, seg} from '../../../../../shared/pixel/cast/kit';
import {headStamp} from '../../../../../shared/pixel/cast/civic-kit';
import {sheetPlate, sheetBust, label} from './sheet';
import {fill} from '../kit';
import type {ArtAsset} from '../asset';

export interface XelBust extends BustState { lean?: 0 | 1 }
export const XEL_DEFAULT: XelBust = {mouth: 'rest', expr: 'neutral'};
const TIE = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5];
// his own head: a broad, square face (a wide jaw, a firm chin), a straight even brow, a neat side part, almond eyes
// and a level mouth that opens easily; the face of someone who listens for a living
const spec: BustSpec3 = {
  head: {yaw: 24, at: [57, 56], scale: 1.06, cranium: [21, 25, 23], cheekW: 17, jawW: 16, jawY: 19, chinY: 33, chinW: 8, chinZ: 12, cheekbone: 0.6, full: 0.5, brow: 2.2,
    nose: {tipY: 13, proj: 7, wing: 4.2}, mouthY: 22, eyeX: 8.5, neck: {r: 9.5, throat: true}, hair: {style: 'side', thick: 2.6, line: -19, side: 1},
    skin: SKIN.light, hairRamp: HAIR.dark, back: {skin: PAL.S3, hair: PAL.G3}},
  face: {eye: 'almond', eyeW: 9, eyeH: 2, brow: 'straight', browCol: PAL.B0, mouthW: 10, age: 1},
  torso: {kind: 'suit'},
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.black, shirt: SHIRT_WHITE, tie: TIE},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.G2},
  // his warmth reaches the eyes (crinkled, the cheeks up); his curiosity lifts the brows without the worry's mouth
  expr: {smile: {eye: 'crinkle', mouth: 'smile', pose: {cheekUp: 1.2}}, worry: {eye: 'wide', brow: 'up', mouth: 'rest'}, focus: {eye: 'open', brow: 'up', mouth: 'flat', pose: {nod: 3}}},
};
const bust = makeBust3<XelBust>(spec);
export const xelBust = (s: Partial<XelBust> = {}) => bust({...XEL_DEFAULT, ...s});

// ------------------------------------------------------------------ room: seated in the studio's chair
// (the art review: the old sprite had no thighs or knees, the chair overlapped him, the black suit drew as a pale
// wireframe). Built like Ep1's seated Mas (cast/mas-seated.ts): the seat anchor under his hips, the thighs forward on the
// seat to the knees, the shins down to the chair's footrest, his hands on his knees (or clasped, or one forward on
// the lean), a filled charcoal suit (its rim one rung up, never a white line), the room head with an open, raised brow.
export interface XelSeatPose { mouth: 'rest' | 'open' | 'smile'; lean?: 0 | 1 | 2; hands?: 'knees' | 'clasp'; blink?: boolean }
export const XEL_SEAT: [number, number] = [17, 44];
const XW = 48, XH = 66;
const CHAR = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3];
const xelSeatFig = (p: XelSeatPose): FigureDef => {
  const L = p.lean ?? 0, lx = L * 2, ly = L;
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'suit', prims: [P.ell(sx, sy, 3.6, 3.8), seg(sx, sy, 6.6, ex, ey, 5.8), seg(ex, ey, 5.6, hx, hy, 5), P.ell(ex, ey, 2.8, 2.8)]});
  const handsAt: [number, number, number, number] = p.hands === 'clasp' ? [28, 38, 30, 38] : [27, 42, 33, 42];
  const parts: Part[] = [
    {group: 'legF', mat: 'trou', prims: [seg(15, 44, 8, 29, 45, 6.6), seg(29, 45, 6.2, 29, 60, 5), P.ell(29, 45, 3.2, 3)]},
    {group: 'legFs', mat: 'shoe', prims: [P.poly(26.6, 60, 31.6, 60, 35.8, 62.6, 35.8, 65, 26.2, 65)]},
    sl('armF', 14 + lx, 22 + ly, 15 + lx, 33 + ly, handsAt[0], handsAt[1]),
    {group: 'torso', mat: 'suit', prims: [P.poly(12 + lx, 19 + ly, 18 + lx, 17 + ly, 24 + lx, 18 + ly, 27 + lx, 22 + ly, 28 + lx * 0.6, 30 + ly, 27, 38, 28, 45, 10, 46, 9, 38, 9 + lx * 0.5, 30, 9 + lx, 23 + ly)]},
    {group: 'legN', mat: 'trou', prims: [seg(20, 43, 8.4, 33, 44, 6.8), seg(33, 44, 6.4, 34, 60, 5.2), P.ell(33, 44, 3.4, 3.2)]},
    {group: 'legNs', mat: 'shoe', prims: [P.poly(31.4, 60, 36.6, 60, 40.6, 62.6, 40.6, 65, 31, 65)]},
    sl('armN', 24 + lx, 22 + ly, 26 + lx * 0.6, 33 + ly, handsAt[2], handsAt[3]),
  ];
  const adjust = [
    // the lapels and the jacket's front edge a rung up (the key catches the cloth), the trousers' crease
    {prims: [P.line(19 + lx, 20 + ly, 23 + lx, 30 + ly), P.line(23 + lx, 30 + ly, 24, 44)], tone: 4, onlyMat: 'suit'},
    {prims: [P.line(22, 44, 32, 44)], tone: 3, onlyMat: 'trou'},
  ];
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const head = roomHead({hair: 'short', mouth: p.mouth, blink: p.blink, browUp: true});
  const stamps: Stamp[] = [
    // the shirt's V and the tie
    {x: 18 + lx, y: 18 + ly, rows: ['wwTww', '.wTw.', '.wTw.', '..T..', '..T..', '..T..'], pal: {w: ['shirt', 3], T: ['tie', 2]}},
    headStamp(head, ly, ROOM_HEAD_PAL, lx - 1),
    hand(handsAt[0], handsAt[1]), hand(handsAt[2], handsAt[3]),
  ];
  return {w: XW, h: XH, parts, adjust, stamps};
};
const XRIG: LightRig = {
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.S3, suit: PAL.G2, trou: PAL.G2},
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: CHAR, trou: CHAR, shirt: SHIRT_WHITE, tie: TIE, dark: Array(6).fill(PAL.N0), shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3], lens: [PAL.N0, PAL.N1, PAL.G3, PAL.G5, PAL.C7, PAL.C9], lip: SKIN.light, cap: CHAR},
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
};
const seatImg = memo((p: XelSeatPose) => renderFigure(xelSeatFig(p), XRIG));
/** XEL seated, his seat anchor (under his hips) at (seatX, seatY); he faces screen-LEFT (toward Mas) */
export const drawXelSeated = (b: Buf, seatX: number, seatY: number, p: Partial<XelSeatPose> = {}) => {
  const q: XelSeatPose = {mouth: 'rest', lean: 0, hands: 'knees', ...p};
  blitImg(b, seatImg(q), seatX - (XW - 1 - XEL_SEAT[0]), seatY - XEL_SEAT[1], {flip: true});
};
/** the studio chair (both chairs are the same): a black leather seat on a chrome frame, its back on the sitter's back
 *  side, a footrest ring; drawn before the sitter. `back` -1 = the back on the left, +1 on the right */
export const studioChair = (b: Buf, cx: number, seatY: number, floorY: number, back: -1 | 1) => {
  const bx = back > 0 ? cx + 11 : cx - 15;
  fill(b, bx, seatY - 30, 4, 32, PAL.N2); fill(b, bx + (back > 0 ? 3 : 0), seatY - 30, 1, 32, PAL.N3); fill(b, bx, seatY - 31, 4, 1, PAL.N4);
  fill(b, cx - 14, seatY, 29, 4, PAL.N2); fill(b, cx - 14, seatY, 29, 1, PAL.N4);
  fill(b, cx - 12, seatY + 4, 2, floorY - seatY - 4, PAL.G4); fill(b, cx + 11, seatY + 4, 2, floorY - seatY - 4, PAL.G4);
  fill(b, cx - 12, seatY + 20, 25, 2, PAL.G3); fill(b, cx - 12, seatY + 20, 25, 1, PAL.G5);
  fill(b, cx - 15, floorY - 1, 31, 1, PAL.G2);
};

const e = (x: Expr, m: Viseme = 'rest'): XelBust => ({mouth: m, expr: x});
export const ART: ArtAsset[] = [{
  id: 'char-xel', manifest: '§2.2 XEL', kind: 'character', name: 'XEL (the long-form host)',
  file: 'cast/xel.ts', exports: 'xelBust, drawXelSeated, XEL_DEFAULT', scenes: '6',
  note: 'a plain dark suit and tie, an earnest listener; seated room sprite for the locked 2S (faces left), lean toward the mic',
  stills: [{label: 'busts: listening · the long question (focus, talk E) · warm · curious (worry); seated: rest, talk, lean 2', draw: (b) => {
    sheetPlate(b, [PAL.N0, PAL.N1, PAL.N1, PAL.N2]);
    sheetBust(b, xelBust(e('neutral')), -8, 52, 'listening');
    sheetBust(b, xelBust(e('focus', 'E')), 88, 52, 'the question');
    sheetBust(b, xelBust(e('smile')), 184, 52, 'warm');
    sheetBust(b, xelBust(e('worry', 'O')), 280, 52, 'is it conscious?');
    for (const [x, lab, pose] of [[392, 'rest', {}], [428, 'talk', {mouth: 'open', hands: 'clasp'}], [462, 'lean 2', {lean: 2, mouth: 'open'}]] as Array<[number, string, Partial<XelSeatPose>]>) {
      studioChair(b, x, 154, 188, 1);
      drawXelSeated(b, x, 154, pose);
      label(b, lab, x, 192);
    }
  }}],
}];
