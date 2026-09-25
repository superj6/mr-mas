// MR. MAS — meras: the Remotion side. <Meras/> renders the span with LOCAL frames 0..119 (global 120..239);
// <MerasMount/> places it on the full intro timeline; <MerasStill g={...}/> holds one GLOBAL frame.
import React from 'react';
import {Sequence} from 'remotion';
import {PixelScene} from '../../shared/pixel/PixelScene';
import {merasScene} from './scene';
import {MERAS_START, MERAS_FRAMES} from './timeline';

export const Meras: React.FC = () => <PixelScene {...merasScene} />;

/** Mount inside the 720-frame intro: frame numbers inside match the intro timeline. */
export const MerasMount: React.FC = () => (
  <Sequence from={MERAS_START} durationInFrames={MERAS_FRAMES} name="meras 1993-2015">
    <Meras />
  </Sequence>
);

/** One global intro frame as a still (key frames). */
export const MerasStill: React.FC<{g: number}> = ({g}) => <PixelScene {...merasScene} hold={g - MERAS_START} />;
