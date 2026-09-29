// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): dev entry. Renders ONLY this prototype, on the CPU.
//   npx remotion still  src/dev/range/ep1-p3/entry.tsx ep1-p3 <scratch>/f300.png --frame=300 --log=error
//   npx remotion render src/dev/range/ep1-p3/entry.tsx ep1-p3 <scratch>/silent.mp4 --concurrency=4 --log=error
// ep1-p3-probe renders any list of clip frames in one launch (a review tool):
//   npx remotion render <bundle> ep1-p3-probe <dir> --sequence --props='{"at":[120,250,300]}' --frames=0-2
// The full build (render, sound, mux, stills, sheets): src/dev/range/ep1-p3/tools/build.sh <scratch dir>
import React from 'react';
import {registerRoot, useCurrentFrame} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {P3} from './P3';
import {CLIP_F} from './data';

const Probe: React.FC<{at?: number[]}> = ({at = [0]}) => {
  const i = useCurrentFrame();
  return <P3 at={at[Math.min(at.length - 1, i)]} />;
};

const frames: FrameDef[] = [
  {id: 'ep1-p3', component: P3, durationInFrames: CLIP_F, fps: 24},
  {id: 'ep1-p3-probe', component: Probe as React.FC, durationInFrames: 64, fps: 24},
];

registerRoot(makeRoot(frames));
