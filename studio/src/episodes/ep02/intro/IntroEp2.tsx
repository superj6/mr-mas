// MR. MAS — Ep2's intro (`intro-ep2`, 720 frames, 30.0 s): Ep1's intro cut (src/intro/IntroEp1.tsx IntroCut, the same
// EDL) from the moments built for Ep2's slot (slot.ts), with Ep2's own three changes (moments.ts: no idle pointer in the
// cold open, the bookend's pointer on Post, Alyi's card `EFFIGIES: 1`). Everything else is Ep1's picture.
import React from 'react';
import {IntroCut} from '../../../intro/IntroEp1';
import {EP2_SLOT} from './slot';
import {scenesEp2} from './moments';

const SCENES_EP2 = scenesEp2(EP2_SLOT);
export const IntroEp2: React.FC = () => <IntroCut scenes={SCENES_EP2} />;
