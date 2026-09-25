// MR. MAS — ep01 act4 kits preview: Remotion hosts for the kit demos (scenes.ts). One composition per kit;
// stills are the same compositions rendered with --frame=N.
import React from 'react';
import {PixelScene} from '../../../../shared/pixel/PixelScene';
import {SCENES} from './scenes';

export const KitScene: React.FC<{scene: string; hold?: number}> = ({scene, hold}) => {
  const s = SCENES[scene];
  return <PixelScene draw={s.draw} after={s.after} palette={s.palette} switch={s.switch} bg={s.bg} hold={hold} />;
};
