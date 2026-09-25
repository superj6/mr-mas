// MR. MAS — shared room: LAS VEGAS HOTEL SUITE — DAY (race weekend). (rooms A · Ep1 sc 24-26; reusable)
// A 480x203 room plate (rows 203-269 are the rail band: not ours). A high suite over the Strip, generic: no real
// hotel, sign, logo or event mark, no race cars. The window fills the back wall: desert range, generic towers with
// daytime neon (a marquee pylon, a blade sign, a star), and below, the closed street circuit (kerbs, barriers,
// catch fence, grandstand) where the crane truck grinds past. Inside: MAS's desk in the LEFT THIRD in front of the
// glass (the cast desk sprite, 3/4 facing camera-left, its table edge on SUITE.DESK.top), the laptop at his left,
// his glass at his right (the cast's drawGlass: it never shivers); on the right wall the quilted panel with a small
// neon star, a floor lamp and the minibar with the four glasses that shiver (flute, tumbler, ice bucket, vase).
//
// Light: backlit by day (the window is the brightest thing; the room is contre-jour). Warm channel = sunlight
// (cream ramps) + the lamp, cyan = the laptop and phone (MAS's key, as in every room), night = interior ambient.
// Layers:  back -> [MAS body: masDeskBack] -> front (desk, laptop, phone) -> [MAS hands: masDeskFront, his glass]
import {Buf, rect, line, poly, ellipse, bayer, clamp, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {MatBuf, Lights, defineMat, resolve} from '../light';
import {TRANSPARENT} from '../px';
import {text, textWidth} from '../font';
import {overlay, RH} from './setkit';

// ------------------------------------------------------------------ materials
defineMat('vs.wall', ['N0', 'N1', 'X0', 'X0', 'X1', 'X2', 'X3', 'P0'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N1', 'X1', 'X2', 'X3', 'P0', 'P1', 'P2', 'W9']);
defineMat('vs.carpet', ['N0', 'N0', 'R0', 'R0', 'R0', 'R1', 'R1', 'R2'], ['N0', 'R0', 'R0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'R0', 'R0', 'R1', 'R1', 'R2', 'U4', 'W4']);
defineMat('vs.gold', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'D0', 'C0', 'C1', 'C2', 'C3', 'C4', 'C6'], ['D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W6', 'W8']);
defineMat('vs.motif', ['N0', 'N0', 'D0', 'D1', 'D1', 'D2', 'D3', 'W3'], ['N0', 'D0', 'C0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5']);
defineMat('vs.drape', ['N0', 'R0', 'R0', 'R1', 'R1', 'U3', 'R2', 'R2'], ['N0', 'R0', 'R0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'R0', 'R1', 'R2', 'U4', 'W4', 'W5', 'W6']);
defineMat('vs.lacquer', ['N0', 'N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['N0', 'N1', 'G1', 'G2', 'G3', 'P0', 'P1', 'P2']);
defineMat('vs.steel', ['N0', 'N1', 'N2', 'N3', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C3', 'C5', 'C7', 'C9'], ['N1', 'G1', 'G3', 'G4', 'G5', 'G6', 'P2', 'W9']);
defineMat('vs.glass', ['N1', 'N2', 'N3', 'N4', 'G3', 'G4', 'G5', 'G6'], ['N1', 'C1', 'C2', 'C3', 'C4', 'C6', 'C8', 'C9'], ['N1', 'G2', 'G4', 'G5', 'G6', 'P1', 'P2', 'W9']);

// ------------------------------------------------------------------ geometry
export const SUITE = {
  W: 480, H: 203,
  CEIL_Y: 10,
  WALL_FLOOR_Y: 162,
  WINDOW: {x0: 16, y0: 14, x1: 362, y1: 158, horizon: 50},
  MULLIONS: [102, 188, 274],
  /** the street circuit's racing line: the crane truck's wheels sit on STREET_Y + 4 */
  STREET_Y: 132,
  /** MAS's desk (left third): its top plane from `top` (the cast sprite's MAS_DESK_EDGE row) to `front` */
  DESK: {x0: 44, x1: 212, top: 138, front: 150, base: 186},
  /** where MAS's desk sprite goes (top-left), so its desk edge (MAS_DESK_EDGE = 37) lands on DESK.top */
  MAS_AT: [106, 101] as [number, number],
  /** the laptop on his left, lid toward him (we see its back) · the phone · a clear spot for his glass */
  LAPTOP: {x: 86, y: 136},
  PHONE: {x: 180, y: 142},
  GLASS_AT: [166, 126] as [number, number],
  MINIBAR: {x0: 388, x1: 470, top: 124, base: 188},
  /** the four glasses on the minibar, left to right: they shiver in this order, 3 f apart */
  GLASSES: {flute: [400, 124], tumbler: [416, 124], bucket: [434, 124], vase: [456, 124]} as Record<'flute' | 'tumbler' | 'bucket' | 'vase', [number, number]>,
  /** feet line for anyone standing in the room (a room-service knock, a later episode) */
  FEET: 196,
};

export interface SuiteState {
  f: number;
  /** the crane truck's x (its front bumper) on the street circuit, or null (off screen). Move it in whole
   *  pixels on 2s (shotlist 24.01: 1 px / 2 f). */
  truckX?: number | null;
  /** the frame the rattle reaches the first glass (the truck passes under the window), or null. Each glass then
   *  alternates 2 held drawings (rest / 1 px over) on 2s for `shiverDur` frames, the next one 3 f later. */
  shiverT0?: number | null;
  shiverDur?: number;
  /** the phone on the desk lights up (sc 26: the suggested-replies strip is the post-ui kit's; see DESK_INSERT) */
  phoneLit?: boolean;
  /** the laptop glow (its screen faces MAS) 0..1 */
  laptop?: number;
  /** draw the empty desk chair (MAS's desk sprite brings its own; use this only when he is not there) */
  emptyChair?: boolean;
}
export const SUITE_DEFAULT: SuiteState = {f: 0, truckX: null, shiverT0: null, shiverDur: 24, phoneLit: false, laptop: 1};

/** the rattle offset of glass i (0 flute .. 3 vase): 2 held drawings on 2s, staggered 3 f */
export const glassShiver = (f: number, t0: number | null | undefined, i: number, dur = 24): [number, number] => {
  if (t0 == null) return [0, 0];
  const k = f - (t0 + i * 3);
  if (k < 0 || k >= dur) return [0, 0];
  return Math.floor(k / 2) % 2 ? [1, 0] : [0, 0];
};

// ------------------------------------------------------------------ the view (emissive)
const TOWERS: Array<[number, number, number, number]> = [
  // x, top, width, style (0 slab, 1 stepped, 2 cylinder, 3 twin)
  [22, 40, 26, 1], [54, 24, 28, 0], [92, 58, 18, 2], [150, 34, 24, 3], [296, 28, 30, 0], [334, 50, 24, 1],
];
const paintView = (mb: MatBuf, s: SuiteState) => {
  const Wn = SUITE.WINDOW, HZ = Wn.horizon, f = s.f;
  const BASE = 100; // the towers' feet, behind the grandstand
  // sky: a desert noon, blue at the top, hazing toward the horizon
  for (let y = Wn.y0; y <= Wn.y1; y++)
    for (let x = Wn.x0; x <= Wn.x1; x++) {
      const b = bayer(x, y);
      const t = (y - Wn.y0) / (HZ - Wn.y0);
      const c = t < 0.22 ? PAL.N8 : t < 0.42 ? (b < (t - 0.22) / 0.2 ? PAL.G5 : PAL.N8) : t < 0.66 ? PAL.G5 : t < 0.84 ? (b < (t - 0.66) / 0.18 ? PAL.G6 : PAL.G5) : b < (t - 0.84) * 5 ? PAL.P1 : PAL.G6;
      mb.emit(c)(x, y);
    }
  // the desert range, violet-grey in the haze, a nearer ridge darker
  for (let x = Wn.x0; x <= Wn.x1; x++) {
    const r1 = HZ - 5 - Math.round(4 * Math.sin(x * 0.021 + 0.5) + 3 * Math.sin(x * 0.067) + 2 * Math.sin(x * 0.17));
    for (let y = r1; y <= HZ + 4; y++) mb.emit(y === r1 ? PAL.G4 : PAL.X3)(x, y);
    const r2 = HZ + 2 - Math.round(3 * Math.sin(x * 0.034 + 2) + 2 * Math.sin(x * 0.11));
    for (let y = r2; y <= HZ + 8; y++) mb.emit(y === r2 ? PAL.X3 : PAL.X2)(x, y);
  }
  // the valley floor: the city, low and pale, to the towers' feet
  for (let y = HZ + 6; y <= BASE; y++) for (let x = Wn.x0; x <= Wn.x1; x++) mb.emit(bayer(x, y) < (y - HZ) / 60 ? PAL.P0 : PAL.G4)(x, y);
  for (let k = 0; k < 90; k++) {
    const x = Wn.x0 + Math.floor(hash(k, 1, 7) * (Wn.x1 - Wn.x0)), y = HZ + 8 + Math.floor(hash(k, 2, 7) * 36);
    rect(x, y, 2 + Math.floor(hash(k, 3, 7) * 5), 2, mb.emit(hash(k, 4, 7) < 0.5 ? PAL.P1 : PAL.G3));
  }
  // generic towers (sunlit faces cream, shaded faces blue-grey), window grids, rooftop crowns
  for (const [tx, top, tw, st] of TOWERS) {
    const lit = Math.round(tw * 0.62);
    for (let y = top; y < BASE; y++) {
      let x0 = tx, x1 = tx + tw;
      if (st === 1 && y < top + 12) { x0 += 5; x1 -= 5; }
      for (let x = x0; x < x1; x++) {
        if (x < Wn.x0 || x > Wn.x1) continue;
        if (st === 3 && y < top + 22 && Math.abs(x - (tx + tw / 2)) < 2) continue;
        const sun = x - x0 < lit;
        let c = st === 2 ? (x - x0 < tw * 0.35 ? PAL.G6 : x - x0 < tw * 0.7 ? PAL.P0 : PAL.G3) : sun ? PAL.P1 : PAL.G3;
        if ((y - top) % 4 === 2 && (x - x0) % 3 !== 0) c = sun ? PAL.P0 : PAL.G2;
        mb.emit(c)(x, y);
      }
    }
    rect(Math.max(Wn.x0, tx), top, tw, 1, mb.emit(PAL.P2));
    if (st === 0) { rect(tx + (tw >> 1), top - 10, 1, 10, mb.emit(PAL.G3)); mb.emit(Math.floor((f + tx) / 16) % 2 ? PAL.R3 : PAL.R1)(tx + (tw >> 1), top - 11); }
    if (st === 1) rect(tx + 5, top - 1, tw - 10, 1, mb.emit(PAL.W6));
  }
  // one blue glass tower that mirrors the sky (vertical bands, no window grid)
  for (let y = 36; y < BASE; y++) for (let x = 122; x < 140; x++) {
    const u = (x - 122) / 18;
    const c = u < 0.2 ? PAL.G6 : u < 0.55 ? (bayer(x, y) < 0.5 ? PAL.N8 : PAL.G5) : u < 0.8 ? PAL.N7 : PAL.N6;
    mb.emit(y % 7 === 0 ? stepColor(c, -1) : c)(x, y);
  }
  poly([122, 36, 140, 36, 131, 28], mb.emit(PAL.G6));
  // daytime neon (generic, logo-free): the marquee pylon with chasing bulbs and a neon star
  {
    const [px, py] = PYLON;
    rect(px + 6, py + 44, 3, BASE - py - 44, mb.emit(PAL.G2)); rect(px + 30, py + 44, 3, BASE - py - 44, mb.emit(PAL.G2));
    poly([px, py + 10, px + 20, py, px + 40, py + 10, px + 40, py + 44, px, py + 44], mb.emit(PAL.R1));
    poly([px + 3, py + 12, px + 20, py + 4, px + 37, py + 12, px + 37, py + 41, px + 3, py + 41], mb.emit(PAL.R2));
    const ch = Math.floor(f / 3);
    for (let k = 0; k < 16; k++) {
      const t = k / 16, bx = Math.round(px + 3 + t * 34);
      mb.emit((k + ch) % 3 === 0 ? PAL.W8 : PAL.W5)(bx, py + 41);
      mb.emit((k + ch) % 3 === 1 ? PAL.W8 : PAL.W5)(bx, py + 13 - Math.round((1 - Math.abs(t - 0.5) * 2) * 8));
    }
    // the reader board: rows of lamps, no words (it is just "the Strip")
    for (let r = 0; r < 3; r++) for (let x = px + 8; x < px + 33; x += 2) mb.emit(hash(x, r, Math.floor(f / 12)) < 0.55 ? PAL.W7 : PAL.R3)(x, py + 20 + r * 6);
    const on = Math.floor(f / 8) % 3 !== 2;
    for (const [i, j] of STAR) mb.emit(on ? (i === 0 && j === 0 ? PAL.W9 : PAL.W7) : PAL.W4)(px + 20 + i, py - 6 + j);
  }
  {
    // blade sign on the stepped tower: a vertical strip of red tubes lit even by day
    const bx = 36, by = 52;
    rect(bx, by, 8, 42, mb.emit(PAL.N2));
    for (let j = 0; j < 7; j++) { const c = (j + Math.floor(f / 3)) % 7 === 0 ? PAL.P2 : PAL.R3; rect(bx + 2, by + 3 + j * 5, 4, 3, mb.emit(c)); }
  }
  // ---- the closed street circuit below: grandstand, catch fence, barriers, kerbs, the racing surface ----
  for (let y = 100; y < 112; y++) for (let x = Wn.x0; x <= Wn.x1; x++) {
    const tier = (y - 100) % 3;
    let c = tier === 0 ? PAL.G5 : PAL.G3;
    if (tier !== 0 && hash(x, y, 3) < 0.45) c = [PAL.R2, PAL.W6, PAL.C5, PAL.P1, PAL.N6, PAL.L2][Math.floor(hash(x, y, 4) * 6)];
    mb.emit(c)(x, y);
  }
  rect(Wn.x0, 99, Wn.x1 - Wn.x0 + 1, 1, mb.emit(PAL.G6)); // the stand's roof edge
  for (let x = Wn.x0; x <= Wn.x1; x++) {
    if (x % 12 === 0) for (let y = 110; y < 118; y++) mb.emit(PAL.G2)(x, y);
    else if (x % 2 === 0) mb.emit(PAL.G4)(x, 113);
  }
  rect(Wn.x0, 116, Wn.x1 - Wn.x0 + 1, 4, mb.emit(PAL.P1)); // concrete barrier
  rect(Wn.x0, 119, Wn.x1 - Wn.x0 + 1, 1, mb.emit(PAL.G3));
  for (let y = 120; y < 140; y++) for (let x = Wn.x0; x <= Wn.x1; x++) mb.emit(bayer(x, y) < 0.35 ? PAL.G3 : PAL.G2)(x, y);
  for (let x = Wn.x0; x <= Wn.x1; x++) { const c = Math.floor((x - Wn.x0) / 5) % 2 ? PAL.R2 : PAL.P2; mb.emit(c)(x, 137); mb.emit(c)(x, 138); }
  rect(Wn.x0, 140, Wn.x1 - Wn.x0 + 1, 4, mb.emit(PAL.P0)); // near barrier
  rect(Wn.x0, 144, Wn.x1 - Wn.x0 + 1, Wn.y1 - 144 + 1, mb.emit(PAL.G4)); // the verge below
  for (let x = Wn.x0; x <= Wn.x1; x += 7) mb.emit(PAL.G3)(x, 150 + (x % 3));
  if (s.truckX != null) paintTruck(mb, Math.round(s.truckX), SUITE.STREET_Y + 4, f);
  // the glass: a faint diagonal sheen (the window is glass)
  for (let y = Wn.y0; y <= Wn.y1; y++) for (let x = Wn.x0; x <= Wn.x1; x++) {
    const u = (x - Wn.x0 + (y - Wn.y0) * 0.45) % 150;
    if (u > 60 && u < 66) { const i = mb.idx(x, y); if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], 1); }
  }
};
const PYLON: [number, number] = [210, 34];
const STAR = [[0, -4], [0, -3], [0, -2], [-1, -1], [1, -1], [-4, 0], [-3, 0], [-2, 0], [2, 0], [3, 0], [4, 0], [-1, 1], [1, 1], [0, 2], [0, 3], [0, 4], [0, -1], [0, 0], [0, 1], [-1, 0], [1, 0]];

/** The crane recovery truck, facing right, whole pixels: cab, flatbed, the boom folded back, an amber beacon.
 *  `fx` = its front bumper x, `wy` = the wheels' bottom row. It is clipped to the window. */
export const TRUCK_W = 46;
const paintTruck = (mb: MatBuf, fx: number, wy: number, f: number) => {
  const Wn = SUITE.WINDOW;
  const put = (x: number, y: number, c: number) => { if (x >= Wn.x0 && x <= Wn.x1 && y >= Wn.y0 && y <= Wn.y1) mb.emit(c)(x, y); };
  const box = (x: number, y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, c); };
  const x0 = fx - TRUCK_W;
  for (const wx of [x0 + 6, x0 + 14, x0 + 38]) { box(wx - 2, wy - 3, 5, 4, PAL.N0); put(wx, wy - 2, PAL.G3); }
  box(x0 + 1, wy - 6, TRUCK_W - 2, 3, PAL.N2);
  box(x0 + 1, wy - 9, 30, 3, PAL.W5);
  box(x0 + 1, wy - 9, 30, 1, PAL.W7);
  box(x0 + 32, wy - 16, 13, 10, PAL.P1);
  box(x0 + 32, wy - 16, 13, 1, PAL.P2);
  box(x0 + 38, wy - 14, 6, 4, PAL.C3);
  box(x0 + 32, wy - 9, 13, 2, PAL.W5);
  box(x0 + 28, wy - 20, 3, 11, PAL.W6);
  line(x0 + 29, wy - 20, x0 + 4, wy - 28, (x, y) => put(x, y, PAL.W6));
  line(x0 + 29, wy - 19, x0 + 4, wy - 27, (x, y) => put(x, y, PAL.W4));
  for (let y = wy - 27; y < wy - 16; y++) put(x0 + 5, y, PAL.N2);
  box(x0 + 4, wy - 16, 3, 2, PAL.N1);
  const on = f % 12 < 4; // amber beacon: 4 frames of 12, no strobe
  put(x0 + 38, wy - 17, on ? PAL.W8 : PAL.W4); put(x0 + 39, wy - 17, on ? PAL.W7 : PAL.W3);
};

// ------------------------------------------------------------------ BACK: shell, window, right wall, minibar
const paintBack = (mb: MatBuf, s: SuiteState) => {
  const f = s.f, Wn = SUITE.WINDOW, M = SUITE.MINIBAR;
  // ceiling with a cove (a warm strip hidden in the cove)
  rect(0, 0, 480, SUITE.CEIL_Y, mb.mat('vs.wall', -0.4));
  rect(0, SUITE.CEIL_Y - 3, 480, 1, mb.mat('vs.wall', 0.8));
  for (let x = 0; x < 480; x++) mb.emit(x % 3 ? PAL.W6 : PAL.W5)(x, SUITE.CEIL_Y - 2);
  rect(0, SUITE.CEIL_Y - 1, 480, 1, mb.mat('vs.wall', -1.4));
  rect(0, SUITE.CEIL_Y, 480, SUITE.WALL_FLOOR_Y - SUITE.CEIL_Y, mb.mat('vs.wall', 0));
  // right wall: a quilted leather panel (Vegas), gold rails, a small neon star-in-a-ring
  for (let y = 18; y < 112; y++) for (let x = 382; x < 478; x++) {
    const u = (x - 382 + (y - 18)) % 12, v = (x - 382 - (y - 18) + 1200) % 12;
    if (u === 0 || v === 0) mb.shade(-0.8)(x, y);
    else if (u === 6 && v === 6) mb.shade(0.8)(x, y);
  }
  rect(382, 17, 96, 1, mb.mat('vs.gold', 1)); rect(382, 112, 96, 1, mb.mat('vs.gold', 1));
  {
    const cx = 430, cy = 52;
    for (let a = 0; a < 360; a += 3) mb.emit(PAL.R3)(Math.round(cx + Math.cos((a * Math.PI) / 180) * 16), Math.round(cy + Math.sin((a * Math.PI) / 180) * 16));
    const pts: Array<[number, number]> = [];
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 4.5 : 11; pts.push([Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r)]); }
    for (let k = 0; k < 10; k++) line(pts[k][0], pts[k][1], pts[(k + 1) % 10][0], pts[(k + 1) % 10][1], mb.emit(Math.floor(f / 30) % 5 === 4 && k % 2 ? PAL.W6 : PAL.W8));
  }
  // ---- the window ----
  rect(Wn.x0 - 4, Wn.y0 - 4, Wn.x1 - Wn.x0 + 9, Wn.y1 - Wn.y0 + 9, mb.mat('vs.lacquer', 0.6));
  paintView(mb, s);
  for (const mx of SUITE.MULLIONS) { rect(mx, Wn.y0, 2, Wn.y1 - Wn.y0 + 1, mb.mat('vs.lacquer', -0.2)); rect(mx, Wn.y0, 1, Wn.y1 - Wn.y0 + 1, mb.shade(1.6)); }
  rect(Wn.x0 - 4, Wn.y1 + 1, Wn.x1 - Wn.x0 + 9, 3, mb.mat('vs.lacquer', 1.4));
  // drapes: heavy wine velvet gathered at each side of the glass, gold tiebacks
  const drape = (x0: number, x1: number, dir: 1 | -1) => {
    for (let y = SUITE.CEIL_Y; y < SUITE.WALL_FLOOR_Y + 3; y++) {
      const bulge = y > 70 && y < 86 ? -3 : 0;
      for (let x = x0; x <= x1; x++) {
        if (dir > 0 && x > x1 + bulge) continue;
        if (dir < 0 && x < x0 - bulge) continue;
        const fold = Math.sin((x + (y > 80 ? (y - 80) * 0.12 * dir : 0)) * 0.9);
        mb.mat('vs.drape', fold > 0.5 ? 1.2 : fold > -0.3 ? 0.3 : -0.8)(x, y);
      }
    }
    const tx = dir > 0 ? x1 - 4 : x0 + 1;
    rect(tx, 76, 4, 4, mb.mat('vs.gold', 1.6)); rect(tx, 76, 4, 1, mb.shade(1.6));
  };
  drape(0, 14, 1);
  drape(362, 380, -1);
  // floor: the Vegas carpet (burgundy, gold rings and diamonds), in mild perspective
  rect(0, SUITE.WALL_FLOOR_Y, 480, RH - SUITE.WALL_FLOOR_Y, mb.mat('vs.carpet', 0));
  rect(0, SUITE.WALL_FLOOR_Y - 5, 480, 5, mb.mat('vs.lacquer', 0.4));
  rect(0, SUITE.WALL_FLOOR_Y - 5, 480, 1, mb.shade(1.4));
  for (let y = SUITE.WALL_FLOOR_Y; y < RH; y++) {
    const t = (y - SUITE.WALL_FLOOR_Y) / 41, sc = 0.55 + t * 0.6;
    for (let x = 0; x < 480; x++) {
      const u = (x - 240) / sc + 240, v = (y - SUITE.WALL_FLOOR_Y) / sc;
      const cu = ((u % 28) + 28) % 28 - 14, cv = ((v % 14) + 14) % 14 - 7;
      const ring = Math.abs(Math.hypot(cu, cv * 2) - 9) < 1.1 / sc;
      const dia = Math.abs(cu) + Math.abs(cv * 2) < 3;
      if (ring || dia) mb.mat('vs.motif', ring ? 0 : 0.6)(x, y);
    }
  }
  // ---- the minibar (right): a lacquer cabinet, a gold-lipped top, the four glasses ----
  rect(M.x0, M.top, M.x1 - M.x0, M.base - M.top, mb.mat('vs.lacquer', 0.6));
  rect(M.x0, M.top, M.x1 - M.x0, 2, mb.mat('vs.gold', 1.4));
  rect(M.x0, M.top + 2, M.x1 - M.x0, 1, mb.shade(-1));
  rect(M.x0 + ((M.x1 - M.x0) >> 1), M.top + 6, 1, M.base - M.top - 10, mb.shade(-1.2));
  for (const hx of [M.x0 + 37, M.x0 + 45]) rect(hx, M.top + 18, 1, 10, mb.mat('vs.gold', 1.6));
  rect(M.x0 + 4, M.base - 4, M.x1 - M.x0 - 8, 4, mb.mat('vs.lacquer', -1));
  // a bottle behind the glasses (it never shivers: it is heavy)
  rect(444, M.top - 16, 5, 14, mb.mat('vs.glass', -0.6)); rect(445, M.top - 22, 3, 6, mb.mat('vs.glass', -0.6)); rect(445, M.top - 23, 3, 1, mb.mat('vs.gold', 1));
  const dur = s.shiverDur ?? 24;
  paintGlassware(mb, (i) => glassShiver(f, s.shiverT0, i, dur));
  // a floor lamp at the right edge, on (a warm drum shade)
  rect(472, 60, 1, 126, mb.mat('vs.gold', 0.4));
  poly([464, 48, 480, 48, 481, 62, 462, 62], mb.emit(PAL.W6));
  rect(464, 48, 17, 1, mb.emit(PAL.W8));
  rect(462, 62, 19, 1, mb.emit(PAL.W4));
  ellipse(472, 186, 6, 1.6, mb.mat('vs.gold', 0.8));
  if (s.emptyChair) paintChair(mb);
};

/** the desk chair, empty, its back to the window (the sitter faces camera-left) */
const paintChair = (mb: MatBuf) => {
  const cx = SUITE.MAS_AT[0] + 30, top = 104, bot = SUITE.DESK.top + 1;
  poly([cx - 11, bot, cx - 12, top + 6, cx - 8, top + 1, cx + 8, top, cx + 12, top + 5, cx + 11, bot], mb.mat('vs.lacquer', 0.4));
  line(cx - 8, top + 1, cx + 8, top, mb.shade(2.4));
  line(cx + 12, top + 5, cx + 11, bot, mb.shade(1.6));
  for (let y = top + 8; y < bot; y += 7) rect(cx - 9, y, 19, 1, mb.shade(-1));
};

/** the four shivering glasses; `sh(i)` gives glass i's offset (i: 0 flute, 1 tumbler, 2 bucket, 3 vase) */
const paintGlassware = (mb: MatBuf, sh: (i: number) => [number, number]) => {
  const G = SUITE.GLASSES;
  { const [dx, dy] = sh(0); const [x, y] = G.flute; // champagne flute
    rect(x - 2 + dx, y - 16 + dy, 5, 8, mb.mat('vs.glass', 0.4));
    rect(x - 1 + dx, y - 12 + dy, 3, 4, mb.mat('vs.gold', 1.2));
    rect(x - 2 + dx, y - 16 + dy, 1, 8, mb.mat('vs.glass', 2.6));
    rect(x + dx, y - 8 + dy, 1, 6, mb.mat('vs.glass', 1.4));
    rect(x - 2 + dx, y - 2 + dy, 5, 1, mb.mat('vs.glass', 1.4)); }
  { const [dx, dy] = sh(1); const [x, y] = G.tumbler; // tumbler, two cubes
    rect(x - 3 + dx, y - 8 + dy, 7, 7, mb.mat('vs.glass', 0.2));
    rect(x - 2 + dx, y - 5 + dy, 5, 3, mb.mat('vs.gold', 0.6));
    rect(x - 3 + dx, y - 8 + dy, 1, 7, mb.mat('vs.glass', 2.6));
    rect(x - 3 + dx, y - 2 + dy, 7, 1, mb.mat('vs.glass', 1.8));
    rect(x - 1 + dx, y - 6 + dy, 2, 2, mb.mat('vs.glass', 2.2)); }
  { const [dx, dy] = sh(2); const [x, y] = G.bucket; // a steel ice bucket, a bottle neck in it
    poly([x - 6 + dx, y - 10 + dy, x + 6 + dx, y - 10 + dy, x + 5 + dx, y - 1 + dy, x - 5 + dx, y - 1 + dy], mb.mat('vs.steel', 0.6));
    rect(x - 4 + dx, y - 11 + dy, 9, 1, mb.mat('vs.glass', 2));
    rect(x - 6 + dx, y - 10 + dy, 13, 1, mb.shade(1.8));
    rect(x - 5 + dx, y - 8 + dy, 1, 6, mb.shade(1.6));
    rect(x + 1 + dx, y - 18 + dy, 3, 8, mb.mat('plant', 0.6)); rect(x + 1 + dx, y - 19 + dy, 3, 1, mb.mat('vs.gold', 1.6)); }
  { const [dx, dy] = sh(3); const [x, y] = G.vase; // a slim glass vase, one red flower
    rect(x - 2 + dx, y - 12 + dy, 4, 11, mb.mat('vs.glass', 0.2));
    rect(x - 2 + dx, y - 12 + dy, 1, 11, mb.mat('vs.glass', 2.4));
    line(x + dx, y - 12 + dy, x + 1 + dx, y - 20 + dy, mb.mat('plant', 0.8));
    ellipse(x + 1.5 + dx, y - 22 + dy, 2.4, 2.2, mb.mat('red', 1.6));
    mb.mat('red', 2.6)(x + 1 + dx, y - 23 + dy); }
};

// ------------------------------------------------------------------ FRONT: desk, laptop, phone
const paintFront = (mb: MatBuf, s: SuiteState) => {
  const D = SUITE.DESK;
  rect(D.x0, D.top, D.x1 - D.x0 + 1, D.front - D.top, mb.mat('vs.lacquer', 0.8));
  rect(D.x0, D.top, D.x1 - D.x0 + 1, 1, mb.shade(-0.8));
  // the window reflected in the lacquer: a pale band
  for (let x = D.x0 + 3; x < D.x1 - 2; x++) for (let y = D.top + 3; y < D.top + 6; y++) if (bayer(x, y) < 0.6) mb.shade(2.2)(x, y);
  rect(D.x0 - 1, D.front, D.x1 - D.x0 + 3, 2, mb.mat('vs.lacquer', 2));
  rect(D.x0 - 1, D.front + 2, D.x1 - D.x0 + 3, 5, mb.mat('vs.lacquer', -0.2));
  for (const lx of [D.x0 + 8, D.x1 - 10]) { rect(lx, D.front + 7, 3, D.base - D.front - 7, mb.mat('vs.gold', 0.8)); rect(lx, D.front + 7, 1, D.base - D.front - 7, mb.shade(1.4)); }
  rect(D.x0 + 12, D.base, D.x1 - D.x0 - 22, 1, mb.shade(-1.4));
  // the laptop on MAS's left, lid toward him: we see the lid's back (no logo) and the glow at its edge
  { const {x, y} = SUITE.LAPTOP;
    poly([x - 16, y + 4, x + 10, y + 2, x + 16, y + 6, x - 10, y + 8], mb.mat('metal', 0.4));
    poly([x - 12, y + 4, x - 8, y - 18, x + 8, y - 20, x + 10, y + 2], mb.mat('metal', -0.2));
    line(x - 8, y - 18, x + 8, y - 20, mb.shade(1.6));
    line(x + 8, y - 20, x + 10, y + 2, mb.emit(PAL.C6));
    line(x + 9, y - 19, x + 11, y + 2, mb.emit(PAL.C3)); }
  // the phone, face up
  { const {x, y} = SUITE.PHONE;
    poly([x, y, x + 10, y - 1, x + 11, y + 2, x + 1, y + 3], mb.mat('black', 0.8));
    if (s.phoneLit) { poly([x + 1, y, x + 9, y - 1, x + 10, y + 1, x + 2, y + 2], mb.emit(PAL.C7)); mb.emit(PAL.C9)(x + 3, y); } }
};

// ------------------------------------------------------------------ lights
const suiteLights = (s: SuiteState): Lights => {
  const lap = s.laptop ?? 1;
  const Wn = SUITE.WINDOW;
  return {
    amb: (x, y) => {
      let a = 2.6;
      if (y >= SUITE.WALL_FLOOR_Y) a -= (y - SUITE.WALL_FLOOR_Y) / 30;
      const vx = (x - 240) / 240, vy = (y - 101) / 112;
      a -= Math.max(0, vx * vx + vy * vy - 0.5) * 1.8;
      return a;
    },
    cyan: (x, y) => {
      const {x: lx, y: ly} = SUITE.LAPTOP;
      const d = Math.hypot((x - lx - 20) / 40, (y - ly + 6) / 30);
      let L = d < 1 ? (1 - d) * 0.8 * lap : 0;
      if (s.phoneLit) { const q = Math.hypot((x - SUITE.PHONE.x - 5) / 14, (y - SUITE.PHONE.y) / 8); if (q < 1) L = Math.max(L, (1 - q) * 0.8); }
      return L;
    },
    warm: (x, y) => {
      let L = 0;
      // sunlight: a patch on the floor inside the glass (mullion shadows), the drapes' inner faces
      if (y >= SUITE.WALL_FLOOR_Y) {
        const t = (y - SUITE.WALL_FLOOR_Y) / 22;
        const xl = Wn.x0 + 10 - t * 20, xr = Wn.x1 - 10 + t * 6;
        if (t < 1 && x > xl && x < xr) { const m = (x - SUITE.MULLIONS[0] - Math.round(t * 14) + 860) % 86; L = (m < 3 ? 0.2 : 0.6) * (1 - t * 0.85); }
      }
      if (y < SUITE.WALL_FLOOR_Y && ((x >= 0 && x < 16) || (x > 360 && x < 368))) L = Math.max(L, 0.55);
      // the minibar top and the quilted wall catch the window
      if (y > 90 && y < 136 && x > 380) { const d = Math.hypot((x - 380) / 90, (y - 124) / 34); if (d < 1) L = Math.max(L, (1 - d) * 0.8); }
      // the floor lamp's pool
      { const d = Math.hypot((x - 472) / 50, (y - 96) / 80); if (d < 1) L = Math.max(L, (1 - d) * 0.6); }
      // the desk top rimmed by the window behind it
      if (y >= SUITE.DESK.top && y < SUITE.DESK.top + 3 && x > SUITE.DESK.x0 && x < SUITE.DESK.x1 && Math.abs(x - SUITE.LAPTOP.x) > 20) L = Math.max(L, 0.7);
      return L;
    },
    dither: 0.55,
  };
};

// ------------------------------------------------------------------ public API
export interface SuiteLayers { back: Buf; front: Buf; }
export const suiteLayers = (st: Partial<SuiteState> & {f: number}): SuiteLayers => {
  const s: SuiteState = {...SUITE_DEFAULT, ...st};
  const back = new MatBuf(480, RH), front = new MatBuf(480, RH);
  paintBack(back, s);
  paintFront(front, s);
  const L = suiteLights(s);
  const b = new Buf(480, RH, PAL.N0); resolve(back, L, b, 0);
  const fr = new Buf(480, RH, TRANSPARENT); resolve(front, L, fr, 0);
  return {back: b, front: fr};
};

/** Composite the suite; `mas` gets (b, front) so it can call drawMasDesk(b, x, y, pose, () => front(b)). */
export const drawSuite = (b: Buf, st: Partial<SuiteState> & {f: number}, cast: {
  mas?: (b: Buf, front: (b: Buf) => void) => void;
  room?: (b: Buf) => void;
} = {}, shake: [number, number] = [0, 0]) => {
  const L = suiteLayers(st);
  const [dx, dy] = shake;
  overlay(b, L.back, dx, dy);
  let frontDone = false;
  const front = (bb: Buf) => { if (!frontDone) { overlay(bb, L.front, dx, dy); frontDone = true; } };
  cast.mas?.(b, front);
  front(b);
  cast.room?.(b);
};

// ------------------------------------------------------------------ MAS's call tile, DAY (sc 26.01 / 26.05)
/** The view behind him, cropped from this suite's own window so the tile and the wide agree (native pixels, no
 *  scaling). Centre (cx, cy) defaults to the marquee pylon. Paints only inside the rect. */
export const suiteTileBg = (b: Buf, x: number, y: number, w: number, h: number, f: number, cx = 230, cy = 66) => {
  const L = suiteLayers({f});
  const sx0 = clamp(Math.round(cx - w / 2), 0, 480 - w), sy0 = clamp(Math.round(cy - h / 2), 0, RH - h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, L.back.c[(sy0 + j) * 480 + sx0 + i]);
};

// ------------------------------------------------------------------ MAS's portrait background (sc 26.07)
/** Inside his 112x136 dialogue window: the suite behind him at PORTRAIT scale (authored, not enlarged): the glass
 *  with the desert haze, one sunlit tower, the red marquee board with its chasing bulbs, the grandstand band, a
 *  mullion and the drape's edge. Paint it first, then the portrait figure (the cast owns the figure and its light). */
export const suitePortraitBg = (b: Buf, x: number, y: number, f: number, w = 112, h = 136) => {
  const put = (i: number, j: number, c: number) => { if (i >= 0 && j >= 0 && i < w && j < h) b.set(x + i, y + j, c); };
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const bz = bayer(i, j);
    let c = j < 22 ? PAL.N8 : j < 40 ? (bz < (j - 22) / 18 ? PAL.G5 : PAL.N8) : j < 58 ? PAL.G5 : bz < (j - 58) / 12 ? PAL.G6 : PAL.G5;
    if (j >= 64 && j < 76) c = j - 64 < 2 + Math.round(2 * Math.sin(i * 0.09)) ? PAL.G4 : PAL.X3; // the range
    if (j >= 76 && j < 98) c = bz < (j - 76) / 30 ? PAL.P0 : PAL.G4; // the city floor
    if (j >= 98 && j < 116) { const tier = (j - 98) % 4; c = tier === 0 ? PAL.G5 : hash(i, j, 3) < 0.45 ? [PAL.R2, PAL.W6, PAL.C5, PAL.P1, PAL.N6][Math.floor(hash(i, j, 4) * 5)] : PAL.G3; }
    if (j >= 116) c = j < 120 ? PAL.P1 : j < 130 ? (bz < 0.35 ? PAL.G3 : PAL.G2) : Math.floor(i / 7) % 2 ? PAL.R2 : PAL.P2;
    put(i, j, c);
  }
  // a sunlit tower (right), window grid at portrait scale
  for (let j = 14; j < 98; j++) for (let i = 70; i < 104; i++) {
    const sun = i < 92;
    let c = sun ? PAL.P1 : PAL.G3;
    if ((j - 14) % 7 >= 5 && (i - 70) % 5 !== 0) c = sun ? PAL.P0 : PAL.G2;
    put(i, j, c);
  }
  for (let i = 70; i < 104; i++) put(i, 14, PAL.P2);
  // the marquee board (left of centre), big bulbs chasing on 3s
  const bx = 8, by = 30, bw = 46, bh = 44;
  for (let j = by; j < by + bh; j++) for (let i = bx; i < bx + bw; i++) put(i, j, i < bx + 2 || i > bx + bw - 3 || j < by + 2 ? PAL.R1 : PAL.R2);
  const ch = Math.floor(f / 3);
  for (let k = 0; k < 11; k++) { const on = (k + ch) % 3 === 0; const c = on ? PAL.W8 : PAL.W5; put(bx + 3 + k * 4, by + bh - 4, c); put(bx + 4 + k * 4, by + bh - 4, c); put(bx + 3 + k * 4, by + 3, (k + ch) % 3 === 1 ? PAL.W8 : PAL.W5); }
  for (let r = 0; r < 3; r++) for (let i = bx + 7; i < bx + bw - 7; i += 3) put(i, by + 13 + r * 8, hash(i, r, Math.floor(f / 12)) < 0.55 ? PAL.W7 : PAL.R3);
  for (let j = by + bh; j < 98; j++) { put(bx + 10, j, PAL.G2); put(bx + 11, j, PAL.G2); put(bx + 34, j, PAL.G2); put(bx + 35, j, PAL.G2); }
  // the star on top (slow)
  const on = Math.floor(f / 8) % 3 !== 2;
  for (const [i, j] of STAR) put(bx + 23 + i * 2, by - 10 + j * 2, on ? PAL.W7 : PAL.W4);
  // a mullion and the drape's edge (window-left, where his portrait sits on the frame's left)
  for (let j = 0; j < h; j++) { put(62, j, PAL.N2); put(63, j, PAL.G3); for (let i = 0; i < 6; i++) put(i, j, Math.sin((i + j * 0.1) * 1.1) > 0.3 ? PAL.R1 : PAL.R0); }
};

// ------------------------------------------------------------------ INSERT: the laptop screen (sc 24.02 / 25.08 / 26.06)
/** A close insert on the laptop (room-area, 480x203). screen: 'join' (the call app: BOARD · VIDEO CALL, a
 *  five-tile preview and JOIN, the cursor on it) · 'gone' (the call has ended; the live-mic icon still lit when
 *  `mic`) · or a custom painter. `pressed` = JOIN's pressed drawing (1 frame, 1 px). */
export const LAPTOP_INSERT = {screen: {x0: 76, y0: 20, x1: 403, y1: 162}, join: {x: 196, y: 128, w: 88, h: 24}, mic: {x: 380, y: 23}};
export const drawLaptopInsert = (b: Buf, st: {f: number; cursor?: [number, number] | null; pressed?: boolean; screen?: 'join' | 'gone' | ((b: Buf) => void); mic?: boolean}) => {
  const f = st.f;
  const S = LAPTOP_INSERT.screen;
  // behind the laptop: the suite's quilted wall (left) and a sliver of the bright window (right) with the
  // marquee's red and a chasing bulb row, so the insert still lives in the room
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (x < 436) { const u = (x + y) % 16, v = (x - y + 1600) % 16; c = u === 0 || v === 0 ? PAL.X0 : u === 8 && v === 8 ? PAL.X2 : PAL.X1; }
    else c = y < 90 ? (bayer(x, y) < (y / 90) ? PAL.G6 : PAL.N8) : y < 150 ? PAL.P1 : PAL.G4;
    b.set(x, y, c);
  }
  rect(436, 0, 3, RH, (x, y) => b.set(x, y, PAL.R1));
  for (let y = 40; y < 118; y++) for (let x = 452; x < 480; x++) b.set(x, y, PAL.R2);
  for (let x = 454; x < 480; x += 3) b.set(x, 114, (x / 3 + Math.floor(f / 3)) % 3 === 0 ? PAL.W8 : PAL.W5);
  // lid + bezel (dark aluminium), the screen
  poly([56, 4, 424, 1, 428, 176, 52, 180], (x, y) => b.set(x, y, PAL.G1));
  line(56, 4, 424, 1, (x, y) => b.set(x, y, PAL.G4));
  poly([64, 10, 416, 7, 420, 170, 60, 174], (x, y) => b.set(x, y, PAL.N0));
  const scr = st.screen ?? 'join';
  if (typeof scr === 'function') scr(b);
  else {
    for (let y = S.y0; y <= S.y1; y++) for (let x = S.x0; x <= S.x1; x++) b.set(x, y, y < S.y0 + 14 ? PAL.N3 : PAL.N1);
    text(b, 'BOARD · VIDEO CALL', S.x0 + 10, S.y0 + 4, PAL.G5);
    const cx = (S.x0 + S.x1) >> 1;
    if (scr === 'join') {
      rect(cx - 90, S.y0 + 26, 180, 76, (x, y) => b.set(x, y, PAL.N2));
      rect(cx - 90, S.y0 + 26, 180, 1, (x, y) => b.set(x, y, PAL.N4));
      // the pre-join preview: five tiles (three over two), the last one black (camera off)
      for (let k = 0; k < 5; k++) {
        const gx = k < 3 ? cx - 84 + k * 58 : cx - 55 + (k - 3) * 58, gy = k < 3 ? S.y0 + 32 : S.y0 + 68;
        rect(gx, gy, 52, 30, (x, y) => b.set(x, y, k === 4 ? PAL.N0 : PAL.N3));
        if (k < 4) { ellipse(gx + 26, gy + 12, 6, 6, (x, y) => b.set(x, y, PAL.N5)); ellipse(gx + 26, gy + 28, 12, 6, (x, y) => b.set(x, y, PAL.N5)); }
        else ellipse(gx + 26, gy + 14, 5, 5, (x, y) => b.set(x, y, PAL.G1));
      }
      const J = LAPTOP_INSERT.join;
      const hot = !!st.cursor && st.cursor[0] >= J.x && st.cursor[0] < J.x + J.w && st.cursor[1] >= J.y && st.cursor[1] < J.y + J.h;
      const dy = st.pressed ? 1 : 0;
      rect(J.x, J.y + dy, J.w, J.h, (x, y) => b.set(x, y, st.pressed ? PAL.C3 : hot ? PAL.C5 : PAL.C4));
      rect(J.x, J.y + dy, J.w, 1, (x, y) => b.set(x, y, st.pressed ? PAL.C2 : PAL.C7));
      text(b, 'JOIN', J.x + ((J.w - textWidth('JOIN')) >> 1), J.y + 8 + dy, st.pressed ? PAL.C8 : PAL.N0);
    } else {
      // the call has ended: an empty grey panel where the grid was (the app never says why)
      rect(cx - 90, S.y0 + 30, 180, 90, (x, y) => b.set(x, y, bayer(x, y) < 0.5 ? PAL.N2 : PAL.N1));
      rect(cx - 30, S.y0 + 70, 60, 2, (x, y) => b.set(x, y, PAL.N4));
    }
    // the live-mic icon in the title bar: a capsule on a stand, lit red while the mic is hot
    if (st.mic) {
      const {x: mx, y: my} = LAPTOP_INSERT.mic;
      rect(mx - 2, my, 4, 5, (x, y) => b.set(x, y, PAL.R3));
      rect(mx - 3, my + 4, 6, 1, (x, y) => b.set(x, y, PAL.R2));
      rect(mx, my + 5, 1, 2, (x, y) => b.set(x, y, PAL.R2));
      rect(mx - 2, my + 7, 4, 1, (x, y) => b.set(x, y, PAL.R2));
      b.set(mx - 1, my + 1, PAL.P2);
    }
  }
  // the window's glare on the glass (a pale diagonal band, whole pixels)
  for (let y = 10; y < 172; y++) for (let x = 64; x < 418; x++) { const u = x + y * 0.7; if (u > 318 && u < 332 && bayer(x, y) < 0.35) b.set(x, y, stepColor(b.c[y * 480 + x], 1)); }
  // keyboard deck at the bottom edge
  poly([20, 184, 460, 181, 480, RH, 0, RH], (x, y) => b.set(x, y, PAL.G2));
  for (let x = 40; x < 440; x += 10) rect(x, 189 + ((x / 10) % 2), 8, 4, (xx, yy) => b.set(xx, yy, PAL.G1));
  if (st.cursor) {
    const [cx, cy] = st.cursor;
    const ARROW = ['#.......', '##......', '#o#.....', '#oo#....', '#ooo#...', '#oooo#..', '#ooooo#.', '#ooo####', '#o#o#...', '##.#o#..', '#..#o#..', '....##..'];
    ARROW.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') b.set(cx + i, cy + j, PAL.N0); else if (ch === 'o') b.set(cx + i, cy + j, PAL.P2); }));
  }
};

// ------------------------------------------------------------------ INSERT: the desk (sc 26.06)
/** Close on the desk: the phone face-up (its screen = DESK_INSERT.phoneScreen, for the suggested-replies strip,
 *  which the post-ui kit paints), the laptop's corner at the left with the live-mic icon still lit (`mic`), the
 *  lacquer holding the window's reflection, and the edge of his glass at the right (it does not move). */
export const DESK_INSERT = {phoneScreen: {x0: 206, y0: 70, x1: 318, y1: 164}, mic: {x: 96, y: 56}, glass: {x: 404, y: 40}};
export const drawDeskInsert = (b: Buf, st: {f: number; phoneLit?: boolean; mic?: boolean}) => {
  const mb = new MatBuf(480, RH);
  // the lacquer desk top fills the frame; the window's reflection lies in it as long pale bands
  rect(0, 0, 480, RH, mb.mat('vs.lacquer', 1));
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const u = (x * 0.35 + y) % 60;
    if (u < 10 && bayer(x, y) < 0.55 - u / 24) mb.shade(2)(x, y);
    if (hash(x >> 3, y, 5) < 0.02) mb.shade(-0.6)(x, y);
  }
  // the laptop's corner (upper left): base + the bottom of its lit screen with the mic icon
  poly([0, 90, 170, 76, 176, 92, 0, 110], mb.mat('metal', 1.4));
  line(0, 90, 170, 76, mb.shade(2));
  poly([0, 0, 160, 0, 170, 76, 0, 90], mb.mat('metal', 0.2));
  poly([0, 0, 150, 0, 158, 68, 0, 80], mb.emit(PAL.N1));
  for (let x = 0; x < 150; x++) for (let y = 0; y < 12; y++) mb.emit(PAL.N3)(x, y);
  if (st.mic ?? true) {
    const {x: mx, y: my} = DESK_INSERT.mic;
    rect(mx - 3, my, 6, 9, mb.emit(PAL.R3));
    rect(mx - 5, my + 7, 10, 2, mb.emit(PAL.R2));
    rect(mx, my + 9, 1, 3, mb.emit(PAL.R2));
    rect(mx - 3, my + 12, 7, 1, mb.emit(PAL.R2));
    mb.emit(PAL.P2)(mx - 2, my + 1); mb.emit(PAL.P2)(mx - 2, my + 2);
  }
  // the phone, face up, big
  const P = DESK_INSERT.phoneScreen;
  poly([P.x0 - 8, P.y0 - 10, P.x1 + 8, P.y0 - 12, P.x1 + 10, P.y1 + 10, P.x0 - 6, P.y1 + 12], mb.mat('black', 0.6));
  line(P.x0 - 8, P.y0 - 10, P.x1 + 8, P.y0 - 12, mb.shade(2.4));
  line(P.x1 + 8, P.y0 - 12, P.x1 + 10, P.y1 + 10, mb.shade(1.4));
  for (let y = P.y0; y <= P.y1; y++) for (let x = P.x0; x <= P.x1; x++) mb.emit(st.phoneLit ? (y < P.y0 + 10 ? PAL.C4 : PAL.C2) : PAL.N0)(x, y);
  // its shadow on the lacquer
  for (let y = P.y1 + 12; y < P.y1 + 16; y++) for (let x = P.x0 - 4; x < P.x1 + 12; x++) mb.shade(-1.6)(x, y);
  // the edge of his glass at the right: heavy base, one flat water row
  // (a heavy tumbler seen a little from above, cropped by the frame: the rim is an ellipse, the water ONE flat row)
  const G = DESK_INSERT.glass, gcx = G.x + 44, grx = 44, gry = 8;
  for (let y = G.y - gry; y < RH; y++) for (let x = G.x; x < 480; x++) {
    const u = (x + 0.5 - gcx) / grx;
    if (Math.abs(u) > 1) continue;
    const e = gry * Math.sqrt(1 - u * u);
    if (y < G.y - e) continue;
    const rim = Math.abs(y - (G.y - e)) < 1 || Math.abs(y - (G.y + e)) < 1;
    const waterY = G.y + 34;
    if (rim) mb.mat('vs.glass', 3)(x, y);
    else if (x < G.x + 3) mb.mat('vs.glass', 2.6)(x, y);
    else if (y === waterY) mb.mat('vs.glass', 3.4)(x, y);
    else if (y > waterY) mb.mat('vs.glass', 0.6 + (x < G.x + 12 ? 1 : 0))(x, y);
    else if (y > G.y + e) mb.shade(0.8)(x, y);
  }
  resolve(mb, {
    amb: (x, y) => 2.8 - Math.max(0, ((x - 240) / 240) ** 2 + ((y - 101) / 112) ** 2 - 0.5) * 1.6,
    cyan: (x, y) => { const d = Math.hypot((x - 60) / 220, (y - 30) / 120); let L = d < 1 ? (1 - d) * 0.7 : 0; if (st.phoneLit) { const q = Math.hypot((x - 262) / 120, (y - 117) / 90); if (q < 1) L = Math.max(L, (1 - q) * 0.8); } return L; },
    warm: (x, y) => clamp(1 - Math.hypot((x - 420) / 200, (y + 20) / 140), 0, 1) * 0.6,
    dither: 0.5,
  }, b, 0);
};
