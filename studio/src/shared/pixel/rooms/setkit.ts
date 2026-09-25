// MR. MAS — shared rooms: SET KIT (rooms A: boardroom, lobby, vegas suite; reusable by any room builder).
// A room is painted as (material, level) into TWO MatBufs:
//   BACK  = everything behind the cast (walls, windows, chairs they sit in)
//   FRONT = everything in front of the cast (table tops, counters, near furniture, props on the table)
// Both resolve with the SAME Lights, so a figure sandwiched between them sits in one continuous light.
// FRONT resolves into a TRANSPARENT-filled Buf: only painted pixels exist, so it overlays cleanly.
//
// Draw order for a shot:  back -> cast body (their BACK part) -> front -> cast hands/props (their FRONT part).
import {Buf, W, H, TRANSPARENT, clamp, hash} from '../px';
import {MatBuf, Lights, resolve} from '../light';
import {PAL} from '../palette';

/** THE ROOM CONTRACT (shotlist act4): a room plate is 480 x 203; rows 203-269 are the rail band (kits: cards + rail).
 *  Inserts are room-area too (the rail persists across cuts). Only BLUEPRINT and full-screen cards use 270. */
export const RW = 480, RH = 203, RAIL_Y = 203;
/** preview-only placeholder for the rail band (the real rail belongs to the rail builder) */
export const railPlaceholder = (b: Buf) => {
  for (let y = RAIL_Y; y < b.h; y++) for (let x = 0; x < b.w; x++) b.c[y * b.w + x] = y === RAIL_Y ? PAL.N2 : PAL.N0;
};

export interface RoomLayers { back: Buf; front: Buf; }

/** Resolve a BACK and a FRONT MatBuf with one set of lights. */
export const resolveLayers = (back: MatBuf, front: MatBuf, L: Lights, bg = PAL.N0): RoomLayers => {
  const b = new Buf(back.w, back.h, bg);
  resolve(back, L, b, 0);
  const f = new Buf(front.w, front.h, TRANSPARENT);
  resolve(front, L, f, 0);
  return {back: b, front: f};
};

/** Copy every non-TRANSPARENT pixel of src onto dst, offset by an integer shake (dx, dy). */
export const overlay = (dst: Buf, src: Buf, dx = 0, dy = 0) => {
  for (let y = 0; y < src.h; y++)
    for (let x = 0; x < src.w; x++) {
      const c = src.c[y * src.w + x];
      if (c === TRANSPARENT) continue;
      dst.set(x + dx, y + dy, c);
    }
};

/** Copy a whole opaque layer with an integer offset; pixels shaken in from outside take the nearest edge. */
export const copyShaken = (dst: Buf, src: Buf, dx = 0, dy = 0) => {
  for (let y = 0; y < dst.h; y++)
    for (let x = 0; x < dst.w; x++) dst.c[y * dst.w + x] = src.c[clamp(y - dy, 0, src.h - 1) * src.w + clamp(x - dx, 0, src.w - 1)];
};

// ------------------------------------------------------------------ shiver (glasses rattling as a truck passes)
/** 1-px rattle for small props: an integer offset per frame, phase-shifted per object so they never move in sync.
 *  Active for `dur` frames from t0; held on 1s (a rattle is the one motion that reads on 1s). */
export const shiverAt = (f: number, t0: number, dur = 18, seed = 0): [number, number] => {
  const k = f - t0;
  if (k < 0 || k >= dur) return [0, 0];
  const SEQ: Array<[number, number]> = [[1, 0], [0, 0], [-1, 0], [0, -1], [1, 0], [-1, 0], [0, 0], [1, -1], [0, 0], [-1, 0]];
  const [dx, dy] = SEQ[(k + seed * 3) % SEQ.length];
  // the tail settles: last third only jitters every other frame
  if (k > dur * 0.66 && k % 2) return [0, 0];
  return [dx, dy];
};

// ------------------------------------------------------------------ cartoon fire (sc 30): 3 drawings on 2s (shotlist 30.09)
// Small, flat, friendly: a teardrop of tongues with a hot core. Emissive (a fire lights itself); the room's
// warm light function adds its glow pool. Colours: r outer (R2), R hot red (R3), o orange (W5), O (W6),
// y yellow (W7), Y core (W8). Authored 11 x 14, bottom row sits ON the surface.
const FIRE_A = [
  '.....R.....',
  '.....RR....',
  '....RRo....',
  '....Roo..R.',
  '...RROoR.R.',
  '...RoOOoRR.',
  '..RRoOyOoR.',
  '..RoOyyOoR.',
  '.RRoOyYyOR.',
  '.RoOyYYyOoR',
  '.RoOyYYYyOR',
  '..RoyYYYyR.',
  '..rRoooooR.',
  '...rrRRRr..',
];
const FIRE_B = [
  '......R....',
  '.....RR....',
  '.R...Ro....',
  '.RR.RoR....',
  '..RRoOoR...',
  '..RoOOoRR..',
  '.RRoOyOoR..',
  '.RoOyyyOoR.',
  '.RoOyYyyOR.',
  'RRoOyYYyOoR',
  'RoOyYYYyyOR',
  '.RoyYYYYyR.',
  '.rRooooooR.',
  '..rrRRRRr..',
];
const FIRE_C = [
  '....R......',
  '....RR.....',
  '....oRR..R.',
  '...RooR.RR.',
  '...RoOoRR..',
  '..RRoOOoR..',
  '..RoOyOOoR.',
  '.RRoOyyOoR.',
  '.RoOyYyyOR.',
  '.RoOyYYyOoR',
  'RRoOyYYYyOR',
  '.RoyYYYYyR.',
  '.rRooooooR.',
  '..rrRRRRr..',
];
const FIRE_PAL: Record<string, number> = {r: PAL.R1, R: PAL.R3, o: PAL.W5, O: PAL.W6, y: PAL.W7, Y: PAL.W8};
export const FIRE_W = 11, FIRE_H = 14;
/** Draw a cartoon fire with its base centre at (cx, by). `f` picks the drawing (3 drawings held `hold` frames each,
 *  default 2s; `phase` staggers neighbouring fires so they never flicker in sync). */
export const drawFire = (plot: (x: number, y: number, c: number) => void, cx: number, by: number, f: number, phase = 0, small = false, hold = 2) => {
  const d = [FIRE_A, FIRE_B, FIRE_C][Math.floor((f + phase * hold) / hold) % 3];
  const rows = small ? d.slice(4) : d;
  const x0 = cx - 5, y0 = by - rows.length + 1;
  rows.forEach((r, j) => [...r].forEach((ch, i) => { const c = FIRE_PAL[ch]; if (c !== undefined) plot(x0 + i, y0 + j, c); }));
};

/** A puff of grey smoke after a fire goes out: k = frames since it went out (0..23), drifting up in held steps. */
export const drawSmoke = (plot: (x: number, y: number, c: number) => void, cx: number, by: number, k: number) => {
  if (k < 0 || k > 23) return;
  const st = Math.floor(k / 4); // held on 4s
  const puffs: Array<[number, number, number]> = [[0, -3, 3], [-2, -7, 2], [2, -10, 2], [0, -13, 1]];
  puffs.forEach(([dx, dy, r], i) => {
    if (i > st) return;
    const yy = by + dy - st * 2, rr = Math.max(1, r - Math.max(0, st - 3));
    const col = st > 4 ? PAL.G2 : st > 2 ? PAL.G3 : PAL.G4;
    for (let y = -rr; y <= rr; y++) for (let x = -rr; x <= rr; x++) if (x * x + y * y <= rr * rr + 0.5) plot(cx + dx + x, yy + y, col);
  });
};

/** Flicker of a fire's light (0.85..1.0), stepped with its drawing so light and shape change on the same frame. */
export const fireFlicker = (f: number, phase = 0, hold = 2) => [1, 0.88, 0.95][Math.floor((f + phase * hold) / hold) % 3];

// ------------------------------------------------------------------ small helpers
/** Pixel-exact 3/4 "tent card" / plate text helper that clips to a box. */
export const clipPlot = (b: Buf, x0: number, y0: number, w: number, h: number) => (x: number, y: number, c: number) => {
  if (x >= x0 && y >= y0 && x < x0 + w && y < y0 + h) b.set(x, y, c);
};

/** Deterministic 0..1 per integer id (for staggering phases). */
export const rnd = (i: number, salt = 0) => hash(i, 77, salt);

export {W, H, TRANSPARENT};
