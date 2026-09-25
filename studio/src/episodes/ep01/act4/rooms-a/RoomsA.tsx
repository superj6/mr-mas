// MR. MAS — Ep1 Act Four · rooms A: Remotion compositions for the room plates and a short motion test.
import React from 'react';
import {PixelScene} from '../../../../shared/pixel/PixelScene';
import {PLATES} from './plates';
import {MOTION} from './motion';

/** One plate as a still (props.plate = plate id; the plate's own frame unless `frame` is given). */
export const RoomPlate: React.FC<{plate: string; frame?: number}> = ({plate, frame}) => {
  const p = PLATES.find((q) => q.id === plate)!;
  return <PixelScene draw={(fb, f) => p.draw(fb, f)} hold={frame ?? p.frame ?? 0} />;
};

/** The motion test: the rooms' own animation (truck + shiver, fires + wheel, the sign lighting up). */
export const RoomsMotion: React.FC = () => <PixelScene draw={(fb, f) => MOTION.draw(fb, f)} />;
