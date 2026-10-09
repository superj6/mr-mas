// MR. MAS — Ep2 v1 art: MAS's new room-scale drawings (manifest §2.1). The rig is Ep1's standing sprite
// (shared/pixel/cast/mas-stand.ts: the grey hoodie, the forward cowlick, calm level eyes; 78 px), COPIED here with the
// arms Ep2 needs, because a shared rig is never edited. Same lineup height, same ramps.
//   drawMasStand2(b, x, y, pose)   3/4 facing screen-right (flip for left). pose.arm:
//                                  'phone'    both hands at his chest round his phone, head bowed over it (the lawn's
//                                             typing, sc 19; the scramble on the bridge, sc 17)
//                                  'umbrella' his near hand up on a plain umbrella's shaft (sc 17, May 20; the canopy
//                                             is drawn with it, rain beading on it)
//                                  'tape'     both hands up at a pillar at head height (taping his flyer back upside
//                                             down, sc 13; peeling it off, sc 20)
//                                  'knock'    the near hand raised in a loose fist at the door's height (sc 22), then
//                                             'down' (lowered)
//                                  'glass'    his water glass at his chest (the party crowd, F2.2; the lobby)
//                                  'slot'     the near hand forward at chest height, the flyer in it (sc 22's push)
//                                  'down' | 'reach' | 'pocket' (Ep1's)
//   drawMasBack(b, x, y, legs)     from behind, walking away (sc 22's 4-5 s walk across the lot): the back of his head,
//                                  the hood, the arms' swing; 4 walk drawings on 3s
import {Buf, line} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../../../../../shared/pixel/figure';
import {bayer4} from '../../../../../shared/pixel/dither';
import {memo, seg} from '../../../../../shared/pixel/cast/kit';
import {fill, pt} from '../kit';
import {sheetPlate, sheetRoom} from './sheet';
import {placeHand, drawHand, sleeve, POSES} from './hands2';
import type {ArtAsset} from '../asset';

export const MAS2_W = 44, MAS2_H = 80;
export const MAS2_FOOT: [number, number] = [20, 78];
export type Mas2Legs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3';
export type Mas2Arm = 'down' | 'reach' | 'pocket' | 'phone' | 'umbrella' | 'tape' | 'knock' | 'glass' | 'glassUp' | 'slot';
export interface Mas2Pose { legs?: Mas2Legs; arm: Mas2Arm; mouth?: 'rest' | 'open' | 'smile'; blink?: boolean; light?: 'room' | 'monitor' | 'sil' | 'dusk'; bow?: boolean }
type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGSETS: Record<Mas2Legs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: L(22, 22.4, 59, 22.6, 73), f: L(16.5, 16.4, 59, 16, 73), bob: 0},
  w0: {n: L(22, 25.6, 58, 28.6, 72), f: L(16.5, 13.8, 59, 10.4, 72), bob: 1},
  w1: {n: L(22, 22.6, 59, 22, 73), f: L(16.5, 18.2, 57, 19.2, 69), bob: 0},
  w2: {n: L(22, 18.8, 59, 15.4, 72), f: L(16.5, 20.4, 58, 23.2, 72), bob: 1},
  w3: {n: L(22, 23, 57, 24, 69), f: L(16.5, 16.6, 59, 16.4, 73), bob: 0},
};
const HEAD = [
  '.........JI.....', '.....hHHIJI.....', '...hHHHIIIHh....', '..hHHIIIHHHHh...', '.hHHIIHHHHHh4o..', '.hHHHHHhh23444o.', 'hHHHHhh22bb4b4o.',
  'hHHHh2233e44eo..', 'hHHh2233444444o.', '.hHh22334444445o', '.hh1223344443o..', '..h1223344444o..', '..o12233444mmo..', '...o122334444o..',
  '....o1222333o...', '.....o12233.....', '.....o12233.....', '.....o12233.....',
];
// (and the second pass: the profile set back, the nose one pixel proud of the bridge, the upper lip, mouth and chin
// receding under it, and the mouth two pixels at the front, not a four-pixel stroke back across the cheek that read
// as a moustache)
// (the art review: Ep1's rig ran an outline from the lip down the chin into the neck, which read as a goatee, most of
// all under the bridge's dusk grade. Here the chin is a lit form, the jaw's underside a mid shadow, the neck set back
// in skin tones and carried to the collar, and the body's own neck part (with its outline) is dropped.)
/** [near elbow x, y, near hand x, y, far elbow x, y, far hand x, y] per arm pose (local, unflipped) */
const ARMS: Record<Mas2Arm, number[]> = {
  down: [26, 32, 26.4, 41, 14, 32, 14.4, 41],
  reach: [29, 31, 36, 41, 14, 32, 14.4, 41],
  pocket: [27, 33, 23, 38, 14, 32, 14.4, 41],
  phone: [27, 34, 25, 30, 17, 33, 22, 30],
  umbrella: [29, 26, 27, 18, 14, 32, 14.4, 41],
  tape: [31, 24, 35, 16, 22, 26, 33, 18],
  knock: [31, 25, 37, 18, 14, 32, 14.4, 41],
  glass: [28, 34, 28, 28, 14, 32, 14.4, 41],
  glassUp: [31, 28, 33, 16, 14, 32, 14.4, 41],
  slot: [31, 29, 38, 28, 14, 32, 14.4, 41],
};
const fig = (p: Mas2Pose): FigureDef => {
  const Lg = LEGSETS[p.legs ?? 'stand'];
  const bob = Lg.bob;
  const B = (v: number) => v + bob;
  const leg = (l: Leg, near: boolean): Part[] => {
    const g = near ? 'legN' : 'legF';
    const foot = P.poly(l.ax - 2.6, l.ay, l.ax + 2.6, l.ay, l.ax + 6.4, l.ay + 3, l.ax + 6.4, l.ay + 5, l.ax - 3, l.ay + 5);
    return [{group: g, mat: 'jeans', prims: [seg(l.hip, 44, 7, l.kx, l.ky, 5.6), seg(l.kx, l.ky, 5.4, l.ax, l.ay + 1, 4.6), P.ell(l.kx, l.ky, 2.7, 2.5)]}, {group: g + 's', mat: 'shoe', prims: [foot]}];
  };
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'hood', prims: [P.ell(sx, B(sy), 3.8, 4), seg(sx, B(sy), 7, ex, B(ey), 6.2), seg(ex, B(ey), 6, hx, B(hy), 5.2), P.ell(ex, B(ey), 3, 3)]});
  const swing = p.legs === 'w0' ? -2 : p.legs === 'w2' ? 2 : 0;
  const a = ARMS[p.arm].slice();
  if (p.arm === 'down') { a[0] += swing * 0.5; a[2] += swing; }
  if (['down', 'reach', 'pocket', 'umbrella', 'knock', 'glass', 'glassUp', 'slot'].includes(p.arm)) { a[4] -= swing * 0.5; a[6] -= swing; }
  const parts: Part[] = [
    ...leg(Lg.f, false),
    sl('armF', 15, 22, a[4], a[5], a[6], a[7]),
    ...leg(Lg.n, true),
    {group: 'torso', mat: 'hood', prims: [P.poly(13, B(19), 19, B(17), 25, B(18), 28, B(22), 29, B(30), 28, B(38), 29, B(46), 11, B(46), 11, B(38), 10, B(30), 10, B(23))]},
    {group: 'hoodlump', mat: 'hood', prims: [P.poly(9, B(16), 15, B(14), 18, B(18), 12, B(21))]},
    sl('armN', 25, 22, a[0], a[1], a[2], a[3]),
  ];
  const rows = HEAD.slice();
  if (p.blink || p.bow) rows[7] = 'hHHHh2233b44bo..';
  if (p.mouth === 'open') { rows[12] = '..o1223344MMMo..'; rows[13] = '...o122334MM4o..'; }
  if (p.mouth === 'smile') rows[11] = '..h1223344m44o..';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(B(y)) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const fist = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(B(y)) - 2, rows: ['.33.', '3443', '3443', '2332', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  const stamps: Stamp[] = [
    {x: p.bow ? 12 : 11, y: bob + (p.bow ? 1 : 0), rows, pal: {o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5], h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0]}},
    {x: 19, y: B(19), rows: ['d.d', 'd.d', 'd.d', '..d'], pal: {d: ['hood', 5]}},
    {x: 14, y: B(36), rows: ['kkkkkkkkkkk', 'k.........k'], pal: {k: ['hood', 1]}},
  ];
  if (p.arm !== 'pocket') stamps.push(p.arm === 'knock' ? fist(a[2], a[3]) : hand(a[2], a[3]));
  stamps.push(hand(a[6], a[7]));
  if (p.arm === 'phone') stamps.push({x: 21, y: B(27), rows: ['kkk', 'kpk', 'kpk', 'kkk'], pal: {k: ['dark', 0], p: ['screen', 4]}});
  // the glass in his hand (a tumbler: its rim, the light through it, the drink, the base), raised to the toast at glassUp
  if (p.arm === 'glass' || p.arm === 'glassUp') stamps.push({x: p.arm === 'glass' ? 26 : 32, y: B(p.arm === 'glass' ? 21 : 9), rows: ['gwwg', 'g..g', 'gaag', 'gaag', '.gg.'], pal: {g: ['glass', 5], w: ['glass', 4], a: ['drink', 3]}});
  if (p.arm === 'slot') stamps.push({x: 37, y: B(24), rows: ['ppppp', 'pqqqp', 'ppppp'], pal: {p: ['flyer', 4], q: ['flyer', 1]}});
  return {w: MAS2_W, h: MAS2_H, parts, adjust: [{prims: [P.rect(0, 60, MAS2_W, 20)], add: -1, onlyMat: 'jeans'}], stamps};
};
const MLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5], hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  jeans: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6], shoe: [PAL.N1, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.P2], dark: Array(6).fill(PAL.N0),
  screen: [PAL.C2, PAL.C4, PAL.C5, PAL.C6, PAL.C8, PAL.C9], glass: [PAL.G4, PAL.G5, PAL.C6, PAL.C7, PAL.G6, PAL.P2], drink: [PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7], flyer: [PAL.G3, PAL.N2, PAL.P0, PAL.P1, PAL.P2, PAL.P2],
};
const MMON: Record<string, number[]> = {...MLIT, skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4], hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.C3, PAL.C6], hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5]};
const MDUSK: Record<string, number[]> = {...MLIT, skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.U5], hood: [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.U4], hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.U4], jeans: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]};
const MSIL: Record<string, number[]> = Object.fromEntries(Object.keys(MLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const rig = (light: NonNullable<Mas2Pose['light']>): LightRig => ({
  key: light === 'monitor' ? [-0.9, -0.35] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: light === 'monitor' ? [1, -0.1] : [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, hood: PAL.C6, jeans: PAL.C5, shoe: PAL.C4} : light === 'dusk' ? {skin: PAL.U4, hair: PAL.U3, hood: PAL.U3, jeans: PAL.U2, shoe: PAL.U2} : {skin: PAL.K1, hair: PAL.C2, hood: PAL.C2, jeans: PAL.N4, shoe: PAL.G3},
  ramps: light === 'room' ? MLIT : light === 'monitor' ? MMON : light === 'dusk' ? MDUSK : MSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
});
const img2 = memo((p: Mas2Pose) => renderFigure(fig(p), rig(p.light ?? 'room')));
/** a plain umbrella over him (dark navy canopy, its ribs, rain beading on its edge), handle at his near hand */
const umbrella = (b: Buf, hx: number, hy: number, f: number) => {
  line(hx, hy, hx, hy - 20, b.ink(PAL.N1));
  const cx = hx, cy = hy - 20;
  for (let j = 0; j < 10; j++) for (let i = -17; i <= 17; i++) { const d = Math.hypot(i / 17.5, (j - 10) / 10); if (d < 1) b.set(cx + i, cy + j - 10, d > 0.9 ? PAL.N6 : j < 3 ? PAL.N5 : Math.abs(i) % 6 === 0 ? PAL.N2 : i < 0 ? PAL.N4 : PAL.N3); }
  for (let i = -17; i <= 17; i++) b.set(cx + i, cy, (i & 1) ? PAL.N2 : PAL.N1);
  for (let i = -17; i <= 17; i += 3) if (((i + Math.floor(f / 4)) & 3) === 0) b.set(cx + i, cy + 1, PAL.C6);
  b.set(cx, cy - 11, PAL.N4);
};
export const drawMasStand2 = (b: Buf, footX: number, footY: number, p: Mas2Pose, o: {flip?: boolean; f?: number; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? MAS2_W - 1 - MAS2_FOOT[0] : MAS2_FOOT[0];
  const x0 = footX - fx, y0 = footY - MAS2_FOOT[1];
  blitImg(b, img2(p), x0, y0, {flip: o.flip, clip: o.clip});
  if (p.arm === 'umbrella') { const a = ARMS.umbrella; const bob = LEGSETS[p.legs ?? 'stand'].bob; umbrella(b, o.flip ? x0 + MAS2_W - 1 - Math.round(a[2]) : x0 + Math.round(a[2]), y0 + Math.round(a[3]) + bob, o.f ?? 0); }
};

// ------------------------------------------------------------------ from behind, walking away
const BACK_HEAD = [
  '......JI........', '....hHHIJh......', '...hHHHIIHHh....', '..hHHHHHHHHHh...', '.hHHHHHHHHHHHh..', '.hHHHHHHHHHHHh..', 'ohHHHHHHHHHHHho.',
  'ohHHHHHHHHHHHho.', '.hHHHHHHHHHHHh..', '.hhHHHHHHHHHhh..', '..hhHHHHHHHhh...', '...ohhhhhhho....', '....o12221o.....', '....o12221o.....',
];
const backFig = (legs: Mas2Legs): FigureDef => {
  const Lg = LEGSETS[legs];
  const bob = Lg.bob, B = (v: number) => v + bob;
  const leg = (l: Leg, g: string): Part[] => [{group: g, mat: 'jeans', prims: [seg(l.hip, 44, 7, l.kx - (l.kx - l.hip) * 0.6, l.ky, 5.6), seg(l.kx - (l.kx - l.hip) * 0.6, l.ky, 5.4, l.hip + (l.ax - l.hip) * 0.25, l.ay + 1, 4.6)]}, {group: g + 's', mat: 'shoe', prims: [P.rect(l.hip + (l.ax - l.hip) * 0.25 - 3, l.ay + 1, 6, 4)]}];
  const sw = legs === 'w0' ? 2 : legs === 'w2' ? -2 : 0;
  const sl = (g: string, sx: number, hx: number, hy: number): Part => ({group: g, mat: 'hood', prims: [P.ell(sx, B(22), 3.8, 4), seg(sx, B(22), 6.6, hx, B(hy), 5)]});
  const parts: Part[] = [
    ...leg({...Lg.f, hip: 16.5}, 'legF'), ...leg({...Lg.n, hip: 23}, 'legN'),
    sl('armF', 11, 9 + sw, 40), sl('armN', 29, 31 - sw, 40),
    {group: 'torso', mat: 'hood', prims: [P.poly(12, B(19), 19, B(16), 23, B(16), 29, B(19), 31, B(30), 30, B(46), 11, B(46), 10, B(30))]},
    {group: 'hood', mat: 'hoodD', prims: [P.poly(14, B(16), 20, B(13), 26, B(16), 27, B(23), 20, B(26), 14, B(23))]},
  ];
  const stamps: Stamp[] = [{x: 12, y: bob, rows: BACK_HEAD, pal: {o: ['skin', 1], '1': ['skin', 1], '2': ['skin', 2], h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4]}}];
  return {w: MAS2_W, h: MAS2_H, parts, adjust: [{prims: [P.rect(0, 60, MAS2_W, 20)], add: -1, onlyMat: 'jeans'}], stamps};
};
const backImg = memo((legs: Mas2Legs) => renderFigure(backFig(legs), {...rig('room'), ramps: {...MLIT, hoodD: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4]}, key: [0.4, -0.9]}));
export const drawMasBack = (b: Buf, footX: number, footY: number, legs: Mas2Legs = 'stand') => blitImg(b, backImg(legs), footX - MAS2_FOOT[0], footY - MAS2_FOOT[1]);

// ------------------------------------------------------------------ sc 20: the IOU's corner, his fingers finding it
/** [ECU] Jun 11 (sc 20): the inside of his jacket's breast pocket in close-up, his fingers going in and finding a
 *  yellowed paper corner (Ep1's note: its corner only, a few faded marks, NO legible words: it is never read on screen),
 *  the knuckles, the cuff; the one close shot the IOU gets (manifest §3, FC). st.k 0 = reaching, 1 = touching it */
export const iouCornerECU = (b: Buf, f: number, st: {k?: 0 | 1} = {}) => {
  // his grey hoodie's front in the lobby's morning light: the knit (a fine vertical rib, lit from upper left), the
  // kangaroo pocket's panel across the lower frame with its stitched hem; the opening a shadowed gap that bows open
  // where the paper stands in it
  const K: [number, number] = [-0.55, -0.83];
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    const lit = 0.55 - 0.35 * ((x / 480) * 0.6 + (y / 203) * 0.4);
    let c = lit > 0.42 ? PAL.G4 : lit > 0.26 ? PAL.G3 : PAL.G2;
    if (x % 3 === 0) c = stepColor(c, -1);
    if (bayer4(x, y) < 0.08) c = stepColor(c, 1);
    b.set(x, y, c);
  }
  void K;
  const hemY = (x: number) => 118 + Math.round(6 * Math.sin((x / 480) * Math.PI));
  const cx = 206, cy = 60, pw0 = 58, ph0 = 64;
  // the gap's shadow (the opening bowing round the paper)
  for (let x = 0; x < 480; x++) { const bow = Math.max(0, 1 - Math.abs(x - (cx + pw0 / 2)) / 70); const d = 2 + Math.round(bow * 7); fill(b, x, hemY(x) - d, 1, d, x % 2 ? PAL.N1 : PAL.N0); }
  // the yellowed corner: a folded sheet standing up out of the pocket, leaning, its fold a rung darker; two faded rules
  const lean = 0.18;
  for (let j = 0; j < ph0; j++) for (let i = 0; i < pw0; i++) {
    const X = cx + i + Math.round((ph0 - j) * lean), Y = cy + j;
    if (i + j < 9) continue; // the dog-eared corner (folded back, drawn below)
    let c = (i * 3 + j) % 13 === 0 ? PAL.W6 : PAL.W7;
    if (i === 0 || j === 0 || i + j === 9) c = PAL.W8;
    if (i > pw0 - 4) c = PAL.W6;
    if (Math.abs(i - 30 - j * 0.1) < 0.6) c = PAL.W6; // the old fold
    b.set(X, Y, c);
  }
  for (let i = 0; i < 9; i++) for (let j = 0; j < 9 - i; j++) b.set(cx + i + Math.round((ph0 - j) * lean), cy + j, j + i > 6 ? PAL.W5 : PAL.W6);
  for (const [ry, rw] of [[18, 38], [26, 30], [34, 36]] as const) for (let i = 8; i < 8 + rw; i++) if ((i + ry) % 4) b.set(cx + i + Math.round((ph0 - ry) * lean), cy + ry, PAL.W5);
  // the pocket panel over the paper's foot: a lighter layer (it's nearer the light), the hem, its stitches, a pull
  for (let x = 0; x < 480; x++) for (let y = hemY(x); y < 203; y++) { let c = y < hemY(x) + 6 ? PAL.G4 : (x % 3 === 0 ? PAL.G3 : PAL.G4); if (x > 300) c = stepColor(c, -1); if (y === hemY(x)) c = PAL.G5; b.set(x, y, c); }
  for (let x = 4; x < 480; x += 5) { fill(b, x, hemY(x) + 8, 3, 1, PAL.G2); }
  for (let x = 0; x < 480; x++) b.set(x, hemY(x) + 6, PAL.G3);
  // his hand from the upper right: the index and thumb pinch the corner's tip (pulled a little up out of the pocket at
  // k 1), the other fingers curled, the grey cuff, the sleeve off frame
  const tip: [number, number] = st.k === 1 ? [cx + 16 + Math.round(ph0 * lean), cy - 4] : [cx + 18 + Math.round(ph0 * lean), cy + 6];
  const h = placeHand(POSES.pinch([-0.55, 0.62, -0.5], [0.2, -0.55, 0.8], 'R'), {s: 9, at: tip, anchor: 'index', light: 'lobby', key: [-0.4, -0.7, 0.6], cuffRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.P1]});
  sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 150, h.cuffEnd[1] - 150], 34, 38, [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], K);
  drawHand(b, h.hand, h.x, h.y);
  void f;
};

export const ART: ArtAsset[] = [{
  id: 'char-mas-ep2', manifest: '§2.1 MAS (new room drawings)', kind: 'character', name: 'MAS: Ep2\'s new room poses',
  file: 'cast/mas2.ts', exports: 'drawMasStand2, drawMasBack, iouCornerECU, MAS2_FOOT', scenes: '13, 17, 19, 20, 22, F2.2',
  note: 'Ep1\'s standing rig (copied) with phone, umbrella, tape, knock, glass and slot arms; and his back walking away',
  stills: [{label: 'phone (bowed) · umbrella · tape · knock · glass · slot (the flyer) · from behind: walk', draw: (b) => {
    sheetPlate(b);
    const poses: Array<[string, Mas2Pose]> = [['phone', {arm: 'phone', bow: true}], ['umbrella', {arm: 'umbrella'}], ['tape', {arm: 'tape'}], ['knock', {arm: 'knock'}], ['glass', {arm: 'glass', mouth: 'smile'}], ['slot', {arm: 'slot'}], ['dusk phone', {arm: 'phone', light: 'dusk', bow: true}]];
    poses.forEach(([lab, p], i) => sheetRoom(b, 40 + i * 52, lab, (x, y) => drawMasStand2(b, x, y, p, {f: 4})));
    (['w0', 'w1', 'w2', 'w3'] as const).forEach((l, i) => sheetRoom(b, 410 + i * 18, i === 0 ? 'back' : '', (x, y) => drawMasBack(b, x, y, l)));
    void fill; void pt;
  }},
  {label: '[ECU] sc 20, Jun 11: his fingers finding the IOU\'s yellowed corner in his jacket\'s pocket (the corner only; no words)', draw: (b) => iouCornerECU(b, 0, {k: 1})}],
}];
