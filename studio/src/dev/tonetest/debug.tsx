import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {masTone} from '../../shared/tonal/masTone';
import {analyze} from '../../shared/tonal/render/geom';
import {ToneSvg} from '../../shared/tonal/ToneSvg';

const Dbg: React.FC = () => {
  const model = masTone({lookX: 0.3});
  const inf = analyze(model);
  const txt = inf.map((f) => `${f.i} ${f.p.hue} t${f.p.tone}${f.p.light ? 'L' : ''}${f.p.line ? ' line' : ''} ${f.base ? 'BASE' : 'in:' + f.clipKey} md=${f.minDim.toFixed(0)}`).join('\n');
  return (
    <AbsoluteFill style={{background: '#222', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 13, whiteSpace: 'pre', padding: 10, flexDirection: 'row'}}>
      <div style={{columnCount: 2, width: 900}}>{txt}</div>
      <svg width={1000} height={1080} viewBox="-300 -330 600 650"><ToneSvg model={model} style="soft" texture={0} /></svg>
    </AbsoluteFill>
  );
};
const Cmp: React.FC = () => {
  const model = masTone({lookX: 0.3});
  const v = '-160 -260 330 330';
  const F = ['', '-rim', '-bounce', '-falloff', '-ao', '-sss'];
  return (
    <AbsoluteFill style={{background: '#0E1219', flexDirection: 'row', flexWrap: 'wrap'}}>
      {F.map((f) => (
        <div key={f} style={{position: 'relative', width: 640, height: 540}}>
          <svg width={640} height={540} viewBox={v}><ToneSvg model={model} style="soft" feats={f} /></svg>
          <div style={{position: 'absolute', left: 8, top: 8, color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 20}}>{f || 'all'}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
export const debugFrames: FrameDef[] = [{id: 'tone-debug', component: Dbg}, {id: 'tone-debug-cmp', component: Cmp}];
