import React from 'react';
import {curve, ell, ink, lerpPts, Pt, shift} from './ink';

/** Shared rig params for every anime bust (Mas, Nole, ...). */
export type Mouth = 'rest' | 'smile' | 'A' | 'E' | 'O' | 'M';
export interface AnimeRig {
  /** Pupils -1..1 (x>0 = toward screen-right / the monitor, x<0 = toward camera). */
  lookX?: number;
  lookY?: number;
  /** 0 open .. 1 closed (>0.9 draws the closed-lid drawing). */
  lid?: number;
  mouth?: Mouth;
  /** Brow -1 (knit/down) .. 1 (raised). */
  brow?: number;
  /** Head tilt in degrees around the neck pivot. */
  tilt?: number;
  /** Hair spring offset in local units at the lock tips (drive with a damped spring). */
  hairX?: number;
  hairY?: number;
  /** Key-light (monitor) intensity multiplier, for flicker. */
  light?: number;
  /** Line-weight multiplier (use < 1 on close-ups so lines stay pen-sized on screen). */
  ink?: number;
  /** Unique id prefix for SVG defs when several instances share a page. */
  uid?: string;
  /** Night-color multiply over the whole character, 0..1 (compositing, not a separate palette). */
  night?: number;
}

export interface EyeSpec {
  /** Upper lash line, outer corner -> inner corner. */
  upper: Pt[];
  /** Lower lid, outer -> inner (same direction as upper). */
  lower: Pt[];
  /** Upper lid when fully closed (same point count as upper). */
  closed: Pt[];
  iris: {cx: number; cy: number; rx: number; ry: number; rangeX: number; rangeY: number};
  lash: number;
  lashPress?: number[];
  /** Lower-lid line drawn over this index range of `lower`. */
  lowerSpan?: [number, number];
  crease?: Pt[];
  bag?: Pt[];
  flick?: Pt[];
}

export interface EyeColors {
  white: string;
  whiteShade: string;
  irisTop: string;
  irisMid: string;
  irisBot: string;
  pupil: string;
  line: string;
  lineSoft: string;
  glint: string;
}

const corner = (p: Pt): Pt => [p[0], p[1], 1];

export const Eye: React.FC<{id: string; spec: EyeSpec; c: EyeColors; lookX: number; lookY: number; lid: number; k: number; light: number}> = ({id, spec, c, lookX, lookY, lid, k, light}) => {
  const t = Math.max(0, Math.min(1, lid));
  const up = lerpPts(spec.upper, spec.closed, t);
  const closed = t > 0.9;
  const n = up.length;
  const white = curve([corner(up[0]), ...up.slice(1, n - 1), corner(up[n - 1]), ...[...spec.lower].reverse().slice(1, spec.lower.length - 1)], true);
  const {cx, cy, rx, ry, rangeX, rangeY} = spec.iris;
  const ix = cx + lookX * rangeX;
  const iy = cy + lookY * rangeY + t * ry * 0.35;
  const lidShadow = curve([...up, ...shift(up, 0, ry * 0.42).reverse()], true);
  const crease = spec.crease ? shift(spec.crease, 0, t * ry * 0.35) : null;
  const lo = spec.lowerSpan ? spec.lower.slice(spec.lowerSpan[0], spec.lowerSpan[1] + 1) : spec.lower;
  return (
    <g>
      {!closed && (
        <>
          <defs>
            <clipPath id={`${id}-w`}>
              <path d={white} />
            </clipPath>
            <linearGradient id={`${id}-ig`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c.irisTop} />
              <stop offset="0.5" stopColor={c.irisMid} />
              <stop offset="1" stopColor={c.irisBot} />
            </linearGradient>
          </defs>
          <path d={white} fill={c.white} />
          <g clipPath={`url(#${id}-w)`}>
            <path d={ell(ix, iy, rx, ry)} fill={`url(#${id}-ig)`} />
            <path d={ell(ix, iy + ry * 0.06, rx * 0.62, ry * 0.66)} fill="none" stroke={c.irisBot} strokeWidth={Math.max(0.6, rx * 0.08)} opacity={0.45} />
            <path d={ell(ix, iy + ry * 0.06, rx * 0.44, ry * 0.5)} fill={c.pupil} opacity={0.92} />
            <path d={ell(ix, iy, rx, ry)} fill="none" stroke={c.pupil} strokeWidth={1.4 * k} opacity={0.85} />
            {/* reflected monitor light low in the iris */}
            <path d={ell(ix + rx * 0.12, iy + ry * 0.55, rx * 0.62, ry * 0.26)} fill={c.glint} opacity={0.35 * light} />
            <path d={lidShadow} fill={c.whiteShade} opacity={0.9} />
            <path d={ell(ix + rx * 0.4, iy - ry * 0.38, Math.max(1.6, rx * 0.27), Math.max(1.6, ry * 0.2), -20)} fill="#FFFFFF" />
            <path d={ell(ix - rx * 0.38, iy + ry * 0.36, Math.max(0.9, rx * 0.11), Math.max(0.9, ry * 0.09))} fill={c.glint} opacity={Math.min(1, 0.9 * light)} />
          </g>
        </>
      )}
      {crease && <path d={ink(crease, 1.7 * k, {a: 0.3, b: 0.4})} fill={c.lineSoft} />}
      {spec.bag && !closed && <path d={ink(spec.bag, 1.3 * k, {a: 0.4, b: 0.4})} fill={c.lineSoft} opacity={0.55} />}
      {!closed && <path d={ink(lo, 1.7 * k, {a: 0.35, b: 0.45})} fill={c.lineSoft} />}
      <path d={ink(up, spec.lash * k * (closed ? 0.8 : 1), {a: 0.04, b: 0.3, tip: 0.2, press: spec.lashPress})} fill={c.line} />
      {spec.flick && <path d={ink(lerpPts(spec.flick, shift(spec.flick, 0, 4), t), spec.lash * 0.55 * k, {a: 0.05, b: 0.8})} fill={c.line} />}
    </g>
  );
};

/**
 * Rim light that follows any silhouette automatically: the band of `shapes` whose points, pushed by
 * (dx, dy), fall outside the silhouette. Survives tilt/spring because it is recomputed from the shapes.
 */
export const Rim: React.FC<{id: string; shapes: string[]; dx: number; dy: number; color: string; opacity: number; blur?: number}> = ({id, shapes, dx, dy, color, opacity, blur = 0}) => {
  if (opacity <= 0.001) return null;
  return (
    <g>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={4000} height={4000}>
          <g fill="#FFF">
            {shapes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill="#000" transform={`translate(${-dx} ${-dy})`}>
            {shapes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </mask>
        {blur > 0 && (
          <filter id={`${id}-b`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        )}
      </defs>
      <g mask={`url(#${id})`}>
        <rect x={-2000} y={-2000} width={4000} height={4000} fill={color} opacity={opacity} filter={blur > 0 ? `url(#${id}-b)` : undefined} />
      </g>
    </g>
  );
};

/** Group clipped to a set of paths (cel shadow layers are painted loosely, then clipped to the base color). */
export const Clip: React.FC<{id: string; d: string | string[]; children: React.ReactNode; transform?: string}> = ({id, d, children, transform}) => (
  <g>
    <defs>
      <clipPath id={id}>
        {(Array.isArray(d) ? d : [d]).map((x, i) => (
          <path key={i} d={x} transform={transform} />
        ))}
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);

/** Soft blur filter for the 1-step soft highlight. */
export const SoftDef: React.FC<{id: string; r: number}> = ({id, r}) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation={r} />
  </filter>
);

export interface MouthSpec {
  rest: Pt[];
  smile: Pt[];
  M: Pt[];
  /** Open shapes: [upper, lower] contours, corner -> corner. */
  A: [Pt[], Pt[]];
  E: [Pt[], Pt[]];
  O: Pt[];
}
export interface MouthColors {
  line: string;
  lineSoft: string;
  interior: string;
  tongue: string;
  teeth: string;
}

export const MouthDraw: React.FC<{id: string; shape: Mouth; spec: MouthSpec; c: MouthColors; k: number}> = ({id, shape, spec, c, k}) => {
  if (shape === 'rest' || shape === 'smile' || shape === 'M') {
    const pts = spec[shape];
    return <path d={ink(pts, (shape === 'M' ? 3.6 : 3) * k, {a: 0.3, b: 0.35, press: shape === 'M' ? [0.9, 1.2, 1, 0.8] : [1, 1.1, 0.9, 0.7]})} fill={c.line} />;
  }
  let upper: Pt[];
  let lower: Pt[];
  if (shape === 'O') {
    const o = spec.O;
    const h = Math.ceil(o.length / 2);
    upper = o.slice(0, h + 1);
    lower = [...o.slice(h), o[0]].reverse();
  } else {
    [upper, lower] = spec[shape];
  }
  const shapeD = curve([corner(upper[0]), ...upper.slice(1, -1), corner(upper[upper.length - 1]), ...[...lower].reverse().slice(1, -1)], true);
  const ys = [...upper, ...lower].map((p) => p[1]);
  const xs = [...upper, ...lower].map((p) => p[0]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const wdt = Math.max(...xs) - Math.min(...xs);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-m`}>
          <path d={shapeD} />
        </clipPath>
      </defs>
      <path d={shapeD} fill={c.interior} />
      <g clipPath={`url(#${id}-m)`}>
        {shape !== 'O' && <path d={curve([...upper, ...shift(upper, 0, shape === 'E' ? 5.5 : 4).reverse()], true)} fill={c.teeth} />}
        <path d={ell(midX + wdt * 0.06, maxY + 2, wdt * 0.34, (maxY - minY) * 0.42)} fill={c.tongue} />
      </g>
      <path d={ink(upper, 3.2 * k, {a: 0.2, b: 0.25})} fill={c.line} />
      <path d={ink(lower.slice(1, -1).length >= 2 ? lower.slice(1, -1) : lower, 1.8 * k, {a: 0.4, b: 0.4})} fill={c.lineSoft} />
    </g>
  );
};
