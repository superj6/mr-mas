import React from 'react';
import type {FrameDef} from '../shared/frame-def';
import {ScreenScene, Cam} from './screen/Scene';
import {LineupFrame, SwitchFrame} from './screen/extras';
import {SCENE_FRAMES} from './screen/anim';

/**
 * SCREENLIFE / UI-NATIVE structure (builder key: screen).
 * The test beat told entirely through Mas's desktop: Presence (video calls), Z (posts), a terminal,
 * and a water widget. Characters live only inside line-screen video tiles.
 */
const At: React.FC<{frame: number; cam?: Cam; noCursor?: boolean}> = (p) => <ScreenScene {...p} />;

export const frames: FrameDef[] = [
  {id: 'screen-scene', component: ScreenScene, durationInFrames: SCENE_FRAMES, fps: 24},
  {id: 'screen-key', component: At, props: {frame: 76, cam: {cx: 960, cy: 520, s: 1.0}, noCursor: true}},
  {id: 'screen-extra-closeup', component: At, props: {frame: 106, noCursor: true}},
  {id: 'screen-extra-lineup', component: LineupFrame},
  {id: 'screen-extra-switch', component: SwitchFrame},
];
