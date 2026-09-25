// MR. MAS — shared room: MAS'S DARK ROOM, the MEDIUM PLATE (the desk). Ep1 act 4 draft 3.1 sc 26A, 29 (the `[2S]`s),
// new file, owned by the act-4 medium-tier artist. pov-and-framing §4.3 rule 13: "Dark rooms make close shots cheap.
// Only the lit area carries detail. A desk edge, the cyan cone and the rack LEDs are a whole medium plate."
// The same room as rooms/darkroom.ts (the intro's cold-open room), a camera step closer: Mas at the desk in the left
// third (cast/mas-medium, head ≈ 36 px), THE ORB at his far shoulder (cast/orb-medium, r 12), the monitor at the
// frame's left edge turned to him (its cyan cone is the key), the window and the city behind them, the back wall with
// the place TASYA's slate-blue door steps up out of (sc 29: "the two-shot holds the whole back wall ... so no wide is
// needed"), the server rack at the right with its LEDs and its drive slot (the check tray ejects across the desk).
// On the desk top: the tally (two faint marks, the third carved), the glass (its water line one flat row: it never
// ripples), the GUEST lanyard laid square beside it, the phone (face down / face up with a screen painter).
// It is a plate, so it logs `[W]` when nobody is in it; with the medium rigs in it, it's the `[2S]`.
// Light (the show's language): key = the monitor (cyan), camera-left; ambient = night; the window's cold city glow as
// a back light. Lighting notes step the room down (`dim`); they never relight a face.
// DRAW ORDER:  drawDarkPlate (wall, window, door, shelf, monitor, rack)  ->  the Orb  ->  Mas's BACK image  ->
//              drawDarkPlateDesk (the desk top + everything on it)  ->  Mas's FRONT image (forearms, hands)  ->
//              drawDarkPlateFront (the check tray's lip, the vignette)
// cast/mas-medium's drawMasMedium takes `desk` for exactly this: drawMasMedium(b, x, y, s, {desk: (b) => drawDarkPlateDesk(b, f, o)}).
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {MatBuf, resolve} from '../light';
import {ROOM_W, ROOM_H, RoomOut, newRoomOut, tiny, vignette} from './kit-b';
import {text, textWidth} from '../font';

// ------------------------------------------------------------------ geometry (frame coords, 480 x 203)
export const DPLATE = {
  /** the desk top's far edge (Mas's rig row MAS_M_DESK sits on it) */
  deskY: 120,
  /** the desk's near edge: below it is the dark under the desk (the V.O. band, y 182-203, sits on shadow) */
  nearY: 178,
  win: {x0: 108, x1: 300, y0: 6, y1: 106, mx: 204, my: 40},
  /** TASYA's door in the back wall, between the window and the rack (outer frame; its foot is behind the desk) */
  door: {x0: 318, x1: 362, y0: 22},
  rack: {x0: 400, x1: 480, y0: 14},
  /** the rack's drive slot, at the desk's height, facing left: the check tray comes out of it */
  slot: {x: 404, y: 110, w: 3, h: 8},
  shelf: {x0: 0, x1: 96, y: 22},
  /** the monitor, turned to him: its screen quad (the near, taller left edge; the far, shorter right edge) */
  mon: {x0: 4, x1: 64, topL: 38, botL: 102, topR: 44, botR: 96},
  /** where the scenes put the cast (top-left of cast/mas-medium's rig; the Orb's centre) */
  mas: [88, 36] as [number, number],
  orb: [202, 66] as [number, number],
  /** his glass and the GUEST lanyard laid square beside it: on the desk under the Orb, so its look from the phone
   *  (camera-left) to the lanyard (straight down) is one clear step, never a 1-px nudge */
  glass: {x: 170, y: 126, w: 9, h: 26},
  lanyard: {x: 184, y: 152},
  /** the phone lying on the desk (under his camera-left hand in 'phone') */
  phone: {x: 98, y: 132, w: 22, h: 12},
  /** the tally: three grooves carved in the desk top in front of him; mark 3 is where his thumb rests ('tally') */
  tally: {x: 128, y: 134, gap: 10, len: 12},
};
const D = DPLATE;
/**
 * The Orb's looks from DPLATE.orb, hand-set so every step is a readable whole-pixel iris move (a computed aim from
 * this distance collapses marks 1..3 into one look). 26A: mark1 -> mark2 -> mark3 -> thumb, one per beat (orbStep).
 * 29: phone -> lanyard (beat 3), held. 26A [P]: face (the iris lifts to his face). [0, 0] = into the lens.
 */
export const DPLATE_LOOK: Record<'mark1' | 'mark2' | 'mark3' | 'thumb' | 'phone' | 'lanyard' | 'glass' | 'face' | 'grid' | 'door' | 'tray' | 'lens', [number, number]> = {
  mark1: [-0.78, 0.62], mark2: [-0.62, 0.64], mark3: [-0.46, 0.66], thumb: [-0.4, 0.72],
  phone: [-0.85, 0.5], lanyard: [-0.05, 0.85], glass: [-0.2, 0.8], face: [-0.72, -0.04], grid: [-0.95, -0.15],
  door: [0.85, 0.05], tray: [0.95, 0.4], lens: [0, 0],
};
/** the virtual face-on screen the monitor samples (a kit paints it: the feed, the counter, the list, Gerg's tile) */
export const DPLATE_SCREEN_W = 96, DPLATE_SCREEN_H = 60;

export interface DarkPlateOpts {
  /** tally: 0 none · 2 the two faint old marks · 3 with the third (carve 0..1, held in quarters) */
  tally?: 0 | 2 | 3;
  carve?: number;
  /** fresh shavings by mark 3 (26A bar 1, until his hand brushes them away) */
  shavings?: boolean;
  lanyard?: boolean;
  glass?: boolean;
  phone?: 'none' | 'down' | 'up';
  /** what the face-up phone shows (a kit paints it: Rima's post legible, the heart taps) */
  phoneScreen?: (scr: Buf, f: number) => void;
  /** what the monitor shows; default: the dim feed */
  screen?: (scr: Buf, f: number) => void;
  /** the board's four-tile grid, small, in the monitor's corner (sc 29) */
  boardGrid?: boolean;
  clock?: string;
  /** Tasya's door: 0 = no door; 1..3 its three held steps up out of the shadow; 4 = there. ajar = open a crack */
  door?: 0 | 1 | 2 | 3 | 4;
  doorAjar?: boolean;
  /** the check tray: 0 in the rack; 1..4 its four held positions out across the desk */
  tray?: 0 | 1 | 2 | 3 | 4;
  /** MAS'S VERSION stillness flag: the LEDs and the city's lights freeze on frame `still` */
  still?: number | null;
  /** lighting note: the room steps down k rungs (the [PF] fallaway uses it; faces are never relit) */
  dim?: 0 | 1 | 2 | 3;
  vignette?: boolean;
}

// ------------------------------------------------------------------ the room behind them (resolved once per state)
const DIG: Record<string, string[]> = {
  '0': ['##', '##', '##', '##', '##'], '1': ['.#', '##', '.#', '.#', '.#'], '2': ['##', '.#', '##', '#.', '##'], '3': ['##', '.#', '##', '.#', '##'],
  '4': ['#.', '##', '##', '.#', '.#'], '5': ['##', '#.', '##', '.#', '##'], '6': ['##', '#.', '##', '##', '##'], '7': ['##', '.#', '.#', '.#', '.#'],
  '8': ['##', '##', '..', '##', '##'], '9': ['##', '##', '##', '.#', '##'],
};
const monLight = (x: number, y: number) => {
  // the monitor faces him: a cone from its face (x ~ 40, y ~ 70) opening to the right
  const dx = x - 44, dy = (y - 70) * 1.25;
  if (dx < -30) return 0;
  const d = Math.hypot(dx, dy);
  const ang = Math.abs(Math.atan2(dy, Math.max(1, dx)));
  const cone = clamp(1 - ang / 1.05, 0, 1);
  return Math.pow(clamp(1 - d / 230, 0, 1), 1.3) * (0.35 + 0.65 * cone);
};
const paintBack = (clock: string): MatBuf => {
  const mb = new MatBuf(ROOM_W, ROOM_H);
  const {win, door, rack, shelf} = D;
  // wall (plaster specks, never a pattern)
  rect(0, 0, ROOM_W, D.deskY, mb.mat('wall', 0));
  for (let y = 0; y < D.deskY; y++) for (let x = 0; x < ROOM_W; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  // the window: trim, the black reveal, the sky + city (emissive), mullion + transom, the sill
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, win.y1 - win.y0 + 11, mb.mat('trim', 0.4));
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, 1, mb.shade(1));
  rect(win.x0 - 1, win.y0 - 1, win.x1 - win.x0 + 3, win.y1 - win.y0 + 3, mb.mat('black', 0));
  for (let y = win.y0; y <= win.y1; y++)
    for (let x = win.x0; x <= win.x1; x++) {
      const t = (y - win.y0) / (win.y1 - win.y0) + (bayer(x, y) - 0.5) * 0.1;
      mb.emit(t < 0.4 ? PAL.N2 : t < 0.68 ? PAL.N3 : t < 0.9 ? PAL.N4 : PAL.N5)(x, y);
    }
  rect(win.mx - 1, win.y0, 3, win.y1 - win.y0 + 1, mb.mat('trim', -0.2));
  rect(win.x0, win.my, win.x1 - win.x0 + 1, 2, mb.mat('trim', -0.2));
  rect(win.x0 - 8, win.y1 + 5, win.x1 - win.x0 + 17, 2, mb.mat('trim', 1));
  rect(win.x0 - 7, win.y1 + 7, win.x1 - win.x0 + 15, 2, mb.mat('trim', -0.8));
  // (no door here until it steps up out of the shadow: drawDoor paints it, frame and all, in held palette steps)
  void door;
  // the shelf over the monitor: books, the red clock, a plant
  rect(shelf.x0, shelf.y, shelf.x1 - shelf.x0, 3, mb.mat('wood', 0.5));
  rect(shelf.x0, shelf.y, shelf.x1 - shelf.x0, 1, mb.shade(1));
  const books: Array<[number, number, string, number]> = [[4, 12, 'red', 0], [8, 10, 'paper', -1.5], [12, 13, 'wall', 0.8], [16, 11, 'red', -0.5], [20, 12, 'paper', -2], [24, 9, 'wood', 0.5]];
  for (const [bx, bh, bm, bl] of books) rect(bx, shelf.y - bh, 3, bh, mb.mat(bm, bl));
  rect(56, shelf.y - 10, 17, 10, mb.mat('black', 0.5));
  rect(56, shelf.y - 10, 17, 1, mb.shade(1));
  const dd = (d: string, x: number) => (DIG[d] ?? DIG['0']).forEach((r, j) => [...r].forEach((c, i) => c === '#' && mb.emit(PAL.R3)(x + i, shelf.y - 8 + j)));
  const [hh, mm = '00'] = clock.split(':');
  dd(hh.slice(-1), 59); mb.emit(PAL.R2)(62, shelf.y - 7); mb.emit(PAL.R2)(62, shelf.y - 5); dd(mm[0], 64); dd(mm[1], 68);
  rect(82, shelf.y - 5, 7, 5, mb.mat('red', -1));
  ellipse(85, shelf.y - 7, 4.5, 3, mb.mat('plant', 0.5));
  // the rack: black, its front a stack of units, its left edge catching the monitor across the room
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, D.deskY - rack.y0, mb.mat('black', 0));
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, 1, mb.shade(1.4));
  rect(rack.x0, rack.y0 + 1, 1, D.deskY - rack.y0 - 1, mb.shade(1.2));
  for (let y = rack.y0 + 6; y < D.deskY - 4; y += 12) {
    rect(rack.x0 + 5, y, rack.x1 - rack.x0 - 5, 10, mb.mat('metal', -1.4));
    rect(rack.x0 + 5, y, rack.x1 - rack.x0 - 5, 1, mb.shade(0.8));
    for (let x = rack.x0 + 22; x < rack.x1; x += 2) mb.shade(-0.7)(x, y + 4);
  }
  // the drive slot (a dark mouth at desk height)
  rect(D.slot.x, D.slot.y, D.slot.w + 16, D.slot.h, mb.mat('black', -1));
  rect(D.slot.x, D.slot.y - 1, D.slot.w + 16, 1, mb.shade(1.6));
  return mb;
};
const backLights = (dim: number) => ({
  amb: (x: number, y: number) => {
    let a = 2.1 - dim * 0.5;
    const {win} = D;
    const dw = Math.hypot((x - (win.x0 + win.x1) / 2) / 150, (y - (win.y0 + win.y1) / 2) / 90);
    if (dw < 1) a += (1 - dw) * 1.1;
    return a;
  },
  cyan: (x: number, y: number) => monLight(x, y) * 0.95 * Math.max(0, 1 - dim * 0.34),
  warm: () => 0,
  dither: 0.6,
});

const cache = new Map<string, Buf>();
const cityLights = (b: Buf, f: number) => {
  const {win} = D;
  // far towers (haze), the spire (the NOPEAI cathedral-to-be, never explained), near towers with lit windows
  const W0 = win.x0, WH = win.y1 - win.y0;
  const put = (x: number, y: number, c: number) => { if (x >= win.x0 && x <= win.x1 && y >= win.y0 && y <= win.y1 && !(x >= win.mx - 1 && x <= win.mx + 1) && !(y >= win.my && y <= win.my + 1)) b.set(x, y, c); };
  for (let x = W0, k = 0; x < win.x1; k++) {
    const w = 7 + Math.floor(hash(k, 1) * 10);
    const top = win.y0 + Math.round(WH * (0.42 + hash(k, 2) * 0.3));
    for (let yy = top; yy <= win.y1; yy++) for (let xx = x; xx < Math.min(x + w, win.x1 + 1); xx++) put(xx, yy, PAL.N2);
    for (let j = top + 3; j < win.y1 - 1; j += 3) for (let i = x + 1; i < Math.min(x + w - 1, win.x1); i += 2) if (hash(i, j, x) < 0.07) put(i, j, hash(j, i, 3) < 0.6 ? PAL.W4 : PAL.C4);
    x += w + 1 + Math.floor(hash(k, 3) * 3);
  }
  const spx = W0 + 150, spy = win.y0 + Math.round(WH * 0.34);
  for (let yy = spy; yy <= win.y1; yy++) for (let xx = spx - 4; xx <= spx + 4; xx++) put(xx, yy, PAL.N2);
  poly([spx - 4, spy, spx + 5, spy, spx + 1, spy - 16], (x, y) => put(x, y, PAL.N2));
  for (let yy = spy - 23; yy < spy - 16; yy++) put(spx, yy, PAL.N2);
  if (Math.floor(f / 12) % 2 === 0) put(spx, spy - 24, PAL.C5);
  for (let x = W0, k = 0; x < win.x1; k++) {
    const w = 12 + Math.floor(hash(k, 11) * 16);
    const top = win.y0 + Math.round(WH * (0.7 + hash(k, 12) * 0.2));
    for (let yy = top; yy <= win.y1; yy++) for (let xx = x; xx < Math.min(x + w, win.x1 + 1); xx++) put(xx, yy, xx === x ? PAL.N2 : PAL.N1);
    for (let j = top + 2; j < win.y1 - 1; j += 2) for (let i = x + 2; i < Math.min(x + w - 1, win.x1); i += 2) if (hash(i, j, x + 7) < 0.1) put(i, j, hash(j, i, 5) < 0.55 ? PAL.W5 : PAL.C4);
    if (k === 2 && Math.floor((f + 5) / 16) % 2 === 0) put(x + 2, top - 1, PAL.R3);
    x += w + Math.floor(hash(k, 13) * 4);
  }
};

// the monitor's frame: the side panel at the left (it's turned to him), the bezel, the screen quad, the foot
const quadY = (x: number, a: number, b2: number) => Math.round(a + ((x - D.mon.x0) / (D.mon.x1 - D.mon.x0)) * (b2 - a));
const drawMonitor = (b: Buf, scr: Buf) => {
  const {x0, x1, topL, botL, topR, botR} = D.mon;
  // the back/side panel peeking at the left edge
  for (let x = x0 - 4; x < x0; x++) for (let y = topL + 2; y <= botL - 2; y++) b.set(x, y, x === x0 - 4 ? PAL.G1 : PAL.N0);
  for (let x = x0; x <= x1; x++) {
    const t0 = quadY(x, topL, topR), t1 = quadY(x, botL, botR);
    for (let y = t0; y <= t1; y++) b.set(x, y, PAL.N1);
    b.set(x, t0, PAL.G2); b.set(x, t1, PAL.N0);
    if (x < x0 + 3 || x > x1 - 3) { for (let y = t0; y <= t1; y++) b.set(x, y, x === x0 ? PAL.G2 : PAL.N1); continue; }
    // sample the virtual screen (the brightest source pixel per target pixel: tiny type survives)
    const u = ((x - x0 - 3) / (x1 - x0 - 6)) * scr.w;
    const s0 = t0 + 3, s1 = t1 - 4;
    for (let y = s0; y <= s1; y++) {
      const v = Math.min(scr.h - 1, Math.floor(((y - s0) / Math.max(1, s1 - s0)) * scr.h));
      const ui = Math.min(scr.w - 1, Math.floor(u));
      b.set(x, y, scr.get(ui, v));
    }
  }
  b.set(x1 - 5, quadY(x1 - 5, botL, botR) - 2, PAL.C3); // power LED
  // the foot on the desk
  const fx = Math.round((x0 + x1) / 2) - 4;
  rect(fx, botL - 2, 8, 22, b.ink(PAL.G0)); rect(fx, botL - 2, 1, 22, b.ink(PAL.C2));
  rect(fx - 12, D.deskY + 4, 32, 3, b.ink(PAL.G1)); rect(fx - 12, D.deskY + 4, 32, 1, b.ink(PAL.C3)); rect(fx - 12, D.deskY + 7, 32, 1, b.ink(PAL.N0));
};
/** the default screen: his feed, dim, each post a grey block with its red heart */
const screenFeed = (scr: Buf, f: number) => {
  rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  for (let k = 0; k < 6; k++) {
    const y = 3 + k * 10;
    rect(4, y, 60, 8, scr.ink(PAL.N3));
    rect(6, y + 2, 4, 4, scr.ink(PAL.G4));
    for (let i = 0; i < 34; i++) if (i % 7 !== 6) scr.set(13 + i, y + 3, PAL.P0);
    for (let i = 0; i < 20; i++) scr.set(13 + i, y + 5, PAL.G4);
    scr.set(58, y + 3, PAL.R3); scr.set(59, y + 3, PAL.R3); scr.set(58, y + 4, PAL.R2);
  }
  void f;
};
/** the board's four-tile grid, small, for the monitor's corner (ALYI · NELEH / MADA · THE QUIET VOTE) */
export const drawBoardGridCorner = (scr: Buf, x: number, y: number) => {
  rect(x, y, 25, 17, scr.ink(PAL.N0));
  const tile = (tx: number, ty: number, bg: number) => rect(tx, ty, 11, 7, scr.ink(bg));
  tile(x + 1, y + 1, PAL.G2); scr.set(x + 6, y + 3, PAL.K3); scr.set(x + 6, y + 4, PAL.K2); scr.set(x + 5, y + 3, PAL.K2);
  tile(x + 13, y + 1, PAL.G3); scr.set(x + 18, y + 3, PAL.S4); scr.set(x + 17, y + 3, PAL.B2); scr.set(x + 19, y + 3, PAL.B2); scr.set(x + 21, y + 6, PAL.W7);
  tile(x + 1, y + 9, PAL.G2); scr.set(x + 6, y + 12, PAL.S3); scr.set(x + 6, y + 10, PAL.C6);
  tile(x + 13, y + 9, PAL.N0); scr.set(x + 18, y + 12, PAL.N3);
};

/** Tasya's slate-blue door stepping up out of the shadow (rise 1..3 held, 4 there), a key already in its lock. */
const drawDoor = (b: Buf, rise: number, ajar: boolean, f: number) => {
  const {x0, x1, y0} = D.door;
  const y1 = D.deskY - 1;
  const k = rise - 4; // palette steps from the shadow: -3 .. 0
  const s = (c: number) => stepColor(c, k);
  // the architrave (it arrives with the door), then the frame
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, y1 - y0 + 4, b.ink(s(PAL.N3)));
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, 1, b.ink(s(PAL.N5)));
  rect(x0, y0, x1 - x0, y1 - y0 + 1, b.ink(s(PAL.N4)));
  rect(x0, y0, x1 - x0, 1, b.ink(s(PAL.N6)));
  const lx0 = x0 + 3, lx1 = x1 - 3, ly0 = y0 + 3;
  if (ajar) {
    for (let y = ly0; y <= y1; y++) for (let x = lx0; x <= lx1; x++) b.set(x, y, x > lx1 - 6 ? (x === lx1 - 5 ? PAL.G6 : PAL.N8) : s(PAL.N5));
    rect(lx0, ly0, 1, y1 - ly0 + 1, b.ink(s(PAL.N7)));
    return;
  }
  for (let y = ly0; y <= y1; y++) for (let x = lx0; x <= lx1; x++) b.set(x, y, s(x === lx0 ? PAL.N7 : x === lx1 ? PAL.N5 : PAL.N6));
  for (const [py0, py1] of [[ly0 + 6, ly0 + 38], [ly0 + 46, y1 + 8]]) {
    rect(lx0 + 5, py0, lx1 - lx0 - 9, 1, b.ink(s(PAL.N7)));
    if (py1 <= y1) rect(lx0 + 5, py1, lx1 - lx0 - 9, 1, b.ink(s(PAL.N4)));
    rect(lx0 + 5, py0, 1, Math.min(py1, y1) - py0, b.ink(s(PAL.N7)));
    rect(lx1 - 4, py0, 1, Math.min(py1, y1) - py0 + 1, b.ink(s(PAL.N4)));
  }
  // the knob and the key already in the lock (a steel key with a round bow; it jangles on his line)
  const ky = ly0 + 50;
  rect(lx1 - 5, ky - 6, 3, 2, b.ink(s(PAL.G5))); b.set(lx1 - 5, ky - 6, s(PAL.G6));
  const jig = Math.floor(f / 4) % 2;
  b.set(lx1 - 4, ky, s(PAL.N1));
  rect(lx1 - 3, ky, 4, 1, b.ink(s(PAL.G5)));
  b.set(lx1 + 1, ky - 1 + jig, s(PAL.G6)); b.set(lx1 + 2, ky + jig, s(PAL.G5)); b.set(lx1 + 1, ky + 1 + jig, s(PAL.G4)); b.set(lx1, ky + jig, s(PAL.G5));
};

const drawRackLeds = (b: Buf, f: number) => {
  const eighth = Math.floor((f * 2) / 15);
  for (let k = 0, y = D.rack.y0 + 6; y < D.deskY - 4; y += 12, k++) {
    const x = D.rack.x0 + 10;
    b.set(x, y + 3, PAL.C4);
    b.set(x + 3, y + 3, k % 2 ? PAL.C3 : PAL.L2);
    if (k === 1 || k === 4 || k === 6) b.set(x, y + 7, (eighth + k) % 3 !== 0 ? PAL.R3 : PAL.R0);
    if (k % 3 === 2) b.set(x + 6, y + 7, (eighth + k * 2) % 4 === 0 ? PAL.W6 : PAL.W2);
  }
};

/**
 * The plate behind the cast, into rows 0..202 of `b`: wall, window + city, the door (if it's there), the shelf and its
 * clock, the monitor (with `screen`), the rack. Returns anchors for the cast and the props.
 */
export const drawDarkPlate = (b: Buf, f: number, o: DarkPlateOpts = {}): RoomOut => {
  const clock = o.clock ?? '2:06';
  const dim = o.dim ?? 0;
  const fr = o.still !== undefined && o.still !== null ? o.still : f;
  const key = `${clock}|${dim}`;
  let rb = cache.get(key);
  if (!rb) {
    rb = new Buf(ROOM_W, ROOM_H, PAL.N0);
    resolve(paintBack(clock), backLights(dim), rb, 0);
    cache.set(key, rb);
  }
  for (let y = 0; y < ROOM_H; y++) b.c.set(rb.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  cityLights(b, fr);
  if (o.door) drawDoor(b, o.door, !!o.doorAjar, fr);
  drawRackLeds(b, fr);
  const scr = new Buf(DPLATE_SCREEN_W, DPLATE_SCREEN_H, PAL.N1);
  (o.screen ?? screenFeed)(scr, fr);
  if (o.boardGrid) drawBoardGridCorner(scr, DPLATE_SCREEN_W - 27, 2);
  drawMonitor(b, scr);
  if (dim) for (let y = 0; y < D.deskY; y++) for (let x = D.mon.x0; x <= D.mon.x1; x++) { /* the screen stays emissive */ void x; void y; }
  const out = newRoomOut(['desk', 'window', 'door', 'monitor']);
  out.masks.desk.addRect(0, D.deskY, ROOM_W, ROOM_H - D.deskY);
  out.masks.window.addRect(D.win.x0, D.win.y0, D.win.x1 - D.win.x0 + 1, D.win.y1 - D.win.y0 + 1);
  out.masks.door.addRect(D.door.x0, D.door.y0, D.door.x1 - D.door.x0, D.deskY - D.door.y0);
  out.masks.monitor.addRect(D.mon.x0 - 4, D.mon.topL, D.mon.x1 - D.mon.x0 + 5, D.mon.botL - D.mon.topL + 1);
  const t = D.tally;
  out.anchors = {
    mas: D.mas, orb: D.orb, glass: [D.glass.x + 4, D.glass.y + 4], lanyard: [D.lanyard.x + 12, D.lanyard.y + 6], phone: [D.phone.x + 11, D.phone.y + 6],
    mark1: [t.x, t.y + 4], mark2: [t.x + t.gap, t.y + 4], mark3: [t.x + t.gap * 2, t.y + 4],
    doorKey: [D.door.x1 - 2, D.door.y0 + 53], slot: [D.slot.x, D.slot.y + 4],
    /** the grid in the monitor's corner (for the Orb's look at ALYI's thumbnail) */
    gridCorner: [D.mon.x1 - 12, D.mon.topR + 8],
  };
  return out;
};

// ------------------------------------------------------------------ the desk top and what's on it
const deskCache = new Map<string, Buf>();
const paintDesk = (dim: number): Buf => {
  const key = String(dim);
  let rb = deskCache.get(key);
  if (rb) return rb;
  rb = new Buf(ROOM_W, ROOM_H, PAL.N0);
  const mb = new MatBuf(ROOM_W, ROOM_H);
  // dark wood receding: long horizontal grain (the F1.2 dither settles into lines like these); the far edge lip
  for (let y = D.deskY; y < ROOM_H; y++)
    for (let x = 0; x < ROOM_W; x++) {
      const v = y + 1.2 * Math.sin(x / 71 + y / 37) + 0.6 * Math.sin(x / 19 + y / 7);
      const band = Math.floor(v / 5);
      let lvl = (hash(band, 3, 11) - 0.5) * 0.5 + 0.5 - (y - D.deskY) / 160;
      if (v - band * 5 < 1 && hash(band, 5, 13) < 0.55) lvl -= 0.8;
      mb.mat('wood', lvl)(x, y);
    }
  rect(0, D.deskY, ROOM_W, 1, mb.shade(1.8));
  rect(0, D.deskY + 1, ROOM_W, 1, mb.shade(0.6));
  // the near edge: a rounded lip catching the monitor, the edge's face, then the dark under the desk
  rect(0, D.nearY, ROOM_W, 1, mb.shade(1.2));
  rect(0, D.nearY + 1, ROOM_W, 4, mb.mat('wood', -1.4));
  rect(0, D.nearY + 5, ROOM_W, ROOM_H - D.nearY - 5, mb.mat('black', -2));
  resolve(mb, {
    amb: (x, y) => 1.8 - dim * 0.4 - Math.max(0, (y - 160) / 40),
    cyan: (x, y) => {
      // the monitor's pool across the desk toward him, and its glossy reflection just under the monitor
      if (y > D.nearY + 4) return 0;
      const d = Math.hypot((x - 60) / 250, (y - D.deskY - 6) / 70);
      return clamp(1.02 - d, 0, 1) * 0.95 * Math.max(0, 1 - dim * 0.34);
    },
    warm: () => 0, dither: 0.45,
  }, rb, 0);
  for (let y = D.deskY + 3; y < D.deskY + 22; y++) for (let x = D.mon.x0 + 2; x < D.mon.x1 + 4; x++) {
    if (bayer(x, y) < 0.42 - (y - D.deskY) * 0.02 && hash(x >> 2, y, 9) < 0.8) rb.set(x, y, stepColor(rb.get(x, y), 1));
  }
  deskCache.set(key, rb);
  return rb;
};

/** The tally at medium scale: grooves 1 px wide + a lit wall; old = worn (shorter, broken, a rung down). */
const drawTally = (b: Buf, n: number, carve: number, shavings: boolean) => {
  const {x, y, gap, len} = D.tally;
  // each groove: its dark floor, its lit right wall (the key rakes across from the monitor), a pale lip at the top.
  // The two old ones are worn: a rung softer, broken, shorter. The new one is clean, sharp and bright.
  const groove = (gx: number, l: number, fresh: boolean) => {
    for (let j = 0; j < l; j++) {
      if (!fresh && (j === 3 || j === 8)) continue; // worn gaps
      const X = gx + (j > 5 ? 1 : 0), Y = y + j; // a hand-cut lean
      b.set(X, Y, fresh ? PAL.N0 : stepColor(b.get(X, Y), -3));
      b.set(X + 1, Y, fresh ? PAL.C7 : stepColor(b.get(X + 1, Y), 2));
      b.set(X - 1, Y, stepColor(b.get(X - 1, Y), fresh ? -2 : -1));
    }
    if (fresh) { b.set(gx, y - 1, PAL.C4); b.set(gx + 1, y - 1, PAL.C7); }
  };
  if (n >= 2) { groove(x, len - 2, false); groove(x + gap, len - 1, false); }
  if (n >= 3) {
    const q = Math.round(clamp(carve, 0, 1) * 4) / 4;
    if (q > 0) groove(x + gap * 2, Math.max(2, Math.round(len * q)), true);
    if (shavings && q > 0) for (const [dx, dy, c] of [[3, 2, PAL.C6], [4, 1, PAL.C7], [3, 5, PAL.C5], [-2, 8, PAL.C5], [4, 9, PAL.C4], [-1, 11, PAL.C4]] as Array<[number, number, number]>) b.set(x + gap * 2 + dx, y + dy, c);
  }
};
const drawGlass = (b: Buf) => {
  const {x, y, w, h} = D.glass;
  const water = y + 7;
  for (let i = 0; i < w + 5; i++) b.set(x + 3 + i, y + h, PAL.N0);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = x + i, Y = y + j;
    if (j < water - y) { if (i === 0) b.set(X, Y, PAL.C5); else if (i === w - 1) b.set(X, Y, PAL.C2); else if (i === 2) b.set(X, Y, PAL.C3); }
    else b.set(X, Y, i === 0 ? PAL.C6 : i === w - 1 ? PAL.C2 : i === 2 ? PAL.C4 : i < 4 ? PAL.C2 : PAL.C1);
  }
  for (let i = 1; i < w - 1; i++) b.set(x + i, water, i < 5 ? PAL.C8 : PAL.C5); // THE water line: one flat row
  for (let i = 0; i < w; i++) b.set(x + i, y, i < 4 ? PAL.C6 : PAL.C3);
  for (let i = 0; i < w; i++) { b.set(x + i, y + h - 2, i < 4 ? PAL.C5 : PAL.C3); b.set(x + i, y + h - 1, PAL.C2); }
};
/** the GUEST lanyard laid SQUARE beside the glass: the card flat, its strap in a neat loop above it */
const drawLanyard = (b: Buf) => {
  const {x, y} = D.lanyard;
  // strap: a flattened loop (plain grey-blue, no brand)
  for (let i = 2; i < 24; i++) { b.set(x + i, y - 9, PAL.G3); b.set(x + i, y - 8, PAL.G2); }
  for (let j = -8; j < 0; j++) { b.set(x + 1, y + j, PAL.G3); b.set(x + 24, y + j, PAL.G2); }
  // clip + card (foreshortened on the desk: wider than tall), its red band, GUEST
  rect(x + 10, y - 2, 6, 3, b.ink(PAL.G4)); rect(x + 10, y - 2, 6, 1, b.ink(PAL.G6));
  rect(x, y, 26, 15, b.ink(PAL.P1)); rect(x, y, 26, 4, b.ink(PAL.R2)); rect(x, y + 14, 26, 1, b.ink(PAL.P0));
  rect(x + 26, y + 1, 1, 15, b.ink(PAL.N0)); rect(x + 1, y + 15, 26, 1, b.ink(PAL.N0));
  tiny(b, 'GUEST', x + 3, y + 7, PAL.N1);
};
/** the phone lying on the desk: 'down' (its back, one lens) or 'up' (its screen, painted by `screen`) */
const drawPhone = (b: Buf, state: 'down' | 'up', f: number, screen?: (scr: Buf, f: number) => void) => {
  const {x, y, w, h} = D.phone;
  for (let i = 0; i < w; i++) b.set(x + 2 + i, y + h, PAL.N0);
  rect(x, y, w, h, b.ink(PAL.G1)); rect(x, y, w, 1, b.ink(PAL.C3)); rect(x, y, 1, h, b.ink(PAL.C2)); rect(x + w - 1, y, 1, h, b.ink(PAL.N0));
  if (state === 'down') {
    rect(x + 2, y + 2, 3, 3, b.ink(PAL.N0)); b.set(x + 3, y + 3, PAL.C4);
    return;
  }
  const scr = new Buf(w - 4, h - 3, PAL.N0);
  if (screen) screen(scr, f); else rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  for (let j = 0; j < scr.h; j++) for (let i = 0; i < scr.w; i++) b.set(x + 2 + i, y + 1 + j, scr.get(i, j));
};
/** the check tray, sliding out of the rack's slot across the desk in four held positions (tray-first) */
export const TRAY = {w: 176, h: 38};
const drawTray = (b: Buf, pos: number) => {
  if (!pos) return;
  const travel = [0, 44, 100, 150, TRAY.w][pos];
  const x1 = D.slot.x; // the slot: nothing left of it is drawn yet until it has come out
  const x = D.slot.x - travel, y = D.deskY + 4;
  const clip = (X: number) => X < x1;
  const put = (X: number, Y: number, c: number) => { if (clip(X)) b.set(X, Y, c); };
  const box = (X: number, Y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(X + i, Y + j, c); };
  // its shadow on the desk, the black tray, then the giant check lying on it (legible: it's the record)
  for (let i = 2; i < TRAY.w + 2; i++) put(x + i, y + TRAY.h + 1, PAL.N0);
  box(x - 2, y + TRAY.h - 5, TRAY.w + 2, 5, PAL.G1); box(x - 2, y + TRAY.h - 5, TRAY.w + 2, 1, PAL.C3); box(x - 2, y + TRAY.h, TRAY.w + 3, 1, PAL.N0);
  box(x, y, TRAY.w - 4, TRAY.h - 6, PAL.P1);
  box(x, y, TRAY.w - 4, 1, PAL.P2); box(x, y + TRAY.h - 7, TRAY.w - 4, 1, PAL.P0);
  box(x + 2, y + 2, TRAY.w - 8, 1, PAL.L2); // the check's green guilloche border (a plain rule, no bank's)
  box(x + 2, y + TRAY.h - 9, TRAY.w - 8, 1, PAL.L2);
  const tb = new Buf(TRAY.w, TRAY.h, 0xff00ff);
  tiny(tb, 'EVIRHT', 5, 5, PAL.N1);
  tiny(tb, 'TENDER OFFER @ ~$86B VALUATION', 5, 12, PAL.N2);
  for (let i = 5; i < 70; i++) tb.set(i, 25, PAL.P0); // the signature line
  text(tb, 'VOID IF CEO MISSING', 52, 18, PAL.R2);
  for (let j = 0; j < TRAY.h; j++) for (let i = 0; i < TRAY.w; i++) { const c = tb.get(i, j); if (c !== 0xff00ff && (c !== PAL.R2 || hash(i, j, 44) < 0.88)) put(x + i, y + j, c); }
  // the stamp's box
  for (let i = 50; i < 52 + textWidth('VOID IF CEO MISSING') + 2; i++) { put(x + i, y + 16, PAL.R2); put(x + i, y + 26, PAL.R2); }
  for (let j = 16; j <= 26; j++) { put(x + 50, y + j, PAL.R2); put(x + 53 + textWidth('VOID IF CEO MISSING'), y + j, PAL.R2); }
};

/**
 * The desk top and everything on it, drawn over Mas's BACK image (pass this as drawMasMedium's `desk`). Rows
 * DPLATE.deskY..202.
 */
export const drawDarkPlateDesk = (b: Buf, f: number, o: DarkPlateOpts = {}) => {
  const rb = paintDesk(o.dim ?? 0);
  for (let y = D.deskY; y < ROOM_H; y++) b.c.set(rb.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  if (o.tally) drawTally(b, o.tally, o.carve ?? 1, !!o.shavings);
  if (o.glass !== false) drawGlass(b);
  if (o.lanyard) drawLanyard(b);
  if (o.phone && o.phone !== 'none') drawPhone(b, o.phone, o.still ?? f, o.phoneScreen);
  if (o.tray) drawTray(b, o.tray);
};

/** After the cast's forearms: the vignette (and anything nearer than his hands). */
export const drawDarkPlateFront = (b: Buf, f: number, o: DarkPlateOpts = {}) => {
  void f;
  if (o.vignette !== false) vignette(b, 1, 0.64, 0.7, ROOM_H, ROOM_H);
};
void line;
