// MR. MAS — shared room: NOPEAI LOBBY — DAY / NIGHT, plus the SECURITY-CAMERA view. (rooms A · Ep1 sc 9-10, 27, 30)
// NopeAI HQ is "THE CATHEDRAL" (world/locations.md, the intro skyline): a neo-gothic data-centre cathedral. So the
// lobby is its narthex: server-rack pillars with LEDs for columns, a GPU-die rose window, LED votives on the desk,
// the cyan neon wordmark NOPE AI on the reception front, brass elevator doors, a revolving door in a glass wall.
// Right of the desk hangs the wall sign: blank in the check scene (sc 9), lit in sc 30 as
//   DAYS SINCE / SOMEONE TRIED / TO FIRE MAS: [0]
// with a spare box of 0 plates on the floor under it. (Its count is carved in the dark-room desk too.)
//
// Light: DAY = the entrance glass (sun, tungsten-cream ramp) + the rose window's jewel pools on the floor + neon;
//        NIGHT = neon + votives + the lit sign + street light through the glass; the rose glows server-cyan.
// Staging layers (draw order):
//   far  -> [anyone INSIDE the revolving drum; anyone behind the desk (out of the elevator)]
//   door -> (the drum's front glass + front wings)
//   front-> (the reception desk)  -> [anyone in the lobby, in front of the desk]
//   fore -> (the velvet-rope stanchions at the frame edges; off by default)
import {Buf, rect, line, poly, ellipse, bayer, clamp, hash} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {MatBuf, Lights, defineMat, resolve} from '../light';
import {TRANSPARENT} from '../px';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {micro, microWidth} from '../cast/bosses';
import {overlay, RH} from './setkit';

// ------------------------------------------------------------------ materials
// ramps: [night/ambient, cyan (neon, LEDs, server glow), warm (sun by day, tungsten by night)]
defineMat('lb.stone', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N1', 'G1', 'G2', 'X2', 'P0', 'P1', 'P2', 'W9']);
defineMat('lb.stoneDk', ['N0', 'N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'G1', 'X1', 'X2', 'P0', 'P1', 'P2']);
defineMat('lb.floor', ['N0', 'N1', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3', 'C5'], ['N0', 'N1', 'G1', 'X1', 'X2', 'P0', 'P1', 'P2']);
defineMat('lb.brass', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['D0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']);
defineMat('lb.rack', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N0', 'N1', 'G1', 'G2', 'G3', 'G4', 'G5']);
defineMat('lb.desk', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5'], ['N0', 'N1', 'G1', 'G2', 'G3', 'G4', 'P0', 'P1']);
defineMat('lb.sign', ['N1', 'N2', 'N3', 'G2', 'G3', 'P0', 'P1', 'P2'], ['N1', 'N2', 'C1', 'C2', 'C4', 'C6', 'C8', 'C9'], ['N1', 'G1', 'X2', 'P0', 'P1', 'P2', 'P2', 'W9']);
defineMat('lb.box', ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W5', 'W6']);
defineMat('lb.steel', ['N0', 'N1', 'N2', 'N3', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['N0', 'G1', 'G2', 'G3', 'G4', 'P0', 'P1', 'P2']);
defineMat('lb.velvet', ['N0', 'R0', 'R0', 'R1', 'R1', 'R2', 'R2', 'R3'], ['N0', 'R0', 'R0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'R0', 'R1', 'R1', 'R2', 'R2', 'R3', 'W6']);

// ------------------------------------------------------------------ geometry (exported for staging)
export const LOBBY = {
  W: 480, H: 203,
  CEIL_Y: 14,
  /** the back wall meets the floor */
  WALL_FLOOR_Y: 158,
  /** feet line for someone standing at the desk (front side) / crossing the lobby mid-depth / near camera */
  FEET: {desk: 178, mid: 188, near: 200},
  ENTRANCE: {x0: 0, x1: 106, y0: 18, y1: 158},
  /** the revolving drum: centre x, radius, top (canopy underside) and floor; someone inside it stands on `floor` */
  REVOLVE: {cx: 54, r: 26, top: 70, floor: 166},
  PILLARS: [[106, 126], [354, 374]] as Array<[number, number]>,
  ROSE: {cx: 240, cy: 34, r: 18},
  /** twin elevators behind the desk; people step out between far and front (their feet on WALL_FLOOR_Y) */
  ELEVATORS: [[196, 232], [248, 284]] as Array<[number, number]>,
  ELEV_Y: [70, 158] as [number, number],
  DESK: {x0: 164, x1: 316, top: 124, front: 130, base: 168},
  NEON: {cx: 240, y: 141},
  SIGN: {x0: 380, y0: 62, x1: 476, y1: 116},
  /** the spare box of 0 plates, under the sign (sc 30) */
  BOX: {x: 428, y: 162},
  TV: {x0: 392, y0: 20, x1: 462, y1: 54},
};

export interface LobbyState {
  f: number;
  time: 'day' | 'night';
  /** the wall sign: 0 blank board (no letters: the check scene) · 1 letters, unlit · 2 half-lit · 3 lit */
  sign?: 0 | 1 | 2 | 3;
  /** the number plate */
  days?: string;
  /** the box of spare 0 plates under the sign */
  zeroBox?: boolean;
  /** revolving door: which of 4 held wing drawings (the pattern repeats every quarter turn) */
  revolve?: number;
  /** elevator doors: 0 shut .. 3 open (held steps); per elevator */
  elevator?: [number, number];
  /** lobby TV: off, or on (a blank glow the scene paints over; see LOBBY.TV) */
  tv?: 'off' | 'on';
  /** the velvet-rope stanchions in the foreground (fore layer) */
  ropes?: boolean;
}
export const LOBBY_DEFAULT: LobbyState = {f: 0, time: 'day', sign: 0, days: '0', zeroBox: false, revolve: 0, elevator: [0, 0], tv: 'off', ropes: false};

const microMat = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const sink = new Buf(1, 1, 0);
  const plot = mb.mat(mat, lvl);
  sink.set = (px: number, py: number) => plot(px, py);
  micro(sink, s, x, y, 0);
};
const textMat = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const sink = new Buf(1, 1, 0);
  const plot = mb.mat(mat, lvl);
  sink.set = (px: number, py: number) => plot(px, py);
  text(sink, s, x, y, 0);
};
const textEmit = (mb: MatBuf, s: string, x: number, y: number, col: number, big = false) => {
  const sink = new Buf(1, 1, 0);
  sink.set = (px: number, py: number, c: number) => mb.emit(c)(px, py);
  if (big) bigText(sink, s, x, y, col); else text(sink, s, x, y, col);
};

// ------------------------------------------------------------------ outside (through the glass), emissive
const paintOutside = (mb: MatBuf, s: LobbyState, x0: number, x1: number, y0: number, y1: number) => {
  const day = s.time === 'day', f = s.f;
  const street = 132; // the kerb line outside
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const b = bayer(x, y);
      let c: number;
      if (y < 92) c = day ? (y < 44 ? PAL.G6 : b < (y - 44) / 48 ? PAL.P1 : PAL.G6) : (y < 60 ? PAL.N1 : b < (y - 60) / 32 ? PAL.N2 : PAL.N1);
      else if (y < street) c = day ? PAL.G4 : PAL.N2; // the building across the street (filled below)
      else if (y < street + 6) c = day ? PAL.G5 : PAL.N3; // sidewalk across
      else if (y < 150) c = day ? (b < 0.5 ? PAL.G3 : PAL.G2) : PAL.N1; // street
      else c = day ? PAL.P0 : PAL.N2; // our sidewalk
      mb.emit(c)(x, y);
    }
  // the building across the street: a stone facade with windows, and a café awning (a generic city block)
  for (let bx = x0 - 10; bx <= x1; bx += 38) {
    const top = 46 + Math.floor(hash(bx, 1, 4) * 22);
    const bl = Math.max(x0, bx), bw = Math.min(bx + 36, x1 + 1) - bl;
    if (bw <= 0) continue;
    rect(bl, top, bw, street - top, mb.emit(day ? (hash(bx, 2, 4) < 0.5 ? PAL.P0 : PAL.G4) : PAL.N2));
    rect(bl, top, bw, 2, mb.emit(day ? PAL.P1 : PAL.N3));
    for (let wy = top + 7; wy < street - 12; wy += 10)
      for (let wx = bx + 4; wx < bx + 34; wx += 8) {
        if (wx < x0 || wx + 4 > x1) continue;
        const lit = !day && hash(wx, wy, 5 + Math.floor(f / 90)) < 0.4;
        rect(wx, wy, 4, 6, mb.emit(day ? PAL.G3 : lit ? (hash(wx, wy, 6) < 0.5 ? PAL.W5 : PAL.W4) : PAL.N1));
        if (day) rect(wx, wy, 4, 1, mb.emit(PAL.G2));
      }
  }
  // street furniture: a lamppost; at night its pool on the far sidewalk
  const lx = x0 + 70;
  if (lx < x1) {
    rect(lx, 100, 1, street + 4 - 100, mb.emit(day ? PAL.G2 : PAL.N3));
    rect(lx - 3, 98, 7, 2, mb.emit(day ? PAL.G2 : PAL.W7));
    if (!day) for (let x = lx - 10; x <= lx + 10; x++) if (x >= x0 && x <= x1) mb.emit(bayer(x, street + 2) < 0.6 ? PAL.W4 : PAL.N3)(x, street + 2);
  }
  // traffic: a car crossing now and then (held on 2s)
  const cx = x0 + (((Math.floor(f / 2) * 5) % 260) - 80);
  if (cx > x0 - 30 && cx < x1 + 4) {
    const cy = 141;
    for (let x = cx; x < cx + 26; x++) for (let y = cy; y < cy + 6; y++) if (x >= x0 && x <= x1) mb.emit(y === cy ? (day ? PAL.G6 : PAL.N4) : day ? PAL.R2 : PAL.N3)(x, y);
    for (let x = cx + 6; x < cx + 18; x++) if (x >= x0 && x <= x1) mb.emit(day ? PAL.G3 : PAL.N1)(x, cy - 2), mb.emit(day ? PAL.G3 : PAL.N1)(x, cy - 1);
    if (!day) { if (cx + 25 <= x1 && cx + 25 >= x0) mb.emit(PAL.W8)(cx + 25, cy + 2); if (cx >= x0) mb.emit(PAL.R3)(cx, cy + 2); }
  }
};

// ------------------------------------------------------------------ FAR: vault, walls, windows, doors, sign, TV
const paintFar = (mb: MatBuf, s: LobbyState) => {
  const f = s.f, day = s.time === 'day';
  const L = LOBBY;
  // ---- the vault: dark ribs springing from the pillars, meeting in pointed arches ----
  rect(0, 0, 480, L.CEIL_Y, mb.mat('lb.stoneDk', -0.5));
  const arch = (xa: number, xb: number, depth: number, lvl: number) => {
    const w = xb - xa, r = w * 0.8;
    for (let x = xa; x <= xb; x++) {
      const dl = x - xa, dr = xb - x;
      const yl = L.CEIL_Y + 2 - Math.sqrt(Math.max(0, r * r - (r - dl) ** 2)) * (depth / r);
      const yr = L.CEIL_Y + 2 - Math.sqrt(Math.max(0, r * r - (r - dr) ** 2)) * (depth / r);
      const y = Math.round(Math.max(yl, yr));
      mb.mat('lb.stone', lvl)(x, y);
      mb.mat('lb.stoneDk', -1)(x, y + 1);
    }
  };
  arch(-40, 116, 12, 1.2); arch(116, 364, 14, 1.2); arch(364, 520, 12, 1.2);
  for (let x = 0; x < 480; x += 12) line(x, 0, 240 + (x - 240) * 0.7, L.CEIL_Y - 2, mb.shade(-0.6));
  // two votive chandeliers (rings of LED candles) hanging in the side bays
  for (const cx of [60, 420]) {
    rect(cx, 0, 1, 8, mb.mat('metal', -0.4));
    ellipse(cx, 10, 12, 2.2, mb.mat('lb.brass', 0.2));
    for (let k = -10; k <= 10; k += 4) mb.emit(Math.floor((f + k * 3) / 5) % 7 === 0 ? PAL.C9 : PAL.C7)(cx + k, 8);
  }
  // ---- walls (limestone), blocks coursed, a string course at picture height ----
  rect(0, L.CEIL_Y, 480, L.WALL_FLOOR_Y - L.CEIL_Y, mb.mat('lb.stone', 0));
  for (let y = L.CEIL_Y + 8; y < L.WALL_FLOOR_Y; y += 12) {
    rect(0, y, 480, 1, mb.shade(-0.9));
    const off = ((y / 12) | 0) % 2 ? 0 : 14;
    for (let x = off; x < 480; x += 28) rect(x, y - 11, 1, 11, mb.shade(-0.6));
  }
  rect(0, 58, 480, 2, mb.mat('lb.stone', 1.4));
  rect(0, 60, 480, 1, mb.mat('lb.stoneDk', -1));
  rect(0, L.WALL_FLOOR_Y - 8, 480, 1, mb.mat('lb.stone', 1.2));
  rect(0, L.WALL_FLOOR_Y - 7, 480, 7, mb.mat('lb.stoneDk', 0.2));
  // a blind arcade: a pointed-arch niche in each side bay of the chancel (the votive stands stand in them)
  for (const [nx0, nx1] of [[130, 164], [316, 350]] as Array<[number, number]>) {
    const cx = (nx0 + nx1) / 2, hw = (nx1 - nx0) / 2, spring = 96, apex = 72;
    for (let y = apex; y < L.WALL_FLOOR_Y - 8; y++)
      for (let x = nx0; x <= nx1; x++) {
        let inside = y >= spring;
        if (!inside) { const t = (spring - y) / (spring - apex); inside = Math.abs(x + 0.5 - cx) <= hw * Math.sqrt(1 - t * t) * (1 - t * 0.35); }
        if (inside) mb.mat('lb.stoneDk', y < spring + 4 ? -0.2 : 0.3)(x, y);
      }
    // lit left jamb / arch edge, shadowed right
    rect(nx0 - 1, spring, 1, L.WALL_FLOOR_Y - 8 - spring, mb.mat('lb.stone', 1.4));
    rect(nx1 + 1, spring, 1, L.WALL_FLOOR_Y - 8 - spring, mb.mat('lb.stone', -0.6));
    for (let y = apex; y < spring; y++) {
      const t = (spring - y) / (spring - apex);
      const dx = Math.round(hw * Math.sqrt(1 - t * t) * (1 - t * 0.35));
      mb.mat('lb.stone', 1.4)(Math.round(cx - dx) - 1, y);
      mb.mat('lb.stone', -0.4)(Math.round(cx + dx) + 1, y);
    }
    mb.mat('lb.stone', 2)(Math.round(cx), apex - 1);
  }

  // ---- the entrance: a glass wall in bronze mullions, the revolving drum in it ----
  const E = L.ENTRANCE;
  paintOutside(mb, s, E.x0, E.x1 - 2, E.y0 + 4, E.y1);
  // glass sheen bands (the outside is emissive; the glass lifts it one step in bands)
  for (let y = E.y0 + 4; y <= E.y1; y++) for (let x = E.x0; x < E.x1 - 2; x++) {
    const u = (x + (y - E.y0) * 0.6) % 70;
    if (u > 30 && u < 36) { const i = mb.idx(x, y); if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], day ? 1 : 1); }
  }
  for (const mx of [0, 26, 82, 104]) { rect(mx, E.y0, 3, E.y1 - E.y0, mb.mat('lb.steel', -0.8)); rect(mx, E.y0, 1, E.y1 - E.y0, mb.shade(1.2)); }
  for (const my of [E.y0, 50]) { rect(E.x0, my, E.x1 - E.x0, 3, mb.mat('lb.steel', -0.8)); rect(E.x0, my, E.x1 - E.x0, 1, mb.shade(1.2)); }
  paintRevolveBack(mb, s);

  // ---- rack pillars (columns of server racks with gothic capitals) ----
  for (const [px0, px1] of L.PILLARS) {
    rect(px0, L.CEIL_Y, px1 - px0, L.WALL_FLOOR_Y - L.CEIL_Y + 6, mb.mat('lb.rack', 0.4));
    rect(px0, L.CEIL_Y, 1, L.WALL_FLOOR_Y - L.CEIL_Y + 6, mb.shade(1.6));
    rect(px1 - 1, L.CEIL_Y, 1, L.WALL_FLOOR_Y - L.CEIL_Y + 6, mb.shade(-1));
    // capital + base in stone
    rect(px0 - 3, L.CEIL_Y, px1 - px0 + 6, 6, mb.mat('lb.stone', 1));
    rect(px0 - 2, L.CEIL_Y + 6, px1 - px0 + 4, 2, mb.mat('lb.stone', -0.4));
    rect(px0 - 3, L.WALL_FLOOR_Y - 2, px1 - px0 + 6, 8, mb.mat('lb.stone', 0.6));
    rect(px0 - 3, L.WALL_FLOOR_Y - 2, px1 - px0 + 6, 1, mb.shade(1.2));
    // rack units: horizontal seams and blinking LEDs, three columns
    for (let y = L.CEIL_Y + 10; y < L.WALL_FLOOR_Y - 4; y += 5) {
      rect(px0 + 2, y, px1 - px0 - 4, 1, mb.shade(-1));
      for (let k = 0; k < 3; k++) {
        const lx = px0 + 4 + k * 5;
        const on = hash(lx, y, Math.floor((f + lx * 7 + y * 3) / (5 + ((lx + y) % 6))));
        mb.emit(on < 0.4 ? PAL.C6 : on < 0.5 ? PAL.L3 : on < 0.56 ? PAL.W6 : PAL.N2)(lx, y + 2);
      }
    }
  }

  // ---- the GPU-die rose window ----
  paintRose(mb, s);
  // ---- the elevators (brass), an arrow lamp over each ----
  L.ELEVATORS.forEach(([ex0, ex1], i) => paintElevator(mb, ex0, ex1, (s.elevator ?? [0, 0])[i], f, i, day));
  // a pointed-arch surround framing the pair (the chancel)
  for (let x = 186; x <= 294; x++) {
    const u = Math.abs(x - 240) / 54;
    const y = Math.round(66 - 10 * Math.sqrt(Math.max(0, 1 - u * u * 0.7)) + u * 4);
    mb.mat('lb.stone', 1.6)(x, y);
    mb.mat('lb.stoneDk', -0.6)(x, y + 1);
  }
  rect(186, 66, 2, L.WALL_FLOOR_Y - 66, mb.mat('lb.stone', 1.2));
  rect(292, 66, 2, L.WALL_FLOOR_Y - 66, mb.mat('lb.stone', 0.2));
  // LED votive stands (tiered) flanking the chancel
  for (const vx of [146, 334]) {
    for (let t = 0; t < 4; t++) {
      const ty = 136 + t * 6, hw = 5 + t * 3;
      rect(vx - hw, ty, hw * 2 + 1, 2, mb.mat('lb.brass', -0.2));
      for (let k = -hw + 1; k <= hw - 1; k += 2) {
        const fl = Math.floor((f + k * 5 + t * 11 + vx) / 4) % 9;
        mb.emit(fl === 0 ? PAL.C9 : fl < 3 ? PAL.C7 : PAL.C6)(vx + k, ty - 1);
      }
    }
    rect(vx - 1, 158, 3, 3, mb.mat('lb.brass', -0.6));
  }

  // ---- the TV (right, high) ----
  {
    const T = L.TV;
    rect(T.x0 - 2, T.y0 - 2, T.x1 - T.x0 + 5, T.y1 - T.y0 + 5, mb.mat('black', 0.2));
    rect(T.x0 - 2, T.y0 - 2, T.x1 - T.x0 + 5, 1, mb.shade(1.4));
    if (s.tv === 'on') {
      for (let y = T.y0; y <= T.y1; y++) for (let x = T.x0; x <= T.x1; x++) mb.emit(bayer(x, y) < 0.5 ? PAL.N5 : PAL.N4)(x, y);
    } else {
      rect(T.x0, T.y0, T.x1 - T.x0 + 1, T.y1 - T.y0 + 1, mb.emit(PAL.N1));
      line(T.x0 + 8, T.y1 - 2, T.x0 + 30, T.y0 + 2, mb.emit(PAL.N2));
      line(T.x0 + 12, T.y1 - 2, T.x0 + 34, T.y0 + 2, mb.emit(PAL.N2));
    }
    rect((T.x0 + T.x1) >> 1, T.y1 + 3, 1, 1, mb.emit(s.tv === 'on' ? PAL.L3 : PAL.R1));
  }
  // ---- the wall sign ----
  paintSign(mb, s);
  // ---- the floor: polished stone tiles in perspective, reflections of the bright things ----
  rect(0, L.WALL_FLOOR_Y, 480, RH - L.WALL_FLOOR_Y, mb.mat('lb.floor', 0.4));
  const VPY = -120;
  for (let xw = -480; xw <= 960; xw += 30) {
    const x1 = 240 + ((xw - 240) * (RH - VPY)) / (L.WALL_FLOOR_Y - VPY);
    line(xw, L.WALL_FLOOR_Y, Math.round(x1), RH, mb.shade(-0.9));
  }
  for (let k = 0, y = L.WALL_FLOOR_Y + 4; y < RH; k++, y += 6 + k * 3) rect(0, y, 480, 1, mb.shade(-0.9));
  // checker: alternate tiles one rung darker (a cathedral floor)
  for (let y = L.WALL_FLOOR_Y; y < RH; y++) {
    let row = 0, yy = L.WALL_FLOOR_Y + 4;
    for (let k = 0; yy <= y; k++) { yy += 6 + (k + 1) * 3; row++; }
    for (let x = 0; x < 480; x++) {
      const t = (y - VPY) / (L.WALL_FLOOR_Y - VPY);
      const xw = 240 + (x - 240) / t;
      const col = Math.floor((xw + 480) / 30);
      if ((col + row) % 2) mb.shade(-0.5)(x, y);
    }
  }
  // the check-in rug in front of the desk (a deep red runner, the cathedral aisle)
  const rv = day ? -1.2 : 0;
  poly([204, 170, 276, 170, 290, RH, 190, RH], mb.mat('lb.velvet', -1.8 + rv));
  poly([207, 172, 273, 172, 286, RH, 194, RH], mb.mat('lb.velvet', -1.1 + rv));
  for (let y = 176; y < RH; y += 6) { const t = (y - 170) / 33; rect(Math.round(206 - t * 12), y, Math.round(68 + t * 24), 1, mb.shade(-0.8)); }
  // floor reflections: the entrance glass, the pillars' LEDs and the neon lie in the polish as dithered streaks
  paintReflections(mb, s);
};

const paintRose = (mb: MatBuf, s: LobbyState) => {
  const {cx, cy, r} = LOBBY.ROSE;
  const day = s.time === 'day', f = s.f;
  // stone ring
  ellipse(cx, cy, r + 4, r + 4, mb.mat('lb.stone', 1.2));
  ellipse(cx, cy, r + 2, r + 2, mb.mat('lb.stoneDk', -0.4));
  // the glass: a GPU die — a grid of compute blocks, cache stripes, a bright core — in leaded jewel tones
  const jewelDay = [PAL.C6, PAL.C5, PAL.W6, PAL.R2, PAL.L2, PAL.N7, PAL.C7, PAL.U3];
  const jewelNight = [PAL.C3, PAL.C2, PAL.C4, PAL.N4, PAL.C2, PAL.N3, PAL.C5, PAL.U1];
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      const gx = Math.floor((x - cx + 64) / 6), gy = Math.floor((y - cy + 64) / 5);
      const lead = (x - cx + 64) % 6 === 0 || (y - cy + 64) % 5 === 0 || Math.abs(d - r) < 0.9;
      if (lead) { mb.mat('lb.stoneDk', -0.8)(x, y); continue; }
      const core = Math.abs(dx) < 6 && Math.abs(dy) < 5;
      const pick = core ? 6 : Math.floor(hash(gx, gy, 9) * 7);
      let c = (day ? jewelDay : jewelNight)[pick];
      if (!day && hash(gx, gy, 10 + Math.floor(f / 30)) < 0.12) c = PAL.C6; // compute blocks light up at night
      mb.emit(c)(x, y);
    }
  // tracery spokes: eight lines from the core (the die's interconnect)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    for (let t = 7; t < r; t++) mb.mat('lb.stoneDk', -0.8)(Math.round(cx + Math.cos(a) * t), Math.round(cy + Math.sin(a) * t));
  }
};

const paintElevator = (mb: MatBuf, x0: number, x1: number, open: number, f: number, i: number, day: boolean) => {
  const [y0, y1] = LOBBY.ELEV_Y;
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  // surround
  rect(x0 - 3, y0 - 3, w + 6, 3, mb.mat('lb.steel', 1.2));
  rect(x0 - 3, y0, 3, h, mb.mat('lb.steel', 1));
  rect(x1 + 1, y0, 3, h, mb.mat('lb.steel', 0.2));
  rect(x0 - 3, y0 - 3, w + 6, 1, mb.shade(1.4));
  // the car interior (warm, bright) shows between the doors as they part
  const gap = [0, 6, 14, w][clamp(Math.round(open), 0, 3)];
  const mid = x0 + (w >> 1);
  for (let y = y0; y <= y1; y++) for (let x = mid - (gap >> 1); x < mid + (gap >> 1); x++) mb.emit(y < y0 + 4 ? PAL.W8 : bayer(x, y) < 0.5 ? PAL.W6 : PAL.W5)(x, y);
  // doors (brushed brass, a lit centre seam), sliding apart
  for (let x = x0; x <= x1; x++) {
    if (x >= mid - (gap >> 1) && x < mid + (gap >> 1)) continue;
    for (let y = y0; y <= y1; y++) mb.mat('lb.steel', (x % 5 === 0 ? -0.5 : 0.3) + (y < y0 + 2 ? 1.2 : 0) + (x === x0 || x === x1 ? 0.8 : 0))(x, y);
  }
  if (!gap) { rect(mid, y0, 1, h, mb.mat('lb.steel', -1.2)); rect(mid + 1, y0, 1, h, mb.mat('lb.steel', 1.6)); }
  // arrow lamp above (lit when the car is here)
  const lit = open > 0 || Math.floor((f + i * 37) / 60) % 3 === 0;
  const ax = mid - 2, ay = y0 - 9;
  rect(ax - 2, ay - 1, 9, 6, mb.mat('black', 0.4));
  [[2, 0], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]].forEach(([dx, dy]) => (lit ? mb.emit(PAL.W7) : mb.mat('lb.brass', -1))(ax + dx, ay + dy + 1));
  void day;
};

// the drum: floor ring + the wings behind the post in FAR; the front wings, the curved side glass and the
// canopy in DOOR (drawn over anyone inside). Four held wing drawings, 22.5 deg apart (the pattern repeats per 90).
const REV_ANGLES = [0, 22.5, 45, 67.5];
const wingsOf = (s: LobbyState) => {
  const a0 = REV_ANGLES[((Math.floor(s.revolve ?? 0) % 4) + 4) % 4];
  return [0, 90, 180, 270].map((d) => ((d + a0 + 10) * Math.PI) / 180);
};
/** a wing: glass in a heavy steel frame (top rail, kick plate, push bar, outer stile). Front wings are drawn in
 *  DOOR (over anyone inside the drum); back wings in FAR, where they also darken what's seen through them. */
const drawWing = (mb: MatBuf, ang: number, front: boolean) => {
  const R = LOBBY.REVOLVE;
  const ex = Math.round(R.cx + Math.cos(ang) * (R.r - 2));
  const drop = Math.round(Math.sin(ang) * 3); // the floor end of a near wing sits lower (the floor ellipse)
  const xa = Math.min(R.cx, ex), xb = Math.max(R.cx, ex);
  const yt = R.top + 1;
  const lv = front ? 1 : -0.6;
  for (let x = xa; x <= xb; x++) {
    const t = ex === R.cx ? 0 : (x - R.cx) / (ex - R.cx);
    const yb = R.floor - 3 + Math.round(t * drop);
    if (front) { for (let y = yt + 3; y < yb - 8; y++) if (((x - xa) * 2 + (y - yt)) % 31 === 0) mb.mat('lb.stone', 2.6)(x, y); }
    else for (let y = yt + 2; y < yb - 7; y++) { const i = mb.idx(x, y); if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], -1); }
    rect(x, yt, 1, 2, mb.mat('lb.steel', lv + 0.4));
    rect(x, yb - 7, 1, 7, mb.mat('lb.steel', lv - 0.4)); // the kick plate
    mb.mat('lb.steel', lv + 1.2)(x, yb - 7);
    rect(x, yb - 34, 1, 2, mb.mat('lb.steel', lv + 0.8)); // the push bar
  }
  // the wing's outer stile (the edge that reads as a panel)
  rect(ex - (ex > R.cx ? 1 : 0), yt, 2, R.floor - 3 + drop - yt, mb.mat('lb.steel', lv + 0.9));
};
const paintRevolveBack = (mb: MatBuf, s: LobbyState) => {
  const R = LOBBY.REVOLVE;
  // the drum is a glass volume: everything seen through it is one step darker, with a bright curve at its back
  for (let y = R.top; y < R.floor + 4; y++) for (let x = R.cx - R.r; x <= R.cx + R.r; x++) { const i = mb.idx(x, y); if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], -1); }
  // the floor ring (a recessed round mat with a steel rim)
  ellipse(R.cx, R.floor, R.r + 3, 5, mb.mat('lb.steel', 0.8));
  ellipse(R.cx, R.floor, R.r, 3.6, mb.mat('lb.floor', -1.2));
  for (let x = R.cx - R.r + 3; x < R.cx + R.r - 2; x += 3) mb.shade(0.8)(x, R.floor);
  for (const w of wingsOf(s)) if (Math.sin(w) < 0) drawWing(mb, w, false);
  // central post
  rect(R.cx - 1, R.top, 3, R.floor - R.top - 2, mb.mat('lb.steel', 1));
  rect(R.cx - 1, R.top, 1, R.floor - R.top - 2, mb.shade(1.4));
};
const paintRevolveFront = (mb: MatBuf, s: LobbyState) => {
  const R = LOBBY.REVOLVE;
  for (const w of wingsOf(s)) if (Math.sin(w) >= 0) drawWing(mb, w, true);
  // the drum's curved side walls: a steel edge, a bright sheen hugging each curve
  for (const side of [-1, 1]) {
    const xo = R.cx + side * R.r;
    for (let y = R.top; y < R.floor - 1; y++) {
      mb.mat('lb.steel', side < 0 ? 1.6 : 0.6)(xo, y); mb.mat('lb.steel', side < 0 ? 1 : 0)(xo + side, y);
      if ((y & 1) === 0) mb.mat('lb.stone', 2.8)(xo - side * 3, y);
      if (y % 4 === 0) mb.mat('lb.stone', 2)(xo - side * 6, y);
    }
  }
  // the canopy: a dark bronze drum, its underside curved (we're a little below it), a brass band, a lit crown
  const cw = R.r * 2 + 8, cx0 = R.cx - R.r - 4;
  for (let x = cx0; x < cx0 + cw; x++) {
    const u = (x - R.cx) / (R.r + 4);
    const under = Math.round(3 * Math.sqrt(Math.max(0, 1 - u * u)));
    for (let y = R.top - 12; y <= R.top + under; y++) mb.mat('lb.steel', y < R.top - 10 ? 2 : y > R.top - 1 ? -0.8 : -0.2)(x, y);
    mb.mat('lb.brass', 1.2)(x, R.top - 5);
    mb.mat('lb.brass', 0.2)(x, R.top - 4);
  }
  for (let x = cx0 + 4; x < cx0 + cw - 3; x += 8) rect(x, R.top - 9, 2, 3, mb.shade(-1));
  // the front edge of the floor ring
  for (let x = R.cx - R.r - 2; x <= R.cx + R.r + 2; x++) { const u = (x - R.cx) / (R.r + 3); mb.mat('lb.steel', 1.4)(x, Math.round(R.floor + 5 * Math.sqrt(Math.max(0, 1 - u * u)))); }
};

const paintSign = (mb: MatBuf, s: LobbyState) => {
  const S = LOBBY.SIGN;
  const st = s.sign ?? 0;
  const w = S.x1 - S.x0 + 1, h = S.y1 - S.y0 + 1;
  // drop shadow + a dark aluminium frame
  rect(S.x0 + 2, S.y0 + 2, w, h, mb.shade(-1.4));
  rect(S.x0, S.y0, w, h, mb.mat('metal', -0.4));
  rect(S.x0, S.y0, w, 1, mb.shade(1.6));
  // the face: a lightbox. Blank / unlit it is plain board; lit, it glows (emissive steps)
  const fx0 = S.x0 + 2, fy0 = S.y0 + 2, fx1 = S.x1 - 26, fy1 = S.y1 - 2;
  const lit = st >= 2;
  for (let y = fy0; y <= fy1; y++)
    for (let x = fx0; x <= fx1; x++) {
      if (st === 3) mb.emit(y === fy0 ? PAL.P2 : PAL.P1)(x, y);
      else if (st === 2) mb.emit(bayer(x, y) < 0.5 ? PAL.P1 : PAL.P0)(x, y);
      else mb.mat('lb.sign', y === fy0 ? 0.8 : 0)(x, y);
    }
  // a green safety header rule (it is that kind of sign)
  rect(fx0, fy0, fx1 - fx0 + 1, 2, lit ? mb.emit(PAL.L2) : mb.mat('plant', st ? 1.2 : 0.6));
  if (st >= 1) {
    const lines = ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'];
    lines.forEach((l, i) => {
      const tx = fx0 + 3, ty = fy0 + 4 + i * 10;
      if (lit) textEmit(mb, l, tx, ty, st === 3 ? PAL.N1 : PAL.N2);
      else textMat(mb, l, tx, ty, 'black', 0.4);
    });
  } else {
    // blank: just the empty letter rails where the words will go
    for (let i = 0; i < 4; i++) rect(fx0 + 3, fy0 + 11 + i * 10, fx1 - fx0 - 6, 1, mb.mat('lb.sign', -1.2));
  }
  // the number slot: a dark recess with a hanging plate
  const nx0 = S.x1 - 23, ny0 = S.y0 + 13, nw = 20, nh = 28;
  rect(nx0, ny0, nw, nh, mb.mat('black', -0.6));
  rect(nx0, ny0, nw, 1, mb.shade(-1));
  rect(nx0 + 1, ny0 - 2, 2, 3, mb.mat('metal', 1.4)); rect(nx0 + nw - 3, ny0 - 2, 2, 3, mb.mat('metal', 1.4)); // hooks
  if (st >= 1) {
    const d = s.days ?? '0';
    rect(nx0 + 2, ny0 + 3, nw - 4, nh - 6, lit ? mb.emit(st === 3 ? PAL.P2 : PAL.P1) : mb.mat('lb.sign', 0.6));
    const bw = bigTextWidth(d);
    const sink = new Buf(1, 1, 0);
    const bx = nx0 + Math.round((nw - bw) / 2), by = ny0 + 7;
    sink.set = (px: number, py: number) => (lit ? mb.emit(PAL.R2) : mb.mat('red', 0.6))(px, py);
    bigText(sink, d, bx, by, 0);
  }
};

/** the box of spare 0 plates, set on the floor under the sign (sc 30) */
const paintZeroBox = (mb: MatBuf) => {
  const {x, y} = LOBBY.BOX;
  // an open cardboard box, plates standing in it
  poly([x - 12, y - 10, x + 12, y - 10, x + 12, y, x - 12, y], mb.mat('lb.box', 0.8));
  rect(x - 12, y - 10, 25, 1, mb.shade(1.4));
  poly([x - 12, y - 10, x - 16, y - 14, x - 8, y - 14, x - 5, y - 10], mb.mat('lb.box', 1.6)); // flaps
  poly([x + 12, y - 10, x + 16, y - 14, x + 8, y - 14, x + 5, y - 10], mb.mat('lb.box', 0.2));
  for (let k = 0; k < 4; k++) {
    const px = x - 9 + k * 5, py = y - 17 + (k % 2);
    rect(px, py, 5, 8, mb.mat('lb.sign', 1.6));
    rect(px + 1, py + 1, 3, 5, mb.mat('red', 0.8));
    rect(px + 2, py + 2, 1, 3, mb.mat('lb.sign', 1.6)); // the 0's hole
  }
  rect(x - 12, y, 25, 1, mb.shade(-1.6));
};

const paintReflections = (mb: MatBuf, s: LobbyState) => {
  const L = LOBBY, day = s.time === 'day';
  // the entrance glass reflected in the polished floor: vertical dithered streaks
  for (let y = L.WALL_FLOOR_Y + 2; y < RH - 1; y++) {
    const t = (y - L.WALL_FLOOR_Y) / 45;
    for (let x = 2; x < 104; x++) {
      if ((x % 26) < 3) continue;
      if (bayer(x, y) < (day ? 0.3 : 0.12) * (1 - t)) mb.shade(day ? 1.6 : 1)(x, y);
    }
  }
  // neon + votive streaks
  for (const [x0, x1, amt] of [[200, 280, 0.35], [140, 152, 0.4], [328, 340, 0.4], [106, 126, 0.25], [354, 374, 0.25]] as Array<[number, number, number]>)
    for (let y = L.DESK.base + 2; y < RH; y++) for (let x = x0; x < x1; x++) if (bayer(x, y) < amt * (1 - (y - L.DESK.base) / 36)) mb.shade(1.2)(x, y);
};

// ------------------------------------------------------------------ FRONT: the reception desk
const paintDesk = (mb: MatBuf, s: LobbyState) => {
  const D = LOBBY.DESK, f = s.f;
  // top slab (pale stone) and the black-glass front with the neon wordmark
  rect(D.x0 - 3, D.top, D.x1 - D.x0 + 7, D.front - D.top, mb.mat('lb.stone', 1.4));
  rect(D.x0 - 3, D.top, D.x1 - D.x0 + 7, 1, mb.shade(1.4));
  rect(D.x0 - 3, D.front - 1, D.x1 - D.x0 + 7, 1, mb.shade(-1.4));
  rect(D.x0, D.front, D.x1 - D.x0 + 1, D.base - D.front, mb.mat('lb.desk', 0.4));
  rect(D.x0, D.front, 1, D.base - D.front, mb.shade(1.2));
  rect(D.x1, D.front, 1, D.base - D.front, mb.shade(-1));
  // vertical flutes (stone-cut, the only gothic note on the desk)
  for (let x = D.x0 + 6; x < D.x1 - 4; x += 8) rect(x, D.front + 3, 1, D.base - D.front - 6, mb.shade(-0.7));
  rect(D.x0, D.base - 4, D.x1 - D.x0 + 1, 4, mb.mat('lb.stone', -0.2));
  // NOPE AI in cyan neon (display face), a 1px glow halo, the hot core a step up
  const word = 'NOPE AI';
  const ww = bigTextWidth(word), wx = LOBBY.NEON.cx - Math.round(ww / 2), wy = LOBBY.NEON.y;
  const glyph = new Set<number>();
  const sink = new Buf(1, 1, 0);
  sink.set = (px: number, py: number) => { glyph.add(py * 480 + px); };
  bigText(sink, word, wx, wy, 0);
  for (const k of glyph) {
    const x = k % 480, y = (k / 480) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!glyph.has((y + dy) * 480 + x + dx)) mb.emit(PAL.C3)(x + dx, y + dy);
  }
  for (const k of glyph) { const x = k % 480, y = (k / 480) | 0; mb.emit(glyph.has(k - 480) && glyph.has(k + 480) ? PAL.C8 : PAL.C6)(x, y); }
  // LED tea-lights along the desk top (a row of votives)
  for (let x = D.x0 + 4; x < D.x1 - 2; x += 7) {
    if (Math.abs(x - 240) < 22) continue; // the check-in spot stays clear
    const fl = Math.floor((f + x * 3) / 4) % 8;
    rect(x, D.top - 2, 2, 2, mb.mat('lb.stone', 2));
    mb.emit(fl === 0 ? PAL.C9 : fl < 3 ? PAL.C7 : PAL.C6)(x, D.top - 3);
  }
  // a bell and a guest book on the check-in spot
  ellipse(236, D.top - 1, 2.6, 1.6, mb.mat('lb.brass', 1.2)); mb.mat('lb.brass', 2.6)(236, D.top - 3);
  poly([243, D.top - 1, 254, D.top - 2, 256, D.top + 1, 244, D.top + 2], mb.mat('lb.sign', 1));
};

const paintRopes = (mb: MatBuf) => {
  for (const [x, y] of [[20, 200], [460, 200]] as Array<[number, number]>) {
    rect(x - 1, y - 26, 3, 26, mb.mat('lb.brass', 0.6));
    ellipse(x, y - 27, 2.5, 2.5, mb.mat('lb.brass', 1.6));
    ellipse(x, y, 6, 2, mb.mat('lb.brass', 0));
  }
  for (let x = 22; x < 60; x++) mb.mat('lb.velvet', 0.6)(x, Math.round(178 + Math.sin(((x - 22) / 38) * Math.PI) * 7));
  for (let x = 420; x < 458; x++) mb.mat('lb.velvet', 0.6)(x, Math.round(178 + Math.sin(((x - 420) / 38) * Math.PI) * 7));
};

// ------------------------------------------------------------------ lights
const lobbyLights = (s: LobbyState): Lights => {
  const day = s.time === 'day';
  const signLit = (s.sign ?? 0) >= 2;
  const S = LOBBY.SIGN;
  return {
    amb: (x, y) => {
      let a = day ? 3.6 : 2.1;
      if (y >= LOBBY.WALL_FLOOR_Y) a -= 0.3;
      // the entrance brightens its side of the room (day: a lot)
      const d = Math.hypot((x - 40) / 240, (y - 118) / 140);
      if (d < 1) a += (1 - d) * (day ? 1.6 : 0.5);
      const vx = (x - 240) / 240, vy = (y - 101) / 112;
      a -= Math.max(0, vx * vx + vy * vy - 0.55) * 1.6;
      return a;
    },
    cyan: (x, y) => {
      let L = 0;
      // the neon wordmark on the desk front throws cyan onto the floor and the rug in front of it
      if (y > LOBBY.DESK.base - 2) { const d = Math.hypot((x - 240) / 90, (y - 176) / 16); if (d < 1) L = Math.max(L, (1 - d) * 0.75); }
      // votive stands + desk tea-lights
      for (const vx of [146, 334]) { const d = Math.hypot((x - vx) / 18, (y - 148) / 18); if (d < 1) L = Math.max(L, Math.pow(1 - d, 1.3) * 0.7); }
      if (y > LOBBY.DESK.top - 30 && y < LOBBY.DESK.top + 4) { const d = Math.hypot((x - 240) / 90, (y - LOBBY.DESK.top + 8) / 14); if (d < 1) L = Math.max(L, (1 - d) * 0.55); }
      // the rack pillars' LEDs wash their sides
      for (const [p0, p1] of LOBBY.PILLARS) { const d = Math.abs(x - (p0 + p1) / 2) / 30; if (d < 1 && y > LOBBY.CEIL_Y && y < RH) L = Math.max(L, (1 - d) * (day ? 0.25 : 0.45)); }
      // night: the rose window glows server-cyan down the chancel
      if (!day) { const d = Math.hypot((x - 240) / 70, (y - 40) / 48); if (d < 1) L = Math.max(L, (1 - d) * 0.6); }
      return L;
    },
    warm: (x, y) => {
      let L = 0;
      if (day) {
        // sun through the entrance: a bright slab on the floor (mullion shadows) + a spill on the wall by it
        if (y >= LOBBY.WALL_FLOOR_Y) {
          const t = (y - LOBBY.WALL_FLOOR_Y) / 45;
          const u = x - (104 + t * 120);
          if (u < 0 && u > -120 - t * 60) { const m = ((x + Math.round(t * 30)) % 26); L = m < 3 ? 0.35 : 0.9 - t * 0.2; }
        }
        // the rose window's jewel pools fall on the floor in front of the desk (see paint: coloured dither)
      } else {
        // the elevator cars and the street lamp are the only warm light at night
        for (const [e0, e1] of LOBBY.ELEVATORS) { const d = Math.hypot((x - (e0 + e1) / 2) / 40, (y - 154) / 24); if (d < 1) L = Math.max(L, (1 - d) * 0.25 * ((s.elevator ?? [0, 0])[0] + (s.elevator ?? [0, 0])[1] > 0 ? 3 : 1)); }
        const d = Math.hypot((x - 60) / 90, (y - 186) / 22); if (d < 1) L = Math.max(L, (1 - d) * 0.18);
      }
      // a lit sign is a lightbox: cream light on the wall around it and the floor under it
      if (signLit) {
        // a lightbox throws its light forward and down: a band on the wall around it, a pool on the floor below
        const cx = (S.x0 + S.x1) / 2;
        const k = (s.sign ?? 0) === 3 ? 1 : 0.6;
        const dw = Math.hypot((x - cx) / 62, (y - (S.y0 + S.y1) / 2) / 34);
        if (y < LOBBY.WALL_FLOOR_Y && dw < 1) L = Math.max(L, Math.pow(1 - dw, 1.4) * 0.7 * k);
        const df = Math.hypot((x - cx) / 70, (y - LOBBY.WALL_FLOOR_Y - 7) / 10);
        if (y >= LOBBY.WALL_FLOOR_Y && df < 1) L = Math.max(L, Math.pow(1 - df, 1.2) * 0.55 * k);
      }
      return L;
    },
    dither: 0.55,
  };
};

// ------------------------------------------------------------------ public API
export interface LobbyLayers { far: Buf; door: Buf; front: Buf; fore: Buf; }

export const lobbyLayers = (st: Partial<LobbyState> & {f: number; time: 'day' | 'night'}): LobbyLayers => {
  const s: LobbyState = {...LOBBY_DEFAULT, ...st};
  const far = new MatBuf(480, RH), door = new MatBuf(480, RH), front = new MatBuf(480, RH), fore = new MatBuf(480, RH);
  paintFar(far, s);
  if (s.zeroBox) paintZeroBox(far);
  paintRevolveFront(door, s);
  paintDesk(front, s);
  if (s.ropes) paintRopes(fore);
  const L = lobbyLights(s);
  const out = (mb: MatBuf, opaque: boolean) => { const b = new Buf(480, RH, opaque ? PAL.N0 : TRANSPARENT); resolve(mb, L, b, 0); return b; };
  const layers = {far: out(far, true), door: out(door, false), front: out(front, false), fore: out(fore, false)};
  if (s.time === 'day') roseDayPools(layers.far, s);
  return layers;
};

/** DAY: the rose window's coloured light lands on the rug/floor in front of the desk as a few jewel pools. */
const roseDayPools = (b: Buf, s: LobbyState) => {
  const pools: Array<[number, number, number]> = [[168, 180, PAL.C4], [316, 184, PAL.W5], [146, 194, PAL.L2]];
  for (const [px, py, col] of pools)
    for (let y = py - 5; y <= py + 5; y++)
      for (let x = px - 18; x <= px + 18; x++) {
        const d = Math.hypot((x - px) / 18, (y - py) / 5);
        if (d < 1 && bayer(x, y) < (1 - d) * 0.34) b.set(x, y, col);
      }
  void s;
};

export const drawLobby = (b: Buf, st: Partial<LobbyState> & {f: number; time: 'day' | 'night'}, cast: {
  /** inside the revolving drum, or behind the desk (out of the elevator) */
  back?: (b: Buf) => void;
  /** in the lobby, in front of the desk */
  lobby?: (b: Buf) => void;
} = {}, shake: [number, number] = [0, 0]) => {
  const L = lobbyLayers(st);
  const [dx, dy] = shake;
  overlay(b, L.far, dx, dy);
  cast.back?.(b);
  overlay(b, L.door, dx, dy);
  overlay(b, L.front, dx, dy);
  cast.lobby?.(b);
  overlay(b, L.fore, dx, dy);
};


// ================================================================== the SECURITY-CAMERA view (sc 27, DAY)
// A reverse angle from high over the reception desk, looking back at the entrance: the glass wall across the
// top, the revolving drum at left, the floor in steep perspective, the desk's top at the bottom. Someone who
// walks in crosses the frame at one depth (CAM.PATH), so a room sprite needs no scaling. Drawn in BASE, then
// the tile is graded to a CCTV grey-blue within the master palette (lightness -> a fixed ramp; neon keeps a
// cyan tint). NO timestamp on the tile: an invented clock beside the rail's real date breaks the guardrails.
export const CAM = {
  /** the entrance wall's base line and where the drum sits */
  WALL_Y: 86,
  DRUM: {cx: 92, r: 30, top: 20, floor: 86},
  /** the walk-in line: feet y, from the drum's mouth to the right edge (a room sprite at one depth, no scaling) */
  PATH: {feetY: 140, x0: 92, x1: 470},
  /** a clear corner for the upside-down post (the scene's UI) */
  POST_CORNER: {x: 300, y: 24, w: 172, h: 30},
};
export interface LobbyCamState { f: number; time?: 'day' | 'night'; revolve?: number; rec?: boolean; label?: string; grade?: boolean; }

const CCTV_RAMP = [PAL.N0, PAL.N1, PAL.N2, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6];
const CCTV_CYAN = [PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5];
/** grade a region to CCTV: lightness steps onto one grey-blue ramp; saturated cyan (neon, LEDs) stays tinted */
export const cctvGrade = (b: Buf, x0 = 0, y0 = 0, w = b.w, h = b.h) => {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      const c = b.c[y * b.w + x];
      if (c === TRANSPARENT) continue;
      const L = lightness(c);
      const r = (c >> 16) & 255, g = (c >> 8) & 255, bl = c & 255;
      const cyan = g > r + 40 && bl > r + 30;
      // scan-line texture: every third row one rung darker (a static texture, not a glitch)
      const k = clamp(Math.round((L - 0.08) / 0.07) - ((y % 3) === 2 ? 1 : 0), 0, CCTV_RAMP.length - 1);
      b.c[y * b.w + x] = cyan ? CCTV_CYAN[clamp(Math.round((L - 0.2) / 0.12), 0, 4)] : CCTV_RAMP[k];
    }
};

const paintCam = (mb: MatBuf, s: LobbyCamState) => {
  const day = (s.time ?? 'day') === 'day', f = s.f;
  const WY = CAM.WALL_Y;
  // ---- outside, through the glass, seen from high up: our sidewalk, the kerb, the street, the far kerb ----
  for (let y = 0; y < WY; y++)
    for (let x = 0; x < 480; x++) {
      const b = bayer(x, y);
      let c: number;
      if (y < 10) c = day ? PAL.G4 : PAL.N2; // the far sidewalk
      else if (y < 13) c = day ? PAL.G5 : PAL.N3; // far kerb
      else if (y < 46) c = day ? (b < 0.5 ? PAL.G3 : PAL.G2) : PAL.N1; // the street
      else if (y < 49) c = day ? PAL.P1 : PAL.N3; // our kerb
      else c = day ? (b < 0.25 ? PAL.P1 : PAL.P0) : PAL.N2; // our sidewalk
      mb.emit(c)(x, y);
    }
  for (let x = 6; x < 480; x += 30) rect(x, 29, 14, 2, mb.emit(day ? PAL.P1 : PAL.N4)); // lane dashes
  // a car passing (roof seen from above), held on 2s
  const carX = ((Math.floor(f / 2) * 6) % 640) - 80;
  if (carX > -60 && carX < 480) { rect(carX, 15, 44, 13, mb.emit(day ? PAL.G1 : PAL.N0)); rect(carX + 10, 17, 22, 9, mb.emit(day ? PAL.G2 : PAL.N1)); rect(carX + 12, 18, 18, 1, mb.emit(day ? PAL.G5 : PAL.N3)); }
  // bollards along the kerb
  for (let x = 40; x < 480; x += 60) { ellipse(x, 54, 2.5, 1.6, mb.emit(day ? PAL.G2 : PAL.N1)); mb.emit(day ? PAL.G5 : PAL.N3)(x - 1, 53); }
  // ---- the glass wall: steel mullions leaning out toward the top (we look down on a vertical wall) ----
  for (let k = -1; k < 9; k++) {
    const xb = 30 + k * 60;
    const xt = 240 + (xb - 240) * 1.3;
    line(Math.round(xt), 0, xb, WY - 2, mb.mat('lb.steel', -0.4));
    line(Math.round(xt) + 1, 0, xb + 1, WY - 2, mb.mat('lb.steel', 1));
  }
  // transom rail + the wall's base (a steel sill)
  line(0, 38, 480, 38, mb.mat('lb.steel', 0.2));
  rect(0, WY - 3, 480, 4, mb.mat('lb.steel', 0.4));
  rect(0, WY - 3, 480, 1, mb.shade(1.4));
  // ---- the revolving drum: canopy, curved glass (it tints what's behind it), wings on a post ----
  const D = CAM.DRUM;
  const inDrum = (x: number, y: number) => Math.abs(x - D.cx) <= D.r && y >= D.top + 6 && y <= D.floor + Math.round(7 * Math.sqrt(Math.max(0, 1 - ((x - D.cx) / D.r) ** 2)));
  for (let y = D.top; y <= D.floor + 8; y++) for (let x = D.cx - D.r; x <= D.cx + D.r; x++) if (inDrum(x, y)) { const i = mb.idx(x, y); if (i >= 0 && mb.eOn[i]) mb.e[i] = stepColor(mb.e[i], -1); }
  // the floor disc inside the drum (a mat)
  ellipse(D.cx, D.floor, D.r, 7, mb.mat('lb.floor', -0.4));
  ellipse(D.cx, D.floor, D.r + 2, 8, mb.shade(0));
  const a0 = [0, 22.5, 45, 67.5][((Math.floor(s.revolve ?? 0) % 4) + 4) % 4];
  const wings = [0, 1, 2, 3].map((k) => ((a0 + 10 + k * 90) * Math.PI) / 180).sort((p, q) => Math.sin(p) - Math.sin(q));
  for (const a of wings) {
    const ex = Math.round(D.cx + Math.cos(a) * (D.r - 2)), ey = Math.round(Math.sin(a) * 6);
    // the wing is a glass panel standing on the floor disc: top rail, bottom rail, outer stile
    line(D.cx, D.floor, ex, D.floor + ey, mb.mat('lb.steel', 1.2));
    line(D.cx, D.top + 12, ex, D.top + 12 + Math.round(ey * 0.8), mb.mat('lb.steel', 0.6));
    line(ex, D.top + 12 + Math.round(ey * 0.8), ex, D.floor + ey, mb.mat('lb.steel', Math.sin(a) > 0 ? 1.6 : 0));
    // the glass sheen: one diagonal
    line(D.cx + Math.round((ex - D.cx) * 0.3), D.floor - 10, D.cx + Math.round((ex - D.cx) * 0.6), D.top + 24, mb.mat('lb.stone', Math.sin(a) > 0 ? 2 : 0.6));
  }
  rect(D.cx - 1, D.top + 6, 3, D.floor - D.top - 6, mb.mat('lb.steel', 1.2));
  // the drum's side walls
  for (const side of [-1, 1]) { rect(D.cx + side * D.r - (side > 0 ? 1 : 0), D.top + 6, 2, D.floor - D.top - 2, mb.mat('lb.steel', side < 0 ? 1.4 : 0.4)); }
  // the canopy from above: a bronze ring with a darker roof
  ellipse(D.cx, D.top + 4, D.r + 3, 8, mb.mat('lb.brass', 0.8));
  ellipse(D.cx, D.top + 3, D.r - 2, 5.5, mb.mat('lb.brass', -0.6));
  for (let x = D.cx - D.r - 3; x <= D.cx + D.r + 3; x++) { const u = (x - D.cx) / (D.r + 3); mb.mat('lb.brass', 1.8)(x, Math.round(D.top + 4 + 8 * Math.sqrt(Math.max(0, 1 - u * u)))); }
  // ---- the floor, steep: checker tiles converging on a VP far above the frame ----
  const VX = 250, VY = -300;
  rect(0, WY + 1, 480, RH - WY - 1, mb.mat('lb.floor', 0.8));
  const rowY: number[] = [];
  for (let k = 0, y = WY + 1; y < RH; k++) { rowY.push(y); y += 10 + k * 3; }
  for (let y = WY + 1; y < RH; y++) {
    let row = 0; for (const ry of rowY) if (ry <= y) row++;
    const t = (y - VY) / (WY - VY);
    for (let x = 0; x < 480; x++) {
      const xw = VX + (x - VX) / t;
      if (Math.floor((xw + 1020) / 34) % 2 !== row % 2) mb.shade(-0.6)(x, y);
      if ((xw + 1020) % 34 < 1 / t) mb.shade(-0.9)(x, y);
    }
  }
  for (const ry of rowY) rect(0, ry, 480, 1, mb.shade(-0.9));
  // the aisle runner, from the desk (bottom) up to the drum's mouth
  poly([D.cx - 16, WY + 8, D.cx + 18, WY + 8, 240, RH, 150, RH], mb.mat('lb.velvet', day ? -1.6 : -1));
  // ---- a rack pillar at the left edge, rising out of frame (leaning, we look down) ----
  poly([0, RH, 24, RH, 34, 0, 0, 0], mb.mat('lb.rack', 0.6));
  line(24, RH, 34, 0, mb.shade(1.8));
  for (let y = 4; y < RH; y += 6) {
    const xr = Math.round(24 + (RH - y) * (10 / RH));
    rect(0, y, xr - 2, 1, mb.shade(-1));
    for (let k = 0; k < 3; k++) { const lx = 5 + k * 7; const on = hash(lx, y, Math.floor((f + lx * 5 + y) / 6)); mb.emit(on < 0.4 ? PAL.C6 : on < 0.5 ? PAL.L3 : PAL.N2)(lx, y + 2); }
  }
  // ---- the desk, from above and behind (the guard's side) ----
  const DY = 168;
  poly([140, DY, 480, DY - 12, 480, RH, 124, RH], mb.mat('lb.desk', 2.2));
  poly([140, DY, 480, DY - 12, 480, DY - 6, 138, DY + 6], mb.mat('lb.stone', 2.2));
  line(140, DY, 480, DY - 12, mb.shade(1.6));
  line(138, DY + 6, 124, RH, mb.shade(1.4));
  for (let x = 146; x < 476; x += 9) { const fl = Math.floor((f + x * 3) / 4) % 8; mb.emit(fl === 0 ? PAL.C9 : PAL.C6)(x, Math.round(DY - 1 - (x - 140) * (12 / 340))); }
  // the guard's monitor faces the guard, so it faces us: it shows the camera grid (this tile, lower right)
  rect(292, 176, 46, 24, mb.mat('black', 1)); rect(292, 176, 46, 1, mb.shade(1.6));
  for (let gy = 0; gy < 2; gy++) for (let gx = 0; gx < 2; gx++) {
    const x0 = 295 + gx * 21, y0 = 179 + gy * 10;
    rect(x0, y0, 19, 8, mb.emit(gx + gy === 2 ? PAL.C3 : PAL.C1));
    rect(x0 + 2, y0 + 2 + gy, 6 + gx * 4, 1, mb.emit(PAL.C4));
  }
  rect(311, 200, 8, 3, mb.mat('metal', 1));
  // keyboard, a coffee cup (from above: a ring), the guest book open
  poly([350, 186, 394, 184, 396, 195, 352, 197], mb.mat('black', 2));
  for (let x = 354; x < 392; x += 3) { mb.shade(1.4)(x, 189); mb.shade(1.4)(x + 1, 192); }
  ellipse(414, 180, 4, 3, mb.mat('lb.stone', 2.6)); ellipse(414, 180, 2.4, 1.6, mb.mat('wood', 0.2));
  poly([190, 182, 222, 180, 224, 196, 192, 198], mb.mat('lb.sign', 2)); rect(207, 180, 1, 17, mb.shade(-1.2));
  for (let y = 184; y < 195; y += 3) { rect(194, y, 10, 1, mb.shade(-1.2)); rect(210, y, 10, 1, mb.shade(-1.2)); }
};

const camLights = (s: LobbyCamState): Lights => {
  const day = (s.time ?? 'day') === 'day';
  return {
    amb: (x, y) => { let a = day ? 3.9 : 2.3; const vx = (x - 240) / 240, vy = (y - 101) / 101; a -= Math.max(0, vx * vx + vy * vy - 0.45) * 1.6; return a; },
    cyan: (x, y) => { const d = Math.abs(x - 14) / 40; return d < 1 ? (1 - d) * 0.4 : 0; },
    warm: (x, y) => {
      if (!day || y < CAM.WALL_Y) return 0;
      // the sun slab through the glass, mullion shadows leaning
      const t = (y - CAM.WALL_Y) / 46;
      if (t > 1) return 0;
      const m = ((x - Math.round(t * 46) + 1000) % 60);
      return (m < 6 ? 0.25 : 0.8) * (1 - t * 0.55);
    },
    dither: 0.5,
  };
};

/** The security tile's chrome, drawn after the grade so it stays crisp: corner brackets, a label, a REC dot.
 *  No clock and no timestamp, ever (an invented log never sits next to the rail's real date). */
export const camChrome = (b: Buf, s: {f: number; rec?: boolean; label?: string}) => {
  const ink = PAL.G5;
  for (const [cx, cy, dx, dy] of [[6, 6, 1, 1], [473, 6, -1, 1], [6, RH - 7, 1, -1], [473, RH - 7, -1, -1]] as Array<[number, number, number, number]>) {
    for (let k = 0; k < 10; k++) { b.set(cx + dx * k, cy, ink); b.set(cx, cy + dy * k, ink); }
  }
  const label = s.label ?? 'CAM 02 · LOBBY';
  if (label) text(b, label, 14, 12, PAL.G6, {shadow: PAL.N0});
  if (s.rec ?? true) {
    const on = Math.floor(s.f / 12) % 2 === 0;
    const rx = 460 - textWidth('REC');
    text(b, 'REC', rx, 12, PAL.G6, {shadow: PAL.N0});
    if (on) ellipse(rx - 7, 15, 2.5, 2.5, (x, y) => b.set(x, y, PAL.R3));
  }
};

/** The security-camera plate (the high reverse angle) into rows 0..202 of b. `cast` draws the walk-in over the
 *  BASE render (feet on CAM.PATH.feetY) so the grade tints him with the room. grade=false returns plain BASE. */
export const drawLobbyCam = (b: Buf, st: LobbyCamState, cast?: (b: Buf) => void) => {
  const s = {rec: true, label: 'CAM 02 · LOBBY', grade: true, ...st};
  const mb = new MatBuf(480, RH);
  paintCam(mb, s);
  const tmp = new Buf(480, RH, PAL.N0);
  resolve(mb, camLights(s), tmp, 0);
  cast?.(tmp);
  if (s.grade) cctvGrade(tmp);
  overlay(b, tmp);
  camChrome(b, s);
};

/** The shotlist's reading of 27.26: the lobby DAY WIDE itself, graded and inside the security chrome.
 *  `cast` gets the room's two depth slots (behind the desk / in the lobby) like drawLobby. */
export const drawLobbyCamWide = (b: Buf, st: {f: number; revolve?: number; rec?: boolean; label?: string; sign?: 0 | 1 | 2 | 3}, cast: {back?: (b: Buf) => void; lobby?: (b: Buf) => void} = {}) => {
  const tmp = new Buf(480, RH, PAL.N0);
  drawLobby(tmp, {f: st.f, time: 'day', revolve: st.revolve, sign: st.sign ?? 0}, cast);
  cctvGrade(tmp);
  overlay(b, tmp);
  camChrome(b, st);
};

// ================================================================== INSERT: the floor under the sign (sc 30.23, NIGHT)
// Close on the wall's foot under the lit sign: the sign's lower edge at the top of frame spilling cream light down
// the stone, the skirting, big polished tiles, and the box of spare 0 plates at insert scale. `box`: 0 none,
// 1 being set down (the hand's drawing 1: 2 px up, a small shadow), 2 set (drawing 2: on the floor, full shadow).
// The hand is the cast's; SIGN_FLOOR.hand is where its fingers hold the box's near flap.
export const SIGN_FLOOR = {box: {x: 240, y: 168}, hand: [262, 132] as [number, number]};
export const drawSignFloorInsert = (b: Buf, st: {f: number; box?: 0 | 1 | 2; days?: string}) => {
  const mb = new MatBuf(480, RH);
  const box = st.box ?? 2;
  const FY = 104; // the wall meets the floor
  // the wall: big coursed limestone blocks (close), the sign's frame and lit face cropped at the top
  rect(0, 0, 480, FY, mb.mat('lb.stone', 0.2));
  for (let y = 10; y < FY - 10; y += 34) { rect(0, y, 480, 2, mb.shade(-1)); const off = ((y / 34) | 0) % 2 ? 0 : 60; for (let x = off; x < 480; x += 120) rect(x, y - 32, 2, 32, mb.shade(-0.7)); }
  rect(96, 0, 288, 14, mb.mat('metal', -0.2)); // the sign's frame (its lower edge)
  rect(96, 13, 288, 1, mb.shade(-1.4));
  for (let x = 100; x < 380; x++) for (let y = 0; y < 10; y++) mb.emit(y < 8 ? PAL.P1 : PAL.P0)(x, y);
  // the skirting (stone, a lit top edge) and the floor
  rect(0, FY - 12, 480, 12, mb.mat('lb.stoneDk', 0.6));
  rect(0, FY - 12, 480, 1, mb.shade(1.6));
  rect(0, FY, 480, RH - FY, mb.mat('lb.floor', 0.6));
  // big tiles in perspective (close): a few long joints converging, alternate tiles a rung darker, the polish
  const VPY = -200;
  for (let xw = -600; xw <= 1080; xw += 90) { const x1 = 240 + ((xw - 240) * (RH - VPY)) / (FY - VPY); line(xw, FY, Math.round(x1), RH, mb.shade(-1)); }
  for (const y of [FY + 30, FY + 74]) rect(0, y, 480, 1, mb.shade(-1));
  for (let y = FY; y < RH; y++) for (let x = 0; x < 480; x++) {
    const t = (y - VPY) / (FY - VPY), xw = 240 + (x - 240) / t;
    const row = y < FY + 30 ? 0 : y < FY + 74 ? 1 : 2;
    if ((Math.floor((xw + 600) / 90) + row) % 2) mb.shade(-0.6)(x, y);
  }
  // the sign's light lies in the polish as a long pale streak
  for (let y = FY + 2; y < RH; y++) for (let x = 110; x < 370; x++) if (bayer(x, y) < 0.34 * (1 - (y - FY) / 110)) mb.shade(1.4)(x, y);
  // the box: an open kraft carton, flaps up, spare 0 plates standing in it (insert scale)
  if (box) {
    const {x, y} = SIGN_FLOOR.box;
    const lift = box === 1 ? 2 : 0;
    const by = y - lift;
    // shadow on the tiles
    ellipse(x + 3, y + 3, box === 1 ? 36 : 44, box === 1 ? 4 : 6, mb.shade(-2));
    // body
    poly([x - 40, by - 36, x + 40, by - 36, x + 40, by, x - 40, by], mb.mat('lb.box', 1.2));
    rect(x - 40, by - 36, 81, 1, mb.shade(1.4));
    rect(x + 30, by - 35, 10, 35, mb.shade(-1.2)); // its turned side
    rect(x - 40, by - 20, 81, 1, mb.shade(-0.6)); // a tape seam
    // flaps
    poly([x - 40, by - 36, x - 54, by - 50, x - 22, by - 50, x - 14, by - 36], mb.mat('lb.box', 2));
    poly([x + 40, by - 36, x + 50, by - 52, x + 20, by - 52, x + 12, by - 36], mb.mat('lb.box', 0.4));
    line(x - 54, by - 50, x - 22, by - 50, mb.shade(1.6));
    // the plates: cream enamel, a red 0 on each, standing in a row, the front ones tipping
    const d = st.days ?? '0';
    for (let k = 0; k < 5; k++) {
      const px = x - 34 + k * 14, py = by - 60 + (k % 2) * 3;
      rect(px, py, 12, 22, mb.mat('lb.sign', 1.8));
      rect(px, py, 12, 1, mb.shade(1.4));
      rect(px + 11, py, 1, 22, mb.shade(-1.2));
      // the digit, big (display face), in red enamel
      const sink = new Buf(1, 1, 0);
      sink.set = (sx: number, sy: number) => mb.mat('red', 1.4)(sx, sy);
      bigText(sink, d, px + 2, py + 4, 0);
    }
    // the box's front face hides the plates' feet
    poly([x - 40, by - 36, x + 40, by - 36, x + 40, by, x - 40, by], mb.mat('lb.box', 1.2));
    rect(x - 40, by - 36, 81, 1, mb.shade(1.6));
    rect(x + 30, by - 35, 10, 35, mb.shade(-1.2));
    rect(x - 40, by - 20, 81, 1, mb.shade(-0.6));
  }
  resolve(mb, {
    amb: (x, y) => 2.2 - Math.max(0, ((x - 240) / 240) ** 2 + ((y - 101) / 112) ** 2 - 0.5) * 1.6,
    cyan: () => 0,
    warm: (x, y) => clamp(1 - Math.hypot((x - 240) / 300, (y + 10) / 200), 0, 1) * 0.95,
    dither: 0.5,
  }, b, 0);
};

export {textWidth, microWidth, lightness};
