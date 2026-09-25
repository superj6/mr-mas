// MR. MAS — mdinner2: the Remotion component for intro frames 345-479 (MARIO + NOLE cards, OPEN -> NOPE).
// The composition's LOCAL frame 0 is GLOBAL frame 345. To mount it in the full intro:
//   <Mdinner2Sequence />                        (a <Sequence from={345} durationInFrames={135}>)
// or   <Sequence from={MDINNER2.from} durationInFrames={MDINNER2.durationInFrames}><Mdinner2 /></Sequence>
import React from 'react';
import {Sequence} from 'remotion';
import {PixelScene} from '../../shared/pixel/PixelScene';
import {SCENE} from './scene';
import {MD2_FROM, MD2_DURATION} from './timeline';

export const MDINNER2 = {from: MD2_FROM, durationInFrames: MD2_DURATION} as const;

/** The span itself (local frames 0..134). `hold` renders one local frame (stills). */
export const Mdinner2: React.FC<{hold?: number}> = ({hold}) => <PixelScene {...SCENE} hold={hold} />;

/** Mounted at its global position inside a full-intro composition. */
export const Mdinner2Sequence: React.FC = () => (
  <Sequence from={MDINNER2.from} durationInFrames={MDINNER2.durationInFrames} name="mdinner2 · MARIO / NOLE / NOPE">
    <Mdinner2 />
  </Sequence>
);
