// SATIRE structure — shared puppet-shop kit: filters, soft shading groups, glass eyes, rim light.
import React from 'react';
import {blob, lerp, type Mapper, type XY} from './lib';

export const BLURS = [0.8, 1.2, 1.6, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60];
/** Global filters. Put once per <svg>. */
export const PuppetDefs: React.FC<{prefix?: string}> = ({prefix = 'p'}) => (
  <defs>
    {BLURS.map((s) => (
      <filter key={s} id={`${prefix}b${String(s).replace('.', '_')}`} filterUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={s} />
      </filter>
    ))}
    {/* latex paint mottling: low-frequency blotches */}
    <filter id={`${prefix}mottle`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={11} result="n" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.55  0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 1.6 -0.62"
      />
    </filter>
    {/* fine sculpt/skin pore grain */}
    <filter id={`${prefix}pores`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={4} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 2.2 -1.25" />
    </filter>
  </defs>
);

export const bl = (s: number, prefix = 'p') => {
  let best = BLURS[0];
  for (const b of BLURS) if (Math.abs(b - s) < Math.abs(best - s)) best = b;
  return `url(#${prefix}b${String(best).replace('.', '_')})`;
};

/** A group of soft (blurred) shading shapes, optionally clipped and blended. */
export const Soft: React.FC<{
  blur?: number;
  clip?: string;
  blend?: React.CSSProperties['mixBlendMode'];
  op?: number;
  children: React.ReactNode;
}> = ({blur, clip, blend, op = 1, children}) => {
  const inner = (
    <g filter={blur ? bl(blur) : undefined} style={blend ? {mixBlendMode: blend} : undefined} opacity={op}>
      {children}
    </g>
  );
  return clip ? <g clipPath={`url(#${clip})`}>{inner}</g> : inner;
};

/** Rim light: a crescent = shape minus shape shifted by (dx,dy), blurred. */
export const Rim: React.FC<{
  id: string;
  d: string;
  dx: number;
  dy: number;
  color: string;
  op: number;
  blur?: number;
  clip?: boolean;
  blend?: React.CSSProperties['mixBlendMode'];
}> = ({id, d, dx, dy, color, op, blur = 4, clip = true, blend = 'screen'}) => {
  if (op <= 0.001) return null;
  const body = (
    <g filter={bl(blur)} opacity={op}>
      <path d={d} fill={color} mask={`url(#${id}-m)`} />
    </g>
  );
  return (
    <g style={{mixBlendMode: blend}}>
      <defs>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000">
          <path d={d} fill="#fff" />
          <path d={d} fill="#000" transform={`translate(${dx} ${dy})`} />
        </mask>
        {clip ? (
          <clipPath id={`${id}-c`}>
            <path d={d} />
          </clipPath>
        ) : null}
      </defs>
      {clip ? <g clipPath={`url(#${id}-c)`}>{body}</g> : body}
    </g>
  );
};

export interface EyeSpec {
  id: string;
  /** sculpt-space eyeball centre and radius */
  c: XY;
  r: number;
  /** aperture: upper arc & lower arc points, inner->outer, same length */
  upper: XY[];
  lower: XY[];
  /** 0 open .. 1 closed (upper lid) */
  lid: number;
  /** lower lid push up 0..1 (smile) */
  lowerLid?: number;
  /** gaze in radians relative to head forward */
  gazeX: number;
  gazeY: number;
  /** head yaw/pitch (radians) so gaze foreshortening is correct */
  headYaw: number;
  headPitch: number;
  iris: string;
  irisDark: string;
  irisR: number;
  skinLid: string;
  skinLidDark: string;
  lash: string;
  /** reflection of the key light: screen-space offset factor (-1..1) */
  keyRefl: XY;
  keyColor: string;
  keyOp: number;
  warmRefl?: XY;
  warmOp?: number;
  /** eyeball depth offset for projecting its centre */
  zc: number;
  lightDir?: XY;
  skinLidHi?: string;
}

/** Glass puppet eye: sclera sphere, iris lens, key-light window reflection, latex lids. */
export const GlassEye: React.FC<{e: EyeSpec; P: Mapper; Pz: (x: number, y: number, dz: number) => XY}> = ({e, P, Pz}) => {
  const [cx, cy] = Pz(e.c[0], e.c[1], e.zc);
  const R = e.r;
  const lidEdge: XY[] = e.upper.map((u, i) => {
    const lo = e.lower[i];
    return [lerp(u[0], lo[0], e.lid), lerp(u[1], lo[1], e.lid * 0.98)];
  });
  const lowPush = e.lowerLid ?? 0;
  const lowEdge: XY[] = e.lower.map((lo, i) => {
    const u = e.upper[i];
    return [lo[0], lerp(lo[1], u[1], lowPush * 0.28)];
  });
  const openPts: XY[] = [...lidEdge, ...[...lowEdge].reverse().slice(1, -1)];
  const apPts: XY[] = [...e.upper, ...[...e.lower].reverse().slice(1, -1)];
  const open = blob(openPts.map(([x, y]) => P(x, y)));
  const ap = blob(apPts.map(([x, y]) => P(x, y)));
  const lidPath = blob(lidEdge.map(([x, y]) => P(x, y)), false);
  const lowPath = blob(lowEdge.map(([x, y]) => P(x, y)), false);
  // lid shape: from lid edge up around the aperture's upper arc (raised a little)
  const upRaised: XY[] = e.upper.map(([x, y], i) => [x + (i === 0 ? -4 : i === e.upper.length - 1 ? 4 : 0), y - 18]);
  const lidShape = blob([...lidEdge, ...[...upRaised].reverse()].map(([x, y]) => P(x, y)));
  const apTop = Math.min(...e.upper.map(([x, y]) => P(x, y)[1]));

  const gy = e.gazeX + e.headYaw;
  const gp = e.gazeY + e.headPitch;
  const ix = cx + Math.sin(gy) * R * 0.78;
  const iy = cy - Math.sin(gp) * R * 0.78;
  const irx = e.irisR * Math.cos(gy);
  const iry = e.irisR * Math.cos(gp);
  const id = e.id;
  const kx = cx + e.keyRefl[0] * R * 0.5;
  const ky = cy + e.keyRefl[1] * R * 0.5;
  const irisRot = 0;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-open`}>
          <path d={open} />
        </clipPath>
        <radialGradient id={`${id}-scl`} cx={cx - R * 0.25} cy={cy - R * 0.3} r={R * 1.25} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F4F1EA" />
          <stop offset="0.55" stopColor="#DCD6CE" />
          <stop offset="0.85" stopColor="#A89A96" />
          <stop offset="1" stopColor="#7A6663" />
        </radialGradient>
        <radialGradient id={`${id}-iris`} cx={ix} cy={iy} r={e.irisR} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${ix} ${iy}) scale(${Math.max(0.2, Math.cos(gy))} ${Math.max(0.2, Math.cos(gp))}) translate(${-ix} ${-iy})`}>
          <stop offset="0" stopColor="#050506" />
          <stop offset="0.36" stopColor="#060607" />
          <stop offset="0.42" stopColor={e.irisDark} />
          <stop offset="0.62" stopColor={e.iris} />
          <stop offset="0.86" stopColor={e.irisDark} />
          <stop offset="1" stopColor="#15110F" />
        </radialGradient>
      </defs>
      {/* wet dark aperture edge */}
      <path d={ap} fill="#5A2A26" />
      <g clipPath={`url(#${id}-open)`}>
        <circle cx={cx} cy={cy} r={R * 1.1} fill={`url(#${id}-scl)`} />
        {/* pinkish corners */}
        <g filter={bl(4)} opacity={0.55}>
          <path d={blob([P(e.upper[0][0] - 2, e.upper[0][1]), P(e.upper[0][0] + R * 0.25, e.upper[0][1] - R * 0.15), P(e.upper[0][0] + R * 0.25, e.upper[0][1] + R * 0.25)])} fill="#C77F78" />
        </g>
        {/* iris lens */}
        <g transform={`rotate(${irisRot} ${ix} ${iy})`}>
          <ellipse cx={ix} cy={iy} rx={irx} ry={iry} fill={`url(#${id}-iris)`} />
          {/* striations */}
          <g opacity={0.35} stroke={e.iris} strokeWidth={Math.max(0.6, e.irisR * 0.035)}>
            {Array.from({length: 18}).map((_, i) => {
              const a = (i / 18) * Math.PI * 2 + 0.13;
              const r0 = 0.45;
              const r1 = 0.86 + ((i * 37) % 7) * 0.012;
              return (
                <line
                  key={i}
                  x1={ix + Math.cos(a) * irx * r0}
                  y1={iy + Math.sin(a) * iry * r0}
                  x2={ix + Math.cos(a) * irx * r1}
                  y2={iy + Math.sin(a) * iry * r1}
                />
              );
            })}
          </g>
          {/* caustic: light passing the cornea brightens the iris opposite the reflection */}
          <g filter={bl(2)} opacity={0.55} style={{mixBlendMode: 'screen'}}>
            <ellipse cx={ix - e.keyRefl[0] * irx * 0.42} cy={iy - e.keyRefl[1] * iry * 0.42} rx={irx * 0.36} ry={iry * 0.3} fill={e.keyColor} />
          </g>
        </g>
        {/* upper lid shadow on the eyeball */}
        <g filter={bl(Math.max(2, R * 0.12))} opacity={0.8}>
          <path d={lidPath} fill="none" stroke="#1A0C0B" strokeWidth={R * 0.34} />
        </g>
        {/* soft occlusion at the rim */}
        <g filter={bl(Math.max(2, R * 0.1))} opacity={0.35}>
          <path d={open} fill="none" stroke="#3A1A18" strokeWidth={R * 0.2} />
        </g>
        {/* glass reflections: the monitor window + a soft glint */}
        <g style={{mixBlendMode: 'screen'}}>
          <g filter={bl(1.2)} opacity={e.keyOp}>
            <rect x={kx - R * 0.2} y={ky - R * 0.15} width={R * 0.4} height={R * 0.3} rx={R * 0.06} fill={e.keyColor} />
          </g>
          <g filter={bl(Math.max(2, R * 0.12))} opacity={e.keyOp * 0.5}>
            <ellipse cx={kx} cy={ky} rx={R * 0.4} ry={R * 0.32} fill={e.keyColor} />
          </g>
          <circle cx={kx + R * 0.22} cy={ky + R * 0.3} r={R * 0.05} fill="#fff" opacity={e.keyOp * 0.8} />
          {e.warmRefl && (e.warmOp ?? 0) > 0 ? (
            <g filter={bl(1.2)} opacity={e.warmOp}>
              <rect x={cx + e.warmRefl[0] * R * 0.62 - R * 0.05} y={cy + e.warmRefl[1] * R * 0.62 - R * 0.14} width={R * 0.1} height={R * 0.28} rx={R * 0.03} fill="#FFC27A" />
            </g>
          ) : null}
        </g>
      </g>
      {/* lower lid wet line + rim */}
      <path d={lowPath} fill="none" stroke="#E7B3A6" strokeWidth={Math.max(1, R * 0.05)} opacity={0.7} />
      <g filter={bl(Math.max(1.2, R * 0.05))}>
        <path d={lowPath} fill="none" stroke={e.skinLidDark} strokeWidth={R * 0.07} transform={`translate(0 ${R * 0.08})`} opacity={0.6} />
      </g>
      {/* upper lid (latex cap): a spherical shell over the glass eye, lit from the key side */}
      <defs>
        <radialGradient id={`${id}-lid`} cx={cx + (e.lightDir?.[0] ?? -0.7) * R * 0.55} cy={cy + (e.lightDir?.[1] ?? -0.7) * R * 0.75} r={R * 1.35} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={e.skinLidHi ?? e.skinLid} />
          <stop offset="0.5" stopColor={e.skinLid} />
          <stop offset="1" stopColor={e.skinLidDark} />
        </radialGradient>
      </defs>
      <defs>
        <linearGradient id={`${id}-lidfade`} x1="0" y1={apTop - 16} x2="0" y2={apTop + 6} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={`${id}-lidm`} maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000">
          <path d={lidShape} fill={`url(#${id}-lidfade)`} />
        </mask>
      </defs>
      <g filter={bl(0.8)} mask={`url(#${id}-lidm)`}>
        <path d={lidShape} fill={`url(#${id}-lid)`} />
      </g>
      {/* lid margin catching the key */}
      <g filter={bl(1.2)} opacity={0.5}>
        <path d={lidPath} fill="none" stroke={e.skinLidHi ?? '#F3D2C0'} strokeWidth={R * 0.06} transform={`translate(0 ${-R * 0.06})`} />
      </g>
      {/* lash line */}
      <path d={lidPath} fill="none" stroke={e.lash} strokeWidth={Math.max(1.4, R * 0.075)} strokeLinecap="round" />
    </g>
  );
};

/** Screen-space direction toward the key light (normalised). */
export const norm = ([x, y]: XY): XY => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

export interface Bump {
  c: XY;
  r: XY;
  k: number; // strength; negative = dent
  rot?: number;
  spec?: number;
  P?: Mapper;
}
/** Sculpted bumps/dents: shadow away from the light, bloom toward it, optional latex spec. */
export const Bumps: React.FC<{
  items: Bump[];
  P: Mapper;
  L: XY;
  clip: string;
  dark: string;
  light: string;
  lit: number;
  pass: 'dark' | 'light' | 'spec';
}> = ({items, P, L, clip, dark, light, lit, pass}) => {
  const key = lit;
  const out: React.ReactNode[] = [];
  items.forEach((b, i) => {
    const M = b.P ?? P;
    const [rx, ry] = b.r;
    const sgn = b.k >= 0 ? 1 : -1;
    const k = Math.abs(b.k);
    const blurV = Math.max(2, Math.min(rx, ry) * 0.55);
    if (pass === 'dark') {
      const c: XY = [b.c[0] - L[0] * rx * 0.38 * sgn, b.c[1] - L[1] * ry * 0.38 * sgn];
      out.push(
        <g key={i} filter={bl(blurV)} opacity={0.42 * k}>
          <path d={blob(ellPtsK(c, rx * 0.92, ry * 0.92, b.rot ?? 0).map(([x, y]) => M(x, y)))} fill={dark} />
        </g>,
      );
    } else if (pass === 'light') {
      const c: XY = [b.c[0] + L[0] * rx * 0.3 * sgn, b.c[1] + L[1] * ry * 0.3 * sgn];
      out.push(
        <g key={i} filter={bl(blurV * 0.8)} opacity={0.22 * k * key}>
          <path d={blob(ellPtsK(c, rx * 0.62, ry * 0.62, b.rot ?? 0).map(([x, y]) => M(x, y)))} fill={light} />
        </g>,
      );
    } else if (b.spec && sgn > 0) {
      const c: XY = [b.c[0] + L[0] * rx * 0.46, b.c[1] + L[1] * ry * 0.46];
      out.push(
        <g key={i} filter={bl(Math.max(1.2, Math.min(rx, ry) * 0.08))} opacity={b.spec * key}>
          <path d={blob(ellPtsK(c, rx * 0.2, ry * 0.13, b.rot ?? 0).map(([x, y]) => M(x, y)))} fill="#F4FFFF" />
        </g>,
      );
    }
  });
  return (
    <g clipPath={`url(#${clip})`} style={pass === 'dark' ? undefined : {mixBlendMode: 'screen'}}>
      {out}
    </g>
  );
};
const ellPtsK = (c: XY, rx: number, ry: number, rot: number): XY[] => {
  const out: XY[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    out.push([c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return out;
};

export interface CreaseDef {
  pts: XY[];
  w: number;
  k: number;
  ridge?: boolean;
  P?: Mapper;
}
/** Sculpted grooves (dark core + lit far wall) and ridges (lit near wall + dark far side). */
export const Creases: React.FC<{items: CreaseDef[]; P: Mapper; L: XY; clip: string; dark: string; light: string; lit: number}> = ({
  items,
  P,
  L,
  clip,
  dark,
  light,
  lit: key,
}) => (
  <g clipPath={`url(#${clip})`}>
    {items.map((c, i) => {
      const M = c.P ?? P;
      const d = blob(c.pts.map(([x, y]) => M(x, y)), false);
      const o = c.w * 0.75;
      const lo: XY = c.ridge ? [L[0] * o, L[1] * o] : [-L[0] * o, -L[1] * o];
      const dk: XY = c.ridge ? [-L[0] * o, -L[1] * o] : [0, 0];
      return (
        <g key={i}>
          <g filter={bl(Math.max(1.2, c.w * 0.45))} opacity={0.55 * c.k} transform={`translate(${dk[0]} ${dk[1]})`}>
            <path d={d} fill="none" stroke={dark} strokeWidth={c.w} strokeLinecap="round" />
          </g>
          <g filter={bl(Math.max(1.2, c.w * 0.5))} opacity={0.45 * c.k * key} transform={`translate(${lo[0]} ${lo[1]})`} style={{mixBlendMode: 'screen'}}>
            <path d={d} fill="none" stroke={light} strokeWidth={c.w * 0.7} strokeLinecap="round" />
          </g>
        </g>
      );
    })}
  </g>
);
