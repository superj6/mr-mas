// MR. MAS — structure test "pixeladv": 1990s point-and-click adventure, true pixel art at 480x270
// (4x nearest-neighbour to 1080p), palette-shaded light zones, sprite-frame animation, dialogue portraits.
import type {FrameDef} from '../shared/frame-def';
import {PixelCanvas} from '../dev/pixeladv/PixelCanvas';
import {FRAMES} from '../dev/pixeladv/scene';

export const frames: FrameDef[] = [
  {id: 'pixeladv-scene', component: PixelCanvas, durationInFrames: FRAMES, fps: 24},
  {id: 'pixeladv-key', component: PixelCanvas, props: {hold: 74}},
  {id: 'pixeladv-extra-portraits', component: PixelCanvas, props: {sheet: 'portraits'}},
  {id: 'pixeladv-extra-lineup', component: PixelCanvas, props: {sheet: 'lineup'}},
  {id: 'pixeladv-extra-switch', component: PixelCanvas, props: {sheet: 'switch'}},
];
