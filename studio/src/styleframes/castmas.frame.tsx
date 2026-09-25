// MR. MAS — castmas: the cast in the approved pixel look (MAS across the eras, GERG, ALYI).
// Art lives in src/shared/pixel/cast/{mas,gerg,alyi,kit}.ts; sheets/motion in src/dev/castmas/.
import type {FrameDef} from '../shared/frame-def';
import {CastCanvas} from '../dev/castmas/CastCanvas';
import {MOTION_FRAMES} from '../dev/castmas/sheet';

export const frames: FrameDef[] = [
  {id: 'castmas-sheet', component: CastCanvas, props: {view: 'sheet'}},
  {id: 'castmas-extra', component: CastCanvas, props: {view: 'extra'}},
  {id: 'castmas-motion', component: CastCanvas, props: {view: 'motion'}, durationInFrames: MOTION_FRAMES, fps: 24},
];
