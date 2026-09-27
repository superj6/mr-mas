// MR. MAS — outro E: the Remotion hosts. Everything is drawn by scene.ts on the 480x270 grid; PixelScene presents
// it at 4x nearest-neighbour. `slug` puts the lookdev corner slug LEGAL TEXT: DRAFT on the frame (lookdev only).
import React from 'react';
import {PixelScene} from '../../../shared/pixel/PixelScene';
import {PAL} from '../../../shared/pixel/palette';
import {drawMockup, drawVariant, drawEndState} from './scene';

/** the motion mock-up: 1 s stand-in + the 180-frame outro (+ in Ep1 the moth, to o199); `sting` false = a plain week */
export const OutroE: React.FC<{slug?: boolean; sting?: boolean}> = ({slug = true, sting = true}) => (
  <PixelScene draw={(fb, f) => drawMockup(fb, f, {slug, sting})} bg={PAL.N0} />
);

/** per-episode stills: ep 1 | 3 | 10 (the file-type ladder), or `end` for the final state with the moth landed */
export const OutroEStill: React.FC<{ep?: 1 | 3 | 10; end?: boolean; slug?: boolean}> = ({ep = 10, end = false, slug = true}) => (
  <PixelScene draw={(fb) => (end ? drawEndState(fb, {slug}) : drawVariant(fb, ep, {slug}))} bg={PAL.N0} hold={0} />
);
