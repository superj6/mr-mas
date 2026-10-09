// MR. MAS — Ep2 v1 art: BUKAJ (the new chief scientist; manifest §2.2; sc 14). characters/bukaj.md: quiet and precise,
// glasses; NopeAI teal. Here: thin dark-framed glasses, a teal crew-neck over a white collar, short neat dark hair; soft,
// exact, warm. Sc 14: he arrives with a box of printouts and sits in Alyi's old chair (which still hums), one hand flat
// on its armrest. "Thank you. It's still warm."
//   bukajBust(s)                   112 x 136, faces camera-left (he sits screen-right of Mas). s: {mouth, expr, arm:
//                                  'none' | 'armrest' (his near hand flat on the armrest at frame bottom-left)}
//   drawBukajRoom(b, x, y, pose)   ≈ 80 px, faces screen-right. pose {state: 'carry' (the box of printouts) | 'seated'
//                                  (in the chair; x, y = his foot point, the seat line y - 32) | 'stand', mouth}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, HAIR, SHIRT_WHITE} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust, makeRoom, plane, bustHair, bustArm, bustGlasses, BustState, CivicSpec, RoomFigSpec, Expr, Viseme} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {fill} from '../kit';
import type {ArtAsset} from '../asset';

export interface BukajBust extends BustState { arm: 'none' | 'armrest' }
export const BUKAJ_DEFAULT: BukajBust = {mouth: 'rest', expr: 'smile', arm: 'armrest'};
const TEAL = [PAL.N0, PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4];
const HEAD = {long: 1, soft: true};
const spec: CivicSpec = {
  head: HEAD,
  torso: {kind: 'jacket'},
  browCol: PAL.N0,
  hair: () => bustHair('crop'),
  extras: (s) => {
    const parts = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['parts']>;
    const adjust = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['adjust']>;
    // the white collar points over the crew neck
    parts.push({group: 'clr', mat: 'collar', tone: 4, prims: [P.poly(50, 100, 57, 104, 54, 109), P.poly(73, 100, 68, 104, 72, 108)]});
    if (s.arm === 'armrest') {
      const a = bustArm('arm', [32, 112], [20, 132], [12, 136], {dir: [-1, 0.15], thumb: -1, curl: 0, len: 12, width: 9}, {mat: 'suit', w: 12});
      parts.push(...a.parts); adjust.push(...a.adjust);
    }
    return {parts, adjust, stamps: bustGlasses(HEAD, PAL.N1)};
  },
  ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: TEAL, shirt: TEAL, collar: SHIRT_WHITE},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.C3},
};
const bust = makeBust<BukajBust>(spec);
export const bukajBust = (s: Partial<BukajBust> = {}) => bust({...BUKAJ_DEFAULT, ...s});

const BOXC = [PAL.D0, PAL.D2, PAL.D3, PAL.D4, PAL.W4, PAL.W5];
export interface BukajRoomPose { state: 'carry' | 'seated' | 'stand'; mouth: 'rest' | 'open' | 'smile' }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'trou',
  ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: TEAL, shirt: SHIRT_WHITE, trou: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], box: BOXC, paper: [PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9]},
  backRamp: {skin: PAL.S3, suit: PAL.C3},
  extras: (p, bob) => (p.state === 'carry' ? {stamps: [{x: 19, y: 25 + bob, rows: ['.pPpPpPpPp.', 'pPPPPPPPPPp', 'bbbbbbbbbbbbb', 'BBBBBBBBBBBBB', 'BBBBBBBBBBBBB', 'BBBBBBBBBBBBB', 'BBBBBBBBBBBBB', 'ddddddddddddd'], pal: {p: ['paper', 2], P: ['paper', 4], b: ['box', 4], B: ['box', 3], d: ['box', 1]} as never}]} : {}),
};
const room = makeRoom(rspec);
export const drawBukajRoom = (b: Buf, footX: number, footY: number, p: Partial<BukajRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: BukajRoomPose = {state: 'carry', mouth: 'rest', ...p};
  room.draw(b, footX, footY, {arm: q.state === 'carry' ? 'reach' : q.state === 'seated' ? 'reach' : 'down', armF: q.state === 'carry' ? 'clasp' : undefined, seat: q.state === 'seated', state: q.state, head: {hair: 'crop', mouth: q.mouth, glasses: true}}, o);
};

const e = (x: Expr, m: Viseme = 'rest', arm: BukajBust['arm'] = 'armrest'): BukajBust => ({mouth: m, expr: x, arm});
export const ART: ArtAsset[] = [{
  id: 'char-bukaj', manifest: '§2.2 BUKAJ', kind: 'character', name: 'BUKAJ (the new chief scientist)',
  file: 'cast/bukaj.ts', exports: 'bukajBust, drawBukajRoom, BUKAJ_DEFAULT', scenes: '14',
  note: 'glasses, teal crew-neck over a white collar; soft, exact, warm; seated in the humming chair, a hand flat on the armrest',
  stills: [{label: 'busts: "It\'s still warm." (smile) · talking (E) · "Not yet." (focus) · neutral; room: carry, seated, stand', draw: (b) => {
    sheetPlate(b, [PAL.N2, PAL.N2, PAL.N3, PAL.N3]);
    sheetBust(b, bukajBust(e('smile')), -6, 52, 'still warm (smile)');
    sheetBust(b, bukajBust(e('smile', 'E')), 90, 52, 'talk E');
    sheetBust(b, bukajBust(e('focus', 'O')), 186, 52, 'not yet (focus)');
    sheetBust(b, bukajBust(e('neutral', 'rest', 'none')), 282, 52, 'neutral');
    sheetRoom(b, 402, 'carry', (x, y) => drawBukajRoom(b, x, y, {state: 'carry'}));
    fill(b, 420, 154, 30, 3, PAL.N4); fill(b, 420, 126, 3, 30, PAL.N4);
    sheetRoom(b, 432, 'seated', (x, y) => drawBukajRoom(b, x, 186, {state: 'seated', mouth: 'smile'}));
    sheetRoom(b, 468, 'stand', (x, y) => drawBukajRoom(b, x, y, {state: 'stand'}));
  }}],
}];
