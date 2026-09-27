// MR. MAS — outro C: THE BAND (rows 203..269), non-diegetic UI. It carries the terms line and the pointer for the
// whole outro (o0..o239): up on the cut, never animated, never covered, never part of a joke, never on a NopeAI
// surface (OUTRO-PROPOSALS §1.1 rules 1-4). 7-px face, paper at the 80 % white ceiling (P1) on black.
// The moth's perch is BESIDE the words: it stands on the final period, in the rows above it, never on a letter.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import {TERMS, POINTER, SLUG} from './text';

export const BAND_Y = 203;
export const TERMS_Y = 216, POINTER_Y = 232;
export const TERMS_X = Math.floor((480 - textWidth(TERMS)) / 2);
export const POINTER_X = Math.floor((480 - textWidth(POINTER)) / 2);
/** the final period's pixel (the moth's perch) */
export const PERIOD: [number, number] = [TERMS_X + textWidth(TERMS) - 1, TERMS_Y + 6];

export const drawBand = (b: Buf, o: {slug?: boolean} = {}) => {
  rect(0, BAND_Y, 480, 270 - BAND_Y, b.ink(PAL.N0));
  rect(0, BAND_Y, 480, 1, b.ink(PAL.N3));
  text(b, TERMS, TERMS_X, TERMS_Y, PAL.P1);
  text(b, POINTER, POINTER_X, POINTER_Y, PAL.P1);
  if (o.slug ?? true) {
    // lookdev only: a dashed chip, bottom-right, in the animatic's placeholder rose
    const w = textWidth(SLUG) + 10, h = 13, x = 480 - 8 - w, y = 270 - 6 - h;
    for (let i = 0; i < w; i++) if ((i >> 1) % 2 === 0) { b.set(x + i, y, PAL.U4); b.set(x + i, y + h - 1, PAL.U4); }
    for (let j = 0; j < h; j++) if ((j >> 1) % 2 === 0) { b.set(x, y + j, PAL.U4); b.set(x + w - 1, y + j, PAL.U4); }
    text(b, SLUG, x + 5, y + 3, PAL.U5);
  }
};

/** Every pixel of the band's two lines (for the "never covered" check). */
export const bandGlyphPixels = (): Set<number> => {
  const probe = new Buf(480, 270, 0);
  text(probe, TERMS, TERMS_X, TERMS_Y, 1);
  text(probe, POINTER, POINTER_X, POINTER_Y, 1);
  const s = new Set<number>();
  for (let i = 0; i < probe.c.length; i++) if (probe.c[i] === 1) s.add(i);
  return s;
};
