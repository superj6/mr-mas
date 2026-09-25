// MR. MAS — castrivals: Remotion host. Renders the 480x270 native buffer and scales it 4x nearest-neighbour
// onto a 1920x1080 canvas (every art pixel = a 4x4 block; no smoothing, no filters).
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {renderView} from './sheet';

export interface CastCanvasProps {
  /** view id: 'still' | 'sheet' (motion) | extra sheet ids */
  view: string;
}

export const CastCanvas: React.FC<CastCanvasProps> = ({view}) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const [initial] = useState(() => delayRender('castrivals'));
  const first = useRef(true);
  useLayoutEffect(() => {
    const handle = first.current ? initial : delayRender('castrivals');
    first.current = false;
    const cv = ref.current;
    if (cv) {
      const buf = renderView(view, frame);
      const off = document.createElement('canvas');
      off.width = buf.w;
      off.height = buf.h;
      const octx = off.getContext('2d')!;
      const img = octx.createImageData(buf.w, buf.h);
      buf.toRGBA(img.data);
      octx.putImageData(img, 0, 0);
      const ctx = cv.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, cv.width, cv.height);
    }
    continueRender(handle);
  }, [frame, view, initial]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
