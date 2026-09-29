// MR. MAS — cast kit (owned by the cast builder). Small helpers shared by mas.ts / gerg.ts / alyi.ts.
// Everything stays on the integer grid: images are Int32 colour maps (-1 = transparent), faces and hands
// are hand-placed TONE MAPS (each char = [material, ramp index]) so a light state is just a ramp swap.
import {Buf} from '../px';
import {FigureDef, Img, LightRig, P, Prim, renderFigure} from '../figure';
import {PAL} from '../palette';

export {P};
export type {Img, Prim, FigureDef, LightRig};

/** 6-step ramp: [outline, shadow, mid, light, bright, rim] */
export type Ramps = Record<string, number[]>;
/** tone-map legend: char -> [material, ramp index] or a fixed colour */
export type Legend = Record<string, readonly [string, number] | number>;

export const newImg = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});
export const cloneImg = (s: Img): Img => ({w: s.w, h: s.h, c: new Int32Array(s.c)});
export const px = (img: Img, x: number, y: number) => (x < 0 || y < 0 || x >= img.w || y >= img.h ? -1 : img.c[y * img.w + x]);
export const put = (img: Img, x: number, y: number, col: number) => {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  img.c[y * img.w + x] = col;
};

/** Paint a tone map into an image. '.' and ' ' are transparent; '_' erases (punches a hole). */
export const paint = (img: Img, x: number, y: number, rows: readonly string[], legend: Legend, ramps: Ramps, flip = false) => {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[flip ? r.length - 1 - i : i];
      if (ch === '.' || ch === ' ') continue;
      if (ch === '_') { put(img, x + i, y + j, -1); continue; }
      const v = legend[ch];
      if (v === undefined) continue;
      const col = typeof v === 'number' ? v : ramps[v[0]]?.[v[1]];
      if (col === undefined) continue;
      put(img, x + i, y + j, col);
    }
  });
};

/** Composite src onto dst at (x, y). */
export const over = (dst: Img, src: Img, x: number, y: number, flip = false) => {
  for (let j = 0; j < src.h; j++)
    for (let i = 0; i < src.w; i++) {
      const v = src.c[j * src.w + (flip ? src.w - 1 - i : i)];
      if (v >= 0) put(dst, x + i, y + j, v);
    }
};

export const flipImg = (s: Img): Img => {
  const o = newImg(s.w, s.h);
  over(o, s, 0, 0, true);
  return o;
};

/** Blit into the frame buffer (optional colour map, e.g. a palette remap or a freeze tint). */
export const blitTo = (b: Buf, img: Img, x: number, y: number, opts: {flip?: boolean; map?: (c: number, x: number, y: number) => number; clip?: (x: number, y: number) => boolean} = {}) => {
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (opts.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      if (opts.clip && !opts.clip(X, Y)) continue;
      b.set(X, Y, opts.map ? opts.map(v, X, Y) : v);
    }
};

export const shiftPrim = (p: Prim, dx: number, dy: number): Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};

/** Tapered limb segment from (x0,y0,w0) to (x1,y1,w1). */
export const seg = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number): Prim => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return P.poly(x0 + (nx * w0) / 2, y0 + (ny * w0) / 2, x1 + (nx * w1) / 2, y1 + (ny * w1) / 2, x1 - (nx * w1) / 2, y1 - (ny * w1) / 2, x0 - (nx * w0) / 2, y0 - (ny * w0) / 2);
};

/** Memoise an image builder on its JSON-able params. */
export const memo = <T,>(fn: (p: T) => Img): ((p: T) => Img) => {
  const cache = new Map<string, Img>();
  return (p: T) => {
    const k = JSON.stringify(p);
    let v = cache.get(k);
    if (!v) { v = fn(p); cache.set(k, v); }
    return v;
  };
};

export const figure = (fig: FigureDef, rig: LightRig) => renderFigure(fig, rig);

/** Darken a ramp by k steps (freeze / fade states). */
export const dimRamp = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
export const dimRamps = (rs: Ramps, k: number): Ramps => Object.fromEntries(Object.entries(rs).map(([m, r]) => [m, dimRamp(r, k)]));

// ------------------------------------------------------------------ native 1-bit (1993)
// Tone-mapped art can be rendered straight to 1-bit with hand-picked MacPaint-style patterns per
// material instead of thresholding colours: every material is encoded as a sentinel "colour"
// (0xFA0000 | mat << 4 | tone) and resolved to ink/paper through its own pattern table.
export const INK = 0x0e0e10;
export const PAPER = 0xe9e6da;
const SENT = 0xfa0000;
const matIds = new Map<string, number>();
const matId = (m: string) => {
  let v = matIds.get(m);
  if (v === undefined) { v = matIds.size + 1; matIds.set(m, v); }
  return v;
};
/** Sentinel ramps for the given materials. */
export const bitRamps = (mats: string[]): Ramps => Object.fromEntries(mats.map((m) => [m, [0, 1, 2, 3, 4, 5].map((t) => SENT | (matId(m) << 4) | t)]));

// 8x8 patterns, '#' = ink. Screen-space aligned like the real thing.
const PAT: Record<string, string[]> = {
  ink: ['########'],
  paper: ['........'],
  d88: ['###.####', '########', '#######.', '########'], // 7/8 ink
  d75: ['#.#.#.#.', '########', '.#.#.#.#', '########'],
  d50: ['#.#.#.#.', '.#.#.#.#'],
  d25: ['#...#...', '........', '..#...#.', '........'],
  d12: ['#.......', '........', '....#...', '........'],
  hstripe: ['########', '........', '........'],
  vline: ['#...', '#...'],
  weave: ['#...#...', '.#.#.#.#', '..#...#.', '.#.#.#.#'],
};
const patAt = (name: string, x: number, y: number) => {
  const p = PAT[name] ?? PAT.d50;
  const r = p[((y % p.length) + p.length) % p.length];
  return r[((x % r.length) + r.length) % r.length] === '#';
};
/** Per-material pattern ladders: index = tone 0..5 */
export type BitLadder = Record<string, string[]>;
export const DEFAULT_LADDER = ['ink', 'd75', 'd50', 'd12', 'paper', 'paper'];

export const blit1bit = (b: Buf, img: Img, x: number, y: number, ladders: BitLadder, opts: {flip?: boolean; clip?: (x: number, y: number) => boolean; halo?: string[]} = {}) => {
  const inv = new Map<number, string>();
  for (const [m, id] of matIds) inv.set(id, m);
  const matAt = (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= img.w || j >= img.h) return null;
    const v = img.c[j * img.w + (opts.flip ? img.w - 1 - i : i)];
    if (v < 0) return null;
    return (v & 0xff0000) === SENT ? inv.get((v >> 4) & 0xfff) ?? '' : '';
  };
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (opts.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      if (opts.clip && !opts.clip(X, Y)) continue;
      if ((v & 0xff0000) !== SENT) { b.set(X, Y, v === PAPER || v === INK ? v : INK); continue; }
      const m = inv.get((v >> 4) & 0xfff) ?? '';
      const t = v & 15;
      const lad = ladders[m] ?? DEFAULT_LADDER;
      b.set(X, Y, patAt(lad[Math.min(t, lad.length - 1)], X, Y) ? INK : PAPER);
    }
  // early-Mac sprite halo: a 1px paper outline where a listed material meets the (black) ground
  if (opts.halo) {
    const hs = new Set(opts.halo);
    for (let j = -1; j <= img.h; j++)
      for (let i = -1; i <= img.w; i++) {
        if (matAt(i, j) !== null) continue;
        let hit = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const m = matAt(i + dx, j + dy); if (m !== null && hs.has(m)) hit = true; }
        if (!hit) continue;
        const X = x + i, Y = y + j;
        if (opts.clip && !opts.clip(X, Y)) continue;
        b.set(X, Y, PAPER);
      }
  }
};

// ------------------------------------------------------------------ shared ramps
/** Eye / mouth darks that should never pick up a light's hue. */
export const DARK = PAL.N0;

// ------------------------------------------------------------------ edge lights
/** colour -> [material, tone] lookup for a ramp set (first ramp wins on shared colours). */
export const rampIndex = (ramps: Ramps, prefer: string[] = []) => {
  const m = new Map<number, [string, number]>();
  const order = [...prefer, ...Object.keys(ramps).filter((k) => !prefer.includes(k))];
  for (const k of order) ramps[k]?.forEach((c, i) => { if (!m.has(c)) m.set(c, [k, i]); });
  return m;
};

/**
 * Second-light rim: every opaque pixel whose neighbour toward the light is empty gets `pick(mat, tone)`.
 * `depth` > 1 thickens the rim (only where the run stays inside the silhouette).
 */
export const edgeLight = (img: Img, ramps: Ramps, dir: [number, number], pick: (mat: string, tone: number, x: number, y: number) => number | undefined, depth = 1, prefer: string[] = []) => {
  const idx = rampIndex(ramps, prefer);
  const src = new Int32Array(img.c);
  const op = (x: number, y: number) => x >= 0 && y >= 0 && x < img.w && y < img.h && src[y * img.w + x] >= 0;
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const v = src[y * img.w + x];
      if (v < 0) continue;
      let hit = false;
      for (let k = 1; k <= depth; k++) if (!op(x + dir[0] * k, y + dir[1] * k)) { hit = true; break; }
      if (!hit) continue;
      const mt = idx.get(v);
      if (!mt) continue;
      const c = pick(mt[0], mt[1], x, y);
      if (c !== undefined) img.c[y * img.w + x] = c;
    }
};

/** Deterministic 0..1 hash for integer (i, salt) — keycap launches, token streams. */
export const hash01 = (i: number, salt = 0) => {
  let h = (i * 374761393 + salt * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// ------------------------------------------------------------------ portrait backgrounds (stepped light, no gradients)
/** Stepped, dithered light pool inside a window: `rings` = [[radius 0..1, colour], ...] outer -> inner. */
export const lightPool = (b: Buf, x0: number, y0: number, w: number, h: number, cx: number, cy: number, sx: number, sy: number, base: number, rings: Array<[number, number]>) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - cx) / sx, (y - cy) / sy);
      const bz = BAY8[((y + y0) & 3) * 4 + ((x + x0) & 3)];
      let c = base;
      for (let k = 0; k < rings.length; k++) {
        const [r, col] = rings[k];
        const next = k + 1 < rings.length ? rings[k + 1][0] : 0;
        const band = (r - next) * 0.35;
        if (d < r - band || (d < r && bz < (r - d) / band)) c = col;
      }
      b.set(x0 + x, y0 + y, c);
    }
};
const BAY8 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** Irregular stubble / fringe map: w x h, denser at the bottom row, hashed so it never reads as a pattern. */
export const fringe = (w: number, h: number, seed: number, density = 0.55): string[] =>
  Array.from({length: h}, (_, j) => Array.from({length: w}, (_, i) => (hash01(i * 31 + j * 7 + seed * 101, seed) < density * ((j + 1) / h) * (0.6 + 0.8 * Math.sin((i / w) * Math.PI)) ? '#' : '.')).join(''));
