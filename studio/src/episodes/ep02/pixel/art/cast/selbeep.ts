// MR. MAS — Ep2 v1 art: SELBEEP (the AROS video lead; manifest §2.2; sc 1). A proud showman presenting to a room.
// characters/selbeep.md: the silhouette of a director, the palette AROS mammoth brown and studio-light yellow, the
// signature prop a clapperboard. Here: a swept-up showman's quiff, a brown suede bomber over a black tee, a studio-yellow
// lanyard, and the REMOTE THE SIZE OF A CLAPPERBOARD (a black slab with a clapper's striped top and a red record
// button). Caricature by silhouette and prop, never a likeness. The bust faces camera-left (toward the wall screen in
// the lobby master); the room sprite faces screen-right (flip it to face the screen at frame right).
//   selbeepBust(s)                  112 x 136. s: {mouth, expr, arm: 'none' | 'remote' | 'aim'} (remote: held at the
//                                   chest; aim: raised toward the screen, off camera-left). Expressions: neutral, proud
//                                   (the showman's grin), smile, laugh, worry ("Directionally." wants proud-then-worry)
//   drawSelbeepRoom(b, x, y, pose)  ≈ 80 px; pose {arm: 'down' | 'point' (the remote aimed) | 'present' (the remote up,
//                                   turned to the room), mouth, legs}
//   drawRemote(b, x, y, size)       the remote alone (an insert or a hand-off), 'room' | 'bust'
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust, makeRoom, plane, bustArm, BustState, CivicSpec, RoomPose, RoomFigSpec, Expr, Viseme} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {sp} from '../kit';
import type {ArtAsset} from '../asset';

export type SelbeepArm = 'none' | 'remote' | 'aim';
export interface SelbeepBust extends BustState { arm: SelbeepArm }
export const SELBEEP_DEFAULT: SelbeepBust = {mouth: 'rest', expr: 'proud', arm: 'none'};
const JACKET = [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4];
const TEE = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4];
const YELLOW = [PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9];

/** the remote: 'bust' 24 x 30 (a black slab, the clapper's diagonal stripes across its top, buttons, the red REC) */
const REMOTE_BUST = [
  'kWkWkWkWkWkWkWkWkWkWkWkW',
  'WkWkWkWkWkWkWkWkWkWkWkWk',
  'kWkWkWkWkWkWkWkWkWkWkWkW',
  'gggggggggggggggggggggggg',
  'nnnnnnnnnnnnnnnnnnnnnnnn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNrrrrNNNNNNNNNNNNn',
  'nNNNNNrRRRRrNNNNNNNNNNNn',
  'nNNNNNrRRRRrNNNNNNNNNNNn',
  'nNNNNNNrrrrNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNggNNggNNggNNNNNNNNNNn',
  'nNNggNNggNNggNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNggNNggNNggNNNNNNNNNNn',
  'nNNggNNggNNggNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nNNNNNNNNNNNNNNNNNNNNNNn',
  'nnnnnnnnnnnnnnnnnnnnnnnn',
];
const REMOTE_ROOM = ['kWkWkWkW', 'gggggggg', 'nNNrNNNn', 'nNgNgNNn', 'nNNNNNNn', 'nnnnnnnn'];
const REM_PAL = {k: PAL.N0, W: PAL.P2, g: PAL.G4, n: PAL.N0, N: PAL.N2, r: PAL.R1, R: PAL.R3};
export const drawRemote = (b: Buf, x: number, y: number, size: 'room' | 'bust' = 'bust') => sp(b, x, y, size === 'bust' ? REMOTE_BUST : REMOTE_ROOM, REM_PAL);

const spec: CivicSpec = {
  head: {long: 1, age: 1},
  torso: {kind: 'jacket', sy: 102},
  browCol: PAL.B1,
  hair: () => ({
    parts: [
      // the showman's swept-up quiff: high and forward over the brow, short at the back of the head, a sideburn
      {group: 'hair', mat: 'hair', tone: 3, prims: [P.poly(44, 36, 42, 28, 45, 19, 52, 11, 63, 7, 75, 8, 84, 14, 89, 24, 90, 38, 88, 51, 85, 51, 84, 42, 80, 35, 73, 31, 64, 30, 56, 30, 50, 32, 46, 37), P.poly(77, 35, 82, 36, 81, 54, 78, 53)]},
    ],
    adjust: [
      // the quiff's lit front roll, its crest, the strands combed back in arcs, the dark under the roll at the brow
      plane('hair', 4, P.poly(44, 33, 43, 25, 48, 16, 56, 10, 64, 8, 58, 14, 52, 21, 47, 28)),
      plane('hair', 5, P.line(45, 24, 52, 15), P.line(53, 13, 60, 10)),
      plane('hair', 2, P.line(52, 19, 64, 13), P.line(64, 13, 78, 14), P.line(50, 25, 62, 19), P.line(62, 19, 84, 22), P.line(55, 29, 66, 25), P.line(66, 25, 87, 30)),
      plane('hair', 1, P.poly(45, 36, 48, 32, 55, 30, 64, 30, 73, 31, 72, 33, 60, 32, 50, 34)),
      plane('hair', 1, P.poly(84, 40, 89, 42, 88, 51, 85, 51)),
      plane('hair', 2, P.poly(78, 37, 81, 37, 80, 53, 78, 52)),
    ],
  }),
  extras: (s) => {
    const parts = [] as ReturnType<NonNullable<CivicSpec['extras']>>['parts'] & object;
    const adjust = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['adjust']>;
    // the bomber's rib collar round the tee's neck, and the studio-yellow lanyard cord down the chest to a badge
    parts.push({group: 'collar', mat: 'suit', tone: 1, prims: [P.poly(46, 100, 52, 97, 62, 102, 74, 98, 80, 101, 76, 106, 62, 108, 50, 105)]});
    parts.push({group: 'cordL', mat: 'cord', tone: 3, prims: [P.poly(52, 104, 54, 104, 59, 128, 57, 128)]});
    parts.push({group: 'cordR', mat: 'cord', tone: 2, prims: [P.poly(72, 103, 74, 103, 64, 128, 62, 128)]});
    parts.push({group: 'badge', mat: 'badge', tone: 4, prims: [P.rect(54, 127, 13, 9)]});
    adjust.push(plane('badge', 2, P.rect(56, 129, 9, 2)), plane('badge', 1, P.rect(56, 132, 6, 1)));
    const a = s.arm as SelbeepArm;
    if (a === 'remote') {
      const arm = bustArm('armR', [30, 112], [14, 136], [24, 112], {dir: [0.2, -1], thumb: 1, curl: 0.8, len: 11, width: 11}, {mat: 'suit'});
      parts.push(...arm.parts); adjust.push(...arm.adjust);
    } else if (a === 'aim') {
      const arm = bustArm('armR', [30, 112], [12, 112], [4, 92], {dir: [-0.5, -1], thumb: 1, curl: 0.8, len: 11, width: 11}, {mat: 'suit'});
      parts.push(...arm.parts); adjust.push(...arm.adjust);
    }
    return {parts, adjust};
  },
  ramps: {skin: SKIN.medium, hair: HAIR.brown, suit: JACKET, shirt: TEE, cord: YELLOW, badge: [PAL.N1, PAL.G3, PAL.G5, PAL.P1, PAL.P2, PAL.P2]},
  backRamp: {skin: PAL.S3, hair: PAL.B4, suit: PAL.W3},
};
const bust = makeBust<SelbeepBust>(spec);
/** the bust with its remote painted in the hand (the remote is a prop with fixed colours, not lit by the rig) */
export const selbeepBust = (s: Partial<SelbeepBust> = {}) => {
  const st = {...SELBEEP_DEFAULT, ...s};
  const img = bust(st);
  if (st.arm === 'none') return img;
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  if (st.arm === 'remote') drawRemote(b, 6, 82);
  else drawRemote(b, -6, 60);
  // the remote sits in the hand: the fingers (the hand's lit pixels below its top rows) stay over it
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) {
    const y = Math.floor(i / img.w);
    const handRow = st.arm === 'remote' ? y >= 100 : y >= 82;
    if (!(handRow && out.c[i] >= 0)) out.c[i] = b.c[i];
  }
  return out;
};

// ------------------------------------------------------------------ room
export interface SelbeepRoomPose { arm: 'down' | 'point' | 'present'; mouth: 'rest' | 'open' | 'smile' | 'laugh'; legs?: RoomPose['legs']; blink?: boolean }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'jeans',
  ramps: {skin: SKIN.medium, hair: HAIR.brown, suit: JACKET, shirt: TEE, jeans: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], cord: YELLOW, tie: TEE},
  backRamp: {skin: PAL.S3, suit: PAL.W3},
  extras: (p, bob) => {
    const stamps = [{x: 19, y: 19 + bob, rows: ['y...y', '.y.y.', '..b..'], pal: {y: ['cord', 4] as [string, number], b: ['cord', 2] as [string, number]}}];
    if (p.arm === 'point') stamps.push({x: 36, y: 21 + bob, rows: REMOTE_ROOM.map((r) => r.replace(/W/g, 'p').replace(/k/g, 'q').replace(/g/g, 'G').replace(/n/g, 'q').replace(/N/g, 'Q').replace(/r/g, 'R')), pal: {p: ['white', 4], q: ['dark', 0], G: ['white', 2], Q: ['dark', 0], R: ['rec', 4]} as never});
    if (p.arm === 'up') stamps.push({x: 31, y: 7 + bob, rows: REMOTE_ROOM.map((r) => r.replace(/W/g, 'p').replace(/k/g, 'q').replace(/g/g, 'G').replace(/n/g, 'q').replace(/N/g, 'Q').replace(/r/g, 'R')), pal: {p: ['white', 4], q: ['dark', 0], G: ['white', 2], Q: ['dark', 0], R: ['rec', 4]} as never});
    return {stamps};
  },
};
(rspec.ramps as Record<string, number[]>).white = [PAL.G3, PAL.G4, PAL.G5, PAL.P1, PAL.P2, PAL.P2];
(rspec.ramps as Record<string, number[]>).rec = [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.R3];
const room = makeRoom(rspec);
export const drawSelbeepRoom = (b: Buf, footX: number, footY: number, p: Partial<SelbeepRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: SelbeepRoomPose = {arm: 'down', mouth: 'smile', ...p};
  room.draw(b, footX, footY, {arm: q.arm === 'point' ? 'point' : q.arm === 'present' ? 'up' : 'down', legs: q.legs, head: {hair: 'swoop', mouth: q.mouth, blink: q.blink}}, o);
};

const expr = (e: Expr, m: Viseme = 'rest', arm: SelbeepArm = 'none'): SelbeepBust => ({mouth: m, expr: e, arm});
export const ART: ArtAsset[] = [{
  id: 'char-selbeep', manifest: '§2.2 SELBEEP', kind: 'character', name: 'SELBEEP (the AROS video lead)',
  file: 'cast/selbeep.ts', exports: 'selbeepBust, drawSelbeepRoom, drawRemote, SELBEEP_DEFAULT', scenes: '1',
  note: 'proud showman; brown suede bomber, studio-yellow lanyard; the remote the size of a clapperboard; proud / talk / worry / laugh',
  stills: [{label: 'busts: proud with the remote · talking (A) · "Directionally." (worry) · laugh; room: present, point, down', draw: (b) => {
    sheetPlate(b);
    sheetBust(b, selbeepBust(expr('proud', 'rest', 'remote')), -6, 52, 'proud + remote');
    sheetBust(b, selbeepBust(expr('proud', 'A', 'aim')), 92, 52, 'talk A + aim');
    sheetBust(b, selbeepBust(expr('worry')), 190, 52, 'worry');
    sheetBust(b, selbeepBust(expr('laugh')), 288, 52, 'laugh');
    sheetRoom(b, 404, 'present', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'present', mouth: 'open'}));
    sheetRoom(b, 436, 'point', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'point', mouth: 'smile'}));
    sheetRoom(b, 466, 'down', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'down', mouth: 'rest'}));
  }}],
}];
