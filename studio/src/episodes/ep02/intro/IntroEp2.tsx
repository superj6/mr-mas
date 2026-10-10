// MR. MAS — Ep2's intro (`intro-ep2`, 720 frames, 30.0 s): Ep1's intro cut (src/intro/IntroEp1.tsx IntroCut, the same
// EDL) from the moments built for Ep2's slot (slot.ts). Everything that isn't one of the five changes is Ep1's picture.
import React from 'react';
import {IntroCut} from '../../../intro/IntroEp1';
import {scenesFor} from '../../../intro/scenes';
import {EP2_SLOT} from './slot';

const SCENES_EP2 = scenesFor(EP2_SLOT);
export const IntroEp2: React.FC = () => <IntroCut scenes={SCENES_EP2} />;
