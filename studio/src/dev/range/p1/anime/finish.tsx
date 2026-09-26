// MR. MAS - style-range Prototype 1: the anime frames' compositing finish (satsuei): a vignette that sinks the corners
// into the room's black, a restrained film grain boiled on 2s, and a faint top-down falloff from the pool light.
// No bloom on lines, no lens flare, no chromatic fringe: the drawing carries the finish.
import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Finish: React.FC<{seed?: number; grain?: number; vignette?: number}> = ({seed = 1, grain = 0.05, vignette = 0.62}) => (
  <>
    <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 78% 72% at 52% 44%, rgba(7,6,10,0) 52%, rgba(7,6,10,${vignette * 0.55}) 82%, rgba(4,3,6,${vignette}) 100%)`}} />
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: grain * 4}}>
      <svg width="100%" height="100%">
        <filter id={`p1g-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#p1g-${seed})`} />
      </svg>
    </AbsoluteFill>
  </>
);
