// MR. MAS — mrollcall: Remotion components for "THE PLAYERS" roll call (intro f480-539).
//   <MRollcall/>          the 60-frame moment; LOCAL frame 0 = GLOBAL 480 (toGlobal in timeline.ts)
//   <MRollcallSequence/>  the same, mounted at its place in the full intro (<Sequence from={480} ...>)
//   <MRollcallSheet/>     all 8 portraits at their signature frames (960x540 native, shown 2x)
//   <MRollcallHold g=.../> one global frame held (key stills)
import React from 'react';
import {Sequence} from 'remotion';
import {PixelScene} from '../../shared/pixel/PixelScene';
import type {Buf} from '../../shared/pixel/px';
import {drawRollcall, drawSheet, SHEET_W, SHEET_H} from './scene';
import {MR, toGlobal} from './timeline';

const draw = (fb: Buf, f: number) => drawRollcall(fb, toGlobal(f));

export const MRollcall: React.FC = () => <PixelScene draw={draw} />;

export const MRollcallSequence: React.FC = () => (
  <Sequence from={MR.from} durationInFrames={MR.frames} name="mrollcall: THE PLAYERS">
    <MRollcall />
  </Sequence>
);

const drawHeld = (g: number) => (fb: Buf) => drawRollcall(fb, g);
export const MRollcallHold: React.FC<{g: number}> = ({g}) => {
  const d = React.useMemo(() => drawHeld(g), [g]);
  return <PixelScene draw={d} hold={0} />;
};

const sheetDraw = (fb: Buf) => drawSheet(fb);
export const MRollcallSheet: React.FC = () => <PixelScene draw={sheetDraw} nativeW={SHEET_W} nativeH={SHEET_H} hold={0} />;
