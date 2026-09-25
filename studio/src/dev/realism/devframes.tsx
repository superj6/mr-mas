// Dev-only lookdev frames for the realism structure (builder key: realism).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {MasHeadA} from '../../shared/realism/masA';
import {PAL} from '../../shared/realism/palette';
import {rigMonitor} from '../../shared/realism/rigs';
import {LightTest} from './lighttest';

const HeadSheet: React.FC<{rim?: number}> = ({rim = 0}) => (
  <AbsoluteFill style={{background: PAL.room}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <g transform="translate(640 560) scale(1.8)">
        <MasHeadA light={rigMonitor(rim)} />
      </g>
      <g transform="translate(1460 300) scale(0.8)">
        <MasHeadA light={rigMonitor(1)} blink={0} smile={1} />
      </g>
      <g transform="translate(1460 780) scale(0.8)">
        <MasHeadA light={rigMonitor(0)} normals />
      </g>
    </svg>
  </AbsoluteFill>
);

export const devFrames: FrameDef[] = [
  {id: 'realism-dev-head', component: HeadSheet},
  {id: 'realism-dev-light', component: LightTest},
];
