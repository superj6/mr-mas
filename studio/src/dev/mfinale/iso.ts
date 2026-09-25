// MR. MAS — mfinale: isometric pixel helpers (2:1, pixel-perfect: every face column is filled with an exact
// floor() stair, so edges come out as clean 2-over-1 steps instead of rasterised polygons).
// Light at dusk: the sun has just set screen-left. Left faces take the warm western sky (with a hot rim on
// the leftmost column), right faces sit in violet shade, roofs reflect the upper sky.
import {Buf, bayer, clamp, hash} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {CX} from '../../shared/pixel/cast/bosses';

/**
 * A camera / pop view onto the destination frame. Art is authored in WORLD coords; `set` shifts by the
 * camera, adds a pop offset `dy` and hides whatever has sunk below `clipY` (the tower is still rising out of
 * the ground). It is a Buf so cast code (drawBoss) can draw through it unchanged.
 */
export class View extends Buf {
  dst: Buf; camX: number; camY: number; dy: number; clipY: number;
  constructor(dst: Buf, camX: number, camY: number, dy = 0, clipY = Infinity) {
    super(1, 1, 0);
    this.dst = dst; this.camX = camX; this.camY = camY; this.dy = dy; this.clipY = clipY;
  }
  set(x: number, y: number, col: number) {
    const Y = (y | 0) + this.dy;
    if (Y > this.clipY) return;
    this.dst.set((x | 0) - this.camX, Y - this.camY, col);
  }
  get(x: number, y: number) { return this.dst.get((x | 0) - this.camX, (y | 0) + this.dy - this.camY); }
  with(dy: number, clipY: number) { return new View(this.dst, this.camX, this.camY, dy, clipY); }
}

export interface IsoMat {
  /** lit (left) face, bottom -> top */
  left: number[];
  /** shade (right) face, bottom -> top */
  right: number[];
  /** roof */
  top: number[];
  /** leftmost column + lit roof edge */
  rim?: number;
  /** windows: row pitch, iso column pitch, lit fraction, lit colours, dark colour */
  win?: {rows: number; cols: number; lit: number; on: number[]; off: number; h?: number; seed?: number; skipTop?: number; skipBottom?: number; flicker?: number};
}

/** column range helpers for a box with front-bottom corner (fx, fy), left run L, right run R (iso units) */
export const leftBottom = (fx: number, fy: number, x: number) => fy - Math.floor((fx - x) / 2);
export const rightBottom = (fx: number, fy: number, x: number) => fy - Math.floor((x - fx) / 2);

const rampAt = (r: number[], v: number, x: number, y: number) => r[clamp(Math.floor(v * r.length + (bayer(x, y) - 0.5) * 0.9), 0, r.length - 1)];

/** Isometric box. Returns the roof centre. */
export const isoBox = (b: Buf, fx: number, fy: number, L: number, R: number, h: number, m: IsoMat, f = 0, o: {noTop?: boolean; noLeftWin?: boolean; noRightWin?: boolean} = {}): [number, number] => {
  // left face
  for (let x = fx - 2 * L; x <= fx; x++) {
    const yb = leftBottom(fx, fy, x), yt = yb - h;
    for (let y = yt; y <= yb; y++) b.set(x, y, rampAt(m.left, (yb - y) / Math.max(1, h), x, y));
    if (m.rim !== undefined) { b.set(x, yt, m.rim); if (x === fx - 2 * L) for (let y = yt; y <= yb; y++) if (bayer(x, y) < 0.75 - ((yb - y) / h) * -0.25) b.set(x, y, m.rim); }
  }
  // right face
  for (let x = fx + 1; x <= fx + 2 * R; x++) {
    const yb = rightBottom(fx, fy, x), yt = yb - h;
    for (let y = yt; y <= yb; y++) b.set(x, y, rampAt(m.right, (yb - y) / Math.max(1, h), x, y));
  }
  // the front vertical edge: a 1px crease (light meets shade)
  for (let y = fy - h; y <= fy; y++) b.set(fx, y, m.left[Math.min(m.left.length - 1, 1)]);
  // roof
  if (!o.noTop) isoTop(b, fx, fy - h, L, R, m.top, m.rim);
  // windows
  if (m.win) {
    const w = m.win, wh = w.h ?? 2, sd = w.seed ?? fx * 7;
    const st = Math.floor(f / 6);
    const winAt = (face: number, u: number, row: number) => {
      const r = hash(u * 3 + face, row, sd);
      const flick = (w.flicker ?? 0) > 0 && hash(u + face * 50, row, sd + st * 17) < (w.flicker ?? 0);
      return r < w.lit !== flick ? w.on[Math.floor(hash(u, row + face, sd + 3) * w.on.length)] : w.off;
    };
    const skipT = w.skipTop ?? 4, skipB = w.skipBottom ?? 4;
    if (!o.noLeftWin)
      for (let u = 1; u < L; u += w.cols)
        for (let v = skipB, row = 0; v <= h - skipT; v += w.rows, row++) {
          const c = winAt(0, u, row);
          const x0 = fx - 2 * u, yb = fy - u - v;
          for (let j = 0; j < wh; j++) { b.set(x0, yb - j, c); b.set(x0 - 1, yb - j, c); }
        }
    if (!o.noRightWin)
      for (let u = 1; u < R; u += w.cols)
        for (let v = skipB, row = 0; v <= h - skipT; v += w.rows, row++) {
          const c = winAt(1, u, row);
          const on = c !== w.off;
          const x0 = fx + 2 * u, yb = fy - u - v;
          // shade-side windows read one rung darker
          const cc = on ? c : w.off;
          for (let j = 0; j < wh; j++) { b.set(x0, yb - j, cc); b.set(x0 + 1, yb - j, cc); }
        }
  }
  return [fx - L + R, fy - h - (L + R) / 2];
};

/** Roof rhombus with its front vertex at (fx, ty). */
export const isoTop = (b: Buf, fx: number, ty: number, L: number, R: number, ramp: number[], rim?: number) => {
  for (let x = fx - 2 * L; x <= fx + 2 * R; x++) {
    const yf = x <= fx ? ty - Math.floor((fx - x) / 2) : ty - Math.floor((x - fx) / 2);
    const yb = x <= fx - 2 * L + 2 * R ? ty - L - Math.floor((x - (fx - 2 * L)) / 2) : ty - R - Math.floor((fx + 2 * R - x) / 2);
    for (let y = yb; y <= yf; y++) {
      const v = (yf - y) / Math.max(1, yf - yb);
      b.set(x, y, rampAt(ramp, 1 - v, x, y));
    }
    // parapet: the far edges catch the sky
    b.set(x, yb, ramp[ramp.length - 1]);
    if (rim !== undefined && x <= fx - 2 * L + 2) b.set(x, yb, rim);
  }
};

/** Outline pixels of a roof rhombus (for the cyan ignition), in drawing order left -> right along the front. */
export const roofOutline = (fx: number, ty: number, L: number, R: number): Array<[number, number]> => {
  const pts: Array<[number, number]> = [];
  for (let x = fx - 2 * L; x <= fx + 2 * R; x++) {
    const yb = x <= fx - 2 * L + 2 * R ? ty - L - Math.floor((x - (fx - 2 * L)) / 2) : ty - R - Math.floor((fx + 2 * R - x) / 2);
    pts.push([x, yb]);
  }
  return pts;
};

/** Vertical cylinder (lighthouse shaft, cooling tower slices): per-row radius fn, lit from the left. */
export const isoCyl = (b: Buf, cx: number, y0: number, y1: number, rad: (y: number) => number, ramp: number[], rim?: number, band?: (y: number) => number) => {
  for (let y = y0; y <= y1; y++) {
    const r = rad(y);
    const off = band ? band(y) : 0;
    for (let x = Math.round(cx - r); x <= Math.round(cx + r); x++) {
      const u = (x - (cx - r)) / Math.max(1, 2 * r); // 0 lit edge .. 1 shade edge
      const lit = 1 - Math.pow(u, 0.8);
      let c = ramp[clamp(Math.floor(lit * ramp.length + (bayer(x, y) - 0.5) * 0.9 + off), 0, ramp.length - 1)];
      if (rim !== undefined && x === Math.round(cx - r)) c = rim;
      b.set(x, y, c);
    }
  }
};

// ---------------------------------------------------------------- dusk material presets (master palette + the
// cast's DUSK bridge colours CX.U*, which the bosses already use)
export const U = {U0: CX.U0, U1: CX.U1, U2: CX.U2, U3: CX.U3, U4: CX.U4, U5: CX.U5};

/** darken for reflections (master families step down; the dusk bridge steps along its own ramp) */
const UR = [PAL.N1, CX.U0, CX.U1, CX.U2, CX.U3, CX.U4, CX.U5];
export const darken = (c: number, k = 2) => {
  const i = UR.indexOf(c);
  if (i > 0) return UR[Math.max(0, i - k)];
  return stepSafe(c, -k);
};
const stepSafe = (c: number, k: number) => stepColor(c, k);
