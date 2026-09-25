// MR. MAS — shared pixel engine: palette-shaded light zones. (Promoted from src/dev/pixeladv/core/light.ts.)
// The room is painted as (material, level) pairs, not colours. A light pass then walks each
// material's hand-ordered ramp for whichever light dominates that pixel (night / monitor cyan /
// hallway tungsten). Band edges get a narrow ordered-dither seam — the only "gradient" allowed.
import {Buf, Plot, bayer, clamp} from './px';
import {PalName, ramp} from './palette';

export interface Mat { night: number[]; cyan: number[]; warm: number[]; }
const m = (night: PalName[], cyan: PalName[], warm: PalName[]): Mat => ({night: ramp(...night), cyan: ramp(...cyan), warm: ramp(...warm)});

// index 0 = unlit ... 7 = hottest. Hand ordered so each light zone has its own hue logic.
export const MATS: Record<string, Mat> = {
  wall: m(['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']),
  trim: m(['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']),
  floor: m(['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'D1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']),
  wood: m(['N0', 'D0', 'D1', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W6']),
  metal: m(['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N8'], ['N0', 'N1', 'C0', 'C1', 'C3', 'C5', 'C7', 'C9'], ['N0', 'W0', 'W1', 'W2', 'W4', 'W6', 'W8', 'W9']),
  black: m(['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C4'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']),
  paper: m(['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'], ['N1', 'N2', 'C1', 'C2', 'C4', 'C6', 'C8', 'C9'], ['N1', 'W1', 'W2', 'W4', 'W6', 'W7', 'W8', 'W9']),
  plant: m(['N0', 'N1', 'L0', 'L0', 'L1', 'L1', 'L2', 'L2'], ['N0', 'N1', 'L0', 'C0', 'L1', 'C3', 'C5', 'C7'], ['N0', 'L0', 'L0', 'L1', 'L1', 'W4', 'W5', 'W6']),
  red: m(['N0', 'N1', 'R0', 'R0', 'R1', 'R1', 'R2', 'R2'], ['N0', 'N1', 'R0', 'R0', 'R1', 'C3', 'C5', 'C7'], ['N0', 'R0', 'R0', 'R1', 'R2', 'W5', 'W6', 'W7']),
  door: m(['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C5'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W7']),
};
const MAT_LIST = Object.values(MATS);
const MAT_ID: Record<string, number> = {};
Object.keys(MATS).forEach((k, i) => (MAT_ID[k] = i + 1));

/**
 * Register a new lit material (shared engine addition). Ramps are 8 master-palette names, index 0 = unlit,
 * 7 = hottest, one ramp per light (night / monitor cyan / tungsten). Re-defining an existing name is a no-op
 * (first definition wins) so two scenes can't silently fight over a material.
 */
export const defineMat = (name: string, night: PalName[], cyan: PalName[], warm: PalName[]) => {
  if (MAT_ID[name]) return MATS[name];
  const mat = m(night, cyan, warm);
  MATS[name] = mat;
  MAT_LIST.push(mat);
  MAT_ID[name] = MAT_LIST.length;
  return mat;
};

/** Material/level canvas that the room is painted into. */
export class MatBuf {
  w: number; h: number;
  m: Uint8Array; l: Float32Array; e: Uint32Array; eOn: Uint8Array;
  /** per-pixel light gain (0..1) for masking lights (e.g. under the desk, in a shadow). */
  gc: Float32Array; gw: Float32Array;
  constructor(w: number, h: number) {
    this.w = w; this.h = h;
    this.m = new Uint8Array(w * h); this.l = new Float32Array(w * h);
    this.e = new Uint32Array(w * h); this.eOn = new Uint8Array(w * h);
    this.gc = new Float32Array(w * h).fill(1); this.gw = new Float32Array(w * h).fill(1);
  }
  idx(x: number, y: number) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? -1 : (y | 0) * this.w + (x | 0); }
  /** paint a material with a base level offset */
  mat = (name: keyof typeof MATS | string, lvl = 0): Plot => {
    const id = MAT_ID[name];
    return (x, y) => { const i = this.idx(x, y); if (i < 0) return; this.m[i] = id; this.l[i] = lvl; this.eOn[i] = 0; };
  };
  /** shift the level of whatever is already painted */
  shade = (d: number): Plot => (x, y) => { const i = this.idx(x, y); if (i >= 0) this.l[i] += d; };
  /** emissive colour (ignores lighting) */
  emit = (col: number): Plot => (x, y) => { const i = this.idx(x, y); if (i < 0) return; this.e[i] = col; this.eOn[i] = 1; };
  gain = (c: number, w: number): Plot => (x, y) => { const i = this.idx(x, y); if (i < 0) return; this.gc[i] *= c; this.gw[i] *= w; };
}

export interface Lights {
  /** ambient night level 0..7 before lvl offsets */
  amb: (x: number, y: number) => number;
  cyan: (x: number, y: number) => number; // 0..1
  warm: (x: number, y: number) => number; // 0..1
  dither?: number;
}

export const resolve = (mb: MatBuf, L: Lights, out: Buf, oy = 0) => {
  const D = L.dither ?? 0.7;
  for (let y = 0; y < mb.h; y++)
    for (let x = 0; x < mb.w; x++) {
      const i = y * mb.w + x;
      if (mb.eOn[i]) { out.set(x, y + oy, mb.e[i]); continue; }
      const id = mb.m[i];
      if (!id) continue;
      const mat = MAT_LIST[id - 1];
      const lvl = mb.l[i];
      const bz = bayer(x, y) - 0.5;
      const nL = L.amb(x, y) + lvl;
      const cL = L.cyan(x, y) * mb.gc[i] * 7 + lvl;
      const wL = L.warm(x, y) * mb.gw[i] * 7 + lvl;
      // dominant light wins; a small dithered bias makes hue borders interleave instead of hard-cutting
      let r = mat.night, v = nL;
      if (cL + bz * 0.8 > v) { r = mat.cyan; v = cL; }
      if (wL + bz * 0.8 > v) { r = mat.warm; v = wL; }
      const q = clamp(Math.floor(v + bz * D + 0.5), 0, 7);
      out.set(x, y + oy, r[q]);
    }
};
