// MR. MAS — shared room: TPOOL CORRIDOR — the frosted-glass boardroom door (F1.2 · 2005–08 · TPOOL · (REPORTED)).
// (rooms A · Ep1 sc 26.12-26.13.) A 480x203 room plate, AUTHORED IN BASE and shown only through EARLYWEB16 (the
// switch remaps, it never redraws): a mid-2000s office corridor, beige walls, a fluorescent ceiling panel, grey
// carpet tiles, a water cooler and a ficus, and the boardroom's glass door in an aluminium frame with frosted
// sidelights. The glass carries horizontal frosted-film bands. Behind it the boardroom is lit warm, and two
// shadows lean together: unidentifiable silhouettes, no faces (2 held drawings; the lean is an integer row-shear).
// No sound, no whisper, no names.
//
// The CLOSE (26.13) fills the room area with the same frosted bands, on a 5-row period whose dark film edge sits
// on rows ≡ 0 (mod 5) — the same rows as the dark-room desk's late-wood lines (rooms B, darkroom.ts drawDarkDesk:
// grain bands of 5 rows from y 0). The render front back to BASE lands the bands on the grain.
// Rhymes with the NopeAI boardroom's frosted entry door (boardroom.ts).
import {Buf, rect, line, poly, ellipse, bayer, clamp, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {MatBuf, Lights, defineMat, resolve} from '../light';
import {micro, microWidth} from '../cast/bosses';
import {RH} from './setkit';

defineMat('tp.wall', ['N0', 'N1', 'X0', 'X1', 'X2', 'X3', 'P0', 'P1'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'X1', 'D2', 'D3', 'D4', 'W4', 'W5', 'W7']);
defineMat('tp.carpet', ['N0', 'N1', 'N2', 'G0', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'G0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5']);
defineMat('tp.alu', ['N0', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'N2', 'C1', 'C2', 'C3', 'C4', 'C6', 'C8'], ['N0', 'G1', 'D3', 'W3', 'W4', 'W5', 'W7', 'W8']);
defineMat('tp.ceil', ['N0', 'N1', 'X1', 'X2', 'X3', 'P0', 'P1', 'P2'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['N0', 'X1', 'D3', 'W3', 'W4', 'W5', 'W6', 'W7']);

/** frosted film: one band = 5 rows; the dark film edge on rows ≡ 0 (mod 5) (the dark-room desk's grain rows) */
export const TPOOL_BAND = 5;
export const TPOOL = {
  W: 480, H: 203,
  WALL_FLOOR_Y: 170,
  CEIL_Y: 16,
  /** the glass door and its frosted sidelights */
  DOOR: {x0: 196, x1: 284, y0: 34, y1: 170},
  SIDELIGHTS: [[174, 192], [288, 306]] as Array<[number, number]>,
  /** where the two shadows stand behind the glass (their centre x), and the shoulders row the shear pivots on */
  SHADOWS: {a: 222, b: 258, headY: 64, pivotY: 104},
};
export interface TpoolState {
  f: number;
  /** the two shadows' drawing: 0 upright, apart · 1 leaning together */
  lean?: 0 | 1;
  /** hide the shadows (an empty room behind the glass) */
  noShadows?: boolean;
}

const microMat = (mb: MatBuf, s: string, x: number, y: number, mat: string, lvl: number) => {
  const sink = new Buf(1, 1, 0);
  const plot = mb.mat(mat, lvl);
  sink.set = (px: number, py: number) => plot(px, py);
  micro(sink, s, x, y, 0);
};

/** the shadow coverage of the two figures on the glass (0..1: 1 = core, ~0.5 = the frosted blur at the edge):
 *  a head, a neck, sloped shoulders and a tapering body each; the lean is an integer row-shear toward each other */
const shadowAt = (x: number, y: number, lean: 0 | 1) => {
  const S = TPOOL.SHADOWS;
  const fig = (cx0: number, dir: number) => {
    const cx = cx0 + (lean && y < S.pivotY ? dir * Math.floor((S.pivotY - y) / 8) : 0);
    const dx = Math.abs(x - cx);
    const dh = ((x - cx) / 6) ** 2 + ((y - S.headY) / 8) ** 2;
    if (dh <= 1) return 1;
    if (dh <= 1.5) return 0.5;
    const ny = S.headY + 7;
    if (y > ny && y < ny + 6 && dx <= 2.5) return 1;
    const sy = ny + 5;
    if (y >= sy) {
      // sloped shoulders out to 10 px, then the body tapers slightly toward the floor
      const hw = y < sy + 6 ? 4 + (y - sy) : 10 - Math.max(0, (y - sy - 40) * 0.05);
      if (dx <= hw) return 1;
      if (dx <= hw + 1.5) return 0.5;
    }
    return 0;
  };
  return Math.max(fig(S.a, 1), fig(S.b, -1));
};

// ------------------------------------------------------------------ the corridor (wide)
const paintCorridor = (mb: MatBuf, s: TpoolState) => {
  const T = TPOOL, f = s.f;
  const lean = s.lean ?? 0;
  // drop ceiling with one fluorescent panel (a tube pair behind a prismatic diffuser)
  rect(0, 0, 480, T.CEIL_Y, mb.mat('tp.ceil', 0.4));
  for (let x = 0; x < 480; x += 40) rect(x, 0, 1, T.CEIL_Y, mb.mat('tp.ceil', -1));
  rect(0, T.CEIL_Y - 1, 480, 1, mb.mat('tp.ceil', -1.4));
  for (let x = 200; x < 280; x++) for (let y = 3; y < 11; y++) mb.emit(y === 3 || y === 10 ? PAL.P1 : (x + y) % 2 ? PAL.P2 : PAL.W9)(x, y);
  // walls: beige, a chair rail, a vinyl base
  rect(0, T.CEIL_Y, 480, T.WALL_FLOOR_Y - T.CEIL_Y, mb.mat('tp.wall', 0));
  for (let y = T.CEIL_Y; y < T.WALL_FLOOR_Y; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 13) < 0.025) mb.shade(-0.5)(x, y);
  rect(0, 112, 480, 2, mb.mat('tp.wall', 1.2)); rect(0, 114, 480, 1, mb.mat('tp.wall', -1));
  rect(0, T.WALL_FLOOR_Y - 5, 480, 5, mb.mat('tp.carpet', -0.8));
  rect(0, T.WALL_FLOOR_Y - 5, 480, 1, mb.shade(1.2));
  // carpet tiles: 2005 grey, a quarter-turned pile (alternate tiles a rung apart), in mild perspective
  rect(0, T.WALL_FLOOR_Y, 480, RH - T.WALL_FLOOR_Y, mb.mat('tp.carpet', 0.4));
  const VPY = -140;
  for (let y = T.WALL_FLOOR_Y; y < RH; y++) for (let x = 0; x < 480; x++) {
    const t = (y - VPY) / (T.WALL_FLOOR_Y - VPY), xw = 240 + (x - 240) / t;
    const row = Math.floor((y - T.WALL_FLOOR_Y) / (8 + (y - T.WALL_FLOOR_Y) * 0.3));
    if ((Math.floor((xw + 480) / 36) + row) % 2) mb.shade(-0.5)(x, y);
    if (hash(x, y, 7) < 0.06) mb.shade(0.5)(x, y);
  }
  // ---- the door: an aluminium frame, frosted sidelights, the glass door with a long pull ----
  const D = T.DOOR;
  rect(170, D.y0 - 6, 140, 6, mb.mat('tp.alu', 0.6)); rect(170, D.y0 - 6, 140, 1, mb.shade(1.4));
  for (const [x0, x1] of [[170, 174], [192, 196], [284, 288], [306, 310]] as Array<[number, number]>) { rect(x0, D.y0, x1 - x0, D.y1 - D.y0, mb.mat('tp.alu', 0.4)); rect(x0, D.y0, 1, D.y1 - D.y0, mb.shade(1.2)); }
  const glass = (x0: number, x1: number) => {
    for (let y = D.y0; y < D.y1; y++) for (let x = x0; x < x1; x++) {
      // the room beyond glows warm through the film: brighter at the middle, the frosted bands on top
      const u = Math.abs(x - 240) / 90, v = (y - D.y0) / (D.y1 - D.y0);
      let L = 0.66 - u * 0.2 - Math.abs(v - 0.4) * 0.3 + (bayer(x, y) - 0.5) * 0.14;
      const band = y % TPOOL_BAND;
      if (band === 0) L -= 0.16; // the film's dark edge (rows ≡ 0 mod 5)
      else if (band <= 2) L += 0.08; // frosted
      if (!s.noShadows) { const k = shadowAt(x, y, lean); if (k >= 1 || (k > 0 && bayer(x, y) < k)) L -= 0.26; } // the shadows behind it
      const c = L > 0.62 ? PAL.W7 : L > 0.52 ? PAL.W6 : L > 0.42 ? PAL.W5 : L > 0.32 ? PAL.W4 : L > 0.22 ? PAL.W3 : PAL.D3;
      mb.emit(c)(x, y);
    }
  };
  glass(T.SIDELIGHTS[0][0], T.SIDELIGHTS[0][1]);
  glass(T.SIDELIGHTS[1][0], T.SIDELIGHTS[1][1]);
  glass(D.x0, D.x1);
  // the door's own stiles + a long steel pull; the threshold
  rect(D.x0, D.y0, 3, D.y1 - D.y0, mb.mat('tp.alu', 1)); rect(D.x1 - 3, D.y0, 3, D.y1 - D.y0, mb.mat('tp.alu', 0.2));
  rect(D.x0, D.y1 - 10, D.x1 - D.x0, 10, mb.mat('tp.alu', 0.6)); rect(D.x0, D.y1 - 10, D.x1 - D.x0, 1, mb.shade(1.4));
  rect(D.x1 - 12, 82, 3, 42, mb.mat('tp.alu', 2)); rect(D.x1 - 12, 82, 1, 42, mb.shade(1));
  rect(160, D.y1, 160, 2, mb.mat('tp.alu', 0.8));
  // light leaking under the door and the warm spill on the carpet
  for (let x = D.x0 + 2; x < D.x1 - 2; x++) mb.emit(x % 5 ? PAL.W6 : PAL.W5)(x, D.y1 + 2);
  // ---- beside it: a room plate, a ficus in a pot, a water cooler (2005) ----
  rect(318, 76, 34, 12, mb.mat('tp.alu', 0.8)); rect(318, 76, 34, 1, mb.shade(1.4));
  microMat(mb, 'BOARDROOM', 320, 80, 'black', 0.6);
  { // ficus
    const px = 120;
    poly([px - 10, 150, px + 10, 150, px + 8, T.WALL_FLOOR_Y + 4, px - 8, T.WALL_FLOOR_Y + 4], mb.mat('tp.alu', -0.6));
    line(px, 150, px - 2, 96, mb.mat('wood', 0.4));
    for (let k = 0; k < 26; k++) {
      const a = hash(k, 1, 31) * Math.PI * 2, r = 6 + hash(k, 2, 31) * 20;
      ellipse(px + Math.cos(a) * r, 104 + Math.sin(a) * r * 0.7 - (hash(k, 3, 31) * 10), 3.2, 2, mb.mat('plant', 0.6 + (k % 3) * 0.4));
    }
  }
  { // water cooler: a blue bottle on a white stand, a tiny tap
    const wx = 390;
    rect(wx - 11, 110, 22, T.WALL_FLOOR_Y - 110, mb.mat('tp.ceil', 1.2)); rect(wx - 11, 110, 22, 1, mb.shade(1.4));
    rect(wx - 11, 110, 1, T.WALL_FLOOR_Y - 110, mb.shade(1));
    ellipse(wx, 96, 10, 14, mb.mat('tp.alu', 1.2)); // bottle (steel-blue in this ramp)
    for (let y = 86; y < 108; y += 5) rect(wx - 9, y, 18, 1, mb.shade(1.2));
    rect(wx - 3, 124, 3, 3, mb.mat('red', 1)); rect(wx + 2, 124, 3, 3, mb.mat('plant', 1.4));
  }
  // a framed print (an abstract swoosh: no words)
  rect(28, 44, 52, 36, mb.mat('tp.alu', 0.2)); rect(31, 47, 46, 30, mb.mat('tp.ceil', 1.6));
  for (let x = 34; x < 74; x++) mb.mat('tp.carpet', 1.4)(x, Math.round(66 - Math.sin((x - 34) / 40 * Math.PI) * 12));
  void f;
};

const corridorLights = (): Lights => ({
  amb: (x, y) => 3.6 - Math.max(0, ((x - 240) / 240) ** 2 + ((y - 101) / 112) ** 2 - 0.45) * 2 - (y > TPOOL.WALL_FLOOR_Y ? 0.4 : 0),
  cyan: () => 0,
  warm: (x, y) => {
    // the boardroom's glow through the glass: on the frame, the wall around the door and a pool on the carpet
    const d = Math.hypot((x - 240) / 100, (y - 100) / 90);
    let L = d < 1 ? (1 - d) * 0.36 : 0;
    if (y > TPOOL.WALL_FLOOR_Y) { const q = Math.hypot((x - 240) / 90, (y - TPOOL.WALL_FLOOR_Y - 6) / 14); if (q < 1) L = Math.max(L, (1 - q) * 0.8); }
    return L;
  },
  dither: 0.5,
});

/** The corridor wide, in BASE (the scene shows it through EARLYWEB16). */
export const drawTpoolDoor = (b: Buf, st: TpoolState) => {
  const mb = new MatBuf(480, RH);
  paintCorridor(mb, st);
  resolve(mb, corridorLights(), b, 0);
};

// ------------------------------------------------------------------ the close (26.13): the frosted bands
/** The glass, close: the frosted bands fill the room area, the dark film edge on rows ≡ 0 (mod 5), the warm
 *  room glowing behind and the shadows' edge drifting through one side. A render front back to BASE lands these
 *  rows on the dark-room desk's grain (drawDarkDesk). */
export const drawTpoolClose = (b: Buf, st: TpoolState) => {
  const lean = st.lean ?? 1;
  for (let y = 0; y < RH; y++)
    for (let x = 0; x < 480; x++) {
      const band = y % TPOOL_BAND;
      const u = Math.abs(x - 250) / 300, v = Math.abs(y - 96) / 140;
      let L = 0.66 - u * 0.3 - v * 0.2 + (bayer(x, y) - 0.5) * 0.12;
      if (band === 0) L -= 0.2;
      else if (band <= 2) L += 0.1;
      // the shadows, big at this distance: a shoulder edge from the left, a head at the right, leaning
      if (!st.noShadows) {
        const shx = 150 + (lean ? Math.floor(Math.max(0, 120 - y) / 6) : 0);
        const head = ((x - (330 - (lean ? 14 : 0))) / 44) ** 2 + ((y - 70) / 60) ** 2 <= 1;
        if (x < shx - (y > 110 ? (y - 110) * 0.6 : 0) || head) L -= 0.26;
      }
      const c = L > 0.62 ? PAL.W7 : L > 0.52 ? PAL.W6 : L > 0.42 ? PAL.W5 : L > 0.32 ? PAL.W4 : L > 0.22 ? PAL.W3 : PAL.D3;
      b.set(x, y, c);
    }
  // a strip of the aluminium stile at the far left edge (so it reads as the door, close)
  for (let y = 0; y < RH; y++) { b.set(0, y, PAL.G3); b.set(1, y, PAL.G4); b.set(2, y, PAL.G5); b.set(3, y, PAL.G2); }
  void stepColor; void clamp; void microWidth;
};
