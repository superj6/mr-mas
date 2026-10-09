// MR. MAS — Ep2 v1 art: XEL (the long-form podcast host; manifest §2.2; sc 6). characters/the-podcast-circuit.md:
// "hosts are drawn by studio and prop, never by face or body: XEL as a dark suit and tie"; no appearance jokes. A calm,
// earnest interviewer: a plain dark suit, a white shirt, a plain dark tie, short dark hair, an attentive face. Nothing
// here is a likeness (no traced features; the parody is the studio, the mic and the questions).
//   xelBust(s)                    112 x 136, faces camera-left (he sits screen-right). s: {mouth, expr, lean}
//                                 expr: neutral (listening), focus (the long question), smile (warm), worry (curious)
//   drawXelSeated(b, x, y, pose)  the room-scale seated figure for the locked two-shot (faces screen-LEFT: he is
//                                 screen-right). x, y = his foot point (the seat line is y - 32). pose {mouth, lean: 0 | 1
//                                 | 2 (toward the mic, off the record), hands: 'knees' | 'clasp'}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, HAIR, SUIT, SHIRT_WHITE} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust, makeRoom, plane, BustState, CivicSpec, RoomFigSpec, Expr, Viseme} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {fill} from '../kit';
import type {ArtAsset} from '../asset';

export interface XelBust extends BustState { lean?: 0 | 1 }
export const XEL_DEFAULT: XelBust = {mouth: 'rest', expr: 'neutral'};
const TIE = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5];
const spec: CivicSpec = {
  head: {long: 2, jaw: 1},
  torso: {kind: 'suit'},
  browCol: PAL.B0,
  hair: () => ({
    parts: [{group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(45, 36, 47, 27, 54, 20, 64, 16, 76, 17, 84, 22, 88, 31, 89, 44, 87, 52, 84, 51, 84, 42, 80, 36, 72, 32, 63, 31, 55, 32, 49, 34)]}],
    adjust: [
      plane('hair', 4, P.poly(47, 31, 51, 24, 58, 19, 66, 17, 60, 22, 53, 28)),
      plane('hair', 2, P.line(56, 24, 76, 21), P.line(58, 28, 84, 28)),
      plane('hair', 1, P.poly(84, 40, 88, 42, 87, 52, 84, 51)),
    ],
  }),
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.black, shirt: SHIRT_WHITE, tie: TIE},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.G2},
};
const bust = makeBust<XelBust>(spec);
export const xelBust = (s: Partial<XelBust> = {}) => bust({...XEL_DEFAULT, ...s});

// ------------------------------------------------------------------ room: seated in the studio's chair
export interface XelSeatPose { mouth: 'rest' | 'open' | 'smile'; lean?: 0 | 1 | 2; hands?: 'knees' | 'clasp'; blink?: boolean }
const rspec: RoomFigSpec = {kind: 'suit', ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.black, shirt: SHIRT_WHITE, tie: TIE}, backRamp: {skin: PAL.S3, suit: PAL.G2}};
const room = makeRoom(rspec);
export const drawXelSeated = (b: Buf, footX: number, footY: number, p: Partial<XelSeatPose> = {}) => {
  const q: XelSeatPose = {mouth: 'rest', lean: 0, hands: 'knees', ...p};
  room.draw(b, footX, footY, {arm: q.hands === 'clasp' ? 'clasp' : 'reach', seat: true, lean: q.lean, head: {hair: 'crop', mouth: q.mouth, blink: q.blink}, tie: true}, {flip: true});
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
    fill(b, 386, 154, 24, 3, PAL.N3); fill(b, 420, 154, 24, 3, PAL.N3); fill(b, 452, 154, 24, 3, PAL.N3);
    sheetRoom(b, 400, 'rest', (x, y) => drawXelSeated(b, x, 186, {}));
    sheetRoom(b, 434, 'talk', (x, y) => drawXelSeated(b, x, 186, {mouth: 'open', hands: 'clasp'}));
    sheetRoom(b, 466, 'lean 2', (x, y) => drawXelSeated(b, x, 186, {lean: 2, mouth: 'open'}));
  }}],
}];
