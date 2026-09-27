// MR. MAS — cast: RIMA's v5 swaps (STATE-SMALL 8; Ep1 Act Four v5 art pass, round 3; new file, owned by the v5 art
// pass). S3.04 over Neleh's shoulder: Rima joins in the fifth slot and "smooths her jacket" in her tile. Her portrait
// (cast/rima-speak.ts rimaSpeakPortrait) has the smoothing hand; her call-tile bust (rimaBust, 72 x 80) does not. This
// adds it at the bust's scale as a pixel patch (the owner's file is untouched):
//   rimaBustHand(s)                   rimaBust + the hand flat on the near lapel (camera-left), 2 held drawings down
//                                     the cloth: s.hand 'smooth0' (high) | 'smooth1' (3 px lower) | 'none'
//   drawRimaTileV5(b, x, y, w, h, s)  rima-speak.ts drawRimaTile with that bust (the same spot disc, the same framing)
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {Img, blitImg} from '../figure';
import {memo} from './kit';
import {rimaBust, RimaBustState, RIMA_BUST_W, RIMA_BUST_H, RIMA_HOUSE_DARK} from './rima-speak';
import {clipped, tileClip, bustY} from './calltile';

export type RimaTileHand = 'none' | 'smooth0' | 'smooth1';
// the back of her hand flat on the lapel, fingers together up the slope (her portrait's hand, redrawn at bust scale)
const HAND = [
  '.....oo...',
  '...oo45o..',
  '..o44545o.',
  '.o3444443o',
  'o33444433o',
  'o2333332o.',
  '.oooooo...',
];
const HP: Record<string, number> = {o: PAL.S1, '2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
export const rimaBustHand = memo((s: RimaBustState & {hand: RimaTileHand}): Img => {
  const base = rimaBust({mouth: s.mouth, lid: s.lid});
  const out: Img = {w: base.w, h: base.h, c: new Int32Array(base.c)};
  if (s.hand === 'none') return out;
  const hx = 25, hy = s.hand === 'smooth0' ? 56 : 59; // on the near lapel (bust lapL x 25-36, y 55-71), clear of the name chip
  HAND.forEach((r, j) => [...r].forEach((ch, i) => { const c = HP[ch]; if (c !== undefined && hy + j < out.h) out.c[(hy + j) * out.w + hx + i] = c; }));
  return out;
});
export const drawRimaTileV5 = (b0: Buf, x: number, y: number, w: number, h: number, s: RimaBustState & {hand?: RimaTileHand}, o: {spot?: 0 | 1} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  const spot = o.spot ?? 1;
  const img = rimaBustHand({mouth: s.mouth, lid: s.lid, hand: s.hand ?? 'none'});
  const bx = x + Math.round(w / 2 - RIMA_BUST_W / 2), by = bustY(y, h, RIMA_BUST_H);
  if (!spot) { blitImg(b0, img, bx, by, {clip, map: RIMA_HOUSE_DARK}); return; }
  const cx = x + w / 2, cy = y + h * 0.42, r = Math.min(w, h * 1.4) * 0.36;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = Math.hypot(x + i + 0.5 - cx, (y + j + 0.5 - cy) * 1.05);
    if (d < r - 1) b.set(x + i, y + j, PAL.X2);
    else if (d < r) b.set(x + i, y + j, PAL.X3);
  }
  blitImg(b0, img, bx, by, {clip});
};
