import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {AnimeMas} from '../shared/anime/Mas';
import {AnimeNole} from '../shared/anime/Nole';
import {ForegroundBlur, Motes, RoomBack, RoomFront} from '../shared/anime/Room';
import {AnimeMotion} from '../shared/anime/Motion';
import {AnimeGrade, DiffusionDefs} from '../shared/anime/Grade';
import {FONT} from '../shared/theme/fonts';

const Lookdev: React.FC = () => (
  <AbsoluteFill style={{background: '#0A0C1E'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <defs>
        <DiffusionDefs id="ld-diff" />
      </defs>
      <g id="ld-scene">
      <RoomBack flicker={1} blur={2.5} t={0} />
      <Motes t={0} n={36} region={[640, 120, 980, 760]} />
      <g transform="translate(560 385) scale(0.72)">
        <AnimeNole uid="ld-nole" lookX={0.5} lookY={0.2} light={0.78} ink={1.05} night={0.6} />
      </g>
      <g transform="translate(1060 505) scale(0.8)">
        <AnimeMas uid="ld-mas" lookX={0.5} lookY={0.05} ink={1.0} />
      </g>
      <RoomFront flicker={1} t={0} />
      <Motes t={0} n={8} region={[1300, 140, 300, 700]} seed={17} scale={1.8} />
      <ForegroundBlur />
      </g>
      <use href="#ld-scene" filter="url(#ld-diff)" opacity={0.3} style={{mixBlendMode: "screen"}} />
    </svg>
    <AnimeGrade />
    <div style={{position: 'absolute', left: 34, bottom: 26, fontFamily: FONT.mono, fontSize: 15, letterSpacing: 2, color: 'rgba(190,240,255,0.55)'}}>MR. MAS — ANIME CEL · LOOKDEV v1</div>
  </AbsoluteFill>
);

const MOUTHS = ['rest', 'smile', 'A', 'E', 'O', 'M'] as const;
const Cell: React.FC<{x: number; y: number; label: string; who: 'mas' | 'nole'; p: Record<string, unknown>; uid: string}> = ({x, y, label, who, p, uid}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={310} height={340} rx={10} fill="#0E1230" stroke="#23295A" />
    <svg x={0} y={0} width={310} height={310} viewBox={who === 'mas' ? '-250 -372 520 560' : '-262 -340 520 560'}>
      {who === 'mas' ? <AnimeMas uid={uid} ink={0.8} {...p} /> : <AnimeNole uid={uid} ink={0.8} {...p} />}
    </svg>
    <text x={155} y={328} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill="#9FE9FF" letterSpacing={1}>
      {label}
    </text>
  </g>
);
const RigSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#080A1A'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {MOUTHS.map((m, i) => (
        <Cell key={m} x={20 + i * 316} y={16} label={`MAS mouth: ${m}`} who="mas" p={{mouth: m}} uid={`rs-m${i}`} />
      ))}
      {[
        ['lid 0 (open)', {lid: 0}],
        ['lid .55 (half)', {lid: 0.55}],
        ['lid 1 (closed)', {lid: 1}],
        ['look camera', {lookX: -0.4, lookY: 0.1}],
        ['brow +1 / tilt -4', {brow: 1, tilt: -4, hairX: 14}],
        ['brow -1 / look down', {brow: -1, lookY: 1, lookX: 0.2}],
      ].map(([l, p], i) => (
        <Cell key={i} x={20 + i * 316} y={372} label={l as string} who="mas" p={p as Record<string, unknown>} uid={`rs-l${i}`} />
      ))}
      {MOUTHS.map((m, i) => (
        <Cell key={m} x={20 + i * 316} y={728} label={`NOLE mouth: ${m}`} who="nole" p={{mouth: m, lookX: i === 5 ? -0.4 : 0.3}} uid={`rs-n${i}`} />
      ))}
    </svg>
  </AbsoluteFill>
);

export const frames: FrameDef[] = [
  {id: 'anime-lookdev', component: Lookdev},
  {id: 'anime-motion', component: AnimeMotion, durationInFrames: 72, fps: 24},
  {id: 'anime-rig-sheet', component: RigSheet},
];
