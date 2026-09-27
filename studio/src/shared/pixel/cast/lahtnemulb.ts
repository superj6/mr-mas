// MR. MAS — cast: LAHTNEMULB, the Senate Judiciary chairman, and THE CLONE (new file, owned by the `v3-art-b` pass).
// naming.md: LAHTNEMULB (alt THE TWO BLUMENTHALS), a cameo: "his cloned voice opens the hearing". Silhouette: a long
// face, full silver hair neatly parted, a charcoal suit and a burgundy tie, index cards. THE CLONE is the same drawing
// made GLOSSY (script sc 15: "a 1-px highlight on his hair, reading with perfect cadence"; the style note's default):
// a hot highlight line along his part, specular points on the face, a sheen down the lapel, every ramp a touch brighter
// and warmer. Never toward photoreal. In a two-shot the chairman is matte and the clone glossy, so they read as two men
// (the script's 15.09 note); the clone always sits at the chairman's left hand, in the better chair (the plates).
//   lahtBust / LAHT_BUST_DEFAULT  112 x 136, 3/4 facing camera-left. arm: 'card' (an index card up, reading) |
//                                 'down' | 'mic' (the hand on the microphone's neck) | 'take' (the clone's hand out,
//                                 taking the card) | 'sheet' (both hands up, the sheet held up). clone: the glossy one.
//                                 cardAt: where the card is (for the take: the plates draw the card in either hand)
//   drawLahtRoom / lahtRoom       room sprite (≈ 80 px), 3/4 facing screen-right (the dais faces left: flip), seated
//                                 behind the dais (the dais overpaints the legs); arm card | down | lean | up (the sheet)
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, Adjust, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {bustHead, suitTorso, plane, SKIN, SUIT, SHIRT_WHITE, HAIR, CIV_W, CIV_H, FaceState, FACE_DEFAULT, roomBody, headStamp, RoomLegs, RoomArm, ROOM_FW, ROOM_FH, ROOM_FOOT} from './civic-kit';

export type LahtArm = 'card' | 'down' | 'mic' | 'take' | 'sheet';
export interface LahtBustState extends FaceState { arm: LahtArm; clone: boolean; }
export const LAHT_BUST_DEFAULT: LahtBustState = {...FACE_DEFAULT, arm: 'card', clone: false};
/** the index card's top-left in the bust (local) for 'card' / 'take': the plates can re-draw the card anywhere */
export const LAHT_CARD: Record<'card' | 'take', [number, number]> = {card: [18, 96], take: [6, 100]};
const HEAD = {long: 3, jaw: 1, age: 2 as const};

/** the index card (16 x 11): ruled, three lines of his handwriting as grey strokes */
export const drawIndexCard = (b: Buf, x: number, y: number, tilt = 0) => {
  for (let j = 0; j < 11; j++) for (let i = 0; i < 16; i++) {
    const X = x + i + (tilt ? Math.floor((j * tilt) / 6) : 0), Y = y + j;
    b.set(X, Y, j === 0 || i === 0 ? PAL.W9 : i === 15 || j === 10 ? PAL.P0 : j === 2 ? PAL.R3 : (j === 5 || j === 8) && i > 1 && i < 13 && (i + j) % 5 !== 0 ? PAL.G4 : PAL.P2);
  }
};

const bustFig = (s: LahtBustState): FigureDef => {
  const hd = bustHead(HEAD, s, {browCol: s.clone ? PAL.G5 : PAL.G3, browHeavy: true});
  const tor = suitTorso({kind: 'suit'});
  const parts: Part[] = [...tor.parts, ...hd.parts,
    // the hair: full, silver, parted high on the near side and combed across in one neat wave, a sideburn to the ear
    {group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(44, 37, 46, 29, 53, 22, 63, 17, 75, 17, 84, 22, 89, 31, 90, 42, 89, 52, 86, 51, 85, 42, 81, 37, 73, 33, 64, 33, 56, 34, 50, 37, 46, 41)]},
  ];
  const adjust: Adjust[] = [...tor.adjust, ...hd.adjust,
    plane('hair', 4, P.poly(46, 34, 50, 27, 58, 22, 66, 20, 60, 25, 52, 31)),
    plane('hair', 2, P.line(60, 28, 80, 26), P.line(70, 31, 86, 34), P.line(64, 20, 82, 22)),
    // the part: a dark line where the comb went, the wave's crest lit beside it
    plane('hair', 1, P.line(66, 19, 84, 25)),
    plane('hair', 1, P.poly(85, 42, 89, 44, 89, 52, 86, 51)),
  ];
  const stamps: Stamp[] = [...tor.stamps, ...hd.stamps];
  if (s.clone) {
    // THE CLONE's gloss: the 1-px hot highlight along the part (the script's tell), specular points, the lapel sheen
    stamps.push({x: 50, y: 24, rows: [
      '..............WWWW......',
      '.........WWWWW....WW....',
      '.....WWWW...........W...',
      '..WWW...................',
      'WW......................',
    ], pal: {W: PAL.W9}});
    stamps.push({x: 50, y: 32, rows: ['WW.', '.W.'], pal: {W: PAL.P2}});
    stamps.push({x: 39, y: 58, rows: ['W'], pal: {W: PAL.W9}});
    stamps.push({x: 53, y: 57, rows: ['.W', 'W.'], pal: {W: PAL.P2}});
    stamps.push({x: 49, y: 104, rows: ['W....', '.W...', '..W..', '..W..', '...W.', '...W.', '....W'], pal: {W: PAL.G5}});
  }
  if (s.arm === 'card' || s.arm === 'take') {
    const take = s.arm === 'take';
    parts.push(
      {group: 'sleeve', mat: 'suit', tone: 2, prims: [take ? P.poly(-4, 140, 4, 118, 14, 106, 24, 110, 18, 124, 8, 146) : P.poly(8, 150, 14, 126, 24, 112, 36, 116, 30, 130, 24, 150)]},
      {group: 'cuff', mat: 'shirt', tone: 3, prims: [take ? P.poly(12, 106, 16, 102, 24, 106, 22, 110) : P.poly(24, 112, 28, 108, 36, 112, 34, 116)]},
    );
    adjust.push(plane('suit', 3, take ? P.poly(-2, 134, 5, 118, 13, 108, 15, 110, 8, 124, 2, 140) : P.poly(10, 146, 15, 127, 24, 114, 27, 115, 19, 130, 14, 150)));
    // his fingers on the card's bottom edge (the card itself is painted after the figure: lahtBust)
    stamps.push({x: take ? 12 : 22, y: take ? 104 : 104, rows: ['.oooo.', 'oLLLlo', 'olllmo', '.oooo.'], pal: {o: PAL.S0, L: PAL.S5, l: PAL.S4, m: PAL.S3}});
  } else if (s.arm === 'mic') {
    parts.push({group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(10, 150, 18, 128, 30, 120, 40, 124, 34, 136, 28, 150)]});
    stamps.push({x: 30, y: 116, rows: ['.oooo.', 'oLLLlo', 'olllmo', '.oooo.'], pal: {o: PAL.S0, L: PAL.S5, l: PAL.S4, m: PAL.S3}});
  } else if (s.arm === 'sheet') {
    parts.push(
      {group: 'sleeve', mat: 'suit', tone: 2, prims: [P.poly(2, 150, 8, 120, 16, 96, 26, 98, 22, 124, 18, 150)]},
      {group: 'sleeve2', mat: 'suit', tone: 1, prims: [P.poly(96, 150, 98, 122, 102, 100, 110, 100, 110, 126, 110, 150)]},
    );
  }
  return {w: CIV_W, h: CIV_H, parts, adjust, stamps};
};
const TIE = [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.S6];
const rigOf = (clone: boolean): LightRig => ({
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'cuff', 'tie', 'throat'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: clone ? PAL.S5 : PAL.S3, suit: clone ? PAL.G4 : PAL.G2, hair: clone ? PAL.P2 : PAL.G5},
  ramps: clone ? {
    skin: [PAL.S0, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9],
    hair: [PAL.N1, PAL.G4, PAL.G5, PAL.G6, PAL.P2, PAL.W9],
    suit: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5, PAL.G6],
    shirt: [PAL.N2, PAL.G5, PAL.P1, PAL.P2, PAL.W9, PAL.W9], cuff: SHIRT_WHITE,
    tie: [PAL.N0, PAL.R1, PAL.R2, PAL.R3, PAL.S6, PAL.W9],
  } : {skin: SKIN.light, hair: HAIR.silver, suit: SUIT.charcoal, shirt: SHIRT_WHITE, cuff: SHIRT_WHITE, tie: TIE},
});
export const lahtBust = memo((s: LahtBustState): Img => {
  const img = renderFigure(bustFig(s), rigOf(s.clone));
  if (s.arm === 'card' || s.arm === 'take') {
    const b = new Buf(img.w, img.h, 0x1000000);
    const [cx, cy] = LAHT_CARD[s.arm];
    drawIndexCard(b, cx, cy, s.arm === 'take' ? 1 : 0);
    // his fingertips stay over the card's bottom edge
    for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) {
      const y = Math.floor(i / img.w), x = i % img.w;
      const fing = y >= (s.arm === 'take' ? 104 : 104) && x >= (s.arm === 'take' ? 12 : 22) && x < (s.arm === 'take' ? 18 : 28);
      if (!fing) img.c[i] = b.c[i];
    }
  }
  return img;
});

// ------------------------------------------------------------------ room sprite
export type LahtRoomArm = 'card' | 'down' | 'lean' | 'up';
export interface LahtRoomPose { arm: LahtRoomArm; mouth: 'rest' | 'open'; clone: boolean; nod?: 0 | 1; legs?: RoomLegs; }
export const LAHT_ROOM_DEFAULT: LahtRoomPose = {arm: 'down', mouth: 'rest', clone: false};
const RHEAD = [
  '....hhhhhhh.....',
  '..hhHHHHHHHhh...',
  '.hHHHHHHHHHHHh..',
  '.hHHHHHHHHHHHo..',
  'hHHHHh2233444o..',
  'hHHHh2234bb4bo..',
  'hHHh22334e44eo..',
  'hHo12233444444o.',
  'hHo122334444445.',
  '.ho1223344444o5.',
  '..o1223344444o..',
  '..o12233444o....',
  '..o1223mmm4o....',
  '...o12233o......',
  '....o1122o......',
  '.....o112o......',
  '.....o112o......',
];
const roomFig = (p: LahtRoomPose): FigureDef => {
  const arm: RoomArm = p.arm === 'card' ? 'card' : p.arm === 'up' ? 'up' : p.arm === 'lean' ? 'reach' : 'down';
  const body = roomBody({kind: 'suit'}, arm, p.legs ?? 'stand', {armF: p.arm === 'up' ? 'spread' : undefined});
  const rows = RHEAD.map((r) => r);
  if (p.mouth === 'open') rows[12] = '..o1223mMm4o....';
  const nod = p.nod ?? 0;
  const stamps: Stamp[] = [...body.stamps, headStamp(rows, body.bob + nod, {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 2], H: ['hair', 3], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  }, p.arm === 'lean' ? 2 : 0)];
  if (p.clone) stamps.push({x: 14, y: body.bob + nod + 1, rows: ['...WWWW.', '.WW....W'], pal: {W: ['gloss', 5]}});
  if (p.arm === 'card') stamps.push({x: 27, y: 25 + body.bob, rows: ['PPPP', 'PggP', 'PPPP'], pal: {P: ['card', 4], g: ['card', 2]}});
  return {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
};
const rlit = (clone: boolean): Record<string, number[]> => ({
  skin: clone ? [PAL.S0, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9] : SKIN.light,
  hair: clone ? [PAL.N1, PAL.G4, PAL.G5, PAL.G6, PAL.P2, PAL.W9] : HAIR.silver,
  suit: clone ? [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5, PAL.G6] : SUIT.charcoal,
  shirt: SHIRT_WHITE, tie: TIE, shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G4],
  card: [PAL.P0, PAL.P0, PAL.G4, PAL.P1, PAL.P2, PAL.W9], gloss: [PAL.W9, PAL.W9, PAL.W9, PAL.W9, PAL.W9, PAL.W9], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
});
const roomRig = (clone: boolean): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.S3, hair: PAL.G5, suit: PAL.G2},
  ramps: rlit(clone),
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});
export const lahtRoom = memo((p: LahtRoomPose): Img => renderFigure(roomFig(p), roomRig(p.clone)));
export const drawLahtRoom = (b: Buf, footX: number, footY: number, p: LahtRoomPose, o: {flip?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, lahtRoom(p), footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip});
};
