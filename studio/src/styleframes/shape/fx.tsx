import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BAR, C, PH, W} from './core';
import {FONT} from '../../shared/theme/fonts';

/**
 * SVG defs for the picture: texture lives in the EDGES and in light shapes, never as a full-frame filter.
 *  - sh-edge : gouache edge wobble for characters/props (boils on threes via `seed`)
 *  - sh-dry  : dry-brush drag for light shapes (horizontal streaks, broken far edge)
 *  - sh-dryr : dry-brush for radial light (door glow), isotropic
 *  - sh-mottle: ink-density mottling for big flat fields (static)
 */
export const ShapeDefs: React.FC<{seed: number}> = ({seed}) => (
  <defs>
    <filter id="sh-edge" x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={seed} result="t" />
      <feDisplacementMap in="SourceGraphic" in2="t" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="sh-dry" filterUnits="userSpaceOnUse" x={-300} y={-300} width={W + 600} height={PH + 600}>
      {/* displacement only: interiors stay solid ink, edges drag into dry-brush streaks */}
      <feTurbulence type="fractalNoise" baseFrequency="0.003 0.06" numOctaves={3} seed={seed + 11} result="s" />
      <feDisplacementMap in="SourceGraphic" in2="s" scale={34} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="sh-dryr" filterUnits="userSpaceOnUse" x={-400} y={-400} width={W + 800} height={PH + 800}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves={3} seed={seed + 23} result="s" />
      <feDisplacementMap in="SourceGraphic" in2="s" scale={14} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="sh-mottle" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={PH}>
      <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.006" numOctaves={3} seed={5} result="n" />
      <feColorMatrix
        in="n"
        type="matrix"
        values="0 0 0 0 0.5  0 0 0 0 0.52  0 0 0 0 0.62  1.6 0 0 0 -0.62"
      />
    </filter>
  </defs>
);

/** Ink-density mottling over big flat fields (screen-blended lift, very low). */
export const Mottle: React.FC<{opacity?: number}> = ({opacity = 0.045}) => (
  <rect x={0} y={0} width={W} height={PH} filter="url(#sh-mottle)" style={{mixBlendMode: 'screen'}} opacity={opacity} />
);

/** Paper tooth over the whole picture: fine grain, boiled on twos. */
export const PaperGrain: React.FC<{seed: number; amount?: number}> = ({seed, amount = 0.2}) => (
  <AbsoluteFill style={{top: BAR, height: PH, mixBlendMode: 'overlay', opacity: amount, pointerEvents: 'none'}}>
    <svg width={W} height={PH} viewBox={`0 0 ${W} ${PH}`}>
      <filter id={`sh-grain-${seed}`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={PH}>
        <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves={2} seed={seed} result="t" />
        <feColorMatrix in="t" type="saturate" values="0" />
      </filter>
      <rect width={W} height={PH} filter={`url(#sh-grain-${seed})`} />
    </svg>
  </AbsoluteFill>
);

export type Sub = {text: string; who: 'mas' | 'nole'} | null;

/**
 * Scope frame: 2.39:1 picture between letterbox bars. Subtitles sit IN the lower bar, like a
 * festival print — the bar is part of the design, not dead space.
 */
export const Scope: React.FC<{
  children: React.ReactNode;
  sub?: Sub;
  subOpacity?: number;
  grainSeed: number;
  grain?: number;
  slate?: string;
}> = ({children, sub, subOpacity = 1, grainSeed, grain = 0.2, slate}) => (
  <AbsoluteFill style={{background: C.void}}>
    <div style={{position: 'absolute', left: 0, top: BAR, width: W, height: PH, overflow: 'hidden'}}>{children}</div>
    <PaperGrain seed={grainSeed} amount={grain} />
    {sub ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: BAR + PH + 34,
          textAlign: 'center',
          fontFamily: FONT.bass,
          fontWeight: 400,
          fontSize: 42,
          letterSpacing: '0.035em',
          color: sub.who === 'mas' ? '#c9f3ee' : '#f6e2d2',
          opacity: subOpacity,
        }}
      >
        {sub.text}
      </div>
    ) : null}
    {slate ? (
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 52,
          fontFamily: FONT.bass,
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: '0.32em',
          color: '#5b6178',
        }}
      >
        {slate}
      </div>
    ) : null}
  </AbsoluteFill>
);
