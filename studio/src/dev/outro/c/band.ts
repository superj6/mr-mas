// MR. MAS — outro C: THE BAND (rows 203..269), non-diegetic UI. It carries the terms line and the pointer for the
// whole outro read (o0 to the last dip): up on the cut, never animated, never covered, never part of a joke, never
// on a NopeAI surface (OUTRO-PROPOSALS §1.1 rules 1-4). 7-px face, paper at the 80 % white ceiling (P1) on black.
// The moth's perch is BESIDE the words: it stands on the final period, in the rows above it, never on a letter.
//
// Fourth pass (the cold read: "the cheapest part... a flat black strip... reads like a compliance slate stuck onto
// the scene"): the 1-px grey rule along its top is gone and the floor falls off into its black (set.ts drawSet), so
// the band is the frame's dark foreground, the way end-credit type sits under a picture; the lookdev slug is the
// 3x5 micro face with no dashed chip (still on every frame, still legible at 1080p and at 480x270).
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import {micro, microWidth} from '../../../shared/pixel/cast/bosses';
import {TERMS, POINTER, SLUG} from './text';

export const BAND_Y = 203;
export const TERMS_Y = 216, POINTER_Y = 232;
export const TERMS_X = Math.floor((480 - textWidth(TERMS)) / 2);
export const POINTER_X = Math.floor((480 - textWidth(POINTER)) / 2);
/** the final period's pixel (the moth's perch) */
export const PERIOD: [number, number] = [TERMS_X + textWidth(TERMS) - 1, TERMS_Y + 6];
/** the lookdev slug's box (native): bottom-right, micro face */
export const SLUG_BOX = {x: 480 - 8 - microWidth(SLUG), y: 270 - 6 - 5, w: microWidth(SLUG), h: 5};

export const drawBand = (b: Buf, o: {slug?: boolean} = {}) => {
  rect(0, BAND_Y, 480, 270 - BAND_Y, b.ink(PAL.N0));
  text(b, TERMS, TERMS_X, TERMS_Y, PAL.P1);
  text(b, POINTER, POINTER_X, POINTER_Y, PAL.P1);
  if (o.slug ?? true) micro(b, SLUG, SLUG_BOX.x, SLUG_BOX.y, PAL.U5); // lookdev only, the animatic's placeholder rose
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
