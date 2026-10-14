// Episode 3 slot. The typed quote is Ep1's in picture and sound.
import {EP1_SLOT} from '../../../intro/slot';
import type {IntroSlot} from '../../../intro/slot';
export const EP3_SLOT: IntroSlot = {
  ep: 3,
  cold: {line: EP1_SLOT.cold.line, dot: 0.60},
  keycap: {name: 'MUTE', legend: ['#.#.#.#.###.##','#.#.#.#..#..#.','###.#.#..#..#.','#.#.###..#..##']},
  subtitle: 'now with voice (paused)',
};
