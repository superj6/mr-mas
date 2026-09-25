import React, {useLayoutEffect, useRef, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import type {ToneModel, TP} from './types';
import {TONE_STYLES, ToneStyle, ToneStyleId, paintTone, softTone, TONE_VALUE} from './styles';
import {darken, hexToRgb, lighten, mix, rgbToHex} from '../theme/color';
import {analyze, PlaneInfo} from './render/geom';
import {isWarm, makePalette, nearestLab, rankPalette, PalEntry, toOklab} from './render/color2';
import {measureRamp, pickGlyph, TOKEN_GLYPHS} from './render/glyphRamp';

/**
 * Raster renderer for tonal models: 'glyph' | 'pixel' | 'dither' | 'stipple'.
 * The model is rasterized into value / color / plane-id buffers, then re-rendered as:
 *  - glyph:   measured-density token glyphs + contour glyphs, colored from the paint buffer, with bloom
 *  - pixel:   aliased plane-id raster -> posterized plane colors -> curated palette (ramp-aware),
 *             sel-out outline, contact lines, checker bands only on large cloth planes, dithered backdrop
 *  - dither:  1-bit ordered dither (8x8 Bayer) of a softened value field + form contours (Obra-Dinn-ish)
 *  - stipple: hedcut. Dot rows follow each plane's `angle`; dot size = smoothed tone; dark dots merge to lines
 */
export interface ToneCanvasProps {
  model: ToneModel;
  mode: 'glyph' | 'dither' | 'stipple' | 'pixel';
  style?: ToneStyleId | ToneStyle;
  width: number;
  height: number;
  /** Local-unit viewBox to map into the canvas [x, y, w, h]. */
  view: [number, number, number, number];
  /** Glyph cell / pixel size in output px (stipple: dot spacing in px; <= 1.5 = auto). */
  cell?: number;
  /** Background fill (null = transparent). */
  background?: string | null;
  /** Pixel-art palette (hex). */
  palette?: string[];
  seed?: number;
  /** Extra painter run on the color buffer before conversion (e.g. environment behind the character). */
  underlay?: (ctx: CanvasRenderingContext2D) => void;
  /** Glyph ramp, darkest -> brightest. Default: measured token set (TOKEN_GLYPHS). */
  glyphs?: string;
  /** OPTIONAL glyph: bloom strength 0..1 (default 0.75). */
  bloom?: number;
  /** OPTIONAL glyph/dither: draw contour glyphs / contour lines (default true). */
  edges?: boolean;
  /** OPTIONAL glyph: faint background token noise 0..1 (default 0). */
  noise?: number;
  /** OPTIONAL pixel: selective outline around the silhouette (default true). */
  outline?: boolean;
  /** OPTIONAL pixel: 1-px checker transition bands between tones on large cloth planes (default false). */
  bands?: boolean;
  /**
   * OPTIONAL glyph/pixel/dither: snap the view origin to the cell grid (default true) so camera pans move in
   * whole cells instead of re-sampling every edge (the classic sub-pixel "crawl").
   */
  snap?: boolean;
}

// 8x8 Bayer
const BAYER8 = (() => {
  const b = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  return b.map((v) => (v + 0.5) / 64);
})();
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const parseTransform = (t?: string): DOMMatrix => {
  const m = new DOMMatrix();
  if (!t) return m;
  const re = /(rotate|translate|scale)\(([^)]+)\)/g;
  let out = m;
  let r: RegExpExecArray | null;
  while ((r = re.exec(t))) {
    const a = r[2].trim().split(/[ ,]+/).map(Number);
    if (r[1] === 'translate') out = out.translate(a[0], a[1] ?? 0);
    if (r[1] === 'scale') out = out.scale(a[0], a[1] ?? a[0]);
    if (r[1] === 'rotate') out = a.length === 3 ? out.translate(a[1], a[2]).rotate(a[0]).translate(-a[1], -a[2]) : out.rotate(a[0]);
  }
  return out;
};

const pathCache = new Map<string, Path2D>();
const path2d = (p: TP): Path2D => {
  const key = (p.transform ?? '') + '|' + p.d;
  let hit = pathCache.get(key);
  if (!hit) {
    hit = new Path2D();
    hit.addPath(new Path2D(p.d), parseTransform(p.transform));
    if (pathCache.size > 4000) pathCache.clear();
    pathCache.set(key, hit);
  }
  return hit;
};

const paintPlane = (ctx: CanvasRenderingContext2D, p: TP, color: string, lineScale = 1) => {
  const path = path2d(p);
  if (p.line) {
    ctx.strokeStyle = color;
    ctx.lineWidth = p.line * lineScale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(path);
  } else {
    ctx.fillStyle = color;
    ctx.fill(path);
  }
};

export const drawModel = (ctx: CanvasRenderingContext2D, model: ToneModel, colorOf: (p: TP) => string) => {
  for (const p of model.paths) paintPlane(ctx, p, colorOf(p));
};

let rngState = 1;
const rng = () => {
  rngState = (rngState * 1664525 + 1013904223) >>> 0;
  return rngState / 4294967296;
};
const hash2 = (x: number, y: number, s: number) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** A curated 32-color moody palette (cool darks, violet shadow, warm skin ramp, browns, monitor cyans, accents). */
export const DEFAULT_PIXEL_PALETTE = [
  '#07080D', '#0F121B', '#171C29', '#222939', '#2F384B', '#414B60', '#5A6479', '#78839A', '#A2ABBE', '#D0D6E0', '#F3F1EA',
  '#241C38', '#3A2D4E',
  '#3B2226', '#5E3530', '#87503F', '#B06F55', '#D39275', '#EBB897', '#F7DCC6',
  '#2E211C', '#4B3629', '#6C5039',
  '#0C2E3A', '#11505F', '#1A8394', '#35C3D2', '#9FF1F7',
  '#4E6B48', '#7E9C66', '#9E4B47', '#D0613F',
];

interface Buf {
  c: HTMLCanvasElement;
  x: CanvasRenderingContext2D;
}
const mkBuf = (w: number, h: number): Buf => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  return {c, x: c.getContext('2d', {willReadFrequently: true})!};
};

/**
 * Aliased plane-id raster: each pixel gets the index of the front-most plane covering >= thr of it.
 * (Per-plane coverage threshold == majority vote at infinite supersampling; no AA color mush.)
 */
const rasterIds = (infos: PlaneInfo[], bw: number, bh: number, sx: number, sy: number, ox: number, oy: number, thr: (f: PlaneInfo) => number): Int16Array => {
  const ids = new Int16Array(bw * bh).fill(-1);
  const {x} = mkBuf(bw, bh);
  for (const f of infos) {
    const X1 = Math.max(0, Math.floor((f.bb[0] - ox) * sx) - 2);
    const Y1 = Math.max(0, Math.floor((f.bb[1] - oy) * sy) - 2);
    const X2 = Math.min(bw, Math.ceil((f.bb[2] - ox) * sx) + 2);
    const Y2 = Math.min(bh, Math.ceil((f.bb[3] - oy) * sy) + 2);
    if (X2 <= X1 || Y2 <= Y1) continue;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(X1, Y1, X2 - X1, Y2 - Y1);
    x.setTransform(sx, 0, 0, sy, -ox * sx, -oy * sy);
    paintPlane(x, f.p, '#fff');
    const d = x.getImageData(X1, Y1, X2 - X1, Y2 - Y1).data;
    const t = thr(f);
    const rw = X2 - X1;
    for (let yy = 0; yy < Y2 - Y1; yy++)
      for (let xx = 0; xx < rw; xx++) if (d[(yy * rw + xx) * 4 + 3] >= t) ids[(Y1 + yy) * bw + X1 + xx] = f.i;
  }
  return ids;
};

export const ToneCanvas: React.FC<ToneCanvasProps> = (props) => {
  const {model, mode, style = 'glyph', width, height, view, cell = 10, background = '#05070A', palette, seed = 3, underlay, glyphs, bloom = 0.75, edges = true, noise = 0, outline = true, bands = false, snap = true} = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const [initial] = useState(() => delayRender('tone-canvas'));
  const first = useRef(true);
  const s = typeof style === 'string' ? TONE_STYLES[style] : style;

  useLayoutEffect(() => {
    const handle = first.current ? initial : delayRender('tone-canvas');
    first.current = false;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    let cancelled = false;
    const run = async () => {
      if (mode === 'glyph') await document.fonts.load(`700 ${cell * 1.4}px "JetBrains Mono"`);
      const canvas = ref.current;
      if (!canvas || cancelled) return;
      const out = canvas.getContext('2d')!;
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.globalAlpha = 1;
      out.globalCompositeOperation = 'source-over';
      out.filter = 'none';
      out.clearRect(0, 0, width, height);
      if (background) {
        out.fillStyle = background;
        out.fillRect(0, 0, width, height);
      }
      rngState = seed * 7919 + 17;
      let v = view;
      if (snap && mode !== 'stipple') {
        const upcX = view[2] / (width / cell);
        const upcY = view[3] / (height / (mode === 'glyph' ? Math.round(cell * 1.45) : cell));
        v = [Math.round(view[0] / upcX) * upcX, Math.round(view[1] / upcY) * upcY, view[2], view[3]];
      }
      const args: Args = {model, s, width, height, view: v, cell, background, palette, seed, underlay, glyphs, bloom, edges, noise, outline, bands};
      if (mode === 'glyph') renderGlyph(out, args);
      else if (mode === 'pixel') renderPixel(out, args);
      else if (mode === 'dither') renderDither(out, args);
      else renderStipple(out, args);
    };
    run().finally(finish);
    return () => {
      cancelled = true;
      finish();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, mode, width, height, view[0], view[1], view[2], view[3], cell, background, palette, seed, underlay, glyphs, s, bloom, edges, noise, outline, bands, snap]);

  return <canvas ref={ref} width={width} height={height} style={{width, height, imageRendering: mode === 'pixel' || mode === 'dither' ? 'pixelated' : 'auto'}} />;
};

interface Args {
  model: ToneModel;
  s: ToneStyle;
  width: number;
  height: number;
  view: [number, number, number, number];
  cell: number;
  background: string | null;
  palette?: string[];
  seed: number;
  underlay?: (ctx: CanvasRenderingContext2D) => void;
  glyphs?: string;
  bloom: number;
  edges: boolean;
  noise: number;
  outline: boolean;
  bands: boolean;
}

const hueOfM = (model: ToneModel) => (p: TP) => (p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888');

// ================================================================================================
// GLYPH
// ================================================================================================
const renderGlyph = (out: CanvasRenderingContext2D, a: Args) => {
  const {model, s, width, height, view, cell} = a;
  const hueOf = hueOfM(model);
  const cw = cell;
  const ch = Math.round(cell * 1.45);
  const cols = Math.ceil(width / cw);
  const rows = Math.ceil(height / ch);
  const SS = 3; // supersample per cell axis
  const bw = cols * SS;
  const bh = rows * SS;
  const [vx, vy, vw, vh] = view;
  const sx = (width / vw) * (SS / cw);
  const sy = (height / vh) * (SS / ch);
  const V = mkBuf(bw, bh);
  const C = mkBuf(bw, bh);
  for (const b of [V, C]) b.x.setTransform(sx, 0, 0, sy, -vx * sx, -vy * sy);
  if (a.underlay) a.underlay(C.x);
  // drawn lines (mouth, lashes, nose) are thinner than a cell: widen them so they register as glyphs
  const lineK = (p: TP) => (p.line ? Math.max(1, (1.3 * cw) / (width / vw) / p.line) : 1);
  for (const p of model.paths) {
    const v = Math.round(TONE_VALUE[p.tone] * 255);
    paintPlane(V.x, p, `rgb(${v},${v},${v})`, lineK(p));
    paintPlane(C.x, p, p.light ? softTone(hueOf(p), p.tone, s, true) : paintTone(hueOf(p), p.tone, s.spot), lineK(p));
  }
  // soften the value field (~0.6 cell) so glyph density ramps across plane boundaries like shading
  const VB = mkBuf(bw, bh);
  VB.x.filter = `blur(${SS * 0.6}px)`;
  VB.x.drawImage(V.c, 0, 0);
  const vd = VB.x.getImageData(0, 0, bw, bh).data;
  const cd = C.x.getImageData(0, 0, bw, bh).data;
  // per-cell averages
  const val = new Float32Array(cols * rows);
  const cov = new Float32Array(cols * rows);
  const col = new Float32Array(cols * rows * 3);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      let v = 0;
      let al = 0;
      let r = 0;
      let g = 0;
      let bl = 0;
      for (let j = 0; j < SS; j++)
        for (let i = 0; i < SS; i++) {
          const k = ((y * SS + j) * bw + x * SS + i) * 4;
          const A = cd[k + 3] / 255;
          v += (vd[k] / 255) * A;
          al += A;
          r += cd[k] * A;
          g += cd[k + 1] * A;
          bl += cd[k + 2] * A;
        }
      const n = SS * SS;
      const c = y * cols + x;
      cov[c] = al / n;
      val[c] = al > 0 ? v / al : 0;
      col[c * 3] = al > 0 ? r / al : 0;
      col[c * 3 + 1] = al > 0 ? g / al : 0;
      col[c * 3 + 2] = al > 0 ? bl / al : 0;
    }
  const ramp = a.glyphs ? null : measureRamp(TOKEN_GLYPHS, '"JetBrains Mono"');
  const G = mkBuf(width, height);
  const g = G.x;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const spot = hexToRgb(s.spot);
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : val[y * cols + x] * Math.min(1, cov[y * cols + x] * 1.4));
  const EDGE = ['-', '\\', '|', '/'];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const c = y * cols + x;
      const px = x * cw + cw / 2;
      const py = y * ch + ch / 2;
      if (cov[c] < 0.12) {
        if (a.noise > 0) {
          const h = hash2(x, y, a.seed);
          if (h < a.noise * 0.35) {
            g.font = `400 ${Math.round(ch * 0.8)}px "JetBrains Mono"`;
            g.fillStyle = `rgba(${spot[0]},${spot[1]},${spot[2]},${0.08 + h * 0.3})`;
            g.fillText(TOKEN_GLYPHS[1 + Math.floor(hash2(y, x, a.seed + 1) * 12)], px, py);
          }
        }
        continue;
      }
      const v0 = val[c];
      const vb = Math.min(1, 0.06 + 1.02 * Math.pow(v0, 0.85)); // brighter, still contrasty
      // contour detection (Sobel on the value grid)
      let ch2: string | null = null;
      let edgeBoost = 0;
      if (a.edges) {
        const gx = at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
        const gy = at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
        const mag = Math.hypot(gx, gy);
        if (mag > 1.5) {
          let ang = (Math.atan2(gx, -gy) * 180) / Math.PI;
          ang = ((ang % 180) + 180) % 180;
          const bin = ang < 22.5 || ang >= 157.5 ? 0 : ang < 67.5 ? 1 : ang < 112.5 ? 2 : 3;
          ch2 = EDGE[bin];
          edgeBoost = Math.min(1, (mag - 1.5) * 0.6);
        }
      }
      const glyph = ch2 ?? (ramp ? pickGlyph(ramp, Math.min(1, vb * 0.98), hash2(x, y, a.seed)) : a.glyphs![Math.min(a.glyphs!.length - 1, Math.floor(vb * a.glyphs!.length))]);
      if (glyph === ' ') continue;
      const gain = 0.44 + 1.0 * vb + edgeBoost * 0.3;
      const lift = 0.3 * (1 - vb); // shadows lean to the scene light (latent cyan)
      let r = col[c * 3] * gain;
      let gg = col[c * 3 + 1] * gain;
      let b = col[c * 3 + 2] * gain;
      r = r * (1 - lift) + spot[0] * lift * 0.75;
      gg = gg * (1 - lift) + spot[1] * lift * 0.75;
      b = b * (1 - lift) + spot[2] * lift * 0.75;
      const size = Math.round(ch * (0.8 + 0.34 * vb));
      g.font = `700 ${size}px "JetBrains Mono"`;
      g.fillStyle = `rgb(${Math.min(255, r)},${Math.min(255, gg)},${Math.min(255, b)})`;
      g.globalAlpha = Math.min(1, 0.35 + cov[c]);
      g.fillText(glyph, px, py);
    }
  g.globalAlpha = 1;
  if (a.bloom > 0) {
    out.save();
    out.globalCompositeOperation = 'lighter';
    out.filter = `blur(${Math.max(2, cell * 1.4)}px)`;
    out.globalAlpha = a.bloom * 0.9;
    out.drawImage(G.c, 0, 0);
    out.filter = `blur(${Math.max(1, cell * 0.45)}px)`;
    out.globalAlpha = a.bloom * 0.6;
    out.drawImage(G.c, 0, 0);
    out.restore();
  }
  out.drawImage(G.c, 0, 0);
};

// ================================================================================================
// PIXEL
// ================================================================================================
const renderPixel = (out: CanvasRenderingContext2D, a: Args) => {
  const {model, s, width, height, view, cell} = a;
  const hueOf = hueOfM(model);
  const infos = analyze(model);
  const bw = Math.ceil(width / cell);
  const bh = Math.ceil(height / cell);
  const [vx, vy, vw, vh] = view;
  const sx = (width / vw) / cell;
  const sy = (height / vh) / cell;
  const pal = makePalette(a.palette ?? DEFAULT_PIXEL_PALETTE);
  // dither matrix anchored to the (snapped) view origin => the pattern travels with camera pans
  const gx = Math.round(vx * sx);
  const gy = Math.round(vy * sy);
  const ids = rasterIds(infos, bw, bh, sx, sy, vx, vy, (f) => (f.p.line ? 80 : f.minDim * sx < 3 ? 90 : 128));

  // --- orphan cleanup on big planes (kills single stray pixels, keeps pupils/highlights) ---
  const count = new Int32Array(infos.length);
  for (let k = 0; k < ids.length; k++) if (ids[k] >= 0) count[ids[k]]++;
  const ids2 = ids.slice();
  for (let y = 1; y < bh - 1; y++)
    for (let x = 1; x < bw - 1; x++) {
      const k = y * bw + x;
      const me = ids[k];
      if (me < 0 || count[me] < 14 || infos[me].p.line) continue;
      const n = [ids[k - 1], ids[k + 1], ids[k - bw], ids[k + bw]];
      if (n.every((v) => v !== me)) {
        // most common neighbour
        let best = n[0];
        let bc = 0;
        for (const v of n) {
          const c = n.filter((w) => w === v).length;
          if (c > bc) {
            bc = c;
            best = v;
          }
        }
        if (bc >= 2) ids2[k] = best;
      }
    }

  // --- plane colors: posterized tone color -> palette, ramp-aware (adjacent tones never merge) ---
  const planeEntry: PalEntry[] = new Array(infos.length);
  const byHue = new Map<string, Map<number, PalEntry>>();
  const toneColor = (p: TP) => (p.light ? mix(lighten(hueOf(p), p.tone >= 4 ? 0.45 : 0.3), s.spot, 0.22) : softTone(hueOf(p), p.tone, s));
  const hues = new Map<string, Set<number>>();
  for (const f of infos) if (!f.p.light) (hues.get(f.p.hue) ?? hues.set(f.p.hue, new Set()).get(f.p.hue)!).add(f.p.tone);
  for (const [hk, tones] of hues) {
    const m = new Map<number, PalEntry>();
    const sorted = [...tones].sort((x, y) => x - y);
    let prev: PalEntry | null = null;
    for (const t of sorted) {
      const target = hexToRgb(toneColor({hue: hk, tone: t as TP['tone'], d: ''}));
      const ranked = rankPalette(target, pal);
      let e = ranked[0];
      if (prev && e.hex === prev.hex) {
        const tl = toOklab(target);
        const chromaOk = (r: PalEntry) => Math.hypot(r.lab[1] - tl[1], r.lab[2] - tl[2]) < 0.045;
        e = ranked.find((r) => r.hex !== prev!.hex && r.lab[0] > prev!.lab[0] + 0.02 && chromaOk(r)) ?? ranked.find((r) => r.hex !== prev!.hex && r.lab[0] > prev!.lab[0]) ?? e;
      }
      m.set(t, e);
      prev = e;
    }
    byHue.set(hk, m);
  }
  for (const f of infos) planeEntry[f.i] = f.p.light ? nearestLab(hexToRgb(toneColor(f.p)), pal) : byHue.get(f.p.hue)!.get(f.p.tone)!;
  const darker = (e: PalEntry, amt = 0.4): PalEntry => {
    const cand = nearestLab(hexToRgb(darken(e.hex, amt)), pal);
    if (cand.hex !== e.hex) return cand;
    return rankPalette(e.rgb, pal).find((r) => r.lab[0] < e.lab[0] - 0.03) ?? e;
  };

  // --- backdrop: underlay/background, ordered-dithered to the palette (the only dithering) ---
  const B = mkBuf(bw, bh);
  if (a.background) {
    B.x.fillStyle = a.background;
    B.x.fillRect(0, 0, bw, bh);
  }
  if (a.underlay) {
    B.x.setTransform(sx, 0, 0, sy, -vx * sx, -vy * sy);
    a.underlay(B.x);
  }
  const bd = B.x.getImageData(0, 0, bw, bh).data;
  const img = out.createImageData(bw, bh);
  const D = img.data;
  const groupCount = new Map<string, number>();
  for (const f of infos) groupCount.set(f.p.hue, (groupCount.get(f.p.hue) ?? 0) + count[f.i]);
  const bigGroup = (hk: string, hex: string) => (groupCount.get(hk) ?? 0) > bw * bh * 0.035 && !isWarm(hex);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const k = y * bw + x;
      const id = ids2[k];
      let e: PalEntry;
      if (id >= 0) {
        e = planeEntry[id];
        const f = infos[id];
        // contact line: darken where a different form sits in front (reads like a hand-placed inner line)
        const nb = [x > 0 ? ids2[k - 1] : -1, x < bw - 1 ? ids2[k + 1] : -1, y > 0 ? ids2[k - bw] : -1, y < bh - 1 ? ids2[k + bw] : -1];
        let front = false;
        let band = -1;
        for (const n of nb) {
          if (n < 0) continue;
          const g = infos[n];
          if (n > id && g.base && !g.p.light && !g.p.line && g.group !== f.group) front = true;
          if (g.group === f.group && Math.abs(g.p.tone - f.p.tone) === 1 && !g.p.light && !f.p.light) band = n;
        }
        if (front && !f.p.line) e = darker(e, 0.45);
        else if (a.bands && band >= 0 && (x + y) % 2 === 0 && bigGroup(f.group, hueOf(f.p))) e = planeEntry[band];
      } else {
        if (bd[k * 4 + 3] < 8) {
          D[k * 4 + 3] = 0;
          continue;
        }
        const t = (BAYER4[(((y + gy) % 4) + 4) % 4 * 4 + ((((x + gx) % 4) + 4) % 4)] - 0.5) * 26;
        e = nearestLab([bd[k * 4] + t, bd[k * 4 + 1] + t, bd[k * 4 + 2] + t], pal);
      }
      D[k * 4] = e.rgb[0];
      D[k * 4 + 1] = e.rgb[1];
      D[k * 4 + 2] = e.rgb[2];
      D[k * 4 + 3] = 255;
    }
  // --- sel-out: 1-px outline outside the silhouette, colored from the darkened neighbour ---
  if (a.outline) {
    const inside = (k: number) => ids2[k] >= 0;
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++) {
        const k = y * bw + x;
        if (inside(k)) continue;
        let nb = -1;
        if (x > 0 && inside(k - 1)) nb = k - 1;
        else if (x < bw - 1 && inside(k + 1)) nb = k + 1;
        else if (y > 0 && inside(k - bw)) nb = k - bw;
        else if (y < bh - 1 && inside(k + bw)) nb = k + bw;
        if (nb < 0) continue;
        const e = darker(darker(planeEntry[ids2[nb]], 0.5), 0.5);
        D[k * 4] = e.rgb[0];
        D[k * 4 + 1] = e.rgb[1];
        D[k * 4 + 2] = e.rgb[2];
        D[k * 4 + 3] = 255;
      }
  }
  const tmp = mkBuf(bw, bh);
  tmp.x.putImageData(img, 0, 0);
  out.imageSmoothingEnabled = false;
  out.drawImage(tmp.c, 0, 0, bw * cell, bh * cell);
};

// ================================================================================================
// DITHER (1-bit)
// ================================================================================================
const renderDither = (out: CanvasRenderingContext2D, a: Args) => {
  const {model, s, width, height, view, cell} = a;
  const infos = analyze(model);
  const bw = Math.ceil(width / cell);
  const bh = Math.ceil(height / cell);
  const [vx, vy, vw, vh] = view;
  const sx = (width / vw) / cell;
  const sy = (height / vh) / cell;
  const V = mkBuf(bw, bh);
  V.x.setTransform(sx, 0, 0, sy, -vx * sx, -vy * sy);
  drawModel(V.x, model, (p) => {
    const v = Math.round((p.light ? 1 : TONE_VALUE[p.tone]) * 255);
    return `rgb(${v},${v},${v})`;
  });
  // softened value field: planes blend a little so the dither ramps instead of stepping
  const VB = mkBuf(bw, bh);
  VB.x.filter = `blur(${Math.max(0.6, 1.4 / Math.sqrt(cell))}px)`;
  VB.x.drawImage(V.c, 0, 0);
  const vd = VB.x.getImageData(0, 0, bw, bh).data;
  const ad = V.x.getImageData(0, 0, bw, bh).data;
  const ids = a.edges ? rasterIds(infos, bw, bh, sx, sy, vx, vy, () => 128) : null;
  const gx = Math.round(vx * sx);
  const gy = Math.round(vy * sy);
  const ink = hexToRgb(s.ink);
  const paper = hexToRgb(s.paper);
  const bgOn = a.background !== null;
  const img = out.createImageData(bw, bh);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const k = y * bw + x;
      const covered = ad[k * 4 + 3] > 100;
      let on: boolean;
      if (!covered) {
        if (!bgOn) {
          img.data[k * 4 + 3] = 0;
          continue;
        }
        on = true;
      } else {
        const A = vd[k * 4 + 3] / 255 || 1;
        let v = vd[k * 4] / 255 / A;
        v = Math.max(0, Math.min(1, (v - 0.08) / 0.84));
        on = v > BAYER8[((((y + gy) % 8) + 8) % 8) * 8 + ((((x + gx) % 8) + 8) % 8)];
      }
      if (ids && covered) {
        const me = ids[k];
        const r = x < bw - 1 ? ids[k + 1] : -1;
        const d = y < bh - 1 ? ids[k + bw] : -1;
        const edge = (n: number) => me >= 0 && n !== me && (n < 0 || (infos[n].group !== infos[me].group && (infos[n].base || infos[me].base)));
        if (edge(r) || edge(d) || me < 0) on = false;
      } else if (ids && !covered) {
        // outer contour: bg pixel touching the figure
        const n = [x > 0 ? ids[k - 1] : -1, x < bw - 1 ? ids[k + 1] : -1, y > 0 ? ids[k - bw] : -1, y < bh - 1 ? ids[k + bw] : -1];
        if (n.some((v) => v >= 0)) on = false;
      }
      const c = on ? paper : ink;
      img.data[k * 4] = c[0];
      img.data[k * 4 + 1] = c[1];
      img.data[k * 4 + 2] = c[2];
      img.data[k * 4 + 3] = 255;
    }
  const tmp = mkBuf(bw, bh);
  tmp.x.putImageData(img, 0, 0);
  out.imageSmoothingEnabled = false;
  out.drawImage(tmp.c, 0, 0, bw * cell, bh * cell);
};

// ================================================================================================
// STIPPLE (hedcut)
// ================================================================================================
const renderStipple = (out: CanvasRenderingContext2D, a: Args) => {
  const {model, s, width, height, view} = a;
  const infos = analyze(model);
  const [vx, vy, vw, vh] = view;
  const scale = width / vw; // px per unit
  const sp = a.cell > 1.5 ? a.cell : Math.max(3.2, width / 160); // dot pitch px
  // value field, white outside, smoothed so dot size ramps across plane boundaries
  const V = mkBuf(width, height);
  V.x.fillStyle = '#fff';
  V.x.fillRect(0, 0, width, height);
  V.x.setTransform(scale, 0, 0, height / vh, -vx * scale, (-vy * height) / vh);
  drawModel(V.x, model, (p) => {
    const v = Math.round((p.light ? 1 : TONE_VALUE[p.tone]) * 255);
    return `rgb(${v},${v},${v})`;
  });
  const VB = mkBuf(width, height);
  VB.x.filter = `blur(${sp * 1.1}px)`;
  VB.x.drawImage(V.c, 0, 0);
  const vd = VB.x.getImageData(0, 0, width, height).data;
  const vraw = V.x.getImageData(0, 0, width, height).data;
  // plane ids at half res -> hatch angle per location
  const hw = Math.ceil(width / 2);
  const hh = Math.ceil(height / 2);
  const ids = rasterIds(infos, hw, hh, scale / 2, height / vh / 2, vx, vy, () => 128);
  const groupAngle = new Map<string, number>();
  for (const f of infos) if (f.p.angle !== undefined && !groupAngle.has(f.p.hue)) groupAngle.set(f.p.hue, f.p.angle);
  const angleOf = infos.map((f) => Math.round(((((f.p.angle ?? groupAngle.get(f.p.hue) ?? 35) % 180) + 180) % 180) / 5) * 5);
  const angles = [...new Set(angleOf)];
  out.fillStyle = s.ink;
  const spU = sp / scale; // pitch in local units (lattice lives in model space => no shower-door on camera moves)
  const corners: [number, number][] = [
    [vx, vy],
    [vx + vw, vy],
    [vx, vy + vh],
    [vx + vw, vy + vh],
  ];
  for (const ang of angles) {
    const rad = (ang * Math.PI) / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);
    const nx = -uy;
    const ny = ux;
    let s0 = Infinity;
    let s1 = -Infinity;
    let t0 = Infinity;
    let t1 = -Infinity;
    for (const [cx, cy] of corners) {
      const ss = cx * ux + cy * uy;
      const tt = cx * nx + cy * ny;
      s0 = Math.min(s0, ss);
      s1 = Math.max(s1, ss);
      t0 = Math.min(t0, tt);
      t1 = Math.max(t1, tt);
    }
    const j0 = Math.floor(t0 / spU);
    const j1 = Math.ceil(t1 / spU);
    const i0 = Math.floor(s0 / spU) - 1;
    const i1 = Math.ceil(s1 / spU) + 1;
    for (let j = j0; j <= j1; j++) {
      const off = (j & 1) * 0.5;
      for (let i = i0; i <= i1; i++) {
        const su = (i + off) * spU;
        const tu = j * spU;
        const lx = su * ux + tu * nx;
        const ly = su * uy + tu * ny;
        const px = (lx - vx) * scale;
        const py = ((ly - vy) * height) / vh;
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        const hid = ids[Math.floor(py / 2) * hw + Math.floor(px / 2)];
        if (hid < 0 || angleOf[hid] !== ang) continue;
        const k = (Math.floor(py) * width + Math.floor(px)) * 4;
        const vbl = vd[k] / 255;
        const vr = vraw[k] / 255;
        const v = vbl * 0.7 + vr * 0.3;
        let d = 1 - v;
        d = Math.max(0, Math.min(1, (d - 0.12) / 0.84)) ** 1.08;
        if (d < 0.035) continue;
        const r = sp * 0.5 * Math.sqrt(d) * 1.08;
        const e = 1 + Math.max(0, d - 0.5) * 2.2;
        out.beginPath();
        out.ellipse(px, py, Math.max(0.35, r * e), Math.max(0.35, r), rad, 0, Math.PI * 2);
        out.fill();
      }
    }
  }
  // drawn lines (lash lines, mouth, strings) stay engraved-solid
  out.setTransform(scale, 0, 0, height / vh, -vx * scale, (-vy * height) / vh);
  for (const f of infos) if (f.p.line) paintPlane(out, f.p, s.ink, f.p.tone >= 2 ? 0.5 : 0.75);
  // silhouette contour as fine dots
  out.setTransform(1, 0, 0, 1, 0, 0);
  const step = Math.max(2, Math.round(sp * 0.7));
  for (let y = 0; y < hh; y++)
    for (let x = 0; x < hw; x++) {
      const k = y * hw + x;
      if (ids[k] >= 0) continue;
      const touches = (x > 0 && ids[k - 1] >= 0) || (x < hw - 1 && ids[k + 1] >= 0) || (y > 0 && ids[k - hw] >= 0) || (y < hh - 1 && ids[k + hw] >= 0);
      if (!touches || ((x * 2) % step !== 0 && (y * 2) % step !== 0)) continue;
      if (hash2(x, y, 5) > 0.55) continue;
      out.beginPath();
      out.arc(x * 2 + 1, y * 2 + 1, Math.max(0.5, sp * 0.14), 0, Math.PI * 2);
      out.fill();
    }
};

export {rgbToHex, mix};
