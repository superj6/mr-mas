// MR. MAS — mdinner2: intro frames 345-479 in the pixel look. THE WOODROSE continued from mdinner1:
// MARIO out of the vault + his card (one beat of printed world, then the room runs under the card), the essay
// and Mas's telescope, the SPACEZ booster through the ceiling, NOLE's card + SUED OVER IT. (two beats of print),
// the LEDGER check in the running room, and the founding in full colour: Mas slides the N, OPEN AI -> NOPE AI.
// Composition frames are LOCAL (0 = global 345); stills below are named by their GLOBAL frame.
import type {FrameDef} from '../shared/frame-def';
import {Mdinner2} from '../dev/mdinner2/Mdinner2';
import {MD2_FROM, MD2_DURATION} from '../dev/mdinner2/timeline';

const still = (id: string, global: number): FrameDef => ({id, component: Mdinner2, props: {hold: global - MD2_FROM}});

export const frames: FrameDef[] = [
  {id: 'mdinner2', component: Mdinner2, durationInFrames: MD2_DURATION, fps: 24},
  still('mdinner2-mario', 378),
  still('mdinner2-telescope', 398),
  still('mdinner2-booster', 416),
  still('mdinner2-nole', 446),
  still('mdinner2-nole-ledger', 451),
  still('mdinner2-nope', 479),
];
