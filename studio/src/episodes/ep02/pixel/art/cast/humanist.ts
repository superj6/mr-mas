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
import {makeBust3, makeRoom, BustState, BustSpec3, RoomFigSpec, Expr, Viseme} from './civic2';
import {handParts} from '../../../../../shared/pixel/cast/medium-kit';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {sp, tiny, fill} from '../kit';
import type {ArtAsset} from '../asset';

export interface HumanistBust extends BustState { arm: 'none' | 'box' | 'spread' }
export const HUMANIST_DEFAULT: HumanistBust = {mouth: 'rest', expr: 'neutral', arm: 'none'};
const AMBER = [PAL.D2, PAL.W4, PAL.W6, PAL.W7, PAL.W8, PAL.W9];
const BOX = [PAL.D0, PAL.D2, PAL.D3, PAL.D4, PAL.W4, PAL.W5];
// his own head: long (a tall cranium, a long jaw), a plain, ordinary nose (2026-10-09, the picture review: the art
// pass's long, pointed, shadowed nose on a gaunt face risked reading as an ethnic caricature of a real figure of Syrian
// descent; the caricature is carried by his file's own features instead), open eyes under an arched, EARNEST LIFTED
// brow, a fuller face, a high hairline with a neat side part; the open amber collar and the spread "people first"
// hands are his signature (the NOT A PERSON lanyard comes later, Ep5)
const spec: BustSpec3 = {
  head: {yaw: 26, at: [57, 52], scale: 1.04, cranium: [19, 27, 23], craniumY: -10, cheekW: 15.5, jawW: 13.5, jawY: 21, jawH: 12, chinY: 37, chinW: 6.5, chinZ: 11, cheekbone: 0.7, full: 0.55, brow: 1.8, socket: 1.0,
    nose: {tipY: 14, proj: 5.5, wing: 3.6, tip: 2.8, hook: 0}, mouthY: 25, lips: 0.8, muzzle: 12, eyeX: 8.5, neck: {r: 8.5, throat: true}, hair: {style: 'side', thick: 2.4, line: -22, side: -1},
    skin: SKIN.light, hairRamp: HAIR.dark, back: {skin: PAL.S3, hair: PAL.G3}},
  face: {eye: 'almond', eyeW: 8, eyeH: 2, brow: 'arched', browCol: PAL.B0, mouthW: 9, age: 1},
  torso: {kind: 'blazer', noTie: true},
  // earnest: the brows lifted at rest and in the polite smile
  expr: {neutral: {eye: 'open', brow: 'up', mouth: 'rest'}, smile: {eye: 'crinkle', brow: 'up', mouth: 'smile', pose: {cheekUp: 0.8}}},
  extras: (s) => {
    if (s.arm === 'spread') {
      // "people first": both forearms up and out from the elbows at his sides, the hands open, palms toward us
      // (the open palms themselves are stamped over the render: humanistBust)
      return {parts: [{group: 'slvL', mat: 'suit', tone: 3, prims: [P.poly(8, 150, 10, 124, 22, 116, 30, 124, 26, 150)]}, {group: 'slvR', mat: 'suit', tone: 2, prims: [P.poly(104, 150, 102, 124, 90, 116, 82, 124, 86, 150)]}]};
    }
    if (s.arm !== 'box') return {};
    // the box at his chest, both hands round its near corners (the box's front is painted after: humanistBust)
    const l = handParts('hl', {at: [26, 130], dir: [0.45, -0.9], thumb: -1, curl: 0.5, len: 12, width: 10});
    const r = handParts('hr', {at: [94, 130], dir: [-0.35, -0.94], thumb: 1, curl: 0.5, len: 12, width: 10});
    return {parts: [{group: 'slvL', mat: 'suit', tone: 2, prims: [P.poly(14, 150, 18, 128, 28, 124, 34, 132, 28, 150)]}, {group: 'slvR', mat: 'suit', tone: 1, prims: [P.poly(102, 150, 100, 128, 92, 124, 86, 132, 94, 150)]}, ...l.parts, ...r.parts], adjust: [...l.adjust, ...r.adjust]};
  },
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: SUIT.slate, shirt: AMBER, tie: AMBER, throat: SKIN.light},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.N5},
};
const bust = makeBust3<HumanistBust>(spec);
/** the box (bust scale): kraft, taped, its label faded, `DEFLECTION (LICENSED)` */
const drawBoxB = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 30; j++) for (let i = 0; i < 64; i++) b.set(x + i, y + j, j < 2 ? BOX[4] : i < 2 ? BOX[3] : i > 61 ? BOX[1] : BOX[3]);
  fill(b, x + 26, y, 12, 30, BOX[2]); fill(b, x + 26, y, 12, 1, BOX[4]);
  fill(b, x + 6, y + 9, 52, 13, PAL.P1); fill(b, x + 6, y + 9, 52, 1, PAL.P2); fill(b, x + 6, y + 21, 52, 1, PAL.P0);
  tiny(b, 'DEFLECTION', x + 9, y + 10, PAL.G4); tiny(b, '(LICENSED)', x + 10, y + 16, PAL.G4);
};
/** an open palm toward us, fingers up (bust scale, 12 x 20): the palm, four fingers (the middle two longest) with a
 *  shadow between them, the thumb toward the side `out` (-1 left, 1 right: palms toward us, the thumbs point in), the wrist's crease; lit, so it reads as a
 *  hand held open ("people first"), never a paw */
const openPalm = (c: Int32Array, w: number, x: number, y: number, out: -1 | 1) => {
  const S = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6];
  const set = (X: number, Y: number, v: number) => { if (X >= 0 && Y >= 0 && X < w && Y < c.length / w) c[Y * w + X] = v; };
  for (let j = 0; j < 9; j++) for (let i = 0; i < 11; i++) set(x + i, y + 11 + j, j === 8 ? S[1] : i === 0 || i === 10 ? S[2] : j < 2 ? S[4] : S[3]);
  const L = [7, 10, 11, 8];
  for (let f = 0; f < 4; f++) {
    const fx = x + (out > 0 ? 8 - f * 3 : f * 3) + (out > 0 ? 0 : 0);
    const len = L[out > 0 ? 3 - f : f];
    for (let j = 1; j <= len; j++) { set(fx, y + 11 - j, j === len ? S[4] : S[3]); set(fx + 1, y + 11 - j, j === len ? S[3] : S[2]); }
  }
  for (let j = 0; j < 6; j++) { const tx = out > 0 ? x + 11 + Math.floor(j / 2) : x - 1 - Math.floor(j / 2); set(tx, y + 18 - j, S[3]); set(tx + (out > 0 ? -1 : 1), y + 18 - j, S[2]); }
  for (let i = 2; i < 9; i++) set(x + i, y + 15, S[2]);
};
export const humanistBust = (s: Partial<HumanistBust> = {}) => {
  const st = {...HUMANIST_DEFAULT, ...s};
  const img = bust(st);
  if (st.arm === 'spread') {
    const c = new Int32Array(img.c);
    openPalm(c, img.w, 8, 98, 1); openPalm(c, img.w, 93, 98, -1);
    return {w: img.w, h: img.h, c};
  }
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
  stills: [{label: 'busts: caught out with his box (worry) · "Is there room?" (talk E) · polite smile · talking (O); room: carry, walk, down', draw: (b) => {
    sheetPlate(b, [PAL.N1, PAL.N1, PAL.N2, PAL.N2]);
    sheetBust(b, humanistBust(e('worry', 'rest', 'box')), -8, 50, 'caught out + box');
    sheetBust(b, humanistBust(e('worry', 'E')), 88, 50, 'is there room? (E)');
    sheetBust(b, humanistBust(e('smile')), 184, 50, 'polite smile');
    sheetBust(b, humanistBust(e('neutral', 'O', 'spread')), 280, 50, 'people first (O)');
    sheetRoom(b, 402, 'carry', (x, y) => drawHumanistRoom(b, x, y, {arm: 'carry'}));
    sheetRoom(b, 436, 'walk', (x, y) => drawHumanistRoom(b, x, y, {arm: 'carry', legs: 'w1'}));
    sheetRoom(b, 466, 'down', (x, y) => drawHumanistRoom(b, x, y, {arm: 'down', mouth: 'open'}));
    void sp;
  }}],
}];
