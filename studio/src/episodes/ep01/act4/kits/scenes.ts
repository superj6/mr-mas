// MR. MAS — ep01 act4 kits preview: the demo scenes (PixelSceneProps), one per kit. Used by the Remotion entry
// (Kits.tsx) and the Node preview (tools/preview.ts).
import type {PixelSceneProps} from '../../../../shared/pixel/compose';
import {PAL} from '../../../../shared/pixel/palette';
import {drawPlanFrame, PLAN_FRAMES, drawFlashFrame, FLASH_FRAMES} from './plan';
import {drawCall, callAfter, CALL_FRAMES, drawHearts, HEART_FRAMES, drawTiles, tilesAfter, TILE_FRAMES, drawProps, PROP_FRAMES, drawExtras, EXTRA_FRAMES} from './demos';

export type Scene = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg'> & {frames: number};

export const SCENES: Record<string, Scene> = {
  plan: {draw: (fb, f) => { drawPlanFrame(fb, f); }, bg: PAL.N0, frames: PLAN_FRAMES},
  flash: {draw: (fb, f) => { drawFlashFrame(fb, f, 'print'); }, bg: PAL.N0, frames: FLASH_FRAMES},
  flashtrace: {draw: (fb, f) => { drawFlashFrame(fb, f, 'trace'); }, bg: PAL.N0, frames: FLASH_FRAMES},
  call: {draw: (fb, f) => ({layers: drawCall(fb, f)}), after: callAfter, bg: PAL.N0, frames: CALL_FRAMES},
  hearts: {draw: (fb, f) => { drawHearts(fb, f); }, bg: PAL.N0, frames: HEART_FRAMES},
  tiles: {draw: (fb, f) => { drawTiles(fb, f); }, after: tilesAfter, bg: PAL.N0, frames: TILE_FRAMES},
  props: {draw: (fb, f) => { drawProps(fb, f); }, bg: PAL.N0, frames: PROP_FRAMES},
  extras: {draw: (fb, f) => { drawExtras(fb, f); }, bg: PAL.N0, frames: EXTRA_FRAMES},
};
