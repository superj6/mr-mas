// MR. MAS - style-range Prototype 1 (THE READ, 10.C + J4 placeholder): dev entry. Renders ONLY this prototype.
//   npx remotion still  src/dev/range/p1/entry.tsx range-p1-keytest ../out/range/p1-keytest.png --bundle-cache=false --log=error
//   npx remotion render src/dev/range/p1/entry.tsx range-p1 <scratch>/p1-silent.mp4 --concurrency=4 --bundle-cache=false --log=error
// range-p1-probe renders any list of clip frames in one launch (a dev review tool):
//   npx remotion render <bundle> range-p1-probe <dir> --sequence --props='{"at":[150,200,330]}' --frames=0-2
import React from 'react';
import {registerRoot, useCurrentFrame} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {KeyTest} from './anime/KeyTest';
import {P1} from './P1';
import {CLIP_F} from './geo';

const Probe: React.FC<{at?: number[]}> = ({at = [0]}) => {
  const i = useCurrentFrame();
  return <P1 at={at[Math.min(at.length - 1, i)]} />;
};

const frames: FrameDef[] = [
  {id: 'range-p1-keytest', component: KeyTest},
  {id: 'range-p1', component: P1, durationInFrames: CLIP_F, fps: 24},
  {id: 'range-p1-probe', component: Probe as React.FC, durationInFrames: 64, fps: 24},
];

registerRoot(makeRoot(frames));
