// MR. MAS — Ep2 v1 art: the character-sheet still (a neutral plate, busts and room sprites side by side, each labelled
// in small type under it). Used only by the asset stills (the review), never in a shot.
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import type {Img} from '../../../../../shared/pixel/figure';
import {blitImg} from '../../../../../shared/pixel/figure';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {vramp, fill, tiny, tinyWidth, RH} from '../kit';

/** the sheet's plate: a stepped wall, a floor line at y 188 */
export const sheetPlate = (b: Buf, wall = [PAL.N1, PAL.N2, PAL.N3, PAL.N3], floor = PAL.N1) => {
  vramp(b, 0, 0, 480, 188, wall);
  fill(b, 0, 188, 480, RH - 188, floor);
  fill(b, 0, 188, 480, 1, PAL.N4);
};
export const label = (b: Buf, s: string, cx: number, y: number, col = PAL.N7) => tiny(b, s, Math.round(cx - tinyWidth(s) / 2), y, col);
/** a bust at (x, y), cut at the floor line, with its label */
export const sheetBust = (b: Buf, img: Img, x: number, y: number, lab: string, cut = 188, flip = false) => {
  putBustCut(b, img, x, y, cut, flip);
  label(b, lab, x + img.w / 2, cut + 4);
};
/** a room sprite drawn by `draw(footX, footY)`, labelled under the floor line */
export const sheetRoom = (b: Buf, footX: number, lab: string, draw: (x: number, y: number) => void, footY = 186) => {
  draw(footX, footY);
  label(b, lab, footX, 192);
};
export const sheetImg = (b: Buf, img: Img, x: number, y: number, lab: string, flip = false) => {
  blitImg(b, img, x, y, {flip});
  label(b, lab, x + img.w / 2, Math.min(RH - 7, y + img.h + 2));
};
