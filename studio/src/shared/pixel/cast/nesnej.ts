// MR. MAS — cast: NESNEJ, at the rooftop signing (Ep1 sc 17; new file, owned by the `v3-art-b` pass). Character file:
// show/characters/nesnej.md: a sharp black leather jacket, a stage-ready stance with the arms spread as if presenting a
// chip the size of a tray; full silver hair swept back; the big grin; the brass register that appears from nowhere
// (kits/register.ts). The face and jacket GEOMETRY is the approved roll-call portrait's (cast/rollcall.ts nesnejFig,
// 124 x 150, copied here because it is not exported; rollcall.ts is not edited), re-lit for the open rooftop (a warm
// white sun from camera-left, the blue sky as a back rim) and given what sc 17 needs: both arms spread (the gift), one
// hand pressing a key, and mouths for his one real line. The roll call faces camera-RIGHT; the OTS from behind Mario
// puts him at frame right facing left: pass flip (nothing on him carries lettering).
//   nesnejBust / NESNEJ_BUST_DEFAULT  124 x 150. arm: 'spread' | 'key' (the near hand down on the register's key)
//                                     | 'down'. mouth: 'grin' | 'A' | 'E' | 'O' | 'M'. light: 'sun' | 'screen'
//   drawNesnejRoom / nesnejRoom       room sprite (≈ 80 px), 3/4 facing screen-right: arm spread | key | down | up
//                                     (the chip held up against the CUT LINE, the tag's monitor egg)
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo} from './kit';
import {HAIR, roomBody, headStamp, RoomArm, RoomLegs, ROOM_FW, ROOM_FH, ROOM_FOOT} from './civic-kit';

export const NESNEJ_BW = 124, NESNEJ_BH = 150;
export type NesnejArm = 'spread' | 'key' | 'down';
export type NesnejMouth = 'grin' | 'A' | 'E' | 'O' | 'M';
export interface NesnejBustState { arm: NesnejArm; mouth: NesnejMouth; blink: boolean; light: 'sun' | 'screen'; }
export const NESNEJ_BUST_DEFAULT: NesnejBustState = {arm: 'spread', mouth: 'grin', blink: false, light: 'sun'};
/** the near hand's fingertip in 'key' (local, unflipped): the register's key sits under it */
export const NESNEJ_KEY_TIP: [number, number] = [104, 148];
const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});

const bustFig = (s: NesnejBustState): FigureDef => {
  const parts: Part[] = [
    {group: 'jacket', mat: 'leather', tone: 2, prims: [P.poly(0, 150, 2, 128, 14, 118, 32, 111, 50, 108, 66, 110, 84, 114, 98, 122, 108, 134, 112, 150)]},
    {group: 'tee', mat: 'tee', tone: 2, prims: [P.poly(44, 108, 52, 112, 60, 114, 68, 111, 64, 128, 56, 136, 48, 124)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(46, 88, 46, 108, 56, 114, 66, 108, 68, 88)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [P.poly(
      40, 44, 48, 38, 58, 36, 68, 38, 75, 44, 78, 52, 79, 58, 78, 62, 82, 69, 83, 71, 80, 73, 79, 75, 80, 77, 80, 82, 79, 86, 76, 92,
      70, 97, 62, 99, 54, 97, 48, 92, 44, 84, 42, 74, 39, 64, 38, 54)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [P.poly(40, 64, 44, 60, 48, 62, 49, 70, 47, 78, 42, 79, 39, 72)]},
    {group: 'hair', mat: 'silver', tone: 3, prims: [P.poly(
      36, 66, 33, 56, 34, 46, 40, 36, 50, 29, 62, 27, 72, 29, 79, 35, 82, 42, 81, 48, 76, 45, 70, 44, 64, 45, 58, 47, 52, 52, 49, 58, 47, 64, 42, 62, 39, 68)]},
  ];
  if (s.arm === 'spread') parts.push(
    // both arms out and a little up, the palms open: presenting something the size of a tray
    {group: 'armF', mat: 'leather', tone: 2, prims: [P.poly(18, 118, 8, 118, 0, 122, 0, 132, 10, 128, 22, 126)]},
    {group: 'handF', mat: 'skin', tone: 2, prims: [P.poly(4, 118, -2, 116, -2, 122, 2, 126, 6, 124)]},
    {group: 'armN', mat: 'leather', tone: 2, prims: [P.poly(90, 118, 104, 114, 114, 116, 120, 118, 120, 128, 108, 126, 96, 130)]},
    {group: 'handN', mat: 'skin', tone: 2, prims: [P.poly(116, 114, 122, 110, 126, 112, 124, 120, 118, 120)]},
  );
  if (s.arm === 'key') parts.push(
    {group: 'armN', mat: 'leather', tone: 2, prims: [P.poly(92, 124, 102, 132, 106, 142, 102, 150, 94, 150, 90, 136)]},
    {group: 'handN', mat: 'skin', tone: 2, prims: [P.poly(100, 140, 106, 138, 108, 146, 104, 150, 100, 150)]},
  );
  const adjust: Adjust[] = [
    plane('skin', 3, P.poly(56, 46, 64, 45, 72, 47, 76, 50, 78, 56, 79, 58, 78, 62, 82, 69, 83, 71, 80, 73, 79, 75, 80, 77, 80, 82, 79, 86, 76, 92, 70, 97, 62, 99, 60, 90, 62, 80, 62, 70, 60, 60, 57, 52)),
    plane('skin', 4, P.poly(64, 47, 72, 48, 74, 53, 66, 52), P.poly(78, 63, 81, 68, 80, 70, 77, 68), P.poly(66, 68, 72, 67, 72, 71, 67, 72)),
    plane('skin', 5, P.line(80, 69, 81, 69), P.line(67, 48, 70, 48)),
    plane('skin', 4, P.poly(60, 70, 65, 70, 65, 74, 61, 75)),
    plane('skin', 1, P.line(70, 74, 67, 82), P.line(79, 78, 80, 83)),
    plane('skin', 1, P.poly(58, 56, 72, 55, 73, 58, 60, 59), P.poly(75, 56, 78, 57, 77, 60, 75, 59)),
    plane('skin', 2, P.poly(74, 60, 77, 62, 77, 68, 74, 70)),
    plane('skin', 1, P.poly(76, 73, 81, 73, 80, 75, 76, 75)),
    plane('skin', 1, P.poly(42, 68, 48, 68, 52, 82, 58, 94, 54, 97, 48, 92, 44, 84)),
    plane('skin', 1, P.poly(50, 96, 62, 99, 70, 97, 74, 95, 74, 102, 62, 106, 50, 102)),
    plane('skin', 0, P.line(52, 97, 62, 100), P.line(63, 100, 72, 97)),
    plane('skin', 3, P.poly(66, 102, 70, 100, 70, 108, 66, 110)),
    plane('skin', 1, P.poly(42, 65, 46, 64, 47, 71, 45, 76, 42, 74)),
    plane('silver', 4, P.poly(46, 34, 58, 29, 70, 30, 76, 36, 68, 34, 58, 34, 50, 38)),
    plane('silver', 5, P.line(52, 32, 62, 29), P.line(64, 30, 72, 32)),
    plane('silver', 2, P.line(44, 40, 56, 36), P.line(42, 46, 56, 41), P.line(40, 52, 52, 47), P.line(58, 38, 72, 38), P.line(60, 42, 76, 42)),
    plane('silver', 1, P.poly(36, 66, 33, 56, 35, 50, 40, 52, 42, 62, 39, 68)),
    plane('leather', 1, P.poly(0, 150, 2, 128, 14, 118, 32, 111, 44, 109, 48, 124, 40, 150)),
    plane('leather', 3, P.poly(4, 132, 10, 124, 20, 117, 32, 113, 40, 112, 40, 114, 32, 115, 21, 120, 11, 127, 6, 134)),
    plane('leather', 4, P.poly(6, 130, 12, 123, 21, 118, 32, 114, 38, 113, 32, 116, 21, 121, 12, 127, 7, 132)),
    plane('leather', 5, P.line(8, 128, 13, 123), P.line(14, 122, 22, 118), P.line(23, 117, 34, 114)),
    plane('leather', 4, P.line(41, 112, 47, 126)),
    plane('leather', 3, P.poly(68, 111, 84, 114, 98, 122, 94, 126, 78, 120, 70, 118)),
    plane('leather', 0, P.line(44, 110, 52, 136), P.line(68, 112, 62, 136)),
    plane('tee', 3, P.poly(48, 112, 56, 114, 54, 120, 50, 118)),
  ];
  if (s.arm === 'spread') adjust.push(
    plane('leather', 3, P.poly(92, 118, 104, 115, 114, 116, 118, 118, 104, 118, 94, 121)),
    plane('leather', 5, P.line(98, 117, 112, 116)),
    plane('leather', 1, P.poly(0, 128, 10, 125, 20, 124, 20, 126, 10, 128, 0, 132)),
    plane('skin', 4, P.poly(117, 113, 122, 111, 124, 113, 119, 116)),
  );
  const mouths: Record<NesnejMouth, string[]> = {
    grin: ['m.........m.', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mttttttm..', '...mmmmmm...', '....llll....'],
    A: ['m.........m.', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '.mddddddddm.', '..mddddddm..', '...mmmmmm...'],
    E: ['m.........m.', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mmmmmmmm..', '....llll....', '............'],
    O: ['............', '....mmmm....', '...mddddm...', '...mddddm...', '....mmmm....', '............'],
    M: ['m.........m.', '.mmmmmmmmmm.', '..MMMMMMMM..', '...llllll...', '............', '............'],
  };
  const stamps: Stamp[] = [
    {x: 60, y: 59, rows: s.blink ? ['...........', '.LLLLLLLLL.', '..kkkkkkk..', '...........'] : ['..LLLLLLL..', '.LwwIIgwwL.', '..kkkkkkk..', '....kk.....'], pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 75, y: 60, rows: s.blink ? ['...', 'LLL', '...'] : ['LLL', 'wIL', '.k.'], pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0, k: PAL.S2}},
    {x: 58, y: 54, rows: ['.bbbbbbbbbb.', 'bbbbbbbbbbbb'], pal: {b: PAL.G3}},
    {x: 74, y: 55, rows: ['bbb.', '.bbb'], pal: {b: PAL.G3}},
    {x: 78, y: 72, rows: ['o.', '.o'], pal: {o: PAL.S1}},
    {x: 64, y: 77, rows: mouths[s.mouth], pal: {m: PAL.S0, T: PAL.P2, t: PAL.P0, l: PAL.S3, d: PAL.N0, M: PAL.S1}},
  ];
  return {w: NESNEJ_BW, h: NESNEJ_BH, parts, adjust, stamps};
};
const rigOf = (light: 'sun' | 'screen'): LightRig => ({
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['tee'],
  back: [1, -0.1], backBand: 2,
  backRamp: light === 'sun' ? {skin: PAL.F6, silver: PAL.G6, leather: PAL.F4} : {skin: PAL.L2, silver: PAL.L3, leather: PAL.L2},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    silver: HAIR.silver,
    leather: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G5, PAL.W9],
    tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
  },
});
export const nesnejBust = memo((s: NesnejBustState): Img => renderFigure(bustFig(s), rigOf(s.light)));

// ------------------------------------------------------------------ room sprite
export type NesnejRoomArm = 'spread' | 'key' | 'down' | 'up';
export interface NesnejRoomPose { arm: NesnejRoomArm; mouth: 'grin' | 'open'; legs?: RoomLegs; }
export const NESNEJ_ROOM_DEFAULT: NesnejRoomPose = {arm: 'spread', mouth: 'grin'};
const RHEAD = [
  '....sssssss.....',
  '..sSSSSSSSSs....',
  '.sSSSSSSSSSSs...',
  'sSSSSSSSS344o...',
  'sSSSS2233444o...',
  'sSSs2234bb4bo...',
  'sSs22334e44eo...',
  '.So12233444444o.',
  '.so122334444445.',
  '..o122334444444.',
  '..o12233444444o.',
  '..o12TTTTTT4o...',
  '...o122mmm4o....',
  '....o112233o....',
  '.....oo1122o....',
  '......o112o.....',
  '......o112o.....',
];
const roomFig = (p: NesnejRoomPose): FigureDef => {
  const arm: RoomArm = p.arm === 'spread' ? 'spread' : p.arm === 'key' ? 'stamp' : p.arm === 'up' ? 'up' : 'down';
  const body = roomBody({kind: 'jacket', broad: 1, legMat: 'pants'}, arm, p.legs ?? 'stand');
  const rows = RHEAD.slice();
  if (p.mouth === 'open') { rows[11] = '..o12TMMMMT4o...'; rows[12] = '...o122MM44o....'; }
  const stamps: Stamp[] = [...body.stamps, headStamp(rows, body.bob, {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    s: ['hair', 2], S: ['hair', 4], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0], T: ['teeth', 4],
  })];
  // the leather's hard specular streak down the near shoulder
  stamps.push({x: 26, y: 20 + body.bob, rows: ['W..', '.W.', '.W.', '..W'], pal: {W: ['suit', 5]}});
  return {w: ROOM_FW, h: ROOM_FH, parts: body.parts, adjust: body.adjust, stamps};
};
const RLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], hair: HAIR.silver, suit: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G4, PAL.W9],
  shirt: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4], pants: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4], shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G4],
  teeth: [PAL.P0, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const roomRig: LightRig = {
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.F6, hair: PAL.G6, suit: PAL.F4},
  ramps: RLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 44 ? 1 : Math.max(0.25, 1 - (y - 44) / 34)),
};
export const nesnejRoom = memo((p: NesnejRoomPose): Img => renderFigure(roomFig(p), roomRig));
export const drawNesnejRoom = (b: Buf, footX: number, footY: number, p: NesnejRoomPose, o: {flip?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? ROOM_FW - 1 - ROOM_FOOT[0] : ROOM_FOOT[0];
  blitImg(b, nesnejRoom(p), footX - fx, footY - ROOM_FOOT[1], {flip: o.flip, clip: o.clip});
};
