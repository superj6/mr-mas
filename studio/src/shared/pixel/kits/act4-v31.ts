// MR. MAS — kit: ACT FOUR's v3.1 ITEMS (Ep1 script draft 7, script-v31-notes.md §3.1, §3.4, §4; new file, owned by the
// `v3-art-b` pass). Act Four's own modules are not edited: each item is a new drawing, or a composition of theirs.
//   drawRemoveDialog(b, f, st)    v31-S1.08d, the HARD CUT: bright, full frame, in the 1993 dialog's ink and cream
//                                 (kits/dialog-1993.ts's look: one plain rule, a hard drop shadow, the default button's
//                                 thick ring): `Remove MAS MANALT` / `from the meeting?` and ONE button, `Remove`. The
//                                 noon arrow (kits/callgrid.ts drawPointer) with its collaborator tag `ALYI` in the
//                                 display face steps onto it (`pointer` 0..REMOVE_STEPS, a held position a beat) and
//                                 `click`s: the button's pressed drawing, the arrow's 1 px dip.
//                                 S8.03's re-rhyme in the lobby: field 'screen' (the dialog alone, over the caller's
//                                 lobby), `grey` 1..3 (Remove greys one dither step a beat; no ring from 1), the arrow's
//                                 tag empty (`tag: ''`), `click` on a greyed button = the arrow dips, the button doesn't
//                                 go down, and `shake` [dx, dy] (sprite.ts shakeAt) for the refusal
//   drawNelehDeskHigh(b, f, st)   v31-S3.00p: NELEH'S DESK, FRIDAY 11:52 AM, from above: her laptop's call open with its
//                                 clock `11:52`, MADA's tile joined early (cast/mada.ts drawMadaTile: arms folded, the
//                                 spinner turning), three slots waiting; THE PLAN's print unfolded beside it; NELEH
//                                 leaning over it from the frame's foot (the crown of her head, the centre part, her
//                                 navy shoulders, her pen hand on the print), her footnote slips orbiting (cast/neleh.ts
//                                 drawFootnotes 'slips'). framing 'paper' = the push's landing: S1.03's first sheet frame
//                                 at 1:1 (the nine chairs and their plates, GERG / CHAIR as draft 7 has it, no stamp yet:
//                                 it lands in the GFX), with her pen hand on NELEH's plate, so the cut into the GFX is the
//                                 hand leaving and the linework lifting
//   drawTuesdayInvite(b, f, st)   v31-S7.03b [ECU]: his end desk (S7.01's wood), the GUEST lanyard (props.ts 'insert')
//                                 and the MACROSOFT badge at the same card size (macrosoftInsert), his phone lighting with
//                                 the invite in the cold open's calendar UI (kits/phone-invite.ts's card, re-laid for
//                                 its words): `Board · Tue 10:00 PM`, Accept / Decline, three circles: a spinner, a fire
//                                 helmet, a blank. k = the cold open's wake + slide steps; `thumb` 'tap' (no hover:
//                                 it comes straight down: his thumb from above at the ECU's scale, its nail), `accepted`
//   drawSundayOTS(b, f, st)       S4.09, the reversal on screen: v5's drawBoardScreenOTS (the lobby feed at 1:1 in the
//                                 glass, Alyi's reflection) with v3.1's two additions: the ticker across the feed's foot
//                                 (`INVESTORS PUSH TO BRING MANALT BACK`, crawling) and the table's edge in the
//                                 foreground with the four phones set in a row, face up, buzzing in turn, `STAFF · STAFF
//                                 · INVESTORS · INVESTORS`; Neleh's shoulder over them (cast/neleh-ots.ts)
//   drawPhonesRow / drawTicker    those two pieces alone, for any other layout
//   drawAlyiGlass(b, f, st)       S4.02's cutaway [MCU·glass]: the boardroom's dark window at night, full frame, ALYI's
//                                 reflection (cast/alyi-speak alyiReflection, lip-synced) not turning, the Valley's
//                                 lights through the glass, the four phones' lit screens reflected beside him (glow slabs:
//                                 their words would read backwards in a reflection, so they carry no letters)
//   callOutPainter(st)            S5.09 (draft 7: he calls; in v3 Gerg called): a painter for his monitor (kits/mas-
//                                 monitor): phase 'app' (the call app: GERG at the top of the contacts, `board sync ·
//                                 ended` greyed under him) · 'click' (GERG pressed) · 'ring' (outgoing: GERG's circle,
//                                 `Calling…`, the ring's pulses stepping out on 6s). The answer is v5's tile opening
//   drawCallOutTile(b, x, y, k)   the same ring as v5's corner tile (64 x 38), outgoing: `Calling…` under GERG
//   drawDrySqueeze(b, x, y, st)   S7.06: Terb's squeeze with the pin in (cast/terb.ts, the spray arm, no spray drawn);
//                                 k 1 = the dry click's one-frame kick (he jumps a pixel; nothing comes out)
//   drawTerbWriting(b, x, y, k)   S7.07-cont: Terb writing "Gerg comes back too." onto the sheet (cast/terb-sheet, reading),
//                                 the pen and the new line growing (k 0..4)
//   letterHeaderStrip(b, x, y, w) S6.01: the letter's header strip, `STAFF LETTER · TO THE BOARD`, for the first
//                                 employee tile of the avalanche (the caller's paint callback draws it on tile 0)
import {Buf, rect, line, ellipse, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {bigText, bigTextWidth, text, textWidth} from '../font';
import {pt, pw, bpt, bpw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {INK, PAPER} from '../cast/kit';
import {BPX, bpSheet, bpChair, bpText, bpComposite} from './blueprint';
import {guestBadge} from './props';
import {drawPointer} from './callgrid';
import {isMini, Painter} from './mas-monitor';
import {alyiReflection} from '../cast/alyi-speak';
import {drawTerbRoom, TERB_ROOM_DEFAULT, TERB_W, TERB_FOOT} from '../cast/terb';
import {drawTerbSheetRoom, TERB_SHEET_DEFAULT} from '../cast/terb-sheet';
import {drawMadaTile, MADA_BUST_DEFAULT, drawSpinner} from '../cast/mada';
import {drawFootnotes} from '../cast/neleh';
import {drawBoardScreenOTS, BSCREEN} from '../rooms/board-screen';
import {drawNelehShoulderR, NELEH_OTS_DEFAULT, NelehOtsState} from '../cast/neleh-ots';
import {blitImg} from '../figure';
import type {Viseme} from '../cast/talk';

const RH = 203;
const roundRect = (b: Buf, x: number, y: number, w: number, h: number, col: number, dotted = 0) => {
  const on = (i: number, j: number) => (dotted === 0 ? true : dotted === 1 ? (i + j) % 4 !== 0 : ((x + i + y + j) & 1) === 0);
  for (let i = 2; i < w - 2; i++) { if (on(i, 0)) b.set(x + i, y, col); if (on(i, h - 1)) b.set(x + i, y + h - 1, col); }
  for (let j = 2; j < h - 2; j++) { if (on(0, j)) b.set(x, y + j, col); if (on(w - 1, j)) b.set(x + w - 1, y + j, col); }
  for (const [i, j] of [[1, 1], [w - 2, 1], [1, h - 2], [w - 2, h - 2]]) if (on(i, j)) b.set(x + i, y + j, col);
};

// ================================================================== the Remove dialog (v31-S1.08d, S8.03)
export const REMOVE_Q = ['Remove MAS MANALT', 'from the meeting?'];
export const REMOVE_DLG = {x: 100, y: 34, w: 280, h: 124};
const REMOVE_BTN = {w: 88, h: 21};
/** the button's rect inside a dialog at (x, y) */
export const removeButton = (x = REMOVE_DLG.x, y = REMOVE_DLG.y): [number, number, number, number] =>
  [x + Math.round((REMOVE_DLG.w - REMOVE_BTN.w) / 2), y + REMOVE_DLG.h - REMOVE_BTN.h - 16, REMOVE_BTN.w, REMOVE_BTN.h];
/** the arrow's held positions onto the button (tip, frame coords, for the dialog at its default place): it enters low
 *  right and steps in, the last one on the button's word */
export const REMOVE_PATH: Array<[number, number]> = [[424, 168], [376, 156], [322, 144], [262, 132]];
export const REMOVE_STEPS = REMOVE_PATH.length - 1;
/** the collaborator tag (v5's cursorTagBig, the name alone: episodes' texts.ts cursorTagV3, re-drawn here): '' = empty */
export const cursorTag = (b: Buf, x: number, y: number, name: string, col: number) => {
  const w = (name ? bpw(name) : 40) + 14, h = 20;
  rect(x + 8, y + 12, w + 2, h + 2, b.ink(PAL.N0)); rect(x + 9, y + 13, w, h, b.ink(col));
  if (!name) { rect(x + 11, y + 15, w - 4, h - 4, b.ink(PAL.N1)); return; }
  bpt(b, name, x + 16, y + 16, PAL.N0);
};
export interface RemoveDialogState {
  /** frames since the cut: 0 the bright field alone, 1-2 the dialog opens in two held outline steps, 3+ whole */
  k?: number;
  /** the arrow: an index into REMOVE_PATH, an explicit tip [x, y], or null (none) */
  pointer?: number | [number, number] | null;
  /** the tag's name ('' = the empty tag of S8.03); default 'ALYI' */
  tag?: string;
  click?: boolean;
  /** S8.03: 0 live · 1 the ring gone, the frame broken 1 in 4 · 2 a 50% frame · 3 the word knocked out too */
  grey?: 0 | 1 | 2 | 3;
  field?: 'full' | 'screen';
  /** the dialog's top-left (default REMOVE_DLG) and the refusal's shake */
  at?: [number, number];
  shake?: [number, number];
}
export const drawRemoveDialog = (b: Buf, f: number, st: RemoveDialogState = {}) => {
  const k = st.k ?? 99;
  const [ax, ay] = st.at ?? [REMOVE_DLG.x, REMOVE_DLG.y];
  const [sx, sy] = st.shake ?? [0, 0];
  const x = ax + sx, y = ay + sy, {w, h} = REMOVE_DLG;
  if (st.field !== 'screen') rect(0, 0, 480, RH, b.ink(PAPER)); // the whole frame goes bright: the jolt
  if (k < 1) return;
  if (k < 3) {
    const s = k === 1 ? 0.35 : 0.7, ww = Math.round(w * s), hh = Math.round(h * s), xx = x + Math.round((w - ww) / 2), yy = y + Math.round((h - hh) / 2);
    rect(xx, yy, ww, 1, b.ink(INK)); rect(xx, yy + hh - 1, ww, 1, b.ink(INK)); rect(xx, yy, 1, hh, b.ink(INK)); rect(xx + ww - 1, yy, 1, hh, b.ink(INK));
    return;
  }
  rect(x + 4, y + 4, w, h, b.ink(INK));
  rect(x, y, w, h, b.ink(INK)); rect(x + 1, y + 1, w - 2, h - 2, b.ink(PAPER));
  REMOVE_Q.forEach((l, i) => bigText(b, l, x + Math.round((w - bigTextWidth(l)) / 2), y + 18 + i * 22, INK));
  const [bx, by, bw, bh] = removeButton(x, y);
  const g = st.grey ?? 0;
  const lab = 'Remove', lx = Math.round((bw - textWidth(lab)) / 2);
  const down = !!st.click && g === 0;
  if (down) rect(bx + 1, by + 1, bw - 2, bh - 2, b.ink(INK));
  roundRect(b, bx, by, bw, bh, INK, g === 0 ? 0 : g === 1 ? 1 : 2);
  if (g === 0) for (let t = 2; t <= 3; t++) roundRect(b, bx - t, by - t, bw + t * 2, bh + t * 2, INK); // the default ring
  const tmp = new Buf(bw, 10, 0);
  text(tmp, lab, lx, 0, 1);
  for (let j = 0; j < 10; j++) for (let i = 0; i < bw; i++) {
    if (tmp.c[j * bw + i] !== 1) continue;
    if (g >= 3 && (i & 1) && (j & 1)) continue; // System 7's greyed word: knocked out on a 50% screen
    if (g === 2 && (i & 1) && (j & 1) && ((i + j) & 2)) continue;
    b.set(bx + i, by + 6 + j, down ? PAPER : INK);
  }
  if (st.pointer !== null && st.pointer !== undefined) {
    const idx = typeof st.pointer === 'number';
    const p = idx ? REMOVE_PATH[Math.max(0, Math.min(REMOVE_STEPS, Math.floor(st.pointer as number)))] : (st.pointer as [number, number]);
    const px = p[0] + (idx ? ax - REMOVE_DLG.x : 0), py = p[1] + (idx ? ay - REMOVE_DLG.y : 0);
    drawPointer(b, px, py, !!st.click);
    cursorTag(b, px, py + (st.click ? 1 : 0), st.tag ?? 'ALYI', st.tag === '' ? PAL.N6 : PAL.W5);
  }
  void f;
};

// ================================================================== Neleh's desk from above, 11:52 (v31-S3.00p)
/** S1.03's chair row, as plan4.ts lays it on its tall sheet (PLAN4.CX / FOOT, copied: a shared kit can't import an
 *  episode file); draft 7's GERG plate reads CHAIR */
const PLAN_CX = [48, 96, 144, 192, 240, 288, 336, 384, 432], PLAN_FOOT = 150;
const PLAN_NAMES = ['DIRE', 'NOVIHS', 'DRUH', 'MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET'];
let SHEET0: Buf | null = null;
/** the GFX's first frame (S1.03 k 0: the sheet, the nine chairs seated with their plates; the stamp comes later), inked */
export const planFirstFrame = (): Buf => (SHEET0 ??= (() => {
  const tall = new Buf(480, 330, BPX.navy); bpSheet(tall);
  PLAN_NAMES.forEach((name, i) => {
    const x = PLAN_CX[i];
    bpChair(tall, x, PLAN_FOOT, 'sit', {bolts: i === 7, sticker: i === 2});
    bpText(tall, name, x, PLAN_FOOT + 6, 999, 0, {align: 'center'});
    if (i === 8) bpText(tall, 'VOTE', x, PLAN_FOOT + 15, 999, 0, {align: 'center'});
    if (i === 3) bpText(tall, 'CEO', x, PLAN_FOOT + 15, 999, 0, {align: 'center', col: BPX.hot});
    if (i === 4) bpText(tall, 'CHAIR', x, PLAN_FOOT + 15, 999, 0, {align: 'center', col: BPX.hot});
  });
  const fb = new Buf(480, 270, 0);
  bpComposite(fb, tall);
  return fb;
})());
export interface NelehHighState { clock?: string; framing?: 'desk' | 'paper'; /** the pen: 0 resting, 1 a tick */ pen?: 0 | 1; }
/** the call on her laptop, at 11:52: the chrome and its clock, MADA's tile, three slots waiting */
const earlyCall = (b: Buf, x: number, y: number, w: number, h: number, f: number, clock: string) => {
  rect(x, y, w, h, b.ink(PAL.N1));
  rect(x, y, w, 11, b.ink(PAL.N2)); rect(x, y + 11, w, 1, b.ink(PAL.N0));
  pt(b, 'board sync', x + 5, y + 2, PAL.G5);
  pt(b, clock, x + w - pw(clock) - 5, y + 2, PAL.P2);
  // MADA's tile the left column's full height (room over his head for the spinner), the three waiting stacked right
  const gap = 3, tw = Math.floor((w - gap * 3) / 2), full = h - 12 - gap * 2, th3 = Math.floor((full - gap * 2) / 3);
  for (let i = 0; i < 4; i++) {
    const tx = x + gap + (i === 0 ? 0 : tw + gap), ty = y + 12 + gap + (i === 0 ? 0 : (i - 1) * (th3 + gap));
    const th = i === 0 ? full : th3;
    if (i === 0) {
      drawMadaTile(b, tx, ty, tw, th, MADA_BUST_DEFAULT, {spin: null});
      drawSpinner(b, tx + (tw >> 1) + 1, ty + 10, f, {size: 'md'}); // his spinner, turning, over his head
      rect(tx, ty + th - 9, pw('MADA') + 6, 9, b.ink(PAL.N0)); pt(b, 'MADA', tx + 3, ty + th - 8, PAL.P1);
      continue;
    }
    rect(tx, ty, tw, th, b.ink(PAL.N1));
    for (let q = 0; q < tw; q += 2) { b.set(tx + q, ty, PAL.N4); b.set(tx + q, ty + th - 1, PAL.N4); }
    for (let q = 0; q < th; q += 2) { b.set(tx, ty + q, PAL.N4); b.set(tx + tw - 1, ty + q, PAL.N4); }
    const s = 'waiting…';
    pt(b, s, tx + Math.round((tw - pw(s)) / 2), ty + Math.round(th / 2) - 3, PAL.N6);
  }
};
/** THE PLAN's print at desk scale (its own drawing, not the sheet scaled): the grid, the nine chairs as outlines with
 *  plate ticks (MAS's and GERG's hot), the fold creases */
const planPrint = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    let c: number = i % 6 === 0 || j % 6 === 0 ? BPX.minor : BPX.navy;
    if (i % 30 === 0 || j % 30 === 0) c = BPX.major;
    b.set(x + i, y + j, c);
  }
  const o = (xx: number, yy: number, ww: number, hh: number, col: number) => { rect(xx, yy, ww, 1, b.ink(col)); rect(xx, yy + hh - 1, ww, 1, b.ink(col)); rect(xx, yy, 1, hh, b.ink(col)); rect(xx + ww - 1, yy, 1, hh, b.ink(col)); };
  o(x + 3, y + 3, w - 6, h - 6, BPX.mid);
  const cy = y + 62, pitch = Math.floor((w - 24) / 8);
  for (let i = 0; i < 9; i++) {
    const cx = x + 12 + i * pitch;
    o(cx - 4, cy - 14, 9, 9, BPX.line); rect(cx - 5, cy - 5, 11, 2, b.ink(BPX.line)); rect(cx, cy - 3, 1, 4, b.ink(BPX.line)); rect(cx - 3, cy + 1, 7, 1, b.ink(BPX.line));
    rect(cx - 4, cy + 5, 9, 1, b.ink(i === 3 || i === 4 ? BPX.hot : BPX.mid)); // the plates, as ticks
  }
  // the folds: one crease down the middle, one across (the rest of the plan waits under the fold until noon)
  for (let j = 3; j < h - 3; j++) { b.set(x + (w >> 1), y + j, BPX.shade); b.set(x + (w >> 1) + 1, y + j, BPX.faint); }
  for (let i = 3; i < w - 3; i++) { b.set(x + i, y + Math.round(h * 0.62), BPX.shade); b.set(x + i, y + Math.round(h * 0.62) + 1, BPX.faint); }
};
/** her pen hand from the frame's foot: the navy sleeve, the white cuff, the hand, the pen's nib at (nx, ny) */
const penHand = (b: Buf, nx: number, ny: number, lift: number, sleeveTo: [number, number]) => {
  // the pen: a dark barrel from the nib up-right, its clip lit
  line(nx, ny - lift, nx + 16, ny - 18 - lift, (x, y) => { b.set(x, y, PAL.N0); b.set(x + 1, y, PAL.N2); });
  b.set(nx, ny - lift, PAL.G6); b.set(nx + 12, ny - 14 - lift, PAL.G5);
  // the hand (from above: the back of the hand, the knuckles), the window's light from the left
  const hx = nx + 12, hy = ny - 6 - lift;
  // the cuff and the sleeve to the shoulder (drawn first: the hand lies over the cuff)
  const [ex, ey] = sleeveTo;
  const L = Math.hypot(ex - hx, ey - hy), ux = (ex - hx) / L, uy = (ey - hy) / L;
  for (let t = 8; t < L + 12; t += 0.5) for (let s = -9; s <= 9; s += 0.5) {
    const X = Math.round(hx + ux * t - uy * s), Y = Math.round(hy + uy * t + ux * s);
    if (Y >= RH || Y < 0 || X < 0 || X >= 480) continue;
    const c = t < 13 ? (s < -5 ? PAL.P2 : PAL.P1) : Math.abs(s) > 8.5 ? PAL.N0 : s < -5 ? PAL.N4 : s > 5 ? PAL.N1 : PAL.N2;
    b.set(X, Y, c);
  }
  for (let j = -9; j <= 9; j++) for (let i = -8; i <= 14; i++) {
    const d = Math.hypot(i / 12, j / 8.5);
    if (d > 1) continue;
    b.set(hx + i, hy + j, d > 0.86 ? PAL.S2 : i < -2 ? PAL.S5 : j > 4 ? PAL.S3 : PAL.S4);
  }
  for (const [i, j] of [[-6, -4], [-3, -6], [0, -7], [3, -7]]) b.set(hx + i, hy + j, PAL.S3); // the knuckles
};
/** the paper close: at this scale only her pen's tip and the ends of her fingers are in frame, from the lower right
 *  (a hand here would be a third of the frame): the barrel, its lit edge, the nib's steel; two fingertips on it */
const penClose = (b: Buf, nx: number, ny: number) => {
  const ux = 0.55, uy = 0.84; // down and to the right, off the frame's foot
  for (let t = 0; t < 260; t += 0.5) for (let s = -6; s <= 6; s += 0.5) {
    const w = Math.min(6, 1 + t * 0.35); // the cone to the nib
    if (Math.abs(s) > w) continue;
    const X = Math.round(nx + ux * t - uy * s), Y = Math.round(ny + uy * t + ux * s);
    if (X < 0 || Y < 0 || X >= 480 || Y >= RH) continue;
    b.set(X, Y, t < 10 ? (s < 0 ? PAL.G6 : PAL.G4) : Math.abs(s) > w - 1 ? PAL.N0 : s < -2 ? PAL.N4 : PAL.N2);
  }
  b.set(nx, ny, PAL.P2);
  // her index fingertip on top of the barrel and the thumb's tip below it (skin in the daylight, the nails)
  for (const [cx, cy, rx, ry] of [[Math.round(nx + ux * 34 - 10), Math.round(ny + uy * 34), 22, 14], [Math.round(nx + ux * 56 + 22), Math.round(ny + uy * 56), 20, 13]] as Array<[number, number, number, number]>) {
    for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) {
      const d = Math.hypot(i / rx, j / ry);
      if (d > 1) continue;
      const X = cx + i, Y = cy + j;
      if (Y >= RH) continue;
      b.set(X, Y, d > 0.9 ? PAL.S1 : i + j < -rx * 0.6 ? PAL.S5 : j > ry * 0.4 ? PAL.S3 : PAL.S4);
    }
    for (let j = -4; j <= 4; j++) for (let i = -6; i <= 2; i++) if (Math.hypot(i / 6, j / 4) <= 1) b.set(cx - rx + 8 + i, cy - 2 + j, i < -3 ? PAL.P1 : PAL.S5); // the nail
  }
};
export const drawNelehDeskHigh = (b: Buf, f: number, st: NelehHighState = {}) => {
  const clock = st.clock ?? '11:52';
  if (st.framing === 'paper') {
    b.c.set(planFirstFrame().c.subarray(0, 480 * RH));
    // her pen resting beside her own plate (NELEH, the 7th): the hand in from the lower right
    penClose(b, PLAN_CX[6] + 6, PLAN_FOOT + 20 - (st.pen ? 2 : 0)); // under her own plate, clear of MADA's
    return;
  }
  // her desk from above: pale oak, the blind's daylight from the window at the left in slats across it
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const grain = Math.floor(y * 0.55 + Math.sin(x / 70 + y / 30) * 1.6);
    let c: number = grain % 5 === 0 && hash(x >> 2, y, 3) < 0.7 ? PAL.D3 : PAL.D4;
    const slat = Math.floor((x * 0.5 + y) / 9) % 2 === 0;
    if (x < 250 - y * 0.4 && slat && bayer(x, y) < 0.55) c = stepColor(c, 1);
    b.set(x, y, c);
  }
  // the laptop: its shadow, the base with its keys (toward us), the lid with the call on it
  const lx = 20, ly = 6, lw = 238, lh = 132;
  rect(lx + 5, ly + 5, lw, lh + 60, b.ink(PAL.D1));
  rect(lx, ly + lh + 2, lw, 58, b.ink(PAL.G4)); rect(lx, ly + lh + 2, lw, 1, b.ink(PAL.G6)); rect(lx, ly + lh + 59, lw, 1, b.ink(PAL.G2));
  for (let r = 0; r < 4; r++) for (let c = 0; c < 15; c++) rect(lx + 10 + c * 15, ly + lh + 7 + r * 9, 13, 7, b.ink(PAL.G2));
  rect(lx + 80, ly + lh + 46, 78, 11, b.ink(PAL.G3)); rect(lx + 80, ly + lh + 46, 78, 1, b.ink(PAL.G5));
  rect(lx, ly, lw, lh + 2, b.ink(PAL.G1)); rect(lx, ly, lw, 1, b.ink(PAL.G3));
  earlyCall(b, lx + 5, ly + 5, lw - 10, lh - 8, f, clock);
  // the print, unfolded beside it; her phone face down; the lamp's round foot
  const px = 282, py = 10, pw2 = 186, ph = 134;
  rect(px + 3, py + 3, pw2, ph, b.ink(PAL.D1));
  planPrint(b, px, py, pw2, ph);
  rect(270, 156, 18, 32, b.ink(PAL.D1)); rect(268, 154, 18, 32, b.ink(PAL.N1)); rect(268, 154, 18, 1, b.ink(PAL.G4));
  ellipse(452, 176, 20, 16, b.ink(PAL.D1)); ellipse(450, 174, 18, 14, b.ink(PAL.G2)); ellipse(450, 174, 7, 5, b.ink(PAL.G4));
  // NELEH leaning over it from the frame's foot: the footnotes' back half, her shoulders, her arm, her crown, the front half
  const hcx = 380, hcy = 176;
  const orbit = {cx: hcx, cy: hcy - 4, rx: 34, ry: 9, tilt: -6, size: 'sm' as const};
  drawFootnotes(b, orbit, f, 'back', {style: 'slips'});
  for (let y = 150; y < RH; y++) for (let x = 290; x < 480; x++) {
    const d = Math.hypot((x - hcx) / 80, (y - (hcy + 30)) / 40);
    if (d > 1) continue;
    b.set(x, y, d > 0.95 ? PAL.N0 : x < hcx - 40 ? PAL.N4 : x > hcx + 44 ? PAL.N1 : PAL.N2);
  }
  const pitch = Math.floor((pw2 - 24) / 8), nx = px + 12 + 6 * pitch - 6, ny = py + 62 + 30;
  penHand(b, nx, ny, st.pen ? 2 : 0, [hcx - 50, hcy + 22]);
  for (let y = hcy - 26; y < RH; y++) for (let x = hcx - 26; x <= hcx + 26; x++) {
    const d = Math.hypot((x - hcx) / 25, (y - hcy) / 24);
    if (d > 1) continue;
    const part = Math.abs(x - hcx) < 1 && y < hcy + 6; // the centre part, running from her crown toward the desk
    const strand = (x * 3 + (y >> 2)) % 7 === 0;
    let c: number = d > 0.9 ? PAL.B0 : x < hcx - 12 ? PAL.B3 : x > hcx + 12 ? PAL.B1 : PAL.B2;
    if (strand && d < 0.9) c = stepColor(c, x < hcx ? 1 : -1);
    if (part) c = PAL.S3;
    b.set(x, y, c);
  }
  drawFootnotes(b, orbit, f, 'front', {style: 'slips'});
};

// ================================================================== Tuesday's invite (v31-S7.03b)
export const TUESDAY = {title: 'Board · Tue 10:00 PM', header: 'invitation', accept: 'Accept', decline: 'Decline'};
/** the MACROSOFT badge at the GUEST card's size (64 x 42): slate card, its header band, the name, a blank photo, a
 *  barcode, the slot punch; its strap lying loose to the left (macrosoft-badge.ts's slate, at insert scale) */
export const macrosoftInsert = (b: Buf, x: number, y: number) => {
  const W = 64, H = 42, strap = [PAL.N5, PAL.N6, PAL.N7];
  for (let i = 0; i < 26; i++) { const sx = x - 24 + i, sy = y + 18 + Math.round(Math.sin(i / 5) * 4); rect(sx, sy, 1, 3, b.ink(strap[1])); b.set(sx, sy, strap[2]); b.set(sx, sy + 3, PAL.N2); }
  rect(x - 5, y + 16, 7, 6, b.ink(PAL.G4)); rect(x - 5, y + 16, 7, 1, b.ink(PAL.G6));
  rect(x + 1, y + 1, W, H, b.ink(PAL.N0));
  rect(x, y, W, H, b.ink(PAL.N7)); rect(x + W - 1, y, 1, H, b.ink(PAL.N6)); rect(x, y + H - 1, W, 1, b.ink(PAL.N5));
  rect(x + W / 2 - 6, y + 2, 12, 2, b.ink(PAL.N2));
  rect(x, y + 5, W, 7, b.ink(PAL.N5)); rect(x, y + 5, W, 1, b.ink(PAL.N8));
  text(b, 'MACROSOFT', x + Math.round((W - textWidth('MACROSOFT')) / 2), y + 16, PAL.P2);
  rect(x + 4, y + 29, 7, 9, b.ink(PAL.N5));
  for (let i = 0; i < 44; i++) if (hash(i, 1, 78) < 0.62) rect(x + 15 + i, y + 32, 1, 6, b.ink(PAL.N3));
};
/** the three circles: a loading spinner, a fire helmet (the new chair's), a blank (r 6, the cold open's attendee style) */
const attendee3 = (b: Buf, cx: number, cy: number, kind: 0 | 1 | 2, f: number) => {
  ellipse(cx, cy, 7, 7, b.ink(PAL.G4)); ellipse(cx, cy, 6, 6, b.ink(PAL.N2));
  if (kind === 0) {
    const s = Math.floor(f / 3) % 8;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; b.set(Math.round(cx + Math.cos(a) * 4), Math.round(cy + Math.sin(a) * 4), i === s ? PAL.P2 : (i + 1) % 8 === s ? PAL.G5 : PAL.G3); }
  } else if (kind === 1) {
    // the fire helmet in profile: the dome, its crest, the long back brim, the badge
    for (let j = -4; j <= 0; j++) for (let i = -4; i <= 3; i++) if (Math.hypot(i / 4, (j + 0.5) / 4) <= 1) b.set(cx + i, cy + j, j < -2 ? PAL.R3 : PAL.R2);
    rect(cx - 5, cy + 1, 11, 1, b.ink(PAL.R1)); rect(cx + 3, cy + 2, 3, 1, b.ink(PAL.R1));
    rect(cx - 1, cy - 5, 2, 1, b.ink(PAL.R3)); b.set(cx - 3, cy - 2, PAL.W6); b.set(cx - 3, cy - 1, PAL.W5);
  }
};
const tuesdayCard = (b: Buf, x: number, y: number, press: boolean, accepted: boolean, f: number): [number, number] => {
  const w = 150, h = 92;
  const body = accepted ? PAL.C8 : PAL.P2, rule = accepted ? PAL.C6 : PAL.G5, ink = PAL.N1;
  rect(x + 1, y + h, w - 2, 2, b.ink(PAL.N0));
  rect(x, y + 1, w, h - 2, b.ink(body)); rect(x + 1, y, w - 2, h, b.ink(body));
  rect(x + 6, y + 6, 11, 11, b.ink(PAL.G4)); rect(x + 7, y + 7, 9, 9, b.ink(PAL.P1)); rect(x + 7, y + 7, 9, 3, b.ink(accepted ? PAL.C4 : PAL.R2));
  b.set(x + 9, y + 5, PAL.N2); b.set(x + 13, y + 5, PAL.N2);
  for (const [i, j] of [[9, 12], [11, 12], [13, 12], [9, 14], [11, 14]]) b.set(x + i, y + j, PAL.G4);
  text(b, TUESDAY.header, x + 22, y + 8, PAL.G4);
  text(b, TUESDAY.title, x + 8, y + 24, ink);
  rect(x + 8, y + 34, w - 16, 1, b.ink(rule));
  ([0, 1, 2] as const).forEach((kd, i) => attendee3(b, x + 16 + i * 18, y + 45, kd, f));
  const by = y + h - 24, bw = 60, bh = 15, ax = x + 8, dx = x + w - 8 - bw;
  const accCol = accepted ? PAL.C4 : press ? PAL.C3 : PAL.C5;
  rect(ax, by, bw, bh, b.ink(accCol)); rect(ax, by, bw, 1, b.ink(stepColor(accCol, 1)));
  const al = accepted ? 'Accepted' : TUESDAY.accept;
  text(b, al, ax + Math.round((bw - textWidth(al)) / 2), by + 4, PAL.N0);
  if (!accepted) { rect(dx, by, bw, 1, b.ink(PAL.G4)); rect(dx, by + bh - 1, bw, 1, b.ink(PAL.G4)); rect(dx, by, 1, bh, b.ink(PAL.G4)); rect(dx + bw - 1, by, 1, bh, b.ink(PAL.G4)); text(b, TUESDAY.decline, dx + Math.round((bw - textWidth(TUESDAY.decline)) / 2), by + 4, PAL.G3); }
  else text(b, '✓', ax + bw + 8, by + 4, PAL.C3);
  return [ax + (bw >> 1), by + (bh >> 1)];
};
export interface TuesdayInviteState { k?: number; thumb?: 'none' | 'tap'; press?: boolean; accepted?: boolean; }
export const drawTuesdayInvite = (b: Buf, f: number, st: TuesdayInviteState = {}) => {
  const k = st.k ?? 99, on = k >= 1, acc = !!st.accepted;
  // his end desk: S7.01's wood (D2 with the D4 lit edge), the grain across
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const g = Math.floor(y * 0.4 + Math.sin(x / 55) * 1.3);
    b.set(x, y, g % 4 === 0 && hash(x >> 3, y, 9) < 0.6 ? PAL.D1 : bayer(x, y) < 0.18 ? PAL.D3 : PAL.D2);
  }
  // the phone's glow on the wood when lit
  if (on) for (let y = 0; y < RH; y++) for (let x = 120; x < 400; x++) { const d = Math.hypot((x - 262) / 140, (y - 100) / 120); if (d < 1 && bayer(x, y) < (1 - d) * 0.7) b.set(x, y, stepColor(b.get(x, y), d < 0.6 ? 2 : 1)); }
  // the two badges beside it, square to each other: GUEST (its strap off the top) and MACROSOFT (its strap to the left)
  guestBadge(b, 60, 44, 'insert', {strap: true});
  macrosoftInsert(b, 60, 118);
  // his phone, face up, from above (the cold open's drawing: kits/phone-invite.ts drawInviteInsert's phone)
  const px = 172, py = 8, pw2 = 180;
  rect(px + 4, py + 4, pw2, RH, b.ink(PAL.D1));
  rect(px, py, pw2, RH, b.ink(PAL.N0)); rect(px + 1, py + 1, pw2 - 2, RH, b.ink(PAL.N1)); rect(px + pw2 / 2 - 12, py + 4, 24, 3, b.ink(PAL.N0));
  const sx = px + 8, sy = py + 12, sw = pw2 - 16;
  for (let y = sy; y < RH; y++) for (let x = sx; x < sx + sw; x++) {
    if (!on) { b.set(x, y, (x - sx + (y - sy)) % 60 < 2 ? PAL.N2 : PAL.N0); continue; }
    const t = (y - sy) / 190 + (bayer(x, y) - 0.5) * 0.2;
    b.set(x, y, acc ? (t < 0.4 ? PAL.C3 : PAL.C2) : t < 0.3 ? PAL.N4 : t < 0.7 ? PAL.N3 : PAL.N2);
  }
  if (!on) return;
  const slide = k < 2 ? -999 : k === 2 ? -60 : k === 3 ? -24 : k === 4 ? -4 : 0;
  if (slide <= -999) return;
  const tmp = new Buf(480, RH, 0x1000000);
  const acceptAt = tuesdayCard(tmp, sx + Math.round((sw - 150) / 2), sy + 14 + slide, !!st.press, acc, f);
  for (let y = sy; y < RH; y++) for (let x = sx; x < sx + sw; x++) { const v = tmp.c[y * 480 + x]; if (v !== 0x1000000) b.set(x, y, v); }
  if (st.thumb === 'tap') thumbTap(b, acceptAt[0], acceptAt[1]);
};
/** his thumb, straight down on the button (the ECU's scale: a phone ~7 cm wide is 180 px, so the thumb is ~50 px
 *  across): the back of the thumb and its nail from above, in from the lower right, the rest of the hand off frame;
 *  its shadow on the screen beside it. (tx, ty) = the pad's point on the button */
const thumbTap = (b: Buf, tx: number, ty: number) => {
  const ux = 0.5, uy = 0.866, r = 21, L = 170;
  const ax = tx + ux * r * 0.7, ay = ty + uy * r * 0.7; // the tip's round end's centre
  // the shadow first, a little right and below (the light from the windows at the upper left)
  for (let y = Math.floor(ty - 4); y < RH; y++) for (let x = Math.floor(tx - 30); x < 480; x++) {
    const px = x - ax - 6, py = y - ay - 3, t = Math.max(0, Math.min(L, px * ux + py * uy)), d = Math.hypot(px - ux * t, py - uy * t);
    if (d < r + 2) b.set(x, y, stepColor(b.get(x, y), -2));
  }
  for (let y = Math.floor(ty - r); y < RH; y++) for (let x = Math.floor(tx - r - 4); x < 480; x++) {
    const px = x - ax, py = y - ay, t = px * ux + py * uy;
    const tc = Math.max(0, Math.min(L, t)), qx = px - ux * tc, qy = py - uy * tc, d = Math.hypot(qx, qy);
    if (d > r) continue;
    const side = qx * uy - qy * ux; // across the thumb: negative = the upper-left (lit) side
    let c: number = d > r - 1.2 ? PAL.S1 : side < -r * 0.45 ? PAL.S5 : side > r * 0.55 ? PAL.S2 : side > r * 0.2 ? PAL.S3 : PAL.S4;
    // the knuckle's creases, two short arcs across the back
    if (Math.abs(t - r * 3.1) < 0.7 && Math.abs(side) < r * 0.6) c = PAL.S2;
    if (Math.abs(t - r * 3.5) < 0.7 && Math.abs(side) < r * 0.4) c = PAL.S2;
    // the nail near the tip
    const nt = t - r * 0.2, nd = Math.hypot(nt / (r * 0.95), side / (r * 0.62));
    if (nd <= 1) c = nd > 0.86 ? PAL.S2 : side < -r * 0.2 && nt < r * 0.2 ? PAL.P2 : nt > r * 0.55 ? PAL.S5 : PAL.P1;
    b.set(x, y, c);
  }
};

// ================================================================== Sunday: the ticker, the phones in a row (S4.09)
export const PHONES_ROW = ['STAFF', 'STAFF', 'INVESTORS', 'INVESTORS'];
export const PHONE_ROW = {w: 76, h: 22, gap: 8};
/** the phones set in a row on the table, face up, seen from Neleh's standing height (foreshortened slabs: the rounded
 *  body, the bezel, the speaker slot), each screen lit with its caller and the call's two round buttons (answer,
 *  decline); `buzz` = the frame: one at a time buzzes (a 1 px shake, the tick marks), in turn */
export const drawPhonesRow = (b: Buf, x0: number, y: number, st: {labels?: string[]; buzz?: number | null} = {}) => {
  const labels = st.labels ?? PHONES_ROW;
  const {w, h, gap} = PHONE_ROW;
  const who = st.buzz === null || st.buzz === undefined ? -1 : Math.floor(st.buzz / 8) % labels.length;
  labels.forEach((l, i) => {
    const on = i === who, dx = on ? (Math.floor(st.buzz ?? 0) % 2 ? 1 : -1) : 0;
    const x = x0 + i * (w + gap) + dx;
    rect(x + 2, y + h, w - 2, 2, b.ink(PAL.N0)); // its shadow on the table
    rect(x + 1, y, w - 2, h, b.ink(PAL.N0)); rect(x, y + 1, w, h - 2, b.ink(PAL.N0)); // the body, its rounded corners
    rect(x + 2, y + 1, w - 4, 1, b.ink(PAL.G3)); // the lit far edge
    rect(x + 3, y + 3, w - 6, h - 6, b.ink(PAL.N2)); // the screen
    for (let j = 0; j < h - 6; j++) for (let q = 0; q < w - 6; q++) if (bayer(x + q, y + j) < 0.25 - j * 0.02) b.set(x + 3 + q, y + 3 + j, PAL.N3);
    rect(x + (w >> 1) - 5, y + 1, 10, 1, b.ink(PAL.G1)); // the speaker slot
    pt(b, l, x + Math.round((w - pw(l)) / 2), y + 4, PAL.P2);
    ellipse(x + 14, y + h - 6, 2, 2, b.ink(PAL.L3)); ellipse(x + w - 15, y + h - 6, 2, 2, b.ink(PAL.R3)); // answer · decline
    if (on) for (const sd of [-1, 1]) { const ex = sd < 0 ? x - 3 : x + w + 2; b.set(ex, y + 5, PAL.G5); b.set(ex + sd, y + 10, PAL.G5); b.set(ex, y + 15, PAL.G5); }
  });
};
export const TICKER_SUNDAY = 'INVESTORS PUSH TO BRING MANALT BACK';
/** a news ticker strip w wide at (x, y), 12 tall: the LIVE block, the words crawling in from the right (`k` = frames:
 *  2 px a frame, whole px), held once the line is in */
export const drawTicker = (b: Buf, x: number, y: number, w: number, s: string = TICKER_SUNDAY, k = 999) => {
  rect(x, y, w, 12, b.ink(PAL.N0)); rect(x, y, w, 1, b.ink(PAL.R2));
  const lw = pw('LIVE') + 8;
  rect(x, y + 1, lw, 11, b.ink(PAL.R1)); pt(b, 'LIVE', x + 4, y + 3, PAL.P2);
  const tw = pw(s), home = x + lw + 6, start = x + w;
  const X = Math.max(home, start - Math.floor(Math.max(0, k)) * 2);
  const tmp = new Buf(tw + 2, 10, 0x1000000); pt(tmp, s, 0, 0, PAL.P2);
  for (let j = 0; j < 10; j++) for (let i = 0; i < tw; i++) { const c = tmp.c[j * tmp.w + i], XX = X + i; if (c !== 0x1000000 && XX < x + w - 1 && XX >= home) b.set(XX, y + 2 + j, c); }
};
export interface SundayOTSState {
  /** the feed (FEED_W x FEED_H, kits/lobby-feed drawLobbyFeed), drawn by the caller */
  feed?: Buf | null;
  alyi?: {mouth?: Viseme} | null;
  neleh?: Partial<NelehOtsState>;
  /** the ticker's crawl (frames since it starts; null = no ticker) */
  ticker?: number | null;
  buzz?: number | null;
}
export const drawSundayOTS = (b: Buf, f: number, st: SundayOTSState = {}) => {
  drawBoardScreenOTS(b, f, {feed: st.feed ?? null, alyi: st.alyi === null ? null : {mouth: st.alyi?.mouth ?? 'rest'}, neleh: null});
  const F = BSCREEN.ots.feed;
  // the ticker: the broadcaster's strip across the screen under the CCTV tile (wider than the tile, so the line fits)
  const Gl = BSCREEN.ots.glass;
  if (st.ticker !== null) drawTicker(b, Gl.x + 4, F.y + F.h - 28, Gl.w - 8, TICKER_SUNDAY, st.ticker ?? 999);
  // the table's near edge across the frame's foot, in front of the screen's bezel; the phones in a row on it
  const ty = 176;
  for (let y = ty; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === ty ? PAL.D3 : bayer(x, y) < 0.2 - (y - ty) * 0.006 ? PAL.D2 : PAL.D1);
  drawPhonesRow(b, 22, ty + 3, {buzz: st.buzz ?? null});
  drawNelehShoulderR(b, 494, RH, {...NELEH_OTS_DEFAULT, light: 'screen', ...st.neleh}, f);
};

// ================================================================== Alyi in the boardroom's dark window (S4.02)
export const drawAlyiGlass = (b: Buf, f: number, st: {mouth?: Viseme; eyes?: 'open' | 'closed'} = {}) => {
  // the glass at night: the dark, the Valley's lights far below in the lower third, a mullion off to the left
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number = bayer(x, y) < 0.12 - y * 0.0004 ? PAL.N2 : PAL.N1;
    if (y > 156 && hash(x >> 1, y >> 1, 81) < 0.035 + (y - 156) * 0.0008) c = hash(x >> 1, y >> 1, 82) < 0.55 ? PAL.W4 : PAL.C3; // below his chin: his face sits on dark glass
    b.set(x, y, c);
  }
  // the phones' lit screens reflected beside him (the table behind the camera): four soft slabs, no letters
  [[330, 150], [362, 154], [396, 158], [432, 162]].forEach(([x, y], i) => {
    const col = PAL.C2;
    for (let j = 0; j < 7; j++) for (let q = 0; q < 26; q++) if (((q + j) & 1) === 0 || (j > 1 && j < 5 && q > 2 && q < 23)) b.set(x + q, y + j, col);
    rect(x + 5, y + 3, 16, 1, b.ink(stepColor(col, 2)));
  });
  // ALYI's reflection, not turning: mirrored, cool, the glass showing through its faintest rung
  const im = alyiReflection({mouth: st.mouth ?? 'rest', eyes: st.eyes ?? 'open', t: f, mirror: true});
  const X = 196, Y = RH - im.h;
  for (let j = 0; j < im.h; j++) for (let i = 0; i < im.w; i++) { const v = im.c[j * im.w + i]; if (v >= 0) b.set(X + i, Y + j, v); }
  // the glass's sheen (two thin streaks, fixed to the glass), the mullion, the sill catching the room's light
  for (let j = 0; j < RH; j++) for (let i = 0; i < 480; i++) { const u = i + j * 0.55; if (((u > 300 && u < 302) || (u > 316 && u < 317)) && bayer(i, j) < 0.5) b.set(i, j, stepColor(b.get(i, j), 1)); }
  rect(92, 0, 6, RH, b.ink(PAL.N0)); rect(97, 0, 1, RH, b.ink(PAL.N3));
  rect(0, RH - 5, 480, 5, b.ink(PAL.N2)); rect(0, RH - 5, 480, 1, b.ink(PAL.N4));
};

// ================================================================== he calls Gerg (S5.09)
export interface CallOutState { phase?: 'app' | 'click' | 'ring'; /** frames into the ring */ k?: number; }
/** the call app's handset glyphs (never a dash in a circle: that reads as "remove"): 'call' tilted, 'end' level */
const HANDSET: Record<'call' | 'end', string[]> = {
  call: ['##.....', '###....', '.##....', '..##...', '...##..', '....###', '.....##'],
  end: ['.#######.', '##.....##', '##.....##'],
};
const handset = (b: Buf, cx: number, cy: number, kind: 'call' | 'end', col: number) => {
  const g = HANDSET[kind], w = g[0].length, h = g.length;
  g.forEach((r, j) => { for (let i = 0; i < w; i++) if (r[i] === '#') b.set(cx - (w >> 1) + i, cy - (h >> 1) + j, col); });
};
export const callOutPainter = (st: CallOutState = {}): Painter => (scr, f) => {
  const W = scr.w, H = scr.h, mini = isMini(scr), phase = st.phase ?? 'ring';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, x % 8 === 0 && y % 8 === 0 ? PAL.N2 : PAL.N0);
  if (mini) { // the plate's small monitor: GERG's green circle and the pulse
    const cx = W >> 1, cy = H >> 1;
    ellipse(cx, cy, 8, 8, scr.ink(PAL.L1)); ellipse(cx, cy, 6, 6, scr.ink(PAL.L0)); scr.set(cx, cy, PAL.L3);
    if (phase === 'ring' && Math.floor((st.k ?? f) / 6) % 2 === 0) for (let a = 0; a < 48; a += 2) { const ang = (a / 48) * Math.PI * 2; scr.set(Math.round(cx + Math.cos(ang) * 11), Math.round(cy + Math.sin(ang) * 11), PAL.L2); }
    return;
  }
  if (phase === 'app' || phase === 'click') {
    // the call app: its bar, the contacts, GERG on top (a green circle: his laptop's glow), the ended meeting under him
    rect(0, 0, W, 14, scr.ink(PAL.N2)); pt(scr, 'calls', 8, 3, PAL.G5);
    const rowY = [28, 62];
    const rows: Array<{name: string; sub: string; col: number; ink: number}> = [
      {name: 'GERG', sub: 'mobile', col: PAL.L1, ink: PAL.P2},
      {name: 'board sync', sub: 'ended · Fri 12:00', col: PAL.G2, ink: PAL.G4},
    ];
    rows.forEach((r, i) => {
      const y = rowY[i], lit = i === 0 && phase === 'click';
      rect(10, y - 4, W - 20, 30, scr.ink(lit ? PAL.L0 : PAL.N1));
      if (lit) rect(10, y - 4, 2, 30, scr.ink(PAL.L3));
      ellipse(30, y + 11, 11, 11, scr.ink(r.col)); ellipse(30, y + 11, 9, 9, scr.ink(stepColor(r.col, -1)));
      if (i === 0) bigText(scr, 'G', 26, y + 5, PAL.L3);
      pt(scr, r.name, 50, y + 3, r.ink); pt(scr, r.sub, 50, y + 14, PAL.G4);
      if (i === 0) { ellipse(W - 30, y + 11, 8, 8, scr.ink(lit ? PAL.L3 : PAL.L2)); handset(scr, W - 30, y + 11, 'call', PAL.N0); }
    });
    return;
  }
  // outgoing: GERG's circle in the middle, the ring's pulses stepping out on 6s, `Calling…`, the end button
  const cx = W >> 1, cy = Math.round(H * 0.4), r = 24;
  const p = Math.floor((st.k ?? f) / 6) % 3;
  for (const rr of [r + 8 + p * 7, r + 29 + p * 7]) for (let a = 0; a < 120; a++) { const ang = (a / 120) * Math.PI * 2; if (a % 3 === 0) scr.set(Math.round(cx + Math.cos(ang) * rr), Math.round(cy + Math.sin(ang) * rr), rr > r + 40 ? PAL.L1 : PAL.L2); }
  ellipse(cx, cy, r, r, scr.ink(PAL.L1)); ellipse(cx, cy, r - 3, r - 3, scr.ink(PAL.L0));
  bigText(scr, 'G', cx - 4, cy - 7, PAL.L3);
  pt(scr, 'GERG', cx - (pw('GERG') >> 1), cy + r + 10, PAL.P2);
  const c = 'Calling…';
  pt(scr, c, cx - (pw(c) >> 1), cy + r + 22, PAL.G5);
  ellipse(cx, H - 20, 10, 8, scr.ink(PAL.R2)); handset(scr, cx, H - 20, 'end', PAL.P2);
};
/** v5's corner tile (64 x 38 at x, y), outgoing: GERG and `Calling…`, the ring's pulse on 6s */
export const drawCallOutTile = (b: Buf, x: number, y: number, k: number) => {
  rect(x - 1, y - 1, 66, 40, b.ink(PAL.N0)); rect(x, y, 64, 38, b.ink(PAL.L0));
  pt(b, 'GERG', x + 4, y + 14, PAL.L3); pt(b, 'Calling…', x + 4, y + 25, PAL.L2);
  if (Math.floor(k / 6) % 2 === 0) for (const d of [2, 3]) { rect(x - d, y - d, 64 + 2 * d, 1, b.ink(PAL.L3)); rect(x - d, y + 37 + d, 64 + 2 * d, 1, b.ink(PAL.L3)); rect(x - d, y - d, 1, 38 + 2 * d, b.ink(PAL.L3)); rect(x + 63 + d, y - d, 1, 38 + 2 * d, b.ink(PAL.L3)); }
};

// ================================================================== Terb's dry squeeze (S7.06)
export const drawDrySqueeze = (b: Buf, footX: number, footY: number, st: {k?: number; flip?: boolean; light?: 'room' | 'fire'} = {}) => {
  const kick = (st.k ?? 0) === 1 ? 1 : 0; // the dry click: he jumps a pixel, nothing comes out
  drawTerbRoom(b, footX, footY - kick, {...TERB_ROOM_DEFAULT, arm: 'spray', pin: true, light: st.light ?? 'fire'}, {flip: st.flip});
};

/** S7.07-cont: Terb writing Mas's one term onto the sheet, not looking up (cast/terb-sheet's 'sheet' arm, reading): a pen
 *  in his near hand over the sheet (7 x 8 at room scale) and the new line's ink growing across its foot, `k` 0..4
 *  whole-pixel steps; the extinguisher stays in the far hand (the pin is out by now) */
export const drawTerbWriting = (b: Buf, footX: number, footY: number, k: number, o: {flip?: boolean; mouth?: 'rest' | 'open'} = {}) => {
  drawTerbSheetRoom(b, footX, footY, {...TERB_SHEET_DEFAULT, arm: 'sheet', read: true, pin: false, mouth: o.mouth ?? 'rest', light: 'fire'}, {flip: o.flip});
  // the sheet's local origin (terb-sheet: the stamp at 31, 26), mirrored when flipped
  const X = (lx: number) => (o.flip ? footX + (TERB_W - 1 - TERB_FOOT[0]) - lx : footX - TERB_FOOT[0] + lx), Y = (ly: number) => footY - TERB_FOOT[1] + ly;
  const n = Math.max(0, Math.min(4, Math.floor(k)));
  for (let i = 0; i < n; i++) b.set(X(32 + i), Y(32), PAL.N1); // the new line, written
  const px = 32 + n, py = 32;
  b.set(X(px), Y(py), PAL.N0); b.set(X(px + 1), Y(py - 1), PAL.N0); b.set(X(px + 2), Y(py - 2), PAL.N2); // the pen, its nib on the line
  b.set(X(px + 2), Y(py - 1), PAL.S4); b.set(X(px + 3), Y(py - 1), PAL.S3); // his fingers on it
};

// ================================================================== the letter's header strip on the avalanche's first tile (S6.01)
export const LETTER_HEADER = 'STAFF LETTER · TO THE BOARD';
export const letterHeaderStrip = (b: Buf, x: number, y: number, w: number) => {
  rect(x, y, w, 9, b.ink(PAL.P2)); rect(x, y + 9, w, 1, b.ink(PAL.N0));
  const s = tinyWidth(LETTER_HEADER) <= w - 4 ? LETTER_HEADER : 'STAFF LETTER';
  tiny(b, s, x + 2, y + 2, PAL.N1);
};
