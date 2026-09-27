// MR. MAS — cast: SIRRAH, the Ep1 vice president (new file, owned by the `v3-art-b` pass). Character file:
// show/characters/sirrah.md. Silhouette: a tailored pantsuit (plum here: off every party colour), a pearl strand, full
// shoulder-length dark hair; at a lectern or the head of a table with a POINTER, like a teacher; the plain lanyard with
// a handwritten `CZAR?` sticky note (guardrails §2a rule 10). Her prop is the A and I blocks (kits/wh-props.ts).
// The character file's rule: no gags about her laugh, her voice or her mannerisms; the roast is on public statements.
//   sirrahBust / SIRRAH_BUST_DEFAULT  112 x 136, 3/4 facing camera-left. arm: 'point' (the pointer hand forward:
//                                     SIRRAH_POINTER_HAND is where it grips; drawPointer lays the pointer to any
//                                     target, so it lands on A, then on I) | 'down'. Six mouths, three lids, a dart.
//   drawSirrahRoom / sirrahRoom       room sprite (≈ 80 px), 3/4 facing screen-right; arm point | down | clasp;
//                                     SIRRAH_ROOM_HAND for the pointer
//   drawPointer                       the pointer itself (wood, a black rubber tip), from a hand to a tip, 1 or 2 px
import {Buf, line} from '../px';
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {tiny} from '../rooms/kit-b';
import {bustHead, suitTorso, plane, SKIN, SUIT, HAIR, CIV_W, CIV_H, FaceState, FACE_DEFAULT, roomBody, headStamp, RoomLegs, ROOM_FW, ROOM_FH, ROOM_FOOT, roomHand} from './civic-kit';

export type SirrahArm = 'point' | 'down';
export interface SirrahBustState extends FaceState { arm: SirrahArm; }
export const SIRRAH_BUST_DEFAULT: SirrahBustState = {...FACE_DEFAULT, mouth: 'smile', arm: 'point'};
/** where her hand grips the pointer in the bust (local): drawPointer from here */
export const SIRRAH_POINTER_HAND: [number, number] = [6, 108];
const HEAD = {soft: true, dy: 1};

const bustFig = (s: SirrahBustState): FigureDef => {
  const hd = bustHead(HEAD, s, {eye: 'lash', browCol: PAL.B0, lipCol: PAL.S2});
  const tor = suitTorso({kind: 'pantsuit'});
  const parts: Part[] = [
    // the hair behind the head: full, to the shoulders, falling behind the neck and over the far shoulder
    {group: 'hairB', mat: 'hair', tone: 2, prims: [P.poly(44, 36, 48, 26, 56, 18, 66, 14, 78, 15, 88, 22, 94, 32, 97, 46, 98, 62, 99, 78, 100, 92, 97, 104, 88, 108, 80, 104, 76, 96, 74, 84, 72, 70)]},
    ...tor.parts, ...hd.parts,
    // the front: a side part, the hair sweeping across the forehead and down past the near cheek (the ear covered)
    {group: 'hairF', mat: 'hair', tone: 3, prims: [P.poly(43, 40, 45, 31, 51, 24, 60, 19, 70, 17, 80, 19, 86, 26, 89, 36, 90, 50, 89, 64, 88, 78, 85, 90, 80, 96, 77, 88, 78, 74, 78, 60, 76, 46, 72, 36, 64, 30, 56, 30, 50, 34, 46, 41)]},
  ];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust,
    // the hair's lit crown and the wave along the part; the strands' dark partings; the underside in shadow
    plane('hair', 4, P.poly(48, 30, 54, 24, 62, 20, 70, 19, 64, 23, 56, 28, 50, 33)),
    plane('hair', 5, P.line(52, 27, 60, 21)),
    plane('hair', 1, P.line(64, 22, 80, 30), P.line(72, 22, 86, 34), P.line(80, 38, 86, 60), P.line(83, 62, 84, 86)),
    plane('hair', 1, P.poly(88, 50, 98, 56, 99, 90, 96, 102, 90, 104, 88, 80)),
    plane('hair', 4, P.line(46, 36, 50, 31)),
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  // the pearl strand at the shell's neckline (each pearl a lit bead with its own shade)
  const pearls: Array<[number, number]> = [[50, 99], [54, 101], [58, 103], [62, 103], [66, 102], [70, 100]];
  for (const [x, y] of pearls) stamps.push({x, y, rows: ['.P.', 'WPg', '.g.'], pal: {W: PAL.W9, P: PAL.P2, g: PAL.G5}});
  // the lanyard: a plain cord to a yellow sticky note, `CZAR?` in her hand, a little crooked
  stamps.push({x: 53, y: 104, rows: ['c.........c', '.c.......c.', '.c.......c.', '..c.....c..', '..c.....c..', '...c...c...', '...c...c...'], pal: {c: PAL.G5}});
  if (s.arm === 'point') {
    // the pointer arm comes forward across her body at chest height: the upper arm down her side, the forearm out
    // toward camera-left (lit along its top, a dark line under it), the jacket's cuff, then the fist
    parts.push(
      {group: 'upper', mat: 'suit', tone: 2, prims: [P.poly(20, 136, 24, 118, 34, 112, 40, 118, 36, 136)]},
      {group: 'fore', mat: 'suit', tone: 2, prims: [P.poly(16, 110, 30, 116, 38, 122, 36, 130, 26, 126, 12, 118)]},
    );
    adjust.push(
      plane('suit', 4, P.poly(16, 110, 30, 116, 36, 120, 34, 121, 28, 118, 14, 112)),
      plane('suit', 3, P.poly(14, 112, 28, 118, 34, 121, 33, 123, 26, 120, 13, 114)),
      plane('suit', 1, P.poly(12, 118, 26, 125, 34, 129, 30, 130, 22, 126, 12, 120)),
      plane('suit', 3, P.poly(24, 118, 34, 112, 36, 113, 28, 120)),
    );
    // the fist round the pointer (hand-pixelled: four knuckles, the thumb over the top)
    stamps.push({x: 4, y: 105, rows: [
      '...oooo...',
      '..oLLhLo..',
      '.oLLLLLLo.',
      'oLlLlLlLlo',
      'oLlLlLlLmo',
      'olmlmlmmmo',
      '.ommmmmmo.',
      '..oooooo..',
    ], pal: {o: PAL.S0, h: PAL.S5, L: PAL.S4, l: PAL.S3, m: PAL.S2}});
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'shell'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S2, suit: PAL.U3, hair: PAL.B3},
  ramps: {skin: SKIN.deep, hair: HAIR.dark, suit: SUIT.plum, shirt: [PAL.N2, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2]},
};
const note = (img: Img, x: number, y: number, crooked: boolean) => {
  // the sticky note, painted after the figure (it sits on the lapel): a yellow square, a darker fold, CZAR?
  const b = new Buf(img.w, img.h, 0);
  const W = 25, H = 13;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const X = x + i + (crooked ? Math.floor(j / 6) : 0), Y = y + j;
    const c = j === 0 ? PAL.W8 : i === W - 1 || j === H - 1 ? PAL.W5 : PAL.W7;
    if (X >= 0 && Y >= 0 && X < img.w && Y < img.h) img.c[Y * img.w + X] = c;
  }
  tiny(b, 'CZAR?', 3, 4, 0x010101);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (b.get(i, j) === 0x010101) { const X = x + i + (crooked ? Math.floor(j / 6) : 0), Y = y + j; img.c[Y * img.w + X] = PAL.N1; }
};
export const sirrahBust = memo((s: SirrahBustState): Img => {
  const img = renderFigure(bustFig(s), RIG);
  note(img, 49, 110, true);
  return img;
});

// ------------------------------------------------------------------ the pointer
/** the teacher's pointer: varnished wood with a lit edge, a black rubber tip; `thick` 2 px at insert/MCU scale */
export const drawPointer = (b: Buf, hx: number, hy: number, tx: number, ty: number, thick: 1 | 2 = 2) => {
  const L = Math.hypot(tx - hx, ty - hy) || 1;
  const n = Math.ceil(L);
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = Math.round(hx + (tx - hx) * t), y = Math.round(hy + (ty - hy) * t);
    const tip = L - k * (L / n) < 4;
    b.set(x, y, tip ? PAL.N0 : PAL.W4);
    if (thick === 2) b.set(x, y + 1, tip ? PAL.N0 : PAL.D3);
  }
};

// ------------------------------------------------------------------ room sprite
export type SirrahRoomArm = 'point' | 'down' | 'clasp';
export interface SirrahRoomPose { legs: RoomLegs; arm: SirrahRoomArm; mouth: 'rest' | 'open' | 'smile'; }
export const SIRRAH_ROOM_DEFAULT: SirrahRoomPose = {legs: 'stand', arm: 'point', mouth: 'smile'};
/** her near hand in 'point' (local, unflipped): the plates lay the pointer from here to the block */
export const SIRRAH_ROOM_HAND: [number, number] = roomHand('point', 'n');
const RHEAD = [
  '....hhhhhhh.....',
  '..hhHHHHHHHhh...',
  '.hHHHHHHHHHHHh..',
  'hHHHHHHHH3HHHh..',
  'hHHHHH23344HHho.',
  'hHHHH2234bb4bo..',
  'hHHH22334e44eo..',
  'hHHH2233444444o.',
  'hHHh22334444445.',
  'hHHo22334444444.',
  'hHHho2233444o...',
  'hHHho122mmm4o...',
  '.hHh.o12233o....',
  '.hHh..o1122o....',
  '..hh..ww112o....',
  '......oPPPPo....',
  '......o11o......',
];
const roomFig = (p: SirrahRoomPose): FigureDef => {
  const body = roomBody({kind: 'pantsuit'}, p.arm === 'point' ? 'point' : p.arm === 'clasp' ? 'clasp' : 'down', p.legs);
  const rows = RHEAD.slice();
  if (p.mouth === 'open') rows[11] = 'hHHho122mMm4o...';
  if (p.mouth === 'rest') rows[11] = 'hHHho1223mm4o...';
  const stamps = [...body.stamps, headStamp(rows, body.bob, {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0], w: ['pearl', 4], P: ['pearl', 4],
  })];
  // the lanyard's note on her chest: two yellow pixels and a third (unreadable at room scale, on purpose)
  stamps.push({x: 20, y: 24 + body.bob, rows: ['c.c', '.c.', 'yy.', 'yY.'], pal: {c: ['pearl', 3], y: ['note', 3], Y: ['note', 4]}});
  return {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
};
const RLIT: Record<string, number[]> = {
  skin: SKIN.deep, hair: HAIR.dark, suit: SUIT.plum, shirt: [PAL.N2, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.U1, PAL.U2, PAL.U3], pearl: [PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2, PAL.W9],
  note: [PAL.W4, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const roomRig: LightRig = {
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.S2, hair: PAL.B3, suit: PAL.U3},
  ramps: RLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
};
export const sirrahRoom = memo((p: SirrahRoomPose): Img => renderFigure(roomFig(p), roomRig));
export const drawSirrahRoom = (b: Buf, footX: number, footY: number, p: SirrahRoomPose, o: {flip?: boolean; clip?: (x: number, y: number) => boolean} = {}): [number, number] => {
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  const x = footX - fx, y = footY - ROOM_FOOT[1];
  blitImg(b, sirrahRoom(p), x, y, {flip: o.flip, clip: o.clip});
  const [hx, hy] = SIRRAH_ROOM_HAND;
  return [x + (o.flip ? ROOM_FW - 1 - hx : hx), y + hy];
};
void line;
