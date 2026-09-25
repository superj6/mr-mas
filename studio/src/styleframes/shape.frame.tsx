import React from 'react';
import type {FrameDef} from '../shared/frame-def';
import {Scene, SceneAt} from './shape/scene';
import {ExtraLineup, ExtraMasCU, ExtraSwitch} from './shape/extras';

/** GRAPHIC-SHAPE CINEMA (key: shape). Deliverables: shape-scene (120f), shape-key, shape-extra-*. */
export const KEY_FRAME = 74;
const At = (f: number): React.FC => () => <SceneAt f={f} />;

export const frames: FrameDef[] = [
  {id: 'shape-scene', component: Scene, durationInFrames: 120, fps: 24},
  {id: 'shape-key', component: At(KEY_FRAME)},
  {id: 'shape-extra-lineup', component: ExtraLineup},
  {id: 'shape-extra-mascu', component: ExtraMasCU},
  {id: 'shape-extra-switch', component: ExtraSwitch},
];
