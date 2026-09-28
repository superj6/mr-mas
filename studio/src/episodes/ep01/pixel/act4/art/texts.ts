// MR. MAS — Ep1 v3 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): THE IN-WORLD TEXTS v3 CHANGED
// (script-v3-notes §4 and §7). Act Four's drawings letter these words themselves, so the lock's new text can't reach
// them; each is changed here as an opt-in state over the existing drawing, never by editing it:
//   planZerosV3(fb, k, te)      S1.04: the key ring's label `MACROSOFT · BILLIONS IN` (was `~$10B IN (REPORTED)`) and
//                               `EQUITY: 0` alone (the `(HE TOLD THE SENATE)` caption goes: Act Two now has him say it).
//                               plan4.ts draws the 2x crop of THE PLAN's sheet; here the two text boxes are re-drawn
//                               from the same sheet (kits/blueprint bpSheet, cropped at plan4's 2x) through the same
//                               ink (inkBlueprint), which is exactly what plan4 draws under them (measured: see
//                               shots-act4.md), and the new label is lettered with plan4's own call (bpText, right-aligned)
//   cursorTagV3(b, x, y, name, col)   S1.09: the collaborator arrow's tag with the NAME alone (`ALYI`, was `ALYI /
//                               CO-FOUNDER`): v5's cursorTagBig (shots5.ts, private) without its role line
//   letterAlyiV3(fb, scroll, lit)     S5.06: the letter's signature row `ALYI` (was `ALYI (REPORTED)`: kits/staff-letter
//                               letters it), re-lettered in place on the scrolled page, clipped to the page's window
//   yrralPlateV3(fb, f, name)   S7.07b: the tent card `THE OTHER YRRAL` (was `YRRAL (NOT THAT YRRAL)`: calmoff-terms'
//                               YRRAL_PLATE): the old card's box is restored from the same boardroom plate (drawBoardPlate +
//                               drawBoardPlateTable at the same f), and the new card drawn in the same style, both only
//                               where drawBoardPlateFront doesn't cover them (the original order)
//   plateName(b, x, y, name, k, accent)   a show plate with the NAME alone (plates cut to names, v3): v5's plateN
//                               (shots5.ts, private) with no lines, typed on in its 3 held steps
//   plateRel(b, x, y, text, k, accent)   v3.2 (calibration §3, script-v32-notes §10.3): a first-appearance plate with ONE
//                               relation word, the lock's 'NAME · RELATION' as v5 laid its plates out (plateN: the name,
//                               the relation on the line under it, typed on after it); no new style
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {BPX, bpSheet, bpText, bpTextWidth, inkBlueprint} from '../../../../../shared/pixel/kits/blueprint';
import {pt as uiPt, pw as uiPw} from '../../../../../shared/pixel/kits/uitype';
import {letterLayout, LETTER_SCROLL_MAX} from '../../../../../shared/pixel/kits/staff-letter';
import {BPLATE, drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront} from '../../../../../shared/pixel/rooms/boardroom-plate';
import type {BoardPlateOpts} from '../../../../../shared/pixel/rooms/boardroom-plate';
import {YRRAL_PLATE} from '../../../../../shared/pixel/rooms/calmoff-terms';
import {pt, pw, bpt, bpw} from '../../../act4/animatic/lay';

// ------------------------------------------------------------------ S1.04: THE ZEROS (plan4.ts's 2x crop)
const CROP = {x0: 220, y0: 195}; // plan4 PLAN4.crop
let TALL: Buf | null = null;
/** the 480 x 270 page under plan4's S1.04 text: the tall sheet (bpSheet 480 x 330) at plan4's integer 2x crop */
const cropPage = () => {
  TALL ??= (() => { const b = new Buf(480, 330, BPX.navy); bpSheet(b); return b; })();
  const pg = new Buf(480, 270, BPX.navy);
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) pg.c[y * 480 + x] = TALL!.c[(CROP.y0 + (y >> 1)) * 480 + CROP.x0 + (x >> 1)];
  return pg;
};
export const PLAN_LABEL_V5 = 'MACROSOFT · ~$10B IN (REPORTED)';
export const PLAN_LABEL_V3 = 'MACROSOFT · BILLIONS IN';
const CAPTION_V5 = '(HE TOLD THE SENATE)';
/** the two boxes this state re-draws (page = frame coords: bpComposite copies the inked page 1:1) */
export const planZerosBoxes = (zl = 10) => {
  const lw = bpTextWidth(PLAN_LABEL_V5), cw = bpTextWidth(CAPTION_V5);
  return {
    label: [472 - lw - 2, 27, lw + 5, 11] as [number, number, number, number], // + the typing pen's block (never shown: 999)
    caption: [214 - Math.ceil(cw / 2) - 2, 257 - zl - 1, cw + 8, 8] as [number, number, number, number],
  };
};
let PATCH: Buf | null = null;
/** S1.04 after plan4.ts drew the frame (full frame, the 2x crop): the v3 key-ring label, and no caption under EQUITY: 0 */
export const planZerosV3 = (fb: Buf, zl = 10) => {
  PATCH ??= (() => { const pg = cropPage(); bpText(pg, PLAN_LABEL_V3, 472, 28, 999, 0, {align: 'right'}); inkBlueprint(pg); return pg; })();
  const B = planZerosBoxes(zl);
  for (const [x0, y0, w, h] of [B.label, B.caption]) for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    if (x < 0 || y < 0 || x >= 480 || y >= 270) continue;
    fb.c[y * 480 + x] = PATCH.c[y * 480 + x];
  }
};

// ------------------------------------------------------------------ S1.09: the arrow's tag, the name alone
export const cursorTagV3 = (b: Buf, x: number, y: number, name: string, col: number) => {
  const w = (name ? bpw(name) : 40) + 14, h = 20;
  rect(x + 8, y + 12, w + 2, h + 2, b.ink(PAL.N0)); rect(x + 9, y + 13, w, h, b.ink(col));
  if (!name) { rect(x + 11, y + 15, w - 4, h - 4, b.ink(PAL.N1)); return; }
  bpt(b, name, x + 16, y + 16, PAL.N0);
};

// ------------------------------------------------------------------ S5.06: the letter's ALYI row (kits/staff-letter)
const SCR = {x: 18, y: 8, w: 380, h: 186}, PAGE = {x: SCR.x + 8, w: 262}; // staff-letter's screen and page (private there)
const WIN = {y0: SCR.y + 4 + 18, y1: SCR.y + 4 + SCR.h - 8}; // the page's visible rows under the fixed header
let ALYI_Y: number | null = null;
export const letterAlyiV3 = (fb: Buf, scroll: number, lit: boolean, name = 'ALYI') => {
  ALYI_Y ??= letterLayout().alyiY;
  const sc = Math.max(0, Math.min(LETTER_SCROLL_MAX, Math.round(scroll)));
  const row = SCR.y + 4 + ALYI_Y - sc; // the row's text top on screen
  const t = new Buf(480, 270, 0x1000000);
  rect(PAGE.x + 6, row - 2, PAGE.w - 12, 11, t.ink(lit ? PAL.W3 : PAL.N2));
  if (lit) rect(PAGE.x + 6, row - 2, 2, 11, t.ink(PAL.W7));
  uiPt(t, name, PAGE.x + 12, row, lit ? PAL.W8 : PAL.P0);
  for (let y = Math.max(WIN.y0, row - 2); y < Math.min(WIN.y1, row + 9); y++) for (let x = PAGE.x; x < PAGE.x + PAGE.w; x++) {
    const c = t.c[y * 480 + x];
    if (c !== 0x1000000) fb.c[y * 480 + x] = c;
  }
};

// ------------------------------------------------------------------ S7.07b: the tent card (rooms/calmoff-terms drawOtherYrralM)
const YRRAL_PO: BoardPlateOpts = {laptop: false, rolodex: 'still', fires: [{at: 'chair', x: 96, phase: 1}, {at: 'table', x: 380, phase: 2}]};
const tentBox = (s: string) => { const w = uiPw(s) + 14; return {x: 240 - Math.round(w / 2), y: BPLATE.tableY + 10, w}; };
export const yrralPlateV3 = (fb: Buf, f: number, name = 'THE OTHER YRRAL') => {
  const A = new Buf(480, 270, PAL.N0);
  drawBoardPlate(A, f, YRRAL_PO); drawBoardPlateTable(A, f, YRRAL_PO);
  const F = new Buf(480, 270, PAL.N0); F.c.set(A.c); drawBoardPlateFront(F, f, YRRAL_PO);
  const old = tentBox(YRRAL_PLATE), nu = tentBox(name);
  // the new card on the plate, in calmoff-terms' style (its shadow 2 px right and below, the lit top edge, the 7 px face)
  const C = new Buf(480, 270, PAL.N0); C.c.set(A.c);
  rect(nu.x + 2, nu.y + 16, nu.w, 3, C.ink(PAL.N0));
  rect(nu.x, nu.y, nu.w, 16, C.ink(PAL.P1)); rect(nu.x, nu.y, nu.w, 1, C.ink(PAL.P2)); rect(nu.x, nu.y + 15, nu.w, 1, C.ink(PAL.P0));
  uiPt(C, name, nu.x + 7, nu.y + 5, PAL.N1);
  for (let y = old.y; y < old.y + 19; y++) for (let x = old.x; x < old.x + old.w + 2; x++) {
    const i = y * 480 + x;
    if (F.c[i] !== A.c[i]) continue; // the plate's front covers it (drawn after the card): keep
    fb.c[i] = C.c[i];
  }
};

// ------------------------------------------------------------------ a show plate with the name alone
export const plateName = (b: Buf, x: number, y: number, name: string, k: number, accent: number) => {
  if (k < 0) return;
  const w = pw(name) + 16;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(16 * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
};

// ------------------------------------------------------------------ v3.2: a show plate with the name and one relation word
export const plateRel = (b: Buf, x: number, y: number, text: string, k: number, accent: number) => {
  if (k < 0) return;
  const [name, ...rest] = text.split(' · ');
  const lines = rest.length ? [rest.join(' · ')] : [];
  const w = Math.max(pw(name), ...lines.map(pw)) + 16;
  const full = 16 + lines.length * 10, open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(full * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
  lines.forEach((l, i) => pt(b, l.slice(0, Math.max(0, (k - 5 - i * 4) * 3)), x + 8, y + 15 + i * 10, PAL.P1));
};
