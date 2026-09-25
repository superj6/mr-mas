// MR. MAS — mdinner1: the Remotion component. Runs LOCAL frames 0..134 = GLOBAL intro frames 225..359.
//   <Mdinner1Sequence />               mounts the whole span at global 225 (duration 135)
//   <Mdinner1Sequence until={344} />   hands off to mdinner2 at 345: the lens-side candle (340-344) is the wipe
import React from 'react';
import {Sequence} from 'remotion';
import {PixelScene} from '../../shared/pixel/PixelScene';
import {SCENE} from './scene';
import {MD1} from './timeline';

export const Mdinner1: React.FC<{hold?: number}> = ({hold}) => <PixelScene {...SCENE} hold={hold} />;

/** For the integrator: mount the span at its place on the 720-frame intro timeline (global frames). */
export const Mdinner1Sequence: React.FC<{until?: number}> = ({until = MD1.to}) => (
  <Sequence from={MD1.from} durationInFrames={Math.min(MD1.to, until) - MD1.from + 1} name="mdinner1 · THE WOODROSE (GERG, ALYI)">
    <Mdinner1 />
  </Sequence>
);
export {MD1};
