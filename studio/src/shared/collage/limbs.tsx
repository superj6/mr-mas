import React from 'react';
import {Family} from './engrave';
import {P2, smoothD, clamp} from './core';

/**
 * COLLAGE — limb helpers: tube outlines + cross-contour hatch families (lines wrap around the sleeve),
 * and a catalogue-engraving hand in profile.
 */
export const tubeD = (a: P2, b: P2, ra: number, rb: number): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const nx = -uy;
  const ny = ux;
  const pts: P2[] = [
    [a[0] + nx * ra, a[1] + ny * ra],
    [b[0] + nx * rb, b[1] + ny * rb],
    [b[0] + ux * rb * 0.7 + nx * rb * 0.5, b[1] + uy * rb * 0.7 + ny * rb * 0.5],
    [b[0] + ux * rb * 0.9, b[1] + uy * rb * 0.9],
    [b[0] + ux * rb * 0.7 - nx * rb * 0.5, b[1] + uy * rb * 0.7 - ny * rb * 0.5],
    [b[0] - nx * rb, b[1] - ny * rb],
    [a[0] - nx * ra, a[1] - ny * ra],
    [a[0] - ux * ra * 0.8, a[1] - uy * ra * 0.8],
  ];
  return smoothD(pts);
};

/** Cross-contour lines around a tube from a to b (bowed like ellipses seen slightly from above). */
export const tubeFamily = (a: P2, b: P2, r: number, bow = 0.28): Family => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const nx = -uy;
  const ny = ux;
  return {
    map: (u, v) => {
      const s = clamp(u / r, -1, 1);
      const back = -bow * r * (1 - s * s);
      return [a[0] + ux * (v + back) + nx * u, a[1] + uy * (v + back) + ny * u];
    },
    u0: -r * 1.1,
    u1: r * 1.1,
    v0: -r,
    v1: L + r,
  };
};

/** Cylinder shading for a tube: lit on the side whose normal faces `light` (unit vector). */
export const tubeTone = (a: P2, b: P2, r: number, light: P2, base = 0.35, amp = 0.5) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const nx = -uy;
  const ny = ux;
  const side = Math.sign(nx * light[0] + ny * light[1]) || 1;
  return (x: number, y: number) => {
    const px = x - a[0];
    const py = y - a[1];
    const s = clamp((px * nx + py * ny) / r, -1, 1) * side;
    // lambert across the round + a thin reflected light on the dark edge
    const lam = Math.max(0, 0.35 + 0.65 * s);
    const refl = 0.12 * Math.exp(-((s + 0.92) ** 2) / 0.004);
    return clamp(base + amp * (lam - 0.35) + refl);
  };
};

/** A hand in profile, wrist at (0,0), fingers pointing to -x and curling down onto keys. Local units ~ px. */
export const HAND = {
  palm: smoothD([[4, -15], [-18, -19], [-40, -17], [-56, -10], [-66, 2], [-68, 13], [-63, 21, 1], [-57, 13], [-47, 9], [-36, 12], [-24, 17], [-8, 17], [5, 14]]),
  thumb: smoothD([[-22, 10], [-36, 16], [-46, 24], [-50, 30, 1], [-42, 29], [-30, 22], [-18, 18]]),
  knuckles: 'M -40 -15 C -44 -6 -46 2 -50 9 M -50 -12 C -54 -4 -58 4 -60 12 M -30 -17 C -34 -8 -36 0 -40 8',
  nail: 'M -64 14 C -66 18 -64 20 -62 21',
};

export const handTone = (x: number, y: number) => clamp(0.62 - 0.28 * clamp((y + 19) / 38) + 0.1 * Math.exp(-((x + 30) ** 2 + (y + 14) ** 2) / 200));

export const Tube: React.FC<{d: string}> = ({d}) => <path d={d} />;
