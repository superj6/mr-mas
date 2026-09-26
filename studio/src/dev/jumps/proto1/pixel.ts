// MR. MAS — style-jump prototype 1 · the PIXEL side (480 x 270 native, 4x at 1080p).
// Every pixel frame of the clip is Act Four's locked frame (the EDITOR's frame composer, `native()`), except the
// frames J1 changes on purpose:
//   - p0-60: ALYI's name chip is not drawn where the dialog cuts it (final polish: the blind cold read found a stray
//     "'I" at the dialog's edge; handed to THE EDITOR for the act, where the same fragment shows)
//   - the pop (p61-62): the flash-print. The room area is ONE flat paper tone (P1, 78% white) for two frames: a press
//     flash, the record taking its picture (final polish: the earlier print in dithered certificate ink read cold as
//     "a palette filter" and "a render hiccup"; the rail band is UI and never flashes)
//   - the snap (p105-119): the grid comes back with the dialog gone; his tile is greyed and carries the ONE scar (a
//     row of 2 x 2 punched holes across the hoodie). Final polish (the cold read: "overlapping tiles, a clipped edge, a
//     label spilling into the next row: a broken CSS layout"): the tile falls THROUGH ITS OWN SLOT, masked to it, in
//     four held drawings, and is gone before the four remaining tiles close ranks. No GLYPH dissolve (J1 replaces it)
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL, SKIN_COLORS} from '../../../shared/pixel/palette';
import {compilePalette, familyStep, remap, PaletteSet} from '../../../shared/pixel/palettes';
import {cluster4} from '../../../shared/pixel/dither';
import {blitImg} from '../../../shared/pixel/figure';
import {mapImg} from '../../../shared/pixel/sprite';
import {
  gridLayout, slideTiles, callChrome, drawTile, TileRect, TileState, captureTile, CALL_GREY, CALL_BAR_H,
} from '../../../shared/pixel/kits/callgrid';
import {native} from './lockv2'; // the frozen lock-v2 composer (THE EDITOR has moved the act to v3)
import {RH, putUI} from '../../../episodes/ep01/act4/animatic/lay';
import {P, actOf, phaseOf} from './timeline';

// ------------------------------------------------------------------ sc 26's call, as the lock draws it (shots.ts)
const AREA: TileRect = {x: 0, y: CALL_BAR_H, w: 480, h: RH - CALL_BAR_H};
export const G5 = gridLayout(5, {area: AREA});
export const G4 = gridLayout(4, {area: AREA});
const BOARD4 = [{id: 'alyi', name: 'ALYI'}, {id: 'neleh', name: 'NELEH'}, {id: 'mada', name: 'MADA'}, {id: 'off', name: undefined}];
const wifi = (b: Buf) => { for (let i = 0; i < 4; i++) rect(454 + i * 4, 9 - (i + 1) * 2, 3, (i + 1) * 2, b.ink(i === 0 ? PAL.P1 : PAL.N3)); };
const board4 = (b: Buf, f: number, rects: TileRect[]) =>
  BOARD4.forEach((t, i) => drawTile(b, {...rects[i], id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined}, f));
// level 0: the unmuted mic icon with no speaking bar (at level 1 its single 1 x 2 bar read cold as a stray '.')
const masTile = (): TileState => ({...G5[0], id: 'mas', name: 'MAS MANALT', muted: false, level: 0});

// ------------------------------------------------------------------ the pop: the flash-print
/** The certificate's ink in the master palette, on P1 paper (the retired dithered print pop; kept for the record) */
export const POP: PaletteSet = compilePalette({
  id: 'J1_POP', label: 'J1 flash-print (retired)', use: 'J1 in, first builds: the frame printed in the certificate ink',
  colors: [PAL.L0, PAL.P1], ramp: [PAL.L0, PAL.P1], mode: 'tone', levels: 3, pattern: cluster4,
  tone: {lo: 0.14, hi: 0.5, gamma: 0.85}, solid: SKIN_COLORS,
});
/** 'print': the press flash, the room area one flat P1 (78% white, the pop's cap is 80%); 'step': the family step
 *  k 2 (the rejected A/B). Rows 0-202 only: the rail is UI. */
const popRoom = (fb: Buf, mode: 'print' | 'step') => {
  if (mode === 'step') { remap(fb, familyStep(2), {rect: [0, 0, 480, RH]}); return; }
  rect(0, 0, 480, RH, fb.ink(PAL.P1));
};
void POP;

// ------------------------------------------------------------------ p0-60: the ALYI fragment at the dialog's edge
/** The dialog (lock v2's DLG: x -12, w 196, its shadow 3 px right) cuts ALYI's name chip and leaves "'I". Where the
 *  chip still shows right of the dialog's shadow, put back what the tile has under it. */
const DLG_RIGHT = -12 + 3 + 196; // first column right of the dialog's shadow
const hideAlyiFragment = (fb: Buf, f: number) => {
  const t = {...G5[1], id: 'alyi', vote: 3 as const};
  const A = new Buf(480, RH, PAL.N1), B = new Buf(480, RH, PAL.N1);
  drawTile(A, {...t, name: 'ALYI'}, f);
  drawTile(B, {...t, name: undefined}, f);
  for (let y = t.y + t.h - 14; y < t.y + t.h; y++)
    for (let x = DLG_RIGHT; x < t.x + 40; x++) if (fb.get(x, y) === A.get(x, y) && A.get(x, y) !== B.get(x, y)) fb.set(x, y, B.get(x, y));
};

// ------------------------------------------------------------------ the snap: the grey tile, its one scar, its exit
let scarTile: ReturnType<typeof captureTile> | null = null;
/** the scar row, in the tile's own coords: one row of punched holes straight across the hoodie, the same line the
 *  perforation ran through the vignette's hoodie (a punch, not a UI dotted rule: 2 x 2 holes on a 4 px pitch) */
export const SCAR = {y: 71, x0: 68, x1: 95, pitch: 4};
/** His tile as it was at the click (the frame the jump left), greyed, with the scar: 2 x 2 N0 holes on a 4 px pitch
 *  across the hoodie, well above the name bar's edge. Final polish: the shoulder's rim light under the name chip
 *  (tile rows 83-84), which greys into a lone pale bar, takes the hoodie's own grey. */
export const greyScarTile = () => {
  if (scarTile) return scarTile;
  const img = captureTile({...masTile(), open: undefined}, actOf(P.click));
  const g = mapImg(img, (c, i, j) => CALL_GREY.map(c, i + G5[0].x, j + G5[0].y));
  for (let x = SCAR.x0; x + 1 <= SCAR.x1; x += SCAR.pitch)
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) g.c[(SCAR.y + j) * g.w + x + i] = PAL.N0;
  for (let y = g.h - 3; y < g.h - 1; y++) for (let x = 18; x <= 40; x++) if (g.c[y * g.w + x] >= 0) g.c[y * g.w + x] = PAL.G1;
  scarTile = g;
  return g;
};
/** The exit, all inside beat 4 (15 f):
 *    p105-107  the snap: the grid again, the dialog gone, his tile greyed with the scar, in place
 *    p108-115  it falls through its OWN SLOT, masked to it (behind the call: nothing of it is ever drawn outside the
 *              slot, so it never crosses a tile or the row below), four held drawings on 2s, straight down
 *    p116-119  the slot is empty; the four close ranks in two held steps (p116, p118) and settle */
export const FALL: Array<[number, number]> = [[108, 4], [110, 14], [112, 34], [114, 60], [116, 999]];
export const CLOSE = {t0: 114, frames: 4};
const fallAt = (p: number) => { let dy = 0; for (const [q, d] of FALL) if (p >= q) dy = d; return dy; };
const drawSnap = (fb: Buf, p: number) => {
  const f = actOf(p);
  const b = new Buf(480, RH, PAL.N1);
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  const s0 = G5[0], dy = fallAt(p);
  if (dy < s0.h + 2) {
    const inSlot = (x: number, y: number) => x >= s0.x - 1 && x <= s0.x + s0.w && y >= s0.y - 1 && y <= s0.y + s0.h;
    blitImg(b, greyScarTile(), s0.x - 1, s0.y - 1 + dy, {clip: inSlot});
  }
  board4(b, f, slideTiles(G5.slice(1), G4, p, CLOSE.t0, CLOSE.frames));
  wifi(b);
  putUI(fb, b, false);
};

// ------------------------------------------------------------------ the clip's pixel frame
export interface PixelOpts { pop?: 'print' | 'step' }
/** The 480 x 270 frame at clip frame p. During the jump it still returns the locked frame: the host shows only
 *  its rail band (rows 203–269), which never jumps. */
export const pixelFrame = (p: number, o: PixelOpts = {}): Buf => {
  const ph = phaseOf(p);
  const fb = native(actOf(ph === 'pop' ? P.click + 1 : p)).fb;
  if (ph === 'pixel' || ph === 'click') hideAlyiFragment(fb, actOf(p));
  if (ph === 'pop') popRoom(fb, o.pop ?? 'print');
  if (ph === 'snap') drawSnap(fb, p);
  return fb;
};
export {RH};
