// MR. MAS — style jump prototype C · J6 · THE RING: the Remotion host. One canvas at 1920 x 1080: the pixel frame
// presented 4x nearest-neighbour, the continuous water painted into it where the ring's matte is on. The frame is
// computed by the same pure renderer the Node preview uses (render.ts), so stills and video match exactly.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderFrame, Variant, OUT_W, OUT_H} from './render';

export const Proto3: React.FC<{variant?: Variant}> = ({variant = 'jump'}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(OUT_W, OUT_H);
    renderFrame(f, variant, img.data);
    ctx.putImageData(img, 0, 0);
  }, [f, variant]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={OUT_W} height={OUT_H} style={{width, height, imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
