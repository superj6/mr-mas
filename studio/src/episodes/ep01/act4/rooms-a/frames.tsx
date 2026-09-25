// MR. MAS — Ep1 Act Four · rooms A: FrameDefs (ids ep01a4-rooms-*). Stills are one per plate (see plates.ts).
import type {FrameDef} from '../../../../shared/frame-def';
import {PLATES} from './plates';
import {RoomPlate, RoomsMotion} from './RoomsA';
import {MOTION} from './motion';

export const frames: FrameDef[] = [
  ...PLATES.map((p) => ({id: `ep01a4-rooms-${p.id}`, component: RoomPlate, props: {plate: p.id}})),
  {id: 'ep01a4-rooms-motion', component: RoomsMotion, durationInFrames: MOTION.frames, fps: 24},
];
