/**
 * Balloons, captions and SFX lettering (builder: comic). Vector overlays drawn above the printed panels
 * in final ink colours, so they can break panel borders and cross gutters like real comic lettering.
 */
import React from 'react';
import {layout, glyphStrokes} from './letters';
import {INKS, PAPER} from './print';

const INK = INKS.k;
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 12.3) * 43758.5453;
  return x - Math.floor(x);
};

/** Stroked lettering (regular + bold + dots) centred on (0,0). */
export const LetterPaths: React.FC<{text: string; size: number; weight?: number; color?: string; seed?: number; align?: 'center' | 'left' | 'right'; lh?: number; tracking?: number; upto?: number}> = ({
  text,
  size,
  weight = 0.125,
  color = INK,
  seed = 1,
  align = 'center',
  lh,
  tracking,
  upto,
}) => {
  const L = layout(text, {size, seed, align, lh, tracking, upto});
  return (
    <g>
      <path d={L.d} fill="none" stroke={color} strokeWidth={size * weight} strokeLinecap="round" strokeLinejoin="round" />
      <path d={L.bold} fill="none" stroke={color} strokeWidth={size * weight * 1.55} strokeLinecap="round" strokeLinejoin="round" />
      {L.dots.map(([x, y, b], i) => (
        <circle key={i} cx={x} cy={y} r={size * weight * (b ? 1.0 : 0.78)} fill={color} />
      ))}
    </g>
  );
};

export interface BalloonProps {
  x: number;
  y: number;
  text: string;
  size: number;
  /** tail tip in the same space */
  tail?: [number, number];
  kind?: 'oval' | 'burst' | 'whisper';
  seed?: number;
  /** extra inner padding (units) */
  pad?: number;
  /** 0..1 pop-in */
  appear?: number;
  /** stretch the oval */
  sx?: number;
  sy?: number;
  line?: number;
  /** fraction of text revealed (typewriter) — balloons in motion comics fill as the line is spoken */
  reveal?: number;
  weight?: number;
  rot?: number;
}

/** Hand-drawn oval balloon with a curved tail. */
export const Balloon: React.FC<BalloonProps> = ({x, y, text, size, tail, kind = 'oval', seed = 1, pad = 0, appear = 1, sx = 1, sy = 1, line, reveal = 1, weight, rot = 0}) => {
  if (appear <= 0) return null;
  const L = layout(text, {size, seed});
  const rx = (L.w / 2) * 1.2 * sx + size * 0.9 + pad;
  const ry = (L.h / 2) * 1.32 * sy + size * 0.85 + pad;
  const W = line ?? Math.max(2.5, size * 0.12);
  const N = kind === 'burst' ? 34 : 72;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    let r = 1 + 0.018 * Math.sin(3 * a + seed) + 0.012 * Math.sin(5 * a + seed * 2.1);
    if (kind === 'burst') r *= i % 2 === 0 ? 1.16 + 0.1 * hash(seed + i) : 0.93;
    pts.push([Math.cos(a) * rx * r, Math.sin(a) * ry * r]);
  }
  const body = kind === 'burst' ? 'M ' + pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L ') + ' Z' : smoothClosed(pts);
  let tailD = '';
  if (tail) {
    const tx = tail[0] - x;
    const ty = tail[1] - y;
    const ang = Math.atan2(ty / ry, tx / rx);
    const spread = 0.2;
    const b1: [number, number] = [Math.cos(ang - spread) * rx * 0.9, Math.sin(ang - spread) * ry * 0.9];
    const b2: [number, number] = [Math.cos(ang + spread) * rx * 0.9, Math.sin(ang + spread) * ry * 0.9];
    // curve the tail a little (comic tails are never straight)
    const mx = (b1[0] + b2[0]) / 2;
    const my = (b1[1] + b2[1]) / 2;
    const nx = -(ty - my);
    const ny = tx - mx;
    const nl = Math.hypot(nx, ny) || 1;
    const bend = 0.12 * Math.hypot(tx - mx, ty - my);
    const cx = (mx + tx) / 2 + (nx / nl) * bend;
    const cy = (my + ty) / 2 + (ny / nl) * bend;
    tailD = `M ${f1(b1[0])} ${f1(b1[1])} Q ${f1(cx)} ${f1(cy)} ${f1(tx)} ${f1(ty)} Q ${f1(cx * 0.92)} ${f1(cy * 0.92)} ${f1(b2[0])} ${f1(b2[1])} Z`;
  }
  const s = appear < 1 ? 0.7 + 0.3 * backOut(appear) : 1;
  const dash = kind === 'whisper' ? `${W * 2.2} ${W * 2.2}` : undefined;
  const upto = reveal >= 1 ? undefined : Math.round(text.replace(/[*\n]/g, '').length * Math.max(0, reveal));
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s.toFixed(4)})`} opacity={Math.min(1, appear * 3)}>
      <path d={body} fill="none" stroke={INK} strokeWidth={W * 2} strokeDasharray={dash} strokeLinejoin="round" />
      {tailD && <path d={tailD} fill="none" stroke={INK} strokeWidth={W * 2} strokeLinejoin="round" />}
      <path d={body} fill={PAPER} />
      {tailD && <path d={tailD} fill={PAPER} />}
      <g opacity={0.999}>
        <LetterPaths text={text} size={size} seed={seed} weight={weight} upto={upto} />
      </g>
    </g>
  );
};

const smoothClosed = (pts: [number, number][]) => {
  const n = pts.length;
  let d = `M ${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C ${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + ' Z';
};

export const backOut = (t: number, s = 2.2) => {
  const u = Math.max(0, Math.min(1, t)) - 1;
  return 1 + (s + 1) * u * u * u + s * u * u;
};

/** Rectangular narration caption. */
export const Caption: React.FC<{x: number; y: number; text: string; size: number; fill?: string; rot?: number; appear?: number; seed?: number; padX?: number; padY?: number; align?: 'left' | 'center'; line?: number; color?: string; anchor?: 'tl' | 'c'}> = ({
  x,
  y,
  text,
  size,
  fill = '#E9DDB0',
  rot = 0,
  appear = 1,
  seed = 3,
  padX,
  padY,
  align = 'left',
  line,
  color = INK,
  anchor = 'tl',
}) => {
  if (appear <= 0) return null;
  const L = layout(text, {size, seed, align});
  const px = padX ?? size * 0.75;
  const py = padY ?? size * 0.62;
  const w = L.w + px * 2;
  const h = L.h + py * 2;
  const W = line ?? Math.max(2.5, size * 0.11);
  const ox = anchor === 'tl' ? w / 2 : 0;
  const oy = anchor === 'tl' ? h / 2 : 0;
  const s = appear < 1 ? 0.85 + 0.15 * backOut(appear) : 1;
  // slightly irregular hand-ruled box
  const j = (k: number) => (hash(seed * 13 + k) - 0.5) * W * 0.9;
  const box = `M ${f1(-w / 2 + j(1))} ${f1(-h / 2 + j(2))} L ${f1(w / 2 + j(3))} ${f1(-h / 2 + j(4))} L ${f1(w / 2 + j(5))} ${f1(h / 2 + j(6))} L ${f1(-w / 2 + j(7))} ${f1(h / 2 + j(8))} Z`;
  return (
    <g transform={`translate(${f1(x + ox)} ${f1(y + oy)}) rotate(${rot}) scale(${s.toFixed(4)})`} opacity={Math.min(1, appear * 3)}>
      <path d={box} fill={fill} stroke={INK} strokeWidth={W} strokeLinejoin="miter" />
      <g transform={align === 'left' ? `translate(0 0)` : undefined}>
        <LetterPaths text={text} size={size} seed={seed} align={align} color={color} />
      </g>
    </g>
  );
};

export interface SfxProps {
  text: string;
  x: number;
  y: number;
  size: number;
  /** scale of the last letter relative to the first */
  grow?: number;
  rot?: number;
  fill?: string;
  /** extrusion vector in units per letter-size */
  depth?: [number, number];
  weight?: number;
  outline?: number;
  appear?: number;
  seed?: number;
  /** per-letter wobble (degrees) */
  wobble?: number;
  shake?: [number, number];
  spacing?: number;
  /** second (inner) outline colour — a thin paper keyline between fill and ink like printed SFX */
  keyline?: string;
}

/** Big SFX lettering: blocky heavy strokes, ink outline, keyline, extruded ink block, growing letters. */
export const Sfx: React.FC<SfxProps> = ({text, x, y, size, grow = 1.4, rot = -8, fill = PAPER, depth = [-0.09, 0.1], weight = 0.3, outline = 0.09, appear = 1, seed = 5, wobble = 7, shake = [0, 0], spacing = 0.08, keyline}) => {
  if (appear <= 0) return null;
  const chars = text.split('');
  const n = chars.length;
  // letter scales + positions along the baseline
  let cx = 0;
  const items = chars.map((ch, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const sc = Math.pow(grow, t);
    const g = glyphStrokes(ch);
    const w = (g.w + weight + spacing) * sc;
    const it = {ch, sc, x: cx + (g.w * sc) / 2, g, r: (hash(seed + i) - 0.5) * wobble, dy: (hash(seed + i * 3) - 0.5) * 0.12};
    cx += w;
    return it;
  });
  const total = cx;
  const pop = appear < 1 ? 0.4 + 0.6 * backOut(appear, 3) : 1;
  const el = (layer: 'ext' | 'out' | 'key' | 'fill') =>
    items.map((it, i) => {
      const ss = it.sc * size;
      const d = it.g.s
        .map((st) => 'M ' + st.map(([a, b]) => `${f1((a - it.g.w / 2) * ss)} ${f1((b + 0.5) * ss)}`).join(' L '))
        .join(' ');
      const dots = it.g.dots.map(([a, b]) => [(a - it.g.w / 2) * ss, (b + 0.5) * ss]);
      const wBase = weight * ss;
      const w = layer === 'fill' ? wBase : layer === 'key' ? wBase + outline * ss * 0.7 : wBase + outline * ss * 2;
      const col = layer === 'fill' ? fill : layer === 'key' ? keyline ?? fill : INK;
      const off = layer === 'ext' ? `translate(${f1(depth[0] * ss)} ${f1(depth[1] * ss)})` : '';
      const base = (x0: number) => `translate(${f1(x0 * size - (total * size) / 2)} ${f1(it.dy * ss - ((it.sc - 1) * size) / 2)}) rotate(${it.r.toFixed(2)})`;
      const inner = (
        <>
          <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="square" strokeLinejoin="miter" strokeMiterlimit={3} />
          {dots.map(([a, b], k) => (
            <rect key={k} x={a - w * 0.62} y={b - w * 0.62 - wBase * 0.3} width={w * 1.24} height={w * 1.24} fill={col} />
          ))}
        </>
      );
      if (layer === 'ext') {
        // extrusion: a few stacked copies make a solid block
        return (
          <g key={i} transform={base(it.x)}>
            {[0.25, 0.5, 0.75, 1].map((k) => (
              <g key={k} transform={`translate(${f1(depth[0] * ss * k)} ${f1(depth[1] * ss * k)})`}>
                <path d={d} fill="none" stroke={INK} strokeWidth={wBase + outline * ss * 2} strokeLinecap="square" strokeLinejoin="miter" strokeMiterlimit={3} />
              </g>
            ))}
          </g>
        );
      }
      return (
        <g key={i} transform={base(it.x) + off}>
          {inner}
        </g>
      );
    });
  return (
    <g transform={`translate(${f1(x + shake[0])} ${f1(y + shake[1])}) rotate(${rot}) scale(${pop.toFixed(4)})`} opacity={Math.min(1, appear * 4)}>
      {el('ext')}
      {el('out')}
      {keyline && el('key')}
      {el('fill')}
    </g>
  );
};
