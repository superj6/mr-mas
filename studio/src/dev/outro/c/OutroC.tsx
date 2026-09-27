// MR. MAS — outro C: the Remotion hosts. `outro-c-ep1` is the motion mock-up (1 s stand-in + the 7.5 s outro);
// `outro-c-stills` holds one frame per variant (0 = Ep1 at o112, 1 = Ep4, 2 = Ep10).
import React from 'react';
import {PixelScene} from '../../../shared/pixel';
import {drawEp1, drawStill} from './timeline';

export const OutroCEp1: React.FC = () => <PixelScene draw={(fb, f) => { drawEp1(fb, f); }} />;
export const OutroCStills: React.FC = () => <PixelScene draw={(fb, f) => { drawStill(fb, f); }} />;
