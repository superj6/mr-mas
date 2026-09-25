// SATIRE dev-only test frames (not part of the main Root).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {PuppetDefs} from './kit';
import {MasHead, MAS_REST} from './MasHead';
import {NoleHead, NOLE_REST} from './NoleHead';
import {SatireFrame} from './SatireScene';

const HeadTest: React.FC<{yaw?: number; pitch?: number; jaw?: number; lid?: number; rim?: number}> = ({yaw = 0, pitch = 0, jaw = 0, lid = 0.3, rim = 0}) => (
  <AbsoluteFill style={{background: '#0B1218'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <PuppetDefs />
      {[-0.3, 0, 0.3].map((yw, i) => (
        <g key={i} transform={`translate(${400 + i * 560} 560) scale(1.15)`}>
          <MasHead id={`m${i}`} p={{...MAS_REST, yaw: yw + yaw, pitch, jaw: i === 1 ? jaw : 0, lid, rim: i === 2 ? 1 : rim, gazeX: yw}} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

const BigHead: React.FC<{yaw?: number; pitch?: number; jaw?: number; lid?: number; rim?: number; smile?: number; gx?: number; gy?: number}> = ({yaw = -0.2, pitch = -0.08, jaw = 0, lid = 0.3, rim = 0.8, smile = 0.15, gx = -0.3, gy = -0.2}) => (
  <AbsoluteFill style={{background: '#0B1218'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <PuppetDefs />
      <g transform="translate(960 560) scale(2.1)">
        <MasHead id="mb" p={{...MAS_REST, yaw, pitch, jaw, lid, rim, smile, gazeX: gx, gazeY: gy}} />
      </g>
    </svg>
  </AbsoluteFill>
);

const Pair: React.FC<{jaw?: number; rim?: number}> = ({jaw = 0, rim = 0.8}) => (
  <AbsoluteFill style={{background: '#0B1218'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <PuppetDefs />
      <g transform="translate(560 600) scale(1.35)">
        <MasHead id="pm" p={{...MAS_REST, yaw: 0.25, pitch: 0.06, rim, gazeX: 0.2, gazeY: 0.1, smile: 0.35}} />
      </g>
      <g transform="translate(1340 520) scale(1.35)">
        <NoleHead id="pn" p={{...NOLE_REST, yaw: -0.25, pitch: -0.05, jaw, rim, gazeX: -0.25, gazeY: -0.05, brow: 0.6, phone: 0.6}} />
      </g>
    </svg>
  </AbsoluteFill>
);

const At: React.FC<{t: number}> = ({t}) => <SatireFrame t={t} />;

export const devFrames: FrameDef[] = [
  {id: 'satire-dev-at', component: At, props: {t: 10}},
  {id: 'satire-dev-pair', component: Pair},
  {id: 'satire-dev-pair-b', component: Pair, props: {jaw: 1}},
  {id: 'satire-dev-masbig', component: BigHead},
  {id: 'satire-dev-mashead', component: HeadTest},
  {id: 'satire-dev-mashead-b', component: HeadTest, props: {jaw: 1, pitch: 0.12, lid: 0.1}},
];
