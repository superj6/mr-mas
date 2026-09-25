// MR. MAS — pixelengine demos as pure scene definitions (PixelScene props), shared by the Remotion
// compositions and the Node preview tool. Nothing here touches the DOM.
import {Buf, W, H, rect} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {Mask, coneMask} from '../../shared/pixel/mask';
import {PALETTES, PaletteId, applyPalette, remap, familyStep} from '../../shared/pixel/palettes';
import {glyphDissolve, GlyphStyle} from '../../shared/pixel/glyph';
import {imgFromBuf, holds} from '../../shared/pixel/sprite';
import {nameCard, alertDialog, portraitWindow} from '../../shared/pixel/ui';
import type {PixelSceneProps} from '../../shared/pixel/compose';
import {drawPortrait} from '../pixeladv/art/portraits';
import {drawRoom} from './room';
import {drawCathedral, ORB_IRIS} from './art';

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch'>;

// ------------------------------------------------------------------ shared bits
/** lookdev caption: a small annotation plate, top-left, always in BASE colours (it is not part of the shot) */
const caption = (fb: Buf, name: string, sub: string, _pal?: PaletteId) => {
  const w = textWidth(name) + textWidth(sub) + 14;
  rect(3, 3, w + 8, 13, fb.ink(PAL.N0));
  rect(3, 15, w + 8, 1, fb.ink(PAL.C4));
  text(fb, name, 7, 6, PAL.C7);
  text(fb, sub, 7 + textWidth(name) + 10, 6, PAL.N6);
};

const KEY = 74; // the approved key frame: Nole's jab, hallway light, portrait up
const ORB_AT: [number, number] = [236, 92];
const orbCone = (reach = 1) => {
  const ax = ORB_AT[0] + ORB_IRIS[0], ay = ORB_AT[1] + ORB_IRIS[1];
  return coneMask(ax, ay, 196, 19, 300 * reach, {soft: 2.5, start: 5, fade: 20});
};
const GLYPH_WORLD: GlyphStyle = {cell: [2, 3], bloom: 0.8, tint: PAL.C6, tintAmt: 0.35, noise: 0.35, shimmer: 0.08, tone: {lo: 0.1, hi: 0.5, gamma: 0.8}, floor: 0.03, edgeAt: 1.0};
/** where the scan cone points: the true world's vanishing point sits on the cone's axis */
const CONE_VP: [number, number] = [96, 58];
const ROOM_ONLY = new Mask().addRect(0, 0, W, 201); // 67 whole 3-px glyph rows (align masks to the cell grid)

// ------------------------------------------------------------------ SWITCHES (one panel per frame)
export interface Panel { id: string; title: string; sub: string; scene: SceneDef; }

const basePanel = (id: PaletteId, sub: string): Panel => ({
  id: id.toLowerCase(), title: PALETTES[id].label, sub,
  scene: {
    draw: (fb) => { drawRoom(fb, {world: KEY, ui: true, convo: true}); },
    palette: id === 'BASE' ? null : id,
    after: (fb) => caption(fb, PALETTES[id].label, sub, id),
  },
});

export const PANELS: Panel[] = [
  basePanel('BASE', 'the show'),
  {
    id: 'freeze', title: '2-TONE FREEZE', sub: 'world frozen, Mas keeps moving',
    scene: (() => {
      let mask = new Mask();
      return {
        // the interface is not part of the world: it stays live too
        draw: (fb: Buf, f: number) => { mask = new Mask().addRect(0, 203, W, 67); drawRoom(fb, {world: 44, mas: 44 + f, ui: true, masMask: mask}); },
        switch: () => ({type: 'palette', to: '2TONE_FREEZE', mask, invert: true}),
        after: (fb: Buf, f: number) => {
          nameCard(fb, {x: 12, y: 28, name: 'NOLE', line: 'NAMED IT.', stamp: 'SUED OVER IT.', accent: PAL.W7, k: 20 + f,
            portrait: (b, x, y, w, h) => drawPortrait(b, 'nole', x, y, w, h, 60)});
          caption(fb, '2-TONE FREEZE', 'world frozen / Mas keeps moving', '2TONE_FREEZE');
        },
      } as SceneDef;
    })(),
  },
  {
    id: 'onebit', title: '1-BIT', sub: '1993 only',
    scene: {
      draw: (fb) => { drawRoom(fb, {world: 10, ui: true}); },
      palette: 'ONEBIT',
      after: (fb) => {
        alertDialog(fb, 128, 58, 224, {title: 'MAS MANALT', body: 'no equity.', buttons: ['Cancel', 'OK'], disabled: [0], def: 1});
        caption(fb, '1-BIT', '1993 only', 'ONEBIT');
      },
    },
  },
  basePanel('EARLYWEB16', '2008-14: the palette scales with the era'),
  basePanel('LEDGER', 'money, a few frames at most'),
  basePanel('TERMINAL', "the machine's point of view"),
  {
    id: 'cone-terminal', title: 'MASKED REMAP', sub: 'TERMINAL inside the Orb scan',
    scene: {
      draw: (fb) => { drawRoom(fb, {world: 10, ui: true, orb: {x: ORB_AT[0], y: ORB_AT[1], scanning: true}}); },
      switch: () => ({type: 'palette', to: 'TERMINAL', mask: orbCone()}),
      after: (fb) => caption(fb, 'MASKED REMAP', 'TERMINAL inside the Orb scan'),
    },
  },
  {
    id: 'cone-glyph', title: 'MASKED GLYPH', sub: 'the Orb sees what the room really is',
    scene: (() => {
      const world = new Buf(W, H, PAL.N0);
      return {
        draw: (fb: Buf, f: number) => { drawRoom(fb, {world: 10, mas: 10 + f, ui: true, orb: {x: ORB_AT[0], y: ORB_AT[1], scanning: true}}); drawCathedral(world, f, CONE_VP); },
        switch: () => ({type: 'glyph', mask: orbCone(), source: world, style: GLYPH_WORLD}),
        after: (fb: Buf) => caption(fb, 'MASKED GLYPH', 'the Orb sees what the room really is'),
      } as SceneDef;
    })(),
  },
  {
    id: 'glyph', title: 'GLYPH', sub: 'dark foreshadowing',
    scene: {
      draw: (fb) => { drawRoom(fb, {world: KEY, ui: true, convo: 'portrait'}); },
      switch: () => ({type: 'glyph', mask: ROOM_ONLY, style: {cell: [2, 3], bloom: 0.7, tintAmt: 0.3, noise: 0.12}}),
      after: (fb) => caption(fb, 'GLYPH', 'dark foreshadowing'),
    },
  },
  {
    id: 'bloom', title: 'FAMILY STEP +1', sub: 'the palette blooms brighter',
    scene: {
      draw: (fb) => { drawRoom(fb, {world: KEY, ui: true, convo: true}); },
      switch: () => ({type: 'step', k: 1}),
      after: (fb) => caption(fb, 'FAMILY STEP +1', 'the palette blooms brighter'),
    },
  },
];

// ------------------------------------------------------------------ DISSOLVE (48 frames)
// 0-5 hold / 6-27 the call tile breaks into tokens and blows off screen-right / 28-31 gone /
// 32-45 tokens fly home and snap back to pixels (reverse) / 46-47 hold.
export const DISSOLVE = {frames: 48, out0: 6, outN: 22, in0: 32, inN: 14};
const TILE: [number, number, number, number] = [184, 36, 112, 136];
const KEYC = 0x010203; // transparent key for the tile capture (not a palette colour)
let tileCache: ReturnType<typeof imgFromBuf> | null = null;
const tileImg = () => {
  if (tileCache) return tileCache;
  const t = new Buf(W, H, KEYC);
  const [x, y, w, h] = TILE;
  portraitWindow(t, x, y, w, h, {open: 1, name: 'MAS', accent: PAL.C7, content: (b, px, py, pw, ph) => drawPortrait(b, 'mas', px, py, pw, ph, 112)});
  // capture window + plate (3px bevel margin, plate below)
  tileCache = imgFromBuf(t, x - 3, y - 3, w + 6, h + 6 + 16, KEYC);
  return tileCache;
};
export const dissolveScene: SceneDef = {
  draw: (fb, f) => {
    drawRoom(fb, {world: 10, mas: 10 + f, ui: false}); // world held before the door beat; Mas keeps typing
    remap(fb, familyStep(-2), {rect: [0, 0, W, 203]}); // the room dims under the call UI
    rect(0, 203, W, 67, fb.ink(PAL.N0));
    const img = tileImg();
    const tx = TILE[0] - 3, ty = TILE[1] - 3;
    const phase = holds(f, [['hold', DISSOLVE.out0], ['out', DISSOLVE.outN], ['gone', DISSOLVE.in0 - DISSOLVE.out0 - DISSOLVE.outN], ['in', DISSOLVE.inN], ['hold', 99]]);
    const style: GlyphStyle = {cell: [2, 3], bloom: 0.8, tint: PAL.C6, tintAmt: 0.25};
    if (phase === 'hold') { const l = glyphDissolve(fb, img, tx, ty, {...style, t: -1, frames: 1}); return {layers: [l]}; }
    if (phase === 'gone') return;
    const l = phase === 'out'
      ? glyphDissolve(fb, img, tx, ty, {...style, t: f - DISSOLVE.out0, frames: DISSOLVE.outN, wind: [7, -1.6], spread: 0.5, lead: 2})
      : glyphDissolve(fb, img, tx, ty, {...style, t: f - DISSOLVE.in0, frames: DISSOLVE.inN, wind: [7, -1.6], spread: 0.5, lead: 2, reverse: true, seed: 23});
    return {layers: [l]};
  },
};

// ------------------------------------------------------------------ RENDER FRONT (48 frames)
// 0-7 1-BIT hold / 8-19 sweep -> EARLY-WEB 16 / 20-27 hold / 28-39 sweep -> BASE / 40-47 hold.
export const FRONT = {frames: 48, a0: 8, aN: 12, b0: 28, bN: 12};
export const frontScene: SceneDef = {
  draw: (fb, f) => { drawRoom(fb, {world: 10, mas: 10 + f, ui: true}); },
  palette: (f) => (f < FRONT.a0 ? 'ONEBIT' : f >= FRONT.a0 + FRONT.aN && f < FRONT.b0 ? 'EARLYWEB16' : null),
  switch: (f) =>
    f >= FRONT.a0 && f < FRONT.a0 + FRONT.aN ? {type: 'front', from: 'ONEBIT', to: 'EARLYWEB16', t0: FRONT.a0, frames: FRONT.aN}
      : f >= FRONT.b0 && f < FRONT.b0 + FRONT.bN ? {type: 'front', from: 'EARLYWEB16', to: 'BASE', t0: FRONT.b0, frames: FRONT.bN}
        : null,
};

export {applyPalette, stepColor};
