// SATIRE structure — workshop lineup still: both puppets on a grey sweep, neutral studio light.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../shared/theme/fonts';
import type {XY} from './lib';
import {PuppetDefs} from './kit';
import {MasHead, MAS_REST} from './MasHead';
import {NoleHead, NOLE_REST} from './NoleHead';
import {MasTorso, NoleTorso} from './Bodies';

export const Lineup: React.FC = () => {
  const L: XY = [-0.75, -0.45];
  return (
    <AbsoluteFill style={{background: '#2A2C30'}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <PuppetDefs />
        <defs>
          <radialGradient id="lu-bg" cx="900" cy="420" r="1100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6A6E74" />
            <stop offset="0.55" stopColor="#3A3D42" />
            <stop offset="1" stopColor="#16171A" />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#lu-bg)" />
        {/* scale lines on the sweep (lineup convention) */}
        {Array.from({length: 11}).map((_, i) => {
          const y = 1040 - i * 96;
          return (
            <g key={i} opacity={0.35}>
              <line x1={140} y1={y} x2={1780} y2={y} stroke="#C8CCD2" strokeWidth={i % 5 === 0 ? 2 : 1} strokeDasharray={i % 5 === 0 ? undefined : '6 10'} />
              <text x={120} y={y + 6} textAnchor="end" fontFamily={FONT.mono} fontSize={18} fill="#C8CCD2">
                {i * 10}
              </text>
            </g>
          );
        })}
        {/* soft floor shadows behind the puppets */}
        <g filter="url(#pb40)" opacity={0.55}>
          <ellipse cx={760} cy={620} rx={260} ry={420} fill="#0A0B0D" />
          <ellipse cx={1380} cy={560} rx={330} ry={480} fill="#0A0B0D" />
        </g>
        <g transform="translate(640 470) scale(0.92)">
          <MasTorso b={{L, key: 0.9, rim: 0.6, breath: 0.5, sway: 2}} id="lu-mt" />
          <MasHead id="lu-mas" p={{...MAS_REST, yaw: 0.14, pitch: 0.02, gazeX: 0.05, gazeY: 0.02, lid: 0.3, smile: 0.25, key: 1, rim: 0.6, light: L}} />
        </g>
        <g transform="translate(1290 330) scale(0.92)">
          <NoleTorso b={{L, key: 0.9, rim: 0.7, phone: 0, shoulder: 0, elbow: 0, lean: 0}} id="lu-nt" />
          <g transform="translate(0 26)">
          <NoleHead id="lu-nole" p={{...NOLE_REST, yaw: -0.16, pitch: -0.02, gazeX: -0.08, gazeY: -0.04, smile: 0.7, brow: 0.3, key: 1, rim: 0.7, light: L}} />
          </g>
        </g>
        {/* the workbench doubles as the playboard: the puppeteers' arms end below it */}
        <defs>
          <linearGradient id="lu-bench" x1="0" y1="880" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3A2A20" />
            <stop offset="0.12" stopColor="#24180F" />
            <stop offset="1" stopColor="#0C0806" />
          </linearGradient>
        </defs>
        <rect x={0} y={880} width={1920} height={200} fill="url(#lu-bench)" />
        <rect x={0} y={878} width={1920} height={5} fill="#7A5E48" opacity={0.8} />
        <g filter="url(#pb20)" opacity={0.6}>
          <rect x={0} y={884} width={1920} height={30} fill="#000" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 150, bottom: 56, fontFamily: FONT.wordmark, color: '#E8EAEE'}}>
        <div style={{fontSize: 44, fontWeight: 600, letterSpacing: 4}}>MAS MANALT</div>
        <div style={{fontFamily: FONT.mono, fontSize: 18, opacity: 0.7, marginTop: 4}}>latex head 1.6× · glass eyes · hinged jaw · cowlick on a spring</div>
      </div>
      <div style={{position: 'absolute', right: 150, bottom: 60, textAlign: 'right', fontFamily: FONT.wordmark, color: '#E8EAEE'}}>
        <div style={{fontSize: 44, fontWeight: 600, letterSpacing: 4}}>NOLE</div>
        <div style={{fontFamily: FONT.mono, fontSize: 18, opacity: 0.7, marginTop: 4}}>latex head 1.6× · the jaw is the caricature · rod arm</div>
      </div>
      <div style={{position: 'absolute', left: 150, top: 52, fontFamily: FONT.mono, fontSize: 18, letterSpacing: 3, color: 'rgba(232,234,238,0.6)'}}>
        MR·MAS — PUPPET SHOP LINEUP — LOOKDEV
      </div>
    </AbsoluteFill>
  );
};
