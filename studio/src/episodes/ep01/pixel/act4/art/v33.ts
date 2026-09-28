// MR. MAS — Ep1 v3.3 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): the v3.3 polish's small drawings
// (PLAN.md §6: S2 / P15, S4 / S5 / P17; script-v33-notes.md §2). Nothing shared is edited; each is a new drawing or a
// state over an existing one, in the shared modules' conventions (whole palette rungs, held drawings, no blends).
//   drawBlankPage(b, cx, cy, st)   S4.10b: the page Ttemme turns over toward us, its back BLANK (the running gag: the
//                                  reason is never shown): 'edge' (the page edge-on, turning) · 'turn' (three-quarters)
//                                  · 'blank' (the full sheet facing us, nothing on it), held in his two hands (the
//                                  folder kit's hand drawing) at the folder's spot in his rig (cx, cy)
//   EMPLOYEE / drawEmployee(b, footX, footY, st)
//                                  S7.02: the employee who asked "Is this a coup?" (S3.06's tile 22: long dark hair, her
//                                  skin, the green top), now in the bullpen with the rest, coat on, a box in her arms:
//                                  rooms/bullpen's own walkout extra (walkoutExtra seed 73, coat 3 the green parka: the
//                                  seed whose hair, hair length and skin are her tile's, found by a search), turned to
//                                  face Mas (flipped); her mouth opens on the take's syllables ('open': the extra's 2 px
//                                  mouth goes dark and her lower lip drops a pixel, as cast/employee-stand does her tile)
//   drawWallTV(b, st)              S7.02 / S7.02b: the bullpen's wall TV, hung on the conference room's glass (over the
//                                  room's own dark screen), 100 x 56: an interview set, TASYA at a podcast mic (his
//                                  medium rig, cast/tasya-medium, lip-synced when he talks), the mic on its boom arm in
//                                  front of him. Drawn only where no one stands in front of it (the crowd mask)
//   WALL_TV                        its rect
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
import {walkoutExtra, EXTRA_H, EXTRA_W} from '../../../../../shared/pixel/rooms/bullpen';
import {tasyaMedium, TASYA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/tasya-medium';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';

const RH = 203;

// ================================================================== S4.10b: the blank page
const HAND = ['.oo.', 'o45o', 'o44o', 'o45o', 'o44o', 'o33o', '.oo.'];
const hand = (b: Buf, x: number, y: number, flip: boolean) => {
  const pal: Record<string, number> = {o: PAL.S0, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
  HAND.forEach((r, j) => { for (let i = 0; i < 4; i++) { const c = pal[r[flip ? 3 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};
export const drawBlankPage = (b: Buf, cx: number, cy: number, st: 'edge' | 'turn' | 'blank') => {
  const H = 31, y = cy - 16;
  const w = st === 'edge' ? 3 : st === 'turn' ? 13 : 24;
  const x = cx - Math.floor(w / 2);
  if (st === 'turn') { // three-quarters: the near edge taller than the far (a trapezoid), the sheet's face catching the light
    for (let i = 0; i < w; i++) { const inset = Math.round((i / w) * 2); for (let j = inset; j < H - inset; j++) b.set(x + i, y + j, i === 0 ? PAL.G5 : j === inset ? PAL.P1 : PAL.P2); }
  } else if (st === 'edge') {
    rect(x, y, w, H, b.ink(PAL.P1)); rect(x + 1, y, 1, H, b.ink(PAL.P2));
  } else {
    rect(x, y, w, H, b.ink(PAL.P2)); // the back of the page: blank
    rect(x, y, w, 1, b.ink(PAL.P1)); rect(x, y, 1, H, b.ink(PAL.P1)); // its lit top and near edges
    rect(x + 1, y + H, w, 1, b.ink(PAL.G3)); rect(x + w, y + 1, 1, H, b.ink(PAL.G3)); // its shadow on him
    b.set(x + w - 1, y, PAL.P1); b.set(x + w - 2, y + 1, PAL.G6); // a corner's slight curl
  }
  hand(b, x - 3, cy - 4, false); hand(b, x + w - 1, cy - 4, true);
};

// ================================================================== S7.02: the employee, speaking
const EMP_SEED = 73, EMP_COAT = 3;
/** her mouth in the (unflipped) extra: bullpen walkoutExtra draws it at (hx + 8, hy + 10) with hx 9 and this seed's
 *  height offset 3 (measured on the drawing) */
const EMP_MOUTH: [number, number] = [17, 13];
let EMP: Img | null = null;
export const EMPLOYEE = {w: EXTRA_W, h: EXTRA_H, foot: [15, EXTRA_H - 1] as [number, number], head: [8, 2, 22, 16] as [number, number, number, number]};
export const drawEmployee = (b: Buf, footX: number, footY: number, st: {mouth?: 'open' | 'rest'; flip?: boolean} = {}) => {
  const img = (EMP ??= walkoutExtra(EMP_SEED, {coat: EMP_COAT}));
  const x = footX - EMPLOYEE.foot[0], y = footY - EMPLOYEE.foot[1];
  blitImg(b, img, x, y, {flip: st.flip});
  if (st.mouth === 'open') {
    const [mx, my] = EMP_MOUTH, lip = img.c[(my) * img.w + mx];
    const X = (i: number) => (st.flip ? x + EXTRA_W - 1 - i : x + i);
    b.set(X(mx), y + my, PAL.N0); b.set(X(mx + 1), y + my, PAL.N0);
    if (lip >= 0) b.set(X(mx), y + my + 1, lip);
  }
};

// ================================================================== S7.02 / S7.02b: the bullpen's wall TV
export const WALL_TV = {x: 140, y: 42, w: 100, h: 56};
export interface WallTVState { f: number; mouth?: Viseme; lid?: 0 | 1 | 2; }
/** the TV into `b` wherever `free(x, y)` (nobody in front of it) */
export const drawWallTV = (b: Buf, st: WallTVState, free: (x: number, y: number) => boolean = () => true) => {
  const T = WALL_TV;
  const t = new Buf(T.w, T.h + 4, PAL.N0);
  // the panel: a thin black bezel, its lower lip catching the window light
  rect(0, 0, T.w, T.h, t.ink(PAL.N0)); rect(1, T.h - 2, T.w - 2, 1, t.ink(PAL.G2));
  const sx = 3, sy = 3, sw = T.w - 6, sh = T.h - 7;
  // the interview set: a warm dark studio, two soft practical lights behind him, the desk's edge
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) t.set(sx + x, sy + y, y > sh - 8 ? (y === sh - 8 ? PAL.D3 : PAL.D1) : (x + y) % 11 === 0 ? PAL.D2 : PAL.N1);
  for (const [lx, ly] of [[12, 8], [80, 11]]) for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (i * i + j * j <= 9) t.set(sx + lx + i, sy + ly + j, i * i + j * j <= 2 ? PAL.W6 : PAL.W3);
  // TASYA, his medium rig, head and shoulders in the frame (the rig's top 46 rows), 3/4 toward the host off-screen left
  const img = tasyaMedium({...TASYA_MEDIUM_DEFAULT, mouth: st.mouth ?? 'smile', lid: st.lid ?? 0, brow: 'warm', arm: 'clasp'});
  blitImg(t, img, sx + 18, sy + 2, {clip: (x, y) => x >= sx && x < sx + sw && y >= sy && y < sy + sh - 7});
  // the podcast mic on its boom arm: the arm in from the frame's left edge (clear of his face), the mic at his mouth's
  // height a little in front of him, tilted up toward it (a black cylinder, its grille's rim lit, the windscreen's top)
  const mx = sx + 44, my = sy + 32;
  for (let i = 0; i <= mx - 2 - sx; i++) { const x = sx + i, y = sy + 26 + Math.round((i * 8) / (mx - 2 - sx)); t.set(x, y, PAL.G3); t.set(x, y + 1, PAL.N0); }
  for (let j = 0; j < 12; j++) for (let i = 0; i < 6; i++) {
    const x = mx + i - Math.floor(j / 4), y = my + j;
    t.set(x, y, j < 5 ? (i === 0 || i === 5 ? PAL.N0 : (i + j) % 2 ? PAL.G2 : PAL.N2) : i === 4 ? PAL.G3 : i === 0 ? PAL.N0 : PAL.N1);
  }
  for (let i = 0; i < 6; i++) t.set(mx + i, my - 1, PAL.G4);
  // the TV's cool light on the glass round it (one rung, 2 px)
  for (let y = -2; y < T.h + 2; y++) for (let x = -2; x < T.w + 2; x++) {
    const X = T.x + x, Y = T.y + y;
    if (X < 0 || X >= 480 || Y < 0 || Y >= RH || !free(X, Y)) continue;
    if (x >= 0 && x < T.w && y >= 0 && y < T.h) b.set(X, Y, t.get(x, y));
    else b.set(X, Y, stepColor(b.get(X, Y), 1));
  }
};
