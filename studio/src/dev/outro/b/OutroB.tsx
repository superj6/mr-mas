// MR. MAS · outro B: the Remotion hosts. `outro-b-ep1` is the motion mock-up (stand-in + Ep1's 240-frame outro, its
// moth stinger in bars 3-4, + 18 f of black: 282 f); its props pick another episode's state ({ep: 6 | 10}: a plain week,
// cut at o179, black after). `outro-b-stills` is one frame per variant state (timeline.ts STILLS): render a single one
// with --frame=<index>.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PixelScene} from '../../../shared/pixel/PixelScene';
import {makeScene, SceneDef} from './scene';
import {EpId, PRE, STILLS} from './timeline';

const SCENES = new Map<EpId, SceneDef>();
const sceneFor = (ep: EpId) => {
  let s = SCENES.get(ep);
  if (!s) { s = makeScene(ep); SCENES.set(ep, s); }
  return s;
};

export const OutroB: React.FC<{ep?: EpId; hold?: number}> = ({ep = 1, hold}) => <PixelScene {...sceneFor(ep)} hold={hold} />;

export const OutroBStills: React.FC = () => {
  const i = useCurrentFrame();
  const s = STILLS[Math.min(STILLS.length - 1, i)];
  return <PixelScene {...sceneFor(s.ep)} hold={PRE + s.o} />;
};
