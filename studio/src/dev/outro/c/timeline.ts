// MR. MAS — outro C: the timeline. 96 BPM = 15 frames a beat, 60 a bar; the outro is 3 bars, o0..o179 (7.5 s).
// (Second pass, after the cold read: "end it when the 36 lands". The old bar 3, a 3.4 s hold where only the moth
// moved, is gone; the lights step down the moment the hand has gone, and the moth lands inside the chord's ring.)
// The mock-up runs PRE (24 frames, 1.0 s) of a stand-in "last frame" first (the cold open's dark-room MEDIUM,
// mcoldopen/medium.ts drawMedium at f56: Ep1's button isn't built), then cuts on the downbeat to the lobby.
//
//   1.1  o0-59     the wall, after hours: the lit sign still at 0, the directory, the spare box; only the LEDs move
//   2.1  o60       the maintenance hand comes down into frame        2.2  o75  the 0 drops into the box (clack)
//   2.3  o90       it hangs 3                                         2.4  o105 it hangs 6: 36; o110-119 it withdraws
//   3.1  o120      the hand is gone: the after-hours timer steps the house light down one level (sign and LEDs stay
//                  lit), and the contactor's kick gives the sign its one held-step flicker (o121-122: 3 -> 2 -> 3)
//   3.1-3.3        the moth comes in from frame-right to the one light left, bumps the box's top twice (o130, o135),
//                  drops down the wall and lands beside the terms line's final period at o150 (3.3), folded by o158
//   3.4  o179      out (the chord and the hum fade from o168)
import {Buf} from '../../../shared/pixel/px';
import {drawMedium} from '../../mcoldopen/medium';
import {drawSet, drawSignWords, drawPlate, drawPlateHalf, drawBoardText, slotXY, SetState} from './set';
import {drawHand, HandPose} from './cast';
import {drawMoth, MOTH_IN, MOTH_LAND} from './moth';
import {drawBand} from './band';
import {EP1, EP4, EP10, EpisodeOutro} from './text';

export const PRE = 24, OUT = 180, TOTAL = PRE + OUT;
/** the beats that matter (outro frames) */
export const EV = {hand: 60, drop: 75, three: 90, six: 105, gone: 120, lightsDown: 120, flicker: [121, 122], mothIn: MOTH_IN, mothLand: MOTH_LAND, fade: 168, out: OUT - 1};
export const STANDIN_F = 56;
/** outro frame -> bar.beat label */
export const bb = (o: number) => `${Math.floor(o / 60) + 1}.${Math.floor((o % 60) / 15) + 1}`;

// ------------------------------------------------------------------ the hand's track (held drawings, whole px)
interface HandKey { pose: HandPose; at: [number, number]; plate?: string; }
const S0 = slotXY(0), S1 = slotXY(1), S2 = slotXY(2);
const BOX_DROP: [number, number] = [440, 173]; // where the dropped plate comes to rest in the box (set.ts paintBox: x + 22)
/** gripping plate d at (x, y) / hovering open over the plate position (x, y) */
const held = (d: string, x: number, y: number): HandKey => ({pose: 'grip', at: [x, y], plate: d});
const open = (x: number, y: number): HandKey => ({pose: 'open', at: [x, y]});
const HY = S2[1]; // the hooks' plate row
/** [from o, key]: each key holds until the next */
const HAND: Array<[number, HandKey | null]> = [
  [60, open(S2[0], HY - 26)], [62, open(S2[0], HY - 10)], [63, open(S2[0], HY - 2)],
  [64, held('0', S2[0], HY)], [66, held('0', S2[0], HY - 4)], // off the hooks
  [68, held('0', 344, HY - 8)], [70, held('0', BOX_DROP[0], HY - 10)],
  [71, open(BOX_DROP[0], HY - 12)], [73, open(BOX_DROP[0], HY - 22)], [75, open(BOX_DROP[0], HY - 40)], [77, null],
  [80, held('3', S1[0], HY - 36)], [82, held('3', S1[0], HY - 18)], [84, held('3', S1[0], HY - 6)], [87, held('3', S1[0], HY - 3)],
  [90, held('3', S1[0], HY)], // hung
  [92, open(S1[0], HY - 2)], [94, open(S1[0], HY - 16)], [96, open(S1[0], HY - 34)], [97, null],
  [98, held('6', S2[0], HY - 30)], [100, held('6', S2[0], HY - 14)], [102, held('6', S2[0], HY - 4)],
  [105, held('6', S2[0], HY)], // hung
  [110, open(S2[0], HY - 2)], [118, open(S2[0], HY - 18)], [120, null],
];
const handAt = (o: number): HandKey | null => {
  let k: HandKey | null = null;
  for (const [t, v] of HAND) if (o >= t) k = v;
  return o < 60 ? null : k;
};
/** the dropped 0 in the air: o71..o74 (gravity, whole px), in the box from o75 */
const FALL_Y0 = HY - 10;
const fallAt = (o: number): [number, number] | null => (o >= 71 && o <= 74 ? [BOX_DROP[0], Math.round(FALL_Y0 + (BOX_DROP[1] - FALL_Y0) * ((o - 71) / 4) ** 2)] : null);

// ------------------------------------------------------------------ one frame
export interface OutroState {
  set: SetState;
  slots: Array<string | null>;
  /** slot index drawn mid-flip (Ep10) */
  flip?: number;
  hand: HandKey | null;
  fall: [number, number] | null;
  /** the outro frame whose moth to draw (moth.ts), or null */
  moth: number | null;
  ep: EpisodeOutro;
  /** per-letter offsets on the board (null = not arrived) */
  off?: (row: number, i: number) => [number, number, number?] | null;
  leaders?: (row: number) => number;
}

/** Ep1's pushed-in letters: one sits a pixel high (the 2nd E of CREATED, board row 3); they get straighter each week */
const ep1Off = (row: number, i: number): [number, number] => (row === 3 && i === 5 ? [0, -1] : [0, 0]);

export const ep1State = (o: number): OutroState => ({
  set: {f: o, house: o >= EV.lightsDown ? -1 : 0, sign: EV.flicker.includes(o) ? 2 : 3, boxPlates: o >= 75 ? 5 : 4},
  slots: [null, o >= 90 ? '3' : null, o < 64 ? '0' : o >= 105 ? '6' : null],
  hand: handAt(o),
  fall: fallAt(o),
  moth: o >= MOTH_IN ? o : null,
  ep: EP1,
  off: ep1Off,
});

export const renderOutro = (fb: Buf, st: OutroState) => {
  drawSet(fb, st.set);
  drawSignWords(fb, st.set.sign);
  st.slots.forEach((d, i) => {
    const [x, y] = slotXY(i);
    if (st.flip === i) drawPlateHalf(fb, x, y, d ?? '?', st.set.sign === 3);
    else if (d) drawPlate(fb, x, y, d, st.set.sign === 3);
  });
  drawBoardText(fb, st.ep.rows, {off: st.off, leaders: st.leaders});
  if (st.fall) drawPlate(fb, st.fall[0], st.fall[1], '0', true, 0xcfc6a8);
  if (st.hand) {
    if (st.hand.plate) drawPlate(fb, st.hand.at[0], st.hand.at[1], st.hand.plate, true);
    drawHand(fb, st.hand.pose, st.hand.at[0], st.hand.at[1]);
  }
  drawBand(fb);
  if (st.moth !== null) drawMoth(fb, st.moth);
};

/** The Ep1 mock-up, composition frame f (0..TOTAL-1). */
export const drawEp1 = (fb: Buf, f: number) => {
  if (f < PRE) { drawMedium(fb, STANDIN_F); return; }
  renderOutro(fb, ep1State(f - PRE));
};

// ------------------------------------------------------------------ the variant stills (the capability ladder)
/** Ep4, the reset week: the old count's plates emptied into the box (backs up), the count restarted: 79. */
export const ep4State = (): OutroState => ({
  set: {f: 150, house: 0, sign: 3, boxPlates: 5, boxBacks: 4},
  slots: [null, '7', '9'],
  hand: {pose: 'open', at: [S2[0], S2[1] - 2]},
  fall: null, moth: null, ep: EP4,
  off: (row, i) => (row === 4 && i === 2 ? [0, 1] : [0, 0]), // still pushed in by hand: one letter a pixel low (WRITTEN's I)
});
/** Ep10: the calendar has lost its grip (??); no hand: the second ? is caught half-turned on its hooks (it turns by
 *  itself), the letters slide into their grooves. */
export const ep10State = (): OutroState => {
  const INTERN_ROW = 8, lab = 'THE INTERN'.length;
  return {
    set: {f: 150, house: 0, sign: 3, boxPlates: 5},
    slots: [null, '?', '?'], flip: 2,
    hand: null, fall: null, moth: null, ep: EP10,
    // the INTERN row's value arrives letter by letter along its groove, from the right, in reading order: CORNER and
    // the O of OFFICE are set; FFICE is still sliding in (dim, spaced out behind its place); the leaders not laid
    // yet. Everything else machine-straight.
    off: (row, i) => {
      if (row !== INTERN_ROW || i < lab) return [0, 0];
      const k = i - lab; // index in 'CORNER OFFICE'
      return k <= 7 ? [0, 0] : [(k - 7) * 5, 0, 1];
    },
    leaders: (row) => (row === INTERN_ROW ? 0 : 1),
  };
};
/** Ep1's panel for the variants sheet: o112, the 36 just hung and the hand letting go, the house light still on
 *  (the same moment as the Ep4 panel, so the three panels compare like for like) */
export const EP1_STILL_O = 112;
export const STILLS = [
  {id: 'ep1', state: () => ep1State(EP1_STILL_O)},
  {id: 'ep4', state: ep4State},
  {id: 'ep10', state: ep10State},
];
export const drawStill = (fb: Buf, k: number) => renderOutro(fb, STILLS[Math.max(0, Math.min(STILLS.length - 1, k))].state());
void S0;
