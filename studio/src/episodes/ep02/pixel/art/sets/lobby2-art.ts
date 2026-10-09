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
import {fill, pt, pw, bpt, bpw, vramp, tiny, dith, TR} from '../kit';
import {drawLobby2, drawSignBoard, drawFlyer, drawComplaint, LOBBY2} from './lobby2';
import {drawMammoth, mammothPrint, meltChair} from '../creatures';
import {drawSelbeepRoom, drawDirectorsChair} from '../cast/selbeep';
import {drawDotLadder, dotPlateOut} from '../cast/dot';
import {drawHarasRoom, drawCalcTape} from '../cast/haras';
import {drawMasStand2} from '../cast/mas2';
import {keynotePainter} from './elppa';
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
/** [LOW] -> [MCU] sc 1.12: the sign seen from below: drawn flat at a large size (its words filling its board), then
 *  keystoned (the near, lower edge wider than the far top edge) the way a sign looks overhead; DOT's real hand from
 *  the ladder at frame right holding the spare 0 plate out; then the second sign hung under it */
export const signFromBelow = (b: Buf, k: number, o: {second?: boolean} = {}) => {
  vramp(b, 0, 0, 480, 203, [PAL.G2, PAL.G3, PAL.G4]);
  for (let y = 0; y < 203; y += 12) fill(b, 0, y, 480, 1, PAL.G2);
  // the flat sign, big: four lines of the big face filling its board, the number plate as tall as two of them
  // the flat sign sized to its words (no empty board), the plate sized to its number; the keystone then enlarges it
  const LINES = ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'];
  const tw = Math.max(...LINES.map((l) => bpw(l))), FW = tw + 24 + bpw('100') + 28, FH = 4 * 20 + 16;
  const F = new Buf(FW, FH, TR);
  fill(F, 0, 0, FW, FH, PAL.G3); fill(F, 0, 0, FW, 2, PAL.G5); fill(F, 0, FH - 2, FW, 2, PAL.N1);
  fill(F, 4, 4, tw + 16, FH - 8, PAL.P1); fill(F, 4, 4, tw + 16, 3, PAL.L2);
  LINES.forEach((l, i) => bpt(F, l, 12, 12 + i * 20, PAL.N1));
  const px0 = tw + 24, pwd = bpw('100') + 20;
  fill(F, px0, 22, pwd, 52, PAL.N0); fill(F, px0 + 3, 25, pwd - 6, 46, PAL.P2);
  bpt(F, '100', px0 + 10, 41, PAL.R2);
  // keystone: from below, the top edge recedes (narrower and shorter rows near the top)
  const top = 4, bot = 160, cx = 240;
  for (let y = top; y < bot; y++) {
    const v = (y - top) / (bot - top), sv = Math.pow(v, 0.8), half = 150 + 40 * v;
    const srcY = Math.min(FH - 1, Math.floor(sv * FH));
    for (let x = Math.round(cx - half); x < cx + half; x++) { const u = (x - (cx - half)) / (2 * half), c = F.c[srcY * FW + Math.min(FW - 1, Math.floor(u * FW))]; if (c !== TR) b.set(x, y, c); }
  }
  // the hanging wires, up out of frame
  line(cx - 120, 0, cx - 128, top + 2, b.ink(PAL.G5)); line(cx + 120, 0, cx + 128, top + 2, b.ink(PAL.G5));
  if (o.second) drawSignBoard(b, 150, 166, 330, 200, ['DAYS SINCE', 'SOMEONE', 'SUED MAS:'], '0', {small: true});
  else dotPlateOut(b, 412, 168 + (k % 2), 2);
};
/** [ECU] sc 1.13 / 13.03: the flyer AT FRAME SCALE (it fills most of the frame): the headline, the doorway photo
 *  legible (the frame, the half-open door's light, a figure half cut off by the jamb), the tape on its corners, its
 *  lower corner curling off the surface it's taped to (the complaint's page, or a rack pillar) */
export const flyerECU = (b: Buf, o: {upside?: boolean; on?: 'complaint' | 'pillar'} = {}) => {
  if (o.on === 'pillar') { fill(b, 0, 0, 480, 203, PAL.N1); for (let y = 6; y < 203; y += 12) { fill(b, 0, y, 480, 1, PAL.N0); for (let x = 20; x < 480; x += 40) b.set(x, y + 4, (x + y) % 3 ? PAL.C6 : PAL.L3); } }
  // on the complaint: its own page around the flyer (the caption's rule, ET AL., the red YOU PROMISED and its !!)
  else { pageBg(b, PAL.P1); bpt(b, 'ET AL.', 22, 14, PAL.N1); fill(b, 18, 34, 136, 2, PAL.N1); bpt(b, 'YOU', 22, 112, PAL.R2); bpt(b, 'PROMISED', 22, 134, PAL.R2); bpt(b, '!!', 336, 134, PAL.R2); fill(b, 330, 34, 140, 2, PAL.N1); }
  const W = 150, H = 196, x0 = 165, y0 = 4;
  const F = new Buf(W, H, TR);
  fill(F, 0, 0, W, H, PAL.P2); fill(F, W - 2, 0, 2, H, PAL.P1); fill(F, 0, H - 2, W, 2, PAL.P1);
  const h1 = 'WHERE IS', h2 = 'ALYI?';
  bpt(F, h1, Math.round((W - bpw(h1)) / 2), 10, PAL.N1); bpt(F, h2, Math.round((W - bpw(h2)) / 2), 30, PAL.N1);
  // the photo: a dark corridor, a door frame, the door half open on a lit room, a figure in the light, its near side cut
  // off by the jamb (his frame rule); a caption line under it
  const px = 12, py = 54, pwd = W - 24, ph = 100;
  fill(F, px, py, pwd, ph, PAL.G2); fill(F, px, py, pwd, 2, PAL.G1);
  fill(F, px + 34, py + 10, 60, ph - 10, PAL.N1);
  fill(F, px + 40, py + 14, 48, ph - 14, PAL.W4); fill(F, px + 60, py + 14, 28, ph - 14, PAL.W6);
  // the figure in the doorway: a head and shoulders, a silhouette against the light, cut by the jamb at its left
  for (let j = 0; j < 60; j++) for (let i = 0; i < 26; i++) { const head = Math.hypot((i - 15) / 6, (j - 9) / 7.5) < 1, body = j > 16 && Math.abs(i - 14) < 5 + Math.min(8, (j - 16) * 0.6); if (head || body) F.set(px + 44 + i, py + 26 + j, PAL.N2); }
  fill(F, px + 34, py + 10, 10, ph - 10, PAL.D2); fill(F, px + 42, py + 10, 2, ph - 10, PAL.D3);
  fill(F, px + 88, py + 14, 8, ph - 14, PAL.D2);
  for (let r = 0; r < 2; r++) fill(F, 16, py + ph + 8 + r * 8, W - 40 - r * 30, 3, PAL.G5);
  // tape on its corners
  for (const [tx, ty] of [[0, 0], [W - 16, 0], [0, H - 12], [W - 16, H - 12]]) for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) F.set(tx + i, ty + j, (i + j) % 5 ? PAL.G6 : PAL.P1);
  // the curl: the lower-right corner lifting off, its back showing (darker), its shadow on the surface
  const cl = 26;
  for (let i = 0; i < cl; i++) for (let j = 0; j <= i; j++) F.set(W - 1 - j, H - cl + i, TR);
  const put = (dx: number, dy: number, c: number) => { if (b.get(x0 + dx, y0 + dy) !== undefined) b.set(x0 + dx, y0 + dy, c); };
  // the flyer's shadow on the surface (a rung down, offset), then the flyer (upside down if it's his)
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = F.c[(o.upside ? H - 1 - j : j) * W + (o.upside ? W - 1 - i : i)]; if (v !== TR) { const X = x0 + i + 3, Y = y0 + j + 3; if (Y < 203) b.set(X, Y, PAL.G3 === b.get(X, Y) ? PAL.G2 : PAL.P0); } }
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = F.c[(o.upside ? H - 1 - j : j) * W + (o.upside ? W - 1 - i : i)]; if (v !== TR && y0 + j < 203) b.set(x0 + i, y0 + j, v); }
  // the curled corner's back (a folded triangle, the paper's reverse a rung down)
  const cx0 = o.upside ? x0 : x0 + W - cl, cy0 = o.upside ? y0 : y0 + H - cl;
  for (let i = 0; i < cl; i++) for (let j = 0; j < cl - i; j++) { const X = o.upside ? cx0 + cl - 1 - i : cx0 + i, Y = o.upside ? cy0 + cl - 1 - j : cy0 + j; if (Y < 203 && j >= cl - i - 3) put(X - x0, Y - y0, PAL.P0); else if (Y < 203 && i + j > cl - 2) put(X - x0, Y - y0, PAL.P1); }
};

// ------------------------------------------------------------------ the stills
/** the 2.A leap's programmatic filler (art/aros/aros_mammoth.py): the tools hand in its frames, box-averaged to the
 *  screen's native size for the contact-sheet previews (the 1080p composites in tools/aros-comp.ts keep them whole) */
let arosSource: (frame: number, w: number, h: number) => Uint32Array | null = () => null;
export const setArosFrames = (src: typeof arosSource) => { arosSource = src; };
export const arosPlate = (b: Buf, r: {x: number; y: number; w: number; h: number}, frame = 20) => {
  const fr = arosSource(frame, r.w, r.h);
  if (fr) { for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) b.set(r.x + i, r.y + j, fr[j * r.w + i]); return; }
  // without the filler's frames: a flat stand-in of the snowy meadow and the pixel mammoth
  vramp(b, r.x, r.y, r.w, Math.round(r.h * 0.55), [PAL.N6, PAL.N7, PAL.N8, PAL.G6]);
  vramp(b, r.x, r.y + Math.round(r.h * 0.55), r.w, r.h - Math.round(r.h * 0.55), [PAL.P1, PAL.P2, PAL.W9]);
  for (let i = 0; i < 9; i++) dith(b, r.x + 6 + i * 11, r.y + 40 + (i % 3) * 2, 6, 14, 0.5, PAL.N5);
  drawMammoth(b, r.x + 30, r.y + r.h - 6, 0, {clip: (x, y) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h});
};
const keynotePlate = (b: Buf, r: {x: number; y: number; w: number; h: number}) => {
  // ELPPA's keynote on the wall screen: its own stage picture (sets/elppa.ts: the white stage, the presenter's
  // silhouette), its slide's line across the top
  keynotePainter(b, r, {slide: 'stage'});
  const s = '...AND LATER THIS YEAR:'; tiny(b, s, r.x + 6, r.y + 6, PAL.N1); tiny(b, 'CHATGTP.', r.x + 6, r.y + 14, PAL.N1);
};
export const ART: ArtAsset[] = [{
  id: 'set01-lobby', manifest: 'SET-01 · the NopeAI lobby master', kind: 'set', name: 'The NopeAI lobby, side-on (the Ep2 master)',
  file: 'sets/lobby2.ts (+ sets/lobby2-art.ts)', exports: 'drawLobby2, LOBBY2, drawSignBoard, drawFlyer, drawComplaint, drawHandTruck, drawCleanRect, drawConfetti, drawPresserSmall', scenes: '1, 13, 19, 20',
  note: 'Ep1\'s narthex from the side: Mas\'s counter under the signs (back left), the desk, the wall screen (right), the doors far right; beanbag rows',
  stills: [
    {label: 'sc 1, FEB 15: AROS on the wall screen (the 2.A filler in the bezel: the near-photoreal mammoth, previewed here box-averaged), the staff on beanbags, Mas at his counter, SELBEEP and his director\'s chair', draw: (b) => {
      drawLobby2(b, {f: 0, sign1: '86', screen: arosPlate}, {
        back: (bb) => { drawMasStand(bb, 28, 152, {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}); drawDirectorsChair(bb, 404, 168); },
        front: (bb) => { drawSelbeepRoom(bb, 330, 196, {arm: 'present', mouth: 'open'}); },
      });
    }},
    {label: 'sc 1, FEB 29: the mammoth out on the carpet (its prints), the chair melted, the hand truck at the doors, DOT up the ladder, PAUSE through the door', draw: (b) => {
      // (DOT's ladder beside the new sign, never in front of its 0)
      drawLobby2(b, {f: 6, sign1: '100', sign2: '0', complaint: 'truck', truckX: 400, door: 2}, {
        back: (bb) => { drawMasStand(bb, 28, 152, {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}); drawDotLadder(bb, 160, 150, 'grip', 1); },
        floor: (bb) => { for (const [px, py] of [[300, 186], [270, 182], [240, 186]] as Array<[number, number]>) mammothPrint(bb, px, py); meltChair(bb, 196, 192, 3); drawMammoth(bb, 150, 196, 9); },
      });
    }},
    {label: 'sc 13, MAY 15: February\'s flyers curling, Mas\'s taped back upside down, the complaint a side table (cups), the corner TV\'s presser', draw: (b) => {
      drawLobby2(b, {f: 0, sign1: '176', sign2: '76', flyers: 'curl', upside: true, complaint: 'table', tv: 'presser', beanbags: false}, {
        back: (bb) => { drawMasStand2(bb, 186, 152, {arm: 'tape'}, {flip: true}); },
      });
    }},
    {label: 'sc 19, JUN 10: the watch party: ELPPA\'s keynote on the wall screen, signs 202 / 102, the tusk behind the back row, the confetti cannon', draw: (b) => {
      drawLobby2(b, {f: 4, sign1: '202', sign2: '102', flyers: 'curl', upside: true, complaint: 'table', tv: 'stuck', tusk: true, confetti: 'burst', screen: keynotePlate}, {
        floor: (bb) => { drawHarasRoom(bb, 420, 186, {state: 'walk', legs: 'w1'}); drawCalcTape(bb, [[426, 160], [446, 176], [470, 180], [480, 181]]); },
      });
    }},
    {label: 'sc 20, JUN 11 (morning): the complaint hauled up on its rope, the clean rectangle, the confetti swept, Mas peeling his flyer', draw: (b) => {
      drawLobby2(b, {f: 0, time: 'morning', sign1: '203', sign2: '103', flyers: 'peeled', upside: true, complaint: 'rope', ropeY: 112, confetti: 'pile', beanbags: false}, {
        back: (bb) => { drawMasStand2(bb, 186, 152, {arm: 'tape'}, {flip: true}); },
      });
    }},
    {label: '[ECU] 1.10 the complaint\'s page one, all exclamation points', draw: (b) => complaintPageECU(b, 0)},
    {label: '[ECU] 1.10 the contents', draw: (b) => complaintPageECU(b, 1)},
    {label: '[ECU] 20.08 the docket tab: HEARING · JUN 12 · MOTION TO DISMISS', draw: (b) => docketECU(b)},
    {label: '[LOW] 1.12 the sign from below, DOT\'s hand holding the spare 0 out', draw: (b) => signFromBelow(b, 0)},
    {label: '[LOW] 1.12 the second sign hung under it: DAYS SINCE SOMEONE SUED MAS: 0', draw: (b) => signFromBelow(b, 0, {second: true})},
    {label: '[ECU] 1.13 the flyer on the complaint: WHERE IS ALYI?, the doorway photo, the tape, the curl', draw: (b) => flyerECU(b, {})},
    {label: '[ECU] 13.03 Mas\'s flyer on the pillar, taped back upside down', draw: (b) => flyerECU(b, {on: 'pillar', upside: true})},
    {label: '[ECU] 23.02 the refiled complaint\'s page three', draw: (b) => complaintPageECU(b, 2, true)},
  ],
}];
void rect; void line; void drawGergStand; void drawOrb; void drawComplaint; void LOBBY2; void pw;
