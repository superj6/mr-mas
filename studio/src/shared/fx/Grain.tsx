import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * Film/paper grain overlay. `seed` should change every 2-3 frames in motion (boil),
 * stay fixed for stills. Uses an SVG turbulence filter (CPU-rasterized; fine for stills,
 * pre-bake to PNG tiles for long renders).
 */
export const Grain: React.FC<{amount: number; seed?: number; blend?: React.CSSProperties['mixBlendMode']; scale?: number}> = ({
  amount,
  seed = 1,
  blend = 'soft-light',
  scale = 0.9,
}) => {
  if (amount <= 0) return null;
  return (
    <AbsoluteFill style={{mixBlendMode: blend, opacity: amount * 4, pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency={scale} numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Paper fibre texture: low-frequency mottling, multiply-blended. */
export const Paper: React.FC<{amount?: number; seed?: number}> = ({amount = 0.35, seed = 7}) => (
  <AbsoluteFill style={{mixBlendMode: 'multiply', opacity: amount, pointerEvents: 'none'}}>
    <svg width="100%" height="100%">
      <filter id={`paper-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={seed} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0 0.66  0 0 0 -1.1 1.05" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#paper-${seed})`} />
    </svg>
  </AbsoluteFill>
);

/** Vignette overlay. */
export const Vignette: React.FC<{amount?: number; color?: string}> = ({amount = 0.55, color = '#000'}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at 50% 50%, transparent 45%, ${color} 130%)`,
      opacity: amount,
    }}
  />
);
