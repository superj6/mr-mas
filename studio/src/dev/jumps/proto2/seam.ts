// MR. MAS — style jump prototype 2 · VARIANT B, THE SEAM (fix pass; the build that ships).
// The sky splits. One straight vertical seam in the window's upper-right sky, clean-edged, like a backdrop or a
// curtain parting: it tears straight down at constant speed from behind the window head to behind the rooftops, holds
// as a 1 px line with the far side already in it, then parts a few whole pixels in held steps, holds, and seals.
//
// Why this shape (the critic, three passes): any jagged line across a skyline reads as a price chart, and a jagged line
// in a sky reads as lightning. A seam has no trend, no corners and no branches; it never crosses the city (the rooftops
// stand in front of it), never comes near his face, and it passes BEHIND the transom, which is what says "the sky"
// rather than "the window". Both of its ends are hidden (the window head above, a tower below), so the opening is
// parallel-sided: never a lens or an eye.
//
// Everything here is whole pixels on the native grid: the tear, the lips, the widths, the scar. Only the far side
// inside it is continuous (deep.ts).
import {stepColor} from '../../../shared/pixel/palette';
import {T, seamWidth} from './timing';
import {isSky, SKY_TOP} from './skyplane';

const NW = 480, RH = 203;

/** the seam: its column, and where the sky it runs through starts (the window head) and ends (the tower's roof) */
export const SEAM = {x: 280, y0: 10, y1: SKY_TOP[280] - 1, speed: 8};

/** the tear's tip row at frame p (constant speed: a physical tear, never eased) */
export const seamTip = (p: number) => (p < T.crack ? SEAM.y0 - 1 : Math.min(SEAM.y1, SEAM.y0 - 1 + SEAM.speed * (p - T.crack + 1)));

/** the columns the gap spans at width w: it parts about its line */
export const seamSpan = (w: number): [number, number] => {
  const xl = SEAM.x - Math.floor(w / 2);
  return [xl, xl + w - 1];
};

/** the gap mask (native, 255 = the far side shows) at frame p; only on the sky plane (occ: Mas and the Orb) */
export const seamMask = (p: number, occ?: Uint8Array): Uint8Array => {
  const m = new Uint8Array(NW * 270);
  const w = seamWidth(p);
  if (w <= 0) return m;
  const [xl, xr] = seamSpan(w);
  const tip = seamTip(p);
  for (let y = SEAM.y0; y <= tip; y++) for (let x = xl; x <= xr; x++) if (isSky(x, y, occ)) m[y * NW + x] = 255;
  return m;
};

/**
 * The lips: the two faces' cut edges, one whole pixel each. The left face's edge sits a rung darker (its thickness in
 * shadow); the right face's edge a rung lighter, catching the far side. Never both light: a slit with two lit lips is
 * a glowing line (lightning, a beam).
 */
export const LIP = {left: -1, right: 1};
export const seamLips = (fb: {c: Uint32Array}, p: number, gap: Uint8Array, occ?: Uint8Array) => {
  const w = seamWidth(p);
  if (w < 2) return;
  const [xl, xr] = seamSpan(w);
  for (let y = SEAM.y0; y < RH; y++) {
    if (gap[y * NW + xl] && isSky(xl - 1, y, occ)) fb.c[y * NW + xl - 1] = stepColor(fb.c[y * NW + xl - 1], LIP.left);
    if (gap[y * NW + xr] && isSky(xr + 1, y, occ)) fb.c[y * NW + xr + 1] = stepColor(fb.c[y * NW + xr + 1], LIP.right);
  }
};

/**
 * The scar: what the seal leaves for the rest of the scene. A 1 px line a rung darker than the sky, only in the upper
 * pane where it stood widest, well short of both ends: the pilot's hairline, now with a reason.
 */
export const SCAR = {y0: 17, y1: 36};
export const seamScar = (fb: {c: Uint32Array}, occ?: Uint8Array) => {
  for (let y = SCAR.y0; y <= SCAR.y1; y++) if (isSky(SEAM.x, y, occ)) fb.c[y * NW + SEAM.x] = stepColor(fb.c[y * NW + SEAM.x], -1);
};

/** where the Orb looks: the seam where it crosses the transom */
export const seamLookAt: [number, number] = [SEAM.x, 40];
