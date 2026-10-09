// MR. MAS — Ep2 v1 art: SET-01, THE NOPEAI LOBBY MASTER (sc 1, 13, 19, 20). The script's master is a side-on [W] (Mas
// at the back in the left third, facing screen-right; the beanbags in the right half facing the wall screen; reception
// with the DAYS SINCE sign on the back wall; the glass doors far right; his eyeline to the doors is the axis). Ep1's
// lobby (shared/pixel/rooms/lobby.ts) looks at the cathedral's narthex from the other end, so this is a NEW angle on the
// same room, painted with Ep1's own lobby materials (lb.stone, lb.rack, lb.brass, lb.floor, lb.velvet: imported, so the
// two angles share their palette walk) and its motifs: rack pillars with LED columns, the GPU-die rose window, LED
// votives, the cyan neon NOPE AI on the reception front, the DAYS SINCE sign (Ep1's board, and a second, smaller one).
//
//   drawLobby2(b, st, cast)   the master. st: {f, time: 'day' | 'morning', sign1 '86' | '100' | '202', sign2 null | '0'
//                             | '102', screen: (b, r) => void (the wall screen's picture: AROS, the keynote, the stream's
//                             crowd; null = off), flyers 'feb' | 'curl' | 'peeled' (Mas's upside-down one: `upside`),
//                             complaint: null | 'truck' | 'floor' | 'table' | 'rope' | 'rect', truckX, cups, confetti,
//                             tusk, tv: 'off' | 'presser' | 'stuck' (the corner TV), door 0..2 (the doors' swing: the
//                             sidewalk's PAUSE sign shows at 1..2), beanbags, ladder (DOT's), shake [dx, dy] (the room
//                             layer only)}. cast.back (behind the desk), cast.floor (on the floor, before the beanbags'
//                             front row), cast.front (nearest)
//   LOBBY2                    the geometry (feet lines, Mas's counter, the sign, the screen, the doors, the axis)
//   drawFlyer / drawComplaint / drawHandTruck / drawSignBoard  the props, at room scale (any size via o.scale for flyers)
//   complaintPageECU / docketECU / signFromBelow / flyerECU   the inserts (sc 1.10, 20.08, 1.12, 1.13)
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {MatBuf, Lights, resolve} from '../../../../../shared/pixel/light';
import {bigText, bigTextWidth, text} from '../../../../../shared/pixel/font';
import {LOBBY} from '../../../../../shared/pixel/rooms/lobby';
import {fill, dith, pt, pw, bpt, bpw, tiny, tinyWidth, sp, TR, RH, Rect} from '../kit';
import {seatedStaff, beanbag} from '../cast/civic2';
import {blitImg} from '../../../../../shared/pixel/figure';
void LOBBY; // imported for its materials (lb.*), registered when lobby.ts loads

export const LOBBY2 = {
  CEIL_Y: 14, WALL_Y: 146,
  FEET: {back: 150, mid: 170, near: 196},
  COUNTER: {x0: 8, x1: 46, top: 116},
  SIGN: {x0: 46, y0: 20, x1: 152, y1: 74},
  SIGN2: {x0: 62, y0: 80, x1: 140, y1: 105},
  PILLARS: [[158, 174], [318, 336]] as Array<[number, number]>,
  ROSE: {cx: 246, cy: 34, r: 16},
  DESK: {x0: 184, x1: 308, top: 122, front: 128, base: 160},
  ELEV: [[208, 238], [254, 284]] as Array<[number, number]>,
  SCREEN: {x0: 344, y0: 24, x1: 446, y1: 124},
  TV: {x0: 184, y0: 20, x1: 220, y1: 42},
  DOORS: {x0: 452, x1: 480, y0: 22, y1: 150},
  /** the axis: Mas at his counter (back left) to the doors (far right), along the floor */
  AXIS: {masX: 28, masY: 152, doorX: 456, doorY: 160},
};
const L2 = LOBBY2;

export interface Lobby2State {
  f: number;
  time?: 'day' | 'morning';
  sign1?: string;
  sign2?: string | null;
  screen?: ((b: Buf, r: Rect) => void) | null;
  flyers?: 'feb' | 'curl' | 'peeled';
  upside?: boolean;
  complaint?: null | 'truck' | 'floor' | 'table' | 'rope' | 'rect';
  truckX?: number;
  cups?: boolean;
  ropeY?: number;
  confetti?: 'none' | 'burst' | 'pile';
  tusk?: boolean;
  tv?: 'off' | 'presser' | 'stuck';
  door?: 0 | 1 | 2;
  beanbags?: boolean;
  ladder?: boolean;
  shake?: [number, number];
  forNow?: boolean;
}

// ------------------------------------------------------------------ the far room (MatBuf, lit by Ep1's materials)
const paintFar = (mb: MatBuf, s: Lobby2State) => {
  const f = s.f;
  // vault and walls
  rect(0, 0, 480, L2.CEIL_Y, mb.mat('lb.stoneDk', -0.5));
  for (let x = 0; x < 480; x += 14) line(x, 0, 246 + (x - 246) * 0.8, L2.CEIL_Y - 2, mb.shade(-0.6));
  for (const [xa, xb] of [[-30, 158], [174, 318], [336, 500]] as Array<[number, number]>) {
    const w = xb - xa, r = w * 0.8;
    for (let x = xa; x <= xb; x++) { const dl = x - xa, dr = xb - x; const y = Math.round(L2.CEIL_Y + 2 - Math.max(Math.sqrt(Math.max(0, r * r - (r - dl) ** 2)), Math.sqrt(Math.max(0, r * r - (r - dr) ** 2))) * (12 / r)); mb.mat('lb.stone', 1.2)(x, y); mb.mat('lb.stoneDk', -1)(x, y + 1); }
  }
  rect(0, L2.CEIL_Y, 480, L2.WALL_Y - L2.CEIL_Y, mb.mat('lb.stone', 0));
  for (let y = L2.CEIL_Y + 8; y < L2.WALL_Y; y += 12) { rect(0, y, 480, 1, mb.shade(-0.9)); const off = ((y / 12) | 0) % 2 ? 0 : 14; for (let x = off; x < 480; x += 28) rect(x, y - 11, 1, 11, mb.shade(-0.6)); }
  rect(0, 58, 480, 2, mb.mat('lb.stone', 1.4)); rect(0, 60, 480, 1, mb.mat('lb.stoneDk', -1));
  rect(0, L2.WALL_Y - 7, 480, 7, mb.mat('lb.stoneDk', 0.2)); rect(0, L2.WALL_Y - 8, 480, 1, mb.mat('lb.stone', 1.2));
  // the rose window (a GPU die in leaded jewel tones, by day)
  {
    const {cx, cy, r} = L2.ROSE;
    ellipse(cx, cy, r + 4, r + 4, mb.mat('lb.stone', 1.2)); ellipse(cx, cy, r + 2, r + 2, mb.mat('lb.stoneDk', -0.4));
    const jewel = [PAL.C6, PAL.C5, PAL.W6, PAL.R2, PAL.L2, PAL.N7, PAL.C7, PAL.U3];
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
      if (d > r) continue;
      if ((x - cx + 64) % 6 === 0 || (y - cy + 64) % 5 === 0 || Math.abs(d - r) < 0.9) { mb.mat('lb.stoneDk', -0.8)(x, y); continue; }
      const core = Math.abs(dx) < 5 && Math.abs(dy) < 4;
      mb.emit(jewel[core ? 6 : Math.floor(hash(Math.floor((x - cx + 64) / 6), Math.floor((y - cy + 64) / 5), 9) * 7)])(x, y);
    }
  }
  // the chancel arch over the elevators behind the desk
  for (let x = 196; x <= 296; x++) { const u = Math.abs(x - 246) / 50; const y = Math.round(66 - 10 * Math.sqrt(Math.max(0, 1 - u * u * 0.7)) + u * 4); mb.mat('lb.stone', 1.6)(x, y); mb.mat('lb.stoneDk', -0.6)(x, y + 1); }
  rect(196, 66, 2, L2.WALL_Y - 66, mb.mat('lb.stone', 1.2)); rect(294, 66, 2, L2.WALL_Y - 66, mb.mat('lb.stone', 0.2));
  for (const [ex0, ex1] of L2.ELEV) {
    const y0 = 72, y1 = L2.WALL_Y;
    rect(ex0 - 3, y0 - 3, ex1 - ex0 + 7, 3, mb.mat('lb.steel', 1.2)); rect(ex0 - 3, y0, 3, y1 - y0, mb.mat('lb.steel', 1)); rect(ex1 + 1, y0, 3, y1 - y0, mb.mat('lb.steel', 0.2));
    for (let x = ex0; x <= ex1; x++) for (let y = y0; y < y1; y++) mb.mat('lb.steel', (x % 5 === 0 ? -0.5 : 0.3) + (y < y0 + 2 ? 1.2 : 0))(x, y);
    const mid = (ex0 + ex1) >> 1; rect(mid, y0, 1, y1 - y0, mb.mat('lb.steel', -1.2)); rect(mid + 1, y0, 1, y1 - y0, mb.mat('lb.steel', 1.6));
  }
  // rack pillars (LED columns), stone capitals and bases
  for (const [px0, px1] of L2.PILLARS) {
    rect(px0, L2.CEIL_Y, px1 - px0, L2.WALL_Y - L2.CEIL_Y + 6, mb.mat('lb.rack', 0.4));
    rect(px0, L2.CEIL_Y, 1, L2.WALL_Y - L2.CEIL_Y + 6, mb.shade(1.6)); rect(px1 - 1, L2.CEIL_Y, 1, L2.WALL_Y - L2.CEIL_Y + 6, mb.shade(-1));
    rect(px0 - 3, L2.CEIL_Y, px1 - px0 + 6, 6, mb.mat('lb.stone', 1)); rect(px0 - 3, L2.WALL_Y - 2, px1 - px0 + 6, 8, mb.mat('lb.stone', 0.6));
    for (let y = L2.CEIL_Y + 10; y < L2.WALL_Y - 4; y += 5) {
      rect(px0 + 2, y, px1 - px0 - 4, 1, mb.shade(-1));
      for (let k = 0; k < 3; k++) { const lx = px0 + 4 + k * 5; const on = hash(lx, y, Math.floor((f + lx * 7 + y * 3) / (5 + ((lx + y) % 6)))); mb.emit(on < 0.4 ? PAL.C6 : on < 0.5 ? PAL.L3 : on < 0.56 ? PAL.W6 : PAL.N2)(lx, y + 2); }
    }
  }
  // the corner TV, high on the left bay (its picture is drawn after resolve)
  {
    const T = L2.TV;
    rect(T.x0 - 2, T.y0 - 2, T.x1 - T.x0 + 5, T.y1 - T.y0 + 5, mb.mat('black', 0.2)); rect(T.x0 - 2, T.y0 - 2, T.x1 - T.x0 + 5, 1, mb.shade(1.4));
    rect(T.x0, T.y0, T.x1 - T.x0 + 1, T.y1 - T.y0 + 1, mb.emit(PAL.N1));
    rect((T.x0 + T.x1) >> 1, T.y1 + 3, 1, 1, mb.emit(s.tv && s.tv !== 'off' ? PAL.L3 : PAL.R1));
  }
  // the wall screen's bezel (its picture is drawn after resolve)
  {
    const S = L2.SCREEN;
    rect(S.x0 - 5, S.y0 - 5, S.x1 - S.x0 + 11, S.y1 - S.y0 + 11, mb.mat('black', 0.6));
    rect(S.x0 - 5, S.y0 - 5, S.x1 - S.x0 + 11, 1, mb.shade(1.6)); rect(S.x0 - 5, S.y0 - 5, 1, S.y1 - S.y0 + 11, mb.shade(1.2));
    rect(S.x0, S.y0, S.x1 - S.x0 + 1, S.y1 - S.y0 + 1, mb.emit(PAL.N0));
    rect(((S.x0 + S.x1) >> 1) - 6, S.y1 + 5, 12, 2, mb.mat('metal', 0.4));
  }
  // the glass doors far right: a bronze frame, the street beyond (emissive), the push bar
  {
    const D = L2.DOORS;
    for (let y = D.y0; y < D.y1; y++) for (let x = D.x0; x < D.x1; x++) {
      const b = bayer(x, y);
      const c = y < 70 ? (b < 0.4 ? PAL.P1 : PAL.G6) : y < 118 ? (hash(Math.floor(x / 6), Math.floor(y / 8), 3) < 0.5 ? PAL.G4 : PAL.P0) : y < 128 ? PAL.G5 : PAL.P0;
      mb.emit(c)(x, y);
    }
    rect(D.x0, D.y0, 3, D.y1 - D.y0, mb.mat('lb.brass', 0.6)); rect(D.x0, D.y0, 28, 3, mb.mat('lb.brass', 0.6)); rect(D.x0 + 14, D.y0, 2, D.y1 - D.y0, mb.mat('lb.brass', 0.2));
    rect(D.x0 + 4, 96, 9, 2, mb.mat('lb.steel', 1.4));
  }
  // Mas's high counter at the back left (stone top on a steel post), and the DAYS SINCE sign over it
  {
    const C = L2.COUNTER;
    // a real reception counter (Ep1's lobby has one): the stone top with its lip, a solid front panel down to the floor
    // in the lobby's steel, a recessed kick plate, a thin lit seam under the top
    rect(C.x0, C.top + 4, C.x1 - C.x0, L2.WALL_Y + 4 - C.top - 4, mb.mat('lb.steel', 0.5));
    rect(C.x0, C.top + 4, 2, L2.WALL_Y - C.top, mb.mat('lb.steel', 1.1)); rect(C.x1 - 2, C.top + 4, 2, L2.WALL_Y - C.top, mb.mat('lb.steel', -0.2));
    rect(C.x0 + 2, C.top + 5, C.x1 - C.x0 - 4, 1, mb.emit(PAL.C5));
    rect(C.x0 + 4, C.top + 12, C.x1 - C.x0 - 8, 1, mb.shade(-0.8)); rect(C.x0 + 4, C.top + 22, C.x1 - C.x0 - 8, 1, mb.shade(-0.8));
    rect(C.x0 + 2, L2.WALL_Y, C.x1 - C.x0 - 4, 4, mb.mat('lb.steel', -0.6));
    rect(C.x0 - 2, C.top, C.x1 - C.x0 + 4, 4, mb.mat('lb.stone', 1.6)); rect(C.x0 - 2, C.top, C.x1 - C.x0 + 4, 1, mb.shade(1.4));
  }
  // the floor: polished stone tiles, checkered, receding to the back wall; a long runner on the axis
  rect(0, L2.WALL_Y, 480, RH - L2.WALL_Y, mb.mat('lb.floor', 0.4));
  const VPY = -140;
  for (let xw = -480; xw <= 960; xw += 30) { const x1 = 240 + ((xw - 240) * (RH - VPY)) / (L2.WALL_Y - VPY); line(xw, L2.WALL_Y, Math.round(x1), RH, mb.shade(-0.9)); }
  for (let k = 0, y = L2.WALL_Y + 4; y < RH; k++, y += 6 + k * 3) rect(0, y, 480, 1, mb.shade(-0.9));
  // the runner: a deep red carpet from the doors back toward the counter (the axis the complaint rolls down)
  poly([20, 154, 480, 158, 480, 172, 20, 162], mb.mat('lb.velvet', -1.6));
  poly([24, 156, 480, 160, 480, 170, 24, 161], mb.mat('lb.velvet', -1.0));
};
const lights = (s: Lobby2State): Lights => {
  const morning = s.time === 'morning';
  return {
    amb: (x, y) => {
      let a = morning ? 3.2 : 3.6;
      if (y >= L2.WALL_Y) a -= 0.3;
      const d = Math.hypot((x - 470) / 260, (y - 110) / 150); if (d < 1) a += (1 - d) * 1.7;
      const vx = (x - 240) / 240, vy = (y - 101) / 112; a -= Math.max(0, vx * vx + vy * vy - 0.6) * 1.6;
      return a;
    },
    cyan: (x, y) => {
      let L = 0;
      if (y > L2.DESK.base - 2) { const d = Math.hypot((x - 246) / 90, (y - 176) / 16); if (d < 1) L = Math.max(L, (1 - d) * 0.75); }
      for (const [p0, p1] of L2.PILLARS) { const d = Math.abs(x - (p0 + p1) / 2) / 28; if (d < 1 && y > L2.CEIL_Y) L = Math.max(L, (1 - d) * 0.25); }
      if (s.screen) { const d = Math.hypot((x - 395) / 120, (y - 90) / 110); if (d < 1) L = Math.max(L, (1 - d) * 0.55); }
      return L;
    },
    warm: (x, y) => {
      // daylight through the doors at right: a wedge across the floor toward the back, and up the right wall
      let L = 0;
      if (y >= L2.WALL_Y) { const t = (y - L2.WALL_Y) / 57; const u = 452 - x; if (u > 0 && u < 140 + t * 90) L = Math.max(L, (1 - u / (140 + t * 90)) * (morning ? 0.7 : 0.9)); }
      const d = Math.hypot((x - 452) / 60, (y - 90) / 80); if (d < 1) L = Math.max(L, (1 - d) * 0.7);
      return L;
    },
    dither: 0.55,
  };
};
const deskLayer = (mb: MatBuf, s: Lobby2State) => {
  const D = L2.DESK, f = s.f;
  rect(D.x0 - 3, D.top, D.x1 - D.x0 + 7, D.front - D.top, mb.mat('lb.stone', 1.4)); rect(D.x0 - 3, D.top, D.x1 - D.x0 + 7, 1, mb.shade(1.4));
  rect(D.x0, D.front, D.x1 - D.x0 + 1, D.base - D.front, mb.mat('lb.desk', 0.4)); rect(D.x0, D.front, 1, D.base - D.front, mb.shade(1.2)); rect(D.x1, D.front, 1, D.base - D.front, mb.shade(-1));
  for (let x = D.x0 + 6; x < D.x1 - 4; x += 8) rect(x, D.front + 3, 1, D.base - D.front - 6, mb.shade(-0.7));
  rect(D.x0, D.base - 4, D.x1 - D.x0 + 1, 4, mb.mat('lb.stone', -0.2));
  const word = 'NOPE AI', ww = bigTextWidth(word), wx = ((D.x0 + D.x1) >> 1) - Math.round(ww / 2), wy = D.front + 9;
  const glyph = new Set<number>();
  const sink = new Buf(1, 1, 0); sink.set = (px: number, py: number) => { glyph.add(py * 480 + px); };
  bigText(sink, word, wx, wy, 0);
  for (const k of glyph) { const x = k % 480, y = (k / 480) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!glyph.has((y + dy) * 480 + x + dx)) mb.emit(PAL.C3)(x + dx, y + dy); }
  for (const k of glyph) { const x = k % 480, y = (k / 480) | 0; mb.emit(glyph.has(k - 480) && glyph.has(k + 480) ? PAL.C8 : PAL.C6)(x, y); }
  for (let x = D.x0 + 4; x < D.x1 - 2; x += 7) { const fl = Math.floor((f + x * 3) / 4) % 8; rect(x, D.top - 2, 2, 2, mb.mat('lb.stone', 2)); mb.emit(fl === 0 ? PAL.C9 : fl < 3 ? PAL.C7 : PAL.C6)(x, D.top - 3); }
};

// ------------------------------------------------------------------ props
/** the DAYS SINCE board: Ep1's sign (cream face, green rule, four lines, a number plate on hooks), any size of number */
export const drawSignBoard = (b: Buf, x0: number, y0: number, x1: number, y1: number, lines: string[], days: string, o: {lit?: boolean; small?: boolean} = {}) => {
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  // the number plate is as wide as its number (three digits by June)
  const tw = o.small ? pw(days) : bigTextWidth(days);
  const pw0 = Math.max(o.small ? 20 : 26, tw + (o.small ? 10 : 12));
  fill(b, x0 + 2, y0 + 2, w, h, PAL.N0); fill(b, x0, y0, w, h, PAL.G3); fill(b, x0, y0, w, 1, PAL.G5);
  const fx1 = x1 - pw0;
  fill(b, x0 + 2, y0 + 2, fx1 - x0 - 2, h - 4, PAL.P1); fill(b, x0 + 2, y0 + 2, fx1 - x0 - 2, 2, PAL.L2);
  lines.forEach((l, i) => (o.small ? tiny(b, l, x0 + 4, y0 + 5 + i * 6, PAL.N1) : pt(b, l, x0 + 4, y0 + 6 + i * 10, PAL.N1)));
  const nx = x1 - pw0 + 3, ny = y0 + (o.small ? 3 : 12), nw = pw0 - 5, nh = o.small ? h - 6 : 28;
  fill(b, nx, ny, nw, nh, PAL.N0); fill(b, nx + 2, ny + 2, nw - 4, nh - 4, PAL.P2);
  fill(b, nx + 1, ny - 2, 2, 3, PAL.G5); fill(b, nx + nw - 3, ny - 2, 2, 3, PAL.G5);
  if (o.small) pt(b, days, nx + Math.round((nw - tw) / 2), ny + Math.round((nh - 7) / 2), PAL.R2);
  else bigText(b, days, nx + Math.round((nw - tw) / 2), ny + 7, PAL.R2);
};
/** the WHERE IS ALYI? flyer (room scale 12 x 16; o.scale 2/4 for inserts): a doorway photo, the headline, tape at the
 *  corners; `curl` lifts its lower corners (February's, by May), `upside` = Mas's, taped back upside down */
export const drawFlyer = (b: Buf, x: number, y: number, o: {curl?: boolean; upside?: boolean; scale?: number; tape?: boolean; folded?: boolean} = {}) => {
  const s = o.scale ?? 1, W = 12 * s, H = 16 * s;
  const t = new Buf(W, H, TR);
  fill(t, 0, 0, W, H, PAL.P2); fill(t, W - s, 0, s, H, PAL.P1); fill(t, 0, H - s, W, s, PAL.P1);
  // the headline: at room scale a dark bar; at 2x+ the words
  if (s >= 2) { const hl = 'WHERE IS'; const hl2 = 'ALYI?'; if (s >= 4) { pt(t, hl, Math.round((W - pw(hl)) / 2), 3 * s, PAL.N1); pt(t, hl2, Math.round((W - pw(hl2)) / 2), 3 * s + 9, PAL.N1); } else { tiny(t, 'WHERE IS', 1, 2, PAL.N1); tiny(t, 'ALYI?', 5, 8, PAL.N1); } }
  else { for (let i = 2; i < W - 2; i++) { if (i % 3 !== 1) t.set(i, 2, PAL.N1); if (i % 4 !== 2 && i < W - 3) t.set(i, 4, PAL.N2); } }
  // the photo: a doorway (a dark frame, the light through a half-open door), nobody in it
  const py = s >= 2 ? (s >= 4 ? 26 * s / 4 + 16 : 15) : 6, ph = H - py - 2 * s, px = 2 * s, pwid = W - 4 * s;
  fill(t, px, py, pwid, ph, PAL.G2);
  const dx = px + Math.round(pwid * 0.3), dw = Math.max(2, Math.round(pwid * 0.42));
  fill(t, dx, py + Math.round(ph * 0.1), dw, ph - Math.round(ph * 0.1), PAL.N1);
  fill(t, dx + Math.round(dw * 0.5), py + Math.round(ph * 0.1) + s, Math.max(1, Math.round(dw * 0.4)), ph - Math.round(ph * 0.1) - s, s === 1 ? PAL.W3 : PAL.W6);
  if (o.tape !== false) for (const [tx, ty] of [[0, 0], [W - 2 * s, 0], [0, H - 2 * s], [W - 2 * s, H - 2 * s]]) fill(t, tx, ty, 2 * s, 2 * s, s === 1 ? PAL.P1 : PAL.G6);
  if (o.curl) { for (let i = 0; i < 3 * s; i++) for (let j = 0; j <= i; j++) { t.set(W - 1 - j, H - 3 * s + i, TR); t.set(j, H - 3 * s + i, TR); } for (let i = 0; i < 3 * s; i++) { t.set(W - 1 - i, H - 1 - 3 * s + i, PAL.P0); } }
  // its shadow on the surface it's taped to (paper, not a light: it casts, it doesn't glow), then the sheet (upside
  // down = rotated 180°)
  if (s === 1) for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = o.upside ? t.c[(H - 1 - j) * W + (W - 1 - i)] : t.c[j * W + i]; if (v !== TR) b.set(x + i + 1, y + j + 1, stepColor(b.get(x + i + 1, y + j + 1), -2)); }
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = o.upside ? t.c[(H - 1 - j) * W + (W - 1 - i)] : t.c[j * W + i]; if (v !== TR) b.set(x + i, y + j, v); }
};
/** the hand truck (room scale): two wheels, a nose plate, the long handles */
export const drawHandTruck = (b: Buf, x: number, y: number) => {
  line(x + 30, y - 2, x + 30, y - 60, b.ink(PAL.G4)); line(x + 31, y - 2, x + 31, y - 60, b.ink(PAL.G2));
  line(x + 26, y - 60, x + 34, y - 64, b.ink(PAL.G5));
  fill(b, x - 2, y - 3, 34, 3, PAL.G4); fill(b, x - 2, y - 3, 34, 1, PAL.G6);
  for (const wx of [x + 22, x + 30]) { ellipse(wx, y + 1, 4, 4, b.ink(PAL.N0)); ellipse(wx, y + 1, 2, 2, b.ink(PAL.G3)); }
};
/** the complaint: a document as tall as a person (room scale 30 x 56) or lying flat (`floor`, 56 x 14): its cover
 *  caption NOLE v. MANALT ET AL. over YOU PROMISED!!!, the docket tab; `cups` = coffee cups on it (a side table) */
export const drawComplaint = (b: Buf, x: number, y: number, o: {state: 'upright' | 'floor'; cups?: boolean; docket?: boolean; refiled?: boolean; forNow?: boolean} = {state: 'upright'}) => {
  if (o.state === 'upright') {
    // pages edge-on at its right side, the cover facing us
    // (the cover is as wide as its longest word plus a margin: PROMISED and FEDERAL fit inside it)
    const CW = Math.max(tinyWidth('PROMISED'), tinyWidth('FEDERAL')) + 8;
    fill(b, x + CW, y - 54, 4, 54, PAL.P1); for (let j = 0; j < 54; j += 2) b.set(x + CW + 1 + (j % 3), y - 54 + j, PAL.P0);
    fill(b, x, y - 56, CW, 56, PAL.P2); fill(b, x, y - 56, CW, 1, PAL.W9); fill(b, x + CW - 1, y - 56, 1, 56, PAL.P0);
    fill(b, x + 3, y - 52, CW - 6, 1, PAL.N2);
    tiny(b, 'NOLE V.', x + 4, y - 49, PAL.N1); tiny(b, 'MANALT', x + 4, y - 43, PAL.N1); tiny(b, 'ET AL.', x + 4, y - 37, PAL.N1);
    fill(b, x + 3, y - 30, CW - 6, 1, PAL.N2);
    tiny(b, o.refiled ? 'FEDERAL' : 'YOU', x + 4, y - 26, PAL.R2); tiny(b, o.refiled ? 'COURT' : 'PROMISED', x + 4, y - 20, PAL.R2);
    if (!o.refiled) tiny(b, '!!!', x + 4, y - 14, PAL.R2);
    if (o.docket) { fill(b, x + CW, y - 46, 8, 6, PAL.W7); fill(b, x + CW, y - 46, 8, 1, PAL.W8); }
    return;
  }
  // lying flat: its top face (the cover) seen at a low angle, a thick stack of pages under it
  // (the slab is as long as its caption plus room for the cups at its far end; the cups never sit on the words)
  const L = tinyWidth('NOLE V. MANALT') + 34;
  poly([x, y - 12, x + L, y - 12, x + L + 6, y - 4, x + 6, y - 4], b.ink(PAL.P2));
  line(x, y - 12, x + L, y - 12, b.ink(PAL.W9));
  fill(b, x + 6, y - 4, L, 6, PAL.P1); for (let i = 0; i < L; i += 2) b.set(x + 6 + i, y - 1 - (i % 3 ? 1 : 0), PAL.P0);
  tiny(b, 'NOLE V. MANALT', x + 6, y - 10, PAL.N2);
  if (o.docket) { fill(b, x + L + 6, y - 8, 7, 5, PAL.W7); fill(b, x + L + 6, y - 8, 7, 1, PAL.W8); }
  if (o.cups) for (const cx of [x + L - 22, x + L - 12]) { fill(b, cx, y - 16, 5, 7, PAL.P2); fill(b, cx, y - 14, 5, 2, PAL.C4); fill(b, cx + 4, y - 15, 1, 5, PAL.P0); fill(b, cx + 1, y - 17, 3, 1, PAL.D3); }
  if (o.forNow) { fill(b, x + 20, y - 18, 16, 10, PAL.W7); fill(b, x + 20, y - 18, 16, 1, PAL.W8); tiny(b, '(FOR', x + 21, y - 16, PAL.N2); }
};
/** the clean rectangle the complaint leaves on the carpet (sc 20), and the (FOR NOW) note on it */
export const drawCleanRect = (b: Buf, x: number, y: number, note = true) => {
  const L = tinyWidth('NOLE V. MANALT') + 34;
  for (let j = 0; j < 6; j++) for (let i = 0; i < L; i++) { const X = x + 6 + i - Math.round(j * 0.9), Y = y - 4 - j; b.set(X, Y, stepColor(b.get(X, Y), 1)); }
  if (note) { fill(b, x + 22, y - 9, 13, 8, PAL.W7); fill(b, x + 22, y - 9, 13, 1, PAL.W8); }
};
/** confetti: 'burst' (paper bits in the air) or 'pile' (swept into a heap at x, y) */
export const drawConfetti = (b: Buf, x: number, y: number, kind: 'burst' | 'pile', f = 0) => {
  const C = [PAL.W7, PAL.C6, PAL.R3, PAL.L3, PAL.P2, PAL.U4];
  if (kind === 'pile') { for (let j = 0; j < 7; j++) for (let i = -14 + j * 2; i <= 14 - j * 2; i++) if (hash(i, j, 7) < 0.85) b.set(x + i, y - j, C[Math.floor(hash(i, j, 8) * 6)]); return; }
  for (let k = 0; k < 60; k++) { const ang = hash(k, 1, 3) * Math.PI * 2, r = 6 + hash(k, 2, 3) * 40 + f * 0.6; b.set(x + Math.round(Math.cos(ang) * r), y + Math.round(Math.sin(ang) * r * 0.6) + Math.floor(f * f * 0.02), C[k % 6]); }
};
/** the tip of a mammoth's tusk behind the back row of beanbags (sc 19's egg) */
const drawTusk = (b: Buf, x: number, y: number) => { for (let i = 0; i < 14; i++) { const yy = y - Math.round(Math.sin((i / 14) * 1.6) * 7); b.set(x + i, yy, PAL.P2); b.set(x + i, yy + 1, PAL.P1); b.set(x + i, yy + 2, PAL.P0); } };

// ------------------------------------------------------------------ the master
const cache = new Map<string, Buf>();
export const drawLobby2 = (b: Buf, st: Lobby2State, cast: {back?: (b: Buf) => void; floor?: (b: Buf) => void; front?: (b: Buf) => void} = {}) => {
  const s: Lobby2State = {time: 'day', sign1: '86', sign2: null, flyers: 'feb', complaint: null, confetti: 'none', tv: 'off', door: 0, beanbags: true, ...st};
  const key = JSON.stringify({t: s.time, f: Math.floor(s.f / 4) % 32, scr: !!s.screen});
  let room = cache.get(key);
  if (!room) {
    const mb = new MatBuf(480, RH), front = new MatBuf(480, RH);
    paintFar(mb, s); deskLayer(front, s);
    room = new Buf(480, RH, PAL.N0);
    const Lt = lights(s);
    resolve(mb, Lt, room, 0);
    const fr = new Buf(480, RH, TR); resolve(front, Lt, fr, 0);
    for (let i = 0; i < fr.c.length; i++) if (fr.c[i] !== TR) room.c[i] = fr.c[i];
    cache.set(key, room); if (cache.size > 40) cache.delete(cache.keys().next().value as string);
  }
  const [dx, dy] = s.shake ?? [0, 0];
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const sx = x - dx, sy = y - dy; b.set(x, y, room.c[clamp(sy, 0, RH - 1) * 480 + clamp(sx, 0, 479)]); }
  const D = (fn: () => void) => fn();
  // the wall screen's picture (the leap layer for AROS, the keynote, the stream)
  if (s.screen) s.screen(b, {x: L2.SCREEN.x0 + dx, y: L2.SCREEN.y0 + dy, w: L2.SCREEN.x1 - L2.SCREEN.x0 + 1, h: L2.SCREEN.y1 - L2.SCREEN.y0 + 1});
  // the corner TV's picture (small; the full-frame push-in is presserFull)
  if (s.tv && s.tv !== 'off') drawPresserSmall(b, L2.TV.x0 + dx, L2.TV.y0 + dy, L2.TV.x1 - L2.TV.x0 + 1, L2.TV.y1 - L2.TV.y0 + 1, s.tv === 'stuck');
  // the door glass: the sidewalk outside during the swing, the PAUSE sign leaning on the planter
  if (s.door) D(() => { const x0 = L2.DOORS.x0 + 4 + dx; fill(b, x0 + 2, 110 + dy, 18, 12, PAL.L1); fill(b, x0 + 2, 108 + dy, 18, 2, PAL.L2); const sw = tinyWidth('PAUSE') + 4; fill(b, x0 + 11 - (sw >> 1), 92 + dy, sw, 14, PAL.P2); fill(b, x0 + 11 - (sw >> 1), 92 + dy, sw, 1, PAL.N2); tiny(b, 'PAUSE', x0 + 13 - (sw >> 1), 96 + dy, PAL.R2); line(x0 + 10, 106 + dy, x0 + 10, 112 + dy, b.ink(PAL.D2)); if (s.door === 2) fill(b, L2.DOORS.x0 + 1 + dx, 22 + dy, 2, 128, PAL.W8); });
  // the signs
  drawSignBoard(b, L2.SIGN.x0 + dx, L2.SIGN.y0 + dy, L2.SIGN.x1 + dx, L2.SIGN.y1 + dy, ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'], s.sign1 ?? '86');
  if (s.sign2 !== null && s.sign2 !== undefined) drawSignBoard(b, L2.SIGN2.x0 + dx, L2.SIGN2.y0 + dy, L2.SIGN2.x1 + dx, L2.SIGN2.y1 + dy, ['DAYS SINCE', 'SOMEONE', 'SUED MAS:'], s.sign2, {small: true});
  // the flyers on the rack pillars
  if (s.flyers !== 'peeled' || true) {
    const spots: Array<[number, number, boolean]> = [[160, 104, false], [160, 84, false], [321, 64, false], [321, 98, false]];
    spots.forEach(([fx, fy], i) => {
      const mine = i === 1 && s.upside;
      if (mine && s.flyers === 'peeled') return;
      drawFlyer(b, fx + dx, fy + dy, {curl: s.flyers !== 'feb', upside: mine});
    });
  }
  cast.back?.(b);
  // DOT's ladder at the sign (an aluminium A-frame)
  if (s.ladder) { const lx = 122 + dx; for (const [x0, x1] of [[lx, lx + 8], [lx + 20, lx + 12]]) line(x0, 150 + dy, x1, 96 + dy, b.ink(PAL.G5)); for (let r = 0; r < 6; r++) { const yy = 142 - r * 9 + dy; fill(b, lx + 2 + Math.round(r * 1.2), yy, 16 - Math.round(r * 2.4), 1, PAL.G4); } fill(b, lx + 7, 94 + dy, 8, 3, PAL.G6); }
  // the complaint
  const tx = s.truckX ?? 300;
  if (s.complaint === 'truck') { drawHandTruck(b, tx, L2.FEET.mid); drawComplaint(b, tx, L2.FEET.mid - 3, {state: 'upright'}); }
  if (s.complaint === 'floor') drawComplaint(b, 40, 176, {state: 'floor', docket: true});
  if (s.complaint === 'table') drawComplaint(b, 150, 178, {state: 'floor', cups: s.cups !== false, docket: true});
  if (s.complaint === 'rope') { const ry = s.ropeY ?? 0; line(176, 0, 176, 168 - ry, b.ink(PAL.D3)); drawComplaint(b, 150, 178 - ry, {state: 'floor', docket: true}); }
  if (s.complaint === 'rect') drawCleanRect(b, 150, 178, s.forNow !== false);
  if (s.confetti === 'pile') drawConfetti(b, 408, 194, 'pile');
  cast.floor?.(b);
  // the beanbag rows (right half), staff facing the wall screen (screen-right)
  if (s.beanbags) {
    if (s.tusk) drawTusk(b, 250, 172);
    const rows: Array<[number, number]> = [[176, 0], [190, 1]];
    for (const [ry, r] of rows) for (let k = 0; k < 5; k++) {
      const x = 226 + k * 40 + r * 18, seed = r * 11 + k * 3 + 1;
      beanbag(b, x, ry - 4, seed);
      blitImg(b, seatedStaff({seed, pose: (s.f + seed * 13) % 97 < 50 ? 'watch' : 'type'}), x + 2, ry - 28);
    }
  }
  if (s.confetti === 'burst') drawConfetti(b, 330, 120, 'burst', s.f % 24);
  cast.front?.(b);
};

// ------------------------------------------------------------------ the corner TV (REMUHCS's roadmap presser)
/** the presser at TV scale (on the corner TV): the lectern stuck at the FLOOR door, a tally on it when `stuck` */
export const drawPresserSmall = (b: Buf, x: number, y: number, w: number, h: number, stuck: boolean) => {
  fill(b, x, y, w, h, PAL.N4); fill(b, x, y + h - 6, w, 6, PAL.N0); fill(b, x + 1, y + h - 5, w - 2, 1, PAL.C4);
  fill(b, x + w - 11, y + 3, 9, h - 10, PAL.D2); fill(b, x + w - 10, y + 4, 7, 2, PAL.P2); // the FLOOR door
  fill(b, x + w - 22, y + 8, 12, h - 15, PAL.P2); fill(b, x + w - 22, y + 8, 12, 2, PAL.W7); // the lectern, jammed
  for (let k = 0; k < 4; k++) fill(b, x + 4 + k * 5, y + 6, 3, 8, [PAL.G2, PAL.F3, PAL.N1, PAL.G3][k]);
  // the tally on its card above the jammed lectern, the whole word (it reads at 4x: 3 x 5 type, 12 x 20 px)
  if (stuck) { const tw = tinyWidth('0 BILLS') + 2; fill(b, x + 1, y + 1, tw, 7, PAL.N0); tiny(b, '0 BILLS', x + 2, y + 2, PAL.R3); }
};
export {drawTusk};
void text; void bpt; void bpw; void dith; void tinyWidth; void sp;
