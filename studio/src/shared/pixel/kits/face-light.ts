// MR. MAS — kit: FACE LIGHTS and a lamp's warm rungs (mood-analysis §4 #4: "a key or rim one or two ramp steps up, on
// the face only, so each expression reads at a glance"; §4 #10: launch night warmed by its practicals). New file
// (v3-art-a, v3.1 round, 2026-09-27). Buffer-level and generic: any shot pass can call them on any drawing after it's
// placed (the Act Four and Act Three close-ups the mood analysis lists too). Whole palette rungs, never a blend; only
// skin pixels (the S, K and X families) change, so nothing else in the frame moves.
//   faceKey(b, x0, y0, x1, y1, k, side)   skin in the rect k rungs up (the key), the edge toward `side` one more (the rim)
//   warmRim(b, x0, y0, x1, y1, side, w)   a lamp at one side: skin within w px of the face's edge on that side walks to
//                                         the lamp's warm rungs (the cool-lit drawings: monitor light, the orb)
//   toWarmLamp(c)                         the map itself (cool rungs → warm: K → S, X → S, C → W), for a blit's `map`
import {Buf} from '../px';
import {PAL, stepColor, familyOf} from '../palette';

const RH = 203;
/** a figure's cool (monitor / orb) rungs walked to the desk lamp's warm ones: skin under cyan → skin, the mauve mids →
 *  skin, the cyan rim → tungsten. For sprites that only have cool light states (Mas's desk sprite) */
const WARM_MAP: Record<number, number> = {
  [PAL.K0]: PAL.S1, [PAL.K1]: PAL.S2, [PAL.K2]: PAL.S3, [PAL.K3]: PAL.S4, [PAL.K4]: PAL.S5, [PAL.K5]: PAL.S6,
  [PAL.X0]: PAL.S1, [PAL.X1]: PAL.S2, [PAL.X2]: PAL.S3, [PAL.X3]: PAL.S4,
  [PAL.C1]: PAL.W1, [PAL.C2]: PAL.W2, [PAL.C3]: PAL.W3, [PAL.C4]: PAL.W4, [PAL.C5]: PAL.W5, [PAL.C6]: PAL.W6, [PAL.C7]: PAL.W7, [PAL.C8]: PAL.W8,
};
export const toWarmLamp = (c: number) => WARM_MAP[c] ?? c;
/** a face light (mood §4 #4): skin pixels in the rect step up `k` rungs (the key, face only), and the ones on the lit
 *  side's edge (skin next to non-skin, toward `side`) one more (the rim). Nothing else in the frame changes. */
export const faceKey = (b: Buf, x0: number, y0: number, x1: number, y1: number, k = 1, side: -1 | 1 = -1) => {
  const skin = (c: number) => { const fm = familyOf(c); return !!fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X'); };
  const out: Array<[number, number, number]> = [];
  for (let y = Math.max(0, y0); y < Math.min(RH, y1); y++) for (let x = Math.max(0, x0); x < Math.min(b.w, x1); x++) {
    const c = b.get(x, y);
    if (!skin(c)) continue;
    const rim = !skin(b.get(x + side, y));
    out.push([x, y, stepColor(c, k + (rim ? 1 : 0))]);
  }
  for (const [x, y, c] of out) b.set(x, y, c);
};
/** a warm rim (a lamp at one side): skin pixels within `w` px of the face's edge on `side` walk to the lamp's rungs */
export const warmRim = (b: Buf, x0: number, y0: number, x1: number, y1: number, side: -1 | 1, w = 2) => {
  const skin = (c: number) => { const fm = familyOf(c); return !!fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X'); };
  const out: Array<[number, number, number]> = [];
  for (let y = Math.max(0, y0); y < Math.min(RH, y1); y++) for (let x = Math.max(0, x0); x < Math.min(b.w, x1); x++) {
    const c = b.get(x, y);
    if (!skin(c)) continue;
    let d = 0; while (d < w && skin(b.get(x + side * (d + 1), y))) d++;
    if (d < w) out.push([x, y, stepColor(toWarmLamp(c), d === 0 ? 1 : 0)]);
  }
  for (const [x, y, c] of out) b.set(x, y, c);
};
