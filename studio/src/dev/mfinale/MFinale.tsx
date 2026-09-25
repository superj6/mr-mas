// MR. MAS — mfinale: Remotion host for intro frames 540-719 (bars 10-12: skyline, title, bookend).
// The composition is 180 frames; its local frame 0 is GLOBAL intro frame 540 (timeline.ts MF_START).
// Integrators: mount it at the right global frame with <MFinaleSequence/> (a <Sequence from={540}>), after the
// roll call's <MRollcallSequence/> (480-539). <MFinaleBars9to12/> is exactly that pair, for review.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Sequence, cancelRender, continueRender, delayRender} from 'remotion';
import {PixelScene} from '../../shared/pixel/PixelScene';
import {composeFrame} from '../../shared/pixel/compose';
import {ensureGlyphFonts, presentBuf, drawGlyphLayer} from '../../shared/pixel/glyphDraw';
import {PAL, hex} from '../../shared/pixel/palette';
import {FONT} from '../../shared/theme/fonts';
import {localScene, mfinaleScene} from './scene';
import {MF_START, MF_FRAMES, ROLLCALL_START} from './timeline';
import {MRollcall} from '../mrollcall/Rollcall';

const LOCAL = localScene(MF_START);

/** The span on its own clock (local frame 0 = global 480). `hold` pins a local frame (stills). */
export const MFinale: React.FC<{hold?: number}> = ({hold}) => <PixelScene {...LOCAL} bg={PAL.N0} hold={hold} />;

/** Mount inside a full-intro composition (720 frames): plays exactly at global 480-719. */
export const MFinaleSequence: React.FC = () => (
  <Sequence from={MF_START} durationInFrames={MF_FRAMES} name="mfinale (bars 10-12)">
    <MFinale />
  </Sequence>
);

/** Bars 9-12 as the full intro plays them (480-719, 240 frames): the roll call, then this span. Review only. */
export const MFinaleBars9to12: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={MF_START - ROLLCALL_START} name="mrollcall (bar 9)"><MRollcall /></Sequence>
    <Sequence from={MF_START - ROLLCALL_START} durationInFrames={MF_FRAMES} name="mfinale (bars 10-12)"><MFinale /></Sequence>
  </AbsoluteFill>
);

/** A still addressed by GLOBAL intro frame (key frames): <MFinaleAt g={630} /> */
export const MFinaleAt: React.FC<{g: number}> = ({g}) => <MFinale hold={g - MF_START} />;

// ------------------------------------------------------------------ dev: contact sheet of global frames (4x4 at 1x)
export const MFinaleSheet: React.FC<{gs: number[]}> = ({gs}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender('mfinale sheet');
    ensureGlyphFonts()
      .then(() => {
        const ctx = ref.current!.getContext('2d')!;
        ctx.fillStyle = hex(PAL.N0);
        ctx.fillRect(0, 0, 1920, 1080);
        gs.slice(0, 16).forEach((g, k) => {
          const {fb, layers, ui, uiLayers} = composeFrame(mfinaleScene, g);
          const view = {scale: 1, ox: (k % 4) * 480, oy: Math.floor(k / 4) * 270};
          presentBuf(ctx, fb, view);
          for (const l of layers) drawGlyphLayer(ctx, l, view);
          if (ui) presentBuf(ctx, ui, view);
          for (const l of uiLayers) drawGlyphLayer(ctx, l, view);
          ctx.fillStyle = 'rgba(4,5,10,0.85)';
          ctx.fillRect(view.ox + 2, view.oy + 2, 40, 14);
          ctx.fillStyle = hex(PAL.C7);
          ctx.font = `700 11px ${FONT.mono}`;
          ctx.fillText(`f${g}`, view.ox + 6, view.oy + 13);
        });
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, [gs]);
  return (
    <AbsoluteFill style={{background: hex(PAL.N0)}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
