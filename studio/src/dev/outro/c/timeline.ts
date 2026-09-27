// MR. MAS — outro C: the timeline. 96 BPM = 15 frames a beat, 60 a bar; the outro is 192 frames, o0..o191 (8.0 s:
// 3 bars and the chord's ring-out). The mock-up runs PRE (24 frames, 1.0 s) of a stand-in "last frame" first (the
// cold open's dark-room MEDIUM, mcoldopen/medium.ts drawMedium at f56: Ep1's button isn't built), then cuts on the
// downbeat to the lobby. The file is 216 frames, 9.0 s.
//
// Fourth pass, after the cold read of the 8.5 s file:
//   - "the most text-heavy element gets the least time": the board is three big lines now (text.ts), and the quiet
//     before the hand is 3.5 s (o0-o83, was 2.5 s): the sign and the board have the frame to themselves
//   - "0 to 36 in one swap is confusing ... the one moment I paused": the outro opens on LAST NIGHT'S count (35)
//     and the hand does what a DAYS SINCE sign's keeper does every night: it lifts yesterday's units plate off and
//     tonight's is there behind it (a tear-off calendar): 35 -> 36. One action, not three (0 off, 3 on, 6 on)
//   - "add a short dip to black after the moth lands so the picture ends when the sound does": the after-hours timer
//     now has two steps (the house light at 3.1, then the sign itself at 3.3, when the building is closed); the moth,
//     losing its light, goes to the one light left, the terms line; then the whole frame dips to black in four
//     held Bayer steps as the sound reaches zero
//   - the raised E in CREATED ("it just looks like a typo") is gone: no letter is ever out of line in Ep1
//
//   1.1  o0-83     the wall, after hours: the lit sign at 35, the directory, the spare box; only the LEDs move
//   2.2+ o84       the maintenance hand comes down (from above: from below it would cover the credits)
//   2.3  o90       its fingers reach the units plate (the knee's G); o93 it grips
//        o101      the 5 lifts off its hooks (tick)
//   2.4  o105      it's clear of the slot: 36 (the knee's C)
//        o112      over the box, it lets go (the knee's last F); o116 the 5 lands among the spare zeros (thup)
//   3.1  o120      the hand is gone: the after-hours timer's first step, the house light down one level; the
//                  contactor's kick gives the sign its one held-step flicker (o121-122: 3 -> 2 -> 3)
//   3.1-3.3        the moth comes in from frame-right to the lit box, bumps its top twice (o130, o135), circles
//   3.3  o150      the timer's second step: the sign's half step, then OFF (o151); the hum stops; the board's
//                  letters go dim with the room; the rack's LEDs and the rose window's cyan are all that's left
//   3.3-3.4        the moth drops to the one light left and lands beside the terms line's final period (o165)
//        o184-191  the dip: 25 / 50 / 75 / 100 % black, two frames a step; the sound is at zero by o190
import {Buf} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {bayer} from '../../../shared/pixel/px';
import {drawMedium} from '../../mcoldopen/medium';
import {drawSet, drawSignWords, drawPlate, drawPlateHalf, drawBoardText, slotXY, SetState, Lit} from './set';
import {drawHand, HandPose} from './cast';
import {drawMoth, MOTH_IN, MOTH_LAND} from './moth';
import {drawBand} from './band';
import {EP1, EP4, EP10, EpisodeOutro} from './text';

export const PRE = 24, OUT = 192, TOTAL = PRE + OUT;
/** the beats that matter (outro frames) */
export const EV = {
  handIn: 84, reach: 90, grip: 93, liftOff: 101, clear: 105, release: 112, inBox: 116, gone: 118,
  lightsDown: 120, flicker: [121, 122], signHalf: 150, signOff: 151,
  mothIn: MOTH_IN, mothLand: MOTH_LAND, dip: [184, 186, 188, 190], out: OUT - 1,
};
export const STANDIN_F = 56;
/** outro frame -> bar.beat label */
export const bb = (o: number) => `${Math.floor(o / 60) + 1}.${Math.floor((o % 60) / 15) + 1}`;

// ------------------------------------------------------------------ the hand's track (held drawings, whole px)
interface HandKey { pose: HandPose; at: [number, number]; plate?: string; }
const S2 = slotXY(2);
const BOX_DROP: [number, number] = [440, 173]; // where the dropped plate comes to rest in the box (set.ts paintBox: x + 22)
/** gripping plate d at (x, y) / hovering open over the plate position (x, y) */
const held = (d: string, x: number, y: number): HandKey => ({pose: 'grip', at: [x, y], plate: d});
const open = (x: number, y: number): HandKey => ({pose: 'open', at: [x, y]});
const HY = S2[1]; // the hooks' plate row
/** [from o, key]: each key holds until the next. `d` = yesterday's units plate. */
const handTrack = (d: string): Array<[number, HandKey | null]> => [
  [84, open(S2[0], HY - 30)], [86, open(S2[0], HY - 16)], [88, open(S2[0], HY - 6)],
  [90, open(S2[0], HY - 2)],                                   // 2.3, the knee's G: the fingers reach the plate
  [93, held(d, S2[0], HY)],                                    // grips it
  [101, held(d, S2[0], HY - 4)],                               // off its hooks
  [103, held(d, S2[0] + 8, HY - 11)],
  [105, held(d, S2[0] + 20, HY - 16)],                         // 2.4, the knee's C: clear of the slot
  [107, held(d, 344, HY - 15)], [109, held(d, 400, HY - 12)], [111, held(d, BOX_DROP[0], HY - 10)],
  [112, open(BOX_DROP[0], HY - 12)],                           // lets go over the box (the knee's last F)
  [114, open(BOX_DROP[0], HY - 22)], [116, open(BOX_DROP[0], HY - 40)], [118, null],
];
const HAND = handTrack(EP1.from.slice(-1));
const handAt = (o: number): HandKey | null => {
  let k: HandKey | null = null;
  for (const [t, v] of HAND) if (o >= t) k = v;
  return o < HAND[0][0] ? null : k;
};
/** the dropped plate in the air: o112..o115 (gravity, whole px), in the box from o116 */
const FALL_Y0 = HY - 10;
const fallAt = (o: number): [number, number] | null =>
  (o >= EV.release && o < EV.inBox ? [BOX_DROP[0], Math.round(FALL_Y0 + (BOX_DROP[1] - FALL_Y0) * ((o - EV.release) / (EV.inBox - EV.release)) ** 2)] : null);

// ------------------------------------------------------------------ one frame
export interface OutroState {
  set: SetState;
  slots: Array<string | null>;
  /** slot index drawn mid-turn (Ep10) */
  flip?: number;
  hand: HandKey | null;
  fall: [number, number] | null;
  /** the digit of the falling / dropped plate */
  fallDigit?: string;
  /** the outro frame whose moth to draw (moth.ts), or null */
  moth: number | null;
  ep: EpisodeOutro;
  /** the board letters' ink (they dim with the room when the sign goes out) */
  ink?: number;
  /** per-letter offsets on the board (null = not arrived) */
  off?: (row: number, i: number) => [number, number, number?] | null;
  /** the end dip: 0..4 quarters of the frame gone to black */
  dip?: number;
}

const signAt = (o: number): Lit => (o >= EV.signOff ? 0 : o === EV.signHalf || EV.flicker.includes(o) ? 2 : 3);
const dipAt = (o: number) => EV.dip.filter((t) => o >= t).length;

export const ep1State = (o: number): OutroState => {
  const ep = EP1, yday = ep.from.slice(-1), tonight = ep.count.slice(-1);
  return {
    set: {f: o, house: o >= EV.lightsDown ? -1 : 0, sign: signAt(o), dropped: o >= EV.inBox ? yday : null},
    // the tens plate stays; tonight's units plate hangs behind yesterday's (hidden until the hand lifts it away)
    slots: [null, ep.count.slice(0, 1), o < EV.grip ? yday : tonight],
    hand: handAt(o),
    fall: fallAt(o),
    fallDigit: yday,
    moth: o >= MOTH_IN ? o : null,
    ep,
    ink: o >= EV.signOff + 1 ? PAL.G2 : o === EV.signOff ? PAL.G4 : PAL.P1,
    dip: dipAt(o),
  };
};

export const renderOutro = (fb: Buf, st: OutroState) => {
  drawSet(fb, st.set);
  const lit = st.set.sign as Lit;
  drawSignWords(fb, lit);
  st.slots.forEach((d, i) => {
    const [x, y] = slotXY(i);
    if (st.flip === i) drawPlateHalf(fb, x, y, d ?? '?', lit);
    else if (d) drawPlate(fb, x, y, d, lit);
  });
  drawBoardText(fb, st.ep, {off: st.off, ink: st.ink});
  if (st.fall) drawPlate(fb, st.fall[0], st.fall[1], st.fallDigit ?? '0', 2);
  if (st.hand) {
    if (st.hand.plate) drawPlate(fb, st.hand.at[0], st.hand.at[1], st.hand.plate, lit);
    drawHand(fb, st.hand.pose, st.hand.at[0], st.hand.at[1]);
  }
  drawBand(fb);
  if (st.moth !== null) drawMoth(fb, st.moth);
  const q = st.dip ?? 0;
  if (q > 0) for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < q / 4) fb.set(x, y, PAL.N0);
};

/** The Ep1 mock-up, composition frame f (0..TOTAL-1). */
export const drawEp1 = (fb: Buf, f: number) => {
  if (f < PRE) { drawMedium(fb, STANDIN_F); return; }
  renderOutro(fb, ep1State(f - PRE));
};

// ------------------------------------------------------------------ the variant stills (the capability ladder)
/** Ep1's panel for the variants sheet: o105, the 5 just clear of the slot (36), the house light still on */
export const EP1_STILL_O = EV.clear;
/** Ep4, the reset week: the old count's plates emptied into the box (backs up), the count restarted: 78 -> 79, the
 *  same moment as Ep1's panel (the hand just clear with yesterday's plate). */
export const ep4State = (): OutroState => ({
  set: {f: 150, house: 0, sign: 3, boxBacks: 4},
  slots: [null, '7', '9'],
  hand: held('8', S2[0] + 20, HY - 16),
  fall: null, moth: null, ep: EP4,
});
/** Ep10: the calendar has lost its grip (??); no hand: the second ? is caught half-turned on its hooks (it turns by
 *  itself), and the egg row's letters slide into their grooves on their own. */
export const ep10State = (): OutroState => {
  const egg = EP10.egg, at = egg.indexOf('CORNER OFFICE');
  return {
    set: {f: 150, house: 0, sign: 3},
    slots: [null, '?', '?'], flip: 2,
    hand: null, fall: null, moth: null, ep: EP10,
    // the egg row's value arrives letter by letter along its groove, from the right, in reading order: CORNER and
    // the O of OFFICE are set; FFICE is still sliding in (dim, spaced out behind its place). Everything else
    // machine-straight.
    off: (row, i) => {
      if (row !== 4 || i < at) return [0, 0];
      const k = i - at;
      return k <= 7 ? [0, 0] : [(k - 7) * 5, 0, 1];
    },
  };
};
export const STILLS = [
  {id: 'ep1', state: () => ep1State(EP1_STILL_O)},
  {id: 'ep4', state: ep4State},
  {id: 'ep10', state: ep10State},
];
export const drawStill = (fb: Buf, k: number) => renderOutro(fb, STILLS[Math.max(0, Math.min(STILLS.length - 1, k))].state());
