// MR. MAS — shared pixel engine: <PixelScene>, the Remotion host for every pixel shot.
//
//   <PixelScene
//     draw={(fb, frame) => { ...paint the 480x270 frame... ; return {layers: [glyphDissolve(...)]} }}
//     palette="BASE"                                  // whole-frame palette (id | set | (f) => id)
//     switch={(f) => f >= 99 && f < 104 ? {type: 'glyph', mask: cone, source: cathedral} : null}
//   />
//
// Pipeline per frame: new Buf(480x270, bg) -> draw() -> palette -> switches (in order) -> present at the largest
// integer scale that fits (4x at 1080p), nearest-neighbour -> glyph layers -> after() UI layer on top.
// The glyph font is loaded with document.fonts.load inside delayRender before the first paint.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from './px';
import {PAL, hex} from './palette';
import {ensureGlyphFonts, drawGlyphLayer, presentBuf} from './glyphDraw';
import {PixelSceneProps, composeFrame} from './compose';
import {isGenvideoPlate} from './plate';

export type {PixelSceneProps, SwitchSpec, Switches, DrawResult} from './compose';

export const PixelScene: React.FC<PixelSceneProps> = (props) => {
  const current = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const f = props.hold ?? current;
  const nw = props.nativeW ?? W, nh = props.nativeH ?? H;
  const scale = Math.max(1, Math.floor(Math.min(width / nw, height / nh)));
  const ox = Math.floor((width - nw * scale) / 2), oy = Math.floor((height - nh * scale) / 2);
  useLayoutEffect(() => {
    const handle = delayRender(`PixelScene f${f}`);
    ensureGlyphFonts()
      .then(() => {
        const cv = ref.current;
        if (cv) {
          // clean-plate export (keyframes.py): only what draw() paints; see plate.ts
          const plate = isGenvideoPlate();
          const {fb, layers, ui, uiLayers} = composeFrame(plate ? {draw: props.draw, bg: props.bg, nativeW: props.nativeW, nativeH: props.nativeH} : props, f);
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = hex(props.bg ?? PAL.N0);
          ctx.fillRect(0, 0, cv.width, cv.height);
          const view = {scale, ox, oy};
          presentBuf(ctx, fb, view);
          if (!plate) {
            for (const l of layers) drawGlyphLayer(ctx, l, view);
            if (ui) presentBuf(ctx, ui, view);
            for (const l of uiLayers) drawGlyphLayer(ctx, l, view);
          }
        }
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f, width, height, props.draw, props.after, props.palette, props.switch, props.bg, nw, nh]);
  return (
    <AbsoluteFill style={{background: hex(props.bg ?? PAL.N0)}}>
      <canvas ref={ref} width={width} height={height} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
