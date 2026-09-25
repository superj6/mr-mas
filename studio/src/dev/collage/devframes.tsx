import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {MasHead, NoleHead} from '../../shared/collage/heads';
import {pitchFor} from '../../shared/collage/core';
import {RoomPlate, Desk, Cabinet, Typewriter, Glass, Chair, Sampler, CastShadow} from '../../shared/collage/set';
import {MasTorso, MasHeadLayer, MasArms, MasSilhouette} from '../../shared/collage/mas';
import {Glaze} from '../../shared/collage/light';

const HeadTest: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#1A1C26'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform="translate(420 520) scale(0.82)">
          <MasHead id="t-mas" pitch={pitchFor(0.82)} look={{mirror: true, cyan: 0.6}} />
        </g>
        <g transform="translate(1000 520) scale(0.9)">
          <NoleHead id="t-nole" pitch={pitchFor(0.9)} jaw={12} look={{mirror: true, warm: 0.5}} p={{lookX: 0.6}} />
        </g>
        <g transform="translate(1600 560) scale(1.5)">
          <MasHead id="t-mas2" pitch={pitchFor(1.5)} jaw={4} look={{cyan: 0.4}} p={{mouth: 'smile'}} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const SetTest: React.FC<{lit?: boolean}> = ({lit = true}) => {
  const P = pitchFor(1);
  return (
    <AbsoluteFill style={{background: '#0B0C12'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <RoomPlate pitch={P} night={lit ? 1 : 0} />
        <Sampler pitch={P} />
        <CastShadow id="mas"><MasSilhouette /></CastShadow>
        <Chair pitch={P} />
        <MasTorso pitch={P} pitchHead={P} />
        <MasHeadLayer pitch={P} pitchHead={P} head={{lookX: 0.4}} />
        <Cabinet pitch={P} glow={1} />
        <Desk pitch={P} />
        <Typewriter pitch={P} />
        <MasArms pitch={P} pitchHead={P} />
        <Glass pitch={P} />
      </svg>
    </AbsoluteFill>
  );
};

export const devFrames: FrameDef[] = [
  {id: 'collage-dev-heads', component: HeadTest},
  {id: 'collage-dev-set', component: SetTest},
  {id: 'collage-dev-set-raw', component: SetTest, props: {lit: false}},
];
