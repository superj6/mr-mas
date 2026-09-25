// MR. MAS — shared room: NOPEAI BOARDROOM — NIGHT. (rooms A · first used Ep1 Act Four, sc 27 / 30 / 31)
// A 480x203 room plate (rows 203-269 are the rail band: not ours), frontal and slightly elevated, the long table running across the frame (the Woodrose
// staging, one floor up): five seats on the far side facing camera, a seat at each end turned in. The CEO
// chair is the far-side centre seat (C). MADA's chair is the RIGHT end (R): bolted to the floor, no casters,
// and there is no fire slot for it (it never burns). The dark window (left) is where ALYI lives, as a
// reflection; beyond it the Valley at night and the giant speed-dial wheel (egg). The frosted-glass entry
// door (right) rhymes with the TPOOL door of F1.2.
//
// Light (the show's language): key = the linear LED pendant over the table (monitor cyan family), rim/back =
// the hallway tungsten through the frosted door, ambient = night. Fires (sc 30), the spotlight (sc 27) and
// the open door add tungsten pools. The MACROSOFT slate step swaps the wall material (one palette step).
//
// LAYERS (draw order):  far  -> [figures standing at the back wall: TASYA in his door, TERB entering]
//                       mid  -> [seated figures' BODY: the cast "table" sprites, TABLE_EDGE on BR.TABLE.far.y]
//                       front-> [seated figures' HANDS / props on the table]
//                       fore -> (near chairs; anyone walking the near side goes BEFORE fore)
import {Buf, rect, line, poly, ellipse, bayer, clamp, hash} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {MatBuf, Lights, defineMat, resolve} from '../light';
import {TRANSPARENT} from '../px';
import type {Img} from '../figure';
import {micro, microWidth} from '../cast/bosses';
import {bigText, bigTextWidth, text, textWidth} from '../font';
import {drawFire, drawSmoke, fireFlicker, overlay, RH} from './setkit';

// ------------------------------------------------------------------ materials (first definition wins; prefixed)
defineMat('br.slate', ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'G0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'G0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('br.carpet', ['N0', 'N1', 'N1', 'N2', 'U0', 'U0', 'U1', 'N5'], ['N0', 'N1', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('br.walnut', ['N0', 'D0', 'D1', 'D1', 'D2', 'D3', 'N5', 'N6'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W6']);
defineMat('br.leather', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C3', 'C5'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']);
defineMat('br.bp', ['N1', 'F0', 'F1', 'F2', 'F2', 'F3', 'F3', 'F4'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5']);
defineMat('br.bpInk', ['N2', 'F3', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']);
defineMat('br.sticky', ['N0', 'N1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W6'], ['N0', 'N1', 'W2', 'W3', 'W5', 'W6', 'W7', 'W8'], ['N0', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']);
defineMat('br.brass', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['D0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']);

// ------------------------------------------------------------------ geometry (exported for staging)
export type SeatId = 'L' | 'A' | 'B' | 'C' | 'D' | 'E' | 'R';
export interface SeatDef {
  /** chair / sprite centre x */
  x: number;
  /** where a seated "table" sprite puts its TABLE_EDGE row (cast: *_TABLE_EDGE / MAS_DESK_EDGE) */
  tableEdgeY: number;
  /** which way the seat faces: far seats face camera; the ends are turned in toward the table */
  facing: 'camera' | 'right' | 'left';
  /** tent-card (table nameplate) anchor: its bottom-centre on the table */
  plate: [number, number];
  /** where this seat's phone lies on the table (step 0) */
  phone: [number, number];
}
const FAR_X = [132, 186, 240, 294, 348];
export const BR = {
  W: 480, H: 203,
  CEIL_Y: 10,
  WALL_FLOOR_Y: 150,
  WINDOW: {x0: 18, y0: 16, x1: 206, y1: 146, panes: [[18, 79], [82, 143], [146, 206]] as Array<[number, number]>, horizon: 56},
  /** the zone of the glass where a reflection (ALYI) reads best: above the chair row */
  REFLECT: {x0: 20, y0: 20, x1: 204, y1: 126},
  PENDANT: {x0: 150, x1: 330, y: 24},
  CHARTER: {x0: 226, y0: 32, x1: 262, y1: 74},
  /** TASYA's door (appears in the wall, sc 27): centred in the gap between seats D and E */
  TASYA_DOOR: {x0: 302, y0: 56, x1: 340, y1: 150},
  /** the frosted-glass entry door (TERB bangs in, sc 30) */
  DOOR: {x0: 374, y0: 48, x1: 414, y1: 150},
  PLANT: {x: 462, y: 150},
  TABLE: {far: {y: 138, x0: 96, x1: 384}, near: {y: 172, x0: 76, x1: 404}, apron: 176, floor: 196},
  SPEAKER: {x: 240, y: 157},
  BLUEPRINT: {x0: 134, y0: 145, x1: 210, y1: 170},
  /** where NELEH stands at the blueprint (behind the table, in the gap between seats A and B) */
  NELEH_AT: [159, 162] as [number, number],
  /** a clear spot on the table for a prop (the hourglass, the term sheet) */
  PROP_SPOT: [288, 160] as [number, number],
  /** GERG's laptop on the table at his seat (sc 30: it lights green, keycaps pop from it) */
  GERG_LAPTOP: [120, 150] as [number, number],
  /** the term sheet TERB stamps and hands over (sc 30.18) */
  TERM_SHEET: [292, 164] as [number, number],
  SEATS: {
    L: {x: 44, tableEdgeY: 157, facing: 'right', plate: [0, 0], phone: [90, 160]},
    A: {x: FAR_X[0], tableEdgeY: 138, facing: 'camera', plate: [FAR_X[0] + 15, 150], phone: [FAR_X[0] - 12, 153]},
    B: {x: FAR_X[1], tableEdgeY: 138, facing: 'camera', plate: [FAR_X[1] + 15, 150], phone: [FAR_X[1] + 28, 154]},
    C: {x: FAR_X[2], tableEdgeY: 138, facing: 'camera', plate: [FAR_X[2] + 15, 150], phone: [FAR_X[2] - 16, 151]},
    D: {x: FAR_X[3], tableEdgeY: 138, facing: 'camera', plate: [FAR_X[3] + 15, 150], phone: [FAR_X[3] - 12, 153]},
    E: {x: FAR_X[4], tableEdgeY: 138, facing: 'camera', plate: [FAR_X[4] + 15, 150], phone: [FAR_X[4] - 12, 153]},
    R: {x: 434, tableEdgeY: 157, facing: 'left', plate: [0, 0], phone: [390, 160]},
  } as Record<SeatId, SeatDef>,
  /** near-side chairs (foreground, backs to camera, cropped by the frame) */
  NEAR: [116, 364],
};

// ------------------------------------------------------------------ state
export type FireAt = {at: 'table'; x?: number; y?: number} | {at: 'chair'; seat: Exclude<SeatId, 'R'>} | {at: 'plate'; seat: Exclude<SeatId, 'L' | 'R'>};
export type FireSpot = FireAt & {
  /** 'burn' | 'out' (smoke for 24 frames from `outAt`) */
  state: 'burn' | 'out';
  outAt?: number;
  phase?: number;
};
/** sc 30's three fires: one on the table, one on a chair, one on a nameplate (MADA's chair never). */
export const FIRES_SC30: FireSpot[] = [
  {at: 'table', x: 178, y: 166, state: 'burn', phase: 0},
  {at: 'chair', seat: 'B', state: 'burn', phase: 1},
  {at: 'plate', seat: 'D', state: 'burn', phase: 2},
];
/** the "every chair but his" reading of the line, for a wider gag (optional) */
export const FIRES_ALL_CHAIRS: FireSpot[] = (['L', 'A', 'B', 'C', 'D', 'E'] as const).map((seat, i) => ({at: 'chair', seat, state: 'burn', phase: i} as FireSpot));

export interface BoardroomState {
  f: number;
  /** MACROSOFT slate: the back wall steps to slate blue (one palette step; sc 27 "11:53 PM") */
  slate?: boolean;
  /** TASYA's door: 0 none · 1 its outline steps out of the shadow · 2 closed (key in the lock) · 3 ajar · 4 open */
  tasyaDoor?: 0 | 1 | 2 | 3 | 4;
  /** the frosted entry door */
  door?: 'closed' | 'open';
  /** 0..1 hallway flash on the bang (keep <= 1 frame at 1, per the flash rule) */
  doorFlash?: number;
  /** two shadows on the frosted glass (the TPOOL rhyme; later episodes) */
  doorShadows?: boolean;
  /** the Valley's giant speed-dial wheel out the window (sc 27 egg). true = spinning on its own clock,
   *  'still' = parked (the calls have stopped: sc 30), false = not there */
  rolodex?: boolean | 'still';
  /** THE PLAN blueprint spread on the table; `word`: NELEH's one illegible word + "?" on step 4 */
  blueprint?: null | {word?: boolean};
  /** tent cards (table nameplates) on the far seats; null = none */
  plates?: Partial<Record<SeatId, string | null>>;
  /** replace one seat's tent card with a sticky note (TTEMME: 'CEO (TEMP)') */
  sticky?: {seat: Exclude<SeatId, 'L' | 'R'>; text: string} | null;
  /** phones on the table (one per seat in `phoneSeats`): lit screens, buzzing, and how many held steps
   *  they've walked toward the near edge (0..6, 3 px each) */
  phones?: {lit?: boolean; buzz?: boolean; step?: number} | null;
  phoneSeats?: SeatId[];
  /** the conference speakerphone: 0..4 dial LEDs lit (four tones, one per seat) */
  speaker?: number;
  /** THE QUIET VOTE: a laptop on the left end chair, camera off */
  laptop?: boolean;
  fires?: FireSpot[];
  /** a hard circular spotlight (screen circle): sc 27, swings from RIMA's empty chair to TTEMME */
  spot?: {x: number; y: number; r: number} | null;
  /** pendant (key) level multiplier, default 1 */
  pendant?: number;
  /** a reflection painted INTO the glass (under the chairs): ALYI. k = strength 1..3 (default 2) */
  reflection?: {img: Img; x: number; y: number; k?: number} | null;
  /** hide the near-side foreground chairs (for tighter staging) */
  noNear?: boolean;
  /** GERG's laptop on the table at seat A (he is remote; sc 30): 'off' | 'green' (lit, the keycaps pop from it) */
  gergLaptop?: 'off' | 'green' | null;
  /** the term sheet TERB stamps (sc 30.18): 'blank' | 'stamped' */
  termSheet?: 'blank' | 'stamped' | null;
}

export const BOARDROOM_DEFAULT: BoardroomState = {
  f: 0, slate: false, tasyaDoor: 0, door: 'closed', rolodex: true, blueprint: null,
  plates: {A: 'GERG', B: 'ALYI', C: null, D: 'NELEH', E: null},
  phones: null, speaker: 0, laptop: false, fires: [], spot: null, pendant: 1,
};

// ------------------------------------------------------------------ helpers
const T = BR.TABLE;
/** x range of the table top at screen row y (a mild trapezoid) */
const tableX = (y: number): [number, number] => {
  const t = clamp((y - T.far.y) / (T.near.y - T.far.y), 0, 1);
  return [Math.round(T.far.x0 + (T.near.x0 - T.far.x0) * t), Math.round(T.far.x1 + (T.near.x1 - T.far.x1) * t)];
};
const microW = (s: string) => microWidth(s);
/** plot micro text into a MatBuf as a material */
const microMat = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const sink = new Buf(1, 1, 0);
  const plot = mb.mat(mat, lvl);
  sink.set = (px: number, py: number) => plot(px, py);
  micro(sink, s, x, y, 0);
};
const microEmit = (mb: MatBuf, s: string, x: number, y: number, col: number) => {
  const sink = new Buf(1, 1, 0);
  sink.set = (px: number, py: number, c: number) => mb.emit(c)(px, py);
  micro(sink, s, x, y, col);
};

// ------------------------------------------------------------------ FAR layer: ceiling, wall, window, doors
const paintFar = (mb: MatBuf, s: BoardroomState) => {
  const f = s.f;
  const wallMat = s.slate ? 'br.slate' : 'wall';
  const slatMat = s.slate ? 'br.slate' : 'trim';
  // ceiling soffit + recessed downlights (off), a shadow gap where it meets the wall
  rect(0, 0, 480, BR.CEIL_Y, mb.mat('black', 0.2));
  for (let x = 0; x < 480; x += 40) rect(x, 0, 1, BR.CEIL_Y - 2, mb.mat('black', -0.6));
  for (let x = 20; x < 480; x += 80) { rect(x - 4, 3, 9, 2, mb.mat('metal', -0.8)); rect(x - 3, 5, 7, 1, mb.mat('metal', -1.5)); }
  // the two downlights over the end chairs are on (MADA sits under his like an exhibit)
  for (const x of [BR.SEATS.L.x, BR.SEATS.R.x]) { rect(x - 4, 4, 9, 2, mb.mat('metal', -0.4)); rect(x - 3, 6, 7, 1, mb.emit(PAL.C8)); mb.emit(PAL.C9)(x, 6); }
  rect(0, BR.CEIL_Y - 2, 480, 1, mb.mat('trim', 0.8));
  rect(0, BR.CEIL_Y - 1, 480, 1, mb.mat('black', -1));
  // back wall
  rect(0, BR.CEIL_Y, 480, BR.WALL_FLOOR_Y - BR.CEIL_Y, mb.mat(wallMat, 0));
  // vertical acoustic slats across the solid wall (right of the window), with a lit left edge
  for (let x = 212; x < 480; x += 6) {
    rect(x, BR.CEIL_Y + 2, 1, BR.WALL_FLOOR_Y - BR.CEIL_Y - 8, mb.mat(slatMat, -1.1));
    rect(x + 1, BR.CEIL_Y + 2, 1, BR.WALL_FLOOR_Y - BR.CEIL_Y - 8, mb.mat(slatMat, 0.5));
  }
  // plaster noise
  for (let y = BR.CEIL_Y; y < BR.WALL_FLOOR_Y; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  // the chair row's light should land on the chairs, not the wall behind them
  rect(0, 72, 480, BR.WALL_FLOOR_Y - 72, mb.gain(0.4, 1));
  // skirting
  rect(0, BR.WALL_FLOOR_Y - 6, 480, 1, mb.mat(slatMat, 1));
  rect(0, BR.WALL_FLOOR_Y - 5, 480, 5, mb.mat(slatMat, -0.4));
  // floor (carpet): the strip visible beyond the table ends and the foreground
  rect(0, BR.WALL_FLOOR_Y, 480, RH - BR.WALL_FLOOR_Y, mb.mat('br.carpet', 0));
  // carpet: a quiet corporate grid in perspective (lines converge mildly on the table's VP)
  const VPY = -76;
  for (let xw = -240; xw <= 720; xw += 24) {
    const x1 = 240 + ((xw - 240) * (RH - VPY)) / (BR.WALL_FLOOR_Y - VPY);
    line(xw, BR.WALL_FLOOR_Y, Math.round(x1), RH, mb.shade(-0.7));
  }
  for (let k = 0, y = BR.WALL_FLOOR_Y + 5; y < RH; k++, y += 5 + k * 2) rect(0, y, 480, 1, mb.shade(-0.7));
  for (let y = BR.WALL_FLOOR_Y; y < RH; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 9) < 0.05) mb.shade(0.4)(x, y);

  // ---- the window (emissive: the Valley at night) ----
  const Wn = BR.WINDOW;
  rect(Wn.x0 - 4, Wn.y0 - 4, Wn.x1 - Wn.x0 + 9, Wn.y1 - Wn.y0 + 9, mb.mat('metal', -1.2));
  rect(Wn.x0 - 4, Wn.y0 - 4, Wn.x1 - Wn.x0 + 9, 1, mb.shade(1.4));
  paintValley(mb, f, s.rolodex ?? false);
  // the reflection lives IN the glass (painted before the streaks and the chairs)
  if (s.reflection) paintReflection(mb, s.reflection);
  // glass: faint diagonal sheen bands + the pendant's reflection (the glass reflects the room)
  for (const [px0, px1] of Wn.panes)
    for (let y = Wn.y0; y <= Wn.y1; y++)
      for (let x = px0; x <= px1; x++) {
        const u = x - px0 + (y - Wn.y0) * 0.55;
        if ((u > 20 && u < 27) || (u > 31 && u < 33)) {
          const i = mb.idx(x, y);
          if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], 1);
        }
      }
  for (let x = 96; x < 204; x++) if (x % 3 !== 0) { const i = mb.idx(x, 29); if (i >= 0 && mb.eOn[i]) mb.e[i] = x % 3 === 1 ? PAL.C2 : PAL.C1; }
  // mullions + sill
  for (const mx of [80, 144]) { rect(mx, Wn.y0, 2, Wn.y1 - Wn.y0 + 1, mb.mat('metal', -0.9)); rect(mx, Wn.y0, 1, Wn.y1 - Wn.y0 + 1, mb.shade(1.2)); }
  rect(Wn.x0 - 4, Wn.y1 + 1, Wn.x1 - Wn.x0 + 9, 2, mb.mat('metal', 0.6));
  rect(Wn.x0 - 4, Wn.y1 + 3, Wn.x1 - Wn.x0 + 9, 2, mb.mat('metal', -1));

  // ---- the company wordmark: raised brushed-metal letters on the slats above the door (it stays when the wall
  // goes slate: the landlord repaints around the tenant's name) ----
  {
    const word = 'NOPE AI', tw = bigTextWidth(word), tx = Math.round((BR.DOOR.x0 + BR.DOOR.x1) / 2 - tw / 2), ty = 25;
    const cells = new Set<number>();
    const sink = new Buf(1, 1, 0);
    sink.set = (x: number, y: number) => { cells.add(y * 480 + x); };
    bigText(sink, word, tx, ty, 0);
    for (const k of cells) { const x = k % 480, y = (k / 480) | 0; if (!cells.has(k + 481)) mb.mat('black', -0.4)(x + 1, y + 1); }
    for (const k of cells) { const x = k % 480, y = (k / 480) | 0; mb.mat('metal', cells.has(k - 480) ? 0.4 : 1.8)(x, y); }
  }
  // ---- the framed CHARTER (egg: NELEH's scripture, zero read load) ----
  {
    const C = BR.CHARTER;
    rect(C.x0 + 2, C.y0 + 2, C.x1 - C.x0 + 1, C.y1 - C.y0 + 1, mb.shade(-1.3));
    rect(C.x0, C.y0, C.x1 - C.x0 + 1, C.y1 - C.y0 + 1, mb.mat('br.brass', 0.4));
    rect(C.x0, C.y0, C.x1 - C.x0 + 1, 1, mb.shade(1.4));
    rect(C.x0 + 3, C.y0 + 3, C.x1 - C.x0 - 5, C.y1 - C.y0 - 5, mb.mat('paper', -1.2));
    microMat(mb, 'CHARTER', C.x0 + Math.round((C.x1 - C.x0 + 1 - microW('CHARTER')) / 2), C.y0 + 6, 'black', 0.6);
    for (let y = C.y0 + 15; y < C.y1 - 8; y += 3) {
      const w = 22 - Math.floor(hash(y, 3) * 7);
      rect(C.x0 + 7, y, w, 1, mb.mat('paper', -2.4));
    }
    // the one highlighted line (the charter's famous clause), and a seal
    rect(C.x0 + 7, C.y0 + 27, 20, 1, mb.mat('br.sticky', 0.2));
    ellipse(C.x1 - 8, C.y1 - 7, 2.6, 2.6, mb.mat('red', 1));
    line(C.x0 + 5, C.y0 + 4, C.x0 + 12, C.y0 + 11, mb.shade(0.9)); // glass glint
  }

  // ---- TASYA's door (appears) ----
  paintTasyaDoor(mb, s);
  // ---- the frosted-glass entry door ----
  paintEntryDoor(mb, s);
  // ---- a tall plant in the far right corner ----
  {
    const {x, y} = BR.PLANT;
    poly([x - 7, y - 16, x + 7, y - 16, x + 6, y, x - 6, y], mb.mat('black', 0.6));
    rect(x - 7, y - 16, 15, 1, mb.shade(1.2));
    const leaves: Array<[number, number, number, number]> = [[0, -26, 5, 4], [-6, -32, 5, 3.5], [5, -36, 5, 3.5], [-2, -44, 5, 3.5], [6, -50, 4, 3], [-6, -54, 4, 3], [1, -60, 4, 3], [-3, -68, 3.5, 2.5], [4, -70, 3, 2.5]];
    line(x, y - 16, x, y - 66, mb.mat('wood', -0.5));
    leaves.forEach(([dx, dy, rx, ry], i) => {
      ellipse(x + dx, y + dy, rx, ry, mb.mat('plant', 0.2 + (i % 3) * 0.3));
      line(x + dx - rx + 1, y + dy, x + dx + rx - 1, y + dy - 1, mb.shade(-0.8));
    });
  }
};

/** the Valley at night through the glass: sky, a far ridge, the city grid, a freeway river, the wheel */
const paintValley = (mb: MatBuf, f: number, rolodex: boolean | 'still') => {
  const Wn = BR.WINDOW, HZ = Wn.horizon;
  for (let y = Wn.y0; y <= Wn.y1; y++)
    for (let x = Wn.x0; x <= Wn.x1; x++) {
      const b = bayer(x, y);
      let c: number;
      if (y < HZ) {
        const t = (y - Wn.y0) / (HZ - Wn.y0);
        c = t < 0.35 ? PAL.N1 : t < 0.6 ? (b < (t - 0.35) / 0.25 ? PAL.N2 : PAL.N1) : t < 0.85 ? PAL.N2 : b < (t - 0.85) / 0.15 ? PAL.U0 : PAL.N2;
      } else {
        const t = (y - HZ) / (Wn.y1 - HZ);
        c = t < 0.1 ? PAL.U0 : t < 0.35 ? PAL.N1 : PAL.N0;
      }
      mb.emit(c)(x, y);
    }
  // stars (sparse, fixed)
  for (let k = 0; k < 26; k++) {
    const x = Wn.x0 + Math.floor(hash(k, 1, 3) * (Wn.x1 - Wn.x0)), y = Wn.y0 + 2 + Math.floor(hash(k, 2, 3) * (HZ - Wn.y0 - 14));
    mb.emit(hash(k, 3, 3) < 0.3 ? PAL.N5 : PAL.N3)(x, y);
  }
  // far ridge (the hills across the Valley), a darker near ridge on the left
  for (let x = Wn.x0; x <= Wn.x1; x++) {
    const r1 = HZ - 4 - Math.round(3 * Math.sin(x * 0.045) + 2 * Math.sin(x * 0.13 + 1) + (x < 70 ? (70 - x) * 0.08 : 0));
    for (let y = r1; y < HZ + 2; y++) mb.emit(y === r1 ? PAL.N2 : PAL.N1)(x, y);
  }
  // the city grid: rows of lights in perspective (denser and bigger toward the bottom)
  for (let row = 0; row < 26; row++) {
    const t = row / 25;
    const y = Math.round(HZ + 3 + Math.pow(t, 1.5) * (Wn.y1 - HZ - 3));
    const step = Math.max(2, Math.round(2 + t * 7));
    for (let x = Wn.x0 + (row * 3) % step; x <= Wn.x1; x += step) {
      const h = hash(x, row, 11);
      if (h > 0.62) continue;
      const tw = hash(x, row, 12 + Math.floor((f + x * 5 + row * 11) / 40)) < 0.93;
      if (!tw) continue;
      const c = h < 0.08 ? PAL.C5 : h < 0.2 ? PAL.W6 : h < 0.45 ? PAL.W4 : PAL.W3;
      mb.emit(c)(x, y);
      if (t > 0.6 && h < 0.3) mb.emit(h < 0.15 ? PAL.W3 : PAL.W2)(x + 1, y);
    }
  }
  // the freeway: a river of headlights (warm) and tail lights (red), sweeping across the Valley floor
  for (let x = Wn.x0; x <= Wn.x1; x++) {
    const yy = Math.round(HZ + 22 + (x - Wn.x0) * 0.16 + 4 * Math.sin(x * 0.03));
    const moving = (x + Math.floor(f / 2)) % 5;
    if (moving !== 2) mb.emit(moving === 0 ? PAL.W7 : PAL.W4)(x, yy);
    if ((x + Math.floor(f / 2)) % 3 !== 1) mb.emit((x + Math.floor(f / 2)) % 4 === 0 ? PAL.R2 : PAL.R1)(x, yy + 2);
  }
  // a couple of lit towers downtown (right of centre), rooftop beacons blinking on their own clocks
  const towers: Array<[number, number, number]> = [[112, 18, 7], [121, 26, 6], [99, 12, 5], [60, 10, 6]];
  for (const [tx, th, tw] of towers) {
    rect(tx, HZ - th, tw, th + 4, mb.emit(PAL.N1));
    for (let y = HZ - th + 2; y < HZ + 2; y += 2) for (let x = tx + 1; x < tx + tw - 1; x += 2) if (hash(x, y, 31) < 0.35) mb.emit(hash(x, y, 32) < 0.5 ? PAL.W4 : PAL.C3)(x, y);
    if (Math.floor((f + tx) / 18) % 2 === 0) mb.emit(PAL.R3)(tx + (tw >> 1), HZ - th - 1);
  }
  if (rolodex) paintRolodex(mb, rolodex === 'still' ? 0 : f);
};

/** The giant speed-dial wheel (egg, sc 27): a Ferris wheel whose gondolas are Rolodex cards, spinning through
 *  the Valley. Drawn fresh each frame on its own held clock (it advances a card every 4 frames): positions are
 *  computed and plotted as whole pixels, nothing is rotated. */
export const ROLODEX = {cx: 172, cy: 57, r: 26};
const paintRolodex = (mb: MatBuf, f: number) => {
  const {cx, cy, r} = ROLODEX;
  const baseY = cy + r + 8;
  // A-frame legs planted in the Valley floor, a lit base
  for (const d of [-1, 1]) {
    line(cx, cy, cx + d * 17, baseY, mb.emit(PAL.N4));
    line(cx + d, cy + 1, cx + d * 18, baseY, mb.emit(PAL.N2));
    for (let k = 1; k < 5; k++) { const t = k / 5; mb.emit(PAL.W4)(Math.round(cx + d * 17 * t), Math.round(cy + (baseY - cy) * t)); }
  }
  rect(cx - 21, baseY, 43, 2, mb.emit(PAL.N3));
  rect(cx - 21, baseY, 43, 1, mb.emit(PAL.N5));
  // the card file: a dense fan of cards seen end-on, each a radial blade from the hub out to the rim
  const N = 30;
  const step = Math.floor(f / 4); // held: the file advances one card every 4 frames
  for (let k = 0; k < N; k++) {
    const ang = ((k + step) / N) * Math.PI * 2 - Math.PI / 2;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    // cards on the lit side (toward downtown, right) catch the city glow
    const lit = ca > 0.35 ? 2 : ca > -0.2 ? 1 : 0;
    const col = [PAL.N3, PAL.N4, PAL.N5][lit];
    for (let t = 7; t <= r; t++) mb.emit(t > r - 3 ? [PAL.N4, PAL.N5, PAL.P0][lit] : col)(Math.round(cx + ca * t), Math.round(cy + sa * t));
    // the index tab at the tip of every third card, with a marquee bulb (it is also a Ferris wheel)
    if ((k + step) % 3 === 0) {
      const tx = Math.round(cx + ca * (r + 2)), ty = Math.round(cy + sa * (r + 2));
      mb.emit((k + step) % 6 === 0 ? PAL.W7 : PAL.W5)(tx, ty);
    }
  }
  // the card standing up at the top: flipped face-on, the one being dialled (brighter)
  rect(cx - 3, cy - r - 6, 7, 6, mb.emit(PAL.P1));
  rect(cx - 3, cy - r - 6, 7, 1, mb.emit(PAL.P2));
  rect(cx - 2, cy - r - 3, 5, 1, mb.emit(PAL.P0));
  rect(cx - 1, cy - r, 3, 1, mb.emit(PAL.N4)); // the slot notch on the rod
  // the hub knob (a Rolodex knob, huge)
  ellipse(cx, cy, 6.5, 6.5, mb.emit(PAL.N2));
  ellipse(cx, cy, 5, 5, mb.emit(PAL.N4));
  ellipse(cx - 1, cy - 1, 2.2, 2.2, mb.emit(PAL.N6));
  mb.emit(PAL.W7)(cx, cy);
};

/** ALYI in the glass: every opaque pixel of the image steps down its own ramp (k rungs) and floors at N2, so it
 *  reads as a reflection (his ember under-light survives as a dim warm), clipped to the panes. */
const paintReflection = (mb: MatBuf, r: NonNullable<BoardroomState['reflection']>) => {
  const k = r.k ?? 2;
  const Wn = BR.WINDOW;
  for (let j = 0; j < r.img.h; j++)
    for (let i = 0; i < r.img.w; i++) {
      const c = r.img.c[j * r.img.w + i];
      if (c < 0) continue;
      const x = r.x + i, y = r.y + j;
      if (x < Wn.x0 || x > Wn.x1 || y < Wn.y0 || y > Wn.y1) continue;
      if (x === 80 || x === 81 || x === 144 || x === 145) continue;
      let d = stepColor(c, -k);
      // a reflection never goes fully black, and a city light brighter than it shines through it
      if (d === PAL.N0 || d === PAL.S0 || d === PAL.B0 || d === PAL.G0) d = PAL.N1;
      if (((x + y) & 1) === 0 && k >= 3) continue; // the faintest: half the pixels, like the glass is thin
      const at = mb.idx(x, y);
      if (at >= 0 && mb.eOn[at] && lightness(mb.e[at]) > lightness(d) + 0.04) continue;
      mb.emit(d)(x, y);
    }
};

const paintTasyaDoor = (mb: MatBuf, s: BoardroomState) => {
  const st = s.tasyaDoor ?? 0;
  if (!st) return;
  const D = BR.TASYA_DOOR;
  const w = D.x1 - D.x0 + 1, h = D.y1 - D.y0 + 1;
  if (st === 1) {
    // only its outline, stepping out of the shadow: a dim slate frame on the wall
    rect(D.x0 - 2, D.y0 - 2, w + 4, 1, mb.mat('br.slate', 1.2));
    rect(D.x0 - 2, D.y0 - 2, 1, h + 2, mb.mat('br.slate', 1.2));
    rect(D.x1 + 2, D.y0 - 2, 1, h + 2, mb.mat('br.slate', 0.2));
    return;
  }
  // casing
  rect(D.x0 - 3, D.y0 - 3, w + 6, 3, mb.mat('br.slate', 1.4));
  rect(D.x0 - 3, D.y0, 3, h, mb.mat('br.slate', 1));
  rect(D.x1 + 1, D.y0, 3, h, mb.mat('br.slate', 0.4));
  rect(D.x0 - 3, D.y0 - 3, w + 6, 1, mb.shade(1.2));
  if (st === 2 || st === 3) {
    rect(D.x0, D.y0, w, h, mb.mat('br.slate', st === 3 ? 0.2 : 0.6));
    // four window-pane panels (the MACROSOFT door has panes, not panels)
    for (const [px, py] of [[4, 6], [20, 6], [4, 40], [20, 40]]) {
      rect(D.x0 + px, D.y0 + py, 14, 30, mb.shade(-0.9));
      rect(D.x0 + px, D.y0 + py, 14, 1, mb.shade(-1.6));
      rect(D.x0 + px, D.y0 + py + 29, 14, 1, mb.shade(1.6));
    }
    // the key, already in the lock (brass), with its ring hanging
    rect(D.x0 + 31, D.y0 + 50, 3, 5, mb.mat('br.brass', 1));
    rect(D.x0 + 32, D.y0 + 55, 1, 3, mb.mat('br.brass', 1.6));
    ellipse(D.x0 + 32, D.y0 + 61, 3, 3, mb.mat('br.brass', 0.6));
    ellipse(D.x0 + 32, D.y0 + 61, 1.5, 1.5, mb.mat('br.slate', 0.6));
    if (st === 3) rect(D.x1 - 1, D.y0, 2, h, mb.emit(PAL.G6)); // a bright gap: it's open a crack
    return;
  }
  // 4 = open: a MACROSOFT floor beyond, bright and cool, a desk for every employee, each already labelled
  for (let y = D.y0; y <= D.y1; y++)
    for (let x = D.x0; x <= D.x1; x++) {
      const t = (y - D.y0) / h;
      const c = t < 0.12 ? PAL.G5 : t < 0.55 ? (bayer(x, y) < 0.5 ? PAL.G6 : PAL.P1) : t < 0.6 ? PAL.G4 : bayer(x, y) < (t - 0.6) * 1.2 ? PAL.G5 : PAL.G4;
      mb.emit(c)(x, y);
    }
  // ceiling lights receding
  for (let k = 0; k < 4; k++) rect(D.x0 + 8 + k, D.y0 + 4 + k * 3, w - 16 - k * 2, 1, mb.emit(PAL.P2));
  // rows of desks with labels, receding toward the far wall (smaller and higher)
  const rows: Array<[number, number, number]> = [[D.y0 + 50, 5, 3], [D.y0 + 58, 6, 3], [D.y0 + 68, 7, 4], [D.y0 + 80, 8, 5]];
  for (const [ry, n, dh] of rows) {
    const span = w - 4;
    for (let k = 0; k < n; k++) {
      const dx = D.x0 + 2 + Math.round((k * span) / n);
      const dw = Math.max(3, Math.round(span / n) - 2);
      rect(dx, ry, dw, dh, mb.emit(PAL.N6));
      rect(dx, ry, dw, 1, mb.emit(PAL.G6));
      // the label tag (already printed)
      rect(dx + 1, ry + 1, Math.max(2, dw - 2), 1, mb.emit(PAL.P2));
      // a monitor on each desk
      rect(dx + (dw >> 1) - 1, ry - 3, 3, 2, mb.emit(PAL.N5));
    }
  }
  // the open slab (swung into the far room, seen edge-on at the right jamb)
  rect(D.x1 - 3, D.y0, 3, h, mb.mat('br.slate', 1.6));
  rect(D.x1 - 3, D.y0, 1, h, mb.shade(-1));
};

const paintEntryDoor = (mb: MatBuf, s: BoardroomState) => {
  const D = BR.DOOR;
  const w = D.x1 - D.x0 + 1, h = D.y1 - D.y0 + 1;
  const flash = s.doorFlash ?? 0;
  // dark steel frame
  rect(D.x0 - 4, D.y0 - 4, w + 8, 4, mb.mat('metal', -0.6));
  rect(D.x0 - 4, D.y0, 4, h, mb.mat('metal', -0.4));
  rect(D.x1 + 1, D.y0, 4, h, mb.mat('metal', -0.8));
  rect(D.x0 - 4, D.y0 - 4, w + 8, 1, mb.shade(1.4));
  rect(D.x0 - 4, D.y0, 1, h, mb.shade(1));
  if (s.door !== 'open') {
    // frosted glass, lit from the hallway behind: a warm glow, brighter toward the middle, a bayer grain
    for (let y = D.y0; y <= D.y1; y++)
      for (let x = D.x0; x <= D.x1; x++) {
        const u = Math.abs(x - (D.x0 + D.x1) / 2) / (w / 2), v = (y - D.y0) / h;
        const L = 0.62 - u * 0.25 - Math.abs(v - 0.45) * 0.4 + (bayer(x, y) - 0.5) * 0.18;
        let c = L > 0.52 ? PAL.W5 : L > 0.42 ? PAL.W4 : L > 0.32 ? PAL.D4 : L > 0.22 ? PAL.D3 : PAL.D2;
        if (s.doorShadows) {
          // two soft shadows leaning together behind the glass
          const a = Math.hypot((x - (D.x0 + 13)) / 7, (y - (D.y0 + 34 + (x - D.x0) * 0.1)) / 30);
          const b2 = Math.hypot((x - (D.x0 + 27)) / 7, (y - (D.y0 + 36 - (x - D.x0 - 27) * 0.1)) / 31);
          if (a < 1 || b2 < 1) c = stepColor(c, -2);
        }
        mb.emit(c)(x, y);
      }
    // brushed-steel pull and a kick plate
    rect(D.x0 + 5, D.y0 + 40, 2, 22, mb.mat('metal', 1.6));
    rect(D.x0 + 4, D.y0 + 40, 1, 22, mb.mat('metal', -0.5));
    rect(D.x0, D.y1 - 12, w, 12, mb.mat('metal', -0.2));
    rect(D.x0, D.y1 - 12, w, 1, mb.shade(1.4));
    // light leaking under the door onto the carpet
    for (let x = D.x0 + 1; x < D.x1; x++) mb.emit(x % 6 === 0 ? PAL.W4 : PAL.W5)(x, D.y1 + 1);
  } else {
    // open: the hallway (hot tungsten, emissive) in one-point perspective, the glass slab swung into the room
    const fx0 = D.x0 + 12, fx1 = D.x1 - 12, fy0 = D.y0 + 16, fy1 = D.y1 - 30;
    for (let y = D.y0; y <= D.y1; y++)
      for (let x = D.x0; x <= D.x1; x++) {
        const b = bayer(x, y);
        let c: number;
        if (x >= fx0 && x <= fx1 && y >= fy0 && y <= fy1) c = b < 0.5 ? PAL.W6 : PAL.W7;
        else if (y > fy1) { const t = (y - fy1) / (D.y1 - fy1); c = t > 0.6 ? PAL.W8 : b < t ? PAL.W8 : PAL.W7; }
        else if (y < fy0) c = b < 0.4 ? PAL.W5 : PAL.W4;
        else c = b < 0.5 ? PAL.W5 : PAL.W6;
        if (flash > 0.5) c = c === PAL.W4 || c === PAL.W5 ? PAL.W7 : PAL.W8;
        mb.emit(c)(x, y);
      }
    line(D.x0, D.y1, fx0, fy1, mb.emit(PAL.W5));
    line(D.x1, D.y1, fx1, fy1, mb.emit(PAL.W5));
    rect(fx0 + 4, D.y0 + 3, fx1 - fx0 - 7, 2, mb.emit(PAL.W9));
  }
};

// ------------------------------------------------------------------ MID layer: the chairs (and the laptop)
/** far-side executive chair, seen from the front (its back rises behind the sitter's head) */
const farChair = (mb: MatBuf, cx: number) => {
  const top = 92, bot = BR.TABLE.far.y + 2;
  const hw = 12;
  // back (rounded top), tufted in rows, a centre seam; lit from above by the pendant
  poly([cx - hw, top + 5, cx - hw + 3, top + 1, cx - hw + 6, top, cx + hw - 6, top, cx + hw - 3, top + 1, cx + hw, top + 5, cx + hw + 1, bot, cx - hw - 1, bot], mb.mat('br.leather', 0.3));
  rect(cx - hw + 5, top, 2 * hw - 10, 1, mb.shade(1.6));
  rect(cx - hw + 2, top + 1, 2 * hw - 4, 1, mb.shade(0.9));
  line(cx - hw, top + 5, cx - hw - 1, bot, mb.shade(0.8));
  line(cx + hw, top + 5, cx + hw + 1, bot, mb.shade(-1));
  for (let y = top + 9; y < bot; y += 8) { rect(cx - hw + 3, y, 2 * hw - 5, 1, mb.shade(-1.1)); rect(cx - hw + 3, y + 1, 2 * hw - 5, 1, mb.shade(0.5)); }
  rect(cx, top + 4, 1, bot - top - 4, mb.shade(-0.8));
  // chrome armrests peeking at the sides, just above the table
  rect(cx - hw - 4, BR.TABLE.far.y - 7, 3, 7, mb.mat('metal', 0.4));
  rect(cx - hw - 4, BR.TABLE.far.y - 7, 3, 1, mb.shade(1.6));
  rect(cx + hw + 2, BR.TABLE.far.y - 7, 3, 7, mb.mat('metal', -0.2));
  rect(cx + hw + 2, BR.TABLE.far.y - 7, 3, 1, mb.shade(1.2));
};

/** an end chair, turned in toward the table (3/4). dir = +1 faces right (left end), -1 faces left (MADA's end).
 *  bolted = MADA's: a steel floor plate with four bolts in place of the caster star. */
export const END_SEAT_Y = 168;
const endChair = (mb: MatBuf, cx: number, dir: 1 | -1, bolted: boolean) => {
  const seatY = END_SEAT_Y, floorY = END_SEAT_Y + 26;
  const X = (u: number) => cx + u * dir; // u measured toward the table
  // gas column
  rect(cx - 1, seatY + 5, 3, floorY - seatY - 8, mb.mat('metal', 1));
  rect(cx - 1, seatY + 5, 1, floorY - seatY - 8, mb.shade(1.4));
  rect(cx + 1, seatY + 5, 1, floorY - seatY - 8, mb.shade(-1));
  if (bolted) {
    // the floor plate, in perspective, four bolts (egg: the chair musical chairs never removes)
    ellipse(cx, floorY, 14, 3.6, mb.mat('metal', -0.2));
    ellipse(cx, floorY - 1, 13, 2.8, mb.mat('metal', 1.2));
    rect(cx - 10, floorY - 2, 20, 1, mb.shade(1.2));
    for (const [bx, by] of [[-10, 0], [10, 0], [-5, -2], [5, 2]]) { mb.mat('metal', 3.4)(cx + bx, floorY + by - 1); mb.mat('black', 0.4)(cx + bx, floorY + by); }
    ellipse(cx, floorY - 2, 3, 1.4, mb.mat('metal', 2));
  } else {
    // five-star base on casters
    const legs: Array<[number, number]> = [[-13, 2], [-7, 4], [7, 4], [13, 2], [0, -1]];
    for (const [lx, ly] of legs) {
      line(cx, floorY - 4, cx + lx, floorY + ly - 2, mb.mat('metal', 0.8));
      rect(cx + lx - 1, floorY + ly - 1, 3, 2, mb.mat('black', 1));
    }
  }
  // seat cushion (a parallelogram), its front edge lit
  poly([X(-13), seatY - 2, X(10), seatY - 4, X(15), seatY + 2, X(-10), seatY + 6], mb.mat('br.leather', 1.8));
  line(X(-12), seatY - 2, X(10), seatY - 4, mb.shade(1.6));
  line(X(-10), seatY + 6, X(15), seatY + 2, mb.mat('br.leather', 0.4));
  line(X(-10), seatY + 7, X(15), seatY + 3, mb.mat('br.leather', -0.6));
  // back: seen at an angle (narrower), leaning back slightly, on the side away from the table
  poly([X(-15), seatY, X(-9), seatY - 1, X(-7), seatY - 45, X(-10), seatY - 49, X(-16), seatY - 48, X(-19), seatY - 42], mb.mat('br.leather', 1.5));
  line(X(-7), seatY - 45, X(-9), seatY - 1, mb.shade(2));
  line(X(-16), seatY - 48, X(-10), seatY - 49, mb.shade(2.4));
  line(X(-19), seatY - 42, X(-15), seatY, mb.shade(-1.2));
  for (let y = seatY - 40; y < seatY - 4; y += 8) line(X(-17), y, X(-9), y - 1, mb.shade(-1.2));
  // armrest toward camera (chrome)
  rect(Math.min(X(-6), X(8)), seatY - 11, 15, 2, mb.mat('metal', 1.4));
  rect(Math.min(X(-6), X(8)), seatY - 11, 15, 1, mb.shade(1.8));
  rect(X(6) - (dir < 0 ? 1 : 0), seatY - 9, 2, 8, mb.mat('metal', 0.6));
};

/** THE QUIET VOTE: a laptop on the left end chair, lid up, camera off (a black screen, a grey avatar disc) */
const paintQuietLaptop = (mb: MatBuf) => {
  const cx = BR.SEATS.L.x, seatY = END_SEAT_Y;
  // base on the seat
  poly([cx - 8, seatY - 3, cx + 8, seatY - 5, cx + 10, seatY - 3, cx - 6, seatY - 1], mb.mat('metal', 0.6));
  // lid: the screen faces into the room (3/4 toward camera)
  poly([cx - 8, seatY - 3, cx - 7, seatY - 18, cx + 7, seatY - 20, cx + 8, seatY - 5], mb.mat('metal', -0.4));
  poly([cx - 7, seatY - 5, cx - 6, seatY - 17, cx + 6, seatY - 19, cx + 7, seatY - 6], mb.emit(PAL.N0));
  // the camera-off avatar disc + a thin grey label bar
  ellipse(cx, seatY - 12, 2.5, 2.5, mb.emit(PAL.G1));
  mb.emit(PAL.G3)(cx, seatY - 13);
  rect(cx - 4, seatY - 8, 7, 1, mb.emit(PAL.G2));
  mb.emit(PAL.N3)(cx - 1, seatY - 18);
};

/** the linear LED pendant over the table, on two cables (the room's key light) */
const paintPendant = (mb: MatBuf, s: BoardroomState) => {
  const P = BR.PENDANT;
  for (const cx of [P.x0 + 14, P.x1 - 14]) rect(cx, BR.CEIL_Y, 1, P.y - BR.CEIL_Y, mb.mat('black', 0.8));
  rect(P.x0, P.y, P.x1 - P.x0 + 1, 3, mb.mat('metal', -0.6));
  rect(P.x0, P.y, P.x1 - P.x0 + 1, 1, mb.mat('metal', 0.8));
  rect(P.x0 - 1, P.y + 1, 1, 2, mb.mat('metal', -1)); rect(P.x1 + 1, P.y + 1, 1, 2, mb.mat('metal', -1));
  const on = (s.pendant ?? 1) > 0.2;
  for (let x = P.x0 + 1; x < P.x1; x++) mb.emit(on ? (x % 9 === 0 ? PAL.C8 : PAL.C9) : PAL.N3)(x, P.y + 3);
  if (on) for (let x = P.x0 + 3; x < P.x1 - 2; x++) if (bayer(x, P.y + 4) < 0.5) mb.emit(PAL.C6)(x, P.y + 4);
};

const paintMid = (mb: MatBuf, s: BoardroomState) => {
  paintPendant(mb, s);
  for (const id of ['A', 'B', 'C', 'D', 'E'] as const) farChair(mb, BR.SEATS[id].x);
  endChair(mb, BR.SEATS.L.x, 1, false);
  endChair(mb, BR.SEATS.R.x, -1, true);
  if (s.laptop) paintQuietLaptop(mb);
};

// ------------------------------------------------------------------ FRONT layer: the table and what's on it
const tentCard = (mb: MatBuf, bx: number, by: number, name: string) => {
  const lines = name.length > 9 && name.includes(' ') ? splitTwo(name) : [name];
  const w = Math.max(...lines.map(microW)) + 5, h = lines.length * 6 + 3;
  const x0 = Math.round(bx - w / 2), y0 = by - h;
  rect(x0 + 1, by, w, 1, mb.shade(-1.5)); // its shadow on the table
  rect(x0, y0, w, h, mb.mat('paper', 0.9));
  rect(x0, y0, w, 1, mb.mat('paper', 2.2)); // the fold catches the pendant
  rect(x0, y0 + h - 1, w, 1, mb.mat('paper', -0.4));
  lines.forEach((l, i) => microMat(mb, l, x0 + Math.round((w - microW(l)) / 2), y0 + 2 + i * 6, 'black', -0.5));
};
const splitTwo = (s: string) => {
  const words = s.split(' ');
  let best = [s, ''], bw = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
    const m = Math.max(microW(a), microW(b));
    if (m < bw) { bw = m; best = [a, b]; }
  }
  return best;
};
const stickyNote = (mb: MatBuf, bx: number, by: number, txt: string) => {
  const w = Math.max(18, microW(txt) + 4), h = 9;
  const x0 = Math.round(bx - w / 2), y0 = by - h;
  rect(x0 + 1, by, w, 1, mb.shade(-1.5));
  poly([x0, y0 + 1, x0 + w, y0, x0 + w, y0 + h, x0, y0 + h], mb.mat('br.sticky', 0.6));
  rect(x0, y0 + 1, w, 1, mb.shade(1)); // the sticky strip
  microMat(mb, txt, x0 + 2, y0 + 3, 'black', 0.4);
};

const drawPhone = (mb: MatBuf, x: number, y: number, lit: boolean, f: number, seed: number) => {
  rect(x, y, 7, 3, mb.mat('black', 0.6));
  rect(x, y, 7, 1, mb.shade(1.2));
  if (lit) {
    rect(x + 1, y + 1, 5, 1, mb.emit(Math.floor((f + seed * 5) / 6) % 2 ? PAL.C6 : PAL.C5));
    mb.emit(PAL.C8)(x + 1, y);
  }
};

const paintTable = (mb: MatBuf, s: BoardroomState) => {
  const f = s.f;
  // top (glossy walnut): lit by the pendant; a long specular strip where it mirrors the fixture
  for (let y = T.far.y; y < T.near.y; y++) {
    const [x0, x1] = tableX(y);
    rect(x0, y, x1 - x0 + 1, 1, mb.mat('br.walnut', 0.4));
  }
  // grain: long thin darker streaks running left-right
  for (let k = 0; k < 60; k++) {
    const y = T.far.y + 1 + Math.floor(hash(k, 1, 41) * (T.near.y - T.far.y - 2));
    const [x0, x1] = tableX(y);
    const gx = x0 + Math.floor(hash(k, 2, 41) * (x1 - x0 - 30));
    rect(gx, y, 10 + Math.floor(hash(k, 3, 41) * 30), 1, mb.shade(-0.7));
  }
  // specular: the pendant's reflection lies in the table as a bright band (the table is polished)
  const SY = T.far.y + 12;
  for (let y = SY; y <= SY + 5; y++) {
    const [x0, x1] = tableX(y);
    for (let x = Math.max(x0 + 2, 150 - (y - SY) * 2); x <= Math.min(x1 - 2, 330 + (y - SY) * 2); x++) {
      const core = y >= SY + 2 && y <= SY + 3;
      if (core || bayer(x, y) < 0.5) mb.shade(core ? 2.2 : 1.2)(x, y);
    }
  }
  // edges: far lip (dark), near bevel (lit), apron
  const [fx0, fx1] = tableX(T.far.y);
  rect(fx0, T.far.y, fx1 - fx0 + 1, 1, mb.shade(-1.2));
  for (let y = T.far.y; y < T.near.y; y++) { const [x0, x1] = tableX(y); mb.shade(1.2)(x0, y); mb.shade(-0.6)(x1, y); }
  rect(T.near.x0, T.near.y, T.near.x1 - T.near.x0 + 1, 1, mb.mat('br.walnut', 2));
  rect(T.near.x0, T.near.y + 1, T.near.x1 - T.near.x0 + 1, T.apron - T.near.y - 1, mb.mat('br.walnut', -0.4));
  rect(T.near.x0, T.apron, T.near.x1 - T.near.x0 + 1, 1, mb.mat('br.walnut', -1.4));
  // end faces (the slanted ends read as thickness)
  line(T.far.x0, T.far.y + 1, T.near.x0, T.near.y + 5, mb.mat('br.walnut', -0.6));
  line(T.far.x1, T.far.y + 1, T.near.x1, T.near.y + 5, mb.mat('br.walnut', -1));
  // two slab pedestals under the table, a shadow pool on the carpet
  for (const px of [150, 330]) {
    rect(px - 20, T.apron + 1, 41, T.floor - T.apron - 1, mb.mat('br.walnut', -1));
    rect(px - 20, T.apron + 1, 41, T.floor - T.apron - 1, mb.gain(0.35, 0.6));
    rect(px - 20, T.apron + 1, 1, T.floor - T.apron - 1, mb.shade(0.6));
    rect(px + 20, T.apron + 1, 1, T.floor - T.apron - 1, mb.shade(-0.6));
  }
  for (let x = T.near.x0 + 6; x < T.near.x1 - 6; x++) { mb.shade(-1.4)(x, T.floor); mb.shade(-0.7)(x, T.floor + 1); if (x > 124 && x < 356) mb.shade(-0.6)(x, T.floor + 2); }

  // ---- the blueprint (THE PLAN), spread flat ----
  if (s.blueprint) paintBlueprint(mb, !!s.blueprint.word);

  // ---- the speakerphone (centre): a flat three-lobed pod, four dial LEDs ----
  {
    const {x, y} = BR.SPEAKER;
    poly([x - 9, y + 2, x - 5, y - 3, x + 5, y - 3, x + 9, y + 2, x + 4, y + 4, x - 4, y + 4], mb.mat('metal', -0.2));
    line(x - 5, y - 3, x + 5, y - 3, mb.shade(1.5));
    ellipse(x, y, 3, 1.2, mb.mat('black', -0.5));
    const lit = s.speaker ?? 0;
    for (let k = 0; k < 4; k++) mb.emit(k < lit ? PAL.C8 : PAL.N3)(x - 6 + k * 4, y + 2);
  }

  // ---- tent cards (or TTEMME's sticky note) ----
  const plates = {...BOARDROOM_DEFAULT.plates, ...(s.plates ?? {})};
  for (const id of ['A', 'B', 'C', 'D', 'E'] as const) {
    const sd = BR.SEATS[id];
    if (s.sticky && s.sticky.seat === id) { stickyNote(mb, sd.plate[0], sd.plate[1], s.sticky.text); continue; }
    const name = plates[id];
    if (name) tentCard(mb, sd.plate[0], sd.plate[1], name);
  }

  // ---- GERG's laptop (open, its screen toward his empty chair: we see the lid's back and its green spill) ----
  if (s.gergLaptop) {
    const [gx, gy] = BR.GERG_LAPTOP;
    poly([gx - 10, gy + 2, gx + 10, gy + 2, gx + 12, gy + 5, gx - 12, gy + 5], mb.mat('metal', 0.6));
    poly([gx - 9, gy + 2, gx - 8, gy - 10, gx + 8, gy - 10, gx + 9, gy + 2], mb.mat('metal', -0.4));
    rect(gx - 8, gy - 10, 17, 1, mb.shade(1.4));
    if (s.gergLaptop === 'green') { for (let x = gx - 8; x <= gx + 8; x++) mb.emit(x % 3 ? PAL.L3 : PAL.L2)(x, gy - 11); mb.emit(PAL.L3)(gx - 9, gy - 6); mb.emit(PAL.L3)(gx + 9, gy - 6); }
  }
  // ---- the term sheet (a stapled sheet, a red stamp once TERB brings it down) ----
  if (s.termSheet) {
    const [tx, ty] = BR.TERM_SHEET;
    poly([tx - 11, ty - 5, tx + 10, ty - 6, tx + 12, ty + 5, tx - 9, ty + 6], mb.mat('paper', 1.4));
    line(tx - 11, ty - 5, tx + 10, ty - 6, mb.shade(1));
    for (let k = 0; k < 3; k++) rect(tx - 7, ty - 3 + k * 3, 12 - k * 2, 1, mb.mat('paper', -0.6));
    mb.mat('metal', 2)(tx - 10, ty - 4);
    if (s.termSheet === 'stamped') { rect(tx + 1, ty - 1, 8, 5, mb.mat('red', 1.2)); rect(tx + 2, ty, 6, 3, mb.mat('paper', 1.4)); rect(tx + 3, ty + 1, 4, 1, mb.mat('red', 1.2)); }
  }

  // ---- phones ----
  if (s.phones) {
    const seats = s.phoneSeats ?? (['L', 'A', 'B', 'C', 'D', 'E', 'R'] as SeatId[]);
    const stepPx = 3;
    seats.forEach((id, i) => {
      const [px, py] = BR.SEATS[id].phone;
      const st = Math.min(s.phones!.step ?? 0, 6);
      const bz = s.phones!.buzz ? (((f + i) % 2) ? 1 : -1) : 0;
      // they walk straight toward the near edge (the ends walk inward along the table too)
      const dx = id === 'L' ? st * 2 : id === 'R' ? -st * 2 : 0;
      drawPhone(mb, px + dx + bz, py + st * stepPx, !!s.phones!.lit, f, i);
    });
  }
};

const paintBlueprint = (mb: MatBuf, word: boolean) => {
  const B = BR.BLUEPRINT;
  // a sheet lying on the table: a mild parallelogram (far edge narrower), curled corner at the near right
  const quad = [B.x0 + 4, B.y0, B.x1 - 3, B.y0, B.x1, B.y1, B.x0, B.y1];
  // shadow
  poly(quad.map((v, i) => (i % 2 ? v + 1 : v + 1)), mb.shade(-1.6));
  poly(quad, mb.mat('br.bp', 0.2));
  // drafting grid
  for (let y = B.y0 + 3; y < B.y1; y += 4) for (let x = B.x0 + 3; x < B.x1 - 1; x++) if (x % 2 === 0) mb.mat('br.bp', 1.4)(x, y);
  // border rule
  line(B.x0 + 6, B.y0 + 2, B.x1 - 5, B.y0 + 2, mb.mat('br.bpInk', 0));
  line(B.x0 + 2, B.y1 - 2, B.x1 - 2, B.y1 - 2, mb.mat('br.bpInk', 0));
  // the numbered path: 1 ✓, 2 ✓, 3 ✓, 4 ______ (the blank is just a line)
  const lx = B.x0 + 8;
  for (let k = 0; k < 4; k++) {
    const y = B.y0 + 5 + k * 5;
    microMat(mb, String(k + 1), lx + k, y, 'br.bpInk', 1);
    if (k < 3) {
      rect(lx + k + 5, y + 2, 22 - k * 2, 1, mb.mat('br.bpInk', -0.4));
      microMat(mb, '^', lx + k + 30, y, 'br.bpInk', 1.6);
    } else {
      rect(lx + k + 5, y + 4, 40, 1, mb.mat('br.bpInk', 0.8));
      if (word) {
        // NELEH's one small word + "?": marker squiggle, unreadable on purpose
        const wx = lx + k + 9;
        const sq = [0, -1, -2, -1, 0, -2, -1, 0, -1, -2, -2, 0, -1];
        sq.forEach((dy, i) => mb.mat('paper', 1.2)(wx + i, y + 2 + dy));
        microMat(mb, '?', wx + 15, y - 1, 'paper', 1.2);
      }
    }
  }
  // a little box diagram at the right (the two boxes and the CONTROLS arrow, in miniature)
  rect(B.x1 - 26, B.y0 + 6, 16, 6, mb.mat('br.bpInk', -0.6));
  rect(B.x1 - 25, B.y0 + 7, 14, 4, mb.mat('br.bp', 0.2));
  line(B.x1 - 18, B.y0 + 12, B.x1 - 18, B.y0 + 15, mb.mat('br.bpInk', 0));
  rect(B.x1 - 29, B.y0 + 16, 22, 7, mb.mat('br.bpInk', -0.6));
  rect(B.x1 - 28, B.y0 + 17, 20, 5, mb.mat('br.bp', 0.2));
  // the near-right corner curls up (lit edge)
  poly([B.x1 - 7, B.y1, B.x1, B.y1, B.x1 - 1, B.y1 - 5], mb.mat('br.bp', 1.8));
  line(B.x1 - 7, B.y1, B.x1 - 1, B.y1 - 5, mb.mat('br.bpInk', 1));
};

// ------------------------------------------------------------------ FORE layer: near-side chairs
const nearChair = (mb: MatBuf, cx: number) => {
  // an executive high back seen from behind, cropped by the frame: headrest, shoulders, a seam; the pendant
  // rims its top and the room's night picks out the shoulders
  const top = 184;
  poly([cx - 17, RH, cx - 18, top + 16, cx - 15, top + 10, cx - 9, top + 8, cx - 9, top + 3, cx - 6, top, cx + 6, top, cx + 9, top + 3, cx + 9, top + 8, cx + 15, top + 10, cx + 18, top + 16, cx + 17, RH], mb.mat('br.leather', 1.2));
  // headrest seam + its lit crown
  rect(cx - 8, top + 8, 17, 1, mb.shade(-1.4));
  rect(cx - 5, top, 11, 1, mb.shade(3.4));
  line(cx - 6, top, cx - 9, top + 3, mb.shade(2.6));
  line(cx + 6, top, cx + 9, top + 3, mb.shade(2));
  // shoulders catch light
  line(cx - 15, top + 10, cx - 9, top + 9, mb.shade(2.6));
  line(cx + 9, top + 9, cx + 15, top + 10, mb.shade(2));
  line(cx - 18, top + 16, cx - 17, RH, mb.shade(0.8));
  // a stitched centre channel and two horizontal tufts
  rect(cx, top + 10, 1, RH - top - 10, mb.shade(-0.9));
};

// ------------------------------------------------------------------ fires (painted into the right layer)
const fireBase = (fs: FireSpot): {layer: 'mid' | 'front'; x: number; y: number; small: boolean} => {
  if (fs.at === 'table') return {layer: 'front', x: fs.x ?? 178, y: fs.y ?? 166, small: false};
  if (fs.at === 'plate') { const [px, py] = BR.SEATS[fs.seat].plate; return {layer: 'front', x: px, y: py - 8, small: true}; }
  // chair: on top of the chair back (far seats) or on the end chair's back
  if (fs.seat === 'L') return {layer: 'mid', x: BR.SEATS.L.x - 12, y: END_SEAT_Y - 47, small: true};
  return {layer: 'mid', x: BR.SEATS[fs.seat].x, y: 93, small: false};
};
const paintFires = (mid: MatBuf, front: MatBuf, s: BoardroomState) => {
  (s.fires ?? []).forEach((fs, i) => {
    const {layer, x, y, small} = fireBase(fs);
    const mb = layer === 'mid' ? mid : front;
    const plot = (px: number, py: number, c: number) => mb.emit(c)(px, py);
    if (fs.state === 'burn') drawFire(plot, x, y, s.f, fs.phase ?? i, small);
    else drawSmoke(plot, x, y, s.f - (fs.outAt ?? s.f));
    if (fs.state === 'out' && fs.at !== 'table') { mb.shade(-1.5)(x - 1, y + 1); mb.shade(-1.5)(x + 1, y + 1); mb.shade(-1.5)(x, y + 1); } // a scorch
  });
};

// ------------------------------------------------------------------ lights
const boardroomLights = (s: BoardroomState): Lights => {
  const f = s.f;
  const pend = s.pendant ?? 1;
  const fires = (s.fires ?? []).filter((q) => q.state === 'burn').map((q, i) => ({...fireBase(q), fl: fireFlicker(f, q.phase ?? i)}));
  const D = BR.DOOR;
  const open = s.door === 'open';
  const flash = s.doorFlash ?? 0;
  const TD = BR.TASYA_DOOR;
  const tOpen = (s.tasyaDoor ?? 0) >= 3;
  return {
    amb: (x, y) => {
      let a = y >= BR.WALL_FLOOR_Y ? 1.8 : 2.2;
      // the window spills a little cool night on its surroundings
      const dw = Math.hypot((x - 110) / 150, (y - 84) / 90);
      if (dw < 1) a += (1 - dw) * 1.2;
      // MACROSOFT's open door floods cool slate light (the night ramp brightens: it reads blue-grey)
      if (tOpen && !(y >= T.far.y - 1 && y <= T.floor + 2 && x >= tableX(Math.min(y, T.near.y))[0] - 2 && x <= tableX(Math.min(y, T.near.y))[1] + 2)) {
        // (the table and its pedestals are left out: on walnut the night ramp would read as a shadow)
        const cx = (TD.x0 + TD.x1) / 2;
        if (y >= BR.WALL_FLOOR_Y) {
          const t = (y - BR.WALL_FLOOR_Y) / 53;
          const hw = 22 + t * 60;
          // the table stands between the door and the camera: in front of it, only the carpet to its right is lit
          const shadowed = y > T.far.y && x < tableX(Math.min(y, T.near.y))[1] + 4 + Math.max(0, y - T.near.y) * 0.6;
          if (!shadowed && Math.abs(x - (cx - t * 40)) < hw) a += (s.tasyaDoor === 4 ? 2.6 : 1) * (1 - t * 0.6);
        } else {
          const d = Math.hypot((x - cx) / 70, (y - 106) / 56);
          if (d < 1) a += (1 - d) * (s.tasyaDoor === 4 ? 2.2 : 0.8);
        }
      }
      const vx = (x - 240) / 240, vy = (y - 101) / 112;
      a -= Math.max(0, vx * vx + vy * vy - 0.5) * 2;
      return a;
    },
    cyan: (x, y) => {
      // the linear pendant: a long pool on the table, the far chairs catch it from above, a scallop on the wall
      const P = BR.PENDANT;
      const px = clamp(x, P.x0, P.x1);
      let L = 0;
      if (y >= T.far.y - 2 && y <= T.apron + 1) {
        const d = Math.hypot((x - px) / 78, (y - 157) / 24);
        L = Math.pow(clamp(1 - d, 0, 1), 1.3) * 0.56 + 0.05;
      } else if (y < T.far.y - 2 && y > 78) {
        // the chair backs catch it from above: strongest on their top rows
        const d = Math.hypot((x - px) / 80, (y - 108) / 36);
        L = clamp(1 - d, 0, 1) * 0.5;
      } else if (y <= 78 && y > P.y + 2) {
        const d = Math.hypot((x - px) / 50, (y - P.y - 3) / 20);
        L = clamp(1 - d, 0, 1) * 0.36;
      } else if (y > T.apron + 1) {
        // the carpet around the table: a soft skirt of light, none under the table (it blocks the pendant)
        const under = y < T.floor + 3 && x > T.near.x0 + 3 && x < T.near.x1 - 3;
        const d = Math.hypot((x - px) / 170, (y - 186) / 30);
        L = under ? 0 : clamp(1 - d, 0, 1) * 0.42;
      }
      L *= pend;
      // the end downlights: a cone onto each end chair and a pool on the carpet
      for (const cx of [BR.SEATS.L.x, BR.SEATS.R.x]) {
        if (y > END_SEAT_Y - 50 && y < END_SEAT_Y + 20) {
          // the chair itself: a narrow band (the cone is mostly empty air until it lands)
          const u = Math.abs(x - cx) / 22;
          if (u < 1) L = Math.max(L, Math.pow(1 - u, 0.8) * 0.62);
        }
        {
          // where it lands: an elliptical pool on the carpet around the chair's base
          const d = Math.hypot((x - cx) / 36, (y - END_SEAT_Y - 26) / 9);
          if (d < 1) L = Math.max(L, Math.pow(1 - d, 0.7) * 0.72);
        }
        if (y > 20 && y < BR.WALL_FLOOR_Y) {
          // the scallop it throws on the wall behind (a parabola opening downward from the can)
          const u = Math.abs(x - cx) / Math.sqrt((y - 20) * 9);
          if (u < 1) L = Math.max(L, (1 - u) * 0.3 * clamp((y - 20) / 36, 0, 1));
        }
      }
      // phones glow when lit
      if (s.phones?.lit) for (const id of (s.phoneSeats ?? (['L', 'A', 'B', 'C', 'D', 'E', 'R'] as SeatId[]))) {
        const [ppx, ppy] = BR.SEATS[id].phone;
        const st = Math.min(s.phones.step ?? 0, 6);
        const d = Math.hypot((x - ppx - 3) / 10, (y - ppy - st * 3) / 5);
        if (d < 1) L = Math.max(L, (1 - d) * 0.9);
      }
      if (s.laptop) { const d = Math.hypot((x - BR.SEATS.L.x - 10) / 16, (y - END_SEAT_Y + 10) / 12); if (d < 1) L = Math.max(L, (1 - d) * 0.5); }
      return L;
    },
    warm: (x, y) => {
      let L = 0;
      // frosted door glow (closed) / the hallway wedge (open) on the carpet
      if (!open) {
        const d = Math.hypot((x - (D.x0 + D.x1) / 2) / 36, (y - 152) / 7);
        if (y >= BR.WALL_FLOOR_Y && d < 1) L = (1 - d) * 0.5;
        const dw = Math.hypot((x - (D.x0 + D.x1) / 2) / 34, (y - 100) / 56);
        if (y < BR.WALL_FLOOR_Y && dw < 1 && (x < D.x0 - 4 || x > D.x1 + 4)) L = Math.max(L, (1 - dw) * 0.35);
      } else {
        if (y >= BR.WALL_FLOOR_Y) {
          const t = (y - BR.WALL_FLOOR_Y) / 53;
          const xl = D.x0 - t * 150, xr = D.x1 - t * 40;
          if (x >= xl && x <= xr) {
            L = (0.95 - 0.4 * t) * (1 + flash * 0.3);
            // the table top throws a shadow on the carpet in front of it (the door is behind the table)
            if (y > T.apron && y < T.floor + 20 && x > T.near.x0 + (y - T.apron) * 0.9 - 30 && x < T.near.x1 - (y - T.apron) * 2.2) L *= 0.22;
          }
        }
        const d = Math.hypot((x - (D.x0 + D.x1) / 2) / 70, (y - 102) / 64);
        if (d < 1) L = Math.max(L, (1 - d) * 0.7 * (1 + flash));
      }
      // fires light their surroundings (a small, flickering pool)
      for (const q of fires) {
        const d = Math.hypot((x - q.x) / (q.small ? 22 : 34), (y - q.y + 4) / (q.small ? 18 : 26));
        if (d < 1) L = Math.max(L, (1 - d) * 0.95 * q.fl);
      }
      // the spotlight: a hard circle
      if (s.spot) {
        // a theatre spot: hot centre, a crisp rim (one dithered pixel), nothing outside
        const d = Math.hypot(x - s.spot.x, y - s.spot.y) / s.spot.r;
        if (d < 1) L = Math.max(L, d > 0.93 ? (bayer(x, y) < 0.5 ? 0.95 : 0.6) : 0.78 + 0.2 * (1 - d * d));
      }
      return L;
    },
    dither: 0.55,
  };
};

// ------------------------------------------------------------------ public API
export interface BoardroomLayers { far: Buf; mid: Buf; front: Buf; fore: Buf; }

/** Paint + light the boardroom into four layers (far opaque; the others TRANSPARENT where empty). */
export const boardroomLayers = (st: Partial<BoardroomState> & {f: number}): BoardroomLayers => {
  const s: BoardroomState = {...BOARDROOM_DEFAULT, ...st};
  const far = new MatBuf(480, RH), mid = new MatBuf(480, RH), front = new MatBuf(480, RH), fore = new MatBuf(480, RH);
  paintFar(far, s);
  paintMid(mid, s);
  paintTable(front, s);
  if (!s.noNear) for (const cx of BR.NEAR) nearChair(fore, cx);
  paintFires(mid, front, s);
  const L = boardroomLights(s);
  const out = (mb: MatBuf, opaque: boolean) => { const b = new Buf(480, RH, opaque ? PAL.N0 : TRANSPARENT); resolve(mb, L, b, 0); return b; };
  return {far: out(far, true), mid: out(mid, false), front: out(front, false), fore: out(fore, false)};
};

/** Composite the boardroom (optionally with cast callbacks at the right depths) into b. */
export const drawBoardroom = (b: Buf, st: Partial<BoardroomState> & {f: number}, cast: {
  /** figures standing at the back wall (in a doorway): drawn over the wall, under the chairs */
  wall?: (b: Buf) => void;
  /** seated figures' bodies (over the chairs, under the table) */
  seated?: (b: Buf) => void;
  /** seated figures' hands / props on the table (over the table) */
  hands?: (b: Buf) => void;
  /** anyone on the near side of the table (under the near chairs) */
  near?: (b: Buf) => void;
} = {}, shake: [number, number] = [0, 0]) => {
  const L = boardroomLayers(st);
  const [dx, dy] = shake;
  overlay(b, L.far, dx, dy);
  cast.wall?.(b);
  overlay(b, L.mid, dx, dy);
  cast.seated?.(b);
  overlay(b, L.front, dx, dy);
  cast.hands?.(b);
  cast.near?.(b);
  overlay(b, L.fore, dx, dy);
};

// ------------------------------------------------------------------ INSERT: the back of ALYI's board chair (sc 31)
// A close insert: the chair back fills the frame, a brass nameplate with four screws. `screws` = how many are
// out (0..4, one per beat), `plateOff` = the plate has come away (a paler rectangle and four holes remain).
// The maintenance worker's hand and screwdriver belong to the cast/props layer; PLATE_INSERT gives the anchors.
export const PLATE_INSERT = {
  plate: {x0: 176, y0: 86, x1: 304, y1: 118},
  /** the four screw heads, in the order they come out */
  screws: [[184, 94], [296, 94], [184, 110], [296, 110]] as Array<[number, number]>,
};
export const drawChairBackInsert = (b: Buf, st: {f: number; name?: string; screws?: number; plateOff?: boolean}) => {
  const name = st.name ?? 'ALYI';
  const out = st.screws ?? 0;
  const mb = new MatBuf(480, RH);
  // behind the chair: the dark window, the Valley's lights as big soft dots (held, no blur: dithered discs)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) mb.emit(y < 120 ? (bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1) : PAL.N0)(x, y);
  for (let k = 0; k < 18; k++) {
    const cx = Math.floor(hash(k, 1, 91) * 480), cy = 124 + Math.floor(hash(k, 2, 91) * 76), r = 3 + Math.floor(hash(k, 3, 91) * 5);
    const col = hash(k, 4, 91) < 0.3 ? PAL.C3 : hash(k, 4, 91) < 0.7 ? PAL.W3 : PAL.W2;
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r && bayer(x, y) < 0.55) mb.emit(col)(x, y);
  }
  // the chair back: a big leather shape in three vertical channels (two bolsters and the centre), a padded
  // headrest roll at the top; the pendant rims its top edge and lights the headrest roll
  poly([96, RH, 92, 60, 110, 30, 150, 18, 330, 18, 370, 30, 388, 60, 384, RH], mb.mat('br.leather', 1.2));
  // bolsters: lighter toward their outer curve (lit from above-left), a dark seam where they meet the centre
  for (let y = 40; y < RH; y++) {
    for (let x = 100; x < 160; x++) { const u = (x - 100) / 60; if (u < 0.3) mb.shade(0.9)(x, y); else if (u > 0.92) mb.shade(-1.4)(x, y); }
    for (let x = 320; x < 382; x++) { const u = (x - 320) / 62; if (u < 0.08) mb.shade(-1.4)(x, y); else if (u > 0.75) mb.shade(-0.6)(x, y); }
  }
  // the headrest roll
  for (let y = 22; y < 58; y++) for (let x = 104; x < 378; x++) { const v = (y - 22) / 36; if (v < 0.35) mb.shade(1.4)(x, y); else if (v > 0.85) mb.shade(-1.2)(x, y); }
  rect(100, 58, 282, 1, mb.shade(-1.6)); rect(100, 59, 282, 1, mb.shade(0.6));
  line(150, 18, 330, 18, mb.shade(3.2));
  line(110, 30, 150, 18, mb.shade(2.6)); line(330, 18, 370, 30, mb.shade(2));
  line(92, 60, 110, 30, mb.shade(2)); line(92, 60, 96, RH, mb.shade(1.2)); line(388, 60, 384, RH, mb.shade(-0.6));
  // horizontal channel stitching in the centre panel
  for (const ty of [70, 140, 176]) { rect(162, ty, 156, 1, mb.shade(-1.3)); for (let x = 164; x < 318; x += 4) mb.shade(0.9)(x, ty + 1); }
  const P = PLATE_INSERT.plate;
  if (!st.plateOff) {
    rect(P.x0 + 2, P.y0 + 3, P.x1 - P.x0 + 1, P.y1 - P.y0 + 1, mb.shade(-1.6));
    rect(P.x0, P.y0, P.x1 - P.x0 + 1, P.y1 - P.y0 + 1, mb.mat('br.brass', 2));
    rect(P.x0 + 2, P.y0 + 2, P.x1 - P.x0 - 3, 2, mb.shade(1));
    rect(P.x0, P.y0, P.x1 - P.x0 + 1, 1, mb.shade(2));
    rect(P.x0, P.y1, P.x1 - P.x0 + 1, 1, mb.shade(-1.4));
    rect(P.x0 + 1, P.y0 + 1, 1, P.y1 - P.y0 - 1, mb.shade(1.2));
    // the engraved name (display face, engraved = one rung darker, with a lit lower lip)
    const sink = new Buf(1, 1, 0);
    const tw = bigTextWidth(name);
    const tx = Math.round((P.x0 + P.x1 - tw) / 2), ty = P.y0 + 9;
    sink.set = (x: number, y: number) => { mb.shade(-3)(x, y); mb.shade(1.4)(x, y + 1); };
    bigText(sink, name, tx, ty, 0);
  } else {
    // the plate is gone: the leather under it is less faded, four holes
    rect(P.x0, P.y0, P.x1 - P.x0 + 1, P.y1 - P.y0 + 1, mb.mat('br.leather', 1.8));
    rect(P.x0, P.y0, P.x1 - P.x0 + 1, 1, mb.shade(-0.8));
  }
  PLATE_INSERT.screws.forEach(([sx, sy], i) => {
    if (i < out || st.plateOff) { ellipse(sx, sy, 1.6, 1.6, mb.mat('black', -1)); return; }
    ellipse(sx, sy, 3.6, 3.6, mb.mat('metal', 1.6));
    mb.shade(2.4)(sx - 1, sy - 2); mb.shade(2.4)(sx - 2, sy - 1);
    line(sx - 2, sy, sx + 2, sy, mb.shade(-2)); line(sx, sy - 2, sx, sy + 2, mb.shade(-2)); // a cross-head
  });
  resolve(mb, {
    amb: () => 2.4,
    cyan: (x, y) => clamp(1 - Math.hypot((x - 240) / 300, (y + 30) / 150), 0, 1) * 0.7,
    warm: (x, y) => (!st.plateOff && x >= PLATE_INSERT.plate.x0 && x <= PLATE_INSERT.plate.x1 && y >= PLATE_INSERT.plate.y0 && y <= PLATE_INSERT.plate.y1 ? 0.55 : 0),
    dither: 0.5,
  }, b, 0);
};


// ================================================================== INSERTS on the table (room-area 480x203)
// One close camera over the walnut, three framings:
//   'blueprint' (27.16 / 27.35) the PLAN sheet at insert scale: 1 · 2 · 3 ticked, 4 a blank line, NELEH's word in
//               3 drawings (`word` 0..3: nothing · the stroke · the stroke + a loop · + the `?`), illegible at 4x
//   'prop'      (27.30 / 30.21) a clear spot of polished table for the hourglass (TABLE_INSERT.prop), the blueprint's
//               corner at the edge for continuity
//   'laptop'    (30.20) GERG's laptop turned toward us, the screen lit green (terminal rows), its keyboard where the
//               cast's keycaps pop from (TABLE_INSERT.keys)
export const TABLE_INSERT = {
  step4: {x0: 96, y: 150, x1: 292},
  wordAt: [112, 146] as [number, number],
  prop: [300, 132] as [number, number],
  keys: {x0: 176, y0: 150, x1: 318, y1: 170},
};
export const drawTableInsert = (b: Buf, st: {f: number; focus: 'blueprint' | 'prop' | 'laptop'; word?: 0 | 1 | 2 | 3; laptop?: 'off' | 'green'}) => {
  const mb = new MatBuf(480, RH);
  const f = st.f;
  // the walnut top fills the frame: long grain, the pendant's reflection as a broad pale band across it
  rect(0, 0, 480, RH, mb.mat('br.walnut', 0.6));
  for (let k = 0; k < 90; k++) { const y = Math.floor(hash(k, 1, 51) * RH), x = Math.floor(hash(k, 2, 51) * 480); rect(x, y, 30 + Math.floor(hash(k, 3, 51) * 90), 1, mb.shade(-0.7)); }
  for (let y = 24; y < 44; y++) for (let x = 0; x < 480; x++) { const core = y >= 31 && y <= 36; if (core || bayer(x, y) < 0.5 - Math.abs(y - 34) / 24) mb.shade(core ? 2.4 : 1.4)(x, y); }
  if (st.focus === 'blueprint') {
    // the sheet (navy, cyan line), slightly skewed on the table, its near edge off the bottom of frame
    const q = [44, 58, 438, 50, 452, RH + 4, 30, RH + 4];
    poly(q.map((v, i) => (i % 2 ? v + 3 : v + 3)), mb.shade(-1.8));
    poly(q, mb.mat('br.bp', 0.4));
    for (let y = 62; y < RH; y += 8) for (let x = 40; x < 446; x++) if (x % 2 === 0) mb.mat('br.bp', 1.6)(x, y);
    for (let x = 48; x < 446; x += 8) for (let y = 60; y < RH; y++) if (y % 2 === 0) mb.mat('br.bp', 1.6)(x, y);
    line(52, 66, 432, 58, mb.mat('br.bpInk', 0.6)); // the border rule
    const lines = ['1. NOON · VIDEO CALL ✓', '2. BLOG POST ✓', '3. INTERIM CEO ✓'];
    lines.forEach((l, i) => textMat(mb, l, 70, 82 + i * 20, 'br.bpInk', 1.4));
    textMat(mb, '4.', 70, 144, 'br.bpInk', 1.4);
    const S4 = TABLE_INSERT.step4;
    rect(S4.x0, S4.y, S4.x1 - S4.x0, 1, mb.mat('br.bpInk', 1.8)); // the blank is just a line
    // NELEH's word: marker squiggle in 3 drawings (unreadable scribble glyphs), then the `?`
    const w = st.word ?? 0;
    const [wx, wy] = TABLE_INSERT.wordAt;
    const stroke = [0, -2, -4, -3, -1, 0, -2, -5, -4, -2, -1, -3, -5, -3, 0, -1, -3, -2];
    if (w >= 1) stroke.forEach((dy, i) => { mb.mat('paper', 3.2)(wx + i, wy + dy); mb.mat('paper', 3.2)(wx + i, wy + dy + 1); });
    if (w >= 2) for (let a = 0; a < 360; a += 20) mb.mat('paper', 3.2)(Math.round(wx + 24 + Math.cos((a * Math.PI) / 180) * 3), Math.round(wy - 3 + Math.sin((a * Math.PI) / 180) * 3));
    if (w >= 2) for (let i = 0; i < 10; i++) mb.mat('paper', 3.2)(wx + 28 + i, wy - 1 - (i % 3));
    if (w >= 3) textMat(mb, '?', wx + 42, wy - 9, 'paper', 3.2);
    // the little CONTROLS diagram at the right (two boxes and an arrow), in miniature
    for (const [x0, y0, x1, y1] of [[330, 84, 410, 104], [314, 124, 426, 150]] as Array<[number, number, number, number]>) {
      rect(x0, y0, x1 - x0, 1, mb.mat('br.bpInk', 0.6)); rect(x0, y1, x1 - x0 + 1, 1, mb.mat('br.bpInk', 0.6));
      rect(x0, y0, 1, y1 - y0, mb.mat('br.bpInk', 0.6)); rect(x1, y0, 1, y1 - y0, mb.mat('br.bpInk', 0.6));
    }
    rect(370, 105, 2, 16, mb.mat('br.bpInk', 0.6)); poly([366, 119, 376, 119, 371, 124], mb.mat('br.bpInk', 0.6));
  } else if (st.focus === 'prop') {
    // the blueprint's corner at the upper left, the rest is polish: the hourglass stands on TABLE_INSERT.prop
    poly([0, 60, 90, 54, 70, 0, 0, 0], mb.mat('br.bp', 0.4));
    line(0, 60, 90, 54, mb.mat('br.bpInk', 0.4));
    for (let y = 6; y < 56; y += 8) for (let x = 0; x < 80; x++) if (x % 2 === 0 && x < 90 - y * 0.3) mb.mat('br.bp', 1.6)(x, y);
    const [px, py] = TABLE_INSERT.prop;
    ellipse(px, py + 2, 34, 5, mb.shade(-0.8)); // where its shadow will fall (a darker oval of polish)
  } else {
    // GERG's laptop, turned toward us, open: screen lit (green terminal rows), keyboard for the popping caps
    const on = (st.laptop ?? 'green') === 'green';
    poly([150, 150, 344, 150, 372, 190, 122, 190], mb.mat('metal', 1)); // deck
    line(150, 150, 344, 150, mb.shade(1.6));
    const K = TABLE_INSERT.keys;
    for (let y = K.y0 + 3; y < K.y1 + 12; y += 5) for (let x = K.x0 - (y - K.y0) * 0.6; x < K.x1 + (y - K.y0) * 0.6; x += 9) rect(Math.round(x), y, 7, 3, mb.mat('black', 1.4));
    poly([160, 150, 334, 150, 326, 40, 168, 40], mb.mat('metal', -0.2)); // lid
    poly([166, 145, 328, 145, 321, 46, 173, 46], mb.emit(PAL.N0));
    if (on) for (let r = 0; r < 12; r++) {
      const y = 52 + r * 7;
      const len = 20 + Math.floor(hash(r, 3, 61) * 90);
      for (let x = 182 + (r % 3) * 6; x < Math.min(312, 182 + len); x++) if (x % 7 !== 0) mb.emit(r === 11 && x > 182 + len - 4 ? PAL.L3 : hash(x >> 3, r, 62) < 0.3 ? PAL.L3 : PAL.L2)(x, y);
      if (r === 11 && Math.floor(f / 6) % 2 === 0) rect(182 + len + 2, y - 1, 2, 3, mb.emit(PAL.L3));
    }
  }
  resolve(mb, {
    amb: (x, y) => 2.4 - Math.max(0, ((x - 240) / 240) ** 2 + ((y - 101) / 112) ** 2 - 0.5) * 1.8,
    cyan: (x, y) => clamp(1 - Math.hypot((x - 240) / 320, (y - 34) / 90), 0, 1) * 0.55,
    warm: () => 0,
    dither: 0.5,
  }, b, 0);
  // the green screen lights the table around the laptop (a warm-less, cool-green glow: dithered L steps)
  if (st.focus === 'laptop' && (st.laptop ?? 'green') === 'green')
    for (let y = 30; y < RH; y++) for (let x = 90; x < 400; x++) {
      const d = Math.hypot((x - 247) / 150, (y - 120) / 90);
      if (d < 1 && bayer(x, y) < (1 - d) * 0.4) { const c = b.get(x, y); if (c !== PAL.N0) b.set(x, y, (1 - d) > 0.5 ? PAL.L1 : PAL.L0); }
    }
};

const textMat = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const sink = new Buf(1, 1, 0);
  const plot = mb.mat(mat, lvl);
  sink.set = (px: number, py: number) => plot(px, py);
  text(sink, s, x, y, 0);
};

// ================================================================== INSERT: the laptop on the chair (27.15)
/** THE QUIET VOTE: the laptop on the left end chair, close. The screen (LAPTOP_CHAIR.screen) shows the camera-off
 *  tile; pass `screen` to paint the cast's tile (cast.quietvote) instead of the default. It never moves. */
export const LAPTOP_CHAIR = {screen: {x0: 150, y0: 34, x1: 330, y1: 136}};
export const drawLaptopChairInsert = (b: Buf, st: {f: number; screen?: (b: Buf) => void}) => {
  const mb = new MatBuf(480, RH);
  // the chair seat and back fill the lower frame; the dark boardroom behind; the downlight from above
  rect(0, 0, 480, RH, mb.mat('wall', -0.4));
  for (let x = 0; x < 480; x += 6) rect(x, 0, 1, 150, mb.shade(-0.8));
  poly([40, RH, 70, 150, 410, 144, 450, RH], mb.mat('br.leather', 1.4)); // the seat
  line(70, 150, 410, 144, mb.shade(2.4));
  poly([400, 144, 420, 20, 470, 16, 480, 30, 480, RH, 450, RH], mb.mat('br.leather', 1)); // the back, at the right
  line(420, 20, 470, 16, mb.shade(2.4)); line(400, 144, 420, 20, mb.shade(1.4));
  // the laptop: base on the seat, lid up, the screen facing us
  poly([110, 160, 370, 154, 392, 178, 96, 186], mb.mat('metal', 1));
  line(110, 160, 370, 154, mb.shade(1.6));
  for (let y = 164; y < 182; y += 5) for (let x = 124 + (y - 164); x < 366; x += 9) rect(x, y, 7, 2, mb.mat('black', 1));
  poly([118, 158, 362, 152, 352, 24, 128, 28], mb.mat('metal', -0.2));
  const S = LAPTOP_CHAIR.screen;
  poly([126, 150, 354, 145, 346, 32, 134, 36], mb.emit(PAL.N0));
  resolve(mb, {
    amb: () => 2.2,
    cyan: (x, y) => clamp(1 - Math.hypot((x - 240) / 260, (y + 20) / 200), 0, 1) * 0.65,
    warm: () => 0,
    dither: 0.5,
  }, b, 0);
  if (st.screen) st.screen(b);
  else {
    // the camera-off tile: black, a grey initial disc, the label (the cast's chrome replaces this)
    for (let y = S.y0; y <= S.y1; y++) for (let x = S.x0; x <= S.x1; x++) b.set(x, y, PAL.N0);
    const cx = (S.x0 + S.x1) >> 1, cy = S.y0 + 42;
    ellipse(cx, cy, 16, 16, (x, y) => b.set(x, y, PAL.G1));
    ellipse(cx, cy - 5, 6, 6, (x, y) => b.set(x, y, PAL.G3));
    poly([cx - 11, cy + 10, cx - 7, cy + 2, cx + 7, cy + 2, cx + 11, cy + 10], (x, y) => b.set(x, y, PAL.G3));
    const lbl = 'THE QUIET VOTE · camera off';
    text(b, lbl, cx - Math.round(textWidth(lbl) / 2), S.y1 - 14, PAL.G5);
  }
};

// ================================================================== INSERT: through TASYA's door (27.34)
/** Past him, through the open slate door: MACROSOFT's floor, a desk for every employee, already labelled, rows
 *  receding on the slate floor under bright cool light; the plates are tiny and illegible. The door's jambs frame
 *  the view; TASYA's shoulder/sign can overlap from the cast layer. */
export const drawTasyaDoorInsert = (b: Buf, st: {f: number}) => {
  const VX = 240, VY = 70; // the vanishing point, a long way off
  // ceiling (pale panels), back wall (far, bright), slate floor
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (y < VY - 12) { const t = (VY - 12 - y) / (VY - 12); c = ((x - VX) * 12 / (VY - y + 1)) % 16 < 1 ? PAL.G5 : t > 0.6 ? PAL.G6 : bayer(x, y) < t ? PAL.G6 : PAL.P1; }
    else if (y < VY + 6) c = PAL.P1;
    else { const t = (y - VY - 6) / (RH - VY - 6); c = bayer(x, y) < 0.3 + t * 0.4 ? PAL.G4 : PAL.G5; }
    b.set(x, y, c);
  }
  // the ceiling's light rows receding
  for (let k = 1; k < 9; k++) { const y = VY - 12 - Math.round(60 / k); if (y < 0) continue; const hw = Math.round(200 / k); rect(VX - hw, y, hw * 2, 1, (x, yy) => b.set(x, yy, PAL.P2)); }
  // rows of desks in one-point perspective: each a slab with a monitor and a label plate
  for (let row = 0; row < 7; row++) {
    const z = 1 + row * 0.9;
    const y = Math.round(VY + 6 + 120 / z);
    const n = 3 + row * 2;
    const dw = Math.round(66 / z), dh = Math.max(2, Math.round(18 / z));
    for (let k = -Math.floor(n / 2); k <= Math.floor(n / 2); k++) {
      const x = Math.round(VX + (k * 150) / z) - (dw >> 1);
      if (x + dw < 0 || x > 480) continue;
      rect(x, y - dh, dw, dh, (xx, yy) => b.set(xx, yy, PAL.N6));
      rect(x, y - dh, dw, 1, (xx, yy) => b.set(xx, yy, PAL.G6));
      const mw = Math.max(2, Math.round(dw * 0.3)), mh = Math.max(2, Math.round(dh * 0.9));
      rect(x + (dw >> 1) - (mw >> 1), y - dh - mh, mw, mh, (xx, yy) => b.set(xx, yy, PAL.N5));
      // the label, already printed: a pale plate with illegible marks
      const lw = Math.max(2, Math.round(dw * 0.5)), lh = Math.max(1, Math.round(4 / z));
      rect(x + (dw >> 1) - (lw >> 1), y - Math.round(dh * 0.55), lw, lh, (xx, yy) => b.set(xx, yy, PAL.P2));
      if (lw > 8) for (let i = 2; i < lw - 2; i += 2) b.set(x + (dw >> 1) - (lw >> 1) + i, y - Math.round(dh * 0.55) + (lh >> 1), PAL.N5);
      // a chair tucked in
      rect(x + (dw >> 1) - Math.round(dw * 0.15), y, Math.round(dw * 0.3), Math.max(1, Math.round(6 / z)), (xx, yy) => b.set(xx, yy, PAL.N4));
    }
  }
  // the door's slate jambs framing it (thick, near), the key's glint on the right one
  for (let y = 0; y < RH; y++) { for (let x = 0; x < 40; x++) b.set(x, y, x > 34 ? PAL.G2 : PAL.G1); for (let x = 440; x < 480; x++) b.set(x, y, x < 446 ? PAL.G3 : PAL.G2); }
  b.set(443, 96, PAL.W7); b.set(444, 97, PAL.W6);
  void st;
};
