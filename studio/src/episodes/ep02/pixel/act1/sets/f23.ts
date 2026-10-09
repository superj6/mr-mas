// MR. MAS — Ep2 v1 · act1 · sc 4's F2.3, FEB 20, 2018, NopeAI's first office by day (the shots pass, 2026-10-09). The
// room is the art pass's (art/sets/office2018.ts office2018feb: Ep1's first office in the T3 cut-paper memory tier),
// COPIED here with the beats the shots need as parameters (Nole's silent mouth mid-speech and his hand on the slide,
// the rows turning back one by one, his climb up the ladder rung by rung, the hatch, Mas's sip); the insert and the
// look back are the art's, imported. Plus the cut-paper sweep that carries the glass into 2018 and back.
//   office18(b, f, st)     [W] 4.28-4.30
//   paperize(b, x0, x1)    the T3 tier over a column range (three tones per ramp, the paper's grain); `sweepEdge`
//                          the cut paper's moving front (a lit edge and its shadow)
import {Buf, line, ellipse, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {arena} from '../../../../ep01/pixel/act1/art/v35';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {noleImg, NOLE_BASE, NOLE_FOOT} from '../../../../../shared/pixel/cast/nole';
import type {NolePose} from '../../../../../shared/pixel/cast/nole';
import {fill, pt, bpt, bpw, tiny, tinyWidth, paper, paperSprite, grain, post3, warmSkin} from '../../art/kit';
import {seatedStaff, staffChair} from '../../art/cast/civic2';
import {drawMasStand2} from '../../art/cast/mas2';
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
  // Nole's slide on its stand: ALSET · AI
  paper(b, (t) => {
    fill(t, 262, 30, 84, 56, PAL.G3); fill(t, 265, 33, 78, 50, PAL.P2);
    bpt(t, 'ALSET', 304 - Math.round(bpw('ALSET') / 2), 42, PAL.R1); pt(t, '·  AI', 290, 64, PAL.N2);
    fill(t, 302, 86, 4, FLOOR - 86, PAL.G2); fill(t, 290, FLOOR - 2, 28, 2, PAL.G2);
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
  /** how many rows' staffers have turned back to their monitors (each step three staffers, front row first) */
  turned?: number;
  /** Nole: at the slide (mid-speech: his mouth on 4s; or finished, his hand still on the slide), on the ladder (rung
   *  0..9, his legs stepping), or gone up the hatch */
  nole?: {at: 'slide'; mouth: 0 | 1 | 2; arm: NolePose['arm']} | {at: 'ladder'; rung: number} | {at: 'gone'};
  hatch?: 0 | 1 | 2;
  mas?: Mas2Arm;
  /** Alyi at his desk at the right (front), facing Nole; turned back to his monitor once the room turns (`alyiDesk`) */
  alyiDesk?: boolean;
}
/** [W] 4.28-4.30 the all-hands: Nole at the front by his slide, the rows facing him; nobody applauds; one by one the
 *  staff turn back to their monitors (`turned`); Gerg in the second row, typing; Mas at the back with his glass */
export const office18 = (b: Buf, f: number, st: Office18 = {}) => {
  b.c.set(roomDay().c.subarray(0, W * RH), 0);
  const h = st.hatch ?? 0;
  paper(b, (t) => { fill(t, 352, 8, 40, 4, PAL.G3); if (h < 2) fill(t, 356, 9, 32 - h * 14, 3, PAL.N1); });
  arena(b, 58, 106, 34, 20, f, 3);
  const n = st.nole ?? {at: 'slide', mouth: 1, arm: 'point'};
  const noleX = n.at === 'slide' ? 248 : -999;
  const turned = st.turned ?? 0;
  paperSprite(b, (t) => {
    let k = 0;
    for (const [ry, cnt, x0] of [[150, 7, 140], [168, 8, 120], [186, 8, 100]] as Array<[number, number, number]>) for (let i = 0; i < cnt; i++, k++) {
      const x = x0 + i * 24;
      if (Math.abs(x + 12 - noleX) < 22 && ry > 160) continue;
      // the order they turn: a staggered sweep through the rows (never all at once)
      const order = (k * 7) % 23;
      const tn = order < turned * 3;
      staffChair(t, x, ry - 30, [PAL.G2, PAL.G3, PAL.G4]);
      if (tn) { fill(t, x - 9, ry - 16, 12, 2, PAL.D3); fill(t, x - 7, ry - 27, 9, 8, PAL.N1); fill(t, x - 6, ry - 26, 7, 6, PAL.C5); fill(t, x - 3, ry - 19, 2, 3, PAL.N1); }
      blitImg(t, seatedStaff({seed: k * 5 + 2, pose: tn ? 'type' : 'watch'}), x, ry - 30, {flip: tn});
    }
  });
  if (n.at === 'slide') paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: n.arm, mouth: n.mouth}), 248 - NOLE_FOOT[0], 186 - NOLE_FOOT[1], {map: warmSkin}), {keepSkin: true});
  if (n.at === 'ladder') { const r = Math.max(0, Math.min(9, n.rung)); paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: 'raise', legs: r % 2 ? 'w1' : 'w3'}), 372 - NOLE_FOOT[0], 140 - r * 11 - NOLE_FOOT[1], {map: warmSkin, clip: (_x, y) => y > 11}), {keepSkin: true}); }
  paperSprite(b, (t) => drawGergStand(t, 334, 176, {legs: 'stand', type: Math.floor(f / 4) % 2 ? 1 : 2, look: 'screen', mouth: 'rest', light: 'room'}));
  // ALYI at his desk at the front right, by the rack: a person in the room, listening, then back to his own monitor
  paper(b, (t) => { fill(t, 398, 160, 46, 3, PAL.D2); fill(t, 400, 163, 2, 26, PAL.N1); fill(t, 440, 163, 2, 26, PAL.N1); fill(t, 418, 138, 22, 16, PAL.N1); fill(t, 420, 140, 18, 12, PAL.C5); fill(t, 426, 154, 6, 6, PAL.N1); });
  paperSprite(b, (t) => drawAlyiRoom2(t, 410, 192, {arm: 'down', light: 'room'}, {flip: !!st.alyiDesk}), {keepSkin: true});
  paperSprite(b, (t) => drawMasStand2(t, 30, 190, {arm: st.mas ?? 'glass'}));
  grain(b, 0, 0, 480, RH, (x, y) => x >= 58 && x < 92 && y >= 106 && y < 126);
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

/** [2S] 4.32 across the room: ALYI in the foreground at the right, lit, warm, a person, cropped by his monitor's edge
 *  (his rule), turning from it to look back at MAS at the back; Mas small at the back left with his glass, which he
 *  lifts an inch; between them the room, a rung soft, the staff at their monitors (T3 cut paper throughout).
 *  turn 0 = to his monitor, 1 = on the way, 2 = looking back, smiling */
export const alyiLooksBack = (b: Buf, f: number, st: {turn?: 0 | 1 | 2; lift?: boolean} = {}) => {
  office18(b, f, {nole: {at: 'gone'}, turned: 8, hatch: 2, mas: st.lift ? 'glassUp' : 'glass', alyiDesk: true});
  // the room a rung soft behind him (his desk is near us); keep Mas at the back as he is (the look's other end)
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) if (!(x >= 14 && x < 48 && y >= 108 && y < 194)) b.set(x, y, stepColor(b.get(x, y), -1));
  // his room figure is the near one now: the wide's sprite of him goes under his bust (we're at his desk)
  const turn = st.turn ?? 2;
  const img = alyiWarm({mood: turn === 2 ? 'smile' : 'calm', mouth: 'rest', arm: 'none', light: 'day'});
  paperSprite(b, (t) => putBust(t, img, 286, 40, {flip: turn === 0}), {rim: PAL.W6, side: 1, keepSkin: true});
  // on the way round (1): his head a few pixels toward us between the two drawings
  // his monitor's edge, close in the foreground, cropping him at the right (its bezel, its screen's cool light)
  paper(b, (t) => { fill(t, 386, 14, 94, 189, PAL.N1); fill(t, 386, 14, 4, 189, PAL.G3); fill(t, 392, 26, 88, 124, PAL.C3); for (let r = 0; r < 6; r++) fill(t, 400, 40 + r * 14, 60 - (r * 13) % 30, 3, PAL.C5); }, 2);
  grain(b, 0, 0, 480, RH, (x, y) => x >= 392 && y >= 26 && y < 150);
};
