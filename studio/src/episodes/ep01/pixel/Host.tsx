// MR. MAS — Ep1 pixel pipeline (P0): the Remotion host. It paints frame.ts's buffer into a canvas, then the frame's
// GLYPH layers on top with the shared glyph drawer (real tokens: shared/pixel/glyphDraw.ts, JetBrains Mono loaded by
// ensureGlyphFonts inside delayRender), at the output scale and clipped to the room area. On a segment's browser frames
// (spec.browser, e.g. Act Four's J1 when its option is on) it draws the segment's React component instead (registered
// by <seg>/browser.tsx). Everything else is the same buffer the Node renderer encodes, so the two are pixel-identical;
// tools/render.ts splices this host's frames in where only a browser can draw.
// Props: offset (segment frame of composition frame 0), mode ('picture' | 'review'), marks (v4's 2-px stand-ins for
// the GLYPH tokens, a debug switch), opts (segment options, e.g. {"j1": true}).
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {ensureGlyphFonts, drawGlyphLayer} from '../../../shared/pixel/glyphDraw';
import {toRGBA} from './text';
import {prepare, native, picture, review, glyphView, PIC_W, PIC_H, PIC_SC, ANIM_W, ANIM_H, ANIM_SC} from './frame';
import type {Seg} from './frame';
import type {PixelSegment, SegmentOptions} from './spec';

/** what a <seg>/browser.tsx exports (BROWSER): the component that draws the segment's browser frames (picture mode) */
export interface BrowserModule { Component: React.FC<{f: number; seg: Seg}> }
export interface HostProps { offset?: number; mode?: 'picture' | 'review'; marks?: boolean; opts?: Partial<SegmentOptions> }

/** paint segment frame f into a canvas context: the buffer, then the true GLYPH tokens */
export const paint = (ctx: CanvasRenderingContext2D, seg: Seg, f: number, mode: 'picture' | 'review', marks = false) => {
  const n = native(seg, f, {marks});
  const buf = mode === 'picture' ? picture(seg, f, undefined, {n}) : review(seg, f, undefined, {n});
  const img = ctx.createImageData(buf.w, buf.h);
  toRGBA(buf, img.data);
  ctx.putImageData(img, 0, 0);
  if (!marks) for (const L of n.layers) drawGlyphLayer(ctx, L, glyphView(mode === 'picture' ? PIC_SC : ANIM_SC));
  return n;
};

export const makeHost = (spec: PixelSegment, browser?: BrowserModule): React.FC<HostProps> => {
  const Host: React.FC<HostProps> = ({offset = 0, mode = 'picture', marks = false, opts = {}}) => {
    const f = useCurrentFrame() + offset;
    const seg = prepare(spec, opts);
    const B = mode === 'picture' && browser && seg.spec.browser?.frames(f, seg.opts) ? browser.Component : null;
    const ref = useRef<HTMLCanvasElement>(null);
    const [initial] = useState(() => delayRender(`pixel ${spec.seg}`));
    const first = useRef(true);
    const W = mode === 'picture' ? PIC_W : ANIM_W, H = mode === 'picture' ? PIC_H : ANIM_H;
    useLayoutEffect(() => {
      const handle = first.current ? initial : delayRender(`pixel ${spec.seg}`);
      first.current = false;
      if (B) { continueRender(handle); return; }
      ensureGlyphFonts()
        .then(() => {
          const cv = ref.current;
          if (cv) paint(cv.getContext('2d')!, seg, f, mode, marks);
          continueRender(handle);
        })
        .catch((e) => cancelRender(e));
    }, [f, initial, mode, marks, seg, B]);
    if (B) return <AbsoluteFill style={{background: '#07080d'}}><B f={f} seg={seg} /></AbsoluteFill>;
    return (
      <AbsoluteFill style={{background: '#07080d'}}>
        <canvas ref={ref} width={W} height={H} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
      </AbsoluteFill>
    );
  };
  return Host;
};
