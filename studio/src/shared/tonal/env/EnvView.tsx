import React from 'react';
import {continueRender, delayRender} from 'remotion';
import type {ToneModel, TP, Tone} from '../types';
import {ToneSvg} from '../ToneSvg';
import {ToneCanvas} from '../ToneCanvas';
import {TONE_STYLES, ToneStyle, paintTone, softTone} from '../styles';
import {DEFAULT_PIXEL_PALETTE} from '../ToneCanvas';
import {hexToRgb, lighten, mix} from '../../theme/color';
import type {EnvTP} from './geo';
export type {EnvTP};

/**
 * One entry point to render any ENV tonal model in any tonal style, at any size.
 * - vector: paint | soft | noir | riso | engrave -> shared ToneSvg (so the set matches the characters).
 *   Line/dot pitch for engrave + noir halftone is scaled to the output size (no moire in thumbnails).
 * - softenv: the env builder's own soft-light fallback (blur per plane `soft` + light bloom).
 * - raster: glyph | pixel | dither | stipple -> shared ToneCanvas; cells are given at FULL-FRAME scale
 *   and scaled with the output size so thumbnails match the full-res look.
 * - value: notan / value check (tones as greys) for lookdev review.
 */
export type EnvStyle = 'paint' | 'soft' | 'softenv' | 'noir' | 'riso' | 'engrave' | 'glyph' | 'pixel' | 'dither' | 'stipple' | 'value';

export const ENV_STYLE_LABEL: Record<EnvStyle, string> = {
  paint: 'Painterly Flat',
  soft: 'Soft Painted',
  softenv: 'Soft Light (env)',
  noir: 'Noir Prestige',
  riso: 'Riso Editorial',
  engrave: 'Banknote Engraving',
  glyph: 'Latent Glyph',
  pixel: '16-bit Pixel',
  dither: '1-bit Dither',
  stipple: 'Hedcut Stipple',
  value: 'Value check (notan)',
};

const FULL_CELL: Partial<Record<EnvStyle, number>> = {glyph: 12, pixel: 5, dither: 3, stipple: 1};

const has = (id: string) => id in TONE_STYLES;
export const envBg = (s: EnvStyle) =>
  s === 'noir' || s === 'riso' || s === 'engrave' || s === 'stipple' || s === 'dither' ? TONE_STYLES[s].paper : s === 'soft' && has('soft') ? TONE_STYLES.soft.paper : '#0B0E14';

/**
 * Per-style GRADE (env-owned):
 *  - value-sampling renderers (glyph / dither / stipple) use a plane's `readTone` when it has one;
 *  - optional glyph hue lift (grade=true) so tone-1 planes emit brighter tokens.
 */
export const gradeModel = (m: ToneModel, style: EnvStyle, lift: boolean): ToneModel => {
  const valueStyle = style === 'glyph' || style === 'dither' || style === 'stipple';
  if (!valueStyle) return m;
  let out: ToneModel = {...m, paths: (m.paths as EnvTP[]).map((p) => (p.readTone !== undefined ? {...p, tone: p.readTone} : p))};
  if (lift && style === 'glyph') {
    const hues: Record<string, string> = {};
    Object.entries(m.hues).forEach(([k, v]) => (hues[k] = mix(lighten(v, 0.3), '#3FA9C0', 0.1)));
    out = {...out, hues};
  }
  return out;
};

/** Pixel tier default for env: the shared curated palette + 4 teal-navy steps so dithered glows ramp smoothly. */
export const ENV_PIXEL_EXTRA = ['#12202C', '#163244', '#1D4656', '#2A6676', '#7FC6CF'];

/** Optional night palette for the pixel tier (navy darks, teal ramp, cyan light, warm city, Mas's skin/hoodie). */
export const ENV_PIXEL_PALETTE = [
  '#06070B', '#0C0F17', '#121724', '#191F2F', '#212A3C', '#2B3548', '#384359', '#4B566E', '#6E7A91', '#9AA6B8',
  '#122A33', '#1A3C48', '#24525F', '#306977', '#428290', '#63A6B2', '#9ADAE2', '#3FE6FF', '#C8FBFF', '#FFFFFF',
  '#231D22', '#342A2C', '#4B3C3B', '#6B554E', '#977563',
  '#2A1C1A', '#4A2F27', '#6E463A', '#94634F', '#BC8A6E', '#DDB396', '#F2D7BF',
  '#5E7F5A', '#A24E47', '#FFB347', '#4DFF9A',
];

export interface EnvViewProps {
  model: ToneModel;
  style: EnvStyle;
  width: number;
  height: number;
  view?: [number, number, number, number];
  uid?: string;
  cell?: number;
  /** pixel: custom palette (default = shared curated palette). */
  palette?: string[];
  /** glyph: apply the env glyph grade. */
  grade?: boolean;
  /** soft: brush boil seed (change every 2-3 frames in motion). */
  boil?: number;
}

export const EnvView: React.FC<EnvViewProps> = ({model: raw, style, width, height, view, uid = 'env', cell, palette, grade = false, boil = 1}) => {
  const model = React.useMemo(() => gradeModel(raw, style, grade), [raw, style, grade]);
  const v = view ?? model.box;
  const pxPerUnit = width / v[2];
  if (style === 'glyph' || style === 'pixel' || style === 'dither' || style === 'stipple') {
    const c = cell ?? Math.max(1, Math.round(((FULL_CELL[style] ?? 4) * width) / 1920));
    const st = style === 'pixel' && !has('pixel') ? 'paint' : style;
    if (style === 'pixel') return <PixelEnv model={model} width={width} height={height} view={v} cell={c} palette={palette ?? [...DEFAULT_PIXEL_PALETTE, ...ENV_PIXEL_EXTRA]} st={has('pixel') ? 'pixel' : 'paint'} />;
    return <ToneCanvas model={model} mode={style} style={st} width={width} height={height} view={v} cell={c} background={style === 'glyph' ? '#000000' : envBg(style)} />;
  }
  let body: React.ReactNode;
  if (style === 'value') body = <ValueSvg model={model} />;
  else if (style === 'softenv' || (style === 'soft' && !has('soft'))) body = <SoftSvg model={model} uid={uid} />;
  else {
    const base = TONE_STYLES[style];
    const st: ToneStyle = style === 'engrave' || style === 'noir' ? {...base, pitch: Math.max(4.6, 5.5 / pxPerUnit)} : base;
    body = <ToneSvg model={model} style={st} uid={uid} boil={boil} />;
  }
  return (
    <svg width={width} height={height} viewBox={v.join(' ')} style={{display: 'block'}}>
      {body}
    </svg>
  );
};

/**
 * Pixel tier. The shared pixel renderer draws the OBJECTS (aliased planes, ramp-aware palette, sel-out +
 * contact lines) over a transparent backdrop; the env BACKDROP planes (walls, light falloff, desk + pools)
 * are rendered here underneath on the SAME pixel grid: blurred glows, then quantized to the palette with a
 * two-nearest-colour ordered dither, so flat areas stay flat and only real gradients dither (classic
 * hand-dithered glow bands).
 */
const BAYER8 = (() => {
  const m = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  return m.map((v) => (v + 0.5) / 64);
})();

const PixelBackdrop: React.FC<{planes: EnvTP[]; hueOf: (p: TP) => string; colOf: (p: EnvTP) => string; width: number; height: number; view: [number, number, number, number]; cell: number; palette: string[]}> = ({planes, colOf, width, height, view, cell, palette}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [handle] = React.useState(() => delayRender('env-pixel-backdrop'));
  React.useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const bw = Math.ceil(width / cell);
    const bh = Math.ceil(height / cell);
    const buf = document.createElement('canvas');
    buf.width = bw;
    buf.height = bh;
    const x = buf.getContext('2d', {willReadFrequently: true})!;
    const sx = bw / view[2];
    const sy = bh / view[3];
    x.setTransform(sx, 0, 0, sy, -view[0] * sx, -view[1] * sy);
    for (const p of planes) {
      const b = (p.soft ?? 0) * sx * 0.6;
      x.filter = b >= 0.6 ? `blur(${b.toFixed(2)}px)` : 'none';
      const path = new Path2D(p.d);
      if (p.line) {
        x.strokeStyle = colOf(p);
        x.lineWidth = p.line;
        x.stroke(path);
      } else {
        x.fillStyle = colOf(p);
        x.fill(path);
      }
    }
    x.filter = 'none';
    const src = x.getImageData(0, 0, bw, bh);
    const pal = palette.map(hexToRgb);
    const d2 = (a: number[], r: number, g: number, b: number) => (a[0] - r) ** 2 * 0.3 + (a[1] - g) ** 2 * 0.59 + (a[2] - b) ** 2 * 0.11;
    const D = src.data;
    for (let yy = 0; yy < bh; yy++)
      for (let xx = 0; xx < bw; xx++) {
        const k = (yy * bw + xx) * 4;
        const r = D[k];
        const g = D[k + 1];
        const bl = D[k + 2];
        let i1 = 0;
        let i2 = 0;
        let e1 = Infinity;
        let e2 = Infinity;
        for (let i = 0; i < pal.length; i++) {
          const e = d2(pal[i], r, g, bl);
          if (e < e1) {
            e2 = e1;
            i2 = i1;
            e1 = e;
            i1 = i;
          } else if (e < e2) {
            e2 = e;
            i2 = i;
          }
        }
        const p1 = pal[i1];
        const p2 = pal[i2];
        const vx = p2[0] - p1[0];
        const vy = p2[1] - p1[1];
        const vz = p2[2] - p1[2];
        const L = vx * vx * 0.3 + vy * vy * 0.59 + vz * vz * 0.11 || 1;
        const t = ((r - p1[0]) * vx * 0.3 + (g - p1[1]) * vy * 0.59 + (bl - p1[2]) * vz * 0.11) / L;
        const use2 = t > 0.08 && t > BAYER8[(yy % 8) * 8 + (xx % 8)];
        const c = use2 ? p2 : p1;
        D[k] = c[0];
        D[k + 1] = c[1];
        D[k + 2] = c[2];
        D[k + 3] = 255;
      }
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.putImageData(src, 0, 0);
    const out = cv.getContext('2d')!;
    out.imageSmoothingEnabled = false;
    out.clearRect(0, 0, width, height);
    out.drawImage(buf, 0, 0, bw * cell, bh * cell);
    continueRender(handle);
  }, [planes, colOf, width, height, view, cell, palette, handle]);
  return <canvas ref={ref} width={width} height={height} style={{position: 'absolute', left: 0, top: 0, width, height, imageRendering: 'pixelated'}} />;
};

const PixelEnv: React.FC<{model: ToneModel; width: number; height: number; view: [number, number, number, number]; cell: number; palette: string[]; st: 'pixel' | 'paint'}> = ({model, width, height, view, cell, palette, st}) => {
  const {fg, bgs, colOf, hueOf, pal} = React.useMemo(() => {
    const paths = model.paths as EnvTP[];
    const s = TONE_STYLES[st];
    const hueOf = (p: TP) => (p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888');
    const colOf = (p: EnvTP) => (p.light ? mix(lighten(hueOf(p), 0.45), s.spot, 0.22) : st === 'pixel' ? softTone(hueOf(p), p.tone, s) : paintTone(hueOf(p), p.tone, s.spot));
    const bgs = paths.filter((p) => p.bg);
    // flat backdrop colours go into the palette exactly, so big flat areas never dither
    const flat = new Set<string>();
    bgs.forEach((p) => {
      if ((p.soft ?? 0) <= 10 && !p.light) flat.add(colOf(p).toUpperCase());
    });
    const pal = [...palette, ...[...flat].filter((c) => !palette.includes(c))];
    return {fg: {...model, paths: paths.filter((p) => !p.bg)} as ToneModel, bgs, colOf, hueOf, pal};
  }, [model, palette, st]);
  return (
    <div style={{position: 'relative', width, height}}>
      <PixelBackdrop planes={bgs} hueOf={hueOf} colOf={colOf} width={width} height={height} view={view} cell={cell} palette={pal} />
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <ToneCanvas model={fg} mode="pixel" style={st} width={width} height={height} view={view} cell={cell} background={null} palette={pal} outline />
      </div>
    </div>
  );
};

const GREY: Record<Tone, string> = {0: '#121212', 1: '#3B3B3B', 2: '#6E6E6E', 3: '#A6A6A6', 4: '#E6E6E6'};
const ValueSvg: React.FC<{model: ToneModel}> = ({model}) => (
  <g>
    {model.paths.map((p, i) => {
      const c = p.light && p.tone >= 3 ? '#FFFFFF' : GREY[p.tone];
      return p.line ? <path key={i} d={p.d} transform={p.transform} fill="none" stroke={c} strokeWidth={p.line} strokeLinecap="round" strokeLinejoin="round" /> : <path key={i} d={p.d} transform={p.transform} fill={c} />;
    })}
  </g>
);

/** Soft Light: painterly colors, planes softened by their falloff hint, light planes bloom. */
export const SoftSvg: React.FC<{model: ToneModel; uid: string; style?: ToneStyle}> = ({model, uid, style = TONE_STYLES.paint}) => {
  const hueOf = (p: TP) => (p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888');
  const col = (p: TP) => paintTone(hueOf(p), p.tone, style.spot, p.light && p.tone >= 4);
  const el = (p: TP, i: number, override?: string) =>
    p.line ? (
      <path key={i} d={p.d} transform={p.transform} fill="none" stroke={override ?? col(p)} strokeWidth={p.line} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path key={i} d={p.d} transform={p.transform} fill={override ?? col(p)} />
    );
  // group consecutive planes by blur amount (keeps painter's order)
  const groups: {soft: number; items: React.ReactNode[]}[] = [];
  (model.paths as EnvTP[]).forEach((p, i) => {
    const s = p.soft ?? 0;
    const last = groups[groups.length - 1];
    if (last && last.soft === s) last.items.push(el(p, i));
    else groups.push({soft: s, items: [el(p, i)]});
  });
  const amounts = [...new Set(groups.map((g) => g.soft).filter((s) => s > 0))];
  const fid = (s: number) => `sf-${uid}-${Math.round(s * 10)}`;
  const lights = (model.paths as EnvTP[]).map((p, i) => (p.light ? el(p, i) : null)).filter(Boolean);
  const hot = (model.paths as EnvTP[]).map((p, i) => (p.light || p.tone >= 4 ? el(p, i) : null)).filter(Boolean);
  return (
    <g>
      <defs>
        {amounts.map((s) => (
          <filter key={s} id={fid(s)} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={s} />
          </filter>
        ))}
        <filter id={`sf-${uid}-bloomA`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <filter id={`sf-${uid}-bloomB`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={34} />
        </filter>
      </defs>
      {groups.map((g, i) => (g.soft > 0 ? <g key={i} filter={`url(#${fid(g.soft)})`}>{g.items}</g> : <g key={i}>{g.items}</g>))}
      <g filter={`url(#sf-${uid}-bloomB)`} style={{mixBlendMode: 'screen'}} opacity={0.55}>
        {lights}
      </g>
      <g filter={`url(#sf-${uid}-bloomA)`} style={{mixBlendMode: 'screen'}} opacity={0.75}>
        {hot}
      </g>
    </g>
  );
};
