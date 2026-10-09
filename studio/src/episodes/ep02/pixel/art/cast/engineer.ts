// MR. MAS — Ep2 v1 art: the DEMO ENGINEER (stock; manifest §2.2; sc 9, 11). A generic composite, nobody real:
// presenter-bright and nervous under it. A headset with a mic boom, a teal company zip-up over a black tee, a `DEMO`
// lanyard, short curly hair; the phone he holds up to the product. Never an [OTS] subject.
//   engineerBust(s)                 112 x 136, faces camera-left. s: {mouth, expr, arm: 'none' | 'phone' (held up, its
//                                   screen to camera-left) | 'unclip' (his hand at the headset, taking it off mic),
//                                   headset: 'on' | 'off' (the boom swung up)}. Expressions: smile (presenter), laugh
//                                   (the nervous laugh: laugh + worried brows), worry, neutral
//   drawEngineerRoom(b, x, y, pose) ≈ 80 px, faces screen-right. pose {arm: 'down' | 'phone' | 'raise' (the phone up at
//                                   his mark) | 'unclip', mouth, legs}
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust3, bustAnchors, makeRoom, plane, bustArm, bustLanyard, BustState, BustSpec3, CivicSpec, RoomFigSpec, Expr, Viseme} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {fill, tiny, tinyWidth} from '../kit';
import type {ArtAsset} from '../asset';

export interface EngineerBust extends BustState { arm: 'none' | 'phone' | 'unclip'; headset?: 'on' | 'off' }
export const ENGINEER_DEFAULT: EngineerBust = {mouth: 'rest', expr: 'smile', arm: 'none', headset: 'on'};
const TEAL = [PAL.N0, PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C5];
const TEE = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4];
// his own head: young and open (a rounded cranium, full cheeks, a broad nose with wide wings, full lips, a soft brow),
// tight curls cut close; the headset's band over the crown to its cup on his ear, the boom along his cheek to his mouth
const HEAD3: BustSpec3['head'] = {yaw: 22, at: [57, 57], scale: 1.04, cranium: [20, 24, 23], cheekW: 16, jawW: 14.5, jawY: 18, chinY: 32, chinW: 7, chinZ: 12, cheekbone: 0.7, full: 0.8, brow: 1.6,
  nose: {tipY: 13, proj: 6, wing: 5.4, tip: 3.6}, mouthY: 22, lips: 1.4, eyeX: 8.5, neck: {r: 9.5, throat: true}, hair: {style: 'curly', thick: 2.6, line: -18},
  skin: SKIN.deep, hairRamp: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3], back: {skin: PAL.S2, hair: PAL.B2}};
const spec0: BustSpec3 = {head: HEAD3, face: {eye: 'almond', eyeW: 9, eyeH: 2, brow: 'soft', browCol: PAL.N0, mouthW: 10, lip: {line: PAL.S0, lower: PAL.S2}}, torso: {kind: 'jacket'}, ramps: {}};
const A = bustAnchors(spec0);
const spec: BustSpec3 = {
  ...spec0,
  // the nervous laugh: a laugh with the worried brows; the presenter smile shows teeth
  expr: {laugh: {eye: 'happy', brow: 'worry', mouth: 'laugh', pose: {jaw: 2, cheekUp: 1.4}}, smile: {eye: 'crinkle', brow: 'level', mouth: 'grin', pose: {cheekUp: 1}}},
  extras: (s) => {
    const parts = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['parts']>;
    const adjust = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['adjust']>;
    // the zip-up's zip line and collar, the DEMO lanyard
    adjust.push(plane('suit', 4, P.line(62, 108, 62, 150)));
    const ly = bustLanyard('cord', 'badge', 104);
    parts.push(...ly.parts); adjust.push(...ly.adjust);
    // the headset: a band over the crown to the cup on the near ear, and the boom from the cup to the mouth's corner
    const [ex, ey] = A.ear, [mx, my] = A.mouth, [cx, cy] = A.crown;
    // the band hugs the hair's curve from the crown down to the cup (a chain of short segments, 2 px thick)
    const arc: number[] = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8, x = cx + (ex - cx) * t + Math.sin(t * Math.PI) * 4, y = cy + (ey - 6 - cy) * t - Math.sin(t * Math.PI) * 1; arc.push(x, y); }
    const back = arc.slice().reverse().reduce((acc: number[], _v, i, a) => (i % 2 === 0 ? [...acc, a[i + 1] - 2, a[i]] : acc), []);
    parts.push({group: 'band', mat: 'kit', tone: 2, prims: [P.poly(...arc, ...back)]});
    parts.push({group: 'cup', mat: 'kit', tone: 2, prims: [P.ell(ex, ey, 5, 6.5)]});
    adjust.push(plane('kit', 4, P.ell(ex - 1, ey - 2, 2, 3)));
    if ((s.headset ?? 'on') === 'on') parts.push({group: 'boom', mat: 'kit', tone: 1, prims: [P.poly(ex - 2, ey + 4, ex, ey + 6, mx + 5, my + 2, mx + 4, my)]}, {group: 'foam', mat: 'kit', tone: 3, prims: [P.ell(mx + 3, my + 1, 3, 2.5)]});
    else parts.push({group: 'boom', mat: 'kit', tone: 1, prims: [P.poly(ex - 3, ey - 5, ex - 1, ey - 3, ex - 12, ey - 26, ex - 14, ey - 25)]}, {group: 'foam', mat: 'kit', tone: 3, prims: [P.ell(ex - 14, ey - 27, 3, 2.5)]});
    if (s.arm === 'phone') {
      const a = bustArm('arm', [32, 112], [16, 136], [20, 108], {dir: [0, -1], thumb: 1, curl: 0.7, len: 12, width: 11}, {mat: 'suit'});
      parts.push(...a.parts); adjust.push(...a.adjust);
    } else if (s.arm === 'unclip') {
      const a = bustArm('arm', [98, 112], [108, 96], [ex + 4, ey + 8], {dir: [-0.3, -1], thumb: -1, curl: 0.5, len: 12, width: 10}, {mat: 'suit'});
      parts.push(...a.parts); adjust.push(...a.adjust);
    }
    return {parts, adjust};
  },
  ramps: {skin: SKIN.deep, hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3], suit: TEAL, shirt: TEE, cord: [PAL.N0, PAL.N4, PAL.N6, PAL.N7, PAL.N8, PAL.G6], badge: [PAL.N1, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.P2], kit: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.G5]},
  backRamp: {skin: PAL.S2, hair: PAL.B2, suit: PAL.C3},
};
const bust = makeBust3<EngineerBust>(spec);
export const engineerBust = (s: Partial<EngineerBust> = {}) => {
  const st = {...ENGINEER_DEFAULT, ...s};
  const img = bust(st);
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  // the badge sized to its word, DEMO, white on red (legible at 4x), 1 px of red round the word
  const bw = tinyWidth('DEMO') + 4; fill(b, 60 - (bw >> 1), 126, bw, 9, PAL.R2); fill(b, 60 - (bw >> 1), 126, bw, 1, PAL.R3); fill(b, 60 - (bw >> 1), 134, bw, 1, PAL.R1);
  tiny(b, 'DEMO', 62 - (bw >> 1), 128, PAL.P2);
  if (st.arm === 'phone') { fill(b, 12, 80, 17, 28, PAL.N0); fill(b, 13, 81, 15, 26, PAL.C2); fill(b, 13, 81, 15, 1, PAL.C5); fill(b, 16, 86, 9, 7, PAL.P1); }
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) { const y = Math.floor(i / img.w); if (!(st.arm === 'phone' && y >= 100 && out.c[i] >= 0)) out.c[i] = b.c[i]; }
  return out;
};

// ------------------------------------------------------------------ room
export interface EngineerRoomPose { arm: 'down' | 'phone' | 'raise' | 'unclip'; mouth: 'rest' | 'open' | 'smile' | 'laugh'; legs?: 'stand' | 'w0' | 'w1' | 'w2' | 'w3'; headset?: 'on' | 'off' }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'jeans',
  ramps: {skin: SKIN.deep, hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3], suit: TEAL, shirt: TEE, jeans: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], kit: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.G5], red: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.R3], phone: [PAL.N0, PAL.C2, PAL.C4, PAL.C6, PAL.C7, PAL.C8]},
  backRamp: {skin: PAL.S2, suit: PAL.C3},
  extras: (p, bob) => {
    const st = [
      {x: 19, y: 19 + bob, rows: ['r...r', '.r.r.', '..R..', '..R..'], pal: {r: ['red', 2], R: ['red', 3]}},
      {x: 22, y: bob + 2, rows: ['....kk', '.....k', '.....k', '.....k', '....kk', '....kk'], pal: {k: ['kit', 1]}},
    ] as never[];
    if ((p.headset ?? 'on') === 'on') (st as unknown[]).push({x: 22, y: 8 + bob, rows: ['...kk', '.kk..', 'k....'], pal: {k: ['kit', 1]}});
    if (p.pose === 'phone') (st as unknown[]).push({x: 24, y: 26 + bob, rows: ['kkk', 'kpk', 'kpk', 'kkk'], pal: {k: ['kit', 0], p: ['phone', 4]}});
    if (p.pose === 'raise') (st as unknown[]).push({x: 29, y: 8 + bob, rows: ['kkk', 'kpk', 'kpk', 'kkk'], pal: {k: ['kit', 0], p: ['phone', 4]}});
    return {stamps: st};
  },
};
const room = makeRoom(rspec);
export const drawEngineerRoom = (b: Buf, footX: number, footY: number, p: Partial<EngineerRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: EngineerRoomPose = {arm: 'phone', mouth: 'smile', headset: 'on', ...p};
  const arm = q.arm === 'phone' ? 'phone' : q.arm === 'raise' ? 'baton' : q.arm === 'unclip' ? 'up' : 'down';
  room.draw(b, footX, footY, {arm, legs: q.legs, pose: q.arm, headset: q.headset, head: {hair: 'curly', mouth: q.mouth}}, o);
};

const e = (x: Expr, m: Viseme = 'rest', arm: EngineerBust['arm'] = 'none', headset: 'on' | 'off' = 'on'): EngineerBust => ({mouth: m, expr: x, arm, headset});
export const ART: ArtAsset[] = [{
  id: 'char-engineer', manifest: '§2.2 the DEMO ENGINEER', kind: 'character', name: 'the DEMO ENGINEER (stock)',
  file: 'cast/engineer.ts', exports: 'engineerBust, drawEngineerRoom, ENGINEER_DEFAULT', scenes: '9, 11',
  note: 'headset with boom, teal zip-up, DEMO lanyard; presenter smile, nervous laugh, worry; phone up; unclipping the headset',
  stills: [{label: 'busts: presenter (smile) + phone · nervous laugh · "What if it freezes?" (worry) · unclipping, off mic; room: phone, raise, unclip', draw: (b) => {
    sheetPlate(b, [PAL.N1, PAL.N2, PAL.N2, PAL.N3]);
    sheetBust(b, engineerBust(e('smile', 'rest', 'phone')), -8, 52, 'presenter + phone');
    sheetBust(b, engineerBust({...e('laugh'), lid: 0}), 88, 52, 'nervous laugh');
    sheetBust(b, engineerBust(e('worry', 'O')), 184, 52, 'what if it freezes?');
    sheetBust(b, engineerBust(e('neutral', 'E', 'unclip', 'off')), 280, 52, 'unclip, off mic');
    sheetRoom(b, 402, 'phone', (x, y) => drawEngineerRoom(b, x, y, {arm: 'phone'}));
    sheetRoom(b, 436, 'raise', (x, y) => drawEngineerRoom(b, x, y, {arm: 'raise', mouth: 'open'}));
    sheetRoom(b, 466, 'unclip', (x, y) => drawEngineerRoom(b, x, y, {arm: 'unclip', headset: 'off', mouth: 'rest'}));
  }}],
}];
