// MR. MAS — cast: NELEH's RIGHT-SIDE OVER-THE-SHOULDER foreground (CAST-NELEH-OTS-R; Ep1 Act Four v5 art pass; new
// file, owned by the v5 art pass). Her own drawing from behind, for every OTS that looks past her (S3.00a and S3.04 at
// her desk, S4.04 onto the window, S4.09 onto the wall screen), so no shot has to mirror a whole frame with lettering
// in it (art-needs-v5 §1.8). Seen from behind and a little above: the back of her head, the shoulder-length straight
// mid-brown hair (the centre part is on the far side), the navy blazer's shoulders going out of frame right and down.
// She faces into the frame (camera-left), toward what she's looking at, so the key comes FROM the left: a 1 px rim on
// the edges that face the screen or the window. Drawn dark: a foreground shape, never the subject.
//   light 'screen'  the laptop / wall screen in front of her by day: a cool rim (C)
//         'lamp'    her desk lamp in the evening: a warm rim (W)
//         'window'  the dark boardroom window at night: a thin cold rim, the rest near black (S4.04)
//         'sil'     pure silhouette with the faintest rim (N)
//   turn  0 | 1: her head turns a pixel toward the screen (the lean in: "Is his feed frozen?")
// drawNelehShoulderR(b, rightX, bottomY, state, f): anchored at its BOTTOM-RIGHT corner (it runs off frame there).
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Adjust, renderFigure, blitImg} from '../figure';
import {memo} from './kit';

export const NELEH_OTS_W = 150;
export const NELEH_OTS_H = 206;
export type NelehOtsLight = 'screen' | 'lamp' | 'window' | 'sil';
export interface NelehOtsState { light: NelehOtsLight; turn: 0 | 1; }
export const NELEH_OTS_DEFAULT: NelehOtsState = {light: 'screen', turn: 0};

const fig = (s: NelehOtsState): FigureDef => {
  const t = s.turn ? -2 : 0; // the lean: head and hair a whole step toward the screen
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v : v + t)));
  const parts: Part[] = [
    // the blazer: her left shoulder slopes down to the frame's left side of the drawing; the right runs off frame
    {group: 'blazer', mat: 'blazer', tone: 2, prims: [P.poly(0, 206, 4, 176, 16, 156, 34, 142, 56, 132, 72, 128, 104, 128, 124, 132, 150, 140, 150, 206)]},
    // the collar at the back of the neck (the blazer's rolled edge)
    {group: 'collar', mat: 'blazer', tone: 3, prims: [P.poly(58, 132, 70, 124, 104, 124, 116, 132, 104, 134, 72, 134)]},
    // (no neck: her straight hair falls unbroken onto the collar from behind. A neck sliver between two falls read as
    // a dark doorway with a rim at 480 x 270, so the hair closes over it: fixed in the v5 art pass's still check)
    // the back of the head and the straight hair to the shoulders (ends turning in a pixel)
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      H(56, 44, 58, 28, 66, 16, 78, 10, 92, 10, 104, 16, 112, 28, 115, 44, 116, 70, 118, 96, 120, 118, 116, 130, 106, 133, 88, 135, 70, 133, 60, 130, 55, 118, 55, 96, 54, 70),
    ]},
  ];
  const adjust: Adjust[] = [
    // strands: a few darker falls down the back, and the crown's sheen where the screen light reaches over
    {prims: [H(70, 20, 72, 22, 66, 118, 64, 118), H(86, 12, 88, 12, 86, 104, 84, 104), H(100, 16, 102, 18, 108, 124, 106, 124)], tone: 1, onlyMat: 'hair'},
    {prims: [H(64, 20, 70, 14, 78, 12, 70, 18, 66, 26)], tone: 3, onlyMat: 'hair'},
    // the blazer's shoulder seam and the fold under the hair
    {prims: [P.line(20, 156, 50, 136), P.poly(60, 134, 116, 134, 112, 140, 64, 140)], tone: 1, onlyMat: 'blazer'},
  ];
  return {w: NELEH_OTS_W, h: NELEH_OTS_H, parts, adjust};
};
const RIM: Record<NelehOtsLight, {hair: number; blazer: number; skin: number}> = {
  screen: {hair: PAL.C4, blazer: PAL.C3, skin: PAL.K2},
  lamp: {hair: PAL.W5, blazer: PAL.W3, skin: PAL.S4},
  window: {hair: PAL.N5, blazer: PAL.N4, skin: PAL.N5},
  sil: {hair: PAL.N3, blazer: PAL.N3, skin: PAL.N3},
};
const rig = (l: NelehOtsLight): LightRig => ({
  key: [-1, -0.35], keyBand: 2, shadowBand: 0, rim: true, outline: false,
  ramps: {
    hair: [PAL.N0, PAL.B0, l === 'sil' || l === 'window' ? PAL.N1 : PAL.B1, l === 'sil' || l === 'window' ? PAL.N2 : PAL.B2, l === 'lamp' ? PAL.B4 : PAL.B3, RIM[l].hair],
    blazer: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, RIM[l].blazer],
    skin: [PAL.N0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, RIM[l].skin],
  },
});
export const nelehShoulderR = memo((s: NelehOtsState): Img => renderFigure(fig(s), rig(s.light)));
/** Draw her shoulder with its bottom-right corner at (rightX, bottomY) (frame coords; it may run past the frame). */
export const drawNelehShoulderR = (b: Buf, rightX: number, bottomY: number, s: NelehOtsState, _f = 0) => {
  const img = nelehShoulderR(s);
  blitImg(b, img, rightX - img.w, bottomY - img.h, {clip: (x, y) => y < 203});
};
