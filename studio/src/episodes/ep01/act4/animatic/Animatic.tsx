// MR. MAS — Ep1 Act Four · THE EDITOR's animatic: the Remotion host (owned by THE EDITOR). It paints a frame composer's
// buffer into a canvas, so a Remotion render and the Node renderers (tools/render.ts for v3, tools/render4.ts for v4)
// are pixel-identical.
//   version 3 (default): 'ep01-act4-animatic'          lock v3, frame.ts, 1280 x 720 (the v3 mix is muxed after the render)
//   version 4:           'ep01-act4-animatic-v4'       lock v4, frame4.ts, 1280 x 720 (margin notes + review transcript)
//                        'ep01-act4-animatic-v4-picture' lock v4, picture4(), 960 x 540: the picture only (the newcomer test)
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {frame, toRGBA, OUT_W, OUT_H} from './frame';
import {frame4, picture4} from './frame4';

export const Animatic: React.FC<{offset?: number; version?: 3 | 4; picture?: boolean}> = ({offset = 0, version = 3, picture = false}) => {
  const f = useCurrentFrame() + offset;
  const ref = useRef<HTMLCanvasElement>(null);
  const [initial] = useState(() => delayRender('act4-animatic'));
  const first = useRef(true);
  const W = version === 4 && picture ? 960 : OUT_W, H = version === 4 && picture ? 540 : OUT_H;
  useLayoutEffect(() => {
    const handle = first.current ? initial : delayRender('act4-animatic');
    first.current = false;
    const cv = ref.current;
    if (cv) {
      const buf = version === 4 ? (picture ? picture4(f) : frame4(f)) : frame(f);
      const ctx = cv.getContext('2d')!;
      const img = ctx.createImageData(W, H);
      toRGBA(buf, img.data);
      ctx.putImageData(img, 0, 0);
    }
    continueRender(handle);
  }, [f, initial, version, picture, W, H]);
  return (
    <AbsoluteFill style={{background: '#07080d'}}>
      <canvas ref={ref} width={W} height={H} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
