// MR. MAS — the intro's episode slot: the five things that change per episode (show/intro/SCRIPT.md §8, spoiler-safe),
// gathered from the moments that draw them. Every moment takes its piece with Ep1's value as the default, so Ep1's
// intro (intro-ep1) draws exactly as it did before the slot existed; another episode builds its own IntroSlot and cuts
// its intro with scenes.ts scenesFor(slot) (Ep2: studio/src/episodes/ep02/intro/).
//   1. the cold-open line (mcoldopen: the typed text, its keys, the Post tokens, an optional typing indicator)
//   2. the world state after the fact: of the rows SCRIPT §8 lists, the shipped intro draws only the `you are here`
//      dot (mcoldopen), Misanthropic's price tag (mfinale/skyline.ts, blank) and the Orb's toast (mfinale/bookend.ts,
//      `verified: human`); the hill, the CZAR lanyard, the desk tally and the coat hook are not built (pipeline.md
//      §8.1). Only the dot is a slot here: the tag and the toast don't change before Ep3, so they stay as drawn.
//   3. the title subtitle (mfinale/title.ts)
//   4. the couch gag: the pocketed keycap's legend (mdinner1/props.ts)
//   5. the roll call: no change before Ep3 (mrollcall)
import {EP1_COLD} from '../dev/mcoldopen/timeline';
import type {ColdSlot} from '../dev/mcoldopen/timeline';
import {LEGEND} from '../dev/mdinner1/props';
import {SUB} from '../dev/mfinale/title';

export interface IntroSlot {
  ep: number;
  /** items 1-2: the cold open's line and the dot's rest */
  cold: ColdSlot;
  /** item 4: the keycap Mas pockets at Gerg's card, hand-pixelled on the cap (4 rows x 14) */
  keycap: {name: string; legend: string[]};
  /** item 3: last week's release note, typed under the title at 4 characters a frame (34 or fewer) */
  subtitle: string;
}

export const EP1_SLOT: IntroSlot = {ep: 1, cold: EP1_COLD, keycap: {name: 'CTRL', legend: LEGEND}, subtitle: SUB};
