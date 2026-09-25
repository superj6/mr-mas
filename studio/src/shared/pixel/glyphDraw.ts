// MR. MAS — shared pixel engine: DOM side of GLYPH + buffer presentation.
// - ensureGlyphFonts(): loads JetBrains Mono (bundled via src/shared/theme/fonts.ts) with document.fonts.load
//   and measures a density ramp from the real rasterised font. Call inside delayRender (PixelScene does).
// - presentBuf(): native buffer -> canvas at an integer scale, nearest-neighbour (no smoothing, ever).
// - drawGlyphLayer(): tokens -> canvas at the same view transform, with optional bloom.
import {FONT} from '../theme/fonts';
import {Buf, TRANSPARENT} from './px';
import {hex} from './palette';
import {GlyphLayer, TOKEN_GLYPHS, EDGE_GLYPHS} from './glyph';

export const GLYPH_FONT = FONT.mono; // '"JetBrains Mono", monospace'

export interface Ramp { chars: string[]; dens: number[]; }
const ramps = new Map<string, Ramp>();
let fontsReady: Promise<void> | null = null;

const measure = (glyphs: string, weight: number): Ramp => {
  const key = weight + '|' + glyphs;
  const hit = ramps.get(key);
  if (hit) return hit;
  const W = 36, H = 54;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d', {willReadFrequently: true})!;
  x.font = `${weight} 44px ${GLYPH_FONT}`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  const out: {ch: string; d: number}[] = [];
  for (const ch of Array.from(glyphs)) {
    x.clearRect(0, 0, W, H);
    x.fillStyle = '#fff';
    x.fillText(ch, W / 2, H / 2);
    const d = x.getImageData(0, 0, W, H).data;
    let s = 0;
    for (let i = 3; i < d.length; i += 4) s += d[i];
    out.push({ch, d: s / (W * H * 255)});
  }
  out.sort((a, b) => a.d - b.d || (a.ch < b.ch ? -1 : 1));
  const mx = out[out.length - 1].d || 1;
  const r: Ramp = {chars: out.map((o) => o.ch), dens: out.map((o) => o.d / mx)};
  ramps.set(key, r);
  return r;
};

/** Load the glyph font (400 + 700) and measure the default ramps. Resolves once; safe to call every frame. */
export const ensureGlyphFonts = (): Promise<void> => {
  if (!fontsReady)
    fontsReady = Promise.all([document.fonts.load(`700 24px ${GLYPH_FONT}`, 'Aa#@'), document.fonts.load(`400 24px ${GLYPH_FONT}`, 'Aa#@')]).then(() => {
      measure(TOKEN_GLYPHS, 700);
      measure(TOKEN_GLYPHS, 400);
    });
  return fontsReady;
};

/** Glyph whose measured density is near t; `pick` chooses among the near candidates (token variety). */
export const pickGlyph = (r: Ramp, t: number, pick: number, spread = 0.06): string => {
  let lo = 0, hi = r.dens.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (r.dens[m] < t) lo = m + 1; else hi = m; }
  let a = lo, b = lo;
  while (a > 0 && t - r.dens[a - 1] < spread) a--;
  while (b < r.dens.length - 1 && r.dens[b + 1] - t < spread) b++;
  return r.chars[a + Math.min(b - a, Math.floor(pick * (b - a + 1)))];
};

export interface View {
  /** output px per native px (integer) */
  scale: number;
  /** output offset of native (crop[0], crop[1]) */
  ox: number; oy: number;
  /** native region shown [x, y, w, h] (default whole buffer) */
  crop?: [number, number, number, number];
}

const scratch = new Map<string, HTMLCanvasElement>();
const canvasFor = (key: string, w: number, h: number) => {
  let c = scratch.get(key);
  if (!c) { c = document.createElement('canvas'); scratch.set(key, c); }
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  return c;
};

/** Native buffer -> ctx at an integer scale (nearest-neighbour). TRANSPARENT pixels are skipped. */
export const presentBuf = (ctx: CanvasRenderingContext2D, b: Buf, v: View) => {
  const [cx, cy, cw, ch] = v.crop ?? [0, 0, b.w, b.h];
  const off = canvasFor('present', b.w, b.h);
  const octx = off.getContext('2d')!;
  const img = octx.createImageData(b.w, b.h);
  b.toRGBA(img.data);
  for (let i = 0; i < b.c.length; i++) if (b.c[i] >= TRANSPARENT) img.data[i * 4 + 3] = 0;
  octx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, cx, cy, cw, ch, v.ox, v.oy, cw * v.scale, ch * v.scale);
};

const rgba = (c: number, a: number) => `rgba(${(c >> 16) & 255},${(c >> 8) & 255},${c & 255},${a.toFixed(3)})`;

/**
 * Draw a GlyphLayer at the view transform. Fonts must be loaded (ensureGlyphFonts). Tokens are drawn into a
 * scratch layer, bloomed (additive blur, two radii) and composited, clipped to the view rectangle.
 */
export const drawGlyphLayer = (ctx: CanvasRenderingContext2D, layer: GlyphLayer, v: View) => {
  const s = layer.style;
  const [cw, ch] = layer.cell;
  const [vx, vy, vw, vh] = v.crop ?? [0, 0, Infinity, Infinity];
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const sc = v.scale;
  const X = (x: number) => v.ox + (x - vx) * sc;
  const Y = (y: number) => v.oy + (y - vy) * sc;
  const inView = (x: number, y: number) => x + cw > vx && y + ch > vy && x < vx + vw && y < vy + vh;
  ctx.save();
  if (v.crop) { ctx.beginPath(); ctx.rect(v.ox, v.oy, vw * sc, vh * sc); ctx.clip(); }
  // 1) the glyph region's ground
  if (layer.fills.length) {
    ctx.fillStyle = hex(s.bg ?? 0x04050a);
    for (let i = 0; i < layer.fills.length; i += 2) {
      const x = layer.fills[i], y = layer.fills[i + 1];
      if (inView(x, y)) ctx.fillRect(X(x), Y(y), cw * sc, ch * sc);
    }
  }
  if (!layer.tokens.length) { ctx.restore(); return; }
  // 2) tokens into a scratch layer
  const G = canvasFor('glyphs', W, H);
  const g = G.getContext('2d')!;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const weight = s.weight ?? 700;
  const ramp = measure(s.chars ?? TOKEN_GLYPHS, weight);
  const [s0, s1] = s.size ?? [0.9, 1.15];
  const cellH = ch * sc;
  // batch by font size (4 steps) to avoid re-parsing the font per token
  const buckets = new Map<number, typeof layer.tokens>();
  for (const t of layer.tokens) {
    if (!inView(t.x, t.y) || t.a <= 0.01) continue;
    const q = Math.round(Math.min(1, t.v) * 3);
    let arr = buckets.get(q);
    if (!arr) { arr = []; buckets.set(q, arr); }
    arr.push(t);
  }
  for (const [q, arr] of buckets) {
    g.font = `${weight} ${Math.max(6, Math.round(cellH * (s0 + (s1 - s0) * (q / 3))))}px ${GLYPH_FONT}`;
    for (const t of arr) {
      const glyph = t.ch ?? (t.edge >= 0 ? EDGE_GLYPHS[t.edge] : pickGlyph(ramp, Math.min(1, t.v * 0.98), t.pick));
      if (glyph === ' ') continue;
      g.fillStyle = rgba(t.col, Math.min(1, t.a));
      g.fillText(glyph, X(t.x) + (cw * sc) / 2, Y(t.y) + cellH / 2 + sc * 0.25);
    }
  }
  // 3) bloom + composite
  const bloom = s.bloom ?? 0.7;
  if (bloom > 0) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = `blur(${Math.max(2, cellH * 0.9)}px)`;
    ctx.globalAlpha = bloom * 0.85;
    ctx.drawImage(G, 0, 0);
    ctx.filter = `blur(${Math.max(1, cellH * 0.3)}px)`;
    ctx.globalAlpha = bloom * 0.55;
    ctx.drawImage(G, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(G, 0, 0);
  ctx.restore();
};
