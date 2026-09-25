import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {masTone} from '../../shared/tonal/masTone';
import {ToneSvg} from '../../shared/tonal/ToneSvg';
import {TONE_STYLES} from '../../shared/tonal/styles';

const MasFix: React.FC = () => (
  <AbsoluteFill style={{flexDirection: 'row', background: '#000'}}>
    {(['paint', 'noir', 'riso', 'engrave'] as const).map((id) => (
      <div key={id} style={{flex: 1, background: id === 'paint' ? '#0B0E14' : TONE_STYLES[id].paper, outline: '1px solid #000'}}>
        <svg width="100%" height="100%" viewBox="-330 -340 660 1180">
          <ToneSvg model={masTone({lookX: 0.3})} style={id} uid={'fix' + id} />
        </svg>
      </div>
    ))}
  </AbsoluteFill>
);
export const frames: FrameDef[] = [{id: 'masfix', component: MasFix}];
