// MR. MAS — pixelengine demo compositions (Remotion side). Scene logic lives in scenes.ts (pure).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {PixelScene, composeFrame, ensureGlyphFonts, presentBuf, drawGlyphLayer, PAL, hex} from '../../shared/pixel';
import {FONT} from '../../shared/theme/fonts';
import {PANELS, dissolveScene, frontScene} from './scenes';

/** One palette/switch per frame (render with --frame=N, or as a slideshow). */
export const SwitchesDemo: React.FC<{panel?: number}> = ({panel}) => {
  const frame = useCurrentFrame();
  const p = PANELS[(panel ?? frame) % PANELS.length];
  return <PixelScene {...p.scene} hold={0} />;
};

export const DissolveDemo: React.FC = () => <PixelScene {...dissolveScene} />;
export const RenderFrontDemo: React.FC = () => <PixelScene {...frontScene} />;

// ------------------------------------------------------------------ contact sheet: 3x3 panels, 2x crops
const SHEET: Array<{id: string; crop: [number, number, number, number]}> = [
  {id: 'base', crop: [152, 4, 320, 180]},
  {id: 'freeze', crop: [0, 18, 320, 180]},
  {id: 'onebit', crop: [80, 20, 320, 180]},
  {id: 'earlyweb16', crop: [152, 4, 320, 180]},
  {id: 'ledger', crop: [152, 4, 320, 180]},
  {id: 'terminal', crop: [152, 4, 320, 180]},
  {id: 'cone-terminal', crop: [0, 18, 320, 180]},
  {id: 'cone-glyph', crop: [0, 18, 320, 180]},
  {id: 'glyph', crop: [152, 4, 320, 180]},
];

export const SwitchSheet: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender('pixelengine sheet');
    ensureGlyphFonts()
      .then(() => {
        const ctx = ref.current!.getContext('2d')!;
        ctx.fillStyle = hex(PAL.N0);
        ctx.fillRect(0, 0, 1920, 1080);
        SHEET.forEach((s, k) => {
          const p = PANELS.find((q) => q.id === s.id)!;
          // captions are part of `after`; the sheet labels its panels itself, so drop them here
          const {fb, layers, ui, uiLayers} = composeFrame({...p.scene, after: s.id === 'freeze' || s.id === 'onebit' ? p.scene.after : undefined}, 0);
          const px = (k % 3) * 640, py = Math.floor(k / 3) * 360;
          const view = {scale: 2, ox: px, oy: py, crop: s.crop};
          presentBuf(ctx, fb, view);
          for (const l of layers) drawGlyphLayer(ctx, l, view);
          if (ui) presentBuf(ctx, ui, view);
          for (const l of uiLayers) drawGlyphLayer(ctx, l, view);
          // label
          ctx.fillStyle = 'rgba(4,5,10,0.92)';
          const label = `${p.title}`;
          ctx.font = `700 15px ${FONT.mono}`;
          const w = ctx.measureText(label).width;
          ctx.font = `400 13px ${FONT.mono}`;
          const w2 = ctx.measureText(p.sub).width;
          ctx.fillRect(px + 8, py + 318, w + w2 + 30, 30);
          ctx.fillStyle = hex(PAL.C7);
          ctx.font = `700 15px ${FONT.mono}`;
          ctx.fillText(label, px + 18, py + 338);
          ctx.fillStyle = hex(PAL.N7);
          ctx.font = `400 13px ${FONT.mono}`;
          ctx.fillText(p.sub, px + 28 + w, py + 338);
        });
        // gutters
        ctx.fillStyle = hex(PAL.N0);
        for (let i = 1; i < 3; i++) { ctx.fillRect(i * 640 - 2, 0, 4, 1080); ctx.fillRect(0, i * 360 - 2, 1920, 4); }
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, []);
  return (
    <AbsoluteFill style={{background: hex(PAL.N0)}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
