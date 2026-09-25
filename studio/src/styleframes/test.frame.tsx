import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {LookProvider} from '../shared/theme/LookContext';
import {LOOKS, LookId} from '../shared/theme/looks';
import {LookDefs} from '../shared/fx/LookDefs';
import {Grain} from '../shared/fx/Grain';
import {Mas} from '../shared/characters/Mas';

const LOOK_ORDER: LookId[] = ['ink', 'bass', 'news', 'gloss', 'onebit'];

const MasLookTest: React.FC = () => (
  <AbsoluteFill style={{background: '#2a2a30', flexDirection: 'row'}}>
    {LOOK_ORDER.map((id) => (
      <LookProvider key={id} look={id}>
        <div style={{flex: 1, position: 'relative', background: LOOKS[id].paper, borderRight: '2px solid #000'}}>
          <svg width="100%" height="100%" viewBox="-300 -300 600 900">
            <LookDefs />
            <Mas />
          </svg>
          <div style={{position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 22, color: id === 'gloss' ? '#fff' : '#111'}}>{LOOKS[id].label}</div>
          <Grain amount={LOOKS[id].grain} />
        </div>
      </LookProvider>
    ))}
  </AbsoluteFill>
);

export const frames: FrameDef[] = [{id: 'test-mas-looks', component: MasLookTest}];
