// Realism kit — painting primitives (builder key: realism).
// Everything is SVG: soft (blurred) form shadows clipped to crisp silhouettes, ragged brush edges via
// turbulence displacement, bristle-streak texture, and tapered strokes. Filters live in the element's own
// user space, so texture moves with the character (no shower-door).
import React, {useId} from 'react';
import {taper, P, spline} from './geom';

export const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

/** Blur filter region generous enough for big blurs. */
const R = {x: '-60%', y: '-60%', width: '220%', height: '220%'} as const;

/** A soft-edged painted shape: path blurred by r (in local units). Optional ragged brush edge. */
export const Soft: React.FC<{
  d: string;
  fill: string;
  r?: number;
  op?: number;
  rag?: number;
  seed?: number;
  blend?: React.CSSProperties['mixBlendMode'];
  transform?: string;
}> = ({d, fill, r = 6, op = 1, rag = 0, seed = 3, blend, transform}) => {
  const id = useUid();
  if (r <= 0 && rag <= 0) return <path d={d} fill={fill} opacity={op} transform={transform} style={blend ? {mixBlendMode: blend} : undefined} />;
  return (
    <g transform={transform} style={blend ? {mixBlendMode: blend} : undefined}>
      <filter id={id} {...R} colorInterpolationFilters="sRGB">
        {rag > 0 ? (
          <>
            <feTurbulence type="fractalNoise" baseFrequency={0.045} numOctaves={3} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={rag} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={Math.max(0.01, r)} />
          </>
        ) : (
          <feGaussianBlur stdDeviation={r} />
        )}
      </filter>
      <path d={d} fill={fill} opacity={op} filter={`url(#${id})`} />
    </g>
  );
};

/** Soft stroke along a spline (a blurred tapered brush stroke). */
export const Stroke: React.FC<{
  pts: P[];
  w: number;
  fill: string;
  r?: number;
  op?: number;
  a?: number;
  b?: number;
  bias?: number;
  blend?: React.CSSProperties['mixBlendMode'];
  rag?: number;
  seed?: number;
}> = ({pts, w, fill, r = 0, op = 1, a = 0.05, b = 0.05, bias = 0.5, blend, rag = 0, seed}) => (
  <Soft d={taper(pts, w, a, b, bias)} fill={fill} r={r} op={op} blend={blend} rag={rag} seed={seed} />
);

/** Clip-path helper: renders children clipped to a path. */
export const Clip: React.FC<{d: string; children: React.ReactNode; transform?: string}> = ({d, children, transform}) => {
  const id = useUid();
  return (
    <g transform={transform}>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

/**
 * Bristle / canvas texture laid over a region (clipped). Streak direction `angle` (deg), scale `s`.
 * Uses soft-light so it modulates value without changing hue much.
 */
export const Bristle: React.FC<{
  d: string;
  angle?: number;
  op?: number;
  seed?: number;
  s?: number;
  box?: [number, number, number, number];
  blend?: React.CSSProperties['mixBlendMode'];
}> = ({d, angle = -20, op = 0.35, seed = 5, s = 1, box = [-400, -400, 800, 800], blend = 'soft-light'}) => {
  const id = useUid();
  const [x, y, w, h] = box;
  return (
    <Clip d={d}>
      <filter id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={`${0.012 / s} ${0.05 / s}`} numOctaves={4} seed={seed} result="t" />
        <feColorMatrix
          in="t"
          type="matrix"
          values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  2.2 0 0 0 -0.6"
          result="a"
        />
        <feComponentTransfer in="t" result="g">
          <feFuncR type="linear" slope={2.4} intercept={-0.7} />
          <feFuncG type="linear" slope={2.4} intercept={-0.7} />
          <feFuncB type="linear" slope={2.4} intercept={-0.7} />
          <feFuncA type="linear" slope={0} intercept={1} />
        </feComponentTransfer>
        <feColorMatrix in="g" type="saturate" values="0" />
      </filter>
      <g style={{mixBlendMode: blend}} opacity={op}>
        <rect x={x} y={y} width={w} height={h} filter={`url(#${id})`} transform={`rotate(${angle} ${x + w / 2} ${y + h / 2})`} />
      </g>
    </Clip>
  );
};

/** Film grain overlay (full frame). Seed changes per frame (deterministic). */
export const FilmGrain: React.FC<{w: number; h: number; seed: number; op?: number; freq?: number}> = ({w, h, seed, op = 0.12, freq = 0.75}) => {
  const id = useUid();
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none'}}>
      <filter id={id} x={0} y={0} width={w} height={h} filterUnits="userSpaceOnUse">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={1.8} intercept={-0.4} />
          <feFuncG type="linear" slope={1.8} intercept={-0.4} />
          <feFuncB type="linear" slope={1.8} intercept={-0.4} />
        </feComponentTransfer>
      </filter>
      <rect width={w} height={h} filter={`url(#${id})`} />
    </svg>
  );
};

/** Group with a gaussian blur (depth of field). r in screen px (the group is assumed unscaled). */
export const Dof: React.FC<{r: number; children: React.ReactNode}> = ({r, children}) => {
  const id = useUid();
  if (r < 0.25) return <g>{children}</g>;
  return (
    <g>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={r} />
      </filter>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
};

/** Radial light pool (additive-ish glow). */
export const Glow: React.FC<{cx: number; cy: number; rx: number; ry?: number; color: string; op?: number; blend?: React.CSSProperties['mixBlendMode']; rot?: number}> = ({
  cx,
  cy,
  rx,
  ry,
  color,
  op = 1,
  blend = 'screen',
  rot = 0,
}) => {
  const id = useUid();
  return (
    <g style={{mixBlendMode: blend}} opacity={op}>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={1} />
        <stop offset="0.35" stopColor={color} stopOpacity={0.45} />
        <stop offset="0.7" stopColor={color} stopOpacity={0.12} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx} fill={`url(#${id})`} transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined} />
    </g>
  );
};

/** Linear gradient fill helper: returns [defs element, url]. */
export const LinGrad: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; stops: [number, string, number?][]}> = ({id, x1, y1, x2, y2, stops}) => (
  <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
    {stops.map(([o, c, a], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />
    ))}
  </linearGradient>
);

export const sp = spline;
