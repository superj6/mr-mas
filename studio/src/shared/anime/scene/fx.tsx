// ANIME SCENE compositing kit (satsuei): focus lines, speed streaks, kira glint, relight filters, impact frame.
// Owned by the animescene builder. Wraps (never edits) the shared anime rig kit.
import React from 'react';
import {prng} from '../ink';
import {FONT} from '../../theme/fonts';

/**
 * Focus lines ("shuchūsen"): wedge strokes converging on (cx, cy), leaving an elliptical clear zone.
 * Re-seed on 2s so the lines "boil" like hand-drawn TV focus lines.
 */
export const FocusLines: React.FC<{
  cx: number;
  cy: number;
  seed: number;
  n?: number;
  rx?: number;
  ry?: number;
  spread?: number;
  color?: string;
  opacity?: number;
  w?: [number, number];
}> = ({cx, cy, seed, n = 150, rx = 520, ry = 330, spread = 0.9, color = '#FFE9CF', opacity = 0.6, w = [3, 22]}) => {
  const r = prng(seed);
  const R = 2600;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const k = 1 + Math.pow(r(), 1.7) * spread;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const ix = cx + ca * rx * k;
    const iy = cy + sa * ry * k;
    const ox = cx + ca * R;
    const oy = cy + sa * R;
    const ww = w[0] + Math.pow(r(), 3) * (w[1] - w[0]);
    const px = -sa * ww;
    const py = ca * ww;
    d += `M${ix.toFixed(1)} ${iy.toFixed(1)}L${(ox + px).toFixed(1)} ${(oy + py).toFixed(1)}L${(ox - px).toFixed(1)} ${(oy - py).toFixed(1)}Z`;
  }
  return <path d={d} fill={color} opacity={opacity} />;
};

/** Horizontal speed streaks (entrance whoosh). dir -1 = motion toward screen-left. */
export const SpeedStreaks: React.FC<{seed: number; n?: number; y?: [number, number]; x?: [number, number]; len?: [number, number]; color?: string; opacity?: number; th?: [number, number]}> = ({
  seed,
  n = 40,
  y = [60, 1020],
  x = [0, 1920],
  len = [260, 900],
  color = '#FFF1DE',
  opacity = 0.5,
  th = [1.5, 7],
}) => {
  const r = prng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const yy = y[0] + r() * (y[1] - y[0]);
    const L = len[0] + r() * (len[1] - len[0]);
    const x0 = x[0] + r() * (x[1] - x[0] + L) - L;
    const h = th[0] + Math.pow(r(), 2) * (th[1] - th[0]);
    const xm = x0 + L * 0.72;
    d += `M${x0.toFixed(1)} ${yy.toFixed(1)}Q${xm.toFixed(1)} ${(yy - h).toFixed(1)} ${(x0 + L).toFixed(1)} ${yy.toFixed(1)}Q${xm.toFixed(1)} ${(yy + h).toFixed(1)} ${x0.toFixed(1)} ${yy.toFixed(1)}Z`;
  }
  return <path d={d} fill={color} opacity={opacity} />;
};

/** The anime "kira" glint: a concave 4-point star + a smaller diagonal one + soft core. */
export const Kira: React.FC<{x: number; y: number; r: number; rot?: number; op?: number; color?: string; glow?: string}> = ({x, y, r, rot = 0, op = 1, color = '#FFFFFF', glow = '#BFF6FF'}) => {
  if (op <= 0 || r <= 0) return null;
  const star = (s: number, k = 0.06) => `M0 ${-s}Q${s * k} ${-s * k} ${s} 0Q${s * k} ${s * k} 0 ${s}Q${-s * k} ${s * k} ${-s} 0Q${-s * k} ${-s * k} 0 ${-s}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
      <circle r={r * 0.55} fill={glow} opacity={0.35} style={{filter: `blur(${Math.max(1, r * 0.18)}px)`}} />
      <path d={star(r)} fill={color} />
      <path d={star(r * 0.42, 0.1)} transform="rotate(45)" fill={color} opacity={0.85} />
      <circle r={r * 0.09} fill="#FFFFFF" />
    </g>
  );
};

/**
 * Relight filter: an automatic rim + soft light-wrap on the edges of ANY group facing (dx, dy),
 * screened on top. Apply on an untransformed wrapper <g> so offsets are screen px.
 */
export const RimFilter: React.FC<{id: string; dx: number; dy: number; color: string; opacity: number; wrap?: number; blur?: number}> = ({id, dx, dy, color, opacity, wrap = 0.45, blur = 1.1}) => {
  const L = Math.hypot(dx, dy) || 1;
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
      <feOffset in="SourceAlpha" dx={-dx} dy={-dy} result="o1" />
      <feComposite in="SourceAlpha" in2="o1" operator="out" result="b1" />
      <feGaussianBlur in="b1" stdDeviation={blur} result="b1b" />
      <feOffset in="SourceAlpha" dx={-dx * 5} dy={-dy * 5} result="o2" />
      <feComposite in="SourceAlpha" in2="o2" operator="out" result="b2" />
      <feGaussianBlur in="b2" stdDeviation={L * 3.5} result="b2b" />
      <feComponentTransfer in="b2b" result="b2c">
        <feFuncA type="linear" slope={wrap} />
      </feComponentTransfer>
      <feMerge result="bands">
        <feMergeNode in="b2c" />
        <feMergeNode in="b1b" />
      </feMerge>
      <feComposite in="bands" in2="SourceAlpha" operator="in" result="bin" />
      <feFlood floodColor={color} floodOpacity={opacity} result="c" />
      <feComposite in="c" in2="bin" operator="in" result="rim" />
      <feBlend in="rim" in2="SourceGraphic" mode="screen" />
    </filter>
  );
};

/** Backlit edge glow all around a silhouette (erode -> band -> blur), for figures against a light. */
export const EdgeGlowFilter: React.FC<{id: string; r: number; color: string; opacity: number; blur?: number; outer?: number}> = ({id, r, color, opacity, blur = 1.4, outer = 0}) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
    <feMorphology in="SourceAlpha" operator="erode" radius={r} result="er" />
    <feComposite in="SourceAlpha" in2="er" operator="out" result="band" />
    <feGaussianBlur in="band" stdDeviation={blur} result="bb" />
    <feComposite in="bb" in2="SourceAlpha" operator="in" result="bin" />
    <feFlood floodColor={color} floodOpacity={opacity} result="c" />
    <feComposite in="c" in2="bin" operator="in" result="rim" />
    <feGaussianBlur in="SourceAlpha" stdDeviation={outer || 0.001} result="halo0" />
    <feComposite in="c" in2="halo0" operator="in" result="halo1" />
    <feComponentTransfer in="halo1" result="halo">
      <feFuncA type="linear" slope={outer ? 0.55 : 0} />
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="halo" />
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="rim" />
    </feMerge>
  </filter>
);

/** Flatten a group to a single colour (cast shadows, silhouettes, mattes). */
export const FlatFilter: React.FC<{id: string; color: string; opacity?: number; blur?: number}> = ({id, color, opacity = 1, blur = 0}) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
    <feFlood floodColor={color} floodOpacity={opacity} result="c" />
    <feComposite in="c" in2="SourceAlpha" operator="in" result="f" />
    <feGaussianBlur in="f" stdDeviation={blur || 0.001} />
  </filter>
);

/**
 * Impact frame (1-2 frames on a hit): luminance -> hard 3-step duotone, optionally inverted.
 * The classic TV-anime "flash" frame done in compositing, not redrawn.
 */
export const ImpactFilter: React.FC<{id: string; dark?: string; mid?: string; light?: string; invert?: boolean; cut?: [number, number]}> = ({
  id,
  dark = '#140407',
  mid = '#C8242E',
  light = '#FFF1DE',
  invert = false,
}) => {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const cols = invert ? [light, light, mid, dark, dark, dark] : [dark, dark, dark, mid, light, light];
  const ch = (k: number) => cols.map((c) => hex(c)[k].toFixed(3)).join(' ');
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.35 0.55 0.1 0 0.02  0.35 0.55 0.1 0 0.02  0.35 0.55 0.1 0 0.02  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues={ch(0)} />
        <feFuncG type="discrete" tableValues={ch(1)} />
        <feFuncB type="discrete" tableValues={ch(2)} />
      </feComponentTransfer>
    </filter>
  );
};

/** Streaming-anime subtitle (white, dark outline + soft shadow), bottom centre. */
export const Subtitle: React.FC<{text: string; opacity?: number; italic?: boolean; size?: number; bottom?: number}> = ({text, opacity = 1, italic = false, size = 50, bottom = 74}) => {
  if (!text || opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        textAlign: 'center',
        fontFamily: FONT.bass,
        fontWeight: 400,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        letterSpacing: 0.4,
        color: '#FBFAF6',
        opacity,
        WebkitTextStroke: '7px rgba(10,10,20,0.92)',
        paintOrder: 'stroke fill',
        textShadow: '0 3px 10px rgba(0,0,0,0.55)',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};
