// MR. MAS — shared room: INT. NOPEAI BULLPEN — DAY (the back wall). Home room (ep01 sc 5, 11, 27, 30, 31; recurs).
// Owner: rooms B. A 480x203 room plate (the rail band below it is not ours).
//
// Camera faces the BACK WALL, eye ~y92, shallow stage (figures never scale, so depth stays shallow):
//   left   the hall mouth, a tungsten spill on the carpet (the Q* vault sits in it, sc 31)
//          Rima's whiteboard under the neon NOPE AI wordmark
//   centre the conference room's glass wall (Alyi's reflection lives in pane 2) and ITS DOOR, latch on the left:
//          shut / a crack (Alyi stands in the gap, sc 30) / open (the all-hands doorway, sc 27); nameplate ALYI,
//          and the yellowed `IOU: 20% COMPUTE` note taped to the latch jamb at his shoulder (Jul 5, 2023 [V])
//   right  the windows (daylight), the credenza; the OBSERVER folding chair's mark is in front of them (sc 31)
//   mid    one long bench of four stations; Mas has the END desk, directly in front of the door
//   top    the drop ceiling (one panel out: continuity from sc 5), so THE LANDLORD can remap the ceiling too
// Variants: 'day' (default) · 'allhands' (rows of employee tiles, an aisle to the door) · 'walkout' (a packed box on
// every desk, the crowd in coats with boxes in arms).
// Every surface is painted as (material, level) and lit by palette ramps (engine MatBuf/resolve), like the approved
// dark room; the returned masks let a scene remap floor / ceiling / walls (bullpenLandlord) without touching
// furniture, doors or people.
import {Buf, Plot, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, PalName, stepColor, lightness} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {Mask} from '../mask';
import {text, textWidth} from '../font';
import type {Img} from '../figure';
import {ROOM_W, ROOM_H, RoomOut, newRoomOut, tiny, tinyWidth, tinyPlot, newImg, imgPut, put, h01} from './kit-b';

// ------------------------------------------------------------------ geometry (native px, room coords)
export const BULLPEN = {
  ceilY: 18, // back wall top; the ceiling is y 0..17
  floorY: 146, // back wall base; the carpet is y 146..202
  vp: [240, 92] as [number, number],
  hall: {x0: 12, x1: 50, y0: 58},
  board: {x0: 62, x1: 124, y0: 66, y1: 108},
  neon: {x: 74, y: 40},
  glass: {x0: 132, x1: 320, y0: 38},
  /** door FRAME outer x0..x1 (2px jambs); the leaf fills x0+2..x1-2, y0..floorY */
  door: {x0: 276, x1: 312, y0: 56},
  win: {x0: 334, x1: 470, y0: 32, y1: 124},
  bench: {x0: 96, x1: 330, back: 152, front: 156, panel: 167, foot: 174},
  /** the four stations (x0, x1); Mas has the END desk (index 3), in front of the door */
  stations: [[96, 152], [152, 208], [208, 264], [264, 330]] as Array<[number, number]>,
};
const G = BULLPEN;
/** The door opening (inner, between the jambs). Clip a figure standing IN the doorway to this. */
export const DOOR_OPENING = {x: G.door.x0 + 2, y: G.door.y0, w: G.door.x1 - G.door.x0 - 4, h: G.floorY - G.door.y0};
/** The crack (latch side, left): clip Alyi to this in the 'crack' state — some part of him is always cut off. */
export const DOOR_CRACK = {x: G.door.x0 + 2, y: G.door.y0, w: 9, h: G.floorY - G.door.y0};
/** Glass panes of the conference wall (x0, y0, x1, y1): where Alyi's reflection can live (pane index 1 is his). */
export const GLASS_PANES: Array<[number, number, number, number]> = [[134, 40, 178, 145], [181, 40, 225, 145], [228, 40, 273, 145]];

// ------------------------------------------------------------------ materials (DAY). Ramps: [ambient 'night' slot = day ambient],
// ['cyan' slot = direct daylight from the windows], ['warm' slot = the hall's tungsten]. index 0 unlit .. 7 hottest.
const M = (name: string, amb: PalName[], day: PalName[], warm: PalName[]) => { defineMat(name, amb, day, warm); return name; };
const WALL = M('bp.wall', ['N2', 'N3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'P2'], ['N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const TRIM = M('bp.trim', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const CARPET = M('bp.carpet', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N1', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5']);
const CEIL = M('bp.ceil', ['N2', 'N3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N2', 'N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P1'], ['N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const DESK = M('bp.desk', ['N2', 'N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P2'], ['N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P1', 'P2'], ['N2', 'W1', 'W2', 'W3', 'W5', 'W6', 'W7', 'W8']);
const WHITE = M('bp.white', ['N3', 'G2', 'G3', 'G4', 'G5', 'G6', 'P1', 'P2'], ['G3', 'G4', 'G5', 'G6', 'P1', 'P2', 'P2', 'P2'], ['N3', 'W2', 'W3', 'W5', 'W6', 'W7', 'W8', 'W9']);
const DOOR = M('bp.door', ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'D4', 'W3'], ['D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5'], ['D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W6']);
const STEEL = M('bp.steel', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G5', 'G6'], ['N1', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'P2'], ['N0', 'W0', 'W1', 'W3', 'W5', 'W6', 'W8', 'W9']);
const DARK = M('bp.dark', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'G1', 'G2'], ['N0', 'N1', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']);
const BOX = M('bp.box', ['D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5'], ['D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5', 'W6'], ['D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W7']);
const LEAF = M('bp.leaf', ['N0', 'N1', 'L0', 'L0', 'L1', 'L1', 'L2', 'L2'], ['N1', 'L0', 'L0', 'L1', 'L1', 'L2', 'L2', 'L3'], ['N0', 'L0', 'L0', 'L1', 'L1', 'W4', 'W5', 'W6']);
const POT = M('bp.pot', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);

// regions (for the returned masks)
const R = {none: 0, ceiling: 1, walls: 2, floor: 3, glass: 4, door: 5, window: 6, furniture: 7, hall: 8, dressing: 9, sign: 10, bench: 11} as const;
type RegionName = Exclude<keyof typeof R, 'none'>;
const REGION_NAMES = Object.keys(R).filter((k) => k !== 'none') as RegionName[];

export type BullpenVariant = 'day' | 'allhands' | 'walkout';
export type DoorState = 'shut' | 'crack' | 'open';
export interface BullpenOpts {
  variant?: BullpenVariant;
  door?: DoorState;
  /** the door's nameplate (sc 31: it stays on after the chair plate is unscrewed). null = no plate */
  nameplate?: string | null;
  /** the yellowed IOU note on the latch jamb (Ep1: on; it flutters off in Ep2) */
  iou?: boolean;
  /** empty chair backs per station [0..3] (hide where a seated sprite brings its own chair) */
  chairs?: [boolean, boolean, boolean, boolean];
  /** Mas's end-desk dressing: laptop + water glass (his glass never ripples; set false if the cast draws it) */
  masDesk?: boolean;
  masGlass?: boolean;
  /** all-hands: indices of the employee tiles with a hand up (see ALLHANDS_TILES) */
  handsUp?: number[];
  /** walkout: the coats-on crowd with boxes in arms (default true for 'walkout') */
  crowd?: boolean;
}

// ------------------------------------------------------------------ painting
interface Paint { mb: MatBuf; reg: Uint8Array }
const P = (p: Paint, mat: string, lvl: number, region: number): Plot => {
  const m = p.mb.mat(mat, lvl);
  return (x, y) => { if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return; m(x, y); p.reg[(y | 0) * ROOM_W + (x | 0)] = region; };
};
const E = (p: Paint, col: number, region: number): Plot => {
  const m = p.mb.emit(col);
  return (x, y) => { if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return; m(x, y); p.reg[(y | 0) * ROOM_W + (x | 0)] = region; };
};
const S = (p: Paint, d: number): Plot => p.mb.shade(d);

/** floor x at the bottom of the room for a floor line leaving the wall base at xw */
const floorLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (y - G.vp[1])) / (G.floorY - G.vp[1]);
const ceilLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (G.vp[1] - y)) / (G.vp[1] - G.ceilY);

const paintShell = (p: Paint) => {
  const {ceilY, floorY} = G;
  // ---- ceiling: 2x2 ft tiles in perspective, a crown shadow on the wall
  rect(0, 0, ROOM_W, ceilY, P(p, CEIL, 0, R.ceiling));
  for (let xw = -220; xw <= 700; xw += 24) line(Math.round(xw), ceilY - 1, Math.round(ceilLineX(xw, 0)), 0, S(p, -1.1));
  for (const y of [ceilY - 3, ceilY - 7, ceilY - 12]) rect(0, y, ROOM_W, 1, S(p, -1.1));
  // light panels (troffers), emissive; one is out (continuity with sc 5's night: 'one ceiling lamp out')
  const panel = (xa: number, xb: number, ya: number, yb: number, on: boolean) => {
    for (let y = ya; y <= yb; y++) {
      const l = Math.round(ceilLineX(xa, y)), r = Math.round(ceilLineX(xb, y));
      for (let x = l; x <= r; x++) {
        const edge = x === l || x === r || y === ya || y === yb;
        E(p, on ? (edge ? PAL.G5 : (x + y) % 5 === 0 ? PAL.G6 : PAL.P2) : edge ? PAL.G1 : PAL.G2, R.ceiling)(x, y);
      }
    }
  };
  panel(24, 72, ceilY - 11, ceilY - 8, true);
  panel(168, 216, ceilY - 11, ceilY - 8, true);
  panel(312, 360, ceilY - 11, ceilY - 8, false); // out
  panel(408, 456, ceilY - 11, ceilY - 8, true);
  panel(96, 144, ceilY - 5, ceilY - 3, true);
  panel(264, 312, ceilY - 5, ceilY - 3, true);
  // ---- back wall + crown + baseboard
  rect(0, ceilY, ROOM_W, floorY - ceilY, P(p, WALL, 0, R.walls));
  rect(0, ceilY, ROOM_W, 2, P(p, TRIM, 0.5, R.walls));
  rect(0, ceilY + 2, ROOM_W, 1, S(p, -0.8));
  for (let y = ceilY + 3; y < floorY - 5; y++) for (let x = 0; x < ROOM_W; x++) if (hash(x, y, 41) < 0.004) S(p, -0.5)(x, y);
  rect(0, floorY - 5, ROOM_W, 5, P(p, TRIM, -0.4, R.walls));
  rect(0, floorY - 5, ROOM_W, 1, S(p, 1));
  // ---- carpet: tile seams converging on the vanishing point, a few depth seams, fibre noise
  rect(0, floorY, ROOM_W, ROOM_H - floorY, P(p, CARPET, 0, R.floor));
  for (let xw = -900; xw < 1400; xw += 26) line(Math.round(xw), floorY, Math.round(floorLineX(xw, ROOM_H)), ROOM_H, S(p, -0.9));
  for (const y of [floorY + 4, floorY + 10, floorY + 18, floorY + 29, floorY + 43]) rect(0, y, ROOM_W, 1, S(p, -0.9));
  for (let y = floorY; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) if (hash(x >> 1, y, 13) < 0.08) S(p, 0.45)(x, y);
  rect(0, floorY, ROOM_W, 1, S(p, -1.5)); // contact shadow at the wall base
};

const paintHall = (p: Paint) => {
  const {hall, floorY} = G;
  const x0 = hall.x0, x1 = hall.x1, y0 = hall.y0;
  // the jambs + head (painted trim, catching the warm spill)
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, floorY - y0 + 3, P(p, TRIM, 0.6, R.walls));
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, 1, S(p, 1));
  // the corridor beyond (emissive: it is lit by its own tungsten, not by our room)
  const w = x1 - x0, h = floorY - y0;
  const fx0 = x0 + 13, fx1 = x1 - 11, fy0 = y0 + 20, fy1 = floorY - 30; // the far end of the corridor
  for (let y = y0; y < floorY; y++)
    for (let x = x0; x < x1; x++) {
      let c: number;
      if (x >= fx0 && x < fx1 && y >= fy0 && y < fy1) c = y < fy0 + 2 ? PAL.W6 : Math.hypot(x - (fx0 + fx1) / 2, (y - fy0 - 3) * 1.4) < 7 ? PAL.W8 : PAL.W7; // the far wall, lit
      else {
        // one-point box: which face is this pixel on? (smallest normalised depth wins)
        const dl = x < fx0 ? (x - x0) / (fx0 - x0) : 9, dr = x >= fx1 ? (x1 - 1 - x) / (x1 - 1 - fx1) : 9;
        const dt = y < fy0 ? (y - y0) / (fy0 - y0) : 9, db = y >= fy1 ? (floorY - 1 - y) / (floorY - 1 - fy1) : 9;
        const m = Math.min(dl, dr, dt, db);
        const d = 1 - m; // 1 at the opening, 0 at the far end
        if (m === db) c = (Math.round(d * 12) % 3 === 0) ? PAL.W4 : bayer(x, y) < 0.8 - d * 0.6 ? PAL.W6 : PAL.W5; // floor, board seams
        else if (m === dt) c = bayer(x, y) < 0.6 - d * 0.4 ? PAL.W4 : PAL.W3; // ceiling
        else if (m === dl) c = bayer(x, y) < 0.85 - d * 0.6 ? PAL.W6 : PAL.W5; // left wall catches the bulb
        else c = bayer(x, y) < 0.6 - d * 0.45 ? PAL.W5 : PAL.W4; // right wall
      }
      E(p, c, R.hall)(x, y);
    }
  void w; void h;
  // the corridor's pendant bulb + a door slab on its left wall
  const bx = Math.round((fx0 + fx1) / 2);
  E(p, PAL.W4, R.hall)(bx, fy0); E(p, PAL.W4, R.hall)(bx, fy0 + 1);
  E(p, PAL.W9, R.hall)(bx, fy0 + 2); E(p, PAL.W9, R.hall)(bx + 1, fy0 + 2); E(p, PAL.W8, R.hall)(bx - 1, fy0 + 2);
  // a door slab on the corridor's left wall (seen edge-on, darker), a framed print on its right wall
  for (let y = fy0 + 6; y < floorY - 6; y++) for (let x = x0 + 1; x < x0 + 5; x++) if ((y - fy0 - 6) > (x - x0 - 1) * 2.2 && y < floorY - 6 - (x - x0) * 2) E(p, PAL.W3, R.hall)(x, y);
  for (let y = fy0 + 2; y < fy0 + 12; y++) { E(p, PAL.W3, R.hall)(x1 - 3, y + 1); E(p, PAL.W3, R.hall)(x1 - 4, y); }
  // an EXIT sign hint on the far wall (green, emissive)
  rect(fx0 + 2, fy0 + 5, 6, 3, E(p, PAL.L2, R.hall)); rect(fx0 + 3, fy0 + 6, 4, 1, E(p, PAL.L3, R.hall));
};

const paintBoard = (p: Paint) => {
  const {board} = G;
  rect(board.x0 - 2, board.y0 - 2, board.x1 - board.x0 + 4, board.y1 - board.y0 + 4, P(p, STEEL, 0.5, R.furniture));
  rect(board.x0, board.y0, board.x1 - board.x0, board.y1 - board.y0, P(p, WHITE, 0.4, R.furniture));
  rect(board.x0 - 2, board.y0 - 2, board.x1 - board.x0 + 4, 1, S(p, 1));
  rect(board.x0 + 6, board.y1 + 2, board.x1 - board.x0 - 12, 2, P(p, STEEL, 0, R.furniture)); // tray
  // shadow under the frame
  rect(board.x0 - 1, board.y1 + 2, board.x1 - board.x0 + 3, 1, (x, y) => { if (p.reg[y * ROOM_W + x] === R.walls) S(p, -1)(x, y); });
};

const paintConference = (p: Paint, door: DoorState) => {
  const {glass, floorY} = G;
  const x0 = glass.x0, x1 = glass.x1, y0 = glass.y0;
  // soffit over the glazing
  rect(x0 - 2, y0 - 4, x1 - x0 + 4, 4, P(p, TRIM, 0.2, R.walls));
  rect(x0 - 2, y0 - 4, x1 - x0 + 4, 1, S(p, 0.8));
  // the room behind the glass (lights off: it sits 2 rungs under the bullpen)
  rect(x0, y0, x1 - x0, floorY - y0, P(p, WALL, -1.9, R.glass));
  const cf = floorY - 12; // the conference room's own wall base (it is deeper than our back wall)
  rect(x0, cf, x1 - x0, floorY - cf, P(p, CARPET, -1.6, R.glass));
  rect(x0, cf, x1 - x0, 1, P(p, TRIM, -2, R.glass));
  // a dark wall screen, a credenza, the long table and its chair backs (no product, no logo)
  rect(150, 60, 50, 28, P(p, DARK, -1, R.glass));
  rect(150, 60, 50, 1, S(p, 0.6));
  rect(173, 88, 4, 3, P(p, DARK, -0.5, R.glass));
  rect(206, 118, 60, 8, P(p, DESK, -2.6, R.glass));
  for (let k = 0; k < 5; k++) {
    const cx = 150 + k * 22;
    rect(cx, 112, 12, 10, P(p, DARK, -0.4, R.glass));
    rect(cx + 1, 111, 10, 1, P(p, DARK, 0, R.glass));
  }
  rect(140, 122, 120, 5, P(p, DOOR, -1.8, R.glass)); // table top edge
  rect(140, 122, 120, 1, S(p, 0.8));
  rect(146, 127, 3, 8, P(p, DARK, 0, R.glass)); rect(250, 127, 3, 8, P(p, DARK, 0, R.glass));
  // a plant in the corner of the conference room
  rect(238, 108, 8, 10, P(p, POT, -1, R.glass));
  for (const [ax, ay, bx, by] of [[242, 108, 234, 94], [242, 108, 246, 90], [242, 108, 252, 98], [242, 108, 238, 88]]) line(ax, ay, bx, by, P(p, LEAF, -1, R.glass));
  // mullions + sill rail + the frosted privacy band (dots), all on the glass line
  for (const mx of [x0, 179, 226, 273]) rect(mx - 1, y0, 3, floorY - y0, P(p, TRIM, 0.4, R.walls));
  rect(x0, floorY - 3, G.door.x0 - x0, 3, P(p, TRIM, 0.3, R.walls));
  rect(x0, y0, x1 - x0, 1, P(p, TRIM, 0.5, R.walls));
  // right of the door: one narrow pane to the window wall
  rect(G.door.x1, y0, x1 - G.door.x1, floorY - y0, P(p, WALL, -1.9, R.glass));
  rect(G.door.x1, floorY - 12, x1 - G.door.x1, 12, P(p, CARPET, -1.6, R.glass));
  rect(x1 - 1, y0, 3, floorY - y0, P(p, TRIM, 0.4, R.walls));
  rect(G.door.x1, floorY - 3, x1 - G.door.x1, 3, P(p, TRIM, 0.3, R.walls));
  // transom over the door (glass) + its rail
  rect(G.door.x0, y0, G.door.x1 - G.door.x0, G.door.y0 - y0 - 2, P(p, WALL, -1.9, R.glass));
  // frosted band
  for (let x = x0 + 2; x < x1 - 1; x++)
    for (let y = 98; y < 104; y++) {
      if (x >= G.door.x0 && x < G.door.x1) continue;
      if (p.reg[y * ROOM_W + x] !== R.glass) continue;
      const dot = (y === 99 || y === 102) && (x + (y === 102 ? 2 : 0)) % 4 === 0;
      P(p, WHITE, dot ? -0.2 : -1.6, R.glass)(x, y);
    }
  void door;
};

const paintDoor = (p: Paint, door: DoorState) => {
  const {floorY} = G;
  const {x0, x1, y0} = G.door;
  // frame (painted trim) with the head
  rect(x0, y0 - 2, x1 - x0, 2, P(p, TRIM, 0.6, R.walls));
  rect(x0, y0 - 2, 2, floorY - y0 + 2, P(p, TRIM, 0.6, R.walls));
  rect(x1 - 2, y0 - 2, 2, floorY - y0 + 2, P(p, TRIM, 0.6, R.walls));
  rect(x0, y0 - 2, x1 - x0, 1, S(p, 1));
  const lx0 = x0 + 2, lx1 = x1 - 2; // opening
  if (door === 'shut') {
    rect(lx0, y0, lx1 - lx0, floorY - y0, P(p, DOOR, 0, R.door));
    // vertical grain, a kick plate, the hinge side shadow
    for (let x = lx0 + 1; x < lx1 - 1; x++) if (hash(x, 3, 77) < 0.35) for (let y = y0 + 1; y < floorY - 6; y++) if (hash(x, y >> 3, 5) < 0.8) S(p, hash(x, 1, 9) < 0.5 ? -0.5 : 0.4)(x, y);
    rect(lx0, floorY - 7, lx1 - lx0, 6, P(p, STEEL, 0.2, R.door));
    rect(lx0, floorY - 7, lx1 - lx0, 1, S(p, 0.8));
    rect(lx1 - 1, y0, 1, floorY - y0, S(p, -1));
    rect(lx0, y0, 1, floorY - y0, S(p, 0.6));
    // lever handle on the latch side (left)
    rect(lx0 + 2, 102, 2, 3, P(p, STEEL, 1, R.door));
    rect(lx0 + 2, 102, 6, 1, P(p, STEEL, 1.4, R.door));
    return;
  }
  // beyond the doorway: the dark conference room (lights off) with the table's edge
  rect(lx0, y0, lx1 - lx0, floorY - y0, door === 'open' ? P(p, WALL, -2.6, R.glass) : P(p, DARK, -0.4, R.glass));
  rect(lx0, floorY - 12, lx1 - lx0, 12, P(p, CARPET, -2.6, R.glass));
  rect(lx0, 122, lx1 - lx0, 5, P(p, DOOR, -2.4, R.glass));
  rect(lx0, 122, lx1 - lx0, 1, S(p, 0.6));
  if (door === 'crack') {
    // the leaf swung in a few degrees on its right-hand hinges: the latch edge leaves a gap on the left
    const gx = lx0 + DOOR_CRACK.w; // leaf starts here
    rect(gx, y0, lx1 - gx, floorY - y0, P(p, DOOR, -0.7, R.door));
    for (let x = gx + 2; x < lx1 - 1; x++) if (hash(x, 3, 77) < 0.35) for (let y = y0 + 1; y < floorY - 6; y++) if (hash(x, y >> 3, 5) < 0.8) S(p, hash(x, 1, 9) < 0.5 ? -0.5 : 0.4)(x, y);
    rect(gx, y0, 2, floorY - y0, P(p, DOOR, 0.9, R.door)); // the leaf's edge (its thickness) catches the room
    rect(gx + 2, floorY - 7, lx1 - gx - 2, 6, P(p, STEEL, -0.4, R.door));
    rect(gx + 3, 102, 2, 3, P(p, STEEL, 0.6, R.door));
    rect(gx + 3, 102, 5, 1, P(p, STEEL, 1, R.door));
    // the gap is darkest right at the jamb
    rect(lx0, y0, 1, floorY - y0, P(p, DARK, -1.5, R.glass));
    return;
  }
  // open: the leaf swung all the way in, seen edge-on against the hinge jamb
  rect(lx1 - 4, y0, 3, floorY - y0, P(p, DOOR, -1.2, R.door));
  rect(lx1 - 4, y0, 1, floorY - y0, P(p, DOOR, 0.3, R.door));
};

const paintWindows = (p: Paint) => {
  const {win, floorY} = G;
  const {x0, x1, y0, y1} = win;
  rect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8, P(p, TRIM, 0.8, R.walls));
  rect(x0 - 4, y0 - 4, x1 - x0 + 8, 1, S(p, 1));
  // exterior, emissive: a pale overcast sky, the city in cool greys, haze at the horizon
  const hz = y0 + 58;
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const t = (y - y0) / (hz - y0) + (bayer(x, y) - 0.5) * 0.16;
      E(p, t < 0.18 ? PAL.N8 : t < 0.5 ? PAL.G5 : t < 0.86 ? PAL.G6 : PAL.P1, R.window)(x, y);
    }
  // far towers
  for (let x = x0, k = 0; x <= x1; k++) {
    const w = 6 + Math.floor(h01(k, 1) * 10);
    const top = hz - 8 - Math.floor(h01(k, 2) * 26);
    for (let y = top; y <= y1; y++) for (let i = x; i < Math.min(x + w, x1 + 1); i++) E(p, i === x ? PAL.G5 : PAL.G4, R.window)(i, y);
    for (let j = top + 3; j < y1; j += 3) for (let i = x + 1; i < Math.min(x + w - 1, x1); i += 2) if (hash(i, j, 3) < 0.35) E(p, PAL.G3, R.window)(i, j);
    x += w + 1 + Math.floor(h01(k, 3) * 4);
  }
  // one nearer block on the right, and the tops of trees down on the street
  for (let y = y0 + 40; y <= y1; y++) for (let x = x1 - 26; x <= x1; x++) E(p, x === x1 - 26 ? PAL.G4 : PAL.G3, R.window)(x, y);
  for (let j = y0 + 44; j < y1; j += 4) for (let i = x1 - 23; i < x1; i += 4) { E(p, PAL.N6, R.window)(i, j); E(p, PAL.N6, R.window)(i + 1, j); }
  for (let x = x0; x <= x1 - 28; x++) { const hgt = 6 + Math.round(3 * Math.sin(x * 0.35) + 2 * Math.sin(x * 0.11)); for (let y = y1 - hgt; y <= y1; y++) E(p, (x + y) % 3 === 0 ? PAL.L1 : PAL.L0, R.window)(x, y); }
  // mullions + transom bar + sill
  for (const mx of [379, 425]) rect(mx - 1, y0, 3, y1 - y0 + 1, P(p, TRIM, 0.3, R.walls));
  rect(x0, y0 + 20, x1 - x0 + 1, 2, P(p, TRIM, 0.3, R.walls));
  rect(x0 - 6, y1 + 4, x1 - x0 + 13, 2, P(p, TRIM, 1.2, R.walls));
  rect(x0 - 5, y1 + 6, x1 - x0 + 11, 1, P(p, TRIM, -0.6, R.walls));
  // a low credenza under the windows, a snake plant at its end, a stack of printouts
  const cy = y1 + 9;
  rect(x0 - 2, cy, x1 - x0 + 5, floorY - cy, P(p, DESK, 0, R.furniture));
  rect(x0 - 2, cy, x1 - x0 + 5, 1, S(p, 1.2));
  for (let k = 1; k < 4; k++) rect(x0 - 2 + k * 34, cy + 2, 1, floorY - cy - 3, S(p, -1));
  rect(x0 - 2, floorY - 2, x1 - x0 + 5, 2, P(p, DARK, 0, R.furniture));
  rect(x1 - 14, cy - 8, 9, 8, P(p, POT, 0.5, R.furniture));
  for (const [ax, bx, by] of [[x1 - 12, x1 - 16, cy - 26], [x1 - 10, x1 - 9, cy - 30], [x1 - 8, x1 - 3, cy - 24], [x1 - 11, x1 - 12, cy - 22]]) {
    line(ax, cy - 8, bx, by, P(p, LEAF, 0.6, R.furniture)); line(ax + 1, cy - 8, bx + 1, by + 1, P(p, LEAF, -0.3, R.furniture));
  }
  for (let k = 0; k < 4; k++) rect(x0 + 8, cy - 2 - k * 2, 16, 2, P(p, WHITE, k % 2 ? -0.6 : 0.2, R.furniture));
};

/** Foreground depth: a tall planter cut by the frame's right edge, out of the window light (one rung down). */
const paintForeground = (p: Paint) => {
  const x0 = 452, y0 = 168;
  poly([x0, y0, 480, y0, 480, ROOM_H, x0 + 3, ROOM_H], P(p, POT, -1.6, R.furniture));
  rect(x0, y0, 480 - x0, 2, P(p, POT, -0.6, R.furniture));
  rect(x0 + 1, y0 + 2, 480 - x0, 1, S(p, -1));
  const blades: number[][] = [[458, 168, 450, 120, 455, 119, 463, 168], [464, 168, 462, 110, 468, 112, 469, 168], [470, 168, 478, 122, 482, 124, 476, 168], [455, 168, 440, 136, 444, 134, 461, 168], [466, 168, 472, 100, 476, 102, 471, 168]];
  for (const pts of blades) poly(pts, P(p, LEAF, -1.2, R.furniture));
  for (const pts of blades) line(pts[2], pts[3], pts[0] + 1, pts[1], S(p, 0.8)); // a lit edge on each blade
};

// ------------------------------------------------------------------ the bench (four stations)
const paintBench = (p: Paint, o: BullpenOpts, variant: BullpenVariant) => {
  const {bench, stations, floorY} = G;
  const chairs = o.chairs ?? [true, true, true, true];
  // chair backs behind the desk (drawn first, the desk covers their seats)
  stations.forEach(([sx0, sx1], i) => {
    if (!chairs[i]) return;
    const cx = Math.round((sx0 + sx1) / 2) + 2;
    rect(cx - 8, bench.back - 20, 16, 20, P(p, DARK, 0.8, R.furniture));
    rect(cx - 7, bench.back - 21, 14, 1, P(p, DARK, 1.2, R.furniture));
    rect(cx - 8, bench.back - 20, 1, 20, S(p, -0.6));
    rect(cx + 7, bench.back - 20, 1, 20, S(p, 1)); // the daylight side (windows on the right)
    for (let y = bench.back - 17; y < bench.back - 2; y += 3) rect(cx - 6, y, 12, 1, S(p, -0.5)); // mesh
  });
  // top (seen from a little above), front edge, modesty panel, legs, the dark under it
  rect(bench.x0, bench.back, bench.x1 - bench.x0, bench.front - bench.back, P(p, DESK, 0.4, R.bench));
  rect(bench.x0, bench.front, bench.x1 - bench.x0, 1, P(p, DESK, 1.6, R.bench));
  rect(bench.x0 + 3, bench.front + 1, bench.x1 - bench.x0 - 6, bench.panel - bench.front, P(p, TRIM, 0.2, R.bench));
  rect(bench.x0 + 3, bench.front + 1, bench.x1 - bench.x0 - 6, 1, S(p, -1.2));
  for (const [sx0] of stations.slice(1)) rect(sx0, bench.front + 2, 1, bench.panel - bench.front - 2, S(p, -0.8));
  // legs: a steel frame at each end and at the station joints
  for (const lx of [bench.x0 + 1, ...stations.slice(1).map(([a]) => a - 1), bench.x1 - 3])
    rect(lx, bench.front + 1, 2, bench.foot - bench.front - 1, P(p, STEEL, 0.4, R.bench));
  rect(bench.x0 + 3, bench.panel + 1, bench.x1 - bench.x0 - 6, bench.foot - bench.panel - 1, (x, y) => { S(p, -1.4)(x, y); });
  rect(bench.x0 - 2, bench.foot, bench.x1 - bench.x0 + 4, 1, (x, y) => { if (p.reg[y * ROOM_W + x] === R.floor) S(p, -1.6)(x, y); });
  void floorY;
  // desk dressing per station: a monitor turned toward its sitter (we see its back), a mug, papers
  stations.forEach(([sx0, sx1], i) => {
    if (i === 3) return; // Mas's end desk: see paintMasDesk
    const mx = sx0 + 5;
    rect(mx, bench.back - 16, 18, 13, P(p, DARK, 0.6, R.bench));
    rect(mx, bench.back - 16, 18, 1, S(p, 0.8));
    rect(mx + 17, bench.back - 15, 1, 11, P(p, WHITE, -0.6, R.bench)); // the screen's edge light, toward the sitter
    rect(mx + 7, bench.back - 3, 4, 3, P(p, STEEL, 0, R.bench));
    rect(mx + 4, bench.back, 10, 1, P(p, STEEL, 0.6, R.bench));
    if (variant !== 'walkout') {
      if (i === 0) { rect(sx1 - 12, bench.back - 4, 5, 5, P(p, WHITE, 0.2, R.bench)); rect(sx1 - 7, bench.back - 3, 1, 2, P(p, WHITE, -0.4, R.bench)); }
      if (i === 1) for (let k = 0; k < 3; k++) rect(sx1 - 18, bench.back + 1 - k, 12, 1, P(p, WHITE, k % 2 ? -0.5 : 0.3, R.bench));
      if (i === 2) { rect(sx1 - 12, bench.back - 6, 6, 6, P(p, POT, 0.4, R.bench)); for (const d of [-3, 0, 3]) line(sx1 - 9, bench.back - 6, sx1 - 9 + d, bench.back - 12, P(p, LEAF, 0.5, R.bench)); }
    }
  });
};

/** Mas's end desk: a closed-ish laptop (lid back to us), and the water glass. */
const paintMasDesk = (p: Paint, o: BullpenOpts) => {
  const {bench} = G;
  if (o.masDesk === false) return;
  const [sx0] = G.stations[3];
  // laptop to his right-hand side of the desk (screen-left), lid back toward us, a cyan glow on its inner edge
  const lx = sx0 + 4;
  poly([lx, bench.back - 12, lx + 20, bench.back - 12, lx + 22, bench.back, lx - 1, bench.back], P(p, STEEL, 0.3, R.bench));
  rect(lx, bench.back - 12, 20, 1, S(p, 1));
  rect(lx + 8, bench.back - 8, 4, 3, P(p, WHITE, 0.4, R.bench)); // a plain round sticker, no logo
}

// ------------------------------------------------------------------ direct-colour details (after the light pass)
const neonSign = (b: Buf) => {
  const s = 'NOPE AI';
  const {x, y} = G.neon;
  const w = textWidth(s);
  // an acrylic backer with standoffs, then the tubes: C6 body, C8 core row, a C4 cast shadow 1px down-right
  for (let j = -3; j < 10; j++) for (let i = -4; i < w + 4; i++) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), -1));
  for (const [sx, sy] of [[x - 3, y - 2], [x + w + 2, y - 2], [x - 3, y + 8], [x + w + 2, y + 8]]) b.set(sx, sy, PAL.G5);
  text(b, s, x + 1, y + 1, PAL.C3);
  text(b, s, x, y, PAL.C6);
  for (let i = 0; i < w; i++) if (b.get(x + i, y) === PAL.C6 && b.get(x + i, y + 1) === PAL.C6) b.set(x + i, y, PAL.C8);
};

const boardInk = (b: Buf) => {
  const {board} = G;
  const bx = board.x0, by = board.y0;
  tiny(b, 'LOW-KEY', bx + 6, by + 5, PAL.R2);
  rect(bx + 5, by + 11, tinyWidth('LOW-KEY') + 2, 1, b.ink(PAL.R2));
  rect(bx + 6, by + 13, tinyWidth('LOW-KEY'), 1, b.ink(PAL.R2));
  // a flow: box -> arrow -> box -> ?  (blue marker), a scribble column (black marker)
  const ink = PAL.F4;
  const box = (x: number, y: number, w: number, h: number) => { rect(x, y, w, 1, b.ink(ink)); rect(x, y + h - 1, w, 1, b.ink(ink)); rect(x, y, 1, h, b.ink(ink)); rect(x + w - 1, y, 1, h, b.ink(ink)); };
  box(bx + 6, by + 20, 12, 8); box(bx + 28, by + 20, 12, 8);
  line(bx + 19, by + 24, bx + 26, by + 24, b.ink(ink)); b.set(bx + 25, by + 23, ink); b.set(bx + 25, by + 25, ink);
  line(bx + 41, by + 24, bx + 46, by + 24, b.ink(ink));
  tiny(b, '?', bx + 48, by + 22, PAL.N2);
  for (let k = 0; k < 4; k++) { const y = by + 32 + k * 2; line(bx + 6, y, bx + 20 + ((k * 7) % 12), y + (k % 2), b.ink(PAL.N3)); }
  tiny(b, '1M', bx + 44, by + 31, PAL.N2);
  // eraser ghosting (a lighter smear) and a marker on the tray
  for (let x = bx + 30; x < bx + 54; x++) if ((x & 1) === 0) b.set(x, by + 38, PAL.G6);
  rect(bx + 14, board.y1 + 1, 6, 1, b.ink(PAL.R2)); rect(bx + 24, board.y1 + 1, 6, 1, b.ink(PAL.F3));
};

const nameplate = (b: Buf, s: string, door: DoorState) => {
  const lx0 = G.door.x0 + 2, lx1 = G.door.x1 - 2;
  if (door === 'open') return;
  const leafX0 = door === 'crack' ? lx0 + DOOR_CRACK.w + 2 : lx0;
  const w = tinyWidth(s) + 6;
  const x = Math.round((leafX0 + lx1) / 2 - w / 2) + (door === 'crack' ? 1 : 0), y = 72;
  rect(x, y, w, 9, b.ink(PAL.G5));
  rect(x, y, w, 1, b.ink(PAL.G6));
  rect(x, y + 8, w, 1, b.ink(PAL.G3));
  rect(x + w - 1, y, 1, 9, b.ink(PAL.G3));
  tiny(b, s, x + 3, y + 2, PAL.N1);
};

/** The yellowed note taped to the latch jamb, at shoulder height: `IOU: 20%` / `COMPUTE`. */
export const IOU_NOTE = {x: G.door.x0 - 29, y: 86, w: 35, h: 17};
const iouNote = (b: Buf) => {
  const {x, y, w, h} = IOU_NOTE;
  // slight droop: the right half sits 1px lower (taped at the top-left and top-right corners only)
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const yy = y + j + (i > w * 0.6 ? 1 : 0);
      const edge = j === h - 1 || i === w - 1;
      b.set(x + i, yy, edge ? PAL.P0 : (i + j * 3) % 11 === 0 ? PAL.P1 : PAL.W8);
    }
  // the curled bottom-right corner
  b.set(x + w - 1, y + h, PAL.P1); b.set(x + w - 2, y + h, PAL.P1); b.set(x + w - 1, y + h - 1, PAL.W7);
  // age spots
  for (const [i, j] of [[3, 12], [22, 3], [26, 13], [9, 2]]) b.set(x + i, y + j, PAL.P1);
  tiny(b, 'IOU: 20%', x + 3, y + 3, PAL.I0);
  tiny(b, 'COMPUTE', x + 3, y + 10, PAL.I0);
  // tape (translucent: one rung up of what it covers, with a bright edge)
  for (const tx of [x - 2, x + w - 6]) for (let i = 0; i < 7; i++) for (let j = -1; j < 2; j++) { const X = tx + i, Y = y + j; b.set(X, Y, j === -1 ? PAL.P2 : stepColor(b.get(X, Y), 1)); }
};

/** Glass sheen: two thin diagonal streaks per pane (one rung up), so the wall reads as glass in a still. */
const glassSheen = (b: Buf, reg: Uint8Array) => {
  for (const [x0, y0, x1, y1] of GLASS_PANES) {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        if (reg[y * ROOM_W + x] !== R.glass) continue;
        const u = x - x0 + (y - y0) * 0.55;
        const s1 = u > 20 && u < 23, s2 = u > 27 && u < 28.2;
        if (s1 || s2) b.set(x, y, stepColor(b.get(x, y), 1));
      }
  }
  // the narrow pane right of the door + the transom
  for (let y = G.glass.y0; y < G.floorY; y++) for (let x = G.door.x1; x < G.glass.x1; x++) if (reg[y * ROOM_W + x] === R.glass && ((x - G.door.x1) + (y - G.glass.y0) * 0.55) % 38 < 1.4) b.set(x, y, stepColor(b.get(x, y), 1));
};

/** The windows' own sheen + a faint reflection of the ceiling panels. */
const windowSheen = (b: Buf, reg: Uint8Array) => {
  const {x0, x1, y0, y1} = G.win;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (reg[y * ROOM_W + x] !== R.window) continue;
    const u = (x - x0) + (y - y0) * 0.6;
    if (u % 46 > 30 && u % 46 < 32) b.set(x, y, stepColor(b.get(x, y), 1));
  }
};

const masGlass = (b: Buf) => {
  // Mas's water glass on the end desk: a flat water line (it never ripples)
  const x = G.stations[3][1] - 16, y = G.bench.back - 11, w = 5, h = 12;
  for (let j = 0; j < h; j++) {
    b.set(x, y + j, PAL.G6);
    b.set(x + w - 1, y + j, PAL.G4);
    if (j > 3) for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, i === 1 ? PAL.C7 : PAL.C6);
    else for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, PAL.G5);
  }
  for (let i = 1; i < w - 1; i++) b.set(x + i, y + 4, PAL.C8); // the one flat row of the water line
  for (let i = 0; i < w; i++) b.set(x + i, y + h, PAL.G3);
};

// ------------------------------------------------------------------ light
const lightsDay = (door: DoorState) => {
  const {win, hall, floorY, bench} = G;
  return {
    amb: (x: number, y: number) => {
      let a = 5.4;
      // the room is brighter toward the windows, a touch darker at the far left
      a += clamp((x - 120) / 360, -0.4, 0.8);
      // the ceiling panels wash the upper wall in soft scallops
      if (y > G.ceilY && y < 70) for (const cx of [48, 192, 432]) { const d = Math.hypot((x - cx) / 60, (y - G.ceilY) / 34); if (d < 1) a += (1 - d) * 0.9; }
      // under the desk + the floor right behind it: occluded
      if (y > bench.panel && y <= bench.foot + 1 && x > bench.x0 && x < bench.x1) a -= 1.2;
      if (y >= floorY && y < floorY + 4) a -= 0.6;
      // carpet falls off toward camera (the panels are behind us... and the front of frame is darker)
      if (y >= floorY) a -= (y - floorY) / 110;
      return a;
    },
    cyan: (x: number, y: number) => {
      // DIRECT DAYLIGHT (this rig uses the 'cyan' slot as the window light): patches on the carpet from each pane,
      // falling toward camera-left; the window wall's glow; the desk top nearest the glass
      let L = 0;
      if (y < floorY) { const dw = Math.hypot((x - (win.x0 + win.x1) / 2) / 130, (y - (win.y0 + win.y1) / 2) / 100); if (dw < 1) L = Math.max(L, (1 - dw) * 0.62); }
      if (y >= floorY + 2) {
        const t = (y - floorY) / (ROOM_H - floorY);
        const shift = t * 64;
        for (const [a, bb] of [[win.x0 + 1, 377], [381, 423], [427, win.x1]]) {
          const l = a - shift, r = bb - shift - 4;
          if (x >= l && x <= r) L = Math.max(L, 0.78 - t * 0.2);
        }
        if (y > bench.panel && y <= bench.foot + 3 && x > bench.x0 && x < bench.x1) L *= 0.2;
      }
      if (y >= bench.back && y <= bench.front && x > 250) L = Math.max(L, clamp((x - 250) / 120, 0, 1) * 0.66);
      return L;
    },
    warm: (x: number, y: number) => {
      // the hall's tungsten: a spill on the carpet widening toward camera, and a warm lick on the jambs
      let L = 0;
      if (y >= floorY) {
        const t = (y - floorY) / (ROOM_H - floorY);
        const l = hall.x0 - 2 - t * 26, r = hall.x1 + 2 + t * 64;
        if (x >= l && x <= r) {
          const u = (x - l) / (r - l);
          L = (1.02 - t * 0.3) * (1 - Math.pow(Math.abs(u - 0.42) * 2, 2) * 0.5);
        }
      } else if (x > hall.x0 - 12 && x < hall.x1 + 14 && y > hall.y0 - 8) {
        const d = Math.min(Math.abs(x - hall.x0), Math.abs(x - hall.x1)) / 14;
        L = Math.max(0, 0.72 - d * 0.6);
      }
      void door;
      return L;
    },
    dither: 0.65,
  };
};

// ------------------------------------------------------------------ employee tiles (ALL-HANDS) — reused by the tile avalanche kit
export const EMP_TILE = {w: 22, h: 22};
const SKINS: Array<[number, number, number]> = [[PAL.S2, PAL.S3, PAL.S4], [PAL.S3, PAL.S4, PAL.S5], [PAL.S4, PAL.S5, PAL.S6], [PAL.S1, PAL.S2, PAL.S3], [PAL.S3, PAL.S5, PAL.S6]];
const HAIRS: Array<[number, number]> = [[PAL.B0, PAL.B1], [PAL.B1, PAL.B2], [PAL.B2, PAL.B3], [PAL.B3, PAL.B4], [PAL.G3, PAL.G5], [PAL.N1, PAL.N2]];
const TOPS: Array<[number, number, number]> = [[PAL.G1, PAL.G2, PAL.G3], [PAL.F2, PAL.F3, PAL.F4], [PAL.L0, PAL.L1, PAL.L2], [PAL.U1, PAL.U2, PAL.U3], [PAL.D2, PAL.D3, PAL.D4], [PAL.N4, PAL.N5, PAL.N6], [PAL.G3, PAL.G4, PAL.G5], [PAL.R0, PAL.R1, PAL.R2]];
const BGS: number[] = [PAL.N3, PAL.G2, PAL.N4, PAL.F1, PAL.U0, PAL.D1, PAL.G1, PAL.N5];
/**
 * One employee as a video tile: a face in a square (22x22), looking toward screen-right (the door) unless look=0.
 * `hand` raises one hand out through the top of the frame (the "one hand up in the crowd"). Deterministic per seed.
 * The Img is 22 wide x 28 tall: 6 rows of headroom above the frame for the raised hand (the tile itself is rows 6..27).
 */
export const employeeTile = (seed: number, o: {hand?: boolean; look?: -1 | 0 | 1} = {}): Img => {
  const {w} = EMP_TILE;
  const img = newImg(w, EMP_TILE.h + 6);
  const T = 6; // tile top row
  const r = (k: number) => h01(seed, k);
  const skin = SKINS[Math.floor(r(1) * SKINS.length)], hair = HAIRS[Math.floor(r(2) * HAIRS.length)];
  const top = TOPS[Math.floor(r(3) * TOPS.length)], bg = BGS[Math.floor(r(4) * BGS.length)];
  const style = Math.floor(r(5) * 6); // hair style
  const look = o.look ?? 1;
  const set = (x: number, y: number, c: number) => imgPut(img, x, y + T, c);
  // frame + webcam background (a flat wall and one lighter shape: a shelf, a window, a plant)
  for (let y = 0; y < 22; y++) for (let x = 0; x < w; x++) set(x, y, x === 0 || y === 0 || x === w - 1 || y === 21 ? PAL.N0 : bg);
  const bgShape = Math.floor(r(6) * 3);
  if (bgShape === 0) for (let x = 2; x < 9; x++) set(x, 6, stepColor(bg, 2));
  if (bgShape === 1) for (let y = 2; y < 9; y++) for (let x = 14; x < 20; x++) set(x, y, stepColor(bg, (x + y) % 2 ? 1 : 2));
  if (bgShape === 2) for (let y = 4; y < 10; y++) set(3 + (y % 2), y, PAL.L1);
  // shoulders / top
  for (let y = 15; y < 21; y++) for (let x = 3; x < 19; x++) {
    const inside = Math.abs(x - 11) < 5 + (y - 15) * 1.2;
    if (!inside) continue;
    set(x, y, x > 13 ? top[2] : x < 7 ? top[0] : top[1]);
  }
  for (let x = 9; x < 13; x++) set(x, 15, skin[1]); // neck
  set(10, 16, skin[0]); set(11, 16, skin[1]);
  // head: 8 wide x 9 tall, lit from screen-right (the windows)
  const hx = 7 + (look > 0 ? 1 : look < 0 ? -1 : 0), hy = 5;
  const HEAD = ['..####..', '.######.', '########', '########', '########', '########', '.######.', '..####..', '...##...'];
  HEAD.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') set(hx + i, hy + j, i >= 5 ? skin[2] : i <= 1 ? skin[0] : skin[1]); }));
  // hair styles (each a small mask over the head)
  const hairPx = (i: number, j: number) => set(hx + i, hy + j, i >= 5 ? hair[1] : hair[0]);
  const hrow = (j: number, a: number, b2: number) => { for (let i = a; i <= b2; i++) hairPx(i, j); };
  if (style === 0) { hrow(-1, 2, 5); hrow(0, 1, 6); hrow(1, 0, 7); hrow(2, 0, 1); }
  else if (style === 1) { hrow(-1, 1, 6); hrow(0, 0, 7); hrow(1, 0, 7); hrow(2, 0, 1); for (let j = 2; j < 9; j++) { hairPx(-1, j); hairPx(0, j); } hairPx(8, 2); hairPx(8, 3); }
  else if (style === 2) { hrow(-2, 3, 5); hrow(-1, 2, 6); hrow(0, 1, 6); hrow(1, 0, 7); }
  else if (style === 3) { for (let j = -1; j < 3; j++) for (let i = -1; i < 9; i++) if ((i + j) % 2 === 0 || j < 1) hairPx(i, j); }
  else if (style === 4) { hrow(0, 1, 6); hrow(1, 0, 7); }
  else { hrow(-1, 1, 6); hrow(0, 0, 7); hrow(1, 0, 3); for (let j = 1; j < 10; j++) { hairPx(-1, j); if (j > 3) hairPx(8, j); } }
  // face: eyes turned toward the door, a mouth
  const ex = look > 0 ? 3 : look < 0 ? 1 : 2;
  set(hx + ex, hy + 4, PAL.N1); set(hx + ex + 3, hy + 4, PAL.N1);
  set(hx + ex + 1, hy + 7, skin[0]); set(hx + ex + 2, hy + 7, skin[0]);
  // the name bar
  for (let x = 2; x < 10; x++) set(x, 19, PAL.N0);
  for (let x = 3; x < 3 + 2 + Math.floor(r(7) * 5); x++) set(x, 19, PAL.G4);
  if (o.hand) {
    // an arm out through the top edge of the frame (sleeve, then the wrist), the hand open above the tile
    for (let y = -1; y < 16; y++) { set(16, y, PAL.N0); set(17, y, top[1]); set(18, y, top[2]); set(19, y, PAL.N0); }
    const HAND = ['.#.#.', '.####', '#####', '#####', '.###.', '..##.'];
    HAND.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') set(15 + i, -6 + j, i >= 3 ? skin[2] : skin[1]); }));
    set(14, -3, PAL.N0); set(14, -4, PAL.N0); set(15, -6, PAL.N0); set(20, -5, PAL.N0);
    for (let x = 15; x < 21; x++) if (x !== 17 && x !== 18) set(x, 0, PAL.N0);
  }
  return img;
};

/** The all-hands seating: rows of tiles (x, y = tile top-left), an aisle kept clear in front of the door. */
export const ALLHANDS_TILES: Array<{x: number; y: number; seed: number}> = (() => {
  const out: Array<{x: number; y: number; seed: number}> = [];
  const rows: Array<[number, number, number]> = [[98, 8, 0], [122, 21, 1], [148, 2, 2], [174, 15, 3]]; // [top y, x offset, row]
  let seed = 11;
  for (const [y, off, row] of rows) {
    for (let x = off - 26; x < ROOM_W; x += 26) {
      // the aisle to the door: the rows in front of the glass wall keep clear of it
      if (row < 2 && x + 22 > G.door.x0 - 34 && x < G.door.x1 + 12) continue;
      out.push({x, y, seed: seed++});
    }
  }
  return out;
})();

// ------------------------------------------------------------------ the walkout: boxes and the coats-on crowd
/** A packed kraft box (w 20 x h 14) with whatever didn't fit sticking out of the top. kind 0..4 */
export const packedBox = (kind: number): Img => {
  const img = newImg(22, 26);
  const T = 12; // the box's top row (things stick out above it)
  const W2 = 20, H2 = 14;
  for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
    const side = x >= W2 - 5; // the right side face (turned to the window light)
    imgPut(img, x, T + y, y === 0 ? PAL.W5 : side ? (y === 1 ? PAL.W5 : PAL.W4) : y === 1 ? PAL.W4 : PAL.D4);
  }
  for (let x = 0; x < W2 - 5; x++) imgPut(img, x, T + 2, PAL.D3); // the top flap's shadow
  for (let y = 3; y < H2; y++) imgPut(img, 7, T + y, PAL.P0); // packing tape
  for (let y = 3; y < H2; y++) imgPut(img, 8, T + y, PAL.P1);
  for (let x = 0; x < W2; x++) imgPut(img, x, T + H2 - 1, PAL.D2);
  imgPut(img, 2, T + 6, PAL.D3); imgPut(img, 3, T + 6, PAL.D3); imgPut(img, 11, T + 8, PAL.D3); // hand holes / scuffs
  if (kind === 0) { // a desk plant
    for (let y = 6; y < 13; y++) imgPut(img, 12, y, PAL.L1);
    for (const [x, y] of [[10, 4], [11, 5], [13, 3], [14, 4], [9, 6], [15, 6], [12, 2]]) imgPut(img, x, y, PAL.L2);
    for (const [x, y] of [[10, 5], [14, 5], [12, 3]]) imgPut(img, x, y, PAL.L3);
  } else if (kind === 1) { // a desk lamp's arm
    for (let k = 0; k < 7; k++) imgPut(img, 4 + k, 11 - k, PAL.G4);
    for (let x = 9; x < 15; x++) imgPut(img, x, 3, PAL.G5);
    for (let x = 10; x < 14; x++) imgPut(img, x, 4, PAL.G3);
  } else if (kind === 2) { // a rolled poster + a monitor cable
    for (let y = 2; y < 13; y++) { imgPut(img, 14, y, PAL.P1); imgPut(img, 15, y, PAL.P2); }
    imgPut(img, 14, 1, PAL.P0); imgPut(img, 15, 1, PAL.P0);
    for (let k = 0; k < 6; k++) imgPut(img, 3 + k, 11 - (k % 3), PAL.N1);
  } else if (kind === 3) { // a mug and a stack of notebooks
    for (let y = 8; y < 13; y++) for (let x = 3; x < 8; x++) imgPut(img, x, y, x === 7 ? PAL.G4 : PAL.P2);
    imgPut(img, 8, 9, PAL.P1); imgPut(img, 8, 10, PAL.P1);
    for (let k = 0; k < 3; k++) for (let x = 11; x < 18; x++) imgPut(img, x, 10 - k * 1, [PAL.F4, PAL.L2, PAL.U3][k]);
  } else { // a small trophy (a generic cup, no text)
    for (let y = 5; y < 9; y++) for (let x = 9; x < 14; x++) imgPut(img, x, y, x === 13 ? PAL.W6 : PAL.W7);
    imgPut(img, 8, 6, PAL.W6); imgPut(img, 14, 6, PAL.W6);
    for (let y = 9; y < 12; y++) imgPut(img, 11, y, PAL.W6);
    for (let x = 9; x < 14; x++) imgPut(img, x, 12, PAL.W5);
  }
  return img;
};

const COATS: Array<[number, number, number, number]> = [
  [PAL.D2, PAL.D3, PAL.D4, PAL.W4], // camel trench
  [PAL.F1, PAL.F2, PAL.F3, PAL.F5], // navy peacoat
  [PAL.G1, PAL.G2, PAL.G3, PAL.G5], // charcoal
  [PAL.L0, PAL.L1, PAL.L2, PAL.L3], // green parka
  [PAL.U1, PAL.U2, PAL.U3, PAL.U4], // plum
  [PAL.N3, PAL.N4, PAL.N6, PAL.N7], // slate-blue puffer
  [PAL.G2, PAL.G3, PAL.G4, PAL.G6], // light grey
];
export const EXTRA_H = 78;
export const EXTRA_W = 30;
/**
 * A walkout extra: an employee in a coat, standing 3/4 toward screen-right (flip the Img for screen-left), a packed
 * box held at the waist. 30 x 78, feet on the bottom row (foot anchor = (15, 77)); about 5.8 heads, like the cast.
 * Lit by daylight from screen-right (the windows). Deterministic per seed; `coat` picks the coat (0..6) explicitly.
 */
export const walkoutExtra = (seed: number, o: {box?: boolean; coat?: number} = {}): Img => {
  const img = newImg(EXTRA_W, EXTRA_H);
  const r = (k: number) => h01(seed, 20 + k);
  const coat = COATS[(o.coat ?? Math.floor(r(1) * COATS.length)) % COATS.length];
  const skin = SKINS[Math.floor(r(2) * SKINS.length)];
  const hair = HAIRS[Math.floor(r(3) * HAIRS.length)];
  const style = Math.floor(r(4) * 6);
  const long = r(5) < 0.55; // long coat vs jacket
  const puffer = coat === COATS[5];
  const pants = [PAL.N1, PAL.G1, PAL.N2, PAL.D1][Math.floor(r(6) * 4)];
  const dy = Math.floor(r(9) * 4); // height variation: shorter people start lower (never a scaled sprite)
  const O = PAL.N0; // outline
  const cx = 15;
  const set = (x: number, y: number, c: number) => imgPut(img, x, y + dy, c);
  const setAbs = (x: number, y: number, c: number) => imgPut(img, x, y, c);
  const legTop = (long ? 58 : 48);
  // legs + shoes (the feet stay on the bottom row whatever the height)
  for (let y = legTop + dy; y < 75; y++) { for (let x = cx - 6; x < cx - 1; x++) setAbs(x, y, x === cx - 6 ? O : pants); for (let x = cx + 1; x < cx + 6; x++) setAbs(x, y, x === cx + 5 ? stepColor(pants, 1) : pants); }
  for (let x = cx - 7; x < cx - 1; x++) { setAbs(x, 75, O); setAbs(x, 76, O); setAbs(x, 77, O); }
  for (let x = cx + 1; x < cx + 8; x++) { setAbs(x, 75, PAL.N1); setAbs(x, 76, O); setAbs(x, 77, O); }
  setAbs(cx + 6, 75, PAL.G2);
  // coat body: shoulders at y 17, flaring to the hem
  const hem = legTop;
  for (let y = 16; y < hem; y++) {
    const half = y < 19 ? 7 + (y - 16) : 9 + Math.floor((y - 19) / 13);
    for (let x = cx - half; x <= cx + half; x++) {
      let c = coat[1];
      if (x >= cx + half - 3) c = coat[2]; // daylight side
      if (x === cx + half) c = coat[3]; // rim from the windows
      if (x <= cx - half + 2) c = coat[0];
      if (x === cx - half) c = O;
      if (puffer && (y - 16) % 6 === 0 && x > cx - half) c = coat[0];
      set(x, y, c);
    }
    if (y === hem - 1) for (let x = cx - half; x <= cx + half; x++) set(x, y, coat[0]);
  }
  // lapels / collar: a V opening showing the top underneath
  const under = [PAL.P1, PAL.G5, PAL.N3, PAL.F4, PAL.R1][Math.floor(r(7) * 5)];
  for (let j = 0; j < 6; j++) for (let x = cx - Math.max(0, 2 - Math.floor(j / 2)); x <= cx + Math.max(0, 2 - Math.floor(j / 2)); x++) set(x, 17 + j, under);
  for (let j = 0; j < 9; j++) { set(cx - 3 + Math.floor(j / 3), 16 + j, coat[0]); set(cx + 3 - Math.floor(j / 3), 16 + j, coat[3]); }
  set(cx - 6, 15, coat[2]); set(cx - 5, 14, coat[2]); set(cx + 6, 15, coat[3]); set(cx + 5, 14, coat[3]); // collar points
  // neck
  for (let y = 13; y < 17; y++) for (let x = cx - 2; x <= cx + 2; x++) set(x, y, x > cx ? skin[1] : skin[0]);
  // head: 12 wide x 13 tall, turned 3/4 toward screen-right (the far eye near the edge, the nose on the profile)
  const HEAD = ['....#####...', '..#########.', '.##########.', '.###########', '.###########', '.###########', '.###########', '.###########', '.##########.', '..#########.', '..########..', '...######...', '....####....'];
  const hx = cx - 6, hy = 0;
  HEAD.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') set(hx + i, hy + j, i >= 9 ? skin[2] : i <= 2 ? skin[0] : skin[1]); }));
  set(hx + 3, hy + 6, skin[0]); set(hx + 3, hy + 7, skin[0]); set(hx + 4, hy + 6, skin[1]); // the near ear
  set(hx + 12, hy + 7, skin[2]); // the nose's tip past the profile
  set(hx + 7, hy + 5, PAL.N1); set(hx + 10, hy + 5, PAL.N1); // eyes (the far one close to the profile)
  set(hx + 7, hy + 4, skin[0]); set(hx + 10, hy + 4, skin[0]); // brows as a shadow
  set(hx + 11, hy + 8, skin[1]); // nose shadow
  set(hx + 8, hy + 10, skin[0]); set(hx + 9, hy + 10, skin[0]); // mouth
  const hp = (i: number, j: number) => set(hx + i, hy + j, i >= 9 ? hair[1] : hair[0]);
  const hr = (j: number, a: number, b2: number) => { for (let i = a; i <= b2; i++) hp(i, j); };
  const back = (j0: number, j1: number, w: number) => { for (let j = j0; j <= j1; j++) for (let i = 1; i < 1 + w; i++) hp(i, j); };
  if (style === 0) { hr(-1, 3, 9); hr(0, 1, 11); hr(1, 1, 11); hr(2, 1, 6); back(3, 5, 3); }
  else if (style === 1) { hr(-1, 3, 9); hr(0, 1, 11); hr(1, 1, 11); hr(2, 1, 7); back(3, 13, 3); hp(0, 8); hp(0, 9); hp(0, 10); hp(0, 11); hp(4, 3); hp(4, 4); }
  else if (style === 2) { hr(-4, 2, 5); hr(-3, 1, 6); hr(-2, 2, 5); hr(-1, 3, 10); hr(0, 1, 11); hr(1, 1, 11); hr(2, 1, 5); back(3, 5, 3); }
  else if (style === 3) { for (let j = -2; j < 4; j++) for (let i = 0; i < 13; i++) if ((j < 2 && i > 0 && i < 12) || ((i + j) % 2 === 0 && i < 5)) hp(i, j); back(4, 7, 2); }
  else if (style === 4) { // a knit beanie
    for (let j = -2; j < 3; j++) for (let i = 1; i < 12; i++) set(hx + i, hy + j, j === 2 ? coat[0] : i > 8 ? coat[3] : j % 2 ? coat[1] : coat[2]);
    set(hx + 6, hy - 3, coat[3]); set(hx + 5, hy - 3, coat[2]); back(3, 5, 2);
  } else { hr(0, 3, 9); hr(1, 1, 10); back(2, 5, 2); } // close-cropped
  // arms + the box at the waist (arms come round the box's sides)
  if (o.box !== false) {
    const by = 32, bw = 18, bh = 12, bx = cx - 9;
    for (let y = 19; y < by + 9; y++) { set(bx - 2, y, O); set(bx - 1, y, coat[0]); set(bx + bw, y, coat[2]); set(bx + bw + 1, y, coat[3]); }
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) set(bx + x, by + y, y === 0 ? PAL.W5 : x >= bw - 4 ? PAL.W4 : y === 1 ? PAL.W4 : PAL.D4);
    for (let y = 2; y < bh; y++) set(bx + 6, by + y, PAL.P0);
    for (let x = 0; x < bw; x++) set(bx + x, by + bh - 1, PAL.D2);
    // hands on the box's lower corners
    set(bx - 1, by + 9, skin[0]); set(bx, by + 9, skin[1]); set(bx - 1, by + 10, skin[0]); set(bx + bw - 1, by + 9, skin[1]); set(bx + bw, by + 9, skin[2]); set(bx + bw, by + 10, skin[1]);
    // a thing sticking out of the box
    const k = Math.floor(r(8) * 4);
    if (k === 0) { for (let y = by - 6; y < by; y++) set(bx + 12, y, PAL.L1); for (const [x, y] of [[bx + 10, by - 7], [bx + 13, by - 8], [bx + 14, by - 6], [bx + 11, by - 5], [bx + 12, by - 9]]) set(x, y, PAL.L2); set(bx + 13, by - 7, PAL.L3); }
    if (k === 1) { for (let y = by - 9; y < by; y++) { set(bx + 3, y, PAL.P1); set(bx + 4, y, PAL.P2); } set(bx + 3, by - 10, PAL.P0); set(bx + 4, by - 10, PAL.P0); }
    if (k === 2) { for (let y = by - 4; y < by; y++) for (let x = bx + 9; x < bx + 14; x++) set(x, y, x === bx + 13 ? PAL.G4 : PAL.P2); set(bx + 14, by - 3, PAL.P1); set(bx + 14, by - 2, PAL.P1); }
    if (k === 3) { for (let j = 0; j < 3; j++) for (let x = bx + 2; x < bx + 12; x++) set(x, by - 1 - j, [PAL.F4, PAL.L2, PAL.U3][j]); }
  } else {
    for (let y = 19; y < 46; y++) { set(cx - 11, y, coat[0]); set(cx + 11, y, coat[3]); }
  }
  return img;
};

/** The walkout crowd: [x, footY, seed, behindBench]. Behind-bench extras are cut at the desk top by the bench. */
export const WALKOUT_CROWD: Array<{x: number; foot: number; seed: number; behind: boolean; coat: number}> = [
  {x: 104, foot: 150, seed: 3, behind: true, coat: 0}, {x: 140, foot: 151, seed: 8, behind: true, coat: 5}, {x: 180, foot: 150, seed: 14, behind: true, coat: 3},
  {x: 222, foot: 151, seed: 21, behind: true, coat: 6}, {x: 348, foot: 152, seed: 5, behind: false, coat: 4}, {x: 404, foot: 150, seed: 30, behind: false, coat: 1},
  {x: 60, foot: 188, seed: 12, behind: false, coat: 2}, {x: 150, foot: 197, seed: 40, behind: false, coat: 1}, {x: 332, foot: 195, seed: 18, behind: false, coat: 0},
  {x: 438, foot: 191, seed: 26, behind: false, coat: 3},
];
/** where the crowd looks: at Tasya in the middle of the floor */
export const CROWD_LOOK_X = 236;

const flipH = (im: Img): Img => { const o = newImg(im.w, im.h); for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) o.c[y * im.w + x] = im.c[y * im.w + (im.w - 1 - x)]; return o; };

// ------------------------------------------------------------------ the room
const roomCache = new Map<string, {buf: Buf; reg: Uint8Array}>();

/**
 * Draw the bullpen (DAY) into rows 0..202 of `b`. Static per option set (cached); `f` only drives the neon's rare
 * flicker-free hum (nothing moves in this room by itself: the scene animates people, hearts, the door).
 * Returns masks {ceiling, walls, floor, glass, door, window, furniture, hall, dressing} + anchors.
 */
export const drawBullpen = (b: Buf, f: number, o: BullpenOpts = {}): RoomOut => {
  const variant = o.variant ?? 'day';
  const door = o.door ?? (variant === 'allhands' ? 'open' : 'shut');
  const key = JSON.stringify({variant, door, np: o.nameplate, iou: o.iou, ch: o.chairs, md: o.masDesk, mg: o.masGlass, hu: o.handsUp, cr: o.crowd});
  let hit = roomCache.get(key);
  if (!hit) {
    const p: Paint = {mb: new MatBuf(ROOM_W, ROOM_H), reg: new Uint8Array(ROOM_W * ROOM_H)};
    paintShell(p);
    paintHall(p);
    paintBoard(p);
    paintConference(p, door);
    paintDoor(p, door);
    paintWindows(p);
    if (variant !== 'allhands') { paintBench(p, o, variant); paintMasDesk(p, o); }
    else paintBench(p, {...o, chairs: [false, false, false, false]}, variant);
    paintForeground(p);
    const rb = new Buf(ROOM_W, ROOM_H, PAL.N0);
    resolve(p.mb, lightsDay(door), rb, 0);
    // direct-colour details
    glassSheen(rb, p.reg);
    windowSheen(rb, p.reg);
    neonSign(rb);
    { const w = textWidth('NOPE AI'); for (let y = G.neon.y - 3; y < G.neon.y + 10; y++) for (let x = G.neon.x - 4; x < G.neon.x + w + 4; x++) p.reg[y * ROOM_W + x] = R.sign; }
    boardInk(rb);
    if (o.nameplate !== null) nameplate(rb, o.nameplate ?? 'ALYI', door);
    if (o.iou !== false) iouNote(rb);
    const reg = p.reg;
    if (variant !== 'allhands' && o.masGlass !== false && o.masDesk !== false) {
      masGlass(rb);
      const gx = G.stations[3][1] - 16, gy = G.bench.back - 11;
      for (let y = gy; y <= gy + 12; y++) for (let x = gx; x < gx + 5; x++) reg[y * ROOM_W + x] = R.bench;
    }
    // variant layers (in front of the room)
    if (variant === 'walkout') {
      const dressing = new Mask(ROOM_W, ROOM_H);
      // behind-the-bench crowd first (cut by the desk top), then the boxes on every desk, then the front row
      const crowd = o.crowd !== false;
      const ex = (e: typeof WALKOUT_CROWD[number]) => { const im = walkoutExtra(e.seed, {coat: e.coat}); return e.x > CROWD_LOOK_X ? flipH(im) : im; };
      if (crowd) for (const e of WALKOUT_CROWD.filter((q) => q.behind)) put(rb, ex(e), e.x - 15, e.foot - EXTRA_H + 1, {clip: (_x, y) => y < G.bench.back, mask: dressing});
      const onDesk = new Mask(ROOM_W, ROOM_H);
      G.stations.forEach(([sx0, sx1], i) => { const bx = Math.round((sx0 + sx1) / 2) - 8 + (i === 3 ? 6 : 0); put(rb, packedBox(i === 3 ? 3 : (i * 3 + 1) % 5), bx, G.bench.back - 24, {mask: onDesk}); });
      put(rb, packedBox(4), G.win.x0 + 30, G.win.y1 + 9 - 25, {mask: dressing});
      for (let i = 0; i < reg.length; i++) if (onDesk.a[i]) reg[i] = R.bench;
      if (crowd) for (const e of WALKOUT_CROWD.filter((q) => !q.behind)) put(rb, ex(e), e.x - 15, e.foot - EXTRA_H + 1, {mask: dressing});
      for (let i = 0; i < reg.length; i++) if (dressing.a[i]) reg[i] = R.dressing;
    }
    if (variant === 'allhands') {
      const hands = new Set(o.handsUp ?? []);
      const dressing = new Mask(ROOM_W, ROOM_H);
      // each tile throws a 1px shadow down-right on the room (they are in the room, not pasted over it)
      ALLHANDS_TILES.forEach((t) => { for (let j = 1; j <= 22; j++) { rb.set(t.x + 22, t.y + j, stepColor(rb.get(t.x + 22, t.y + j), -2)); } for (let i = 1; i <= 22; i++) rb.set(t.x + i, t.y + 22, stepColor(rb.get(t.x + i, t.y + 22), -2)); });
      ALLHANDS_TILES.forEach((t, i) => put(rb, employeeTile(t.seed, {hand: hands.has(i)}), t.x, t.y - 6, {mask: dressing}));
      for (let i = 0; i < reg.length; i++) if (dressing.a[i]) reg[i] = R.dressing;
    }
    hit = {buf: rb, reg};
    roomCache.set(key, hit);
  }
  for (let y = 0; y < ROOM_H; y++) b.c.set(hit.buf.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  void f;
  const out = newRoomOut(REGION_NAMES);
  for (let i = 0; i < hit.reg.length; i++) {
    const r = hit.reg[i];
    if (!r) continue;
    const name = REGION_NAMES[r - 1];
    out.masks[name].a[i] = 255;
  }
  const cached = hit;
  out.front = (fb: Buf) => { for (let y = 0; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) { const i = y * ROOM_W + x; if (cached.reg[i] === R.bench) fb.c[y * fb.w + x] = cached.buf.c[i]; } };
  const [s3x0] = G.stations[3];
  out.anchors = {
    // seated sprites (top-left for cast/mas drawMasDesk & cast/gerg drawGergTable: desk edge row 37 on the desk's back edge)
    masDesk: [s3x0 + 6, G.bench.back - 37],
    gergDesk: [G.stations[1][0] + 4, G.bench.back - 37],
    seat0: [G.stations[0][0] + 4, G.bench.back - 37],
    seat2: [G.stations[2][0] + 4, G.bench.back - 37],
    // standing feet (x, y = the floor row under the feet)
    rimaBoard: [G.board.x1 + 6, G.floorY + 6],
    alyiCrack: [DOOR_CRACK.x + 4, G.floorY - 1], // stand here, clip to DOOR_CRACK
    alyiDoorway: [DOOR_OPENING.x + 8, G.floorY - 1], // stand here, clip to DOOR_OPENING (the all-hands)
    tasyaFloor: [236, 197], // "the middle of the floor" (in front of the bench)
    vaultQ: [34, 172], // the Q* vault's bottom-centre, in the hall's tungsten spill (sc 31)
    observerChair: [404, 178], // the MACROSOFT folding chair by the window (sc 31)
    masWalkPath0: [20, 196], masWalkPath1: [470, 196], // the front walk lane (sc 31)
    heartsDoor: [DOOR_CRACK.x + 14, 70], // where the three hearts hang in the doorway (sc 30)
    masGlass: [G.stations[3][1] - 16, G.bench.back - 11],
    neon: [G.neon.x, G.neon.y],
  };
  return out;
};

// ------------------------------------------------------------------ ALYI'S REFLECTION (sc 5, 11): a figure in the glass
/**
 * Draw a figure's REFLECTION into the conference glass: only where the room's glass mask is on, and only as a palette
 * modulation of the glass itself (a light pixel of the figure lifts the glass one rung, a dark one sinks it one rung),
 * so it reads as a reflection, never as a figure pasted on. No dither on the figure. Pass `flip` for the mirrored read.
 */
export const drawGlassReflection = (b: Buf, room: RoomOut, img: Img, x: number, y: number, o: {flip?: boolean; strength?: 1 | 2} = {}) => {
  const k = o.strength ?? 1;
  const glass = room.masks.glass;
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const c = img.c[j * img.w + (o.flip ? img.w - 1 - i : i)];
      if (c < 0) continue;
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= ROOM_W || Y >= ROOM_H || !glass.a[Y * ROOM_W + X]) continue;
      const Lf = lightness(c);
      const d = Lf > 0.5 ? k : Lf > 0.3 ? 0 : -k;
      if (d) b.set(X, Y, stepColor(b.get(X, Y), d));
    }
};

// ------------------------------------------------------------------ THE LANDLORD BECOMES THE ROOM (sc 30): a palette remap
/** The slate ramp Tasya's room remaps to (MACROSOFT slate #5B6B8C lives between N7 and G4), dark to light. */
export const SLATE_RAMP = [PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7, PAL.N8, PAL.G6];
const SLATE_L = SLATE_RAMP.map(lightness);
const slateCache = new Map<number, number>();
/** Any master colour -> the slate colour of nearest lightness (keeps every shape and every light, changes the owner). */
export const toSlate = (c: number) => {
  let v = slateCache.get(c);
  if (v === undefined) {
    const L = lightness(c);
    let best = 0, bd = Infinity;
    SLATE_L.forEach((l, i) => { const d = Math.abs(l - L); if (d < bd) { bd = d; best = i; } });
    v = SLATE_RAMP[best];
    slateCache.set(c, v);
  }
  return v;
};

export interface LandlordState {
  /** 0 = untouched, 1-2 = spreading (held steps), 3 = all of it. */
  floor?: number;
  ceiling?: number;
  walls?: number;
  /** his feet (the spread's centre), default the 'tasyaFloor' anchor */
  origin?: [number, number];
  /** the NOPE AI neon goes slate with the walls (default true: he owns the sign too) */
  sign?: boolean;
}
/**
 * Remap the bullpen's floor / ceiling / walls to MACROSOFT slate in three HELD steps spreading from his feet
 * ("below them, above them, around them"). Call right after drawBullpen and BEFORE drawing people.
 * Doors, glass, windows and furniture keep their colours. Pass the RoomOut drawBullpen returned.
 */
export const bullpenLandlord = (b: Buf, room: RoomOut, s: LandlordState) => {
  const [ox, oy] = s.origin ?? room.anchors.tasyaFloor;
  const RADII: Record<string, Array<[number, number]>> = {
    floor: [[0, 0], [70, 16], [190, 44], [9999, 9999]],
    ceiling: [[0, 0], [80, 10], [220, 24], [9999, 9999]],
    walls: [[0, 0], [90, 60], [230, 150], [9999, 9999]],
  };
  const centre: Record<string, [number, number]> = {floor: [ox, oy], ceiling: [ox, 0], walls: [ox, G.floorY]};
  for (const region of ['floor', 'ceiling', 'walls'] as const) {
    const k = Math.max(0, Math.min(3, Math.round(s[region] ?? 0)));
    if (!k) continue;
    const [rx, ry] = RADII[region][k];
    const [cx, cy] = centre[region];
    const m = region === 'walls' && s.sign !== false ? room.masks.walls.clone().union(room.masks.sign) : room.masks[region];
    for (let y = 0; y < ROOM_H; y++)
      for (let x = 0; x < ROOM_W; x++) {
        if (!m.a[y * ROOM_W + x]) continue;
        if (k < 3 && Math.hypot((x - cx) / rx, (y - cy) / ry) > 1) continue;
        b.set(x, y, toSlate(b.get(x, y)));
      }
  }
};
