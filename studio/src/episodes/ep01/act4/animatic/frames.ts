// MR. MAS — Ep1 Act Four · THE EDITOR's animatic: composition definitions (owned by THE EDITOR). Registered only by
// ./entry.tsx. v4 (lock v4, the flow pass) is the current cut; v3 stays renderable for comparison.
//   'ep01-act4-animatic-v4'          the whole act on lock v4 (1280 x 720: picture + margin notes + review transcript)
//   'ep01-act4-animatic-v4-picture'  the picture only (960 x 540): the newcomer test's frame (no speaker names)
//   'ep01-act4-animatic-v4-still'    a still of any v4 frame (--props='{"offset": N}')
//   'ep01-act4-animatic' / '-still'  lock v3, unchanged
import type {FrameDef} from '../../../../shared/frame-def';
import {Animatic} from './Animatic';
import {ACT_FRAMES} from './data-v3';
import {ACT_FRAMES as ACT_FRAMES_V4} from './data-v4';

export const frames: FrameDef[] = [
  {id: 'ep01-act4-animatic-v4', component: Animatic, width: 1280, height: 720, fps: 24, durationInFrames: ACT_FRAMES_V4, props: {offset: 0, version: 4}},
  {id: 'ep01-act4-animatic-v4-picture', component: Animatic, width: 960, height: 540, fps: 24, durationInFrames: ACT_FRAMES_V4, props: {offset: 0, version: 4, picture: true}},
  {id: 'ep01-act4-animatic-v4-still', component: Animatic, width: 1280, height: 720, props: {offset: 0, version: 4}},
  {id: 'ep01-act4-animatic', component: Animatic, width: 1280, height: 720, fps: 24, durationInFrames: ACT_FRAMES, props: {offset: 0}},
  {id: 'ep01-act4-animatic-still', component: Animatic, width: 1280, height: 720, props: {offset: 0}},
];
