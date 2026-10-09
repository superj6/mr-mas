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
import {makeBust3, makeRoom, plane, bustArm, BustState, BustSpec3, CivicSpec, RoomPose, RoomFigSpec, Expr, Viseme} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {sp, fill} from '../kit';
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

// his own head: a showman's (a big square jaw and a strong chin pushed forward, a long nose with a hook, a heavy brow
// ridge, hooded eyes under heavy brows, a wide mouth made for grinning, the lines of a man past fifty) under the
// swept-up quiff
const spec: BustSpec3 = {
  head: {yaw: 26, at: [57, 56], scale: 1.05, cranium: [21, 25, 24], cheekW: 17, jawW: 16.5, jawY: 20, jawH: 12, chinY: 35, chinW: 8.5, chinZ: 13, cheekbone: 0.9, full: 0.5, brow: 3,
    nose: {tipY: 15, proj: 10, wing: 4.6, hook: 1.4, tip: 3.2}, mouthY: 25, lips: 0.9, muzzle: 13.5, eyeX: 8.5, neck: {r: 10, throat: true}, hair: {style: 'quiff', thick: 2.4, line: -18, volume: 1.25},
    skin: SKIN.medium, hairRamp: HAIR.brown, back: {skin: PAL.S3, hair: PAL.B4}},
  face: {eye: 'hooded', eyeW: 9, eyeH: 2, brow: 'heavy', browCol: PAL.B1, mouthW: 12, age: 2},
  torso: {kind: 'jacket', sy: 102},
  // the showman: proud is the full grin with the brows up; laugh throws the head back
  expr: {proud: {eye: 'crinkle', brow: 'up', mouth: 'grin', pose: {cheekUp: 1.2, nod: -4}}, laugh: {eye: 'happy', brow: 'up', mouth: 'laugh', pose: {jaw: 3, cheekUp: 1.6, nod: -6}}},
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
const bust = makeBust3<SelbeepBust>(spec);
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

// ------------------------------------------------------------------ his silhouette's props (characters/selbeep.md: a director's
// chair, a megaphone, a clapperboard): the folding director's chair (room scale, its canvas in studio-light yellow), a
// megaphone resting on its seat; x, y = the chair's front-left foot on the floor
export const drawDirectorsChair = (b: Buf, x: number, y: number, o: {megaphone?: boolean} = {}) => {
  const wood = [PAL.D2, PAL.D3, PAL.D4];
  // the crossed legs (an X each side), the seat rails, the back posts
  for (let k = 0; k < 18; k++) { b.set(x + k, y - Math.round(k * 0.9), wood[1]); b.set(x + 18 - k, y - Math.round(k * 0.9), wood[2]); }
  for (let k = 0; k < 18; k++) { b.set(x + 6 + k, y - 2 - Math.round(k * 0.9), wood[0]); }
  fill(b, x - 1, y - 18, 22, 2, wood[2]); fill(b, x - 1, y - 16, 22, 1, wood[0]);
  fill(b, x - 1, y - 40, 2, 24, wood[1]); fill(b, x + 19, y - 40, 2, 24, wood[2]);
  // the canvas: the seat sling and the back panel (studio-light yellow)
  fill(b, x + 1, y - 19, 18, 3, PAL.W6); fill(b, x + 1, y - 19, 18, 1, PAL.W7);
  fill(b, x + 1, y - 38, 18, 9, PAL.W6); fill(b, x + 1, y - 38, 18, 1, PAL.W8); fill(b, x + 1, y - 30, 18, 1, PAL.W4);
  // the armrests
  fill(b, x - 3, y - 26, 6, 2, wood[2]); fill(b, x + 17, y - 26, 6, 2, wood[2]);
  if (o.megaphone !== false) {
    // a megaphone on the seat: its cone (white, a red band), its handle and its trigger
    for (let k = 0; k < 10; k++) fill(b, x + 4 + k, y - 24 - Math.floor(k * 0.35), 1, 3 + Math.floor(k * 0.55), k > 7 ? PAL.R2 : PAL.P2);
    fill(b, x + 13, y - 28, 2, 7, PAL.P1); fill(b, x + 6, y - 21, 3, 3, PAL.N1);
  }
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
  file: 'cast/selbeep.ts', exports: 'selbeepBust, drawSelbeepRoom, drawRemote, drawDirectorsChair, SELBEEP_DEFAULT', scenes: '1',
  note: 'proud showman; brown suede bomber, studio-yellow lanyard; the remote the size of a clapperboard; proud / talk / worry / laugh',
  stills: [{label: 'busts: proud with the remote · talking (A) · "Directionally." (worry) · laugh; room: present, point, down', draw: (b) => {
    sheetPlate(b);
    sheetBust(b, selbeepBust(expr('proud', 'rest', 'remote')), -6, 52, 'proud + remote');
    sheetBust(b, selbeepBust(expr('proud', 'A', 'aim')), 92, 52, 'talk A + aim');
    sheetBust(b, selbeepBust(expr('worry')), 190, 52, 'worry');
    sheetBust(b, selbeepBust(expr('laugh')), 288, 52, 'laugh');
    sheetRoom(b, 404, 'present', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'present', mouth: 'open'}));
    sheetRoom(b, 436, 'point', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'point', mouth: 'smile'}));
    drawDirectorsChair(b, 446, 186);
    sheetRoom(b, 466, 'down', (x, y) => drawSelbeepRoom(b, x, y, {arm: 'down', mouth: 'rest'}));
  }}],
}];
