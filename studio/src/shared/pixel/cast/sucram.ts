// MR. MAS — cast: SUCRAM, the critic who called it (new file, owned by the `v3-art-b` pass). Character file:
// show/characters/sucram.md. Silhouette: a professor in a tweed blazer and an open collar, round glasses, a phone in one
// hand (mid-post) and a big wooden-handled rubber stamp in the other; the stamp pad on the table. Always leaning
// forward. No appearance jokes (the character file). The stamp's words are the kit's (kits/senate-props.ts stampMark).
//   sucramBust / SUCRAM_BUST_DEFAULT  112 x 136, 3/4 facing camera-left (flip at the witness table: he faces the dais,
//                                     camera-right). arm: 'phone' (typing, eyes down on it) | 'stamp' (the stamp up,
//                                     about to come down) | 'down' (the stare) | 'slam' (the stamp down on the pad)
//   drawSucramRoom / sucramRoom       room sprite (≈ 80 px), seated at the witness table (the table overpaints the legs)
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {bustHead, suitTorso, plane, SKIN, SUIT, SHIRT_BLUE, HAIR, CIV_W, CIV_H, FaceState, FACE_DEFAULT, roomBody, headStamp, RoomLegs, RoomArm, ROOM_FW, ROOM_FH, ROOM_FOOT} from './civic-kit';

export type SucramArm = 'phone' | 'stamp' | 'down' | 'slam';
export interface SucramBustState extends FaceState { arm: SucramArm; }
export const SUCRAM_BUST_DEFAULT: SucramBustState = {...FACE_DEFAULT, arm: 'phone', lid: 1};
const HEAD = {jaw: 2, age: 1 as const, dy: 1};

/** the stamp, at bust scale: a turned wooden handle with a knob, the rubber block under it (text-side down) */
export const drawStampProp = (b: Buf, x: number, y: number, down = false) => {
  const knob = ['..oooo..', '.oWWwwmo', 'oWwwwwmo', 'owwwwmmo', '.ommmmo.', '..oooo..'];
  knob.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = ({o: PAL.D0, W: PAL.W5, w: PAL.D4, m: PAL.D3} as Record<string, number>)[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
  for (let j = 6; j < 15; j++) { b.set(x + 3, y + j, PAL.D4); b.set(x + 4, y + j, PAL.D3); b.set(x + 2, y + j, PAL.D1); b.set(x + 5, y + j, PAL.D1); }
  // the block: wood with a red rubber face
  for (let j = 15; j < 20; j++) for (let i = -3; i < 11; i++) b.set(x + i, y + j, j === 15 ? PAL.W4 : i === -3 ? PAL.D4 : i === 10 ? PAL.D1 : PAL.D3);
  for (let i = -3; i < 11; i++) b.set(x + i, y + 20, down ? PAL.R1 : PAL.R2);
};

const bustFig = (s: SucramBustState): FigureDef => {
  const hd = bustHead(HEAD, s, {browCol: PAL.B0, browHeavy: true});
  const tor = suitTorso({kind: 'blazer', noTie: true});
  const parts: Part[] = [...tor.parts, ...hd.parts,
    // short dark hair, grey coming in at the temple and over the ear
    {group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(47, 33, 50, 26, 57, 21, 67, 18, 77, 19, 84, 24, 88, 32, 89, 43, 87, 50, 85, 44, 82, 38, 76, 33, 67, 30, 58, 30, 52, 33, 48, 37)]},
    {group: 'temple', mat: 'grey', tone: 3, prims: [P.poly(78, 34, 84, 37, 87, 44, 86, 50, 83, 44, 79, 40)]},
  ];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust,
    plane('hair', 4, P.poly(49, 30, 54, 24, 62, 20, 58, 25, 52, 31)),
    plane('hair', 2, P.line(56, 26, 74, 22), P.line(62, 29, 80, 27), P.line(70, 31, 84, 33)),
    // the tweed: a quiet herringbone (ordered pairs of lit/dark pixels), the elbow-patch colour on the near sleeve
    {prims: [P.map(22, 108, Array.from({length: 40}, (_, j) => Array.from({length: 92}, (_, i) => ((i + (j % 4 < 2 ? j : 3 - j)) % 4 === 0 ? '#' : '.')).join('')))], add: 1, onlyMat: 'suit'},
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps,
    // round glasses: thin black frames, the near lens bigger, a glint on each
    {x: 51, y: 43 + HEAD.dy, rows: [
      '...ffffffff.......',
      '..f........f......',
      '.f..........fffff.',
      'f............f....',
      'f.c..........f....',
      '.f..........f.....',
      '..f........f......',
      '...ffffffff.......',
    ], pal: {f: PAL.N0, c: PAL.W8}},
    {x: 41, y: 44 + HEAD.dy, rows: ['.fffff....', 'f.....ffff', 'f.....f...', 'f.c...f...', '.f...f....', '..fff.....'], pal: {f: PAL.N0, c: PAL.W8}},
  ];
  if (s.arm === 'phone') {
    // both hands up at the chest round the phone: the thumbs on its screen
    parts.push({group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(14, 150, 20, 130, 30, 120, 42, 122, 38, 134, 30, 150)]});
    stamps.push({x: 24, y: 106, rows: [
      '....kkkkkkkk....',
      '...kCCCCCCCCk...',
      '...kCccccccCk...',
      '..okCcCCcccCko..',
      '.oLkCccccccCkLo.',
      'oLLkCccccccCkLLo',
      'olLkkkkkkkkkklLo',
      'olllLLLLLLLLlllo',
      '.ommmmmmmmmmmmo.',
      '..oooooooooooo..',
    ], pal: {k: PAL.N0, C: PAL.C5, c: PAL.C3, o: PAL.S0, L: PAL.S4, l: PAL.S3, m: PAL.S2}});
  } else if (s.arm === 'stamp' || s.arm === 'slam') {
    // the stamp gripped by its handle: raised to the shoulder ('stamp') or brought down to the pad ('slam')
    const up = s.arm === 'stamp';
    parts.push({group: 'sleeve', mat: 'suit', tone: 2, prims: [up ? P.poly(6, 136, 10, 116, 16, 100, 28, 100, 30, 116, 26, 136) : P.poly(8, 136, 14, 126, 24, 118, 36, 122, 32, 136)]});
    adjust.push(plane('suit', 4, up ? P.poly(10, 116, 16, 100, 19, 100, 13, 118) : P.poly(14, 126, 24, 118, 26, 119, 16, 128)), plane('suit', 0, up ? P.line(28, 102, 30, 118) : P.line(36, 123, 32, 134)));
    stamps.push({x: up ? 13 : 21, y: up ? 91 : 111, rows: ['..oooooo..', '.oLLhLLLo.', 'oLlLlLlLlo', 'oLlLlLlLmo', 'olmlmlmmmo', '.ommmmmmo.'], pal: {o: PAL.S0, h: PAL.S5, L: PAL.S4, l: PAL.S3, m: PAL.S2}});
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'throat', 'temple'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, suit: PAL.D3, hair: PAL.B3},
  ramps: {skin: SKIN.medium, hair: HAIR.dark, grey: HAIR.grey, suit: SUIT.tweed, shirt: SHIRT_BLUE},
};
export const sucramBust = memo((s: SucramBustState): Img => {
  const img = renderFigure(bustFig(s), RIG);
  if (s.arm === 'stamp' || s.arm === 'slam') {
    // the stamp's block below the fist (the handle is inside it): wood, a lit top edge, the red rubber face down
    const up = s.arm === 'stamp';
    const bx = up ? 11 : 19, by = up ? 97 : 117;
    for (let j = 0; j < 6; j++) for (let i = 0; i < 14; i++) {
      const X = bx + i, Y = by + j;
      if (X < 0 || Y < 0 || X >= img.w || Y >= img.h) continue;
      img.c[Y * img.w + X] = j === 0 ? PAL.W4 : j === 5 ? PAL.R2 : i === 0 ? PAL.D4 : i === 13 ? PAL.D1 : PAL.D3;
    }
  }
  return img;
});

// ------------------------------------------------------------------ room sprite
export type SucramRoomArm = 'phone' | 'stamp' | 'slam' | 'down';
export interface SucramRoomPose { arm: SucramRoomArm; mouth: 'rest' | 'open'; lean?: boolean; legs?: RoomLegs; }
export const SUCRAM_ROOM_DEFAULT: SucramRoomPose = {arm: 'phone', mouth: 'rest', lean: true};
const RHEAD = [
  '....hhhhhhh.....',
  '..hhHHHHHHHh....',
  '.hHHHHHHHHHHh...',
  '.hHHHHHHHHHHo...',
  'gHHHH2233444o...',
  'ggHH22bbb4bbo...',
  'ggHh2fGffGffo...',
  'gHo12fe4fe4f4o..',
  'hHo1223344444445',
  '.ho122334444444.',
  '..o1223344444o..',
  '..o12233mmm4o...',
  '...o1223344o....',
  '....o11223o.....',
  '.....oo112o.....',
  '......o112o.....',
  '......o112o.....',
];
const roomFig = (p: SucramRoomPose): FigureDef => {
  const arm: RoomArm = p.arm === 'phone' ? 'phone' : p.arm === 'stamp' ? 'up' : p.arm === 'slam' ? 'stamp' : 'down';
  const body = roomBody({kind: 'blazer'}, arm, p.legs ?? 'stand', {armF: p.arm === 'phone' ? 'clasp' : undefined});
  const rows = RHEAD.slice();
  if (p.mouth === 'open') rows[11] = '..o12233mMm4o...';
  const stamps: Stamp[] = [...body.stamps, headStamp(rows, body.bob, {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], g: ['grey', 3], G: ['glass', 4], f: ['dark', 0], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  }, p.lean ? 2 : 0)];
  if (p.arm === 'phone') stamps.push({x: 23, y: 27 + body.bob, rows: ['kkk', 'kCk', 'kkk'], pal: {k: ['dark', 0], C: ['glass', 5]}});
  if (p.arm === 'stamp') stamps.push({x: 28, y: 6 + body.bob, rows: ['.oo.', '.ww.', '.ww.', 'WWWW', 'rrrr'], pal: {o: ['wood', 1], w: ['wood', 3], W: ['wood', 4], r: ['ink', 3]}});
  if (p.arm === 'slam') stamps.push({x: 31, y: 33 + body.bob, rows: ['.oo.', '.ww.', 'WWWW', 'rrrr'], pal: {o: ['wood', 1], w: ['wood', 3], W: ['wood', 4], r: ['ink', 3]}});
  return {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
};
const RLIT: Record<string, number[]> = {
  skin: SKIN.medium, hair: HAIR.dark, grey: HAIR.grey, suit: SUIT.tweed, shirt: SHIRT_BLUE, shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.D4],
  glass: [PAL.N0, PAL.G3, PAL.G4, PAL.G5, PAL.C4, PAL.C6], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
  wood: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4], ink: [PAL.R0, PAL.R1, PAL.R1, PAL.R2, PAL.R3, PAL.R3],
};
const roomRig: LightRig = {
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.S3, hair: PAL.B3, suit: PAL.D3},
  ramps: RLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
};
export const sucramRoom = memo((p: SucramRoomPose): Img => renderFigure(roomFig(p), roomRig));
export const drawSucramRoom = (b: Buf, footX: number, footY: number, p: SucramRoomPose, o: {flip?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, sucramRoom(p), footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip});
};
