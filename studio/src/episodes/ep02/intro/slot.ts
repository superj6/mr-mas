// MR. MAS — Ep2 (`ep1.1_her.wav`): the intro's episode slot (show/episodes/ep02/intro-slot.md; SCRIPT.md §8 row 2;
// pipeline.md §8.2-8.3, §8.6). Spoiler-safe changes, nothing from this episode's plot (LEARNINGS W3, M1):
//   1. the cold-open line: Ep1's, unchanged. Mas types "near the singularity; unclear which side." and Post pops its
//      words as in Ep1 (the showrunner, 2026-10-10: the typed quote stays the same in every episode). The first build's
//      "her" and its typing indicator are gone; the line is the default's, so the picture and the sound of f18-120 are
//      Ep1's (the dot's rest aside).
//   2. after Ep1: the `you are here` dot rests at 0.55, a step past the knee (SCRIPT §8.4); it still climbs and leaves
//      on the pluck (f86-90). Misanthropic's price tag stays blank: `$4B + $2B` is NOT added, because
//      Ep1's final never aired those deals (the NOZAMA meter, 19.13, was cut, and S4.08's meters went in C14: the
//      v3.5 lock and transcript carry neither). The hill, the CZAR lanyard, the tally and the hook are not in the
//      shipped intro, so nothing is added there either. The Orb's toast stays `verified: human`.
//   3. the subtitle: `back by popular demand` (Ep1's return; 22 characters, +16 at 4 a frame)
//   4. the couch gag: Mas pockets ESC (he got out of Ep1's firing), hand-pixelled on the cap like Ep1's CTRL
//   5. the roll call: unchanged
import {EP1_SLOT} from '../../../intro/slot';
import type {IntroSlot} from '../../../intro/slot';

export const EP2_SLOT: IntroSlot = {
  ep: 2,
  // the line is Ep1's (EP1_SLOT.cold.line, the same object): typed f18-83, Post f112, nine tokens, no indicator
  cold: {line: EP1_SLOT.cold.line, dot: 0.55},
  keycap: {
    name: 'ESC',
    // E S C in Ep1's CTRL lettering (4 rows, 3 wide, 1 apart), on the same 14 x 4 face
    legend: ['.###..##..##..', '.##..#...#....', '.#.....#.#....', '.###.##...##..'],
  },
  subtitle: 'back by popular demand',
};
