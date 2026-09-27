// MR. MAS — outro A: the stand-in "last frame of the episode" (Ep1's button isn't built). The last frame of the
// Act Four v4 animatic, baked to master-palette indices by tools/standin.py (standin-data.ts). Its band is dark;
// the animatic's own `HIS SIDE` caption box (x 417-469, y 250-263) is blanked here, so the stand-in second shows
// the act's picture and nothing of the animatic's labelling.
import {Buf, W, H, rect} from '../../../shared/pixel/px';
import {PAL, PalName} from '../../../shared/pixel/palette';
import {STANDIN_B64, STANDIN_NAMES} from './standin-data';

const CAPTION = {x: 414, y: 247, w: 59, h: 20};

let cache: Buf | null = null;
export const standin = (): Buf => {
  if (cache) return cache;
  const bin = atob(STANDIN_B64);
  const b = new Buf(W, H, PAL.N0);
  const cols = STANDIN_NAMES.map((n) => PAL[n as PalName]);
  for (let i = 0; i < W * H; i++) b.c[i] = cols[bin.charCodeAt(i)];
  rect(CAPTION.x, CAPTION.y, CAPTION.w, CAPTION.h, b.ink(PAL.N0));
  cache = b;
  return b;
};
