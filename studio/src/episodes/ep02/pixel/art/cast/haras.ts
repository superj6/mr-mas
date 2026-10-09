// MR. MAS — Ep2 v1 art: HARAS (NopeAI's first CFO; manifest §2.2; sc 19, 20). characters/haras.md: poised, a blazer;
// NopeAI teal, ledger green; the calculator tape. (Her catcher's mask is a later episode's: not in Ep2.) Here: a teal
// blazer over a cream shell, a dark bob, a pen; pleasant, precise, brisk. The calculator tape unspools from a small
// adding machine she carries, curling to the floor (`drawCalcTape`: the set draws its run along the floor).
//   harasBust(s)                   112 x 136, faces camera-left. s: {mouth, expr, arm: 'none' | 'tape' (the tape in her
//                                  hand, a pen over it) | 'upside' (the tape held up, `UPSIDE` circled)}
//   drawHarasRoom(b, x, y, pose)   ≈ 80 px, faces screen-right. pose {state: 'walk' | 'stand' | 'seated' (dropped onto
//                                  a beanbag, cross-legged), legs, mouth}
//   drawCalcTape(b, pts, o)        the tape along a path of points (the floor run), digits ticking along it
import {Buf, line} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {P} from '../../../../../shared/pixel/figure';
import {SKIN} from '../../../../../shared/pixel/cast/civic-kit';
import {makeBust3, makeRoom, bustArm, BustState, BustSpec3, RoomFigSpec, Expr, Viseme, RoomLegs, beanbag} from './civic2';
import {sheetPlate, sheetBust, sheetRoom} from './sheet';
import {fill, tiny, tinyWidth, hash} from '../kit';
import type {ArtAsset} from '../asset';

export interface HarasBust extends BustState { arm: 'none' | 'tape' | 'upside' }
export const HARAS_DEFAULT: HarasBust = {mouth: 'rest', expr: 'smile', arm: 'tape'};
const TEAL = [PAL.N0, PAL.C0, PAL.C2, PAL.C3, PAL.C4, PAL.C6];
const CREAM = [PAL.N2, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9];
const HAIRD = [PAL.N0, PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3];
// her own head (a woman's: the art review): a narrow, soft jaw to a small rounded chin, high cheekbones, a small straight
// nose, full lips in a rose colour, almond eyes lined with lashes and a flick, arched brows, a sleek dark bob with a
// blunt fringe; a slender neck (no throat) above a teal blazer over a cream shell
const spec: BustSpec3 = {
  head: {yaw: 22, at: [57, 56], scale: 1.03, cranium: [19, 24, 22], cheekW: 15, cheekY: 6, jawW: 11.5, jawY: 17, jawH: 10, chinY: 31, chinW: 4.5, chinZ: 11, chinH: 4.5, cheekbone: 1, full: 0.6, brow: 0.4,
    nose: {tipY: 11.5, proj: 6, wing: 3.2, bridge: 1.7, tip: 2.4, hook: -0.4}, mouthY: 20.5, lips: 1.5, eyeX: 8.5, neck: {r: 7.2}, hair: {style: 'bob', thick: 3.2, line: -16, side: -1, len: 26},
    skin: SKIN.medium, hairRamp: HAIRD, back: {skin: PAL.S3, hair: PAL.B3}},
  face: {eye: 'lash', eyeW: 9, eyeH: 2, eyeTilt: 1, brow: 'arched', browCol: PAL.B0, mouthW: 9, lip: {line: PAL.U3, lower: PAL.U4}},
  torso: {kind: 'blazerShell'},
  extras: (s) => {
    if (s.arm === 'none') return {};
    const a = s.arm === 'upside'
      ? bustArm('arm', [32, 112], [14, 128], [16, 98], {dir: [0.2, -1], thumb: 1, curl: 0.7, len: 11, width: 10}, {mat: 'suit', w: 12})
      : bustArm('arm', [32, 112], [18, 136], [34, 124], {dir: [0.6, -0.8], thumb: 1, curl: 0.6, len: 11, width: 10}, {mat: 'suit', w: 12});
    return {parts: a.parts, adjust: a.adjust};
  },
  ramps: {skin: SKIN.medium, hair: HAIRD, suit: TEAL, shirt: CREAM},
  backRamp: {skin: PAL.S3, hair: PAL.B3, suit: PAL.C4},
};
const bust = makeBust3<HarasBust>(spec);
/** a strip of calculator tape (bust scale): `n` rows of digits, the last circled `UPSIDE` when asked */
const tapeB = (b: Buf, x: number, y: number, h: number, upside: boolean) => {
  fill(b, x, y, 14, h, PAL.P2); fill(b, x + 13, y, 1, h, PAL.P0);
  for (let r = 0; r * 6 + 3 < h - 4; r++) for (let c = 0; c < 3; c++) if (hash(r, c, 5) < 0.8) fill(b, x + 3 + c * 3, y + 3 + r * 6, 2, 3, PAL.G4);
  if (upside) { const uw = tinyWidth('UPSIDE') + 4; fill(b, x + 7 - (uw >> 1), y + h - 14, uw, 9, PAL.P2); tiny(b, 'UPSIDE', x + 9 - (uw >> 1), y + h - 12, PAL.N2); for (let i = -1; i <= uw; i++) { b.set(x + 7 - (uw >> 1) + i, y + h - 15, PAL.R2); b.set(x + 7 - (uw >> 1) + i, y + h - 5, PAL.R2); } }
};
export const harasBust = (s: Partial<HarasBust> = {}) => {
  const st = {...HARAS_DEFAULT, ...s};
  const img = bust(st);
  if (st.arm === 'none') return img;
  const out = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const b = new Buf(img.w, img.h, 0x1000000);
  if (st.arm === 'upside') tapeB(b, 12, 58, 40, true);
  else { tapeB(b, 30, 110, 26, false); line(42, 112, 50, 104, b.ink(PAL.N0)); }
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== 0x1000000) { const y = Math.floor(i / img.w), x = i % img.w; const hand = st.arm === 'upside' ? (y > 92 && x < 32) : (y > 116 && x < 46 && x > 28); if (!(hand && out.c[i] >= 0)) out.c[i] = b.c[i]; }
  return out;
};

export interface HarasRoomPose { state: 'walk' | 'stand' | 'seated'; legs?: RoomLegs; mouth?: 'rest' | 'open' | 'smile' }
const rspec: RoomFigSpec = {
  kind: 'pantsuit', legMat: 'trou',
  ramps: {skin: SKIN.medium, hair: HAIRD, suit: TEAL, shirt: CREAM, trou: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], tape: [PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9], dev: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5]},
  backRamp: {skin: PAL.S3, suit: PAL.C4},
  extras: (_p, bob) => ({stamps: [{x: 24, y: 31 + bob, rows: ['dddd', 'dDDd', 'dddd', '.t..', '.t..', '.tt.'], pal: {d: ['dev', 2], D: ['dev', 4], t: ['tape', 3]}}] as never}),
};
const room = makeRoom(rspec);
export const drawHarasRoom = (b: Buf, footX: number, footY: number, p: Partial<HarasRoomPose> = {}, o: {flip?: boolean} = {}) => {
  const q: HarasRoomPose = {state: 'walk', mouth: 'rest', ...p};
  room.draw(b, footX, footY, {arm: q.state === 'seated' ? 'clasp' : 'reach', seat: q.state === 'seated' ? 'cross' : undefined, legs: q.legs ?? 'stand', head: {hair: 'bob', mouth: q.mouth, woman: true}}, o);
};
/** the calculator tape along a path (each point [x, y]): a 2 px paper ribbon, a digit tick every 5 px, its lit edge */
export const drawCalcTape = (b: Buf, pts: Array<[number, number]>, o: {upside?: [number, number]} = {}) => {
  let k = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let s = 0; s <= n; s++, k++) {
      const x = Math.round(x0 + ((x1 - x0) * s) / n), y = Math.round(y0 + ((y1 - y0) * s) / n);
      b.set(x, y, PAL.P2); b.set(x, y + 1, PAL.P1); b.set(x, y + 2, PAL.P0);
      if (k % 5 === 0) b.set(x, y + 1, PAL.G4);
    }
  }
  if (o.upside) { const [x, y] = o.upside; fill(b, x - 1, y - 1, 26, 9, PAL.P2); tiny(b, 'UPSIDE', x, y, PAL.N2); for (let i = -2; i < 26; i++) { b.set(x + i, y - 2, PAL.R2); b.set(x + i, y + 7, PAL.R2); } }
};

const e = (x: Expr, m: Viseme = 'rest', arm: HarasBust['arm'] = 'tape'): HarasBust => ({mouth: m, expr: x, arm});
export const ART: ArtAsset[] = [{
  id: 'char-haras', manifest: '§2.2 HARAS', kind: 'character', name: 'HARAS (first CFO)',
  file: 'cast/haras.ts', exports: 'harasBust, drawHarasRoom, drawCalcTape, HARAS_DEFAULT', scenes: '19, 20',
  note: 'teal blazer, dark bob, the calculator tape; brisk smile, "And profit?" (focus), "Upside." (proud); walking, on a beanbag',
  stills: [{label: 'busts: "starting with the easy ones" (smile, talk) · "And profit?" (focus) · "Upside." (proud, the tape up) · neutral; room: walk, stand, on a beanbag; the tape', draw: (b) => {
    sheetPlate(b, [PAL.N2, PAL.N3, PAL.N3, PAL.N4]);
    sheetBust(b, harasBust(e('smile', 'E')), -8, 52, 'the easy ones');
    sheetBust(b, harasBust(e('focus', 'O')), 86, 52, 'and profit?');
    sheetBust(b, harasBust(e('proud', 'rest', 'upside')), 180, 52, 'upside.');
    sheetBust(b, harasBust(e('neutral', 'rest', 'none')), 274, 52, 'neutral');
    sheetRoom(b, 390, 'walk', (x, y) => drawHarasRoom(b, x, y, {state: 'walk', legs: 'w2'}));
    drawCalcTape(b, [[394, 158], [380, 180], [360, 186], [330, 187]]);
    sheetRoom(b, 420, 'stand', (x, y) => drawHarasRoom(b, x, y, {state: 'stand', mouth: 'smile'}));
    beanbag(b, 444, 168, 2);
    sheetRoom(b, 460, 'beanbag', (x, y) => drawHarasRoom(b, x, 190, {state: 'seated'}));
  }}],
}];
