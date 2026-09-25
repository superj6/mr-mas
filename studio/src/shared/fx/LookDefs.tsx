import React from 'react';
import {useLook} from '../theme/LookContext';

/** Shared SVG defs for the active look (halftone patterns, paper grain). Put once inside each root <svg>. */
export const LookDefs: React.FC<{dot?: number}> = ({dot = 7}) => {
  const look = useLook();
  const ink = look.ink;
  return (
    <defs>
      {/* Halftone dots at 45°, three densities. */}
      {(
        [
          ['ht-light', 0.2],
          ['ht-mid', 0.34],
          ['ht-dark', 0.47],
        ] as const
      ).map(([id, r]) => (
        <pattern key={id} id={id} width={dot} height={dot} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx={dot / 2} cy={dot / 2} r={dot * r} fill={ink} />
        </pattern>
      ))}
      {/* Engraving-style line hatch. */}
      <pattern id="hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <rect width={6} height={2.1} fill={ink} />
      </pattern>
    </defs>
  );
};
