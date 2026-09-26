// MR. MAS - style-range Prototype 1, STEP 0: the key test. One still of the Mas rig under a single hard tungsten top
// key with no fill: two shadow tones plus one highlight, the far neon's cool rim, deep blacks. Compared by eye against
// the pixel portrait windows (out/dev/pixeladv/key-test.png) before any animation is built on it.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MasTungsten} from './MasTungsten';
import {Finish} from './finish';

export const KeyTest: React.FC = () => (
  <AbsoluteFill style={{background: '#07060A'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <defs>
        <radialGradient id="kt-pool" cx="1080" cy="-120" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB870" stopOpacity={0.34} />
          <stop offset="0.45" stopColor="#8A4A22" stopOpacity={0.12} />
          <stop offset="1" stopColor="#07060A" stopOpacity={0} />
        </radialGradient>
        <filter id="kt-far" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26" /></filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#kt-pool)" />
      {/* the far neon, out of focus behind him */}
      <g filter="url(#kt-far)" opacity={0.8}>
        <rect x={-100} y={640} width={640} height={16} rx={8} fill="#3FCACB" />
        <rect x={1420} y={610} width={640} height={12} rx={6} fill="#2A8E9A" />
        <circle cx={260} cy={520} r={34} fill="#5A2E6E" opacity={0.6} />
      </g>
      <g transform="translate(900 470) scale(1.02)">
        <MasTungsten uid="kt" lookX={0.62} lookY={0.12} lid={0.2} />
      </g>
    </svg>
    <Finish seed={3} />
  </AbsoluteFill>
);
