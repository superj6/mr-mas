// MR. MAS — shared pixel engine: the frame pipeline (pure, no DOM — runs in Node previews too).
//   new Buf(bg) -> draw() -> palette -> switches (in order) -> after()  => {fb, layers}
// <PixelScene> (PixelScene.tsx) is this plus presentation and the glyph font.
import {Buf, W, H, TRANSPARENT} from './px';
import {PAL} from './palette';
import {Mask} from './mask';
import {PaletteRef, applyPalette, inPalette, familyStep, remap} from './palettes';
import {GlyphLayer, GlyphStyle, glyphLayer} from './glyph';
import {Dir, FrontOpts, renderFront, frontPos, ditherFade} from './transitions';

export type SwitchSpec =
  /** masked palette remap: the Orb scan (inside a cone), the founders' freeze (outside Mas: invert) */
  | {type: 'palette'; to: PaletteRef; mask?: Mask; invert?: boolean}
  /** family step: k>0 "the palette blooms brighter", k<0 dim */
  | {type: 'step'; k: number; mask?: Mask; invert?: boolean}
  /** GLYPH render of the frame (or of `source`, e.g. the true world behind the room) inside `mask` */
  | {type: 'glyph'; mask?: Mask; source?: Buf; style?: GlyphStyle}
  /** RENDER FRONT: scanline sweep upgrading palette `from` -> `to` over frames t0..t0+frames */
  | ({type: 'front'; from: PaletteRef; to: PaletteRef; t0: number; frames: number; dir?: Dir} & Omit<FrontOpts, 'dir' | 'smear'>)
  /** ordered-dither crossfade between two palettes, t 0..1 */
  | {type: 'fade'; from: PaletteRef; to: PaletteRef; t: number};

export type Switches = SwitchSpec | SwitchSpec[] | null | undefined | false;

export interface DrawResult {
  /** extra glyph layers (dissolving tokens, hand-placed glyph text) drawn above the frame */
  layers?: GlyphLayer[];
}

export interface PixelSceneProps {
  /** paint the native frame; `fb` is cleared to `bg` first */
  draw: (fb: Buf, frame: number) => void | DrawResult;
  /**
   * UI that must never switch (name cards over a frozen frame, dialogs, captions). Paints into a separate
   * TRANSPARENT-filled layer that is composited above the frame AND above glyph layers.
   */
  after?: (ui: Buf, frame: number) => void | DrawResult;
  palette?: PaletteRef | ((frame: number) => PaletteRef | null) | null;
  switch?: Switches | ((frame: number) => Switches);
  /** clear colour (native) and letterbox colour. Default N0 */
  bg?: number;
  /** hold a specific frame (stills) */
  hold?: number;
  /** native size. Default 480x270 */
  nativeW?: number;
  nativeH?: number;
}

const asList = (s: Switches): SwitchSpec[] => (!s ? [] : Array.isArray(s) ? s : [s]);

/** Run the non-DOM part of the pipeline (usable in Node previews / tests). */
export const composeFrame = (p: Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg' | 'nativeW' | 'nativeH'>, f: number) => {
  const fb = new Buf(p.nativeW ?? W, p.nativeH ?? H, p.bg ?? PAL.N0);
  const res = p.draw(fb, f) || {};
  const pal = typeof p.palette === 'function' ? p.palette(f) : p.palette;
  if (pal) applyPalette(fb, pal);
  const layers: GlyphLayer[] = [];
  const sws = asList(typeof p.switch === 'function' ? p.switch(f) : p.switch);
  for (const s of sws) {
    if (s.type === 'palette') applyPalette(fb, s.to, {mask: s.mask, invert: s.invert});
    else if (s.type === 'step') remap(fb, familyStep(s.k), {mask: s.mask, invert: s.invert});
    else if (s.type === 'glyph') layers.push(glyphLayer(s.source ?? fb, s.style, s.mask, f));
    else if (s.type === 'front') {
      const len = s.dir === 'right' || s.dir === 'left' ? fb.w : fb.h;
      const {pos, smear} = frontPos(f, s.t0, s.frames, len, s.glow ?? 5);
      const a = inPalette(fb, s.from), b = inPalette(fb, s.to);
      renderFront(fb, a, b, pos, {...s, smear});
    } else if (s.type === 'fade') {
      ditherFade(fb, inPalette(fb, s.from), inPalette(fb, s.to), s.t);
    }
  }
  if (res.layers) layers.push(...res.layers);
  let ui: Buf | null = null;
  const uiLayers: GlyphLayer[] = [];
  if (p.after) {
    ui = new Buf(fb.w, fb.h, TRANSPARENT);
    const post = p.after(ui, f) || {};
    if (post.layers) uiLayers.push(...post.layers);
  }
  return {fb, layers, ui, uiLayers};
};

