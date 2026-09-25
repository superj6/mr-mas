// MR. MAS — mdinner1: THE WOODROSE, 2015. One long back wall seen from table height, trucked laterally in
// whole pixels. Painted once as (material, level) in WORLD coordinates, then lit every frame by palette ramps
// (dusk night / cool / tungsten) with WORLD-anchored ordered dither, so nothing "shower-doors" while the
// camera trucks. Two layers: the WALL (behind the diners) and the TABLE (in front of their bodies).
//
// Layout (world px, 1120 x 300): sideboard + candelabra | window A | brass THE WOODROSE | GERG | MAS in front of
// the arched central window (the Last Supper halo) | the effigy | ALYI's bay (pilasters + oculus: this wall
// becomes the server cathedral) | the vault door | window D.
import {Buf, bayer, clamp, hash, rect, line, poly, ellipse} from '../../shared/pixel/px';
import {PAL, PalName, ramp} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';

export const WORLD_W = 1120;
export const WORLD_H = 300;
/** back edge of the table top (the diners' sprites put their TABLE_EDGE here) and its front edge */
export const TABLE = {x0: 248, x1: 1080, top: 206, front: 214, hem: 262} as const;
export const WALL_BASE = 236;
export const WIN_A = {x0: 164, x1: 238, y0: 44, y1: 200} as const;
export const WIN_B = {x0: 470, x1: 570, y0: 34, y1: 200, cx: 520, r: 50} as const;
export const WIN_D = {x0: 990, x1: 1064, y0: 44, y1: 200} as const;
export const BAY = {x0: 632, x1: 768, pw: 12, cx: 700, oy: 64, or: 24} as const;
export const SEAT = {gerg: 370, mas: 520, effigy: 590, alyi: 676, vault: 900} as const;
export const PENDANTS = [330, 452, 616, 800, 952];
/** world rect [x, y, w, h] of the brass THE WOODROSE lettering and its rules (the freeze prints it as lettering) */
export const SIGN_RECT: [number, number, number, number] = (() => {
  const tw = textWidth('THE WOODROSE');
  const nx = 358 - Math.round(tw / 2), ny = 66;
  return [nx - 13, ny - 6, tw + 26, 19];
})();
export const CANDLES = [296, 458, 624, 770, 850, 1010];

// ------------------------------------------------------------------ materials: [night, cool, warm] x 8
interface Mat { night: number[]; cool: number[]; warm: number[]; }
const m = (night: PalName[], cool: PalName[], warm: PalName[]): Mat => ({night: ramp(...night), cool: ramp(...cool), warm: ramp(...warm)});
const MATS: Mat[] = [
  m(['N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0'], ['N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0'], ['N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0', 'N0']), // 0 unused
  // 1 walnut (wainscot, pilasters, sideboard, frames)
  m(['N0', 'N0', 'D0', 'D1', 'D1', 'D2', 'D2', 'D3'], ['N0', 'N1', 'N2', 'N3', 'C0', 'C1', 'C2', 'C3'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4']),
  // 2 plaster (upper wall: warm taupe in the dark)
  m(['N0', 'N1', 'N1', 'N2', 'N3', 'X0', 'X1', 'X1'], ['N0', 'N1', 'N2', 'N3', 'N4', 'C0', 'C1', 'C2'], ['N1', 'X0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W5']),
  // 3 linen (tablecloth)
  m(['N1', 'N2', 'N3', 'N4', 'N5', 'X2', 'X3', 'P0'], ['N2', 'N3', 'N4', 'N5', 'N6', 'C4', 'C6', 'C8'], ['N2', 'X1', 'X2', 'X3', 'P0', 'P1', 'P2', 'W8']),
  // 4 brass
  m(['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['D0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']),
  // 5 floor (dark oak)
  m(['N0', 'N0', 'N1', 'D0', 'D0', 'D1', 'D1', 'D2'], ['N0', 'N0', 'N1', 'N2', 'C0', 'C0', 'C1', 'C2'], ['N0', 'D0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3']),
  // 6 iron (pendant shades, candelabra, mullions)
  m(['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C4'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']),
  // 7 wine velvet (the sideboard runner, chair cushions)
  m(['N0', 'N0', 'R0', 'R0', 'R0', 'R1', 'R1', 'R2'], ['N0', 'N1', 'R0', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'R0', 'R0', 'R1', 'R1', 'R2', 'W4', 'W5']),
  // 8 teal (the runner = the thread, lying flat)
  m(['N0', 'N1', 'C0', 'C0', 'C1', 'C1', 'C2', 'C2'], ['N0', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'], ['N0', 'C0', 'C0', 'C1', 'C1', 'C2', 'C3', 'C4']),
];
const MAT = {walnut: 1, plaster: 2, linen: 3, brass: 4, floor: 5, iron: 6, wine: 7, teal: 8} as const;
type MatName = keyof typeof MAT;

/** Material/level canvas in world coordinates (+ emissive colours). */
export class WorldMat {
  w: number; h: number; m: Uint8Array; l: Float32Array; e: Uint32Array; eOn: Uint8Array;
  constructor(w = WORLD_W, h = WORLD_H) {
    this.w = w; this.h = h;
    this.m = new Uint8Array(w * h); this.l = new Float32Array(w * h); this.e = new Uint32Array(w * h); this.eOn = new Uint8Array(w * h);
  }
  i(x: number, y: number) { x |= 0; y |= 0; return x < 0 || y < 0 || x >= this.w || y >= this.h ? -1 : y * this.w + x; }
  mat = (name: MatName, lvl = 0) => (x: number, y: number) => { const i = this.i(x, y); if (i < 0) return; this.m[i] = MAT[name]; this.l[i] = lvl; this.eOn[i] = 0; };
  shade = (d: number) => (x: number, y: number) => { const i = this.i(x, y); if (i >= 0 && this.m[i]) this.l[i] += d; };
  emit = (col: number) => (x: number, y: number) => { const i = this.i(x, y); if (i < 0) return; this.e[i] = col; this.eOn[i] = 1; this.m[i] = 0; };
}

// ------------------------------------------------------------------ lights
export interface SetLight {
  /** tungsten level 0..1 at a world pixel */
  warm: (x: number, y: number) => number;
  /** cool (dusk / machine) level 0..1 */
  cool: (x: number, y: number) => number;
  /** ambient night level (0..7, before material offsets) */
  amb: (x: number, y: number) => number;
}

/**
 * Resolve a world layer into the 480x270 frame at camera (cx, cy). Dither is anchored to WORLD pixels.
 * Only pixels the layer actually painted are written (so the table layer composites over the diners).
 */
export const resolveWindow = (wm: WorldMat, L: SetLight, out: Buf, cx: number, cy: number) => {
  for (let y = 0; y < out.h; y++) {
    const wy = y + cy;
    if (wy < 0 || wy >= wm.h) continue;
    for (let x = 0; x < out.w; x++) {
      const wx = x + cx;
      if (wx < 0 || wx >= wm.w) continue;
      const i = wy * wm.w + wx;
      if (wm.eOn[i]) { out.set(x, y, wm.e[i]); continue; }
      const id = wm.m[i];
      if (!id) continue;
      const mt = MATS[id];
      const lvl = wm.l[i];
      const bz = bayer(wx, wy) - 0.5;
      const nL = L.amb(wx, wy) + lvl;
      const kL = L.cool(wx, wy) * 7 + lvl;
      const wL = L.warm(wx, wy) * 7 + lvl;
      let r = mt.night, v = nL;
      if (kL + bz * 0.8 > v) { r = mt.cool; v = kL; }
      if (wL + bz * 0.8 > v) { r = mt.warm; v = wL; }
      out.set(x, y, r[clamp(Math.floor(v + bz * 0.8 + 0.5), 0, 7)]);
    }
  }
};

// ------------------------------------------------------------------ dusk sky (shared by every window)
const SKY: number[] = [PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.X1, PAL.X2, PAL.X3, PAL.W4];
const skyAt = (x: number, y: number) => {
  const t = clamp((y - 30) / 160, 0, 1);
  const v = Math.pow(t, 1.35) * 7 + (bayer(x, y) - 0.5) * 0.9;
  return SKY[clamp(Math.floor(v + 0.5), 0, 7)];
};
/** Sand-Hill dusk: sky bands, a far ridge, rolling hills, valley-oak silhouettes, one early star. */
const paintWindowView = (wm: WorldMat, x0: number, x1: number, y0: number, y1: number, inside: (x: number, y: number) => boolean) => {
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      if (!inside(x, y)) continue;
      let c = skyAt(x, y);
      const ridge = 176 + Math.round(Math.sin(x / 37) * 3 + Math.sin(x / 13 + 1) * 1.5);
      const hill = 184 + Math.round(Math.sin(x / 61 + 2) * 4 + Math.sin(x / 19) * 1.2);
      if (y >= ridge) c = y === ridge ? PAL.X1 : PAL.N4;
      if (y >= hill) c = y === hill ? PAL.N3 : PAL.N2;
      wm.emit(c)(x, y);
    }
  // valley oaks: broad low canopies on short trunks, hand-placed clusters
  const oaks: Array<[number, number, number]> = [[180, 183, 9], [214, 186, 6], [486, 186, 8], [548, 184, 11], [1004, 185, 8], [1046, 186, 6]];
  for (const [ox, oy, r] of oaks) {
    if (ox < x0 - r || ox > x1 + r) continue;
    const put = (x: number, y: number) => { if (x >= x0 && x <= x1 && y >= y0 && y <= y1 && inside(x, y)) wm.emit(PAL.N1)(x, y); };
    for (let j = -Math.ceil(r * 0.6); j <= 0; j++)
      for (let i = -r; i <= r; i++) {
        const e = (i / r) ** 2 + (j / (r * 0.62)) ** 2;
        if (e > 1) continue;
        if (e > 0.72 && hash(ox + i, oy + j, 3) < 0.45) continue; // leafy edge
        put(ox + i, oy + j - 3);
      }
    for (let j = -3; j <= 4; j++) put(ox, oy + j);
    put(ox - 1, oy + 2); put(ox + 1, oy + 1);
  }
};

// ------------------------------------------------------------------ static paint (cached)
let WALL: WorldMat | null = null;
let TAB: WorldMat | null = null;

const paintWall = (): WorldMat => {
  const wm = new WorldMat();
  // ceiling band + crown molding
  rect(0, 0, WORLD_W, 16, wm.mat('walnut', -2.5));
  for (let x = 0; x < WORLD_W; x += 56) rect(x, 0, 6, 16, wm.mat('walnut', -1.6));
  rect(0, 16, WORLD_W, 1, wm.mat('walnut', 1.4));
  rect(0, 17, WORLD_W, 3, wm.mat('walnut', 0.2));
  rect(0, 20, WORLD_W, 1, wm.mat('walnut', -1.2));
  rect(0, 21, WORLD_W, 2, wm.mat('brass', -1.5));
  // upper wall: plaster with a faint damask (two levels, never a hard pattern)
  for (let y = 23; y < 150; y++)
    for (let x = 0; x < WORLD_W; x++) {
      wm.mat('plaster', 0)(x, y);
      const u = ((x % 14) + 14) % 14, v = ((y - 23) % 20 + 20) % 20;
      const dx = Math.abs(u - 7), dy = Math.abs(v - 10);
      if ((dx + dy === 6 || (dx === 0 && dy < 2)) && hash(x, y, 9) < 0.55) wm.shade(-0.45)(x, y);
    }
  // chair rail + wainscot + baseboard
  rect(0, 150, WORLD_W, 1, wm.mat('walnut', 1.6));
  rect(0, 151, WORLD_W, 3, wm.mat('walnut', 0.6));
  rect(0, 154, WORLD_W, 1, wm.mat('walnut', -1.4));
  rect(0, 155, WORLD_W, WALL_BASE - 155 - 8, wm.mat('walnut', -0.2));
  for (let px = 4; px < WORLD_W; px += 44) {
    rect(px, 161, 36, 1, wm.shade(1));
    rect(px, 161, 1, 58, wm.shade(0.9));
    rect(px, 219, 37, 1, wm.shade(-1.2));
    rect(px + 36, 161, 1, 59, wm.shade(-1.2));
  }
  rect(0, WALL_BASE - 8, WORLD_W, 1, wm.mat('walnut', 1.2));
  rect(0, WALL_BASE - 7, WORLD_W, 6, wm.mat('walnut', -0.6));
  rect(0, WALL_BASE - 1, WORLD_W, 1, wm.mat('walnut', -2));
  // floor: dark oak boards converging on a far vanishing point, sheen rows near the camera
  for (let y = WALL_BASE; y < WORLD_H; y++)
    for (let x = 0; x < WORLD_W; x++) {
      wm.mat('floor', -0.4 + (y - WALL_BASE) * 0.012)(x, y);
      if (hash(x >> 3, y, 13) < 0.06) wm.shade(0.5)(x, y);
    }
  for (let xb = -600; xb < WORLD_W + 600; xb += 15) {
    const x2 = 560 + (xb - 560) * 2.6;
    line(xb, WALL_BASE, Math.round(x2), WORLD_H, wm.shade(-1.2));
  }

  // ---- tall French windows (A, D) and the arched central window (B) behind Mas
  const frameWin = (x0: number, x1: number, y0: number, y1: number, arch: {cx: number; r: number} | null) => {
    const inside = (x: number, y: number) => {
      if (x < x0 || x > x1 || y > y1) return false;
      if (arch) { const top = arch.r + y0; if (y < top) return (x + 0.5 - arch.cx) ** 2 + (y + 0.5 - top) ** 2 <= arch.r * arch.r; }
      return y >= y0;
    };
    // casing (walnut), 4px, lit lip inside
    for (let y = y0 - 5; y <= y1 + 1; y++)
      for (let x = x0 - 5; x <= x1 + 5; x++) {
        if (inside(x, y)) continue;
        let near = false;
        for (let k = 1; k <= 5 && !near; k++) if (inside(x + k, y) || inside(x - k, y) || inside(x, y + k) || inside(x, y - k)) near = true;
        if (near) wm.mat('walnut', 0.4)(x, y);
      }
    paintWindowView(wm, x0, x1, y0, y1, inside);
    // mullions (iron): one vertical, transoms every ~40 px
    const midX = Math.round((x0 + x1) / 2);
    for (let y = y0; y <= y1; y++) if (inside(midX, y)) { wm.mat('iron', 0)(midX, y); wm.mat('iron', -1)(midX + 1, y); }
    for (let ty = y1 - 42; ty > y0 + 10; ty -= 42) for (let x = x0; x <= x1; x++) if (inside(x, ty)) { wm.mat('iron', 0)(x, ty); wm.mat('iron', -1)(x, ty + 1); }
    if (arch) {
      // radial glazing bars in the fanlight
      const top = arch.r + y0;
      for (const a of [-0.55, 0, 0.55]) for (let t = 6; t < arch.r; t++) { const x = Math.round(arch.cx + Math.sin(a) * t), y = Math.round(top - Math.cos(a) * t); if (inside(x, y)) wm.mat('iron', 0)(x, y); }
      for (let k = 0; k < 64; k++) { const a = -Math.PI / 2 + (k / 63) * Math.PI; const x = Math.round(arch.cx + Math.sin(a) * 18), y = Math.round(top - Math.cos(a) * 18); if (inside(x, y)) wm.mat('iron', 0)(x, y); }
      for (let x = x0; x <= x1; x++) if (inside(x, top)) wm.mat('iron', 0)(x, top);
    }
    // sill
    rect(x0 - 7, y1 + 1, x1 - x0 + 15, 2, wm.mat('walnut', 1.4));
    rect(x0 - 6, y1 + 3, x1 - x0 + 13, 2, wm.mat('walnut', -1));
  };
  frameWin(WIN_A.x0, WIN_A.x1, WIN_A.y0, WIN_A.y1, null);
  frameWin(WIN_B.x0, WIN_B.x1, WIN_B.y0, WIN_B.y1, {cx: WIN_B.cx, r: WIN_B.r});
  frameWin(WIN_D.x0, WIN_D.x1, WIN_D.y0, WIN_D.y1, null);
  // one early star over the central window (the halo is the horizon glow behind Mas)
  wm.emit(PAL.P2)(532, 58); wm.emit(PAL.N6)(531, 58); wm.emit(PAL.N6)(533, 58);

  // ---- brass letters on the plaster: THE WOODROSE (with a thin rule above and below)
  const name = 'THE WOODROSE';
  const nx = 358 - Math.round(textWidth(name) / 2), ny = 66;
  const tmp = new Buf(textWidth(name) + 2, 9, 0);
  text(tmp, name, 0, 0, 1);
  for (let j = 0; j < 9; j++) for (let i = 0; i < tmp.w; i++) if (tmp.c[j * tmp.w + i] === 1) { wm.mat('brass', j < 3 ? 3.6 : 3)(nx + i, ny + j); wm.mat('walnut', -2)(nx + i + 1, ny + j + 1); }
  rect(nx - 6, ny - 5, textWidth(name) + 12, 1, wm.mat('brass', 0.6));
  rect(nx - 6, ny + 11, textWidth(name) + 12, 1, wm.mat('brass', 0.6));
  for (const sx of [nx - 10, nx + textWidth(name) + 8]) { ellipse(sx + 0.5, ny + 3.5, 2, 2, wm.mat('brass', 0.8)); wm.shade(1.2)(sx, ny + 2); }

  // ---- the sideboard at the far left (candelabra is drawn live)
  rect(20, 160, 124, 3, wm.mat('walnut', 1.8));
  rect(22, 163, 120, 70, wm.mat('walnut', -0.3));
  for (const dx of [26, 66, 106]) { rect(dx, 168, 32, 50, wm.shade(-0.6)); rect(dx, 168, 32, 1, wm.shade(1.2)); rect(dx + 15, 190, 2, 4, wm.mat('brass', 1)); }
  rect(24, 233, 4, 3, wm.mat('walnut', -1.5)); rect(136, 233, 4, 3, wm.mat('walnut', -1.5));
  rect(30, 158, 104, 2, wm.mat('wine', 0.5));

  // ---- ALYI's bay: two fluted pilasters and a round oculus window (the wall that becomes the cathedral)
  for (const px of [BAY.x0, BAY.x1 - BAY.pw]) {
    rect(px, 23, BAY.pw, WALL_BASE - 23, wm.mat('walnut', 0.2));
    rect(px, 23, 1, WALL_BASE - 23, wm.shade(1.2));
    rect(px + BAY.pw - 1, 23, 1, WALL_BASE - 23, wm.shade(-1.3));
    for (let k = 3; k < BAY.pw - 2; k += 3) rect(px + k, 40, 1, 150, wm.shade(-0.8));
    rect(px - 2, 23, BAY.pw + 4, 6, wm.mat('walnut', 0.9)); rect(px - 2, 29, BAY.pw + 4, 1, wm.shade(-1.4)); // capital
    rect(px - 2, 212, BAY.pw + 4, 24, wm.mat('walnut', 0.5)); // plinth
  }
  // the oculus: a round window with a spoked iron frame (dusk through it, until the wall lights)
  const oin = (x: number, y: number) => (x + 0.5 - BAY.cx) ** 2 + (y + 0.5 - BAY.oy) ** 2 <= BAY.or * BAY.or;
  for (let y = BAY.oy - BAY.or - 6; y <= BAY.oy + BAY.or + 6; y++)
    for (let x = BAY.cx - BAY.or - 6; x <= BAY.cx + BAY.or + 6; x++) {
      const d = Math.hypot(x + 0.5 - BAY.cx, y + 0.5 - BAY.oy);
      if (d <= BAY.or + 5 && d > BAY.or) wm.mat('walnut', d < BAY.or + 1.5 ? 1.4 : d > BAY.or + 4 ? -1.2 : 0.3)(x, y);
    }
  paintWindowView(wm, BAY.cx - BAY.or, BAY.cx + BAY.or, BAY.oy - BAY.or, BAY.oy + BAY.or, oin);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    for (let t = 6; t < BAY.or; t++) wm.mat('iron', 0)(Math.round(BAY.cx + Math.cos(a) * t), Math.round(BAY.oy + Math.sin(a) * t));
  }
  ellipse(BAY.cx, BAY.oy, 6, 6, wm.mat('iron', 0));
  ellipse(BAY.cx, BAY.oy, 3.5, 3.5, wm.mat('iron', 1));
  // recessed panel in the bay: a darker field (it will open into the nave)
  rect(BAY.x0 + BAY.pw + 6, 96, BAY.x1 - BAY.x0 - 2 * BAY.pw - 12, 112, wm.shade(-0.8));
  rect(BAY.x0 + BAY.pw + 6, 96, BAY.x1 - BAY.x0 - 2 * BAY.pw - 12, 1, wm.shade(1.4));
  return wm;
};

const paintTable = (): WorldMat => {
  const wm = new WorldMat();
  const {x0, x1, top, front, hem} = TABLE;
  // top surface (seen from just above table height: an 8 px sliver)
  for (let y = top; y < front; y++) for (let x = x0; x <= x1; x++) wm.mat('linen', 1.2 + (y - top) * 0.1)(x, y);
  // the runner: the thread, lying flat, the whole length of the table
  rect(x0 + 10, top + 3, x1 - x0 - 20, 2, wm.mat('teal', 1));
  rect(x0 + 10, top + 5, x1 - x0 - 20, 1, wm.mat('teal', -0.4));
  // front edge + drape with folds and a scalloped hem
  rect(x0, front, x1 - x0 + 1, 1, wm.mat('linen', 1.6));
  for (let y = front + 1; y <= hem; y++)
    for (let x = x0; x <= x1; x++) {
      const k = ((x - x0 + Math.floor(hash(Math.floor((x - x0) / 23), 1, 3) * 6)) % 23 + 23) % 23;
      wm.mat('linen', -1.2 - (y - front) * 0.035 + (y === hem ? 0.6 : 0) + (y < front + 3 ? 0.9 : 0))(x, y);
      if (k === 11) wm.shade(-1.1)(x, y);
      else if (k === 12 || k === 10) wm.shade(-0.5)(x, y);
      else if (k === 14) wm.shade(0.4)(x, y);
    }
  // the table's left end: the cloth's side falls in shadow
  for (let y = top; y <= hem + 1; y++) for (let x = x0 - 6; x < x0; x++) if (y >= top + (x0 - x)) wm.mat('linen', -2.2 - (y - top) * 0.02)(x, y);
  // the dark gap under the hem, and the floor line at the table's feet
  rect(x0 - 6, hem + 1, x1 - x0 + 7, 6, wm.mat('floor', -3));
  return wm;
};

export const wallLayer = () => (WALL ??= paintWall());
export const tableLayer = () => (TAB ??= paintTable());

// ------------------------------------------------------------------ the light rig for a frame
export interface LightState {
  /** world clock (candle flicker) */
  w: number;
  /** 0..1: the cathedral's cool glow around ALYI's bay */
  cath: number;
  /** 0..1: the effigy fire */
  fire: number;
}
const pool = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => {
  const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
  return d >= 1 ? 0 : 1 - d;
};
export const setLights = (s: LightState): SetLight => {
  const flick = [1, 0.97, 1.02, 0.99][Math.floor(s.w / 2) % 4];
  const fireFl = [1, 0.9, 1.06, 0.95][Math.floor(s.w / 2) % 4];
  return {
    amb: (_x, y) => (y < 23 ? 0.6 : y < 150 ? 1.3 : y < WALL_BASE ? 1.2 : 1.0),
    warm: (x, y) => {
      // tungsten fill: the whole room is candle/pendant lit; only the ceiling and far corners fall to night
      let v = y < 23 ? 0.1 : y < 150 ? 0.2 : y < TABLE.top ? 0.28 : y < TABLE.front ? 0.5 : y <= TABLE.hem ? 0.4 - (y - TABLE.front) * 0.004 : 0.16;
      for (const px of PENDANTS) {
        // the dome throws light DOWN: a soft trapezoid on the wall under the lamp, a pool on the table
        v = Math.max(v, pool(x, y, px, 150, 60, 70) * 0.5, pool(x, y, px, 210, 70, 14) * 1.0);
      }
      for (const cx of CANDLES) v = Math.max(v, pool(x, y, cx, 204, 40, 16) * 0.95 * flick, pool(x, y, cx, 196, 26, 34) * 0.7 * flick, pool(x, y, cx, 222, 30, 30) * 0.62 * flick);
      if (s.fire > 0) v = Math.max(v, pool(x, y, SEAT.effigy, 196, 96, 70) * s.fire * fireFl);
      // the sideboard candelabra
      v = Math.max(v, pool(x, y, 84, 140, 70, 60) * 0.8 * flick);
      return clamp(v, 0, 1);
    },
    cool: (x, y) => {
      let v = 0;
      // dusk spill at the window sills
      for (const [a, b] of [[WIN_A.x0, WIN_A.x1], [WIN_B.x0, WIN_B.x1], [WIN_D.x0, WIN_D.x1]]) v = Math.max(v, pool(x, y, (a + b) / 2, 206, (b - a) * 0.7, 10) * 0.55);
      if (s.cath > 0) v = Math.max(v, pool(x, y, BAY.cx, 130, 150, 130) * 0.95 * s.cath);
      return clamp(v, 0, 1);
    },
  };
};

// ------------------------------------------------------------------ live set dressing (direct colour)
/** A pendant lamp: cord from the ceiling, a spun-brass dome, a hot rim underneath. x = centre, y = shade top. */
export const drawPendant = (b: Buf, x: number, y: number) => {
  const rows = [
    '.......ooo.......',
    '......oBbdo......',
    '.....oBBbbdo.....',
    '....oBBbbbbdo....',
    '...oBBbbbbbbdo...',
    '..oBBbbbbbbbbdo..',
    '.oBBbbbbbbbbbbdo.',
    'oBBbbbbbbbbbbbbdo',
    'oWWWWWWWWWWWWWWWo',
    '.oyYYYYYYYYYYYyo.',
    '...yyYYYYYYYyy...',
  ];
  const pal: Record<string, number> = {o: PAL.N0, B: PAL.W4, b: PAL.W2, d: PAL.W1, W: PAL.W6, Y: PAL.W9, y: PAL.W7};
  for (let j = 0; j < y - 3; j++) b.set(x, j, PAL.N1);
  rect(x - 1, y - 3, 3, 3, b.ink(PAL.W1));
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 8 + i, y + j, c); } });
};

/** A taper in a brass stick (flame: 3 drawings, held 2). (x, y) = the base on the table. */
export const drawCandle = (b: Buf, x: number, y: number, w: number, frozen = false) => {
  rect(x - 1, y - 10, 3, 9, b.ink(PAL.P1));
  b.set(x - 1, y - 10, PAL.P2); rect(x - 1, y - 9, 1, 8, b.ink(PAL.P2));
  rect(x + 1, y - 9, 1, 8, b.ink(PAL.P0));
  rect(x - 2, y - 2, 5, 1, b.ink(PAL.W5));
  rect(x - 1, y - 1, 3, 1, b.ink(PAL.W3));
  rect(x - 3, y, 7, 1, b.ink(PAL.W4));
  b.set(x - 2, y, PAL.W6);
  const k = frozen ? 0 : Math.floor(w / 2) % 3;
  const flames = [['.W.', 'WYW', 'YyY', '.y.', '.k.'], ['.W..', '.WW.', 'WYW.', '.y..', '.k..'], ['..W.', '.WW.', '.WYW', '..y.', '.k..']];
  const fp: Record<string, number> = {W: PAL.W7, Y: PAL.W9, y: PAL.W5, k: PAL.N1};
  flames[k].forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = fp[r[i]]; if (c !== undefined) b.set(x - 1 + i, y - 15 + j, c); } });
};

/** Stemmed wine glass (6x10): rim glint, wine at the bowl's bottom, stem, foot. */
export const drawGlass = (b: Buf, x: number, y: number, wine = true, glint = 0) => {
  const rows = wine
    ? ['g....h', 'o....o', 'o....o', 'oRRRro', '.oRro.', '..oo..', '..o...', '..o...', '..o...', '.oooo.']
    : ['g....h', 'o....o', 'o....o', 'o....o', '.o..o.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'];
  const pal: Record<string, number> = {o: PAL.N5, g: glint ? PAL.W9 : PAL.W7, h: PAL.N6, R: PAL.R1, r: PAL.R2};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 3 + i, y - 9 + j, c); } });
};

/** A low plate on the 8px table sliver + a fork and knife. */
export const drawPlace = (b: Buf, x: number, y: number) => {
  rect(x - 7, y, 15, 1, b.ink(PAL.P2));
  rect(x - 8, y + 1, 17, 1, b.ink(PAL.P1));
  rect(x - 7, y + 2, 15, 1, b.ink(PAL.X3));
  b.set(x - 11, y + 1, PAL.P0); b.set(x - 11, y + 2, PAL.P0); b.set(x + 11, y + 1, PAL.P1); b.set(x + 11, y + 2, PAL.P0);
};

/** Bread basket (the one Nole's booster crushes later). */
export const drawBasket = (b: Buf, x: number, y: number) => {
  const rows = ['..LLlLL..', '.LlLLlLl.', 'wWwWwWwWw', '.wWwWwWw.', '..wwwww..'];
  const pal: Record<string, number> = {L: PAL.W6, l: PAL.W4, W: PAL.D4, w: PAL.D2};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 4 + i, y - 4 + j, c); } });
};

/** The sideboard's three-arm candelabra (the crown's glint becomes this flame at the cut). */
export const drawCandelabra = (b: Buf, x: number, y: number, w: number) => {
  rect(x - 1, y - 20, 3, 20, b.ink(PAL.W3));
  b.set(x - 1, y - 20, PAL.W5); rect(x - 1, y - 19, 1, 18, b.ink(PAL.W5));
  rect(x - 5, y, 11, 1, b.ink(PAL.W4)); rect(x - 4, y - 1, 9, 1, b.ink(PAL.W5));
  // arms
  for (const s of [-1, 1]) {
    line(x, y - 14, x + s * 10, y - 18, b.ink(PAL.W4));
    line(x, y - 13, x + s * 10, y - 17, b.ink(PAL.W2));
    rect(x + s * 10 - 1, y - 20, 3, 2, b.ink(PAL.W5));
  }
  const cup = (cx: number, cy: number, k: number) => {
    drawCandle(b, cx, cy, w + k * 3);
  };
  cup(x, y - 20, 0); cup(x - 10, y - 20, 1); cup(x + 10, y - 20, 2);
};

/** Warm, stepped glow around a flame (dithered rings on top of whatever is there). */
export const flameGlow = (b: Buf, x: number, y: number, r: number, wx: number, wy: number) => {
  for (let j = -r; j <= r; j++)
    for (let i = -r; i <= r; i++) {
      const d = Math.hypot(i, j * 1.2) / r;
      if (d > 1) continue;
      const X = x + i, Y = y + j;
      const c = b.get(X, Y);
      const bz = bayer(X + wx, Y + wy);
      if (d < 0.5 || bz < (1 - d) * 0.9) {
        // lift the pixel one rung along a warm bridge
        const lift: Record<number, number> = {[PAL.N0]: PAL.W0, [PAL.N1]: PAL.W0, [PAL.N2]: PAL.W1, [PAL.X0]: PAL.W1, [PAL.X1]: PAL.W2, [PAL.W0]: PAL.W1, [PAL.W1]: PAL.W2, [PAL.W2]: PAL.W3, [PAL.D0]: PAL.D1, [PAL.D1]: PAL.D2, [PAL.D2]: PAL.D3};
        const n = lift[c];
        if (n !== undefined) b.set(X, Y, n);
      }
    }
};
void poly;

/** An empty bentwood chair back on the far side of the table (world coords in, screen out). */
export const drawFarChair = (b: Buf, x: number, y: number) => {
  // x = centre, y = the top of the back
  const rows = [
    '..oWWWWWo..',
    '.oWddddddo.',
    'oWd.....ddo',
    'od.......do',
    'od.......do',
    'oddddddddd.',
    'od.......do',
    'od.......do',
  ];
  const pal: Record<string, number> = {o: PAL.N0, W: PAL.D4, d: PAL.D2};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 5 + i, y + j, c); } });
  for (let j = 8; j < 40; j++) { b.set(x - 5, y + j, PAL.N0); b.set(x - 4, y + j, PAL.D2); b.set(x + 4, y + j, PAL.D1); b.set(x + 5, y + j, PAL.N0); }
};

/**
 * Foreground: an empty chair on the near side, its back to us, almost on the lens (silhouette + a warm rim
 * from the table beyond). Parallax is the caller's (screen x). yTop = the top rail on screen.
 */
export const drawNearChair = (b: Buf, x: number, yTop: number) => {
  const w = 38;
  const topAt = (i: number) => yTop + Math.round(5 * ((i - w / 2) / (w / 2)) ** 2);
  for (let i = 0; i < w; i++) {
    const t = topAt(i);
    for (let j = t; j < t + 5; j++) b.set(x + i, j, j === t ? PAL.W3 : j === t + 1 ? PAL.W1 : PAL.N0);
  }
  for (let j = 0; j < b.h; j++) {
    for (const px of [0, 1, 2, w - 3, w - 2, w - 1]) { const t = topAt(px); if (yTop + j > t) b.set(x + px, yTop + j, px === 2 || px === w - 1 ? PAL.W0 : PAL.N0); }
  }
  // splats between the rails
  const mid = yTop + 26;
  for (let i = 3; i < w - 3; i++) { b.set(x + i, mid, PAL.N0); b.set(x + i, mid + 1, PAL.N0); b.set(x + i, mid - 1, i % 4 === 0 ? PAL.W1 : PAL.N0); }
  for (const sx of [11, 18, 19, 26]) for (let j = topAt(sx) + 5; j < mid; j++) b.set(x + sx, j, sx === 18 ? PAL.W0 : PAL.N0);
};
