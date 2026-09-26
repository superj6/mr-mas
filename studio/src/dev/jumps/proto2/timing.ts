// MR. MAS — style jump prototype 2 · J3 "THE SKY OPENS" (Ep9, Act Two #23). show/bible/style-jumps.md §5.2.
// The clip clock (fix pass; final polish). `p` is the prototype frame (24 fps, 96 BPM: 15 f a beat, 60 a bar). All
// three variants share it: the TEAR (C, ships), the SEAM (B) and the GLASS (A), the last two kept for the record.
//
//   p0-29      pixel [W]: the rack ticks, the monitor flickers                                     (beats 1-2)
//   p30-36     IN (beat 3): the sky breaks. TEAR: a torn line runs down through open sky at constant speed, from
//              behind the window head, behind the transom, to a stop in mid-air (tear.ts). SEAM: a straight seam to
//              behind the rooftops. GLASS: arms run out from one point, rings follow
//   p36        the Orb's iris steps to it (the witness, and the only one)
//   p37-44     a 1 px break holds; inside it there is already the far side
//   p45        it OPENS on beat 4, in held steps on 2s. The chip and the hum cut; the night air comes in at level
//   p60-89     THE HOLD (bar 2): the far side drifts, differentially; Mas reads on (p74: his eyes return, the feed
//              scrolls); TEAR: the Orb's rim takes the opening's light (SEAM / GLASS: the room cools)
//   p90-103    OUT: the seal, in held steps, faster than it came in
//   p104       the scar
//   p105-119   pixel; the hum and the rack tick come back in phase on p105
export const FPS = 24;
export const BEAT = 15;
export const N = 120;
export const T = {
  crack: 30,
  orb: 36,
  tipEnd: 38,
  open: 45,
  head: 60,
  seal: 90,
  scar: 104,
  back: 105,
} as const;

/** SEAM: the gap's native width at clip frame p (0 = pixel, 1 = the tear) */
export const seamWidth = (p: number): number => {
  if (p < T.crack) return 0;
  if (p < T.open) return 1;
  // it parts: held steps on 2s
  if (p < T.open + 2) return 2;
  if (p < T.open + 4) return 4;
  if (p < T.open + 6) return 7;
  if (p < T.head + 8) return 10;
  // the hold: one more whole pixel, once (the pixel side only ever moves in whole pixels). 11 is the widest the
  // tower under it can hide (its roof is 12 px): the seam's lower end must never show
  if (p < T.seal) return 11;
  // the seal, faster than it came in
  if (p < T.seal + 4) return 7;
  if (p < T.seal + 8) return 3;
  if (p < T.scar) return 1;
  return 0;
};
/** kept for the older tools */
export const gapWidth = seamWidth;

/** GLASS: how many rings of shards are open at clip frame p (-1 = none; 0 = the centre; ...) */
export const glassOpen = (p: number): number => {
  if (p < T.open || p >= T.scar) return -1;
  if (p < T.open + 2) return 0;
  if (p < T.open + 4) return 1;
  if (p < T.seal) return 2;
  if (p < T.seal + 4) return 1;
  if (p < T.seal + 8) return 0;
  return -1;
};

/** true while the picture is off the grid (the chip and the room are silent) */
export const inJump = (p: number) => p >= T.open && p < T.back;
