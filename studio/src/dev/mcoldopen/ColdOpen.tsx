// MR. MAS — mcoldopen: Remotion host for the cold open (intro f0-119).
// The composition's local frame IS the intro frame (the span starts at 0). To mount it inside the full
// intro, use <ColdOpenMount/> (a Sequence at SPAN.from) — or read SPAN and place <ColdOpen/> yourself.
import React from 'react';
import {Sequence, useCurrentFrame} from 'remotion';
import {PixelScene} from '../../shared/pixel';
import {coldOpen} from './scene';
import {SPAN, toGlobal} from './timeline';

/** The span itself. `frame` overrides the clock (stills). Local frame -> global intro frame via SPAN. */
export const ColdOpen: React.FC<{frame?: number}> = ({frame}) => {
  const local = useCurrentFrame();
  return <PixelScene {...coldOpen} hold={toGlobal(frame ?? local)} />;
};

/** Drop-in for the intro integrator: mounts the cold open at its global frames. */
export const ColdOpenMount: React.FC = () => (
  <Sequence from={SPAN.from} durationInFrames={SPAN.durationInFrames} name="mcoldopen (f0-119)">
    <ColdOpen />
  </Sequence>
);

export {SPAN};
