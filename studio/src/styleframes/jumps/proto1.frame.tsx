// MR. MAS — style-jump prototype 1 · J1 "CANCELLED" (show/bible/style-jumps.md §5.1).
// 'jump-proto-1': the clip (1920 x 1080, 24 fps, 144 f = 6.0 s: 2.5 s of locked pixel, the click, the 45-f jump,
// the snap and the fall, then 1 s of the locked [CU]). Stills: render the same composition with --frame=N.
// 'jump-proto-1-steppop' is the A/B for the in (family step k 2 instead of the print pop).
import type {FrameDef} from '../../shared/frame-def';
import {JumpProto1} from '../../dev/jumps/proto1/JumpProto1';
import {CLIP} from '../../dev/jumps/proto1/timeline';

export const frames: FrameDef[] = [
  {id: 'jump-proto-1', component: JumpProto1, durationInFrames: CLIP, fps: 24, width: 1920, height: 1080},
  {id: 'jump-proto-1-steppop', component: JumpProto1, props: {pop: 'step'}, durationInFrames: CLIP, fps: 24, width: 1920, height: 1080},
];
