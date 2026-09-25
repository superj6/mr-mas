// MR. MAS — intro-ep1: the integrator's picture QC pass (pure; runs in Remotion and in Node probes).
// Applied to every moment's FINAL native frame (after its draw, palette and switches; before glyph layers and the
// UI layer, which are not palette art). It is a no-op on a clean frame.
//
// BANNED colours (guardrails §5, SCRIPT.md §3.4 + §9.5 note 4): no pixel is ever #FF6600, YC's brand orange.
// The engine's EARLYWEB16 set and meras' ERA14 pins still carry that slot (2014, f195-224); until they are fixed at
// the source, the master maps it to #FF7F2A, the approved WHY COMBINATOR orange (same web-era role, same pins).
import type {Buf} from '../shared/pixel/px';
import {composeFrame} from '../shared/pixel/compose';
import type {PixelSceneProps} from '../shared/pixel/compose';

export const BANNED: ReadonlyMap<number, number> = new Map([[0xff6600, 0xff7f2a]]);

/** Replace banned colours in place; returns how many pixels were changed. */
export const qcFrame = (fb: Buf): number => {
  let n = 0;
  const c = fb.c;
  for (let i = 0; i < c.length; i++) {
    const to = BANNED.get(c[i]);
    if (to !== undefined) { c[i] = to; n++; }
  }
  return n;
};

/**
 * Wrap a moment's scene so QC sees its FINAL native frame: the moment's own draw + palette + switches run inside
 * (composeFrame), QC runs on the result, and the glyph layers (switch layers first, then draw layers, as in
 * composeFrame) are handed back. `after` (the UI layer) stays outside, untouched.
 */
export const qcScene = <P extends Pick<PixelSceneProps, 'draw' | 'palette' | 'switch' | 'bg' | 'after'>>(scene: P): P => {
  const inner = {draw: scene.draw, palette: scene.palette, switch: scene.switch, bg: scene.bg};
  return {
    ...scene,
    palette: null,
    switch: null,
    draw: (fb: Buf, f: number) => {
      const {fb: out, layers} = composeFrame(inner, f);
      fb.c.set(out.c);
      qcFrame(fb);
      return {layers};
    },
  };
};
