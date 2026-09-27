// MR. MAS — kit: MACROSOFT's NOVELTY CHECK (Ep1 sc 9). New file (v3-art-a, 2026-09-27).
// Script draft 6 (9.01, C6: the insert folds into the lobby wide): the check is read IN THE WIDE, so it is drawn big (a
// novelty check the width of the revolving door and then some) and its words are legible at the wide's scale:
//   MACROSOFT (the display face) · "multiyear, multibillion dollar" (the company's own words, [V]) · the amount box:
//   $ MULTIBILLION (the facts section's ruling: no ~$10B anywhere; the company's word). The pen clipped at its edge
//   (Mas pockets it in the freeze). No logo: the parody name only, in slate and white.
//   drawCheck(b, x, y, st)       upright (jammed across the door's wings): st.pen, st.jam (the door's wings in front
//                                of it, 0 none | 1 one wing | 2 two), st.scuffed
//   drawCheckFloor(b, x, y, w, st)   lying flat on the floor as a doormat, foreshortened (its words are marks at this
//                                angle: it was read upright); st.scuffed (grey with footprints, weeks on)
//   CHECK                        its words and its size
import {Buf, rect, line, poly, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, bigText, bigTextWidth} from '../font';
import {pt, pw} from './uitype';

export const CHECK = {w: 206, h: 62, payer: 'MACROSOFT', memo: '"multiyear, multibillion dollar"', amount: '$ MULTIBILLION', payee: 'NOPEAI'};
export interface CheckState { pen?: boolean; scuffed?: boolean; /** a blank stub at the left end (the part caught in the door's wings), px */ stub?: number }
export const drawCheck = (b: Buf, x0: number, y: number, st: CheckState = {}) => {
  const stub = st.stub ?? 0;
  const {h} = CHECK, w = CHECK.w + stub;
  const x = x0;
  const paper = st.scuffed ? PAL.G5 : PAL.P2, paper2 = st.scuffed ? PAL.G4 : PAL.P1, band = st.scuffed ? PAL.G3 : PAL.N6, ink = PAL.N1;
  // its drop shadow, the paper, the slate header band, a guilloche border (whole-pixel wave), the corners
  rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(paper));
  for (let i = 2; i < w - 2; i++) { b.set(x + i, y + 2 + ((i >> 2) & 1), paper2); b.set(x + i, y + h - 3 - ((i >> 2) & 1), paper2); }
  for (let j = 2; j < h - 2; j++) { b.set(x + 2 + ((j >> 2) & 1), y + j, paper2); b.set(x + w - 3 - ((j >> 2) & 1), y + j, paper2); }
  rect(x, y, w, 1, b.ink(stepColor(paper, 1))); rect(x, y + h - 1, w, 1, b.ink(stepColor(paper, -2)));
  rect(x + 5 + stub, y + 5, w - 10 - stub, 17, b.ink(band));
  if (stub) { rect(x + stub, y + 3, 1, h - 6, b.ink(PAL.G5)); for (let j = y + 4; j < y + h - 4; j += 2) b.set(x + stub, j, paper); } // the stub's perforation
  bigText(b, CHECK.payer, x + 9 + stub, y + 7, st.scuffed ? PAL.G6 : PAL.P2);
  // PAY TO / the payee, the memo line (the company's own words), the amount box, the signature line
  pt(b, 'PAY TO', x + 9 + stub, y + 26, PAL.G4);
  pt(b, CHECK.payee, x + 9 + stub + pw('PAY TO') + 6, y + 26, ink);
  rect(x + 9 + stub + pw('PAY TO') + 4, y + 34, 60, 1, b.ink(PAL.G4));
  pt(b, CHECK.memo, x + 9 + stub, y + 40, ink);
  const bx = x + w - 104, by = y + 24;
  rect(bx, by, 96, 13, b.ink(PAL.G4)); rect(bx + 1, by + 1, 94, 11, b.ink(paper));
  pt(b, CHECK.amount, bx + 6, by + 3, ink);
  line(x + w - 70, y + h - 11, x + w - 14, y + h - 11, b.ink(PAL.G4));
  // the signature: a quick flourish (not legible: nobody's name)
  for (let i = 0; i < 44; i++) b.set(x + w - 66 + i, y + h - 13 - Math.round(Math.sin(i * 0.5) * 2 + (i > 30 ? (i - 30) * 0.2 : 0)), PAL.I0);
  if (st.pen) {
    // the pen clipped over the top edge at the right: a slate barrel, its clip over the paper, a chrome tip
    rect(x + w - 30, y - 7, 5, 22, b.ink(PAL.N5)); rect(x + w - 30, y - 7, 1, 22, b.ink(PAL.N7)); rect(x + w - 29, y - 9, 3, 2, b.ink(PAL.G5));
    rect(x + w - 26, y - 5, 1, 12, b.ink(PAL.G6)); b.set(x + w - 28, y + 15, PAL.G6);
  }
  if (st.scuffed) for (let k = 0; k < 7; k++) footprint(b, x + 14 + k * 27, y + 20 + ((k * 13) % 26), k);
};
/** a scuffed shoe print on the check (a sole's outline, a heel), grey */
const footprint = (b: Buf, x: number, y: number, k: number) => {
  const col = k % 2 ? PAL.G3 : PAL.N6;
  for (let j = 0; j < 12; j++) for (let i = 0; i < 6; i++) if ((j < 7 && Math.hypot((i - 2.5) / 3, (j - 3.5) / 4) < 1) || (j > 8 && Math.hypot((i - 2.5) / 2.5, (j - 10) / 2) < 1)) if (bayer(x + i, y + j) < 0.55) b.set(x + i, y + j, col);
};
/** the check lying flat as a floor, foreshortened into a strip (its header band and the amount box read as shapes) */
export const drawCheckFloor = (b: Buf, x: number, y: number, w: number, st: CheckState = {}) => {
  const h = 14;
  const paper = st.scuffed ? PAL.G5 : PAL.P1, band = st.scuffed ? PAL.G3 : PAL.N6;
  poly([x + 6, y, x + w - 6, y, x + w, y + h, x, y + h], b.ink(paper));
  line(x + 6, y, x + w - 6, y, b.ink(stepColor(paper, 1)));
  rect(x, y + h, w, 1, b.ink(PAL.N0));
  rect(x + 10, y + 2, Math.round(w * 0.5), 3, b.ink(band));
  rect(x + w - 70, y + 6, 56, 4, b.ink(PAL.G4)); rect(x + w - 69, y + 7, 54, 2, b.ink(paper));
  for (let i = 12; i < Math.round(w * 0.55); i += 3) b.set(x + i, y + 9, PAL.G4);
  if (st.scuffed) for (let k = 0; k < 9; k++) { const fx = x + 10 + k * Math.round((w - 20) / 9), fy = y + 3 + (k % 3) * 3; rect(fx, fy, 4, 2, b.ink(k % 2 ? PAL.G3 : PAL.N6)); b.set(fx + 1, fy + 3, PAL.G3); }
  void hash; void text; void bigTextWidth;
};
