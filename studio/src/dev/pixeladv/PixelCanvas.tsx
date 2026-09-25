// MR. MAS — pixeladv: Remotion host. Now a thin wrapper over the shared engine's <PixelScene>
// (src/shared/pixel/PixelScene.tsx): the 480x270 native buffer is scaled 4x nearest-neighbour onto the
// 1920x1080 canvas (every art pixel = a 4x4 block; no smoothing, no filters). Same props as before.
import React, {useCallback} from 'react';
import {PixelScene} from '../../shared/pixel/PixelScene';
import type {Buf} from '../../shared/pixel/px';
import {renderScene, renderSheet} from './scene';

export interface PixelCanvasProps {
  /** render a named sheet instead of the scene */
  sheet?: string;
  /** hold a specific scene frame (for stills) */
  hold?: number;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({sheet, hold}) => {
  const draw = useCallback((fb: Buf, f: number) => {
    const buf = sheet ? renderSheet(sheet) : renderScene(f);
    fb.c.set(buf.c);
  }, [sheet]);
  return <PixelScene draw={draw} hold={hold} />;
};
