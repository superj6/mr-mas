// MR. MAS — Ep2 v1 art: EKIEL (the safety co-lead who walks; manifest §2.2; sc 14, F2.2, 18). Quiet, dry, squinting
// (his name card: SQUINT: 100%). Here: sandy tousled hair, a navy zip-up over a grey tee, the squint as his resting face.
// No accent, no likeness. Sc 14: walks out past ordinary desks with his box; F2.2 (2023, night): at a screen beside
// Alyi, lit by it (one line, lip-sync); sc 18: climbs the lighthouse stair with the same box, then a SAFETY COMMITTEE
// lanyard (page 212) over his head, squinting at Mario's four pages.
//   ekielBust(s)                   112 x 136, faces camera-left. s: {mouth, expr (default squint), lanyard: 'none' |
//                                  'nopeai' | 'committee', light: 'room' | 'screen' (the 2023 night: cyan on his face)}
//   drawEkielRoom(b, x, y, pose)   ≈ 80 px, faces screen-right. pose {state: 'carry' | 'stand' | 'climb', legs, mouth,
//                                  lanyard}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, SKIN_CYAN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust, makeRoom, plane, bustHair, bustLanyard, BustState, CivicSpec, RoomFigSpec, Expr, Viseme, RoomLegs} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {tiny} from '../kit';
import type {ArtAsset} from '../asset';

export interface EkielBust extends BustState { lanyard: 'none' | 'nopeai' | 'committee' }
export const EKIEL_DEFAULT: EkielBust = {mouth: 'rest', expr: 'squint', lanyard: 'none'};
const NAVY = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5, PAL.N7];
const TEE = [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6];
const SANDY = [PAL.B1, PAL.B3, PAL.B4, PAL.W4, PAL.W5, PAL.W7];
const mkSpec = (light: 'room' | 'screen'): CivicSpec => ({
  head: {long: 2, jaw: 1},
  torso: {kind: 'jacket'},
  browCol: PAL.B2,
  hair: () => bustHair('tousled'),
  extras: (s) => {
    const parts = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['parts']>;
    const adjust = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['adjust']>;
    adjust.push(plane('suit', 4, P.line(62, 106, 62, 150)));
    if (s.lanyard !== 'none') { const ly = bustLanyard('cord', 'badge', 104); parts.push(...ly.parts); adjust.push(...ly.adjust); }
    return {parts, adjust};
  },
  ramps: light === 'screen'
    ? {skin: SKIN_CYAN.light, hair: [PAL.N1, PAL.C1, PAL.C2, PAL.K2, PAL.K3, PAL.K4], suit: [PAL.N0, PAL.N0, PAL.N1, PAL.C0, PAL.C1, PAL.C3], shirt: [PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C2, PAL.C3], cord: [PAL.N0, PAL.C2, PAL.C4, PAL.C5, PAL.C6, PAL.C7], badge: [PAL.N0, PAL.C3, PAL.C5, PAL.C7, PAL.C8, PAL.C9]}
    : {skin: SKIN.light, hair: SANDY, suit: NAVY, shirt: TEE, cord: [PAL.N0, PAL.C2, PAL.C4, PAL.C5, PAL.C6, PAL.C7], badge: [PAL.N1, PAL.G3, PAL.G5, PAL.P1, PAL.P2, PAL.P2]},
  backRamp: light === 'screen' ? {skin: PAL.K3, hair: PAL.C4, suit: PAL.C2} : {skin: PAL.S3, hair: PAL.W4, suit: PAL.N5},
  key: light === 'screen' ? [-1, 0.1] : undefined,
});
const bRoom = makeBust<EkielBust>(mkSpec('room'));
const bScreen = makeBust<EkielBust>(mkSpec('screen'));
export const ekielBust = (s: Partial<EkielBust> & {light?: 'room' | 'screen'} = {}) => {
  const {light, ...rest} = s;
  const st = {...EKIEL_DEFAULT, ...rest};
  const img = (light === 'screen' ? bScreen : bRoom)(st);
  if (st.lanyard === 'none') return img;
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  tiny(b, st.lanyard === 'committee' ? '212' : 'NA', 56, 129, st.lanyard === 'committee' ? PAL.R2 : PAL.C2);
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) out.c[i] = b.c[i];
  return out;
};

const BOXC = [PAL.D0, PAL.D2, PAL.D3, PAL.D4, PAL.W4, PAL.W5];
export interface EkielRoomPose { state: 'carry' | 'stand' | 'climb'; legs?: RoomLegs; mouth?: 'rest' | 'open'; lanyard?: 'none' | 'committee' }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'jeans',
  ramps: {skin: SKIN.light, hair: SANDY, suit: NAVY, shirt: TEE, jeans: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], box: BOXC, red: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.P2]},
  backRamp: {skin: PAL.S3, suit: PAL.N5},
  extras: (p, bob) => {
    const st: unknown[] = [];
    if (p.state !== 'stand') st.push({x: 18, y: 27 + bob, rows: ['bbbbbbbbbbbbbb', 'BBBBBBBBBBBBBB', 'BBBBBBBBBBBBBB', 'BBBBBBBBBBBBBB', 'BBBBBBBBBBBBBB', 'BBBBBBBBBBBBBB', 'dddddddddddddd'], pal: {b: ['box', 4], B: ['box', 3], d: ['box', 1]}});
    if (p.lanyard === 'committee') st.push({x: 19, y: 19 + bob, rows: ['r...r', '.r.r.', '..R..', '..R..'], pal: {r: ['red', 2], R: ['red', 5]}});
    return {stamps: st as never};
  },
};
const room = makeRoom(rspec);
export const drawEkielRoom = (b: Buf, footX: number, footY: number, p: Partial<EkielRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: EkielRoomPose = {state: 'carry', mouth: 'rest', lanyard: 'none', ...p};
  room.draw(b, footX, footY, {arm: q.state === 'stand' ? 'down' : 'reach', armF: q.state === 'stand' ? undefined : 'clasp', legs: q.legs ?? (q.state === 'climb' ? 'w3' : 'stand'), state: q.state, lanyard: q.lanyard, head: {hair: 'short', mouth: q.mouth, squint: true}}, o);
};

const e = (x: Expr, m: Viseme = 'rest', lanyard: EkielBust['lanyard'] = 'none'): EkielBust => ({mouth: m, expr: x, lanyard});
export const ART: ArtAsset[] = [{
  id: 'char-ekiel', manifest: '§2.2 EKIEL', kind: 'character', name: 'EKIEL (co-led the safety team)',
  file: 'cast/ekiel.ts', exports: 'ekielBust, drawEkielRoom, EKIEL_DEFAULT', scenes: '14, 15 (F2.2), 18',
  note: 'the squint is his resting face; sandy hair, navy zip-up; at Alyi\'s screen in 2023 (cyan light); the committee lanyard in 18',
  stills: [{label: 'busts: squint (card) · F2.2 at the screen, "Nobody knows how" (talk, cyan) · sc 18 lanyard, "You annotated?" (worry) · dry smile; room: carry, climb, stand', draw: (b) => {
    sheetPlate(b, [PAL.N1, PAL.N2, PAL.N2, PAL.N3]);
    sheetBust(b, ekielBust(e('squint')), -6, 52, 'squint 100%');
    sheetBust(b, ekielBust({...e('squint', 'E'), light: 'screen'}), 90, 52, '2023: at the screen');
    sheetBust(b, ekielBust(e('worry', 'O', 'committee')), 186, 52, 'sc 18: you annotated?');
    sheetBust(b, ekielBust(e('smile')), 282, 52, 'dry smile');
    sheetRoom(b, 402, 'carry', (x, y) => drawEkielRoom(b, x, y, {state: 'carry', legs: 'w1'}));
    sheetRoom(b, 436, 'climb', (x, y) => drawEkielRoom(b, x, y, {state: 'climb'}));
    sheetRoom(b, 466, 'lanyard', (x, y) => drawEkielRoom(b, x, y, {state: 'stand', lanyard: 'committee'}));
  }}],
}];
