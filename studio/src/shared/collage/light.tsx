import React from 'react';
import {SCREEN} from './set';

/**
 * COLLAGE — the "airbrush" light glazes laid over the whole pasted-up plate (world-anchored, so they move
 * with the artwork under the rostrum camera, never with the lens): night-blue multiply falling off from the
 * monitor, the cyan tube glow, and the warm breach light once the rocket is in.
 */
export const Glaze: React.FC<{glow: number; warm: number; warmAt?: [number, number]; flicker?: number}> = ({glow, warm, warmAt = [1760, 150], flicker = 0}) => {
  const [sx, sy] = SCREEN;
  const g = glow * (1 + flicker);
  return (
    <g style={{pointerEvents: 'none'}}>
      <defs>
        <radialGradient id="gz-night" gradientUnits="userSpaceOnUse" cx={sx} cy={sy} r={1500}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.16" stopColor="#B9C8E0" />
          <stop offset="0.42" stopColor="#56618C" />
          <stop offset="1" stopColor="#1B1F38" />
        </radialGradient>
        <radialGradient id="gz-cyan" gradientUnits="userSpaceOnUse" cx={sx} cy={sy} r={620}>
          <stop offset="0" stopColor="#6FF2FF" stopOpacity={0.85} />
          <stop offset="0.35" stopColor="#2FB8D8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#1A5A8A" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gz-warm" gradientUnits="userSpaceOnUse" cx={warmAt[0]} cy={warmAt[1]} r={900}>
          <stop offset="0" stopColor="#FFB060" stopOpacity={0.95} />
          <stop offset="0.3" stopColor="#E06A2A" stopOpacity={0.45} />
          <stop offset="1" stopColor="#7A2A10" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gz-warmlift" gradientUnits="userSpaceOnUse" cx={warmAt[0]} cy={warmAt[1]} r={800}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#gz-night)" style={{mixBlendMode: 'multiply'}} />
      {warm > 0 && <rect x={-200} y={-200} width={2320} height={1480} fill="url(#gz-warm)" opacity={warm} style={{mixBlendMode: 'screen'}} />}
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#gz-cyan)" opacity={g} style={{mixBlendMode: 'screen'}} />
    </g>
  );
};
