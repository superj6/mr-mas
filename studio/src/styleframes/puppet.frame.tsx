import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {PaperDefs, Piece, rect} from './puppet/paper';
import {Mas} from './puppet/mas';
import {Nole} from './puppet/nole';
import {PuppetScene} from './puppet/scene';
import {PuppetLineup, PuppetKit, PuppetStocks} from './puppet/extras';

const Sheet: React.FC<{frames: number[]; k?: number}> = ({frames, k = 0.25}) => (
  <AbsoluteFill style={{background: '#111', flexDirection: 'row', flexWrap: 'wrap'}}>
    {frames.map((f) => (
      <div key={f} style={{width: 1920 * k, height: 1080 * k, position: 'relative', overflow: 'hidden'}}>
        <div style={{width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute'}}>
          <PuppetScene frame={f} />
        </div>
        <div style={{position: 'absolute', left: 6, top: 4, color: '#fff', font: '700 18px monospace', textShadow: '0 0 4px #000'}}>{f}</div>
      </div>
    ))}
  </AbsoluteFill>
);

const RigTest: React.FC = () => (
  <AbsoluteFill style={{background: '#d8cdb8'}}>
    <PaperDefs />
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <Piece d={rect(40, 40, 1840, 1000, 3)} fill="#cdbfa5" z={0} tex="kraft" />
      <g transform="translate(330 1250) scale(3.2)">
        <Mas p={{head: 'front', lookX: 0.8, mouth: 'smile'}} />
      </g>
      <g transform="translate(1000 1420) scale(3.2)">
        <Nole p={{jaw: 0.6}} />
      </g>
      <g transform="translate(1560 520) scale(1)">
        <Nole p={{torsoA: -15, pSh: 75, pEl: 10, pWr: -18, bSh: -30, bEl: -70, fTh: 20, bTh: -8, bKn: 10}} />
      </g>
    </svg>
  </AbsoluteFill>
);

export const frames: FrameDef[] = [
  {id: 'puppet-rigtest', component: RigTest},
  {id: 'puppet-sheet-a', component: Sheet, props: {frames: [0, 12, 23, 24, 25, 26, 27, 28, 30, 32, 36, 44, 50, 56, 62, 72]}},
  {id: 'puppet-sheet-c', component: Sheet, props: {frames: [10, 62, 96, 106], k: 0.5}},
  {id: 'puppet-sheet-d', component: Sheet, props: {frames: [30, 34, 40, 110], k: 0.5}},
  {id: 'puppet-sheet-b', component: Sheet, props: {frames: [78, 84, 87, 90, 93, 95, 97, 99, 101, 104, 106, 108, 110, 112, 115, 119]}},
  {id: 'puppet-key', component: PuppetScene, props: {frame: 106, cam: {cx: 1060, cy: 468, z: 1.17}}},
  {id: 'puppet-extra-closeup', component: PuppetScene, props: {frame: 106, cam: {cx: 1030, cy: 470, z: 2.35}}},
  {id: 'puppet-lineup', component: PuppetLineup},
  {id: 'puppet-kit', component: PuppetKit},
  {id: 'puppet-stocks', component: PuppetStocks},
  {id: 'puppet-scene', component: PuppetScene, durationInFrames: 120, fps: 24},
  {id: 'puppet-f', component: PuppetScene, durationInFrames: 120, fps: 24, props: {}},
  {id: 'puppet-tear', component: PuppetScene, durationInFrames: 120, fps: 24, props: {cam: {cx: 1500, cy: 560, z: 2}, noSlips: true}},
  {id: 'puppet-close', component: PuppetScene, durationInFrames: 120, fps: 24, props: {cam: {cx: 1000, cy: 560, z: 2.6}, noSlips: true}},
];
