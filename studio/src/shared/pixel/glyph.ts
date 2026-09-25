// MR. MAS — shared pixel engine: GLYPH switch (pure part — no DOM).
// The framebuffer (or a masked region of it, or a different "true world" buffer seen through a mask) is read
// as a grid of cells; each cell becomes one token: a glyph chosen by density (measured at runtime from the
// real font in glyphDraw.ts), coloured from the cell's palette colours. Strong edges become contour glyphs
// (- \ | /). Everything is deterministic (hash-seeded), including the shimmer and the dissolve.
//
// Use glyph for DARK FORESHADOWING only: the machine watching, the future leaking in, people becoming tokens.
import {Buf, hash, clamp} from './px';
import {PAL, lightness} from './palette';
import {Img} from './figure';
import {Mask} from './mask';
import {bayer4} from './dither';
import type {ToneCurve} from './palettes';

export interface GlyphStyle {
  /** native px per glyph cell [w, h]. Default [2, 3] (8x12 output px at 4x: ~the approved glyph density). */
  cell?: [number, number];
  /** OKLab-lightness -> density curve. */
  tone?: ToneCurve;
  /** density below which a cell is left empty (the void). Default 0.05 */
  floor?: number;
  /** contour glyphs on strong edges. Default true */
  edges?: boolean;
  /** Sobel magnitude that counts as an edge. Default 1.1 */
  edgeAt?: number;
  /** colour gain. Default 1 */
  gain?: number;
  /** shadow tokens lean toward this colour (latent machine cyan). Default C6 */
  tint?: number;
  /** 0..1. Default 0.3 */
  tintAmt?: number;
  /** fraction of cells that re-roll their glyph every `shimmerStep` frames. Default 0.06 */
  shimmer?: number;
  shimmerStep?: number;
  seed?: number;
  /** faint tokens in empty cells ("the dark is full of text"). Default 0 */
  noise?: number;
  /** cell fill under glyph regions. Default N0 */
  bg?: number;
  /** 0..1 bloom. Default 0.7 */
  bloom?: number;
  weight?: 400 | 700;
  /** glyph candidates (measured + sorted by ink at runtime). Default TOKEN_GLYPHS */
  chars?: string;
  /** font size as a fraction of cell height at density 0 and 1. Default [0.9, 1.15] */
  size?: [number, number];
}

export const DEFAULT_CELL: [number, number] = [2, 3];
/** Default density curve, tuned for the show's night rooms (walls at OKLab L ~0.2-0.3 still register as faint tokens). */
export const GLYPH_TONE: ToneCurve = {lo: 0.12, hi: 0.62, gamma: 0.8};
export const TOKEN_GLYPHS = " .·'`,:;-~_\"^=+<>/\\|!ilrt1jcvxzsoaeunJ7{}[]()?*%0O&8#$@MW";
export const EDGE_GLYPHS = ['-', '\\', '|', '/'];

export interface Token {
  /** native px, top-left of the token's cell (tokens can leave the grid when they drift) */
  x: number; y: number;
  /** density 0..1 (picks the glyph) */
  v: number;
  /** 0..1 variety among glyphs of similar density */
  pick: number;
  /** -1 none, else index into EDGE_GLYPHS */
  edge: number;
  /** 0xRRGGBB */
  col: number;
  /** 0..1 */
  a: number;
  /** force a specific glyph */
  ch?: string;
}

export interface GlyphLayer {
  tokens: Token[];
  style: GlyphStyle;
  cell: [number, number];
  /** cells (native top-left x,y pairs, flat) to paint with style.bg before tokens — the glyph region */
  fills: number[];
}

const mix = (c: number, d: number, t: number) => {
  const r = ((c >> 16) & 255) * (1 - t) + ((d >> 16) & 255) * t;
  const g = ((c >> 8) & 255) * (1 - t) + ((d >> 8) & 255) * t;
  const b = (c & 255) * (1 - t) + (d & 255) * t;
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
};
const scaleCol = (c: number, k: number) => {
  const f = (v: number) => Math.min(255, Math.round(v * k));
  return (f((c >> 16) & 255) << 16) | (f((c >> 8) & 255) << 8) | f(c & 255);
};

interface CellStat { v: number; col: number; n: number; }

/** Stats for one cell of `src`: density (mean/max blend so 1px rims register) + lightness-weighted colour. */
const cellStat = (px: (i: number, j: number) => number, cw: number, ch: number, tone: ToneCurve): CellStat => {
  let sum = 0, mx = 0, n = 0, wr = 0, wg = 0, wb = 0, ww = 0;
  for (let j = 0; j < ch; j++)
    for (let i = 0; i < cw; i++) {
      const c = px(i, j);
      if (c < 0) continue;
      const L = lightness(c);
      const t = Math.pow(clamp((L - tone.lo) / (tone.hi - tone.lo), 0, 1), tone.gamma);
      sum += t; if (t > mx) mx = t; n++;
      const w = 0.04 + L * L;
      wr += ((c >> 16) & 255) * w; wg += ((c >> 8) & 255) * w; wb += (c & 255) * w; ww += w;
    }
  if (!n) return {v: 0, col: 0, n: 0};
  const v = (sum / n) * 0.62 + mx * 0.38;
  const col = (Math.round(wr / ww) << 16) | (Math.round(wg / ww) << 8) | Math.round(wb / ww);
  return {v, col, n};
};

const tokenColour = (col: number, v: number, s: GlyphStyle) => {
  const gain = (s.gain ?? 1) * (0.62 + 0.95 * v);
  return mix(scaleCol(col, gain), s.tint ?? PAL.C6, (s.tintAmt ?? 0.3) * (1 - v) * 0.8);
};

const pickFor = (cx: number, cy: number, s: GlyphStyle, frame: number) => {
  const seed = s.seed ?? 7;
  const step = Math.floor(frame / Math.max(1, s.shimmerStep ?? 2));
  let pick = hash(cx, cy, seed);
  if ((s.shimmer ?? 0.06) > 0 && hash(cx, cy, seed * 7 + step * 31 + 1) < (s.shimmer ?? 0.06)) pick = hash(cx, cy, seed + step * 13 + 5);
  return pick;
};

/**
 * GLYPH render of `src` (whole frame, or only cells inside `mask`). Cells inside the mask are filled with
 * style.bg and receive tokens; cells outside are left to the pixel image. Soft mask edges resolve per CELL
 * with an ordered threshold, so the glyph region's border is a clean stepped seam.
 */
export const glyphLayer = (src: Buf, style: GlyphStyle = {}, mask?: Mask, frame = 0): GlyphLayer => {
  const [cw, ch] = style.cell ?? DEFAULT_CELL;
  const tone = style.tone ?? GLYPH_TONE;
  const cols = Math.ceil(src.w / cw), rows = Math.ceil(src.h / ch);
  const val = new Float32Array(cols * rows);
  const col = new Uint32Array(cols * rows);
  const inside = new Uint8Array(cols * rows);
  for (let cy = 0; cy < rows; cy++)
    for (let cx = 0; cx < cols; cx++) {
      const k = cy * cols + cx;
      const x0 = cx * cw, y0 = cy * ch;
      if (mask) {
        let m = 0, n = 0;
        for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { m += mask.get(x0 + i, y0 + j); n++; }
        const cov = m / (n * 255);
        if (!(cov >= 0.999 || (cov > 0 && cov > bayer4(cx, cy)))) continue;
      }
      inside[k] = 1;
      const st = cellStat((i, j) => (x0 + i < src.w && y0 + j < src.h ? src.c[(y0 + j) * src.w + x0 + i] : -1), cw, ch, tone);
      val[k] = st.v; col[k] = st.col;
    }
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : val[y * cols + x]);
  const tokens: Token[] = [];
  const fills: number[] = [];
  const floor = style.floor ?? 0.05;
  const edgeAt = style.edgeAt ?? 1.1;
  for (let cy = 0; cy < rows; cy++)
    for (let cx = 0; cx < cols; cx++) {
      const k = cy * cols + cx;
      if (!inside[k]) continue;
      const x = cx * cw, y = cy * ch;
      fills.push(x, y);
      const v = val[k];
      if (v < floor) {
        const nz = style.noise ?? 0;
        if (nz > 0 && hash(cx, cy, (style.seed ?? 7) + 99) < nz * 0.35)
          tokens.push({x, y, v: 0.12 + hash(cy, cx, 3) * 0.2, pick: pickFor(cx, cy, style, frame), edge: -1, col: style.tint ?? PAL.C6, a: 0.1 + hash(cx, cy, 5) * 0.18});
        continue;
      }
      let edge = -1;
      if (style.edges ?? true) {
        const gx = at(cx + 1, cy - 1) + 2 * at(cx + 1, cy) + at(cx + 1, cy + 1) - at(cx - 1, cy - 1) - 2 * at(cx - 1, cy) - at(cx - 1, cy + 1);
        const gy = at(cx - 1, cy + 1) + 2 * at(cx, cy + 1) + at(cx + 1, cy + 1) - at(cx - 1, cy - 1) - 2 * at(cx, cy - 1) - at(cx + 1, cy - 1);
        if (Math.hypot(gx, gy) > edgeAt) {
          let ang = (Math.atan2(gx, -gy) * 180) / Math.PI;
          ang = ((ang % 180) + 180) % 180;
          edge = ang < 22.5 || ang >= 157.5 ? 0 : ang < 67.5 ? 1 : ang < 112.5 ? 2 : 3;
        }
      }
      tokens.push({x, y, v: Math.min(1, v), pick: pickFor(cx, cy, style, frame), edge, col: tokenColour(col[k], v, style), a: 1});
    }
  return {tokens, style, cell: [cw, ch], fills};
};

// ------------------------------------------------------------------------------------------------ dissolve
export interface DissolveOpts extends GlyphStyle {
  /** frame within the transition (0..frames-1; beyond = fully gone, or fully re-formed with reverse) */
  t: number;
  frames: number;
  /** px per frame at full speed. Default [4, -1] (blown off to screen-right, lifting) */
  wind?: [number, number];
  /** side the break starts on. Default: the upwind side */
  from?: 'left' | 'right' | 'top' | 'bottom';
  /** fraction of `frames` over which cells are released. Default 0.45 */
  spread?: number;
  /** frames a cell sits as a glyph before lifting off. Default 3 */
  lead?: number;
  /** frames a token lives once airborne. Default frames * 0.5 */
  life?: number;
  /** run backwards: tokens fly home and snap back to pixels (re-form / "BACK.") */
  reverse?: boolean;
}

/**
 * GLYPH DISSOLVE: a sprite breaks into tokens that drift/blow away (or, with `reverse`, fly back and re-form).
 * Draws the still-solid part of `img` into `fb` at (x, y) and returns the airborne/converted tokens as a
 * GlyphLayer for PixelScene to draw. Do NOT also blit the sprite yourself. Deterministic.
 */
export const glyphDissolve = (fb: Buf, img: Img, x: number, y: number, o: DissolveOpts): GlyphLayer => {
  const [cw, ch] = o.cell ?? DEFAULT_CELL;
  const tone = o.tone ?? GLYPH_TONE;
  const wind = o.wind ?? [4, -1];
  const from = o.from ?? (Math.abs(wind[0]) >= Math.abs(wind[1]) ? (wind[0] >= 0 ? 'left' : 'right') : wind[1] >= 0 ? 'top' : 'bottom');
  const spread = o.spread ?? 0.45;
  const lead = o.lead ?? 3;
  const life = o.life ?? Math.max(6, o.frames * 0.5);
  const seed = o.seed ?? 11;
  const tt = o.reverse ? o.frames - 1 - o.t : o.t;
  const cols = Math.ceil(img.w / cw), rows = Math.ceil(img.h / ch);
  const tokens: Token[] = [];
  const px = (cx: number, cy: number) => (i: number, j: number) => {
    const ix = cx * cw + i, iy = cy * ch + j;
    return ix < img.w && iy < img.h ? img.c[iy * img.w + ix] : -1;
  };
  for (let cy = 0; cy < rows; cy++)
    for (let cx = 0; cx < cols; cx++) {
      const st = cellStat(px(cx, cy), cw, ch, tone);
      if (!st.n) continue;
      const u = from === 'left' ? cx / Math.max(1, cols - 1) : from === 'right' ? 1 - cx / Math.max(1, cols - 1) : from === 'top' ? cy / Math.max(1, rows - 1) : 1 - cy / Math.max(1, rows - 1);
      const h1 = hash(cx, cy, seed), h2 = hash(cy, cx, seed + 1), h3 = hash(cx + 17, cy, seed + 2);
      const conv = Math.floor(o.frames * spread * clamp(u * 0.85 + h1 * 0.15, 0, 1));
      const rel = conv + lead + Math.floor(h2 * 2);
      const L = life * (0.7 + 0.6 * h3);
      const hx = x + cx * cw, hy = y + cy * ch;
      if (tt < conv) {
        // still solid: draw this cell's pixels
        for (let j = 0; j < ch; j++)
          for (let i = 0; i < cw; i++) {
            const c = px(cx, cy)(i, j);
            if (c >= 0) fb.set(hx + i, hy + j, c);
          }
        continue;
      }
      const v0 = Math.max(0.25, st.v);
      const colour = tokenColour(st.col, v0, o);
      if (tt < rel) {
        // converted, not yet airborne: a glyph sits where the pixels were (first frame flashes hot)
        const hot = tt === conv;
        tokens.push({x: hx, y: hy, v: Math.min(1, v0 + (hot ? 0.25 : 0.1)), pick: hash(cx, cy, seed + 3), edge: -1, col: hot ? mix(colour, PAL.C9, 0.5) : colour, a: 1});
        continue;
      }
      const age = tt - rel;
      // dim cells (the tile's dark ground) burn out where they are instead of flying: the bright parts carry the read
      if (st.v < 0.12 && h3 > 0.25) {
        if (age < 3) tokens.push({x: hx, y: hy, v: v0 * 0.6, pick: hash(cx, cy, seed + 4), edge: -1, col: colour, a: 1 - (age + 1) / 4});
        continue;
      }
      if (age >= L) continue;
      // per-token wind (±14 deg), speed spread, and turbulence that grows as the token gets lighter
      const ang = (h2 - 0.5) * 0.5;
      const wx = wind[0] * Math.cos(ang) - wind[1] * Math.sin(ang), wy = wind[0] * Math.sin(ang) + wind[1] * Math.cos(ang);
      const wl = Math.hypot(wx, wy) || 1;
      const sp = 0.45 + 1.4 * h1;
      const k = Math.pow(age, 1.4) * sp * 0.8;
      const turb = (1 + h3 * 2) * (0.6 + age * 0.35);
      const sway = Math.sin(age * (0.35 + h1 * 0.5) + h2 * 6.283) * turb;
      const lift = age * (0.15 + 0.7 * h2) * 0.8;
      const dx = Math.round(wx * k + (-wy / wl) * sway);
      const dy = Math.round(wy * k + (wx / wl) * sway - lift);
      const f = age / L;
      tokens.push({
        x: hx + dx, y: hy + dy,
        v: Math.max(0.08, v0 * (1 - 0.75 * f)),
        pick: hash(cx, cy, seed + 3 + Math.floor(age / 3)), edge: -1,
        col: mix(colour, o.tint ?? PAL.C6, Math.min(1, f * 1.2)),
        a: Math.pow(1 - f, 0.8),
      });
    }
  return {tokens, style: o, cell: [cw, ch], fills: []};
};
