import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {PrintDefs, PlateGroup, PAPER, Ink} from '../../shared/comic/print';
import {InkTone} from '../../shared/comic/InkTone';
import {Balloon, Caption, Sfx, LetterPaths} from '../../shared/comic/Letterers';
import {ComicPage} from '../../shared/comic/Page';
import {masTone} from '../../shared/tonal/masTone';
import {noleTone} from '../../shared/tonal/noleTone';

const PrintTest: React.FC = () => {
  const mas = masTone({lookX: 0.2});
  const nole = noleTone({mouth: 'open', phone: false});
  return (
    <AbsoluteFill style={{background: '#0b0b0d'}}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <PrintDefs />
        <rect width={1920} height={1080} fill={PAPER} />
        {(['c', 'k'] as const).map((pl) => (
          <PlateGroup key={pl} plate={pl} box={[40, 40, 900, 1000]} dx={pl === 'c' ? 1.5 : 0}>
            <Ink d="M 40 40 H 940 V 1040 H 40 Z" s={{k: 1}} />
            <radialGradient id={'g1' + pl} cx="0.8" cy="0.4" r="0.7">
              <stop offset="0" stopColor={pl === 'c' ? 'rgb(90,0,0)' : 'rgb(255,0,0)'} />
              <stop offset="1" stopColor={pl === 'c' ? 'rgb(255,0,0)' : 'rgb(0,0,0)'} />
            </radialGradient>
            <rect x={40} y={40} width={900} height={1000} fill={`url(#g1${pl})`} />
            <InkTone model={mas} look={{key: 'c', line: 5}} uid="mas" transform="translate(470 560) scale(1.35)" />
          </PlateGroup>
        ))}
        {(['r', 'k'] as const).map((pl) => (
          <PlateGroup key={pl} plate={pl} box={[980, 40, 900, 1000]} dx={pl === 'r' ? -1.5 : 0}>
            <rect x={980} y={40} width={900} height={1000} fill={pl === 'r' ? 'rgb(150,0,0)' : 'rgb(0,0,0)'} />
            <radialGradient id={'g2' + pl} cx="0.75" cy="0.45" r="0.6">
              <stop offset="0" stopColor={pl === 'r' ? 'rgb(0,0,0)' : 'rgb(255,0,0)'} />
              <stop offset="0.5" stopColor={pl === 'r' ? 'rgb(60,0,0)' : 'rgb(200,0,0)'} />
              <stop offset="1" stopColor={pl === 'r' ? 'rgb(255,0,0)' : 'rgb(0,0,0)'} />
            </radialGradient>
            <rect x={980} y={40} width={900} height={1000} fill={`url(#g2${pl})`} />
            <InkTone model={nole} look={{key: 'r', line: 5}} uid="nole" transform="translate(1440 600) scale(-1.25 1.25)" />
          </PlateGroup>
        ))}
        <rect x={40} y={40} width={900} height={1000} fill="none" stroke="#16141A" strokeWidth={7} />
        <rect x={980} y={40} width={900} height={1000} fill="none" stroke="#16141A" strokeWidth={7} />
      </svg>
    </AbsoluteFill>
  );
};

const LetterTest: React.FC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <g transform="translate(60 80)">
        <LetterPaths text={'ABCDEFGHIJKLMNOPQRSTUVWXYZ'} size={40} align="left" />
      </g>
      <g transform="translate(60 160)">
        <LetterPaths text={"0123456789 .,!?'-:/ I'M I CAME. super."} size={40} align="left" />
      </g>
      <Balloon x={520} y={420} text={'I CAME UP WITH\nTHE *NAME!*'} size={46} tail={[820, 640]} seed={3} />
      <Balloon x={1300} y={380} text={'super.'} size={30} tail={[1200, 560]} seed={4} />
      <Balloon x={1650} y={330} text={'BAM!'} size={40} kind="burst" seed={6} />
      <Caption x={80} y={620} text={'11:58 P.M.\nTHE CITY SLEPT.\nTHE MODEL DIDN\'T.'} size={30} />
      <Sfx text="BAM!" x={700} y={880} size={150} fill="#E8502A" keyline={PAPER} rot={-10} />
      <Sfx text="SLAM!" x={1400} y={860} size={140} fill={PAPER} keyline="#E8502A" rot={6} grow={1.25} />
      <Caption x={1500} y={560} text={'NOLE.'} size={60} fill="#E8502A" />
    </svg>
  </AbsoluteFill>
);

const At: React.FC<{frame: number; cx?: number; cy?: number; z?: number; all?: boolean}> = ({frame, cx, cy, z, all}) => (
  <ComicPage frame={frame} cam={cx !== undefined ? {cx, cy: cy!, z: z!} : undefined} all={all} />
);
/** contact sheet: 3x3 frames of the scene */
const Sheet: React.FC<{frames: number[]}> = ({frames}) => (
  <AbsoluteFill style={{background: '#222', display: 'flex', flexWrap: 'wrap'}}>
    {frames.map((fr) => (
      <div key={fr} style={{width: 640, height: 360, position: 'relative', overflow: 'hidden'}}>
        <div style={{width: 1920, height: 1080, transform: 'scale(0.3333)', transformOrigin: '0 0', position: 'absolute'}}>
          <ComicPage frame={fr} />
        </div>
        <div style={{position: 'absolute', left: 6, top: 4, color: '#ff0', fontSize: 22, fontFamily: 'monospace', background: '#000a'}}>{fr}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const devFrames: FrameDef[] = [
  {id: 'comic-dev-at', component: At, props: {frame: 10}},
  {id: 'comic-dev-sheet', component: Sheet, props: {frames: [0, 12, 22, 26, 30, 40, 52, 70, 90]}},
  {id: 'comic-dev-sheet2', component: Sheet, props: {frames: [84, 88, 92, 96, 100, 104, 108, 112, 119]}},
  {id: 'comic-dev-print', component: PrintTest},
  {id: 'comic-dev-letters', component: LetterTest},
];
