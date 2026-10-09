// MR. MAS — Ep2 v1 art: THE HUMANIST (Macrosoft's new AI chief; manifest §2.2; sc 7). characters/the-humanist.md:
// tall, earnest, an open-necked shirt; Macrosoft slate with a warm "humanist" amber. Here: a slate blazer over an amber-
// cream open collar, neat short dark hair, an earnest long face; polite, a little caught out. No accent humour; no
// likeness (the caricature is the slate, the amber and the boxes). Sc 7: carrying his DEFLECTION (LICENSED) boxes in,
// turning to the doorway.
//   humanistBust(s)                 112 x 136, faces camera-left. s: {mouth, expr, arm: 'none' | 'box'} (the box held
//                                   in front at the chest, hands at its sides, its faded label legible at 4x)
//   drawHumanistRoom(b, x, y, pose) ≈ 84 px (tall), faces screen-right. pose {arm: 'down' | 'carry' | 'up' (looking up
//                                   through the floors, a hand on the box), mouth, legs}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, HAIR, SUIT} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust, makeRoom, plane, bustHair, BustState, CivicSpec, RoomFigSpec, Expr, Viseme} from './civic2';
import {handParts} from '../../../../../shared/pixel/cast/medium-kit';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {sp, tiny, fill} from '../kit';
import type {ArtAsset} from '../asset';

export interface HumanistBust extends BustState { arm: 'none' | 'box' }
export const HUMANIST_DEFAULT: HumanistBust = {mouth: 'rest', expr: 'neutral', arm: 'none'};
const AMBER = [PAL.D2, PAL.W4, PAL.W6, PAL.W7, PAL.W8, PAL.W9];
const BOX = [PAL.D0, PAL.D2, PAL.D3, PAL.D4, PAL.W4, PAL.W5];
const spec: CivicSpec = {
  head: {long: 4, soft: true},
  torso: {kind: 'blazer', noTie: true},
  browCol: PAL.B0,
  hair: () => bustHair('side'),
  extras: (s) => {
    if (s.arm !== 'box') return {};
    // the box at his chest, both hands round its near corners (the box's front is painted after: humanistBust)
    const l = handParts('hl', {at: [26, 130], dir: [0.45, -0.9], thumb: -1, curl: 0.5, len: 12, width: 10});
    const r = handParts('hr', {at: [94, 130], dir: [-0.35, -0.94], thumb: 1, curl: 0.5, len: 12, width: 10});
    return {parts: [{group: 'slvL', mat: 'suit', tone: 2, prims: [P.poly(14, 150, 18, 128, 28, 124, 34, 132, 28, 150)]}, {group: 'slvR', mat: 'suit', tone: 1, prims: [P.poly(102, 150, 100, 128, 92, 124, 86, 132, 94, 150)]}, ...l.parts, ...r.parts], adjust: [...l.adjust, ...r.adjust]};
  },
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.slate, shirt: AMBER, tie: AMBER, throat: SKIN.light},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.N5},
};
const bust = makeBust<HumanistBust>(spec);
/** the box (bust scale): kraft, taped, its label faded, `DEFLECTION (LICENSED)` */
const drawBoxB = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 30; j++) for (let i = 0; i < 64; i++) b.set(x + i, y + j, j < 2 ? BOX[4] : i < 2 ? BOX[3] : i > 61 ? BOX[1] : BOX[3]);
  fill(b, x + 26, y, 12, 30, BOX[2]); fill(b, x + 26, y, 12, 1, BOX[4]);
  fill(b, x + 6, y + 9, 52, 13, PAL.P1); fill(b, x + 6, y + 9, 52, 1, PAL.P2); fill(b, x + 6, y + 21, 52, 1, PAL.P0);
  tiny(b, 'DEFLECTION', x + 9, y + 10, PAL.G4); tiny(b, '(LICENSED)', x + 10, y + 16, PAL.G4);
};
export const humanistBust = (s: Partial<HumanistBust> = {}) => {
  const st = {...HUMANIST_DEFAULT, ...s};
  const img = bust(st);
  if (st.arm !== 'box') return img;
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  drawBoxB(b, 28, 112);
  // the fingers wrap the box's sides: hand pixels in the two side strips stay on top
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) { const x = i % img.w; if (!((x < 34 || x > 86) && out.c[i] >= 0 && Math.floor(i / img.w) > 116)) out.c[i] = b.c[i]; }
  return out;
};

// ------------------------------------------------------------------ room
export interface HumanistRoomPose { arm: 'down' | 'carry' | 'up'; mouth: 'rest' | 'open' | 'smile'; legs?: 'stand' | 'w0' | 'w1' | 'w2' | 'w3'; blink?: boolean }
const rspec: RoomFigSpec = {
  kind: 'blazer', legMat: 'trou',
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.slate, shirt: AMBER, tie: AMBER, trou: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], box: BOX},
  backRamp: {skin: PAL.S3, suit: PAL.N5},
  extras: (p, bob) => (p.arm === 'down' ? {} : {stamps: [{x: 18, y: 28 + bob, rows: ['bbbbbbbbbbbbbbbb', 'BBBBBBTTBBBBBBBB', 'BBBBBBTTBBBBBBBB', 'BBLLLLLLLLLLBBBB', 'BBLLLLLLLLLLBBBB', 'BBBBBBTTBBBBBBBB', 'BBBBBBTTBBBBBBBB', 'BBBBBBTTBBBBBBBB', 'dddddddddddddddd'], pal: {b: ['box', 4], B: ['box', 3], T: ['box', 2], L: ['label', 3], d: ['box', 1]} as never}]}),
};
(rspec.ramps as Record<string, number[]>).label = [PAL.P0, PAL.P0, PAL.P0, PAL.P1, PAL.P1, PAL.P2];
const room = makeRoom(rspec);
export const drawHumanistRoom = (b: Buf, footX: number, footY: number, p: Partial<HumanistRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: HumanistRoomPose = {arm: 'carry', mouth: 'rest', ...p};
  room.draw(b, footX, footY, {arm: q.arm === 'down' ? 'down' : 'reach', armF: q.arm === 'down' ? undefined : 'clasp', legs: q.legs, nod: q.arm === 'up' ? 0 : 1, head: {hair: 'short', mouth: q.mouth, blink: q.blink}}, o);
};

const e = (x: Expr, m: Viseme = 'rest', arm: HumanistBust['arm'] = 'none'): HumanistBust => ({mouth: m, expr: x, arm});
export const ART: ArtAsset[] = [{
  id: 'char-humanist', manifest: '§2.2 THE HUMANIST', kind: 'character', name: 'THE HUMANIST (Macrosoft\'s new AI chief)',
  file: 'cast/humanist.ts', exports: 'humanistBust, drawHumanistRoom, HUMANIST_DEFAULT', scenes: '7',
  note: 'slate blazer, amber open collar; caught out (worry), polite (smile), talking; carries the DEFLECTION (LICENSED) boxes',
  stills: [{label: 'busts: caught out with his box (worry) · "Is there room?" (talk E) · polite smile · neutral; room: carry, walk, down', draw: (b) => {
    sheetPlate(b, [PAL.N1, PAL.N1, PAL.N2, PAL.N2]);
    sheetBust(b, humanistBust(e('worry', 'rest', 'box')), -8, 50, 'caught out + box');
    sheetBust(b, humanistBust(e('worry', 'E')), 88, 50, 'is there room? (E)');
    sheetBust(b, humanistBust(e('smile')), 184, 50, 'polite smile');
    sheetBust(b, humanistBust(e('neutral', 'O')), 280, 50, 'talk O');
    sheetRoom(b, 402, 'carry', (x, y) => drawHumanistRoom(b, x, y, {arm: 'carry'}));
    sheetRoom(b, 436, 'walk', (x, y) => drawHumanistRoom(b, x, y, {arm: 'carry', legs: 'w1'}));
    sheetRoom(b, 466, 'down', (x, y) => drawHumanistRoom(b, x, y, {arm: 'down', mouth: 'open'}));
    void sp;
  }}],
}];
