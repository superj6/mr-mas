/**
 * Plate-aware painting primitives for panel art (builder: comic): gradients that the RIP turns into
 * halftone ramps, blurred shapes, parallax layers.
 */
import React from 'react';
import {Spec, tone, usePlate} from './print';

let uidCounter = 0;
const idFor = (base: string, plate: string) => `${base}-${plate}`.replace(/[^a-zA-Z0-9_-]/g, '_');

/** Radial gradient fill of a shape: spec at the centre -> spec at the rim (with optional mid stop). */
export const RadFill: React.FC<{id: string; d: string; cx: number; cy: number; r: number; ry?: number; from: Spec; to: Spec; mid?: [number, Spec]; transform?: string; rot?: number}> = ({id, d, cx, cy, r, ry, from, to, mid, transform, rot = 0}) => {
  const plate = usePlate();
  const gid = idFor(id, plate);
  const sy = (ry ?? r) / r;
  return (
    <>
      <defs>
        <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r} gradientTransform={`translate(${cx} ${cy}) rotate(${rot}) scale(1 ${sy}) translate(${-cx} ${-cy})`}>
          <stop offset="0" stopColor={tone(plate, from)} />
          {mid && <stop offset={mid[0]} stopColor={tone(plate, mid[1])} />}
          <stop offset="1" stopColor={tone(plate, to)} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${gid})`} transform={transform} />
    </>
  );
};

/** Linear gradient fill of a shape. */
export const LinFill: React.FC<{id: string; d: string; x1: number; y1: number; x2: number; y2: number; stops: [number, Spec][]; transform?: string}> = ({id, d, x1, y1, x2, y2, stops, transform}) => {
  const plate = usePlate();
  const gid = idFor(id, plate);
  return (
    <>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          {stops.map(([o, s], i) => (
            <stop key={i} offset={o} stopColor={tone(plate, s)} />
          ))}
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${gid})`} transform={transform} />
    </>
  );
};

/** Blurred group (soft light / soft shadow — becomes a halftone ramp in print). */
export const Soft: React.FC<{id: string; r: number; children: React.ReactNode; region?: [number, number, number, number]}> = ({id, r, children, region}) => {
  const plate = usePlate();
  const fid = idFor('sf-' + id, plate);
  return (
    <>
      <defs>
        <filter id={fid} {...(region ? {filterUnits: 'userSpaceOnUse', x: region[0], y: region[1], width: region[2], height: region[3]} : {x: '-30%', y: '-30%', width: '160%', height: '160%'})}>
          <feGaussianBlur stdDeviation={r} />
        </filter>
      </defs>
      <g filter={`url(#${fid})`}>{children}</g>
    </>
  );
};

/** Internal-parallax layer: shifts against the camera by depth d (-1 far .. 0 focal .. +1 near). */
export const Layer: React.FC<{px: number; py: number; d: number; k?: number; push?: number; cx?: number; cy?: number; children: React.ReactNode}> = ({px, py, d, k = 70, push = 0, cx = 0, cy = 0, children}) => {
  const tx = -px * k * d;
  const ty = -py * k * d * 0.6;
  const s = 1 + push * (1 + d * 0.6);
  return <g transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) translate(${cx} ${cy}) scale(${s.toFixed(5)}) translate(${-cx} ${-cy})`}>{children}</g>;
};

export const useUid = () => ++uidCounter;
