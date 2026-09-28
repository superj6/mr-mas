// MR. MAS — cast: MAS MANALT, present day, SEATED in a chair (room sprite). New file (v3-art-a, 2026-09-27); nothing in
// cast/mas.ts or cast/mas-stand.ts is edited. First use: Ep1 cold open (the APEC stage's armchair); built generic so any
// seated scene can use it (a panel chair, a witness chair, a lobby sofa): the chair is drawn by the scene, and this
// sprite only knows where the seat is.
// Same design as the standing sprite (mas-stand.ts): the grey hoodie, the forward cowlick, calm level eyes, the tiny
// closed smile; the same 16 x 17 head drawing. 3/4 facing screen-RIGHT (toward whoever he is answering); flip for left.
// Legs crossed at the knee (poised, never slumped), so the silhouette reads as "a man at ease on a stage".
//   masSeated / drawMasSeated(b, seatX, seatY, pose)   the seat anchor (MAS_SEAT) is the top of the seat cushion under his
//                                                      hips: put it on the chair's seat line
//   arms:  lap (both hands resting on his thigh) · sip (the near hand brings a water glass to his mouth) ·
//          hold (the glass held at the chest, between sips) · reach (the near hand down and forward, to a side table:
//          the phone's Accept below the MCU's frame) · phone (the near hand holding his phone up, reading)
//   head:  host (level, to the right) · down (lids lowered and the face a pixel lower: reading the table / his phone)
//   collars 0..3: the popped polo collars at the hoodie's neck (the collar stack, gags G05): design only, never text
//   light: stage (a warm key from the front-left, a cool rim from the window behind) · room (mas-stand's) ·
//          monitor (cyan key) · sil (a doorway silhouette)
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';

export const MAS_SEATED_W = 48;
export const MAS_SEATED_H = 66;
/** local anchor: the seat line under his hips (x = the hip's centre) */
export const MAS_SEAT: [number, number] = [17, 44];
export type MasSeatedArm = 'lap' | 'sip' | 'hold' | 'reach' | 'phone';
export type MasSeatedHead = 'host' | 'down';
export type MasSeatedLight = 'stage' | 'room' | 'monitor' | 'sil';
export interface MasSeatedPose {
  arm: MasSeatedArm;
  head: MasSeatedHead;
  mouth: 'rest' | 'open' | 'smile';
  blink: boolean;
  collars: 0 | 1 | 2 | 3;
  light: MasSeatedLight;
  /** v3.1 (opt-in): the third collar in gold (cast/mas-collars.ts 'v31'), so the stack matches the v3.1 MCUs */
  collarStyle?: 'v31';
}
export const MAS_SEATED_DEFAULT: MasSeatedPose = {arm: 'lap', head: 'host', mouth: 'rest', blink: false, collars: 3, light: 'stage'};

// the standing sprite's head (mas-stand.ts HEAD), unchanged: 3/4 to screen-right, the cowlick forward
const HEAD = [
  '.........JI.....',
  '.....hHHIJI.....',
  '...hHHHIIIHh....',
  '..hHHIIIHHHHh...',
  '.hHHIIHHHHHh4o..',
  '.hHHHHHhh23444o.',
  'hHHHHhh22bb4b4o.',
  'hHHHh2233e44eo..',
  'hHHh22334444444.',
  '.hHh2233444444o5',
  '.hh122334444444o',
  '..h12233444444o.',
  '..o122mmmm444o..',
  '...o1223344o....',
  '....o112233o....',
  '.....oo1122o....',
  '.......o12o.....',
];
// the collar stack at the neck, drawn after the torso, before the head's chin overlaps it (local coords, head at x 11).
// Inside out: coral (1), green (2), cream (3). Each new one surfaces OUTSIDE the last, so the newest reads first.
const COLLAR_ROWS: Record<1 | 2 | 3, string[]> = {
  1: ['......r...r.', '......rR.Rr.'],
  2: ['.....gr...rg', '.....grR.Rrg', '......GG.GG.'],
  3: ['....cgr...rgc', '....cgrR.Rrgc', '....CcGG.GGcC'],
};

const fig = (p: MasSeatedPose): FigureDef => {
  const down = p.head === 'down' ? 1 : 0;
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'hood', prims: [P.ell(sx, sy, 3.8, 4), seg(sx, sy, 7, ex, ey, 6.2), seg(ex, ey, 6, hx, hy, 5.2), P.ell(ex, ey, 3, 3)]});
  // legs: the far leg's thigh runs forward (screen-right) to the knee, the shin drops to the floor; the near leg crosses
  // over it at the knee, its shin angled down and forward, the foot off the floor
  const parts: Part[] = [
    {group: 'legF', mat: 'jeans', prims: [seg(15, 44, 8, 30, 47, 6.4), seg(30, 47, 6, 31, 61, 4.8), P.ell(30, 47, 3.2, 3)]},
    {group: 'legFs', mat: 'shoe', prims: [P.poly(28.4, 60, 33.4, 60, 37.4, 62.6, 37.4, 65, 28, 65)]},
    // far arm (behind the torso): rests along his thigh
    sl('armF', 14, 22, 13, 33, 21, 40),
    // the hoodie, seated: the hem bunches at the hips
    {group: 'torso', mat: 'hood', prims: [P.poly(12, 19, 18, 17, 24, 18, 27, 22, 28, 30, 27, 38, 28, 45, 10, 46, 9, 38, 9, 30, 9, 23)]},
    {group: 'hoodlump', mat: 'hood', prims: [P.poly(8, 16, 14, 14, 17, 18, 11, 21)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(17, 14 + down, 22, 14 + down, 22, 18, 17, 18)]},
    {group: 'legN', mat: 'jeans', prims: [seg(20, 43, 8.4, 33, 43, 6.8), seg(33, 43, 6.4, 39, 55, 5), P.ell(33, 43, 3.4, 3.2)]},
    {group: 'legNs', mat: 'shoe', prims: [P.poly(37, 54, 41.4, 53, 45.6, 55, 46, 58, 40, 59, 37.6, 58)]},
  ];
  // the near arm, per pose
  const NEAR: Record<MasSeatedArm, [number, number, number, number]> = {
    lap: [27, 32, 30, 39],
    sip: [30, 29, 23, 13],
    hold: [30, 30, 29, 25],
    reach: [30, 30, 38, 36],
    phone: [30, 30, 30, 22],
  };
  const n = NEAR[p.arm];
  parts.push(sl('armN', 24, 22, n[0], n[1], n[2], n[3]));
  const rows = HEAD.slice();
  if (p.blink || p.head === 'down') rows[7] = 'hHHHh2233b44bo..';
  if (p.mouth === 'open') { rows[12] = '..o122mMMm444o..'; rows[13] = '...o122MM44o....'; }
  if (p.mouth === 'smile') rows[12] = '..o122mmmm4m4o..';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [];
  if (p.collars) stamps.push({x: 11 + 1, y: 15 + down, rows: COLLAR_ROWS[p.collars], pal: {r: ['coral', 2], R: ['coral', 4], g: ['polo', 2], G: ['polo', 3], c: [p.collarStyle === 'v31' ? 'gold' : 'cream', 3], C: [p.collarStyle === 'v31' ? 'gold' : 'cream', 2]}});
  stamps.push({x: 11, y: down, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], b: ['hair', 1], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
  }});
  // drawstrings (hidden when the glass or the phone is up in front of them)
  if (p.arm === 'lap' || p.arm === 'reach') stamps.push({x: 18, y: 19, rows: ['d.d', 'd.d', 'd.d', '..d'], pal: {d: ['hood', 5]}});
  stamps.push(hand(21, 40));
  if (p.arm === 'sip' || p.arm === 'hold') {
    // the water glass in the near hand: clear, the one flat water line (it never ripples)
    const [gx, gy] = p.arm === 'sip' ? [24, 9] : [30, 21];
    stamps.push({x: gx, y: gy, rows: ['wWWw', 'w..w', 'wLLw', 'wllw', 'wllw', '.ww.'], pal: {w: ['glass', 3], W: ['glass', 5], L: ['water', 5], l: ['water', 3]}});
    stamps.push(hand(p.arm === 'sip' ? 25 : 30, p.arm === 'sip' ? 14 : 26));
  } else if (p.arm === 'phone') {
    stamps.push({x: 28, y: 16, rows: ['ooo', 'oCo', 'oco', 'oco', 'ooo'], pal: {o: ['dark', 0], C: ['screen', 5], c: ['screen', 4]}});
    stamps.push(hand(30, 21));
  } else stamps.push(hand(n[2], n[3]));
  return {w: MAS_SEATED_W, h: MAS_SEATED_H, parts, adjust: [{prims: [P.rect(0, 52, MAS_SEATED_W, 14)], add: -1, onlyMat: 'jeans'}], stamps};
};

const SLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  jeans: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
  shoe: [PAL.N1, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.P2],
  coral: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W6, PAL.W8],
  polo: [PAL.L0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3],
  cream: [PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.P2],
  gold: [PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7, PAL.W7],
  glass: [PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2],
  water: [PAL.C3, PAL.C4, PAL.C5, PAL.C6, PAL.C7, PAL.C8],
  screen: [PAL.N0, PAL.C3, PAL.C5, PAL.C6, PAL.C7, PAL.C8],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const SMON: Record<string, number[]> = {...SLIT, skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4], hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.C3, PAL.C6], hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5]};
const SSIL: Record<string, number[]> = Object.fromEntries(Object.keys(SLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const rig = (light: MasSeatedLight): LightRig => ({
  key: light === 'monitor' ? [0.9, -0.35] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: light === 'monitor' ? [-1, -0.1] : [-1, -0.2], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, hood: PAL.C6, jeans: PAL.C5, shoe: PAL.C4}
    : light === 'stage' ? {skin: PAL.W7, hair: PAL.W5, hood: PAL.G5, jeans: PAL.N6, shoe: PAL.G5}
      : {skin: PAL.K1, hair: PAL.C2, hood: PAL.C2, jeans: PAL.N4, shoe: PAL.G3},
  ramps: light === 'monitor' ? SMON : light === 'sil' ? SSIL : SLIT,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  noEdge: ['coral', 'polo', 'cream', 'gold', 'glass', 'water', 'screen'],
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 44 ? 1 : Math.max(0.3, 1 - (y - 44) / 30)),
});
export const masSeated = memo((p: MasSeatedPose) => renderFigure(fig(p), rig(p.light)));
/** Draw him with his seat anchor (MAS_SEAT) at (seatX, seatY). */
export const drawMasSeated = (b: Buf, seatX: number, seatY: number, p: MasSeatedPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array; clip?: (x: number, y: number) => boolean} = {}) => {
  const ax = o.flip ? MAS_SEATED_W - 1 - MAS_SEAT[0] : MAS_SEAT[0];
  blitImg(b, masSeated(p), seatX - ax, seatY - MAS_SEAT[1], {flip: o.flip, map: o.map, mask: o.mask, clip: o.clip});
};
/** where his glass is (local, unflipped) in 'sip' / 'hold': the scene's table glass is hidden while he holds it */
export const MAS_SEATED_GLASS: Record<'sip' | 'hold', [number, number]> = {sip: [24, 9], hold: [30, 21]};
/** his face's centre (local): for the Orb's look and the phone's light on his jaw */
export const MAS_SEATED_FACE: [number, number] = [22, 8];
