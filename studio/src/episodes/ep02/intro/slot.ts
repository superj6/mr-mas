// MR. MAS — Ep2 (`ep1.1_her.wav`): the intro's episode slot (show/episodes/ep02/intro-slot.md; SCRIPT.md §8 row 2;
// pipeline.md §8.2-8.3). Five spoiler-safe changes, nothing from this episode's plot (LEARNINGS W3, M1):
//   1. the cold-open line: "her" (the post, May 13, 2024), typed f18-21, six frames ahead of Jeremy's read (f24);
//      then the pulsing typing indicator holds the rest of the phrase's slot in silence, and the score's D-flat (f60)
//      lands in it. Post sends one token: <her>.
//   2. after Ep1: the `you are here` dot rests at 0.55, a step past the knee (SCRIPT §8.4); it still climbs and leaves
//      on the pluck (f86-90), in the silence. Misanthropic's price tag stays blank: `$4B + $2B` is NOT added, because
//      Ep1's final never aired those deals (the NOZAMA meter, 19.13, was cut, and S4.08's meters went in C14: the
//      v3.5 lock and transcript carry neither). The hill, the CZAR lanyard, the tally and the hook are not in the
//      shipped intro, so nothing is added there either. The Orb's toast stays `verified: human`.
//   3. the subtitle: `back by popular demand` (Ep1's return; 22 characters, +16 at 4 a frame)
//   4. the couch gag: Mas pockets ESC (he got out of Ep1's firing), hand-pixelled on the cap like Ep1's CTRL
//   5. the roll call: unchanged
import type {IntroSlot} from '../../../intro/slot';

export const EP2_SLOT: IntroSlot = {
  ep: 2,
  cold: {
    line: {
      l1: 'her', l2: '',
      keys1: [18, 19, 21], keys2: [], brk: null,
      tokens: [{t: 'her', line: 0}],
      // the read runs f23.4-38.3 (audio/ep02/intro/vo-qa.json, to -40 dB): the caret waits after "her" while he
      // says it, then the indicator takes the caret's place until he posts (the pointer is on Post by f111)
      indicator: [38, 111],
    },
    dot: 0.55,
  },
  keycap: {
    name: 'ESC',
    // E S C in Ep1's CTRL lettering (4 rows, 3 wide, 1 apart), on the same 14 x 4 face
    legend: ['.###..##..##..', '.##..#...#....', '.#.....#.#....', '.###.##...##..'],
  },
  subtitle: 'back by popular demand',
};
