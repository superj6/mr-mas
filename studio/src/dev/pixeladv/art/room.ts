// MR. MAS — pixeladv: MAS'S ROOM, 1:36 AM. Painted as (material, level) at native 480x203,
// then lit by palette ramps (monitor cyan / hallway tungsten / night). All integer geometry.
import {Buf, bayer, clamp, ellipse, hash, line, poly, rect} from '../core/px';
import {MatBuf, resolve} from '../core/light';
import {PAL} from '../core/palette';

export const ROOM_W = 480;
export const ROOM_H = 203;

export type DoorState = 'closed' | 'a' | 'b' | 'c' | 'd';

export interface RoomState {
  f: number;
  door: DoorState;
  /** 0..1: feet interrupting the light under the closed door */
  underDoor: number;
  /** 0..1 flash of the hallway light at the moment of impact */
  flash: number;
  /** monitor light multiplier (~1) */
  monitor: number;
  /** characters of code typed so far */
  typed: number;
  /** frames since the desk slam (-1 = none) */
  jolt: number;
  /** poster tilt in degrees */
  tilt: number;
  /** integer shake offset for the room (door impact) */
  shake: [number, number];
  /** floor shadow of the visitor inside the hallway light (true = shadowed) */
  shadow?: (x: number, y: number) => boolean;
  /** hide Mas's water glass (for sheets) */
  noGlass?: boolean;
}

// ---- geometry constants shared with the character layer ----
export const WALL_FLOOR_Y = 150;
export const DESK = {x0: 150, x1: 302, top0: 122, top1: 127, edge: 128, legBottom: 158};
export const MON = {x0: 170, x1: 213, y0: 84, y1: 111, cx: 191, cy: 97};
export const DOOR = {x0: 400, x1: 444, y0: 59, y1: 149};
export const GLASS = {x: 262, y: 110, w: 7, h: 13};

const hop = (k: number, amp: number) => {
  // integer hop curve for a desk object after the slam: up, hang, land, settle
  const seq = [0, -amp, -amp, -Math.ceil(amp / 2), 0, 1, 0];
  return k < 0 || k >= seq.length ? 0 : seq[k];
};

/** Door slab free-edge geometry per state (hinge at the right jamb, swinging toward camera). */
const SLAB: Record<Exclude<DoorState, 'closed'>, [number, number, number]> = {
  a: [461, 53, 155],
  b: [476, 46, 162],
  c: [468, 49, 159],
  d: [471, 48, 160],
};

const codeLine = (i: number) => {
  // deterministic "code": indent + tokens
  const indent = [0, 2, 4, 4, 2, 4, 6, 6, 4, 2, 0, 2][i % 12];
  const toks: number[] = [];
  let n = 2 + Math.floor(hash(i, 3) * 4);
  while (n--) toks.push(2 + Math.floor(hash(i, n + 7) * 6));
  return {indent, toks, kind: Math.floor(hash(i, 11) * 5)};
};
const lineLen = (l: ReturnType<typeof codeLine>) => l.indent + l.toks.reduce((a, t) => a + t + 1, 0);

export const paintRoom = (s: RoomState): MatBuf => {
  const mb = new MatBuf(ROOM_W, ROOM_H);
  const {f} = s;
  const jk = s.jolt;

  // ---------- ceiling, crown, wall ----------
  rect(0, 0, ROOM_W, 10, mb.mat('black', -1));
  rect(0, 10, ROOM_W, 1, mb.mat('trim', 1.2));
  rect(0, 11, ROOM_W, 2, mb.mat('trim', 0.2));
  rect(0, 13, ROOM_W, 1, mb.mat('trim', -1));
  rect(0, 14, ROOM_W, WALL_FLOOR_Y - 14, mb.mat('wall', 0));
  // picture rail
  rect(0, 24, ROOM_W, 1, mb.mat('trim', 0.8));
  rect(0, 25, ROOM_W, 1, mb.mat('trim', -0.6));
  // subtle plaster texture: sparse -0.5 specks
  for (let y = 26; y < 112; y++) for (let x = 0; x < ROOM_W; x++) if (hash(x, y, 5) < 0.035) mb.shade(-0.5)(x, y);
  // wainscot
  rect(0, 112, ROOM_W, 1, mb.mat('trim', 1.3));
  rect(0, 113, ROOM_W, 2, mb.mat('trim', 0.3));
  rect(0, 115, ROOM_W, 1, mb.mat('trim', -1));
  rect(0, 116, ROOM_W, 28, mb.mat('trim', -0.3));
  for (let px = 6; px < ROOM_W; px += 38) {
    // raised panel: lit top/left edges, shadowed bottom/right
    rect(px, 120, 30, 1, mb.shade(0.9));
    rect(px, 120, 1, 20, mb.shade(0.9));
    rect(px, 140, 31, 1, mb.shade(-1));
    rect(px + 30, 120, 1, 21, mb.shade(-1));
  }
  // baseboard
  rect(0, 144, ROOM_W, 1, mb.mat('trim', 1.2));
  rect(0, 145, ROOM_W, 5, mb.mat('trim', 0.2));
  rect(0, 149, ROOM_W, 1, mb.mat('trim', -1.5));

  // ---------- floor: boards converging to the vanishing point ----------
  rect(0, WALL_FLOOR_Y, ROOM_W, ROOM_H - WALL_FLOOR_Y, mb.mat('floor', 0));
  const VP = [240, 36];
  for (let xw = -400; xw < 900; xw += 13) {
    const dx = xw - VP[0], dy = WALL_FLOOR_Y - VP[1];
    const x2 = VP[0] + (dx * (ROOM_H - VP[1])) / dy;
    line(xw, WALL_FLOOR_Y, Math.round(x2), ROOM_H, mb.shade(-1.3));
  }
  // staggered board ends
  for (let k = 0; k < 40; k++) {
    const y = WALL_FLOOR_Y + 4 + Math.floor(hash(k, 2) * 48);
    const x = Math.floor(hash(k, 9) * ROOM_W);
    rect(x, y, 5 + Math.floor((y - 150) / 8), 1, mb.shade(-1));
  }
  // floor sheen rows
  for (let y = WALL_FLOOR_Y; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) if (hash(x >> 2, y, 13) < 0.08) mb.shade(0.4)(x, y);

  // ---------- window (left) ----------
  const WX0 = 22, WX1 = 102, WY0 = 32, WY1 = 106;
  rect(WX0 - 4, WY0 - 4, WX1 - WX0 + 9, WY1 - WY0 + 9, mb.mat('wood', 0.3));
  rect(WX0 - 4, WY0 - 4, WX1 - WX0 + 9, 1, mb.shade(1));
  rect(WX0 - 1, WY0 - 1, WX1 - WX0 + 3, WY1 - WY0 + 3, mb.mat('wood', -1));
  // sky + city (emissive)
  for (let y = WY0; y <= WY1; y++)
    for (let x = WX0; x <= WX1; x++) {
      const t = (y - WY0) / (WY1 - WY0);
      const b = bayer(x, y);
      const c = t < 0.45 ? PAL.N2 : t < 0.62 ? (b < (t - 0.45) / 0.17 ? PAL.N3 : PAL.N2) : t < 0.8 ? PAL.N3 : b < (t - 0.8) / 0.2 ? PAL.N4 : PAL.N3;
      mb.emit(c)(x, y);
    }
  // skyline silhouettes
  const bld: Array<[number, number, number]> = [[22, 84, 9], [31, 78, 7], [38, 88, 12], [50, 70, 8], [58, 60, 6], [64, 82, 10], [74, 74, 9], [83, 86, 7], [90, 79, 12]];
  for (const [bx, by, bw] of bld) {
    rect(bx, by, bw, WY1 - by + 1, mb.emit(PAL.N1));
    rect(bx, by, 1, WY1 - by + 1, mb.emit(PAL.N2));
    for (let y = by + 3; y < WY1 - 2; y += 3)
      for (let x = bx + 2; x < bx + bw - 1; x += 2) {
        const h = hash(x, y, 21);
        const twinkle = hash(x, y, 22 + Math.floor((f + x * 3) / 30)) < 0.9;
        if (h < 0.16 && twinkle) mb.emit(h < 0.05 ? PAL.C5 : h < 0.11 ? PAL.W6 : PAL.W4)(x, y);
      }
  }
  // antenna + aircraft light
  line(61, 60, 61, 44, mb.emit(PAL.N1));
  if (Math.floor(f / 12) % 2 === 0) { mb.emit(PAL.R3)(61, 43); mb.emit(PAL.R1)(60, 43); mb.emit(PAL.R1)(62, 43); mb.emit(PAL.R1)(61, 42); }
  else mb.emit(PAL.R0)(61, 43);
  // blinds (upper third), slats catch the night
  for (let y = WY0; y < WY0 + 24; y++) {
    const k = (y - WY0) % 3;
    if (k < 2) rect(WX0, y, WX1 - WX0 + 1, 1, mb.mat('paper', k === 0 ? -1 : -2.2));
  }
  rect(WX0 + 10, WY0 + 24, 1, 12, mb.mat('paper', -1.5));
  // mullions
  rect(61, WY0, 2, WY1 - WY0 + 1, mb.mat('wood', -0.3));
  rect(WX0, 70, WX1 - WX0 + 1, 2, mb.mat('wood', -0.3));
  // sill
  rect(WX0 - 8, WY1 + 4, WX1 - WX0 + 17, 2, mb.mat('wood', 1));
  rect(WX0 - 7, WY1 + 6, WX1 - WX0 + 15, 2, mb.mat('wood', -0.8));

  // ---------- server tower (floor, left of desk) ----------
  rect(112, 98, 28, 52, mb.mat('black', 0));
  rect(112, 98, 28, 1, mb.shade(1.4));
  rect(139, 99, 1, 51, mb.shade(1.2));
  for (let y = 104; y < 146; y += 3) rect(125, y, 11, 1, mb.shade(0.8));
  rect(114, 101, 8, 45, mb.mat('metal', -0.6));
  for (let y = 104; y < 144; y += 4) {
    const on = hash(y, Math.floor((f + y * 7) / (4 + (y % 5))), 3);
    mb.emit(on < 0.45 ? PAL.C6 : on < 0.6 ? PAL.L3 : on < 0.7 ? PAL.C3 : PAL.N2)(117, y);
    mb.emit(hash(y, Math.floor(f / 6), 4) < 0.5 ? PAL.C4 : PAL.N2)(119, y);
  }
  rect(112, 148, 28, 2, mb.mat('black', -1));

  // ---------- wall shelf above desk (right) ----------
  const shelfDy = jk >= 0 ? hop(jk - 1, 2) : 0;
  rect(238, 66, 62, 3, mb.mat('wood', 0.5));
  rect(238, 66, 62, 1, mb.shade(1));
  rect(242, 69, 2, 4, mb.mat('wood', -0.5));
  rect(294, 69, 2, 4, mb.mat('wood', -0.5));
  // books
  const books: Array<[number, number, string, number]> = [[242, 12, 'red', 0], [245, 10, 'paper', -1.5], [248, 13, 'wall', 0.8], [251, 11, 'red', -0.5], [254, 12, 'paper', -2]];
  books.forEach(([bx, bh, bm, bl], i) => {
    const fallen = i === 4 && jk >= 1;
    if (fallen) {
      // the last book tips over and lies at an angle against its neighbour
      poly([256, 66 + shelfDy, 257, 66 + shelfDy, 266, 60 + shelfDy, 265, 58 + shelfDy], mb.mat(bm, bl));
    } else rect(bx, 66 - bh + shelfDy, 3, bh, mb.mat(bm, bl));
  });
  // LED clock 1:36
  rect(262, 57 + shelfDy, 15, 9, mb.mat('black', 0.5));
  rect(262, 57 + shelfDy, 15, 1, mb.shade(1));
  const dig: Record<string, string[]> = {
    '1': ['.#', '##', '.#', '.#', '.#'],
    '3': ['##', '.#', '##', '.#', '##'],
    '6': ['##', '#.', '##', '##', '##'],
  };
  const drawDig = (d: string, x: number) => dig[d].forEach((r, j) => [...r].forEach((c, i) => c === '#' && mb.emit(PAL.R3)(x + i, 59 + shelfDy + j)));
  drawDig('1', 264); mb.emit(PAL.R2)(267, 60 + shelfDy); mb.emit(PAL.R2)(267, 62 + shelfDy); drawDig('3', 269); drawDig('6', 273);
  // succulent
  rect(283, 61 + shelfDy, 6, 5, mb.mat('red', -1));
  ellipse(286, 59 + shelfDy, 4, 2.5, mb.mat('plant', 0.5));
  mb.shade(1.2)(285, 57 + shelfDy); mb.shade(1.2)(287, 58 + shelfDy);

  // ---------- poster (tilts on the door slam) ----------
  {
    const cx = 341, cy = 67, hw = 23, hh = 30;
    const a = (s.tilt * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
    const P = (u: number, v: number) => [Math.round(cx + u * ca - v * sa), Math.round(cy + u * sa + v * ca)];
    const quad = (u0: number, v0: number, u1: number, v1: number) => [...P(u0, v0), ...P(u1, v0), ...P(u1, v1), ...P(u0, v1)];
    // drop shadow on the wall
    poly(quad(-hw + 2, -hh + 2, hw + 2, hh + 2), mb.shade(-1.2));
    poly(quad(-hw, -hh, hw, hh), mb.mat('black', 0.8));
    poly(quad(-hw + 2, -hh + 2, hw - 2, hh - 2), mb.mat('paper', -1.2));
    poly(quad(-hw + 5, -hh + 5, hw - 5, hh - 12), mb.mat('wall', 1.2));
    // THE ORB print: chrome sphere with an iris
    const [ox, oy] = P(0, -6);
    ellipse(ox, oy, 11, 11, mb.mat('metal', 0.2));
    ellipse(ox - 3, oy - 3, 5, 5, mb.mat('metal', 1.4));
    ellipse(ox - 4, oy - 5, 1.6, 1.6, mb.mat('metal', 3));
    ellipse(ox + 1, oy + 1, 4, 4, mb.mat('black', 0.5));
    ellipse(ox + 1, oy + 1, 2, 2, mb.emit(PAL.C6));
    // caption bar
    const cap = quad(-hw + 5, hh - 9, hw - 5, hh - 6);
    poly(cap, mb.mat('black', 0.4));
  }

  // ---------- door ----------
  rect(DOOR.x0 - 4, DOOR.y0 - 4, DOOR.x1 - DOOR.x0 + 9, 4, mb.mat('trim', 0.8));
  rect(DOOR.x0 - 4, DOOR.y0 - 4, DOOR.x1 - DOOR.x0 + 9, 1, mb.shade(1));
  rect(DOOR.x0 - 4, DOOR.y0, 4, DOOR.y1 - DOOR.y0 + 1, mb.mat('trim', 0.5));
  rect(DOOR.x1 + 1, DOOR.y0, 4, DOOR.y1 - DOOR.y0 + 1, mb.mat('trim', 0.2));
  rect(DOOR.x0 - 4, DOOR.y0, 1, DOOR.y1 - DOOR.y0 + 1, mb.shade(1));
  const open = s.door !== 'closed';
  if (!open) {
    rect(DOOR.x0, DOOR.y0, DOOR.x1 - DOOR.x0 + 1, DOOR.y1 - DOOR.y0 + 1, mb.mat('door', 0));
    for (const [py0, py1] of [[64, 100], [106, 144]]) {
      rect(DOOR.x0 + 5, py0, 35, 1, mb.shade(1));
      rect(DOOR.x0 + 5, py0, 1, py1 - py0, mb.shade(1));
      rect(DOOR.x0 + 5, py1, 36, 1, mb.shade(-1.2));
      rect(DOOR.x0 + 40, py0, 1, py1 - py0 + 1, mb.shade(-1.2));
    }
    ellipse(DOOR.x0 + 38, 104, 1.6, 1.6, mb.mat('metal', 1.5));
    // light leaking under the door — broken by approaching feet
    for (let x = DOOR.x0 + 1; x < DOOR.x1; x++) {
      const feet = s.underDoor > 0 && ((x > 408 + s.underDoor * 8 && x < 414 + s.underDoor * 8) || (x > 424 - s.underDoor * 4 && x < 431 - s.underDoor * 4));
      mb.emit(feet ? PAL.W1 : x % 7 === 0 ? PAL.W5 : PAL.W6)(x, DOOR.y1);
    }
  } else {
    // hallway (emissive, very hot): far wall, floor, ceiling fixture in one-point perspective
    const hx0 = DOOR.x0, hx1 = DOOR.x1, hy0 = DOOR.y0, hy1 = DOOR.y1;
    const fx0 = 412, fx1 = 432, fy0 = 74, fy1 = 128;
    const hot = s.flash;
    for (let y = hy0; y <= hy1; y++)
      for (let x = hx0; x <= hx1; x++) {
        const b = bayer(x, y);
        let c: number;
        if (x >= fx0 && x <= fx1 && y >= fy0 && y <= fy1) c = b < 0.5 ? PAL.W6 : PAL.W7;
        else if (y > fy1 && y - fy1 >= Math.abs(x - (fx0 + fx1) / 2) - (fx1 - fx0) / 2 - 0.0001 + (y - fy1) * 0.0) {
          // floor wedge in front of far wall
          const t = (y - fy1) / (hy1 - fy1);
          c = t > 0.7 ? PAL.W8 : t > 0.35 ? (b < (t - 0.35) / 0.35 ? PAL.W8 : PAL.W7) : PAL.W7;
        } else if (y < fy0) c = y < hy0 + 5 && x > 414 && x < 430 ? PAL.W9 : b < 0.35 ? PAL.W5 : PAL.W4;
        else c = x < fx0 ? (b < 0.5 ? PAL.W5 : PAL.W6) : b < 0.3 ? PAL.W4 : PAL.W5;
        if (hot > 0.5) c = c === PAL.W4 || c === PAL.W5 ? PAL.W7 : PAL.W9;
        mb.emit(c)(x, y);
      }
    // perspective edges of the hallway
    line(hx0, hy1, fx0, fy1, mb.emit(PAL.W5));
    line(hx1, hy1, fx1, fy1, mb.emit(PAL.W5));
    // fixture
    rect(416, 60, 12, 2, mb.emit(PAL.W9));
    // slab (room-side face, in perspective), hinge on right jamb
    const [ex, et, eb] = SLAB[s.door as Exclude<DoorState, 'closed'>];
    poly([hx1 + 1, hy0, ex, et, ex, eb, hx1 + 1, hy1 + 1], mb.mat('door', -0.6));
    // panel insets on the slab
    const q = (u: number, v: number) => {
      const xa = hx1 + 1 + (ex - hx1 - 1) * u;
      const ya = hy0 + (et - hy0) * u, yb = hy1 + 1 + (eb - hy1 - 1) * u;
      return [Math.round(xa), Math.round(ya + (yb - ya) * v)];
    };
    for (const [v0, v1] of [[0.07, 0.45], [0.52, 0.93]]) {
      const pts = [...q(0.2, v0), ...q(0.85, v0), ...q(0.85, v1), ...q(0.2, v1)];
      poly(pts, mb.shade(-0.8));
      line(pts[0], pts[1], pts[2], pts[3], mb.shade(1.6));
    }
    // warm-lit free edge
    line(ex, et, ex, eb, mb.emit(PAL.W6));
    line(ex - 1, et + 1, ex - 1, eb - 1, mb.emit(PAL.W3));
  }

  // ---------- whiteboard (above the server): an exponential curve and a question ----------
  {
    rect(108, 30, 40, 42, mb.mat('metal', -0.4));
    rect(108, 30, 40, 1, mb.shade(1.2));
    rect(110, 32, 36, 38, mb.mat('paper', -1.6));
    // axes + curve (marker red), a boxed "AGI?" (marker teal)
    line(113, 36, 113, 60, mb.mat('black', 0.5));
    line(113, 60, 140, 60, mb.mat('black', 0.5));
    for (let x = 0; x < 26; x++) {
      const y = Math.round(59 - Math.pow(x / 25, 3.2) * 24);
      mb.mat('red', 1.2)(114 + x, y);
    }
    const G = (rows: string[], ox: number, oy: number) => rows.forEach((r, j) => [...r].forEach((c, i) => c === '#' && mb.mat('plant', 1.4)(ox + i, oy + j)));
    G(['.#..##.#.##.', '#.#.#..#...#', '###.#.##..#.', '#.#.##.#..#.'], 118, 63);
    rect(117, 62, 14, 1, mb.mat('plant', 0.6));
    // tray + marker
    rect(110, 70, 36, 1, mb.mat('metal', 0.4));
    rect(128, 69, 5, 1, mb.mat('red', 0.8));
  }
  // cable run from the server to the desk along the skirting
  line(140, 147, 156, 147, mb.mat('black', 0.3));
  line(170, 126, 182, 146, mb.mat('black', 0.3));
  // ---------- trash can by the desk (it hops on the slam) ----------
  {
    const dy = jk >= 0 ? hop(jk - 1, 2) : 0;
    poly([306, 142 + dy, 318, 142 + dy, 317, 158 + dy, 307, 158 + dy], mb.mat('metal', -0.2));
    rect(306, 142 + dy, 13, 1, mb.shade(1.4));
    for (let x = 308; x < 317; x += 3) line(x, 144 + dy, x, 156 + dy, mb.shade(-0.8));
    ellipse(311, 141 + dy, 3, 2, mb.mat('paper', -0.4));
    ellipse(314, 140 + dy, 2, 1.5, mb.mat('paper', -0.9));
    ellipse(322, 159, 2, 1.4, mb.mat('paper', -0.8));
    rect(305, 158, 15, 1, mb.shade(-1.4));
  }
  // ---------- desk (against the wall) ----------
  const D = DESK;
  // wall glow halo behind monitor is lighting; cable
  line(186, 112, 170, 122, mb.mat('black', -0.5));
  // top plane
  rect(D.x0, D.top0, D.x1 - D.x0 + 1, D.top1 - D.top0 + 1, mb.mat('wood', 0.6));
  rect(D.x0, D.top0, D.x1 - D.x0 + 1, 1, mb.shade(-0.8));
  for (let x = D.x0; x <= D.x1; x++) if (hash(x, 1, 31) < 0.3) mb.shade(0.5)(x, D.top0 + 2 + (x % 3));
  // front edge
  rect(D.x0 - 1, D.edge, D.x1 - D.x0 + 3, 1, mb.mat('wood', 1.6));
  rect(D.x0 - 1, D.edge + 1, D.x1 - D.x0 + 3, 2, mb.mat('wood', 0.2));
  // under-desk cavity (light mostly blocked)
  rect(D.x0 + 2, D.edge + 3, D.x1 - D.x0 - 3, D.legBottom - D.edge - 3, mb.mat('black', -1));
  rect(D.x0 + 2, D.edge + 3, D.x1 - D.x0 - 3, D.legBottom - D.edge - 3, mb.gain(0.25, 0.5));
  // legs
  rect(D.x0, D.edge + 3, 3, D.legBottom - D.edge - 2, mb.mat('wood', 0));
  rect(D.x0, D.edge + 3, 1, D.legBottom - D.edge - 2, mb.shade(1));
  rect(D.x1 - 2, D.edge + 3, 3, D.legBottom - D.edge - 2, mb.mat('wood', -0.3));
  // drawer unit
  rect(154, D.edge + 3, 26, D.legBottom - D.edge - 3, mb.mat('wood', -0.4));
  rect(154, D.edge + 3, 26, D.legBottom - D.edge - 3, mb.gain(0.55, 0.8));
  for (const dy of [140, 149]) rect(154, dy, 26, 1, mb.shade(-1.2));
  for (const dy of [135, 144, 153]) rect(165, dy, 4, 1, mb.shade(1.4));
  // floor contact shadows
  rect(D.x0 - 2, D.legBottom, D.x1 - D.x0 + 5, 1, mb.shade(-1.5));
  rect(D.x0, D.legBottom + 1, D.x1 - D.x0 + 1, 1, mb.shade(-0.7));

  // ---------- desk objects ----------
  const jo = (k: number, amp: number) => (jk >= 0 ? hop(jk - k, amp) : 0);
  // lamp (off)
  {
    const dy = jo(0, 2);
    rect(153, 119 + dy, 11, 2, mb.mat('metal', 0.2));
    line(158, 118 + dy, 154, 104 + dy, mb.mat('metal', 0.6));
    line(155, 104 + dy, 164, 98 + dy, mb.mat('metal', 0.6));
    poly([162, 96 + dy, 169, 99 + dy, 167, 104 + dy, 160, 101 + dy], mb.mat('metal', 1));
  }
  // pencil cup
  {
    const dy = jo(1, 2);
    const tipped = jk >= 2;
    if (!tipped) {
      rect(157, 113 + dy, 4, 7, mb.mat('red', 0.5));
      line(158, 112 + dy, 157, 108 + dy, mb.mat('paper', 0.5));
      line(160, 112 + dy, 162, 107 + dy, mb.mat('wood', 1.5));
    } else {
      rect(155, 118, 7, 3, mb.mat('red', 0.5));
      line(162, 119, 168, 118, mb.mat('paper', 0.5));
      line(162, 120, 169, 121, mb.mat('wood', 1.5));
    }
  }
  // monitor
  {
    const dy = jo(0, 2), dx = jk === 1 ? 1 : jk === 2 ? -1 : 0;
    const M = MON;
    rect(M.x0 - 2 + dx, M.y0 - 2 + dy, M.x1 - M.x0 + 5, M.y1 - M.y0 + 5, mb.mat('black', 0.4));
    rect(M.x0 - 2 + dx, M.y0 - 2 + dy, M.x1 - M.x0 + 5, 1, mb.shade(1.4));
    rect(M.x0 - 2 + dx, M.y1 + 2 + dy, M.x1 - M.x0 + 5, 1, mb.shade(-0.6));
    // stand
    rect(188 + dx, M.y1 + 3 + dy, 7, 7, mb.mat('metal', 0.5));
    rect(188 + dx, M.y1 + 3 + dy, 1, 7, mb.shade(1.3));
    rect(181 + dx, 121 + dy, 21, 2, mb.mat('metal', 1));
    // screen content (emissive)
    const sx0 = M.x0 + dx, sy0 = M.y0 + dy, sw = M.x1 - M.x0 + 1, sh = M.y1 - M.y0 + 1;
    const dim = s.monitor < 0.7;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) mb.emit(y < 2 ? PAL.C2 : x < 4 ? PAL.C1 : PAL.C0)(sx0 + x, sy0 + y);
    rect(sx0 + 1, sy0, 1, 1, mb.emit(PAL.R3));
    rect(sx0 + 3, sy0, 1, 1, mb.emit(PAL.W6));
    rect(sx0 + 5, sy0, 1, 1, mb.emit(PAL.L3));
    // lines: 12 visible rows at 2px pitch starting y+3
    let remaining = s.typed;
    let li = 0;
    const lines: Array<{l: ReturnType<typeof codeLine>; n: number}> = [];
    while (remaining > 0) {
      const l = codeLine(li);
      const len = lineLen(l);
      lines.push({l, n: Math.min(len, remaining)});
      remaining -= len;
      li++;
    }
    const rows = 12;
    const start = Math.max(0, lines.length - rows);
    const vis = lines.slice(start);
    vis.forEach(({l, n}, r) => {
      const y = sy0 + 3 + r * 2;
      rect(sx0 + 1, y, 2, 1, mb.emit(PAL.C2));
      let x = sx0 + 5 + l.indent;
      let used = l.indent;
      l.toks.forEach((t, ti) => {
        const col = ti === 0 ? (l.kind === 0 ? PAL.W6 : l.kind === 1 ? PAL.C7 : PAL.C5) : l.kind === 3 ? PAL.C3 : ti === l.toks.length - 1 && l.kind === 2 ? PAL.W5 : PAL.C5;
        for (let k = 0; k < t; k++) {
          if (used >= n) return;
          if (x < sx0 + sw - 1) mb.emit(col)(x, y);
          x++; used++;
        }
        x++; used++;
      });
      if (r === vis.length - 1 && Math.floor(f / 6) % 2 === 0) rect(Math.min(x, sx0 + sw - 2), y - 1, 1, 2, mb.emit(PAL.C9));
    });
    if (dim) for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if ((x + y) % 2 === 0) mb.emit(PAL.C1)(sx0 + x, sy0 + y);
    // tearing on impact: rows slip sideways (an honest CRT-era glitch, done with whole pixels)
    if (jk >= 0 && jk < 3) {
      for (let y = 2; y < sh; y++) {
        const off = Math.round((hash(y >> 2, jk, 77) - 0.5) * 6);
        if (!off) continue;
        const row: number[] = [];
        for (let x = 0; x < sw; x++) { const i = mb.idx(sx0 + x, sy0 + y); row.push(i >= 0 ? mb.e[i] : 0); }
        for (let x = 0; x < sw; x++) mb.emit(row[(x - off + sw * 4) % sw])(sx0 + x, sy0 + y);
      }
    }
    // glass reflection streak on screen
    line(sx0 + sw - 9, sy0 + 2, sx0 + sw - 17, sy0 + sh - 2, mb.emit(PAL.C3));
  }
  // keyboard
  {
    const dy = jo(0, 2);
    rect(203, 123 + dy, 34, 3, mb.mat('black', 1.2));
    for (let x = 204; x < 236; x += 2) mb.shade(1.2)(x, 124 + dy);
    rect(203, 123 + dy, 34, 1, mb.shade(1));
  }
  // mug (coffee slops out on the slam)
  {
    const dy = jo(1, 4), dx = jk >= 3 ? 2 : 0;
    if (jk >= 1 && jk < 5) {
      const drops: Array<[number, number]> = [[-1, -3], [1, -5], [3, -4], [5, -2]];
      drops.forEach(([ddx, ddy], i) => mb.mat('wood', 1.2 - i * 0.3)(245 + ddx + (jk - 1), 114 + dy + ddy + (jk - 1) * (jk - 1)));
    }
    if (jk >= 4) rect(250, 122, 3, 1, mb.mat('wood', 0.2));
    rect(243 + dx, 116 + dy, 6, 7, mb.mat('paper', -0.8));
    rect(243 + dx, 116 + dy, 1, 7, mb.shade(1.5));
    rect(249 + dx, 118 + dy, 2, 3, mb.mat('paper', -1.5));
    rect(244 + dx, 116 + dy, 4, 1, mb.mat('black', 0));
    // steam? (cold coffee — none)
  }
  // papers
  {
    const dy = jo(0, 3);
    poly([276, 124 + dy, 294, 123 + dy, 296, 126 + dy, 277, 127 + dy], mb.mat('paper', -0.6));
    if (jk >= 1 && jk < 5) poly([280, 121 + dy, 292, 120, 294, 122, 281, 123 + dy], mb.mat('paper', 0.4));
    else line(279, 125, 291, 124, mb.shade(-1));
  }

  return mb;
};

// ---------------- lighting ----------------
export const roomLights = (s: RoomState) => {
  const open = s.door !== 'closed';
  const flash = s.flash;
  const mI = s.monitor;
  const wedge = (x: number, y: number) => {
    if (!open || y < WALL_FLOOR_Y) return 0;
    const t = (y - WALL_FLOOR_Y) / (ROOM_H - WALL_FLOOR_Y);
    const xl = DOOR.x0 + 1 + (262 - DOOR.x0) * t;
    const xr = DOOR.x1 + (372 - DOOR.x1) * t;
    if (x < xl || x > xr) return 0;
    if (s.shadow && s.shadow(x, y)) return 0.12;
    return (0.95 - 0.45 * t) * (1 + flash * 0.4);
  };
  return {
    amb: (x: number, y: number) => {
      let a = y >= WALL_FLOOR_Y ? 1.9 : 2.3;
      // moonlight panes on the floor (window light, mullion-split parallelogram)
      if (y >= 164 && y <= 198) {
        const t = (y - 164) / 34;
        const u = x - (58 + t * 42);
        if (u >= 0 && u < 86) {
          const pane = u % 43;
          if (pane > 2 && !(y >= 180 && y <= 182)) a += 1.7;
        }
      }
      // window spill on nearby wall
      const dw = Math.hypot((x - 62) / 70, (y - 70) / 55);
      if (y < WALL_FLOOR_Y && dw < 1) a += (1 - dw) * 1.4;
      // vignette
      const vx = (x - 240) / 240, vy = (y - 100) / 110;
      a -= Math.max(0, vx * vx + vy * vy - 0.55) * 1.8;
      return a;
    },
    cyan: (x: number, y: number) => {
      const dx = x - MON.cx, dy = (y - MON.cy) * 1.15;
      const d = Math.hypot(dx, dy);
      let L = clamp(1 - d / 185, 0, 1);
      L = Math.pow(L, 1.6);
      if (y < WALL_FLOOR_Y) {
        // wall behind the screen: a wide, low halo (screen faces away from the wall), cut off above the shelf line
        const halo = clamp(1 - Math.hypot(dx / 78, (y - MON.cy - 8) / 26), 0, 1);
        L = L * 0.42 + Math.pow(halo, 0.8) * 0.42;
      } else {
        // floor: the desk top shades the strip just in front of it; beyond that a pool of screen light
        const t = clamp((y - 164) / 10, 0, 1);
        L *= 0.3 + 0.75 * t;
        // Mas + chair cast a shadow into the pool, away from the screen
        const u = (y - 164) / 38;
        const sx0 = 204 + u * 14, sx1 = 236 + u * 34;
        if (y > 163 && x > sx0 && x < sx1) L *= 0.35;
      }
      // desk top right in front of screen
      if (y >= DESK.top0 && y <= DESK.edge && x > DESK.x0 && x < DESK.x1) L += 0.2 * clamp(1 - Math.abs(dx) / 90, 0, 1);
      return L * mI;
    },
    warm: (x: number, y: number) => {
      if (!open) {
        // sliver of light under the closed door
        if (y >= WALL_FLOOR_Y && y < WALL_FLOOR_Y + 5 && x > DOOR.x0 - 6 + (y - 150) * -2 && x < DOOR.x1 + 6 + (y - 150) * 2) return (0.5 - (y - 150) * 0.09) * (1 - s.underDoor * 0.3);
        return 0;
      }
      let L = wedge(x, y);
      // bounce around the door casing
      const d = Math.hypot((x - 422) / 60, (y - 104) / 70);
      if (d < 1) L = Math.max(L, (1 - d) * 0.55 * (1 + flash));
      return L;
    },
    dither: 0.5,
  };
};

export const renderRoom = (s: RoomState, out: Buf, oy = 0) => {
  const mb = paintRoom(s);
  const tmp = new Buf(ROOM_W, ROOM_H, PAL.N0);
  resolve(mb, roomLights(s), tmp, 0);
  const [sx, sy] = s.shake;
  for (let y = 0; y < ROOM_H; y++)
    for (let x = 0; x < ROOM_W; x++) {
      const c = tmp.get(clamp(x - sx, 0, ROOM_W - 1), clamp(y - sy, 0, ROOM_H - 1));
      out.set(x, y + oy, c);
    }
};

/** Mas's glass of water — drawn after everything, never shaken, never rippled. */
export const drawGlass = (b: Buf, oy = 0, off: [number, number] = [0, 0]) => {
  const {x, y, w, h} = GLASS;
  const set = (i: number, j: number, c: number) => b.set(x + i + off[0], y + j + oy + off[1], c);
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const edge = i === 0 || i === w - 1;
      const water = j >= 4;
      if (edge) set(i, j, i === 0 ? PAL.C6 : PAL.C3);
      else if (water) set(i, j, j === 4 ? PAL.C8 : i === 1 ? PAL.C4 : (i + j) % 2 === 0 ? PAL.C2 : PAL.C3);
      else if (i === 1 && j < 4) set(i, j, PAL.C4);
    }
  // rim + base
  for (let i = 0; i < w; i++) set(i, h, i === 0 ? PAL.C5 : PAL.C4);
  set(1, -1, PAL.C7); set(w - 2, -1, PAL.C4);
  for (let i = 1; i < w - 1; i++) set(i, -1, PAL.C3);
  set(1, 6, PAL.C9);
};

/** Adventure-game "item glint": 1px -> cross -> big cross -> 1px. */
export const drawGlint = (b: Buf, x: number, y: number, k: number) => {
  const c = PAL.C9;
  if (k === 0 || k === 4) { b.set(x, y, c); return; }
  const r = k === 2 ? 3 : 2;
  b.set(x, y, c);
  for (let i = 1; i <= r; i++) {
    const cc = i === r ? PAL.C6 : c;
    b.set(x + i, y, cc); b.set(x - i, y, cc); b.set(x, y + i, cc); b.set(x, y - i, cc);
  }
};
