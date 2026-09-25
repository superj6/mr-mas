import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {LineScreen} from '../../styleframes/screen/LineScreen';
import {paintMasFeed, paintNoleFeed} from '../../styleframes/screen/feeds';

const FeedTest: React.FC<{mode?: 'lines' | 'dots'; mouth?: any}> = ({mode = 'lines', mouth = 'ee'}) => (
  <AbsoluteFill style={{background: '#05070A', flexDirection: 'row', gap: 20, padding: 20, flexWrap: 'wrap'}}>
    <LineScreen width={560} height={420} mode={mode} pitch={3.8} soften={1.2} bg="#03080B" ink="#2FD2EC" hi="#E6FEFF"
      paint={(c, w, h) => paintMasFeed(c, w, h, {rig: {lookX: 0.3}})} />
    <LineScreen width={900} height={600} mode={mode} pitch={4.4} soften={1.2} bg="#0B0503" ink="#FF6A2A" hi="#FFF1DF"
      paint={(c, w, h) => paintNoleFeed(c, w, h, {rig: {mouth, brow: -0.4}, door: 1, phone: {x: 170, y: 520, s: 0.9, rot: -10, glow: 1}})} />
    <LineScreen width={560} height={420} mode={mode} pitch={3.8} soften={1.2} bg="#03080B" ink="#2FD2EC" hi="#E6FEFF"
      paint={(c, w, h) => paintMasFeed(c, w, h, {rig: {lookX: -0.55, turn: 1, mouth: 'smile', tilt: 2}, headDx: -8})} />
  </AbsoluteFill>
);

export const devFrames: FrameDef[] = [
  {id: 'screen-dev-feeds', component: FeedTest},
  {id: 'screen-dev-dots', component: FeedTest, props: {mode: 'dots'}},
];

const Probe: React.FC = () => <AbsoluteFill style={{background: '#fff', fontSize: 200, color: '#000'}}>dpr {typeof window !== 'undefined' ? window.devicePixelRatio : -1}</AbsoluteFill>;
devFrames.push({id: 'screen-dev-probe', component: Probe});

import {paintNoleBust} from '../../styleframes/screen/feeds';
const MOUTHS = ['rest', 'mm', 'grin', 'ee', 'eh', 'ah', 'oh'] as const;
const NoleChart: React.FC = () => (
  <AbsoluteFill style={{background: '#111', flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8}}>
    {MOUTHS.map((m, i) => (
      <div key={m} style={{position: 'relative'}}>
        <LineScreen width={460} height={520} dpr={1} pitch={3} soften={0.8} floor={0.03} bg="#0B0503" ink="#FF6A2A" hi="#FFF1DF"
          paint={(c, w, h) => paintNoleBust(c, w, h, w / 2, h * 0.5, 0.8, {mouth: m, brow: i % 2 ? 0.8 : -0.5}, 0.25)} />
        <div style={{position: 'absolute', left: 8, top: 6, color: '#fff', fontSize: 24}}>{m}</div>
      </div>
    ))}
  </AbsoluteFill>
);
devFrames.push({id: 'screen-dev-nole', component: NoleChart});
import {ScreenScene} from '../../styleframes/screen/Scene';
devFrames.push({id: 'screen-dev-keyb', component: ScreenScene, props: {frame: 76, cam: {cx: 1000, cy: 470, s: 1.1}, noCursor: true}});
