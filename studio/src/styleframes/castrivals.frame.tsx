// MR. MAS — castrivals: MARIO + NOLE + the skyline bosses, in the approved pixel-adventure style
// (native 480x270, 4x nearest-neighbour, indexed palette, hand-built light ramps).
import type {FrameDef} from '../shared/frame-def';
import {CastCanvas} from '../dev/castrivals/CastCanvas';
import {MOTION_FRAMES} from '../dev/castrivals/sheet';

export const frames: FrameDef[] = [
  {id: 'castrivals-sheet', component: CastCanvas, props: {view: 'still'}},
  {id: 'castrivals-motion', component: CastCanvas, props: {view: 'sheet'}, durationInFrames: MOTION_FRAMES, fps: 24},
  {id: 'castrivals-extra-nole', component: CastCanvas, props: {view: 'extra-nole'}},
  {id: 'castrivals-extra-mario', component: CastCanvas, props: {view: 'extra-mario'}},
  {id: 'castrivals-extra-bosses', component: CastCanvas, props: {view: 'extra-bosses'}},
  {id: 'castrivals-extra-freeze', component: CastCanvas, props: {view: 'extra-freeze'}},
];
