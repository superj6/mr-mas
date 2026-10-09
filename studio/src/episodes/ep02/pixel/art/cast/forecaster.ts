// MR. MAS — Ep2 v1 art: THE FORECASTER (ex-NopeAI; manifest §2.2; sc 17). characters/the-forecaster.md: a young
// researcher in a hoodie. Here: a forest-green hoodie, tousled dark hair, a clipboard of dates and a plain wristwatch;
// conversational, precise, kind; his refusal is principled (no invented probability anywhere on him). Never a likeness.
//   forecasterBust(s)                  112 x 136, faces camera-left. s: {mouth, expr, arm: 'none' | 'clipboard' (held up
//                                      at the chest, its top sheet's date grid) | 'watch' (the wrist turned up)}
//   drawForecasterRoom(b, x, y, pose)  ≈ 80 px, faces screen-right. pose {state: 'walk' | 'stand' | 'talk' (the clip-
//                                      board up, a pen in the far hand) | 'asleep' (sat against the rail, the clipboard
//                                      on his chest: x, y = where he sits) | 'cross' (crossing out an hour), legs, mouth}
//   drawProbUmbrella(b, x, y)          the far-shore egg: an open umbrella printed with a probability curve (no number)
import {Buf, rect, line} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust3, makeRoom, plane, bustArm, BustState, BustSpec3, CivicSpec, RoomFigSpec, Expr, Viseme, RoomLegs, seatedStaff} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {fill, sp} from '../kit';
import type {ArtAsset} from '../asset';

export interface ForecasterBust extends BustState { arm: 'none' | 'clipboard' | 'watch' }
export const FORECASTER_DEFAULT: ForecasterBust = {mouth: 'rest', expr: 'neutral', arm: 'clipboard'};
const GREEN = [PAL.N0, PAL.L0, PAL.L0, PAL.L1, PAL.L2, PAL.L3];
// his own head: young (a rounder cranium, a short face, a soft jaw, a small straight nose), big round attentive eyes
// under straight brows, a thin face that still has its youth in the cheeks, tousled hair falling forward
const spec: BustSpec3 = {
  head: {yaw: 20, at: [57, 58], scale: 1.04, cranium: [20, 24, 22], cheekW: 15.5, jawW: 12.5, jawY: 17, chinY: 31, chinW: 6, chinZ: 11, cheekbone: 0.4, full: 0.8, brow: 1,
    nose: {tipY: 12, proj: 6, wing: 3.5, tip: 2.6}, mouthY: 21, eyeX: 8.5, neck: {r: 8.5, throat: true}, hair: {style: 'tousled', thick: 3.6, line: -14, side: 1, volume: 1.1},
    skin: SKIN.light, hairRamp: HAIR.dark, back: {skin: PAL.S3, hair: PAL.G3}},
  face: {eye: 'round', eyeW: 9, eyeH: 2, brow: 'straight', browCol: PAL.B0, mouthW: 9},
  torso: {kind: 'jacket'},
  // his focus is precise, not stern: the eyes stay open, one brow lifts
  expr: {focus: {eye: 'open', brow: 'one', mouth: 'flat'}},
  extras: (s) => {
    const parts = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['parts']>;
    const adjust = [] as NonNullable<ReturnType<NonNullable<CivicSpec['extras']>>['adjust']>;
    // the hood bunched at the back of the neck, the drawstrings
    parts.push({group: 'hood', mat: 'suit', tone: 2, prims: [P.poly(72, 96, 86, 92, 98, 100, 100, 112, 84, 108, 74, 104)]});
    adjust.push(plane('suit', 1, P.poly(78, 100, 92, 98, 96, 108, 84, 106)));
    parts.push({group: 'str', mat: 'cord', tone: 4, prims: [P.rect(56, 104, 1, 14), P.rect(66, 104, 1, 12)]});
    if (s.arm === 'clipboard') {
      const a = bustArm('arm', [32, 112], [18, 136], [30, 120], {dir: [0.3, -1], thumb: 1, curl: 0.7, len: 12, width: 11}, {mat: 'suit'});
      parts.push(...a.parts); adjust.push(...a.adjust);
    } else if (s.arm === 'watch') {
      const a = bustArm('arm', [32, 112], [18, 136], [26, 110], {dir: [0.6, -0.8], thumb: 1, curl: 0.9, len: 11, width: 10}, {mat: 'suit'});
      parts.push(...a.parts); adjust.push(...a.adjust);
      parts.push({group: 'watch', mat: 'metal', tone: 3, prims: [P.rect(24, 108, 6, 4)]});
    }
    return {parts, adjust};
  },
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: GREEN, shirt: GREEN, cord: [PAL.N1, PAL.G4, PAL.G5, PAL.P1, PAL.P2, PAL.P2], metal: [PAL.N0, PAL.G3, PAL.G4, PAL.G6, PAL.P2, PAL.W9]},
  backRamp: {skin: PAL.S3, hair: PAL.G3, suit: PAL.L2},
};
const bust = makeBust3<ForecasterBust>(spec);
/** the clipboard (bust scale, 30 x 38): brown board, steel clip, a sheet with a grid of dates, an hour crossed out */
const clipboardB = (b: Buf, x: number, y: number, crossed = 0) => {
  fill(b, x, y, 30, 38, PAL.D3); fill(b, x, y, 30, 1, PAL.D4); fill(b, x + 29, y, 1, 38, PAL.D1);
  fill(b, x + 3, y + 4, 24, 32, PAL.P2); fill(b, x + 3, y + 35, 24, 1, PAL.P0);
  fill(b, x + 9, y - 2, 12, 5, PAL.G4); fill(b, x + 9, y - 2, 12, 1, PAL.G6);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) fill(b, x + 5 + c * 6, y + 9 + r * 5, 4, 3, r === 0 ? PAL.I0 : PAL.G5);
  for (let k = 0; k < crossed; k++) line(x + 5 + k * 6, y + 14, x + 9 + k * 6, y + 16, b.ink(PAL.R2));
};
export const forecasterBust = (s: Partial<ForecasterBust> & {crossed?: number} = {}) => {
  const {crossed, ...rest} = s;
  const st = {...FORECASTER_DEFAULT, ...rest};
  const img = bust(st);
  if (st.arm !== 'clipboard') return img;
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  clipboardB(b, 14, 96, crossed ?? 0);
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) { const y = Math.floor(i / img.w), x = i % img.w; if (!(y >= 116 && x < 40 && out.c[i] >= 0)) out.c[i] = b.c[i]; }
  return out;
};

export interface ForecasterRoomPose { state: 'walk' | 'stand' | 'talk' | 'cross' | 'asleep'; legs?: RoomLegs; mouth?: 'rest' | 'open' | 'smile' }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'jeans',
  ramps: {skin: SKIN.light, hair: HAIR.dark, suit: GREEN, shirt: GREEN, jeans: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N6], board: [PAL.D0, PAL.D2, PAL.D3, PAL.D4, PAL.P1, PAL.P2], pen: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.R3]},
  backRamp: {skin: PAL.S3, suit: PAL.L2},
  extras: (p, bob) => {
    const st: unknown[] = [];
    if (p.state === 'talk' || p.state === 'cross') st.push({x: 24, y: 22 + bob, rows: ['bbbbbb', 'bppppb', 'bppppb', 'bppppb', 'bbbbbb'], pal: {b: ['board', 2], p: ['board', 5]}});
    else st.push({x: 26, y: 34 + bob, rows: ['bb', 'bp', 'bp', 'bp', 'bp', 'bb'], pal: {b: ['board', 2], p: ['board', 5]}});
    if (p.state === 'cross') st.push({x: 22, y: 27 + bob, rows: ['..r', '.r.', 'r..'], pal: {r: ['pen', 3]}});
    return {stamps: st as never};
  },
};
const room = makeRoom(rspec);
export const drawForecasterRoom = (b: Buf, footX: number, footY: number, p: Partial<ForecasterRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: ForecasterRoomPose = {state: 'walk', mouth: 'rest', ...p};
  if (q.state === 'asleep') {
    // sat on the deck with his back to the rail, chin down, eyes shut, the clipboard on his chest
    room.draw(b, footX, footY + 18, {arm: 'clasp', armF: 'clasp', seat: true, nod: 1, state: 'talk', head: {hair: 'short', mouth: 'rest', blink: true}}, o);
    return;
  }
  room.draw(b, footX, footY, {arm: q.state === 'walk' ? 'down' : q.state === 'stand' ? 'down' : 'card', armF: q.state === 'cross' ? 'write' : undefined, legs: q.legs ?? 'stand', state: q.state, head: {hair: 'short', mouth: q.mouth}}, o);
};
/** the far-shore egg: an open umbrella (room scale, 22 x 14) printed with a bell curve, no number on it */
export const drawProbUmbrella = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 8; j++) for (let i = 0; i < 23; i++) { const d = Math.hypot((i - 11) / 11.5, (j - 8) / 8); if (d < 1) b.set(x + i, y + j, j < 2 ? PAL.P2 : (i % 6 === 0 ? PAL.P0 : PAL.P1)); }
  for (let i = 0; i < 19; i++) { const t = (i - 9) / 3.2; const yy = Math.round(7 - 5 * Math.exp(-t * t / 2)); b.set(x + 2 + i, y + yy, PAL.R2); }
  line(x + 11, y + 8, x + 11, y + 16, b.ink(PAL.N1)); b.set(x + 10, y + 16, PAL.N1);
};

const e = (x: Expr, m: Viseme = 'rest', arm: ForecasterBust['arm'] = 'clipboard'): ForecasterBust => ({mouth: m, expr: x, arm});
export const ART: ArtAsset[] = [{
  id: 'char-forecaster', manifest: '§2.2 THE FORECASTER', kind: 'character', name: 'THE FORECASTER (ex-NopeAI)',
  file: 'cast/forecaster.ts', exports: 'forecasterBust, drawForecasterRoom, drawProbUmbrella, FORECASTER_DEFAULT', scenes: '17',
  note: 'forest-green hoodie, a clipboard of dates, a watch; kind and precise (smile, focus); asleep against the rail; the umbrella egg',
  stills: [{label: 'busts: "Here\'s where I am." (focus, talk) · the forecast (smile) · checking his watch · neutral; room: walk, talk, cross out, asleep; the umbrella', draw: (b) => {
    sheetPlate(b, [PAL.U0, PAL.U1, PAL.N3, PAL.N3]);
    sheetBust(b, forecasterBust(e('focus', 'E')), -8, 52, 'here is where I am');
    sheetBust(b, forecasterBust({...e('smile'), crossed: 1}), 86, 52, 'median: an apology');
    sheetBust(b, forecasterBust(e('neutral', 'rest', 'watch')), 180, 52, 'the watch');
    sheetBust(b, forecasterBust(e('neutral', 'rest', 'none')), 274, 52, 'neutral');
    sheetRoom(b, 388, 'walk', (x, y) => drawForecasterRoom(b, x, y, {state: 'walk', legs: 'w1'}));
    sheetRoom(b, 414, 'talk', (x, y) => drawForecasterRoom(b, x, y, {state: 'talk', mouth: 'open'}));
    sheetRoom(b, 440, 'cross', (x, y) => drawForecasterRoom(b, x, y, {state: 'cross'}));
    fill(b, 456, 120, 3, 68, PAL.G3);
    sheetRoom(b, 468, 'asleep', (x, y) => drawForecasterRoom(b, x, y, {state: 'asleep'}, {flip: true}));
    drawProbUmbrella(b, 446, 12);
    void rect; void sp; void seatedStaff;
  }}],
}];
