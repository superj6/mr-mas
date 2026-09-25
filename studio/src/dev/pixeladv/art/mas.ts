// MR. MAS — pixeladv: MAS, room sprite. Seated at his desk, seen from behind, backlit by the monitor.
// Rig: body (static) + arms (2 typing frames) + head (3 drawn angles: back / lost-profile / profile)
// + blink + one-pixel smile. Palette swaps handle the door light (warm rim) and the jolt.
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, Img} from '../core/figure';
import {PAL} from '../core/palette';

export const MAS_W = 36;
export const MAS_H = 68;
/** room position of the figure's top-left */
export const MAS_AT: [number, number] = [194, 99];

export type MasHead = 'back' | 'lost' | 'profile';
export interface MasPose { head: MasHead; type: 0 | 1 | 2; blink: boolean; smile: boolean; breathe: number; warm: boolean; hairBob: number; }

const hairBack = (bob: number): Part[] => [
  {group: 'head', mat: 'hair', prims: [P.ell(18, 10.5, 5.2, 6.2)]},
  // forward cowlick: from behind it reads as a tuft cresting the crown, springy
  {group: 'head', mat: 'hair', prims: [P.map(14, 1 + bob, ['...##', '..##.', '.###.', '###..'])]},
];

const body = (breathe: number, type: number): Part[] => {
  const b = breathe;
  const aL = type === 1 ? -1 : 0, aR = type === 2 ? -1 : 0;
  return [
    // arms go forward to the keyboard; elbows lift a pixel on keystrokes
    {group: 'armL', mat: 'hood', prims: [P.poly(8, 23 - b, 11, 21 - b, 11, 35 + aL, 7, 37 + aL, 4.5, 33 + aL, 5.5, 26 - b)]},
    {group: 'armR', mat: 'hood', prims: [P.poly(28, 23 - b, 25, 21 - b, 25, 35 + aR, 29, 37 + aR, 31.5, 33 + aR, 30.5, 26 - b)]},
    {group: 'torso', mat: 'hood', prims: [P.poly(8, 23 - b, 12, 20 - b, 24, 20 - b, 28, 23 - b, 28, 41, 8, 41)]},
    // the hood, bunched on his upper back
    {group: 'hood', mat: 'hood', prims: [P.ell(18, 21 - b, 6.6, 3.2)]},
    {group: 'hood', mat: 'hoodIn', prims: [P.ell(18, 20.5 - b, 3.6, 1.6)]},
  ];
};

const chair: Part[] = [
  {group: 'chair', mat: 'chair', prims: [P.poly(10, 31, 26, 31, 27.5, 33, 27.5, 46, 25.5, 48, 10.5, 48, 8.5, 46, 8.5, 33)]},
  {group: 'seat', mat: 'chair', prims: [P.rect(7, 48, 22, 3)]},
  {group: 'post', mat: 'metal', prims: [P.rect(17, 51, 3, 10)]},
  {group: 'base', mat: 'chair', prims: [P.line(18, 61, 6, 63), P.line(18, 61, 30, 63), P.line(18, 61, 11, 65), P.line(18, 61, 25, 65), P.line(18, 60, 18, 62)]},
  {group: 'base', mat: 'metal', prims: [P.rect(5, 63, 2, 2), P.rect(30, 63, 2, 2), P.rect(10, 65, 2, 2), P.rect(25, 65, 2, 2)]},
];

const headParts = (h: MasHead, bob: number): Part[] => {
  const neck: Part = {group: 'neck', mat: 'skin', prims: [P.rect(15, 15, 6, 4)]};
  if (h === 'back')
    return [neck, ...hairBack(bob),
      {group: 'ear', mat: 'ear', prims: [P.ell(12.8, 11, 1, 1.7)]},
      {group: 'ear', mat: 'ear', prims: [P.ell(23.2, 11, 1, 1.7)]},
    ];
  if (h === 'lost')
    // lost profile: head turned toward screen-right; cheek line + ear, face still hidden
    return [neck,
      {group: 'head', mat: 'skin', prims: [P.poly(21, 8, 24, 9, 24.5, 13, 23, 16, 20, 17, 19, 12)]},
      {group: 'head', mat: 'hair', prims: [P.ell(17.6, 10.3, 5.2, 6.1), P.poly(20, 5, 24, 6, 24.5, 9, 21, 8)]},
      {group: 'head', mat: 'hair', prims: [P.map(16, 1 + bob, ['...##', '..###', '.###.', '###..'])]},
      {group: 'ear', mat: 'skin', prims: [P.ell(20.4, 11.2, 1.1, 1.8)]},
    ];
  // profile facing screen-right
  return [neck,
    {group: 'head', mat: 'skin', prims: [P.poly(17, 5, 22, 5, 24, 8, 24.4, 10, 25.6, 11.4, 24.5, 12.2, 24.5, 14, 23, 15, 22.4, 16.4, 19, 17, 15, 15, 13, 10)]},
    {group: 'head', mat: 'hair', prims: [P.poly(12, 9, 13, 5, 16, 3, 21, 3, 23.5, 5, 24, 7.5, 21, 6.5, 19, 7.5, 17.5, 10, 16, 14, 13.5, 13)]},
    {group: 'head', mat: 'hair', prims: [P.map(20, 0 + bob, ['...##.', '..####', '.###..', '###...'])]},
    {group: 'ear', mat: 'skin', prims: [P.ell(16.2, 11, 1.1, 1.7)]},
  ];
};

const faceStamp = (h: MasHead, blink: boolean, smile: boolean, warm: boolean): Stamp[] => {
  if (h !== 'profile') return [];
  const lit = warm ? PAL.S5 : PAL.K2;
  const litHi = warm ? PAL.S6 : PAL.K3;
  // eye (1 dark + 1 lid), brow, nose tip catch, mouth — the "tiniest smile" is one pixel
  return [
    {x: 19, y: 8, rows: [
      '..bb..',
      '......',
      blink ? '..ll..' : '..le..',
      '......',
      '......',
      '......',
      smile ? '....mh' : '...mm.',
      smile ? '.....m' : '......',
    ], pal: {b: PAL.B1, e: PAL.N0, l: PAL.S3, m: PAL.S2, h: litHi}},
    // warm key on the face front (door light) or cool when the door is shut
    {x: 22, y: 8, rows: ['.l', 'll', '.lh', '..h', '.l', 'l'], pal: {l: lit, h: litHi}},
  ];
};

export const masFigure = (p: MasPose): FigureDef => {
  const parts = [...chair.slice(0, 0), ...body(p.breathe, p.type), ...headParts(p.head, p.hairBob), ...chair];
  return {
    w: MAS_W, h: MAS_H, parts,
    adjust: [
      // mesh texture on the chair back
      {prims: Array.from({length: 7}, (_, k) => P.line(11, 33 + k * 2, 25, 33 + k * 2)), add: -1, onlyMat: 'chair'},
      // hoodie seam down the back
      {prims: [P.line(18, 24, 18, 30)], add: -1, onlyMat: 'hood'},
    ],
    stamps: faceStamp(p.head, p.blink, p.smile, p.warm),
  };
};

export const masRig = (warm: boolean): LightRig => ({
  key: [-0.9, -0.45],
  keyBand: 2,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: warm ? [1, -0.15] : null,
  backBand: 1,
  backRamp: {hood: PAL.W3, hair: PAL.W2, skin: PAL.S4, ear: PAL.S3, chair: PAL.W1, hoodIn: PAL.W1},
  ramps: {
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K2, PAL.C5],
    skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.K2, PAL.K3],
    ear: [PAL.S0, PAL.S1, PAL.S2, PAL.S2, PAL.K1, PAL.K2],
    hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.C3, PAL.C6],
    hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
    chair: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C2, PAL.C4],
    metal: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.C3, PAL.C5],
  },
  groupBands: {head: {key: 2, shadow: 3}, ear: {key: 0, shadow: 1}, chair: {key: 1, shadow: 3}, base: {key: 1, shadow: 1}},
  keyGain: (_x, y) => (y < 30 ? 1 : Math.max(0.2, 1 - (y - 30) / 30)),
});

const cache = new Map<string, Img>();
export const masImg = (p: MasPose): Img => {
  const k = JSON.stringify(p);
  let v = cache.get(k);
  if (!v) { v = renderFigure(masFigure(p), masRig(p.warm)); cache.set(k, v); }
  return v;
};

// ---------------------------------------------------------------- standing Mas (model sheet / lineup)
const shiftP = (p: import('../core/figure').Prim, dx: number, dy: number): import('../core/figure').Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};
const seg = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return P.poly(x0 + nx * w0 / 2, y0 + ny * w0 / 2, x1 + nx * w1 / 2, y1 + ny * w1 / 2, x1 - nx * w1 / 2, y1 - ny * w1 / 2, x0 - nx * w0 / 2, y0 - ny * w0 / 2);
};
export const MAS_STAND_H = 78;
export const masStandImg = (blink = false): Img => {
  const hd = headParts('profile', 0).filter((p) => p.group !== 'neck').map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftP(pr, 0, 0))}));
  const parts: Part[] = [
    {group: 'legF', mat: 'jeans', prims: [seg(21, 46, 6, 22, 61, 5), seg(22, 61, 5, 23, 73, 4)]},
    {group: 'shoeF', mat: 'shoe', prims: [P.poly(20, 73, 25, 73, 29, 76, 29, 78, 20, 78)]},
    {group: 'legN', mat: 'jeans', prims: [seg(16, 46, 6, 16, 61, 5), seg(16, 61, 5, 16, 73, 4)]},
    {group: 'shoeN', mat: 'shoe', prims: [P.poly(13, 73, 18, 73, 23, 76, 23, 78, 13, 78)]},
    {group: 'armF', mat: 'hood', prims: [seg(27, 22, 6, 28, 33, 5)]},
    {group: 'torso', mat: 'hood', prims: [P.poly(11, 22, 15, 18.5, 26, 18.5, 29.5, 21, 30, 30, 28.5, 47, 13, 47, 11.5, 31)]},
    {group: 'hood', mat: 'hood', prims: [P.ell(15.5, 19.5, 5.5, 2.8)]},
    {group: 'neck', mat: 'skin', prims: [P.rect(17, 15, 5, 4)]},
    ...hd,
    {group: 'armN', mat: 'hood', prims: [seg(14, 22, 6, 13, 33, 5), seg(13, 33, 5, 19, 38, 4)]},
    {group: 'pocket', mat: 'hoodIn', prims: [P.rect(17, 36, 9, 4)]},
  ];
  const fig: FigureDef = {
    w: 40, h: 80, parts,
    adjust: [{prims: [P.line(20, 24, 21, 34), P.line(23, 24, 24, 33)], add: 2, onlyMat: 'hood'}],
    stamps: faceStamp('profile', blink, true, true),
  };
  const rig = masRig(true);
  rig.ramps.jeans = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.C2, PAL.C3];
  rig.ramps.shoe = [PAL.N0, PAL.N1, PAL.G3, PAL.G5, PAL.C4, PAL.C6];
  rig.keyGain = (_x, y) => (y < 30 ? 1 : Math.max(0.2, 1 - (y - 30) / 40));
  return renderFigure(fig, rig);
};
