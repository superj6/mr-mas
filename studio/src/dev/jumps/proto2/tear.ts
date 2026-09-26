// MR. MAS — style jump prototype 2 · VARIANT C, THE TEAR (final polish; the build that ships).
// The sky tears. From behind the window head, a tear runs straight down through OPEN sky (between the Orb and the
// spire, well above the rooftops), passes behind the transom and stops in mid-air. It holds as a torn hairline, then
// is pulled apart from the top like a sheet: a narrow V, widest at the window head (where it runs on out of frame) and
// closing to a torn hairline at its tip. It seals from the tip up and leaves a torn scar where it stood widest.
//
// Why this and not the seam (B) it replaces (the blind cold read of the seam build, 2026-09-26): the seam's lower end
// hid behind a tower's roof, so at 480 x 270 its column of stars sat ON the tower and read as "a lit spire"; its
// perfect rectangle, whose look changed where it crossed the transom, read as "a pasted texture strip or a render
// glitch"; its hairline read as a dead pixel column. So:
//   - it lives in OPEN SKY: its only occluders are the window head (above) and the transom (across it); its tip stops
//     15 native px above the nearest roof, and nothing of the city touches it
//   - its edges are TORN: both lips carry the same jagged profile (a torn sheet's two edges fit back together), so it
//     reads as one surface pulled apart, never as a layer or a column of dead pixels
//   - its path meanders by a pixel (a tear never runs ruler-straight) but has no trend, no corners and no branches:
//     not a chart, not lightning (§5.4 lesson 5)
//   - it is a V with ONE visible end (the tip). Its top runs on behind the window head, so it is never a lens or an
//     eye; its profile bows (width ~ distance^0.7), so it is a rip, not a drawn triangle or an arrowhead
//   - one lip dark (the sheet's cut face in shadow), one a rung lighter: never two lit lips (a beam)
// Everything here is whole pixels on the native grid (the tear, the lips, the scar). Only the far side is continuous.
import {hash} from '../../../shared/pixel/px';
import {stepColor} from '../../../shared/pixel/palette';
import {T} from './timing';
import {isSky} from './skyplane';

const NW = 480, RH = 203;

/** the tear: its column, the window head it runs out from, its tip in open sky (the roofs under it start at 76; wMax its top width at the hold) */
export const TEAR = {x: 232, y0: 10, tip: 61, speed: 8, bow: 0.62, wMax: 20};

// ------------------------------------------------------------------ the torn path (deterministic, pure)
/** the centre line's meander: a walk in {-1, 0, 1} that changes at most every 4-9 rows (a tear drifts, it never zigzags) */
const MEANDER: Int8Array = (() => {
  const m = new Int8Array(RH);
  let v = 0, run = 0;
  for (let y = TEAR.y0; y <= TEAR.tip; y++) {
    if (run <= 0) {
      const u = hash(y, 1, 4411);
      const nv = u < 0.3 ? v - 1 : u > 0.7 ? v + 1 : v;
      v = Math.max(-1, Math.min(1, nv));
      run = 4 + Math.floor(hash(y, 2, 4411) * 6);
    }
    m[y] = v;
    run--;
  }
  return m;
})();
/** the torn edge's fibre: a 1 px jog, in short runs (2-4 rows), shared by BOTH lips so the two edges fit together */
const FIBRE: Int8Array = (() => {
  const f = new Int8Array(RH);
  let v = 0, run = 0;
  for (let y = TEAR.y0; y <= TEAR.tip; y++) {
    if (run <= 0) {
      const u = hash(y, 3, 4411);
      v = u < 0.28 ? -1 : u > 0.72 ? 1 : 0;
      run = 2 + Math.floor(hash(y, 4, 4411) * 3);
    }
    f[y] = v;
    run--;
  }
  return f;
})();

/** the tear's line at row y (the hairline's column) */
export const tearLine = (y: number) => TEAR.x + MEANDER[y] + FIBRE[y];

/** its top width (native px) at clip frame p (0 = pixel, 1 = the torn hairline) */
export const tearWidth = (p: number): number => {
  if (p < T.crack) return 0;
  if (p < T.open) return 1;
  // it is pulled apart on beat 4, in held steps on 2s
  if (p < T.open + 2) return 4;
  if (p < T.open + 4) return 9;
  if (p < T.open + 6) return 14;
  if (p < T.head + 8) return 18;
  // the hold: two more whole pixels, once
  if (p < T.seal) return TEAR.wMax;
  // the seal, faster than it came in
  if (p < T.seal + 4) return 12;
  if (p < T.seal + 8) return 5;
  if (p < T.scar) return 1;
  return 0;
};

/** the tear's tip row at frame p: it runs down at constant speed (a physical tear, never eased) */
export const tearTip = (p: number) => (p < T.crack ? TEAR.y0 - 1 : Math.min(TEAR.tip, TEAR.y0 - 1 + TEAR.speed * (p - T.crack + 1)));

/**
 * The opening's columns at row y for top width W: the V bows (width ~ (distance to the tip)^0.7), and at least the
 * torn hairline runs on to the tip. Both lips follow the same torn line (tearLine), so the halves fit.
 */
export const tearSpan = (y: number, W: number): [number, number] | null => {
  if (W <= 0 || y < TEAR.y0 || y > TEAR.tip) return null;
  const c = tearLine(y);
  if (W <= 1) return [c, c];
  const d = (TEAR.tip - y) / (TEAR.tip - TEAR.y0);
  const w = Math.max(1, Math.round(W * Math.pow(d, TEAR.bow)));
  const xl = c - Math.floor((w - 1) / 2);
  return [xl, xl + w - 1];
};

/** the gap mask (native, 255 = the far side shows) at frame p; only on the sky plane (occ: Mas and the Orb) */
export const tearMask = (p: number, occ?: Uint8Array): Uint8Array => {
  const m = new Uint8Array(NW * 270);
  const W = tearWidth(p);
  if (W <= 0) return m;
  const tip = tearTip(p);
  for (let y = TEAR.y0; y <= tip; y++) {
    const s = tearSpan(y, W);
    if (!s) continue;
    for (let x = s[0]; x <= s[1]; x++) if (isSky(x, y, occ)) m[y * NW + x] = 255;
  }
  return m;
};

/**
 * The lips: the two faces' torn edges, one whole pixel each. The left face's edge a rung darker (its thickness in
 * shadow), the right face's a rung lighter (catching the far side). Never both light.
 */
export const tearLips = (fb: {c: Uint32Array}, p: number, gap: Uint8Array, occ?: Uint8Array) => {
  if (tearWidth(p) < 3) return;
  for (let y = TEAR.y0; y < RH; y++) {
    let xl = -1, xr = -1;
    for (let x = TEAR.x - 12; x <= TEAR.x + 12; x++) if (gap[y * NW + x]) { if (xl < 0) xl = x; xr = x; }
    if (xl < 0 || xr - xl < 1) continue;
    if (isSky(xl - 1, y, occ)) fb.c[y * NW + xl - 1] = stepColor(fb.c[y * NW + xl - 1], -1);
    if (isSky(xr + 1, y, occ)) fb.c[y * NW + xr + 1] = stepColor(fb.c[y * NW + xr + 1], 1);
  }
};

/**
 * The scar: what the seal leaves for the rest of the scene. The torn line itself, two rungs darker than the sky, where
 * it stood widest: from behind the window head down to above the transom. The thin run below heals clean.
 */
export const SCAR = {y0: TEAR.y0, y1: 33};
export const tearScar = (fb: {c: Uint32Array}, occ?: Uint8Array) => {
  for (let y = SCAR.y0; y <= SCAR.y1; y++) {
    const x = tearLine(y);
    if (isSky(x, y, occ)) fb.c[y * NW + x] = stepColor(fb.c[y * NW + x], -2);
  }
};

/** where the Orb looks: up the tear, above the transom */
export const tearLookAt: [number, number] = [TEAR.x, 28];

/** the opening's light on the Orb (the witness): its rim facing the tear takes one rung, in whole pixels, while the
 *  tear is open wide (a pixel light, never a continuous cast: the room stays in its own medium) */
export const tearOrbRim = (fb: {c: Uint32Array}, p: number, cx: number, cy: number, r: number) => {
  const W = tearWidth(p);
  if (W < 6) return;
  for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
    const nx = (i + 0.5) / r, ny = (j + 0.5) / r;
    const d = Math.hypot(nx, ny);
    if (d > 1 || d < (W >= 12 ? 0.74 : 0.84)) continue;
    // facing up and to the right, toward the tear
    const facing = (nx * 0.55 - ny * 0.84) / Math.max(1e-6, d);
    if (facing < 0.62) continue;
    const q = (cy + j) * NW + (cx + i);
    fb.c[q] = stepColor(fb.c[q], 1);
  }
};
