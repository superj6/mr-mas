// MR. MAS - style-range Prototype 1: the PIXEL VEGAS TABLE plate (also J4's blocker; built once for both).
// NO-LIMIT PACE (Ep10 #14 staging): a card table in a dark casino with GPUs for chips, under ONE tungsten pool light.
// Generic by rule: no casino name, no card brand, no chip marks, no real sign. The far neon is an unlettered tube over
// a back bar; the lamp is a plain card-room pendant.
//
// The plate is painted as (material, level) and lit with the engine's resolve(): one warm light (the lamp's pool on
// the felt and a little spill on the wall), the night ambient, and a thin cyan spill off the far neon. It is painted to
// the FULL 270 rows, so when the band retracts the dark under the table is already there to take the freed lines.
//
// Layers: back (wall, back bar, neon, lamp)  ->  [players seated behind the far rail, the Intern]  ->  front (rail,
// felt, betting line, chips, cards, props)  ->  [Mas, his glass]  ->  UI.
import {Buf, rect, line, ellipse, poly, clamp, hash, TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {MatBuf, Lights, defineMat, resolve} from '../../../../shared/pixel/light';
import {LAMP, TABLE, SEAT_X, INTERN_X} from '../geo';

export const W = 480, H = 270;

// ------------------------------------------------------------------ materials (night / cyan / warm ramps, 0..7)
defineMat('p1.wall', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N1', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N1', 'U0', 'W0', 'W1', 'W2', 'W3', 'W4']);
defineMat('p1.bar', ['N0', 'N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5'], ['N0', 'N0', 'D0', 'D1', 'D2', 'W2', 'W3', 'W4']);
defineMat('p1.felt', ['N0', 'N0', 'N1', 'L0', 'L0', 'L1', 'L1', 'L2'], ['N0', 'N1', 'L0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'L0', 'L0', 'L1', 'L1', 'L2', 'L2', 'L3']);
defineMat('p1.rail', ['N0', 'N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W5']);
defineMat('p1.apron', ['N0', 'N0', 'D0', 'D0', 'D1', 'D1', 'D2', 'D3'], ['N0', 'N0', 'D0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4']);
defineMat('p1.carpet', ['N0', 'N0', 'N1', 'U0', 'U0', 'U1', 'U1', 'U2'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N0', 'U0', 'U1', 'U2', 'W1', 'W2', 'W3']);
defineMat('p1.gpu', ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5']);
defineMat('p1.gold', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'D0', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['D0', 'D1', 'D2', 'W2', 'W3', 'W4', 'W5', 'W6']);
defineMat('p1.card', ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'], ['N1', 'N2', 'C1', 'C2', 'C4', 'C6', 'C8', 'C9'], ['N1', 'N3', 'X1', 'X2', 'P0', 'P0', 'P1', 'P1']);
defineMat('p1.back', ['N0', 'N1', 'N2', 'F1', 'F2', 'F3', 'F3', 'F4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6']);
defineMat('p1.shade', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W6']);
defineMat('p1.chrome', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G5', 'G6'], ['N0', 'N1', 'C0', 'C1', 'C3', 'C5', 'C7', 'C9'], ['N0', 'G1', 'G2', 'G3', 'G5', 'G6', 'W8', 'W9']);
// the casino carpet: a plum ground, a gold lattice, a teal fleck (loud patterns are what card rooms are carpeted in)
defineMat('p1.rug', ['N0', 'N0', 'N1', 'U0', 'U0', 'U1', 'U1', 'U2'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C1', 'C2'], ['N0', 'N1', 'U0', 'U1', 'U2', 'U3', 'U3', 'U4']);
defineMat('p1.rugGold', ['N0', 'N1', 'D0', 'D1', 'D2', 'D3', 'D3', 'D4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C3', 'C4'], ['N0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W6']);
defineMat('p1.rugTeal', ['N0', 'N1', 'C0', 'C0', 'C1', 'C1', 'C2', 'C2'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C3', 'C4'], ['N0', 'N1', 'C0', 'C1', 'C1', 'C2', 'C3', 'C3']);
// his chair: oxblood leather, brass nails
defineMat('p1.chair', ['N0', 'N0', 'N0', 'W0', 'W0', 'W1', 'W1', 'W2'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'W0', 'W1', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('p1.napkin', ['N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N8'], ['N2', 'C1', 'C2', 'C4', 'C6', 'C7', 'C8', 'C9'], ['N2', 'P0', 'P1', 'P1', 'P2', 'P2', 'W9', 'W9']);

// ------------------------------------------------------------------ geometry helpers
const inEll = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
/** the felt's far / near edge row at column x */
export const feltEdge = (x: number, near: boolean) => {
  const {cx, cy, rx, ry} = TABLE;
  const u = clamp((x - cx) / rx, -1, 1);
  const dy = ry * Math.sqrt(1 - u * u);
  return Math.round(near ? cy + dy : cy - dy);
};
/** outer rail ellipse: 3 px beyond the felt at the far side, 7 at the near side (seen from above the rail) */
const RAIL = {cx: TABLE.cx, cy: TABLE.cy + 2, rx: TABLE.rx + 8, ry: TABLE.ry + 5};
export const railEdge = (x: number, near: boolean) => {
  const u = clamp((x - RAIL.cx) / RAIL.rx, -1, 1);
  const dy = RAIL.ry * Math.sqrt(1 - u * u);
  return Math.round(near ? RAIL.cy + dy : RAIL.cy - dy);
};
/** the rail's far top edge: where the seated players are cut off */
export const FAR_RAIL_Y = railEdge(SEAT_X.mario, false);

// ------------------------------------------------------------------ lights
const pool = (x: number, y: number) => {
  const d = Math.hypot((x - LAMP.poolX) / LAMP.poolRX, (y - LAMP.poolY) / LAMP.poolRY);
  return clamp(1.08 - d, 0, 1) ** 0.9;
};
export const LIGHTS: Lights = {
  amb: (x, y) => (y < 96 ? 1.6 - y / 300 : y < 186 ? 1.3 : 1.45 - (y - 186) / 240),
  // the far neon's thin cyan spill on the wall and the back bar (it rims the players from behind)
  cyan: (_x, y) => (y >= 66 && y < 100 ? clamp(0.42 - Math.abs(y - 84) / 34, 0, 1) : 0),
  warm: (x, y) => {
    // past the rail the pool falls on the carpet in front of the table (the table's own shadow sits right under it)
    if (y >= 188) return 0.62 * clamp(1 - Math.hypot((x - 300) / 230, (y - 204) / 50), 0, 1) ** 1.2 * clamp((y - 190) / 12, 0.25, 1);
    if (y >= 96) return pool(x, y);
    // spill on the wall under the shade (a soft hood of light, never reaching the corners)
    return 0.34 * clamp(1 - Math.hypot((x - LAMP.x) / 150, (y - 4) / 56), 0, 1);
  },
  dither: 0.8,
};

// ------------------------------------------------------------------ back layer
const paintBack = (mb: MatBuf) => {
  // the far wall: dark panels with faint seams, a molding line
  rect(0, 0, W, 100, mb.mat('p1.wall', 0));
  for (let x = 18; x < W; x += 46) line(x, 0, x, 70, mb.shade(-0.7));
  line(0, 70, W, 70, mb.shade(0.6));
  line(0, 71, W, 71, mb.shade(-0.6));
  // the back bar: a long counter across the far room, shelves of bottles above it (tiny glints, no labels)
  rect(0, 78, W, 22, mb.mat('p1.bar', 0));
  rect(0, 78, W, 1, mb.shade(0.8));
  for (let x = 0; x < W; x++) {
    const hx = hash(x, 5, 91);
    if (hx < 0.34) continue;
    const h = 3 + Math.floor(hash(x, 7, 92) * 5);
    const pale = hash(x, 9, 93) > 0.7;
    for (let j = 0; j < h; j++) mb.mat('p1.bar', pale ? 0.8 : 0.2)(x, 77 - j);
  }
  // the unlettered neon tube on the bar front (the one cool light in the room), with its halo rows
  for (let x = 0; x < W; x++) {
    const gap = (x > 118 && x < 124) || (x > 402 && x < 406);
    if (gap) continue;
    mb.emit(PAL.C7)(x, 86);
    if (hash(x, 86, 3) > 0.5) mb.emit(PAL.C4)(x, 85);
    mb.emit(hash(x, 87, 4) > 0.35 ? PAL.C3 : PAL.C2)(x, 87);
  }
  // the lamp: a card-room pendant (a wide, shallow shade on a rod), its hot underside and the bulb
  const L = LAMP;
  line(L.x, 0, L.x, 3, mb.mat('p1.shade', 1));
  rect(L.x - 6, 3, 13, 2, mb.mat('p1.shade', 1.4));
  poly([L.x - 14, 5, L.x + 14, 5, L.x + 46, L.shadeY, L.x - 46, L.shadeY], mb.mat('p1.shade', 0));
  line(L.x - 14, 5, L.x + 14, 5, mb.shade(1.4));
  for (let x = L.x - 44; x <= L.x + 44; x += 6) line(x, L.shadeY - 1, Math.round(L.x + (x - L.x) * 0.36), 6, mb.shade(0.5));
  for (let x = L.x - 46; x <= L.x + 46; x++) mb.emit(Math.abs(x - L.x) < 30 ? PAL.W6 : PAL.W4)(x, L.shadeY);
  for (let x = L.x - 40; x <= L.x + 40; x++) mb.emit(Math.abs(x - L.x) < 14 ? PAL.W9 : Math.abs(x - L.x) < 28 ? PAL.W8 : PAL.W6)(x, L.shadeY + 1);
  for (let x = L.x - 8; x <= L.x + 8; x++) mb.emit(PAL.W9)(x, L.shadeY + 2);
};

// ------------------------------------------------------------------ the carpet (the room the band leaves behind)
const FLOOR_Y0 = 104; // the floor's vanishing row (a little above the felt's centre, as the table's ellipse implies)
const paintCarpet = (mb: MatBuf) => {
  for (let y = 176; y < H; y++) {
    // depth along the floor at this row, and the across-coordinate scale
    const z = 900 / (y - FLOOR_Y0);
    for (let x = 0; x < W; x++) {
      const u = ((x - 250) * z) / 150, v = z * 1.25;
      // a diamond lattice with a medallion in every other cell and a teal fleck at the crossings
      const a = u + v, b = u - v;
      const fa = a - Math.floor(a), fb = b - Math.floor(b);
      const cell = (Math.floor(a) + Math.floor(b)) & 1;
      const lat = Math.min(Math.abs(fa - 0.5), Math.abs(fb - 0.5));
      const cxd = Math.hypot(fa - 0.5, fb - 0.5);
      let mat = 'p1.rug', lv = 0;
      if (lat < 0.06) { mat = 'p1.rugGold'; lv = 0.3; }
      else if (cell && cxd < 0.2 && cxd > 0.12) { mat = 'p1.rugGold'; lv = 0; }
      else if (!cell && cxd < 0.07) { mat = 'p1.rugTeal'; lv = 0.6; }
      mb.mat(mat, lv)(x, y);
    }
  }
};

// ------------------------------------------------------------------ front layer (the table and what's on it)
const paintTable = (mb: MatBuf) => {
  const {cx, cy, rx, ry} = TABLE;
  // under and in front of the table: the carpet, in perspective, lit by the pool's spill past the rail
  paintCarpet(mb);
  // the pedestal under the table's centre, in the table's own shadow: a column and a flared foot with a brass ring
  const px0 = cx;
  for (let y = 186; y < 214; y++) {
    const foot = y >= 205;
    const hw = foot ? 9 + (y - 205) * 3.2 : 7;
    for (let x = Math.round(px0 - hw); x <= Math.round(px0 + hw); x++) {
      const u = (x - px0) / hw;
      mb.mat('p1.apron', (foot ? 0.2 : -0.6) + 0.9 * clamp(0.6 - Math.abs(u + 0.25), -1, 1))(x, y);
    }
  }
  for (let x = px0 - 9; x <= px0 + 9; x++) mb.mat('p1.gold', x < px0 + 3 ? 1.2 : 0.2)(x, 205);
  for (let x = px0 - 36; x <= px0 + 36; x++) mb.shade(-2.2)(x, 214);
  // the apron (the table's dark wood side) under the near rail
  for (let x = cx - RAIL.rx; x <= cx + RAIL.rx; x++) {
    const y0 = railEdge(x, true);
    for (let y = y0 - 2; y < y0 + TABLE.apron; y++) mb.mat('p1.apron', y === y0 - 1 ? 1.4 : y < y0 + 2 ? 0.4 : -0.4)(x, y);
  }
  // the rail (padded leather) then the felt over it
  ellipse(RAIL.cx, RAIL.cy, RAIL.rx, RAIL.ry, mb.mat('p1.rail', 0));
  // the rail's crown catches the lamp: a lit band along the near cushion, a thin one on the far side
  for (let x = cx - RAIL.rx; x <= cx + RAIL.rx; x++) {
    const fe = feltEdge(x, true), re = railEdge(x, true);
    if (Math.abs(x - cx) > rx - 1) continue;
    for (let y = fe; y <= re; y++) {
      const t = (y - fe) / Math.max(1, re - fe);
      mb.shade(t < 0.2 ? -0.8 : t < 0.45 ? 2.6 : t < 0.7 ? 1.4 : -0.2)(x, y);
    }
    const ff = feltEdge(x, false), rf = railEdge(x, false);
    for (let y = rf; y < ff; y++) mb.shade(y === rf ? 1.5 : 0.2)(x, y);
  }
  ellipse(cx, cy, rx, ry, mb.mat('p1.felt', 0));
  // felt: a soft falloff toward the rail (the cushion's shadow on the felt) and the betting line
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = cx - rx; x <= cx + rx; x++) {
      if (!inEll(x, y, cx, cy, rx, ry)) continue;
      if (!inEll(x, y, cx, cy, rx - 3, ry - 2)) mb.shade(-0.9)(x, y);
    }
  const brx = rx - 22, bry = ry - 9;
  for (let a = 0; a < 720; a++) {
    const t = (a / 720) * Math.PI * 2;
    const x = Math.round(cx + Math.cos(t) * brx), y = Math.round(cy + Math.sin(t) * bry);
    mb.shade(0.9)(x, y);
  }
};

// ------------------------------------------------------------------ chips: GPUs (a stack of little cards, each with a
// gold edge-connector stripe where a chip would carry its colour band)
const gpuStack = (mb: MatBuf, x: number, y: number, n: number, w = 7) => {
  // y = the felt row the stack stands on; each card is 2 rows (top face, side with the gold fingers)
  for (let k = 0; k < n; k++) {
    const yy = y - 2 * k - 2;
    const jx = Math.round((hash(x, k, 17) - 0.5) * 1.6);
    rect(x + jx, yy, w, 1, mb.mat('p1.gpu', 1.2));
    rect(x + jx, yy + 1, w, 1, mb.mat('p1.gpu', -0.4));
    mb.mat('p1.gold', 0.6)(x + jx + 1, yy + 1);
    mb.mat('p1.gold', 0.6)(x + jx + 3, yy + 1);
    mb.mat('p1.gpu', 2.2)(x + jx + w - 2, yy);
  }
  // its contact shadow on the felt
  for (let i = -1; i <= w; i++) mb.shade(-1.4)(x + i, y);
};
const card = (mb: MatBuf, x: number, y: number, up: boolean, pip = 0) => {
  rect(x, y, 7, 5, mb.mat(up ? 'p1.card' : 'p1.back', 0.6));
  if (up) {
    // a generic pip (one or two pixels: no court cards, no brand)
    const red = pip % 2 === 0;
    const c = red ? PAL.R2 : PAL.N1;
    mb.emit(c)(x + 3, y + 2);
    if (pip > 1) mb.emit(c)(x + 3, y + 1);
  } else {
    rect(x + 1, y + 1, 5, 3, mb.mat('p1.back', 1.6));
    mb.mat('p1.back', -0.5)(x + 3, y + 2);
  }
  line(x, y + 5, x + 6, y + 5, mb.shade(-3));
};

export interface TableProps { /** Kram's ladle tips (anime only in the brief; pixel keeps it level) */ }

const paintTableTop = (mb: MatBuf) => {
  const {cx, cy} = TABLE;
  // each player's stack in front of them (near the far betting line)
  const stackY = (x: number) => feltEdge(x, false) + 12;
  const S = SEAT_X;
  gpuStack(mb, S.nole - 12, stackY(S.nole), 5); gpuStack(mb, S.nole - 3, stackY(S.nole) + 1, 3);
  gpuStack(mb, S.kram + 6, stackY(S.kram), 4); gpuStack(mb, S.kram + 15, stackY(S.kram) + 1, 6);
  gpuStack(mb, S.mario - 14, stackY(S.mario), 3); gpuStack(mb, S.mario - 5, stackY(S.mario), 4);
  gpuStack(mb, S.nesnej - 16, stackY(S.nesnej), 7); gpuStack(mb, S.nesnej - 7, stackY(S.nesnej) + 1, 6); gpuStack(mb, S.nesnej + 2, stackY(S.nesnej) + 1, 5);
  // the pot: a heap of stacks under the lamp
  for (const [dx, dy, n] of [[-14, 2, 4], [-5, 0, 7], [4, 2, 5], [13, 1, 3], [-9, 6, 3], [1, 7, 5], [10, 6, 2]] as Array<[number, number, number]>)
    gpuStack(mb, cx - 6 + dx, cy + 4 + dy, n, 7);
  // the board: three up, two down
  for (let i = 0; i < 5; i++) card(mb, cx - 44 + i * 9, cy - 9, i < 3, i + 1);
  // Mas's stack at the near-left (his own side) and his two cards face down under his hand
  gpuStack(mb, 186, 168, 5); gpuStack(mb, 195, 169, 3);
  card(mb, 164, 162, false); card(mb, 168, 163, false);
  // the dealer's shoe at the right end, and the discard
  const sx = INTERN_X - 26, sy = feltEdge(INTERN_X - 20, false) + 8;
  rect(sx, sy - 5, 14, 7, mb.mat('p1.back', 0.2));
  rect(sx, sy - 5, 14, 1, mb.shade(1.4));
  rect(sx + 2, sy - 4, 10, 3, mb.mat('p1.card', 0.8));
  line(sx, sy + 2, sx + 13, sy + 2, mb.shade(-2));
};

// ------------------------------------------------------------------ props (the tells), small and generic
/** Kram's soup: a steel thermos, its cup lid off, a ladle standing in it */
export const drawThermos = (mb: MatBuf, x: number, y: number) => {
  rect(x, y - 11, 5, 11, mb.mat('p1.chrome', 0.4));
  rect(x, y - 11, 1, 11, mb.shade(1.8));
  rect(x + 4, y - 11, 1, 11, mb.shade(-1.4));
  rect(x - 1, y - 12, 7, 1, mb.mat('p1.chrome', 1.4));
  // the ladle: a handle out of the mouth, leaning back
  line(x + 3, y - 12, x + 6, y - 18, mb.mat('p1.chrome', 1.8));
  mb.mat('p1.chrome', 2.4)(x + 6, y - 19);
  line(x - 1, y, x + 6, y, mb.shade(-2));
};
/** Mario's napkin, flat on the felt, a few lines of writing on it */
export const drawNapkin = (mb: MatBuf, x: number, y: number) => {
  poly([x, y, x + 11, y - 1, x + 12, y + 5, x + 1, y + 6], mb.mat('p1.napkin', 0));
  for (let j = 1; j < 5; j += 2) line(x + 2, y + j, x + 8 - j, y + j, mb.mat('p1.napkin', -2.2));
  line(x + 1, y + 7, x + 12, y + 6, mb.shade(-2));
};
/** Nesnej's register: a small till with one key row and the pop-up tab window */
export const drawRegister = (mb: MatBuf, x: number, y: number) => {
  poly([x, y, x + 15, y, x + 13, y - 7, x + 2, y - 7], mb.mat('p1.gold', -0.6));
  rect(x + 3, y - 11, 9, 4, mb.mat('p1.bar', 1));
  rect(x + 4, y - 10, 7, 2, mb.emit(PAL.L2));
  for (let i = 0; i < 4; i++) mb.mat('p1.chrome', 1.6)(x + 3 + i * 3, y - 4);
  line(x, y - 7, x + 15, y - 7, mb.shade(1.4));
  line(x, y + 1, x + 15, y + 1, mb.shade(-2));
};

// ------------------------------------------------------------------ resolve + cache
let CACHE: {back: Buf; front: Buf} | null = null;
export const tablePlate = () => {
  if (CACHE) return CACHE;
  const mbB = new MatBuf(W, H);
  paintBack(mbB);
  const back = new Buf(W, H, PAL.N0);
  resolve(mbB, LIGHTS, back, 0);
  const mbF = new MatBuf(W, H);
  paintTable(mbF);
  paintTableTop(mbF);
  drawThermos(mbF, SEAT_X.kram - 12, feltEdge(SEAT_X.kram, false) + 10);
  drawNapkin(mbF, SEAT_X.mario + 6, feltEdge(SEAT_X.mario, false) + 5);
  drawRegister(mbF, SEAT_X.nesnej + 14, feltEdge(SEAT_X.nesnej + 20, false) + 9);
  const front = new Buf(W, H, TRANSPARENT);
  resolve(mbF, LIGHTS, front, 0);
  CACHE = {back, front};
  return CACHE;
};

export const overlay = (dst: Buf, src: Buf, map?: (c: number) => number) => {
  for (let i = 0; i < src.c.length; i++) if (src.c[i] !== TRANSPARENT) dst.c[i] = map ? map(src.c[i]) : src.c[i];
};
export const stepped = (c: number, k: number) => (k ? stepColor(c, k) : c);
