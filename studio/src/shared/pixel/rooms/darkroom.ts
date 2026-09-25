// MR. MAS — shared room: MAS'S DARK ROOM — NIGHT. Home room (the intro's cold open; ep01 sc 18-23, 26A, 29, 32-33).
// Owner: rooms B. The WIDE is the intro's approved cold-open room (studio/src/dev/mcoldopen/wide.ts, copied here so
// episodes can import it without depending on a dev folder; geometry, materials and lights are unchanged), minus the
// characters: Mas and the Orb are cast (drawMasDesk / the Orb), drawn by the scene on DARKROOM.mas / DARKROOM.orb.
// Added for act 4 (all optional, all off by default = the intro room exactly):
//   tally      the firing tally carved in the desk top: 2 faint old marks, the 3rd clean (carve progress 0..1)
//   lanyard    the GUEST lanyard on the desk beside the glass (sc 29, after NOV 19)
//   screen     what the monitor shows (it faces Mas): 'post' (the intro composer + chart), 'feed' (a feed of hearts)
//              with the board's four-tile grid small in its corner (sc 29), or a custom painter
//   clock      the shelf clock's digits ('1:36' intro, '9:32' sc 26A, '2:06' sc 29)
//   blueDoor   TASYA's slate-blue door in the back wall (sc 29): steps up out of the shadow in held palette steps
//              (rise 1..4), key already in the lock; 'ajar' lets his slate light out
// Plus drawDarkDesk(): the desk, close (sc 26A) — wood grain filling the frame (the F1.2 dither settles into it), the
// two old marks and the third being carved, the glass, the phone.
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, lum, stepColor} from '../palette';
import {MatBuf, resolve} from '../light';
import {Mask} from '../mask';
import {ROOM_W, ROOM_H, RoomOut, newRoomOut, tiny, vignette} from './kit-b';

// ------------------------------------------------------------------ geometry (identical to mcoldopen WIDE)
export const DARKROOM = {
  floorY: 182,
  win: {x0: 272, x1: 452, y0: 24, y1: 166},
  rack: {x0: 40, x1: 80, y0: 72},
  desk: {x0: 196, x1: 360, back: 178, front: 185, panel: 208, legs: 230},
  /** Mas's desk sprite top-left (cast/mas drawMasDesk, desk edge row 37 on desk.back) */
  mas: [288, 178 - 37] as [number, number],
  mon: {x0: 216, y0: 144, w: 55, h: 34},
  glass: {x: 278, y: 170, w: 4, h: 13},
  /** the Orb's centre + radius at his far shoulder (the intro's mark) */
  orb: [347, 150] as [number, number],
  orbR: 6,
  /** Tasya's door in the back wall, far left (outer frame x0..x1, top y0; its sill is the floor line) */
  blueDoor: {x0: 4, x1: 36, y0: 98},
  /** the tally on the desk top (right of his forearms), and the lanyard's spot (left of the glass) */
  tally: {x: 342, y: 179},
  lanyard: {x: 256, y: 180},
};
const D = DARKROOM;

export interface DarkRoomOpts {
  /** tally marks: 0 none (the intro has 2 faint marks; set 2), 2 = the two old ones, 3 = with the new one */
  tally?: 0 | 2 | 3;
  /** progress of the 3rd mark (0..1, held in quarters) */
  carve?: number;
  lanyard?: boolean;
  screen?: 'post' | 'feed' | ((scr: Buf, f: number) => void);
  /** the board's four-tile grid in the monitor's corner (sc 29) */
  boardGrid?: boolean;
  clock?: string;
  /** 0 = no door; 1..4 = it steps up out of the shadow (4 = fully there) */
  blueDoor?: 0 | 1 | 2 | 3 | 4;
  blueDoorAjar?: boolean;
  /** the glass on the desk (default true; set false if the cast draws his glass) */
  glass?: boolean;
  vignette?: boolean;
  /** draw/vignette all 270 rows (intro framing) instead of the 203-row room */
  fullFrame?: boolean;
}

// ------------------------------------------------------------------ paint (from mcoldopen/wide.ts paintRoom: the approved room)
const DIG: Record<string, string[]> = {
  '0': ['##', '##', '##', '##', '##'], '1': ['.#', '##', '.#', '.#', '.#'], '2': ['##', '.#', '##', '#.', '##'], '3': ['##', '.#', '##', '.#', '##'],
  '4': ['#.', '##', '##', '.#', '.#'], '5': ['##', '#.', '##', '.#', '##'], '6': ['##', '#.', '##', '##', '##'], '7': ['##', '.#', '.#', '.#', '.#'],
  '8': ['##', '##', '..', '##', '##'], '9': ['##', '##', '##', '.#', '##'],
};
const paintRoom = (f: number, clock: string): MatBuf => {
  const mb = new MatBuf(480, 270);
  const {floorY, win, rack, desk} = D;
  rect(0, 0, 480, floorY, mb.mat('wall', 0));
  rect(0, 0, 480, 5, mb.mat('black', 0));
  rect(0, 5, 480, 1, mb.mat('trim', 1));
  rect(0, 6, 480, 2, mb.mat('trim', 0));
  for (let y = 9; y < floorY - 6; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  rect(0, floorY - 6, 480, 1, mb.mat('trim', 1));
  rect(0, floorY - 5, 480, 5, mb.mat('trim', 0));
  rect(0, floorY - 1, 480, 1, mb.mat('trim', -1.2));
  rect(0, floorY, 480, 270 - floorY, mb.mat('floor', 0));
  const VP = [250, 10];
  for (let xw = -700; xw < 1300; xw += 22) {
    const x2 = VP[0] + ((xw - VP[0]) * (270 - VP[1])) / (floorY - VP[1]);
    line(xw, floorY, Math.round(x2), 270, mb.shade(-1.3));
  }
  for (let k = 0; k < 46; k++) {
    const y = floorY + 3 + Math.floor(hash(k, 2) * 94);
    rect(Math.floor(hash(k, 9) * 480), y, 6 + Math.floor((y - floorY) / 7), 1, mb.shade(-1));
  }
  for (let y = floorY; y < 270; y++) for (let x = 0; x < 480; x++) if (hash(x >> 2, y, 13) < 0.07) mb.shade(0.4)(x, y);
  // window + the city (emissive)
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, win.y1 - win.y0 + 11, mb.mat('trim', 0.4));
  rect(win.x0 - 5, win.y0 - 5, win.x1 - win.x0 + 11, 1, mb.shade(1));
  rect(win.x0 - 1, win.y0 - 1, win.x1 - win.x0 + 3, win.y1 - win.y0 + 3, mb.mat('black', 0));
  for (let y = win.y0; y <= win.y1; y++)
    for (let x = win.x0; x <= win.x1; x++) {
      const t = (y - win.y0) / (win.y1 - win.y0) + (bayer(x, y) - 0.5) * 0.1;
      mb.emit(t < 0.4 ? PAL.N2 : t < 0.68 ? PAL.N3 : t < 0.9 ? PAL.N4 : PAL.N5)(x, y);
    }
  const W0 = win.x0, WH = win.y1 - win.y0;
  const far: Array<[number, number, number]> = [];
  for (let x = W0, k = 0; x < win.x1; k++) { const w = 5 + Math.floor(hash(k, 1) * 8); far.push([x, win.y0 + Math.round(WH * (x > 276 && x < 350 ? 0.62 + hash(k, 2) * 0.12 : 0.4 + hash(k, 2) * 0.28)), w]); x += w + 1 + Math.floor(hash(k, 3) * 3); }
  for (const [bx, top, w] of far) {
    rect(bx, top, Math.min(w, win.x1 - bx + 1), win.y1 - top + 1, mb.emit(PAL.N3));
    for (let j = top + 3; j < win.y1 - 1; j += 3) for (let i = bx + 1; i < Math.min(bx + w - 1, win.x1); i += 2) if (hash(i, j, bx) < 0.07) mb.emit(hash(j, i, 3) < 0.6 ? PAL.W4 : PAL.C4)(i, j);
  }
  const spx = W0 + 118, spy = win.y0 + Math.round(WH * 0.36);
  rect(spx - 4, spy, 9, win.y1 - spy, mb.emit(PAL.N3));
  poly([spx - 4, spy, spx + 5, spy, spx + 1, spy - 14], mb.emit(PAL.N3));
  line(spx, spy - 14, spx, spy - 20, mb.emit(PAL.N3));
  if (Math.floor(f / 12) % 2 === 0) mb.emit(PAL.C5)(spx, spy - 21);
  const near: Array<[number, number, number]> = [];
  for (let x = W0, k = 0; x < win.x1; k++) { const w = 9 + Math.floor(hash(k, 11) * 12); near.push([x, win.y0 + Math.round(WH * (x > 276 && x < 350 ? 0.86 + hash(k, 12) * 0.06 : 0.66 + hash(k, 12) * 0.2)), w]); x += w + Math.floor(hash(k, 13) * 4); }
  for (const [bx, top, w] of near) {
    rect(bx, top, Math.min(w, win.x1 - bx + 1), win.y1 - top + 1, mb.emit(PAL.N1));
    rect(bx, top, 1, win.y1 - top + 1, mb.emit(PAL.N2));
    for (let j = top + 2; j < win.y1 - 1; j += 2) for (let i = bx + 2; i < Math.min(bx + w - 1, win.x1); i += 2) if (hash(i, j, bx + 7) < 0.1) mb.emit(hash(j, i, 5) < 0.55 ? PAL.W5 : PAL.C4)(i, j);
  }
  if (Math.floor((f + 5) / 16) % 2 === 0) mb.emit(PAL.R3)(near[3][0] + 2, near[3][1] - 1);
  rect(364, win.y0, 2, win.y1 - win.y0 + 1, mb.mat('trim', -0.2));
  rect(win.x0, 62, win.x1 - win.x0 + 1, 2, mb.mat('trim', -0.2));
  rect(win.x0 - 8, win.y1 + 5, win.x1 - win.x0 + 17, 2, mb.mat('trim', 1));
  rect(win.x0 - 7, win.y1 + 7, win.x1 - win.x0 + 15, 2, mb.mat('trim', -0.8));
  // the framed print: a log chart with a knee
  rect(104, 70, 42, 40, mb.mat('black', 0.4));
  rect(106, 72, 38, 36, mb.mat('paper', -1.3));
  line(109, 100, 130, 98, mb.mat('red', 0.8));
  for (let x = 130; x < 141; x++) mb.mat('red', 0.8)(x, Math.round(98 - Math.pow((x - 130) / 11, 1.8) * 22));
  rect(104, 70, 42, 1, mb.shade(1));
  // server rack
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, floorY - rack.y0, mb.mat('black', 0));
  rect(rack.x0, rack.y0, rack.x1 - rack.x0, 1, mb.shade(1.4));
  rect(rack.x1 - 1, rack.y0 + 1, 1, floorY - rack.y0 - 1, mb.shade(1));
  for (let y = rack.y0 + 6; y < floorY - 6; y += 12) {
    rect(rack.x0 + 3, y, rack.x1 - rack.x0 - 6, 10, mb.mat('metal', -1.4));
    rect(rack.x0 + 3, y, rack.x1 - rack.x0 - 6, 1, mb.shade(0.8));
    for (let x = rack.x0 + 6; x < rack.x1 - 14; x += 2) mb.shade(-0.7)(x, y + 4);
  }
  // shelf: books, the red clock, a plant
  const SY = 112;
  rect(166, SY, 96, 3, mb.mat('wood', 0.5));
  rect(166, SY, 96, 1, mb.shade(1));
  const books: Array<[number, number, string, number]> = [[172, 11, 'red', 0], [175, 9, 'paper', -1.5], [178, 12, 'wall', 0.8], [181, 10, 'red', -0.5], [184, 11, 'paper', -2], [187, 8, 'wood', 0.5]];
  for (const [bx, bh, bm, bl] of books) rect(bx, SY - bh, 3, bh, mb.mat(bm, bl));
  rect(226, SY - 9, 15, 9, mb.mat('black', 0.5));
  rect(226, SY - 9, 15, 1, mb.shade(1));
  const dd = (d: string, x: number) => (DIG[d] ?? DIG['0']).forEach((r, j) => [...r].forEach((c, i) => c === '#' && mb.emit(PAL.R3)(x + i, SY - 7 + j)));
  const [hh, mm = '00'] = clock.split(':');
  dd(hh.slice(-1), 228); mb.emit(PAL.R2)(231, SY - 6); mb.emit(PAL.R2)(231, SY - 4); dd(mm[0], 233); dd(mm[1], 237);
  rect(248, SY - 5, 6, 5, mb.mat('red', -1));
  ellipse(251, SY - 7, 4, 2.5, mb.mat('plant', 0.5));
  // the desk
  rect(desk.x0, desk.back, desk.x1 - desk.x0, desk.front - desk.back + 1, mb.mat('wood', 0.8));
  rect(desk.x0, desk.front, desk.x1 - desk.x0, 1, mb.mat('wood', 1.6));
  rect(desk.x0, desk.front + 1, desk.x1 - desk.x0, desk.panel - desk.front - 1, mb.mat('wood', -1.3));
  rect(desk.x0, desk.front + 1, desk.x1 - desk.x0, 1, mb.shade(-1));
  rect(desk.x1 - 58, desk.front + 3, 50, 9, mb.mat('wood', -1.1));
  rect(desk.x1 - 58, desk.front + 13, 50, 9, mb.mat('wood', -1.1));
  for (const yy of [desk.front + 3, desk.front + 13]) {
    rect(desk.x1 - 58, yy, 50, 1, mb.shade(0.7));
    rect(desk.x1 - 38, yy + 4, 10, 1, mb.mat('metal', -0.4));
  }
  rect(desk.x0 + 10, desk.front + 4, desk.x1 - desk.x0 - 76, 1, mb.shade(-0.6));
  rect(desk.x0 + 2, desk.panel, 5, desk.legs - desk.panel, mb.mat('wood', -1));
  rect(desk.x1 - 7, desk.panel, 5, desk.legs - desk.panel, mb.mat('wood', -1));
  rect(desk.x0 + 8, desk.panel, desk.x1 - desk.x0 - 16, desk.legs - desk.panel, mb.mat('black', -1));
  for (let x = desk.x0 - 6; x < desk.x1 + 10; x++) mb.shade(-1.6)(x, desk.legs + 1);
  rect(desk.x0 - 4, desk.legs, desk.x1 - desk.x0 + 8, 2, mb.shade(-1.2));
  // pendant lamp, off
  line(252, 0, 252, 44, mb.mat('black', 0.6));
  poly([246, 44, 258, 44, 266, 58, 238, 58], mb.mat('metal', -0.8));
  rect(246, 44, 13, 1, mb.shade(0.8));
  rect(239, 57, 27, 1, mb.shade(1.6));
  rect(247, 58, 11, 1, mb.mat('paper', -1.2));
  // foreground plant, lower left
  const leaves: number[][] = [[0, 270, 8, 214, 30, 196, 26, 232, 12, 270], [10, 270, 44, 206, 70, 200, 52, 236, 26, 270], [0, 236, 0, 186, 18, 172, 20, 204], [30, 270, 62, 232, 90, 230, 66, 256, 44, 270]];
  for (const p of leaves) poly(p, mb.mat('plant', -1.5));
  rect(0, 252, 58, 18, mb.mat('black', -1));
  return mb;
};

const lights = () => {
  const {mon, win, floorY, desk} = D;
  const mcx = mon.x0 + mon.w / 2, mcy = mon.y0 + mon.h / 2;
  return {
    amb: (x: number, y: number) => {
      let a = 2.05;
      const dw = Math.hypot((x - (win.x0 + win.x1) / 2) / 110, (y - (win.y0 + win.y1) / 2) / 90);
      if (y < floorY && dw < 1) a += (1 - dw) * 1.3;
      const onDesk = x >= desk.x0 - 1 && x <= desk.x1 && y <= desk.legs + 1;
      if (!onDesk && y >= floorY + 4 && y < 262) {
        const t = (y - floorY - 4) / 90;
        const u = x - (324 - t * 70);
        const wpx = 120 + t * 30;
        if (u >= 0 && u < wpx) {
          const pane = u % (wpx / 2);
          const onSash = Math.abs(t * 90 - 30) < 2;
          if (pane > 3 && !onSash) a += 1.5 * (1 - t * 0.5);
        }
      }
      if (y > desk.legs - 20 && y < desk.legs + 6 && x > desk.x0 && x < desk.x1) a -= 0.8;
      if (y < floorY) {
        const dm = Math.hypot((x - mcx - 30) / 175, (y - mcy + 10) / 95);
        if (dm < 1) a += Math.min(1, (1 - dm) * 1.8);
      }
      return a;
    },
    cyan: (x: number, y: number) => {
      const dx = x - mcx, dy = (y - mcy) * 1.2;
      const d = Math.hypot(dx, dy);
      const reach = dx > 0 ? 150 : 90;
      let L = Math.pow(clamp(1 - d / reach, 0, 1), 1.5);
      if (y < floorY) {
        const halo = clamp(1 - Math.hypot((x - mcx - 20) / 110, (y - mcy + 6) / 46), 0, 1);
        L = L * 0.5 + Math.pow(halo, 0.9) * 0.45;
      }
      if (y >= desk.back && y <= desk.front && x > mon.x0 && x < 360) L += 0.35 * clamp(1 - Math.abs(x - 290) / 90, 0, 1);
      if (y > desk.front && y < desk.legs && x > desk.x0 && x < desk.x1) L *= 0.25;
      if (y >= desk.legs) L *= 0.35;
      return L;
    },
    warm: () => 0,
    dither: 0.6,
  };
};

// ------------------------------------------------------------------ the monitor (3/4, turned to Mas) + what it shows
export const SCREEN_W = 51, SCREEN_H = 29; // the 'virtual' face-on screen the wide samples from
/** the intro's screen: the composer over the log chart (typed state not needed here: two held lines) */
const screenPost = (scr: Buf) => {
  const sw = SCREEN_W, sh = SCREEN_H;
  for (let x = 0; x < sw; x += 2) scr.set(x, sh - 5, PAL.N2);
  const kx = 40, ky = sh - 7;
  for (let x = 0; x <= kx; x++) scr.set(x, ky + (x < 20 ? 1 : 0), PAL.C5);
  for (let k = 0; k < 9; k++) scr.set(kx + 1 + Math.floor(k / 2), ky - Math.round(Math.pow(k / 8, 1.7) * (sh - 9)) - 1, PAL.C6);
  scr.set(kx, ky, PAL.C8);
  rect(2, 2, 34, 13, scr.ink(PAL.N3)); rect(3, 3, 32, 11, scr.ink(PAL.N0));
  for (let i = 0; i < 25; i++) if (i % 5 !== 4 || i === 0) scr.set(5 + i, 5, PAL.P0);
  for (let i = 0; i < 22; i++) if (i % 6 !== 5 || i === 0) scr.set(5 + i, 8, PAL.P0);
  rect(29, 11, 5, 2, scr.ink(PAL.G5));
};
/** sc 29: his feed (a column of identical posts, each with a red heart) */
const screenFeed = (scr: Buf, f: number) => {
  const scroll = Math.floor(f / 15) % 7; // one post per beat
  for (let k = -1; k < 5; k++) {
    const y = 1 + k * 7 + (7 - scroll) % 7 - 3;
    rect(3, y, 32, 6, scr.ink(PAL.N3));
    rect(4, y + 1, 3, 3, scr.ink(PAL.G4)); // avatar
    for (let i = 0; i < 18; i++) if (i % 6 !== 5) scr.set(9 + i, y + 2, PAL.P0);
    for (let i = 0; i < 12; i++) scr.set(9 + i, y + 4, PAL.G4);
    scr.set(31, y + 3, PAL.R3); scr.set(32, y + 3, PAL.R3); scr.set(31, y + 4, PAL.R2); // the heart
  }
};
/** the board's four-tile grid, small (12 x 10), for the monitor's corner: ALYI · NELEH / MADA · THE QUIET VOTE */
export const drawBoardGridMini = (scr: Buf, x: number, y: number) => {
  rect(x, y, 13, 11, scr.ink(PAL.N0));
  const tile = (tx: number, ty: number, bg: number, face: (px: number, py: number) => void) => { rect(tx, ty, 5, 4, scr.ink(bg)); face(tx, ty); };
  tile(x + 1, y + 1, PAL.G2, (px, py) => { scr.set(px + 2, py + 1, PAL.K3); scr.set(px + 2, py + 2, PAL.K2); scr.set(px + 3, py + 1, PAL.K2); }); // ALYI: a bald head
  tile(x + 7, y + 1, PAL.G3, (px, py) => { scr.set(px + 2, py + 1, PAL.S4); scr.set(px + 1, py + 1, PAL.B2); scr.set(px + 3, py + 1, PAL.B2); scr.set(px + 4, py + 3, PAL.W7); }); // NELEH + the glowing paper
  tile(x + 1, y + 6, PAL.G2, (px, py) => { scr.set(px + 2, py + 2, PAL.S3); scr.set(px + 2, py, PAL.C6); }); // MADA + the spinner
  tile(x + 7, y + 6, PAL.N0, (px, py) => { scr.set(px + 2, py + 2, PAL.N3); }); // THE QUIET VOTE: camera off
};

const MON3Q = {x0: 224, x1: 250, yTop: 144, yBot: 178, recede: 3};
const drawWideMonitor = (b: Buf, scr: Buf) => {
  const {x0, x1, yTop, yBot, recede} = MON3Q;
  const w = x1 - x0;
  const topAt = (x: number) => yTop + Math.round(((x - x0) / w) * recede);
  const botAt = (x: number) => yBot - Math.round(((x - x0) / w) * recede);
  for (let i = 1; i <= 5; i++) {
    const x = x0 - i;
    for (let y = yTop - Math.floor(i / 2); y <= yBot - 2 - Math.floor(i / 3); y++) b.set(x, y, i === 5 ? PAL.G0 : PAL.N0);
    b.set(x, yTop - Math.floor(i / 2), PAL.G1);
  }
  line(x0 - 5, yTop - 2, x0 - 5, yBot - 3, b.ink(PAL.G1));
  const sw = scr.w, sh = scr.h;
  for (let x = x0; x <= x1; x++) {
    const t0 = topAt(x), t1 = botAt(x);
    for (let y = t0; y <= t1; y++) b.set(x, y, PAL.N1);
    b.set(x, t0, PAL.G1);
    if (x < x0 + 1 || x > x1 - 1) continue;
    const u0 = Math.floor(((x - x0 - 1) / (w - 1)) * sw), u1 = Math.max(u0 + 1, Math.floor(((x - x0) / (w - 1)) * sw));
    const s0 = t0 + 1, s1 = t1 - 3;
    for (let y = s0; y <= s1; y++) {
      const v = Math.min(sh - 1, Math.floor(((y - s0) / Math.max(1, s1 - s0)) * sh));
      let best = PAL.N1, bl = -1;
      for (let u = u0; u < Math.min(sw, u1); u++) { const c = scr.c[v * sw + u]; const l = lum(c); if (l > bl) { bl = l; best = c; } }
      b.set(x, y, best);
    }
  }
  const nx = Math.round((x0 + x1) / 2) - 2;
  rect(nx, yBot - 1, 5, 4, b.ink(PAL.G0)); rect(nx, yBot - 1, 1, 4, b.ink(PAL.C2));
  rect(nx - 7, yBot + 3, 17, 2, b.ink(PAL.G1)); rect(nx - 7, yBot + 3, 17, 1, b.ink(PAL.C3));
};

const drawWideGlass = (b: Buf) => {
  const {x, y, w, h} = D.glass;
  for (let j = 0; j < h; j++) {
    b.set(x, y + j, PAL.C5);
    b.set(x + w - 1, y + j, PAL.C2);
    if (j > 3) for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, i === 1 ? PAL.C3 : PAL.C1);
  }
  b.set(x + 1, y + 4, PAL.C7); b.set(x + 2, y + 4, PAL.C5);
  for (let i = 0; i < w; i++) b.set(x + i, y + h, PAL.C4);
  b.set(x + w, y + h, PAL.N0); b.set(x + w + 1, y + h, PAL.N0);
};

/** rack LEDs (emissive, on eighth notes) — as in the intro; `stopped` holds them all off (sc 20's beat) */
export const drawRackLeds = (b: Buf, f: number, stopped = false) => {
  const {rack} = D;
  const eighth = Math.floor((f * 2) / 15);
  for (let k = 0, y = rack.y0 + 8; y < D.floorY - 8; y += 12, k++) {
    if (stopped) continue;
    b.set(rack.x1 - 10, y + 2, PAL.C4);
    b.set(rack.x1 - 7, y + 2, k % 2 ? PAL.C3 : PAL.L2);
    if (k === 1 || k === 4 || k === 6) b.set(rack.x1 - 10, y + 6, (eighth + k) % 3 !== 0 ? PAL.R3 : PAL.R0);
  }
};

// ------------------------------------------------------------------ act 4 additions (wide)
/** The firing tally in the wide: 1px grooves on the desk top. Old = one rung down; new = two down + a lit edge. */
const drawTallyWide = (b: Buf, n: number, carve: number) => {
  const {x, y} = D.tally;
  const groove = (gx: number, len: number, fresh: boolean) => {
    for (let j = 0; j < len; j++) {
      const X = gx + (j > 1 ? 1 : 0), Y = y + j; // a slight slant, like a hand-cut stroke
      b.set(X, Y, stepColor(b.get(X, Y), fresh ? -2 : -1));
      if (fresh) b.set(X + 1, Y, stepColor(b.get(X + 1, Y), 1));
    }
  };
  if (n >= 2) { groove(x, 4, false); groove(x + 3, 4, false); }
  if (n >= 3) { const q = Math.round(clamp(carve, 0, 1) * 4) / 4; if (q > 0) groove(x + 6, Math.max(1, Math.round(4 * q)), true); }
};
/** The GUEST lanyard lying on the desk in the wide: a white card and a coiled strap (the card reads in inserts). */
const drawLanyardWide = (b: Buf) => {
  const {x, y} = D.lanyard;
  // strap: a flattened loop (a plain grey-blue strap, no brand)
  for (let i = 0; i < 16; i++) { b.set(x + i, y + (i < 3 || i > 12 ? 1 : 0), PAL.G3); }
  for (let i = 2; i < 14; i++) b.set(x + i, y + 3, PAL.G2);
  b.set(x, y + 2, PAL.G3); b.set(x + 15, y + 2, PAL.G3);
  // the card (foreshortened on the desk top) with its red band
  rect(x + 5, y + 1, 6, 3, b.ink(PAL.P1)); rect(x + 5, y + 1, 6, 1, b.ink(PAL.R2));
  b.set(x + 6, y + 3, PAL.N3); b.set(x + 8, y + 3, PAL.N3); b.set(x + 9, y + 3, PAL.N3); // 'GUEST' as a mark
};

/** TASYA's door in the dark room's back wall: slate blue, two panels, a key in the lock. Drawn in the room's light. */
const drawBlueDoor = (b: Buf, rise: number, ajar: boolean, f: number) => {
  const {x0, x1, y0} = D.blueDoor;
  const y1 = D.floorY - 1;
  const k = rise - 4; // palette steps from the shadow: -3 .. 0
  const s = (c: number) => stepColor(c, k);
  // frame
  rect(x0, y0, x1 - x0, y1 - y0 + 1, b.ink(s(PAL.N4)));
  rect(x0, y0, x1 - x0, 1, b.ink(s(PAL.N6)));
  const lx0 = x0 + 3, lx1 = x1 - 3, ly0 = y0 + 3;
  if (ajar) {
    // the leaf swung in (toward his side), a crack of slate daylight: Macrosoft's room behind it
    for (let y = ly0; y <= y1; y++) for (let x = lx0; x <= lx1; x++) b.set(x, y, x > lx1 - 4 ? (x === lx1 - 3 ? PAL.G6 : PAL.N8) : s(PAL.N5));
    rect(lx0, ly0, 1, y1 - ly0 + 1, b.ink(s(PAL.N7)));
    // light on the floor: a wedge from the crack
    for (let y = D.floorY; y < ROOM_H; y++) { const t = (y - D.floorY) / (ROOM_H - D.floorY); for (let x = lx1 - 4 + Math.round(t * 6); x < lx1 + Math.round(t * 30); x++) if (bayer(x, y) < 0.7 - t * 0.5) b.set(x, y, stepColor(b.get(x, y), 2)); }
  } else {
    for (let y = ly0; y <= y1; y++) for (let x = lx0; x <= lx1; x++) {
      const low = y > y1 - 26 && bayer(x, y) < (y - (y1 - 26)) / 40; // darker toward the floor
      b.set(x, y, s(x === lx0 ? PAL.N7 : x === lx1 ? PAL.N5 : low ? PAL.N5 : PAL.N6));
    }
    // a line of his slate daylight under the door (someone is on the other side)
    if (rise >= 3) for (let x = lx0 + 1; x < lx1; x++) { b.set(x, y1, rise === 4 ? PAL.N8 : PAL.N7); if (x % 2 === 0) b.set(x, y1 + 1, PAL.N5); }
    // two raised panels
    for (const [py0, py1] of [[ly0 + 5, ly0 + 32], [ly0 + 38, y1 - 6]]) {
      rect(lx0 + 4, py0, lx1 - lx0 - 7, 1, b.ink(s(PAL.N7)));
      rect(lx0 + 4, py1, lx1 - lx0 - 7, 1, b.ink(s(PAL.N4)));
      rect(lx0 + 4, py0, 1, py1 - py0, b.ink(s(PAL.N7)));
      rect(lx1 - 3, py0, 1, py1 - py0 + 1, b.ink(s(PAL.N4)));
    }
    // the knob and the key already in the lock (a steel key with a round bow); it jangles on his line
    const ky = ly0 + 40;
    b.set(lx1 - 4, ky - 4, s(PAL.G5)); b.set(lx1 - 3, ky - 4, s(PAL.G6)); b.set(lx1 - 4, ky - 3, s(PAL.G4));
    const jig = Math.floor(f / 4) % 2;
    b.set(lx1 - 4, ky, s(PAL.N1));
    rect(lx1 - 3, ky, 3, 1, b.ink(s(PAL.G5)));
    b.set(lx1, ky - 1 + jig, s(PAL.G6)); b.set(lx1 + 1, ky + jig, s(PAL.G5)); b.set(lx1, ky + 1 + jig, s(PAL.G4)); b.set(lx1 - 1, ky + jig, s(PAL.G5));
  }
  // its sill shadow
  rect(x0 - 1, y1 + 1, x1 - x0 + 2, 1, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ the room (wide)
const roomCache: {key: string; buf: Buf} = {key: '', buf: new Buf(480, 270, 0)};
/**
 * The dark room WIDE (the intro's cold-open camera) at frame f, into rows 0..202 of `b` (the rail band below is not
 * ours; the intro drew the full 270 — pass `fullFrame` to draw all 270 rows as the intro did).
 * Characters are not drawn: put Mas at DARKROOM.mas (cast/mas drawMasDesk) and the Orb at DARKROOM.orb.
 * Draw order for the scene: drawDarkRoom -> Mas -> the Orb -> drawDarkRoomFront (glass + monitor + tally stay in
 * front of his forearms exactly as in the intro).
 */
export const drawDarkRoom = (b: Buf, f: number, o: DarkRoomOpts = {}): RoomOut => {
  const full = !!o.fullFrame;
  const clock = o.clock ?? '1:36';
  // the room only changes with the city's slow windows and the spire light: cache per (frame bucket, clock)
  const key = `${Math.floor(f / 12) % 2}|${Math.floor((f + 5) / 16) % 2}|${clock}`;
  if (roomCache.key !== key) {
    const rb = new Buf(480, 270, PAL.N0);
    resolve(paintRoom(f, clock), lights(), rb, 0);
    roomCache.key = key;
    roomCache.buf = rb;
  }
  const rows = full ? 270 : ROOM_H;
  for (let y = 0; y < rows; y++) b.c.set(roomCache.buf.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  drawRackLeds(b, f);
  if (o.blueDoor) drawBlueDoor(b, o.blueDoor, !!o.blueDoorAjar, f);
  const out = newRoomOut(['desk', 'window', 'blueDoor']);
  out.masks.desk.addRect(D.desk.x0, D.desk.back, D.desk.x1 - D.desk.x0, D.desk.legs - D.desk.back);
  out.masks.window.addRect(D.win.x0, D.win.y0, D.win.x1 - D.win.x0 + 1, D.win.y1 - D.win.y0 + 1);
  if (o.blueDoor) out.masks.blueDoor.addRect(D.blueDoor.x0, D.blueDoor.y0, D.blueDoor.x1 - D.blueDoor.x0, D.floorY - D.blueDoor.y0);
  out.anchors = {
    mas: D.mas, orb: D.orb, glass: [D.glass.x, D.glass.y], tally: [D.tally.x, D.tally.y], lanyard: [D.lanyard.x, D.lanyard.y],
    blueDoorKey: [D.blueDoor.x1 - 3, D.blueDoor.y0 + 43], blueDoorFoot: [Math.round((D.blueDoor.x0 + D.blueDoor.x1) / 2), D.floorY],
    // the rack's drive slot: where deliveries slide out (sc 18's box, sc 29's check)
    rackSlot: [D.rack.x0 + 4, D.rack.y0 + 30], monitor: [MON3Q.x0, MON3Q.yTop],
  };
  return out;
};

/** In front of Mas (after his desk sprite): the glass, the monitor, the tally, the lanyard, the vignette. */
export const drawDarkRoomFront = (b: Buf, f: number, o: DarkRoomOpts = {}) => {
  if (o.glass !== false) drawWideGlass(b);
  const scr = new Buf(SCREEN_W, SCREEN_H, PAL.N1);
  const sc = o.screen ?? 'post';
  if (sc === 'post') screenPost(scr); else if (sc === 'feed') screenFeed(scr, f); else sc(scr, f);
  if (o.boardGrid) drawBoardGridMini(scr, SCREEN_W - 14, 1);
  drawWideMonitor(b, scr);
  if (o.tally) drawTallyWide(b, o.tally, o.carve ?? 1);
  if (o.lanyard) drawLanyardWide(b);
  if (o.vignette !== false) vignette(b, 1, 0.62, 0.66, 270, o.fullFrame ? 270 : ROOM_H);
};

// ------------------------------------------------------------------ THE DESK, CLOSE (sc 26A)
export interface DarkDeskOpts {
  tally?: 2 | 3;
  /** the 3rd mark's progress 0..1 (held in quarters: the clip bites in 4 strokes) */
  carve?: number;
  glass?: boolean;
  phone?: 'down' | 'none';
  lanyard?: boolean;
}
/** The close: where things sit (the scene puts Mas's hand + the pen at `carveTip`, the Orb above `orb`). */
export const DARKDESK = {
  edgeY: 34, // the desk's far edge; the dark room above
  marks: {x: 262, y: 84, len: 40, gap: 16},
  glass: {x: 60, y: 62, w: 36, h: 84},
  phone: {x: 356, y: 130, w: 64, h: 34},
  lanyard: {x: 150, y: 150},
};
const deskCache = new Map<string, Buf>();
export const drawDarkDesk = (b: Buf, f: number, o: DarkDeskOpts = {}): RoomOut => {
  const tally = o.tally ?? 3;
  const q = Math.round(clamp(o.carve ?? 1, 0, 1) * 4) / 4;
  const key = JSON.stringify({tally, q, g: o.glass, p: o.phone, l: o.lanyard});
  let rb = deskCache.get(key);
  if (!rb) {
    rb = new Buf(ROOM_W, ROOM_H, PAL.N0);
    const mb = new MatBuf(ROOM_W, ROOM_H);
    const {edgeY, marks} = DARKDESK;
    // beyond the far edge: the dark room (the window's cold blue low on the right, the rack's LEDs far left)
    rect(0, 0, ROOM_W, edgeY, mb.mat('wall', -0.6));
    for (let y = 0; y < edgeY; y++) for (let x = 300; x < ROOM_W; x++) if (bayer(x, y) < (x - 300) / 400) mb.emit(y < 18 ? PAL.N2 : PAL.N3)(x, y);
    // the desk top: long, straight-ish horizontal grain (flat-sawn), two knots, the varnish holding the monitor's
    // reflection. The F1.2 dither settles into THESE lines, so they stay long and horizontal.
    const knots: Array<[number, number, number]> = [[132, 150, 14], [410, 74, 10]];
    const grainV = (x: number, y: number) => {
      let v = y + 1.4 * Math.sin(x / 83 + y / 41) + 0.7 * Math.sin(x / 23 + y / 9);
      for (const [kx, ky, kr] of knots) { const d = Math.hypot((x - kx) / (kr * 2.6), (y - ky) / kr); if (d < 1.8) v += (1.8 - d) * 5.5 * Math.sign(y - ky || 1); }
      return v;
    };
    for (let y = edgeY; y < ROOM_H; y++)
      for (let x = 0; x < ROOM_W; x++) {
        const v = grainV(x, y);
        const band = Math.floor(v / 5);
        const inB = v - band * 5;
        let lvl = (hash(band, 3, 11) - 0.5) * 0.6 + 0.4;
        if (inB < 1 && hash(band, 5, 13) < 0.6) lvl -= 0.9; // late-wood lines
        mb.mat('wood', lvl)(x, y);
      }
    for (const [kx, ky, kr] of knots) { ellipse(kx, ky, kr * 0.55, kr * 0.25, mb.shade(-1.3)); ellipse(kx, ky, kr * 0.3, kr * 0.12, mb.shade(-0.6)); }
    // the far edge: the lip (catches the screen), the edge's thickness; the monitor's foot at the top-left
    rect(0, edgeY, ROOM_W, 1, mb.shade(1.8));
    rect(0, edgeY - 3, ROOM_W, 3, mb.mat('wood', -1.8));
    poly([6, edgeY + 16, 84, edgeY + 16, 74, edgeY + 4, 16, edgeY + 4], mb.mat('black', 0.4));
    rect(40, edgeY - 10, 10, 15, mb.mat('black', 0.2));
    rect(16, edgeY + 4, 58, 1, mb.shade(1.4));
    // the marks: carved grooves 2px wide. The right wall of each catches the light (it comes from the top-left),
    // the left wall and the floor of the cut are dark. The old two are worn: softer, broken, shorter.
    const mk = (mx: number, len: number, fresh: boolean) => {
      for (let j = 0; j < len; j++) {
        if (!fresh && (j === 9 || j === 26)) continue; // worn gaps
        const X = mx + Math.floor(j / 16); // the stroke leans a hair
        mb.shade(fresh ? -3 : -1.5)(X, marks.y + j);
        mb.shade(fresh ? -2.4 : -1.2)(X + 1, marks.y + j);
        mb.shade(fresh ? 2 : 0.7)(X + 2, marks.y + j);
      }
      if (fresh) { mb.shade(-1)(mx, marks.y - 1); mb.shade(1.2)(mx + 1, marks.y - 1); }
    };
    mk(marks.x, marks.len - 4, false);
    mk(marks.x + marks.gap, marks.len - 1, false);
    if (tally >= 3 && q > 0) mk(marks.x + marks.gap * 2, Math.round(marks.len * q), true);
    resolve(mb, {
      amb: (x, y) => 1.9 + (y < edgeY ? 0.4 : 0) - Math.max(0, (y - 150) / 90),
      cyan: (x, y) => {
        // the monitor's light rakes across the desk from beyond the top-left edge; its reflection in the varnish
        const d = Math.hypot((x + 30) / 540, (y - 10) / 230);
        let v = y < edgeY ? 0 : clamp(1.02 - d, 0, 1) * 0.92;
        return v;
      },
      warm: () => 0, dither: 0.4,
    }, rb, 0);
    // the monitor's reflection in the varnish: a dithered rung up, streaked along the grain (top-left)
    for (let y = edgeY + 16; y < edgeY + 60; y++) for (let x = 18; x < 170; x++) {
      const t = Math.hypot((x - 90) / 80, (y - edgeY - 36) / 22);
      if (t < 1 && bayer(x, y) < (1 - t) * 0.7 && (y % 3 !== 0)) rb.set(x, y, stepColor(rb.get(x, y), 1));
    }
    // the rack's LEDs far off in the dark, top-left; nothing else of the room
    for (const [lx, ly, c] of [[22, 10, PAL.C4], [22, 16, PAL.R3], [27, 13, PAL.L2]] as Array<[number, number, number]>) rb.set(lx, ly, c);
    // wood curls + crumbs by the fresh mark (only while carving / just carved)
    if (tally >= 3 && q > 0) {
      const cx = marks.x + marks.gap * 2 + 3, cy = marks.y + Math.round(marks.len * q);
      for (const [dx, dy, c] of [[2, 0, PAL.C4], [3, -1, PAL.C5], [4, 0, PAL.C4], [3, 1, PAL.D1], [6, 2, PAL.C3], [-3, 3, PAL.C3], [1, 4, PAL.C4]] as Array<[number, number, number]>) rb.set(cx + dx, cy + dy, c);
    }
    // the glass (close): a heavy tumbler seen from a little above; the wood refracts through it one rung up;
    // the water line is ONE flat row: it never ripples
    if (o.glass !== false) {
      const {x, y, w, h} = DARKDESK.glass;
      const cx = x + w / 2, rx = w / 2, ry = 5;
      const src = rb.clone();
      for (let j = -ry; j <= h + ry; j++) for (let i = 0; i <= w; i++) {
        const X = x + i, Y = y + j;
        const u = (X + 0.5 - cx) / rx;
        if (Math.abs(u) > 1) continue;
        const e = ry * Math.sqrt(1 - u * u);
        const top = y - e, bot = y + h + e;
        if (Y < top || Y > bot) continue;
        const water = Y > y + 26 - e * 0.2;
        // refraction: the wood behind, shifted and squeezed toward the middle
        const sx = Math.round(cx + u * rx * 0.72), sy = Y + (water ? 3 : 0);
        let c = stepColor(src.get(sx, sy), water ? 1 : 0);
        if (Math.abs(u) > 0.9) c = u < 0 ? PAL.C6 : PAL.C3; // the walls of the glass, lit on the monitor side
        else if (u > -0.78 && u < -0.64) c = PAL.C7; // the long highlight
        else if (u > 0.52 && u < 0.6 && water) c = PAL.C5;
        rb.set(X, Y, c);
      }
      // rim ellipse, the water surface (flat), the heavy base
      for (let i = 0; i <= w; i++) {
        const u = (x + i + 0.5 - cx) / rx; if (Math.abs(u) > 1) continue;
        const e = Math.round(ry * Math.sqrt(1 - u * u));
        rb.set(x + i, y - e, PAL.C7); rb.set(x + i, y + e, PAL.C4);
        rb.set(x + i, y + 26, PAL.C8); // THE water line: one flat row
        rb.set(x + i, y + 27, PAL.C5);
        rb.set(x + i, y + h + e, PAL.C5); rb.set(x + i, y + h + e - 3, PAL.C3);
        rb.set(x + i, y + h + e + 1, stepColor(src.get(x + i, y + h + e + 1), -2)); rb.set(x + i + 3, y + h + e + 2, stepColor(src.get(x + i + 3, y + h + e + 2), -2));
      }
    }
    // the phone, face up, screen dark (he picks it up to post)
    if (o.phone !== 'none') {
      const {x, y, w, h} = DARKDESK.phone;
      rect(x + 2, y + h, w, 2, (px, py) => rb!.set(px, py, stepColor(rb!.get(px, py), -2)));
      rect(x, y, w, h, rb.ink(PAL.G1));
      rect(x + 3, y + 2, w - 6, h - 4, rb.ink(PAL.N0));
      rect(x, y, w, 1, rb.ink(PAL.C3)); rect(x, y, 1, h, rb.ink(PAL.C2));
      for (let k = 0; k < 6; k++) rb.set(x + 6 + k * 2, y + 6 + k, PAL.N2); // the glass's reflection streak
    }
    if (o.lanyard) {
      const {x, y} = DARKDESK.lanyard;
      rect(x, y, 26, 36, rb.ink(PAL.P1)); rect(x, y, 26, 7, rb.ink(PAL.R2)); rect(x + 10, y - 2, 6, 3, rb.ink(PAL.G4));
      tiny(rb, 'GUEST', x + 4, y + 17, PAL.N1);
      for (let k = 0; k < 60; k++) rb.set(x + 13 + Math.round(Math.sin(k / 9) * 18), y - 2 - k, PAL.G3);
    }
    vignette(rb, 1, 0.62, 0.66, ROOM_H);
    deskCache.set(key, rb);
  }
  for (let y = 0; y < ROOM_H; y++) b.c.set(rb.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  void f;
  const out = newRoomOut(['desk']);
  out.masks.desk.addRect(0, DARKDESK.edgeY, ROOM_W, ROOM_H - DARKDESK.edgeY);
  const {marks} = DARKDESK;
  out.anchors = {
    // the pen's clip tip while carving mark 3 (held in quarters of the stroke)
    carveTip: [marks.x + marks.gap * 2 + 1, marks.y + Math.round(marks.len * q)],
    mark1: [marks.x, marks.y], mark2: [marks.x + marks.gap, marks.y], mark3: [marks.x + marks.gap * 2, marks.y],
    glass: [DARKDESK.glass.x, DARKDESK.glass.y], phone: [DARKDESK.phone.x, DARKDESK.phone.y], orb: [420, 16],
  };
  return out;
};
void Mask;
