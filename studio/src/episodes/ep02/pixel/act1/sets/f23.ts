// MR. MAS — Ep2 v1 · act1 · sc 4's F2.3, FEB 20, 2018, NopeAI's first office by day (the shots pass, 2026-10-09). The
// room is the art pass's (art/sets/office2018.ts office2018feb: Ep1's first office in the T3 cut-paper memory tier),
// COPIED here with the beats the shots need as parameters (Nole's silent mouth mid-speech and his hand on the slide,
// the rows turning back one by one, his climb up the ladder rung by rung, the hatch, Mas's sip); the insert and the
// look back are the art's, imported. Plus the cut-paper sweep that carries the glass into 2018 and back.
//   office18(b, f, st)     [W] 4.28-4.30
//   paperize(b, x0, x1)    the T3 tier over a column range (three tones per ramp, the paper's grain); `sweepEdge`
//                          the cut paper's moving front (a lit edge and its shadow)
import {Buf, line, ellipse, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
import {arena} from '../../../../ep01/pixel/act1/art/v35';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {noleImg, NOLE_BASE, NOLE_FOOT} from '../../../../../shared/pixel/cast/nole';
import type {NolePose} from '../../../../../shared/pixel/cast/nole';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, paper, paperSprite, grain, post3, warmSkin} from '../../art/kit';
import {seatedStaff} from '../../art/cast/civic2';
import {drawMasStand2, MAS2_FOOT} from '../../art/cast/mas2';
import type {Mas2Arm} from '../../art/cast/mas2';
import {RH, W} from './common';

export {arenaInsert} from '../../art/sets/office2018';
import {alyiWarm} from '../../art/cast/alyi2';
import {drawAlyiRoom2} from '../../art/cast/alyi2';
import {putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';

const FLOOR = 150;
const brick = (x: number, y: number) => { const row = Math.floor(y / 6), off = row % 2 ? 9 : 0; const mortar = y % 6 === 5 || (x + off) % 18 === 17; return mortar ? PAL.P0 : hash(Math.floor((x + off) / 18), row, 41) < 0.2 ? PAL.P0 : PAL.P1; };
let ROOM: Buf | null = null;
/** the room by day (art office2018 roomDay, slide, ladder: drawn once) */
const roomDay = () => {
  if (ROOM) return ROOM;
  const b = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y < 10 ? PAL.G4 : y < FLOOR ? brick(x, y) : (y - FLOOR) % 9 === 0 ? PAL.D3 : PAL.D4);
  paper(b, (t) => { fill(t, 0, 4, 480, 3, PAL.G5); fill(t, 0, 38, 480, 2, PAL.G4); for (const x of [60, 200, 330, 450]) fill(t, x, 0, 3, 10, PAL.G5); });
  paper(b, (t) => {
    const Wn = {x0: 14, x1: 132, y0: 44, y1: 112};
    fill(t, Wn.x0 - 3, Wn.y0 - 3, Wn.x1 - Wn.x0 + 6, Wn.y1 - Wn.y0 + 6, PAL.G2);
    for (let y = Wn.y0; y < Wn.y1; y++) for (let x = Wn.x0; x < Wn.x1; x++) t.set(x, y, y < Wn.y0 + 30 ? (bayer(x, y) < 0.3 ? PAL.C7 : PAL.C8) : PAL.C7);
    for (const [bx, top, bw] of [[14, 84, 22], [36, 72, 16], [52, 90, 26], [78, 66, 14], [92, 80, 26], [118, 74, 14]] as Array<[number, number, number]>) fill(t, bx, top, bw, Wn.y1 - top, PAL.G6);
    for (let x = Wn.x0; x < Wn.x1; x += 30) fill(t, x, Wn.y0, 3, Wn.y1 - Wn.y0, PAL.G2);
    fill(t, Wn.x0, Wn.y0 + 34, Wn.x1 - Wn.x0, 3, PAL.G2);
  });
  paper(b, (t) => {
    const rx = 428;
    fill(t, rx, 50, 42, FLOOR - 50, PAL.G2); fill(t, rx, 50, 42, 2, PAL.G4); fill(t, rx + 40, 50, 2, FLOOR - 50, PAL.G1);
    for (let u = 0; u < 12; u++) { const yy = 60 + u * 7; fill(t, rx + 3, yy, 36, 5, PAL.G1); for (let q = 0; q < 6; q++) fill(t, rx + 5 + q * 5, yy + 2, 3, 1, PAL.G3); }
    fill(t, rx + 3, 53, 36, 7, PAL.N1); tiny(t, 'INVIDIA', rx + 21 - (tinyWidth('INVIDIA') >> 1), 54, PAL.G6);
  });
  paper(b, (t) => {
    const x0 = 150, y0 = 48;
    fill(t, x0 - 3, y0 - 3, 96, 64, PAL.G4); fill(t, x0, y0, 90, 58, PAL.P2);
    bpt(t, 'AGI', x0 + 86 - bpw('AGI') - 4, y0 + 6, PAL.I0);
    const arrows: Array<[number, number]> = [[x0 + 8, y0 + 12], [x0 + 8, y0 + 28], [x0 + 8, y0 + 44]];
    arrows.forEach(([ax, ay]) => { line(ax, ay, ax + 40, ay - Math.round((ay - y0 - 14) * 0.3), t.ink(PAL.I0)); line(ax + 40, ay - Math.round((ay - y0 - 14) * 0.3), ax + 36, ay - 3 - Math.round((ay - y0 - 14) * 0.3), t.ink(PAL.I0)); line(ax + 14, ay - 4, ax + 26, ay + 4, t.ink(PAL.R2)); line(ax + 14, ay + 4, ax + 26, ay - 4, t.ink(PAL.R2)); });
    fill(t, x0 + 4, y0 + 58, 30, 3, PAL.G3);
  });
  // Nole's slide on its easel, low enough that his hand rests on it as he talks: ALSET · AI
  paper(b, (t) => {
    fill(t, 266, 66, 84, 56, PAL.G3); fill(t, 269, 69, 78, 50, PAL.P2);
    bpt(t, 'ALSET', 308 - Math.round(bpw('ALSET') / 2), 78, PAL.R1); pt(t, '·  AI', 294, 100, PAL.N2);
    fill(t, 306, 122, 4, FLOOR - 122, PAL.G2); fill(t, 294, FLOOR - 2, 28, 2, PAL.G2);
  });
  // the ladder to the ceiling hatch
  paper(b, (t) => { line(360, FLOOR, 366, 12, t.ink(PAL.G5)); line(384, FLOOR, 378, 12, t.ink(PAL.G5)); for (let r = 0; r < 12; r++) fill(t, 362 + Math.round(r * 0.5), FLOOR - 10 - r * 11, 20 - r, 1, PAL.G4); });
  // the one monitor with the arena on it, on a desk, a Go stone beside it
  paper(b, (t) => { fill(t, 40, 128, 70, 3, PAL.D2); fill(t, 44, 131, 2, 19, PAL.N1); fill(t, 104, 131, 2, 19, PAL.N1); fill(t, 56, 104, 38, 24, PAL.N1); fill(t, 72, 128, 6, 2, PAL.N1); });
  paper(b, (t) => { ellipse(100, 126, 3, 2, t.ink(PAL.N0)); t.set(99, 125, PAL.G4); });
  ROOM = b;
  return b;
};
export interface Office18 {
  /** how many of the staff have turned back to their monitors (0..STAFF.length, in the staggered order) */
  turned?: number;
  /** Nole: at the slide (mid-speech: his mouth on 4s; or finished, his hand still on the slide), on the ladder (rung
   *  0..9, his legs stepping), or gone up the hatch */
  nole?: {at: 'slide'; mouth: 0 | 1 | 2; arm: NolePose['arm']} | {at: 'ladder'; rung: number} | {at: 'gone'};
  hatch?: 0 | 1 | 2;
  mas?: Mas2Arm;
  /** Alyi at his desk at the right (front): facing Nole (false), or turned back to his own monitor (true) */
  alyiDesk?: boolean;
}
/** the all-hands' seats (foot x, foot y), back row first: each staffer at a desk with a monitor on the side away from
 *  Nole, the chair swivelled round toward him; `order` = when each one turns back (a staggered sweep, never all at
 *  once) */
const STAFF: Array<{x: number; y: number; order: number}> = (() => {
  const rows: Array<[number, number[]]> = [[150, [112, 146, 180, 214]], [168, [96, 130, 164, 198]], [186, [80, 114, 148, 182, 216]]];
  const out: Array<{x: number; y: number; order: number}> = [];
  let k = 0;
  for (const [y, xs] of rows) for (const x of xs) out.push({x, y, order: (k++ * 5) % 13});
  return out;
})();
export const STAFF_N = STAFF.length;
/** an office chair for a seated staffer (civic2 staffChair's), its back behind them: mirrored when they face left */
const chair = (t: Buf, x: number, y: number, left: boolean) => {
  const C = [PAL.G2, PAL.G3, PAL.G4];
  const bx = left ? x + 19 : x + 2;
  fill(t, bx, y + 12, 5, 17, C[1]); fill(t, bx, y + 12, 5, 1, C[2]); fill(t, left ? bx + 4 : bx, y + 12, 1, 17, C[0]);
  fill(t, x + (left ? 6 : 3), y + 29, 17, 3, C[1]); fill(t, x + (left ? 6 : 3), y + 29, 17, 1, C[2]);
  fill(t, x + (left ? 14 : 10), y + 32, 2, 3, PAL.G3);
  fill(t, x + (left ? 8 : 4), y + 35, 14, 1, PAL.G2);
};
/** a staffer's desk beside them (on their left): its top, a leg, the monitor in three-quarter (its back and side to
 *  us, the screen's lit edge toward the chair) and the keyboard */
const desk = (t: Buf, x: number, y: number) => {
  const dx = x - 13;
  // the top at the sitter's hands' height, a leg; the monitor on its stand; the keyboard at the edge by the chair
  fill(t, dx, y - 10, 16, 2, PAL.D3); fill(t, dx, y - 10, 16, 1, PAL.D4); fill(t, dx + 1, y - 8, 2, 8, PAL.D2);
  fill(t, dx + 1, y - 23, 9, 9, PAL.N1); fill(t, dx + 8, y - 22, 3, 7, PAL.C5); t.set(dx + 10, y - 22, PAL.C7);
  fill(t, dx + 4, y - 14, 3, 4, PAL.N1); fill(t, dx + 10, y - 11, 5, 1, PAL.G4);
};
/** [W] 4.28-4.30 the all-hands: Nole at the front by his slide (his hand on it), the staff swivelled round in their
 *  chairs toward him, their monitors on behind them; nobody applauds; one by one they swivel back to their monitors
 *  (`turned`); Gerg typing; Alyi at his desk; Mas at the back with his glass of water */
export const office18 = (b: Buf, f: number, st: Office18 = {}) => {
  b.c.set(roomDay().c.subarray(0, W * RH), 0);
  const h = st.hatch ?? 0;
  paper(b, (t) => { fill(t, 352, 8, 40, 4, PAL.G3); if (h < 2) fill(t, 356, 9, 32 - h * 14, 3, PAL.N1); });
  arena(b, 58, 106, 34, 20, f, 3);
  const n = st.nole ?? {at: 'slide', mouth: 1, arm: 'point'};
  const turned = st.turned ?? 0;
  paperSprite(b, (t) => {
    STAFF.forEach((p, k) => {
      const back = p.order < turned;
      desk(t, p.x, p.y);
      // facing Nole (screen-right) until they turn back to the monitor on their left
      chair(t, p.x, p.y - 30, back);
      blitImg(t, seatedStaff({seed: k * 5 + 2, pose: back ? 'hold' : 'watch'}), p.x, p.y - 30, {flip: back});
    });
  });
  // Nole faces his slide, his hand on it (the point lands on the slide's lower left)
  if (n.at === 'slide') paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: n.arm, mouth: n.mouth}), 250 - (68 - 1 - NOLE_FOOT[0]), 186 - NOLE_FOOT[1], {map: warmSkin, flip: true}), {keepSkin: true});
  if (n.at === 'ladder') { const r = Math.max(0, Math.min(9, n.rung)); paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: 'raise', legs: r % 2 ? 'w1' : 'w3'}), 372 - NOLE_FOOT[0], 140 - r * 11 - NOLE_FOOT[1], {map: warmSkin, clip: (_x, y) => y > 11}), {keepSkin: true}); }
  paperSprite(b, (t) => drawGergStand(t, 334, 176, {legs: 'stand', type: Math.floor(f / 4) % 2 ? 1 : 2, look: 'screen', mouth: 'rest', light: 'room'}));
  // ALYI at his desk at the front right, by the rack: a person in the room, turned to Nole, then back to his monitor
  paper(b, (t) => { fill(t, 398, 160, 46, 3, PAL.D2); fill(t, 400, 163, 2, 26, PAL.N1); fill(t, 440, 163, 2, 26, PAL.N1); fill(t, 418, 138, 22, 16, PAL.N1); fill(t, 420, 140, 18, 12, PAL.C5); fill(t, 426, 154, 6, 6, PAL.N1); });
  paperSprite(b, (t) => drawAlyiRoom2(t, 410, 192, {arm: 'down', light: 'room'}, {flip: !st.alyiDesk}), {keepSkin: true});
  paperSprite(b, (t) => { drawMasStand2(t, 30, 190, {arm: st.mas ?? 'glass'}); waterGlass(t, 30, 190); });
  grain(b, 0, 0, 480, RH, (x, y) => x >= 58 && x < 92 && y >= 106 && y < 126);
};
/** his glass is WATER (Nole: "you sat at the back with your glass of water"): the art rig's tumbler carries an amber
 *  drink, so in his hand's box (the sprite's x 24..38, y 6..32 from its top left: below his hair, whose top rung is
 *  the only other warm colour on him) the drink becomes a pale, cool fill with a highlight at its top left */
const waterGlass = (t: Buf, footX: number, footY: number) => {
  const x0 = footX - MAS2_FOOT[0], y0 = footY - MAS2_FOOT[1];
  let top = -1;
  for (let y = y0 + 6; y <= y0 + 32; y++) for (let x = x0 + 24; x <= x0 + 38; x++) {
    const c = t.get(x, y), fm = familyOf(c);
    if (!fm || fm[0] !== 'W') continue;
    if (top < 0) top = y;
    t.set(x, y, y === top ? PAL.C8 : PAL.C7);
  }
  if (top >= 0) for (let x = x0 + 24; x <= x0 + 38; x++) if (t.get(x, top) === PAL.C8) { t.set(x, top, PAL.P2); break; }
};
/** the T3 cut-paper tier over the columns [x0, x1): every ramp flattened to three tones, the paper's grain */
export const paperize = (b: Buf, x0: number, x1: number) => {
  for (let y = 0; y < RH; y++) for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) b.set(x, y, post3(b.get(x, y)));
  grain(b, Math.max(0, x0), 0, Math.min(W, x1), RH);
};
/** the moving front of the cut paper: a lit edge, a soft shadow on the side still to come */
export const sweepEdge = (b: Buf, x: number) => {
  for (let y = 0; y < RH; y++) { const xx = x + Math.round(Math.sin(y / 9) * 3); b.set(xx, y, PAL.P2); b.set(xx + 1, y, PAL.P1); for (let s = 2; s < 6; s++) if (bayer(xx + s, y) < 0.6 - s * 0.1) b.set(xx + s, y, stepColor(b.get(xx + s, y), -2)); }
};

/** Alyi's face for the look back (the alyi2 bust's open warm eyes, re-stamped): `look` the eyes OPEN on Mas (whites,
 *  the irises turned screen-left toward him, a glint) with a soft open smile (the lips parted on the teeth, the corners
 *  up); `crinkle` the warmth reaching the eyes AFTER they've met his (the lower lids pushed up by the cheeks, a crease
 *  at the outer corner; the eyes still open) */
const alyiLook = (stage: 'calm' | 'look' | 'crinkle'): Img => {
  const base = alyiWarm({mood: 'calm', mouth: stage === 'calm' ? 'rest' : 'E', arm: 'none', light: 'day'});
  if (stage === 'calm') return base;
  const c = new Int32Array(base.c), Wd = base.w;
  const set = (x: number, y: number, v: number) => { if (x >= 0 && y >= 0 && x < Wd && y < base.h && c[y * Wd + x] >= 0) c[y * Wd + x] = v; };
  const skinAt = (x: number, y: number) => c[y * Wd + x];
  // (the eyes themselves are drawn over the paper tier: alyiEyes; the cut paper's three tones flattened them to slits)
  // the smile: the mouth's corners lifted, the cheek's lit bump beside the near corner
  set(38, 72, PAL.S1); set(37, 71, PAL.S1); set(49, 72, PAL.S1); set(50, 71, PAL.S1);
  for (let x = 51; x <= 55; x++) set(x, 64, stepColor(skinAt(x, 64), 1));
  return {w: base.w, h: base.h, c};
};
/** his eyes, drawn over the cut paper at the bust's place (x, y): open, the whites clear, the irises turned screen-left
 *  toward Mas, a glint in each; `crinkle` the lower lids lifted a pixel by the cheeks and a crease at the outer corner
 *  (the eyes still open) */
const alyiEyes = (b: Buf, x: number, y: number, crinkle: boolean) => {
  const P0: Record<string, number> = {L: PAL.N0, w: PAL.P2, I: PAL.B1, g: PAL.W9, k: PAL.S3, u: PAL.S4, c: PAL.S2};
  const st = (sx: number, sy: number, rows: string[]) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const v = P0[r[i]]; if (v !== undefined) b.set(x + sx + i, y + sy + j, v); } });
  st(49, 45, ['..LLLLLLL..', '.LwIgIwwwL.', '.wwIIIwww..', crinkle ? '..uuuuuu.c.' : '..kkkkkk...']);
  st(37, 46, ['.LLLLL', 'LwIgw.', 'wwIIw.', crinkle ? '.uuu..' : '.kkk..']);
  if (crinkle) { b.set(x + 60, y + 46, PAL.S2); b.set(x + 61, y + 47, PAL.S2); }
};
/** [2S] 4.32 across the room: ALYI in the foreground at the right, lit, warm, a person, cropped by his monitor's edge
 *  (his rule), turning from it to look back at MAS at the back; Mas small at the back left with his glass, which he
 *  lifts an inch; between them the room, a rung soft, the staff at their monitors (T3 cut paper throughout).
 *  turn 0 = to his monitor, 1 = on the way, 2 = looking back: his eyes open on Mas, a soft open smile; `crinkle` the
 *  warmth reaching his eyes once they've met */
export const alyiLooksBack = (b: Buf, f: number, st: {turn?: 0 | 1 | 2; lift?: boolean; crinkle?: boolean} = {}) => {
  office18(b, f, {nole: {at: 'gone'}, turned: STAFF_N, hatch: 2, mas: st.lift ? 'glassUp' : 'glass', alyiDesk: true});
  // the room a rung soft behind him (his desk is near us); keep Mas at the back as he is (the look's other end)
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) if (!(x >= 14 && x < 48 && y >= 108 && y < 194)) b.set(x, y, stepColor(b.get(x, y), -1));
  // his room figure is the near one now: the wide's sprite of him goes under his bust (we're at his desk)
  const turn = st.turn ?? 2;
  const img = alyiLook(turn < 2 ? 'calm' : st.crinkle ? 'crinkle' : 'look');
  paperSprite(b, (t) => putBust(t, img, 286, 40, {flip: turn === 0}), {rim: PAL.W6, side: 1, keepSkin: true});
  if (turn === 2) alyiEyes(b, 286, 40, !!st.crinkle);
  // his monitor's edge, close in the foreground, cropping him at the right (its bezel, its screen's cool light)
  paper(b, (t) => { fill(t, 386, 14, 94, 189, PAL.N1); fill(t, 386, 14, 4, 189, PAL.G3); fill(t, 392, 26, 88, 124, PAL.C3); for (let r = 0; r < 6; r++) fill(t, 400, 40 + r * 14, 60 - (r * 13) % 30, 3, PAL.C5); }, 2);
  grain(b, 0, 0, 480, RH, (x, y) => x >= 392 && y >= 26 && y < 150);
};

// ================================================================== SET-04, Move 37 (art/sets/office2018 move37, copied)
/** 4.19 and 4.22: the Go board in cut paper, the stone, its label; behind it the wall of knobs. Copied from the art so
 *  the concept's second half reads at 1080p: the stream of tiny boards runs ABOVE the Go board into the wall (never
 *  across its edge); the human games are kaya-yellow boards with a little face over each; on "Then it played
 *  itself" the program's own games are a different thing: dark boards with a cyan border, two stones on each (the
 *  board's own motif), no face, and the knobs they land on light cyan */
export interface Move37St { stone?: 0 | 1 | 2; stream?: 'human' | 'self' | 'frozen' | 'none'; label?: boolean }
const STONES: Array<[number, number, 0 | 1]> = [[3, 3, 0], [15, 3, 1], [3, 15, 1], [15, 15, 0], [16, 4, 0], [13, 2, 1], [2, 13, 0], [5, 2, 1], [16, 13, 1], [14, 16, 0], [9, 9, 1], [10, 3, 0], [4, 9, 1], [15, 9, 0], [12, 15, 1]];
export const move37 = (b: Buf, f: number, st: Move37St = {}) => {
  const s = {stone: 2 as 0 | 1 | 2, stream: 'human' as Move37St['stream'], label: true, ...st};
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, PAL.F1);
  const tick = s.stream === 'frozen' || s.stream === 'none' ? 0 : Math.floor(f / 2);
  const self = s.stream === 'self';
  paper(b, (t) => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 26; c++) {
      const kx = 196 + c * 11, ky = 12 + r * 11;
      ellipse(kx, ky, 4, 4, t.ink(PAL.F3)); ellipse(kx, ky, 3, 3, t.ink(PAL.F4));
      const a = hash(c, r, 5) * Math.PI * 2 + (s.stream === 'frozen' ? 0.6 : tick * 0.18 * (hash(c, r, 6) > 0.5 ? 1 : -1));
      line(kx, ky, kx + Math.round(Math.cos(a) * 3), ky + Math.round(Math.sin(a) * 3), t.ink(PAL.C7));
    }
  }, 1);
  const gx = 40, gy = 30, cell = 8;
  paper(b, (t) => {
    fill(t, gx - 8, gy - 8, cell * 18 + 16, cell * 18 + 16, PAL.W5);
    for (let i = 0; i < 19; i++) { fill(t, gx + i * cell, gy, 1, cell * 18 + 1, PAL.D2); fill(t, gx, gy + i * cell, cell * 18 + 1, 1, PAL.D2); }
    for (const [sx, sy] of [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9], [3, 15], [9, 15], [15, 15]]) fill(t, gx + sx * cell - 1, gy + sy * cell - 1, 3, 3, PAL.D1);
  }, 2);
  const stoneAt = (sx: number, sy: number, white: 0 | 1, dy = 0) => paper(b, (t) => { const cx = gx + sx * cell, cy = gy + sy * cell + dy; ellipse(cx, cy, 3.6, 3.6, t.ink(white ? PAL.P2 : PAL.N1)); t.set(cx - 1, cy - 2, white ? PAL.W9 : PAL.G3); }, 1);
  STONES.forEach(([sx, sy, w]) => stoneAt(sx, sy, w));
  if (s.stone) stoneAt(4, 10, 0, s.stone === 1 ? -3 : 0);
  // the stream: in from frame left along the top, ABOVE the board (its top edge at y 22), then down into the wall;
  // each board, as it arrives, lights the knob it lands on
  if (s.stream === 'human' || self) for (let k = 0; k < 22; k++) {
    const ph = ((f * 5 + k * 29) % 300) / 300;
    const bx = Math.round(-12 + ph * 300), lane = 2 + (k % 2) * 6;
    const by = bx < 196 ? lane : Math.round(lane + (bx - 196) * 0.95);
    if (bx > 200) { const kc = Math.min(25, Math.round((bx - 196) / 11)), kr = Math.min(8, Math.max(0, Math.round((by - 12) / 11))); ellipse(196 + kc * 11, 12 + kr * 11, 4, 4, b.ink(self ? PAL.C8 : PAL.W7)); continue; }
    if (self) {
      // the program's own game: a dark board, a cyan border, its grid, a black and a white stone (the board's motif)
      fill(b, bx - 1, by - 1, 11, 11, PAL.C6); fill(b, bx, by, 9, 9, PAL.N2);
      for (let i = 1; i < 9; i += 3) { fill(b, bx + i, by, 1, 9, PAL.C3); fill(b, bx, by + i, 9, 1, PAL.C3); }
      fill(b, bx + 1, by + 1, 3, 3, PAL.N0); b.set(bx + 1, by + 1, PAL.G4); fill(b, bx + 5, by + 5, 3, 3, PAL.P2); b.set(bx + 5, by + 5, PAL.W9);
    } else {
      fill(b, bx, by, 9, 9, PAL.W5); for (let i = 0; i < 9; i += 2) { fill(b, bx + i, by, 1, 9, PAL.D2); fill(b, bx, by + i, 9, 1, PAL.D2); }
      b.set(bx + 2, by + 2, PAL.N0); b.set(bx + 6, by + 4, PAL.P2); b.set(bx + 4, by + 6, PAL.N0);
      // a person's game: a little face over the board
      fill(b, bx + 10, by + 2, 3, 3, PAL.S4); fill(b, bx + 10, by + 2, 3, 1, PAL.B2);
    }
  }
  if (s.label && s.stone === 2) {
    const L = 'MAR 2016 · GAME 2 · MOVE 37';
    paper(b, (t) => { fill(t, 30, 186, pw(L) + 12, 14, PAL.P2); pt(t, L, 36, 189, PAL.N1); });
    line(gx + 4 * cell + 4, gy + 10 * cell + 4, 60, 186, b.ink(PAL.P2));
  }
  grain(b);
};
