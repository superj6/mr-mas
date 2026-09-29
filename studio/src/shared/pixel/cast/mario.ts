// MR. MAS — cast (castrivals): MARIO. Curly dark hair, glasses, ink-blue fleece quarter-zip (never red,
// nothing Nintendo), anxious-earnest, finger raised. Room sprite faces screen-right (3/4): body on the
// pixeladv figure rig, head hand-pixelled as a tone map. Light: warm candle key from the front (right),
// cool vault light as a back-rim (left) — the mirror of Nole's cyan-key / tungsten-rim.
// Also here: his conversation portrait, the round vault blast door, the scroll that unrolls, the DRAFT sheet.
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {CX, micro, seg, shiftPrim} from './bosses';

export const MARIO_W = 56;
export const MARIO_H = 84;
const X = 10;
/** local feet centre / sole line */
export const MARIO_FOOT: [number, number] = [X + 23, 80];

export type MarioLegs = 'stand' | 'step0' | 'step1';
export type MarioArm = 'down' | 'chest' | 'raise' | 'raise2' | 'scroll';
export type MarioLight = 'lit' | 'sil' | 'fade';
export interface MarioPose {
  legs: MarioLegs;
  /** front (screen-right) arm */
  arm: MarioArm;
  /** back arm holds the scroll roll */
  scroll: boolean;
  mouth: 0 | 1 | 2;
  brow: 0 | 1;
  blink: boolean;
  light: MarioLight;
}
export const MARIO_BASE: MarioPose = {legs: 'stand', arm: 'down', scroll: false, mouth: 0, brow: 0, blink: false, light: 'lit'};

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const LEGS: Record<MarioLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: {hip: 26, kx: 26.2, ky: 60, ax: 26.4, ay: 74}, f: {hip: 19, kx: 19, ky: 60, ax: 18.8, ay: 74}, bob: 0},
  // stepping out over the vault sill: front leg reaching, back leg pushing off
  step0: {n: {hip: 26, kx: 30.4, ky: 59, ax: 33.4, ay: 73}, f: {hip: 19, kx: 16.6, ky: 60, ax: 13.4, ay: 72}, bob: 1},
  step1: {n: {hip: 26, kx: 27, ky: 60, ax: 27.4, ay: 74}, f: {hip: 19, kx: 21.8, ky: 57, ax: 19.6, ay: 68}, bob: 0},
};
const legParts = (l: Leg, near: boolean): Part[] => {
  const g = near ? 'legN' : 'legF';
  const hx = l.hip + X, kx = l.kx + X, ax = l.ax + X;
  // shoes point screen-right
  const foot = P.poly(ax - 2.6, l.ay, ax + 3, l.ay, ax + 7.4, l.ay + 3.4, ax + 7.4, l.ay + 6, ax - 3.2, l.ay + 6);
  return [
    {group: g, mat: 'pants', prims: [seg(hx, 46, 8, kx, l.ky, 6.4), seg(kx, l.ky, 6.2, ax, l.ay + 1, 5), P.ell(kx, l.ky, 3.1, 2.8)]},
    {group: g + 's', mat: 'shoe', prims: [foot]},
  ];
};

const SH_F: [number, number] = [30.6, 25.6];
const SH_B: [number, number] = [16.4, 25.6];
const arm = (group: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part[] => [
  // fleece sleeve to the wrist (a soft, slightly bulky tube), then the hand
  {group, mat: 'fleece', prims: [P.ell(sx + X, sy, 4, 4.2), seg(sx + X, sy, 7.4, ex + X, ey, 6.6), seg(ex + X, ey, 6.4, hx + X, hy, 5.6), P.ell(ex + X, ey, 3.2, 3.2)]},
];
const HANDS: Record<MarioArm, {parts: Part[]; hand: [number, number] | null; finger: boolean}> = {
  down: {parts: arm('armN', ...SH_F, 31.4, 35.4, 31.2, 42.6), hand: [31.4, 44.6], finger: false},
  chest: {parts: arm('armN', ...SH_F, 32.4, 36.6, 34.4, 31.8), hand: [34.8, 30.4], finger: false},
  raise: {parts: arm('armN', ...SH_F, 32.6, 36.4, 35.6, 28.4), hand: [35.8, 26.6], finger: true},
  raise2: {parts: arm('armN', ...SH_F, 32.4, 35.8, 35.4, 27), hand: [35.6, 25], finger: true},
  scroll: {parts: arm('armN', ...SH_F, 32, 35.6, 34.6, 40.8), hand: [35, 42.4], finger: false},
};

const torsoParts = (): Part[] => [
  // soft fleece block: rounded shoulders, a slight forward hunch, bunched hem
  {group: 'torso', mat: 'fleece', prims: [P.poly(
    19.4 + X, 20.4, 26.8 + X, 20, 30.8 + X, 22.6, 33.2 + X, 27.4, 33.4 + X, 34, 32.6 + X, 41, 33 + X, 46.6,
    15.4 + X, 46.6, 15.4 + X, 40, 14.4 + X, 33, 14.4 + X, 27.4, 16.2 + X, 23)]},
  // zip collar standing up around the neck
  {group: 'collar', mat: 'collar', prims: [P.poly(20.6 + X, 17.6, 27.8 + X, 17.2, 29.4 + X, 21.8, 27 + X, 23.4, 21.4 + X, 23.4, 19.6 + X, 21.4)]},
];

// Hand-pixelled head, 3/4 facing screen-right. Digits = skin, h..J = hair (dark curls, warm catches),
// c = cool vault back-rim, g = glasses frame, L = lens glint, b = brow, e = eye, m = mouth.
// 16 x 19, top-left at (15+X, 0).
const HEAD_ROWS = [
  '...o.oo.oo.o....',
  '..oJoIJoJIoIo...',
  '.oIJHIJHIJHIJo..',
  'ocIHhIHhIHhIHJo.',
  'cIHhIHhIHhIHhIJo',
  'cHhIHhHIhHIhHhJo',
  'cIHhHhIHhHh34hIo',
  'cHhIhHhIh233445o',
  '.cIHhHh1223b4b4o',
  '.cHhHo12ggggg44o',
  '.cHhogg12g4eLg4.',
  '..cHo21o1g4444g5',
  '..cHh1o222233345',
  '...co22233444455',
  '....o12233mm44o.',
  '....o122333344o.',
  '.....o1223344o..',
  '......o11122o...',
  '......o22221o...',
];
const headStamp = (p: MarioPose, bob: number): Stamp => {
  const rows = HEAD_ROWS.slice();
  // worried brows: the inner end lifts (brow 1 = alarmed: both lift, a line appears)
  if (p.brow) { rows[7] = 'cHhIhHhIh23b4b45o'.slice(0, 16); rows[8] = '.cIHhHh12233444o'; }
  if (p.blink) rows[10] = '.cHhogg12g3bbg4.';
  rows[14] = p.mouth === 0 ? '....o12233mm44o.' : p.mouth === 1 ? '....o1223mMm44o.' : '....o12233MM4o..';
  if (p.mouth === 2) rows[15] = '....o122333MM4o.';
  return {x: 15 + X, y: bob, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], c: ['rimC', 0],
    g: ['hair', 0], L: ['glint', 0], b: ['hair', 1], e: ['hair', 0], m: ['skin', 1], M: ['hair', 0],
  }};
};

const fingerStamp = (hand: [number, number] | null, finger: boolean, bob: number): Stamp[] => {
  if (!hand) return [];
  const x = Math.round(hand[0] + X) - 2, y = Math.round(hand[1]) + bob - (finger ? 5 : 1);
  // index finger up, the rest curled; knuckles catch the candle light
  return [{x, y, rows: finger
    ? ['.o..', 'o4o.', 'o4o.', 'o4o.', 'o45o.', 'o3445o', 'o2344o', '.o223o', '..ooo.']
    : ['.oo.', 'o34o', 'o345', 'o234', '.o2o'], pal: {o: ['skin', 0], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}}];
};

export const marioFigure = (p: MarioPose): FigureDef => {
  const Lg = LEGS[p.legs];
  const bob = Lg.bob;
  const up = (parts: Part[]) => parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, bob))}));
  const H = HANDS[p.arm];
  const backArm = p.scroll ? arm('armF', ...SH_B, 14.6, 35.6, 16.6, 42) : arm('armF', ...SH_B, 15.2, 35.6, 15.8, 43);
  const parts: Part[] = [
    ...legParts(Lg.f, false),
    ...up(backArm),
    ...legParts(Lg.n, true),
    ...up(torsoParts()),
    ...up([{group: 'neck', mat: 'skin', prims: [P.poly(22 + X, 14, 27 + X, 14, 27 + X, 19, 22 + X, 19)]}]),
    ...up(H.parts),
  ];
  const S = (pr: Prim) => shiftPrim(pr, 0, bob);
  const backHand: Stamp = {x: X + (p.scroll ? 14 : 14), y: (p.scroll ? 42 : 43) + bob, rows: ['.oo.', 'o23o', 'o22o', '.oo.'], pal: {o: ['skin', 0], '2': ['skin', 2], '3': ['skin', 3]}};
  return {
    w: MARIO_W, h: MARIO_H, parts,
    adjust: [
      // the zip: a light line from the collar to mid-chest, pull tab at the top
      {prims: [S(P.line(26 + X, 20, 26 + X, 31))], tone: 4, onlyMat: 'fleece'},
      {prims: [S(P.line(26 + X, 18, 26 + X, 22))], tone: 5, onlyMat: 'collar'},
      // fleece texture: soft folds at the elbow crook and the bunched hem
      {prims: [S(P.line(17 + X, 44, 31 + X, 44)), S(P.line(19 + X, 35, 24 + X, 37))], add: -1, onlyMat: 'fleece'},
      {prims: [S(P.poly(27 + X, 22, 32 + X, 24, 33 + X, 30, 28 + X, 28))], add: 1, onlyMat: 'fleece'},
      {prims: [P.rect(0, 64, MARIO_W, 20)], add: -1, onlyMat: 'pants'},
    ],
    stamps: [
      headStamp(p, bob),
      {x: 26 + X, y: 18 + bob, rows: ['y', 'y'], pal: {y: ['zip', 0]}},
      backHand,
      ...fingerStamp(H.hand, H.finger, bob),
    ],
  };
};

const LIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.W4],
  fleece: [CX.F0, CX.F1, CX.F2, CX.F3, CX.F4, CX.F5],
  collar: [CX.F0, CX.F2, CX.F3, CX.F4, CX.F5, CX.F6],
  pants: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  shoe: [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  rimC: [PAL.C6, PAL.C6, PAL.C6, PAL.C6, PAL.C6, PAL.C6],
  glint: [PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8],
  zip: [PAL.G6, PAL.G6, PAL.G6, PAL.G6, PAL.G6, PAL.G6],
};
const dimR = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const FADE = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, dimR(r, 2)]));
const SILR: Record<string, number[]> = Object.fromEntries(Object.keys(LIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
SILR.rimC = [PAL.C8, PAL.C8, PAL.C8, PAL.C8, PAL.C8, PAL.C8];
SILR.glint = [PAL.C9, PAL.C9, PAL.C9, PAL.C9, PAL.C9, PAL.C9];

export const marioRig = (light: MarioLight): LightRig => ({
  key: [0.96, -0.28],
  keyBand: 3,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: [-1, -0.12],
  backBand: 1,
  backRamp: light === 'sil'
    ? {skin: PAL.C8, hair: PAL.C7, fleece: PAL.C7, collar: PAL.C8, pants: PAL.C6, shoe: PAL.C5}
    : {skin: PAL.K3, hair: PAL.C4, fleece: PAL.C4, collar: PAL.C5, pants: PAL.C3, shoe: PAL.C2},
  ramps: light === 'lit' ? LIT : light === 'fade' ? FADE : SILR,
  groupBands: {torso: {key: 5, shadow: 3}, armN: {key: 3, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}, collar: {key: 2, shadow: 1}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});

const cache = new Map<string, Img>();
export const marioImg = (p: MarioPose): Img => {
  const k = JSON.stringify(p);
  let v = cache.get(k);
  if (!v) { v = renderFigure(marioFigure(p), marioRig(p.light)); cache.set(k, v); }
  return v;
};

/** where the back hand holds the scroll (local coords) */
export const MARIO_SCROLL_HAND: [number, number] = [X + 15, 45];

// ================================================================== the vault (MISANTHROPIC's "TOO DANGEROUS" door)
export interface VaultState {
  /** door drawings: 0 closed, 1 ajar, 2 open, 3 wide */
  open: 0 | 1 | 2 | 3;
  /** video frame (beacons, steam) */
  f: number;
  /** RED-TEAMED ticks shown (0..3) */
  ticks: number;
}
const inRing = (x: number, y: number, cx: number, cy: number, r: number) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r;
export const VAULT_R = 30; // opening radius
const RO = 37; // frame outer radius

/** Draw the vault frame + interior + door + beacons + HUD centred on (cx, cy). */
export const drawVault = (b: Buf, cx: number, cy: number, v: VaultState) => {
  const {open, f} = v;
  const G = [PAL.N0, PAL.N2, PAL.N4, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6];
  // ---- frame ring: steel, lit warm from the table (bottom-right), cool spill from the opening
  for (let y = cy - RO - 1; y <= cy + RO + 1; y++)
    for (let x = cx - RO - 1; x <= cx + RO + 1; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
      if (d > RO + 0.5 || d < VAULT_R - 0.5) continue;
      if (d > RO - 0.5) { b.set(x, y, PAL.N0); continue; }
      if (d < VAULT_R + 0.6) { b.set(x, y, open ? PAL.C4 : PAL.N0); continue; }
      const ang = Math.atan2(dy, dx);
      // bevel: inner lip bright toward the light, outer lip dark
      const lip = d < VAULT_R + 2.2 ? 1 : d > RO - 2 ? -1 : 0;
      const warm = Math.max(0, Math.cos(ang - 0.7)); // table candles low-right
      let t = 3 + Math.round(warm * 2 + (bayer(x, y) - 0.5) * 0.9) + lip;
      if (open && d < VAULT_R + 3.5 && Math.cos(ang + 2.3) > 0.2) t += 1; // cool spill on the inner lip
      b.set(x, y, t >= 6 && warm > 0.6 ? PAL.W5 : G[Math.max(1, Math.min(7, t))]);
    }
  // bolts around the ring
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const bx = Math.round(cx + Math.cos(a) * (RO - 3.5)), by = Math.round(cy + Math.sin(a) * (RO - 3.5));
    b.set(bx, by, Math.cos(a - 0.7) > 0.3 ? PAL.W6 : PAL.G6); b.set(bx + 1, by + 1, PAL.N0);
  }
  // ---- interior: clinical white-cyan light, a back wall of lockers, the floor
  if (open) {
    for (let y = cy - VAULT_R; y <= cy + VAULT_R; y++)
      for (let x = cx - VAULT_R; x <= cx + VAULT_R; x++) {
        if (!inRing(x, y, cx, cy, VAULT_R - 0.4)) continue;
        const dx = (x + 0.5 - cx) / VAULT_R, dy = (y + 0.5 - cy) / VAULT_R;
        const d = Math.hypot(dx * 0.9, dy * 1.1) + (bayer(x, y) - 0.5) * 0.12;
        let c: number = d < 0.35 ? PAL.C9 : d < 0.62 ? PAL.C8 : d < 0.86 ? PAL.C7 : PAL.C5;
        const floor = cy + Math.round(VAULT_R * 0.48);
        if (y > floor) c = d < 0.5 ? PAL.C7 : d < 0.8 ? PAL.C6 : PAL.C4; // floor catches less
        if (y === floor) c = PAL.C5;
        // lockers on the back wall
        const lx = x - (cx - 14);
        if (y > cy - 12 && y < floor && lx >= 0 && lx < 28 && (lx % 7 === 0)) c = d < 0.62 ? PAL.C7 : PAL.C6;
        if (y === cy - 12 && lx >= 0 && lx < 28) c = PAL.C6;
        b.set(x, y, c);
      }
    // a tiny sign inside: DO NOT OPEN
    micro(b, 'DO NOT', cx - 11, cy - 20, PAL.C5);
    micro(b, 'OPEN', cx - 7, cy - 14, PAL.C5);
    // steam rolling out along the sill (3 drawings, held 4)
    const st = Math.floor(f / 4) % 3;
    const sy = cy + VAULT_R - 6;
    const puffs = [[-18, 0, 3], [-8, -1, 4], [4, 0, 3], [14, -1, 4], [22, 1, 3]];
    puffs.forEach(([ox, oy, r], i) => {
      const k = (st + i) % 3;
      const rr = r + (k === 1 ? 1 : 0);
      for (let y = -rr; y <= rr; y++) for (let x = -rr - 1; x <= rr + 1; x++) {
        if ((x / (rr + 1)) ** 2 + (y / rr) ** 2 > 1) continue;
        const px = cx + ox + x + (k === 2 ? 1 : 0), py = sy + oy + y - (k === 2 ? 1 : 0);
        const edge = (x / (rr + 1)) ** 2 + (y / rr) ** 2 > 0.55;
        if (edge && bayer(px, py) > 0.5) continue;
        b.set(px, py, y < -rr / 2 ? PAL.C9 : edge ? PAL.C7 : PAL.C8);
      }
    });
  }
  // ---- the door slab (hinged on the left, swinging toward camera): four held drawings
  const TH = 6;
  const ang = [0, 0.95, 1.3, 1.46][open];
  const rx = VAULT_R * Math.cos(ang) + 1, ry = VAULT_R + 1;
  const hx = cx - VAULT_R;
  const fcx = open ? hx + rx - 1 : cx, edge = open ? Math.round(TH * Math.sin(ang) + 2) : 0;
  // thickness (the drum of the door) shows on the side facing the opening
  if (open)
    for (let y = cy - ry; y <= cy + ry; y++)
      for (let x = Math.floor(fcx - rx); x <= fcx + rx + edge; x++) {
        const inFace = ((x + 0.5 - fcx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1;
        const inBack = ((x + 0.5 - fcx - edge) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1;
        if (inBack && !inFace) b.set(x, y, (y - cy) / ry < -0.6 ? PAL.G4 : x % 3 === 0 ? PAL.G2 : PAL.G3);
      }
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = Math.floor(fcx - rx - 1); x <= fcx + rx + 1; x++) {
      const ux = (x + 0.5 - fcx) / rx, uy = (y + 0.5 - cy) / ry;
      const q = ux * ux + uy * uy;
      if (q > 1) continue;
      if (q > 0.86) { b.set(x, y, PAL.N0); continue; }
      // face: machined concentric rings, lit from the right when closed, from the opening (cool) when open
      const rr = Math.sqrt(q);
      const band = Math.floor(rr * 7) % 2;
      const lit = open ? 0.35 - ux * 0.25 : 0.45 + ux * 0.35 - uy * 0.15;
      let t = Math.round(3 + lit * 3 + (bayer(x, y) - 0.5) * 0.8) - band;
      t = Math.max(1, Math.min(6, t));
      b.set(x, y, G[t]);
      if (Math.abs(rr - 0.62) < 0.05) b.set(x, y, PAL.N1);
    }
  // wheel handle: four spokes + rim, foreshortened with the face
  const wr = 9, sx = rx / (VAULT_R + 1);
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * Math.PI * 2;
    b.set(Math.round(fcx + Math.cos(a) * wr * sx), Math.round(cy + Math.sin(a) * wr), Math.sin(a) < -0.2 ? PAL.G6 : PAL.G5);
    b.set(Math.round(fcx + Math.cos(a) * wr * sx), Math.round(cy + Math.sin(a) * wr) + 1, PAL.N0);
  }
  for (const a of [0.3, 0.3 + Math.PI / 2, 0.3 + Math.PI, 0.3 + (3 * Math.PI) / 2])
    for (let t = 0; t <= wr; t++) b.set(Math.round(fcx + Math.cos(a) * t * sx), Math.round(cy + Math.sin(a) * t), PAL.G5);
  rect(Math.round(fcx) - 1, cy - 1, 3, 3, b.ink(PAL.G6));
  b.set(Math.round(fcx), cy, PAL.W7);
  // hinge blocks
  for (const hy of [cy - 18, cy + 14]) { rect(hx - 5, hy, 6, 5, b.ink(PAL.N0)); rect(hx - 4, hy + 1, 4, 3, b.ink(PAL.G3)); b.set(hx - 4, hy + 1, PAL.G5); }
  // ---- amber beacons flanking the top of the frame (rotating: 4 held drawings)
  const bs = Math.floor(f / 3) % 4;
  for (const side of [-1, 1]) {
    const bx = cx + side * 30, by = cy - 31;
    const phase = (bs + (side > 0 ? 2 : 0)) % 4;
    // light wedge thrown on the wall
    if (phase === 0 || phase === 2) {
      const dir = phase === 0 ? -1 : 1;
      for (let i = 2; i < 16; i++) {
        const hw = Math.floor(i / 3.5);
        for (let j = -hw; j <= hw; j++) {
          if (i > 10 && ((i + j) & 1)) continue;
          const px = bx + dir * i, py = by + 1 + j;
          const d = Math.hypot(px + 0.5 - cx, py + 0.5 - cy);
          if (d < RO + 0.5) continue;
          b.set(px, py, i < 7 ? PAL.W6 : PAL.W4);
        }
      }
    }
    rect(bx - 2, by + 2, 5, 2, b.ink(PAL.N0));
    rect(bx - 1, by + 4, 3, 2, b.ink(PAL.G2));
    const dome = [PAL.W4, PAL.W5, PAL.W6];
    for (let j = 0; j < 3; j++) for (let i = -2; i <= 2; i++) {
      if (j === 0 && Math.abs(i) === 2) continue;
      const hot = phase === 1 ? Math.abs(i) < 2 : phase === 0 ? i < 0 : phase === 2 ? i > 0 : false;
      b.set(bx + i, by - 1 + j, hot ? (j === 0 ? PAL.W9 : PAL.W8) : dome[j] === PAL.W6 ? PAL.W3 : PAL.W2);
    }
    b.set(bx, by - 2, PAL.N0);
  }
  // ---- safety HUD: RED-TEAMED, ticking
  const hw2 = 58, hx2 = cx - 29, hy2 = cy - RO - 12;
  rect(hx2 - 1, hy2 - 1, hw2 + 2, 9, b.ink(PAL.N0));
  rect(hx2, hy2, hw2, 7, b.ink(PAL.C0));
  micro(b, 'RED-TEAMED', hx2 + 2, hy2 + 1, PAL.C6);
  for (let k = 0; k < 3; k++) micro(b, '^', hx2 + 40 + k * 6, hy2 + 1, k < v.ticks ? PAL.C8 : PAL.C1);
};

// ================================================================== the scroll
/**
 * The scroll: it falls from Mario's hand (hx, hy) to the table line `ty`, then unrolls to the right along
 * the table. `len` = pixels of paper shown past the hand (grows in whole pixels as it unrolls).
 */
export const drawScroll = (b: Buf, hx: number, hy: number, ty: number, len: number, maxX = 9999) => {
  const W = 9; // paper width when hanging
  const drop = Math.max(0, ty - hy);
  const hang = Math.min(len, drop);
  const paper = [PAL.P0, PAL.P1, PAL.P2];
  const ink = PAL.N4;
  // hanging part (paper faces us, lit from the right)
  for (let j = 0; j < hang; j++)
    for (let i = 0; i < W; i++) {
      const x = hx - 4 + i + Math.round(Math.sin(j / 9) * 1.2), y = hy + j;
      const c = i === 0 ? PAL.N1 : i === W - 1 ? PAL.P2 : i < 3 ? paper[1] : paper[2];
      b.set(x, y, c);
      if (i >= 2 && i < W - 2 && j % 3 === 1 && ((i * 7 + j * 3) % 11) !== 0) b.set(x, y, j % 9 === 1 && i > 5 ? paper[1] : ink);
    }
  // along the table: foreshortened strip, then the roll
  const run = Math.max(0, len - drop);
  const x0 = hx - 4 + Math.round(Math.sin(drop / 9) * 1.2);
  const H2 = 6;
  const end = Math.min(x0 + run, maxX);
  for (let x = x0; x < end; x++)
    for (let j = 0; j < H2; j++) {
      const y = ty - H2 + 1 + j;
      b.set(x, y, j === 0 ? PAL.P2 : j === H2 - 1 ? PAL.P0 : paper[2]);
      if (j >= 1 && j <= 4 && (x - x0) % 2 === 0 && j % 2 === 1 && ((x * 5 + j) % 13) !== 0) b.set(x, y, ink);
    }
  // the last line: an addendum
  if (run > 60) { rect(end - 46, ty - H2 + 1, 42, 5, b.ink(PAL.P2)); micro(b, 'ADDENDUM:', end - 45, ty - H2 + 1, CX.INK); }
  // the roll at the leading end
  const rx = len <= drop ? hx - 4 : end;
  const ry = len <= drop ? hy + hang : ty - H2;
  if (len <= drop) {
    rect(rx - 1, ry, W + 2, 4, b.ink(PAL.N0));
    rect(rx, ry, W, 3, b.ink(PAL.P1));
    rect(rx, ry, W, 1, b.ink(PAL.P2));
  } else {
    rect(rx, ry - 1, 5, H2 + 2, b.ink(PAL.N0));
    rect(rx + 1, ry, 3, H2, b.ink(PAL.P1));
    rect(rx + 1, ry, 1, H2, b.ink(PAL.P2));
    b.set(rx + 2, ry + 2, PAL.P0);
  }
};

/** the DRAFT sheet fluttering out of the vault: 3 drawings (flat / tilted / curled) */
export const drawDraft = (b: Buf, x: number, y: number, k: number) => {
  const shapes = [
    ['oooooooo', 'oPPPPPPo', 'oPiiiiPo', 'oPPPPPPo', 'oPsssPPo', 'oPPPPPPo', 'oooooooo'],
    ['..ooooo.', '.oPPPPo.', 'oPiiiPPo', 'oPPPPPo.', 'oPsssPo.', '.oPPPo..', '.oooo...'],
    ['...oooo.', '..oPPPo.', '.oPiiPo.', 'oPPPPo..', 'oPssPo..', 'oPPo....', 'ooo.....'],
  ];
  const pal: Record<string, number> = {o: PAL.N1, P: PAL.P2, i: PAL.N4, s: CX.INK};
  shapes[k % 3].forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};

// ================================================================== conversation portrait (112 x 136)
// Painted like the pixeladv portraits: every plane is a hand-placed polygon with an explicit ramp index;
// the rig adds only the silhouette edges (warm rim toward the candles, cool vault back-rim, shadow-side
// outline). Curls are clumps with a lit crescent, a dark core and a spark. Acting = replacement parts:
// 4 mouths, 3 lids, 2 brows, the finger (down / up / up + wag) and whole-pixel nudges.
export const PORTRAIT_W = 112, PORTRAIT_H = 136;
export interface MarioPortrait { mouth: 0 | 1 | 2 | 3; blink: 0 | 1 | 2; brow: 0 | 1; finger: 0 | 1 | 2; nod: number; }
export const MARIO_PORTRAIT_REST: MarioPortrait = {mouth: 0, blink: 0, brow: 0, finger: 1, nod: 0};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
// curl clumps over the crown and the back of the head: [cx, cy, r]
const CURLS: Array<[number, number, number]> = [
  [38, 44, 7], [36, 55, 6.5], [38, 65, 5.5], [42, 34, 7.5], [49, 27, 7.5], [58, 23, 7.5], [67, 23, 7], [75, 27, 6], [80, 33, 4.6],
  [45, 40, 6], [54, 33, 6], [63, 31, 6], [71, 34, 5], [46, 52, 5], [42, 60, 4.5], [30, 50, 4.5], [31, 40, 4.5], [34, 31, 5], [44, 22, 5], [56, 16, 5.5], [67, 16, 5], [76, 20, 4.5],
];

const marioPortraitFig = (s: MarioPortrait): FigureDef => {
  const dy = s.nod, dx = 0;
  const H = (...pts: number[]) => shiftPrim(P.poly(...pts), dx, dy);
  const HL = (x0: number, y0: number, x1: number, y1: number) => shiftPrim(P.line(x0, y0, x1, y1), dx, dy);
  const HE = (cx: number, cy: number, rx: number, ry: number) => shiftPrim(P.ell(cx, cy, rx, ry), dx, dy);
  const fy = s.finger === 0 ? 30 : s.finger === 2 ? -3 : 0; // finger rises into frame; 2 = the extra lift on the point
  const F = (...pts: number[]) => shiftPrim(P.poly(...pts), 0, fy);
  const FE = (cx: number, cy: number, rx: number, ry: number) => shiftPrim(P.ell(cx, cy, rx, ry), 0, fy);
  const parts: Part[] = [
    // fleece shoulders, a soft slope; the far shoulder drops away left
    {group: 'torso', mat: 'fleece', tone: 2, prims: [P.poly(0, 136, 2, 116, 12, 106, 28, 99, 46, 96, 66, 97, 84, 101, 98, 108, 108, 118, 112, 126, 112, 136)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [H(49, 72, 50, 98, 70, 102, 72, 86, 66, 80)]},
    // the quarter-zip collar, standing up
    {group: 'collar', mat: 'collar', tone: 2, prims: [P.poly(40, 90 + dy, 46, 84 + dy, 52, 92 + dy, 64, 97, 76, 93 + dy, 80, 86 + dy, 84, 92 + dy, 80, 102, 66, 108, 52, 106, 42, 100)]},
    // head: cranium + soft jaw + profile features on the right
    {group: 'head', mat: 'skin', tone: 2, prims: [H(
      38, 60, 40, 42, 50, 30, 64, 27, 74, 30, 78, 38, 79, 44, 80, 48, 83, 54, 85, 58, 82, 60, 81, 63, 81.5, 66, 80, 69, 79, 74, 77, 78,
      73, 82, 66, 84, 58, 83, 50, 78, 44, 72)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [H(40, 48, 45, 46, 49, 50, 49, 60, 46, 66, 41, 65, 38, 58)]},
    // the curly mop (a union of clumps)
    {group: 'hair', mat: 'hair', tone: 1, prims: CURLS.map(([x, y, r]) => HE(x, y, r, r * 0.95))},
    // the raised hand: fist + index finger, sleeve cuff rising from the bottom right
    {group: 'sleeve', mat: 'fleece', tone: 2, prims: [F(84, 136, 88, 110, 96, 102, 108, 104, 112, 112, 112, 136)]},
    {group: 'hand', mat: 'skin', tone: 2, prims: [F(88, 104, 87, 94, 90, 86, 96, 83, 104, 84, 108, 90, 107, 100, 102, 106, 93, 107)]},
    // the INDEX finger rises from the thumb-side edge of the fist (camera-left, toward his face), never from its
    // middle: with the thumb shown and the three curled fingers on the far side it can only read as a point
    {group: 'finger', mat: 'skin', tone: 3, prims: [F(88, 88, 88, 64, 90, 61, 93, 61, 95, 64, 95, 88), FE(91.5, 63, 3.4, 3)]},
    {group: 'thumb', mat: 'skin', tone: 3, prims: [F(85, 95, 87, 91, 92, 91, 97, 94, 96, 97, 90, 98, 86, 98)]},
  ];
  const adjust: Adjust[] = [
    // ---- curls: each clump gets a lit crescent toward the candles (upper right), a dark core, a spark
    // curls as ringlet strokes on one dark mass: a dark separating arc under each clump and a lit
    // C-stroke over it (toward the candles), each turned a little differently so they don't tile
    ...CURLS.flatMap(([x, y, r], i): Adjust[] => {
      const a = -0.75 + (((i * 37) % 11) / 11 - 0.5) * 0.9;
      const arcPts = (from: number, to: number, rr: number, n = 5) => Array.from({length: n}, (_, k) => {
        const t = a + from + ((to - from) * k) / (n - 1);
        return [x + Math.cos(t) * rr, y + Math.sin(t) * rr] as const;
      });
      const out: Adjust[] = [];
      const dark = arcPts(1.6, 3.6, r * 0.92);
      for (let k = 0; k < dark.length - 1; k++) out.push(plane('hair', 0, HL(dark[k][0], dark[k][1], dark[k + 1][0], dark[k + 1][1])));
      const lit = arcPts(-1.2, 0.9, r * 0.55);
      for (let k = 0; k < lit.length - 1; k++) out.push(plane('hair', k === 1 || k === 2 ? 4 : 3, HL(lit[k][0], lit[k][1], lit[k + 1][0], lit[k + 1][1])));
      if (i % 2 === 0) out.push(plane('hair', 5, HE(lit[2][0], lit[2][1], 0.7, 0.7)));
      return out;
    }),
    // ---- face: warm key from the right. Front planes lit, the side of the head toward the ear in mid.
    plane('skin', 3, H(64, 30, 74, 30, 78, 38, 79, 44, 80, 48, 83, 54, 85, 58, 82, 60, 81, 63, 81.5, 66, 80, 69, 79, 74, 77, 78, 73, 82, 68, 82, 70, 74, 71, 66, 68, 58, 68, 50, 66, 40)),
    plane('skin', 4, H(73, 31, 77, 38, 78, 43, 75, 43, 72, 37), H(79, 46, 83, 54, 84, 57, 81, 57, 79, 51), H(72, 55, 77, 55, 77, 60, 72, 60), H(74, 73, 78, 72, 77, 77, 73, 79), H(78, 64, 80.5, 64, 80, 67, 78, 67)),
    plane('skin', 5, HL(83, 55, 84, 57), HL(75, 33, 76, 36), HL(74, 57, 75, 57)),
    // shadows: eye socket under the brow, under the nose, under the lower lip, jaw underside, the ear
    plane('skin', 1, H(60, 44, 74, 43, 74, 45, 61, 47)),
    plane('skin', 1, H(76, 59, 81, 60, 80, 62, 76, 61), H(72, 69, 79, 69, 78, 71, 73, 71)),
    plane('skin', 1, H(50, 70, 58, 77, 66, 80, 73, 80, 66, 84, 56, 82, 48, 76)),
    plane('skin', 1, H(54, 84, 66, 86, 72, 84, 71, 88, 58, 89, 52, 87)),
    plane('skin', 1, H(41, 50, 44, 49, 46, 53, 45, 60, 42, 61)),
    plane('skin', 0, H(43, 53, 44, 53, 44, 57, 43, 57)),
    plane('skin', 3, H(46, 49, 48, 51, 48, 59, 46, 63)),
    plane('skin', 3, H(56, 52, 66, 50, 70, 60, 68, 70, 60, 70, 55, 62)),
    plane('skin', 4, H(64, 32, 72, 31, 74, 36, 66, 37), H(68, 54, 72, 53, 73, 58, 69, 59), H(71, 76, 75, 75, 74, 79, 71, 80)),
    // the nose: its shaded side faces us, a bright ridge toward the light
    plane('skin', 2, H(76, 47, 79, 47, 81, 56, 80, 59, 77, 59, 77, 53)),
    plane('skin', 4, HL(79, 47, 83, 56)),
    // nasolabial fold + the worried crease between the brows
    plane('skin', 2, HL(77, 62, 74, 70), HL(76, 40, 77, 44)),
    // ---- fleece: lit front of the chest, soft folds, the far shoulder in shadow
    plane('fleece', 3, P.poly(66, 98, 84, 101, 98, 108, 94, 116, 76, 110, 66, 106)),
    plane('fleece', 1, P.poly(0, 136, 2, 116, 12, 106, 22, 102, 20, 118, 14, 136), P.line(40, 108, 50, 136), P.line(86, 110, 80, 136)),
    plane('fleece', 4, P.line(64, 108, 65, 136)),
    plane('collar', 3, P.poly(64, 97, 76, 93 + dy, 80, 86 + dy, 84, 92 + dy, 80, 100, 66, 104)),
    plane('collar', 1, P.poly(40, 90 + dy, 46, 84 + dy, 52, 92 + dy, 50, 100, 42, 98)),
    // ---- hand: knuckles lit, the palm side in shadow, the fingernail catches
    plane('skin', 4, F(100, 85, 106, 88, 107, 95, 103, 93), F(92, 63, 94, 64, 94, 80, 92, 80)),
    plane('skin', 1, F(88, 99, 94, 99, 96, 104, 92, 107), F(88, 72, 89, 72, 89, 86, 88, 86)),
    plane('skin', 5, F(92, 61, 93, 61, 93, 62, 92, 62)),
    // the three curled fingers: creases on the far side of the index only
    plane('skin', 1, F(96, 89, 104, 88, 104, 89, 96, 90), F(97, 95, 105, 95, 105, 96, 97, 96), F(97, 101, 104, 101, 104, 102, 97, 102)),
    // the thumb: lit top edge, its nail toward the curled fingers, a shadow under it
    plane('skin', 4, F(86, 92, 92, 92, 96, 94, 93, 94, 87, 94)),
    plane('skin', 5, F(95, 95, 96, 95, 96, 96, 95, 96)),
    plane('skin', 1, F(87, 97, 95, 97, 95, 98, 87, 98)),
  ];
  const lid = s.blink;
  // near eye (inside the near lens), far eye past the nose; worried brows lift at the inner end
  const nearEye = lid === 2
    ? ['...........', '...........', '..LLLLLLL..', '...kkkkk...']
    : lid === 1
      ? ['...........', '..LLLLLLL..', '.LLLLLLLLL.', '..wIIiww...']
      : ['...LLLLL...', '.LLwwwwwLL.', '.wwIIiwwww.', '..wIIgw....', '...kkkk....'];
  const nearBrow = s.brow
    ? ['.........bb', '......bbbb.', '...bbbbb...', 'bbbb.......']
    : ['...........', '........bbb', '....bbbbbb.', 'bbbbb......'];
  const farEye = lid === 2 ? ['....', 'LLL.', '.k..'] : ['.LL.', 'LwI.', '.k..'];
  const mouths: Record<number, string[]> = {
    0: ['.........', 'rmmmmmm..', '..lllll..'],
    1: ['.........', 'mmmmmmmm.', 'mtTTTTdm.', '.lllll...'],
    2: ['.........', 'mmmmmmm..', 'mtTTTdm..', 'mddddm...', '.llll....'],
    3: ['.........', '..mmmm...', '.mddddm..', '.mdddm...', '..lll....'],
  };
  const stamps: Stamp[] = [
    {x: 60 + dx, y: 36 + dy - (s.brow ? 1 : 0), rows: nearBrow, pal: {b: PAL.B0}},
    {x: 79 + dx, y: 40 + dy - (s.brow ? 1 : 0), rows: s.brow ? ['bb..', '.bb.'] : ['....', 'bbb.'], pal: {b: PAL.B0}},
    {x: 61 + dx, y: 45 + dy, rows: nearEye, pal: {L: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 80 + dx, y: 46 + dy, rows: farEye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, k: PAL.S2}},
    // the glasses: thin dark frames, a bridge over the nose, the temple arm back to the ear, lens glints
    {x: 57 + dx, y: 42 + dy, rows: [
      '..ffffffffffffff..........',
      '.f..............f.ff......',
      'f................fGGf.....',
      'f.......G........f..f.....',
      'f......G.........f..f.....',
      'f.....G..........f..f.....',
      'f................f.f......',
      '.f..............f.f.......',
      '..ffffffffffffff..........',
    ], pal: {f: PAL.N0, G: PAL.W8}},
    {x: 46 + dx, y: 45 + dy, rows: ['tttttttttttt'], pal: {t: PAL.N0}},
    {x: 83 + dx, y: 58 + dy, rows: ['.o', 'o.'], pal: {o: PAL.S1}},
    {x: 73 + dx, y: 64 + dy, rows: mouths[s.mouth], pal: {m: PAL.S1, l: PAL.S4, t: PAL.S5, T: PAL.S6, d: PAL.N0, r: PAL.S2}},
    // zip pull on the collar
    {x: 63, y: 98, rows: ['yy', 'Yy', 'yy', '.y'], pal: {y: PAL.G5, Y: PAL.G6}},
  ];
  return {w: PORTRAIT_W, h: PORTRAIT_H, parts, adjust, stamps};
};

const MARIO_PRIG: LightRig = {
  key: [0.95, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['collar'],
  back: [-1, -0.3], backBand: 2,
  backRamp: {skin: PAL.K3, hair: PAL.C5, fleece: PAL.C4, collar: PAL.C5},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B3, PAL.B4, PAL.W5],
    fleece: [CX.F0, CX.F1, CX.F2, CX.F3, CX.F4, CX.F5],
    collar: [CX.F0, CX.F2, CX.F3, CX.F4, CX.F5, CX.F6],
  },
};

/** background: the vault's clinical light spilling from behind-left, the steel ring's edge, dark room right */
const bgMario = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const bz = bayer(x, y);
      // the opening: a big circle whose edge crosses the frame
      const d = Math.hypot(x + 30, y - 58) / 78;
      let c: number = PAL.N1;
      if (d < 0.62) c = d < 0.4 ? PAL.C8 : bz < (0.62 - d) / 0.22 ? PAL.C7 : PAL.C5;
      else if (d < 0.7) c = PAL.N0; // the lip of the ring
      else if (d < 0.86) c = (x + y) % 7 === 0 ? PAL.G4 : d < 0.74 ? PAL.G5 : bz < (0.86 - d) / 0.12 ? PAL.G3 : PAL.G2;
      else if (d < 0.9) c = PAL.N0;
      else c = bz < Math.max(0, 1.1 - d) * 1.5 ? PAL.N2 : PAL.N1;
      b.set(x0 + x, y0 + y, c);
    }
  // bolts on the ring
  for (let k = 0; k < 7; k++) {
    const a = -1.1 + k * 0.36;
    const bx = Math.round(-30 + Math.cos(a) * 78 * 0.8), by = Math.round(58 + Math.sin(a) * 78 * 0.8);
    if (bx >= 0 && bx < w && by >= 0 && by < h) { b.set(x0 + bx, y0 + by, PAL.G6); b.set(x0 + bx + 1, y0 + by + 1, PAL.N0); }
  }
};

const mpCache = new Map<string, Img>();
export const marioPortraitImg = (s: MarioPortrait) => {
  const k = JSON.stringify(s);
  let v = mpCache.get(k);
  if (!v) { v = renderFigure(marioPortraitFig(s), MARIO_PRIG); mpCache.set(k, v); }
  return v;
};
export const drawMarioPortrait = (b: Buf, x: number, y: number, s: MarioPortrait) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + PORTRAIT_W && py < y + PORTRAIT_H;
  bgMario(b, x, y, PORTRAIT_W, PORTRAIT_H);
  blitImg(b, marioPortraitImg(s), x, y, {clip});
};
