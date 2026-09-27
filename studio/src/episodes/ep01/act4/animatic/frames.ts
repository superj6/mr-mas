// MR. MAS — Ep1 Act Four · THE EDITOR's animatic: composition definitions (owned by THE EDITOR). Registered only by
// ./entry.tsx. v5 (lock v5, the approved stick timing; Animatic5.tsx + frame5.ts) is the current cut; v4 and v3 stay
// renderable for comparison.
//   'ep01-act4-animatic-v5'          the whole act on lock v5 (1920 x 1080: the show frame at 3x + margin + transcript)
//   'ep01-act4-animatic-v5-picture'  the picture only (1920 x 1080, the show frame at 4x): the newcomer test's frame
//   'ep01-act4-animatic-v5-still'    a still of any v5 frame (--props='{"offset": N}' or '{"offset": N, "picture": true}')
//   'ep01-act4-v5-cancel-compare'    the Cancel click both ways (GLYPH, then J1) for the showrunner (Cancel5.tsx)
//   'ep01-act4-animatic-v4'          the whole act on lock v4 (1280 x 720: picture + margin notes + review transcript)
//   'ep01-act4-animatic-v4-picture'  the picture only (960 x 540): the newcomer test's frame (no speaker names)
//   'ep01-act4-animatic-v4-still'    a still of any v4 frame (--props='{"offset": N}')
//   'ep01-act4-animatic' / '-still'  lock v3, unchanged
import type {FrameDef} from '../../../../shared/frame-def';
import {Animatic} from './Animatic';
import {Animatic5} from './Animatic5';
import {Cancel5, COMPARE_LEN} from './Cancel5';
import {ACT_FRAMES} from './data-v3';
import {ACT_FRAMES as ACT_FRAMES_V4} from './data-v4';
import {ACT_FRAMES as ACT_FRAMES_V5} from './data-v5';

export const frames: FrameDef[] = [
  {id: 'ep01-act4-animatic-v5', component: Animatic5, width: 1920, height: 1080, fps: 24, durationInFrames: ACT_FRAMES_V5, props: {offset: 0}},
  {id: 'ep01-act4-animatic-v5-picture', component: Animatic5, width: 1920, height: 1080, fps: 24, durationInFrames: ACT_FRAMES_V5, props: {offset: 0, picture: true}},
  {id: 'ep01-act4-animatic-v5-still', component: Animatic5, width: 1920, height: 1080, props: {offset: 0}},
  {id: 'ep01-act4-v5-cancel-compare', component: Cancel5, width: 1920, height: 1080, fps: 24, durationInFrames: COMPARE_LEN, props: {}},
  {id: 'ep01-act4-animatic-v4', component: Animatic, width: 1280, height: 720, fps: 24, durationInFrames: ACT_FRAMES_V4, props: {offset: 0, version: 4}},
  {id: 'ep01-act4-animatic-v4-picture', component: Animatic, width: 960, height: 540, fps: 24, durationInFrames: ACT_FRAMES_V4, props: {offset: 0, version: 4, picture: true}},
  {id: 'ep01-act4-animatic-v4-still', component: Animatic, width: 1280, height: 720, props: {offset: 0, version: 4}},
  {id: 'ep01-act4-animatic', component: Animatic, width: 1280, height: 720, fps: 24, durationInFrames: ACT_FRAMES, props: {offset: 0}},
  {id: 'ep01-act4-animatic-still', component: Animatic, width: 1280, height: 720, props: {offset: 0}},
];
