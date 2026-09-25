// MR. MAS — intro-ep1 review compositions (integrator only; not in the main Root).
//   intro-raw-<moment>  720 frames on the GLOBAL clock, showing ONLY that moment over its whole authored span
//                       (black elsewhere). Used to compare both sides of an overlap frame by frame.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {INTRO_FRAMES, FPS} from '../../shared/timing';
import {EDL, Edit} from '../../intro/edl';
import {EditMount} from '../../intro/IntroEp1';

const Raw: React.FC<{e: Edit}> = ({e}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <EditMount e={{...e, from: e.span[0], to: e.span[1]}} />
  </AbsoluteFill>
);

export const reviewFrames: FrameDef[] = EDL.map((e) => ({
  id: `intro-raw-${e.id}`,
  component: () => <Raw e={e} />,
  durationInFrames: INTRO_FRAMES,
  fps: FPS,
}));
