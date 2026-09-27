// MR. MAS — cast: OIGNEB, room sprite (Ep1 sc 12; characters/oigneb.md). New file (v3-art-a, 2026-09-27).
// "The worried professor": soft-spoken, a grey fleece, glasses, grey hair; gentle, precise, deeply worried, never
// shrill. In Ep1 he holds up a PAUSE sign at the standing desk in the dark ("a room sprite with a dialogue box, no
// portrait"); nobody pauses. His accent colour is the safety car's amber (the sign's border). No accent humour; no
// likeness: silhouette, the fleece, the glasses and the sign.
//   drawOigneb(b, footX, footY, pose, {flip})   3/4 facing screen-LEFT (toward Nole); flip for right
//   pose.sign: 'chest' (held up in both hands at his chest) · 'high' (holding it higher, over his head) · 'none'
//   pose.mouth: rest | open (his line)
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';
import {tiny} from '../rooms/kit-b';

export const OIGNEB_W = 56, OIGNEB_H = 96;
export const OIGNEB_FOOT: [number, number] = [26, 94];
export interface OignebPose { sign: 'chest' | 'high' | 'none'; mouth: 'rest' | 'open'; blink: boolean; light: 'room' | 'dim' }
export const OIGNEB_DEFAULT: OignebPose = {sign: 'chest', mouth: 'rest', blink: false, light: 'dim'};

// the head: 3/4 to screen-left, grey hair receding at the temples, glasses, a gentle worried brow (16 x 17)
const HEAD = [
  '....hhhhhhh.....',
  '..hhHHHHHHHhh...',
  '.hHHh3444hHHHh..',
  '.hH33444443hHh..',
  'o4g4gg4g443hHh..',
  '4gwgggwg4432hh..',
  '.gg4ggg44432h...',
  '.444444443322o..',
  '5444444443322o..',
  'o44444444332oo..',
  '.4444444433221..',
  '.o44mmm44332211.',
  '..o44444332211..',
  '...o44433221o...',
  '....o3322211o...',
  '.....oo1111o....',
  '.......o21o.....',
];
const fig = (p: OignebPose): FigureDef => {
  const Y = 12; // the sprite is taller than its body so a raised sign fits above his head
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'trousers', prims: [seg(hip, Y + 48, 7.4, kx, Y + 62, 5.8), seg(kx, Y + 62, 5.6, ax, Y + 77, 4.8), P.ell(kx, Y + 62, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax + 2.6, Y + 77, ax - 2.6, Y + 77, ax - 6.6, Y + 80, ax - 6.6, Y + 82, ax + 3, Y + 82)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'fleece', prims: [P.ell(sx, Y + sy, 3.8, 4), seg(sx, Y + sy, 7, ex, Y + ey, 6), seg(ex, Y + ey, 5.8, hx, Y + hy, 5), P.ell(ex, Y + ey, 3, 3)]});
  const high = p.sign === 'high', none = p.sign === 'none';
  // arms: the sign's two hands at its lower corners (chest) or above his head (high)
  const A = none ? [34, 36, 33, 45, 19, 36, 19, 45] : high ? [36, 12, 34, -4, 16, 12, 14, -4] : [36, 32, 32, 28, 18, 32, 16, 28];
  const parts: Part[] = [
    ...leg('legF', 31, 31.4, 31.8),
    sl('armF', 33, 23, A[0], A[1], A[2], A[3]),
    ...leg('legN', 23, 22.6, 22.2),
    // the grey fleece, a little shapeless (a professor's), its zip line
    {group: 'torso', mat: 'fleece', prims: [P.poly(17, Y + 21, 23, Y + 18, 31, Y + 18, 36, Y + 22, 37, Y + 31, 35, Y + 40, 36, Y + 50, 17, Y + 50, 18, Y + 40, 16, Y + 31, 16, Y + 24)]},
    {group: 'collar', mat: 'fleece', prims: [P.poly(21, Y + 17, 31, Y + 17, 30, Y + 21, 22, Y + 21)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(23, Y + 14, 29, Y + 14, 29, Y + 18, 23, Y + 18)]},
  ];
  parts.push(sl('armN', 20, 23, A[4], A[5], A[6], A[7]));
  const rows = HEAD.slice();
  if (p.blink) rows[5] = '4gggggg4g4432hh.';
  if (p.mouth === 'open') rows[11] = '.o44mMm44332211.';
  const stamps: Stamp[] = [{x: 17, y: Y, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 2], H: ['hair', 4], g: ['glass', 1], w: ['glass', 4], m: ['skin', 1], M: ['dark', 0],
  }}];
  stamps.push({x: 26, y: Y + 22, rows: ['z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z'], pal: {z: ['fleece', 1]}});
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Y + Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  if (!none) {
    // the PAUSE sign: a white board, an amber border (the safety car's colour), the word (drawn by drawOigneb after)
    const sx = 4, sy = high ? Y - 12 : Y + 12;
    const rowsS = [
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwA',
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    ];
    stamps.push({x: sx, y: sy, rows: rowsS, pal: {A: ['sign', 4], w: ['sign', 5]}});
    stamps.push(hand(A[2], A[3])); stamps.push(hand(A[6], A[7]));
  } else { stamps.push(hand(A[2], A[3])); stamps.push(hand(A[6], A[7])); }
  return {w: OIGNEB_W, h: OIGNEB_H, parts, adjust: [{prims: [P.rect(0, Y + 64, OIGNEB_W, 20)], add: -1, onlyMat: 'trousers'}], stamps};
};
const LIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P1],
  fleece: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  trousers: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  glass: [PAL.N0, PAL.N1, PAL.G3, PAL.G5, PAL.C7, PAL.C8],
  sign: [PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W6, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const dim = (r: number[]) => r.map((_, i) => r[Math.max(0, i - 1)]);
const DIM: Record<string, number[]> = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, k === 'sign' || k === 'glass' ? r : dim(r)]));
const rig = (light: OignebPose['light']): LightRig => ({
  key: [-0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [1, -0.1], backBand: 1, backRamp: {skin: PAL.W5, hair: PAL.W4, fleece: PAL.W3, trousers: PAL.W2},
  ramps: light === 'room' ? LIT : DIM,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  noEdge: ['sign', 'glass'],
  keyGain: (_x, y) => (y < 60 ? 1 : Math.max(0.3, 1 - (y - 60) / 34)),
});
export const oignebImg = memo((p: OignebPose) => renderFigure(fig(p), rig(p.light)));
export const drawOigneb = (b: Buf, footX: number, footY: number, p: Partial<OignebPose> = {}, o: {flip?: boolean} = {}) => {
  const st = {...OIGNEB_DEFAULT, ...p};
  const fx = o.flip ? OIGNEB_W - 1 - OIGNEB_FOOT[0] : OIGNEB_FOOT[0];
  const x = footX - fx, y = footY - OIGNEB_FOOT[1];
  blitImg(b, oignebImg(st), x, y, {flip: o.flip});
  // the sign's word, never mirrored: PAUSE in the sign's ink, centred on the board
  if (st.sign !== 'none') {
    const bx = o.flip ? x + OIGNEB_W - 1 - 4 - 41 : x + 4, by = y + (st.sign === 'high' ? 0 : 24);
    const word = 'PAUSE';
    // the display-size letters, hand-set at 3x5 doubled (bold) so they read at room scale
    tiny(b, word, bx + 10, by + 3, PAL.R2); tiny(b, word, bx + 11, by + 3, PAL.R2);
    tiny(b, word, bx + 10, by + 4, PAL.R1);
  }
};
