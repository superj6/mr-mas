// MR. MAS · prototype 4 · the Remotion host: one 1920x1080 canvas, painted by the same pure renderer the Node
// preview uses (render.ts), so stills, previews and the video are the same pixels. CPU backend, no WebGL.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderFrame, OUT_W, OUT_H} from './render';

export const P4: React.FC<{hold?: number}> = ({hold}) => {
  const current = useCurrentFrame();
  const f = hold ?? current;
  const {width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const img = ctx.createImageData(OUT_W, OUT_H);
    renderFrame(f, img.data);
    ctx.putImageData(img, 0, 0);
  }, [f]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={OUT_W} height={OUT_H} style={{width, height, imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
