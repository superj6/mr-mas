// MR. MAS — cast: the ERA STAMP (the year slate) — one design for 1993 (meras), 2014 (meras) and 2015 (mdinner1).
// The display face in the lower-left corner of the SCREEN (not of the picture, so a pillarboxed 1993 carries it on
// its bar), on a plate, with a thin rule that draws on under it. Draw it into the frame and let the era's palette
// render it (1-bit, early-web or BASE). The 2008 camcorder date is the one diegetic exception.
// (The founders' freeze print and name card live in the engine: src/shared/pixel/freeze.ts.)
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {bigText, bigTextWidth, BIG_CAP} from '../font';

export const ERA_STAMP = {x: 14, y: 240} as const;
export interface EraStampPal { text: number; plate: number; rule: number }
export const ERA_STAMP_BASE: EraStampPal = {text: PAL.P1, plate: PAL.N0, rule: PAL.W6};
export const eraStamp = (b: Buf, s: string, k: number, pal: EraStampPal = ERA_STAMP_BASE) => {
  if (k < 0) return;
  const {x, y} = ERA_STAMP;
  const w = bigTextWidth(s);
  rect(x - 4, y - 4, w + 8, BIG_CAP + 9, b.ink(pal.plate));
  bigText(b, s, x, y, pal.text, {shadow: pal.plate, deep: true});
  if (k >= 1) rect(x, y + BIG_CAP + 2, Math.min(w, (k + 1) * 8), 1, b.ink(pal.rule));
};
