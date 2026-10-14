// MR. MAS — Ep3's intro (`intro-ep3`, 720 frames, 30.0 s): Ep1's intro cut (src/intro/IntroEp1.tsx IntroCut, the same
// EDL) from the moments built for Ep3's slot (slot.ts), with Ep3's own three changes (moments.ts: no idle pointer in the
// cold open, the bookend's pointer on Post, Alyi's card `EFFIGIES: 1`). Everything else is Ep1's picture.
import React from 'react';
import {IntroCut} from '../../../intro/IntroEp1';
import {EP3_SLOT} from './slot';
import {scenesEp3} from './moments';

const SCENES_EP3 = scenesEp3(EP3_SLOT);
export const IntroEp3: React.FC = () => <IntroCut scenes={SCENES_EP3} />;
