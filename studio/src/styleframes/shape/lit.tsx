import React from 'react';

/**
 * LIGHT-AS-OFFSET: the shading system of the whole structure.
 * A shape is filled with `base`; each light layer paints the part of the shape that is NOT covered by a
 * copy of the shape translated by `shift` (the "occluder"). A small shift = a rim; a big shift = a broad
 * key with a clean convex terminator. Because lighting is just two numbers per layer, the rig animates
 * light (flicker, a door bursting open, a head turning into the red) for free.
 */
export type Light = {color: string; shift: [number, number]; opacity?: number};

export const Lit: React.FC<{
  id: string;
  d: string | string[];
  base: string;
  lights?: Light[];
  transform?: string;
  opacity?: number;
  children?: React.ReactNode; // extra designed shapes, clipped to the silhouette
  filter?: string;
}> = ({id, d, base, lights = [], transform, opacity, children, filter}) => {
  const ds = Array.isArray(d) ? d : [d];
  const paths = (fill?: string, tr?: string) => ds.map((x, i) => <path key={i} d={x} fill={fill} transform={tr} />);
  const live = lights.filter((l) => (l.opacity ?? 1) > 0.001 && (Math.abs(l.shift[0]) + Math.abs(l.shift[1]) > 0.2));
  return (
    <g transform={transform} opacity={opacity} filter={filter}>
      <defs>
        <clipPath id={`${id}-c`}>{paths()}</clipPath>
        {live.map((l, i) => (
          <mask id={`${id}-m${i}`} key={i} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={8000} height={8000}>
            {paths('#fff')}
            {paths('#000', `translate(${l.shift[0]} ${l.shift[1]})`)}
          </mask>
        ))}
      </defs>
      {paths(base)}
      {live.map((l, i) => (
        <g key={i} mask={`url(#${id}-m${i})`} opacity={l.opacity ?? 1}>
          {paths(l.color)}
        </g>
      ))}
      {children ? <g clipPath={`url(#${id}-c)`}>{children}</g> : null}
    </g>
  );
};
