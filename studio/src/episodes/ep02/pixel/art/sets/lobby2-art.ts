// MR. MAS — Ep2 v1 art: SET-01's inserts and stills (the lobby master is sets/lobby2.ts).
//   complaintPageECU(b, page)   [ECU] sc 1.10 / 23.02: page one, all exclamation points; the contents `! .... 1` …;
//                               the refiled one's pages `!!`, `!`, `.` (page 0..2, refiled)
//   docketECU(b)                [ECU] sc 20.08, full frame: the complaint as a side table, cups on it, its docket tab
//                               HEARING · JUN 12 · MOTION TO DISMISS legible (1.5 s read)
//   signFromBelow(b, k, o)      [LOW] -> [MCU] sc 1.12: the sign from below, DOT's spare 0 held out; then the second
//                               sign DAYS SINCE SOMEONE SUED MAS: 0 hung under it
//   flyerECU(b, o)              [ECU] sc 1.13 / 13.03: the flyer's doorway photo (on the complaint; upside down, taped)
import {Buf, rect, line} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {drawMasStand} from '../../../../../shared/pixel/cast/mas-stand';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {drawOrb} from '../../../../../shared/pixel/cast/orb-medium';
import {fill, pt, pw, bpt, bpw, vramp, tiny, dith} from '../kit';
import {drawLobby2, drawSignBoard, drawFlyer, drawComplaint, LOBBY2} from './lobby2';
import {drawMammoth, mammothPrint, meltChair} from '../creatures';
import {drawSelbeepRoom} from '../cast/selbeep';
import {drawDotLadder, dotPlateOut} from '../cast/dot';
import {drawHarasRoom, drawCalcTape} from '../cast/haras';
import {drawMasStand2} from '../cast/mas2';
import type {ArtAsset} from '../asset';

/** the paper of a page filling the frame (a slight fold shadow, the grain) */
const pageBg = (b: Buf, tone = PAL.P2) => { fill(b, 0, 0, 480, 203, tone); for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) if (((x * 7 + y * 13) % 97) === 0) b.set(x, y, PAL.P1); fill(b, 0, 196, 480, 7, PAL.P0); };
export const complaintPageECU = (b: Buf, page: 0 | 1 | 2 = 0, refiled = false) => {
  pageBg(b);
  if (refiled) {
    const marks = ['!!', '!', '.'][page];
    bpt(b, `PAGE ${page + 1}`, 40, 24, PAL.G4);
    bpt(b, marks, 240 - Math.round(bpw(marks) / 2), 90, PAL.N1);
    return;
  }
  if (page === 0) {
    // page one: exclamation points, all of it
    for (let r = 0; r < 9; r++) { const row = '! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !'.slice(0, 26 + (r % 3) * 6); pt(b, row, 40, 22 + r * 18, PAL.N1); }
  } else {
    bpt(b, 'CONTENTS', 40, 22, PAL.N1);
    const rows = [['!', '1'], ['!!', '2'], ['!!!', '3']];
    rows.forEach(([a, n], i) => { const y = 66 + i * 34; bpt(b, a, 60, y, PAL.N1); for (let x = 60 + bpw(a) + 10; x < 380; x += 8) fill(b, x, y + 10, 2, 2, PAL.G4); bpt(b, n, 400, y, PAL.N1); });
  }
};
export const docketECU = (b: Buf) => {
  // the carpet, the complaint's cover at a low angle filling the frame, two coffee cups on it, the yellow docket tab
  vramp(b, 0, 0, 480, 203, [PAL.R0, PAL.R1, PAL.R0]);
  fill(b, 30, 70, 400, 110, PAL.P1); fill(b, 30, 60, 400, 12, PAL.P2); fill(b, 30, 60, 400, 1, PAL.W9); fill(b, 30, 172, 400, 8, PAL.P0);
  for (let i = 0; i < 400; i += 3) fill(b, 30 + i, 176, 1, 4, PAL.G5);
  bpt(b, 'NOLE v. MANALT ET AL.', 52, 84, PAL.N1); fill(b, 52, 104, 300, 2, PAL.N2);
  // the cups (with their rings on the cover)
  for (const cx of [300, 360]) { fill(b, cx, 28, 30, 44, PAL.P2); fill(b, cx, 40, 30, 10, PAL.C4); fill(b, cx + 27, 28, 3, 44, PAL.P0); fill(b, cx + 4, 24, 22, 4, PAL.D3); for (let i = 0; i < 30; i++) b.set(cx + i, 74, PAL.D4); }
  // the docket tab: yellow, sticking out of the side, its words held for reading
  fill(b, 300, 118, 176, 60, PAL.W7); fill(b, 300, 118, 176, 2, PAL.W8); fill(b, 300, 176, 176, 2, PAL.W5);
  pt(b, 'HEARING · JUN 12', 312, 128, PAL.N1); pt(b, 'MOTION TO', 312, 146, PAL.N1); pt(b, 'DISMISS', 312, 160, PAL.N1);
};
export const signFromBelow = (b: Buf, k: number, o: {second?: boolean} = {}) => {
  // [LOW]: the sign high over us, foreshortened; DOT's hand from the ladder at frame right holds the spare 0 out
  vramp(b, 0, 0, 480, 203, [PAL.G2, PAL.G3, PAL.G4]);
  for (let y = 0; y < 203; y += 12) fill(b, 0, y, 480, 1, PAL.G2);
  drawSignBoard(b, 90, 20, 330, 120, ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'], '100');
  if (o.second) drawSignBoard(b, 140, 128, 280, 160, ['DAYS SINCE', 'SOMEONE', 'SUED MAS:'], '0', {small: true});
  else dotPlateOut(b, 400, 150 + (k % 2));
};
export const flyerECU = (b: Buf, o: {upside?: boolean; on?: 'complaint' | 'pillar'} = {}) => {
  if (o.on === 'pillar') { fill(b, 0, 0, 480, 203, PAL.N1); for (let y = 6; y < 203; y += 12) { fill(b, 0, y, 480, 1, PAL.N0); for (let x = 20; x < 480; x += 40) b.set(x, y + 4, (x + y) % 3 ? PAL.C6 : PAL.L3); } }
  else { pageBg(b, PAL.P1); bpt(b, '!  !  !  !  !  !  !  !', 20, 170, PAL.G4); }
  drawFlyer(b, 192, 20 - (o.upside ? 0 : 0), {scale: 4, upside: o.upside, curl: true});
};

// ------------------------------------------------------------------ the stills
const arosPlate = (b: Buf, r: {x: number; y: number; w: number; h: number}) => {
  // the 2.A leap's layer goes here (near-photoreal, objects only); the review still shows the snowy meadow plate
  vramp(b, r.x, r.y, r.w, Math.round(r.h * 0.55), [PAL.N6, PAL.N7, PAL.N8, PAL.G6]);
  vramp(b, r.x, r.y + Math.round(r.h * 0.55), r.w, r.h - Math.round(r.h * 0.55), [PAL.P1, PAL.P2, PAL.W9]);
  for (let i = 0; i < 9; i++) dith(b, r.x + 6 + i * 11, r.y + 40 + (i % 3) * 2, 6, 14, 0.5, PAL.N5);
  drawMammoth(b, r.x + 30, r.y + r.h - 6, 0, {clip: (x, y) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h});
};
const keynotePlate = (b: Buf, r: {x: number; y: number; w: number; h: number}) => {
  vramp(b, r.x, r.y, r.w, r.h, [PAL.N7, PAL.G5, PAL.G6]);
  fill(b, r.x + 10, r.y + r.h - 30, r.w - 20, 3, PAL.P2);
  fill(b, r.x + (r.w >> 1) - 3, r.y + r.h - 50, 6, 20, PAL.N1);
  const s = '...AND LATER THIS YEAR:'; tiny(b, s, r.x + 6, r.y + 10, PAL.N1); tiny(b, 'CHATGTP.', r.x + 6, r.y + 18, PAL.N1);
};
export const ART: ArtAsset[] = [{
  id: 'set01-lobby', manifest: 'SET-01 · the NopeAI lobby master', kind: 'set', name: 'The NopeAI lobby, side-on (the Ep2 master)',
  file: 'sets/lobby2.ts (+ sets/lobby2-art.ts)', exports: 'drawLobby2, LOBBY2, drawSignBoard, drawFlyer, drawComplaint, drawHandTruck, drawCleanRect, drawConfetti, drawPresserSmall', scenes: '1, 13, 19, 20',
  note: 'Ep1\'s narthex from the side: Mas\'s counter under the signs (back left), the desk, the wall screen (right), the doors far right; beanbag rows',
  stills: [
    {label: 'sc 1, FEB 15: AROS on the wall screen (the 2.A leap layer goes in the bezel), the staff on beanbags, Mas at his counter, SELBEEP', draw: (b) => {
      drawLobby2(b, {f: 0, sign1: '86', screen: arosPlate}, {
        back: (bb) => { drawMasStand(bb, 28, 152, {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}); },
        front: (bb) => { drawSelbeepRoom(bb, 330, 196, {arm: 'present', mouth: 'open'}); },
      });
    }},
    {label: 'sc 1, FEB 29: the mammoth out on the carpet (its prints), the chair melted, the hand truck at the doors, DOT up the ladder, PAUSE through the door', draw: (b) => {
      drawLobby2(b, {f: 6, sign1: '100', sign2: '0', complaint: 'truck', truckX: 400, door: 2, ladder: true}, {
        back: (bb) => { drawMasStand(bb, 28, 152, {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}); drawDotLadder(bb, 134, 150, 'grip', 1); },
        floor: (bb) => { for (const [px, py] of [[300, 186], [270, 182], [240, 186]] as Array<[number, number]>) mammothPrint(bb, px, py); meltChair(bb, 196, 192, 3); drawMammoth(bb, 150, 196, 9); },
      });
    }},
    {label: 'sc 13, MAY 15: February\'s flyers curling, Mas\'s taped back upside down, the complaint a side table (cups), the corner TV\'s presser', draw: (b) => {
      drawLobby2(b, {f: 0, sign1: '176', sign2: '76', flyers: 'curl', upside: true, complaint: 'table', tv: 'presser', beanbags: false}, {
        back: (bb) => { drawMasStand2(bb, 142, 152, {arm: 'tape'}); },
      });
    }},
    {label: 'sc 19, JUN 10: the watch party: ELPPA\'s keynote on the wall screen, signs 202 / 102, the tusk behind the back row, the confetti cannon', draw: (b) => {
      drawLobby2(b, {f: 4, sign1: '202', sign2: '102', flyers: 'curl', upside: true, complaint: 'table', tv: 'stuck', tusk: true, confetti: 'burst', screen: keynotePlate}, {
        floor: (bb) => { drawHarasRoom(bb, 420, 186, {state: 'walk', legs: 'w1'}); drawCalcTape(bb, [[426, 160], [446, 176], [470, 180], [480, 181]]); },
      });
    }},
    {label: 'sc 20, JUN 11 (morning): the complaint hauled up on its rope, the clean rectangle, the confetti swept, Mas peeling his flyer', draw: (b) => {
      drawLobby2(b, {f: 0, time: 'morning', sign1: '203', sign2: '103', flyers: 'peeled', upside: true, complaint: 'rope', ropeY: 30, confetti: 'pile', beanbags: false}, {
        back: (bb) => { drawMasStand2(bb, 142, 152, {arm: 'tape'}); },
      });
    }},
    {label: 'inserts: page one (all !) · the contents · the docket tab (20.08) · the sign from below with the spare 0 (1.12) · the flyer on the complaint (1.13)', draw: (b) => {
      const tiles: Array<(t: Buf) => void> = [(t) => complaintPageECU(t, 0), (t) => complaintPageECU(t, 1), (t) => docketECU(t), (t) => signFromBelow(t, 0), (t) => flyerECU(t, {}), (t) => complaintPageECU(t, 2, true)];
      tiles.forEach((fn, i) => { const t = new Buf(480, 270, PAL.N0); fn(t); const ox = (i % 3) * 160, oy = Math.floor(i / 3) * 101; for (let y = 0; y < 101; y++) for (let x = 0; x < 160; x++) b.set(ox + x, oy + y, t.c[Math.min(202, y * 2) * 480 + x * 3]); });
    }},
  ],
}];
void rect; void line; void drawGergStand; void drawOrb; void drawComplaint; void LOBBY2; void pw;
