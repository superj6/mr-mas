// MR. MAS · prototype 4 · 4a: THE PICK, a generic researcher drafted on Draft Night (nobody in particular: no real
// person's likeness). Room scale, ~80 px, built on the engine's figure rig (integer-grid parts, banded from their
// silhouettes, hand-pixelled head stamps). Stage light: a hard spot from above-front, the lit rack's cyan behind as a
// back rim. Drawings: 'back0' / 'back1' (walking up the stage steps, the jersey's citation count toward us),
// 'front' (turned, the novelty check up in both hands), 'frontLow' (the check coming up: one held step).
// The soup thermos hangs from a strap at the hip in every drawing (the telestrator's target).
import {Img, LightRig, P, Part, Prim, Stamp, renderFigure, FigureDef} from '../../../../shared/pixel/figure';
import {PAL} from '../../../../shared/pixel/palette';
import {seg, memo} from '../../../../shared/pixel/cast/kit';
import {newImg, imgPut} from '../../../../shared/pixel/rooms/kit-b';
import {tinyPlot} from '../../../../shared/pixel/rooms/kit-b';
import {osdPlot, osdWidth} from '../passes/osdfont';

export const PICK_W = 80, PICK_H = 86;
/** local foot point (between the soles) */
export const PICK_FOOT: [number, number] = [40, 84];
/** local centre of the thermos (for the telestrator), per drawing */
export const PICK_THERMOS: Record<PickPose, [number, number]> = {back0: [32, 60], back1: [32, 59], front: [49, 59], frontLow: [49, 59]};
/** the top of the thermos's cup lid (local), where the steam leaves it */
export const PICK_LID: Record<PickPose, [number, number]> = {back0: [32, 47], back1: [32, 46], front: [49, 47], frontLow: [49, 47]};
export type PickPose = 'back0' | 'back1' | 'front' | 'frontLow';

const CX = 40; // body centre line
const RAMPS: Record<string, number[]> = {
  // [outline, shadow, mid, light, bright, rim]
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.C3],
  jersey: [PAL.F0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5],
  trim: [PAL.G3, PAL.G4, PAL.G5, PAL.P1, PAL.P2, PAL.P2],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.C2],
  shoe: [PAL.N0, PAL.N1, PAL.G1, PAL.G3, PAL.G5, PAL.G6],
  strap: [PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4],
  flask: [PAL.N0, PAL.G1, PAL.G3, PAL.G5, PAL.G6, PAL.P2],
  cap: [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W6],
};
const rig: LightRig = {
  key: [-0.25, -1], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [0.2, 1], backBand: 1,
  backRamp: {skin: PAL.K2, hair: PAL.C3, jersey: PAL.C3, pants: PAL.C1, shoe: PAL.C2, trim: PAL.C5, flask: PAL.C5, strap: PAL.C1, cap: PAL.C3},
  ramps: RAMPS,
  groupBands: {torso: {key: 5, shadow: 3}, legN: {key: 2, shadow: 2}, legF: {key: 2, shadow: 2}, armL: {key: 2, shadow: 2}, armR: {key: 2, shadow: 2}, head: {key: 4, shadow: 2}, flask: {key: 2, shadow: 2}},
  keyGain: (_x, y) => (y < 50 ? 1 : Math.max(0.2, 1 - (y - 50) / 36)),
};

const legs = (walk: 0 | 1 | null): Part[] => {
  // stand: feet a little apart. walk (seen from behind, climbing): one knee up and the foot a step higher
  const L = walk === 0 ? {ky: 64, ay: 78, kx: -5, ax: -5} : walk === 1 ? {ky: 68, ay: 83, kx: -4, ax: -4} : {ky: 67, ay: 83, kx: -4, ax: -4};
  const R = walk === 0 ? {ky: 68, ay: 83, kx: 4, ax: 4} : walk === 1 ? {ky: 64, ay: 78, kx: 5, ax: 5} : {ky: 67, ay: 83, kx: 4, ax: 4};
  const leg = (g: string, s: {ky: number; ay: number; kx: number; ax: number}, hipx: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(CX + hipx, 50, 8, CX + s.kx, s.ky, 6.4), seg(CX + s.kx, s.ky, 6.4, CX + s.ax, s.ay - 1, 5.2)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(CX + s.ax - 4, s.ay - 2, CX + s.ax + 3, s.ay - 2, CX + s.ax + 4, s.ay + 1, CX + s.ax - 5, s.ay + 1)]},
  ];
  return [...leg('legF', L, -4), ...leg('legN', R, 4)];
};

const torso = (): Part[] => [
  // a jersey cut boxy: shoulders, short sleeves, straight body to the hips
  {group: 'torso', mat: 'jersey', prims: [P.poly(CX - 11, 22, CX + 11, 22, CX + 13, 25, CX + 12, 36, CX + 11, 51, CX - 11, 51, CX - 12, 36, CX - 13, 25)]},
  {group: 'torso', mat: 'trim', prims: [P.rect(CX - 11, 49, 22, 2)]},
];
const neck = (): Part[] => [{group: 'neck', mat: 'skin', prims: [P.poly(CX - 3, 16, CX + 3, 16, CX + 3.5, 23, CX - 3.5, 23)]}];
const headSil = (): Part[] => [{group: 'head', mat: 'skin', prims: [P.ell(CX, 10, 6.5, 8)]}];

/** arms: 'hang' (at the sides, walking), 'hold' (both forearms up, hands at the check's lower corners), 'mid' */
const arms = (a: 'hang' | 'hold' | 'mid', walk: 0 | 1 | null): Part[] => {
  const arm = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part[] => [
    {group: g, mat: 'skin', prims: [seg(sx, sy, 6.5, ex, ey, 5.2), seg(ex, ey, 5, hx, hy, 4.2), P.ell(hx, hy, 2.4, 2.6)]},
    {group: g, mat: 'jersey', prims: [P.ell(sx, sy + 1, 4.6, 4.2), seg(sx, sy, 8.6, sx + (ex - sx) * 0.38, sy + (ey - sy) * 0.38, 7.8)]},
  ];
  if (a === 'hang') {
    const sw = walk === null ? 0 : walk === 0 ? 1 : -1;
    return [...arm('armL', CX - 12, 25, CX - 14, 37, CX - 14 + sw, 48), ...arm('armR', CX + 12, 25, CX + 14, 37, CX + 14 - sw, 48)];
  }
  if (a === 'mid') return [...arm('armL', CX - 12, 25, CX - 16, 38, CX - 17, 44), ...arm('armR', CX + 12, 25, CX + 16, 38, CX + 17, 44)];
  return [...arm('armL', CX - 12, 25, CX - 17, 34, CX - 19, 38), ...arm('armR', CX + 12, 25, CX + 17, 34, CX + 19, 38)];
};

const strapFlask = (front: boolean): Part[] => {
  // the strap crosses from the far shoulder to the near hip; the thermos (steel, a red cup cap) hangs there
  const fx = front ? CX + 9 : CX - 8;
  return [
    {group: 'strap', mat: 'strap', prims: [front ? P.line(CX - 7, 22, fx, 53) : P.line(CX + 8, 22, fx, 53), front ? P.line(CX - 6, 22, fx + 1, 53) : P.line(CX + 7, 22, fx - 1, 53)]},
    {group: 'flask', mat: 'flask', prims: [P.rect(fx - 4, 54, 9, 15), P.ell(fx + 0.5, 69, 4.4, 1.4)]},
    {group: 'flask', mat: 'cap', prims: [P.rect(fx - 4, 49, 9, 5), P.rect(fx - 3, 48, 7, 1)]},
  ];
};

// hand-pixelled heads (13 x 17). Front: short dark hair, a part, thin glasses, a composed half-smile. Back: hair.
const HEAD_FRONT = [
  '...ooooooo...',
  '..oIIIJJJIo..',
  '.oIIHHJJJHIo.',
  '.oIHHHHHHHHo.',
  'oIHh55555hHIo',
  'oH5555555554o',
  'o4gggg5gggg4o',
  'o4gCc4o4Ccg3o',
  'o44gg444gg43o',
  'o5444n44n433o',
  '.o44444443o3.',
  '.o444mmm433o.',
  '..o4444433o..',
  '..oo44433oo..',
  '....o333o....',
];
const HEAD_BACK = [
  '...ooooooo...',
  '..oIIIJJJIo..',
  '.oIIHHJJJHIo.',
  '.oIHHHHHHHHo.',
  'oIHHHHHHHHHIo',
  'oHHHhhhhhHHHo',
  'oHHhhhhhhhhHo',
  'o5HhhhhhhhH5o',
  'o4HhhhhhhhH4o',
  'o44hhhhhhh44o',
  '.o4hhhhhhh4o.',
  '.o44hhhhh44o.',
  '..o4444433o..',
  '..oo44433oo..',
  '....o333o....',
];
const headStamp = (front: boolean, bob: number): Stamp => ({
  x: CX - 6, y: 2 + bob, rows: front ? HEAD_FRONT : HEAD_BACK,
  pal: {
    o: ['skin', 0], '3': ['skin', 2], '4': ['skin', 3], '5': ['skin', 4], n: ['skin', 2], m: ['skin', 1],
    h: ['hair', 2], H: ['hair', 3], I: ['hair', 4], J: ['hair', 5],
    g: PAL.N0, C: PAL.C7, c: PAL.C4,
  },
});

const fig = (pose: PickPose): FigureDef => {
  const back = pose === 'back0' || pose === 'back1';
  const walk: 0 | 1 | null = pose === 'back0' ? 0 : pose === 'back1' ? 1 : null;
  const bob = walk === 0 ? -1 : 0;
  const up = (ps: Part[]) => ps.map((pt) => ({...pt, prims: pt.prims.map((pr) => shift(pr, bob))}));
  const armPose = back ? 'hang' : pose === 'front' ? 'hold' : 'mid';
  const parts: Part[] = [
    ...legs(walk),
    ...up(torso()),
    ...up(neck()),
    ...up(headSil()),
    ...(back ? up(strapFlask(false)) : []),
    ...up(arms(armPose, walk)),
    ...(back ? [] : up(strapFlask(true))),
  ];
  const stamps: Stamp[] = [headStamp(!back, bob)];
  if (back) stamps.push(jerseyBack(bob));
  else stamps.push(jerseyFront(bob));
  return {w: PICK_W, h: PICK_H, parts, stamps, adjust: [
    {prims: [P.rect(CX - 11, 22 + bob, 22, 2)], tone: 4, onlyMat: 'jersey'}, // the yoke catches the spot
    {prims: [P.rect(CX - 13, 36 + bob, 3, 14), P.rect(CX + 10, 36 + bob, 3, 14)], add: -1, onlyMat: 'jersey'},
    {prims: [P.rect(0, 72, PICK_W, 14)], add: -1, onlyMat: 'pants'},
  ]};
};
const shift = (pr: Prim, dy: number): Prim => {
  if (!dy) return pr;
  switch (pr.k) {
    case 'poly': return {...pr, pts: pr.pts.map((v, i) => (i % 2 ? v + dy : v))};
    case 'ell': return {...pr, cy: pr.cy + dy};
    case 'rect': return {...pr, y: pr.y + dy};
    case 'line': return {...pr, y0: pr.y0 + dy, y1: pr.y1 + dy};
    case 'map': return {...pr, y: pr.y + dy};
  }
};

/** the jersey's back: the label CITES across the yoke and the count in the heavy OSD numerals (a jersey number) */
const jerseyBack = (bob: number): Stamp => {
  const rows: string[] = [];
  const W = 24, H = 20;
  const grid = Array.from({length: H}, () => Array(W).fill('.'));
  tinyPlot('CITES', Math.round((W - 19) / 2), 0, (x, y) => { if (grid[y]?.[x] !== undefined) grid[y][x] = 't'; });
  const num = '48K';
  osdPlot(num, Math.round((W - osdWidth(num)) / 2), 8, (x, y) => { if (grid[y]?.[x] !== undefined) grid[y][x] = 'N'; });
  // a 1 px shadow under the numerals (sewn twill has a keyline)
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) if (grid[y][x] === 'N' && grid[y + 1]?.[x + 1] === '.') grid[y + 1][x + 1] = 's';
  for (const r of grid) rows.push(r.join(''));
  return {x: CX - 12, y: 25 + bob, rows, pal: {t: PAL.P1, N: PAL.P2, s: PAL.F0}};
};
/** the jersey's front: a small team mark and the count again, small (mostly under the check anyway) */
const jerseyFront = (bob: number): Stamp => {
  const W = 22, H = 8;
  const grid = Array.from({length: H}, () => Array(W).fill('.'));
  tinyPlot('ATEM', 3, 1, (x, y) => { if (grid[y]?.[x] !== undefined) grid[y][x] = 't'; });
  return {x: CX - 11, y: 25 + bob, rows: grid.map((r) => r.join('')), pal: {t: PAL.P2}};
};

export const pickImg = memo((pose: PickPose): Img => renderFigure(fig(pose), rig));

// ------------------------------------------------------------------ the novelty check ($100M*, *per Manalt)
// A bank-style novelty check: the payer's mark top left and the date line top right, the amount in the heavy OSD
// caps with an asterisk, a rule, and the footnote the asterisk points to: *PER MANALT (the figure is his claim; the
// same asterisk grammar as NOLE's $1,000,000,000* check)
export const CHECK_W = 76, CHECK_H = 30;
export const bigCheck = memo((_k: number): Img => {
  const img = newImg(CHECK_W, CHECK_H);
  const W = CHECK_W, H = CHECK_H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const edge = x === 0 || y === 0 || x === W - 1 || y === H - 1;
    const border = (x === 2 || x === W - 3) && y >= 2 && y <= H - 3 || (y === 2 || y === H - 3) && x >= 2 && x <= W - 3;
    imgPut(img, x, y, edge ? PAL.N0 : border ? PAL.F4 : y > H - 8 ? PAL.P1 : PAL.P2);
  }
  tinyPlot('ATEM', 6, 5, (x, y) => imgPut(img, x, y, PAL.F3));
  for (let x = W - 22; x < W - 6; x++) imgPut(img, x, 9, PAL.P0);
  const amt = '$100M*';
  osdPlot(amt, Math.round((W - osdWidth(amt)) / 2), 11, (x, y) => imgPut(img, x, y, PAL.N2));
  for (let x = 6; x < W - 6; x++) imgPut(img, x, 20, PAL.P0);
  const per = '*PER MANALT';
  let pw = 0; tinyPlot(per, 0, 0, (x) => { pw = Math.max(pw, x + 1); });
  tinyPlot(per, Math.round((W - pw) / 2), 22, (x, y) => imgPut(img, x, y, PAL.F3));
  return img;
});
/** the check's back, seen past the pick's shoulders on the walk up (plain board, both ends showing) */
export const checkEdgeRows = (img: Img, x: number, y: number) => {
  for (let j = 0; j < 20; j++) for (let i = 0; i < 6; i++) {
    const c = i === 0 || j === 0 || j === 19 ? PAL.N0 : j > 14 ? PAL.P0 : PAL.P1;
    imgPut(img, x + i, y + j, c);
  }
};
