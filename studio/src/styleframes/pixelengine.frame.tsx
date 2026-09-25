// MR. MAS — pixelengine: demos of the shared pixel engine (src/shared/pixel). Guide: studio/PIXEL_GUIDE.md
//   pixelengine-switches        one palette/switch per frame (0 BASE, 1 2-TONE FREEZE, 2 1-BIT, 3 EARLY-WEB 16,
//                               4 LEDGER, 5 TERMINAL, 6 masked cone remap, 7 masked cone GLYPH, 8 GLYPH, 9 family step)
//   pixelengine-switches-sheet  3x3 contact sheet of the above (2x crops)
//   pixelengine-dissolve        48f: the call tile breaks into glyph tokens, blows away, re-forms
//   pixelengine-renderfront     48f: 1-BIT -> EARLY-WEB 16 -> BASE render-front sweeps
import type {FrameDef} from '../shared/frame-def';
import {SwitchesDemo, SwitchSheet, DissolveDemo, RenderFrontDemo} from '../dev/pixelengine/Demos';
import {PANELS, DISSOLVE, FRONT} from '../dev/pixelengine/scenes';

export const frames: FrameDef[] = [
  {id: 'pixelengine-switches', component: SwitchesDemo, durationInFrames: PANELS.length, fps: 24},
  {id: 'pixelengine-switches-sheet', component: SwitchSheet},
  {id: 'pixelengine-dissolve', component: DissolveDemo, durationInFrames: DISSOLVE.frames, fps: 24},
  {id: 'pixelengine-renderfront', component: RenderFrontDemo, durationInFrames: FRONT.frames, fps: 24},
];
