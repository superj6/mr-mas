// MR. MAS — Ep1 Act Four · the animatic v5: the Remotion host (INF-FRAME5; the a4p5-render pass). It paints frame5.ts's
// buffer into a canvas and then draws the frame's GLYPH layers on top with the shared glyph drawer (real glyph tokens:
// shared/pixel/glyphDraw.ts drawGlyphLayer, JetBrains Mono loaded by ensureGlyphFonts inside delayRender), at the
// output scale and clipped to the room area. Everything but the tokens is the same buffer the Node renderer
// (tools/render5.ts) encodes, so the two are pixel-identical; render5 splices this host's frames in where tokens are.
//   'ep01-act4-animatic-v5'          1920 x 1080: the show frame at 3x + the editor's margin + the review transcript
//   'ep01-act4-animatic-v5-picture'  1920 x 1080: the picture only, the show frame at 4x (the newcomer test's frame)
//   'ep01-act4-animatic-v5-still'    a still of either (--props='{"offset": N, "picture": true}')
// Props: offset (act frame of composition frame 0), picture (true = the picture only), marks (true = v4's 2-pixel
// stand-in marks instead of glyphs: a debug switch only).
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {ensureGlyphFonts, drawGlyphLayer} from '../../../../shared/pixel/glyphDraw';
import {toRGBA} from './frame';
import {native5, picture5, anim5, glyphView, PIC_W, PIC_H, PIC_SC, ANIM_W, ANIM_H, ANIM_SC} from './frame5';

/** paint act frame f (the picture or the review frame) into a canvas context: the buffer, then the true GLYPH tokens */
export const paint5 = (ctx: CanvasRenderingContext2D, f: number, picture: boolean, marks = false) => {
  const n = native5(f, {marks});
  const buf = picture ? picture5(f, undefined, {n}) : anim5(f, undefined, {n});
  const img = ctx.createImageData(buf.w, buf.h);
  toRGBA(buf, img.data);
  ctx.putImageData(img, 0, 0);
  if (!marks) for (const L of n.layers) drawGlyphLayer(ctx, L, glyphView(picture ? PIC_SC : ANIM_SC));
  return n;
};

export const Animatic5: React.FC<{offset?: number; picture?: boolean; marks?: boolean}> = ({offset = 0, picture = false, marks = false}) => {
  const f = useCurrentFrame() + offset;
  const ref = useRef<HTMLCanvasElement>(null);
  const [initial] = useState(() => delayRender('act4-animatic-v5'));
  const first = useRef(true);
  const W = picture ? PIC_W : ANIM_W, H = picture ? PIC_H : ANIM_H;
  useLayoutEffect(() => {
    const handle = first.current ? initial : delayRender('act4-animatic-v5');
    first.current = false;
    ensureGlyphFonts()
      .then(() => {
        const cv = ref.current;
        if (cv) paint5(cv.getContext('2d')!, f, picture, marks);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [f, initial, picture, marks]);
  return (
    <AbsoluteFill style={{background: '#07080d'}}>
      <canvas ref={ref} width={W} height={H} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
